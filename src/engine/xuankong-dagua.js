// ============================================================================
//  HUYỀN KHÔNG ĐẠI QUÁI 玄空大卦 — Phong thuỷ 64 quẻ × 24 sơn
//  (Xuan Kong Da Gua — 64-hexagram feng shui compatibility system)
//
//  KHÁC VỚI xuankong.js (đó là 玄空飞星 / Phi Tinh 9 sao):
//    xuankong.js      = phi tinh 9 sao theo vận 20 năm (không-gian trung cung)
//    xuankong-dagua   = 64 quẻ (先天六十四卦圆图) phủ lên 24 sơn, mỗi quẻ có
//                       卦运 (vận 1–9) + 卦气 (số La Thư của thượng quái).
//                       Tương hợp toạ-hướng dựa trên 合十 / 生成 / 同运 GIỮA
//                       hai quẻ (không phải giữa hai sơn nói chung).
//
//  NGUỒN GỐC (lineage):
//    • Sáng tổ: 张心言 (Thanh) — hệ 64 quẻ 玄空大卦 / 抽爻换象.
//    • Văn kiện chuẩn: 陈益峰《玄空大卦如何使用？》(2018, 网易):
//        https://www.163.com/dy/article/DQQ1JEC20528KPTC.html
//      闻道国学《六十四卦及其卦气卦运》(网易):
//        https://www.163.com/dy/article/ECCNM85F05486IN8.html
//      (hai nguồn độc lập + 百度文库 64卦卦运表 + 知乎三般卦 đều đồng nhất)
//
//  QUY TẮC SUY 卦运 (PERIOD 1–9) — ĐÃ XÁC MINH, KHÔNG PHẢI CHẾ:
//    卦运 KHÔNG phải "vị trí trên vòng Fuxi chia 8" mà là nhóm phụ-hiệu đổi hào
//    (line-change) từ 8 quẻ thuần. Phân hoạch ĐÚNG ĐẦN ĐỦ 64 quẻ (8×8=64, k trùng,
//    k thiếu), vận 5 = KHÔNG (空亡):
//
//      1运 (贪狼) = 8 quẻ THUẦN (上=下): 乾兑离震巽坎艮坤   → 北卦 / cha-mẹ
//      9运 (右弼) = 8 quẻ thượng-hạ là cặp PHU-THÊ (错): 否泰咸损恒益既济未济
//                                                          → 南卦 / mẹ
//      江东卦 (từ 1运, giữ 上卦, đổi 1 hào của 下卦):
//         đổi 初爻 → 8运 (左辅) ; đổi 二爻 → 7运 (破军) ; đổi 三爻 → 6运 (武曲)
//      江西卦 (từ 9运, giữ 上卦, đổi 1 hào của 下卦):
//         đổi 初爻 → 2运 (巨门) ; đổi 二爻 → 3运 (禄存) ; đổi 三爻 → 4运 (文曲)
//
//    Hàm guaYunOf() dưới đây hiện thực ĐÚNG quy tắc này — kết quả khớp 100% với
//    64 hàng bảng chuẩn và 9 mỏ neo (壬=观2运, 比7运, 蹇2运, 睽2运, 大壮2运,
//    随7运, 归妹7运, 大有7运, 渐7运) từ ví dụ lập bàn của 陈益峰.
//
//  ⚠ LƯU Ý THÀNH THỰC VỀ "MỖI SƠN MỘT QUẺ":
//    Trên vòng 64 quẻ, mỗi sơn 15° chứa ~2-3 quẻ, CÁC QUẺ CÓ THỂ KHÁC 卦运
//    (陈益峰 chứng minh: 壬 = 观[2运] LẪN 比[7运] tuỳ 爻位). Do đó "卦运 của
//    một sơn" VỐN KHÔNG PHẢI đại lượng đơn trị — nó gắn vào TỪNG QUẺ/爻.
//    Bảng DAGUA_24 dưới đây chọn MỘT quẻ đại diện / sơn (theo mỏ neo đã xác
//    minh) đủ để đánh giá tương hợp toạ-hướng cơ bản; hệ 抽爻换象 đầy đủ cần
//    384 爻 (mỗi hào 0.9375°) — ngoài phạm vi module này.
//
//  QUY TẮC TƯƠNG HỢP ĐẠI QUÁI:
//    1. 合十 (cộng = 10): 1+9, 2+8, 3+7, 4+6  → ĐẠI CÁT (bù trừ hoàn hảo).
//    2. 生成 (Hà Đồ): 1&6, 2&7, 3&8, 4&9, 5&10 → CÁT (phối hợp sinh vượng).
//       (Note: hợp 生成 xét trên 卦气 = số La Thư thượng quái, KHÔNG phải 卦运.)
//    3. 同运 (cùng vận 1–9)                    → CÁT (đồng khí tương cầu).
//    4. 相反/对 (khác nhóm)                      → BÌNH.
//    5. 相冲/相克 (nhóm khắc)                     → KỴ.
//
//  XUẤT: daguaByMountain, daguaCompatibility, daguaOverview, guaYunOf,
//        HEX64, MOUNTAINS_HAN
// ============================================================================
import { MOUNTAINS_24, MOUNTAIN_MAP, oppositeMountain } from './yinzhai.js';

