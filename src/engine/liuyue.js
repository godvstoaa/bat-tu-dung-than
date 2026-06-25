// ============================================================================
//  LƯU NGUYỆT 流月 — VẬN TỪNG THÁNG trong một năm
//  Cơ sở: 五虎遁起月 (lưu nguyệt can chi) + 流月十神入命 + hợp/xung với cục +
//  sinh/khắc/fù/ức Nhật Chủ. Tổ hợp với lưu niên để định tháng cát/hung.
//  Nguồn: 五虎遁口诀, 知乎/凤凰网 流月论断, 子平四级批断 (原局→大运→流年→流月).
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI } from './constants.js';
import { tenGod } from './core.js';
import { adjustLiuyueByGeju } from './pattern-quality.js';
// [loop 74 nâng tầng] Phục/Phản ngâm tháng × 4 trụ nguyên cục (mirror 流年 loop 19).
import { isFuyin, isFanyin } from './fuyin.js';

const wxVi = (w) => WX_VI[w];
const MONTH_ZH = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
const MONTH_LABEL = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

// [loop 74 nâng tầng] Thái tuế tháng + 伏吟/反吟 (mirror liunian-pro.js, nhẹ hơn vì tháng 30 ngày).
const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };
const XING = { 子:'卯', 卯:'子', 寅:'巳', 巳:'申', 申:'寅', 丑:'戌', 戌:'未', 未:'丑', 辰:'辰', 午:'午', 酉:'酉', 亥:'亥' };
const PO = { 子:'酉', 酉:'子', 丑:'辰', 辰:'丑', 寅:'亥', 亥:'寅', 卯:'午', 午:'卯', 巳:'申', 申:'巳', 戌:'未', 未:'戌' };
const HAI = { 子:'未', 未:'子', 丑:'午', 午:'丑', 寅:'巳', 巳:'寅', 卯:'辰', 辰:'卯', 申:'亥', 亥:'申', 酉:'戌', 戌:'酉' };
const QIN_VI = { year: 'Niên Trụ (tổ bối)', month: 'Nguyệt Trụ (phụ mẫu/sự nghiệp)', day: 'Nhật Trụ (bản thân/phối ngẫu)', time: 'Thời Trụ (tử tức)' };
// Trọng số 伏吟/反吟 tháng (nhẹ hơn 流年: tháng ngắn). 反吟 KHÔNG có day (冲日支 đã tính ở Thái tuế).
const W_FUYIN = { day: 4, month: 3, year: 2, time: 2 };
const W_FANYIN = { month: 6, year: 5, time: 5 };

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
 * @param {object} R               — kết quả analyze() (chứa chart, yong…)
 * @param {number} solarYear       — năm dương lịch cần tính lưu nguyệt
 * @param {object} [patternQuality] — TÙY CHỌN: kết quả patternQuality(R). Khi truyền vào,
 *        mỗi tháng được cộng thêm 1 tầng 格局 喜忌 (adjustLiuyueByGeju) LÊN TRÊN tầng
 *        ngũ hành + thập thần tháng. Khi BỎ TRỐNG → không điều chỉnh (giữ nguyên điểm
 *        ngũ hành, backward compatible — dùng cho selftest cũ / chart chưa có patternQuality).
 * @returns {{ year, months:[{m, ganZhi, ganGod, ganWx, zhiWx, score, rating, note, solarMonth, gejuDelta?, gejuNote?}], best, worst }}
 */
