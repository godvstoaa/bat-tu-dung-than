// ============================================================================
//  测字 (CHẨM TỰ / CHARACTER DIVINATION) — 拆字 divination module
//  User inputs ONE Chinese character →拆 ra bộ thủ + nét + ngũ hành + quẻ.
//
//  Phương pháp (giản lược theo 测字 / 拆字 truyền thống + 梅花易数 gieo quẻ):
//    1. Lấy bộ thủ (部首) + số nét bộ thủ → từ bảng ~50 chữ thường gặp.
//    2. Số nét chữ (康熙 nét, reuse STROKES từ name.js nếu có, nếu không có fallback).
//    3. Ngũ hành của chữ (từ bộ thủ hoặc số nét).
//    4. Gieo quẻ 梅花易数 theo công thức:
//         upper = strokes % 8
//         lower = (strokes + radicalStrokes) % 8
//         changing = (upper + lower) % 6 + 1
//       (modulo 8 → 0 thay bằng 8; 0..7 ánh xạ sang 先天 số 1-8 quái).
//    5. Phân tích 拆字 (tháo chữ thành thành phần cho ~30 chữ thường gặp).
//    6. Luận: kết hợp quẻ + ý nghĩa chữ + ngũ hành → fortune.
//
//  Nguồn tham khảo: 《测字秘牒》·《字触》·《梅花易数》·《康熙字典》部首/nét.
//  Đây là module giản lược, mang tính tham khảo vui — KHÔNG thay bát tự/tử vi.
// ============================================================================
import { WX_VI } from './constants.js';
import { STROKES } from './name.js';

// ---------------------------------------------------------------------------
// 8 QUÁI (theo 先天 số 1-8). lines: 3 hào từ dưới lên (1=dương, 0=âm).
// Map số 1-8 → quái (sau modulo 8, ta sẽ +1 và dùng index này).
// ---------------------------------------------------------------------------
const TRIGRAMS = {
  乾: { num: 1, vi: 'Càn', wx: 'Kim', img: '☰', ele: 'Trời', lines: [1, 1, 1], nature: 'cương kiện, sáng tạo, cha' },
  兑: { num: 2, vi: 'Đoài', wx: 'Kim', img: '☱', ele: 'Đầm', lines: [1, 1, 0], nature: 'vui vẻ, ngôn luận, thiểu nữ' },
  离: { num: 3, vi: 'Ly', wx: 'Hỏa', img: '☲', ele: 'Lửa', lines: [1, 0, 1], nature: 'rực rỡ, minh trí, giữa nữ' },
  震: { num: 4, vi: 'Chấn', wx: 'Mộc', img: '☳', ele: 'Sấm', lines: [1, 0, 0], nature: 'kích động, tiến, trưởng nam' },
  巽: { num: 5, vi: 'Tốn', wx: 'Mộc', img: '☴', ele: 'Gió', lines: [0, 1, 1], nature: 'nhu thuận, thâm nhập, trưởng nữ' },
  坎: { num: 6, vi: 'Khảm', wx: 'Thủy', img: '☵', ele: 'Nước', lines: [0, 1, 0], nature: 'hiểm trở, trí, giữa nam' },
  艮: { num: 7, vi: 'Cấn', wx: 'Thổ', img: '☶', ele: 'Núi', lines: [0, 0, 1], nature: 'dừng lại, vững, thiểu nam' },
  坤: { num: 8, vi: 'Khôn', wx: 'Thổ', img: '☷', ele: 'Đất', lines: [0, 0, 0], nature: 'nhu thuận, bao dung, mẹ' },
};
const NUM2TRI = ['坤', '乾', '兑', '离', '震', '巽', '坎', '艮', '坤']; // index 0→8 (0 & 8 → 坤)

