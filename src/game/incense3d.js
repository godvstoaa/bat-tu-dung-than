// ============================================================================
//  LƯ HƯƠNG CHUNG (3D) — 1 lư lớn (gian «huong», models.incenseBurner) + 8 lư nhỏ quanh Đại Đỉnh (court.js › BURNERS).
//  Nhang vẽ bằng InstancedMesh: mỗi người thắp = 3 nén, cắm theo xoắn ốc vàng trong mặt cát; nén cháy ngắn dần theo giờ.
//  Nguồn dữ liệu: hương chung của phòng (net.incense — máy chủ chọn lư, protocol.pickBurner) + nhang của chính mình
//  khi chưa có máy chủ (chơi một mình / mất mạng). Khói, ánh lửa dày theo số nén đang cháy.
// ============================================================================
import * as THREE from 'three';
import { BURNERS } from './court.js';
import { BURNER_CAP, INCENSE_MS } from './protocol.js';

const GOLD = 2.399963; // góc vàng (rad)
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/** lư nhỏ: bệ đá + lư đồng ba chân, mặt cát ở y ≈ 1,02 (gốc toạ độ = tâm chân bệ) */
function smallBurner(m) {
  const g = new THREE.Group();
  const mk = (geo, mat, x, y, z, rot) => { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); if (rot) o.rotation.set(...rot); o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
  mk(new THREE.BoxGeometry(0.9, 0.12, 0.9), m.stone, 0, 0.06, 0);
  mk(new THREE.CylinderGeometry(0.3, 0.36, 0.5, 8), m.stoneDark, 0, 0.37, 0);
  mk(new THREE.CylinderGeometry(0.38, 0.38, 0.06, 8), m.gold, 0, 0.65, 0);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
    mk(new THREE.CylinderGeometry(0.035, 0.025, 0.18, 6), m.bronze, Math.cos(a) * 0.2, 0.76, Math.sin(a) * 0.2, [Math.sin(a) * 0.2, 0, Math.cos(a) * -0.2]);
  }
  const prof = [[0.001, 0.0], [0.22, 0.02], [0.3, 0.1], [0.33, 0.2], [0.3, 0.3], [0.32, 0.33], [0.28, 0.34], [0.25, 0.29], [0.001, 0.29]];
  mk(new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), 20), m.bronze, 0, 0.73, 0);
  for (const sx of [-1, 1]) mk(new THREE.TorusGeometry(0.08, 0.02, 6, 12, Math.PI * 1.2), m.bronze, sx * 0.33, 1.08, 0, [0, Math.PI / 2, sx > 0 ? -0.3 : Math.PI + 0.3]);
  mk(new THREE.CylinderGeometry(0.26, 0.26, 0.015, 16), new THREE.MeshStandardMaterial({ color: '#8d8174', roughness: 1 }), 0, 1.02, 0);
  return g;
}

/**
 * @param scene     three.Scene
 * @param mats      MD.materials()
 * @param mainTop   Vector3 thế giới: tâm mặt cát lư lớn
 * @param merge     MD.mergeStatic
 */
export function createIncense(scene, mats, { mainTop, merge }) {
  const root = new THREE.Group(); root.name = 'incense'; scene.add(root);
  const burners = BURNERS.map((b, k) => {
    let top;
    if (b.main) top = mainTop.clone();
    else {
      const g = smallBurner(mats); g.position.set(b.x, 0, b.z); g.rotation.y = b.ry || 0; g.userData.station = 'huong';
      merge?.(g); root.add(g);
      top = new THREE.Vector3(b.x, 1.03, b.z);
    }
    const cap = BURNER_CAP[k] * 3, sandR = b.main ? 0.4 : 0.24, len = b.main ? 0.8 : 0.52;
    const stickGeo = new THREE.CylinderGeometry(0.009, 0.009, 1, 5); stickGeo.translate(0, 0.5, 0);
    const sticks = new THREE.InstancedMesh(stickGeo, mats.stick, cap);
    const tips = new THREE.InstancedMesh(new THREE.SphereGeometry(0.018, 6, 4), mats.ember, cap);
    sticks.count = 0; tips.count = 0; sticks.frustumCulled = false; tips.frustumCulled = false; sticks.castShadow = false;
    root.add(sticks, tips);
    const light = new THREE.PointLight('#ff7a2f', 0, b.main ? 4 : 2.5, 2); light.position.copy(top).add(new THREE.Vector3(0, 0.5, 0)); root.add(light);
    return { k, top, cap, sandR, len, sticks, tips, light, n: 0, tipPos: [] };
  });
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), S = new THREE.Vector3(), P = new THREE.Vector3();
  let last = 0, total = 0;

  /**
   * entries: [{ k, at }] hương đang cháy (giờ máy này). Gọi mỗi khung; tự giãn nhịp khi người chơi ở xa.
   * Trả số nén đang cháy (cho khói / âm thanh).
   */
  function update(entries, now, t, near = true) {
    if (!near) { if (total) { for (const b of burners) { b.sticks.count = 0; b.tips.count = 0; b.light.intensity = 0; b.tipPos.length = 0; } total = 0; } return 0; }
    if (now - last < 120) { for (const b of burners) if (b.n) b.light.intensity = Math.min(2.4, 0.5 + b.n * 0.06) + Math.sin(t * 7 + b.k) * 0.15; return total; }
    last = now; total = 0;
    const per = burners.map(() => []);
    for (const e of entries) if (per[e.k] && now - e.at < INCENSE_MS && now >= e.at - 5000) per[e.k].push(e);
    for (const b of burners) {
      const list = per[b.k].sort((a, c) => a.at - c.at).slice(0, b.cap / 3);
      let i = 0; b.tipPos.length = 0;
      for (let j = 0; j < list.length; j++) {
        const p = Math.min(1, Math.max(0, (now - list[j].at) / INCENSE_MS));
        const l = b.len * (0.22 + 0.78 * (1 - p));
        for (let s = 0; s < 3; s++, i++) {
          const r = b.sandR * 0.88 * Math.sqrt((i + 0.5) / b.cap), th = i * GOLD;
          const tilt = (hash(i + b.k * 97) - 0.5) * 0.22, lean = (hash(i * 3.1 + b.k) - 0.5) * 0.22;
          E.set(lean, 0, tilt); Q.setFromEuler(E);
          P.set(b.top.x + Math.cos(th) * r, b.top.y, b.top.z + Math.sin(th) * r);
          M.compose(P, Q, S.set(1, l, 1)); b.sticks.setMatrixAt(i, M);
          const tip = new THREE.Vector3(0, l, 0).applyQuaternion(Q).add(P);
          M.compose(tip, Q, S.set(1, 1, 1)); b.tips.setMatrixAt(i, M);
          b.tipPos.push(tip);
        }
      }
      b.n = i; b.sticks.count = i; b.tips.count = i;
      b.sticks.instanceMatrix.needsUpdate = true; b.tips.instanceMatrix.needsUpdate = true;
      b.light.intensity = i ? Math.min(2.4, 0.5 + i * 0.06) : 0;
      total += i;
    }
    return total;
  }
  /** đầu nén ngẫu nhiên đang cháy (toạ độ thế giới) — cho khói */
  function randomTip() {
    if (!total) return null;
    let r = Math.floor(Math.random() * total);
    for (const b of burners) { if (r < b.tipPos.length) return b.tipPos[r]; r -= b.tipPos.length; }
    return null;
  }
  return { root, update, randomTip, burners, get total() { return total; } };
}
