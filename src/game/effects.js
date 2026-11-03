// ============================================================================
//  HIỆU ỨNG GIA TRÌ NGUYÊN TỐ (progress.js › GIATRI) — theo hành Dụng thần của nhân vật
//    aura  : vòng hào quang dưới chân (nhịp thở)
//    motes : linh khí bay quanh (Mộc lá bay, Hỏa đốm lửa bốc lên, Thổ bụi vàng xoáy, Kim ánh kim lấp lánh, Thủy giọt nước rơi)
//    trail : vệt sáng khi chạy / bay
//    halo  : pháp quang sau lưng
//    fly   : kiếm bay dưới chân + mây (khi đang bay)
//  createGiatri(wx) → { obj, set(ids), update(dt, t, { moving, flying, heading }) }
// ============================================================================
import * as THREE from 'three';
import { WX_GIATRI } from './progress.js';
import { loadModel } from './assets.js';

let softTex = null;
function soft() {
  if (softTex) return softTex;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,0.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  softTex = new THREE.CanvasTexture(c);
  return softTex;
}

// chuyển động linh khí theo hành
const MOTE = {
  木: (p, t, i) => { const a = t * 0.6 + i * 0.7; p.set(Math.cos(a) * (0.6 + (i % 3) * 0.25), 0.4 + ((t * 0.3 + i * 0.13) % 2.2), Math.sin(a) * (0.6 + (i % 3) * 0.25)); },
  火: (p, t, i) => { const a = i * 2.4; const h = (t * 0.9 + i * 0.17) % 2.4; p.set(Math.cos(a) * 0.45 * (1 - h / 3), h, Math.sin(a) * 0.45 * (1 - h / 3)); },
  土: (p, t, i) => { const a = t * 1.4 + i * 0.5; const r = 0.5 + (i % 4) * 0.18; p.set(Math.cos(a) * r, 0.15 + (i % 5) * 0.08, Math.sin(a) * r); },
  金: (p, t, i) => { const a = t * 0.35 + i * 0.9; p.set(Math.cos(a) * 0.75, 0.6 + Math.sin(t * 1.7 + i) * 0.6 + 0.6, Math.sin(a) * 0.75); },
  水: (p, t, i) => { const a = i * 1.9 + t * 0.2; const h = 2.4 - ((t * 0.7 + i * 0.21) % 2.4); p.set(Math.cos(a) * 0.65, h, Math.sin(a) * 0.65); },
};

export function createGiatri(wx) {
  const info = WX_GIATRI[wx] || WX_GIATRI.火;
  const color = new THREE.Color(info.color);
  const obj = new THREE.Group(); obj.name = 'giatri';
  const add = (o) => { obj.add(o); return o; };

  // hào quang dưới chân
  const auraMat = new THREE.MeshBasicMaterial({ color, map: soft(), transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending });
  const aura = add(new THREE.Mesh(new THREE.CircleGeometry(1.1, 40), auraMat));
  aura.rotation.x = -Math.PI / 2; aura.position.y = 0.04;
  const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const ring = add(new THREE.Mesh(new THREE.RingGeometry(0.95, 1.05, 48), ringMat));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05;

  // linh khí
  const NM = 26;
  const mg = new THREE.BufferGeometry(); mg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(NM * 3), 3));
  const motes = add(new THREE.Points(mg, new THREE.PointsMaterial({ color, size: wx === '金' ? 0.13 : 0.18, map: soft(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));
  motes.frustumCulled = false;

  // vệt sáng (lịch sử vị trí thế giới — thêm vào cảnh riêng, không theo nhân vật)
  const NT = 40;
  const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(NT * 3), 3));
  const trail = new THREE.Points(tg, new THREE.PointsMaterial({ color, size: 0.35, map: soft(), transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }));
  trail.frustumCulled = false; trail.name = 'giatri-trail';
  const hist = [];

  // pháp quang sau lưng
  const haloMat = new THREE.MeshBasicMaterial({ color, map: soft(), transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const halo = add(new THREE.Mesh(new THREE.CircleGeometry(0.9, 40), haloMat)); halo.position.set(0, 1.75, -0.28);
  const haloRing = add(new THREE.Mesh(new THREE.RingGeometry(0.8, 0.86, 48), ringMat)); haloRing.position.copy(halo.position);

  // kiếm bay + mây
  const fly = add(new THREE.Group());
  loadModel('flying_sword').then((g) => {
    if (!g) return;
    const s = g.scene.clone(true);
    const b = new THREE.Box3().setFromObject(s); const sz = b.getSize(new THREE.Vector3());
    s.scale.setScalar(1.9 / Math.max(sz.x, sz.z, 0.01));
    s.rotation.y = sz.x > sz.z ? Math.PI / 2 : 0;
    s.position.y = -0.05;
    fly.add(s);
  });
  const cloudMat = new THREE.MeshBasicMaterial({ color: '#ffffff', map: soft(), transparent: true, opacity: 0.55, depthWrite: false });
  for (let i = 0; i < 6; i++) { const c = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), cloudMat); c.rotation.x = -Math.PI / 2; c.position.set(Math.cos(i) * 0.5, -0.12, Math.sin(i * 1.3) * 0.7); fly.add(c); }
  const flyGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.4), new THREE.MeshBasicMaterial({ color, map: soft(), transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }));
  flyGlow.rotation.x = -Math.PI / 2; flyGlow.position.y = -0.1; fly.add(flyGlow);

  let on = new Set();
  const P = new THREE.Vector3();
  return {
    obj, trail,
    set(ids) { on = new Set(ids); },
    update(dt, t, { moving = false, flying = false, world = null } = {}) {
      aura.visible = ring.visible = on.has('aura') && !flying;
      if (aura.visible) { const k = 1 + Math.sin(t * 2.2) * 0.06; aura.scale.setScalar(k); auraMat.opacity = 0.45 + Math.sin(t * 2.2) * 0.15; ring.rotation.z = t * 0.4; }
      motes.visible = on.has('motes');
      if (motes.visible) {
        const arr = mg.attributes.position.array; const fn = MOTE[wx] || MOTE.火;
        for (let i = 0; i < NM; i++) { fn(P, t, i); arr[i * 3] = P.x; arr[i * 3 + 1] = P.y; arr[i * 3 + 2] = P.z; }
        mg.attributes.position.needsUpdate = true;
      }
      halo.visible = haloRing.visible = on.has('halo');
      if (halo.visible) { haloMat.opacity = 0.4 + Math.sin(t * 1.3) * 0.12; haloRing.rotation.z = -t * 0.3; }
      fly.visible = flying;
      if (flying) { flyGlow.material.opacity = 0.45 + Math.sin(t * 6) * 0.15; fly.rotation.y = 0; }
      // vệt sáng theo vị trí thế giới
      trail.visible = on.has('trail') && (moving || flying);
      if (world) {
        hist.unshift(world.clone()); if (hist.length > NT) hist.length = NT;
        const arr = tg.attributes.position.array;
        for (let i = 0; i < NT; i++) { const h = hist[Math.min(i, hist.length - 1)]; arr[i * 3] = h.x; arr[i * 3 + 1] = h.y + 0.9 + (flying ? -0.5 : 0); arr[i * 3 + 2] = h.z; }
        tg.attributes.position.needsUpdate = true;
      }
    },
  };
}