// 64 hexagram theo [hạ][thượng] (King Wen)
const HEX64 = {
  乾: { 乾: '乾', 兑: '夬', 离: '大有', 震: '大壮', 巽: '小畜', 坎: '需', 艮: '大畜', 坤: '泰' },
  兑: { 乾: '履', 兑: '兑', 离: '睽', 震: '归妹', 巽: '中孚', 坎: '节', 艮: '损', 坤: '临' },
  离: { 乾: '同人', 兑: '革', 离: '离', 震: '丰', 巽: '家人', 坎: '既济', 艮: '贲', 坤: '明夷' },
  震: { 乾: '无妄', 兑: '随', 离: '噬嗑', 震: '震', 巽: '益', 坎: '屯', 艮: '颐', 坤: '复' },
  巽: { 乾: '姤', 兑: '大过', 离: '鼎', 震: '恒', 巽: '巽', 坎: '井', 艮: '蛊', 坤: '升' },
  坎: { 乾: '讼', 兑: '困', 离: '未济', 震: '解', 巽: '涣', 坎: '坎', 艮: '蒙', 坤: '师' },
  艮: { 乾: '遁', 兑: '咸', 离: '旅', 震: '小过', 巽: '渐', 坎: '蹇', 艮: '艮', 坤: '谦' },
  坤: { 乾: '否', 兑: '萃', 离: '晋', 震: '豫', 巽: '观', 坎: '比', 艮: '剥', 坤: '坤' },
};
// Tên Hán-Việt 64 quẻ (rút gọn, đủ cho ~30 quẻ thường gặp)
const HEX_VI = {
  乾: 'Thuần Càn', 夬: 'Trạch Thiên Quải', 大有: 'Hỏa Thiên Đại Hữu', 大壮: 'Lôi Thiên Đại Tráng',
  小畜: 'Phong Thiên Tiểu Súc', 需: 'Thủy Thiên Nhu', 大畜: 'Sơn Thiên Đại Súc', 泰: 'Địa Thiên Thái',
  履: 'Thiên Trạch Lý', 兑: 'Trạch Trạch Đoài', 睽: 'Hỏa Trạch Khuê', 归妹: 'Lôi Trạch Quy Muội',
  中孚: 'Phong Trạch Trung Phu', 节: 'Thủy Trạch Tiết', 损: 'Sơn Trạch Tổn', 临: 'Địa Trạch Lâm',
  同人: 'Thiên Hỏa Đồng Nhân', 革: 'Trạch Hỏa Cách', 离: 'Thuần Ly', 丰: 'Lôi Hỏa Phong',
  家人: 'Phong Hỏa Gia Nhân', 既济: 'Thủy Hỏa Ký Tế', 贲: 'Sơn Hỏa Bí', 明夷: 'Địa Hỏa Minh Di',
  无妄: 'Thiên Lôi Vô Vọng', 随: 'Trạch Lôi Tùy', 噬嗑: 'Hỏa Lôi Phệ Hạp', 震: 'Thuần Chấn',
  益: 'Phong Lôi Ích', 屯: 'Thủy Lôi Truân', 颐: 'Sơn Lôi Di', 复: 'Địa Lôi Phục',
  姤: 'Thiên Phong Cấu', 大过: 'Trạch Phong Đại Quá', 鼎: 'Hỏa Phong Đỉnh', 恒: 'Lôi Phong Hằng',
  巽: 'Thuần Tốn', 井: 'Thủy Phong Tỉnh', 蛊: 'Sơn Phong Cổ', 升: 'Địa Phong Thăng',
  讼: 'Thiên Thủy Tụng', 困: 'Trạch Thủy Khốn', 未济: 'Hỏa Thủy Vị Tế', 解: 'Lôi Thủy Giải',
  涣: 'Phong Thủy Hoán', 坎: 'Thuần Khảm', 蒙: 'Sơn Thủy Mông', 师: 'Địa Thủy Sư',
  遁: 'Thiên Sơn Độn', 咸: 'Trạch Sơn Hàm', 旅: 'Hỏa Sơn Lữ', 小过: 'Lôi Sơn Tiểu Quá',
  渐: 'Phong Sơn Tiệm', 蹇: 'Thủy Sơn Kiển', 艮: 'Thuần Cấn', 谦: 'Địa Sơn Khiêm',
  否: 'Thiên Địa Bĩ', 萃: 'Trạch Địa Tụy', 晋: 'Hỏa Địa Tấn', 豫: 'Lôi Địa Dự',
  观: 'Phong Địa Quán', 比: 'Thủy Địa Tỷ', 剥: 'Sơn Địa Bác', 坤: 'Thuần Khôn',
};

