// ============================================================================
//  BẢN ĐỒ HUYỀN THÀNH (v4) — bản đồ chi tiết kiểu game nhập vai lớn (Genshin / WoW / GTA):
//   · toàn màn hình, KÉO để di, LĂN chuột / chụm 2 ngón để phóng (từ cả thành 4,25 km tới từng căn nhà)
//   · lớp chi tiết theo mức phóng: khu → khối phố + tên khu → đường có tên + nhà từng căn tô màu theo loại + tên phố
//   · icon theo loại (thầy bói, miếu, sảnh nghề, trạm xe ngựa, bến thuyền, nhà rao bán, cổng thành), bật / tắt từng lớp
//   · tìm kiếm (tên nơi / loại tiệm: «thuốc», «trà», «miếu Quan Âm»…) → kết quả gần bạn nhất trước
//   · bấm một nơi: thẻ thông tin + «Đặt dấu» (ghim hiện trên bản đồ nhỏ, có mũi tên chỉ hướng + khoảng cách) ·
//     «Đi xe tới trạm gần nhất» · «Đi bộ tới» (khi gần)
//  Vẽ bằng canvas 2D theo khung nhìn (chỉ vẽ phần thấy), dữ liệu từ citylayout.js / city4.js / homes.js (một nguồn với cảnh 3D).
// ============================================================================
import * as L from './citylayout.js';
import { roads4 } from './city4.js';
import { enterables } from './homes.js';
import { estates } from './mansions.js';
import { VILLA_DISTRICT_NAME } from './estate-layout.js';
import { docks } from './boats.js';
import { SHOP_TYPES } from './items.js';
import { esc } from './stations.js';
import { GODS, godOfTemple } from './temples.js';
// từ khoá thường gọi → loại tiệm (tìm «thuốc» ra Dược Phòng, «rượu» ra Tửu Lâu…)
const ALIAS = { duoc: 'thuoc duoc y', tuu: 'ruou quan an com', tralau: 'tra lau ke chuyen', tratrang: 'tra la', gom: 'gom su chen bat', den: 'den long', thuhoa: 'sach tranh but', huong: 'nhang huong tram', loren: 'ren sat dao kiem', moc: 'go moc ban ghe', hoavien: 'hoa cay canh', phongthuy: 'phong thuy la ban', dichtram: 'ngua tram xe', namon: 'nha dat dia oc ho tich', tientrang: 'tien ngan hang gui rut' };

// --- màu / icon --------------------------------------------------------------------------------------------
const SHOP_COL = { tuu: '#c8553d', tralau: '#d08a3c', tratrang: '#8aa64a', gom: '#b7835a', den: '#e0a33a', thuhoa: '#7a8fb8', huong: '#9a6ab0', duoc: '#4f9a6a', loren: '#7a7a7a', moc: '#9a7448', hoavien: '#d47aa0', phongthuy: '#4a9aa8', dichtram: '#c9a14a', namon: '#a83a2a', tientrang: '#d9b24a', may: '#c47ab0' };
const KIND_COL = { knock: '#cbbf9f', est: '#5cc06a', temple: '#c23a2a', fortune: '#8a4fd0' };
export const LAYERS = [
  { id: 'fortune', icon: '🔮', name: 'Thầy bói' },
  { id: 'temple', icon: '⛩', name: 'Miếu' },
  { id: 'hall', icon: '🏛', name: 'Sảnh · đền' },
  { id: 'station', icon: '🐎', name: 'Trạm xe' },
  { id: 'dock', icon: '⚓', name: 'Bến' },
  { id: 'est', icon: '🏠', name: 'Nhà bán' },
  { id: 'phu', icon: '🏯', name: 'Biệt phủ' },
  { id: 'villa', icon: '🏡', name: 'Biệt thự' },
  { id: 'gate', icon: '🚪', name: 'Cổng' },
];

