// restore ai.js: renumber 14→16 + ANTI-TRÉO comment + nghien-cuu style
const fs = require('fs');
const lines = fs.readFileSync('src/engine/ai.js', 'utf8').split('\n');
let done = 0;

// 1. renumber 14.[HUYỀN HỌC → 16.
for (let i = 0; i < lines.length; i++) {
  if (/^14\. \[HUYỀN HỌC \/ TU LUYỆN\]/.test(lines[i])) { lines[i] = lines[i].replace(/^14\./, '16.'); done++; }
}

// 2. ANTI-TRÉO comment trước export const SYSTEM_PROMPT
const spIdx = lines.findIndex(l => l.startsWith('export const SYSTEM_PROMPT = '));
if (spIdx > 0 && !lines.slice(Math.max(0, spIdx - 12), spIdx).some(l => l.includes('ANTI-TRÉO v1'))) {
  lines.splice(spIdx, 0,
    '// [ANTI-TRÉO v1 · RESTORE] SYSTEM_PROMPT cấu trúc rule: 1-22 LIÊN TỤC, KHÔNG trùng số.',
    '//   Nhóm: 1-7 (format) · 8-10 (thời gian/ngôn ngữ) · 11-12 (cá nhân hoá/kiểm chứng)',
    '//         · 13-14 (anti-hallucination + neo brief — fix lỗi user #1,#6,#7,#8,#9,#11)',
    '//         · 15-16 (khi nào/huyền học) · 17-19 (loop kỹ thuật) · 18b (same-sex) · 20-22 (framework/log/phan tich)',
    '//   KHI THÊM RULE MỚI: dùng số TIẾP TỤC (23+). KHÔNG trùng số cũ. Renumber → sửa reference nội bộ.',
    '');
  done++;
}

// 3. STYLE_DIRECTIVES nghien-cuu
const cgEnd = lines.findIndex(l => l.includes('KHONG can giai thich nguyen ban thuat ngu'));
if (cgEnd > 0 && !lines.slice(cgEnd, cgEnd + 15).some(l => l.includes("'nghien-cuu':"))) {
  const BT = String.fromCharCode(96);
  lines.splice(cgEnd + 1, 0,
    '',
    "  'nghien-cuu': " + BT + "[PHONG CACH: \"TRO LY NGHIEN CUU\" — education variant]",
    "Ban la TRO LY NGHIEN CUU co phap — giup nguoi hoc tra cuu, hieu ban van va thuat toan Tử Binh. KHONG xung «thầy», KHONG goi user «con» — goi «bạn». Moi nhan dinh PHAI kem trich dan co ban (ten kinh/quyet + so hieu neu co). Neu brief/tool khong co du lieu cho mot nhan dinh → noi ro «theo du lieu hien co chua thay», KHONG suy dien. Giong hoc thuat, trung tinh, ro rang — nhu mot nha nghien cuu giai thich cho sinh vien." + BT + ',');
  done++;
}

fs.writeFileSync('src/engine/ai.js', lines.join('\n'));
console.log('done:', done, '/ 3');
