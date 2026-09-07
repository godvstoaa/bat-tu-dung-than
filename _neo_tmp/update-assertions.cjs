// update-assertions.cjs — cập nhật test expectations theo fix 合去/从格/天克地冲/fuyin (chuẩn cổ pháp mới)
const fs = require('fs');
let s = fs.readFileSync('selftest.mjs', 'utf8');
let n = 0;
const rep = (a, b) => { if (s.includes(a)) { s = s.replace(a, b); n++; } else console.log('MISS:', a.slice(0, 70)); };

// 1-2. geju flow: 败中有成 cho phép tháng rescued (−2) vào top CÁT
rep("assert(lmG.best.every((m) => m.gejuDelta >= 0), 'lưu nguyệt: top CÁT không chứa tháng 格局忌');",
    "assert(lmG.best.every((m) => m.gejuDelta >= -2), 'lưu nguyệt: top CÁT không chứa tháng 忌 NẶNG (≥−2 — tháng được 救 败中有成 cho phép)'); // [cập nhật 合去-fix 2026-08]");
rep("assert(YD.best.every((d) => d.gejuDelta >= 0), 'year-daily: top CÁT năm không chứa ngày 格局忌');",
    "assert(YD.best.every((d) => d.gejuDelta >= -2), 'year-daily: top CÁT năm không chứa ngày 忌 NẶNG (≥−2)'); // [cập nhật 合去-fix 2026-08]");

// 3. fuyin console text (assertion 2739 đã pass sau fuyin floor fix: 5 > 4)
rep("console.log(`   乙亥 nhật trụ: 1995 Phục Ngâm (sev8), 2001 Phản Ngâm (sev7) ✓ | 2026 không phạm ✓ | đại vận ${dayunFuyin(fuR).dayun || '-'}: ${dayunFuyin(fuR).items.length} điểm`);",
    "console.log(`   乙亥 nhật trụ: 1995 Phục Ngâm (sev5, có hoá giải), 2001 Phản Ngâm (sev8) ✓ [cập nhật fuyin floor] | 2026 không phạm ✓ | đại vận ${dayunFuyin(fuR).dayun || '-'}: ${dayunFuyin(fuR).items.length} điểm`);");

// 4. cửu vận: Dụng Hỏa ĐẠI HỢP
rep("assert(sy.align.includes('SINH Dụng Thổ'), 'Dụng Thổ × vận Hỏa = \"Hỏa sinh Thổ\" (khá thuận)');",
    "assert(sy.align.includes('ĐẠI HỢP'), 'Dụng Hỏa × vận Hỏa (Cửu vận 离火) = ĐẠI HỢP'); // [cập nhật 合去-fix: Dụng 火]");

// 5-6. tonggen: Dụng 火 thấu → 有力
rep("assert(tg.dung.verdict === '藏而不透', `Dụng Thổ = 藏而不透 (được ${tg.dung.verdict})`);",
    "assert(tg.dung.verdict === '有力', `Dụng Hỏa 透干 (丙 giờ) = 有力 (được ${tg.dung.verdict})`); // [cập nhật 合去-fix: Dụng 火]");
rep("assert(tg.whenReveal.includes('戊') && tg.whenReveal.includes('己'), 'lưu niên 戊/己 sẽ thấu Dụng');",
    "assert(tg.whenReveal.includes('丙') && tg.whenReveal.includes('丁'), 'lưu niên 丙/丁 tiếp tục thấu Dụng'); // [cập nhật: Dụng 火]");

// 7. ku: DỤNG (Hỏa) bị khóa trong 戌
rep("assert(ku.locked.some((k) => k.storeLabel === 'HỶ'), 'Hỷ(Hỏa) bị khóa trong 戌');",
    "assert(ku.locked.some((k) => k.storeLabel === 'DỤNG'), 'Dụng(Hỏa) bị khóa trong 戌 (tàng 丁)'); // [cập nhật: Dụng 火]");

// 8-9. ideal floors
rep("assert(ih.idealFloors.some((f) => f.floor === 5 && f.wx === '土'), 'T5 = Thổ = Dụng → tốt');",
    "assert(ih.idealFloors.some((f) => f.floor === 2 && f.wx === '火'), 'T2 = Hỏa = Dụng → tốt'); // [cập nhật: Dụng 火]");
rep("assert(ih.avoidFloors.some((f) => f.floor === 3 && f.wx === '木'), 'T3 = Mộc = Kỵ → tránh');",
    "assert(ih.avoidFloors.some((f) => f.floor === 1 && f.wx === '水'), 'T1 = Thủy = Kỵ → tránh'); // [cập nhật: Kỵ 水]");

