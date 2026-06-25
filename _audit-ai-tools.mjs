// [loop 163 audit] Exercise ALL 10 AI tools end-to-end.
// Each tool wraps engine calls in try/catch → returns {error} on ANY failure.
// An {error} = AI can't answer that question class. We surface all of them.
import { analyze } from './src/engine/chart.js';
import { execTool } from './src/engine/ai.js';

const R = analyze(1990, 5, 14, 13, 0, 'nam', 2026);

const now = new Date();
const Y = now.getFullYear(), M = now.getMonth() + 1, D = now.getDate();

const calls = [
  ['get_current_time', {}],
  ['analyze_day', { year: Y, month: M, day: D }],
  ['analyze_year', { year: 2026 }],
  ['analyze_year', { year: 2027 }],
  ['best_days_in_year', { year: 2026 }],
  ['inverse_bazi', { mode: 'max', yearStart: 2026, yearEnd: 2026, stepDays: 10 }],
  ['life_trajectory', {}],
  ['analyze_month', { year: Y, month: M }],
  ['find_good_days', { start: `${Y}-${String(M).padStart(2,'0')}-${String(D).padStart(2,'0')}`, count: 30, topN: 5 }],
  ['analyze_best_hour', { year: Y, month: M, day: D }],
  ['analyze_partner', { year: 1988, month: 11, day: 3, gender: 'nữ' }],
  ['analyze_partner', { year: 1988, month: 11, day: 3, gender: 'nữ', type: 'kinhdoanh' }],
];

let fails = 0;
const results = [];
for (const [name, args] of calls) {
  const t0 = Date.now();
  let out;
  try { out = execTool(name, args, R); }
  catch (e) { out = { error: 'THROW: ' + e.message }; }
  const ms = Date.now() - t0;
  const isError = out && typeof out === 'object' && 'error' in out;
  if (isError) fails++;
  results.push({ name, args: JSON.stringify(args), ms, isError, error: isError ? out.error : null, keys: out ? Object.keys(out).slice(0, 6).join(',') : '-' });
}

for (const r of results) {
  const mark = r.isError ? '✗' : '✓';
  console.log(`${mark} ${r.name.padEnd(20)} ${String(r.ms).padStart(5)}ms  keys=[${r.keys}]${r.isError ? '  ERR: ' + r.error : ''}`);
}

// Schema sanity: verify key tools return the fields the AI prompt promises.
const checks = [];
const assertField = (label, obj, field) => {
  const ok = obj && obj[field] != null && obj[field] !== '';
  if (!ok) fails++;
  checks.push(`${ok ? '✓' : '✗'} ${label}`);
};

const y26 = execTool('analyze_year', { year: 2026 }, R);
assertField('analyze_year.score', y26, 'score');
assertField('analyze_year.rating', y26, 'rating');
assertField('analyze_year.advice', y26, 'advice');
assertField('analyze_year.schools non-empty', y26.schools && y26.schools.length > 0 ? { x: 1 } : {}, 'x');

const dy = execTool('analyze_day', { year: Y, month: M, day: D }, R);
assertField('analyze_day.score', dy, 'score');
assertField('analyze_day.rating', dy, 'rating');

const bh = execTool('analyze_best_hour', { year: Y, month: M, day: D }, R);
assertField('analyze_best_hour.best non-empty', bh.best && bh.best.length > 0 ? { x: 1 } : {}, 'x');

const pt = execTool('analyze_partner', { year: 1988, month: 11, day: 3, gender: 'nữ' }, R);
assertField('analyze_partner.score', pt, 'score');
assertField('analyze_partner.verdict', pt, 'verdict');

// [loop 173] kinhdoanh partner tool must return non-empty roleFit (was empty before fix)
const pb = execTool('analyze_partner', { year: 1985, month: 6, day: 15, gender: 'nam', type: 'kinhdoanh' }, R);
assertField('analyze_partner.kinhdoanh roleFit', pb, 'roleFit');

for (const c of checks) console.log('  ' + c);

console.log(`\n${'='.repeat(70)}`);
console.log(`AI tools audit: ${results.length - results.filter(r => r.isError).length}/${results.length} tools OK, schema checks above`);
if (fails === 0) console.log('🎉 ALL AI tools respond without error');
process.exit(fails > 0 ? 1 : 0);
