// ============================================================================
//  黄历月神吉日 — THIÊN Y / NGUYỆT ÂN (天医日/月恩日) 择日
//  "Ngày nào TỐT cho sức khoẻ (天医) / việc chung (月恩)?" — bổ 天赦/四德.
//  * 天医日 (theo chi tháng — 月支前一辰): 寅月丑, 卯月寅, 辰月卯 ... 丑月子.
//    Ngày có chi = Thiên Y chi của tháng → THIÊN Y NHẬT, «thiên y đáo, vạn bệnh
//    trừ»:宜 cầu y/trị bệnh/phục thuốc/châm cứu/khởi đầu liệu trình sức khoẻ.
//  * 月恩日 (theo can — 丙丁庚辛壬癸 chuỗi, nửa năm lặp): 寅月丙, 卯月丁, 辰月庚,
//    巳月辛, 午月壬, 未月癸, 申月丙 ... Ngày có can = Nguyệt Ân can của tháng →
//    NGUYỆT ÂN NHẬT, «dương kiến sở sinh»:宜 doanh tạo/hôn nhân/dời nhà/tế tự/
//    thượng quan/nạp tài (cát đa dụng).
//  Khác zheri-stars (天赦/四废/十恶) & deri (四德): module này = 2 thần tháng (y/kha).
//  Nguồn: 历例 五行论 月恩, 新浪 天医日起例, 知乎 撼龙风水 月神吉类.
// ============================================================================
import { Solar } from 'lunar-javascript';

// 天医 chi theo chi tháng (前一辰)
const TIAN_YI = { 寅: '丑', 卯: '寅', 辰: '卯', 巳: '辰', 午: '巳', 未: '午', 申: '未', 酉: '申', 戌: '酉', 亥: '戌', 子: '亥', 丑: '子' };
// 月恩 can theo chi tháng (丙丁庚辛壬癸 ×2)
const YUE_EN = { 寅: '丙', 卯: '丁', 辰: '庚', 巳: '辛', 午: '壬', 未: '癸', 申: '丙', 酉: '丁', 戌: '庚', 亥: '辛', 子: '壬', 丑: '癸' };
// 天愿 ganZhi theo chi tháng (协纪辨方书 神煞起例 — 12 fixed ganZhi, "宜一切")
const TIAN_YUAN = { 寅: '乙亥', 卯: '甲戌', 辰: '乙酉', 巳: '丙申', 午: '丁未', 未: '戊午', 申: '己巳', 酉: '庚辰', 戌: '辛卯', 亥: '壬寅', 子: '癸丑', 丑: '甲子' };

const INFO = {
  tianYi: { vi: 'Thiên Y', note: 'Thiên Y nhật — «thiên y đáo, vạn bệnh trừ». Cầu y/trị bệnh/phục thuốc/châm cứu/khởi đầu liệu trình sức khoẻ đều CÁT.' },
  yueEn: { vi: 'Nguyệt Ân', note: 'Nguyệt Ân nhật — «dương kiến sở sinh». Việc chung (dinh dựng/hôn nhân/dời nhà/tế tự/nhận chức/nạp tài) đều CÁT.' },
  tianYuan: { vi: 'Thiên Nguyện', note: 'Thiên Nguyện nhật — «nghi nhất thiết» (宜祭祀/祈福/ cầu tự/ hưng tạo động thổ/ khai thị lập quyềnen giao dịch). CÁT tổng hợp, bổ 天赦.' },
};

function dayInfo(year, month, day) {
  const s = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const l = s.getLunar();
  return { dGan: l.getDayGan(), dZhi: l.getDayZhi(), mZhi: l.getMonthZhi(), solar: s.toYmd(), lunar: `${l.getMonthInChinese()}月${l.getDayInChinese()}`, ganZhi: l.getDayGan() + l.getDayZhi() };
}

/**
 * @returns {{ solar, lunar, ganZhi, hits:[{key,keyVi,note}], isAuspicious }}
 */
export function analyzeMonthShen(year, month, day) {
  const { dGan, dZhi, mZhi, solar, lunar, ganZhi } = dayInfo(year, month, day);
  const hits = [];
  if (dZhi === TIAN_YI[mZhi]) hits.push({ key: 'tianYi', keyVi: INFO.tianYi.vi, note: INFO.tianYi.note });
  if (dGan === YUE_EN[mZhi]) hits.push({ key: 'yueEn', keyVi: INFO.yueEn.vi, note: INFO.yueEn.note });
  if (ganZhi === TIAN_YUAN[mZhi]) hits.push({ key: 'tianYuan', keyVi: INFO.tianYuan.vi, note: INFO.tianYuan.note });
  return { solar, lunar, ganZhi, hits, isAuspicious: hits.length > 0 };
}

/**
 * Quét 1 năm: liệt kê Thiên Y + Nguyệt Ân + Thiên Nguyện ngày.
 */
export function monthShenInYear(year) {
  const tianYi = [], yueEn = [], tianYuan = [];
  const d = new Date(year, 0, 1);
  for (let i = 0; i < 366; i++) {
    const y = d.getFullYear(), m = d.getMonth() + 1, dd = d.getDate();
    if (y !== year) break;
    let info;
    try { info = analyzeMonthShen(y, m, dd); } catch (e) { d.setDate(d.getDate() + 1); continue; }
    if (info.hits.some((h) => h.key === 'tianYi')) tianYi.push({ solar: info.solar, ganZhi: info.ganZhi });
    if (info.hits.some((h) => h.key === 'yueEn')) yueEn.push({ solar: info.solar, ganZhi: info.ganZhi });
    if (info.hits.some((h) => h.key === 'tianYuan')) tianYuan.push({ solar: info.solar, ganZhi: info.ganZhi });
    d.setDate(d.getDate() + 1);
  }
  return { year, tianYi, yueEn, tianYuan, summary: `Năm ${year}: ${tianYi.length} Thiên Y (cát sức khoẻ), ${yueEn.length} Nguyệt Ân (cát việc chung), ${tianYuan.length} Thiên Nguyện nhật («nghi nhất thiết»).` };
}

/** 3 ngày Thiên Y tới (công cụ: khởi đầu liệu trình sức khoẻ). */
export function nextTianYi(fromYear, fromMonth, fromDay, count = 3) {
  const out = [];
  const d = new Date(fromYear, fromMonth - 1, fromDay);
  for (let i = 0; i < 400 && out.length < count; i++) {
    const y = d.getFullYear(), m = d.getMonth() + 1, dd = d.getDate();
    try { const info = analyzeMonthShen(y, m, dd); if (info.hits.some((h) => h.key === 'tianYi')) out.push({ solar: info.solar, ganZhi: info.ganZhi }); } catch (e) {}
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export { TIAN_YI, YUE_EN, TIAN_YUAN, INFO };
