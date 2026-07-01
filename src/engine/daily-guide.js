// ============================================================================
//  DẪN DẮT HÀNG NGÀY 每日决策指南 — DAILY DECISION SYNTHESIS
//  Tổng hợp 6 module daily thành 1 "hôm nay mặc gì/hướng nào/giờ nào/làm gì".
//  Khác daily-pro (6 phái): module này là BỔ ÍCH HỢP NHẤT 1 lần đọc.
//  Nguồn: tổng hợp từ daily-pro + daily-directions + lucky-hours + clothing + tongsheng.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { tenGod } from './core.js';

const ZHI_ORDER = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const OFFICERS = ['建','除','满','平','定','执','破','危','成','收','开','闭'];
const OFFICER_ROAD = { 建:'black', 满:'black', 平:'black', 收:'black', 破:'black', 闭:'black', 除:'yellow', 危:'yellow', 定:'yellow', 执:'yellow', 成:'yellow', 开:'yellow' };
const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };
// [loop 1006] 六合 — chi ngày HỢP tuổi/Nhật Chi = CÁT (đối xứng 冲 penalty)
const LIUHE = { 子:'丑', 丑:'子', 寅:'亥', 亥:'寅', 卯:'戌', 戌:'卯', 辰:'酉', 酉:'辰', 巳:'申', 申:'巳', 午:'未', 未:'午' };
// [loop 1095/1096] 忌/宜 hoạt động (通胜 getDayJi/getDayYi) → Việt. Export để daily-pro/
//   move-fs/wedding-date reuse (trước đây các module này leak raw Chinese vào UI Việt).
export const JI_VI = {
  嫁娶: 'cưới hỏi', 入宅: 'dọn nhà mới', 移徙: 'chuyển nhà', 动土: 'động thổ', 修造: 'sửa chữa/xây',
  安葬: 'an táng', 破土: 'đào huyệt', 出行: 'đi xa', 开市: 'mở hàng', 立券: 'ký hợp đồng', 交易: 'giao dịch',
  栽种: 'trồng trọt', 伐木: 'chặt gỗ', 开渠: 'đào kênh', 穿井: 'đào giếng', 破屋: 'phá nhà', 词讼: 'kiện tụng',
  安床: 'lắp giường', 安机: 'lắp máy', 上梁: 'gác đòn đông', 求医: 'khám bệnh', 针灸: 'châm cứu',
  冠笄: 'lễ thành niên', 出火: 'di chuyển bếp', 进人口: 'nhận người ở', 搬家: 'dọn nhà', 赴任: 'nhận chức',
};
export const YI_VI = {
  嫁娶: 'cưới hỏi', 入宅: 'dọn nhà mới', 移徙: 'chuyển nhà', 动土: 'động thổ', 修造: 'sửa chữa/xây',
  开市: 'mở hàng', 立券: 'ký hợp đồng', 交易: 'giao dịch', 出行: 'đi xa', 栽种: 'trồng trọt',
  祈福: 'cầu phúc', 祭祀: 'tế tự', 安葬: 'an táng', 破屋: 'phá nhà', 求嗣: 'cầu con', 入学: 'nhập học',
  移徙: 'chuyển nhà', 安床: 'lắp giường', 上梁: 'gác đòn đông', 开仓: 'mở kho', 纳财: 'thu tài',
};
const ZHI_VI_TIME = { 子:'Tý (23-1h)', 丑:'Sửu (1-3h)', 寅:'Dần (3-5h)', 卯:'Mão (5-7h)', 辰:'Thìn (7-9h)', 巳:'Tỵ (9-11h)', 午:'Ngọ (11-13h)', 未:'Mùi (13-15h)', 申:'Thân (15-17h)', 酉:'Dậu (17-19h)', 戌:'Tuất (19-21h)', 亥:'Hợi (21-23h)' };

const WX_DAILY_COLOR = {
  木: { primary: 'xanh lá/xanh ngọc', accent: 'nâu xanh' },
  火: { primary: 'đỏ/hồng/cam', accent: 'tím' },
  土: { primary: 'vàng/nâu/be', accent: 'vàng kem' },
  金: { primary: 'trắng/xám/bạc', accent: 'champagne' },
  水: { primary: 'đen/navy/xanh đậm', accent: 'xám than' },
};

