// ============================================================================
//  NỘI THẤT ĐIỆN THỜ (world.js › ROOMS) — dựng thủ tục + tượng thần GLB (Meshy)
//  Sàn đá · tường sơn son · hàng cột đỏ chân vàng · xà vẽ · trần ô cờ · phướn treo ·
//  bàn thờ ba cấp phủ khăn đỏ · tượng thần · bàn lễ (nến + lư hương) · bồ đoàn · đèn lồng.
//  Va chạm: sàn = nền đi được (addPlatform), cột / bàn thờ / tượng = vật cản (addBlock).
//  Đèn: addLight(..., { room }) → render3d gán đèn điểm khi người chơi ở trong điện.
// ============================================================================
import * as THREE from 'three';
import * as TX from './textures.js';
import { ROOMS } from './world.js';
import { addBlock, addPlatform } from './obstacles.js';
import { addLight, glowAll, addGlow } from './lights.js';
import { placeModel, instanceModel, loadModel } from './assets.js';
import { createCharacter } from './characters.js';

const M = {};
function mats() {
  if (M.ready) return M;
  M.floor = new THREE.MeshStandardMaterial({ map: TX.stoneTex({ seed: 41, tiles: 6, repeat: [6, 6], base: '#6d665c' }), roughness: 0.85 });
  M.wall = new THREE.MeshStandardMaterial({ map: TX.lacquerTex('#7a1c14', { seed: 9, gold: 0.25, repeat: [3, 1] }), roughness: 0.6 });
  M.dado = new THREE.MeshStandardMaterial({ color: '#2b1410', roughness: 0.7 });
  M.col = new THREE.MeshStandardMaterial({ map: TX.lacquerTex('#9c2318', { seed: 4, gold: 0.15 }), roughness: 0.45, metalness: 0.05 });
  M.gold = new THREE.MeshStandardMaterial({ color: '#d4a63c', roughness: 0.32, metalness: 0.85 });
  M.beam = new THREE.MeshStandardMaterial({ color: '#1f5a55', roughness: 0.55 });
  M.ceil = new THREE.MeshStandardMaterial({ color: '#2a1712', roughness: 0.8 });
  M.panel = new THREE.MeshStandardMaterial({ color: '#3a4f7a', roughness: 0.6 });
  M.altar = new THREE.MeshStandardMaterial({ map: TX.lacquerTex('#4a1610', { seed: 12, gold: 0.5 }), roughness: 0.5 });
  M.cloth = new THREE.MeshStandardMaterial({ color: '#b3231a', roughness: 0.9, side: THREE.DoubleSide });
  M.banner = new THREE.MeshStandardMaterial({ color: '#d9b04a', roughness: 0.85, side: THREE.DoubleSide });
  M.cushion = new THREE.MeshStandardMaterial({ color: '#a3681f', roughness: 0.95 });
  M.wax = new THREE.MeshStandardMaterial({ color: '#c8231a', emissive: '#ff5a1e', emissiveIntensity: 0.6, roughness: 0.6 });
  M.flame = new THREE.MeshBasicMaterial({ color: '#ffd27a' });
  M.ready = true;
  return M;
}
const box = (w, h, d, m, x, y, z, g) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
const cyl = (r1, r2, h, m, x, y, z, g, seg = 16) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };

