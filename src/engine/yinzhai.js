// ============================================================================
//  YĪN ZHÁI 阴宅 — PHONG THỦY MỘ PARTÁ (二十四山立向分金)
//  Hệ thống la bàn 24 sơn dùng trong âm phần (chọn hướng mộ phần).
//  Bao gồm: 二十四山 (24 sơn) + 立向吉凶 (cát/hung hướng) + 消砂纳水 (sa - thuỷ).
//  Nguồn: 罗经透解 · 青囊经 · 撼龙经 · 疑龙经 (Hệ Hoàng Học).
// ============================================================================
//
//  BỐ CỤC 24 SƠN (mỗi sơn 15°, xoay theo kim chỉ nam):
//    壬 子 癸 | 丑 艮 寅 | 甲 卯 乙 | 辰 巽 巳 | 丙 午 丁 | 未 坤 申 | 庚 酉 辛 | 戌 乾 亥
//  8 cung chính (八方) × 3 sơn/cung = 24. Mỗi sơn thuộc 1 quẻ/cung:
//    Bắc (坎) = 壬子癸 · Đông Bắc (艮) = 丑艮寅 · Đông (震) = 甲卯乙 · Đông Nam (巽) = 辰巽巳
//    Nam (离) = 丙午丁 · Tây Nam (坤) = 未坤申 · Tây (兑) = 庚酉辛 · Tây Bắc (乾) = 戌乾亥
// ============================================================================

// ---------------------------------------------------------------------------
// PHẦN 1: 二十四山 (24 SƠN) — toạ độ + ngũ hành + âm dương + 72 long phân kim
// ---------------------------------------------------------------------------
// Mỗi sơn 15° lại chia 3 phần (5°/phần) → 72 long (72 con rồng đất) dùng cho
// phân kim (chọn độ chính xác trong sơn). Mỗi long có thiên cán + ngũ hành nạp.
//
// QUY ƯỚC long72 (穿山七十二龙 / 穿山虎 / 地纪) — sửa lỗi 2026-06:
// Bảng long72 theo hệ 杨公 (Dương Công) — 穿山七十二龙 (địa bàn chính châm),
// quy ước phổ biến nhất, được đối chiếu 3 nguồn độc lập:
//   1. 福山堂 fushantang.com — "穿山七十二龙" (liệt kê đầy đủ 24 sơn × 3 long)
//   2. 搜狐 sohu.com/a/348731491_435999 — "罗盘的使用讲解5：穿山七十二龙"
//   3. 周易名家百科 zymjbk.com — 刘宝金 "罗盘详解之第七层 穿山七十二龙"
// Nguyên tắc:
//   - 甲子起于地盘壬位之末 (甲子 bắt đầu ở rìa cuối sơn Nhâm, sát sơn Tý);
//     sơn 壬 chứa cuối chu kỳ trước (癸亥) + 空亡 + đầu chu kỳ mới (甲子).
//   - Mỗi chi dưới xếp 5 long (dương chi: 甲丙戊庚壬; âm chi: 乙丁己辛癸),
//     phân qua 2 sơn kẹp 1 sơn ranh giới 干/维.
//   - 8 天干 (甲乙丙丁庚辛壬癸) + 4 四维 (艮巽坤乾) = 12 sơn ranh giới,
//     giữa mỗi sơn ranh giới có 1 ô 空亡 (đại không vong) → 12 空亡 markers.
//   - Tổng cộng 60 甲 tử + 12 空亡 = 72 long. KHÔNG có cặp 干+干 hay 支+支.
// Ghi chú lưu phái: hệ 透地六十龙 (天纪) có cách xếp khác (甲子起壬初, không
// 空亡), nhưng đây là module 穿山 (địa kỷ, dùng để cách long/选向 mộ phần) nên
// theo quy ước 穿山 72 long (有 空亡 ở 干/维).

