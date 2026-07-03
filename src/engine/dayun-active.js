// ============================================================================
//  getActiveDayun — chuẩn hoá activeDayun contract (loop 1349, grok audit)
//  Trước đây: forecast5().activeDayun = STRING, scanSuiyun().activeDayun = OBJECT,
//  + forecast5 dùng startYear còn scanSuiyun dùng startAge (lệch 1 虚岁 ở ranh giới).
//  → consumer dễ type-mismatch («undefined»).
//  Giờ: 1 helper duy nhất, trả dayun entry ĐẦY ĐỦ (object) | null, dùng startYear
//  (khớp analyzeLiunianDeep — cổ pháp 用年不用虚岁 cho ranh giới đại vận).
// ============================================================================

/**
 * Trả ĐẠI VẬN đang hành (dayun entry) cho 1 năm dương lịch.
 * @param {object} R - kết quả analyze()
 * @param {number} year - năm dương lịch
 * @returns {object|null} dayun entry {ganZhi, startAge, startYear, gan, zhi, ganGod, ...} | null
 */
export function getActiveDayun(R, year) {
  const dy = R && R.dayun;
  if (!Array.isArray(dy) || !dy.length) return null;
  if (typeof year !== 'number' || !Number.isFinite(year)) return null;
  // [loop 22] giải theo startYear (năm dương lịch), KHÔNG theo startAge (虚岁) — khớp analyzeLiunianDeep.
  return dy.find((d) => d && d.startYear != null && d.startYear <= year && year < d.startYear + 10) || null;
}
