// ============================================================================
//  HUYỀN QUÁN 3D — mô hình procedural (spec mục 9.4). Không file mô hình ngoài.
//  Toạ độ: ô lưới (x, y) → thế giới X = (x − 10)·U, Z = (y − 7)·U, Y hướng lên.
// ============================================================================
import * as THREE from 'three';
import { lotusLife, waterSurface } from './lotus.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as TX from './textures.js';

export const U = 1.6;
export const toWorld = (x, y) => ({ x: (x - 10) * U, z: (y - 7) * U });
export const toTile = (X, Z) => ({ x: X / U + 10, y: Z / U + 7 });

// ---------------------------------------------------------------------------
// Vật liệu dùng chung
// ---------------------------------------------------------------------------
const std = (o) => new THREE.MeshStandardMaterial(o);
let M = null;
export function materials() {
  if (M) return M;
  M = {
    son: std({ map: TX.lacquerTex(TX.PAL.son, { seed: 3 }), roughness: 0.38, metalness: 0.05 }),
    lacquer: std({ map: TX.lacquerTex(TX.PAL.lacquer, { seed: 4, gold: 1, streak: 0.06 }), roughness: 0.35 }),
    wood: std({ map: TX.lacquerTex(TX.PAL.canhGian, { seed: 8, gold: 0.15, streak: 0.2 }), roughness: 0.6 }),
    panel: std({ map: TX.panelTex(), roughness: 0.45 }),
    gold: std({ color: TX.PAL.gold, roughness: 0.3, metalness: 0.85 }),
    bronze: std({ color: '#8a6a34', roughness: 0.45, metalness: 0.8 }),
    stone: std({ map: TX.stoneTex({ seed: 9, tiles: 2 }), roughness: 0.9 }),
    stoneDark: std({ color: '#4a433d', roughness: 0.95 }),
    roof: std({ map: TX.roofTex(), roughness: 0.7, side: THREE.FrontSide }),
    soffit: std({ color: '#2a1610', roughness: 0.8, side: THREE.BackSide }),
    paper: std({ color: TX.PAL.egg, roughness: 0.9 }),
    ink: std({ color: '#151214', roughness: 0.4 }),
    skin: std({ color: '#e7c3a0', roughness: 0.7 }),
    hair: std({ color: '#1b1514', roughness: 0.6 }),
    straw: std({ color: '#d8bf82', roughness: 0.85 }),
    cushion: std({ color: '#b07a2a', roughness: 0.8 }),
    cloth: std({ color: '#8c1611', roughness: 0.75 }),
    white: std({ color: '#f2efe8', roughness: 0.7 }),
    leaf: std({ color: '#3f6b3a', roughness: 0.8, flatShading: true }),
    pine: std({ color: '#22432e', roughness: 0.85, flatShading: true }),
    bark: std({ color: '#4a3020', roughness: 0.95, flatShading: true }),
    blossom: std({ color: '#f1a7bd', roughness: 0.7, flatShading: true }),
    lotus: std({ color: '#f4b8c8', roughness: 0.6 }),
    lotusLeaf: std({ color: '#2f6b3a', roughness: 0.6, side: THREE.DoubleSide }),
    bamboo: std({ map: TX.bambooTex(), roughness: 0.6 }),
    rock: std({ map: TX.rockTex(), roughness: 0.95, flatShading: true }),
    moss: std({ map: TX.mossTex(), roughness: 0.95 }),
    lanternRed: std({ color: '#c62a1c', emissive: '#ff3a12', emissiveIntensity: 0.6, roughness: 0.6 }),
    flame: new THREE.MeshBasicMaterial({ color: '#ffc46b' }),
    ember: new THREE.MeshBasicMaterial({ color: '#ff7a2f' }),
    stick: std({ color: '#9c3b22', roughness: 0.8 }),
    tea: std({ color: '#c9b46a', roughness: 0.2 }),
    celadon: std({ color: '#9fbfae', roughness: 0.25 }),
  };
  return M;
}

// ---------------------------------------------------------------------------
// Tiện ích hình khối
// ---------------------------------------------------------------------------
export function mesh(geo, mat, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, shadow = true } = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z); m.rotation.set(rx, ry, rz);
  m.castShadow = shadow; m.receiveShadow = true;
  return m;
}
const box = (w, h, d, mat, o) => mesh(new THREE.BoxGeometry(w, h, d), mat, o);
const cyl = (rt, rb, h, mat, o, seg = 16) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat, o);
const lathe = (pts, mat, o, seg = 24) => mesh(new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg), mat, o);

// Gộp hình học tĩnh theo vật liệu → ít draw call. Giữ userData của group.
// chữ ký vật liệu: hai vật liệu khác bản nhưng cùng mọi thuộc tính vẽ → gộp chung (dedupe — đồ dựng bằng mã hay tạo vật liệu mới mỗi khối)
const matSig = (m) => [m.type, m.color?.getHexString(), m.emissive?.getHexString(), m.emissiveIntensity, m.map?.uuid, m.normalMap?.uuid, m.roughnessMap?.uuid,
  m.roughness, m.metalness, m.transparent, m.opacity, m.side, m.vertexColors, m.flatShading, m.alphaTest, m.depthWrite, m.fog, m.userData?.glow ? m.uuid : ''].join('|');
export function mergeStatic(group, { keepFootprints = false, dedupe = false } = {}) { // keepFootprints: không gộp vật có va chạm (raze.js ẩn qua tham chiếu)
  group.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(group.matrixWorld).invert();
  const buckets = new Map();
  const keep = [];
  group.traverse((o) => {
    if (!o.isMesh || o.userData.dynamic || (keepFootprints && o.userData.footprint) || o.isInstancedMesh || o.isSkinnedMesh || Array.isArray(o.material)) return;
    let p = o.parent; let dyn = false;
    while (p && p !== group) { if (p.userData.dynamic || (keepFootprints && p.userData.footprint) || p.isLOD) dyn = true; p = p.parent; } // con của THREE.LOD: gộp ra ngoài là phá bậc chi tiết
    if (dyn) return;
    const g = o.geometry.index ? o.geometry : null;
    if (!g || !g.attributes.uv || !g.attributes.normal) { keep.push(o); return; }
    const key = (dedupe ? matSig(o.material) : o.material.uuid) + (o.castShadow ? 's' : 'n');
    if (!buckets.has(key)) buckets.set(key, { mat: o.material, cast: o.castShadow, geos: [], meshes: [] });
    const gg = g.clone();
    gg.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
    for (const k of Object.keys(gg.attributes)) if (!['position', 'normal', 'uv'].includes(k)) gg.deleteAttribute(k);
    const b = buckets.get(key);
    b.geos.push(gg); b.meshes.push(o);
  });
  for (const b of buckets.values()) {
    if (b.meshes.length < 2) continue;
    const merged = mergeGeometries(b.geos, false);
    if (!merged) continue;
    for (const o of b.meshes) o.parent.remove(o);
    const m = new THREE.Mesh(merged, b.mat);
    m.castShadow = b.cast; m.receiveShadow = true;
    group.add(m);
  }
  return group;
}

// Clone vật liệu của một group (để làm mờ riêng khi che camera).
export function ownMaterials(group) {
  const cache = new Map();
  group.traverse((o) => {
    if (!o.isMesh) return;
    if (!cache.has(o.material.uuid)) {
      const c = o.material.clone();
      c.transparent = true; c.opacity = 1;
      cache.set(o.material.uuid, c);
    }
    o.material = cache.get(o.material.uuid);
  });
  group.userData.fadeMats = [...cache.values()];
  return group;
}

