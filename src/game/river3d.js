// ============================================================================
//  THỦY ĐẠO BÁT MÔN 3D (canals.js · bridges.js): hộ thành hà bát giác 25,5 m ôm tường Nội Thành + kênh 22 m giữa
//  đại lộ Khảm (Hưu Môn — nạp thủy) và Tốn (Đỗ Môn — thủy khẩu, xuyên thủy môn ra kênh dẫn xuống sông Huyền Hà).
//  2026-11-10 làm lại cho thuyền lớn: bờ kè đá cao tới đáy −4,3 có bậc bến, cầu đá lưng gù một vòm (tĩnh không 5,5 m,
//  chân cầu gọn trong lòng nước, mặt cầu đi lên được theo dốc), Thủy Các thành thủy tạ trên 4 góc bờ ngoài hào —
//  KHÔNG còn công trình nào giữa dòng. Thuyền hoa / thuyền thuê: boats3d.js.
// ============================================================================
import * as THREE from 'three';
import * as MD from './models.js';
import * as AK from './archkit.js';
import { GUA, TAN8 } from './batquai.js';
import { OUTER_A } from './cityblocks.js';
import { MOAT, AVE_CANAL, OUTLET, CANAL_BED, CANAL_WATER, EXT_PATHS } from './canals.js';
import { cityBridges, deckTop, bridgePlatforms } from './bridges.js';
import { addPlatform } from './obstacles.js';
import { addLight } from './lights.js';
import { waterMaterial } from './water3d.js';

const W = (g, u, v) => ({ x: g.dir[0] * u - g.dir[1] * v, z: g.dir[1] * u + g.dir[0] * v });
const axisRy = (g) => Math.atan2(-g.dir[1], g.dir[0]); // x cục bộ dọc trục u
const QUAY = 0.35;

/** cầu gác (b.open): bản mặt cầu dày b.thick theo profile, đỡ trên hàng cột đá (b.cols: toạ độ t) — gầm thông thuyền */
function openBridge(b, mats, bed) {
  const g = new THREE.Group(), n = 64, sh = new THREE.Shape();
  sh.moveTo(-b.L, deckTop(b, -b.L));
  for (let i = 1; i <= n; i++) { const t = -b.L + (2 * b.L * i) / n; sh.lineTo(t, deckTop(b, t)); }
  for (let i = n; i >= 0; i--) { const t = -b.L + (2 * b.L * i) / n; sh.lineTo(t, Math.max(bed, deckTop(b, t) - b.thick - (deckTop(b, t) < b.H - 0.5 ? 0.6 : 0))); }
  const geo = new THREE.ExtrudeGeometry(sh, { depth: b.W, bevelEnabled: false, curveSegments: 4 }); geo.translate(0, 0, -b.W / 2);
  const deck = new THREE.Mesh(geo, mats.stone); deck.castShadow = deck.receiveShadow = true; g.add(deck);
  // dầm đá dưới mép bản + cột tròn hai bên
  for (const t of b.cols || []) for (const sz of [-1, 1]) {
    const top = deckTop(b, t) - b.thick, h = top - bed, c = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, h, 10), mats.coping);
    c.position.set(t, bed + h / 2, sz * (b.W / 2 - 0.7)); c.castShadow = true; g.add(c);
  }
  g.add(bridgeRails(b, mats, n));
  g.position.set(b.x, 0, b.z); g.rotation.y = Math.atan2(-b.az, b.ax);
  return g;
}
/** thân cầu đá: mặt cắt dọc (theo profile mặt cầu) đùn theo bề rộng, khoét vòm cuốn bán nguyệt cho thuyền qua */
export function bridgeBody(b, mats, bed = CANAL_BED) {
  if (b.open) return openBridge(b, mats, bed);
  const g = new THREE.Group();
  const n = 48, sh = new THREE.Shape();
  sh.moveTo(-b.L, bed);
  for (let i = 0; i <= n; i++) { const t = -b.L + (2 * b.L * i) / n; sh.lineTo(t, deckTop(b, t)); }
  sh.lineTo(b.L, bed); sh.lineTo(-b.L, bed);
  if (b.arch) {
    const c = b.archT || 0, R = b.arch, Rw = b.archW || R, hole = new THREE.Path();
    hole.moveTo(c - Rw, bed + 0.05); hole.lineTo(c - Rw, b.water);
    for (let i = 0; i <= 28; i++) { const a = Math.PI - (Math.PI * i) / 28; hole.lineTo(c + Math.cos(a) * Rw, b.water + Math.sin(a) * R); }
    hole.lineTo(c + Rw, bed + 0.05); hole.lineTo(c - Rw, bed + 0.05);
    sh.holes.push(hole);
  }
  const geo = new THREE.ExtrudeGeometry(sh, { depth: b.W, bevelEnabled: false, curveSegments: 6 });
  geo.translate(0, 0, -b.W / 2);
  const body = new THREE.Mesh(geo, mats.stone); body.castShadow = body.receiveShadow = true; g.add(body);
  g.add(bridgeRails(b, mats, n));
  g.position.set(b.x, 0, b.z);
  g.rotation.y = Math.atan2(-b.az, b.ax); // x cục bộ = hướng băng qua nước
  return g;
}
/** lan can hai bên theo dốc mặt cầu + trụ lan can (toạ độ cục bộ của cầu) */
export function bridgeRails(b, mats, n = 48) {
  const rail = [];
  for (const sz of [-1, 1]) for (let i = 0; i < n; i++) {
    const t0 = -b.L + (2 * b.L * i) / n, t1 = -b.L + (2 * b.L * (i + 1)) / n, y0 = deckTop(b, t0), y1 = deckTop(b, t1);
    const len = Math.hypot(t1 - t0, y1 - y0), q = new THREE.BoxGeometry(len, 0.75, 0.26);
    q.rotateZ(Math.atan2(y1 - y0, t1 - t0)); q.translate((t0 + t1) / 2, (y0 + y1) / 2 + 0.38, sz * (b.W / 2 - 0.13)); rail.push(q);
    if (i % 4 === 0) { const p = new THREE.BoxGeometry(0.34, 1.05, 0.34); p.translate(t0, y0 + 0.5, sz * (b.W / 2 - 0.13)); rail.push(p); }
  }
  const rm = new THREE.Mesh(mergeList(rail), mats.coping); rm.castShadow = true;
  return rm;
}
/**
 * Cầu lớn nhiều nhịp (bridges.riverBridges): tường cầu đá từ mặt cầu xuống đáy sông theo mặt đất, khoét vòm cao
 * giữa các trụ (chân vòm đứng tới đáy → nước thông, thuyền qua), lan can, cột đèn, đình giữa cầu.
 * ground(t) = cao độ đất dưới cầu tại toạ độ t.
 */
