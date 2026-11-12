// ============================================================================
//  CỬU TRỌNG THIÊN — dựng hình (bố cục: heaven.js · NHA-DIADIEM-MANIFEST §2). Dựng lười lần đầu bước vào vùng trời.
//   · mặt đảo lát ngọc trắng (thảm cỏ tiên trong tường phủ) + ĐÁY ĐÁ treo hình nón karst gồ ghề (Jade Chamber / Trương Gia Giới)
//   · 8 cầu ngọc · lan can ngọc dọc mép đảo / cầu (trụ mỗi 3 m, chừa lối cầu) · Nam Thiên Môn · đèn đá quảng trường
//   · biển mây 2 lớp trôi (y −28 / −46) · 40 cụm mây lơ lửng quay mặt về camera · 12 khối đá nổi bập bềnh
//  Ngân sách: ≤ 25 lệnh vẽ, ≤ 120k tam giác (không tính tiên phủ — mansion3d dựng như biệt phủ).
// ============================================================================
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { HEAVEN, heavenLayout, inHeaven, THIEN_THE } from './heaven.js';
import { cloudTex, rng } from './textures.js';
import { placeModel, instanceModel } from './assets.js';

const JADE = new THREE.Color('#ece7da'), JADE2 = new THREE.Color('#d9d2c2'), LAWN = new THREE.Color('#86b46c'), ROCK = new THREE.Color('#8a8172'), ROCK2 = new THREE.Color('#5f584e'), MOSS = new THREE.Color('#6f9a58');

function slabTex() {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  g.fillStyle = '#f2eee4'; g.fillRect(0, 0, 256, 256);
  const r = rng(91);
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { const v = 228 + Math.floor(r() * 22); g.fillStyle = `rgb(${v},${v - 3},${v - 10})`; g.fillRect(x * 64 + 1, y * 64 + 1, 62, 62); }
  g.strokeStyle = 'rgba(150,140,120,0.55)'; g.lineWidth = 2; for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * 64, 0); g.lineTo(k * 64, 256); g.moveTo(0, k * 64); g.lineTo(256, k * 64); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
const paint = (geo, col) => { const n = geo.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) col.toArray(a, i * 3); geo.setAttribute('color', new THREE.BufferAttribute(a, 3)); return geo; };
const place = (geo, x, y, z, ry = 0) => { geo.rotateY(ry); geo.translate(x, y, z); return geo; };

/** đáy đá treo: miệng trên khớp nền chữ nhật (hw × hd), thuôn nhọn xuống sâu `depth`, gồ ghề theo nhiễu */
function rockUnder(hw, hd, depth, seed) {
  const R = 28, H = 7, geo = new THREE.CylinderGeometry(1, 0.06, depth, R, H, true);
  geo.translate(0, -depth / 2 - 0.6, 0);
  const p = geo.attributes.position, r = rng(seed), bump = Array.from({ length: R * 3 }, () => r());
  const col = new Float32Array(p.count * 3), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), t = Math.min(1, Math.max(0, -(y + 0.6) / depth)); // 0 = miệng, 1 = mũi
    const th = Math.atan2(z, x), rad = Math.hypot(x, z) || 1e-6;
    // miệng: vuông theo nền (siêu elip) → dưới: tròn dần, lồi lõm theo nhiễu góc + tầng
    const sq = 1 / Math.max(Math.abs(Math.cos(th)), Math.abs(Math.sin(th))), shape = sq * (1 - t) + 1.12 * t;
    const k = Math.floor(((th + Math.PI) / (Math.PI * 2)) * R * 3) % (R * 3), n = t < 0.05 ? 1 : 0.82 + bump[k] * 0.32 * (0.4 + t);
    p.setXYZ(i, Math.cos(th) * rad * shape * n * hw, y - (t > 0.05 ? bump[(k + 7) % (R * 3)] * depth * 0.06 : 0), Math.sin(th) * rad * shape * n * hd);
    c.copy(ROCK).lerp(ROCK2, Math.min(1, t * 1.2 + bump[k] * 0.25)); if (t < 0.12) c.lerp(MOSS, 0.55 * (1 - t / 0.12));
    c.toArray(col, i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  return geo;
}

