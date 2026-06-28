// ============================================================================
//  HÔM NAY — Daily Synthesis (tổng hợp mọi engine → 1 thẻ hành động/ngày)
//  Người dùng mở app hỏi: "hôm nay tôi nên/không nên gì?" → module này trả lời
//  bằng cách tổng hợp: 黄历(宜忌) + 玄空流年飞星(hướng cát/hung) + 择日(建除)
//  + 大运/流年/流月 + 冲/合 với lá số + Dụng Thần nhắc.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI } from './constants.js';
import { tenGod } from './core.js';
import { yearFlyingStar } from './xuankong.js';

const CHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
const ZHI_VI = { 子:'Tý',丑:'Sửu',寅:'Dần',卯:'Mão',辰:'Thìn',巳:'Tỵ',午:'Ngọ',未:'Mùi',申:'Thân',酉:'Dậu',戌:'Tuất',亥:'Hợi' };

/**
 * Tổng hợp daily guidance.
 * @param {object} R - currentResult (analyze output)
 * @param {number} year, month, day, hour - ngày hỏi (mặc định hôm nay)
 */
export function dailyGuidance(R, yy, mm, dd, hh) {
  const now = new Date();
  const y = yy ?? now.getFullYear();
  const mo = mm ?? now.getMonth() + 1;
  const d = dd ?? now.getDate();
  const h = hh ?? now.getHours();

  const solar = Solar.fromYmdHms(y, mo, d, h, 0, 0);
  const lunar = solar.getLunar();
  const dayGan = lunar.getDayGan(), dayZhi = lunar.getDayZhi();
  const monthGan = lunar.getMonthGan(), monthZhi = lunar.getMonthZhi();

  // 1. Dụng Thần nhắc (luôn hiển thị)
  const yong = R.yong;
  const dungVi = WX_VI[yong.primary];

  // 2. Ngày chi có xung/khắc gì với LÁ SỐ không?
  const userDayZhi = R.chart.pillars.day.zhi;
  const userYearZhi = R.chart.pillars.year.zhi;
  const dayChongUser = CHONG[dayZhi] === userDayZhi || CHONG[userDayZhi] === dayZhi;
  const yearChongUser = CHONG[dayZhi] === userYearZhi || CHONG[userYearZhi] === dayZhi;
  const dayGanVsDm = tenGod(R.chart.dayGan, dayGan); // thập thần của can ngày vs Nhật Chủ

  // 3. Ngày hành có phải Dụng/Hỷ/Kỵ không?
  const dayWx = GAN[dayGan].wx;
  const zhiWx = ZHI[dayZhi].wx;
  const isDung = dayWx === yong.primary || dayWx === yong.xi || zhiWx === yong.primary || zhiWx === yong.xi;
  const isKy = dayWx === yong.ji || dayWx === yong.chou || zhiWx === yong.ji || zhiWx === yong.chou;

  // 4. 流年飞星 — hướng cát/hung hôm nay (theo năm)
  const yfs = yearFlyingStar(y);
  const badDir = yfs.xiong.map((p) => `${p.palace}(${p.name})`);
  const goodDir = yfs.cat.map((p) => `${p.palace}(${p.name})`);

  // 5. Vận hạn context
  const lnNow = (R.liunian || []).find((l) => l.isNow);
  const lmNow = null; // 流月 current month (compute if available)

  // 6. Phán tổng hợp
  let score = 50;
  const reasons = [];
  const yi = []; // 宜
  const ji = []; // 忌

  if (isDung) { score += 12; reasons.push(`✓ Ngày mang hành DỤNG/HỶ (${dayGan}${dayZhi} = ${WX_VI[dayWx]}/${WX_VI[zhiWx]}) → thuận cho mọi việc.`); yi.push('Tiến thủ việc lớn (hợp Dụng Thần)'); }
  if (isKy) { score -= 12; reasons.push(`✗ Ngày mang hành KỴ/THÙ (${WX_VI[dayWx]}/${WX_VI[zhiWx]}) → bất lợi.`); ji.push('Tránh quyết định lớn (hành Kỵ Thần)'); }
  if (dayChongUser) { score -= 15; reasons.push(`⚡ Ngày chi ${ZHI_VI[dayZhi]} XUNG chi ngày (${ZHI_VI[userDayZhi]}) của bạn → "日破" bất lợi bản thân.`); ji.push('Tránh ký hợp đồng/cưới/động thổ'); }
  if (yearChongUser) { score -= 8; reasons.push(`Ngày chi xung chi năm (${ZHI_VI[userYearZhi]}) → hơi bất lợi tuổi.`); }
  if (['正官','正印','食神','正財'].includes(dayGanVsDm)) { score += 6; reasons.push(`Can ngày = ${dayGanVsDm} (sao cát) → cát tinh chiếu.`); }
  if (['七殺','傷官','劫財','偏印'].includes(dayGanVsDm)) { score -= 4; reasons.push(`Can ngày = ${dayGanVsDm} (sao thiên hung) → cẩn thận.`); }
  // [loop 544 FIX BUG2] score bị clamp [2,98] trong scoreLiunianYear → `score<0` KHÔNG BAO GIỜ
  //   true (dead branch) và `score>=1` LUÔN true → năm «Đại hung» (score 2-9) vẫn +5 (sai).
  //   Nay dùng threshold đồng bộ rating: >=56 Cát (+5), <22 Hơi kỵ trở xuống (-5), giữa = trung.
  if (lnNow && lnNow.score >= 56) { score += 5; reasons.push(`Lưu niên ${lnNow.year} (${lnNow.rating}) → nền vận năm cát.`); yi.push('Tiến thủ (lưu niên cát)'); }
  else if (lnNow && lnNow.score < 22) { score -= 5; reasons.push(`Lưu niên ${lnNow.year} (${lnNow.rating}) → nền vận năm bất lợi.`); ji.push('Giữ ổn định (lưu niên hung)'); }

  // Dụng Thần reminder
  yi.push(`Dùng màu ${yong.primary === '木' ? 'xanh lá' : yong.primary === '火' ? 'đỏ' : yong.primary === '土' ? 'vàng/nâu' : yong.primary === '金' ? 'trắng/kim' : 'đen/xanh biển'}`);
  yi.push(`Hướng tốt: ${goodDir.slice(0, 3).join(', ')}`);

  if (badDir.length) ji.push(`Tránh hướng: ${badDir.slice(0, 2).join(', ')}`);

  score = Math.max(10, Math.min(95, Math.round(score)));
  let verdict;
  // [loop 644 FIX] align thang liuri đã recalibrate loop 469→470 (54/48/44). Trước đây 65/45
  //   (thang cũ) → cùng ngày mâu thuẫn các hệ daily khác (daily-pro/liuri/etc).
  if (score >= 54) verdict = `NGÀY CÁT (${score}/100) — nên tiến thủ, quyết định lớn OK.`;
  else if (score >= 48) verdict = `NGÀY BÌNH (${score}/100) — ổn, làm việc thường OK, việc lớn cân nhắc.`;
  else if (score >= 44) verdict = `NGÀY HƠI KỴ (${score}/100) — cẩn thận, ưu tiên việc thường.`;
  else verdict = `NGÀY HUNG (${score}/100) — thủ giữ, tránh rủi ro, đợi ngày tốt hơn.`;

  return {
    date: `${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`,
    lunar: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    dayGanZhi: dayGan + dayZhi, dayGanVsDm, score, verdict,
    yi: [...new Set(yi)], ji: [...new Set(ji)], reasons,
    goodDir, badDir, dungVi, lnNow: lnNow ? `${lnNow.year}(${lnNow.rating})` : null,
  };
}
