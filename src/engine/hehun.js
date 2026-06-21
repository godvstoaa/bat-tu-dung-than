// ============================================================================
//  HÉ HŪN 合婚 — HỢP TUỔI / HỢP ĐỐI TÁC (2 lá số đối chiếu)
//  4 nguyên tắc cổ pháp: (1) 五行互补, (2) 生肖三合六合/冲, (3) 日主干支相合,
//  (4) 用神互不损伤. Trả điểm + chốt hợp/không. Nguồn: 渊海子平, 八字合婚.
// ============================================================================
import { ZHI } from './constants.js';

// Tam hợp / Lục hợp / Xung của Địa Chi
const SANHE = [['申', '子', '辰'], ['寅', '午', '戌'], ['巳', '酉', '丑'], ['亥', '卯', '未']];
const LIUHE = ['子丑', '寅亥', '卯戌', '辰酉', '巳申', '午未'];
const CHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };

function zhiRel(a, b) {
  if (a === b) return { type: 'tự', vi: 'tự hợp / đồng chi' };
  if (LIUHE.some((p) => (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a))) return { type: 'lục hợp', vi: 'Lục Hợp (ám hợp, quý nhân)' };
  if (CHONG[a] === b) return { type: 'xung', vi: 'Lục Xung' };
  for (const trio of SANHE) if (trio.includes(a) && trio.includes(b)) return { type: 'tam hợp', vi: 'Tam Hợp' };
  return { type: 'bình', vi: 'không hợp không xung' };
}

/**
 * @param R1, R2 - kết quả analyze() của 2 người
 * @returns {{ score, rating, factors[], verdict, detail }}
 */
export function computeHehun(R1, R2) {
  const a = R1.chart, b = R2.chart;
  let score = 50;
  const factors = [];

  // 1. 生肖 (chi năm) 三合/六合/冲
  const zRel = zhiRel(a.pillars.year.zhi, b.pillars.year.zhi);
  if (zRel.type === 'tam hợp') { score += 15; factors.push(`✓ Chi năm ${ZHI[a.pillars.year.zhi].vi}–${ZHI[b.pillars.year.zhi].vi} ${zRel.vi} → rất hợp.`); }
  else if (zRel.type === 'lục hợp') { score += 10; factors.push(`✓ Chi năm ${ZHI[a.pillars.year.zhi].vi}–${ZHI[b.pillars.year.zhi].vi} ${zRel.vi} → hợp.`); }
  else if (zRel.type === 'xung') { score -= 15; factors.push(`✗ Chi năm ${ZHI[a.pillars.year.zhi].vi}–${ZHI[b.pillars.year.zhi].vi} ${zRel.vi} → xung khắc tuổi, cần hóa giải.`); }
  else { factors.push(`• Chi năm ${ZHI[a.pillars.year.zhi].vi}–${ZHI[b.pillars.year.zhi].vi}: ${zRel.vi}.`); }

  // 2. 五行互补: Dụng của A có mạnh trong cục B không & ngược lại
  const aNeed = R1.yong.primary, bNeed = R2.yong.primary;
  const bHasA = (R2.wx.score[aNeed] || 0) / (R2.wx.total || 1);
  const aHasB = (R1.wx.score[bNeed] || 0) / (R1.wx.total || 1);
  if (bHasA > 0.18 && aHasB > 0.18) { score += 18; factors.push(`✓ Ngũ Hành tương bổ: A cần ${aNeed}, B vượng ${aNeed} (${(bHasA * 100).toFixed(0)}%); B cần ${bNeed}, A vượng ${bNeed} (${(aHasB * 100).toFixed(0)}%) → bổ sung cho nhau.`); }
  else if (bHasA > 0.18 || aHasB > 0.18) { score += 8; factors.push(`• Bổ một chiều: ${bHasA > 0.18 ? `B bổ A` : `A bổ B`}五行.`); }
  else { score -= 6; factors.push(`✗ Ngũ Hành ít bổ sung nhau (A cần ${aNeed}, B chỉ ${(bHasA * 100).toFixed(0)}%; B cần ${bNeed}, A ${(aHasB * 100).toFixed(0)}%).`); }

  // 3. 用神互不损伤: A có khắc Dụng của B / B khắc Dụng của A không?
  // (đơn giản: A kỵ hành có trùng Dụng của B không → kiểm Kỵ của A vs Dụng của B)
  const aHurtB = R1.yong.avoid.includes(bNeed);
  const bHurtA = R2.yong.avoid.includes(aNeed);
  if (aHurtB || bHurtA) { score -= 12; factors.push(`✗ Tổn dụng: ${aHurtB ? 'mệnh A kỵ đúng Dụng ' + bNeed : ''}${bHurtA ? ' mệnh B kỵ đúng Dụng ' + aNeed : ''} — một bên bất lợi.`); }
  else { score += 6; factors.push(`✓ Dụng Thần hai bên không tổn thương nhau.`); }

  // 4. 日柱 天干 / 地支 相合
  const dgRel = a.dayGan + b.dayGan;
  const dayZhiRel = zhiRel(a.pillars.day.zhi, b.pillars.day.zhi);
  const GAN_HE = { '甲己': 1, '乙庚': 1, '丙辛': 1, '丁壬': 1, '戊癸': 1 };
  const ganHe = GAN_HE[dgRel] || GAN_HE[dgRel.split('').reverse().join('')];
  if (ganHe) { score += 10; factors.push(`✓ Nhật Can ${a.dayGan}–${b.dayGan} ngũ hợp → tâm đầu ý hợp.`); }
  if (dayZhiRel.type === 'lục hợp' || dayZhiRel.type === 'tam hợp') { score += 10; factors.push(`✓ Nhật Chi ${ZHI[a.pillars.day.zhi].vi}–${ZHI[b.pillars.day.zhi].vi} ${dayZhiRel.vi} → cung phu thê hợp.`); }
  else if (dayZhiRel.type === 'xung') { score -= 12; factors.push(`✗ Nhật Chi ${ZHI[a.pillars.day.zhi].vi}–${ZHI[b.pillars.day.zhi].vi} Xung → cung phu thê biến động.`); }

  score = Math.max(5, Math.min(98, Math.round(score)));
  let rating, verdict;
  if (score >= 78) { rating = 'Đại hợp'; verdict = 'Rất hợp — Ngũ Hành tương bổ, cung phối ngẫu tương đắc; nên tiến tới.'; }
  else if (score >= 62) { rating = 'Hợp'; verdict = 'Khá hợp — có bổ trợ, có thể chung sống lâu dài, cần bao dung chỗ thiếu.'; }
  else if (score >= 45) { rating = 'Trung'; verdict = 'Bình thường — hợp một mặt, khắc một mặt, phụ thuộc nỗ lực vun đắp.'; }
  else { rating = 'Khắc'; verdict = 'Khó hợp — nhiều xung khắc, cần cố ý hóa giải (chọn năm cát, bao dung, hoặc chỉ hợp tác kinh doanh).'; }

  return { score, rating, factors, verdict };
}
