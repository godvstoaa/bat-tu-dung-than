// ============================================================================
//  NỘI THẤT ĐIỆN THỜ (world.js › ROOMS) — dựng thủ tục + tượng thần GLB (Meshy)
//  Sàn đá · tường sơn son · hàng cột đỏ chân vàng · xà vẽ · trần ô cờ · phướn treo ·
//  bàn thờ ba cấp phủ khăn đỏ · tượng thần · bàn lễ (nến + lư hương) · bồ đoàn · đèn lồng.
//  Va chạm: sàn = nền đi được (addPlatform), cột / bàn thờ / tượng = vật cản (addBlock).
//  Đèn: addLight(..., { room }) → render3d gán đèn điểm khi người chơi ở trong điện.
// ============================================================================
import * as THREE from 'three';
import { stoneMaterial } from './ground-tex.js';
import { ROOM_X0 as RXO, SKY_DISTRICT, SKY_Y } from './terrain.js';
import * as TX from './textures.js';
import { ROOMS, STATIONS, VAN_GATE_Z, VAN_STELE, worldToTile } from './world.js';
import { roof } from './models.js';
import { hasStation } from './features.js';
import { TAISUI_60 } from '../engine/taisui-general.js';
import { addBlock, addPlatform } from './obstacles.js';
import { addLight, glowAll, addGlow } from './lights.js';
import { placeModel, instanceModel, loadModel, warmObject } from './assets.js';
import { createCharacter } from './characters.js';

const M = {};
function mats() {
  if (M.ready) return M;
  M.floor = stoneMaterial({ seed: 41, rows: 8, repeat: [6, 6], base: '#6d665c', roughness: 0.85 });
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
  const lanG = await instanceModel(root, 'lib_lantern', lan);
  if (lanG) glowAll(lanG, { base: 1.2, night: 0.6, color: '#ff8a3c' });
  // ánh sáng nền trong điện (chiếu nhẹ tượng từ phía cửa)
  { const w2 = L(0, hd - 4); addLight(w2.x, H - 2, w2.z, { color: '#ffe0b0', power: 1.4, room: r.id }); }
  { const w2 = L(0, az + 2); addLight(w2.x, top + 6.5, w2.z, { color: '#ffd9a0', power: 1.6, room: r.id }); }
  addGlow(m.wax, { base: 0.8, night: 0.2, color: '#ff5a1e' });

  if (r.kind === 'vanmenh') buildVanMenh(g, r, m, L);
  if (r.kind === 'thaitue') buildThaiTue(g, r, m, L, az, top, aw, tz);

  // NPC trong điện: Thầy Giải Quẻ ngồi bên bàn nhỏ
  if (r.npc === 'que' || r.master) {
    const q = { x: -hw + (r.master ? 6.5 : 8.5), z: 1 };
    placeModel(g.parent, 'scholar_desk', { fit: { width: 2.6 }, at: { ...L(q.x + 0.2, q.z), y: 0, ry: Math.PI / 2 } });
    { const w2 = L(q.x, q.z); addBlock(w2.x, w2.z, 1.1); }
    createCharacter('master', {}).then((ch) => {
      if (!ch) return;
      const w2 = L(q.x - 1.1, q.z); ch.obj.position.set(w2.x, 0.05, w2.z); ch.obj.rotation.y = Math.PI / 2; ch.setBase('sit');
      root.add(ch.obj); updaters.push((dt) => ch.update(dt));
    });
  }
}

