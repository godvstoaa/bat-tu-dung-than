// ============================================================================
//  LƯU NHẬT LỤC PHÁI 流日六派 — DAILY 6-SCHOOL ANALYSIS
//  "Hôm nay tôi sao? Làm gì tốt/tránh gì?" — phiên bản chi tiết nhất.
//  Khác liuri.js (nhẹ): 6 trường phái đầy đủ cho 1 ngày cụ thể.
//  Nguồn: tổng hợp từ liunian-pro + tongsheng + daily-directions.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { tenGod } from './core.js';
import { TAO_HUA, HONG_YAN, YANG_REN, YI_MA, BRANCH_GROUP, TIAN_YI, WEN_CHANG, JIANG_XING } from './shensha.js';

const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };
// [loop 290] 六害 (穿) + 三刑 — daily-pro từng thiếu (chỉ có 冲) nên nông hơn cả liuri (light).
// Bổ sung cho khớp cổ pháp 择日: chi ngày phạm 害/刑 với tuổi/Nhật Chi cũng giảm cát.
const HAI = { 子:'未', 未:'子', 丑:'午', 午:'丑', 寅:'巳', 巳:'寅', 卯:'辰', 辰:'卯', 申:'亥', 亥:'申', 酉:'戌', 戌:'酉' };
const XING = { 子:'卯', 卯:'子', 寅:'巳', 巳:'申', 申:'寅', 丑:'戌', 戌:'未', 未:'丑', 辰:'辰', 午:'午', 酉:'酉', 亥:'亥' };
// [loop 1004] 六合 (lục hợp) — chi ngày HỢP tuổi/Nhật Chi = CÁT (đối xứng 冲 penalty).
//   Cổ法 择日 «日支与年命支六合为吉» — ngày chi lục hợp tuổi → thuận hoà, việc trôi chảy.
//   Trước đây PHÁI 4 chỉ trừ 冲/害/刑, không thưởng 合 → mất tín hiệu CÁT quan trọng.
const LIUHE = { 子:'丑', 丑:'子', 寅:'亥', 亥:'寅', 卯:'戌', 戌:'卯', 辰:'酉', 酉:'辰', 巳:'申', 申:'巳', 午:'未', 未:'午' };
const ZHI_ORDER = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const OFFICERS = ['建','除','满','平','定','执','破','危','成','收','开','闭'];
const OFFICER_ROAD = { 建:'black', 满:'black', 平:'black', 收:'black', 破:'black', 闭:'black', 除:'yellow', 危:'yellow', 定:'yellow', 执:'yellow', 成:'yellow', 开:'yellow' };
const TONE_WORD = { yellow: '黄道', black: '黑道' };

// 12 thần (daily version - simpler than annual, based on day chi vs birth chi)
const DAILY_GOD = {
  比肩: { d: -1, note: 'cạnh tranh nhẹ, gặp bạn bè' },
  劫財: { d: -5, note: 'hao tiền, tránh cho vay/mua sắm bốc đồng' },
  食神: { d: 5, note: 'vui vẻ, tài hoa,口 phúc, làm việc sáng tạo tốt' },
  傷官: { d: -5, note: 'dễ cãi/khẩu thiệp, hao tiền, cẩn thận tình cảm' },
  偏財: { d: 3, note: 'tài bất ngờ/hao, hào phóng' },
  正財: { d: 4, note: 'tiến tài đều, việc tiền thuận' },
  七殺: { d: -4, note: 'áp lực, tiểu nhân, cẩn thận an toàn' },
  正官: { d: 4, note: 'danh vọng, quý nhân, việc quan quyền thuận' },
  偏印: { d: -2, note: 'cô, hay nghĩ nhiều, hao tài nguyên nhẹ' },
  正印: { d: 4, note: 'quý nhân, học/văn, có người giúp' },
};

/**
 * Phân tích 6 phái cho 1 ngày cụ thể.
 * @returns {{ date, ganZhi, score, rating, schools, bestActivity, avoidActivity, bestDirection, advice }}
 */
