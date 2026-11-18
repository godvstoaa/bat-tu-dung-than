// Trang xem cây cổ thụ (src/game/tienphu/oldtree.js): window.cay.render(loài, { lod, cam }) → { png, info }
import * as THREE from 'three';
import { growTree, SPECIES, treeTemplate } from '../src/game/tienphu/oldtree.js';
const W = 1600, H = 900;
const rd = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
rd.setSize(W, H); rd.toneMapping = THREE.ACESFilmicToneMapping; rd.toneMappingExposure = 1.0; rd.shadowMap.enabled = true; rd.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(rd.domElement);
const sc = new THREE.Scene(); sc.background = new THREE.Color('#bcd0dc'); sc.fog = new THREE.Fog('#bcd0dc', 120, 420);
sc.add(new THREE.HemisphereLight('#dfeaf2', '#5a5640', 1.1));
const sun = new THREE.DirectionalLight('#fff1dc', 2.6); sun.position.set(60, 90, 40); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
Object.assign(sun.shadow.camera, { left: -90, right: 90, top: 90, bottom: -90, near: 1, far: 300 }); sun.shadow.bias = -0.0004; sc.add(sun);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), new THREE.MeshStandardMaterial({ color: '#7c8f58', roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; sc.add(ground);
// thước tỉ lệ: người 1,7 m + cột 10 m vạch mỗi 1 m
const ruler = new THREE.Group(); sc.add(ruler);
{ const man = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 1.25, 4, 8), new THREE.MeshStandardMaterial({ color: '#b04a3a' })); man.position.y = 0.85; man.castShadow = true; ruler.add(man);
  for (let i = 0; i < 10; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1, 0.12), new THREE.MeshStandardMaterial({ color: i % 2 ? '#ffffff' : '#c02020' })); s.position.set(1.2, i + 0.5, 0); ruler.add(s); } }
