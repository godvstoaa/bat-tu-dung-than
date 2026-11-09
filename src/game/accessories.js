// ============================================================================
//  PHỤ KIỆN 3D (Tàng Y Các — cosmetics.js): mũ/trâm, sau lưng, cầm tay, ngự vật bay.
//  Dựng thủ công (không tốn credit Meshy). Phụ kiện KHÔNG gắn con vào xương (rig Meshy có tỉ lệ 0,01
//  và trục lạ) mà bám theo vị trí thế giới của xương mỗi khung hình, hướng theo hướng nhân vật:
//    đầu → xương Head · lưng → Spine02 · tay → RightHand.
//  createOutfit(scene) → { set(equipped), update(ch, heading, t, { night }), group }
//  buildMount(id) → Group (ngự vật dưới chân khi bay; effects.js dùng)
// ============================================================================
import * as THREE from 'three';
import * as TX from './textures.js';

const std = (o) => new THREE.MeshStandardMaterial(o);
const M = {};
function mats() {
  if (M.ok) return M;
  Object.assign(M, {
    gold: std({ color: '#e0b24a', metalness: 0.85, roughness: 0.28 }),
    silver: std({ color: '#dfe4ea', metalness: 0.9, roughness: 0.22 }),
    jade: std({ color: '#5fbf9a', roughness: 0.18, metalness: 0.1, emissive: '#1d5a44', emissiveIntensity: 0.25 }),
    blueJade: std({ color: '#5aa0e0', roughness: 0.18, emissive: '#1b3a66', emissiveIntensity: 0.3 }),
    wood: std({ color: '#8a4e2c', roughness: 0.7 }),
    peach: std({ color: '#b5653b', roughness: 0.6 }),
    bamboo: std({ color: '#7fae5a', roughness: 0.5 }),
    straw: std({ color: '#cdb06c', roughness: 0.85, side: THREE.DoubleSide }),
    veil: std({ color: '#f4f1ea', roughness: 0.9, transparent: true, opacity: 0.45, side: THREE.DoubleSide, depthWrite: false }),
    leaf: std({ color: '#4f9a48', roughness: 0.6, side: THREE.DoubleSide }),
    red: std({ color: '#b8261a', roughness: 0.55 }),
    paper: std({ color: '#c8402e', roughness: 0.8, side: THREE.DoubleSide }),
    purple: std({ color: '#6a2f86', roughness: 0.4, metalness: 0.2 }),
    white: std({ color: '#f6f4ee', roughness: 0.7, side: THREE.DoubleSide }),
    black: std({ color: '#1c1a1c', roughness: 0.7, side: THREE.DoubleSide }),
    lotus: std({ color: '#f7b5c8', roughness: 0.5, emissive: '#ff8fb0', emissiveIntensity: 0.25, side: THREE.DoubleSide }),
    lotusGold: std({ color: '#ffd77a', roughness: 0.3, metalness: 0.5, emissive: '#ffb030', emissiveIntensity: 0.6, side: THREE.DoubleSide }),
    fire: new THREE.MeshBasicMaterial({ color: '#ff8a2a', transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    fire2: new THREE.MeshBasicMaterial({ color: '#ffd25a', transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    glow: new THREE.MeshBasicMaterial({ color: '#ffe3a0', transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
    cloud: std({ color: '#ffffff', roughness: 1, emissive: '#cfd8ff', emissiveIntensity: 0.35 }),
    lantern: std({ color: '#d02a18', emissive: '#ff6a2a', emissiveIntensity: 1.4, roughness: 0.6 }),
  });
  M.luopan = std({ map: TX.luopanTex(), roughness: 0.3, metalness: 0.3 });
  M.ok = true;
  return M;
}
const mesh = (geo, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); o.rotation.set(rx, ry, rz); o.castShadow = true; return o; };
const lathe = (pts, seg = 20) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);

// lông vũ cong (ống mỏng dọc đường cong)
function feather(len, bend, r, mat) {
  const pts = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(new THREE.Vector3(0, t * len, -bend * t * t)); }
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, r, 5), mat);
}
// cánh: n lông phẳng xoè từ gốc
function wing(n, len, w, matA, matB, sx) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) {
    const L = len * (0.55 + 0.45 * Math.sin(((i + 1) / (n + 1)) * Math.PI));
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, L), i % 3 === 2 && matB ? matB : matA);
    p.geometry.translate(0, L / 2, 0);
    p.rotation.z = -sx * (0.25 + (i / n) * 1.25);
    p.position.set(sx * i * 0.02, 0, -i * 0.004);
    g.add(p);
  }
  return g;
}
// thanh kiếm (lưỡi + chuôi + đốc), dọc trục y
function sword(len, metal, hilt, scab = null) {
  const g = new THREE.Group();
  if (scab) g.add(mesh(new THREE.BoxGeometry(0.07, len * 0.78, 0.035), scab, 0, len * 0.39, 0));
  else g.add(mesh(new THREE.BoxGeometry(0.05, len * 0.78, 0.012), metal, 0, len * 0.39, 0));
  g.add(mesh(new THREE.BoxGeometry(0.2, 0.035, 0.05), M.gold, 0, len * 0.78 + 0.02, 0));
  g.add(mesh(new THREE.CylinderGeometry(0.018, 0.02, len * 0.2, 8), hilt, 0, len * 0.9, 0));
  g.add(mesh(new THREE.SphereGeometry(0.03, 8, 6), M.gold, 0, len + 0.01, 0));
  return g;
}

