// ============================================================================
//  BÁT QUÁI THÀNH — dựng 3D theo batquai.js: tường bát giác + 8 cổng (Bát Môn), tháp góc,
//  đĩa quẻ khảm đá, bia quẻ, 8 khu (công trình Meshy CC0 + thủ công: ao, ruộng, sân võ, lôi đài,
//  giếng), đèn lồng, nhà vườn, cây. landmarks.js gọi: octWall, cityGates, buildDistrict.
// ============================================================================
import * as THREE from 'three';
import { lotusLife, waterSurface } from './lotus.js';
import * as T from './terrain.js';
import * as BQ from './batquai.js';
import { stoneMaterial } from './ground-tex.js';
import { addBlock, addSolidOBB } from './obstacles.js';
import { addFootprint } from './collide.js';
import { instanceModel, instanceModelLod, loadModel, placeModel, hasLod, modelAvailable } from './assets.js';

const H = (x, z) => T.heightAt(x, z);
// model Meshy tải từ thư viện cộng đồng cho thành Bát Quái (public/models/bq_*.glb) — chỉ dò những id có file
export const BQ_AVAILABLE = new Set(['bq_alchemy_hall', 'bq_array_hall', 'bq_drum_tower', 'bq_farmhouse', 'bq_furnace', 'bq_herb_pav', 'bq_library_pagoda',
  'bq_lion', 'bq_music_pav', 'bq_house_2f', 'bq_house_tiled', 'bq_house_stone', 'bq_shop_lantern', 'bq_pagoda', 'bq_stage', 'bq_sword_pav', 'bq_sword_tower', 'bq_tavern', 'bq_teahouse', 'bq_thunder_hall', 'bq_weapon_rack']);
const usable = (id) => !id.startsWith('bq_') || BQ_AVAILABLE.has(id);
// chỉ tra danh sách file — trước đây tải nguyên bản .lod để «thử», rồi placeModel lại tải bản .far (tải đôi)
async function firstAvailable(ids) { for (const id of ids) if (usable(id) && (await modelAvailable(id))) return id; return null; }
const corridor = (x, z, ry, hw) => (px, pz) => Math.abs(Math.cos(ry) * (px - x) - Math.sin(ry) * (pz - z)) > hw;
export async function place(g, ids, opts) {
  const id = await firstAvailable([].concat(ids));
  const r = id ? await placeModel(g, id, opts) : null;
  if (r && opts.solid !== false) addFootprint(r.obj, { keep: opts.keep || null, fill: opts.fill ?? 'auto' });
  return r;
}
/** Nhóm theo khung khu: x cục bộ = trục u, z cục bộ = ngang v */
function localGroup(g, u, v, y = null) {
  const w = BQ.toWorld(g, u, v), grp = new THREE.Group();
  grp.position.set(w.x, y ?? H(w.x, w.z), w.z);
  grp.rotation.y = Math.atan2(-g.dir[1], g.dir[0]);
  return grp;
}
const ryOf = (g, b) => (b.face === 'center' ? BQ.faceAxis(g, false) : b.face === 'axis' ? BQ.faceAxis(g, true) : BQ.faceAvenue(g, b.v));

