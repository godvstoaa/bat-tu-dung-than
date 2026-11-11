// ============================================================================
//  HUYỀN QUÁN — lõi game: cổng, vòng lặp, điều khiển (phím, chạm, joystick ảo),
//  HUD, bảng. Gọi qua mount.js sau khi markup đã chèn vào DOM.
//  Spec: docs/GAME-HUYEN-QUAN-SPEC.md · Kế hoạch: docs/GAME-MMO-PROMPT-PLAN.md
// ============================================================================
import { record } from './perf.js';
import * as S from './state.js';
import { STATIONS, START, findPath, stationAt, nearestStation, blockedAt, stationById, setDoorVerbHook, worldToTile, tileToWorld } from './world.js';
import { estateByH, mansionAt } from './mansions.js';
import * as MO from './motion.js';
import { ROOM_X0, cityOctDist } from './terrain.js';
import * as LAW from './law.js';
import * as PR from './prison.js';
import { enableHd } from './characters.js';
import * as LIFE from './life.js';
import * as COIN from './coins.js';
import * as ILL from './illness.js';
import * as VE from './vehicles.js';
import * as FQ from './fatequest.js';
import * as AD from './amduc.js';
import * as MV from './movement.js';
import * as FL from './flight.js';
import * as HH from './huyenhoc.js';
import * as RL from './realm.js';
import * as LH from './luanhoi.js';
import { createEcon } from './econ-client.js';
import { zones as jobZones } from './jobzones.js';
import { thucCan } from './cuisine.js';
import { waterAt as waterInfo } from './water.js';
import { dailyGuidance } from '../engine/daily.js';
import { setOpenSpots, clearOpenSpots } from './rooms.js';
import { setHint } from './citizens.js';
import { blockedByBuilding } from './obstacles.js';
import * as J from './jobs.js';
import * as LP from './lifeplaces.js';
import { createWork } from './work.js';
import { createBoatControl, registerDocks, DOCK_KEY } from './boat-ui.js';
import { RAZE_OUTSIDE } from './protocol.js';
import * as I from './items.js';
import * as E from './estate.js';
import { roomByKey, insideOf, setHomeProvider, roomSpots, roomAtDyn } from './rooms.js';
import { knockReply, nearbyHint, enterables } from './homes.js';
import { spawnOptions, savablePos, WARD_OF_WX } from './spawn.js';
import * as TUT from './tutorial.js';
import { scoreHome, warmReward } from './homefs.js';
import { createRenderer, clientToTile, nightLevel as nightLevelOf, ROBE } from './render.js';
import { STATION_OPEN, openBook, todayInfo, esc, chartOf } from './stations.js';
import { randomName } from './names.js';
import { setSound, bell } from './audio.js';
import { TEXT } from './features.js';
import { buzz, lockPortrait } from './haptics.js';
import { createNet } from './net.js';
import { createAccount } from './account.js';
import { chartSource } from './fortune-npc.js';
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

