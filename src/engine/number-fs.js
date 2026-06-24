// ============================================================================
//  SỐ LÝ PHONG THỦY 数理风水 — LUCKY NUMBERS & NUMBER EVALUATION
//  "Số điện thoại/biển số/tầng hợp không? Chọn số nào tốt?"
//  Ngũ hành số + Dụng Thần + 81 số lý + tổng điểm số dài.
//  Nguồn: 五行数字, 八十一数理.
// ============================================================================
import { WX_VI } from './constants.js';

// Ngũ hành theo số cuối (河洛数): 1,6=水 2,7=火 3,8=木 4,9=金 5,0=土
const NUM_WX = { 0:'土',1:'水',2:'火',3:'木',4:'金',5:'土',6:'水',7:'火',8:'木',9:'金' };

const WX_FAV_NUMS = {
  木: [3, 8],
  火: [2, 7],
  土: [5, 0],
  金: [4, 9],
  水: [1, 6],
};

const NUM81_LUCK = {
  1:'cat', 3:'cat', 5:'cat', 6:'cat', 7:'cat', 8:'cat', 11:'cat', 13:'cat', 15:'cat', 16:'cat', 17:'cat',
  18:'mid', 21:'cat', 23:'cat', 24:'cat', 25:'cat', 29:'cat', 31:'cat', 32:'cat', 33:'cat',
  35:'cat', 37:'cat', 38:'mid', 39:'cat', 41:'cat', 45:'cat', 47:'cat', 48:'cat', 51:'mid',
  52:'cat', 57:'cat', 58:'mid', 61:'cat', 63:'cat', 65:'cat', 67:'cat', 68:'cat', 73:'mid',
  75:'mid', 81:'cat',
  2:'hung', 4:'hung', 9:'hung', 10:'hung', 12:'hung', 14:'hung', 19:'hung', 20:'hung',
  22:'hung', 26:'hung', 27:'hung', 28:'hung', 30:'hung', 34:'hung', 36:'hung', 40:'hung',
  42:'hung', 43:'hung', 44:'hung', 46:'hung', 49:'mid', 50:'hung', 53:'hung', 54:'hung',
  55:'mid', 56:'hung', 59:'hung', 60:'hung', 62:'hung', 64:'hung', 66:'hung', 69:'hung',
  70:'hung', 71:'hung', 72:'hung', 74:'hung', 76:'hung', 77:'hung', 78:'hung', 79:'hung', 80:'hung',
};
const LUCK_VI = { cat: 'Cát', mid: 'Bình', hung: 'Hung' };
const LUCK_NOTE = {
  cat: 'Cát — số lý tốt',
  mid: 'Bình — trung tính',
  hung: 'Hung — số lý xấu',
};

/**
 * Đánh giá 1 chuỗi số (điện thoại, biển số, v.v.)
 * @param {string} numStr - chuỗi số (vd "0912345678")
 * @returns {{ input, length, lastDigit, lastWx, lastWxVi, sum81, luck81, luckVi,
 *            dungMatch, kyMatch, wxCounts, score, rating, advice }}
 */