// ---------------------------------------------------------------------------
// Kết cấu vẽ tay (canvas): quẻ, đĩa khảm, bia, mặt lôi đài Bát Quái
// ---------------------------------------------------------------------------
const GOLD = '#d9a441', INK = '#2a211a';
function drawTrigram(c, lines, cx, cy, w, h, gap, color = GOLD) {
  c.fillStyle = color;
  lines.forEach((yang, i) => { // hào 1 ở dưới
    const y = cy + (1 - i) * (h + gap) - h / 2;
    if (yang) c.fillRect(cx - w / 2, y, w, h);
    else { c.fillRect(cx - w / 2, y, w * 0.42, h); c.fillRect(cx + w * 0.08, y, w * 0.42, h); }
  });
}
function canvasTex(w, h, draw) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  draw(cv.getContext('2d'));
  const t = new THREE.CanvasTexture(cv); t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function discTexture(g) {
  return canvasTex(512, 512, (c) => {
    c.fillStyle = '#5e574d'; c.beginPath(); c.arc(256, 256, 254, 0, Math.PI * 2); c.fill();
    c.strokeStyle = GOLD; c.lineWidth = 10; c.beginPath(); c.arc(256, 256, 236, 0, Math.PI * 2); c.stroke();
    c.lineWidth = 3; c.beginPath(); c.arc(256, 256, 214, 0, Math.PI * 2); c.stroke();
    c.fillStyle = '#3a342c'; c.beginPath(); c.arc(256, 256, 150, 0, Math.PI * 2); c.fill();
    drawTrigram(c, g.lines, 256, 256, 200, 34, 24);
    c.fillStyle = '#f3df9a'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = 'bold 54px serif'; c.fillText(g.name.toUpperCase(), 256, 64);
    c.font = 'bold 34px serif'; c.fillText(g.gate.toUpperCase(), 256, 452);
  });
}
function steleTexture(g) {
  return canvasTex(256, 448, (c) => {
    c.fillStyle = '#4a4339'; c.fillRect(0, 0, 256, 448);
    c.strokeStyle = GOLD; c.lineWidth = 6; c.strokeRect(10, 10, 236, 428);
    drawTrigram(c, g.lines, 128, 92, 150, 22, 16);
    c.fillStyle = '#f3df9a'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = 'bold 64px serif'; c.fillText(g.name.toUpperCase(), 128, 200);
    c.font = 'bold 26px serif'; c.fillText(g.gate, 128, 252);
    c.fillStyle = '#e8d9b0'; c.font = '22px serif';
    const words = g.district.split(' '); c.fillText(words.slice(0, 2).join(' '), 128, 306); c.fillText(words.slice(2).join(' '), 128, 334);
    c.font = 'italic 17px serif'; c.fillStyle = '#cdbf98';
    const th = g.theme.split(', '); th.forEach((s, i) => c.fillText(s, 128, 378 + i * 22));
  });
}
/** Mặt đài Bát Quái: Thái Cực giữa + 8 quẻ Hậu Thiên quanh vòng (hào 1 hướng vào tâm) */
let baguaTex = null;
export function baguaTexture() {
  if (baguaTex) return baguaTex;
  baguaTex = canvasTex(1024, 1024, (c) => {
    c.fillStyle = '#6a6156'; c.fillRect(0, 0, 1024, 1024);
    c.strokeStyle = GOLD; c.lineWidth = 14; c.beginPath(); c.arc(512, 512, 490, 0, Math.PI * 2); c.stroke();
    c.lineWidth = 5; c.beginPath(); c.arc(512, 512, 250, 0, Math.PI * 2); c.stroke();
    // Thái Cực
    const R = 200;
    c.fillStyle = '#f2ead6'; c.beginPath(); c.arc(512, 512, R, 0, Math.PI * 2); c.fill();
    c.fillStyle = INK; c.beginPath(); c.arc(512, 512, R, Math.PI / 2, Math.PI * 1.5); c.fill();
    c.beginPath(); c.arc(512, 512 - R / 2, R / 2, 0, Math.PI * 2); c.fillStyle = INK; c.fill();
    c.beginPath(); c.arc(512, 512 + R / 2, R / 2, 0, Math.PI * 2); c.fillStyle = '#f2ead6'; c.fill();
    c.beginPath(); c.arc(512, 512 - R / 2, R / 7, 0, Math.PI * 2); c.fillStyle = '#f2ead6'; c.fill();
    c.beginPath(); c.arc(512, 512 + R / 2, R / 7, 0, Math.PI * 2); c.fillStyle = INK; c.fill();
    // 8 quẻ: canvas «xuống» (+y) = hướng Nam (+z thế giới) khi đặt mặt đài nằm ngửa, không xoay
    for (const g of BQ.GUA) {
      c.save(); c.translate(512, 512);
      c.rotate(Math.atan2(g.dir[1], g.dir[0]) - Math.PI / 2); // trục quẻ → +y canvas
      drawTrigram(c, [...g.lines].reverse(), 0, 370, 170, 26, 18); // hào 1 gần tâm (y nhỏ)
      c.restore();
    }
  });
  return baguaTex;
}