// ---------------------------------------------------------------------------
// Mũ · trâm (gốc = đỉnh búi tóc, +z = trước mặt)
// ---------------------------------------------------------------------------
const HEAD = {
  tram_go: () => { const g = new THREE.Group(); g.add(mesh(new THREE.CylinderGeometry(0.008, 0.006, 0.26, 6), M.peach, 0, -0.04, 0, 0, 0, Math.PI / 2 - 0.2)); g.add(mesh(new THREE.SphereGeometry(0.022, 8, 6), M.peach, 0.13, -0.015, 0)); return g; },
  dao_quan: () => { const g = new THREE.Group(); g.add(mesh(lathe([[0.001, 0], [0.06, 0], [0.065, 0.05], [0.045, 0.085], [0.001, 0.09]]), M.silver, 0, -0.03, 0)); g.add(mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.2, 6), M.silver, 0, 0.02, 0, 0, 0, Math.PI / 2)); return g; },
  quan_la: () => { const g = new THREE.Group(); g.add(mesh(new THREE.TorusGeometry(0.09, 0.01, 6, 24), M.bamboo, 0, -0.03, 0, Math.PI / 2)); for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; g.add(mesh(new THREE.PlaneGeometry(0.035, 0.09), M.leaf, Math.cos(a) * 0.09, 0.0, Math.sin(a) * 0.09, -0.3, -a + Math.PI / 2, 0)); } return g; },
  kim_quan: () => {
    const g = new THREE.Group();
    g.add(mesh(lathe([[0.001, 0], [0.075, 0], [0.085, 0.06], [0.06, 0.1], [0.001, 0.1]]), M.gold, 0, -0.04, 0));
    g.add(mesh(new THREE.SphereGeometry(0.025, 8, 6), std({ color: '#e0302a', emissive: '#a01010', emissiveIntensity: 0.5 }), 0, 0.02, 0.07));
    const fm = std({ color: '#c49a5a', roughness: 0.6 });
    for (const sx of [-1, 1]) { const f = feather(1.25, 0.55, 0.012, fm); f.position.set(sx * 0.05, 0.03, -0.02); f.rotation.set(-0.25, 0, -sx * 0.32); f.userData.sway = sx; g.add(f); }
    g.userData.animate = (t) => g.children.forEach((c) => { if (c.userData.sway) c.rotation.x = -0.25 + Math.sin(t * 1.6 + c.userData.sway) * 0.06; });
    return g;
  },
  dau_lap: () => {
    const g = new THREE.Group();
    g.add(mesh(new THREE.ConeGeometry(0.42, 0.16, 28, 1, true), M.straw, 0, 0.0, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.41, 0.42, 0.42, 28, 1, true), M.veil, 0, -0.29, 0));
    g.add(mesh(new THREE.TorusGeometry(0.42, 0.008, 4, 32), M.wood, 0, -0.08, 0, Math.PI / 2));
    return g;
  },
  tram_ngoc: () => {
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.008, 0.006, 0.24, 6), M.silver, 0, -0.03, 0, 0, 0, Math.PI / 2 - 0.35));
    g.add(mesh(new THREE.OctahedronGeometry(0.03, 0), M.blueJade, 0.12, 0.01, 0));
    const tas = new THREE.Group(); tas.position.set(0.12, -0.01, 0);
    for (let i = 0; i < 5; i++) tas.add(mesh(new THREE.SphereGeometry(0.011, 6, 4), i % 2 ? M.blueJade : M.silver, 0, -0.03 - i * 0.03, 0));
    g.add(tas); g.userData.animate = (t) => { tas.rotation.z = Math.sin(t * 2.2) * 0.25; };
    return g;
  },
  quan_sen: () => {
    const g = new THREE.Group();
    for (let k = 0; k < 2; k++) for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + k * 0.4;
      const p = mesh(new THREE.SphereGeometry(0.05, 10, 8, 0, Math.PI), M.lotusGold, Math.cos(a) * (0.05 - k * 0.02), -0.02 + k * 0.02, Math.sin(a) * (0.05 - k * 0.02), -0.5 - k * 0.3, -a + Math.PI / 2, 0);
      p.scale.set(0.8, 1.7, 0.5); g.add(p);
    }
    g.add(mesh(new THREE.SphereGeometry(0.025, 10, 8), M.glow, 0, 0.03, 0));
    return g;
  },
};

