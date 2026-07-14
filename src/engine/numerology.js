// numerology.js — Life Path (grok research)
export const LIFE_PATH = {
  "1": {
    "keyword": "Lãnh đạo, độc lập, tiên phong",
    "text": "Người số 1 mạnh mẽ, tự tin, thích tự quyết và mở đường. Đường đời nhấn vào chủ động, khởi nghiệp và trở thành hình mẫu; cần tránh độc đoán, thiếu kiên nhẫn."
  },
  "2": {
    "keyword": "Hòa hợp, hợp tác, nhạy cảm",
    "text": "Số 2 dịu dàng, tinh tế, giỏi lắng nghe và kết nối. Đường đời gắn với hỗ trợ, ngoại giao, cân bằng quan hệ; cần tránh phụ thuộc ý kiến người khác và né tránh xung đột quá mức."
  },
  "3": {
    "keyword": "Sáng tạo, biểu đạt, lạc quan",
    "text": "Số 3 vui tươi, truyền cảm hứng, mạnh về lời nói và nghệ thuật. Đường đời hướng tới giao tiếp, sáng tạo, lan tỏa niềm vui; cần tránh phân tán và hời hợt."
  },
  "4": {
    "keyword": "Kỷ luật, xây dựng, thực tế",
    "text": "Số 4 vững vàng, chăm chỉ, thích trật tự và nền tảng lâu dài. Đường đời gắn với lao động, hệ thống, sự ổn định; cần tránh cứng nhắc và sợ thay đổi."
  },
  "5": {
    "keyword": "Tự do, thay đổi, trải nghiệm",
    "text": "Số 5 năng động, tò mò, khao khát khám phá. Đường đời là du hành, đa dạng, học qua trải nghiệm; cần tránh thiếu cam kết và chạy theo khoái lạc nhất thời."
  },
  "6": {
    "keyword": "Trách nhiệm, yêu thương, nuôi dưỡng",
    "text": "Số 6 ấm áp, tận tụy, coi trọng gia đình và cộng đồng. Đường đời gắn với chăm sóc, phục vụ, tạo sự hài hòa; cần tránh hy sinh bản thân quá mức và kiểm soát."
  },
  "7": {
    "keyword": "Nội tâm, trí tuệ, tìm kiếm",
    "text": "Số 7 sâu sắc, phân tích, thích học hỏi và chiêm nghiệm. Đường đời hướng tới tri thức, tâm linh, sự thật; cần tránh cô lập và hoài nghi thái quá."
  },
  "8": {
    "keyword": "Thành tựu, quyền lực, thịnh vượng",
    "text": "Số 8 tham vọng, thực dụng, giỏi quản trị và tạo giá trị vật chất. Đường đời gắn với sự nghiệp, tài chính, ảnh hưởng; cần tránh tham vọng mù quáng và đánh đổi đạo đức."
  },
  "9": {
    "keyword": "Nhân ái, hoàn thiện, phụng sự",
    "text": "Số 9 rộng lượng, giàu lòng trắc ẩn, mang tầm nhìn lớn. Đường đời hướng tới cống hiến, chữa lành, kết thúc chu kỳ để mở đường mới; cần tránh ôm đồm và kiệt sức vì người khác."
  },
  "11": {
    "keyword": "Trực giác, soi sáng, truyền cảm hứng",
    "text": "Master 11 nhạy cảm cao, có trực giác mạnh và sứ mệnh truyền cảm hứng. Đường đời là cầu nối giữa ý tưởng cao và đời sống thực; cần cân bằng cảm xúc, tránh lo âu và tự nghi."
  },
  "22": {
    "keyword": "Kiến tạo lớn, hiện thực hóa, di sản",
    "text": "Master 22 biến tầm nhìn thành công trình bền vững, mang ảnh hưởng tập thể. Đường đời là xây dựng hệ thống, tổ chức, di sản dài hạn; cần kiên trì và tránh áp lực “phải vĩ đại” làm tê liệt."
  },
  "33": {
    "keyword": "Chữa lành, yêu thương vô điều kiện, thầy cô",
    "text": "Master 33 là “bậc thầy chữa lành”, giàu lòng từ bi và khả năng dẫn dắt bằng tình thương. Đường đời gắn với giáo dục, chữa lành, phụng sự nhân loại; cần giữ ranh giới để không kiệt quệ vì gánh vác quá nhiều."
  }
};
export const LETTER_VAL = {"a":1,"b":2,"c":3,"d":4,"e":5,"f":6,"g":7,"h":8,"i":9,"j":1,"k":2,"l":3,"m":4,"n":5,"o":6,"p":7,"q":8,"r":9,"s":1,"t":2,"u":3,"v":4,"w":5,"x":6,"y":7,"z":8};
export function reduceNum(n) { while (n > 9 && n !== 11 && n !== 22 && n !== 33) { n = String(n).split('').reduce((a, d) => a + (+d), 0); } return n; }
function digitSum(x) { return String(x).split('').reduce((a, d) => a + (+d), 0); }
export function lifePathNumber(y, m, d) { return reduceNum(digitSum(y) + digitSum(m) + digitSum(d)); }
export function expressionNumber(name) {
  const s = String(name || '').toLowerCase().split('').filter(c => LETTER_VAL[c]).map(c => LETTER_VAL[c]).reduce((a, b) => a + b, 0);
  return reduceNum(s);
}
export function numerologyReading(y, m, d, name) {
  const lp = lifePathNumber(y, m, d); const r = LIFE_PATH[String(lp)];
  const exp = name ? expressionNumber(name) : null; const er = exp ? LIFE_PATH[String(exp)] : null;
  return {
    lifePath: lp, lifePathKeyword: r?.keyword || '', lifePathText: r?.text || '',
    expression: exp, expressionKeyword: er?.keyword || '', expressionText: er?.text || '',
    note: 'Life Path ' + lp + (lp > 9 ? ' (master number)' : '') + ' — đường đời chính theo thần số học Pythagoras.' + (exp ? ' Expression ' + exp + ' (từ tên) — tiềm năng bẩm sinh.' : ''),
  };
}
