// DÃY NHÀ PHỐ AAA Nội Thành — nguồn dữ liệu DUY NHẤT cho landmarks.js (đặt nhà) và script kiểm
// placement (_neo_tmp/check-streethouses.mjs). Bài học 2026-11-14: check hardcode biến thể
// sai ở 10/11 vị trí (runtime giải rng(77) ra a1,a1,c2,c2,c2,a1,b2,b1,b2,b1,a2, check lại ghi
// c2,b2,a2,a1,b1,c1,a1,b2,c2,b1,a2) → «OK: 11 nhà» chứng nhận nhầm bố cục; đối chiếu bằng
// biến thể thật (_neo_tmp/verify-street-actual.mjs) mới lộ 1 vi phạm. Từ đây mọi phía suy ra từ
// CÙNG streetHouses() — đổi hạt giống / vị trí thì check tự theo, không thể lệch nữa.
// File không kéo three/DOM → node import trực tiếp để kiểm.
import { rng } from './npc.js';
import * as BQ from './batquai.js';

// bbox đo GLB 2026-11-14 (accessor quantized ±32767 × node.scale — _neo_tmp/measure-glb.mjs):
// [id, w (mặt tiền), d (sâu), h (đỉnh mái), doorX] — doorX = tâm cửa chính theo trục X cục bộ (m),
// dùng khoét lối vào đúng CHỖ CỬA THẬT thay vì khoét giữa mặt tiền:
//   nhóm A: cửa gian giữa x=0 (gen_lib_house_a.py:63 BAY_C=(-3.6, 0, 3.6)) — khoét giữa đúng;
//   nhóm B: hai bộ cửa ±1,72 (gen_lib_house_b.py:283) — khoét tâm 0 vẫn đè mép hai cửa (chấp nhận);
//   nhóm C: cửa đơn 1,4 m gian trái x=−1,8 (gen_lib_house_c.py:167 DR_X=-1.8, DR_W=1.4) —
//           khoét tại 0 để lại 0,3 m tường đặc cạnh cửa thật (lỗi «chui QUA TƯỜNG cạnh cửa»).
export const AAA_SPECS = [
  ['lib_lib_house_a2', 11.12, 8.06, 8.0, 0],    // nhà 2 tầng 3 gian — luật 11,0×8,0×8,0
  ['lib_lib_house_a1', 11.12, 7.19, 4.6, 0],    // nhà 1 tầng 3 gian — luật 11,0×7,0×4,6
  ['lib_lib_house_b2', 7.38, 8.02, 7.98, 0],    // nhà khá 2 gian 2 tầng — 7,4×8,0×8,0
  ['lib_lib_house_b1', 7.38, 7.02, 4.58, 0],    // nhà khá 2 gian 1 tầng — 7,4×7,0×4,6
  ['lib_house_c2', 7.2, 6.01, 6.5, -1.8],       // nhà nghèo 2 gian gác lửng — 7,2×6,0×6,4
  ['lib_house_c1', 7.2, 5.98, 4.1, -1.8],       // nhà nghèo 2 gian 1 tầng — 7,2×6,0×4,0
];
// vị trí dãy phố: vành ngoài Càn/Tốn theo (u, v) khung cung + trục Đông–Tây Chấn/Đoài.
const AAA_STREETS = [
  ['qian', 124, 60], ['qian', 124, -60], ['xun', 127, 70], ['xun', 118, -56],
  [70, 16], [-70, 16], [112, 15], [145, 16], [-145, 16], [145, -16], [-145, -16],
];
// Hạt giống dãy phố — ĐÃ ĐỔI 77 → 79 (2026-11-14, vá audit): với 77, vị trí qian(124,−60) bốc
// trúng a1 (11,12 m mặt tiền) đè nhà vườn Đoài — vi phạm chỉ lộ ra khi check bắt đầu suy biến thể
// đúng từ rng thay vì hardcode (bản hardcode cũ ghi nhầm b2 ở đó nên «OK» giả). Seed 79: 0 vi phạm,
// đủ 6 biến thể trộn (a2,b1,c2,c2,a2,c1,a2,a1,b2,b1,c2) — kiểm _neo_tmp/check-streethouses.mjs.
// Nếu sau này check phạt vị trí nào (đè công trình/đường) thì ĐỔI SỐ NÀY rồi chạy lại check —
// đừng sửa tay biến thể ở nơi khác.
export const STREET_SEED = 79;
export function streetHouses(seed = STREET_SEED) {
  const r = rng(seed); // bố cục ổn định mỗi phiên
  const out = [];
  AAA_STREETS.forEach((s, i) => {
    const spec = AAA_SPECS[(i + Math.floor(r() * 3)) % AAA_SPECS.length]; // luân phiên + xê dịch: đủ ≥ 2 biến thể
    if (typeof s[0] === 'string') { const g = BQ.GUA.find((q) => q.id === s[0]), w = BQ.toWorld(g, s[1], s[2]); out.push({ spec, x: w.x, z: w.z, ry: BQ.faceAvenue(g, s[2]) }); }
    else out.push({ spec, x: s[0], z: s[1], ry: s[1] > 0 ? Math.PI : 0 }); // mặt tiền (+Z) hướng về đường z = 0
  });
  return out;
}