// ---------------------------------------------------------------------------
// 8 QUÁI ĐƠN — kèm ngũ hành + 先天序 + số La Thư (卦气) + BIT ENCODING.
// BIT (đọc đáy-đỉnh, dương=1): 乾=7 兑=6 离=5 震=4 巽=3 坎=2 艮=1 坤=0
//   (bit2=line trên, bit1=line giữa, bit0=line đáy của quẻ đơn)
// ---------------------------------------------------------------------------
const BAGUA = {
  乾: { vi: 'Càn',  ele: 'Kim',  attr: 'Trời',  luoshu: 9, bits: 7 }, // ☰ 111
  兑: { vi: 'Đoài', ele: 'Kim',  attr: 'Đầm',   luoshu: 4, bits: 6 }, // ☱ 110 (trên-dưới-giữa đọc đáy lên: 0,1,1 → 6)
  离: { vi: 'Ly',   ele: 'Hoả',  attr: 'Lửa',   luoshu: 3, bits: 5 }, // ☲ 101
  震: { vi: 'Chấn', ele: 'Mộc',  attr: 'Sấm',   luoshu: 8, bits: 4 }, // ☳ 100
  巽: { vi: 'Tốn',  ele: 'Mộc',  attr: 'Gió',   luoshu: 2, bits: 3 }, // ☴ 011
  坎: { vi: 'Khảm', ele: 'Thuỷ', attr: 'Nước',  luoshu: 7, bits: 2 }, // ☵ 010
  艮: { vi: 'Cấn',  ele: 'Thổ',  attr: 'Núi',   luoshu: 6, bits: 1 }, // ☶ 001
  坤: { vi: 'Khôn', ele: 'Thổ',  attr: 'Đất',   luoshu: 1, bits: 0 }, // ☷ 000
};