const held = new THREE.Group(); sc.add(held);
let mats = null;
async function matsFor(sp) { const m = await import('../src/game/tienphu/oldtree.js'); return m; }
window.cay = {
  list: Object.keys(SPECIES),
  async render(sp, { lod = 'near', n = 3, dist = 0, elev = 1.6, season = 0, aerial = false, dbg = '' } = {}) {
    held.clear();
    const mod = await matsFor(sp);
    const t0 = performance.now(); const Ts = []; for (let v = 0; v < n; v++) Ts.push(treeTemplate(sp, v)); const ms = performance.now() - t0;
    // dựng qua plantOldTrees để dùng đúng vật liệu game
    const gap = Math.max(...Ts.map((T) => T.R)) * 2.15 + 4, list = Ts.map((T, v) => ({ x: (v - (n - 1) / 2) * gap, z: 0, kind: sp, s: 1, v }));
    const pl = mod.plantOldTrees(held, list, season); await pl.ready;
    // ép cấp chi tiết: đặt người chơi ở khoảng cách tương ứng
    const D = lod === 'near' ? 0 : lod === 'mid' ? (mod.NEAR + mod.MID) / 2 : (mod.MID + mod.FAR) / 2;
    pl.update(0, -D);
    if (dbg) held.traverse((o) => { if (!o.isInstancedMesh) return; const m = o.material; o.material = dbg === 'basic' ? new THREE.MeshBasicMaterial({ map: m.map, alphaTest: 0.4, side: THREE.DoubleSide }) : new THREE.MeshStandardMaterial({ color: '#bbbbbb', side: THREE.DoubleSide }); });
    const Hm = Math.max(...Ts.map((T) => T.H)), span = gap * n;
    ruler.position.set(list[0].x - Ts[0].R - 3, 0, Ts[0].R * 0.3 + 2);
    const cam = new THREE.PerspectiveCamera(42, W / H, 0.5, 1500);
    const dd = dist || Math.max(span * 0.62, Hm * 1.55);
    if (aerial) { cam.position.set(0, Hm * 2.2, dd * 0.9); cam.lookAt(0, 0, 0); } else { cam.position.set(0, elev, dd); cam.lookAt(0, Hm * 0.45, 0); }
    rd.render(sc, cam);
    const st = pl.stats();
    return { png: rd.domElement.toDataURL('image/png'), info: { ms: Math.round(ms), H: Ts.map((T) => T.H.toFixed(1)), R: Ts.map((T) => T.R.toFixed(1)), trunk: Ts.map((T) => T.trunkR.toFixed(2)), tips: Ts.map((T) => T.tips), tris: Ts.map((T) => ({ near: Math.round((T.near.bark.index.count + T.near.leaf.index.count) / 3), mid: Math.round((T.mid.bark.index.count + T.mid.leaf.index.count) / 3), far: Math.round((T.far.bark.index.count + T.far.leaf.index.count) / 3) })), st } };
  },
};
window.cay.sc = sc; window.cay.rd = rd; window.cayReady = true;
// xem nhanh một GLB bất kỳ (nhận dạng file tải): window.cay.glb(url) → png
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
window.cay.glb = async (url) => {
  held.clear(); const g = await new GLTFLoader().loadAsync(url); const o = g.scene; const b = new THREE.Box3().setFromObject(o), s = b.getSize(new THREE.Vector3()), k = 20 / s.y;
  o.scale.setScalar(k); o.position.set(-(b.min.x + b.max.x) / 2 * k, -b.min.y * k, -(b.min.z + b.max.z) / 2 * k); held.add(o);
  let tris = 0; o.traverse((m) => { if (m.isMesh) { m.castShadow = true; tris += (m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3; } });
  ruler.position.set(-14, 0, 6);
  const cam = new THREE.PerspectiveCamera(40, W / H, 0.5, 1500); cam.position.set(0, 9, 42); cam.lookAt(0, 9, 0); rd.render(sc, cam);
  const png = rd.domElement.toDataURL('image/jpeg', 0.7);
  o.traverse((m) => { if (m.isMesh) { m.geometry.dispose(); for (const mt of [].concat(m.material)) { for (const t of ['map', 'normalMap', 'roughnessMap', 'metalnessMap']) mt[t]?.dispose(); mt.dispose(); } } }); held.clear();
  return { png, tris: Math.round(tris), w: (s.x * k).toFixed(1), d: (s.z * k).toFixed(1) };
};
// cây Meshy đã đóng gói (bigtrees.js): window.cay.big(['soi','sakura'], { lod: 'near'|'mid'|'far', n: 2 })
window.cay.big = async (kinds, { lod = 'near', n = 2, dist = 0, elev = 1.7 } = {}) => {
  held.clear(); const mod = await import('../src/game/tienphu/bigtrees.js');
  const list = []; let x = 0; const dims = [];
  for (const k of kinds) { const b = mod.BIG[k]; const R = (((b.H[0] + b.H[1]) / 2) * b.w) / 2; for (let v = 0; v < n; v++) { x += R + 3; list.push({ x, z: -v * 0.01, kind: k, s: v ? 1.15 : 0.85 }); x += R + 3; } dims.push({ k, H: b.H, R: R.toFixed(1) }); }
  for (const t of list) t.x -= x / 2;
  const pl = mod.plantBigTrees(held, list, 0); await pl.ready;
  const D = lod === 'near' ? 0 : lod === 'mid' ? (mod.NEAR + mod.MID) / 2 : (mod.MID + mod.FAR) / 2; pl.update(0, -D);
  ruler.position.set(list[0].x - 4, 0, 6);
  const Hm = Math.max(...kinds.map((k) => mod.BIG[k].H[1])), cam = new THREE.PerspectiveCamera(42, W / H, 0.5, 1500), dd = dist || Math.max(x * 0.62, Hm * 1.6);
  cam.position.set(0, elev, dd); cam.lookAt(0, Hm * 0.45, 0); rd.render(sc, cam);
  return { png: rd.domElement.toDataURL('image/jpeg', 0.8), st: pl.stats(), dims };
};
// chụp ảnh xa (impostor) của cây Meshy đã chuẩn hoá: 2 hướng (trước +z, bên +x) → atlas 2 ô vuông cạnh S (m, theo cao 1), nền trong suốt
window.cay.imp = async (kind, px = 512) => {
  const mod = await import('../src/game/tienphu/bigtrees.js'); const T = await mod.bigTemplate(kind); if (!T) return { err: 'no template' };
  const geo = T.near.geo, src = T.near.mat; geo.computeBoundingBox(); const b = geo.boundingBox;
  const hw = Math.max(-b.min.x, b.max.x, -b.min.z, b.max.z), S = Math.max(1, 2 * hw) * 1.02;
  const r2 = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); r2.setSize(px * 3, px); r2.setClearColor(0x000000, 0); r2.outputColorSpace = THREE.SRGBColorSpace;
  const s2 = new THREE.Scene(); const m = new THREE.MeshBasicMaterial({ map: src.map || null, color: src.map ? 0xffffff : 0x557744, vertexColors: !src.map && !!geo.attributes.color, side: THREE.DoubleSide, alphaTest: 0.5 });
  const mesh = new THREE.Mesh(geo, m); s2.add(mesh);
  r2.setScissorTest(true);
  { // ô 3: nhìn từ trên xuống (bay qua phủ) — phải ảnh = +x, trên ảnh = −z
    const cam = new THREE.OrthographicCamera(-S / 2, S / 2, S / 2, -S / 2, 0.01, 20); cam.up.set(0, 0, -1); cam.position.set(0, 5, 0); cam.lookAt(0, 0, 0); cam.updateProjectionMatrix();
    r2.setViewport(2 * px, 0, px, px); r2.setScissor(2 * px, 0, px, px); r2.render(s2, cam);
  }
  for (const [i, yaw] of [[0, 0], [1, Math.PI / 2]]) {
    const cam = new THREE.OrthographicCamera(-S / 2, S / 2, S, 0, -10, 10); cam.position.set(Math.sin(yaw) * 5, 0, Math.cos(yaw) * 5); cam.lookAt(0, 0, 0); cam.position.y = 0; cam.updateProjectionMatrix();
    // nhìn ngang: đặt khung y từ 0 → S
    cam.top = S; cam.bottom = 0; cam.updateProjectionMatrix();
    r2.setViewport(i * px, 0, px, px); r2.setScissor(i * px, 0, px, px); r2.render(s2, cam);
  }
  const png = r2.domElement.toDataURL('image/png'); r2.dispose(); m.dispose();
  return { png, S: +S.toFixed(3) };
};