// ---------------------------------------------------------------------------
// Mái cong (hip roof đầu đao vểnh) — một mặt liên tục + bờ nóc, bờ chảy, viền mái.
// ---------------------------------------------------------------------------
function roofHeight(W, D, H, upturn) {
  const ridge = Math.max(0, (W - D) / 2);
  return (x, z) => {
    const ax = Math.max(0, Math.abs(x) - ridge) / (D / 2);
    const az = Math.abs(z) / (D / 2);
    const t = Math.min(1, Math.max(ax, az));
    let y = H * Math.pow(1 - t, 1.7) + 0.06 * H * Math.pow(t, 5);
    y += upturn * Math.pow(Math.min(ax, az), 2.2) * Math.pow(t, 5);
    return y;
  };
}

export function roof(W, D, H, { upturn = 0.55, mats } = {}) {
  const m = mats || materials();
  const f = roofHeight(W, D, H, upturn);
  const geo = new THREE.PlaneGeometry(W, D, 36, 18);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setY(i, f(pos.getX(i), pos.getZ(i)));
  geo.computeVertexNormals();
  const grp = new THREE.Group();
  grp.add(mesh(geo, m.roof), mesh(geo, m.soffit, { shadow: false }));
  const ridge = Math.max(0, (W - D) / 2);
  // đầu đao, bờ nóc tỉ lệ theo cỡ mái (mái nhỏ → chi tiết nhỏ)
  const k = Math.min(1, Math.min(W, D) / 4);
  // bờ nóc
  grp.add(box(ridge * 2 + 0.3 * k, 0.06 + 0.1 * k, 0.06 + 0.1 * k, m.gold, { y: H + 0.05 * k }));
  // đầu kìm hai đầu nóc (vòng xoắn)
  for (const sx of [-1, 1]) {
    if (k < 0.5) continue;
    const curl = mesh(new THREE.TorusGeometry(0.18 * k, 0.05 * k, 6, 12, Math.PI * 1.4), m.gold, { x: sx * (ridge + 0.15 * k), y: H + 0.22 * k, ry: Math.PI / 2, rz: sx > 0 ? 0 : Math.PI });
    grp.add(curl);
  }
  // bờ chảy (4 đường hông) + đầu đao
  const tube = (pts, r = 0.05) => mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, r, 6), m.gold);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      const x = sx * (ridge + t * (W / 2 - ridge)), z = sz * t * (D / 2);
      pts.push(new THREE.Vector3(x, f(x, z) + 0.06, z));
    }
    const tip = pts[pts.length - 1];
    pts.push(new THREE.Vector3(tip.x + sx * 0.22 * k, tip.y + 0.32 * k, tip.z + sz * 0.22 * k));
    grp.add(tube(pts, 0.025 + 0.035 * k));
  }
  // viền mái
  const edge = [];
  const N = 40;
  const perim = (k) => {
    const s = (k % N) / N;
    const per = 2 * (W + D); let d = s * per;
    if (d < W) return [-W / 2 + d, -D / 2]; d -= W;
    if (d < D) return [W / 2, -D / 2 + d]; d -= D;
    if (d < W) return [W / 2 - d, D / 2]; d -= W;
    return [-W / 2, D / 2 - d];
  };
  for (let k = 0; k <= N; k++) { const [x, z] = perim(k); edge.push(new THREE.Vector3(x * 0.995, f(x * 0.995, z * 0.995) + 0.01, z * 0.995)); }
  grp.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(edge, true), 160, 0.035, 4, true), m.lacquer, { shadow: false }));
  return grp;
}

// Cột sơn son: chân đá tảng, đai vàng.
export function column(h, r = 0.16, m = materials()) {
  const g = new THREE.Group();
  g.add(cyl(r * 1.7, r * 1.9, 0.18, m.stone, { y: 0.09 }, 12));
  g.add(cyl(r, r * 1.08, h, m.son, { y: 0.18 + h / 2 }, 14));
  g.add(cyl(r * 1.15, r * 1.15, 0.08, m.gold, { y: h + 0.1 }, 14));
  g.add(cyl(r * 1.15, r * 1.15, 0.06, m.gold, { y: 0.4 }, 14));
  return g;
}

// Đèn lồng (lathe), có thể kèm đèn điểm.
export function lantern(scale = 1, { light = false, m = materials() } = {}) {
  const g = new THREE.Group();
  g.add(cyl(0.012, 0.012, 0.35, m.ink, { y: 0.45 }, 4));
  g.add(cyl(0.12, 0.12, 0.05, m.gold, { y: 0.27 }, 12));
  g.add(lathe([[0.001, -0.25], [0.12, -0.24], [0.2, -0.12], [0.22, 0], [0.2, 0.12], [0.12, 0.24], [0.001, 0.25]], m.lanternRed, {}, 16));
  g.add(cyl(0.12, 0.12, 0.05, m.gold, { y: -0.27 }, 12));
  g.add(cyl(0.01, 0.03, 0.2, m.gold, { y: -0.4 }, 6));
  g.scale.setScalar(scale);
  if (light) {
    const pl = new THREE.PointLight('#ff9a4a', 0, 9, 1.6);
    pl.userData.lantern = true;
    g.add(pl);
  }
  return g;
}

// ---------------------------------------------------------------------------
// Nhân vật
// ---------------------------------------------------------------------------
export function avatar(robeColor = '#b0843a', { hat = true, m = materials() } = {}) {
  const root = new THREE.Group();
  const body = new THREE.Group(); root.add(body);
  const robeMat = std({ map: TX.lacquerTex(robeColor, { seed: 21, gold: 0.25, streak: 0.08 }), roughness: 0.6 });
  const trouser = std({ color: '#efe6d2', roughness: 0.8 });
  const mk = (geo, mat, o) => mesh(geo, mat, o);
  const legs = [];
  for (const sx of [-1, 1]) {
    const hip = new THREE.Group(); hip.position.set(sx * 0.09, 0.52, 0);
    hip.add(mk(new THREE.CylinderGeometry(0.065, 0.06, 0.48, 8), trouser, { y: -0.24 }));
    hip.add(mk(new THREE.BoxGeometry(0.11, 0.06, 0.18), m.ink, { y: -0.49, z: 0.03 }));
    body.add(hip); legs.push(hip);
  }
  // áo dài: thân + vạt
  body.add(lathe([[0.001, 1.12], [0.17, 1.1], [0.2, 0.95], [0.19, 0.78], [0.22, 0.6], [0.25, 0.42], [0.001, 0.42]], robeMat, {}, 18));
  body.add(mk(new THREE.TorusGeometry(0.19, 0.025, 6, 18), m.gold, { y: 0.78, rx: Math.PI / 2 }));
  body.add(mk(new THREE.CylinderGeometry(0.07, 0.08, 0.1, 10), robeMat, { y: 1.15 }));
  const arms = [];
  for (const sx of [-1, 1]) {
    const sh = new THREE.Group(); sh.position.set(sx * 0.2, 1.05, 0);
    sh.add(mk(new THREE.CylinderGeometry(0.055, 0.075, 0.46, 8), robeMat, { y: -0.22, rz: sx * 0.12 }));
    sh.add(mk(new THREE.SphereGeometry(0.05, 8, 6), m.skin, { y: -0.47, x: sx * 0.03 }));
    body.add(sh); arms.push(sh);
  }
  const head = new THREE.Group(); head.position.y = 1.33; body.add(head);
  head.add(mk(new THREE.SphereGeometry(0.16, 16, 12), m.skin));
  head.add(mk(new THREE.SphereGeometry(0.165, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), m.hair, { y: 0.01, rx: -0.25 }));
  head.add(mk(new THREE.SphereGeometry(0.07, 10, 8), m.hair, { y: 0.06, z: -0.17 }));
  for (const sx of [-1, 1]) head.add(mk(new THREE.SphereGeometry(0.018, 6, 4), m.ink, { x: sx * 0.06, y: 0.01, z: 0.145, shadow: false }));
  if (hat) {
    head.add(mk(new THREE.ConeGeometry(0.42, 0.24, 24, 1, true), m.straw, { y: 0.17 }));
    head.add(mk(new THREE.TorusGeometry(0.4, 0.012, 4, 24), m.straw, { y: 0.06, rx: Math.PI / 2 }));
  }
  root.scale.setScalar(1.3);
  root.userData.rig = { body, legs, arms, head };
  return root;
}