export function riverBridgeBody(b, mats, ground) {
  const g = new THREE.Group(), sh = new THREE.Shape(), n = 120;
  const under = (t) => deckTop(b, t) - b.thick;
  sh.moveTo(-b.L, deckTop(b, -b.L));
  for (let i = 1; i <= n; i++) { const t = -b.L + (2 * b.L * i) / n; sh.lineTo(t, deckTop(b, t)); }
  // đáy: từ đầu Nam về đầu Bắc — bám đất, khoét vòm giữa các «gối» (mố hai đầu + trụ)
  const sup = [{ a: b.L, c: b.L }, ...b.piers.map((p) => ({ a: p.t + p.hd, c: p.t - p.hd })).sort((x, y) => y.a - x.a), { a: -b.L, c: -b.L }];
  const gnd = (t) => Math.min(ground(t), under(t) - 0.5);
  sh.lineTo(b.L, gnd(b.L));
  for (let i = 0; i + 1 < sup.length; i++) {
    const right = sup[i].c, left = sup[i + 1].a; // khoảng hở từ right (lớn) về left (nhỏ)
    sh.lineTo(right, gnd(right));
    const r = (right - left) / 2, mid = (right + left) / 2;
    let low = Infinity; for (let k = 0; k <= 10; k++) low = Math.min(low, under(left + ((right - left) * k) / 10));
    const spring = low - 0.9 - r;
    if (r > 3 && spring > Math.max(gnd(right), gnd(left)) + 1) {
      sh.lineTo(right, spring);
      for (let k = 1; k <= 20; k++) { const a = (Math.PI * k) / 20; sh.lineTo(mid + Math.cos(a) * r, spring + Math.sin(a) * r); }
      sh.lineTo(left, gnd(left));
    } else {
      for (let k = 1; k <= 12; k++) { const t = right - ((right - left) * k) / 12; sh.lineTo(t, gnd(t)); }
    }
    if (i + 1 < sup.length - 1) sh.lineTo(sup[i + 1].c, gnd(sup[i + 1].c)); // chân trụ
  }
  sh.lineTo(-b.L, deckTop(b, -b.L));
  const geo = new THREE.ExtrudeGeometry(sh, { depth: b.W, bevelEnabled: false, curveSegments: 4 });
  geo.translate(0, 0, -b.W / 2);
  const body = new THREE.Mesh(geo, mats.stone); body.castShadow = body.receiveShadow = true; g.add(body);
  // đế trụ hình thoi rẽ nước (mũi nhọn hai phía dòng chảy)
  for (const p of b.piers) {
    const y0 = ground(p.t) - 0.5, y1 = b.water + 1.2, cut = new THREE.CylinderGeometry(p.hd * 1.5, p.hd * 1.7, y1 - y0, 4);
    const m = new THREE.Mesh(cut, mats.coping); m.position.set(p.t, (y0 + y1) / 2, 0); m.scale.set(1, 1, (b.W / 2 + 2.5) / (p.hd * 1.5)); m.rotation.y = Math.PI / 4; m.castShadow = true; g.add(m);
  }
  g.add(bridgeRails(b, mats, n));
  g.position.set(b.x, 0, b.z);
  g.rotation.y = Math.atan2(-b.az, b.ax);
  return g;
}
function mergeList(list) {
  // gộp đơn giản (không cần BufferGeometryUtils ở đây): nối thuộc tính vị trí / pháp tuyến
  let nPos = 0, nIdx = 0; for (const q of list) { nPos += q.attributes.position.count; nIdx += q.index ? q.index.count : q.attributes.position.count; }
  const pos = new Float32Array(nPos * 3), nor = new Float32Array(nPos * 3), idx = new Uint32Array(nIdx); let o = 0, oi = 0;
  for (const q of list) {
    pos.set(q.attributes.position.array, o * 3); nor.set(q.attributes.normal.array, o * 3);
    const I = q.index ? q.index.array : Array.from({ length: q.attributes.position.count }, (_, i) => i);
    for (let i = 0; i < I.length; i++) idx[oi + i] = I[i] + o;
    o += q.attributes.position.count; oi += I.length; q.dispose();
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setIndex(new THREE.BufferAttribute(idx, 1));
  return g;
}

export function createRiver(scene) {
  const grp = new THREE.Group(); grp.name = 'river'; scene.add(grp);
  const k = AK.kit();
  const water = waterMaterial({ level: CANAL_WATER, kind: 'canal' });
  const stone = k.pave, coping = k.stone;
  const outEdge = MOAT.a + MOAT.w / 2;
  // --- mặt nước: hào bát giác (vành giữa hai bát giác) + kênh hai đại lộ (Tốn dài tới thủy môn Ngoại Thành)
  const oct = (a) => { const R = a / Math.cos(Math.PI / 8), pts = []; for (let i = 0; i < 8; i++) { const ang = Math.PI / 2 + Math.PI / 8 + i * Math.PI / 4; pts.push(new THREE.Vector2(Math.cos(ang) * R, Math.sin(ang) * R)); } return pts; };
  const shape = new THREE.Shape(oct(outEdge)); shape.holes.push(new THREE.Path(oct(MOAT.a - MOAT.w / 2)));
  const moatGeo = new THREE.ShapeGeometry(shape, 24); moatGeo.rotateX(-Math.PI / 2);
  { const p = moatGeo.attributes.position, uv = moatGeo.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / 8, p.getZ(i) / 8); }
  const moat = new THREE.Mesh(moatGeo, waterMaterial({ kind: 'moat' })); moat.position.y = CANAL_WATER; moat.receiveShadow = true; grp.add(moat);
  const canalW = AVE_CANAL.v1 - AVE_CANAL.v0;
  const u1Of = (id) => (id === OUTLET.gua ? OUTLET.u1 : AVE_CANAL.u1);
  for (const id of AVE_CANAL.gua) {
    const g = GUA.find((q) => q.id === id), len = u1Of(id) - outEdge + 1, c = W(g, outEdge - 0.5 + len / 2, 0);
    const geo = new THREE.PlaneGeometry(len, canalW, Math.ceil(len / 4), 6); geo.rotateX(-Math.PI / 2);
    { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * len / 8, uv.getY(i) * canalW / 8); }
    const sgn = id === 'kan' ? -1 : 1; // Khảm chảy vào hào, Tốn chảy ra (water.js › canalFlow)
    const m = new THREE.Mesh(geo, waterMaterial({ kind: 'canal', flow: [g.dir[0] * sgn * 0.3, g.dir[1] * sgn * 0.3] })); m.position.set(c.x, CANAL_WATER, c.z); m.rotation.y = axisRy(g); m.receiveShadow = true; grp.add(m);
  }

  // --- bờ kè đá (từ đáy kênh lên mặt bờ) + mũ kè; bậc bến xuống nước mỗi ~60 m dọc kênh
  const walls = new THREE.Group(); grp.add(walls);
  const wallH = QUAY - CANAL_BED;
  const wallBox = (len, x, z, ry) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(len, wallH, 0.8), stone); b.position.set(x, CANAL_BED + wallH / 2, z); b.rotation.y = ry; b.receiveShadow = true; walls.add(b);
    const c = new THREE.Mesh(new THREE.BoxGeometry(len, 0.2, 1.0), coping); c.position.set(x, QUAY + 0.1, z); c.rotation.y = ry; walls.add(c);
  };
  for (const g of GUA) for (const a of [MOAT.a - MOAT.w / 2, outEdge]) { const L = a * TAN8 * 2, p = W(g, a, 0); wallBox(L + 0.8, p.x, p.z, axisRy(g) + Math.PI / 2); }
  // bậc đá ép sát bờ xuống tới dưới mặt nước (bến đò / người bơi lên bờ): 8 bậc 0,3 m — nền đi được (motion STEP_UP 0,65)
  const stepRun = (g, u, vEdge, dir) => { // vEdge: mép kè (v), dir: hướng ra giữa nước (±1, theo v)
    for (let i = 0; i < 8; i++) {
      const y = QUAY - 0.3 * (i + 1), p = W(g, u, vEdge + dir * (0.25 + i * 0.45));
      const st = new THREE.Mesh(new THREE.BoxGeometry(4, QUAY - CANAL_BED - 0.3 * (i + 1), 0.45), coping); st.position.set(p.x, (y + CANAL_BED) / 2, p.z); st.rotation.y = axisRy(g); walls.add(st);
      addPlatform(p.x, p.z, 4, 0.46, axisRy(g), y);
    }
  };
  const steps = (g, u, sv) => stepRun(g, u, sv * AVE_CANAL.v1, -sv);
  for (const id of AVE_CANAL.gua) {
    const g = GUA.find((q) => q.id === id), u1 = u1Of(id), len = u1 - outEdge;
    for (const v of [AVE_CANAL.v0, AVE_CANAL.v1]) { const p = W(g, outEdge + len / 2, v + Math.sign(v) * 0.4); wallBox(len, p.x, p.z, axisRy(g)); }
    if (id !== OUTLET.gua) { const e = W(g, u1 + 0.4, 0); wallBox(canalW + 1.6, e.x, e.z, axisRy(g) + Math.PI / 2); } // Khảm: đầu kênh khép (suối vào qua cống)
    for (let u = outEdge + 30; u < u1 - 20; u += 60) for (const sv of [-1, 1]) steps(g, u + (sv > 0 ? 0 : 30), sv);
  }
  // hào: mỗi cạnh hai bến bậc ở bờ ngoài (lệch ±30 m khỏi đại lộ) — trục u của cung ⟂ bờ: bậc chạy theo u
  for (const g of GUA) for (const sv of [-30, 30]) for (let i = 0; i < 8; i++) {
    const y = QUAY - 0.3 * (i + 1), p = W(g, outEdge - 0.25 - i * 0.45, sv);
    const st = new THREE.Mesh(new THREE.BoxGeometry(0.45, QUAY - CANAL_BED - 0.3 * (i + 1), 4), coping); st.position.set(p.x, (y + CANAL_BED) / 2, p.z); st.rotation.y = axisRy(g); walls.add(st);
    addPlatform(p.x, p.z, 0.46, 4, axisRy(g), y);
  }
  MD.mergeStatic(walls);

  // --- cầu đá lưng gù (bridges.js): thân đùn khoét vòm + lan can; mặt cầu là nền đi được theo dốc
  const bridges = new THREE.Group(); grp.add(bridges);
  for (const b of cityBridges()) {
    bridges.add(bridgeBody(b, { stone, coping }));
    for (const p of bridgePlatforms(b)) addPlatform(p.x, p.z, p.w, p.d, p.ry, p.top, p.top - b.thick - 0.2);
  }
  MD.mergeStatic(bridges);

  // --- Thủy Các: thủy tạ bát giác 2 tầng trên 4 góc BỜ NGOÀI hào (nhô nửa ra nước trên cột) — không còn đảo giữa dòng
  for (let i = 0; i < 8; i += 2) {
    const ang = Math.PI / 2 + Math.PI / 8 + i * Math.PI / 4, R = (outEdge + 3) / Math.cos(Math.PI / 8);
    const x = Math.cos(ang) * R, z = Math.sin(ang) * R;
    const deck = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.4, 0.35, 8), coping); deck.position.set(x, QUAY + 0.05, z); deck.rotation.y = Math.PI / 8; grp.add(deck);
    for (let c = 0; c < 8; c++) { const a = c * Math.PI / 4 + Math.PI / 8, col = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, wallH, 6), stone); col.position.set(x + Math.cos(a) * 3.9, CANAL_BED + wallH / 2, z + Math.sin(a) * 3.9); grp.add(col); }
    const { base, shell } = AK.hall({ w: 5.6, d: 5.6, h: 3.2, plinth: 0.2, open: true, octa: true, storeys: 2, roof: 'green' });
    for (const o of [base, shell]) { o.position.set(x, QUAY + 0.1, z); grp.add(o); }
    addPlatform(x, z, 8, 8, Math.PI / 8, QUAY + 0.22);
    addLight(x, 3.4, z, { color: '#ffb35c', power: 1 });
  }

  // --- suối nạp + kênh dẫn ra sông (canals.EXT_PATHS): dải nước bám mực từng đoạn
  for (const E of EXT_PATHS) {
    const P = E.P, pos = [], uvs = [], idx = []; let acc = 0;
    const pts = [];
    for (let i = 0; i + 1 < P.length; i++) { const [ax, az, la] = P[i], [bx, bz, lb] = P[i + 1], n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / 3)); for (let j = 0; j < n; j++) { const t = j / n; pts.push([ax + (bx - ax) * t, az + (bz - az) * t, la + (lb - la) * t]); } }
    pts.push(P[P.length - 1]);
    pts.forEach((p, i) => {
      const q = pts[Math.min(pts.length - 1, i + 1)], o = pts[Math.max(0, i - 1)], dx = q[0] - o[0], dz = q[1] - o[1], l = Math.hypot(dx, dz) || 1, nx = -dz / l, nz = dx / l;
      if (i) acc += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]);
      const hw = E.hw + 0.6;
      pos.push(p[0] + nx * hw, p[2], p[1] + nz * hw, p[0] - nx * hw, p[2], p[1] - nz * hw); uvs.push(0, acc / 8, hw * 2 / 8, acc / 8);
      if (i) { const a = (i - 1) * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    });
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); geo.setIndex(idx); geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, E.id === 'link' ? waterMaterial({ kind: 'link' }) : water); m.receiveShadow = true; grp.add(m);
    if (E.id === 'in') for (let i = 0; i < P.length; i += 2) for (const sd of [-1, 1]) { // đá ven suối
      const [x, z, lv] = P[i], q = P[Math.min(P.length - 1, i + 1)], dx = q[0] - x, dz = q[1] - z, l = Math.hypot(dx, dz) || 1;
      const r = new THREE.Mesh(new THREE.DodecahedronGeometry(1 + (i % 3) * 0.4, 0), k.rockG); r.position.set(x - (dz / l) * sd * (E.hw + 1.2), lv + 0.2, z + (dx / l) * sd * (E.hw + 1.2)); r.scale.y = 0.6; r.castShadow = true; grp.add(r);
    }
  }
  // cống nạp: vòm đá + song sắt ở chân tường Ngoại Thành chỗ suối vào cung Khảm (kênh Tốn ra bằng thủy môn — cityblocks3d)
  const grate = new THREE.MeshStandardMaterial({ color: '#202428', roughness: 0.5, metalness: 0.7 });
  { const g = GUA.find((q) => q.id === 'kan'), p = W(g, OUTER_A + 3.6, 0), ry = axisRy(g) + Math.PI / 2;
    const arch = new THREE.Mesh(new THREE.TorusGeometry(4.6, 0.7, 8, 20, Math.PI), k.pave); arch.position.set(p.x, CANAL_WATER, p.z); arch.rotation.y = ry; grp.add(arch);
    const gr = new THREE.Mesh(new THREE.CircleGeometry(4.2, 20, 0, Math.PI), grate); gr.position.set(p.x, CANAL_WATER, p.z); gr.rotation.y = ry; grp.add(gr); }

  return { group: grp, update() {} };
}
