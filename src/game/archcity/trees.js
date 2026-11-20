// ============================================================================
//  CÂY THẬT CHO THÀNH (docs/CONG-TRINH-LAM-LAI-MANIFEST.md §2.3) — thay cây khối thô (cầu / nón: models.peachTree,
//  pineTree, bambooClump, archkit tree) bằng 24 model Meshy CC0 `lib_tp_*` của tiên phủ (3 cấp chi tiết, gió) qua
//  tienphu/bigtrees.plantBigTrees (chỉ import). Loài dùng ở thành: sakura (đào / anh đào), kuromatsu (tùng đen), thongcn
//  (du tùng), baichcn (trắc bách), hoe (hòe), lieutang (liễu), bachqua (ngân hạnh).
//  Va chạm: trụ thân theo bigProxy. Trả { group, update(px, pz), ready }.
// ============================================================================
import { plantBigTrees, bigProxy, BIG } from '../tienphu/bigtrees.js';
import { addSolidCircle } from '../obstacles.js';

/** list: [{ kind, x, z, s?, ry?, row? }] — s 0,85 → thấp nhất khoảng cao của loài, 1,15 → cao nhất */
export function cityTrees(parent, list, { solid = true } = {}) {
  const t = plantBigTrees(parent, list.map((it) => ({ s: 1, ...it })));
  if (solid) for (const it of list) { const p = bigProxy({ s: 1, ...it }); addSolidCircle(it.x, it.z, Math.max(0.35, p.r)); }
  return t;
}

// loài cỡ PHỐ (cây đường 4–11 m — cỡ cổ thụ của tiên phủ 17–30 m quá to cho vỉa hè): thêm khoá riêng vào bảng BIG lúc chạy
// (không sửa flora-spec.js của phiên tiên phủ). m = model lib_tp_* đã chọn bằng mắt (output/cay-look/m-big.png)
const STREET = {
  c_hoe: { m: 'hoe', H: [7, 10], r: 0.35, w: 0.95 }, c_du: { m: 'keyaki', H: [8, 11], r: 0.35, w: 0.8 },
  c_dao: { m: 'sakura', H: [4.5, 6], r: 0.25, w: 1.2 }, c_anhdao: { m: 'sakura', H: [5, 6.5], r: 0.25, w: 1.25 },
  c_phong: { m: 'keyaki', H: [5, 7], r: 0.3, w: 0.85 }, c_lieu: { m: 'lieutang', H: [6, 9], r: 0.4, w: 1.0 },
  c_tung: { m: 'kuromatsu', H: [5, 8], r: 0.3, w: 0.9 },
};
for (const [k, v] of Object.entries(STREET)) if (!BIG[k]) BIG[k] = v;
/** thay treeSet cũ của citydress3d (model lib_lib_tree_* thẻ lá phẳng vỡ hình): list [{ sp, x, z, ht }] → cây lib_tp_* cỡ phố */
export function streetTrees(parent, list) {
  const items = list.map((t) => { const b = STREET[`c_${t.sp}`] || STREET.c_hoe, k = Math.min(1, Math.max(0, (t.ht - b.H[0]) / (b.H[1] - b.H[0]))); return { kind: STREET[`c_${t.sp}`] ? `c_${t.sp}` : 'c_hoe', x: t.x, z: t.z, s: 0.85 + 0.3 * k }; });
  const t = plantBigTrees(parent, items);
  return { assign: (px, pz) => t.update(px, pz) };
}
