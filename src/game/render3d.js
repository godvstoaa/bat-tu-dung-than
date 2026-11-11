// ============================================================================
//  HUYỀN QUÁN 3D — cảnh, camera thứ ba, ánh sáng theo giờ thật, hạt, nhãn HTML,
//  chọn điểm bằng raycast. Spec mục 5 + 9. Cùng giao diện với renderer 2D:
//  { resize, frame(scene, dt), yaw, rotate(step), celebrate(wx), mode: '3d' }.
// ============================================================================
import * as THREE from 'three';
import { span, record } from './perf.js';
import * as MD from './models.js';
import * as TX from './textures.js';
import * as MG from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as T from './terrain.js';
import { LIGHTS, GLOW_MATS, addLight } from './lights.js';
import { createGiatri } from './effects.js';
import { createInteriors } from './interior.js';
import { roomAt } from './world.js';
import { STATIONS, stationById } from './world.js';
import { incenseState } from './state.js';
import { createIncense } from './incense3d.js';
import { updateLotus } from './lotus.js';
import { ROBE } from './render.js';
import { hasStation, TEXT } from './features.js';
import { createWorld, QUALITY } from './world3d.js';
import { createLandmarks } from './landmarks.js';
import { setModelQuality, setWarmup, settleLods, loadModel as loadGlb, placeModel, instanceModel } from './assets.js';
import { createCharacter, setViewer } from './characters.js';
import { poseOf } from './flight-poses.js';
import { createCitizens, setCitizenCap } from './citizens.js';
import { walkers4 } from './city4.js';
import { createRoomBuilder } from './interior-build.js';
import { createMansions } from './mansion3d.js';
import { createRiver } from './river3d.js';
import * as MO from './motion.js';
import { createFleet, makeBoat, makeBoatByIdx, floatBoat } from './boats3d.js';
import { docks as boatDocks } from './boats.js';
import { splash as playSplash, paddle as playPaddle } from './audio.js';
import { createPrison } from './prison3d.js';
import { registerPrison } from './prison.js';
import { createLifePlaces, makeYoke } from './lifeplaces3d.js';
import { registerLifePlaces } from './lifeplaces.js';
import { createJobPlaces, makeParcel } from './jobplaces3d.js';
import { registerJobPlaces } from './jobplaces.js';
import * as RZ from './raze.js';
import { homeInfoOf } from './rooms.js';
import { setEstateOwner, setEstateLookup } from './cityident3d.js';
import { buildSect } from './sect.js';
import { createOutfit } from './accessories.js';
import { ITEM, decodeCos } from './cosmetics.js';
import { addFootprint, footprintIdle } from './collide.js';
import { stoneReady } from './ground-tex.js';
import { COURT, COURT_STATIONS, DAIS, PONDS, TANGY, inCourt } from './court.js';
import { pickBark } from './bark-pool.js'; // NPC-AI G0 bark pool — thuần, không DOM (docs/npc-ai/15 §15.5b)
import { hashSeed, rng } from './npc.js';  // rng theo hạt giống — không Math.random trần
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { setActors, blockedByBuilding, platformTop } from './obstacles.js';
import { zones as jobZones } from './jobzones.js';

// Mức chất lượng: ghi đè bằng localStorage «huyenquan:quality» = low | mid | high
function pickQuality(coarse, renderer) {
  try { const q = localStorage.getItem('huyenquan:quality'); if (QUALITY[q]) return q; } catch (e) { /* ignore */ }
  if (coarse) return 'mid';
  // card đồ hoạ tích hợp (Intel UHD / Iris, AMD APU…): mặc định «mid» — đo trên Intel UHD: high 17 fps
  try {
    const gl = renderer.getContext(), ext = gl.getExtension('WEBGL_debug_renderer_info');
    const name = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    // không có GPU thật (dựng hình bằng CPU: máy cũ / driver bị chặn / máy ảo) → THẤP ngay, «vừa» vẫn đứng hình
    if (/SwiftShader|llvmpipe|softpipe|Basic Render|Software/i.test(name)) { document.documentElement.dataset.hqSoftGl = '1'; return 'low'; }
    if (/Intel|UHD|Iris|Mali|Adreno|PowerVR|Apple GPU|Radeon\(TM\) Graphics|Vega \d+ Graphics/i.test(name)) return 'mid';
  } catch (e) { /* ignore */ }
  return 'high';
}

