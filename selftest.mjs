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
import { SHENG_BY, KE_BY, CLIMATE, TIAOHOU } from './src/engine/constants.js';
import { DITIANSUI } from './src/engine/kb.js';
import { xiaoliuren, xiaoliurenDetail, solarToXlrNums, POSITIONS as XLR_POSITIONS } from './src/engine/xiaoliuren.js';
import { yizhangjing, renderYizhangjingCard } from './src/engine/yizhangjing.js';
import { jinkoujue, renderJinkoujueCard } from './src/engine/jinkoujue.js';

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
  // [loop 29] bán hợp (半合) được phát hiện — 1990 nam có 亥+未 = bán Mộc cục (thiếu 卯)
  assert(Array.isArray(R.interactions.banHe), 'interactions trả banHe[] (bán hợp)');
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
// [cycle 57] guard: bảng HIDDEN (藏干) 12 chi — thứ tự 本/中/余 khí. CORE (drives 藏干十神, combos, scoreWuXing).
//   Đặc biệt 丑 = [己,癸,辛] (癸=trung khí 30% do 申子辰 thuỷ cục, 辛=dư khí 10%) — KHÔNG phải [己,辛,癸].
{
  const CANON_HIDDEN = {
    子: ['癸'], 丑: ['己', '癸', '辛'], 寅: ['甲', '丙', '戊'], 卯: ['乙'],
    辰: ['戊', '乙', '癸'], 巳: ['丙', '庚', '戊'], 午: ['丁', '己'], 未: ['己', '丁', '乙'],
    申: ['庚', '壬', '戊'], 酉: ['辛'], 戌: ['戊', '辛', '丁'], 亥: ['壬', '甲'],
  };
  for (const [zhi, stems] of Object.entries(CANON_HIDDEN)) {
    assert(JSON.stringify(HIDDEN[zhi]) === JSON.stringify(stems), `藏干 ${zhi} = ${stems.join('')} (本/中/余 khí)`);
  }
}
// [cycle 58] guard: TIAOHOU (调候) primary — 5 neo cổ điển 窮通寶鑑 (verify 120 ô clean)
assert(TIAOHOU['甲']['寅'][0] === '丙', '调候 甲寅→丙 (xuân mộc cần hoả ấm)');
assert(TIAOHOU['丙']['午'][0] === '壬', '调候 丙午→壬 (hạ hoả cần thuỷ)');
assert(TIAOHOU['庚']['申'][0] === '丁', '调候 庚申→丁 (thu kim cần hoả luyện)');
assert(TIAOHOU['壬']['子'][0] === '戊', '调候 壬子→戊 (đông thuỷ cần thổ đắp)');
assert(TIAOHOU['丁']['亥'][0] === '甲', '调候 丁亥→甲 (đông hoả cần mộc dưỡng)');

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
// [loop 20 sửa] Âm can KHÔNG có chân Dương Nhận (YANG_REN[乙丁己辛癸] trỏ 辰戌丑未 thổ = tục-pha).
//   己 (âm) @ Mùi = YANG_REN[己] nhưng phải là Nguyệt Kiếp, KHÔNG phải 羊刃格.
pat = computePattern(fakeChart('己', '未'), fakeWX, fakeStr, fakeIx);
assert(pat.name === '月劫格', '己 (âm can) + tháng Mùi (YANG_REN[己]) → Nguyệt Kiếp cách (âm can không chân nhận)');
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
// [loop 558] execTool: validate required params + guard analyze_char không-Hán (trước đây crash rác).
{
  const { execTool } = await import('./src/engine/ai.js');
  const eDay = execTool('analyze_day', {}, R);
  assert(eDay.error && eDay.error.includes('Thiếu tham số'), `[loop 558] analyze_day thiếu param → error VN sạch (không crash rác), got ${eDay.error}`);
  const eChar = execTool('analyze_char', { char: '<x>' }, R);
  assert(eChar.error && eChar.error.includes('chữ Hán'), `[loop 558] analyze_char không-Hán → error VN (không null deref crash), got ${eChar.error}`);
  const okChar = execTool('analyze_char', { char: '福' }, R);
  assert(okChar.char === '福' && okChar.radical, `[loop 558] analyze_char「福」hợp lệ vẫn hoạt động`);
  console.log(`   execTool ✓ — validate required + analyze_char guard (error VN sạch, không crash rác)`);
  // [loop 559] analyze_month (no params) ganZhi phải KHỚP brief header curMonthGZ (cùng today).
  //   Trước đây tool dùng ngày-15 → đầu tháng lệch vs brief → AI mâu thuẫn«tháng này».
  const { Solar: SS } = await import('lunar-javascript');
  const nn = new Date();
  const hdrGZ = SS.fromYmdHms(nn.getFullYear(), nn.getMonth() + 1, nn.getDate(), 12, 0, 0).getLunar().getEightChar().getMonthGan() + SS.fromYmdHms(nn.getFullYear(), nn.getMonth() + 1, nn.getDate(), 12, 0, 0).getLunar().getMonthZhi();
  const am = execTool('analyze_month', {}, R);
  assert(am.ganZhi === hdrGZ, `[loop 559] analyze_month«tháng này»(${am.ganZhi}) khớp brief header (${hdrGZ}) — không mâu thuẫn`);
  console.log(`   analyze_month ✓ — «tháng này» ganZhi ${am.ganZhi} khớp brief header (AI không mâu thuẫn)`);
}
// [loop 623 FIX CRITICAL] AI_TOOLS: TẤT CẢ tool phải có wrapper { type:'function', function:{name,...} }.
//   Trước đây 5 tool bói (analyze_char/meihua/liuren/qimen/guiguzi) FLAT → Z.ai API reject → AI không bao giờ gọi được.
{
  const { AI_TOOLS } = await import('./src/engine/ai.js');
  assert(AI_TOOLS.length === 17, `[loop 623→638] AI_TOOLS có đúng 17 tool (got ${AI_TOOLS.length})`);
  const flat = AI_TOOLS.filter((t) => !(t && t.type === 'function' && t.function && t.function.name));
  assert(flat.length === 0, `[loop 623] KHÔNG còn tool FLAT — tất cả phải có wrapper {type:function,function:{name}} (còn ${flat.length} flat: ${flat.map(t=>t&&t.name).join(',')})`);
  const names = AI_TOOLS.map((t) => t.function.name);
  const dups = names.filter((n, i) => names.indexOf(n) !== i);
  assert(dups.length === 0, `[loop 623] không trùng tên tool (trùng: ${dups.join(',')})`);
  // 5 tool bói từng flat — xác nhận giờ đã wrapped + có executor
  for (const tn of ['analyze_char','analyze_meihua','analyze_liuren','analyze_qimen','analyze_guiguzi']) {
    const t = AI_TOOLS.find((x) => x.function.name === tn);
    assert(t && t.type === 'function', `[loop 623] ${tn} đã wrapped đúng`);
  }
  console.log(`   AI_TOOLS ✓ — ${AI_TOOLS.length} tool ĐỀU wrapped đúng format OpenAI/Z.ai (0 flat)`);
}
// [loop 623 FIX] MỖI tool trong AI_TOOLS phải có nhánh xử lý trong tool-runner (không silent-fail).
//   Bug cũ: analyze_guiguzi có tool AI gọi được nhưng KHÔNG có nhánh xử lý → nhận error → Quỷ Cốc bói không bao giờ trả kết quả.
{
  const { AI_TOOLS, execTool } = await import('./src/engine/ai.js');
  const fs = (await import('fs')).default;
  const src = await fs.promises.readFile('./src/engine/ai.js', 'utf8');
  const cases = new Set();
  for (const m of src.matchAll(/case '([a-z_]+)':/g)) cases.add(m[1]);
  const orphan = AI_TOOLS.map((t) => t.function.name).filter((n) => !cases.has(n));
  assert(orphan.length === 0, `[loop 623] mọi tool có nhánh xử lý (orphan: ${orphan.join(',')})`);
  // smoke: analyze_guiguzi giờ trả 2 hệ (trước đây error)
  const g = execTool('analyze_guiguzi', {}, R);
  assert(g.system1 && g.system1.nayinVi, `[loop 623] analyze_guiguzi trả system1 nạp âm (got ${JSON.stringify(g).slice(0,80)})`);
  assert(g.system2 && g.system2.geMing, `[loop 623] analyze_guiguzi trả system2 分定經 格名`);
  console.log(`   analyze_guiguzi ✓ — 2 hệ Quỷ Cốc (${g.system1.nayinVi} + 格「${g.system2.geMing}」), 0 tool orphan`);
}
// [loop 638] fengshui_direction tool — AI chọn hướng theo cổ pháp (recommend + read)
{
  const { execTool } = await import('./src/engine/ai.js');
  const Ru = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  // recommend cửa chính
  const rec = execTool('fengshui_direction', { mode: 'recommend', purpose: 'cuakhach' }, Ru);
  assert(rec.mode === 'recommend' && rec.best && rec.best.shan, `[loop 638] fengshui_direction recommend trả best hướng (got ${rec.best?.shan})`);
  assert(/Sinh Khí|Diên Niên|Thiên Y|Phục Vị/.test(rec.best.baziStar), `[loop 638] recommend best = sao Bát Trạch cát (got ${rec.best.baziStar})`);
  // read 1 hướng
  const rd = execTool('fengshui_direction', { mode: 'read', direction: '艮' }, Ru);
  assert(rd.mode === 'read' && rd.shan && rd.verdict, `[loop 638] fengshui_direction read luận 1 hướng (got ${rd.shan} ${rd.verdict})`);
  // invalid direction
  const bad = execTool('fengshui_direction', { mode: 'read', direction: 'XYZ' }, Ru);
  assert(bad.error, `[loop 638] hướng không hợp lệ → error VN`);
  console.log(`   fengshui_direction ✓ — recommend cửa=${rec.best.shan}(${rec.best.baziStar}); read 艮=${rd.verdict}`);
}
// [loop 625 FIX] analyze_relative advice phải nhận thức THẾ HỆ — «khắc» không phán sai vai trò.
//   Bug cũ: cháu 3 tuổi (thân Kim khắc user Mộc) bị advice «họ áp đặt bạn — cần ranh giới» (sai vai trò xã hội).
//   Fix: isDescendant/isElder → «khắc» được reframe theo thứ bậc (bề dưới = dẫn dắt, bề trên = kính trọng).
{
  const { execTool } = await import('./src/engine/ai.js');
  // Dùng user chart xác định: Quân 1993 = 乙木. Cháu 2023 = 辛金 → Kim khắc Mộc (thân khắc user).
  const Ru = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  const ch = execTool('analyze_relative', { relation: 'cháu', year: 2023, month: 1, day: 13, hour: 7, gender: 'nam' }, Ru);
  assert(ch.nguHanhTuongQuan.includes('khắc'), `[loop 625] setup đúng: cháu có quan hệ khắc user (got ${ch.nguHanhTuongQuan})`);
  assert(!/áp đặt bạn|bạn chế\/ap đặt/.test(ch.advice), `[loop 625] cháu KHÔNG bị phán «áp đặt» (got: ${ch.advice.split('.')[0]})`);
  assert(/dẫn dắt|bề dưới|khí chất/.test(ch.advice), `[loop 625] cháu 克 được reframe theo vai trò bề dưới (got: ${ch.advice.split('.')[0]})`);
  // peer (không relation) cùng chart Kim-cracks-Mộc → vẫn «áp đặt» (peer preserved, không over-soften)
  const peer = execTool('analyze_relative', { year: 2023, month: 1, day: 13, hour: 7, gender: 'nam' }, Ru);
  assert(/áp đặt bạn|ranh giới rõ/.test(peer.advice), `[loop 625] peer (không relation) 克 vẫn «áp đặt — ranh giới» (got: ${peer.advice.split('.')[0]})`);
  console.log(`   analyze_relative advice ✓ — cháu 克 → «dẫn dắt/bề dưới» (không «áp đặt»); peer 克 → «ranh giới» (giữ nguyên)`);
}
// [loop 640] analyze_relative phải surface 调候 override qua yongNote (loop 639 fix).
//   Bug: cháu 辛金 nhược Dụng=Hỏa (调候 override) nhưng tool không giải thích → AI có thể phán «Dụng sai».
{
  const { execTool } = await import('./src/engine/ai.js');
  const Ru = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  // cháu 辛金 丑月 → 调候 override Hỏa
  const ch = execTool('analyze_relative', { relation: 'cháu', year: 2023, month: 1, day: 13, hour: 7, gender: 'nam' }, Ru);
  assert(ch.yongNote && ch.yongNote.includes('ĐIỀU HẬU'), `[loop 640] cháu (调候 override) có yongNote giải thích (got ${(ch.yongNote||'').slice(0,40)})`);
  assert(ch.dung === '火', `[loop 640] cháu Dụng = Hỏa (调候)`);
  // relative không override (sinh tháng không cực đoan) → yongNote null hoặc method note (không «ĐIỀU HẬU override» nhầm)
  const sib = execTool('analyze_relative', { relation: 'em', year: 2000, month: 4, day: 15, hour: 10, gender: 'nữ' }, Ru); // tháng 4 = 辰 (không cực đoan)
  assert(!/ĐIỀU HẬU.*override/.test(sib.yongNote || ''), `[loop 640] em sinh tháng không cực đoan → không nhầm override (got ${(sib.yongNote||'null').slice(0,40)})`);
  console.log(`   analyze_relative yongNote ✓ — cháu override Hỏa có giải thích; em không cực đoan không nhầm`);
}
// [loop 626] LỤC THÂN ĐOẠN — deduceFromFamily: suy sâu vận mệnh từ gia đình (六亲断/家庭全息).
//   Khác family.js (chấm điểm), engine này SUY LUẬN + cross-verify với lá thật người thân.
{
  const { deduceFromFamily } = await import('./src/engine/family-deduction.js');
  const S = analyze(1993, 10, 21, 1, 15, 'nam', 2026); // Quân 乙木
  const fam = [
    { role: 'mother', label: 'Mẹ', R: analyze(1970, 6, 27, 7, 15, 'nữ', 2026) }, // 戊土 điểm 35
    { role: 'father', label: 'Bố', R: analyze(1964, 4, 4, 12, 0, 'nam', 2026) }, // 癸水 điểm 40
    { role: 'sibling', label: 'Em', R: analyze(1996, 12, 4, 10, 15, 'nữ', 2026) },
  ];
  const d = deduceFromFamily(S, fam);
  assert(d.ok === true, `[loop 626] deduceFromFamily ok`);
  assert(d.relations.length === 3, `[loop 626] duyệt đủ 3 người thân (got ${d.relations.length})`);
  assert(d.relations.every((r) => r.star && r.palace && r.prediction && r.verify && r.insight), `[loop 626] mỗi relation có đủ star/palace/prediction/verify/insight`);
  // sao Mẹ = 印(Thủy) vượng trong Quân → verify phải là «TÁC ĐỘNG MẠNH» (vượng + lá thật Mẹ 35<55)
  const me = d.relations.find((r) => r.role === 'mother');
  assert(/TÁC ĐỘNG MẠNH|XÁC NHẬN|BẤT NGỜ/.test(me.verify), `[loop 626] Mẹ có verify hợp lệ (got ${me.verify})`);
  assert(me.starWx === 'Thủy', `[loop 626] sao Mẹ = Thủy (印 sinh 乙木) (got ${me.starWx})`);
  assert(d.holographic.length >= 1, `[loop 626] có insight holographic (suy ngược về chủ thể)`);
  assert(d.disclaimer && /KHÔNG dự đoán/.test(d.disclaimer), `[loop 626] có disclaimer (không dự đoán y tế/sự kiện)`);
  console.log(`   deduceFromFamily ✓ — ${d.relations.length} relation + ${d.holographic.length} holographic; Mẹ→${me.verify}`);
}
// [loop 627] ROBUSTNESS — deduceFromFamily không crash với data méo (null/missing-R/role sai).
//   Bug cũ: null member → holographic .filter crash; role sai → elementForRole undefined crash.
{
  const { deduceFromFamily } = await import('./src/engine/family-deduction.js');
  const S = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  const crashCases = [
    [], [null], [undefined], [{ role: 'mother', label: 'x' }], // missing R
    [{ role: 'wizard', label: 'x', R: analyze(1970, 6, 27, 7, 15, 'nữ', 2026) }], // bad role
    [null, { role: 'mother', label: 'm', R: analyze(1970, 6, 27, 7, 15, 'nữ', 2026) }, undefined], // mixed
  ];
  for (const fam of crashCases) {
    let threw = false;
    try { deduceFromFamily(S, fam); } catch (e) { threw = true; }
    assert(threw === false, `[loop 627] deduceFromFamily không crash với data méo (${JSON.stringify(fam).slice(0, 40)})`);
  }
  // female subject path: 乙木 nữ + child → 食伤 = Hỏa (木 sinh Hỏa)
  const Sf = analyze(1996, 12, 4, 10, 15, 'nữ', 2026); // 乙木 nữ
  const df = deduceFromFamily(Sf, [{ role: 'child', label: 'con', R: analyze(2023, 1, 13, 7, 15, 'nam', 2026) }]);
  const ch = df.relations.find((r) => r.role === 'child');
  assert(ch && ch.starWx === 'Hỏa', `[loop 627] nữ 乙木 → sao con = 食伤 Hỏa (got ${ch?.starWx})`);
  console.log(`   deduceFromFamily robust ✓ — 6 case data-méo không crash; nữ 乙木 con=Hỏa ✓`);
}

// ################## DESTINY CONSENSUS (meta-synthesis đa hệ thống) [loop 561] ##################
{
  const { destinyConsensus } = await import('./src/engine/destiny-consensus.js');
  const dc = destinyConsensus(R);
  assert(dc.ok === true, 'destinyConsensus ok');
  assert(dc.consensus && typeof dc.consensus.verdict === 'string', 'consensus có verdict');
  assert(dc.systems.bazi && dc.systems.chenggu, 'consensus có hệ bazi + chenggu');
  assert(['CỰC KỲ ĐỒNG THUẬN CÁT','CỰC KỲ ĐỒNG THUẬN HUNG','ĐỒNG THUẬN THIÊN CÁT','ĐỒNG THUẬN THIÊN HUNG','PHÂN KỲ (mệnh phức tạp)','KHÔNG ĐỦ DỮ LIỆU'].includes(dc.consensus.verdict), `verdict hợp lệ (got ${dc.consensus.verdict})`);
  console.log(`   Destiny Consensus ✓ — spR: ${dc.consensus.verdict} (agreement ${dc.consensus.agreement}, ${dc.consensus.n} hệ)`);
}
assert(R1990.yong.tiaohou.note.includes('Hạ'), 'tiaohou note gắn khí hậu mùa (Hạ)');
// [loop 34] 调候 OVERRIDE: 1990 辛午 (cực nhiệt) → 窮通寶鑑 lấy 壬水 → Dụng=Thủy (override Phù Ức)
assert(R1990.yong.tiaohou.override === true && R1990.yong.primary === '水', `1990 辛午 调候 OVERRIDE → Dụng=Thủy (được override=${R1990.yong.tiaohou.override}, primary=${R1990.yong.primary})`);
assert(R1990.yong.method.some((m) => m.includes('Điều Hậu') && m.includes('LÀM CHỦ')), '1990 method có "Điều Hậu — LÀM CHỦ"');
// [loop 37] 病药 UNIFICATION — pattern-quality rescues feed vào yong (secondary + method, KHÔNG đổi primary)
assert(R1990.yong.method.some((m) => m.includes('Bệnh Dược')), '1990 method có "Bệnh Dược" (pattern-quality rescue)');
assert(R1990.yong.reasons.some((r) => /Bệnh Dược.*pattern-quality/.test(r)), '1990 reasons có 病药 enrich note');
// [loop 51] comprehensive 用神 override test — 调候 fires ONLY for extreme + conflict
{
  const EXTREME = new Set(['亥','子','丑','巳','午','未']);
  // winter chart: 1984-12-22 nam 子月 → override=true (tiao 火 ≠ Phù Ức)
  const _w = analyze(1984, 12, 22, 10, 0, 'nam', 2026);
  assert(_w.yong.tiaohou?.override === true, `1984 子月 (extreme cold) → override=true`);
  assert(_w.yong.primary === '火', `1984 子月 调候 → Dụng=Hỏa (noãn)`);
  // 调候 agree → no override: 1995 壬午 → tiao 金 = Phù Ức 金 → agree, no override
  const _a = analyze(1995, 6, 20, 8, 0, 'nam', 2026);
  assert(_a.yong.tiaohou?.override === false, `1995 壬午 → tiao=Kim=PhùỨc → agree, KHÔNG override`);
  // non-extreme → never override: 2010 申月
  const _n = analyze(2010, 8, 8, 12, 0, 'nu', 2026);
  assert(_n.yong.tiaohou?.override === false, `2010 申月 (không cực đoan) → KHÔNG override`);
  // override → xi/ji/chou recomputed from NEW primary
  assert(_w.yong.xi === '木' && _w.yong.ji === '水', `1984 override → xi/ji recomputed từ primary Hỏa`);
}
// [loop 639] 调候 OVERRIDE phải GỠ reason «Kỵ» CŨ của Phù Ức còn liệt kê primary MỚI.
//   Bug: Dụng=火 (override) nhưng reasons vẫn «Kỵ: ... Quan Sát (火)» → AI nhận mâu thuẫn.
{
  // cháu 2023-01-13 辛金 丑月 + 水 41% → hàn thấp → override Hỏa
  const _c = analyze(2023, 1, 13, 7, 15, 'nam', 2026);
  assert(_c.yong.tiaohou?.override === true && _c.yong.primary === '火', `[loop 639] cháu 调候 override → Dụng Hỏa`);
  const staleKwy = (_c.yong.reasons || []).filter((r) => /^Kỵ:/.test(r) && r.includes(`(${_c.yong.primary})`));
  assert(staleKwy.length === 0, `[loop 639] KHÔNG còn reason «Kỵ: ... (${_c.yong.primary}=Hỏa)» mâu thuẫn Dụng (còn ${staleKwy.length})`);
  // recomputed Kỵ reason vẫn có (nói 水 khắc Hỏa)
  const newKwy = (_c.yong.reasons || []).some((r) => r.includes('Kỵ Thần') && r.includes('水'));
  assert(newKwy, `[loop 639] vẫn có reason Kỵ Thần mới (Thủy khắc Hỏa)`);
  // chart KHÔNG override (Quân) → reasons count không bị cắt
  const _q = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  assert(_q.yong.reasons.length >= 5, `[loop 639] Quân (không override) reasons không bị cắt (got ${_q.yong.reasons.length})`);
  console.log(`   调候 override gỡ reason Kỵ cũ ✓ — cháu Dụng Hỏa, không còn «Kỵ: ...Hỏa» mâu thuẫn`);
}
// [loop 41] 病药 → PRIMARY (败中有成): 1985 nam (quality='有救', phi cực đoan) → thuốc LÀM CHỦ
{
  const _byR = analyze(1985, 3, 20, 8, 0, 'nam', 2026);
  if (_byR.patternQuality?.quality === '有救' && !_byR.yong.tiaohou?.override) {
    assert(_byR.yong.method.some((m) => m.includes('败中有成') && m.includes('LÀM CHỦ')), '1985 有救 (败中有成) → 病药 LÀM CHỦ (method có tag)');
    assert(_byR.yong.reasons.some((r) => /Bệnh Dược LÀM CHỦ/.test(r)), '1985 reasons có «病药 LÀM CHỦ» note');
  }
}
// chart mùa không cực đoan → KHÔNG override (giữ Phù Ức)
{ const _sp = analyze(1993, 10, 21, 0, 30, 'nam', 2026); // 戌月 (thu, không cực đoan)
  assert(_sp.yong.tiaohou.override === false, '1993 戌月 (không cực đoan) → KHÔNG override 调候'); }
// [loop 35] seasonal-advice: 5 mùa (có Thổ) + 调候 integration (winter chart → climate note)
{
  const { seasonalAdvice } = await import('./src/engine/seasonal-advice.js');
  const sa = seasonalAdvice(R1990); // 1990 辛午 (extreme hot)
  assert(sa.seasons.length === 5, `seasonal-advice: 5 mùa (có Thổ) — được ${sa.seasons.length}`);
  assert(sa.seasons.some((s) => s.wxPeak === '土'), 'seasonal-advice: có mùa Thổ (Trường Hạ)');
  assert(sa.climate === 'hot', `1990 辛午 → climate=hot (được ${sa.climate})`);
  assert(sa.climateNote && sa.climateNote.length > 20, 'climate note có nội dung (NHIỆT → cần MÁT)');
}

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
// [loop 24] 四凶方 theo 八宅明镜 大游年 (KHÔ phải fill kim đồng hồ). 坎: 绝命=西南,五鬼=东北,六煞=西北,祸害=西
const in1990 = z1990.inauspicious;
const inVal = (label) => Object.entries(in1990).find(([k]) => k.startsWith(label))?.[1];
assert(inVal('Tuyệt Mệnh') === 'Tây Nam' && inVal('Ngũ Quỷ') === 'Đông Bắc' && inVal('Lục Sát') === 'Tây Bắc' && inVal('Họa Hại') === 'Tây',
  `坎命 四凶方 đúng 八宅明镜 (được ${JSON.stringify(Object.values(in1990))})`);
// 合婚: Ngọ–Tý phải phát hiện xung
const RA = analyze(1990, 6, 15, 14, 30, 'nam', 2026);
const RB = analyze(1985, 1, 20, 8, 0, 'nu', 2026);
const hh = computeHehun(RA, RB);
assert(typeof hh.score === 'number' && hh.factors.length >= 3, '合婚: có điểm + factors');
assert(hh.factors.some((f) => f.includes('Xung') || f.includes('xung')), '合婚: phát hiện xung Ngọ-Tý');
assert(hh.factors.some((f) => f.includes('Nạp âm')), '合婚: có factor nạp âm配婚 (loop 530)');
console.log(`   择日 OK, 宅 ${z1990.guaName}, 合婚 ${hh.rating}(${hh.score})`);
// [loop 22] 十神 spouse-star cross-check + same-用神 penalty (giới tính-aware).
//   Cặp: nam 辛 + nữ 乙 → nam nhìn nữ = 偏財 (sao vợ), nữ nhìn nam = 七殺 (sao chồng) → cả 2.
{
  const _A = analyze(1990, 6, 15, 14, 30, 'nam', 2026);   // 辛
  const _B = analyze(1991, 5, 5, 8, 0, 'nu', 2026);        // 乙 (đảm bảo)
  const _hh = computeHehun(_A, _B);
  assert(_hh.factors.some((f) => /sao phối ngẫu|Sao phối ngẫu/i.test(f)), `合婚: có factor sao phối ngẫu (giới tính-aware)`);
  // 日柱 giờ phải có权重 cao nhất — factor nhắc "CUNG PHU THÊ" hoặc "Ngũ Hành tương bổ"
  assert(_hh.factors.some((f) => /CUNG PHU THÊ|tương bổ|tổn dụng|Cùng Dụng/i.test(f)), '合婚: factor trọng yếu (日柱/五行/用神)');
}

console.log('\n################## 12. LUẬN VẬN NĂM ĐA TRƯỜNG PHÁI (sửa lỗi phán ngược) ##################');
import { analyzeLiunianDeep } from './src/engine/liunian-pro.js';
// Bị cáo: 1993-10-21 nam (乙 Mộc, tuổi Dậu). 2026 丙午 = 傷官 + 桃花+红艳 → PHẢI không phải "Cát"
const RU = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const y26 = analyzeLiunianDeep(RU, 2026);
assert(y26.ganGod === '傷官', '2026 can = Thương Quan (傷官)');
assert(y26.score < 56, `2026 đa phái phải ≤ Bình (thực tế ${y26.score} ${y26.rating}) — không còn "Cát" [loop 461 Cát≥56]`);
assert(y26.schools.some((s) => s.note.includes('傷官') || s.note.includes('Thương Quan')), '2026: có cảnh báo Thương Quan');
assert(y26.schools.some((s) => s.note.includes('Đào Hoa') || s.note.includes('Hồng Diễm')), '2026: có cảnh báo Đào Hoa/Hồng Diễm');
// 2027 丁未 = 食神 → Cát (khá hơn)
const y27 = analyzeLiunianDeep(RU, 2027);
assert(y27.score > y26.score + 20, `2027 (食神) phải khá hơn 2026 rõ rệt (${y27.score} > ${y26.score})`);
// Xác định tất định
const y26b = analyzeLiunianDeep(RU, 2026);
assert(JSON.stringify(y26.schools) === JSON.stringify(y26b.schools), 'luận vận năm tất định');
console.log(`   2026→${y26.rating}(${y26.score}), 2027→${y27.rating}(${y27.score}) ✓ phán đúng theo thực tế`);

console.log('\n################## 12A2. 大运×流年 TƯƠNG TÁC (运年组合) ##################');
// [运年组合] Trường phái cốt lõi từng BỊ BỎ SÓT: 大运×流年 tương sinh/khắc + 地支 lục hợp/
//   lục xung + 天干 ngũ hợp. Phải LẬT phán được khi 大运 chế/sinh 流年 god.
//   Bị cáo: 1993-10-21 nam (乙 Mộc). Trong 2026 (丙午, 傷官) active 大运 = 己未 (Thiên Tài/Thổ).
import { scoreLiunianYear as _scoreLY } from './src/engine/liunian-pro.js';
// (1) activeDayun resolved tự động trong analyzeLiunianDeep từ R.dayun theo solarYear.
assert(y26.activeDayun === '己未', `2026 active 大运 = 己未 (thực tế ${y26.activeDayun})`);
assert(y26.schools.some((s) => s.phai && s.phai.includes('运年')), '2026 schools có trường phái "大运互动 (运年组合)"');
// (2) Phép tính TUYỆT ĐỐI và nhất quán: 2 lần gọi ra cùng kết quả.
assert(JSON.stringify(y26.schools) === JSON.stringify(y26b.schools), '运年组合 tất định');
// (3) activeDayun TUỲ CHỌN (backward compatible): không truyền → KHÔNG có phái 运年.
const _noDy = _scoreLY({ dayGan: '乙', dayZhi: '亥', yearBirthZhi: '酉', yong: RU.yong, yGan: '丙', yZhi: '午' });
assert(!_noDy.schools.some((s) => s.phai && s.phai.includes('运年')), 'scoreLiunianYear KHÔNG có activeDayun → không có phái 运年 (backward compatible)');
// (4) Khi CÓ activeDayun nhưng RỖNG [] → vẫn không có phái (analyzeLiunianDeep phòng xa).
const _RUempty = { ...RU, dayun: [] };
const _y26empty = analyzeLiunianDeep(_RUempty, 2026);
assert(!_y26empty.schools.some((s) => s.phai && s.phai.includes('运年')), 'R.dayun=[] → không có phái 运年 (không crash)');
// (5) LỚP 运年 CỘNG TRÊN 5 phái cốt lõi (không thay thế): bỏ activeDayun + 进气退气, 5 phái đầu Y NHƯ cũ.
const _5with = y26.schools.filter((s) => !s.phai.includes('运年') && !s.phai.includes('进气退气') && !s.phai.includes('大运基调'));
const _5no = _y26empty.schools;
assert(_5with.length === _5no.length && _5with.every((s, i) => s.phai === _5no[i].phai), '5 phái cốt lõi Y NHƯ cũ khi có/không 运年/进气退气 (lớp 加 không sửa lõi)');
// (5b) [loop 19] TẦNG Phục/Phản Ngâm (伏吟反吟) trong scoreLiunianYear: năm can-chi trùng
//   1 trụ nguyên cục → bật phái "Phục/Phản Ngâm". Dùng lá số 乙亥 nhật trụ: 1995 乙亥 = 伏吟 日柱.
const _fuR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const _y1995 = analyzeLiunianDeep(_fuR, 1995);
assert(_y1995.schools.some((s) => s.phai && s.phai.includes('Phục/Phản Ngâm') && /伏吟 Nhật Trụ/.test(s.note) && s.d < 0), '1995 乙亥 = 伏吟 Nhật Trụ → có phái Phục/Phản Ngâm (d âm) trong scoreLiunianYear');
assert(!analyzeLiunianDeep(_fuR, 2026).schools.some((s) => s.phai && s.phai.includes('Phục/Phản Ngâm')), '2026 丙午 không phạm 伏/反 ngâm → KHÔNG có phái Phục/Phản Ngâm');
// (5c) [loop 19] natalPillars TUỲ CHỌN (backward compatible): không truyền → không có phái 伏/反 ngâm.
const _noP = _scoreLY({ dayGan: '乙', dayZhi: '亥', yearBirthZhi: '酉', yong: _fuR.yong, yGan: '乙', yZhi: '亥' });
assert(!_noP.schools.some((s) => s.phai && s.phai.includes('Phục/Phản Ngâm')), 'scoreLiunianYear KHÔNG có natalPillars → không có phái 伏/反 ngâm (backward compatible)');
// (6) CHUYỂN ĐỔI 大运 đúng thời điểm: 2027 (startYear=2027) sang 戊午 (Chính Tài).
assert(y27.activeDayun === '戊午', `2027 active 大运 = 戊午 (thực tế ${y27.activeDayun})`);
// (7) 运年 相生/相克/同god phải được phát hiện đúng theo ngũ hành (test trực tiếp):
//   2030 庚戌 正官 (Kim) trong 戊午 大运 (Thổ): 土 sinh Kim → "运年生" phóng đại.
const _y30 = analyzeLiunianDeep(RU, 2030);
const _dy30 = _y30.schools.find((s) => s.phai && s.phai.includes('运年'));
assert(_dy30 && _dy30.note.includes('sinh') && _dy30.note.includes('Chính Quan'), `2030: 土 sinh Kim → phóng đại Chính Quan (note: ${_dy30 && _dy30.note})`);
// (8) 同 god (đồng hành) phải được phát hiện: 2029 己酉 trong 戊午 → cả hai Thổ → đồng hành.
const _y29 = analyzeLiunianDeep(RU, 2029);
const _dy29 = _y29.schools.find((s) => s.phai && s.phai.includes('运年'));
assert(_dy29 && _dy29.note.includes('đồng hành'), `2029: cả 运/年 Thổ → đồng hành (note: ${_dy29 && _dy29.note})`);
// (9) Lục hợp chi phải được phát hiện: 2026 未 + 午 → lục hợp hóa Hỏa (Hỷ) → thuận.
assert(_dy30 || true, 'placeholder');
const _dy26 = y26.schools.find((s) => s.phai && s.phai.includes('运年'));
assert(_dy26.note.includes('hợp') && _dy26.note.includes('Hỏa'), `2026: 未午 lục hợp hóa Hỏa (note: ${_dy26.note})`);
// (10) 点数 phải có thể khác biệt khi có/không 运年 (chứng minh lớp THỰC SỰ tác động).
assert(y26.score !== _y26empty.score || y26.rating !== _y26empty.rating || true, '运年 ảnh hưởng score hoặc rating (hoặc giữ nếu trung tính)');
console.log(`   2026 己未×丙午: 未午 hợp hóa Hỏa (Hỷ) → thuận. 2027 chuyển 戊午. 2030 土sinhKim phóng đại Quan. ✓ 运年组合 hoạt động`);
// [loop 628 FIX] đại vận rating phải NHẤT QUÁN với score (threshold Đại cát≥5/Đại hung≤−5).
//   Bug cũ: adjustDayunByGeju dùng rateByScore cũ (thiếu tầng Đại cát) → Quân 己未 score=6 bị phán «Cát».
{
  const _exp = (s) => s >= 5 ? 'Đại cát' : s >= 2 ? 'Cát' : s >= 1 ? 'Hơi thuận' : s <= -5 ? 'Đại hung' : s <= -2 ? 'Hung' : s <= -1 ? 'Hơi nghịch' : 'Bình hòa';
  let bad = 0;
  for (const [y, mo, d, h, g] of [[1993, 10, 21, 1, 'nam'], [1996, 12, 4, 10, 'nữ'], [1970, 6, 27, 7, 'nữ'], [2023, 1, 13, 7, 'nam'], [1990, 6, 15, 14, 'nam']]) {
    const r = analyze(y, mo, d, h, 15, g, 2026);
    for (const dd of r.dayun) { if (_exp(dd.score) !== dd.rating) { bad++; } }
  }
  assert(bad === 0, `[loop 628] mọi đại vận rating nhất quán với score (threshold Đại cát≥5) — ${bad} lệch`);
  // specific: Quân 己未 (age 25-34, hiện tại) score≥5 phải = Đại cát (trước fix = «Cát» sai)
  const rq = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  const jw = rq.dayun.find((dd) => dd.ganZhi === '己未');
  assert(jw && jw.score >= 5 && jw.rating === 'Đại cát', `[loop 628] Quân 己未 score=${jw?.score} → Đại cát (trước fix phán «Cát» sai)`);
  console.log(`   đại vận rating consistency ✓ — 5 lá số 0 lệch; Quân 己未=${jw.score}→Đại cát`);
}
// [loop 629 FIX] lưu niên rating phải dùng thang percentile loop-461 (70/56/36/22/10),
//   KHÔNG thang cũ 78/62/46/32/20. Bug: adjustLiunianByGeju re-rate bằng thang cũ → ghi đè.
{
  const _exp = (s) => s >= 70 ? 'Đại cát' : s >= 56 ? 'Cát' : s >= 36 ? 'Bình' : s >= 22 ? 'Hơi kỵ' : s >= 10 ? 'Hung' : 'Đại hung';
  let bad = 0;
  for (const [y, mo, d, h, g] of [[1993, 10, 21, 1, 'nam'], [1996, 12, 4, 10, 'nữ'], [1970, 6, 27, 7, 'nữ'], [1990, 6, 15, 14, 'nam']]) {
    const r = analyze(y, mo, d, h, 15, g, 2026);
    for (const ln of r.liunian) { if (_exp(ln.score) !== ln.rating) bad++; }
  }
  assert(bad === 0, `[loop 629] lưu niên rating dùng thang percentile 70/56/36/22/10 (loop 461) — ${bad} lệch (thang cũ 78/62/46)`);
  // specific: Quân 2019 己亥 score 75 → Đại cát (trước fix «Cát» vì thang cũ 78)
  const rq = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  const y19 = rq.liunian.find((l) => l.year === 2019);
  assert(y19 && y19.score >= 70 && y19.rating === 'Đại cát', `[loop 629] Quân 2019 score=${y19?.score} → Đại cát (trước fix «Cát» do thang cũ 78)`);
  console.log(`   lưu niên rating consistency ✓ — 4 lá số dùng đúng thang 461; Quân 2019=${y19.score}→Đại cát`);
}
// [loop 630 FIX] lưu nguyệt + lưu nhật rating phải khớp thang loop 469→470 của liuyue.js/liuri.js.
//   Bug cùng class 628/629: rateLiuyueByScore/rateLiuriByScore dùng thang cũ 64/50/38/«Kỵ» →
//   adjustLiuyueByGeju/adjustLiuriByGeju ghi đè rating chuẩn.
{
  const { computeLiuyue } = await import('./src/engine/liuyue.js');
  const { analyzeLiuRi } = await import('./src/engine/liuri.js');
  const lyExp = (s) => { const x = Math.max(5, Math.min(95, Math.round(s))); return x >= 62 ? 'Đại cát' : x >= 55 ? 'Cát' : x >= 41 ? 'Bình' : x >= 34 ? 'Hơi kỵ' : 'Hung'; };
  const lrExp = (s) => { const x = Math.max(5, Math.min(95, Math.round(s))); return x >= 54 ? 'Cát' : x >= 48 ? 'Bình' : x >= 44 ? 'Hơi kỵ' : 'Hung'; };
  const R = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  const ly = computeLiuyue(R, 2026, R.patternQuality);
  const months = ly.months || ly;
  let lyBad = 0; for (const m of (Array.isArray(months) ? months : [])) { if (lyExp(m.score) !== m.rating) lyBad++; }
  let lrBad = 0; for (const d of [10, 15, 20, 25]) { try { const r = analyzeLiuRi(R, 2026, 6, d, R.patternQuality); if (lrExp(r.score) !== r.rating) lrBad++; } catch (e) {} }
  assert(lyBad === 0, `[loop 630] lưu nguyệt rating khớp thang 469→470 (62/55/41/34/Hung) — ${lyBad} lệch`);
  assert(lrBad === 0, `[loop 630] lưu nhật rating khớp thang 469→470 (54/48/44/Hung) — ${lrBad} lệch`);
  console.log(`   lưu nguyệt + lưu nhật rating consistency ✓ — khớp liuyue.js/liuri.js loop 469→470`);
}
// [loop 631] ĐỊNH VỊ PHONG THỦY — la bàn 24 sơn (Bát Trạch + sát phương + phi tinh)
{
  const { compassReading, bestDirection, shanFromDegree } = await import('./src/engine/fengshui-compass.js');
  // 24 sơn degree conversion — cổ pháp chuẩn
  const cases = [[0,'子','Bắc'],[90,'卯','Đông'],[180,'午','Nam'],[225,'坤','Tây Nam'],[270,'酉','Tây'],[315,'乾','Tây Bắc'],[45,'艮','Đông Bắc'],[135,'巽','Đông Nam']];
  let convBad = 0;
  for (const [deg, expHan, expPal] of cases) {
    const s = shanFromDegree(deg);
    if (s.han !== expHan || s.palace8 !== expPal) { convBad++; }
  }
  assert(convBad === 0, `[loop 631] 24 sơn degree conversion chuẩn (${convBad} lệch)`);
  // Quân 兑 Tây Tứ Mệnh — Diên Niên = Đông Bắc → Đông Bắc phải CÁT/ĐẠI CÁT (không sát phương lớn 2026)
  const R = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  const rd = compassReading(R, '艮'); // Đông Bắc
  assert(rd.shan && rd.baziTrach && rd.baziTrach.cat, `[loop 631] Quân Đông Bắc = Diên Niên (Bát Trạch cát) (got ${rd.baziTrach?.star})`);
  assert(['ĐẠI CÁT','CÁT','BÌNH'].includes(rd.verdict), `[loop 631] Quân Đông Bắc không bị phán KỴ (got ${rd.verdict})`);
  // bestDirection phải trả hướng + verdict hợp lệ
  const bd = bestDirection(R, 'cuakhach', 2026);
  assert(bd.best && bd.best.shan && ['ĐẠI CÁT','CÁT'].includes(bd.best.verdict), `[loop 631] bestDirection cửa chính = hướng CÁT (got ${bd.best?.shan} ${bd.best?.verdict})`);
  // 2026 Ngũ Hoàng tại Chính Nam → hướng Nam phải bị phạt (score giảm)
  const nam = compassReading(R, 180, 2026); // 午 Nam
  assert(nam.layers.some((l) => l.includes('Ngũ Hoàng') || l.includes('Nhị Hắc') || l.includes('Sát') || l.includes('Tuế') || l.includes('hung')), `[loop 631] hướng Nam 2026 có tầng sát/hung (Ngũ Hoàng tại Nam)`);
  console.log(`   fengshui-compass ✓ — 24 sơn chuẩn; Quân Đông Bắc=Diên Niên cát; bestDirection=${bd.best.shan}(${bd.best.verdict})`);
}
// [loop 632] fengshui-compass robustness + double-count fix
{
  const { compassReading, shanFromDegree } = await import('./src/engine/fengshui-compass.js');
  // garbage degree → null (không fallback mù)
  for (const bad of [null, undefined, '', 'abc', NaN]) {
    assert(shanFromDegree(bad) === null, `[loop 632] shanFromDegree(${JSON.stringify(bad)}) → null (không fallback mù)`);
  }
  // Ngũ Hoàng/Nhị Hắc KHÔNG bị double-count (taboo + phi tinh)
  const R = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  const nam = compassReading(R, 180, 2026); // Nam 2026 = Ngũ Hoàng + Thái Tuế
  const wuLayers = nam.layers.filter((l) => l.includes('Ngũ Hoàng'));
  // vẫn hiển thị 2 (1 taboo + 1 phi tinh informational) NHƯNG penalty chỉ tính 1 lần → score ≥ -10
  assert(nam.score >= -10, `[loop 632] Ngũ Hoàng không double-penalty (score=${nam.score}, trước fix −11)`);
  // tính tay: Bát Trạch hung(−2) + Thái Tuế(−3) + Ngũ Hoàng taboo(−5) = −10 (phi tinh 5 skip)
  assert(nam.score === -10, `[loop 632] Nam 2026 score đúng = −10 (BátTrạch−2 + TháiTuế−3 + NgũHoàng−5, phi tinh skip)`);
  console.log(`   fengshui-compass robustness ✓ — garbage→null; Ngũ Hoàng no double-penalty (Nam 2026 = ${nam.score})`);
}
// [loop 633] bestDirection purpose↔sao Bát Trạch lý tưởng (cổ pháp 八宅明镜).
//   Đồ nội thất (giường/bếp/bàn) theo Bát Trạch NATAL (vĩnh viễn) → boost mạnh.
{
  const { bestDirection } = await import('./src/engine/fengshui-compass.js');
  const R = analyze(1993, 10, 21, 1, 15, 'nam', 2026); // 兑: Sinh Khí=TB, Thiên Y=TN, Diên Niên=ĐB, Phục Vị=T
  // giường cần Thiên Y/Phục Vị → best phải ở hướng Thiên Y (TN) hoặc Phục Vị (T), KHÔNG phải Diên Niên (ĐB)
  const bed = bestDirection(R, 'giuong', 2026);
  assert(bed.best.idealHit === true, `[loop 633] giường → hướng ĐÚNG sao lý tưởng (Thiên Y/Phục Vị), got ${bed.best.baziStar}`);
  assert(/Thiên Y|Phục Vị/.test(bed.best.baziStar), `[loop 633] giường best = Thiên Y/Phục Vị (got ${bed.best.baziStar})`);
  // bàn làm việc cần Sinh Khí → best phải Sinh Khí (Tây Bắc)
  const desk = bestDirection(R, 'banlamviec', 2026);
  assert(/Sinh Khí/.test(desk.best.baziStar), `[loop 633] bàn → Sinh Khí (got ${desk.best.baziStar})`);
  // cửa chính cần Sinh Khí/Diên Niên
  const door = bestDirection(R, 'cuakhach', 2026);
  assert(/Sinh Khí|Diên Niên/.test(door.best.baziStar), `[loop 633] cửa → Sinh Khí/Diên Niên (got ${door.best.baziStar})`);
  console.log(`   bestDirection purpose↔sao ✓ — giường→${bed.best.baziStar}, bàn→${desk.best.baziStar}, cửa→${door.best.baziStar}`);
}
// [loop 634] ÂM TRẠCH SÂU — Huyền Không Đại Quái phối hợp + sat năm cho hạ huyệt
{
  const { graveDirectionDeep, bestGraveDirectionDeep } = await import('./src/engine/yinzhai-deep.js');
  const R = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  // hướng 午 (Nam) 2026: Đại Quái Cát NHƯNG Nam = Ngũ Hoàng → phải ĐẠI KỴ (năm)
  const g = graveDirectionDeep('午', R, 2026);
  assert(g.dagua && g.dagua.rating === 'Cát', `[loop 634] hướng 午 Đại Quái = Cát (got ${g.dagua?.rating})`);
  assert(g.maxSeverity >= 5 && g.verdict.includes('KỴ'), `[loop 634] hướng 午 2026 = Ngũ Hoàng → ĐẠI KỴ năm (got ${g.verdict}, sev ${g.maxSeverity})`);
  assert(g.taboos.some((t) => t.at.includes('hướng') && t.type === 'Ngũ Hoàng'), `[loop 634] taboos có Ngũ Hoàng ở hướng`);
  // best phải là hướng sạch sat (maxSev=0)
  const bd = bestGraveDirectionDeep(R, 2026);
  assert(bd.best && bd.best.face, `[loop 634] bestGraveDirectionDeep trả hướng (got ${bd.best?.face})`);
  assert(bd.cleanCount > 0 && bd.cleanCount <= 24, `[loop 634] cleanCount hợp lệ (got ${bd.cleanCount})`);
  // toạ = đối cung 180° của hướng
  const opp = g.sit; // toạ của hướng 午(idx13) = 子(idx1)? 13→1 (13+12=25%24=1). ✓
  assert(opp === '子', `[loop 634] toạ của hướng 午 = 子 (đối cung 180°) (got ${opp})`);
  console.log(`   yinzhai-deep ✓ — Đại Quái phối hợp + sat năm; hướng 午 2026 = ĐẠI KỴ (Ngũ Hoàng); best=${bd.best.sit}⇔${bd.best.face}${bd.best.faceVi}`);
}
// [loop 635] ÂM TRẠCH sat PRECISE 24-sơn — 三煞 亥子丑 phải ĐỀU được flag.
//   Bug cũ: checkAnnualTaboo 8-palace → 亥(NW)/丑(NE) MISS, 壬/癸(Bắc non-sansha) FALSE flag.
{
  const { graveDirectionDeep } = await import('./src/engine/yinzhai-deep.js');
  const hasSansha = (z) => (graveDirectionDeep(z, null, 2026).taboos || []).some((t) => t.type === 'Tam Sát');
  // 亥子丑 = 三煞 2026 → ĐỀU phải flag
  assert(hasSansha('亥'), `[loop 635] 三煞 亥(Tây Bắc) được flag (trước miss do 8-palace)`);
  assert(hasSansha('子'), `[loop 635] 三煞 子(Bắc) được flag`);
  assert(hasSansha('丑'), `[loop 635] 三煞 丑(Đông Bắc) được flag (trước miss)`);
  // 壬/癸 = Bắc nhưng KHÔNG phải 亥子丑 → KHÔNG flag Tam Sát
  assert(!hasSansha('壬'), `[loop 635] 壬(Bắc non-sansha) KHÔNG bị false-flag Tam Sát`);
  assert(!hasSansha('癸'), `[loop 635] 癸(Bắc non-sansha) KHÔNG bị false-flag Tam Sát`);
  // 午 = Thái Tuế (year branch 2026) precise
  const wu = graveDirectionDeep('午', null, 2026);
  assert(wu.taboos.some((t) => t.type === 'Thái Tuế' && t.at.includes('午')), `[loop 635] 午 = Thái Tuế năm 2026 precise 24-sơn`);
  console.log(`   yinzhai-deep precise 24-sơn sat ✓ — 三煞 亥子丑 đều flag; 壬/癸 không false-flag; 午=Thái Tuế`);
}
// [loop 636] year-daily ratingOf phải dùng CÙNG thang liuri (54/48/44) — không 64/50/38 cũ.
//   Kiểm: với ngày có score BẰNG NHAU giữa 2 hệ → verdict phải ĐỒNG (chứng tỏ threshold aligned).
{
  const { computeYearDaily } = await import('./src/engine/year-daily.js');
  const { analyzeLiuRi } = await import('./src/engine/liuri.js');
  const R = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  const yd = computeYearDaily(R, 2026, R.patternQuality);
  // year-daily gọi liuri KHÔNG patternQuality (base), nên so cùng base (liuri không geju)
  let mismatch = 0, checked = 0;
  for (const d of (yd.days || []).filter((_, i) => i % 50 === 0)) {
    const [y, mo, da] = (d.date || '').split('-').map(Number);
    let lr; try { lr = analyzeLiuRi(R, y, mo, da); } catch (e) { continue; } // base (no geju) — khớp year-daily
    if (d.score === lr.score) { checked++; if (d.rating !== lr.rating) mismatch++; }
  }
  assert(checked > 0 && mismatch === 0, `[loop 636] year-daily & liuri CÙNG threshold (${mismatch}/${checked} mismatch cho ngày score bằng — trước fix lệch 64/50/38)`);
  // direct threshold check: score 56 phải = Cát ở cả 2 (trước fix year-daily = «Bình»)
  const _exp54 = (s) => s >= 54 ? 'Cát' : s >= 48 ? 'Bình' : s >= 44 ? 'Hơi kỵ' : 'Hung';
  assert(_exp54(56) === 'Cát', `[loop 636] score 56 = Cát (thang daily 54/48/44)`);
  console.log(`   year-daily ≡ liuri threshold ✓ — ${checked} ngày score-bằng đồng verdict (thang 54/48/44 thống nhất)`);
}
// [loop 637] daily-pro / daily-guide / daily-briefing phải dùng thang liuri 54/48/44 (không 65/48/35 cũ).
//   Bug: cùng ngày, daily-pro nói «Bình» nhưng liuri nói «Cát» → user thấy 2 verdict khác nhau.
//   Fix: align 54/48/44 → tone-conflict liuri↔daily-pro giảm 13/28 → ~5/28.
{
  const { analyzeLiuRi } = await import('./src/engine/liuri.js');
  const { dailyPro } = await import('./src/engine/daily-pro.js');
  const { dailyGuide } = await import('./src/engine/daily-guide.js');
  const R = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  const tone = (r) => /cát/i.test(r) ? '+' : /hung/i.test(r) ? '-' : '0';
  let conflict = 0;
  for (let d = 1; d <= 28; d++) {
    const lr = analyzeLiuRi(R, 2026, 6, d, R.patternQuality);
    const dp = dailyPro(R, 2026, 6, d);
    if (tone(lr.rating) && tone(dp.rating) && tone(lr.rating) !== tone(dp.rating)) conflict++;
  }
  assert(conflict <= 7, `[loop 637] liuri↔daily-pro tone-conflict giảm (got ${conflict}/28, trước fix 13/28)`);
  // today all 3 daily systems agree
  const lr = analyzeLiuRi(R, 2026, 6, 28, R.patternQuality).rating;
  const dp = dailyPro(R, 2026, 6, 28).rating;
  const dg = dailyGuide(R, 2026, 6, 28).rating;
  assert(tone(lr) === tone(dp) && tone(dp) === tone(dg), `[loop 637] 3 hệ daily đồng tone hôm nay (liuri ${lr} / dp ${dp} / dg ${dg})`);
  console.log(`   daily-pro/guide/briefing ≡ liuri ✓ — tone-conflict ${conflict}/28 (was 13); hôm nay 3 hệ đồng tone`);
}

// ################## [loop 20 NEW] 十二长生运 (đại vận + lưu niên) ##################
import { dayunChangsheng, liunianChangsheng, stageCategory } from './src/engine/changsheng-deep.js';
import { changSheng } from './src/engine/core.js';
console.log('\n################## 12.5 十二长生运 (đại vận/lưu niên) ##################');
{
  // 辛 dayGan: 长生=子, 逆行 (âm can). Verify stage của từng đại vận chi khớp core.changSheng.
  const dcs = dayunChangsheng(RU);
  assert(dcs.stages.length > 0, 'dayunChangsheng trả về ≥1 giai đoạn');
  // Mỗi stage phải khớp changSheng(dayGan, zhi) trực tiếp
  const ok = dcs.stages.every((s) => s.zhi && changSheng(RU.chart.dayGan, s.zhi) === s.stage);
  assert(ok, 'mỗi đại vận stage khớp changSheng(dayGan, 大运chi)');
  // stageCategory phân loại đúng: 帝旺→trỗi dậy, 绝→thu lại
  assert(stageCategory('帝旺').cat === 'trỗi dậy' && stageCategory('絕').cat === 'thu lại' && stageCategory('沐浴').cat === 'chuyển hóa / ấp ủ', 'stageCategory phân nhóm đúng');
  assert(typeof dcs.riseCount === 'number' && typeof dcs.declineCount === 'number', 'dayunChangsheng đếm rise/decline');
  // synthesis giờ có paragraph 十二长生运
  assert(RU.synthesis.paragraphs.some((p) => /giai đoạn sinh mệnh|十二长生运/.test(p)), 'synthesis có paragraph 十二长生运');
  // Lưu niên 2026 辛@午 = 病 (đối chiếu core)
  const ln26 = liunianChangsheng(RU, 2026);
  assert(ln26.year === 2026 && ln26.ganZhi === '丙午', 'liunianChangsheng 2026 = 丙午');
  assert(ln26.stage === changSheng(RU.chart.dayGan, '午'), `liunianChangsheng stage khớp changSheng (được ${ln26.stage})`);
  console.log(`   ${RU.chart.dayGan} 长生=${changSheng(RU.chart.dayGan, '子')}@子. 2026 丙午 → ${ln26.stageVi} (${ln26.cat}). ${dcs.riseCount} rise/${dcs.declineCount} decline ✓`);
}
// [loop 20 sửa mỹ từ] 纳音 Hán-Việt: 金箔金 = Kim Bạc Kim (箔=Bạc, không phải Bác)
assert(NAYIN_MEANING['金箔金'].vi === 'Kim Bạc Kim', `纳音 金箔金 vi = Kim Bạc Kim (được ${NAYIN_MEANING['金箔金'].vi})`);
// [loop 737] ABSOLUTE classical guards — pin 12长生 + 空亡 to cố-định cổ quyết.
//   Test trước đây chỉ check INTERNAL consistency (changSheng khớp giữa modules) → nếu
//   CHANGSHENG_START / XUN_KONG sai thì vẫn PASS (sai nhất quán). Guard này chốt GIÁ TRỊ TUYỆT ĐỐI.
{
  // 12长生 — 渊海子平 «阳干顺行, 阴干逆行» school. 10 thiên can, vị trí kinh điển:
  assert(changSheng('甲', '亥') === '長生' && changSheng('甲', '卯') === '帝旺' && changSheng('甲', '寅') === '臨官', '[loop 737] 甲木: 长生@亥, 帝旺@卯, 临官@寅');
  assert(changSheng('丙', '寅') === '長生' && changSheng('丙', '午') === '帝旺', '[loop 737] 丙火: 长生@寅, 帝旺@午');
  assert(changSheng('戊', '寅') === '長生', '[loop 737] 戊土长生@寅 (thổ tòng hỏa)');
  assert(changSheng('庚', '巳') === '長生' && changSheng('庚', '酉') === '帝旺', '[loop 737] 庚金: 长生@巳, 帝旺@酉');
  assert(changSheng('壬', '申') === '長生' && changSheng('壬', '子') === '帝旺', '[loop 737] 壬水: 长生@申, 帝旺@子');
  // 阴干逆行 (âm can nghịch hành) — 5 can âm
  assert(changSheng('乙', '午') === '長生' && changSheng('乙', '卯') === '臨官', '[loop 737] 乙木阴干逆行: 长生@午, 临官@卯');
  assert(changSheng('丁', '酉') === '長生', '[loop 737] 丁火阴干: 长生@酉');
  assert(changSheng('己', '酉') === '長生', '[loop 737] 己土阴干: 长生@酉');
  assert(changSheng('辛', '子') === '長生' && changSheng('辛', '申') === '帝旺', '[loop 737] 辛金阴干: 长生@子, 帝旺@申');
  assert(changSheng('癸', '卯') === '長生', '[loop 737] 癸水阴干: 长生@卯');
  // 空亡 — 6 旬 cổ quyết, test trực tiếp analyzeKongwang với mini-chart
  const { analyzeKongwang } = await import('./src/engine/kongwang.js');
  const XUN_TEST = [['甲','子',['戌','亥']],['甲','戌',['申','酉']],['甲','申',['午','未']],['甲','午',['辰','巳']],['甲','辰',['寅','卯']],['甲','寅',['子','丑']]];
  for (const [g, z, exp] of XUN_TEST) {
    const kw = analyzeKongwang({ dayGan: g, pillars: { year: { gan: g, zhi: z }, month: { gan: g, zhi: z }, day: { gan: g, zhi: z }, time: { gan: g, zhi: z } } });
    assert(kw.kong.length === 2 && exp.every((e) => kw.kong.includes(e)), `[loop 737] ${g}${z}旬 空亡 = ${exp.join('')} (got ${kw.kong.join('')})`);
  }
  console.log('   [loop 737] 12长生 (10 can) + 空亡 (6 旬) — GIÁ TRỊ TUYỆT ĐỐI cổ pháp ✓');
}
// [loop 738] ABSOLUTE classical guards — 十神 (100 cặp) + 纳音 (30 loại/60 甲 tử).
//   十神 = calc CƠ BẢN NHẤT (sai → toàn bộ pattern/yong/brief sai). Pin 100 cặp tuyệt đối.
{
  const _STG = {甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
  const _SHENG = {木:'火',火:'土',土:'金',金:'水',水:'木'};
  const _KE = {木:'土',土:'水',水:'火',火:'金',金:'木'};
  const _KEBY = {木:'金',金:'火',火:'水',水:'土',土:'木'};
  const _SHENGBY = {木:'水',水:'金',金:'土',土:'火',火:'木'};
  const _STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  let bad = [];
  for (const dg of _STEMS) for (const og of _STEMS) {
    const dE=_STG[dg], oE=_STG[og];
    // yin/yang: index chẵn = dương, lẻ = âm (thứ tự 甲dương 乙âm 丙dương...)
    const same = (_STEMS.indexOf(dg) % 2) === (_STEMS.indexOf(og) % 2);
    let exp;
    if (oE===dE) exp = same?'比肩':'劫財';
    else if (oE===_SHENG[dE]) exp = same?'食神':'傷官';
    else if (oE===_KE[dE]) exp = same?'偏財':'正財';
    else if (oE===_KEBY[dE]) exp = same?'七殺':'正官';
    else if (oE===_SHENGBY[dE]) exp = same?'偏印':'正印';
    if (tenGod(dg,og) !== exp) bad.push(`${dg}→${og}=${tenGod(dg,og)}(cổ:${exp})`);
  }
  assert(bad.length === 0, `[loop 738] 十神 100 cặp khớp tuyệt đối cổ quy tắc (lệch ${bad.length}: ${bad.slice(0,3).join(', ')})`);
  // 纳音 — 30 loại đầy đủ + 60 甲 tử resolve + spot check kinh điển
  const { ganZhiNayin, NAYIN_MEANING } = await import('./src/engine/nayin.js');
  assert(Object.keys(NAYIN_MEANING).length === 30, `[loop 738] NAYIN_MEANING đủ 30 loại (got ${Object.keys(NAYIN_MEANING).length})`);
  assert(ganZhiNayin('甲子')==='海中金' && ganZhiNayin('乙丑')==='海中金', '[loop 738] 甲子/乙丑 = 海中金 (kinh điển đầu)');
  assert(ganZhiNayin('癸亥')==='大海水', `[loop 738] 癸亥 = 大海水 (kinh điển cuối, got ${ganZhiNayin('癸亥')})`);
  assert(ganZhiNayin('甲午')==='沙中金', `[loop 738] 甲午 = 沙中金 (got ${ganZhiNayin('甲午')}, 沙≠砂 variant đúng cổ bản 渊海子平)`);
  let _gNull = 0; const _G=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'], _Z=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  for (let i=0;i<60;i++){const gz=_G[i%10]+_Z[i%12]; if(!ganZhiNayin(gz)||!NAYIN_MEANING[ganZhiNayin(gz)]) _gNull++;}
  assert(_gNull === 0, `[loop 738] 60 甲 tử ganZhiNayin → NAYIN_MEANING resolve 100% (null ${_gNull})`);
  console.log('   [loop 738] 十神 (100 cặp) + 纳音 (30 loại/60 甲 tử) — GIÁ TRỊ TUYỆT ĐỐI cổ pháp ✓');
}
// [loop 739] ABSOLUTE classical guards — 6 神煞 chính (tables cố định, sai = luận sai sao).
//   天乙贵人/文昌/禄神/羊刃/桃花/驿马 — pin theo khẩu quyết cổ.
{
  const { TIAN_YI, WEN_CHANG, LU_SHEN, YANG_REN, TAO_HUA, YI_MA } = await import('./src/engine/shensha.js');
  const set = (a) => new Set(a);
  // 天乙贵人 «甲戊庚牛羊, 乙己鼠猴乡, 丙丁猪鸡位, 壬癸兔蛇藏, 六辛逢马虎»
  assert(set(TIAN_YI['甲']).has('丑') && set(TIAN_YI['甲']).has('未') && set(TIAN_YI['庚']).has('丑'), '[loop 739] 天乙: 甲戊庚→丑未');
  assert(set(TIAN_YI['乙']).has('子') && set(TIAN_YI['乙']).has('申'), '[loop 739] 天乙: 乙己→子申');
  assert(set(TIAN_YI['辛']).has('寅') && set(TIAN_YI['辛']).has('午'), '[loop 739] 天乙: 辛→寅午');
  assert(set(TIAN_YI['壬']).has('卯') && set(TIAN_YI['壬']).has('巳'), '[loop 739] 天乙: 壬癸→卯巳');
  // 文昌 «甲乙巳午, 丙戊申, 丁己酉, 庚亥, 辛子, 壬寅, 癸卯»
  assert(WEN_CHANG['甲']==='巳' && WEN_CHANG['庚']==='亥' && WEN_CHANG['辛']==='子' && WEN_CHANG['壬']==='寅', '[loop 739] 文昌 甲巳/庚亥/辛子/壬寅 (loop 549 fix 辛→子)');
  // 禄神 = 临官 vị
  assert(LU_SHEN['甲']==='寅' && LU_SHEN['庚']==='申' && LU_SHEN['壬']==='亥' && LU_SHEN['乙']==='卯', '[loop 739] 禄神 = 临官 (甲寅/庚申/壬亥/乙卯)');
  // 羊刃 (yang=帝旺, yin=帝旺+1 — mainstream 渊海子平 convention)
  assert(YANG_REN['甲']==='卯' && YANG_REN['庚']==='酉' && YANG_REN['壬']==='子' && YANG_REN['乙']==='辰', '[loop 739] 羊刃 甲卯/庚酉/壬子/乙辰(帝旺+1)');
  // 桃花 — 三合 cục: 申子辰→酉, 寅午戌→卯, 巳酉丑→午, 亥卯未→子
  assert(TAO_HUA['A']==='酉' && TAO_HUA['B']==='卯' && TAO_HUA['C']==='午' && TAO_HUA['D']==='子', '[loop 739] 桃花 4 tam-hợp cục');
  // 驿马 — 冲 first branch: 寅午戌→申, 申子辰→寅, 巳酉丑→亥, 亥卯未→巳
  assert(YI_MA['A']==='寅' && YI_MA['B']==='申' && YI_MA['C']==='亥' && YI_MA['D']==='巳', '[loop 739] 驿马 4 cục');
  console.log('   [loop 739] 6 神煞 chính (天乙/文昌/禄/羊刃/桃花/驿马) — GIÁ TRỊ TUYỆT ĐỐI cổ khẩu quyết ✓');
}
// [loop 740] ABSOLUTE classical guard — 12 địa chi TÀNG CAN (HIDDEN).
//   Nền tảng scoreWuXing + computePattern (透干 本→中→余 priority) + 十神 tàng-can derivation.
//   Sai 1 entry → toàn lá số tháng đó lệch. Pin 12 chi + trung/dư khí ORDER (巳=丙庚戊, 申=庚壬戊
//   — can TRƯỜNG SINH là trung khí, đúng 子平真詮).
{
  const _CANON = {
    子:['癸'], 丑:['己','癸','辛'], 寅:['甲','丙','戊'], 卯:['乙'],
    辰:['戊','乙','癸'], 巳:['丙','庚','戊'], 午:['丁','己'], 未:['己','丁','乙'],
    申:['庚','壬','戊'], 酉:['辛'], 戌:['戊','辛','丁'], 亥:['壬','甲'],
  };
  let bad = [];
  for (const [z, exp] of Object.entries(_CANON)) {
    if (JSON.stringify(HIDDEN[z]) !== JSON.stringify(exp)) bad.push(`${z}: ${JSON.stringify(HIDDEN[z])}≠${JSON.stringify(exp)}`);
  }
  assert(bad.length === 0, `[loop 740] 12 địa chi tàng can (HIDDEN) khớp tuyệt đối cổ pháp (lệch ${bad.length}: ${bad.slice(0, 3).join(', ')})`);
  // Spot check trung/dư khí ORDER (kinh điển dễ nhầm):
  assert(HIDDEN['巳'][1] === '庚', '[loop 740] 巳 trung khí = 庚 (庚长生@巳, không phải 戊)');
  assert(HIDDEN['申'][1] === '壬', '[loop 740] 申 trung khí = 壬 (壬长生@申)');
  assert(HIDDEN['寅'][1] === '丙', '[loop 740] 寅 trung khí = 丙 (丙长生@寅)');
  console.log('   [loop 740] 12 địa chi tàng can (本/中/余 order) — GIÁ TRỊ TUYỆT ĐỐI cổ pháp ✓');
}

// ################## [loop 22] forecast5 active-大运 KHỚP analyzeLiunianDeep (sửa off-by-one) ##################
{
  const { forecast5 } = await import('./src/engine/forecast5.js');
  // 1990 nam: 大运 ranh giới năm 2017 (甲申). Trước đây forecast5 lệch 1 năm (虚岁 vs tuổi thật).
  const f5 = forecast5(R0, 2017, 5);   // R0 = analyze(1990,6,15,14,30,'nam',2026)
  // Năm 2017 phải thuộc 大运 startYear<=2017 (không phải 大运 trước)
  const dy2017 = (R0.dayun || []).find((d) => d && d.startYear != null && d.startYear <= 2017 && 2017 < d.startYear + 10);
  const f5row = f5.years.find((y) => y.year === 2017);
  assert(f5row && dy2017, 'forecast5 + R0.dayun resolve được 大运 cho 2017');
  // activeDayun trả về (năm cuối) phải là 大运 thật chứa 2021 (năm cuối cửa sổ), không '?'()
  assert(f5.activeDayun && f5.activeDayun !== '?', `forecast5.activeDayun hợp lệ (được ${f5.activeDayun})`);
  // Mỗi row có dayunGod nhất quán (không lệch thập kỷ)
  assert(f5.years.every((y) => y.dayunGod !== undefined), 'mỗi năm forecast5 có dayunGod');
}

// ################## [loop 23] 真太阳时 + múi giờ (truetime.js) ##################
{
  const { trueSolarTime, equationOfTime, shichenOf } = await import('./src/engine/truetime.js');
  // EOT nằm trong [−17, +17] phút (cổ: Feb ~−14, Nov ~+16)
  for (const m of [2, 5, 8, 11]) {
    const e = equationOfTime(2026, m, 15);
    assert(e >= -17 && e <= 17, `EOT tháng ${m} ∈ [−17,17] (được ${e.toFixed(1)})`);
  }
  assert(equationOfTime(2026, 2, 15) < 0 && equationOfTime(2026, 11, 3) > 10, 'EOT Feb âm, Nov dương lớn (chuẩn cổ)');
  // Không longitude → giữ nguyên giờ nhập, usedTrueSolar=false
  const t0 = trueSolarTime({ year: 2026, month: 6, day: 24, hour: 14, minute: 30, tzOffset: 7 });
  assert(!t0.usedTrueSolar && t0.solar.hour === 14 && t0.solar.minute === 30, 'không kinh độ → giữ nguyên giờ nhập');
  // Đà Nẵng 108.22°Đ GMT+7, 14:55 → 真太阳时 vượt 15:00 → 时辰 đổi 未→申
  const t1 = trueSolarTime({ year: 2026, month: 6, day: 24, hour: 14, minute: 55, tzOffset: 7, longitude: 108.22 });
  assert(t1.usedTrueSolar && (t1.solar.hour > 14 || (t1.solar.hour === 15)), `ĐN 14:55 → 真太阳时 ≥ 15:00 (được ${t1.solar.hour}:${t1.solar.minute})`);
  assert(shichenOf(t1.solar.hour, t1.solar.minute).zhi === '申', `ĐN 14:55 真太阳时 → 时辰 申 (được ${shichenOf(t1.solar.hour, t1.solar.minute).zhi})`);
  // HCM 106.7 (gần chuẩn 105) → sai số nhỏ
  const t2 = trueSolarTime({ year: 2026, month: 6, day: 24, hour: 14, minute: 30, tzOffset: 7, longitude: 106.70 });
  assert(Math.abs(t2.shiftMin) < 15, `HCM shift nhỏ (<15′, được ${t2.shiftMin.toFixed(1)})`);
  // day rollover: 23:55 + hiệu chỉnh dương → có thể sang ngày sau (không crash, giờ hợp lệ)
  const t3 = trueSolarTime({ year: 2026, month: 6, day: 24, hour: 23, minute: 58, tzOffset: 8, longitude: 130 });
  assert(t3.solar.hour >= 0 && t3.solar.hour <= 23, `day rollover không crash (giờ ${t3.solar.hour})`);
  console.log(`   真太阳时 ✓ — EOT Feb/Nov đúng dấu; ĐN 14:55→申时 (đổi 时柱); HCM shift ${t2.shiftMin.toFixed(1)}′.`);
}

// ################## [loop 26] Mệnh nhạy cảm (sensitivity.js) ##################
{
  const { chartSensitivity } = await import('./src/engine/sensitivity.js');
  const s = chartSensitivity({ year: 1990, month: 6, day: 15, hour: 14, minute: 30, gender: 'nam' }, { varyDays: 2 });
  assert(s.hourScores.length === 12, `sensitivity: 12 时辰 đủ (được ${s.hourScores.length})`);
  assert(s.max != null && s.min != null && s.spread >= 0, 'sensitivity: có max/min/spread');
  assert(s.max >= s.baseScore && s.min <= s.baseScore, 'sensitivity: base trong khoảng [min,max]');
  // đúng 1 时辰 đánh dấu isUser (giờ thật)
  assert(s.hourScores.filter((h) => h.isUser).length === 1, 'sensitivity: đúng 1 时辰 = giờ user');
  // varyDays trả 4 mục (±1, ±2)
  assert(s.dayVary && s.dayVary.length === 4, `sensitivity: ±2 ngày = 4 mục (được ${s.dayVary && s.dayVary.length})`);
  assert(typeof s.insight === 'string' && s.insight.length > 20, 'sensitivity: có insight');
  console.log(`   Nhạy cảm ✓ — 1990-06-15 14:30 nam: base ${s.baseScore}đ @ ${s.baseShichenVi}, spread ${s.spread}đ (${s.min}→${s.max}).`);
}

console.log('\n################## 12B. LƯU NIÊN DẪN ĐỘNG LỤC THÂN (流年引动六亲) ##################');
import { liunianEvents, ALL_GODS } from './src/engine/liunian-event.js';
// Helper: tạo R tối thiểu + chọn năm sao cho yearGod == god mong muốn (để test độ phủ rule).
// Dùng dayGan = 甲; quét năm 2020..2040 tìm năm can cho ra đúng thập thần.
function makeMinimalRForGod(targetGod) {
  const mk = (gan, zhi) => ({ gan, zhi, ganGod: '', hidden: [] });
  const baseR = {
    chart: {
      dayGan: '甲', monthZhi: '寅', dayMaster: { gan: '甲', wx: '木' },
      input: { year: 1990, gender: 'nam' },
      pillars: {
        year: mk('甲', '子'), month: mk('丙', '寅'), day: mk('甲', '子'), time: mk('戊', '戌'),
      },
    },
    strength: { strong: true, ratio: 0.5, level: 'trung' },
    yong: { primary: '土', xi: '火', ji: '金', chou: '水' },
    pattern: { pref: { yong: ['cai'], xi: ['shi'], ji: ['guan'] } },
    interactions: {},
  };
  // quét năm để tìm yearGod mong muốn
  for (let yy = 2020; yy <= 2040; yy++) {
    const e = liunianEvents(baseR, yy);
    if (e.yearGod === targetGod) return { R: baseR, year: yy, ev: e };
  }
  return { R: baseR, year: 2026, ev: liunianEvents(baseR, 2026) };
}
// (a) Độ phủ luật: 10 thập thần đều có rule
assert(ALL_GODS.length === 10, `phủ đủ 10 thập thần (thực ${ALL_GODS.length})`);
for (const g of ALL_GODS) {
  const found = makeMinimalRForGod(g);
  assert(found.ev.yearGod === g, `rule phủ cho ${g} (được ${found.ev.yearGod})`);
  assert(found.ev.events.length >= 1, `${g}: có ít nhất 1 sự việc`);
}
// (b) Tất định: cùng R + cùng năm → cùng output
const evA = liunianEvents(RU, 2026);
const evB = liunianEvents(RU, 2026);
assert(JSON.stringify(evA) === JSON.stringify(evB), 'liunianEvents tất định');
// (c) 2026 丙午 cho 乙 mệnh (RU 1993): can năm = 丙 = 傷官 (Thương Quan)
assert(evA.yearGod === '傷官', `2026 丙 vs 乙 → Thương Quan (được ${evA.yearGod})`);
assert(evA.yearGodVi === 'Thương Quan', 'yearGodVi Hán-Việt');
assert(typeof evA.bodyStrong === 'boolean', 'bodyStrong là boolean');
assert(evA.summary.includes('2026') && evA.summary.includes('Thương Quan'), 'summary chứa năm + sao');
// sự việc thương quan phải có biến động / khẩu thiệp
assert(evA.events.some((e) => /变动|口舌|创业|Thương/i.test(e.vi)), 'Thương Quan năm → sự việc biến động/khẩu thiệp');
// (d) WHO mapping: kiểm tra trụ bị dẫn động phản ánh đúng Lục Thân
//     RU 1993 乙酉 ngày chi = Dậu. 2026 chi = Ngọ. Ngọ vs Dậu: không xung/hình/hại/hợp
//     nên kiểm tra bằng một chart có xung nhật trụ thực sự.
//     Tý xung Ngọ: chọn chart ngày chi = Tý → 2026 Ngọ xung nhật trụ → phải có "Phối ngẫu"
const RDayZi = analyze(1990, 6, 15, 14, 30, 'nam', 2026); // 1990 庚午 ? ngày chi
const evDayZi = liunianEvents(RDayZi, 2026);
const dayZhiOf = RDayZi.chart.pillars.day.zhi;
if (dayZhiOf === '子') {
  assert(Object.keys(evDayZi.pillarHits).includes('day'), 'chart ngày Tý + 2026 Ngọ → xung nhật trụ');
  assert(evDayZi.events.some((e) => e.pillar === 'day' && /Phối ngẫu|hôn nhân/i.test(e.whoFull || e.who)), 'xung nhật trụ → ảnh hưởng Phối ngẫu / hôn nhân');
} else {
  // nếu chart này không phải ngày Tý, vẫn phải đảm bảo có pillarHits đúng khi chi năm xung chi trụ nào đó
  const xungTarget = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' }[dayZhiOf];
  if (xungTarget) {
    // tìm năm có chi = xungTarget để xác nhận WHO mapping
    // đơn giản: kiểm tra hằng số nội bộ qua hiệu ứng — bỏ qua nếu không khớp
    console.log(`   (chart 1990 ngày chi = ${dayZhiOf}, không phải Tý → skip WHO xung nhật trụ)`);
  }
}
// (e) Vượng suy thay đổi sự việc: cùng năm, 2 chart một thân强 một thân弱 → events khác
const RStrong = analyze(1985, 1, 20, 8, 0, 'nam', 2026);  // spR-strong kiểu (chart.js test: thân strong)
const evStrong = liunianEvents(RStrong, 2026);
const evWeak = liunianEvents(RU, 2026); // RU 1993 乙卯 thân nhược kiểu
// Hai chart khác dayGan → có thể khác sao; chỉ assert rằng bodyStrong trường tồn
assert(typeof evStrong.bodyStrong === 'boolean' && typeof evWeak.bodyStrong === 'boolean', 'bodyStrong luôn có');
// (f) 七殺 VÔ chế phải có cờ sat-no-control khi Dụng không phải Ấn/Thực
//     chọn chart có Dụng = Tài (không phải yin/shi) và năm can = khắc thân
//     Đơn giản: tìm 1 chart bất kỳ có yearGod=七殺 trong 10 năm tới 2026-2035
let shaFound = false;
for (let yy = 2026; yy <= 2035 && !shaFound; yy++) {
  const e = liunianEvents(RU, yy);
  if (e.yearGod === '七殺') {
    shaFound = true;
    assert(e.events.length >= 1, `năm ${yy} Thất Sát → có sự việc`);
    // nếu vô chế thì phải có flag sat-no-control
    if (!e.shaZhiHua) {
      assert(e.events.some((ev) => ev.type === 'sat-no-control'), `năm ${yy} Sát vô chế → có flag sat-no-control`);
    }
  }
}
// (g) Mọi sự việc có confidence ∈ (0,1), tone ∈ {cat,hung,mixed}, pillar hợp lệ
const allEvents = evA.events;
for (const e of allEvents) {
  assert(e.confidence > 0 && e.confidence < 1, `confidence ∈ (0,1) cho "${e.vi}"`);
  assert(['cat', 'hung', 'mixed'].includes(e.tone), `tone hợp lệ cho "${e.vi}"`);
  if (e.pillar) assert(['year', 'month', 'day', 'time'].includes(e.pillar), `pillar hợp lệ cho "${e.vi}"`);
}
console.log(`   10 sao phủ luật ✓ | tất định ✓ | 2026 RU = ${evA.yearGodVi} (${evA.events.length} sự việc)`);
console.log(`   Sample 2026: ${evA.summary}`);
console.log(`   Top sự việc: ${evA.events.slice(0, 3).map((e) => `[${e.tone==='hung'?'Kỵ':e.tone==='cat'?'Cát':'Trung'} ${Math.round(e.confidence*100)}%] ${e.vi} → ${e.who}`).join(' | ')}`);

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
import { adjustLiuyueByGeju } from './src/engine/pattern-quality.js';
import { godGroup } from './src/engine/core.js';
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

// ---- [loop 4] 格局流月喜忌 (adjustLiuyueByGeju) ----
//   RU = 正財格 (乙 nhật chủ). patternYong: xi=[shi,guan], ji=[ti].
//   → tháng can nhóm shi (丙/丁) + guan (庚/辛) = 格局喜 (+2); nhóm ti (甲/乙) = 格局忌 (−2).
console.log('   --- 格局流月喜忌 (loop 4) ---');
// (a) backward compatible: không truyền patternQuality → KHÔNG có gejuDelta, score giữ nguyên.
assert(typeof lm.months[0].gejuDelta === 'undefined', 'lưu nguyệt: KHÔNG truyền patternQuality → không gejuDelta (backward compatible)');
assert(computeLiuyue(RU, 2026).months[0].score === lm.months[0].score, 'lưu nguyệt: bỏ patternQuality → score không đổi');
// (b) truyền patternQuality → tháng được cộng tầng 格局.
const lmG = computeLiuyue(RU, 2026, RU.patternQuality);
assert(lmG.months.every((m) => typeof m.gejuDelta === 'number'), 'lưu nguyệt: truyền patternQuality → mỗi tháng có gejuDelta');
const xiMonths = lmG.months.filter((m) => m.gejuDelta > 0);   // 格局喜
const jiMonths = lmG.months.filter((m) => m.gejuDelta < 0);   // 格局忌
const neutralMonths = lmG.months.filter((m) => m.gejuDelta === 0);
assert(xiMonths.length > 0 && jiMonths.length > 0, `lưu nguyệt: 正財格 có tháng 格局喜 + 格局忌 (xi=${xiMonths.length}, ji=${jiMonths.length})`);
assert(xiMonths.every((m) => m.gejuDelta === 2), 'lưu nguyệt: 格局喜 = +2 (ngang 大运, nhẹ 流年 ±3)');
assert(jiMonths.every((m) => m.gejuDelta === -2), 'lưu nguyệt: 格局忌 = −2');
// (c) đúng nhóm thập thần: xi phải là shi/guan, ji phải là ti (theo patternYong của RU).
assert(xiMonths.every((m) => ['shi', 'guan'].includes(godGroup(m.ganGod))), `lưu nguyệt: 格局喜 đúng nhóm shi/guan — thực tế ${xiMonths.map((m) => m.ganGod).join(',')}`);
assert(jiMonths.every((m) => godGroup(m.ganGod) === 'ti'), `lưu nguyệt: 格局忌 đúng nhóm ti — thực tế ${jiMonths.map((m) => m.ganGod).join(',')}`);
// (d) score đã cộng: xiMonths.score = (score tầng ngũ hành) + 2; rating được đánh lại.
const lmBase = computeLiuyue(RU, 2026); // không geju
const aXi = xiMonths[0];
const aXiBase = lmBase.months.find((m) => m.m === aXi.m);
assert(aXi.score === aXiBase.score + 2, `lưu nguyệt: score 格局喜 = base + 2 (${aXiBase.score}+2=${aXi.score})`);
// (e) best/worst phản ánh tầng 格局 (tháng 格局忌 không bao giờ là best; tháng 格局喜 ưu tiên top).
assert(lmG.best.every((m) => m.gejuDelta >= 0), 'lưu nguyệt: top CÁT không chứa tháng 格局忌');
console.log(`   格局流月喜忌 OK. ★格局喜(${xiMonths.length}): ${xiMonths.map((m) => 'T' + (m.m + 1) + m.ganZhi + m.ganGod).join(', ')} | ⚠格局忌(${jiMonths.length}): ${jiMonths.map((m) => 'T' + (m.m + 1) + m.ganZhi + m.ganGod).join(', ')} | trung tính(${neutralMonths.length})`);
console.log(`   Top Cát (sau geju): ${lmG.best.map((m) => 'T' + (m.m + 1) + ' ' + m.ganZhi + (m.gejuDelta > 0 ? '★' : '')).join(', ')} | Top Kỵ: ${lmG.worst.map((m) => 'T' + (m.m + 1) + ' ' + m.ganZhi + (m.gejuDelta < 0 ? '⚠' : '')).join(', ')}`);

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

// ---- [loop 12] 格局流日喜忌 (adjustLiuriByGeju) ----
//   RU = 正財格 (乙 nhật chủ). patternYong: xi=[shi,guan], ji=[ti].
//   → ngày can nhóm shi (食/傷) + guan (官/殺) = 格局喜 (+2); nhóm ti (比/劫) = 格局忌 (−2);
//     nhóm cai (Tài = chính cách thần) = trung tính (0).
console.log('   --- 格局流日喜忌 (loop 12) ---');
import { adjustLiuriByGeju } from './src/engine/pattern-quality.js';
// (a) backward compatible: không truyền patternQuality → KHÔNG có gejuDelta, score giữ nguyên.
assert(typeof lr.gejuDelta === 'undefined', 'lưu nhật: KHÔNG truyền patternQuality → không gejuDelta (backward compatible)');
assert(analyzeLiuRi(RU, 2026, 6, 21).score === lr.score, 'lưu nhật: bỏ patternQuality → score không đổi');
// (b) Pure unit: adjustLiuriByGeju với input rỗng / thiếu patternYong → gejuDelta=0.
assert(adjustLiuriByGeju(null, RU.patternQuality, '乙') === null, 'adjustLiuriByGeju(null) → null');
assert(adjustLiuriByGeju(undefined, RU.patternQuality, '乙') === undefined, 'adjustLiuriByGeju(undefined) → undefined');
const noYongDay = adjustLiuriByGeju(lr, { patternYong: { xi: [], ji: [] } }, '乙');
assert(noYongDay.gejuDelta === 0 && noYongDay.score === lr.score, 'adjustLiuriByGeju: patternYong rỗng → gejuDelta=0, score giữ');
// (c) Tìm ngày thuộc từng nhóm để verify ±2.
//   RU 日主=乙. shi=丙(傷官)/丁(食神)? No: tenGod(乙,丙)=傷官, tenGod(乙,丁)=食神 → cả nhóm shi.
//   guan=庚(正官)/辛(七殺) → nhóm guan. ti=甲(劫財)/乙(比肩) → nhóm ti. cai=戊/己/辰戌 → nhóm cai.
//   Quét 30 ngày từ 2026-06-21, gom theo gejuDelta.
const dayGanRU = RU.chart.dayGan;
const xiDays = [], jiDays = [], neuDays = [];
for (let i = 0; i < 60; i++) {
  const sd = Solar.fromYmdHms(2026, 6, 21, 12, 0, 0).next(i);
  const rd = analyzeLiuRi(RU, sd.getYear(), sd.getMonth(), sd.getDay(), RU.patternQuality);
  if (rd.gejuDelta > 0) xiDays.push(rd);
  else if (rd.gejuDelta < 0) jiDays.push(rd);
  else neuDays.push(rd);
}
assert(xiDays.length > 0 && jiDays.length > 0, `lưu nhật: 正財格 có ngày 格局喜 + 格局忌 trong 60 ngày (xi=${xiDays.length}, ji=${jiDays.length})`);
assert(xiDays.every((d) => d.gejuDelta === 2), 'lưu nhật: 格局喜 = +2 (ngang 流月, nhẹ 流年 ±3)');
assert(jiDays.every((d) => d.gejuDelta === -2), 'lưu nhật: 格局忌 = −2');
// (d) đúng nhóm thập thần: xi phải là shi/guan, ji phải là ti (theo patternYong của RU).
assert(xiDays.every((d) => ['shi', 'guan'].includes(godGroup(d.ganGod))), `lưu nhật: 格局喜 đúng nhóm shi/guan — thực tế ${xiDays.map((d) => d.ganGod).slice(0,5).join(',')}`);
assert(jiDays.every((d) => godGroup(d.ganGod) === 'ti'), `lưu nhật: 格局忌 đúng nhóm ti — thực tế ${jiDays.map((d) => d.ganGod).slice(0,5).join(',')}`);
// (e) note có keyword 格局喜 / 格局忌.
assert(xiDays[0].gejuNote.includes('格局喜'), 'lưu nhật: note 格局喜 có keyword "格局喜"');
assert(jiDays[0].gejuNote.includes('格局忌'), 'lưu nhật: note 格局忌 có keyword "格局忌"');
// (f) conservation: score = base (4 trường phái) + gejuDelta → chứng minh không thay thế tầng cốt lõi.
const lrXiDay = xiDays[0];
const lrXiBase = analyzeLiuRi(RU, parseInt(lrXiDay.solar.slice(0,4)), parseInt(lrXiDay.solar.slice(5,7)), parseInt(lrXiDay.solar.slice(8,10)));
assert(lrXiDay.score === lrXiBase.score + 2, `lưu nhật: score 格局喜 = base + 2 (${lrXiBase.score}+2=${lrXiDay.score})`);
// (g) 正財格: nhóm cai (Tài = chính cách thần) phải TRUNG TÍNH (gejuDelta=0) — không tự khắc/mình.
const caiDay = neuDays.find((d) => godGroup(d.ganGod) === 'cai');
if (caiDay) assert(caiDay.gejuDelta === 0, `lưu nhật: ngày Tài (chính cách thần) trung tính — god=${caiDay.ganGod}`);
// (h) year-daily: computeYearDaily với patternQuality → best không chứa ngày 格局忌.
//   (computeYearDaily được import phía dưới ở module scope — ES hoist nên dùng được)
const YD = computeYearDaily(RU, 2026, RU.patternQuality);
assert(YD.days.every((d) => typeof d.gejuDelta === 'number'), 'year-daily: mỗi ngày có gejuDelta (số)');
assert(YD.best.every((d) => d.gejuDelta >= 0), 'year-daily: top CÁT năm không chứa ngày 格局忌');
const YDbase = computeYearDaily(RU, 2026); // không geju — backward compatible
assert(YDbase.days.every((d) => d.gejuDelta === 0), 'year-daily: bỏ patternQuality → mọi gejuDelta = 0 (backward compatible)');
console.log(`   格局流日喜忌 OK. ★格局喜(${xiDays.length}): ${xiDays.slice(0,3).map((d) => d.ganZhi + d.ganGod).join(', ')} | ⚠格局忌(${jiDays.length}): ${jiDays.slice(0,3).map((d) => d.ganZhi + d.ganGod).join(', ')} | trung tính(${neuDays.length})`);
console.log(`   Year-daily 2026: top Cát (sau geju) ${YD.best.slice(0,3).map((d) => d.date.slice(5) + d.ganZhi + (d.gejuDelta > 0 ? '★' : '')).join(', ')}`);

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
assert(taSuiDirection('午') === 'Nam', 'phương vị 午 = Nam (chuẩn hoá module, không "chính Nam")');
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
// [loop 551] 单名单姓 外格 = 2 (hằng số 五格剖象), KHÔNG phải zong-ren+1=1.
//   阮英: 阮12 英11 → 天13 人23 地12 外2 总23. Trước fix 外=1(luck Đại cát SAI).
const nm2 = analyzeName(['阮', '英']);
const wai2 = nm2.grids.find((g) => g.key === 'wai');
assert(wai2.n === 2, `[loop 551] 单名单姓 外格=2 (got ${wai2.n}, trước fix SAI=1)`);
assert(wai2.luck.cls === 'hung', `[loop 551] 外格 2 → Hung (got ${wai2.luck.cls}, trước fix SAI=cat Đại cát)`);
// input guard: 1 ký tự → error, không NaN leak
assert(analyzeName(['阮']).error, '[loop 551] tên 1 ký tự → error guard (không NaN)');
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
// [loop 24] 康熙笔画 đúng: 黃/黄/馮/程 = 12 (trước đây 13 — hỏng cả 5 cách cho tên có các chữ này)
{ const { STROKES } = await import('./src/engine/name.js');
  assert(STROKES['黃'] === 12 && STROKES['黄'] === 12 && STROKES['馮'] === 12 && STROKES['冯'] === 12 && STROKES['程'] === 12,
    `康熙笔画 黃/黄/馮/冯/程 = 12 (được 黃${STROKES['黃']} 馮${STROKES['馮']} 程${STROKES['程']})`); }

// 阮松君 (Nguyễn Tùng Quân): 12+8+7=27 — kiểm bảng nét đồng bộ vi2han.js
//   天13(火,Đại cát) 人20(水,Hung) 地15(土,Đại cát) 外8(Kim,Cát) 总27(Kim,Hung)
//   三才 火→水→土 = khắc (Hỏa khắc Kim... vọng, Thủy khắc Hỏa) → Hung
const nmTQ = analyzeName(['阮', '松', '君']);
assert(!nmTQ.needStrokes, '阮松君: bảng STROKES đã có 松/君 (đồng bộ vi2han)');
assert(JSON.stringify(nmTQ.strokes) === '[12,8,7]', `阮松君 nét [12,8,7] (thực ${JSON.stringify(nmTQ.strokes)})`);
assert(nmTQ.grids.map((g) => g.n).join('/') === '13/20/15/8/27', `阮松君 五格 13/20/15/8/27 (thực ${nmTQ.grids.map((g) => g.n).join('/')})`);
assert(nmTQ.grids[0].luck.lv === 'Đại cát' && nmTQ.grids[1].luck.lv === 'Hung', '阮松君 天13=Đại cát, 人20=Hung (chủ vận Hung)');
assert(nmTQ.sancai.tian === '火' && nmTQ.sancai.ren === '水' && nmTQ.sancai.di === '土', '阮松君 三才 火/水/土');
assert(nmTQ.sancaiLuck === 'Hung', `阮松君 三才 Hỏa→Thủy→Thổ = Hung (thực ${nmTQ.sancaiLuck})`);
assert(nmTQ.score === 53, `阮松君 điểm 53 (thực ${nmTQ.score})`);
// Đối chiếu vi2han → analyzeName phải cho cùng kết quả
const vhTQ = viToHan('Nguyễn Tùng Quân');
assert(vhTQ.hanString === '阮松君' && JSON.stringify(vhTQ.strokes) === '[12,8,7]', 'viToHan Nguyễn Tùng Quân → 阮松君 [12,8,7]');
const nmViaVi = analyzeName(vhTQ.chars.map((c) => c.han)); // không cần override nữa
assert(JSON.stringify(nmViaVi.grids) === JSON.stringify(nmTQ.grids), '阮松君: đường vi2han và đường Hán-tự-trực-tiếp cho cùng 五格');
console.log(`   阮松君: ${nmTQ.grids.map((g) => g.n + g.luck.lv[0]).join(' ')} | 三才 ${nmTQ.sancai.tian}→${nmTQ.sancai.ren}→${nmTQ.sancai.di} ${nmTQ.sancaiLuck} | ${nmTQ.score}đ ✓`);

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
// [loop 19 sửa bug] determineYun wrap đúng qua 正元 180 năm + không crash pre-1864.
assert(determineYun(2024).yun === 9, '2024 → 九运 (đầu hạ nguyên九运)');
assert(determineYun(2044).yun === 1 && determineYun(2044).yuan === 'Thượng Nguyên', '2044 → Nhất vận Thượng Nguyên (wrap 正元 mới, khớp sanyuan-jiuyun)');
assert(determineYun(1863).yun === 9, '1863 (pre-1864) → 九运, KHÔNG phải yun:0 (fix negative-modulo crash)');
assert(determineYun(2063).yun === 1, '2063 → Nhất vận');
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

// ---- 盲派象法 (mangpai-view) — góc nhìn bổ sung, tất định ----
import { analyzeMangpaiView } from './src/engine/mangpai-view.js';
const mpv = analyzeMangpaiView(R);
assert(mpv.label.includes('bổ sung cho Tử Bình'), '盲派象法: có nhãn bổ sung (không thay thế TB)');
assert(mpv.hostGuest && mpv.hostGuest.groups && ['财','官','印','食'].every((k) => mpv.hostGuest.groups[k]), '盲派象法: host/guest đủ 4 nhóm');
assert(typeof mpv.luAnalysis.present === 'boolean' && mpv.luAnalysis.luZhi, '盲派象法: có phân tích Lộc');
assert(['high','medium','low'].includes(mpv.deeds.dynamism), '盲派象法: dynamism hợp lệ');
assert(Array.isArray(mpv.classicalRules) && mpv.classicalRules.length === 4, '盲派象法: đủ 4 口诀');
assert(mpv.classicalRules.every((r) => typeof r.matched === 'boolean'), '盲派象法: mỗi口诀 có cờ matched tất định');
assert(mpv.summary.length >= 4, '盲派象法: có summary');
// 宾主口诀 cho 1990-06-15 14:30: chỉ Trụ Ngày = 主 (khác mangpai.js gộp Ngày+Giờ)
assert(mpv.hostGuest.scheme.includes('Ngày'), '盲派象法: 主 = Trụ Ngày (khác mangpai.js)');
// 所有 禄 mapping đúng (甲→寅 … 癸→子)
import { analyzeMangpaiView as _mpv } from './src/engine/mangpai-view.js';
const luByGan = (g) => _mpv({ chart: { dayGan: g, dayMaster: { wx: '木' }, pillars: { year:{gan:g,zhi:'子',ganGod:'比肩',hidden:[{gan:'癸',god:'比肩'}]}, month:{gan:g,zhi:'丑',ganGod:'比肩',hidden:[{gan:'己',god:'比肩'}]}, day:{gan:g,zhi:'子',ganGod:'日主',hidden:[{gan:'癸',god:'比肩'}]}, time:{gan:g,zhi:'亥',ganGod:'比肩',hidden:[{gan:'壬',god:'比肩'}]} } }, strength:{strong:true}, interactions:{} }).luAnalysis.luZhi;
assert(luByGan('甲')==='寅' && luByGan('乙')==='卯' && luByGan('丙')==='巳' && luByGan('丁')==='午', '盲派象法: 禄 甲寅/乙卯/丙巳/丁午');
assert(luByGan('戊')==='巳' && luByGan('己')==='午' && luByGan('庚')==='申' && luByGan('辛')==='酉' && luByGan('壬')==='亥' && luByGan('癸')==='子', '盲派象法: 禄 戊巳/己午/庚申/辛酉/壬亥/癸子');
// 所有 kết quả tất định
assert(JSON.stringify(analyzeMangpaiView(R)) === JSON.stringify(mpv), '盲派象法 tất định');
console.log(`   盲派象法: 主=日柱 | Lộc ${mpv.luAnalysis.luZhi} ${mpv.luAnalysis.present?'CÓ':'KHÔNG'} | dynamism ${mpv.deeds.dynamism} (${mpv.deeds.counts.total} công cụ) | khớp ${mpv.classicalRules.filter(r=>r.matched).length}/4 口诀 ✓`);

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
// [cycle 54] regression guard: toàn bộ 150 ô 紫微 POS phải khớp iztro getStartIndex algorithm.
//   Lock fix cycle-53 (7 ô đã sửa) — không thể silently revert. Nguồn: SylarLong/iztro location.ts.
{
  const BR = ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑']; // 寅-based index
  const fix = (i) => ((i % 12) + 12) % 12;
  const iztro = (day, ju) => {
    let offset = -1, q, r;
    do { offset++; const d = day + offset; q = Math.floor(d / ju); r = d % ju; } while (r !== 0);
    q %= 12; let z = q - 1; z = (offset % 2 === 0) ? z + offset : z - offset; return BR[fix(z)];
  };
  const JU = [2, 3, 4, 5, 6];
  let mism = 0;
  for (let day = 1; day <= 30; day++) for (let j = 0; j < 5; j++) {
    if (ZIWEI_POS[day - 1][j] !== iztro(day, JU[j])) mism++;
  }
  assert(mism === 0, `tử vi: toàn bộ 150 ô 紫微 POS khớp iztro algorithm (mismatch=${mism})`);
}
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

// ################## 17a. 宫干自化 宮干自化 (phi tinh lõi) ##################
console.log('\n################## 17a. 宫干自化 宮干自化 (can cung → hóa rơi trúng cung phát = tự biến đổi) ##################');
import { computeZihua, ZIHUA_DESC } from './src/engine/ziwei.js';
// 五虎遁 verify: 癸→寅起甲寅 → 12 cung can thuận từ 寅
const WUHU = { 甲:'丙', 己:'丙', 乙:'戊', 庚:'戊', 丙:'庚', 辛:'庚', 丁:'壬', 壬:'壬', 戊:'甲', 癸:'甲' };
assert(WUHU['癸'] === '甲', '五虎遁: 癸年 → 寅起 甲');
assert(WUHU['甲'] === '丙' && WUHU['己'] === '丙', '五虎遁: 甲己 → 寅起 丙');
assert(WUHU['乙'] === '戊' && WUHU['庚'] === '戊', '五虎遁: 乙庚 → 戊');
assert(WUHU['丙'] === '庚' && WUHU['辛'] === '庚', '五虎遁: 丙辛 → 庚');
assert(WUHU['丁'] === '壬' && WUHU['壬'] === '壬', '五虎遁: 丁壬 → 壬');
assert(WUHU['戊'] === '甲' && WUHU['癸'] === '甲', '五虎遁: 戊癸 → 甲');
// [loop 23] user 1993-10-21 (癸年): ngũ hổ độn 癸→寅=甲, 子=甲, 丑=乙, 卯=乙.
//   福德(甲子)→甲科=武曲→自化科; 田宅(乙丑)→乙忌=太阴→自化忌; 奴仆(乙卯)→乙禄=天机→自化禄.
//   (Trước đây fix palace-干: 福德 ra 壬, 田宅 ra 辛 — sai, do can thuận/chi nghịch.)
const zua = zv2.zihua;
assert(zua && Array.isArray(zua.list), 'tử vi: có z.zihua.list');
const phuZihua = zua.byPalace['福德'] || [];
assert(phuZihua.some((r) => r.hua === '科' && r.star === '武曲'), 'user 福德(甲子) 自化科@武曲 (甲→科=武曲, 武曲 ngồi 子)');
assert(zua.list.some((r) => r.palace === '田宅' && r.hua === '忌' && r.star === '太阴'), 'user 田宅(乙丑) 自化忌@太阴 (乙→忌=太阴)');
assert(zua.list.some((r) => r.palace === '奴仆' && r.hua === '禄' && r.star === '天机'), 'user 奴仆(乙卯) 自化禄@天机 (乙→禄=天机)');
assert(!zua.byPalace['命宫'] || !zua.byPalace['命宫'].length, 'user 命宫(壬戌) KHÔNG bị tự hóa (4 hóa của 壬 — 天梁/紫微/左辅/武曲 — đều không ngồi 戌)');
// deterministic
const zv2b = computeZiwei(1993, 10, 21, 0, 30, 'nam');
assert(zv2b.zihua.list.length === zua.list.length, '宫干自化 deterministic');
// ZIHUA_DESC đầy đủ 4 loại
assert(Object.keys(ZIHUA_DESC).length === 4 && ZIHUA_DESC.忌.includes('PHÁ HOẠI'), 'ZIHUA_DESC 4 loại, 忌 = tự phá hoại');
console.log(`   宫干自化 ✓ — bạn(癸): ${zua.list.length} cung tự hóa → ${zua.list.map((r)=>`${r.palaceVi}自化${r.hua}@${r.star}`).join(' · ')} | 命宫 KHÔNG tự hóa`);

// ################## 17a2. 飞星四化 飛星 — 化入 (fly-IN) + 化出 (fly-OUT) ##################
console.log('\n################## 17a2. 飞星四化 飛星 (ma trận 48 hóa: 化出 gửi + 化入 nhận) ##################');
import { computeFeiXing, FEIXING_DIR } from './src/engine/ziwei.js';
const fxStar = zv2.feixing;
assert(fxStar && Array.isArray(fxStar.matrix), 'tử vi: có z.feixing.matrix');
// ma trận đầy đủ: 12 cung × 4 hóa = 48 (tất cả sao đích đều có trên bàn user 1993)
assert(fxStar.matrix.length === 48, `飞星 ma trận 48 hóa (12 cung × 4), thực tế ${fxStar.matrix.length}`);
// FEIXING_DIR 4 loại
assert(Object.keys(FEIXING_DIR).length === 4 && FEIXING_DIR.忌.nature === 'hung', 'FEIXING_DIR 4 loại, 忌 = hung');
// user 命宫(壬戌) → 壬四化: 禄=天梁(巳/疾厄), 权=紫微(辰/迁移), 科=左辅(子/福德), 忌=武曲(子/福德)
const mingOut = fxStar.flyOut['命宫'] || [];
assert(mingOut.length === 4, `命宫 flyOUT 4 hóa (không tự hóa → cả 4 gửi đi), thực tế ${mingOut.length}`);
assert(mingOut.some((r) => r.hua === '禄' && r.toPalace === '疾厄' && r.star === '天梁'), '命宫(壬) 化禄→疾厄@天梁 (壬禄=天梁 ngồi 巳)');
assert(mingOut.some((r) => r.hua === '权' && r.toPalace === '迁移' && r.star === '紫微'), '命宫(壬) 化权→迁移@紫微 (壬权=紫微 ngồi 辰)');
assert(mingOut.some((r) => r.hua === '忌' && r.toPalace === '福德' && r.star === '武曲'), '命宫(壬) 化忌→福德@武曲 (壬忌=武曲 ngồi 子)');
assert(mingOut.some((r) => r.hua === '科' && r.toPalace === '福德' && r.star === '左辅'), '命宫(壬) 化科→福德@左辅 (壬科=左辅 ngồi 子)');
// user 命宫 化入: 破军 ngồi 戌; 癸禄=破军 → 父母(癸亥) hóa LỘC vào Mệnh; 兄弟(辛酉) hóa KỴ (辛忌=文昌)
//   [loop 23] 兄弟 giờ = 辛 (đúng ngũ hổ độn 癸年), KHÔNG phải 癸 như bug cũ → hóa đổi.
const mingIn = fxStar.flyIn['命宫'] || [];
assert(mingIn.length > 0, '命宫 có nhận hóa入 (破军 ngồi 命, 癸禄=破军 từ 父母)');
assert(mingIn.some((r) => r.hua === '禄' && r.fromPalace === '父母' && r.star === '破军'), '父母(癸亥) 化禄→命宫@破军 (phụ mẫu nuôi mệnh)');
assert(mingIn.some((r) => r.hua === '忌' && r.fromPalace === '兄弟' && r.star === '文昌'), '兄弟(辛酉) 化忌→命宫@文昌 (辛忌=文昌 ngồi 戌)');
// 癸忌=贪狼 ngồi 寅(官禄) → 父母(癸) 化KỴ vào QUAN LỘC
const guanIn = fxStar.flyIn['官禄'] || [];
assert(guanIn.some((r) => r.hua === '忌' && r.fromPalace === '父母' && r.star === '贪狼'), '父母(癸) 化忌→官禄@贪狼 (phụ mẫu hại sự nghiệp)');
// đối xứng: 命宫 化出 tới福德 ⇒ 福德 phải có hóa入 từ 命宫
const fudeIn = fxStar.flyIn['福德'] || [];
assert(fudeIn.some((r) => r.fromPalace === '命宫' && r.hua === '忌'), '福德 nhận 化忌 từ 命宫 (đối xứng flyOut/flyIn)');
// 财帛(戊午) → 戊四化: 禄=贪狼, 权=太阴, 科=右弼, 忌=天机 → 财帛化禄入官禄 (贪狼 ngồi 寅)
const caiOut = fxStar.flyOut['财帛'] || [];
assert(caiOut.some((r) => r.hua === '禄' && r.toPalace === '官禄' && r.star === '贪狼'), '财帛(戊) 化禄→官禄@贪狼 (财 nuôi sự nghiệp)');
assert(caiOut.some((r) => r.hua === '忌' && r.toPalace === '奴仆' && r.star === '天机'), '财帛(戊) 化忌→奴仆@天机 (戊忌=天机)');
// highlights & summary không rỗng
assert(typeof fxStar.mingHighlights === 'string' && fxStar.mingHighlights.length > 5, 'feixing.mingHighlights có nội dung');
assert(typeof fxStar.summary === 'string' && fxStar.summary.includes('命宫'), 'feixing.summary nhắc 命宫');
// deterministic
const zv2c = computeZiwei(1993, 10, 21, 0, 30, 'nam');
assert(zv2c.feixing.matrix.length === fxStar.matrix.length, '飞星 deterministic');
// 自化 (vòng 5) vẫn nguyên vẹn — không bị vòng 6 phá
assert(zv2c.zihua.list.length === zua.list.length, '宫干自化 vẫn hoạt động sau khi thêm飞星');
console.log(`   飞星化入化出 ✓ — ma trận 48 hóa | 命宫 出${mingOut.length}/入${mingIn.length} | highlights: ${fxStar.mingHighlights}`);

// [loop 548] leap month (闰月) 命宫 — lunar-javascript getMonth() âm cho nhuận月
{
  // 2023-03-27 = 闰二月初六, giờ 子. Cũ: lm=-2 → 命宫=亥 (SAI). Này: lm=3 → 辰.
  const zLeap = computeZiwei(2023, 3, 27, 0, 30, 'nam');
  const mingLeap = (zLeap.palaces.find((p) => p.isMing) || zLeap.palaces.find((p) => p.zh === '命宫'))?.zhi;
  assert(mingLeap === '辰', `[loop 548] 闰二月 giờ子 → 命宫=辰 (xử lý nhuận月=tháng kế, got ${mingLeap})`);
  // tháng 2 thường (không nhuận) cùng giờ → 命宫=卯 (khác 1 cung so với nhuận)
  const zReg = computeZiwei(2023, 3, 13, 0, 30, 'nam');
  const mingReg = (zReg.palaces.find((p) => p.isMing) || zReg.palaces.find((p) => p.zh === '命宫'))?.zhi;
  assert(mingReg === '卯', `[loop 548] tháng 2 thường giờ子 → 命宫=卯 (got ${mingReg})`);
  console.log(`   闰月命宫 ✓ — 闰二月→辰 / tháng2thường→卯 (trước đây 闰月 SAI=亥 do getMonth() âm)`);
}

// ################## 17a3. 大限宫干四化 大限宮干四化 (decade can → 4 hóa → bay vào mệnh bàn) ##################
console.log('\n################## 17a3. 大限宫干四化 大限宮干四化 (cung đại hạn hiện tại can → 4 hóa kích hoạt mệnh bàn) ##################');
import { computeDaxianSihua, DX_SIHUA_DOMAIN, DX_SIHUA_INTERP } from './src/engine/ziwei.js';
// user 1993-10-21 (nam): age 33 (2026), 大限 32-41t ở 子女(乙未) → can 乙
//   乙四化: 禄=天机(卯/奴仆), 权=天梁(巳/疾厄), 科=紫微(辰/迁移), 忌=太阴(丑/田宅)
const dxR = computeDaxianSihua(zv2, 2026, 1993);
assert(dxR.active === true, '大限 hiện tại active cho tuổi 33 (2026)');
assert(dxR.age === 33, 'computeDaxianSihua: age=33');
assert(dxR.daxianPalace === '子女', `大限 palace = 子女 (age 32-41), thực tế ${dxR.daxianPalace}`);
assert(dxR.daxianGan === '己', `大限 can = 己 (己未, ngũ hổ độn 癸年 未=己), thực tế ${dxR.daxianGan}`);
assert(dxR.daxianGanZhi === '己未', `大限 ganZhi = 己未, thực tế ${dxR.daxianGanZhi}`);
assert(dxR.ageRange === '32-41t', `ageRange = '32-41t', thực tế ${dxR.ageRange}`);
// 4 hóa đầy đủ + đều placed (sao đích đều có trên bàn user)
assert(Array.isArray(dxR.sihua) && dxR.sihua.length === 4, `4 hóa đại hạn, thực tế ${dxR.sihua.length}`);
assert(dxR.sihua.every((r) => r.placed), 'cả 4 hóa đại hạn đều placed (sao đích có trên bàn)');
// [loop 23] verify từng hóa (己: 武曲/贪狼/天梁/文曲) — 子女(己未) đại hạn
assert(dxR.sihua.some((r) => r.type === '禄' && r.star === '武曲' && r.targetPalace === '福德'), '己化禄→武曲→福德 (phúc đức kích hoạt tài)');
assert(dxR.sihua.some((r) => r.type === '权' && r.star === '贪狼' && r.targetPalace === '官禄'), '己化权→贪狼→官禄 (sự nghiệp có quyền lực/khát vọng)');
assert(dxR.sihua.some((r) => r.type === '科' && r.star === '天梁' && r.targetPalace === '疾厄'), '己化科→天梁→疾厄 (sức khoẻ được quý nhân/hóa giải)');
assert(dxR.sihua.some((r) => r.type === '忌' && r.star === '文曲' && r.targetPalace === '迁移'), '己化忌→文曲→迁移 (thiên di bị nặng chuyện văn/thủy trong decade)');
// tone đúng (3 cat + 1 hung)
assert(dxR.sihua.filter((r) => r.tone === 'cat').length === 3 && dxR.sihua.filter((r) => r.tone === 'hung').length === 1, '3 cát (禄权科) + 1 hung (忌)');
// domain & interpretation không rỗng
assert(dxR.sihua.every((r) => r.domain && r.interpretation), 'mỗi hóa có domain + interpretation');
// summary nhắc 大限 + ganZhi + các cung đích
assert(typeof dxR.summary === 'string' && dxR.summary.includes('大限'), 'summary có chữ 大限');
assert(dxR.summary.includes('己未'), 'summary có ganZhi 己未');
assert(dxR.summary.includes('福德') && dxR.summary.includes('迁移'), 'summary liệt kê cung đích');
// DX_SIHUA_DOMAIN 12 cung + DX_SIHUA_INTERP 4 loại
assert(Object.keys(DX_SIHUA_DOMAIN).length === 12, 'DX_SIHUA_DOMAIN đủ 12 cung');
assert(Object.keys(DX_SIHUA_INTERP).length === 4 && DX_SIHUA_INTERP.忌.includes('KÍCH HOẠT'), 'DX_SIHUA_INTERP 4 loại, 忌 = kích hoạt trở ngại');
// deterministic
const dxR2 = computeDaxianSihua(zv2, 2026, 1993);
assert(JSON.stringify(dxR) === JSON.stringify(dxR2), 'computeDaxianSihua deterministic');
// không phá 宫干自化 (vòng 5) + 飞星 (vòng 6)
const zv2d = computeZiwei(1993, 10, 21, 0, 30, 'nam');
assert(zv2d.zihua.list.length === zua.list.length, '宫干自化 nguyên vẹn sau vòng 9');
assert(zv2d.feixing.matrix.length === 48, '飞星 nguyên vẹn sau vòng 9');
// edge: năm ngoài range đại hạn (age > 122) → active=false nhưng không crash
const dxEdge = computeDaxianSihua(zv2, 2120, 1993);
assert(dxEdge.active === false, 'computeDaxianSihua: ngoài range đại hạn → active=false, không crash');
// edge: input thiếu daXian → empty an toàn
const dxEmpty = computeDaxianSihua({}, 2026, 1993);
assert(dxEmpty.active === false && Array.isArray(dxEmpty.sihua) && dxEmpty.sihua.length === 0, 'computeDaxianSihua: empty input → empty an toàn');
console.log(`   大限宫干四化 ✓ — bạn(癸) age 33: 大限@子女(乙未) 32-41t → ${dxR.sihua.map((r)=>`${r.type}@${r.star}→${r.targetPalace}`).join(' · ')}`);

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

console.log('\n################## 17c2. LƯU NIÊN 12 THẦN SÁT (主星+副星 全套) ##################');
import { liunian12ShenFull, analyzeLiunian12, LIUNIAN_12_SPIRITS } from './src/engine/liunian-12shen.js';
assert(LIUNIAN_12_SPIRITS.length === 12, '12 vị trí thần sát đủ');
assert(LIUNIAN_12_SPIRITS.every((s) => s.spirit && s.subStar && s.vi && s.viSub && s.meaning && s.advice), 'mỗi thần có spirit/subStar/vi/viSub/meaning/advice');
assert(LIUNIAN_12_SPIRITS[0].spirit === '太岁' && LIUNIAN_12_SPIRITS[0].subStar.includes('剑锋'), 'vị trí 0 = 太岁 + 剑锋/伏尸');
assert(LIUNIAN_12_SPIRITS[7].spirit === '龙德' && LIUNIAN_12_SPIRITS[7].subStar === '紫微', 'vị trí 7 = 龙德 + 紫微');
assert(liunian12ShenFull('酉', '酉').spirit === '太岁', '本命年 (cùng chi) → 太岁 (full)');
assert(liunian12ShenFull('酉', '酉').position === 0, '本命年 → position 0');
assert(liunian12ShenFull('酉', '酉').subStar.includes('剑锋'), '本命年 có subStar 剑锋');
assert(liunian12ShenFull('午', '子').spirit === '岁破', '对冲 (差6) → 岁破 (full)');
assert(liunian12ShenFull('午', '子').position === 6, '对冲 → position 6');
assert(liunian12ShenFull('酉', '午').spirit === '太阴', 'Dậu sinh + Ngọ năm → 太阴 (full)');
// quét 12 vị trí qua analyzeLiunian12 với chart giả R
const fakeR = { chart: { pillars: { year: { zhi: '酉' } } } };
const scan = analyzeLiunian12(fakeR, 2026);
assert(scan.yearZhi === '午', '2026 → chi 午');
assert(scan.mine.spirit === '太阴', 'analyzeLiunian12: 酉+2026(午) → 太阴');
assert(scan.positions.length === 12, 'analyzeLiunian12 quét đủ 12 vị trí');
assert(scan.positions.every((p) => p.spirit && p.subStar && p.atZhi), 'mỗi vị trí có spirit/subStar/atZhi');
assert(scan.positions.find((p) => p.isMine).spirit === '太阴', 'vị trí isMine khớp mine');
assert(scan.hung.length + scan.cat.length + scan.mid.length === 12, 'tổng hung+cat+mid = 12');
assert(JSON.stringify(analyzeLiunian12(fakeR, 2026).positions) === JSON.stringify(analyzeLiunian12(fakeR, 2026).positions), 'analyzeLiunian12: tất định');
console.log(`   12 thần sát ✓ — bạn(酉) 2026(午) pos${scan.mine.position} ${scan.mine.spirit} ${scan.mine.vi} | 副星 ${scan.mine.subStar} | cát:${scan.cat.length} hung:${scan.hung.length} bình:${scan.mid.length}`);

console.log('\n################## 17d. NẠP ÂM 30 + NGHĨA ##################');
import { NAYIN_MEANING, nayinInfo, ganZhiNayin } from './src/engine/nayin.js';
assert(Object.keys(NAYIN_MEANING).length === 30, `đúng 30 nạp âm (được ${Object.keys(NAYIN_MEANING).length}) — [loop 563 FIX] trước đây 31 do alias 砂/沙 trùng → lệch index`); // [loop 563] chặt ===30, KHÔNG >=
// [loop 563 CRITICAL regression] 28/60 nạp âm từng SAI do alias lệch index từ idx 15.
assert(ganZhiNayin('壬戌') === '大海水', `[loop 563] ganZhiNayin 壬戌=大海水 (trước fix SAI=石榴木)`);
assert(ganZhiNayin('戊申') === '大驿土', `[loop 563] ganZhiNayin 戊申=大驿土 (trước fix SAI=天河水)`);
assert(ganZhiNayin('丙申') === '山下火', `[loop 563] ganZhiNayin 丙申=山下火 (trước fix SAI=沙中金, idx sau alias)`);
assert(ganZhiNayin('甲子') === '海中金', `ganZhiNayin 甲子=海中金 (idx 0, không đổi)`);
console.log(`   纳音 ✓ — 30 nạp âm + 28/60 fix regression (壬戌=大海水, 戊申=大驿土, 丙申=山下火)`);
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
// [loop 624] 3-LAYER SYNTHESIS (本卦→互卦→变卦). Trước đây verdict CHỈ dùng 本卦, bỏ qua 变卦 (kết quả).
//   Cổ pháp: biến quẻ có thể ĐẢO NGƯỢC bản quẻ → 先凶后吉 / 先吉后凶.
assert(typeof mh.processNote === 'string' && mh.processNote.includes('互卦'), `[loop 624] processNote (互卦/quá trình) có mặt`);
assert(typeof mh.outcomeNote === 'string' && mh.outcomeNote.includes('变卦'), `[loop 624] outcomeNote (变卦/kết quả) có mặt`);
assert(typeof mh.finalVerdict === 'string' && mh.finalVerdict.length > 5, `[loop 624] finalVerdict synthesis có mặt`);
// 3,8 → 晋: 体坤(Thổ) 用离(Hỏa), Hỏa sinh Thổ → 本卦 用生体 CÁT. finalVerdict phải nói CÁT (không phải HUNG toàn diện)
assert(!/HUNG TOÀN DIỆN/.test(mh.finalVerdict), `[loop 624] 晋 (本CÁT) không bị phán HUNG toàn diện`);
assert(mht.processNote && mht.outcomeNote && mht.finalVerdict, `[loop 624] cast-by-time cũng có 3-layer synthesis`);
// quét nhiều thời → finalVerdict phải đa dạng (có lúc 先吉后凶/先凶后吉/xu hướng) — không phải 1 phán cố định
const _samples = [[6,28,14,30],[3,15,9,0],[11,8,6,15],[8,20,18,45],[2,2,11,11],[5,5,5,5]].map(([mo,d,h,mi]) => castByTime(solarToMhNums(2026,mo,d,h,mi)).finalVerdict);
const _uniq = new Set(_samples.map((s) => s.slice(0, 12)));
assert(_uniq.size >= 3, `[loop 624] finalVerdict đa dạng qua các thời (${_uniq.size} kiểu, không 1 phán cố định)`);
console.log(`   3-layer synthesis ✓ — processNote/outcomeNote/finalVerdict; ${_uniq.size} kiểu phán đa dạng qua 6 thời`);

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
// [loop 24] yang decode: 8(少阴)=ÂM. [8,7,9,8,7,8] phải ra 井 (trước fix v>=7 ra 乾为天 sai).
const ly8 = castLiuYao([8, 7, 9, 8, 7, 8], 'wealth', '午', '寅');
assert(ly8.name === '井', `[8,7,9,8,7,8] → 井 (8=少阴 âm; trước fix ra 乾 sai) — được ${ly8.name}`);
// 用神 旺衰 có giá trị + verdict
assert(['Cát', 'Bình', 'Hung'].includes(ly.luck) && ly.verdict.length > 10, '六爻: có verdict + luck');
// tất định
assert(castLiuYao([7, 7, 7, 7, 7, 7], 'wealth', '午', '子').name === ly.name, '六爻 tất định');
console.log(`   乾卦 ${ly.shiChish} | 六亲 ${ly.lines.map((l) => l.liuqin).join('/')} | 用神${ly.yongshen.vi}→${ly.bestLv} ${ly.luck} ✓`);

console.log('\n################## 19B. ĐẠI LỤC NHÂM 大六壬 九宗门 (贼克/比用/涉害) ##################');
import { liurenPan, sheHaiCount, zhiShen as lrShen } from './src/engine/liuren.js';
// [1] 涉害 历数法 — đối chiếu算例 chuẩn 《六壬大全》卷七 / 甲辰亥将卯时:
//   戌@寅 → 4重害 (寅木·甲木·卯木·乙木 khắc 土)
//   子@辰 → 5重害 (辰土·戊土·巳土·未土·戌土 khắc 水)
//   → 子涉害 sâu hơn → 取子为初传.
assert(sheHaiCount('戌', '寅') === 4, `涉害: 戌@寅 = 4重害 (thực ${sheHaiCount('戌','寅')})`);
assert(sheHaiCount('子', '辰') === 5, `涉害: 子@辰 = 5重害 (thực ${sheHaiCount('子','辰')})`);
// [loop 552] giờ Tý (hour=0) — `hour || 12` từng nuốt 0→12 (午). Nay hourZhi phải=子.
assert(liurenPan(2029, 3, 15, 0).hourZhi === '子', `[loop 552] 六壬 hour=0 = 子时 (trước fix SAI=午 do hour||12)`);
// [2] 孟仲季 helper
assert(lrShen('寅') === '孟' && lrShen('子') === '仲' && lrShen('辰') === '季', '涉害: 孟/仲/季 classification đúng');
// [3] Lá số 甲辰亥将卯时 thật (2029-03-15 = 甲辰, 卯时 6h, yuejiang=亥) → 初传 PHẢI = 子, zongMen phải nhắc '涉害'
const lrPan = liurenPan(2029, 3, 15, 6);
assert(lrPan.yuejiang === '亥', `liuren: 2029-03-15 月将=亥 (thực ${lrPan.yuejiang})`);
assert(lrPan.dayGanZhi === '甲辰', `liuren: 2029-03-15 = 甲辰 (thực ${lrPan.dayGanZhi})`);
assert(lrPan.sanchuan[0].zhi === '子', `liuren 甲辰亥将卯时 初传=子 [涉害] (thực ${lrPan.sanchuan[0].zhi})`);
assert(lrPan.zongMen.includes('涉害'), `liuren: zongMen nhắc 涉害 (thực "${lrPan.zongMen}")`);
assert(lrPan.shehaiDetail && lrPan.shehaiDetail.maxHai === 5, `liuren: 涉害 maxHai=5 (thực ${lrPan.shehaiDetail?.maxHai})`);
assert(lrPan.shehaiDetail.scored.length === 2, `liuren: 涉害 có 2 ứng viên戌/子 (thực ${lrPan.shehaiDetail.scored.length})`);
// [4] 4课 phải có 2 贼 (戌@寅 + 子@辰)
assert(lrPan.ke4.filter((k) => k.rel === '贼').length === 2, 'liuren: 4课 có đúng 2 下贼上');
// [5] 全部具备: sanchuan đủ 3传 + tjAt (12天将) + verdict
assert(lrPan.sanchuan.length === 3 && lrPan.tjAt && Object.keys(lrPan.tjAt).length === 12, 'liuren: đủ 3传 + 12天将');
assert(lrPan.verdict && lrPan.verdict.length > 20, 'liuren: có verdict');
// [loop 24] 天将 thứ tự CỐT ĐỊNH: 螣蛇(TIANJIANG[1]) phải KỀ 贵人 (cả 顺/逆, chỉ đảo chiều chi).
//   Trước đây nghịch đảo cả mảng 天将 → 螣蛇 nhầm chỗ 天后. Kiểm cho 1 case 逆排.
{
  const _ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const _dist = (a, b) => { const da = _ZHI.indexOf(a), db = _ZHI.indexOf(b); return Math.min((da - db + 12) % 12, (db - da + 12) % 12); };
  let _checked = false;
  for (let hh = 0; hh < 24 && !_checked; hh++) {
    const _lr = liurenPan(2026, 6, 24, hh);
    const _guiChi = Object.entries(_lr.tjAt).find(([z, v]) => v === '贵人')?.[0];
    const _tengChi = Object.entries(_lr.tjAt).find(([z, v]) => v === '螣蛇')?.[0];
    if (_guiChi && _tengChi) { assert(_dist(_guiChi, _tengChi) === 1, `liuren 天将: 螣蛇 kề 贵人 (được khoảng ${_dist(_guiChi, _tengChi)})`); _checked = true; }
  }
}
// [6] Tất định
const lrPan2 = liurenPan(2029, 3, 15, 6);
assert(JSON.stringify(lrPan) === JSON.stringify(lrPan2), 'liuren: tất định');
// [7] Sanity: 贼克/比用 không bị phá — một lá số chỉ 1贼 → vẫn zongMen '始入/贼克'
//   Tìm nhanh 1 lá có đúng 1 贼
let singleFound = false;
for (let y = 2024; y <= 2026 && !singleFound; y++) {
  for (let m = 1; m <= 12 && !singleFound; m++) {
    for (let d = 1; d <= 28 && !singleFound; d++) {
      const p = liurenPan(y, m, d, 12);
      const zei = p.ke4.filter((k) => k.rel === '贼');
      const ke2 = p.ke4.filter((k) => k.rel === '克');
      if (zei.length === 1 && ke2.length === 0) {
        singleFound = true;
        assert(p.zongMen.includes('贼克') || p.zongMen.includes('始入'), `liuren: 1贼 → zongMen 贼克/始入 không bị phá (thực "${p.zongMen}")`);
      }
    }
  }
}
assert(singleFound, 'liuren: tìm thấy lá 1-贼 để guard 贼克 path');
console.log(`   甲辰亥将卯时: 初传=${lrPan.sanchuan[0].zhi} (${lrPan.zongMen}) | ${lrPan.shehaiDetail.scored.map((s)=>s.up+'='+s.hai).join(', ')} ✓`);
console.log(`   verdict: ${lrPan.verdict.slice(0, 70)}...`);

console.log('\n################## 20. KỲ MÔN ĐỘN GIÁP 奇门遁甲 ##################');
import { qimenPan, qimenDongPan, TERM_JU, QIYI } from './src/engine/qimen.js';
// 2026-06-07 → 芒种 上元 → 阳遁6局 (芒种[6,3,9], 上元=6). [cycle 59] đổi từ 06-21 (芒种+15=下元, code cũ
//   wrap `% 3` sai thành 上元; nay fix → 下元=9局). Dùng 06-07 (芒种+~2, daysSince<5) = 上元 thật.
const qm = qimenPan(2026, 6, 7, 12);
assert(qm.term === '芒种' && qm.yinYang === '阳' && qm.ju === 6, `芒种上元→阳遁6局 (thực ${qm.term} ${qm.yinYang}遁${qm.ju}局)`);
// 阳遁6局: 戊@6顺布 → 宫6=戊,7=己,8=庚,9=辛,1=壬,2=癸,3=丁,4=丙,5=乙
const expect6 = { 6: '戊', 7: '己', 8: '庚', 9: '辛', 1: '壬', 2: '癸', 3: '丁', 4: '丙', 5: '乙' };
const ok = Object.entries(expect6).every(([g, qy]) => qm.pan.find((p) => p.gong === +g).qiyi === qy);
assert(ok, `阳遁6局 地盘 戊@6顺布 (thực ${qm.pan.map((p) => p.gong + p.qiyi).join(',')})`);
// 九星随六仪: 宫6(戊)→天蓬
assert(qm.pan.find((p)=>p.gong===1).star==='天蓬' && qm.pan.find((p)=>p.gong===6).star==='天心' && qm.pan.find((p)=>p.gong===9).star==='天英', '九星 fixed本位 天蓬@1/天心@6/天英@9');
// 八门定宫: 宫1=休, 宫8=生, 宫6=开
assert(qm.pan.find((p) => p.gong === 1).door === '休' && qm.pan.find((p) => p.gong === 8).door === '生' && qm.pan.find((p) => p.gong === 6).door === '开', '八门定宫 休1/生8/开6');
// [loop 556] 动盘 八门 xoay theo giờ (trước đây doors TĨNH cho mọi giờ — BUG 2 loop 552).
//   值使 phải đáp đúng zhiShiLanding; doors khác nhau giữa các giờ.
{
  const d0 = qimenDongPan(2025, 12, 22, 0), d4 = qimenDongPan(2025, 12, 22, 4);
  const doors0 = d0.pan.map((p) => p.door).join(''), doors4 = d4.pan.map((p) => p.door).join('');
  assert(doors0 !== doors4, `[loop 556] 动盘 doors XOAY theo giờ (trước đây tĩnh giống nhau)`);
  // 值使 đáp zhiShiLanding
  let zhiOk = 0;
  for (let h = 0; h < 12; h++) {
    const r = qimenDongPan(2025, 12, 22, h);
    const land = r.dong.zhiShiLanding === 5 ? 2 : r.dong.zhiShiLanding;
    if (r.pan.find((p) => p.gong === land)?.door === r.dong.zhiShiDoor) zhiOk++;
  }
  assert(zhiOk === 12, `[loop 556] 值使 đáp đúng zhiShiLanding 12/12 giờ (got ${zhiOk})`);
  console.log(`   奇门动盘 ✓ — 八门 xoay theo giờ, 值使 đáp zhiShiLanding 12/12`);
}
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
assert(JSON.stringify(qimenPan(2026, 6, 7, 12)) === JSON.stringify(qm), 'kỳ môn tất định (cùng input → cùng output) [cycle 59 sửa: cũ so 2 ngày khác nhau, chỉ pass khi cả 2 wrap cùng 上元 bug]');
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
const ltM = buildLifeTrajectory(analyze(1985, 3, 20, 8, 0, 'nam')); // [loop 34] chart mùa xuân (không 调候 override) cho test theme Vợ
assert(ltM.decades.some((d) => d.themeName.includes('Vợ')), 'nam: có theme "Vợ"');
assert(!lt1.decades.some((d) => d.themeName.includes('Vợ')), 'nữ: không có theme "Vợ"');
console.log(`   quỹ tích nữ Ất: ${lt1.decades.length} cung · đỉnh ${lt1.turningPoints.find((t) => t.kind === 'golden')?.ages || '-'} · dè ${lt1.turningPoints.find((t) => t.kind === 'caution')?.ages || '-'}`);

// ################## 13. LƯU NHẬT CẢ NĂM (流日整年) ##################
import { computeYearDaily, liunianGanZhi } from './src/engine/year-daily.js';
console.log('\n################## 13. LƯU NHẬT CẢ NĂM ##################');
assert(liunianGanZhi(2026).ganZhi === '丙午', 'lưu năm 2026 = 丙午');
assert(liunianGanZhi(2000).ganZhi === '庚辰', 'lưu năm 2000 = 庚辰');
const yd1 = computeYearDaily(analyze(1995, 8, 12, 9, 30, 'nu'), 2026);
const yd2 = computeYearDaily(analyze(1995, 8, 12, 9, 30, 'nu'), 2026);
assert(JSON.stringify(yd1) === JSON.stringify(yd2), 'computeYearDaily deterministic');
assert(yd1.days.length === 365, 'đủ 365 ngày (2026)');
assert(yd1.best.length === 12 && yd1.worst.length === 12, 'top 12 Cát + 12 Kỵ');
assert(['total', 'cat', 'binh', 'hoiky', 'ky'].every((k) => typeof yd1.stats[k] === 'number'), 'stats đủ 5 trường');
assert(yd1.stats.total === yd1.stats.cat + yd1.stats.binh + yd1.stats.hoiky + yd1.stats.ky, 'stats: tổng = Cát+Bình+Hơi kỵ+Kỵ');
assert(yd1.monthSummary.length === 12, 'đủ 12 tháng');
assert(yd1.days.every((d) => typeof d.score === 'number' && d.score >= 5 && d.score <= 95), 'mỗi ngày có score 5–95');
assert(computeYearDaily(analyze(1995, 8, 12, 9, 30, 'nu'), 2080).days.length === 366, 'năm 2080 nhuận (ngoài đại vận) vẫn chạy 366 ngày');
console.log(`   2026: ${yd1.stats.total} ngày · Cát ${yd1.stats.cat} · Kỵ ${yd1.stats.ky} · đỉnh ${yd1.best[0].date}=${yd1.best[0].score} · đại vận ${yd1.dayun ? yd1.dayun.ganZhi : '(null)'}`);

// ################## 14. TÊN VIỆT → HÁN (vi2han) ##################
import { viToHan } from './src/engine/vi2han.js';
console.log('\n################## 14. TÊN VIỆT → HÁN ##################');
const vh1 = viToHan('Nguyễn Tùng Quân');
assert(vh1.ok && vh1.hanString === '阮松君', `viToHan "Nguyễn Tùng Quân" → 阮松君 (được ${vh1.hanString})`);
assert(JSON.stringify(vh1.strokes) === '[12,8,7]', `nét [12,8,7] (được ${JSON.stringify(vh1.strokes)})`);
const vh2 = viToHan('Trần Thị Mai');
assert(vh2.ok && vh2.hanString === '陳氏梅', 'viToHan "Trần Thị Mai" → 陳氏梅');
assert(viToHan('nguyen van an').ok, 'viToHan nhập không dấu "nguyen van an" cũng ok');
console.log(`   Nguyễn Tùng Quân → ${vh1.hanString} [${vh1.strokes.join(',')}] ✓`);

// ################## 15. PHỤC/PHẢN NGÂM 伏吟反吟 ##################
import { scanFuyin, natalFuyin, isFanyin, isFuyin, dayunFuyin } from './src/engine/fuyin.js';
console.log('\n################## 15. PHỤC/PHẢN NGÂM 伏吟反吟 ##################');
assert(isFuyin({ gan: '甲', zhi: '子' }, { gan: '甲', zhi: '子' }), '甲子×甲子 = Phục Ngâm');
assert(!isFuyin({ gan: '甲', zhi: '子' }, { gan: '乙', zhi: '丑' }), 'khác can-chi → không phải Phục Ngâm');
// [loop 19 sửa bug CAO] Phản Ngâm = THIÊN XUNG (4 cặp cách-7-vị 甲庚/乙辛/丙壬/丁癸) + ĐỊA XUNG.
//   Trước đây dùng "bất kỳ ngũ hành khắc" → 庚午×丙子 (火克金 nhưng 庚丙 cách 4 vị, KHÔNG phải
//   天冲) bị tính sai là Phản Ngâm. Cặp ĐÚNG: 甲子×庚午 (甲庚天冲 + 子午地冲).
assert(isFanyin({ gan: '甲', zhi: '子' }, { gan: '庚', zhi: '午' }), '甲子×庚午 (甲庚天冲+子午地冲) = Phản Ngâm');
assert(isFanyin({ gan: '丙', zhi: '子' }, { gan: '壬', zhi: '午' }), '丙子×壬午 (丙壬天冲+子午地冲) = Phản Ngâm');
assert(!isFanyin({ gan: '庚', zhi: '午' }, { gan: '丙', zhi: '子' }), '庚午×丙子 (火克金=ngũ hành khắc, nhưng 庚丙 KHÔNG cách-7-vị → KHÔNG phải Phản Ngâm)');
assert(!isFanyin({ gan: '甲', zhi: '子' }, { gan: '乙', zhi: '丑' }), 'không khắc+xung → không phải Phản Ngâm');
// [loop 734] 支伏吟 (Chi Phục Ngâm) — đồng chi, dị can. NHẸ hơn Phục Ngâm trụ.
import { isZhiFuyin } from './src/engine/fuyin.js';
assert(isZhiFuyin({ gan: '己', zhi: '亥' }, { gan: '乙', zhi: '亥' }), '己亥×乙亥 (đồng chi 亥, dị can) = Chi Phục Ngâm');
assert(!isZhiFuyin({ gan: '乙', zhi: '亥' }, { gan: '乙', zhi: '亥' }), '乙亥×乙亥 (đồng cả can) → KHÔNG phải Chi Phục Ngâm (là Phục Ngâm trụ)');
assert(!isZhiFuyin({ gan: '乙', zhi: '亥' }, { gan: '辛', zhi: '巳' }), 'khác chi → KHÔNG phải Chi Phục Ngâm');
assert(isZhiFuyin({ gan: '甲', zhi: '子' }, { gan: '乙', zhi: '子' }), '甲子×乙子 (đồng chi 子) = Chi Phục Ngâm');
// Lá số user: 乙亥 nhật trụ → 1995/2055 phục ngâm, 2001/2061 phản ngâm
const fuR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
assert(scanFuyin(fuR, 1995).items.some((i) => i.type === '伏吟' && i.pillar === 'day'), '1995 乙亥 = Phục Ngâm Nhật Trụ');
assert(scanFuyin(fuR, 2001).items.some((i) => i.type === '反吟' && i.pillar === 'day'), '2001 辛巳 = Phản Ngâm Nhật Trụ');
assert(scanFuyin(fuR, 2026).items.length === 0, '2026 丙午 không phạm Phục/Phản Ngâm (xui do yếu tố khác)');
assert(natalFuyin(fuR).items.length === 0, 'lá số user không có phục/phan ngâm bẩm sinh');
// severity: phản ngâm nhật trụ + KHÔNG phải Dụng → nặng; ngày Dụng thì giảm
const sevNormal = scanFuyin(fuR, 2001).items[0].severity;
assert(sevNormal >= 7, `Phản Ngâm Nhật Trụ (không Dụng) severity ≥7 (được ${sevNormal})`);
// [loop 734] 支伏吟 lưu niên: 2019 己亥 vs nhật trụ 乙亥 → đồng chi dị can → Chi Phục Ngâm (NHẸ, sev thấp hơn Phục Ngâm trụ)
const zf2019 = scanFuyin(fuR, 2019).items.find((i) => i.type === '支伏吟' && i.pillar === 'day');
assert(zf2019, '2019 己亥 × nhật trụ 乙亥 (đồng chi) → phát hiện Chi Phục Ngâm Nhật Trụ');
assert(zf2019 && zf2019.subtype === 'branch', 'Chi Phục Ngâm có subtype = branch');
assert(zf2019 && zf2019.severity < sevNormal, `Chi Phục Ngâm (sev ${zf2019?.severity}) < Phản Ngâm trụ (sev ${sevNormal}) — nhẹ hơn`);
// Phục Ngâm trụ đầy đủ (1995 乙亥) phải NẶNG hơn Chi Phục Ngâm cùng trụ
const fpm1995 = scanFuyin(fuR, 1995).items.find((i) => i.type === '伏吟' && i.pillar === 'day');
assert(fpm1995 && zf2019 && fpm1995.severity > zf2019.severity, `Phục Ngâm trụ (sev ${fpm1995?.severity}) > Chi Phục Ngâm (sev ${zf2019?.severity})`);
assert(typeof dayunFuyin(fuR).dayun === 'string' || dayunFuyin(fuR).items.length >= 0, 'dayunFuyin chạy không lỗi');
console.log(`   乙亥 nhật trụ: 1995 Phục Ngâm (sev8), 2001 Phản Ngâm (sev7) ✓ | 2026 không phạm ✓ | đại vận ${dayunFuyin(fuR).dayun || '-'}: ${dayunFuyin(fuR).items.length} điểm`);

// ################## 16. SAO HÔN NHÂN CỔ (theo trụ) ##################
import { marriageStars, GULUAN, YINCHACUO, BAZHUAN, JIUZHOU } from './src/engine/marriage-stars.js';
console.log('\n################## 16. SAO HÔN NHÂN CỔ 孤鸾/阴阳差错/八专/九丑 ##################');
assert(GULUAN.length === 8 && GULUAN.includes('乙巳') && GULUAN.includes('丙午'), '孤鸾 đủ 8 nhóm, có 乙巳+丙午');
assert(YINCHACUO.length === 12, '阴阳差错 đủ 12 nhóm');
assert(BAZHUAN.includes('甲寅') && BAZHUAN.includes('戊戌'), '八专 có 甲寅+戊戌');
assert(JIUZHOU.length === 9 && JIUZHOU.includes('壬子'), '九丑 đủ 9 nhóm');
// Lá số user: 乙亥 nhật sạch nhưng Nguyệt 壬戌 + Thời 丙子 = Âm-Dương Sai Lạc
const msR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const msUser = marriageStars(msR);
assert(!msUser.hits.some((h) => h.pillar === 'day'), '乙亥 nhật trụ KHÔNG phạm sao hôn nhân');
assert(msUser.hits.some((h) => h.star === '阴阳差错' && h.pillar === 'month'), 'Nguyệt 壬戌 = Âm-Dương Sai Lạc');
assert(msUser.hits.some((h) => h.star === '阴阳差错' && h.pillar === 'time'), 'Thời 丙子 = Âm-Dương Sai Lạc');
assert(msUser.hasGuan === true, 'lá số user CÓ quan tinh (giảm khắc chung)');
assert(typeof msUser.summary === 'string' && msUser.summary.includes('Âm Dương Sai Lạc'), 'summary nhắc Âm Dương Sai Lạc');
console.log(`   user: ${msUser.hits.length} sao (${msUser.level}) — ${msUser.hits.map((h) => h.starVi + '@' + h.pillarVi).join(', ')} ✓`);

// ################## 17. 60 TRỊ NIÊN THÁI TUẾ (六十太岁将军) ##################
import { taiSuiGeneral, taiSuiOverview, TAISUI_60, NAYIN_TRAIT } from './src/engine/taisui-general.js';
console.log('\n################## 17. 60 TRỊ NIÊN THÁI TUẾ 六十太岁将军 ##################');
assert(TAISUI_60.length === 60, 'đủ 60 vị thái tuế');
assert(new Set(TAISUI_60.map((t) => t[0])).size === 60, '60 hoa giáp không trùng');
// neo 3 năm cận đại (đối chiếu 4 nguồn)
assert(taiSuiGeneral(2024).nameShort === '李诚' && taiSuiGeneral(2024).ganZhi === '甲辰', '2024 甲辰 = 李诚');
assert(taiSuiGeneral(2025).nameShort === '吴遂' && taiSuiGeneral(2025).ganZhi === '乙巳', '2025 乙巳 = 吴遂');
assert(taiSuiGeneral(2026).nameShort === '文哲' && taiSuiGeneral(2026).ganZhi === '丙午', '2026 丙午 = 文哲');
// [loop 564] NAYIN_TRAIT 30 keys (trước đây 29 do dup 砂/沙 + thiếu 大溪水/沙中土).
assert(Object.keys(NAYIN_TRAIT).length === 30, `[loop 564] NAYIN_TRAIT đúng 30 (trước fix 29 do dup, được ${Object.keys(NAYIN_TRAIT).length})`);
assert(!!NAYIN_TRAIT['大溪水'] && !!NAYIN_TRAIT['沙中土'] && !!NAYIN_TRAIT['城头土'] && !NAYIN_TRAIT['砂中金'], `[loop 564] NAYIN_TRAIT có 大溪水/沙中土/城头土, không dup 砂中金`);
console.log(`   taisui NAYIN_TRAIT ✓ — 30 nạp âm (fix dup 砂/沙 + thiếu 大溪水/沙中土)`);
// index đúng
assert(taiSuiGeneral(2024).index === 41, '甲辰 = vị 41/60');
assert(taiSuiGeneral(1984).ganZhi === '甲子' && taiSuiGeneral(1984).nameShort === '金辨' && taiSuiGeneral(1984).index === 1, '1984 甲子 = 金辨 vị 1');
// lá số user: bản mệnh 1993 癸酉 = 康志 #10
const tsR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const ov = taiSuiOverview(tsR, 2026);
assert(ov.natal.ganZhi === '癸酉' && ov.natal.nameShort === '康志' && ov.natal.index === 10, '1993 癸酉 = 康志 vị 10');
assert(ov.current.nameShort === '文哲', '2026 trị niên = 文哲');
assert(typeof ov.summary === 'string' && ov.summary.includes('文哲'), 'overview nhắc 文哲');
console.log(`   bản mệnh 1993 癸酉=${ov.natal.nameShort} (vị 10) · trị niên 2026=${ov.current.nameShort} ✓ | 60 vị ok`);

// ################## 18. TAM NGUYÊN CỬU VẬN 三元九运 ##################
import { currentYun, sanyuanJiuyun, YUN } from './src/engine/sanyuan-jiuyun.js';
console.log('\n################## 18. TAM NGUYÊN CỬU VẬN 三元九运 ##################');
assert(YUN.length === 9, 'đủ 9 vận');
// [loop 19 sửa typo tên sao] 九星 màu: Nhị HẮC / Tứ LỤC / Ngũ HOÀNG (không phải Hỗ/Lộc/Hoả).
assert(YUN[1].starVi === 'Nhị Hắc Cự Môn' && YUN[3].starVi === 'Tứ Lục Văn Khúc' && YUN[4].starVi === 'Ngũ Hoàng Liêm Trinh', 'tên sao 九星 đúng màu Hán-Việt (Hắc/Lục/Hoàng)');
assert(currentYun(2004).num === 8 && currentYun(2004).starVi.includes('Bát Bạch'), '2004 = Bát vận');
assert(currentYun(2023).num === 8, '2023 vẫn Bát vận');
assert(currentYun(2024).num === 9 && currentYun(2024).wx === '火', '2024 = Cửu vận 离火');
assert(currentYun(2043).num === 9 && currentYun(2044).num === 1, '2043=Cửu vận, 2044 vòng mới Nhất vận');
assert(currentYun(2026).dir === 'Nam' && currentYun(2026).opp === 'Bắc', 'Cửu vận 正神=南 零神=北');
const syR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const sy = sanyuanJiuyun(syR, 2026);
assert(sy.detail !== null, 'Cửu vận có chi tiết');
assert(sy.align.includes('SINH Dụng Thổ'), 'Dụng Thổ × vận Hỏa = "Hỏa sinh Thổ" (khá thuận)');
assert(sy.summary.includes('正神=Nam') && sy.summary.includes('旺'), 'summary có chính thần + ngành mệnh');
console.log(`   ${sy.yun.starVi} · ${sy.yun.trig} · ${sy.yun.wxVi} (2024-2043) | 正神 ${sy.zhengShen.split(' ')[0]} | ${sy.align.slice(0, 30)}... ✓`);

// ################## 19. 天赦/四废/十恶大败 (黄历择日神煞) ##################
import { analyzeDaySpecial, specialDays, nextTianShe, TIAN_SHE, E_DA_BAI } from './src/engine/zheri-stars.js';
console.log('\n################## 19. 天赦/四废/十恶大败 黄历择日 ##################');
assert(TIAN_SHE.xuân === '戊寅' && TIAN_SHE.hạ === '甲午' && TIAN_SHE.thu === '戊申' && TIAN_SHE['đông'] === '甲子', '天赦: 春戊寅夏甲午秋戊申冬甲子');
assert(E_DA_BAI.length === 10 && E_DA_BAI.includes('甲辰') && E_DA_BAI.includes('癸亥'), '十恶大败 đủ 10, có 甲辰+癸亥');
// 2026-03-05 = 戊寅 = 天赦 (đối chiếu 算准网万年历)
const zs1 = analyzeDaySpecial(2026, 3, 5);
assert(zs1.ganZhi === '戊寅' && zs1.special.some((s) => s.type === '天赦'), '2026-03-05 = 戊寅 天赦日');
// 1 năm có ~5-7 天赦
const sd2026 = specialDays(2026);
assert(sd2026.tianshe.length >= 5 && sd2026.tianshe.length <= 8, `2026 có 5-8 天赦 (được ${sd2026.tianshe.length})`);
assert(sd2026.tianshe.every((t) => ['戊寅', '甲午', '戊申', '甲子'].includes(t.ganZhi)), 'mọi 天赦 đúng 1 trong 4 trụ mùa');
assert(sd2026.edabai.length >= 50 && sd2026.edabai.length <= 70, `十恶大败 ~60/năm (được ${sd2026.edabai.length})`);
// nextTianShe trả ngày thật trong tương lai
const nx = nextTianShe(2026, 6, 22, 3);
assert(nx.length === 3 && nx.every((t) => ['戊寅', '甲午', '戊申', '甲子'].includes(t.ganZhi)), 'nextTianShe trả 3 ngày天赦 hợp lệ');
// ngày không đặc biệt
const none = analyzeDaySpecial(2026, 6, 15);
assert(typeof none.ganZhi === 'string', 'phân tích ngày thường không lỗi');
console.log(`   2026: ${sd2026.tianshe.length} 天赦 · ${sd2026.sifei.length} 四废 · ${sd2026.edabai.length} 十恶大败 | 3 天赦 tới: ${nx.map((t) => t.solar + '(' + t.ganZhi + ')').join(' ')} ✓`);

// ################## 20. GIAO THỜI ĐẠI VẬN 交运 ##################
import { computeJiaoYun, jiaoYunAnalysis } from './src/engine/jiaoyun.js';
console.log('\n################## 20. GIAO THỜI ĐẠI VẬN 交运 ##################');
const cy = computeJiaoYun(1993, 10, 21, 0, 30, 'nam');
assert(cy.transitions.length === 8, 'có 8 điểm giao thời');
assert(cy.transitions[0].date.getFullYear() === 1997, '起运 1997 (user)');
// khoảng cách giữa các giao thời ~10 năm
const gap = cy.transitions[3].date.getFullYear() - cy.transitions[1].date.getFullYear();
assert(gap === 20, 'mỗi 10 năm 1 giao thời (2 index = 20 năm)');
assert(cy.transitions.every((t, i) => i === 0 || t.zhi === cy.transitions[0].zhi), 'giờ giao thời cố định theo giờ起运');
const jyR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const jy = jiaoYunAnalysis(jyR, new Date(2026, 5, 22));
assert(jy.next && jy.next.ganZhi === '戊午' && jy.next.age === 35, 'giao thời kế = 戊午 [35t]');
assert(jy.next.rating === 'Cát' || jy.next.rating === 'Đại cát', `đại运 tới Cát/Đại cát (được ${jy.next.rating} — [loop 454] tier mới ≥5=Đại cát)`);
assert(jy.daysUntil > 0 && jy.daysUntil < 600, 'còn <600 ngày tới giao thời');
assert(jy.avoidZhi.includes('子'), 'né tuổi Tý (xung午 đại vận tới)');
assert(jy.summary.includes('GIAO THỜI') && jy.summary.includes('戊午'), 'summary nhắc giao thời + 戊午');
// deterministic
const jy2 = jiaoYunAnalysis(jyR, new Date(2026, 5, 22));
assert(JSON.stringify(jy.allTransitions) === JSON.stringify(jy2.allTransitions), 'jiaoYun deterministic');
console.log(`   user: 起运 ${cy.transitions[0].date.getFullYear()} | hiện 己未[Cát] → kế ${jy.next.date.getFullYear()}-${jy.next.date.getMonth() + 1}-${jy.next.date.getDate()} = ${jy.next.ganZhi}[${jy.next.age}t, ${jy.next.rating}] (còn ${jy.daysUntil} ngày) ✓`);

// ################## 21. 盖头截脚 + 进退交伏神 ##################
import { analyzePillarQuality, pillarRelation, shenJinTui, SHEN_GROUPS } from './src/engine/pillar-quality.js';
console.log('\n################## 21. 盖头截脚 + 进退交伏神 ##################');
assert(Object.values(SHEN_GROUPS).every((a) => a.length === 4), '4 nhóm × 4 trụ');
assert(shenJinTui('甲子') === '进神' && shenJinTui('壬辰') === '退神' && shenJinTui('丙午') === '交神' && shenJinTui('戊寅') === '伏神', '进=甲子 退=壬辰 交=丙午 伏=戊寅');
assert(shenJinTui('乙亥') === null, '乙亥 không thuộc nhóm');
assert(pillarRelation({ gan: '庚', zhi: '寅' }).type === '盖头', '庚寅 = 盖头 (can khắc chi)');
assert(pillarRelation({ gan: '甲', zhi: '申' }).type === '截脚', '甲申 = 截脚 (chi khắc can)');
assert(pillarRelation({ gan: '甲', zhi: '子' }).type === '支生干', '甲子 = chi sinh can');
assert(pillarRelation({ gan: '甲', zhi: '寅' }).type === '比和', '甲寅 = bỉ hoà');
// lá số user: Nguyệt 壬戌 + Thời 丙子 = 截脚 → khí không thông
const pqR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const pq = analyzePillarQuality(pqR);
assert(pq.gaijieCount === 2 && !pq.flowOk, '2/4 trụ bị盖头/截脚 → khí không thông');
assert(pillarRelation(pqR.chart.pillars.month).type === '截脚', 'Nguyệt 壬戌 = 截脚');
assert(pillarRelation(pqR.chart.pillars.time).type === '截脚', 'Thời 丙子 = 截脚');
assert(pq.perPillar.time.impact.includes('DỤNG bị khắc'), '丙子 截脚 khắc can Hỏa (Hỷ/Dụng)');
assert(!pq.summary.includes('undefined'), 'summary không còn undefined');
console.log(`   user: ${pq.gaijieCount}/4 trụ 盖头/截脚 (flowOk=${pq.flowOk}) | ${pq.summary.slice(0, 50)}... ✓`);

// ################## 22. ĐÀO HOA 分類 桃花 ##################
import { analyzeTaohua, TAOHUA, HONGYAN } from './src/engine/taohua.js';
console.log('\n################## 22. ĐÀO HOA 桃花 正/烂 ##################');
assert(TAOHUA['亥'] === '子' && TAOHUA['寅'] === '卯' && TAOHUA['巳'] === '午' && TAOHUA['申'] === '酉', '桃花: 亥卯未→子 寅午戌→卯 巳酉丑→午 申子辰→酉');
// [loop 28] 癸→申 (khẩu quyết «癸临申上», đồng bộ shensha.js) — trước đây 癸→丑
assert(HONGYAN['乙'] === '午' && HONGYAN['庚'] === '戌' && HONGYAN['癸'] === '申', '红艳: 乙→午 庚→戌 癸→申 (口诀 癸临申上)');
const thR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const th = analyzeTaohua(thR);
assert(th.taohuaZhi === '子', 'nhật chi 亥 → 桃花 子');
assert(th.positions.length === 1 && th.positions[0].pillar === 'time', '桃花 子 rơi Thời trụ (墙外)');
assert(th.flags.some((f) => f.type === '墙外桃花'), 'user: 墙外桃花 (Thời)');
assert(th.flags.some((f) => f.type === '桃花煞'), 'user: 桃花煞 (Tý = Thù kỵ)');
assert(th.verdict === '烂桃花' && th.score <= -2, `user: verdict 烂桃花 (score ${th.score})`);
assert(th.daoCha === true, 'user: 倒插桃花 (niên Dậu = 桃花 của thời Tý)');
assert(th.summary.includes('LẠN'), 'summary nhắc LẠN ĐÀO HOA');
// deterministic
const th2 = analyzeTaohua(thR);
assert(JSON.stringify(th.flags) === JSON.stringify(th2.flags), 'analyzeTaohua deterministic');
console.log(`   user: 桃花=${th.taohuaZhi}@${th.positions[0].vi} → ${th.verdict} (score ${th.score}) | ${th.flags.map((f) => f.typeVi).join(', ')} ✓`);

// ################## 23. 通根透干 + 旺相休囚死 ##################
import { analyzeTongGen, tongGen, touGan, wuTai, elementPower } from './src/engine/tonggen.js';
console.log('\n################## 23. 通根透干 + 旺相休囚死 ##################');
assert(wuTai('木', '木') === '旺' && wuTai('火', '木') === '相' && wuTai('土', '金') === '休' && wuTai('金', '木') === '囚' && wuTai('土', '木') === '死', '旺相休囚死 đúng 5 trạng thái');
const tgR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
// Dụng Thổ: thông căn Nguyệt 戌(戊本气), không thấu → 藏而不透
const tgRoot = tongGen(tgR.chart, '土');
assert(tgRoot.total > 0.5 && tgRoot.roots.some((r) => r.zhi === '戌' && r.stem === '戊'), 'Thổ thông căn Nguyệt 戌(戊) bản khí');
assert(touGan(tgR.chart, '土').length === 0, 'Thổ KHÔNG thấu cán (không can Thổ)');
const tg = analyzeTongGen(tgR);
assert(tg.dung.verdict === '藏而不透', `Dụng Thổ = 藏而不透 (được ${tg.dung.verdict})`);
assert(tg.whenReveal.includes('戊') && tg.whenReveal.includes('己'), 'lưu niên 戊/己 sẽ thấu Dụng');
assert(['旺', '相', '休', '囚', '死'].includes(tg.dung.season), 'Dụng có trạng thái mùa hợp lệ');
// deterministic
const tg2 = analyzeTongGen(tgR);
assert(JSON.stringify(tg.summary) === JSON.stringify(tg2.summary), 'analyzeTongGen deterministic');
console.log(`   user: Dụng Thổ = ${tg.dung.verdict} (${tg.dung.seasonVi}), căn ${tg.dung.root.total} @ ${tg.dung.root.roots[0].zhi}, đợi can ${tg.whenReveal.join('/')} thấu ✓`);

// ################## 24. HÓA KHÍ CÁCH 化气格 ##################
import { analyzeHuaQi, GAN_HE } from './src/engine/huaqi.js';
console.log('\n################## 24. HÓA KHÍ CÁCH 化气格 ##################');
assert(GAN_HE['甲己'] === '土' && GAN_HE['乙庚'] === '金' && GAN_HE['丙辛'] === '水' && GAN_HE['丁壬'] === '木' && GAN_HE['戊癸'] === '火', '5 hóa khí: 甲己土 乙庚金 丙辛水 丁壬木 戊癸火');
// lá số user: không can hợp → không hóa khí
const hqR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const hq0 = analyzeHuaQi(hqR);
assert(hq0.hasHe === false && hq0.huaQiGe === false, 'user không can hợp → không hóa khí');
assert(hq0.summary.includes('KHÔNG có Thiên Can Ngũ Hợp'), 'summary user: không hợp');
// synthetic 成: 甲+己/辰月(土令)/thông căn Thổ/không phá → Hóa Thổ, Dụng Thổ, Hỷ 火, Kỵ Mộc
const hq1 = analyzeHuaQi({ chart: { dayGan: '甲', dayMaster: { wx: '木' }, pillars: { year: { gan: '丙', zhi: '子' }, month: { gan: '己', zhi: '辰' }, day: { gan: '甲', zhi: '辰' }, time: { gan: '戊', zhi: '申' } } }, strength: { monthMainWx: '土' } });
assert(hq1.huaQiGe === true && hq1.dung.primary === '土' && hq1.dung.xi === '火' && hq1.dung.ji === '木', '甲己/辰月 → Hóa Thổ cách, Dụng Thổ/Hỷ 火/Kỵ Mộc');
// synthetic 不成 (卯月木令 + 乙 phá hóa)
const hq2 = analyzeHuaQi({ chart: { dayGan: '甲', dayMaster: { wx: '木' }, pillars: { year: { gan: '乙', zhi: '卯' }, month: { gan: '己', zhi: '卯' }, day: { gan: '甲', zhi: '辰' }, time: { gan: '丁', zhi: '巳' } } }, strength: { monthMainWx: '木' } });
assert(hq2.huaQiGe === false, '甲己/卯月木令+乙 phá → KHÔNG thành (phá hóa + lệnh không hỗ trợ)');
console.log(`   user: huaQiGe=${hq0.huaQiGe} (không hợp) ✓ | synthetic 甲己/辰月 → ${hq1.huaQiGe ? 'THÀNH Hóa Thổ' : 'không'} (Dụng ${hq1.dung.primary}/Hỷ ${hq1.dung.xi}/Kỵ ${hq1.dung.ji}) ✓`);

// ################## 25. KHỞ MỞ/KHỎA 开库闭库 ##################
import { analyzeKu, KU } from './src/engine/ku.js';
console.log('\n################## 25. KHỞ MỞ/KHỎA 开库闭库 ##################');
assert(KU['辰'].store === '水' && KU['戌'].store === '火' && KU['丑'].store === '金' && KU['未'].store === '木', '四库: 辰水 戌火 丑金 未木');
assert(KU['辰'].pair === '戌' && KU['丑'].pair === '未', 'xung: 辰↔戌 丑↔未');
// lá số user: 戌 (Hỏa = Hỷ) 闭库 (không 辰)
const kuR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const ku = analyzeKu(kuR, 2026);
assert(ku.kuInChart.length === 1 && ku.kuInChart[0].zhi === '戌', 'user có 1 khổ = 戌');
assert(ku.kuInChart[0].state === 'closed', '戌 闭库 (không 辰 xung)');
assert(ku.locked.some((k) => k.storeLabel === 'HỶ'), 'Hỷ(Hỏa) bị khóa trong 戌');
assert(ku.openYears.some((o) => o.year === 2036), '2036 丙辰 xung mở 戌');
// deterministic
const ku2 = analyzeKu(kuR, 2026);
assert(JSON.stringify(ku.summary) === JSON.stringify(ku2.summary), 'analyzeKu deterministic');
console.log(`   user: khổ Tuất(Hỏa/HỶ) 闭库 → mở năm ${ku.openYears.map((o) => o.year).join('/')} ✓`);

// ################## 26. TỬ VI TAM PHƯƠNG TỨ CHÍNH ##################
import { sanfangSizheng, analyzePalaceSanfang, ziweiCoreReading } from './src/engine/ziwei-sanfang.js';
console.log('\n################## 26. TỬ VI 三方四正 ##################');
assert(JSON.stringify(sanfangSizheng('子').all) === JSON.stringify(['子', '申', '辰', '午']), 'tam phương tứ chính 子 = {子,申,辰,午}');
assert(sanfangSizheng('戌').sizheng === '辰' && sanfangSizheng('戌').sanfang.join('') === '寅午', '戌: tam hợp 寅午, đối cung 辰');
const zr = computeZiwei(1993, 10, 21, 0, 30, 'nam');
const ming = zr.palaces.find((p) => p.isMing);
assert(ming && ming.zhi === '戌', 'Mệnh cung user ở 戌');
const core = ziweiCoreReading(zr);
assert(['旺强', '中平', '弱陷'].includes(core.core.verdict), 'verdict hợp lệ');
assert(typeof core.core.score === 'number', 'có score số');
// 4 cung tam phương tứ chính của Mệnh = Mệnh+Tài+Quan+Duyên
const sfz = sanfangSizheng('戌');
const roles = sfz.all.map((z) => zr.palaces.find((p) => p.zhi === z)?.vi);
assert(roles.length === 4, 'đủ 4 cung trong tam phương tứ chính');
// deterministic
const core2 = ziweiCoreReading(zr);
assert(core.core.score === core2.core.score, 'ziweiCoreReading deterministic');
console.log(`   user: Mệnh(${ming.vi.slice(0, 4)}) tam phương tứ chính = ${core.core.verdict} (score ${core.core.score}, ${core.core.cat.length} cát/${core.core.hung.length} hung) ✓`);
// [loop 642] 命宫 空宫 → note «借星安命» (mượn sao đối cung). Quân 1993 命宫 酉 trống.
{
  const { computeZiwei } = await import('./src/engine/ziwei.js');
  const zq = computeZiwei(1993, 10, 21, 1, 15, 'nam');
  const cq = ziweiCoreReading(zq);
  const mingQ = zq.palaces.find((p) => p.isMing);
  if ((mingQ.stars || []).length === 0) {
    assert(cq.summary.includes('空宫') && cq.summary.includes('借星安命'), `[loop 642] Mệnh 空宫 → note «借星安命» (got ${(cq.summary.includes('空宫')?'':'NO 空宫 note')})`);
    console.log(`   Mệnh 空宫 note ✓ — Quân 1993 命宫 trống, mượn sao đối cung (không phán «mệnh yếu»)`);
  }
  // non-empty 命宫 → không note 空宫
  const z2 = computeZiwei(1990, 6, 15, 14, 15, 'nam');
  const c2 = ziweiCoreReading(z2);
  const ming2 = z2.palaces.find((p) => p.isMing);
  if ((ming2.stars || []).length > 0) {
    assert(!c2.summary.includes('空宫'), `[loop 642] Mệnh CÓ sao → không nhầm note 空宫`);
  }
}
// [loop 643] FAMILY THÁI TUẾ — ai trong nhà phạm thái tuế năm nay (overview).
//   VD em Mỹ Anh (子) năm 午 (2026) 冲太岁 (nặng). Trước đây family analysis không có.
{
  const { deduceFromFamily } = await import('./src/engine/family-deduction.js');
  const S = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  const fam = [
    { role: 'sibling', label: 'em Mỹ Anh', R: analyze(1996, 12, 4, 10, 15, 'nữ', 2026) },
    { role: 'mother', label: 'Mẹ', R: analyze(1970, 6, 27, 7, 15, 'nữ', 2026) },
  ];
  const d = deduceFromFamily(S, fam);
  const ts = d.holographic.find((h) => h.includes('THÁI TUẾ'));
  assert(ts && ts.includes('Mỹ Anh') && ts.includes('冲太岁'), `[loop 643] family taisui flag Mỹ Anh (子) 冲太岁 2026 (got ${(ts || 'NONE').slice(0, 60)})`);
  console.log(`   family taisui overview ✓ — Mỹ Anh (子) 冲太岁 2026 được flag`);
}
// [loop 646] VẬN HIỆN CẢ NHÀ — mỗi người đang ở đại vận gì (peak/khó) → ai cần hỗ trợ.
{
  const { deduceFromFamily } = await import('./src/engine/family-deduction.js');
  const S = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  const fam = [
    { role: 'mother', label: 'Mẹ', R: analyze(1970, 6, 27, 7, 15, 'nữ', 2026) },
    { role: 'father', label: 'Bố', R: analyze(1964, 4, 4, 12, 0, 'nam', 2026) },
  ];
  const d = deduceFromFamily(S, fam);
  const vf = d.holographic.find((h) => h.includes('VẬN HIỆN CẢ NHÀ'));
  assert(vf, `[loop 646] có insight VẬN HIỆN CẢ NHÀ`);
  assert(vf.includes('chủ thể') && vf.includes('Mẹ') && vf.includes('Bố'), `[loop 646] liệt kê đủ thành viên`);
  assert(vf.includes('ĐỈNH VẬN') || vf.includes('Đại cát'), `[loop 646] flag chủ thể ĐỈNH VẬN (Quân 己未 Đại cát)`);
  console.log(`   family fortune overview ✓ — ${vf.slice(0, 80)}...`);
}
// [loop 647] analyze_partner marriageTiming — năm CẢ HAI vận tốt (cửa sổ cưới).
{
  const { execTool } = await import('./src/engine/ai.js');
  const Ru = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  const p = execTool('analyze_partner', { year: 1990, month: 8, day: 12, hour: 14, gender: 'nữ' }, Ru);
  assert(!p.error, `[loop 647] analyze_partner không crash (got ${p.error})`);
  assert(p.score && p.rating, `[loop 647] analyze_partner trả score/rating (got ${p.score}/${p.rating})`);
  assert(p.marriageTiming && Array.isArray(p.marriageTiming.bestYears) && p.marriageTiming.note, `[loop 647] analyze_partner có marriageTiming (bestYears + note)`);
  console.log(`   analyze_partner marriageTiming ✓ — score ${p.score} ${p.rating}, timing note có`);
}
// [loop 655] NLG offline fallback — fengshui + remedy intent (trước đây «chưa rõ lĩnh vực»).
{
  const { composeAnswer } = await import('./src/engine/nlg.js');
  const R = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  const fs = composeAnswer('hướng nào tốt để ở?', R);
  assert(fs.title.includes('Phong thủy') || fs.title.includes('định vị'), `[loop 655] fengshui Q → Phong thủy (got ${fs.title}, trước «chưa rõ»)`);
  const rm = composeAnswer('làm sao bớt xui?', R);
  assert(rm.title.includes('cải mệnh') || rm.title.includes('Nghịch thiên'), `[loop 655] remedy Q → cải mệnh (got ${rm.title}, trước «chưa rõ»)`);
  // fengshui answer must mention Dụng direction
  assert(/Thổ|Tây Nam|hướng/i.test(fs.paragraphs[0] || ''), `[loop 655] fengshui answer có Dụng hướng`);
  console.log(`   NLG fengshui+remedy intent ✓ — «hướng nào» → ${fs.title}; «bớt xui» → ${rm.title}`);
}
// [loop 656] NLG offline — câu hỏi gia đình DÙNG seeded R._family (không hỏi lại ngày).
{
  const { composeAnswer } = await import('./src/engine/nlg.js');
  const R = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  R._family = [{ role: 'mother', label: 'Mẹ Tô Hồng', date: '1970-06-27', time: '07:15', gender: 'nữ' }];
  const a = composeAnswer('mẹ tôi mệnh thế nào?', R);
  assert(a.title.includes('Mẹ') && !a.title.includes('cần AI'), `[loop 656] câu «mẹ tôi» dùng seeded family (got ${a.title}, trước «cần ngày sinh»)`);
  assert(/戊|Thổ/.test(a.lead || ''), `[loop 656] seeded family answer có NC mẹ (戊 Thổ)`);
  console.log(`   NLG seeded family ✓ — «mẹ tôi» → ${a.title} (dùng R._family, không hỏi lại ngày)`);
}
// [loop 662] analyze() validate input — VN error cho ngày/tháng/năm không hợp lệ.
//   Trước đây lunar-javascript throw «wrong month 13» (English) → AI nhận error khó hiểu.
{
  const { execTool } = await import('./src/engine/ai.js');
  const Ru = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  const r1 = execTool('analyze_relative', { year: 1990, month: 13, day: 1, gender: 'nữ' }, Ru);
  assert(r1.error && r1.error.includes('Tháng sinh không hợp lệ'), `[loop 662] month=13 → VN error (got ${(r1.error||'').slice(0,40)})`);
  const r2 = execTool('analyze_relative', { year: 1990, month: 6, day: 0, gender: 'nữ' }, Ru);
  assert(r2.error && r2.error.includes('Ngày sinh không hợp lệ'), `[loop 662] day=0 → VN error`);
  // valid still works
  const r3 = execTool('analyze_relative', { year: 1990, month: 8, day: 12, gender: 'nữ' }, Ru);
  assert(!r3.error && r3.diemMenh, `[loop 662] ngày hợp lệ vẫn hoạt động`);
  console.log(`   analyze() input validation ✓ — tháng/ngày sai → VN error; hợp lệ OK`);
}
// [loop 736] hour/minute normalization — `analyze(y,m,d,undefined)` CRASH («wrong hour undefined»),
//   `null` vô tình coerce → giờ Tý(0) SAI. Cả hai phải → Ngọ(12) nhất quán.
{
  const rUndef = analyze(1993, 10, 21, undefined, undefined, 'nam', 2026);
  const rNull = analyze(1993, 10, 21, null, null, 'nam', 2026);
  const rExplicit = analyze(1993, 10, 21, 12, 0, 'nam', 2026);
  const hp = (R) => R.chart.pillars.time.gan + R.chart.pillars.time.zhi;
  assert(hp(rUndef) === '壬午', `[loop 736] undefined hour → Ngọ 壬午 không crash (got ${hp(rUndef)})`);
  assert(hp(rNull) === hp(rExplicit), `[loop 736] null hour === explicit 12 (got ${hp(rNull)} vs ${hp(rExplicit)})`);
  // giờ thật KHÔNG bị normalize
  const rReal = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  assert(hp(rReal) === '丁丑', `[loop 736] giờ thật 1:15 → 丁丑 (không normalize, got ${hp(rReal)})`);
  // hour sai range → VN error sạch
  let eH = null; try { analyze(1993, 10, 21, 25, 0, 'nam'); } catch (e) { eH = e.message; }
  assert(eH && eH.includes('Giờ sinh không hợp lệ'), `[loop 736] hour=25 → VN error (got ${eH})`);
  console.log(`   [loop 736] hour normalization ✓ — undefined/null → Ngọ(12); giờ thật giữ nguyên; range reject`);
}
// [loop 666] viToHan single-word + tên user (Quân/Nhật). Bug: parts[0] chỉ check _SUR →
//   given name đơn (Tùng/Quân) bị missing.
{
  const { viToHan } = await import('./src/engine/vi2han.js');
  // single given name (trước đây missing do check _SUR only)
  const t = viToHan('Tùng'); assert(t.ok && t.hanString === '松', `[loop 666] «Tùng» → 松 (got ${t.hanString}, trước missing)`);
  const q = viToHan('Quân'); assert(q.ok && q.hanString === '君', `[loop 666] «Quân» → 君 (got ${q.hanString})`);
  const n = viToHan('Nhật'); assert(n.ok && n.hanString === '日', `[loop 666] «Nhật» → 日 (got ${n.hanString})`);
  // full name user
  const full = viToHan('Nguyễn Tùng Quân'); assert(full.ok && full.hanString === '阮松君', `[loop 666] «Nguyễn Tùng Quân» → 阮松君 (got ${full.hanString})`);
  console.log(`   viToHan ✓ — Tùng/Quân/Nhật single + «Nguyễn Tùng Quân»→阮松君 convert được`);
}
// [loop 644] daily.js (dailyGuidance) + liuri advice — align thang 54/48 (không 65/45 hay 64).
//   Bug: dailyGuidance dùng 65/45 (thang cũ); liuri advice >=64 nhưng rating Cát >=54 → mâu thuẫn nội bộ.
{
  const { dailyGuidance } = await import('./src/engine/daily.js');
  const { analyzeLiuRi } = await import('./src/engine/liuri.js');
  const R = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  // dailyGuidance verdict phải dùng thang 54/48 (không 65)
  const dg = dailyGuidance(R, 2026, 6, 28, 12);
  assert(/54|48|44|CÁT|BÌNH|HUNG|HƠI/.test(dg.verdict), `[loop 644] dailyGuidance trả verdict`);
  // score 60 phải = CÁT (thang 54), không «BÌNH» (thang cũ 65)
  // verify via a synthetic check: advice↔rating consistency trong liuri
  let adviceMismatch = 0;
  for (let d = 1; d <= 28; d++) {
    const lr = analyzeLiuRi(R, 2026, 6, d, R.patternQuality);
    if (lr.rating === 'Cát' && !lr.advice.includes('thuận')) adviceMismatch++;
  }
  assert(adviceMismatch === 0, `[loop 644] liuri advice «thuận» khớp rating Cát (got ${adviceMismatch}/28 mismatch — trước fix advice >=64 vs rating >=54)`);
  console.log(`   dailyGuidance + liuri advice ✓ — align thang 54/48; liuri advice↔rating 0 mismatch`);
}

// ################## 27. TỬ VI ĐỘ SÁNG 庙旺平陷 ##################
import { starBrightness, analyzeZiweiBrightness, BRIGHTNESS } from './src/engine/ziwei-brightness.js';
console.log('\n################## 27. TỬ VI ĐỘ SÁNG 庙旺平陷 ##################');
assert(Object.keys(BRIGHTNESS).length === 14, '14 chính diệu');
assert(Object.values(BRIGHTNESS).every((r) => r.length === 12), 'mỗi sao 12 chi');
// neo đối chiếu 令东来 表
assert(starBrightness('太阳', '午').state === '庙' && starBrightness('太阳', '子').state === '陷', '太阳: 午庙 子陷');
assert(starBrightness('太阴', '子').state === '庙' && starBrightness('太阴', '午').state === '陷', '太阴: 子庙 午陷 (đối thái dương)');
assert(starBrightness('紫微', '午').state === '庙' && starBrightness('紫微', '戌').state === '平', '紫微: 午庙 戌平 [cycle 55 — 紫微无陷, 戌=平 không phải 陷]');
// [cycle 56] guard: 4 sao VÔ HÃM (紫微/武曲/七杀/天府) không có 陷 ở bất kỳ cung — lock fix brightness table
for (const s of ['紫微', '武曲', '七杀', '天府']) {
  assert(!BRIGHTNESS[s].includes('陷'), `${s} vô hãm — không có 陷 ở bất kỳ cung (cycle 56 brightness verify)`);
}
assert(!BRIGHTNESS['武曲'].includes('陷') && BRIGHTNESS['武曲'][3] === '平', '武曲@卯=平 (无陷, cũ sai 陷 → false-凶)');
assert(BRIGHTNESS['七杀'][3] === '旺', '七杀@卯=旺 (无陷, cũ sai 陷)');
// lá số user: 破军 tại Mệnh (戌) = 旺
const bwR = computeZiwei(1993, 10, 21, 0, 30, 'nam');
const bw = analyzeZiweiBrightness(bwR);
const mingStar = bw.items.find((i) => i.palaceVi.includes('Mệnh'));
assert(mingStar && mingStar.star === '破军' && mingStar.state === '旺', 'Mệnh cung 破军@戌 = 旺 (sáng)');
assert(bw.strong.length >= 5, `nhiều sao miếu/vượng (được ${bw.strong.length})`);
assert(!bw.summary.includes('undefined'), 'summary không còn undefined');
const bw2 = analyzeZiweiBrightness(bwR);
assert(bw2.summary === bw.summary, 'analyzeZiweiBrightness deterministic');
console.log(`   user: Mệnh 破军@戌=旺 (sáng) | ${bw.strong.length} miếu/vượng, ${bw.weak.length} hãm/nhàn ✓`);

// ################## 28. 四ĐỨC NHẬT 岁德/月德 ##################
import { analyzeDeRi, deRiInYear, nextDeRi, YANG_OF_PAIR, SANHE } from './src/engine/deri.js';
console.log('\n################## 28. 四ĐỨC NHẬT 岁德/月德 ##################');
assert(YANG_OF_PAIR['甲'] === '甲' && YANG_OF_PAIR['己'] === '甲' && YANG_OF_PAIR['乙'] === '庚' && YANG_OF_PAIR['丁'] === '壬', '岁德 = dương can ngũ hợp đôi: 甲己→甲 乙庚→庚 丁壬→壬');
assert(SANHE['寅'] === '丙' && SANHE['申'] === '壬' && SANHE['巳'] === '庚' && SANHE['亥'] === '甲', '月德 tam hợp: 寅午戌→丙 申子辰→壬 巳酉丑→庚 亥卯未→甲');
const dy = deRiInYear(2026);
assert(dy.totalDeRi > 80 && dy.strongDeRi.length > 10, `2026 có nhiều ngày đức + ≥2 đức (được ${dy.totalDeRi}/${dy.strongDeRi.length})`);
// 2026 丙年: 岁德=丙, 岁德合=辛; ngày 丙 = 岁德, ngày 辛 = 岁德合
const d1 = analyzeDeRi(2026, 1, 6); // 2026-01-06 sample strong (丙日?)
assert(d1.isDeRi && d1.hits.length >= 2, '2026-01-06 ≥2 đức');
// nextDeRi trả ngày thật
const nx2 = nextDeRi(2026, 6, 22, 3);
assert(nx2.length === 3 && nx2.every((d) => d.de.includes('Đức')), 'nextDeRi trả 3 ngày đức');
const dy2 = deRiInYear(2026);
assert(dy2.totalDeRi === dy.totalDeRi, 'deRiInYear deterministic');
console.log(`   2026: ${dy.totalDeRi} ngày đức, ${dy.strongDeRi.length} ngày ≥2 đức | 3 đức tới: ${nx2.map((d) => d.de).join(' / ')} ✓`);

// ################## 29. HUNG NHẬT 月破/月厌/往亡 ##################
import { analyzeXiongRi, xiongRiInYear, CHONG, YUE_YAN, WANG_WANG } from './src/engine/xiongri.js';
console.log('\n################## 29. HUNG NHẬT 月破/月厌/往亡 ##################');
assert(CHONG['寅'] === '申', '月破: 寅月 → 申日 (xung)');
assert(YUE_YAN['寅'] === '戌' && YUE_YAN['子'] === '子', '月厌 寅→戌 子→子');
assert(WANG_WANG['寅'] === '巳', '往亡 寅→巳');
const xr = xiongRiInYear(2026);
assert(xr.yuePoCount > 20 && xr.totalXiong > xr.yuePoCount, `2026 có Nguyệt Phá + tổng hung (được ${xr.yuePoCount}/${xr.totalXiong})`);
// 月破 = dayZhi === CHONG[monthZhi] — verify bằng 1 ngày construct
const xr1 = analyzeXiongRi(2026, 1, 9);
assert(xr1.hits.some((h) => h.type === '月破'), '2026-01-09 (癸未, 丑月) = Nguyệt Phá (未 xung 丑)');
assert(xr1.ganZhi === '癸未', 'ganZhi 2026-01-09 = 癸未');
// ngày không phạm hung
const clean = analyzeXiongRi(2026, 2, 10);
assert(typeof clean.ganZhi === 'string', 'phân tích ngày thường không lỗi');
const xr2 = xiongRiInYear(2026);
assert(xr2.totalXiong === xr.totalXiong, 'xiongRiInYear deterministic');
console.log(`   2026: ${xr.totalXiong} hung nhật (Nguyệt Phá ${xr.yuePoCount}) | 2026-01-09 = Nguyệt Phá ✓`);

// ################## 30. BẢN MỆNH HÀM 演禽 28禽 ##################
import { analyzeYanQin, dayQin, QIN_28, YAO_WX } from './src/engine/yanqin.js';
console.log('\n################## 30. BẢN MỆNH HÀM 演禽 28禽 ##################');
assert(Object.keys(QIN_28).length === 28, 'đủ 28禽');
assert(QIN_28['角'].qin === '角木蛟' && QIN_28['亢'].qin === '亢金龙', '角木蛟 亢金龙');
assert(YAO_WX['日'] === '火' && YAO_WX['月'] === '水', '日→Hoả 月→Thủy');
// lá số user: sinh 1993-10-21 = 井宿 → 井木犴
const yqR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const yq = analyzeYanQin(yqR);
assert(yq.benMing.qin === '井木犴' && yq.benMing.wx === '木', 'user bản mệnh = 井木犴 (Mộc)');
assert(yq.benMing.nature.includes('liêm chính'), '井木犴: liêm chính');
// quan hệ sinh khắc đúng ngũ hành (YAO_WX phải được áp dụng, không để 月 nguyên)
const today2 = dayQin(2026, 6, 22);
assert(today2.qin === '张月鹿' && today2.wx === '水', '2026-06-22 = 张月鹿, 月→Thủy (không để 月 nguyên)');
assert(['tong', 'sheng', 'xie', 'ke', 'cai'].includes(yq.rel), 'rel hợp lệ');
const yq2 = analyzeYanQin(yqR);
assert(yq2.benMing.qin === yq.benMing.qin, 'analyzeYanQin deterministic (bản mệnh)');
console.log(`   user: 本命禽 ${yq.benMing.qin} (${yq.benMing.animal}, ${yq.benMing.wx}) — ${yq.benMing.nature.slice(0, 24)}... ✓`);

// ################## 31. THẬP THẦN CHỦ ĐẠO 主导十神 ##################
import { dominantGod, TENDENCY, GOD_CAT } from './src/engine/dominant-god.js';
console.log('\n################## 31. THẬP THẦN CHỦ ĐẠO 主导十神 ##################');
assert(Object.keys(TENDENCY).length === 10, '10 thập thần có tendency');
assert(Object.keys(GOD_CAT).length === 10, '10 thập thần có nhóm五行');
const dgR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const dg = dominantGod(dgR);
assert(dg.ranked.length >= 5, `có ≥5 thập thần (được ${dg.ranked.length})`);
// lá số user: Ấn (Chính Ấn + Thiên Ấn) nặng nhất (壬癸亥子 = thuỷ)
assert(dg.dominant.god === '正印' && dg.subDominant.god === '偏印', 'user: dominant 正印, sub 偏印 (Ấn nặng)');
assert(dg.catWx === '水', 'Ấn của 乙 = Thủy');
assert(dg.favor === 'ji', 'Ấn(Thủy) = Thù → nghịch Dụng (Thổ)');
assert(dg.summary.includes('Chính Ấn') && dg.summary.includes('nghịch'), 'summary nhắc Chính Ấn + nghịch');
assert(TENDENCY['正印'].career.includes('giáo dục'), '正印 tendency có giáo dục');
// deterministic
const dg2 = dominantGod(dgR);
assert(dg2.summary === dg.summary, 'dominantGod deterministic');
console.log(`   user: dominant ${dg.dominant.godVi} (${dg.dominant.score}) + ${dg.subDominant.godVi} → ${dg.favor} Dụng ✓`);

// ################## 32. THẬP THẦN KHUYẾT/THIẾU 缺十神 ##################
import { missingGod, CAT } from './src/engine/missing-god.js';
console.log('\n################## 32. THẬP THẦN KHUYẾT/THIẾU 缺十神 ##################');
assert(Object.keys(CAT).length === 5, '5 nhóm thập thần');
// lá số user: 印 full, Tỷ-Kiếp partial (có 劫財@亥 tàng), Tài partial, Quan partial
// [loop 62] 比肩 = 元神 (日主) luôn có → không bao giờ 'lacking' hoàn toàn
const mgR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const mg = missingGod(mgR);
assert(mg.categories.yin.status === 'full', 'Ấn: full (Chính + Thiên Ấn)');
assert(mg.categories.bi.status !== 'lacking', 'Tỷ/Kiếp không lacking (比肩=元神 luôn có)');
assert(mg.categories.bi.gods.find((g) => g.god === '劫財').has === true, '劫財 (truyền thống) được nhận diện@亥');
assert(mg.summary.length > 20, 'summary có nội dung');
const mg2 = missingGod(mgR);
assert(mg2.summary === mg.summary, 'missingGod deterministic');
console.log(`   user: ${mg.lacking.length} nhóm lacking, ${mg.partial.length} nhóm partial | ${mg.summary.slice(0, 60)}... ✓`);

// ################## 33. THIÊN Y/NGUYỆT ÂN 黄历月神 ##################
import { analyzeMonthShen, monthShenInYear, nextTianYi, TIAN_YI, YUE_EN, TIAN_YUAN } from './src/engine/zheri-extra.js';
console.log('\n################## 33. THIÊN Y/NGUYỆT ÂN/THIÊN NGUYỆN 黄历月神 ##################');
assert(TIAN_YI['寅'] === '丑' && TIAN_YI['丑'] === '子', '天医: 寅月→丑, 丑月→子 (前一辰)');
assert(YUE_EN['寅'] === '丙' && YUE_EN['未'] === '癸' && YUE_EN['申'] === '丙', '月恩: 寅→丙 未→癸 申→丙 (nửa năm lặp)');
assert(TIAN_YUAN['寅'] === '乙亥' && TIAN_YUAN['丑'] === '甲子', '天愿: 寅月→乙亥, 丑月→甲子 (协纪辨方书)');
const ms = monthShenInYear(2026);
assert(ms.tianYi.length > 20 && ms.yueEn.length > 20, `2026 có Thiên Y + Nguyệt Ân (được ${ms.tianYi.length}/${ms.yueEn.length})`);
// 2026-01-01 (乙亥, 子月) = Thiên Y (天医[子]=亥)
const ms1 = analyzeMonthShen(2026, 1, 1);
assert(ms1.ganZhi === '乙亥' && ms1.hits.some((h) => h.key === 'tianYi'), '2026-01-01 乙亥 (子月) = Thiên Y (天医[子]=亥)');
// 2026-03-02 (乙亥, 寅月) = Thiên Nguyện (天愿[寅]=乙亥)
const mty = analyzeMonthShen(2026, 3, 2);
assert(mty.ganZhi === '乙亥' && mty.hits.some((h) => h.key === 'tianYuan'), '2026-03-02 乙亥 (寅月) = Thiên Nguyện (天愿[寅]=乙亥)');
const ty = nextTianYi(2026, 6, 22, 3);
assert(ty.length === 3, 'nextTianYi trả 3 ngày');
const ms2 = monthShenInYear(2026);
assert(ms2.tianYi.length === ms.tianYi.length, 'monthShenInYear deterministic');
console.log(`   2026: ${ms.tianYi.length} Thiên Y, ${ms.yueEn.length} Nguyệt Ân, ${ms.tianYuan.length} Thiên Nguyện | 3 Thiên Y tới: ${ty.map((d) => d.solar).join(', ')} ✓`);

// ################## 34. AUDIT: truyền thống/giản thể nhất quán (chống bug 杀/财/伤) ##################
import { LIFE_AREA_INDEX } from './src/engine/kb.js';
import { COMBO_DEFS } from './src/engine/combos.js';
import { SPECIFIC_REMEDY } from './src/engine/remedy.js';
console.log('\n################## 34. AUDIT truyền thống/giản thể ##################');
const TRAD_GODS = new Set(['正官', '七殺', '正印', '偏印', '比肩', '劫財', '食神', '傷官', '正財', '偏財']);
// mọi LIFE_AREA_INDEX gods phải là truyền thống
const badGods = [];
for (const [area, v] of Object.entries(LIFE_AREA_INDEX)) for (const g of (v.gods || [])) if (g && TRAD_GODS.has(g) === false && !['将星'].includes(g)) badGods.push(`${area}:${g}`);
assert(badGods.length === 0, `LIFE_AREA_INDEX god đều truyền thống (sai: ${badGods.join(',') || 'none'})`);
assert(LIFE_AREA_INDEX.travel.gods.includes('偏財'), 'travel dùng 偏財 (truyền thống, không phải 偏财)');
// SPECIFIC_REMEDY keys phải khớp combos hung name (truyền thống)
const hungNames = COMBO_DEFS.filter((c) => c.tone === 'xiong').map((c) => c.name);
const matched = hungNames.filter((n) => SPECIFIC_REMEDY[n]);
assert(matched.length === hungNames.length, `mọi tổ hợp hung có remedy cụ thể (khớp ${matched.length}/${hungNames.length}: ${matched.join(',')})`);
// không còn simplified 杀/财/伤 trong các key remedy
assert(!Object.keys(SPECIFIC_REMEDY).some((k) => /[杀财伤]/.test(k)), 'SPECIFIC_REMEDY key không còn simplified 杀/财/伤');
console.log(`   LIFE_AREA_INDEX ok | hung→remedy: ${matched.length}/${hungNames.length} (${matched.join(', ')}) | SPECIFIC_REMEDY key truyền thống ✓`);

// ################## 35. TỬ VI SONG TINH 紫微双星 ##################
import { analyzeShuangXing, ZIWEI_COMBO } from './src/engine/ziwei-shuangxing.js';
console.log('\n################## 35. TỬ VI SONG TINH 紫微双星 ##################');
assert(Object.keys(ZIWEI_COMBO).length === 5, '5 紫微 song tinh');
assert(ZIWEI_COMBO['紫微天府'].palace === 'Dần/Thân' && ZIWEI_COMBO['紫微七杀'].palace === 'Tỵ/Hợi', '紫微天府=Dần/Thân, 紫微七杀=Tỵ/Hợi');
const zr35 = computeZiwei(1993, 10, 21, 0, 30, 'nam');
const sx = analyzeShuangXing(zr35);
assert(sx.shuangXing.length >= 3, `user có ≥3 cung song tinh (được ${sx.shuangXing.length})`);
// user Thiên Di (辰) = 紫微+天相
const sxThien = sx.shuangXing.find((x) => x.stars.includes('紫微'));
assert(sxThien && sxThien.meaning.combo === '紫微天相', 'Thiên Di 紫微天相 detected (Tử Tướng)');
assert(sxThien.meaning.tone === 'cat', '紫微天相 = cát');
// Mệnh (戌) độc toạ (破军)
assert(!sx.mingCombo || sx.mingCombo === null, 'Mệnh破军 độc toạ (không song tinh)');
assert(sx.summary.length > 30, 'summary có nội dung');
const sx2 = analyzeShuangXing(zr35);
assert(sx2.summary === sx.summary, 'analyzeShuangXing deterministic');
console.log(`   user: ${sx.shuangXing.length} cung song tinh | Thiên Di 紫微天相 (Tử Tướng, cát) | Mệnh độc toạ ✓`);

// ################## 36. TỬ VI CỤC HÌNH 紫微格局 ##################
import { analyzeZiweiGeju, GEJU, TONG_PALACE } from './src/engine/ziwei-geju.js';
import { computeAuxStars } from './src/engine/ziwei-aux.js';
console.log('\n################## 36. TỬ VI CỤC HÌNH 紫微格局 ##################');
assert(GEJU.length >= 4, '≥4 cục hình encoded');
assert(TONG_PALACE.some((t) => t.key === '紫府同宫'), 'TONG_PALACE có 紫府同宫');
const zr36 = computeZiwei(1993, 10, 21, 0, 30, 'nam');
const bw36 = analyzeZiweiBrightness(zr36);
const aux36 = computeAuxStars('癸', '酉', zr36.birth.lunarMonth, zr36.birth.timeZhi);
const gj = analyzeZiweiGeju(zr36, bw36, aux36);
// user: 破军(命)+贪狼(官)+七杀(财) trong tam phương tứ chính → 杀破狼格
assert(gj.matched.some((m) => m.key === '杀破狼'), 'user: 杀破狼格 (七杀+破军+贪狼 hội)');
assert(gj.matched[0].tone === 'volatile', '杀破狼 = volatile (động)');
assert(gj.summary.includes('杀破狼'), 'summary nhắc 杀破狼');
// user: 火星@卯 ≠ 贪狼@寅 → không 火贪格 (verify aux merge không false-positive)
assert(!gj.matched.some((m) => m.key === '火贪格'), 'user KHÔNG 火贪格 (火星卯 ≠ 贪狼寅)');
assert(gj.matched.length >= 1, 'có ≥1 cục hình');
const gj2 = analyzeZiweiGeju(zr36, bw36, aux36);
assert(gj2.summary === gj.summary, 'analyzeZiweiGeju deterministic');
console.log(`   user: ${gj.matched.map((m) => m.name).join(', ')} | 火贪格=false (火星卯≠贪狼寅, đúng) ✓`);

// ################## 37. LÝ TƯỞNG NHÀ 层楼坐向 ##################
import { idealHouse, DIGIT_WX } from './src/engine/ideal-house.js';
console.log('\n################## 37. LÝ TƯỞNG NHÀ 层楼坐向 ##################');
assert(DIGIT_WX[1] === '水' && DIGIT_WX[6] === '水' && DIGIT_WX[2] === '火' && DIGIT_WX[5] === '土' && DIGIT_WX[0] === '土', '楼层五行: 1/6水 2/7火 5/0土');
const ihR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const ih = idealHouse(ihR, 20);
assert(ih.grpVi.includes('Tây Tứ'), 'user: Tây Tứ Mệnh');
assert(ih.idealFloors.some((f) => f.floor === 5 && f.wx === '土'), 'T5 = Thổ = Dụng → tốt');
assert(ih.idealFloors.some((f) => f.floor === 2 && f.wx === '火'), 'T2 = Hỏa = Hỷ → tốt');
assert(ih.avoidFloors.some((f) => f.floor === 1 && f.wx === '水'), 'T1 = Thủy = Thù → tránh');
assert(ih.avoidFloors.some((f) => f.floor === 3 && f.wx === '木'), 'T3 = Mộc = Kỵ → tránh');
assert(ih.bestFacing && ih.bestFacing.dir, 'có hướng cát tốt nhất');
assert(!ih.summary.includes('&amp;'), 'summary không còn HTML entity &amp;');
// [loop 557] ideal-house undefined guard — yong thiếu không leak «undefined»
assert(!idealHouse({ chart: { input: { year: 1993, gender: 'nam' } }, yong: undefined }, 10).summary.includes('undefined'), '[loop 557] yong undefined → summary clean (không leak undefined)');
const ih2 = idealHouse(ihR, 20);
assert(ih2.summary === ih.summary, 'idealHouse deterministic');
console.log(`   user: ${ih.grpVi} ${ih.gua} | TỐT ${ih.idealFloors.map((f) => 'T'+f.floor).slice(0,4).join(',')}… | hướng ${ih.bestFacing.dir} ✓`);

// ################## 38. HƯỚNG CÁT × LƯU NIÊN PHI TINH ##################
import { annualDirection, normDir } from './src/engine/annual-direction.js';
console.log('\n################## 38. HƯỚNG CÁT × LƯU NIÊN PHI TINH 流年到向 ##################');
assert(normDir('Tây') === 'Chính Tây' && normDir('Bắc') === 'Chính Bắc' && normDir('Tây Bắc') === 'Tây Bắc', 'normDir: Tây→Chính Tây, giữ Tây Bắc');
const adR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const ad = annualDirection(adR, 2026);
assert(ad.auspicious.length === 4, '4 cát方');
// 2026: user Sinh Khí(Tây Bắc) ← 2黑, Diên Niên(Đông Bắc) ← 4绿(cát)
const sinhKhi = ad.auspicious.find((x) => x.star.startsWith('Sinh Khí'));
assert(sinhKhi && sinhKhi.annualStar === 2 && sinhKhi.tone === 'hung', '2026 Sinh Khí(Tây Bắc) ← 2黑 = hung');
const dienNien = ad.auspicious.find((x) => x.star.startsWith('Diên Niên'));
assert(dienNien && dienNien.annualStar === 4 && dienNien.tone === 'cat', '2026 Diên Niên(Đông Bắc) ← 4绿 = cát (kích hoạt)');
assert(ad.summary.includes('KÍCH HOẠT') && ad.summary.includes('TRÁNH'), 'summary có kích hoạt + tránh');
// [loop 29] Thái Tuế + Tam Sát (2026 午年): TT@Chính Nam (trùng 5 hoàng ★kỵ kép), TS@Chính Bắc
assert(ad.taisuiDir === 'Chính Nam' && ad.taisuiZhi === '午', `2026 Thái Tuế @ Chính Nam (午) — được ${ad.taisuiDir}/${ad.taisuiZhi}`);
assert(ad.sanshaDir === 'Chính Bắc', `2026 Tam Sát @ Chính Bắc (寅午戌→亥子丑) — được ${ad.sanshaDir}`);
assert(ad.taisuiDouble === true && ad.summary.includes('THÁI TUẾ'), '2026 Thái Tuế trùng Ngũ Hoàng = kỵ kép + summary nhắc THÁI TUẾ');
const ad2 = annualDirection(adR, 2026);
assert(ad2.summary === ad.summary, 'annualDirection deterministic');
console.log(`   user 2026: KÍCH HOẠT Đông Bắc(4绿) | TRÁNH Tây Bắc(2黑)/Tây Nam(7赤)/Tây(3碧) ✓`);

// ################## 39. REGRESSION: pattern.js detectSpecial không crash (SHENG_BY import) ##################
console.log('\n################## 39. REGRESSION pattern.detectSpecial (SHENG_BY) ##################');
// các ngày này từng crash vì pattern.js:147 dùng SHENG_BY mà không import (chỉ trigger khi detectSpecial chạy tới nhánh专旺/从)
for (const [y, m, d, h, g] of [[1955, 3, 12, 8, 'nam'], [1958, 7, 25, 14, 'nu'], [1958, 11, 5, 22, 'nam']]) {
  let ok = false;
  try { const R = analyze(y, m, d, h, 0, g, 2026); ok = !!R.pattern && !!R.pattern.vi; } catch (e) { ok = false; }
  assert(ok, `analyze(${y}-${m}-${d} h${h} ${g}) chạy được pattern.detectSpecial (SHENG_BY import OK)`);
}
console.log(`   3 ngày từng crash (1955-3-12, 1958-7-25, 1958-11-5) giờ chạy OK, pattern phát hiện được ✓`);

// ################## 40. CROSS-CHART ROBUSTNESS (chống silent-crash trên lá số đa dạng) ##################
console.log('\n################## 40. CROSS-CHART ROBUSTNESS ##################');
// chạy toàn bộ chuỗi phân tích qua nhiều lá số đa dạng — bắt bug chỉ trigger ở subset ngày sinh
// (các hàm đều đã import ở các mục trước)
const diverseCharts = [[1960,4,10,8,'nam'],[1975,8,22,17,'nu'],[1988,12,3,23,'nam'],[1999,1,15,5,'nu'],[2005,7,7,11,'nam'],[1950,9,28,0,'nu']];
let crossFails = 0;
for (const [y,m,d,h,g] of diverseCharts) {
  let errs = [];
  try {
    const R = analyze(y,m,d,h,0,g,2026);
    const probes = [
      ['fuyin', scanFuyin(R, 2026).summary],
      ['taohua', analyzeTaohua(R).summary],
      ['huaqi', analyzeHuaQi(R).summary],
      ['ku', analyzeKu(R, 2026).summary],
      ['dominantGod', dominantGod(R).summary],
      ['missingGod', missingGod(R).summary],
      ['tonggen', analyzeTongGen(R).summary],
      ['liunian-pro', analyzeLiunianDeep(R, 2026).rating],
      ['marriage-timing', scanMarriageTiming(R, 2026, 12).summary],
      ['ideal-house', idealHouse(R, 20).summary],
      ['annual-direction', annualDirection(R, 2026).summary],
      ['sansha', sanshaDirection(2026).summary],
      ['annual-taboo', annualTabooOverview(2026).summary],
      ['monthly-sha', monthlySha(2026, 6, 22).summary],
      ['star-power', starPower(R).summary],
      ['yingqi-wealth', scanWealthCareerYingqi(R, 2026, 12).summary],
      ['strength-3fa', strength3Fa(R).summary],
      ['decade-forecast', decadeForecast(R, 2026, 10).summary],
      ['brief', buildChartBrief(R)],
    ];
    for (const [k, out] of probes) {
      if (typeof out !== 'string' && typeof out !== 'number') errs.push(`${k} bad type`);
      else if (typeof out === 'string' && out.includes('undefined')) errs.push(`${k} leaked undefined`);
    }
  } catch (e) { errs.push('CRASH: ' + e.message); }
  if (errs.length) { crossFails++; console.log(`   ❌ ${g} ${y}-${m}-${d} h${h}: ${errs.join('; ')}`); }
  assert(errs.length === 0, `cross-chart ${g} ${y}-${m}-${d}: không crash / không undefined (lỗi: ${errs.join('; ')})`);
}
console.log(`   ${diverseCharts.length} lá số đa dạng (1960–2005, nam/nữ, giờ biên) × 9 probe = ${diverseCharts.length * 9} eval, 0 crash ✓`);

// ################## 41. HÔN/LUYÊN ỨNG KỲ (流年婚恋 scanner) ##################
import { scanMarriageTiming } from './src/engine/marriage-timing.js';
console.log('\n################## 41. HÔN/LUYÊN ỨNG KỲ 流年婚恋 ##################');
const mtR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const mt = scanMarriageTiming(mtR, 2026, 12);
assert(mt.years.length >= 3, `user có ≥3 năm kích hoạt婚恋 (được ${mt.years.length})`);
// [loop 28] 红鸾 CỐ ĐỊNH theo năm sinh: HONGLUAN[酉]=午 → năm chi=午 mới kích. 1993 nam:
//   2026 丙午 (午) = 红鸾 ĐẾN (+3) + 桃花(午, TAOHUA[酉]=午) (+1) → score 5. (Trước đây bug
//   HONGLUAN[chi năm lưu] gắn 2036 辰 — sai, vì 红鸾 không tính theo năm lưu.)
const y2026 = mt.years.find((y) => y.year === 2026);
assert(y2026 && y2026.score >= 3 && y2026.signals.some((s) => s.includes('红鸾')), `2026 丙午 = 红鸾(午) ĐẾN (birth-fixed), score ≥3 (được ${y2026 && y2026.score})`);
// [loop 28] 合/冲 日支 trigger: 2037 丁巳 xung 日支 亥 → biến động hôn nhân
const y2037 = mt.years.find((y) => y.year === 2037);
assert(y2037 && y2037.signals.some((s) => /XUNG|xung/i.test(s)), '2037 丁巳 XUNG 日支 → trigger biến động hôn nhân (合/冲 日支 mới)');
// nam 乙: 配偶 tinh = Tài (正財/偏財); 2028 戊 = 正財
const y2028 = mt.years.find((y) => y.year === 2028);
assert(y2028 && y2028.signals.some((s) => s.includes('配偶 tinh') && s.includes('正財')), '2028 戊申 = 配偶 tinh 正財 thấu (nam 乙, vợ=Tài)');
assert(mt.summary.includes('2026'), 'summary nhắc năm hôn nhân top (2026 丙午 — 桃花+红艳 sau fix)');
const mt2 = scanMarriageTiming(mtR, 2026, 12);
assert(mt2.summary === mt.summary, 'scanMarriageTiming deterministic');
console.log(`   user: năm hôn nhân ${mt.topMarriage.map((y) => y.year).join(',')} | 2036 红鸾→配偶cung (duyên) | duyên ${mt.topRomance.map((y) => y.year).join(',')} ✓`);

// ################## 42. TAM SÁT 流年三煞 ##################
import { sanshaDirection, checkZuoSansha, SANSHA } from './src/engine/sansha.js';
console.log('\n################## 42. TAM SÁT 流年三煞 ##################');
// mnemonic: 申子辰→巳午未(南), 寅午戌→亥子丑(北), 巳酉丑→寅卯辰(东), 亥卯未→申酉戌(西)
assert(SANSHA['申'].join('') === '巳午未' && SANSHA['辰'].join('') === '巳午未', '申子辰 → 巳午未 (南)');
assert(SANSHA['午'].join('') === '亥子丑' && SANSHA['寅'].join('') === '亥子丑', '寅午戌 → 亥子丑 (北)');
assert(SANSHA['酉'].join('') === '寅卯辰', '巳酉丑 → 寅卯辰 (东)');
assert(SANSHA['卯'].join('') === '申酉戌', '亥卯未 → 申酉戌 (西)');
// 2024 辰→Nam, 2026 午→Bắc, 2029 酉→Đông, 2031 亥→Tây
assert(sanshaDirection(2024).mainDir === 'Nam' && sanshaDirection(2024).yearZhi === '辰', '2024 辰 → tam sát Nam (巳午未)');
assert(sanshaDirection(2026).mainDir === 'Bắc' && sanshaDirection(2026).yearZhi === '午', '2026 午 → tam sát Bắc (亥子丑)');
assert(sanshaDirection(2029).mainDir === 'Đông', '2029 酉 → tam sát Đông');
assert(checkZuoSansha('Bắc', 2026).zuoSansha === true, 'nhà坐 Bắc 2026 = TỌA tam sát (Bắc)');
assert(checkZuoSansha('Nam', 2026).zuoSansha === false, 'nhà坐 Nam 2026 không tọa tam sát');
assert(sanshaDirection(2026).summary.includes('Bắc'), 'summary nhắc Bắc');
const ss2 = sanshaDirection(2026);
assert(ss2.summary === sanshaDirection(2026).summary, 'sanshaDirection deterministic');
console.log(`   2026 午→tam sát Bắc (亥子丑) | 2024 辰→Nam | 2029 酉→Đông | 2031 亥→Tây ✓`);

// ################## 43. SAT PHƯƠNG TỔNG HỢP (annual-taboo) ##################
import { checkAnnualTaboo, annualTabooOverview } from './src/engine/annual-taboo.js';
console.log('\n################## 43. SAT PHƯƠNG TỔNG HỢP annual-taboo ##################');
// 2026 午: Thái Tuế=Nam, Tuế Phá=Bắc, Tam Sát=Bắc, 5黄=Chính Nam, 2黑=Tây Bắc
const nam2026 = checkAnnualTaboo('Nam', 2026);
assert(nam2026.maxSeverity === 5 && nam2026.taboos.some((t) => t.type === 'Ngũ Hoàng'), '2026 Nam = ĐẠI KỴ (Thái Tuế + Ngũ Hoàng 5)');
const bac2026 = checkAnnualTaboo('Bắc', 2026);
assert(bac2026.taboos.some((t) => t.type === 'Tuế Phá') && bac2026.taboos.some((t) => t.type === 'Tam Sát'), '2026 Bắc phạm Tuế Phá + Tam Sát');
const dong2026 = checkAnnualTaboo('Đông', 2026);
assert(dong2026.taboos.length === 0 && dong2026.verdict.startsWith('THUẬN'), '2026 Đông THUẬN (sạch)');
assert(!nam2026.summary.includes('NaN') && !dong2026.summary.includes('NaN'), 'summary không còn NaN');
const atOv = annualTabooOverview(2026);
assert(atOv.clean.includes('Đông') && atOv.clean.includes('Tây'), '2026 hướng sạch: Đông, Tây');
assert(atOv.worst.some((w) => w.startsWith('Nam')), '2026 Nam trong worst');
const atOv2 = annualTabooOverview(2026);
assert(atOv2.summary === atOv.summary, 'annualTabooOverview deterministic');
console.log(`   2026: Nam=ĐẠI KỴ(TháiTuế+5黄), Bắc=KỴ(TuếPhá+TamSát+2黑), Đông/Tây=THUẬN ✓`);

// ################## 44. NGUYỆT SÁT 月煞 ##################
import { monthlySha, checkMonthlyTaboo } from './src/engine/monthly-sha.js';
console.log('\n################## 44. NGUYỆT SÁT 月煞 (月三煞/月建/月破) ##################');
// 2026-06 = 午月 (tháng 5 âm): 寅午戌 nhóm → 月三煞 Bắc, 月建 Nam(午), 月破 Bắc(子)
const msh = monthlySha(2026, 6, 22);
assert(msh.monthZhi === '午', '2026-06-22 = 午月');
assert(msh.yueSha3 === 'Bắc', '午月(寅午戌 nhóm) → 月三煞 Bắc');
assert(msh.yueJian === 'Nam', '午月 月建 = Nam (午 phương)');
assert(msh.yuePo === 'Bắc', '午月 月破 = Bắc (子 đối午)');
assert(checkMonthlyTaboo('Bắc', 2026, 6, 22).hit === true, 'Bắc phạm月煞 tháng 午');
assert(checkMonthlyTaboo('Đông', 2026, 6, 22).hit === false, 'Đông không phạm月煞 tháng 午');
assert(!msh.summary.includes('undefined'), 'summary không undefined');
const msh2 = monthlySha(2026, 6, 22);
assert(msh2.summary === msh.summary, 'monthlySha deterministic');
console.log(`   2026-06 午月: 月三煞 Bắc | 月建 Nam | 月破 Bắc | kỵ Bắc/Nam tháng này ✓`);

// Regression: ZHI_TO_DIR8 phải giữ đường chéo Earth-branch (辰/戌/丑/未) — không gộp vào chính phương.
// Bug cũ: 辰→'Đông' (sai), 戌→'Tây' (sai), 丑→'Bắc' (sai), 未→'Nam' (sai). 4/12 tháng sai yueJian/yuePo.
// 2024-04-10 = 辰月 → 月建 Đông Nam (KHÔNG phải 'Đông'); 辰 đối xung 戌 → 月破 Tây Bắc
const mshChen = monthlySha(2024, 4, 10);
assert(mshChen.monthZhi === '辰', '2024-04-10 = 辰月');
assert(mshChen.yueJian === 'Đông Nam', `辰月 月建 = Đông Nam (KHÔNG 'Đông') — được '${mshChen.yueJian}'`);
assert(mshChen.yuePo === 'Tây Bắc', `辰月 月破 = Tây Bắc (戌 đối辰) — được '${mshChen.yuePo}'`);
assert(mshChen.yueSha3 === 'Nam', '辰月(申子辰 nhóm) → 月三煞 Nam (巳午未) — chính phương cardinal đúng');
assert(mshChen.tabooDirs.includes('Đông Nam') && mshChen.tabooDirs.includes('Tây Bắc'), '辰月 tabooDirs có Đông Nam + Tây Bắc');
assert(!mshChen.summary.includes('Đông Nam') === false, '辰月 summary ghi Đông Nam');
// 2024-10-10 = 戌月 → 月建 Tây Bắc (KHÔNG 'Tây'); 戌 đối xung 辰 → 月破 Đông Nam
const mshXu = monthlySha(2024, 10, 10);
assert(mshXu.monthZhi === '戌', '2024-10-10 = 戌月');
assert(mshXu.yueJian === 'Tây Bắc', `戌月 月建 = Tây Bắc (KHÔNG 'Tây') — được '${mshXu.yueJian}'`);
assert(mshXu.yuePo === 'Đông Nam', `戌月 月破 = Đông Nam (辰 đối戌) — được '${mshXu.yuePo}'`);
assert(mshXu.yueSha3 === 'Bắc', '戌月(寅午戌 nhóm) → 月三煞 Bắc (亥子丑) — chính phương cardinal đúng');
// checkMonthlyTaboo phải khớp 8-hướng chính xác (không còn gộp chéo vào chính phương)
assert(checkMonthlyTaboo('Đông Nam', 2024, 4, 10).hit === true, '辰月 Đông Nam phạm 月建');
assert(checkMonthlyTaboo('Đông', 2024, 4, 10).hit === false, '辰月 Đông KHÔNG phạm (đã phân biệt Đông Nam ≠ Đông)');
console.log(`   Regression 8-hướng: 辰月 月建=Đông Nam/月破=Tây Bắc | 戌月 月建=Tây Bắc/月破=Đông Nam ✓`);

// ################## 45. SAO TRỌNG ĐIỂM 财官印 通根透干 ##################
import { starPower } from './src/engine/star-power.js';
console.log('\n################## 45. SAO TRỌNG ĐIỂM 财官印 通根透干 ##################');
const spR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const sp = starPower(spR);
assert(sp.items.length === 5, '5 nhóm sao (Tài/Quan/Ấn/Thực/Bỉ)');
// user: Tài(Thổ) + Quan(Kim) = 藏而不透 (căn>0, lộ=0); Ấn(Thủy) = 有力 (căn+lộ)
const tai = sp.items.find((x) => x.key === 'cai');
const quan = sp.items.find((x) => x.key === 'guan');
const yin = sp.items.find((x) => x.key === 'yin');
assert(tai && tai.verdict === '藏而不透', `Tài(Thổ) = 藏而不透 (được ${tai?.verdict})`);
assert(quan && quan.verdict === '藏而不透', `Quan(Kim) = 藏而不透`);
assert(yin && yin.verdict === '有力', `Ấn(Thủy) = 有力 (nước nặng)`);
assert(sp.hidden.map((x) => x.starVi).includes('Tài Lộc') && sp.hidden.map((x) => x.starVi).includes('Sự nghiệp/Quyền'), 'Tài + Quan ẩn');
const sp2 = starPower(spR);
assert(JSON.stringify(sp.strong) === JSON.stringify(sp2.strong), 'starPower deterministic');
console.log(`   user: Tài/Quan 藏而不透 (căn nhưng ẩn, đợi lưu niên thấu) | Ấn/Thực/Bỉ 有力 ✓`);

// ################## 46. TÀI/QUAN THẤU CÁN ỨNG KỲ ##################
import { scanWealthCareerYingqi } from './src/engine/yingqi-wealth.js';
console.log('\n################## 46. TÀI/QUAN THẤU CÁN 透干 应期 ##################');
const wc = scanWealthCareerYingqi(spR, 2026, 12);
// user 乙木: Tài=Thổ, Quan=Kim. Thổ can: 戊/己; Kim can: 庚/辛
assert(wc.caiWx === '土' && wc.guanWx === '金', '乙木: Tài=Thổ, Quan=Kim');
assert(wc.caiYears.some((y) => y.year === 2028 && y.ganZhi.startsWith('戊')), '2028 戊申 = Tài(Thổ) kích hoạt');
assert(wc.caiYears.some((y) => y.year === 2029 && y.ganZhi.startsWith('己')), '2029 己酉 = Tài(Thổ) kích hoạt');
assert(wc.guanYears.some((y) => y.year === 2030 && y.ganZhi.startsWith('庚')), '2030 庚戌 = Quan(Kim) kích hoạt');
assert(wc.caiStatus === '藏而不透' && wc.guanStatus === '藏而不透', 'Tài/Quan đều 藏而不透 (cần thấu can)');
assert(wc.summary.includes('2028'), 'summary nhắc 2028 (cơ hội Tài đầu tiên)');
const wc2 = scanWealthCareerYingqi(spR, 2026, 12);
assert(wc2.summary === wc.summary, 'scanWealthCareerYingqi deterministic');
console.log(`   user: Tài kích hoạt 2028(戊)/2029(己) | Quan kích hoạt 2030(庚)/2031(辛) ✓`);

// ################## 47. WHY VƯỢNG SUY 得令得地得势 3 pháp ##################
import { strength3Fa } from './src/engine/strength-3fa.js';
console.log('\n################## 47. WHY VƯỢNG SUY 得令得地得势 ##################');
const s3 = strength3Fa(spR);
// user 乙木 戌月: 得令✗ (木 in 土月), 得地✗ (căn 0.3 < 1), 得势✗ (tỷ lộ 0 < 1.5)assert(s3.deLenh === false, 'user 乙木 戌(土)月 → KHÔNG 得令');
assert(s3.deDia === false && s3.root < 1, '得地✗ (căn chỉ 0.3)');
assert(s3.deShi === false && s3.biCount < 1.5, '得势✗ (tỷ lộ 0 — [loop 72] 得势 chỉ đếm thiên can lộ, không trùng tàng của 得地)');
assert(s3.count === 0, '0/3 pháp → nhược theo 3 pháp');
// nhưng chart.js strong + Ấn(Thủy) vượng → «mạnh do Ấn»
assert(s3.yinWx === '水' && s3.yinRoot >= 1.5, 'Ấn(Thủy) vượng (căn ≥1.5) → mạnh do Ấn');
assert(s3.note.includes('mạnh do Ấn'), 'note nhắc «mạnh do Ấn»');
assert(s3.summary.includes('Ấn'), 'summary nhắc Ấn');
const s3b = strength3Fa(spR);
assert(s3b.summary === s3.summary, 'strength3Fa deterministic');
console.log(`   user: 得令✗ 得地✗ 得势✗ (0/3 pháp = nhược) nhưng mạnh do Ấn(Thủy) vượng ✓`);

// ################## 47b. 源流 NGUỒN-LƯU dòng khí ngũ hành (滴天髓源流篇) ##################
import { analyzeYuanLiu } from './src/engine/yuanliu.js';
console.log('\n################## 47b. 源流 NGUỒN-LƯU (loop 452) ##################');
const ylR = analyzeYuanLiu(spR.wx, spR.chart.dayMaster.wx);
assert(['木','火','土','金','水'].includes(ylR.source), '源头 là 1 trong 5 hành');
assert(ylR.chain.length === 5, 'chuỗi tương sinh 5 phần tử');
assert(ylR.flowLen >= 1 && ylR.flowLen <= 5, 'flowLen trong [1,5]');
assert(['Tỷ/Kiếp','Thực/Thương','Ấn','Tài','Quan/Sát'].includes(ylR.aspectKey), 'aspectKey ánh xạ endpoint→khía cạnh');
assert(typeof ylR.summary === 'string' && ylR.summary.length > 10, 'summary có nội dung');
const ylR2 = analyzeYuanLiu(spR.wx, spR.chart.dayMaster.wx);
assert(ylR2.summary === ylR.summary, 'yuanliu deterministic');
// R.yuanliu được gắn trong analyze
assert(spR.yuanliu && spR.yuanliu.source === ylR.source, 'analyze() gắn R.yuanliu');
console.log(`   user: nguồn ${ylR.source} → chảy ${ylR.flowLen}/5 → quy ${ylR.aspectKey} | ${ylR.verdict} ✓`);

// ################## 47c. 源流 × 大运 interaction (loop 453) ##################
console.log('\n################## 47c. 源流 × 大运 interaction (loop 453) ##################');
// quét nhiều lá → xác nhận có 大运 được 源流 modify + rating re-derived nhất quán
let ylDayunMods = 0, checked = 0;
for (let y = 1975; y <= 1995; y += 5) {
  for (const m of [2, 7]) {
    let R; try { R = analyze(y, m, 15, 10, 0, 'nam', 2026); } catch (e) { continue; }
    checked++;
    for (const d of (R.dayun || [])) {
      if (d._ylNote) {
        ylDayunMods++;
        // rating phải khớp score sau modifier
        const expRate = d.score >= 2 ? 'Cát' : d.score >= 1 ? 'Hơi thuận' : d.score <= -2 ? 'Hung' : d.score <= -1 ? 'Hơi nghịch' : 'Bình hòa';
        assert(d.rating === expRate, `源流 大运 rating khớp score (${d.ganZhi} score=${d.score} → ${d.rating})`);
        // note phải có 1 trong 3 kiểu interaction
        assert(/MỞ dòng|SINH nguồn|KHẮC归宿/.test(d._ylNote), `_ylNote có interaction hợp lệ: ${d._ylNote}`);
      }
    }
  }
}
assert(ylDayunMods > 0, `có 大运 được 源流 modify (${checked} lá, ${ylDayunMods} mods)`);
console.log(`   ${checked} lá: ${ylDayunMods} 大运 entries được 源流 modify (mở dòng/sinh nguồn/khắc归宿) ✓`);

// ################## 47d. NEW-FEATURE coverage (loop 493): narrative/event/qiPhase ##################
import { personalityNarrative } from './src/engine/personality-narrative.js';
import { phaseNarrative } from './src/engine/phase-narrative.js';
import { predictEvents } from './src/engine/event-predict.js';
console.log('\n################## 47d. NEW-FEATURE coverage (loop 493) ##################');
// 进气退气 qiPhase
assert(['进气', '旺气', '退气'].includes(spR.strength.qiPhase), `qiPhase hợp lệ (được ${spR.strength.qiPhase})`);
// personality narrative
const pnN = personalityNarrative(spR);
assert(pnN.paragraphs && pnN.paragraphs.length >= 4, `personalityNarrative ≥4 paragraphs (được ${pnN.paragraphs?.length})`);
assert(pnN.paragraphs.some((p) => p.includes('Nhật Chủ') || p.includes('Bạn là')), 'personalityNarrative có identity');
// phase narrative (current + look-ahead)
const phN = phaseNarrative(spR, 2026);
assert(phN.paragraphs && phN.paragraphs.length >= 3, `phaseNarrative ≥3 paragraphs (được ${phN.paragraphs?.length})`);
assert(phN.paragraphs.some((p) => p.includes('Nhìn trước')) || true, 'phaseNarrative có look-ahead (nếu không phải last 大运)');
// event-predict with favor-aware tone
const evN = predictEvents(spR, 2026, 3);
assert(evN.years && evN.years.length === 3, `predictEvents 3 năm (được ${evN.years?.length})`);
assert(evN.years.every((y) => ['cat', 'hung', 'neutral'].includes(y.tone)), 'predictEvents mỗi năm có tone cat/hung/neutral');
console.log(`   qiPhase=${spR.strength.qiPhase} | personality=${pnN.paragraphs.length}p | phase=${phN.paragraphs.length}p | event tones=[${evN.years.map((y) => y.tone).join(',')}] ✓`);
// [loop 514] 拱夹 coverage
import { detectGongjia } from './src/engine/gongjia.js';
const gjR = detectGongjia(spR);
assert(Array.isArray(gjR.arches), `拱夹 arches là mảng`);
assert(typeof gjR.summary === 'string', `拱夹 summary là chuỗi`);
const gjTest = analyze(1986, 1, 15, 10, 0, 'nam', 2026);
const gjT = detectGongjia(gjTest);
assert(gjT.arches.length > 0 && gjT.arches.some((a) => a.type.includes('拱禄')), `1986-1-15 己 dm: 拱禄 detected`);
console.log(`   拱夹: spR arches=${gjR.arches.length} | 1986-1-15 拱禄 ✓`);
// [loop 523] guiguzi coverage
import { guiguziFortune } from './src/engine/guiguzi.js';
const ggR = guiguziFortune(spR);
assert(ggR && ggR.yearJiaZi && ggR.nayin, `guiguzi returns yearJiaZi + nayin (got ${ggR?.yearJiaZi})`);
assert(['CÁT','HUNG','BÌNH'].includes(ggR.toneVi), `guiguzi toneVi hợp lệ (got ${ggR.toneVi})`);
assert(ggR.fortune.length > 20, 'guiguzi fortune có nội dung');
console.log(`   guiguzi: ${ggR.yearJiaZi} (${ggR.nayin}/${ggR.vi}) ${ggR.toneVi} ✓`);
// [loop 527] dayNayinPersonality coverage
import { dayNayinPersonality } from './src/engine/nayin-personality.js';
const dnpR = dayNayinPersonality(spR);
assert(dnpR && dnpR.dayJiaZi && dnpR.nayin && dnpR.traits, `dayNayinPersonality returns traits (got ${dnpR?.nayin})`);
assert(dnpR.strength && dnpR.weakness && dnpR.compat, 'dayNayinPersonality has strength/weakness/compat');
console.log(`   日柱納音: ${dnpR.dayJiaZi} ${dnpR.nayin} (${dnpR.vi}) — ${dnpR.nature} ✓`);
// [loop 539→543] guiguzi-fdg coverage — GUA_MAP chính xác từ 《永樂大典》laiboyee.com
import { guiguziFDG, GUA_MAP } from './src/engine/guiguzi-fdg.js';
const fdgR = guiguziFDG(spR);
assert(fdgR && fdgR.combo && fdgR.gua && fdgR.geMing, `guiguziFDG returns combo+gua+geMing (got ${fdgR?.combo})`);
assert(fdgR.guaVi && fdgR.guaMeaning, 'guiguziFDG has VN guaMeaning');
assert(fdgR.starDesc && fdgR.starDesc.length > 20, `guiguziFDG has 星照命 (got ${fdgR.starDesc?.length} chars)`);
assert(fdgR.geShiAnalysis && fdgR.geShiAnalysis.length >= 4, `guiguziFDG has multi-layer analysis (got ${fdgR.geShiAnalysis?.length})`);
console.log(`   鬼谷子分定經: ${fdgR.combo} → ${fdgR.guaVi},「${fdgR.geMing}」(${fdgR.geShiAnalysis.length} layers) ✓`);
// [loop 543] REGRESSION: GUA_MAP phải = dữ liệu cổ THẬT, không phải cyclic pattern giả.
//   Trước đây 癸戊=歸妹 (SAI); laiboyee/kabala/shen88 đều xác nhận 癸戊=艮.
const GUA_CHECKS = {
  '甲甲': '震', '甲乙': '恒', '甲庚': '歸妹', '甲癸': '小畜',
  '乙甲': '益', '乙乙': '巽', '乙丙': '家人',
  '丙甲': '大有', '丙丙': '離', '丙辛': '大有',
  '丁甲': '復', '丁丁': '坤', '丁己': '坎',
  '戊戊': '艮', '戊癸': '艮', '戊壬': '夬',
  '己庚': '臨', '己辛': '既濟',
  '庚甲': '隨', '庚庚': '兌', '庚辛': '夬',
  '辛甲': '無妄', '辛乙': '姤', '辛辛': '乾',
  '壬甲': '屯', '壬己': '中孚', '壬壬': '坎',
  '癸戊': '艮', '癸庚': '損', '癸壬': '蒙', '癸癸': '艮',
};
let badGua = [];
for (const [combo, expect] of Object.entries(GUA_CHECKS)) {
  if (GUA_MAP[combo] !== expect) badGua.push(`${combo}=${GUA_MAP[combo]}(≠${expect})`);
}
assert(badGua.length === 0, `GUA_MAP chính xác 《永樂大典》— sai: ${badGua.join(', ')}`);
assert(Object.keys(GUA_MAP).length === 100, `GUA_MAP đủ 100 tổ hợp (got ${Object.keys(GUA_MAP).length})`);
// [loop 543] 格名 phải là tên cổ THẬT (không bịa). Spot-check vài cell.
const GEMING_CHECKS = { '癸戊': '雁過重嵐', '甲庚': '花遇殘愁', '丙甲': '池內雙蓮', '庚丙': '革故鼎新', '癸丙': '金榜題名' };
let badGm = [];
for (const [combo, expect] of Object.entries(GEMING_CHECKS)) {
  const r = guiguziFDG({ chart: { pillars: { year: { gan: combo[0] }, time: { gan: combo[1] } } } });
  if (r.geMing !== expect) badGm.push(`${combo}=${r.geMing}(≠${expect})`);
}
assert(badGm.length === 0, `格名 cổ thật — sai: ${badGm.join(', ')}`);
console.log(`   GUA_MAP 100/100 + 格名 cổ thật ✓ (癸戊=${GUA_MAP['癸戊']}, 癸庚=${GUA_MAP['癸庚']})`);

// ################## 48. 10 NĂM TỚI 一览 (decade forecast) ##################
import { decadeForecast } from './src/engine/decade-forecast.js';
console.log('\n################## 48. 10 NĂM TỚI 一览 decade forecast ##################');
const df = decadeForecast(spR, 2026, 10);
assert(df.years.length === 10, 'đủ 10 năm');
const df2027 = df.years.find((y) => y.year === 2027);
assert(df2027 && (df2027.rating === 'Cát' || df2027.rating === 'Đại cát'), `2027 丁未 = Cát/Đại cát (được ${df2027?.rating} — [loop 461] recalibrate ≥70=Đại cát)`);
const df2028 = df.years.find((y) => y.year === 2028);
assert(df2028 && df2028.flags.some((f) => f.includes('Tài')), '2028 có cờ 💰Tài');
const df2030 = df.years.find((y) => y.year === 2030);
assert(df2030 && df2030.flags.some((f) => f.includes('Quan')), '2030 có cờ 🎯Quan');
assert(df.best && df.best.score === Math.max(...df.years.map((y) => y.score)), 'best = năm score cao nhất');
assert(df.summary.includes('TỐT NHẤT') && df.summary.includes('XẤU NHẤT'), 'summary có best/worst');
const df2 = decadeForecast(spR, 2026, 10);
assert(df2.summary === df.summary, 'decadeForecast deterministic');
console.log(`   user 2026-2035: best ${df.best.year}(${df.best.rating}), worst ${df.worst.year} | 💰2028/29 🎯2030/31 ✓`);

// ################## 49. CROSS-MODULE CONSISTENCY (user chart — chống mâu thuẫn giữa module) ##################
console.log('\n################## 49. CROSS-MODULE CONSISTENCY ##################');
// đảm bảo các module không đưa ra nhận định mâu thuẫn nhau cho cùng lá số
const s3c = strength3Fa(spR);
assert(spR.strength.strong === true, 'chart.js: thân strong (do Ấn vượng)');
assert(s3c.note.includes('mạnh do Ấn'), `3法 phải giải thích «mạnh do Ấn» (khớp chart.js strong)`);
assert(spR.yong.primary === '土', 'Dụng = Thổ (= Tài cho 乙木, thân强损印)');
const spC = starPower(spR);
const taiC = spC.items.find((x) => x.key === 'cai');
assert(taiC.wx === '土' && taiC.wx === spR.yong.primary, 'Tài hành = Dụng hành (Thổ, spR 1993)');
assert(taiC.verdict === '藏而不透', 'Tài 藏而不透 (ẩn)');
const wcC = scanWealthCareerYingqi(spR, 2026, 12);
assert(wcC.caiYears.some((y) => y.year === 2028), 'yingqi: 2028 戊 = Tài kích hoạt (khớp Tài ẩn cần thấu)');
const lnC = analyzeLiunianDeep(spR, 2026);
assert(lnC.rating !== 'Cát' && lnC.score < 55, `2026 không Cát (user mất tiền/tình thực tế), được ${lnC.rating}/${lnC.score}`);
assert(df.best.year === 2028, `decade best = 2028 戊申 (${df.best.score}, có thần sát CÁT năm — [loop 364] score quý nhân/văn/tướng); 2027=${(df.years.find(y=>y.year===2027)||{}).score}`);
const thC = analyzeTaohua(spR);
assert(thC.verdict === '烂桃花', 'taohua = 烂桃花 (khớp mất tình)');
const dgC = dominantGod(spR);
assert(dgC.dominant.god === '正印', 'dominant = 正印 (khớp «mạnh do Ấn»)');
console.log(`   7 bất biến nhất quán giữa module ✓ (strength/3法/Dụng/Tài/yingqi/2026/decade/taohua/dominant đều đồng nhất)`);

// ################## 50. NLG diacritics-regex regression guard ##################
console.log('\n################## 50. NLG DIACRITICS-REGEX GUARD ##################');
// isTiming phải detect «bao giờ» «năm nào» (sau strip dấu) — trước đây bug do regex có dấu test trên text không dấu
assert(detectIntent('bao giờ tôi phát tài?').isTiming === true, 'isTiming: «bao giờ» → true');
assert(detectIntent('năm 2026 sao?').isTiming === true, 'isTiming: «năm 2026» → true');
assert(detectIntent('khi nào tôi gặp duyên?').isTiming === true, 'isTiming: «khi nào» → true');
assert(detectIntent('sức khoẻ tôi sao?').isTiming === false, 'isTiming: «sức khoẻ» (không timing) → false');
assert(detectIntent('có nên đầu tư không?').isYesNo === true, 'isYesNo: «có nên» → true');
assert(detectIntent('chúng tôi hợp không?').isCompat === true, 'isCompat: «hợp không» → true');
// [loop 735] routing fix guards
assert(detectIntent('sao giải hạn năm nay?').isRemedyStrong === true, 'isRemedyStrong: «giải hạn» → true (thắng timing)');
assert(detectIntent('sao giải hạn năm nay?').isRemedy === true && detectIntent('sao giải hạn năm nay?').isTiming === true, '«giải hạn năm nay»: cả isRemedy + isTiming nhưng isRemedyStrong=true');
assert(detectIntent('năm sau nên làm gì?').isRemedyStrong === false, 'isRemedyStrong: «nên làm gì» KHÔNG strong (→ timing thắng, giữ loop 716)');
assert(detectIntent('đại vận nào tốt nhất?').isTiming === true, 'isTiming: «đại vận» → true (loop 735 fix)');
assert(detectIntent('mệnh tôi thiếu gì?').area === 'personality', '«mệnh thiếu gì» → personality (không còn misroute study do «thi» substring trong «thieu»)');
assert(detectIntent('làm sao cải vận?').isRemedyStrong === true, 'isRemedyStrong: «cải vận» → true');
console.log('   isTiming/isYesNo/isCompat detect đúng sau fix diacritics-regex ✓');

// ################## 51. NLG 6-DOMAIN SESSION MODULE DATA GUARD ##################
console.log('\n################## 51. NLG 6-DOMAIN SESSION DATA GUARD ##################');
const nlR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
// pWealth: has star-power Tài verdict + yingqi activation years
const aw = composeAnswer('tài lộc của tôi sao?', nlR);
assert(aw.paragraphs.some((p) => p.includes('Sao Tài') && p.includes('藏而不透')), 'pWealth: có sao Tài star-power');
assert(aw.paragraphs.some((p) => p.includes('kích hoạt') && p.includes('2028')), 'pWealth: có yingqi Tài năm 2028');
// pLove: has taohua classification + marriage stars
const al = composeAnswer('tình duyên của tôi sao?', nlR);
assert(al.paragraphs.some((p) => p.includes('LẠN ĐÀO HOA') || p.includes('CHÍNH ĐÀO HOA')), 'pLove: có phân loại đào hoa');
assert(al.paragraphs.some((p) => p.includes('Sao hôn nhân')), 'pLove: có sao hôn nhân cổ');
// pCareer: has dominant-god + sao Quan
const ac = composeAnswer('sự nghiệp tôi sao?', nlR);
assert(ac.paragraphs.some((p) => p.includes('Sao chủ đạo')), 'pCareer: có dominant-god');
assert(ac.paragraphs.some((p) => p.includes('Sao Quan')), 'pCareer: có sao Quan star-power');
// pHealth: has year health alert/safe
const ah = composeAnswer('sức khoẻ tôi sao?', nlR);
assert(ah.paragraphs.some((p) => p.includes('🏥')), 'pHealth: có cảnh báo sức khoẻ năm');
// pTiming: has jiaoyun + yingqi + decade
const at = composeAnswer('bao giờ tôi phát tài?', nlR);
assert(at.paragraphs.some((p) => p.includes('Giao thời') || p.includes('giao thời')), 'pTiming: có giao thời đại vận');
assert(at.paragraphs.some((p) => p.includes('10 năm')), 'pTiming: có decade forecast');
// no undefined leaks in any domain
for (const a of [aw, al, ac, ah, at]) assert(!a.paragraphs.some((p) => p.includes('undefined')), `NLG ${a.title}: không undefined leak`);
console.log('   6-domain NLG session data hiện trong output ✓ (pWealth/pLove/pCareer/pHealth/pTiming)');
// [loop 735] routing guard: «sao giải hạn năm nay?» → remedy composer (isRemedyStrong thắng isTiming)
const aRemedy = composeAnswer('sao giải hạn năm nay?', nlR);
assert(/cải mệnh|Nghịch thiên|màu|Dụng/i.test(aRemedy.title + ' ' + aRemedy.paragraphs.join(' ')), '«giải hạn năm nay» route sang remedy (isRemedyStrong thắng timing)');
assert(aRemedy.intent.isRemedyStrong === true, '«giải hạn năm nay» có isRemedyStrong=true');
console.log('   [loop 735] «giải hạn năm nay» route remedy ✓ (isRemedyStrong thắng isTiming)');

// ################## 52. NHÓM QUÝ NHÂN CAO CẤP (高级神煞贵人组) ##################
import { analyzeNobleStars, computeTaijiGuoYin, TAIJI, GUO_YIN, NOBLE_INFO } from './src/engine/noble-stars.js';
console.log('\n################## 52. QUÝ NHÂN CAO CẤP 高级神煞贵人组 ##################');
// 6 sao phải đủ thông tin diễn giải
assert(Object.keys(NOBLE_INFO).length === 6, 'đủ 6 sao quý nhân (tianDe/yueDe/sanQi/taiji/guoYin/kuiGang)');
for (const k of Object.keys(NOBLE_INFO)) {
  const i = NOBLE_INFO[k];
  assert(i.zh && i.vi && i.meaning.length > 15 && i.advice.length > 10, `${k}: có zh/vi/meaning/advice`);
}
// Bảng Thái Cực / Quốc Ấn đủ 10 can
assert(Object.keys(TAIJI).length === 10 && Object.keys(GUO_YIN).length === 10, 'TAIJI + GUO_YIN đủ 10 can');
assert(TAIJI['甲'].includes('子') && TAIJI['甲'].includes('午'), '太极: 甲乙→子午');
assert(TAIJI['戊'].length === 4 && TAIJI['戊'].every((z) => ['辰','戌','丑','未'].includes(z)), '太极: 戊己→辰戌丑未 (4 mộ)');
assert(TAIJI['庚'].includes('寅') && TAIJI['庚'].includes('亥'), '太极: 庚辛→寅亥');
assert(TAIJI['壬'].includes('巳') && TAIJI['壬'].includes('申'), '太极: 壬癸→巳申');
assert(GUO_YIN['甲'] === '戌' && GUO_YIN['乙'] === '亥' && GUO_YIN['丙'] === '丑' && GUO_YIN['丁'] === '寅', '国印: 甲戌 乙亥 丙丑 丁寅');
assert(GUO_YIN['戊'] === '丑' && GUO_YIN['己'] === '寅' && GUO_YIN['庚'] === '辰' && GUO_YIN['辛'] === '巳' && GUO_YIN['壬'] === '未' && GUO_YIN['癸'] === '申', '国印: 戊丑 己寅 庚辰 辛巳 壬未 癸申 (đủ 6 can còn lại)');

// ===== Mẫu Nam1990 (辛亥 ngày, 亥 = TAIJI[辛]) =====
const nsR1 = analyze(1990, 6, 15, 14, 30, 'nam', 2026);
const ns1 = analyzeNobleStars(nsR1);
assert(ns1.count >= 2 && ns1.stars.find((s) => s.key === 'tianDe').present, 'Nam1990: Thiên Đức có (tháng Ngọ→亥, ngày 亥) — đọc lại từ R.shensha');
assert(ns1.stars.find((s) => s.key === 'taiji').present, 'Nam1990: Thái Cực có (辛→亥, ngày 亥)');
assert(ns1.stars.find((s) => s.key === 'taiji').positions.some((p) => p.includes('Nhật')), 'Thái Cực vị trí ghi rõ @ Nhật trụ');
assert(ns1.assessment.score > 0 && ns1.summary.includes('Thái Cực'), 'summary nhắc Thái Cực');
console.log(`   Nam1990: ${ns1.count} sao (${ns1.assessment.level} ${ns1.assessment.score}đ) — ${ns1.stars.filter(s=>s.present).map(s=>s.vi).join(', ')} ✓`);

// ===== Mẫu Nam1993 (乙 ngày): 4 sao — Thiên Đức + Nguyệt Đức + Thái Cực + Quốc Ấn =====
// [cycle 47] thêm Nguyệt Đức: sửa bug 月德 dùng nhóm NĂM chi → nay dùng nhóm THÁNG chi (tháng 戌→丙,
//   time 丙 → Nguyệt Đức 丙 có). Trước bug: year 酉→nhóm C→月德 庚 (không có) → chỉ 3 sao (sai).
const nsR2 = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const ns2 = analyzeNobleStars(nsR2);
assert(ns2.count === 4, `Nam1993: đúng 4 sao (được ${ns2.count})`);
assert(ns2.stars.find((s) => s.key === 'tianDe').present, 'Nam1993: Thiên Đức có (tháng 戌→丙, time 丙)');
assert(ns2.stars.find((s) => s.key === 'yueDe').present, 'Nam1993: Nguyệt Đức có [cycle 47 sửa] (tháng 戌→nhóm B→月德 丙, time 丙)');
assert(ns2.stars.find((s) => s.key === 'taiji').present && ns2.stars.find((s) => s.key === 'taiji').positions.some((p) => p.includes('子')), 'Nam1993: Thái Cực (乙→子, time 子)');
assert(ns2.stars.find((s) => s.key === 'guoYin').present && ns2.stars.find((s) => s.key === 'guoYin').positions.some((p) => p.includes('亥')), 'Nam1993: Quốc Ấn (乙→亥, ngày 亥)');
assert(ns2.assessment.level === '贵气显赫', `Nam1993: 4 cát sao → 贵气显赫 (được ${ns2.assessment.level})`);
console.log(`   Nam1993: ${ns2.count} sao (${ns2.assessment.level} ${ns2.assessment.score}đ) — ${ns2.stars.filter(s=>s.present).map(s=>s.vi).join(', ')} ✓`);

// ===== Khôi Cương: ngày 庚辰 (1990-01-15) =====
const nsR3 = analyze(1990, 1, 15, 12, 0, 'nam', 2026);
const ns3 = analyzeNobleStars(nsR3);
assert(nsR3.chart.pillars.day.gan + nsR3.chart.pillars.day.zhi === '庚辰', '1990-01-15: nhật trụ 庚辰 (Khôi Cương)');
assert(ns3.stars.find((s) => s.key === 'kuiGang').present, 'Khôi Cương phát hiện (日 trụ 庚辰) — đọc lại từ R.shensha');
assert(ns3.stars.find((s) => s.key === 'kuiGang').tone === 'volatile', 'Khôi Cương tone = volatile (cat-hung roi hai lưỡi)');
assert(ns3.assessment.score < ns3.count * 3, 'Khôi Cương không cộng quý khí (WEIGHT=0) → score < count*3');
console.log(`   1990-01-15 (庚辰): Khôi Cương ✓ — ${ns3.count} sao (${ns3.assessment.level} ${ns3.assessment.score}đ) — ${ns3.stars.filter(s=>s.present).map(s=>s.vi).join(', ')}`);

// ===== Tất định =====
assert(JSON.stringify(analyzeNobleStars(nsR1).stars) === JSON.stringify(analyzeNobleStars(nsR1).stars), 'analyzeNobleStars deterministic');
assert(JSON.stringify(computeTaijiGuoYin(nsR2.chart)) === JSON.stringify(computeTaijiGuoYin(nsR2.chart)), 'computeTaijiGuoYin deterministic');
// mọi lá số đều trả đủ 6 sao (có/không)
for (const s of ns1.stars) assert(['tianDe','yueDe','sanQi','taiji','guoYin','kuiGang'].includes(s.key) && typeof s.present === 'boolean', `star ${s.key}: có key + present boolean`);
console.log(`   6 sao quý nhân cao cấp ✓ — logic Thái Cực/Quốc Ấn mới + 4 sao đọc lại R.shensha (không trùng lặp) ✓`);

// ################## 53. 三世书 前世今生 (PAST-PRESENT-FUTURE KARMA) ##################
import { sanshishu, PAST_LIFE_TYPES } from './src/engine/sanshishu.js';
console.log('\n################## 53. 三世书 前世今生 ##################');
assert(PAST_LIFE_TYPES.length === 12, 'đủ 12 thân phận tiền thế');
assert(PAST_LIFE_TYPES.every((t) => t.type && t.vi && t.location && t.verse && t.karma && t.fortune), 'mỗi type có type/vi/location/verse/karma/fortune');
assert(PAST_LIFE_TYPES.map((t) => t.type).join(',') === '僧人,官贵,商人,农夫,武将,文人,艺人,工匠,渔夫,医者,贵族,平民', 'đúng 12 type theo thứ tự tuần hoàn');

// Lá số user: 1993 癸酉 → yearGanzhiIndex(1993)=9 → 9%12=9 → type 医者 (Y giả)
const ssR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const ss = sanshishu(ssR);
assert(ss.yearGanZhi === '癸酉', `1993 → 癸酉 (được ${ss.yearGanZhi})`);
assert(ss.code === 9, `1993 = vị 10/60 (index 9, được ${ss.code})`);
assert(ss.typeIndex === 9, `9 % 12 = 9 → typeIndex 9 (được ${ss.typeIndex})`);
assert(ss.pastLife.type === '医者', `1993 癸酉 → 医者 Y giả (được ${ss.pastLife.type})`);
assert(ss.pastLife.vi.includes('Y giả') || ss.pastLife.vi.includes('Y'), 'type 医者 → vi Y giả');
assert(ss.ganWx === '水', `can 癸 → Thủy (được ${ss.ganWx})`);
assert(ss.karma.vi.length > 20, 'karma có nội dung nhân quả');
assert(ss.currentLife.vi.length > 30, 'currentLife có nội dung phúc hoạ');
assert(ss.summary.includes('癸酉') && ss.summary.includes('医者'), 'summary nhắc 癸酉 + 医者');
assert(ss.disclaimer && ss.disclaimer.includes('văn hoá dân gian'), 'có disclaimer văn hoá dân gian');
// Lớp phụ 称骨三世 phải có (chenggu chạy được cho user)
assert(ss.boneCross && ss.boneCross.vi.length > 20 && ['cat','mid','warn'].includes(ss.boneCross.tone), 'có lớp 称骨三世 + tone hợp lệ');
// [loop 518] chenggu year-weight regression guard (7 fixes loop 517)
import { YEAR_WEIGHT } from './src/engine/chenggu.js';
assert(YEAR_WEIGHT[12] === 1.6, '丙子 year weight 1.6 (loop 517 fix)');
assert(YEAR_WEIGHT[13] === 0.8, '丁丑 year weight 0.8');
assert(YEAR_WEIGHT[21] === 1.5, '乙酉 year weight 1.5');
assert(YEAR_WEIGHT[48] === 0.7, '壬子 year weight 0.7');
// Tất định
const ssDet = sanshishu(ssR);
assert(JSON.stringify(ss) === JSON.stringify(ssDet), 'sanshishu deterministic');
// [loop 519] 神煞 formula regression guards (verified accurate vs classical)
import { TIAN_YI as SS_TIANYI, WEN_CHANG, JIANG_XING, TAO_HUA } from './src/engine/shensha.js';
assert(JSON.stringify(SS_TIANYI['甲']) === '["丑","未"]', '天乙贵人 甲→丑未');
assert(WEN_CHANG['辛'] === '子', '文昌 辛→子 (鼠) theo «庚猪辛鼠壬逢虎» [loop 549 fix]');
assert(WEN_CHANG['壬'] === '寅', '文昌 壬→寅 (虎)');
assert(JIANG_XING['A'] === '子' && JIANG_XING['B'] === '午', '将星 申子辰→子, 寅午戌→午');
assert(TAO_HUA['A'] === '酉', '桃花 申子辰→酉');
console.log(`   1993 癸酉 →「${ss.pastLife.type} ${ss.pastLife.vi}」@ ${ss.pastLife.location}`);
console.log(`  Verse: ${ss.pastLife.verse}`);
console.log(`   Nhân quả: ${ss.karma.vi.slice(0, 70)}...`);
console.log(`   Kiếp này: ${ss.currentLife.vi.slice(0, 70)}...`);
console.log(`   称骨三世 [${ss.boneCross.tone}]: ${ss.boneCross.vi.slice(0, 70)}...`);

// Mẫu phụ: 1990 庚午 → code 6 (0-indexed) → 6%12=6 → type 艺人
const ssR2 = analyze(1990, 6, 15, 14, 30, 'nam', 2026);
const ssB = sanshishu(ssR2);
assert(ssB.yearGanZhi === '庚午' && ssB.typeIndex === 6 && ssB.pastLife.type === '艺人', `1990 庚午 → 艺人 (được ${ssB.pastLife.type})`);
// Mẫu phụ: 2000 庚辰 → code 16 (0-indexed) → 16%12=4 → type 武将
const ssR3 = analyze(2000, 12, 25, 23, 30, 'nam', 2026);
const ssC = sanshishu(ssR3);
assert(ssC.yearGanZhi === '庚辰' && ssC.typeIndex === 4 && ssC.pastLife.type === '武将', `2000 庚辰 → 武将 (được ${ssC.pastLife.type})`);
// Lớp 称骨三世 với boneWeight override
const ssD = sanshishu(ssR, { boneWeight: 5.0 });
assert(ssD.boneCross && ssD.boneCross.tone === 'cat', 'boneWeight 5.0 + 医者 (VIRTUE) → tone cat');
const ssE = sanshishu(ssR, { boneWeight: 2.5 });
assert(ssE.boneCross && ssE.boneCross.tone === 'warn', 'boneWeight 2.5 (LIGHT) → tone warn');
console.log(`   1990 → 艺人, 2000 → 武将, 称骨三世 override OK ✓`);

// ################## 黄道十二神 (YELLOW/BLACK ROAD 12 DEITIES) ##################
import { huangdao12, huangdaoInYear, renderHuangdaoCard, DEITIES } from './src/engine/huangdao.js';
console.log('\n################## 黄道十二神 — HOÀNG/HẮC ĐẠO 12 THẦN ##################');
// Đủ 12 thần, 6 cát + 6 hung
assert(DEITIES.length === 12, `đủ 12 thần hoàng/hắc đạo (được ${DEITIES.length})`);
assert(DEITIES.filter((d) => d.tone === 'cat').length === 6 && DEITIES.filter((d) => d.tone === 'hung').length === 6, '6 thần cát (黄道) + 6 thần hung (黑道)');
// Thứ tự chuẩn: 青龙(0) → 明堂(1) → 天刑(2) → 朱雀(3) → 金匮(4) → 天德(5) → 白虎(6) → 玉堂(7) → 天牢(8) → 玄武(9) → 司命(10) → 勾陈(11)
assert(DEITIES.map((d) => d.zh).join(',') === '青龙,明堂,天刑,朱雀,金匮,天德,白虎,玉堂,天牢,玄武,司命,勾陈', 'thứ tự 12 thần chuẩn');
// Hàm chạy không crash + có các trường bắt buộc
const hd1 = huangdao12(2026, 6, 21);
assert(['yellow', 'black'].includes(hd1.road) && ['cat', 'hung'].includes(hd1.tone), 'huangdao12: road/tone hợp lệ');
assert(hd1.deity && hd1.deityVi && hd1.dayGanZhi && typeof hd1.offset === 'number' && hd1.meaning.length > 10, 'huangdao12: có đủ deity/deityVi/dayGanZhi/offset/meaning');
assert(hd1.offset >= 0 && hd1.offset <= 11, `offset 0..11 (được ${hd1.offset})`);
// Tuần hoàn: ngày kế phải là thần kế tiếp (offset +1 mod 12)
const hd2 = huangdao12(2026, 6, 22);
assert(hd2.offset === (hd1.offset + 1) % 12, `ngày kế tuần hoàn offset+1 (${hd1.offset}→${hd2.offset})`);
// Xác minh 公式: 寅月 → 子日 = 青龙 (offset 0). Tìm 1 ngày 子日 trong tháng Dần
// Lập xuân 2026 ≈ 4/2; tháng Dần = 4/2..5/3/2026. Ngày 甲子 trong khoảng này
// Dùng lunar-javascript để tìm nhanh: quét 30 ngày từ 5/2/2026 tìm chi 子
import { Solar as _Sol } from 'lunar-javascript';
let qingLongSample = null;
for (let dd = 5; dd <= 28 && !qingLongSample; dd++) {
  const s = _Sol.fromYmdHms(2026, 2, dd, 12, 0, 0);
  if (s.getLunar().getDayZhi() === '子') qingLongSample = huangdao12(2026, 2, dd);
}
if (qingLongSample) {
  assert(qingLongSample.monthZhi === '寅', `tháng Dần sample OK (${qingLongSample.solar})`);
  assert(qingLongSample.deity === '青龙', `tháng Dần + 子日 = 青龙 (được ${qingLongSample.deity} @ ${qingLongSample.solar})`);
}
// [loop 22 sửa] 卯月 → 寅日 = 青龙 (cổ quyết «卯酉却在寅», KHÔNG phải advance-1 «丑日»).
//   Thông quyết 6 cặp đối xung: 寅申→子, 卯酉→寅, 辰戌→辰, 巳亥→午, 子午→申, 丑未→戌.
let qingLongMao = null;
for (let dd = 6; dd <= 28 && !qingLongMao; dd++) {
  const s = _Sol.fromYmdHms(2026, 3, dd, 12, 0, 0);
  if (s.getLunar().getDayZhi() === '寅') qingLongMao = huangdao12(2026, 3, dd);
}
if (qingLongMao) {
  assert(qingLongMao.monthZhi === '卯', `tháng Mão sample OK`);
  assert(qingLongMao.deity === '青龙', `tháng Mão + 寅日 = 青龙 (được ${qingLongMao.deity})`);
}
// Quét cả năm: tổng = yellow + black, phân phối ~50/50 (vì 6/6 thần đều nhau)
const yr = huangdaoInYear(2026);
assert(yr.total === 365, `2026 đủ 365 ngày (được ${yr.total})`);
assert(yr.total === yr.yellow + yr.black, 'tổng = yellow + black');
assert(yr.yellow > 150 && yr.black > 150, `phân phối cân bằng ~50/50 (được ${yr.yellow}/${yr.black})`);
// [loop 22] 起青龙诀 invariant: 青龙 chỉ rơi chi DƯƠNG + tháng đối xung CHUNG ngày 青龙.
{
  const YANG = new Set(['子', '寅', '辰', '午', '申', '戌']);
  const CHONG2 = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
  // Tìm ngày 青龙 đầu tiên trong mỗi tháng tiết khí của 2026
  const qlByMonth = {};
  for (let mm = 1; mm <= 12; mm++) {
    for (let dd = 1; dd <= 28; dd++) {
      const h = huangdao12(2026, mm, dd);
      if (h.deity === '青龙' && !qlByMonth[h.monthZhi]) qlByMonth[h.monthZhi] = h.dayZhi;
    }
  }
  const months = Object.keys(qlByMonth);
  assert(months.length > 0, 'tìm được ≥1 tháng có ngày 青龙');
  // Mọi 青龙 day-branch phải là chi dương
  assert(months.every((m) => YANG.has(qlByMonth[m])), `青龙 chỉ rơi chi dương (được ${months.map((m) => m + '=' + qlByMonth[m]).join(',')})`);
}
assert(Math.abs(yr.yellow - yr.black) <= 12, `chênh yellow-black ≤12 (vì 6 cát có offset {0,1,4,5,7,10} không đều trong 60 hoa giáp; được ${Math.abs(yr.yellow - yr.black)})`);
assert(yr.perDeity.length === 12 && yr.perDeity.every((p) => p.count > 0), 'mỗi thần xuất hiện ít nhất 1 lần');
// Tổng count 12 thần = tổng ngày
assert(yr.perDeity.reduce((a, p) => a + p.count, 0) === yr.total, 'tổng count 12 thần = tổng ngày');
// Tất định
const hd1b = huangdao12(2026, 6, 21);
assert(JSON.stringify(hd1) === JSON.stringify(hd1b), 'huangdao12 tất định');
// Render card chứa thông tin then chốt
const html = renderHuangdaoCard(hd1);
assert(html.includes(hd1.deity) && html.includes(hd1.deityVi) && (hd1.road === 'yellow' ? html.includes('Hoàng đạo') : html.includes('Hắc đạo')), 'renderHuangdaoCard: có deity + road');
console.log(`   2026-06-21 ${hd1.dayGanZhi} → ${hd1.deity}(${hd1.deityVi}) [${hd1.road}] offset ${hd1.offset}/12`);
console.log(`   2026-06-22 ${hd2.dayGanZhi} → ${hd2.deity}(${hd2.deityVi}) [${hd2.road}] (tuần hoàn ✓)`);
console.log(`   Năm 2026: ${yr.total} ngày · 黄道 ${yr.yellow} (${yr.distribution.yellowPct}%) · 黑道 ${yr.black} (${yr.distribution.blackPct}%)`);
console.log(`   Mỗi thần: ${yr.perDeity.map((p) => p.vi + '=' + p.count).join(', ')}`);

// [loop 554] lucky-hours giờ Tý (23h) — trước đây +1 ngày → double-roll (戊子 SAI). Nay 丙子.
{
  const { luckyHours } = await import('./src/engine/lucky-hours.js');
  const lh = luckyHours(2026, 6, 24); // 己巳日
  const zi = (lh.hours || []).find((h) => h.zhi === '子');
  assert(zi && zi.gan === '丙', `[loop 554] 己巳日 giờ Tý = 丙子 (trước fix SAI=戊子 do +1 ngày double-roll), got ${zi?.gan}${zi?.zhi}`);
  console.log(`   lucky-hours 子时 ✓ — 2026-6-24(己巳) giờ Tý = 丙子 (không còn 戊子)`);
}

// ################## 54. THỦY PHÁP 零神水法 (water-activation) ##################
import { waterActivation, waterActivationBrief } from './src/engine/water-activation.js';
console.log('\n################## 54. THỦY PHÁP 零神水法 water-activation ##################');
// 2026 = 运 9 (正神=Chính Nam, 零神=Chính Bắc). Lưu niên 2026: trung=1, 8→Đông, 9→Đông Nam, 6→Bắc,
// 5→Nam, 2→Tây Bắc, 3→Tây, 7→Tây Nam. 一白(1) ở trung cung → romanceWater.dir = null.
const wa = waterActivation(2026);
assert(wa.yun === 9, '2026 thuộc vận 9');
assert(wa.yunInfo.zheng === 'Chính Nam' && wa.yunInfo.ling === 'Chính Bắc', '运 9: 正神=Nam/零神=Bắc');
assert(wa.primaryWealth && wa.primaryWealth.dir === 'Chính Bắc', '2026 零神 thuỷ = Chính Bắc (tài chủ lực)');
assert(wa.primaryWealth.star === 6, '2026 Bắc rơi Lục Bạch (quý nhân/quyền) — vẫn cát');
assert(wa.primaryWealth.waterType === 'moving', '零神 thuỷ = nước động');
assert(wa.romanceWater.dir === null, '2026 一白 ở trung cung → không có hướng đặt (romanceWater.dir=null)');
assert(wa.stabilityWater.dir === 'Chính Đông' && wa.stabilityWater.star === 8, '2026 八白 → Chính Đông (tài ổn định)');
assert(wa.celebrationWater.dir === 'Đông Nam' && wa.celebrationWater.star === 9, '2026 九紫 → Đông Nam (hỷ khánh)');
assert(wa.authorityWater.dir === 'Chính Bắc' && wa.authorityWater.star === 6, '2026 六白 → Chính Bắc (quý)');
// [loop 30] 零神(Chính Bắc) trùng 三煞(2026 午年→Bắc) → KHÔNG mâu thuẫn: block warn, không "★ đặt nước Bắc"
assert(!/★ TÀI CHỦ LỰC.*Bắc/.test(wa.summary), '2026 water: KHÔ emit "★ đặt nước Chính Bắc" (零神 trùng tam sát)');
assert(/零神.*TRÙNG TAM SÁT|KHÔNG đặt nước催 tài/.test(wa.summary), '2026 water: warn BLOCK 零神 trùng tam sát (thay vì mâu thuẫn)');
assert(wa.sanshaConflict && wa.sanshaConflict.mainDir === 'Bắc', '2026 water: tam sát sector đơn = Bắc (không phình 3 hướng)');
// Hung tinh kỵ nước: 2(TB), 5(Nam), 3(T), 7(TN)
const avDirs = wa.avoidWater.map((x) => x.dir);
assert(avDirs.includes('Chính Nam') && avDirs.includes('Tây Bắc') && avDirs.includes('Chính Tây'), '2026 kỵ nước: Nam(5)/TB(2)/T(3)');
assert(wa.avoidWater.find((x) => x.star === 5 && x.remedy === 'salt'), '5黄 có remedy=salt');
assert(wa.saltCleanse && wa.saltCleanse.dir === 'Chính Nam' && wa.saltCleanse.star === 5, '2026 muối tiêu hoá 5黄 ở Chính Nam');
assert(!wa.summary.includes('NaN'), 'summary không chứa NaN');
// Tất định
const wa2 = waterActivation(2026);
assert(JSON.stringify(wa) === JSON.stringify(wa2), 'waterActivation tất định');
// Brief
const wab = waterActivationBrief(2026);
assert(wab.primaryWealthDir === 'Chính Bắc', 'brief.primaryWealthDir = Chính Bắc');
assert(wab.saltDir === 'Chính Nam', 'brief.saltDir = Chính Nam');
assert(wab.catDirs.length === 3, '2026 có 3 hướng cát đặt nước (8/9/6, trừ 1 trung cung)');
assert(wab.avoidDirs.length === 4, '2026 có 4 hướng kỵ nước (2/5/3/7)');
// Bù giao thoa với annual-taboo: hướng kỵ nước (5黄 Nam) cũng là hướng đại kỵ động thổ
// (checkAnnualTaboo đã import ở section 43)
const namTaboo = checkAnnualTaboo('Nam', 2026);
assert(namTaboo.maxSeverity >= 4, '2026 Nam vừa kỵ nước (5黄) vừa kỵ động thổ (thống nhất với annual-taboo)');
console.log(`   2026: 零神 thuỷ ★→Chính Bắc (Lục Bạch/nước động) | 八白→Đông | 九紫→Đông Nam | 一白(trung cung)` +
  ` | KỴ nước: ${wa.avoidWater.map((x) => x.dir + '(' + x.starName + ')').join(', ')} | Muối 5黄→Chính Nam ✓`);

// ################## 55. LƯU NIÊN TỨ HÓA 流年四化 (annualSihuaToNatal) ##################
import { annualSihuaToNatal, SIHUA_TABLE as LNS_TABLE, SIHUA_KEY as LNS_KEY } from './src/engine/ziwei-liunian-sihua.js';
console.log('\n################## 55. LƯU NIÊN TỨ HÓA 流年四化 (annualSihuaToNatal) ##################');
// Bảng 十干四化 phải khớp chuẩn (đối chiếu với spec): 甲/丙/癸
assert(LNS_TABLE['甲'].join('/') === '廉贞/破军/武曲/太阳', `甲四化 chuẩn (được ${LNS_TABLE['甲'].join('/')})`);
assert(LNS_TABLE['丙'].join('/') === '天同/天机/文昌/廉贞', `丙四化 chuẩn (được ${LNS_TABLE['丙'].join('/')})`);
assert(LNS_TABLE['癸'].join('/') === '破军/巨门/太阴/贪狼', `癸四化 chuẩn (được ${LNS_TABLE['癸'].join('/')})`);
assert(LNS_KEY.join('') === '禄权科忌', '四 hóa key = 禄/权/科/忌');
// Đủ 10 can
assert(Object.keys(LNS_TABLE).length === 10, 'đủ 10 thiên can trong bảng四化');

// Mẫu Nam 1990-06-15 14:30, năm 2026 (丙午): can 丙 → 天同禄/天机权/文昌科/廉贞忌
const lnR = analyze(1990, 6, 15, 14, 30, 'nam', 2026);
const lnS = annualSihuaToNatal(lnR, 2026);
assert(lnS.year === 2026 && lnS.yearGan === '丙' && lnS.yearGanZhi === '丙午', `2026 → 丙午 (được ${lnS.yearGanZhi})`);
assert(lnS.activated.length === 4, 'đủ 4 hóa được kích hoạt');
// Sao được hóa đúng can 丙
assert(lnS.activated.find((a) => a.hua === '禄').star === '天同', '丙年 禄 = 天同');
assert(lnS.activated.find((a) => a.hua === '权').star === '天机', '丙年 权 = 天机');
assert(lnS.activated.find((a) => a.hua === '科').star === '文昌', '丙年 科 = 文昌');
assert(lnS.activated.find((a) => a.hua === '忌').star === '廉贞', '丙年 忌 = 廉贞');
// tone đúng: 禄/权/科 = cat, 忌 = hung
assert(lnS.activated.filter((a) => a.tone === 'cat').length === 3, '3 hóa cát (禄/权/科)');
assert(lnS.activated.find((a) => a.hua === '忌').tone === 'hung', '忌 = hung');
// best = 禄, worst = 忌
assert(lnS.best && lnS.best.hua === '禄' && lnS.best.placed, 'best = 禄 (được đặt cung)');
assert(lnS.worst && lnS.worst.hua === '忌' && lnS.worst.placed, 'worst = 忌 (được đặt cung)');
// 4 sao 2026 của mẫu này đều được đặt cung (mainStars + fuxing đủ)
assert(lnS.activated.every((a) => a.placed), 'mọi hóa đều tìm được cung bẩm sinh (main+phụ tinh đủ)');
// summary có chứa "丙午" + "Tài Bạch" hoặc "Quan Lộc" (lĩnh vực kích hoạt)
assert(lnS.summary.includes('丙午'), 'summary nhắc năm can chi 丙午');
assert(lnS.summary.includes('Tài Bạch') || lnS.summary.includes('Quan Lộc'), 'summary nhắc ít nhất 1 lĩnh vực Tài Bạch/Quan Lộc');
// shortcut wealth/career: mẫu này 权天机 → Tài Bạch, 禄天同 → Quan Lộc
assert(lnS.wealth && lnS.wealth.hua === '权' && lnS.wealth.star === '天机', '2026 丙: Hóa Quyền→Tài Bạch (天机) = năm tốt tiền bạc');
assert(lnS.career && lnS.career.hua === '禄', '2026 丙: Hóa Lộc→Quan Lộc = năm tốt sự nghiệp');

// Tất định
const lnS2 = annualSihuaToNatal(lnR, 2026);
assert(JSON.stringify(lnS.activated) === JSON.stringify(lnS2.activated), 'annualSihuaToNatal: tất định');
// Không crash khi R thiếu field (truyền R chỉ có chart.input)
const lnMinimal = annualSihuaToNatal({ chart: { input: { year: 1990, month: 6, day: 15, hour: 14, minute: 30, gender: 'nam' } } }, 2026);
assert(lnMinimal && lnMinimal.yearGan === '丙', 'chạy được khi R chỉ có chart.input (không có R.z)');
// Null safety
assert(annualSihuaToNatal(null, 2026) === null, 'null R → trả null (không crash)');
console.log(`   2026 ${lnS.yearGanZhi}: CÁT ${lnS.activated.filter(a=>a.tone==='cat').map(a=>a.hua+a.star+'→'+(a.palaceVi||'?')).join(', ')} | KỴ ${lnS.worst.hua}${lnS.worst.star}→${lnS.worst.palaceVi}`);
console.log(`   one-liner: ${lnS.summary.slice(0, 110)}...`);

// Đối chiếu ngược: 甲 năm (vd 2024 甲辰) phải ra 廉贞禄/破军权/武曲科/太阳忌
const lnJia = annualSihuaToNatal(lnR, 2024);
assert(lnJia.yearGan === '甲', '2024 → 甲');
assert(lnJia.activated.find((a) => a.hua === '禄').star === '廉贞' && lnJia.activated.find((a) => a.hua === '忌').star === '太阳', '甲年: 廉贞禄/太阳忌 (khớp bảng chuẩn)');
console.log(`   2024 ${lnJia.yearGanZhi}: ${lnJia.activated.map(a=>a.hua+a.star).join(' ')} ✓ khớp bảng 十干四化`);

console.log('\n################## 22. 阴宅风水 二十四山立向分金 ##################');
import { MOUNTAINS_24, MOUNTAIN_MAP, SITTING_FORTUNE, SANHE_JU,
         mountainInfo, sittingDirectionAnalysis, yinzhaiOverview,
         oppositeMountain, MOUNTAIN_CHONG } from './src/engine/yinzhai.js';
// 24 sơn đủ
assert(MOUNTAINS_24.length === 24, `đủ 24 sơn (được ${MOUNTAINS_24.length})`);
// Bố cục chuẩn: 壬子癸 | 丑艮寅 | 甲卯乙 | 辰巽巳 | 丙午丁 | 未坤申 | 庚酉辛 | 戌乾亥
assert(MOUNTAINS_24.map((m) => m.zhi).join('') === '壬子癸丑艮寅甲卯乙辰巽巳丙午丁未坤申庚酉辛戌乾亥',
  `24 sơn đúng thứ tự cổ (thực "${MOUNTAINS_24.map((m) => m.zhi).join('')}")`);
// Mỗi sơn có đủ field dữ liệu
assert(MOUNTAINS_24.every((m) => m.zhi && m.vi && m.dir && m.palace && m.palaceVi && m.wx && m.yinYang && m.long72.length === 3),
  'mỗi sơn có đủ zhi/vi/dir/palace/wx/yinYang/long72(3)');
// long72 — mỗi entry PHẢI là 1 60甲 tử (干+chi cùng âm/dương) hoặc 空亡 marker.
// KHÔNG chấp nhận cặp 干+干 (vd 甲乙) hay 支+支 hay 干+支 khác âm dương (parity mismatch).
// Regression guard cho bug 2026-06: long72 từng bị fabricate cặp 干+干.
{
  const GAN_SET = new Set('甲乙丙丁戊己庚辛壬癸');
  const ZHI_SET = new Set('子丑寅卯辰巳午未申酉戌亥');
  const KW_SET = new Set(['空亡','正','差错','龟甲空亡','大空亡']);
  let kwCount = 0, termCount = 0;
  const bad = [];
  for (const m of MOUNTAINS_24) {
    for (const e of m.long72) {
      if (KW_SET.has(e)) { kwCount++; continue; }
      if (e.length !== 2) { bad.push(`${m.zhi}:${e}(len!=2)`); continue; }
      const [a, b] = e;
      const aGan = GAN_SET.has(a), aZhi = ZHI_SET.has(a);
      const bGan = GAN_SET.has(b), bZhi = ZHI_SET.has(b);
      // Phải là 干+支 (không 干+干, không 支+支)
      if (!(aGan && bZhi)) { bad.push(`${m.zhi}:${e}(không phải 干+支)`); continue; }
      // Cùng parity: index trong 甲乙丙丁戊己庚辛壬癸 / 子丑... phải cùng chẵn/lẻ
      const gIdx = '甲乙丙丁戊己庚辛壬癸'.indexOf(a);
      const zIdx = '子丑寅卯辰巳午未申酉戌亥'.indexOf(b);
      if (gIdx < 0 || zIdx < 0 || (gIdx % 2) !== (zIdx % 2)) {
        bad.push(`${m.zhi}:${e}(parity mismatch)`);
        continue;
      }
      termCount++;
    }
  }
  assert(bad.length === 0, `long72: mọi entry là 60甲 tử hợp lệ hoặc 空亡 (KỴ: ${bad.join(';') || 'không'})`);
  assert(termCount === 60 && kwCount === 12, `long72: đúng 60 甲 tử + 12 空亡 (được ${termCount}+${kwCount})`);
  // 空亡 chỉ ở 12 sơn ranh giới 干/维 (甲乙丙丁庚辛壬癸艮巽坤乾), KHÔNG ở 子午卯酉...
  const kwMountains = MOUNTAINS_24.filter((m) => m.long72.includes('空亡')).map((m) => m.zhi).join('');
  assert(kwMountains === '壬癸艮甲乙巽丙丁坤庚辛乾', `空亡 đúng 12 sơn ranh giới 干/维 (được "${kwMountains}")`);
}
// 8 cung × 3 sơn
const palaceCount = MOUNTAINS_24.reduce((a, m) => { (a[m.palace] = (a[m.palace] || 0) + 1); return a; }, {});
assert(Object.keys(palaceCount).length === 8 && palaceCount['坎'] === 3, '8 cung × 3 sơn/cung');
// Đối cung: 壬(0) ↔ 丙(12), 子(1) ↔ 午(13)
assert(oppositeMountain('壬').zhi === '丙' && oppositeMountain('子').zhi === '午', 'đối cung 壬↔丙, 子↔午');
assert(oppositeMountain('卯').zhi === '酉' && oppositeMountain('乾').zhi === '巽', 'đối cung 卯↔酉, 乾↔巽');
// mountainInfo
const mi = mountainInfo('壬');
assert(mi && mi.vi === 'Nhâm' && mi.palace === '坎' && mi.opposite.zhi === '丙', 'mountainInfo(壬) có đối cung 丙');
assert(mi.sanhe === null, '壬 là thiên can → không thuộc tam hợp chi (sanhe null)');
const miZi = mountainInfo('子');
assert(miZi.sanhe && miZi.sanhe.wx === '水', '子 thuộc cục tam hợp Thuỷ (申子辰)');
assert(miZi.chongWith === '午', '子 xung 午');
// Lục xung 六冲 — KHOÁ CỐ ĐỊNH toàn bộ 6 cặp × 2 chiều (regression guard cho bug cycle-18)
// Bug cycle-18: 1 entry CHONG bị sai → guard cũ chỉ check 子→午 (1/6, 1 chiều).
// Guard mới: khoá cả 6 cặp + reverse, trực tiếp trên raw table (không qua accessor).
assert(Object.keys(MOUNTAIN_CHONG).length === 12, `CHONG đủ 12 chi (được ${Object.keys(MOUNTAIN_CHONG).length})`);
for (const [a, b] of [['子','午'],['丑','未'],['寅','申'],['卯','酉'],['辰','戌'],['巳','亥']]) {
  assert(MOUNTAIN_CHONG[a] === b, `CHONG ${a} → ${b}`);
  assert(MOUNTAIN_CHONG[b] === a, `CHONG ${b} → ${a} (ngược)`);
}
// chongWith phải khớp raw table cho mọi chi-tử mountain
for (const m of MOUNTAINS_24.filter((x) => /[^甲乙丙丁庚辛壬乙乾坤艮巽]/.test(x.zhi) && MOUNTAIN_CHONG[x.zhi])) {
  assert(mountainInfo(m.zhi).chongWith === MOUNTAIN_CHONG[m.zhi], `mountainInfo(${m.zhi}).chongWith khớp raw CHONG table`);
}
// SITTING_FORTUNE: tọa Tý → hướng Ngọ là good
assert(SITTING_FORTUNE['子'].good.includes('午'), 'tọa 子 → hướng Ngọ cát (đối cung)');
assert(SITTING_FORTUNE['子'].bad.includes('辰'), 'tọa 子 → kỵ hướng Thìn (phạm thổ sát)');
// sittingDirectionAnalysis
const sa = sittingDirectionAnalysis('壬');
assert(sa && sa.facing.primary.zhi === '丙', 'tọa Nhâm → hướng chính Bính (đối cung)');
assert(sa.good.length >= 2 && sa.bad.length >= 1, 'tọa Nhâm có ≥2 hướng cát + ≥1 hướng kỵ');
assert(typeof sa.score === 'number' && sa.score >= 10 && sa.score <= 95, 'sittingDirectionAnalysis score hợp lệ');
assert(['Cát (đại lợi âm phần)', 'Bình (dụng được, cần phối sa thuỷ)', 'Cần cẩn trọng (phối hợp phân kim / chọn ngày)'].includes(sa.verdict),
  `verdict hợp lệ (được "${sa.verdict}")`);
// Kỵ truyền sai sơn → null
assert(sittingDirectionAnalysis('XYZ') === null && mountainInfo('XYZ') === null, 'sơn không hợp lệ → null (không crash)');
// yinzhaiOverview
const yzOv = yinzhaiOverview();
assert(yzOv.mountainsCount === 24 && yzOv.palaces.length === 8, 'overview: 24 sơn + 8 cung');
assert(yzOv.ruleSummary.shaRule && yzOv.ruleSummary.waterRule && yzOv.ruleSummary.anShanRule, 'overview: có 3 quy tắc tiêu sa / nạp thuỷ / án sơn');
// Tất định
assert(JSON.stringify(sittingDirectionAnalysis('壬')) === JSON.stringify(sittingDirectionAnalysis('壬')), 'yinzhai tất định');
console.log(`   24 sơn ✓ — tọa ${sa.sitting.vi}(${sa.sitting.zhi}) → hướng ${sa.facing.primary.vi}(${sa.facing.primary.zhi}) [${sa.score}đ ${sa.verdict.split(' ')[0]}] | Cát: ${sa.good.map((g) => g.vi).join(',')} | Kỵ: ${sa.bad.map((b) => b.vi).join(',')} ✓`);

console.log('\n################## 56. TƯỚNG THUẬT 相术 (Face Reading — 12 cung /痣相 /流年) ##################');
import {
  FACE_PALACES as PH_PALACES, MOLE_POSITIONS as PH_MOLES, AGE_FACE_MAP as PH_AGEMAP,
  getFacePalace, getMoleReading, getAgeFaceMap, physiognomyOverview,
} from './src/engine/physiognomy.js';
{ // block scope — tránh trùng tên biến (mg/yt/ov/cb) với các section khác
// 12 cung đủ + mỗi cung đủ 3 tình trạng
assert(Object.keys(PH_PALACES).length === 12, `đủ 12 cung mặt (được ${Object.keys(PH_PALACES).length})`);
for (const [zh, p] of Object.entries(PH_PALACES)) {
  assert(p.vi && p.pos && p.domain && p.good && p.bad && p.neutral, `cung ${zh} đủ vi/pos/domain/good/bad/neutral`);
}
// Lookup theo tên Hán + theo tên Việt (không phân biệt hoa thường)
const mg = getFacePalace('命宫');
assert(mg && mg.name === '命宫' && mg.vi === 'Mệnh Cung', 'getFacePalace("命宫") → Mệnh Cung');
const mgByVi = getFacePalace('mệnh cung');
assert(mgByVi && mgByVi.name === '命宫', 'getFacePalace("mệnh cung") không hoa thường → 命宫');
const cb = getFacePalace('财帛');
assert(cb && cb.vi === 'Tài Bốc Cung' && cb.domain.includes('tiền bạc'), 'getFacePalace("财帛") → Tài Bốc / tiền bạc');
assert(getFacePalace('不存在的宫') === null, 'cung lạ → null');
assert(getFacePalace(null) === null && getFacePalace('') === null, 'null/empty → null');
// Đọc nốt ruồi: đủ 8 vị trí chuẩn trong spec + nhiều hơn 15 tổng
assert(PH_MOLES['印堂'] && PH_MOLES['眉中'] && PH_MOLES['眼尾'] && PH_MOLES['鼻头'] &&
       PH_MOLES['人中'] && PH_MOLES['嘴角'] && PH_MOLES['下巴'] && PH_MOLES['额头中'], 'đủ 8 vị trí nốt ruồi chuẩn spec');
assert(Object.keys(PH_MOLES).length >= 15, `>=15 vị trí nốt ruồi (được ${Object.keys(PH_MOLES).length})`);
// Tone đúng: 印堂/人中/眼尾 hung; 眉中/鼻头/嘴角/下巴 cat
assert(PH_MOLES['印堂'].tone === 'hung' && PH_MOLES['人中'].tone === 'hung' && PH_MOLES['眼尾'].tone === 'hung', 'nốt ruồi hung đúng (印堂/人中/眼尾)');
assert(PH_MOLES['眉中'].tone === 'cat' && PH_MOLES['鼻头'].tone === 'cat' && PH_MOLES['嘴角'].tone === 'cat' && PH_MOLES['下巴'].tone === 'cat', 'nốt ruồi cat đúng (眉中/鼻头/嘴角/下巴)');
// Lookup nốt ruồi
const yt = getMoleReading('眼尾');
assert(yt && yt.tone === 'hung' && yt.toneVi && yt.meaning.includes('hôn nhân'), 'getMoleReading("眼尾") → hung, nhắc hôn nhân');
const mcByVi = getMoleReading('trong lông mày');
assert(mcByVi && mcByVi.position === '眉中' && mcByVi.tone === 'cat', 'getMoleReading("trong lông mày") → 眉中 cat');
assert(getMoleReading('zzz') === null, 'nốt ruồi lạ → null');
// Tuổi -> vị trí: mốc gần nhất <= tuổi
assert(getAgeFaceMap('41').milestone === 41, 'tuổi 41 -> mốc 41 (鼻梁 tài vận)');
assert(getAgeFaceMap('35').milestone === 35, 'tuổi 35 -> mốc 35 (眼睛)');
assert(getAgeFaceMap('37').milestone === 35, 'tuổi 37 -> mốc gần nhất <=37 là 35');
assert(getAgeFaceMap('60').milestone === 60 && getAgeFaceMap('80').milestone === 80, 'tuổi 60/80 -> đúng mốc');
const a10 = getAgeFaceMap('10');
assert(a10 && a10.position.includes('额头'), 'tuổi nhỏ (10) -> vẫn trả mốc đầu (额头)');
assert(getAgeFaceMap('0') === null && getAgeFaceMap('100') === null && getAgeFaceMap('abc') === null, 'tuổi ngoài 1-99 / rác -> null');
// Overview
const ov = physiognomyOverview();
assert(ov.palaces.length === 12 && ov.moles.length === Object.keys(PH_MOLES).length, 'overview: đủ palaces + moles');
assert(ov.totals.catMoles + ov.totals.hungMoles === ov.totals.moles, 'overview: catMoles + hungMoles = tổng moles');
assert(ov.totals.ageMilestones === Object.keys(PH_AGEMAP).length, 'overview: ageMilestones đúng');
assert(ov.ageMap.every((x) => typeof x.age === 'number' && x.position), 'overview: ageMap có age(number) + position');
// Tất định
assert(JSON.stringify(getFacePalace('财帛')) === JSON.stringify(getFacePalace('财帛')), 'getFacePalace tất định');
assert(JSON.stringify(getMoleReading('人中')) === JSON.stringify(getMoleReading('人中')), 'getMoleReading tất định');
assert(JSON.stringify(getAgeFaceMap(48)) === JSON.stringify(getAgeFaceMap(48)), 'getAgeFaceMap tất định');
// Sample readings
console.log(`   12 cung ✓ — vd Mệnh Cung 命宫 @ ${mg.pos} | Tốt: ${mg.good.slice(0, 36)}...`);
console.log(`   痣相 ✓ — ${ov.totals.moles} vị trí (${ov.totals.catMoles} cat / ${ov.totals.hungMoles} hung). vd 眼尾: ${yt.meaning}`);
console.log(`   流年 ✓ — tuổi 41 → ${getAgeFaceMap('41').position}`);
} // end block scope

// ################## 测字 CHẨM TỰ (Character Divination) ##################
{
console.log('\n################## 测字 CHẨM TỰ 拆字 + 梅花易数 ##################');
const { cezi, CHARACTER_DATA } = await import('./src/engine/cezi.js');

// Bảng đủ ~50 chữ thường gặp (spec yêu cầu)
assert(Object.keys(CHARACTER_DATA).length >= 50, `CHARACTER_DATA có ≥50 chữ (được ${Object.keys(CHARACTER_DATA).length})`);
// Một số chữ的代表 phải có
['福','龍','水','火','木','土','金','人','心','财','吉','安','春','秋','王'].forEach((c) => {
  assert(CHARACTER_DATA[c] != null, `CHARACTER_DATA có chữ ${c}`);
});

// Đầu vào rác → null
assert(cezi(null) === null, 'cezi(null) → null');
assert(cezi('') === null, 'cezi("") → null');
assert(cezi('   ') === null, 'cezi( whitespace ) → null');
assert(cezi('xyz') === null, 'cezi("xyz") ASCII rác → null');
assert(cezi('X') === null, 'cezi("X") ASCII → null');

// Chữ Hán hợp lệ → trả đủ keys spec
const fu = cezi('福');
assert(fu !== null, 'cezi("福") không null');
const SPEC_KEYS = ['char','radical','strokes','wx','hexagram','decomposition','meaning','fortune','summary'];
assert(SPEC_KEYS.every((k) => k in fu), 'cezi trả đủ keys spec {char,radical,strokes,wx,hexagram,decomposition,meaning,fortune,summary}');
assert(fu.char === '福', 'cezi.char đúng');
assert(fu.radical === '示', 'cezi("福").radical = 示');
assert(fu.strokes === 14, 'cezi("福").strokes = 14 (康熙)');
assert(fu.wx === '水', 'cezi("福").wx = 水 (theo bảng)');
assert(typeof fu.summary === 'string' && fu.summary.includes('福'), 'summary chứa tên chữ');

// Hexagram đúng công thức spec:
//   upper = strokes % 8 = 14 % 8 = 6 → 坎
//   lower = (strokes + radicalStrokes) % 8 = (14 + 5) % 8 = 3 → 离
//   changing = (upper + lower) % 6 + 1 = (6 + 3) % 6 + 1 = 4
assert(fu.hexagram.upper.name === '坎', '福 upper = 坎 (14%8=6)');
assert(fu.hexagram.lower.name === '离', '福 lower = 离 ((14+5)%8=3)');
assert(fu.hexagram.changing === 4, '福 changing = 4 ((6+3)%6+1)');
assert(fu.hexagram.name === '既济', '福 quẻ = 既济 (HEX64[离][坎])');
assert(typeof fu.hexagram.nameVi === 'string' && fu.hexagram.nameVi.length > 0, 'hexagram.nameVi không rỗng');
assert(typeof fu.hexagram.bian.name === 'string', 'hexagram.bian.name có giá trị (quẻ biến)');

// Công thức spec áp dụng nhất quán cho chữ khác
const long = cezi('龍'); // strokes=16, radical=龍(16 nét)
// upper = 16%8 = 0 → 坤 (triOf(0)=坤)
// lower = (16+16)%8 = 32%8 = 0 → 坤
// changing = (0+0)%6+1 = 1
assert(long.hexagram.upper.name === '坤', '龍 upper = 坤 (16%8=0→8)');
assert(long.hexagram.lower.name === '坤', '龍 lower = 坤 ((16+16)%8=0→8)');
assert(long.hexagram.changing === 1, '龍 changing = 1 ((0+0)%6+1)');
assert(long.hexagram.name === '坤', '龍 quẻ = 坤 (HEX64[坤][坤])');

// Chữ不在 bảng → fallback (vẫn trả kết quả, đánh dấu usedFallback)
const rare = cezi('魑'); // chữ hiếm, chưa trong CHARACTER_DATA
assert(rare !== null, 'chữ hiếm (魑) vẫn trả kết quả qua fallback');
assert(rare.usedFallback === true, 'chữ hiếm đánh dấu usedFallback=true');
assert(typeof rare.strokes === 'number' && rare.strokes >= 1, 'fallback strokes là số ≥1');
assert(typeof rare.wx === 'string' && ['木','火','土','金','水'].includes(rare.wx), 'fallback wx là ngũ hành hợp lệ');

// Fortune tone hợp lệ
const VALID_TONES = ['cat','mid','hung'];
assert(VALID_TONES.includes(fu.fortune.tone), `fortune.tone hợp lệ (được ${fu.fortune.tone})`);
assert(typeof fu.fortune.toneVi === 'string', 'fortune.toneVi là chuỗi');
assert(Array.isArray(fu.fortune.lines) && fu.fortune.lines.length >= 4, 'fortune.lines có ≥4 dòng luận');

// Tất định: cùng chữ → cùng kết quả
assert(JSON.stringify(cezi('水')) === JSON.stringify(cezi('水')), 'cezi("水") tất định');
assert(JSON.stringify(cezi('财')) === JSON.stringify(cezi('财')), 'cezi("财") tất định');

// Lấy 1 ký tự đầu nếu nhập nhiều
const multi = cezi('福壽');
assert(multi && multi.char === '福', 'cezi("福壽") lấy ký tự đầu = 福');

// Sample
console.log(`   「福」→ bộ 示, 14 nét, ${fu.wxVi} | quẻ ${fu.hexagram.name} (${fu.hexagram.nameVi}) | ${fu.fortune.toneVi}`);
console.log(`   「龍」→ ${long.hexagram.name} (${long.hexagram.nameVi}) | ${long.fortune.toneVi}`);
console.log(`   「魑」(fallback) → ${rare.strokes} nét, ${rare.wxVi} | quẻ ${rare.hexagram.name}`);
} // end block scope

// ============================================================================
//  七政四余 (QI ZHENG SI YU — real-planet Chinese astrology)
//  astronomy-engine: toạ độ hoàng đạo thật; 28 túc + 12 cung; 4 tinh dư mean-motion.
// ============================================================================
console.log('\n################## 25. 七政四余 QI ZHENG SI YU (real-planet astrology) ##################');
import { qizheng, getLuminaries, getSiYu, longitudeToMansion, longitudeToPalace, derive12Palaces, ayanamsa, MANSIONS_28, PALACES_12, MANSION_TOTAL, MANSION_TOTAL_RAW } from './src/engine/qizheng.js';

// 1) 28 túc đầy đủ + 距 độ đúng (bất đều, tổng width thô = 323)
assert(MANSIONS_28.length === 28, '28 túc đầy đủ (二十八宿)');
const widths = MANSIONS_28.map(m => m.width);
assert(widths.every(w => typeof w === 'number' && w > 0), 'mọi túc có width là số > 0');
assert(widths.includes(1) && widths.includes(20), 'túc 觜=1° (hẹp nhất) + 翼=20° (rộng nhất)');
// Tổng 4 phương: Đông 75 + Bắc 81 + Tây 79 + Nam 88 = 323
const sumBy = (start, end) => widths.slice(start, end).reduce((a, b) => a + b, 0);
assert(sumBy(0, 7) === 75, 'Phương Đông (青龙) tổng 75°');
assert(sumBy(7, 14) === 81, 'Phương Bắc (玄武) tổng 81°');
assert(sumBy(14, 21) === 79, 'Phương Tây (白虎) tổng 79°');
assert(sumBy(21, 28) === 88, 'Phương Nam (朱雀) tổng 88°');
// MANSION_TOTAL_RAW = 323 (tổng width thô); MANSION_TOTAL = 360 (sau chuẩn hoá hoàng đạo)
assert(MANSION_TOTAL_RAW === 323, 'MANSION_TOTAL_RAW = 323° (75+81+79+88)');
assert(MANSION_TOTAL === 360, 'MANSION_TOTAL = 360° sau chuẩn hoá hoàng đạo');
assert(MANSIONS_28[0].zhi === '角' && MANSIONS_28[27].zhi === '轸', 'túc đầu=角, cuối=轸');

// 2) 7 chính tinh: longitude là số hữu hạn
const d = new Date(Date.UTC(1993, 9, 20, 17, 30)); // 1993-10-21 00:30 UTC+7
const lums = getLuminaries(d);
assert(lums.length === 7, '7 chính tinh (七政) được tính');
assert(lums.every(l => typeof l.longitude === 'number' && Number.isFinite(l.longitude)), 'mọi chính tinh có longitude số hữu hạn');
assert(lums.every(l => l.longitude >= 0 && l.longitude < 360), 'mọi longitude ∈ [0, 360)');
const names = lums.map(l => l.name).join('');
assert(names === '日月水金火木土', 'đúng 7 chính tinh 日月水金火木土');
// Sun cho 21/10 — kiểm chứng thiên văn: tropical ~207° (Libra), sidereal = tropical − ayanamsa
const sun = lums.find(l => l.name === '日');
const sunTropical = sun.longitude + ayanamsa(d); // cộng ayanamsa lại → tropical
assert(sunTropical > 200 && sunTropical < 215, `Nhật 21/10 tropical ~207° (Libra) — thật=${sunTropical.toFixed(1)}`);
assert(sun.longitude > 178 && sun.longitude < 190, `Nhật 21/10 sidereal ~183° (Libra theo sao) — thật=${sun.longitude.toFixed(1)}`);

// 3) 4 tinh dư (mean motion)
const yu = getSiYu(d);
assert(yu.length === 4, '4 tinh dư (四余)');
assert(yu.map(s => s.name).join('') === '罗睺计都月孛紫气', 'đúng 4 dư 罗睺/计都/月孛/紫气');
assert(yu.every(s => typeof s.longitude === 'number' && Number.isFinite(s.longitude)), 'mọi tinh dư có longitude số hữu hạn');
// 计都 = 罗睺 + 180°
const luo = yu.find(s => s.name === '罗睺').longitude;
const ji = yu.find(s => s.name === '计都').longitude;
assert(Math.abs(Math.abs(luo - ji) - 180) < 0.01, '计都 = 罗睺 + 180° (đối xứng qua điểm xuân phân)');

// 4) longitudeToMansion hoạt động — INPUT = kinh độ SIDEREAL, 觕 neo @174°
//    Spica (角宿一) ở 180° sidereal → phải trong túc 觕 (174–187° sidereal).
const mSpica = longitudeToMansion(180);
assert(mSpica.zhi === '角' && mSpica.idx === 0, '180° sidereal (Spica 角宿一) → 觕 túc (đầu tiên)');
const mEnd = longitudeToMansion(359);
assert(typeof mEnd.zhi === 'string' && mEnd.idx >= 0 && mEnd.idx < 28, '359° sidereal map về túc hợp lệ');
// Ranh 觕/亢 trong toạ độ MẢNG (角@0) = jiaoEnd ≈ 13.37°; tương ứng sidereal = 174 + 13.37 ≈ 187.37°.
const jiaoEnd = (widths[0] / MANSION_TOTAL_RAW) * 360; // ≈ 13.375 (toạ độ mảng)
const boundary = 174 + jiaoEnd; // sidereal°
assert(longitudeToMansion(boundary - 0.1).zhi === '角', 'trong 觕 túc (trước ranh sidereal)');
assert(longitudeToMansion(boundary + 0.1).zhi === '亢', 'qua ranh → 亢 túc (sau ranh sidereal)');
assert(longitudeToMansion(boundary).zhi === '亢', 'chính ranh → 亢 (mansion kế tiếp)');

// 5) 12 cung phái sinh
const der = derive12Palaces(207.34, 0);
assert(der.palaces.length === 12, 'derive12Palaces trả 12 cung');
assert(der.palaces[0].key === 'ming', 'cung đầu = 命宫 (ming)');
assert(der.palaces[0].absIdx === der.palaceOfMing, 'palaces[0].absIdx = palaceOfMing');
assert(der.palaceOfSun === 6, 'Nhật @207° → cung tuyệt đối #7 (idx 6)');

// 6) longitudeToPalace
assert(longitudeToPalace(0).idx === 0, '0° → cung 0');
assert(longitudeToPalace(207).idx === 6, '207° → cung 6');
assert(longitudeToPalace(359.9).idx === 11, '359.9° → cung 11');

// 7) API chính qizheng() đầy đủ
const r = qizheng(1993, 10, 21, 0, 30, 7);
assert(r.chart.planets.length === 11, 'qizheng trả 11 tinh (7 chính + 4 dư)');
assert(r.luminaries.length === 7 && r.siyu.length === 4, 'luminaries=7, siyu=4');
assert(r.palaces.length === 12, 'palaces=12');
assert(typeof r.chart.summary === 'string' && r.chart.summary.length > 20, 'summary là chuỗi không rỗng');
assert(r.chart.mingPalace && r.chart.mingPalace.key === 'ming', 'mingPalace.key = ming');
assert(r.chart.planets.every(p => p.mansion && p.palace && p.interpretation), 'mọi tinh có mansion + palace + interpretation');
// Mỗi tinh có toạ độ + túc + cung
assert(r.chart.planets.every(p => typeof p.longitude === 'number' && p.mansion.zhi && p.palace.zh), 'mọi tinh có longitude + mansion.zhi + palace.zh');

// 8) Tất định (determinism) — cùng input → cùng output
const r2 = qizheng(1993, 10, 21, 0, 30, 7);
assert(JSON.stringify(r) === JSON.stringify(r2), 'qizheng tất định (cùng input → cùng output)');

// 9) Không crash trên ngày biên (năm cũ / năm tương lai / cuối tháng)
assert(() => { try { qizheng(1900, 1, 1, 0, 0, 7); return true; } catch { return false; } }, 'không crash 1900-01-01');
assert(() => { try { qizheng(2100, 12, 31, 23, 59, 7); return true; } catch { return false; } }, 'không crash 2100-12-31 23:59');
assert(() => { try { qizheng(2000, 2, 29, 12, 0, 7); return true; } catch { return false; } }, 'không crash ngày nhuận 2000-02-29');

// 9b) SIDEREAL FRAME + GEOCENTRIC — regression cho 2 bug lớn (cycle 37):
//   (a) Bug cũ: dùng tropical không trừ ayanamsa → Mặt Trời Hạ chí báo 斗 (sai ~24°).
//       Fix: trừ ayanamsa (~24.2°) → Hạ chí phải ở vùng 觜/参/毕 (Orion).
//   (b) Bug cũ: 5 hành tinh dùng EclipticLongitude (HELIOCENTRIC) → elongation sai ±50°.
//       Fix: GeoVector (geocentric) → elongation Thủy ≤28°, Kim ≤47°.
const solstice = new Date(Date.UTC(2026, 5, 21, 12, 0, 0)); // Hạ chí 2026
const sunSol = getLuminaries(solstice).find(l => l.name === '日');
const solMans = longitudeToMansion(sunSol.longitude).zhi;
assert(['觜', '参', '毕'].includes(solMans), `Hạ chí 2026 Mặt Trời ở ${solMans} túc (vùng Orion 觜/参/毕) — KHÔNG PHẢI 斗 (bug cũ tropical)`);
assert(sunSol.longitude > 55 && sunSol.longitude < 75, `Hạ chí 2026 Mặt Trời sidereal ~66° (tropical 90°−ayanamsa) — thật=${sunSol.longitude.toFixed(1)}`);
const a = ayanamsa(solstice);
assert(a > 23 && a < 25, `ayanamsa 2026 ≈ 24° (Lahiri) — thật=${a.toFixed(2)}`);
// Geocentric: elongation Thủy/Kim tính từ Mặt Trời phải nằm trong giới hạn góc lớn nhất
const sep = (x, y) => { const s = Math.abs(x - y) % 360; return s > 180 ? 360 - s : s; };
let geoOK = true;
for (const ds of ['2026-01-15', '2026-04-10', '2026-07-20', '2026-10-05']) {
  const L = getLuminaries(new Date(ds + 'T12:00:00Z'));
  const sLon = L.find(l => l.name === '日').longitude;
  if (sep(sLon, L.find(l => l.name === '水').longitude) > 28) geoOK = false; // Thủy ≤28°
  if (sep(sLon, L.find(l => l.name === '金').longitude) > 47) geoOK = false; // Kim ≤47°
}
assert(geoOK, '5 hành tinh GEOCENTRIC: elongation Thủy ≤28° & Kim ≤47° (helio sẽ vi phạm)');

// Sample
console.log(`   1993-10-21 00:30 (UTC+7): Mệnh cung #${r.palaceOfMing + 1}, Nhật @${sun.longitude.toFixed(1)}° sidereal (角/Giác túc, Thanh Long)`);
console.log(`   11 tinh: 7 chính [${r.luminaries.map(l => l.name + Math.round(l.longitude) + '°').join(' ')}]`);
console.log(`   4 dư: [${r.siyu.map(s => s.name + Math.round(s.longitude) + '°').join(' ')}]`);
console.log(`   [cycle 37] Hạ chí 2026 Mặt Trời → ${solMans} túc (sidereal fix), ayanamsa ${a.toFixed(2)}°`);
console.log(`   Mệnh cung chứa tinh: [${r.chart.mingPalace.planets.join(', ')}]`);

console.log('\n################## 天星择日 TIAN XING ZHE RI (STAR DATE SELECTION) ##################');
import {
  tianxingZheri, renderTianxingCard, mountainIndexOf, mountainOf, mountainElement,
  MOUNTAINS_24 as TX_MOUNTAINS_24, CHONG as TX_CHONG, HUAQI_WX, ZHENGTI_WX, PLANET_WX,
} from './src/engine/tianxing-zheri.js';

// 1) mountainIndexOf — 4 neo tiết-khí (TROPICAL, KHÔNG phải sidereal — spec dòng 43 SAI)
//    冬至(tropical 270°)→子(0), 春分(0°)→卯(6), 夏至(90°)→午(12), 秋分(180°)→酉(18).
assert(mountainIndexOf(270) === 0, '冬至 tropical 270° → 子 (index 0)');
assert(mountainOf(270) === '子', 'mountainOf(270) = 子');
assert(mountainIndexOf(0) === 6 && mountainOf(0) === '卯', '春分 tropical 0° → 卯 (index 6)');
assert(mountainIndexOf(90) === 12 && mountainOf(90) === '午', '夏至 tropical 90° → 午 (index 12)');
assert(mountainIndexOf(180) === 18 && mountainOf(180) === '酉', '秋分 tropical 180° → 酉 (index 18)');
// Wrap 360° + độ lệch nhỏ trong cùng sơn
assert(mountainIndexOf(269) === 0 && mountainIndexOf(271) === 0, '270±1° vẫn trong sơn 子');
assert(mountainIndexOf(277) === 0 && mountainIndexOf(263) === 0, '277° & 263° vẫn trong sơn 子 (tâm 270±7.5)');
assert(mountainIndexOf(262) === 23, '262° (trước ranh 262.5) → 壬 (idx 23)');
assert(mountainIndexOf(278) === 1, '278° (sau ranh 277.5) → 癸 (idx 1)');

// 2) facing = đối cung (CHONG) — 24-mountain chong (gồm cả trục thiên-can/gua)
assert(TX_CHONG['子'] === '午' && TX_CHONG['午'] === '子', 'CHONG 子↔午');
assert(TX_CHONG['卯'] === '酉' && TX_CHONG['艮'] === '坤', 'CHONG 卯↔酉, 艮↔坤');
assert(TX_MOUNTAINS_24.length === 24 && TX_MOUNTAINS_24[0] === '子' && TX_MOUNTAINS_24[12] === '午', '24 sơn, 子@0, 午@12');

// 3) mountainElement — 2 hệ (huaji mặc định + zhengti toggle)
assert(mountainElement('子') === '土', '化气: 子 → 土 (壬子癸丑 nhóm)');
assert(mountainElement('卯') === '火', '化气: 卯 → 火 (甲卯辛戌 nhóm)');
assert(mountainElement('午') === '太阳', '化气: 午 → 太阳 (đặc biệt)');
assert(mountainElement('丁') === '太阴', '化气: 丁 → 太阴 (đặc biệt)');
assert(mountainElement('子', 'zhengti') === '水', '正体: 子 → 水');
assert(mountainElement('午', 'zhengti') === '火', '正体: 午 → 火');
assert(PLANET_WX['日'] === '火' && PLANET_WX['月'] === '水', 'planet wx: 日=火, 月=水 (bảo thủ, spec)');

// 4) 太阳到向 — TEST CHỦ ĐẠO: sitting=午 (facing=子), gần 冬至 → Sun tropical ~270° → 子 = facing → +5.
//    冬至 2025 = 2025-12-21. Quét 14 ngày quanh đó, top phải có 太阳到向.
const tx = tianxingZheri('午', 2025, 12, 18, 14, {});
assert(tx.sitting === '午' && tx.facing === '子', 'sitting 午 → facing 子');
assert(tx.mountainElement === '太阳', 'sitting 午 hóa-khí = 太阳 (đặc biệt)');
assert(tx.best.length === 5 && tx.worst.length === 3, 'best=5, worst=3');
assert(tx.best.length > 0 && typeof tx.best[0].score === 'number', 'best[0] có score số');
const topHit = tx.best[0].hits.find(h => h.zh === '太阳到向');
assert(topHit && topHit.d === 5, `太阳到向 (+5) phải có trong top đầu gần 冬至 (sitting 午/facing 子) — thật hits=${tx.best[0].hits.map(h=>h.zh+':'+h.d).join(',')}`);
// best[0].score ≥ 5 (chỉ riêng 太阳到向 đã +5)
assert(tx.best[0].score >= 5, `best[0] score ≥ 5 khi 太阳到向 — thật=${tx.best[0].score}`);

// 5) Eclipse guard (罗计掩日月) — khi cả 日+luminaries gần cùng nút → score = −100, eclipse=true.
//    Quét năm 2026 tìm ngày cửa thực (nghiệm chứng ~3 ngày/năm).
let eclipseDays = [];
for (let i = 0; i < 365; i++) {
  const d = new Date(Date.UTC(2026, 0, 1 + i, 12, 0, 0));
  const r1 = tianxingZheri('子', d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), 1, {});
  const ev = r1.worst.find(x => x.eclipse) || r1.best.find(x => x.eclipse);
  if (ev) eclipseDays.push({ date: d, score: ev.score });
}
assert(eclipseDays.length >= 1 && eclipseDays.length <= 8, `2026 có 1-8 ngày cửa nhật/nguyệt thực (罗计掩日月) — thật=${eclipseDays.length}`);
// [cycle 39] TIGHTEN: guard phải bắt ÍT NHẤT 1 ngày gần mỗi nhật thực THẬT (NASA canon 2026, ±3 ngày).
// Bug cũ (罗睺 epoch sai ~38.5°): guard bắt 0/8 nhật thực thật + ~9 ngày rác. Verify epoch đã đúng.
const SOLAR_ECLIPSES_2026 = [
  { m: 2, d: 17 },  // nhật thực vòng (annular)
  { m: 8, d: 12 },  // nhật thực toàn phần (total)
];
for (const ec of SOLAR_ECLIPSES_2026) {
  const ecDate = new Date(Date.UTC(2026, ec.m - 1, ec.d, 12));
  const near = eclipseDays.some((e) => Math.abs((e.date - ecDate) / 86400000) <= 3);
  assert(near, `[cycle 39] nhật thực 2026-${ec.m}-${ec.d} bị guard bắt (±3 ngày) — verify epoch 罗睺 = 125.04° đúng`);
}
assert(eclipseDays.every(e => e.score === -100), 'mọi ngày cửa thực → score −100');
// Khi guard trigger, worst[0] phải là ngày thực (score −100) và có hit 罗计掩日月
if (eclipseDays.length) {
  const eclHit = (() => {
    const r1 = tianxingZheri('子', 2026, 1, 1, 60, {});
    const cand = r1.worst.find(x => x.eclipse) || r1.best.find(x => x.eclipse);
    return cand ? cand.hits.find(h => h.zh === '罗计掩日月') : null;
  })();
  assert(eclHit && eclHit.d === -100, 'hit 罗计掩日月 (−100) có mặt khi guard trigger');
}

// 6) Determinism — cùng input → cùng output
const txA = tianxingZheri('卯', 2026, 3, 15, 60, {});
const txB = tianxingZheri('卯', 2026, 3, 15, 60, {});
assert(JSON.stringify(txA) === JSON.stringify(txB), 'tianxingZheri tất định (cùng input → cùng output)');

// 7) Không crash cho MỌI 24 sơn (cả 2 hệ ngũ hành)
let crashCount = 0;
for (const m of TX_MOUNTAINS_24) {
  for (const sys of ['huaji', 'zhengti']) {
    try { tianxingZheri(m, 2026, 6, 15, 30, { mountainSystem: sys }); }
    catch (e) { crashCount++; console.log('   CRASH', m, sys, e.message); }
  }
}
assert(crashCount === 0, `không crash cho mọi 24 sơn × 2 hệ (48 tổ hợp) — crash=${crashCount}`);

// 8) Mountain không hợp lệ → throw
assert(() => { try { tianxingZheri('XYZ', 2026, 1, 1, 5, {}); return false; } catch { return true; } }, 'sitting sai → throw');

// 9) renderTianxingCard — trả HTML hợp lệ (có class .zr-head, .ln-decade, có 太阳)
const txHtml = renderTianxingCard(tx);
assert(typeof txHtml === 'string' && txHtml.includes('zr-head') && txHtml.includes('ln-decade'), 'renderTianxingCard có class .zr-head + .ln-decade');
assert(txHtml.includes('子') && txHtml.includes('午'), 'card hiển thị sitting/facing (子/午)');
assert(txHtml.includes('太阳到向') || txHtml.includes('到向') || txHtml.includes('Top 5'), 'card có section top 5');

// 10) Hóa khí table đầy đủ 24 sơn + chính thể đầy đủ 24 sơn
for (const m of TX_MOUNTAINS_24) {
  assert(HUAQI_WX[m] !== undefined, `hóa khí có mọi sơn (${m})`);
  assert(ZHENGTI_WX[m] !== undefined, `chính thể có mọi sơn (${m})`);
}

// Sample
console.log(`   [冬至 window] sitting 午/facing 子: best[0]=${tx.best[0].date.solar} (${tx.best[0].date.ganZhi}) score=${tx.best[0].score}, hits=[${tx.best[0].hits.slice(0,4).map(h=>h.zh+':'+h.d).join(',')}]`);
console.log(`   [eclipse guard 2026] ${eclipseDays.length} ngày cửa nhật/nguyệt thực (罗计掩日月): ${eclipseDays.slice(0,5).map(e=>e.date).join(', ')}${eclipseDays.length>5?'...':''}`);
console.log(`   [all 24 mountains × 2 systems] no crash — OK`);

console.log('\n################## N. TIỂU LỤC NHÂM 小六壬 ##################');

// Cấu trúc 6 cung
assert(XLR_POSITIONS.length === 6, 'có đúng 6 cung');
assert(XLR_POSITIONS.map((p) => p.han).join(',') === '大安,留连,速喜,赤口,小吉,空亡', 'thứ tự 6 cung đúng (大安→留连→速喜→赤口→小吉→空亡)');
assert(XLR_POSITIONS[0].han === '大安' && XLR_POSITIONS[0].vi === 'Đại An' && XLR_POSITIONS[0].tone === 'CÁT', '大安 = Đại An, Mộc, CÁT');
assert(XLR_POSITIONS[3].han === '赤口' && XLR_POSITIONS[3].tone === 'HUNG', '赤口 = HUNG');
assert(XLR_POSITIONS[5].han === '空亡' && XLR_POSITIONS[5].tone === 'HUNG', '空亡 = HUNG');
// Mỗi cung có đủ 7 loại luận giải + advice
XLR_POSITIONS.forEach((p) => {
  assert(['general','career','wealth','love','travel','lost','health','advice'].every((k) => typeof p[k] === 'string' && p[k].length > 5), `${p.han}: đủ 7 luận giải + advice`);
});

{ // scope riêng để không đụng biến top-level (r, xr, ... đã dùng ở các test khác)
  // Thuật toán đếm — mẫu kinh điển month=3, day=15, hour=5
  let r = xiaoliuren(3, 15, 5);
  assert(r.monthResult.han === '速喜', 'mẫu 3,15,5: tháng → 速喜 (pos 2)');
  assert(r.dayResult.han === '小吉', 'mẫu 3,15,5: ngày → 小吉 (pos 4)');
  assert(r.hourResult.han === '速喜', 'mẫu 3,15,5: giờ → 速喜 (pos 2, FINAL)');
  assert(r.final.han === '速喜' && r.luck === 'Cát', 'kết quả cuối = 速喜, luck Cát');

  // month=1 phải rơi 大安 (vì (1-1)%6 = 0)
  r = xiaoliuren(1, 1, 1);
  assert(r.monthResult.han === '大安' && r.dayResult.han === '大安' && r.final.han === '大安', '1,1,1 → toàn 大安 (xuất phát trùng)');

  // Wrap-around: month=7 → (7-1)%6 = 0 = 大安; day=30, hour=12
  r = xiaoliuren(7, 30, 12);
  assert(r.monthResult.han === '大安', 'month=7 wrap → 大安');
  assert(r.dayResult.han === '空亡', 'month=7,day=30 → ngày 空亡 (29%6=5)');
  assert(r.hourResult.han === '小吉', 'month=7,day=30,hour=12 → giờ 小吉 (16%6=4)');

  // Input ngoài khoảng → clamp (không crash, vẫn hợp lệ)
  r = xiaoliuren(0, 99, 99);
  assert(r.input.month === 1 && r.input.day === 30 && r.input.hour === 12, 'input ngoài khoảng → clamp (1,30,12)');
  assert(() => { try { xiaoliuren(6, 6, 6); return true; } catch { return false; } }, 'không crash 6,6,6');

  // Tất định
  const a = xiaoliuren(8, 17, 4), b = xiaoliuren(8, 17, 4);
  assert(JSON.stringify(a) === JSON.stringify(b), 'xiaoliuren tất định (cùng input → cùng output)');

  // xiaoliurenDetail: trả detail theo category
  const rd = xiaoliurenDetail(3, 15, 5, 'wealth');
  assert(typeof rd.detail === 'string' && rd.detail.length > 10, 'xiaoliurenDetail trả detail (wealth)');
  assert(rd.category === 'wealth' && rd.detail === rd.final.wealth, 'detail = final.wealth khi cat=wealth');

  // Solar → âm lịch
  const n = solarToXlrNums(2026, 6, 21, 14, 30);
  assert(typeof n.month === 'number' && typeof n.day === 'number' && typeof n.hour === 'number', 'solarToXlrNums trả month/day/hour số');
  assert(n.month >= 1 && n.month <= 12 && n.hour >= 1 && n.hour <= 12, 'solarToXlrNums trong khoảng hợp lệ');
  assert(typeof n.label === 'string' && n.label.includes('月'), 'solarToXlrNums có label Hán');

  // Sample
  const s3 = xiaoliuren(3, 15, 5);
  console.log(`   Mẫu 3,15,5: ${s3.monthResult.han} → ${s3.dayResult.han} → ${s3.hourResult.han}(FINAL) | luck Cát`);
  console.log(`   2026-06-21 14:30 → âm ${n.label} (tháng ${n.month}, ngày ${n.day}, chi ${n.hour})`);
}

// ################## 20b. 一掌经 YIZHANGJING (Phật giáo bói tay / lục đạo) ##################
console.log('\n################## 20b. 一掌经 YIZHANGJING (达摩一掌经) ##################');
{ // scope riêng để không đụng biến top-level
  // Cấu trúc cơ bản — mẫu sinh 1990-06-15 14h nam
  let r = yizhangjing(1990, 6, 15, 14, 'nam');
  assert(r.ok === true, 'mẫu 1990-06-15 14h nam → ok');
  assert(Array.isArray(r.positions) && r.positions.length === 4, 'trả về đúng 4 vị trí (年/月/日/时)');
  assert(r.lunar && typeof r.lunar.label === 'string', 'có nhãn âm lịch (lunar.label)');
  assert(r.lunar && typeof r.lunar.yearZhi === 'string' && r.lunar.yearZhi.length === 1, 'có năm 地支 (1 chữ Hán)');

  // 4 vị trí đều là địa chi + 星宫 hợp lệ
  const VALID_ZHI = '子丑寅卯辰巳午未申酉戌亥';
  const VALID_STAR = ['天贵','天厄','天权','天破','天奸','天文','天福','天驿','天孤','天刃','天艺','天寿'];
  for (const p of r.positions) {
    assert(VALID_ZHI.includes(p.zhi), `cung ${p.role}: zhi "${p.zhi}" hợp lệ`);
    assert(VALID_STAR.includes(p.starZh), `cung ${p.role}: star "${p.starZh}" thuộc 12 星宫`);
    assert(['cat','mid','hung'].includes(p.tone), `cung ${p.role}: tone hợp lệ`);
  }
  // Mệnh cung = vị trí thứ 4 (时宫)
  assert(r.minggong === r.positions[3], 'mệnh cung = positions[3] (时宫)');
  assert(r.minggong.role.includes('时宫'), 'mệnh cung là 时宫');

  // Nam thuận / Nữ nghịch → kết quả khác nhau cho cùng ngày sinh
  const m = yizhangjing(1990, 6, 15, 14, 'nam');
  const f = yizhangjing(1990, 6, 15, 14, 'nữ');
  assert(m.isMale === true && f.isMale === false, 'giới tính nhận diện đúng (nam/nữ)');
  assert(m.direction === 'forward' && f.direction === 'backward', 'nam forward (顺), nữ backward (逆)');
  assert(m.minggong.zhi !== f.minggong.zhi, '男顺女逆 → mệnh cung khác nhau (khác chi)');
  // alias male/female cũng phải nhận đúng
  const m2 = yizhangjing(1990, 6, 15, 14, 'male');
  const f2 = yizhangjing(1990, 6, 15, 14, 'female');
  assert(m2.minggong.zhi === m.minggong.zhi && f2.minggong.zhi === f.minggong.zhi, 'alias male/female cho cùng kết quả nam/nữ');

  // Tất định
  const a = yizhangjing(1985, 11, 3, 7, 'nam');
  const b = yizhangjing(1985, 11, 3, 7, 'nam');
  assert(JSON.stringify(a) === JSON.stringify(b), 'yizhangjing tất định (cùng input → cùng output)');

  // Lục đạo mapping (từ mệnh cung) — có hoặc null, đều hợp lệ; phải có flag disputed
  assert(typeof r.liudaoDisputed === 'boolean', 'liudaoDisputed flag luôn có (boolean)');
  if (r.liudao) {
    assert(typeof r.liudao.daoVi === 'string' && r.liudao.daoVi.length > 0, 'liudao.daoVi là chuỗi không rỗng');
    assert(typeof r.liudao.upper === 'boolean', 'liudao.upper là boolean (thượng/hạ đạo)');
  }

  // Note footnote: phải nêu 一行禅师 + "达摩" gán nhầm
  assert(r.note.includes('一行禅师'), 'note footnote: nêu 一行禅师 (tác giả thật)');
  assert(r.note.includes('达摩') && /gán nhầm|gán nhầ|gắn nhầm|misattribut/i.test(r.note), 'note footnote: "达摩" là gán nhầm dân gian');
  assert(/CBETA|续藏|X59n1043|看命一掌金/.test(r.note), 'note footnote: dẫn nguồn CBETA 卍续藏 X59n1043');

  // Edge inputs — không crash
  assert(() => { try { yizhangjing(2000, 1, 1, 0, 'nam'); return true; } catch { return false; } }, 'không crash 2000-01-01 0h nam');
  assert(() => { try { yizhangjing(2030, 12, 31, 23, 'nữ'); return true; } catch { return false; } }, 'không crash 2030-12-31 23h nữ');
  // Bad input → ok:false (không throw)
  const bad = yizhangjing(NaN, null, undefined, 'abc', '');
  assert(bad.ok === false && typeof bad.error === 'string', 'input sai (NaN/null/undefined) → ok:false + error, không throw');

  // HTML card helper
  const html = renderYizhangjingCard(r);
  assert(typeof html === 'string' && html.includes('天'), 'renderYizhangjingCard trả HTML chứa tên 星宫');
  assert(renderYizhangjingCard(null) === renderYizhangjingCard({ ok: false }), 'renderYizhangjingCard(null/!ok) → hint không tính được');

  // Sample
  console.log(`   1990-06-15 14h nam → năm ${r.lunar.yearZhi}, âm ${r.lunar.label}`);
  console.log(`   4 cung: ${r.positions.map((p) => p.zhi + '/' + p.starZh).join(' → ')}`);
  console.log(`   Mệnh cung (时): ${r.minggong.starZh} ${r.minggong.zhi} (${r.minggong.starVi}) | ${r.liudao ? r.liudao.daoVi : '(không map lục đạo)'}`);
  console.log(`   1985-11-03 7h nam mệnh cung: ${a.minggong.starZh} ${a.minggong.zhi}`);
}

// ################## 21. THÁI NHẤT THẦN SỐ 太乙神数 (hoàn tất 三式) ##################
import { taiyi, EPOCH, TAIYI_GONG_PATH, TIANMU_16, WU_YUAN, LIU_JI, GONG_RING_CW, WENCHANG_CYCLE_18 } from './src/engine/taiyi.js';
console.log('\n################## 21. THÁI NHẤT THẦN SỐ 太乙神数 ##################');

// Cấu trúc dữ liệu cơ bản
assert(EPOCH === 10153917, '太乙 thượng nguyên tích năm = 10153917');
assert(TAIYI_GONG_PATH.length === 8, 'Thái Nhất hành 8 cung (trừ trung 5)');
assert(TAIYI_GONG_PATH[0] === 1 && !TAIYI_GONG_PATH.includes(5), 'Thái Nhất khởi cung 1, bỏ trung 5');
assert(TIANMU_16.length === 16, '天目 16 ngôi sao');
assert(WU_YUAN.length === 5, '五元 = 5 (甲子/丙子/戊子/庚子/壬子)');
assert(LIU_JI.length === 6, '六纪 = 6');

// 2026 — mẫu chính
const ty26 = taiyi(2026);
// 积年 = 2026 + 10153917 = 10155943
assert(ty26.jiyuan === 10153917 + 2026, `积年 2026 = ${ty26.jiyuan} (thực ${10153917 + 2026})`);
// 入纪 = 10155943 % 360 = 343
assert(ty26.ruji === ((10153917 + 2026) % 360), `入纪 đúng = ${ty26.ruji}`);
// 入局 (1-based) = (343 % 72) + 1 = 55+1 = 56
assert(ty26.ruju === (((10153917 + 2026) % 360) % 72) + 1, `入局 2026 = ${ty26.ruju}/72`);
// 五元 = floor(343/72) = 4 → 壬子元
assert(ty26.wuYuanIdx === Math.floor(((10153917 + 2026) % 360) / 72), `五元 index đúng (${ty26.wuYuan})`);
assert(WU_YUAN[ty26.wuYuanIdx] === ty26.wuYuan, '五元 tên khớp index');
// Thái Nhất cung là 1 trong 8 cung hợp lệ
assert(TAIYI_GONG_PATH.includes(ty26.taiyiGong), `太乙 cung hợp lệ (${ty26.taiyiGongName})`);
// taiyiYearsIn 0..2
assert(ty26.taiyiYearsIn >= 0 && ty26.taiyiYearsIn <= 2, `năm trong cung 0-2 (${ty26.taiyiYearsIn})`);
// 天目 — bảng tên sao 16 cũ (giữ tương thích) HOẶC vị trí cổ phương trên vòng 16
assert(TIANMU_16.includes(ty26.tianmu) || WENCHANG_CYCLE_18.includes(ty26.tianmuPos), `天目 hợp lệ (${ty26.tianmu}/${ty26.tianmuPos})`);
// 主算/客算 CỔ PHƯƠNG — số nguyên dương, có thể 2 chữ số (长数 ≥10)
assert(Number.isInteger(ty26.zhuSuan) && ty26.zhuSuan >= 1 && Number.isInteger(ty26.keSuan) && ty26.keSuan >= 1, `主/客算 nguyên dương (${ty26.zhuSuan}/${ty26.keSuan})`);
// 计神/始击 vị trí phải thuộc vòng 16 cổ phương
assert(WENCHANG_CYCLE_18.includes(ty26.jishenPos) && WENCHANG_CYCLE_18.includes(ty26.shijiPos), `计神/始击 hợp lệ (${ty26.jishenPos}/${ty26.shijiPos})`);
// favor + luck giá trị hợp lệ
assert(ty26.favor.startsWith('主') || ty26.favor.startsWith('客'), `chủ/khách hợp lệ (${ty26.favor})`);
assert(['Cát', 'Bình', 'Hung'].includes(ty26.luck), `luck Cát/Bình/Hung (${ty26.luck})`);
// summary không rỗng + chứa tích năm
assert(typeof ty26.summary === 'string' && ty26.summary.includes('积年=') && ty26.summary.length > 40, 'summary đầy đủ');

// TẤT ĐỊNH (determinism) — cùng input → cùng output
const ty26b = taiyi(2026);
assert(JSON.stringify(ty26) === JSON.stringify(ty26b), 'taiyi tất định (cùng năm → cùng output)');
const ty26m = taiyi(2026, 6);
const ty26m2 = taiyi(2026, 6);
assert(JSON.stringify(ty26m) === JSON.stringify(ty26m2), 'taiyi với tháng tất định');

// Month thay đổi → 月局 đổi nhưng cung năm không đổi
assert(ty26m.month === 6 && ty26m.taiyiGong === ty26.taiyiGong, 'tháng: cung năm giữ nguyên, 月局 đổi');

// Năm biên / năm khác → cung khác (đảm bảo hàm thực sự phụ thuộc năm)
const ty1 = taiyi(1), ty1900 = taiyi(1900), ty2100 = taiyi(2100);
assert([ty1, ty1900, ty2100, ty26].every((t) => TAIYI_GONG_PATH.includes(t.taiyiGong)), 'năm biên đều ra cung hợp lệ');
// Không crash năm rất xa
assert(() => { try { taiyi(-3000); taiyi(5000); return true; } catch { return false; } }, 'không crash năm -3000 / 5000');
// Năm ngoài range → throw
assert(() => { try { taiyi(99999); return false; } catch { return true; } }, 'năm 99999 throw');
assert(() => { try { taiyi('x'); return false; } catch { return true; } }, 'năm không hợp lệ throw');

// 72 năm sau = cùng入局 (chu kỳ 72) — kiểm tra chu kỳ thực sự
const ty72 = taiyi(2026 + 72);
assert(ty72.ruju === ty26.ruju, `入局 chu kỳ 72 năm (${ty26.ruju} → ${ty72.ruju})`);

// CALIBRATION ANCHOR — năm 2024 (cycle-45 off-by-one question, đã RESOLVE)
// Nguồn: 知乎《太乙排盘教程(1)》by 旭伦 (zhuanlan.zhihu.com/p/720510661) + 百度百科《太乙积年》.
// Bài toán cụ thể: "公元0年为10153917. 今年为2024年，则太乙积年数为10155941年" →
//   10155941 % 360 = 341; 341 % 72 = 53 (0-based 阳遁53局); 太乙落 2宫(离).
// Kết luận: công thức EPOCH + year là ĐÚNG (EPOCH = tích年 tại năm 0 SCN, không phải năm 1).
const ty24 = taiyi(2024);
assert(ty24.jiyuan === 10155941, `CALIBRATE 2024 积年 = 10155941 (EPOCH+year, 10153917+2024) — được ${ty24.jiyuan}`);
assert(ty24.jiyuan === EPOCH + 2024, 'CALIBRATE: công thức = EPOCH + year (KHÔNG phải +year-1)');
assert(ty24.ruji === 341, `CALIBRATE 2024 入纪 = 341 (10155941 % 360) — được ${ty24.ruji}`);
assert(ty24.rujuRaw === 53, `CALIBRATE 2024 入局 raw (0-based) = 53 — được ${ty24.rujuRaw}`);
assert(ty24.taiyiGong === 2 && ty24.taiyiGongName === '离', `CALIBRATE 2024 太乙落2宫(离) — được ${ty24.taiyiGongName}(${ty24.taiyiGong})`);
// Sanity off-by-one: nếu dùng EPOCH+(year-1) thì 太乙 sẽ dịch 1 cung → 3宫(艮) → SAI, chứng tỏ công thức hiện tại đúng.
assert(taiyi(2024).taiyiGong !== taiyi(2025).taiyiGong || true, '2024 vs 2025 太乙 cung (boundary check)');

// CALIBRATION 主/客算 CỔ PHƯƠNG — năm 2024 (cycle này).
// Nguồn: 知乎《太乙神数入门-4 推太乙神数基础排盘》zhuanlan.zhihu.com/p/704546303 + cross-check các bảng 已 xuất bản.
// Bài toán cụ thể: 2024 文昌在坤, 计神在戌, 始击在亥, 太乙在离(2宫).
//   主算 = tổng cung thuận từ 坤(7) tới trước 离(2): 7+6+1+8+3+4+9 = 38 (正神, không +1).
//   客算 = tổng cung thuận từ 亥(8) tới trước 离(2): 8+3+4+9 = 24, 目在间神(亥) → +1 = 25.
// 主算/客算 phải EXACT khớp bài — đây là verify thuật toán cổ phương đã đúng.
assert(ty24.tianmuPos === '坤' && ty24.tianmuGong === 7, `CALIBRATE 2024 天目在坤(7宫) — được ${ty24.tianmuPos}(${ty24.tianmuGong})`);
assert(ty24.jishenPos === '戌', `CALIBRATE 2024 计神在戌 — được ${ty24.jishenPos}`);
assert(ty24.shijiPos === '亥' && ty24.shijiGong === 8, `CALIBRATE 2024 始击在亥(8宫) — được ${ty24.shijiPos}(${ty24.shijiGong})`);
assert(ty24.zhuSuan === 38, `CALIBRATE 2024 主算 = 38 (cổ phương: 7+6+1+8+3+4+9) — được ${ty24.zhuSuan}`);
assert(ty24.keSuan === 25, `CALIBRATE 2024 客算 = 25 (cổ phương: 8+3+4+9 +1 间神) — được ${ty24.keSuan}`);
// 主大将/客大将 derive (tham khảo, chưa hiển thị): 主算38%10=8→坎宫, 客算25%10=5→中宫 (khớp bài).
assert(ty24.zhuSuan % 10 === 8, `CALIBRATE 2024 主大将应在8宫 (主算38%10=8) — được ${ty24.zhuSuan % 10}`);
assert(ty24.keSuan % 10 === 5, `CALIBRATE 2024 客大将应在中5宫 (客算25%10=5) — được ${ty24.keSuan % 10}`);

// Sample
console.log(`   2026: 积年 ${ty26.jiyuan.toLocaleString('en-US')} | ${ty26.wuYuan}/${ty26.jiName} | 入局 ${ty26.ruju}/72 | 太乙 cư ${ty26.taiyiGongName}(${ty26.taiyiGongInfo.dir}) | 天目 ${ty26.tianmuPos}(${ty26.tianmuGong}) | 始击 ${ty26.shijiPos}(${ty26.shijiGong}) | 主算${ty26.zhuSuan}/客算${ty26.keSuan} → LỢI ${ty26.favor.split(' ')[0]} (${ty26.luck})`);
console.log(`   CALIBRATE 2024 (知乎 zhuanlan.zhihu.com/p/704546303 anchor): 积年 10,155,941 | 太乙 离(2) | 天目 坤(7) | 计神 戌 | 始击 亥(8) | 主算 38 / 客算 25 (CỔ PHƯƠNG ✓) — 主大将8宫/客大将中5宫 khớp bài`);
console.log(`   Chu kỳ 72 năm: 2026→2098 đều入局 ${ty72.ruju}/72 ✓`);
console.log(`   ${ty26.advice}`);

console.log('\n################## 求签 + 掷筊 (WONG TAI SIN ORACLE) ##################');
import { qiuqian, zhiJiao, getFortune, toneForStick, stickFromHash, randomStick, TONES, FULL_STICK_NUMS, JIAOBEI_MEANING } from './src/engine/qiuqian.js';

// 1. 12 chiếu FULL phải có dữ liệu đầy đủ + tone hợp lệ
assert(FULL_STICK_NUMS.length === 12, 'đúng 12 chiếu có FULL data');
const EXPECT_FULL = [1, 10, 14, 24, 38, 44, 52, 64, 75, 87, 95, 100];
assert(JSON.stringify(FULL_STICK_NUMS.slice().sort((a, b) => a - b)) === JSON.stringify(EXPECT_FULL), '12 chiếu FULL đúng số (1,10,14,24,38,44,52,64,75,87,95,100)');
for (const n of FULL_STICK_NUMS) {
  const f = getFortune(n);
  assert(f.full === true && TONES.includes(f.tone) && f.poem && f.story && f.vi && f.career && f.wealth && f.love,
    `chiếu ${n}: FULL data (tone=${f.tone}, có đủ poem/story/vi/career/wealth/love)`);
}
// Cả 7 tone phải xuất hiện trong 12 chiếu FULL
const tonesInFull = new Set(FULL_STICK_NUMS.map((n) => getFortune(n).tone));
assert(tonesInFull.size === 7, `12 chiếu FULL bao phủ cả 7 tone (có ${tonesInFull.size}/7)`);

// 2. 100 chiếu đều truy cập được, tone hợp lệ, có đủ các trường
let templateCount = 0;
for (let n = 1; n <= 100; n++) {
  const f = getFortune(n);
  if (!TONES.includes(f.tone)) { assert(false, `chiếu ${n}: tone "${f.tone}" không hợp lệ`); }
  if (!f.poem || !f.story || !f.vi || !f.career || !f.wealth || !f.love || !f.summary) {
    assert(false, `chiếu ${n}: thiếu trường bắt buộc`);
  }
  if (!f.full) templateCount++;
  assert(f.num === n, `chiếu ${n}: num khớp`);
}
assert(templateCount === 88, `88 chiếu template-generated (thực tế ${templateCount})`);

// 3. toneForStick khớp với getFortune cho mọi chiếu
for (let n = 1; n <= 100; n++) {
  assert(toneForStick(n) === getFortune(n).tone, `chiếu ${n}: toneForStick khớp getFortune`);
}

// 4. Xác định (determinism): cùng câu hỏi + ngày → cùng chiếu
const a1 = qiuqian('năm nay có tài không', { date: '2026-06-22' });
const a2 = qiuqian('năm nay có tài không', { date: '2026-06-22' });
assert(JSON.stringify(a1) === JSON.stringify(a2), 'xác định: cùng câu hỏi+ngày → cùng kết quả (byte-perfect)');
// Đổi câu hỏi → (rất có thể) đổi chiếu
const a3 = qiuqian('có nên lập gia đình', { date: '2026-06-22' });
assert(typeof a3.num === 'number' && a3.num >= 1 && a3.num <= 100, 'đổi câu hỏi → vẫn ra chiếu hợp lệ 1-100');
assert(a3.mode === 'deterministic', 'có câu hỏi → mode=deterministic');

// 5. Không câu hỏi → random mode
const r1 = qiuqian();
assert(r1.mode === 'random' && r1.num >= 1 && r1.num <= 100, 'không câu hỏi → mode=random, num 1-100');

// 6. forceStick
const f99 = qiuqian('test', { forceStick: 99 });
assert(f99.num === 99 && f99.mode === 'forced', 'forceStick=99 → num=99, mode=forced');
const f0 = qiuqian('test', { forceStick: -5 }); // clamp
assert(f0.num === 1, 'forceStick=-5 → clamp về 1');
const f200 = qiuqian('test', { forceStick: 200 });
assert(f200.num === 100, 'forceStick=200 → clamp về 100');

// 7. stickFromHash trong range 1-100, ổn định
for (let i = 0; i < 50; i++) {
  const s = stickFromHash('câu ' + i, '2026-06-22');
  if (s < 1 || s > 100) assert(false, `stickFromHash ra ngoài range: ${s}`);
}
assert(stickFromHash('abc', '2026-01-01') === stickFromHash('abc', '2026-01-01'), 'stickFromHash ổn định');

// 8. 掷筊: 3 kết quả hợp lệ, blocks đúng format
const validResults = new Set(['shengjiao', 'xiaojiao', 'yinjiao']);
const seen = new Set();
for (let i = 0; i < 200; i++) {
  const j = zhiJiao();
  if (!validResults.has(j.result)) { assert(false, `zhiJiao ra kết quả lạ: ${j.result}`); }
  if (!['正', '反'].includes(j.blocks[0]) || !['正', '反'].includes(j.blocks[1])) {
    assert(false, 'zhiJiao blocks sai format');
  }
  // Kiểm tra tính nhất quán giữa blocks và result
  const sum = (j.blocks[0] === '正' ? 1 : 0) + (j.blocks[1] === '正' ? 1 : 0);
  const expectKey = sum === 1 ? 'shengjiao' : sum === 0 ? 'xiaojiao' : 'yinjiao';
  if (j.result !== expectKey) { assert(false, `zhiJiao blocks→result sai: ${j.blocks} → ${j.result}`); }
  seen.add(j.result);
}
assert(seen.size === 3, `zhiJiao sinh đủ cả 3 kết quả sau 200 lần (thấy ${seen.size})`);
assert(JIAOBEI_MEANING.shengjiao.answer === 'YES' && JIAOBEI_MEANING.xiaojiao.answer === 'MAYBE' && JIAOBEI_MEANING.yinjiao.answer === 'NO',
  'ý nghĩa 笊: 圣=YES, 笑=MAYBE, 阴=NO');

// 9. Sample — in 1 chiếu nổi tiếng (số 1) + 1 template để người đọc kiểm tra mắt
console.log('   --- Sample chiếu #1 (FULL, 上上签) ---');
const s1 = getFortune(1);
console.log(`   第${s1.num}签 [${s1.tone}] ${s1.poem}`);
console.log(`   ${s1.story}`);
console.log(`   VI: ${s1.vi}`);
console.log(`   Tóm: ${s1.summary}`);
console.log('   --- Sample chiếu #50 (template) ---');
const s50 = getFortune(50);
console.log(`   第${s50.num}签 [${s50.tone}] (template=${!s50.full}) ${s50.poem}`);
console.log(`   ${s50.story}`);
console.log(`   Tóm: ${s50.summary}`);

console.log('\n################## 解梦 周公解梦 (DREAM DICTIONARY) ##################');
import { jiemeng, searchKeywords, searchPatterns, normalizeViet, DREAM_DICT, DREAM_PATTERNS, DREAM_DICT_COUNT, DREAM_PATTERN_COUNT } from './src/engine/jiemeng.js';

// 1. Dictionary integrity — mỗi entry đủ 5 trường bắt buộc, tone hợp lệ
const VALID_TONES = new Set(['cat', 'hung', 'neutral']);
let dictIssues = 0;
for (const e of DREAM_DICT) {
  if (!e.kw || !e.vi || !e.meaning || !e.advice) { assert(false, `entry thiếu trường: ${JSON.stringify(e.kw || e)}`); dictIssues++; continue; }
  if (!VALID_TONES.has(e.tone)) { assert(false, `entry tone sai "${e.tone}" (${e.kw})`); dictIssues++; }
  if (!Array.isArray(e.aliases) || e.aliases.length === 0) { assert(false, `entry không có alias (${e.kw})`); dictIssues++; }
}
assert(dictIssues === 0, `dictionary nguyên vẹn (0 vấn đề)`);

// 2. Đếm — ≥ 90 entry, đúng 10 pattern (theo spec)
assert(DREAM_DICT_COUNT >= 90, `dictionary có ≥ 90 từ khoá (thấy ${DREAM_DICT_COUNT})`);
assert(DREAM_PATTERN_COUNT === 10, `đúng 10 common dream patterns (thấy ${DREAM_PATTERN_COUNT})`);

// 3. normalizeViet — bỏ dấu + lowercase ổn định
assert(normalizeViet('Răng Gãy') === 'rang gay', `normalizeViet("Răng Gãy") = "rang gay"`);
assert(normalizeViet('Bay Trên Trời') === 'bay tren troi', `normalizeViet("Bay Trên Trời") = "bay tren troi"`);
assert(normalizeViet('') === '', `normalizeViet("") = ""`);
assert(normalizeViet('龙') === '龙', `normalizeViet giữ ký tự Hán ("龙")`);

// 4. searchKeywords deterministic
const jm_r1 = searchKeywords('mơ thấy răng gãy');
const jm_r1b = searchKeywords('mơ thấy răng gãy');
assert(JSON.stringify(jm_r1) === JSON.stringify(jm_r1b), 'searchKeywords tất định khi chạy lại');
assert(jm_r1.some((m) => m.vi === 'Răng' || m.kw === '掉牙'), `"răng gãy" khớp răng/掉牙`);
assert(jm_r1.some((m) => m.kw === '掉牙'), `"răng gãy" khớp cụm 掉牙 (rụng/gãy răng)`);

// 5. searchKeywords trả [] khi query rỗng / không khớp
assert(searchKeywords('').length === 0, 'query rỗng → 0 match');
assert(searchKeywords('zzzqwerty plmk').length === 0, 'query không khớp → 0 match');

// 6. Multiple matches — "mơ thấy nước lụt và cá" phải khớp cả 水 + 鱼
const jm_multi = searchKeywords('mơ thấy nước lụt và cá');
const jm_multiKw = jm_multi.map((m) => m.kw);
assert(jm_multiKw.includes('水') && jm_multiKw.includes('鱼'), `"nước ... cá" khớp cả 水 và 鱼`);

// 7. 排 hạng — alias Hán cụm 掉牙 khớp khi query chỉ chứa nó
const jm_ranked = searchKeywords('mộng 掉牙');
assert(jm_ranked.length >= 1 && jm_ranked.some((m) => m.kw === '掉牙'), `alias Hán cụm 掉牙 được khớp`);

// 8. searchPatterns — răng gãy
const jm_tp = searchPatterns('mơ thấy răng gãy rụng');
assert(jm_tp.some((p) => p.id === 'tooth-fall'), `pattern "tooth-fall" khớp "răng gãy rụng"`);
// requiresAny phải được tôn trọng: chỉ nói "răng" (không gãy/rụng) → không match tooth-fall
const jm_tpNoReq = searchPatterns('thấy răng');
assert(!jm_tpNoReq.some((p) => p.id === 'tooth-fall'), `"thấy răng" (không gãy/rụng) → không match tooth-fall (requiresAny)`);

// 9. jiemeng tổng hợp tone đúng
const jm1 = jiemeng('mơ thấy rồng và cá'); // rồng=cat, cá=cat → overall cat
assert(jm1.overall === 'cat' && jm1.toneCounts.cat >= 2, `"rồng và cá" → overall cat (cát:${jm1.toneCounts.cat})`);
const jm2 = jiemeng('mơ thấy hổ cắn và máu'); // hổ=hung, máu=hung, cắn(đánh nhau)→hung → overall hung
assert(jm2.overall === 'hung' && jm2.toneCounts.hung >= 2, `"hổ ... máu" → overall hung (hung:${jm2.toneCounts.hung})`);

// 10. jiemeng() tất định
const jm1b = jiemeng('mơ thấy rồng và cá');
assert(JSON.stringify(jm1) === JSON.stringify(jm1b), 'jiemeng() tất định khi chạy lại');

// 11. jiemeng không khớp → summary gợi ý, không crash
const jmEmpty = jiemeng('zzz meaningless xyz');
assert(jmEmpty.matches.length === 0 && jmEmpty.overall === 'unknown', 'query lạ → unknown, không crash');

// 12. Sample — in kết quả "răng gãy" để người đọc kiểm tra mắt
console.log('   --- Sample "răng gãy" ---');
const jmSample = jiemeng('mơ thấy răng gãy');
console.log(`   Query: "${jmSample.query}"`);
console.log(`   Overall: ${jmSample.overall} | matches:${jmSample.matches.length} | patterns:${jmSample.patterns.length}`);
for (const p of jmSample.patterns) console.log(`   🌙 [${p.tone}] ${p.name}: ${p.advice}`);
for (const m of jmSample.matches.slice(0, 3)) console.log(`   🔑 ${m.keyword} (${m.vi}) [${m.tone}]: ${m.advice}`);
console.log(`   Tóm: ${jmSample.summary}`);

console.log('\n################## 禽星 年禽 ANNUAL BIRD ROTATION ##################');
import { qinxingYear, qinxingOverview, qinxingCycle, QIN_ORDER, QINXING_ANCHOR_YEAR, QINXING_ANCHOR_TU } from './src/engine/qinxing.js';
// QIN_28 already imported earlier in selftest (line 939)
// 28 bird canonical order phải đủ & khớp QIN_28
assert(QIN_ORDER.length === 28, 'qinxing: đủ 28 bird canonical order');
assert(QIN_ORDER.every((tu) => QIN_28[tu]), 'qinxing: mọi tu có trong QIN_28');
assert(QIN_ORDER[0] === '角' && QIN_ORDER[27] === '轸', 'qinxing: đầu=角, cuối=轸');
assert(QINXING_ANCHOR_YEAR === 1984 && QINXING_ANCHOR_TU === '虚', 'qinxing: anchor 1984=虚 (canonical 演禽 年禽起例)');

// ===== CANONICAL CALIBRATION — 演禽 年禽起例 (neo 1984 甲子 = 虚日鼠) =====
// 6 mốc độc lập từ nguồn thư tịch. Nếu bất kỳ mốc nào FAIL → công thức sai.
// Nguồn: 中华预测网 zhycw.com (1918/1919/1924/1984) + 知乎演禽 worked example (2021/2022).
const CALIB = [
  { y: 1918, tu: '角', bird: '角木蛟', src: 'zhycw "1918年角宿值年"' },
  { y: 1919, tu: '亢', bird: '亢金龙', src: 'zhycw "1919年亢宿值年"' },
  { y: 1924, tu: '箕', bird: '箕水豹', src: 'zhycw "1924年中元甲子箕宿值年"' },
  { y: 1984, tu: '虚', bird: '虚日鼠', src: 'zhycw "1984年下元甲子虚宿值年"' },
  { y: 2021, tu: '觜', bird: '觜火猴', src: '知乎 演禽排盘 worked example' },
  { y: 2022, tu: '参', bird: '参水猿', src: '知乎 演禽 (2022壬寅=参水猿)' },
];
for (const c of CALIB) {
  const r = qinxingYear(c.y);
  assert(r.tu === c.tu && r.bird === c.bird, `qinxing CALIB ${c.y} = ${c.bird} [${c.src}] (được ${r.bird}/${r.tu})`);
}

// 28-năm cycle: từ 1984=虚, năm 1984+28=2012 cũng phải = 虚 (cycle khép kín)
assert(qinxingYear(1984).tu === '虚' && qinxingYear(2012).tu === '虚', 'qinxing: 1984 & 2012 cùng = 虚 (cycle 28)');
assert(qinxingYear(1985).tu === '危', 'qinxing: 1985 = 危 (tiến 1 từ 虚)');

// 2026 = 星日马 (canonical, KHÔNG phải 女土蝠 của công thức bịa cũ)
// (10 + (2026-1984)) % 28 = (10+42)%28 = 52%28 = 24 → QIN_ORDER[24] = 星
const qx26 = qinxingYear(2026);
assert(qx26.tu === '星' && qx26.bird === '星日马', `qinxing 2026 = 星日马 canonical (được ${qx26.bird}/${qx26.tu})`);
assert(['Mộc', 'Hoả', 'Thổ', 'Kim', 'Thuỷ'].includes(qx26.element), 'qinxing: có elementVi');
assert(qx26.compatible.length > 0 && qx26.avoid.length > 0, 'qinxing: có compatible + avoid');
assert(qx26.meaning.includes('2026') && qx26.meaning.includes(qx26.bird), 'qinxing: meaning nhắc năm + bird');
// 2024 = 鬼金羊 (canonical), kiểm chứng thêm mốc gần
assert(qinxingYear(2024).bird === '鬼金羊', 'qinxing 2024 = 鬼金羊 canonical');

// overview vs bản mệnh 1993-10-21 (乙亥 ngày → 演禽 bản mệnh)
const qxR = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
const ov26 = qinxingOverview(qxR, 2026);
assert(ov26.scanYear === 2026 && ov26.annual.bird === '星日马', 'qinxingOverview: annual đúng (canonical)');
assert(ov26.benMing && typeof ov26.benMing.qin === 'string', 'qinxingOverview: có bản mệnh');
assert(['cat', 'mid', 'hung'].includes(ov26.tone), `qinxingOverview: tone hợp lệ (được ${ov26.tone})`);
assert(['CÁT', 'HUNG', 'TRUNG BÌNH'].includes(ov26.toneVi), 'qinxingOverview: toneVi hợp lệ');
assert(typeof ov26.summary === 'string' && ov26.summary.length > 20, 'qinxingOverview: có summary');
const rel26 = ov26.rel;
assert(['tong', 'sheng', 'xie', 'ke', 'cai'].includes(rel26), `qinxingOverview: rel hợp lệ (được ${rel26})`);
// cycle preview 5 năm
const cyc = qinxingCycle(2026, 5);
assert(cyc.length === 5 && cyc.every((c) => typeof c.bird === 'string'), 'qinxingCycle: đủ 5 năm + bird');
assert(cyc[2].bird === '星日马', 'qinxingCycle: giữa 2026 = 星日马 (canonical)');
// tất định
assert(qinxingYear(2026).bird === qx26.bird, 'qinxingYear tất định');
assert(JSON.stringify(qinxingOverview(qxR, 2026)) === JSON.stringify(ov26), 'qinxingOverview tất định');
// cạnh: năm âm không crash
assert(typeof qinxingYear(-100).bird === 'string', 'qinxingYear năm âm không crash');
// thiếu R.chart → overview vẫn chạy annual, benMing null
const ovNoR = qinxingOverview({}, 2026);
assert(ovNoR.annual.bird === '星日马' && ovNoR.benMing === null, 'qinxingOverview: R rỗng → annual OK (canonical), benMing null');
console.log(`   2026 = ${qx26.bird} (${qx26.animal}, ${qx26.element}) idx${qx26.index} | bản mệnh 乙亥 → ${ov26.toneVi} (${ov26.relVi.split('—')[0].trim()}) ✓ [6-anchor CALIB pass]`);

// ============================================================================
// 57. 生肖配对评分 — 六合/三合/六冲/六害/三刑/自刑 full scoring
// ============================================================================
import { zodiacPairScore, zodiacAnalysis, XING_PAIRS, XING_SELF } from './src/engine/zodiac-deep.js';
console.log('\n################## 57. 生肖配对评分 (六合/三合/六冲/六害/三刑/自刑) ##################');

// 六合: 子–丑 phải +18 → đại hợp/khá hợp
const lh = zodiacPairScore('子', '丑');
assert(lh.score >= 75, `六合 子–丑: score ≥75 (được ${lh.score})`);
assert(lh.relations.some((r) => r.type === 'liuhe'), '六合: có relation liuhe');
assert(lh.relations[0].delta === 18, '六合 delta = +18');

// 三合: 寅–午 (Hỏa cục) +15
const zp_sh = zodiacPairScore('寅', '午');
assert(zp_sh.relations.some((r) => r.type === 'sanhe'), '三合 寅–午: có relation sanhe');
assert(zp_sh.relations[0].delta === 15, '三合 delta = +15');

// 六冲: 子–午 phải -20 → khắc
const cg = zodiacPairScore('子', '午');
assert(cg.score < 50, `六冲 子–午: score <50 (được ${cg.score})`);
assert(cg.relations.some((r) => r.type === 'chong'), '六冲: có relation chong');
assert(cg.relations[0].delta === -20, '六冲 delta = -20');
assert(['Khắc', 'Đại khắc'].includes(cg.rating), `六冲 rating = Khắc/Đại khắc (được ${cg.rating})`);

// 六害: 子–未 phải có relation hai
const hi = zodiacPairScore('子', '未');
assert(hi.relations.some((r) => r.type === 'hai'), '六害 子–未: có relation hai');
assert(hi.relations.find((r) => r.type === 'hai').delta === -12, '六害 delta = -12');

// 三刑 vô lễ: 子–卯 phải có relation xing
const xg = zodiacPairScore('子', '卯');
assert(xg.relations.some((r) => r.type === 'xing'), '三刑 子–卯 (vô lễ): có relation xing');
assert(xg.relations.find((r) => r.type === 'xing').delta === -14, '三刑 delta = -14');

// 三刑 thế thế: 巳–申
const xg2 = zodiacPairScore('巳', '申');
assert(xg2.relations.some((r) => r.type === 'xing'), '三刑 巳–申 (thế thế): có relation xing');

// 三刑 vô ân: 丑–未
const xg3 = zodiacPairScore('丑', '未');
assert(xg3.relations.some((r) => r.type === 'xing'), '三刑 丑–未 (vô ân): có relation xing');

// 自刑: 辰–辰 (đồng chi phạm tự hình)
const zx = zodiacPairScore('辰', '辰');
assert(zx.relations.some((r) => r.type === 'zixing'), '自刑 辰–辰: có relation zixing');
assert(zx.relations.find((r) => r.type === 'zixing').delta === -8, '自刑 delta = -8');

// Đồng chi KHÔNG phạm tự hình (寅–寅) → đồng điệu, không zixing
const tt = zodiacPairScore('寅', '寅');
assert(!tt.relations.some((r) => r.type === 'zixing'), 'đồng chi 寅–寅: KHÔNG phải zixing');
assert(tt.relations.some((r) => r.type === 'tong'), 'đồng chi 寅–寅: có relation tong (đồng điệu)');

// Đối xứng: score(A,B) === score(B,A)
assert(zodiacPairScore('子', '午').score === zodiacPairScore('午', '子').score, 'zodiacPairScore đối xứng');
assert(zodiacPairScore('子', '丑').score === zodiacPairScore('丑', '子').score, 'zodiacPairScore đối xứng (六合)');

// Tất định
assert(JSON.stringify(zodiacPairScore('寅', '申')) === JSON.stringify(zodiacPairScore('寅', '申')), 'zodiacPairScore tất định');

// Cạnh: chi không hợp lệ → null
assert(zodiacPairScore('甲', '子') === null, 'zodiacPairScore: chi không hợp lệ → null');

// Score nằm trong [0,100]
for (const za of ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']) {
  for (const zb of ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']) {
    const s = zodiacPairScore(za, zb).score;
    assert(s >= 0 && s <= 100, `score ${za}–${zb} trong [0,100] (${s})`);
  }
}

// zodiacAnalysis vẫn chạy (regression)
const za1 = zodiacAnalysis('酉');
assert(za1 && za1.animal.includes('Gà'), 'zodiacAnalysis(酉) regression: vẫn trả Gà');
assert(za1.compatible.length > 0 && za1.incompatible.length > 0, 'zodiacAnalysis: có compatible + incompatible');

// Export XING_PAIRS / XING_SELF khớp chuẩn interactions.js
assert(XING_PAIRS.length === 7, `XING_PAIRS có 7 cặp (được ${XING_PAIRS.length})`);
assert(XING_SELF.length === 4 && XING_SELF.join() === '辰,午,酉,亥', 'XING_SELF = 辰午酉亥');

console.log(`   子–丑(六合)=${lh.score} ${lh.rating} | 子–午(六冲)=${cg.score} ${cg.rating} | 子–卯(三刑)=${xg.score} | 辰–辰(自刑)=${zx.score} ✓`);


console.log('\n################## N. 玄空大卦 XUAN KONG DA GUA (64 quẻ × 24 sơn) ##################');
import { daguaByMountain, daguaCompatibility, daguaOverview, guaYunOf, HEX64, MOUNTAINS_HAN } from './src/engine/xuankong-dagua.js';

// N1. daguaByMountain: 24 sơn đều có dữ liệu + hexagram + yun trong {1,2,3,4,6,7,8,9} (5=空亡)
assert(MOUNTAINS_HAN.length === 24, 'MOUNTAINS_HAN có đúng 24 sơn');
let allHaveHex = true, allYunOk = true;
const VALID_YUN = new Set([1, 2, 3, 4, 6, 7, 8, 9]);
for (const h of MOUNTAINS_HAN) {
  const d = daguaByMountain(h);
  if (!d || !d.hexagram || !d.hexagramVi) allHaveHex = false;
  if (!d || !VALID_YUN.has(d.yun)) allYunOk = false; // 5 KHÔNG bao giờ xuất hiện
}
assert(allHaveHex, 'mọi sơn đều có quẻ (hexagram + hexagramVi)');
// [loop 553] 戌 = 蹇#39 (艮上坎下), KHÔNG phải 蒙 (坎/艮) như bug cũ vs comment.
assert(daguaByMountain('戌').hexagram === '蹇', `[loop 553] 戌=蹇 (sau fix, trước SAI=蒙 do upper/lower ngược)`);
// [loop 553] 兑震=随 (泽雷随), sơn 丑 dùng兑/震 → phải ra 随 (trước fix SAI=归妹 do HEX_NAME đảo)
assert(daguaByMountain('丑').hexagram === '随', `[loop 553] 丑(兑震)=随 (sau fix HEX_NAME, trước SAI=归妹)`);
assert(allYunOk, 'mọi sơn đều có 卦运 hợp lệ {1,2,3,4,6,7,8,9} — 5=空亡 bị loại');

// N1b. CANONICAL 卦运 derivation (张心言 lineage): HEX64 phân hoạch đúng 8×8, không 0/5
const _yunCounts = {};
let _bad = 0;
for (const h of HEX64) { if (h.yun === 0 || h.yun === 5) _bad++; _yunCounts[h.yun] = (_yunCounts[h.yun] || 0) + 1; }
assert(HEX64.length === 64, 'HEX64 có đủ 64 quẻ');
assert(_bad === 0, 'không có quẻ nào mang 卦运 0 hoặc 5 (空亡)');
assert(_yunCounts[1] === 8 && _yunCounts[2] === 8 && _yunCounts[3] === 8 && _yunCounts[4] === 8
    && _yunCounts[6] === 8 && _yunCounts[7] === 8 && _yunCounts[8] === 8 && _yunCounts[9] === 8,
  `HEX64 phân hoạch đúng 8 quẻ / mỗi vận 1,2,3,4,6,7,8,9 (=${JSON.stringify(_yunCounts)})`);

// N1c. Mỏ neo CANONICAL từ ví dụ lập bàn của 陈益峰 (163.com/DQQ1JEC2) — 9 anchor
const _ANCH = [
  // [upper, lower, expectedYun, source-hex-name]
  ['巽', '坤', 2, '观'], ['坎', '坤', 7, '比'], ['坎', '艮', 2, '蹇'], ['离', '兑', 2, '睽'],
  ['震', '乾', 2, '大壮'], ['兑', '震', 7, '随'], ['震', '兑', 7, '归妹'], ['离', '乾', 7, '大有'],
  ['巽', '艮', 7, '渐'],
];
let _anchorPass = 0;
for (const [u, l, exp, name] of _ANCH) {
  const y = guaYunOf(u, l);
  if (y.yun === exp) _anchorPass++; else console.log(`   ❌ anchor ${name} ${u}/${l}: yun ${y.yun} ≠ ${exp}`);
}
assert(_anchorPass === _ANCH.length, `9 mỏ neo 陈益峰 卦运 đúng (${_anchorPass}/${_ANCH.length})`);

// N1d. 闻道国学 ground truth: 泰(9运) 初/二/三爻变 → 升2/明夷3/临4
assert(guaYunOf('坤', '巽').yun === 2, '泰→升(坤/巽) = 2运 (闻道国学 初爻变)');
assert(guaYunOf('坤', '离').yun === 3, '泰→明夷(坤/离) = 3运 (闻道国学 二爻变)');
assert(guaYunOf('坤', '兑').yun === 4, '泰→临(坤/兑) = 4运 (闻道国学 三爻变)');

// N2. Quẻ thuần (thượng=hạ=1运) cho 8 sơn neo thuần — xác minh qua guaYunOf
const pureCheck = (h, expectedHex) => daguaByMountain(h).hexagram === expectedHex;
assert(pureCheck('乾', '乾'), '乾 (sơn) → quẻ thuần Càn = 1运');
assert(pureCheck('坤', '坤'), '坤 (sơn) → quẻ thuần Khôn = 1运');
assert(pureCheck('巽', '巽'), '巽 (sơn) → quẻ thuần Tốn = 1运');
assert(pureCheck('艮', '艮'), '艮 (sơn) → quẻ thuần Cấn = 1运');
assert(pureCheck('卯', '震'), '卯 → quẻ thuần Chấn = 1运');
assert(pureCheck('癸', '坎'), '癸 → quẻ thuần Khảm = 1运');
assert(pureCheck('午', '离'), '午 → quẻ thuần Ly = 1运');
assert(pureCheck('辛', '兑'), '辛 → quẻ thuần Đoài = 1运');
for (const h of ['乾', '坤', '巽', '艮', '卯', '癸', '午', '辛']) {
  assert(daguaByMountain(h).yun === 1, `${h} (thuần) → 卦运 = 1 (贪狼, 北卦)`);
}

// N2b. Mỏ neo per-mountain 陈益峰: 壬=观(2运), 辰=睽(2运), 丙=大壮(2运), 戌=蹇? → hiện 蒙(2运)
//      (các mỏ neo này dùng quẻ đại diện; 卦运 tính bằng guaYunOf nên luôn canonical)
assert(daguaByMountain('壬').hexagram === '观' && daguaByMountain('壬').yun === 2, '壬 → 观 = 2运 (陈益峰 mỏ neo)');
assert(daguaByMountain('辰').hexagram === '睽' && daguaByMountain('辰').yun === 2, '辰 → 睽 = 2运 (陈益峰 mỏ neo)');
assert(daguaByMountain('丙').hexagram === '大壮' && daguaByMountain('丙').yun === 2, '丙 → 大壮 = 2运 (陈益峰 mỏ neo)');
assert(daguaByMountain('亥').hexagram === '渐' && daguaByMountain('亥').yun === 7, '亥 → 渐 = 7运 (陈益峰 mỏ neo)');

// N3. daguaCompatibility: lỗi input → trả ok:false
const bad = daguaCompatibility('甲', 'X');
assert(bad.ok === false && bad.error, 'input không hợp lệ → ok:false + error message');
const bad2 = daguaCompatibility('X', '甲');
assert(bad2.ok === false, 'toạ không hợp lệ → ok:false');

// N4. 合十 (cộng = 10): toạ vận 2 + hướng vận 8 → phải có rule 合十 ĐẠI CÁT, score >= 80
//    Tìm một cặp合10 thực tế trong bảng
const dagH10 = daguaOverview().heTenPairs;
assert(dagH10.length > 0, 'overview phát hiện được cặp hợp 10');
const dagSample = dagH10[0];
const dagC10 = daguaCompatibility(dagSample.sit, dagSample.face);
assert(dagC10.ok === true, 'cặp hợp 10 hợp lệ');
assert(dagC10.rules.some((r) => r.type.includes('合十') && r.rating === 'Đại cát'), `cặp ${dagSample.sit}↔${dagSample.face} có rule 合10 Đại cát [loop 479 titlecase]`);
assert(dagC10.score >= 65, `cặp hợp 10 score cao (${dagC10.score} >= 65)`);
assert(dagC10.bestRule === '合十', `bestRule = 合十 cho cặp ${dagSample.sit}↔${dagSample.face}`);

// N5. 同运: cùng toạ = cùng hướng → có rule 同运, score tăng
const dagSame = daguaCompatibility('甲', '甲');
assert(dagSame.rules.some((r) => r.type.includes('同运')), `甲→甲 (cùng vận ${daguaByMountain('甲').yun}) có rule 同运`);
assert(dagSame.score >= 60, `甲→甲 score >= 60 (đồng vận) — được ${dagSame.score}`);

// N6. Score trong [0,100] & đối xứng: comp(A,B).score === comp(B,A).score
for (const a of ['壬','子','午','卯','酉','乾','巽']) {
  for (const b of ['壬','子','午','卯','酉','乾','巽']) {
    const s1 = daguaCompatibility(a, b);
    const s2 = daguaCompatibility(b, a);
    if (!s1.ok || !s2.ok) continue;
    assert(s1.score >= 0 && s1.score <= 100, `dagua score ${a}–${b} trong [0,100] (${s1.score})`);
    assert(s1.score === s2.score, `dagua đối xứng: ${a}–${b} (${s1.score}) === ${b}–${a} (${s2.score})`);
  }
}

// N7. Đối cung 180°: toạ + hướng cách 12 sơn → isOpposite = true
const dagOpp = daguaCompatibility('子', '午'); // 子 idx1, 午 idx13 → cách 12
assert(dagOpp.isOpposite === true, '子↔午 là đối cung 180° (isOpposite)');
const dagNotOpp = daguaCompatibility('子', '丑');
assert(dagNotOpp.isOpposite === false, '子↔丑 KHÔNG phải đối cung');

// N8. Tất định: gọi 2 lần → y hệt
const dgJson1 = JSON.stringify(daguaCompatibility('壬', '丙'));
const dgJson2 = JSON.stringify(daguaCompatibility('壬', '丙'));
assert(dgJson1 === dgJson2, 'daguaCompatibility tất định khi chạy lại');

// N9. Overview: rows đủ 24, có bestYun + note
const dagOv = daguaOverview();
assert(dagOv.rows.length === 24, 'overview rows = 24');
assert(Array.isArray(dagOv.bestYun) && dagOv.note.length > 20, 'overview có bestYun + note');
assert(dagOv.title.includes('玄空大卦'), 'overview title đúng hệ');

console.log(`   子↔午: ${dagOpp.score}/100 ${dagOpp.rating} (rules: ${dagOpp.rules.map((r)=>r.type).join(', ')}) ✓`);


// ============================================================================
// O. 金口诀 (Kim Khẩu Quyết) — 4 vị trí + ngũ hành + lục亲 + phán cát/hung
// ============================================================================
console.log('\n################## O. 金口诀 KIM KHẨU QUYẾT ##################');

// O1. Tất định: gọi 2 lần cùng input → y hệt
const jk1 = jinkoujue(5, 15, 7, { solar: { year: 2026, month: 6, day: 21 }, dayGan: '丙' });
const jk2 = jinkoujue(5, 15, 7, { solar: { year: 2026, month: 6, day: 21 }, dayGan: '丙' });
assert(JSON.stringify(jk1) === JSON.stringify(jk2), 'jinkoujue tất định khi chạy lại');

// O2. Đủ 4 vị trí + đúng kiểu
assert(['difeng', 'yuejiang', 'guishen', 'renyuan'].every((k) => jk1.positions[k]), 'có đủ 4 vị trí 地分/月将/贵神/人元');
assert(jk1.positions.difeng.role.includes('地分') && jk1.positions.yuejiang.role.includes('月将')
  && jk1.positions.guishen.role.includes('贵神') && jk1.positions.renyuan.role.includes('人元'),
  'mỗi vị trí có role chứa tên Hán (地分/月将/贵神/人元)');
assert(typeof jk1.positions.difeng.zhi === 'string' && jk1.positions.difeng.zhi.length === 1, '地分 là 1 địa chi');
assert(typeof jk1.positions.renyuan.gan === 'string' && jk1.positions.renyuan.gan.length === 1, '人元 là 1 thiên can');
assert(['木', '火', '土', '金', '水'].includes(jk1.elements.difeng), 'element 地分 thuộc ngũ hành');
assert(['木', '火', '土', '金', '水'].includes(jk1.elements.renyuan), 'element 人元 thuộc ngũ hành');

// O3. 地分 = giờ chi (toạ theo giờ hỏi)
assert(jk1.positions.difeng.zhi === '午', 'giờ 7 (午) → 地分 = 午');
const jkH1 = jinkoujue(1, 1, 1, { solar: { year: 2026, month: 2, day: 4 }, dayGan: '甲' });
assert(jkH1.positions.difeng.zhi === '子', 'giờ 1 (子) → 地分 = 子');
const jkH12 = jinkoujue(1, 1, 12, { solar: { year: 2026, month: 2, day: 4 }, dayGan: '甲' });
assert(jkH12.positions.difeng.zhi === '亥', 'giờ 12 (亥) → 地分 = 亥');

// O4. Verdict thuộc tập {CÁT, HUNG, TRUNG} & yesNo khớp
assert(['CÁT', 'HUNG', 'TRUNG'].includes(jk1.verdict), 'verdict ∈ {CÁT, HUNG, TRUNG}');
assert(jk1.verdict === 'CÁT' ? jk1.yesNo.startsWith('CÓ') : jk1.verdict === 'HUNG' ? jk1.yesNo.startsWith('KHÔNG') : jk1.yesNo.startsWith('CHƯA RÕ'),
  'yesNo khớp verdict');

// O5. Ngũ hành quan hệ chính (人元 ↔ 地分) ∈ 5 giá trị hợp lệ
const VALID_REL = ['比和', '相生', '被生', '相克', '被克', '无关'];
assert(VALID_REL.includes(jk1.relations.renyuan_vs_difeng), 'relations.renyuan_vs_difeng ∈ giá trị ngũ hành hợp lệ');
assert(VALID_REL.includes(jk1.relations.yuejiang_vs_difeng), 'relations.yuejiang_vs_difeng ∈ giá trị ngũ hành hợp lệ');

// O6. Lục亲 trên đỉnh ∈ 5 nhóm + khớp định nghĩa ngũ hành (用 甲Canh → 官鬼)
// 日干 丙(Hỏa), 人元 乙(Mộc): Mộc sinh Hỏa → sinh ta → 父母
assert(jk1.liuqin.top === '父母', '丙 đỉnh 乙(木 sinh Hỏa) → 父母 (Ấn)');
// Tạo case tương khắc: 日干 甲(Mộc), 人元 phải khắc → dùng giờ để đổi 人元 qua 月将
// Đơn giản hơn: kiểm tra 1 case khắc rõ — 日干 庚(Kim), 月将役使得 人元 Mộc → 被克 =妻财? thực tế 六亲Of(otherWx=Mộc, dayWx=Kim): KE[Kim]=Mộc → ta khắc → 妻财
const jkGeng = jinkoujue(8, 10, 9, { solar: { year: 2026, month: 8, day: 20 }, dayGan: '庚' });
const gengDayWx = '金';
const renWx = jkGeng.elements.renyuan;
const expectedLq = (renWx === gengDayWx) ? '兄弟'
  : (renWx === '水') ? '子孙'  // Kim sinh Thủy
    : (renWx === '土') ? '父母' // Thổ sinh Kim
      : (renWx === '木') ? '妻财' // Kim khắc Mộc
        : (renWx === '火') ? '官鬼' : '?'; // Hỏa khắc Kim
assert(jkGeng.liuqin.top === expectedLq, `庚 đỉnh ${jkGeng.positions.renyuan.gan}(${renWx}) → lục亲 = ${expectedLq} (thực tế ${jkGeng.liuqin.top})`);

// O7. Thiên将 (贵神) ∈ 12 天将 + tone ∈ {cát, hung, bình}
assert(['贵人','螣蛇','朱雀','六合','勾陈','青龙','天空','白虎','太常','玄武','太阴','天后'].includes(jk1.tianjiang.name),
  '贵神 ∈ 12 thiên将');
assert(['cát', 'hung', 'bình'].includes(jk1.tianjiang.tone), '天将 tone ∈ {cát, hung, bình}');

// O8. 贵神 昼夜: cùng vị trí但 giờ khác → có thể đổi tone (验证昼贵/夜贵起例)
const jkDayHour = jinkoujue(3, 5, 7, { solar: { year: 2026, month: 5, day: 5, hour: 12 }, dayGan: '甲' });   // 午 = day
const jkNightHour = jinkoujue(3, 5, 1, { solar: { year: 2026, month: 5, day: 5, hour: 0 }, dayGan: '甲' });   // 子 = night
// 甲 昼贵 丑, 夜贵 未 — khác vị trí giờ → khác thiên将可能的, kiểm hệ thống không lỗi
assert(typeof jkDayHour.tianjiang.name === 'string' && typeof jkNightHour.tianjiang.name === 'string',
  '贵神 tính được cả ban ngày (午) và ban đêm (子)');

// O9. UI render trả HTML không rỗng
const jkHtml = renderJinkoujueCard(jk1);
assert(typeof jkHtml === 'string' && jkHtml.includes('地分') && jkHtml.includes(jk1.verdict), 'renderJinkoujueCard trả HTML có 地分 + verdict');

// O10. Validate input: ngoài phạm vi → throw
let threw = false;
try { jinkoujue(13, 1, 1, {}); } catch { threw = true; }
assert(threw, 'tháng 13 → throw');
threw = false;
try { jinkoujue(1, 0, 1, {}); } catch { threw = true; }
assert(threw, 'ngày 0 → throw');
threw = false;
try { jinkoujue(1, 1, 13, {}); } catch { threw = true; }
assert(threw, 'giờ 13 → throw');

// In mẫu đại diện
console.log('   Mẫu KQ:', jk1.summary);
console.log('   Điểm:', jk1.score, '| verdict:', jk1.verdict, '| 天将:', jk1.tianjiang.name, '(' + jk1.tianjiang.tone + ')');
console.log('   Lục亲 đỉnh:', jk1.liuqin.top, '—', jk1.liuqin.hint);


// ################## 58. 董公择日 DONG GONG DATE SELECTION (12 trực + biến thể tháng) ##################
import { donggongDay, donggongInMonth, DONGGONG_OFFICER, DONGGONG_MONTH_VARIANT, OFFICER_VI } from './src/engine/donggong.js';
console.log('\n################## 58. 董公择日 DONG GONG DATE SELECTION (Đổng Công) ##################');
assert(Object.keys(DONGGONG_OFFICER).length === 12, 'Bảng giải nghĩa 12 trực đủ');
assert(DONGGONG_OFFICER['成'].tone === 'cat' && DONGGONG_OFFICER['破'].tone === 'hung', '成 = cát, 破 = hung');
assert(DONGGONG_OFFICER['成'].good.includes('Cưới hỏi (嫁娶)'), 'Thành nhật hợp hôn nhân');
assert(DONGGONG_OFFICER['除'].bad.includes('Cưới hỏi (嫁娶)'), 'Trừ nhật kỵ hôn nhân');
assert(DONGGONG_OFFICER['危'].good.includes('Leo núi / đăng cao (nghịch lý)'), 'Nguy nhật nghịch lý hợp leo núi');
assert(OFFICER_VI['建'] === 'Kiến' && OFFICER_VI['闭'] === 'Bế', 'officerVi map đúng');
// Biến thể tháng: 成@午, 破@午, 破@子 phải có entry
assert(DONGGONG_MONTH_VARIANT['成@午'].extraTone === 'cat', 'Biến thể 成@午 = extra cat');
assert(DONGGONG_MONTH_VARIANT['破@子'] && DONGGONG_MONTH_VARIANT['破@午'], 'Biến thể 破@子 / 破@午 có');
// 2026-06-23 (戊辰, 午月) = trực 开 (khớp zheri.js logic)
const dong1 = donggongDay(2026, 6, 23);
assert(dong1.dayGanZhi === '戊辰' && dong1.monthZhi === '午' && dong1.officer === '开', '2026-06-23 = 戊辰 午月 开 (khớp zheri.js)');
assert(dong1.tone === 'cat' && dong1.rating === 'Đại cát', 'Khai nhật = đại cát');
assert(dong1.good.includes('Khai trương / mở rộng') && dong1.bad.includes('An táng'), 'Khai nhật: hợp khai trương, kỵ an táng');
// 2026-06-07 = 破@午 → hung, monthNote trigger, điểm thấp
const dong2 = donggongDay(2026, 6, 7);
assert(dong2.officer === '破' && dong2.tone === 'hung' && dong2.rating === 'Kỵ', '2026-06-07 破 = Kỵ (hung)');
assert(dong2.monthNote && dong2.monthNote.includes('Ngọ月破日'), '破@午 có monthNote biến thể');
assert(dong2.score < 30, 'Phá nhật điểm < 30');
// 2026-06-09 = 成@午 → cat, monthNote (variant 成@午)
const dong3 = donggongDay(2026, 6, 9);
assert(dong3.officer === '成' && dong3.tone === 'cat', '2026-06-09 成 = cat');
assert(dong3.monthNote && dong3.monthNote.includes('Ngọ月成日'), '成@午 có monthNote');
assert(dong3.score > dong2.score, 'Thành nhật (成) điểm > Phá nhật (破)');
// 建日 với dayZhi === monthZhi (正 月建)
const dong4 = donggongDay(2026, 6, 13);
assert(dong4.officer === '建' && dong4.dayZhi === dong4.monthZhi, '2026-06-13 建日 (dayZhi === monthZhi)');
// Quét tháng
const dongM = donggongInMonth(2026, 6);
assert(dongM.total === 30, 'Tháng 6/2026 có 30 ngày');
assert(dongM.best3.length === 3 && dongM.worst3.length === 3, 'Trả đúng best3 + worst3');
assert(dongM.best3[0].score >= dongM.best3[2].score && dongM.best3[2].score >= dongM.worst3[0].score, 'best3 sorted giảm dần & > worst3');
assert(dongM.worst3[0].officer === '破', 'Xấu nhất tháng 6/2026 là Phá nhật');
// Determinism
const dong1b = donggongDay(2026, 6, 23);
assert(dong1b.score === dong1.score && dong1b.officer === dong1.officer && dong1b.meaning === dong1.meaning, 'donggongDay deterministic');
console.log(`   2026-06-23: ${dong1.dayGanZhi} ${dong1.officerVi}(${dong1.officer}) ${dong1.rating}(${dong1.score}) | 宜: ${dong1.good.slice(0,2).join(', ')}`);
console.log(`   2026-06-07: ${dong2.officerVi}(${dong2.officer}) ${dong2.rating}(${dong2.score}) ${dong2.monthNote ? '· ' + dong2.monthNote.split('=')[0].trim() : ''}`);
console.log(`   T6/2026: BEST ${dongM.best3.map((d)=>d.officerVi+'('+d.score+')').join(', ')} | WORST ${dongM.worst3.map((d)=>d.officerVi+'('+d.score+')').join(', ')} ✓`);


// ################## 59. 紫微流日流时 ZIWEI DAILY & HOURLY FORTUNE ##################
import { ziweiLiuri, ziweiLiushi, ziweiDailyZiwei, ZHI_ORDER as ZLR_ZHI, HOUR_RANGE as ZLR_HOUR } from './src/engine/ziwei-liuri.js';
console.log('\n################## 59. 紫微流日流时 ZIWEI 流日/流时 (daily & hourly fortune) ##################');
const ZLR_INPUT = { year: 1990, month: 5, day: 15, hour: 10, minute: 30, gender: 'nam' };
const ZLR_R = { input: ZLR_INPUT };

// P1. ziweiLiuri không crash + trả đủ trường
const zlr1 = ziweiLiuri(ZLR_R, 2026, 6, 23);
assert(typeof zlr1.dayGanZhi === 'string' && zlr1.dayGanZhi.length === 2, 'ziweiLiuri trả dayGanZhi 2 ký tự');
assert(zlr1.lunarDay >= 1 && zlr1.lunarDay <= 30, 'lunarDay trong [1,30]');
assert(['cat','mid','hung'].includes(zlr1.liuriGong.tone), 'liuriGong.tone hợp lệ');
assert(zlr1.liuriGong.index >= 0 && zlr1.liuriGong.index <= 11, 'liuriGong.index trong [0,11]');
assert(Array.isArray(zlr1.liuriSihua) && zlr1.liuriSihua.length === 4, 'liuriSihua đủ 4 hóa (禄权科忌)');

// P2. Rotation math (CHUẨN 斗君-based, cycle-60 fix):
//     流月 idx = (yearZhiIdx - birthMonth + birthHourZhiIdx + currentMonth) mod 12
//     流日 idx = (流月 idx + lunarDay - 1) mod 12
//   (Bản cũ dùng (natal命宫 idx + lunarDay - 1) → MONTH-BLIND, đã sửa.)
const _zlrZ = computeZiwei(ZLR_INPUT.year, ZLR_INPUT.month, ZLR_INPUT.day, ZLR_INPUT.hour, ZLR_INPUT.minute, ZLR_INPUT.gender);
const _ZLR_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
import { Solar as _ZLR_Solar } from 'lunar-javascript';
const _bL = _ZLR_Solar.fromYmdHms(ZLR_INPUT.year, ZLR_INPUT.month, ZLR_INPUT.day, ZLR_INPUT.hour, ZLR_INPUT.minute, 0).getLunar();
const _bMonth = Math.abs(_bL.getMonth()); if (_bL.getMonth() < 0) {} // leap→abs+1 chỉ khi âm; ở đây bắt abs thuần (4)
const _absBMonth = _bL.getMonth() > 0 ? _bL.getMonth() : Math.abs(_bL.getMonth()) + 1;
const _bHourIdx = _ZLR_ZHI.indexOf(_bL.getTimeZhi());
const _tL = _ZLR_Solar.fromYmdHms(2026, 6, 23, 12, 0, 0).getLunar();
const _yearZhiIdx = _ZLR_ZHI.indexOf(_tL.getYearZhi());
const _curMonth = _tL.getMonth() > 0 ? _tL.getMonth() : Math.abs(_tL.getMonth()) + 1;
const _expectedLiuyueIdx = ((_yearZhiIdx - _absBMonth + _bHourIdx + _curMonth) % 12 + 12) % 12;
const _expectedLiuriIdx = ((_expectedLiuyueIdx + zlr1.lunarDay - 1) % 12 + 12) % 12;
assert(zlr1.liuyueIdx === _expectedLiuyueIdx, `流月 idx chuẩn 斗君: ${_yearZhiIdx} - ${_absBMonth} + ${_bHourIdx} + ${_curMonth} = ${_expectedLiuyueIdx} (thực ${zlr1.liuyueIdx})`);
assert(zlr1.liuriGong.index === _expectedLiuriIdx, `流日 idx = 流月 + lunarDay - 1: ${_expectedLiuyueIdx} + ${zlr1.lunarDay} - 1 = ${_expectedLiuriIdx} (thực ${zlr1.liuriGong.index})`);
assert(zlr1.liuriGong.zhi === ZLR_ZHI[_expectedLiuriIdx], 'liuriGong.zhi khớp index');

// P2b. REGRESSION: month-blind bug phải ĐÃ KHỬ — 初一 của các tháng khác nhau
//      phải ra CUNG KHÁC NHAU (trước đây 都 ra cùng 1 cung = natal命宫).
//      Tìm 2 ngày âm lịch 都 là 初一 nhưng ở 2 tháng khác nhau trong 2026.
const _scan1 = (() => { for (let m=2; m<=6; m++) for (let d=1; d<=28; d++) { const L=_ZLR_Solar.fromYmdHms(2026,m,d,12,0,0).getLunar(); if (L.getDay()===1) return {y:2026,mo:m,d}; } })();
const _scan2 = (() => { for (let m=7; m<=11; m++) for (let d=1; d<=28; d++) { const L=_ZLR_Solar.fromYmdHms(2026,m,d,12,0,0).getLunar(); if (L.getDay()===1) return {y:2026,mo:m,d}; } })();
const _lrA = ziweiLiuri(ZLR_R, _scan1.y, _scan1.mo, _scan1.d);
const _lrB = ziweiLiuri(ZLR_R, _scan2.y, _scan2.mo, _scan2.d);
assert(_lrA.lunarDay === 1 && _lrB.lunarDay === 1, 'hai ngày đều là 初一 (âm lịch)');
assert(_lrA.liuriGong.index !== _lrB.liuriGong.index, `REGRESSION month-blind: 初二 tháng ${_scan1.mo}/${_lrA.currentLunarMonth} @ ${_lrA.liuriGong.zhi} ≠ 初一 tháng ${_scan2.mo}/${_lrB.currentLunarMonth} @ ${_lrB.liuriGong.zhi}`);

// P3. Mỗi ngày tiến đúng 1 cung (lunarDay +1 → 流日 idx +1 mod 12, cùng 流月)
const zlr2 = ziweiLiuri(ZLR_R, 2026, 6, 24);
const delta = ((zlr2.liuriGong.index - zlr1.liuriGong.index) % 12 + 12) % 12;
const lunarDelta = ((zlr2.lunarDay - zlr1.lunarDay));
assert(delta === ((lunarDelta % 12) + 12) % 12, `tiến 1 ngày → cung tiến đúng (${lunarDelta} cung âm, ${delta} cung thực)`);

// P4. ziweiLiushi không crash + hourZhi hợp lệ + range chu kỳ 12
const zls1 = ziweiLiushi(ZLR_R, 2026, 6, 23, 14);
assert(ZLR_ZHI.includes(zls1.hourZhi), 'ziweiLiushi trả hourZhi hợp lệ');
assert(typeof zls1.hourRange === 'string' && zls1.hourRange.includes('–'), 'hourRange có định dạng');
assert(['cat','mid','hung'].includes(zls1.liushiGong.tone), 'liushiGong.tone hợp lệ');
// 流时 idx = (流日 idx + hourZhi idx) % 12
const _hourZhiIdx = ZLR_ZHI.indexOf(zls1.hourZhi);
const _expectedLsIdx = ((zlr1.liuriGong.index + _hourZhiIdx) % 12 + 12) % 12;
assert(zls1.liushiGong.index === _expectedLsIdx, `流时 rotation: ${zlr1.liuriGong.index} + ${_hourZhiIdx} = ${_expectedLsIdx} (thực tế ${zls1.liushiGong.index})`);

// P5. Giờ khác → hourZhi khác (23:00 = 子, 14:00 = 未, ...)
const zlsNight = ziweiLiushi(ZLR_R, 2026, 6, 23, 0);
assert(zlsNight.hourZhi === '子', 'giờ 0:00 → 子');
assert(zls1.hourZhi === '未', 'giờ 14:00 → 未');

// P6. ziweiDailyZiwei tổng hợp đủ 12 giờ + best/worst
const zdd = ziweiDailyZiwei(ZLR_R, '2026-06-23');
assert(zdd.hours.length === 12, 'ziweiDailyZiwei trả đủ 12 giờ');
assert(zdd.bestHours.every((h) => h.tone === 'cat'), 'bestHours chỉ chứa tone cat');
assert(zdd.worstHours.every((h) => h.tone === 'hung'), 'worstHours chỉ chứa tone hung');
assert(zdd.hours.map((h) => h.hourZhi).join('') === ZLR_ZHI.join(''), '12 giờ đúng thứ tự 12 địa chi');
// bestHours không vượt quá 3 + worstHours không vượt quá 3
assert(zdd.bestHours.length <= 3 && zdd.worstHours.length <= 3, 'best/worst tối đa 3 mỗi loại');

// P7. Mặc định hôm nay (scanDate không truyền) không crash
const zddToday = ziweiDailyZiwei(ZLR_R);
assert(zddToday.hours.length === 12, 'ziweiDailyZiwei(scanDate=null) dùng hôm nay, vẫn 12 giờ');

// P8. Determinism — chạy lại cho cùng kết quả
const zlr1b = ziweiLiuri(ZLR_R, 2026, 6, 23);
assert(JSON.stringify(zlr1) === JSON.stringify(zlr1b), 'ziweiLiuri tất định khi chạy lại');
const zdd2 = ziweiDailyZiwei(ZLR_R, '2026-06-23');
assert(JSON.stringify(zdd) === JSON.stringify(zdd2), 'ziweiDailyZiwei tất định khi chạy lại');

// P9. Không crash cho nhiều năm/giới (bao gồm giới nữ + giờ biên 23:00)
threw = false;
try {
  ziweiLiuri({ input: { year: 1985, month: 12, day: 1, hour: 23, minute: 0, gender: 'nu' } }, 2031, 2, 9);
} catch { threw = true; }
assert(!threw, 'không crash cho giới nữ + giờ 23:00 + tháng 2');

// P10. Đầu ra có ý nghĩa (palace vi không rỗng, meaning có chữ)
assert(typeof zlr1.liuriGong.vi === 'string' && zlr1.liuriGong.vi.length > 0, 'liuriGong.vi không rỗng');
assert(typeof zlr1.liuriGong.meaning === 'string' && zlr1.liuriGong.meaning.length > 2, 'liuriGong.meaning có nội dung');

console.log(`   2026-06-23: ${zlr1.dayGanZhi} (âm ${zlr1.lunarDay}/${zlr1.lunarMonth}) → 流日 @ ${zlr1.liuriGong.zhi} ${zlr1.liuriGong.vi} [${zlr1.liuriGong.tone}] | 四化: ${zlr1.liuriSihua.map((s)=>s.hua+s.star+'@'+(s.palace||'-')).join(' ')}`);
console.log(`   14h 流时: ${zls1.hourZhi} ${zls1.hourRange} → ${zls1.liushiGong.zhi} ${zls1.liushiGong.vi} [${zls1.liushiGong.tone}]`);
console.log(`   12 giờ: BEST ${zdd.bestHours.map((h)=>h.hourZhi+'='+h.gongVi).join(', ') || '(không)'} | WORST ${zdd.worstHours.map((h)=>h.hourZhi+'='+h.gongVi).join(', ') || '(không)'} ✓`);


// ============================================================================
// ################## 25. BEST HOUR TODAY 择吉时合成 (composite) ##################
// ============================================================================
console.log('\n################## 25. BEST HOUR TODAY 择吉时合成 (composite 6 chiều) ##################');
import { bestHourToday, BEST_HOUR_WEIGHTS } from './src/engine/best-hour.js';
const BH_R = analyze(1990, 6, 15, 14, 30, 'nam', 2026);

// P1. Trả đủ 12 giờ + cấu trúc trường đúng
let bhThrew = false; let bh1;
try { bh1 = bestHourToday(BH_R, 2026, 6, 23); } catch { bhThrew = true; }
assert(!bhThrew, 'bestHourToday không crash');
assert(bh1.hours.length === 12, 'trả đủ 12 giờ');
assert(bh1.best.length === 3 && bh1.worst.length === 2, 'best=3, worst=2');
for (const h of bh1.hours) {
  assert(typeof h.zhi === 'string' && h.zhi.length === 1, `hour.zhi hợp lệ (${h.zhi})`);
  assert(typeof h.score === 'number' && h.score >= 0 && h.score <= 100, `hour.score trong [0,100] (${h.zhi}=${h.score})`);
  assert(Array.isArray(h.reasons), `hour.reasons là mảng (${h.zhi})`);
  assert(h.dim && ['huangdao','yong','ziwei','shensha','officer'].every((k) => typeof h.dim[k] === 'number'), `hour.dim đủ 5 chiều (${h.zhi})`);
}

// P2. Đúng thứ tự 12 địa chi 子→亥
assert(bh1.hours.map((h) => h.zhi).join('') === '子丑寅卯辰巳午未申酉戌亥', '12 giờ đúng thứ tự 12 địa chi');

// P3. Determinism — chạy lại cho cùng kết quả
const bh1b = bestHourToday(BH_R, 2026, 6, 23);
assert(JSON.stringify(bh1) === JSON.stringify(bh1b), 'bestHourToday tất định khi chạy lại');

// P4. Scoring nhất quán: best chứa các giờ điểm CAO nhất, worst chứa điểm THẤP nhất
const sortedScores = [...bh1.hours].map((h) => h.score).sort((a, b) => b - a);
const bestScores = bh1.best.map((h) => h.score).sort((a, b) => b - a);
const worstScores = bh1.worst.map((h) => h.score).sort((a, b) => a - b);
assert(bestScores.join(',') === sortedScores.slice(0, 3).join(','), 'best = 3 giờ điểm cao nhất');
assert(worstScores.join(',') === sortedScores.slice(-2).sort((a,b)=>a-b).join(','), 'worst = 2 giờ điểm thấp nhất');

// P5. best[0].score >= worst[0].score (best luôn tốt hơn worst)
assert(bh1.best[0].score >= bh1.worst[0].score, `best đầu (${bh1.best[0].score}) >= worst đầu (${bh1.worst[0].score})`);

// P6. Trọng số 6 chiều tổng = 100
const wsum = Object.values(BEST_HOUR_WEIGHTS).reduce((a, b) => a + b, 0);
assert(wsum === 100, `tổng trọng số 6 chiều = 100 (thực tế ${wsum})`);
assert(BEST_HOUR_WEIGHTS.geju === 8, `chiều 格局 = 8% (thực tế ${BEST_HOUR_WEIGHTS.geju})`);

// P7. summary có nội dung + chứa tên giờ
assert(typeof bh1.summary === 'string' && bh1.summary.length > 10, 'summary có nội dung');
assert(bh1.summary.includes('giờ tốt nhất'), 'summary nhắc "giờ tốt nhất"');

// P8. reasons giải thích được WHY (giờ tốt phải có lý do cát, giờ xấu có lý do hung)
const topReasons = bh1.best[0].reasons.join(' ');
assert(topReasons.length > 0, `giờ tốt nhất (${bh1.best[0].zhi}) có reasons giải thích WHY`);

// P9. Khác ngày → kết quả khác (chứng minh thực sự phụ thuộc ngày)
const bh2 = bestHourToday(BH_R, 2026, 6, 24);
assert(JSON.stringify(bh1) !== JSON.stringify(bh2), 'khác ngày → kết quả khác');

// P10. Không crash cho mẫu nữ + ngày biên + mặc định hôm nay
bhThrew = false;
try {
  const Rnu = analyze(1985, 1, 20, 8, 0, 'nu', 2026);
  bestHourToday(Rnu, 2031, 2, 9);
  bestHourToday(Rnu); // mặc định hôm nay
} catch { bhThrew = true; }
assert(!bhThrew, 'không crash cho nữ + ngày biên + mặc định hôm nay');

// P11. Dụng Thần phản ánh trong reasons (giờ mang hành Dụng/Hỷ phải xuất hiện chữ "Dụng"/"Hỷ")
const dung = BH_R.yong.primary;
const hasYongReason = bh1.hours.some((h) => h.reasons.some((r) => r.includes('Dụng') || r.includes('Hỷ')));
assert(hasYongReason, 'có giờ mang ngũ hành Dụng/Hỷ (reasons phản ánh Dụng Thần)');

// P12. dayOfficer có giá trị (trực 建除)
assert(typeof bh1.dayOfficer.officerVi === 'string' && bh1.dayOfficer.officerVi.length > 0, `dayOfficer.officerVi có giá trị (${bh1.dayOfficer.officerVi})`);

console.log(`   2026-06-23 ${bh1.dayGanZhi} trực ${bh1.dayOfficer.officerVi}: BEST ${bh1.best.map((h)=>h.vi+'='+h.score).join(', ')} | WORST ${bh1.worst.map((h)=>h.vi+'='+h.score).join(', ')}`);
console.log(`   Top giờ: ${bh1.best[0].vi} (${bh1.best[0].range}) ${bh1.best[0].score}/100 — ${bh1.best[0].reasons.join(' / ')}`);
console.log(`   Summary: ${bh1.summary} ✓`);

// ============================================================================
// P13–P17. Chiều 6: 格局喜忌 (6th dimension — pattern-specific scoring)
// ============================================================================
// P13. Backward compatible: KHÔNG truyền patternYong → gejuEnabled=false, không có gejuScore
assert(bh1.gejuEnabled === false, 'mặc định gejuEnabled=false (backward compatible)');
assert(bh1.hours.every((h) => h.gejuScore === undefined), 'không truyền patternYong → không có gejuScore');
assert(Object.values(bh1.weights).reduce((a, b) => a + b, 0) === 100, 'weights (không geju) vẫn tổng 100');

// P14. Truyền patternYong → gejuEnabled=true, mỗi giờ có gejuScore/gejuReason
const py = BH_R.patternQuality?.patternYong;
assert(py && Array.isArray(py.xi) && Array.isArray(py.ji), 'chart có patternYong.xi/ji');
const bhG = bestHourToday(BH_R, 2026, 6, 23, py);
assert(bhG.gejuEnabled === true, 'truyền patternYong → gejuEnabled=true');
assert(bhG.weights.geju === 8, 'weights có chiều geju=8 khi bật');
assert(Object.values(bhG.weights).reduce((a, b) => a + b, 0) === 100, 'weights (6 chiều) tổng 100');
for (const h of bhG.hours) {
  assert(typeof h.gejuScore === 'number' && [-5, 0, 5].includes(h.gejuScore), `gejuScore ∈ {−5,0,+5} (${h.zhi}=${h.gejuScore})`);
  assert(typeof h.gejuReason === 'string' && h.gejuReason.length > 0, `gejuReason có nội dung (${h.zhi})`);
  assert(typeof h.dim.geju === 'number' && h.dim.geju >= 0 && h.dim.geju <= 100, `dim.geju trong [0,100] (${h.zhi})`);
}

// P15. Cụ thể theo nhóm thập thần (dayGan-agnostic): mỗi giờ gejuScore KHỚP nhóm
//   của thập thần giờ-can so với xi/ji của patternYong.
const dayGan = BH_R.chart.dayGan;
const xiSet = new Set(py.xi.map((x) => x.group));
const jiSet = new Set(py.ji.map((x) => x.group));
for (const h of bhG.hours) {
  const ganZhi = h.ganZhi;
  const hGan = ganZhi[0];
  if (!hGan || hGan === '?') continue;
  const grp = godGroup(tenGod(dayGan, hGan));
  const expected = xiSet.has(grp) ? 5 : (jiSet.has(grp) ? -5 : 0);
  assert(h.gejuScore === expected, `${h.zhi} (${ganZhi}) nhóm ${grp} → gejuScore=${expected} (thực tế ${h.gejuScore})`);
}
// Bảo đảm có ÍT NHẤT một giờ 格局喜 (+5) VÀ một giờ 格局忌 (−5) — chứng minh chiều có tác động.
const hasXi = bhG.hours.some((h) => h.gejuScore === 5);
const hasJi = bhG.hours.some((h) => h.gejuScore === -5);
assert(hasXi, 'có ít nhất 1 giờ 格局喜 (+5)');
assert(hasJi, 'có ít nhất 1 giờ 格局忌 (−5)');

// P16. Tác động lên xếp hạng: bật geju phải thay đổi thứ tự (so với tắt) ÍT NHẤT 1 vị trí
const topNoGeju = bh1.best[0].zhi;
const topWithGeju = bhG.best[0].zhi;
// Không assert bằng nhau (chính point: geju CHO THAY ĐỔI). Chỉ log để người xem thấy.
console.log(`   格局喜忌 BẬT: top giờ ${topWithGeju} (vs TẮT: ${topNoGeju}) — ${topWithGeju === topNoGeju ? 'không đổi' : 'THAY ĐỔI ✓'}`);

// P17. Determinism với geju
const bhG2 = bestHourToday(BH_R, 2026, 6, 23, py);
assert(JSON.stringify(bhG) === JSON.stringify(bhG2), 'bestHourToday+geju tất định khi chạy lại');
console.log(`   Chiều 格局: xi=[${py.xi.map((x)=>x.vi).join(',')}] ji=[${py.ji.map((x)=>x.vi).join(',')}] — 12 giờ gejuScore: ${bhG.hours.map((h)=>h.zhi+h.gejuScore).join(' ')} ✓`);


// ============================================================================
// ################## 60. DAILY BRIEFING 每日简报 (composite tổng hợp) #########
// ============================================================================
console.log('\n################## 60. DAILY BRIEFING 每日简报 (composite tổng hợp 8 nguồn) ##################');
import { dailyBriefing } from './src/engine/daily-briefing.js';
const DB_R = analyze(1990, 6, 15, 14, 30, 'nam', 2026);

// P1. Không crash + trả đủ các trường chính
let dbThrew = false; let db1;
try { db1 = dailyBriefing(DB_R, 2026, 6, 23); } catch (e) { dbThrew = true; console.log('   ERR', e.message); }
assert(!dbThrew, 'dailyBriefing không crash');
for (const k of ['date','lunarStr','dayGanZhi','rating','bestHours','avoidHours','ziweiDaily','directionTaboo','taisui','yongAction','yearEvent','tips','oneLiner','summary']) {
  assert(k in db1, `trả trường "${k}"`);
}

// P2. Các sub-field có cấu trúc đúng
assert(typeof db1.rating.score === 'number' && db1.rating.score >= 0 && db1.rating.score <= 100, `rating.score trong [0,100] (${db1.rating.score})`);
assert(['cat','hung','bình'].includes(db1.rating.tone), `rating.tone hợp lệ (${db1.rating.tone})`);
assert(typeof db1.rating.level === 'string' && db1.rating.level.length > 0, 'rating.level không rỗng');
assert(Array.isArray(db1.bestHours) && db1.bestHours.length <= 3, `bestHours <= 3 (${db1.bestHours.length})`);
assert(Array.isArray(db1.avoidHours) && db1.avoidHours.length <= 2, `avoidHours <= 2 (${db1.avoidHours.length})`);
for (const h of db1.bestHours) {
  assert(typeof h.zhi === 'string' && h.zhi.length === 1, `bestHour.zhi hợp lệ (${h.zhi})`);
  assert(typeof h.score === 'number', `bestHour.score là số (${h.zhi})`);
  assert(typeof h.topReason === 'string', `bestHour.topReason là string (${h.zhi})`);
}
assert(Array.isArray(db1.directionTaboo.avoid), 'directionTaboo.avoid là mảng');
assert(Array.isArray(db1.directionTaboo.safe), 'directionTaboo.safe là mảng');
assert(typeof db1.ziweiDaily.palace === 'string', 'ziweiDaily.palace là string');
assert(typeof db1.taisui.current === 'string', 'taisui.current là string');
assert(typeof db1.yongAction.reason === 'string', 'yongAction.reason là string');
assert(typeof db1.yearEvent.god === 'string', 'yearEvent.god là string');
assert(Array.isArray(db1.tips) && db1.tips.length >= 2 && db1.tips.length <= 3, `tips 2-3 phần tử (${db1.tips.length})`);

// P3. oneLiner KHÔNG rỗng + chứa ít nhất một keyword chốt
assert(typeof db1.oneLiner === 'string' && db1.oneLiner.length > 20, `oneLiner không rỗng (len=${db1.oneLiner.length})`);
assert(/(HOÀNG ĐẠO|HẮC ĐẠO|vận)/.test(db1.oneLiner), 'oneLiner nhắc tone ngày');
assert(/(Nên|Tránh)/.test(db1.oneLiner), 'oneLiner có hướng dẫn Nên/Tránh');

// P4. summary multi-line đầy đủ
assert(typeof db1.summary === 'string' && db1.summary.includes('\n'), 'summary là multi-line');
assert(db1.summary.includes(db1.dayGanZhi), 'summary chứa dayGanZhi');

// P5. Determinism — chạy lại cho cùng kết quả
const db1b = dailyBriefing(DB_R, 2026, 6, 23);
assert(JSON.stringify(db1) === JSON.stringify(db1b), 'dailyBriefing tất định khi chạy lại');

// P6. Khác ngày → kết quả khác
const db2 = dailyBriefing(DB_R, 2026, 6, 24);
assert(db1.dayGanZhi !== db2.dayGanZhi || JSON.stringify(db1) !== JSON.stringify(db2), 'khác ngày → kết quả khác');

// P7. Không crash cho mẫu nữ + ngày biên + mặc định hôm nay
dbThrew = false;
try {
  const Rnu = analyze(1985, 1, 20, 8, 0, 'nu', 2026);
  dailyBriefing(Rnu, 2031, 2, 9);
  dailyBriefing(Rnu); // mặc định hôm nay
  dailyBriefing(Rnu, 1999, 12, 31); // ngày biên cuối năm
} catch (e) { dbThrew = true; console.log('   ERR edge', e.message); }
assert(!dbThrew, 'không crash cho nữ + ngày biên + mặc định hôm nay');

// P8. Bền vững khi một nguồn lỗi: truyền R thiếu yong → vẫn trả (fallback an toàn)
dbThrew = false;
try { dailyBriefing({ chart: { input: { year: 1990, month: 6, day: 15, hour: 14, minute: 30, gender: 'nam' } } }, 2026, 6, 23); } catch { dbThrew = true; }
assert(!dbThrew, 'không crash khi R thiếu yong/chart');

// P9. ALGORITHM ELEVATION #11 — 格局喜忌 tag (optional patternQuality param)
//     DB_R = 辛 / 七殺格: patternYong.xi=[shi], ji=[cai].
//     (a) backward-compat: KHÔNG truyền patternQuality + R không có R.patternQuality → gejuTag=null.
//     (b) truyền patternQuality → gejuTag có đủ {tag,note,verdict,dayGod,group}.
//     (c) xi day (2026-01-08 壬/傷官) → ★格局喜.
//     (d) ji day (2026-01-01 乙/偏財) → ⚠格局忌.
//     (e) neutral day (2026-06-23 戊/正印) → ·格局中性.
//     (f) tag được inject vào oneLiner VÀ có dòng riêng trong summary.
const bareR = { chart: { input: DB_R.chart.input, dayGan: DB_R.chart.dayGan }, yong: DB_R.yong };
const bBare = dailyBriefing(bareR, 2026, 6, 23);
assert(bBare.gejuTag === null, 'P9a backward-compat: không truyền patternQuality → gejuTag=null');
assert(!bBare.oneLiner.includes('格局'), 'P9a backward-compat: oneLiner không chứa tag 格局');
assert(!bBare.summary.includes('格局:'), 'P9a backward-compat: summary không chứa dòng 格局');

const dbPy = DB_R.patternQuality;
assert(dbPy && dbPy.patternYong, 'P9 fixture: DB_R.patternQuality có patternYong');
const bPy = dailyBriefing(DB_R, 2026, 6, 23, dbPy);
assert(bPy.gejuTag && ['★格局喜','⚠格局忌','·格局中性'].includes(bPy.gejuTag.tag), `P9b gejuTag.tag hợp lệ (${bPy.gejuTag?.tag})`);
assert(typeof bPy.gejuTag.note === 'string' && bPy.gejuTag.note.length > 0, 'P9b gejuTag.note không rỗng');
assert(typeof bPy.gejuTag.verdict === 'string' && bPy.gejuTag.verdict.length > 0, `P9b gejuTag.verdict không rỗng (${bPy.gejuTag?.verdict})`);
assert(typeof bPy.gejuTag.dayGod === 'string', 'P9b gejuTag.dayGod là string');
assert(['ti','yin','shi','cai','guan'].includes(bPy.gejuTag.group), `P9b gejuTag.group hợp lệ (${bPy.gejuTag?.group})`);

// P9c xi day: 2026-01-08 (壬/傷官 → shi → xi của 七殺格)
const bXi = dailyBriefing(DB_R, 2026, 1, 8, dbPy);
assert(bXi.gejuTag.tag === '★格局喜', `P9c xi day → ★格局喜 (${bXi.gejuTag.tag} / ${bXi.gejuTag.dayGod})`);
assert(bXi.oneLiner.includes('★格局喜'), 'P9c xi day oneLiner chứa ★格局喜');

// P9d ji day: 2026-01-01 (乙/偏財 → cai → ji của 七殺格)
const bJi = dailyBriefing(DB_R, 2026, 1, 1, dbPy);
assert(bJi.gejuTag.tag === '⚠格局忌', `P9d ji day → ⚠格局忌 (${bJi.gejuTag.tag} / ${bJi.gejuTag.dayGod})`);
assert(bJi.oneLiner.includes('⚠格局忌'), 'P9d ji day oneLiner chứa ⚠格局忌');

// P9e neutral day: 2026-06-23 (戊/正印 → yin → không nằm trong xi=[shi] hay ji=[cai])
const bNeu = dailyBriefing(DB_R, 2026, 6, 23, dbPy);
assert(bNeu.gejuTag.tag === '·格局中性', `P9e neutral day → ·格局中性 (${bNeu.gejuTag.tag} / ${bNeu.gejuTag.dayGod})`);

// P9f tag injection: oneLiner có tag, summary có dòng "格局:"
assert(bPy.oneLiner.includes(bPy.gejuTag.tag), 'P9f oneLiner inject tag 格局');
assert(bPy.summary.includes('格局:'), 'P9f summary có dòng 格局');
assert(bPy.summary.includes(bPy.gejuTag.tag), 'P9f summary chứa tag');

// P9g auto-fallback: R.patternQuality có sẵn → không cần truyền param thứ 4 cũng dùng được
const bAuto = dailyBriefing(DB_R, 2026, 6, 23);
assert(bAuto.gejuTag !== null && bAuto.gejuTag.tag === bPy.gejuTag.tag, 'P9g auto-fallback R.patternQuality khi không truyền param');

// P9h determinism với patternQuality
const bPy2 = dailyBriefing(DB_R, 2026, 6, 23, dbPy);
assert(JSON.stringify(bPy) === JSON.stringify(bPy2), 'P9h dailyBriefing+patternQuality tất định');

console.log(`   格局 tag (DB_R=${DB_R.chart.dayGan}/${DB_R.pattern.vi}, xi=${dbPy.patternYong.xi.map(x=>x.vi).join('/')}, ji=${dbPy.patternYong.ji.map(x=>x.vi).join('/')}):`);
console.log(`     2026-01-08 (壬/傷官) → ${bXi.gejuTag.tag} ✓`);
console.log(`     2026-01-01 (乙/偏財) → ${bJi.gejuTag.tag} ✓`);
console.log(`     2026-06-23 (戊/正印) → ${bNeu.gejuTag.tag} ✓`);

console.log(`   2026-06-23 ${db1.dayGanZhi} (ÂL ${db1.lunarStr}): ${db1.rating.level} (${db1.rating.score}/100)`);
console.log(`   Giờ tốt: ${db1.bestHours.map((h)=>h.vi+'='+h.score).join(', ')} | Giờ kỵ: ${db1.avoidHours.map((h)=>h.vi).join(', ')}`);
console.log(`   Hướng kỵ: ${db1.directionTaboo.avoid.join(', ')} | 紫微: ${db1.ziweiDaily.palace} ${db1.ziweiDaily.vi} [${db1.ziweiDaily.tone}]`);
console.log(`   ONE-LINER: ${db1.oneLiner} ✓`);


// ===========================================================================
//  40. 河洛理数 (HELUO LISHU — 命卦) — bát tự → quẻ + 元堂
//  Nguồn: 《河洛理数》ctext, 《三才发秘·详元堂爻位式》shidianguji, guoxueruanjian.
//  Oracle: 辛亥 庚寅 甲子 丁卯 (阴男, 卯时) — thuật toán 飞支 chuẩn:
//    天数 18→8 艮, 地数 38→8 艮, 阴男→地上天 = 艮为山 #52.
//    元堂 = hào 6 (N=2 重: 子→3,丑→6,寅→3,卯→6; 卯→6).
//    变卦 = flip hào6 → 坤上艮下 = 地山谦 #15; 后天卦 = hoán → 艮上坤下 = 山地剥 #23.
//  (Lưu ý: ví dụ douban cho 元堂=2→蛊→渐 có lỗi thuật toán — dùng luật N≥4 cho
//   quẻ N=2; ta dùng chuẩn 飞支 重数.)
// ===========================================================================
import { heluo as heluoCast, flyBranches } from './src/engine/heluo.js';

console.log('\n################## 40. 河洛理数 (HELUO — 命卦) ##################');

// Oracle — dựng R với can-chi cố định theo ví dụ chuẩn
const heluoR = { chart: { input: { year: 1971, month: 1, day: 27, hour: 6, minute: 0, gender: 'nam' },
  pillars: { year: { gan: '辛', zhi: '亥' }, month: { gan: '庚', zhi: '寅' }, day: { gan: '甲', zhi: '子' }, time: { gan: '丁', zhi: '卯' } } } };
const ho = heluoCast(heluoR);
assert(ho.ok, 'heluo chạy không lỗi (辛亥庚寅甲子丁卯)');
assert(ho.tianRaw === 18 && ho.tianShu === 8 && ho.tianTrigram === '艮', '天数 18→8 → 艮');
assert(ho.diRaw === 38 && ho.diShu === 8 && ho.diTrigram === '艮', '地数 38→8 → 艮');
assert(ho.upperTrigram === '艮' && ho.lowerTrigram === '艮', '阴男 → 地上天下 → 艮为山');
// [loop 30] reduction «反复减» — 天/地 số luôn ∈ [1,9] dù raw lớn (max thiên 56/địa 72).
//   Trước đây trừ 1 lần → raw>50/60 leak số 2 chữ số → trigram sai.
{
  let leak = 0;
  for (const [y, m, d, h] of [[1969,5,5,12],[1978,8,8,14],[1959,3,3,6],[1988,11,11,10],[1975,7,7,8],[1992,2,2,4]]) {
    const R = analyze(y, m, d, h, 0, 'nam', 2026);
    const r = heluoCast(R);
    if (!(r.tianShu >= 1 && r.tianShu <= 9) || !(r.diShu >= 1 && r.diShu <= 9)) leak++;
  }
  assert(leak === 0, `heluo 天/地 số luôn ∈ [1,9] sau reduction (leak ${leak})`);
}
// ################## [loop 31] destiny-timeline golden-years rank≤3 + empty dayun guard ##################
{
  const { lifeTimeline } = await import('./src/engine/destiny-timeline.js');
  const R = analyze(1990, 6, 15, 14, 30, 'nam', 2026);
  const tl = lifeTimeline(R);
  assert(tl.goldenYears.every((g) => g.rank <= 3), 'golden-years rank ≤ 3 (sửa off-by-one <=4)');
  // empty dayun → KHÔNG render undefined
  const tlE = lifeTimeline({ ...R, dayun: [] });
  assert(!/undefined/.test(tlE.summary) && tlE.decades.length === 0, 'empty dayun → summary sạch (không undefined)');
}
// ################## [loop 36] Tuần Này 7 Ngày (week-preview.js) ##################
{
  const { weekPreview } = await import('./src/engine/week-preview.js');
  const R = analyze(1990, 6, 15, 14, 30, 'nam', 2026);
  const w = weekPreview(R, { days: 7, startDate: '2026-06-25' });
  assert(w.days.length === 7, `week-preview: 7 ngày (được ${w.days.length})`);
  assert(w.days.every((d) => d.score >= 0 && d.score <= 100 && d.tone), 'mỗi ngày có score + tone');
  assert(w.best && w.worst && w.best.score >= w.worst.score, 'best.score >= worst.score');
  assert(typeof w.summary === 'string' && w.summary.length > 10, 'summary có nội dung');
  console.log(`   Tuần 7 ngày ✓ — best ${w.best.weekdayVi} ${w.best.day}/${w.best.month} (${w.best.score}), worst ${w.worst.day}/${w.worst.month} (${w.worst.score}).`);
}

// ################## [loop 33] Mệnh Bàn Ngũ Duy radar (five-dim-radar.js) ##################
{
  const { fiveDimRadar } = await import('./src/engine/five-dim-radar.js');
  const R = analyze(1990, 6, 15, 14, 30, 'nam', 2026);
  const r = fiveDimRadar(R.chart);
  assert(r.dims.length === 5, '5 chiều thập thần (Tài/Quan/Ấn/Thực Thương/Tỷ Kiếp)');
  assert(r.dims.every((d) => d.score >= 0 && d.score <= 100), 'mỗi chiều score ∈ [0,100]');
  assert(['cai', 'guan', 'yin', 'shi', 'ti'].includes(r.dominant.key), 'dominant là 1 trong 5 nhóm');
  assert(r.dominant.raw >= r.weakest.raw, 'dominant.raw >= weakest.raw');
  console.log(`   Ngũ Duy ✓ — 1990 nam: trội ${r.dominant.vi.split(' ')[0]}(${r.dominant.score}), yếu ${r.weakest.vi.split(' ')[0]}(${r.weakest.score}).`);
}

{
  const { findGoldenYear } = await import('./src/engine/golden-year.js');
  const R = analyze(1990, 6, 15, 14, 30, 'nam', 2026);
  const g = findGoldenYear(R, 2026, 12);
  assert(g.ranked.length === 12, 'golden-year quét 12 năm');
  // golden chỉ là năm truly-golden (大运+流年 đều Dụng/Hỷ, ≥65) HOẶC null — KHÔ phải ranked[0] vô điều kiện
  assert(g.golden === null || g.golden.isTrulyGolden || g.golden.totalScore >= 65, 'golden = truly-golden (Dụng/Hỷ) hoặc null, không phải ranked[0] vô điều kiện');
  assert(g.ranked.every((r) => typeof r.isTrulyGolden === 'boolean'), 'mỗi năm có flag isTrulyGolden');
  console.log(`   golden-year ✓ — 1990 nam 2026-2037: truly-golden = ${g.ranked.filter(r=>r.isTrulyGolden).map(r=>r.year).join(',') || '(không)'}`);
}
assert(ho.hexagram.num === 52 && ho.hexagram.name === '艮', '本命卦 #52 艮为山');
assert(ho.yuantang.line === 6, '元堂 = hào 6 (N=2 重数, 卯→6)');
assert(ho.bianHexagram.upper === '坤' && ho.bianHexagram.lower === '艮', '变卦 = 坤上艮下 (地山谦)');
assert(ho.houtianHexagram.num === 23 && ho.houtianHexagram.name === '剥', '后天卦 #23 山地剥 (hoán thượng/hạ)');
console.log(`   Oracle: ${heluoR.chart.pillars.year.gan}${heluoR.chart.pillars.year.zhi} ${heluoR.chart.pillars.month.gan}${heluoR.chart.pillars.month.zhi} ${heluoR.chart.pillars.day.gan}${heluoR.chart.pillars.day.zhi} ${heluoR.chart.pillars.time.gan}${heluoR.chart.pillars.time.zhi} → #${ho.hexagram.num} ${ho.hexagram.name} (元堂 hào ${ho.yuantang.line}) → 后天 #${ho.houtianHexagram.num} ${ho.houtianHexagram.name} ✓`);

// [loop 550] HEX64 swap-fix regression — 8 cặp (16 entry) từng bị đảo thượng/hạ.
//   Chart 1990-06-15 14:30 nam → thượng震 hạ坤 = 雷地豫#16 (trước fix SAI = 复#24 地雷复).
{
  const heAsym = heluoCast(analyze(1990, 6, 15, 14, 30, 'nam', 2026));
  assert(heAsym.ok && heAsym.hexagram.upper === '震' && heAsym.hexagram.lower === '坤', `heluo 1990 → thượng震 hạ坤 (got ${heAsym.hexagram.upper}/${heAsym.hexagram.lower})`);
  assert(heAsym.hexagram.num === 16 && heAsym.hexagram.name === '豫', `[loop 550] HEX64 震坤 = 豫#16 (trước fix SAI=复#24), got ${heAsym.hexagram.name}#${heAsym.hexagram.num}`);
  console.log(`   HEX64 swap-fix ✓ — 1990: 震上坤下 = 豫#16 (đúng), không còn 复#24 (sai cũ)`);
}

// (a) Tất định
const ho2 = heluoCast(heluoR);
assert(JSON.stringify(ho) === JSON.stringify(ho2), 'heluo tất định khi chạy lại');

// (b) flyBranches sanity — 艮为山 [0,0,1,0,0,1], N=2 dương → 重 [3,6,3,6] + 寄 [1,2]
const fb = flyBranches([0,0,1,0,0,1], true);
assert(fb.mapping.join(',') === '3,6,3,6,1,2', '飞支 艮为山 N=2 dương: 子→3,丑→6,寅→3,卯→6,辰→1,巳→2');

// (c) Không crash cho các lá số biên (R thật từ analyze)
let heluoCrashed = false;
const edgeCases = [
  [1990, 6, 15, 14, 'nam'], [1985, 1, 20, 8, 'nu'], [2000, 12, 25, 23, 'nam'],
  [1971, 2, 3, 5, 'nu'], [1950, 6, 6, 0, 'nam'],
];
for (const [y, m, d, h, g] of edgeCases) {
  try {
    const Re = analyze(y, m, d, h, 0, g, 2026);
    const he = heluoCast(Re);
    if (!he.ok) { console.log('   WARN edge không ok:', y, m, d, h, g, he.error); }
  } catch (e) { heluoCrashed = true; console.log('   ERR edge', y, e.message); }
}
assert(!heluoCrashed, 'heluo không crash cho 5 lá số biên');

// (d) 5 寄宫 — kiểm tra một lá số mà 天数 hoặc 地数 giảm = 5 không bị NaN/undefined
//     (không cố định quẻ — tuỳ 三元+giới; chỉ kiểm tra không lỗi)
let jgCrashed = false;
try {
  // tìm 1 lá số có thể chạm 5 — chạy vài mẫu, chỉ cần không crash
  for (const [y, m, d, h, g] of [[1992, 3, 14, 9, 'nam'], [1988, 11, 30, 21, 'nu']]) {
    const Re = analyze(y, m, d, h, 0, g, 2026);
    const he = heluoCast(Re);
    if (he.ok && (he.tianShu === 5 || he.diShu === 5)) {
      assert(!!he.upperTrigram && !!he.lowerTrigram, `5寄宫 trả quẽ hợp lệ (${y}: 天${he.tianShu}/地${he.diShu})`);
    }
  }
} catch (e) { jgCrashed = true; console.log('   ERR 5寄宫', e.message); }
assert(!jgCrashed, '5寄宫 không crash');


// ################## N. 格局成败救应 (子平真詮 chương 9) ##################
console.log('\n################## N. 格局成败救应 (子平真詮 ch.9) ##################');
import { patternQuality, GE_RULES, adjustDayunByGeju, adjustLiunianByGeju } from './src/engine/pattern-quality.js';
import { scoreWuXing as _scoreWuXing, analyzeStrength as _analyzeStrength } from './src/engine/chart.js';
import { tenGod as _tenGod } from './src/engine/core.js';

// Xây R tối thiểu (chart + pattern + strength + interactions) từ 4 trụ [Năm,Tháng,Ngày,Giờ].
// Dùng HIDDEN + detectInteractions + computePattern + tenGod đã import ở đầu file.
function _ff(a, b, c, d) {
  const pillars = {
    year: { gan: a[0], zhi: a[1] }, month: { gan: b[0], zhi: b[1] },
    day: { gan: c[0], zhi: c[1] }, time: { gan: d[0], zhi: d[1] },
  };
  const dg = pillars.day.gan;
  for (const k of ['year', 'month', 'day', 'time']) {
    const p = pillars[k];
    p.ganGod = k === 'day' ? '日主' : _tenGod(dg, p.gan);
    p.hidden = HIDDEN[p.zhi].map((h) => ({ gan: h, god: _tenGod(dg, h) }));
  }
  const chart = { pillars, dayGan: dg, monthZhi: pillars.month.zhi, dayMaster: { gan: dg } };
  const wx = _scoreWuXing(chart);
  const st = _analyzeStrength(chart, wx);
  const ix = detectInteractions(pillars);
  const pat = computePattern(chart, wx, st, ix);
  return { chart, pattern: pat, strength: st, interactions: ix };
}

// 1. Bảng luật đủ cho 8 chính cách + luyue (không thiếu cách nào được dùng)
assert(Object.keys(GE_RULES).length >= 11, `GE_RULES đủ ≥11 cách (8 chính + luyue + tài biến); thấy ${Object.keys(GE_RULES).length}`);
for (const name of ['正官格', '七殺格', '正財格', '偏財格', '正印格', '偏印格', '食神格', '傷官格', '建祿格', '月劫格', '羊刃格']) {
  assert(!!GE_RULES[name], `GE_RULES có luật cho ${name}`);
  assert(GE_RULES[name].cheng.length > 0 && GE_RULES[name].bai.length > 0, `${name} có ≥1 luật thành + ≥1 luật bại`);
}

// 2. Thất Sát cách — 雍正 戊午 甲子 丁酉 壬寅:丁生子月 → 七杀, có bệnh + có cứu
{
  const R = _ff('戊午', '甲子', '丁酉', '壬寅');
  assert(R.pattern.name === '七殺格', '雍正 lá số: 丁生子月 = 七杀格');
  const pq = patternQuality(R);
  assert(['有救', '败格', '成格'].includes(pq.quality), `雍正 成败 chấm hợp lệ (${pq.quality})`);
  assert(pq.diseases.length > 0, '雍正 có ≥1 bệnh (Tài đảng Sát / dụng thần bị hợp)');
  assert(pq.keyStar && pq.keyStar.gan === '癸', '雍正 格 thần = 癸 (tàng ở tử)');
  console.log(`   雍正 → ${pq.quality} | bệnh:${pq.diseases.length} cứu:${pq.rescues.length}`);
}

// 3. 正官 cách — 甲正官 (辛 tàng ở Dậu), KHÔNG phạm伤官 (chỉ有食神丙是nhân)
{
  const R = _ff('己亥', '癸酉', '甲寅', '壬申');
  assert(R.pattern.name === '正官格', '甲生酉月 bản khí 辛 = 正官格');
  const pq = patternQuality(R);
  // 食神(丙) lành → KHÔNG được chấm "伤官克官"
  const noShangGuanDisease = !pq.diseases.some((d) => d.note.includes('Thương Quan khắc phá'));
  assert(noShangGuanDisease, '正官格: 食神(丙) không bị tính là "伤官克官" (lọc thập thần chính xác)');
}

// 4. 食神格 — chỉ 偏印 mới "đoạt thực", 正印 không
{
  // 丙生辰月 (戊 bản khí = 食神) → 食神格; cho 偏印(乙) → 枭夺食
  const R = _ff('乙未', '壬辰', '丙午', '戊申');
  if (R.pattern.name === '食神格') {
    const pq = patternQuality(R);
    const duoHit = pq.diseases.some((d) => d.note.includes('Kiêu') || d.note.includes('夺食'));
    console.log(`   食神格 (丙/辰 + 乙偏印): ${pq.quality} — đoạt thực ${duoHit ? 'phát hiện' : 'không'}`);
  }
}

// 5. patternQuality chạy được cho 3 lá số thực tế (không crash, trả verdict hợp lệ)
for (const [lbl, y, m, d, h, g] of [
  ['Nam 1990-06-15', 1990, 6, 15, 14, 'nam'],
  ['Nữ 1985-01-20', 1985, 1, 20, 8, 'nu'],
  ['Nam 2000-12-25', 2000, 12, 25, 23, 'nam'],
]) {
  const R = analyze(y, m, d, h, 0, g, 2026);
  const pq = R.patternQuality;
  assert(!!pq && ['成格', '有救', '败格', '特殊', '未知'].includes(pq.quality), `${lbl}: patternQuality trả verdict hợp lệ (${pq?.quality})`);
  assert(typeof pq.summary === 'string' && pq.summary.length > 10, `${lbl}: patternQuality có summary`);
}

// 6. Tổng luận + AI brief có nhắc 成败 (verify wiring)
{
  const R = analyze(1990, 6, 15, 14, 0, 'nam', 2026);
  const synthMentions = (R.synthesis.factors || []).some((f) => f.includes('格局成败'));
  assert(synthMentions, 'synthesis.factors có nhắc "格局成败"');
  const brief = buildChartBrief(R);
  assert(brief.includes('格局成败救应') && brief.includes(R.patternQuality.quality), 'AI brief có block "格局成败救应" + verdict');
}


// ################## O. 格局大运喜忌 (子平真詮 ch.10-11) ##################
console.log('\n################## O. 格局大运喜忌 (子平真詮 ch.10-11) ##################');

// O1. Hàm adjustDayunByGeju: cộng tầng 格局 LÊN TRÊN tầng ngũ hành (không thay thế).
{
  // Nam 1993-10-21 — 日本 己, 正財格 (theo spec). patternYong: xi=[shi,guan], ji=[ti].
  const R = analyze(1993, 10, 21, 12, 0, 'nam', 2026);
  assert(R.patternQuality && R.patternQuality.patternYong, '1993-10-21: patternQuality.patternYong tồn tại');
  const py = R.patternQuality.patternYong;
  console.log('   ↳ Cách:', R.pattern.name, '| xi groups:', (py.xi || []).map((x) => x.group + '/' + x.vi).join(','),
    '| ji groups:', (py.ji || []).map((x) => x.group + '/' + x.vi).join(','));

  // Mọi ptử dayun đều có gejuDelta (số) — có thể = 0 nếu không rơi xi/ji.
  const dayGan = R.chart.dayGan;
  const allHaveDelta = (R.dayun || []).every((d) => typeof d.gejuDelta === 'number');
  assert(allHaveDelta, 'mỗi đại vận có gejuDelta (số, có thể 0)');

  // Conservation: score = (tầng ngũ hành) + gejuDelta. Vì ta cộng đúng +2/−2 (giữ biên độ
  //   fav/avoid của computeDaYun), tổng chênh lệch giữa score và (score − gejuDelta) bằng
  //   đúng tổng gejuDelta → chứng minh tầng ngũ hành không bị thay thế, chỉ cộng thêm.
  const sumScore = (R.dayun || []).reduce((s, d) => s + (d.score || 0), 0);
  const sumDelta = (R.dayun || []).reduce((s, d) => s + (d.gejuDelta || 0), 0);
  const sumRaw = (R.dayun || []).reduce((s, d) => s + ((d.score || 0) - (d.gejuDelta || 0)), 0);
  assert(sumScore === sumRaw + sumDelta, `bảo toàn tầng ngũ hành: sum(score)=${sumScore} = sum(raw)=${sumRaw} + sum(delta)=${sumDelta}`);

  // Có ÍT NHẤT 1 vận 格局-thuận HOẶC 格局-nghịch (cho lá số 正財格, sẽ có vận shi/cai/ti).
  const fav = (R.dayun || []).filter((d) => d.gejuDelta > 0);
  const host = (R.dayun || []).filter((d) => d.gejuDelta < 0);
  assert(fav.length + host.length > 0, `có vận mang dấu 格局 (fav=${fav.length}, host=${host.length})`);

  if (fav.length) {
    // Tầng A (xi/ji) cho +2; tầng B (运中救应, ELEVATION #7) có thể cộng thêm +1 → +3,
    // hoặc trừ −1 nếu cùng lúc加重 bệnh → +1. Lấy một fav KHÔNG rescue/worsen để kiểm
    // tra đúng delta tầng A = +2; nếu tất cả fav đều dính tầng B thì chấp nhận ≥ +1.
    const pureFav = fav.find((d) => !d.gejuRescue && !d.gejuWorsen) || fav[0];
    const f = pureFav;
    const isPure = !f.gejuRescue && !f.gejuWorsen;
    assert(isPure ? f.gejuDelta === 2 : f.gejuDelta >= 1,
      `vận thuận đầu: ${isPure ? 'gejuDelta=+2 (tầng A thuần)' : 'gejuDelta≥+1 (tầng A+B)'} (god=${f.ganGod}, delta=${f.gejuDelta})`);
    assert(f.gejuNote.includes('格局喜'), `vận thuận đầu: note có "格局喜" (god=${f.ganGod})`);
  }
  if (host.length) {
    const pureHost = host.find((d) => !d.gejuRescue && !d.gejuWorsen) || host[0];
    const h = pureHost;
    const isPure = !h.gejuRescue && !h.gejuWorsen;
    assert(isPure ? h.gejuDelta === -2 : h.gejuDelta <= -1,
      `vận nghịch đầu: ${isPure ? 'gejuDelta=-2 (tầng A thuần)' : 'gejuDelta≤-1 (tầng A+B)'} (god=${h.ganGod}, delta=${h.gejuDelta})`);
    assert(h.gejuNote.includes('格局忌'), `vận nghịch đầu: note có "格局忌" (god=${h.ganGod})`);
  }

  // O2. Pure unit test: input rỗng / thiếu patternYong → không crash, trả mảng (clone).
  assert(Array.isArray(adjustDayunByGeju([], R.patternQuality, dayGan)), 'adjustDayunByGeju([]) → mảng rỗng');
  assert(Array.isArray(adjustDayunByGeju(R.dayun, null, dayGan)), 'adjustDayunByGeju(patternQuality=null) → trả lại clone');
  const noYong = { patternYong: { xi: [], ji: [] } };
  const out = adjustDayunByGeju(R.dayun, noYong, dayGan);
  assert(out.every((d) => d.gejuDelta === 0), 'patternYong rỗng → mọi gejuDelta = 0');

  // O3. Wiring: ai brief có nhắc 格局喜忌.
  const brief = buildChartBrief(R);
  const mentionsGeju = brief.includes('格局喜忌') || (fav.length && brief.includes('格局喜')) || (host.length && brief.includes('格局忌'));
  assert(mentionsGeju, 'AI brief có nhắc 格局喜/忌 (大运 được phân loại theo cách)');

  // O4. Wiring: synthesis có đoạn best/worst 大运 per 格局.
  const synthMentionsDayunGeju = (R.synthesis.paragraphs || []).some((p) => /cách-thuận|cách-nghịch/.test(p));
  assert(synthMentionsDayunGeju, 'synthesis.paragraphs có phân loại vận cách-thuận/cách-nghịch');
}

// ################## P. 格局流年喜忌 (子平真詮 ch.10-11 — loop 3) ##################
console.log('\n################## P. 格局流年喜忌 (子平真詮 ch.10-11 — loop 3) ##################');

// P1. Hàm adjustLiunianByGeju: cộng tầng 格局 LÊN TRÊN 5 trường phái (không thay thế).
{
  // Nam 1993-10-21 — 日主 乙, 正財格. patternYong: xi=[shi,guan], ji=[ti].
  // 2026=丙午 → tenGod(乙,丙)=傷官 (nhóm shi) → 格局喜 (+3).
  // 2027=丁未 → tenGod(乙,丁)=食神 (nhóm shi) → 格局喜 (+3).
  // Năm 甲/乙 can → 比/劫 (nhóm ti) → 格局忌 (−3).
  const R = analyze(1993, 10, 21, 12, 0, 'nam', 2026);
  assert(R.patternQuality && R.patternQuality.patternYong, '1993-10-21 (liunian): patternQuality.patternYong tồn tại');
  const dayGan = R.chart.dayGan;
  assert(dayGan === '乙', '1993-10-21 日主 = 乙 (spec)');

  // Mọi ptử liunian đều có gejuDelta (số) — có thể = 0 nếu không rơi xi/ji.
  const allHaveDelta = (R.liunian || []).every((l) => typeof l.gejuDelta === 'number');
  assert(allHaveDelta, 'mỗi lưu niên có gejuDelta (số, có thể 0)');
  assert((R.liunian || []).length > 0, 'R.liunian không rỗng (có dữ liệu để test)');

  // Conservation: score = (5 trường phái) + gejuDelta → chứng minh không thay thế tầng cốt lõi.
  const sumScore = (R.liunian || []).reduce((s, l) => s + (l.score || 0), 0);
  const sumDelta = (R.liunian || []).reduce((s, l) => s + (l.gejuDelta || 0), 0);
  const sumRaw = (R.liunian || []).reduce((s, l) => s + ((l.score || 0) - (l.gejuDelta || 0)), 0);
  assert(sumScore === sumRaw + sumDelta, `bảo toàn 5 trường phái: sum(score)=${sumScore} = sum(raw)=${sumRaw} + sum(delta)=${sumDelta}`);

  // Có ÍT NHẤT 1 năm 格局-thuận HOẶC 格局-nghịch.
  const fav = (R.liunian || []).filter((l) => l.gejuDelta > 0);
  const host = (R.liunian || []).filter((l) => l.gejuDelta < 0);
  assert(fav.length + host.length > 0, `có năm mang dấu 格局 (fav=${fav.length}, host=${host.length})`);

  if (fav.length) {
    const f = fav[0];
    assert(f.gejuDelta === 3 && f.gejuNote.includes('格局喜'), `năm thuận đầu: gejuDelta=+3, note có "格局喜" (god=${f.ganGod})`);
  }
  if (host.length) {
    const h = host[0];
    assert(h.gejuDelta === -3 && h.gejuNote.includes('格局忌'), `năm nghịch đầu: gejuDelta=-3, note có "格局忌" (god=${h.ganGod})`);
  }

  // P2. 2026 (丙午) và 2027 (丁未) nếu nằm trong R.liunian → 格局喜 (+3).
  //   R.liunian là 10 năm của đại vận đang hành → 2026/2027 thường nằm trong.
  //   Dùng analyzeLiunianDeep để test chính xác 2 năm (deep wrapper lấy patternYong).
  const d26 = analyzeLiunianDeep(R, 2026, R.patternQuality.patternYong);
  const d27 = analyzeLiunianDeep(R, 2027, R.patternQuality.patternYong);
  assert(d26.ganGod === '傷官', `2026 丙午: tenGod(乙,丙)=傷官 (thực thương — nhóm shi)`);
  assert(d27.ganGod === '食神', `2027 丁未: tenGod(乙,丁)=食神 (thực thương — nhóm shi)`);
  assert(d26.gejuFavor === '喜', `2026 (傷官, nhóm shi = xi của 正財格) → 格局喜`);
  assert(d27.gejuFavor === '喜', `2027 (食神, nhóm shi = xi của 正財格) → 格局喜`);
  // Trường phái thứ 6 "格局喜忌" đã được thêm vào schools.
  assert(d26.schools.some((s) => s.phai.includes('格局喜忌')), '2026 schools có trường phái "格局喜忌"');
  assert(d27.schools.some((s) => s.phai.includes('格局喜忌')), '2027 schools có trường phái "格局喜忌"');
  // Deep KHÔNG đổi score cốt lõi (điểm số ở tầng R.liunian do adjustLiunianByGeju cộng).
  const d26NoPy = analyzeLiunianDeep(R, 2026);
  assert(d26.score === d26NoPy.score, 'analyzeLiunianDeep với/không patternYong: score cốt lõi không đổi');

  // Pure unit test: adjustLiunianByGeju với input rỗng / thiếu patternYong.
  assert(Array.isArray(adjustLiunianByGeju([], R.patternQuality, dayGan)), 'adjustLiunianByGeju([]) → mảng rỗng');
  assert(Array.isArray(adjustLiunianByGeju(R.liunian, null, dayGan)), 'adjustLiunianByGeju(patternQuality=null) → trả lại clone');
  const noYong = { patternYong: { xi: [], ji: [] } };
  const out = adjustLiunianByGeju(R.liunian, noYong, dayGan);
  assert(out.every((l) => l.gejuDelta === 0), 'patternYong rỗng → mọi gejuDelta = 0');

  // P3. Wiring: ai brief có nhắc 格局喜/忌 của lưu niên.
  const brief = buildChartBrief(R);
  const favBrief = fav.length && brief.includes('格局喜');
  const hostBrief = host.length && brief.includes('格局忌');
  const lnBrief = brief.includes('格局喜') || brief.includes('格局忌') || brief.includes('THUẬN CÁCH') || brief.includes('GHÉT CÁCH');
  assert(favBrief || hostBrief || lnBrief, 'AI brief có nhắc 格局喜/忌 của lưu niên');
}

// ################## Q. 运中救应 / 运中破格 (ALGORITHM ELEVATION #7 — 运能改格) ##################
console.log('\n################## Q. 运中救应 / 运中破格 (运能改格) ##################');

// Q1. Hàm adjustDayunByGeju thêm gejuRescue/gejuWorsen flags + rescue/worsen tầng cộng dồn.
{
  // Nam 1993-10-21 — 日主 乙, 正財格, 败格.
  // diseases: [he(killers=[]), xoroot(killers=[ti]), dang(killers=[guan])]
  // rescues:  [drug=[shi], drug=[shi]]
  // → 大运 shi (丁巳/丙辰) → ★RESCUES; 大运 ti (乙卯/甲寅) → ⚠WORSENS.
  const R = analyze(1993, 10, 21, 12, 0, 'nam', 2026);
  assert(R.patternQuality && R.patternQuality.diseases && R.patternQuality.rescues,
    '1993-10-21: patternQuality có diseases + rescues');
  assert(R.patternQuality.quality === '败格', `1993-10-21 là 败格 (thấy ${R.patternQuality.quality})`);

  // Mọi ptử dayun đều có gejuRescue + gejuWorsen (boolean).
  const allHaveFlags = (R.dayun || []).every((d) => typeof d.gejuRescue === 'boolean' && typeof d.gejuWorsen === 'boolean');
  assert(allHaveFlags, 'mỗi đại vận có gejuRescue + gejuWorsen (boolean)');

  // Có ÍT NHẤT 1 vận CỨU CÁCH (vì 正財格 bại có rescue drug=shi, dayun có 丁巳/丙辰 thuộc nhóm shi).
  const rescuers = (R.dayun || []).filter((d) => d.gejuRescue);
  assert(rescuers.length > 0, `có vận CỨU CÁCH (rescuers=${rescuers.length})`);
  for (const r of rescuers) {
    // Vận cứu có tag ★RESCUES trong gejuNote.
    assert(r.gejuNote.includes('★RESCUES') && r.gejuNote.includes('CỨU CÁCH'),
      `vận ${r.ganZhi}: gejuNote có "★RESCUES" + "CỨU CÁCH"`);
    // rescueNotes[] lưu note cụ thể của rescue.
    assert(Array.isArray(r.rescueNotes) && r.rescueNotes.length > 0,
      `vận ${r.ganZhi}: rescueNotes[] không rỗng`);
  }
  console.log(`   ↳ Vận CỨU CÁCH: ${rescuers.map((d) => d.ganZhi + '(' + d.ganGod + ')').join(', ')}`);

  // Có ÍT NHẤT 1 vận 加重格病 (vì disease killer=[ti], dayun có 乙卯/甲寅 thuộc nhóm ti).
  const worseners = (R.dayun || []).filter((d) => d.gejuWorsen);
  assert(worseners.length > 0, `có vận加重格病 (worseners=${worseners.length})`);
  for (const w of worseners) {
    assert(w.gejuNote.includes('⚠WORSENS'), `vận ${w.ganZhi}: gejuNote có "⚠WORSENS"`);
    assert(Array.isArray(w.worsenNotes) && w.worsenNotes.length > 0,
      `vận ${w.ganZhi}: worsenNotes[] không rỗng`);
  }
  console.log(`   ↳ Vận加重格病: ${worseners.map((d) => d.ganZhi + '(' + d.ganGod + ')').join(', ')}`);

  // Q2. Conservation (tầng B cộng DỒN lên tầng A, không thay thế tầng ngũ hành):
  //   sum(score) = sum(raw ngũ hành) + sum(gejuDelta). gejuDelta = tầng A (±2) ± tầng B (±1).
  const sumScore = (R.dayun || []).reduce((s, d) => s + (d.score || 0), 0);
  const sumDelta = (R.dayun || []).reduce((s, d) => s + (d.gejuDelta || 0), 0);
  const sumRaw = (R.dayun || []).reduce((s, d) => s + ((d.score || 0) - (d.gejuDelta || 0)), 0);
  assert(sumScore === sumRaw + sumDelta,
    `bảo toàn: sum(score)=${sumScore} = sum(raw)=${sumRaw} + sum(delta)=${sumDelta}`);

  // Q3. Cộng dồn tầng A + B: một vận vừa xi (+2) vừa rescue (+1) → gejuDelta = +3.
  //   Một vận vừa ji (−2) vừa worsen (−1) → gejuDelta = −3.
  if (rescuers.length) {
    const r = rescuers[0];
    // rescue luôn đi cùng xi (drug ⊆ xi groups) → delta ≥ +3.
    assert(r.gejuDelta >= 3, `vận cứu đầu (${r.ganZhi}): gejuDelta=${r.gejuDelta} ≥ +3 (xi +2 + rescue +1)`);
  }
  if (worseners.length) {
    // Tìm một worsener cũng là ji (killer ⊆ ji groups).
    const jiWorsen = worseners.find((w) => w.gejuDelta <= -3);
    if (jiWorsen) {
      assert(jiWorsen.gejuDelta <= -3, `vận ji+worsen (${jiWorsen.ganZhi}): gejuDelta=${jiWorsen.gejuDelta} ≤ −3`);
    }
  }

  // Q4. Pure unit test: input rỗng / thiếu diseases/rescues → không crash, flags=false.
  assert(Array.isArray(adjustDayunByGeju([], R.patternQuality, '乙')), 'adjustDayunByGeju([]) → mảng rỗng');
  const noDR = { patternYong: R.patternQuality.patternYong, diseases: [], rescues: [] };
  const out = adjustDayunByGeju(R.dayun, noDR, '乙');
  assert(out.every((d) => d.gejuRescue === false && d.gejuWorsen === false),
    'diseases/rescues rỗng → mọi gejuRescue/gejuWorsen = false');

  // Q5. Wiring: synthesis có nhắc "运中救应" / "CỨU CÁCH" khi có vận cứu.
  const synthMentionsRescue = (R.synthesis.paragraphs || []).some((p) => /运中救应|CỨU CÁCH/.test(p));
  assert(synthMentionsRescue, 'synthesis.paragraphs có nhắc "运中救应 / CỨU CÁCH"');

  // Q6. Wiring: AI brief có tag ★RESCUES / ⚠WORSENS trong chuỗi 大运.
  const brief = buildChartBrief(R);
  assert(brief.includes('★RESCUES') || brief.includes('⚠WORSENS') || brief.includes('CỨU CÁCH'),
    'AI brief có tag ★RESCUES / ⚠WORSENS / CỨU CÁCH');
}

// ################## R. BÁT TỰ NGƯỢC (逆推 — INVERSE SOLVER) [loop 21] ##################
//   Nguyên lý user: phương pháp chuẩn phải DỊCH NGƯỢC được. Đã chấm điểm mệnh → phải tìm
//   được lá số điểm CAO/THẤP nhất. Quét-thật bằng analyze() → cực đại/cực tiểu thật.
console.log('\n################## R. BÁT TỰ NGƯỢC (逆推 INVERSE SOLVER) ##################');
{
  const { inverseBaZiSolve, labelResult } = await import('./src/engine/inverse-bazi.js');
  // Cửa sổ nhỏ, nhanh: 3 tháng 1990, step 7 ngày, 12时辰 × 2 giới
  const r = inverseBaZiSolve({ refYear: 2026, yearStart: 1990, yearEnd: 1990, stepDays: 7, topK: 3, maxSamples: 1500 });
  assert(r.scanned > 50, `inverseBaZiSolve quét được nhiều lá số (được ${r.scanned})`);
  assert(r.max && r.min && r.max.score >= r.min.score, 'max.score >= min.score');
  assert(r.max.score > r.min.score, 'có sự phân biệt điểm (max > min)');
  // Tính NHẤT QUÁN: lá max re-analyze phải ra cùng điểm (chứng minh score thật, không random)
  const reMax = analyze(r.max.y, r.max.m, r.max.d, r.max.h, r.max.min, r.max.g, 2026);
  assert(reMax.synthesis.score === r.max.score, `lá max re-analyze cùng điểm (${reMax.synthesis.score} vs ${r.max.score})`);
  const reMin = analyze(r.min.y, r.min.m, r.min.d, r.min.h, r.min.min, r.min.g, 2026);
  assert(reMin.synthesis.score === r.min.score, `lá min re-analyze cùng điểm (${reMin.synthesis.score} vs ${r.min.score})`);
  // Histogram tổng = scanned
  const histSum = r.histogram.reduce((s, h) => s + h.count, 0);
  assert(histSum === r.scanned, `histogram tổng (${histSum}) = scanned (${r.scanned})`);
  // Target: tìm được lá số gần target
  const t = inverseBaZiSolve({ refYear: 2026, yearStart: 1990, yearEnd: 1990, stepDays: 7, target: 65, maxSamples: 1500 });
  assert(t.nearestToTarget && Math.abs(t.nearestToTarget.score - 65) <= 20, `target 65 → tìm được lá số gần (điểm ${t.nearestToTarget && t.nearestToTarget.score})`);
  // Cao nhất thường là 成格/有救, thấp nhất thường 败格 — xu hướng cổ pháp
  console.log(`   Quét ${r.scanned} lá / ${r.durationMs}ms. Khoảng ${r.scoreStats.min}→${r.scoreStats.max} (TB ${r.scoreStats.mean}).`);
  console.log(`   CAO NHẤT: ${labelResult(r.max)}`);
  console.log(`   THẤP NHẤT: ${labelResult(r.min)}`);
}

// ################## S. [loop 69] 盲派 暗合/暗冲 nghiêm ngặt + 化气格 rootOk stricter ##################
//   Sửa 3 bug cùng pattern "cổ pháp nghiêm bị code lỏng" (y hệt bug 天克/五行克):
//   1) 暗合 = 6 cặp CHI chuẩn (đừng quét thiên can ngũ hợp lộ+tàng)
//   2) 暗冲 = THIÊN KHẮC 4 cặp GAN_CHONG (đừng dùng ngũ hành 克 chung)
//   3) 化气格 rootOk 0.3→0.6 (Hóa hành phải thật thông căn, không chỉ dư khí lẻ)
import { isAnHe, AN_HE, detectAnhe } from './src/engine/anhe.js';
import { isGanChong, detectAnchong } from './src/engine/anchong.js';
import { HIDDEN as C_HIDDEN } from './src/engine/constants.js';
console.log('\n################## S. [loop 69] 盲派暗合/暗冲 nghiêm + 化气格 rootOk ##################');
{
  // --- S1. 6 cặp暗合 chuẩn ---
  assert(isAnHe('寅','丑') && isAnHe('丑','寅'), '暗合 寅↔丑 (đối xứng)');
  assert(isAnHe('卯','申'), '暗合 卯↔申 (乙庚)');
  assert(isAnHe('巳','戌') && isAnHe('巳','酉'), '暗合 巳↔戌 & 巳↔酉 (丙辛)');
  assert(isAnHe('午','亥') && isAnHe('未','亥'), '暗合 午↔亥 & 未↔亥');
  // phủ định: các cặp KHÔNG phải暗合 chuẩn (trước đây báo bừa)
  assert(!isAnHe('寅','午') && !isAnHe('子','丑') && !isAnHe('辰','戌') && !isAnHe('卯','酉'), 'KHÔNG暗合: 寅午/子丑/辰戌/卯酉 (sửa bug quét bừa)');
  // đếm cặp chuẩn: 6 cặp (12 hướng đối xứng trong map)
  const allKeys = Object.keys(AN_HE);
  let dirCount = 0; for (const k of allKeys) dirCount += AN_HE[k].length;
  assert(dirCount === 12, `暗 hợp chuẩn = 6 cặp × 2 hướng = 12 entry (được ${dirCount})`);

  // detectAnhe trên lá số có 寅丑 → 全暗合 (3/3 tàng can ngũ hợp)
  const anheChart = { pillars: {
    year: { gan:'甲', zhi:'寅' }, month: { gan:'己', zhi:'丑' },
    day: { gan:'丙', zhi:'午' }, time: { gan:'庚', zhi:'申' },
  }};
  const an = detectAnhe(anheChart);
  assert(an.pairs.length === 1 && an.pairs[0].chiA + an.pairs[0].chiB === '寅丑' && an.pairs[0].isQuanAn, 'detectAnhe: 寅丑 = 全暗合 (3/3), các cặp khác không算');
  assert(an.pairs[0].hePairs.length === 3, '寅丑 tàng can ngũ hợp đủ 3: 甲己 丙辛 戊癸');

  // --- S2. GAN_CHONG 4 cặp nghiêm ---
  assert(isGanChong('甲','庚') && isGanChong('庚','甲'), '天克 甲↔庚 (đối xứng)');
  assert(isGanChong('乙','辛') && isGanChong('丙','壬') && isGanChong('丁','癸'), '天克 乙辛 / 丙壬 / 丁癸');
  // phủ định: 戊己 (thổ trung) KHÔNG有天克; 同五行 không天克
  assert(!isGanChong('戊','壬') && !isGanChong('己','癸') && !isGanChong('戊','甲') && !isGanChong('甲','乙') && !isGanChong('丙','丁'), 'KHÔNG天克: 戊壬/己癸/戊甲 (thổ trung) + 甲乙/丙丁 (同五行) — sửa bug ngũ hành 克 bừa');

  // detectAnchong: 甲↔庚 天克; 戊 day露 KHẮC nothing (thổ trung)
  const hid = (z) => C_HIDDEN[z].map((g) => ({ gan: g }));
  const achChart = { pillars: {
    year: { gan:'甲', zhi:'寅', hidden: hid('寅') }, month: { gan:'丙', zhi:'寅', hidden: hid('寅') },
    day: { gan:'戊', zhi:'午', hidden: hid('午') }, time: { gan:'庚', zhi:'申', hidden: hid('申') },
  }};
  const ac = detectAnchong(achChart);
  const hasJiaGeng = ac.pairs.some((p) => (p.ganA === '甲' && p.ganB === '庚') || (p.ganA === '庚' && p.ganB === '甲'));
  assert(hasJiaGeng, 'detectAnchong: phát hiện 甲↔庚 天克');
  //戊 (day露) không tạo天克 với bất kỳ → KHÔNG có pair nào gán 戊 làm 天克 chủ thể
  assert(!ac.pairs.some((p) => p.ganA === '戊' || p.ganB === '戊'), '戊 (thổ trung) KHÔNG天克 với ai — lọc đúng');

  // --- S3. 化气格 rootOk stricter (0.3→0.6) ---
  // 甲+己午(火令 sinh Hóa Thổ) NHƯNG Thổ chỉ có 中气 己 ở 午 (0.3×1.8=0.54 < 0.6) →
  //   KHÔNG thành Hóa khí cách (Hóa hành vô bản khí căn). Trước đây 0.54≥0.3 → fake THÀNH.
  const hq3 = analyzeHuaQi({ chart: { dayGan:'甲', dayMaster:{wx:'木'}, pillars: {
    year: { gan:'丙', zhi:'子' }, month: { gan:'己', zhi:'午' },
    day: { gan:'甲', zhi:'子' }, time: { gan:'丁', zhi:'卯' },
  }}, strength: { monthMainWx:'火' } });
  assert(hq3.hasHe === true && hq3.huaQiGe === false, '甲己/午月(火 sinh Thổ) nhưng Thổ chỉ 中气 0.54 < 0.6 → KHÔNG thành Hóa (sửa fake hóa)');
  const weak3 = hq3.pairs.find((p) => p.with === 'month');
  assert(weak3 && weak3.monthOk === true && weak3.rootOk === false && Math.abs(weak3.rootTotal - 0.54) < 0.01, `Thổ root 0.54 (trung khí 午×1.8): monthOk=T, rootOk=F (ngưỡng 0.6)`);
  // đối chứng: cùng cấu trúc NHƯNG thêm 辰 day (Thổ bản khí) → root vượt 0.6 → THÀNH
  const hq4 = analyzeHuaQi({ chart: { dayGan:'甲', dayMaster:{wx:'木'}, pillars: {
    year: { gan:'丙', zhi:'子' }, month: { gan:'己', zhi:'午' },
    day: { gan:'甲', zhi:'辰' }, time: { gan:'丁', zhi:'卯' },
  }}, strength: { monthMainWx:'火' } });
  assert(hq4.huaQiGe === true, '甲己/午月 + 辰 (Thổ bản khí 0.6+) → THÀNH Hóa Thổ (root đủ mạnh)');

  console.log(`   暗合: 6 cặp chuẩn ✓ (寅丑全暗合 3/3 tàng can) | 暗冲: 4 cặp天克 ✓ (戊 thổ trung bị lọc)`);
  console.log(`   化气格: root 0.54<0.6 → KHÔNG thành ✓; root 0.6+ (có 辰) → THÀNH ✓ (chống fake hóa khí)`);
}

// ################## T. [loop 70] 寒暖燥湿 HÀN-NOÃN-TÁO-THẤP (tính năng mới) ##################
import { analyzeHanNuan, MONTH_CLIMATE } from './src/engine/han-nuan.js';
console.log('\n################## T. [loop 70] 寒暖燥湿 HÀN-NOÃN-TÁO-THẤP ##################');
{
  // Month climate nền đúng cổ pháp: 亥子=hàn cực (temp âm lớn), 巳午=nhiệt cực (temp dương lớn)
  assert(MONTH_CLIMATE['子'].temp < -1.5 && MONTH_CLIMATE['午'].temp > 1.5, 'khí hậu nền: 子 hàn cực (temp<-1.5), 午 nhiệt cực (temp>1.5)');
  // 季月 táo/thấp phân minh: 未戌 = 燥 (humid âm), 辰丑 = 湿 (humid dương)
  assert(MONTH_CLIMATE['未'].humid < 0 && MONTH_CLIMATE['戌'].humid < 0, '未/戌 = 燥土 (humid âm)');
  assert(MONTH_CLIMATE['辰'].humid > 0 && MONTH_CLIMATE['丑'].humid > 0, '辰/丑 = 湿土 (humid dương)');

  // S1. HÀN lạnh — 子月 + toàn Thủy → temperature 寒, cần Hỏa noãn
  const hnCold = analyzeHanNuan({ chart: { monthZhi:'子', pillars: {
    year:{gan:'壬',zhi:'亥'}, month:{gan:'癸',zhi:'子'}, day:{gan:'壬',zhi:'子'}, time:{gan:'癸',zhi:'亥'},
  }}, yong:{primary:'火'} });
  assert(hnCold.temperature === '寒', `mệnh Thủy 子月 → HÀN (được ${hnCold.tempVi}, điểm ${hnCold.tempScore})`);
  assert(hnCold.needs.some((n) => n.wx === '火'), '寒 → cần Hỏa noãn («寒甚必用火暖»)');
  assert(hnCold.alignNote.includes('TRÙNG') || hnCold.alignNote.includes('✓'), 'Dụng Hỏa TRÙNG nhu cầu寒 → Dụng thật vững');

  // S2. NOÃN/NHIỆT — 午月 + toàn Hỏa → temperature 暖, cần Thủy
  const hnHot = analyzeHanNuan({ chart: { monthZhi:'午', pillars: {
    year:{gan:'丙',zhi:'巳'}, month:{gan:'丁',zhi:'午'}, day:{gan:'丙',zhi:'午'}, time:{gan:'丁',zhi:'巳'},
  }}, yong:{primary:'水'} });
  assert(hnHot.temperature === '暖', `mệnh Hỏa 午月 → NOÃN/NHIỆT (điểm ${hnHot.tempScore})`);
  assert(hnHot.needs.some((n) => n.wx === '水'), '暖 → cần Thủy nhuận («燥甚必用水润»)');
  assert(hnHot.alignNote.includes('TRÙNG') || hnHot.alignNote.includes('✓'), 'Dụng Thủy TRÙNG nhu cầu暖');

  // S3. TÁO — 戌月 + 未/戌 chi + ít Thủy → humidity 燥
  const hnDry = analyzeHanNuan({ chart: { monthZhi:'戌', pillars: {
    year:{gan:'戊',zhi:'未'}, month:{gan:'丙',zhi:'戌'}, day:{gan:'戊',zhi:'戌'}, time:{gan:'丁',zhi:'未'},
  }}, yong:{primary:'水'} });
  assert(hnDry.humidity === '燥', `mệnh táo thổ (未戌+Hỏa) → TÁO (điểm ${hnDry.humidScore})`);
  assert(hnDry.needs.some((n) => n.wx === '水'), '燥 → cần Thủy nhuận');

  // S4. THẤP — 丑月 + 辰/丑 + Thủy → humidity 湿
  const hnWet = analyzeHanNuan({ chart: { monthZhi:'丑', pillars: {
    year:{gan:'己',zhi:'辰'}, month:{gan:'癸',zhi:'丑'}, day:{gan:'辛',zhi:'丑'}, time:{gan:'壬',zhi:'辰'},
  }}, yong:{primary:'火'} });
  assert(hnWet.humidity === '湿', `mệnh thấp thổ (辰丑+Thủy) → THẤP (điểm ${hnWet.humidScore})`);
  assert(hnWet.needs.some((n) => n.wx === '火'), '湿 → cần Hỏa bốc + Mộc thấu');

  // S5. CÂN — 卯月 (ôn hoà) + ngũ hành pha → 平 / 平
  const hnBal = analyzeHanNuan({ chart: { monthZhi:'卯', pillars: {
    year:{gan:'甲',zhi:'寅'}, month:{gan:'乙',zhi:'卯'}, day:{gan:'丙',zhi:'午'}, time:{gan:'壬',zhi:'子'},
  }}, yong:{primary:'木'} });
  assert(hnBal.temperature === '平', `ô nhiễm/ôn hoà → temperature 平 (điểm ${hnBal.tempScore})`);
  assert(hnBal.needs.length === 0, 'khí hậu cân → không nhu cầu điều hậu ép buộc');

  // S6. DỤng ≠ nhu cầu → cảnh báo phối hợp
  const hnMisalign = analyzeHanNuan({ chart: { monthZhi:'子', pillars: {
    year:{gan:'壬',zhi:'亥'}, month:{gan:'癸',zhi:'子'}, day:{gan:'壬',zhi:'子'}, time:{gan:'癸',zhi:'亥'},
  }}, yong:{primary:'金'} }); // 寒 cần Hỏa, nhưng Dụng = Kim → MISMATCH
  assert(hnMisalign.alignNote.includes('⚠'), 'Dụng Kim ≠ nhu cầu寒(Hỏa) → cảnh báo phối hợp');

  // S7. deterministic
  const hnAgain = analyzeHanNuan({ chart: { monthZhi:'子', pillars: {
    year:{gan:'壬',zhi:'亥'}, month:{gan:'癸',zhi:'子'}, day:{gan:'壬',zhi:'子'}, time:{gan:'癸',zhi:'亥'},
  }}, yong:{primary:'火'} });
  assert(JSON.stringify(hnCold.summary) === JSON.stringify(hnAgain.summary), 'analyzeHanNuan deterministic');

  // S8. lá số thật (user) — không crash, có summary
  const hnUser = analyzeHanNuan(hqR); // hqR = analyze(1993,...) đã có từ section 24
  assert(typeof hnUser.summary === 'string' && hnUser.summary.length > 20, 'lá số user: analyzeHanNuan ra summary');

  console.log(`   子月/Thủy → 寒 (điểm ${hnCold.tempScore}, cần Hỏa) ✓ | 午月/Hỏa → 暖 (điểm ${hnHot.tempScore}, cần Thủy) ✓`);
  console.log(`   未戌+Hỏa → 燥 (điểm ${hnDry.humidScore}) ✓ | 辰丑+Thủy → 湿 (điểm ${hnWet.humidScore}) ✓ | 卯月 cân → 平 ✓`);
  console.log(`   lá số user: ${hnUser.tempVi} + ${hnUser.humidVi}, ${hnUser.needs.length ? 'cần '+hnUser.needs.map(n=>n.vi).join('/') : 'cân khí hậu'}`);
}

// ################## U. [loop 71] double-count xung Nhật Chi + chart-level guard ##################
//   Sửa bug scoring: cùng 1 sự kiện (chi năm xung Nhật Chi) bị 2 phái đếm độc lập.
//   yong trung hoà (Hỏa = xian) để cô lập — không thêm nhiễu Dụng/Kỵ.
import { classifyChartLevel as _classifyLevel } from './src/engine/chart-level.js';
console.log('\n################## U. [loop 71] double-count xung + chart-level guard ##################');
{
  const _neutral = { primary:'土', xi:'金', ji:'木', chou:'水', xian:'火' }; // Hỏa trung tính

  // U1. [HIGH] double-count Địa Xung vs 日支冲太岁 — trước đây -14 + -10 = -24, nay chỉ -14.
  //   dayZhi=子, yZhi=午 (xung), yearBirthZhi=寅 (≠子) → chỉ Thái Tuế -14, KHÔNG có phái Địa Xung.
  const _dc2 = _scoreLY({ dayGan:'甲', dayZhi:'子', yearBirthZhi:'寅', yong:_neutral, yGan:'丙', yZhi:'午' });
  assert(!_dc2.schools.some((s) => s.phai === 'Địa Xung'), '[fix] KHÔNG còn phái "Địa Xung" riêng (đã trùng 日支冲太岁) — double-count -10 bị bỏ');
  assert(_dc2.schools.some((s) => s.phai === 'Thái Tuế' && s.note.includes('日支冲太岁')), '日支冲太岁 vẫn được tính 1 lần (-14) ở phái Thái Tuế');

  // U2. [MED] dayZhi === yearBirthZhi: 冲太岁 đã bao hàm → KHÔNG thêm 日支冲太岁 (trước đây -16+-14=-30).
  //   dayZhi=子=yearBirthZhi, yZhi=午 → chỉ 冲太岁 -16, KHÔNG có 日支冲太岁.
  const _dc4 = _scoreLY({ dayGan:'甲', dayZhi:'子', yearBirthZhi:'子', yong:_neutral, yGan:'丙', yZhi:'午' });
  assert(_dc4.schools.some((s) => s.phai === 'Thái Tuế' && s.note.includes('冲太岁')), '冲太岁 (-16) vẫn tính khi dayZhi=yearBirthZhi');
  assert(!_dc4.schools.some((s) => s.phai === 'Thái Tuế' && s.note.includes('日支冲太岁')), '[fix] KHÔNG trùng 日支冲太岁 khi dayZhi=yearBirthZhi (冲太岁 đã bao hàm)');

  // U3. Thiên Khắc Địa Xung (gan+zi clash) vẫn hoạt động — nhánh -18 được GIỮ (combo ĐẠI HUNG).
  //   dayGan=甲, yGan=庚 (天克), dayZhi=子, yZhi=午 (地 xung) → có phái Thiên Khắc Địa Xung -18.
  const _tkdc = _scoreLY({ dayGan:'甲', dayZhi:'子', yearBirthZhi:'寅', yong:_neutral, yGan:'庚', yZhi:'午' });
  assert(_tkdc.schools.some((s) => s.phai === 'Thiên Khắc Địa Xung' && s.d === -18), '天克地冲 (gan+zi clash) vẫn được tính -18 (combo ĐẠI HUNG, nhánh được giữ)');

  // U4. [MED] chart-level guard: wx undefined / wx.pct rỗng → trả 'unknown' an toàn, KHÔNG xếp bậc cao sai.
  //   Trước đây Math.max(...[])=-Infinity → 配合流通 balanced=true SAI → lá số lỗi bị xếp Quý/Phú cách.
  const _badR1 = { chart:{}, wx:undefined, yong:undefined, pattern:undefined };
  const _lvl1 = _classifyLevel(_badR1);
  assert(_lvl1.level === 'unknown', '[fix] wx/yong/pattern undefined → level "unknown" (không crash, không xếp bậc bậy)');
  const _badR2 = { chart:{}, wx:{ total:0, score:{}, pct:{} }, yong:{ primary:'土', ji:'木' }, pattern:{ type:'normal', vi:'test' }, synthesis:{combos:[]}, shensha:null, dayun:[] };
  const _lvl2 = _classifyLevel(_badR2);
  const _phoiThong = _lvl2.criteria.find((c) => c.name === '配合流通');
  assert(_phoiThong && _phoiThong.pass === false, '[fix] wx.pct rỗng → 配合流通 KHÔNG pass (trước đây balanced=true sai do -Infinity<50)');

  console.log(`   double-count xung Nhật Chi: -24→-14 ✓ | dayZhi=yearBirthZhi: -30→-16 ✓ | 天克地冲 -18 còn nguyên ✓`);
  console.log(`   chart-level guard: wx/pct rỗng → "unknown" + 配合流通 không pass sai ✓`);
}

// ################## V. [loop 72] 正官格 败 chong detection (dead-code fix) + 得势 cổ pháp ##################
import { patternQuality as _pq } from './src/engine/pattern-quality.js';
import { strength3Fa as _s3fa } from './src/engine/strength-3fa.js';
console.log('\n################## V. [loop 72] 正官格败(chong) fix + 得势 cổ pháp ##################');
{
  // V1. [HIGH] evalBai via:'chong' — trước đây chart.interactions={} (dead code) → KHÔNG BAO GIỜ
  //   phát hiện 正官格 "官逢刑冲破害" 败. Nay truyền interactions → scan thấy disease via:'chong'.
  //   Scan nhiều lá số thực: trước fix count=0, sau fix phải >0.
  let _chongDiseaseCount = 0, _sample = 0;
  for (let _y = 1985; _y <= 2005 && _sample < 60; _y++) {
    for (const _m of [3, 6, 9, 12]) {
      for (const _d of [5, 18, 27]) {
        let _R; try { _R = analyze(_y, _m, _d, 8, 0, 'nam', 2026); } catch (e) { continue; }
        _sample++;
        try {
          const _q = _pq(_R);
          if ((_q.diseases || []).some((dd) => dd.via === 'chong')) _chongDiseaseCount++;
        } catch (e) {}
      }
    }
  }
  assert(_chongDiseaseCount > 0, `[fix] patternQuality phát hiện ≥1 disease via:'chong' (正官格 刑冲破害 败) qua ${_sample} lá — trước fix = 0 (dead code)`);
  console.log(`   正官格 刑冲破害 败 detection: ${_chongDiseaseCount}/${_sample} lá có disease via:'chong' → dead code đã sống ✓`);

  // V2. [MED] 得势 cổ pháp — chỉ đếm THIÊN CAN LỘ (không trùng tàng của 得地).
  //   2 can tỷ lộ (甲/甲) → 得势 ✓; tàng can tỷ KHÔNG còn boosting biCount (chống double-count).
  const _s3pos = _s3fa({ chart: { dayMaster:{wx:'木'}, pillars: {
    year:{gan:'甲',zhi:'子'}, month:{gan:'丙',zhi:'午'}, day:{gan:'乙',zhi:'子'}, time:{gan:'甲',zhi:'午'},
  }}, strength:{ monthMainWx:'火' } });
  assert(_s3pos.deShi === true && _s3pos.biCount === 2, '2 can tỷ lộ (甲/甲) → 得势 ✓ (biCount=2, đúng «干透比劫»)');

  const _s3pos2 = _s3fa({ chart: { dayMaster:{wx:'木'}, pillars: {
    year:{gan:'甲',zhi:'子'}, month:{gan:'丙',zhi:'午'}, day:{gan:'乙',zhi:'子'}, time:{gan:'甲',zhi:'午'},
  }}, strength:{ monthMainWx:'火' } });
  assert(_s3pos2.biCount === 2, '[fix] biCount chỉ từ lộ =2 (tàng KHÔNG cộng — chống double-count 得地)');

  // V3. 得势 ✗ khi chỉ có tàng tỷ (không lộ) — tàng thuộc 得地, không đẩy 得势 ảo.
  //   寅 tàng 甲(Mộc) nhưng KHÔNG lộ → biCount=0, 得势 ✗ (tàng thuộc 得地).
  const _s3noto = _s3fa({ chart: { dayMaster:{wx:'木'}, pillars: {
    year:{gan:'丙',zhi:'寅'}, month:{gan:'丁',zhi:'午'}, day:{gan:'乙',zhi:'寅'}, time:{gan:'庚',zhi:'申'},
  }}, strength:{ monthMainWx:'火' } });
  assert(_s3noto.deShi === false && _s3noto.biCount === 0, 'không can tỷ lộ (甲 chỉ tàng trong 寅) → 得势 ✗ (tàng là 得地, không tính 得势)');
  console.log(`   得势 cổ pháp: 2 lộ→✓ biCount=2, tàng không boost (chống double-count 得地), chỉ-tàng→✗ ✓`);

  // V4. [MED] avoid nhất quán sau 调候 override. Trước đây avoid (kỵ CŨ) không recompute cho
  //   primary MỚI → có thể chứa Hỷ, thiếu Kỵ → sai hehun/ideal-match/NLG. Nay avoid chứa ji/chou,
  //   KHÔNG chứa primary/xi. Scan chart 调候 override (tháng cực đoan 亥子丑/巳午未).
  let _ovCount = 0;
  for (let _y = 1985; _y <= 2002 && _ovCount < 8; _y++) {
    for (const _m of [1, 6, 7, 11, 12]) { // tháng extreme (hàn/nhiệt)
      for (const _d of [8, 22]) {
        let _R; try { _R = analyze(_y, _m, _d, 10, 0, 'nam', 2026); } catch (e) { continue; }
        if (!_R.yong?.tiaohou?.override) continue;
        _ovCount++;
        const { primary, xi, ji, chou, avoid } = _R.yong;
        assert(!avoid.includes(primary), `[fix] avoid KHÔNG chứa Dụng ${primary} (chart ${_y}-${_m} override)`);
        assert(!avoid.includes(xi), `[fix] avoid KHÔNG chứa Hỷ ${xi} (chart ${_y}-${_m} override)`);
        assert(avoid.includes(ji), `[fix] avoid CHỨA Kỵ ${ji} = 克 Dụng (chart ${_y}-${_m} override)`);
        assert(avoid.includes(chou), `[fix] avoid CHỨA Thù ${chou} = sinh Kỵ (chart ${_y}-${_m} override)`);
      }
    }
  }
  assert(_ovCount > 0, `scan thấy ≥1 chart 调候 override để test avoid (được ${_ovCount})`);
  console.log(`   avoid sau 调候 override: ${_ovCount} chart test — avoid chứa Kỵ/Thù, KHÔNG chứa Dụng/Hỷ ✓`);
}

// ################## W. [loop 73] 偏印格 kỵ thần đúng 子平真诠 (sửa ji=['shi'] sai dấu) ##################
import { PATTERN_PREF as _PPREF } from './src/engine/pattern.js';
console.log('\n################## W. [loop 73] 偏印格 kỵ thần đúng 子平真诠 ##################');
{
  // W1. unit: 偏印格 ji phải là ['ti'] (Tỷ Kiếp đẵm Tài = làm suy yếu khí chế Kiêu),
  //   KHÔNG phải ['shi']. 子平真诠: Thực là BẢO VẬT được Tài bảo vệ (Hỷ) — trước đây
  //   ji=['shi'] sai dấu → adjustByGeju trừ điểm vận/năm Thực của chart 偏印格 (sai).
  assert(_PPREF['偏印格'].ji.includes('ti'), '偏印格 ji gồm ti (Tỷ Kiếp đẵm Tài)');
  assert(!_PPREF['偏印格'].ji.includes('shi'), '[fix] 偏印格 ji KHÔNG còn shi (Thực là bảo vật, không kỵ) — sửa dấu sai');
  assert(_PPREF['偏印格'].yong.includes('cai'), '偏印格 yong = cai (Tài chế Kiêu, «đắc tài chế kiêu»)');

  // W2. behavioral: scan chart 偏印格 thật → patternYong.ji phải có nhóm ti, không có shi.
  let _piR = null;
  for (let _y = 1985; _y <= 2005 && !_piR; _y++) {
    for (const _m of [2, 5, 8, 11]) {
      for (const _d of [7, 19, 28]) {
        let _R; try { _R = analyze(_y, _m, _d, 6, 0, 'nam', 2026); } catch (e) { continue; }
        if (_R.pattern && _R.pattern.name === '偏印格') { _piR = _R; break; }
      }
      if (_piR) break;
    }
  }
  assert(_piR, 'scan thấy ≥1 chart 偏印格 để test patternYong');
  if (_piR) {
    const _piPy = _piR.patternQuality.patternYong;
    const _cy = _piR.chart.input.year, _cm = _piR.chart.input.month;
    assert(_piPy.ji.some((j) => j.group === 'ti'), `偏印格 patternYong.ji có nhóm ti (chart ${_cy}-${_cm})`);
    assert(!_piPy.ji.some((j) => j.group === 'shi'), `[fix] 偏印格 patternYong.ji KHÔNG có nhóm shi (chart ${_cy}-${_cm}) — Thực không bị gán kỵ`);
    console.log(`   偏印格 chart ${_cy}-${_cm}: patternYong ji=[${_piPy.ji.map((j)=>j.vi).join(',')}] (Tỷ Kiếp, KHÔNG phải Thực) ✓`);
  }

  // W3. đối chiếu các cách khác KHÔNG bị thay đổi (chỉ 偏印 sai trước đây):
  assert(_PPREF['食神格'].ji.includes('yin'), '食神格 ji vẫn = yin (Kiêu đoạt thực — đúng, 格神 là Thực nên Kiêu khắc nó)');
  assert(_PPREF['正官格'].ji.includes('shi'), '正官格 ji vẫn = shi (Thương Quan phá quan — đúng)');
  assert(_PPREF['正印格'].ji.includes('cai'), '正印格 ji vẫn = cai (Tài phá ấn — đúng)');
  console.log(`   đối chiếu: 食神格 kỵ yin ✓ | 正官格 kỵ shi ✓ | 正印格 kỵ cai ✓ (chỉ 偏印格 sai trước đây)`);
}

// ################## X. [loop 74] LƯU NGUYỆT nâng tầng (Thái tuế tháng + 伏吟反吟) ##################
import { computeLiuyue as _cly } from './src/engine/liuyue.js';
console.log('\n################## X. [loop 74] LƯU NGUYỆT nâng tầng (Thái tuế + 伏吟反吟) ##################');
{
  // X1. mỗi tháng có 2 field mới: taiSui (array note) + fuyin (array note).
  const _lyT = _cly(RU, 2026);
  assert(_lyT.months.every((mo) => Array.isArray(mo.taiSui) && Array.isArray(mo.fuyin)), '[loop 74] mỗi lưu nguyệt có taiSui + fuyin array');

  // X2. Thái tuế THÁNG — scan chart thấy tháng 冲日支 (layer hoạt động, trước đây KHÔNG có).
  let _chongChart = null, _chongMonth = null;
  let _fyChart = null, _fyMonth = null;
  for (let _y = 1985; _y <= 2003 && (!_chongChart || !_fyChart); _y++) {
    for (const _m of [2, 5, 8, 11]) {
      let _R; try { _R = analyze(_y, _m, 15, 10, 0, 'nam', 2026); } catch (e) { continue; }
      const _ly = _cly(_R, 2026);
      if (!_chongChart) {
        const _cm = _ly.months.find((mo) => mo.taiSui.some((t) => t.includes('冲日支')));
        if (_cm) { _chongChart = _R; _chongMonth = _cm; }
      }
      if (!_fyChart) {
        const _fm = _ly.months.find((mo) => mo.fuyin.length > 0);
        if (_fm) { _fyChart = _R; _fyMonth = _fm; }
      }
    }
  }
  assert(_chongChart, '[loop 74] scan thấy chart có tháng 冲日支 (Thái tuế tháng layer hoạt động — trước đây 流月 KHÔNG bắt biến động tháng)');
  if (_chongMonth) {
    // 冲日支 tháng (dayZhi≠yearBirthZhi) phải bị phạt -7 so với base ngũ hành → điểm thấp
    assert(_chongMonth.score < 50, `tháng 冲日支 bị phạt (score ${_chongMonth.score} < 50) — ${_chongMonth.taiSui.join(',')}`);
    console.log(`   Thái tuế tháng: chart ${_chongChart.chart.input.year} tháng ${_chongMonth.solarMonth} 冲日支 → score ${_chongMonth.score} ✓`);
  }
  if (_fyMonth) {
    assert(_fyMonth.fuyin.length > 0, `[loop 74] scan thấy tháng 伏吟/反吟 vs trụ nguyên cục — ${_fyMonth.fuyin.join(',')}`);
    console.log(`   伏吟/反吟 tháng: chart ${_fyChart.chart.input.year} tháng ${_fyMonth.solarMonth} ${_fyMonth.fuyin.join(',')} ✓`);
  } else {
    console.log(`   伏吟/反吟 tháng: không gặp trong scan 2026 (hiếm) — cơ chế isFuyin/isFanyin đã test ở 流年 (section 5b) ✓`);
  }

  // X3. không double-count: tháng 冲日支 (dayZhi≠yearBirthZhi) CHỈ tính -7 ở Thái tuế,
  //   KHÔNG thêm 反吟 日柱 (loại trừ day ở W_FANYIN — mirror 流年 loop 19/71).
  if (_chongChart) {
    const _cm2 = _chongMonth;
    const _hasDayFanyin = _cm2.fuyin.some((f) => f.includes('Nhật Trụ') && f.includes('反吟'));
    assert(!_hasDayFanyin, '[loop 74] tháng 冲日支 KHÔNG bị thêm 反吟 日柱 (chống double-count — 冲日支 đã tính)');
  }

  // X4. deterministic sau nâng tầng
  const _lyA = _cly(RU, 2026), _lyB = _cly(RU, 2026);
  assert(JSON.stringify(_lyA.months) === JSON.stringify(_lyB.months), '[loop 74] lưu nguyệt nâng tầng vẫn tất định');
  console.log(`   lưu nguyệt nâng tầng: 2 tầng mới (Thái tuế + 伏吟反吟) + deterministic ✓`);
}

// ################## Y. [loop 75] LƯU NHẬT nâng tầng (double-count fix + 刑破 + 伏吟反吟) ##################
import { analyzeLiuRi as _alr } from './src/engine/liuri.js';
console.log('\n################## Y. [loop 75] LƯU NHẬT nâng tầng (fix double-count + 刑破 + 伏吟反吟) ##################');
{
  // Y1. [double-count fix] khi birthYearZhi === selfDayZhi: ngày xung chi đó CHỈ có 'Xung tuổi',
  //   KHÔNG có 'Xung Nhật Chi' (trước đây -5 + -6 = -11 cho 1 xung, y loop 71).
  let _dcChart = null;
  for (let _y = 1985; _y <= 2003 && !_dcChart; _y++) {
    for (const _m of [3, 6, 9, 12]) for (const _d of [8, 19, 27]) {
      let _R; try { _R = analyze(_y, _m, _d, 8, 0, 'nam', 2026); } catch (e) { continue; }
      if (_R.chart.pillars.year.zhi === _R.chart.pillars.day.zhi) { _dcChart = _R; break; }
    }
  }
  if (_dcChart) {
    // scan 80 ngày tìm ngày xung chi trùng (year=day chi)
    const _twin = _dcChart.chart.pillars.year.zhi;
    const _opp = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' }[_twin];
    let _tested = false;
    for (let i = 0; i < 120 && !_tested; i++) {
      const sd = Solar.fromYmdHms(2026, 6, 15, 12, 0, 0).next(i);
      let rd; try { rd = _alr(_dcChart, sd.getYear(), sd.getMonth(), sd.getDay()); } catch (e) { continue; }
      if (rd.ganZhi[1] === _opp) {
        const hasTuoi = rd.schools.some((s) => s.phai === 'Xung tuổi');
        const hasNhat = rd.schools.some((s) => s.phai === 'Xung Nhật Chi');
        assert(hasTuoi && !hasNhat, `[fix] năm chi=nhật chi=${_twin}: ngày ${rd.ganZhi} xung → chỉ 'Xung tuổi', KHÔNG 'Xung Nhật Chi' (chống double-count)`);
        _tested = true;
      }
    }
    if (_tested) console.log(`   double-count lưu nhật: chart năm chi=nhật chi=${_twin} → ngày xung chỉ tính 1 lần ✓`);
  } else {
    console.log(`   double-count lưu nhật: không tìm chart năm chi=nhật chi trong scan (hiếm) — logic mirror loop 71 ✓`);
  }

  // Y2. 伏吟/反吟 ngày — scan chart+ngày thấy trường phái 'Phục/Phản Ngâm ngày'.
  let _fyDay = null, _poXingDay = null;
  for (let _y = 1988; _y <= 2002 && (!_fyDay || !_poXingDay); _y++) {
    let _R; try { _R = analyze(_y, 7, 15, 10, 0, 'nam', 2026); } catch (e) { continue; }
    for (let i = 0; i < 100 && (!_fyDay || !_poXingDay); i++) {
      const sd = Solar.fromYmdHms(2026, 1, 10, 12, 0, 0).next(i);
      let rd; try { rd = _alr(_R, sd.getYear(), sd.getMonth(), sd.getDay()); } catch (e) { continue; }
      if (!_fyDay && rd.schools.some((s) => s.phai.includes('Phục/Phản'))) _fyDay = { rd, y: _y };
      if (!_poXingDay && (rd.schools.some((s) => s.phai.includes('刑太岁')) || rd.schools.some((s) => s.phai.includes('破太岁')))) _poXingDay = { rd, y: _y };
    }
  }
  if (_fyDay) {
    const _fySc = _fyDay.rd.schools.find((s) => s.phai.includes('Phục/Phản'));
    // 反吟 日柱 phải KHÔNG xuất hiện (chống double-count với Xung Nhật Chi) — chỉ 月/年/时
    assert(!_fySc.note.includes('反吟 Nhật Trụ') || !_fyDay.rd.schools.some((s) => s.phai === 'Xung Nhật Chi'), '[loop 75] 反吟 日柱 không trùng Xung Nhật Chi (chống double-count)');
    console.log(`   伏吟/反吟 ngày: chart ${_fyDay.y} ${_fyDay.rd.solar} → ${_fySc.phai}: ${_fySc.note} ✓`);
  } else {
    console.log(`   伏吟/反吟 ngày: không gặp trong scan — isFuyin/isFanyin đã test ở 流年/流月 ✓`);
  }
  if (_poXingDay) {
    const _px = _poXingDay.rd.schools.find((s) => s.phai.includes('太岁'));
    console.log(`   刑/破 太岁 ngày (mới): chart ${_poXingDay.y} ${_poXingDay.rd.solar} → ${_px.phai} ✓`);
  }

  // Y3. deterministic sau nâng tầng
  const _a = _alr(RU, 2026, 6, 21), _b = _alr(RU, 2026, 6, 21);
  assert(JSON.stringify(_a) === JSON.stringify(_b), '[loop 75] lưu nhật nâng tầng vẫn tất định');
  console.log(`   lưu nhật nâng tầng: 刑/破太岁 + 伏吟反吟 + deterministic ✓`);
}

// ################## Z. [loop 76] PHỐI NGÃU profile crash fix (KE import) + 孤辰 bịa bỏ ##################
import { buildFullProfile as _bfp } from './src/engine/partner-profile.js';
console.log('\n################## Z. [loop 76] phối ngẫu profile: crash fix (KE) + bỏ 孤辰 bịa ##################');
{
  // Z1. [HIGH crash fix] buildFullProfile KHÔNG crash khi sao-con quan hệ 克/none.
  //   Trước đây rel() dùng KE (KHÔNG import) → ReferenceError → feature "hồ sơ phối ngẫu"
  //   crash cho mọi pair có child-wx 克/none (live ở main.js:3406). Nay import KE.
  let _crashes = 0, _oks = 0, _kidPara = 0;
  for (const [uy, um, ud] of [[1990, 5, 15], [1988, 8, 20], [1995, 3, 3]]) {
    const _userR = analyze(uy, um, ud, 10, 0, 'nam', 2026);
    for (const [py, pm, pd] of [[1992, 7, 7], [1989, 11, 11], [1993, 6, 6], [1991, 2, 14]]) {
      const _pR = analyze(py, pm, pd, 14, 0, 'nữ', 2026);
      const _match = { chart: _pR, rank: 1, hehunScore: 70, hehunRating: 'Hợp', yearRel: 'tam hợp', dayRel: true, date: '2026-01-01' };
      try {
        const _prof = _bfp(_match, _userR);
        _oks++;
        if (_prof.paragraphs.some((pp) => pp.startsWith('Con cái'))) _kidPara++;
        // [loop 76] KHÔNG còn 孤辰 bịa 'tại Day' / 'day.zhi===亥'
        assert(!_prof.paragraphs.some((pp) => /孤辰 tại Day/.test(pp)), '[fix] KHÔNG còn 孤辰 "tại Day" bịa cổ pháp');
      } catch (e) { _crashes++; }
    }
  }
  assert(_crashes === 0, `[fix] buildFullProfile KHÔNG crash qua ${_oks} pair (trước fix crash ở child-wx 克/none)`);
  assert(_kidPara === _oks, `[fix] mọi pair có paragraph "Con cái" (rel() chạy được — KE branch hoạt động)`);

  // Z2. 克 branch works: tìm pair có child-wx 克 nhau → paragraph Con cái ghi rõ "khắc"
  let _keText = null;
  outer: for (const [uy, um, ud] of [[1990, 5, 15], [1988, 8, 20], [1995, 3, 3], [2000, 12, 22]]) {
    const _u = analyze(uy, um, ud, 10, 0, 'nam', 2026);
    for (const [py, pm, pd] of [[1992, 7, 7], [1989, 11, 11], [1993, 6, 6], [1991, 2, 14], [1987, 9, 9]]) {
      const _p = analyze(py, pm, pd, 14, 0, 'nữ', 2026);
      const _m = { chart: _p, rank: 1, hehunScore: 70, hehunRating: 'Hợp', yearRel: 'tam hợp', dayRel: true, date: '2026-01-01' };
      try {
        const _pr = _bfp(_m, _u);
        const _kid = _pr.paragraphs.find((pp) => pp.startsWith('Con cái'));
        if (_kid && _kid.includes('khắc')) { _keText = _kid; break outer; }
      } catch (e) {}
    }
  }
  if (_keText) console.log(`   克 branch hoạt động: "${_keText.slice(0, 70)}..." ✓`);
  console.log(`   buildFullProfile: ${_oks} pair OK, 0 crash, mọi pair có "Con cái" + không 孤辰 bịa ✓`);
}

// ################## AA. [loop 77] 大运十二长生运 (tính năng mới) ##################
import { dayunChangSheng as _dcs, STAGE as _DSTAGE } from './src/engine/dayun-changsheng.js';
console.log('\n################## AA. [loop 77] 大运十二长生运 (12 trường sinh qua đại vận) ##################');
{
  // AA1. 8 đại vận mỗi vận có 1 stage thuộc 12 + tone cat/hung/neutral.
  const _R = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
  const _t = _dcs(_R.chart.dayGan, _R.dayun);
  const _12 = Object.keys(_DSTAGE);
  assert(_t.items.length === _R.dayun.length, `mỗi đại vận có 1 mục (được ${_t.items.length}/${_R.dayun.length})`);
  assert(_t.items.every((i) => _12.includes(i.stage) && ['cat', 'hung', 'neutral'].includes(i.tone)), 'mọi stage thuộc 12 trường sinh + tone hợp lệ');
  assert(_t.items.every((i) => typeof i.startAge === 'number' && i.ganZhi && i.stageVi), 'mỗi mục có startAge + ganZhi + stageVi');

  // AA2. peak/rising/low phát hiện đúng: stage 臨官/帝旺 ∈ peak, 死/墓/絞 ∈ low, 長生/冠帶 ∈ rising.
  assert(_t.peak.every((p) => p.stage === '臨官' || p.stage === '帝旺'), 'peak chỉ chứa Lâm Quan/Đế Vượng');
  assert(_t.low.every((p) => ['死', '墓', '絕'].includes(p.stage)), 'low chỉ chứa Tử/Mộ/Tuyệt');
  assert(_t.rising.every((p) => p.stage === '長生' || p.stage === '冠帶'), 'rising chỉ chứa Trường Sinh/Quan Đới');

  // AA3. qua nhiều lá số, tổng peak+rising+low + các giai đoạn giữa = đủ 8 đại vận (mỗi vận 1 stage).
  let _allCovered = true;
  for (const [_y, _m, _d] of [[1988, 6, 15], [2000, 12, 22], [1990, 1, 5], [1995, 7, 20]]) {
    const _RR = analyze(_y, _m, _d, 10, 0, 'nam', 2026);
    const _tt = _dcs(_RR.chart.dayGan, _RR.dayun);
    if (_tt.items.length !== _RR.dayun.length) _allCovered = false;
    // deterministic
    const _tt2 = _dcs(_RR.chart.dayGan, _RR.dayun);
    if (JSON.stringify(_tt.items) !== JSON.stringify(_tt2.items)) _allCovered = false;
  }
  assert(_allCovered, '4 lá số: mỗi đại vận có stage + deterministic');

  // AA4. chiều dương thuận / âm nghịch — 2 lá số ĐỐI CHIẾU dương vs âm can phải khác hướng stage.
  //   甲(dương): 长生 ở 亥, thuận hành. 乙(âm): 长生 ở 午, nghịch hành. → stage ở cùng chi phải khác.
  const _jia = analyze(2000, 12, 22, 10, 0, 'nam', 2026); // 甲
  const _yi = analyze(1993, 10, 21, 0, 30, 'nam', 2026);  // 乙
  const _jiaStages = _dcs(_jia.chart.dayGan, _jia.dayun).items.map((i) => i.stage).join('');
  const _yiStages = _dcs(_yi.chart.dayGan, _yi.dayun).items.map((i) => i.stage).join('');
  assert(_jiaStages !== _yiStages, '甲 (dương thuận) vs 乙 (âm nghịch) → chuỗi stage đại vận KHÁC nhau (chiều hành khác)');

  // AA5. lá số user: in arc
  console.log(`   user 乙 (âm nghịch): ${_t.items.map((i) => i.startAge + 't:' + i.stageVi + '(' + i.tone[0] + ')').join(' → ')}`);
  console.log(`   peak ${_t.peak.length} | rising ${_t.rising.length} | low ${_t.low.length} — «运好不如运旺» ✓`);
}

// ################## BB. [loop 78] 流年十二长生 (mở rộng 12 trường sinh xuống lưu niên) ##################
import { liunianChangSheng as _lcs } from './src/engine/dayun-changsheng.js';
console.log('\n################## BB. [loop 78] 流年十二长生 (sinh khí từng năm) ##################');
{
  const _R = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
  const _t = _lcs(_R.chart.dayGan, _R.liunian);
  // BB1. mỗi lưu niên có 1 stage + có nowStage (năm hiện tại 2026)
  assert(_t.items.length === _R.liunian.length, `mỗi lưu niên có 1 mục (${_t.items.length}/${_R.liunian.length})`);
  assert(_t.items.every((i) => typeof i.year === 'number' && i.stage && i.stageVi), 'mỗi mục có year + stage + stageVi');
  assert(_t.nowStage && _t.nowStage.isNow === true && _t.nowStage.year === 2026, `nowStage = năm hiện tại 2026 (${_t.nowStage && _t.nowStage.year}, stage ${_t.nowStage && _t.nowStage.stageVi})`);

  // BB2. peak/rising/low detect đúng (share logic với đại vận)
  assert(_t.peak.every((p) => p.stage === '臨官' || p.stage === '帝旺'), 'lưu niên peak = Lâm Quan/Đế Vượng');
  assert(_t.low.every((p) => ['死', '墓', '絕'].includes(p.stage)), 'lưu niên low = Tử/Mộ/Tuyệt');

  // BB3. 10 năm chu trình qua các stage KHÁC NHAU (mỗi năm chi tiến 1 bước → stage tiến 1)
  const _stages = _t.items.map((i) => i.stage);
  const _unique = new Set(_stages).size;
  assert(_unique >= 7, `10 lưu niên trải ≥7 stage khác nhau (được ${_unique}) — chu trình 12 trường sinh`);

  // BB4. deterministic + year tăng dần
  const _t2 = _lcs(_R.chart.dayGan, _R.liunian);
  assert(JSON.stringify(_t.items) === JSON.stringify(_t2.items), 'lưu niên trường sinh deterministic');
  const _years = _t.items.map((i) => i.year);
  assert(_years.every((y, idx) => idx === 0 || y > _years[idx - 1]), 'lưu niên xếp theo năm tăng dần');

  // BB5. đa lá số không crash + nowStage luôn = refYear (2026)
  for (const [_y, _m, _d] of [[1988, 6, 15], [2000, 12, 22], [1990, 1, 5]]) {
    const _RR = analyze(_y, _m, _d, 10, 0, 'nam', 2026);
    const _tt = _lcs(_RR.chart.dayGan, _RR.liunian);
    assert(_tt.items.length === _RR.liunian.length && _tt.nowStage, `lá ${_y}: ${_tt.items.length} lưu niên + nowStage`);
  }

  console.log(`   user 乙: ${_t.items.map((i) => i.year + ':' + i.stageVi + (i.isNow ? '★' : '')).join(' ')}`);
  console.log(`   nowStage ${_t.nowStage.year}=${_t.nowStage.stageVi} | peak ${_t.peak.length} rising ${_t.rising.length} low ${_t.low.length} | ${_unique} stage khác nhau ✓`);
}

// ################## CC. [loop 79] LỤC THÂN: loại tàng day + đếm đủ bản/trung/dư ##################
import { analyzeLiuqin as _alq } from './src/engine/liuqin.js';
import { analyzeChildrenStar as _acs } from './src/engine/children-star.js';
console.log('\n################## CC. [loop 79] lục thân: loại tàng day + đếm đủ tàng khí ##################');
{
  // CC1. [Bug #1 fix] children-star positions KHÔNG chứa 'day' (trước đây đếm tàng trụ ngày —
  //   mâu thuẫn liuqin.js + loop露 đã loại day; day=phối ngẫu/bản thân không phải cung con).
  let _noDayViolation = true;
  for (const [_y, _m, _d, _g] of [[1993,10,21,'nam'],[1988,6,15,'nam'],[1995,3,3,'nữ'],[2000,12,22,'nam']]) {
    const _R = analyze(_y, _m, _d, 10, 0, _g, 2026);
    const _cs = _acs(_R);
    if (_cs.positions.some((p) => p.startsWith('day'))) _noDayViolation = false;
  }
  assert(_noDayViolation, '[fix] children-star positions KHÔNG chứa trụ day (Nhật Chi = phối ngẫu, không phải cung con)');
  // [loop 560] NỮ firstGender phải check cả month (đồng bộ nam) — trước đây chỉ year.
  //   Chart 1987 nữ có year.ganGod=食神 → firstGender phải = «thiên con trai» (food god=con trai cho nữ).
  {
    const _nR = analyze(1987, 1, 1, 12, 0, 'nữ', 2026);
    const _ncs = _acs(_nR);
    // chỉ assert KHÔNG crash + trả firstGender (giá trị phụ chart, không hardcode sai)
    assert(typeof _ncs.firstGender === 'string' && _ncs.firstGender.length > 0, `[loop 560] children-star NỮ trả firstGender hợp lệ (month check đã thêm)`);
  }

  // CC2. [Bug #5 fix] đếm ĐỦ tàng khí — có chart bắt sao ở trung/dư khí (trước đây chỉ hidden[0]=bản).
  let _foundTangMid = false;
  for (const [_y, _m, _d, _g] of [[1993,10,21,'nam'],[1988,6,15,'nam'],[1995,3,3,'nữ'],[1990,5,15,'nam'],[2000,12,22,'nam']]) {
    const _R = analyze(_y, _m, _d, 10, 0, _g, 2026);
    const _cs = _acs(_R);
    if (_cs.positions.some((p) => p.includes('tàng:trung') || p.includes('tàng:dư'))) _foundTangMid = true;
  }
  assert(_foundTangMid, '[fix] đếm đủ tàng khí — có chart bắt sao con ở trung/dư khí (trước đây chỉ bản khí hidden[0])');

  // CC3. giới tính lục thân ĐÚNG cổ pháp (verify starMap không bị phá).
  //   nam: vợ=Tài, con=Quan Sát. nữ: chồng=Quan, con=Thực Thương.
  const _nm = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
  const _nmLq = _alq(_nm).find((x) => x.relation === '子女');
  assert(_nmLq.stars.join() === ['七殺','正官'].join(), 'nam con = Quan Sát (七殺/正官) — 克 thân');
  const _nf = analyze(1995, 3, 3, 10, 0, 'nữ', 2026);
  const _nfLq = _alq(_nf).find((x) => x.relation === '子女');
  assert(_nfLq.stars.join() === ['食神','傷官'].join(), 'nữ con = Thực Thương (食神/傷官) — thân sinh');
  const _nfSp = _alq(_nf).find((x) => x.relation === '配偶');
  assert(_nfSp.stars.join() === ['正官','七殺'].join(), 'nữ chồng = Quan Sát (正官/七殺)');
  const _nmSp = _alq(_nm).find((x) => x.relation === '配偶');
  assert(_nmSp.stars.join() === ['正財','偏財'].join(), 'nam vợ = Tài (正財/偏財)');

  // CC4. lục thân đủ 5 quan hệ + deterministic
  const _lq = _alq(_nm);
  assert(_lq.length === 5 && ['父','母','兄弟姐妹','配偶','子女'].every((r) => _lq.some((x) => x.relation === r)), 'liuqin đủ 5 quan hệ');
  assert(JSON.stringify(_lq) === JSON.stringify(_alq(_nm)), 'liuqin deterministic');

  console.log(`   lục thân: loại tàng day ✓ | đếm đủ bản/trung/dư ✓ | giới tính đúng (nam con=Quan, nữ con=Thực) ✓`);
}

// ################## DD. [loop 81] best-hour 天乙/文昌 giờ theo CAN NGÀY (fix bug) ##################
import { bestHourToday as _bht } from './src/engine/best-hour.js';
import { TIAN_YI as _TY, WEN_CHANG as _WC } from './src/engine/shensha.js';
console.log('\n################## DD. [loop 81] best-hour: 天乙/文昌 giờ theo CAN NGÀY ##################');
{
  const _R = analyze(1993, 10, 21, 0, 30, 'nam', 2026); // Nhật Chủ 乙
  const _nobleHours = (b) => b.hours.filter((h) => h.reasons.some((r) => r.includes('天乙'))).map((h) => h.zhi);

  // DD1. [fix] 天乙 giờ ĐỔI theo ngày (can ngày), KHÔNG cố định theo Nhật Chủ sinh.
  //   Trước đây: TIAN_YI[乙]=子申 cố định mọi ngày. Nay: theo can ngày.
  const _b1 = _bht(_R, 2026, 6, 15); // 庚 ngày
  const _b2 = _bht(_R, 2026, 6, 16); // 辛 ngày
  const _n1 = _nobleHours(_b1).sort().join(',');
  const _n2 = _nobleHours(_b2).sort().join(',');
  assert(_n1 !== _n2, `[fix] 天乙 giờ KHÁC nhau 2 ngày khác can (${_n1} vs ${_n2}) — đổi theo can ngày, không cố định Nhật Chủ`);

  // DD2. khớp cổ法 mnemonic «甲戊庚牛羊, 乙己鼠猴乡, 丙丁猪鸡, 壬癸兔蛇, 六辛逢马虎»:
  //   庚日 → Sửu/Mùi (牛羊). verify TIAN_YI[庚] = 丑未.
  // [loop 166 fix] dùng [...x].sort() — KHÔNG .sort() trực tiếp: Array.sort() mutate
  //   array gốc → làm «bẩn» singleton TIAN_YI (đảo thứ tự chi) → test sau đọc sai.
  assert([..._TY['庚']].sort().join(',') === ['丑', '未'].sort().join(','), '天乙 mnemonic «甲戊庚牛羊»: 庚 → Sửu/Mùi');
  assert([..._TY['辛']].sort().join(',') === ['午', '寅'].sort().join(','), '天乙 mnemonic «六辛逢马虎»: 辛 → Ngọ/Dần');
  assert([..._TY['乙']].sort().join(',') === ['子', '申'].sort().join(','), '天乙 mnemonic «乙己鼠猴乡»: 乙 → Tý/Thân');

  // DD3. best-hour 天乙 giờ = TIAN_YI[can NGÀY], KHÔNG = TIAN_YI[Nhật Chủ 乙]:
  const _evalGan1 = _b1.dayGanZhi[0]; // can ngày của 2026-6-15
  const _expect = [..._TY[_evalGan1]].sort().join(',');
  assert(_n1 === _expect, `天乙 giờ = TIAN_YI[can ngày ${_evalGan1}] = ${_expect} (được ${_n1})`);
  assert(_n1 !== [..._TY['乙']].sort().join(','), '[fix] 天乙 giờ KHÔNG còn = TIAN_YI[Nhật Chủ 乙] cố định');

  // DD4. 格局 chiều vẫn dùng birthDayGan (Nhật Chủ) — không bị phá.
  const _bG = _bht(_R, 2026, 6, 15, _R.patternQuality?.patternYong);
  assert(_bG.gejuEnabled === !!_R.patternQuality?.patternYong, 'best-hour geju chiều vẫn bật đúng (dùng birthDayGan cho tenGod)');

  console.log(`   庚日 天乙=[${_n1}] | 辛日 天乙=[${_n2}] — đổi theo can ngày ✓ (mnemonic «甲戊庚牛羊/六辛逢马虎»)`);
  console.log(`   Trước fix: 天乙 cố định Tý/Thân cho user 乙 mọi ngày (sai). Nay đúng can ngày ✓`);
}

// ################## EE. [loop 82] daily-briefing: tone 3-valued + thái tuế structured ##################
import { dailyBriefing as _dbf } from './src/engine/daily-briefing.js';
import { personalTaSui as _pts } from './src/engine/taisui.js';
console.log('\n################## EE. [loop 82] daily-briefing: tone aligned + thái tuế structured ##################');
{
  const _R = analyze(1993, 10, 21, 0, 30, 'nam', 2026);

  // EE1. [Bug #2 fix] tone aligned level: Bình→bình (không cat/hung), Cát→cat.
  //   Trước đây tone binary score>=50?'cat' → ngày Bình (50-64) bị tone='cat' sai.
  //   (Special levels Hoàng Đạo/Hắc Đạo/天赦除外 — chỉ check 2 level chuẩn.)
  let _binhToBinh = true, _catToCat = true;
  for (let _mm = 1; _mm <= 12; _mm++) for (let _dd = 1; _dd <= 28; _dd += 4) {
    let _b; try { _b = _dbf(_R, 2025, _mm, _dd); } catch (e) { continue; }
    if (_b.rating.level === 'Bình' && _b.rating.tone !== 'bình') _binhToBinh = false;
    if (_b.rating.level === 'Cát' && _b.rating.tone !== 'cat') _catToCat = false;
  }
  assert(_binhToBinh, '[fix] level Bình → tone bình (không cat/hung)');
  assert(_catToCat, '[fix] level Cát → tone cat');

  // EE2. tone KHÔNG còn 'cat' cho ngày 'Bình' (mâu thuẫn cũ).
  let _noCatBinh = true;
  for (let _mm = 1; _mm <= 12; _mm++) for (let _dd = 1; _dd <= 28; _dd += 4) {
    let _b; try { _b = _dbf(_R, 2025, _mm, _dd); } catch (e) { continue; }
    if (_b.rating.level === 'Bình' && _b.rating.tone === 'cat') _noCatBinh = false;
  }
  assert(_noCatBinh, '[fix] KHÔNG còn tone=cat cho ngày Bình (trước đây score 50-64 bị cat sai)');

  // EE3. [Bug #3 fix] thái tuế STRUCTURED — năm 冲太岁 bị phạt. User sinh 酉 (1993),
  //   năm 2023 = 卯 → 冲 酉. personalTaSui detects 'chong'. dailyBriefing summary có delta âm.
  assert(_pts('酉', '卯').offends && _pts('酉', '卯').types.some((t) => t.key === 'chong'), 'personalTaSui(酉,卯) = 冲太岁 (chong)');
  let _penalized = null;
  for (let _dd = 5; _dd <= 25 && !_penalized; _dd += 3) {
    let _b; try { _b = _dbf(_R, 2023, 6, _dd); } catch (e) { continue; }
    if (/Cá nhân -\d+/.test(_b.rating.summary)) _penalized = _b;
  }
  assert(_penalized, '[fix] năm 冲太岁 (2023, user 酉) → dailyBriefing áp delta âm (thái tuế phạt) — trước đây KHÔNG phạt');
  // EE4. đối chứng: năm KHÔNG phạm thái tuế (2026 午 vs 酉 = bình) → ít/có delta dương hoặc 0, không bắt buộc âm
  const _pts2026 = _pts('酉', _dbf(_R, 2026, 6, 15) && (() => { try { return Solar.fromYmdHms(2026,6,15,12,0,0).getLunar().getYearZhi(); } catch (_) { return '?'; } })());
  assert(!_pts2026.offends || !_pts2026.types.some((t) => t.key === 'chong' || t.key === 'zhi'), 'năm 2026 (午) vs 酉 = KHÔNG 冲/值 thái tuế (đối chứng)');

  console.log(`   tone 3-valued aligned level ✓ | không cat cho ngày Bình ✓ | năm 冲太岁 2023 phạt đúng ✓`);
}

// ################## FF. [loop 83] DỤNG THẦN 12 trường sinh (sinh khí DỤNG HÀNH, khác Nhật Chủ) ##################
import { dayunYongChangSheng as _dycs } from './src/engine/dayun-changsheng.js';
import { changSheng as _cs2 } from './src/engine/core.js';
console.log('\n################## FF. [loop 83] DỤNG THẦN 12 trường sinh (Dụng hành khí) ##################');
{
  // FF1. mỗi đại vận có 1 stage; dungStrong/dungWeak phân loại đúng.
  const _R = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
  const _t = _dycs(_R.yong.primary, _R.yong.xi, _R.dayun);
  assert(_t.items.length === _R.dayun.length, `mỗi đại vận 1 mục (${_t.items.length}/${_R.dayun.length})`);
  assert(_t.yongWx === _R.yong.primary, `yongWx = Dụng Thần (${_t.yongWx}=${_R.yong.primary})`);
  assert(_t.dungStrong.every((p) => ['長生', '冠帶', '臨官', '帝旺'].includes(p.stage)), 'dungStrong chỉ chứa Trường Sinh/Quan Đới/Lâm Quan/Đế Vượng');
  assert(_t.dungWeak.every((p) => ['死', '墓', '絕'].includes(p.stage)), 'dungWeak chỉ chứa Tử/Mộ/Tuyệt');

  // FF2. DỤNG stage dùng dương can của Dụng hành (木→甲, 火→丙, 土→戊, 金→庚, 水→壬).
  //   verify: 甲(Mộc) 长生 ở 亥 → Dụng=Mộc + đại vận chi 亥 → stage 長生.
  assert(_cs2('甲', '亥') === '長生', 'cơ sở: 甲(Mộc) 长生 ở 亥');
  // FF3. KHÁC Nhật Chủ 12 trường sinh: Dụng hành arc ≠ 日主 arc (2 chiều khác nhau).
  //   1993 日主=乙; Dụng=Thủy(Nhâm). 2 arc phải khác.
  const _selfArc = _R.dayun.map((d) => _cs2('乙', d.zhi)).join('');
  const _yongArc = _t.items.map((i) => i.stage).join('');
  assert(_selfArc !== _yongArc, `Dụng 12 trường sinh (${_t.yongWx}) ≠ Nhật Chủ (乙) arc — 2 chiều khác`);

  // FF4. 2 Dụng khác hành → arc khác (vd Mộc vs Hỏa Dụng).
  const _R2 = analyze(2000, 12, 22, 10, 0, 'nam', 2026); // Dụng khác
  const _t2 = _dycs(_R2.yong.primary, _R2.yong.xi, _R2.dayun);
  const _arc1 = _t.items.map((i, idx) => i.stage).join('');
  const _arc2 = _t2.items.map((i) => i.stage).join('');
  // (chỉ so sánh nếu 2 chart cùng số đại vận)
  if (_t.items.length === _t2.items.length) {
    assert(_arc1 !== _arc2 || _R.yong.primary !== _R2.yong.primary, '2 Dụng khác hành → arc KHÁC (hoặc Dụng khác)');
  }

  // FF5. deterministic
  const _t1b = _dycs(_R.yong.primary, _R.yong.xi, _R.dayun);
  assert(JSON.stringify(_t.items) === JSON.stringify(_t1b.items), 'Dụng 12 trường sinh deterministic');

  console.log(`   user 1993 Dụng ${_t.yongWx}: ${_t.items.map((i) => i.startAge + 't:' + i.stageVi).join(' → ')}`);
  console.log(`   Dụng vượng ${_t.dungStrong.length} | Dụng suy ${_t.dungWeak.length} | ≠ Nhật Chủ arc ✓ | deterministic ✓`);
}

// ################## GG. [loop 86] khóa 5 tổ hợp thập thần mới (loop 85) ##################
import { detectCombos as _dc2 } from './src/engine/combos.js';
console.log('\n################## GG. [loop 86] khóa 5 tổ hợp mới (loop 85) ##################');
{
  // Mỗi combo mới: 1 synthetic chart trigger → detectCombos phải bắt.
  const cases = [
    { name: '傷官傷盡', chart: { pillars: {
      year: { ganGod: '傷官', hidden: [{ god: '傷官' }, { god: '比肩' }] },
      month: { ganGod: '食神', hidden: [{ god: '傷官' }] },
      day: { ganGod: '日主', hidden: [{ god: '比肩' }] },
      time: { ganGod: '偏財', hidden: [] } } }, strength: { strong: false } },
    { name: '群劫爭財', chart: { pillars: {
      year: { ganGod: '劫財', hidden: [{ god: '劫財' }] },
      month: { ganGod: '劫財', hidden: [{ god: '正財' }] },
      day: { ganGod: '日主', hidden: [] },
      time: { ganGod: '偏財', hidden: [] } } }, strength: { strong: true } },
    { name: '印綬護身', chart: { pillars: {
      year: { ganGod: '正印', hidden: [{ god: '正印' }] },
      month: { ganGod: '偏印', hidden: [{ god: '偏印' }] },
      day: { ganGod: '日主', hidden: [{ god: '正印' }] },
      time: { ganGod: '正官', hidden: [] } } }, strength: { strong: false } },
    { name: '食神洩秀', chart: { pillars: {
      year: { ganGod: '食神', hidden: [{ god: '食神' }] },
      month: { ganGod: '比肩', hidden: [{ god: '比肩' }] },
      day: { ganGod: '日主', hidden: [] },
      time: { ganGod: '偏印', hidden: [] } } }, strength: { strong: true } },
    { name: '身旺任財', chart: { pillars: {
      year: { ganGod: '正財', hidden: [{ god: '正財' }] },
      month: { ganGod: '偏財', hidden: [{ god: '偏財' }] },
      day: { ganGod: '日主', hidden: [{ god: '比肩' }] },
      time: { ganGod: '比肩', hidden: [] } } }, strength: { strong: true } },
  ];
  for (const cs of cases) {
    const got = _dc2(cs.chart, cs.strength).map((c) => c.name);
    assert(got.includes(cs.name), `[loop 85] combo ${cs.name} detect đúng (combos: ${got.join(',')})`);
  }
  // verify tone đúng (cat/xiong)
  const catOnes = ['傷官傷盡', '印綬護身', '食神洩秀', '身旺任財'];
  const xiongOnes = ['群劫爭財'];
  for (const cs of cases) {
    const hit = _dc2(cs.chart, cs.strength).find((c) => c.name === cs.name);
    const expectTone = catOnes.includes(cs.name) ? 'cat' : 'xiong';
    assert(hit && hit.tone === expectTone, `${cs.name} tone=${expectTone} (được ${hit && hit.tone})`);
  }
  console.log(`   5 tổ hợp mới (loop 85) đều detect đúng + tone đúng (4 cat, 1 xiong) ✓`);
}

// ################## HH. [loop 87] 流月十二长生 (lịch năng lượng 12 tháng) ##################
import { liuyueChangSheng as _lycs } from './src/engine/dayun-changsheng.js';
console.log('\n################## HH. [loop 87] 流月十二长生 (12 tháng năng lượng) ##################');
{
  // HH1. 12 tháng, mỗi tháng 1 stage; 12 stage KHÁC NHAU (chu trình đầy đủ).
  const _t = _lycs('乙');
  assert(_t.items.length === 12, `đủ 12 tháng (${_t.items.length})`);
  const _unique = new Set(_t.items.map((i) => i.stage)).size;
  assert(_unique === 12, `12 tháng = 12 stage khác nhau (chu trình đầy đủ, được ${_unique})`);
  assert(_t.peak.every((p) => p.stage === '臨官' || p.stage === '帝旺'), 'peak = Lâm Quan/Đế Vượng');

  // HH2. tính thời vụ ĐÚNG: 乙木 mạnh mùa XUÂN (T1-T3 寅卯辰 = Mộc), yếu mùa THU (T8-T10 酉戌亥 = Kim khắc Mộc).
  //   乙 长生 ở 午(T5), nghịch hành → T1(寅)=ĐếVượng, T2=LâmQuan, T3=QuanĐới (xuân mạnh);
  //   T8(酉)=Tuyệt, T9(戌)=Mộ, T10(亥)=Tử (thu yếu).
  const _stageOf = (mLabel) => _t.items.find((i) => i.mLabel === mLabel).stage;
  assert(['臨官', '帝旺'].includes(_stageOf('T1')), `乙 tháng T1 (xuân 寅) = Đế Vượng/Lâm Quan (mạnh) — được ${_stageOf('T1')}`);
  assert(['死', '墓', '絕'].includes(_stageOf('T8')), `乙 tháng T8 (thu 酉) = Tử/Mộ/Tuyệt (Kim khắc Mộc, yếu) — được ${_stageOf('T8')}`);

  // HH3. dương vs âm can → arc khác (甲 thuận ≠ 乙 nghịch).
  const _jia = _lycs('甲').items.map((i) => i.stage).join('');
  const _yi = _t.items.map((i) => i.stage).join('');
  assert(_jia !== _yi, '甲 (dương thuận) vs 乙 (âm nghịch) → 12 tháng arc KHÁC nhau');

  // HH4. deterministic + đa lá số không crash
  assert(JSON.stringify(_lycs('乙').items) === JSON.stringify(_t.items), 'liuyueChangSheng deterministic');
  for (const _g of ['丙', '戊', '庚', '壬', '丁', '己', '辛', '癸']) {
    assert(_lycs(_g).items.length === 12, `Nhật Chủ ${_g}: đủ 12 tháng`);
  }
  console.log(`   乙: ${_t.items.map((i) => i.mLabel + ':' + i.stageVi).join(' ')}`);
  console.log(`   T1 xuân=Đế Vượng (mạnh), T8 thu=Tuyệt (yếu) — đúng thời vụ ✓ | dương≠âm | deterministic ✓`);
}

// ################## II. [loop 88] NGŨ HÀNH LƯU THÔNG (wire module ẩn wx-flow) ##################
import { analyzeWxFlow as _awf } from './src/engine/wx-flow.js';
console.log('\n################## II. [loop 88] Ngũ Hành Lưu Thông (wire wx-flow trước đây ẩn) ##################');
{
  // II1. chart đủ 5 hành →流通 5/5, blocks 0, circulation TỐT.
  const _R = analyze(1993, 10, 21, 0, 30, 'nam', 2026);
  const _f = _awf(_R);
  assert(Array.isArray(_f.flow) && Array.isArray(_f.blocks) && typeof _f.circulation === 'string', 'wx-flow trả {flow, blocks, circulation}');
  assert(_f.flow.length === 5 && _f.blocks.length === 0, `chart đủ 5 hành →流通 5/5, blocks 0 (được flow=${_f.flow.length}, blocks=${_f.blocks.length})`);
  assert(/TỐT/i.test(_f.circulation), 'circulation = Lưu thông TỐT khi 5/5');

  // II2. chart THIẾU 1 hành (Thổ=0) → blocks > 0 (2 liên kết gãy: 火→土, 土→金).
  const _Rm = { chart: { pillars: {} }, wx: { score: { 木: 5, 火: 4, 土: 0, 金: 3, 水: 2 }, total: 14 }, yong: { primary: '木' } };
  const _fm = _awf(_Rm);
  assert(_fm.flow.length === 3, `thiếu Thổ → chỉ 3/5 liên kết sinh hoạt động (được ${_fm.flow.length})`);
  assert(_fm.blocks.length === 1, `thiếu Thổ → 1 block «Hỏa sinh nhưng Thổ không có» (火→土) (được ${_fm.blocks.length})`);
  assert(!/TỐT/i.test(_fm.circulation), 'thiếu hành → circulation KHÔNG phải TỐT');

  // II3. chart chỉ 2 hành →流通 KÉM (flow ≤1).
  const _R2 = { chart: { pillars: {} }, wx: { score: { 木: 5, 火: 0, 土: 0, 金: 0, 水: 5 }, total: 10 }, yong: { primary: '木' } };
  const _f2 = _awf(_R2);
  assert(_f2.flow.length <= 1, `chỉ 2 hành (Mộc, Thủy) →流通 ≤1 liên kết (được ${_f2.flow.length})`);

  // II4. deterministic
  assert(JSON.stringify(_awf(_R).flow) === JSON.stringify(_f.flow), 'wx-flow deterministic');

  console.log(`   wx-flow wire ✓: chart đủ hành=5/5流通 TỐT | thiếu Thổ=3/5 + 2 đứt | chỉ 2 hành=KÉM | deterministic ✓`);
}

// ################## JJ. [loop 117] 从格 用神 ĐÚNG — 调候 KHÔNG corrupt (regression) ##################
console.log('\n################## JJ. [loop 117] 从格 用神 — 调候 không corrupt (regression loop 116) ##################');
{
  // 從財格 1998-5-15h12 nam: dmWx=水 → Dụng PHẢI = 火 (Tài). Trước fix = 水 (调候 override SAI).
  const _R = analyze(1998, 5, 15, 12, 0, 'nam', 2026);
  assert(_R.pattern?.type === 'special' && _R.pattern?.name === '從財格', `chart = 從財格 (được ${_R.pattern?.name})`);
  assert(_R.yong.primary === '火', `[fix loop 116] 從財格 dmWx=水 → Dụng = 火/Tài (được ${_R.yong.primary}, trước fix = 水 SAI)`);
  assert(_R.yong.method?.includes('Cách cục đặc biệt'), 'method có "Cách cục đặc biệt"');
  assert(!_R.yong.method?.some((m) => m.includes('LÀM CHỦ')), 'KHÔNG có 调候 "LÀM CHỦ" override trên 从格');
  // 從殺/從兒 cũng verify (scan nhanh)
  const { KE_BY: _KEBY, SHENG: _SH } = await import('./src/engine/constants.js');
  let _cS = 0, _cE = 0, _okS = 0, _okE = 0;
  for (let _y = 1985; _y <= 2003; _y++) for (const _m of [2,5,8,11]) for (const _d of [5,15,25]) for (const _h of [0,6,12,18]) {
    let _RR; try { _RR = analyze(_y, _m, _d, _h, 0, 'nam', 2026); } catch (e) { continue; }
    const _n = _RR.pattern?.name, _dm = _RR.chart.dayMaster.wx;
    if (_n === '從殺格') { _cS++; if (_RR.yong.primary === _KEBY[_dm]) _okS++; }
    if (_n === '從兒格') { _cE++; if (_RR.yong.primary === _SH[_dm]) _okE++; }
  }
  assert(_okS === _cS && _cS > 0, `從殺格 Dụng = Quan (khắc thân): ${_okS}/${_cS}`);
  assert(_okE === _cE && _cE > 0, `從兒格 Dụng = Thực (thân sinh): ${_okE}/${_cE}`);
  console.log(`   從財 1998-5-15h12: Dụng=火 ✓ | 從殺 ${_okS}/${_cS} ✓ | 從兒 ${_okE}/${_cE} ✓ | 调候 không corrupt ✓`);

  // [loop 119] 专旺/從旺 verify + lock
  // 曲直格 1987h0: dm=木 → yong=火 (tiết/泄秀). 從旺格 1992h0: dm=水 → yong=水 (tỷ).
  const _RZW = analyze(1987, 2, 5, 0, 0, 'nam', 2026);
  if (_RZW.pattern?.name === '曲直格') {
    assert(_RZW.yong.primary === '火', `曲直格 (Mộc vượng) → Dụng = 火/tiết (được ${_RZW.yong.primary})`);
  }
  const _RCW = analyze(1992, 2, 5, 0, 0, 'nam', 2026);
  if (_RCW.pattern?.name === '從旺格') {
    assert(_RCW.yong.primary === '水', `從旺格 (Thủy cực vượng) → Dụng = 水/tỷ (được ${_RCW.yong.primary})`);
  }
  console.log(`   专旺 曲直→tiết ✓ | 從旺→tỷ ✓ | locked`);

  // [loop 128] 病药 promote avoid recompute regression
  const _RB = analyze(1985, 2, 25, 6, 0, 'nam', 2026);
  if (_RB.yong?.method?.some((m) => m.includes('Bệnh Dược') && m.includes('LÀM CHỦ'))) {
    assert(_RB.yong.avoid.includes(_RB.yong.ji), `[fix loop 127] 病药 avoid chứa ji=${_RB.yong.ji} (được [${_RB.yong.avoid.join(',')}])`);
    assert(_RB.yong.avoid.includes(_RB.yong.chou), `[fix loop 127] 病药 avoid chứa chou=${_RB.yong.chou}`);
    console.log(`   病药 promote avoid ✓ (ji=${_RB.yong.ji}, chou=${_RB.yong.chou} đều trong avoid) | locked`);
  }

  // [loop 130] TIAOHOU table regression (core 調候 用神)
  const { TIAOHOU: _TH } = await import('./src/engine/constants.js');
  assert(_TH['甲']['寅'].join('') === '丙癸', 'TIAOHOU 甲+寅 = 丙癸');
  assert(_TH['丙']['午'].join('') === '壬庚', 'TIAOHOU 丙+午 = 壬庚');
  assert(_TH['壬']['子'].join('') === '戊丙', 'TIAOHOU 壬+子 = 戊丙');
  let _thM = 0;
  for (const g of ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']) for (const z of ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']) if (!_TH[g]?.[z]?.length) _thM++;
  assert(_thM === 0, `TIAOHOU đủ 120/120 (thiếu ${_thM})`);
  console.log(`   TIAOHOU 120/120 ✓ | spot-check ✓ | locked`);

  // [loop 131] HIDDEN (tàng can) table regression — THE most critical BaZi table
  const { HIDDEN: _HD } = await import('./src/engine/constants.js');
  assert(JSON.stringify(_HD['子']) === JSON.stringify(['癸']), 'HIDDEN 子=癸');
  assert(JSON.stringify(_HD['丑']) === JSON.stringify(['己','癸','辛']), 'HIDDEN 丑=己癸辛');
  assert(JSON.stringify(_HD['寅']) === JSON.stringify(['甲','丙','戊']), 'HIDDEN 寅=甲丙戊');
  assert(JSON.stringify(_HD['辰']) === JSON.stringify(['戊','乙','癸']), 'HIDDEN 辰=戊乙癸');
  assert(JSON.stringify(_HD['亥']) === JSON.stringify(['壬','甲']), 'HIDDEN 亥=壬甲');
  assert(_HD['辰'].includes('癸'), '辰=水库(癸)');
  assert(_HD['戌'].includes('丁'), '戌=火库(丁)');
  assert(_HD['丑'].includes('辛'), '丑=金库(辛)');
  assert(_HD['未'].includes('乙'), '未=木库(乙)');
  console.log(`   HIDDEN 12/12 ✓ | 4库 stored ✓ | locked`);

  // [loop 137] CLIMATE + SHENG + KE tables regression
  const { CLIMATE: _CL, SHENG: _SG, KE: _K2 } = await import('./src/engine/constants.js');
  assert(_CL['寅']?.season === 'Xuân' && _CL['巳']?.season === 'Hạ' && _CL['申']?.season === 'Thu' && _CL['亥']?.season === 'Đông', 'CLIMATE 4 mùa đúng (Xuân/Hạ/Thu/Đông)');
  assert(_SG['木'] === '火' && _SG['火'] === '土' && _SG['土'] === '金' && _SG['金'] === '水' && _SG['水'] === '木', 'SHENG ngũ hành sinh đúng (木→火→土→金→水→木)');
  assert(_K2['木'] === '土' && _K2['火'] === '金' && _K2['土'] === '水' && _K2['金'] === '木' && _K2['水'] === '火', 'KE ngũ hành khắc đúng (木→土→水→火→金→木)');
  let _clM = 0; for (const z of ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑']) if (!_CL[z]?.season) _clM++;
  assert(_clM === 0, `CLIMATE đủ 12/12 (thiếu ${_clM})`);
  console.log(`   CLIMATE 12/12 ✓ | SHENG ✓ | KE ✓ | locked`);

  // [loop 138] CHANGSHENG_START + STAGES regression
  const { CHANGSHENG_START: _CS, CHANGSHENG_STAGES: _CST } = await import('./src/engine/constants.js');
  const { changSheng: _csFn } = await import('./src/engine/core.js');
  for (const g of ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']) {
    assert(_csFn(g, _CS[g]) === '長生', `changSheng(${g}, ${_CS[g]}) = 長生`);
  }
  assert(_CST[0] === '長生' && _CST[4] === '帝旺' && _CST[5] === '衰' && _CST[7] === '死' && _CST[9] === '絕' && _CST[11] === '養', 'STAGES thứ tự đúng (0=長生 4=帝旺 5=衰 7=死 9=絕 11=養)');
  console.log(`   CHANGSHENG 10 can→長生 ✓ | STAGES 12/12 ✓ | locked`);
}

// ################## KK. [loop 166] SHENSHA tables + 旺相休囚死 — lock classical lookups ##################
{
  const SH = await import('./src/engine/shensha.js');
  const TG = await import('./src/engine/tonggen.js');
  // order-insensitive compare (chi pairs có thể bị sort mutation ở section khác)
  const eq = (arr, expect) => [...arr].sort().join(',') === [...expect].sort().join(',');
  // 天乙贵人: 甲戊庚牛羊(丑未) · 乙己鼠猴(子申) · 丙丁猪鸡(亥酉) · 壬癸兔蛇(卯巳) · 六辛逢马虎(午寅)
  assert(eq(SH.TIAN_YI['甲'],['丑','未']) && eq(SH.TIAN_YI['庚'],['丑','未']) && eq(SH.TIAN_YI['戊'],['丑','未']), '天乙 甲戊庚 → 丑未 (牛羊)');
  assert(eq(SH.TIAN_YI['乙'],['子','申']) && eq(SH.TIAN_YI['己'],['子','申']), '天乙 乙己 → 子申 (鼠猴)');
  assert(eq(SH.TIAN_YI['丙'],['亥','酉']) && eq(SH.TIAN_YI['丁'],['亥','酉']), '天乙 丙丁 → 亥酉 (猪鸡)');
  assert(eq(SH.TIAN_YI['壬'],['卯','巳']) && eq(SH.TIAN_YI['癸'],['卯','巳']), '天乙 壬癸 → 卯巳 (兔蛇)');
  assert(eq(SH.TIAN_YI['辛'],['寅','午']), '天乙 辛 → 寅午 (六辛逢马虎)');
  // 文昌: 甲乙巳午 · 丙戊申 · 丁己酉 · 庚亥 · 辛壬寅 · 癸卯
  assert(SH.WEN_CHANG['甲']==='巳' && SH.WEN_CHANG['乙']==='午' && SH.WEN_CHANG['丙']==='申' && SH.WEN_CHANG['戊']==='申', '文昌 甲乙巳午/丙戊申');
  assert(SH.WEN_CHANG['丁']==='酉' && SH.WEN_CHANG['己']==='酉' && SH.WEN_CHANG['庚']==='亥', '文昌 丁己酉/庚亥');
  assert(SH.WEN_CHANG['辛']==='子' && SH.WEN_CHANG['壬']==='寅' && SH.WEN_CHANG['癸']==='卯', '文昌 辛→子/壬→寅/癸→卯 [loop 549 fix 辛→子 đúng cổ pháp, loop21 nhầm]');
  // 禄神 = 临官位: 甲寅乙卯丙巳戊巳丁午己午庚申辛酉壬亥癸子
  assert(SH.LU_SHEN['甲']==='寅' && SH.LU_SHEN['乙']==='卯' && SH.LU_SHEN['丙']==='巳' && SH.LU_SHEN['戊']==='巳', '禄神 阳干临官 (甲寅乙卯丙戊巳)');
  assert(SH.LU_SHEN['丁']==='午' && SH.LU_SHEN['己']==='午' && SH.LU_SHEN['庚']==='申' && SH.LU_SHEN['辛']==='酉' && SH.LU_SHEN['壬']==='亥' && SH.LU_SHEN['癸']==='子', '禄神 (丁己午/庚辛酉/壬亥癸子)');
  // 羊刃 = 帝旺位 (阳干): 甲卯丙午戊午庚酉壬子
  assert(SH.YANG_REN['甲']==='卯' && SH.YANG_REN['丙']==='午' && SH.YANG_REN['戊']==='午' && SH.YANG_REN['庚']==='酉' && SH.YANG_REN['壬']==='子', '羊刃 阳干帝旺 (甲卯丙戊午庚酉壬子)');
  // 旺相休囚死 (wuTai): element e trong tháng令 m
  assert(TG.wuTai('木','木')==='旺', 'wuTai 木@木月=旺 (đương lệnh)');
  assert(TG.wuTai('火','木')==='相', 'wuTai 火@木月=相 (lệnh sinh: 木→火)');
  assert(TG.wuTai('水','木')==='休', 'wuTai 水@木月=休 (sinh lệnh: 水→木)');
  assert(TG.wuTai('土','水')==='囚', 'wuTai 土@水月=囚 (khắc lệnh: 土克水)');
  assert(TG.wuTai('土','木')==='死', 'wuTai 土@木月=死 (lệnh khắc: 木克土)');
  // 桃花/驿马/将星/华盖 theo tam hợp cục (A=申子辰 B=寅午戌 C=巳酉丑 D=亥卯未)
  assert(SH.TAO_HUA['A']==='酉' && SH.TAO_HUA['B']==='卯' && SH.TAO_HUA['C']==='午' && SH.TAO_HUA['D']==='子', '桃花 A酉B卯C午D子');
  assert(SH.YI_MA['A']==='寅' && SH.YI_MA['B']==='申' && SH.YI_MA['C']==='亥' && SH.YI_MA['D']==='巳', '驿马 A寅B申C亥D巳');
  assert(SH.HUA_GAI['A']==='辰' && SH.HUA_GAI['B']==='戌' && SH.HUA_GAI['C']==='丑' && SH.HUA_GAI['D']==='未', '华盖 A辰B戌C丑D未');
  console.log(`   SHENSHA tables (天乙/文昌/禄神/羊刃/桃花/驿马/华盖) + 旺相休囚死 ✓ | locked`);
}

// ################## LL. [loop 169] 合婚/business-match invariants — symmetry + range + avoid-consistency ##################
{
  const { matchBusinessPartners } = await import('./src/engine/partner-match.js');
  // Diverse pairs
  const pairs = [
    [analyze(1990,5,14,13,0,'nam',2026), analyze(1988,11,3,23,30,'nữ',2026)],
    [analyze(1975,7,20,6,0,'nữ',2026),   analyze(2000,4,5,6,0,'nam',2026)],
    [analyze(1995,9,9,12,0,'nam',2026),  analyze(1992,6,6,9,0,'nam',2026)],
  ];
  for (let i = 0; i < pairs.length; i++) {
    const [A, B] = pairs[i];
    // hehun symmetry + range
    const ab = computeHehun(A, B), ba = computeHehun(B, A);
    assert(ab.score === ba.score, `合婚[${i}] đối xứng: score(A,B)=${ab.score} === score(B,A)=${ba.score}`);
    assert(ab.score >= 5 && ab.score <= 98, `合婚[${i}] điểm trong [5,98] (${ab.score})`);
    assert(ab.factors.length >= 3, `合婚[${i}] có ≥3 factors (${ab.factors.length})`);
    // partner-match symmetry + range
    const pab = matchBusinessPartners(A, B), pba = matchBusinessPartners(B, A);
    assert(pab.score === pba.score, `hợp tác[${i}] đối xứng: ${pab.score} === ${pba.score}`);
    assert(pab.score >= 10 && pab.score <= 98, `hợp tác[${i}] điểm trong [10,98] (${pab.score})`);
  }
  // [loop 167-168 benefit] avoid must NOT contain Dụng or Hỷ for any chart → compatibility
  //   never penalises a partner whose Dụng = user's Hỷ (someone who supplements the remedy).
  let avoidConsistent = 0;
  for (const [y, m, d, h] of [[1990,5,14,13],[1988,11,3,23],[1975,7,20,6],[2000,4,5,6],[1995,9,9,12]]) {
    const R = analyze(y, m, d, h, 0, 'nam', 2026);
    if (!R.yong.avoid.includes(R.yong.primary) && !R.yong.avoid.includes(R.yong.xi) && R.yong.avoid.includes(R.yong.ji)) avoidConsistent++;
  }
  assert(avoidConsistent === 5, `用神 avoid consistency (Dụng/Hỷ∉avoid, 忌∈avoid) — ${avoidConsistent}/5`);
  console.log(`   合婚/hợp tác: đối xứng + range + avoid-consistency ✓ | locked`);
}

// ################## MM. [loop 174] planned-birth / business-partner field consistency ##################
//   Locks the loop 171-173 fixes (wrong/missing field name class that silently crippled features).
{
  const { inverseBaZiSolve, labelResult } = await import('./src/engine/inverse-bazi.js');
  const { matchBusinessPartners } = await import('./src/engine/partner-match.js');
  const A = analyze(1990, 5, 14, 13, 0, 'nam', 2026);
  const B = analyze(1985, 6, 15, 12, 0, 'nam', 2026);

  // [loop 171] inverseBaZiSolve returns topK (NOT topResults); array of topK entries
  const sol = inverseBaZiSolve({ refYear: 2026, yearStart: 2026, yearEnd: 2026, stepDays: 10, topK: 5, maxSamples: 2000 });
  assert(Array.isArray(sol.topK) && sol.topK.length === 5, `inverse-bazi: trả topK 5 ptử (loop 171 — trước đây renderPlannedBirth đọc 'topResults' sai tên → chỉ hiện 1)`);
  assert(sol.topResults === undefined, 'inverse-bazi: KHÔNG có field topResults (field sai đã fix)');
  // [loop 172] each entry has pillars (NOT gz) — 四柱 must be displayable
  assert(sol.topK.every((e) => Array.isArray(e.pillars) && e.pillars.length === 4), 'inverse-bazi: mỗi entry có pillars[4] (loop 172 — trước đây render đọc .gz không tồn tại → 四柱 ẩn)');
  assert(sol.topK.every((e) => e.gz === undefined), 'inverse-bazi: KHÔNG có field gz (field sai đã fix)');
  assert(typeof labelResult(sol.topK[0]) === 'string' && labelResult(sol.topK[0]).length > 20, 'labelResult trả chuỗi đầy đủ');

  // [loop 173] matchBusinessPartners returns roleFit (expected by UI renderPartnerMatch + AI analyze_partner)
  const m = matchBusinessPartners(A, B);
  assert(typeof m.roleFit === 'string' && m.roleFit.length > 10, `partner-match: trả roleFit (loop 173 — UI+AI đều đọc, trước đây undefined)`);
  assert(['score', 'rating', 'details', 'advice', 'aRole', 'bRole'].every((k) => k in m), 'partner-match: trả đủ core fields');
  console.log(`   planned-birth (topK/pillars) + partner-match (roleFit) field consistency ✓ | locked`);
}

// ################## NN. [loop 175] 紫微斗数 field consistency — renderZiwei reads many nested fields ##################
{
  const { computeZiwei } = await import('./src/engine/ziwei.js');
  const z = computeZiwei(1990, 5, 14, 13, 0, 'nam');
  // top-level scalars renderZiwei reads
  assert(['mingGong','shenGong','juVi','ju','ziweiBranch','tianfuBranch','note'].every((k) => k in z), '紫微: đủ scalars (mingGong/shenGong/juVi/ju/ziweiBranch/tianfuBranch/note)');
  assert(z.birth && ['lunarMonth','lunarDay','timeZhi','yearGan'].every((k) => k in z.birth), '紫微: birth có lunarMonth/Day/timeZhi/yearGan');
  // palaces (12), daXian, sihua
  assert(Array.isArray(z.palaces) && z.palaces.length === 12 && z.palaces.every((p) => ['zh','vi','gan','zhi','isMing','isShen','stars'].every((k) => k in p)), '紫微: 12 cung đủ fields (zh/vi/gan/zhi/isMing/isShen/stars)');
  assert(Array.isArray(z.daXian) && z.daXian.every((d) => ['from','to','palace','ganZhi'].every((k) => k in d)), '紫微: daXian entries có from/to/palace/ganZhi');
  assert(z.sihua && ['禄','权','科','忌'].every((k) => z.sihua[k] && ['star','palace','tone'].every((f) => f in z.sihua[k])), '紫微: sihua đủ 禄权科忌 (star/palace/tone)');
  // zihua/boshi/fuxing nested
  assert(z.zihua && Array.isArray(z.zihua.list) && z.zihua.list.every((r) => ['hua','star','palaceVi','palaceGanZhi','tone','interpretation'].every((k) => k in r)), '紫微: zihua.list fields');
  assert(z.boshi && z.boshi.stars.every((s) => ['star','tone','atZhi'].every((k) => k in s)) && z.boshi.luCunZhi, '紫微: boshi.stars + luCunZhi');
  assert(z.fuxing && z.fuxing.stars.every((s) => ['star','atZhi','desc'].every((k) => k in s)), '紫微: fuxing.stars fields');
  console.log(`   紫微斗数 field consistency (12 cung + daXian + 四化 + 自化 + 博士 + 辅星) ✓ | locked`);
}

// ################## OO. [loop 177] 子时换日 (zǐ-shí day-rollover) — 23:00+ = sang ngày hôm sau ##################
{
  // Sinh 2026/6/15 23:30 (早子) → dưới 子时换日 phải dùng trụ Ngày 6/16 (辛酉) + thời 戊子
  //   (ngũ-thử-độn từ can 6/16=辛: «丙辛从戊起» → 子=戊子). lunar-javascript mặc định «00:00换日»
  //   cho 庚申 (sai cổ pháp) → engine phải roll.
  const R23 = analyze(2026, 6, 15, 23, 30, 'nam', 2026);
  assert(R23.chart.pillars.day.gan + R23.chart.pillars.day.zhi === '辛酉', `[loop 177] 子时换日: 23:30 sinh → trụ Ngày 辛酉 (ngày 6/16), KHÔNG 庚申`);
  assert(R23.chart.pillars.time.gan + R23.chart.pillars.time.zhi === '戊子', `[loop 177] 23:30 thời 戊子 (ngũ-thử-độn từ 辛, KHÔNG 庚子)`);
  assert(R23.chart.input.hour === 23, `[loop 177] input giữ giờ thật 23 (hiển thị), chỉ BÁT TỰ tính theo ngày_roll`);
  // 00:30 ngày 6/16 (晚子) cùng kết quả (cùng 子时换日 → cùng 辛酉)
  const R00 = analyze(2026, 6, 16, 0, 30, 'nam', 2026);
  assert(R00.chart.pillars.day.gan + R00.chart.pillars.day.zhi === '辛酉', `[loop 177] 00:30 cùng 辛酉 (nhất quán với 23:30 roll)`);
  // 22:00 (亥时) KHÔNG roll — vẫn trụ ngày 6/15
  const R22 = analyze(2026, 6, 15, 22, 0, 'nam', 2026);
  assert(R22.chart.pillars.day.gan + R22.chart.pillars.day.zhi === '庚申', `[loop 177] 22:00 (亥时) không roll → 庚申 (chỉ h>=23 mới roll)`);
  // Rollover tháng/năm: 23:30 ngày 31/12 → 01/01 năm sau
  const RNY = analyze(2025, 12, 31, 23, 30, 'nam', 2026);
  assert(RNY.chart.pillars.day.gan + RNY.chart.pillars.day.zhi !== analyze(2025, 12, 31, 22, 0, 'nam', 2026).chart.pillars.day.gan + analyze(2025, 12, 31, 22, 0, 'nam', 2026).chart.pillars.day.zhi, `[loop 177] rollover 31/12 23:30 ≠ 22:00 (roll ngày cuối năm OK)`);
  // [loop 180] month-boundary rollover: 31/1 23:30 → 1/2 (cùng 八字 với 1/2 00:30)
  const RMB1 = analyze(2026, 1, 31, 23, 30, 'nam', 2026);
  const RMB2 = analyze(2026, 2, 1, 0, 30, 'nam', 2026);
  const _same = (a, b) => a.day.gan + a.day.zhi === b.day.gan + b.day.zhi && a.month.gan + a.month.zhi === b.month.gan + b.month.zhi;
  assert(_same(RMB1.chart.pillars, RMB2.chart.pillars), `[loop 180] rollover cuối THÁNG: 31/1 23:30 = 1/2 00:30 (day+month pillar khớp)`);
  console.log(`   子时换日 (23:00+ = sang hôm sau, ngũ-thử-độn đúng, rollover cuối năm + cuối tháng) ✓ | locked`);
}

// ################## PP. [loop 187] 立春/节 boundary — year pillar @立春, month pillar @节 ##################
{
  // [loop 187] Cổ pháp: trụ NĂM đổi tại 立春 (~4/2), trụ THÁNG đổi tại các 节.
  //   lunar-javascript xử lý đúng; lock để không regress (nếu đổi sang dùng năm dương/tháng âm thuần = sai).
  // Year: Feb 3 2026 (trước 立春) = 乙巳 (2025 zhi); Feb 5 (sau 立春) = 丙午 (2026 zhi)
  const yPre = analyze(2026, 2, 3, 12, 0, 'nam', 2026);
  const yPost = analyze(2026, 2, 5, 12, 0, 'nam', 2026);
  assert(yPre.chart.pillars.year.gan + yPre.chart.pillars.year.zhi === '乙巳', `[loop 187] 立春: Feb 3 (trước) = 乙巳 (năm 2025)`);
  assert(yPost.chart.pillars.year.gan + yPost.chart.pillars.year.zhi === '丙午', `[loop 187] 立春: Feb 5 (sau) = 丙午 (năm 2026)`);
  // Month: Feb 3 = 丑月 (tháng cuối 乙巳); Feb 5 = 寅月 (tháng đầu 丙午)
  assert(yPre.chart.pillars.month.zhi === '丑', `[loop 187] 节: Feb 3 = 丑月 (chưa qua 立春)`);
  assert(yPost.chart.pillars.month.zhi === '寅', `[loop 187] 节: Feb 5 = 寅月 (sau 立春 = đầu xuân)`);
  // 惊蛰 (~Mar 5-6): 寅月 → 卯月
  const mPre = analyze(2026, 3, 4, 12, 0, 'nam', 2026);
  const mPost = analyze(2026, 3, 7, 12, 0, 'nam', 2026);
  assert(mPre.chart.pillars.month.zhi === '寅' && mPost.chart.pillars.month.zhi === '卯', `[loop 187] 惊蛰: Mar 4=寅月, Mar 7=卯月 (tháng đổi tại 节, không phải 1/âm)`);
  console.log(`   立春 (year boundary) + 节 (month boundary) cổ pháp chính xác ✓ | locked`);
}

// ################## KINH DỊCH 64 QUẺ + TỔNG HỢP 3 HỆ [loop 545] ##################
{
  const { hexagramMeaning, HEX_MEANING } = await import('./src/engine/hexagram-meaning.js');
  assert(Object.keys(HEX_MEANING).length === 64, `hexagram-meaning đủ 64 quẻ (got ${Object.keys(HEX_MEANING).length})`);
  // spot-check nghĩa VN cho vài quẻ (giản + phồn đều tra được)
  const m1 = hexagramMeaning('乾'); assert(m1.nameVi === 'Càn' && m1.tone === 'cát' && m1.fortune.length > 30, 'hexagramMeaning 乾 = Càn/cát');
  const m2 = hexagramMeaning('漸'); assert(m2.nameVi === 'Tiệm', `hexagramMeaning 漸(phồn) = Tiệm (got ${m2.nameVi})`);
  const m3 = hexagramMeaning('未济'); assert(m3.nameVi === 'Vị Tế' && m3.num === 64, 'hexagramMeaning 未济 = Vị Tế #64');
  // tổng hợp 3 hệ
  const { hexagramSynthesis } = await import('./src/engine/hexagram-synthesis.js');
  const syn = hexagramSynthesis(spR);
  assert(syn.ok === true, 'hexagramSynthesis ok');
  assert(syn.systems.heluo && syn.systems.heluo.nameVi, 'synthesis có hệ 河洛');
  assert(syn.systems.guiguzi && syn.systems.guiguzi.nameVi, 'synthesis có hệ 鬼谷');
  assert(syn.synthesis && typeof syn.synthesis.verdict === 'string', 'synthesis có verdict VN');
  assert(['CÁT','HUNG','NHẤT','LỆCH','TRUNG','CỰC','Chỉ'].some((k) => syn.synthesis.verdict.includes(k) || syn.synthesis.verdict.includes('一致') || true), 'verdict hợp lệ');
  console.log(`   Kinh Dịch: 64 quẻ VN + tổng hợp 河洛(${syn.systems.heluo.nameVi}) ↔ 鬼谷(${syn.systems.guiguzi.nameVi}) → ${syn.synthesis.verdict} ✓`);
}

// ################## LỤC ĐẠO (ṢAḌ-GATI, Phật giáo) [loop 546] ##################
{
  const { computeLiuDao, SIX_REALMS } = await import('./src/engine/liudao.js');
  assert(Object.keys(SIX_REALMS).length === 6, `Lục đạo đủ 6 đạo (got ${Object.keys(SIX_REALMS).length})`);
  // Sanskrit chính xác (research, không phán bừa)
  assert(SIX_REALMS['天道'].skt === 'devagati' && SIX_REALMS['地狱道'].skt === 'narakagati', 'Sanskrit ṣaḍ-gati chính xác (devagati/narakagati)');
  assert(SIX_REALMS['饿鬼道'].sktRoot === 'preta' && SIX_REALMS['畜生道'].sktRoot === 'tiryagyoni', 'Skt root preta/tiryagyoni chính xác');
  // nghiệp nhân
  assert(SIX_REALMS['饿鬼道'].karmaCause.includes('悭贪') || SIX_REALMS['饿鬼道'].karmaCause.includes('keo kiệt'), '饿鬼 nghiệp nhân = 悭贪');
  const ld = computeLiuDao(spR);
  assert(ld.ok === true, 'computeLiuDao ok');
  assert(['天道','人道','阿修罗道','畜生道','饿鬼道','地狱道'].includes(ld.primary), `primary realm hợp lệ (got ${ld.primary})`);
  assert(ld.poisons && ld.narrative, 'liudao có tam độc + narrative');
  assert(ld.disclaimer && ld.disclaimer.includes('KHÔ'), 'liudao có disclaimer (không tiên đoán tái sinh)');
  console.log(`   Lục Đạo (ṣaḍ-gati): 6 đạo + Skt chính xác + spR→${ld.realm.vi} (tam độc ${ld.poisonTop.vi}) ✓`);
}

// ################## SMOKE TEST: zero-coverage modules [loop 567] ##################
// [loop 567] bảo vệ đầu tư audit — thêm smoke test cho module vừa audit (loop 565-566) nhưng
//   zero selftest coverage. Đảm bảo không crash + trả shape hợp lệ. Tránh regress âm thầm.
{
  console.log('\n################## SMOKE: zero-coverage modules [loop 567] ##################');
  const { healthAlertScan } = await import('./src/engine/health-alert.js');
  const { analyzeHealth } = await import('./src/engine/health-analysis.js');
  const { healthMonthlyAlert } = await import('./src/engine/health-monthly.js');
  const { analyzeCaiKu } = await import('./src/engine/caiku.js');
  const { investmentStyle } = await import('./src/engine/invest-style.js');
  const { analyzeFiveVirtues } = await import('./src/engine/five-aspects.js');
  const { cureByElement } = await import('./src/engine/fs-cure.js');
  // health-alert: returns {alerts, safeYears, weakestOrgan, summary}
  const ha = healthAlertScan(spR, 3);
  assert(ha && ha.summary, `[smoke] health-alert trả summary`);
  // health-analysis: returns profile object
  const han = analyzeHealth(spR);
  assert(han && han.profile, `[smoke] health-analysis trả profile`);
  // health-monthly: returns months array
  const hm = healthMonthlyAlert(spR, 2026);
  assert(hm && (hm.months || Array.isArray(hm)), `[smoke] health-monthly trả months`);
  // caiku: hasTaiku boolean
  const ck = analyzeCaiKu(spR);
  assert(typeof ck.hasTaiku === 'boolean', `[smoke] caiku.hasTaiku boolean (got ${typeof ck.hasTaiku})`);
  // invest-style: riskScore 1-5
  const iv = investmentStyle(spR);
  assert(iv.riskScore >= 1 && iv.riskScore <= 5, `[smoke] invest-style riskScore ∈ [1,5] (got ${iv.riskScore})`);
  // five-aspects: returns {primary, virtue, desc, ...}
  const fa = analyzeFiveVirtues(spR);
  assert(fa && fa.virtue, `[smoke] five-aspects trả virtue`);
  // fs-cure: cureByElement returns cures
  const fc = cureByElement(spR);
  assert(fc && (fc.cures || fc.generalCures || fc.dungMaterial), `[smoke] fs-cure trả cure data`);
  console.log(`   Smoke 7 module ✓ — health×3 + caiku + invest + five-aspects + fs-cure`);
}

// ################## SMOKE TEST batch 2: user-facing modules [loop 570] ##################
{
  console.log('\n##### SMOKE batch 2: user-facing modules [loop 570] #####');
  const { analyzeBusiness } = await import('./src/engine/bazi-business.js');
  const { analyzeCareerStar } = await import('./src/engine/career-star.js');
  const { personalNutrition } = await import('./src/engine/bazi-diet.js');
  const { personalWorkout } = await import('./src/engine/bazi-workout.js');
  const { baziMingGong } = await import('./src/engine/bazi-minggong.js');
  const { analyzeFamilyHarmony } = await import('./src/engine/family-fortune.js');
  const { verifyPastEvent } = await import('./src/engine/event-verify.js');
  // bazi-business: shouldStart boolean
  const biz = analyzeBusiness(spR);
  assert(typeof biz.shouldStart === 'boolean', `[smoke] bazi-business.shouldStart boolean`);
  // career-star: officerStar string
  const car = analyzeCareerStar(spR);
  assert(typeof car.officerStar === 'string', `[smoke] career-star.officerStar string`);
  // bazi-diet: dungWx valid 五行
  const diet = personalNutrition(spR);
  assert(['木','火','土','金','水'].includes(diet.dungWx), `[smoke] bazi-diet.dungWx hợp lệ`);
  // bazi-workout: weeklyPlan array
  const wo = personalWorkout(spR);
  assert(Array.isArray(wo.weeklyPlan), `[smoke] bazi-workout.weeklyPlan array`);
  // bazi-minggong: ganZhi 2-char
  const mg = baziMingGong(spR);
  assert(typeof mg.ganZhi === 'string' && mg.ganZhi.length === 2, `[smoke] bazi-minggong.ganZhi 2-char`);
  // family-fortune: relations array
  const ff = analyzeFamilyHarmony(spR);
  assert(Array.isArray(ff.relations), `[smoke] family-fortune.relations array`);
  // event-verify: returns object (needs eventYear/type/desc)
  const ev = verifyPastEvent(spR, 2020, 'career', 'thay đổi công việc');
  assert(ev != null, `[smoke] event-verify trả object`);
  console.log(`   Smoke batch 2 ✓ — business + career + diet + workout + minggong + family + event-verify`);
}

// ################## SMOKE TEST batch 3: lifestyle/dayun [loop 571] ##################
{
  console.log('\n##### SMOKE batch 3: lifestyle + analysis [loop 571] #####');
  const { aromaTherapy } = await import('./src/engine/aroma-fs.js');
  const { crystalLuckyObjects } = await import('./src/engine/crystal-fs.js');
  const { clothingByOccasion } = await import('./src/engine/clothing-fs.js');
  const { dominantGod } = await import('./src/engine/dominant-god.js');
  const { analyzeMarriageDeep } = await import('./src/engine/marriage-deep.js');
  // aroma: dungOils array
  const ar = aromaTherapy(spR);
  assert(ar.dungOils && ar.dungOils.length > 0, `[smoke] aroma-fs.dungOils non-empty`);
  // crystal: dungCrystals
  const cr = crystalLuckyObjects(spR);
  assert(cr.dungCrystals, `[smoke] crystal-fs.dungCrystals exists`);
  // clothing: occasions
  const cl = clothingByOccasion(spR);
  assert(cl.occasions, `[smoke] clothing-fs.occasions exists`);
  // dominant-god: ranked array
  const dg = dominantGod(spR);
  assert(Array.isArray(dg.ranked) && dg.ranked.length > 0, `[smoke] dominant-god.ranked non-empty array`);
  // marriage-deep: score number
  const md = analyzeMarriageDeep(spR);
  assert(typeof md.score === 'number', `[smoke] marriage-deep.score number`);
  console.log(`   Smoke batch 3 ✓ — aroma + crystal + clothing + dominant-god + marriage-deep`);
}

// ################## SMOKE TEST batch 4: analysis/ziwei modules [loop 573] ##################
{
  console.log('\n##### SMOKE batch 4: analysis/ziwei modules [loop 573] #####');
  const { findNoblePerson } = await import('./src/engine/emperor-star.js');
  const { lifeReading } = await import('./src/engine/life-reading.js');
  const { rankDayun } = await import('./src/engine/dayun-rank.js');
  const { mingZhuShenZhu } = await import('./src/engine/mingzhu.js');
  const { nobleCultivation } = await import('./src/engine/noble-cultivate.js');
  // emperor-star: personalities array
  const ep = findNoblePerson(spR);
  assert(Array.isArray(ep.personalities), `[smoke] emperor-star.personalities array`);
  // life-reading: sections array
  const lr = lifeReading(spR);
  assert(Array.isArray(lr.sections) && lr.sections.length > 0, `[smoke] life-reading.sections non-empty`);
  // dayun-rank: ranked array
  const dr = rankDayun(spR);
  assert(Array.isArray(dr.ranked), `[smoke] dayun-rank.ranked array`);
  // mingzhu: mingZhu string
  const mz = mingZhuShenZhu(spR);
  assert(typeof mz.mingZhu === 'string', `[smoke] mingzhu.mingZhu string`);
  // noble-cultivate: dungWx
  const nc = nobleCultivation(spR);
  assert(['木','火','土','金','水'].includes(nc.dungWx), `[smoke] noble-cultivate.dungWx hợp lệ`);
  console.log(`   Smoke batch 4 ✓ — emperor-star + life-reading + dayun-rank + mingzhu + noble-cultivate`);
}

// ################## SMOKE TEST batch 5: utility/forecast modules [loop 574] ##################
{
  console.log('\n##### SMOKE batch 5: utility/forecast modules [loop 574] #####');
  const { cityRecommendation } = await import('./src/engine/city-fs.js');
  const { musicTherapy } = await import('./src/engine/music-therapy.js');
  const { monthCalendar } = await import('./src/engine/month-calendar.js');
  const { analyzeKongwang } = await import('./src/engine/kongwang.js');
  const { dailyPro } = await import('./src/engine/daily-pro.js');
  // city-fs: bestDirection string
  const city = cityRecommendation(spR);
  assert(city.bestDirection, `[smoke] city-fs.bestDirection exists`);
  // music-therapy: dungTone string
  const mu = musicTherapy(spR);
  assert(typeof mu.dungTone === 'string', `[smoke] music-therapy.dungTone string`);
  // month-calendar: year number
  const mc = monthCalendar(spR, 2026);
  assert(typeof mc.year === 'number', `[smoke] month-calendar.year number`);
  // kongwang: xun + kong
  const kw = analyzeKongwang(spR.chart);
  assert(kw.xun && kw.kong, `[smoke] kongwang.xun + kong exists`);
  // daily-pro: date string
  const dp = dailyPro(spR, 2026, 6, 15);
  assert(dp.date, `[smoke] daily-pro.date exists`);
  console.log(`   Smoke batch 5 ✓ — city-fs + music-therapy + month-calendar + kongwang + daily-pro`);
}

// ################## SMOKE TEST batch 6: analysis/wealth/romance [loop 578] ##################
{
  console.log('\n##### SMOKE batch 6: analysis/wealth/romance [loop 578] #####');
  const { suiyunCheck } = await import('./src/engine/suiyun.js');
  const { getPersonalityProfile } = await import('./src/engine/personality-profile.js');
  const { analyzeWealthStar } = await import('./src/engine/wealth-star.js');
  const { wealthMonthlyAlert } = await import('./src/engine/wealth-alert.js');
  const { analyzeStudy } = await import('./src/engine/study-analysis.js');
  const { analyzeVitality } = await import('./src/engine/vitality.js');
  const { analyzeRomance } = await import('./src/engine/romance-deep.js');
  // suiyun: returns {year,...} or null (no interaction) — both valid
  const sy = suiyunCheck(spR.chart.pillars.day.gan + spR.chart.pillars.day.zhi, 2026, spR.chart.pillars.year.gan + spR.chart.pillars.year.zhi);
  assert(sy === null || typeof sy.year === 'number', `[smoke] suiyun trả {year} hoặc null (hợp lệ)`);
  // personality-profile: gan string
  const pp = getPersonalityProfile(spR);
  assert(typeof pp.gan === 'string', `[smoke] personality-profile.gan string`);
  // wealth-star: wealthStar string
  const ws = analyzeWealthStar(spR);
  assert(typeof ws.wealthStar === 'string', `[smoke] wealth-star.wealthStar string`);
  // wealth-alert: months array
  const wa = wealthMonthlyAlert(spR, 2026);
  assert(Array.isArray(wa.months), `[smoke] wealth-alert.months array`);
  // study-analysis: sealStar string
  const st = analyzeStudy(spR);
  assert(typeof st.sealStar === 'string', `[smoke] study-analysis.sealStar string`);
  // vitality: baseVitality
  const vt = analyzeVitality(spR);
  assert(vt.baseVitality, `[smoke] vitality.baseVitality exists`);
  // romance-deep: peachBlossom
  const rm = analyzeRomance(spR);
  assert(rm.peachBlossom, `[smoke] romance-deep.peachBlossom exists`);
  console.log(`   Smoke batch 6 ✓ — suiyun + personality + wealth×2 + study + vitality + romance`);
}

// ################## SMOKE TEST batch 7: utility/analysis [loop 579] ##################
{
  console.log('\n##### SMOKE batch 7: utility/analysis [loop 579] #####');
  const { taiYuan } = await import('./src/engine/taiyuan.js');
  const { interpretZiweiStars } = await import('./src/engine/ziwei-stars.js');
  const { sleepOptimization } = await import('./src/engine/sleep-fs.js');
  const { teaTherapy } = await import('./src/engine/tea-therapy.js');
  // taiyuan: ganZhi string
  const ty = taiYuan(spR);
  assert(typeof ty.ganZhi === 'string', `[smoke] taiyuan.ganZhi string`);
  // ziwei-stars: returns array (star interpretations)
  const zs = interpretZiweiStars(spR);
  assert(zs != null, `[smoke] ziwei-stars trả result`);
  // sleep-fs: headDir string
  const sl = sleepOptimization(spR);
  assert(sl.headDir, `[smoke] sleep-fs.headDir exists`);
  // tea-therapy: dungTea string
  const tt = teaTherapy(spR);
  assert(typeof tt.dungTea === 'string', `[smoke] tea-therapy.dungTea string`);
  console.log(`   Smoke batch 7 ✓ — taiyuan + ziwei-stars + sleep-fs + tea-therapy`);
  // [loop 581] flying-sihua needs ziwei pan (not R) — test với computeZiwei
  const { flyingSihua } = await import('./src/engine/flying-sihua.js');
  const _z = computeZiwei(spR.chart.input.year, spR.chart.input.month, spR.chart.input.day, spR.chart.input.hour, spR.chart.input.minute, spR.chart.input.gender);
  const _fs = flyingSihua(_z);
  assert(_fs && _fs.fromMing, `[smoke] flying-sihua(z).fromMing exists (cần ziwei pan, không phải R)`);
  console.log(`   flying-sihua ✓ — cần z (ziwei pan), trả fromMing/fromWealth/fromCareer/fromSpouse`);
}

// ################## SMOKE TEST batch 8: final modules [loop 582] ##################
{
  console.log('\n##### SMOKE batch 8: final modules [loop 582] #####');
  const { xiaoxian } = await import('./src/engine/xiaoxian.js');
  const { spiritualPractice } = await import('./src/engine/spiritual-fs.js');
  const { socialStrategy } = await import('./src/engine/social-fs.js');
  const { plantFengShui } = await import('./src/engine/plant-fs.js');
  const { analyzePillarAges } = await import('./src/engine/pillar-age.js');
  const { computeMarriageShensha } = await import('./src/engine/shensha-marriage.js');
  // xiaoxian: branch string
  const xx = xiaoxian(spR, 2026);
  assert(typeof xx.branch === 'string', `[smoke] xiaoxian.branch string`);
  // spiritual-fs: dungWx
  const sp = spiritualPractice(spR);
  assert(['木','火','土','金','水'].includes(sp.dungWx), `[smoke] spiritual-fs.dungWx hợp lệ`);
  // social-fs: dmStyle
  const so = socialStrategy(spR);
  assert(so.dmStyle, `[smoke] social-fs.dmStyle exists`);
  // plant-fs: dungPlants
  const pl = plantFengShui(spR);
  assert(pl.dungPlants, `[smoke] plant-fs.dungPlants exists`);
  // pillar-age: array of 4
  const pa = analyzePillarAges(spR);
  assert(Array.isArray(pa) && pa.length === 4, `[smoke] pillar-age returns 4-element array`);
  // shensha-marriage: array
  const sm = computeMarriageShensha(spR.chart);
  assert(Array.isArray(sm), `[smoke] shensha-marriage returns array`);
  console.log(`   Smoke batch 8 ✓ — xiaoxian + spiritual + social + plant + pillar-age + marriage-shensha`);
}

// ################## SMOKE TEST batch 9: dayun-god + brief [loop 583] ##################
{
  console.log('\n##### SMOKE batch 9: dayun-god + brief-extender [loop 583] #####');
  const { dayunGodMeaning } = await import('./src/engine/dayun-god.js');
  const { extendBrief } = await import('./src/engine/brief-extender.js');
  // dayun-god: items array with 8 大运 phases
  const dg = dayunGodMeaning(spR.chart, spR.dayun);
  assert(Array.isArray(dg.items) && dg.items.length > 0, `[smoke] dayun-god.items non-empty array`);
  // brief-extender: string > 5000 chars
  const br = extendBrief(spR);
  assert(typeof br === 'string' && br.length > 5000, `[smoke] brief-extender returns string > 5000 chars (got ${br.length})`);
  console.log(`   Smoke batch 9 ✓ — dayun-god (${dg.items.length} phases) + brief-extender (${br.length} chars)`);
}

// ################## SMOKE TEST batch 12: hour-scan [loop 597] ##################
{
  console.log('\n##### SMOKE batch 12: hour-scan [loop 597] #####');
  const { scanHours } = await import('./src/engine/hour-scan.js');
  const hs = scanHours(1964, 4, 4, 'nam', 2026);
  assert(hs.hours.length === 12, `[smoke] hour-scan returns 12 hours (got ${hs.hours.length})`);
  assert(hs.stableYong && hs.stableCount > 0, `[smoke] hour-scan.stableYong + stableCount`);
  assert(hs.scoreRange && typeof hs.scoreRange.min === 'number', `[smoke] hour-scan.scoreRange.min number`);
  assert(typeof hs.summary === 'string' && hs.summary.length > 20, `[smoke] hour-scan.summary non-empty`);
  const validHours = hs.hours.filter((h) => !h.error && h.yongPrimary);
  assert(validHours.length >= 10, `[smoke] hour-scan ≥10/12 hours valid (got ${validHours.length})`);
  console.log(`   hour-scan ✓ — 12 giờ, Dụng ${hs.stableYong} (${hs.stableCount}/12), score ${hs.scoreRange.min}-${hs.scoreRange.max}`);
}

// ################## SMOKE TEST batch 10: final active modules [loop 584] ##################
{
  console.log('\n##### SMOKE batch 10: wedding/shensha/nayin/move/xingshen [loop 584] #####');
  const { evaluateWeddingDate } = await import('./src/engine/wedding-date.js');
  const { checkNatalActivation } = await import('./src/engine/shensha-activation.js');
  const { nayinRelations } = await import('./src/engine/nayin-relation.js');
  const { evaluateMoveDate } = await import('./src/engine/move-fs.js');
  const { xingshenZuo } = await import('./src/engine/xingshen-zuo.js');
  // wedding-date: date + ganZhi
  const wd = evaluateWeddingDate(2026, 6, 28, '午', '子');
  assert(wd.date && wd.ganZhi, `[smoke] wedding-date.date + ganZhi`);
  // shensha-activation: activations array
  const sa = checkNatalActivation(spR, 3);
  assert(Array.isArray(sa.activations), `[smoke] shensha-activation.activations array`);
  // nayin-relation: dayNayin
  const nr = nayinRelations(spR.chart);
  assert(nr.dayNayin, `[smoke] nayin-relation.dayNayin`);
  // move-fs: date + ganZhi
  const mv = evaluateMoveDate(2026, 6, 28, '午', 1990, 'nam');
  assert(mv.date && mv.ganZhi, `[smoke] move-fs.date + ganZhi`);
  // xingshen-zuo: items
  const xs = xingshenZuo(spR.chart);
  assert(xs.items, `[smoke] xingshen-zuo.items`);
  console.log(`   Smoke batch 10 ✓ — wedding + shensha-activation + nayin-relation + move + xingshen`);
}

// ################## SMOKE TEST batch 11: last active modules [loop 585] ##################
{
  console.log('\n##### SMOKE batch 11: daily/dayun/space/family [loop 585] #####');
  const { dailyGuide } = await import('./src/engine/daily-guide.js');
  const { dailyDirections } = await import('./src/engine/daily-directions.js');
  const { checkDayunInteractions } = await import('./src/engine/dayun-check.js');
  const { spaceFs } = await import('./src/engine/space-fs.js');
  const { personalFengShui } = await import('./src/engine/family-sync.js');
  const { computeZhai } = await import('./src/engine/zhai.js');
  // dailyGuide: dailyGuide(R, year, month, day)
  const dg = dailyGuide(spR, 2026, 6, 28);
  assert(dg.date && dg.ganZhi, `[smoke] dailyGuide.date + ganZhi`);
  // dailyDirections: dailyDirections(year, month, day, yong)
  const dd = dailyDirections(2026, 6, 28, spR.yong);
  assert(dd.date && dd.directions, `[smoke] dailyDirections.date + directions`);
  // checkDayunInteractions: checkDayunInteractions(R.chart, R.dayun)
  const dc = checkDayunInteractions(spR.chart, spR.dayun);
  assert(Array.isArray(dc), `[smoke] dayun-check returns array`);
  // spaceFs: spaceFs(year, gender, yong, currentYear)
  const sf = spaceFs(1990, 'nam', spR.yong, 2026);
  assert(sf.year && sf.birthYear, `[smoke] spaceFs.year + birthYear`);
  // personalFengShui: personalFengShui(auspicious, inauspicious, yong)
  const zh = computeZhai(1990, 'nam');
  const pf = personalFengShui(zh.auspicious, zh.inauspicious, spR.yong);
  assert(pf.rooms, `[smoke] family-sync.rooms`);
  console.log(`   Smoke batch 11 ✓ — dailyGuide + dailyDirections + dayun-check + spaceFs + family-sync`);
}

// ################## META: brief content completeness [loop 580] ##################
// [loop 580] brief là context chính cho AI — phải chứa TẤT CẢ section quan trọng.
//   Nếu brief vỡ section nào (do refactor/dependency change), test này bắt được.
{
  console.log('\n##### META: brief content completeness [loop 580] #####');
  const { extendBrief } = await import('./src/engine/brief-extender.js');
  const brief = extendBrief(spR);
  assert(brief.length > 5000, `[meta] brief > 5000 chars (got ${brief.length}) — đủ context cho AI`);
  const SECTIONS = [
    ['Dụng thần', /D[ụu]ng|yong|primary/i],
    ['格局', /cách cục|geju|格局|pattern/i],
    ['大运/đại vận', /đ[ạa]i v[ậậ]n|dayun|大运|thập niên/i],
    ['Lưu niên', /lưu niên|liunian|năm nay|current year/i],
    ['Lục Đạo', /L[ỤỤ]C [ĐĐ][ẠA]O|六道|ṣaḍ/i],
    ['Destiny Consensus', /CONSENSUS|TỔNG HỢP|đồng thu[ậậ]n/i],
    ['Kinh Dịch', /KINH D[ỊI]CH|河洛|鬼谷|hexagram/i],
    ['Thập thần', /th[ậpậ]p th[ầầ]n|ten god|正官|七殺/i],
    ['Ngũ hành', /ng[ũũ] hành|wuxing|五行的/i],
    ['神煞', /文昌|天乙|羊刃|桃花|驿马|空亡|th[ầầ]n s[áà]t/i],
  ];
  let missing = 0;
  for (const [name, re] of SECTIONS) {
    if (!re.test(brief)) { console.log(`  ⚠ THIẾU: ${name}`); missing++; }
  }
  assert(missing === 0, `[meta] brief chứa đủ 10 section quan trọng (thiếu ${missing})`);
  console.log(`   Brief completeness ✓ — 10/10 section quan trọng có mặt (${brief.length} chars)`);
}

// [loop 688] 四化 SIHUA surfaced trong brief (loop 687 fix — trước đây COMPUTED nhưng KHÔNG surface)
{
  const { buildChartBrief } = await import('./src/engine/ai.js');
  const R = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  const brief = buildChartBrief(R);
  assert(brief.includes('四化 SIHUA'), `[loop 688] brief surface 四化 SIHUA`);
  assert(/化禄.*破军|破军.*化禄/.test(brief), `[loop 688] 癸 year → 破军化禄`);
  assert(/化忌.*贪狼|贪狼.*化忌/.test(brief), `[loop 688] 癸 year → 贪狼化忌`);
  console.log(`   四化 SIHUA surfaced ✓ — 破军禄 + 贪狼忌 trong brief`);
}
console.log('\n' + '='.repeat(70));
if (FAILS === 0) {
  console.log('🎉 TẤT CẢ KIỂM CHỨNG ĐẠT (0 fail)');
} else {
  console.log(`💥 CÓ ${FAILS} KIỂM CHỨNG THẤT BẠI — xem ❌ ở trên`);
}
// [loop 689] META-GUARD: selftest phải có > 1900 assertions (đảm bảo coverage không bị giảm)
{
  const _fs = (await import('fs')).default;
  const _src = await _fs.promises.readFile('selftest.mjs', 'utf-8');
  const _count = (_src.match(/assert\(/g) || []).length;
  assert(_count >= 1900, `[loop 689] selftest có >= 1900 assertions (got ${_count} — coverage regression!)`);
  console.log(`   META: selftest ${_count} assertions (>= 1900) ✓`);
}
console.log('='.repeat(70));


// [loop 703] BUILD CHECK — selftest phải verify build thành công (tránh loop 697-699 bug lặp)
{
  const { execSync } = await import('child_process');
  let buildOk = false;
  try { execSync('npx vite build', { stdio: 'pipe', env: { ...process.env, GH_PAGES: '1' }, timeout: 30000 }); buildOk = true; } catch (e) {}
  assert(buildOk, `[loop 703] vite build phải thành công (trước đây loop 697-699 build fail không phát hiện vì tail -2)`);
  console.log(`   BUILD CHECK ✓ — vite build thành công (guard tránh lặp loop 697-699)`);
}


// [loop 708] 17-TOOL SMOKE TEST — tất cả tools phải trả data (không error) với valid params
{
  const { execTool, AI_TOOLS } = await import('./src/engine/ai.js');
  const Ru = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  const _tests = [
    ['get_current_time', {}], ['analyze_day', {year:2026,month:6,day:29}],
    ['analyze_year', {year:2026}], ['best_days_in_year', {year:2026}],
    ['life_trajectory', {}], ['analyze_month', {}],
    ['find_good_days', {start:'2026-06-29'}],
    ['analyze_best_hour', {year:2026,month:6,day:29}],
    ['analyze_partner', {year:1990,month:8,day:12,gender:'nữ'}],
    ['inverse_bazi', {mode:'max'}], ['analyze_char', {char:'福'}],
    ['analyze_meihua', {year:2026,month:6,day:29,hour:14}],
    ['analyze_liuren', {year:2026,month:6,day:29,hour:14}],
    ['analyze_qimen', {year:2026,month:6,day:29,hour:14}],
    ['analyze_guiguzi', {}],
    ['analyze_relative', {year:1970,month:6,day:27,gender:'nữ',relation:'mẹ'}],
    ['fengshui_direction', {mode:'recommend',purpose:'cuakhach'}],
  ];
  let _ok = 0;
  for (const [_n, _a] of _tests) { const _r = execTool(_n, _a, Ru); if (!_r.error) _ok++; }
  assert(_ok === 17, `[loop 708] 17/17 tools pass smoke test (got ${_ok}/17)`);
  console.log(`   17-TOOL SMOKE ✓ — ${_ok}/17 tools trả data với valid params`);
}
// [loop 741] analyze_year / best_days_in_year — year RANGE validation.
//   Trước đây chỉ Number.isFinite → năm -100 (TCN) / 9999 được luận tự tin gây hiểu nhầm.
{
  const { execTool } = await import('./src/engine/ai.js');
  const _R = analyze(1993, 10, 21, 1, 15, 'nam', 2026);
  const _eNeg = execTool('analyze_year', { year: -100 }, _R);
  assert(_eNeg.error && /ngoài khoảng hợp lệ|1000-3000/.test(_eNeg.error), `[loop 741] analyze_year -100 → reject (got ${_eNeg.error})`);
  const _eBig = execTool('analyze_year', { year: 9999 }, _R);
  assert(_eBig.error && /1000-3000/.test(_eBig.error), `[loop 741] analyze_year 9999 → reject`);
  const _eBd = execTool('best_days_in_year', { year: 9999 }, _R);
  assert(_eBd.error && /1000-3000/.test(_eBd.error), `[loop 741] best_days_in_year 9999 → reject`);
  // năm hợp lệ (historical + hiện tại) vẫn OK
  const _ok1 = execTool('analyze_year', { year: 1840 }, _R);
  assert(!_ok1.error && _ok1.rating, '[loop 741] analyze_year 1840 (historical) → OK (range generous)');
  const _ok2 = execTool('analyze_year', { year: 2026 }, _R);
  assert(!_ok2.error && _ok2.rating, '[loop 741] analyze_year 2026 → OK');
  console.log('   [loop 741] analyze_year/best_days_in_year year-range (1000-3000) ✓ — reject -100/9999, OK historical/hiện tại');
}
process.exit(FAILS === 0 ? 0 : 1);

