// ============================================================================
//  HIỆU ỨNG GIA TRÌ NGUYÊN TỐ (progress.js › GIATRI) + skin Tàng Y Các (cosmetics.js)
//    aura  : vòng hào quang dưới chân (nhịp thở)      — skin: đào hoa, chân hỏa, bát quái, lôi quang, tuyết, sen vàng
//    motes : linh khí bay quanh (theo hành hoặc theo skin)
//    trail : vệt sáng khi chạy / bay                    — skin: mây, sen, lửa, băng, tinh hà
//    halo  : pháp quang sau lưng
//    fly   : ngự vật dưới chân khi bay                  — skin: kiếm, mây cân đẩu, hồ lô, đài sen, hạc
//  Món skin đã mua thì hiện kể cả khi chưa đủ cấp gia trì (aura/trail). Bay vẫn theo cấp 8 / VIP.
//  createGiatri(wx, skins) → { obj, trail, set(ids), update(dt, t, { moving, flying, world }) }
// ============================================================================
import * as THREE from 'three';
import { WX_GIATRI } from './progress.js';
import { loadModel } from './assets.js';
import { buildMount, disposeObject } from './accessories.js';
import * as TX from './textures.js';

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
let petalTex = null;
function petal() {
  if (petalTex) return petalTex;
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.beginPath(); g.ellipse(32, 32, 14, 26, 0.5, 0, Math.PI * 2); g.fill();
  petalTex = new THREE.CanvasTexture(c);
  return petalTex;
}

// chuyển động linh khí theo hành
const MOTE = {
  木: (p, t, i) => { const a = t * 0.6 + i * 0.7; p.set(Math.cos(a) * (0.6 + (i % 3) * 0.25), 0.4 + ((t * 0.3 + i * 0.13) % 2.2), Math.sin(a) * (0.6 + (i % 3) * 0.25)); },
  火: (p, t, i) => { const a = i * 2.4; const h = (t * 0.9 + i * 0.17) % 2.4; p.set(Math.cos(a) * 0.45 * (1 - h / 3), h, Math.sin(a) * 0.45 * (1 - h / 3)); },
  土: (p, t, i) => { const a = t * 1.4 + i * 0.5; const r = 0.5 + (i % 4) * 0.18; p.set(Math.cos(a) * r, 0.15 + (i % 5) * 0.08, Math.sin(a) * r); },
  金: (p, t, i) => { const a = t * 0.35 + i * 0.9; p.set(Math.cos(a) * 0.75, 0.6 + Math.sin(t * 1.7 + i) * 0.6 + 0.6, Math.sin(a) * 0.75); },
  水: (p, t, i) => { const a = i * 1.9 + t * 0.2; const h = 2.4 - ((t * 0.7 + i * 0.21) % 2.4); p.set(Math.cos(a) * 0.65, h, Math.sin(a) * 0.65); },
};
// skin hào quang (Tàng Y Các)
const AURA_SKIN = {
  aura_dao: { color: '#ff9cc0', size: 0.2, tex: 'petal', mote: (p, t, i) => { const a = i * 1.7 + t * 0.5; const h = 2.6 - ((t * 0.45 + i * 0.19) % 2.6); const r = 0.5 + (i % 4) * 0.2; p.set(Math.cos(a) * r + Math.sin(t + i) * 0.15, h, Math.sin(a) * r); } },
  aura_lua: { color: '#ff6a2a', size: 0.26, add: true, n: 40, mote: (p, t, i) => { const a = i * 2.39; const h = (t * 1.4 + i * 0.11) % 1.9; const r = 0.55 * (1 - h / 2.2); p.set(Math.cos(a + t) * r, h, Math.sin(a + t) * r); } },
  aura_batquai: { color: '#ffd060', size: 0.12, disc: 'batquai', mote: (p, t, i) => { const a = t * 1.1 + (i / 26) * Math.PI * 2; p.set(Math.cos(a) * 1.25, 0.08, Math.sin(a) * 1.25); } },
  aura_set: { color: '#b58cff', size: 0.14, add: true, bolts: true, mote: (p, t, i) => { const k = Math.floor(t * 12 + i * 7.3); const r = ((k * 9301 + 49297) % 233280) / 233280; p.set(Math.cos(r * 40) * 0.7, 0.3 + r * 1.8, Math.sin(r * 40) * 0.7); } },
  aura_tuyet: { color: '#e6f6ff', size: 0.12, n: 40, mote: (p, t, i) => { const h = 2.8 - ((t * 0.35 + i * 0.07) % 2.8); const a = i * 2.1; p.set(Math.cos(a) * (0.4 + (i % 5) * 0.15) + Math.sin(t * 1.3 + i) * 0.1, h, Math.sin(a) * (0.4 + (i % 5) * 0.15)); } },
  aura_sen: { color: '#ffd27a', size: 0.16, add: true, disc: 'sen', mote: (p, t, i) => { const a = i * 2.4 + t * 0.3; const h = (t * 0.5 + i * 0.13) % 2.2; p.set(Math.cos(a) * 0.5, h, Math.sin(a) * 0.5); } },
};
const TRAIL_SKIN = {
  trail_may: { color: '#ffffff', size: 0.9, add: false, opacity: 0.55 },
  trail_sen: { color: '#ffa8c4', size: 0.32, add: false, opacity: 0.9, tex: 'petal' },
  trail_lua: { color: '#ff7a2a', size: 0.42, add: true, opacity: 0.8 },
  trail_bang: { color: '#9fe8ff', size: 0.24, add: true, opacity: 0.9, twinkle: true },
  trail_sao: { color: '#ffe08a', size: 0.18, add: true, opacity: 1, twinkle: true },
};

