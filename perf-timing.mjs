// ============================================================================
//  PERF TIMING — đo analyze() + buildChartBrief() cho lá số mặc định.
//  Chạy: node perf-timing.mjs   (sau khi npm run build để chắc engine build được)
// ============================================================================
import { analyze } from './src/engine/chart.js';
import { buildChartBrief } from './src/engine/ai.js';

// Lá số mặc định (đồng bộ selftest.mjs: Nam 1990-06-15 14:30, refYear 2026)
const Y = 1990, M = 6, D = 15, H = 14, MIN = 30, G = 'nam', REF = 2026;

const ns = () => process.hrtime.bigint();
const ms = (a, b) => Number(b - a) / 1e6;

// ---- Warm-up (JIT / cache lunar-javascript) ----
let _warm = analyze(Y, M, D, H, MIN, G, REF);
buildChartBrief(_warm);

// ---- Đo analyze() alone ----
const N_ANALYZE = 5;
let analyzeTotal = 0;
let analyzeMin = Infinity, analyzeMax = 0;
for (let i = 0; i < N_ANALYZE; i++) {
  const t0 = ns();
  const R = analyze(Y, M, D, H, MIN, G, REF);
  const dt = ms(t0, ns());
  analyzeTotal += dt;
  if (dt < analyzeMin) analyzeMin = dt;
  if (dt > analyzeMax) analyzeMax = dt;
  if (i === N_ANALYZE - 1) _warm = R;
}
const analyzeAvg = analyzeTotal / N_ANALYZE;

// ---- Đo buildChartBrief() alone (dùng R đã analyze) ----
const N_BRIEF = 5;
let briefTotal = 0;
let briefMin = Infinity, briefMax = 0;
for (let i = 0; i < N_BRIEF; i++) {
  const t0 = ns();
  buildChartBrief(_warm);
  const dt = ms(t0, ns());
  briefTotal += dt;
  if (dt < briefMin) briefMin = dt;
  if (dt > briefMax) briefMax = dt;
}
const briefAvg = briefTotal / N_BRIEF;

// ---- Đo analyze() + buildChartBrief() nối tiếp (full) ----
const N_FULL = 5;
let fullTotal = 0;
let fullMin = Infinity, fullMax = 0;
for (let i = 0; i < N_FULL; i++) {
  const t0 = ns();
  const R = analyze(Y, M, D, H, MIN, G, REF);
  buildChartBrief(R);
  const dt = ms(t0, ns());
  fullTotal += dt;
  if (dt < fullMin) fullMin = dt;
  if (dt > fullMax) fullMax = dt;
}
const fullAvg = fullTotal / N_FULL;

// ---- Kích thước brief ----
const briefLen = buildChartBrief(_warm).length;

console.log('==============================================================');
console.log(' PERF TIMING — lá số mặc định (Nam 1990-06-15 14:30, ref 2026)');
console.log('==============================================================');
console.log(` analyze()         : avg ${analyzeAvg.toFixed(2)} ms  (min ${analyzeMin.toFixed(2)} / max ${analyzeMax.toFixed(2)} ms, n=${N_ANALYZE})`);
console.log(` buildChartBrief() : avg ${briefAvg.toFixed(2)} ms   (min ${briefMin.toFixed(2)} / max ${briefMax.toFixed(2)} ms, n=${N_BRIEF})`);
console.log(` FULL (analyze+brief): avg ${fullAvg.toFixed(2)} ms  (min ${fullMin.toFixed(2)} / max ${fullMax.toFixed(2)} ms, n=${N_FULL})`);
console.log('--------------------------------------------------------------');
console.log(` Breakdown (full avg): analyze = ${(analyzeAvg / fullAvg * 100).toFixed(1)}%  |  brief = ${(briefAvg / fullAvg * 100).toFixed(1)}%`);
console.log(` Brief length       : ${briefLen} ký tự`);
console.log('==============================================================');