// ---------------------------------------------------------------------------
// Vận Mệnh Các: 9 cổng đại vận (biển can chi vẽ theo lá số người chơi) + bia ở lối vào
// ---------------------------------------------------------------------------
const HOOKS = { van: null, thaitue: null };
function canvasTex(w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return { c, g: c.getContext('2d'), t };
}
const TONE_COL = { cat: '#ffcf5a', thuan: '#ffb35c', binh: '#e8b070', nghich: '#c98a7a', hung: '#8fa8d8' };
function buildVanMenh(g, r, m, L) {
  const hd = r.d / 2;
  // lối đá giữa
  const slab = stoneMaterial({ seed: 52, rows: 3, repeat: [1, 18], base: '#8a8170', roughness: 0.85 });
  box(4.2, 0.06, r.d - 8, slab, 0, 0.03, 1, g);
  const gates = [];
  for (let i = 0; i < 9; i++) {
    const z = VAN_GATE_Z(i);
    const G = new THREE.Group(); G.position.set(0, 0, z); g.add(G);
    for (const sx of [-1, 1]) {
      cyl(0.26, 0.3, 5.2, m.col, sx * 2.9, 2.6, 0, G);
      cyl(0.5, 0.55, 0.4, m.gold, sx * 2.9, 0.2, 0, G);
      const w2 = L(sx * 2.9, z); addBlock(w2.x, w2.z, 0.42);
    }
    box(6.8, 0.42, 0.5, m.col, 0, 5.0, 0, G); box(6.0, 0.3, 0.4, m.col, 0, 4.25, 0, G);
    box(6.9, 0.08, 0.52, m.gold, 0, 5.24, 0, G, { shadow: false });
    const rf = roof(7.6, 1.6, 0.8, { upturn: 0.4 }); rf.position.y = 5.2; G.add(rf);
    // biển can chi (vẽ lại khi biết lá số)
    const P = canvasTex(256, 128);
    const plaqueMat = new THREE.MeshStandardMaterial({ map: P.t, emissive: '#ffffff', emissiveMap: P.t, emissiveIntensity: 0.25, roughness: 0.5 });
    const plaque = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), plaqueMat); plaque.position.set(0, 4.62, 0.27); G.add(plaque);
    // hai đèn lồng treo dưới xà — màu theo vận
    const lampMat = new THREE.MeshStandardMaterial({ color: '#c62a1c', emissive: '#ff8a3c', emissiveIntensity: 0.6, roughness: 0.6 });
    for (const sx of [-1, 1]) { const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 10), lampMat); s2.scale.y = 1.3; s2.position.set(sx * 1.9, 3.6, 0.1); G.add(s2); }
    const w2 = L(0, z + 0.6);
    const light = addLight(w2.x, 3.8, w2.z, { color: '#ffb35c', power: 0.6, room: r.id });
    gates.push({ P, plaqueMat, lampMat, light });
  }
  // bia đá ở lối vào
  const S = canvasTex(256, 512);
  const stele = new THREE.Group(); stele.position.set(VAN_STELE.x, 0, VAN_STELE.z); stele.rotation.y = Math.PI / 2; g.add(stele);
  box(1.6, 0.5, 0.9, m.dado, 0, 0.25, 0, stele);
  const face = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.6, 0.36), [m.dado, m.dado, m.dado, m.dado, new THREE.MeshStandardMaterial({ map: S.t, roughness: 0.7 }), m.dado]);
  face.position.y = 1.8; face.castShadow = true; stele.add(face);
  { const w2 = L(VAN_STELE.x, VAN_STELE.z); addBlock(w2.x, w2.z, 0.9); }
  drawStele(S, null);
  // bàn thờ cuối hành lang: chữ 命 lớn
  const M = canvasTex(256, 256); M.g.fillStyle = '#5a1410'; M.g.fillRect(0, 0, 256, 256); M.g.fillStyle = '#f2cf6a'; M.g.font = 'bold 200px serif'; M.g.textAlign = 'center'; M.g.textBaseline = 'middle'; M.g.fillText('命', 128, 140); M.t.needsUpdate = true;
  const ming = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), new THREE.MeshStandardMaterial({ map: M.t, emissive: '#ffffff', emissiveMap: M.t, emissiveIntensity: 0.35 }));
  ming.position.set(0, 4.6, -hd + 0.4); g.add(ming);

  HOOKS.van = (V) => {
    gates.forEach((G, i) => {
      const d = V?.gates?.[i];
      const cur = V && V.current === i, past = d && V.nowYear > d.endYear;
      drawPlaque(G.P, d, cur);
      const col = d ? (d.marks.some((x) => x.kind === 'golden') ? '#ffd24a' : d.marks.some((x) => x.kind === 'caution') ? '#7f9cd8' : TONE_COL[d.tone] || '#ffb35c') : '#ffb35c';
      G.lampMat.emissive.set(col); G.lampMat.emissiveIntensity = cur ? 2.4 : past ? 0.25 : 0.8;
      G.plaqueMat.emissiveIntensity = cur ? 0.9 : past ? 0.12 : 0.3;
      G.light.color = col; G.light.power = cur ? 2.6 : past ? 0.25 : 0.7;
    });
    drawStele(S, V);
  };
}
function drawPlaque(P, d, cur) {
  const { g, t } = P;
  g.fillStyle = cur ? '#8a1f12' : '#4a1410'; g.fillRect(0, 0, 256, 128);
  g.strokeStyle = '#e0b04a'; g.lineWidth = cur ? 10 : 6; g.strokeRect(5, 5, 246, 118);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = '#f6d77a'; g.font = 'bold 64px serif'; g.fillText(d ? d.ganZhi : '？', 128, 52);
  g.fillStyle = '#f3e6c8'; g.font = '22px sans-serif'; g.fillText(d ? `${d.ages.replace('t', ' tuổi')}` : 'nhập bát tự ở cổng', 128, 104);
  t.needsUpdate = true;
}
function drawStele(S, V) {
  const { g, t } = S;
  g.fillStyle = '#3b3530'; g.fillRect(0, 0, 256, 512);
  g.strokeStyle = '#a89270'; g.lineWidth = 6; g.strokeRect(10, 10, 236, 492);
  g.fillStyle = '#e8d9b0'; g.textAlign = 'center'; g.font = 'bold 44px serif'; g.fillText('運 命', 128, 70);
  g.font = '20px sans-serif';
  const lines = V ? [`Nhật chủ ${V.foundation.dmVi}`, V.foundation.strength, `Dụng ${V.foundation.yong}`, `Hỷ ${V.foundation.yongXi}`, '', V.current >= 0 ? `Đang đi: ${V.gates[V.current].ganZhi}` : 'Chưa vào đại vận', V.current >= 0 ? V.gates[V.current].ages.replace('t', ' tuổi') : ''] : ['Nhập bát tự', 'ở cổng quán', 'để khắc bia'];
  lines.forEach((l, i) => g.fillText(l, 128, 140 + i * 40));
  t.needsUpdate = true;
}

