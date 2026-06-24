// ============================================================================
//  ĐÀO HOA LUẬN 桃花论 — DEEP ROMANCE & ATTRACTION ANALYSIS
//  "Khi nào gặp người yêu? Sao ế? Duyên ra sao?" — phân tích sâu tình duyên.
//  Tổng hợp: đào hoa + hồng diễm + sao phối ngẫu + cung phu thê + lưu niên kích hoạt.
//  Nguồn: 渊海子平 桃花篇, 三命通会 红艳, 神峰通考 夫妻.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { TAO_HUA, HONG_YAN, BRANCH_GROUP } from './shensha.js';
import { tenGod } from './core.js';
import { Solar } from 'lunar-javascript';

const ZHI_ORDER = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };

/**
 * @returns {{ peachBlossom, peachPositions, redAttraction, redPositions,
 *            spouseStrength, palaceStable, romanceScore, profile, advice,
 *            timingYears:[], warningSigns:[] }}
 */
export function analyzeRomance(R) {
  const { chart, shensha, interactions, yong, dayun } = R;
  const isMale = chart.input.gender === 'nam';
  const dayGan = chart.dayGan;
  const dayZhi = chart.pillars.day.zhi;
  const yearZhi = chart.pillars.year.zhi;

  // 1. Đào hoa vị trí
  const taoBranch = TAO_HUA[BRANCH_GROUP[yearZhi]] || TAO_HUA[BRANCH_GROUP[dayZhi]];
  const taoByDay = TAO_HUA[BRANCH_GROUP[dayZhi]];
  const peachPositions = [];
  ['year','month','day','time'].forEach(k => {
    const z = chart.pillars[k].zhi;
    if (z === taoBranch) peachPositions.push({ pillar: k, zhi: z });
    if (z === taoByDay && z !== taoBranch) peachPositions.push({ pillar: k + '(day)', zhi: z });
  });

  // 2. Hồng diễm
  const hongBranch = HONG_YAN[dayGan];
  const redPositions = [];
  ['year','month','day','time'].forEach(k => {
    if (chart.pillars[k].zhi === hongBranch) redPositions.push({ pillar: k, zhi: hongBranch });
  });

  // 3. Sao phối ngẫu strength
  const spouseGods = isMale ? ['正財','偏財'] : ['正官','七殺'];
  let spouseCount = 0;
  for (const key of ['year','month','time']) {
    if (spouseGods.includes(chart.pillars[key].ganGod)) spouseCount += 1;
  }
  for (const key of ['year','month','day','time']) {
    if (spouseGods.includes(chart.pillars[key].hidden[0]?.god)) spouseCount += 0.5;
  }

  // 4. Cung phu thê (Nhật Chi) stability
  const palaceStable = !interactions.chong.some(c => c.a === dayZhi || c.b === dayZhi)
    && !interactions.xing.some(c => c.a === dayZhi || c.b === dayZhi);

  // 5. Romance score (0-100)
  let romanceScore = 50;
  if (peachPositions.length >= 1) romanceScore += 10;
  if (redPositions.length >= 1) romanceScore += 8;
  if (shensha?.taoHua) romanceScore += 5;
  if (shensha?.hongYan) romanceScore += 5;
  if (spouseCount >= 1.5) romanceScore += 12;
  else if (spouseCount >= 0.5) romanceScore += 5;
  else romanceScore -= 8;
  if (palaceStable) romanceScore += 8;
  else romanceScore -= 10;
  // Dụng Thần = sao phối ngẫu → hôn nhân cát
  const spouseWx = isMale ? ({木:'土',火:'金',土:'水',金:'木',水:'火'})[GAN[dayGan].wx] : ({木:'金',火:'水',土:'木',金:'火',水:'土'})[GAN[dayGan].wx];
  if (yong.primary === spouseWx || yong.xi === spouseWx) romanceScore += 10;
  if (yong.ji === spouseWx) romanceScore -= 10;

  romanceScore = Math.max(10, Math.min(98, Math.round(romanceScore)));

  // 6. Profile
  const profile = [
    `Đào hoa: ${peachPositions.length ? peachPositions.map(p => p.pillar + '(' + p.zhi + ')').join(', ') : 'không có'} — ${peachPositions.length ? 'duyên tốt, dễ hấp dẫn người khác giới' : 'ít đào hoa, cần chủ động hơn'}.`,
    `Hồng diễm: ${redPositions.length ? redPositions.map(p => p.pillar + '(' + p.zhi + ')').join(', ') : 'không có'} — ${redPositions.length ? 'sắc vóc + duyên mạnh' : ''}.`,
    `Sao phối ngẫu (${spouseGods.map(g=>TEN_GOD_VI[g]).join('/')}): ${spouseCount >= 1.5 ? 'vượng — duyên tốt' : spouseCount > 0 ? 'vừa' : 'nhược — duyên muộn/ít'}.`,
    `Cung phu thê (Nhật Chi ${ZHI[dayZhi]?.vi || dayZhi}): ${palaceStable ? '✓ yên — hôn nhân nền' : '⚠ bị xung — biến động'}.`,
    romanceScore >= 70 ? `✓ Điểm tình duyên ${romanceScore}/100 — RẤT TỐT. Duyên mạnh, dễ tìm người ưng.` :
    romanceScore >= 50 ? `Điểm tình duyên ${romanceScore}/100 — TRUNG BÌNH. Duyên vừa, cần nỗ lực.` :
    `⚠ Điểm tình duyên ${romanceScore}/100 — KÉM. Duyên muộn/ít, cần chủ động + cải vận.`,
  ];

  // 7. Warning signs
  const warnings = [];
  if (!palaceStable) warnings.push('Nhật Chi bị xung → hôn nhân biến động, cần kiên nhẫn + bao dung.');
  if (interactions.chong.some(c => (c.a === dayZhi || c.b === dayZhi))) warnings.push('Xung cung phu thê → dễ cãi vã/tách xa, cần giao tiếp nhiều hơn.');
  if (shensha?.taoHua && shensha?.hongYan) warnings.push('Đào hoa + Hồng diễm cùng có → duyên quá mạnh, cẩn thận烂桃花/đa tình.');
  if (yong.ji === spouseWx) warnings.push(`Sao phối ngẫu = Kỵ Thần (${WX_VI[spouseWx]}) → hôn nhân mang áp lực, chọn người bổ Dụng Thần.`);

  // 8. Timing: tìm năm đào hoa kích hoạt (10 năm tới)
  const timingYears = [];
  const birthZhi = yearZhi;
  const curYear = new Date().getFullYear();
  for (let yr = curYear; yr <= curYear + 10; yr++) {
    const yZhi = Solar.fromYmdHms(yr, 6, 15, 12, 0, 0).getLunar().getYearZhi();
    const yGan = Solar.fromYmdHms(yr, 6, 15, 12, 0, 0).getLunar().getYearGan();
    const reasons = [];
    // Năm mang chi đào hoa
    if (yZhi === taoBranch || yZhi === taoByDay) reasons.push('Đào hoa kích hoạt');
    // Năm mang chi hồng diễm
    if (yZhi === hongBranch) reasons.push('Hồng diễm kích hoạt');
    // Năm sao phối ngẫu thấu can
    const lnGod = tenGod(dayGan, yGan);
    if (spouseGods.includes(lnGod)) reasons.push(`Sao phối ngẫu (${TEN_GOD_VI[lnGod]}) thấu`);
    // Năm chi = chi Nhật (cung phu thê kích hoạt)
    if (yZhi === dayZhi) reasons.push('Cung phu thê kích hoạt');
    // Năm chi hợp với Nhật chi (lục hợp)
    const LH = ['子丑','寅亥','卯戌','辰酉','巳申','午未'];
    if (LH.some(p => p === yZhi+dayZhi || p === dayZhi+yZhi)) reasons.push('Chi hợp cung phu thê');

    if (reasons.length) timingYears.push({ year: yr, zhi: yZhi, reasons, score: reasons.length });
  }
  timingYears.sort((a, b) => b.score - a.score);

  // 9. Advice
  const advice = romanceScore >= 70
    ? 'Duyên mạnh — nên chọn lọc, không vội. Người hợp mang hành Dụng Thần. Năm đào hoa kích hoạt: dễ gặp.'
    : romanceScore >= 50
      ? 'Duyên trung — cần chủ động tham gia hoạt động xã hội. Mặc màu Hỷ Thần khi hẹn hò.'
      : 'Duyên ít — cải vận: (1) mang trang sức đào hoa, (2) hướng giường/bàn về hướng Dụng Thần, (3) tham gia hoạt động Mộc/Hỏa (nếu Hỷ), (4) chờ năm đào hoa kích hoạt.';

  return {
    peachBlossom: taoBranch, peachByDay: taoByDay, peachPositions,
    redAttraction: hongBranch, redPositions,
    spouseStrength: spouseCount, palaceStable,
    romanceScore, profile, warnings, timingYears, advice,
  };
}