// Tư thế/nhịp: walk ∈ [0,1], phase theo thời gian, sitting.
export function poseAvatar(av, { walk = 0, phase = 0, sitting = false, idle = 0 }) {
  const { body, legs, arms, head } = av.userData.rig;
  if (sitting) {
    body.position.y = -0.4;
    legs.forEach((l, i) => { l.rotation.x = -1.45; l.rotation.z = (i ? -1 : 1) * 0.35; });
    arms.forEach((a, i) => { a.rotation.x = -0.6; a.rotation.z = (i ? -1 : 1) * 0.25; });
    head.rotation.x = 0.05 + Math.sin(idle * 0.6) * 0.02;
    return;
  }
  const s = Math.sin(phase) * walk;
  body.position.y = Math.abs(Math.cos(phase)) * 0.05 * walk + Math.sin(idle * 1.6) * 0.008;
  legs[0].rotation.set(s * 0.6, 0, 0); legs[1].rotation.set(-s * 0.6, 0, 0);
  arms[0].rotation.set(-s * 0.5, 0, 0); arms[1].rotation.set(s * 0.5, 0, 0);
  head.rotation.x = 0;
}

export function master(m = materials()) {
  const g = new THREE.Group();
  const robe = std({ map: TX.lacquerTex('#262445', { seed: 31, gold: 0.35, streak: 0.06 }), roughness: 0.6 });
  g.add(mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 20), m.cushion, { y: 0.04 }));
  g.add(lathe([[0.001, 0.08], [0.55, 0.1], [0.5, 0.3], [0.3, 0.5], [0.24, 0.8], [0.2, 0.98], [0.001, 1.02]], robe, {}, 20));
  g.add(mesh(new THREE.TorusGeometry(0.22, 0.03, 6, 18), m.gold, { y: 0.62, rx: Math.PI / 2 }));
  const head = new THREE.Group(); head.position.y = 1.18; g.add(head);
  head.add(mesh(new THREE.SphereGeometry(0.17, 16, 12), m.skin));
  // khăn xếp
  head.add(mesh(new THREE.TorusGeometry(0.15, 0.06, 8, 20), robe, { y: 0.08, rx: Math.PI / 2 }));
  head.add(mesh(new THREE.CylinderGeometry(0.15, 0.16, 0.1, 18), robe, { y: 0.12 }));
  // râu bạc + lông mày
  head.add(mesh(new THREE.ConeGeometry(0.08, 0.32, 10), m.white, { y: -0.2, z: 0.1, rx: Math.PI }));
  for (const sx of [-1, 1]) head.add(mesh(new THREE.BoxGeometry(0.06, 0.015, 0.02), m.white, { x: sx * 0.06, y: 0.05, z: 0.15 }));
  for (const sx of [-1, 1]) head.add(mesh(new THREE.SphereGeometry(0.016, 6, 4), m.ink, { x: sx * 0.06, y: 0.02, z: 0.155 }));
  // tay cầm bút (tay phải động)
  const arm = new THREE.Group(); arm.position.set(0.22, 0.85, 0.05); g.add(arm);
  arm.add(mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.42, 8), robe, { y: -0.12, z: 0.15, rx: 1.1 }));
  arm.add(mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.22, 4), m.ink, { y: -0.2, z: 0.36, rx: 0.4 }));
  const armL = mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.42, 8), robe, { x: -0.22, y: 0.73, z: 0.2, rx: 1.1 });
  g.add(armL);
  g.userData.rig = { head, arm };
  g.userData.dynamic = true;
  return g;
}

// ---------------------------------------------------------------------------
// Công trình
// ---------------------------------------------------------------------------
export function hall(m = materials(), han = '玄 館') {
  const g = new THREE.Group();
  const cz = -7.25;
  // nền + bậc
  g.add(box(10.2, 0.5, 5.0, m.stone, { y: 0.25, z: cz }));
  g.add(box(10.4, 0.06, 5.2, m.gold, { y: 0.52, z: cz, shadow: false }));
  for (const sx of [-1, 1]) {
    g.add(box(1.6, 0.17, 0.4, m.stone, { x: sx * 3.4, y: 0.085, z: -4.55 }));
    g.add(box(1.6, 0.34, 0.35, m.stone, { x: sx * 3.4, y: 0.17, z: -4.82 }));
  }
  // cột
  const xs = [-4.5, -2.7, -0.9, 0.9, 2.7, 4.5];
  for (const x of xs) for (const z of [-5.25, -9.3]) { const c = column(3.1); c.position.set(x, 0.5, z); g.add(c); }
  // vách sau + hai bên + vách ô hộc hai gian bên
  const pTex = m.panel.map.clone(); pTex.repeat.set(4, 1.4); pTex.needsUpdate = true;
  const panelBack = std({ map: pTex, roughness: 0.45 });
  g.add(box(9.2, 3.0, 0.18, panelBack, { y: 2.0, z: -9.35 }));
  for (const sx of [-1, 1]) g.add(box(0.18, 3.0, 3.9, panelBack, { x: sx * 4.55, y: 2.0, z: -7.3 }));
  const sideTex = m.panel.map.clone(); sideTex.repeat.set(1, 1.4); sideTex.needsUpdate = true;
  const side = std({ map: sideTex, roughness: 0.45 });
  for (const x of [-3.6, 3.6]) g.add(box(1.6, 2.4, 0.1, side, { x, y: 1.75, z: -5.3 }));
  // xà ngang
  g.add(box(9.6, 0.22, 0.24, m.son, { y: 3.55, z: -5.25 }));
  g.add(box(9.6, 0.1, 0.26, m.gold, { y: 3.42, z: -5.25 }));
  g.add(box(9.6, 0.22, 0.24, m.son, { y: 3.55, z: -9.3 }));
  // trong nhà: la bàn treo tường + kệ sách cuộn
  const lp = mesh(new THREE.CircleGeometry(1.1, 48), std({ map: TX.luopanTex(), roughness: 0.35, metalness: 0.2 }), { y: 2.3, z: -9.24 });
  g.add(lp);
  g.add(mesh(new THREE.TorusGeometry(1.12, 0.06, 8, 48), m.gold, { y: 2.3, z: -9.23 }));
  for (const sx of [-1, 1]) {
    g.add(box(1.4, 1.8, 0.4, m.wood, { x: sx * 3.0, y: 1.4, z: -9.0 }));
    for (let i = 0; i < 6; i++) g.add(cyl(0.05, 0.05, 0.35, i % 2 ? m.paper : m.straw, { x: sx * 3.0 - 0.5 + (i % 3) * 0.5, y: 1.0 + Math.floor(i / 3) * 0.6, z: -8.85, rz: Math.PI / 2 }, 8));
  }
  // mái hai tầng
  const r1 = roof(11.8, 6.4, 1.35, { upturn: 0.6 }); r1.position.set(0, 3.66, cz); g.add(r1);
  g.add(box(7.2, 0.95, 3.4, panelBack, { y: 4.55, z: cz }));
  const r2 = roof(8.4, 4.4, 1.55, { upturn: 0.55 }); r2.position.set(0, 4.98, cz); g.add(r2);
  // biển 玄館
  const sign = mesh(new THREE.PlaneGeometry(2.4, 0.9), std({ map: TX.signTex(han), roughness: 0.35, metalness: 0.1 }), { y: 4.55, z: cz + 1.72, shadow: false });
  g.add(sign);
  g.add(box(2.6, 1.06, 0.06, m.gold, { y: 4.55, z: cz + 1.69, shadow: false }));
  // án thư + giấy + nghiên + bút gác
  g.add(box(2.0, 0.08, 0.95, m.lacquer, { y: 0.78, z: -4.0 }));
  g.add(box(2.06, 0.03, 1.0, m.gold, { y: 0.73, z: -4.0, shadow: false }));
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(box(0.1, 0.72, 0.1, m.lacquer, { x: sx * 0.9, y: 0.37, z: -4.0 + sz * 0.38 }));
  g.add(box(0.8, 0.01, 0.5, m.paper, { x: -0.2, y: 0.83, z: -3.95, shadow: false }));
  g.add(box(0.28, 0.05, 0.2, m.ink, { x: 0.6, y: 0.845, z: -4.05 }));
  g.add(box(0.5, 0.06, 0.06, m.lacquer, { x: 0.55, y: 0.85, z: -4.3 }));
  for (let i = 0; i < 3; i++) g.add(cyl(0.008, 0.012, 0.32, m.wood, { x: 0.4 + i * 0.13, y: 1.0, z: -4.3 }, 4));
  g.add(cyl(0.12, 0.1, 0.12, m.celadon, { x: -0.75, y: 0.88, z: -4.15 }, 12));
  return g;
}

