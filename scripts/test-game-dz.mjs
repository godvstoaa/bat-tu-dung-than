// Test Án Dương Trạch (src/game/dz-case.js) — đáp án khớp engine Bát Trạch / la bàn / phi tinh của app.
import assert from 'node:assert/strict';
import { buildDzCase, gradeDz, dzTotal, PALACES, starOf, isCat } from '../src/game/dz-case.js';
import { computeZhai } from '../src/engine/zhai.js';
import { shanFromDegree } from '../src/engine/fengshui-compass.js';
import { yearFlyingStar } from '../src/engine/xuankong.js';

let n = 0;
const t = (name, fn) => { fn(); n += 1; console.log('✓', name); };
const today = new Date(2026, 10, 3);

t('Án ổn định theo hạt giống', () => {
  const a = buildDzCase('k1', today), b = buildDzCase('k1', today);
  assert.equal(a.deg, b.deg); assert.equal(a.keys.gua, b.keys.gua);
});

t('Mệnh quái khớp computeZhai (mẫu đối chiếu cổ pháp)', () => {
  assert.equal(computeZhai(1990, 'nam').guaName, '坎 (Khảm)');
  assert.equal(computeZhai(2000, 'nam').guaName, '离 (Ly)');
  for (let i = 0; i < 20; i++) {
    const cs = buildDzCase(`m${i}`, today);
    assert.equal(cs.keys.gua, computeZhai(cs.npc.year, cs.npc.gender).guaName[0]);
  }
});

t('Hướng cửa: sơn khớp shanFromDegree, không sát ranh giới', () => {
  for (let i = 0; i < 40; i++) {
    const cs = buildDzCase(`d${i}`, today);
    assert.equal(cs.keys.shan, shanFromDegree(cs.deg).han);
    assert.equal(shanFromDegree(cs.deg - 1.5).han, cs.keys.shan);
    assert.equal(shanFromDegree(cs.deg + 1.5).han, cs.keys.shan);
    assert.equal(cs.shanOpts.length, 5);
    assert.ok(cs.shanOpts.includes(cs.keys.shan));
  }
});

t('8 cung có đủ 8 sao Bát Trạch (4 cát, 4 hung)', () => {
  const cs = buildDzCase('s', today);
  const stars = PALACES.map((p) => starOf({ year: cs.npc.year, gender: cs.npc.gender }, p));
  assert.equal(new Set(stars).size, 8);
  assert.equal(stars.filter(isCat).length, 4);
});

t('Cung giường tốt nhất là cung cát (Thiên Y / Phục Vị ưu tiên)', () => {
  for (let i = 0; i < 20; i++) {
    const cs = buildDzCase(`b${i}`, today);
    for (const p of cs.keys.bed) assert.ok(isCat(cs.beds.find((b) => b.palace === p).star), `${p}`);
  }
});

t('Ngũ Hoàng khớp yearFlyingStar (2026: Nam)', () => {
  const fs = yearFlyingStar(2026);
  assert.equal(fs.pan.find((p) => p.star === 5).palace, 'Chính Nam');
  assert.equal(buildDzCase('w', today).keys.wu, 'Nam');
});

t('Chấm điểm: đúng hết = 1, sai hết thấp', () => {
  const cs = buildDzCase('g', today), K = cs.keys;
  const R = { menh: gradeDz(cs, 'menh', K.gua), cua: gradeDz(cs, 'cua', { shan: K.shan, star: K.star }), giuong: gradeDz(cs, 'giuong', K.bed[0]), nien: gradeDz(cs, 'nien', K.wu) };
  assert.equal(dzTotal(R), 1);
  const worstBed = [...cs.beds].sort((a, b) => a.score - b.score)[0].palace;
  const wrongWu = PALACES.find((p) => p !== K.wu);
  const R2 = { menh: gradeDz(cs, 'menh', '?'), cua: gradeDz(cs, 'cua', { shan: '?', star: '?' }), giuong: gradeDz(cs, 'giuong', worstBed), nien: gradeDz(cs, 'nien', wrongWu) };
  assert.ok(dzTotal(R2) < 0.1);
});

console.log(`\n${n} test đạt`);
