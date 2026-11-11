// ============================================================================
//  DỰNG NỘI THẤT PHÒNG LƯỚI (rooms.js) — dựng LƯỜI khi người chơi bước vào, giữ tối đa 6 phòng,
//  giải phóng phòng cũ nhất. Ba loại:
//   · cửa hàng: quầy + chủ tiệm (NPC có tên) + hàng THẬT của tiệm bày dọc hai vách (dựng đúng món
//     trong items.js), hàng tiêu dùng bày trên quầy, góc dịch vụ (tửu lâu, trà lâu, dịch trạm…);
//   · nhà riêng: vỏ phòng theo hạng + đồ đạc theo bố cục (rooms.homeInfoOf) — đồ có chức năng thành
//     điểm tương tác;
//   · điện thờ (công trình mốc, điện có tên Nội Thành): bàn thờ ba cấp, tượng thần, lư hương.
//  Mọi điểm tương tác ghi vào rooms.setRoomSpots (world.js biến thành trạm ảo); va chạm đồ đạc qua
//  obstacles.setRoomSolids; đèn theo khoá phòng (lights.removeRoomLights khi giải phóng).
// ============================================================================
import { GODS, godOfTemple } from './temples.js';
import { MASTERS } from './fortune-npc.js';
import * as THREE from 'three';
import { roomByKey, roomAtDyn, setRoomSpots, clearRoomSpots, homeInfoOf, TEMPLE_NB } from './rooms.js';
import { SHOP_TYPES, ITEM, itemsOfShop, COUPLETS, WX_NAME } from './items.js';
import { TIERS, footOf } from './estate.js';
import { setRoomSolids, clearRoomSolids } from './obstacles.js';
import { addLight, removeRoomLights, addGlow } from './lights.js';
import { placeModel } from './assets.js';
import { stoneMaterial } from './ground-tex.js';
import { guaById } from './batquai.js';
import { SVC, svcInfo, USE_VERB } from './shop-data.js';
import { JOB_OF_SHOP, MINE_SHOP, WORK } from './jobs.js';

const MAX_BUILT = 6;
const Q = Math.PI / 2;