// ---------------------------------------------------------------------------
// Tường bát giác + tháp góc + cổng
// ---------------------------------------------------------------------------
let wallMats = null;
export const mats = () => wallMats || (wallMats = {
  wall: stoneMaterial({ seed: 61, rows: 10, repeat: [3, 3], base: '#7e776c', grout: '#3e3933', roughness: 0.93 }),
  cap: new THREE.MeshStandardMaterial({ color: '#3a2a26', roughness: 0.7 }),
  roof: new THREE.MeshStandardMaterial({ color: '#2f3a3a', roughness: 0.6, metalness: 0.15 }),
  red: new THREE.MeshStandardMaterial({ color: '#8f2a1e', roughness: 0.65 }),
  wood: new THREE.MeshStandardMaterial({ color: '#5a3a24', roughness: 0.8 }),
  stone: stoneMaterial({ seed: 33, rows: 4, repeat: [1, 1], base: '#8a8378' }),
  gold: new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.7, roughness: 0.35 }),
});
export function octWall(g) {
  const M = mats();
  for (const b of BQ.octWallBlocks()) addBlock(b.x, b.z, b.r);
  for (const s of BQ.wallSegments()) {
    const ex = s.b.x - s.a.x, ez = s.b.z - s.a.z, L = Math.hypot(ex, ez), n = Math.max(1, Math.ceil(L / 10));
    const ry = Math.atan2(-ez, ex), len = L / n + 0.5;
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, cx = s.a.x + ex * t, cz = s.a.z + ez * t, y = H(cx, cz);
      const seg = new THREE.Mesh(new THREE.BoxGeometry(len, BQ.WALL_H, BQ.WALL_T), M.wall);
      seg.position.set(cx, y + BQ.WALL_H / 2 - 1, cz); seg.rotation.y = ry; seg.castShadow = true; seg.receiveShadow = true; g.add(seg);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(len, 1.4, BQ.WALL_T + 1.4), M.cap); cap.position.set(cx, y + BQ.WALL_H - 0.3, cz); cap.rotation.y = ry; g.add(cap);
      for (const k of [-0.3, 0.3]) { // lỗ châu mai
        const m2 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.1), M.wall);
        m2.position.set(cx + Math.cos(ry) * k * len, y + BQ.WALL_H + 1, cz - Math.sin(ry) * k * len); m2.rotation.y = ry; g.add(m2);
      }
    }
  }
  // tháp góc bát giác ở 8 đỉnh: thân đá, lầu gỗ đỏ, mái ngói
  for (const p of BQ.octVertices()) {
    const y = H(p.x, p.z);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 6.8, 20, 8), M.wall); body.position.set(p.x, y + 9, p.z); body.rotation.y = Math.PI / 8; body.castShadow = true; g.add(body);
    const lau = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, 4.2, 8), M.red); lau.position.set(p.x, y + 21.1, p.z); lau.rotation.y = Math.PI / 8; lau.castShadow = true; g.add(lau);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(7.4, 4.6, 8), M.roof); roof.position.set(p.x, y + 25.5, p.z); roof.rotation.y = Math.PI / 8; roof.castShadow = true; g.add(roof);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.6, 10, 8), M.gold); tip.position.set(p.x, y + 28.2, p.z); g.add(tip);
    addBlock(p.x, p.z, 6.8);
  }
}
export async function cityGates(g) {
  for (const gg of BQ.GUA) {
    const p = BQ.toWorld(gg, BQ.OCT_A, 0), ry = BQ.faceAxis(gg, true);
    const ids = gg.id === 'kan' ? ['gate_sect'] : ['city_gate', 'gate_sect'];
    await place(g, ids, { fit: { width: BQ.gateWidth(gg) }, at: { x: p.x, y: H(p.x, p.z), z: p.z, ry }, keep: corridor(p.x, p.z, ry, 5) });
  }
}

