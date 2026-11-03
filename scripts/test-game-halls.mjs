// Test sảnh nghề (src/game/halls.js) — đáp án do engine app tính, luôn nằm trong lựa chọn.
import assert from 'node:assert/strict';
import { HALL_BUILD, gradeStep, totalOf, hehunTags, quoteBank, buildHopHon, buildCachCuc, buildTuVi, buildDieuHau } from '../src/game/halls.js';
import { analyzeHanNuan } from '../src/engine/han-nuan.js';
import { computeZiwei } from '../src/engine/ziwei.js';

let n = 0;
const t = (name, fn) => { fn(); n += 1; console.log('✓', name); };
const today = new Date(2026, 10, 3);

t('Mọi sảnh: đáp án nằm trong lựa chọn, dựng ổn định theo hạt giống', () => {
  for (const [id, build] of Object.entries(HALL_BUILD)) {
    for (let i = 0; i < 12; i++) {
      const a = build(`k${i}`, today), b = build(`k${i}`, today);
      assert.deepEqual(a.steps.map((s) => s.answer), b.steps.map((s) => s.answer), id);
      for (const s of a.steps) {
        const vals = s.options.map(([v]) => v);
        for (const x of [].concat(s.answer)) assert.ok(vals.includes(x), `${id}/${s.key}: ${x} không có trong lựa chọn`);
        if (s.kind === 'one') assert.ok(!Array.isArray(s.answer), `${id}/${s.key}`);
      }
    }
  }
});

t('Chấm chung: đúng = 1, kề thang = 0,4, chọn nhiều Jaccard', () => {
  const one = { kind: 'one', answer: 'b', order: ['a', 'b', 'c'] };
  assert.equal(gradeStep(one, 'b'), 1); assert.equal(gradeStep(one, 'a'), 0.4); assert.equal(gradeStep({ ...one, answer: 'a' }, 'c'), 0);
  const many = { kind: 'many', answer: ['x', 'y'] };
  assert.equal(gradeStep(many, ['x', 'y']), 1); assert.equal(gradeStep(many, ['x']), 0.5); assert.equal(gradeStep({ kind: 'many', answer: [] }, []), 1);
  const cs = HALL_BUILD.tuvi('g', today);
  const all = Object.fromEntries(cs.steps.map((s) => [s.key, gradeStep(s, s.answer)]));
  assert.equal(totalOf(cs, all), 1);
});

t('Điều Hậu khớp analyzeHanNuan', () => {
  for (let i = 0; i < 10; i++) {
    const cs = buildDieuHau(`d${i}`, today);
    const hn = analyzeHanNuan(cs.R);
    assert.equal(cs.steps[0].answer, hn.temperature); assert.equal(cs.steps[1].answer, hn.humidity);
  }
});

t('Thư Viện: kho câu cổ thư đủ lớn, không trùng nghĩa trong một câu hỏi', () => {
  const bank = quoteBank();
  assert.ok(bank.length >= 30, `chỉ ${bank.length} câu`);
  const cs = HALL_BUILD.thuvien('x');
  assert.equal(cs.steps.length, 5);
  for (const s of cs.steps) assert.equal(new Set(s.options.map(([, l]) => l)).size, 4);
});

t('Hợp Hôn: án chung theo ngày (cùng ngày = cùng cặp), nam–nữ, tuổi gần', () => {
  const a = buildHopHon('2026-11-03', today), b = buildHopHon('2026-11-03', today);
  assert.equal(a.npc.year, b.npc.year); assert.equal(a.partner.year, b.partner.year);
  for (let i = 0; i < 15; i++) {
    const c = buildHopHon(`2026-11-${i}`, today);
    assert.equal(c.npc.gender, 'nam'); assert.equal(c.partner.gender, 'nữ');
    assert.ok(Math.abs(c.npc.year - c.partner.year) <= 4);
    const tg = hehunTags(c.hh);
    assert.ok(tg.cung.length >= 1);
  }
});

t('Tử Vi khớp computeZiwei', () => {
  for (let i = 0; i < 10; i++) {
    const cs = buildTuVi(`z${i}`, today);
    const Z = computeZiwei(cs.npc.year, cs.npc.month, cs.npc.day, cs.npc.hour, cs.npc.minute, cs.npc.gender);
    assert.equal(cs.steps[0].answer, Z.mingGong[1]); assert.equal(cs.steps[1].answer, String(Z.ju));
  }
});

t('Cách Cục: chỉ chọn lá số chính cách, có tương thần + kỵ thần', () => {
  for (let i = 0; i < 10; i++) {
    const cs = buildCachCuc(`c${i}`, today);
    assert.equal(cs.R.pattern.type, 'normal');
    assert.ok(cs.steps[2].answer.length >= 1);
  }
});

// Vị trí sảnh ngoài thế giới: đất phẳng, trên mặt nước, không trùng sơn môn vùng, có sân trống
{
  const T = await import('../src/game/terrain.js');
  const { HALLS } = await import('../src/game/world.js');
  const gates = ['tubinh', 'manh', 'trichthien', 'cungthong'].map((id) => { const p = T.REGIONS.find((r) => r.id === id); const k = Math.hypot(p.x, p.z); return { x: p.x - (p.x / k) * p.r * 1.05, z: p.z - (p.z / k) * p.r * 1.05 }; });
  for (const h of HALLS) {
    const { x, z } = h.world;
    assert.ok(T.slopeAt(x, z) < 0.3, `${h.id} dốc ${T.slopeAt(x, z)}`);
    assert.ok(T.heightAt(x, z) > T.WATER + 2, `${h.id} dưới nước`);
    for (const g of gates) assert.ok(Math.hypot(x - g.x, z - g.z) > 40, `${h.id} trùng sơn môn`);
    assert.ok(h.region === 'thanh' || T.CLEARINGS.some((c) => Math.hypot(c.x - x, c.z - z) < 1), `${h.id} thiếu sân trống`);
  }
  n += 1; console.log('✓ Vị trí sảnh hợp lệ (dốc, nước, sơn môn, sân trống)');
}

console.log(`\n${n} test đạt`);