export function dailyPro(R, year, month, day) {
  const chart = R.chart;
  const dayGan = chart.dayGan;
  const birthYearZhi = chart.pillars.year.zhi;
  const dayZhi_pillar = chart.pillars.day.zhi;
  const yong = R.yong;

  const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const lunar = solar.getLunar();
  const dGan = lunar.getDayGan(), dZhi = lunar.getDayZhi();
  const mZhi = lunar.getMonthZhi();

  const schools = [];
  let score = 50;

  // PHÁI 1: Ngũ hành / Dụng Thần
  const dgWx = GAN[dGan].wx, dzWx = ZHI[dZhi].wx;
  const fav = new Set([yong.primary, yong.xi].filter(Boolean));
  const avoid = new Set([yong.ji, yong.chou]);
  let e1 = 0, e1note = `Can ${dGan}(${WX_VI[dgWx]}) + Chi ${dZhi}(${WX_VI[dzWx]}). `;
  if (fav.has(dgWx)) { e1 += 5; e1note += 'Can Dụng/Hỷ. '; }
  if (avoid.has(dgWx)) { e1 -= 6; e1note += 'Can Kỵ/Thù. '; }
  if (fav.has(dzWx)) { e1 += 4; e1note += 'Chi Dụng/Hỷ. '; }
  if (avoid.has(dzWx)) { e1 -= 5; e1note += 'Chi Kỵ/Thù. '; }
  score += e1;
  schools.push({ phai: 'Ngũ Hành/Dụng', d: e1, note: e1note });

  // PHÁI 2: Thập thần ngày
  const god = tenGod(dayGan, dGan);
  const gInfo = DAILY_GOD[god] || { d: 0, note: '' };
  score += gInfo.d;
  schools.push({ phai: 'Thập Thần', d: gInfo.d, note: `${TEN_GOD_VI[god]}: ${gInfo.note}` });

  // PHÁI 3: Trực (建除十二神)
  const oIdx = ((ZHI_ORDER.indexOf(dZhi) - ZHI_ORDER.indexOf(mZhi)) + 12) % 12;
  const officer = OFFICERS[oIdx];
  const road = OFFICER_ROAD[officer];
  let e3 = road === 'yellow' ? 3 : -2;
  score += e3;
  schools.push({ phai: 'Trực', d: e3, note: `Trực ${officer} (${TONE_WORD[road]}): ${road === 'yellow' ? 'nền cát' : 'nền hắc đạo, hạn chế việc lớn'}.` });

  // PHÁI 4: Chi 冲/害/刑 tuổi (cổ pháp 择日 — chi ngày phạm cả 3 dạng đều giảm cát)
  let e4 = 0, e4note = '';
  // 冲 (lớn nhất)
  if (CHONG[dZhi] === birthYearZhi || dZhi === CHONG[birthYearZhi]) { e4 -= 5; e4note += `Chi ${dZhi} xung tuổi ${birthYearZhi}. `; }
  if (CHONG[dZhi] === dayZhi_pillar || dZhi === CHONG[dayZhi_pillar]) { e4 -= 4; e4note += `Chi xung Nhật Chi (bản thân). `; }
  // 害 (穿 — nhẹ hơn 冲)
  if (HAI[dZhi] === birthYearZhi || dZhi === HAI[birthYearZhi]) { e4 -= 3; e4note += `Chi ${dZhi} hại tuổi ${birthYearZhi}. `; }
  if (HAI[dZhi] === dayZhi_pillar || dZhi === HAI[dayZhi_pillar]) { e4 -= 2; e4note += `Chi hại Nhật Chi. `; }
  // 刑 (刑罚 — cẩn thận quanphi/sức khoẻ)
  if (XING[dZhi] === birthYearZhi || dZhi === XING[birthYearZhi]) { e4 -= 3; e4note += `Chi ${dZhi} hình tuổi ${birthYearZhi} (cẩn thận quanphi). `; }
  if (XING[dZhi] === dayZhi_pillar || dZhi === XING[dayZhi_pillar]) { e4 -= 2; e4note += `Chi hình Nhật Chi. `; }
  // [loop 1004] 六合 — chi ngày HỢP tuổi/Nhật Chi = CÁT (thuận hoà, đối xứng 冲 penalty)
  if (LIUHE[dZhi] === birthYearZhi) { e4 += 3; e4note += `Chi ${dZhi} LỤC HỢP tuổi ${birthYearZhi} → thuận hoà, việc trôi chảy. `; }
  if (LIUHE[dZhi] === dayZhi_pillar) { e4 += 2; e4note += `Chi LỤC HỢP Nhật Chi (bản thân) → chủ nhật hanh thông. `; }
  if (!e4note) e4note = 'Chi ngày không phạm 冲/害/刑 với tuổi.';
  score += e4;
  schools.push({ phai: 'Xung/Hại/Hình/Hợp', d: e4, note: e4note });

  // PHÁI 5: Thần sát ngày (đào hoa/hồng diễm/dương nhận)
  let e5 = 0, e5note = '', e5YangRen = false; // [loop 27] flag dương nhận (tránh bug case-sensitive)
  const grp = BRANCH_GROUP[birthYearZhi];
  const grpDay = BRANCH_GROUP[dayZhi_pillar];
  if (TAO_HUA[grp] === dZhi || TAO_HUA[grpDay] === dZhi) { e5 -= 3; e5note += 'Đào hoa ngày. '; }
  if (HONG_YAN[dayGan] === dZhi) { e5 -= 3; e5note += 'Hồng diễm. '; }
  if (YANG_REN[dayGan] === dZhi) { e5 -= 4; e5note += 'Dương nhận (cẩn thận). '; e5YangRen = true; }
  if (YI_MA[grp] === dZhi || YI_MA[grpDay] === dZhi) { e5 += 2; e5note += 'Dịch mã (di chuyển tốt). '; }
  // [loop 365 nâng logic] thần sát CÁT ngày (cùng fix loop 364: trước đây chỉ score hung)
  if (TIAN_YI[dayGan] && TIAN_YI[dayGan].includes(dZhi)) { e5 += 3; e5note += 'Thiên Ất quý nhân (quý nhân phò). '; }
  if (WEN_CHANG[dayGan] === dZhi) { e5 += 2; e5note += 'Văn Xương (học/văn thuận). '; }
  if (JIANG_XING[grp] === dZhi) { e5 += 2; e5note += 'Tướng tinh (uy quyền). '; }
  if (!e5note) e5note = 'Không thần sát nổi.';
  score += e5;
  schools.push({ phai: 'Thần Sát', d: e5, note: e5note });

  // PHÁI 6: Thông thắng 宜忌
  const tsYi = lunar.getDayYi ? (lunar.getDayYi() || []) : [];
  const tsJi = lunar.getDayJi ? (lunar.getDayJi() || []) : [];
  let e6 = 0, e6note = '';
  if (tsYi.length > 5) { e6 += 2; e6note = `宜 ${tsYi.length} việc (nền tốt).`; }
  if (tsJi.length > 3) { e6 -= 1; e6note += ` 忌 ${tsJi.length} việc.`; }
  if (!e6note) e6note = `宜 ${tsYi.length}/忌 ${tsJi.length}.`;
  score += e6;
  schools.push({ phai: 'Thông Thắng', d: e6, note: e6note });

  // [loop 434 elevate] 大运基调 (silent) — completing temporal chain 大运→流年→流月→流日
  //   Daily weight is lightest (±1 total) — day inherits tiny decade influence.
  //   Applied silently (no visible school) to avoid repetition with 流年/流月 cards.
  try {
    const _dyAge = (year - R.chart.input.year);
    const _ad = (R.dayun || []).find((d) => _dyAge >= d.startAge && _dyAge < d.startAge + 10);
    if (_ad && _ad.gan && _ad.zhi) {
      const _dgWx = GAN[_ad.gan]?.wx, _dzWx = ZHI[_ad.zhi]?.wx;
      const _fav = new Set([yong.primary, yong.xi].filter(Boolean));
      const _avoid = new Set([yong.ji, yong.chou]);
      if (_fav.has(_dzWx)) score += 1;
      else if (_avoid.has(_dzWx)) score -= 1;
    }
  } catch (_) {}

  // Score
  score = Math.max(5, Math.min(98, Math.round(score)));
  // [loop 637 FIX] align thang liuri đã recalibrate loop 469→470 (54/48/44). Trước đây 65/48/35
  //   (Cát≥65 = top 5% — quá ngặt, 65% ngày «Hơi kỵ») → cùng ngày mâu thuẫn liuri (54/48/44).
  //   daily-pro distribution median 49 → 54/48/44 cân bằng (top 25% Cát, bottom 25% Hung).
  let rating = score >= 54 ? 'Cát' : score >= 48 ? 'Bình' : score >= 44 ? 'Hơi kỵ' : 'Hung';

  // Best activity / avoid
  const bestActivity = score >= 54 ? 'tiến thủ, ký kết, gặp quý nhân, làm việc lớn' : score >= 48 ? 'làm việc thường, tránh quyết định lớn' : 'giữ ổn định, tránh đầu tư/cãi vã/đi xa';
  const avoidActivity = `tránh ${tsJi.slice(0, 3).join(',')}${avoid.has(dgWx) ? ', đầu tư' : ''}${e5YangRen ? ', nguy hiểm (dương nhận — huyết quang)' : ''}`;

  // Best direction
  const caishen = lunar.getDayPositionCaiDesc ? lunar.getDayPositionCaiDesc() : '?';
  const xishen = lunar.getDayPositionXiDesc ? lunar.getDayPositionXiDesc() : '?';

  const advice = score >= 54
    ? `Hôm nay CÁT (${score}/100). Nên: ${bestActivity}. Hướng: ${caishen} (tài) / ${xishen} (hỷ).`
    : score >= 48
      ? `Hôm nay BÌNH (${score}/100). ${bestActivity}.`
      : `Hôm nay ${rating} (${score}/100). ${bestActivity}. ${avoidActivity}.`;

  return { date: solar.toYmd(), ganZhi: dGan + dZhi, officer, god: TEN_GOD_VI[god],
    score, rating, schools, tsYi: tsYi.slice(0, 6), tsJi: tsJi.slice(0, 4),
    bestActivity, avoidActivity, caishen, xishen, advice };
}