// --- dữ liệu (dựng một lần) -----------------------------------------------------------------------------------
let DATA = null;
export function mapData() {
  if (DATA) return DATA;
  const E = enterables().filter((e) => e.obb);
  const G = new Map(), GS = 64, key = (x, z) => `${Math.floor(x / GS)},${Math.floor(z / GS)}`;
  for (const e of E) { const k = key(e.obb.x, e.obb.z); (G.get(k) || G.set(k, []).get(k)).push(e); }
  const pois = [];
  for (const e of enterables()) {
    if (e.kind === 'fortune') pois.push({ layer: 'fortune', name: e.name, x: e.door.x, z: e.door.z, ref: e });
    else if (e.kind === 'temple') { const god = GODS[godOfTemple(e.key, e.g)]; pois.push({ layer: 'temple', name: `${e.name} · thờ ${god?.name || ''}`, x: e.door.x, z: e.door.z, ref: e }); }
    else if (e.kind === 'est') pois.push({ layer: 'est', name: e.name, x: e.door.x, z: e.door.z, ref: e });
  }
  for (const l of L.landmarks()) if (l.kind === 'hall' || l.kind === 'port' || l.kind === 'sonmon' || (l.kind === 'temple' && l.id !== 'denchinh')) pois.push({ layer: 'hall', name: l.name, x: l.door?.x ?? l.x, z: l.door?.z ?? l.z, big: true });
  // v5: đình phường ở tâm quảng trường phường (THANH-MANIFEST §3.8) — lớp «Miếu»; tên phường hiện ở mức phóng vừa
  for (const w of L.wards()) if (w.square) pois.push({ layer: 'temple', name: `Đình ${w.name}`, x: w.centre.x, z: w.centre.z, ward: w });
  for (const s of L.stations()) pois.push({ layer: 'station', name: s.name, x: s.x, z: s.z, station: s });
  // v6 (NHA-DIADIEM-MANIFEST §3): 16 biệt phủ + 8 khu biệt thự có icon và tên (trước chỉ có viền phủ, biệt thự không hiện)
  const EST = estates().filter((m) => !m.heaven);
  for (const m of EST) if (m.kind === 'phu') pois.push({ layer: 'phu', name: m.name, x: m.x, z: m.z, big: true, est: m }); // giữa khuôn viên — hai phủ chung cổng phố không đè tên
  VILLA_DISTRICT_NAME.forEach((name, di) => { const vs = EST.filter((m) => m.kind === 'villa' && m.district === di); if (!vs.length) return; pois.push({ layer: 'villa', name: `${name} · khu biệt thự`, x: vs.reduce((a, m) => a + m.x, 0) / vs.length, z: vs.reduce((a, m) => a + m.z, 0) / vs.length, big: true }); });
  for (const d of docks()) pois.push({ layer: 'dock', name: d.name, x: d.x, z: d.z });
  for (const g of L.gates()) pois.push({ layer: 'gate', name: `Cổng ${g.name}`, x: g.x, z: g.z });
  // tên phố theo chủ đề (citylayout.streets): đặt ở trọng tâm các nhà mặt phố đó
  const acc = new Map();
  for (const e of E) { const st = e.shop?.house?.street; if (!st) continue; const a = acc.get(st) || { x: 0, z: 0, n: 0 }; a.x += e.obb.x; a.z += e.obb.z; a.n++; acc.set(st, a); }
  const streetLabels = [];
  for (const [k, t] of L.streets()) { const a = acc.get(k); if (a && a.n >= 3) streetLabels.push({ name: t.name, x: a.x / a.n, z: a.z / a.n }); }
  pois.sort((a, b) => (b.big ? 1 : 0) - (a.big ? 1 : 0)); /* công trình lớn vẽ trước, không bị icon nhỏ chiếm chỗ */
  DATA = {
    houses: E, grid: G, GS,
    roads: roads4(), blocks: L.blocks(), water: L.water(), A: L.CITY.A,
    districts: L.districts().filter((d) => d.centre), pois, streetLabels,
    phu: estates().filter((m) => m.kind === 'phu' && !m.heaven), villas: estates().filter((m) => m.kind === 'villa'),
  };
  return DATA;
}

// --- vẽ -------------------------------------------------------------------------------------------------------
/**
 * view: { cx, cz (tâm, mét), s (px / m), w, h (px) } · opt: { player:{x,z,h}, others:[{x,z}], pin:{x,z}, layers:Set, mini }
 */
