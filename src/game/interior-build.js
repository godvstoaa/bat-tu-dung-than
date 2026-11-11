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
import { placeModel, loadModel } from './assets.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
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
  /** nhiều bản một model (bàn ghế, bình…): một InstancedMesh / lưới model; items {x,y,z,ry,s}, s = kích thước đích theo `fitKey` */
  ctx.inst = (id, items, fitKey = 'height') => loadModel(id).then((gm) => {
    if (!gm || !items.length) return;
    const root = gm.scene; root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root), size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
    const ref = (fitKey === 'width' ? size.x : fitKey === 'depth' ? size.z : size.y) || 1;
    const M4 = new THREE.Matrix4(), base = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), one = new THREE.Vector3(1, 1, 1), P = new THREE.Vector3();
    root.traverse((o) => {
      if (!o.isMesh) return;
      const im = new THREE.InstancedMesh(o.geometry, o.material, items.length); im.castShadow = true; im.receiveShadow = true;
      items.forEach((it, i) => {
        const k = it.s / ref;
        base.makeTranslation(-center.x, -box.min.y, -center.z).premultiply(new THREE.Matrix4().makeScale(k, k, k));
        M4.compose(P.set(it.x, it.y || 0, it.z), q.setFromAxisAngle(up, it.ry || 0), one).multiply(base).multiply(o.matrixWorld);
        im.setMatrixAt(i, M4);
      });
      im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); g.add(im); ctx.own.push(im);
    });
  }).catch(() => null);
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
  const nl2 = (r.type === 'tuu' || r.type === 'tralau') ? 4 + Math.floor(rnd() * 2) : nl; // quán ăn uống: đèn dày (§3.6)
  for (let k = 0; k < nl2; k++) ctx.lamp(-W / 2 + (W * (k + 0.5)) / nl2 + (rnd() - 0.5), ctx.H - 1.2 - rnd() * 0.6, (rnd() - 0.5) * (ctx.D * 0.4), 1, k % 2 && rnd() < 0.5 ? '#e2a531' : lc);
  const dine = r.type === 'tuu' || r.type === 'tralau';
  if (!dine) { const F = furn(ctx); shopDress(ctx, F, rnd, island, hiring); F.flush(); }
  shopExtras(ctx, rnd, hiring, dine);
}
/** đồ thêm riêng từng tiệm (thảm, chậu cây, chum, thùng gỗ, ghế đẩu, rèm) ở các góc trống cạnh cửa + giữa sàn */
function shopExtras(ctx, rnd, hiring, dine = false) {
  const mt = mats(), { hw, hd } = ctx;
  if (rnd() < 0.7 && !dine) { const rc = pickOf(rnd, ['#7a2a20', '#3e5a6a', '#6a5a2a', '#5a2a4a', '#2e4a3a']); const rug = ctx.plane(2.2 + rnd() * 1.6, 1.6 + rnd() * 1.4, colorMat(rc, { roughness: 1 }), (rnd() - 0.5) * 1.2, 0.012, 0.8 + (rnd() - 0.5) * 1.5); rug.rotation.x = -Math.PI / 2; }
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
// ============================================================================
//  QUÁN RA QUÁN (docs/CAY-QUAN-MANIFEST.md §3) — bàn ghế là MODEL THẬT (gỗ kiểu Minh, Meshy), không còn hộp:
//    bàn vuông bát tiên / bàn tròn + ghế tựa quay vào bàn + bộ trà / vò rượu trên mặt bàn (Tống ngồi ghế, không ngồi đệm)
//    thuỷ bài (bảng tên món) treo trên quầy · giá hoa có bình cắm hoa bốn mùa · tùng cảnh trên án (Mộng Lương Lục:
//    «插四時花，掛名人畫» · «列花架，安頓奇杉異檜») · tranh / thư pháp hai vách và vách cửa · bình phong ngăn gian tửu lâu
//  Mỗi model một InstancedMesh / phòng (ctx.inst) — vài chục lệnh vẽ cho cả phòng.
// ============================================================================
/** gom đồ model theo id rồi dựng InstancedMesh một lần / model / phòng */
function furn(ctx) {
  const F = new Map();
  return {
    add(id, s, x, z, ry = 0, y = 0, fit = 'height') { const k = `${id}|${fit}`; if (!F.has(k)) F.set(k, { id, fit, items: [] }); F.get(k).items.push({ x, y, z, ry, s }); },
    flush() { for (const { id, fit, items } of F.values()) ctx.inst(id, items, fit); },
  };
}
// tỉ lệ rộng / cao của model (đo khung bao): mặt bàn cao = rộng / k
const TABLE = { sq: { id: 'pr_table_long', w: 1.15, k: 1.53 }, round: { id: 'pr_table_round', w: 2.0, k: 3.25 } };
const CHAIRS = [['pr_chair', 1.0], ['pr_chair_red', 1.08]];
/** một bộ bàn: bàn + 2–6 ghế quay vào bàn + đồ trên bàn (bộ trà / vò rượu + chén) */
function tableSet(ctx, F, rnd, x, z, { round = false, seats = 4, top = 'tea', rot = 0, chair = null } = {}) {
  const T = round ? TABLE.round : TABLE.sq, th = T.w / T.k, [cid, ch] = chair || pickOf(rnd, CHAIRS), mt = mats();
  F.add(T.id, T.w, x, z, rot, 0, 'width');
  ctx.solid(x, z, T.w / 2 - 0.08, T.w / 2 - 0.08, rot);
  const pos = [];
  if (round) for (let k = 0; k < seats; k++) { const a = rot + (k / seats) * Math.PI * 2 + 0.35; pos.push([x + Math.sin(a) * (T.w / 2 + 0.4), z + Math.cos(a) * (T.w / 2 + 0.4)]); }
  else {
    const sides = [[0, 1], [0, -1], [1, 0], [-1, 0]].slice(0, Math.max(2, Math.min(4, seats))), c = Math.cos(rot), s = Math.sin(rot);
    for (const [ax, az] of sides) pos.push([x + (ax * c + az * s) * (T.w / 2 + 0.36), z + (-ax * s + az * c) * (T.w / 2 + 0.36)]);
  }
  for (const [cx, cz] of pos) { F.add(cid, ch, cx, cz, Math.atan2(x - cx, z - cz) + (rnd() - 0.5) * 0.3); ctx.solid(cx, cz, 0.25, 0.25); }
  if (top === 'tea') F.add('pr_teaset', round ? 0.62 : 0.5, x, z, rnd() * 6.28, th, 'width');
  else if (top === 'wine') {
    F.add('pr_jar_porcelain', 0.3, x + 0.15, z - 0.12, rnd() * 6, th);
    for (let k = 0; k < 3; k++) { const a = k * 2.1 + rnd(); ctx.cyl(0.045, 0.035, 0.07, mt.jar2, x + Math.cos(a) * 0.34, th + 0.035, z + Math.sin(a) * 0.34, false, 10); }
    ctx.box(0.34, 0.05, 0.24, mt.jar2, x - 0.2, th + 0.025, z + 0.16); ctx.box(0.26, 0.06, 0.16, colorMat('#c8a050'), x - 0.2, th + 0.08, z + 0.16); // đĩa thức nhắm
  }
  return { x, z, th };
}
// hoa bốn mùa (tứ thời hoa): đào / mai hồng · lan trắng tím · cúc vàng · mai trắng điểm đỏ — cành mảnh, hoa nhỏ dọc ngọn
const SEASON_FLOWER = [['#f2c4d4', '#e07a9a'], ['#f5f0e8', '#b58ad8'], ['#f2c440', '#e88a20'], ['#f4f0ea', '#c8304a']];
const FLOWER_MAT = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75 });
function flowers(ctx, rnd, x, y, z) {
  const parts = [], col = pickOf(rnd, SEASON_FLOWER), stem = new THREE.Color('#3a2a1a'), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
  const paint = (g, hex) => { const c = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) c.toArray(a, i * 3); g.setAttribute('color', new THREE.BufferAttribute(a, 3)); for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'color'].includes(k)) g.deleteAttribute(k); return g.index ? g.toNonIndexed() : g; };
  const n = 4 + Math.floor(rnd() * 3);
  for (let s = 0; s < n; s++) {
    const a = rnd() * 6.283, lean = 0.15 + rnd() * 0.45, len = 0.45 + rnd() * 0.45, d = new THREE.Vector3(Math.sin(a) * Math.sin(lean), Math.cos(lean), Math.cos(a) * Math.sin(lean));
    const g = new THREE.CylinderGeometry(0.007, 0.011, len, 4); g.translate(0, len / 2, 0); q.setFromUnitVectors(up, d); g.applyMatrix4(m4.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(1, 1, 1))); parts.push(paint(g, `#${stem.getHexString()}`));
    for (let j = 0; j < 5; j++) {
      const t = 0.5 + 0.5 * rnd(), r = 0.025 + rnd() * 0.022, b = new THREE.IcosahedronGeometry(r, 0);
      b.translate(x + d.x * len * t + (rnd() - 0.5) * 0.06, y + d.y * len * t + (rnd() - 0.5) * 0.04, z + d.z * len * t + (rnd() - 0.5) * 0.06); parts.push(paint(b, j % 3 ? col[0] : col[1]));
    }
  }
  const geo = mergeGeometries(parts); ctx.own.push(geo);
  const m = new THREE.Mesh(geo, FLOWER_MAT); m.castShadow = true; ctx.g.add(m);
}
/** giá hoa: án gỗ dựa vách + bình sứ cắm hoa / chậu tùng cảnh (+ chum sứ cạnh chân án) */
function flowerStand(ctx, F, rnd, x, z, ry, kind = 'vase') {
  const w = 1.1 + rnd() * 0.25, th = w / 1.44;
  F.add('pr_table_ming', w, x, z, ry, 0, 'width'); ctx.solid(x, z, w / 2, 0.26, ry);
  const s = Math.sin(ry), c = Math.cos(ry);
  if (kind === 'bonsai') F.add('lib_bonsai.vch', 0.7, x, z, ry + rnd(), th);
  else {
    const [vid, vh] = pickOf(rnd, [['pr_vase_ming', 0.42], ['pr_vase_celadon', 0.45]]), ox = (rnd() - 0.5) * w * 0.4;
    F.add(vid, vh, x + c * ox, z - s * ox, rnd() * 6, th); flowers(ctx, rnd, x + c * ox, th + vh * 0.85, z - s * ox);
    if (rnd() < 0.6) F.add('pr_teaset', 0.32, x - c * ox * 1.6, z + s * ox * 1.6, rnd() * 6, th, 'width');
  }
  if (rnd() < 0.5) F.add('pr_jar_porcelain', 0.5, x + c * (w / 2 + 0.35) + s * 0.1, z - s * (w / 2 + 0.35) + c * 0.1, rnd() * 6);
}
// thuỷ bài: bảng tên món treo trên thanh gỗ phía trên quầy (chữ dọc, đỏ / đen xen nhau)
const MENU = {
  tralau: ['龍 井', '碧 螺 春', '普 洱', '鐵 觀 音', '茉 莉', '白 毫', '桂 花 糕', '點 心'],
  tuu: ['女 兒 紅', '竹 葉 青', '杏 花 村', '花 雕', '燒 鵝', '醉 蟹', '牛 肉', '湯 麵'],
};
function menuBoards(ctx, rnd, list, cz, span) {
  const mt = mats(), n = Math.min(list.length, 5 + Math.floor(rnd() * 3)), y = ctx.H - 2.4, start = Math.floor(rnd() * list.length);
  ctx.box(span + 0.4, 0.07, 0.07, mt.dark, 0, y + 0.64, cz);
  for (const sx of [-1, 1]) ctx.cyl(0.015, 0.015, ctx.H - y - 0.6, mt.dark, sx * (span / 2 + 0.1), (ctx.H + y + 0.64) / 2, cz, false, 4);
  for (let k = 0; k < n; k++) {
    const t = list[(start + k) % list.length], red = (k + start) % 2 === 0;
    const tex = textTex(`mn:${t}:${red}`, t, { w: 96, h: 320, bg: red ? '#8a2a1c' : '#2e1b12', fg: red ? '#f3e7c8' : '#e8c25a', border: red ? '#e8c25a' : null, vertical: true, size: 56 });
    const p = ctx.plane(0.34, 1.12, colorMat('#ffffff', { map: tex, roughness: 0.7, side: THREE.DoubleSide }), -span / 2 + span * (k + 0.5) / n, y, cz);
    p.rotation.z = (rnd() - 0.5) * 0.04;
  }
}
/** lò phong lô đun nước (than hồng + ấm đồng) cạnh quầy trà + chum nước */
function teaStove(ctx, F, x, z) {
  const mt = mats();
  ctx.cyl(0.3, 0.36, 0.72, mt.jar, x, 0.36, z, true, 12);
  ctx.cyl(0.24, 0.24, 0.04, colorMat('#ff6a2a', { emissive: '#ff5a1a', emissiveIntensity: 1.4 }), x, 0.73, z, false, 12);
  const k = ctx.mesh(new THREE.SphereGeometry(0.19, 12, 8), mt.brass, x, 0.92, z); k.scale.y = 0.82;
  const sp = ctx.cyl(0.028, 0.018, 0.24, mt.brass, x + 0.2, 0.98, z, false, 6); sp.rotation.z = -0.95;
  ctx.cyl(0.05, 0.05, 0.05, mt.dark, x, 1.1, z, false, 8);
  ctx.light(x, 1.0, z, 0.45, '#ff8a3c');
  F.add('pr_jar_porcelain', 0.75, x - 0.85, z, 0.4); ctx.solid(x - 0.85, z, 0.3, 0.3);
}
/** tranh cuộn / thư pháp trên vách cửa (mặt quay vào trong) — hai bên cửa, ngoài câu đối */
function frontArt(ctx, rnd) {
  const mt = mats(), pics = Object.keys(ITEM).filter((k) => ITEM[k].proc === 'painting');
  for (const sx of [-1, 1]) {
    if (!pics.length || rnd() < 0.15) continue;
    const it = ITEM[pickOf(rnd, pics)], x = sx * (ctx.hw / 2 + 0.6 + rnd() * 0.8), z = ctx.hd - 0.3;
    const w = 1.0 + rnd() * 0.4, h = w * (1.3 + rnd() * 0.3);
    ctx.box(w + 0.1, h + 0.14, 0.04, mt.dark, x, 2.6, z + 0.01);
    ctx.plane(w, h, colorMat('#ffffff', { map: artTex(it.art), roughness: 0.85 }), x, 2.6, z - 0.02, Math.PI);
  }
}
/** tranh / thư pháp hai vách bên (quán không bày hàng dọc vách: trà lâu, tửu lâu) */
function sideArt(ctx, rnd, zs) {
  const wallArt = Object.keys(ITEM).filter((k) => ITEM[k].place === 'wall' && ['painting', 'calli'].includes(ITEM[k].proc));
  if (!wallArt.length) return;
  for (const r of [1, 3]) for (const z of zs) if (rnd() < 0.85) buildItem(ctx, { i: pickOf(rnd, wallArt), x: 0, z: z + (rnd() - 0.5) * 0.8, r });
}
/** bàn tiếp khách + giá hoa cho tiệm bán (tiệm không bàn khách trước đây chỉ có quầy + hàng) */
function shopDress(ctx, F, rnd, island, hiring) {
  const { hw, hd } = ctx;
  // hai góc vách sau (cạnh kệ hàng): giá hoa · tùng cảnh
  const kinds = rnd() < 0.5 ? ['vase', 'bonsai'] : ['bonsai', 'vase'];
  [-1, 1].forEach((sx, k) => flowerStand(ctx, F, rnd, sx * (hw - 1.15), -hd + 0.55, 0, kinds[k]));
  // bàn tiếp khách (chủ tiệm mời trà): giữa phòng phía cửa, lệch một bên lối giữa — chỉ khi chưa có hàng bày giữa phòng
  if (!island) { const side = rnd() < 0.5 ? -1 : 1; tableSet(ctx, F, rnd, side * Math.min(3.3, hw - 3.2), Math.min(1.2, hd - (hiring ? 5.6 : 4)), { seats: 2, rot: 0, top: 'tea' }); }
  frontArt(ctx, rnd);
}
/** lấp khoảng trống lớn (§3.5: không để sàn trống > 4 × 4 m): tìm điểm xa mọi vật cản / điểm tương tác nhất (bỏ lối giữa
 *  cửa → quầy), còn hở bán kính ≥ 2,3 m thì đặt thêm một bộ bàn — lặp tối đa 4 lần */