export const MOUNTAINS_24 = [
  // —— BẮC (坎 Khảm - Thuỷ) — 3 sơn —
  { idx: 0,  zhi: '壬', vi: 'Nhâm', dir: '337.5°-352.5°', palace: '坎', palaceVi: 'Khảm (Bắc)', wx: '水', wxVi: 'Thuỷ', yinYang: '阳', yinYangVi: 'Dương', long72: ['癸亥','空亡','甲子'] },
  { idx: 1,  zhi: '子', vi: 'Tý',   dir: '352.5°-7.5°',   palace: '坎', palaceVi: 'Khảm (Bắc)', wx: '水', wxVi: 'Thuỷ', yinYang: '阴', yinYangVi: 'Âm',   long72: ['丙子','戊子','庚子'] },
  { idx: 2,  zhi: '癸', vi: 'Quý',  dir: '7.5°-22.5°',    palace: '坎', palaceVi: 'Khảm (Bắc)', wx: '水', wxVi: 'Thuỷ', yinYang: '阴', yinYangVi: 'Âm',   long72: ['壬子','空亡','乙丑'] },

  // —— ĐÔNG BẮC (艮 Cấn - Thổ) — 3 sơn —
  { idx: 3,  zhi: '丑', vi: 'Sửu',  dir: '22.5°-37.5°',   palace: '艮', palaceVi: 'Cấn (Đông Bắc)', wx: '土', wxVi: 'Thổ', yinYang: '阴', yinYangVi: 'Âm',   long72: ['丁丑','己丑','辛丑'] },
  { idx: 4,  zhi: '艮', vi: 'Cấn',  dir: '37.5°-52.5°',   palace: '艮', palaceVi: 'Cấn (Đông Bắc)', wx: '土', wxVi: 'Thổ', yinYang: '阳', yinYangVi: 'Dương', long72: ['癸丑','空亡','丙寅'] },
  { idx: 5,  zhi: '寅', vi: 'Dần',  dir: '52.5°-67.5°',   palace: '艮', palaceVi: 'Cấn (Đông Bắc)', wx: '木', wxVi: 'Mộc', yinYang: '阳', yinYangVi: 'Dương', long72: ['戊寅','庚寅','壬寅'] },

  // —— ĐÔNG (震 Chấn - Mộc) — 3 sơn —
  { idx: 6,  zhi: '甲', vi: 'Giáp', dir: '67.5°-82.5°',   palace: '震', palaceVi: 'Chấn (Đông)', wx: '木', wxVi: 'Mộc', yinYang: '阳', yinYangVi: 'Dương', long72: ['甲寅','空亡','丁卯'] },
  { idx: 7,  zhi: '卯', vi: 'Mão',  dir: '82.5°-97.5°',   palace: '震', palaceVi: 'Chấn (Đông)', wx: '木', wxVi: 'Mộc', yinYang: '阴', yinYangVi: 'Âm',   long72: ['己卯','辛卯','癸卯'] },
  { idx: 8,  zhi: '乙', vi: 'Ất',   dir: '97.5°-112.5°',  palace: '震', palaceVi: 'Chấn (Đông)', wx: '木', wxVi: 'Mộc', yinYang: '阴', yinYangVi: 'Âm',   long72: ['乙卯','空亡','戊辰'] },

  // —— ĐÔNG NAM (巽 Tốn - Mộc) — 3 sơn —
  { idx: 9,  zhi: '辰', vi: 'Thìn', dir: '112.5°-127.5°', palace: '巽', palaceVi: 'Tốn (Đông Nam)', wx: '土', wxVi: 'Thổ', yinYang: '阳', yinYangVi: 'Dương', long72: ['庚辰','壬辰','甲辰'] },
  { idx: 10, zhi: '巽', vi: 'Tốn',  dir: '127.5°-142.5°', palace: '巽', palaceVi: 'Tốn (Đông Nam)', wx: '木', wxVi: 'Mộc', yinYang: '阳', yinYangVi: 'Dương', long72: ['丙辰','空亡','己巳'] },
  { idx: 11, zhi: '巳', vi: 'Tỵ',   dir: '142.5°-157.5°', palace: '巽', palaceVi: 'Tốn (Đông Nam)', wx: '火', wxVi: 'Hoả', yinYang: '阴', yinYangVi: 'Âm',   long72: ['辛巳','癸巳','乙巳'] },

  // —— NAM (离 Ly - Hoả) — 3 sơn —
  { idx: 12, zhi: '丙', vi: 'Bính', dir: '157.5°-172.5°', palace: '离', palaceVi: 'Ly (Nam)', wx: '火', wxVi: 'Hoả', yinYang: '阳', yinYangVi: 'Dương', long72: ['丁巳','空亡','庚午'] },
  { idx: 13, zhi: '午', vi: 'Ngọ',  dir: '172.5°-187.5°', palace: '离', palaceVi: 'Ly (Nam)', wx: '火', wxVi: 'Hoả', yinYang: '阴', yinYangVi: 'Âm',   long72: ['壬午','甲午','丙午'] },
  { idx: 14, zhi: '丁', vi: 'Đinh', dir: '187.5°-202.5°', palace: '离', palaceVi: 'Ly (Nam)', wx: '火', wxVi: 'Hoả', yinYang: '阴', yinYangVi: 'Âm',   long72: ['戊午','空亡','辛未'] },

  // —— TÂY NAM (坤 Khôn - Thổ) — 3 sơn —
  { idx: 15, zhi: '未', vi: 'Mùi',  dir: '202.5°-217.5°', palace: '坤', palaceVi: 'Khôn (Tây Nam)', wx: '土', wxVi: 'Thổ', yinYang: '阴', yinYangVi: 'Âm',   long72: ['癸未','乙未','丁未'] },
  { idx: 16, zhi: '坤', vi: 'Khôn', dir: '217.5°-232.5°', palace: '坤', palaceVi: 'Khôn (Tây Nam)', wx: '土', wxVi: 'Thổ', yinYang: '阳', yinYangVi: 'Dương', long72: ['己未','空亡','壬申'] },
  { idx: 17, zhi: '申', vi: 'Thân', dir: '232.5°-247.5°', palace: '坤', palaceVi: 'Khôn (Tây Nam)', wx: '金', wxVi: 'Kim', yinYang: '阳', yinYangVi: 'Dương', long72: ['甲申','丙申','戊申'] },

  // —— TÂY (兑 Đoài - Kim) — 3 sơn —
  { idx: 18, zhi: '庚', vi: 'Canh', dir: '247.5°-262.5°', palace: '兑', palaceVi: 'Đoài (Tây)', wx: '金', wxVi: 'Kim', yinYang: '阳', yinYangVi: 'Dương', long72: ['庚申','空亡','癸酉'] },
  { idx: 19, zhi: '酉', vi: 'Dậu',  dir: '262.5°-277.5°', palace: '兑', palaceVi: 'Đoài (Tây)', wx: '金', wxVi: 'Kim', yinYang: '阴', yinYangVi: 'Âm',   long72: ['乙酉','丁酉','己酉'] },
  { idx: 20, zhi: '辛', vi: 'Tân',  dir: '277.5°-292.5°', palace: '兑', palaceVi: 'Đoài (Tây)', wx: '金', wxVi: 'Kim', yinYang: '阴', yinYangVi: 'Âm',   long72: ['辛酉','空亡','甲戌'] },

  // —— TÂY BẮC (乾 Càn - Kim) — 3 sơn —
  { idx: 21, zhi: '戌', vi: 'Tuất', dir: '292.5°-307.5°', palace: '乾', palaceVi: 'Càn (Tây Bắc)', wx: '土', wxVi: 'Thổ', yinYang: '阳', yinYangVi: 'Dương', long72: ['丙戌','戊戌','庚戌'] },
  { idx: 22, zhi: '乾', vi: 'Càn',  dir: '307.5°-322.5°', palace: '乾', palaceVi: 'Càn (Tây Bắc)', wx: '金', wxVi: 'Kim', yinYang: '阳', yinYangVi: 'Dương', long72: ['壬戌','空亡','乙亥'] },
  { idx: 23, zhi: '亥', vi: 'Hợi',  dir: '322.5°-337.5°', palace: '乾', palaceVi: 'Càn (Tây Bắc)', wx: '水', wxVi: 'Thuỷ', yinYang: '阴', yinYangVi: 'Âm',   long72: ['丁亥','己亥','辛亥'] },
];

