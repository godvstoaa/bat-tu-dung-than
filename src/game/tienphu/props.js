// ============================================================================
//  ĐỒ GLB của tiên phủ (docs/TIEN-PHU-DOHOA-MANIFEST.md §2.2–2.4): đèn đá, đá tảng, hoa, bụi, nội thất pr_* …
//  Ghi theo toạ độ CỤC BỘ của một khung (nhóm phủ / nhóm tầng lầu) lúc dựng; build() đổi sang toạ độ THẾ GIỚI rồi nhân bản bằng
//  assets.instanceModel (bậc xa .vc2, cắt theo tầm nhìn / khoảng cách tính theo vị trí người chơi — cần toạ độ thế giới).
//  Nhóm noCollide: va chạm là hộp ẩn ở lớp «proxy» (tower3d.Acc) do nơi gọi thêm — khớp kích thước chân đồ.
// ============================================================================
import * as THREE from 'three';
import { instanceModel } from '../assets.js';

// kích thước khung bao chuẩn hoá của model (rộng / cao / sâu, đo bằng bảng ảnh kho — $TEMP/tpg) → hộp va chạm theo cỡ đặt
export const PROP_BOX = {
  pr_stonelantern: [0.87, 2, 0.75], pr_chair: [1.34, 1.99, 1.07], pr_chair_red: [0.98, 1.9, 0.98], pr_table_long: [1.9, 0.62, 0.9],
  pr_table_ming: [1.9, 1.32, 0.66], pr_table_round: [1.89, 0.58, 1.88], pr_teaset: [1.9, 0.62, 1.89], pr_cabinet: [1.45, 2, 0.77],
  pr_cabinet2: [1.38, 1.9, 1.06], pr_screen_antique: [2, 1.99, 0.24], pr_screen_blossom: [2, 1.99, 0.5], pr_vase_ming: [0.95, 1.9, 0.95],
  pr_jar_porcelain: [1.44, 1.9, 1.44], pr_vase_celadon: [0.9, 1.9, 0.9], pr_bed: [1.73, 1.99, 1.72], pr_fishbowl: [1.9, 1.66, 1.9],
  pr_pixiu: [1.15, 1.77, 1.9], lib_bonsai: [1.96, 1.78, 1.42], lib_lantern: [1.41, 1.9, 1.42], lib_lib_rock_boulder: [2.6, 1.7, 1.5],
};
/** cỡ thật (m) của món đặt theo fit: { w, h, d } */
export function propSize(id, s, fit = 'height') {
  const b = PROP_BOX[id] || [1, 1, 1], ref = fit === 'height' ? b[1] : fit === 'width' ? b[0] : Math.max(...b), k = s / ref;
  return { w: b[0] * k, h: b[1] * k, d: b[2] * k };
}

// tầm vẽ riêng (m): hoa cỏ ngoài tầm này chỉ còn vài điểm ảnh (đo fps 2026-11-17: −17 % khi vẽ tới 260 m)
const CUT = { lib_lib_flower_meadow: 70, lib_lib_shrub_under: 90, pr_teaset: 40 };
export class PropSet {
  /** frame: Object3D mà toạ độ ghi vào là cục bộ của nó · name: tên nhóm (gỡ lỗi / ẩn hiện) */
  constructor(frame, name) { this.frame = frame; this.group = new THREE.Group(); this.group.name = name; this.group.userData.noCollide = true; this.sets = new Map(); this.list = []; }
  /** id model · (x, y, z) cục bộ khung, y = mặt đặt · ry · s = cỡ theo fit ('height' | 'width') */
  add(id, x, y, z, ry, s, fit = 'height') {
    const k = `${id}|${fit}`; if (!this.sets.has(k)) this.sets.set(k, { id, fit, items: [] });
    const it = { x, y, z, ry, s }; this.sets.get(k).items.push(it); this.list.push({ id, fit, ...it });
    return propSize(id, s, fit);
  }
  get size() { return this.list.length; }
  /** nhân bản vào worldParent (không xoay / dời — nhóm gốc của cảnh). Trả Promise. */
  build(worldParent) {
    worldParent.add(this.group);
    if (!this.list.length) return Promise.resolve();
    this.frame.updateWorldMatrix(true, false);
    const q = new THREE.Quaternion(); this.frame.getWorldQuaternion(q); const yaw = new THREE.Euler().setFromQuaternion(q, 'YXZ').y;
    const v = new THREE.Vector3();
    this.world = [];
    const jobs = [];
    for (const { id, fit, items } of this.sets.values()) {
      const W = items.map((it) => { v.set(it.x, it.y, it.z); this.frame.localToWorld(v); const w = { x: v.x, y: v.y, z: v.z, ry: (it.ry || 0) + yaw, s: it.s }; this.world.push({ id, fit, ...w }); return w; });
      jobs.push(instanceModel(this.group, id, W, { fitKey: fit, cut: CUT[id] ?? null }).catch(() => null));
    }
    return Promise.all(jobs);
  }
}
