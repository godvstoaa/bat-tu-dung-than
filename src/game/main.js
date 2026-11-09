// ============================================================================
//  HUYỀN QUÁN — lõi game: cổng, vòng lặp, điều khiển (phím, chạm, joystick ảo),
//  HUD, bảng. Gọi qua mount.js sau khi markup đã chèn vào DOM.
//  Spec: docs/GAME-HUYEN-QUAN-SPEC.md · Kế hoạch: docs/GAME-MMO-PROMPT-PLAN.md
// ============================================================================
import { record } from './perf.js';
import * as S from './state.js';
import { STATIONS, START, findPath, stationAt, nearestStation, blockedAt, stationById } from './world.js';
import { createRenderer, clientToTile, nightLevel as nightLevelOf, ROBE } from './render.js';
import { STATION_OPEN, openBook, todayInfo, esc, chartOf } from './stations.js';
import { randomName } from './names.js';
import { setSound, bell } from './audio.js';
import { TEXT } from './features.js';
import { buzz, lockPortrait } from './haptics.js';
import { createNet } from './net.js';
import { makeNpc } from './npc.js';
// [G2 — NPC-AI] chuyện riêng của khách hỏi việc (docs/npc-ai/08) — thuần theo
// hạt giống, không AI, không mạng; story chỉ hiện trong panel của chủ mở án
// (mục 13 Quyết 3), không bao giờ vào payload mạng (mv/cos giữ nguyên).
import { makeStory } from './story-gen.js';
import { unlocked, unlockedList, newlyUnlocked, levelInfo, WX_GIATRI, vipActive } from './progress.js';
import * as C from './cosmetics.js';
import { wardrobeBody } from './wardrobe-ui.js';
import { REGIONS } from './terrain.js';
const REGION_NAME = Object.fromEntries(REGIONS.map((r) => [r.id, r.name]));
import { EMOTES, PHRASES, SEATS, REPORT_REASONS } from './protocol.js';

const SPEED = 3.5; // ô/giây
const WX_NAMES = { 木: 'Mộc', 火: 'Hỏa', 土: 'Thổ', 金: 'Kim', 水: 'Thủy' };
const WX_CLS = { 木: 'moc', 火: 'hoa', 土: 'tho', 金: 'kim', 水: 'thuy' };
const ICON = { thay: '📜', compass: '🧭', xam: '🎋', huong: '🕯', lich: '📅', tra: '🍵', sen: '🪷', an0: '❓', an1: '❓', an2: '❓', trach: '🗓', duongtrach: '🧭', dieuhau: '🌡', thuvien: '📚', hophon: '💞', tuvi: '✨', tuongphap: '👁', cachcuc: '🏯', vanbia: '🪨', thaitue: '🪔', tangy: '👘', ...Object.fromEntries(Array.from({ length: 9 }, (_, i) => [`van${i}`, '⛩'])) };

