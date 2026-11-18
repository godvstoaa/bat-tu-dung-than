// ============================================================================
//  TRANG VẼ: dựng một công trình bằng chính bộ dựng của game (src/game/tienphu/arch/*), chiếu trực giao ra
//  mặt đứng / mặt bên / mặt bằng cắt / mặt cắt + phối cảnh. Gọi từ scripts/banve.mjs qua window.banve.render(id, view).
// ============================================================================
import * as THREE from 'three';
import { buildArch, ARCH_SPECS } from '/src/game/tienphu/arch/index.js';

const W = 1600, H = 1000;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, stencil: true });
renderer.setSize(W, H); renderer.setPixelRatio(1); renderer.localClippingEnabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const cache = new Map();
function get(id) {
  if (!cache.has(id)) { const r = buildArch(id); cache.set(id, r); }
  return cache.get(id);
}
function scene(group, { clip = null, edges = true, shadow = true } = {}) {
  const s = new THREE.Scene(); s.background = new THREE.Color('#f6f1e4');
  s.add(new THREE.HemisphereLight('#ffffff', '#b8ab90', 1.7));
  const sun = new THREE.DirectionalLight('#ffffff', 1.5); sun.position.set(-60, 90, 70); sun.castShadow = shadow;
  const sc = sun.shadow.camera; sc.left = sc.bottom = -120; sc.right = sc.top = 120; sc.near = 1; sc.far = 400; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -0.0004; s.add(sun);
  const g = group.clone(true);
  const meshes = []; g.traverse((o) => { if (o.isMesh) meshes.push(o); });
  meshes.forEach((o) => {
    o.material = o.material.clone(); if (clip) { o.material.clippingPlanes = clip; o.material.clipShadows = true; }
    if (clip && !/^tile|^ground/.test(o.name)) { // tô đen mặt cắt (bỏ mặt ngói hở — không kín, làm sai chẵn lẻ) (poché) bằng stencil: mặt sau +1, mặt trước −1 → khác 0 là ruột khối bị cắt
      const base = { colorWrite: false, depthWrite: false, depthTest: false, stencilWrite: true, stencilFunc: THREE.AlwaysStencilFunc, clippingPlanes: clip };
      const back = new THREE.Mesh(o.geometry, new THREE.MeshBasicMaterial({ ...base, side: THREE.BackSide, stencilFail: THREE.IncrementWrapStencilOp, stencilZFail: THREE.IncrementWrapStencilOp, stencilZPass: THREE.IncrementWrapStencilOp }));
      const front = new THREE.Mesh(o.geometry, new THREE.MeshBasicMaterial({ ...base, side: THREE.FrontSide, stencilFail: THREE.DecrementWrapStencilOp, stencilZFail: THREE.DecrementWrapStencilOp, stencilZPass: THREE.DecrementWrapStencilOp }));
      back.renderOrder = front.renderOrder = 1; o.renderOrder = 3; o.add(back, front); o.material.side = THREE.FrontSide;
    }
    if (edges) { const e = new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry, 28), new THREE.LineBasicMaterial({ color: '#1d1a16', transparent: true, opacity: 0.55, clippingPlanes: clip || [] })); o.add(e); }
  });
  s.add(g);
  if (clip) { // mặt nắp tại mặt phẳng cắt: chỉ vẽ nơi stencil ≠ 0
    const pl = clip[0], cap = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), new THREE.MeshBasicMaterial({ color: '#2b2622', stencilWrite: true, stencilRef: 0, stencilFunc: THREE.NotEqualStencilFunc, stencilFail: THREE.ReplaceStencilOp, stencilZFail: THREE.ReplaceStencilOp, stencilZPass: THREE.ReplaceStencilOp, side: THREE.DoubleSide }));
    const q = pl.coplanarPoint(new THREE.Vector3()); cap.position.copy(q); cap.lookAt(q.clone().sub(pl.normal)); cap.renderOrder = 2; cap.onAfterRender = (r) => r.clearStencil(); s.add(cap);
  }
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.ShadowMaterial({ opacity: 0.18 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.01; ground.receiveShadow = true; s.add(ground);
  return s;
}
function fitOrtho(bb, view, margin = 1.08) {
  const sz = bb.getSize(new THREE.Vector3()), c = bb.getCenter(new THREE.Vector3());
  let w, h; if (view === 'front' || view === 'back') { w = sz.x; h = sz.y; } else if (view === 'side' || view === 'section') { w = sz.z; h = sz.y; } else { w = sz.x; h = sz.z; }
  const k = Math.max(w / W, h / H) * margin, cam = new THREE.OrthographicCamera(-W / 2 * k, W / 2 * k, H / 2 * k, -H / 2 * k, 0.1, 2000);
  const R = 800;
  if (view === 'front') cam.position.set(c.x, c.y, c.z + R);
  if (view === 'back') cam.position.set(c.x, c.y, c.z - R);
  if (view === 'side' || view === 'section') cam.position.set(c.x + R, c.y, c.z);
  if (view === 'plan' || view === 'roof') { cam.position.set(c.x, c.y + R, c.z); cam.up.set(0, 0, -1); }
  cam.lookAt(c); cam.updateProjectionMatrix();
  return { cam, pxPerM: 1 / k, center: c };
}
function render(id, view) {
  const { group, info, spec } = get(id);
  const bb = new THREE.Box3().setFromObject(group);
  let clip = null;
  if (view === 'plan') clip = [new THREE.Plane(new THREE.Vector3(0, -1, 0), info.ph + 1.5)];
  if (view === 'section') clip = [new THREE.Plane(new THREE.Vector3(-1, 0, 0), (spec.sectionX ?? 0))];
  const s = scene(group, { clip, shadow: view !== 'plan' });
  let cam, pxPerM = 0, center = new THREE.Vector3();
  if (view === 'persp') {
    const sz = bb.getSize(new THREE.Vector3()), c = bb.getCenter(new THREE.Vector3()), rad = sz.length() / 2, fov = 30;
    const dist = rad / Math.sin((fov * Math.PI) / 360) * 1.02, dir = new THREE.Vector3(0.55, 0.42, 0.85).normalize();
    cam = new THREE.PerspectiveCamera(fov, W / H, 0.5, 4000); cam.position.copy(c).addScaledVector(dir, dist); cam.lookAt(c);
  } else ({ cam, pxPerM, center } = fitOrtho(bb, view));
  renderer.render(s, cam);
  // toạ độ màn hình của mốc (để bản vẽ ghi kích thước)
  const toPx = (x, y, z) => { const v = new THREE.Vector3(x, y, z).project(cam); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H]; };
  return { png: renderer.domElement.toDataURL('image/png'), pxPerM, W, H, center: center.toArray(), bb: { min: bb.min.toArray(), max: bb.max.toArray() }, info, origin: toPx(0, 0, 0), toPxGround: view === 'plan' ? toPx(0, 0, 0) : null, tris: info.tris };
}
window.banve = { render, ids: () => Object.keys(ARCH_SPECS), spec: (id) => ({ ...ARCH_SPECS[id], build: undefined }), info: (id) => get(id).info };
window.banveReady = true;