export function drawMap(g, view, opt = {}) {
  const D = mapData(), { cx, cz, s, w, h } = view;
  const X = (x) => w / 2 + (x - cx) * s, Y = (z) => h / 2 + (z - cz) * s;
  const x0 = cx - w / 2 / s, x1 = cx + w / 2 / s, z0 = cz - h / 2 / s, z1 = cz + h / 2 / s;
  const inView = (x, z, pad = 0) => x > x0 - pad && x < x1 + pad && z > z0 - pad && z < z1 + pad;
  g.save();
  g.fillStyle = '#2b3626'; g.fillRect(0, 0, w, h);
  // đất trong thành
  const oct = (a) => { g.beginPath(); for (let i = 0; i <= 8; i++) { const ang = (i / 8) * Math.PI * 2 + Math.PI / 8, r = a / Math.cos(Math.PI / 8); const px = X(Math.cos(ang) * r), py = Y(Math.sin(ang) * r); if (i) g.lineTo(px, py); else g.moveTo(px, py); } };
  g.fillStyle = '#4c4a3c'; oct(D.A); g.fill();
  // khối phố (mức xa): nền hơi sáng để thấy ô phố
  if (s < 0.45) {
    g.fillStyle = '#5d5847';
    for (const b of D.blocks) { const p = b.poly; if (!p?.length) continue; let vis = false; for (const q of p) if (inView(q.x, q.z, 150)) { vis = true; break; } if (!vis) continue; g.beginPath(); p.forEach((q, i) => (i ? g.lineTo(X(q.x), Y(q.z)) : g.moveTo(X(q.x), Y(q.z)))); g.closePath(); g.fill(); }
  }
  // nước
  g.strokeStyle = '#3f74a8'; g.fillStyle = '#3f74a8'; g.lineCap = 'round'; g.lineJoin = 'round';
  for (const ch of D.water.channels) { g.lineWidth = Math.max(2, ch.wIn * 2 * s); g.beginPath(); let first = true; for (let i = 0; i < ch.pts.length; i += 3) { const q = ch.pts[i]; if (first) { g.moveTo(X(q.x), Y(q.z)); first = false; } else g.lineTo(X(q.x), Y(q.z)); } g.stroke(); }
  { const lk = D.water.lake; g.beginPath(); g.arc(X(lk.x), Y(lk.z), lk.r * s, 0, 7); g.fill(); }
  // đường
  const RC = { avenue: '#e8d9a8', ring: '#d9c995', boundary: '#bfb08a', street: '#b4a684', boi: '#b4a684', lane: '#9c9076', alley: '#8c8270' };
  for (const kind of ['alley', 'lane', 'street', 'boi', 'boundary', 'ring', 'avenue']) {
    if ((kind === 'alley' || kind === 'lane') && s < 0.3) continue;
    g.strokeStyle = RC[kind]; g.lineCap = 'butt';
    for (const r of D.roads) {
      if (r.kind !== kind) continue;
      if (!inView(r.a.x, r.a.z, 400) && !inView(r.b.x, r.b.z, 400)) continue;
      g.lineWidth = Math.max(kind === 'avenue' ? 2 : 0.8, r.w * s); g.beginPath(); g.moveTo(X(r.a.x), Y(r.a.z)); g.lineTo(X(r.b.x), Y(r.b.z)); g.stroke();
    }
  }
  // tường thành
  g.strokeStyle = '#d6b46a'; g.lineWidth = Math.max(2, 8 * s); oct(D.A); g.stroke();
  // nhà từng căn (mức gần)
  if (s >= 0.35) {
    const gx0 = Math.floor(x0 / D.GS), gx1 = Math.floor(x1 / D.GS), gz0 = Math.floor(z0 / D.GS), gz1 = Math.floor(z1 / D.GS);
    for (let a = gx0; a <= gx1; a++) for (let b = gz0; b <= gz1; b++) for (const e of D.grid.get(`${a},${b}`) || []) {
      const o = e.obb, c = Math.cos(o.ry), sn = Math.sin(o.ry);
      g.fillStyle = e.kind === 'shop' ? (SHOP_COL[e.shop?.type] || '#c9a24a') : KIND_COL[e.kind] || '#cbbf9f';
      g.beginPath();
      for (const [i, j] of [[1, 1], [1, -1], [-1, -1], [-1, 1]]) { const lx = i * o.hw, lz = j * o.hd, px = X(o.x + lx * c + lz * sn), py = Y(o.z - lx * sn + lz * c); if (i === 1 && j === 1) g.moveTo(px, py); else g.lineTo(px, py); }
      g.closePath(); g.fill();
      if (s >= 1.2) { g.strokeStyle = 'rgba(30,20,10,0.5)'; g.lineWidth = 0.6; g.stroke(); }
    }
  }
  // biệt phủ: khuôn viên
  g.strokeStyle = '#7fd08a'; g.lineWidth = Math.max(1, 2 * s);
  for (const m of [...D.phu, ...(s >= 0.6 ? D.villas : [])]) { if (!inView(m.x, m.z, 120)) continue; const c = Math.cos(m.ry), sn = Math.sin(m.ry); g.beginPath(); [[1, 1], [1, -1], [-1, -1], [-1, 1]].forEach(([i, j], n) => { const lx = i * m.W / 2, lz = j * m.D / 2, px = X(m.x + lx * c + lz * sn), py = Y(m.z - lx * sn + lz * c); if (n) g.lineTo(px, py); else g.moveTo(px, py); }); g.closePath(); g.stroke(); }
  // nhãn
  g.textAlign = 'center'; g.textBaseline = 'middle';
  // nhãn tránh chồng nhau: ô đã chiếm (theo thứ tự ưu tiên vẽ — khu > công trình > đại lộ > phố)
  const taken = [];
  const label = (t, x, y, size, col = '#fff3cf', force = false) => {
    g.font = `bold ${size}px serif`;
    const tw = g.measureText(t).width + 6, th = size + 4, r = { x0: x - tw / 2, x1: x + tw / 2, y0: y - th / 2, y1: y + th / 2 };
    if (!force && taken.some((q) => r.x0 < q.x1 && r.x1 > q.x0 && r.y0 < q.y1 && r.y1 > q.y0)) return false;
    taken.push(r);
    g.lineWidth = 3; g.strokeStyle = 'rgba(20,14,8,0.85)'; g.strokeText(t, x, y); g.fillStyle = col; g.fillText(t, x, y); return true;
  };
  const layers = opt.layers || new Set(LAYERS.map((l) => l.id));
  if (!opt.mini) {
    for (const p of D.pois) if (p.big && layers.has(p.layer) && inView(p.x, p.z, 40)) label(p.name.replace(/^Sảnh /, ''), X(p.x), Y(p.z) - 20, 12, p.layer === 'hall' ? '#fff3cf' : '#c8f0c0', p.layer === 'hall'); // phủ / khu biệt thự: tên nhường chỗ công trình // công trình trọng điểm: luôn có tên
    if (s < 0.9) for (const d of D.districts) if (inView(d.centre.x, d.centre.z, 200)) label(d.name, X(d.centre.x), Y(d.centre.z) - 14, s < 0.2 ? 12 : 15, '#ffe6a0');
    if (s >= 0.18 && s < 1.6) for (const r of D.roads) if (r.label && r.kind === 'avenue') { const mx = (r.a.x + r.b.x) / 2, mz = (r.a.z + r.b.z) / 2; if (!inView(mx, mz)) continue; g.save(); g.translate(X(mx), Y(mz)); let ang = Math.atan2(r.b.z - r.a.z, r.b.x - r.a.x); if (ang > Math.PI / 2) ang -= Math.PI; if (ang < -Math.PI / 2) ang += Math.PI; g.rotate(ang); label(r.label, 0, 0, 11, '#3a2a10'); g.restore(); }
    if (s >= 0.9) for (const t of D.streetLabels) if (inView(t.x, t.z)) label(t.name, X(t.x), Y(t.z), 11, '#fbe9c0');
  }
  // icon
  const icon = (p, sz) => { const px = X(p.x), py = Y(p.z); g.beginPath(); g.arc(px, py, sz * 0.62, 0, 7); g.fillStyle = 'rgba(24,18,12,0.85)'; g.fill(); g.lineWidth = 1.5; g.strokeStyle = '#e8c56a'; g.stroke(); g.font = `${sz}px sans-serif`; g.fillStyle = '#fff'; g.fillText(LAYERS.find((l) => l.id === p.layer)?.icon || '•', px, py + 1); };
  const drawn = [], named = [];
  for (const p of D.pois) {
    if (!layers.has(p.layer) || !inView(p.x, p.z, 20)) continue;
    if (p.layer === 'fortune' && s < 0.9 && !opt.mini) continue; // 269 quầy: chỉ hiện khi phóng gần
    if ((p.layer === 'est' || p.layer === 'station' || p.layer === 'temple') && s < 0.25 && !opt.mini) continue; // toàn cảnh: chỉ công trình lớn, cổng, bến
    const sz = opt.mini ? 10 : p.big ? 18 : 15, px = X(p.x), py = Y(p.z);
    /* thưa icon theo màn hình: dãy quầy liền nhau không chồng thành cột (giữ một icon mỗi ~1,4 cỡ icon) */
    if (!p.big && drawn.some((q) => Math.abs(q.x - px) < sz * 1.4 && Math.abs(q.y - py) < sz * 1.4)) continue;
    drawn.push({ x: px, y: py }); icon(p, sz);
    if (!opt.mini && !p.big && s >= 1.4) { /* tên trùng (dãy «Quán Thầy Bói») chỉ ghi một lần trong ~220 px */
      const t = p.name.replace(/^Sảnh /, '');
      if (!named.some((q) => q.t === t && Math.hypot(q.x - px, q.y - py) < 220) && label(t, px, py - sz, 11)) named.push({ t, x: px, y: py });
    }
  }
  // người khác, ghim, người chơi
  for (const o of opt.others || []) { if (!inView(o.x, o.z)) continue; g.beginPath(); g.arc(X(o.x), Y(o.z), 4, 0, 7); g.fillStyle = '#7ad0ff'; g.fill(); }
  if (opt.pin) {
    const px = X(opt.pin.x), py = Y(opt.pin.z);
    if (px > 8 && px < w - 8 && py > 8 && py < h - 8) { g.font = `${opt.mini ? 16 : 26}px sans-serif`; g.fillText('📍', px, py - (opt.mini ? 7 : 11)); }
    else if (opt.mini) { const a = Math.atan2(py - h / 2, px - w / 2), r = Math.min(w, h) / 2 - 16; g.save(); g.translate(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r); g.rotate(a); g.fillStyle = '#ff4a2c'; g.strokeStyle = '#fff3c4'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(11, 0); g.lineTo(-7, -8); g.lineTo(-3, 0); g.lineTo(-7, 8); g.closePath(); g.fill(); g.stroke(); g.restore(); }
  }
  if (opt.player) {
    const p = opt.player, px = X(p.x), py = Y(p.z), hh = p.h || 0, k = opt.mini ? 1 : 1.6;
    g.fillStyle = '#ffd36a'; g.strokeStyle = '#1a1310'; g.lineWidth = 1.5; g.beginPath();
    g.moveTo(px + Math.sin(hh) * 8 * k, py + Math.cos(hh) * 8 * k); g.lineTo(px + Math.sin(hh + 2.5) * 5 * k, py + Math.cos(hh + 2.5) * 5 * k); g.lineTo(px + Math.sin(hh - 2.5) * 5 * k, py + Math.cos(hh - 2.5) * 5 * k);
    g.closePath(); g.fill(); g.stroke();
  }
  g.restore();
}

