// brain-coverage-retro.mjs — đo Brain Coverage trên TOÀN BỘ câu trả lời AI đã log
// (mỗi câu: match chart cùng IP → analyze → brainThink(question) → coverage vs response)
import fs from 'fs';
import { analyze } from '../src/engine/chart.js';
import { think as brainThink } from '../src/brain/brain.js';
import { measureBrainCoverage } from '../src/engine/brain-coverage.js';

const events = JSON.parse(fs.readFileSync(new URL('./events.json', import.meta.url), 'utf8'));

// charts theo IP (để suy ngày sinh cho từng câu hỏi)
const charts = events.filter((e) => e.type === 'chart' && e.data && e.data.dob).sort((a, b) => a.ts - b.ts);
function nearestChart(ip, ts) {
  let best = null;
  for (const c of charts) { if (c.ip !== ip) continue; if (c.ts > ts) break; best = c; }
  return best;
}
function parseDob(dob) { const m = String(dob).match(/(\d{4})-(\d{1,2})-(\d{1,2})/); return m ? { y: +m[1], mo: +m[2], d: +m[3] } : null; }

const chats = events.filter((e) => e.type === 'ai_chat' && e.data && e.data.source === 'ai' && e.data.q && e.data.response);
console.log(`Câu AI phân tích: ${chats.length}`);

let done = 0, skipped = 0;
const covs = [];
const perTopic = {};
const missedAll = {};
const lowCoverage = [];

for (const chat of chats) {
  const chart = nearestChart(chat.ip, chat.ts);
  if (!chart || !chart.data || !chart.data.dob) { skipped++; continue; }
  const dob = parseDob(chart.data.dob);
  if (!dob) { skipped++; continue; }
  const t = String(chart.data.time || '').match(/(\d{1,2}):(\d{2})/);
  let R;
  try { R = analyze(dob.y, dob.mo, dob.d, t ? +t[1] : 12, t ? +t[2] : 0, chart.data.gender === 'nữ' ? 'nữ' : 'nam'); } catch (e) { skipped++; continue; }
  const q = String(chat.data.q || '');
  let brain;
  try { brain = brainThink(q, R.chart, R, chart.data.gender === 'nữ' ? 'nữ' : 'nam'); } catch (e) { skipped++; continue; }
  if (!brain || brain.length < 30) { skipped++; continue; }
  const cov = measureBrainCoverage(String(chat.data.response).slice(0, 8000), brain);
  if (cov.coverage == null || cov.nodesTotal === 0) { skipped++; continue; }
  done++;
  covs.push({ ts: chat.ts, coverage: cov.coverage, nodesTotal: cov.nodesTotal, q: q.slice(0, 60) });
  perTopic[cov.topic] = perTopic[cov.topic] || { n: 0, sum: 0 };
  perTopic[cov.topic].n++; perTopic[cov.topic].sum += cov.coverage;
  (cov.missed || []).forEach((m) => { missedAll[m.label] = (missedAll[m.label] || 0) + 1; });
  if (cov.coverage <= 33) lowCoverage.push({ ts: chat.ts, cov: cov.coverage, total: cov.nodesTotal, q: q.slice(0, 70) });
}

console.log('\n════════ KẾT QUẢ BRAIN COVERAGE (khả năng tổng hợp theo sơ đồ não) ════════');
console.log(`Đo được: ${done} / ${chats.length} câu (bỏ ${skipped} — không suy được lá số hoặc câu không có nút não)`);
if (done) {
  const avg = Math.round(covs.reduce((a, b) => a + b.coverage, 0) / covs.length);
  const hi = covs.filter((c) => c.coverage >= 60).length;
  const mid = covs.filter((c) => c.coverage > 33 && c.coverage < 60).length;
  const lo = covs.filter((c) => c.coverage <= 33).length;
  console.log(`\nCoverage trung bình: ${avg}%`);
  console.log(`Phân bố: ≥60% (tổng hợp tốt) = ${hi} (${Math.round(hi / done * 100)}%) | 34-59% = ${mid} | ≤33% (bỏ sót nhiều) = ${lo} (${Math.round(lo / done * 100)}%)`);
  console.log(`\nCoverage theo CHỦ ĐỀ câu hỏi:`);
  Object.entries(perTopic).sort((a, b) => b[1].n - a[1].n).forEach(([t, v]) => console.log(`  ${t}: ${v.n} câu · avg ${Math.round(v.sum / v.n)}%`));
  console.log(`\n🔴 NÚT NÃO BỊ BỎ SÓT NHIỀU NHẤT (tổng hợp chưng cất tiếp):`);
  Object.entries(missedAll).sort((a, b) => b[1] - a[1]).slice(0, 12).forEach(([k, v]) => console.log(`  ${k}: bỏ ${v} lần`));
  console.log(`\n⚠ Các câu coverage ≤33% (gần nhất):`);
  lowCoverage.sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 8).forEach((r) => console.log(`  [${new Date(r.ts).toISOString().slice(0, 16)}] ${r.cov}% (${r.total} nút) · «${r.q}…»`));
}
fs.writeFileSync(new URL('./brain-cov-raw.json', import.meta.url), JSON.stringify({ done, covs, missedAll, lowCoverage }, null, 2));