// Ngũ hành sinh/khắc (dùng Mộc/Hỏa/Thổ/Kim/Thủy VI-key cho nhất quán với app)
const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const KE = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };

// ---------------------------------------------------------------------------
// BỘ THỦ 部首: số nét của một số bộ phổ biến (康熙 nét — để tính lower quái).
// Bảng này GIẢN LƯỢC cho ~30 bộ thường gặp trong test; ngoài bảng → fallback.
// ---------------------------------------------------------------------------
const RADICAL_STROKES = {
  一: 1, 丨: 1, 丶: 1, 丿: 1, 乙: 1, 亅: 1,
  二: 2, 人: 2, 入: 2, 八: 2, 力: 2, 儿: 2, 十: 2, 卜: 2, 厂: 2, 又: 2, 匕: 2,
  口: 3, 土: 3, 士: 3, 大: 3, 女: 3, 子: 3, 寸: 3, 小: 3, 山: 3, 工: 3, 干: 3, 弓: 3, 才: 3,
  心: 4, 手: 4, 日: 4, 月: 4, 木: 4, 水: 4, 火: 4, 犬: 4, 王: 4, 贝: 4, 见: 4, 车: 4, 止: 4, 户: 4,
  目: 5, 田: 5, 禾: 5, 白: 5, 立: 5, 石: 5, 示: 5, 生: 5, 穴: 5, 失: 5,
  竹: 6, 米: 6, 糸: 6, 羊: 6, 耳: 6, 肉: 6, 艮: 6, 虫: 6, 血: 6, 行: 6, 衣: 6, 西: 6,
  見: 7, 言: 7, 走: 7, 足: 7, 車: 7, 辛: 7, 辰: 7, 邑: 7, 酉: 7, 里: 7,
  金: 8, 長: 8, 門: 8, 阜: 8, 隶: 8, 雨: 8, 非: 8, 齿: 8,
  頁: 9, 風: 9, 飛: 9, 食: 9, 首: 9, 香: 9,
  馬: 10, 骨: 10, 高: 10, 鬥: 10,
  鳥: 11, 鹵: 11, 鹿: 11, 麥: 11, 麻: 11,
  黃: 12, 黑: 12, 黍: 12,
  鼓: 13, 鼠: 13,
  齊: 14, 齒: 14,
  龍: 16, 龜: 16,
};