// ---------------------------------------------------------------------------
// Thái Tuế Điện: vách 60 bài vị (một tấm atlas) + bài vị trị niên lớn trên bàn thờ + đèn dầu an Thái Tuế
// ---------------------------------------------------------------------------
function buildThaiTue(g, r, m, L, az, top, aw, tz) {
  const hd = r.d / 2;
  const COLS = 12, ROWS = 5, CW = 96, CH = 192;
  const A = canvasTex(COLS * CW, ROWS * CH);
  // vách 60 bài vị: cao theo tỉ lệ atlas nhưng không tràn mái — clamp theo chiều cao phòng H
  // (phòng Thái Tuế w28 d24 h13: trần ở H, vách neo từ đáy + offset để đủ 5 hàng nhìn thấy)
  const wallW = r.w - 4;
  const wh = Math.min(wallW * (ROWS * CH) / (COLS * CW), r.h - 6.5);
  const yBase = top + 4.3; // mép đáy vách: offset trên mặt bàn thờ
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(wallW, wh), new THREE.MeshStandardMaterial({ map: A.t, emissive: '#ffffff', emissiveMap: A.t, emissiveIntensity: 0.18, roughness: 0.6 }));
  wall.position.set(0, yBase + wh / 2, -hd + 0.35); g.add(wall);
  const drawWall = (cur) => {
    const c = A.g;
    c.fillStyle = '#2a120e'; c.fillRect(0, 0, COLS * CW, ROWS * CH);
    TAISUI_60.forEach(([gz, name], k) => {
      const x = (k % COLS) * CW, y = Math.floor(k / COLS) * CH, on = k === cur;
      c.fillStyle = on ? '#c8961e' : '#7a1d14'; c.fillRect(x + 8, y + 8, CW - 16, CH - 16);
      c.strokeStyle = on ? '#fff0b0' : '#d0a24a'; c.lineWidth = on ? 5 : 2; c.strokeRect(x + 10, y + 10, CW - 20, CH - 20);
      c.fillStyle = on ? '#3a0c08' : '#f2d37a'; c.textAlign = 'center';
      c.font = 'bold 26px serif'; c.fillText(gz[0], x + CW / 2, y + 44); c.fillText(gz[1], x + CW / 2, y + 74);
      c.font = '22px serif'; [...name].forEach((ch, j) => c.fillText(ch, x + CW / 2, y + 112 + j * 26));
    });
    A.t.needsUpdate = true;
  };
  drawWall(-1);
  // bài vị trị niên lớn trên bàn thờ
  const B = canvasTex(256, 640);
  const tabletMat = new THREE.MeshStandardMaterial({ map: B.t, emissive: '#ffffff', emissiveMap: B.t, emissiveIntensity: 0.4, roughness: 0.4 });
  const tablet = new THREE.Group(); tablet.position.set(0, top, az - 0.4); g.add(tablet);
  box(1.9, 0.4, 0.8, m.gold, 0, 0.2, 0, tablet);
  const tb = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.75, 0.2), [m.altar, m.altar, m.altar, m.altar, tabletMat, m.altar]); tb.position.y = 2.3; tb.castShadow = true; tablet.add(tb);
  const cap = roof(2.2, 0.9, 0.5, { upturn: 0.3 }); cap.position.y = 4.2; tablet.add(cap);
  const drawTablet = (gz, name) => {
    const c = B.g; c.fillStyle = '#b8861c'; c.fillRect(0, 0, 256, 640);
    c.strokeStyle = '#5a1410'; c.lineWidth = 10; c.strokeRect(14, 14, 228, 612);
    c.fillStyle = '#4a0e08'; c.textAlign = 'center'; c.font = 'bold 54px serif';
    [...`${gz}太歲`].forEach((ch, j) => c.fillText(ch, 128, 90 + j * 62));
    c.font = 'bold 46px serif'; [...`${name}大將軍`].forEach((ch, j) => c.fillText(ch, 128, 360 + j * 52));
    B.t.needsUpdate = true;
  };
  drawTablet('', '');
  // hàng đèn dầu an Thái Tuế trước bàn lễ (sáng khi người chơi đã thắp năm nay)
  const lamps = [], flameMat = new THREE.MeshBasicMaterial({ color: '#ffcf6a' });
  for (let k = 0; k < 9; k++) {
    const x = (k - 4) * 0.46, z = tz + 0.6; // hàng trước lư hương, mép trước bàn lễ
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.09, 0.12, 14), m.gold); cup.position.set(x, 1.0, z); g.add(cup);
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), flameMat); f.scale.y = 1.9; f.position.set(x, 1.13, z); f.visible = false; g.add(f);
    lamps.push(f);
  }
  const lw = L(0, tz);
  const lampLight = addLight(lw.x, 1.8, lw.z, { color: '#ffb35c', power: 0, room: r.id });
  HOOKS.thaitue = (T) => {
    if (!T) return;
    drawWall(T.index - 1); drawTablet(T.ganZhi, T.nameShort);
    const n = T.lit ? Math.min(9, Math.max(1, T.days)) : 0;
    // thắp từ giữa ra hai bên — mỗi ngày thêm dầu sáng thêm một ngọn
    [4, 3, 5, 2, 6, 1, 7, 0, 8].forEach((k, j) => { lamps[k].visible = j < n; });
    lampLight.power = n ? 0.8 + n * 0.15 + (T.today ? 0.4 : 0) : 0;
  };
}

