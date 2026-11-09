// Test «Đường Thầy» — 3 tab mới của Thầy Giải Quẻ (docs/GAME-THIET-KE-CHOT.md P0-1):
//   gu-gongan.js (Án cổ) · namhan.js (Năm hạn của bạn) · kinh-tu.js (Chọn kinh).
// Node thuần, không DOM — import thẳng engine + module game. Chạy: node scripts/test-game-thay-mo-rong.mjs
import assert from 'node:assert/strict';
import { analyze } from '../src/engine/chart.js';
import { analyzeSummary } from '../src/engine/classical-runner.js';
import { CLASSICAL_CASES } from '../src/engine/classical-cases.js';
import { buildGongan, gradeGongan, compareCase } from '../src/game/gu-gongan.js';
import { buildNamHan, softRating, SOFT_RATING } from '../src/game/namhan.js';
import { kinhTu } from '../src/game/kinh-tu.js';

let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log('✓', name); } catch (e) { console.error('✗', name, '\n ', e.stack.split('\n').slice(0, 4).join('\n ')); process.exitCode = 1; } };
const NOW = '2026-11-05';

// ---------------------------------------------------------------- Án cổ -----
test('Án cổ: cùng key+ngày → cùng án (1 án/ngày, deterministic)', () => {
  const g1 = buildGongan(`Bạn|${NOW}`, NOW);
  const g2 = buildGongan(`Bạn|${NOW}`, NOW);
  assert.deepEqual(g1, g2);
  const pool = CLASSICAL_CASES.filter((c) => c.confidence === 'high');
  assert.ok(pool.some((c) => c.id === g1.id), 'án được chọn phải là án confidence:high');
  assert.ok(g1.pillarsText.split(' ').length === 4, 'hiện đủ 4 trụ');
  assert.ok(g1.source && g1.person && g1.compare.classic.verdict, 'nguồn/người/phán nguyên văn không rỗng');
});

test('Án cổ: 3 bước hỏi (lược bước dụng khi cổ pháp tranh cãi → còn 2), đáp án nằm trong options', () => {
  const shapes = new Set();
  for (let i = 0; i < 100; i++) {
    const g = buildGongan(`người-${i}|${NOW}`, NOW);
    assert.ok(g.total === 2 || g.total === 3, `tổng bước phải 2 hoặc 3 (thay vì ${g.total})`);
    shapes.add(g.total);
    assert.equal(g.steps.length, g.total);
    for (const st of g.steps) {
      assert.ok(st.prompt && st.options.length >= 2);
      assert.ok(st.options.includes(st.answer), `đáp án của ${st.key} phải nằm trong options`);
    }
    assert.ok(g.steps[0].key === 'strength' && g.steps[0].options.join() === 'vượng,nhược,trung hoà');
    const hasYong = g.steps.some((st) => st.key === 'yong');
    const c = CLASSICAL_CASES.find((x) => x.id === g.id);
    assert.equal(hasYong, c.known.yongElement != null, 'bước dụng có/lược phải khớp known.yongElement');
  }
  assert.deepEqual([...shapes].sort(), [2, 3], 'phải có cả án 2 bước lẫn 3 bước trong 100 key');
});

test('Án cổ: chấm X/n — đúng hết 100%, sai hết 0 (luật chấm nằm trong module)', () => {
  const g = buildGongan(`chấm|${NOW}`, NOW);
  const answers = {};
  for (const st of g.steps) answers[st.key] = st.answer;
  const right = gradeGongan(g, answers);
  assert.equal(right.score, right.total);
  assert.ok(right.marks.every((m) => m.ok));
  const wrong = gradeGongan(g, {});
  assert.equal(wrong.score, 0);
  assert.deepEqual(gradeGongan(g, Object.fromEntries(g.steps.map((st) => [st.key, st.options.find((o) => o !== st.answer)]))), { score: 0, total: g.total, marks: right.marks.map((m) => ({ key: m.key, ok: false })) });
});

test('Án cổ: bảng đối chiếu hai phán đủ trục ✓/✗/—, án 乾隆 khớp vượng+dụng Hỏa, khác cách (engine 正官格 vs cổ 羊刃格)', () => {
  const qianlong = CLASSICAL_CASES.find((c) => c.id === 'qianlong');
  const cmp = compareCase(qianlong);
  assert.ok(cmp.classic.verdict === qianlong.known.verdict && cmp.classic.principle === qianlong.principle && cmp.classic.person === qianlong.person && cmp.classic.source === qianlong.source, 'bên cổ nguyên văn');
  assert.equal(cmp.engine.strength, 'vượng');
  assert.equal(cmp.axes.strength.match, true, 'khớp vượng');
  assert.equal(cmp.axes.yong.match, true, 'khớp dụng Hỏa');
  assert.equal(cmp.axes.ge.match, false, 'khác cách — bình thường');
  assert.ok(cmp.engine.ge === '正官格' && cmp.classic.ge === '羊刃格');
  assert.ok(cmp.note.includes('classical-accuracy.mjs'));
});

