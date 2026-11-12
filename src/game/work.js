// ============================================================================
//  VIỆC LÀM (P2, client) — bảng Chiêu công trong tiệm, ca làm, mini-game, phu áp hàng, mỏ dân sự, huy hiệu ca.
//  Máy chủ (Guild DO — guild-core.js) giữ chỗ làm, chấm lương, ghi sổ; ví tiền vẫn ở máy (life.js) cho tới P8:
//  chỉ cộng đúng số máy chủ trả khi tan ca. Mất mạng → không nhận việc (chỉ còn việc vặt gánh nước).
//  Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §4–§5.
// ============================================================================
import * as J from './jobs.js';
import * as LIFE from './life.js';
import * as ILL from './illness.js';
import * as AD from './amduc.js';
import { goodBonus } from './huyenhoc.js';
import { fmt as fmtCoin } from './coins.js';
import { workplace, postDist, cmineSpawn, ORE_NODES } from './guild-core.js';
import { roomByKey, insideOf } from './rooms.js';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
const WX_VI = { 木: 'Mộc', 火: 'Hỏa', 土: 'Thổ', 金: 'Kim', 水: 'Thủy' };
const DIR8 = ['Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc', 'Bắc', 'Đông Bắc'];
export const ERR = {
  closed: 'Chưa tới giờ mở ca (pháo hoa chỉ bắn đêm rằm, 18–23 giờ).',
  off: 'Máy chủ việc làm chưa mở.', offline: 'Đang ngoại tuyến — việc làm cần máy chủ giữ sổ. Tạm thời chỉ gánh nước ở Giếng Đông được.',
  timeout: 'Máy chủ không trả lời, thử lại nhé.', bad: 'Yêu cầu không hợp lệ.', error: 'Máy chủ gặp lỗi, thử lại sau.',
  rank: 'Tay nghề chưa đủ cho bậc này.', full: 'Bậc này hết chỗ — thử bậc khác hoặc tiệm khác.',
  have: 'Bạn đang giữ chỗ ở tiệm khác — thôi việc bên đó trước.', noseat: 'Chưa có chỗ làm ở tiệm này — xin việc trước.',
  far: 'Phải đứng đúng chỗ làm (trong tiệm / cạnh mạch quặng / đúng dịch trạm đích).', busy: 'Bạn đang trong một ca khác.',
  daycap: `Hôm nay đã làm đủ ${J.SHIFT.perDay} ca. Nghỉ ngơi đã, mai làm tiếp.`, noshift: 'Chưa vào ca.', ended: 'Ca đã hết giờ.',
  seed: 'Việc đã đổi — làm lại việc mới.', fast: 'Làm vội quá, chủ chưa nhận — thử lại.', slow: 'Để quá lâu, chủ đã giao việc khác.',
  empty: 'Mạch quặng này cạn rồi — sang mạch khác hoặc chờ mạch hồi.', bot: 'Nhịp làm đều như máy — chủ sinh nghi, việc này không tính công.',
  idle: 'Phải vào ca trong 24 giờ qua mới gia hạn được.', none: 'Bạn chưa giữ chỗ nào.',
};
const fmtClock = (ms) => { const s = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const fmtDate = (t) => new Date(t).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PARCEL_KEY = 'hq-parcel', MINE_KEY = 'hq-minefrom';

/**
 * o: { api, net, L, player, tileToWorld, place(p, label), toast, buzz, panel, save, updateVitals, root(), anchor }
 */
export function createWork(o) {
  const { net, L, player, toast, panel } = o;
  const G = net.guild;
  G.where = () => ({ x: player.x, y: player.y });
  let shift = null, taskAt = 0, busy = false, synced = false, syncing = false, contract = null; // contract: chỗ làm đang giữ (menu Địa điểm)
  let parcel = (() => { try { return JSON.parse(sessionStorage.getItem(PARCEL_KEY) || 'null'); } catch (e) { return null; } })();
  let mineFrom = (() => { try { return Number(sessionStorage.getItem(MINE_KEY)) || null; } catch (e) { return null; } })();
  const yong = () => o.api.state.player?.yong || null;
  const where = () => o.tileToWorld(player.x, player.y);
  const setParcel = (p) => { parcel = p; try { if (p) sessionStorage.setItem(PARCEL_KEY, JSON.stringify(p)); else sessionStorage.removeItem(PARCEL_KEY); } catch (e) { /* ignore */ } };
  const err = (r) => ERR[r?.err] || 'Chưa làm được, thử lại nhé.';

  // ---------- huy hiệu ca (góc trên, cạnh chỉ số sinh tồn) ----------
  const badge = document.createElement('button');
  badge.type = 'button'; badge.className = 'hq-workbadge'; badge.hidden = true;
  badge.onclick = () => shiftPanel();
  o.anchor?.after(badge);
  function updateBadge() {
    if (!shift) { badge.hidden = true; return; }
    const job = J.WORK[shift.job];
    let line = `${job.icon} ${shift.n}/${shift.max} · ${shift.purse} đồng · ${fmtClock(shift.until - Date.now())}`;
    if (shift.job === 'phu' && parcel) {
      const w = workplace(parcel.dest), me = where();
      if (w?.city && me.x < 1800) { const dx = w.city.x - me.x, dz = w.city.z - me.z, d = Math.hypot(dx, dz); const a = Math.round(((Math.atan2(dz, dx) * 180) / Math.PI + 360) % 360 / 45) % 8; line += ` · 📦 → ${w.name.replace('Dịch Trạm ', '')} ${DIR8[a]} ${Math.round(d)} m`; }
      else if (w) line += ` · 📦 → ${w.name}`;
    }
    badge.textContent = line; badge.hidden = false;
  }

  // ---------- đồng bộ với máy chủ (nối mạng xong / mở game) ----------
  function setShift(s) {
    if (s && !shift) o.onShift?.(); // v4: báo hướng dẫn tân thủ (vào ca)
    // mốc nhận việc chỉ đổi khi máy chủ giao việc mới (mở lại bảng không được đặt lại thời gian tối thiểu)
    if (!s || s.task?.seed !== shift?.task?.seed) taskAt = Date.now();
    shift = s ? { ...s } : null;
    if (!shift || shift.job !== 'phu' || (parcel && parcel.seed !== shift.task?.seed)) setParcel(null);
    updateBadge();
  }
  async function sync() {
    if (syncing || !G.online()) return; syncing = true;
    try {
      const r = await G.me();
      if (!r.ok) return;
      synced = true; contract = r.contract || null;
      setShift(r.shift);
      if (r.owed > 0) { const c = await G.claim(); if (c.ok && c.amt > 0) { LIFE.earn(L, c.amt); o.save(); o.updateVitals(); toast(`💰 Tiền ca trước (máy chủ tự tan ca khi bạn vắng): +${c.amt} đồng.`); } }
    } finally { syncing = false; }
  }

  // ---------- kết quả việc / tan ca ----------
  function applyCosts(job, rel, mishap) {
    const R = J.REL[rel] || J.REL.thuong;
    L.wake = Math.max(0, L.wake - job.wake * R.wake * AD.effects(L).workWake); // Âm Đức c1: đỡ mệt 5%
    L.full = Math.max(0, L.full - job.full);
    if (mishap === 'nga') { L.hp = Math.max(0, L.hp - 6); const c = ILL.injury(L); if (c) toast(`🩹 ${ILL.ILLS.chanthuong.name}${c.sev ? ' nặng' : ''} — đi chậm, làm kém; ghé Y Quán (gian sau Dược Phòng) chữa.`); }
  }
  function onEnd(e, why = '') {
    if (!e?.ok) return;
    const qn = goodBonus(L, new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10)) > 1 || goodBonus(L, L.hh?.day) > 1 ? 1.2 : 1; // quý nhân phù trợ (P19)
    const got = fmtCoin(e.paid > 0 ? LIFE.earn(L, e.paid * qn) : 0); // earn trả xu (P18)
    if (!e.quit) AD.adState(L).score = Math.round((AD.adState(L).score + 0.2) * 10) / 10; // ca trọn: Âm Đức +0,2
    const job = J.WORK[e.job];
    if (!e.quit && (job.wx === '水' || job.id === 'mo')) { const c = ILL.coldWork(L, new Date().toDateString()); if (c) toast(`🦴 ${ILL.ILLS.hanthap.name} — làm việc ẩm lạnh nhiều ca liền.`); }
    toast(e.quit
      ? `${job.icon} Bỏ ca giữa chừng (${e.n} việc) — chỉ nhận nửa tiền: +${got} · uy tín ${e.rep}.`
      : `${job.icon} Tan ca${why} · ${e.n} việc · +${got} · tay nghề ${e.skill} (${J.RANKS[e.rank].name}) · uy tín ${e.rep}.`);
    if (e.quit) AD.penalize(L, 'quit');
    setShift(null); setParcel(null);
    o.save(); o.updateVitals(); o.buzz?.('light');
  }
  function onTask(r) {
    if (!r.ok) {
      toast(err(r) + (r.err === 'fast' && r.wait ? ` (còn ${Math.ceil(r.wait / 1000)} giây)` : ''));
      if (r.task && shift) { shift.task = r.task; taskAt = Date.now(); if (shift.job === 'phu') setParcel(null); }
      if (r.err === 'ended') { if (r.end) onEnd(r.end, ' (hết giờ)'); else sync(); }
      if (r.err === 'noshift') setShift(null);
      updateBadge();
      return false;
    }
    const job = J.WORK[shift.job];
    applyCosts(job, r.rel, r.mishap);
    if (r.mishap === 'nga') toast('💥 Sơ ý bị thương (Khí huyết −6) — việc này không được công.');
    else if (r.mishap === 'hong') toast(`💢 Làm hỏng hàng — bồi ${Math.abs(r.pay)} đồng trừ vào tiền ca.`);
    else if (r.mishap === 'phat') toast('😠 Khách phàn nàn, chủ không trả công việc này (uy tín −1).');
    else { badge.classList.remove('pop'); void badge.offsetWidth; badge.classList.add('pop'); } // v4: tiến độ hiện trên huy hiệu ca, không toast từng việc
    shift.n = r.n; shift.purse = r.purse;
    if (r.task) { shift.task = r.task; taskAt = Date.now(); }
    if (shift.job === 'phu') setParcel(null);
    if (r.end) onEnd(r.end, ' (đủ việc)');
    o.save(); o.updateVitals(); updateBadge();
    return true;
  }
  /** chờ đủ thời gian tối thiểu của việc (máy chủ chặn nhanh hơn) — thêm độ trễ ngẫu nhiên nhỏ như tay người */
  async function padWait(t) {
    const need = taskAt + (t.minMs || 0) + 400 + Math.random() * 1600 - Date.now();
    if (need > 0) { toast('Đang hoàn tất việc…'); await sleep(need); }
  }
  async function submit(score, extra = {}) {
    const t = shift?.task; if (!t) return false;
    await padWait(t);
    const r = await G.task({ seed: t.seed, sc: score, wl: L.wake < 20, wl30: L.wake < 30, sk: ILL.isSick(L), ad: AD.tier(L), ...extra });
    return onTask(r);
  }
  const ctxMods = () => (L.wake < 20 || L.full < 20 ? ' Đang đói / buồn ngủ — dễ gặp rủi ro, hiệu suất giảm.' : '');

  // ---------- mini-game ----------
  async function doWork(extra = {}, after = null) {
    if (busy || !shift) return;
    const job = J.WORK[shift.job];
    if (L.hp <= 5) { toast('Khí huyết cạn — nghỉ ngơi đã.'); return; }
    busy = true; panel.close();
    try {
      const games = await import('./work-games.js');
      const score = await games.play(job.game, shift.task.seed, { root: o.root(), title: job.theme?.title || `${job.icon} ${job.name}`, hint: job.theme?.hint, button: job.theme?.button, items: job.theme?.items, label: job.theme?.label, unit: job.theme?.unit });
      if (score == null) { toast('Đã thôi việc này (chưa tính công).'); return; }
      const mb = L.mealBuff && L.mealBuff.until > Date.now() ? L.mealBuff.mul : 0; // «No khí» món cao lương (P10)
      await submit(Math.min(1, score * (1 + mb)), extra);
    } finally { busy = false; }
    after?.();
  }

  // ---------- bảng Chiêu công ----------
  function relLine(job, rel) {
    const R = J.REL[rel] || J.REL.thuong;
    return `<p>Nghề hành <b>${WX_VI[job.wx]}</b> — với mệnh bạn là <b class="hq-rel-${rel}">${R.name}</b>: ${esc(R.note)}</p>`;
  }
  function boardPanel(k) {
    const w = workplace(k); if (!w) return;
    const box = el('<div class="hq-life hq-work"><p class="hq-note">Đang hỏi chủ tiệm…</p></div>');
    panel.open({ title: `📜 Chiêu công · ${w.name}`, body: box });
    const render = async () => {
      if (!G.online()) { box.innerHTML = `<p class="hq-warn">${esc(ERR.offline)}</p>`; return; }
      const r = await G.board(k);
      if (!box.isConnected) return;
      if (!r.ok) { box.innerHTML = `<p class="hq-warn">${esc(err(r))}</p>`; return; }
      setShift(r.shift);
      // máy chủ chưa biết Dụng thần (lần đầu) → hiển thị theo lá số trên máy; xin việc / vào ca sẽ gửi lên
      const job = J.WORK[r.job], car = r.career, rel = car.yong ? car.rel : J.relation(job.wx, yong()), sk = car.skill[r.job], may = J.rankOf(sk, car.rep, rel);
      const est = J.taskPay(job, (1 - 0.3) / 1.2, { rel, rank: Math.min(may, 3), palace: J.palaceBonus(w.wx, job.wx) }).pay;
      const mine = r.contract && r.contract.k === k ? r.contract : null;
      const rows = r.layout.map((n, rk) => {
        if (!n) return '';
        const hs = r.holders.filter((h) => h[0] === rk);
        const chips = Array.from({ length: n }, (_, i) => { const h = hs.find((x) => x[1] === i); return h ? `<span class="hq-seat${h[3] ? ' me' : ''}">${esc(h[2])}</span>` : '<span class="hq-seat npc">NPC làm thay</span>'; }).join('');
        return `<div class="hq-seatrow"><b>${J.RANKS[rk].name}</b><small>×${String(J.RANKS[rk].pay).replace('.', ',')}</small><div>${chips}</div></div>`;
      }).join('');
      box.innerHTML = `
        <p class="hq-work-h">${job.icon} <b>${esc(job.name)}</b> · chủ: ${esc(w.owner)}</p>
        ${relLine(job, rel)}
        <p class="hq-note">${esc(job.desc)}</p>
        <p class="hq-life-van">Tay nghề <b>${sk}</b> · bậc đủ: <b>${J.RANKS[may].name}</b> · uy tín ${car.rep} · ≈ ${est.toFixed(1).replace('.', ',')} đồng / việc (làm trung bình)</p>
        <div class="hq-seats">${rows}</div>
        <div class="hq-actions" data-role="acts"></div>
        <p class="hq-note">Mỗi ca tối đa ${J.SHIFT.tasks} việc trong 30 phút, ${J.SHIFT.perDay} ca mỗi ngày. Tan ca trước giờ khi chưa đủ ${J.SHIFT.minFull} việc là bỏ ca (nửa tiền, uy tín −5). Giữ chỗ 3 ngày; quá 24 giờ không vào ca thì mất chỗ.${ctxMods()}</p>`;
      const acts = box.querySelector('[data-role=acts]');
      const btn = (label, fn, dis = false) => { const b = el(`<button class="hq-btn" type="button">${label}</button>`); b.disabled = dis; b.onclick = async () => { b.disabled = true; await fn(); }; acts.append(b); return b; };
      const here = shift && shift.job === r.job;
      if (here && job.game === 'deliver') {
        if (!parcel && shift.task?.from === k) btn(`📦 Nhận hàng đi ${esc(workplace(shift.task.dest)?.name || '')}`, async () => { setParcel({ seed: shift.task.seed, dest: shift.task.dest, from: k, at: Date.now() }); toast(`📦 Đã nhận kiện hàng. Áp sang ${workplace(shift.task.dest)?.name} — đi bộ hoặc chạy, không cưỡi ngựa trạm, không ngự kiếm.`); panel.close(); updateBadge(); });
        else if (parcel && parcel.dest === k) btn('✅ Giao hàng', async () => { const secs = Math.max(1, (Date.now() - parcel.at) / 1000), walk = postDist(parcel.from, parcel.dest) / 5.6; const score = Math.max(0.2, Math.min(1, 0.15 + 0.6 * (walk / secs))); panel.close(); busy = true; try { await submit(score); } finally { busy = false; } boardPanel(k); });
        else if (parcel) acts.append(el(`<p class="hq-note">Kiện hàng này giao cho ${esc(workplace(parcel.dest)?.name || '')}.</p>`));
        else acts.append(el(`<p class="hq-note">Chuyến kế tiếp nhận ở ${esc(workplace(shift.task?.from)?.name || '')}.</p>`));
      } else if (here && shift.k === k) btn(`${job.icon} ${job.verb} (${shift.n}/${shift.max})`, () => doWork({}, () => boardPanel(k)));
      if (here) btn('🔔 Tan ca', () => endShift(() => boardPanel(k)));
      if (mine) {
        acts.prepend(el(`<p class="hq-note">Bạn làm <b>${J.RANKS[mine.r].name}</b> ở đây · giữ chỗ tới ${fmtDate(mine.until)}.</p>`));
        if (!shift) btn('▶ Vào ca', async () => { const s = await G.start(r.job, k, yong()); if (!s.ok) { toast(err(s)); render(); return; } setShift(s.shift); toast(`${job.icon} Vào ca · ${J.REL[s.shift.rel].name}${s.shift.palace > 1 ? ' · tiệm hợp cung +10%' : ''}.`); render(); });
        btn('Gia hạn 3 ngày', async () => { const x = await G.renew(); toast(x.ok ? `Đã gia hạn tới ${fmtDate(x.contract.until)}.` : err(x)); render(); });
        btn('Thôi việc', async () => { const x = await G.quit(); if (x.ended) onEnd(x.ended); toast(x.ok ? 'Đã thôi việc, chỗ trả lại cho tiệm.' : err(x)); render(); });
      } else if (r.contract) acts.append(el(`<p class="hq-note">Bạn đang giữ chỗ ở ${esc(workplace(r.contract.k)?.name || 'tiệm khác')}.</p>`));
      else {
        let any = false;
        r.layout.forEach((n, rk) => {
          if (!n || rk > may) return;
          const used = r.holders.filter((h) => h[0] === rk).length;
          if (used >= n) return;
          any = true;
          btn(`Xin làm ${J.RANKS[rk].name}`, async () => { const x = await G.apply(k, rk, yong()); toast(x.ok ? `Đã nhận vào làm ${J.RANKS[rk].name} ở ${w.name}.` : err(x)); render(); });
        });
        if (!any) acts.append(el('<p class="hq-note">Các bậc bạn đủ sức làm đều đã kín chỗ. Thử tiệm khác cùng loại, hoặc xuống mỏ dân sự (không giới hạn chỗ).</p>'));
      }
    };
    render();
  }
  async function endShift(after) {
    const r = await G.end();
    if (r.ok) onEnd(r); else { toast(err(r)); if (r.err === 'noshift') setShift(null); }
    after?.();
  }
  function shiftPanel() {
    if (!shift) return;
    const job = J.WORK[shift.job], w = shift.k != null ? workplace(shift.k) : null;
    const box = el(`<div class="hq-life hq-work">
      <p class="hq-work-h">${job.icon} <b>${esc(job.name)}</b>${w ? ` · ${esc(w.name)}` : ''}</p>
      <p class="hq-life-van">${shift.n}/${shift.max} việc · tiền ca <b>${shift.purse} đồng</b> · còn ${fmtClock(shift.until - Date.now())} · ${J.REL[shift.rel]?.name || ''} · ${J.RANKS[shift.rank].name}</p>
      ${shift.job === 'phu' ? `<p class="hq-note">${parcel ? `Đang áp hàng tới <b>${esc(workplace(parcel.dest)?.name || '')}</b>.` : `Nhận chuyến kế ở <b>${esc(workplace(shift.task?.from)?.name || '')}</b>.`}</p>` : ''}
      ${shift.job === 'mo' ? '<p class="hq-note">Đào ở các mạch quặng trong mỏ dân sự; mạch cạn thì 4 phút hồi một lần.</p>' : ''}
      <div class="hq-actions"></div></div>`);
    const acts = box.querySelector('.hq-actions');
    const b = el(`<button class="hq-btn" type="button">🔔 Tan ca${shift.n < J.SHIFT.minFull ? ' (bỏ ca — nửa tiền)' : ''}</button>`);
    b.onclick = async () => { b.disabled = true; await endShift(); panel.close(); };
    acts.append(b);
    panel.open({ title: '🧾 Ca làm', body: box });
  }

  // ---------- mỏ dân sự ----------
  function minePanel() {
    const box = el('<div class="hq-life hq-work"><p class="hq-note">Đốc công đang dò sổ…</p></div>');
    panel.open({ title: '⛏ Đốc công mỏ dân sự', body: box });
    const render = async () => {
      if (!G.online()) { box.innerHTML = `<p class="hq-warn">${esc(ERR.offline)}</p>`; return; }
      const [me, ores] = await Promise.all([G.me(), G.ores()]);
      if (!box.isConnected) return;
      if (!me.ok) { box.innerHTML = `<p class="hq-warn">${esc(err(me))}</p>`; return; }
      setShift(me.shift);
      const job = J.WORK.mo, rel = J.relation(job.wx, yong()), may = me.career.rank.mo;
      const full = ores.ok ? ORE_NODES.filter((n) => (ores.ores[n.id]?.[0] ?? 0) > 0).length : '?';
      box.innerHTML = `<p class="hq-work-h">⛏ <b>Thợ mỏ</b> · không giới hạn chỗ, chỉ giới hạn theo mạch quặng còn hàng</p>
        ${relLine(job, rel)}
        <p class="hq-note">${esc(job.desc)}</p>
        <p class="hq-life-van">Tay nghề <b>${me.career.skill.mo}</b> · bậc ${J.RANKS[may].name} · uy tín ${me.career.rep} · mạch còn quặng: ${full}/${ORE_NODES.length}</p>
        <div class="hq-actions"></div><p class="hq-note">${ctxMods()}</p>`;
      const acts = box.querySelector('.hq-actions');
      const btn = (label, fn) => { const b = el(`<button class="hq-btn" type="button">${label}</button>`); b.onclick = async () => { b.disabled = true; await fn(); }; acts.append(b); };
      if (!shift) btn('▶ Vào ca thợ mỏ', async () => { const s = await G.start('mo', null, yong()); if (!s.ok) { toast(err(s)); render(); return; } setShift(s.shift); toast(`⛏ Vào ca · ${J.REL[s.shift.rel].name}. Ra mạch quặng gõ búa.`); panel.close(); });
      else if (shift.job === 'mo') btn('🔔 Tan ca', () => endShift(() => minePanel()));
      else acts.append(el(`<p class="hq-note">Bạn đang trong ca ${esc(J.WORK[shift.job].name)} — tan ca bên đó trước.</p>`));
    };
    render();
  }
  function toMine(k) {
    if (parcel) { toast('Đang áp hàng — giao xong rồi hãy xuống mỏ.'); return; }
    mineFrom = k; try { sessionStorage.setItem(MINE_KEY, String(k)); } catch (e) { /* ignore */ }
    o.place(cmineSpawn(), 'Xe goòng xuống Khoáng Sơn…');
  }
  function fromMine() {
    const r = roomByKey(`shop:${mineFrom ?? -1}`) || roomByKey(`shop:${[...Array(60).keys()].find((k) => workplace(k)?.type === J.MINE_SHOP)}`);
    if (shift?.job === 'mo') toast('Ca thợ mỏ vẫn chạy — lên lại đây đào tiếp, hoặc tan ca ở đốc công.');
    o.place(r ? insideOf(r) : null, 'Xe goòng lên Lò Rèn…');
  }

  // ---------- nghề ngoài tiệm (P7): nhận việc tại khu làm, không giữ chỗ ----------
  function zonePanel(jobId, place) {
    const job = J.WORK[jobId];
    const box = el('<div class="hq-life hq-work"><p class="hq-note">Đang dò sổ…</p></div>');
    panel.open({ title: `${job.icon} ${job.name}`, body: box });
    const render = async () => {
      if (!G.online()) { box.innerHTML = `<p class="hq-warn">${esc(ERR.offline)}</p>`; return; }
      const me = await G.me();
      if (!box.isConnected) return;
      if (!me.ok) { box.innerHTML = `<p class="hq-warn">${esc(err(me))}</p>`; return; }
      setShift(me.shift);
      const rel = J.relation(job.wx, yong()), may = me.career.rank[jobId] ?? 0;
      box.innerHTML = `<p class="hq-work-h">${job.icon} <b>${esc(job.name)}</b>${place ? ` · ${esc(place)}` : ''} · làm tại chỗ, không giới hạn người</p>
        ${relLine(job, rel)}<p class="hq-note">${esc(job.desc)}</p>
        <p class="hq-life-van">Tay nghề <b>${me.career.skill[jobId] ?? 0}</b> · bậc ${J.RANKS[may].name} · uy tín ${me.career.rep}${shift?.job === jobId ? ` · đang ca ${shift.n}/${shift.max} việc · ${shift.purse} đồng` : ''}</p>
        <div class="hq-actions"></div><p class="hq-note">${ctxMods()}</p>`;
      const acts = box.querySelector('.hq-actions');
      const btn = (label, fn, primary) => { const b = el(`<button class="hq-btn${primary ? ' hq-primary' : ''}" type="button">${label}</button>`); b.onclick = async () => { b.disabled = true; await fn(); }; acts.append(b); };
      if (!shift) btn(`▶ Vào ca ${esc(job.name)}`, async () => { const r = await G.start(jobId, null, yong()); if (!r.ok) { toast(err(r)); render(); return; } setShift(r.shift); toast(`${job.icon} Vào ca · ${J.REL[r.shift.rel].name}.`); render(); }, true);
      else if (shift.job === jobId) { btn(`${job.icon} ${esc(job.verb)}`, () => doWork({}, () => zonePanel(jobId, place)), true); btn('🔔 Tan ca', () => endShift(() => zonePanel(jobId, place))); }
      else acts.append(el(`<p class="hq-note">Bạn đang trong ca ${esc(J.WORK[shift.job].name)} — tan ca bên đó trước.</p>`));
    };
    render();
  }

  // ---------- điểm tương tác ----------
  function spot(st) {
    const d = st.data || {};
    if (d.zoneJob) { zonePanel(d.zoneJob, d.place); return; }
    if (st.room === 'job:mine') {
      if (d.id === 'boss') { minePanel(); return; }
      if (d.id === 'cart') { fromMine(); return; }
      if (d.ore) {
        if (!G.online()) { toast(ERR.offline); return; }
        if (!synced) { sync().then(() => toast('Đã nối sổ đốc công — chạm lại để đào.')); return; }
        if (!shift || shift.job !== 'mo') { toast('Gặp đốc công vào ca thợ mỏ trước đã.'); return; }
        doWork({ node: d.id });
        return;
      }
      return;
    }
    const k = Number(String(st.room || '').slice(5));
    if (d.mine) { toMine(k); return; }
    if (d.kind === 'job') boardPanel(k);
  }

  let acc = 0;
  return {
    spot,
    zonePanel,
    sync,
    onStatus(status) { if (status === 'online') { synced = false; sync(); } },
    carrying: () => !!parcel,
    contract: () => contract,
    step(dt) {
      acc += dt; if (acc < 1) return; acc = 0;
      if (shift && Date.now() >= shift.until) { setShift(null); sync(); }
      if (!synced && G.online()) sync();
      updateBadge();
    },
  };
}
