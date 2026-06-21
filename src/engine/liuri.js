// ============================================================================
//  LƯU NHẬT 流日 — VẬN CÁ NHÂN TỪNG NGÀY ("hôm nay tôi sao?")
//  Khác 择日 (chọn ngày cho 1 việc): đây là vận tổng thể của CÁ NHÂN trong 1 ngày.
//  Cơ sở: nhật can chi → Thập thần + Ngũ hành Dụng thần + Thần sát ngày (đào hoa/
//  hồng diễm/dương nhận/dịch mã) + chi ngày xung/hại chi tuổi & chi ngày. Nguồn:
//  流日论断 (tương tự 流年/流月 nhưng nhẹ hơn vì chỉ 1 ngày).
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI } from './constants.js';
import { tenGod } from './core.js';
import { TAO_HUA, HONG_YAN, YANG_REN, YI_MA, BRANCH_GROUP } from './shensha.js';

const wxVi = (w) => WX_VI[w];
const CHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
const HAI = { 子: '未', 未: '子', 丑: '午', 午: '丑', 寅: '巳', 巳: '寅', 卯: '辰', 辰: '卯', 申: '亥', 亥: '申', 酉: '戌', 戌: '酉' };

// Thập thần ngày → độ (nhẹ vì 1 ngày)
const GOD_DAY = {
  比肩: { d: -1, vi: 'gặp bạn bè, cạnh tranh nhẹ, hao chút tiền' },
  劫財: { d: -5, vi: '破财 nhẹ, tranh giành, đừng cho vay/mua sắm bốc đồng' },
  食神: { d: +5, vi: 'vui vẻ, tài hoa, có口 phúc, việc thuận' },
  傷官: { d: -5, vi: 'dễ cãi/khẩu thiệp, hao tiền, tình cảm biến — giữ lời ăn tiếng nói' },
  偏財: { d: +3, vi: 'tài bất ngờ nhỏ / hao, hào phóng' },
  正財: { d: +4, vi: 'tiến tài đều, việc tiền thuận (nếu thân vượng)' },
  七殺: { d: -4, vi: 'áp lực, tiểu nhân, cẩn thận sức khoẻ/an toàn' },
  正官: { d: +4, vi: 'danh vọng, quý nhân, việc quan quyền thuận' },
  偏印: { d: -2, vi: 'tâm trạng cô, hao tài nguyên nhẹ' },
  正印: { d: +4, vi: 'quý nhân, học/văn, ấm no, có người giúp' },
};

/**
 * @returns {{ solar, ganZhi, ganGod, score, rating, schools:[{phai,d,note}], advice }}
 */
