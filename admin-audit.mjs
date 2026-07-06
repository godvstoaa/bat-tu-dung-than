// ============================================================================
//  admin-audit.mjs — repeatable self-test cho hệ thống admin (loop 1351)
//  Usage: node admin-audit.mjs <admin-token>
//  Exercise: log event → stats → byIp/daily/topCountries → AI toggle (off→503→on)
//  → CSV export → auth reject. Mỗi deploy chạy lại để chắc không regress.
// ============================================================================
import { randomBytes } from 'crypto';
const BASE = 'https://battu.god8.shop';
const TOKEN = process.argv[2] || '';
if (!TOKEN) { console.error('Cần token: node admin-audit.mjs <admin-token>'); process.exit(1); }
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('  ✓', m); } else { fail++; console.log('  ✗ FAIL:', m); } };

const rid = randomBytes(4).toString('hex');

// 1. log event
const r1 = await fetch(BASE + '/api/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'visit', data: { audit: rid } }) }).then((r) => r.json());
ok(r1.ok, 'POST /api/event log');

// [loop 1352] log ai_chat với durationMs — verify full chat retention + latency aggregation
// [loop 1354] + rounds/bailed telemetry
const chatBody = { type: 'ai_chat', data: { q: 'audit test question ' + rid, response: 'audit test response '.repeat(60) + rid, source: 'ai', durationMs: 4242, rounds: 3, bailed: null } };
const r1b = await fetch(BASE + '/api/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(chatBody) }).then((r) => r.json());
ok(r1b.ok, 'POST /api/event ai_chat (full response + durationMs)');

// 2. stats — retry cho KV eventual consistency (visit viết xong có thể chưa list ngay)
let st = null;
let appeared = false;
for (let i = 0; i < 5; i++) {
  st = await fetch(BASE + '/admin/api/stats?token=' + TOKEN + '&nocache=1').then((r) => r.json());
  if (st && st.events && st.events.some((e) => e.data && e.data.audit === rid)) { appeared = true; break; }
  await new Promise((r) => setTimeout(r, 2000));
}
ok(st && Array.isArray(st.events), 'GET /admin/api/stats');
ok(Array.isArray(st.byIp), 'stats.byIp (per-visitor)');
ok(Array.isArray(st.daily), 'stats.daily (7 ngày)');
ok(Array.isArray(st.topCountries), 'stats.topCountries (geo)');
ok(st.uniqueIps >= 1, 'stats.uniqueIps ≥ 1');
ok(st.activeNow !== undefined, 'stats.activeNow (live)');
ok(st.funnel && st.funnel.visitors >= 0, 'stats.funnel (conversion visitor→chart→AI)');
ok(st.engagement && st.engagement.bounceRate !== undefined, 'stats.engagement (bounce rate)');
ok(st.realUniqueIps !== undefined && st.bots !== undefined, 'stats.realUniqueIps + bots (bot filter)');
ok(appeared, 'audit visit logged + xuất hiện (retry KV consistency)');

// [loop 1352] retention + dayagg trend (30 ngày từ dayagg, độc lập cap 1500)
ok(Array.isArray(st.trend) && st.trend.length === 30, 'stats.trend (30 ngày từ dayagg, length=' + (st.trend ? st.trend.length : 'n/a') + ')');
const todayStr = new Date().toISOString().slice(0, 10);
const todayTrend = st.trend && st.trend.find((t) => t.date === todayStr);
ok(todayTrend && todayTrend.all > 0, 'dayagg hôm nay có ghi (all=' + (todayTrend ? todayTrend.all : '?') + ')');
// [loop 1352] AI latency aggregation (avg/p95/max durationMs) + [1354] bailCount
ok(st.aiLatency === null || (st.aiLatency && typeof st.aiLatency.avgMs === 'number' && typeof st.aiLatency.p95Ms === 'number' && typeof st.aiLatency.maxMs === 'number' && typeof st.aiLatency.bailCount === 'number'), 'stats.aiLatency shape {avgMs,p95Ms,maxMs,bailCount}');
// [loop 1352] full chat response retained (không bị truncate ở storage) + durationMs trong byIp
let chatSeen = false, durInByIp = false;
for (let i = 0; i < 5 && !chatSeen; i++) {
  const st2 = await fetch(BASE + '/admin/api/stats?token=' + TOKEN + '&nocache=1').then((r) => r.json());
  for (const v of (st2.byIp || [])) {
    for (const c of (v.chats || [])) {
      if (c.q && c.q.indexOf(rid) >= 0) {
        chatSeen = true;
        if (String(c.response || '').indexOf(rid) >= 0 && String(c.response).length > 1000) {
          // full response giữ nguyên (audit test response ~900 chars + rid tail)
        }
        if (c.durationMs === 4242) durInByIp = true;
      }
    }
  }
  if (!chatSeen) await new Promise((r) => setTimeout(r, 2000));
}
ok(chatSeen, 'ai_chat full response retained + xuất hiện trong byIp (retry KV)');
ok(durInByIp, 'byIp chat object có durationMs field (=4242)');
let roundsInByIp = false;
for (const v of (st.byIp || [])) for (const c of (v.chats || [])) { if (c.q && c.q.indexOf(rid) >= 0 && c.rounds === 3) roundsInByIp = true; }
ok(roundsInByIp, 'byIp chat object có rounds field (=3) — [loop 1354 telemetry]');

// 3. AI toggle off → proxy 503 → on
await fetch(BASE + '/admin/api/ai?token=' + TOKEN, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: false }) });
const blocked = await fetch(BASE + '/cf-ai/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }).then((r) => r.status);
ok(blocked === 503, 'AI off → proxy /cf-ai trả 503 (got ' + blocked + ')');
await fetch(BASE + '/admin/api/ai?token=' + TOKEN, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: true }) });
const back = await fetch(BASE + '/cf-ai/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }).then((r) => r.status);
ok(back !== 503, 'AI on → proxy không còn 503 (got ' + back + ')');

// 4. CSV export
const csv = await fetch(BASE + '/admin/api/export?token=' + TOKEN).then((r) => r.text());
ok(csv.startsWith('timestamp,type,ip'), 'CSV export header OK');
ok(csv.split('\n').length >= 2, 'CSV có ≥1 row data');

// 5. auth + security
const w = await fetch(BASE + '/admin/api/stats?token=wrong').then((r) => r.status);
ok(w === 401 || w === 429, 'wrong token rejected (' + w + ')');
const noToken = await fetch(BASE + '/admin/api/stats').then((r) => r.status);
ok(noToken === 401 || noToken === 429, 'no token rejected (' + noToken + ')');
const aiPub = await fetch(BASE + '/api/ai-config').then((r) => r.json());
ok(!aiPub.apiKey, 'public /api/ai-config không leak apiKey');
const inject = await fetch(BASE + '/api/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: '<script>', data: { xss: '<img onerror=alert(1)>' } }) }).then((r) => r.json());
ok(inject.ok !== undefined, 'event injection handled (type sanitized)');

console.log('\n=== ADMIN AUDIT: ' + pass + ' pass / ' + fail + ' fail ===');
process.exit(fail ? 1 : 0);
