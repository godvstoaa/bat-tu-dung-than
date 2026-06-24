// ============================================================================
//  TỬ VI LƯU NGUYỆT 紫微流月 — CUNG LUÂN PHIÊN HÀNG THÁNG (斗君-BASED)
//
//  QUY ƯỚC CHUẨN (chọn 1): 斗君-based — theo 《紫微斗数全书》 + iztro
//  (SylarLong/iztro), thư viện JS Tử Vi được đối chiếu với 文墨天机 (issue #250).
//
//  安斗君诀 (định 斗君 / 正月起例):
//    "以流年地支所在宫起，逆数至生月宫，再从该宫起子时，顺数至生时，
//     所落宫位即为斗君（= 流年正月宫）。"
//  → 斗君 idx (trong không gian địa chi, 0=子):
//      doujunIdx = (yearZhiIdx - birthLunarMonth + birthHourZhiIdx) mod 12
//
//  流月正月 = 斗君 cung; 各流月顺行十二宫，一月一宫:
//    流月 idx của tháng M (1-based) = (doujunIdx + M - 1) mod 12
//    Tương đương: liuyueIdx = (yearZhiIdx - birthMonth + birthHourZhiIdx + M) mod 12
//
//  Nguồn:
//    - 紫微斗数全书 (斗君起例)
//    - iztro FunctionalAstrolabe.ts::_getHoroscopeBySolarDate (monthlyIndex)
//    - 悟行阁 流月流日流时 (http://www.99986luck.com/Newsshow.asp?id=483)
//
//  Ghi chú phái别: một số phái (thường gọi "简化法") lấy 流年支 cung làm正月
//  (không phụ thuộc tháng/giờ sinh) — đó LÀ quy ước cũ của file này. Phái 斗君
//  phổ biến hơn và là chuẩn iztro/全书, nên ta chuyển sang nó cho nhất quán với
//  流日 (chuẩn nhất trí giữa các phái: 流日 = 流月 cung + lunarDay − 1).
// ============================================================================
import { Solar } from 'lunar-javascript';
import { computeZiwei } from './ziwei.js';

const ZHI_ORDER = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const MONTH_ZH = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];

const PALACE_THEME = {
  命宫: 'bản thân, sức khoẻ', 兄弟: 'huynh đệ/bạn bè', 夫妻: 'tình duyên',
  子女: 'con cái', 财帛: 'tài chính', 疾厄: 'sức khoẻ',
  迁移: 'di chuyển', 奴仆: 'quan hệ ngoài', 官禄: 'sự nghiệp',
  田宅: 'nhà cửa', 福德: 'tinh thần/phúc', 父母: 'cha mẹ/cấp trên',
};

/**
 * Quy đổi lunar-javascript getMonth() (trả SỐ ÂM cho tháng nhuận, e.g. -2 = 闰二月)
 * sang số tháng tuyệt đối dùng trong công thức luân phiên 12 cung.
 * Quy ước (theo iztro fixLunarMonthIndex + cách 数 全书): tháng nhuận tính như
 * tháng kế tiếp — 闰二月 → 3, 闰六月 → 7 (vì 闰 tháng chèn thêm 1 cung luân).
 * Tháng thường: trả nguyên giá trị dương.
 * @param {number} lm - lunar.getMonth() (1..12 thường, hoặc -1..-12 nhuận)
 * @returns {number} số tháng tuyệt đối (1..13)
 */
export function absLunarMonth(lm) {
  if (lm > 0) return lm;
  // lm âm → tháng nhuận của |lm|; tuyệt đối = |lm| + 1 (chèn thêm 1)
  return Math.abs(lm) + 1;
}

/**
 * Tính 流月 palace index (không gian địa chi, 0=子) cho 1 tháng,
 * theo quy ước 斗君-based chuẩn iztro/全书.
 *
 *   liuyueIdx = (yearZhiIdx - birthLunarMonth + birthHourZhiIdx + currentLunarMonth) mod 12
 *
 * Trong đó:
 *   - yearZhiIdx       = index địa chi của năm XEM (lưu niên), 0=子
 *   - birthLunarMonth  = tháng âm lịch SINH (số tuyệt đối, 1..13)
 *   - birthHourZhiIdx  = index địa chi của GIỜ SINH, 0=子
 *   - currentLunarMonth = tháng âm lịch ĐANG XEM (số tuyệt đối, 1..13)
 *
 * Đây chính là 斗君 cung (chính月) + (currentMonth − 1) cung thuận hành.
 *
 * @returns {number} index 0..11 trong ZHI_ORDER
 */
export function liuyuePalaceIndex(yearZhiIdx, birthLunarMonth, birthHourZhiIdx, currentLunarMonth) {
  const raw = yearZhiIdx - birthLunarMonth + birthHourZhiIdx + currentLunarMonth;
  return ((raw % 12) + 12) % 12;
}

/**
 * Helper: từ dữ liệu sinh + 1 ngày dương lịch bất kỳ →
 * { yearZhiIdx, birthLunarMonth, birthHourZhiIdx, currentLunarMonth, currentLunarDay,
 *   liuyueIdx, liuyueZhi }.
 * Dùng chung cho ziwei-liuyue (12 tháng) và ziwei-liuri (1 ngày).
 *
 * @param {object} input - {year,month,day,hour,minute,gender} dữ liệu SINH
 * @param {number} tYear/tMonth/tDay - ngày dương lịch ĐANG XEM
 */
