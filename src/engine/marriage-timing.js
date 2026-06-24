// ============================================================================
//  流年 婚恋 应期 — SCANNER NĂM HÔN/LUYÊN (红鸾/天喜/桃花 đến + 配偶星 thấu)
//  "Năm nào tôi gặp duyên / kết hôn?" — quét lưu niên tìm năm kích hoạt hôn nhân.
//  * Khác marriage-deep (sao 红鸾/天喜 BẨM SINH theo năm sinh + goodYears theo Dụng):
//    module này quét từng LƯU NIÊN sắp tới, kiểm kích hoạt:
//    1) 红鸾/天喜 (theo chi lưu niên) ĐẾN 配偶 cung (日支) hoặc 本命 (年支) → tín hiệu hôn nhân mạnh.
//    2) 配偶 tinh thấu CAN (nam: Chính/Thiên Tài; nữ: Chính Quan/Thất Sát) → năm sao vợ/chồng đến.
//    3) 桃花/红艳 đến cung → duyên tình (kết hôn nhẹ hơn).
//  * Tổng điểm → xếp hạng năm cát hôn nhân / duyên tình.
//  Nguồn: 渊海子平 红鸾天喜流年, 三命通会 配偶星应期, 桃花流年到命.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI } from './constants.js';
import { tenGod } from './core.js';
import { HONGLUAN, TIANXI } from './marriage-deep.js';
import { TAOHUA, HONGYAN } from './taohua.js';

function yearGanZhi(year) {
  const s = Solar.fromYmdHms(year, 6, 15, 12, 0, 0);
  const ec = s.getLunar().getEightChar();
  return { gan: ec.getYearGan(), zhi: ec.getYearZhi() };
}

/**
 * @param {object} R — analyze()
 * @param {number} fromYear, count
 * @returns {{ years:[{year,ganZhi,score,signals:[],type}], topMarriage, topRomance, summary }}
 */
export function scanMarriageTiming(R, fromYear, count = 12) {
  const start = fromYear || new Date().getFullYear();
  const isMale = R.chart.input.gender === 'nam';
  const dayGan = R.chart.dayGan;
  const dayZhi = R.chart.pillars.day.zhi;       // 配偶 cung
  const yearZhiBirth = R.chart.pillars.year.zhi; // 本命
  const spouseGods = isMale ? ['正財', '偏財'] : ['正官', '七殺'];

  const years = [];
  for (let i = 0; i < count; i++) {
    const y = start + i;
    const { gan, zhi } = yearGanZhi(y);
    const signals = [];
    let score = 0;
    const hongLuan = HONGLUAN[zhi], tianXi = TIANXI[zhi], taoHua = TAOHUA[zhi];

    // 1) 红鸾/天喜 đến 配偶 cung / 本命
    if (hongLuan === dayZhi) { score += 3; signals.push(`红鸾(${hongLuan}) ĐẾN 配偶 cung (日支) → TÍN HIỆU HÔN NHÂN mạnh`); }
    else if (hongLuan === yearZhiBirth) { score += 2; signals.push(`红鸾 đến 本命 chi`); }
    if (tianXi === dayZhi) { score += 2; signals.push(`天喜(${tianXi}) đến 配偶 cung → cát hỉ, dễ có việc vui (hôn/thai)`); }
    // 2) 配偶 tinh thấu can
    const g = tenGod(dayGan, gan);
    if (spouseGods.includes(g)) { score += 2; signals.push(`配偶 tinh (${g}) thấu can năm → sao vợ/chồng hiện`); }
    // 3) 桃花 năm = chi năm TRÙNG vị đào hoa BẢN MỆNH. [cycle 60 sửa H1] trước đây `taoHua === dayZhi`
    //   ĐẢO (tính đào hoa của NĂM rồi so ngày chi → sai hướng). Đúng: chi năm == TAOHUA[ngày chi/năm sinh chi].
    //   Vd user (日亥→桃花子, 年酉→桃花午): 2026 午 nay bắt được (trước miss).
    if (zhi === TAOHUA[dayZhi] || zhi === TAOHUA[yearZhiBirth]) { score += 1; signals.push(`桃花(${zhi}) đến → duyên tình (hôn nhẹ)`); }
    // 红艳 theo can năm == 日支
    if (HONGYAN[dayGan] === zhi) { score += 1; signals.push(`红艳 năm → duyên mạnh`); }

    if (score > 0) years.push({ year: y, ganZhi: gan + zhi, score, signals, type: score >= 4 ? 'hôn nhân' : score >= 2 ? 'duyên tình' : 'nhẹ' });
  }

  years.sort((a, b) => b.score - a.score);
  const topMarriage = years.filter((y) => y.score >= 4);
  const topRomance = years.filter((y) => y.score >= 2 && y.score < 4);

  let summary;
  if (!years.length) summary = `${count} năm tới (${start}–${start + count - 1}) KHÔNG có năm kích hoạt婚恋 nổi bật (theo 红鸾/天喜/配偶星/桃花) — duyên đến mượt theo lưu nguyệt, hoặc cần主动 mở lòng + chọn người bổ Dụng.`;
  else {
    summary = `Năm cát HÔN NHÂN (${start}–${start + count - 1}): ${topMarriage.length ? topMarriage.map((y) => `${y.year}(${y.ganZhi},${y.score}đ)`).join(', ') : '(không có năm ≥4đ — duyên nhẹ)'}.` +
      (topRomance.length ? ` Năm DUYÊN TÌNH: ${topRomance.map((y) => `${y.year}(${y.score}đ)`).join(', ')}.` : '') +
      ` Tín hiệu mạnh nhất: ${years[0].year} — ${years[0].signals[0]}.`;
  }
  return { years, topMarriage, topRomance, summary };
}

export { HONGLUAN, TIANXI, TAOHUA, HONGYAN };