export function evaluateNumber(numStr, R) {
  const dungWx = R.yong.primary;
  const xiWx = R.yong.xi;
  const kyWx = R.yong.ji;
  const digits = (numStr || '').replace(/\D/g, '').split('').map(Number);

  if (!digits.length) return { input: numStr, error: 'Không có số hợp lệ' };

  // 1. Số cuối → ngũ hành
  const lastDigit = digits[digits.length - 1];
  const lastWx = NUM_WX[lastDigit];

  // 2. Tổng → 81 số lý
  const sum = digits.reduce((a, b) => a + b, 0);
  const sum81 = sum > 80 ? ((sum - 1) % 81) + 1 : sum;
  const luck81 = NUM81_LUCK[sum81] || 'mid';

  // 3. Đếm ngũ hành từng chữ số
  const wxCounts = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  digits.forEach(d => { wxCounts[NUM_WX[d]]++; });
  const dungCount = wxCounts[dungWx];
  const xiCount = wxCounts[xiWx];
  const kyCount = wxCounts[kyWx];

  // 4. Score
  let score = 50;
  // Số cuối = Dụng
  if (lastWx === dungWx) { score += 15; }
  else if (lastWx === xiWx) { score += 8; }
  else if (lastWx === kyWx) { score -= 12; }
  // Tổng 81 = cát
  if (luck81 === 'cat') score += 12;
  else if (luck81 === 'hung') score -= 10;
  // Dụng Thần số nhiều
  if (dungCount >= 3) score += 10;
  else if (dungCount >= 2) score += 5;
  // Kỵ Thần số nhiều
  if (kyCount >= 4) score -= 10;
  else if (kyCount >= 3) score -= 5;
  // Tỷ lệ Dụng / tổng
  const dungRatio = dungCount / digits.length;
  if (dungRatio >= 0.3) score += 5;
  const kyRatio = kyCount / digits.length;
  if (kyRatio >= 0.4) score -= 8;

  score = Math.max(5, Math.min(98, Math.round(score)));
  let rating = score >= 65 ? 'Đại cát' : score >= 50 ? 'Cát' : score >= 35 ? 'Trung' : 'Kỵ';

  // 5. Advice
  const advice = `${rating} (${score}/100). ` +
    `Số cuối ${lastDigit} = ${WX_VI[lastWx]} ${lastWx === dungWx ? '✓ Dụng Thần' : lastWx === kyWx ? '⚠ Kỵ Thần' : 'trung'}. ` +
    `Tổng ${sum} → 81 số lý ${sum81} (${LUCK_VI[luck81]}). ` +
    `Dụng ${WX_VI[dungWx]}=${dungCount} số, Kỵ ${WX_VI[kyWx]}=${kyCount} số. ` +
    `${score >= 50 ? 'Nên dùng.' : 'Nên cân nhắc đổi sang số có nhiều ' + WX_VI[dungWx] + ' (' + WX_FAV_NUMS[dungWx].join('/') + ').'}`;

  return {
    input: numStr, length: digits.length, digits,
    lastDigit, lastWx, lastWxVi: WX_VI[lastWx],
    sum, sum81, luck81, luckVi: LUCK_VI[luck81], luckNote: LUCK_NOTE[luck81],
    dungMatch: lastWx === dungWx, kyMatch: lastWx === kyWx,
    wxCounts, dungCount, xiCount, kyCount, dungRatio, kyRatio,
    score, rating, advice,
  };
}

/**
 * Đề xuất số tốt cho bạn (Dụng Thần).
 * @returns {{ favNums, avoidNums, goodLast, badLast, goodCombos, tips }}
 */
export function recommendNumbers(R) {
  const dungWx = R.yong.primary;
  const xiWx = R.yong.xi;
  const kyWx = R.yong.ji;

  return {
    favNums: WX_FAV_NUMS[dungWx],
    avoidNums: WX_FAV_NUMS[kyWx],
    goodLast: WX_FAV_NUMS[dungWx].concat(WX_FAV_NUMS[xiWx]),
    badLast: WX_FAV_NUMS[kyWx],
    goodCombos: WX_FAV_NUMS[dungWx].flatMap(a => WX_FAV_NUMS[dungWx].map(b => `${a}${b}`)),
    tips: [
      `Số điện thoại: ưu tiên kết thúc bằng ${WX_FAV_NUMS[dungWx].join(' hoặc ')} (= ${WX_VI[dungWx]} Dụng Thần).`,
      `Biển số: kết thúc ${WX_FAV_NUMS[dungWx].join('/')}, tránh ${WX_FAV_NUMS[kyWx].join('/')}.`,
      `Tầng nhà: tầng có số đuôi ${WX_FAV_NUMS[dungWx].join('/')} tốt; ${WX_FAV_NUMS[kyWx].join('/')} kỵ.`,
      `Số tài khoản: mở bằng/đóng bằng ${WX_FAV_NUMS[dungWx].join('/')}.`,
      `Tổng các chữ số: ưu tiên tổng = 1,3,5,6,7,8,11,13,15,16,21,23,24,25,31,32 (số lý cát).`,
    ],
  };
}

export { NUM_WX, NUM81_LUCK, WX_FAV_NUMS };
