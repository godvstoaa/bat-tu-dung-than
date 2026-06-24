// ============================================================================
//  黄历凶日 — NHẬT HUNG (月破/月厌/往亡) 黄历择日 "忌"
//  "Ngày nào KỴ làm việc lớn?" — bổ 天赦/四德 (nhật cát) bằng nhật hung (kiêng).
//  * 月破 (大耗): chi ngày XUNG chi tháng → khí tán, kỵ MỌI việc cát (khai trương/
//    cưới/dọn nhà/ký kết). Hung lớn, "đại hao".
//  * 月厌: chi ngày = vị trí "thường chán" của tháng → kỵ hôn nhân/dọn nhà, chủ ảm.
//  * 往亡: chi ngày = vị trí "vãng vong" của tháng → kỵ XUẤT HÀNH/tòng sự/hôn.
//  (Công thức đều theo chi tháng — CHẮC CHẮN, không phụ thuộc节气.)
//  Khi một ngày cát (天赦/四德) trùng hung nhật → cát giảm; khi chọn ngày tốt
//    PHẢI tránh hung nhật. Khác zheri-stars/deri (nhật cát): module này = nhật KỴ.
//  Nguồn: 钦定协纪辨方书 月破月厌往亡, 福山堂 黄历神煞, 永乐大典 择吉避凶.
// ============================================================================
import { Solar } from 'lunar-javascript';

const CHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
// 月厌 theo chi tháng (đảo từ 戌)
const YUE_YAN = { 寅: '戌', 卯: '酉', 辰: '申', 巳: '未', 午: '午', 未: '巳', 申: '辰', 酉: '卯', 戌: '寅', 亥: '丑', 子: '子', 丑: '亥' };
// 往亡 theo chi tháng
const WANG_WANG = { 寅: '巳', 卯: '寅', 辰: '丑', 巳: '亥', 午: '卯', 未: '寅', 申: '午', 酉: '酉', 戌: '未', 亥: '辰', 子: '申', 丑: '戌' };

const INFO = {
  月破: { vi: 'Nguyệt Phá (Đại Hao)', severity: 8, note: 'chi ngày xung chi tháng → khí tán, kỵ MỌI việc cát: khai trương/cưới/dọn nhà/ký kết/động thổ. Hung lớn.' },
  月厌: { vi: 'Nguyệt Yếm', severity: 5, note: 'chi ngày = vị "thường chán" → kỵ hôn nhân/dọn nhà, chủ ảm đạm, tình cảm lạnh.' },
  往亡: { vi: 'Vãng Vong', severity: 6, note: 'chi ngày = vị "đi thì vong" → kỵ XUẤT HÀNH/tòng sự/hôn nhân, đi xa bất lợi.' },
};

function dayInfo(year, month, day) {
  const s = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const l = s.getLunar();
  return { dZhi: l.getDayZhi(), mZhi: l.getMonthZhi(), solar: s.toYmd(), lunar: `${l.getMonthInChinese()}月${l.getDayInChinese()}`, ganZhi: l.getDayGan() + l.getDayZhi() };
}

/**
 * Phân tích 1 ngày: phạm hung nhật nào.
 * @returns {{ solar, lunar, ganZhi, hits:[{type,typeVi,severity,note}], isXiong }}
 */
export function analyzeXiongRi(year, month, day) {
  const { dZhi, mZhi, solar, lunar, ganZhi } = dayInfo(year, month, day);
  const hits = [];
  if (dZhi === CHONG[mZhi]) hits.push({ type: '月破', typeVi: INFO['月破'].vi, severity: INFO['月破'].severity, note: INFO['月破'].note });
  if (dZhi === YUE_YAN[mZhi]) hits.push({ type: '月厌', typeVi: INFO['月厌'].vi, severity: INFO['月厌'].severity, note: INFO['月厌'].note });
  if (dZhi === WANG_WANG[mZhi]) hits.push({ type: '往亡', typeVi: INFO['往亡'].vi, severity: INFO['往亡'].severity, note: INFO['往亡'].note });
  return { solar, lunar, ganZhi, hits, isXiong: hits.length > 0 };
}

/**
 * Quét 1 năm: thống kê hung nhật + liệt kê Nguyệt Phá (hung lớn nhất).
 */
export function xiongRiInYear(year) {
  let total = 0, yuePo = 0;
  const d = new Date(year, 0, 1);
  for (let i = 0; i < 366; i++) {
    const y = d.getFullYear(), m = d.getMonth() + 1, dd = d.getDate();
    if (y !== year) break;
    let info;
    try { info = analyzeXiongRi(y, m, dd); } catch (e) { d.setDate(d.getDate() + 1); continue; }
    if (info.isXiong) {
      total++;
      if (info.hits.some((h) => h.type === '月破')) yuePo++;
    }
    d.setDate(d.getDate() + 1);
  }
  return { year, totalXiong: total, yuePoCount: yuePo, summary: `Năm ${year}: ${total} hung nhật (Nguyệt Phá ${yuePo}, Nguyệt Yếm, Vãng Vong). Khi chọn ngày làm việc lớn → PHẢI tránh các hung nhật này (đặc biệt Nguyệt Phá).` };
}

export { CHONG, YUE_YAN, WANG_WANG, INFO };