async function buildRoom(root, r, updaters) {
  const m = mats();
  const g = new THREE.Group(); g.name = `room-${r.id}`; g.position.set(r.origin.x, 0, r.origin.z); root.add(g);
  const W = r.w, D = r.d, H = r.h, hw = W / 2, hd = D / 2;
  const L = (x, z) => ({ x: r.origin.x + x, z: r.origin.z + z }); // toạ độ thế giới
  // nền đi được (mặt trên y = 0), mép trong tường
  addPlatform(r.origin.x, r.origin.z, W - 1.4, D - 1.4, 0, 0);
  box(W + 1, 0.4, D + 1, m.floor, 0, -0.2, 0, g);
  // tường: chân tường sẫm, thân sơn son; cửa trước mở giữa rộng 5 m
  const wallT = 0.6;
  for (const [w, d, x, z] of [[W, wallT, 0, -hd], [wallT, D, -hw, 0], [wallT, D, hw, 0]]) { box(w, H, d, m.wall, x, H / 2, z, g); box(w + 0.05, 1.1, d + 0.05, m.dado, x, 0.55, z, g); }
  const gap = 5, side = (W - gap) / 2;
  for (const sx of [-1, 1]) { box(side, H, wallT, m.wall, sx * (gap / 2 + side / 2), H / 2, hd, g); box(side, 1.1, wallT + 0.05, m.dado, sx * (gap / 2 + side / 2), 0.55, hd, g); }
  box(gap, H - 5, wallT, m.wall, 0, 5 + (H - 5) / 2, hd, g);
  // ô cửa lưới gỗ trên tường bên (tạo nhịp, bắt sáng)
  for (const sx of [-1, 1]) for (let z = -hd + 4; z <= hd - 4; z += 5) box(0.1, 3.2, 2.6, m.panel, sx * (hw - 0.36), 5.2, z, g);
  // trần ô cờ + xà
  box(W, 0.5, D, m.ceil, 0, H + 0.25, 0, g);
  for (let z = -hd + 3; z < hd; z += 3.2) { box(W - 0.6, 0.55, 0.45, m.beam, 0, H - 0.6, z, g); box(W - 0.6, 0.1, 0.5, m.gold, 0, H - 0.3, z, g); }
  for (let x = -hw + 3; x < hw; x += 3.2) box(0.35, 0.4, D - 0.6, m.beam, x, H - 0.25, 0, g);
  // hàng cột đỏ chân vàng (hai bên lối giữa)
  const colX = hw - 4.2;
  for (let z = -hd + 5; z <= hd - 3; z += 5.5) for (const sx of [-1, 1]) {
    cyl(0.45, 0.5, H - 0.6, m.col, sx * colX, (H - 0.6) / 2, z, g);
    cyl(0.75, 0.8, 0.45, m.gold, sx * colX, 0.22, z, g);
    cyl(0.6, 0.5, 0.35, m.gold, sx * colX, H - 0.75, z, g);
    const w2 = L(sx * colX, z); addBlock(w2.x, w2.z, 0.75);
    // phướn vàng viền đỏ treo trước cột
    const b = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 4.2), m.banner); b.position.set(sx * (colX - 0.8), H - 3.4, z); b.rotation.y = sx > 0 ? -Math.PI / 2 : Math.PI / 2; g.add(b);
  }
  // bàn thờ ba cấp phủ khăn đỏ
  const aw = Math.max(8, r.deities.length * 6.5 + 2), az = -hd + 3.6;
  for (let i = 0; i < 3; i++) box(aw - i * 1.2, 0.45, 4.6 - i * 0.8, m.altar, 0, 0.225 + i * 0.45, az - i * 0.3, g);
  const top = 1.35;
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(aw * 0.9, 1.1), m.cloth); cloth.position.set(0, 0.62, az + 2.32); g.add(cloth);
  box(aw * 0.9, 0.12, 0.08, m.gold, 0, 1.15, az + 2.33, g);
  { const a = L(0, az); for (let x = -aw / 2 + 1.5; x <= aw / 2 - 1.5; x += 2.5) addBlock(a.x + x, a.z + 0.4, 1.6); }
  // tượng thần (GLB Meshy) ngồi trên bàn thờ, quay ra cửa
  for (const [id, dx] of r.deities) {
    const w2 = L(dx, az - 0.4);
    placeModel(g.parent, id, { fit: { height: r.deities.length > 1 ? 5.4 : 6.2 }, at: { x: w2.x, y: top, z: w2.z, ry: 0 } }).then((res) => {
      if (!res) return;
      res.obj.traverse((o) => { if (o.isMesh) { o.castShadow = true; for (const mm of [].concat(o.material)) if (mm.envMapIntensity != null) mm.envMapIntensity = 0.6; } });
    });
    // vầng hào quang sau tượng
    const halo = new THREE.Mesh(new THREE.RingGeometry(1.5, 1.75, 48), m.gold); halo.position.set(dx, top + 4.4, az - 1.6); g.add(halo);
  }
  // bàn lễ: nến + lư hương + mâm quả
  const tz = az + 4.2;
  box(aw * 0.55, 0.9, 1.4, m.altar, 0, 0.45, tz, g);
  { const a = L(0, tz); addBlock(a.x, a.z, 1.2); }
  for (const sx of [-1, 1]) {
    cyl(0.12, 0.12, 0.7, m.wax, sx * (aw * 0.22), 1.25, tz, g, 10);
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), m.flame); f.position.set(sx * (aw * 0.22), 1.66, tz); f.scale.y = 1.8; g.add(f);
    const w2 = L(sx * (aw * 0.22), tz); addLight(w2.x, 2.2, w2.z, { color: '#ffb35c', power: 1.2, room: r.id });
  }
  loadModel('cauldron').then(() => placeModel(g.parent, 'cauldron', { fit: { height: 1.1 }, at: { ...L(0, tz), y: 0.9, ry: 0 } }));
  // bồ đoàn trước bàn lễ
  for (const dx of [-2, 0, 2]) cyl(0.45, 0.5, 0.18, m.cushion, dx, 0.09, tz + 1.8, g, 20);
  // đèn lồng treo trên lối giữa
  const lan = []; for (let z = -hd + 6; z <= hd - 4; z += 5.5) for (const sx of [-1, 1]) { const w2 = L(sx * (colX - 1.6), z); lan.push({ x: w2.x, y: H - 4.2, z: w2.z, ry: 0, s: 1.1 }); addLight(w2.x, H - 3.8, w2.z, { color: '#ff9a4a', power: 1, room: r.id }); }
  const lanG = await instanceModel(root, 'lib_lantern.lod', lan);
  if (lanG) glowAll(lanG, { base: 1.2, night: 0.6, color: '#ff8a3c' });
  // ánh sáng nền trong điện (chiếu nhẹ tượng từ phía cửa)
  { const w2 = L(0, hd - 4); addLight(w2.x, H - 2, w2.z, { color: '#ffe0b0', power: 1.4, room: r.id }); }
  { const w2 = L(0, az + 2); addLight(w2.x, top + 6.5, w2.z, { color: '#ffd9a0', power: 1.6, room: r.id }); }
  addGlow(m.wax, { base: 0.8, night: 0.2, color: '#ff5a1e' });

  // NPC trong điện: Thầy Giải Quẻ ngồi bên bàn nhỏ
  if (r.npc === 'que') {
    const q = { x: -hw + 8.5, z: 1 };
    placeModel(g.parent, 'scholar_desk', { fit: { width: 2.6 }, at: { ...L(q.x + 0.2, q.z), y: 0, ry: Math.PI / 2 } });
    { const w2 = L(q.x, q.z); addBlock(w2.x, w2.z, 1.1); }
    createCharacter('master', { height: 1.85 }).then((ch) => {
      if (!ch) return;
      const w2 = L(q.x - 1.1, q.z); ch.obj.position.set(w2.x, 0.05, w2.z); ch.obj.rotation.y = Math.PI / 2; ch.setBase('sit');
      root.add(ch.obj); updaters.push((dt) => ch.update(dt));
    });
  }
}

/** Dựng mọi điện (một lần). Trả { root, update(dt) }. */
export function createInteriors(scene) {
  const root = new THREE.Group(); root.name = 'interiors'; scene.add(root);
  const updaters = [];
  for (const r of ROOMS) buildRoom(root, r, updaters).catch((e) => console.warn('[interior]', r.id, e));
  return { root, update(dt) { for (const u of updaters) u(dt); } };
}