// Bảng tra nhanh theo ký tự Hán
export const MOUNTAIN_MAP = Object.fromEntries(MOUNTAINS_24.map((m) => [m.zhi, m]));

// 8 quẻ/cung ↔ ngũ hành bản quẻ (dùng cho tương quan sinh khắc hướng - toạ)
export const PALACE_WX = {
  坎: '水', 艮: '土', 震: '木', 巽: '木',
  离: '火', 坤: '土', 兑: '金', 乾: '金',
};

// Tương sinh / tương khắc ngũ hành
const SHENG = { 水: '木', 木: '火', 火: '土', 土: '金', 金: '水' }; // A sinh B
const KE = { 水: '火', 火: '金', 金: '木', 木: '土', 土: '水' }; // A khắc B

// ---------------------------------------------------------------------------
// PHẦN 2: 立向吉凶 (CÁT / HUNG HƯỚNG CHO TỪNG SƠN TOẠ)
// ---------------------------------------------------------------------------
// Quy luật cổ (阴阳宅通用 — giản lược cho âm phần):
//  - 天地大卦 / 净阴净阳: toạ và hướng cùng âm (hoặc cùng dương) → cát;
//  - Toạ hướng đối cung (180°) luôn là 1 cặp toạ-hướng (tọa A ⇔ hướng đối A).
//  - Tam hợp cục (申子辰 Thuỷ / 寅午戌 Hoả / 亥卯未 Mộc / 巳酉丑 Kim):
//    nếu toạ + các hướng thuộc cùng cục tam hợp → rất cát (quý nhân trường thọ).
//  - Lục xung (tử - ngọ / mão - dậu / thin - tuất / sửu - mùi) trong toạ-hướng
//    nội cung → hung, trừ khi dùng "hướng xung" (đối cung) để thu khí → bình.
//
// Bảng dưới là toạ-hướng cát/kỵ theo lối "tọa X hướng Y" cổ truyền,
// + ghi rõ đối cung (hướng tự nhiên khi toạ X).