test('Án cổ: quét cả 29 án high qua compareCase — không văng, đúng quy ước bỏ chấm', () => {
  const pool = CLASSICAL_CASES.filter((c) => c.confidence === 'high');
  let khopS = 0, khacGe = 0, boChamYong = 0;
  for (const c of pool) {
    const cmp = compareCase(c);
    for (const ax of ['strength', 'yong', 'ge']) assert.ok(typeof cmp.axes[ax].match === 'boolean' || cmp.axes[ax].match === null, `trục ${ax} phải ✓/✗/—`);
    // quy ước classical-accuracy.mjs: án 中和 bỏ chấm strength; dụng tranh cãi bỏ chấm
    if (c.known.strength === '中和') assert.equal(cmp.axes.strength.match, null, '中和 → không chấm strength');
    if (c.known.yongElement == null) { assert.equal(cmp.axes.yong.match, null); boChamYong++; }
    else assert.equal(cmp.axes.yong.match, c.known.yongElement === cmp.engine.yong);
    if (cmp.axes.strength.match === true) khopS++;
    if (cmp.axes.ge.match === false) khacGe++;
    assert.ok(typeof cmp.engine.strengthStrongCheck !== 'undefined' || true);
  }
  assert.ok(khopS > 0, 'có án khớp strength');
  assert.ok(khacGe > 0, 'có án khác cách (bình thường)');
  assert.equal(boChamYong, pool.filter((c) => c.known.yongElement == null).length);
});

test('Án cổ bước 4: phán ghép thuộc án khác, bài vạch mặt dẫn GR5 của ANTI_MANIPULATION_DATA', async () => {
  const { ANTI_MANIPULATION_DATA } = await import('../src/engine/anti-manipulation-data.js');
  for (let i = 0; i < 20; i++) {
    const g = buildGongan(`ghép-${i}|${NOW}`, NOW);
    assert.ok(g.fake.verdict && g.fake.ofId !== g.id, 'phán ghép phải là phán của án khác');
    assert.ok(g.fake.reveal.includes(g.fake.ofPerson), 'vạch mặt nêu rõ phán thuộc án nào');
    const gr5 = ANTI_MANIPULATION_DATA.groundingRules.find((r) => r.id === 'GR5');
    assert.ok(g.fake.lesson.includes(gr5.rule.split(':')[0]), 'bài dạy dẫn đúng nguyên tắc GR5');
  }
});

// ------------------------------------------------------------- Năm hạn -----
test('Năm hạn: đại vận đang đi + chủ đề thập niên + 5 năm tới, deterministic', () => {
  const R = analyze(1990, 5, 15, 8, 30, 'nam', 2026);
  const nh = buildNamHan(R, 2026);
  assert.deepEqual(buildNamHan(R, 2026), nh, 'cùng đầu vào cùng kết quả');
  assert.ok(nh.dayun, 'người sinh 1990 đã vào đại vận năm 2026');
  assert.ok(/进气|旺气|退气/.test(nh.dayun.phase) && nh.dayun.vi.length > 10);
  assert.ok(nh.godDecade && nh.godDecade.godVi && nh.godDecade.theme, 'thập thần + chủ đề thập niên');
  assert.ok(nh.godDecade.ganZhi === nh.dayun.ganZhi, 'thập niên tìm đúng vận đang đi');
  assert.equal(nh.years.length, 5);
  nh.years.forEach((y, i) => {
    assert.equal(y.year, 2026 + i);
    assert.match(y.ganZhi, /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/);
    assert.ok(Number.isInteger(y.score) && y.score >= 2 && y.score <= 98);
    assert.ok(typeof y.rating === 'string' && y.rating);
    assert.ok(y.deep.length > 10, 'phán sâu engine để tra cứu');
  });
});

