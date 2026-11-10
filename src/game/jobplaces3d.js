// ============================================================================
//  MỎ DÂN SỰ KHOÁNG SƠN — dựng hình thủ tục (bố cục: jobplaces.js). Gộp theo vật liệu như prison3d.js.
//  Chỉ hiện khi người chơi ở dải nội thất. Kèm kiện hàng trên lưng phu dịch trạm (makeParcel).
// ============================================================================
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { CMINE, ORE_NODES, CART, BOSS } from './jobplaces.js';
import { addLight } from './lights.js';

export function createJobPlaces(scene) {
  const g = new THREE.Group(); g.name = 'jobplaces'; g.visible = false; scene.add(g);
  const parts = new Map();
  const put = (col, geo, x, y, z, ry = 0) => { geo.rotateY(ry); geo.translate(x, y, z); (parts.get(col) || parts.set(col, []).get(col)).push(geo); };
  const box = (col, x, y, z, w, h, d, ry = 0) => put(col, new THREE.BoxGeometry(w, h, d), x, y, z, ry);
  const b = CMINE;
  // nền đất nện, vách đá ba phía cao, hàng rào gỗ phía Nam
  box('#7a6a52', b.x, -0.25, b.z, b.w, 0.5, b.d);
  box('#5b4d3e', b.x, 5, b.z - b.d / 2 + 0.3, b.w, 10, 0.6);
  box('#5b4d3e', b.x - b.w / 2 + 0.3, 5, b.z, 0.6, 10, b.d);
  box('#5b4d3e', b.x + b.w / 2 - 0.3, 5, b.z, 0.6, 10, b.d);
  for (let x = b.x - b.w / 2 + 1; x < b.x + b.w / 2; x += 1.6) box('#6a4a2e', x, 0.9, b.z + b.d / 2 - 0.3, 0.18, 1.8, 0.18);
  box('#6a4a2e', b.x, 1.5, b.z + b.d / 2 - 0.3, b.w, 0.14, 0.14); box('#6a4a2e', b.x, 0.7, b.z + b.d / 2 - 0.3, b.w, 0.14, 0.14);
  // vách núi lởm chởm phía sau (đá đa diện)
  for (let k = 0; k < 14; k++) { const x = b.x - b.w / 2 + 2 + k * (b.w - 4) / 13; put('#4e4236', new THREE.DodecahedronGeometry(2.6 + (k % 3), 0).scale(1, 1.6, 0.8), x, 4 + (k % 4), b.z - b.d / 2 - 1.2, k); }
  // mạch quặng: tảng đá có vân đồng / bạc
  for (const o of ORE_NODES) { put('#5a4c40', new THREE.DodecahedronGeometry(1.4, 0).scale(1.1, 1.2, 1), o.x, 1.1, o.z, o.x); box('#3a2c20', o.x, 0.05, o.z + 1.7, 2.4, 0.1, 1.2); }
  // đường ray + xe goòng ở góc Tây Nam (lối về thành)
  for (let z = CART.z - 10; z < CART.z + 4; z += 1.1) box('#3a2c20', CART.x, 0.06, z, 2.2, 0.12, 0.25);
  box('#555a5e', CART.x - 0.7, 0.15, CART.z - 3, 0.12, 0.1, 14); box('#555a5e', CART.x + 0.7, 0.15, CART.z - 3, 0.12, 0.1, 14);
  box('#4b3a28', CART.x, 0.9, CART.z, 1.9, 1.1, 2.6);
  // lán đốc công: mái chóp, bàn sổ, giá cuốc
  box('#5a4630', BOSS.x, 1.6, BOSS.z + 1.2, 6, 3.2, 3);
  put('#3b2f22', new THREE.ConeGeometry(4.6, 1.8, 4), BOSS.x, 4.1, BOSS.z + 1.2, Math.PI / 4);
  box('#6b4a2e', BOSS.x - 3.8, 0.45, BOSS.z - 0.4, 2, 0.9, 1);
  for (let k = 0; k < 4; k++) box('#7a5634', BOSS.x + 4 + k * 0.4, 0.9, BOSS.z, 0.08, 1.8, 0.08);
  // đống quặng đã đào
  for (let k = 0; k < 6; k++) put('#8a7a5a', new THREE.DodecahedronGeometry(0.5 + (k % 2) * 0.2, 0), BOSS.x - 8 + (k % 3) * 0.8, 0.4 + Math.floor(k / 3) * 0.5, BOSS.z + 2 + (k % 2) * 0.5, k);
  box('#6e2a1d', b.x, 9.2, b.z - b.d / 2 + 0.7, 10, 1.4, 0.3); // biển tên trên vách
  for (const [col, geos] of parts) {
    const m = new THREE.Mesh(mergeGeometries(geos.map((q) => (q.index ? q.toNonIndexed() : q))), new THREE.MeshStandardMaterial({ color: col, roughness: 0.92, flatShading: true }));
    m.castShadow = m.receiveShadow = true; g.add(m);
  }
  // vân quặng ánh kim (đồng / bạc), sáng nhẹ
  const veinMat = new THREE.MeshStandardMaterial({ color: '#d8b46a', emissive: '#b8862e', emissiveIntensity: 0.6, roughness: 0.35, metalness: 0.6 });
  const vg = [];
  for (const o of ORE_NODES) for (let k = 0; k < 3; k++) { const q = new THREE.OctahedronGeometry(0.22 + (k % 2) * 0.1, 0); q.translate(o.x + Math.cos(k * 2.1 + o.z) * 1.0, 0.7 + k * 0.4, o.z + Math.sin(k * 2.1 + o.x) * 0.9); vg.push(q); }
  const veins = new THREE.Mesh(mergeGeometries(vg), veinMat); g.add(veins);
  // biển tên (canvas)
  const c = document.createElement('canvas'); c.width = 512; c.height = 72; const cx = c.getContext('2d');
  cx.fillStyle = '#6e2a1d'; cx.fillRect(0, 0, 512, 72); cx.fillStyle = '#f3d9a0'; cx.font = 'bold 40px serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('Mỏ Dân Sự Khoáng Sơn', 256, 38);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(10, 1.4), new THREE.MeshBasicMaterial({ map: tex })); sign.position.set(b.x, 9.2, b.z - b.d / 2 + 0.87); g.add(sign);
  // đuốc
  const fire = new THREE.MeshBasicMaterial({ color: '#ffb35a' }), fg = [];
  for (const [x, z] of [[BOSS.x - 4, BOSS.z + 3], [b.x - 18, b.z - 6], [b.x + 18, b.z - 6], [CART.x + 3, CART.z - 2]]) {
    const q = new THREE.SphereGeometry(0.26, 8, 6); q.translate(x, 2.6, z); fg.push(q);
    addLight(x, 2.8, z, { color: '#ffa64a', power: 1.1 });
  }
  g.add(new THREE.Mesh(mergeGeometries(fg), fire));
  let t = 0;
  return {
    group: g,
    setVisible(v) { g.visible = v; },
    update(dt) { if (!g.visible) return; t += dt; veinMat.emissiveIntensity = 0.5 + Math.sin(t * 1.7) * 0.2; },
  };
}

/** kiện hàng buộc dây đeo sau lưng (phu dịch trạm đang áp hàng) */
export function makeParcel() {
  const g = new THREE.Group();
  const cloth = new THREE.MeshStandardMaterial({ color: '#b08a52', roughness: 0.95 });
  const rope = new THREE.MeshStandardMaterial({ color: '#5a3b22', roughness: 0.9 });
  const seal = new THREE.MeshStandardMaterial({ color: '#b3231a', roughness: 0.6 });
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.5, 0.36), cloth); g.add(box);
  for (const y of [-0.12, 0.12]) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.57, 0.04, 0.38), rope); r.position.y = y; g.add(r); }
  const s = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.02), seal); s.position.set(0, 0, -0.19); g.add(s);
  g.traverse((m) => { if (m.isMesh) m.castShadow = true; });
  return g;
}
