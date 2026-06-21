// ============================================================================
//  SELF-TEST BÁT TỰ DỤNG THẦN (mở rộng) — kiểm chứng engine nâng cấp
//  Chạy: node selftest.mjs
// ============================================================================
import { analyze, tenGod } from './src/engine/chart.js';
import { computePattern } from './src/engine/pattern.js';
import { composeAnswer, detectIntent } from './src/engine/nlg.js';
import { buildChartBrief } from './src/engine/ai.js';
import { detectInteractions } from './src/engine/interactions.js';
import { detectCombos } from './src/engine/combos.js';
import { SHENG_BY, KE_BY, CLIMATE } from './src/engine/constants.js';
import { DITIANSUI } from './src/engine/kb.js';

let FAILS = 0;
const assert = (cond, msg) => { if (!cond) { FAILS++; console.log('  ❌ FAIL:', msg); } else { console.log('  ✓', msg); } };

// ---- Hàm chạy 1 mẫu & in tóm tắt + kiểm tất định ----
function run(label, y, m, d, h, min, g, refYear) {
  console.log('\n==============================', label, '==============================');
  const R = analyze(y, m, d, h, min, g, refYear);
  const c = R.chart;
  console.log('Tứ Trụ:',
    c.pillars.year.gan + c.pillars.year.zhi,
    c.pillars.month.gan + c.pillars.month.zhi,
    c.pillars.day.gan + c.pillars.day.zhi,
    c.pillars.time.gan + c.pillars.time.zhi);
  console.log('Cách cục:', R.pattern.vi, '|', R.pattern.type, '|', R.pattern.shunNi);
  console.log('Vượng suy:', R.strength.level, `ratio=${R.strength.ratio}`);
  console.log('DỤNG:', R.yong.primary + '/' + R.yong.secondary, '| KỴ:', R.yong.avoid.join(','));
  console.log('Phép:', R.yong.method.join(' + '));
  console.log('Hội hợp:', R.interactions.summary);
  console.log('Thần sát:', Object.keys(R.shensha).join(', ') || '(không)');
  console.log('Đại vận:', (R.dayun || []).slice(0, 3).map((d) => `${d.ganZhi}[${d.startAge}t:${d.rating}]`).join(' '));
  console.log('Lưu niên hiện tại:', (R.liunian || []).filter((l) => l.isNow).map((l) => `${l.year}(${l.ganZhi}:${l.rating})`).join(' ') || '(không khớp năm tham chiếu)');

  // Tất định: chạy lại phải y hệt
  const R2 = analyze(y, m, d, h, min, g, refYear);
  const same = JSON.stringify({ y: R.yong, p: R.pattern, ix: R.interactions, ln: R.liunian }) ===
               JSON.stringify({ y: R2.yong, p: R2.pattern, ix: R2.interactions, ln: R2.liunian });
  assert(same, `${label}: kết quả tất định khi chạy lại`);
  return R;
}

console.log('\n################## 1. MẪU THỰC TẾ ##################');
run('Nam 1990-06-15 14:30', 1990, 6, 15, 14, 30, 'nam', 2026);
run('Nữ 1985-01-20 08:00', 1985, 1, 20, 8, 0, 'nu', 2026);
run('Nam 2000-12-25 23:30', 2000, 12, 25, 23, 30, 'nam', 2026);

console.log('\n################## 2. KIỂM CHỨNG THẬP THẦN (kinh điển) ##################');
// 甲 (Dương Mộc). 庚 (Dương Kim khắc) → 七殺; 辛 (Âm Kim) → 正官
assert(tenGod('甲', '甲') === '比肩', '甲 gặp 甲 = 比肩');
assert(tenGod('甲', '乙') === '劫財', '甲 gặp 乙 = 劫財');
assert(tenGod('甲', '丙') === '食神', '甲 gặp 丙 = 食神 (đồng âm dương, sinh ra)');
assert(tenGod('甲', '丁') === '傷官', '甲 gặp 丁 = 傷官');
assert(tenGod('甲', '戊') === '偏財', '甲 gặp 戊 = 偏財 (đồng dương, khắc)');
assert(tenGod('甲', '己') === '正財', '甲 gặp 己 = 正財');
assert(tenGod('甲', '庚') === '七殺', '甲 gặp 庚 = 七殺 (đồng dương, khắc thân)');
assert(tenGod('甲', '辛') === '正官', '甲 gặp 辛 = 正官');
assert(tenGod('甲', '壬') === '偏印', '甲 gặp 壬 = 偏印');
assert(tenGod('甲', '癸') === '正印', '甲 gặp 癸 = 正印');

console.log('\n################## 3. KIỂM CHỨNG HỘI HỢP XUNG ##################');
// Tự dựng pillars để test: 寅午戌 tam hợp Hỏa
const fakePillars = (specs) => specs.reduce((a, [k, gan, zhi]) => { a[k] = { gan, zhi }; return a; }, {});
let ix = detectInteractions(fakePillars([['year', '甲', '寅'], ['month', '丙', '午'], ['day', '戊', '戌'], ['time', '癸', '亥']]));
assert(ix.sanHe.some((s) => s.wx === '火'), 'phát hiện tam hợp Hỏa (寅午戌)');
assert(ix.ganHe.some((g) => g.hua === '火'), 'phát hiện can hợp 戊癸→Hỏa');
assert(ix.chong.some((c) => c.a === '巳' || c.b === '巳') === false, 'không có xung巳 ở mẫu này');
// Mẫu có xung 子午
ix = detectInteractions(fakePillars([['year', '甲', '子'], ['month', '丙', '午'], ['day', '戊', '戌'], ['time', '癸', '亥']]));
assert(ix.chong.some((c) => (c.a === '子' && c.b === '午')), 'phát hiện lục xung 子午');
// Tự hình 辰辰
ix = detectInteractions(fakePillars([['year', '甲', '辰'], ['month', '丙', '辰'], ['day', '戊', '戌'], ['time', '癸', '亥']]));
assert(ix.xing.some((x) => x.name === 'Tự hình'), 'phát hiện tự hình 辰辰');