/**
 * Bàn Thầy Tử Bình trên nền tầng 2 (court.js › DAIS): bệ gỗ, 6 cột son, mái hai tầng, biển 玄館,
 * bình phong la bàn sau lưng thầy, kệ sách cuộn, án thư. Gốc toạ độ = chỗ thầy ngồi; khách đứng phía +z.
 * Mặt sàn bệ ở y = DAIS_FLOOR.
 */
export const DAIS_FLOOR = 0.25;
export function masterDais(m = materials(), han = '玄 館') {
  const g = new THREE.Group();
  const F = DAIS_FLOOR;
  g.add(box(10.4, F, 6.8, m.wood, { y: F / 2 }));
  g.add(box(10.6, 0.05, 7.0, m.gold, { y: F + 0.005, shadow: false }));
  // cột: 2 trước (chừa lối nhìn), 4 sau
  const H = 4.2;
  for (const [x, z] of [[-4.6, 2.9], [4.6, 2.9], [-4.6, -2.9], [-1.7, -2.9], [1.7, -2.9], [4.6, -2.9]]) { const c = column(H, 0.22); c.position.set(x, F, z); g.add(c); }
  // xà + biển
  for (const z of [2.9, -2.9]) { g.add(box(9.8, 0.3, 0.3, m.son, { y: F + H + 0.1, z })); g.add(box(9.8, 0.1, 0.32, m.gold, { y: F + H - 0.08, z })); }
  for (const x of [-4.6, 4.6]) g.add(box(0.3, 0.3, 6.1, m.son, { x, y: F + H + 0.1 }));
  const sign = mesh(new THREE.PlaneGeometry(2.8, 1.0), std({ map: TX.signTex(han), roughness: 0.35, metalness: 0.1 }), { y: F + H - 0.7, z: 3.07, shadow: false });
  g.add(sign);
  g.add(box(3.0, 1.16, 0.06, m.gold, { y: F + H - 0.7, z: 3.03, shadow: false }));
  // mái hai tầng
  const r1 = roof(12.6, 8.6, 1.7, { upturn: 0.7 }); r1.position.set(0, F + H + 0.25, 0); g.add(r1);
  const pTex = m.panel.map.clone(); pTex.repeat.set(3, 1); pTex.needsUpdate = true;
  g.add(box(7.0, 1.2, 4.2, std({ map: pTex, roughness: 0.45 }), { y: F + H + 1.6 }));
  const r2 = roof(8.8, 5.4, 1.7, { upturn: 0.6 }); r2.position.set(0, F + H + 2.15, 0); g.add(r2);
  // bình phong sau lưng thầy + la bàn lớn
  const scr = std({ map: TX.panelTex(9), roughness: 0.45 });
  g.add(box(6.2, 3.0, 0.2, scr, { y: F + 1.5, z: -2.2 }));
  g.add(box(6.4, 0.16, 0.26, m.gold, { y: F + 3.05, z: -2.2 }));
  g.add(mesh(new THREE.CircleGeometry(1.15, 56), std({ map: TX.luopanTex(), roughness: 0.3, metalness: 0.25 }), { y: F + 1.75, z: -2.08 }));
  g.add(mesh(new THREE.TorusGeometry(1.17, 0.07, 8, 56), m.gold, { y: F + 1.75, z: -2.07 }));
  // kệ sách cuộn hai bên
  for (const sx of [-1, 1]) {
    g.add(box(1.6, 2.0, 0.5, m.wood, { x: sx * 3.6, y: F + 1.0, z: -1.6 }));
    for (let i = 0; i < 9; i++) g.add(cyl(0.05, 0.05, 0.4, i % 2 ? m.paper : m.straw, { x: sx * 3.6 - 0.55 + (i % 3) * 0.55, y: F + 0.55 + Math.floor(i / 3) * 0.6, z: -1.38, rz: Math.PI / 2 }, 8));
  }
  // án thư + giấy + nghiên + bút
  const dz = 1.4, dy = F;
  g.add(box(2.2, 0.08, 1.0, m.lacquer, { y: dy + 0.42, z: dz }));
  g.add(box(2.26, 0.03, 1.05, m.gold, { y: dy + 0.37, z: dz, shadow: false }));
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(box(0.1, 0.36, 0.1, m.lacquer, { x: sx * 1.0, y: dy + 0.19, z: dz + sz * 0.4 }));
  g.add(box(0.8, 0.01, 0.5, m.paper, { x: -0.2, y: dy + 0.47, z: dz - 0.05, shadow: false }));
  g.add(box(0.28, 0.05, 0.2, m.ink, { x: 0.6, y: dy + 0.485, z: dz - 0.15 }));
  for (let i = 0; i < 3; i++) g.add(cyl(0.008, 0.012, 0.32, m.wood, { x: 0.4 + i * 0.13, y: dy + 0.64, z: dz - 0.38 }, 4));
  g.add(cyl(0.12, 0.1, 0.12, m.celadon, { x: -0.8, y: dy + 0.52, z: dz - 0.25 }, 12));
  // bồ đoàn cho khách trước án
  g.add(cyl(0.38, 0.4, 0.12, m.cushion, { y: F + 0.06, z: dz + 1.1 }, 18));
  return g;
}