// ---------------------------------------------------------------------------
// Đĩa quẻ khảm đá + bia quẻ
// ---------------------------------------------------------------------------
function emblem(grp, g, at) {
  const disc = new THREE.Mesh(new THREE.CircleGeometry(4.4, 48), new THREE.MeshStandardMaterial({ map: discTexture(g), roughness: 0.75, polygonOffset: true, polygonOffsetFactor: -2 }));
  disc.rotation.x = -Math.PI / 2;
  const holder = new THREE.Group(); holder.add(disc);
  holder.position.set(at.x, H(at.x, at.z) + 0.04, at.z); holder.rotation.y = BQ.faceAxis(g, false);
  disc.receiveShadow = true; grp.add(holder);
}
function stele(grp, g, at, ry) {
  const M = mats(), s = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.5, 0.9), M.stone); base.position.y = 0.25;
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.45, 2.5, 0.38), M.stone); body.position.y = 1.75;
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.28, 0.6), M.cap); top.position.y = 3.12;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 2.28), new THREE.MeshStandardMaterial({ map: steleTexture(g), roughness: 0.7 }));
  face.position.set(0, 1.75, 0.195);
  for (const m of [base, body, top]) { m.castShadow = true; m.receiveShadow = true; }
  s.add(base, body, top, face);
  s.position.set(at.x, H(at.x, at.z), at.z); s.rotation.y = ry;
  grp.add(s); addFootprint(s, { hi: 1.6, fill: false });
}
export function nameBoard(text, ry) {
  const M = mats(), grp = new THREE.Group();
  const tex = canvasTex(512, 160, (c) => {
    c.fillStyle = '#33210f'; c.fillRect(0, 0, 512, 160);
    c.strokeStyle = GOLD; c.lineWidth = 10; c.strokeRect(8, 8, 496, 144);
    c.fillStyle = '#f3df9a'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `bold ${Math.min(80, Math.floor(3800 / Math.max(1, text.length)))}px serif`; c.fillText(text, 256, 84);
  });
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 2.1, 8), M.wood); post.position.y = 1.05; post.castShadow = true;
  const card = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.75), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, side: THREE.DoubleSide })); card.position.y = 2.15; card.castShadow = true;
  grp.add(post, card); grp.rotation.y = ry;
  return grp;
}

