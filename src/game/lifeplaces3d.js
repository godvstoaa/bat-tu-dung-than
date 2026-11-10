// ============================================================================
//  NƠI SINH HOẠT SƠN MÔN — dựng hình: quầy cơm (lib_stall_timber), liêu xá (bq_inn), giếng đá thủ tục, biển hiệu,
//  đèn lồng; gánh nước trên vai người chơi (render3d gắn vào hero khi đang gánh).
// ============================================================================
import * as THREE from 'three';
import { placeModel } from './assets.js';
import { addFootprint } from './collide.js';
import { addLight } from './lights.js';
import { STALL, DORM, WELL } from './lifeplaces.js';

function sign(text, w = 4.2) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#5a1f14'; g.fillRect(0, 0, 512, 128);
  g.strokeStyle = '#d9a441'; g.lineWidth = 8; g.strokeRect(6, 6, 500, 116);
  g.fillStyle = '#f3d9a0'; g.font = 'bold 54px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 256, 66);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.PlaneGeometry(w, w / 4), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, side: THREE.DoubleSide }));
}

export function createLifePlaces(scene) {
  const g = new THREE.Group(); g.name = 'lifeplaces'; scene.add(g);
  (async () => {
    const st = await placeModel(g, 'lib_stall_timber', { fit: { height: 4.2 }, at: { x: STALL.x, y: 0, z: STALL.z, ry: STALL.ry } });
    if (st?.obj) addFootprint(st.obj, { fill: false });
    const inn = await placeModel(g, 'bq_inn', { fit: { width: DORM.w }, at: { x: DORM.x, y: 0, z: DORM.z, ry: DORM.ry } });
    if (inn?.obj) addFootprint(inn.obj, { keep: (x) => x < DORM.x - DORM.d / 2 + 0.2 }); // chừa hiên trước cửa
  })().catch((e) => console.warn('[lifeplaces]', e));
  // biển hiệu
  const s1 = sign('Quầy Cơm'); s1.position.set(STALL.x + 3.4, 3.2, STALL.z); s1.rotation.y = Math.PI / 2; g.add(s1);
  const s2 = sign('Liêu Xá', 4.8); s2.position.set(DORM.x - DORM.d / 2 - 1.2, 3.6, DORM.z); s2.rotation.y = -Math.PI / 2; g.add(s2);
  // giếng đá: thành giếng tròn, mái nhỏ, tời, thùng
  const stone = new THREE.MeshStandardMaterial({ color: '#8d877b', roughness: 0.95 }), wood = new THREE.MeshStandardMaterial({ color: '#6b4a2e', roughness: 0.8 });
  const water = new THREE.MeshStandardMaterial({ color: '#2a5468', roughness: 0.2, metalness: 0.1 });
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(WELL.r, WELL.r + 0.1, 0.9, 20, 1, true), stone); ring.position.set(WELL.x, 0.45, WELL.z);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(WELL.r, 0.16, 8, 24), stone); rim.rotation.x = Math.PI / 2; rim.position.set(WELL.x, 0.9, WELL.z);
  const wat = new THREE.Mesh(new THREE.CircleGeometry(WELL.r - 0.1, 20), water); wat.rotation.x = -Math.PI / 2; wat.position.set(WELL.x, 0.35, WELL.z);
  for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.4, 0.18), wood); p.position.set(WELL.x + s * (WELL.r + 0.1), 1.2, WELL.z); g.add(p); }
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, WELL.r * 2 + 0.6, 8), wood); beam.rotation.z = Math.PI / 2; beam.position.set(WELL.x, 2.1, WELL.z);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(WELL.r + 0.9, 0.9, 4), new THREE.MeshStandardMaterial({ color: '#4b3b2b', roughness: 0.9 })); roof.rotation.y = Math.PI / 4; roof.position.set(WELL.x, 2.85, WELL.z);
  const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.32, 10), wood); bucket.position.set(WELL.x + 0.7, 1.2, WELL.z + 0.2);
  for (const m of [ring, rim, wat, beam, roof, bucket]) { m.castShadow = m.receiveShadow = true; g.add(m); }
  // đèn lồng
  addLight(STALL.x + 3, 2.6, STALL.z - 2.5, { color: '#ffb35c', power: 0.8 });
  addLight(DORM.x - DORM.d / 2 - 1, 2.8, DORM.z + 3, { color: '#ffb35c', power: 0.8 });
  return { group: g };
}

/** đòn gánh + 2 thùng nước (gắn lên vai nhân vật khi đang gánh) */
export function makeYoke() {
  const g = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: '#7a5634', roughness: 0.8 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.8, 6), wood); pole.rotation.z = Math.PI / 2; g.add(pole);
  for (const s of [-1, 1]) {
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.6, 4), wood); rope.position.set(s * 0.8, -0.3, 0); g.add(rope);
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.17, 0.32, 10), wood); b.position.set(s * 0.8, -0.72, 0); g.add(b);
    const w = new THREE.Mesh(new THREE.CircleGeometry(0.18, 10), new THREE.MeshStandardMaterial({ color: '#3a7088', roughness: 0.2 })); w.rotation.x = -Math.PI / 2; w.position.set(s * 0.8, -0.57, 0); g.add(w);
  }
  g.traverse((m) => { if (m.isMesh) m.castShadow = true; });
  return g;
}
