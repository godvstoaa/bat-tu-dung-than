// ============================================================================
//  HỒ SEN SỐNG ĐỘNG — dùng chung cho hồ Sơn Môn (models.pond), hồ biệt phủ (archkit.pond), ao các phường (batquai3d.pond).
//  · Mặt nước: vật liệu nước chung (water3d.waterMaterial kind 'pond' — sóng lăn tăn dời đỉnh, pháp tuyến lớp mịn, phản chiếu trời)
//  · Lá sen: lá khum hình chén, khuyết một rẻo, dập dềnh / nghiêng theo sóng, màu lệch nhẹ từng lá
//  · Hoa sen: búp và hoa nở trên cuống cao 15–45 cm, đung đưa theo gió · Cá chép: bơi đường cong Lissajous dưới mặt nước,
//    quẫy đuôi, thỉnh thoảng đớp mồi làm gợn vòng tròn. Chỉ cập nhật hồ trong tầm (≤ 70 m) — xa thì đứng yên, không tốn.
// ============================================================================
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { waterMaterial } from './water3d.js';

const REG = new Set();
const rng = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
let SHARED = null;
function shared() {
  if (SHARED) return SHARED;
  // lá: chén nông, khuyết rẻo (như lá sen thật), gân màu đậm giữa lá bằng màu đỉnh
  const leaf = new THREE.CircleGeometry(0.34, 20, 0.22, Math.PI * 1.88); leaf.rotateX(-Math.PI / 2);
  const lp = leaf.attributes.position, lc = new Float32Array(lp.count * 3);
  for (let i = 0; i < lp.count; i++) {
    const x = lp.getX(i), z = lp.getZ(i), r = Math.hypot(x, z) / 0.34;
    lp.setY(i, 0.055 * r * r);
    const k = 0.75 + 0.25 * r; lc.set([0.24 * k, 0.48 * k, 0.22 * k], i * 3);
  }
  leaf.setAttribute('color', new THREE.BufferAttribute(lc, 3)); leaf.computeVertexNormals();
  // hoa: cuống + 2 vòng cánh + đài sen vàng (màu đỉnh → một lệnh vẽ cho mọi hoa)
  const parts = [];
  const tint = (g, c) => { const n = g.attributes.position.count, a = new Float32Array(n * 3); const col = new THREE.Color(c); for (let i = 0; i < n; i++) a.set([col.r, col.g, col.b], i * 3); g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g.index ? g.toNonIndexed() : g; };
  const stem = new THREE.CylinderGeometry(0.012, 0.016, 1, 5); stem.translate(0, -0.5, 0); parts.push(tint(stem, '#4f7a37'));
  for (const [n, r0, tilt, len, col] of [[9, 0.05, 0.55, 1.7, '#f6c6d2'], [7, 0.03, 0.25, 1.5, '#f19ab3']]) {
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + (r0 > 0.04 ? 0 : 0.4);
      const pet = new THREE.SphereGeometry(0.075, 8, 6, 0, Math.PI); pet.scale(1, len, 0.55);
      pet.rotateX(-tilt); pet.translate(0, 0.075 * len * 0.55, r0); pet.rotateY(a);
      parts.push(tint(pet, col));
    }
  }
  const pod = new THREE.CylinderGeometry(0.035, 0.025, 0.04, 10); pod.translate(0, 0.07, 0); parts.push(tint(pod, '#e2b84a'));
  const flower = mergeGeometries(parts.map((g) => { for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'color'].includes(k)) g.deleteAttribute(k); return g; }));
  // cá chép: thân thoi + đuôi quạt
  const body = new THREE.SphereGeometry(0.07, 10, 8); body.scale(0.75, 0.55, 2.2);
  const tail = new THREE.ConeGeometry(0.07, 0.14, 4); tail.rotateX(Math.PI / 2); tail.scale(1.2, 0.25, 1); tail.translate(0, 0, -0.19);
  const fin = new THREE.ConeGeometry(0.03, 0.08, 3); fin.rotateZ(Math.PI / 2); fin.translate(0.07, -0.01, 0.03);
  const fish = mergeGeometries([body, tail, fin].map((g) => { const n = g.index ? g.toNonIndexed() : g; n.deleteAttribute('uv'); return n; }));
  const ring = new THREE.RingGeometry(0.85, 1, 32); ring.rotateX(-Math.PI / 2);
  SHARED = {
    leaf, flower, fish, ring,
    leafMat: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, side: THREE.DoubleSide }),
    flowerMat: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, side: THREE.DoubleSide }),
    fishMat: new THREE.MeshStandardMaterial({ roughness: 0.35 }),
    ringMat: new THREE.MeshBasicMaterial({ color: '#e8f4f2', transparent: true, opacity: 0, depthWrite: false }),
  };
  return SHARED;
}

