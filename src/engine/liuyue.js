// ============================================================================
//  LƯU NGUYỆT 流月 — VẬN TỪNG THÁNG trong một năm
//  Cơ sở: 五虎遁起月 (lưu nguyệt can chi) + 流月十神入命 + hợp/xung với cục +
//  sinh/khắc/fù/ức Nhật Chủ. Tổ hợp với lưu niên để định tháng cát/hung.
//  Nguồn: 五虎遁口诀, 知乎/凤凰网 流月论断, 子平四级批断 (原局→大运→流年→流月).
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI } from './constants.js';
import { tenGod } from './core.js';

const wxVi = (w) => WX_VI[w];
const MONTH_ZH = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
const MONTH_LABEL = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

// Thập thần lưu nguyệt → độ倾斜 (nhẹ hơn lưu niên vì chỉ 30 ngày)
const GOD_MONTH = {
  比肩: { d: -2, vi: 'cạnh tranh, bạn bè, hao tiền nhẹ' },
  劫財: { d: -6, vi: '破财 nhẹ, tranh giành, cẩn thận hao' },
  食神: { d: +5, vi: 'phúc lộc, tài hoa, bình順, có tài nguyên' },
  傷官: { d: -6, vi: 'hao tiền, thị phi, biến động tình cảm' },
  偏財: { d: +2, vi: 'tài biến động, bất ngờ (cát hay phá tùy cục)' },
  正財: { d: +3, vi: 'tiến tài đều (thân vượng)' },
  七殺: { d: -5, vi: 'áp lực, tiểu nhân, cẩn thận sức khoẻ' },
  正官: { d: +4, vi: 'thăng tiến, danh vọng, quý nhân' },
  偏印: { d: -3, vi: 'cô độc, hao tài nguyên nhẹ' },
  正印: { d: +4, vi: 'quý nhân, học/văn, ấm no' },
};

/**
 * Tính 12 lưu nguyệt trong năm solarYear.
 * @returns {{ year, months:[{m, ganZhi, ganGod, ganWx, zhiWx, score, rating, note, solarMonth}], best, worst }}
 */
export function computeLiuyue(R, solarYear) {
  const dayGan = R.chart.dayGan;
  const fav = new Set([R.yong.primary, R.yong.xi].filter(Boolean));
  const avoid = new Set([R.yong.ji, R.yong.chou]);
  const months = [];

  for (let i = 0; i < 12; i++) {
    // Tháng tiết khí i: 寅(tháng1) ... dùng giữa tháng dương lịch ~i+1 (gần đúng, an toàn ở giữa tháng)
    // Lấy can chi nguyệt bằng lunar-javascript cho giữa tháng dương tương ứng
    const solarMonth = i + 1; // 1..12 dương lịch (xấp xỉ tháng tiết khí)
    let gan, zhi;
    try {
      const s = Solar.fromYmdHms(solarYear, solarMonth, 15, 12, 0, 0);
      gan = s.getLunar().getMonthGan();
      zhi = s.getLunar().getMonthZhi();
    } catch (e) { continue; }
    const ganGod = tenGod(dayGan, gan);
    const ganWx = GAN[gan].wx, zhiWx = ZHI[zhi].wx;
    let score = 50;
    // Ngũ hành / Dụng thần
    if (fav.has(ganWx)) score += 6;
    if (avoid.has(ganWx)) score -= 7;
    if (fav.has(zhiWx)) score += 5;
    if (avoid.has(zhiWx)) score -= 6;
    // Thập thần tháng
    const g = GOD_MONTH[ganGod];
    let godVi = '';
    if (g) { score += g.d; godVi = g.vi; }
    score = Math.max(5, Math.min(95, Math.round(score)));
    let rating;
    if (score >= 64) rating = 'Cát';
    else if (score >= 50) rating = 'Bình';
    else if (score >= 38) rating = 'Hơi kỵ';
    else rating = 'Kỵ';
    months.push({ m: i, solarMonth, ganZhi: gan + zhi, gan, zhi, ganGod, ganWx, zhiWx, score, rating, note: godVi });
  }

  const sorted = [...months].sort((a, b) => b.score - a.score);
  const best = sorted.slice(0, 2);
  const worst = sorted.slice(-2).reverse();
  return { year: solarYear, months, best, worst };
}

export { MONTH_ZH, MONTH_LABEL };