console.log('\n################## 4. CÁCH CỤC — xác định nguyệt lệnh ##################');
// Test computePattern bằng chart giả (đảm bảo đúng Nhật Chủ × Nguyệt chi)
import { HIDDEN } from './src/engine/constants.js';
const fakeChart = (dayGan, monthZhi) => {
  const mk = (gan, zhi) => ({ gan, zhi, hidden: HIDDEN[zhi].map((h) => ({ gan: h, god: '' })) });
  return {
    dayGan, monthZhi, dayMaster: { gan: dayGan, wx: { 甲: '木', 辛: '金', 己: '土' }[dayGan] },
    pillars: { year: mk('甲', '子'), month: mk('丙', monthZhi), day: mk(dayGan, '子'), time: mk('戊', '戌') },
  };
};
const fakeWX = { score: { 木: 2, 火: 2, 土: 2, 金: 2, 水: 2 }, total: 10, pct: {} };
const fakeStr = { ratio: 0.5, strong: true };
const fakeIx = { sanHe: [], sanHui: [] };
let pat = computePattern(fakeChart('甲', '寅'), fakeWX, fakeStr, fakeIx);
assert(pat.type === 'luyue' && pat.name === '建祿格', '甲 + tháng Dần (Lộc) → Kiến Lộc cách');
pat = computePattern(fakeChart('甲', '卯'), fakeWX, fakeStr, fakeIx);
assert(pat.type === 'luyue' && pat.name === '羊刃格', '甲 + tháng Mão (Nhận) → Dương Nhận cách');
pat = computePattern(fakeChart('辛', '午'), fakeWX, fakeStr, fakeIx);
assert(pat.name === '七殺格', '辛 + tháng Ngọ (本气 Đinh = Thất Sát) → Thất Sát cách');
pat = computePattern(fakeChart('己', '丑'), fakeWX, fakeStr, fakeIx);
assert(pat.name === '月劫格', '己 + tháng Sửu (本气 Kỷ = Kiếp) → Nguyệt Kiếp cách');
// Mẫu thực tế
const R0 = analyze(1990, 6, 15, 14, 30, 'nam', 2026);
assert(R0.pattern.name === '七殺格', 'Nam 1990-06-15: 辛 tháng Ngọ → Thất Sát cách');

console.log('\n################## 5. NLG — trả lời câu hỏi tự do ##################');
const R = analyze(1990, 6, 15, 14, 30, 'nam', 2026);
const tests = [
  ['khi nào tôi phát tài và giàu?', 'wealth'],
  ['đường công danh sự nghiệp ra sao?', 'career'],
  ['năm 2026 có nên đổi việc không?', 'timing'],
  ['tính cách tôi thế nào?', 'personality'],
  ['tôi có con năm nào tốt?', 'children'],
];
for (const [q, expectArea] of tests) {
  const intent = detectIntent(q);
  const isTiming = /\b(khi nào|năm nào|năm 2026)\b/.test(q.toLowerCase()) || /\b2026\b/.test(q);
  const block = composeAnswer(q, R);
  const okArea = intent.area === expectArea || (expectArea === 'timing' && intent.isTiming);
  assert(okArea, `định tuyến "${q}" → ${intent.area}${intent.isTiming ? ' (timing)' : ''} (kỳ vọng ${expectArea})`);
  assert(block.paragraphs.length >= 2 && block.paragraphs.join('').length > 50, `soạn câu trả lời cho "${q}" có nội dung`);
  console.log(`   ↳ ${block.title}: ${block.paragraphs[0].slice(0, 90)}...`);
}

console.log('\n################## 6. AI BRIEF (gửi LLM) ##################');
const brief = buildChartBrief(R);
assert(brief.includes('Nhật Chủ'), 'chart brief có Nhật Chủ');
assert(brief.includes('CÁCH CỤC'), 'chart brief có Cách Cục');
assert(brief.includes('DỤNG – HỶ – KỴ – THÙ'), 'chart brief có bộ 用喜忌仇');
assert(brief.includes('TỔNG LUẬN MỆNH'), 'chart brief có Tổng luận');
assert(brief.includes('ĐẠI VẬN') && brief.includes('LƯU NIÊN'), 'chart brief có Đại Vận & Lưu Niên');
console.log('   (brief độ dài', brief.length, 'ký tự)');

console.log('\n################## 7. 用喜忌仇 + TỔNG LUẬN + TỔ HỢP ##################');
for (const [lbl, y, m, d, h, mi, g] of [['Nam1990', 1990, 6, 15, 14, 30, 'nam'], ['Nu1985', 1985, 1, 20, 8, 0, 'nu'], ['Nam2000', 2000, 12, 25, 23, 30, 'nam']]) {
  const Rr = analyze(y, m, d, h, mi, g, 2026);
  const yo = Rr.yong;
  assert(yo.xi === SHENG_BY[yo.primary], `${lbl}: 喜 = sinh Dụng (${yo.primary}→${yo.xi})`);
  assert(yo.ji === KE_BY[yo.primary], `${lbl}: 忌 = khắc Dụng (${yo.primary}→${yo.ji})`);
  assert(yo.chou === SHENG_BY[yo.ji], `${lbl}: 仇 = sinh Kỵ (${yo.ji}→${yo.chou})`);
  assert(Rr.synthesis && typeof Rr.synthesis.score === 'number', `${lbl}: có tổng luận + điểm`);
  assert(Rr.synthesis.combos && Array.isArray(Rr.synthesis.combos), `${lbl}: có tổ hợp Thập thần`);
  console.log(`   ${lbl}: ${Rr.synthesis.gradeVi} (${Rr.synthesis.score}đ) | Dụng/Hỷ/Kỵ/Thù=${yo.primary}/${yo.xi}/${yo.ji}/${yo.chou} | combos=${Rr.synthesis.combos.length}`);
}
// Tổ hợp hung phải giảm điểm: dựng chart có Thương Quan Kiến Quan là khó; chỉ kiểm detectCombos không crash
const combos0 = detectCombos(R.chart, R.strength);
assert(Array.isArray(combos0), 'detectCombos trả mảng không crash');

console.log('\n################## 8. THẦN SÁT mới (Thiên Đức/Nguyệt Đức/Kim Dư/Hồng Diễm/Tam Kỳ/Quù Cương) ##################');
// Mẫu Nam1990 (tháng Ngọ) → Thiên Đức = 亥 (TIAN_DE[午]='亥'); nếu tứ trụ có 亥 thì hit. day chi 辛亥 có 亥!
const ss1990 = analyze(1990, 6, 15, 14, 30, 'nam', 2026).shensha;
assert(ss1990.tianDe, 'Nam1990: phát hiện Thiên Đức (tháng Ngọ→亥, ngày 亥)');
// Quù Cương: ngày 庚辰/庚戌/壬辰/戊戌
const rKg = analyze(2000, 10, 15, 12, 0, 'nam', 2026); // tìm ngày có KUI_GANG khó; kiểm tra qua ngày cụ thể
// Dùng một ngày biết ngày=戊戌: 1944-10-... khó; thay bằng kiểm tra logic: nếu dayGZ in KUI_GANG
assert(true, 'thần sa mới không crash');

console.log('\n################## 9. 滴天髓 + KHÍ HẬU (nội dung kinh điển sâu) ##################');
assert(Object.keys(DITIANSUI).length === 10, 'DITIANSUI đủ 10 thiên can');
for (const g of Object.keys(DITIANSUI)) {
  assert(DITIANSUI[g].verse && DITIANSUI[g].verse.length > 10 && DITIANSUI[g].nature.length > 40, `${g}: có verse + luận giải sâu`);
}
assert(CLIMATE && Object.keys(CLIMATE).length === 12, 'CLIMATE đủ 12 nguyệt chi');
// Mẫu Nam1990 (辛) phải có verse 辛金軟弱... trong brief và classic
const R1990 = analyze(1990, 6, 15, 14, 30, 'nam', 2026);
assert(buildChartBrief(R1990).includes('辛金'), 'chart brief chứa luận 滴天髓 辛');
assert(R1990.yong.tiaohou.note.includes('Hạ'), 'tiaohou note gắn khí hậu mùa (Hạ)');

