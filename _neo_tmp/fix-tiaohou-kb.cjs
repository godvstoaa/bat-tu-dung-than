// fix-tiaohou-kb.cjs — sửa 3 ô narrative QIONGTONG_TIAOHOU khớp bảng chuẩn constants.js
// + sửa lỗi nhánh 甲寅 "Giap-Than" → "Giap-Dan" (Giáp Dần) ở NAYIN_PERSONALITY
const fs = require('fs');
let s = fs.readFileSync('src/engine/kb.js', 'utf8');
let n = 0;

const fixes = [
  // 甲寅: chuẩn TIAOHOU['甲']['寅'] = ['丙','癸'] (丙主癸佐) — text cũ sai (Canh+Hỏa)
  ["'甲寅月': 'Mộc vượng mùa xuân → cần KIM cắt gọt hoặc HỎA tiết. Ưu tiên: Canh (庚) + Hỏa (丙).'",
   "'甲寅月': 'Mộc vượng mùa xuân, đắc lệnh → cần HỎA tiết tiết chế + THỦY nhuận. Ưu tiên: 丙-Hỏa chủ + 癸-Thủy佐 (bảng chuẩn 穷通宝鉴).'"],
  // 丁子: chuẩn ['甲','庚'] (甲尊庚佐) — text cũ sai (戊)
  ["'丁子月': 'Đinh gặp Tý mùa đông → \"丁火逢冬,大忌水多\" → cần 甲-Mộc + 戊-Thổ.'",
   "'丁子月': 'Đinh gặp Tý mùa đông → \"丁火逢冬,大忌水多\" → cần 甲-Mộc (Ấn sinh thân) + 庚-Kim (phá giáp dẫn 丁). Ưu tiên: 甲 chủ, 庚佐.'"],
  // 庚寅: chuẩn ['戊','甲','壬','丙'] — text cũ sai (đầu 丁, thiếu 戊/壬)
  ["'庚寅月': 'Dương Kim mùa xuân → cần 丁-Hỏa luyện + 甲-Mộc + 丙-Hỏa phối. \"庚金劈甲引丁\".'",
   "'庚寅月': 'Dương Kim tuyệt tại Dần mùa xuân → cần 戊-Thổ sinh thân, 甲-Mộc, 壬-Thủy rửa trừ hỏa, 丙-Hỏa ấm (bảng chuẩn: 戊甲壬丙).'"],
];
for (const [a, b] of fixes) {
  if (s.includes(a)) { s = s.replace(a, b); n++; } else console.log('MISS:', a.slice(0, 50));
}

// 甲寅 branch gloss (line ~2236): "Giap-Than" sai → Giáp Dần
const badGloss = `"甲寅": "Giap-Than = nhaps am 'Đai Khe Thuy'"`;
if (s.includes(badGloss)) {
  s = s.replace(badGloss, `"甲寅": "Giap-Dan (Giáp Dần) = nhaps am 'Đai Khe Thuy'"`);
  n++;
} else console.log('note: Giap-Than gloss pattern partial — checking');
if (s.includes('Giap-Than = nhaps am')) {
  s = s.replace('Giap-Than = nhaps am', 'Giap-Dan (Giáp Dần) = nhaps am');
  n++;
}

fs.writeFileSync('src/engine/kb.js', s);
console.log('fixed:', n);