// ---------------------------------------------------------------------------
// Sau lưng (gốc = giữa lưng trên, +z = trước mặt → đồ nằm ở z âm)
// ---------------------------------------------------------------------------
const BACK = {
  kiem_go: () => { const s = sword(0.95, M.peach, M.red); s.position.set(-0.28, -0.42, -0.14); s.rotation.z = -0.6; const g = new THREE.Group(); g.add(s); return g; },
  kiem_moc: () => { const s = sword(1.0, M.silver, M.bamboo, M.bamboo); s.position.set(-0.3, -0.44, -0.15); s.rotation.z = -0.6; const g = new THREE.Group(); g.add(s); return g; },
  kiem_bao: () => { const g = new THREE.Group(); for (const sx of [-1, 1]) { const s = sword(1.05, M.silver, M.black, M.silver); s.position.set(sx * 0.3, -0.45, -0.15); s.rotation.z = sx * 0.55; g.add(s); } return g; },
  ho_lo: () => {
    const g = new THREE.Group();
    const h = mesh(lathe([[0.001, 0], [0.09, 0.03], [0.11, 0.1], [0.08, 0.17], [0.05, 0.2], [0.065, 0.25], [0.06, 0.31], [0.02, 0.34], [0.001, 0.35]], 22), M.purple, 0.2, -0.62, -0.16, 0, 0, 0.25);
    g.add(h); g.add(mesh(new THREE.TorusGeometry(0.052, 0.01, 6, 16), M.gold, 0.2 - 0.05, -0.62 + 0.2, -0.16, Math.PI / 2, 0, 0.25));
    g.add(mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.6, 4), M.red, 0.05, -0.3, -0.13, 0, 0, -0.5));
    return g;
  },
  o_giay: () => {
    const g = new THREE.Group(); const u = new THREE.Group();
    u.add(mesh(new THREE.CylinderGeometry(0.05, 0.075, 0.75, 16), M.paper, 0, 0.4, 0));
    for (let i = 0; i < 4; i++) u.add(mesh(new THREE.TorusGeometry(0.06 + i * 0.004, 0.006, 4, 16), M.wood, 0, 0.12 + i * 0.18, 0, Math.PI / 2));
    u.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.35, 6), M.wood, 0, -0.1, 0));
    u.add(mesh(new THREE.ConeGeometry(0.05, 0.1, 12), M.paper, 0, 0.82, 0));
    u.position.set(0.25, -0.45, -0.16); u.rotation.z = 0.55; g.add(u);
    return g;
  },
  canh_phuong: () => {
    const g = new THREE.Group(); const W = [];
    // clone riêng mỗi cánh: animate ghi opacity từng lông — nếu dùng M.fire/M.fire2 chung
    // thì mọi người mặc cánh phượng cùng nhấp nháy theo một người
    const fa = M.fire.clone(), fb = M.fire2.clone();
    fa.userData.hqOwn = true; fb.userData.hqOwn = true;
    for (const sx of [-1, 1]) { const w = new THREE.Group(); w.add(wing(9, 1.15, 0.16, fa, fb, sx)); w.position.set(sx * 0.08, -0.05, -0.18); w.userData.sx = sx; g.add(w); W.push(w); }
    g.userData.animate = (t) => W.forEach((w) => { w.rotation.y = w.userData.sx * (0.5 + Math.sin(t * 3.2) * 0.32); w.children[0].children.forEach((p, i) => { p.material.opacity = 0.55 + Math.sin(t * 9 + i) * 0.25; }); });
    return g;
  },
  canh_hac: () => {
    const g = new THREE.Group(); const W = [];
    for (const sx of [-1, 1]) { const w = new THREE.Group(); w.add(wing(11, 1.05, 0.13, M.white, M.black, sx)); w.position.set(sx * 0.08, -0.05, -0.17); w.userData.sx = sx; g.add(w); W.push(w); }
    g.userData.animate = (t) => W.forEach((w) => { w.rotation.y = w.userData.sx * (0.65 + Math.sin(t * 1.7) * 0.22); });
    return g;
  },
  phap_luan: () => {
    const g = new THREE.Group(); const R = new THREE.Group(); R.position.set(0, 0.05, -0.35); g.add(R);
    R.add(mesh(new THREE.TorusGeometry(0.62, 0.025, 8, 64), M.gold));
    R.add(mesh(new THREE.TorusGeometry(0.46, 0.012, 6, 48), M.gold));
    const lt = TX.luopanTex({ transparent: true }); lt.userData.hqOwn = true; // texture riêng mỗi instance
    const dm = new THREE.MeshBasicMaterial({ map: lt, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    dm.userData.hqOwn = true;
    const disc = mesh(new THREE.CircleGeometry(0.44, 48), dm);
    R.add(disc);
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; R.add(mesh(new THREE.SphereGeometry(0.04, 8, 6), M.glow, Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0)); }
    g.userData.animate = (t) => { R.rotation.z = t * 0.6; disc.rotation.z = -t * 0.9; };
    return g;
  },
};