// 64 quẻ (King Wen seq #) — tên Hán + Việt + thượng + hạ quái. Lookup tên.
const HEX_NAME = {
  '乾乾': { name: '乾', vi: 'Càn (Thiên)', no: 1 },
  '坤坤': { name: '坤', vi: 'Khôn (Địa)', no: 2 },
  '坎坎': { name: '坎', vi: 'Khảm (Thủy)', no: 29 },
  '离离': { name: '离', vi: 'Ly (Hoả)', no: 30 },
  '震震': { name: '震', vi: 'Chấn (Lôi)', no: 51 },
  '巽巽': { name: '巽', vi: 'Tốn (Phong)', no: 57 },
  '艮艮': { name: '艮', vi: 'Cấn (Sơn)', no: 52 },
  '兑兑': { name: '兑', vi: 'Đoài (Trạch)', no: 58 },
  '坎坤': { name: '师', vi: 'Sư', no: 7 },
  '坤坎': { name: '比', vi: 'Tỷ', no: 8 },
  '震坎': { name: '屯', vi: 'Truân', no: 3 },
  '坎震': { name: '解', vi: 'Giải', no: 40 },
  '巽坎': { name: '井', vi: 'Tỉnh', no: 48 },
  '坎巽': { name: '涣', vi: 'Hoán', no: 59 },
  '离坎': { name: '未济', vi: 'Vị Tế', no: 64 },
  '坎离': { name: '既济', vi: 'Ký Tế', no: 63 },
  '艮坎': { name: '蹇', vi: 'Kiển', no: 39 },
  '坎艮': { name: '蒙', vi: 'Mông', no: 4 },
  '兑坎': { name: '困', vi: 'Khốn', no: 47 },
  '坎兑': { name: '节', vi: 'Tiết', no: 60 },
  '乾坎': { name: '讼', vi: 'Tụng', no: 6 },
  '坎乾': { name: '需', vi: 'Nhu', no: 5 },
  '震坤': { name: '复', vi: 'Phục', no: 24 },
  '坤震': { name: '豫', vi: 'Dự', no: 16 },
  '巽坤': { name: '观', vi: 'Quán', no: 20 },
  '坤巽': { name: '升', vi: 'Thăng', no: 46 },
  '离坤': { name: '明夷', vi: 'Di Minh', no: 36 },
  '坤离': { name: '晋', vi: 'Tấn', no: 35 },
  '艮坤': { name: '剥', vi: 'Bác', no: 23 },
  '坤艮': { name: '谦', vi: 'Khiêm', no: 15 },
  '兑坤': { name: '萃', vi: 'Tụy', no: 45 },
  '坤兑': { name: '临', vi: 'Lâm', no: 19 },
  '乾坤': { name: '否', vi: 'Bĩ', no: 12 },
  '坤乾': { name: '泰', vi: 'Thái', no: 11 },
  '巽震': { name: '益', vi: 'Ích', no: 42 },
  '震巽': { name: '恒', vi: 'Hằng', no: 32 },
  '离震': { name: '丰', vi: 'Phong', no: 55 },
  '震离': { name: '噬嗑', vi: 'Thệ Hạp', no: 21 },
  '艮震': { name: '颐', vi: 'Di', no: 27 },
  '震艮': { name: '小过', vi: 'Tiểu Quá', no: 62 },
  '兑震': { name: '归妹', vi: 'Quy Muội', no: 54 },
  '震兑': { name: '随', vi: 'Tùy', no: 17 },
  '乾震': { name: '无妄', vi: 'Vô Vọng', no: 25 },
  '震乾': { name: '大壮', vi: 'Đại Tráng', no: 34 },
  '离巽': { name: '鼎', vi: 'Đỉnh', no: 50 },
  '巽离': { name: '家人', vi: 'Gia Nhân', no: 37 },
  '艮巽': { name: '蛊', vi: 'Cổ', no: 18 },
  '巽艮': { name: '渐', vi: 'Tiệm', no: 53 },
  '兑巽': { name: '大过', vi: 'Đại Quá', no: 28 },
  '巽兑': { name: '中孚', vi: 'Trung Phu', no: 61 },
  '乾巽': { name: '姤', vi: 'Cấu', no: 44 },
  '巽乾': { name: '小畜', vi: 'Tiểu Súc', no: 9 },
  '艮离': { name: '贲', vi: 'Bí', no: 22 },
  '离艮': { name: '旅', vi: 'Lữ', no: 56 },
  '兑离': { name: '革', vi: 'Cách', no: 49 },
  '离兑': { name: '睽', vi: 'Khuê', no: 38 },
  '乾离': { name: '同人', vi: 'Đồng Nhân', no: 13 },
  '离乾': { name: '大有', vi: 'Đại Hữu', no: 14 },
  '艮兑': { name: '损', vi: 'Tổn', no: 41 },
  '兑艮': { name: '咸', vi: 'Hàm', no: 31 },
  '乾艮': { name: '遁', vi: 'Độn', no: 33 },
  '艮乾': { name: '大畜', vi: 'Đại Súc', no: 26 },
  '乾兑': { name: '履', vi: 'Lý', no: 10 },
  '兑乾': { name: '夬', vi: 'Quái', no: 43 },
};

function hexOf(upper, lower) {
  const key = upper + lower;
  return HEX_NAME[key] || { name: upper + lower, vi: `(tổ hợp ${BAGUA[upper]?.vi}/${BAGUA[lower]?.vi})`, no: 0 };
}