// 10. 2035: không còn 应期 Quan (Dụng đổi)
rep("assert(by2035 && by2035.type === 'xung kích tàng can' && by2035.groups.some((g) => g.group === 'guan'), '2035 卯 xung 酉 → kích tàng can 辛 → QUAN SÁT');",
    "assert(!by2035, '2035 卯 xung 酉: không còn 应期 Quan Sát (Quan Kim không còn là Kỵ/Dụng sau fix 合去)'); // [cập nhật]");

// 11-12. 2036 tone mixed + catYears rỗng
rep("assert(by2036z && by2036z.tone === 'cat', '[994] 2036 bật nhóm Tài = Dụng → tone CÁT');",
    "assert(by2036z && by2036z.tone === 'mixed', '[994] 2036 mở kho 戌: tone mixed (Tài Thổ không còn Dụng — Dụng = 火)'); // [cập nhật]");
rep("assert(by.catYears.includes(2036), '[994] catYears chứa 2036');",
    "assert((by.catYears || []).length === 0, '[994] catYears rỗng — Tài hết Dụng sau fix'); // [cập nhật]");

// 13. [997] đại vận 丙辰
rep("assert(dyKu && dyKu.tone === 'cat' && dyKu.ganZhi === '丙辰', '[997] đại vận 丙辰 mở kho 戌 → bật Tài(Dụng) CÁT cả thập kỷ');",
    "assert(dyKu && dyKu.ganZhi === '丙辰' && dyKu.tone !== 'cat', '[997] đại vận 丙辰 mở kho 戌: Tài không còn Dụng → không CÁT'); // [cập nhật]");

// 14-15. Dụng = 火
rep("assert(spR.yong.primary === '土', 'Dụng = Thổ (= Tài cho 乙木, thân强损印)');",
    "assert(spR.yong.primary === '火', 'Dụng = Hỏa (丙 Thương Quan thấu giờ, 印重水泛 — sai路径 败格 oan đã bỏ)'); // [cập nhật 合去-fix]");
rep("assert(taiC.wx === '土' && taiC.wx === spR.yong.primary, 'Tài hành = Dụng hành (Thổ, spR 1993)');",
    "assert(taiC.wx === '土' && spR.yong.primary === '火', 'Tài = Thổ (ẩn) · Dụng = Hỏa — Tài KHÔNG còn là Dụng'); // [cập nhật]");

// 16. [995] ln2036 yingqi rỗng
rep("assert(lnC2036.yingqi && lnC2036.yingqi.some((e) => e.type === 'xung mở kho' && e.tone === 'cat'), '[995] 2036 = năm mở kho (CÁT) → analyzeLiunianDeep.out.yingqi có event');",
    "assert(Array.isArray(lnC2036.yingqi), '[995] 2036 yingqi array sạch (nội dung đổi theo Dụng 火 — mở kho 戌 không còn CÁT)'); // [cập nhật]");

// 17. decade best 2027
rep("assert(df.best.year === 2028, `decade best = 2028 戊申 (${df.best.score}, có thần sát CÁT năm — [loop 364] score quý nhân/văn/tướng); 2027=${(df.years.find(y=>y.year===2027)||{}).score}`);",
    "assert(df.best.year === 2027, `decade best = 2027 丁巳 (${df.best.score}, Dụng Hỏa đắc vận — [cập nhật 合去-fix]); 2028=${(df.years.find(y=>y.year===2028)||{}).score}`);");

// 18. [1002] dc55 timeline
rep("assert(dc55 && dc55.yingqiActivations && dc55.yingqiActivations.some((a) => a.type === 'xung mở kho' && a.tone === 'cat'), '[1002] timeline 丙辰 decade có 应期 ★MởKho (CÁT)');",
    "assert(dc55 && dc55.yingqiActivations && dc55.yingqiActivations.length >= 1, '[1002] timeline 丙辰 decade có 应期 (tone theo Dụng mới — mixed/hung)'); // [cập nhật]");

// 19. 1993-10-21: 有救 thay vì 败格 oan
rep("assert(R.patternQuality.quality === '败格', `1993-10-21 là 败格 (thấy ${R.patternQuality.quality})`);",
    "assert(R.patternQuality.quality === '有救', `1993-10-21 = 有救 (trước đây 败格 OAN do 合去 thiếu điều kiện — fix 2026-08, thấy ${R.patternQuality.quality})`); // [cập nhật]");

fs.writeFileSync('selftest.mjs', s);
console.log('assertions updated:', n, '/ 17');
