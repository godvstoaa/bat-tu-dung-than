// ============================================================================
//  THIÊN LAO + KHOÁNG SƠN — dựng hình thủ tục (bố cục, va chạm: prison.js). Gộp theo vật liệu: vài lệnh vẽ.
//  Chỉ hiện khi người chơi ở dải nội thất (render3d bật / tắt như nội thất điện).
// ============================================================================
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { JAIL, MINE, ORES, CELLS } from './prison.js';
import { addLight } from './lights.js';

export function createPrison(scene) {
  const g = new THREE.Group(); g.name = 'prison'; g.visible = false; scene.add(g);
  const parts = new Map(); // màu → [geo]
  const put = (col, geo, x, y, z, ry = 0) => { geo.rotateY(ry); geo.translate(x, y, z); (parts.get(col) || parts.set(col, []).get(col)).push(geo); };
  const box = (col, x, y, z, w, h, d, ry = 0) => put(col, new THREE.BoxGeometry(w, h, d), x, y, z, ry);
  const wall = (b, H, col) => {
    box(col, b.x, H / 2, b.z - b.d / 2 + 0.3, b.w, H, 0.6); box(col, b.x, H / 2, b.z + b.d / 2 - 0.3, b.w, H, 0.6);
    box(col, b.x - b.w / 2 + 0.3, H / 2, b.z, 0.6, H, b.d); box(col, b.x + b.w / 2 - 0.3, H / 2, b.z, 0.6, H, b.d);
    // lỗ châu mai trên đầu tường
    for (let x = b.x - b.w / 2 + 1; x < b.x + b.w / 2; x += 2.4) { box(col, x, H + 0.4, b.z - b.d / 2 + 0.3, 1.1, 0.8, 0.7); box(col, x, H + 0.4, b.z + b.d / 2 - 0.3, 1.1, 0.8, 0.7); }
  };
  // ---- Thiên Lao: sân đá xám, tường cao 7 m, 4 gian lao song gỗ, chòi canh, bàn cai ngục, bia luật
  box('#5d5a55', JAIL.x, -0.25, JAIL.z, JAIL.w, 0.5, JAIL.d);
  wall(JAIL, 7, '#4a4744');
  for (const c of CELLS) {
    box('#3d3a37', c.x - c.w / 2 + 0.3, 2, c.z, 0.6, 4, c.d); box('#3d3a37', c.x + c.w / 2 - 0.3, 2, c.z, 0.6, 4, c.d);
    box('#2e2b29', c.x, 4.2, c.z, c.w, 0.4, c.d); // mái lao
    for (let x = c.x - c.w / 2 + 0.8; x < c.x + c.w / 2 - 0.6; x += 0.5) if (Math.abs(x - c.x) > 1) box('#3b2a1c', x, 1.8, c.z + c.d / 2, 0.12, 3.6, 0.12); // song cửa (chừa cửa giữa)
    box('#3b2a1c', c.x, 3.55, c.z + c.d / 2, c.w - 1, 0.25, 0.2);
    box('#6b5a3c', c.x - 2, 0.25, c.z - 1.5, 2.2, 0.5, 1.2); // chõng tre
  }
  for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { // chòi canh bốn góc
    const x = JAIL.x + dx * (JAIL.w / 2 - 1.5), z = JAIL.z + dz * (JAIL.d / 2 - 1.5);
    box('#3f3c39', x, 5, z, 3, 10, 3); put('#2a2622', new THREE.ConeGeometry(2.8, 2.2, 4), x, 11.1, z, Math.PI / 4);
  }
  box('#5a3b22', JAIL.x, 0.45, JAIL.z + JAIL.d / 2 - 5.2, 3, 0.9, 1.2); // bàn cai ngục
  box('#8c8577', JAIL.x - 12, 1.4, JAIL.z + JAIL.d / 2 - 5, 2.2, 2.8, 0.5); // bia luật
  box('#6e2a1d', JAIL.x, 8.6, JAIL.z + JAIL.d / 2 - 0.3, 8, 1.2, 0.3); // biển «Thiên Lao»
  // ---- Khoáng Sơn: hố đất đá, vách núi ba phía, đường ray + xe goòng, lán giám mỏ, mạch quặng phát sáng
  box('#6a5a48', MINE.x, -0.25, MINE.z, MINE.w, 0.5, MINE.d);
  wall(MINE, 3, '#5b4d3e');
  for (let i = 0; i < 26; i++) { // vách núi đá lởm chởm phía sau
    const t = i / 25, side = i % 3;
    const x = side === 0 ? MINE.x - MINE.w / 2 + t * MINE.w : side === 1 ? MINE.x - MINE.w / 2 - 3 : MINE.x + MINE.w / 2 + 3;
    const z = side === 0 ? MINE.z - MINE.d / 2 - 4 : MINE.z - MINE.d / 2 + t * MINE.d;
    const h = 10 + ((i * 37) % 13);
    put('#57493b', new THREE.DodecahedronGeometry(5 + ((i * 17) % 4), 0).scale(1, h / 6, 1), x, h / 2 - 1, z, i);
  }
  for (let x = MINE.x - MINE.w / 2 + 4; x < MINE.x + MINE.w / 2 - 4; x += 1.2) box('#3a2c20', x, 0.06, MINE.z + MINE.d / 2 - 12, 0.25, 0.12, 2); // tà vẹt
  box('#555a5e', MINE.x, 0.15, MINE.z + MINE.d / 2 - 12.7, MINE.w - 8, 0.1, 0.12); box('#555a5e', MINE.x, 0.15, MINE.z + MINE.d / 2 - 11.3, MINE.w - 8, 0.1, 0.12);
  box('#4b3a28', MINE.x - 20, 0.9, MINE.z + MINE.d / 2 - 12, 2.6, 1.2, 1.6); // xe goòng
  box('#5a4630', MINE.x, 1.6, MINE.z + MINE.d / 2 - 2.5, 7, 3.2, 3.5); put('#3b2f22', new THREE.ConeGeometry(5.2, 2, 4), MINE.x, 4.2, MINE.z + MINE.d / 2 - 2.5, Math.PI / 4); // lán giám mỏ
  for (const o of ORES) put('#4a4038', new THREE.DodecahedronGeometry(1.5, 0).scale(1, 1.25, 1), o.x, 1.2, o.z, o.x);
  // gộp
  for (const [col, geos] of parts) {
    const m = new THREE.Mesh(mergeGeometries(geos.map((q) => (q.index ? q.toNonIndexed() : q))), new THREE.MeshStandardMaterial({ color: col, roughness: 0.92, flatShading: true }));
    m.castShadow = m.receiveShadow = true; g.add(m);
  }
  // vân linh khoáng phát sáng (nhấp nháy nhẹ)
  const veinMat = new THREE.MeshStandardMaterial({ color: '#2fd4c0', emissive: '#22c4b0', emissiveIntensity: 1.4, roughness: 0.4 });
  const vg = [];
  for (const o of ORES) for (let k = 0; k < 4; k++) { const q = new THREE.OctahedronGeometry(0.28 + (k % 2) * 0.12, 0); q.translate(o.x + Math.cos(k * 1.7 + o.x) * 1.1, 0.8 + k * 0.35, o.z + Math.sin(k * 1.7 + o.z) * 1.1); vg.push(q); }
  const veins = new THREE.Mesh(mergeGeometries(vg), veinMat); g.add(veins);
  // đèn đuốc
  const fire = new THREE.MeshBasicMaterial({ color: '#ffb35a' }), fg = [];
  for (const [x, z] of [[JAIL.x - 8, JAIL.z + JAIL.d / 2 - 1], [JAIL.x + 8, JAIL.z + JAIL.d / 2 - 1], [MINE.x - 6, MINE.z + MINE.d / 2 - 1], [MINE.x + 6, MINE.z + MINE.d / 2 - 1], [MINE.x - 30, MINE.z], [MINE.x + 30, MINE.z]]) {
    const q = new THREE.SphereGeometry(0.28, 8, 6); q.translate(x, 2.6, z); fg.push(q);
    addLight(x, 2.8, z, { color: '#ffa64a', power: 1.2 }); // pool đèn chung (lights.js)
  }
  g.add(new THREE.Mesh(mergeGeometries(fg), fire));
  let t = 0;
  return {
    group: g,
    setVisible(v) { g.visible = v; },
    update(dt) { if (!g.visible) return; t += dt; veinMat.emissiveIntensity = 1.1 + Math.sin(t * 2.2) * 0.4; },
  };
}