// Tam hợp cục (3 chi)
export const SANHE_JU = {
  水: ['申', '子', '辰'],
  火: ['寅', '午', '戌'],
  木: ['亥', '卯', '未'],
  金: ['巳', '酉', '丑'],
};

// Tìm cục tam hợp chứa 1 chi (cho chi-tử / chi-Dần...)
function sanheOfZhi(zhi) {
  for (const [wx, arr] of Object.entries(SANHE_JU)) {
    if (arr.includes(zhi)) return { wx, members: arr };
  }
  return null;
}

// Lục xung 六冲 — 6 cặp đối xung đầy đủ (12 chi). Mỗi cặp cách nhau 6 vị trí.
const CHONG = {
  子: '午', 午: '子',
  丑: '未', 未: '丑',
  寅: '申', 申: '寅',
  卯: '酉', 酉: '卯',
  辰: '戌', 戌: '辰',
  巳: '亥', 亥: '巳',
};

// Đối cung (cách 12 sơn = 180°) — dùng mảng MOUNTAINS_24 xoay nửa vòng
export function oppositeMountain(zhi) {
  const idx = MOUNTAIN_MAP[zhi]?.idx;
  if (idx == null) return null;
  return MOUNTAINS_24[(idx + 12) % 24];
}

// Bảng CẤT (good) / KỴ (bad) cho các sơn toạ chính — giản lược nhưng chuẩn cổ pháp
// good = hướng cát nên dùng ; bad = hướng kỵ né ; note = diễn giải ngắn
export const SITTING_FORTUNE = {
  // —— Bắc (Khảm) ——
  '壬': { good: ['丙', '午', '丁'], bad: ['辰', '戌', '丑', '未'], note: 'Tọa Nhâm hướng Bính/Ngọ/Đinh (thu Hoả đối cung) — "hướng vượng khí", tài lộc con cháu phát. Kỵ hướng Thìn/Tuất/Sửu/Mùi (phạm sát thổ khắc).' },
  '子': { good: ['丙', '午', '丁'], bad: ['辰', '戌', '丑', '未'], note: 'Tọa Tý hướng Ngọ = "Tý - Ngọ chính tuyến", cát cục thuần. Hướng Nam sáng thoáng → vượng khí, quan lộc.' },
  '癸': { good: ['丙', '午', '丁'], bad: ['辰', '戌'], note: 'Tọa Quý hướng Đinh = "quý - đinh" (thiên can tương hợp 丙↔辛-style), tam hợp cục thuỷ, phúc đức lâu dài.' },
  // —— Đông Bắc (Cấn) ——
  '丑': { good: ['未', '坤', '申'], bad: ['午', '子'], note: 'Tọa Sửu hướng Mùi = đối cung Thổ - Thổ (tỷ hoà), ổn định. Hướng Tây Nam thấy nước → phát tài.' },
  '艮': { good: ['坤', '申', '未'], bad: ['子', '壬'], note: 'Tọa Cấn hướng Khôn = "Cấn - Khôn" (đối cung Thuần Thổ, đại cát trong 8 cung). Đắc Quý Nhân.' },
  '寅': { good: ['申', '坤', '庚'], bad: ['子', '壬'], note: 'Tọa Dần hướng Thân = tam hợp Thuỷ (Thân-Tý-Thìn) đối lại, thuỷ khí tụ, phúc âm đức.' },
  // —— Đông (Chấn) ——
  '甲': { good: ['庚', '酉', '辛'], bad: ['丑', '未', '戌'], note: 'Tọa Giáp hướng Canh = đối cung (đồng dương), kim khí làm dụng → quan lộc, uy quyền.' },
  '卯': { good: ['庚', '酉', '辛'], bad: ['丑', '未'], note: 'Tọa Mão hướng Dậu = "Mão - Dậu chính tuyến" (đối cung Kim khắc Mộc nhưng dùng làm thu khí), tài bạch vượng.' },
  '乙': { good: ['庚', '辛', '酉'], bad: ['丑', '未'], note: 'Tọa Ất hướng Tân = đối cung thuần, kim mộc giao hoà, hậu duệ văn chương.' },
  // —— Đông Nam (Tốn) ——
  '辰': { good: ['戌', '乾', '亥'], bad: ['午', '子', '卯'], note: 'Tọa Thìn hướng Tuất = đối cung Thổ - Thổ, đắc "tả thanh long - hữu bạch hổ" cân bằng, bình yên.' },
  '巽': { good: ['乾', '亥', '戌'], bad: ['子', '壬'], note: 'Tọa Tốn hướng Càn = "Tốn - Càn" đối cung đại cát, long hổ toàn, phát quan phát quý.' },
  '巳': { good: ['亥', '乾', '壬'], bad: ['卯', '子'], note: 'Tọa Tỵ hướng Hợi = tam hợp thuỷ đối, thuỷ tụ tiền đường, đại phú.' },
  // —— Nam (Ly) ——
  '丙': { good: ['壬', '子', '癸'], bad: ['丑', '未', '辰', '戌'], note: 'Tọa Bính hướng Nhâm = đối cung Thuỷ khắc Hoả nhưng "thuỷ làm dụng", vượng tài.' },
  '午': { good: ['壬', '子', '癸'], bad: ['丑', '未', '辰', '戌'], note: 'Tọa Ngọ hướng Tý = "Ngọ - Tý chính tuyến", thuỷ hoả ký hoà, danh vọng.' },
  '丁': { good: ['壬', '子', '癸'], bad: ['丑', '未'], note: 'Tọa Đinh hướng Quý = đối cung thuần âm, phúc đức gia đình, con cháu ngoan.' },
  // —— Tây Nam (Khôn) ——
  '未': { good: ['丑', '艮', '寅'], bad: ['子', '壬', '午'], note: 'Tọa Mùi hướng Sửu = đối cung Thổ - Thổ, đắc cục bình yên, điền sản.' },
  '坤': { good: ['艮', '寅', '丑'], bad: ['子', '壬'], note: 'Tọa Khôn hướng Cấn = "Khôn - Cấn" đối cung đại cát (thuần Thổ), sản nghiệp vượng.' },
  '申': { good: ['寅', '艮', '甲'], bad: ['午', '子', '卯'], note: 'Tọa Thân hướng Dần = tam hợp Hoả đối lại, hoả dụng, con cháu phát đạt.' },
  // —— Tây (Đoài) ——
  '庚': { good: ['甲', '卯', '乙'], bad: ['丑', '未', '辰'], note: 'Tọa Canh hướng Giáp = đối cung thuần dương, kim mộc giao, uy quyền.' },
  '酉': { good: ['甲', '卯', '乙'], bad: ['丑', '未'], note: 'Tọa Dậu hướng Mão = "Dậu - Mão chính tuyến", đối cung, tài bạch phong túc.' },
  '辛': { good: ['甲', '乙', '卯'], bad: ['丑', '未'], note: 'Tọa Tân hướng Ất = đối cung thuần, văn chương khoa cử phát.' },
  // —— Tây Bắc (Càn) ——
  '戌': { good: ['辰', '巽', '巳'], bad: ['午', '子', '卯'], note: 'Tọa Tuất hướng Thìn = đối cung Thổ - Thổ, đắc bình yên, điền sản.' },
  '乾': { good: ['巽', '巳', '辰'], bad: ['子', '壬'], note: 'Tọa Càn hướng Tốn = "Càn - Tốn" đối cung đại cát, phú quý song toàn.' },
  '亥': { good: ['巳', '巽', '丙'], bad: ['卯', '子', '午'], note: 'Tọa Hợi hướng Tỵ = tam hợp Kim đối, kim dụng, con cháu hiển đạt.' },
};