// ---------------------------------------------------------------------------
// [TRỜI] BIỆT THỰ TRÊN MÂY — phòng mẫu nội thất biệt thự quận đảo bay
// (docs/GAME-TROI-THIET-KE.md §4: room scene kiểu interior.js cho MỌI biệt thự,
// model villa ngoài đảo chỉ dựng vỏ + ô cửa; đạo cụ lấy từ bộ lib_noi_that).
// 4 phòng mẫu theo 4 loại villa (dien_dai / lau_cac·thư các / thien_dan / tieu_quan):
//   · villa_daisanh  «Biệt Thự Trên Mây»   — bình phong rồng sau án thư + lư bạc sơn (Đại Sảnh)
//   · villa_thuca    «Thư Các Trời»        — giá thư lib_bookshelf + án thư đọc sách
//   · villa_thiendan «Thiền Điện Trên Mây» — bồ đoàn ×6 quanh đỉnh trầm
//   · villa_tieuquan «Tiểu Quán Trên Mây»  — án nhỏ + bồ đoàn + ấm trà
// Đạo cụ thật trong public/models/lib_noi_that.glb (đã kiểm file, 5 node):
//   nt_anthu · nt_binhphongluarong · nt_den_long_lon · nt_lubacson · bồ đoàn (node không tên, mesh nt_bodoan).
// Phòng đặt dải ROOM_X0 hàng z = 0 (tiếp hàng điện thờ, không đụng lưới phòng z ≤ −230);
// CỬA ngoài đảo khai floorY = SKY_Y (460) — khớp cổng tầng §5.7 world.js › stationFloorOf
// (|cao người − floorY| < 30): người dưới đảo không mở nhầm cửa, người trên đảo vào được.
// ---------------------------------------------------------------------------
const VILLA_Y = SKY_Y; // mặt nền quận đảo bay (terrain.js › SKY_Y — cùng cao độ mọi đảo, doc §1.1/§6.4)
const VM = {};
function vmats() {
  if (VM.ready) return VM;
  VM.floor = stoneMaterial({ seed: 61, rows: 6, repeat: [5, 5], base: '#8a6a44', roughness: 0.75 }); // ván gỗ sẫm
  VM.wall = new THREE.MeshStandardMaterial({ color: '#b8b2a6', roughness: 0.92 });                   // tường vôi (tieu_quan §2.5)
  VM.dado = new THREE.MeshStandardMaterial({ color: '#6b4a2f', roughness: 0.7 });                    // chân tường gỗ
  VM.col = new THREE.MeshStandardMaterial({ map: TX.lacquerTex('#7d3b28', { seed: 8, gold: 0.08 }), roughness: 0.5 }); // cột gỗ son nhạt
  VM.beam = new THREE.MeshStandardMaterial({ color: '#4a3b2c', roughness: 0.6 });
  VM.ceil = new THREE.MeshStandardMaterial({ map: TX.panelTex(63), roughness: 0.8 });                // trần ván khung mây
  VM.cloth = new THREE.MeshStandardMaterial({ color: '#3f6f7a', roughness: 0.9, side: THREE.DoubleSide }); // khăn bàn màu trời
  VM.gold = new THREE.MeshStandardMaterial({ color: '#d4a63c', roughness: 0.32, metalness: 0.85 });
  VM.cushion = new THREE.MeshStandardMaterial({ color: '#5a8a6a', roughness: 0.95 });
  VM.ready = true;
  return VM;
}