// ---------------------------------------------------------------------------
// CHARACTER_DATA — ~50 chữ Hán thường gặp.
//   { radical, radicalStrokes, strokes (康熙), wx, decomposition, baseMeaning }
// strokes ưu tiên khớp STROKES (name.js); nếu lệch do giản thể, dùng康熙 ở đây.
// ---------------------------------------------------------------------------
const CHARACTER_DATA = {
  // —— Số / đơn giản ——
  一: { radical: '一', radicalStrokes: 1, strokes: 1, wx: '水', decomposition: 'một nét ngang duy nhất', baseMeaning: 'khởi đầu, đơn nhất, nguyên thuỷ' },
  二: { radical: '二', radicalStrokes: 2, strokes: 2, wx: '火', decomposition: 'hai nét ngang chồng nhau', baseMeaning: 'cặp, song hành, cân bằng' },
  三: { radical: '一', radicalStrokes: 1, strokes: 3, wx: '木', decomposition: 'ba nét ngang — Thiên-Nhân-Địa', baseMeaning: 'đầy đủ, vững vàng (tam tài)' },
  十: { radical: '十', radicalStrokes: 2, strokes: 2, wx: '金', decomposition: 'nét ngang + nét sổ chéo tại tâm', baseMeaning: 'đủ mười, trọn vẹn, hoàn thành' },
  百: { radical: '白', radicalStrokes: 5, strokes: 6, wx: '水', decomposition: '一 trên đầu 白 (trăm)', baseMeaning: 'trăm, nhiều, đầy' },
  千: { radical: '十', radicalStrokes: 2, strokes: 3, wx: '金', decomposition: '丿 + 十', baseMeaning: 'nghìn, đông đảo' },
  万: { radical: '一', radicalStrokes: 1, strokes: 3, wx: '水', decomposition: '一 + 𠃌 + 丿', baseMeaning: 'vạn, vô số' },
  大: { radical: '大', radicalStrokes: 3, strokes: 3, wx: '火', decomposition: 'người dang tay chân (人 + 一)', baseMeaning: 'to lớn, vĩ đại, mở rộng' },
  小: { radical: '小', radicalStrokes: 3, strokes: 3, wx: '金', decomposition: 'nét giữa + hai chấm nhỏ', baseMeaning: 'nhỏ, khiêm nhường' },
  中: { radical: '丨', radicalStrokes: 1, strokes: 4, wx: '火', decomposition: '口 + 丨 xuyên tâm', baseMeaning: 'giữa, đúng lúc, trúng' },
  // —— Tự nhiên / sự vật ——
  天: { radical: '大', radicalStrokes: 3, strokes: 4, wx: '火', decomposition: '一 trên đầu 大', baseMeaning: 'trời, trên cao, mệnh trời' },
  日: { radical: '日', radicalStrokes: 4, strokes: 4, wx: '火', decomposition: 'khung vuông + chấm trong', baseMeaning: 'mặt trời, dương, sáng' },
  月: { radical: '月', radicalStrokes: 4, strokes: 4, wx: '木', decomposition: 'lưỡi liềm với hai vạch', baseMeaning: 'mặt trăng, âm, nữ' },
  星: { radical: '日', radicalStrokes: 4, strokes: 9, wx: '金', decomposition: '日 (trên) + 生 (dưới)', baseMeaning: 'ngôi sao, sáng, hy vọng' },
  山: { radical: '山', radicalStrokes: 3, strokes: 3, wx: '土', decomposition: 'ba đỉnh nhọn', baseMeaning: 'núi, vững chãi, cao' },
  水: { radical: '水', radicalStrokes: 4, strokes: 4, wx: '水', decomposition: 'dòng chảy giữa + hai tia hai bên', baseMeaning: 'nước, mềm mại, tài' },
  火: { radical: '火', radicalStrokes: 4, strokes: 4, wx: '火', decomposition: 'ngọn lửa với tia bắn', baseMeaning: 'lửa, nhiệt, danh' },
  木: { radical: '木', radicalStrokes: 4, strokes: 4, wx: '木', decomposition: 'thân + cành + rễ', baseMeaning: 'cây, sinh trưởng, nhân' },
  土: { radical: '土', radicalStrokes: 3, strokes: 3, wx: '土', decomposition: 'mound đất + vạch dưới', baseMeaning: 'đất, nền tảng, tín' },
  金: { radical: '金', radicalStrokes: 8, strokes: 8, wx: '金', decomposition: 'nắp + vương + hai chấm', baseMeaning: 'vàng, của cải, cương' },
  石: { radical: '石', radicalStrokes: 5, strokes: 5, wx: '土', decomposition: '厂 + 口', baseMeaning: 'đá, rắn, cứng' },
  风: { radical: '风', radicalStrokes: 4, strokes: 4, wx: '木', decomposition: '几 + 乂 (giản thể)', baseMeaning: 'gió, biến, lan' },
  雨: { radical: '雨', radicalStrokes: 8, strokes: 8, wx: '水', decomposition: 'trời + 4 giọt mưa', baseMeaning: 'mưa, ơn trú, dưỡng' },
  云: { radical: '二', radicalStrokes: 2, strokes: 4, wx: '水', decomposition: '二 + 厶', baseMeaning: 'mây, cao, mơ' },
  // —— Người / thân ——
  人: { radical: '人', radicalStrokes: 2, strokes: 2, wx: '金', decomposition: 'hai nét đỡ nhau', baseMeaning: 'người, nhân, bề trên' },
  心: { radical: '心', radicalStrokes: 4, strokes: 4, wx: '火', decomposition: 'tim + ba mạch', baseMeaning: 'tim, tâm, ý' },
  口: { radical: '口', radicalStrokes: 3, strokes: 3, wx: '木', decomposition: 'khung vuông mở', baseMeaning: 'miệng, nói, vào' },
  手: { radical: '手', radicalStrokes: 4, strokes: 4, wx: '金', decomposition: 'lòng bàn tay + năm ngón', baseMeaning: 'tay, làm, hành động' },
  目: { radical: '目', radicalStrokes: 5, strokes: 5, wx: '水', decomposition: 'mắt + hai đồng tử', baseMeaning: 'mắt, nhìn, mục tiêu' },
  女: { radical: '女', radicalStrokes: 3, strokes: 3, wx: '水', decomposition: 'phụ nữ quỳ với tay chéo', baseMeaning: 'nữ, mềm, duyên' },
  子: { radical: '子', radicalStrokes: 3, strokes: 3, wx: '水', decomposition: 'đầu + hai tay bé', baseMeaning: 'con, người, bậc chân nhân' },
  王: { radical: '王', radicalStrokes: 4, strokes: 4, wx: '土', decomposition: 'Tam tài (天-人-Địa) xuyên bởi 丨', baseMeaning: 'vua, đỉnh, tối cao' },
  // —— Tài / phúc / vận ——
  财: { radical: '贝', radicalStrokes: 4, strokes: 7, wx: '金', decomposition: '贝 (vỏ sò=tiền) + 才', baseMeaning: 'tài, của cải' },
  富: { radical: '宀', radicalStrokes: 3, strokes: 12, wx: '水', decomposition: '宀 + 一 + 口 + 田', baseMeaning: 'phú, giàu, đầy đủ' },
  福: { radical: '示', radicalStrokes: 5, strokes: 14, wx: '水', decomposition: '示 (bàn thờ) + 一 + 口 + 田', baseMeaning: 'phúc, may mắn, hạnh phúc' },
  寿: { radical: '寸', radicalStrokes: 3, strokes: 7, wx: '金', decomposition: '丰 + 寸', baseMeaning: 'thọ, dài lâu' },
  喜: { radical: '口', radicalStrokes: 3, strokes: 12, wx: '水', decomposition: '吉 + 豆 + khẩu (nhiều miệng vui)', baseMeaning: 'hỷ, vui, cưới hỏi' },
  安: { radical: '宀', radicalStrokes: 3, strokes: 6, wx: '土', decomposition: '宀 (mái nhà) + 女', baseMeaning: 'an, nữ dưới mái = bình an' },
  平: { radical: '干', radicalStrokes: 3, strokes: 5, wx: '水', decomposition: 'hai nét ngang cân bằng', baseMeaning: 'bình, bằng, yên' },
  吉: { radical: '口', radicalStrokes: 3, strokes: 6, wx: '木', decomposition: '士 + 口', baseMeaning: 'cát, lành, tốt' },
  // —— Hành động / nghề ——
  行: { radical: '行', radicalStrokes: 6, strokes: 6, wx: '水', decomposition: '彳 + 亍 (hai chân bước)', baseMeaning: 'đi, làm, tiến' },
  走: { radical: '走', radicalStrokes: 7, strokes: 7, wx: '土', decomposition: '土 + 止 (chân bước)', baseMeaning: 'chạy, tiến, rời' },
  言: { radical: '言', radicalStrokes: 7, strokes: 7, wx: '木', decomposition: 'lời nói: nắp + miệng', baseMeaning: 'lời, nói, hứa' },
  書: { radical: '曰', radicalStrokes: 4, strokes: 10, wx: '金', decomposition: '聿 (bút) + 曰 (nói)', baseMeaning: 'sách, viết, học' },
  學: { radical: '子', radicalStrokes: 3, strokes: 16, wx: '水', decomposition: 'hai tay + mái + tử', baseMeaning: 'học, noi theo' },
  馬: { radical: '馬', radicalStrokes: 10, strokes: 10, wx: '水', decomposition: 'đầu + bốn chân + đuôi', baseMeaning: 'ngựa, tiến nhanh, tự lực' },
  龍: { radical: '龍', radicalStrokes: 16, strokes: 16, wx: '土', decomposition: 'rồng: sừng + thân + vảy', baseMeaning: 'rồng, đế, vinh hiển' },
  春: { radical: '日', radicalStrokes: 4, strokes: 9, wx: '木', decomposition: 'ba người + nhật (nắng ấm)', baseMeaning: 'xuân, sinh sôi, khởi đầu mới' },
  秋: { radical: '禾', radicalStrokes: 5, strokes: 9, wx: '金', decomposition: '禾 (lúa) + 火 (lửa gặt)', baseMeaning: 'thu, thu hoạch' },
  花: { radical: '艹', radicalStrokes: 6, strokes: 10, wx: '木', decomposition: '艹 (cỏ) + 化', baseMeaning: 'hoa, nở, duyên' }, // [cycle 50] 康熙: 艹=6, tổng 10 (cũ '艮'/4/7 = nét giản thể, sai ngũ hành bộ)
};