// ---------------------------------------------------------------------------
// Đồ thủ công trong khu
// ---------------------------------------------------------------------------
export function pond(grp, g, p) {
  const lg = localGroup(g, p.u, p.v);
  const water = waterSurface(p.w - 1, p.d - 1); water.position.y = 0.08; lg.add(water);
  const M = mats();
  for (const [w, d, x, z] of [[p.w, 0.8, 0, p.d / 2], [p.w, 0.8, 0, -p.d / 2], [0.8, p.d, p.w / 2, 0], [0.8, p.d, -p.w / 2, 0]]) {
    const r = new THREE.Mesh(new THREE.BoxGeometry(w, 0.45, d), M.stone); r.position.set(x, 0.22, z); r.receiveShadow = true; lg.add(r);
  }
  // sen + cá trên mặt ao (lotus.js — chỉ cập nhật khi người chơi ở gần)
  lotusLife(lg, { x0: -(p.w - 1) / 2, x1: (p.w - 1) / 2, z0: -(p.d - 1) / 2, z1: (p.d - 1) / 2, y: 0.08, seed: Math.round(p.u * 3 + p.v * 5) });
  grp.add(lg);
  // ao chặn đi bộ (hộp xoay theo khung cung — dùng được cho mọi cung)
  const c = BQ.toWorld(g, p.u, p.v);
  addSolidOBB(c.x, c.z, p.w / 2, p.d / 2, Math.atan2(-g.dir[1], g.dir[0]));
}
export function field(grp, g, f) {
  const lg = localGroup(g, f.u, f.v), M = mats();
  const tex = canvasTex(256, 256, (c) => {
    c.fillStyle = f.herb ? '#5b4a33' : '#6b5536'; c.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 12; i++) {
      c.fillStyle = f.herb ? ['#6aa356', '#9fc25a', '#c46f8f', '#e0c95a'][i % 4] : (i % 2 ? '#86b04a' : '#a3c25a');
      c.fillRect(i * 21 + 4, 6, 12, 244);
    }
  });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(f.w - 0.6, f.d - 0.6), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -1 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = 0.05; ground.receiveShadow = true; lg.add(ground);
  // mạ: hàng cây non nổi khối (nhân bản)
  const sprout = new THREE.ConeGeometry(0.12, 0.55, 5); sprout.translate(0, 0.27, 0);
  const rows = Math.floor((f.d - 1.6) / 0.85), cols = Math.floor((f.w - 1.6) / 0.6);
  const im = new THREE.InstancedMesh(sprout, new THREE.MeshStandardMaterial({ color: f.herb ? '#7fae5a' : '#9cc153', roughness: 0.8 }), rows * cols);
  const m4 = new THREE.Matrix4(); let k = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { m4.makeTranslation(-f.w / 2 + 0.8 + c * 0.6, 0, -f.d / 2 + 0.8 + r * 0.85); im.setMatrixAt(k++, m4); }
  lg.add(im);
  // hàng rào tre thấp
  const fence = new THREE.Group();
  for (const [w, d, x, z] of [[f.w, 0.12, 0, f.d / 2], [f.w, 0.12, 0, -f.d / 2], [0.12, f.d, f.w / 2, 0], [0.12, f.d, -f.w / 2, 0]]) {
    for (const y of [0.35, 0.75]) { const r = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, d), M.wood); r.position.set(x, y, z); fence.add(r); }
    const n = Math.max(2, Math.round(Math.max(w, d) / 2));
    for (let i = 0; i <= n; i++) { const t = i / n - 0.5, pst = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1, 0.12), M.wood); pst.position.set(x + (w > d ? t * w : 0), 0.5, z + (d > w ? t * d : 0)); pst.castShadow = true; fence.add(pst); }
  }
  lg.add(fence); grp.add(lg);
  addFootprint(fence, { hi: 1.0, fill: true });
}
export async function yard(grp, g, y) {
  const lg = localGroup(g, y.u, y.v), M = mats();
  const rackModel = await firstAvailable(['bq_weapon_rack']);
  const sand = new THREE.Mesh(new THREE.PlaneGeometry(y.w, y.d), new THREE.MeshStandardMaterial({ color: '#c8b48a', roughness: 1, polygonOffset: true, polygonOffsetFactor: -1 }));
  sand.rotation.x = -Math.PI / 2; sand.position.y = 0.04; sand.receiveShadow = true; lg.add(sand);
  // giá binh khí (kiếm, thương) dọc mép ngoài + cọc gỗ tập
  for (const s of [-1, 1]) {
    if (rackModel) { // giá binh khí Meshy CC0 dọc mép ngoài sân
      const w = BQ.toWorld(g, y.u + y.w / 2 - 1.4, y.v + s * (y.d / 2 - 2.8));
      await place(grp, rackModel, { fit: { depth: 3.4 }, at: { x: w.x, y: H(w.x, w.z), z: w.z, ry: BQ.faceAxis(g, false) + Math.PI / 2 }, fill: false });
      continue;
    }
    const rack = new THREE.Group();
    const bar = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.14, 0.14), M.wood);
    for (const yy of [0.5, 1.6]) { const b2 = bar.clone(); b2.position.y = yy; rack.add(b2); }
    for (const x of [-1.5, 1.5]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2, 0.16), M.wood); p.position.set(x, 1, 0); rack.add(p); }
    for (let i = 0; i < 6; i++) { const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.6, 5), i % 2 ? M.gold : M.wood); sp.position.set(-1.2 + i * 0.48, 1.3, 0.12); sp.rotation.z = 0.08; rack.add(sp); }
    rack.position.set(y.w / 2 - 1.2, 0, s * (y.d / 2 - 2.5)); rack.rotation.y = Math.PI / 2;
    rack.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    lg.add(rack);
  }
  for (let i = 0; i < 3; i++) {
    const d = new THREE.Group();
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.8, 8), M.wood); post.position.y = 0.9;
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 6), M.wood); arm.rotation.z = Math.PI / 2; arm.position.y = 1.35;
    d.add(post, arm); d.position.set(-y.w / 2 + 3 + i * 3.2, 0, -y.d / 2 + 2.4); d.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    lg.add(d);
  }
  grp.add(lg); lg.updateMatrixWorld(true);
  for (const c of lg.children) if (c.isGroup) addFootprint(c, { hi: 1.6, fill: false });
}
export function arena(grp, g, a) {
  const w = BQ.toWorld(g, a.u, a.v), y = H(w.x, w.z), M = mats();
  const lg = new THREE.Group(); lg.position.set(w.x, y, w.z);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(a.r, a.r + 0.5, 1.2, 8), M.stone); body.position.y = 0.6; body.rotation.y = Math.PI / 8; body.castShadow = true; body.receiveShadow = true;
  const trim = new THREE.Mesh(new THREE.CylinderGeometry(a.r + 0.15, a.r + 0.15, 0.22, 8), M.gold); trim.position.y = 1.12; trim.rotation.y = Math.PI / 8;
  const top = new THREE.Mesh(new THREE.CircleGeometry(a.r - 0.4, 64), new THREE.MeshStandardMaterial({ map: baguaTexture(), roughness: 0.7 }));
  top.rotation.x = -Math.PI / 2; top.position.y = 1.235; top.receiveShadow = true;
  lg.add(body, trim, top);
  // 8 cột cờ ở 8 góc đài — màu cờ theo hành của quẻ từng hướng
  for (const gg of BQ.GUA) {
    const px = gg.dir[0] * (a.r + 0.9), pz = gg.dir[1] * (a.r + 0.9);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 6, 6), M.wood); pole.position.set(px, 3, pz); pole.castShadow = true;
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.9), new THREE.MeshStandardMaterial({ color: gg.color, roughness: 0.8, side: THREE.DoubleSide }));
    flag.position.set(px + 0.7 * gg.dir[1], 5.4, pz - 0.7 * gg.dir[0]); flag.rotation.y = Math.atan2(gg.dir[0], gg.dir[1]);
    lg.add(pole, flag);
  }
  grp.add(lg); lg.updateMatrixWorld(true);
  addFootprint(body, { hi: 1.0, fill: true });
}
function well(grp, w) {
  const M = mats(), y = H(w.x, w.z), lg = new THREE.Group(); lg.position.set(w.x, y, w.z);
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, 0.9, 16, 1, true), M.stone); ring.position.y = 0.45; ring.castShadow = true;
  const lip = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.12, 6, 18), M.stone); lip.rotation.x = Math.PI / 2; lip.position.y = 0.9;
  const water = new THREE.Mesh(new THREE.CircleGeometry(1.15, 16), new THREE.MeshStandardMaterial({ color: '#1f4650', roughness: 0.05, metalness: 0.4 })); water.rotation.x = -Math.PI / 2; water.position.y = 0.35;
  lg.add(ring, lip, water);
  for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.3, 0.16), M.wood); p.position.set(s * 1.45, 1.15, 0); lg.add(p); }
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.1, 6), M.wood); beam.rotation.z = Math.PI / 2; beam.position.y = 1.95; lg.add(beam);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1, 4), M.roof); roof.position.y = 2.75; roof.rotation.y = Math.PI / 4; roof.castShadow = true; lg.add(roof);
  grp.add(lg); lg.updateMatrixWorld(true);
  addFootprint(lg, { hi: 1.4, fill: false });
}