export function startGame({ onExit = null } = {}) {
  const storage = window.localStorage;
  const state = S.loadState(storage);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (id) => document.getElementById(id);
  let canvas = $('hq-canvas');
  let renderer = null; // 3D (Three.js) nếu có WebGL, không thì 2D pixel — spec 9.7
  let paused = false;

  const player = { x: START.x, y: START.y, face: 'up', moving: false, sitting: false, path: [], pending: null, name: '', robe: '土', gold: false, flying: false, alt: 0 };
  const altCtl = { up: false, down: false };
  let target = null;
  let teaColor = null;
  let dayGanZhi = '';
  let lunarText = '';
  let lastTitle = S.titleFor(state.phucKhi).name;
  let selfBubble = null;
  let masterBubble = null; // Thầy đang luận (AI) — bong bóng trên đầu thầy
  let selfEmote = null;

  // Khách hỏi việc hôm nay: hạt giống = ngày · khe · người chơi → mỗi người một bộ khách riêng
  let npcDay = '', npcs = [];
  function todayNpc(slot) {
    const d = S.todayStr();
    if (d !== npcDay) {
      let pid = 'local';
      try { pid = localStorage.getItem('huyenquan:pid') || 'local'; } catch (e) { /* ignore */ }
      // [G2 — NPC-AI] chuyện riêng từng khách (mục 08 §8.4): gọi makeStory với
      // ĐÚNG hạt hôm nay `${d}:${i}:${pid}` — same-seed (§8.6.2): cùng ngày +
      // cùng pid + cùng khe ⇒ nguyên văn cùng chuyện, kể cả khi AI tắt/mất
      // mạng. R = lá số khách dựng bằng chartOf (cache theo năm sẵn có);
      // story đính kèm npc — consumer chỉ là panel án (stations.js
      // openCaseSlot), không field nào rời máy (mục 13 Quyết 3).
      npcs = [0, 1, 2].map((i) => {
        const seed = `${d}:${i}:${pid}`;
        const npc = makeNpc(seed);
        try {
          const R = chartOf({ year: npc.year, month: npc.month, day: npc.day, hour: npc.hour, minute: npc.minute, gender: npc.gender });
          npc.story = makeStory(seed, R, `an${i}`, pid, npc, new Date().getFullYear());
        } catch (e) { /* lá số không dựng được → khách vẫn đứng chờ như cũ, không có chuyện riêng */ }
        return npc;
      });
      npcDay = d;
    }
    return npcs[slot];
  }

  // -------------------------------------------------------------------------
  // Mạng (MMO) — offline-first: mất mạng vẫn chơi đơn bình thường
  // -------------------------------------------------------------------------
  const net = createNet({
    profile: () => ({ name: state.player?.name || 'Khách', robe: state.player?.robe || '土', accent: state.player?.accent || '', cos: C.encodeCos(C.wardrobe(state).equipped), look: state.player?.look || 'hero_m', title: S.titleFor(state.phucKhi).name }),
    onEvent(ev) {
      if (ev.t === 'status' || ev.t === 'count') updateOnline();
      else if (ev.t === 'emo' && ev.toMe && !ev.self) { toast(`${ev.name || 'Một khách'} ${EMOTES[ev.e].text} bạn ${EMOTES[ev.e].icon}`); buzz('light'); }
      else if (ev.t === 'renamed') toast(`Tên này không dùng được trong phòng chung — tạm hiển thị «${ev.name}». Đổi tên trong ${TEXT.book} › Cài đặt.`);
      else if (ev.t === 'reported') toast('Đã gửi báo cáo. Cảm ơn bạn giữ quán yên tĩnh.');
    },
  });
  function updateOnline() {
    const el = $('hq-online');
    const on = net.status === 'online';
    el.classList.toggle('off', !on);
    el.textContent = on ? `👥 ${net.count}` : (net.status === 'connecting' ? 'Đang kết nối…' : 'Ngoại tuyến');
    el.title = on ? `${net.count} người trong phòng ${net.room + 1}` : 'Chơi đơn — sẽ tự kết nối lại';
  }

  // -------------------------------------------------------------------------
  // Bảng (bottom sheet) — dọn dẹp gắn trên node nội dung: mở bảng mới tự dọn bảng cũ.
  // -------------------------------------------------------------------------
  const panelEl = $('hq-panel');
  const panelTitle = $('hq-panel-title');
  const panelBody = $('hq-panel-body');

  function cleanupBody() {
    const old = panelBody.firstElementChild;
    if (old && old._hqCleanups) { for (const fn of old._hqCleanups) { try { fn(); } catch (e) { console.error(e); } } old._hqCleanups = null; }
  }

  const panel = {
    get isOpen() { return !panelEl.hidden; },
    open({ title, body }) {
      cleanupBody();
      panelTitle.textContent = title;
      panelBody.replaceChildren(body);
      panelBody.scrollTop = 0;
      panelEl.classList.remove('peek', 'full');
      panelEl.hidden = false;
      // trên cảm ứng không tự focus ô nhập (tránh bật bàn phím che sheet)
      const coarse = matchMedia('(pointer: coarse)').matches;
      const focusable = (!coarse && body.querySelector('input:not([type=hidden]),select,textarea,button,a[href]')) || $('hq-panel-close');
      focusable.focus({ preventScroll: true });
    },
    close() {
      if (panelEl.hidden) return;
      cleanupBody();
      panelEl.hidden = true;
      panelEl.classList.remove('peek', 'full');
      panelBody.replaceChildren();
      canvas.focus({ preventScroll: true });
    },
  };
  $('hq-panel-close').onclick = () => panel.close();
  panelEl.addEventListener('pointerdown', (e) => { if (e.target === panelEl && !panelEl.classList.contains('peek')) panel.close(); });
  // chạm thanh kéo → bung sheet cao/thấp
  panelEl.querySelector('.hq-grab').addEventListener('click', () => panelEl.classList.toggle('full'));

  // -------------------------------------------------------------------------
  // Toast + HUD
  // -------------------------------------------------------------------------
  function toast(text) {
    const t = document.createElement('div');
    t.className = 'hq-toast';
    t.textContent = text;
    const box = $('hq-toasts');
    while (box.children.length >= 2) box.firstElementChild.remove(); // tối đa 2 thông báo cùng lúc
    box.appendChild(t);
    setTimeout(() => t.classList.add('out'), 2700);
    setTimeout(() => t.remove(), 3200);
  }

  function save() { S.saveState(state, storage); }
  // trang bị đang hiển thị = đồ đang mặc + món đang thử (20 giây)
  let cosPreview = null;
  function cosNow() {
    const eq = { ...C.wardrobe(state).equipped };
    if (cosPreview) { if (performance.now() < cosPreview.until) eq[cosPreview.slot] = cosPreview.id; else cosPreview = null; }
    return eq;
  }

  function updateHud() {
    const t = S.titleFor(state.phucKhi);
    player.name = state.player?.name || '';
    player.robe = state.player?.robe || '土';
    player.gold = state.phucKhi >= 500;
    player.look = state.player?.look || 'hero_m';
    player.accent = state.player?.accent || '';
    $('hq-who').textContent = `${player.name} · ${t.name} · Cấp ${levelInfo(state).level}`;
    if (lastXp == null) lastXp = state.xp || 0;
    const canFly = unlocked(state, 'fly');
    $('hq-fly').hidden = !canFly;
    if (!canFly && player.flying) setFlying(false);
    $('hq-phuc').textContent = `✦ ${state.phucKhi}`;
    // Tàng Y Các: Ngọc, quà lên cấp, Ngọc VIP mỗi ngày, chấm đỏ khi chưa điểm danh
    const W = C.wardrobe(state);
    const gift = C.levelGifts(state, levelInfo(state).level); if (gift) toast(`🎁 Quà lên cấp · +${gift} Ngọc`);
    const vd = C.vipDaily(state, vipActive(state)); if (vd) toast(`👑 Chân Nhân · +${vd} Ngọc hôm nay`);
    W.bonus = C.setBonus(state, state.player?.yong?.primary).bonus;
    $('hq-ngoc').textContent = `💎 ${W.ngoc}`;
    $('hq-wardrobe').classList.toggle('dot', !C.checkedIn(state));
    $('hq-streak').textContent = `🔥 ${S.currentStreak(state)}`;
    const done = S.tasks(state).filter((x) => x.done).length;
    $('hq-tasks-btn').innerHTML = `<b aria-hidden="true">📋</b><span>${done}/3 việc</span>`;
    $('hq-sound').textContent = state.settings.sound ? '🔈' : '🔇';
    $('hq-sound').setAttribute('aria-label', state.settings.sound ? 'Tắt âm thanh' : 'Bật âm thanh');
  }

  // Sau mọi hành động: thưởng, nhiệm vụ, thành tựu, danh xưng, lưu.
  let lastXp = null;
  function after(gained = 0, why = '') {
    if (gained > 0) toast(`+${gained} ${TEXT.point} · ${why}`);
    // lên cấp → báo gia trì nguyên tố vừa mở (progress.js)
    if (lastXp != null) for (const g of newlyUnlocked(lastXp, state.xp || 0)) { toast(`✨ Cấp ${levelInfo(state).level} · mở ${g.name} (${WX_GIATRI[state.player?.robe]?.name || ''})`); buzz('heavy'); }
    lastXp = state.xp || 0;
    const bonus = S.settleTasks(state);
    if (bonus) { toast(`Xong 3 việc hôm nay · +${bonus} · chuỗi ${S.currentStreak(state)} ngày`); bell(660, 0.1); buzz('medium'); }
    for (const a of S.evaluateAchievements(state)) toast(`🏮 Thành tựu: ${a.name}`);
    const t = S.titleFor(state.phucKhi).name;
    if (t !== lastTitle) { toast(`Danh xưng mới: ${t}`); lastTitle = t; buzz('heavy'); }
    save();
    updateHud();
  }

  // -------------------------------------------------------------------------
  // API cho các gian
  // -------------------------------------------------------------------------
  const TEA_SEAT = SEATS[1];
  let preSit = null;
  let pendingSeat = false; // chống re-entry: một lời xin chỗ đang chờ máy chủ

  const api = {
    state,
    masterSay(text) { masterBubble = { text: text === '…' ? 'Thầy đang luận…' : text, until: performance.now() + (text === '…' ? 60000 : 6000) }; },
    panel,
    reduced,
    toast,
    after,
    onClose(body, fn) { (body._hqCleanups ||= []).push(fn); },
    // Thu bảng thành thẻ nhỏ dưới đáy để nhìn thấy cảnh (ngồi trà, lò cháy).
    peek(on) { panelEl.classList.toggle('peek', !!on); },
    goTo(id) { panel.close(); walkToStation(stationById(id)); },
    // Ngồi bồ đoàn: online thì máy chủ cấp chỗ (mỗi chỗ một người). Trả false nếu kín chỗ.
    async setSitting(on) {
      if (on && pendingSeat) return false; // chưa xong lời xin trước → bỏ qua lần gọi chồng
      if (on && !player.sitting) {
        pendingSeat = true; // đặt TRƯỚC await — cả khi await ném lỗi vẫn được clear ở finally
        try {
          const i = await net.requestSeat();
          if (i < 0) { toast('Hết chỗ ngồi'); return false; } // kín chỗ → không dời người vào ghế
          const seat = SEATS[i] || TEA_SEAT;
          preSit = { x: player.x, y: player.y }; player.x = seat.x; player.y = seat.y; player.path = [];
        } finally {
          pendingSeat = false;
        }
      }
      if (!on && player.sitting) { net.stand(); if (preSit) { player.x = preSit.x; player.y = preSit.y; } }
      player.sitting = on;
      return true;
    },
    setTeaColor(c) { teaColor = c; },
    vip: () => vipActive(state),
    level: () => levelInfo(state).level,
    yong: () => state.player?.yong?.primary || null,
    previewCos(slot, id) { cosPreview = { slot, id, until: performance.now() + 20000 }; },
    cosChanged() { cosPreview = null; net.setCos(C.encodeCos(C.wardrobe(state).equipped)); save(); updateHud(); },
    refreshRooms: () => syncRooms(),
    celebrate(wx) { renderer?.celebrate?.(wx); },
    todayNpc,
    wipe() { try { storage.removeItem(S.KEY); } catch (e) { /* ignore */ } location.reload(); },
  };

  // Vận Mệnh Các / Thái Tuế Điện: khắc biển cổng, bia, bài vị theo lá số + đèn dầu (web)
  function syncRooms() {
    if (import.meta.env.MODE === 'ios' || !renderer?.setRoomData) return;
    import('./vanmenh-ui.js').then((m) => renderer.setRoomData(m.roomData(state))).catch((e) => console.warn('[rooms]', e));
  }

  function openStation(id) {
    const st = stationById(id);
    if (!st) return;
    // cửa điện / lối ra: chuyển cảnh vào – ra (không mở bảng)
    if (st.kind === 'door' || st.kind === 'exit') { enterRoom(st); return; }
    const title = st.kind === 'case' ? `Án của ${todayNpc(st.slot).call}` : st.name;
    S.rollDay(state);
    S.visitStation(state, id);
    let body;
    try {
      body = STATION_OPEN[id](api);
    } catch (e) {
      console.error(e);
      body = document.createElement('p');
      body.textContent = 'Gian này đang có chút trục trặc, khách thử lại sau nhé.';
    }
    buzz('light');
    panel.open({ title, body });
    after(0);
  }

  // -------------------------------------------------------------------------
  // Di chuyển: phím, joystick ảo, chạm-để-đi
  // -------------------------------------------------------------------------
  function walkTo(pt, stationId = null) {
    if (player.sitting) return;
    player.path = findPath(player, pt);
    player.replanned = false;
    player.pending = stationId;
    target = player.path.length ? player.path[player.path.length - 1] : null;
    if (!player.path.length && stationId && nearestStation(player)?.id === stationId) openStation(stationId);
  }

  function walkToStation(st) { if (st) walkTo(st.spot, st.id); }

  function enterRoom(st) {
    if (player.flying) setFlying(false);
    const ov = document.createElement('div');
    ov.className = 'hq-travel';
    ov.innerHTML = `<div><b>${st.kind === 'door' ? '⛩ Bước vào' : '⛩ Ra khỏi'} ${esc(st.name)}</b><span>${st.kind === 'door' ? 'Khói trầm thoang thoảng, nến lung linh…' : 'Trở lại ngoài trời'}</span></div>`;
    ($('hq-canvas')?.closest('.hq-root') || document.body).appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('on'));
    setTimeout(() => { player.x = st.to.x; player.y = st.to.y; player.path = []; target = null; player.face = 'up'; net.tp(st.to.x, st.to.y); }, 500);
    setTimeout(() => ov.classList.remove('on'), 1000);
    setTimeout(() => ov.remove(), 1600);
    buzz('light');
  }

  function teleportTo(st) {
    if (player.sitting) return;
    if (player.flying && st.room) setFlying(false);
    const go = () => { player.x = st.spot.x; player.y = st.spot.y; player.path = []; target = null; player.face = 'up'; net.tp(st.spot.x, st.spot.y); };
    // sảnh nghề ngoài thế giới: đi trạm (xe ngựa / đò) — màn chuyển ngắn rồi mới mở án
    if (st.world && !reduced) {
      const ov = document.createElement('div');
      ov.className = 'hq-travel';
      ov.innerHTML = `<div><b>${st.region === 'cungthong' ? '⛵ Đò sang' : '🐎 Xe ngựa tới'} ${esc(st.name)}</b><span>${esc(REGION_NAME[st.region] || '')}</span></div>`;
      ($('hq-canvas')?.closest('.hq-root') || document.body).appendChild(ov);
      requestAnimationFrame(() => ov.classList.add('on'));
      setTimeout(go, 650);
      setTimeout(() => { ov.classList.remove('on'); openStation(st.id); }, 1300);
      setTimeout(() => ov.remove(), 1900);
      return;
    }
    go();
    openStation(st.id);
  }

  const keys = new Set();
  // ---- ngự kiếm phi hành (mở ở cấp 8 hoặc VIP — progress.js)
  function setFlying(on) {
    if (on && !unlocked(state, 'fly')) { toast(`Ngự kiếm mở ở cấp 8 (hiện cấp ${levelInfo(state).level}) hoặc VIP.`); return; }
    if (player.sitting) return;
    player.flying = on;
    player.alt = on ? Math.max(player.alt, 18) : 0;
    player.path = []; target = null;
    $('hq-altpad').hidden = !on;
    $('hq-fly').classList.toggle('on', on);
    toast(on ? '🗡️ Ngự kiếm · kéo cần để bay, ▲▼ đổi độ cao' : 'Hạ kiếm, đáp đất.');
    buzz('medium');
  }
  $('hq-fly').onclick = () => setFlying(!player.flying);
  for (const b of document.querySelectorAll('#hq-altpad [data-alt]')) {
    const k = b.dataset.alt;
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); altCtl[k] = true; });
    for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) b.addEventListener(ev, () => { altCtl[k] = false; });
  }

  const KEYMAP = { ArrowUp: 'u', KeyW: 'u', ArrowDown: 'd', KeyS: 'd', ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r' };
  const stick = { x: 0, y: 0 };

  function typing(e) {
    const tg = e.target;
    return tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.tagName === 'SELECT' || tg.isContentEditable);
  }

  function onKeyDown(e) {
    if (paused) return;
    if (e.key === 'Escape') { if (panel.isOpen) panel.close(); return; }
    if (panel.isOpen || !$('hq-gate').hidden || typing(e)) return;
    if (e.code === 'KeyF') { setFlying(!player.flying); e.preventDefault(); return; }
    if (player.flying && (e.code === 'Space' || e.code === 'KeyC')) { altCtl[e.code === 'Space' ? 'up' : 'down'] = true; e.preventDefault(); return; }
    if (KEYMAP[e.code]) { keys.add(KEYMAP[e.code]); player.path = []; target = null; e.preventDefault(); return; }
    if (e.code === 'KeyQ' || e.code === 'KeyR') { renderer?.rotate?.(e.code === 'KeyQ' ? Math.PI / 4 : -Math.PI / 4); return; }
    if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') {
      // Space/Enter trên nút HUD phải bấm nút đó, chỉ E mở gian bất kể focus.
      const onScene = document.activeElement === canvas || document.activeElement === document.body;
      const st = nearestStation(player);
      if (st && !player.sitting && (e.code === 'KeyE' || onScene)) { e.preventDefault(); openStation(st.id); }
    }
  }
  const onKeyUp = (e) => { if (e.code === 'Space') altCtl.up = false; if (e.code === 'KeyC') altCtl.down = false; if (KEYMAP[e.code]) keys.delete(KEYMAP[e.code]); };
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  // mất focus → thả mọi phím đang giữ (kể cả độ cao khi bay) và cent joystick về 0, không trôi người
  window.addEventListener('blur', () => {
    keys.clear();
    altCtl.up = altCtl.down = false;
    stick.x = stick.y = 0;
    knob.style.transform = '';
  });

  // Joystick ảo (chỉ hiện trên màn cảm ứng — CSS). Kéo trong bán kính 46px.
  const stickEl = $('hq-stick');
  const knob = stickEl.querySelector('.hq-stick-knob');
  let stickId = null, stickC = null;
  const R_STICK = 46;
  stickEl.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    stickId = e.pointerId;
    try { stickEl.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    const r = stickEl.getBoundingClientRect();
    stickC = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    player.path = []; target = null;
    moveStick(e);
  });
  function moveStick(e) {
    if (e.pointerId !== stickId) return;
    let dx = e.clientX - stickC.x, dy = e.clientY - stickC.y;
    const d = Math.hypot(dx, dy);
    if (d > R_STICK) { dx = (dx / d) * R_STICK; dy = (dy / d) * R_STICK; }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    stick.x = dx / R_STICK; stick.y = dy / R_STICK;
  }
  stickEl.addEventListener('pointermove', moveStick);
  const endStick = (e) => { if (e.pointerId !== stickId) return; stickId = null; stick.x = stick.y = 0; knob.style.transform = ''; };
  stickEl.addEventListener('pointerup', endStick);
  stickEl.addEventListener('pointercancel', endStick);

  // Chạm/click lên cảnh → đi tới điểm hoặc tới gian (3D: raycast, 2D: theo ô).
  function onTap(hit) {
    if (panel.isOpen || !hit || paused) return;
    canvas.focus({ preventScroll: true });
    if (hit.player) { openPlayer(hit.player); return; }
    if (hit.station) walkToStation(hit.station);
    else walkTo({ x: hit.x, y: hit.y });
  }

  function attach2D() {
    const r = createRenderer(canvas);
    canvas.addEventListener('pointerdown', (e) => {
      const pt = clientToTile(canvas, e.clientX, e.clientY);
      onTap({ station: stationAt(pt.x, pt.y), x: pt.x, y: pt.y });
    });
    return { mode: '2d', yaw: 0, resize: r.resize, frame: r.frame, rotate() {}, celebrate() {} };
  }

  async function createScene() {
    if (!new URLSearchParams(location.search).has('2d')) {
      try {
        const { create3D } = await import('./render3d.js');
        return create3D(canvas, { onTap, reduced });
      } catch (e) {
        console.warn('[huyenquan] 3D không khởi tạo được, chuyển sang 2D:', e);
        // canvas có thể đã gắn context WebGL → thay bằng canvas mới cho 2D
        const fresh = canvas.cloneNode(false);
        canvas.replaceWith(fresh);
        canvas = fresh;
        document.querySelectorAll('.hq-labels').forEach((x) => x.remove());
      }
    }
    return attach2D();
  }

  function step(dt) {
    if (player.sitting) { player.moving = false; return; }
    if (player.flying) {
      // bay: nhanh gấp 4, vượt mọi vật cản; độ cao 3–420 m trên mặt đất
      player.alt = Math.min(420, Math.max(3, player.alt + ((altCtl.up ? 1 : 0) - (altCtl.down ? 1 : 0)) * 26 * dt));
    }
    let dx = 0, dy = 0, mag = 1;
    if (keys.has('u')) dy -= 1;
    if (keys.has('d')) dy += 1;
    if (keys.has('l')) dx -= 1;
    if (keys.has('r')) dx += 1;
    const sm = Math.hypot(stick.x, stick.y);
    if (!dx && !dy && sm > 0.18) { dx = stick.x; dy = stick.y; mag = Math.min(1, sm * 1.15); }
    if (dx || dy) {
      // xoay theo hướng camera: «lên» luôn là đi ra xa camera
      const yaw = renderer?.yaw || 0;
      const rx = Math.cos(yaw) * dx + Math.sin(yaw) * dy, ry = -Math.sin(yaw) * dx + Math.cos(yaw) * dy;
      dx = rx; dy = ry;
      const n = Math.hypot(dx, dy);
      const vx = (dx / n) * SPEED * mag * dt, vy = (dy / n) * SPEED * mag * dt;
      if (player.flying) { player.x += vx * 4; player.y += vy * 4; }
      else {
        if (!blockedAt(player.x + vx, player.y, player)) player.x += vx;
        if (!blockedAt(player.x, player.y + vy, player)) player.y += vy;
      }
      player.face = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
      player.h = Math.atan2(dx, dy);
      player.moving = true;
      return;
    }
    if (player.path.length) {
      const p = player.path[0];
      const ddx = p.x - player.x, ddy = p.y - player.y;
      const dist = Math.hypot(ddx, ddy);
      const mv = SPEED * dt;
      if (dist <= mv) {
        player.x = p.x; player.y = p.y; player.path.shift();
        if (!player.path.length) {
          target = null;
          if (player.pending) { const id = player.pending; player.pending = null; player.face = 'up'; openStation(id); }
        }
      } else {
        const nx = player.x + (ddx / dist) * mv, ny = player.y + (ddy / dist) * mv;
        if (blockedAt(nx, ny, player)) {
          // vướng: trượt dọc mặt vật cản; không trượt được thì tính lại đường một lần; vẫn kẹt thì dừng
          if (!blockedAt(nx, player.y, player)) player.x = nx;
          else if (!blockedAt(player.x, ny, player)) player.y = ny;
          else if (!player.replanned && target) { player.replanned = true; player.path = findPath(player, target); if (!player.path.length) target = null; return; }
          else { player.path = []; target = null; player.moving = false; return; }
          player.moving = true;
          return;
        }
        player.replanned = false;
        player.x = nx; player.y = ny;
        player.h = Math.atan2(ddx, ddy);
        player.face = Math.abs(ddx) > Math.abs(ddy) ? (ddx < 0 ? 'left' : 'right') : (ddy < 0 ? 'up' : 'down');
      }
      player.moving = true;
      return;
    }
    player.moving = false;
  }

  // -------------------------------------------------------------------------
  // Nút hành động (desktop: thẻ "E · …" giữa đáy; cảm ứng: nút tròn bên phải)
  // -------------------------------------------------------------------------
  const promptBtn = $('hq-prompt');
  let promptFor = null;
  function updatePrompt(near) {
    const id = panel.isOpen || player.sitting ? null : near?.id || null;
    if (id === promptFor) return;
    promptFor = id;
    promptBtn.hidden = !id;
    if (id) {
      const verb = near.kind === 'case' ? `Giải án cho ${todayNpc(near.slot).call}` : near.verb;
      promptBtn.innerHTML = `<b aria-hidden="true">${ICON[id] || '✦'}</b><kbd>E</kbd><span>${esc(verb)}</span>`;
      buzz('light');
    }
  }
  promptBtn.onclick = () => { if (promptFor) openStation(promptFor); };

  // -------------------------------------------------------------------------
  // Vòng lặp
  // -------------------------------------------------------------------------
  let lastTs = 0, raf = 0, minuteTick = 0;
  function refreshDay() {
    try { const T = todayInfo(); dayGanZhi = T.dayGZ; lunarText = T.lunar; } catch (e) { dayGanZhi = ''; }
    S.rollDay(state);
    updateHud();
  }

  function loop(ts) {
    if (!renderer || paused) return;
    const tLoop = performance.now();
    const dt = Math.min(0.05, lastTs ? (ts - lastTs) / 1000 : 0);
    lastTs = ts;
    step(dt);
    net.tick(dt, { x: player.x, y: player.y, h: player.sitting ? Math.PI : (player.h || 0), sitting: player.sitting, alt: player.flying ? player.alt : 0 });
    const near = player.flying ? null : nearestStation(player);
    updatePrompt(near);
    const now = new Date();
    if (ts - minuteTick > 60000) { minuteTick = ts; refreshDay(); }
    const today = S.todayStr(now);
    renderer.frame({
      time: ts, player, state, now, near, target, reduced,
      night: nightLevelOf(now), dayGanZhi, lunarText,
      todayLanterns: state.lanterns.filter((l) => S.todayStr(new Date(l.at)) === today),
      lanterns: state.phucKhi >= 100,
      peachBloom: state.phucKhi >= 250 || now.getMonth() < 3,
      crane: state.phucKhi >= 500,
      teaColor,
      others: net.others.values(),
      selfBubble,
      masterBubble,
      selfEmote,
      giatri: unlockedList(state),
      cos: cosNow(),
      cases: [0, 1, 2].map((i) => ({ id: `an${i}`, npc: todayNpc(i), done: S.caseDone(state, i) })),
    }, dt);
    record('loop', performance.now() - tLoop);
    raf = requestAnimationFrame(loop);
  }

  function startLoop() { cancelAnimationFrame(raf); lastTs = 0; raf = requestAnimationFrame(loop); }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); keys.clear(); } else if (!paused && renderer) { refreshDay(); startLoop(); }
  });
  window.addEventListener('resize', () => renderer?.resize());

  // -------------------------------------------------------------------------
  // Dock: các gian, nhiệm vụ, sổ, âm thanh
  // -------------------------------------------------------------------------
  $('hq-menu').onclick = () => {
    const body = document.createElement('div');
    body.className = 'hq-list';
    const group = (label, list) => {
      if (!list.length) return;
      const h = document.createElement('h4'); h.textContent = label; body.appendChild(h);
      for (const st of list) {
        const b = document.createElement('button');
        b.className = 'hq-btn hq-row';
        const done = st.kind === 'desk' && S.deskDone(state, st.id);
        b.textContent = `${ICON[st.id] || '✦'} ${st.name} — ${st.verb}${done ? ' ✓' : ''}`;
        b.onclick = () => teleportTo(st);
        body.appendChild(b);
      }
    };
    group('Trong quán', STATIONS.filter((st) => !st.world));
    group('Sảnh nghề · đi trạm (mỗi sảnh 1 khách/ngày)', STATIONS.filter((st) => st.world && st.kind === 'desk' && !st.room));
    group('Điện thờ', STATIONS.filter((st) => st.kind === 'door' || st.id === 'que'));
    panel.open({ title: 'Các gian & sảnh nghề', body });
  };

  $('hq-tasks-btn').onclick = () => {
    const body = document.createElement('div');
    const list = S.tasks(state).map((t) => `<li class="${t.done ? 'got' : ''}">${t.done ? '✅' : '◻️'} ${esc(t.text)}</li>`).join('');
    body.innerHTML = `<ul class="hq-plain hq-tasklist">${list}</ul>
      <p class="hq-sub">Xong cả 3 → +${S.REWARD.tasks} ${TEXT.point} và nối chuỗi ngày (hiện ${S.currentStreak(state)} ngày). Việc làm mới lúc 0 giờ.</p>`;
    panel.open({ title: 'Việc hôm nay', body });
  };

  $('hq-book').onclick = () => panel.open({ title: TEXT.book, body: openBook(api) });
  $('hq-wardrobe').onclick = () => panel.open({ title: 'Tàng Y Các', body: wardrobeBody(api) });

  // Giao lưu: cử chỉ + cụm từ soạn sẵn (không có chat tự do)
  function showSelf(text, e = null) { selfBubble = { text, until: performance.now() + 3800 }; if (e) selfEmote = { e, at: performance.now() }; }
  $('hq-social').onclick = () => {
    const body = document.createElement('div');
    const online = net.status === 'online';
    body.innerHTML = `<p class="hq-sub">${online ? `Mọi người trong phòng ${net.room + 1} sẽ thấy.` : 'Đang chơi đơn — chỉ mình bạn thấy.'}</p>
      <div class="hq-emotes">${Object.entries(EMOTES).map(([k, e]) => `<button class="hq-btn" data-e="${k}"><b>${e.icon}</b><span>${e.text}</span></button>`).join('')}</div>
      <div class="hq-phrases">${Object.entries(PHRASES).map(([k, t]) => `<button class="hq-btn" data-k="${k}">${esc(t)}</button>`).join('')}</div>`;
    body.querySelectorAll('[data-e]').forEach((b) => { b.onclick = () => { net.emote(b.dataset.e); showSelf(EMOTES[b.dataset.e].icon, b.dataset.e); buzz('light'); panel.close(); }; });
    body.querySelectorAll('[data-k]').forEach((b) => { b.onclick = () => { net.say(b.dataset.k); showSelf(PHRASES[b.dataset.k]); buzz('light'); panel.close(); }; });
    panel.open({ title: 'Giao lưu', body });
  };

  // Danh sách người trong phòng
  $('hq-online').onclick = () => {
    const body = document.createElement('div');
    const list = [...net.others.values()];
    body.innerHTML = net.status !== 'online'
      ? '<p>Đang chơi đơn. Quán sẽ tự kết nối lại khi có mạng.</p>'
      : `<p class="hq-sub">Phòng ${net.room + 1} · ${net.count} người (kể cả bạn).</p>
         ${list.length ? `<ul class="hq-plain hq-players">${list.map((o) => `<li><span><i class="hq-dot" style="background:${ROBE[o.robe] || '#999'}"></i>${esc(o.name)} <span class="hq-sub">· ${esc(o.title || '')}</span></span><button class="hq-btn" data-p="${esc(o.id)}">Xem</button></li>`).join('')}</ul>` : '<p>Chưa có ai khác. Cứ thong thả, khách sẽ tới.</p>'}
         ${net.blockedCount ? `<p class="hq-sub">Đang ẩn ${net.blockedCount} người. <button class="hq-link" data-role="unblock">Bỏ ẩn tất cả</button></p>` : ''}`;
    body.querySelectorAll('[data-p]').forEach((b) => { b.onclick = () => openPlayer(b.dataset.p); });
    const ub = body.querySelector('[data-role=unblock]');
    if (ub) ub.onclick = () => { net.unblockAll(); toast('Đã bỏ ẩn — có hiệu lực từ lần kết nối tới.'); panel.close(); };
    panel.open({ title: 'Trong quán', body });
  };

  // Thẻ một người chơi khác: chào, mời trà, ẩn, báo cáo (Guideline 1.2)
  function openPlayer(id) {
    const o = net.others.get(id);
    if (!o) return;
    const body = document.createElement('div');
    body.innerHTML = `<p><i class="hq-dot" style="background:${ROBE[o.robe] || '#999'}"></i><b>${esc(o.name)}</b> <span class="hq-sub">· ${esc(o.title || '')}</span></p>
      <div class="hq-actions">
        <button class="hq-btn hq-primary" data-e="bow">🙇 Cúi chào</button>
        <button class="hq-btn" data-e="tea">🍵 Mời trà</button>
        <button class="hq-btn" data-e="clap">👏 Vỗ tay</button>
      </div>
      <hr>
      <div class="hq-actions">
        <button class="hq-btn" data-role="block">🙈 Ẩn người này</button>
        <button class="hq-btn danger" data-role="report">⚑ Báo cáo</button>
      </div>
      <div data-role="reasons" hidden><p class="hq-sub">Lý do báo cáo:</p><div class="hq-actions">${Object.entries(REPORT_REASONS).map(([k, t]) => `<button class="hq-btn" data-why="${k}">${t}</button>`).join('')}</div></div>`;
    body.querySelectorAll('[data-e]').forEach((b) => { b.onclick = () => { net.emote(b.dataset.e, id); showSelf(EMOTES[b.dataset.e].icon, b.dataset.e); buzz('light'); panel.close(); }; });
    body.querySelector('[data-role=block]').onclick = () => { net.block(id); toast(`Đã ẩn ${o.name}. Bạn sẽ không thấy người này nữa.`); panel.close(); };
    body.querySelector('[data-role=report]').onclick = () => { body.querySelector('[data-role=reasons]').hidden = false; };
    body.querySelectorAll('[data-why]').forEach((b) => { b.onclick = () => { net.report(id, b.dataset.why); net.block(id); panel.close(); }; });
    panel.open({ title: 'Khách trong quán', body });
  }

  $('hq-sound').onclick = () => {
    state.settings.sound = !state.settings.sound;
    setSound(state.settings.sound);
    if (state.settings.sound) bell(440, 0.1);
    save(); updateHud();
  };

  // -------------------------------------------------------------------------
  // Tạm dừng / thoát (vỏ iOS ẩn overlay khi người dùng quay về Thư viện)
  // -------------------------------------------------------------------------
  function pause() {
    if (paused) return;
    paused = true;
    cancelAnimationFrame(raf);
    keys.clear(); stick.x = stick.y = 0;
    panel.close();
    setSound(false);
    lockPortrait(false);
    net.stop();
  }
  function resume() {
    paused = false;
    lockPortrait(true);
    if ($('hq-gate').hidden) net.start();
    if (renderer && $('hq-gate').hidden) { renderer.resize(); refreshDay(); startLoop(); if (state.settings.sound) setSound(true); }
  }
  function exit() { pause(); onExit?.(); }
  if (onExit) {
    $('hq-exit').hidden = false; $('hq-exit').onclick = exit;
    $('hq-gate-exit').hidden = false; $('hq-gate-exit').onclick = exit;
  }

  // -------------------------------------------------------------------------
  // Cổng vào
  // -------------------------------------------------------------------------
  async function enter() {
    $('hq-gate').hidden = true;
    $('hq-game').hidden = false;
    if (!renderer) {
      const ld = $('hq-loading');
      ld.hidden = false;
      renderer = await createScene();
      syncRooms();
      // màn nạp thật: mọi việc nặng (sinh địa hình, nạp công trình gần, biên dịch shader, đẩy
      // texture) xong rồi mới mở — vào game là mượt, không khựng dần trong nửa phút đầu
      if (renderer.ready) {
        const t0 = performance.now();
        try { await renderer.ready((player.x - 10) * 1.6, (player.y - 7) * 1.6, (msg) => { ld.textContent = msg; }); } catch (e) { console.warn('[huyenquan] nạp trước lỗi, vào luôn:', e); }
        console.info(`[huyenquan] nạp ${Math.round(performance.now() - t0)} ms`);
      }
      $('hq-game').classList.toggle('is3d', renderer.mode === '3d');
    }
    paused = false;
    renderer.resize();
    refreshDay();
    startLoop();
    // chạy vài khung sau màn nạp: những thứ dựng lười ở khung đầu (nhân vật, gia trì, phụ kiện…) biên dịch
    // shader lúc màn còn che, rồi hâm nóng lại cả cảnh một lượt — mở màn là mượt ngay
    const ld = $('hq-loading');
    if (!ld.hidden && renderer.warmScene) {
      ld.textContent = 'Sắp xong…';
      const frames = (n) => new Promise((r) => { const f = () => (--n <= 0 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
      await frames(10);
      await renderer.warmScene();
      await frames(3);
    }
    ld.hidden = true;
    net.start();
    updateOnline();
    canvas.focus({ preventScroll: true });
    // âm thanh chỉ bật lại sau một thao tác của người chơi (chính lần bấm vào cổng)
    if (state.settings.sound) setSound(true);
  }

  // ---------------------------------------------------------------------------
  // Cổng + Lễ nhập môn (docs/GAME-V2-THIET-KE.md §S1–S2): nhập bát tự → Dụng thần → phẩm phục
  // ---------------------------------------------------------------------------
  const GAN_WX = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' };
  const ZHI_WX = { 子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火', 午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水' };
  const swatch = (w) => `<i class="hq-dot" style="background:${ROBE[w] || '#999'}"></i>`;
  function birthForm() {
    const b = state.player?.birth || {};
    const date = b.y ? `${b.y}-${String(b.m).padStart(2, '0')}-${String(b.d).padStart(2, '0')}` : '';
    const time = b.h != null && !b.hourUnknown ? `${String(b.h).padStart(2, '0')}:${String(b.mi || 0).padStart(2, '0')}` : '12:00';
    const gender = b.gender || (state.player?.look === 'hero_f' ? 'nữ' : 'nam');
    return `<form id="hq-gate-form" class="hq-form">
      <p class="hq-sub">Thầy cần <b>bát tự sinh thần</b> để định Dụng thần, may phẩm phục hợp mệnh cho bạn. Ngày sinh chỉ lưu trên máy này.</p>
      <label>Tên trong quán
        <span class="hq-row-flex"><input class="hq-input" name="name" maxlength="24" value="${esc(state.player?.name || randomName())}"><button type="button" class="hq-btn" id="hq-reroll" aria-label="Đổi tên ngẫu nhiên">🎲</button></span>
      </label>
      <fieldset class="hq-radio"><legend class="hq-sub">Giới tính (lập lá số + dáng nhân vật)</legend>
        <label><input type="radio" name="gender" value="nam"${gender === 'nam' ? ' checked' : ''}> Nam</label>
        <label><input type="radio" name="gender" value="nữ"${gender === 'nữ' ? ' checked' : ''}> Nữ</label>
      </fieldset>
      <label>Ngày sinh (dương lịch) <input class="hq-input" type="date" name="date" min="1900-01-01" max="2100-12-31" value="${date}" required></label>
      <label>Giờ sinh <input class="hq-input" type="time" name="time" value="${time}"></label>
      <label class="hq-check"><input type="checkbox" name="nohour"${b.hourUnknown ? ' checked' : ''}> Không rõ giờ sinh (thầy tạm lấy giờ Ngọ)</label>
      <p class="hq-error" data-role="err" role="alert"></p>
      <button class="hq-btn hq-primary hq-big" type="submit">Xin thầy lập mệnh</button>
    </form>`;
  }
  function ceremony(R, name) {
    const P = R.chart.pillars;
    const cols = [['Giờ', P.time], ['Ngày', P.day], ['Tháng', P.month], ['Năm', P.year]];
    const pct = R.wx.pct;
    const y = R.yong;
    const acc = y.secondary || y.xi;
    const ky = y.ji || (y.avoid || [])[0];
    return `<div class="hq-rite">
      <p class="hq-sub">Thầy đặt bút, lật từng trụ…</p>
      <div class="hq-pillars sm">${cols.map(([lab, c], i) => `<div class="hq-pillar flip rite" style="--d:${i * 0.35}s"><div class="hq-pl-label">${lab}</div>
        <div class="hq-pl-char wx-${WX_CLS[GAN_WX[c.gan]]}">${c.gan}</div><div class="hq-pl-char wx-${WX_CLS[ZHI_WX[c.zhi]]}">${c.zhi}</div></div>`).join('')}</div>
      <p>Nhật chủ <b>${P.day.gan}</b> (${WX_NAMES[GAN_WX[P.day.gan]]}) · <b>${esc(R.strength.level || '')}</b></p>
      <p class="hq-wxbar">${['木', '火', '土', '金', '水'].map((w) => `<span style="--c:${ROBE[w]};--w:${Math.max(4, pct[w])}%" title="${WX_NAMES[w]} ${Math.round(pct[w])}%"></span>`).join('')}</p>
      <ul class="hq-plain">
        <li>${swatch(y.primary)} <b>Dụng thần: ${WX_NAMES[y.primary]}</b> → màu áo phẩm phục</li>
        ${acc ? `<li>${swatch(acc)} Hỷ thần: ${WX_NAMES[acc]} → màu đai</li>` : ''}
        ${ky ? `<li>${swatch(ky)} Kỵ thần: ${WX_NAMES[ky]} → nên tránh</li>` : ''}
      </ul>
      <p class="hq-quote">«${esc(name)} mệnh cần ${WX_NAMES[y.primary]}. Mặc màu ${WX_NAMES[y.primary]} vào quán cho hợp khí.»</p>
      <div class="hq-actions"><button class="hq-btn hq-primary hq-big" id="hq-wear" type="button">Mặc phẩm phục · bước qua cổng</button>
      <button class="hq-btn" id="hq-redo" type="button">Sửa ngày giờ</button></div>
    </div>`;
  }
  function showGate() {
    const body = $('hq-gate').querySelector('.hq-gate-body');
    if (state.player?.birth) {
      const y = state.player.yong || {};
      body.innerHTML = `<p class="hq-welcome">Chào ${esc(state.player.name)} quay lại quán.</p>
        <p class="hq-sub">${esc(S.titleFor(state.phucKhi).name)} · ✦ ${state.phucKhi} ${TEXT.point} · chuỗi ${S.currentStreak(state)} ngày</p>
        <p>${swatch(y.primary)} Phẩm phục ${WX_NAMES[y.primary] || ''}${y.accent ? ` · đai ${WX_NAMES[y.accent]}` : ''}</p>
        <button class="hq-btn hq-primary hq-big" id="hq-enter" type="button">Bước qua cổng</button>
        <button class="hq-btn" id="hq-rebirth" type="button">Sửa bát tự</button>`;
      $('hq-enter').onclick = enter;
      $('hq-rebirth').onclick = showBirth;
      return;
    }
    showBirth();
  }
  function showBirth() {
    const body = $('hq-gate').querySelector('.hq-gate-body');
    body.innerHTML = birthForm();
    const f = $('hq-gate-form');
    f.nohour.onchange = () => { f.time.disabled = f.nohour.checked; };
    f.time.disabled = f.nohour.checked;
    $('hq-reroll').onclick = () => { f.name.value = randomName(); };
    f.onsubmit = (e) => {
      e.preventDefault();
      const err = f.querySelector('[data-role=err]');
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(f.date.value);
      if (!m) { err.textContent = 'Xin cho thầy ngày sinh đầy đủ.'; return; }
      const nohour = f.nohour.checked;
      const [hh, mi] = nohour ? [12, 0] : (f.time.value || '12:00').split(':').map(Number);
      const gender = f.gender.value;
      const birth = { y: +m[1], m: +m[2], d: +m[3], h: hh, mi, gender, hourUnknown: nohour };
      let R;
      try { R = chartOf({ year: birth.y, month: birth.m, day: birth.d, hour: birth.h, minute: birth.mi, gender }); } catch (ex) { err.textContent = ex.message || 'Thầy chưa lập được lá số này.'; return; }
      const name = f.name.value.trim() || randomName();
      body.innerHTML = ceremony(R, name);
      buzz('medium');
      $('hq-redo').onclick = showBirth;
      $('hq-wear').onclick = () => {
        const y = R.yong;
        const accent = y.secondary || y.xi || '';
        state.player = { ...(state.player || {}), name, look: gender === 'nữ' ? 'hero_f' : 'hero_m', birth,
          yong: { primary: y.primary, accent, ji: y.ji || (y.avoid || [])[0] || '' }, robe: y.primary, accent,
          createdAt: state.player?.createdAt || Date.now() };
        // hồ sơ «Bản thân» trong Sổ Mệnh dùng chung cho Bàn Thầy / Thầy AI / giải quẻ
        const same = (p) => p.year === birth.y && p.month === birth.m && p.day === birth.d && p.gender === gender;
        if (!state.profiles.some(same)) S.addProfile(state, { label: 'Bản thân', year: birth.y, month: birth.m, day: birth.d, hour: nohour ? null : birth.h, minute: nohour ? null : birth.mi, gender });
        save();
        updateHud();
        enter().then(() => syncRooms()); // lá số mới → khắc lại biển 9 cổng + bia + đèn 3D (lần đầu enter() đã tự sync)
        toast(`Phẩm phục ${WX_NAMES[y.primary]} đã mặc. Thầy đang ngồi ở Chính Đường.`);
      };
    };
  }

  updateHud();
  showGate();
  lockPortrait(true);

  // Cho kiểm thử tự động (Playwright) — chỉ bản dev; bản đóng gói không phơi đối tượng này.
  if (import.meta.env && import.meta.env.DEV) {
    window.__hq = { state, player, stick, altCtl, net, openStation, walkTo, STATIONS, blockedAt, findPath, get renderer() { return renderer; } };
  }

  return { pause, resume, exit };
}