export function computeLiuyue(R, solarYear, patternQuality) {
  const dayGan = R.chart.dayGan;
  const fav = new Set([R.yong.primary, R.yong.xi].filter(Boolean));
  const avoid = new Set([R.yong.ji, R.yong.chou]);
  const dayZhi = R.chart.pillars.day.zhi;           // [loop 74] Thái tuế tháng
  const yearBirthZhi = R.chart.pillars.year.zhi;
  const months = [];

  for (let i = 0; i < 12; i++) {
    // [cycle 48 sửa CRITICAL C1] Ánh xạ tháng TIẾT KHÍ i (寅=0..丑=11) → giữa tháng DƯƠNG LỊCH tương ứng.
    //   Trước đây solarMonth=i+1 (Jan15..) → Jan15 vẫn là 丑 tháng (chưa qua立春~4/2) → MỌI lưu nguyệt
    //   lệch 1 tháng (1月 báo 己丑 thay vì 庚寅). Nay: 寅≈Feb15, 卯≈Mar15, ..., 子≈Dec15, 丑≈Jan15 năm SAU.
    //   (Ranh tiết khí ~ngày 4-8, giữa tháng 15 an toàn nằm đúng tháng tiết khí.)
    let gYear = solarYear, gMonth;
    if (i < 11) { gMonth = i + 2; }        // 寅=Feb ... 子=Dec
    else { gMonth = 1; gYear = solarYear + 1; } // 丑 = tháng 1 năm sau (vượt立春sang năm kế)
    let gan, zhi;
    try {
      const s = Solar.fromYmdHms(gYear, gMonth, 15, 12, 0, 0);
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

    // [loop 74 nâng tầng] (3) THÁI TUẾ THÁNG — tháng chi vs Nhật Chi + năm sinh chi.
    //   Tháng chi xung/hình/hại = tháng BIẾN ĐỘNG (mirror 流年 layer, nhẹ hơn vì 30 ngày).
    //   Chống double-count: 冲日支 chỉ tính khi dayZhi≠yearBirthZhi (冲年支 đã bao hàm nếu trùng).
    const extraNotes = [];
    if (zhi === yearBirthZhi) { score -= 3; extraNotes.push('值月太岁'); }
    if (CHONG[dayZhi] === zhi && dayZhi !== yearBirthZhi) { score -= 7; extraNotes.push('⚡月支冲日支 — biến động bản thân/sức khoẻ'); }
    if (CHONG[yearBirthZhi] === zhi) { score -= 5; extraNotes.push('冲年支 (thái tuế tháng)'); }
    if (XING[yearBirthZhi] === zhi) { score -= 4; extraNotes.push('刑月太岁 — quan phi/thị phi'); }
    if (PO[yearBirthZhi] === zhi) { score -= 3; extraNotes.push('破月太岁 — hao tài'); }
    if (HAI[yearBirthZhi] === zhi) { score -= 3; extraNotes.push('害月太岁 — tiểu nhân'); }

    // [loop 74 nâng tầng] (4) PHỤC/PHẢN NGÂM tháng × 4 trụ nguyên cục.
    //   Tháng can-chi trùng trụ = 伏吟 (đình trệ); 天克地冲 trụ = 反吟 (biến cố).
    //   反吟 loại day (冲日支 đã tính ở Thái tuế). Hóa giải: tháng mang Dụng/Hỷ → giảm 60%.
    const yp = { gan, zhi };
    const mitig = fav.has(ganWx) || fav.has(zhiWx);
    const factor = mitig ? 0.4 : 1;
    let fyD = 0;
    const fyNotes = [];
    for (const k of ['day', 'month', 'year', 'time']) {
      const np = R.chart.pillars[k];
      if (!np || !np.gan) continue;
      if (isFuyin(yp, np)) { fyD -= W_FUYIN[k] * factor; fyNotes.push(`伏吟 ${QIN_VI[k]}`); }
      else if (isFanyin(yp, np)) { if (k === 'day') continue; fyD -= W_FANYIN[k] * factor; fyNotes.push(`反吟 ${QIN_VI[k]}`); }
    }
    score += fyD;

    score = Math.max(5, Math.min(95, Math.round(score)));
    let rating;
    if (score >= 64) rating = 'Cát';
    else if (score >= 50) rating = 'Bình';
    else if (score >= 38) rating = 'Hơi kỵ';
    else rating = 'Kỵ';
    const note = [godVi, ...extraNotes, ...fyNotes].filter(Boolean).join(' · ');
    months.push({ m: i, solarMonth: gMonth, ganZhi: gan + zhi, gan, zhi, ganGod, ganWx, zhiWx, score, rating, note, taiSui: extraNotes, fuyin: fyNotes });
  }

  // [loop 4 — 格局流月喜忌] Cộng tầng 格局 LÊN TRÊN tầng ngũ hành + thập thần tháng
  //   (子平真詮 ch.10-11). TÙY CHỌN: chỉ khi caller truyền patternQuality. Khi không
  //   truyền → months giữ nguyên (backward compatible). Áp dụng TRƯỚC khi tính best/worst
  //   để tháng 格局喜 nổi lên top Cát, tháng 格局忌 tụt xuống top Kỵ.
  const finalMonths = patternQuality ? adjustLiuyueByGeju(months, patternQuality, dayGan) : months;

  const sorted = [...finalMonths].sort((a, b) => b.score - a.score);
  const best = sorted.slice(0, 2);
  const worst = sorted.slice(-2).reverse();
  return { year: solarYear, months: finalMonths, best, worst };
}

export { MONTH_ZH, MONTH_LABEL };
