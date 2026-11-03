// Test lõi Giải Án (src/game/cases.js) + ghi tiến trình (state.js). Chạy: node scripts/test-game-cases.mjs
import assert from 'node:assert/strict';
import * as C from '../src/game/cases.js';
import * as S from '../src/game/state.js';
import { WX_VI } from '../src/engine/constants.js';

let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log('✓', name); } catch (e) { console.error('✗', name, '\n ', e.stack.split('\n').slice(0, 3).join('\n ')); process.exitCode = 1; } };

test('Khách sinh theo hạt giống: cùng khoá → cùng khách', () => {
  assert.deepEqual(C.makeNpc('2026-11-03:0:abc', 2026), C.makeNpc('2026-11-03:0:abc', 2026));
  assert.notDeepEqual(C.makeNpc('2026-11-03:0:abc', 2026), C.makeNpc('2026-11-03:1:abc', 2026));
});

let built = [];
test('100 khách ngẫu nhiên đều dựng được án với đáp án hợp lệ', () => {
  for (let i = 0; i < 100; i++) {
    const n = C.makeNpc(`k${i}`, 2026);
    assert.ok(n.age >= 18 && n.age <= 73, 'tuổi');
    if (n.topic === 'study') assert.ok(n.age <= 30, `${n.age} tuổi mà đi thi`);
    if (n.topic === 'love') assert.ok(n.age <= 42, `${n.age} tuổi hỏi cưới`);
    const cs = C.buildCase(n, 2026);
    assert.equal(cs.tiles.length, 11);
    for (const p of Object.values(cs.pillars)) for (const ch of p) assert.ok(cs.tiles.includes(ch), 'thẻ đủ chữ đúng');
    assert.ok(C.WX.includes(cs.keys.yong.primary), 'dụng thần hợp lệ');
    assert.ok(['vuong', 'nhuoc', 'trung'].includes(cs.keys.strength.verdict));
    assert.equal(cs.keys.timing.years.length, 6, 'đủ 6 năm để chọn');
    assert.equal(cs.keys.timing.years[0].year, 2026, 'bắt đầu từ năm nay');
    assert.ok(cs.keys.advice.good.length >= 1);
    built.push(cs);
  }
});

test('Trả lời đúng hết → 100%; sai hết → thấp', () => {
  for (const cs of built.slice(0, 30)) {
    const K = cs.keys;
    const best = K.timing.years.find((x) => x.score === K.timing.best).year;
    const right = {
      pillars: C.gradePillars(K.pillars, K.pillars),
      wx: C.gradeWx(K.wx, { strong: K.wx.strong, weak: K.wx.weak }),
      strength: C.gradeStrength(K.strength, { verdict: K.strength.verdict, lenh: K.strength.lenh, dia: K.strength.dia, the: K.strength.the }),
      yong: C.gradeYong(K.yong, K.yong.primary),
      timing: C.gradeTiming(K.timing, best),
      advice: C.gradeAdvice(K.advice, K.advice.good.slice(0, 2)),
    };
    assert.equal(Math.round(C.totalScore(right) * 100), 100, JSON.stringify(Object.fromEntries(Object.entries(right).map(([k, v]) => [k, v.score]))));
    const badEl = C.WX.find((e) => e !== K.yong.primary && e !== K.yong.secondary);
    const wrong = {
      pillars: C.gradePillars(K.pillars, {}),
      strength: C.gradeStrength(K.strength, { verdict: K.strength.verdict === 'vuong' ? 'nhuoc' : 'vuong', lenh: !K.strength.lenh, dia: !K.strength.dia, the: !K.strength.the }),
      yong: C.gradeYong(K.yong, badEl),
      advice: C.gradeAdvice(K.advice, K.advice.bad.slice(0, 2)),
    };
    assert.ok(C.totalScore(wrong) < 0.2);
  }
});