export function teaPavilion(m = materials()) {
  const g = new THREE.Group();
  const cx = -10.4;
  g.add(box(8.0, 0.32, 2.4, m.wood, { x: cx, y: 0.16, z: -8.4 }));
  g.add(box(8.1, 0.05, 2.5, m.gold, { x: cx, y: 0.33, z: -8.4, shadow: false }));
  for (const x of [cx - 3.7, cx + 3.7]) for (const z of [-9.4, -7.4]) { const c = column(2.2, 0.12); c.position.set(x, 0.32, z); g.add(c); }
  // lan can sau
  g.add(box(7.4, 0.06, 0.06, m.son, { x: cx, y: 0.85, z: -9.45 }));
  for (let i = 0; i <= 14; i++) g.add(box(0.05, 0.5, 0.05, m.son, { x: cx - 3.5 + i * 0.5, y: 0.6, z: -9.45 }));
  const r = roof(9.2, 3.6, 1.1, { upturn: 0.5 }); r.position.set(cx, 2.68, -8.4); g.add(r);
  // kệ: hũ trà + chậu bonsai
  g.add(box(2.2, 0.08, 0.5, m.lacquer, { x: cx - 2.2, y: 1.0, z: -9.2 }));
  for (let i = 0; i < 3; i++) g.add(lathe([[0.001, 0], [0.11, 0.02], [0.13, 0.12], [0.08, 0.24], [0.06, 0.28], [0.001, 0.29]], i === 1 ? m.celadon : m.son, { x: cx - 2.9 + i * 0.6, y: 1.04, z: -9.2 }, 14));
  g.add(cyl(0.3, 0.22, 0.2, m.celadon, { x: cx + 2.4, y: 0.42, z: -8.9 }, 14));
  g.add(cyl(0.04, 0.06, 0.4, m.bark, { x: cx + 2.4, y: 0.7, z: -8.9, rz: 0.4 }, 6));
  g.add(mesh(new THREE.IcosahedronGeometry(0.28, 0), m.pine, { x: cx + 2.25, y: 0.95, z: -8.9 }));
  // bàn trà thấp + ấm + chén
  const tz = -6.85;
  g.add(box(1.5, 0.08, 0.8, m.lacquer, { x: -10.0, y: 0.32, z: tz }));
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(box(0.08, 0.28, 0.08, m.lacquer, { x: -10.0 + sx * 0.65, y: 0.14, z: tz + sz * 0.32 }));
  g.add(lathe([[0.001, 0], [0.12, 0.01], [0.16, 0.08], [0.14, 0.16], [0.06, 0.2], [0.07, 0.24], [0.001, 0.25]], m.son, { x: -10.25, y: 0.36, z: tz }, 16));
  g.add(cyl(0.015, 0.025, 0.14, m.son, { x: -10.08, y: 0.48, z: tz, rz: -0.9 }, 6));
  g.add(mesh(new THREE.TorusGeometry(0.07, 0.015, 6, 12, Math.PI), m.son, { x: -10.4, y: 0.47, z: tz, rz: Math.PI / 2 }));
  const cups = [];
  for (let i = 0; i < 3; i++) {
    g.add(lathe([[0.001, 0], [0.04, 0.005], [0.055, 0.06], [0.05, 0.062], [0.001, 0.02]], m.celadon, { x: -9.85 + i * 0.18, y: 0.36, z: tz + 0.12 }, 12));
    const liq = mesh(new THREE.CircleGeometry(0.045, 12), m.tea, { x: -9.85 + i * 0.18, y: 0.415, z: tz + 0.12, rx: -Math.PI / 2, shadow: false });
    liq.userData.dynamic = true; g.add(liq); cups.push(liq);
  }
  // bồ đoàn
  for (const x of [-12.4, -10.0, -7.6]) g.add(cyl(0.34, 0.36, 0.12, m.cushion, { x, y: 0.06, z: -5.7 }, 18));
  g.userData.cups = cups;
  return g;
}

export function compassTerrace(m = materials()) {
  const g = new THREE.Group();
  const cx = 10.4, cz = -8.0;
  g.add(cyl(1.75, 1.85, 0.2, m.stone, { x: cx, y: 0.1, z: cz }, 40));
  g.add(cyl(1.42, 1.48, 0.22, m.stoneDark, { x: cx, y: 0.31, z: cz }, 40));
  g.add(cyl(1.2, 1.25, 0.3, m.lacquer, { x: cx, y: 0.57, z: cz }, 40));
  g.add(mesh(new THREE.TorusGeometry(1.2, 0.04, 6, 48), m.gold, { x: cx, y: 0.72, z: cz, rx: Math.PI / 2 }));
  const disk = mesh(new THREE.CircleGeometry(1.12, 64), std({ map: TX.luopanTex(), roughness: 0.3, metalness: 0.25 }), { x: cx, y: 0.735, z: cz, rx: -Math.PI / 2 });
  g.add(disk);
  const needle = new THREE.Group(); needle.position.set(cx, 0.78, cz); needle.userData.dynamic = true;
  needle.add(mesh(new THREE.ConeGeometry(0.06, 0.9, 4), std({ color: '#d0281d', roughness: 0.3, metalness: 0.4 }), { z: -0.45, rx: -Math.PI / 2 }));
  needle.add(mesh(new THREE.ConeGeometry(0.06, 0.9, 4), m.white, { z: 0.45, rx: Math.PI / 2 }));
  needle.add(cyl(0.06, 0.06, 0.06, m.gold, {}, 12));
  g.add(needle);
  // 8 cột mốc bát quái quanh bệ
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2; // 0 = Bắc (−Z)
    const x = cx + Math.sin(a) * 1.62, z = cz - Math.cos(a) * 1.62;
    g.add(box(0.2, 0.75, 0.2, m.lacquer, { x, y: 0.55, z, ry: -a }));
    const plate = mesh(new THREE.PlaneGeometry(0.16, 0.32), new THREE.MeshStandardMaterial({ map: TX.trigramTex(i), roughness: 0.4 }), { x: x - Math.sin(a) * 0.105, y: 0.62, z: z + Math.cos(a) * 0.105, ry: Math.PI - a, shadow: false });
    g.add(plate);
    g.add(mesh(new THREE.SphereGeometry(0.07, 10, 8), m.gold, { x, y: 0.97, z }));
  }
  g.userData.needle = needle;
  return g;
}