// Bộ đạo cụ lib_noi_that: mỗi món 1 node GLB — nạp 1 lần,.clone() theo vị trí (placeProp).
const NT = new Map();
async function ntProps() {
  if (NT.size || NT.get('_none')) return NT;
  const g = await loadModel('lib_noi_that');
  if (!g) { NT.set('_none', true); return NT; }
  g.scene.updateMatrixWorld(true);
  for (const o of g.scene.children) {
    const key = ['nt_anthu', 'nt_binhphongluarong', 'nt_den_long_lon', 'nt_lubacson'].includes(o.name) ? o.name : 'nt_bodoan';
    NT.set(key, o);
  }
  return NT;
}
/** Đặt một đạo cụ theo tên node (fit/at khuôn placeModel: co giãn theo trục, đáy chạm at.y). */
async function placeProp(parent, key, { fit = { max: 1 }, at = { x: 0, y: 0, z: 0, ry: 0 } } = {}) {
  await ntProps();
  const src = NT.get(key);
  if (!src) return null;
  const obj = src.clone(true);
  obj.rotation.y = at.ry || 0;
  obj.updateMatrixWorld(true);
  const b0 = new THREE.Box3().setFromObject(obj);
  const size = b0.getSize(new THREE.Vector3());
  const [k, v] = Object.entries(fit)[0];
  const ref = k === 'height' ? size.y : k === 'width' ? size.x : k === 'depth' ? size.z : Math.max(size.x, size.y, size.z);
  obj.scale.multiplyScalar(v / (ref || 1));
  obj.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(obj);
  obj.position.add(new THREE.Vector3(at.x - (b.min.x + b.max.x) / 2, at.y - b.min.y, at.z - (b.min.z + b.max.z) / 2));
  obj.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  await warmObject(obj);
  parent.add(obj);
  return obj;
}

/** Vỏ phòng biệt thự: sàn gỗ + tường vôi + cột gỗ + trần ván + ô cửa giữa (như buildRoom nhưng không bàn thờ). */
function villaShell(g, r, m, L) {
  const W = r.w, D = r.d, H = r.h, hw = W / 2, hd = D / 2;
  addPlatform(r.origin.x, r.origin.z, W - 1.2, D - 1.2, 0, 0);
  box(W + 0.8, 0.4, D + 0.8, m.floor, 0, -0.2, 0, g);
  const wallT = 0.5;
  for (const [w, d, x, z] of [[W, wallT, 0, -hd], [wallT, D, -hw, 0], [wallT, D, hw, 0]]) { box(w, H, d, m.wall, x, H / 2, z, g); box(w + 0.05, 1.0, d + 0.05, m.dado, x, 0.5, z, g); }
  const gap = 4.2, side = (W - gap) / 2;
  for (const sx of [-1, 1]) { box(side, H, wallT, m.wall, sx * (gap / 2 + side / 2), H / 2, hd, g); box(side, 1.0, wallT + 0.05, m.dado, sx * (gap / 2 + side / 2), 0.5, hd, g); }
  box(gap, H - 3.2, wallT, m.wall, 0, 3.2 + (H - 3.2) / 2, hd, g);
  // ô cửa sổ lưới gỗ hai bên hông (bắt sáng như thư các §2.3)
  for (const sx of [-1, 1]) for (let z = -hd + 3; z <= hd - 3; z += 4) box(0.1, 2.4, 2.0, m.ceil, sx * (hw - 0.3), 3.0, z, g);
  box(W, 0.45, D, m.ceil, 0, H + 0.22, 0, g);
  for (let z = -hd + 2.6; z < hd; z += 3.0) box(W - 0.5, 0.5, 0.4, m.beam, 0, H - 0.55, z, g);
  const colX = hw - 2.6;
  for (let z = -hd + 4; z <= hd - 4; z += 5) for (const sx of [-1, 1]) {
    cyl(0.34, 0.38, H - 0.5, m.col, sx * colX, (H - 0.5) / 2, z, g);
    const w2 = L(sx * colX, z); addBlock(w2.x, w2.z, 0.62);
  }
}

/** Bàn gỗ nhỏ (bàn trà / án phụ) + ấm + chén — thuần procedural. */
function teaTable(g, m, L, x, z) {
  box(2.2, 0.1, 1.1, m.dado, x, 0.72, z, g);
  for (const [dx, dz] of [[-0.95, -0.42], [0.95, -0.42], [-0.95, 0.42], [0.95, 0.42]]) box(0.12, 0.72, 0.12, m.beam, x + dx, 0.36, z + dz, g);
  cyl(0.16, 0.2, 0.26, m.gold, x - 0.4, 0.9, z, g, 12);
  for (const dx of [0.25, 0.55]) cyl(0.07, 0.05, 0.07, m.cloth, x + dx, 0.8, z, g, 10);
  const w2 = L(x, z); addBlock(w2.x, w2.z, 1.1);
}

