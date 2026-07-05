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

// 2. stats — retry cho KV eventual consistency (visit viết xong có thể chưa list ngay)
let st = null;
let appeared = false;
for (let i = 0; i < 5; i++) {
  st = await fetch(BASE + '/admin/api/stats?token=' + TOKEN).then((r) => r.json());
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

// 5. auth
const w = await fetch(BASE + '/admin/api/stats?token=wrong').then((r) => r.status);
ok(w === 401 || w === 429, 'wrong token rejected (' + w + ')');

console.log('\n=== ADMIN AUDIT: ' + pass + ' pass / ' + fail + ' fail ===');
process.exit(fail ? 1 : 0);
