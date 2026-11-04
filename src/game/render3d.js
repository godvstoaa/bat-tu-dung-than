// ============================================================================
//  HUYỀN QUÁN 3D — cảnh, camera thứ ba, ánh sáng theo giờ thật, hạt, nhãn HTML,
//  chọn điểm bằng raycast. Spec mục 5 + 9. Cùng giao diện với renderer 2D:
//  { resize, frame(scene, dt), yaw, rotate(step), celebrate(wx), mode: '3d' }.
// ============================================================================
import * as THREE from 'three';
import * as MD from './models.js';
import * as TX from './textures.js';
import * as T from './terrain.js';
import { LIGHTS, GLOW_MATS } from './lights.js';
import { createGiatri } from './effects.js';
import { createInteriors } from './interior.js';
import { roomAt } from './world.js';
import { STATIONS, stationById } from './world.js';
import { incenseState } from './state.js';
import { ROBE } from './render.js';
import { hasStation, TEXT } from './features.js';
import { createWorld, QUALITY } from './world3d.js';
import { createLandmarks } from './landmarks.js';
import { setModelQuality } from './assets.js';
import { createCharacter } from './characters.js';
import { buildSect } from './sect.js';
import { addFootprint } from './collide.js';
import { COURT_STATIONS, DAIS, PONDS } from './court.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

// Mức chất lượng: ghi đè bằng localStorage «huyenquan:quality» = low | mid | high
function pickQuality(coarse) {
  try { const q = localStorage.getItem('huyenquan:quality'); if (QUALITY[q]) return q; } catch (e) { /* ignore */ }
  return coarse ? 'mid' : 'high';
}

const WX_COLOR = { 木: '#5fd27a', 火: '#ff5a3c', 土: '#f0b54a', 金: '#f4efe0', 水: '#4f9bff' };
// nhãn gian trong sân: độ cao theo mô hình cũ, dời theo bố cục Sơn Môn (court.js)
const OLD_ANCHOR = {
  tra: [-10.4, 3.7, -8.0], compass: [10.4, 1.9, -8.0], xam: [-11.2, 2.3, 0],
  huong: [0, 2.15, 0.8], lich: [11.2, 3.0, 0], an0: [-7.2, 2.9, 2.4], an1: [7.2, 2.9, 2.4], an2: [7.2, 2.9, -4.0],
};
const LABEL_ANCHOR = { thay: [DAIS.x, DAIS.y + 9.6, DAIS.z + 2.6], sen: [PONDS[0].cx, 1.4, PONDS[0].cz] };
const STATION_CENTER = {};
const COURT_OF = {};
for (const c of COURT_STATIONS) {
  COURT_OF[c.id] = c; STATION_CENTER[c.id] = c.center;
  const a = OLD_ANCHOR[c.id]; if (a) LABEL_ANCHOR[c.id] = [a[0] + c.offset[0], a[1] + c.y, a[2] + c.offset[1]];
}
// mô hình thủ công dựng sẵn ở toạ độ cũ → dời tới chỗ mới
const shift = (id, g) => { const c = COURT_OF[id]; g.position.set(c.offset[0], c.y, c.offset[1]); return g; };

// Khung màu theo giờ (spec 9.5): nội suy tuyến tính giữa các mốc.
const KEYS = [
  // đêm: trời xanh thẫm có trăng sáng (không đen kịt) — người chơi chủ yếu chơi buổi tối
  { h: 0, sky: ['#0d1430', '#26305e', '#171b38'], fog: '#202848', sun: ['#a9bcff', 1.15], hemi: 1.0, night: 1 },
  { h: 5, sky: ['#121a3a', '#33386a', '#1c1f3c'], fog: '#262c4e', sun: ['#a9bcff', 1.15], hemi: 1.0, night: 1 },
  { h: 6.5, sky: ['#4b5d9a', '#f0a36b', '#a9768a'], fog: '#c08f86', sun: ['#ffb27a', 1.3], hemi: 0.7, night: 0.35 },
  { h: 8, sky: ['#6e9cc9', '#efdcb4', '#cdbda2'], fog: '#d8cbb0', sun: ['#fff0d2', 2.6], hemi: 1.0, night: 0 },
  { h: 16, sky: ['#6e9cc9', '#efdcb4', '#cdbda2'], fog: '#d8cbb0', sun: ['#fff0d2', 2.6], hemi: 1.0, night: 0 },
  { h: 18, sky: ['#3b3a72', '#f08a4b', '#8e5a6c'], fog: '#b4766c', sun: ['#ff9a5a', 1.4], hemi: 0.65, night: 0.4 },
  { h: 19.5, sky: ['#121a3a', '#33386a', '#1c1f3c'], fog: '#262c4e', sun: ['#a9bcff', 1.15], hemi: 1.0, night: 1 },
  { h: 24, sky: ['#0d1430', '#26305e', '#171b38'], fog: '#202848', sun: ['#a9bcff', 1.15], hemi: 1.0, night: 1 },
];
const tmpA = new THREE.Color(), tmpB = new THREE.Color();
function lerpHex(a, b, t, out) { return out.copy(tmpA.set(a)).lerp(tmpB.set(b), t); }

function timeLook(hour) {
  let i = 0;
  while (i < KEYS.length - 2 && hour >= KEYS[i + 1].h) i++;
  const A = KEYS[i], B = KEYS[i + 1];
  const t = Math.min(1, Math.max(0, (hour - A.h) / (B.h - A.h)));
  return {
    top: lerpHex(A.sky[0], B.sky[0], t, new THREE.Color()), mid: lerpHex(A.sky[1], B.sky[1], t, new THREE.Color()),
    bottom: lerpHex(A.sky[2], B.sky[2], t, new THREE.Color()), fog: lerpHex(A.fog, B.fog, t, new THREE.Color()),
    sunColor: lerpHex(A.sun[0], B.sun[0], t, new THREE.Color()), sun: A.sun[1] + (B.sun[1] - A.sun[1]) * t,
    hemi: A.hemi + (B.hemi - A.hemi) * t, night: A.night + (B.night - A.night) * t,
  };
}