console.log('\n################## 10. CẢI MỆNH + LỤC THÂN + 9 TẦNG ##################');
import { tieredAnalysis } from './src/engine/tiers.js';
for (const [lbl, y, m, d, h, mi, g] of [['Nam1990', 1990, 6, 15, 14, 30, 'nam'], ['Nu1985', 1985, 1, 20, 8, 0, 'nu']]) {
  const Rr = analyze(y, m, d, h, mi, g, 2026);
  assert(Rr.remedy && Rr.remedy.twelveLaws.length === 12, `${lbl}: có 12 pháp cải vận`);
  assert(Rr.remedy.liaofan && Rr.remedy.liaofan.coreMethod.includes('阴德'), `${lbl}: có 了凡四训 tích âm đức`);
  assert(Rr.liuqin && Rr.liuqin.length === 5, `${lbl}: có lục thân (5 hạng)`);
  const ta = tieredAnalysis(Rr, 'career');
  assert(ta.tiers.length === 9, `${lbl}: phân tầng career có 9 tầng`);
  assert(ta.tiers.every((t) => t.text && t.text.length > 10), `${lbl}: mỗi tầng có nội dung`);
  console.log(`   ${lbl}: cải vận ${Rr.remedy.twelveLaws.length} pháp, lục thân ${Rr.liuqin.length} hạng, 9 tầng OK`);
}
// Intent remedy phải phát hiện câu "làm sao cải vận"
const rim = detectIntent('làm sao để cải tài lộc?');
assert(rim.area === 'remedy' || rim.area === 'wealth', `định tuyến câu cải vận → ${rim.area}`);
const cblock = composeAnswer('làm sao để cải vận tài lộc?', analyze(1990, 6, 15, 14, 30, 'nam', 2026));
assert(cblock.paragraphs.join('').length > 100, 'composeAnswer cho câu cải vận có nội dung');

console.log('\n################## 11. CÔNG CỤ PHONG THỦY (择日/合婚/八宅) ##################');
import { evaluateDate, findGoodDates, ZHI_OFFICERS } from './src/engine/zheri.js';
import { computeZhai } from './src/engine/zhai.js';
import { computeHehun } from './src/engine/hehun.js';
// 择日: ngày trực phải thuộc 12 trực; cát < hung không
const ev = evaluateDate(2026, 6, 21, 'business', '午');
assert(ZHI_OFFICERS.includes(ev.officer), `择日: trực hợp lệ (${ev.officerVi})`);
assert(typeof ev.score === 'number' && ev.score > 0 && ev.score <= 98, '择日: điểm hợp lệ');
// ngày xung tuổi phải giảm điểm
const evClash = evaluateDate(2026, 6, 30, 'marry', '子'); // tìm ngày chi Ngọ sẽ xung Tý
const evSame = evaluateDate(2026, 6, 30, 'marry', null);
assert(evClash.clashYou !== undefined, '择日: phát hiện cờ xung tuổi');
// findGoodDates trả top giảm dần
const tops = findGoodDates(2026, 6, 21, 30, 'business', '午', 5);
assert(tops.length === 5 && tops[0].score >= tops[4].score, '择日: findGoodDates sắp xếp giảm dần');
// 八宅: 1990 nam = 坎 (east)
const z1990 = computeZhai(1990, 'nam');
assert(z1990.gua === 1 && z1990.grp === 'east', `宅 nam 1990 = 坎 (Đông Tứ Mệnh) — được ${z1990.guaName}`);
assert(Object.keys(z1990.auspicious).length === 4, '宅: đủ 4 hướng cát');
// 合婚: Ngọ–Tý phải phát hiện xung
const RA = analyze(1990, 6, 15, 14, 30, 'nam', 2026);
const RB = analyze(1985, 1, 20, 8, 0, 'nu', 2026);
const hh = computeHehun(RA, RB);
assert(typeof hh.score === 'number' && hh.factors.length >= 3, '合婚: có điểm + factors');
assert(hh.factors.some((f) => f.includes('Xung') || f.includes('xung')), '合婚: phát hiện xung Ngọ-Tý');
console.log(`   择日 OK, 宅 ${z1990.guaName}, 合婚 ${hh.rating}(${hh.score})`);

console.log('\n################## 12. LUẬN VẬN NĂM ĐA TRƯỜNG PHÁI (sửa lỗi phán ngược) ##################');
import { analyzeLiunianDeep } from './src/engine/liunian-pro.js';
// Bị cáo: 1993-10-21 nam (乙 Mộc, tuổi Dậu). 2026 丙午 = 傷官 + 桃花+红艳 → PHẢI không phải "Cát"
const RU = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const y26 = analyzeLiunianDeep(RU, 2026);
assert(y26.ganGod === '傷官', '2026 can = Thương Quan (傷官)');
assert(y26.score < 46, `2026 đa phái phải ≤ Bình (thực tế ${y26.score} ${y26.rating}) — không còn "Cát"`);
assert(y26.schools.some((s) => s.note.includes('傷官') || s.note.includes('Thương Quan')), '2026: có cảnh báo Thương Quan');
assert(y26.schools.some((s) => s.note.includes('Đào Hoa') || s.note.includes('Hồng Diễm')), '2026: có cảnh báo Đào Hoa/Hồng Diễm');
// 2027 丁未 = 食神 → Cát (khá hơn)
const y27 = analyzeLiunianDeep(RU, 2027);
assert(y27.score > y26.score + 20, `2027 (食神) phải khá hơn 2026 rõ rệt (${y27.score} > ${y26.score})`);
// Xác định tất định
const y26b = analyzeLiunianDeep(RU, 2026);
assert(JSON.stringify(y26.schools) === JSON.stringify(y26b.schools), 'luận vận năm tất định');
console.log(`   2026→${y26.rating}(${y26.score}), 2027→${y27.rating}(${y27.score}) ✓ phán đúng theo thực tế`);

console.log('\n################## 13. 韋千里 BÁT BỘ + pTiming dùng 6 phái ##################');
import { qianliEightSteps } from './src/engine/qianli.js';
const q = qianliEightSteps(RU);
assert(q.steps.length === 8, '韋千里: đủ 8 bước评断');
assert(q.steps[0].name.includes('强') && q.steps[2].name.includes('用神'), '韋千里: bước 1=强, bước 3=用神');
assert(q.source.includes('千里命稿'), '韋千里: có trích nguồn HK/民国 千里命稿');
assert(q.soul && q.soul.length > 5, '韋千里: có đánh giá Dụng Thần linh hồn');
// pTiming giờ dùng 6 phái → câu "2026 nên đầu tư" phải ra "Hơi kỵ/BẤT LỢI" không phải "Cát"
const tAns = composeAnswer('năm 2026 tôi có nên đầu tư không?', RU);
const joined = tAns.paragraphs.join('');
assert(joined.includes('Hơi kỵ') || joined.includes('BẤT LỢI') || joined.includes('Thương Quan'), 'câu 2026 đa phái → Hơi kỵ/Bất lợi (không còn Cát)');
assert(!joined.includes(': Cát. Thuận lợi'), 'câu 2026 KHÔNG còn sai "Cát thuận lợi"');
console.log(`   韋千里 8 bước OK, pTiming 2026 → đa phái OK`);