export function createHeaven(scene, { citizens = null } = {}) {
  const grp = new THREE.Group(); grp.name = 'heaven'; grp.visible = false; scene.add(grp);
  let built = false, clouds = null, puffs = null, rocks = [], seaA = null, seaB = null;
  const L = heavenLayout();
  // --- THIÊN THÊ ở Hậu Sơn (G-6.1): cổng đá + 18 bậc ngọc lơ lửng xoắn lên trời + cột sáng. ≈ 4 lệnh vẽ, < 3k tam giác (+ cổng)
  const stair = new THREE.Group(); stair.name = 'thienthe'; stair.position.set(THIEN_THE.x, 0, THIEN_THE.z); scene.add(stair);
  {
    const steps = [];
    for (let k = 0; k < 18; k++) { const a = k * 0.42, r = 3.2 + k * 0.12, g = new THREE.CylinderGeometry(1.25, 1.05, 0.28, 10); steps.push(place(g, Math.sin(a) * r, 0.35 + k * 1.55, -2.5 - Math.cos(a) * r)); }
    const stepMesh = new THREE.Mesh(mergeGeometries(steps, false), new THREE.MeshStandardMaterial({ color: '#f3efe4', emissive: '#c8d8ff', emissiveIntensity: 0.35, roughness: 0.4, transparent: true, opacity: 0.92 }));
    steps.forEach((g) => g.dispose());
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 3.4, 60, 16, 1, true), new THREE.MeshBasicMaterial({ color: '#fff3c8', transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
    beam.position.set(0, 30, -2.5);
    const halo = new THREE.Mesh(new THREE.RingGeometry(2.6, 4.2, 32), new THREE.MeshBasicMaterial({ color: '#fff0b0', transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide }));
    halo.rotation.x = -Math.PI / 2; halo.position.set(0, 0.06, -2.5);
    stair.add(stepMesh, beam, halo, plaque('天梯 · Thiên Thê', 0, 6.4, 1.2));
    placeModel(stair, 'lib_paifang', { fit: { width: 8 }, at: { x: 0, y: 0, z: 1, ry: 0 } }).catch(() => {});
    stair.userData = { stepMesh, beam, halo };
  }

  // --- TIÊN ĐỒNG, TIÊN NỮ (G-6.2): 8 người dạo lối quảng trường giữa (vòng 65 m quanh tường Quân Thiên Phủ) + thềm Nam Thiên Môn
  const TIEN_LINES = [
    ['Khách từ hạ giới lên? Chín cõi trời này mỗi cõi một tiên phủ, phủ nào chưa chủ thì mua được.', 'Quân Thiên ở giữa là phủ của bậc chí tôn — giá cũng gấp đôi đấy.'],
    ['Đi theo cầu ngọc là tới cổng từng phủ, đừng ngó xuống biển mây kẻo chóng mặt.', 'Muốn về hạ giới thì tới Nam Thiên Môn mà «Hạ phàm».'],
    ['Thương Thiên phía Đông mái xanh như ngọc bích, hợp người mệnh Mộc lắm.', 'Viêm Thiên phía Nam mái đỏ, khí Hỏa vượng.'],
    ['Huyền Thiên phía Bắc thâm trầm, người mệnh Thủy ở đó yên giấc lắm.', 'Hạo Thiên phía Tây mái bạc, khí Kim thanh sạch.'],
  ];
  const tienNpcs = () => {
    const { cx, cz } = HEAVEN, R = 65, out = [], names = ['Thanh Y Đồng Tử', 'Kim Đồng', 'Ngọc Nữ', 'Bích Vân Tiên Nữ', 'Hạc Đồng', 'Tử Vân Tiên Nữ', 'Lam Hà Đồng Tử', 'Hồng Liên Tiên Nữ'];
    const ring = (a0) => Array.from({ length: 9 }, (_, k) => { const a = a0 + k * (Math.PI / 4); const c = Math.cos(a), n = Math.sin(a), m = Math.max(Math.abs(c), Math.abs(n)); return { x: cx + (c / m) * R, z: cz + (n / m) * R }; });
    for (let i = 0; i < 8; i++) { const P = ring(i * 0.79); out.push({ id: `tien_${i}`, name: names[i], role: i % 2 ? 'Tiên nữ' : 'Tiên đồng', look: i % 2 ? 'hero_f' : 'hero_m', gua: 'qian', wx: '金', lines: TIEN_LINES[i % TIEN_LINES.length], x: P[0].x, z: P[0].z, path: i % 3 === 2 ? null : P, near: 60 }); }
    return out;
  };
  let tienOn = false;
  const setTien = (on) => { if (!citizens || on === tienOn) return; tienOn = on; for (const n of tienNpcs()) if (on) citizens.add(n); else citizens.remove(n.id); };
  // --- hạc trắng bay vòng (6 con, một lệnh vẽ, vỗ cánh bằng xoay ma trận)
  let cranes = null;
  const craneGeo = () => {
    const v = new Float32Array([0, 0, 0.9, 0, 0, -0.7, -1.6, 0.25, 0, 0, 0, 0.9, 1.6, 0.25, 0, 0, 0, -0.7, 0, 0.05, 0.9, 0, 0.05, 1.5, 0.08, 0, 0.9]);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(v, 3)); g.computeVertexNormals(); return g;
  };
  function build() {
    built = true;
    cranes = new THREE.InstancedMesh(craneGeo(), new THREE.MeshBasicMaterial({ color: '#fbfaf5', side: THREE.DoubleSide, fog: true }), 6); cranes.frustumCulled = false; grp.add(cranes);
    const tops = [], unders = [], lawns = [], floats = [];
    // --- đảo
    L.islands.forEach((s, k) => {
      const top = new THREE.BoxGeometry(s.hw * 2, 1.2, s.hd * 2); top.translate(0, -0.6, 0);
      // UV theo mét (ô lát 4 m)
      const uv = top.attributes.uv, pp = top.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, (pp.getX(i) + (pp.getY(i) > -0.1 ? 0 : pp.getZ(i))) / 16, (pp.getZ(i) + (pp.getY(i) > -0.1 ? 0 : pp.getY(i))) / 16);
      tops.push(place(top, s.x, 0, s.z, s.ry));
      unders.push(place(rockUnder(s.hw, s.hd, Math.max(s.hw, s.hd) * (s.centre ? 0.5 : 0.42), 400 + k * 17), s.x, 0, s.z, s.ry));
    });
    // thảm cỏ tiên trong tường phủ (mansion3d không dựng nền — ở thành là địa hình)
    for (const p of L.plots) { const g = new THREE.BoxGeometry(p.W - 1, 0.04, p.D - 1); lawns.push(paint(place(g, p.x, 0.02, p.z, p.ry), LAWN)); }
    // --- cầu ngọc (mặt lát) + vòm đỡ
    for (const b of L.bridges) {
      const g = new THREE.BoxGeometry(b.w, 1.0, b.len); g.translate(0, -0.5, 0);
      const uv = g.attributes.uv, pp = g.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, pp.getX(i) / 16, pp.getZ(i) / 16);
      tops.push(place(g, b.x, 0, b.z, b.ry));
      for (const f of [0.3, 0.7]) { const a = new THREE.CylinderGeometry(0.9, 0.2, 9, 8); a.translate(0, -5.4, 0); unders.push(paint(place(a, b.a.x + (b.b.x - b.a.x) * f, 0, b.a.z + (b.b.z - b.a.z) * f), ROCK2)); }
    }
    // đá nổi nhỏ quanh đảo: đá thủ tục (≈ 450 tam giác / khối) gộp chung mesh đá — model rock_island 17k / khối quá nặng
    { const rr = rng(55); for (let k = 0; k < 12; k++) { const a = rr() * Math.PI * 2, d = 170 + rr() * 300, sz = 4 + rr() * 9; const g = rockUnder(sz, sz * (0.7 + rr() * 0.5), sz * 1.6, 900 + k); const cap = paint(new THREE.CylinderGeometry(sz * 1.02, sz * 1.02, 0.6, 12), MOSS); cap.translate(0, -0.3, 0); const y = -8 + rr() * 26, x = HEAVEN.cx + Math.cos(a) * d, z = HEAVEN.cz + Math.sin(a) * d; floats.push(place(g, x, y, z, rr() * 6), place(cap, x, y, z)); } }
    const tex = slabTex();
    const topMat = new THREE.MeshStandardMaterial({ map: tex, color: JADE, roughness: 0.7 });
    const topMesh = new THREE.Mesh(mergeGeometries(tops, false), topMat); topMesh.receiveShadow = true; grp.add(topMesh);
    const rockMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true });
    const rockMesh = new THREE.Mesh(mergeGeometries(unders, false), rockMat); grp.add(rockMesh);
    const floatMesh = new THREE.Mesh(mergeGeometries(floats, false), rockMat); grp.add(floatMesh); rocks = [floatMesh];
    const lawnMesh = new THREE.Mesh(mergeGeometries(lawns, false), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 })); lawnMesh.receiveShadow = true; grp.add(lawnMesh);
    [...tops, ...unders, ...lawns, ...floats].forEach((g) => g.dispose());

    // --- lan can ngọc: trụ mỗi 3 m + tay vịn, dọc mép đảo và hai bên cầu, chừa miệng cầu
    const posts = [], rails = [];
    const gapAt = (x, z) => L.bridges.some((b) => { const ux = (b.b.x - b.a.x) / b.len, uz = (b.b.z - b.a.z) / b.len, dx = x - b.a.x, dz = z - b.a.z, along = dx * ux + dz * uz, side = Math.abs(dx * uz - dz * ux); return side < b.w / 2 + 0.4 && along > -4 && along < b.len + 4; })
      || Math.hypot(x - L.gate.x, z - L.gate.z) < 4.5
      || L.islands.filter((s) => { const c = Math.cos(s.ry), n = Math.sin(s.ry), dx = x - s.x, dz = z - s.z; return Math.abs(c * dx - n * dz) < s.hw + 1 && Math.abs(n * dx + c * dz) < s.hd + 1; }).length >= 2; // mép giáp đảo khác (thềm cổng ↔ quảng trường): không lan can
    const edge = (ax, az, bx, bz) => {
      const len = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(len / 3)), ry = Math.atan2(bx - ax, bz - az);
      for (let i = 0; i <= n; i++) { const x = ax + (bx - ax) * (i / n), z = az + (bz - az) * (i / n); if (!gapAt(x, z)) posts.push([x, z]); }
      for (let i = 0; i < n; i++) { const x = ax + (bx - ax) * ((i + 0.5) / n), z = az + (bz - az) * ((i + 0.5) / n); if (!gapAt(x, z)) rails.push([x, z, ry, len / n]); }
    };
    const W = (s, lx, lz) => { const c = Math.cos(s.ry), sn = Math.sin(s.ry); return [s.x + c * lx + sn * lz, s.z - sn * lx + c * lz]; };
    for (const s of L.islands) { const q = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => W(s, a * (s.hw - 0.3), b * (s.hd - 0.3))); for (let i = 0; i < 4; i++) edge(...q[i], ...q[(i + 1) % 4]); }
    for (const b of L.bridges) for (const sd of [-1, 1]) {
      const ux = (b.b.x - b.a.x) / b.len, uz = (b.b.z - b.a.z) / b.len, ox = uz * sd * (b.w / 2 - 0.25), oz = -ux * sd * (b.w / 2 - 0.25);
      const len = b.len - 8, n = Math.round(len / 3), ry = Math.atan2(ux, uz);
      for (let i = 0; i <= n; i++) { const t = 4 + len * (i / n); posts.push([b.a.x + ux * t + ox, b.a.z + uz * t + oz]); }
      for (let i = 0; i < n; i++) { const t = 4 + len * ((i + 0.5) / n); rails.push([b.a.x + ux * t + ox, b.a.z + uz * t + oz, ry, len / n]); }
    }
    const railMat = new THREE.MeshStandardMaterial({ color: '#f4f0e6', roughness: 0.55 });
    const postGeo = new THREE.BoxGeometry(0.32, 1.15, 0.32); postGeo.translate(0, 0.575, 0);
    const railGeo = new THREE.BoxGeometry(0.16, 0.14, 1); railGeo.translate(0, 0.95, 0);
    const lowGeo = new THREE.BoxGeometry(0.12, 0.1, 1); lowGeo.translate(0, 0.3, 0);
    const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
    const imP = new THREE.InstancedMesh(postGeo, railMat, posts.length);
    posts.forEach(([x, z], i) => imP.setMatrixAt(i, m4.makeTranslation(x, 0, z)));
    const mkRail = (geo) => { const im = new THREE.InstancedMesh(geo, railMat, rails.length); rails.forEach(([x, z, ry, len], i) => { q4.setFromAxisAngle(up, ry); im.setMatrixAt(i, m4.compose(new THREE.Vector3(x, 0, z), q4, new THREE.Vector3(1, 1, len + 0.05))); }); return im; };
    grp.add(imP, mkRail(railGeo), mkRail(lowGeo));

    // --- biển mây 2 lớp (trôi ngược chiều) + sương dưới đảo
    const ct = cloudTex(23); ct.wrapS = ct.wrapT = THREE.RepeatWrapping; ct.repeat.set(9, 9);
    const ct2 = ct.clone(); ct2.needsUpdate = true; ct2.repeat.set(5, 5);
    seaA = new THREE.Mesh(new THREE.PlaneGeometry(3600, 3600), new THREE.MeshBasicMaterial({ map: ct, color: '#fbf7f0', transparent: true, opacity: 0.95, depthWrite: false, fog: true }));
    seaB = new THREE.Mesh(new THREE.PlaneGeometry(3600, 3600), new THREE.MeshBasicMaterial({ map: ct2, color: '#e8dcf0', transparent: true, opacity: 0.9, depthWrite: false, fog: true }));
    for (const [m, y] of [[seaA, -28], [seaB, -46]]) { m.rotation.x = -Math.PI / 2; m.position.set(HEAVEN.cx, y, HEAVEN.cz); m.renderOrder = -1; grp.add(m); }
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(3600, 3600), new THREE.MeshBasicMaterial({ color: '#e9e2ee', fog: true }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(HEAVEN.cx, -60, HEAVEN.cz); grp.add(floor);

    // --- cụm mây lơ lửng giữa các đảo (quay mặt về camera mỗi khung)
    const r = rng(77), N = 40, puffGeo = new THREE.PlaneGeometry(1, 1);
    puffs = new THREE.InstancedMesh(puffGeo, new THREE.MeshBasicMaterial({ map: cloudTex(31), color: '#ffffff', transparent: true, opacity: 0.8, depthWrite: false, fog: true }), N);
    clouds = Array.from({ length: N }, () => { const a = r() * Math.PI * 2, d = 120 + r() * 380; return { x: HEAVEN.cx + Math.cos(a) * d, y: -27 + r() * 19, z: HEAVEN.cz + Math.sin(a) * d, s: 30 + r() * 50, v: 1.5 + r() * 2.5 }; });
    puffs.frustumCulled = false; grp.add(puffs);

    // --- Nam Thiên Môn (cổng lớn) + biển, đèn đá dọc quảng trường, đá nổi
    placeModel(grp, 'sect_gate_grand', { fit: { width: 15 }, at: { x: L.gate.x, y: 0, z: L.gate.z - 1.5, ry: 0 } }).catch(() => {}); // cổng mốc: bậc gần là bản gốc (~130k) như cổng Sơn Môn — ngoài ngân sách cảnh (manifest §2)
    grp.add(plaque('南天門 · Nam Thiên Môn', L.gate.x, 11.5, L.gate.z + 0.2));
    const lan = [];
    for (const sx of [-1, 1]) for (let k = 0; k < 2; k++) lan.push({ x: L.gate.x + sx * 9, y: 0, z: L.gate.z - 7 - k * 10, ry: 0, s: 2.2 });
    instanceModel(grp, 'pr_stonelantern', lan).catch(() => {});
  }

  const cam = new THREE.Vector3(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), pos = new THREE.Vector3();
  let t = 0;
  return {
    group: grp,
    /** mỗi khung: hiện / ẩn theo vùng, dựng lười, mây trôi */
    update(px, pz, dt, camera) {
      { const near = Math.hypot(px - THIEN_THE.x, pz - THIEN_THE.z) < 420; stair.visible = near; if (near) { const u = stair.userData; u.stepMesh.position.y = Math.sin(t * 0.8) * 0.15; u.halo.material.opacity = 0.25 + Math.sin(t * 2) * 0.1; u.beam.rotation.y = t * 0.2; } }
      const on = inHeaven(px, pz);
      grp.visible = on; setTien(on);
      if (!on) { t += dt; return false; }
      if (!built) build();
      t += dt;
      if (seaA) { seaA.material.map.offset.x = (t * 0.004) % 1; seaB.material.map.offset.y = (t * 0.003) % 1; }
      if (puffs && camera) {
        camera.getWorldPosition(cam); q.copy(camera.quaternion);
        clouds.forEach((c, i) => { const x = HEAVEN.cx + ((c.x - HEAVEN.cx + t * c.v + 500) % 1000) - 500; pos.set(x, c.y, c.z); sc.set(c.s, c.s * 0.55, 1); puffs.setMatrixAt(i, m4.compose(pos, q, sc)); });
        puffs.instanceMatrix.needsUpdate = true;
      }
      for (const g of rocks) g.position.y = Math.sin(t * 0.4) * 0.8;
      if (cranes) { for (let i = 0; i < 6; i++) { const a = t * 0.12 + i * 1.05, r = 140 + (i % 3) * 70, fl = Math.sin(t * 4 + i) * 0.5; pos.set(HEAVEN.cx + Math.cos(a) * r, 14 + (i % 2) * 9 + Math.sin(t * 0.5 + i) * 2, HEAVEN.cz + Math.sin(a) * r); q.setFromEuler(new THREE.Euler(0, -a, fl * 0.3)); sc.set(1.6, 1.6 + fl, 1.6); cranes.setMatrixAt(i, m4.compose(pos, q, sc)); } cranes.instanceMatrix.needsUpdate = true; }
      return true;
    },
  };
}

function plaque(text, x, y, z) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 96; const g = c.getContext('2d');
  g.fillStyle = '#7a1c14'; g.fillRect(0, 0, 512, 96); g.strokeStyle = '#e8c56a'; g.lineWidth = 8; g.strokeRect(6, 6, 500, 84);
  g.fillStyle = '#f5d777'; g.font = 'bold 46px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 256, 50);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(7, 1.3), new THREE.MeshBasicMaterial({ map: t, side: THREE.DoubleSide }));
  m.position.set(x, y, z); return m;
}