// ---------------------------------------------------------------------------
// Cầm tay (gốc = lòng bàn tay phải)
// ---------------------------------------------------------------------------
const HAND = {
  quat_giay: () => {
    const g = new THREE.Group();
    const c = document.createElement('canvas'); c.width = 256; c.height = 128; const x = c.getContext('2d');
    x.fillStyle = '#efe3c4'; x.fillRect(0, 0, 256, 128); x.fillStyle = '#1b1514'; x.font = 'bold 84px serif'; x.textAlign = 'center'; x.fillText('道', 128, 110);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.userData.hqOwn = true; // canvas riêng mỗi instance
    const fm = std({ map: t, side: THREE.DoubleSide, roughness: 0.8 }); fm.userData.hqOwn = true;
    const f = mesh(new THREE.CircleGeometry(0.3, 24, Math.PI * 0.2, Math.PI * 0.6), fm, 0, 0.02, 0.05, 0, Math.PI / 2, 0);
    g.add(f); g.add(mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.3, 5), M.wood, 0, 0.1, 0.05));
    return g;
  },
  phat_tran: () => {
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.38, 8), M.wood, 0, 0.05, 0.04));
    g.add(mesh(new THREE.SphereGeometry(0.025, 8, 6), M.gold, 0, 0.25, 0.04));
    const tuft = new THREE.Group(); tuft.position.set(0, -0.14, 0.04); g.add(tuft);
    for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; const s = mesh(new THREE.PlaneGeometry(0.02, 0.5), M.white, Math.cos(a) * 0.015, -0.25, Math.sin(a) * 0.015, 0, a, 0); tuft.add(s); }
    g.userData.animate = (t) => { tuft.rotation.z = Math.sin(t * 2) * 0.12; tuft.rotation.x = Math.cos(t * 1.6) * 0.08; };
    return g;
  },
  /** remote: bản người chơi khác — KHÔNG đèn điểm thật (số PointLight động khiến three.js
   *  dịch lại shader toàn cảnh mỗi lần thêm/bớt), thay bằng mesh đèn phát sáng + sprite sáng. */
  den_long_tay: (remote = false) => {
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.5, 5), M.wood, 0, 0.0, 0.18, Math.PI / 2 - 0.4));
    const L = new THREE.Group(); L.position.set(0, 0.06, 0.42); g.add(L);
    L.add(mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.12, 4), M.black, 0, -0.06, 0));
    L.add(mesh(lathe([[0.001, -0.12], [0.06, -0.11], [0.09, -0.06], [0.095, 0], [0.09, 0.05], [0.06, 0.1], [0.001, 0.1]], 14), M.lantern, 0, -0.22, 0));
    if (!remote) {
      const pl = new THREE.PointLight('#ffa04a', 0, 7, 1.6); pl.position.set(0, -0.22, 0); L.add(pl);
      g.userData.light = pl;
    } else {
      const sm = new THREE.SpriteMaterial({ map: TX.softTex('rgba(255,190,110,1)', 'rgba(255,190,110,0)', 64), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
      sm.map.userData.hqOwn = true; sm.userData.hqOwn = true; // texture/material riêng mỗi instance
      const sp = new THREE.Sprite(sm); sp.position.set(0, -0.22, 0); sp.scale.setScalar(0.5); L.add(sp);
    }
    g.userData.animate = (t) => { L.rotation.x = Math.sin(t * 2.4) * 0.12; };
    return g;
  },
  la_ban_tay: () => { const g = new THREE.Group(); g.add(mesh(new THREE.CylinderGeometry(0.14, 0.15, 0.03, 24), M.gold, 0, 0.02, 0.1)); g.add(mesh(new THREE.CircleGeometry(0.13, 32), M.luopan, 0, 0.037, 0.1, -Math.PI / 2)); return g; },
  quat_long: () => {
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.22, 6), M.wood, 0, 0.02, 0.05));
    const f = new THREE.Group(); f.position.set(0, 0.14, 0.05); g.add(f);
    for (let i = 0; i < 13; i++) { const a = -0.9 + (i / 12) * 1.8; const p = mesh(new THREE.PlaneGeometry(0.07, 0.36), M.white, Math.sin(a) * 0.04, 0.17, 0, 0, Math.PI / 2, -a); p.geometry.translate(0, 0.0, 0); f.add(p); }
    g.userData.animate = (t) => { f.rotation.x = Math.sin(t * 1.4) * 0.15; };
    return g;
  },
};

