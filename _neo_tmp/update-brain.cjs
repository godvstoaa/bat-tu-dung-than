// update-brain.cjs — cập nhật não AI: rule 23 (chuẩn đo thống nhất + engine mới) vào SYSTEM_PROMPT
// + section CHUẨN ĐO vào BRAIN brief (buildChartBrief)
const fs = require('fs');
let s = fs.readFileSync('src/engine/ai.js', 'utf8');
let n = 0;

// 1. SYSTEM_PROMPT rule 23 — nối vào cuối rule 22 (trước backtick đóng)
const R22_END = "DAM BAO PHAN TICH, KHONG LAY LONG.`;";
const R23 = `DAM BAO PHAN TICH, KHONG LAY LONG.
23. CHUAN DO THONG NHAT + ENGINE MOI (audit 2026-08):
  (a) 1 SU VIEC = 1 THANG do: Đại cát → Cát → Bình hòa → Hơi nghịch → Hung → Đại hung. Khi trích nguồn khác thang: quẻ Dịch «trung» ≈ Bình hòa; tổ hợp «hung» ≈ Hung; tiers «CẦN HÓA GIẢI» ≈ Hơi nghịch→Hung; số 81 «trung» ≈ Bình hòa. KHÔNG gọi cùng 1 việc bằng 2 cấp mâu thuẫn.
  (b) 合去 vs 合绊: engine ĐÃ tính trong summary cách cục — 合去 (phá cách) CHỈ khi 緊貼 + 化神 đắc thế; còn lại 合绊 (giảm lực, cách VẪN thành). Đọc summary, ĐỪNG tự suy «hợp là phá».
  (c) 真从 vs 假从: cách Tòng có tag congGia + note trong brief nếu Nhật Chủ còn gốc — 假从 = theo thế CÓ ĐIỀU KIỆN, vận gặp gốc là biến động lớn. LUẬN LINH HOẠT, không cứng như 真从.
  (d) 盲派 宾主: 日为主 — chỉ trụ Ngày là 主 (Năm/Tháng = 宾; Giờ = 终局). Engine đã chuẩn hóa, KHÔNG diễn giải Ngày+Giờ cùng là 主.` + ';';
if (s.includes(R22_END)) { s = s.replace(R22_END, R23); n++; }
else console.log('MISS: R22 end');

// 2. BRAIN brief — thêm section CHUẨN ĐO ngay sau brainOut block
const BRAIN_MARK = "    if (brainOut) brief += `\\n--- NÃO (BRAIN GRAPH — kết luận determinist) ---\\n${brainOut}`;\n  } catch (_) { /* brain crash = skip, don't break brief */ }";
const BRAIN_ADD = BRAIN_MARK + `
  brief += \`\\n--- CHUẨN ĐO THỐNG NHẤT (grading scale + engine chuẩn 2026-08) ---\`;
  brief += \`\\n• Thang chuẩn 6 cấp: Đại cát / Cát / Bình hòa / Hơi nghịch / Hung / Đại hung. Quy đổi: quẻ «trung»≈Bình hòa · tổ hợp «hung»≈Hung · tiers «CẦN HÓA GIẢI»≈Hơi nghịch · số 81 «trung»≈Bình hòa. KHÔNG trộn thang khi luận.\`;
  brief += \`\\n• 合去/合绊: summary cách cục đã tính — 合去 chỉ khi 緊貼 + 化神 đắc thế (cách PHÁ); còn lại 合绊 (giảm lực, cách thành). Đọc, đừng suy lại.\`;
  brief += \`\\n• 真从/假从: nếu cách cục có tag 假从 (congGia) — theo thế CÓ ĐIỀU KIỆN, vận gặp gốc = biến động lớn.\`;
  brief += \`\\n• 盲派: 日为主 — trụ Ngày = 主; Năm/Tháng = 宾; Giờ = 终局.\`;`;
if (s.includes(BRAIN_MARK)) { s = s.replace(BRAIN_MARK, BRAIN_ADD); n++; }
else console.log('MISS: BRAIN mark');

fs.writeFileSync('src/engine/ai.js', s);
console.log('brain updated:', n, '/ 2');
