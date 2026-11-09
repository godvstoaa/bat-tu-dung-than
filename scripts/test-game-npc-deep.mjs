// Test bước «Năm nay» cho 4 sảnh nghề (src/game/npc-deep.js) — hàm thuần npcDeep(R, nowYear).
// Luật map rating 6 mức của engine (liunian-pro.js:304-309) → 3 lựa chọn; nhãn mềm
// GAME-HUYEN-QUAN-SPEC.md §11 mục 3 (:354). Chạy: node scripts/test-game-npc-deep.mjs
import assert from 'node:assert/strict';
import { npcDeep, TONE_OF } from '../src/game/npc-deep.js';
import { analyzeLiunianDeep } from '../src/engine/liunian-pro.js';
import { GAI_LEVELS } from '../src/engine/remedy-fate.js';
import { analyze } from '../src/engine/chart.js';
import { makeNpc } from '../src/game/npc.js';
import { HALL_BUILD, gradeStep, totalOf } from '../src/game/halls.js';

let n = 0;
const t = (name, fn) => { fn(); n += 1; console.log('✓', name); };
const YEAR = 2026;
const today = new Date(YEAR, 10, 3);
// Lá số NPC — cùng công thức npcR ở halls.js:26 (analyze với năm tham chiếu hiện tại)
const R_of = (npc) => analyze(npc.year, npc.month, npc.day, npc.hour, npc.minute, npc.gender, YEAR);
// Luật map 6 → 3 viết lại độc lập trong test (không mượn TONE_OF để chấm chính nó)
const EXPECT = (rating) => (['Đại cát', 'Cát'].includes(rating) ? 'thuan' : rating === 'Bình' ? 'binh' : ['Hơi kỵ', 'Hung', 'Đại hung'].includes(rating) ? 'giu' : null);
const SOFT_LABELS = ['Thuận — nên làm', 'Bình thường', 'Nên thủ, giữ sức'];
const BANNED = /đại hung|đại hạn|tai hoạ|tai họa|chết/i;

t('Luật map rating 6 mức → 3 lựa chọn, khớp analyzeLiunianDeep trên 40 khách', () => {
  assert.equal(TONE_OF['Đại cát'], 'thuan'); assert.equal(TONE_OF['Cát'], 'thuan');
  assert.equal(TONE_OF['Bình'], 'binh');
  assert.equal(TONE_OF['Hơi kỵ'], 'giu'); assert.equal(TONE_OF['Hung'], 'giu'); assert.equal(TONE_OF['Đại hung'], 'giu');
  for (let i = 0; i < 40; i++) {
    const R = R_of(makeNpc(`nd:${i}`, YEAR));
    const deep = analyzeLiunianDeep(R, YEAR);
    const nd = npcDeep(R, YEAR);
    assert.equal(EXPECT(deep.rating) !== null, true, `rating lạ: ${deep.rating}`);
    assert.equal(nd.answer, EXPECT(deep.rating), `khách ${i}: rating ${deep.rating}`);
    assert.deepEqual(nd.options.map(([v]) => v), ['thuan', 'binh', 'giu']);
    assert.equal(nd.kind, 'one');
    assert.ok(!Array.isArray(nd.answer), `khách ${i}`);
  }
});

t('Thang order: đúng = 1, kề = 0,4, xa 2 bậc = 0', () => {
  assert.deepEqual(npcDeep(R_of(makeNpc('nd:o', YEAR)), YEAR).order, ['thuan', 'binh', 'giu']);
  const st = { kind: 'one', answer: 'binh', order: ['thuan', 'binh', 'giu'] };
  assert.equal(gradeStep(st, 'binh'), 1);
  assert.equal(gradeStep(st, 'thuan'), 0.4); assert.equal(gradeStep(st, 'giu'), 0.4);
  assert.equal(gradeStep({ ...st, answer: 'thuan' }, 'binh'), 0.4); // hai đầu kề nhau qua giữa
  assert.equal(gradeStep({ ...st, answer: 'giu' }, 'binh'), 0.4);
  assert.equal(gradeStep({ ...st, answer: 'thuan' }, 'giu'), 0);
});