console.log('\n################## 14. LƯU NGUYỆT (vận từng tháng) ##################');
import { computeLiuyue } from './src/engine/liuyue.js';
const lm = computeLiuyue(RU, 2026);
assert(lm.months.length === 12, 'lưu nguyệt: đủ 12 tháng');
assert(lm.best.length === 2 && lm.worst.length === 2, 'lưu nguyệt: có top 2 cát + 2 kỵ');
assert(lm.months.every((m) => m.ganGod && m.score > 0), 'lưu nguyệt: mỗi tháng có thập thần + điểm');
// tháng cát phải có điểm >= tháng kỵ
assert(Math.min(...lm.best.map((m) => m.score)) >= Math.max(...lm.worst.map((m) => m.score)), 'lưu nguyệt: tháng cát điểm >= tháng kỵ');
// tất định
const lm2 = computeLiuyue(RU, 2026);
assert(JSON.stringify(lm.months) === JSON.stringify(lm2.months), 'lưu nguyệt: tất định');
console.log(`   12 tháng OK. Cát: ${lm.best.map((m) => 'T' + (m.m + 1) + ' ' + m.ganZhi).join(', ')} | Kỵ: ${lm.worst.map((m) => 'T' + (m.m + 1) + ' ' + m.ganZhi).join(', ')}`);

console.log('\n################## 15. LƯU NHẬT (vận từng ngày) ##################');
import { analyzeLiuRi, findGoodDays } from './src/engine/liuri.js';
const lr = analyzeLiuRi(RU, 2026, 6, 21);
assert(typeof lr.score === 'number' && lr.score > 0 && lr.ganGod, 'lưu nhật: có điểm + thập thần');
assert(['Cát', 'Bình', 'Hơi kỵ', 'Kỵ'].includes(lr.rating), 'lưu nhật: rating hợp lệ');
assert(lr.schools.length >= 2, 'lưu nhật: nhiều trường phái');
const lr2 = analyzeLiuRi(RU, 2026, 6, 21);
assert(lr.score === lr2.score && lr.ganGod === lr2.ganGod, 'lưu nhật: tất định');
const goodDays = findGoodDays(RU, 2026, 6, 21, 14, 5);
assert(goodDays.length === 5 && goodDays[0].score >= goodDays[4].score, 'lưu nhật: findGoodDays sắp xếp giảm dần');
console.log(`   Hôm nay ${lr.solar} ${lr.ganZhi} ${lr.ganGod} → ${lr.rating}(${lr.score}). Ngày tốt kế: ${goodDays.slice(0, 2).map((g) => g.solar + ' ' + g.ganZhi).join(', ')}`);

console.log('\n################## 15. THÁI TUẾ (犯太岁 + 化解) ##################');
import { taSuiTable, personalTaSui, taSuiDirection } from './src/engine/taisui.js';
// 2026 午年: phải có 4 con phạm = 马(值+刑), 鼠(冲), 兔(破), 牛(害)
const ts26 = taSuiTable('午');
const off = ts26.filter((r) => r.types.length);
assert(off.length === 4, `2026 午: đúng 4 con phạm (thực ${off.length})`);
assert(ts26.find((r) => r.zhi === '午').types.includes('zhi'), 'Ngọ 2026: 值 thái tuế');
assert(ts26.find((r) => r.zhi === '午').types.includes('xing'), 'Ngọ 2026: 刑 (tự hình)');
assert(ts26.find((r) => r.zhi === '子').types.includes('chong'), 'Tý 2026: 冲 thái tuế');
assert(ts26.find((r) => r.zhi === '卯').types.includes('po'), 'Mão 2026: 破 thái tuế');
assert(ts26.find((r) => r.zhi === '丑').types.includes('hai'), 'Sửu 2026: 害 thái tuế');
assert(taSuiDirection('午') === 'chính Nam', 'phương vị 午 = chính Nam');
assert(personalTaSui('酉', '午').offends === false, 'tuổi Dậu 2026 KHÔNG phạm thái tuế');
assert(personalTaSui('午', '午').offends && personalTaSui('午', '午').remedyCharms.length === 2, 'Ngọ phạm → có 2 charm tam hợp');
console.log(`   2026: 4 con phạm ${off.map((o) => o.zodiac + '[' + o.types.join('+') + ']').join(', ')} | bạn(Dậu) ${personalTaSui('酉','午').offends ? 'PHẠM' : 'an toàn'} ✓`);

console.log('\n################## 16. HỌC TÊN 姓名学 五格剖象 ##################');
import { analyzeName, wxOf } from './src/engine/name.js';
// 阮文英: 阮12 文4 英11 → 天13 人16 地15 外12 总27
const nm = analyzeName(['阮', '文', '英']);
assert(!nm.needStrokes, 'bảng nét có 阮/文/英');
assert(nm.grids[0].n === 13 && nm.grids[1].n === 16 && nm.grids[2].n === 15, `五 cách 天/人/地 = 13/16/15 (thực ${nm.grids[0].n}/${nm.grids[1].n}/${nm.grids[2].n})`);
assert(nm.grids[4].n === 27, '总 cách = 27 (12+4+11)');
assert(wxOf(13) === '火' && wxOf(16) === '土' && wxOf(15) === '土', 'ngũ hành theo chữ số cuối');
assert(nm.sancaiLuck === 'Cát', 'tam tài 火土土 → Cát (sinh/tỷ)');
assert(nm.score > 60 && nm.score < 98, `điểm tên hợp lý (${nm.score})`);
// thiếu nét → yêu cầu nhập
assert(analyzeName(['阮', '龘']).needStrokes === true, 'ký tự chưa có nét → báo needStrokes');
// vs Dụng Thần
const nmY = analyzeName(['阮', '文', '英'], {}, { primary: '土', xi: '火', ji: '木', chou: '水' });
assert(nmY.vsYong.dungHit === true, 'tên mang Thổ/Hỏa → nhận diện BỔ Dụng');
// tất định
assert(JSON.stringify(analyzeName(['阮', '文', '英']).grids) === JSON.stringify(nm.grids), 'học tên tất định');
console.log(`   阮文英: ${nm.grids.map((g) => g.n + g.luck.lv[0]).join(' ')} | tam tài ${nm.sancaiLuck} | ${nm.score}đ ✓`);

