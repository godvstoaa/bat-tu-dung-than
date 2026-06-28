// ============================================================================
//  QUÉT 12 GIỜ TÌNH (十二时辰扫描) — HOUR SCAN WHEN BIRTH HOUR UNKNOWN
//  [loop 595] FEATURE: khi user KHÔNG biết giờ sinh → quét 12 时辰, cho biết:
//    - Dụng Thần thay đổi bao nhiêu across 12 giờ
//    - Điểm mệnh range (min-max)
//    - Giờ nào ổn định (Dụng giống nhau) vs giờ nào outlier
//    - Khuyến nghị: «Dụng X phổ biến (8/12 giờ), trừ giờ Tỵ/Mùi ra Dụng Y»
//  Nguồn: cổ pháp BaZi — trụ giờ quyết định 25% lá số, nhưng khi không biết
//    thì quét 12 để xem «độ nhạy» của mệnh đối với trụ giờ.
// ============================================================================
import { analyze } from './chart.js';
import { synthesize } from './synthesis.js';

const ZHI_12 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ZHI_VI_12 = ['Tý (23-1h)', 'Sửu (1-3h)', 'Dần (3-5h)', 'Mão (5-7h)', 'Thìn (7-9h)', 'Tỵ (9-11h)', 'Ngọ (11-13h)', 'Mùi (13-15h)', 'Thân (15-17h)', 'Dậu (17-19h)', 'Tuất (19-21h)', 'Hợi (21-23h)'];
const HOUR_RANGES = [
  [23, 30], [1, 30], [3, 30], [5, 30], [7, 30], [9, 30],
  [11, 30], [13, 30], [15, 30], [17, 30], [19, 30], [21, 30],
];

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {string} gender ('nam'|'nữ')
 * @param {number} currentYear
 * @returns {{ hours:[{zhi,zhiVi,ganZhi,yong:{primary,score},synScore,grade,stable}],
 *            yongDistribution:{[wx]:number}, stableYong, outlierHours, scoreRange, summary }}
 */
export function scanHours(year, month, day, gender, currentYear = new Date().getFullYear()) {
  // [loop 665] validate input — primitives (year,month,day,gender), không phải R object.
  //   Trước đây scanHours(R) → 12 giờ đều lỗi → summary lừa «0 Dụng khác nhau».
  if (typeof year === 'object' || !Number.isFinite(Number(year)) || !Number.isFinite(Number(month)) || !Number.isFinite(Number(day))) {
    return { error: 'scanHours cần (year, month, day, gender) dạng số — không phải object R. VD: scanHours(1964, 4, 4, "nam").', summary: '(input không hợp lệ)' };
  }
  const results = [];
  const yongCounts = {};

  for (let i = 0; i < 12; i++) {
    const [h, mi] = HOUR_RANGES[i];
    try {
      const R = analyze(year, month, day, h, mi, gender, currentYear);
      const syn = synthesize(R);
      const gz = R.chart.pillars.time.gan + R.chart.pillars.time.zhi;
      const yong = R.yong.primary;
      yongCounts[yong] = (yongCounts[yong] || 0) + 1;
      results.push({
        zhi: ZHI_12[i],
        zhiVi: ZHI_VI_12[i],
        ganZhi: gz,
        yongPrimary: yong,
        yongXi: R.yong.xi,
        synScore: syn.score,
        grade: syn.grade,
        gradeVi: syn.gradeVi,
        percentile: syn.percentile,
        pattern: R.pattern?.vi || '?',
      });
    } catch (e) {
      results.push({ zhi: ZHI_12[i], zhiVi: ZHI_VI_12[i], error: e.message.slice(0, 60) });
    }
  }

  // Phân tích
  const yongEntries = Object.entries(yongCounts).sort((a, b) => b[1] - a[1]);
  const stableYong = yongEntries[0] ? yongEntries[0][0] : '?';
  const stableCount = yongEntries[0] ? yongEntries[0][1] : 0;
  const outlierHours = results.filter((r) => r.yongPrimary && r.yongPrimary !== stableYong);
  const scores = results.filter((r) => typeof r.synScore === 'number').map((r) => r.synScore);
  const scoreRange = scores.length ? { min: Math.min(...scores), max: Math.max(...scores), avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) } : null;

  // Đánh dấu stable/outlier
  for (const r of results) {
    r.stable = r.yongPrimary === stableYong;
  }

  // Summary
  const yongDistStr = yongEntries.map(([wx, n]) => `${wx}(${n}/12)`).join(', ');
  let summary;
  if (stableCount === 12) {
    summary = `Dụng Thần ${stableYong} ỔN ĐỊNH across tất cả 12 giờ (12/12) → không cần biết giờ chính xác, Dụng không đổi. Điểm mệnh ${scoreRange.min}-${scoreRange.max} (chênh ${scoreRange.max - scoreRange.min} điểm).`;
  } else if (stableCount >= 8) {
    summary = `Dụng Thần ${stableYong} phổ biến (${stableCount}/12 giờ) → khá ổn định. ${outlierHours.length} giờ outlier: ${outlierHours.map((o) => o.zhiVi?.split(' ')[0]).join(', ')} → Dụng ${outlierHours[0]?.yongPrimary}. Điểm mệnh ${scoreRange.min}-${scoreRange.max}.`;
  } else if (stableCount >= 6) {
    summary = `Dụng Thần ${stableYong} đa số (${stableCount}/12) NHƯNG ${outlierHours.length} giờ đổi sang Dụng khác → CẦN biết giờ để luận chính xác. Phân bố: ${yongDistStr}.`;
  } else {
    summary = `⚠ Dụng Thần NHẠY CẢM với giờ sinh — ${yongEntries.length} Dụng khác nhau across 12 giờ. BẮT BUỘC tìm giờ sinh để luận chính xác. Phân bố: ${yongDistStr}.`;
  }

  return {
    hours: results,
    yongDistribution: Object.fromEntries(yongEntries),
    stableYong,
    stableCount,
    outlierCount: outlierHours.length,
    outlierHours,
    scoreRange,
    summary,
  };
}

export { ZHI_12, ZHI_VI_12 };