/** lưới mặt nước có đủ đỉnh cho sóng (≤ 1,2 m / ô), đặt nằm ngang; ellipse = true → mặt hình elip */
export function waterSurface(W, D, { ellipse = false, color = '#24493c' } = {}) {
  const nx = Math.max(2, Math.ceil(W / 1.2)), nz = Math.max(2, Math.ceil(D / 1.2));
  const geo = new THREE.PlaneGeometry(W, D, nx, nz); geo.rotateX(-Math.PI / 2);
  if (ellipse) { // ép lưới vuông thành elip (giữ đỉnh trong)
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const u = p.getX(i) / (W / 2), v = p.getZ(i) / (D / 2), m = Math.max(Math.abs(u), Math.abs(v)), r = Math.hypot(u, v) || 1; const k = m / r; p.setX(i, u * k * W / 2); p.setZ(i, v * k * D / 2); }
    geo.computeVertexNormals();
  }
  const w = new THREE.Mesh(geo, waterMaterial({ kind: 'pond', color, tile: 0.55 }));
  w.receiveShadow = true; w.userData.dynamic = true;
  return w;
}

/**
 * Gắn đời sống hồ sen vào group (toạ độ cục bộ của group): bounds { x0, x1, z0, z1 } (hình chữ nhật hoặc elip nội tiếp),
 * y = độ cao mặt nước. Trả { update(t, dt) }; tự đăng ký — gọi updateLotus(px, pz, t, dt) mỗi khung.
 */