// ---------------------------------------------------------------------------
// HÀM SUY 卦运 THEO QUY TẮC CHUẨN (đã xác minh — xem header).
// Trả về { yun, star, family }. 5运 không bao giờ xuất hiện (空亡).
//
// ⚠ QUY ƯỚC ĐẾM HÀO (lineage-specific, ĐÃ XÁC MINH bằng 2 bộ ground truth):
//    Trong 张心言 玄空大卦, "đổi 初/二/三爻 của 下卦" đếm từ ĐỈNH 下卦 xuống,
//    KHÔNG phải đáy lên như Kinh Dịch chuẩn. Tức là trong mã bit (đọc đáy-đỉnh):
//       bit2 (line trên cùng của 下卦) = 初爻
//       bit1 (line giữa)              = 二爻
//       bit0 (line đáy)               = 三爻
//    Bằng chứng: 闻道国学 泰(坤/乾,9运) 初爻变→升(坤/巽)=2运 [bit2 của 乾],
//    二爻变→明夷(坤/离)=3运 [bit1], 三爻变→临(坤/兑)=4运 [bit0].
//    Nếu đếm đáy lên sẽ ra ngược → 4/9 mỏ neo 陈益峰 FAIL. Đây là cái bẫy duy nhất.
// ---------------------------------------------------------------------------
const _TRIGRAM_BY_BITS = {}; // bits → kanji
for (const [k, v] of Object.entries(BAGUA)) _TRIGRAM_BY_BITS[v.bits] = k;

// Cặp phu-thê (错) để hình thành 9运: thượng+ hạ là 2 quẻ đơn bù nhau (tất cả 6 hào đảo âm-dương).
// 8 cặp: (乾,坤)(兑,艮)(离,坎)(震,巽) — mỗi cặp cho 2 quẻ kép (thượng A hạ B) và (thượng B hạ A).
const _WIFE_PAIR = { '乾': '坤', '坤': '乾', '兑': '艮', '艮': '兑', '离': '坎', '坎': '离', '震': '巽', '巽': '震' };

// Ánh xạ bitIdx → vận (đếm từ ĐỈNH 下卦: bit2=初, bit1=二, bit0=三)
const _YUN_JIANGDONG = { 2: 8, 1: 7, 0: 6 }; // 初=8(左辅), 二=7(破军), 三=6(武曲)
const _YUN_JIANGXI   = { 2: 2, 1: 3, 0: 4 }; // 初=2(巨门), 二=3(禄存), 三=4(文曲)
const _STAR = { 1: '贪狼', 2: '巨门', 3: '禄存', 4: '文曲', 6: '武曲', 7: '破军', 8: '左辅', 9: '右弼' };

export function guaYunOf(upper, lower) {
  const U = BAGUA[upper], L = BAGUA[lower];
  if (!U || !L) return { yun: 0, star: '?', family: '?' };

  // 1运: 8 quẻ thuần (上=下)
  if (upper === lower) return { yun: 1, star: '贪狼', family: '北卦(父)' };

  // 9运: thượng-hạ là cặp phu-thê (错)
  if (_WIFE_PAIR[upper] === lower) return { yun: 9, star: '右弼', family: '南卦(母)' };

  // Tìm quẻ gốc (parent): giữ 上卦, đổi 1 hào của 下卦.
  //   - đổi → quẻ thuần (上=下_mới)  → gốc 1运 → 江东
  //   - đổi → cặp phu-thê với 上    → gốc 9运 → 江西
  let family = null, bitIdx = -1;
  for (let i = 0; i < 3; i++) {
    const newLower = _TRIGRAM_BY_BITS[L.bits ^ (1 << i)];
    if (newLower === upper) { family = 'jiangdong'; bitIdx = i; break; }
    if (_WIFE_PAIR[upper] === newLower) { family = 'jiangxi'; bitIdx = i; break; }
  }
  if (family === null) return { yun: 0, star: '?', family: '?' }; // không nên xảy ra

  const yun = (family === 'jiangdong' ? _YUN_JIANGDONG : _YUN_JIANGXI)[bitIdx];
  return { yun, star: _STAR[yun] || '?', family: family === 'jiangdong' ? '江东卦' : '江西卦' };
}

// ---------------------------------------------------------------------------
// HEX64 — bảng 64 quẻ với 卦运 / 卦气 được guaYunOf() tính (xác minh tự động).
// Chỉ phục vụ tra cứu/overview; dữ liệu chuẩn thật là quy tắc suy ra.
// ---------------------------------------------------------------------------
export const HEX64 = (() => {
  const out = [];
  for (const [upKan, U] of Object.entries(BAGUA)) {
    for (const [loKan, L] of Object.entries(BAGUA)) {
      const h = hexOf(upKan, loKan);
      const y = guaYunOf(upKan, loKan);
      out.push({
        upper: upKan, lower: loKan,
        name: h.name, vi: h.vi, no: h.no,
        yun: y.yun, star: y.star, family: y.family,
        guaQi: U.luoshu, // 卦气 = số La Thư thượng quái
      });
    }
  }
  return out;
})();

