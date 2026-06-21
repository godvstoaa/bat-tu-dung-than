// ============================================================================
//  CORE — các hàm Thuần Tử Bình dùng chung (không phụ thuộc vòng)
//  Thập Thần & Vòng Trường Sinh. Được import bởi chart.js, pattern.js, nlg.js.
// ============================================================================
import {
  GAN, SHENG, KE, KE_BY, SHENG_BY,
  CHANGSHENG_STAGES, CHANGSHENG_START, ZHI_ORDER,
} from './constants.js';

// --- Thập Thần của một Can so với Nhật Chủ ---
export function tenGod(dayGan, otherGan) {
  const dm = GAN[dayGan];
  const o = GAN[otherGan];
  const sameYin = dm.yin === o.yin;
  if (o.wx === dm.wx) return sameYin ? '比肩' : '劫財';
  if (o.wx === SHENG[dm.wx]) return sameYin ? '食神' : '傷官';   // thân sinh ra
  if (o.wx === KE[dm.wx]) return sameYin ? '偏財' : '正財';      // thân khắc
  if (o.wx === KE_BY[dm.wx]) return sameYin ? '七殺' : '正官';   // khắc thân
  if (o.wx === SHENG_BY[dm.wx]) return sameYin ? '偏印' : '正印'; // sinh thân
  return '';
}

// --- Vòng Trường Sinh của Nhật Chủ tại một Địa Chi ---
export function changSheng(dayGan, zhi) {
  const start = CHANGSHENG_START[dayGan];
  const forward = !GAN[dayGan].yin; // can dương thuận, can âm nghịch
  const startIdx = ZHI_ORDER.indexOf(start);
  const zhiIdx = ZHI_ORDER.indexOf(zhi);
  let steps = forward ? (zhiIdx - startIdx) : (startIdx - zhiIdx);
  steps = ((steps % 12) + 12) % 12;
  return CHANGSHENG_STAGES[steps];
}

// --- Nhóm Thập Thần (ti/yin/shi/cai/guan) từ tên Thập Thần ---
export function godGroup(god) {
  switch (god) {
    case '比肩': case '劫財': return 'ti';
    case '正印': case '偏印': return 'yin';
    case '食神': case '傷官': return 'shi';
    case '正財': case '偏財': return 'cai';
    case '正官': case '七殺': return 'guan';
    default: return '';
  }
}

// --- Vượng suy của một hành A đối với Nhật Chủ (dùng cho luận cách) ---
//   'same'  = đồng hành (Tỷ Kiếp)
//   'sheng' = A sinh ra (Thực Thương — tiết)
//   'ke'    = A khắc (Tài — hao)
//   'keBy'  = A khắc Nhật Chủ (Quan Sát — chế)
//   'shengBy' = A sinh Nhật Chủ (Ấn — phù)
export function relationOf(dmWx, otherWx) {
  if (otherWx === dmWx) return 'same';
  if (otherWx === SHENG[dmWx]) return 'sheng';
  if (otherWx === KE[dmWx]) return 'ke';
  if (otherWx === KE_BY[dmWx]) return 'keBy';
  if (otherWx === SHENG_BY[dmWx]) return 'shengBy';
  return '';
}
