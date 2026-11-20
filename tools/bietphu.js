// ============================================================================
//  TRANG XEM BIỆT PHỦ (docs/BIET-PHU-MANIFEST.md): dựng một phần khuôn viên qua src/game/archcity/estatekit.js theo đúng
//  khuôn lô, nắng + bóng + tone mapping ACES như game, người 1,75 m để so tỉ lệ, khung đỏ = chu vi va chạm (w × d) ở cao độ
//  nền, vạch xanh = khe cửa 2,4 m. window.bp.render({ style, kind, b, villa, view }) → { png, info, bb }.
//   view: persp (¾ trước-trái) · front (chính diện) · eye (người đứng 14 m trước cửa) · door (sát cửa nhìn vào) · top
// ============================================================================
import * as THREE from 'three';
import { estatePiece } from '/src/game/archcity/estatekit.js';
import { STYLES } from '/src/game/estate-layout.js';

const W = 1280, H = 800;
const rd = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
rd.setSize(W, H); rd.setPixelRatio(1); rd.outputColorSpace = THREE.SRGBColorSpace; rd.toneMapping = THREE.ACESFilmicToneMapping; rd.toneMappingExposure = 1.0;
rd.shadowMap.enabled = true; rd.shadowMap.type = THREE.PCFSoftShadowMap; document.body.appendChild(rd.domElement);

function person(h = 1.75) {
  const g = new THREE.Group(), m = new THREE.MeshStandardMaterial({ color: '#3b4a6b', roughness: 0.8 }), sk = new THREE.MeshStandardMaterial({ color: '#d9b08c' });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, h - 0.65, 4, 8), m); body.position.y = (h - 0.25) / 2; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), sk); head.position.y = h - 0.12; g.add(head);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return g;
}
const line = (pts, color) => new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z))), new THREE.LineBasicMaterial({ color, depthTest: false }));

function render({ style, kind = 'hall', b, villa = false, variant = 0, view = 'persp' }) {
  const S = STYLES[style];
  const p = estatePiece(style, S, kind, b, { villa, variant });
  if (!p) return { err: 'chưa có bộ dựng' };
  const s = new THREE.Scene(); s.background = new THREE.Color('#bcd0dc'); s.fog = new THREE.Fog('#c9d6dc', 160, 520);
  s.add(new THREE.HemisphereLight('#dfe9f2', '#7d7564', 1.25));
  const sun = new THREE.DirectionalLight('#fff1dc', 2.6); sun.position.set(-50, 70, 60); sun.castShadow = true;
  const sc = sun.shadow.camera; sc.left = sc.bottom = -60; sc.right = sc.top = 60; sc.near = 1; sc.far = 300; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.02; s.add(sun);
  const gnd = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), new THREE.MeshStandardMaterial({ color: '#7f8f5c', roughness: 1 })); gnd.rotation.x = -Math.PI / 2; gnd.receiveShadow = true; s.add(gnd);
  const g = new THREE.Group(); g.add(p.base, p.shell); s.add(g);
  const bb = new THREE.Box3().setFromObject(g), c = bb.getCenter(new THREE.Vector3()), sz = bb.getSize(new THREE.Vector3());
  const yP = kind === 'hall' ? b.plinth : 0, D = kind === 'gate' ? 0 : (b.d || sz.z);
  if (kind === 'hall') {
    s.add(line([[-b.w / 2, yP + 0.03, b.d / 2], [-b.w / 2, yP + 0.03, -b.d / 2], [b.w / 2, yP + 0.03, -b.d / 2], [b.w / 2, yP + 0.03, b.d / 2], [-b.w / 2, yP + 0.03, b.d / 2]], '#ff2a2a'));
    s.add(line([[-1.2, yP + 0.06, b.d / 2], [1.2, yP + 0.06, b.d / 2]], '#1fd14a'));
    const m2 = person(); m2.position.set(-0.6, yP, 0); s.add(m2);
  }
  const man = person(); man.position.set(1.6, 0, kind === 'gate' ? 2.5 : D / 2 + 2.6); s.add(man);
  let cam;
  if (view === 'persp') { const rad = sz.length() / 2, dist = rad / Math.sin((32 * Math.PI) / 360), dir = new THREE.Vector3(-0.6, 0.38, 0.9).normalize(); cam = new THREE.PerspectiveCamera(32, W / H, 0.3, 3000); cam.position.copy(c).addScaledVector(dir, dist); cam.lookAt(c); }
  else if (view === 'front') { const t = Math.tan((30 * Math.PI) / 360), dist = Math.max(sz.x / 2 / t / (W / H), sz.y / 2 / t) * 1.12; cam = new THREE.PerspectiveCamera(30, W / H, 0.3, 3000); cam.position.set(c.x, c.y, bb.max.z + dist); cam.lookAt(c.x, c.y, c.z); }
  else if (view === 'eye') { cam = new THREE.PerspectiveCamera(55, W / H, 0.2, 3000); cam.position.set(-3, 1.65, D / 2 + 14); cam.lookAt(0, Math.min(sz.y * 0.45, 9), 0); }
  else if (view === 'door') { cam = new THREE.PerspectiveCamera(65, W / H, 0.1, 3000); cam.position.set(0.4, yP + 1.65, D / 2 + 3.2); cam.lookAt(0, yP + 1.6, 0); }
  else { cam = new THREE.PerspectiveCamera(35, W / H, 0.3, 3000); cam.position.set(c.x, c.y + sz.length() * 1.5, c.z + 0.01); cam.lookAt(c); }
  rd.render(s, cam);
  return { png: rd.domElement.toDataURL('image/png'), info: p.info, bb: { min: bb.min.toArray().map((v) => +v.toFixed(2)), max: bb.max.toArray().map((v) => +v.toFixed(2)) } };
}
window.bp = { render };
window.bpReady = true;