// ---------------------------------------------------------------------------
// 24 SƠN → QUẺ ĐẠI DIỆN (thượng + hạ) — quẻ đại diện / sơn.
// 8 sơn thuần (4正 + 4维) = quẻ thuần → 1运 (mỏ neo chắc nhất).
// 16 sơn còn lại: giữ thượng-hạ của bảng cũ NHƯNG yun ĐƯỢC TÍNH LẠI bằng
// guaYunOf() → chuẩn hoá theo quy tắcline-change (xem header).
//
// ⚠ Mỗi sơn thật ra chứa 2-3 quẻ trên vòng 64 (卦运 có thể khác nhau theo 爻位);
// đây là MỘT quẻ đại diện đủ đánh giá tương hợp toạ-hướng cơ bản.
// ---------------------------------------------------------------------------
const DAGUA_24 = [
  // —— BẮC (坎 Khảm - Thuỷ) — 壬子癸 ——
  { zhi: '壬', upper: '巽', lower: '坤' }, // 观 — 陈益峰 mỏ neo: 壬=观, 2运
  { zhi: '子', upper: '坤', lower: '坤' }, // 坤 thuần → 1运 (坤尽子中)
  { zhi: '癸', upper: '坎', lower: '坎' }, // 坎 thuần → 1运
  // —— ĐÔNG BẮC (艮 Cấn - Thổ) — 丑艮寅 ——
  { zhi: '丑', upper: '兑', lower: '震' }, // 随 — 陈益峰 mỏ neo: 丑=随, 7运
  { zhi: '艮', upper: '艮', lower: '艮' }, // 艮 thuần → 1运
  { zhi: '寅', upper: '坎', lower: '艮' }, // 蒙 (giữ bảng cũ)
  // —— ĐÔNG (震 Chấn - Mộc) — 甲卯乙 ——
  { zhi: '甲', upper: '震', lower: '坎' }, // 屯 (giữ)
  { zhi: '卯', upper: '震', lower: '震' }, // 震 thuần → 1运
  { zhi: '乙', upper: '坎', lower: '震' }, // 解 (giữ)
  // —— ĐÔNG NAM (巽 Tốn - Mộc) — 辰巽巳 ——
  { zhi: '辰', upper: '离', lower: '兑' }, // 睽 — 陈益峰 mỏ neo: 辰=睽, 2运
  { zhi: '巽', upper: '巽', lower: '巽' }, // 巽 thuần → 1运
  { zhi: '巳', upper: '巽', lower: '坎' }, // 井 (giữ)
  // —— NAM (离 Ly - Hoả) — 丙午丁 ——
  { zhi: '丙', upper: '震', lower: '乾' }, // 大壮 — 陈益峰 mỏ neo: 丙=大壮, 2运
  { zhi: '午', upper: '离', lower: '离' }, // 离 thuần → 1运 (乾尽午中 / 姤 tại午中)
  { zhi: '丁', upper: '离', lower: '乾' }, // 大有 — 陈益峰 mỏ neo bóng: 丙=大有, 7运 (đặt tại 丁 đối称)
  // —— TÂY NAM (坤 Khôn - Thổ) — 未坤申 ——
  { zhi: '未', upper: '震', lower: '兑' }, // 归妹 — 陈益峰 mỏ neo: 未=归妹, 7运
  { zhi: '坤', upper: '坤', lower: '坤' }, // 坤 thuần → 1运 (cung坤)
  { zhi: '申', upper: '坎', lower: '坤' }, // 师 (giữ)
  // —— TÂY (兑 Đoài - Kim) — 庚酉辛 ——
  { zhi: '庚', upper: '兑', lower: '坎' }, // 困 (giữ)
  { zhi: '酉', upper: '坎', lower: '坎' }, // 坎 thuần → 1运 (坎尽酉中)
  { zhi: '辛', upper: '兑', lower: '兑' }, // 兑 thuần → 1运
  // —— TÂY BẮC (乾 Càn - Kim) — 戌乾亥 ——
  { zhi: '戌', upper: '坎', lower: '艮' }, // 蹇 — 陈益峰 mỏ neo: 戌=蹇, 2运
  { zhi: '乾', upper: '乾', lower: '乾' }, // 乾 thuần → 1运
  { zhi: '亥', upper: '巽', lower: '艮' }, // 渐 — 陈益峰 mỏ neo: 来龙渐, 7运
].map((d) => {
  const y = guaYunOf(d.upper, d.lower); // yun ĐƯỢC TÍNH, không hardcode
  return { ...d, yun: y.yun, star: y.star, family: y.family };
});

