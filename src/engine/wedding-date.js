// ============================================================================
//  TRẠCH CƯỚI 择吉婚期 — CHỌN NGÀY CƯỚI CHO 2 NGƯỜI
//  Khác zheri (1 người): kiểm ĐỒNG THỜI cả hai tuổi + thông thắng 宜嫁娶 +
//  không phạm thái tuế cả hai + không xung cả hai.
//  Nguồn: 通胜 嫁娶择日, 协纪辨方.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { ZHI } from './constants.js';

const ZHI_ORDER = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const OFFICERS = ['建','除','满','平','定','执','破','危','成','收','开','闭'];
const MARRY_YI = ['定','成','开']; // trực cát cho cưới
const MARRY_JI = ['破','平','闭','危']; // trực kỵ cưới
const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };
// [loop 327] 六害 + 三刑 — ngày cưới hại/hình tuổi vợ/chồng cũng kỵ (trước đây chỉ check 冲)
const HAI = { 子:'未', 未:'子', 丑:'午', 午:'丑', 寅:'巳', 巳:'寅', 卯:'辰', 辰:'卯', 申:'亥', 亥:'申', 酉:'戌', 戌:'酉' };
const XING = { 子:'卯', 卯:'子', 寅:'巳', 巳:'申', 申:'寅', 丑:'戌', 戌:'未', 未:'丑', 辰:'辰', 午:'午', 酉:'酉', 亥:'亥' };

/**
 * Đánh giá 1 ngày cho cưới — cho 2 người.
 * @param {string} zhiA - chi năm sinh người A
 * @param {string} zhiB - chi năm sinh người B
 * @returns {{ date, ganZhi, officer, officerVi, tongShengYi, tongShengJi,
 *            clashA, clashB, taiSuiA, taiSuiB, score, rating, reasons[] }}
 */
export function evaluateWeddingDate(year, month, day, zhiA, zhiB) {
  const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const lunar = solar.getLunar();
  const dGan = lunar.getDayGan(), dZhi = lunar.getDayZhi();
  const mZhi = lunar.getMonthZhi();
  const yZhi = lunar.getYearZhi();

  // Trực
  const oIdx = ((ZHI_ORDER.indexOf(dZhi) - ZHI_ORDER.indexOf(mZhi)) + 12) % 12;
  const officer = OFFICERS[oIdx];

  // Thông thắng 宜/忌
  const tsYi = lunar.getDayYi ? (lunar.getDayYi() || []) : [];
  const tsJi = lunar.getDayJi ? (lunar.getDayJi() || []) : [];
  const hasMarryYi = tsYi.includes('嫁娶') || MARRY_YI.includes(officer);
  const hasMarryJi = tsJi.includes('嫁娶') || MARRY_JI.includes(officer);

  // Xung cả hai
  const clashA = CHONG[dZhi] === zhiA;
  const clashB = CHONG[dZhi] === zhiB;

  // Thái tuế cả hai
  const taiSuiA = dZhi === zhiA; // 值太岁
  const taiSuiB = dZhi === zhiB;
  const chongTaiSuiA = CHONG[zhiA] === dZhi; // 冲太岁
  const chongTaiSuiB = CHONG[zhiB] === dZhi;

  // Chấm điểm
  let score = 50;
  const reasons = [];

  if (hasMarryYi && !hasMarryJi) { score += 20; reasons.push('✓ Trực/宜 cát cho cưới'); }
  else if (hasMarryJi) { score -= 15; reasons.push('✗ Trực/忌 kỵ cưới'); }

  if (tsYi.includes('嫁娶')) { score += 10; reasons.push('✓ Thông thắng 宜嫁娶'); }
  if (tsJi.includes('嫁娶')) { score -= 10; reasons.push('✗ Thông thắng 忌嫁娶'); }

  if (clashA) { score -= 15; reasons.push(`✗ Xung tuổi A (${ZHI[zhiA]?.vi || zhiA})`); }
  if (clashB) { score -= 15; reasons.push(`✗ Xung tuổi B (${ZHI[zhiB]?.vi || zhiB})`); }
  // Chỉ giữ penalty Thái Tuế thật: 冲太岁 (chi NGÀY xung chi NĂM SINH). KHÔNG tính
  // "ngày trùng năm sinh" (zhiA===dZhi) — đó không phải phạm Thái Tuế theo cổ pháp
  // (Thái Tuế = năm-vs-năm-sinh, không phải ngày-vs-năm-sinh).
  if (chongTaiSuiA) { score -= 10; reasons.push(`✗ A phạm thái tuế (冲太岁)`); }
  if (chongTaiSuiB) { score -= 10; reasons.push(`✗ B phạm thái tuế (冲太岁)`); }
  // [loop 327] 日害/刑 tuổi — nhẹ hơn 冲 nhưng vẫn kỵ ngày cưới (cùng bug-class loop 326 zheri)
  const haiA = HAI[dZhi] === zhiA, haiB = HAI[dZhi] === zhiB;
  const xingA = XING[dZhi] === zhiA && dZhi !== zhiA; // bỏ 自刑 (chi ngày = chi năm)
  const xingB = XING[dZhi] === zhiB && dZhi !== zhiB;
  if (haiA) { score -= 6; reasons.push(`• A bị hại (日害岁 ${ZHI[zhiA]?.vi || zhiA})`); }
  if (haiB) { score -= 6; reasons.push(`• B bị hại (日害岁 ${ZHI[zhiB]?.vi || zhiB})`); }
  if (xingA) { score -= 8; reasons.push(`• A bị hình (日刑岁 ${ZHI[zhiA]?.vi || zhiA})`); }
  if (xingB) { score -= 8; reasons.push(`• B bị hình (日刑岁 ${ZHI[zhiB]?.vi || zhiB})`); }

  if (!clashA && !clashB && !chongTaiSuiA && !chongTaiSuiB && !haiA && !haiB && !xingA && !xingB) {
    score += 10; reasons.push('✓ Không xung/hại/hình/phạm cả hai');
  }

  score = Math.max(5, Math.min(98, Math.round(score)));
  let rating = score >= 70 ? 'Đại cát cưới' : score >= 55 ? 'Cát cưới' : score >= 40 ? 'Trung' : 'Kỵ cưới';

  return {
    date: solar.toYmd(), ganZhi: dGan + dZhi, officer, lunar: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    hasMarryYi, hasMarryJi, tsYi: tsYi.slice(0, 8), tsJi: tsJi.slice(0, 5),
    clashA, clashB, taiSuiA, taiSuiB, chongTaiSuiA, chongTaiSuiB,
    score, rating, reasons,
  };
}

/**
 * Tìm top N ngày cưới tốt nhất trong khoảng.
 */
export function findWeddingDates(zhiA, zhiB, startYear, startMonth, startDay, days = 90, topN = 5) {
  const out = [];
  for (let i = 0; i < days; i++) {
    const d = Solar.fromYmdHms(startYear, startMonth, startDay, 12, 0, 0).next(i);
    try {
      const ev = evaluateWeddingDate(d.getYear(), d.getMonth(), d.getDay(), zhiA, zhiB);
      out.push(ev);
    } catch (e) {}
  }
  return out.sort((a, b) => b.score - a.score).slice(0, topN);
}