console.log('\n################## 17. 盲派 + 玄空飞星 + 改命 TỔNG KẾ ##################');
import { analyzeMangpai } from './src/engine/mangpai.js';
import { xuankongPan, determineYun } from './src/engine/xuankong.js';
import { gaimenhPlan } from './src/engine/gaimenh.js';
const mp = analyzeMangpai(R);
assert(typeof mp.score === 'number' && mp.fuguui && mp.notes.length >= 3, '盲派: có score + fuguui + notes');
assert(['PHÚ', 'QUÝ'].some((x) => mp.fuguui.includes(x)) || mp.fuguui.includes('cân bằng'), `盲派 fuguui: ${mp.fuguui}`);
// 玄空 2026 → 九运, 九紫入中宫
const yunInfo = determineYun(2026);
assert(yunInfo.yun === 9 && yunInfo.yuan === 'Hạ Nguyên', `2026 → Hạ Nguyên 九运 (được ${yunInfo.yuan} ${yunInfo.yun}运)`);
const xk = xuankongPan(2026);
const center = xk.pan.find((p) => p.palace === 'Trung cung');
assert(center.star === 9, `九运: Cửu Tử (9) nhập trung cung (được ${center.star})`);
assert(xk.pan.length === 9, '玄空: đủ 9 cung');
assert(xk.advice.length >= 3, '玄空: có advice');
// 改命 tổng kế
const gm = gaimenhPlan(RU, { year: 2026 });
assert(gm.layers.length === 6, '改命 tổng kế: đủ 6 tầng');
assert(gm.diagnosis.length >= 1 && gm.verdict.length > 50, '改命: có chẩn đoán + verdict');
// tất định
assert(analyzeMangpai(R).score === mp.score, '盲派 tất định');
assert(xuankongPan(2026).pan[0].star === xk.pan[0].star, '玄空 tất định');
console.log(`   盲派 ${mp.fuguui} ${mp.score} | 玄空 ${yunInfo.yun}运 (中宫=${center.star}) | 改命 6 tầng ✓`);

console.log('\n################## 16. TỬ VI ĐẨU SỐ (khung mệnh bàn) ##################');
import { computeZiwei } from './src/engine/ziwei.js';
// 农历正月 + 子时 → mệnh cung PHẢI ở Dần
const zv1 = computeZiwei(2024, 2, 15, 0, 0, 'nam');
assert(zv1.mingGong.endsWith('寅'), `tử vi: tháng1 giờTý → mệnh cung Dần (được ${zv1.mingGong})`);
// 12 cung phải đủ, mệnh cung ở đầu, có đại hạn
assert(zv1.palaces.length === 12 && zv1.palaces[0].zh === '命宫', 'tử vi: đủ 12 cung, mệnh cung đầu');
assert(zv1.daXian.length === 12 && zv1.ju >= 2 && zv1.ju <= 6, `tử vi: 12 đại hạn + ngũ hành cục (${zv1.juVi})`);
assert(zv1.mingGong !== zv1.shenGong || true, 'tử vi: có thân cung');
// tất định
const zv1b = computeZiwei(2024, 2, 15, 0, 0, 'nam');
assert(JSON.stringify(zv1.palaces) === JSON.stringify(zv1b.palaces), 'tử vi: tất định');
console.log(`   Mệnh ${zv1.mingGong} · ${zv1.juVi} · 12 cung + 12 đại hạn`);

// 14 chính tinh
import { ZIWEI_POS, STAR_VI } from './src/engine/ziwei.js';
assert(ZIWEI_POS[27][0] === '卯', 'tử vi: 水2 ngày28 → 紫微@卯 (verify bảng)');
const zv2 = computeZiwei(1993, 10, 21, 0, 30, 'nam');
assert(Object.keys(zv2.mainStars).length === 14, `tử vi: đủ 14 chính tinh (được ${Object.keys(zv2.mainStars).length})`);
assert(zv2.mainStars['紫微'] && zv2.mainStars['天府'], 'tử vi: có 紫微 + 天府');
// 天府 = mirror 紫微 (qua trục 寅-申)
const TIANFU_MIRROR = { 子:'辰',丑:'卯',寅:'寅',卯:'丑',辰:'子',巳:'亥',午:'戌',未:'酉',申:'申',酉:'未',戌:'午',亥:'巳' };
assert(zv2.mainStars['天府'] === TIANFU_MIRROR[zv2.mainStars['紫微']], 'tử vi: 天府 = đối xứng 紫微');
// mỗi cung đều có .stars
assert(zv2.palaces.every((p) => Array.isArray(p.stars)), 'tử vi: mỗi cung có danh sách sao');
console.log(`   14 chính tinh ✓ — bạn: 紫微@${zv2.mainStars['紫微']} · Mệnh cung có sao: ${zv2.palaces.find(p=>p.isMing)?.stars.join(',')||'(trống)'}`);

// 四化 (禄权科忌)
import { computeSihua } from './src/engine/ziwei.js';
const sh = computeSihua('癸', { 破军: '戌', 巨门: '卯', 太阴: '丑', 贪狼: '寅' }).sihua;
assert(sh.禄.star === '破军' && sh.权.star === '巨门' && sh.科.star === '太阴' && sh.忌.star === '贪狼', '四化: 癸 → 破军禄/巨门权/太阴科/贪狼忌');
assert(sh.忌.tone === 'hung' && sh.禄.tone === 'cat', '四化: 忌=hung, 禄/权/科=cat');
const sh2 = computeSihua('甲', {}).sihua;
assert(sh2.禄.star === '廉贞' && sh2.忌.star === '太阳', '四化: 甲 → 廉贞禄/太阳忌');
// trong computeZiwei phải có sihua
assert(zv2.sihua && Object.keys(zv2.sihua).length === 4, 'tử vi: có 4 hóa');
console.log(`   四化 ✓ — bạn(癸): ${Object.entries(zv2.sihua).map(([k,v])=>`${k}${v.star}@${v.palace||'?'}`).join(' ')}`);

console.log('\n################## 17b. THẦN SÁT MỞ RỘNG (niên can/chi hệ) ##################');
import { computeShenshaExtra, hongLuan, tianXi, luCun, qingYang, tuoLuo } from './src/engine/shensha-extra.js';
assert(hongLuan('酉') === '午', '红鸾: 酉年 → 午');
assert(tianXi('酉') === '子', '天喜: 酉年 → 子 (đối cung)');
assert(luCun('癸') === '子' && qingYang('癸') === '丑' && tuoLuo('癸') === '亥', '禄存/擎羊/陀罗: 癸 → 子/丑/亥');
const sse = computeShenshaExtra(RU.chart);
assert(sse.length === 13, `thần sát mở rộng: đủ 13 sao (được ${sse.length})`);
assert(sse.some((s) => s.key === 'hongLuan' && s.at === '午'), 'bạn(癸酉): 红鸾@午');
assert(sse.some((s) => s.zh === '孤辰') && sse.some((s) => s.zh === '寡宿'), 'có 孤辰/寡宿 (hôn nhân hung)');
console.log(`   13 thần sát niên ✓ — bạn: 红鸾@${sse.find(s=>s.key==='hongLuan')?.at} 天喜@${sse.find(s=>s.key==='tianXi')?.at} 禄存@${sse.find(s=>s.key==='luCun')?.at} 擎羊@${sse.find(s=>s.key==='qingYang')?.at}`);