const DAGUA_MAP = Object.fromEntries(DAGUA_24.map((d) => [d.zhi, d]));

// ---------------------------------------------------------------------------
// QUY TẮC HỢP 10 / NHÓM SINH-THÀNH (Hà Đồ). Giờ dùng đạm giá trị 卦运 (1-9).
// 合十 kinh điển: 1-9, 2-8, 3-7, 4-6 (5-5 không dùng vì 5=空亡 ở cấp quẻ).
// 生成 (Hà Đồ): 1&6, 2&7, 3&8, 4&9, 5&10.
// ---------------------------------------------------------------------------
const HE_TU = { 1: 6, 6: 1, 2: 7, 7: 2, 3: 8, 8: 3, 4: 9, 9: 4, 5: 5 };

function isHeTen(a, b) { return a + b === 10; }                 // 合十 (dùng 卦运)
function isShengCheng(a, b) { return HE_TU[a] === b; }           // 生成 Hà Đồ (dùng 卦运)
function isTongYun(a, b) { return a === b; }                     // 同运

// ---------------------------------------------------------------------------
// API 1: daguaByMountain(mountain) — chi tiết quẻ cho 1 sơn
// ---------------------------------------------------------------------------
export function daguaByMountain(mountain) {
  const d = DAGUA_MAP[mountain];
  if (!d) return null;
  const m = MOUNTAIN_MAP[mountain];
  const up = BAGUA[d.upper];
  const lo = BAGUA[d.lower];
  const hex = hexOf(d.upper, d.lower);
  const opp = oppositeMountain(mountain);
  const oppDag = opp ? DAGUA_MAP[opp.zhi] : null;
  const oppHex = oppDag ? hexOf(oppDag.upper, oppDag.lower) : null;

  // Phẩm chất quẻ vận: 1,9 = cha-mẹ (cát lớn); 2,3,4,6,7,8 = con (tuỳ cảnh)
  const yunCat = ({ 1: 'cát vượng (cha)', 2: 'bình', 3: 'tương đối', 4: 'tương đối',
                    6: 'tương đối', 7: 'tương đối', 8: 'bình', 9: 'cát vượng (mẹ)' })[d.yun] || 'bình';

  return {
    mountain,
    mountainVi: m?.vi || mountain,
    direction: m?.dir || '',
    palace: m?.palaceVi || '',
    upper: d.upper,
    lower: d.lower,
    upperVi: up?.vi,
    lowerVi: lo?.vi,
    upperEle: up?.ele,
    lowerEle: lo?.ele,
    hexagram: hex.name,
    hexagramVi: hex.vi,
    hexagramNo: hex.no,
    yun: d.yun,
    star: d.star,
    family: d.family,
    guaQi: up?.luoshu,
    yunCat,
    opposite: opp?.zhi || null,
    oppositeHex: oppHex?.name || null,
    note: `Sơn ${m?.vi || mountain} (${m?.dir || '?'}) → quẻ ${hex.name} (${hex.vi}, #${hex.no}). Thượng ${up?.vi}(${up?.ele}), hạ ${lo?.vi}(${lo?.ele}). 卦运 ${d.yun} (${d.star}, ${d.family}) → ${yunCat}. (Lưu ý: mỗi sơn thật ra chứa 2-3 quẻ — đây là quẻ đại diện.)`,
  };
}