// ---------------------------------------------------------------------------
// PHẦN 3: 消砂纳水 (TIÊU SA NẠP THUỶ) — quy tắc bố cục sa - thuỷ - án sơn
// ---------------------------------------------------------------------------
// "Tiêu sa" = thu giảm/hoà hoãn sát khí của các núi (sa) hai bên;
// "Nạp thuỷ" = tiếp nhận dòng nước (thuỷ) vào tiền đường rồi ra khỏi cung.
export const XIAOSHA_NASHUI = {
  shaRule: {
    title: '消砂 (Tiêu Sa — hoà hoãn núi hai bên)',
    points: [
      'Tả Thanh Long (青龙 — bên trái nhìn ra hướng) phải cao hơn Hữu Bạch Hổ (白虎 — bên phải) một chút: "Long cao Hổ thấp" → đại cát, con trai trưởng phát.',
      'Thanh Long, Bạch Hổ phải ôm lấy huyệt (mộ) như hai cánh tay nâng — gọi "sa giao bisa nước" → khí không tán.',
      'Nếu Bạch Hổ cao hơn Thanh Long (Hổ cao Long thấp) → hung, phụ nữ lấn át, gặp huyết quang.',
      'Núi phía sau (Huyền Vũ 玄武) phải đầy đặn, cao hơn tiền đường → "hữu Sơn Huyền Vũ" để trấn nước, giữ khí.',
    ],
  },
  waterRule: {
    title: '纳水 (Nạp Thuỷ — tiếp nước vào rồi ra)',
    points: [
      'Nước nên chảy tới từ phía trước - trái (sind庚 vị/thiên môn) rồi rẽ ra phía sau - phải (địa hộ): "thiên môn khai, địa hộ bế" → khí tụ, tài lộc dồi dào.',
      'Nước tới phải chậm, uốn lượn (khúc) như "ngọc đái ôm vòng" → cát; nước tới thẳng, xiết, ồn ào → "sát khí xung", hung.',
      'Nước chảy ra (khử) phải khuất, không nhìn thấy đường thoát → giữ ofn; nếu thấy trống trải → "lậu tài".',
      'Cấm nước chảy thẳng đánh vào tiền đường (xung tâm thuỷ) → bại gia; cấm nước chảy ra sau lưng (bối Ly thuỷ) → tuyệt tự.',
    ],
  },
  anShanRule: {
    title: '案山 / 朝山 (Án sơn - Triều sơn)',
    points: [
      'Án sơn (案山 — núi bàn ngay trước huyệt, gần) phải thấp, tròn, gọn — như cái bàn bút kệ → "ngự án" để ghi chép, quan lộc.',
      'Triều sơn (朝山 — núi xa phía trước) phải cao, đẹp, dáng tôn nghiêm → như quan lạy chầu, phú quý.',
      'Khoảng giữa huyệt và án sơn phải thoáng, có nước (min đường 明堂) → "min đường tụ thuỷ" là kết cấu lý tưởng.',
      'Án sơn nhọn, gãy, nghiêng, hoặc trống (không có án) → hung, con cháu bần hàn, không quý nhân.',
    ],
  },
};