export function analyzeLiuRi(R, year, month, day) {
  const c = R.chart;
  const dayGan = c.dayGan, birthYearZhi = c.pillars.year.zhi, selfDayZhi = c.pillars.day.zhi;
  const yong = R.yong;

  const s = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const lunar = s.getLunar();
  const dGan = lunar.getDayGan(), dZhi = lunar.getDayZhi();
  const ganGod = tenGod(dayGan, dGan);
  const ganWx = GAN[dGan].wx, zhiWx = ZHI[dZhi].wx;

  const schools = [];
  let score = 50;

  // (1) Ngũ hành Dụng thần
  const fav = new Set([yong.primary, yong.xi].filter(Boolean));
  const avoid = new Set([yong.ji, yong.chou]);
  let ed = 0; let enote = `Can ${dGan}(${wxVi(ganWx)}) + Chi ${dZhi}(${wxVi(zhiWx)}). `;
  if (fav.has(ganWx)) { ed += 5; enote += `Can Dụng/Hỷ, thuận. `; }
  if (avoid.has(ganWx)) { ed -= 6; enote += `Can Kỵ/Thù, nghịch. `; }
  if (fav.has(zhiWx)) { ed += 4; enote += `Chi Dụng/Hỷ, thuận. `; }
  if (avoid.has(zhiWx)) { ed -= 5; enote += `Chi Kỵ/Thù, nghịch. `; }
  score += ed; schools.push({ phai: 'Ngũ Hành/Dụng', d: ed, note: enote });

  // (2) Thập thần ngày
  const g = GOD_DAY[ganGod];
  if (g) { score += g.d; schools.push({ phai: 'Thập Thần ngày', d: g.d, note: `${ganGod}: ${g.vi}` }); }

  // (3) Chi ngày vs chi tuổi + chi ngày bản mệnh
  if (CHONG[birthYearZhi] === dZhi) { score -= 5; schools.push({ phai: 'Xung tuổi', d: -5, note: `Chi ngày ${ZHI[dZhi].vi} XUNG chi tuổi ${ZHI[birthYearZhi].vi} — cẩn thận biến động.` }); }
  if (CHONG[selfDayZhi] === dZhi) { score -= 6; schools.push({ phai: 'Xung Nhật Chi', d: -6, note: `Chi ngày xung Nhật Chi (bản thân) — cẩn thận sức khoẻ/an toàn.` }); }
  if (HAI[birthYearZhi] === dZhi) { score -= 3; schools.push({ phai: 'Hại tuổi', d: -3, note: `Chi ngày hại chi tuổi — tiểu nhân, hao tốn nhẹ.` }); }

  // (4) Thần sát ngày
  const grp = BRANCH_GROUP[birthYearZhi];
  if (TAO_HUA[grp] === dZhi || TAO_HUA[BRANCH_GROUP[selfDayZhi]] === dZhi) { score -= 3; schools.push({ phai: 'Đào Hoa ngày', d: -3, note: 'Hôm nay đào hoa — tình cảm biến động, cẩn thận烂桃花/hao tiền vì tình.' }); }
  if (HONG_YAN[dayGan] === dZhi) { score -= 3; schools.push({ phai: 'Hồng Diễm ngày', d: -3, note: 'Hồng diễm — sắc duyên, dễ sa vào tình cảm không lợi.' }); }
  if (YANG_REN[dayGan] === dZhi) { score -= 4; schools.push({ phai: 'Dương Nhận ngày', d: -4, note: 'Dương nhận — sát khí, dễ tổn thương/xe cộ/cắt đứt, kỵ liều.' }); }
  if (YI_MA[grp] === dZhi || YI_MA[BRANCH_GROUP[selfDayZhi]] === dZhi) { score += 2; schools.push({ phai: 'Dịch Mã ngày', d: 2, note: 'Dịch mã — di chuyển/đổi chỗ, có biến (cát nếu Dụng).' }); }

  score = Math.max(5, Math.min(95, Math.round(score)));
  let rating;
  if (score >= 64) rating = 'Cát';
  else if (score >= 50) rating = 'Bình';
  else if (score >= 38) rating = 'Hơi kỵ';
  else rating = 'Kỵ';

  const advice = score >= 64 ? `Hôm nay (${rating}) — thuận, nên làm việc chính/ký kết/gặp quý nhân.`
    : score >= 50 ? `Hôm nay (${rating}) — tạm ổn, làm việc thường, tránh quyết định lớn.`
    : `Hôm nay (${rating}) — bất lợi, giữ mình, tránh đầu tư/cho vay/cãi vã/đi xa liều, bao dung tình cảm.`;

  return { solar: s.toYmd(), ganZhi: dGan + dZhi, ganGod, ganWx, zhiWx, score, rating, schools, advice };
}

// Tìm N ngày tốt kế tiếp cho việc cá nhân (vận cá nhân, không theo việc cụ thể)
export function findGoodDays(R, startYear, startMonth, startDay, count, topN = 5) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const d = Solar.fromYmdHms(startYear, startMonth, startDay, 12, 0, 0).next(i);
    try { out.push(analyzeLiuRi(R, d.getYear(), d.getMonth(), d.getDay())); } catch (e) {}
  }
  return out.sort((a, b) => b.score - a.score).slice(0, topN);
}