export function xamAltar(m = materials()) {
  const g = new THREE.Group();
  const cx = -11.2;
  // bình phong sau
  const scr = std({ map: TX.panelTex(9), roughness: 0.45 });
  g.add(box(0.15, 2.4, 2.8, scr, { x: cx - 1.35, y: 1.3, z: 0 }));
  g.add(box(0.2, 0.15, 3.0, m.gold, { x: cx - 1.35, y: 2.55, z: 0 }));
  for (const sz of [-1, 1]) g.add(box(0.25, 0.3, 0.3, m.stone, { x: cx - 1.35, y: 0.15, z: sz * 1.3 }));
  // án + khăn
  g.add(box(1.4, 0.1, 2.3, m.lacquer, { x: cx, y: 0.95, z: 0 }));
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(box(0.12, 0.9, 0.12, m.lacquer, { x: cx + sx * 0.6, y: 0.45, z: sz * 1.05 }));
  g.add(box(0.05, 0.75, 1.9, m.cloth, { x: cx + 0.72, y: 0.6, z: 0 }));
  g.add(box(0.06, 0.08, 1.95, m.gold, { x: cx + 0.73, y: 0.95, z: 0 }));
  g.add(box(0.06, 0.04, 1.95, m.gold, { x: cx + 0.73, y: 0.26, z: 0 }));
  // ống xăm tre + thẻ
  g.add(cyl(0.17, 0.15, 0.55, m.bamboo, { x: cx + 0.1, y: 1.28, z: 0 }, 16));
  g.add(mesh(new THREE.TorusGeometry(0.17, 0.02, 6, 16), m.gold, { x: cx + 0.1, y: 1.55, z: 0, rx: Math.PI / 2 }));
  const sticks = new THREE.InstancedMesh(new THREE.BoxGeometry(0.025, 0.55, 0.008), std({ color: '#d9c27a', roughness: 0.6 }), 26);
  const r = TX.rng(5); const mt = new THREE.Matrix4(); const q = new THREE.Quaternion(); const e = new THREE.Euler();
  for (let i = 0; i < 26; i++) {
    const a = r() * Math.PI * 2, rr = r() * 0.1;
    e.set((r() - 0.5) * 0.25, r() * Math.PI, (r() - 0.5) * 0.25); q.setFromEuler(e);
    mt.compose(new THREE.Vector3(cx + 0.1 + Math.cos(a) * rr, 1.55 + r() * 0.08, Math.sin(a) * rr), q, new THREE.Vector3(1, 1, 1));
    sticks.setMatrixAt(i, mt);
  }
  sticks.castShadow = true; g.add(sticks);
  // keo âm dương (2 miếng) + đĩa
  g.add(cyl(0.22, 0.2, 0.03, m.celadon, { x: cx + 0.15, y: 1.02, z: 0.65 }, 18));
  for (const dz of [-0.06, 0.08]) g.add(mesh(new THREE.SphereGeometry(0.08, 10, 6, 0, Math.PI), m.son, { x: cx + 0.15, y: 1.05, z: 0.65 + dz, rx: -Math.PI / 2, rz: dz * 10 }));
  // nến
  const flames = [];
  for (const sz of [-0.85, 0.85]) {
    g.add(cyl(0.07, 0.08, 0.06, m.gold, { x: cx + 0.15, y: 1.03, z: sz }, 10));
    g.add(cyl(0.045, 0.045, 0.32, m.white, { x: cx + 0.15, y: 1.22, z: sz }, 10));
    const f = mesh(new THREE.ConeGeometry(0.03, 0.1, 8), m.flame, { x: cx + 0.15, y: 1.43, z: sz, shadow: false });
    f.userData.dynamic = true; g.add(f); flames.push(f);
  }
  const pl = new THREE.PointLight('#ffb357', 2.2, 6, 1.6); pl.position.set(cx + 0.5, 1.6, 0); g.add(pl);
  g.userData.flames = flames; g.userData.candleLight = pl;
  return g;
}

// Giá sách cổ (thay án xăm ở bản iOS): kệ sơn mài, cuộn thư, hộp sách.
export function scrollRack(m = materials()) {
  const g = new THREE.Group();
  const cx = -11.2;
  g.add(box(0.5, 2.2, 2.4, m.lacquer, { x: cx - 0.6, y: 1.1, z: 0 }));
  for (let k = 0; k < 4; k++) g.add(box(0.55, 0.06, 2.45, m.gold, { x: cx - 0.55, y: 0.3 + k * 0.55, z: 0, shadow: false }));
  const r = TX.rng(71);
  for (let k = 0; k < 3; k++) for (let i = 0; i < 7; i++) {
    const roll = r() < 0.6;
    if (roll) g.add(cyl(0.07, 0.07, 0.4, r() < 0.5 ? m.paper : m.straw, { x: cx - 0.45, y: 0.42 + k * 0.55, z: -1.0 + i * 0.32, rx: Math.PI / 2 }, 8));
    else g.add(box(0.32, 0.38, 0.22, r() < 0.5 ? m.son : m.wood, { x: cx - 0.5, y: 0.53 + k * 0.55, z: -1.0 + i * 0.32 }));
  }
  g.add(box(1.0, 0.75, 1.1, m.lacquer, { x: cx + 0.35, y: 0.38, z: 0 }));
  g.add(box(0.7, 0.02, 0.5, m.paper, { x: cx + 0.35, y: 0.77, z: 0, shadow: false }));
  g.add(cyl(0.11, 0.09, 0.14, m.celadon, { x: cx + 0.6, y: 0.83, z: 0.35 }, 12));
  return g;
}

// Lư Hương lớn: bệ đá + lư đồng ba chân (model Meshy «cauldron», do render3d.js nạp — CAULDRON_FIT); hàm này chỉ dựng bệ,
// mặt cát và nhang. Trước đây lư ghép từ hộp / trụ / vòng xuyến trông như cái bát lật cạnh cái hộp.
export const CAULDRON_FIT = { base: 0.65, height: 1.5, sand: 0.72, sandR: 0.42 }; // mặt cát = 72% chiều cao model (đo: vành 78%, đáy lòng 43%)
export function incenseBurner(m = materials()) {
  const g = new THREE.Group();
  const cz = 0.8;
  g.add(box(1.6, 0.18, 1.2, m.stone, { y: 0.09, z: cz }));
  g.add(box(1.25, 0.42, 0.9, m.stoneDark, { y: 0.39, z: cz }));
  g.add(box(1.35, 0.06, 1.0, m.gold, { y: 0.62, z: cz, shadow: false }));
  const sy = CAULDRON_FIT.base + CAULDRON_FIT.height * CAULDRON_FIT.sand;
  // cát trong lư
  g.add(cyl(CAULDRON_FIT.sandR, CAULDRON_FIT.sandR, 0.02, std({ color: '#8d8174', roughness: 1 }), { y: sy, z: cz }, 24));
  // nhang (động)
  const inc = new THREE.Group(); inc.position.set(0, sy, cz); inc.userData.dynamic = true;
  const sticks = [];
  for (const dx of [-0.1, 0, 0.1]) {
    const s = new THREE.Group(); s.position.x = dx; s.rotation.z = dx * -0.6;
    const body = mesh(new THREE.CylinderGeometry(0.012, 0.012, 1, 6), m.stick, { y: 0.5 });
    const tip = mesh(new THREE.SphereGeometry(0.02, 6, 4), m.ember, { y: 1, shadow: false });
    s.add(body, tip); inc.add(s); sticks.push({ g: s, body, tip });
  }
  g.add(inc);
  const ember = new THREE.PointLight('#ff7a2f', 0, 3, 2); ember.position.set(0, sy + 0.5, cz); g.add(ember);
  g.userData.incense = { group: inc, sticks, light: ember, top: new THREE.Vector3(0, sy, cz) };
  g.userData.cauldronAt = { x: 0, y: CAULDRON_FIT.base, z: cz };
  return g;
}

export function calendarBoard(calTex, m = materials()) {
  const g = new THREE.Group();
  const cx = 11.2;
  for (const sz of [-0.95, 0.95]) {
    g.add(box(0.16, 2.6, 0.16, m.lacquer, { x: cx, y: 1.3, z: sz }));
    g.add(box(0.36, 0.2, 0.36, m.stone, { x: cx, y: 0.1, z: sz }));
  }
  g.add(box(0.12, 2.0, 1.75, m.son, { x: cx, y: 1.55, z: 0 }));
  const paper = mesh(new THREE.PlaneGeometry(1.5, 1.85), std({ map: calTex, roughness: 0.85 }), { x: cx - 0.07, y: 1.55, z: 0, ry: -Math.PI / 2, shadow: false });
  g.add(paper);
  g.add(box(0.14, 0.08, 1.8, m.gold, { x: cx - 0.02, y: 2.58, z: 0 }));
  const r = roof(0.9, 2.5, 0.35, { upturn: 0.25 }); r.rotation.y = Math.PI / 2; r.position.set(cx, 2.65, 0); g.add(r);
  return g;
}

