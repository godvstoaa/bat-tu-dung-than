// Test Vận Mệnh Các (src/game/vanmenh.js) + Thái Tuế Điện (src/game/thaitue.js, state.js › lightLamp)
import assert from 'node:assert/strict';
import { Solar } from 'lunar-javascript';
import { analyze } from '../src/engine/chart.js';
import { vanMenh, VAN_GATES } from '../src/game/vanmenh.js';
import { thaiTue, suiYear, TAISUI_60 } from '../src/game/thaitue.js';
import { taiSuiGeneral } from '../src/engine/taisui-general.js';
import * as S from '../src/game/state.js';

let n = 0;
const t = (name, fn) => { fn(); n += 1; console.log('✓', name); };

t('Vận Mệnh: 9 cổng nối tiếp mỗi cổng 10 năm, cổng hiện tại đúng năm', () => {
  const R = analyze(1990, 5, 15, 8, 30, 'nam', 2026);
  const V = vanMenh(R, 2026);
  assert.equal(V.gates.length, VAN_GATES);
  V.gates.forEach((g, i) => {
    assert.equal(g.endYear - g.startYear, 9);
    if (i) assert.equal(g.startYear, V.gates[i - 1].startYear + 10, 'đại vận phải nối liền');
    assert.match(g.ganZhi, /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/);
    assert.ok(g.ganGod && g.zhiGod && g.theme && g.stage, `cổng ${i} thiếu dữ liệu`);
  });
  const c = V.gates[V.current];
  assert.ok(c && 2026 >= c.startYear && 2026 <= c.endYear, 'cổng hiện tại phải chứa năm 2026');
  assert.ok(V.phase && V.phase.paragraphs.length, 'có tường thuật giai đoạn hiện tại');
  assert.ok(V.summary.length > 20);
});

t('Vận Mệnh: trẻ chưa vào đại vận đầu → current = −1, childhood', () => {
  const R = analyze(2024, 3, 2, 10, 0, 'nữ', 2026);
  const V = vanMenh(R, 2026);
  if (2026 < V.gates[0].startYear) { assert.equal(V.current, -1); assert.equal(V.childhood, true); assert.equal(V.phase, null); }
});

t('Vận Mệnh: mốc đỉnh vận / dè chừng gắn đúng cổng', () => {
  const R = analyze(1990, 5, 15, 8, 30, 'nam', 2026);
  const V = vanMenh(R, 2026);
  const marks = V.gates.flatMap((g) => g.marks.map((m) => m.kind));
  for (const k of marks) assert.ok(['golden', 'caution', 'fuyin', 'fanyin'].includes(k));
});

t('Thái Tuế: 2026 丙午 = Văn Triết; trước Lập Xuân 2026 vẫn là 乙巳', () => {
  const a = thaiTue('午', 1990, new Date(2026, 5, 1));
  assert.equal(a.year, 2026); assert.equal(a.ganZhi, '丙午'); assert.equal(a.nameShort, '文哲');
  assert.equal(a.direction, 'Nam');
  const b = suiYear(new Date(2026, 0, 20));
  assert.equal(b.gz, '乙巳'); assert.equal(b.year, 2025);
  assert.equal(TAISUI_60.length, 60);
});

t('Thái Tuế: tuổi Ngọ năm Ngọ phạm Trị (nặng), tuổi Tý xung, tuổi Dần an', () => {
  const d = new Date(2026, 5, 1);
  const ngo = thaiTue('午', 1990, d).me; assert.equal(ngo.offends, true); assert.equal(ngo.level, 'nặng'); assert.ok(ngo.types.some((x) => x.key === 'zhi'));
  const ty = thaiTue('子', 1984, d).me; assert.ok(ty.types.some((x) => x.key === 'chong'));
  assert.equal(thaiTue('寅', 1986, d).me.offends, false);
  assert.equal(thaiTue('寅', 1986, d).table.length, 12);
});

