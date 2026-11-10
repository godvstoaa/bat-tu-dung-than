// ============================================================================
//  BỘ KIẾN TRÚC THEO PHONG CÁCH (three.js, thủ tục, nhẹ) — nhà, mái, tường rào, cổng, mặt nước, cây cho 16 phong
//  cách biệt phủ + 8 phong cách khu biệt thự (estate-layout.STYLES):
//   · Á Đông: cung đình (mái cong ngói lưu ly), Huế (mái ngói âm dương thấp), Nhật (irimoya mái xám thấp rộng),
//     Giang Nam (tường vôi ngói đen), Hanok, Thái (mái dốc nhiều tầng viền vàng), Bali (mái tranh chóp);
//   · Tây: Moorish / Địa Trung Hải (vòm cung, tường trắng), Tuscan (mái ngói đất nung), Palladio (hàng cột, trán tường,
//     mái vòm), lâu đài Pháp (mái mansard, tháp tròn), Tudor (khung gỗ, mái dốc); Mughal (vòm củ hành, chhatri);
//   · Hiện đại: hộp kính, khối trắng đua ra, mái bằng, lam gỗ.
//  Hàm trả THREE.Group cục bộ (cửa +z); mansion3d.js gộp theo vật liệu (models.mergeStatic).
// ============================================================================
import * as THREE from 'three';
import * as MD from './models.js';
import { kit, hall, gateHouse, plinth as plinthG, pond, rockery, tree as treeA, stoneLantern } from './archkit.js';

const Q = Math.PI / 2;
const STYLES_NAME = { cungdinh: 'Cung Đình Trung Hoa', hue: 'Phủ Đệ Huế', thai: 'Cung Điện Thái Lan' };
const std = (o) => new THREE.MeshStandardMaterial(o);
const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; };
/** hình học tự dựng → có index + uv (để models.mergeStatic gộp được) */
function fin(geo) {
  if (!geo.index) { const n = geo.attributes.position.count; geo.setIndex([...Array(n).keys()]); }
  if (!geo.attributes.uv) geo.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
  geo.computeVertexNormals(); return geo;
}
function uvM(geo, sc = 3.5) {
  const p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) { const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)); uv.setXY(i, (ax > 0.5 ? p.getZ(i) : p.getX(i)) / sc, (ay > 0.5 ? p.getZ(i) : p.getY(i)) / sc); }
  uv.needsUpdate = true; return geo;
}
const mesh = (geo, mat, x = 0, y = 0, z = 0, ry = 0) => { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); o.rotation.y = ry; o.castShadow = true; o.receiveShadow = true; return o; };
const box = (w, h, d, mat, x, y, z, ry = 0, sc = 0) => { const g = new THREE.BoxGeometry(w, h, d); if (sc) uvM(g, sc); return mesh(g, mat, x, y, z, ry); };
const cyl = (r1, r2, h, mat, x, y, z, seg = 12) => mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat, x, y, z);

