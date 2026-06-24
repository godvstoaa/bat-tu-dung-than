// ============================================================================
//  QUÝ NHÂN ĐỊNH VỊ 贵人定位 — WHO HELPS YOU & WHEN
//  "Ai là quý nhân của tôi? Ở hướng nào? Tuổi nào? Khi nào xuất hiện?"
//  Tổng hợp: 天乙/天魁/天钺/天德/月德 + Dụng Thần nhóm người + lưu niên kích hoạt.
//  Nguồn: 渊海子平 贵人篇, 三命通会 天乙贵人.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { SHENG_BY } from './constants.js';
import { Solar } from 'lunar-javascript';

const TIAN_YI = {
  甲:['丑','未'], 戊:['丑','未'], 庚:['丑','未'],
  乙:['子','申'], 己:['子','申'],
  丙:['亥','酉'], 丁:['亥','酉'],
  壬:['卯','巳'], 癸:['卯','巳'],
  辛:['寅','午'],
};

const TIAN_DE_MONTH = {
  寅:'丁', 卯:'申', 辰:'壬', 巳:'辛', 午:'亥', 未:'甲',
  申:'癸', 酉:'寅', 戌:'丙', 亥:'乙', 子:'巳', 丑:'庚',
};

const YUE_DE_GROUP = { 申子辰:'壬', 寅午戌:'丙', 巳酉丑:'庚', 亥卯未:'甲' };

const BRANCH_GROUP = { 申:'A',子:'A',辰:'A', 寅:'B',午:'B',戌:'B', 巳:'C',酉:'C',丑:'C', 亥:'D',卯:'D',未:'D' };

const NOBLE_PERSONALITY = {
  丑: 'người trầm ổn, cần cù, thực tế, có của',
  未: 'người ôn hòa, bao dung, sáng tạo, hào phóng',
  子: 'người thông minh, linh hoạt, giỏi giao tế',
  申: 'người quyết đoán, dũng cảm, hành động nhanh',
  亥: 'người trí tuệ, bao dung, giàu lòng thương',
  酉: 'người thanh tú, cầu toàn, thẩm mỹ tốt',
  卯: 'người mềm mỏng, duyên dáng, nghệ sĩ',
  巳: 'người nhiệt tình, nhạy bén, sâu sắc',
  寅: 'người chính trực, lãnh đạo, có chí tiến thủ',
  午: 'người hào sảng, lan tỏa, nhiệt huyết',
  辰: 'người vững vàng, thực tế, bao dung',
  戌: 'người trung thành, nghĩa khí, trực tính',
};

const NOBLE_AGE_GAP = {
  同龄: '0-3 tuổi — bạn bè đồng trang lứa',
  长辈: '7-15+ tuổi lớn hơn — sếp/thầy/người đi trước',
  晚辈: '5-10 tuổi nhỏ hơn — cấp dưới/học trò',
};

/**
 * @returns {{ tianYiBranches, personalities, nobleType, nobleDirection,
 *            nobleAgeGap, nobleElement, hasTianDe, hasYueDe, allNobles,
 *            timingYears, profile, advice }}
 */
