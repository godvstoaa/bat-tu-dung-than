// ============================================================================
//  六十太岁将军 — 60 VỊ TRỊ NIÊN THÁI TUẾ (值年太岁大将军)
//  "Thái tuế năm nay tên gì? Bản mệnh thái tuế của tôi là ai?" — danh tính + hóa giải.
//  Khác taisui.js (12 loại hình + phương vị + an thái tuế): module này = DANH TÍNH
//    60 vị tướng theo hoa giáp (mỗi năm 1 vị trị niên), + tính cách + liên kết hóa giải.
//  * Trị niên thái tuế: năm đó ai trị (vd 2024 甲辰=李诚, 2025 乙巳=吴遂, 2026 丙午=文哲).
//  * Bản mệnh thái tuế: thái tuế năm sinh (癸酉 1993=康志...).
//  * 5 loại phạm thái tuế (值/冲/破/害/刑) đều cần an/ hóa vị trị niên thái tuế.
//  Nguồn: 六十甲子值年太岁一览 (新浪), 道教总庙三清宫 太岁星君, 维基 模板:六十太岁.
// ============================================================================
import { Solar } from 'lunar-javascript';

// 60 vị theo hoa giáp (đã đối chiếu 4 nguồn, neo 41 甲辰=李诚/2024, 42 乙巳=吴遂/2025, 43 丙午=文哲/2026)
export const TAISUI_60 = [
  ['甲子', '金辨'], ['乙丑', '陈材'], ['丙寅', '耿章'], ['丁卯', '沈兴'], ['戊辰', '赵达'],
  ['己巳', '郭灿'], ['庚午', '王清'], ['辛未', '李素'], ['壬申', '刘旺'], ['癸酉', '康志'],
  ['甲戌', '訾广'], ['乙亥', '任保'], ['丙子', '郭嘉'], ['丁丑', '汪文'], ['戊寅', '曾光'],
  ['己卯', '方仲'], ['庚辰', '董德'], ['辛巳', '郑但'], ['壬午', '陆明'], ['癸未', '魏仁'],
  ['甲申', '方杰'], ['乙酉', '蒋崇'], ['丙戌', '白敏'], ['丁亥', '封济'], ['戊子', '邹镗'],
  ['己丑', '傅佑'], ['庚寅', '邬桓'], ['辛卯', '范宁'], ['壬辰', '彭泰'], ['癸巳', '徐华'],
  ['甲午', '章词'], ['乙未', '杨贤'], ['丙申', '管仲'], ['丁酉', '唐查'], ['戊戌', '姜武'],
  ['己亥', '卢秘'], ['庚子', '虞起'], ['辛丑', '杨信'], ['壬寅', '贺谔'], ['癸卯', '皮时'],
  ['甲辰', '李诚'], ['乙巳', '吴遂'], ['丙午', '文哲'], ['丁未', '缪丙'], ['戊申', '徐浩'],
  ['己酉', '程宝'], ['庚戌', '倪秘'], ['辛亥', '叶坚'], ['壬子', '丘德'], ['癸丑', '朱得'],
  ['甲寅', '张朝'], ['乙卯', '万清'], ['丙辰', '辛亚'], ['丁巳', '易彦'], ['戊午', '姚达'],
  ['己未', '傅党'], ['庚申', '毛梓'], ['辛酉', '石政'], ['壬戌', '洪充'], ['癸亥', '卢程'],
];

// Ghi chú tính cách được biên soạn từ truyền thống (chỉ các vị có căn cứ văn hiến rõ)
const CURATED = {
  '甲辰': 'thanh liêm cương trực, chấp pháp nghiêm minh (thanh đại) — năm cương quyết, trọng quy củ, xử công.',
  '乙巳': 'thông minh hiếu học, thanh liêm cần kiệm (minh đại) — năm trọng học vấn, tiết kiệm, văn thư.',
  '丙午': 'cơ trí quyết đoán, dũng cảm bình loạn (minh đại) — năm nhanh nhạy, quyết đoán, biến động nhanh.',
  '丁未': 'chính trực, hay đọc sách — năm tĩnh tại, trọng đạo lý.',
  '戊申': 'cần恳, cẩn trọng — năm ổn trọng, ít rủi ro nếu chăm chỉ.',
  '甲午': 'trừ bạo an lương (minh đại) — năm công lý nổi, giải quyết nút thắt cũ.',
  '丙申': 'Quản Trọng — tể tướng Xuân Thu, mưu lược trị quốc — năm trọng mưu lược, chiến lược dài.',
  '甲子': 'Kim Biện — chính trực, hai tay có mắt (biết rõ phải trái) — năm phân minh phải-trái.',
  '癸酉': 'Khang Chí — chính trực, dũng cảm — năm cương quyết, dám làm.',
  '壬戌': 'Hồng Sung — cẩn thận, chu đáo — năm trọng an toàn.',
};