async function buildVillaRoom(root, r, updaters) {
  const m = vmats();
  const g = new THREE.Group(); g.name = `room-${r.id}`; g.position.set(r.origin.x, 0, r.origin.z); root.add(g);
  const hd = r.d / 2, hw = r.w / 2, H = r.h;
  const L = (x, z) => ({ x: r.origin.x + x, z: r.origin.z + z });
  villaShell(g, r, m, L);

  if (r.kind === 'villa_daisanh') {
    // Đại Sảnh: bệ 2 cấp — bình phong rồng sau án thư + lư bạc sơn trên án (doc §4 «án thư + lư + bình phong sau ngai»)
    const az = -hd + 3.4;
    box(10, 0.4, 3.6, m.dado, 0, 0.2, az, g); box(8, 0.4, 3.0, m.floor, 0, 0.6, az, g);
    const bp = await placeProp(g, 'nt_binhphongluarong', { fit: { height: 2.8 }, at: { x: 0, y: 1.0, z: az - 1.4, ry: 0 } });
    if (bp) { for (const dx of [-1.1, 1.1]) { const w2 = L(dx, az - 1.4); addBlock(w2.x, w2.z, 0.8); } }
    const anthu = await placeProp(g, 'nt_anthu', { fit: { height: 1.05 }, at: { x: 0, y: 1.0, z: az + 0.2, ry: 0 } });
    if (anthu) { const w2 = L(0, az + 0.2); addBlock(w2.x, w2.z, 1.3); }
    await placeProp(g, 'nt_lubacson', { fit: { height: 0.5 }, at: { x: 0, y: 2.05, z: az + 0.1, ry: 0 } });
    for (const dx of [-1.8, 1.8]) await placeProp(g, 'nt_bodoan', { fit: { height: 0.16 }, at: { x: dx, y: 0, z: az + 2.6, ry: 0 } });
    teaTable(g, m, L, hw - 4.4, 2.2);
    for (const sx of [-1, 1]) { // đèn lồng lớn bộ noi_that treo đầu bệ
      const dx = sx * 3.6;
      box(0.05, 1.2, 0.05, m.beam, dx, H - 2.2, az + 2.2, g);
      const dn = await placeProp(g, 'nt_den_long_lon', { fit: { height: 1.1 }, at: { x: dx, y: H - 3.4, z: az + 2.2, ry: 0 } });
      if (dn) glowAll(dn, { base: 1.1, night: 0.6, color: '#ff8a3c' });
      const w2 = L(dx, az + 2.2); addLight(w2.x, H - 2.6, w2.z, { color: '#ffb35c', power: 1.1, room: r.id });
    }
    const c = L(0, az + 1.2); addLight(c.x, 4.4, c.z, { color: '#ffe0b0', power: 1.5, room: r.id });
  }

  if (r.kind === 'villa_thuca') {
    // Thư Các: giá thư lib_bookshelf quanh tường bắc + tây, án thư giữa phòng
    for (const [x, z, ry] of [[-4.4, -hd + 1.35, 0], [0, -hd + 1.35, 0], [4.4, -hd + 1.35, 0], [-hw + 1.35, -2.2, Math.PI / 2], [-hw + 1.35, 2.2, Math.PI / 2]]) {
      const w2 = L(x, z);
      placeModel(g.parent, 'lib_bookshelf', { fit: { width: 2.4 }, at: { x: w2.x, y: 0, z: w2.z, ry } });
      addBlock(w2.x, w2.z, 1.15);
    }
    const anthu = await placeProp(g, 'nt_anthu', { fit: { height: 1.0 }, at: { x: 1.6, y: 0, z: -hd + 4.4, ry: Math.PI / 4 } });
    if (anthu) { const w2 = L(1.6, -hd + 4.4); addBlock(w2.x, w2.z, 1.2); }
    for (const [dx, dz] of [[-1.6, -hd + 4.9], [-2.6, -hd + 3.9]]) await placeProp(g, 'nt_bodoan', { fit: { height: 0.16 }, at: { x: dx, y: 0, z: dz, ry: 0 } });
    teaTable(g, m, L, hw - 3.4, 0.4);
    const lan = []; for (const z of [-hd + 4, -hd + 8, -hd + 12]) for (const sx of [-1, 1]) { const w2 = L(sx * (hw - 2.2), z); lan.push({ x: w2.x, y: H - 1.7, z: w2.z, ry: 0, s: 0.9 }); addLight(w2.x, H - 1.4, w2.z, { color: '#ff9a4a', power: 0.8, room: r.id }); }
    const lanG = await instanceModel(root, 'lib_lantern', lan);
    if (lanG) glowAll(lanG, { base: 1.0, night: 0.6, color: '#ff8a3c' });
    const c = L(0, 0); addLight(c.x, H - 1.5, c.z, { color: '#ffe8c0', power: 1.3, room: r.id });
  }

  if (r.kind === 'villa_thiendan') {
    // Thiền Điện: đỉnh trầm trên bệ tròn giữa phòng + bồ đoàn ×6 vòng cung (doc §4 «bồ đoàn ×6 + đỉnh trầm»)
    const cz = -hd + 4.6;
    cyl(2.3, 2.5, 0.36, m.dado, 0, 0.18, cz, g, 28);
    cyl(1.6, 1.75, 0.3, m.floor, 0, 0.5, cz, g, 24);
    const Lu = await placeProp(g, 'nt_lubacson', { fit: { height: 0.9 }, at: { x: 0, y: 0.66, z: cz, ry: 0 } });
    if (Lu) { const w2 = L(0, cz); addBlock(w2.x, w2.z, 2.4); }
    for (let k = 0; k < 6; k++) {
      const dx = (k - 2.5) * 1.35, dz = cz + 3.3 - Math.abs(k - 2.5) * 0.42;
      await placeProp(g, 'nt_bodoan', { fit: { height: 0.16 }, at: { x: dx, y: 0, z: dz, ry: Math.PI } });
    }
    teaTable(g, m, L, hw - 3.2, hd - 2.6);
    for (const sx of [-1, 1]) {
      const dx = sx * (hw - 3);
      box(0.05, 1.1, 0.05, m.beam, dx, H - 1.9, cz + 1.4, g);
      const dn = await placeProp(g, 'nt_den_long_lon', { fit: { height: 0.95 }, at: { x: dx, y: H - 2.9, z: cz + 1.4, ry: 0 } });
      if (dn) glowAll(dn, { base: 1.0, night: 0.6, color: '#ff8a3c' });
      const w2 = L(dx, cz + 1.4); addLight(w2.x, H - 2.2, w2.z, { color: '#ffb35c', power: 1.0, room: r.id });
    }
    const c = L(0, cz + 2.4); addLight(c.x, 3.2, c.z, { color: '#ffe0c0', power: 1.2, room: r.id });
  }

  if (r.kind === 'villa_tieuquan') {
    // Tiểu Quán: gian nhỏ — án thấp + hai bồ đoàn + ấm trà (tieu_quan §2.5, sàn nhô hiên)
    const az = -hd + 2.7;
    const anthu = await placeProp(g, 'nt_anthu', { fit: { height: 0.9 }, at: { x: -2.4, y: 0, z: az, ry: 0 } });
    if (anthu) { const w2 = L(-2.4, az); addBlock(w2.x, w2.z, 1.1); }
    cyl(0.14, 0.18, 0.24, m.gold, -2.4, 1.02, az, g, 12);
    for (const [dx, dz] of [[1.6, az + 0.4], [2.9, az - 0.8]]) await placeProp(g, 'nt_bodoan', { fit: { height: 0.16 }, at: { x: dx, y: 0, z: dz, ry: 0 } });
    teaTable(g, m, L, 2.6, hd - 2.4);
    box(0.05, 1.0, 0.05, m.beam, 0, H - 1.7, az + 1.6, g);
    const dn = await placeProp(g, 'nt_den_long_lon', { fit: { height: 0.85 }, at: { x: 0, y: H - 2.6, z: az + 1.6, ry: 0 } });
    if (dn) glowAll(dn, { base: 1.0, night: 0.6, color: '#ff8a3c' });
    const c = L(0, az + 1.6); addLight(c.x, H - 1.9, c.z, { color: '#ffb35c', power: 0.9, room: r.id });
    const c2 = L(0, 0); addLight(c2.x, H - 1.2, c2.z, { color: '#ffe8c0', power: 0.9, room: r.id });
  }
}