// ---------------------------------------------------------------------------
// Dọn GPU theo instance. Quy ước quyền sở hữu:
//  - geometry thủ công trong accessories/effects là tự tạo mỗi lần dựng → được hủy;
//  - geometry/material/texture của GLB trong cache assets.js (và material dùng chung M.*,
//    texture cache của effects.js) KHÔNG được đánh dấu → không bao giờ bị hủy;
//  - texture/material tự tạo mỗi instance (canvas chữ, luopanTex mới, sprite đèn remote)
//    được đánh dấu userData.hqOwn = true để disposeObject hủy đúng chỗ.
// ---------------------------------------------------------------------------
export function disposeObject(root) {
  root.traverse((o) => {
    for (const m of [].concat(o.material || [])) {
      for (const k of Object.keys(m)) { const v = m[k]; if (v?.isTexture && v.userData?.hqOwn) v.dispose(); }
      if (m.userData?.hqOwn) m.dispose();
    }
    if (o.geometry && !o.geometry.userData.hqShared) o.geometry.dispose();
  });
}

// ---------------------------------------------------------------------------
// Ngự vật (dưới chân khi bay; gốc = lòng bàn chân, +z = hướng bay)
// ---------------------------------------------------------------------------
const MOUNT = {
  may: () => {
    const g = new THREE.Group();
    const r = TX.rng(5);
    for (let i = 0; i < 16; i++) { const s = mesh(new THREE.IcosahedronGeometry(0.22 + r() * 0.22, 1), M.cloud, (r() - 0.5) * 1.4, -0.15 - r() * 0.15, (r() - 0.5) * 2.0); s.scale.y = 0.6; g.add(s); }
    g.add(mesh(new THREE.TorusGeometry(0.75, 0.02, 4, 40), M.gold, 0, -0.12, 0, Math.PI / 2));
    g.userData.animate = (t) => g.children.forEach((c, i) => { c.position.y = (c.userData.y0 ??= c.position.y) + Math.sin(t * 2 + i) * 0.03; });
    return g;
  },
  ho_lo_bay: () => {
    const g = new THREE.Group();
    const h = mesh(lathe([[0.001, 0], [0.32, 0.1], [0.4, 0.38], [0.29, 0.62], [0.18, 0.72], [0.23, 0.9], [0.21, 1.1], [0.08, 1.22], [0.001, 1.24]], 26), M.purple, 0, -0.32, -0.6, Math.PI / 2, 0, 0);
    g.add(h);
    g.add(mesh(new THREE.TorusGeometry(0.19, 0.03, 6, 20), M.gold, 0, -0.32, 0.12, 0, 0, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.12, 12), M.gold, 0, -0.32, 0.66, Math.PI / 2, 0, 0));
    return g;
  },
  dai_sen: () => {
    const g = new THREE.Group();
    for (let k = 0; k < 3; k++) for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + k * 0.3, R = 0.7 - k * 0.2;
      const p = mesh(new THREE.SphereGeometry(0.22, 12, 8, 0, Math.PI), k ? M.lotus : M.lotusGold, Math.cos(a) * (R + 0.15), -0.32 + k * 0.04, Math.sin(a) * (R + 0.15), -1.25 + k * 0.3, -a + Math.PI / 2, 0);
      p.scale.set(0.75, 0.95, 0.4); g.add(p);
    }
    g.add(mesh(new THREE.CylinderGeometry(0.55, 0.5, 0.1, 24), M.lotusGold, 0, -0.06, 0));
    g.userData.animate = (t) => { g.rotation.y = t * 0.4; };
    return g;
  },
  hac: () => {
    const g = new THREE.Group(); const B = new THREE.Group(); B.position.y = -0.55; g.add(B);
    const body = mesh(new THREE.SphereGeometry(0.42, 16, 12), M.white); body.scale.set(0.9, 0.7, 1.7); B.add(body);
    const neck = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.1, 0.55), new THREE.Vector3(0, 0.55, 0.85), new THREE.Vector3(0, 0.95, 1.05)]), 12, 0.07, 6), M.white); B.add(neck);
    B.add(mesh(new THREE.SphereGeometry(0.1, 10, 8), M.white, 0, 0.98, 1.1));
    B.add(mesh(new THREE.SphereGeometry(0.05, 8, 6), std({ color: '#d02a1a' }), 0, 1.07, 1.1));
    B.add(mesh(new THREE.ConeGeometry(0.03, 0.32, 6), M.straw, 0, 0.95, 1.3, Math.PI / 2));
    B.add(mesh(new THREE.ConeGeometry(0.2, 0.5, 8), M.black, 0, 0.05, -0.85, -Math.PI / 2));
    const W = [];
    for (const sx of [-1, 1]) { const w = new THREE.Group(); const wg = wing(12, 1.7, 0.22, M.white, M.black, sx); wg.rotation.x = -Math.PI / 2; w.add(wg); w.position.set(sx * 0.3, 0.15, 0.1); w.userData.sx = sx; B.add(w); W.push(w); }
    g.userData.animate = (t) => { W.forEach((w) => { w.rotation.z = w.userData.sx * Math.sin(t * 2.6) * 0.45; }); B.position.y = -0.55 + Math.sin(t * 2.6) * 0.06; };
    return g;
  },
};
export const buildMount = (id) => (MOUNT[id] ? (mats(), MOUNT[id]()) : null);

