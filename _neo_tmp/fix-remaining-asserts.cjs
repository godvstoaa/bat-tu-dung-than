// fix-remaining-asserts.cjs — 3 assertion còn lại cho 1998-5-15 12:00 (偏財格/有救/Dụng 水)
const fs = require('fs');
let s = fs.readFileSync('selftest.mjs', 'utf8');
let n = 0;
const rep = (a, b) => { if (s.includes(a)) { s = s.replace(a, b); n++; } else console.log('MISS:', a.slice(0, 70)); };

// L4316 — fixture đã đổi sang 1986-11-5 ( 從殺格) — assertion cập nhật khớp
rep("assert(_CR.pattern?.type === 'special' && _CR.patternQuality?.quality === '特殊', `[loop 777] 1998-5-15 = 從財格 special (got ${_CR.pattern?.type}/${_CR.patternQuality?.quality})`);",
    "assert(_CR.pattern?.type === 'special' && _CR.pattern.name === '從殺格', `[loop 777·cập nhật 司令分野] 1986-11-5 = 從殺格 special (got ${_CR.pattern?.type}/${_CR.pattern?.name})`);");

// L8248 — 1998-5-15 12:00: 偏財格 normal (庚印当令 bỏ 从)
rep("assert(_R.pattern?.type === 'special' && _R.pattern?.name === '從財格', `chart = 從財格 (được ${_R.pattern?.name})`);",
    "assert(_R.pattern?.type === 'normal' && _R.pattern.name === '偏財格', `[cập nhật 司令分野] 1998-5-15 = 偏財格 normal (được ${_R.pattern?.name}) — 印当令 bỏ 从`);");

// L8249 — Dụng 水 (比劫) thay 火
rep("assert(_R.yong.primary === '火', `[fix loop 116] 從財格 dmWx=水 → Dụng = 火/Tài (được ${_R.yong.primary}, trước fix = 水 SAI)`);",
    "assert(_R.yong.primary === '水', `[cập nhật] 偏財格 扶抑 → Dụng = 水/比劫 (được ${_R.yong.primary})`);");

fs.writeFileSync('selftest.mjs', s);
console.log('patched:', n);