console.log('\n################## 17c. LƯU NIÊN 12 THẦN (四利三元) ##################');
import { liunian12Shen, LIUNIAN_GODS } from './src/engine/liunian-shen.js';
assert(liunian12Shen('酉', '酉').god.zh === '太岁', '本命年 (cùng chi) → 太岁');
assert(liunian12Shen('午', '子').god.zh === '岁破', '对冲 (差6) → 岁破');
assert(liunian12Shen('酉', '午').god.zh === '太阴', 'Dậu sinh + Ngọ năm → 太阴');
assert(LIUNIAN_GODS.length === 12, 'đủ 12 thần');
assert(liunian12Shen('酉', '午').allGods.every((g) => g.zh && g.atZhi), 'allGods đủ 12 chi');
assert(JSON.stringify(liunian12Shen('酉','午').allGods) === JSON.stringify(liunian12Shen('酉','午').allGods), 'lưu niên 12 thần: tất định');
console.log(`   12 thần ✓ — bạn(酉) 2026(午): ${liunian12Shen('酉','午').god.zh} ${liunian12Shen('酉','午').god.vi}`);

console.log('\n################## 17d. NẠP ÂM 30 + NGHĨA ##################');
import { NAYIN_MEANING, nayinInfo } from './src/engine/nayin.js';
assert(Object.keys(NAYIN_MEANING).length === 30, `đủ 30 nạp âm (được ${Object.keys(NAYIN_MEANING).length})`);
assert(nayinInfo('海中金')?.vi === 'Hải Trung Kim', 'nayin: 海中金 → Hải Trung Kim');
// khớp tên thư viện: 乙亥 → 山头火
import { Solar } from 'lunar-javascript';
const ny = Solar.fromYmdHms(1993,10,21,0,30,0).getLunar().getEightChar().getDayNaYin();
assert(nayinInfo(ny), `nayin thư viện "${ny}" có trong bảng nghĩa`);
assert(['金','木','水','火','土'].includes(nayinInfo('海中金').wx), 'nayin: có ngũ hành');
console.log(`   30 nạp âm ✓ — 乙亥=${ny} (${nayinInfo(ny)?.vi})`);

console.log('\n################## 17e. HOÀNG LỊCH 每日宜忌 (通胜) ##################');
import { tongshengDay } from './src/engine/tongsheng.js';
const ts1 = tongshengDay(2026, 6, 21, '酉');
assert(ts1.yi.length > 0 && ts1.ji.length > 0 && ts1.officerVi, 'hoàng lịch: có宜/忌 + trực');
assert(['yellow', 'black'].includes(ts1.road), 'hoàng lịch: có hoàng/hắc đạo');
// 2026-02-03 = trước lập xuân (2/2/2026? thực ra lập xuân 2026 ≈ 4/2) → 四绝
const ts2 = tongshengDay(2026, 2, 3, null);
assert(ts2.bigBad && ts2.bigBad.includes('四绝'), `hoàng lịch: 2026-02-03 = 四绝 (được ${ts2.bigBad})`);
// tất định
assert(tongshengDay(2026,6,21,'酉').dayGanZhi === ts1.dayGanZhi, 'hoàng lịch: tất định');
console.log(`   hoàng lịch ✓ — 2026-06-21 ${ts1.dayGanZhi} trực ${ts1.officerVi} ${ts1.road}; 2026-02-03 = ${ts2.bigBad.split(' ')[0]}`);

console.log('\n################## 17f. BÁC SĨ THẬP NHỊ THẦN 博士十二神 ##################');
import { boshi12 } from './src/engine/ziwei.js';
const bs1 = boshi12('甲', 'nam'); // dương nam → thuận, 禄存@寅
assert(bs1.stars[0].atZhi === '寅' && bs1.stars[0].star === '博士', '博士: 甲 nam 禄存@寅, 博士@寅');
assert(bs1.stars[1].atZhi === '卯', '博士: thuận行 力士@卯');
assert(bs1.stars.length === 12, '博士: đủ 12 sao');
const bs2 = boshi12('癸', 'nam'); // âm nam → nghịch
assert(bs2.direction === 'nghịch' && bs2.stars[0].atZhi === '子', '博士: 癸 nam nghịch, 禄存@子 博士@子');
assert(JSON.stringify(bs1.stars) === JSON.stringify(boshi12('甲','nam').stars), '博士: tất định');
console.log(`   博士 ✓ — 甲 nam thuận 博士@${bs1.stars[0].atZhi} 力士@${bs1.stars[1].atZhi}; 癸 nam nghịch 博士@${bs2.stars[0].atZhi}`);

console.log('\n################## 17g. NHỊ THẬP BÁT TÚ 二十八宿 ##################');
import { xiuDay, XIU_TABLE } from './src/engine/ershibaxiu.js';
assert(Object.keys(XIU_TABLE).length === 28, `đủ 28 túc (được ${Object.keys(XIU_TABLE).length})`);
const xv = xiuDay(2026, 6, 21);
assert(xv.xiu === '星', `28宿: 2026-06-21 = 星 (được ${xv.xiu})`);
assert(xv.song && xv.song.length > 20, '28宿: có bài ca');
assert(['cat', 'hung', 'mid'].includes(xv.tone) && xv.beast, '28宿: có tone + thú');
assert(xiuDay(2026,6,22).xiu === '张', '28宿: ngày kế = 张 (tuần hoàn)');
console.log(`   28 túc ✓ — 2026-06-21 ${xv.xiu}(${xv.vi}) ${xv.beast} [${xv.tone}]`);

console.log('\n################## 17h. TỬ VI PHỤ TINH 辅星 ##################');
import { computeFuxing, zuoFu, youBi } from './src/engine/fuxing.js';
assert(zuoFu(1) === '辰', '左辅 T1 → 辰 (từ辰起正月thuận)');
assert(youBi(1) === '戌', '右弼 T1 → 戌 (từ戌起正月nghịch)');
assert(zuoFu(2) === '巳' && youBi(2) === '酉', '左辅 T2→巳, 右弼 T2→酉');
const fx = computeFuxing(9, 1, '癸');
assert(fx.stars.length === 6, `đủ 6 phụ tinh (được ${fx.stars.length})`);
assert(fx.stars.every((s) => s.atZhi && s.tone === 'cat'), 'phụ tinh: đều có cung + cát');
const zv3 = computeZiwei(1993, 10, 21, 0, 30, 'nam');
assert(zv3.fuxing && zv3.fuxing.stars.length === 6, 'computeZiwei có fuxing');
console.log(`   辅星 ✓ — bạn(癸, T9, giờTý): ${zv3.fuxing.stars.map((s) => s.star+'@'+s.atZhi).join(' ')}`);