function lotusRing(color, own) {
  const g = new THREE.Group();
  const m = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.8, roughness: 0.4, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
  own.push(m);
  for (let k = 0; k < 2; k++) for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + k * 0.3, R = 0.75 - k * 0.25;
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 6, 0, Math.PI), m); p.scale.set(0.7, 1.3, 0.35);
    p.position.set(Math.cos(a) * R, 0.06, Math.sin(a) * R); p.rotation.set(-1.15 + k * 0.4, -a + Math.PI / 2, 0); g.add(p);
  }
  return g;
}

export function createGiatri(wx, skins = {}) {
  const info = WX_GIATRI[wx] || WX_GIATRI.火;
  const AS = AURA_SKIN[skins.aura] || null, TS = TRAIL_SKIN[skins.trail] || null;
  const color = new THREE.Color(AS?.color || info.color);
  const obj = new THREE.Group(); obj.name = 'giatri';
  const add = (o) => { obj.add(o); return o; };
  const own = []; // material/texture RIÊNG instance này (texture cache soft()/petal() dùng chung — không đụng)

  // hào quang dưới chân
  const auraMat = new THREE.MeshBasicMaterial({ color, map: soft(), transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending });
  own.push(auraMat);
  const aura = add(new THREE.Mesh(new THREE.CircleGeometry(1.1, 40), auraMat));
  aura.rotation.x = -Math.PI / 2; aura.position.y = 0.04;
  const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  own.push(ringMat);
  const ring = add(new THREE.Mesh(new THREE.RingGeometry(0.95, 1.05, 48), ringMat));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05;
  // đĩa trang trí của skin (bát quái / sen vàng)
  let disc = null;
  if (AS?.disc === 'batquai') {
    const lt = TX.luopanTex({ transparent: true }); lt.userData.hqOwn = true; own.push(lt); // texture riêng mỗi instance
    const dm = new THREE.MeshBasicMaterial({ map: lt, color, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending });
    own.push(dm);
    disc = add(new THREE.Mesh(new THREE.CircleGeometry(1.35, 64), dm));
    disc.rotation.x = -Math.PI / 2; disc.position.y = 0.06;
  } else if (AS?.disc === 'sen') { disc = add(lotusRing(AS.color, own)); }

  // linh khí
  const NM = AS?.n || 26;
  const mg = new THREE.BufferGeometry(); mg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(NM * 3), 3));
  const moteMat = new THREE.PointsMaterial({ color, size: AS?.size || (wx === '金' ? 0.13 : 0.18), map: AS?.tex === 'petal' ? petal() : soft(), transparent: true, depthWrite: false, blending: AS && !AS.add ? THREE.NormalBlending : THREE.AdditiveBlending });
  own.push(moteMat);
  const motes = add(new THREE.Points(mg, moteMat));
  motes.frustumCulled = false;
  // tia sét (lôi quang)
  let bolts = null;
  if (AS?.bolts) {
    const bg = new THREE.BufferGeometry(); bg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3 * 8 * 2 * 3), 3));
    const bm = new THREE.LineBasicMaterial({ color: '#d9c4ff', transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    own.push(bm);
    bolts = add(new THREE.LineSegments(bg, bm));
    bolts.frustumCulled = false;
  }

  // vệt sáng (lịch sử vị trí thế giới — thêm vào cảnh riêng, không theo nhân vật)
  const NT = 40;
  const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(NT * 3), 3));
  const trailMat = new THREE.PointsMaterial({ color: TS?.color || color, size: TS?.size || 0.35, map: TS?.tex === 'petal' ? petal() : soft(), transparent: true, opacity: TS?.opacity ?? 0.7, depthWrite: false, blending: TS && !TS.add ? THREE.NormalBlending : THREE.AdditiveBlending });
  own.push(trailMat);
  const trail = new THREE.Points(tg, trailMat);
  trail.frustumCulled = false; trail.name = 'giatri-trail';
  const hist = [];

  // pháp quang sau lưng
  const haloMat = new THREE.MeshBasicMaterial({ color, map: soft(), transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  own.push(haloMat);
  const halo = add(new THREE.Mesh(new THREE.CircleGeometry(0.9, 40), haloMat)); halo.position.set(0, 1.75, -0.28);
  const haloRing = add(new THREE.Mesh(new THREE.RingGeometry(0.8, 0.86, 48), ringMat)); haloRing.position.copy(halo.position);

  // ngự vật: skin Tàng Y Các hoặc kiếm bay mặc định + mây
  const fly = add(new THREE.Group());
  const mount = skins.mount && skins.mount !== 'kiem' ? buildMount(skins.mount) : null;
  if (mount) fly.add(mount);
  else {
    loadModel('flying_sword').then((g) => {
      if (!g) return;
      const s = g.scene.clone(true);
      // bản clone chia sẻ geometry/material với GLB trong cache assets.js → đánh dấu để
      // disposeObject KHÔNG hủy hộ (cache sở hữu chúng)
      s.traverse((o) => { if (o.geometry) o.geometry.userData.hqShared = true; });
      const b = new THREE.Box3().setFromObject(s); const sz = b.getSize(new THREE.Vector3());
      s.scale.setScalar(1.9 / Math.max(sz.x, sz.z, 0.01));
      s.rotation.y = sz.x > sz.z ? Math.PI / 2 : 0;
      s.position.y = -0.05;
      fly.add(s);
    });
    const cloudMat = new THREE.MeshBasicMaterial({ color: '#ffffff', map: soft(), transparent: true, opacity: 0.55, depthWrite: false });
    own.push(cloudMat);
    for (let i = 0; i < 6; i++) { const c = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), cloudMat); c.rotation.x = -Math.PI / 2; c.position.set(Math.cos(i) * 0.5, -0.12, Math.sin(i * 1.3) * 0.7); fly.add(c); }
  }
  const flyGlowMat = new THREE.MeshBasicMaterial({ color, map: soft(), transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending });
  own.push(flyGlowMat);
  const flyGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.4), flyGlowMat);
  flyGlow.rotation.x = -Math.PI / 2; flyGlow.position.y = -0.1; fly.add(flyGlow);

  let on = new Set();
  const P = new THREE.Vector3();
  const moteFn = AS?.mote || MOTE[wx] || MOTE.火;
  let dead = false;
  return {
    obj, trail,
    // dọn GPU theo instance: geometry thủ công + material/texture trong `own`
    // (kiếm bay GLB dùng chung cache — đã đánh dấu hqShared, không bị hủy)
    dispose() {
      if (dead) return; dead = true;
      disposeObject(obj); disposeObject(trail);
      for (const x of own) x.dispose();
    },
    // ids: gia trì đã mở theo cấp (progress.js); skin đã mặc thì luôn hiện
    set(ids) {
      on = new Set(ids);
      if (AS) { on.add('aura'); on.add('motes'); }
      if (TS) on.add('trail');
    },
    update(dt, t, { moving = false, flying = false, world = null } = {}) {
      aura.visible = ring.visible = on.has('aura') && !flying;
      if (aura.visible) { const k = 1 + Math.sin(t * 2.2) * 0.06; aura.scale.setScalar(k); auraMat.opacity = 0.45 + Math.sin(t * 2.2) * 0.15; ring.rotation.z = t * 0.4; }
      if (disc) { disc.visible = aura.visible; if (AS.disc === 'batquai') disc.rotation.z = t * 0.35; else disc.scale.setScalar(0.85 + Math.sin(t * 1.4) * 0.15); }
      motes.visible = on.has('motes');
      if (motes.visible) {
        const arr = mg.attributes.position.array;
        for (let i = 0; i < NM; i++) { moteFn(P, t, i); arr[i * 3] = P.x; arr[i * 3 + 1] = P.y; arr[i * 3 + 2] = P.z; }
        mg.attributes.position.needsUpdate = true;
      }
      if (bolts) {
        bolts.visible = motes.visible && Math.sin(t * 7.3) > 0.2;
        if (bolts.visible) {
          const a = bolts.geometry.attributes.position.array; let k = 0;
          for (let b = 0; b < 3; b++) {
            const ang = t * 3 + b * 2.1; let x = Math.cos(ang) * 0.6, y = 2.2, z = Math.sin(ang) * 0.6;
            for (let s = 0; s < 8; s++) { const nx = x + (Math.random() - 0.5) * 0.25, ny = y - 0.26, nz = z + (Math.random() - 0.5) * 0.25; a.set([x, y, z, nx, ny, nz], k); k += 6; x = nx; y = ny; z = nz; }
          }
          bolts.geometry.attributes.position.needsUpdate = true;
        }
      }
      halo.visible = haloRing.visible = on.has('halo');
      if (halo.visible) { haloMat.opacity = 0.4 + Math.sin(t * 1.3) * 0.12; haloRing.rotation.z = -t * 0.3; }
      fly.visible = flying;
      if (flying) { flyGlow.material.opacity = 0.45 + Math.sin(t * 6) * 0.15; mount?.userData.animate?.(t); }
      // vệt sáng theo vị trí thế giới
      trail.visible = on.has('trail') && (moving || flying);
      if (TS?.twinkle) trailMat.opacity = 0.6 + Math.sin(t * 14) * 0.35;
      if (world) {
        hist.unshift(world.clone()); if (hist.length > NT) hist.length = NT;
        const arr = tg.attributes.position.array;
        for (let i = 0; i < NT; i++) { const h = hist[Math.min(i, hist.length - 1)]; arr[i * 3] = h.x; arr[i * 3 + 1] = h.y + (TS ? 0.15 : 0.9) + (flying ? -0.5 : 0); arr[i * 3 + 2] = h.z; }
        tg.attributes.position.needsUpdate = true;
      }
    },
  };
}
