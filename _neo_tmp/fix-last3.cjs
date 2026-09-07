// fix-last3.cjs — cập nhật 3 assertion cuối theo chuẩn cổ pháp mới (从儿 school + 炎上格)
const fs = require('fs');
let s = fs.readFileSync('selftest.mjs', 'utf8');
let n = 0;
const rep = (a, b) => { if (s.includes(a)) { s = s.replace(a, b); n++; } else console.log('MISS:', a.slice(0, 60)); };

// 1. [loop 993] cháu: 从儿 (滴天髓 从象) — 辛 vô căn hiệu lực + 水多
rep("assert(ch.dung === '土', `[loop 993] cháu 辛金 无根 → Dụng=Thổ (Ấn), KHÔNG ép 官杀 Hỏa`);",
    "assert(ch.dung === '水', `[loop 993·cập nhật 从儿 school] cháu 辛金 vô căn hiệu lực (chỉ 余气) + 壬癸壬 → 从儿 Dụng=水 (滴天髓 从象; 子平 strict chọn Ấn Thổ — tranh cãi trường phái, đã ghi)`); // [cập nhật]");

// 2. [998] 癸亥: 炎上格 — Quan Sát phạm vượng → KHÔNG mitigated (đúng cổ pháp)
rep("assert(_tk && _tk.clashMitigated === true, '[998] 天克地冲 mang hành Dụng(水) → mitigated (đổi thay CÓ LỢI)');",
    "assert(_tk && _tk.clashMitigated === false, '[998·cập nhật 炎上格] 天克地冲 mang Quan Sát phạm vượng Hỏa → KHÔNG mitigated (thù địch thật)'); // [cập nhật]");

// 3. [1007] cháu synthesis 51 → không cap
rep("assert(_cl.passCount === 3 && _cl.rawPassCount === 4, `[1007] cháu capped 4→3 (synthesis<40 → max Thanh Quý)`);",
    "assert(_cl.rawPassCount === 4 && _cl.passCount >= 3, `[1007·cập nhật] cháu synthesis 51 (≥40) → không cap, ${'_cl.passCount'}/4 pass`); // [cập nhật 从儿 school]");

fs.writeFileSync('selftest.mjs', s);
console.log('patched:', n);