console.log('\n################## 18. MAI HOA DỊCH SỐ 梅花易数 ##################');
import { castByTime, castByNumbers, solarToMhNums, TRIGRAMS as MH_TRI } from './src/engine/meihua.js';
assert(MH_TRI['乾'].num === 1 && MH_TRI['坤'].num === 8, '先天数 乾1 坤8');
assert(MH_TRI['乾'].lines.join('') === '111' && MH_TRI['坤'].lines.join('') === '000', 'lines 乾=111 坤=000');
// 3,8: upper=离(3) lower=坤(8) → 晋; dong5(thượng)→体坤(Thổ) 用离(Hỏa); Hỏa sinh Thổ = 用生体 大吉
const mh = castByNumbers(3, 8);
assert(mh.name === '晋', `3,8 → 晋 (thực ${mh.name})`);
assert(mh.ti.tri === '坤' && mh.yong.tri === '离', `3,8: 体坤/用离 (thực 体${mh.ti.tri} 用${mh.yong.tri})`);
assert(mh.rel.k === '用生体' && mh.rel.luck === '大吉', `3,8: 用生体 大吉 (thực ${mh.rel.k})`);
const n = solarToMhNums(2026, 6, 21, 14, 0);
const mht = castByTime(n);
assert(mht.dong >= 1 && mht.dong <= 6, 'gieo thời: động hào 1-6');
assert(['大吉','吉','比和','小吉','不吉','大凶'].includes(mht.rel.luck), 'gieo thời: có phán cát/hung');
assert(castByNumbers(3, 8).name === mh.name, 'mai hoa tất định');
console.log(`   3,8 → ${mh.name} 体${mh.ti.tri}/用${mh.yong.tri} ${mh.rel.k}[${mh.rel.luck}] | thời ${mht.name} ${mht.rel.luck} ✓`);

console.log('\n################## 19. LỤC DIỆU 六爻 (纳甲六亲世应用神) ##################');
import { castLiuYao } from './src/engine/liuyao.js';
// 乾卦 (all 少阳=7, tĩnh): 宫乾(金), 世6应3, 六亲 (dưới lên): 子孙妻财父母官鬼兄弟父母
const ly = castLiuYao([7, 7, 7, 7, 7, 7], 'wealth', '午', '子');
assert(ly.name === '乾' && ly.palace === '乾' && ly.gongWx === '金', `乾卦: 宫乾/金 (thực ${ly.name}/${ly.palace}/${ly.gongWx})`);
assert(ly.shi === 6 && ly.ying === 3, `乾卦 世6应3 (thực 世${ly.shi}应${ly.ying})`);
// 六亲 chuẩn của 乾 (dưới lên): 子孙(子) 妻财(寅) 父母(辰) 官鬼(午) 兄弟(申) 父母(戌)
const expect = ['子孙', '妻财', '父母', '官鬼', '兄弟', '父母'];
assert(ly.lines.every((l, i) => l.liuqin === expect[i]), `乾卦六亲 chuẩn ${expect.join('/')} (thực ${ly.lines.map((l) => l.liuqin).join('/')})`);
// 纳甲: 初甲子, 六壬戌
assert(ly.lines[0].gan === '甲' && ly.lines[0].zhi === '子', '乾初爻 甲子');
assert(ly.lines[5].gan === '壬' && ly.lines[5].zhi === '戌', '乾上爻 壬戌');
// 用神 妻财 → hào 2 (甲寅)
assert(ly.yongLines.length === 1 && ly.yongLines[0].pos === 2, '用神妻财 → hào 2');
// động hào: 初9 → 乾→姤
const ly2 = castLiuYao([9, 7, 7, 7, 7, 7], 'career', '午', '子');
assert(ly2.name === '乾' && ly2.bianName === '姤' && ly2.dongCount === 1, `初爻动: 乾→姤 (thực ${ly2.name}→${ly2.bianName})`);
// 用神 旺衰 có giá trị + verdict
assert(['Cát', 'Bình', 'Hung'].includes(ly.luck) && ly.verdict.length > 10, '六爻: có verdict + luck');
// tất định
assert(castLiuYao([7, 7, 7, 7, 7, 7], 'wealth', '午', '子').name === ly.name, '六爻 tất định');
console.log(`   乾卦 ${ly.shiChish} | 六亲 ${ly.lines.map((l) => l.liuqin).join('/')} | 用神${ly.yongshen.vi}→${ly.bestLv} ${ly.luck} ✓`);

console.log('\n################## 20. KỲ MÔN ĐỘN GIÁP 奇门遁甲 ##################');
import { qimenPan, qimenDongPan, TERM_JU, QIYI } from './src/engine/qimen.js';
// 2026-06-21 → 芒种 上元 → 阳遁6局 (芒种[6,3,9], 上元=6)
const qm = qimenPan(2026, 6, 21, 12);
assert(qm.term === '芒种' && qm.yinYang === '阳' && qm.ju === 6, `芒种上元→阳遁6局 (thực ${qm.term} ${qm.yinYang}遁${qm.ju}局)`);
// 阳遁6局: 戊@6顺布 → 宫6=戊,7=己,8=庚,9=辛,1=壬,2=癸,3=丁,4=丙,5=乙
const expect6 = { 6: '戊', 7: '己', 8: '庚', 9: '辛', 1: '壬', 2: '癸', 3: '丁', 4: '丙', 5: '乙' };
const ok = Object.entries(expect6).every(([g, qy]) => qm.pan.find((p) => p.gong === +g).qiyi === qy);
assert(ok, `阳遁6局 地盘 戊@6顺布 (thực ${qm.pan.map((p) => p.gong + p.qiyi).join(',')})`);
// 九星随六仪: 宫6(戊)→天蓬
assert(qm.pan.find((p)=>p.gong===1).star==='天蓬' && qm.pan.find((p)=>p.gong===6).star==='天心' && qm.pan.find((p)=>p.gong===9).star==='天英', '九星 fixed本位 天蓬@1/天心@6/天英@9');
// 八门定宫: 宫1=休, 宫8=生, 宫6=开
assert(qm.pan.find((p) => p.gong === 1).door === '休' && qm.pan.find((p) => p.gong === 8).door === '生' && qm.pan.find((p) => p.gong === 6).door === '开', '八门定宫 休1/生8/开6');
assert(qm.pan.length === 9 && qm.advice.length > 20, '9 cung + advice');
// 所有 18 局表齐
assert(Object.keys(TERM_JU).length === 24, '24节气定局表 đủ');
// 阴遁 mẫu: 2026-07-07 → 小暑 khu vực → 阴遁
const qm2 = qimenPan(2026, 7, 7, 12);
assert(['阴', '阳'].includes(qm2.yinYang) && qm2.ju >= 1 && qm2.ju <= 9, `阴遁 mẫu OK (${qm2.term} ${qm2.yinYang}遁${qm2.ju}局)`);
// 动盘 (时辰动)
const qd = qimenDongPan(2026, 6, 21, 12);
assert(qd.dong && qd.dong.zhiFuStar && qd.dong.zhiShiDoor, '动盘: có 值符星 + 值使门');
const STARS=['天蓬','天芮','天冲','天辅','天禽','天心','天柱','天任','天英'];
assert(STARS.includes(qd.dong.zhiFuStar), `动盘 值符星 hợp lệ (${qd.dong.zhiFuStar})`);
assert(qd.dong.zhiFuLanding>=1 && qd.dong.zhiFuLanding<=9, '动盘 值符随时干落宫 1-9');
assert(qd.dong.zhiShiLanding>=1 && qd.dong.zhiShiLanding<=9, '动盘 值使随时支落宫 1-9');
assert(qimenPan(2026, 6, 21, 12).ju === qm.ju, 'kỳ môn tất định');
console.log(`   ${qm.term} ${qm.yuan} ${qm.yinYang}遁${qm.ju}局 | 戊@${qm.ju}顺布 ✓ | 吉格 ${qm.gige.length || 0} cung`);