// --- tra cứu ----------------------------------------------------------------------------------------------------
const norm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
/** tìm theo tên nơi / loại tiệm; gần (x, z) trước */
export function searchMap(q, x, z, max = 8) {
  const D = mapData(), n = norm(q).trim(); if (n.length < 2) return [];
  const types = Object.entries(SHOP_TYPES).filter(([k, T]) => norm(T.name).includes(n) || (ALIAS[k] || '').includes(n)).map(([k]) => k);
  const out = [];
  for (const p of D.pois) if (norm(p.name).includes(n)) out.push({ name: p.name, x: p.x, z: p.z, kind: p.layer, poi: p });
  for (const e of D.houses) if (e.kind === 'shop' && (types.includes(e.shop?.type) || norm(e.name).includes(n))) out.push({ name: e.name, x: e.door.x, z: e.door.z, kind: 'shop', house: e });
  for (const t of D.streetLabels) if (norm(t.name).includes(n)) out.push({ name: t.name, x: t.x, z: t.z, kind: 'street' });
  for (const d of D.districts) if (norm(d.name).includes(n)) out.push({ name: d.name, x: d.centre.x, z: d.centre.z, kind: 'district' });
  const seen = new Set(); /* nhãn phố / khu lặp nhiều đoạn → chỉ giữ đoạn gần nhất */
  return out.map((r) => ({ ...r, d: Math.hypot(r.x - x, r.z - z) })).sort((a, b) => a.d - b.d)
    .filter((r) => { if (r.kind !== 'street' && r.kind !== 'district') return true; const k = r.kind + r.name; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, max);
}
/** chạm vào bản đồ: icon trong bán kính px, rồi nhà chứa điểm (khi phóng gần) */
export function hitMap(view, px, py, layers) {
  const D = mapData(), { cx, cz, s, w, h } = view, wx = cx + (px - w / 2) / s, wz = cz + (py - h / 2) / s;
  let best = null, bd = 16;
  for (const p of D.pois) { if (layers && !layers.has(p.layer)) continue; if (p.layer === 'fortune' && s < 0.9) continue; const d = Math.hypot((p.x - wx) * s, (p.z - wz) * s); if (d < bd) { bd = d; best = { poi: p, name: p.name, x: p.x, z: p.z, kind: p.layer }; } }
  if (best) return best;
  if (s >= 0.35) for (const e of D.grid.get(`${Math.floor(wx / D.GS)},${Math.floor(wz / D.GS)}`) || []) {
    const o = e.obb, c = Math.cos(o.ry), sn = Math.sin(o.ry), dx = wx - o.x, dz = wz - o.z;
    if (Math.abs(dx * c - dz * sn) <= o.hw && Math.abs(dx * sn + dz * c) <= o.hd) return { house: e, name: e.name, x: e.door.x, z: e.door.z, kind: e.kind };
  }
  return { name: 'Điểm đã chọn', x: wx, z: wz, kind: 'point' };
}
export const nearestStation = (x, z) => L.stations().reduce((b, st) => (!b || Math.hypot(st.x - x, st.z - z) < Math.hypot(b.x - x, b.z - z) ? st : b), null);
export const districtName = (x, z) => { const d = L.districtOf(x, z), id = typeof d === 'string' ? d : d?.id; return (d?.name) || (id && L.districts().find((q) => q.id === id)?.name) || (Math.max(Math.abs(x), Math.abs(z)) > L.CITY.A ? 'Ngoài thành' : 'Huyền Thành'); };
const KIND_VI = { phu: 'Biệt phủ', villa: 'Khu biệt thự', shop: 'Cửa hàng', est: 'Nhà rao bán', temple: 'Miếu', fortune: 'Quầy thầy bói', knock: 'Nhà dân', hall: 'Công trình trọng điểm', station: 'Trạm xe ngựa', dock: 'Bến thuyền', gate: 'Cổng thành', street: 'Phố', district: 'Khu', point: 'Vị trí' };

// --- giao diện toàn màn hình ---------------------------------------------------------------------------------------
/**
 * ctx: { player() → {x,z,h}, others() → [{x,z}], pin(), setPin(p|null), travel(station) (đã trừ phí / kiểm), walk(x, z),
 *        free (bool: tân thủ đi xe miễn phí), toast }
 */
export function openMapScreen(root, ctx) {
  const ov = document.createElement('div'); ov.className = 'hq-mapfull';
  ov.innerHTML = `<canvas></canvas>
    <div class="hq-map-top"><input class="hq-input" type="search" placeholder="Tìm nơi, loại tiệm (thuốc, trà, miếu…)" autocomplete="off"><button class="hq-btn" data-a="close" type="button" aria-label="Đóng">✕</button></div>
    <div class="hq-map-res" hidden></div>
    <div class="hq-map-layers">${LAYERS.map((l) => `<button type="button" class="hq-chip on" data-l="${l.id}">${l.icon} ${l.name}</button>`).join('')}</div>
    <div class="hq-map-zoom"><button class="hq-btn" data-a="in" type="button">＋</button><button class="hq-btn" data-a="out" type="button">－</button><button class="hq-btn" data-a="me" type="button" title="Về vị trí của tôi">◎</button></div>
    <div class="hq-map-card" hidden></div>
    <div class="hq-map-legend">${Object.entries({ 'Tiệm': '#d08a3c', 'Nhà dân': KIND_COL.knock, 'Nhà bán': KIND_COL.est, 'Miếu': KIND_COL.temple, 'Thầy bói': KIND_COL.fortune }).map(([n, c]) => `<span><i style="background:${c}"></i>${n}</span>`).join('')}</div>`;
  root.appendChild(ov);
  const cv = ov.querySelector('canvas'), g = cv.getContext('2d');
  const me = ctx.player();
  const view = { cx: me.x, cz: me.z, s: 0.9, w: 1, h: 1 };
  const layers = new Set(LAYERS.map((l) => l.id));
  const fit = () => { const r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1); cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); g.setTransform(dpr, 0, 0, dpr, 0, 0); view.w = r.width; view.h = r.height; };
  let raf = 0;
  const draw = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; drawMap(g, view, { player: ctx.player(), others: ctx.others(), pin: ctx.pin(), layers }); }); };
  const zoomAt = (k, px = view.w / 2, py = view.h / 2) => {
    const s2 = Math.max(0.08, Math.min(4, view.s * k)), wx = view.cx + (px - view.w / 2) / view.s, wz = view.cz + (py - view.h / 2) / view.s;
    view.s = s2; view.cx = wx - (px - view.w / 2) / s2; view.cz = wz - (py - view.h / 2) / s2; draw();
  };
  const close = () => { ov.remove(); removeEventListener('resize', onRes); removeEventListener('keydown', onKey); };
  const onRes = () => { fit(); draw(); }, onKey = (e) => { if (e.key === 'Escape' || e.key === 'm' || e.key === 'M') { if (document.activeElement?.tagName === 'INPUT' && e.key !== 'Escape') return; close(); } };
  addEventListener('resize', onRes); addEventListener('keydown', onKey);
  // --- thẻ thông tin
  const card = ov.querySelector('.hq-map-card');
  const showCard = (t) => {
    const p = ctx.player(), d = Math.hypot(t.x - p.x, t.z - p.z), st = t.poi?.station || null, near = nearestStation(t.x, t.z);
    const typeName = t.house?.shop ? SHOP_TYPES[t.house.shop.type]?.name : '';
    card.innerHTML = `<b>${esc(t.name)}</b><p class="hq-sub">${esc(KIND_VI[t.kind] || '')}${typeName ? ` · ${esc(typeName)}` : ''} · ${esc(districtName(t.x, t.z))} · cách bạn ${d < 1000 ? `${Math.round(d)} m` : `${(d / 1000).toFixed(1)} km`}</p>
      <div class="hq-actions">
        <button class="hq-btn hq-primary" data-a="pin" type="button">📍 Đặt dấu</button>
        ${st ? `<button class="hq-btn" data-a="go" type="button">🐎 Đi xe tới đây${ctx.free ? '' : ' (5 đồng)'}</button>` : near && Math.hypot(near.x - p.x, near.z - p.z) > 80 ? `<button class="hq-btn" data-a="near" type="button">🐎 Xe tới ${esc(near.name.replace(/^Ga /, 'ga '))} (cách đích ${Math.round(Math.hypot(near.x - t.x, near.z - t.z))} m)</button>` : ''}
        ${d < 260 ? '<button class="hq-btn" data-a="walk" type="button">🚶 Đi bộ tới</button>' : ''}
        <button class="hq-btn" data-a="x" type="button">Đóng</button>
      </div>`;
    card.hidden = false;
    card.querySelector('[data-a=pin]').onclick = () => { ctx.setPin({ x: t.x, z: t.z, name: t.name }); card.hidden = true; draw(); ctx.toast?.(`📍 Đã đặt dấu: ${t.name}`); };
    card.querySelector('[data-a=x]').onclick = () => { card.hidden = true; };
    const go = card.querySelector('[data-a=go]'); if (go) go.onclick = () => { if (ctx.travel(st)) close(); };
    const nr = card.querySelector('[data-a=near]'); if (nr) nr.onclick = () => { ctx.setPin({ x: t.x, z: t.z, name: t.name }); if (ctx.travel(near)) close(); };
    const wk = card.querySelector('[data-a=walk]'); if (wk) wk.onclick = () => { ctx.setPin({ x: t.x, z: t.z, name: t.name }); ctx.walk(t.x, t.z); close(); };
  };
  // --- tìm kiếm
  const inp = ov.querySelector('input'), res = ov.querySelector('.hq-map-res');
  inp.oninput = () => {
    const p = ctx.player(), R = searchMap(inp.value, p.x, p.z);
    res.hidden = !R.length;
    res.innerHTML = R.map((r, i) => `<button type="button" class="hq-row-btn" data-i="${i}">${esc(r.name)} <small>${esc(KIND_VI[r.kind] || '')} · ${r.d < 1000 ? `${Math.round(r.d)} m` : `${(r.d / 1000).toFixed(1)} km`}</small></button>`).join('');
    res.querySelectorAll('[data-i]').forEach((b) => { b.onclick = () => { const r = R[Number(b.dataset.i)]; view.cx = r.x; view.cz = r.z; view.s = Math.max(view.s, 1.2); res.hidden = true; draw(); showCard(r); }; });
  };
  // --- lớp, phóng, đóng
  ov.querySelectorAll('[data-l]').forEach((b) => { b.onclick = () => { const id = b.dataset.l; if (layers.has(id)) layers.delete(id); else layers.add(id); b.classList.toggle('on', layers.has(id)); draw(); }; });
  ov.querySelector('[data-a=close]').onclick = close;
  ov.querySelector('[data-a=in]').onclick = () => zoomAt(1.6);
  ov.querySelector('[data-a=out]').onclick = () => zoomAt(1 / 1.6);
  ov.querySelector('[data-a=me]').onclick = () => { const p = ctx.player(); view.cx = p.x; view.cz = p.z; view.s = Math.max(view.s, 0.8); draw(); };
  // --- kéo / chụm / lăn / chạm
  const pts = new Map(); let moved = 0, pinch0 = null;
  cv.addEventListener('pointerdown', (e) => { cv.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.offsetX, y: e.offsetY }); moved = 0; if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch0 = { d: Math.hypot(a.x - b.x, a.y - b.y), s: view.s }; } });
  cv.addEventListener('pointermove', (e) => {
    const p = pts.get(e.pointerId); if (!p) return;
    const dx = e.offsetX - p.x, dy = e.offsetY - p.y; p.x = e.offsetX; p.y = e.offsetY;
    if (pts.size === 2 && pinch0) { const [a, b] = [...pts.values()], d = Math.hypot(a.x - b.x, a.y - b.y); zoomAt((pinch0.s * d / pinch0.d) / view.s, (a.x + b.x) / 2, (a.y + b.y) / 2); moved += 10; return; }
    view.cx -= dx / view.s; view.cz -= dy / view.s; moved += Math.abs(dx) + Math.abs(dy); draw();
  });
  const up = (e) => { const was = pts.size; pts.delete(e.pointerId); if (pts.size < 2) pinch0 = null; if (was === 1 && moved < 6) { res.hidden = true; showCard(hitMap(view, e.offsetX, e.offsetY, layers)); } };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', (e) => { pts.delete(e.pointerId); pinch0 = null; });
  cv.addEventListener('wheel', (e) => { e.preventDefault(); zoomAt(e.deltaY < 0 ? 1.25 : 0.8, e.offsetX, e.offsetY); }, { passive: false });
  requestAnimationFrame(() => { fit(); draw(); });
  return { close, view, draw };
}