export function pond(rippleMap, m = materials(), { cz = 6.4, W = 12.4, D = 3.0 } = {}) {
  const g = new THREE.Group();
  for (const [x, z, w, d] of [[0, cz - D / 2 - 0.2, W + 0.8, 0.4], [0, cz + D / 2 + 0.2, W + 0.8, 0.4], [-W / 2 - 0.2, cz, 0.4, D], [W / 2 + 0.2, cz, 0.4, D]]) {
    g.add(box(w, 0.32, d, m.stone, { x, y: 0.16, z }));
    g.add(box(w, 0.04, d, m.stoneDark, { x, y: 0.34, z, shadow: false }));
  }
  // lòng hồ sâu ~1,2 m (court.POND_DEPTH — người chơi lội xuống): đáy + bốn vách đá trong
  g.add(box(W, 0.1, D, std({ color: '#0d2228', roughness: 1 }), { y: -1.2, z: cz, shadow: false }));
  for (const [x, z, w, d] of [[0, cz - D / 2 + 0.05, W, 0.1], [0, cz + D / 2 - 0.05, W, 0.1], [-W / 2 + 0.05, cz, 0.1, D], [W / 2 - 0.05, cz, 0.1, D]]) g.add(box(w, 1.2, d, m.stoneDark, { x, y: -0.6, z, shadow: false }));
  // mặt nước sóng lăn tăn + sen dập dềnh, hoa trên cuống, cá chép (lotus.js — cập nhật khi người chơi ở gần)
  const water = waterSurface(W, D); water.position.set(0, 0.12, cz); g.add(water);
  lotusLife(g, { x0: -W / 2, x1: W / 2, z0: cz - D / 2, z1: cz + D / 2, y: 0.12, seed: Math.round(W * 13 + D * 7) });
  // đèn hoa đăng của khách (ẩn cho tới khi thả)
  const lanterns = [];
  for (let i = 0; i < 6; i++) {
    const L = new THREE.Group(); L.visible = false; L.userData.dynamic = true;
    for (let k = 0; k < 6; k++) {
      const pet = mesh(new THREE.SphereGeometry(0.11, 8, 6, 0, Math.PI), m.lotus, { y: 0.05, ry: (k / 6) * Math.PI * 2, rx: -0.6, shadow: false });
      pet.scale.set(1, 1.5, 0.6); L.add(pet);
    }
    L.add(cyl(0.035, 0.035, 0.1, m.white, { y: 0.1, shadow: false }, 8));
    L.add(mesh(new THREE.ConeGeometry(0.025, 0.07, 6), m.flame, { y: 0.19, shadow: false }));
    g.add(L); lanterns.push(L);
  }
  g.userData.water = water; g.userData.lanterns = lanterns;
  g.userData.bounds = { x0: -W / 2 + 0.5, x1: W / 2 - 0.5, z0: cz - D / 2 + 0.4, z1: cz + D / 2 - 0.4 };
  return g;
}

// Cây đào (thân uốn + tán hoa / lá), tùng, trúc.
export function peachTree(seed = 1, m = materials()) {
  const g = new THREE.Group();
  const r = TX.rng(seed);
  const trunk = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.2, 0.9, 0.1), new THREE.Vector3(-0.15, 1.7, -0.1), new THREE.Vector3(0.1, 2.4, 0)]);
  g.add(mesh(new THREE.TubeGeometry(trunk, 12, 0.16, 7), m.bark));
  for (const [x, y, z] of [[0.6, 2.3, 0.2], [-0.6, 2.1, -0.3], [0.1, 2.8, 0.1]]) {
    const br = new THREE.CatmullRomCurve3([new THREE.Vector3(0.05, 2.0, 0), new THREE.Vector3(x * 0.6, y - 0.1, z * 0.6), new THREE.Vector3(x, y, z)]);
    g.add(mesh(new THREE.TubeGeometry(br, 6, 0.06, 5), m.bark));
  }
  const crown = new THREE.Group(); crown.userData.dynamic = true;
  for (let i = 0; i < 9; i++) {
    const c = mesh(new THREE.IcosahedronGeometry(0.45 + r() * 0.35, 1), m.blossom, { x: (r() - 0.5) * 1.8, y: 2.2 + r() * 1.0, z: (r() - 0.5) * 1.8 });
    crown.add(c);
  }
  g.add(crown);
  g.userData.crown = crown;
  return g;
}

export function pineTree(seed = 2, m = materials()) {
  const g = new THREE.Group();
  const r = TX.rng(seed);
  g.add(cyl(0.12, 0.2, 2.2, m.bark, { y: 1.1 }, 7));
  const tiers = [[1.4, 0.9, 1.4], [1.15, 0.8, 2.1], [0.85, 0.7, 2.7], [0.5, 0.6, 3.2]];
  for (const [rad, h, y] of tiers) {
    const c = mesh(new THREE.ConeGeometry(rad, h, 7), m.pine, { y, ry: r() * 3 });
    c.scale.set(1, 1, 0.85 + r() * 0.3); g.add(c);
  }
  return g;
}

export function bambooClump(seed = 3, n = 9, m = materials()) {
  const g = new THREE.Group();
  const r = TX.rng(seed);
  for (let i = 0; i < n; i++) {
    const h = 3 + r() * 2.5, x = (r() - 0.5) * 1.6, z = (r() - 0.5) * 1.6;
    g.add(cyl(0.05, 0.06, h, m.bamboo, { x, y: h / 2, z, rx: (r() - 0.5) * 0.12, rz: (r() - 0.5) * 0.12 }, 7));
    for (let k = 0; k < 3; k++) {
      const leaf = mesh(new THREE.ConeGeometry(0.22, 0.9, 4), m.leaf, { x: x + (r() - 0.5) * 0.4, y: h - k * 0.5, z: z + (r() - 0.5) * 0.4, rz: (r() - 0.5) * 2, rx: (r() - 0.5) * 2 });
      leaf.scale.set(1, 1, 0.3); g.add(leaf);
    }
  }
  return g;
}

// Tường bao + cổng 3 gian (cổng là vật che camera → vật liệu riêng).
export function walls(m = materials()) {
  const g = new THREE.Group();
  const cap = (len, x, z, ry) => { const r = roof(len, 0.9, 0.28, { upturn: 0.12 }); r.position.set(x, 1.45, z); r.rotation.y = ry; return r; };
  const seg = (x0, z0, x1, z1) => {
    const len = Math.hypot(x1 - x0, z1 - z0), x = (x0 + x1) / 2, z = (z0 + z1) / 2, ry = -Math.atan2(z1 - z0, x1 - x0);
    g.add(box(len, 1.45, 0.42, std({ color: '#d8ccb4', roughness: 0.95 }), { x, y: 0.725, z, ry }));
    g.add(box(len, 0.25, 0.46, m.stoneDark, { x, y: 0.125, z, ry }));
    g.add(cap(len + 0.4, x, z, ry));
  };
  const X = 15.2, Z = 10.4;
  seg(-X, -Z, X, -Z); seg(-X, -Z, -X, Z); seg(X, -Z, X, Z);
  seg(-X, Z, -2.6, Z); seg(2.6, Z, X, Z);
  return g;
}