// 4 phòng mẫu — CỬA neo THEO VỎ VILLA landmarks.js đã đặt trên đảo (không phải tâm đảo):
//   · thienban: lib_dien_dai tại (−170,−40) quay về tâm (landmarks.js:190), bậc chính diện phía đó;
//     cửa đặt trên trục mặt tiền, trước cụm đạo cụ (−150,−25) 13,5 m → không đứng chồng đạo cụ.
//   · thudao: lib_lau_cac s×0.8 đặt ngay tâm đảo quay về đảo chủ → cửa trên trục mặt tiền ~11,5 m.
//   · thiendan: lib_thien_dan tâm đảo, bậc chính diện phía đảo chủ → cửa trên trục ~26 m (sau 9 bậc).
//   · thienquan: 3 thảo lư vòng cung r32 quanh tâm; cửa trước thảo lư k=2 (góc 150°) ~7,5 m.
const skyIsland = (id) => SKY_DISTRICT.find((s) => s.id === id) || { x: 0, z: 0 };
const doorOn = (id, dx, dz) => { const s = skyIsland(id); return { x: s.x + dx, z: s.z + dz }; };
export const VILLA_ROOMS = [
  { id: 'villa_daisanh', name: 'Biệt Thự Trên Mây', region: 'troi', kind: 'villa_daisanh', door: doorOn('thienban', -139, -33), origin: { x: RXO + 745, z: 0 }, w: 30, d: 24, h: 11, deities: [],
    desk: { id: 'villa_tra', name: 'Bàn Trà Trên Mây', verb: 'Pha trà ngắm mây', x: 10.6, z: 2.2 } },
  { id: 'villa_thuca', name: 'Thư Các Trời', region: 'troi', kind: 'villa_thuca', door: doorOn('thudao', 10, 6), origin: { x: RXO + 845, z: 0 }, w: 18, d: 16, h: 9, deities: [],
    desk: { id: 'villa_anthu', name: 'Án Thư Trên Mây', verb: 'Ngồi đọc sách', x: 5.6, z: -3.6 } },
  { id: 'villa_thiendan', name: 'Thiền Điện Trên Mây', region: 'troi', kind: 'villa_thiendan', door: doorOn('thiendan', 2, -26), origin: { x: RXO + 955, z: 0 }, w: 20, d: 16, h: 9, deities: [],
    desk: { id: 'villa_thien', name: 'Bồ Đoàn Thiền', verb: 'Tọa thiền một lát', x: 6.8, z: 5.4 } },
  { id: 'villa_tieuquan', name: 'Tiểu Quán Trên Mây', region: 'troi', kind: 'villa_tieuquan', door: doorOn('thienquan', -21, 12), origin: { x: RXO + 1045, z: 0 }, w: 13, d: 10, h: 6, deities: [],
    desk: { id: 'villa_may', name: 'Cửa Sổ Mây', verb: 'Ngắm mây', x: 3.9, z: 2.6 } },
];