// ---------------------------------------------------------------------------
// HÀM API
// ---------------------------------------------------------------------------

/**
 * Thông tin chi tiết 1 sơn (theo ký tự Hán). Trả null nếu không hợp lệ.
 */
export function mountainInfo(zhi) {
  const m = MOUNTAIN_MAP[zhi];
  if (!m) return null;
  const opp = oppositeMountain(zhi);
  const ju = ['子', '辰', '申'].includes(zhi) || ['丑', '巳', '酉'].includes(zhi) ||
             ['卯', '未', '亥'].includes(zhi) || ['午', '寅', '戌'].includes(zhi)
    ? sanheOfZhi(zhi) : null;
  return {
    ...m,
    opposite: opp ? { zhi: opp.zhi, vi: opp.vi, dir: opp.dir } : null,
    sanhe: ju, // { wx, members }
    chongWith: CHONG[zhi] || null, // chi xung (chỉ cho chi-tử, không cho can/guà)
    summary: `${m.vi} (${zhi}) — ${m.palaceVi} · ${m.wxVi} ${m.yinYangVi} · ${m.dir}` +
      (opp ? ` · Đối cung: ${opp.vi} (${opp.zhi})` : '') +
      (ju ? ` · Cục tam hợp: ${ju.wx}` : ''),
  };
}