test('Gợi ý trừ điểm lập trụ; điểm từng phần', () => {
  const K = built[0].keys.pillars;
  assert.equal(C.gradePillars(K, K, 2).score.toFixed(2), '0.70');
  const half = { year: K.year, month: K.month };
  assert.equal(C.gradePillars(K, half).score, 0.5);
});

test('Dụng thần phụ được nửa điểm', () => {
  const cs = built.find((x) => x.keys.yong.secondary);
  assert.equal(C.gradeYong(cs.keys.yong, cs.keys.yong.secondary).score, 0.5);
});

test('Trích dẫn kinh điển có mặt ở phần lớn án', () => {
  const withQt = built.filter((x) => x.cite.yong).length;
  assert.ok(withQt >= 90, `chỉ ${withQt}/100 có trích Cùng Thông`);
});

test('Án Cổ: dựng được, đáp án theo sách, cách cục có tên Việt', () => {
  const list = C.classicalList();
  assert.ok(list.length >= 30, `có ${list.length} án`);
  for (const c of list) {
    const a = C.buildClassical(c.id);
    assert.ok(a.steps.length >= 1, c.id);
    if (a.keys.ge) { assert.ok(C.GE_VI[a.keys.ge], `thiếu tên Việt cho ${a.keys.ge}`); assert.equal(a.keys.geOpts.length, 4); assert.ok(a.keys.geOpts.includes(a.keys.ge)); }
    if (a.steps.includes('yong')) assert.ok(WX_VI[a.keys.yong.primary]);
  }
  const q = C.buildClassical('qianlong');
  assert.equal(C.gradeClassicalStrength(q.keys.strength, 'vuong').score, 1);
  assert.equal(C.gradeYong(q.keys.yong, '火').score, 1);
});

test('Ghi án: thưởng tối đa 3 khách/ngày, khe đã giải không thưởng lại; Án Cổ thưởng lần đầu ≥ 60%', () => {
  const s = S.createState();
  const now = new Date('2026-11-03T10:00:00');
  assert.equal(S.recordCase(s, { kind: 'npc', slot: 0, total: 1 }, now), 15);
  assert.equal(S.recordCase(s, { kind: 'npc', slot: 0, total: 1 }, now), 0);
  assert.equal(S.recordCase(s, { kind: 'npc', slot: 1, total: 0.5 }, now), 8);
  assert.ok(S.caseDone(s, 1, now));
  assert.ok(!S.caseDone(s, 1, new Date('2026-11-04T10:00:00')));
  assert.equal(S.recordCase(s, { kind: 'classical', id: 'qianlong', total: 0.4 }, now), 0);
  assert.equal(S.recordCase(s, { kind: 'classical', id: 'qianlong', total: 0.8 }, now), 25);
  assert.equal(S.recordCase(s, { kind: 'classical', id: 'qianlong', total: 1 }, now), 0);
});

test('Lưu rồi đọc lại giữ đủ kỹ năng, Án Cổ, nhật ký án (hồi quy)', () => {
  const m = new Map(); const st = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) };
  const s = S.createState(); s.player = { name: 'x' };
  S.recordCase(s, { kind: 'npc', slot: 0, total: 0.5, name: 'A', mastery: C.addMastery({}, { yong: { score: 1 } }) });
  S.recordCase(s, { kind: 'classical', id: 'qianlong', total: 1, name: 'B' });
  S.saveState(s, st);
  const r = S.loadState(st);
  assert.equal(r.mastery.yong.avg, 1);
  assert.equal(r.classical.qianlong, 1);
  assert.equal(r.caseLog.length, 2);
  assert.deepEqual(r.daily.cases, [0]);
});

test('Kỹ năng tu học: trung bình động', () => {
  let m = C.addMastery({}, { yong: { score: 1 } });
  m = C.addMastery(m, { yong: { score: 0 } });
  assert.equal(m.yong.avg, 0.5); assert.equal(m.yong.n, 2);
});

console.log(`\n${passed} test đạt${process.exitCode ? ' — CÓ LỖI' : ''}`);
