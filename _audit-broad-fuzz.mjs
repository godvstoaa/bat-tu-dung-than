// [loop 186] Broad stability fuzz — analyze() across many diverse charts.
// Catches crashes + invariant violations (wx sum, 忌∈avoid, Dụng/Hỷ∉avoid,
// synthesis range, liunian non-empty). Locks the loop 161-185 fixes broadly.
import { analyze } from './src/engine/chart.js';

let crashes = 0, issues = 0, total = 0;
const log = [];

for (let i = 0; i < 80; i++) {
  const y = 1970 + (i * 7) % 50;
  const m = 1 + (i * 5) % 12;
  const d = 1 + (i * 11) % 28;
  const h = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22][i % 12]; // 12 时辰 midpoints
  const g = i % 2 ? 'nam' : 'nữ';
  total++;
  try {
    const R = analyze(y, m, d, h, 0, g, 2026);
    const wxSum = Object.values(R.wx.pct).reduce((a, b) => a + b, 0);
    if (Math.abs(wxSum - 100) > 1) { issues++; log.push(`✗ wx pct sum ${wxSum} @ ${y}/${m}/${d} ${h}h ${g}`); }
    if (!R.yong.avoid.includes(R.yong.ji)) { issues++; log.push(`✗ 忌∉avoid @ ${y}/${m}/${d} ${h}h ${g}`); }
    if (R.yong.avoid.includes(R.yong.primary) || R.yong.avoid.includes(R.yong.xi)) { issues++; log.push(`✗ Dụng/Hỷ∈avoid @ ${y}/${m}/${d} ${h}h ${g}`); }
    if (R.synthesis.score < 0 || R.synthesis.score > 100) { issues++; log.push(`✗ synthesis ${R.synthesis.score} out of range`); }
    if (!R.liunian || !R.liunian.length) { issues++; log.push(`✗ empty liunian @ ${y}/${m}/${d} ${h}h ${g}`); }
    if (!R.dayun || !R.dayun.length) { issues++; log.push(`✗ empty dayun @ ${y}/${m}/${d} ${h}h ${g}`); }
    // [loop 177] 子时换日: hour 22 vs 23 must differ in day pillar (23 rolls)
    if (h === 22) {
      const R23 = analyze(y, m, d, 23, 0, g, 2026);
      const p22 = R.chart.pillars.day.gan + R.chart.pillars.day.zhi;
      const p23 = R23.chart.pillars.day.gan + R23.chart.pillars.day.zhi;
      if (p22 === p23) { issues++; log.push(`✗ 子时换日 not rolling @ ${y}/${m}/${d} ${g} (22h=${p22}=23h)`); }
    }
  } catch (e) { crashes++; log.push(`💥 CRASH @ ${y}/${m}/${d} ${h}h ${g}: ${e.message}`); }
}

for (const l of log) console.log('  ' + l);
console.log(`\n${'='.repeat(70)}`);
console.log(`Broad fuzz: ${total} charts · ${total - crashes} no-crash · ${issues} sanity issues`);
if (crashes === 0 && issues === 0) console.log('🎉 All charts stable + invariants hold (incl 子时换日 roll)');
process.exit((crashes + issues) > 0 ? 1 : 0);