// ---------------------------------------------------------------------------
// FALLBACK: ước lượng nét & ngũ hành khi chữ không trong CHARACTER_DATA.
// Ngũ hành fallback: theo số nét cuối (1-2 Mộc, 3-4 Hỏa, 5-6 Thổ, 7-8 Kim,
// 9-0 Thủy) — quy tắc phổ biến trong 五格剖象 (name.js wxOf).
// ---------------------------------------------------------------------------
function fallbackStrokes(char) {
  // Ưu tiên bảng STROKES của name.js (康熙 nét curated)
  if (STROKES && STROKES[char] != null) return STROKES[char];
  // Nếu không → ước lượng theo mã điểm UTF-16 (rất thô, chỉ để tránh NaN)
  const cp = char.codePointAt(0) || 0;
  return Math.max(1, (cp % 18) + 2); // 2-19 nét
}
function fallbackRadical(char) {
  // Không có bảng bộ thủ đầy đủ → mặc định 一 (1 nét) cho ký tự lạ
  return { radical: '一', radicalStrokes: RADICAL_STROKES['一'] || 1 };
}
function wxByStrokes(n) {
  const d = n % 10;
  return { 1: '木', 2: '木', 3: '火', 4: '火', 5: '土', 6: '土', 7: '金', 8: '金', 9: '水', 0: '水' }[d];
}

