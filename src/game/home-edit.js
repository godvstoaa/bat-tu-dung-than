// ============================================================================
//  BÀI TRÍ NHÀ RIÊNG — bản vẽ nhìn từ trên xuống ngay trong bảng: kéo thả đồ (bắt lưới 0,25 m), xoay
//  ¼ vòng, cất lại túi; đồ treo tường bám vách gần nhất. Mỗi thay đổi hợp lệ ghi ngay vào
//  state.home.own.items (lưu máy) + dựng lại phòng 3D; đóng bảng thì đẩy bố cục lên máy chủ.
//  Kiểm tra: estate.canPlace (không đè / không ra ngoài / chừa lối cửa), estate.unreachable (đồ có
//  chức năng phải tới được). Điểm phong thủy cập nhật trực tiếp (homefs.scoreHome).
//  api (main.js): state, toast, after, panel, rebuildRoom, estate, onClose
// ============================================================================
import * as I from './items.js';
import * as E from './estate.js';
import { scoreHome } from './homefs.js';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
const WX_COL = { 木: '#5f9a4a', 火: '#c8452f', 土: '#c79a4a', 金: '#b9bcc4', 水: '#3e74a8' };
const snap = (v) => Math.round(v * 4) / 4;

/** Biệt phủ: chọn vùng (gian / sân vườn) rồi mở bản vẽ của vùng đó */
function zonePicker(api, h, l, own) {
  const root = el(`<div class="hq-he"><div class="hq-he-top"><b>${esc(l.name)}</b> <small>${own.items.length}/${E.MAX_ITEMS_PHU} món · ${esc(l.style || '')} · ${esc(l.facing?.text || '')} · chọn nhà hoặc khoảnh vườn để bài trí</small></div><div class="hq-yc-grid" data-r="z"></div></div>`);
  const box = root.querySelector('[data-r=z]');
  for (const z of E.zonesOfH(h)) {
    const n = own.items.filter((m) => (m.k || 0) === z.k).length;
    const b = el(`<button class="hq-btn hq-he-it" type="button">${z.kind === 'hall' ? '🏯' : '🌳'} ${esc(z.name)}<small>${z.w}×${z.d} m · ${n} món</small></button>`);
    b.onclick = () => api.panel.open({ title: `🪑 ${l.name} · ${z.name}`, body: homeEditBody(api, h, z.k) });
    box.append(b);
  }
  return root;
}

