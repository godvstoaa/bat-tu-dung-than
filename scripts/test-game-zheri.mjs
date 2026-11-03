// Test Án Trạch Nhật (src/game/zheri-case.js) — đáp án khớp engine zheri của app.
import assert from 'node:assert/strict';
import { buildZheriCase, gradeZheri, zheriTotal, birthZhi, CHONG, officerTable } from '../src/game/zheri-case.js';
import { evaluateDate } from '../src/engine/zheri.js';

let n = 0;
const t = (name, fn) => { fn(); n += 1; console.log('✓', name); };
const today = new Date(2026, 10, 3);

t('Chi năm sinh theo Lập Xuân', () => {
  assert.equal(birthZhi(1990, 5, 15), '午');
  assert.equal(birthZhi(1990, 1, 20), '巳'); // trước Lập Xuân 1990 → năm Kỷ Tỵ
});

t('Án ổn định theo hạt giống', () => {
  const a = buildZheriCase('2026-11-03:p1', today), b = buildZheriCase('2026-11-03:p1', today);
  assert.deepEqual(a.days.map((d) => d.ymd), b.days.map((d) => d.ymd));
  assert.equal(a.job, b.job);
});

t('5 ngày ứng viên, tăng dần, sau hôm nay ≥ 3 ngày', () => {
  for (let i = 0; i < 30; i++) {
    const cs = buildZheriCase(`k${i}`, today);
    assert.equal(cs.days.length, 5);
    const ymd = cs.days.map((d) => d.ymd);
    assert.deepEqual([...ymd].sort(), ymd);
    assert.ok(ymd[0] >= '2026-11-06');
  }
});

t('Đáp án khớp engine evaluateDate', () => {
  for (let i = 0; i < 30; i++) {
    const cs = buildZheriCase(`e${i}`, today);
    for (const d of cs.days) {
      const [y, m, dd] = d.ymd.split('-').map(Number);
      const ev = evaluateDate(y, m, dd, cs.job, cs.zhi);
      assert.equal(ev.score, d.ev.score);
      assert.equal(cs.keys.xung.includes(d.ymd), ev.dayZhi === CHONG[cs.zhi]);
    }
    const top = Math.max(...cs.days.map((d) => d.ev.score));
    for (const b of cs.keys.best) assert.equal(cs.days.find((d) => d.ymd === b).ev.score, top);
  }
});

t('Ngày tốt nhất của cả 21 ngày luôn có mặt', () => {
  const cs = buildZheriCase('best', today);
  assert.ok(cs.keys.best.length >= 1);
});

t('Chấm điểm: đúng hết = 1, sai hết thấp', () => {
  const cs = buildZheriCase('g1', today);
  const R = { xung: gradeZheri(cs, 'xung', cs.keys.xung), truc: gradeZheri(cs, 'truc', cs.keys.truc), pick: gradeZheri(cs, 'pick', cs.keys.best[0]) };
  assert.equal(zheriTotal(R), 1);
  const worst = [...cs.days].sort((a, b) => a.ev.score - b.ev.score)[0].ymd;
  const wrongTruc = cs.days.map((d) => d.ymd).filter((y) => !cs.keys.truc.includes(y));
  const R2 = { xung: gradeZheri(cs, 'xung', cs.days.map((d) => d.ymd).filter((y) => !cs.keys.xung.includes(y))), truc: gradeZheri(cs, 'truc', wrongTruc), pick: gradeZheri(cs, 'pick', worst) };
  assert.ok(zheriTotal(R2) < 0.35, `tổng ${zheriTotal(R2)}`);
});

t('Bảng 12 trực: Kiến trùng chi tháng', () => {
  const tb = officerTable('寅');
  assert.deepEqual(tb[0], ['建', '寅']);
  assert.deepEqual(tb[11], ['闭', '丑']);
});

t('Trực trong án khớp bảng tra từ chi tháng', () => {
  for (let i = 0; i < 20; i++) {
    const cs = buildZheriCase(`o${i}`, today);
    for (const d of cs.days) {
      const row = officerTable(d.monthZhi).find(([, z]) => z === d.dayGanZhi[1]);
      assert.equal(row[0], d.ev.officer, `${d.ymd} tháng ${d.monthZhi}`);
    }
  }
});

console.log(`\n${n} test đạt`);