t('Nhãn mềm §11 mục 3: đúng 3 câu, không chữ doạ (cả explain)', () => {
  for (let i = 0; i < 15; i++) {
    const R = R_of(makeNpc(`nd:soft:${i}`, YEAR));
    const nd = npcDeep(R, YEAR);
    assert.deepEqual(nd.options.map(([, l]) => l), SOFT_LABELS);
    assert.ok(!BANNED.test(nd.options.map(([, l]) => l).join(' ')), `khách ${i} nhãn`);
    assert.ok(!BANNED.test(nd.explain), `khách ${i} explain`);
    assert.ok(nd.explain.length >= 20, `khách ${i} explain rỗng`);
  }
});

t('explain = trường phái đầu (phái + note) + 1 câu GAI (GAI_LEVELS tầng 改运)', () => {
  for (let i = 0; i < 10; i++) {
    const R = R_of(makeNpc(`nd:exp:${i}`, YEAR));
    const deep = analyzeLiunianDeep(R, YEAR);
    const nd = npcDeep(R, YEAR);
    const l0 = deep.schools[0];
    assert.ok(nd.explain.startsWith(`${l0.phai}: `), `khách ${i}: ${nd.explain.slice(0, 40)}`);
    assert.ok(nd.explain.includes(String(l0.note || '').trim()), `khách ${i}: thiếu note`);
    assert.ok(nd.explain.includes(GAI_LEVELS[0].lv), `khách ${i}: thiếu câu GAI`);
  }
});

t('Hàm thuần: cùng R + cùng năm → cùng bước (ổn định theo hạt giống)', () => {
  const R = R_of(makeNpc('nd:det', YEAR));
  assert.deepEqual(npcDeep(R, YEAR), npcDeep(R, YEAR));
  assert.notDeepEqual(npcDeep(R, YEAR), npcDeep(R, YEAR - 1)); // năm khác → phán khác (ít nhất trường giải thích)
});

t('4 sảnh có khách thêm đúng 1 bước cuối «Năm nay»; Thư Viện + Hợp Hôn không đụng', () => {
  for (const id of ['dieuhau', 'tuvi', 'tuongphap', 'cachcuc']) {
    for (let i = 0; i < 12; i++) {
      const cs = HALL_BUILD[id](`n${i}`, today);
      const last = cs.steps[cs.steps.length - 1];
      assert.equal(last.key, 'liunian', `${id}/${i}`);
      assert.equal(last.title, 'Năm nay', id);
      assert.equal(last.prompt, 'Năm nay của khách thế nào?', id);
      assert.equal(last.answer, npcDeep(cs.R, YEAR).answer, `${id}/${i}: đáp án lệch với lá số cs.R`);
      assert.equal(cs.steps.filter((s) => s.key === 'liunian').length, 1, id);
    }
  }
  const tv = HALL_BUILD.thuvien('n0');
  assert.equal(tv.steps.length, 5); // giữ nguyên 5 câu — assert cũ test-game-halls.mjs:47
  assert.ok(tv.steps.every((s) => s.key !== 'liunian'), 'Thư Viện không thêm bước');
  const hh = HALL_BUILD.hophon('2026-11-03', today);
  assert.equal(hh.steps.length, 4);
  assert.ok(hh.steps.every((s) => s.key !== 'liunian'), 'Hợp Hôn không thêm bước');
});

t('Chấm tổng sảnh: đủ đúng = 1; lệch 1 bậc ở bước cuối = 1 − 0,6/n (kề thang 0,4)', () => {
  const cs = HALL_BUILD.tuongphap('n0', today);
  assert.equal(cs.steps.length, 5); // 4 bước cũ + Năm nay
  const all = Object.fromEntries(cs.steps.map((s) => [s.key, gradeStep(s, s.answer)]));
  assert.equal(totalOf(cs, all), 1);
  const near = { ...all };
  const last = cs.steps[cs.steps.length - 1];
  const idx = last.order.indexOf(last.answer);
  near[last.key] = gradeStep(last, last.order[idx === 0 ? idx + 1 : idx - 1]);
  assert.ok(Math.abs(totalOf(cs, near) - (1 - 0.6 / cs.steps.length)) < 1e-9);
});

console.log(`\n${n} test đạt`);