/** Đèn lồng: landmarks › lanternPosts (truyền vào để dùng chung đèn + ánh sáng) */
export async function buildDistrict(grp, g, { lanternPosts, solidTrees }) {
  const D = BQ.DISTRICTS[g.id];
  for (const b of D.buildings) {
    const w = BQ.toWorld(g, b.u, b.v);
    await place(grp, b.model, { fit: b.fit, at: { x: w.x, y: H(w.x, w.z), z: w.z, ry: ryOf(g, b) } });
    const bs = BQ.boardSpot(b);
    if (bs) {
      const p = BQ.toWorld(g, bs.u, bs.v);
      const brd = nameBoard(b.name, bs.face === 'center' ? BQ.faceAxis(g, false) : BQ.faceAvenue(g, bs.v));
      brd.position.set(p.x, H(p.x, p.z), p.z); grp.add(brd); addFootprint(brd, { hi: 1.6, fill: false });
    }
  }
  if (D.pond) pond(grp, g, D.pond);
  for (const f of D.fields || []) field(grp, g, f);
  if (D.yard) await yard(grp, g, D.yard);
  if (D.arena) arena(grp, g, D.arena);
  if (D.well) well(grp, D.well);
  if (D.rocks?.length) {
    const items = D.rocks.map(([u, v, r], i) => { const w = BQ.toWorld(g, u, v); return { x: w.x, y: H(w.x, w.z) - r * 0.12, z: w.z, ry: i * 1.9, s: r }; });
    const rk = await instanceModel(grp, 'rock_island', items, { fitKey: 'max' });
    if (rk) addFootprint(rk, { ground: H, fill: false });
  }
  if (D.houses.length) {
    const items = D.houses.map(([u, v]) => { const w = BQ.toWorld(g, u, v); return { x: w.x, y: H(w.x, w.z), z: w.z, ry: BQ.faceAvenue(g, v), s: BQ.HOUSE_S }; });
    const row = await instanceModelLod(grp, 'lib_courtyard', items, { fitKey: 'max' });
    if (row) { addFootprint(row.group, { ground: H }); grp.userData.lod = row.update; }
  }
  if (D.trees.length) {
    const s = { lib_willow: 11, tree_pine: 14 }[D.treeModel] || 9;
    solidTrees(await instanceModel(grp, D.treeModel || 'lib_blossom', D.trees.map(([u, v], i) => { const w = BQ.toWorld(g, u, v); return { x: w.x, y: H(w.x, w.z), z: w.z, ry: i * 1.3, s }; })));
  }
  if (g.id !== 'li' && g.id !== 'kan') {
    const posts = [];
    for (const u of BQ.POST_U) for (const sv of [-1, 1]) { const w = BQ.toWorld(g, u, sv * BQ.POST_V); posts.push({ x: w.x, y: H(w.x, w.z), z: w.z, ry: Math.atan2(sv * g.dir[0], sv * g.dir[1]) }); }
    await lanternPosts(grp, posts);
  }
  if (g.id !== 'kan') for (const sv of [-1, 1]) {
    const w = BQ.toWorld(g, BQ.lionU(g), sv * BQ.LION.v);
    await place(grp, ['bq_lion'], { fit: { height: BQ.LION.h }, at: { x: w.x, y: H(w.x, w.z), z: w.z, ry: BQ.faceAxis(g, false) + Math.PI / 2 }, fill: false }); // model nhìn theo +x → xoay để nhìn về tâm thành
  }
  // đĩa quẻ trên đại lộ trước cổng + bia quẻ đầu khu (Khảm: cạnh giếng, Ly: trước tửu lâu)
  const e = D.emblem || BQ.toWorld(g, BQ.EMBLEM_U, 0);
  emblem(grp, g, e);
  const st = D.stele || BQ.toWorld(g, BQ.STELE.u, BQ.STELE.v);
  stele(grp, g, st, D.stele ? Math.atan2(-st.x, -st.z) : BQ.faceAvenue(g, BQ.STELE.v));
}