// ---------------------------------------------------------------------------
// GIEO QUẺ 梅花易数 theo công thức spec:
//   upper = strokes % 8
//   lower = (strokes + radicalStrokes) % 8
//   changing = (upper + lower) % 6 + 1   (hào động, 1-6)
// ---------------------------------------------------------------------------
function triOf(num8) {
  // num8 đã modulo 8 → 0..7. Map 0→8 (坤), 1→乾 ... 7→艮 theo NUM2TRI[1..8].
  // Theo spec dùng % 8 nên 0 là hợp lệ; ta đổi 0 thành 8 để tra NUM2TRI[8]=坤.
  const n = num8 === 0 ? 8 : num8;
  return NUM2TRI[n];
}
function buildHexagram(strokes, radicalStrokes) {
  // [cycle 50] NOTE: 梅花易数 CHUẨN (一字占) dùng 时辰 cho HẠ QUẺ (lower = giờ%8) + (nét+giờ)%6 cho hào động.
  //   Tool này KHÔNG nhập giờ → dùng biến thể ĐỊNH NGHIỆM (lower = (nét+nét bộ)%8) để vẫn ra quẻ xác định
  //   theo chữ. Đây KHÔNG phải 梅花 时辰 pháp chính thống — ghi nhận để không nhầm là canonical.
  const upperNum = strokes % 8;
  const lowerNum = (strokes + radicalStrokes) % 8;
  const upper = triOf(upperNum);
  const lower = triOf(lowerNum);
  const changing = (upperNum + lowerNum) % 6 + 1; // 1-6
  const name = HEX64[lower]?.[upper] || '?';
  // 6 hào (dưới lên): 3 hào dưới = lower.lines, 3 trên = upper.lines
  const lines = [...TRIGRAMS[lower].lines, ...TRIGRAMS[upper].lines];
  // Quẻ biến: lật hào động
  const bianLines = lines.slice();
  bianLines[changing - 1] = bianLines[changing - 1] ? 0 : 1;
  const lo3 = bianLines.slice(0, 3);
  const up3 = bianLines.slice(3, 6);
  const lowerTri = Object.keys(TRIGRAMS).find((k) => TRIGRAMS[k].lines.join('') === lo3.join(''));
  const upperTri = Object.keys(TRIGRAMS).find((k) => TRIGRAMS[k].lines.join('') === up3.join(''));
  const bianName = (lowerTri && upperTri) ? (HEX64[lowerTri]?.[upperTri] || '?') : '?';
  // Thể = hạ quái (không đổi gốc), Dụng = thượng quái
  const ti = TRIGRAMS[lower];
  const yong = TRIGRAMS[upper];
  // Quan hệ ngũ hành thể-dụng → cát hung
  let relVi = '', luck = 'Bình';
  if (ti.wx === yong.wx) { relVi = 'thể dụng đồng hành — hoà hợp'; luck = 'Cát'; }
  else if (SHENG[yong.wx] === ti.wx) { relVi = 'dụng sinh thể — đại cát'; luck = 'Đại cát'; }
  else if (SHENG[ti.wx] === yong.wx) { relVi = 'thể sinh dụng — hao tổn'; luck = 'Hung'; }
  else if (KE[ti.wx] === yong.wx) { relVi = 'thể khắc dụng — khó nhưng thành'; luck = 'Tiểu cát'; }
  else if (KE[yong.wx] === ti.wx) { relVi = 'dụng khắc thể — đại hung'; luck = 'Đại hung'; }
  return {
    upper: { name: upper, ...TRIGRAMS[upper] },
    lower: { name: lower, ...TRIGRAMS[lower] },
    name,
    nameVi: HEX_VI[name] || name,
    changing,
    bian: { name: bianName, nameVi: HEX_VI[bianName] || bianName },
    relation: { ti: ti.wx, yong: yong.wx, vi: relVi, luck },
    lines,
  };
}