t('Thái Tuế: suiYear giữ giờ/phút thật — đổi năm đúng giây Lập Xuân, không ép 12:00', () => {
  // LX 2026 = 04:02:08 (giờ thư viện). suiYear đưa giờ/phút thật của Date vào thư viện nên
  // các mốc trước/sau LX trong cùng ngày phải khác năm can chi.
  const lx = Solar.fromYmd(2026, 2, 4).getLunar().getJieQiTable()['立春'];
  assert.ok(lx.getHour() >= 1, 'giờ LX phải ≥ 1 để chọn được mốc trước LX trong cùng ngày');
  const before = suiYear(new Date(2026, 1, 4, lx.getHour() - 1, 59));
  const after = suiYear(new Date(2026, 1, 4, lx.getHour(), Math.min(lx.getMinute() + 1, 59)));
  assert.equal(before.gz, '乙巳'); assert.equal(before.year, 2025, 'trước giờ LX vẫn là năm cũ');
  assert.equal(after.gz, '丙午'); assert.equal(after.year, 2026, 'đúng giờ LX đã sang năm mới');
});

t('Thái Tuế: bản mệnh theo chi năm lá số — sinh trước Lập Xuân vẫn đúng năm chi cũ', () => {
  const d = new Date(2026, 5, 1);
  // sinh 1990-01-15 (trước LX 1990): chi bản mệnh là 巳 (1989 己巳), không phải 午 của đầu năm dương lịch 1990
  const a = thaiTue('巳', 1990, d);
  assert.equal(a.natal.ganZhi, '己巳', 'natal phải theo chi lá số, lùi về năm chi cũ');
  const b = thaiTue('午', 1990, d); // sinh sau LX: chi trùng đầu năm dương lịch → giữ nguyên
  assert.equal(b.natal.ganZhi, taiSuiGeneral(1990).ganZhi);
});

t('Vận Mệnh: đã qua cổng đại vận 9 vẫn có tường thuật giai đoạn', () => {
  const R = analyze(1930, 1, 10, 8, 30, 'nam', 2026); // 96 tuổi — đã qua cổng 9 (cổng cuối kết năm 2020)
  const V = vanMenh(R, 2026);
  const last = V.gates[V.gates.length - 1];
  assert.ok(2026 > last.endYear, 'tiền đề: đã qua cổng cuối');
  assert.equal(V.current, -1);
  assert.equal(V.childhood, false);
  assert.ok(V.phase && V.phase.paragraphs.length >= 1, 'sau cổng 9 vẫn phải có tường thuật');
  // sống quá cả đại vận cuối của engine (R.dayun cạn) → đúng nhánh «đã qua đại vận cuối» trong phase-narrative
  const R2 = analyze(1900, 1, 10, 8, 30, 'nam', 2026);
  const V2 = vanMenh(R2, 2026);
  assert.equal(V2.current, -1);
  assert.ok(V2.phase && V2.phase.paragraphs.some((p) => /đã qua đại vận cuối/.test(p)), 'nội dung đúng nhánh qua cổng cuối');
});

t('Đèn an Thái Tuế: lần đầu +10, mỗi ngày thêm dầu +3, một lần/ngày, sang năm thắp lại', () => {
  const s = S.createState(new Date(2026, 5, 1));
  const d1 = new Date(2026, 5, 1, 9), d1b = new Date(2026, 5, 1, 20), d2 = new Date(2026, 5, 2, 9);
  assert.equal(S.lightLamp(s, 2026, d1), 10);
  assert.equal(S.lightLamp(s, 2026, d1b), 0);
  assert.equal(S.lightLamp(s, 2026, d2), 3);
  assert.deepEqual(S.lampState(s, 2026, d2), { lit: true, days: 2, today: true });
  assert.equal(S.lampState(s, 2027, d2).lit, false);
  assert.equal(S.lightLamp(s, 2027, new Date(2027, 2, 1)), 10);
  assert.equal(s.xp, 23);
  // lưu / đọc lại giữ ngọn đèn (hydrate chỉ giữ field có trong khung mặc định)
  const mem = new Map(); const storage = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) };
  S.saveState(s, storage);
  const back = S.loadState(storage, new Date(2027, 2, 1));
  assert.deepEqual(back.thaitue, { year: 2027, day: '2027-03-01', days: 1 });
});

console.log(`\n${n} test đạt`);