function fillEmpty(ctx, F, rnd, opt, zMin, zMax) {
  const { hw } = ctx, ox = ctx.r.origin.x, oz = ctx.r.origin.z;
  for (let n = 0; n < 4; n++) {
    const S = [...ctx.solids.map((q) => ({ x: q.x - ox, z: q.z - oz, r: Math.max(q.hw, q.hd) })), ...ctx.spots.map((q) => ({ x: q.x - ox, z: q.z - oz, r: 0.9 }))];
    let best = null, bd = 0;
    for (let x = -hw + 1.5; x <= hw - 1.5; x += 0.5) for (let z = zMin; z <= zMax; z += 0.5) {
      if (Math.abs(x) < 2.6) continue;
      let d = hw - Math.abs(x); for (const q of S) d = Math.min(d, Math.hypot(x - q.x, z - q.z) - q.r);
      if (d > bd) { bd = d; best = [x, z]; }
    }
    if (!best || bd < 2.3) break;
    tableSet(ctx, F, rnd, best[0], best[1], { seats: 2 + Math.floor(rnd() * 2), ...opt });
  }
}
// chum rượu đất nung: dáng phình bụng, miệng nhỏ (tiện xoay một lần / phòng)
function wineJar(ctx, geo, x, z, r, h, y = 0) {
  const mt = mats(), m = new THREE.Mesh(geo, mt.jar); m.position.set(x, y, z); m.scale.set(r, h, r); m.castShadow = m.receiveShadow = true; ctx.g.add(m);
  ctx.cyl(r * 0.5, r * 0.56, 0.07, mt.redpaper, x, y + h + 0.02, z, false, 12); // nắp giấy đỏ
  ctx.cyl(r * 0.47, r * 0.47, 0.03, mt.dark, x, y + h - 0.04, z, false, 12); // dây buộc
}
const jarProfile = () => new THREE.LatheGeometry([[0, 0], [0.62, 0], [0.86, 0.1], [1, 0.42], [0.94, 0.7], [0.66, 0.88], [0.46, 0.95], [0.48, 1]].map(([a, b]) => new THREE.Vector2(a, b)), 18);
const SHOP_EXTRA = {
  tuu(ctx) {
    const mt = mats(), { hw, hd } = ctx, F = furn(ctx);
    const rnd = seeded(`tuu|${ctx.r.key}`);
    // chum rượu đất nung xếp tầng sau quầy bên trái (nắp giấy đỏ buộc dây) + vò sứ bên phải
    const nj = 4 + Math.floor(rnd() * 3), jg = jarProfile(); ctx.own.push(jg);
    for (let i = 0; i < nj; i++) { const x = -hw + 1.0 + i * 0.78, r = 0.34 + rnd() * 0.05, h = 0.7 + rnd() * 0.18; wineJar(ctx, jg, x, -hd + 1.25, r, h); ctx.solid(x, -hd + 1.25, r, r); }
    for (let i = 0; i < nj - 2; i++) { const x = -hw + 1.39 + i * 0.78; ctx.box(0.7, 0.05, 0.5, mt.wood, x, 0.92, -hd + 1.25); wineJar(ctx, jg, x, -hd + 1.25, 0.28, 0.58, 0.95); } // tầng trên kê ván
    for (let i = 0; i < 3; i++) F.add('pr_jar_porcelain', 0.7 + rnd() * 0.2, hw - 1.0 - i * 0.85, -hd + 1.2, rnd() * 6);
    const cz = -hd + 2.75; menuBoards(ctx, rnd, MENU.tuu, cz - 0.15, 4.2);
    // ba kiểu: (0) gian ngăn vách trái + bàn tròn bên phải · (1) gian ngăn + bàn vuông lưới · (2) bình phong chia giữa, bàn tròn hai bên
    const style = Math.floor(rnd() * 3), chair = pickOf(rnd, CHAIRS), sets = [];
    if (style < 2) {
      // gian ngăn (閣子 — Đông Kinh Mộng Hoa Lục): bình phong vuông góc vách trái, mỗi gian một bàn vuông hai ghế
      const zs = [-2.6, 0.9, 4.4].filter((z) => z < hd - 2.4), scr = pickOf(rnd, ['pr_screen_antique', 'pr_screen_blossom']);
      for (const z of [...zs.map((z) => z - 1.75), zs[zs.length - 1] + 1.75]) { F.add(scr, 1.9, -hw + 1.25, z, Math.PI / 2); ctx.solid(-hw + 1.25, z, 0.95, 0.12); }
      for (const z of zs) sets.push(tableSet(ctx, F, rnd, -hw + 1.3, z, { seats: 2, top: rnd() < 0.6 ? 'wine' : 'tea', chair }));
      if (style === 0) for (const [x, z] of [[hw - 3.4, -1.6], [hw - 3.4, 3.0], [-3.6, 1.2]]) sets.push(tableSet(ctx, F, rnd, x + (rnd() - 0.5) * 0.4, z + (rnd() - 0.5) * 0.4, { round: x > 0, seats: x > 0 ? 4 + Math.floor(rnd() * 2) : 3, top: 'wine', chair }));
      else for (const [x, z] of [[hw - 2.8, -1.8], [hw - 2.8, 1.6], [hw - 2.8, 5.0], [-3.4, -0.2], [-3.4, 3.4]].filter(([, z]) => z < hd - 2.6)) sets.push(tableSet(ctx, F, rnd, x, z, { seats: 4, top: rnd() < 0.7 ? 'wine' : 'tea', chair }));
    } else {
      for (const sx of [-1, 1]) { F.add('pr_screen_blossom', 2.0, sx * (hw - 3.6), 0.6, 0); ctx.solid(sx * (hw - 3.6), 0.6, 1.0, 0.15); } // bình phong ngăn đôi mỗi dãy bàn tròn
      for (const [x, z] of [[-hw + 3.6, -2.0], [-hw + 3.6, 3.2], [hw - 3.6, -2.0], [hw - 3.6, 3.2]]) sets.push(tableSet(ctx, F, rnd, x, z + (rnd() - 0.5) * 0.3, { round: true, seats: 4 + Math.floor(rnd() * 2), top: 'wine', chair }));
    }
    const t0 = sets[0];
    ctx.spot({ id: 's:tindon', kind: 'svc', svc: 'tindon', name: SVC.tindon.name, verb: SVC.tindon.verb, x: t0.x + 1.9, z: t0.z, r: 1.4 });
    flowerStand(ctx, F, rnd, hw - 0.55, hd - 5.2, -Q, 'vase');
    sideArt(ctx, rnd, [-2, 2.5]);
    frontArt(ctx, rnd);
    fillEmpty(ctx, F, rnd, { top: 'wine', chair }, -hd + 4.2, hd - 3.4);
    F.flush();
    ctx.npcs.push({ id: `tn_${ctx.r.key}`, name: 'Tiểu Nhị', role: 'Tiểu nhị', look: 'npc_villager', gua: ctx.r.shop.g, wx: '水', lines: ['Có ngay, có ngay!', 'Lầu trên còn bàn sát cửa sổ.', 'Khách quan muốn nghe chuyện thì hỏi chưởng quầy.'], x: ctx.r.origin.x + 1.5, z: ctx.r.origin.z + 1.2, path: null, face: -Q });
  },
  tralau(ctx) {
    const mt = mats(), { hw, hd } = ctx, F = furn(ctx);
    const rnd = seeded(`tra|${ctx.r.key}`);
    // sân khấu thuyết thư góc phải: bục + bình phong model + ghế bành trống + án nhỏ (thước gõ)
    ctx.box(4, 0.4, 2.2, mt.wood, hw - 3.2, 0.2, -hd + 1.5, true);
    F.add(pickOf(rnd, ['pr_screen_antique', 'pr_screen_blossom']), 2.2, hw - 3.2, -hd + 0.75, 0, 0.4);
    F.add('pr_chair_red', 1.08, hw - 4.5, -hd + 1.4, 0, 0.4); F.add('pr_table_ming', 0.9, hw - 2.0, -hd + 1.9, 0, 0.4, 'width');
    ctx.box(0.22, 0.05, 0.06, mt.dark, hw - 2.0, 0.4 + 0.9 / 1.44 + 0.03, -hd + 1.9);
    ctx.npcs.push({ id: `tt_${ctx.r.key}`, name: 'Tiên Sinh Kể Chuyện', role: 'Thuyết thư', look: 'master', gua: ctx.r.shop.g, wx: '木', lines: ['Lại nói chuyện năm ấy…', 'Muốn biết hậu sự thế nào, xin nghe hồi sau phân giải.'], x: ctx.r.origin.x + hw - 3.2, z: ctx.r.origin.z - hd + 1.6, path: null, face: 0 });
    ctx.spot({ id: 's:thuyetthu', kind: 'svc', svc: 'thuyetthu', name: SVC.thuyetthu.name, verb: SVC.thuyetthu.verb, x: hw - 3.2, z: -hd + 3.4 });
    // quầy trà: lò phong lô + chum nước bên trái quầy, thuỷ bài treo trên quầy
    teaStove(ctx, F, -3.9, -hd + 2.4);
    menuBoards(ctx, rnd, MENU.tralau, -hd + 2.6, 3.8);
    // ba kiểu bàn: (0) hai dãy bàn vuông · (1) bàn tròn · (2) bàn tròn trái + bàn vuông phải — lối giữa ≥ 1,4 m
    const style = Math.floor(rnd() * 3), chair = pickOf(rnd, CHAIRS), sets = [];
    const rows = [-0.8, 2.5, 5.6].filter((z) => z < hd - 2.4);
    for (const sx of [-1, 1]) for (const [i, z] of rows.entries()) {
      const round = style === 1 || (style === 2 && sx < 0);
      if (round && i === 2) continue; // bàn tròn chiếm chỗ hơn: hai hàng
      if (rnd() < 0.12 && sets.length > 2) continue; // để trống một chỗ cho thoáng
      const z2 = round ? -0.4 + i * 3.8 : z;
      sets.push(tableSet(ctx, F, rnd, sx * (round ? 4.6 : 4.4) + (rnd() - 0.5) * 0.5, z2 + (rnd() - 0.5) * 0.4, { round, seats: round ? 4 + Math.floor(rnd() * 2) : 2 + Math.floor(rnd() * 3), top: 'tea', chair }));
    }
    const t0 = sets[0];
    ctx.spot({ id: 's:uongtra', kind: 'svc', svc: 'uongtra', name: SVC.uongtra.name, verb: SVC.uongtra.verb, x: t0.x + (t0.x < 0 ? 2.0 : -2.0), z: t0.z });
    // giá hoa + tùng cảnh dựa vách (Mộng Lương Lục: cắm hoa bốn mùa, bày tùng bách lạ)
    flowerStand(ctx, F, rnd, -hw + 0.55, -hd + 3.3, Q, 'vase');
    flowerStand(ctx, F, rnd, hw - 0.55, hd - 3.2, -Q, 'bonsai');
    sideArt(ctx, rnd, [-1.5, 2.5]);
    fillEmpty(ctx, F, rnd, { top: 'tea', chair }, -hd + 4.2, hd - 3.4);
    frontArt(ctx, rnd);
    F.flush();
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