// --- vật liệu dùng chung (không giải phóng)
let M = null;
const TEX = new Map(); // khoá → CanvasTexture dùng chung (tranh, chữ)
function canvasTex(w, h, draw, repeat = [1, 1]) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); t.anisotropy = 4;
  return t;
}
const sharedTex = (key, w, h, draw) => { if (!TEX.has(key)) TEX.set(key, canvasTex(w, h, draw)); return TEX.get(key); };
const COLOR_MAT = new Map();
const colorMat = (hex, extra = {}) => { const k = hex + JSON.stringify(extra); if (!COLOR_MAT.has(k)) COLOR_MAT.set(k, new THREE.MeshStandardMaterial({ color: hex, roughness: 0.7, ...extra })); return COLOR_MAT.get(k); };
// v5.1: mỗi tiệm một biến thể nội thất RIÊNG theo khoá phòng (không còn mọi tiệm cùng loại giống hệt nhau)
const seeded = (key) => { let h = 2166136261; for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619); } let a = h >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const pickOf = (rnd, arr) => arr[Math.floor(rnd() * arr.length) % arr.length];
function mats() {
  if (M) return M;
  const planks = (c) => canvasTex(256, 256, (g) => { g.fillStyle = c; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 8; i++) { g.fillStyle = `rgba(0,0,0,${0.06 + (i % 3) * 0.04})`; g.fillRect(0, i * 32, 256, 2); g.fillStyle = `rgba(255,255,255,${0.03 + (i % 2) * 0.03})`; g.fillRect(0, i * 32 + 6, 256, 10); } }, [3, 3]);
  const goods = (cols) => canvasTex(256, 256, (g) => { g.fillStyle = '#4a2c1a'; g.fillRect(0, 0, 256, 256); for (let r = 0; r < 4; r++) for (let x = 6; x < 250;) { const w = 14 + ((x * 7 + r * 5) % 18); g.fillStyle = cols[(x + r) % cols.length]; g.beginPath(); g.ellipse(x + w / 2, r * 64 + 36, w / 2 - 2, 22, 0, 0, Math.PI * 2); g.fill(); x += w; } g.fillStyle = '#2e1b12'; for (let r = 0; r <= 4; r++) g.fillRect(0, r * 64, 256, 7); });
  M = {
    floor: new THREE.MeshStandardMaterial({ map: planks('#7a5232'), roughness: 0.75 }),
    floorDark: new THREE.MeshStandardMaterial({ map: planks('#4e3322'), roughness: 0.7 }),
    stone: stoneMaterial({ seed: 44, rows: 7, repeat: [5, 5], base: '#7c766c', roughness: 0.88 }),
    wallTex: canvasTex(256, 256, (g) => {
      g.fillStyle = '#e8dcc0'; g.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(90,70,40,${Math.random() * 0.05})`; g.fillRect(Math.random() * 256, Math.random() * 256, 3, 3); }
      g.fillStyle = '#4a2c1a'; g.fillRect(0, 0, 22, 256); g.fillRect(0, 0, 256, 18); g.fillRect(0, 150, 256, 14);
      g.fillStyle = '#5e3a22'; g.fillRect(116, 164, 10, 92); g.fillRect(22, 205, 234, 6);
    }),
    wood: new THREE.MeshStandardMaterial({ color: '#5a3622', roughness: 0.7 }),
    dark: new THREE.MeshStandardMaterial({ color: '#2e1b12', roughness: 0.75 }),
    lacquer: new THREE.MeshStandardMaterial({ color: '#9c2318', roughness: 0.45 }),
    gold: new THREE.MeshStandardMaterial({ color: '#d4a63c', roughness: 0.32, metalness: 0.85 }),
    brass: new THREE.MeshStandardMaterial({ color: '#b08a3a', roughness: 0.35, metalness: 0.8 }),
    steel: new THREE.MeshStandardMaterial({ color: '#c7ccd2', roughness: 0.25, metalness: 0.9 }),
    cloth: new THREE.MeshStandardMaterial({ color: '#b3231a', roughness: 0.9 }),
    jar: new THREE.MeshStandardMaterial({ color: '#6a4a32', roughness: 0.6 }),
    jar2: new THREE.MeshStandardMaterial({ color: '#c9b892', roughness: 0.4 }),
    water: new THREE.MeshStandardMaterial({ color: '#2a4a5a', roughness: 0.1, metalness: 0.2 }),
    leaf: new THREE.MeshStandardMaterial({ color: '#3f7a3a', roughness: 0.8 }),
    bamboo: new THREE.MeshStandardMaterial({ color: '#7aa04a', roughness: 0.6 }),
    flower: new THREE.MeshStandardMaterial({ color: '#c58ad8', roughness: 0.7 }),
    crystal: new THREE.MeshStandardMaterial({ color: '#e8e0ff', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.75 }),
    cushion: new THREE.MeshStandardMaterial({ color: '#a3681f', roughness: 0.95 }),
    lattice: new THREE.MeshStandardMaterial({ color: '#f3e7c8', emissive: '#ffcf8a', emissiveIntensity: 0.25, roughness: 0.9 }),
    screen: new THREE.MeshStandardMaterial({ color: '#efe6d0', roughness: 0.9, side: THREE.DoubleSide }),
    redpaper: new THREE.MeshStandardMaterial({ color: '#c8341f', roughness: 0.8 }),
    goodsGom: new THREE.MeshStandardMaterial({ map: goods(['#c9b892', '#3e6a8a', '#f0ead8', '#7a8a6a']), roughness: 0.6 }),
    goodsWarm: new THREE.MeshStandardMaterial({ map: goods(['#7a2a20', '#c7a24a', '#6a4a32', '#a3681f']), roughness: 0.7 }),
    goodsGreen: new THREE.MeshStandardMaterial({ map: goods(['#3f7a3a', '#6a8a3a', '#a8c070', '#5a6a2a']), roughness: 0.8 }),
  };
  return M;
}
const LANTERN_MAT = new Map();
function lanternMat(hex) {
  if (!LANTERN_MAT.has(hex)) { const m = new THREE.MeshStandardMaterial({ color: hex, emissive: hex, emissiveIntensity: 0.7, roughness: 0.6 }); addGlow(m, { base: 0.9, night: 0.4, color: hex }); LANTERN_MAT.set(hex, m); }
  return LANTERN_MAT.get(hex);
}

// --- tranh / chữ (canvas dùng chung theo khoá)
function artTex(art) {
  return sharedTex(`art:${art}`, 256, 384, (g, w, h) => {
    g.fillStyle = '#efe6cf'; g.fillRect(0, 0, w, h);
    if (art === 'sonthuy') {
      for (let k = 0; k < 3; k++) { g.fillStyle = `rgba(40,50,60,${0.18 + k * 0.2})`; g.beginPath(); g.moveTo(0, h * (0.55 + k * 0.1)); for (let x = 0; x <= w; x += 16) g.lineTo(x, h * (0.5 + k * 0.12) - Math.abs(Math.sin(x * 0.03 + k * 2)) * (90 - k * 22)); g.lineTo(w, h); g.lineTo(0, h); g.fill(); }
      g.fillStyle = '#b3231a'; g.fillRect(w - 40, 24, 18, 18);
    } else {
      g.strokeStyle = '#2e2420'; g.lineWidth = 5; g.beginPath(); g.moveTo(30, h - 30); g.quadraticCurveTo(120, 220, 200, 60); g.stroke();
      g.lineWidth = 3; g.beginPath(); g.moveTo(110, 230); g.lineTo(60, 150); g.stroke();
      g.fillStyle = '#d0485a'; for (let k = 0; k < 14; k++) { g.beginPath(); g.arc(50 + ((k * 53) % 150), 70 + ((k * 37) % 230), 7, 0, Math.PI * 2); g.fill(); }
    }
    g.strokeStyle = '#6a4a32'; g.lineWidth = 10; g.strokeRect(0, 0, w, h);
  });
}
function textTex(key, text, { w = 512, h = 128, bg = '#1e120c', fg = '#e8c25a', border = '#d4a63c', vertical = false, size = 46 } = {}) {
  return sharedTex(`txt:${key}`, w, h, (c) => {
    c.fillStyle = bg; c.fillRect(0, 0, w, h);
    if (border) { c.strokeStyle = border; c.lineWidth = 8; c.strokeRect(6, 6, w - 12, h - 12); }
    c.fillStyle = fg; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `bold ${size}px serif`;
    if (vertical) { const words = text.split(' '); words.forEach((wd, k) => c.fillText(wd, w / 2, (h / (words.length + 1)) * (k + 1))); }
    else { let s = size; while (c.measureText(text).width > w - 40 && s > 18) { s -= 2; c.font = `bold ${s}px serif`; } c.fillText(text, w / 2, h / 2 + 2); }
  });
}

// ============================================================================
//  Bộ dựng một phòng: ctx gom mesh, va chạm, điểm tương tác, NPC, đèn
// ============================================================================
function makeCtx(scene, r) {
  const g = new THREE.Group(); g.name = `room:${r.key}`; g.position.set(r.origin.x, 0, r.origin.z); scene.add(g);
  const ctx = { r, g, own: [], solids: [], spots: [], npcs: [], lights: 0, W: r.w, D: r.d, H: r.h, hw: r.w / 2, hd: r.d / 2 };
  const track = (x) => { ctx.own.push(x); return x; };
  ctx.mesh = (geo, mat, x, y, z, ry = 0, parent = g) => { const o = new THREE.Mesh(track(geo), mat); o.position.set(x, y, z); o.rotation.y = ry; o.castShadow = true; o.receiveShadow = true; parent.add(o); return o; };
  ctx.box = (w, h, d, mat, x, y, z, solid = false, ry = 0, parent = g) => { const o = ctx.mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z, ry, parent); if (solid) ctx.solid(x, z, w / 2, d / 2, ry); return o; };
  ctx.cyl = (r1, r2, h, mat, x, y, z, solid = false, seg = 14, parent = g) => { const o = ctx.mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat, x, y, z, 0, parent); if (solid) ctx.solid(x, z, Math.max(r1, r2), Math.max(r1, r2), 0); return o; };
  ctx.solid = (x, z, hw, hd, ry = 0) => ctx.solids.push({ x: r.origin.x + x, z: r.origin.z + z, hw: hw + 0.12, hd: hd + 0.12, ry });
  ctx.spot = (s) => ctx.spots.push({ r: 1.3, ...s, x: r.origin.x + s.x, z: r.origin.z + s.z });
  ctx.light = (x, y, z, power = 1, color = '#ffa04a') => { if (ctx.lights >= 8) return; ctx.lights++; addLight(r.origin.x + x, y, r.origin.z + z, { color, power, room: r.key }); };
  ctx.model = (id, fit, x, z, ry = 0, y = 0) => placeModel(g, id, { fit, at: { x, y, z, ry }, hd: false }).catch(() => null);
  ctx.lamp = (x, y, z, power = 1, hex = '#c8341f') => {
    const m = mats();
    ctx.cyl(0.03, 0.03, ctx.H - y - 0.5, m.dark, x, (ctx.H + y + 0.5) / 2, z);
    const s = ctx.mesh(new THREE.SphereGeometry(0.26, 12, 8), lanternMat(hex), x, y, z); s.scale.y = 1.3;
    for (const dy of [0.36, -0.36]) ctx.cyl(0.12, 0.12, 0.06, m.gold, x, y + dy, z);
    ctx.light(x, y, z, power);
  };
  ctx.plane = (w, h, mat, x, y, z, ry = 0) => ctx.mesh(new THREE.PlaneGeometry(w, h), mat, x, y, z, ry);
  return ctx;
}

/** vỏ phòng: sàn, ba vách + vách trước mở cửa 2,6 m, trần + xà, song cửa sổ, cột góc, hoành phi */
function shell(ctx, { wall = '#c9b993', floor = 'wood', plaque = '', column = null } = {}) {
  const m = mats(), { W, D, H, hw, hd } = ctx;
  ctx.box(W + 1, 0.4, D + 1, floor === 'stone' ? m.stone : floor === 'dark' ? m.floorDark : m.floor, 0, -0.2, 0);
  const c = new THREE.Color(wall), lum = c.r * 0.3 + c.g * 0.59 + c.b * 0.11;
  let wm;
  if (lum < 0.4) wm = colorMat(wall, { roughness: 0.6 });
  else { const t = m.wallTex.clone(); t.needsUpdate = true; t.repeat.set(W / 2, H / 2.6); ctx.own.push(t); wm = new THREE.MeshStandardMaterial({ map: t, color: c.lerp(new THREE.Color('#ffffff'), 0.25), roughness: 0.95, envMapIntensity: 0.35 }); ctx.own.push(wm); }
  const T = 0.5;
  for (const [w, d, x, z] of [[W, T, 0, -hd], [T, D, -hw, 0], [T, D, hw, 0]]) { ctx.box(w, H, d, wm, x, H / 2, z); ctx.box(w + 0.04, 0.9, d + 0.04, m.dark, x, 0.45, z); }
  const gap = 2.6, side = (W - gap) / 2;
  for (const sx of [-1, 1]) { ctx.box(side, H, T, wm, sx * (gap / 2 + side / 2), H / 2, hd); ctx.box(side, 0.9, T + 0.04, m.dark, sx * (gap / 2 + side / 2), 0.45, hd); }
  ctx.box(gap, H - 3, T, wm, 0, 3 + (H - 3) / 2, hd);
  ctx.box(W, 0.3, D, m.dark, 0, H + 0.15, 0);
  for (let z = -hd + 2; z < hd; z += 2.6) ctx.box(W - 0.6, 0.35, 0.3, m.wood, 0, H - 0.3, z);
  for (const sx of [-1, 1]) for (let z = -hd + 3; z <= hd - 3; z += 4) ctx.box(0.08, 1.5, 1.8, m.lattice, sx * (hw - 0.27), Math.min(2.6, H - 1.6), z);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) ctx.cyl(0.18, 0.2, H, column || m.wood, sx * (hw - 0.6), H / 2, sz * (hd - 0.6), true);
  if (plaque) {
    const pw = Math.min(W - 3, 6);
    ctx.plane(pw, pw / 4, colorMat('#ffffff', { map: textTex(`pl:${plaque}`, plaque), roughness: 0.6 }), 0, H - 1.1, -hd + T / 2 + 0.03);
  }
  // câu đối hai bên cửa trong
  const cd = colorMat('#ffffff', { map: sharedTex('cd:dots', 64, 384, (q) => { q.fillStyle = '#9c2318'; q.fillRect(0, 0, 64, 384); q.fillStyle = '#e8c25a'; for (let k = 0; k < 6; k++) { q.beginPath(); q.arc(32, 32 + k * 64, 9, 0, Math.PI * 2); q.fill(); } }), roughness: 0.7 });
  for (const sx of [-1, 1]) ctx.plane(0.45, 2.6, cd, sx * 1.9, 1.9, hd - T / 2 - 0.03, Math.PI);
  ctx.light(0, H - 1, hd - 3, 1.2, '#ffe0b0');
}

// ============================================================================
//  Dựng một món (items.js) tại chỗ: m = { i, x, z, r }, y = cao nền đặt (bục bày hàng)
// ============================================================================
function buildItem(ctx, m, { y = 0, wallInset = null, couplet = 0 } = {}) {
  const it = ITEM[m.i]; if (!it) return;
  const mt = mats(), [fw] = it.foot;
  const holder = new THREE.Group(); ctx.g.add(holder);
  if (it.place === 'wall') {
    // bám vách: r 0 = vách sau, 1 = vách phải, 3 = vách trái; mặt quay vào phòng
    const inset = wallInset ?? 0.27, yc = it.proc === 'plaque' ? ctx.H - 1.5 : it.proc === 'sword' ? 2.1 : 2.0;
    if (m.r === 1) { holder.position.set(ctx.hw - inset, yc, m.z); holder.rotation.y = -Q; }
    else if (m.r === 3) { holder.position.set(-ctx.hw + inset, yc, m.z); holder.rotation.y = Q; }
    else { holder.position.set(m.x, yc, -ctx.hd + inset); }
  } else { holder.position.set(m.x, y, m.z); holder.rotation.y = (m.r || 0) * Q; }
  const B = (w, h, d, mat, x, yy, z) => ctx.box(w, h, d, mat, x, yy, z, false, 0, holder);
  const C = (r1, r2, h, mat, x, yy, z, seg = 14) => ctx.cyl(r1, r2, h, mat, x, yy, z, false, seg, holder);
  if (it.model) {
    placeModel(holder, it.model, { fit: { width: fw }, at: { x: 0, y: 0, z: 0, ry: 0 }, hd: false }).catch(() => null);
  } else switch (it.proc) {
    case 'jar': { const r = fw / 2 * 0.85; C(r * 0.8, r, it.h * 0.85, mt.jar, 0, it.h * 0.425, 0, 18); C(r * 0.82, r * 0.82, 0.08, mt.dark, 0, it.h * 0.86, 0, 18); C(r * 0.72, r * 0.72, 0.02, mt.water, 0, it.h * 0.88, 0, 18); break; }
    case 'lantern_stand': {
      C(0.25, 0.3, 0.08, mt.dark, 0, 0.04, 0); C(0.035, 0.035, it.h - 0.4, mt.dark, 0, (it.h - 0.4) / 2, 0);
      const l = ctx.mesh(new THREE.SphereGeometry(0.24, 12, 8), lanternMat(it.color || '#c8341f'), 0, it.h - 0.25, 0, 0, holder); l.scale.y = 1.3;
      for (const dy of [0.33, -0.33]) C(0.1, 0.1, 0.05, mt.gold, 0, it.h - 0.25 + dy, 0);
      const p = holder.position; ctx.light(p.x, it.h - 0.2, p.z, 0.8, it.color || '#ffa04a'); break;
    }
    case 'painting': { B(fw + 0.08, it.h + 0.08, 0.04, mt.dark, 0, 0, -0.02); ctx.mesh(new THREE.PlaneGeometry(fw, it.h), colorMat('#ffffff', { map: artTex(it.art), roughness: 0.85 }), 0, 0, 0.005, 0, holder); break; }
    case 'plaque': ctx.mesh(new THREE.PlaneGeometry(fw, fw / 4), colorMat('#ffffff', { map: textTex(`pl:${it.text}`, it.text), roughness: 0.6 }), 0, 0, 0.01, 0, holder); B(fw + 0.1, fw / 4 + 0.1, 0.05, mt.dark, 0, 0, -0.03); break;
    case 'couplet': {
      const pair = COUPLETS[couplet % COUPLETS.length];
      pair.forEach((line, k) => { const sx = k ? -1 : 1; ctx.mesh(new THREE.PlaneGeometry(0.38, it.h), colorMat('#ffffff', { map: textTex(`cd:${line}`, line, { w: 96, h: 512, bg: '#9c2318', fg: '#f3d36a', border: '#d4a63c', vertical: true, size: 40 }), roughness: 0.7 }), sx * fw / 2, 0, 0.01, 0, holder); });
      break;
    }
    case 'calli': { const p = ctx.mesh(new THREE.PlaneGeometry(fw, fw), colorMat('#ffffff', { map: textTex(`ca:${it.text}`, it.text, { w: 256, h: 256, bg: '#c8341f', fg: '#1e120c', border: null, size: 70 }), roughness: 0.7 }), 0, 0, 0.01, 0, holder); p.rotation.z = Math.PI / 4; break; }
    case 'bamboo': { C(0.22, 0.18, 0.35, mt.jar2, 0, 0.175, 0); for (let k = 0; k < 5; k++) { const a = k * 1.3, rr = 0.08; const s = C(0.025, 0.03, it.h * (0.75 + (k % 3) * 0.1), mt.bamboo, Math.cos(a) * rr, 0.35 + it.h * 0.38, Math.sin(a) * rr, 6); s.rotation.z = Math.cos(a) * 0.08; } for (let k = 0; k < 8; k++) { const lf = ctx.mesh(new THREE.SphereGeometry(0.12, 6, 4), mt.leaf, Math.cos(k) * 0.16, it.h * (0.6 + (k % 4) * 0.1), Math.sin(k) * 0.16, 0, holder); lf.scale.set(1.4, 0.25, 0.5); } break; }
    case 'orchid': { C(0.16, 0.13, 0.22, mt.jar2, 0, 0.11, 0); for (let k = 0; k < 6; k++) { const lf = ctx.mesh(new THREE.SphereGeometry(0.14, 6, 4), mt.leaf, Math.cos(k) * 0.1, 0.3, Math.sin(k) * 0.1, k, holder); lf.scale.set(1.5, 0.15, 0.35); } for (let k = 0; k < 5; k++) ctx.mesh(new THREE.SphereGeometry(0.045, 6, 4), mt.flower, -0.1 + k * 0.05, it.h - 0.05 - (k % 2) * 0.06, 0.05, 0, holder); C(0.008, 0.008, it.h - 0.3, mt.leaf, 0, 0.3 + (it.h - 0.3) / 2, 0.03, 4); break; }
    case 'chime': { C(0.15, 0.18, 0.05, mt.dark, 0, 0.025, 0); C(0.02, 0.02, it.h, mt.dark, 0, it.h / 2, 0, 6); B(0.5, 0.03, 0.03, mt.dark, 0.2, it.h, 0); for (let k = 0; k < 5; k++) C(0.018, 0.018, 0.25 + k * 0.05, mt.brass, 0.05 + k * 0.08, it.h - 0.25 - k * 0.025, 0, 6); break; }
    case 'crystal': { C(0.18, 0.22, 0.25, mt.wood, 0, 0.125, 0); ctx.mesh(new THREE.SphereGeometry(0.22, 18, 12), mt.crystal, 0, 0.47, 0, 0, holder); break; }
    case 'sword': { B(fw, 0.05, 0.02, mt.steel, 0.1, 0, 0.05); B(0.08, 0.28, 0.05, mt.gold, -fw / 2 + 0.28, 0, 0.05); B(0.3, 0.05, 0.05, mt.cloth, -fw / 2 + 0.12, 0, 0.05); for (const sx of [-0.4, 0.4]) B(0.06, 0.12, 0.08, mt.dark, sx, -0.07, 0); break; }
    default: B(fw, it.h, it.foot[1], mt.wood, 0, it.h / 2, 0);
  }
  return holder;
}

// ============================================================================
//  CỬA HÀNG
// ============================================================================
const OWNER_LINES = {
  moc: ['Gỗ trắc phơi đủ ba năm mới đóng, không cong không nứt.', 'Khách mua nhà mới à? Giường lục trụ đang có sẵn.', 'Đồ gỗ hành Mộc, hợp người mệnh thiếu Mộc lắm.'],
  gom: ['Men lam này nung lửa chín ngày đêm.', 'Bình men ngọc đặt phương Bắc thì tụ tài.', 'Gõ thử xem, tiếng ngân trong như chuông.'],
  den: ['Đèn lồng đỏ treo phương Nam, nhà sáng mà ấm.', 'Tối nay hội hoa đăng, khách mua đèn chưa?', 'Cung đăng lục giác hôm nay mới về một chiếc.'],
  thuhoa: ['Tranh sơn thủy treo vách sau thì có chỗ tựa.', 'Câu đối khắc gỗ, khách chọn câu nào ta khắc câu ấy.', 'Một chữ Phúc viết tay, treo đầu năm là đẹp.'],
  hoavien: ['Tùng bonsai này đã sáu mươi năm tuổi.', 'Trúc đặt phương Đông, mộc khí sinh sôi.', 'Cá nhớ cho ăn mỗi ngày, đừng để đói.'],
  phongthuy: ['Nhà khách quay hướng nào? Để ta xem giúp.', 'Tỳ Hưu quay đầu ra cửa mới hút tài.', 'La bàn này chín tầng, đủ hai mươi tư sơn.'],
  huong: ['Trầm hương Khánh Hòa, thắp lên thơm cả xóm.', 'Kỳ Nam quý lắm, mỗi ngày chỉ có vài nén.', 'Bàn thờ tựa vách sau, nhìn ra cửa — tọa sơn hướng thủy.'],
  tratrang: ['Long Tỉnh đầu xuân, nước xanh cốm.', 'Phổ Nhĩ để càng lâu càng quý.', 'Khách nếm thử một chén rồi hẵng mua.'],
  duoc: ['Tốc Hành Tán uống vào chân nhẹ như bay.', 'Thanh Tâm Đan giúp đầu óc sáng suốt mà giải án.', 'Thức ăn cá cũng có, khách cần bao nhiêu?'],
  loren: ['Kiếm này tôi luyện bảy lần, chém sắt như bùn.', 'Giá binh khí bày phòng khách, khí Kim trấn trạch.', 'Lửa lò không bao giờ tắt.'],
  tuu: ['Khách quan dùng gì? Rượu hoa đào vừa khui!', 'Ngồi xuống uống chén, nghe ta kể chuyện lạ trong thành.', 'Tửu lâu ba đời, không pha nước bao giờ.'],
  tralau: ['Mời khách ngồi, ấm trà mới pha.', 'Chiều nay tiên sinh kể chuyện Tam Quốc.', 'Uống trà là uống cái tĩnh.'],
  dichtram: ['Ngựa khỏe sẵn sàng, khách đi cổng nào?', 'Đường quan đạo bằng phẳng, nửa khắc là tới.', 'Trời đẹp thế này cưỡi ngựa thích lắm.'],
  namon: ['Nhà rao bán trong thành đều có giấy tờ ở đây.', 'Khách muốn tìm nhà hợp mệnh? Để bản quan tra sổ.', 'Mua bán nhà phải qua Nha Môn mới hợp lệ.'],
  may: ['Vải lụa mới về, khách thử áo xem.', 'Áo mới đón xuân, may đo trong ngày.'],
};

function buildShop(ctx, r) {
  const s = r.shop, T = SHOP_TYPES[r.type] || SHOP_TYPES.moc, mt = mats(), { W, hw, hd } = ctx;
  const rnd = seeded(`int|${r.key}`);
  // vỏ: màu tường lệch sắc / sáng theo tiệm, sàn: 60 % đúng loại, còn lại gỗ / gỗ sẫm / đá
  const wc = new THREE.Color(T.wall); wc.offsetHSL((rnd() - 0.5) * 0.08, (rnd() - 0.5) * 0.2, (rnd() - 0.5) * 0.4);
  shell(ctx, { wall: `#${wc.getHexString()}`, floor: rnd() < 0.5 ? T.floor : pickOf(rnd, ['wood', 'dark', 'stone']), plaque: s.name.toUpperCase(), column: pickOf(rnd, [null, mt.lacquer, mt.dark]) });
  // đồ treo vách sau (trên kệ): tranh / thư pháp / không — mỗi tiệm một kiểu
  const hang = Math.floor(rnd() * 3), wallArt = Object.keys(ITEM).filter((k) => ITEM[k].place === 'wall' && ['painting', 'calli', 'plaque'].includes(ITEM[k].proc));
  if (hang && wallArt.length) for (const sx of hang === 2 ? [-1, 1] : [0]) buildItem(ctx, { i: pickOf(rnd, wallArt), x: sx * (W / 4), z: 0, r: 0 });
  const items = itemsOfShop(r.type);
  const uses = items.filter((it) => it.kind === 'use');
  const decor = items.filter((it) => it.kind === 'decor');
  for (let i = decor.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [decor[i], decor[j]] = [decor[j], decor[i]]; } // thứ tự bày khác nhau
  // quầy: rộng / màu khác nhau; kệ sau: liền một khối · hai kệ + tranh giữa · ba tủ đứng
  const cw = Math.min((uses.length ? 6.2 : 4.6) * (0.85 + 0.3 * rnd()), W - 5), cz = -hd + 2.5 + rnd() * 0.5;
  const ctop = pickOf(rnd, [mt.dark, mt.lacquer, mt.wood]);
  ctx.box(cw, 1.0, 0.8, pickOf(rnd, [mt.wood, mt.dark]), 0, 0.5, cz, true); ctx.box(cw + 0.2, 0.08, 1.0, ctop, 0, 1.04, cz);
  const goodsMat = ['gom', 'tratrang', 'huong'].includes(r.type) ? mt.goodsGom : ['hoavien', 'duoc'].includes(r.type) ? mt.goodsGreen : mt.goodsWarm;
  const shelf = Math.floor(rnd() * 3), sh = 2.2 + rnd() * 0.8;
  if (shelf === 0) ctx.box(W - 4.4, sh, 0.55, goodsMat, 0, sh / 2, -hd + 0.6, true);
  else if (shelf === 1) { const w2 = (W - 6.6) / 2; for (const sx of [-1, 1]) ctx.box(w2, sh, 0.55, goodsMat, sx * (w2 / 2 + 1.1), sh / 2, -hd + 0.6, true); buildItem(ctx, { i: pickOf(rnd, Object.keys(ITEM).filter((k) => ITEM[k].proc === 'painting')) || null, x: 0, z: 0, r: 0 }); }
  else { const n = 3, w3 = Math.min(1.6, (W - 6) / 3); for (let k = 0; k < n; k++) ctx.box(w3, sh + 0.3, 0.6, goodsMat, (k - 1) * (w3 + 1.2), (sh + 0.3) / 2, -hd + 0.62, true); }
  const ownerLines = OWNER_LINES[r.type] || OWNER_LINES.moc;
  ctx.npcs.push({ id: `own_${r.key}`, name: s.owner, role: s.name, look: T.look, gua: s.g, wx: guaById(s.g).wx, lines: ownerLines, x: r.origin.x, z: r.origin.z + cz - 1.0, path: null, face: 0 });
  const svc = T.svc || [];
  // v4: chủ tiệm LUÔN mở bảng tiệm (gọi món, trò chuyện, mua bán) — dịch vụ là các điểm riêng hai bên quầy (trước đây tiệm
  // không hàng bị dịch vụ đầu chiếm chỗ chủ tiệm → không gọi món / không chat được, và dịch vụ hiện hai lần)
  ctx.spot({ id: 'owner', kind: 'owner', name: s.owner, verb: items.length ? `Hỏi ${s.owner.split(' ')[0].toLowerCase()} mua hàng` : `Gặp ${s.owner.split(' ')[0].toLowerCase()}`, x: 0, z: cz + 1.0, r: 1.1 });
  // hàng tiêu dùng bày trên quầy (hộp trà, bó hương, lọ thuốc)
  const slots = []; for (let k = 0; k < uses.length; k++) { const side = k % 2 ? 1 : -1, n = Math.floor(k / 2); slots.push(side * (1.0 + n * 0.9)); }
  uses.forEach((it, k) => {
    const x = slots[k], col = it.color || (it.use === 'incense' ? ['#8a6a3a', '#5a3a22', '#2e1b12'][(it.tier || 1) - 1] : it.use === 'fishfood' ? '#c7a24a' : '#7a2a20');
    if (it.use === 'tea') ctx.cyl(0.13, 0.13, 0.32, colorMat(col), x, 1.24, cz);
    else if (it.use === 'incense') { for (let q = 0; q < 5; q++) ctx.cyl(0.012, 0.012, 0.45, colorMat(col), x - 0.08 + q * 0.04, 1.3, cz); ctx.box(0.22, 0.06, 0.08, mt.cloth, x, 1.2, cz); }
    else { ctx.cyl(0.09, 0.11, 0.24, mt.jar2, x, 1.2, cz); ctx.cyl(0.06, 0.06, 0.05, colorMat(col), x, 1.34, cz); }
    ctx.spot({ id: `w:${it.id}`, kind: 'ware', item: it.id, name: it.name, verb: `Xem ${it.name}`, x, z: cz + 0.95, r: 0.75 });
  });
  // đồ bài trí: bày dọc vách trái rồi vách phải (quay mặt vào giữa phòng); đồ nhỏ đặt trên bục
  const hiring = !!JOB_OF_SHOP[r.type] || r.type === MINE_SHOP; // bảng Chiêu công / xe goòng sát cửa bên trái → chừa chỗ
  const cur = { L: -hd + 3.7 + rnd() * 0.6, R: -hd + 3.7 + rnd() * 0.6 }, zMax = ctx.hd - (hiring ? 4.6 : 3.0);
  if (rnd() < 0.5) cur.L += 0.01; else cur.R += 0.01; // bên bắt đầu bày khác nhau
  let island = 0;
  for (const it of decor) {
    const [fw, fd] = it.foot, wallItem = it.place === 'wall';
    const along = fw + 0.55 + rnd() * 0.5;
    let side = cur.L <= cur.R ? 'L' : 'R';
    if (cur[side] + along > zMax) side = side === 'L' ? 'R' : 'L';
    if (cur[side] + along > zMax) {
      // hết vách: đảo giữa phòng (hai bên lối giữa, quay ra cửa)
      const x = (island % 2 ? 1 : -1) * 2.6, z = -hd + 5 + Math.floor(island / 2) * 2.6; island++;
      if (z > zMax || wallItem) continue;
      const small = fw < 0.9 && it.h < 1.3, y = small ? 0.5 : 0;
      if (small) ctx.box(fw + 0.3, 0.5, fd + 0.3, mt.dark, x, 0.25, z, true); else ctx.solid(x, z, fw / 2, fd / 2);
      buildItem(ctx, { i: it.id, x, z, r: 0 }, { y });
      ctx.spot({ id: `w:${it.id}`, kind: 'ware', item: it.id, name: it.name, verb: `Xem ${it.name}`, x, z: z + fd / 2 + 0.8 });
      continue;
    }
    const zc = cur[side] + along / 2; cur[side] += along;
    const sx = side === 'L' ? -1 : 1;
    if (wallItem) {
      buildItem(ctx, { i: it.id, x: 0, z: zc, r: sx < 0 ? 3 : 1 });
      ctx.spot({ id: `w:${it.id}`, kind: 'ware', item: it.id, name: it.name, verb: `Xem ${it.name}`, x: sx * (hw - 1.4), z: zc });
      continue;
    }
    const x = sx * (hw - 0.6 - fd / 2), small = fw < 0.9 && it.h < 1.3, y = small ? 0.5 : 0;
    if (small) ctx.box(fd + 0.3, 0.5, fw + 0.3, mt.dark, x, 0.25, zc, true); else ctx.solid(x, zc, fd / 2, fw / 2);
    buildItem(ctx, { i: it.id, x, z: zc, r: sx < 0 ? 1 : 3 }, { y });
    ctx.spot({ id: `w:${it.id}`, kind: 'ware', item: it.id, name: it.name, verb: `Xem ${it.name}`, x: x - sx * (fd / 2 + 0.85), z: zc });
  }
  // góc dịch vụ riêng theo loại
  const extra = SHOP_EXTRA[r.type]; if (extra) extra(ctx, r);
  if (hiring) jobCorner(ctx, r);
  const zj = { tuu: 'hamruou', dichtram: 'thungan', namon: 'nhadich' }[r.type];
  if (zj) { const mt = mats(), { hw, hd } = ctx, z = hd - 2.9; ctx.box(0.12, 1.5, 2.1, mt.dark, hw - 0.3, 1.75, z); for (let k = 0; k < 3; k++) ctx.box(0.02, 0.5, 0.42, mt.redpaper, hw - 0.38, 2.1, z - 0.62 + k * 0.62); ctx.spot({ id: `zj:${zj}`, kind: 'job', zoneJob: zj, name: WORK[zj].name, verb: `Nhận việc · ${WORK[zj].name}`, x: hw - 1.6, z, r: 1.2 }); }
  svc.forEach((id, n) => { if (!ctx.spots.some((q) => q.svc === id)) ctx.spot({ id: `s:${id}`, kind: 'svc', svc: id, name: svcInfo(id).name, verb: svcInfo(id).verb, x: n % 2 ? 2.4 : -2.4, z: cz + 1.0 - Math.floor(n / 2) * 1.8, r: 1.1 }); }); // nhiều dịch vụ: xen hai bên quầy
  // đèn: 2–4 ngọn, vị trí / cao / màu khác nhau
  const nl = 2 + Math.floor(rnd() * 3), lc = pickOf(rnd, ['#c8341f', '#e2a531', '#b8452c', '#d8862e']);
  for (let k = 0; k < nl; k++) ctx.lamp(-W / 2 + (W * (k + 0.5)) / nl + (rnd() - 0.5), ctx.H - 1.2 - rnd() * 0.6, (rnd() - 0.5) * (ctx.D * 0.4), 1, k % 2 && rnd() < 0.5 ? '#e2a531' : lc);
  shopExtras(ctx, rnd, hiring);
}
/** đồ thêm riêng từng tiệm (thảm, chậu cây, chum, thùng gỗ, ghế đẩu, rèm) ở các góc trống cạnh cửa + giữa sàn */
function shopExtras(ctx, rnd, hiring) {
  const mt = mats(), { hw, hd } = ctx;
  if (rnd() < 0.7) { const rc = pickOf(rnd, ['#7a2a20', '#3e5a6a', '#6a5a2a', '#5a2a4a', '#2e4a3a']); const rug = ctx.plane(2.2 + rnd() * 1.6, 1.6 + rnd() * 1.4, colorMat(rc, { roughness: 1 }), (rnd() - 0.5) * 1.2, 0.012, 0.8 + (rnd() - 0.5) * 1.5); rug.rotation.x = -Math.PI / 2; }
  const corners = [[hw - 1.2, hd - 1.3], ...(hiring ? [] : [[-hw + 1.2, hd - 1.3]])];
  for (const [x, z] of corners) {
    const k = Math.floor(rnd() * 5);
    if (k === 0) { ctx.cyl(0.32, 0.26, 0.5, mt.jar2, x, 0.25, z, true); const c = ctx.mesh(new THREE.DodecahedronGeometry(0.55, 0), mt.leaf, x, 1.0 + rnd() * 0.3, z); c.scale.set(1, 1.2 + rnd() * 0.5, 1); }
    else if (k === 1) for (let q = 0; q < 2 + Math.floor(rnd() * 2); q++) ctx.cyl(0.26 + rnd() * 0.1, 0.22, 0.6 + rnd() * 0.3, mt.jar, x + (q % 2 ? 0.45 : -0.2), 0.35, z - Math.floor(q / 2) * 0.55, true, 12);
    else if (k === 2) { for (let q = 0; q < 2 + Math.floor(rnd() * 2); q++) ctx.box(0.7, 0.55, 0.6, mt.wood, x + (rnd() - 0.5) * 0.3, 0.28 + q * 0.56, z, q === 0, rnd() * 0.4); }
    else if (k === 3) { ctx.box(0.5, 0.45, 0.5, mt.dark, x, 0.23, z, true); ctx.box(0.5, 0.45, 0.5, mt.dark, x - 0.7, 0.23, z - 0.2, true); }
    else { ctx.cyl(0.18, 0.15, 0.35, mt.jar2, x, 0.18, z, true); for (let q = 0; q < 5; q++) { const st = ctx.cyl(0.025, 0.03, 1.2 + rnd() * 0.6, mt.bamboo, x + Math.cos(q * 1.3) * 0.07, 0.95, z + Math.sin(q * 1.3) * 0.07, false, 6); st.rotation.z = (rnd() - 0.5) * 0.15; } }
  }
}
// việc làm (P2 — work.js): bảng «Chiêu công» bằng gỗ dán giấy đỏ trên vách trái sát cửa; Lò Rèn có xe goòng xuống mỏ dân sự
function jobCorner(ctx, r) {
  const mt = mats(), { hw, hd } = ctx, z = hd - 2.9, job = JOB_OF_SHOP[r.type];
  if (job) {
    ctx.box(0.12, 1.5, 2.1, mt.dark, -hw + 0.3, 1.75, z);
    for (let k = 0; k < 6; k++) ctx.box(0.02, 0.5, 0.42, mt.redpaper, -hw + 0.38, 2.1 - Math.floor(k / 3) * 0.66, z - 0.62 + (k % 3) * 0.62);
    ctx.box(0.08, 0.3, 1.6, mt.wood, -hw + 0.34, 2.68, z);
    ctx.spot({ id: 'job', kind: 'job', job, name: 'Bảng Chiêu công', verb: `Chiêu công · ${WORK[job].name}`, x: -hw + 1.6, z, r: 1.2 });
  }
  if (r.type === MINE_SHOP) {
    const sx = job ? 2 * hw - 4.6 : 0; // Lò Rèn tuyển thợ rèn (P7) → xe goòng dời sang vách phải
    // xe goòng trên đoạn ray ngắn + biển chỉ đường
    for (let q = 0; q < 4; q++) ctx.box(1.6, 0.08, 0.2, mt.dark, -hw + 1.6 + sx, 0.04, z - 1.2 + q * 0.8);
    ctx.box(1.3, 0.8, 1.7, mt.wood, -hw + 1.6 + sx, 0.6, z, true);
    ctx.box(0.06, 1.6, 0.06, mt.dark, -hw + 2.8 + sx, 0.8, z + 1.2); ctx.box(0.05, 0.4, 1.0, mt.redpaper, -hw + 2.8 + sx, 1.5, z + 1.2);
    ctx.spot({ id: 'cart', kind: 'job', mine: true, name: 'Xe goòng Khoáng Sơn', verb: 'Xuống mỏ dân sự làm thợ mỏ', x: -hw + 2.9 + sx, z: z - 0.6, r: 1.2 });
  }
}
const SHOP_EXTRA = {
  tuu(ctx) {
    const mt = mats(), { hw, hd } = ctx;
    const rnd = seeded(`tuu|${ctx.r.key}`), nj = 3 + Math.floor(rnd() * 5);
    for (let i = 0; i < nj; i++) ctx.cyl(0.3 + rnd() * 0.12, 0.26, 0.6 + rnd() * 0.35, mt.jar, -hw + 1.6 + i * 1.0, 0.4, -hd + 1.5, true, 12);
    // bàn: vuông 4 · tròn 6 · phản dài 3 — mỗi tửu lâu một kiểu, lệch nhẹ
    const style = Math.floor(rnd() * 3);
    const tables = style === 1 ? [[-hw + 3.2, 0], [0, 1.2], [hw - 3.2, 0], [-hw + 3.2, 3.6], [0, 4.6], [hw - 3.2, 3.6]] : style === 2 ? [[-hw + 3.4, 0.6], [hw - 3.4, 0.6], [-hw + 3.4, 4]] : [[-hw + 3.5, 0.5], [hw - 3.5, 0.5], [-hw + 3.5, 4], [hw - 3.5, 4]];
    tables.forEach(([tx0, tz0], k) => {
      const tx = tx0 + (rnd() - 0.5) * 0.5, tz = tz0 + (rnd() - 0.5) * 0.5;
      if (style === 1) { ctx.cyl(0.65, 0.65, 0.08, mt.wood, tx, 0.78, tz, true, 18); ctx.cyl(0.08, 0.12, 0.74, mt.dark, tx, 0.37, tz, false, 8); for (let q = 0; q < 4; q++) ctx.cyl(0.2, 0.2, 0.45, mt.dark, tx + Math.cos(q * 1.57 + 0.4) * 1.0, 0.22, tz + Math.sin(q * 1.57 + 0.4) * 1.0, true, 10); }
      else if (style === 2) { ctx.box(2.6, 0.45, 1.2, mt.dark, tx, 0.22, tz, true, rnd() * 0.2); ctx.box(1.2, 0.3, 0.7, mt.wood, tx, 0.6, tz); for (const ax of [-1, 1]) ctx.cyl(0.36, 0.4, 0.12, mt.cushion, tx + ax * 0.7, 0.5, tz + 0.3, false, 14); }
      else { ctx.box(1.3, 0.8, 1.3, mt.wood, tx, 0.4, tz, true); for (const [ax, az] of [[1, 0], [-1, 0], [0, -1]]) ctx.box(0.45, 0.45, 0.45, mt.dark, tx + ax * 1.05, 0.22, tz + az * 1.05, true); }
      ctx.cyl(0.08, 0.07, 0.22, mt.jar2, tx, style === 2 ? 0.86 : 0.92, tz);
      if (k === 0) ctx.spot({ id: 's:tindon', kind: 'svc', svc: 'tindon', name: SVC.tindon.name, verb: SVC.tindon.verb, x: tx, z: tz + 1.4 });
    });
    ctx.npcs.push({ id: `tn_${ctx.r.key}`, name: 'Tiểu Nhị', role: 'Tiểu nhị', look: 'npc_villager', gua: ctx.r.shop.g, wx: '水', lines: ['Có ngay, có ngay!', 'Lầu trên còn bàn sát cửa sổ.', 'Khách quan muốn nghe chuyện thì hỏi chưởng quầy.'], x: ctx.r.origin.x + hw - 2, z: ctx.r.origin.z + 2.2, path: null, face: -Q });
  },
  tralau(ctx) {
    const mt = mats(), { hw, hd } = ctx;
    ctx.box(4, 0.4, 2, mt.wood, hw - 3.2, 0.2, -hd + 1.6, true); ctx.box(3.6, 2.2, 0.12, mt.screen, hw - 3.2, 1.5, -hd + 0.75);
    ctx.npcs.push({ id: `tt_${ctx.r.key}`, name: 'Tiên Sinh Kể Chuyện', role: 'Thuyết thư', look: 'master', gua: ctx.r.shop.g, wx: '木', lines: ['Lại nói chuyện năm ấy…', 'Muốn biết hậu sự thế nào, xin nghe hồi sau phân giải.'], x: ctx.r.origin.x + hw - 3.2, z: ctx.r.origin.z - hd + 1.6, path: null, face: 0 });
    ctx.spot({ id: 's:thuyetthu', kind: 'svc', svc: 'thuyetthu', name: SVC.thuyetthu.name, verb: SVC.thuyetthu.verb, x: hw - 3.2, z: -hd + 3.4 });
    const rnd = seeded(`tra|${ctx.r.key}`), cand = [[-hw + 3, 0], [-hw + 3, 3.5], [hw - 3.2, 2.5], [0, 4.6], [-hw + 3, 6.2], [hw - 3.2, 5.6]].filter(([, z]) => z < hd - 2.5);
    cand.slice(0, 3 + Math.floor(rnd() * Math.max(1, cand.length - 2))).forEach(([tx0, tz0], k) => {
      const tx = tx0 + (rnd() - 0.5) * 0.6, tz = tz0 + (rnd() - 0.5) * 0.6;
      ctx.box(1.2 + rnd() * 0.5, 0.4, 0.9 + rnd() * 0.3, rnd() < 0.5 ? mt.wood : mt.dark, tx, 0.2, tz, true);
      for (const ax of [-1, 1]) ctx.cyl(0.38, 0.42, 0.14, mt.cushion, tx + ax * 1.15, 0.07, tz, false, 16);
      ctx.cyl(0.07, 0.06, 0.12, mt.jar2, tx, 0.46, tz);
      if (k === 0) ctx.spot({ id: 's:uongtra', kind: 'svc', svc: 'uongtra', name: SVC.uongtra.name, verb: SVC.uongtra.verb, x: tx + 1.6, z: tz });
    });
  },
  dichtram(ctx) {
    const mt = mats(), { hw, hd } = ctx;
    ctx.plane(4.2, 2.4, colorMat('#ffffff', { map: mapTex(), roughness: 0.8 }), -hw + 0.3, 2.2, -1, Q);
    for (let k = 0; k < 4; k++) ctx.box(0.5, 0.5, 0.8, k % 2 ? mt.jar : mt.cloth, hw - 1.2, 0.25 + Math.floor(k / 2) * 0.5, -hd + 2 + (k % 2) * 0.9, k < 2);
    ctx.box(1.6, 1.1, 0.25, mt.wood, hw - 1.4, 0.55, 2.5, true);
    for (const z of [1.8, 3.2]) ctx.cyl(0.06, 0.06, 1.2, mt.dark, hw - 0.8, 0.6, z, true, 6);
  },
  namon(ctx) {
    const mt = mats(), { hw, hd } = ctx;
    const board = ctx.box(5, 2.6, 0.12, mt.dark, -hw + 0.4, 2.2, 0, false, Q);
    void board;
    for (let k = 0; k < 10; k++) ctx.box(0.6, 0.8, 0.02, mt.redpaper, -hw + 0.48, 2.7 - Math.floor(k / 5) * 1.0, -1.9 + (k % 5) * 0.95, false, Q);
    ctx.spot({ id: 's:diaoc2', kind: 'svc', svc: 'diaoc', name: 'Bảng nhà rao bán', verb: SVC.diaoc.verb, x: -hw + 1.8, z: 0 });
    for (const sx of [-1, 1]) ctx.model('bq_lion', { height: 1.2 }, sx * 3.4, -hd + 2.6);
    for (const sx of [-1, 1]) ctx.solid(sx * 3.4, -hd + 2.6, 0.5, 0.6);
  },
  phongthuy(ctx) {
    const { hw } = ctx;
    ctx.model('luopan_stand', { height: 1.3 }, -hw + 2.6, 1.5); ctx.solid(-hw + 2.6, 1.5, 0.6, 0.6);
    ctx.spot({ id: 's:khaosat', kind: 'svc', svc: 'khaosat', name: SVC.khaosat.name, verb: SVC.khaosat.verb, x: -hw + 2.6, z: 2.9 });
  },
  may(ctx) {
    const mt = mats(), { hw, hd } = ctx;
    for (let k = 0; k < 5; k++) { const c = ['#b3231a', '#3f6a7a', '#c7a24a', '#5a6a2a', '#efe6d0'][k]; ctx.box(0.7, 1.5, 0.12, colorMat(c, { roughness: 0.95 }), -hw + 1.1, 1.3, -hd + 4 + k * 1.1, false, Q); }
    ctx.box(0.1, 0.1, 6, mt.dark, -hw + 1.1, 2.1, -hd + 6.2);
    ctx.spot({ id: 's:may', kind: 'svc', svc: 'may', name: SVC.may.name, verb: SVC.may.verb, x: -hw + 2.4, z: -hd + 6 });
  },
};
function mapTex() {
  return sharedTex('map:bagua', 512, 300, (g, w, h) => {
    g.fillStyle = '#e8dcb8'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#6a4a32'; g.lineWidth = 4; const cx = w / 2, cy = h / 2;
    for (const R of [40, 90, 130]) { g.beginPath(); for (let k = 0; k <= 8; k++) { const a = (k / 8) * Math.PI * 2 + Math.PI / 8; g[k ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * R, cy + Math.sin(a) * R * 0.95); } g.stroke(); }
    g.fillStyle = '#b3231a'; for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; g.beginPath(); g.arc(cx + Math.cos(a) * 130, cy + Math.sin(a) * 124, 7, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = '#2e1b12'; g.font = 'bold 22px serif'; g.textAlign = 'center'; g.fillText('BÁT QUÁI THÀNH', cx, 26);
  });
}

// ============================================================================
//  ĐIỆN THỜ
// ============================================================================
const DEITY = ['deity_daode', 'deity_wenchang', 'deity_yuanshi', 'deity_lingbao', 'deity_doumu'];
function buildTemple(ctx, r) {
  const mt = mats(), { H, hd } = ctx;
  shell(ctx, { wall: '#8a2a1c', floor: 'stone', plaque: r.title.toUpperCase(), column: mt.lacquer });
  for (let i = 0; i < 3; i++) ctx.box(8 - i * 1.2, 0.5, 3.2 - i * 0.6, mt.lacquer, 0, 0.25 + i * 0.5, -hd + 2.2 - i * 0.2, i === 0);
  const idx = r.key.startsWith('nb:') ? 3 + Number(r.key.slice(3)) : Number(r.key.slice(3));
  ctx.model(DEITY[idx % DEITY.length], { height: 4.6 }, 0, -hd + 1.9, 0, 1.5);
  const halo = ctx.mesh(new THREE.RingGeometry(1.3, 1.5, 40), mt.gold, 0, 5.4, -hd + 0.6); void halo;
  for (const sx of [-1, 1]) for (const z of [-5, 0, 5]) { ctx.cyl(0.42, 0.46, H - 0.4, mt.lacquer, sx * 6, (H - 0.4) / 2, z, true); ctx.cyl(0.66, 0.7, 0.4, mt.gold, sx * 6, 0.2, z); }
  ctx.model('cauldron', { height: 1.3 }, 0, -3.5); ctx.solid(0, -3.5, 0.9, 0.9);
  for (const x of [-1.8, 0, 1.8]) ctx.cyl(0.42, 0.46, 0.16, mt.cushion, x, 0.08, -1.2, false, 16);
  for (const sx of [-1, 1]) ctx.plane(0.9, 4.2, mt.cloth, sx * 5.2, H - 3, -5, sx > 0 ? -Q : Q);
  for (const sx of [-1, 1]) { ctx.light(sx * 2.4, 1.8, -hd + 2.8, 1.3, '#ffb35c'); ctx.cyl(0.1, 0.1, 0.6, lanternMat('#ff5a1e'), sx * 2.4, 1.5, -hd + 2.8); }
  ctx.lamp(-4, H - 3, 3, 1.2); ctx.lamp(4, H - 3, 3, 1.2);
  const god = GODS[godOfTemple(r.key, r.lm?.g || r.g)];
  ctx.spot({ id: 'pray', kind: 'pray', name: `Ban thờ ${god.name}`, verb: `Thắp hương · hỏi ${MASTERS[god.master].name}`, x: 0, z: -2.0, r: 1.6 });
  ctx.npcs.push({ id: `tu_${r.key}`, name: MASTERS[god.master].name, role: `Giữ ${god.hall}`, look: 'master', gua: r.lm?.g || r.g || 'li', wx: '土', lines: god.lines, x: r.origin.x - 4, z: r.origin.z - 4, path: null, face: 0.6 });
}

// ============================================================================
//  NHÀ RIÊNG
// ============================================================================
const TIER_LOOK = {
  tieuxa: { wall: '#d9c9a4', floor: 'wood' },
  nhapho: { wall: '#e3d6b6', floor: 'wood' },
  tuhop: { wall: '#e8dcc0', floor: 'dark' },
  bietvien: { wall: '#efe4c8', floor: 'dark' },
};
const WX_WALL = { 木: '#cfd8bf', 火: '#e2c0a8', 土: '#e3d3a8', 金: '#e8e4dc', 水: '#c9d2d8' };
function buildHome(ctx, r) {
  const l = r.listing, info = homeInfoOf(r.key);
  const look = TIER_LOOK[l.tier];
  const wall = new THREE.Color(look.wall).lerp(new THREE.Color(WX_WALL[l.wx] || look.wall), 0.4).getStyle();
  shell(ctx, { wall, floor: look.floor, plaque: info.mode === 'sale' ? '' : info.owner ? `${info.owner.toUpperCase()} GIA` : '' });
  furnishZone(ctx, info.items || [], { mode: info.mode, couplet: info.couplet || 0, deed: true, lamp: true });
  if (info.mode === 'sale') ctx.plane(1.2, 1.2, colorMat('#ffffff', { map: textTex('ban', 'BÁN', { w: 256, h: 256, bg: '#c8341f', fg: '#f3d36a', border: null, size: 120 }), roughness: 0.7 }), 0, 2.2, -ctx.hd + 0.28);
}

/**
 * Bày đồ của một phòng / một vùng biệt phủ: dựng món, va chạm, điểm dùng đồ (chủ nhà), bàn giấy tờ cạnh cửa.
 * items: [{ u, i, x, z, r }] toạ độ cục bộ phòng / vùng.
 */
export function furnishZone(ctx, items, { mode = 'sale', couplet = 0, deed = false, lamp = false } = {}) {
  const mt = mats(), room = { w: ctx.W, d: ctx.D };
  for (const m of items) {
    const it = ITEM[m.i]; if (!it) continue;
    if (it.place === 'wall' && ctx.yard) continue;
    buildItem(ctx, m, { couplet });
    if (it.place !== 'wall') { const f = footOf(m); ctx.solid(m.x, m.z, f.w / 2 - 0.05, f.d / 2 - 0.05); }
    if (it.use && mode === 'own') {
      const f = it.place === 'wall' ? { w: 0.6, d: 0.6 } : footOf(m);
      // chỗ đứng: ưu tiên phía trước món (theo hướng quay), vướng đồ khác thì thử hai bên rồi phía sau
      const fr = m.r & 3, order = [fr, (fr + 1) & 3, (fr + 3) & 3, (fr + 2) & 3];
      const DIRS = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      const freeAt = (px, pz) => Math.abs(px) < room.w / 2 - 0.8 && Math.abs(pz) < room.d / 2 - 0.8 && !items.some((o) => o !== m && ITEM[o.i]?.place !== 'wall' && (() => { const g = footOf(o); return Math.abs(px - o.x) < g.w / 2 + 0.3 && Math.abs(pz - o.z) < g.d / 2 + 0.3; })());
      let x = m.x, z = m.z;
      for (const k of order) { const d = DIRS[k], px = m.x + d[0] * (f.w / 2 + 0.75), pz = m.z + d[1] * (f.d / 2 + 0.75); if (freeAt(px, pz)) { x = px; z = pz; break; } }
      if (it.place === 'wall') { if (m.r === 1) { x = room.w / 2 - 1.4; z = m.z; } else if (m.r === 3) { x = -room.w / 2 + 1.4; z = m.z; } else { x = m.x; z = -room.d / 2 + 1.4; } }
      x = Math.max(-room.w / 2 + 1, Math.min(room.w / 2 - 1, x)); z = Math.max(-room.d / 2 + 1, Math.min(room.d / 2 - 1, z));
      ctx.spot({ id: `u:${m.u}`, kind: 'use', uid: m.u, item: m.i, use: it.use, name: it.name, verb: USE_VERB[it.use] || `Dùng ${it.name}`, x, z, r: 1.2 });
    }
  }
  if (deed) {
    // cạnh cửa trong: giấy tờ / bài trí / khen nhà
    const doorSpot = { sale: ['Giấy tờ nhà', 'Xem giấy tờ · mua căn này'], own: ['Sổ bài trí', 'Bài trí nhà'], visit: ['Sổ khách', 'Khen nhà'], sold: ['Giấy tờ nhà', 'Căn này đã có chủ'] }[mode] || ['Giấy tờ nhà', 'Xem giấy tờ'];
    ctx.box(0.6, 1.0, 0.4, mt.wood, 2.4, 0.5, ctx.hd - 1.0, true);
    ctx.box(0.5, 0.02, 0.35, mode === 'sale' ? mt.redpaper : mt.jar2, 2.4, 1.01, ctx.hd - 1.0);
    ctx.spot({ id: 'deed', kind: 'home', mode, name: doorSpot[0], verb: doorSpot[1], x: 2.4, z: ctx.hd - 2.0, r: 1.0 });
  }
  if (lamp && !items.some((m) => ITEM[m.i]?.use === 'light')) ctx.lamp(0, ctx.H - 1.3, 0, 1);
}

/**
 * Bộ dựng cho một VÙNG biệt phủ (ngoài trời): group đặt theo khung cục bộ phủ (local) trong parent, còn va chạm /
 * điểm tương tác / đèn tính ra toạ độ thế giới (world, ry đã cộng hướng phủ). y = mặt sàn (nền gian / mặt đất).
 */
export function makeZoneCtx(parent, z) {
  const ctx = makeCtx(parent, { key: z.key, origin: { x: 0, z: 0 }, w: z.w, d: z.d, h: z.h });
  ctx.g.position.set(z.local.x, z.y, z.local.z); ctx.g.rotation.y = z.local.ry;
  ctx.yard = !!z.yard; ctx.lightRefs = [];
  const c = Math.cos(z.world.ry), s = Math.sin(z.world.ry);
  const W = (lx, lz) => ({ x: z.world.x + c * lx + s * lz, z: z.world.z - s * lx + c * lz });
  ctx.solid = (x, zz, hw, hd, ry = 0) => { const p = W(x, zz); ctx.solids.push({ x: p.x, z: p.z, hw: hw + 0.12, hd: hd + 0.12, ry: ry + z.world.ry }); };
  ctx.spot = (sp) => { const p = W(sp.x, sp.z); ctx.spots.push({ r: 1.3, ...sp, x: p.x, z: p.z }); };
  ctx.light = (x, y, zz, power = 1, color = '#ffa04a') => { if (ctx.lights >= 6) return; ctx.lights++; const p = W(x, zz); ctx.lightRefs.push(addLight(p.x, z.y + y, p.z, { color, power })); };
  return ctx;
}

// ============================================================================
//  Trình quản lý phòng: dựng lười, LRU, dựng lại
// ============================================================================
export function createRoomBuilder({ scene, citizens }) {
  const built = new Map(); // key → { ctx, at }
  let tick = 0, lastKey = null;
  function build(key) {
    const r = roomByKey(key); if (!r) return null;
    const ctx = makeCtx(scene, r);
    try {
      if (r.kind === 'shop') buildShop(ctx, r);
      else if (r.kind === 'home') buildHome(ctx, r);
      else buildTemple(ctx, r);
    } catch (e) { console.warn('[rooms] dựng lỗi', key, e); }
    setRoomSolids(key, ctx.solids);
    setRoomSpots(key, ctx.spots);
    for (const n of ctx.npcs) citizens?.add?.(n);
    const rec = { ctx, at: performance.now() };
    built.set(key, rec);
    evict(key);
    return rec;
  }
  function dispose(key) {
    const rec = built.get(key); if (!rec) return;
    const { ctx } = rec;
    scene.remove(ctx.g);
    for (const o of ctx.own) o.dispose?.();
    clearRoomSolids(key); clearRoomSpots(key); removeRoomLights(key);
    for (const n of ctx.npcs) citizens?.remove?.(n.id);
    built.delete(key);
  }
  function evict(keep) {
    if (built.size <= MAX_BUILT) return;
    const old = [...built.entries()].filter(([k]) => k !== keep && k !== lastKey).sort((a, b) => a[1].at - b[1].at);
    while (built.size > MAX_BUILT && old.length) dispose(old.shift()[0]);
  }
  function ensure(key) { const rec = built.get(key) || build(key); if (rec) rec.at = performance.now(); return rec; }
  return {
    /** gọi trước khi dịch chuyển vào phòng (trong nửa giây chuyển cảnh) */
    prepare: (key) => { if (roomByKey(key)) ensure(key); },
    /** dựng lại (nhà đổi bố cục / đổi chủ) — chỉ nếu đang dựng */
    rebuild: (key) => { if (built.has(key)) { dispose(key); build(key); } },
    /** mỗi khung: người chơi đang trong phòng nào thì bảo đảm phòng đó đã dựng */
    update(px, pz, dt = 0.016) {
      tick -= dt; if (tick > 0) return; tick = 0.25;
      const r = roomAtDyn(px, pz); lastKey = r?.key || null;
      if (r) ensure(r.key);
    },
    isBuilt: (key) => built.has(key),
    roomGroup: (key) => built.get(key)?.ctx.g || null,
    buildItemPreview: (key, m) => { const rec = built.get(key); return rec ? buildItem(rec.ctx, m) : null; },
    WX_NAME, TIERS, TEMPLE_NB,
  };
}