const WX_COLOR = { 木: '#5fd27a', 火: '#ff5a3c', 土: '#f0b54a', 金: '#f4efe0', 水: '#4f9bff' };
// nhãn gian trong sân: độ cao theo mô hình cũ, dời theo bố cục Sơn Môn (court.js)
const OLD_ANCHOR = {
  tra: [-10.4, 3.7, -8.0], compass: [10.4, 1.9, -8.0], xam: [-11.2, 2.3, 0],
  huong: [0, 2.15, 0.8], lich: [11.2, 3.0, 0], an0: [-7.2, 2.9, 2.4], an1: [7.2, 2.9, 2.4], an2: [7.2, 2.9, -4.0],
};
const LABEL_ANCHOR = { thay: [DAIS.x, DAIS.y + 9.6, DAIS.z + 2.6], sen: [PONDS[0].cx, 1.4, PONDS[0].cz], tangy: [TANGY.x, 3.6, TANGY.z] };
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
// scratch dùng lại qua các khung hình — không cấp phát Matrix4/Quaternion/Vector3/Color mới mỗi khung
const MT4 = new THREE.Matrix4(), QT4 = new THREE.Quaternion(), VS1 = new THREE.Vector3(), VS2 = new THREE.Vector3();
const WHITE = new THREE.Color('#ffffff');

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
  /* giữ 9000 m: phông núi xa (mtnMat) nằm ngoài vòng sương — cắt còn 1800 m thì đỉnh núi bị chặt (đã thử, ảnh shots/far1800) */
  const camera = new THREE.PerspectiveCamera(45, 1, 0.3, 9000);
  let debugCam = null;
  // sương gần hơn: các ngưỡng đổi bậc chi tiết / nạp vùng xa nằm trong mù (không thấy nhà «bật» ra ở xa)
  const fog = new THREE.Fog('#d8cbb0', 190, 1700);
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
    const a = (i / 22) * Math.PI * 2 + mr() * 0.3, d = 3400 + mr() * 900, h = 320 + mr() * 520;
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
  const quality = pickQuality(coarse, renderer);
  document.documentElement.dataset.hqQuality = quality; /* để kiểm / hỗ trợ: xem mức đồ hoạ đang dùng */
  /* dựng hình bằng CPU: chi phí tỉ lệ số điểm ảnh → ½ độ phân giải (¼ điểm ảnh) + không bóng đổ (đỡ một lượt vẽ cả cảnh) */
  const softGl = !!document.documentElement.dataset.hqSoftGl;
  if (softGl || quality === 'low') renderer.shadowMap.enabled = false; /* mức thấp: không bóng đổ ngay từ đầu (lượt bóng vẽ lại cả cảnh gần ~ +40% tam giác); tắt lúc đầu không phải biên dịch lại shader */
  // v4: máy hết bộ nhớ đồ họa (WebGL mất ngữ cảnh — trình duyệt hay báo «xảy ra sự cố») → tự tải lại ở mức THẤP thay vì treo / sập
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    try { if (localStorage.getItem('huyenquan:quality') !== 'low') { localStorage.setItem('huyenquan:quality', 'low'); localStorage.setItem('huyenquan:autoLow', '1'); setTimeout(() => location.reload(), 300); return; } } catch (err) { /* ignore */ }
    const d = document.createElement('div'); d.className = 'hq-loading'; d.style.zIndex = 99; d.textContent = 'Máy hết bộ nhớ đồ họa — đóng bớt tab / ứng dụng khác rồi tải lại trang.'; document.body.appendChild(d);
  }, false);
  if (quality !== 'high') renderer.shadowMap.type = THREE.PCFShadowMap; // bóng mềm PCFSoft: đắt trên máy yếu
  let qualityForced = false; try { qualityForced = !!QUALITY[localStorage.getItem('huyenquan:quality')]; } catch (e) { /* ignore */ }
  // v4: một phần cảnh hỏng (dân phố, thuyền, kè sông, biệt phủ…) chỉ bỏ phần đó — KHÔNG kéo cả game rơi về 2D
  const initErrors = [];
  const noop = new Proxy({}, { get: () => () => undefined });
  const safeInit = (name, fn, stub = noop) => { try { return fn(); } catch (e) { console.error(`[huyenquan] 3D: bỏ phần «${name}» vì lỗi`, e); initErrors.push(`${name}: ${e?.message || e}`); return stub; } };
  const world = span('init:world', () => createWorld(scene, renderer, { quality }));
  setModelQuality(quality);
  const landmarks = span('init:landmarks', () => createLandmarks(scene));
  const interiors = span('init:interiors', () => createInteriors(scene)); // điện thờ vào được (world.js › ROOMS) // tài sản Meshy theo vùng (nạp khi tới gần)
  sun.shadow.mapSize.set(QUALITY[quality].shadow, QUALITY[quality].shadow);
  // nhóm đèn điểm động (lights.js): gán cho các đèn lồng / nến gần người chơi nhất
  const POOL_N = quality === 'high' ? 6 : quality === 'mid' ? 4 : 3; // mỗi đèn điểm = thêm chi phí cho MỌI điểm ảnh lit
  const lightPool = Array.from({ length: POOL_N }, () => { const l = new THREE.PointLight('#ffa04a', 0, 26, 1.6); l.position.set(0, -500, 0); scene.add(l); return l; });
  // SỐ đèn trong cảnh phải cố định: bật/tắt `visible` làm đổi số đèn → three.js biên dịch lại shader
  // của MỌI vật liệu (khựng 250–400 ms mỗi lần đi qua vùng có đèn). Đèn rỗi: cường độ 0, cất dưới đất.
  let lightNight = 0, lightTick = 0, lightRoom = null, anchorTick = 0, absorbT = 5;
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
      if (!e) { pl.intensity = 0; pl.position.set(0, -500, 0); return; }
      const L = e[1];
      pl.position.set(L.x, L.y, L.z); pl.color.set(L.color);
      // trong điện luôn thắp nến; ngoài trời đèn mạnh dần theo đêm
      pl.intensity = L.power * (lightRoom ? 14 : 1.2 + 16 * lightNight);
    });
  }
  let composer = null, bloomPass = null;
  if (QUALITY[quality].bloom) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(bloomPass = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.28, 0.5, 0.96));
    composer.addPass(new OutputPass());
    composer.setPixelRatio(renderer.getPixelRatio()); // render target của bloom cùng tỉ lệ pixel với canvas
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
  createCharacter('master', {}).then((m) => {
    if (!m) return;
    masterChar = m; m.obj.position.set(DAIS.x, seatY, DAIS.z + 0.15); m.setBase('idle'); scene.add(m.obj);
    masterG.visible = false;
  });
  const teaG = station('tra', shift('tra', MD.teaPavilion()), { fade: true });
  const compG = station('compass', shift('compass', MD.compassTerrace()));
  // bản iOS: không có án xăm — đặt giá sách cổ (không tương tác) vào chỗ đó
  const xamG = hasStation('xam') ? station('xam', shift('xam', MD.xamAltar())) : null;
  if (!xamG) { const rack = shift('xam', MD.scrollRack()); MD.mergeStatic(rack); scene.add(rack); }
  const incG = station('huong', shift('huong', MD.incenseBurner()));
  // lư hương chung: nhang của cả phòng (lư lớn + 8 lư nhỏ quanh Đại Đỉnh — incense3d.js)
  const incense = (() => { const I = incG.userData.incense; I.group.visible = false; const top = I.top.clone().add(incG.position); const r = createIncense(scene, mats, { mainTop: top, merge: MD.mergeStatic, instanceModel }); const ca = incG.userData.cauldronAt; placeModel(incG, 'cauldron', { fit: { height: MD.CAULDRON_FIT.height }, at: { ...ca, ry: Math.PI / 2 } }).catch(() => {}); for (const g of r.root.children) if (g.userData.station) pickables.push(g); return r; })();
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

  // người bán ở quầy Tàng Y Các — cúi chào khi khách lại gần
  let tailor = null;
  createCharacter('npc_merchant', {}).then((ch) => { if (!ch) return; tailor = ch; ch.obj.position.set(TANGY.x + 1.2, 0, TANGY.z - 1.2); scene.add(ch.obj); });

  // --- NPC-AI G2 · bark cục bộ (docs/npc-ai/05 §05.2; luật không-lộ-chuyện mục 13:
  //     bark chỉ gán DOM tại máy này, KHÔNG thêm field nào vào payload mạng, không
  //     import net.js/protocol.js; người chơi khác không bao giờ thấy bark của máy này) ---
  // Nhịp bark theo hạt giống ngày+lượt (hashSeed/rng npc.js — không Math.random trần):
  // cùng ngày + cùng lượt → cùng bark, mai tự đổi; pool rỗng/lạ → im lặng như hôm nay
  // (mục 05 §05.3), KHÔNG bịa giọng, KHÔNG đổi hành vi render sẵn có.
  const makeBark = () => ({ round: 0, nextAt: 0, bark: null });
  function tickBark(bk, active, nowMs, seedBase, poolId) {
    if (!active) { bk.bark = null; return; }
    if (!bk.bark && nowMs >= bk.nextAt) {
      const seed = `${seedBase}|${bk.round++}`;
      const r = rng(hashSeed(seed));
      const text = pickBark(poolId, seed);
      if (text) bk.bark = { text, until: nowMs + 4200 + Math.floor(r() * 1800) }; // hiện 4,2–6 giây
      bk.nextAt = nowMs + (bk.bark ? bk.bark.until - nowMs + 5000 : 2500) + Math.floor(r() * 4000); // nghỉ 5–9 giây
    } else if (bk.bark && nowMs >= bk.bark.until) bk.bark = null;
  }
  // bark Bà Tư (hồ sơ 34 — pool `tho_may` bark-pool.js): hiện khi khách lại gần quầy
  // Tàng Y Các (cùng điều kiện S.near 'tangy' của cúi chào), mỗi lượt một câu theo
  // seed ngày + số lượt trong phiên (G2b stations dùng cùng múi `${dayKey}:tangy`)
  const tangyBark = makeBark();
  // [F3 audit] Pool bark khách ❓ chọn theo CHỦ ĐỀ án của CHÍNH khách đó (npc.topic
  // — npc.js QUESTIONS: career/wealth/love/study/move) vì chuyện án của khách sinh
  // theo topic (story-gen.js TOPIC_FILES); bong bóng nói chuyện sảnh khác án
  // (điều hậu/cách cục như kiểu khe chẵn/lẻ cũ) là tự mâu thuẫn. Mapping topic→pool:
  // hai pool khach_* hiện có đều là câu RIÊNG của sảnh — khach_dieuhau: khí hậu/
  // điều hậu lá số; khach_cachcuc: cách thành/bại — không topic sân nào khớp hương
  // vị nào, và không pool có câu TRUNG TÍNH chung → trả null: khách im lặng, KHÔNG
  // bịa câu ngoài pool (mục 05 §05.3). G2b khi viết pool khách theo chủ đề (vd
  // 'khach_career'), bổ sung ánh xạ vào bảng dưới — mọi chỗ khác giữ nguyên.
  const KHACH_TOPIC_POOL = {
    // career: 'khach_career', wealth: 'khach_wealth', … — chưa có pool khớp
  };
  const khachPoolOf = (topic) => KHACH_TOPIC_POOL[topic] || null;
  // Tutorial Lão Tùng gác cổng (hồ sơ 33 §33.5.2 nhánh B — TẤT ĐỊNH, không AI, không
  // hạt giống): 3 câu dẫn nhập nguyên văn (06-11:52 / :53 / :119), mỗi câu 7 giây.
  // Chỉ hiện MỘT lần cho người chơi mới lần đầu tới Sơn Môn — flag localStorage
  // 'huyenquan:gaccong' (không đụng state game; máy chưa có save → flag chưa có → nói).
  // Câu quyền riêng tư (S3) KHÔNG nằm ở đây — thuộc tutorial đầy đủ của G2b, chỉ nói 1 lần (T3).
  const LT_TUT = Object.freeze([
    'Khách tới Sơn Môn à. Hề hề. Ngày giờ sinh của khách là gì?',
    'Lão không biết đọc lá số. Lão chỉ hỏi ngày sinh. Đọc là việc của thầy.',
    'Ở Huyền Giới, lá số là nhân vật của khách. Không khai thì lão không biết khách là ai. Khai sai thì nhân vật sai, không ai phạt.',
  ]);
  let ltSeen = false;
  try { ltSeen = !!localStorage.getItem('huyenquan:gaccong'); } catch (e) { /* kho bị khoá — coi như lần đầu trong phiên */ }
  const lt = { i: -1, until: 0, bark: null };
  const GATE_SM = { x: 0, z: COURT.z1 + 1.2 }; // Sơn Môn — sect.js đặt gate_sect đúng tại đây

  // Khách hỏi việc (Giải Án): 3 nhân vật đứng chờ + dấu ❓ vàng xoay khi chưa giải
  const caseNpcs = ['an0', 'an1', 'an2'].map((id) => {
    const [x, z] = STATION_CENTER[id];
    const g = new THREE.Group(); g.position.set(x, 0, z); g.userData.station = id;
    const marker = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), new THREE.MeshStandardMaterial({ color: '#ffd27a', emissive: '#d9a441', emissiveIntensity: 0.9, metalness: 0.6, roughness: 0.3 }));
    marker.position.y = 2.75; g.add(marker);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.55, 32), new THREE.MeshBasicMaterial({ color: '#ffd27a', transparent: true, opacity: 0.55, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.03; g.add(ring);
    scene.add(g); pickables.push(g);
    return { id, g, marker, ring, av: null, robe: null, bark: makeBark(), bub: null };
  });

  // cây (vị trí theo PROPS của world.js) + trúc ngoài tường
  const trees = [];
  for (const [kind, x, z, seed] of [['peach', -31, 34, 1], ['pine', 31, 34, 2], ['peach', -31, 15, 3], ['pine', 31, 15, 4], ['peach', -12, 60, 5], ['peach', 12, 60, 6]]) {
    const t = kind === 'peach' ? MD.peachTree(seed) : MD.pineTree(seed);
    t.position.set(x, 0, z); t.rotation.y = seed;
    if (kind === 'peach') trees.push(t);
    MD.mergeStatic(t); scene.add(t); addFootprint(t, { hi: 1.3, fill: false });
  }
  for (const [x, z, s] of [[-46, 36, 1], [-46, 44, 2], [-34, 45, 3], [46, 36, 4], [46, 44, 5], [34, 45, 6], [-46, 20, 7], [-34, 19, 8], [46, 18, 9], [56, 2, 10], [-56, 2, 11]]) {
    const b = MD.bambooClump(s); b.position.set(x, 0, z); MD.mergeStatic(b); scene.add(b); addFootprint(b, { hi: 1.5, fill: false });
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
  for (let i = 0; i < 90; i++) { const s = new THREE.Sprite(smokeMat.clone()); s.visible = false; scene.add(s); smoke.push({ s, life: 0, vx: 0, vz: 0 }); }
  let smokeT = 0;

  // chén trà trên tay khi ngồi Trà Thất + hơi nóng bốc lên
  const teaCup = new THREE.Group(); teaCup.visible = false; scene.add(teaCup);
  {
    const cel = new THREE.MeshStandardMaterial({ color: '#9fbfae', roughness: 0.25 });
    const cup = new THREE.Mesh(new THREE.LatheGeometry([[0.001, 0], [0.032, 0.004], [0.045, 0.05], [0.042, 0.052], [0.001, 0.018]].map(([r, y]) => new THREE.Vector2(r, y)), 14), cel);
    const tea = new THREE.Mesh(new THREE.CircleGeometry(0.039, 14), new THREE.MeshStandardMaterial({ color: '#b89a4a', roughness: 0.15 }));
    tea.rotation.x = -Math.PI / 2; tea.position.y = 0.042;
    teaCup.add(cup, tea);
  }
  const steamMat = new THREE.SpriteMaterial({ map: TX.softTex('rgba(245,245,250,0.85)', 'rgba(245,245,250,0)'), transparent: true, depthWrite: false });
  const steam = Array.from({ length: 7 }, (_, i) => { const s = new THREE.Sprite(steamMat.clone()); s.visible = false; scene.add(s); return { s, life: i * 0.4 }; });
  const handV = new THREE.Vector3(), fwdV = new THREE.Vector3();

  // khách
  let av = null, avRobe = null;
  const avState = { heading: Math.PI, phase: 0, walk: 0, lastX: null, lastZ: null };
  // Nhân vật Meshy cho người chơi (dáng hero_m / hero_f); procedural chỉ hiện khi chưa nạp xong
  let hero = null, heroLook = null, heroLoading = false;
  // phương tiện đi đất (P4, vehicles.js): ngựa (lib_horse), lừa (ngựa thu nhỏ, sẫm màu), xe ngựa (ngựa + lib_cart)
  const MOUNT = { lua: { h: 1.3, saddle: 0.95, tint: '#7a6a5a' }, ngua: { h: 1.75, saddle: 1.22 }, xengua: { h: 1.75, saddle: 1.05, cart: true } };
  const mountTpl = new Map();
  async function mountTemplate(id) {
    const M = MOUNT[id]; if (!M) return null;
    if (!mountTpl.has(id)) mountTpl.set(id, (async () => {
      const hg = (await loadGlb('lib_horse.mid')) || (await loadGlb('lib_horse.far')) || (await loadGlb('lib_horse'));
      if (!hg) return null;
      const g = new THREE.Group(), horse = hg.scene.clone(true);
      let b = new THREE.Box3().setFromObject(horse), sz = b.getSize(new THREE.Vector3());
      const k = M.h / (sz.y || 1); horse.scale.setScalar(k); b = new THREE.Box3().setFromObject(horse);
      const c = b.getCenter(new THREE.Vector3()); horse.position.set(-c.x, -b.min.y, -c.z);
      const len = b.getSize(new THREE.Vector3()); if (len.x > len.z) horse.rotation.y = Math.PI / 2; // mô hình dọc trục x → quay theo hướng đi (+z)
      if (M.tint) horse.traverse((o) => { if (o.isMesh) { o.material = o.material.clone(); o.material.color.multiply(new THREE.Color(M.tint)); } });
      horse.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      g.add(horse);
      if (M.cart) { const cg = (await loadGlb('lib_cart.mid')) || (await loadGlb('lib_cart.far')); if (cg) { const cart = cg.scene.clone(true); let cb = new THREE.Box3().setFromObject(cart); const ck = 2.2 / (cb.getSize(new THREE.Vector3()).y || 1); cart.scale.setScalar(ck); cb = new THREE.Box3().setFromObject(cart); const cc = cb.getCenter(new THREE.Vector3()); cart.position.set(-cc.x, -cb.min.y, -cc.z - 2.6); g.add(cart); } }
      return g;
    })());
    const tpl = await mountTpl.get(id); return tpl ? tpl.clone(true) : null;
  }
  let myMount = null, myMountId = null, myMountBusy = false;
  // dấu chân đạp nước (P14): tiên đạo → đài sen phát sáng (Bộ Bộ Sinh Liên, ≤ 24) · khí công → sương / bọt (sprite, ≤ 24)
  const stepFx = (() => {
    const petal = new THREE.ConeGeometry(0.12, 0.28, 5); petal.rotateX(Math.PI / 2.6); petal.translate(0, 0.05, 0.1);
    const parts = []; for (let k = 0; k < 8; k++) { const g = petal.clone(); g.rotateY((k / 8) * Math.PI * 2); parts.push(g); }
    const lotusGeo = MG.mergeGeometries(parts); const lotusMat = new THREE.MeshBasicMaterial({ color: '#ffb7d0', transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending });
    const lotus = Array.from({ length: 24 }, () => { const m = new THREE.Mesh(lotusGeo, lotusMat.clone()); m.visible = false; m.userData.life = 9; scene.add(m); return m; });
    const mistMat = new THREE.SpriteMaterial({ map: TX.softTex('rgba(240,248,255,0.9)', 'rgba(240,248,255,0)'), transparent: true, depthWrite: false });
    const mist = Array.from({ length: 24 }, () => { const m = new THREE.Sprite(mistMat.clone()); m.visible = false; m.userData.life = 9; scene.add(m); return m; });
    let t0 = 0;
    return {
      step(fx, x, y, z, heading, dt, moving) {
        if ((t0 -= dt) > 0 || !moving) return; t0 = 0.36;
        if (fx === 'lotus' && !lowQuality && !reduced) { const m = lotus.find((q) => q.userData.life > 1.5) || lotus[0]; m.position.set(x, y + 0.02, z); m.rotation.y = heading; m.userData.life = 0; m.visible = true; }
        else if (fx === 'qi' && !lowQuality && !reduced) for (const sd of [-1, 1]) { const m = mist.find((q) => q.userData.life > 1) || mist[0]; m.position.set(x + Math.cos(heading) * 0.35 * sd, y + 0.15, z - Math.sin(heading) * 0.35 * sd); m.userData.life = 0; m.userData.sd = sd; m.visible = true; }
      },
      tick(dt) {
        for (const m of lotus) { if (!m.visible) continue; m.userData.life += dt; const k = m.userData.life / 1.5; if (k >= 1) { m.visible = false; continue; } m.scale.setScalar(0.6 + k * 0.6); m.material.opacity = 0.85 * (1 - k); }
        for (const m of mist) { if (!m.visible) continue; m.userData.life += dt; const k = m.userData.life; if (k >= 1) { m.visible = false; continue; } m.scale.setScalar(0.3 + k * 0.9); m.position.y += dt * 0.25; m.material.opacity = 0.55 * (1 - k); }
      },
    };
  })();
  // cột sáng nhiệm vụ mệnh (P5) — chỉ dựng trên máy người đúng mệnh
  const fateG = (() => {
    const g = new THREE.Group(); g.visible = false;
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.9, 26, 20, 1, true), new THREE.MeshBasicMaterial({ color: '#ffe08a', transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    col.position.y = 13; g.add(col);
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.6, 2.1, 40), new THREE.MeshBasicMaterial({ color: '#ffd36a', transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.06; g.add(ring);
    g.userData = { col, ring }; scene.add(g); return g;
  })();
  // biển «Chiêu công» ở khu làm của nghề ngoài tiệm (P7 — jobzones.js): cột gỗ + bảng giấy đỏ + đèn lồng nhỏ
  const jobSigns = (() => {
    const g = new THREE.Group(); scene.add(g);
    const postG = new THREE.BoxGeometry(0.16, 2.6, 0.16), boardG = new THREE.BoxGeometry(1.4, 0.85, 0.08), lampG = new THREE.SphereGeometry(0.18, 10, 8);
    const wood = new THREE.MeshStandardMaterial({ color: '#5a3a22', roughness: 0.9 }), paper = new THREE.MeshStandardMaterial({ color: '#b3261e', emissive: '#3a0805', roughness: 0.8 }), lamp = new THREE.MeshBasicMaterial({ color: '#ffb347' });
    const list = [];
    for (const z of Object.values(jobZones())) for (const s of z.spots) {
      const m = new THREE.Group(), p1 = new THREE.Mesh(postG, wood), b = new THREE.Mesh(boardG, paper), l = new THREE.Mesh(lampG, lamp);
      p1.position.y = 1.3; b.position.set(0, 2.25, 0.1); l.position.set(0.62, 2.85, 0.1); m.add(p1, b, l); m.position.set(s.x, 0, s.z); m.visible = false; g.add(m); list.push(m);
    }
    return list;
  })();
  // phẩm phục: tô áo theo Dụng thần (robe), đai theo Hỷ thần (accent) — đổi màu thì dựng lại nhân vật
  // phẩm phục Tàng Y Các: món có look → HSV riêng; không thì theo Dụng / Hỷ thần
  const robeTint = (robe, accent, item) => (ITEM[item]?.look ? { primary: ITEM[item].look.pri, accent: ITEM[item].look.acc } : { primary: robe, accent });
  function ensureHero(look, robe, accent, robeItem = null) {
    const key = `${look}|${robe}|${accent || ''}|${robeItem || ''}`;
    if (heroLook === key || heroLoading) return;
    heroLoading = true;
    createCharacter(look, { tint: robeTint(robe, accent, robeItem) }).then((h) => {
      heroLoading = false;
      if (!h) { heroLook = key; return; }
      if (hero) { hero.dispose(); scene.remove(hero.obj); } // hủy mixer + material clone của bản cũ
      hero = h; heroLook = key; scene.add(h.obj);
    });
  }
  let lastEmote = null;
  let giatri = null, giatriWx = null; const giatriPos = new THREE.Vector3();
  const outfit = createOutfit(scene); // phụ kiện 3D của người chơi (accessories.js)

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
    const oc = decodeCos(o.cos || '');
    if (r && (r.robe !== o.robe || r.acc !== (o.acc || '') || r.robeItem !== (oc.robe || ''))) { dropRemote(o.id); r = null; }
    if (!r) {
      const grp = new THREE.Group(); grp.userData.remoteId = o.id;
      const walk = remoteTemplate(o.robe, false).clone(), sit = remoteTemplate(o.robe, true).clone();
      grp.add(walk, sit); scene.add(grp); remoteGroups.push(grp);
      const label = document.createElement('div'); label.className = 'hq-label hq-name hq-other';
      const bub = document.createElement('div'); bub.className = 'hq-bubble'; bub.hidden = true;
      layer.append(label, bub);
      r = { grp, walk, sit, robe: o.robe, acc: o.acc || '', robeItem: oc.robe || '', label, bub, heading: o.h || 0, ch: null, outfit: createOutfit(scene, { remoteLight: true }), fx: null, fxKey: '', fxNear: false };
      remotes.set(o.id, r);
      const rr = r;
      createCharacter(o.look === 'hero_f' ? 'hero_f' : 'hero_m', { tint: robeTint(o.robe, o.acc, oc.robe) }).then((ch) => {
        if (!ch) return;
        if (!remotes.has(o.id)) { ch.dispose(); return; } // người đã rời phòng trước khi nạp xong — dọn bản vừa dựng
        rr.ch = ch; grp.add(ch.obj); rr.walk.visible = rr.sit.visible = false;
      });
    }
    return r;
  }
  function dropRemote(id) {
    const r = remotes.get(id); if (!r) return;
    if (r.boat) scene.remove(r.boat);
    if (r.mount) scene.remove(r.mount);
    scene.remove(r.grp); r.label.remove(); r.bub.remove();
    r.outfit.dispose(); // hủy geometry/material/texture của phụ kiện
    r.ch?.dispose();    // hủy mixer + material clone của nhân vật
    if (r.fx) { scene.remove(r.fx.obj); scene.remove(r.fx.trail); r.fx.dispose(); }
    remoteGroups.splice(remoteGroups.indexOf(r.grp), 1);
    remotes.delete(id);
  }
  const selfBub = document.createElement('div'); selfBub.className = 'hq-bubble'; selfBub.hidden = true;
  // bong bóng của Thầy (đang luận bằng AI)
  const masterBub = document.createElement('div'); masterBub.className = 'hq-bubble master'; masterBub.hidden = true;
  // bong bóng bark NPC (G2 — mục 05/13): Bà T tư quầy Tàng Y + Lão Tùng cổng Sơn Môn;
  // tái dùng đúng cơ chế showBubble/place của bong bóng Thầy — không dựng cơ chế mới
  const tailorBub = document.createElement('div'); tailorBub.className = 'hq-bubble'; tailorBub.hidden = true;
  const gateBub = document.createElement('div'); gateBub.className = 'hq-bubble'; gateBub.hidden = true;

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
  layer.appendChild(tailorBub);
  layer.appendChild(gateBub);
  for (const cn of caseNpcs) { const b = document.createElement('div'); b.className = 'hq-bubble'; b.hidden = true; layer.appendChild(b); cn.bub = b; } // bark khách ❓ từng khe

  // --- NPC-AI G3 · Vân Cốc & Khổng Tiên Sinh (hồ sơ 17/18) — 2 NPC canon đứng TĨNH
  //     cạnh Am Vân Cốc — Hậu Sơn. KHÔNG tạo caseNpc mới (hệ đó chỉ cho khách án):
  //     gắn thẳng scene root từ đầu ở toạ độ tĩnh (2 mesh, chi phí thấp), dựng đúng
  //     khuôn Thầy/người bán (createCharacter + tint) và bark đúng khuôn tickBark/
  //     showBubble sẵn có — pool persona tương ứng trong bark-pool.js (PERSONA_POOLS,
  //     id trùng persona), seed ngày + tên, hiện khi người chơi tới gần 8 m, nhịp
  //     nghỉ 5–9 s theo khung tickBark hiện hành. landmarks.js › SPOTS 'amvancoc'
  //     đã đặt am tại world (-56,-163) quay ry≈0,57 về bậc Hậu Sơn, bàn scholar_desk
  //     ≈ (-49,8;-153,3), chiếu lệch tiếp 2,2 m — toạ độ dưới khớp cụm đó.
  const HSV_OF = (hex) => { // hex → [h,s,v] 0–1 — tintMaterial (characters.js) nhận mảng HSV, không nhận hex
    const c = new THREE.Color(hex), r = c.r, g = c.g, b = c.b;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    let h = 0;
    if (d > 0) h = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [h / 6, mx === 0 ? 0 : d / mx, mx];
  };
  const hermits = [
    { id: 'van_coc', name: 'Vân Cốc', look: 'master', height: 1.72, x: -52, z: -158,
      ry: Math.atan2(0 - -52, -76 - -158), // quay ra lối vào — cùng hướng am nhìn về bậc điện Hậu Sơn
      tint: { primary: HSV_OF('#d97b29') }, // tăng bào vàng cam đất — «lão tăng am tranh» (hồ sơ 17.1)
      hold: false, ch: null, bark: makeBark(), gy: 0, bub: null },
    { id: 'khong_tiensinh', name: 'Khổng Tiên Sinh', look: 'npc_villager', height: 1.78, x: -49.8, z: -151.5,
      ry: Math.atan2(-49.78 - -49.8, -153.33 - -151.5), // cúi mặt xuống bàn thoại như đang ngồi đọc thẻ tre
      tint: { primary: HSV_OF('#9fb6bf'), accent: HSV_OF('#e8e2d4') }, // áo đạo sĩ xanh xám nhạt, đai trắng ngà (hồ sơ 18.1: thẻ tre, bàn tính)
      hold: true, ch: null, bark: makeBark(), gy: 0, bub: null }, // hold: tay phải trước ngực — quạt giấy gấp của tiên sinh
  ];
  for (const hn of hermits) {
    hn.gy = T.heightAt(hn.x, hn.z); // cao độ đất tại chỗ đứng — landmarks dùng cùng hàm H
    hn.bub = document.createElement('div'); hn.bub.className = 'hq-bubble'; hn.bub.hidden = true; layer.appendChild(hn.bub);
    const el = document.createElement('div'); el.className = 'hq-label'; el.textContent = hn.name; layer.appendChild(el);
    labels.push({ id: hn.id, el, pos: new THREE.Vector3(hn.x, hn.gy + 3.3, hn.z) }); // đi chung vòng nhãn: ẩn ngoài tầm nhìn + mờ theo khoảng cách
    createCharacter(hn.look, { height: hn.height, tint: hn.tint }).then((ch) => {
      if (!ch) return; // thiếu GLB → không dựng (khuôn createCharacter trả null như Thầy/người bán)
      hn.ch = ch;
      ch.obj.position.set(hn.x, hn.gy, hn.z);
      ch.obj.rotation.y = hn.ry;
      scene.add(ch.obj);
    });
  }
  // dân thành Bát Quái (citizens.js): ~33 NPC theo 8 khu — dựng khi tới gần
  if (quality === 'low') setCitizenCap(16); // máy yếu: ít nhân vật có xương cùng lúc
  const citizens = safeInit('citizens', () => createCitizens({ scene, layer, groundY: (x, z) => platformTop(x, z) ?? T.heightAt(x, z), extra: [...walkers4(), ...boatDocks().map((d, i) => ({ id: `chudo_${d.id}`, name: ['Lão Lái', 'Cô Đò', 'Chú Chèo', 'Bà Bến'][i % 4] + ' ' + ['Hà', 'Giang', 'Thủy', 'Lâm', 'Nguyệt', 'Tuyền', 'Phong', 'Sương'][i % 8], role: 'Chủ đò', look: i % 2 ? 'hero_f' : 'npc_villager', gua: 'kan', wx: '水', lines: ['Khách đi thuyền không? Đò, thuyền hoa, thuyền buồm có cả!', 'Ngược dòng giữa lạch thì chèo mỏi tay đấy, men theo bờ cho nhẹ.', 'Thuyền buồm cột cao, không qua được thủy môn đâu khách ạ.'], x: d.x + 1.5, z: d.z + 1.5, path: null }))] }), { update: () => [], ui: () => {}, add: () => {}, remove: () => {} }); // + dân phố + chủ đò các bến
  // phòng lưới (rooms.js): cửa hàng / nhà riêng / điện — dựng lười khi bước vào, chủ tiệm thêm vào citizens
  const roomsB = createRoomBuilder({ scene, citizens });
  // 16 biệt phủ đi bộ thật ở vành phủ Ngoại Thành (mansion3d.js): va chạm ngay, hình chi tiết dựng lười
  const phuG = new THREE.Group(); phuG.name = 'mansions'; scene.add(phuG);
  registerPrison(); const prison = createPrison(scene); // Thiên Lao + Khoáng Sơn (luật pháp — law.js)
  RZ.initRaze(scene); // công trình ngoài thành phá được (raze.js)
  registerLifePlaces(); createLifePlaces(scene); // quầy cơm, liêu xá, giếng quanh Sơn Môn (sinh tồn — life.js)
  const yoke = makeYoke(); yoke.visible = false; scene.add(yoke); // đòn gánh nước trên vai khi đang gánh
  // gợn nước: vòng tròn loang quanh người bơi / lội / mũi thuyền, tóe nước khi rơi xuống (pool 24 vòng, 1 vật liệu mỗi vòng)
  const ripples = [];
  { const geo = new THREE.RingGeometry(0.42, 0.55, 28); geo.rotateX(-Math.PI / 2);
    for (let i = 0; i < 24; i++) { const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: '#e8f1ef', transparent: true, opacity: 0, depthWrite: false })); m.visible = false; m.renderOrder = 3; scene.add(m); ripples.push({ m, age: 9, life: 1.6, s: 1 }); } }
  let rippleNext = 0, rippleT = 0, splashSeen = 0, wakeT = 0, myBoat = null;
  const fleet = safeInit('fleet', () => createFleet(scene)); // thuyền NPC trên sông, hồ
  const spawnRipple = (x, y, z, s = 1, life = 1.6) => { const r = ripples[rippleNext]; rippleNext = (rippleNext + 1) % ripples.length; r.age = 0; r.life = life; r.s = s; r.m.position.set(x, y + 0.03, z); r.m.visible = true; };
  const tickRipples = (dt) => { for (const r of ripples) { if (!r.m.visible) continue; r.age += dt; const k = r.age / r.life; if (k >= 1) { r.m.visible = false; continue; } r.m.scale.setScalar(r.s * (0.6 + k * 4.2)); r.m.material.opacity = 0.55 * (1 - k) * Math.min(1, k * 6); } };
  registerJobPlaces(); const jobPlaces = createJobPlaces(scene); // mỏ dân sự Khoáng Sơn (việc làm P2 — guild-core.js)
  const parcel = makeParcel(); parcel.visible = false; scene.add(parcel); // kiện hàng sau lưng phu dịch trạm
  const river = safeInit('river', () => span('init:river', () => createRiver(scene))); // thủy đạo Bát Môn: hào Nội Thành + kênh Khảm / Tốn, thuyền hoa
  const mansionsB = safeInit('mansions', () => span('init:mansions', () => createMansions(phuG, { provider: (key) => homeInfoOf(key), citizens })));
  const targetRing = new THREE.Mesh(new THREE.RingGeometry(0.28, 0.4, 32), new THREE.MeshBasicMaterial({ color: '#ffd27a', transparent: true, opacity: 0.8, depthWrite: false }));
  targetRing.rotation.x = -Math.PI / 2; targetRing.visible = false; scene.add(targetRing);

  // --- camera thứ ba
  const cam = { yaw: 0, pitch: 0.4, dist: 11, target: new THREE.Vector3(3.5, 1.2, 3.5), yawGoal: 0 };
  const proj = new THREE.Vector3();

  // điều khiển con trỏ: kéo = xoay, chạm/click ngắn = đi tới
  const ptrs = new Map(); let down = null; let pinch = 0;
  // cần điều khiển động (P16): chạm ở góc dưới (trái — hoặc phải khi bật tay trái) thì cần hiện dưới ngón tay;
  // chạm nhanh không kéo (< 150 ms, < 10 px) vẫn là chạm để đi
  let stickHook = null; const stickPtrs = new Map();
  canvas.addEventListener('pointerdown', (e) => {
    if (stickHook && e.pointerType === 'touch' && !ptrs.size && stickHook.zone(e)) { try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* bỏ */ } stickPtrs.set(e.pointerId, { x: e.clientX, y: e.clientY, t: performance.now(), moved: false }); stickHook.start(e); e.stopImmediatePropagation(); }
  }, true);
  canvas.addEventListener('pointermove', (e) => {
    const sp = stickPtrs.get(e.pointerId); if (!sp) return;
    if (!sp.moved && Math.hypot(e.clientX - sp.x, e.clientY - sp.y) > 10) sp.moved = true;
    stickHook.move(e); e.stopImmediatePropagation();
  }, true);
  const stickUp = (e) => {
    const sp = stickPtrs.get(e.pointerId); if (!sp) return;
    stickPtrs.delete(e.pointerId); stickHook.end(e); e.stopImmediatePropagation();
    if (e.type === 'pointerup' && !sp.moved && performance.now() - sp.t < 150) { const hit = pick(e.clientX, e.clientY); if (hit && onTap) onTap(hit); }
  };
  canvas.addEventListener('pointerup', stickUp, true); canvas.addEventListener('pointercancel', stickUp, true);
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
      if (pinch) cam.dist = Math.min(48, Math.max(2.4, cam.dist * (pinch / d)));
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
  canvas.addEventListener('wheel', (e) => { e.preventDefault(); cam.dist = Math.min(48, Math.max(2.4, cam.dist * (1 + e.deltaY * 0.0012))); }, { passive: false });

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
  // [F6 audit] seed ngày bark dựng MỘT LẦN mỗi ngày (so ba số ngày trước khi
  // lắp chuỗi + padStart) — không cấp phát chuỗi mỗi khung hình
  let barkDay = { y: -1, m: -1, d: -1 }, barkDayKey = '';
  let fpsAcc = 0, fpsN = 0, fpsT = 0, lowQuality = false, degrade = 0, firstT = null, lastReal = 0;
  const tmpV = new THREE.Vector3();
  const tmpV2 = new THREE.Vector3();
  const headV = new THREE.Vector3();

  function resize() {
    const w = canvas.clientWidth || 640, h = canvas.clientHeight || 448;
    renderer.setPixelRatio(softGl ? 0.5 : lowQuality ? 1 : Math.min(window.devicePixelRatio || 1, quality === 'high' ? 1.5 : 1.25)); // 2× = gấp 1,8 lần điểm ảnh, gần như không thấy khác
    renderer.setSize(w, h, false);
    composer?.setPixelRatio(renderer.getPixelRatio()); // bloom theo đúng tỉ lệ pixel của renderer
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
    cloudMat.color.copy(L.mid).lerp(WHITE, 0.35 * (1 - L.night));
    // môi trường PMREM (bầu trời) đã chiếu sáng vật liệu PBR → đèn bán cầu chỉ còn phần bổ sung
    hemi.intensity = L.hemi * (0.35 + 0.3 * L.night); hemi.color.copy(L.top).lerp(WHITE, 0.5);
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

  let shadowTick = 0;
  function frame(S, dt) {
    if (degrade >= 2 && ++shadowTick % 6 === 0) renderer.shadowMap.needsUpdate = true;
    const tF = performance.now(); frame0(S, dt); record('frame:js', performance.now() - tF - lastRenderMs);
  }
  let lastRenderMs = 0;
  function frame0(S, dt) {
    const t = S.time / 1000;
    const now = S.now;
    // seed ngày cho bark (đúng khuôn todayStr — state.js) để cùng ngày ra cùng bark;
    // [F6] chỉ dựng lại khi số năm/tháng/ngày đổi (qua 0h) — giữa ngày dùng bản cache
    if (now.getFullYear() !== barkDay.y || now.getMonth() !== barkDay.m || now.getDate() !== barkDay.d) {
      barkDay = { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
      barkDayKey = `${barkDay.y}-${String(barkDay.m + 1).padStart(2, '0')}-${String(barkDay.d).padStart(2, '0')}`;
    }
    const dayKey = barkDayKey;
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
    // ngự kiếm: độ cao mượt dần · đi bộ / nhảy / leo / bơi: cao độ thật từ motion.js (tức thời)
    avState.alt = p.flying ? (avState.alt || 0) + ((p.alt || 0) - (avState.alt || 0)) * Math.min(1, dt * 3) : (p.alt || 0);
    // trên mặt đất / dưới nước: cao độ thật p.y3 của motion.js (groundY kẹp đáy nước ở −7,2 → người bơi trên sông sâu
    // bị vẽ cao vài mét); ngự kiếm / trong phòng nội thất: mặt đất + độ cao như cũ
    const realY = !p.flying && p.y3 != null && w.x <= T.ROOM_X0 - 40;
    // bơi: người nằm sấp trên mặt nước khi bơi, đứng thẳng đạp nước khi nổi yên
    avState.swimK = (avState.swimK || 0) + ((p.swim ? (avState.walk > 0.25 ? 1 : 0.25) : 0) - (avState.swimK || 0)) * Math.min(1, dt * 4);
    // trên thuyền: thuyền nổi theo mặt sóng, người đứng / ngồi trên sàn thuyền
    if (p.boat) { const id = p.boat.b?.id || 'do'; if (!myBoat || myBoat.userData.type !== id) { if (myBoat) scene.remove(myBoat); myBoat = makeBoat(id); scene.add(myBoat); } myBoat.visible = true; avState.heading = p.boat.h; }
    else if (myBoat) myBoat.visible = false;
    const boatY = p.boat ? floatBoat(myBoat, w.x, w.z, p.boat.h) + (myBoat.userData.type === 'buom' ? 1.1 : myBoat.userData.type === 'hoa' ? 0.5 : 0.3) : null;
    let gy = boatY ?? ((realY ? p.y3 : world.groundY(w.x, w.z) + avState.alt) + avState.swimK * 0.72);
    // đang cưỡi: dựng phương tiện dưới chân, người ngồi trên yên, nhấp nhô theo nước kiệu
    const rideId = !p.flying && !p.boat ? p.ride : null;
    if (rideId !== myMountId && !myMountBusy) {
      if (myMount) { scene.remove(myMount); myMount = null; }
      myMountId = rideId;
      if (rideId) { myMountBusy = true; mountTemplate(rideId).then((m) => { myMountBusy = false; if (m && myMountId === rideId) { myMount = m; scene.add(m); } }); }
    }
    if (myMount && rideId) {
      const bob = avState.walk > 0.3 && !reduced ? Math.abs(Math.sin(t * 11)) * 0.06 : 0;
      myMount.position.set(w.x, gy + bob * 0.4, w.z); myMount.rotation.y = avState.heading; myMount.visible = true;
      gy += (MOUNT[rideId].saddle || 1) + bob;
    }
    av.position.set(w.x, gy, w.z);
    const cos = S.cos || {};
    ensureHero(p.look || 'hero_m', p.robe, p.accent, cos.robe);
    if (hero) {
      av.visible = false;
      hero.obj.position.set(w.x, gy, w.z);
      hero.obj.rotation.order = 'YXZ'; hero.obj.rotation.y = avState.heading; hero.obj.rotation.x = avState.swimK * 1.25;
      // ngồi bồ đoàn: nền idle (thân trên thở) + tư thế xếp bằng dựng bằng xương (characters.js › seat)
      const flyPose = (p.flying || p.fs === 5) && p.fs ? poseOf(cos.mount || 'kiem', p.fs) : null; // tư thế bay độc bản (P15)
      hero.setBase(flyPose ? (hero.has(flyPose.base) ? flyPose.base : 'idle') : myMount && rideId ? (hero.has('sit') ? 'sit' : 'idle') : p.flying || (p.air && !p.climb) ? 'idle' : p.climb ? 'run' : p.swim ? (avState.walk > 0.2 ? 'walk' : 'idle') : !p.sitting && avState.walk > 0.4 ? 'run' : 'idle');
      if (S.selfEmote && S.selfEmote !== lastEmote) { lastEmote = S.selfEmote; hero.play(S.selfEmote.e === 'wave' ? 'wave' : 'bow'); }
      hero.update(dt);
      if (flyPose) hero.pose(flyPose, t);
      else if (p.sitting || (p.boat && myBoat?.userData.type === 'do')) hero.seat('tea', t); else hero.unseat(); // ngồi đò
      // cầm đồ Tàng Y Các khi đứng yên: đưa tay lên trước ngực
      if (!p.sitting && cos.hand && avState.walk < 0.3 && !p.flying) hero.hold(t);
    }
    // chén trà bám tay phải; hơi nóng bốc từ miệng chén
    const hand = p.sitting && hero ? hero.hand(true) : null;
    teaCup.visible = !!hand;
    if (hand) {
      hand.getWorldPosition(handV);
      fwdV.set(Math.sin(avState.heading), 0, Math.cos(avState.heading));
      teaCup.position.copy(handV).addScaledVector(fwdV, 0.05); teaCup.position.y -= 0.03;
      if (S.teaColor) teaCup.children[1].material.color.set(S.teaColor);
      for (const st of steam) {
        st.life += dt;
        if (st.life > 2.8) { st.life = 0; st.ox = (Math.random() - 0.5) * 0.03; st.oz = (Math.random() - 0.5) * 0.03; }
        const k = st.life / 2.8;
        st.s.visible = !reduced;
        st.s.position.set(teaCup.position.x + (st.ox || 0) + Math.sin(t * 1.3 + st.life * 3) * 0.02 * k, teaCup.position.y + 0.07 + k * 0.45, teaCup.position.z + (st.oz || 0));
        st.s.scale.setScalar(0.04 + k * 0.16);
        st.s.material.opacity = 0.35 * Math.sin(Math.PI * k);
      }
    } else for (const st of steam) st.s.visible = false;
    // gia trì nguyên tố theo hành Dụng thần (progress.js) — dựng lại khi đổi hành
    if (S.fate) { fateG.visible = true; fateG.position.set(S.fate.x, world.groundY(S.fate.x, S.fate.z), S.fate.z); fateG.userData.col.material.opacity = 0.16 + Math.sin(t * 2.2) * 0.06; fateG.userData.ring.rotation.z = t * 0.6; fateG.userData.ring.scale.setScalar(1 + Math.sin(t * 2.2) * 0.08); }
    else fateG.visible = false;
    for (const m of jobSigns) { const near = Math.hypot(m.position.x - w.x, m.position.z - w.z) < 260; m.visible = near; if (near) m.position.y = Math.max(world.groundY(m.position.x, m.position.z), -5.6); }
    const gKey = `${p.robe}|${cos.aura || ''}|${cos.trail || ''}|${cos.mount || ''}`;
    if (!giatri || giatriWx !== gKey) {
      if (giatri) { scene.remove(giatri.obj); scene.remove(giatri.trail); giatri.dispose(); } // hủy material/texture bản cũ
      giatri = createGiatri(p.robe, { aura: cos.aura, trail: cos.trail, mount: cos.mount }); giatriWx = gKey; scene.add(giatri.obj); scene.add(giatri.trail);
    }
    giatri.set(S.giatri || []);
    giatri.obj.position.set(w.x, gy, w.z); giatri.obj.rotation.y = avState.heading;
    giatriPos.set(w.x, gy, w.z);
    giatri.update(dt, t, { moving: avState.walk > 0.4, flying: !!p.flying, world: giatriPos });
    // phụ kiện bám xương (mũ, lưng, tay) — cầm chén trà thì cất đồ cầm tay
    outfit.set({ head: cos.head, back: cos.back, hand: p.sitting ? null : cos.hand });
    outfit.update(hero, avState.heading, t, { night: L.night, visible: !!hero && av.visible === false });
    // gợn nước quanh người chơi trong nước; tóe nước + tiếng khi rơi xuống
    tickRipples(dt);
    // đội thuyền NPC (tránh người chơi + người khác) · vệt sóng sau thuyền mình
    fleet.update(dt, w.x, w.z, [...remotes.values()].map((q) => q.grp.position));
    if (p.boat && myBoat && (wakeT -= dt) < 0) { const b = p.boat.b; const v = b ? Math.hypot(b.vx, b.vz) : 0; wakeT = v > 0.5 ? 0.35 : 1.5; if (v > 0.3) { const L2 = (b.type.len / 2) * 0.9; spawnRipple(w.x - Math.sin(p.boat.h) * L2, myBoat.position.y - 0.1, w.z - Math.cos(p.boat.h) * L2, b.type.beam * 0.5, 2.4); playPaddle(0.05); } }
    stepFx.tick(dt);
    if (p.waterWalk && p.waterY != null) stepFx.step(p.waterWalk.fx, w.x, p.waterY, w.z, avState.heading, dt, avState.walk > 0.3);
    if (p.waterY != null && !p.flying && !p.boat) {
      if ((p.splash || 0) > splashSeen) { splashSeen = p.splash; for (let k = 0; k < 3; k++) spawnRipple(w.x, p.waterY, w.z, 0.8 + k * 0.5, 1.4 + k * 0.4); playSplash(); }
      if ((rippleT -= dt) < 0) { rippleT = avState.walk > 0.3 ? 0.42 : 1.1; spawnRipple(w.x + Math.sin(avState.heading) * 0.4, p.waterY, w.z + Math.cos(avState.heading) * 0.4, p.swim ? 1 : 0.7); if (avState.walk > 0.3) playPaddle(); }
    } else splashSeen = p.splash || 0;
    yoke.visible = !!S.carry && !p.flying; if (yoke.visible) { yoke.position.set(w.x, gy + 1.5, w.z); yoke.rotation.y = avState.heading; }
    parcel.visible = !!S.parcel && !p.flying; if (parcel.visible) { parcel.position.set(w.x - Math.sin(avState.heading) * 0.32, gy + 1.25, w.z - Math.cos(avState.heading) * 0.32); parcel.rotation.y = avState.heading; }
    // bóng đổ + mặt trời bám theo người chơi
    sun.target.position.set(w.x, gy, w.z);
    sun.position.copy(sun.target.position).addScaledVector(lightDir, 160);
    span('f:world', () => world.update(w.x, w.z, dt, t));
    lightRoom = roomAt(w.x, w.z)?.id || null; // trong điện: chỉ thắp nến / đèn của điện đó
    updateLightPool(w.x, gy + 2, w.z, dt);
    if ((absorbT -= dt) < 0) { absorbT = 5; absorbLights(); } // đèn điểm của vùng mới nạp
    interiors.root.visible = w.x > T.ROOM_X0 - 40; // điện thờ ở dải phòng phía Đông: ngoài đó thì không vẽ (hàng trăm mesh)
    if (interiors.root.visible) interiors.ensure(); // dựng lười lần đầu tới dải phòng
    interiors.update(dt);
    roomsB.update(w.x, w.z, dt);
    span('f:mansions', () => mansionsB.update(w.x, w.z, dt));
    river.update(dt, t);
    prison.setVisible(w.x > T.ROOM_X0 - 40); prison.update(dt);
    jobPlaces.setVisible(w.x > T.ROOM_X0 - 40); jobPlaces.update(dt);
    RZ.tickRaze(dt, w.x, w.z);
    // nhãn + dấu vàng của trạm có toạ độ thế giới: bám mặt sàn thật (nền bậc, sàn điện) — cập nhật thưa
    anchorTick -= dt;
    if (anchorTick <= 0) {
      anchorTick = 2;
      for (const lb of labels) { const st = stationById(lb.id); if (st?.world) lb.pos.y = world.groundY(st.world.x, st.world.z) + 3.4; }
      for (const d of deskMarks) d.g.position.y = world.groundY(d.g.position.x, d.g.position.z);
    }
    span('f:landmarks', () => landmarks.update(w.x, w.z));
    av.rotation.y = avState.heading;
    MD.poseAvatar(av, { walk: avState.walk, phase: avState.phase, sitting: p.sitting, idle: t });

    // camera bám khách, giảm chấn
    cam.yaw += (cam.yawGoal - cam.yaw) * Math.min(1, dt * 8);
    // màn dọc: nhìn vượt lên trước khách → khách nằm 1/3 dưới, khung dành cho quán
    const portrait = camera.aspect < 0.8;
    const close = Math.min(1, Math.max(0, (6.5 - cam.dist) / 4)); // camera sát (≤ 6,5 m): nhìn ngang mặt nhân vật, không vượt lên trước
    const ahead = (p.sitting ? 0.6 : (portrait ? 3.4 : 1.0)) * (1 - close);
    tmpV.set(w.x - Math.sin(cam.yaw) * ahead, gy + (p.sitting ? 0.9 : 1.3) + close * 0.28, w.z - Math.cos(cam.yaw) * ahead);
    // dịch chuyển xa (truyền tống / hồi sinh): camera nhảy thẳng, không trượt qua nửa bản đồ
    if (cam.target.distanceTo(tmpV) > 40) cam.target.copy(tmpV); else cam.target.lerp(tmpV, Math.min(1, dt * 5));
    const cd = cam.dist * (p.sitting ? 0.75 : 1) * (portrait ? 0.9 : 1) * (p.boat ? ({ do: 1.25, hoa: 1.7, buom: 2.5 }[myBoat?.userData.type] || 1) : 1); // trên thuyền: lùi camera theo cỡ thuyền
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
    // trong gian biệt phủ: camera kẹp trong lòng gian (vỏ gian đã mờ — mansion3d.update), không cao quá mái hiên
    const inHall = !inRoom && mansionsB.hallAt(cam.target.x, cam.target.z);
    if (inHall) {
      const c = Math.cos(inHall.ry), s = Math.sin(inHall.ry), dx = camera.position.x - inHall.cx, dz = camera.position.z - inHall.cz;
      let lx = c * dx - s * dz, lz = s * dx + c * dz;
      lx = Math.max(-inHall.hw + 0.6, Math.min(inHall.hw - 0.6, lx)); lz = Math.max(-inHall.hd + 0.6, Math.min(inHall.hd - 0.6, lz));
      camera.position.x = inHall.cx + c * lx + s * lz; camera.position.z = inHall.cz - s * lx + c * lz;
      camera.position.y = Math.min(inHall.top + 1.5, camera.position.y);
    }
    if (inRoom) {
      const ox = inRoom.origin.x, oz = inRoom.origin.z, mx = inRoom.w / 2 - 0.9, mz = inRoom.d / 2 - 0.9;
      camera.position.x = Math.min(ox + mx, Math.max(ox - mx, camera.position.x));
      camera.position.z = Math.min(oz + mz, Math.max(oz - mz, camera.position.z));
      camera.position.y = Math.min(inRoom.h - 1, camera.position.y);
    }
    tmpV2.copy(cam.target); tmpV2.y += lookUp;
    camera.lookAt(tmpV2);
    setViewer(camera.position);
    if (debugCam) { camera.position.fromArray(debugCam.pos); camera.lookAt(...debugCam.look); }
    span('f:occl', () => world.occlusion(w.x, w.z, camera.position.x, camera.position.z));
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

    sect.update?.(t);
    if (tailor) { tailor.update(dt); const nearT = S.near?.id === 'tangy'; if (nearT && !tailor.greeted) { tailor.greeted = true; tailor.play('bow'); } if (!nearT) tailor.greeted = false; }
    // bark Bà T tư: chỉ khi khách đứng gần quầy (cùng cơ chế S.near của cúi chào/nhãn trạm)
    const barkMs = performance.now();
    tickBark(tangyBark, S.near?.id === 'tangy', barkMs, `${dayKey}:tangy`, 'tho_may');
    // bark Vân Cốc & Khổng (G3): hiện khi người chơi tới gần 8 m — pool persona
    // tương ứng (id trùng persona trong bark-pool.js), seed ngày + tên cùng múi
    // `${dayKey}:…` với hệ bark sẵn có; mixer vẫn chạy để tư thế đứng thở idle
    for (const hn of hermits) {
      if (hn.ch) { hn.ch.update(dt); if (hn.hold) hn.ch.hold(t); }
      tickBark(hn.bark, Math.hypot(w.x - hn.x, w.z - hn.z) < 8, barkMs, `${dayKey}:${hn.id}`, hn.id);
    }
    // tutorial Lão Tùng: người chơi mới (chưa từng nghe) tới gần Sơn Môn lần đầu → 3 câu
    // dẫn nhập tất định, mỗi câu 7 giây; hết trình tự đánh dấu localStorage để không nói lại
    if (lt.i >= 0 && lt.i < LT_TUT.length) {
      if (barkMs >= lt.until) {
        lt.i++; lt.until = barkMs + 7000;
        if (lt.i >= LT_TUT.length) { ltSeen = true; try { localStorage.setItem('huyenquan:gaccong', '1'); } catch (e) { /* kho bị khoá: lần tới sẽ nghe lại — chấp nhận */ } }
      }
    } else if (!ltSeen && Math.hypot(w.x - GATE_SM.x, w.z - GATE_SM.z) < 16) { lt.i = 0; lt.until = barkMs + 7000; }
    // [F6 audit] tutorial 3 câu × 7 giây ≈ 21 giây: chỉ tạo object bark MỚI khi
    // câu ĐỔI — `until` gắn cứng cùng lúc đổi câu nên giữa hai lần đổi không có
    // gì để cập nhật; hết trình tự thì trả về null đúng như trước.
    const ltText = lt.i >= 0 && lt.i < LT_TUT.length ? LT_TUT[lt.i] : null;
    if (ltText == null) lt.bark = null;
    else if (!lt.bark || lt.bark.text !== ltText) lt.bark = { text: ltText, until: lt.until };
    if (masterChar) { masterChar.update(dt); masterChar.seat('write', t); if (S.near?.id === 'thay' && !masterChar.greeted) { masterChar.greeted = true; masterChar.play('bow'); } if (S.near?.id !== 'thay') masterChar.greeted = false; }
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

    // nhang: hương chung của phòng (S.incense) + nén của mình khi chưa có máy chủ
    const I = incG.userData.incense;
    const inc = incenseState(S.state, now.getTime());
    I.group.visible = false;
    const incList = (S.incense || []).slice();
    if (inc.burning && !incList.some((e) => e.mine)) incList.push({ k: 0, at: S.state.incense.litAt, mine: true });
    const nearInc = Math.hypot(w.x - incG.position.x, w.z - incG.position.z) < 150;
    const nSticks = incense.update(incList, now.getTime(), t, nearInc);
    I.light.intensity = 0;
    if (nSticks) {
      smokeT -= dt;
      if (smokeT <= 0 && !reduced && !lowQuality) {
        smokeT = 0.09 / Math.min(4, 1 + Math.sqrt(nSticks / 3) * 0.6);
        const sm = smoke.find((x) => !x.s.visible), tip = incense.randomTip();
        if (sm && tip) { sm.s.position.copy(tip); sm.life = 0; sm.vx = (Math.random() - 0.5) * 0.15; sm.vz = (Math.random() - 0.5) * 0.15; sm.s.visible = true; }
      }
    }
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
    if (!reduced) updateLotus(w.x, w.z, t, dt); // hồ sen trong tầm: lá dập dềnh, hoa đung đưa, cá bơi
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

    // đèn trời, đá trôi, mây (dùng scratch module-level, không cấp phát mới mỗi khung)
    for (let i = 0; i < SLN; i++) {
      const d = slData[i];
      if (!reduced) { d.y += d.v * dt; d.a += d.w * dt; if (d.y > 34) d.y = -14; }
      VS1.set(Math.cos(d.a) * d.r, d.y, Math.sin(d.a) * d.r); VS2.setScalar(d.s);
      MT4.compose(VS1, QT4, VS2); skyLanterns.setMatrixAt(i, MT4);
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
        if (cn.ch) { cn.g.remove(cn.ch.obj); cn.ch.dispose(); cn.ch = null; }
        createCharacter(look, {}).then((ch) => { if (!ch) return; cn.ch = ch; cn.g.add(ch.obj); cn.av.visible = false; });
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
      // bark khách ❓ (chưa giải — nhóm khách AI-light mục 14): hiện khi người chơi lại gần
      // (bán kính 6 m, cùng cơ chế wave/bow phía trên). [F3] Pool theo npc.topic của chính
      // khách (xem khachPoolOf phía trên) — không còn khe chẵn/lẻ; topic không khớp pool
      // nào → khách im lặng thay vì nói điều trái án mình. Seed = chính hạt giống
      // ngày·khe·pid của main.js (info.npc.key) → cùng khách hôm nay ra cùng câu trên máy
      // chủ nhân của nó; bark KHÔNG rời máy này (mục 13 Quyết 3).
      const khachPool = khachPoolOf(info.npc.topic);
      tickBark(cn.bark, !!khachPool && !info.done && Math.hypot(w.x - cn.g.position.x, w.z - cn.g.position.z) < 6, barkMs, info.npc.key, khachPool);
      cn.marker.visible = !info.done; cn.ring.visible = !info.done;
      if (!info.done && !reduced) { cn.marker.rotation.y = t * 1.6; cn.marker.position.y = 2.75 + Math.sin(t * 2 + cn.g.position.x) * 0.08; }
      const lb = labels.find((l) => l.id === cn.id);
      if (lb) { const txt = `${info.npc.call} ${info.done ? '✓' : '❓'}`; if (lb.el.textContent !== txt) lb.el.textContent = txt; }
    }
    if (!reduced) for (const d of deskMarks) { d.marker.rotation.y = t * 1.6; d.marker.position.y = 2.9 + Math.sin(t * 2) * 0.1; }

    // người chơi khác
    // NPC đứng yên → vòng chặn cho người chơi (không đi xuyên / đứng chồng lên NPC)
    const actors = [];
    for (const hn of hermits) actors.push({ x: hn.x, z: hn.z, r: 0.35 });
    if (tailor) actors.push({ x: tailor.obj.position.x, z: tailor.obj.position.z, r: 0.35 });
    for (const cn of caseNpcs) if (cn.g.visible) actors.push({ x: cn.g.position.x, z: cn.g.position.z, r: 0.35 });
    for (const a of citizens.update(dt, t, w, barkMs, dayKey)) actors.push(a);
    setActors(actors);
    // người chơi khác: tách nhẹ khi đứng sát nhau / sát mình / sát NPC (chỉ phần hiển thị — vị trí mạng giữ nguyên)
    // → hết cảnh nhiều nhân vật đứng chồng một chỗ ở cùng một trạm
    const occupied = [{ x: w.x, z: w.z }, ...actors];
    const seen = new Set();
    for (const o of S.others || []) {
      seen.add(o.id);
      const r = remoteEntry(o);
      const ow = MD.toWorld(o.x, o.y);
      const sitting = !!o.s;
      // xa (> 90 m, trễ tới 80 m): thay nhân vật có xương bằng hình rút gọn (một mesh tĩnh) — phòng 60 người không phải
      // chạy da / xương cho người chỉ cao vài điểm ảnh
      const dcam = camera.position.distanceTo(r.grp.position);
      if (dcam > 90) r.lite = true; else if (dcam < 80) r.lite = false;
      const useCh = r.ch && !r.lite;
      r.walk.visible = !sitting && !useCh; r.sit.visible = sitting && !useCh;
      if (r.ch) r.ch.obj.visible = useCh;
      if (useCh) {
        const close = dcam < 60;
        r.ch.setBase(o.w === 4 && r.ch.has('sit') ? 'sit' : !sitting && o.moving ? 'run' : 'idle');
        if (o.bubble && o.bubble !== r.lastBub) { r.lastBub = o.bubble; if (o.bubble.text === '🙇' || o.bubble.text === '🙏') r.ch.play('bow'); else if (o.bubble.text === '👋') r.ch.play('wave'); }
        if (close) { r.ch.update(dt); if (sitting) r.ch.seat('calm', t); else r.ch.unseat(); }
        const oc = decodeCos(o.cos || ''); // decode MỘT lần cho cả đồ cầm tay + trang bị + hào quang
        if (close && oc.hand && !sitting && !o.moving) r.ch.hold(t);
        // trang bị người khác (Tàng Y Các): phụ kiện + hào quang skin + ngự vật khi bay — chỉ khi ở gần
        r.outfit.set({ head: oc.head, back: oc.back, hand: sitting ? null : oc.hand });
        r.outfit.update(r.ch, r.heading, t, { night: L.night, visible: close });
        // hào quang / vệt / ngự vật người khác: dựng MỘT LẦN mỗi người (chỉ dựng lại khi đổi skin),
        // bật/tắt theo khoảng cách với hysteresis 60/75 m — hết churn dựng/hủy quanh ngưỡng 60 m
        const hasFx = !!(oc.aura || oc.trail || (o.a || 0) > 0.5);
        const fk = `${o.robe}|${oc.aura || ''}|${oc.trail || ''}|${oc.mount || ''}`;
        if (hasFx && fk !== r.fxKey) {
          if (r.fx) { scene.remove(r.fx.obj); scene.remove(r.fx.trail); r.fx.dispose(); r.fx = null; }
          r.fx = createGiatri(o.robe, { aura: oc.aura, trail: oc.trail, mount: oc.mount });
          r.fx.set([]); r.fx.obj.visible = r.fx.trail.visible = false;
          scene.add(r.fx.obj); scene.add(r.fx.trail);
          r.fxKey = fk;
        }
        if (r.fx) {
          const dc = camera.position.distanceTo(r.grp.position);
          if (dc < 60) r.fxNear = true; else if (dc > 75) r.fxNear = false; // vùng 60–75 m giữ nguyên trạng thái
          const show = hasFx && r.fxNear;
          r.fx.obj.visible = r.fx.trail.visible = show;
          if (show) { r.fx.obj.position.copy(r.grp.position); r.fx.obj.rotation.y = r.heading; r.fx.update(dt, t, { moving: !!o.moving, flying: (o.a || 0) > 0.5, world: r.grp.position }); }
        }
        const fc = `hq-label hq-name hq-other${oc.frame ? ` hq-frame-${oc.frame}` : ''}`;
        if (r.label.className !== fc) r.label.className = fc;
      }
      if (!r.sep) r.sep = { x: 0, z: 0 };
      let px = 0, pz = 0;
      if (!sitting && !(o.a > 0.5)) {
        for (const q of occupied) {
          const ddx = ow.x + r.sep.x - q.x, ddz = ow.z + r.sep.z - q.z, d = Math.hypot(ddx, ddz), need = 0.85;
          if (d < need) { const k = (need - d) / need, a = d > 1e-3 ? 1 / d : 0; const ang = String(o.id).length * 2.39 + String(o.id).charCodeAt(0); px += (a ? ddx * a : Math.cos(ang)) * k; pz += (a ? ddz * a : Math.sin(ang)) * k; }
        }
      }
      const gx = r.sep.x + px * 0.6, gz = r.sep.z + pz * 0.6, lim = Math.hypot(gx, gz);
      const cap = lim > 1.2 ? 1.2 / lim : 1;
      const tx = gx * cap, tz = gz * cap;
      if (!blockedByBuilding(ow.x + tx, ow.z + tz)) { r.sep.x += (tx - r.sep.x) * Math.min(1, dt * 6); r.sep.z += (tz - r.sep.z) * Math.min(1, dt * 6); }
      if (o.moving && !px && !pz) { r.sep.x *= 1 - Math.min(1, dt * 2); r.sep.z *= 1 - Math.min(1, dt * 2); } // đang đi thì nhả dần về đúng vị trí
      const sx = ow.x + r.sep.x, sz = ow.z + r.sep.z;
      occupied.push({ x: sx, z: sz });
      // người khác đang bơi: nổi theo mặt sóng ở máy mình (cùng hàm water.js) — gói mv không mang cao độ âm
      // người khác trên thuyền: dựng thuyền đúng loại dưới chân, nổi theo sóng
      if (o.w === 4) { const rid = ['lua', 'ngua', 'xengua'][o.b || 0] || 'ngua'; if (r.mountId !== rid && !r.mountBusy) { if (r.mount) scene.remove(r.mount); r.mount = null; r.mountId = rid; r.mountBusy = true; mountTemplate(rid).then((m) => { r.mountBusy = false; if (m && r.mountId === rid && remotes.has(o.id)) { r.mount = m; scene.add(m); } }); } }
      else if (r.mount) { scene.remove(r.mount); r.mount = null; r.mountId = null; }
      if (o.w === 3) { const want = String(o.b || 0); if (!r.boat || r.boat.userData.idx !== want) { if (r.boat) scene.remove(r.boat); r.boat = makeBoatByIdx(o.b || 0); r.boat.userData.idx = want; scene.add(r.boat); } r.boat.visible = true; }
      else if (r.boat) r.boat.visible = false;
      const by = o.w === 3 && r.boat ? floatBoat(r.boat, sx, sz, o.h || 0) + (r.boat.userData.type === 'buom' ? 1.1 : r.boat.userData.type === 'hoa' ? 0.5 : 0.3) : null;
      const wy = o.w === 2 ? MO.waterLevelAt(sx, sz) : null;
      const wwY = o.w === 5 ? MO.waterLevelAt(sx, sz) : null; // người khác đạp nước: đứng trên mặt sóng (P14)
      r.swimK = (r.swimK || 0) + ((o.w === 2 ? (o.moving ? 1 : 0.25) : 0) - (r.swimK || 0)) * Math.min(1, dt * 4);
      r.grp.position.set(sx, by ?? (wwY != null ? wwY + 0.02 : wy != null ? wy - MO.FLOAT + r.swimK * 0.72 : world.groundY(sx, sz) + (o.a || 0)) + (sitting || o.w ? 0 : (o.moving && !reduced ? Math.abs(Math.sin(t * 9.5 + ow.x)) * 0.07 : 0)), sz);
      r.grp.rotation.order = 'YXZ'; r.grp.rotation.x = r.swimK * 1.25;
      const goalH = sitting ? Math.PI : (o.h || 0);
      const dh2 = ((goalH - r.heading + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
      r.heading += dh2 * Math.min(1, dt * 8);
      r.grp.rotation.y = r.heading;
      if (r.mount) { r.mount.position.set(sx, r.grp.position.y, sz); r.mount.rotation.y = r.heading; r.grp.position.y += MOUNT[r.mountId]?.saddle || 1; }
      r.data = o;
    }
    for (const id of [...remotes.keys()]) if (!seen.has(id)) dropRemote(id);

    // vòng đích
    if (S.target && !p.sitting) { const tw = MD.toWorld(S.target.x, S.target.y); targetRing.position.set(tw.x, world.groundY(tw.x, tw.z) + 0.03, tw.z); targetRing.visible = true; targetRing.scale.setScalar(1 + Math.sin(t * 6) * 0.1); }
    else targetRing.visible = false;

    {
      const p0 = renderer.info.programs.length, t0 = renderer.info.memory.textures, a = performance.now();
      if (composer) composer.render(); else renderer.render(scene, camera); // KHÔNG đổi giữa composer ↔ vẽ thẳng lúc chơi: đổi đường vẽ = biên dịch lại mọi shader
      const d = performance.now() - a, dp = renderer.info.programs.length - p0, dt2 = renderer.info.memory.textures - t0;
      lastRenderMs = d;
      record(dp ? `render:+${dp} shader ${renderer.info.programs.slice(-dp).map((q) => `${q.name}:${q.cacheKey.split(',').slice(-4, -2).join('/')}`).join(' ')}` : dt2 > 0 ? `render:+${dt2} tex` : 'render', d); // __perf.top(): khung chậm do biên dịch shader / đẩy texture
    }

    // nhãn HTML
    const rw = canvas.clientWidth, rh = canvas.clientHeight;
    // nhãn gian: chỉ trong tầm ~70 m, và không «xuyên tường» — đứng ngoài sân Sơn Môn thì không
    // thấy nhãn các gian bên trong (và ngược lại) trừ khi đã sát (≤ 28 m)
    const meIn = inCourt(w.x, w.z);
    for (const lb of labels) {
      proj.copy(lb.pos).project(camera);
      const dl = Math.hypot(lb.pos.x - w.x, lb.pos.z - w.z);
      const vis = proj.z < 1 && Math.abs(proj.x) < 1.15 && Math.abs(proj.y) < 1.15 && dl < 70 && (dl < 28 || inCourt(lb.pos.x, lb.pos.z) === meIn);
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
    if (nameTag.dataset.frame !== (cos.frame || '')) { nameTag.dataset.frame = cos.frame || ''; nameTag.className = `hq-label hq-name${cos.frame ? ` hq-frame-${cos.frame}` : ''}`; }
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
    showBubble(masterBub, S.masterBubble, DAIS.x, DAIS.y + 2.6, DAIS.z);
    // bark NPC cục bộ (không qua /ws — mục 13): Bà T tư tại quầy, Lão Tùng tại cổng, khách ❓ từng khe
    showBubble(tailorBub, tangyBark.bark, TANGY.x + 1.2, 2.8, TANGY.z - 1.2);
    showBubble(gateBub, lt.bark, GATE_SM.x, 5.6, GATE_SM.z - 0.8);
    for (const cn of caseNpcs) showBubble(cn.bub, cn.g.visible ? cn.bark.bark : null, cn.g.position.x, 3.3, cn.g.position.z); // trên nhãn ❓ (y≈2.9)
    for (const hn of hermits) showBubble(hn.bub, hn.bark.bark, hn.x, hn.gy + 2.9, hn.z); // dưới nhãn tên (y≈3,3) — đúng khuôn bark NPC cục bộ
    citizens.ui(w, place, showBubble);
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
    // bỏ qua giai đoạn nạp (khung giật do dựng kết cấu / nạp mô hình) và các khung giật đơn lẻ
    // người chơi đã tự chọn mức chất lượng (localStorage «huyenquan:quality») → không tự hạ
    if (firstT == null) firstT = t;
    /* bỏ khung giật đơn lẻ (> 1 s) — KHÔNG bỏ khung chậm thường xuyên: máy rất yếu (2–4 fps) trước đây không bao giờ được hạ */
    /* đo bằng đồng hồ THẬT: dt từ vòng lặp đã bị kẹp ≤ 0,05 s (vật lý) nên máy 3 fps vẫn «đo» ra 20 fps, không bao giờ được hạ */
    const realNow = performance.now(), rdt = lastReal ? (realNow - lastReal) / 1000 : 0; lastReal = realNow;
    if (t - firstT > 8 && rdt > 0 && rdt < 1 && !qualityForced) { fpsAcc += rdt; fpsN++; fpsT += rdt; }
    if (fpsT > 3) {
      const fps = fpsN / fpsAcc;
      // hạ theo bậc — bóng đổ giữ tới cùng (tắt bóng làm cả cảnh phẳng, «giả» hẳn):
      // bậc 1: độ phân giải 1×, tắt bloom/hạt bụi, cỏ còn ½, bóng 1024 · bậc 2: tắt bóng
      if (fps < 35 && degrade === 0) {
        degrade = 1; lowQuality = true; renderer.setPixelRatio(softGl ? 0.5 : 1); composer?.setPixelRatio(renderer.getPixelRatio()); if (bloomPass) bloomPass.enabled = false;
        world.grass?.setDensity(0.5);
        if (sun.shadow.mapSize.x > 1024) { sun.shadow.mapSize.set(1024, 1024); sun.shadow.map?.dispose(); sun.shadow.map = null; }
      } else if (fps < 24 && degrade === 1) {
        // KHÔNG tắt shadowMap (tắt = biên dịch lại mọi shader, đứng hình 1–2 s): giữ bóng nhưng chỉ vẽ lại bản đồ bóng thưa
        degrade = 2; renderer.shadowMap.autoUpdate = false;
      } else if (fps < 12 && degrade === 2 && quality !== 'low') {
        // vẫn quá chậm: tải lại ở mức THẤP (ít nhà chi tiết, tầm nhìn ngắn) — một lần, người chơi được báo khi vào lại
        degrade = 3; try { localStorage.setItem('huyenquan:quality', 'low'); localStorage.setItem('huyenquan:autoLow', '1'); setTimeout(() => location.reload(), 300); } catch (err) { /* ignore */ }
      }
      fpsAcc = 0; fpsN = 0; fpsT = 0;
    }
  }

  // --- hâm nóng: shader biên dịch song song (KHR_parallel_shader_compile), texture đẩy lên GPU
  // từng cái một mỗi khung — mô hình nạp giữa lúc chơi không làm khựng khung hình
  const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));
  const TEX_KEYS = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap', 'alphaMap'];
  const uploaded = new WeakSet();
  async function uploadTextures(root, budgetMs = 6) {
    const list = [];
    root.traverse((o) => { if (!o.material) return; for (const m of [].concat(o.material)) for (const k of TEX_KEYS) { const t = m[k]; if (t && !uploaded.has(t)) { uploaded.add(t); list.push(t); } } });
    let t0 = performance.now();
    for (const t of list) {
      renderer.initTexture(t);
      if (performance.now() - t0 > budgetMs) { await nextFrame(); t0 = performance.now(); }
    }
  }
  setWarmup(async (obj) => {
    await renderer.compileAsync(obj, camera, scene);
    await uploadTextures(obj);
  });

  /**
   * Màn nạp: chờ mọi thứ nặng xong TRƯỚC khi mở màn — sinh địa hình/kết cấu (Worker), dựng sơn môn
   * và vùng gần, cắt lát va chạm, biên dịch toàn bộ shader, đẩy texture lên GPU, vẽ nháp vài khung.
   * Nhờ vậy vào game là mượt ngay, không «khựng dần» trong nửa phút đầu.
   */
  // Đèn điểm gắn sẵn trong mô hình (đèn lồng Sơn Môn, nến bàn xăm, đốm hương…): mỗi đèn điểm có mặt trong
  // cảnh là thêm chi phí cho MỌI điểm ảnh được chiếu sáng (Intel UHD: 14 đèn ≈ −20% khung hình). Chuyển hết
  // sang danh sách LIGHTS — nhóm đèn (lightPool) gán cho vài nguồn gần người chơi nhất.
  const absorbLights = () => {
    const pool = new Set(lightPool), stray = [];
    scene.traverse((o) => { if (o.isPointLight && !pool.has(o)) stray.push(o); });
    const P = new THREE.Vector3();
    for (const l of stray) { l.getWorldPosition(P); addLight(P.x, P.y, P.z, { color: '#' + l.color.getHexString(), power: Math.max(0.4, Math.min(1.2, l.intensity || 0.6)) }); l.parent.remove(l); }
  };
  async function ready(px, pz, onStep = () => {}) {
    absorbLights();
    const cap = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(r, ms))]);
    await world.prepare(px, pz, onStep);
    onStep('Đang dựng Sơn Môn…');
    await cap(Promise.all([sect.loaded, stoneReady(), landmarks.prepare(px, pz, 350)]), 25000);
    await cap(settleLods(px, pz), 6000); // công trình gần lên bản chi tiết trước khi mở màn (không nhảy bậc trước mắt); vùng xa nạp nền sau khi vào game
    onStep('Đang đặt va chạm công trình…');
    await cap(footprintIdle(), 8000);
    onStep('Đang chuẩn bị ánh sáng…');
    // trời / môi trường PMREM / sương / mặt trời phải có TRƯỚC khi biên dịch — thiếu environment lúc
    // biên dịch thì khung đầu tiên sau màn nạp sẽ biên dịch lại toàn bộ vật liệu (khựng ~250 ms)
    applyTime(new Date());
    await renderer.compileAsync(scene, camera);
    // vật liệu dùng chung chỉ được gán về sau (hoa đào nở theo mùa, đèn, mái…) — biên dịch luôn bây giờ
    const spare = new THREE.Group(), boxG = new THREE.BoxGeometry();
    for (const m of Object.values(mats)) if (m?.isMaterial) { const o = new THREE.Mesh(boxG, m); o.castShadow = o.receiveShadow = true; spare.add(o); }
    await renderer.compileAsync(spare, camera, scene);
    boxG.dispose();
    await uploadTextures(scene, 10);
    // vẽ nháp: bản đồ bóng, PMREM, bộ đệm hậu kỳ khởi tạo xong khi màn còn che
    // khung bóng phủ cả thế giới trong lúc vẽ nháp → shader bóng (depth) của MỌI vật thể đổ bóng
    // (cây instanced, nhân vật skinned, mô hình có alpha…) biên dịch luôn, không đợi tới lúc chúng
    // lọt vào vùng bóng quanh người chơi giữa lúc chơi
    const sc = sun.shadow.camera, keep = { l: sc.left, r: sc.right, t: sc.top, b: sc.bottom, f: sc.far };
    Object.assign(sc, { left: -T.HALF, right: T.HALF, top: T.HALF, bottom: -T.HALF, far: T.WORLD * 1.5 }); sc.updateProjectionMatrix();
    const sp = sun.position.clone(); sun.position.copy(sun.target.position).addScaledVector(lightDir.lengthSq() ? lightDir : new THREE.Vector3(0.4, 0.8, 0.3), 1400);
    // vật thể chưa từng vào vùng bóng (cây instanced đang 0 bản sao, chunk núi chưa đổ bóng…) vẫn
    // phải có mặt trong lượt nháp này thì shader bóng của chúng mới được biên dịch sẵn
    const restore = [];
    scene.traverse((o) => {
      if (o.isInstancedMesh && o.count === 0) { restore.push([o, 'count', 0]); o.count = 1; }
      if (o.isMesh && o.userData.terrain && !o.castShadow) { restore.push([o, 'castShadow', false]); o.castShadow = true; }
    });
    if (composer) composer.render(); else renderer.render(scene, camera);
    restore.forEach(([o, k, v]) => { o[k] = v; });
    await nextFrame();
    Object.assign(sc, { left: keep.l, right: keep.r, top: keep.t, bottom: keep.b, far: keep.f }); sc.updateProjectionMatrix(); sun.position.copy(sp);
    for (let i = 0; i < 3; i++) { if (composer) composer.render(); else renderer.render(scene, camera); await nextFrame(); }
  }

  return {
    setStickHook(h) { stickHook = h; },
    morphStats: () => world.morphStats(),
    mode: '3d',
    ready,
    citizens, // gỡ lỗi: dân thành Bát Quái
    prepareRoom: (key) => roomsB.prepare(key),
    rebuildRoom: (key) => { roomsB.rebuild(key); const m = /^est:(\d+)$/.exec(key || ''); if (m) mansionsB.refurnish(Number(m[1])); },
    mansions: mansionsB, // gỡ lỗi
    raze: RZ, // phá hủy công trình ngoài thành (main.js)
    rooms: roomsB, // gỡ lỗi
    setEstateOwner, setEstateLookup, // biển nhà rao bán / tên chủ nhà ngoài phố
    warmScene: () => { absorbLights(); return renderer.compileAsync(scene, camera); },
    scene, // kiểm thử / gỡ lỗi
    initErrors, // phần cảnh bị bỏ vì lỗi (v4)
    resize,
    frame,
    pick,
    get yaw() { return cam.yaw; },
    get cam() { return cam; }, // gỡ lỗi / chụp ảnh kiểm (scripts)
    rotate(step) { cam.yawGoal += step; },
    celebrate(wx) { celebColor.set(WX_COLOR[wx] || '#ffd27a'); celebrate = 6; },
    get lowQuality() { return lowQuality; },
    get degrade() { return degrade; },
    // gỡ lỗi hiệu năng: tổng lệnh vẽ / tam giác của CẢ một khung (bóng + cảnh + hậu kỳ)
    frameStats() { const inf = renderer.info; inf.autoReset = false; inf.reset(); if (composer) composer.render(); else renderer.render(scene, camera); const r = { calls: inf.render.calls, tris: inf.render.triangles, geo: inf.memory.geometries, tex: inf.memory.textures, progs: inf.programs.length }; inf.autoReset = true; return r; },
    info: () => ({ ...renderer.info.render, quality, trees: world.treeCount, pending: world.pending, cam: camera.position.toArray().map((v) => Math.round(v)), target: cam.target.toArray().map((v) => Math.round(v)) }),
    // Ảnh chụp canvas (kiểm thử / chia sẻ): vẽ lại rồi đọc ngay trong cùng tác vụ.
    snapshot(type = 'image/jpeg') { renderer.render(scene, camera); return canvas.toDataURL(type, 0.85); },
    // Kiểm thử ánh sáng theo giờ: ghi đè giờ hiển thị (null = giờ thật).
    setDebugHour(h) { debugHour = h; },
    // gỡ lỗi: camera tự do { pos:[x,y,z], look:[x,y,z] } — null để trả về bám khách
    // dữ liệu cá nhân cho điện (interior.js) + nhãn cổng đại vận theo can chi của người chơi
    setRoomData(d) {
      interiors.setData(d);
      for (const lb of labels) {
        const m = /^van(\d)$/.exec(lb.id); if (!m) continue;
        const g = d?.van?.gates?.[Number(m[1])];
        if (g) lb.el.textContent = `${g.ganZhi} · ${g.ages.replace('t', ' tuổi')}${d.van.current === Number(m[1]) ? ' ★' : ''}`;
      }
    },
    setDebugCam(v) { debugCam = v; },
    // Kiểm thử / ảnh chụp: đặt góc nhìn camera
    setView({ yaw, pitch, dist } = {}) { if (yaw != null) { cam.yaw = cam.yawGoal = yaw; } if (pitch != null) cam.pitch = pitch; if (dist != null) cam.dist = dist; },
  };
}