const BASE_SPEED = 3.5; // ô/giây
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
  let lastTitle = S.titleFor(state.xp || 0).name;
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
  // Tài khoản (đăng nhập không mật khẩu + lưu đám mây — account.js). Khách vẫn chơi bình thường.
  let work = null; // việc làm P2 (work.js) — tạo ở mục SINH TỒN, dùng sớm trong onEvent của net
  let boat = null; // thuyền thuê tự lái (boat-ui.js) — tạo cùng chỗ với work
  const account = createAccount({ getState: () => state, storageKey: S.KEY, storage, onChange: (e) => { updateAccountUi(); if (e?.conflict) toast('Máy khác vừa lưu tiến độ mới hơn lên tài khoản — mở lại game để chọn bản.'); } });
  let netCung = null; // cúng cô hồn (P21) — gắn sau khi có life state
  const net = createNet({
    token: () => account.wsToken(),
    profile: () => ({ name: state.player?.name || 'Khách', robe: state.player?.robe || '土', accent: state.player?.accent || '', cos: C.encodeCos(C.wardrobe(state).equipped), look: state.player?.look || 'hero_m', title: S.titleFor(state.xp || 0).name, x: player.x, y: player.y }), // v4: vị trí xuất hiện thật (spawn.js) — máy chủ kiểm biên
    onEvent(ev) {
      if (ev.t === 'status' || ev.t === 'count') { updateOnline(); if (ev.t === 'status') work?.onStatus(ev.status); }
      else if (ev.t === 'emo' && ev.toMe && !ev.self) { toast(`${ev.name || 'Một khách'} ${EMOTES[ev.e].text} bạn ${EMOTES[ev.e].icon}`); buzz('light'); }
      else if (ev.t === 'renamed') toast(`Tên này không dùng được trong phòng chung — tạm hiển thị «${ev.name}». Đổi tên trong ${TEXT.book} › Cài đặt.`);
      else if (ev.t === 'reported') toast('Đã gửi báo cáo. Cảm ơn bạn giữ quán yên tĩnh.');
      else if (ev.t === 'estate') { syncEstate(); refreshEstateSigns(); }
      else if (ev.t === 'razed') renderer?.raze?.applyRazed(ev.list);
      else if (ev.t === 'cung' || ev.t === 'cung_ok') netCung?.(ev);
    },
  });
  // nghề ngoài tiệm (P7): điểm «Nhận việc» ở từng khu làm (biển Chiêu công — render3d)
  for (const [job, z] of Object.entries(jobZones())) z.spots.forEach((s, i) => setOpenSpots(`job:z:${job}:${i}`, [{ id: `zj:${job}:${i}`, kind: 'job', zoneJob: job, place: s.name, name: `${J.WORK[job].icon} ${J.WORK[job].name}`, verb: `Nhận việc · ${J.WORK[job].name}`, x: s.x, z: s.z, r: Math.min(6, s.r) }]));
  // sổ kinh tế Phần II (P8–P13): máy chủ khi nối, sổ trên máy khi ngoại tuyến (econ-client.js)
  const econ = createEcon({ net, getState: () => state });
  // nối máy chủ xong (sổ nhà về): đẩy bố cục nhà mình lên; máy chủ chưa ghi căn này (máy chủ mới / dữ liệu
  // dev) thì giữ chỗ lại; căn đã thuộc người khác → trả lại tiền + cất đồ về túi
  async function syncEstate() {
    const H = I.homeState(state), own = H.own; if (!own) return;
    const est = net.estate;
    if (est.mine !== own.h) {
      const r = await est.claim(own.h);
      if (!r.ok && r.err !== 'timeout' && r.err !== 'offline') {
        for (const m of own.items) H.inv[m.i] = (H.inv[m.i] || 0) + 1;
        const paid = own.paid || E.priceOf(E.listing(own.h));
        state.phucKhi += paid.phuc || 0; if (paid.xu) LIFE.gainXu(state, paid.xu); C.wardrobe(state).ngoc += paid.ngoc || 0;
        H.own = null; H.spawn = null; save();
        toast('Sổ địa ốc ghi căn nhà của bạn đã thuộc người khác — đã hoàn tiền, đồ đạc cất về túi.');
        return;
      }
      if (!r.ok) return;
    }
    const x = await est.save(own.h, E.encodeLayout(own.items), own.couplet);
    if (x.ok) { own.pending = false; save(); }
  }
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
  // v4: thông báo có HÀNG ĐỢI (1 cái / 1,5 giây, gộp trùng) — không còn vứt bỏ âm thầm. Dồn dập (≥ 3 chờ) hoặc lúc vào ngày
  // mới → gom thành MỘT thẻ «Sáng nay» (digest) thay cho loạt toast liên tiếp.
  const toastQ = [];
  let toastBusy = false, digest = { items: [], title: '🌅 Sáng nay' }; // lúc khởi động: gom mọi thông báo đầu phiên
  setTimeout(() => digestFlush(), 8000);
  function digestStart(ms, title) { if (digest) return; digest = { items: [], title }; setTimeout(digestFlush, ms); }
  function digestFlush() {
    const d = digest; digest = null;
    if (!d || !d.items.length) return;
    if (d.items.length === 1) { toast(d.items[0]); return; }
    const box = $('hq-toasts'), c = document.createElement('div');
    c.className = 'hq-digest';
    c.innerHTML = `<b>${d.title}</b><ul>${d.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul><button type="button" class="hq-btn">Đã xem</button>`;
    const bye = () => { c.classList.add('out'); setTimeout(() => c.remove(), 400); };
    c.querySelector('button').onclick = bye;
    setTimeout(bye, 6000 + d.items.length * 2500);
    box.prepend(c);
  }
  function showToast(text) {
    const t = document.createElement('div');
    t.className = 'hq-toast';
    t.textContent = text;
    const box = $('hq-toasts');
    while (box.querySelectorAll('.hq-toast').length >= 2) box.querySelector('.hq-toast').remove();
    box.appendChild(t);
    setTimeout(() => t.classList.add('out'), 2700);
    setTimeout(() => t.remove(), 3200);
  }
  function pumpToast() {
    if (toastBusy || !toastQ.length) return;
    toastBusy = true; showToast(toastQ.shift());
    setTimeout(() => { toastBusy = false; pumpToast(); }, 1500);
  }
  function toast(text) {
    text = String(text ?? '').trim(); if (!text) return;
    if (digest) { if (!digest.items.includes(text)) digest.items.push(text); return; }
    if (toastQ.includes(text) || [...$('hq-toasts').querySelectorAll('.hq-toast')].some((t) => t.textContent === text)) return;
    if (toastQ.length >= 3) { digestStart(2500, '📜 Thông báo'); digest.items.push(...toastQ.splice(0), text); return; }
    toastQ.push(text); pumpToast();
  }

  function save() { S.saveState(state, storage); account.touch(); }
  // trang bị đang hiển thị = đồ đang mặc + món đang thử (20 giây)
  let cosPreview = null;
  function cosNow() {
    const eq = { ...C.wardrobe(state).equipped };
    if (cosPreview) { if (performance.now() < cosPreview.until) eq[cosPreview.slot] = cosPreview.id; else cosPreview = null; }
    return eq;
  }

  function updateHud() {
    const t = S.titleFor(state.xp || 0);
    player.name = state.player?.name || '';
    player.robe = state.player?.robe || '土';
    player.gold = (state.xp || 0) >= 500; // P18: theo Phúc Khí tích lũy (đạo hạnh), không theo số dư tiêu được
    player.look = state.player?.look || 'hero_m';
    player.accent = state.player?.accent || '';
    $('hq-who').textContent = `${player.name} · ${t.name} · Cấp ${levelInfo(state).level}`;
    if (lastXp == null) lastXp = state.xp || 0;
    const canFly = unlocked(state, 'fly') || VE.owns(LIFE.lifeState(state), 'linhhac') || VE.owns(LIFE.lifeState(state), 'phikiem');
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
    if (gained > 0 && why) toast(`+${gained} ${TEXT.point} · ${why}`); // không lý do = nơi gọi đã tự báo (tránh toast đôi)
    // lên cấp → báo gia trì nguyên tố vừa mở (progress.js)
    if (lastXp != null) for (const g of newlyUnlocked(lastXp, state.xp || 0)) { toast(`✨ Cấp ${levelInfo(state).level} · mở ${g.name} (${WX_GIATRI[state.player?.robe]?.name || ''})`); buzz('heavy'); }
    lastXp = state.xp || 0;
    const bonus = S.settleTasks(state);
    if (bonus) { toast(`Xong 3 việc hôm nay · +${bonus} · chuỗi ${S.currentStreak(state)} ngày`); bell(660, 0.1); buzz('medium'); }
    for (const a of S.evaluateAchievements(state)) toast(`🏮 Thành tựu: ${a.name}`);
    const t = S.titleFor(state.xp || 0).name;
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
    lightIncense() { net.lightIncense(); }, // hương chung: máy chủ chọn lư (lớn trước, đầy thì lư nhỏ)
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
    // Thành Bát Quái: cưỡi ngựa (dịch trạm), nhà riêng (máy chủ giữ chủ sở hữu), dựng lại phòng
    travel(x, z, label) {
      if (work?.carrying()) { toast('📦 Đang áp hàng — ngựa trạm không chở kiện của phu. Đi bộ giao cho xong đã.'); return; }
      if (boat?.aboard()) { toast('⛵ Đang trên thuyền — trả thuyền ở bến trước đã.'); return; }
      const to = x == null ? START : worldToTile(x, z);
      travelTo(to, label);
    },
    estate: net.estate,
    rebuildRoom(key) { renderer?.rebuildRoom?.(key); },
    refreshEstate: () => refreshEstateSigns(),
    openHomeEdit(h) { import('./home-edit.js').then((m) => { panel.open({ title: '🪑 Bài trí nhà', body: m.homeEditBody(api, h) }); }); },
    save: () => save(),
    updateVitals: () => updateVitals?.(),
    hasHome: () => !!I.homeState(state).own,
    refreshHud: () => updateHud(),
    atHome: () => { const own = I.homeState(state).own; if (!own) return false; const w = tileToWorld(player.x, player.y), rm = roomAtDyn(w.x, w.z); return rm?.key === `est:${own.h}` || (E.isPhuH(own.h) && mansionAt(w.x, w.z)?.h === own.h); },
    life: () => LIFE.lifeState(state),
    // Phần II (P6–P13): sổ kinh tế, nước gần, người chơi đứng gần, hồ sơ chia sẻ cho thầy mệnh lý, ngày can chi, gợi ý việc mệnh
    get econ() { return econ; },
    panel,
    nearWater: () => { const w = tileToWorld(player.x, player.y); for (const [dx, dz] of [[0, 0], [3, 0], [-3, 0], [0, 3], [0, -3]]) { const i = waterInfo(w.x + dx, w.z + dz); if (i && i.depth > 0.4) return true; } return false; },
    nearbyPlayers: () => { if (net.status !== 'online') return []; const w = tileToWorld(player.x, player.y); return [...net.others.values()].filter((o) => { const q = tileToWorld(o.x, o.y); return Math.hypot(q.x - w.x, q.z - w.z) < 8; }).map((o) => ({ u: o.u, name: o.name })); },
    chartProfile: () => econProfile(),
    loggedIn: () => account.loggedIn(),
    dayGZ: () => dayGanZhi,
    questHint: () => { const wx = state.player?.yong?.primary; if (!wx || FQ.fateState(LIFE.lifeState(state)).done === S.todayStr()) return null; const q = FQ.questFor(S.todayStr(), wx, fatePid); return q ? { id: q.id, hint: FQ.hint(q) } : null; },
    wipe() { try { storage.removeItem(S.KEY); } catch (e) { /* ignore */ } location.reload(); },
  };

  // Vận Mệnh Các / Thái Tuế Điện: khắc biển cổng, bia, bài vị theo lá số + đèn dầu (web)
  function syncRooms() {
    if (import.meta.env.MODE === 'ios' || !renderer?.setRoomData) return;
    import('./vanmenh-ui.js').then((m) => renderer.setRoomData(m.roomData(state))).catch((e) => console.warn('[rooms]', e));
  }

  function travelTo(to, label) {
    api.tut?.('travel');
    if (player.flying) setFlying(false);
    const ov = document.createElement('div');
    ov.className = 'hq-travel';
    ov.innerHTML = `<div><b>${esc(label)}</b><span>Vó ngựa rộn ràng trên quan đạo…</span></div>`;
    ($('hq-canvas')?.closest('.hq-root') || document.body).appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('on'));
    setTimeout(() => { player.x = to.x; player.y = to.y; player.path = []; target = null; net.teleport(to.x, to.y); }, 600);
    setTimeout(() => ov.classList.remove('on'), 1200);
    setTimeout(() => ov.remove(), 1800);
  }

  // nhà riêng: chủ sở hữu toàn thành do máy chủ giữ (net.estate) — nhãn cửa + dữ liệu dựng phòng
  setDoorVerbHook((e) => {
    const own = I.homeState(state).own;
    if (own && `est:${own.h}` === e.key) return `Về nhà · ${e.name}`;
    const info = net.estate.info(e.est.h);
    return info ? `Thăm nhà ${info.name}` : null;
  });
  setHomeProvider((key) => {
    const h = Number(key.slice(4)), own = I.homeState(state).own;
    if (own && own.h === h) {
      const l = E.listing(h);
      if (l && !l.W && !own.fit2) { // phòng thu theo khung nhà ngoài (2026-11-11): món không còn vừa thì cất về túi, một lần
        const { keep, drop } = E.fitLayout(E.roomOf(l), own.items); own.fit2 = 1;
        if (drop.length) { const H = I.homeState(state); for (const m of drop) H.inv[m.i] = (H.inv[m.i] || 0) + 1; own.items = keep; save(); setTimeout(() => toast(`Nhà đã đo lại đúng khung ngoài — ${drop.length} món không vừa đã cất về túi.`), 400); }
      }
      return { mode: 'own', items: own.items, couplet: own.couplet, owner: state.player?.name || '' };
    }
    const info = net.estate.info(h);
    if (!info) return { mode: 'sale', items: [], couplet: 0 };
    const lay = net.estate.cached(h);
    if (!lay) net.estate.get(h).then((r) => { if (r?.ok) renderer?.rebuildRoom?.(key); });
    const vis = lay ? E.decodeLayout(lay.it) || [] : [], vl = E.listing(h);
    return { mode: 'visit', items: vl && !vl.W ? E.fitLayout(E.roomOf(vl), vis).keep : vis, couplet: lay?.c || 0, owner: info.name, likes: info.likes };
  });
  const estateOwnerOf = (h) => { const own = I.homeState(state).own; if (own?.h === h) return { name: state.player?.name || 'bạn', mine: true }; const i = net.estate.info(h); return i ? { name: i.name, mine: false } : null; };
  const refreshEstateSigns = () => renderer?.setEstateLookup?.(estateOwnerOf);
  net.estate.onChange = (h) => { renderer?.rebuildRoom?.(`est:${h}`); const o = estateOwnerOf(h); renderer?.setEstateOwner?.(h, o?.name || null, !!o?.mine); };

  function knock(st) {
    const e = st.enter, now = new Date();
    const line = knockReply(e, now.getHours(), S.todayStr(now), nearbyHint(e));
    toast(`🚪 Cốc cốc… ${line}`);
    buzz('light');
  }

  function openStation(id) {
    const st = stationById(id);
    if (!st) return;
    // cửa điện / lối ra: chuyển cảnh vào – ra (không mở bảng)
    if (st.kind === 'door' || st.kind === 'exit') { enterRoom(st); return; }
    if (st.kind === 'knock') { knock(st); return; }
    if (st.kind === 'fortune') { import('./fortune-ui.js').then((m) => m.openFortune(api, st.master)); buzz('light'); return; } // quầy thầy bói Phố Thầy Bói
    if (st.kind === 'spot' && st.room?.startsWith('law:')) { lawSpot(st); return; }
    if (st.kind === 'spot' && st.room === LP.KEY) { lifeSpot(st); return; }
    if (st.kind === 'spot' && work && (st.room === 'job:mine' || st.data?.kind === 'job')) { work.spot(st); return; }
    if (st.kind === 'spot' && st.room === DOCK_KEY) { boat?.spot(st); return; }
    if (st.kind === 'spot' && st.room === 'fate') { fateSpot(); return; }
    if (st.kind === 'spot') {
      S.rollDay(state);
      import('./shop-ui.js').then((m) => {
        let r = null;
        try { r = m.openSpot(api, st); } catch (e) { console.error(e); toast('Có chút trục trặc, thử lại nhé.'); }
        if (r) { buzz('light'); panel.open(r); }
        after(0);
      });
      return;
    }
    const title = st.kind === 'case' ? `Án của ${todayNpc(st.slot).call}` : st.name;
    S.rollDay(state);
    S.visitStation(state, id);
    let body;
    if (id === 'lich') api.tut?.('que');
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
    st.onEnter?.();
    if (st.kind === 'door' && st.room && renderer?.prepareRoom) renderer.prepareRoom(st.room); // phòng lưới: dựng trong nửa giây chuyển cảnh
    const sub = st.kind === 'door' ? (st.home ? 'Cánh cửa gỗ kẽo kẹt mở ra…' : 'Khói trầm thoang thoảng, nến lung linh…') : 'Trở lại ngoài trời';
    const head = st.kind === 'door' ? `${st.home ? '🚪' : '⛩'} Bước vào ${esc(st.name)}` : st.home ? '🚪 Ra phố' : `⛩ Ra khỏi ${esc(st.name)}`;
    if (st.kind === 'door' && st.room?.startsWith('est:')) setTimeout(() => homeWarm(Number(st.room.slice(4))), 900);
    ov.innerHTML = `<div><b>${head}</b><span>${sub}</span></div>`;
    ($('hq-canvas')?.closest('.hq-root') || document.body).appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('on'));
    setTimeout(() => { player.x = st.to.x; player.y = st.to.y; player.path = []; target = null; player.face = 'up'; net.teleport(st.to.x, st.to.y); }, 500);
    setTimeout(() => ov.classList.remove('on'), 1000);
    setTimeout(() => ov.remove(), 1600);
    buzz('light');
  }

  // về nhà lần đầu trong ngày: Phúc Khí theo điểm phong thủy (homefs.warmReward)
  function homeWarm(h) {
    const own = I.homeState(state).own; if (!own || own.h !== h) return;
    const l = E.listing(h), r = homeScore(l, own.items);
    const got = S.grantHome(state, 'warm', warmReward(r.score));
    if (got) { toast(`🏡 Về nhà — phong thủy ${r.score}/100 · +${got} Phúc Khí`); after(got); }
    if (own.pending && net.estate.online()) net.estate.save(h, E.encodeLayout(own.items), own.couplet).then((x) => { if (x?.ok) { own.pending = false; save(); } });
  }

  // điểm phong thủy nhà: biệt phủ chấm theo Chính Sảnh (vùng 0, hướng thật của gian) — nhà nhỏ chấm cả phòng
  function homeScore(l, items) {
    const yong = state.player?.yong || null;
    if (E.isPhu(l)) { const z = E.zoneOfH(l.h, 0); return scoreHome({ room: E.zoneRoom(z), items: items.filter((m) => !m.k), yong, wardWx: l.wx, fry: (l.house?.ry || 0) + z.ry }); }
    const r0 = scoreHome({ room: E.roomOf(l), items, yong, wardWx: l.wx, fry: l.house?.ry || 0 });
    return { ...r0, score: Math.min(100, r0.score + RL.phapEff(state, 'trachphap')) }; // Trạch Pháp (P20)
  }
  // biệt phủ: đi bộ vào phủ của mình (không qua cửa dịch chuyển) cũng tính «về nhà» trong ngày
  setInterval(() => {
    const own = I.homeState(state).own; if (!own || !E.isPhuH(own.h) || paused) return;
    const w = tileToWorld(player.x, player.y), m = mansionAt(w.x, w.z);
    if (m && m.h === own.h) homeWarm(own.h);
  }, 4000);

  function teleportTo(st) {
    api.tut?.('travel');
    if (player.sitting) return;
    if (player.flying && st.room) setFlying(false);
    const go = () => { player.x = st.spot.x; player.y = st.spot.y; player.path = []; target = null; player.face = 'up'; net.teleport(st.spot.x, st.spot.y); };
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
    if (on && LAW.serving(state)) { toast('⛓ Đang thụ án — gông cùm trên người, không ngự kiếm được.'); return; }
    if (on && boat?.aboard()) { toast('⛵ Đang trên thuyền — cập bờ rồi mới ngự kiếm được.'); return; }
    if (on && work?.carrying()) { toast('📦 Đang áp hàng — không ngự kiếm được (kiện của dịch trạm phải đi đường bộ).'); return; }
    if (on && !unlocked(state, 'fly') && !VE.owns(L, 'phikiem')) { // linh hạc (P4): bay thấp 60 giây, nghỉ 3 phút
      const hr = VE.hacReady(L);
      if (!hr.has) { toast(`Ngự kiếm mở ở cấp 8 (hiện cấp ${levelInfo(state).level}) hoặc VIP — hay mua linh hạc / phi kiếm ở Dịch Trạm.`); return; }
      if (!hr.ready) { toast(`🕊️ Linh hạc đang nghỉ — còn ${hr.left} giây.`); return; }
      VE.hacTakeoff(L); toast('🕊️ Cưỡi linh hạc — bay được 60 giây.');
    }
    if (on && VE.garage(L).ride) VE.ride(L, null);
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
    if (e.code === 'KeyH') { setRide(!VE.garage(L).ride); e.preventDefault(); return; }
    if (player.flying && (e.code === 'Space' || e.code === 'KeyC')) { altCtl[e.code === 'Space' ? 'up' : 'down'] = true; e.preventDefault(); return; }
    // di chuyển tự do: Shift chạy nhanh · Space nhảy (bấm lần nữa trên không: khinh công) · giữ Space khi rơi: lượn
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') { moveIn.sprint = true; return; }
    if (e.code === 'Space' && !e.repeat) { const onScene = document.activeElement === canvas || document.activeElement === document.body; if (onScene) { moveIn.jump = true; moveIn.hold = true; e.preventDefault(); return; } }
    if (KEYMAP[e.code]) { keys.add(KEYMAP[e.code]); player.path = []; target = null; e.preventDefault(); return; }
    if (e.code === 'KeyX' && !e.repeat) { attack(); e.preventDefault(); return; }
    if (e.code === 'KeyL') { openLawBook(); e.preventDefault(); return; }
    if (e.code === 'KeyI') { openEcon('kho'); e.preventDefault(); return; }
    if (e.code === 'KeyQ' || e.code === 'KeyR') { renderer?.rotate?.(e.code === 'KeyQ' ? Math.PI / 4 : -Math.PI / 4); return; }
    if (e.code === 'KeyE' && boat?.keyE()) { e.preventDefault(); return; } // trên thuyền / cạnh thuyền buộc: trả, buộc, lên
    if (e.code === 'KeyE' || e.code === 'Enter') {
      // Space/Enter trên nút HUD phải bấm nút đó, chỉ E mở gian bất kể focus.
      const onScene = document.activeElement === canvas || document.activeElement === document.body;
      const st = nearestStation(player);
      if (st && !player.sitting && (e.code === 'KeyE' || onScene)) { e.preventDefault(); openStation(st.id); }
    }
  }
  const onKeyUp = (e) => { if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') moveIn.sprint = false; if (e.code === 'Space') moveIn.hold = false; if (e.code === 'Space') altCtl.up = false; if (e.code === 'KeyC') altCtl.down = false; if (KEYMAP[e.code]) keys.delete(KEYMAP[e.code]); };
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
  // GIAO DIỆN ĐIỆN THOẠI (P16) — tùy chọn lưu máy: tay trái, khoá 30 khung hình, con quay liệng khi bay
  const MOB = (() => { try { return { left: false, fps30: false, gyro: false, ...JSON.parse(localStorage.getItem('huyenquan:mobile') || '{}') }; } catch (e) { return { left: false, fps30: false, gyro: false }; } })();
  const saveMob = () => { try { localStorage.setItem('huyenquan:mobile', JSON.stringify(MOB)); } catch (e) { /* bỏ */ } };
  const coarse = matchMedia('(pointer: coarse)').matches;
  const rootEl = () => $('hq-canvas')?.closest('.hq-root') || document.body;
  if (coarse) rootEl().classList.add('hq-mobile');
  rootEl().classList.toggle('hq-left', !!MOB.left);
  // cần điều khiển động: hiện ngay dưới ngón tay ở nửa dưới phía tay cầm; vùng chết 8 px, bán kính 56 px
  const R_DYN = 56, DEAD = 8;
  const dynStick = {
    zone: (e) => { const r = $('hq-canvas').getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height; return fy > 0.45 && (MOB.left ? fx > 0.55 : fx < 0.45); },
    start(e) { const host = $('hq-canvas').parentElement.getBoundingClientRect(); stickC = { x: e.clientX, y: e.clientY }; stickEl.style.left = `${e.clientX - host.left - 60}px`; stickEl.style.top = `${e.clientY - host.top - 60}px`; stickEl.style.bottom = 'auto'; stickEl.classList.add('on'); stickId = e.pointerId; player.path = []; target = null; knob.style.transform = ''; },
    move(e) { let dx = e.clientX - stickC.x, dy = e.clientY - stickC.y; const d = Math.hypot(dx, dy); if (d < DEAD) { stick.x = stick.y = 0; knob.style.transform = ''; return; } if (d > R_DYN) { dx = (dx / d) * R_DYN; dy = (dy / d) * R_DYN; } knob.style.transform = `translate(${dx}px, ${dy}px)`; stick.x = dx / R_DYN; stick.y = dy / R_DYN; },
    end() { stickId = null; stick.x = stick.y = 0; knob.style.transform = ''; stickEl.classList.remove('on'); },
  };
  // con quay: nghiêng máy để liệng khi bay (vùng chết ±5°, tối đa ±30°); iOS phải xin quyền trong một lần chạm
  let gyroX = 0, gyroListening = false;
  function gyroOn(on) {
    MOB.gyro = on; saveMob();
    if (!on) { gyroX = 0; return; }
    const listen = () => { if (gyroListening) return; gyroListening = true; window.addEventListener('deviceorientation', (ev) => { if (!MOB.gyro) return; const g = ev.gamma || 0, a = Math.abs(g); gyroX = a < 5 ? 0 : Math.sign(g) * Math.min(1, (a - 5) / 25); }); };
    if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission) DeviceOrientationEvent.requestPermission().then((r) => { if (r === 'granted') listen(); else { MOB.gyro = false; saveMob(); toast('Không được phép dùng con quay — đã tắt.'); } }).catch(() => { MOB.gyro = false; saveMob(); });
    else listen();
  }
  if (MOB.gyro) gyroOn(true);
  function mobileSettings() {
    const box = document.createElement('div'); box.className = 'hq-life';
    box.innerHTML = `<label class="hq-row"><input type="checkbox" data-k="left" ${MOB.left ? 'checked' : ''}> Tay trái (đảo cần điều khiển và nút ngữ cảnh)</label>
      <label class="hq-row"><input type="checkbox" data-k="fps30" ${MOB.fps30 ? 'checked' : ''}> Khoá 30 khung hình / giây (tiết kiệm pin)</label>
      <label class="hq-row"><input type="checkbox" data-k="gyro" ${MOB.gyro ? 'checked' : ''}> Nghiêng máy để liệng khi bay (con quay)</label>`;
    box.querySelectorAll('input').forEach((i) => { i.onchange = () => { const k = i.dataset.k; if (k === 'gyro') gyroOn(i.checked); else { MOB[k] = i.checked; saveMob(); } rootEl().classList.toggle('hq-left', !!MOB.left); }; });
    panel.open({ title: '⚙ Điều khiển trên điện thoại', body: box });
  }
  // menu nan quạt (☰): gom thanh công cụ dưới thành quạt mở ở góc, chạm ra ngoài để đóng
  { const dock = document.querySelector('.hq-dock');
    if (dock && coarse) {
      dock.classList.add('hq-fan');
      const set = document.createElement('button'); set.type = 'button'; set.className = 'hq-dbtn'; set.innerHTML = '<b aria-hidden="true">⚙</b><span>Điều khiển</span>'; set.onclick = () => { dock.classList.remove('open'); mobileSettings(); }; dock.append(set);
      const tg = document.createElement('button'); tg.type = 'button'; tg.className = 'hq-fan-tg'; tg.setAttribute('aria-label', 'Menu'); tg.textContent = '☰';
      tg.onclick = (e) => { e.stopPropagation(); dock.classList.toggle('open'); buzz('light'); };
      dock.after(tg);
      dock.addEventListener('click', (e) => { if (e.target.closest('.hq-dbtn')) dock.classList.remove('open'); });
      document.addEventListener('pointerdown', (e) => { if (dock.classList.contains('open') && !dock.contains(e.target) && e.target !== tg) dock.classList.remove('open'); });
    } }
  // v4 BẢN ĐỒ THÀNH (G3): bản đồ nhỏ 120 × 120 quanh người chơi (±700 m); bấm → bản đồ cả thành 4,25 km với 41 trạm xe
  // ngựa nội thành (citylayout.stations) — bấm trạm là ngồi xe tới (5 đồng; tân thủ dưới cấp 5 miễn phí).
  const CITY_MAP = { R: 2300 }; // nửa bề rộng bản đồ thành (m)
  let cityBase = null; // ảnh nền thành vẽ một lần (1024 px)
  function drawCity(L, W) {
    const N = 1024, c = document.createElement('canvas'); c.width = c.height = N;
    const g = c.getContext('2d'), k = N / (2 * CITY_MAP.R), P = (x, z) => [N / 2 + x * k, N / 2 + z * k];
    const oct = (a) => { g.beginPath(); for (let i = 0; i <= 8; i++) { const ang = (i / 8) * Math.PI * 2 + Math.PI / 8, r = a / Math.cos(Math.PI / 8); const [x, y] = P(Math.cos(ang) * r, Math.sin(ang) * r); if (i) g.lineTo(x, y); else g.moveTo(x, y); } };
    g.fillStyle = '#2d3a2a'; g.fillRect(0, 0, N, N);
    g.fillStyle = '#5a5444'; oct(L.CITY.A); g.fill();
    g.strokeStyle = '#8a7f66'; for (const r of L.roads()) { g.lineWidth = Math.max(0.6, r.w * k); g.beginPath(); g.moveTo(...P(r.a.x, r.a.z)); g.lineTo(...P(r.b.x, r.b.z)); g.stroke(); }
    g.fillStyle = '#3f6fa0'; g.strokeStyle = '#3f6fa0';
    for (const ch of L.water().channels) { g.beginPath(); ch.pts.forEach((q, i) => { const [x, y] = P(q.x, q.z); if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.lineWidth = Math.max(2, ch.wIn * 2 * k); g.stroke(); }
    { const lk = L.water().lake; g.beginPath(); g.arc(...P(lk.x, lk.z), lk.r * k, 0, 7); g.fill(); }
    g.strokeStyle = '#c9b48e'; g.lineWidth = 3; oct(L.CITY.A); g.stroke();
    g.font = 'bold 15px serif'; g.textAlign = 'center'; g.fillStyle = '#f3df9a';
    for (const l of L.landmarks()) if (l.kind === 'hall' || l.kind === 'port' || l.id === 'sonmon') { const [x, y] = P(l.x, l.z); g.fillText(l.name.replace('Sảnh ', ''), x, y - 8); }
    return c;
  }
  const minimap = (() => {
    const N = 120, c = document.createElement('canvas'); c.width = c.height = N; c.className = 'hq-minimap'; c.title = 'Bản đồ thành — bấm để mở, chọn trạm xe ngựa';
    let L = null;
    Promise.all([import('./citylayout.js'), import('./waterways.js')]).then(([Lm, W]) => { L = Lm; cityBase = drawCity(Lm, W); }).catch(() => {});
    c.onclick = () => openCityMap();
    let at = 0;
    return { el: c, update(now) {
      if (now - at < 400 || !cityBase) return; at = now;
      const g = c.getContext('2d'), w = tileToWorld(player.x, player.y), span = 1400, k = cityBase.width / (2 * CITY_MAP.R);
      g.fillStyle = '#2d3a2a'; g.fillRect(0, 0, N, N);
      g.drawImage(cityBase, cityBase.width / 2 + (w.x - span / 2) * k, cityBase.height / 2 + (w.z - span / 2) * k, span * k, span * k, 0, 0, N, N);
      const x = N / 2, y = N / 2, h = player.h || 0;
      g.fillStyle = '#ffd36a'; g.strokeStyle = '#1a1310'; g.lineWidth = 1; g.beginPath(); g.moveTo(x + Math.sin(h) * 6, y + Math.cos(h) * 6); g.lineTo(x + Math.sin(h + 2.5) * 4, y + Math.cos(h + 2.5) * 4); g.lineTo(x + Math.sin(h - 2.5) * 4, y + Math.cos(h - 2.5) * 4); g.closePath(); g.fill(); g.stroke();
      void L;
    } };
  })();
  const CART_XU = 500; // 5 đồng / chuyến xe ngựa nội thành
  async function openCityMap() {
    const L = await import('./citylayout.js');
    if (!cityBase) cityBase = drawCity(L);
    const box = document.createElement('div'); box.className = 'hq-bigmap';
    const size = Math.min(560, innerWidth - 40), bc = document.createElement('canvas'); bc.width = bc.height = size; bc.style.cursor = 'pointer'; box.append(bc);
    const free = levelInfo(state).level < 5, note = document.createElement('p'); note.className = 'hq-sub';
    note.textContent = `Bấm một trạm xe ngựa (chấm đỏ) để ngồi xe tới — ${free ? 'tân thủ dưới cấp 5 đi miễn phí' : '5 đồng một chuyến'}. Chấm vàng là bạn.`;
    box.append(note);
    const g = bc.getContext('2d'), k = size / (2 * CITY_MAP.R), P = (x, z) => [size / 2 + x * k, size / 2 + z * k];
    g.drawImage(cityBase, 0, 0, size, size);
    const ST = L.stations();
    for (const st of ST) { const [x, y] = P(st.x, st.z); g.fillStyle = '#c8341f'; g.strokeStyle = '#fff3c4'; g.lineWidth = 1.5; g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); g.stroke(); }
    const w = tileToWorld(player.x, player.y); { const [x, y] = P(w.x, w.z); g.fillStyle = '#ffd36a'; g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill(); }
    bc.onclick = (e) => {
      const r = bc.getBoundingClientRect(), mx = (e.clientX - r.left) * (size / r.width), my = (e.clientY - r.top) * (size / r.height);
      let best = null, bd = 14; for (const st of ST) { const [x, y] = P(st.x, st.z), d = Math.hypot(x - mx, y - my); if (d < bd) { bd = d; best = st; } }
      if (!best) return;
      if (!free && !LIFE.spendXu(state, CART_XU)) { toast('Không đủ 5 đồng đi xe.'); return; }
      save(); panel.close(); api.travel(best.x, best.z, `🐎 Xe ngựa tới ${best.name}`);
    };
    panel.open({ title: '🗺 Bản đồ Huyền Thành · trạm xe ngựa', body: box });
  }
  api.openCityMap = openCityMap;
  $('hq-canvas')?.parentElement?.appendChild(minimap.el);
  // vuốt nút Nhảy lên để cất cánh (P16)
  setTimeout(() => { const jb = $('hq-jump'); if (!jb) return; let y0 = null; jb.addEventListener('pointerdown', (e) => { y0 = e.clientY; }); jb.addEventListener('pointermove', (e) => { if (y0 != null && y0 - e.clientY > 36 && !player.flying) { y0 = null; setFlying(true); buzz('medium'); } }); jb.addEventListener('pointerup', () => { y0 = null; }); }, 0);


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

  // -------------------------------------------------------------------------
  // HUYỀN THÀNH LUẬT (law.js): phá công trình ngoài thành (raze.js) → định tội theo bát tự / phong thủy →
  // phạt tiền / giam Thiên Lao / đày Khoáng Sơn (prison.js). Thụ án: không ra khỏi lao / mỏ, không ngự kiếm.
  // -------------------------------------------------------------------------
  PR.registerPrison();
  let lawWarned = false, strikeAt = 0, hpHide = 0, oreAt = 0;
  const hpEl = (() => { const d = document.createElement('div'); d.className = 'hq-rzhp'; d.hidden = true; d.innerHTML = '<span></span><i><b></b></i>'; ($('hq-canvas')?.parentElement || document.body).appendChild(d); return d; })();
  const lawEl = (() => { const d = document.createElement('button'); d.type = 'button'; d.className = 'hq-lawbadge'; d.hidden = true; d.onclick = () => openLawBook(); ($('hq-canvas')?.parentElement || document.body).appendChild(d); return d; })();
  const lawUi = () => import('./law-ui.js');
  function openLawBook() { lawUi().then((m) => panel.open({ title: '⚖ Huyền Thành Luật', body: m.lawBookBody(api) })); }
  function attack() {
    if (player.flying || player.sitting) return;
    const RZ = renderer?.raze; if (!RZ) return;
    if (LAW.serving(state)) { toast('⛓ Đang thụ án — không làm gì được.'); return; }
    const now = performance.now(); if (now - strikeAt < 320) return; strikeAt = now;
    const w = tileToWorld(player.x, player.y);
    const rec = RZ.targetNear(w.x, w.z, player.phys?.y3 ?? 0);
    if (!rec) { toast(cityOctDist(w.x, w.z) < RAZE_OUTSIDE ? '🛡 Trong thành có Bát Quái hộ thành đại trận — không phá được công trình.' : 'Không có công trình nào phá được trong tầm tay.'); return; }
    if (!lawWarned) { lawWarned = true; toast('⚖ Phá công trình ngoài thành là tội phá hoại địa khí (Huyền Thành Luật — phím L).'); }
    player.h = Math.atan2(rec.x - w.x, rec.z - w.z); player.attackAt = now;
    const r = RZ.strike(rec, 12 + (moveIn.sprint ? 6 : 0) + (vipActive(state) ? 4 : 0));
    if (!r) return;
    hpEl.hidden = false; hpEl.firstChild.textContent = r.razed ? 'Sập!' : `Công trình ${r.hp}/${rec.hpMax}`; hpEl.querySelector('b').style.width = `${(r.hp / rec.hpMax) * 100}%`; hpHide = now + 2500;
    buzz(r.razed ? 'heavy' : 'light');
    if (r.razed) { const t = worldToTile(rec.x, rec.z); net.raze(rec.id, t.x, t.y); judge(rec); }
  }
  function judge(rec) {
    let birthChi = '';
    try { const src = chartSource(state); if (src) birthChi = chartOf(src).chart.pillars.year.zhi; } catch (e) { /* chưa lập lá số */ }
    const L = LAW.lawState(state);
    const crime = LAW.assess({ x: rec.x, z: rec.z, size: rec.hpMax, wx: LAW.guaAt(rec.x, rec.z).wx, yong: state.player?.yong, dayGZ: dayGanZhi, birthChi, priors: L.record.length });
    const sen = LAW.convict(state, crime);
    HH.addNghiep(LIFE.lifeState(state), Math.max(5, Math.min(20, Math.round(crime.points / 4)))); // Nghiệp +5…+20 theo án (P19)
    AD.penalize(LIFE.lifeState(state), 'convict'); // Âm Đức −5 (P17)
    save(); updateHud();
    lawUi().then((m) => panel.open({ title: '⚖ Phán quyết · Huyền Thành Phủ', body: m.verdictBody(api, rec, crime, sen) }));
  }
  function placeAt(p, label, sub = 'Xiềng xích loảng xoảng…') {
    if (player.flying) setFlying(false);
    const t = worldToTile(p.x, p.z);
    const go = () => { player.x = t.x; player.y = t.y; player.path = []; target = null; if (player.phys) player.phys.y3 = null; net.teleport(t.x, t.y); };
    if (!label) { go(); return; }
    const ov = document.createElement('div'); ov.className = 'hq-travel'; ov.innerHTML = `<div><b>${esc(label)}</b><span>${esc(sub)}</span></div>`;
    ($('hq-canvas')?.closest('.hq-root') || document.body).appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('on'));
    setTimeout(go, 500); setTimeout(() => ov.classList.remove('on'), 1000); setTimeout(() => ov.remove(), 1600);
  }
  const prisonOf = (S) => (S.kind === 'jail' ? 'jail' : 'mine');
  function toPrison(label) { const S = LAW.serving(state); if (S) placeAt(prisonOf(S) === 'jail' ? PR.jailSpawn() : PR.mineSpawn(), label); }
  function release(msg) { lastServing = null; save(); updateHud(); panel.close(); lawEl.hidden = true; toast(`🕊 ${msg}`); placeAt(tileToWorld(START.x, START.y), 'Ra khỏi chốn lao tù'); }
  function lawSpot(st) {
    const d = st.data;
    if (d.kind === 'ore') {
      const S = LAW.serving(state);
      if (!S || S.kind === 'jail') { toast('Mạch linh khoáng của quan phủ — chỉ phạm nhân khổ sai được đào.'); return; }
      const now = performance.now(); if (now - oreAt < 2500) { toast('⛏ Thở một hơi đã…'); return; } oreAt = now;
      player.attackAt = now; buzz('light');
      const free = LAW.mineOre(state); HH.addNghiep(LIFE.lifeState(state), -1); if (LIFE.lifeState(state).afterlife?.path === 'diangu') LH.shorten(LIFE.lifeState(state), 0.5); save(); // khổ sai: Nghiệp −1 / quặng
      if (free) { release('Đã đào đủ số quặng — mãn hạn khổ sai!'); return; }
      const S2 = LAW.serving(state); toast(`⛏ +1 quặng linh thạch · ${S2.kind === 'perma' ? `đã đào ${S2.mined}` : `${S2.mined}/${S2.quota}`}`); updateLaw();
      return;
    }
    lawUi().then((m) => {
      if (d.id === 'book') panel.open({ title: '⚖ Huyền Thành Luật', body: m.lawBookBody(api) });
      else if (d.id === 'warden') panel.open({ title: '⛓ Cai Ngục Thiên Lao', body: m.wardenBody(api, release) });
      else if (d.id === 'overseer') panel.open({ title: '⛏ Giám Mỏ Khoáng Sơn', body: m.overseerBody(api, release) });
    });
  }
  // mỗi giây: hết hạn giam → thả; rời lao / mỏ khi chưa mãn hạn (vượt ngục) → án gấp đôi, áp giải lại
  let lawTick = 0, lastServing = null, escapeGrace = 0;
  function updateLaw() {
    const S = LAW.serving(state);
    if (!S) { lawEl.hidden = true; return; }
    lawUi().then((m) => { const S2 = LAW.serving(state); lawEl.hidden = !S2; if (S2) lawEl.textContent = m.sentenceLine(S2); });
  }
  function lawStep(dt) {
    if (hpHide && performance.now() > hpHide) { hpHide = 0; hpEl.hidden = true; }
    if ((lawTick -= dt) > 0) return; lawTick = 1;
    const S = LAW.serving(state);
    if (lastServing && !S) { release('Mãn hạn tù — được thả.'); return; }
    lastServing = S;
    if (!S) { lawEl.hidden = true; return; }
    updateLaw();
    const w = tileToWorld(player.x, player.y), at = PR.prisonAt(w.x, w.z);
    if (at === prisonOf(S)) { S.placed = true; escapeGrace = 0; return; }
    if (performance.now() < escapeGrace) return; // đang áp giải (màn chuyển cảnh)
    if (at == null && S.placed) { LAW.escaped(state); save(); toast('🚨 Vượt ngục! Theo Điều 9, án tăng gấp đôi.'); }
    escapeGrace = performance.now() + 2500;
    toPrison(S.placed ? 'Bị bắt giải về' : 'Áp giải về nơi thụ án');
  }

  // -------------------------------------------------------------------------
  // SINH TỒN + TIỀN VĂN (life.js): 3 chỉ số trôi theo giờ chơi, ăn ở quầy cơm / tửu lâu, trọ liêu xá, ngủ,
  // thuế thân mỗi ngày, bù giờ offline, ngất; việc vặt gánh nước (jobs.js — hệ số theo Dụng / Hỷ / Kỵ thần).
  // -------------------------------------------------------------------------
  LP.registerLifePlaces();
  const L = LIFE.lifeState(state);
  const lifeUi = () => import('./life-ui.js');
  const vitEl = (() => {
    const d = document.createElement('button'); d.type = 'button'; d.className = 'hq-vit'; d.title = 'Sinh tồn · Tiền';
    d.innerHTML = '<span class="hq-vit-van"></span><i class="full"><b></b></i><i class="wake"><b></b></i><i class="hp"><b></b></i>';
    d.onclick = () => lifeUi().then((m) => panel.open({ title: '🍚 Sinh tồn', body: m.vitalsBody(api, L) }));
    $('hq-online')?.after(d); return d;
  })();
  // cưỡi phương tiện đi đất (P4): lừa / ngựa / xe ngựa — chọn bậc cao nhất đang có
  function setRide(on) {
    const g = VE.garage(L);
    if (!on) { if (g.ride) { VE.ride(L, null); toast('Xuống ngựa, đi bộ.'); } player.ride = null; updateVitals(); return; }
    const best = [...g.own].filter((id) => VE.VEHICLES[id].ground).sort((a, b) => VE.VEHICLES[b].tier - VE.VEHICLES[a].tier)[0];
    if (!best) { toast('Chưa có phương tiện — mua lừa, ngựa, xe ngựa ở Dịch Trạm.'); return; }
    if (player.flying || player.swim || player.boat || player.sitting || work?.carrying()) { toast('Lúc này không lên ngựa được.'); return; }
    VE.ride(L, best); player.ride = best; toast(`${VE.VEHICLES[best].icon} Cưỡi ${VE.VEHICLES[best].name} — nhanh ×${String(VE.VEHICLES[best].speed).replace('.', ',')} (H để xuống).`); updateVitals();
  }
  $('hq-ride').onclick = () => setRide(!VE.garage(L).ride);
  // NHIỆM VỤ MỆNH (P5 — fatequest.js): chỉ dựng điểm trên máy người đúng Dụng thần, đúng canh giờ, đứng đúng vùng
  const fatePid = (() => { try { return localStorage.getItem('huyenquan:pid') || 'local'; } catch (e) { return 'local'; } })();
  let fateVis = null, fateAt = 0, fateBusy = false;
  let fateToldId = '';
  function fateTick() {
    const now = Date.now(); if (now - fateAt < 1500) return; fateAt = now;
    const w = tileToWorld(player.x, player.y);
    const v = FQ.visibleFor({ L, wx: state.player?.yong?.primary, pid: fatePid, dateStr: S.todayStr(), hour: new Date().getHours(), x: w.x, z: w.z, blocked: blockedByBuilding });
    if (!!v !== !!fateVis || (v && fateVis && v.q.id !== fateVis.q.id)) {
      if (v) { setOpenSpots('fate', [{ id: v.q.id, kind: 'fate', name: v.q.name, verb: `✨ ${v.q.task}`, x: v.spot.x, z: v.spot.z, r: 2.6 }]); if (fateToldId !== `${S.todayStr()}:${v.q.id}`) { fateToldId = `${S.todayStr()}:${v.q.id}`; toast(`✨ Mệnh khí dẫn lối: «${v.q.name}» — chỉ người hợp mệnh như bạn mới thấy. Tới cột sáng.`); } } // v4: mỗi việc mệnh báo một lần / ngày
      else clearOpenSpots('fate');
    }
    fateVis = v;
  }
  function fateSpot() {
    if (!fateVis || fateBusy) return;
    const { q } = fateVis, box = document.createElement('div');
    box.innerHTML = `<div class="hq-life"><p class="hq-sub">${esc(q.task)}. Đứng yên tập trung làm cho xong (8 giây).</p><div class="hq-vbar wake"><span>Tiến độ</span><i style="--v:0%"></i><b>0</b></div><div class="hq-actions"><button class="hq-btn hq-primary" type="button">✨ Bắt tay vào việc</button></div><p class="hq-note">Thưởng ×${q.mul} ngày sống (${FQ.DAY_MIN * q.mul} đồng)${q.gift === 'immune' ? ' + một ngày bách bệnh bất xâm' : ''}. Làm đủ 7 ngày liền mở đặc quyền ${esc(FQ.PERK[q.wx].name)} (${esc(FQ.PERK[q.wx].text)}).</p></div>`;
    const btn = box.querySelector('button'), bar = box.querySelector('i'), num = box.querySelector('b');
    btn.onclick = () => {
      if (fateBusy) return; fateBusy = true; btn.disabled = true;
      const start = performance.now(), p0 = { x: player.x, y: player.y };
      const step = () => {
        if (!fateBusy) return;
        if (Math.hypot(player.x - p0.x, player.y - p0.y) > 1.5) { fateBusy = false; btn.disabled = false; toast('Rời chỗ giữa chừng — làm lại nhé.'); return; }
        const k = Math.min(1, (performance.now() - start) / 8000); bar.style.setProperty('--v', `${k * 100}%`); num.textContent = Math.round(k * 100);
        if (k < 1) { requestAnimationFrame(step); return; }
        fateBusy = false;
        const r = FQ.complete(L, q, S.todayStr(), Date.now(), AD.effects(L).order); if (!r.ok) { toast(r.reason); return; }
        LIFE.earn(L, r.reward); if (r.gift === 'immune') ILL.elixir(L);
        clearOpenSpots('fate'); fateVis = null;
        toast(`✨ Xong «${q.name}» · +${r.reward} đồng${r.gift === 'immune' ? ' · bách bệnh bất xâm 1 ngày' : ''} · chuỗi ${r.streak || 7}/7.`);
        if (r.perk) toast(`🌟 Đủ 7 ngày nhiệm vụ mệnh — mở ${FQ.PERK[r.perk.wx].name}: ${FQ.PERK[r.perk.wx].text} trong 7 ngày.`);
        save(); updateVitals(); panel.close();
      };
      requestAnimationFrame(step);
    };
    panel.open({ title: `✨ ${q.name}`, body: box });
  }
  // HUYỀN HỌC (P19): vận số ngày + sự kiện lành / dữ; Nghiệp tăng khi quỵt nợ quá hạn / bỏ mặc bệnh
  function hhDay(today) {
    let clash = 0, thaiTue = false;
    try {
      const bz = chartOf(chartSource(state)).chart.pillars.year.zhi, ti = todayInfo();
      if (LAW.clash(ti.dayGZ, bz)) clash = -1;
      thaiTue = LAW.clash(ti.yearGZ, bz) || String(ti.yearGZ).slice(-1) === String(bz).slice(-1);
    } catch (e) { /* chưa lập lá số */ }
    if (L.debt > 0 && L.med?.debtSince && Date.now() - L.med.debtSince > 7 * 86400000) HH.addNghiep(L, 1);
    if (L.ill && !L.ill.cureAt && Date.now() - L.ill.at > 86400000) HH.addNghiep(L, 2);
    const ev = HH.rollDay(state, L, today, { clash, thaiTue });
    if (ev.good === 'nhatcua') { const d = Math.random() < 0.03 ? 1000 : 5 + Math.floor(Math.random() * 95); LIFE.earn(L, d); setTimeout(() => toast(`🍀 Nhặt được của rơi — ${COIN.fmt(d * COIN.DONG)}.`), 3500); }
    if (ev.good === 'quynhan') setTimeout(() => toast('🍀 Quý nhân phù trợ — tiền công hôm nay hậu hơn 20%.'), 3500);
    if (ev.bad === 'benh') { const c = ILL.catchIll(L, 'phonghan', 0); if (c) setTimeout(() => toast('🌧 Vận số kém — cảm mạo vặt. Ghé Dược Phòng bốc thang thuốc.'), 4500); }
    if (ev.bad === 'moctui') { const lost = Math.floor(L.xu * (0.05 + Math.random() * 0.05)); L.xu -= lost; setTimeout(() => toast(`🌧 Bị móc túi ở chợ — mất ${COIN.fmt(lost)}.`), 4500); }
    if (ev.bad === 'tainan') { ILL.catchIll(L, 'chanthuong', 0); setTimeout(() => toast('🌧 Sơ ý bị thương — ghé Y Quán.'), 4500); }
    if (ev.blocked) setTimeout(() => toast('🛡 Đã giải hạn — tai họa hôm nay được hoá giải.'), 4500);
  }
  // bảng công đức (Lư Hương: bố thí, sám hối, giải hạn, cúng cô hồn · Hồ Sen: phóng sinh)
  api.meritBody = (where) => {
    const box = document.createElement('div'); box.className = 'hq-life';
    const draw = () => {
      const today = S.todayStr(), cut = RL.realmOf(state, levelInfo(state).raw).id === 'kimdan' || (state.realm?.idx | 0) >= 3 ? 0.7 : 1;
      const ghosts = [...net.others.values()].filter((o) => o.w === 6);
      box.innerHTML = `<h4>☯ Công đức</h4><p class="hq-note">Âm Đức «${HH.AD_LEVELS[HH.adLevel(L)].name}» · Nghiệp «${HH.NG_LEVELS[HH.ngLevel(L)].name}» · thầy nhìn: ${HH.ngWords[HH.ngLevel(L)]}.</p>
        <div class="hq-actions">${where === 'sen' ? `<button class="hq-btn hq-primary" data-a="phongsinh">🐟 Phóng sinh cá · ${HH.PHONGSINH_DONG} đồng</button>` : `
          <button class="hq-btn" data-a="bothi20">🪙 Bố thí 20 đồng</button><button class="hq-btn" data-a="bothi100">🪙 Bố thí 100 đồng</button>
          <label class="hq-row"><input type="checkbox" data-anon checked> Ẩn danh</label>
          <button class="hq-btn" data-a="samhoi">🙏 Sám hối · 30 Phúc Khí</button>
          <button class="hq-btn" data-a="giaihan">🛡 Giải hạn ngày · ${Math.round(30 * cut)} PK</button><button class="hq-btn" data-a="giaihan7">🛡 Giải hạn tuần · ${Math.round(80 * cut)} PK</button>
          ${ghosts.length ? `<button class="hq-btn hq-primary" data-a="cung">🕯 Cúng cô hồn (${ghosts.length} vong hồn đang chờ)</button>` : ''}`}</div>`;
      box.querySelectorAll('[data-a]').forEach((b) => { b.onclick = () => {
        const a = b.dataset.a, anon = !!box.querySelector('[data-anon]')?.checked; let r;
        if (a === 'phongsinh') r = HH.phongsinh(state, L, (d) => LIFE.pay(L, d)), r.ok && toast('🐟 Thả cá về sông — Phúc Khí +2, Âm Đức +1, Nghiệp −1.');
        else if (a.startsWith('bothi')) { r = HH.bothi(state, L, a === 'bothi20' ? 20 : 100, anon, today, (d) => LIFE.pay(L, d)); if (r.ok) toast(`🪙 Bố thí — Phúc Khí +${r.phuc}${r.ad ? ', Âm Đức +0,5 (ẩn danh)' : ''}.`); }
        else if (a === 'samhoi') { r = HH.samhoi(state, L); if (r.ok) toast('🙏 Thành tâm sám hối — Nghiệp −10.'); }
        else if (a.startsWith('giaihan')) { r = HH.giaihan(state, L, a === 'giaihan7', Date.now(), cut); if (r.ok) toast(`🛡 Đã cúng giải hạn (${r.cost} Phúc Khí).`); }
        else if (a === 'cung') { const w0 = tileToWorld(player.x, player.y); const g = ghosts.sort((p, q) => Math.hypot(p.x - player.x, p.y - player.y) - Math.hypot(q.x - player.x, q.y - player.y))[0]; if (g) { net.offerGhost(g.id); r = { ok: true }; } void w0; }
        if (r && !r.ok) toast(r.reason);
        save(); updateHud(); updateVitals(); draw();
      }; });
    };
    draw(); return box;
  };
  // TU LUYỆN (P20): giây tĩnh tọa liên tục trên bồ đoàn (cho đột phá)
  let sitSecs = 0;
  api.meditated = () => sitSecs;
  api.readingToday = () => [0, 1, 2].some((i) => S.caseDone(state, i));
  api.rawLevel = () => levelInfo(state).raw;
  // LUÂN HỒI (P21) ------------------------------------------------------------------------------------------
  if (state.lifeXpStart == null) state.lifeXpStart = state.xp || 0;
  let dyingWarnAt = 0, beastWalk = 0, lastBeastPos = null;
  function applyIncarnation(chart) {
    try {
      const R = chartOf(chart), y = R.yong, accent = y.secondary || y.xi || '';
      state.player = { ...(state.player || {}), yong: { primary: y.primary, accent, ji: y.ji || (y.avoid || [])[0] || '' }, robe: y.primary, accent, incarnation: chart };
    } catch (e) { /* engine lỗi → giữ hồ sơ cũ */ }
    LH.reborn(state, chart); state.lifeXpStart = state.xp || 0;
    const tp = templeOf(WARD_OF_WX[state.player?.yong?.primary]), t = tp ? worldToTile(tp.x, tp.z) : START; // v4: đầu thai ở miếu ứng Dụng thần mới
    player.x = t.x; player.y = t.y; player.path = []; if (player.phys) player.phys.y3 = null; net.teleport(t.x, t.y);
    save(); updateHud(); updateVitals();
    toast(`👶 Đầu thai — lá số mới ${chart.day}/${chart.month}/${chart.year} (Âm phủ cấp, không phải ngày sinh thật của bạn). Dụng thần mới: ${state.player.yong?.primary || '?'}.`);
  }
  function chooseChart(charts) {
    if (charts.length <= 1) { applyIncarnation(charts[0]); return; }
    const box = document.createElement('div'); box.className = 'hq-life';
    box.innerHTML = '<p class="hq-sub">Âm phủ cho chọn một lá số để đầu thai:</p><div class="hq-yc-grid" data-c></div>';
    charts.forEach((c) => { let y = '?'; try { y = chartOf(c).yong.primary; } catch (e) { /* bỏ */ } const b = document.createElement('button'); b.type = 'button'; b.className = 'hq-btn hq-row'; b.textContent = `${c.day}/${c.month}/${c.year} giờ ${c.hour} · Dụng thần ${y}`; b.onclick = () => { panel.close(); applyIncarnation(c); }; box.querySelector('[data-c]').append(b); });
    panel.open({ title: '📜 Chọn lá số kiếp sau', body: box });
  }
  function startDeath(cause) {
    if (L.afterlife || L.dead) return;
    L.dead = true; if (player.flying) setFlying(false); VE.ride(L, null);
    const lifeXp = (state.xp || 0) - (state.lifeXpStart || 0), score = LH.weigh(L, lifeXp);
    const box = document.createElement('div'); box.className = 'hq-life';
    const p1 = LH.pathFor(score), p2 = LH.pathFor(score, true);
    box.innerHTML = `<p class="hq-warn">💀 ${esc(state.player?.name || 'Bạn')} đã ${esc(cause)}.</p><p class="hq-sub">Qua cầu Nại Hà, tới Thập Điện Diêm Vương cân nghiệp: Âm Đức × 3 + Phúc Khí kiếp này / 200 − Nghiệp × 4 = <b>${score}</b> → <b>${esc(p1.name)}</b> (${esc(p1.text)}).</p>
      <p class="hq-note">Canh Mạnh Bà: uống thì quên 70% tay nghề; từ chối thì giữ ký ức nhưng tụt xuống ${esc(p2.name)}. Tiền mang theo mất một nửa; nhà và Tiền Trang là di sản (trừ 20% tang phí); Phúc Khí tích lũy và cảnh giới giữ nguyên.</p>
      <div class="hq-actions"><button class="hq-btn hq-primary" data-s="0">🍵 Uống canh Mạnh Bà</button><button class="hq-btn" data-s="1">✋ Từ chối</button></div>`;
    box.querySelectorAll('[data-s]').forEach((b) => { b.onclick = () => {
      const r = LH.judge(state, L, { lifeXp, refuseSoup: b.dataset.s === '1', name: state.player?.name, cause, realmName: RL.realmOf(state, levelInfo(state).raw).name, gender: state.player?.look === 'hero_f' ? 'nữ' : 'nam' });
      L.dead = false; panel.close(); save();
      toast(`⚖ Cân nghiệp ${r.score} điểm → ${r.path.name}. Mất ${COIN.fmt(r.lost.wallet)} mang theo, ${r.lost.phuc} Phúc Khí${r.lost.funeral ? `, tang phí ${COIN.fmt(r.lost.funeral)}` : ''}.`);
      if (r.interlude) startInterlude(r.path, r.charts); else chooseChart(r.charts);
    }; });
    panel.open({ title: '🌫 Âm phủ — cân nghiệp', body: box });
  }
  let pendingCharts = null;
  function startInterlude(path, charts) {
    pendingCharts = charts;
    if (path.id === 'diangu') { LAW.lawState(state).sentence = { kind: 'mine', quota: 40, mined: 0, label: 'Thập Điện — đào 40 viên nghiệp thạch để qua cầu đầu thai' }; save(); toPrison('Xuống Thập Điện trả nghiệp'); }
    toast(path.id === 'sucsinh' ? '🐾 Kiếp linh thú (tối đa 20 phút) — đi lại giúp đời, mỗi 150 m rút ngắn 1 phút.' : path.id === 'ngaquy' ? '👻 Kiếp quỷ đói (tối đa 25 phút) — chờ người sống cúng cô hồn ở Lư Hương để siêu thoát sớm.' : '⛏ Trả nghiệp ở Thập Điện (tối đa 20 phút) — mỗi viên nghiệp thạch rút ngắn thời gian.');
    rootEl().classList.toggle('hq-ghost', path.id === 'ngaquy');
  }
  function afterlifeTick(secs) {
    if (player.sitting) sitSecs += secs; else sitSecs = 0;
    const A = L.afterlife;
    if (A) {
      if (A.path === 'sucsinh') { const w = tileToWorld(player.x, player.y); if (lastBeastPos) beastWalk += Math.hypot(w.x - lastBeastPos.x, w.z - lastBeastPos.z); lastBeastPos = w; if (beastWalk >= 150) { beastWalk = 0; LH.shorten(L, 1); } }
      if (A.path === 'diangu' && !LAW.serving(state)) LH.shorten(L, 999);
      if (LH.interludeDone(L)) { rootEl().classList.remove('hq-ghost'); if (LAW.lawState(state).sentence?.label?.startsWith('Thập Điện')) LAW.lawState(state).sentence = null; toast('🌸 Đã mãn kiếp ngắn — đầu thai Nhân đạo.'); chooseChart(pendingCharts || LH.fictionalCharts(`${Date.now()}`, 1)); pendingCharts = null; }
      return;
    }
    if (!LH.dying(L)) dyingWarnAt = 0;
    else if (!dyingWarnAt) { dyingWarnAt = Date.now(); /* v4: báo một lần mỗi lần rơi vào cảnh nguy (không lặp 45 giây) */ toast(L.full < 5 ? '⚠ Đói lả — Khí huyết sắp cạn! Tới quầy cơm gần nhất ăn ngay kẻo chết đói.' : '⚠ Bệnh nặng chưa chữa — Khí huyết sắp cạn! Tới Y Quán (gian sau Dược Phòng) ngay.'); buzz('heavy'); }
    rootEl().classList.toggle('hq-dying', LH.dying(L));
  }
  if (L.afterlife?.path === 'ngaquy') rootEl().classList.add('hq-ghost');
  netCung = (ev) => {
    if (ev.t === 'cung' && L.afterlife?.path === 'ngaquy') { LH.shorten(L, 5); toast(`🕯 ${ev.name || 'Một người'} cúng cô hồn cho bạn — siêu thoát sớm 5 phút.`); }
    if (ev.t === 'cung_ok') { AD.adState(L).score += 3; state.phucKhi = (state.phucKhi || 0) + 2; state.xp = (state.xp || 0) + 2; toast('🕯 Cúng cô hồn — Âm Đức +3, Phúc Khí +2.'); save(); updateHud(); }
  };

  // NPC cùng hành nói bóng gió về nhiệm vụ mệnh hôm nay của bạn (chỉ khi chưa làm)
  setHint((n) => { const wx = state.player?.yong?.primary; if (!wx || n.wx !== wx || FQ.fateState(L).done === S.todayStr()) return null; const q = FQ.questFor(S.todayStr(), wx, fatePid); return q ? FQ.hint(q) : null; });
  function updateVitals() {
    { const g = VE.garage(L), rb = $('hq-ride'); rb.hidden = !g.own.some((id) => VE.VEHICLES[id].ground); rb.classList.toggle('on', !!g.ride); player.ride = g.ride; }
    vitEl.querySelector('.hq-vit-van').textContent = `💰 ${COIN.short(L.xu)}`;
    { const A = AD.adState(L), t = AD.tier(L); vitEl.title = `Sinh tồn · Tiền · Âm Đức ${A.score}${t ? ` · ${AD.TIERS[t].name}` : A.paused ? ' · vận khí tạm ngừng' : ''}`; vitEl.dataset.ad = t; }
    for (const k of ['full', 'wake', 'hp']) { const i = vitEl.querySelector(`.${k}`); i.firstChild.style.width = `${L[k]}%`; i.classList.toggle('low', L[k] < 20); }
  }
  // chỗ đang nghỉ (để bù giờ offline): giường liêu xá đã trả tiền khi đứng trong liêu xá, nhà riêng khi chọn «Nghỉ tại đây»
  function restKind() {
    const H = I.homeState(state);
    if (H.spawn === 'home' && H.own) return E.isPhuH(H.own.h) ? 'villa' : 'house';
    const w = tileToWorld(player.x, player.y);
    if (L.bed && L.bed.until > Date.now() && Math.hypot(w.x - LP.DORM.x, w.z - LP.DORM.z) < 14) return L.bed.kind;
    return 'street';
  }
  let lifeAcc = 0, carry = null, lifeDay = '', drownWarned = false;
  // bệnh tật (P3): hành yếu = Dụng thần; phẩm phục đúng hành Dụng thần giảm 30% nguy cơ; ăn đủ 3 bữa +10 miễn dịch
  function illCtx() {
    const yong = state.player?.yong?.primary || null, it = C.ITEM[C.wardrobe(state).equipped.robe];
    const robeMatch = !it || !!it.free || (!!it.set && C.SETS.find((x) => x.id === it.set)?.wx === yong);
    return { weakWx: yong, robeMatch, mealsToday: L.meals?.day === new Date().toDateString() ? L.meals.n : 0, luck: Math.min(0.6, VE.luckToday(L) + RL.phapEff(state, 'kimcuong')) }; // Kim Cương Thân: kháng bệnh (P20)
  }
  const illToast = (c, how) => c && toast(`🤒 Mắc ${ILL.ILLS[c.id].name}${c.sev ? ' nặng' : ''}${how ? ` (${how})` : ''} — đi chậm, làm việc kém, đói mệt nhanh gấp đôi. Chữa ở Dược Phòng (bệnh nhẹ) hoặc Y Quán.`);
  function lifeStart() {
    const rep = LIFE.catchUp(L, Date.now(), { lodging: L.restAt || 'street' });
    if (rep.hours >= 1) {
      const h = Math.round(rep.hours);
      toast(rep.lodging === 'street' ? `Bạn vắng ${h} giờ, ngủ bờ ngủ bụi${rep.robbed ? ` — bị móc túi mất ${COIN.fmt(rep.robbedXu)}` : ''}.` : `Bạn vắng ${h} giờ — đã ngủ ở ${LIFE.LODGING[rep.lodging].name}.`);
    }
    if (rep.slept >= 4 && rep.lodging !== 'street') AD.tickDay(L, { slept: true }); // ngủ đúng chỗ (điều kiện ngày điều độ)
    if (rep.hours >= 4 && rep.lodging === 'villa') { // thức dậy cát tường (biệt thự / biệt phủ, P4)
      const own = I.homeState(state).own, lst = own && E.listing(own.h);
      if (lst) { const sc = homeScore(lst, own.items)?.score ?? 50, end = new Date(); end.setHours(23, 59, 59, 999); const b = VE.wakeBlessing(L, sc, end.getTime()); toast(`🌅 Thức dậy cát tường — may mắn +${Math.round(b.luck * 100)}% cả ngày, Khí huyết +10 (phong thủy ${sc} điểm).`); }
    }
    if (rep.hours >= 1) illToast(ILL.nightIll(L, rep.lodging, LIFE.LODGING[rep.lodging]?.ill || 0, illCtx()), rep.lodging === 'street' ? 'ngủ bờ bụi' : 'giường chung ẩm lạnh');
    if (state.coinGift && !state.coinGift.shown) { state.coinGift.shown = true; toast(`💰 Tiền tệ mới: vàng · bạc · đồng · hào · xu. Phúc Khí thôi là tiền mua sắm (dùng cho Huyền học) — lộc đổi chế độ +${COIN.fmt(state.coinGift.xu)}.`); }
    lifeTax(); save(); updateVitals();
  }
  // ÂM ĐỨC (P17): vào ngày → chốt ngày cũ, gieo quẻ vận khí đầu ngày theo lá số
  function adEnterDay(today) {
    let que = null;
    try { const src = chartSource(state); if (src) { const D = dailyGuidance(chartOf(src)); que = { score: D.score, label: D.score >= 70 ? 'Ngày thuận' : D.score >= 50 ? 'Ngày bình' : 'Ngày nên thủ' }; } } catch (e) { /* chưa lập lá số */ }
    if (L.ill && !L.ill.cureAt && Date.now() - L.ill.at > 86400000 && AD.adState(L).day?.date !== today) AD.penalize(L, 'neglect'); // bỏ mặc bệnh quá 24 giờ
    const r = AD.enterDay(L, today, que);
    if (!r.newDay) return;
    hhDay(today);
    const A = AD.adState(L), t = AD.tier(L);
    if (r.closed?.[0] === true) toast(`☯ Hôm qua sinh hoạt điều độ — Âm Đức +1 (${A.score}) · chuỗi ${A.streak} ngày${t ? ` · ${AD.TIERS[t].name}` : ''}.`);
    else if (A.paused) toast('☯ Hôm qua chưa điều độ (chơi ≥ 20 phút, ăn ≥ 2 bữa, ngủ đúng chỗ) — vận khí tạm ngừng, cần 2 ngày điều độ liền để bật lại.');
    if (que) setTimeout(() => toast(`🎴 Quẻ vận khí hôm nay: ${que.label} (${que.score} điểm) — xem Bảng Lịch để biết giờ tốt.`), 2200);
  }
  function lifeTax() {
    const today = S.todayStr(); if (today === lifeDay) return; lifeDay = today;
    digestStart(6000, '🌅 Ngày mới');
    adEnterDay(today);
    const t = LIFE.dailyTax(L, LIFE.wealthDong(L), today);
    if (t.due) toast(t.paid ? `🏛 Thuế thân hôm nay: ${t.due} đồng.` : `🏛 Không đủ tiền nộp thuế thân (${t.due} đồng) — ghi nợ.`);
    { // bảo trì xe + nhà (P4) — nhà mua bằng Phúc Khí / Ngọc miễn 30 ngày đầu
      const own = I.homeState(state).own, lst = own ? E.listing(own.h) : null;
      if (own && !own.at) own.at = Date.now();
      const house = lst ? { tier: lst.tier, free: !!(own.paid?.phuc || own.paid?.ngoc) && Date.now() - own.at < 30 * 86400000 } : null;
      const u = VE.dailyUpkeep(L, today, { pay: (a) => LIFE.pay(L, a), addDebt: (a) => ILL.addDebt(L, a), house });
      if (u.total) toast(`🧾 Bảo trì hôm nay: ${u.total} đồng${u.house ? ` (nhà ${u.house})` : ''}.`);
      for (const z of u.seized) toast(`🐴 Nợ bảo trì 3 ngày — Dịch Trạm giữ ${VE.VEHICLES[z.id].name}, bán nửa giá trừ nợ.`), ILL.repay(L, z.refund, () => true);
    }
    const dd = ILL.dailyDebt(L, today);
    if (dd.interest) toast(`📜 Nợ ${L.debt} đồng · lãi hôm nay ${dd.interest} đồng (2%/ngày, trần 3 lần gốc).`);
    if (dd.court && !LAW.serving(state)) { // Điều 12: nợ > 1 lượng quá 7 ngày → khổ sai trừ nợ
      const S = LAW.debtSentence(state, L.debt, ILL.ORE_DONG); save();
      toast(`⚖ Nha Môn xử nợ quá hạn: ${S.label}.`); setTimeout(() => toPrison('Áp giải xuống Khoáng Sơn trừ nợ'), 1200);
    }
  }
  function lifeStep(dt) {
    rememberPos();
    lifeAcc += dt; if (lifeAcc < 1) return;
    const secs = lifeAcc; lifeAcc = 0;
    const moving = player.moving && !player.sitting;
    const activity = player.swim ? 'swim' : carry ? 'carry' : moving && moveIn.sprint ? 'run' : moving ? 'walk' : 'idle';
    if (carry && moving && moveIn.sprint) carry.run += secs;
    if (carry && player.flying) { carry = null; toast('Nước đổ hết khi ngự kiếm — gánh lại nhé.'); }
    const hour = new Date().getHours();
    if (moving || player.sitting) AD.tickDay(L, { minutes: secs / 60 }); // phút chơi thật (đứng treo máy không tính)
    if (VE.garage(L).ride && (player.swim || player.boat || player.flying || tileToWorld(player.x, player.y).x > ROOM_X0 - 40)) { VE.ride(L, null); player.ride = null; updateVitals(); } // xuống ngựa khi bơi / lên thuyền / vào nhà
    const rm = VE.rideMods(L);
    const r = LIFE.tick(L, secs, { activity, hour, drain: (moving && !player.flying ? rm.drain : 1) * (1 - RL.phapEff(state, 'tichcoc')) }); // Tích Cốc (P20)
    if (player.swim && (player.stamina ?? 100) <= 0.5) { L.hp = Math.max(0, L.hp - MV.DROWN_HP * secs); if (!drownWarned) { drownWarned = true; toast('🌊 Kiệt sức giữa dòng — đang đuối nước! Khí huyết tụt nhanh, bơi vào bờ ngay.'); } } else drownWarned = false; // đuối nước (P14)
    if (player.flying) { // ngự kiếm cơ bản hao Tỉnh 6 / phút; phi kiếm thượng phẩm / linh hạc thì không
      if (!rm.flyFree && !VE.hacFlying(L)) L.wake = Math.max(0, L.wake - VE.FLY_WAKE_PER_MIN * secs / 60);
      if (!unlocked(state, 'fly') && !rm.flyFree && !VE.hacFlying(L)) { setFlying(false); toast('🕊️ Linh hạc mỏi cánh — đáp xuống nghỉ 3 phút.'); }
    }
    const ir = ILL.tickIll(L, secs, { ...illCtx(), hour, swimming: !!player.swim });
    if (ir.caught) illToast(ir.caught, ir.caught.id === 'suynhuoc' ? 'đói mệt kéo dài' : player.swim ? 'bơi đêm' : 'khí huyết suy');
    if (ir.worse) toast('🤒 Phong hàn chuyển nặng — phải sang Y Quán.');
    if (ir.healed) toast(`💚 Đã khỏi ${ILL.ILLS[ir.healed.id].name}.`);
    if (hour >= 1 && hour < 5 && moving) illToast(ILL.markNightAwake(L, S.todayStr()), 'thức trắng hai đêm liền');
    L.last = Date.now(); L.restAt = restKind();
    if (r.fainted && !AD.adState(L).saveReady && LH.causeOf(L).kind === 'death') { startDeath(LH.causeOf(L).cause); }
    else if (r.fainted && AD.trySave(L)) toast('☯ Phúc Trạch Vô Cương — Âm Đức che chở, bạn tỉnh lại (Khí huyết 1), không mất tiền thuốc. Âm Đức về 0.');
    else if (r.fainted) {
      const f = LIFE.faint(L); carry = null;
      if (player.flying) setFlying(false);
      toast(`😵 Bạn ngất đi vì kiệt sức. Được khiêng về Y Quán cấp cứu — viện phí ${f.fee} đồng${f.owed ? ` (thiếu ${f.owed} đồng, ghi nợ)` : ''}.`);
      const t = START; player.x = t.x; player.y = t.y; player.path = []; target = null; if (player.phys) player.phys.y3 = null; net.teleport(t.x, t.y);
    }
    if (Math.floor(Date.now() / 1000) % 15 === 0) save();
    lifeTax(); updateVitals(); fateTick(); afterlifeTick(secs);
  }
  const lifeMods = () => LIFE.mods(L);
  // VIỆC LÀM (P2 — work.js): bảng Chiêu công trong tiệm, ca làm, mini-game, phu áp hàng, mỏ dân sự. Máy chủ chấm lương.
  work = createWork({
    onShift: () => api.tut?.('shift'),
    api, net, L, player, tileToWorld, toast, buzz, panel, save, updateVitals, anchor: vitEl,
    root: () => $('hq-canvas')?.closest('.hq-root') || document.body,
    place: (p, label) => placeAt(p || tileToWorld(START.x, START.y), label, 'Bánh xe goòng lạch cạch trên ray…'),
  });
  // THUYỀN (boat-ui.js / boats.js): bến thuê ven hào, kênh, sông, hồ; lái tự do, dòng chảy, gió, tĩnh không cầu
  registerDocks();
  boat = createBoatControl({
    player, L, toast, panel, save, updateVitals, keys, stick, get moveIn() { return moveIn; }, // moveIn khai báo phía dưới
    where: () => tileToWorld(player.x, player.y),
    place: (x, z, quiet) => { const t = worldToTile(x, z); player.x = t.x; player.y = t.y; if (!quiet) { player.path = []; target = null; if (player.phys) player.phys.y3 = null; net.teleport(t.x, t.y); } },
  });
  function lifeSpot(st) {
    const d = st.data;
    if (d.id === 'well') {
      if (carry) { toast('Đang gánh nước rồi — mang về quầy cơm.'); return; }
      if (player.flying) return;
      carry = { at: performance.now(), run: 0 }; buzz('light');
      toast('🪣 Đã múc đầy hai thùng. Gánh về Quầy cơm Sơn Môn — đi đều chân, chạy là sánh nước.');
      return;
    }
    if (d.id === 'stall' && carry) {
      const secs = (performance.now() - carry.at) / 1000;
      const perf = J.waterPerf(LP.WATER_DIST, secs, carry.run, BASE_SPEED * 1.6);
      const job = J.JOBS.ganhnuoc;
      const res = J.settle(job, perf, { yong: state.player?.yong, workMod: LIFE.mods(L).work, life: L });
      carry = null;
      L.wake = Math.max(0, L.wake - res.wake);
      if (res.mishap === 'nga') { L.hp = Math.max(0, L.hp - 6); toast('💥 Trượt chân ngã, nước đổ hết, trầy cả gối (Khí huyết −6).'); }
      else if (res.mishap === 'hong') toast('🪣 Thùng nứt rò, nước về tới nơi chỉ còn đáy — không được công.');
      else if (res.mishap === 'phat') toast('Chủ quầy chê nước đục, không trả công chuyến này.');
      else { const got = LIFE.earn(L, res.pay); toast(`💧 Giao nước · ${got ? `+${COIN.fmt(got)}` : 'không được công'} (hiệu suất ${Math.round(res.perf * 100)}% · ${J.REL[res.rel].name})`); }
      save(); updateVitals(); buzz('light');
      return;
    }
    lifeUi().then((m) => {
      if (d.menu) panel.open({ title: `${d.menu === 'tuu' ? '🍲' : '🍚'} ${d.name}`, body: m.menuBody(api, L, d.menu, d.name, (f) => { toast(`${f.icon} ${f.name} · −${f.price} đồng`); if ((f.full || 0) >= 25) AD.tickDay(L, { meal: true }); save(); updateVitals(); }) });
      else if (d.id === 'dorm') panel.open({ title: '🛏 Liêu xá Sơn Môn', body: m.dormBody(api, L, (h, kind) => {
        panel.close();
        m.sleepOverlay($('hq-canvas')?.closest('.hq-root') || document.body, h, () => { LIFE.sleep(L, h, kind); L.wake = Math.min(100, L.wake + LIFE.LODGING[kind].wake * h * RL.phapEff(state, 'anthan')); if (h >= 4) AD.tickDay(L, { slept: true }); save(); updateVitals(); toast(`Ngủ ${h} canh giờ · Tỉnh ${Math.round(L.wake)}.`); });
      }) });
    });
  }

  // --- di chuyển tự do (motion.js): toạ độ mét cho lõi vật lý, đổi lại ô sau mỗi bước
  const moveIn = { sprint: false, jump: false, hold: false };
  let climbNagAt = 0; const nagSeen = {};
  function freeStep(dxW, dzW, mag, dt) {
    const w = tileToWorld(player.x, player.y);
    const P = player.phys || (player.phys = { x: w.x, z: w.z });
    P.x = w.x; P.z = w.z;
    const canClimb = vipActive(state);
    const lm = lifeMods(); P.staminaCap = lm.staminaCap;
    const ww0 = MV.waterWalkOf({ level: levelInfo(state).level, yong: state.player?.yong, owned: C.wardrobe(state).owned, everPerk: !!L.fate?.everPerk }); // đạp nước (P14)
    const ww = ww0 && ww0.stamina ? { ...ww0, stamina: ww0.stamina * (1 - RL.phapEff(state, 'thuythuong')) } : ww0; // pháp môn Thủy Thượng Phiêu (P20)
    const r = MO.moveFree(P, { dx: dxW, dz: dzW, mag, sprint: moveIn.sprint && lm.sprint, jump: moveIn.jump, hold: moveIn.hold, canClimb, ww }, dt, BASE_SPEED * 1.6 * (I.activeBuff(state, 'speed') ? 1.6 : 1) * lm.speed * (carry ? 0.8 : 1) * (player.flying ? VE.rideMods(L).flyMul : VE.rideMods(L).speed));
    moveIn.jump = false;
    if (moveIn.sprint && (dxW || dzW)) P.stamina = Math.min(P.staminaCap ?? 100, P.stamina + 14 * dt * RL.phapEff(state, 'khinhcong')); // Khinh Công: chạy đỡ hao (P20)
    const t = worldToTile(P.x, P.z); player.x = t.x; player.y = t.y;
    player.alt = P.alt; player.air = P.air; player.swim = P.swim; player.wade = P.wade; player.y3 = P.y3; player.waterY = P.waterY; player.climb = !!P.climb; player.gliding = P.gliding; player.stamina = P.stamina; player.waterWalk = P.waterWalk ? ww : null;
    if (P.wwLost && !wwLostSeen) { wwLostSeen = true; toast('💦 Kiệt sức — mất phép đạp nước, rơi xuống nước. Lên bờ nghỉ cho hồi sức.'); } else if (!P.wwLost) wwLostSeen = false;
    if (P.splash) { player.splash = (player.splash || 0) + P.splash; P.splash = 0; }
    // v4: mỗi lời nhắc chỉ một lần mỗi phiên (trước đây lặp 8 / 20 giây)
    if (r.blockedMsg === 'bank' && !nagSeen.bank) { nagSeen.bank = 1; toast('Bờ kè cao quá — hồi sức rồi đu lên, hoặc bơi tới bậc bến đá.'); }
    if (r.blockedMsg === 'climb' && !canClimb && !nagSeen.climb) { nagSeen.climb = 1; toast('👑 Leo trèo, đu bám công trình dành cho Chân Nhân (VIP).'); }
    updateStamina();
    return r;
  }
  const staminaEl = (() => { const d = document.createElement('div'); d.className = 'hq-stamina'; d.innerHTML = '<i></i>'; d.hidden = true; ($('hq-canvas')?.parentElement || document.body).appendChild(d); return d; })();
  function updateStamina() { const v = player.stamina ?? 100; staminaEl.hidden = v >= 99.5; staminaEl.firstChild.style.width = `${v}%`; }
  // nút nhảy cho màn cảm ứng (cạnh nút ngự kiếm)
  { const fly = $('hq-fly'); if (fly) { const b = document.createElement('button'); b.type = 'button'; b.className = fly.className.replace(/on/, ''); b.id = 'hq-jump'; b.textContent = '⤒'; b.title = 'Nhảy · giữ để lượn'; b.addEventListener('pointerdown', (e) => { e.preventDefault(); moveIn.jump = true; moveIn.hold = true; }); for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) b.addEventListener(ev, () => { moveIn.hold = false; }); fly.after(b); const x = document.createElement('button'); x.type = 'button'; x.className = b.className; x.id = 'hq-strike'; x.textContent = '⚒'; x.title = 'Phá công trình ngoài thành (X) — phạm luật'; x.addEventListener('pointerdown', (e) => { e.preventDefault(); attack(); }); b.after(x); } }

  let freeDone = false, wwLostSeen = false;
  const flight = FL.newFlight(); // máy trạng thái bay 5 bước (P15)
  const mountRarity = () => C.ITEM[C.wardrobe(state).equipped.mount]?.rarity || 1;
  function step(dt) {
    lawStep(dt);
    lifeStep(dt);
    work?.step(dt);
    freeDone = false;
    stepMove(dt);
    if (!player.sitting && !player.flying && !freeDone && tileToWorld(player.x, player.y).x <= ROOM_X0 - 40) freeStep(0, 0, 0, dt); // trọng lực, nổi trên nước, tuột khỏi vách
  }
  function stepMove(dt) {
    if (player.sitting) { player.moving = false; return; }
    if (boat?.step(dt)) { freeDone = true; return; } // đang lái thuyền
    const inRooms = tileToWorld(player.x, player.y).x > ROOM_X0 - 40; // phòng nội thất: đi như cũ
    if (player.flying) {
      // bay: nhanh gấp 4, vượt mọi vật cản; độ cao 3–420 m trên mặt đất
      player.alt = Math.min(420, Math.max(3, player.alt + ((altCtl.up ? 1 : 0) - (altCtl.down ? 1 : 0)) * 26 * dt));
    }
    let dx = 0, dy = 0, mag = 1;
    const SPEED = BASE_SPEED * (I.activeBuff(state, 'speed') ? 1.6 : 1); // Tốc Hành Tán (Dược Phòng)
    if (keys.has('u')) dy -= 1;
    if (keys.has('d')) dy += 1;
    if (keys.has('l')) dx -= 1;
    if (keys.has('r')) dx += 1;
    if (player.flying && MOB.gyro && gyroX && !stick.x) stick.x = gyroX * 0.9; // liệng bằng con quay
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
      else if (!inRooms) { const n2 = Math.hypot(dx, dy); freeStep(dx / n2, dy / n2, mag, dt); freeDone = true; }
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
      const mv = BASE_SPEED * (I.activeBuff(state, 'speed') ? 1.6 : 1) * lifeMods().speed * (carry ? 0.8 : 1) * (player.flying ? VE.rideMods(L).flyMul * FL.speedMul(flight, mountRarity(), RL.flyExtra(state)) : VE.rideMods(L).speed) * dt; // đói / mệt / gánh nước: đi chậm
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
    if (MOB.fps30 && lastTs && ts - lastTs < 30) { raf = requestAnimationFrame(loop); return; } // khoá 30 khung hình (P16)
    lastTs = ts;
    step(dt);
    minimap.update(ts);
    { const w0 = tileToWorld(player.x, player.y), sp = flight.lx == null ? 0 : Math.hypot(w0.x - flight.lx, w0.z - flight.lz) / Math.max(dt, 1e-3); flight.lx = w0.x; flight.lz = w0.z; FL.step(flight, { want: !!player.flying, speedH: sp, sprint: !!moveIn.sprint, vy: altCtl.down ? -7 : 0, alt: player.alt || 0 }, dt); player.fs = flight.s; }
    net.tick(dt, { x: player.x, y: player.y, h: player.sitting ? Math.PI : (player.boat ? player.boat.h : (player.h || 0)), sitting: player.sitting, alt: Math.max(0, player.alt || 0), w: L.afterlife?.path === 'ngaquy' ? 6 : L.afterlife?.path === 'sucsinh' ? 7 : player.boat ? 3 : player.ride ? 4 : player.waterWalk ? 5 : player.swim ? 2 : player.wade ? 1 : 0, b: player.boat ? player.boat.typeIdx : player.ride ? ['lua', 'ngua', 'xengua'].indexOf(player.ride) : player.waterWalk ? MV.FX_CODE[player.waterWalk.fx] : 0, fs: flight.s }); // w 4 cưỡi (P4) · 5 đạp nước (P14)
    const near = player.flying ? null : nearestStation(player);
    updatePrompt(near);
    const now = new Date();
    if (ts - minuteTick > 60000) { minuteTick = ts; refreshDay(); }
    const today = S.todayStr(now);
    renderer.frame({
      time: ts, player, state, now, near, target, reduced, carry: !!carry, parcel: !!work?.carrying(),
      night: nightLevelOf(now), dayGanZhi, lunarText,
      todayLanterns: state.lanterns.filter((l) => S.todayStr(new Date(l.at)) === today),
      lanterns: (state.xp || 0) >= 100,
      peachBloom: (state.xp || 0) >= 250 || now.getMonth() < 3,
      crane: (state.xp || 0) >= 500,
      teaColor,
      others: net.others.values(),
      incense: net.status === 'online' ? net.incense(now.getTime()) : [],
      selfBubble,
      masterBubble,
      selfEmote,
      giatri: unlockedList(state),
      cos: cosNow(),
      cases: [0, 1, 2].map((i) => ({ id: `an${i}`, npc: todayNpc(i), done: S.caseDone(state, i) })),
      fate: fateVis?.spot || null,
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

  // --- Phần II: hồ sơ mệnh rút gọn (gửi cho thầy mệnh lý — KHÔNG ngày giờ sinh dạng lịch) + Thực căn (P10, §14.3 / §16.1)
  const GANW = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' };
  const GAN_VN = { 甲: 'Giáp', 乙: 'Ất', 丙: 'Bính', 丁: 'Đinh', 戊: 'Mậu', 己: 'Kỷ', 庚: 'Canh', 辛: 'Tân', 壬: 'Nhâm', 癸: 'Quý' };
  const ZHI_VN = { 子: 'Tý', 丑: 'Sửu', 寅: 'Dần', 卯: 'Mão', 辰: 'Thìn', 巳: 'Tỵ', 午: 'Ngọ', 未: 'Mùi', 申: 'Thân', 酉: 'Dậu', 戌: 'Tuất', 亥: 'Hợi' };
  const WXN = { 木: 'Mộc', 火: 'Hỏa', 土: 'Thổ', 金: 'Kim', 水: 'Thủy' };
  function econChart() { try { const src = chartSource(state); return src ? chartOf(src) : null; } catch (e) { return null; } }
  function econProfile() {
    const R = econChart(); if (!R) return null;
    const P = R.chart.pillars, y = state.player?.yong || {}, gz = (p) => `${GAN_VN[p.gan] || p.gan} ${ZHI_VN[p.zhi] || p.zhi}`;
    const lv = String(R.strength?.level || ''), strong = /nhược/i.test(lv) ? 'thân nhược' : /vượng/i.test(lv) ? 'thân vượng' : 'trung hòa';
    const dy = (R.dayun || []).find((d) => { const yr = new Date().getFullYear(); return d.startYear <= yr && yr < d.startYear + 10; });
    return { dm: `${GAN_VN[P.day.gan] || ''} ${WXN[GANW[P.day.gan]] || ''}`.trim(), strong, pct: R.wx.pct, yong: { primary: y.primary, accent: y.accent || y.secondary || y.xi, ji: y.ji }, dayun: dy ? `${GAN_VN[dy.gan] || ''} ${ZHI_VN[dy.zhi] || ''}` : '', job: '', wealth: LIFE.tierOf(LIFE.wealthDong(L)), health: L.ill ? 'đang bệnh' : 'khỏe', pillars: [P.year, P.month, P.day, P.time].filter(Boolean).map(gz) };
  }
  function econSyncTc() { const R = econChart(); if (!R) return; const y = state.player?.yong; const tc = thucCan({ dayWx: GANW[R.chart.pillars.day.gan], yong: y ? { primary: y.primary, accent: y.accent || y.secondary || y.xi, ji: y.ji } : null, pct: R.wx.pct }); econ.call('set_tc', { tc, yong: y ? { primary: y.primary } : null }).catch(() => {}); }
  function openEcon(tab = 'kho') { import('./econ-ui.js').then((m) => panel.open({ title: '🎒 Kho đồ · sinh kế', body: m.econBody(api, econ, { tab }) })); }
  $('hq-econ').onclick = () => openEcon('kho');
  setTimeout(econSyncTc, 4000);

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
  // --- hướng dẫn tân thủ (tutorial.js) ---------------------------------------------------------------------
  const tutEl = (() => { const d = document.createElement('div'); d.className = 'hq-tut'; d.hidden = true; ($('hq-game') || document.body).appendChild(d); return d; })();
  function tutUi() {
    const st = TUT.current(state);
    if (!st) { tutEl.hidden = true; return; }
    const i = TUT.tutState(state).step;
    tutEl.innerHTML = `<b role="button" tabindex="0" title="Thu gọn / mở">🧭 Tân thủ ${i + 1}/${TUT.STEPS.length} · ${esc(st.title)}</b><p>${esc(st.hint)}</p><div class="hq-actions">${st.station ? '<button class="hq-btn hq-primary" type="button" data-a="go">Dẫn đường</button>' : ''}<button class="hq-btn" type="button" data-a="skip">Bỏ qua hướng dẫn</button></div>`;
    tutEl.querySelector('[data-a=go]')?.addEventListener('click', () => api.goTo(st.station));
    tutEl.querySelector('[data-a=skip]').onclick = () => { TUT.skip(state); save(); tutUi(); };
    tutEl.querySelector('b').onclick = () => tutEl.classList.toggle('mini');
    // màn hẹp: hiện đầy đủ 6 giây rồi thu gọn còn một dòng (chạm để mở lại) — không che cảnh
    tutEl.classList.remove('mini'); clearTimeout(tutUi.t); if (innerWidth < 760) tutUi.t = setTimeout(() => tutEl.classList.add('mini'), 6000);
    tutEl.hidden = false;
  }
  api.tut = (ev) => {
    const r = TUT.advance(state, ev); if (!r) return;
    const got = S.grantTutorial(state, r.reward);
    after(got, r.finished ? 'hoàn thành hướng dẫn tân thủ' : `tân thủ: ${TUT.STEPS[r.step - 1].title}`);
    tutUi();
  };

  // --- nơi xuất hiện (spawn.js) ----------------------------------------------------------------------------
  function homeSpawnPos() {
    const H = I.homeState(state); if (!H.own) return null;
    try {
      if (E.isPhuH(H.own.h)) { const m = estateByH(H.own.h), mb = m.layout.buildings[0], p = m.toWorld(mb.x, mb.z + 1); return { x: p.x, z: p.z, name: m.name || 'biệt phủ' }; }
      const r = roomByKey(`est:${H.own.h}`); if (r) { const q = insideOf(r); return { x: q.x, z: q.z - 1.5, name: r.title || 'nhà riêng' }; }
    } catch (e) { /* nhà không còn trong bố cục */ }
    return null;
  }
  function templeOf(ward) { const e = enterables().find((x) => x.kind === 'temple' && x.g === ward && String(x.key).startsWith('lm:')); return e ? { x: e.back.x, z: e.back.z, name: e.name } : null; }
  function spawnList() {
    const T = TUT.tutState(state), firstTime = !state.lastPos && !T.done && !T.skipped && !TUT.isVeteran(state);
    const plaza = tileToWorld(START.x, START.y);
    return spawnOptions({ lastPos: state.lastPos, home: homeSpawnPos(), templeOf, plaza, yong: state.player?.yong?.primary, firstTime });
  }
  let lastPosAt = 0;
  function rememberPos() {
    const now = performance.now(); if (now - lastPosAt < 10000) return; lastPosAt = now;
    const w = tileToWorld(player.x, player.y);
    if (!player.flying && savablePos(w.x, w.z, ROOM_X0)) { state.lastPos = { x: Math.round(w.x * 10) / 10, z: Math.round(w.z * 10) / 10, at: Date.now() }; S.saveState(state, storage); } // lưu máy (đám mây theo nhịp save thường)
  }
  addEventListener('pagehide', () => { lastPosAt = 0; rememberPos(); save(); });

  async function enter(spawnChoice = null) {
    if (spawnChoice && !Number.isFinite(spawnChoice.x)) spawnChoice = null; // gọi từ onclick: tham số là sự kiện chuột
    $('hq-gate').hidden = true;
    $('hq-game').hidden = false;
    if (!renderer) {
      const ld = $('hq-loading');
      ld.hidden = false;
      renderer = await createScene();
      if (coarse) renderer.setStickHook?.(dynStick); // cần điều khiển động (P16)
      syncRooms();
      refreshEstateSigns();
      // v4 (G3): xuất hiện theo lựa chọn ở cổng (chỗ lần trước / nhà / miếu hợp mệnh / sân Sơn Môn; lần đầu = Tân Thủ)
      { const o = spawnChoice || spawnList()[0]; if (o) { const t = worldToTile(o.x, o.z); player.x = t.x; player.y = t.y; } }
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
    setTimeout(enableHd, 1500); // ảnh mặt / áo 2048 của nhân vật nạp sau khi đã vào
    ld.classList.add('hq-fadeout'); setTimeout(() => { ld.hidden = true; ld.classList.remove('hq-fadeout'); }, 700); // mở màn mờ dần, không tắt phụt
    if (TUT.isVeteran(state) && !TUT.tutState(state).step && !state.lastPos) TUT.skip(state); // người chơi cũ: không bắt làm tân thủ
    if (state.player?.birth) api.tut('chart');
    tutUi();
    lifeStart();
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
  // -------------------------------------------------------------------------
  // TÀI KHOẢN: nút ở cổng + nút ☁ trên HUD; đăng nhập xong → đồng bộ (đẩy lên / chọn bản / tải bản mới hơn)
  // -------------------------------------------------------------------------
  const acctBtn = (() => { const b = document.createElement('button'); b.type = 'button'; b.id = 'hq-acct'; b.className = 'hq-hbtn icon'; b.onclick = () => openAccount(); $('hq-sound')?.before(b); return b; })();
  const gateAcct = (() => { const b = document.createElement('button'); b.type = 'button'; b.className = 'hq-btn hq-gate-acct'; b.onclick = () => openAccount(); $('hq-gate').querySelector('.hq-gate-body')?.after(b); return b; })();
  const accountUi = () => import('./account-ui.js');
  function updateAccountUi() {
    const me = account.me;
    acctBtn.textContent = me ? (account.synced ? '☁' : '⛅') : '👤';
    acctBtn.setAttribute('aria-label', me ? `Tài khoản ${me.name || ''}` : 'Đăng nhập · lưu tài khoản');
    acctBtn.hidden = account.native;
    gateAcct.hidden = account.native || !account.ready;
    gateAcct.textContent = me ? `☁ ${me.name || 'Tài khoản'} · ${account.synced ? 'đã lưu' : 'đang lưu'}` : '👤 Đăng nhập · lưu tài khoản';
    const fine = $('hq-gate').querySelector('.hq-fine');
    if (fine) fine.textContent = me ? 'Tiến độ lưu theo tài khoản. Ngày giờ sinh vẫn chỉ ở trên máy bạn. Nội dung để tham khảo và chiêm nghiệm.' : 'Dữ liệu chỉ lưu trên máy bạn. Nội dung để tham khảo và chiêm nghiệm.';
  }
  const accHooks = {
    async onLogin() { panel.close(); toast(`☁ Đã đăng nhập${account.me?.name ? ` · ${account.me.name}` : ''}.`); await syncAccount(); },
    onLogout() {
      // nhà riêng thuộc TÀI KHOẢN (đã chuyển khi liên kết): máy này về chế độ khách thì không còn giữ nhà — đăng nhập lại để lấy lại.
      // (Không để syncEstate tưởng nhà «đã thuộc người khác» rồi hoàn tiền — tránh nhân đôi tiền.)
      const H = I.homeState(state); if (H.own) { H.own = null; H.spawn = null; save(); }
      panel.close(); toast('Đã đăng xuất. Nhà riêng và tiến độ tài khoản sẽ về lại khi đăng nhập.'); updateAccountUi(); if (net.status !== 'off') { net.stop(); net.start(); }
    },
  };
  function openAccount() { accountUi().then((m) => panel.open({ title: '☁ Tài khoản', body: m.accountBody({ panel, toast }, account, accHooks) })); }
  async function syncAccount() {
    const r = await account.sync();
    if (r.action === 'reload') { location.reload(); return; }
    if (r.action === 'choose') {
      const m = await accountUi();
      panel.open({ title: '☁ Chọn bản lưu', body: m.chooseBody(state, r.cloud, async (k) => {
        if (k === 'cloud') { account.useCloud(r.cloud, r.rev); location.reload(); return; }
        const x = await account.keepLocal(r.rev); panel.close(); toast(x.ok ? '☁ Đã lưu tiến độ máy này lên tài khoản.' : 'Chưa lưu được — thử lại trong bảng tài khoản.');
        reconnectAsAccount();
      }) });
      return;
    }
    updateAccountUi();
    reconnectAsAccount();
  }
  // đổi mã công khai sang tài khoản (nhà riêng, khen nhà…) — nối lại nếu đang online
  function reconnectAsAccount() { if (net.status !== 'off') { net.stop(); net.start(); } }
  async function startAccount() {
    const q = new URLSearchParams(location.search), back = q.get('auth');
    if (back) { q.delete('auth'); history.replaceState(null, '', location.pathname + (q.toString() ? `?${q}` : '') + location.hash); }
    await account.init();
    updateAccountUi();
    if (back === 'fail') toast('Đăng nhập Google chưa thành công, thử lại nhé.');
    else if (back === 'taken') toast('Tài khoản Google này đã gắn với tài khoản khác.');
    else if (back === 'linked') toast('Đã gắn Google vào tài khoản.');
    if (account.me) { if (back === 'ok') toast(`☁ Đã đăng nhập · ${account.me.name || 'đạo hữu'}.`); await syncAccount(); }
  }

  function showGate() {
    const body = $('hq-gate').querySelector('.hq-gate-body');
    updateAccountUi();
    if (state.player?.birth) {
      const y = state.player.yong || {};
      body.innerHTML = `<p class="hq-welcome">Chào ${esc(state.player.name)} quay lại quán.</p>
        <p class="hq-sub">${esc(S.titleFor(state.xp || 0).name)} · ✦ ${state.phucKhi} ${TEXT.point} · chuỗi ${S.currentStreak(state)} ngày</p>
        <p>${swatch(y.primary)} Phẩm phục ${WX_NAMES[y.primary] || ''}${y.accent ? ` · đai ${WX_NAMES[y.accent]}` : ''}</p>
        <div class="hq-spawn" role="radiogroup" aria-label="Xuất hiện ở đâu">${spawnList().map((o, i) => `<label class="hq-check"><input type="radio" name="hq-spawn" value="${i}"${o.def ? ' checked' : ''}> ${esc(o.label)}</label>`).join('')}</div>
        <button class="hq-btn hq-primary hq-big" id="hq-enter" type="button">Bước qua cổng</button>
        <button class="hq-btn" id="hq-rebirth" type="button">Sửa bát tự</button>`;
      $('hq-enter').onclick = () => { const L = spawnList(), i = Number(body.querySelector('input[name=hq-spawn]:checked')?.value || 0); enter(L[i] || L[0]); };
      $('hq-rebirth').onclick = showBirth;
      return;
    }
    showBirth();
  }
  function showBirth() {
    const body = $('hq-gate').querySelector('.hq-gate-body');
    body.innerHTML = birthForm();
    // đăng nhập trên máy mới: nhân vật có từ bản lưu tài khoản nhưng ngày sinh không lên mây → nhập lại
    if (state.player && !state.player.birth) { const n = document.createElement('p'); n.className = 'hq-note'; n.textContent = `Chào ${state.player.name || 'đạo hữu'} — tiến độ đã tải từ tài khoản. Ngày giờ sinh không lưu trên mây, xin nhập lại một lần trên máy này.`; body.prepend(n); const nm = $('hq-gate-form')?.name; if (nm && state.player.name) nm.value = state.player.name; }
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
  startAccount();

  // Cho kiểm thử tự động (Playwright) — chỉ bản dev; bản đóng gói không phơi đối tượng này.
  if (import.meta.env && import.meta.env.DEV) {
    window.__hq = { api, econ, state, player, stick, altCtl, net, get work() { return work; }, get boat() { return boat; }, keys, openStation, walkTo, STATIONS, blockedAt, findPath, nearestStation, stationById, roomSpots, roomByKey, get renderer() { return renderer; } };
  }

  return { pause, resume, exit };
}