export function gate(m = materials(), han = '玄 館') {
  const g = new THREE.Group();
  const z = 10.4;
  for (const x of [-2.4, -1.1, 1.1, 2.4]) { const c = column(x * x > 2 ? 2.4 : 3.0, 0.15); c.position.set(x, 0, z); g.add(c); }
  g.add(box(2.5, 0.2, 0.3, m.son, { y: 3.2, z }));
  g.add(box(2.5, 0.08, 0.32, m.gold, { y: 3.05, z }));
  for (const sx of [-1, 1]) g.add(box(1.3, 0.18, 0.3, m.son, { x: sx * 1.75, y: 2.6, z }));
  const r1 = roof(3.4, 1.8, 0.75, { upturn: 0.45 }); r1.position.set(0, 3.3, z); g.add(r1);
  for (const sx of [-1, 1]) { const r = roof(1.9, 1.5, 0.5, { upturn: 0.35 }); r.position.set(sx * 1.8, 2.7, z); g.add(r); }
  const sign = mesh(new THREE.PlaneGeometry(1.4, 0.5), std({ map: TX.signTex(han), roughness: 0.4 }), { y: 3.65, z: z + 0.95, shadow: false });
  g.add(sign);
  return g;
}

// Đảo nổi: mặt sân đá + viền rêu + vách đá thuôn xuống biển mây.
export function island(m = materials(), { courtOnly = false } = {}) {
  const g = new THREE.Group();
  const paveTex = TX.stoneTex({ seed: 29, tiles: 4, repeat: [32 / 6.4, 22.4 / 6.4] });
  const pave = mesh(new THREE.PlaneGeometry(30.4, 20.8), std({ map: paveTex, roughness: 0.92 }), { rx: -Math.PI / 2, shadow: false });
  pave.receiveShadow = true; g.add(pave);
  // lối đi đá lớn từ cổng lên chính đường
  const walk = TX.stoneTex({ seed: 31, tiles: 2, repeat: [1, 9], base: '#7d7468' });
  g.add(mesh(new THREE.PlaneGeometry(2.6, 14.6), std({ map: walk, roughness: 0.9 }), { y: 0.01, z: 2.7, rx: -Math.PI / 2, shadow: false }));
  if (courtOnly) return g; // thế giới mở: chỉ cần mặt sân, địa hình do world3d.js dựng
  const r = TX.rng(37);
  const R = 25;
  const top = new THREE.CircleGeometry(R, 64);
  const tp = top.attributes.position;
  for (let i = 1; i < tp.count; i++) { const k = 1 + (r() - 0.5) * 0.12; tp.setX(i, tp.getX(i) * k); tp.setY(i, tp.getY(i) * k * 0.85); }
  g.add(mesh(top, m.moss, { y: -0.02, rx: -Math.PI / 2, shadow: false }));
  const cliff = new THREE.CylinderGeometry(R, 3, 18, 48, 10, true);
  const cp = cliff.attributes.position;
  for (let i = 0; i < cp.count; i++) {
    const y = cp.getY(i); const t = (9 - y) / 18;
    const n = 1 + (r() - 0.5) * 0.3 * (0.4 + t);
    cp.setX(i, cp.getX(i) * n); cp.setZ(i, cp.getZ(i) * n * 0.85);
  }
  cliff.computeVertexNormals();
  g.add(mesh(cliff, m.rock, { y: -9.05, shadow: false }));
  // đá tảng rìa đảo
  for (let i = 0; i < 26; i++) {
    const a = r() * Math.PI * 2, d = 18 + r() * 5;
    const s = 0.5 + r() * 1.4;
    const rk = mesh(new THREE.DodecahedronGeometry(s, 0), m.rock, { x: Math.cos(a) * d, y: s * 0.3, z: Math.sin(a) * d * 0.85, ry: r() * 6 });
    rk.scale.y = 0.6; g.add(rk);
  }
  return g;
}

export function floatingRocks(m = materials()) {
  const g = new THREE.Group();
  const r = TX.rng(41);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + r(), d = 34 + r() * 18;
    const rk = new THREE.Group();
    const s = 1 + r() * 2.2;
    rk.add(mesh(new THREE.DodecahedronGeometry(s, 0), m.rock, { shadow: false }));
    rk.add(mesh(new THREE.CylinderGeometry(s * 0.95, s * 0.95, 0.12, 9), m.moss, { y: s * 0.62, shadow: false }));
    if (r() < 0.5) { const t = pineTree(i + 50); t.scale.setScalar(0.4 + r() * 0.3); t.position.y = s * 0.65; rk.add(t); }
    rk.position.set(Math.cos(a) * d, -2 + r() * 10, Math.sin(a) * d);
    rk.userData.bob = r() * 6;
    g.add(rk);
  }
  return g;
}

// Thiên Bàn: 3 vòng chữ vàng xoay ngược chiều + vành kim loại.
export function thienBan() {
  const g = new THREE.Group();
  const ringMat = (items, font) => new THREE.MeshBasicMaterial({ map: TX.skyRingTex(items, { font }), transparent: true, side: THREE.DoubleSide, depthWrite: false, color: '#ffd27a', toneMapped: false });
  const make = (r0, r1, items, font) => {
    const geo = new THREE.RingGeometry(r0, r1, 96, 1);
    // UV vòng lấy theo toạ độ phẳng để texture tròn khớp
    const p = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / (2 * r1) + 0.5, p.getY(i) / (2 * r1) + 0.5);
    return new THREE.Mesh(geo, ringMat(items, font));
  };
  const rings = [
    make(9.4, 12.5, TX.SKY_RINGS.shan, 'bold 62px serif'),
    make(6.6, 9.0, TX.SKY_RINGS.zhi, 'bold 80px serif'),
    make(3.6, 6.2, TX.SKY_RINGS.bagua, '110px serif'),
  ];
  for (const ring of rings) g.add(ring);
  const rim = new THREE.MeshStandardMaterial({ color: '#d9a441', metalness: 0.9, roughness: 0.3, emissive: '#5a3a0a', emissiveIntensity: 0.6 });
  for (const rr of [12.7, 9.2, 6.4, 3.4]) g.add(new THREE.Mesh(new THREE.TorusGeometry(rr, 0.12, 8, 96), rim));
  const core = new THREE.Mesh(new THREE.CircleGeometry(3.2, 48), new THREE.MeshBasicMaterial({ map: TX.luopanTex({ transparent: true }), transparent: true, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }));
  g.add(core);
  g.userData.rings = rings; g.userData.core = core; g.userData.rim = rim;
  return g;
}

// Hạc trên nóc (mở khoá Tri Âm).
export function crane(m = materials()) {
  const g = new THREE.Group();
  const b = mesh(new THREE.SphereGeometry(0.3, 12, 8), m.white); b.scale.set(1, 0.7, 1.6); g.add(b);
  g.add(cyl(0.04, 0.06, 0.7, m.white, { y: 0.45, z: 0.35, rx: -0.3 }, 6));
  g.add(mesh(new THREE.SphereGeometry(0.08, 8, 6), m.white, { y: 0.8, z: 0.45 }));
  g.add(mesh(new THREE.SphereGeometry(0.04, 6, 4), std({ color: '#c4301f' }), { y: 0.87, z: 0.45 }));
  g.add(mesh(new THREE.ConeGeometry(0.025, 0.25, 5), m.straw, { y: 0.78, z: 0.6, rx: Math.PI / 2 }));
  for (const sx of [-1, 1]) {
    const w = mesh(new THREE.BoxGeometry(0.7, 0.03, 0.45), m.white, { x: sx * 0.4, y: 0.1, rz: sx * 0.35 });
    g.add(w);
    g.add(cyl(0.015, 0.015, 0.6, m.ink, { x: sx * 0.08, y: -0.45 }, 4));
  }
  g.add(mesh(new THREE.BoxGeometry(0.3, 0.03, 0.3), m.ink, { y: 0.05, z: -0.5 }));
  return g;
}