// Đăng ký phòng + trạm theo đúng khuôn world.js (door_/exit_ :104-105, desk :106) — world.js không
// thuộc phạm vi file được sửa đợt này nên nội thất tự đăng ký vào ROOMS/STATIONS (biến mảng export).
for (const r of VILLA_ROOMS) {
  ROOMS.push(r);
  const doorT = worldToTile(r.door.x, r.door.z);
  const inside = worldToTile(r.origin.x, r.origin.z + r.d / 2 - 3.2);
  const exitW = { x: r.origin.x, z: r.origin.z + r.d / 2 - 1.2 };
  const exitT = worldToTile(exitW.x, exitW.z);
  STATIONS.push(
    { id: `door_${r.id}`, kind: 'door', room: r.id, name: r.name, verb: `Vào ${r.name}`, block: [], world: { x: r.door.x, z: r.door.z, y: VILLA_Y }, floorY: VILLA_Y, spot: { x: doorT.x, y: doorT.y + 1.2 }, label: doorT, to: inside },
    { id: `exit_${r.id}`, kind: 'exit', room: r.id, name: 'Cửa phòng', verb: 'Ra khỏi phòng', block: [], world: exitW, spot: exitT, label: exitT, to: { x: doorT.x, y: doorT.y + 2.2 }, toY3: VILLA_Y, floorY: 0 }, // toY3: đích là mép ĐẢO BAY — main.js phải đặt y3=460, probe terrain sẽ thả người xuống phố dưới đảo
  );
  if (r.desk) {
    const q = { x: r.origin.x + r.desk.x, z: r.origin.z + r.desk.z }, t = worldToTile(q.x, q.z);
    STATIONS.push({ id: r.desk.id, kind: 'desk', room: r.id, name: r.desk.name, verb: r.desk.verb, block: [], world: q, floorY: 0, spot: worldToTile(q.x + 1.4, q.z), label: t });
  }
}

/** Dựng mọi điện — LƯỜI: lần đầu người chơi vào dải phòng phía Đông (ensure) mới dựng và nạp tượng thần
 *  (2026-11-10: trước đây dựng ngay khi mở game → ~6 MB GLB tượng / điện trên màn nạp dù chưa vào điện nào).
 *  Trả { root, ensure(), update(dt), setData({ van, thaitue }) }. */
export function createInteriors(scene) {
  const root = new THREE.Group(); root.name = 'interiors'; scene.add(root);
  const updaters = [];
  let built = false;
  const ensure = () => {
    if (built) return; built = true;
    for (const r of ROOMS) {
      if (!hasStation(`door_${r.id}`)) continue;
      // [TRỜI] phòng biệt thự (villa_*) dựng bằng vỏ + đạo cụ lib_noi_that, không phải bàn thờ điện
      const build = String(r.kind || '').startsWith('villa') ? buildVillaRoom : buildRoom;
      build(root, r, updaters).catch((e) => console.warn('[interior]', r.id, e));
    }
  };
  let pending = null;
  const apply = () => {
    if (!pending) return;
    if (pending.van !== undefined && HOOKS.van) { HOOKS.van(pending.van); delete pending.van; }
    if (pending.thaitue !== undefined && HOOKS.thaitue) { HOOKS.thaitue(pending.thaitue); delete pending.thaitue; }
  };
  return {
    root,
    ensure,
    update(dt) { for (const u of updaters) u(dt); apply(); },
    // dữ liệu cá nhân (lá số người chơi, Thái Tuế năm nay) → vẽ biển cổng, bia, bài vị, đèn
    setData(d) { pending = { ...(pending || {}), ...d }; apply(); },
  };
}