// ---------------------------------------------------------------------------
// LUẬN FORTUNE — kết hợp quẻ + ý nghĩa chữ + ngũ hành.
// ---------------------------------------------------------------------------
function buildFortune(char, data, hex) {
  const toneMap = {
    'Đại cát': { tone: 'cat', vi: 'RẤT TỐT' },
    'Cát': { tone: 'cat', vi: 'TỐT' },
    'Tiểu cát': { tone: 'mid', vi: 'KHÁ' },
    'Bình': { tone: 'mid', vi: 'TRUNG BÌNH' },
    'Hung': { tone: 'hung', vi: 'CẨN THẬN' },
    'Đại hung': { tone: 'hung', vi: 'NGUY HIỂM' },
  };
  const t = toneMap[hex.relation.luck] || toneMap['Bình'];
  const wxVi = WX_VI[data.wx] || data.wx;
  const meaning = data.baseMeaning || '(chữ chưa có trong bảng, chỉ luận theo quẻ)';
  const lines = [];
  lines.push(`Chữ 「${char}」 — bộ thủ 「${data.radical}」 (${data.radicalStrokes} nét), toàn chữ ${data.strokes} nét (康熙), ngũ hành ${wxVi}.`);
  lines.push(`Ý nghĩa nền: ${meaning}.`);
  if (data.decomposition) lines.push(`拆字: ${data.decomposition}.`);
  lines.push(`Gieo quẻ 梅花: thượng ${hex.upper.vi} (${hex.upper.ele}) — hạ ${hex.lower.vi} (${hex.lower.ele}) → quẻ 「${hex.name}」 (${hex.nameVi}). Hào động ${hex.changing}.`);
  lines.push(`Quan hệ thể-dụng: ${hex.relation.vi} (${hex.relation.luck}).`);
  lines.push(`Quẻ biến: 「${hex.bian.name}」 (${hex.bian.nameVi}) — xu hướng kết cuộc.`);
  lines.push(`Tổng luận: vận tự 「${char}」 mang khí ${t.vi}. ${data.wx === '金' || data.wx === '水' ? 'Khí thu - uyên bác, nên phát triển dần.' : data.wx === '木' || data.wx === '火' ? 'Khí xuân - hưng thịnh, nên tiến thủ.' : 'Khí tứ quý - ổn định, nên kiên nhẫn.'}`);
  return { tone: t.tone, toneVi: t.vi, lines };
}