export function ziweiLiuyueContext(input, tYear, tMonth, tDay) {
  const z = computeZiwei(input.year, input.month, input.day, input.hour ?? 12, input.minute ?? 0, input.gender);

  // --- Dữ liệu SINH ---
  const birthSolar = Solar.fromYmdHms(input.year, input.month, input.day, input.hour ?? 12, input.minute ?? 0, 0);
  const birthLunar = birthSolar.getLunar();
  const birthLunarMonth = absLunarMonth(birthLunar.getMonth()); // tháng sinh (tuyệt đối)
  const birthHourZhi = birthLunar.getTimeZhi();
  const birthHourZhiIdx = ZHI_ORDER.indexOf(birthHourZhi);

  // --- Dữ liệu NGÀY XEM ---
  const tHour = 12; // trưa — lấy can chi năm/tháng âm chuẩn (không phụ thuộc giờ xem)
  const tSolar = Solar.fromYmdHms(tYear, tMonth, tDay, tHour, 0, 0);
  const tLunar = tSolar.getLunar();
  const yearZhi = tLunar.getYearZhi();
  const yearZhiIdx = ZHI_ORDER.indexOf(yearZhi);
  const currentLunarMonth = absLunarMonth(tLunar.getMonth());
  const currentLunarDay = tLunar.getDay();

  const liuyueIdx = liuyuePalaceIndex(yearZhiIdx, birthLunarMonth, birthHourZhiIdx, currentLunarMonth);
  const liuyueZhi = ZHI_ORDER[liuyueIdx];

  return {
    z,
    yearZhi, yearZhiIdx,
    birthLunarMonth, birthHourZhi, birthHourZhiIdx,
    currentLunarMonth, currentLunarDay,
    liuyueIdx, liuyueZhi,
  };
}

/**
 * @param {number} birthYear..gender — sinh dữ liệu
 * @param {number} liunianYear — năm cần xem
 * @returns {{ year, yearZhi, months:[{m, mVi, gongZhi, palace, palaceVi, stars, theme}] }}
 */
export function ziweiLiuyue(birthYear, birthMonth, birthDay, birthHour, birthMinute, gender, liunianYear) {
  const input = { year: birthYear, month: birthMonth, day: birthDay, hour: birthHour, minute: birthMinute, gender };
  const z = computeZiwei(birthYear, birthMonth, birthDay, birthHour, birthMinute, gender);

  // --- Dữ liệu SINH (để tính 斗君) ---
  const birthSolar = Solar.fromYmdHms(birthYear, birthMonth, birthDay, birthHour ?? 12, birthMinute ?? 0, 0);
  const birthLunar = birthSolar.getLunar();
  const birthLunarMonth = absLunarMonth(birthLunar.getMonth());
  const birthHourZhiIdx = ZHI_ORDER.indexOf(birthLunar.getTimeZhi());

  // Lưu niên chi của năm xem
  const yearSolar = Solar.fromYmdHms(liunianYear, 6, 15, 12, 0, 0);
  const yearZhi = yearSolar.getLunar().getYearZhi();
  const yearZhiIdx = ZHI_ORDER.indexOf(yearZhi);

  // 斗君 (chính月起例) — ghi nhận cho thông tin, theo iztro/全书:
  //   "流年地支逆数至生月宫，再起子时顺数至生时，为正月所在宫"
  //   doujun = (yearZhiIdx - (birthMonth-1)) + birthHourZhiIdx  [treat 正月=寅起]
  //   ⇔ iztro arithmetic: yearlyIdx - birthMonth + birthHourZhi + 1
  const doujunIdx = ((yearZhiIdx - (birthLunarMonth - 1) + birthHourZhiIdx) % 12 + 12) % 12;

  // 12 tháng: 流月 idx = liuyuePalaceIndex(...) — DÙNG CHUNG hàm với ziwei-liuri.js
  // để hai module hoàn toàn nhất quán. (Tức doujunIdx + (M-1), M = 1..12.)
  const months = [];
  for (let i = 0; i < 12; i++) {
    const currentLunarMonth = i + 1; // 正月=1..腊月=12
    const gongIdx = liuyuePalaceIndex(yearZhiIdx, birthLunarMonth, birthHourZhiIdx, currentLunarMonth);
    const gongZhi = ZHI_ORDER[gongIdx];
    const palace = z.palaces.find((p) => p.zhi === gongZhi);
    const stars = palace?.stars || [];
    const theme = PALACE_THEME[palace?.zh] || '?';

    const catStars = stars.filter((s) => ['紫微','天府','太阳','太阴','武曲','天相','左辅','右弼','文昌','文曲','天魁','天钺'].includes(s));
    const hungStars = stars.filter((s) => ['七杀','破军','贪狼','巨门','廉贞','擎羊','陀罗'].includes(s));
    let tone = catStars.length > hungStars.length ? 'cat' : hungStars.length > 0 ? 'hung' : 'mid';

    months.push({
      m: i, mVi: `T${i + 1} (${MONTH_ZH[i]}月)`,
      gongZhi, palace: palace?.zh || '?', palaceVi: palace?.vi?.split('(')[0] || '?',
      stars, theme, tone,
    });
  }

  return { year: liunianYear, yearZhi, doujunIdx, months };
}

export { ZHI_ORDER, PALACE_THEME };