export function create3D(canvas, { onTap, reduced = false } = {}) {
  const coarse = matchMedia('(pointer: coarse)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !coarse, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.3, 9000);
  let debugCam = null;
  const fog = new THREE.Fog('#d8cbb0', 260, 1900);
  scene.fog = fog;

  // --- bầu trời: vòm gradient bám camera
  const skyUni = { top: { value: new THREE.Color() }, mid: { value: new THREE.Color() }, bottom: { value: new THREE.Color() } };
  const sky = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), new THREE.ShaderMaterial({
    uniforms: skyUni, side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; varying vec3 vP; void main(){ float h = normalize(vP).y; vec3 c = h > 0.0 ? mix(mid, top, pow(clamp(h,0.0,1.0), 0.55)) : mix(mid, bottom, pow(clamp(-h,0.0,1.0), 0.4)); gl_FragColor = vec4(c, 1.0); }',
  }));
  sky.renderOrder = -10;
  sky.visible = false; // thế giới mở dùng Sky tán xạ của world3d.js
  scene.add(sky);

  // sao + trăng
  const starGeo = new THREE.BufferGeometry();
  const sp = []; const sr = TX.rng(77);
  for (let i = 0; i < 700; i++) { const a = sr() * Math.PI * 2, e = 0.08 + sr() * 1.4; sp.push(Math.cos(a) * Math.cos(e) * 380, Math.sin(e) * 380, Math.sin(a) * Math.cos(e) * 380); }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  const starMat = new THREE.PointsMaterial({ color: '#fff6e0', size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false });
  const stars = new THREE.Points(starGeo, starMat); scene.add(stars);
  const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: TX.softTex('rgba(255,250,235,1)', 'rgba(255,250,235,0)'), transparent: true, opacity: 0, fog: false, depthWrite: false }));
  moon.scale.setScalar(36); moon.position.set(-120, 140, -260); scene.add(moon);

  // núi xa kiểu tranh thuỷ mặc
  const mountains = new THREE.Group(); scene.add(mountains);
  const mr = TX.rng(91);
  const mtnMat = new THREE.MeshBasicMaterial({ color: '#7b7a8a', fog: true });
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2 + mr() * 0.3, d = 2600 + mr() * 700, h = 260 + mr() * 420;
    const m = new THREE.Mesh(new THREE.ConeGeometry(h * 0.8 + mr() * 260, h, 5 + Math.floor(mr() * 3)), mtnMat);
    m.position.set(Math.cos(a) * d, -20 + h / 2, Math.sin(a) * d); m.rotation.y = mr() * 3;
    mountains.add(m);
  }

  // --- ánh sáng
  const hemi = new THREE.HemisphereLight('#cfe2ff', '#5a4a3a', 1); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff0d2', 2.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 400 });
  sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);

  // --- thế giới
  const mats = MD.materials();
  const pickables = [];
  const fadeGroups = [];
  const station = (id, g, { fade = false } = {}) => {
    g.userData.station = id;
    if (fade) { MD.ownMaterials(g); fadeGroups.push(g); }
    MD.mergeStatic(g);
    scene.add(g); pickables.push(g);
    if (fade) g.userData.box = new THREE.Box3().setFromObject(g);
    return g;
  };

  // --- THẾ GIỚI MỞ Huyền Giới: địa hình 2048², trời tán xạ, nước, rừng (docs/DAI-THE-GIOI-DESIGN.md)
  const quality = pickQuality(coarse);
  const world = createWorld(scene, renderer, { quality });
  setModelQuality(quality);
  const landmarks = createLandmarks(scene);
  const interiors = createInteriors(scene); // điện thờ vào được (world.js › ROOMS) // tài sản Meshy theo vùng (nạp khi tới gần)
  sun.shadow.mapSize.set(QUALITY[quality].shadow, QUALITY[quality].shadow);
  // nhóm đèn điểm động (lights.js): gán cho các đèn lồng / nến gần người chơi nhất
  const POOL_N = quality === 'high' ? 16 : quality === 'mid' ? 10 : 6;
  const lightPool = Array.from({ length: POOL_N }, () => { const l = new THREE.PointLight('#ffa04a', 0, 26, 1.6); l.visible = false; scene.add(l); return l; });
  let lightNight = 0, lightTick = 0, lightRoom = null, anchorTick = 0;
  function updateLightPool(px, py, pz, dt) {
    lightTick -= dt; if (lightTick > 0) return; lightTick = 0.3;
    const near = [];
    for (const L of LIGHTS) {
      if ((L.room || null) !== lightRoom) continue;
      const d = (L.x - px) ** 2 + (L.z - pz) ** 2 + ((L.y - py) * 0.5) ** 2;
      if (d < 140 * 140) near.push([d, L]);
    }
    near.sort((a, b) => a[0] - b[0]);
    lightPool.forEach((pl, i) => {
      const e = near[i];
      pl.visible = !!e;
      if (!e) return;
      const L = e[1];
      pl.position.set(L.x, L.y, L.z); pl.color.set(L.color);
      // trong điện luôn thắp nến; ngoài trời đèn mạnh dần theo đêm
      pl.intensity = L.power * (lightRoom ? 14 : 1.2 + 16 * lightNight);
    });
  }
  let composer = null;
  if (QUALITY[quality].bloom) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(512, 512), 0.28, 0.5, 0.96));
    composer.addPass(new OutputPass());
  }
  // Huyền Quán Sơn Môn (sect.js theo court.js): sân, tường, cổng, nền đá, Chính Đường, điện phụ, tháp, cây
  const ripple = TX.rippleTex();
  const sect = buildSect(scene, {
    ripple,
    onBig: (obj) => { MD.ownMaterials(obj); obj.userData.box = new THREE.Box3().setFromObject(obj); fadeGroups.push(obj); },
  });
  pickables.push(...sect.pickables);

  // Bàn Thầy Tử Bình: bệ có mái trên tầng 2, trước Chính Đường
  const daisG = MD.masterDais(undefined, TEXT.han); daisG.position.set(DAIS.x, DAIS.y, DAIS.z);
  const hallG = station('thay', daisG, { fade: true });
  addFootprint(daisG, { base: DAIS.y });
  const seatY = DAIS.y + MD.DAIS_FLOOR;
  const masterG = MD.master(); masterG.position.set(DAIS.x, seatY, DAIS.z); scene.add(masterG);
  let masterChar = null;
  createCharacter('master', { height: 1.85 }).then((m) => {
    if (!m) return;
    masterChar = m; m.obj.position.set(DAIS.x, seatY - 0.08, DAIS.z - 0.2); m.setBase('sit'); scene.add(m.obj);
    masterG.visible = false;
  });
  const teaG = station('tra', shift('tra', MD.teaPavilion()), { fade: true });
  const compG = station('compass', shift('compass', MD.compassTerrace()));
  // bản iOS: không có án xăm — đặt giá sách cổ (không tương tác) vào chỗ đó
  const xamG = hasStation('xam') ? station('xam', shift('xam', MD.xamAltar())) : null;
  if (!xamG) { const rack = shift('xam', MD.scrollRack()); MD.mergeStatic(rack); scene.add(rack); }
  const incG = station('huong', shift('huong', MD.incenseBurner()));
  const cal = TX.calendarCanvas();
  const calG = station('lich', shift('lich', MD.calendarBoard(cal.texture)));
  const P0 = PONDS[0];
  const pondG = (() => { const p = MD.pond(ripple, undefined, { cz: 0, W: P0.W, D: P0.D }); p.position.set(P0.cx, 0, P0.cz); if (hasStation('sen')) return station('sen', p); scene.add(p); return p; })();

  // Sảnh nghề ngoài thế giới: dấu vàng xoay + vòng sáng trên mặt đất
  const deskMarks = STATIONS.filter((st) => st.world).map((st) => {
    const g = new THREE.Group(); g.position.set(st.world.x, T.heightAt(st.world.x, st.world.z), st.world.z); g.userData.station = st.id;
    const marker = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), new THREE.MeshStandardMaterial({ color: '#ffd27a', emissive: '#d9a441', emissiveIntensity: 0.9, metalness: 0.6, roughness: 0.3 }));
    marker.position.y = 2.9; g.add(marker);
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.45, 40), new THREE.MeshBasicMaterial({ color: '#ffd27a', transparent: true, opacity: 0.55, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05; g.add(ring);
    scene.add(g); pickables.push(g);
    return { marker, g };
  });

  // Khách hỏi việc (Giải Án): 3 nhân vật đứng chờ + dấu ❓ vàng xoay khi chưa giải
  const caseNpcs = ['an0', 'an1', 'an2'].map((id) => {
    const [x, z] = STATION_CENTER[id];
    const g = new THREE.Group(); g.position.set(x, 0, z); g.userData.station = id;
    const marker = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), new THREE.MeshStandardMaterial({ color: '#ffd27a', emissive: '#d9a441', emissiveIntensity: 0.9, metalness: 0.6, roughness: 0.3 }));
    marker.position.y = 2.75; g.add(marker);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.55, 32), new THREE.MeshBasicMaterial({ color: '#ffd27a', transparent: true, opacity: 0.55, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.03; g.add(ring);
    scene.add(g); pickables.push(g);
    return { id, g, marker, ring, av: null, robe: null };
  });

  // cây (vị trí theo PROPS của world.js) + trúc ngoài tường
  const trees = [];
  for (const [kind, x, z, seed] of [['peach', -31, 34, 1], ['pine', 31, 34, 2], ['peach', -31, 15, 3], ['pine', 31, 15, 4], ['peach', -12, 60, 5], ['peach', 12, 60, 6]]) {
    const t = kind === 'peach' ? MD.peachTree(seed) : MD.pineTree(seed);
    t.position.set(x, 0, z); t.rotation.y = seed;
    if (kind === 'peach') trees.push(t);
    MD.mergeStatic(t); scene.add(t); addFootprint(t, { hi: 1.3 });
  }
  for (const [x, z, s] of [[-46, 36, 1], [-46, 44, 2], [-34, 45, 3], [46, 36, 4], [46, 44, 5], [34, 45, 6], [-46, 20, 7], [-34, 19, 8], [46, 18, 9], [56, 2, 10], [-56, 2, 11]]) {
    const b = MD.bambooClump(s); b.position.set(x, 0, z); MD.mergeStatic(b); scene.add(b); addFootprint(b, { hi: 1.5 });
  }
  const rocks = MD.floatingRocks(); scene.add(rocks);
  // đá trôi thành đảo nổi lơ lửng trên Huyền Thành (cao 140–260 m)
  rocks.children.forEach((r, i) => { r.position.x *= 6; r.position.z *= 6; r.position.y = 140 + (i * 37) % 120; r.scale.setScalar(3 + (i % 3)); });

  // đèn lồng có ánh sáng: 2 ở chính đường, 2 ở cổng
  const lanternLights = [];
  for (const [x, y, z] of [[DAIS.x - 4.6, seatY + 3.3, DAIS.z + 3.25], [DAIS.x + 4.6, seatY + 3.3, DAIS.z + 3.25], [-3.8, 4.2, 64.2], [3.8, 4.2, 64.2]]) {
    const l = MD.lantern(1.1, { light: true }); l.position.set(x, y, z); scene.add(l);
    l.traverse((o) => { if (o.isPointLight) lanternLights.push(o); });
  }
  // dây đèn mở khoá (Môn Sinh)
  const extraLanterns = new THREE.Group();
  for (let i = 0; i < 7; i++) { const l = MD.lantern(0.7); l.position.set(DAIS.x - 3.6 + i * 1.2, seatY + 3.55 + Math.sin(i * 0.9) * 0.05, DAIS.z + 3.25); extraLanterns.add(l); }
  extraLanterns.visible = false; scene.add(extraLanterns);
  const craneG = MD.crane(); craneG.position.set(DAIS.x + 2.4, seatY + 8.0, DAIS.z); craneG.rotation.y = -0.6; craneG.visible = false; scene.add(craneG);

  // Thiên Bàn
  const tb = MD.thienBan(); tb.position.set(0, 78, -80); tb.rotation.x = -0.32; tb.scale.setScalar(2.6); scene.add(tb);
  let celebrate = 0; const celebColor = new THREE.Color(); const baseRing = new THREE.Color('#ffd27a');

  // đèn trời (instanced)
  const skyLanternGeo = new THREE.LatheGeometry([[0.001, -0.5], [0.3, -0.45], [0.42, 0], [0.36, 0.4], [0.2, 0.55], [0.001, 0.56]].map(([r, y]) => new THREE.Vector2(r, y)), 10);
  const SLN = 40;
  const skyLanterns = new THREE.InstancedMesh(skyLanternGeo, new THREE.MeshBasicMaterial({ color: '#ff9b45', toneMapped: false, fog: true }), SLN);
  const slData = []; const lr = TX.rng(55);
  for (let i = 0; i < SLN; i++) slData.push({ a: lr() * Math.PI * 2, r: 28 + lr() * 55, y: -12 + lr() * 40, v: 0.35 + lr() * 0.5, w: (lr() - 0.5) * 0.02, s: 0.6 + lr() * 0.7 });
  scene.add(skyLanterns);

  // biển mây (cũ — thay bằng biển mây của world3d)
  const clouds = new THREE.Group(); clouds.visible = false; scene.add(clouds);
  const cloudMat = new THREE.MeshBasicMaterial({ map: TX.cloudTex(), transparent: true, opacity: 0.85, depthWrite: false, fog: true });
  const cr = TX.rng(61);
  for (let i = 0; i < 46; i++) {
    const c = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), cloudMat);
    const a = cr() * Math.PI * 2, d = 18 + cr() * 140;
    c.position.set(Math.cos(a) * d, -7 - cr() * 9, Math.sin(a) * d);
    c.rotation.x = -Math.PI / 2; c.rotation.z = cr() * 6;
    c.scale.setScalar(30 + cr() * 40);
    c.userData.v = 0.3 + cr() * 0.6;
    clouds.add(c);
  }

  // hạt: bụi vàng, đom đóm, cánh đào
  function points(n, color, size, spread, opts = {}) {
    const g = new THREE.BufferGeometry(); const p = new Float32Array(n * 3); const r = TX.rng(opts.seed || 5);
    for (let i = 0; i < n; i++) { p[i * 3] = (r() - 0.5) * spread[0]; p[i * 3 + 1] = spread[1][0] + r() * (spread[1][1] - spread[1][0]); p[i * 3 + 2] = (r() - 0.5) * spread[2]; }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const m = new THREE.PointsMaterial({ color, size, map: TX.softTex(), transparent: true, depthWrite: false, opacity: opts.opacity ?? 0.8, blending: opts.additive ? THREE.AdditiveBlending : THREE.NormalBlending });
    const pts = new THREE.Points(g, m); pts.userData.seed = Array.from({ length: n }, () => r() * 10);
    scene.add(pts); return pts;
  }
  const dust = points(420, '#ffd98a', 0.09, [110, [0.3, 7], 120], { seed: 3, opacity: 0.55 });
  const flies = points(220, '#d6ff7a', 0.16, [110, [0.3, 3], 120], { seed: 4, opacity: 0, additive: true });
  const petals = points(90, '#f6a8be', 0.11, [6, [0.2, 4], 6], { seed: 6, opacity: 0.9 });

  // khói nhang
  const smokeMat = new THREE.SpriteMaterial({ map: TX.softTex('rgba(235,235,240,0.9)', 'rgba(235,235,240,0)'), transparent: true, depthWrite: false });
  const smoke = [];
  for (let i = 0; i < 36; i++) { const s = new THREE.Sprite(smokeMat.clone()); s.visible = false; scene.add(s); smoke.push({ s, life: 0, vx: 0, vz: 0 }); }
  let smokeT = 0;

  // khách
  let av = null, avRobe = null;
  const avState = { heading: Math.PI, phase: 0, walk: 0, lastX: null, lastZ: null };
  // Nhân vật Meshy cho người chơi (dáng hero_m / hero_f); procedural chỉ hiện khi chưa nạp xong
  let hero = null, heroLook = null, heroLoading = false;
  // phẩm phục: tô áo theo Dụng thần (robe), đai theo Hỷ thần (accent) — đổi màu thì dựng lại nhân vật
  function ensureHero(look, robe, accent) {
    const key = `${look}|${robe}|${accent || ''}`;
    if (heroLook === key || heroLoading) return;
    heroLoading = true;
    createCharacter(look, { height: 1.9, tint: { primary: robe, accent } }).then((h) => {
      heroLoading = false;
      if (!h) { heroLook = key; return; }
      if (hero) scene.remove(hero.obj);
      hero = h; heroLook = key; scene.add(h.obj);
    });
  }
  let lastEmote = null;
  let giatri = null, giatriWx = null; const giatriPos = new THREE.Vector3();

  function ensureAvatar(robe) {
    if (av && avRobe === robe) return;
    if (av) scene.remove(av);
    av = MD.avatar(ROBE[robe] || ROBE.土); avRobe = robe;
    av.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    scene.add(av);
  }

  // --- người chơi khác (MMO): mẫu gộp hình theo (màu áo × tư thế) → mỗi người 1–2 draw call
  const remoteTpl = new Map();
  function remoteTemplate(robe, sitting) {
    const key = robe + (sitting ? ':s' : ':w');
    if (!remoteTpl.has(key)) {
      const a = MD.avatar(ROBE[robe] || ROBE.土);
      MD.poseAvatar(a, { sitting, walk: 0, phase: 0, idle: 0 });
      const g = new THREE.Group(); g.add(a);
      MD.mergeStatic(g);
      g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
      remoteTpl.set(key, g);
    }
    return remoteTpl.get(key);
  }
  const remotes = new Map(); // id → { grp, walk, sit, robe, label, bubble, heading }
  const remoteGroups = [];
  function remoteEntry(o) {
    let r = remotes.get(o.id);
    if (r && (r.robe !== o.robe || r.acc !== (o.acc || ''))) { dropRemote(o.id); r = null; }
    if (!r) {
      const grp = new THREE.Group(); grp.userData.remoteId = o.id;
      const walk = remoteTemplate(o.robe, false).clone(), sit = remoteTemplate(o.robe, true).clone();
      grp.add(walk, sit); scene.add(grp); remoteGroups.push(grp);
      const label = document.createElement('div'); label.className = 'hq-label hq-name hq-other';
      const bub = document.createElement('div'); bub.className = 'hq-bubble'; bub.hidden = true;
      layer.append(label, bub);
      r = { grp, walk, sit, robe: o.robe, acc: o.acc || '', label, bub, heading: o.h || 0, ch: null };
      remotes.set(o.id, r);
      const rr = r;
      createCharacter(o.look === 'hero_f' ? 'hero_f' : 'hero_m', { height: 1.9, tint: { primary: o.robe, accent: o.acc } }).then((ch) => { if (!ch || !remotes.has(o.id)) return; rr.ch = ch; grp.add(ch.obj); rr.walk.visible = rr.sit.visible = false; });
    }
    return r;
  }
  function dropRemote(id) {
    const r = remotes.get(id); if (!r) return;
    scene.remove(r.grp); r.label.remove(); r.bub.remove();
    remoteGroups.splice(remoteGroups.indexOf(r.grp), 1);
    remotes.delete(id);
  }
  const selfBub = document.createElement('div'); selfBub.className = 'hq-bubble'; selfBub.hidden = true;
  // bong bóng của Thầy (đang luận bằng AI)
  const masterBub = document.createElement('div'); masterBub.className = 'hq-bubble master'; masterBub.hidden = true;

  // nhãn HTML
  const layer = document.createElement('div');
  layer.className = 'hq-labels';
  canvas.parentElement.appendChild(layer);
  const labels = STATIONS.map((st) => {
    const d = document.createElement('div'); d.className = 'hq-label'; d.textContent = st.name; layer.appendChild(d);
    const anchor = LABEL_ANCHOR[st.id] || (st.world ? [st.world.x, T.heightAt(st.world.x, st.world.z) + 3.4, st.world.z] : [0, 3, 0]);
    return { id: st.id, el: d, pos: new THREE.Vector3(...anchor) };
  });
  const nameTag = document.createElement('div'); nameTag.className = 'hq-label hq-name'; layer.appendChild(nameTag);
  layer.appendChild(selfBub);
  layer.appendChild(masterBub);
  const targetRing = new THREE.Mesh(new THREE.RingGeometry(0.28, 0.4, 32), new THREE.MeshBasicMaterial({ color: '#ffd27a', transparent: true, opacity: 0.8, depthWrite: false }));
  targetRing.rotation.x = -Math.PI / 2; targetRing.visible = false; scene.add(targetRing);

  // --- camera thứ ba
  const cam = { yaw: 0, pitch: 0.4, dist: 15, target: new THREE.Vector3(3.5, 1.2, 3.5), yawGoal: 0 };
  const proj = new THREE.Vector3();

  // điều khiển con trỏ: kéo = xoay, chạm/click ngắn = đi tới
  const ptrs = new Map(); let down = null; let pinch = 0;
  canvas.addEventListener('pointerdown', (e) => {
    try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* con trỏ không còn hoạt động */ }
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 1) down = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, t: performance.now(), moved: false };
    else { down = null; const [a, b] = [...ptrs.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch) cam.dist = Math.min(48, Math.max(6, cam.dist * (pinch / d)));
      pinch = d; return;
    }
    if (!down) return;
    if (!down.moved && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) down.moved = true;
    if (down.moved) {
      cam.yawGoal -= (e.clientX - down.lx) * 0.006;
      // kéo lên = ngước nhìn trời (pitch âm), kéo xuống = nhìn từ trên cao
      cam.pitch = Math.min(1.15, Math.max(-0.75, cam.pitch + (e.clientY - down.ly) * 0.004));
      down.lx = e.clientX; down.ly = e.clientY;
    }
  });
  const up = (e) => {
    if (down && !down.moved && performance.now() - down.t < 450 && ptrs.size === 1) {
      const hit = pick(e.clientX, e.clientY);
      if (hit && onTap) onTap(hit);
    }
    ptrs.delete(e.pointerId);
    if (ptrs.size < 2) pinch = 0;
    if (!ptrs.size) down = null;
  };
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', (e) => { ptrs.delete(e.pointerId); down = null; pinch = 0; });
  canvas.addEventListener('wheel', (e) => { e.preventDefault(); cam.dist = Math.min(48, Math.max(6, cam.dist * (1 + e.deltaY * 0.0012))); }, { passive: false });

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function pick(cx, cy) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const rh = ray.intersectObjects(remoteGroups, true)[0];
    if (rh) {
      let o = rh.object; while (o && !o.userData.remoteId) o = o.parent;
      if (o) return { player: o.userData.remoteId, ...MD.toTile(rh.point.x, rh.point.z) };
    }
    // mặt đất: sân quán + các chunk địa hình gần camera
    const near = world.terrainMeshes().filter((m) => m.geometry.boundingSphere && m.geometry.boundingSphere.center.distanceTo(camera.position) < 700);
    const hits = ray.intersectObjects([...pickables, ...near], true);
    for (const h of hits) {
      let o = h.object;
      while (o && !o.userData.station) o = o.parent;
      if (o) return { station: stationById(o.userData.station), ...MD.toTile(h.point.x, h.point.z) };
      return { station: null, ...MD.toTile(h.point.x, h.point.z) };
    }
    return null;
  }

  // --- vòng cập nhật
  let calKey = '';
  let fpsAcc = 0, fpsN = 0, fpsT = 0, lowQuality = false;
  const tmpV = new THREE.Vector3();
  const tmpV2 = new THREE.Vector3();
  const headV = new THREE.Vector3();

  function resize() {
    const w = canvas.clientWidth || 640, h = canvas.clientHeight || 448;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2));
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
    camera.aspect = w / h;
    // màn dọc (điện thoại): mở rộng góc nhìn để thấy đủ sân
    camera.fov = camera.aspect < 0.8 ? 64 : 45;
    camera.updateProjectionMatrix();
  }

  let debugHour = null;
  const sunDir = new THREE.Vector3(), lightDir = new THREE.Vector3(), moonDir = new THREE.Vector3(-0.5, 0.75, -0.4).normalize();
  function applyTime(now) {
    const hour = debugHour ?? (now.getHours() + now.getMinutes() / 60);
    const L = timeLook(hour);
    skyUni.top.value.copy(L.top); skyUni.mid.value.copy(L.mid); skyUni.bottom.value.copy(L.bottom);
    // đêm: trời tán xạ vật lý chỉ ra xám → dùng vòm chuyển màu xanh thẫm của game (có trăng sao)
    const nightSky = L.night >= 0.6; sky.visible = nightSky; if (world.sky) world.sky.visible = !nightSky;
    fog.color.copy(L.fog);
    mtnMat.color.copy(L.fog).lerp(L.top, 0.25).multiplyScalar(0.82);
    cloudMat.color.copy(L.mid).lerp(new THREE.Color('#ffffff'), 0.35 * (1 - L.night));
    // môi trường PMREM (bầu trời) đã chiếu sáng vật liệu PBR → đèn bán cầu chỉ còn phần bổ sung
    hemi.intensity = L.hemi * (0.35 + 0.3 * L.night); hemi.color.copy(L.top).lerp(new THREE.Color('#ffffff'), 0.5);
    scene.environmentIntensity = 0.55 - L.night * 0.25;
    sun.color.copy(L.sunColor); sun.intensity = L.sun;
    // mặt trời ban ngày đi Đông → Tây; ban đêm dùng ánh trăng cố định
    const day = Math.min(1, Math.max(0, (hour - 6) / 12));
    // hướng mặt trời (cho Sky tán xạ + bóng): ngày Đông → Tây; đêm mặt trời dưới chân trời, trăng chiếu
    const a = Math.PI * day;
    sunDir.set(Math.cos(a), L.night < 0.9 ? 0.08 + Math.sin(a) * 0.9 : -0.25, 0.35).normalize();
    world.setSun(sunDir);
    lightDir.copy(L.night < 0.9 ? sunDir : moonDir);
    starMat.opacity = L.night * 0.9; moon.material.opacity = L.night;
    const glow = 0.25 + L.night * 0.9;
    mats.lanternRed.emissiveIntensity = glow * 1.4;
    for (const l of lanternLights) l.intensity = L.night * 6 + 0.4;
    flies.material.opacity = Math.max(0, L.night - 0.3) * 0.95;
    renderer.toneMappingExposure = 0.82 + L.night * 0.38;
    // đèn lồng / nến phát sáng: ngày dịu, đêm rực
    for (const m of GLOW_MATS) { const gg = m.userData.glow; m.emissiveIntensity = gg.base + gg.night * L.night; }
    lightNight = L.night;
    return L;
  }

  function frame(S, dt) {
    const t = S.time / 1000;
    const now = S.now;
    const L = applyTime(now);
    const p = S.player;
    ensureAvatar(p.robe);

    // khách: vị trí, hướng, nhịp bước
    const w = MD.toWorld(p.x, p.y);
    const dx = avState.lastX == null ? 0 : w.x - avState.lastX, dz = avState.lastZ == null ? 0 : w.z - avState.lastZ;
    avState.lastX = w.x; avState.lastZ = w.z;
    const speed = dt > 0 ? Math.hypot(dx, dz) / dt : 0;
    let goal = avState.heading;
    if (p.sitting) goal = Math.PI;
    else if (speed > 0.3) goal = Math.atan2(dx, dz);
    else if (S.near && (STATION_CENTER[S.near.id] || S.near.world)) { const c = STATION_CENTER[S.near.id] || [S.near.world.x, S.near.world.z]; goal = Math.atan2(c[0] - w.x, c[1] - w.z); }
    let dh = ((goal - avState.heading + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
    avState.heading += dh * Math.min(1, dt * 10);
    avState.walk += ((speed > 0.3 && !p.sitting ? 1 : 0) - avState.walk) * Math.min(1, dt * 8);
    avState.phase += dt * 9.5 * avState.walk;
    // bay lượn: độ cao trên mặt đất mượt dần (ngự kiếm cất cánh / hạ xuống)
    avState.alt = (avState.alt || 0) + (((p.flying ? p.alt || 0 : 0)) - (avState.alt || 0)) * Math.min(1, dt * 3);
    const gy = world.groundY(w.x, w.z) + avState.alt;
    av.position.set(w.x, gy, w.z);
    ensureHero(p.look || 'hero_m', p.robe, p.accent);
    if (hero) {
      av.visible = false;
      hero.obj.position.set(w.x, gy, w.z);
      hero.obj.rotation.y = avState.heading;
      hero.setBase(p.sitting ? 'sit' : p.flying ? 'idle' : avState.walk > 0.4 ? 'run' : 'idle');
      if (S.selfEmote && S.selfEmote !== lastEmote) { lastEmote = S.selfEmote; hero.play(S.selfEmote.e === 'wave' ? 'wave' : 'bow'); }
      hero.update(dt);
    }
    // gia trì nguyên tố theo hành Dụng thần (progress.js) — dựng lại khi đổi hành
    if (!giatri || giatriWx !== p.robe) {
      if (giatri) { scene.remove(giatri.obj); scene.remove(giatri.trail); }
      giatri = createGiatri(p.robe); giatriWx = p.robe; scene.add(giatri.obj); scene.add(giatri.trail);
    }
    giatri.set(S.giatri || []);
    giatri.obj.position.set(w.x, gy, w.z); giatri.obj.rotation.y = avState.heading;
    giatriPos.set(w.x, gy, w.z);
    giatri.update(dt, t, { moving: avState.walk > 0.4, flying: !!p.flying, world: giatriPos });
    // bóng đổ + mặt trời bám theo người chơi
    sun.target.position.set(w.x, gy, w.z);
    sun.position.copy(sun.target.position).addScaledVector(lightDir, 160);
    world.update(w.x, w.z, dt, t);
    lightRoom = roomAt(w.x, w.z)?.id || null; // trong điện: chỉ thắp nến / đèn của điện đó
    updateLightPool(w.x, gy + 2, w.z, dt);
    interiors.update(dt);
    // nhãn + dấu vàng của trạm có toạ độ thế giới: bám mặt sàn thật (nền bậc, sàn điện) — cập nhật thưa
    anchorTick -= dt;
    if (anchorTick <= 0) {
      anchorTick = 2;
      for (const lb of labels) { const st = stationById(lb.id); if (st?.world) lb.pos.y = world.groundY(st.world.x, st.world.z) + 3.4; }
      for (const d of deskMarks) d.g.position.y = world.groundY(d.g.position.x, d.g.position.z);
    }
    landmarks.update(w.x, w.z);
    av.rotation.y = avState.heading;
    MD.poseAvatar(av, { walk: avState.walk, phase: avState.phase, sitting: p.sitting, idle: t });

    // camera bám khách, giảm chấn
    cam.yaw += (cam.yawGoal - cam.yaw) * Math.min(1, dt * 8);
    // màn dọc: nhìn vượt lên trước khách → khách nằm 1/3 dưới, khung dành cho quán
    const portrait = camera.aspect < 0.8;
    const ahead = p.sitting ? 0.6 : (portrait ? 3.4 : 1.0);
    tmpV.set(w.x - Math.sin(cam.yaw) * ahead, gy + (p.sitting ? 0.9 : 1.3), w.z - Math.cos(cam.yaw) * ahead);
    // dịch chuyển xa (truyền tống / hồi sinh): camera nhảy thẳng, không trượt qua nửa bản đồ
    if (cam.target.distanceTo(tmpV) > 40) cam.target.copy(tmpV); else cam.target.lerp(tmpV, Math.min(1, dt * 5));
    const cd = cam.dist * (p.sitting ? 0.75 : 1) * (portrait ? 0.9 : 1);
    // ngước nhìn trời: camera hạ sát đất (không chui xuống đất), điểm nhìn nâng dần lên theo độ ngước
    const elev = Math.max(cam.pitch, 0.06);
    const lookUp = cam.pitch < 0.15 ? (0.15 - cam.pitch) * cd * 2.4 : 0;
    camera.position.set(
      cam.target.x + Math.sin(cam.yaw) * Math.cos(elev) * cd,
      cam.target.y + Math.sin(elev) * cd,
      cam.target.z + Math.cos(cam.yaw) * Math.cos(elev) * cd,
    );
    const floorY = world.groundY(camera.position.x, camera.position.z) + 0.6;
    if (camera.position.y < floorY) camera.position.y = floorY;
    // trong điện: camera không xuyên tường / trần
    const inRoom = roomAt(cam.target.x, cam.target.z);
    if (inRoom) {
      const ox = inRoom.origin.x, oz = inRoom.origin.z, mx = inRoom.w / 2 - 0.9, mz = inRoom.d / 2 - 0.9;
      camera.position.x = Math.min(ox + mx, Math.max(ox - mx, camera.position.x));
      camera.position.z = Math.min(oz + mz, Math.max(oz - mz, camera.position.z));
      camera.position.y = Math.min(inRoom.h - 1, camera.position.y);
    }
    tmpV2.copy(cam.target); tmpV2.y += lookUp;
    camera.lookAt(tmpV2);
    if (debugCam) { camera.position.fromArray(debugCam.pos); camera.lookAt(...debugCam.look); }
    world.occlusion(w.x, w.z, camera.position.x, camera.position.z);
    sky.position.copy(camera.position); stars.position.copy(camera.position);

    // làm mờ công trình che khuất khách
    headV.set(w.x, gy + 1.2, w.z);
    ray.set(camera.position, tmpV.copy(headV).sub(camera.position).normalize());
    const far = camera.position.distanceTo(headV);
    for (const g of fadeGroups) {
      const hit = ray.ray.intersectBox(g.userData.box, proj);
      const block = hit && camera.position.distanceTo(proj) < far - 0.5 && !g.userData.box.containsPoint(headV);
      const goalO = block ? 0.22 : 1;
      for (const m of g.userData.fadeMats) { m.opacity += (goalO - m.opacity) * Math.min(1, dt * 8); m.depthWrite = m.opacity > 0.95; }
    }

    if (masterChar) { masterChar.update(dt); if (S.near?.id === 'thay' && !masterChar.greeted) { masterChar.greeted = true; masterChar.play('bow'); } if (S.near?.id !== 'thay') masterChar.greeted = false; }
    // thầy: viết, thỉnh thoảng ngẩng nhìn khách khi khách lại gần
    const mr = masterG.userData.rig;
    mr.arm.rotation.x = Math.sin(t * 2.2) * 0.08; mr.arm.rotation.y = Math.sin(t * 1.1) * 0.1;
    const look = S.near?.id === 'thay' ? 1 : 0;
    mr.head.rotation.x = look ? -0.05 : 0.22 + Math.sin(t * 0.7) * 0.03;
    mr.head.rotation.y = look ? Math.atan2(w.x - DAIS.x, w.z - DAIS.z) * 0.6 : Math.sin(t * 0.3) * 0.2;

    // la bàn: kim run nhẹ
    if (!reduced) compG.userData.needle.rotation.y = Math.sin(t * 0.9) * 0.12 + Math.sin(t * 3.1) * 0.02;
    // nến xăm
    if (xamG) {
      for (const f of xamG.userData.flames) f.scale.set(1, 0.85 + Math.sin(t * 13 + f.position.z * 7) * 0.15, 1);
      xamG.userData.candleLight.intensity = 1.8 + Math.sin(t * 11) * 0.3 + L.night * 2;
    }

    // nhang
    const I = incG.userData.incense;
    const inc = incenseState(S.state, now.getTime());
    I.group.visible = inc.burning;
    if (inc.burning) {
      const len = 0.18 + 0.62 * (1 - inc.progress);
      for (const s of I.sticks) { s.body.scale.y = len; s.body.position.y = len / 2; s.tip.position.y = len; }
      I.light.intensity = 0.8 + Math.sin(t * 7) * 0.2;
      smokeT -= dt;
      if (smokeT <= 0 && !reduced && !lowQuality) {
        smokeT = 0.09;
        const sm = smoke.find((x) => !x.s.visible);
        if (sm) {
          const st = I.sticks[Math.floor(Math.random() * 3)];
          sm.s.position.set(incG.position.x + st.g.position.x + I.top.x - len * Math.sin(st.g.rotation.z), incG.position.y + I.top.y + len, incG.position.z + I.top.z);
          sm.life = 0; sm.vx = (Math.random() - 0.5) * 0.15; sm.vz = (Math.random() - 0.5) * 0.15; sm.s.visible = true;
        }
      }
    } else I.light.intensity = 0;
    for (const sm of smoke) {
      if (!sm.s.visible) continue;
      sm.life += dt;
      sm.s.position.x += sm.vx * dt + Math.sin(sm.life * 2 + sm.vz * 30) * 0.004;
      sm.s.position.y += dt * 0.55; sm.s.position.z += sm.vz * dt;
      sm.s.scale.setScalar(0.12 + sm.life * 0.28);
      sm.s.material.opacity = Math.max(0, 0.5 * (1 - sm.life / 3.2));
      if (sm.life > 3.2) sm.s.visible = false;
    }

    // hồ: gợn nước + đèn hoa đăng của khách
    ripple.offset.x = (t * 0.015) % 1; ripple.offset.y = Math.sin(t * 0.2) * 0.02;
    const B = pondG.userData.bounds;
    pondG.userData.lanterns.forEach((Lt, i) => {
      Lt.visible = i < Math.min(6, S.todayLanterns.length);
      if (!Lt.visible) return;
      const span = B.x1 - B.x0;
      Lt.position.set(B.x0 + ((t * 0.18 + i * 2.1) % span), 0.14 + Math.sin(t * 1.3 + i) * 0.02, B.z0 + (B.z1 - B.z0) * (0.5 + 0.4 * Math.sin(t * 0.21 + i * 1.7)));
      Lt.rotation.y = t * 0.2 + i;
    });

    // lịch đổi theo ngày
    const key = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${S.dayGanZhi}`;
    if (key !== calKey) { calKey = key; cal.draw({ day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear(), lunar: S.lunarText, gz: S.dayGanZhi }); }

    // trà, cây, mở khoá
    if (S.teaColor) for (const c of teaG.userData.cups || []) c.material.color.set(S.teaColor);
    const bloom = !!S.peachBloom;
    if (trees[0].userData.bloom !== bloom) for (const tr of trees) { tr.userData.bloom = bloom; tr.userData.crown.traverse((o) => { if (o.isMesh) o.material = bloom ? mats.blossom : mats.leaf; }); }
    petals.visible = bloom && !lowQuality && !reduced;
    extraLanterns.visible = !!S.lanterns;
    craneG.visible = !!S.crane;

    // Thiên Bàn
    const R = tb.userData.rings;
    if (!reduced) { R[0].rotation.z = t * 0.03; R[1].rotation.z = -t * 0.05; R[2].rotation.z = t * 0.08; tb.userData.core.rotation.z = -t * 0.02; }
    if (celebrate > 0) {
      celebrate -= dt;
      const k = Math.min(1, celebrate / 1.5);
      for (const r of R) r.material.color.copy(baseRing).lerp(celebColor, k);
      tb.userData.rim.emissiveIntensity = 0.6 + 2 * k;
    }

    // đèn trời, đá trôi, mây
    const mt = new THREE.Matrix4(); const q = new THREE.Quaternion(); const sc = new THREE.Vector3(); const ps = new THREE.Vector3();
    for (let i = 0; i < SLN; i++) {
      const d = slData[i];
      if (!reduced) { d.y += d.v * dt; d.a += d.w * dt; if (d.y > 34) d.y = -14; }
      ps.set(Math.cos(d.a) * d.r, d.y, Math.sin(d.a) * d.r); sc.setScalar(d.s);
      mt.compose(ps, q, sc); skyLanterns.setMatrixAt(i, mt);
    }
    skyLanterns.instanceMatrix.needsUpdate = true;
    if (!reduced) {
      rocks.children.forEach((r, i) => { r.position.y += Math.sin(t * 0.4 + r.userData.bob) * dt * 0.15; r.rotation.y += dt * 0.02 * (i % 2 ? 1 : -1); });
      for (const c of clouds.children) { c.position.x += c.userData.v * dt; if (c.position.x > 160) c.position.x = -160; }
    }

    // hạt
    if (!reduced && !lowQuality) {
      const animate = (pts, fn) => { const a = pts.geometry.attributes.position; for (let i = 0; i < a.count; i++) fn(a, i, pts.userData.seed[i]); a.needsUpdate = true; };
      animate(dust, (a, i, s) => { a.setY(i, a.getY(i) + dt * 0.08); a.setX(i, a.getX(i) + Math.sin(t * 0.3 + s) * dt * 0.1); if (a.getY(i) > 6) a.setY(i, 0.3); });
      if (flies.material.opacity > 0.01) animate(flies, (a, i, s) => { a.setX(i, a.getX(i) + Math.sin(t * 0.8 + s) * dt * 0.5); a.setZ(i, a.getZ(i) + Math.cos(t * 0.7 + s * 1.3) * dt * 0.5); a.setY(i, 0.6 + Math.abs(Math.sin(t * 0.5 + s)) * 2.2); });
      if (petals.visible) animate(petals, (a, i, s) => {
        let y = a.getY(i) - dt * 0.35; if (y < 0.05) y = 3.8;
        a.setY(i, y); a.setX(i, a.getX(i) + Math.sin(t + s) * dt * 0.25);
      });
    }
    dust.visible = !lowQuality;
    petals.position.set(trees[0].position.x, 0, trees[0].position.z);

    // khách hỏi việc: đổi màu áo theo khách trong ngày, nhìn về phía người chơi khi lại gần
    for (const cn of caseNpcs) {
      const info = (S.cases || []).find((c) => c.id === cn.id);
      if (!info) { cn.g.visible = false; continue; }
      cn.g.visible = true;
      if (cn.robe !== info.npc.robe + info.npc.gender) {
        if (cn.av) cn.g.remove(cn.av);
        cn.av = MD.avatar(ROBE[info.npc.robe] || ROBE.土, { hat: info.npc.gender === 'nam' });
        cn.av.traverse((o) => { if (o.isMesh) o.castShadow = true; });
        cn.g.add(cn.av); cn.robe = info.npc.robe + info.npc.gender;
        // thay bằng nhân vật Meshy (khe chẵn: thương nhân, khe lẻ: dân làng)
        const look = caseNpcs.indexOf(cn) % 2 ? 'npc_villager' : 'npc_merchant';
        if (cn.ch) { cn.g.remove(cn.ch.obj); cn.ch = null; }
        createCharacter(look, { height: 1.8 }).then((ch) => { if (!ch) return; cn.ch = ch; cn.g.add(ch.obj); cn.av.visible = false; });
      }
      MD.poseAvatar(cn.av, { walk: 0, phase: 0, sitting: false, idle: t + cn.g.position.x });
      if (cn.ch) {
        cn.ch.update(dt);
        const near2 = Math.hypot(w.x - cn.g.position.x, w.z - cn.g.position.z) < 6;
        if (near2 && !cn.waved) { cn.waved = true; cn.ch.play(cn.ch.has('wave') ? 'wave' : 'bow'); }
        if (!near2) cn.waved = false;
      }
      const dxp = w.x - cn.g.position.x, dzp = w.z - cn.g.position.z;
      const lookGoal = Math.hypot(dxp, dzp) < 6 ? Math.atan2(dxp, dzp) : 0;
      cn.av.rotation.y += (((lookGoal - cn.av.rotation.y + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI) * Math.min(1, dt * 4);
      if (cn.ch) cn.ch.obj.rotation.y = cn.av.rotation.y;
      cn.marker.visible = !info.done; cn.ring.visible = !info.done;
      if (!info.done && !reduced) { cn.marker.rotation.y = t * 1.6; cn.marker.position.y = 2.75 + Math.sin(t * 2 + cn.g.position.x) * 0.08; }
      const lb = labels.find((l) => l.id === cn.id);
      if (lb) { const txt = `${info.npc.call} ${info.done ? '✓' : '❓'}`; if (lb.el.textContent !== txt) lb.el.textContent = txt; }
    }
    if (!reduced) for (const d of deskMarks) { d.marker.rotation.y = t * 1.6; d.marker.position.y = 2.9 + Math.sin(t * 2) * 0.1; }

    // người chơi khác
    const seen = new Set();
    for (const o of S.others || []) {
      seen.add(o.id);
      const r = remoteEntry(o);
      const ow = MD.toWorld(o.x, o.y);
      const sitting = !!o.s;
      r.walk.visible = !sitting && !r.ch; r.sit.visible = sitting && !r.ch;
      if (r.ch) {
        const close = camera.position.distanceTo(r.grp.position) < 60;
        r.ch.obj.visible = true;
        r.ch.setBase(sitting ? 'sit' : o.moving ? 'run' : 'idle');
        if (o.bubble && o.bubble !== r.lastBub) { r.lastBub = o.bubble; if (o.bubble.text === '🙇' || o.bubble.text === '🙏') r.ch.play('bow'); else if (o.bubble.text === '👋') r.ch.play('wave'); }
        if (close) r.ch.update(dt);
      }
      r.grp.position.set(ow.x, world.groundY(ow.x, ow.z) + (o.a || 0) + (sitting ? 0 : (o.moving && !reduced ? Math.abs(Math.sin(t * 9.5 + ow.x)) * 0.07 : 0)), ow.z);
      const goalH = sitting ? Math.PI : (o.h || 0);
      const dh2 = ((goalH - r.heading + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
      r.heading += dh2 * Math.min(1, dt * 8);
      r.grp.rotation.y = r.heading;
      r.data = o;
    }
    for (const id of [...remotes.keys()]) if (!seen.has(id)) dropRemote(id);

    // vòng đích
    if (S.target && !p.sitting) { const tw = MD.toWorld(S.target.x, S.target.y); targetRing.position.set(tw.x, world.groundY(tw.x, tw.z) + 0.03, tw.z); targetRing.visible = true; targetRing.scale.setScalar(1 + Math.sin(t * 6) * 0.1); }
    else targetRing.visible = false;

    if (composer && !lowQuality) composer.render(); else renderer.render(scene, camera);

    // nhãn HTML
    const rw = canvas.clientWidth, rh = canvas.clientHeight;
    for (const lb of labels) {
      proj.copy(lb.pos).project(camera);
      const vis = proj.z < 1 && Math.abs(proj.x) < 1.15 && Math.abs(proj.y) < 1.15 && camera.position.distanceTo(lb.pos) < 220;
      lb.el.style.display = vis ? '' : 'none';
      if (!vis) continue;
      const near = S.near?.id === lb.id;
      const dist = camera.position.distanceTo(lb.pos);
      lb.el.style.transform = `translate(-50%,-100%) translate(${(proj.x * 0.5 + 0.5) * rw}px,${(-proj.y * 0.5 + 0.5) * rh}px)`;
      lb.el.style.opacity = near ? 1 : Math.max(0.35, Math.min(0.9, 1.4 - dist / 30));
      lb.el.classList.toggle('near', near);
    }
    proj.set(w.x, gy + (p.sitting ? 1.75 : 2.45), w.z).project(camera);
    nameTag.textContent = p.name || '';
    nameTag.classList.toggle('gold', !!p.gold);
    nameTag.style.transform = `translate(-50%,-100%) translate(${(proj.x * 0.5 + 0.5) * rw}px,${(-proj.y * 0.5 + 0.5) * rh}px)`;
    const place = (el, x, y, z, dy = 0) => {
      proj.set(x, y, z).project(camera);
      const vis = proj.z < 1 && Math.abs(proj.x) < 1.1 && Math.abs(proj.y) < 1.1;
      el.style.display = vis ? '' : 'none';
      if (vis) el.style.transform = `translate(-50%,-100%) translate(${(proj.x * 0.5 + 0.5) * rw}px,${(-proj.y * 0.5 + 0.5) * rh + dy}px)`;
      return vis;
    };
    const nowMs = performance.now();
    const showBubble = (el, b, x, y, z) => {
      const on = b && nowMs < b.until;
      el.hidden = !on;
      if (on) { if (el.textContent !== b.text) el.textContent = b.text; place(el, x, y, z, -22); }
    };
    showBubble(selfBub, S.selfBubble, w.x, gy + (p.sitting ? 1.75 : 2.45), w.z);
    showBubble(masterBub, S.masterBubble, 0, 2.6, -5.35);
    for (const r of remotes.values()) {
      const o = r.data; if (!o) continue;
      const ow = MD.toWorld(o.x, o.y);
      const near = camera.position.distanceTo(r.grp.position) < 24;
      const hy = world.groundY(ow.x, ow.z) + (o.a || 0) + (o.s ? 1.75 : 2.45);
      if (r.label.textContent !== o.name) r.label.textContent = o.name;
      if (near) place(r.label, ow.x, hy, ow.z); else r.label.style.display = 'none';
      showBubble(r.bub, near ? o.bubble : null, ow.x, hy, ow.z);
    }

    // tự hạ chất lượng nếu chậm
    fpsAcc += dt; fpsN++; fpsT += dt;
    if (fpsT > 3) {
      const fps = fpsN / fpsAcc;
      if (fps < 35 && !lowQuality) { lowQuality = true; renderer.shadowMap.enabled = false; renderer.setPixelRatio(1); mats.roof.needsUpdate = true; scene.traverse((o) => { if (o.material) o.material.needsUpdate = true; }); }
      fpsAcc = 0; fpsN = 0; fpsT = 0;
    }
  }

  return {
    mode: '3d',
    scene, // kiểm thử / gỡ lỗi
    resize,
    frame,
    pick,
    get yaw() { return cam.yaw; },
    rotate(step) { cam.yawGoal += step; },
    celebrate(wx) { celebColor.set(WX_COLOR[wx] || '#ffd27a'); celebrate = 6; },
    get lowQuality() { return lowQuality; },
    info: () => ({ ...renderer.info.render, quality, trees: world.treeCount, pending: world.pending, cam: camera.position.toArray().map((v) => Math.round(v)), target: cam.target.toArray().map((v) => Math.round(v)) }),
    // Ảnh chụp canvas (kiểm thử / chia sẻ): vẽ lại rồi đọc ngay trong cùng tác vụ.
    snapshot(type = 'image/jpeg') { renderer.render(scene, camera); return canvas.toDataURL(type, 0.85); },
    // Kiểm thử ánh sáng theo giờ: ghi đè giờ hiển thị (null = giờ thật).
    setDebugHour(h) { debugHour = h; },
    // gỡ lỗi: camera tự do { pos:[x,y,z], look:[x,y,z] } — null để trả về bám khách
    setDebugCam(v) { debugCam = v; },
    // Kiểm thử / ảnh chụp: đặt góc nhìn camera
    setView({ yaw, pitch, dist } = {}) { if (yaw != null) { cam.yaw = cam.yawGoal = yaw; } if (pitch != null) cam.pitch = pitch; if (dist != null) cam.dist = dist; },
  };
}
