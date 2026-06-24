// ============================================================================
//  月煞 — PHƯƠNG KỴ LƯU NGUYỆT (月三煞 + 月建 + 月破)
//  "Tháng này tôi có thể động thổ/cải tạo về hướng X không?" — sát phương THÁNG.
//  * Lớp nguyệt (tháng) của sát phương — tinh hơn năm, dùng 择日/dọn nhà theo tháng.
//  * 3 hệ (theo chi tháng âm lịch):
//    1) 月三煞 (cùng công thức tam hợp như tam sát năm, nhưng theo chi THÁNG):
//       申子辰月→巳午未(南), 寅午戌月→亥子丑(北), 巳酉丑月→寅卯辰(东), 亥卯未月→申酉戌(西).
//    2) 月建方 = chính phương của chi tháng (phương «thái tuế tháng»).
//    3) 月破方 = đối xung chi tháng (tháng phá — kỵ).
//  * Phạm nhiều hệ trong tháng → tránh; sạch → tháng đó thuận hướng.
//  Nguồn: 协纪辨方书 月煞, 永乐大典 月建月破, 黄历 流月神煞.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { SANSHA, DIR_OF } from './sansha.js';

const CHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
// 月三煞 chính phương — bộ tam sát luôn là BỘ 3 chi tại 1 CHÍNH phương (Bắc/Nam/Đông/Tây).
// Lấy từ chi đầu của bộ SANSHA trio (巳→Nam, 亥→Bắc, 寅→Đông, 申→Tây). Đây là cardinal đúng.
const ZHI_TO_CARDINAL = { 子: 'Bắc', 午: 'Nam', 卯: 'Đông', 酉: 'Tây', 寅: 'Đông', 申: 'Tây', 巳: 'Nam', 亥: 'Bắc', 辰: 'Đông', 戌: 'Tây', 丑: 'Bắc', 未: 'Nam' };
// 月建/月破 = phương vị RIÊNG của 1 chi — phải dùng bản đồ 8-hướng (giữ đường chéo).
// Bug cũ: ZHI_TO_CARDINAL gộp đường chéo Earth-branch (辰/戌/丑/未) vào chính phương
// → 辰→'Đông' (sai, phải 'Đông Nam'), 戌→'Tây' (phải 'Tây Bắc'),
//   丑→'Bắc' (phải 'Đông Bắc'), 未→'Nam' (phải 'Tây Nam').
// Khớp DIR_OF trong sansha.js và TO_EIGHT trong annual-taboo.js (đã fix). 4/12 tháng sai.
const ZHI_TO_DIR8 = { 子: 'Bắc', 丑: 'Đông Bắc', 寅: 'Đông Bắc', 卯: 'Đông', 辰: 'Đông Nam', 巳: 'Đông Nam', 午: 'Nam', 未: 'Tây Nam', 申: 'Tây Nam', 酉: 'Tây', 戌: 'Tây Bắc', 亥: 'Tây Bắc' };

function lunarMonthZhi(year, month, day) {
  const s = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  return s.getLunar().getMonthZhi();
}
const CARDINAL_OF_BRANCH_GROUP = (chi) => {
  // chi đầu của bộ tam sát → chính phương
  const branches = SANSHA[chi] || [];
  return branches.length ? ZHI_TO_CARDINAL[branches[0]] : '?';
};

/**
 * @param {number} year,month,day (dương lịch — bất kỳ ngày nào trong tháng cần xét)
 * @returns {{ monthZhi, yueSha3, yueJian, yuePo, summary }}
 */
export function monthlySha(year, month, day) {
  const mZhi = lunarMonthZhi(year, month, day);
  const yueSha3 = CARDINAL_OF_BRANCH_GROUP(mZhi); // 月三煞 chính phương (luôn cardinal — bộ 3 chi)
  const yueJian = ZHI_TO_DIR8[mZhi];                 // 月建 phương (8-hướng, giữ đường chéo)
  const yuePo = ZHI_TO_DIR8[CHONG[mZhi]];            // 月破 phương (8-hướng, giữ đường chéo)
  const summary = `Tháng ${mZhi}: 月三煞 ở ${yueSha3}, 月建 ở ${yueJian}, 月破 ở ${yuePo}. ` +
    `Trong tháng này KỴ động thổ/cải tạo/dời nhà về các hướng ${[...new Set([yueSha3, yueJian, yuePo])].join(', ')}; ưu tiên hướng khác.`;
  return { monthZhi: mZhi, yueSha3, yueJian, yuePo, tabooDirs: [...new Set([yueSha3, yueJian, yuePo])], summary };
}

/** Kiểm 1 hướng vs sát phương của tháng. */
export function checkMonthlyTaboo(direction, year, month, day) {
  const ms = monthlySha(year, month, day);
  const hit = ms.tabooDirs.includes(direction);
  return { direction, ...ms, hit, note: hit ? `⚠ Hướng ${direction} phạm sát phương tháng ${ms.monthZhi} (月三煞/月建/月破).` : `Hướng ${direction} THUẬN trong tháng ${ms.monthZhi} (không phạm月煞).` };
}
