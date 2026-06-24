// ============================================================================
//  DỌN NHÀ PHONG THỦY 搬家风水 — MOVE HOUSE TIMING & RITUALS
//  "Khi nào dọn? Hướng nào? Nghi lễ gì?" — tổng hợp 择日 + 八宅 + Dụng Thần
//  + nghi thức nhập trạch + kiêng kỵ.
//  Nguồn: 通胜 入宅, 协纪辨方 入宅仪式, 八宅明镜 移徙.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { ZHI } from './constants.js';
import { computeZhai } from './zhai.js';

const ZHI_ORDER = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const OFFICERS = ['建','除','满','平','定','执','破','危','成','收','开','闭'];
const MOVE_YI = ['成','定','开','满']; // trực cát cho dọn nhà
const MOVE_JI = ['破','平','闭','危']; // trực kỵ
const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };

const RITUALS = [
  '① Chọn ngày cát (成/定/开 trực + 宜入宅 + không xung tuổi).',
  '② Trước khi dọn: quét dọn sạch nhà mới, mở tất cả cửa sổ 30ph cho thoáng khí.',
  '③ Sáng ngày dọn: mang theo vật phẩm "khai hỏa" — bếp ga/nồi cơm/bát đĩa (tượng trưng "khai hỏa" = bắt đầu sinh hoạt).',
  '④ Người chủ BƯỚC VÀO TRƯỚC, cầm vật quý (vàng/tiền/lúa) — không bước lùi.',
  '⑤ Bật bếp nấu bữa đầu tiên → "khai hỏa" chính thức nhập trạch.',
  '⑥ Không dọn vào buổi chiều/tối — chỉ dọn SÁNG (dương khí thịnh).',
  '⑦ Người trong nhà đều có mặt (đủ thành viên) hoặc chờ đủ rồi mới "khai hỏa".',
  '⑧ Tránh cãi vã ngày dọn — vui vẻ, may mắn.',
  '⑨ Treo đèn đỏ/đèn sáng 3 ngày liên tục sau khi nhập trạch.',
  '⑩ Mời bạn bè thăm nhà mới trong 1 tháng → "thêm dương khí".',
];

const TABOOS = [
  '✗ Không dọn ngày xung tuổi chủ nhà.',
  '✗ Không dọn tháng 7 âm lịch (tháng cô hồn).',
  '✗ Không dọn ngày ĐẠI HUNG (四绝/四离/岁破/月破).',
  '✗ Không dọn khi có tang trong nhà (chưa mãn tang).',
  '✗ Không mang đồ cũ rách vào nhà mới đầu tiên.',
  '✗ Không để nhà trống quá lâu sau khi "khai hỏa" — phải ngủ đêm đó.',
];

/**
 * Tìm ngày dọn nhà tốt + hướng + nghi lễ.
 * @param {number} year, month, day — ngày muốn dọn
 * @param {string} userZhi — chi năm sinh chủ nhà
 * @param {number} birthYear — năm sinh (cho 八宅)
 * @param {string} gender
 * @returns {{ date, score, rating, reasons, taboosHit, rituals, facingDir, facingWhy }}
 */
export function evaluateMoveDate(year, month, day, userZhi, birthYear, gender) {
  const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const lunar = solar.getLunar();
  const dZhi = lunar.getDayZhi(), mZhi = lunar.getMonthZhi(), yZhi = lunar.getYearZhi();

  // Trực
  const oIdx = ((ZHI_ORDER.indexOf(dZhi) - ZHI_ORDER.indexOf(mZhi)) + 12) % 12;
  const officer = OFFICERS[oIdx];

  // Thông thắng 宜/忌
  const tsYi = lunar.getDayYi ? (lunar.getDayYi() || []) : [];
  const tsJi = lunar.getDayJi ? (lunar.getDayJi() || []) : [];
  const hasMoveYi = tsYi.includes('入宅') || tsYi.includes('移徙') || MOVE_YI.includes(officer);
  const hasMoveJi = tsJi.includes('入宅') || tsJi.includes('移徙') || MOVE_JI.includes(officer);

  // Xung tuổi
  const clashYou = CHONG[dZhi] === userZhi;

  // Đại hung
  const jqt = lunar.getJieQiTable ? lunar.getJieQiTable() : {};
  const next = solar.next(1);
  const silLis = ['立春','立夏','立秋','立冬'];
  const fenZhi = ['春分','夏至','秋分','冬至'];
  let bigBad = null;
  const matchJq = (names) => names.some(n => { const s = jqt[n]; return s && s.getYear() === next.getYear() && s.getMonth() === next.getMonth() && s.getDay() === next.getDay(); });
  if (matchJq(silLis)) bigBad = '四绝';
  else if (matchJq(fenZhi)) bigBad = '四离';
  if (!bigBad && CHONG[yZhi] === dZhi) bigBad = '岁破';
  if (!bigBad && CHONG[mZhi] === dZhi) bigBad = '月破';

  // Score
  let score = 50;
  const reasons = [];
  if (hasMoveYi && !hasMoveJi) { score += 20; reasons.push('✓ Trực/宜 cát cho nhập trạch'); }
  if (tsYi.includes('入宅') || tsYi.includes('移徙')) { score += 10; reasons.push('✓ Thông thắng 宜入宅/移徙'); }
  if (hasMoveJi) { score -= 15; reasons.push('✗ Trực/忌 kỵ nhập trạch'); }
  if (clashYou) { score -= 15; reasons.push(`✗ Xung tuổi chủ nhà (${ZHI[userZhi]?.vi})`); }
  if (bigBad) { score -= 20; reasons.push(`✗ ${bigBad} — ĐẠI HUNG`); }
  if (!clashYou && !bigBad) { score += 8; reasons.push('✓ Không xung tuổi, không đại hung'); }

  // Hướng tốt để bước vào
  const z = computeZhai(birthYear, gender);
  const bestDir = Object.entries(z.auspicious || {}).find(([k]) => k.startsWith('Sinh'))?.[1]
    || Object.values(z.auspicious || {})[0] || '?';

  score = Math.max(5, Math.min(98, Math.round(score)));
  const rating = score >= 65 ? 'Đại cát dọn' : score >= 50 ? 'Cát dọn' : score >= 35 ? 'Trung' : 'Kỵ dọn';

  // Taboos check
  const taboosHit = [];
  const month7 = lunar.getMonth() === 7;
  if (month7) taboosHit.push('⚠ Tháng 7 âm lịch (tháng cô hồn) — không nên dọn!');
  if (clashYou) taboosHit.push('⚠ Ngày xung tuổi chủ nhà');

  return { date: solar.toYmd(), lunar: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    ganZhi: lunar.getDayGan() + dZhi, officer, score, rating, reasons, bigBad, taboosHit,
    rituals: RITUALS, taboos: TABOOS,
    facingDir: bestDir, facingWhy: `Bước vào hướng ${bestDir} (Bát Trạch Sinh Khí cát cho chủ nhà)` };
}

/**
 * Tìm top N ngày dọn nhà tốt trong khoảng.
 */
export function findMoveDates(userZhi, birthYear, gender, startY, startM, startD, days = 60, topN = 5) {
  const out = [];
  for (let i = 0; i < days; i++) {
    const d = Solar.fromYmdHms(startY, startM, startD, 12, 0, 0).next(i);
    try {
      const ev = evaluateMoveDate(d.getYear(), d.getMonth(), d.getDay(), userZhi, birthYear, gender);
      out.push(ev);
    } catch (e) {}
  }
  return out.sort((a, b) => b.score - a.score).slice(0, topN);
}
