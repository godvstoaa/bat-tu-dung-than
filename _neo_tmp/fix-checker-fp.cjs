// fix-checker-fp.cjs — 3 FP-fixes còn lại cho neo-checker (yearWrong chặt + self-correction whitelist)
const fs = require('fs');
let s = fs.readFileSync('src/engine/neo-checker.js', 'utf8');
let n = 0;

// 1. regex chặt: chỉ flag khẳng định «năm nay =/là 2027»
const a1 = "    const respYearRefs = resp.match(/năm nay[^.]{0,30}?(\\d{4})/gi);";
if (s.includes(a1)) {
  s = s.replace(a1,
    "    // [FIX FP 2026-08] chỉ flag KHI KHẮNG ĐỊNH («năm nay = 2027»). Bỏ qua so sánh\n" +
    "    // («năm nay quen người, năm 2027 khớp») và self-correction («thầy tính nhầm...»)\n" +
    "    const respYearRefs = resp.match(/năm nay\\s*(?:[=là:]|\\()\\s*(\\d{4})/gi);");
  n++;
} else console.log('MISS 1');

// 2. self-correction whitelist (chèn trước === SCORE ===)
const a2 = "  // === SCORE ===";
if (s.includes(a2) && !s.includes('isSelfCorrection')) {
  s = s.replace(a2,
    "  // === SELF-CORRECTION WHITELIST ===\n" +
    "  // AI tự nhận lỗi («thầy tính nhầm»...) = cơ chế tự sửa ĐANG HOẠT ĐỘNG —\n" +
    "  // không flag self-correct làm conflict.\n" +
    "  const isSelfCorrection = /tính nhầm|thầy nhầm|nhận lỗi|thầy nói sai|thầy luận sai|đính chính/i.test(resp);\n\n" +
    "  // === SCORE ===");
  n++;
} else console.log('MISS 2 (or already)');

// 3. yearWrong bỏ qua khi self-correction
const a3 = "        if (yr && yr !== briefYear) conflicts.push({ type: 'yearWrong', said: 'năm nay = ' + yr, brief: 'năm nay = ' + briefYear, severity: 'high' });";
if (s.includes(a3)) {
  s = s.replace(a3, "        if (yr && yr !== briefYear && !isSelfCorrection) conflicts.push({ type: 'yearWrong', said: 'năm nay = ' + yr, brief: 'năm nay = ' + briefYear, severity: 'high' });");
  n++;
} else console.log('MISS 3');

fs.writeFileSync('src/engine/neo-checker.js', s);
console.log('applied:', n, '/ 3');