// --- vật liệu theo phong cách (mặt tiền có cửa sổ vẽ sẵn, lặp mỗi 3,5 m)
const SM = new Map();
export function styleMats(S) {
  if (SM.has(S.name)) return SM.get(S.name);
  const arch = !!S.arches, timber = !!S.timber;
  const facade = tex(256, 256, (g, w, h) => {
    g.fillStyle = S.wall; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(80,60,40,${Math.random() * 0.05})`; g.fillRect(Math.random() * w, Math.random() * h, 3, 3); }
    if (timber) { g.strokeStyle = S.trim; g.lineWidth = 14; g.strokeRect(0, 0, w, h); g.beginPath(); g.moveTo(0, h); g.lineTo(w * 0.3, h * 0.45); g.moveTo(w, h); g.lineTo(w * 0.7, h * 0.45); g.moveTo(0, h * 0.42); g.lineTo(w, h * 0.42); g.stroke(); }
    g.fillStyle = S.trim; g.fillRect(0, h - 10, w, 10); // gờ tầng
    const wx = w * 0.32, ww = w * 0.36, wy = h * 0.22, wh = h * 0.5;
    g.fillStyle = S.trim; g.fillRect(wx - 8, wy - 8, ww + 16, wh + 16);
    g.fillStyle = '#2c3a46';
    if (arch) { g.beginPath(); g.moveTo(wx, wy + wh); g.lineTo(wx, wy + ww / 2); g.arc(wx + ww / 2, wy + ww / 2, ww / 2, Math.PI, 0); g.lineTo(wx + ww, wy + wh); g.fill(); }
    else g.fillRect(wx, wy, ww, wh);
    g.strokeStyle = S.trim; g.lineWidth = 5; g.beginPath(); g.moveTo(wx + ww / 2, wy); g.lineTo(wx + ww / 2, wy + wh); g.moveTo(wx, wy + wh * 0.45); g.lineTo(wx + ww, wy + wh * 0.45); g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(wx + 4, wy + 4, ww * 0.2, wh * 0.4);
  });
  const M = {
    facade: std({ map: facade, roughness: 0.85 }),
    wall: std({ color: S.wall, roughness: 0.9 }),
    trim: std({ color: S.trim, roughness: 0.6 }),
    roof: std({ color: S.roofCol, roughness: 0.75, flatShading: true }),
    glass: std({ color: '#9fc2d6', roughness: 0.05, metalness: 0.6, transparent: true, opacity: 0.55 }),
    wood: std({ color: '#8a6440', roughness: 0.7 }),
    gold: std({ color: '#d9a441', roughness: 0.3, metalness: 0.8 }),
    straw: std({ color: '#a8874e', roughness: 1, flatShading: true }),
    marble: std({ color: '#f6f3ec', roughness: 0.35 }),
  };
  SM.set(S.name, M);
  return M;
}

// --- mái
const hipGeo = (W, D, H, top = 0.08) => { const g = new THREE.CylinderGeometry(top * Math.SQRT1_2, Math.SQRT1_2, 1, 4, 1); g.rotateY(Math.PI / 4); g.scale(W, H, D); g.translate(0, H / 2, 0); return g; };
function gableGeo(W, D, H) {
  const s = new THREE.Shape(); s.moveTo(-D / 2, 0); s.lineTo(D / 2, 0); s.lineTo(0, H); s.lineTo(-D / 2, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: W, bevelEnabled: false }); g.rotateY(Q); g.translate(-W / 2, 0, 0); return fin(g);
}
function onionGeo(R, H) {
  const pts = []; for (let i = 0; i <= 14; i++) { const t = i / 14, r = R * Math.sin(Math.PI * Math.min(1, t * 1.25)) * (1 - t * 0.5) + (t > 0.85 ? 0 : 0); pts.push(new THREE.Vector2(Math.max(0.02, t < 0.95 ? r : 0.02), t * H)); }
  return new THREE.LatheGeometry(pts, 16);
}
function roofFor(S, M, W, D, y0, kind = S.roof) {
  const g = new THREE.Group();
  const add = (geo, mat, y = y0) => { const o = mesh(geo, mat, 0, y, 0); g.add(o); return o; };
  if (kind === 'hip') add(hipGeo(W + 1.6, D + 1.6, Math.min(W, D) * 0.32), M.roof);
  else if (kind === 'gable') { add(gableGeo(W + 1, D + 1.2, D * 0.62), M.roof); }
  else if (kind === 'mansard') { add(hipGeo(W + 0.6, D + 0.6, 3.6, 0.78), M.roof); add(hipGeo(W * 0.78, D * 0.78, 1.4, 0.2), M.roof, y0 + 3.6); }
  else if (kind === 'thatch') add(hipGeo(W + 3, D + 3, Math.max(W, D) * 0.55, 0.02), M.straw);
  else if (kind === 'thai') {
    add(gableGeo(W + 2.4, D + 2.6, D * 0.9), M.roof); add(gableGeo(W * 0.72, D * 0.7, D * 0.9), M.roof, y0 + D * 0.42);
    for (const sx of [-1, 1]) g.add(box(0.25, D * 0.9, 0.25, M.gold, sx * (W / 2 + 1.2), y0 + D * 0.45, 0));
    g.add(box(W + 2.6, 0.18, 0.2, M.gold, 0, y0 + D * 0.9 + 0.1, 0));
  } else if (kind === 'flat') { g.add(box(W + 0.8, 0.45, D + 0.8, M.trim, 0, y0 + 0.22, 0)); g.add(box(W + 0.8, 0.9, 0.25, M.wall, 0, y0 + 0.9, D / 2 + 0.28)); }
  return g;
}

/** vách bốn mặt có khe cửa trước (và sau): mat mặt trước/sau, sideMat hai bên */
function wallsDoor(g, w, d, h, y0, mat, sideMat, back, doorW = 2.4) {
  const dh = Math.min(3, h - 0.3), t = 0.28;
  for (const sz of back ? [1, -1] : [1]) {
    const side = (w - doorW) / 2;
    for (const sx of [-1, 1]) g.add(box(side, h, t, mat, sx * (doorW / 2 + side / 2), y0 + h / 2, sz * d / 2, 0, 3.5));
    g.add(box(doorW, h - dh, t, mat, 0, y0 + dh + (h - dh) / 2, sz * d / 2, 0, 3.5));
  }
  if (!back) g.add(box(w, h, t, mat, 0, y0 + h / 2, -d / 2, 0, 3.5));
  for (const sx of [-1, 1]) g.add(box(t, h, d, sideMat, sx * w / 2, y0 + h / 2, 0, 0, 3.5));
}

/**
 * Nhà theo phong cách. b: { w, d, h, floors, plinth, back } (cửa +z). Trả { base, shell }.
 */
export function styledBuilding(S, b, { villa = false } = {}) {
  const k = kit(), M = styleMats(S);
  if (S.fam === 'asian') {
    // mái / vách / cột theo biến thể Á Đông
    const roof = S.roof === 'curved' ? (S.roofCol.startsWith('#6') ? 'green' : 'grey') : 'grey';
    const { base, shell } = hall({ w: b.w, d: b.d, h: Math.min(b.h, b.floors > 1 ? b.h : 6.2), plinth: b.plinth, back: b.back, storeys: b.floors > 1 ? 2 : 1, roof });
    if (S.roof !== 'curved') {
      // thay mái cong mặc định bằng mái đúng kiểu
      shell.children.filter((c) => c.isGroup && c.position.y > b.plinth + 1 && c.children.length > 4).forEach((c) => shell.remove(c));
      const y0 = b.plinth + b.h;
      if (S.roof === 'vn') { const R = MD.roof(b.w + 3.2, b.d + 3.2, Math.max(2, b.d * 0.3), { upturn: 0.22, mats: { ...k, roof: M.roof } }); R.position.y = y0; shell.add(R); }
      else if (S.roof === 'irimoya') { const R = MD.roof(b.w + 4.2, b.d + 4.2, Math.max(1.8, b.d * 0.24), { upturn: 0.08, mats: { ...k, roof: M.roof } }); R.position.y = y0; shell.add(R); }
      else shell.add(roofFor(S, M, b.w, b.d, y0));
    }
    // cột gỗ sẫm (Nhật, Hàn, Giang Nam, Bali) thay cột sơn son cung đình
    if (!['cungdinh', 'hue', 'thai'].some((id) => S.name === STYLES_NAME[id])) shell.traverse((o) => { if (o.isMesh && o.material === k.son) o.material = M.trim; });
    return { base, shell };
  }
  const base = plinthG({ w: b.w - 2.2, d: b.d - 2.2, h: Math.max(0.15, b.plinth), back: b.back, stairW: Math.min(6, b.w * 0.3) });
  const shell = new THREE.Group(), y0 = Math.max(0.15, b.plinth), fh = 4.2, floors = b.floors || 1, H = floors * fh;
  base.add(box(b.w - 0.2, 0.05, b.d - 0.2, k.floor, 0, y0 + 0.03, 0, 0, 2));
  if (S.fam === 'modern') {
    // tầng trệt kính (khe cửa), tầng trên khối đặc đua ra 2 m phía trước, mái bằng đua
    wallsDoor(shell, b.w, b.d, fh, y0, M.glass, M.glass, b.back);
    for (let f = 1; f < floors; f++) { shell.add(box(b.w, fh, b.d + 2.2, M.wall, 0, y0 + f * fh + fh / 2, 1.1)); shell.add(box(b.w * 0.6, fh * 0.55, 0.06, M.glass, 0, y0 + f * fh + fh * 0.5, b.d / 2 + 2.25)); }
    shell.add(box(b.w + 1.6, 0.35, b.d + 3.2, M.trim, 0, y0 + H + 0.18, 0.6));
    if (S.louver) for (let x = -b.w / 2 + 0.4; x <= b.w / 2 - 0.4; x += 0.7) shell.add(box(0.12, H - 0.4, 0.12, M.wood, x, y0 + H / 2, b.d / 2 + 2.3));
    return { base, shell };
  }
  // Tây / Mughal: thân tường mặt tiền vẽ cửa sổ + gờ tầng + mái
  wallsDoor(shell, b.w, b.d, H, y0, M.facade, M.facade, b.back);
  for (let f = 1; f <= floors; f++) shell.add(box(b.w + 0.3, 0.25, b.d + 0.3, M.trim, 0, y0 + f * fh - 0.1, 0));
  // ban công từng tầng (giữa mặt tiền, lan can trụ tiện) + lan can mái
  for (let f = 1; f < floors; f++) {
    const bw = Math.min(b.w * 0.45, 10), y = y0 + f * fh;
    shell.add(box(bw, 0.3, 1.6, M.trim, 0, y, b.d / 2 + 0.8));
    shell.add(box(bw, 0.12, 0.14, M.trim, 0, y + 1.0, b.d / 2 + 1.55));
    for (let x = -bw / 2; x <= bw / 2 + 0.01; x += 0.45) shell.add(cyl(0.06, 0.08, 0.85, M.marble, x, y + 0.57, b.d / 2 + 1.55, 6));
  }
  shell.add(box(2.6, 0.4, 0.5, M.trim, 0, y0 + 3.15, b.d / 2 + 0.2)); // mái che cửa
  if (S.fam === 'mughal' || S.dome) {
    shell.add(roofFor(S, M, b.w, b.d, y0 + H, 'flat'));
    const R = Math.min(b.w, b.d) * 0.28;
    shell.add(cyl(R * 0.9, R * 0.9, 2.2, M.marble, 0, y0 + H + 1.1, 0, 16));
    if (S.fam === 'mughal') { shell.add(mesh(onionGeo(R, R * 2.2), M.marble, 0, y0 + H + 2.2, 0)); shell.add(cyl(0.06, 0.06, 1.6, M.gold, 0, y0 + H + 2.2 + R * 2.2 + 0.6, 0)); }
    else shell.add(mesh(new THREE.SphereGeometry(R, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), S.roof === 'hip' ? std({ color: '#7f9a9e', roughness: 0.5, metalness: 0.4 }) : M.roof, 0, y0 + H + 2.2, 0));
    if (S.fam === 'mughal') for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const cx = sx * (b.w / 2 - 1.2), cz = sz * (b.d / 2 - 1.2); for (const [dx, dz] of [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]]) shell.add(cyl(0.12, 0.12, 2, M.marble, cx + dx, y0 + H + 1, cz + dz, 6)); shell.add(mesh(onionGeo(1, 1.8), M.marble, cx, y0 + H + 2, cz)); }
  } else shell.add(roofFor(S, M, b.w, b.d, y0 + H));
  if (S.portico && !villa) { // hàng cột + trán tường tam giác
    const n = 6, pw = Math.min(b.w * 0.5, 16);
    for (let i = 0; i < n; i++) shell.add(cyl(0.35, 0.4, H, M.marble, -pw / 2 + (i * pw) / (n - 1), y0 + H / 2, b.d / 2 + 3, 14));
    shell.add(box(pw + 1.2, 0.6, 3.6, M.trim, 0, y0 + H + 0.3, b.d / 2 + 1.8));
    const ped = gableGeo(3.6, pw + 1.2, 2.2); ped.rotateY(Q); shell.add(mesh(ped, M.trim, 0, y0 + H + 0.6, b.d / 2 + 1.8));
  }
  if (S.turrets && !villa) for (const sx of [-1, 1]) for (const sz of [-1, 1]) { shell.add(cyl(1.8, 1.8, H + 1.6, M.facade, sx * b.w / 2, y0 + (H + 1.6) / 2, sz * b.d / 2, 14)); shell.add(mesh(new THREE.ConeGeometry(2.2, 4.4, 14), M.roof, sx * b.w / 2, y0 + H + 1.6 + 2.2, sz * b.d / 2)); }
  if (S.arches) for (let i = 0; i < Math.floor(b.w / 3.4); i++) { const x = -b.w / 2 + 1.7 + i * 3.4; if (Math.abs(x) < 1.6) continue; shell.add(cyl(0.18, 0.18, 2.8, M.wall, x, y0 + 1.4, b.d / 2 + 1.6, 8)); }
  if (S.arches) shell.add(box(b.w, 0.5, 2, M.wall, 0, y0 + 3, b.d / 2 + 1));
  return { base, shell };
}

/** Đình mở (vọng đình / thủy tạ / nhà hồ bơi) theo phong cách */
export function styledPavilion(S, pv) {
  if (S.fam === 'asian' || S.fam === 'mughal') return hall({ w: pv.w, d: pv.d, h: pv.h, plinth: 0.5, open: true, octa: pv.octa, roof: S.roofCol.startsWith('#6') ? 'green' : 'grey' });
  const M = styleMats(S), base = plinthG({ w: pv.w - 1.2, d: pv.d - 1.2, h: 0.5 }), shell = new THREE.Group();
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) shell.add(cyl(0.2, 0.22, pv.h, S.fam === 'modern' ? M.trim : M.marble, sx * (pv.w / 2 - 0.5), 0.5 + pv.h / 2, sz * (pv.d / 2 - 0.5), 10));
  if (S.fam === 'modern') shell.add(box(pv.w + 1, 0.3, pv.d + 1, M.trim, 0, 0.5 + pv.h + 0.15, 0));
  else shell.add(mesh(new THREE.SphereGeometry(pv.w * 0.5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), M.roof, 0, 0.5 + pv.h, 0));
  return { base, shell };
}

/** Tường rào theo kiểu: list [{ x, z, len, ry, h, t }] */
export function styledFence(S, list) {
  const k = kit(), M = styleMats(S), g = new THREE.Group(), f = S.fence;
  const body = { redwall: k.redWall, whitewall: k.plaster, stucco: M.wall, stonewall: k.pave, brick: std({ color: '#8a4a32', roughness: 0.9 }), redstone: std({ color: '#a8503a', roughness: 0.85 }), stone: k.pave, bamboo: k.bamboo, modern: std({ color: '#f2f2ef', roughness: 0.6 }), hedge: k.leaf, iron: k.stoneDark }[f] || k.plaster;
  const cap = { redwall: k.tileCap, whitewall: k.tileCap, stonewall: k.tileCap, stucco: std({ color: '#b8613a' }), brick: k.tileCap, redstone: M.marble }[f] || null;
  for (const w of list) {
    if (f === 'iron') { // chân đá thấp + song sắt (mảng tối) + trụ
      g.add(box(w.len, 0.6, w.t, k.pave, w.x, 0.3, w.z, w.ry, 2));
      g.add(box(w.len, w.h - 0.6, 0.06, std({ color: '#1e2226', roughness: 0.5, metalness: 0.6, transparent: true, opacity: 0.55 }), w.x, 0.6 + (w.h - 0.6) / 2, w.z, w.ry));
      continue;
    }
    g.add(box(w.len, w.h, w.t, body, w.x, w.h / 2, w.z, w.ry, 2.5));
    if (cap) g.add(box(w.len + 0.1, 0.35, w.t + 0.35, cap, w.x, w.h + 0.1, w.z, w.ry));
  }
  return g;
}

/** Cổng: phủ (Á Đông: nhà cổng; Tây / Mughal: hai trụ + vòm; hiện đại: tấm đua) · biệt thự: hai trụ nhỏ */
export function styledGate(S, { w, villa = false, d = 0 }) {
  const M = styleMats(S), g = new THREE.Group();
  if (!villa && S.fam === 'asian') { const { base, shell } = gateHouse({ w: w + 9, d: 7, h: 5.4, plinth: 0.9, roof: S.roofCol.startsWith('#6') ? 'green' : 'grey', main: true }); base.position.z = shell.position.z = d - 3.5; g.add(base, shell); return g; }
  const ph = villa ? 2.2 : 4.6, pw = villa ? 0.5 : 1.2;
  for (const sx of [-1, 1]) { g.add(box(pw, ph, pw, S.fam === 'modern' ? M.trim : M.wall, sx * (w / 2 + pw / 2), ph / 2, d)); g.add(box(pw + 0.3, 0.3, pw + 0.3, M.trim, sx * (w / 2 + pw / 2), ph + 0.15, d)); }
  if (!villa) {
    if (S.fam === 'modern') g.add(box(w + 4, 0.3, 4, M.trim, 0, ph, d - 1));
    else { const a = new THREE.Mesh(new THREE.TorusGeometry(w / 2 + pw / 2, 0.35, 8, 20, Math.PI), M.trim); a.position.set(0, ph, d); a.castShadow = true; g.add(a); }
  }
  return g;
}

/** Mặt nước / vườn theo phần (mansions.waterParts) */
export function waterFeature(p) {
  const k = kit(), g = new THREE.Group();
  if (p.shape === 'ellipse') { g.add(pond({ x: p.x, z: p.z, rx: p.rx, rz: p.rz }, p.bridge)); return g; }
  if (p.shape === 'rect') {
    const pool = p.kind === 'pool', w = new THREE.Mesh(new THREE.PlaneGeometry(p.w, p.d), pool ? std({ color: '#3fa7c4', roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.9 }) : k.water);
    w.rotation.x = -Math.PI / 2; w.position.set(p.x, 0.25, p.z); g.add(w);
    for (const [x, z, ww, dd] of [[p.x, p.z + p.d / 2, p.w + 0.6, 0.3], [p.x, p.z - p.d / 2, p.w + 0.6, 0.3], [p.x + p.w / 2, p.z, 0.3, p.d], [p.x - p.w / 2, p.z, 0.3, p.d]]) g.add(box(ww, 0.4, dd, pool ? std({ color: '#f2efe6', roughness: 0.6 }) : k.pave, x, 0.2, z));
    return g;
  }
  if (p.shape === 'fountain') { g.add(cyl(p.r, p.r * 1.05, 0.6, k.pave, p.x, 0.3, p.z, 20)); const w = cyl(p.r * 0.9, p.r * 0.9, 0.05, k.water, p.x, 0.58, p.z, 20); g.add(w); g.add(cyl(p.r * 0.15, p.r * 0.2, 1.8, k.stone, p.x, 1.2, p.z, 10)); g.add(cyl(p.r * 0.45, p.r * 0.2, 0.25, k.stone, p.x, 2.1, p.z, 14)); return g; }
  if (p.shape === 'hedge') { g.add(box(p.w, 0.9, p.d, k.leaf, p.x, 0.45, p.z)); g.add(box(Math.max(0.5, p.w - 1.4), 0.12, Math.max(0.5, p.d - 1.4), std({ color: '#c04a6a', roughness: 0.9 }), p.x, 0.95, p.z)); return g; }
  if (p.shape === 'gravel') { const t = tex(128, 128, (c, w, h) => { c.fillStyle = '#d9d4c8'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(120,110,95,.35)'; c.lineWidth = 2; for (let y = 4; y < h; y += 8) { c.beginPath(); c.moveTo(0, y); for (let x = 0; x <= w; x += 8) c.lineTo(x, y + Math.sin(x * 0.1) * 1.5); c.stroke(); } }); t.repeat.set(p.w / 4, p.d / 4); const m = new THREE.Mesh(new THREE.PlaneGeometry(p.w, p.d), std({ map: t, roughness: 1 })); m.rotation.x = -Math.PI / 2; m.position.set(p.x, 0.04, p.z); m.receiveShadow = true; g.add(m); return g; }
  if (p.shape === 'rock') { const r = new THREE.Mesh(new THREE.DodecahedronGeometry(p.r, 0), k.rockG); r.position.set(p.x, p.r * 0.45, p.z); r.scale.y = 0.7; r.castShadow = true; g.add(r); return g; }
  return g;
}

/** Gò sau lưng (tọa sơn): non bộ đá · bờ rào cây xén · rặng cây (cây đặt riêng) */
export function mound(m, kind) {
  const k = kit(), g = new THREE.Group();
  if (kind === 'rock') g.add(rockery({ x: m.x, z: m.z, w: m.w, d: m.d, tunnel: 0.01 }));
  else if (kind === 'hedge') g.add(box(m.w, 1.6, Math.min(2, m.d), k.leaf, m.x, 0.8, m.z));
  else { const e = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), k.moss); e.scale.set(m.w / 2, 1.6, m.d / 2); e.position.set(m.x, 0, m.z); e.receiveShadow = true; g.add(e); }
  return g;
}

/** Cây theo phong cách: thêm palm, cypress, olive, frangi, sakura, maple, hedge vào bộ cây Á Đông có sẵn */
export function styledTree(kind, seed = 1, scale = 1) {
  const k = kit();
  let s = seed * 9301 + 49297; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const g = new THREE.Group();
  const leaf = (col) => std({ color: col, roughness: 0.85, flatShading: true });
  if (['pine', 'peach', 'willow', 'bamboo'].includes(kind)) { const t = treeA(kind, seed); t.scale.setScalar(scale); return t; }
  if (kind === 'palm') {
    const H = 6 + r() * 2; const tr = cyl(0.14, 0.22, H, k.bark, 0, H / 2, 0, 6); tr.rotation.z = (r() - 0.5) * 0.12; g.add(tr);
    const L = leaf('#4f8a3a'); for (let i = 0; i < 8; i++) { const o = new THREE.Mesh(new THREE.ConeGeometry(0.4, 3.2, 4), L); const a = (i / 8) * Math.PI * 2; o.position.set(Math.cos(a) * 1.3, H - 0.3, Math.sin(a) * 1.3); o.rotation.set(Math.sin(a) * 1.25, 0, -Math.cos(a) * 1.25); o.castShadow = true; g.add(o); }
  } else if (kind === 'cypress') { g.add(cyl(0.12, 0.16, 1.2, k.bark, 0, 0.6, 0, 6)); const o = new THREE.Mesh(new THREE.ConeGeometry(0.9, 7, 8), leaf('#2c4f2e')); o.position.y = 4.4; o.castShadow = true; g.add(o); }
  else if (kind === 'hedge') g.add(box(1.8, 1.2, 1.8, k.leaf, 0, 0.6, 0));
  else if (kind === 'wisteria') { // tử đằng: thân xoắn, chùm hoa tím rủ
    g.add(cyl(0.18, 0.26, 3, k.bark, 0, 1.5, 0, 7)); const L = leaf('#5f7a3a'), F = leaf('#a879d6');
    for (let i = 0; i < 4; i++) { const o = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 0), L); o.position.set((r() - 0.5) * 2.4, 3.4, (r() - 0.5) * 2.4); g.add(o); }
    for (let i = 0; i < 10; i++) { const o = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.1, 5), F); o.position.set((r() - 0.5) * 3, 2.5, (r() - 0.5) * 3); o.rotation.x = Math.PI; g.add(o); }
  } else if (kind === 'banyan') { // cây đa: tán rộng, rễ phụ
    g.add(cyl(0.5, 0.8, 4, k.bark, 0, 2, 0, 9)); for (let i = 0; i < 6; i++) g.add(cyl(0.05, 0.07, 3.6, k.bark, Math.cos(i) * 2.2, 1.8, Math.sin(i) * 2.2, 4));
    const L = leaf('#3f6b34'); for (let i = 0; i < 8; i++) { const o = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6 + r() * 0.6, 0), L); o.position.set((r() - 0.5) * 5, 4.4 + r(), (r() - 0.5) * 5); o.scale.y = 0.6; o.castShadow = true; g.add(o); }
  } else if (kind === 'birch') { // bạch dương: thân trắng thon cao
    g.add(cyl(0.12, 0.16, 6, std({ color: '#ecebe4', roughness: 0.8 }), 0, 3, 0, 7)); const L = leaf('#9ab85a'); for (let i = 0; i < 4; i++) { const o = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 0), L); o.position.set((r() - 0.5) * 1.4, 4.6 + i * 0.7, (r() - 0.5) * 1.4); g.add(o); }
  } else {
    const col = { olive: '#8a9a6a', frangi: '#f2e6d8', sakura: '#f4b6c8', maple: '#c4452e', ginkgo: '#e3c23a', plum: '#f7f1f3', camellia: '#d8456a', osmanthus: '#4f7a3a', magnolia: '#f3eadf', jacaranda: '#8a6ad8' }[kind] || '#5a8a4a';
    const H = kind === 'frangi' || kind === 'camellia' ? 3.2 : kind === 'ginkgo' || kind === 'magnolia' ? 5.4 : 4.2;
    g.add(cyl(0.16, 0.24, H * 0.55, k.bark, 0, H * 0.27, 0, 7));
    const L = leaf(col); for (let i = 0; i < 6; i++) { const o = new THREE.Mesh(new THREE.IcosahedronGeometry(1 + r() * 0.5, 0), L); o.position.set((r() - 0.5) * 2, H * 0.62 + r() * 1.1, (r() - 0.5) * 2); o.castShadow = true; g.add(o); }
    if (kind === 'osmanthus') { const Y = leaf('#f2c94c'); for (let i = 0; i < 10; i++) { const o = new THREE.Mesh(new THREE.SphereGeometry(0.12, 4, 3), Y); o.position.set((r() - 0.5) * 2.4, H * 0.6 + r() * 1.4, (r() - 0.5) * 2.4); g.add(o); } }
  }
  g.scale.setScalar(scale);
  return g;
}
export { stoneLantern };

/** Tháp cao (~30 m) bên Thanh Long: Á Đông — lầu tháp 5 tầng mái cong chóp vàng; Tây — tháp chuông đá mái nhọn;
 *  hiện đại — tháp kính khung trắng; Mughal — minaret có ban công, vòm củ hành. t: { w, d, h } (gốc ở tâm đáy) */
export function styledTower(S, t) {
  const k = kit(), M = styleMats(S), g = new THREE.Group(), base = plinthG({ w: t.w - 2.2, d: t.d - 2.2, h: 1.2 });
  g.add(base);
  const sig = S.sig || '';
  const top = 1.2;
  // công trình biểu tượng riêng từng phủ
  if (sig === 'stupa') { // tháp chuông vàng (chedi Thái)
    const pts = []; for (let i = 0; i <= 18; i++) { const y = (i / 18) * (t.h - 2); const r2 = y < t.h * 0.35 ? t.w * 0.45 * (1 - y / (t.h * 0.7)) + t.w * 0.12 : t.w * 0.36 * Math.max(0.03, 1 - (y - t.h * 0.35) / (t.h * 0.65)); pts.push(new THREE.Vector2(Math.max(0.05, r2), y)); }
    for (let i = 0; i < 3; i++) g.add(box(t.w * (1 - i * 0.18), 1.2, t.d * (1 - i * 0.18), k.white, 0, top + 0.6 + i * 1.2, 0));
    g.add(mesh(new THREE.LatheGeometry(pts, 20), M.gold, 0, top + 3.6, 0)); return g;
  }
  if (sig === 'meru') { // tháp mái tranh nhiều tầng (Bali)
    g.add(box(t.w * 0.6, 3, t.d * 0.6, k.pave, 0, top + 1.5, 0));
    const n = 7; for (let i = 0; i < n; i++) { const s2 = t.w * (1 - i * 0.11); g.add(mesh(hipGeo(s2, s2, 1.4, 0.4), M.straw, 0, top + 3 + i * 3.4, 0)); g.add(box(0.6, 3.4, 0.6, M.wood, 0, top + 3 + i * 3.4 + 1.7, 0)); }
    return g;
  }
  if (sig === 'tenshu') { // thiên thủ các (thành Nhật): chân đá dốc + 4 tầng tường trắng mái đen
    g.add(mesh(hipGeo(t.w * 1.1, t.d * 1.1, 6, 0.75), k.pave, 0, top, 0));
    for (let i = 0; i < 4; i++) { const s2 = t.w * 0.82 * (1 - i * 0.14), y = top + 6 + i * 5.2; g.add(box(s2, 4, s2, std({ color: '#f4f1ea', roughness: 0.8 }), 0, y + 2, 0)); const R = MD.roof(s2 * 1.35, s2 * 1.35, 1.8, { upturn: 0.25, mats: { ...k, roof: M.roof } }); R.position.y = y + 4; g.add(R); }
    return g;
  }
  if (sig === 'rotunda') { // đền tròn hàng cột + vòm (Palladio)
    const R2 = t.w * 0.48; g.add(cyl(R2 + 0.6, R2 + 0.8, 1.2, k.white, 0, top + 0.6, 0, 24));
    for (let i = 0; i < 12; i++) { const a2 = (i / 12) * Math.PI * 2; g.add(cyl(0.3, 0.35, 9, M.marble, Math.cos(a2) * R2, top + 1.2 + 4.5, Math.sin(a2) * R2, 12)); }
    g.add(cyl(R2 + 0.4, R2 + 0.4, 1, M.trim, 0, top + 11.2, 0, 24)); g.add(mesh(new THREE.SphereGeometry(R2 + 0.3, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), std({ color: '#7f9a9e', roughness: 0.4, metalness: 0.5 }), 0, top + 11.7, 0));
    return g;
  }
  if (sig === 'donjon' || sig === 'minaret' || sig === 'minaret2') { // tháp tròn lâu đài / minaret
    const H = t.h - 6, r0 = sig === 'donjon' ? t.w * 0.42 : t.w * 0.26, wall = sig === 'donjon' ? M.facade : M.marble;
    g.add(cyl(r0, r0 * 1.08, H, wall, 0, top + H / 2, 0, 18));
    if (sig === 'donjon') g.add(mesh(new THREE.ConeGeometry(r0 * 1.25, 9, 18), M.roof, 0, top + H + 4.5, 0));
    else { for (const f of [0.45, 0.8]) g.add(cyl(r0 * 1.5, r0 * 1.5, 0.6, M.trim, 0, top + H * f, 0, 16)); g.add(sig === 'minaret2' ? mesh(onionGeo(r0 * 1.2, r0 * 2.6), M.marble, 0, top + H, 0) : mesh(hipGeo(r0 * 2, r0 * 2, 4, 0.05), M.roof, 0, top + H, 0)); }
    return g;
  }
  if (sig === 'bell' || sig === 'bellhanok') { // gác chuông hai tầng
    const { base: b2, shell } = hall({ w: t.w, d: t.d, h: 8, plinth: 1.2, open: true, storeys: 2, roof: sig === 'bell' ? 'grey' : 'grey' }); g.add(b2, shell);
    g.add(cyl(1.0, 1.4, 2.2, std({ color: '#7a5a2a', roughness: 0.4, metalness: 0.7 }), 0, 1.2 + 5.6, 0, 16)); return g;
  }
  if (sig === 'cube' || sig === 'wood' || sig === 'glass') { // hiện đại: khối đua so le · lam gỗ · tháp kính
    const H = t.h - 4, n = Math.floor(H / 4.2);
    for (let i = 0; i < n; i++) { const off = sig === 'cube' ? (i % 2 ? 1.6 : -1.6) : 0; g.add(box(t.w * 0.8, 4, t.d * 0.8, sig === 'glass' ? M.glass : i % 2 ? M.wall : M.glass, off, top + i * 4.2 + 2, 0)); g.add(box(t.w * 0.86, 0.25, t.d * 0.86, sig === 'wood' ? M.wood : M.trim, off, top + i * 4.2 + 4.1, 0)); }
    if (sig === 'wood') for (let x = -t.w * 0.4; x <= t.w * 0.4; x += 0.8) g.add(box(0.14, H, 0.14, M.wood, x, top + H / 2, t.d * 0.43));
    return g;
  }
  if (S.fam === 'asian') {
    const n = sig === 'pagoda9' ? 9 : sig === 'pagoda7' ? 7 : 5, th = (t.h - 6) / n;
    for (let i = 0; i < n; i++) {
      const s = t.w * (1 - i * 0.12), y = 1.2 + i * th;
      g.add(box(s * 0.78, th * 0.7, s * 0.78, i % 2 ? k.plaster : k.lattice, 0, y + th * 0.35, 0, 0, 2.5));
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(cyl(0.16, 0.18, th * 0.7, k.son, sx * s * 0.4, y + th * 0.35, sz * s * 0.4, 8));
      g.add(box(s * 0.86, 0.3, s * 0.86, k.beam, 0, y + th * 0.72, 0, 0, 3));
      const R = MD.roof(s * 1.25, s * 1.25, th * 0.42, { upturn: 0.7, mats: { ...k, roof: S.roofCol.startsWith('#6') ? k.roofGreen : M.roof.color ? k.roof : k.roof } }); R.position.y = y + th * 0.78; g.add(R);
    }
    g.add(cyl(0.12, 0.35, 5, M.gold, 0, 1.2 + n * th + 2.2, 0, 8));
    for (let i = 0; i < 4; i++) g.add(cyl(0.5 - i * 0.08, 0.5 - i * 0.08, 0.25, M.gold, 0, 1.2 + n * th + 0.8 + i * 0.9, 0, 12));
  } else if (S.fam === 'modern') {
    const H = t.h - 4;
    g.add(box(t.w * 0.8, H, t.d * 0.8, M.glass, 0, 1.2 + H / 2, 0));
    for (let y = 1.2; y <= H; y += 4.2) g.add(box(t.w * 0.84, 0.35, t.d * 0.84, M.trim, 0, y, 0));
    g.add(box(t.w * 0.9, 0.5, t.d * 0.9, M.trim, 0, 1.2 + H + 0.25, 0));
  } else if (S.fam === 'mughal') {
    const H = t.h - 8;
    g.add(cyl(t.w * 0.22, t.w * 0.3, H, M.marble, 0, 1.2 + H / 2, 0, 16));
    for (const f of [0.35, 0.65, 0.95]) { g.add(cyl(t.w * 0.36, t.w * 0.36, 0.5, M.marble, 0, 1.2 + H * f, 0, 16)); g.add(cyl(t.w * 0.37, t.w * 0.37, 0.8, M.trim, 0, 1.2 + H * f + 0.6, 0, 16)); }
    g.add(mesh(onionGeo(t.w * 0.3, t.w * 0.7), M.marble, 0, 1.2 + H, 0));
  } else {
    const H = t.h - 7;
    g.add(box(t.w * 0.8, H, t.d * 0.8, M.facade, 0, 1.2 + H / 2, 0, 0, 3.5));
    g.add(box(t.w * 0.9, 0.6, t.d * 0.9, M.trim, 0, 1.2 + H - 4, 0));
    for (const [x, z] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) g.add(box(x ? 0.2 : t.w * 0.4, 2.4, z ? 0.2 : t.d * 0.4, std({ color: '#1e2226' }), x * t.w * 0.41, 1.2 + H - 2, z * t.d * 0.41));
    g.add(mesh(hipGeo(t.w * 0.95, t.d * 0.95, 7, 0.02), M.roof, 0, 1.2 + H, 0));
  }
  return g;
}