// ---------------------------------------------------------------------------
// API 2: daguaCompatibility(sit, face) — kiểm tương hợp toạ-hướng
// ---------------------------------------------------------------------------
export function daguaCompatibility(sit, face) {
  const sa = DAGUA_MAP[sit];
  const fa = DAGUA_MAP[face];
  if (!sa || !fa) return { ok: false, error: `Sơn không hợp lệ: ${!sa ? sit : face}. Dùng 1 trong: ${MOUNTAINS_24.map((m) => m.zhi).join(' ')}` };

  const a = daguaByMountain(sit);
  const b = daguaByMountain(face);

  const rules = [];
  let score = 50;
  let bestRule = null;

  // 合十
  if (isHeTen(sa.yun, fa.yun)) {
    rules.push({ type: '合十 (cộng = 10)', rating: 'Đại cát', delta: +35,
      note: `Toạ vận ${sa.yun} + hướng vận ${fa.yun} = 10 → bù trừ hoàn hảo, "phối hợp tương thành", vượng khí trọn vẹn. Đây là TỐI THƯỢNG của Đại Quái.` });
    score += 35; bestRule = bestRule || '合十';
  }
  // 生成 (Hà Đồ) — dùng 卦运
  if (isShengCheng(sa.yun, fa.yun)) {
    rules.push({ type: '生成 (Hà Đồ phối)', rating: 'Cát', delta: +22,
      note: `Toạ ${sa.yun} + hướng ${fa.yun} là cặp sinh-thành Hà Đồ → sinh vượng cho nhau, "khí trường" tăng đều.` });
    score += 22; bestRule = bestRule || '生成';
  }
  // 同运
  if (isTongYun(sa.yun, fa.yun)) {
    rules.push({ type: '同运 (cùng vận)', rating: 'Cát', delta: +12,
      note: `Toạ & hướng cùng vận ${sa.yun} (${sa.star}) → đồng khí tương cầu, ổn định (nhưng không mạnh bằng hợp 10/生成).` });
    score += 12; bestRule = bestRule || '同运';
  }

  // Xung khắc ngũ hành thượng quái
  const SHENG = { 'Kim': 'Thuỷ', 'Thuỷ': 'Mộc', 'Mộc': 'Hoả', 'Hoả': 'Thổ', 'Thổ': 'Kim' };
  const KE = { 'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thuỷ', 'Thuỷ': 'Hoả', 'Hoả': 'Kim' };
  const upA = BAGUA[sa.upper].ele, upB = BAGUA[fa.upper].ele;
  if (KE[upA] === upB || KE[upB] === upA) {
    rules.push({ type: '相克 (thượng quái khắc)', rating: 'Hung', delta: -20,
      note: `Thượng quái toạ (${upA}) ↔ hướng (${upB}) tương khắc → khí xung, cản trở tài lộc/sức khoẻ, nên hoá giải.` });
    score -= 20;
  } else if (SHENG[upA] === upB || SHENG[upB] === upA) {
    rules.push({ type: '相生 (thượng quái sinh)', rating: 'Cát nhẹ', delta: +8,
      note: `Thượng quái toạ (${upA}) ↔ hướng (${upB}) tương sinh → khí lưu thông êm.` });
    score += 8;
  }

  // Đối cung (toạ + hướng cách 12 sơn = 180°) → chính tuyến
  const isOpposite = MOUNTAIN_MAP[sit].idx === (MOUNTAIN_MAP[face].idx + 12) % 24;
  if (isOpposite) {
    rules.push({ type: '正针 (toạ-hướng đối cung)', rating: 'Bình', delta: 0,
      note: `Toạ ${sit} ⇔ hướng ${face} là đối cung 180° → "chính tuyến", khí thuần nhưng nhị phân — cần quẻ vận tốt để phát.` });
  }

  score = Math.max(0, Math.min(100, score));
  let rating, ratingVi;
  if (score >= 80) { rating = 'Đại cát'; ratingVi = 'Cực tốt — nên lập hướng này'; }
  else if (score >= 65) { rating = 'Cát'; ratingVi = 'Tốt — phù hợp xây cất/hướng cửa'; }
  else if (score >= 50) { rating = 'Bình'; ratingVi = 'Trung hoà — chấp nhận được'; }
  else if (score >= 35) { rating = 'Hơi kỵ'; ratingVi = 'Hơi bất lợi — cần hoá giải'; }
  else { rating = 'Hung'; ratingVi = 'Xung khắc mạnh — nên đổi hướng'; }

  const advice = [];
  if (bestRule === '合十') advice.push('Hướng này RẤT TỐT cho xây cất, mở cửa chính, bố trí bàn thờ/bàn làm việc.');
  else if (bestRule === '生成' || bestRule === '同运') advice.push('Hướng tốt, dùng được cho nhà ở và văn phòng.');
  else if (rating === 'Hung' || rating === 'Hơi kỵ') advice.push('Nên đổi hướng hoặc dùng vật phẩm phong thuỷ hoá giải (gương, la bàn, ngũ hành tương sinh).');
  else advice.push('Hướng trung tính — kết hợp thêm Phi Tinh (xuankong.js) và tam hợp (yinzhai.js) để quyết định.');
  const better = MOUNTAINS_24
    .map((mm) => ({ m: mm.zhi, sc: daguaCompatibility0(sit, mm.zhi) }))
    .filter((x) => x.sc >= 75 && x.m !== sit)
    .sort((p, q) => q.sc - p.sc)
    .slice(0, 3)
    .map((x) => `${x.m}(${x.sc})`);
  if (better.length) advice.push(`Với toạ ${sit}, các hướng CÁT hơn: ${better.join(', ')}.`);

  return {
    ok: true,
    sit: a,
    face: b,
    score,
    rating,
    ratingVi,
    bestRule,
    rules,
    isOpposite,
    advice,
    summary: `Toạ ${sit}(${a.hexagram}, vận ${sa.yun}/${sa.star}) ↔ Hướng ${face}(${b.hexagram}, vận ${fa.yun}/${fa.star}): ${rating} (${score}/100) — ${ratingVi}.`,
  };
}