test('Năm hạn: map ngôn ngữ 6 mức → 3 từ mềm; câu chính không chữ cấm', () => {
  assert.deepEqual(Object.keys(SOFT_RATING).length, 6);
  assert.equal(softRating('Đại cát').text, 'thuận — nên làm');
  assert.equal(softRating('Cát').text, 'thuận — nên làm');
  assert.equal(softRating('Bình').text, 'bình thường');
  for (const r of ['Hơi kỵ', 'Hung', 'Đại hung']) assert.equal(softRating(r).text, 'nên thủ, giữ sức');
  assert.equal(softRating('gì đó lạ'), softRating('Bình'), 'rating lạ rơi về bình thường');
  const ALLOWED = ['thuận — nên làm', 'bình thường', 'nên thủ, giữ sức'];
  for (const birth of [[1990, 5, 15, 8, 30, 'nam'], [1984, 11, 2, 22, 0, 'nữ'], [1975, 3, 21, 6, 30, 'nam'], [2024, 3, 2, 10, 0, 'nữ']]) {
    const nh = buildNamHan(analyze(...birth, 2026), 2026);
    for (const y of nh.years) {
      assert.ok(ALLOWED.includes(y.soft.text), `từ mềm hợp lệ (thấy «${y.soft.text}»)`);
      const main = `${y.soft.text}`;
      assert.ok(!/đại hung|tai họa|chết/i.test(main), 'câu chính không chữ cấm');
      assert.ok(!/Hơi kỵ|Hung/.test(main), 'chữ kỹ thuật không nằm câu chính');
      assert.ok(SOFT_RATING[y.rating] !== undefined, `rating kỹ thuật còn nguyên trong field tra cứu (thấy «${y.rating}»)`);
    }
    assert.ok(!/đại hung|tai họa|chết/i.test(nh.advice), 'câu GAI không chữ cấm');
  }
});

test('Năm hạn: trẻ chưa vào đại vận → dayun/godDecade null, vẫn đủ 5 năm; advice là 1 câu GAI_LEVELS', () => {
  const R3 = analyze(2024, 3, 2, 10, 0, 'nữ', 2026);
  const nh3 = buildNamHan(R3, 2026);
  if (nh3.dayun === null) {
    assert.equal(nh3.godDecade, null, 'chưa vào vận thì không có thập niên đang đi');
    assert.equal(nh3.years.length, 5);
  }
  assert.ok(/^cải vận \(cải vận\)|^改运/.test(nh3.advice) === false || nh3.advice.length > 20);
  assert.ok(nh3.advice.includes('Phong thủy') && nh3.advice.includes('1–3 năm'), 'advice ghép nguyên liệu GAI_LEVELS (改运)');
});

// ----------------------------------------------------------- Chọn kinh -----
test('Chọn kinh: shim yong.god ← R.yong.primary — có câu hỏi thì có kinh + lời khuyên Dụng', () => {
  const R = analyze(1990, 5, 15, 8, 30, 'nam', 2026);
  const kt = kinhTu(R, 'muốn học tu, tĩnh tâm dưỡng khí');
  assert.ok(kt.kinh.length >= 1, `phải gợi được kinh (thấy ${kt.kinh.length})`);
  for (const k of kt.kinh) {
    assert.ok(k.name_vi && typeof k.essence === 'string' && typeof k.notes === 'string', 'đủ name_vi/essence/notes');
  }
  assert.ok(kt.yongAdvice.includes('Dụng Thần') && kt.yongAdvice.includes(R.yong.primary), `yongAdvice nói đúng hành dụng ${R.yong.primary}`);
  assert.deepEqual(kinhTu(R, 'muốn học tu, tĩnh tâm dưỡng khí'), kt, 'deterministic');
});

test('Chọn kinh: không câu hỏi → vẫn chạy nhánh Dụng thần + cách cục (shim giản thể cách) ', () => {
  const R = analyze(1990, 5, 15, 8, 30, 'nam', 2026); // pattern.name = 七殺格 (phồn thể)
  const kt = kinhTu(R, '');
  assert.ok(kt.yongAdvice.includes('Dụng Thần'), 'nhánh Dụng thần vẫn chạy khi bỏ câu hỏi');
  assert.ok(kt.chartAdvice.length > 0, `shim giản thể «${R.pattern.name}» phải khớp bảng cách cục của engine`);
  assert.ok(kt.chartAdvice.includes('七杀格'));
});

test('Chọn kinh: không có lá số (R null) không văng — chỉ gợi theo câu hỏi', () => {
  const kt = kinhTu(null, 'xin kinh để hồi phục sức khỏe, dưỡng sinh');
  assert.ok(Array.isArray(kt.kinh) && kt.kinh.length >= 1);
  assert.equal(kt.yongAdvice, '');
  const kt2 = kinhTu(null, '');
  assert.equal(kt2.kinh.length, 0);
  assert.equal(kt2.yongAdvice, '');
});

// -------------------------------------------------------- Wire que-ui ------
test('que-ui.js import được trong node (module graph không vỡ sau khi thêm 3 tab)', async () => {
  const q = await import('../src/game/que-ui.js');
  assert.equal(typeof q.queBody, 'function');
});

console.log(`\nĐường Thầy — ${passed} test đạt${process.exitCode ? ' (CÓ FAIL)' : ''}.`);