// Nạp âm → tính cách (dùng cho các vị chưa curated; an toàn, dẫn xuất từ hành nạp âm)
const NAYIN_TRAIT = {
  '海中金': 'cương nghị ẩn sâu, bền bỉ (kim trong biển)',
  '炉中火': 'nhiệt huyết, rực rỡ, cần dưỡng (lửa lò)',
  '大林木': 'chững chạc, che chở, phát chậm mà lâu (gỗ rừng)',
  '路旁土': 'chịu đựng, phục vụ, khiêm (đất bên đường)',
  '剑锋金': 'sắc bén, quyết liệt, dễ tổn (với kiếm)',
  '山头火': 'rực rỡ bốc cao, chói nhưng nhanh tắt (lửa đỉnh núi)',
  '涧下水': 'tinh khiết, uyển chuyển, tĩnh (nước khe suối)',
  '城墙土': 'vững chãi, phòng thủ, bảo thủ (đất thành)',
  '白蜡金': 'sáng, tinh khiết, mong manh (kim sáp trắng)',
  '杨柳木': 'linh hoạt, mềm mỏng, thích nghi (gỗ liễu)',
  '泉中水': 'trong, mát, nuôi dưỡng (nước suối)',
  '屋上土': 'bảo vệ, che chở, ổn (đất mái nhà)',
  '霹雳火': 'bùng nổ, đột ngột, mạnh (lửa sấm)',
  '松柏木': 'kiên cường, thẳng, trường thọ (gỗ tùng bách)',
  '长流水': 'liên tục, bền, thuận (nước chảy dài)',
  '沙中金': 'tinh tế, ẩn, cần lọc (kim trong cát)',
  '山下火': 'ấm áp, sáng vừa, quây quần (lửa chân núi)',
  '平地木': 'thấp, khiêm, dễ sinh trưởng (gỗ đồng bằng)',
  '壁上土': 'bảo vệ, ngăn cách, tĩnh (đất vách)',
  '金箔金': 'sang, đẹp, mỏng manh (kim lá vàng)',
  '覆灯火': 'dịu, che chở, linh thiêng (lửa đèn phủ)',
  '天河水': 'trên cao, thanh khiết, rộng (nước sông trời)',
  '石榴木': 'nhiều quả, ngoại cương, viên mãn (gỗ lựu)',
  '大海水': 'rộng lớn, biến động, bao dung (nước biển)',
  '大驿土': 'kết nối, giao thông, tĩnh (đất trạm)',
  '砂中金': 'tinh, ẩn (kim cát)',
  '天上火': 'sáng, cao, rực (lửa trời)',
  '钗钏金': 'tinh xảo, nữ tính, trang sức (kim trâm)',
  '桑柘木': 'kiên, nuôi tằm, thực dụng (gỗ dâu)',
};

function yearGanZhi(year) {
  const s = Solar.fromYmdHms(year, 6, 15, 12, 0, 0);
  const ec = s.getLunar().getEightChar();
  return { gz: ec.getYearGan() + ec.getYearZhi(), nayin: ec.getYearNaYin() };
}

/**
 * Trị niên thái tuế của 1 năm.
 * @returns {{ year, ganZhi, index, name, nayin, note }}
 */
export function taiSuiGeneral(year) {
  const { gz, nayin } = yearGanZhi(year);
  const idx = TAISUI_60.findIndex((t) => t[0] === gz);
  const name = TAISUI_60[idx]?.[1] || '?';
  const note = CURATED[gz] || `${name} đại tướng quân — nạp âm ${nayin}: ${NAYIN_TRAIT[nayin] || 'vị tướng trấn năm ' + gz}.`;
  return { year, ganZhi: gz, index: idx + 1, name: name + ' đại将军', nameShort: name, nayin, note };
}

/**
 * Toàn cảnh thái tuế cho lá số: bản mệnh (năm sinh) + trị niên (năm hỏi) + khuyến nghị.
 * @param {object} R — analyze()
 * @param {number} scanYear
 */
export function taiSuiOverview(R, scanYear) {
  const curYear = scanYear || new Date().getFullYear();
  const birthYear = R.chart.input.year;
  const natal = taiSuiGeneral(birthYear);
  const current = taiSuiGeneral(curYear);
  // Bản mệnh thái tuế = thái tuế năm sinh (chỉ khớp hoàn toàn khi lưu niên trùng năm sinh = 60t)
  const isBenMingYear = current.ganZhi === natal.ganZhi;
  const summary = `Trị niên Thái Tuế ${curYear} (${current.ganZhi}) = ${current.name}. ${current.note} ` +
    `Bản mệnh Thái Tuế (năm sinh ${birthYear} ${natal.ganZhi}) = ${natal.name}. ` +
    (isBenMingYear ? '⚠ Năm nay TRÙNG bản mệnh (60 hoa giáp) = phạm THÁI TUẾ (值太岁) thật sự — năm xui yếu, cần an/hóa.' : '') +
    `Khuyến nghị: nếu phạm 1 trong 5 loại (trị/xung/phá/hại/hình) → an Thái Tuế/thờ vị ${current.name} đầu năm, hướng (${curYear}) tránh xây cất, đeo vật phẩm hóa giải.`;
  return { natal, current, isBenMingYear, summary };
}

export { CURATED, NAYIN_TRAIT };
