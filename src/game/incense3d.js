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

/** lư nhỏ: bệ đá + trụ đá + đĩa vàng; lư đồng ba chân là model «cauldron» (nhân bản một lượt vẽ cho cả 8 — createIncense).
 *  Mặt cát ở SMALL.base + SMALL.height × 0,72 (gốc toạ độ = tâm chân bệ). */
const SMALL = { base: 0.68, height: 0.62, sand: 0.72, sandR: 0.17 };
function smallBurner(m) {
  const g = new THREE.Group();
  const mk = (geo, mat, x, y, z) => { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
  mk(new THREE.BoxGeometry(0.9, 0.12, 0.9), m.stone, 0, 0.06, 0);
  mk(new THREE.CylinderGeometry(0.3, 0.36, 0.5, 8), m.stoneDark, 0, 0.37, 0);
  mk(new THREE.CylinderGeometry(0.38, 0.38, 0.06, 8), m.gold, 0, 0.65, 0);
  mk(new THREE.CylinderGeometry(SMALL.sandR, SMALL.sandR, 0.015, 16), new THREE.MeshStandardMaterial({ color: '#8d8174', roughness: 1 }), 0, SMALL.base + SMALL.height * SMALL.sand, 0);
  return g;
}

/**
 * @param scene     three.Scene
 * @param mats      MD.materials()
 * @param mainTop   Vector3 thế giới: tâm mặt cát lư lớn
 * @param merge     MD.mergeStatic
 */
export function createIncense(scene, mats, { mainTop, merge, instanceModel }) {
  const root = new THREE.Group(); root.name = 'incense'; scene.add(root);
  const burners = BURNERS.map((b, k) => {
    let top;
    if (b.main) top = mainTop.clone();
    else {
      const g = smallBurner(mats); g.position.set(b.x, 0, b.z); g.rotation.y = b.ry || 0; g.userData.station = 'huong';
      merge?.(g); root.add(g);
      top = new THREE.Vector3(b.x, SMALL.base + SMALL.height * SMALL.sand + 0.01, b.z);
    }
    const cap = BURNER_CAP[k] * 3, sandR = b.main ? 0.4 : SMALL.sandR, len = b.main ? 0.8 : 0.52;
    const stickGeo = new THREE.CylinderGeometry(0.009, 0.009, 1, 5); stickGeo.translate(0, 0.5, 0);
    const sticks = new THREE.InstancedMesh(stickGeo, mats.stick, cap);
    const tips = new THREE.InstancedMesh(new THREE.SphereGeometry(0.018, 6, 4), mats.ember, cap);
    sticks.count = 0; tips.count = 0; sticks.frustumCulled = false; tips.frustumCulled = false; sticks.castShadow = false;
    root.add(sticks, tips);
    const light = new THREE.PointLight('#ff7a2f', 0, b.main ? 4 : 2.5, 2); light.position.copy(top).add(new THREE.Vector3(0, 0.5, 0)); root.add(light);
    return { k, top, cap, sandR, len, sticks, tips, light, n: 0, tipPos: [] };
  });
  // lư đồng ba chân của 8 lư nhỏ: một InstancedMesh (8 × 8k tam giác, 1 lượt vẽ)
  instanceModel?.(root, 'cauldron', BURNERS.filter((b) => !b.main).map((b) => ({ x: b.x, y: SMALL.base, z: b.z, s: SMALL.height, ry: (b.ry || 0) + Math.PI / 2 }))).catch(() => {});
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