function daguaCompatibility0(sit, face) {
  const sa = DAGUA_MAP[sit]; const fa = DAGUA_MAP[face];
  if (!sa || !fa) return 0;
  let s = 50;
  if (isHeTen(sa.yun, fa.yun)) s += 35;
  if (isShengCheng(sa.yun, fa.yun)) s += 22;
  if (isTongYun(sa.yun, fa.yun)) s += 12;
  const KE = { 'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thuỷ', 'Thuỷ': 'Hoả', 'Hoả': 'Kim' };
  const SHENG = { 'Kim': 'Thuỷ', 'Thuỷ': 'Mộc', 'Mộc': 'Hoả', 'Hoả': 'Thổ', 'Thổ': 'Kim' };
  const upA = BAGUA[sa.upper].ele, upB = BAGUA[fa.upper].ele;
  if (KE[upA] === upB || KE[upB] === upA) s -= 20;
  else if (SHENG[upA] === upB || SHENG[upB] === upA) s += 8;
  return Math.max(0, Math.min(100, s));
}

// ---------------------------------------------------------------------------
// API 3: daguaOverview() — tổng quan 24 sơn + hướng cát-kỵ tất cả
// ---------------------------------------------------------------------------
export function daguaOverview() {
  const rows = MOUNTAINS_24.map((m) => {
    const d = daguaByMountain(m.zhi);
    return { mountain: m.zhi, vi: m.vi, dir: m.dir, palace: m.palaceVi, hex: d.hexagram, hexVi: d.hexagramVi, yun: d.yun, star: d.star, family: d.family, yunCat: d.yunCat };
  });

  // Các sơn có vận 1/9 (cha-mẹ, cát vượng) → ưu tiên xây
  const bestYun = rows.filter((r) => r.yun === 1 || r.yun === 9).map((r) => `${r.mountain}(${r.vi},v${r.yun})`);
  // Cặp hợp 10 kinh điển (mỗi toạ → 1 hướng đối lập vận)
  const heTenPairs = [];
  for (const a of DAGUA_24) {
    for (const b of DAGUA_24) {
      if (a.zhi === b.zhi) continue;
      if (isHeTen(a.yun, b.yun)) {
        const key = [a.zhi, b.zhi].sort().join('↔');
        if (!heTenPairs.some((p) => p.key === key)) {
          heTenPairs.push({ key, sit: a.zhi, face: b.zhi, ya: a.yun, yb: b.yun });
        }
      }
    }
  }

  return {
    title: '玄空大卦 — Tổng quan 24 sơn × 64 quẻ (张心言 lineage)',
    rows,
    bestYun,
    heTenPairs: heTenPairs.slice(0, 12),
    mountainsCount: MOUNTAINS_24.length,
    note: `Đại Quái (CANONICAL — 张心言 lineage, quy tắc đổi hào đã xác minh): 卦运 1-9 (5=空亡) ` +
          `được suy từ 8 quẻ thuần=1运 + 8 cặp phu-thê=9运 + 江东(6,7,8)/江西(2,3,4). ` +
          `Cát nhất: 合十 (1+9/2+8/3+7/4+6), kế 生成 (Hà Đồ), rồi 同运. ` +
          `Mỗi sơn chỉ là 1 quẻ đại diện (sơn thật chứa 2-3 quẻ); hệ đầy đủ 抽爻换象 cần 384 爻.`,
  };
}

// ---------------------------------------------------------------------------
// Danh sách 24 sơn dạng Hán (dùng cho UI select)
// ---------------------------------------------------------------------------
export const MOUNTAINS_HAN = MOUNTAINS_24.map((m) => m.zhi);