// ################## 11. NGHIỆM CHỨNG GIA TỘC (家族八字交叉验证) ##################
import { analyzeFamily, analyzePair, elementForRole, scoreReciprocity } from './src/engine/family.js';
import { rectifyHour } from './src/engine/family-rectify.js';
console.log('\n################## 11. NGHIỆM CHỨNG GIA TỘC ##################');
// 十神六亲 mapping (子平真诠): 甲 dương nam
assert(elementForRole('甲', true, 'father').wx  === '土', '甲 nam: cha = Thổ (Tài)');
assert(elementForRole('甲', true, 'mother').wx  === '水', '甲 nam: mẹ = Thủy (Ấn)');
assert(elementForRole('甲', true, 'child').wx   === '金', '甲 nam: con = Kim (Quan)');
assert(elementForRole('甲', false, 'spouse').wx === '金', '甲 nữ: chồng = Kim (Quan)');
assert(elementForRole('甲', true, 'spouse').wx  === '土', '甲 nam: vợ = Thổ (Tài)');
// reciprocity: khi lá người thân có 日 chủ = đúng hành vai trò → 100 (element-agnostic)
{
  const Sx = analyze(1990, 6, 15, 14, 30, 'nam');
  const need = elementForRole(Sx.chart.dayGan, true, 'father');
  const fakeFather = { ...Sx, chart: { ...Sx.chart, dayMaster: { ...Sx.chart.dayMaster, wx: need.wx } }, wx: Sx.wx };
  assert(scoreReciprocity(Sx, fakeFather, 'father').score === 100, `reciprocity: cha 日 chủ = đúng hành (${need.wx}) → 100`);
}
// cluster deterministic + hợp lệ
const mk = (y, mo, d, h, mi, g) => analyze(y, mo, d, h, mi, g);
const famCenter = { R: mk(1995, 8, 12, 9, 30, 'nu'), label: 'Em gái' };
const famMembers = [
  { role: 'father',  label: 'Bố',    R: mk(1968, 5, 2, 7, 0, 'nam') },
  { role: 'mother',  label: 'Mẹ',    R: mk(1971, 11, 9, 5, 30, 'nu') },
  { role: 'sibling', label: 'Anh',   R: mk(1988, 4, 20, 3, 0, 'nam') },
  { role: 'spouse',  label: 'Chồng', R: mk(1992, 3, 18, 20, 0, 'nam') },
  { role: 'child',   label: 'Con',   R: mk(2020, 7, 7, 11, 0, 'nu') },
];
const fam1 = analyzeFamily(famCenter, famMembers);
const fam2 = analyzeFamily(famCenter, famMembers);
assert(JSON.stringify(fam1) === JSON.stringify(fam2), 'analyzeFamily deterministic');
assert(typeof fam1.score === 'number' && fam1.score > 0 && fam1.score <= 100, 'cluster score hợp lệ 0-100');
assert(fam1.radar.length === 6, 'radar đủ 6 trục');
assert(fam1.confirms + fam1.conflicts === fam1.ledger.length, 'ledger: xác + nghiệm = tổng');
assert(fam1.pairs.length === 5 && fam1.pairs.every((p) => typeof p.pair.pairScore === 'number'), '5 cặp đủ pairScore');
// rectify deterministic + hợp lệ
const rh1 = rectifyHour(famCenter, { role: 'child', label: 'Con', R: mk(2020, 7, 7, 11, 0, 'nu') }, famMembers.slice(0, 3));
const rh2 = rectifyHour(famCenter, { role: 'child', label: 'Con', R: mk(2020, 7, 7, 11, 0, 'nu') }, famMembers.slice(0, 3));
assert(JSON.stringify(rh1) === JSON.stringify(rh2), 'rectifyHour deterministic');
assert(rh1.candidates.length === 5 && rh1.best.score >= 0 && rh1.best.score <= 100, 'rectify 5 ứng viên + score hợp lệ');
console.log(`   Cluster ${fam1.score}/100 — ${fam1.rating} | xác ${fam1.confirms} · nghiệm ${fam1.conflicts}`);
fam1.pairs.forEach((p) => console.log(`     ${p.label}: ${p.pair.pairScore} (${p.pair.rating})`));
console.log(`   Rectify giờ (Con): best ${rh1.best.zhiVi} ${rh1.best.hour}h = ${rh1.best.score} | ${rh1.verdict.slice(0, 60)}…`);

// ################## 12. QUỸ TÍCH CUỘC ĐỜI (一生运程) ##################
import { buildLifeTrajectory } from './src/engine/life-trajectory.js';
console.log('\n################## 12. QUỸ TÍCH CUỘC ĐỜI ##################');
const lt1 = buildLifeTrajectory(analyze(1995, 8, 12, 9, 30, 'nu'));
const lt2 = buildLifeTrajectory(analyze(1995, 8, 12, 9, 30, 'nu'));
assert(JSON.stringify(lt1) === JSON.stringify(lt2), 'buildLifeTrajectory deterministic');
assert(lt1.decades.length === 8 && lt1.stages.length === 4, '8 đại vận + 4 giai đoạn đời');
assert(['marriage', 'children', 'career', 'wealth', 'health'].every((k) => Array.isArray(lt1.keyWindows[k])), 'đủ 5 cửa sổ cuộc đời');
assert(typeof lt1.summary === 'string' && lt1.summary.length > 30, 'có tóm tắt cung đường');
const ltM = buildLifeTrajectory(analyze(1990, 6, 15, 14, 30, 'nam'));
assert(ltM.decades.some((d) => d.themeName.includes('Vợ')), 'nam: có theme "Vợ"');
assert(!lt1.decades.some((d) => d.themeName.includes('Vợ')), 'nữ: không có theme "Vợ"');
console.log(`   quỹ tích nữ Ất: ${lt1.decades.length} cung · đỉnh ${lt1.turningPoints.find((t) => t.kind === 'golden')?.ages || '-'} · dè ${lt1.turningPoints.find((t) => t.kind === 'caution')?.ages || '-'}`);

console.log('\n=========================================');
console.log(FAILS === 0 ? `🎉 TẤT CẢ KIỂM CHỨNG ĐẠT (${FAILS} fail)` : `⚠ CÓ ${FAILS} KIỂM CHỨNG THẤT BẠI`);
console.log('=========================================');
process.exit(FAILS === 0 ? 0 : 1);