/**
 * @returns {{ date, lunar, ganZhi, god, score, rating, color, bestDir,
 *            bestHours, avoidHours, tongShengYi, tongShengJi,
 *            activities:{go:[], caution:[], avoid:[]}, oneLiner, full }}
 */
export function dailyGuide(R, year, month, day) {
  const chart = R.chart;
  const yong = R.yong;
  const dayGan = chart.dayGan;
  const birthYearZhi = chart.pillars.year.zhi;
  const dayZhi_pillar = chart.pillars.day.zhi;

  const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const lunar = solar.getLunar();
  const dGan = lunar.getDayGan(), dZhi = lunar.getDayZhi();
  const mZhi = lunar.getMonthZhi();

  // --- Score (6 phái rút gọn) ---
  let score = 50;
  // [loop 566 FIX] guard yong undefined — trước đây crash TypeError.
  const _y = yong || {};
  const fav = new Set([_y.primary, _y.xi].filter(Boolean));
  const avoid = new Set([_y.ji, _y.chou].filter(Boolean));
  const dgWx = GAN[dGan].wx, dzWx = ZHI[dZhi].wx;
  if (fav.has(dgWx)) score += 6; if (avoid.has(dgWx)) score -= 7;
  if (fav.has(dzWx)) score += 4; if (avoid.has(dzWx)) score -= 5;

  const god = tenGod(dayGan, dGan);
  const GOD_D = { 正財:8, 食神:6, 正官:4, 正印:4, 偏財:3, 偏印:-1, 比肩:-2, 傷官:-5, 七殺:-6, 劫財:-8 };
  score += GOD_D[god] || 0;

  const oIdx = ((ZHI_ORDER.indexOf(dZhi) - ZHI_ORDER.indexOf(mZhi)) + 12) % 12;
  const officer = OFFICERS[oIdx];
  score += OFFICER_ROAD[officer] === 'yellow' ? 4 : -3;

  if (CHONG[dZhi] === birthYearZhi) score -= 6;
  if (CHONG[dZhi] === dayZhi_pillar) score -= 5;
  // [loop 1006] 六合 reward (cùng fix loop 1004/1005) — chi ngày LỤC HỢP tuổi/Nhật Chi = CÁT
  if (LIUHE[dZhi] === birthYearZhi) score += 4;
  if (LIUHE[dZhi] === dayZhi_pillar) score += 3;

  // Thông thắng 宜忌
  const tsYi = lunar.getDayYi ? (lunar.getDayYi() || []) : [];
  const tsJi = lunar.getDayJi ? (lunar.getDayJi() || []) : [];
  if (tsYi.length > 5) score += 2;

  score = Math.max(5, Math.min(98, Math.round(score)));
  const rating = score >= 54 ? 'Cát' : score >= 48 ? 'Bình' : score >= 44 ? 'Hơi kỵ' : 'Hung'; // [loop 637] align thang liuri 54/48/44 (đã recalibrate loop 469→470)

  // --- Color ---
  const deityColorWx = score >= 50 ? yong.primary : yong.xi;
  const color = WX_DAILY_COLOR[deityColorWx] || WX_DAILY_COLOR['土'];
  // Override: if Kỵ can → wear color to balance
  const kyColor = WX_DAILY_COLOR[yong.ji];
  const colorAdvice = avoid.has(dgWx)
    ? `Hôm nay can ${WX_VI[dgWx]} (Kỵ/Thù) → mặc MÀU ${color.primary} (Dụng ${WX_VI[yong.primary]}) để hóa giải + tăng vượng.`
    : `Mặc màu ${color.primary} (Dụng ${WX_VI[deityColorWx]}) → tăng vận.`;

  // --- Direction ---
  const caishen = lunar.getDayPositionCaiDesc ? lunar.getDayPositionCaiDesc() : '?';
  const xishen = lunar.getDayPositionXiDesc ? lunar.getDayPositionXiDesc() : '?';
  const fushen = lunar.getDayPositionFuDesc ? lunar.getDayPositionFuDesc() : '?';
  const bestDir = score >= 50 ? caishen : fushen;

  // --- Hours ---
  const hours = [];
  for (let i = 0; i < 12; i++) {
    const zhi = ZHI_ORDER[i];
    const oIdx2 = ((i - ZHI_ORDER.indexOf(dZhi)) + 12) % 12;
    const road = OFFICER_ROAD[OFFICERS[oIdx2]];
    const clashYou = CHONG[zhi] === birthYearZhi;
    hours.push({ zhi, vi: ZHI_VI_TIME[zhi], road, clashYou, tone: road === 'yellow' ? 'cát' : 'hung' });
  }
  const bestHours = hours.filter(h => h.tone === 'cát' && !h.clashYou).map(h => h.vi);
  const avoidHours = hours.filter(h => h.clashYou || h.tone === 'hung').slice(0, 3).map(h => h.vi);

  // --- Activities ---
  const activities = { go: [], caution: [], avoid: [] };
  if (tsYi.includes('开市') || tsYi.includes('交易') || tsYi.includes('立券')) activities.go.push('ký kết/kinh doanh');
  if (tsYi.includes('嫁娶') || tsYi.includes('祈福')) activities.go.push('hẹn hò/cưới');
  if (tsYi.includes('入宅') || tsYi.includes('移徙')) activities.go.push('dọn nhà');
  if (tsYi.includes('动土') || tsYi.includes('修造')) activities.go.push('xây dựng/sửa chữa');
  if (tsYi.includes('出行')) activities.go.push('đi xa');
  if (tsYi.includes('祈福') || tsYi.includes('祭祀')) activities.go.push('tế tự/cầu phúc');

  activities.caution.push('quyết định lớn nếu chưa rõ');
  if (avoid.has(dgWx)) activities.caution.push('đầu tư/chi tiêu lớn (can Kỵ)');
  if (CHONG[dZhi] === birthYearZhi) activities.caution.push('xung tuổi — cẩn thận');

  tsJi.slice(0, 3).forEach((j) => activities.avoid.push(JI_VI[j] || j)); // [loop 1095] dịch 忌 sang Việt (trước đây push raw Chinese)

  // --- One-liner ---
  const oneLiner = `${rating} (${score}) · ${TEN_GOD_VI[god]} · mặc ${color.primary.split('/')[0]} · hướng ${bestDir} · giờ tốt ${bestHours.slice(0,2).join(', ')}`;

  // --- Full summary ---
  const full = `📅 ${solar.toYmd()} (${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}) ${dGan}${dZhi} | ${TEN_GOD_VI[god]} | Trực ${officer} (${OFFICER_ROAD[officer] === 'yellow' ? '黄道' : '黑道'})\n` +
    `📊 Điểm: ${score}/100 (${rating})\n` +
    `👕 Màu: ${colorAdvice}\n` +
    `🧭 Hướng: Tài→${caishen} · Hỷ→${xishen} · Phúc→${fushen}\n` +
    `⏰ Giờ tốt: ${bestHours.join(', ')}\n` +
    `⚠ Giờ tránh: ${avoidHours.join(', ')}\n` +
    `✅ Nên: ${activities.go.length ? activities.go.join(', ') : 'duy trì việc thường'}\n` +
    `⚠ Cẩn thận: ${activities.caution.join('; ')}\n` +
    `❌ Tránh: ${activities.avoid.length ? activities.avoid.join(', ') : '(không)'}`;

  return {
    date: solar.toYmd(), lunar: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    ganZhi: dGan + dZhi, officer, officerRoad: OFFICER_ROAD[officer],
    god, godVi: TEN_GOD_VI[god], score, rating,
    color, colorAdvice,
    bestDir, caishen, xishen, fushen,
    bestHours, avoidHours, allHours: hours,
    activities, tsYi: tsYi.slice(0, 6), tsJi: tsJi.slice(0, 4),
    oneLiner, full,
  };
}