export function findNoblePerson(R) {
  const { chart, shensha, yong } = R;
  const dayGan = chart.dayGan;
  const yearZhi = chart.pillars.year.zhi;

  // 1. Thiên Ất Quý Nhân
  const tyBranches = TIAN_YI[dayGan] || [];
  const tyPersonalities = tyBranches.map(b => ({ branch: b, vi: ZHI[b]?.vi || b, personality: NOBLE_PERSONALITY[b] || '?' }));

  // 2. Quý nhân ở đâu trong tứ trụ?
  const inChart = tyBranches.filter(b => ['year','month','day','time'].some(k => chart.pillars[k].zhi === b));

  // 3. Hướng quý nhân (theo chi quý nhân = hướng gặp)
  const nobleDirection = tyBranches.map(b => {
    const dirMap = { 子:'Bắc', 丑:'Đông Bắc', 寅:'Đông Bắc', 卯:'Đông', 辰:'Đông Nam', 巳:'Đông Nam',
      午:'Nam', 未:'Tây Nam', 申:'Tây Nam', 酉:'Tây', 戌:'Tây Bắc', 亥:'Tây Bắc' };
    return { branch: b, direction: dirMap[b] || '?' };
  });

  // 4. Tuổi quý nhân (tam hợp/lục hợp với chi quý nhân)
  const nobleAges = [];
  for (const b of tyBranches) {
    // Tam hợp
    const sanHe = [['申','子','辰'],['寅','午','戌'],['巳','酉','丑'],['亥','卯','未']].find(t => t.includes(b));
    if (sanHe) nobleAges.push({ type: 'tam hợp', branches: sanHe.filter(x => x !== b), vi: 'tuổi ' + sanHe.filter(x => x !== b).map(x => ZHI[x]?.vi || x).join(' hoặc ') });
    // Lục hợp
    const liuHe = { 子:'丑', 丑:'子', 寅:'亥', 亥:'寅', 卯:'戌', 戌:'卯', 辰:'酉', 酉:'辰', 巳:'申', 申:'巳', 午:'未', 未:'午' };
    nobleAges.push({ type: 'lục hợp', branch: liuHe[b], vi: 'tuổi ' + (ZHI[liuHe[b]]?.vi || liuHe[b]) });
  }

  // 5. Hành quý nhân (Dụng Thần nhóm người)
  const nobleElement = yong.primary;
  const nobleElementVi = `Người mang hành ${WX_VI[yong.primary]} (= Dụng Thần) là quý nhân cho bạn — gặp họ thì vận tốt.`;

  // 6. Thiên Đức / Nguyệt Đức
  const hasTianDe = !!(shensha?.tianDe);
  const hasYueDe = !!(shensha?.yueDe);

  // 7. All nobles tổng hợp
  const allNobles = [];
  if (shensha?.tianYi) allNobles.push({ type: 'Thiên Ất', vi: 'Thiên Ất Quý Nhân (đại quý nhân)', at: shensha.tianYi.at });
  if (hasTianDe) allNobles.push({ type: 'Thiên Đức', vi: 'Thiên Đức Quý Nhân (từ bi)' });
  if (hasYueDe) allNobles.push({ type: 'Nguyệt Đức', vi: 'Nguyệt Đức Quý Nhân (phúc đức)' });
  if (shensha?.tianKui) allNobles.push({ type: 'Thiên Khôi', vi: 'Thiên Khôi (quý nam)' });
  if (shensha?.tianYue) allNobles.push({ type: 'Thiên Việt', vi: 'Thiên Việt (quý nữ)' });

  // 8. Timing: năm nào quý nhân kích hoạt
  const timingYears = [];
  const curYear = new Date().getFullYear();
  for (let yr = curYear; yr <= curYear + 10; yr++) {
    const yZhi = Solar.fromYmdHms(yr, 6, 15, 12, 0, 0).getLunar().getYearZhi();
    const reasons = [];
    if (tyBranches.includes(yZhi)) reasons.push('Thiên Ất quý nhân chi xuất hiện');
    // Lục hợp với quý nhân chi
    const LH = { 子:'丑', 丑:'子', 寅:'亥', 亥:'寅', 卯:'戌', 戌:'卯', 辰:'酉', 酉:'辰', 巳:'申', 申:'巳', 午:'未', 未:'午' };
    if (tyBranches.some(b => LH[b] === yZhi)) reasons.push('Lục hợp quý nhân');
    if (reasons.length) timingYears.push({ year: yr, zhi: yZhi, reasons });
  }

  // 9. Profile
  const profile = [
    `Thiên Ất Quý Nhân: chi ${tyBranches.join('/')} → tính cách quý nhân: ${tyPersonalities.map(p => p.personality).join('; ')}.`,
    inChart.length ? `✓ Quý nhân ĐANG CÓ trong tứ trụ (${inChart.join(', ')}) → đời bạn đã gặp quý nhân.` : `Quý nhân chưa xuất hiện cố định → đợi lưu niên mang chi ${tyBranches.join('/')} thì quý nhân đến.`,
    `Hướng gặp quý nhân: ${nobleDirection.map(d => d.direction).join(' / ')}.`,
    `Tuổi quý nhân: ${nobleAges.map(a => a.vi).join('; ')}.`,
    nobleElementVi,
    allNobles.length ? `Tổng quý nhân trong mệnh: ${allNobles.map(n => n.vi).join(', ')}.` : '',
  ].filter(Boolean);

  const advice = `Quý nhân của bạn mang hành ${WX_VI[yong.primary]} (Dụng Thần), tuổi ${nobleAges[0]?.vi || '?'}. ` +
    `Gặp ở hướng ${nobleDirection[0]?.direction || '?'}. ` +
    `${inChart.length ? 'Đã có quý nhân trong mệnh → trân trọng.' : 'Chưa có → đợi năm ' + (timingYears[0]?.year || '?') + '.'}`;

  return {
    tianYiBranches: tyBranches, personalities: tyPersonalities,
    inChart, nobleDirection, nobleAges, nobleElement, nobleElementVi,
    hasTianDe, hasYueDe, allNobles, timingYears, profile, advice,
  };
}