export function lotusLife(group, { x0, x1, z0, z1, y = 0.12, ellipse = false, density = 1, fish = true, seed = 7 }) {
  const S = shared(), r = rng(seed * 7919 + 13);
  const W = x1 - x0, D = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, area = W * D * (ellipse ? 0.785 : 1);
  const inside = (x, z) => (ellipse ? ((x - cx) / (W / 2)) ** 2 + ((z - cz) / (D / 2)) ** 2 < 0.8 : x > x0 + 0.3 && x < x1 - 0.3 && z > z0 + 0.3 && z < z1 - 0.3);
  // sen mọc thành cụm (không rải đều): 2–5 tâm cụm, lá dày quanh tâm
  const clusters = Array.from({ length: Math.max(2, Math.min(5, Math.round(area / 30))) }, () => [x0 + W * (0.15 + 0.7 * r()), z0 + D * (0.15 + 0.7 * r())]);
  const nPad = Math.round(Math.min(160, area * 0.42 * density)), nFlower = Math.round(nPad * 0.28);
  const pads = [];
  for (let i = 0, guard = 0; pads.length < nPad && guard < nPad * 8; guard++) {
    const c = clusters[i++ % clusters.length], rr = Math.sqrt(r()) * Math.min(W, D) * 0.42, a = r() * Math.PI * 2;
    const x = c[0] + Math.cos(a) * rr, z = c[1] + Math.sin(a) * rr * 0.8;
    if (!inside(x, z)) continue;
    pads.push({ x, z, s: 0.6 + r() * 0.75, ry: r() * Math.PI * 2, ph: r() * 6.28, tint: 0.85 + r() * 0.3 });
  }
  const flowers = Array.from({ length: Math.min(nFlower, pads.length) }, (_, i) => { const p = pads[(i * 7) % pads.length]; return { x: p.x + (r() - 0.5) * 0.3, z: p.z + (r() - 0.5) * 0.3, h: 0.15 + r() * 0.3, s: r() < 0.3 ? 0.55 : 0.85 + r() * 0.35, ph: r() * 6.28, bud: r() < 0.25 }; });
  const padIM = new THREE.InstancedMesh(S.leaf, S.leafMat, Math.max(1, pads.length));
  const flIM = new THREE.InstancedMesh(S.flower, S.flowerMat, Math.max(1, flowers.length));
  padIM.count = pads.length; flIM.count = flowers.length;
  const col = new THREE.Color();
  pads.forEach((p, i) => padIM.setColorAt(i, col.setRGB(p.tint, p.tint * (0.95 + 0.1 * Math.sin(i)), p.tint * 0.9)));
  for (const im of [padIM, flIM]) { im.userData.dynamic = true; im.receiveShadow = true; im.castShadow = false; im.frustumCulled = false; group.add(im); }
  // cá chép
  const nFish = fish ? Math.max(2, Math.min(7, Math.round(area / 22))) : 0;
  const fishes = Array.from({ length: nFish }, () => ({ cx: cx + (r() - 0.5) * W * 0.3, cz: cz + (r() - 0.5) * D * 0.3, ax: W * (0.2 + 0.18 * r()), az: D * (0.18 + 0.15 * r()), w: (0.12 + 0.12 * r()) * (r() < 0.5 ? -1 : 1), ph: r() * 6.28, s: 0.8 + r() * 0.6 }));
  const fishIM = nFish ? new THREE.InstancedMesh(S.fish, S.fishMat, nFish) : null;
  if (fishIM) {
    const C = ['#e8642a', '#f2f0ea', '#f08a24', '#d8402c', '#f7d27a', '#efefef', '#e05a2a'];
    fishes.forEach((f, i) => fishIM.setColorAt(i, col.set(C[i % C.length])));
    fishIM.userData.dynamic = true; fishIM.frustumCulled = false; group.add(fishIM);
  }
  const rings = Array.from({ length: 3 }, () => { const m = new THREE.Mesh(S.ring, S.ringMat.clone()); m.visible = false; m.userData.dynamic = true; m.userData.life = 9; group.add(m); return m; });
  let ringT = 1 + r() * 2;
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), P = new THREE.Vector3(), SC = new THREE.Vector3();
  const fishPos = (f, t) => {
    const a = t * f.w + f.ph;
    return { x: f.cx + Math.cos(a) * f.ax, z: f.cz + Math.sin(2 * a) * f.az * 0.6, dx: -Math.sin(a) * f.ax * f.w, dz: Math.cos(2 * a) * 2 * f.az * 0.6 * f.w };
  };
  const life = {
    group,
    update(t, dt) {
      const wind = Math.sin(t * 0.37) * 0.5 + Math.sin(t * 0.11 + 1.3) * 0.5;
      pads.forEach((p, i) => {
        const bob = Math.sin(t * 0.9 + p.ph) * 0.012 + Math.sin(t * 1.7 + p.x * 0.8 + p.z * 0.6) * 0.008;
        E.set(Math.sin(t * 1.1 + p.ph) * 0.05, p.ry + Math.sin(t * 0.13 + p.ph) * 0.08, Math.cos(t * 0.95 + p.ph * 1.3) * 0.05);
        M.compose(P.set(p.x, y + 0.012 + bob, p.z), Q.setFromEuler(E), SC.setScalar(p.s)); padIM.setMatrixAt(i, M);
      });
      padIM.instanceMatrix.needsUpdate = true;
      flowers.forEach((f, i) => {
        E.set(Math.sin(t * 0.8 + f.ph) * 0.07 + wind * 0.05, f.ph, Math.cos(t * 0.7 + f.ph) * 0.07);
        M.compose(P.set(f.x, y + f.h + Math.sin(t * 0.9 + f.ph) * 0.01, f.z), Q.setFromEuler(E), SC.set(f.s, f.bud ? f.s * 1.3 : f.s, f.s));
        // búp: cánh khép (thu ngang) — dùng tỷ lệ không đều
        if (f.bud) M.scale(SC.set(0.55, 1, 0.55));
        flIM.setMatrixAt(i, M);
      });
      flIM.instanceMatrix.needsUpdate = true;
      if (fishIM) {
        fishes.forEach((f, i) => {
          const p = fishPos(f, t), wig = Math.sin(t * 7 + f.ph) * 0.18;
          E.set(0, Math.atan2(p.dx, p.dz) + wig, 0);
          M.compose(P.set(p.x, y - 0.16 - 0.04 * Math.sin(t * 0.5 + f.ph), p.z), Q.setFromEuler(E), SC.setScalar(f.s)); fishIM.setMatrixAt(i, M);
        });
        fishIM.instanceMatrix.needsUpdate = true;
        ringT -= dt;
        if (ringT <= 0 && fishes.length) {
          ringT = 1.4 + Math.random() * 2.6;
          const g = rings.find((m) => m.userData.life > 1.6), f = fishes[Math.floor(Math.random() * fishes.length)];
          if (g) { const p = fishPos(f, t); g.position.set(p.x, y + 0.03, p.z); g.userData.life = 0; g.visible = true; }
        }
      }
      for (const g of rings) {
        if (!g.visible) continue;
        g.userData.life += dt; const k = g.userData.life / 1.6;
        if (k >= 1) { g.visible = false; continue; }
        g.scale.setScalar(0.08 + k * 0.7); g.material.opacity = 0.45 * (1 - k);
      }
    },
    world: null,
  };
  REG.add(life);
  return life;
}
/** gọi mỗi khung: chỉ hồ trong tầm (≤ 70 m) cập nhật */
export function updateLotus(px, pz, t, dt) {
  for (const L of REG) {
    let top = L.group; while (top.parent) top = top.parent;
    if (!top.isScene) { if (L.world) REG.delete(L); continue; } // hồ đã gỡ khỏi cảnh (biệt phủ dỡ khi đi xa)
    if (!L.world) { L.world = new THREE.Vector3(); L.group.getWorldPosition(L.world); }
    if (Math.abs(L.world.x - px) > 70 || Math.abs(L.world.z - pz) > 70) continue;
    L.update(t, dt);
  }
}
export function disposeLotus(group) { for (const L of REG) if (L.group === group) REG.delete(L); }
