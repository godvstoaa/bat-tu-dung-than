// ============================================================================
//  CÔNG TRÌNH MỐC NỘI THÀNH (docs/CONG-TRINH-LAM-LAI-MANIFEST.md goal 1) — thay model Meshy bq_* (1 texture 1024 cho cả
//  công trình 20–24 m → 30–50 px/m, hình đúc chảy) bằng loại hình cung đình Thanh của bộ dựng tiên phủ (cnHall / cnLou,
//  hệ 《工程做法》: cột = 0,8 × gian giữa) + vật liệu lặp theo mét. Kích thước khớp khung `foot` trong batquai.js (không đè lô).
//  Bảo tháp (bq_pagoda, bq_library_pagoda) và đan lô (bq_furnace — đồ vật) chưa thay.
// ============================================================================
import { cnHall, cnLou, cnMats } from '../tienphu/arch/cn.js';
import { archMats, retex, consolidate } from './mats.js';

const H = (o) => ({ type: 'hall', frontDoors: 'all', ...o });
const LU = (o) => ({ type: 'lou', frontDoors: 'all', ...o });
// id model Meshy → đặc tả (mét thật). Tên theo batquai.DISTRICTS.
export const LANDMARK_SPECS = {
  bq_alchemy_hall: H({ bays: [3.4, 4.0, 4.6, 4.0, 3.4], D: 11, corr: 2.0, colH: 4.4, plinth: 1.0, dagong: 0.075, backDoors: true, roof: { type: 'xieshan', tile: 'Green', beasts: 5, ridgeH: 0.85, lift: 0.5 } }), // Đan Dược Các 22 × 20
  bq_tavern: LU({ bays: [3.4, 3.8, 4.2, 3.8, 3.4], D: 11, corr: 1.8, h1: 4.2, h2: 3.6, colH: 3.6, plinth: 0.6, backDoors: true, roof: { type: 'xieshan', tile: 'Gray', ridgeH: 0.8, lift: 0.5, beasts: 3 } }), // Hỏa Vân Tửu Lâu 20 × 21,7
  lib_mtn_house: H({ bays: [3.4, 4.0, 3.4], D: 8.5, corr: 1.4, colH: 4.0, plinth: 1.2, frontDoors: 'center1', roof: { type: 'xieshan', tile: 'Gray', ridgeH: 0.7, lift: 0.4 } }), // Khôn Nguyên Thương 12 × 12
  bq_farmhouse: H({ bays: [3.6, 4.2, 3.6], D: 7.5, corr: 1.4, colH: 3.6, plinth: 0.6, frontDoors: 'center1', roof: { type: 'gable', tile: 'Gray', ridgeH: 0.6 } }), // Nông Gia Đình 14 × 10,6
  bq_teahouse: LU({ bays: [3.6, 4.2, 4.8, 4.2, 3.6], D: 12, corr: 2.0, h1: 4.4, h2: 3.8, colH: 3.8, plinth: 0.7, backDoors: true, roof: { type: 'xieshan', tile: 'Green', ridgeH: 0.85, lift: 0.55, beasts: 3 } }), // Đoài Duyệt Trà Lâu 24 × 22
  bq_music_pav: H({ bays: [3.6, 4.6, 3.6], D: 8, colH: 3.8, plinth: 0.8, open: true, roof: { type: 'xieshan', tile: 'Gray', ridgeH: 0.6, lift: 0.6 } }), // Cầm Âm Thủy Tạ 14 × 14,7
  bq_stage: H({ bays: [3.0, 4.4, 3.0], D: 8.5, colH: 4.2, plinth: 1.4, open: true, roof: { type: 'xieshan', tile: 'Green', ridgeH: 0.7, lift: 0.6, beasts: 3 } }), // Ca Đài 12 × 12
  bq_sword_tower: LU({ bays: [4.4, 5.6, 4.4], D: 13, corr: 1.8, h1: 5.0, h2: 4.2, colH: 4.2, plinth: 1.0, backDoors: true, roof: { type: 'xieshan', tile: 'Gray', ridgeH: 0.9, lift: 0.55, beasts: 5 } }), // Càn Nguyên Kiếm Các 20 × 20
  bq_sword_pav: H({ bays: [4.6, 5.8, 4.6], D: 12, colH: 5.0, plinth: 1.2, open: true, dagong: 0.07, roof: { type: 'xieshan', tile: 'Gray', ridgeH: 0.8, lift: 0.6, beasts: 3 } }), // Vấn Kiếm Đình 18 × 20
  bq_array_hall: H({ bays: [3.2, 3.8, 4.4, 3.8, 3.2], D: 12, corr: 2.0, colH: 4.4, plinth: 1.2, dagong: 0.07, backDoors: true, roof: { type: 'xieshan', tile: 'Gray', beasts: 5, ridgeH: 0.85, lift: 0.5 } }), // Bát Môn Trận Đường 20 × 20
  bq_thunder_hall: H({ bays: [2.8, 3.2, 3.6, 4.0, 3.6, 3.2, 2.8], D: 14, corr: 2.2, colH: 5.0, plinth: 1.6, dagong: 0.085, stairs3: true, backDoors: true, roof: { type: 'xieshan', tile: 'Yellow', beasts: 7, ridgeH: 1.0, lift: 0.55 } }), // Lôi Âm Điện 24 × 24
  bq_drum_tower: LU({ bays: [3.0, 3.6, 3.0], D: 7.5, corr: 1.2, h1: 4.6, h2: 3.6, colH: 3.6, plinth: 1.0, roof: { type: 'xieshan', tile: 'Gray', ridgeH: 0.75, lift: 0.6, beasts: 3 } }), // Lôi Cổ Lầu 12 × 10
  bq_herb_pav: H({ bays: [3.8, 5.0, 3.8], D: 9, colH: 4.2, plinth: 0.8, open: true, roof: { type: 'xieshan', tile: 'Green', ridgeH: 0.7, lift: 0.6, beasts: 3 } }), // Bách Thảo Đình 15 × 14,7
};
const CACHE = new Map();
/** nhóm three dựng sẵn (dùng chung — gọi .clone() khi đặt nhiều chỗ); null nếu id không có đặc tả */
export function landmarkGroup(id) {
  const spec = LANDMARK_SPECS[id]; if (!spec) return null;
  if (!CACHE.has(id)) {
    const { acc, info } = (spec.type === 'lou' ? cnLou : cnHall)({ ...spec });
    const g = acc.build({ ...cnMats(), ...archMats() }, `lm:${id}`);
    retex(g);
    const c = consolidate(g); c.userData.info = info;
    CACHE.set(id, c);
  }
  return CACHE.get(id);
}