// ---------------------------------------------------------------------------
// Bộ trang phục bám theo một nhân vật
// ---------------------------------------------------------------------------
const _p = new THREE.Vector3(), _q = new THREE.Quaternion(), _off = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0);
// điểm bám + độ lệch (theo khung nhân vật) — chỉnh theo dáng hero Meshy (cao 1,9 m, đầu to, búi tóc)
const ANCHOR = { head: ['Head', [0, 0.36, -0.03]], back: ['Spine02', [0, 0.16, -0.1]], hand: ['RightHand', [0, 0, 0]] };

export function createOutfit(scene, { remoteLight = false } = {}) {
  mats();
  const group = new THREE.Group(); group.name = 'outfit'; scene.add(group);
  const parts = { head: null, back: null, hand: null };
  const ids = { head: null, back: null, hand: null };
  return {
    group,
    get light() { return parts.hand?.userData.light || null; },
    set(equipped = {}) {
      for (const slot of ['head', 'back', 'hand']) {
        const id = equipped[slot] || null;
        if (ids[slot] === id) continue;
        if (parts[slot]) { disposeObject(parts[slot]); group.remove(parts[slot]); }
        const B = slot === 'head' ? HEAD : slot === 'back' ? BACK : HAND;
        parts[slot] = id && B[id] ? B[id](slot === 'hand' && remoteLight) : null; ids[slot] = id;
        if (parts[slot]) group.add(parts[slot]);
      }
    },
    /** ch: nhân vật (characters.js), heading: hướng (rad), sitting: đổi điểm bám tay khi ngồi */
    update(ch, heading, t, { night = 0, visible = true } = {}) {
      group.visible = visible && !!ch;
      if (!group.visible) return;
      _q.setFromAxisAngle(_up, heading);
      for (const slot of ['head', 'back', 'hand']) {
        const o = parts[slot]; if (!o) continue;
        const [bn, off] = ANCHOR[slot];
        const b = ch.bone(bn); if (!b) { o.visible = false; continue; }
        o.visible = true;
        b.getWorldPosition(_p);
        _off.set(off[0], off[1], off[2]).applyQuaternion(_q);
        o.position.copy(_p).add(_off);
        o.quaternion.copy(_q);
        o.userData.animate?.(t);
      }
      const L = parts.hand?.userData.light; if (L) L.intensity = 0.3 + night * 2.2;
    },
    // hủy geometry thủ công + material/texture riêng từng instance trước khi rời cảnh
    dispose() { disposeObject(group); scene.remove(group); },
  };
}

export const HAS_3D = (id) => !!(HEAD[id] || BACK[id] || HAND[id] || MOUNT[id]);