/**
 * Phân tích toạ-hướng cho 1 sơn toạ (坐).
 * @param sittingZhi ký tự Hán của sơn toạ (vd '壬')
 * @returns { sitting, facing:{primary,opp}, good:[], bad:[], note, sanhe, chong, verdict }
 */
export function sittingDirectionAnalysis(sittingZhi) {
  const sit = MOUNTAIN_MAP[sittingZhi];
  if (!sit) return null;
  const fort = SITTING_FORTUNE[sittingZhi] || { good: [], bad: [], note: '(chưa có ghi chép cụ thể cho sơn này)' };
  const opp = oppositeMountain(sittingZhi);
  const ju = sanheOfZhi(sittingZhi);

  // Bản thảo good/bad: gắn thêm thông tin cung + ngũ hành
  const good = fort.good.map((g) => {
    const gm = MOUNTAIN_MAP[g];
    return gm ? { zhi: g, vi: gm.vi, palaceVi: gm.palaceVi, wx: gm.wx, dir: gm.dir } : { zhi: g };
  });
  const bad = fort.bad.map((b) => {
    const bm = MOUNTAIN_MAP[b];
    return bm ? { zhi: b, vi: bm.vi, palaceVi: bm.palaceVi, wx: bm.wx, dir: bm.dir } : { zhi: b };
  });

  // Phán định tổng: nếu có good dài >= 2 và note có "cát/phát/vượng/phú quý" → Cát
  const catKeywords = ['cát', 'phát', 'vượng', 'phú quý', 'đại cát', 'tài lộc', 'phúc'];
  const hungKeywords = ['hung', 'sát', 'tuyệt', 'bại'];
  const lcNote = fort.note.toLowerCase();
  let score = 50;
  catKeywords.forEach((k) => { if (lcNote.includes(k)) score += 7; });
  hungKeywords.forEach((k) => { if (lcNote.includes(k)) score -= 7; });
  if (good.length >= 2) score += 5;
  if (opp) score += 3; // có đối cung rõ → chuẩn cổ pháp
  score = Math.max(10, Math.min(95, score));

  let verdict;
  if (score >= 70) verdict = 'Cát (đại lợi âm phần)';
  else if (score >= 50) verdict = 'Bình (dụng được, cần phối sa thuỷ)';
  else verdict = 'Cần cẩn trọng (phối hợp phân kim / chọn ngày)';

  return {
    sitting: { zhi: sittingZhi, vi: sit.vi, palaceVi: sit.palaceVi, wx: sit.wx, dir: sit.dir },
    facing: {
      primary: opp ? { zhi: opp.zhi, vi: opp.vi, dir: opp.dir } : null,
      opp,
    },
    good, bad, note: fort.note,
    sanhe: ju,
    chong: CHONG[sittingZhi] || null,
    score, verdict,
    summary: `Tọa ${sit.vi} (${sittingZhi} @ ${sit.dir}, ${sit.palaceVi}) → hướng ${opp ? opp.vi + ' (' + opp.zhi + ')' : '?'} [đối cung]. Cát: ${fort.good.join(' / ') || '—'}. Kỵ: ${fort.bad.join(' / ') || '—'}.`,
  };
}

/**
 * Tổng quan nhanh toàn hệ (dùng cho card UI + smoke test).
 */
export function yinzhaiOverview() {
  return {
    title: '阴宅风水 — Phong Thuỷ Âm Phần (二十四山立向分金)',
    mountainsCount: MOUNTAINS_24.length,
    palaces: ['坎 (Bắc)', '艮 (Đông Bắc)', '震 (Đông)', '巽 (Đông Nam)',
              '离 (Nam)', '坤 (Tây Nam)', '兑 (Tây)', '乾 (Tây Bắc)'],
    ruleSummary: XIAOSHA_NASHUI,
    note: 'Hệ thống 24 sơn (mỗi sơn 15°) chia 8 cung × 3 sơn. Âm phần chọn tọa-hướng theo đối cung + tam hợp cục, phối "tiêu sa nạp thuỷ" (núi hai bên + dòng nước) và án sơn (núi bàn phía trước).',
    source: '罗经透解 · 青囊经 · 撼龙经 · 疑龙经 (Hệ Phong Thuỷ Hoàng Học).',
  };
}

export { CHONG as MOUNTAIN_CHONG };