// ---------------------------------------------------------------------------
// cezi(char) — API chính.
//   Trả: { char, radical, strokes, wx, hexagram, decomposition, meaning, fortune, summary }
//   Trả null nếu đầu vào không hợp lệ.
// ---------------------------------------------------------------------------
export function cezi(char) {
  // Chuẩn hoá: lấy 1 ký tự đầu, strip khoảng trắng
  if (char == null) return null;
  const s = String(char).trim();
  if (!s) return null;
  // Lấy 1 codepoint đầu (hỗ trợ ký tự CJK 1 điểm)
  const cp = s.codePointAt(0);
  const ch = String.fromCodePoint(cp);
  // Bỏ qua nếu không phải ký tự "chữ" (chữ số la-tinh thường, dấu câu thuần)
  // Cho phép CJK (0x4E00-0x9FFF) + phần mở rộng; cho phép mọi ký tự non-ASCII để test dễ.
  const isAscii = ch.charCodeAt(0) < 128;
  if (isAscii && !/[一-鿿]/.test(ch)) return null;

  // Tra CHARACTER_DATA; nếu không có → fallback
  let data = CHARACTER_DATA[ch];
  let usedFallback = false;
  if (!data) {
    usedFallback = true;
    const r = fallbackRadical(ch);
    data = {
      radical: r.radical,
      radicalStrokes: r.radicalStrokes,
      strokes: fallbackStrokes(ch),
      wx: wxByStrokes(fallbackStrokes(ch)),
      decomposition: '(chưa có phân tách thủ công — dùng nét & ngũ hành ước lượng)',
      baseMeaning: null,
    };
  }

  const hex = buildHexagram(data.strokes, data.radicalStrokes);
  const fortune = buildFortune(ch, data, hex);

  const summary = `「${ch}」 ${fortune.toneVi} — quẻ ${hex.name} (${hex.nameVi}), ngũ hành ${WX_VI[data.wx] || data.wx}, ${data.strokes} nét.`;

  return {
    char: ch,
    radical: data.radical,
    radicalStrokes: data.radicalStrokes,
    strokes: data.strokes,
    wx: data.wx,
    wxVi: WX_VI[data.wx] || data.wx,
    hexagram: hex,
    decomposition: data.decomposition,
    meaning: data.baseMeaning,
    fortune,
    summary,
    usedFallback,
  };
}

// Export bảng & helper để UI/test dùng
export { CHARACTER_DATA, RADICAL_STROKES };