export function homeEditBody(api, h, zk = null) {
  const s = api.state, H = I.homeState(s), own0 = H.own;
  if (!own0 || own0.h !== h) return el('<p class="hq-note">Đây không phải nhà của bạn.</p>');
  const l = E.listing(h), key = `est:${h}`, phu = E.isPhu(l);
  if (phu && zk == null) return zonePicker(api, h, l, own0);
  const zone = phu ? E.zoneOfH(h, zk) : null;
  const room = phu ? E.zoneRoom(zone) : E.roomOf(l), MAXN = E.MAX_ITEMS;
  // «own» của vùng: items = các món có k của vùng (biệt phủ) — ghi lại vào own0.items
  const own = phu ? {
    get items() { return own0.items.filter((m) => (m.k || 0) === zk); },
    set items(list) { own0.items = [...own0.items.filter((m) => (m.k || 0) !== zk), ...list.map((m) => ({ ...m, k: zk }))]; },
    get couplet() { return own0.couplet; }, set couplet(v) { own0.couplet = v; },
  } : own0;
  let sel = null, drag = null, dirty = false, rebuildT = 0;
  const root = el(`<div class="hq-he">
    <div class="hq-he-top"><b>${esc(zone ? `${l.name} · ${zone.name}` : l.name)}</b> <small>${room.w}×${room.d} m · ${own.items.length}/${MAXN} món</small> <span class="hq-he-score" data-r="score"></span></div>
    <canvas class="hq-he-cv" width="640" height="${Math.round((640 * room.d) / room.w)}" aria-label="Bản vẽ nhà nhìn từ trên xuống"></canvas>
    <div class="hq-actions" data-r="sel"></div>
    <details class="hq-he-fs"><summary>🧭 Lời thầy phong thủy</summary><ul class="hq-plain" data-r="notes"></ul></details>
    <h4>🎒 Túi đồ bài trí</h4><div class="hq-he-inv" data-r="inv"></div>
    <p class="hq-note">Kéo đồ trên bản vẽ để dời · cửa ở mép dưới · dải sọc trước cửa phải để trống · đồ treo tường thả gần vách nào bám vách đó.</p>
  </div>`);
  const $ = (r) => root.querySelector(`[data-r=${r}]`);
  const cv = root.querySelector('canvas'), g = cv.getContext('2d');
  const K = cv.width / room.w; // px / m
  const toPx = (x, z) => [(x + room.w / 2) * K, (z + room.d / 2) * K];
  const toM = (px, pz) => [px / K - room.w / 2, pz / K - room.d / 2];
  const nextU = () => own0.items.reduce((a, m) => Math.max(a, m.u || 0), 0) + 1;

  function commit(msg) {
    dirty = true; api.after(0);
    clearTimeout(rebuildT); rebuildT = setTimeout(() => api.rebuildRoom?.(key), 350);
    if (msg) api.toast(msg);
    render();
  }
  function tryLayout(next) {
    const placed = [];
    for (const m of next) { const c = E.canPlace(room, placed, m); if (!c.ok) return c.reason; placed.push(m); }
    const bad = room.yard ? [] : E.unreachable(room, next);
    if (bad.length) return `${I.ITEM[bad[0].i].name} bị chắn — phải có lối đi tới.`;
    return null;
  }
  /** chỗ trống đầu tiên cho món mới (quét lưới từ vách sau ra) */
  function findSpot(m) {
    const it = I.ITEM[m.i];
    if (it.place === 'wall') {
      if (room.yard) return null;
      for (const r of [0, 1, 3]) for (let t = -0.4; t <= 0.4; t += 0.05) {
        const w = r === 0 ? E.snapWall(room, t * room.w, -room.d) : E.snapWall(room, (r === 1 ? 1 : -1) * room.w, t * room.d);
        const c = { ...m, ...w }; if (!tryLayout([...own.items, c])) return c;
      }
      return null;
    }
    for (const r of [0, 1]) for (let z = -room.d / 2 + 1; z < room.d / 2 - 1; z += 0.5) for (let x = -room.w / 2 + 1; x < room.w / 2 - 1; x += 0.5) {
      const c = { ...m, x: snap(x), z: snap(z), r }; if (!tryLayout([...own.items, c])) return c;
    }
    return null;
  }

  function draw() {
    const W = cv.width, D = cv.height;
    g.clearRect(0, 0, W, D);
    g.fillStyle = '#3a2c22'; g.fillRect(0, 0, W, D);
    g.strokeStyle = 'rgba(255,255,255,.06)'; g.lineWidth = 1;
    for (let x = 0; x <= room.w; x++) { g.beginPath(); g.moveTo(x * K, 0); g.lineTo(x * K, D); g.stroke(); }
    for (let z = 0; z <= room.d; z++) { g.beginPath(); g.moveTo(0, z * K); g.lineTo(W, z * K); g.stroke(); }
    // lối cửa (gian: cửa trước, có cửa sau thì cả mép trên) · sân vườn: dải lối đi phải trống
    if (room.yard) { g.fillStyle = 'rgba(160,140,110,.35)'; for (const k of room.keep) { const [a, b] = toPx(k.x - k.w / 2, k.z - k.d / 2); g.fillRect(a, b, k.w * K, k.d * K); } }
    else {
      const [cx0, cz0] = toPx(-1.3, room.d / 2 - 2.8);
      g.fillStyle = 'rgba(255,220,140,.12)'; g.fillRect(cx0, cz0, 2.6 * K, 2.8 * K);
      g.fillStyle = '#e8c25a'; g.fillRect(W / 2 - 1.3 * K, D - 5, 2.6 * K, 5);
      if (room.back) { g.fillRect(W / 2 - 1.3 * K, 0, 2.6 * K, 5); g.fillStyle = 'rgba(255,220,140,.12)'; g.fillRect(cx0, 0, 2.6 * K, 2.8 * K); }
    }
    g.strokeStyle = '#8a6a3a'; g.lineWidth = 6; g.strokeRect(3, 3, W - 6, D - 6);
    g.font = '12px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    const list = drag ? own.items.map((m) => (m.u === drag.m.u ? drag.m : m)) : own.items;
    for (const m of list) {
      const it = I.ITEM[m.i], on = sel === m.u, bad = drag && drag.m.u === m.u && drag.bad;
      if (it.place === 'wall') {
        const len = it.foot[0] * K;
        g.fillStyle = bad ? '#e04040' : WX_COL[it.wx] || '#aaa';
        if (m.r === 0) g.fillRect(toPx(m.x, 0)[0] - len / 2, 2, len, 8);
        else g.fillRect(m.r === 1 ? W - 10 : 2, toPx(0, m.z)[1] - len / 2, 8, len);
        if (on) { g.strokeStyle = '#fff'; g.lineWidth = 2; g.strokeRect(m.r === 0 ? toPx(m.x, 0)[0] - len / 2 - 2 : m.r === 1 ? W - 12 : 0, m.r === 0 ? 0 : toPx(0, m.z)[1] - len / 2 - 2, m.r === 0 ? len + 4 : 12, m.r === 0 ? 12 : len + 4); }
        continue;
      }
      const f = E.footOf(m), [px, pz] = toPx(m.x - f.w / 2, m.z - f.d / 2);
      g.fillStyle = bad ? 'rgba(224,64,64,.85)' : WX_COL[it.wx] || '#aaa';
      g.globalAlpha = 0.85; g.fillRect(px, pz, f.w * K, f.d * K); g.globalAlpha = 1;
      // vạch hướng mặt (quay về cửa = r 0)
      const [mx, mz] = toPx(m.x, m.z), dir = [[0, 1], [1, 0], [0, -1], [-1, 0]][m.r & 3];
      g.strokeStyle = '#1e120c'; g.lineWidth = 2; g.beginPath(); g.moveTo(mx, mz); g.lineTo(mx + dir[0] * f.w * K * 0.4, mz + dir[1] * f.d * K * 0.4); g.stroke();
      if (on) { g.strokeStyle = '#fff'; g.lineWidth = 3; g.strokeRect(px - 2, pz - 2, f.w * K + 4, f.d * K + 4); }
      g.fillStyle = '#fff'; g.fillText(it.name.split(' ').slice(0, 2).join(' '), mx, mz);
    }
  }
  function render() {
    draw();
    const r = scoreHome({ room, items: own.items, yong: s.player?.yong || null, wardWx: l.wx, fry: (l.house?.ry || 0) + (zone?.ry || 0) });
    $('score').textContent = `🧭 ${r.score}/100`;
    $('notes').innerHTML = r.notes.map((x) => `<li>${x.v > 0 ? '🟢' : '🔴'} ${esc(x.text)} <small>(${x.v > 0 ? '+' : ''}${x.v})</small></li>`).join('') || '<li>Nhà còn trống.</li>';
    root.querySelector('.hq-he-top small').textContent = `${room.w}×${room.d} m · ${own.items.length}/${MAXN} món`;
    // món đang chọn
    const sb = $('sel'); sb.innerHTML = '';
    const m = own.items.find((x) => x.u === sel);
    if (m) {
      const it = I.ITEM[m.i];
      sb.append(el(`<span class="hq-sub"><b>${esc(it.name)}</b> · hành ${esc(I.WX_NAME[it.wx])}</span>`));
      if (it.place !== 'wall') { const b = el('<button class="hq-btn" type="button">⟳ Xoay</button>'); b.onclick = () => { const c = { ...m, r: (m.r + 1) & 3 }; const next = own.items.map((x) => (x.u === m.u ? c : x)); const err = tryLayout(next); if (err) { api.toast(err); return; } own.items = next; commit(); }; sb.append(b); }
      if (m.i === 'cau_doi') { const b = el(`<button class="hq-btn" type="button">📝 Đổi câu đối: ${esc(I.COUPLETS[own.couplet % I.COUPLETS.length][0])}…</button>`); b.onclick = () => { own.couplet = (own.couplet + 1) % I.COUPLETS.length; commit(); }; sb.append(b); }
      const put = el('<button class="hq-btn" type="button">🎒 Cất vào túi</button>');
      put.onclick = () => { own.items = own.items.filter((x) => x.u !== m.u); H.inv[m.i] = (H.inv[m.i] || 0) + 1; sel = null; commit(`Cất ${it.name} vào túi`); renderInv(); };
      sb.append(put);
    }
  }
  function renderInv() {
    const box = $('inv'); box.innerHTML = '';
    const ids = Object.keys(H.inv).filter((id) => I.ITEM[id].kind === 'decor');
    if (!ids.length) { box.append(el('<p class="hq-note">Túi chưa có đồ bài trí — mua ở Mộc Nghệ Phường, Lò Gốm, Đèn Lồng Phường, Thư Họa Các, Hoa Viên, Phong Thủy Đường, Lò Rèn…</p>')); return; }
    for (const id of ids) {
      const it = I.ITEM[id];
      const b = el(`<button class="hq-btn hq-he-it" type="button" style="border-color:${WX_COL[it.wx]}">${esc(it.name)} ×${H.inv[id]}<small>${esc(I.WX_NAME[it.wx])} · ${it.place === 'wall' ? 'treo tường' : `${it.foot[0]}×${it.foot[1]} m`}</small></button>`);
      b.onclick = () => {
        if (own.items.length >= MAXN || own0.items.length >= (phu ? E.MAX_ITEMS_PHU : E.MAX_ITEMS)) { api.toast(`Tối đa ${MAXN} món mỗi ${phu ? 'vùng' : 'nhà'}.`); return; }
        const c = findSpot({ u: nextU(), i: id, x: 0, z: 0, r: 0 });
        if (!c) { api.toast('Không còn chỗ trống cho món này.'); return; }
        own.items = [...own.items, c]; I.consume(s, id); sel = c.u; commit(`Đặt ${it.name}`); renderInv();
      };
      box.append(b);
    }
  }

  // --- kéo thả trên bản vẽ
  const pt = (e) => { const r = cv.getBoundingClientRect(); return toM(((e.clientX - r.left) / r.width) * cv.width, ((e.clientY - r.top) / r.height) * cv.height); };
  function hit(x, z) {
    for (let k = own.items.length - 1; k >= 0; k--) {
      const m = own.items[k], it = I.ITEM[m.i];
      if (it.place === 'wall') {
        const near = m.r === 0 ? Math.abs(z + room.d / 2) < 0.6 && Math.abs(x - m.x) < it.foot[0] / 2 : Math.abs(x - (m.r === 1 ? room.w / 2 : -room.w / 2)) < 0.6 && Math.abs(z - m.z) < it.foot[0] / 2;
        if (near) return m; continue;
      }
      const f = E.footOf(m); if (Math.abs(x - m.x) <= f.w / 2 && Math.abs(z - m.z) <= f.d / 2) return m;
    }
    return null;
  }
  cv.addEventListener('pointerdown', (e) => {
    const [x, z] = pt(e), m = hit(x, z);
    sel = m ? m.u : null;
    if (m) { drag = { m: { ...m }, ox: x - m.x, oz: z - m.z, bad: false }; try { cv.setPointerCapture(e.pointerId); } catch (err) { /* con trỏ giả lập */ } }
    render();
  });
  cv.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const [x, z] = pt(e), it = I.ITEM[drag.m.i];
    if (it.place === 'wall') Object.assign(drag.m, E.snapWall(room, x, z));
    else { drag.m.x = snap(x - drag.ox); drag.m.z = snap(z - drag.oz); }
    const others = own.items.filter((q) => q.u !== drag.m.u);
    drag.bad = !E.canPlace(room, others, drag.m).ok;
    draw();
  });
  const end = () => {
    if (!drag) return;
    const d = drag; drag = null;
    const orig = own.items.find((q) => q.u === d.m.u);
    if (orig && (orig.x !== d.m.x || orig.z !== d.m.z || orig.r !== d.m.r)) {
      const next = own.items.map((q) => (q.u === d.m.u ? d.m : q));
      const err = tryLayout(next);
      if (err) api.toast(err); else { own.items = next; commit(); return; }
    }
    render();
  };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);

  // đóng bảng → đẩy bố cục lên máy chủ (nếu có đổi)
  api.onClose?.(root, () => {
    if (!dirty) return;
    if (api.estate?.online?.()) api.estate.save(h, E.encodeLayout(own0.items), own0.couplet).then((r) => { if (!r?.ok) api.toast('Chưa đồng bộ được bố cục — sẽ thử lại khi nối máy chủ.'); });
    else own0.pending = true;
  });
  render(); renderInv();
  return root;
}
