// ============================================================================
//  worker/admin.js — Admin analytics + AI kill-switch (loop 1351)
//  - POST /api/event  → log visit/chart/ai_question (public, captures IP/geo)
//  - GET  /admin?token=X → dashboard HTML (auth via ADMIN_TOKEN secret)
//  - GET  /admin/api/stats → JSON {aiEnabled, totals, uniqueIps, events}
//  - POST /admin/api/ai {enabled:bool} → toggle AI global
//  - isAiEnabled(env) → KV 'ai:enabled' (default true)
//  Storage: ADMIN_KV. Dashboard dùng DOM/textContent (XSS-safe — user data escape tự động).
// ============================================================================
const TTL_EVENT = 60 * 60 * 24 * 90; // 90 ngày

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,X-Admin-Token', ...extra },
  });
}
function clientIP(request) {
  return request.headers.get('CF-Connecting-IP')
    || (request.headers.get('X-Forwarded-For') || '').split(',')[0].trim()
    || 'unknown';
}

export async function isAiEnabled(env) {
  if (!env.ADMIN_KV) return true;
  const v = await env.ADMIN_KV.get('ai:enabled');
  return v === null || v === '1' || v === 'true';
}

async function logEvent(env, request, type, data) {
  if (!env.ADMIN_KV) return true;
  const ip = clientIP(request);
  // [loop 1351] rate-limit: max 30 events/phút/IP (anti-spam flood KV). KV approx (eventual-consistent).
  const rlKey = 'rl:' + ip + ':' + Math.floor(Date.now() / 60000);
  const rlCount = parseInt((await env.ADMIN_KV.get(rlKey)) || '0', 10);
  if (rlCount >= 30) return false; // rate-limited → silent drop
  await env.ADMIN_KV.put(rlKey, String(rlCount + 1), { expirationTtl: 120 });
  const ua = (request.headers.get('User-Agent') || '').slice(0, 200);
  const country = (request.cf && request.cf.country) || '';
  const city = (request.cf && request.cf.city) || '';
  const ts = Date.now();
  // [loop 1351 perf] store trong 1 KV key (JSON array, cap 100) — tránh 100+ KV gets trong stats
  const logRaw = await env.ADMIN_KV.get('events:log');
  let log = [];
  try { log = logRaw ? JSON.parse(logRaw) : []; } catch (e) {}
  log.unshift({ ts, type, ip, ua, country, city, data: data || {} });
  if (log.length > 100) log.length = 100;
  await env.ADMIN_KV.put('events:log', JSON.stringify(log));
  const day = new Date(ts).toISOString().slice(0, 10);
  for (const k of [`cnt:${type}`, 'cnt:all', `daily:${day}:${type}`]) {
    const cur = parseInt((await env.ADMIN_KV.get(k)) || '0', 10);
    await env.ADMIN_KV.put(k, String(cur + 1));
  }
  // [loop 1351] Telegram alert cho chart/ai_question/error (fire-and-forget, không block)
  if (type === 'chart' || type === 'ai_question' || type === 'error') {
    notifyTelegram(env, { ts, type, ip, ua, country, city, data: data || {} }).catch(function () {});
  }
  return true;
}

// [loop 1351] Telegram notification — admin nhận alert ngay khi user lập lá số / hỏi AI
async function notifyTelegram(env, event) {
  if (!env.ADMIN_KV) return;
  const token = await env.ADMIN_KV.get('notify:tg_token');
  const chatId = await env.ADMIN_KV.get('notify:tg_chat');
  if (!token || !chatId) return;
  var msg = '🔔 <b>' + event.type + '</b>\n';
  msg += '🌍 ' + (event.country || '?') + (event.city ? ' / ' + event.city : '') + '\n';
  msg += '🌐 ' + event.ip + '\n';
  if (event.type === 'chart' && event.data) msg += '📊 Lá số: ' + (event.data.dob || '?') + ' ' + (event.data.gender || '') + '\n';
  if (event.type === 'ai_question' && event.data) msg += '💬 Hỏi: ' + String(event.data.q || '').slice(0, 200) + '\n';
  if (event.type === 'error' && event.data) msg += '⚠ Lỗi: ' + String(event.data.msg || '').slice(0, 200) + '\n';
  msg += '⏰ ' + new Date(event.ts).toLocaleString('vi-VN');
  try {
    await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'HTML' }),
    });
  } catch (e) {}
}

async function adminNotifyConfig(env, request) {
  const body = await request.json().catch(() => ({}));
  if (body.tg_token) await env.ADMIN_KV.put('notify:tg_token', String(body.tg_token));
  if (body.tg_chat) await env.ADMIN_KV.put('notify:tg_chat', String(body.tg_chat));
  if (body.disable) { await env.ADMIN_KV.delete('notify:tg_token'); await env.ADMIN_KV.delete('notify:tg_chat'); }
  const token = await env.ADMIN_KV.get('notify:tg_token');
  return json({ ok: true, enabled: !!token });
}

// [loop 1351] AI config — admin kiểm soát sâu AI (mode/endpoint/apiKey/model)
async function adminAiConfigSet(env, request) {
  const body = await request.json().catch(() => ({}));
  const config = {};
  if (body.mode) config.mode = String(body.mode); // 'off' | 'free' | 'custom'
  if (body.endpoint) config.endpoint = String(body.endpoint);
  if (body.apiKey) config.apiKey = String(body.apiKey);
  if (body.model) config.model = String(body.model);
  if (body.disable) { await env.ADMIN_KV.delete('ai:config'); return json({ ok: true, config: { mode: 'free' } }); }
  // merge với config cũ
  let old = {};
  try { old = JSON.parse((await env.ADMIN_KV.get('ai:config')) || '{}'); } catch (e) {}
  const merged = Object.assign({}, old, config);
  await env.ADMIN_KV.put('ai:config', JSON.stringify(merged));
  // nếu mode='off' → cũng set ai:enabled=0 (kill-switch cũ tương thích)
  if (merged.mode === 'off') await env.ADMIN_KV.put('ai:enabled', '0');
  else await env.ADMIN_KV.put('ai:enabled', '1');
  return json({ ok: true, config: Object.assign({}, merged, { apiKey: merged.apiKey ? '***' + merged.apiKey.slice(-4) : '' }) });
}

async function adminAiConfigGet(env) {
  let config = {};
  try { config = JSON.parse((await env.ADMIN_KV.get('ai:config')) || '{}'); } catch (e) {}
  const masked = Object.assign({}, config, { apiKey: config.apiKey ? '***' + config.apiKey.slice(-4) : '' });
  return json({ config: masked });
}

export async function handleAdminRoute(request, env, url) {
  const path = url.pathname;
  const method = request.method;
  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,X-Admin-Token' } });

  if (path === '/api/event' && method === 'POST') {
    try {
      const body = await request.json();
      const type = ['visit', 'chart', 'ai_question', 'ai_chat', 'error'].includes(body && body.type) ? body.type : 'other';
      const ok = await logEvent(env, request, type, body && body.data);
      return json(ok ? { ok: true } : { ok: false, err: 'rate_limited (max 30/phút/IP)' }, ok ? 200 : 429);
    } catch (e) { return json({ ok: false, err: e.message }, 400); }
  }

  // [loop 1351] GET /api/ai-config (public) — frontend biết AI config admin đặt
  if (path === '/api/ai-config' && method === 'GET') {
    let config = {};
    try { const raw = env.ADMIN_KV ? await env.ADMIN_KV.get('ai:config') : null; config = raw ? JSON.parse(raw) : {}; } catch (e) {}
    return json({ mode: config.mode || 'free', endpoint: config.endpoint || '', hasKey: !!config.apiKey, model: config.model || '' });
  }

  if (path === '/admin' || path.startsWith('/admin/')) {
    // POST /admin/setup {token} — one-time self-service (chỉ khi chưa đặt token). Ưu tiên wrangler
    //   secret env.ADMIN_TOKEN nếu có; KHÔNG thì KV admin:token. Tránh cần wrangler secret put.
    if (path === '/admin/setup' && method === 'POST') {
      const existing = env.ADMIN_TOKEN || (env.ADMIN_KV && await env.ADMIN_KV.get('admin:token'));
      if (existing) return json({ ok: false, err: 'Token đã đặt rồi — dùng /admin?token=<token>' }, 403);
      const body = await request.json().catch(() => ({}));
      const t = body && body.token && String(body.token).length >= 8 ? String(body.token) : null;
      if (!t) return json({ ok: false, err: 'Cần body {token: "..."} độ dài ≥ 8 ký tự' }, 400);
      if (env.ADMIN_KV) await env.ADMIN_KV.put('admin:token', t);
      return json({ ok: true, msg: 'Đã đặt. Mở /admin?token=<token>' });
    }
    const token = url.searchParams.get('token') || request.headers.get('X-Admin-Token') || '';
    const expected = env.ADMIN_TOKEN || (env.ADMIN_KV && await env.ADMIN_KV.get('admin:token')) || '';
    if (!expected) return json({ ok: false, err: 'Chưa đặt token admin. POST /admin/setup {token:"<chọn-≥8-ký-tự>"} để tạo (chỉ lần đầu).', needSetup: true }, 401);
    if (token !== expected) {
      // [loop 1351] rate-limit failed auth (chống brute-force token): 10 fail / 5ph / IP
      const fk = 'fail:' + clientIP(request);
      const fc = parseInt((env.ADMIN_KV && await env.ADMIN_KV.get(fk)) || '0', 10);
      if (fc >= 10) return new Response('Too many failed attempts — thử lại sau 5 phút', { status: 429 });
      if (env.ADMIN_KV) await env.ADMIN_KV.put(fk, String(fc + 1), { expirationTtl: 300 });
      return new Response('Unauthorized', { status: 401 });
    }
    if (path === '/admin' || path === '/admin/') return adminDashboard();
    if (path === '/admin/api/stats') { try { return await adminStats(env, url); } catch (e) { return json({ error: e.message }, 500); } }
    if (path === '/admin/api/ai' && method === 'POST') return adminToggleAi(env, request);
    if (path === '/admin/api/token' && method === 'POST') return adminChangeToken(env, request);
    if (path === '/admin/api/export' && method === 'GET') return adminExport(env);
    if (path === '/admin/api/notify' && method === 'POST') return adminNotifyConfig(env, request);
    if (path === '/admin/api/ai-config' && method === 'POST') return adminAiConfigSet(env, request);
    if (path === '/admin/api/ai-config' && method === 'GET') { try { return await adminAiConfigGet(env); } catch (e) { return json({ error: e.message }, 500); } }
    return new Response('Not found', { status: 404 });
  }
  return null;
}

async function adminStats(env, url) {
  const nocache = url && url.searchParams.get('nocache');
  if (!nocache && env.ADMIN_KV) { const cached = await env.ADMIN_KV.get('cache:stats'); if (cached) { try { return json(JSON.parse(cached)); } catch (e) {} } }
  const ai = await isAiEnabled(env);
  const logRaw = env.ADMIN_KV ? await env.ADMIN_KV.get('events:log') : null;
  let events = [];
  try { events = logRaw ? JSON.parse(logRaw) : []; } catch (e) {}
  const get = async (k) => parseInt((await env.ADMIN_KV.get(k)) || '0', 10);
  const totals = { visit: await get('cnt:visit'), chart: await get('cnt:chart'), ai_question: await get('cnt:ai_question'), ai_chat: await get('cnt:ai_chat'), error: await get('cnt:error'), all: await get('cnt:all') };
  const ips = new Set(events.map((e) => e.ip));
  // [loop 1351] byIp — group events theo visitor (đúng nhu cầu «người nào xem gì hỏi gì»)
  const byIp = {};
  for (const e of events) {
    const ip = e.ip || '?';
    if (!byIp[ip]) byIp[ip] = { ip, country: e.country || '', city: e.city || '', ua: (e.ua || '').slice(0, 80), count: 0, visits: 0, charts: [], questions: [], firstTs: e.ts, lastTs: 0 };
    const g = byIp[ip];
    g.count++;
    if (e.type === 'visit') g.visits++;
    else if (e.type === 'chart') g.charts.push(e.data || {});
    else if (e.type === 'ai_question') g.questions.push((e.data && e.data.q) || '');
    if (e.ts > g.lastTs) g.lastTs = e.ts;
    if (e.ts < g.firstTs) g.firstTs = e.ts;
  }
  const byIpArr = Object.values(byIp).sort((a, b) => b.lastTs - a.lastTs);
  // [loop 1351] top countries (geo distribution)
  const ctry = {};
  for (const e of events) { const c = e.country || '?'; ctry[c] = (ctry[c] || 0) + 1; }
  const topCountries = Object.entries(ctry).map(([c, n]) => ({ country: c, count: n })).sort((a, b) => b.count - a.count);
  // top AI questions (insight mối quan tâm user)
  const qmap = {};
  for (const e of events) { if (e.type === 'ai_question' && e.data && e.data.q) { const q = String(e.data.q).slice(0, 80); qmap[q] = (qmap[q] || 0) + 1; } }
  const topQuestions = Object.entries(qmap).map(([q, n]) => ({ q, count: n })).sort((a, b) => b.count - a.count).slice(0, 10);
  // [loop 1351] top referrers — nguồn traffic (FB/Google/direct)
  const refmap = {};
  for (const e of events) {
    if (e.type === 'visit' && e.data) {
      var ref = e.data.ref || '';
      try { ref = new URL(ref).hostname.replace(/^www\./, ''); } catch (_) { ref = ref ? ref.slice(0, 50) : '(direct)'; }
      ref = ref || '(direct)';
      refmap[ref] = (refmap[ref] || 0) + 1;
    }
  }
  const topReferrers = Object.entries(refmap).map(([r, n]) => ({ referrer: r, count: n })).sort((a, b) => b.count - a.count).slice(0, 10);
  // [loop 1351] device breakdown
  const devCount = { iPhone: 0, Android: 0, Windows: 0, Mac: 0, iPad: 0, other: 0 };
  for (const e of events) {
    const ua = (e.ua || '').toLowerCase();
    if (/iphone/.test(ua)) devCount.iPhone++;
    else if (/ipad/.test(ua)) devCount.iPad++;
    else if (/android/.test(ua)) devCount.Android++;
    else if (/windows/.test(ua)) devCount.Windows++;
    else if (/mac/.test(ua)) devCount.Mac++;
    else devCount.other++;
  }
  const devices = Object.entries(devCount).filter(([, n]) => n > 0).map(([d, n]) => ({ device: d, count: n })).sort((a, b) => b.count - a.count);
  // [loop 1351] session tracking — group events per IP (gap >30min = new session)
  const ipTs = {};
  for (const e of events) { const ip = e.ip || '?'; if (!ipTs[ip]) ipTs[ip] = []; ipTs[ip].push(e.ts); }
  let totalSessions = 0; const dur = [];
  for (const ip of Object.keys(ipTs)) {
    const arr = ipTs[ip].sort((a, b) => a - b);
    let start = arr[0], prev = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] - prev > 30 * 60 * 1000) { totalSessions++; dur.push(prev - start); start = arr[i]; }
      prev = arr[i];
    }
    totalSessions++; dur.push(prev - start);
  }
  const avgSessionMin = dur.length ? Math.round(dur.reduce((a, b) => a + b, 0) / dur.length / 60000) : 0;
  // [loop 1351 perf] daily — tính TỪ events (0 KV gets thêm)
  const dailyMap = {};
  for (let i = 6; i >= 0; i--) { const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10); dailyMap[d] = { date: d, visit: 0, chart: 0, ai_question: 0 }; }
  for (const e of events) { const d = new Date(e.ts).toISOString().slice(0, 10); if (dailyMap[d]) { if (e.type === 'visit') dailyMap[d].visit++; else if (e.type === 'chart') dailyMap[d].chart++; else if (e.type === 'ai_question') dailyMap[d].ai_question++; } }
  const daily = Object.values(dailyMap);
  // [loop 1351] conversion funnel: visitor → chart → AI question (% engagement)
  const funnel = {
    visitors: byIpArr.length,
    chartUsers: byIpArr.filter((v) => v.charts.length > 0).length,
    aiUsers: byIpArr.filter((v) => v.questions.length > 0).length,
  };
  // [loop 1351] engagement: bounce rate (% visitor chỉ 1 event rồi đi) + avg events
  const bounceCount = byIpArr.filter((v) => v.count <= 1).length;
  const loadTimes = events.filter((e) => e.type === 'visit' && e.data && e.data.loadMs).map((e) => e.data.loadMs);
  const avgLoadMs = loadTimes.length ? Math.round(loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length) : 0;
  const engagement = {
    bounceRate: byIpArr.length ? Math.round((bounceCount / byIpArr.length) * 100) : 0,
    avgEvents: byIpArr.length ? (events.length / byIpArr.length).toFixed(1) : '0',
    avgCharts: byIpArr.length ? (totals.chart / byIpArr.length).toFixed(1) : '0',
    avgLoadMs: avgLoadMs,
    sessions: totalSessions,
    avgSessionMin: avgSessionMin,
  };
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  const activeNow = new Set(events.filter((e) => e.ts > fiveMinAgo).map((e) => e.ip)).size;
  const BOT_RE = /bot|crawl|spider|facebookexternalhit|googleweblight|preview|semrush|ahrefs|dataforseo|pingdom|uptime/i;
  let botCount = 0; const realIps = new Set();
  for (const e of events) { if (BOT_RE.test(e.ua || '')) botCount++; else if (e.ip) realIps.add(e.ip); }
  const result = { aiEnabled: ai, totals, uniqueIps: ips.size, realUniqueIps: realIps.size, bots: botCount, activeNow, funnel, engagement, events, byIp: byIpArr, daily, topCountries, topQuestions, topReferrers, devices };
  if (env.ADMIN_KV) await env.ADMIN_KV.put('cache:stats', JSON.stringify(result), { expirationTtl: 60 });
  return json(result);
}

async function adminToggleAi(env, request) {
  const body = await request.json().catch(() => ({}));
  const enabled = body && body.enabled ? '1' : '0';
  await env.ADMIN_KV.put('ai:enabled', enabled);
  return json({ ok: true, aiEnabled: enabled === '1' });
}

async function adminChangeToken(env, request) {
  const body = await request.json().catch(() => ({}));
  const t = body && body.new && String(body.new).length >= 8 ? String(body.new) : null;
  if (!t) return json({ ok: false, err: 'Cần body {new: "..."} độ dài ≥ 8 ký tự' }, 400);
  if (env.ADMIN_KV) await env.ADMIN_KV.put('admin:token', t);
  return json({ ok: true, msg: 'Token đã đổi. Dùng /admin?token=<new>' });
}

async function adminExport(env) {
  if (!env.ADMIN_KV) return new Response('no store', { status: 500 });
  const logRaw = await env.ADMIN_KV.get('events:log');
  let events = [];
  try { events = logRaw ? JSON.parse(logRaw) : []; } catch (e) {}
  const esc = (s) => '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"';
  const rows = [['timestamp', 'type', 'ip', 'country', 'city', 'ua', 'data'].join(',')];
  for (const e of events) {
    rows.push([new Date(e.ts).toISOString(), e.type, e.ip, e.country || '', e.city || '', e.ua || '', JSON.stringify(e.data || {})].map(esc).join(','));
  }
  return new Response(rows.join('\n'), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="batu-events.csv"' } });
}

function adminDashboard() {
  // Dashboard JS dùng DOM createElement + textContent (KHÔNG innerHTML → XSS-safe,
  //   user data — IP/AI-question — được escape tự động bởi textContent).
  return new Response(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin — Bát Tự</title><style>
  body{background:#0a0913;color:#e8d9b0;font-family:system-ui,sans-serif;margin:0;padding:20px;line-height:1.5}
  h1{color:#d4af37;margin:0 0 8px} h3{color:#d4af37;margin-top:24px}
  table{width:100%;border-collapse:collapse;font-size:12.5px}
  th,td{padding:6px 8px;border-bottom:1px solid rgba(212,175,55,.15);text-align:left;vertical-align:top}
  th{color:#d4af37} .ip{font-family:monospace;color:#7fbf7f} .tiny{color:#9a8a6a;font-size:11px}
  .btn{padding:9px 18px;border:1px solid #d4af37;background:rgba(212,175,55,.12);color:#d4af37;border-radius:6px;cursor:pointer;font-size:14px;font-weight:600}
  .btn:hover{background:rgba(212,175,55,.22)} .btn.off{border-color:#c0392b;color:#c0392b;background:rgba(192,57,43,.12)}
  .stat{display:inline-block;padding:10px 18px;margin:4px;background:rgba(212,175,55,.06);border:1px solid rgba(212,175,55,.2);border-radius:8px;min-width:90px}
  .stat b{display:block;font-size:26px;color:#d4af37;line-height:1.1}
  .stat span{font-size:11px;color:#9a8a6a}
  .filter{padding:5px 10px;background:rgba(0,0,0,.3);border:1px solid rgba(212,175,55,.2);color:#e8d9b0;border-radius:4px}
  .badge{display:inline-block;padding:1px 6px;border-radius:3px;font-size:10px;font-weight:700}
  .b-visit{background:rgba(127,191,127,.2);color:#7fbf7f}.b-chart{background:rgba(212,175,55,.2);color:#d4af37}.b-ai_question{background:rgba(180,120,200,.2);color:#b478c8}.b-other{background:rgba(150,150,150,.2);color:#aaa}.b-error{background:rgba(192,57,43,.25);color:#e0533d}
  </style></head><body>
  <h1>🛡️ Admin — Bát Tự Dụng Thần</h1>
  <div id="status">Đang tải…</div>
  <div id="controls" style="margin:12px 0"></div>
  <div id="funnel" style="margin:8px 0 16px"></div>
  <details style="margin:8px 0"><summary style="cursor:pointer;color:#d4af37;font-size:13px">📱 Telegram Alert — nhận thông báo khi user lập lá số/hỏi AI</summary>
  <div style="padding:8px;background:rgba(0,0,0,.2);border-radius:8px;margin-top:4px">
  <input class="filter" id="tg-token" placeholder="Bot Token (123:ABC...)" style="width:100%;margin:3px 0;box-sizing:border-box">
  <input class="filter" id="tg-chat" placeholder="Chat ID" style="width:60%;box-sizing:border-box">
  <button class="btn" style="padding:4px 10px;font-size:12px" onclick="tgSave()">Bật Alert</button>
  <button class="btn" style="padding:4px 10px;font-size:12px" onclick="tgOff()">Tắt</button>
  <p class="tiny">Tạo bot: @BotFather → /newbot → lấy token. Chat ID: gửi tin cho bot rồi vào /getUpdates.</p>
  </div></details>
  <h3>Sự kiện gần đây <select class="filter" id="ftype" onchange="load()"><option value="">Tất cả</option><option value="visit">visit</option><option value="chart">chart</option><option value="ai_question">ai_question</option></select> <input class="filter" id="sq" placeholder="🔍 tìm IP / câu hỏi" oninput="var q=this.value.toLowerCase();document.querySelectorAll('#events tr').forEach(function(tr){tr.style.display=!q||tr.textContent.toLowerCase().indexOf(q)>=0?'':'none'})"> <button class="btn" style="padding:5px 12px;font-size:12px" onclick="load()">↻</button></h3>
  <table><thead><tr><th>Thời gian</th><th>Loại</th><th>IP</th><th>Địa lý</th><th>Dữ liệu</th></tr></thead><tbody id="events"></tbody></table>
  <h3>Theo visitor (IP) <span class="tiny">— mỗi IP: visit count, charts xem, câu hỏi AI</span></h3>
  <div id="byip"></div>
  <h3>Hoạt động 7 ngày</h3>
  <div id="daily"></div>
  <h3>Top câu hỏi AI & quốc gia</h3>
  <div id="topq" style="display:flex;gap:24px;flex-wrap:wrap"></div>
  <script>
  const TOKEN = new URLSearchParams(location.search).get('token');
  const H = { 'X-Admin-Token': TOKEN };
  function el(tag, cls, txt){ const e=document.createElement(tag); if(cls) e.className=cls; if(txt!=null) e.textContent=txt; return e; }
  function statBlock(val, label, accent){ const s=el('span','stat'); const b=el('b'); b.textContent=val; if(accent) b.style.color=accent; s.appendChild(b); s.appendChild(el('span',null,label)); return s; }
  async function load(){
    const r = await fetch('/admin/api/stats', { headers: H });
    if (!r.ok) { document.getElementById('status').textContent='Lỗi '+r.status; return; }
    const d = await r.json();
    const st=document.getElementById('status'); st.textContent='';
    st.appendChild(statBlock(d.totals.visit,'visits'));
    st.appendChild(statBlock(d.totals.chart,'lá số'));
    st.appendChild(statBlock(d.totals.ai_question,'AI hỏi'));
    if (d.totals.error) st.appendChild(statBlock(d.totals.error, '⚠ lỗi JS', '#e0533d'));
    st.appendChild(statBlock(d.realUniqueIps||d.uniqueIps,'IP thật'+((d.bots||0)>0?' (bot:'+d.bots+')':'')));
    st.appendChild(statBlock(d.activeNow||0,'🔴 active now', (d.activeNow||0)>0?'#7fbf7f':'#666'));
    if (d.engagement) { st.appendChild(statBlock(d.engagement.bounceRate+'%','bounce', d.engagement.bounceRate>60?'#c0392b':'#7fbf7f')); st.appendChild(statBlock(d.engagement.avgEvents,'events/IP')); if (d.engagement.avgLoadMs) st.appendChild(statBlock(d.engagement.avgLoadMs+'ms','⏱ load', d.engagement.avgLoadMs>3000?'#c0392b':'#7fbf7f')); st.appendChild(statBlock(d.engagement.sessions||0,'sessions')); st.appendChild(statBlock((d.engagement.avgSessionMin||0)+'min','⏱/sess')); }
    st.appendChild(statBlock(d.aiEnabled?'BẬT':'TẮT','AI mode', d.aiEnabled?'#7fbf7f':'#c0392b'));
    const c=document.getElementById('controls'); c.textContent='';
    // [loop 1351] conversion funnel
    const fn=document.getElementById('funnel'); if (fn && d.funnel) { fn.textContent='';
      var denom=d.funnel.visitors||1;
      [['👥 Visit',d.funnel.visitors],['📊 Lập lá số',d.funnel.chartUsers],['💬 Hỏi AI',d.funnel.aiUsers]].forEach(function(it){
        var row=el('div'); row.style.cssText='display:flex;align-items:center;gap:8px;margin:2px 0;font-size:12px';
        row.appendChild(el('span','tiny',it[0]));
        var bar=el('div'); bar.style.cssText='height:16px;border-radius:3px;background:#d4af37;min-width:4px;width:'+Math.round(it[1]/denom*200)+'px'; row.appendChild(bar);
        row.appendChild(el('span','tiny',it[1]+' ('+Math.round(it[1]/denom*100)+'%)'));
        fn.appendChild(row);
      });
    }
    const btn=el('button', d.aiEnabled?'btn off':'btn', d.aiEnabled?'⏸ Tắt AI toàn cục':'▶ Bật AI'); btn.onclick=()=>toggle(!d.aiEnabled); c.appendChild(btn);
    const exp=el('a','btn','📥 Export CSV'); exp.href='/admin/api/export?token='+encodeURIComponent(TOKEN); exp.style.cssText='margin-left:8px;text-decoration:none;padding:9px 14px;display:inline-block'; c.appendChild(exp);
    const chg=el('button','btn','🔑 Đổi token'); chg.style.marginLeft='8px'; chg.onclick=function(){ var n=prompt('Token mới (≥8 ký tự):'); if(!n||n.length<8){if(n!==null)alert('Cần ≥8 ký tự');return;} fetch('/admin/api/token?token='+encodeURIComponent(TOKEN),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({new:n})}).then(function(r){return r.json()}).then(function(j){ if(j.ok){alert('Đã đổi! Đang chuyển sang token mới…'); location.href='/admin?token='+encodeURIComponent(n);} else alert('Lỗi: '+(j.err||'?')); }); }; c.appendChild(chg);
    const ft=document.getElementById('ftype').value;
    const evs = ft ? d.events.filter(e=>e.type===ft) : d.events;
    const tb=document.getElementById('events'); tb.textContent='';
    evs.forEach(function(e){
      const tr=el('tr');
      const td1=el('td','tiny',new Date(e.ts).toLocaleString('vi-VN')); tr.appendChild(td1);
      const td2=el('td'); const badge=el('span','badge b-'+(e.type||'other'), e.type); td2.appendChild(badge); tr.appendChild(td2);
      tr.appendChild(el('td','ip', e.ip||'?'));
      tr.appendChild(el('td','tiny', (e.country||'?')+(e.city?' / '+e.city:'')));
      tr.appendChild(el('td','tiny', e.data?JSON.stringify(e.data).slice(0,250):''));
      tb.appendChild(tr);
    });
    // [loop 1351] by-IP view — mỗi visitor (IP) + charts xem + câu hỏi AI
    const bip=document.getElementById('byip'); if (bip) { bip.textContent='';
      (d.byIp||[]).forEach(function(v){
        const card=el('div'); card.style.cssText='background:rgba(212,175,55,.05);border:1px solid rgba(212,175,55,.18);border-radius:8px;padding:10px 12px;margin:6px 0';
        const head=el('div'); head.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap';
        const ipE=el('span','ip', v.ip); ipE.style.cssText='font-size:14px;font-weight:700'; head.appendChild(ipE);
        head.appendChild(el('span','tiny', (v.country||'?')+(v.city?' / '+v.city:'')+' · '+v.count+' sự kiện ('+v.visits+' visits)'));
        card.appendChild(head);
        card.appendChild(el('div','tiny','⏱ '+new Date(v.firstTs).toLocaleString('vi-VN')+' → '+new Date(v.lastTs).toLocaleString('vi-VN')));
        if (v.charts.length) card.appendChild(el('div','tiny','📊 Lá số xem ('+v.charts.length+'): '+v.charts.map(function(c){return (c.dob||'?')+' '+(c.gender||'');}).join('; ').slice(0,400)));
        if (v.questions.length) card.appendChild(el('div','tiny','💬 AI hỏi ('+v.questions.length+'): '+v.questions.map(function(q){return '«'+String(q).slice(0,90)+'»';}).join(' ').slice(0,500)));
        bip.appendChild(card);
      });
    }
    // [loop 1351] daily breakdown — mini bar chart 7 ngày
    const dl=document.getElementById('daily'); if (dl && d.daily) { dl.textContent='';
      const maxv=Math.max.apply(null, d.daily.map(function(x){return x.visit+x.chart+x.ai_question;}).concat([1]));
      d.daily.forEach(function(dy){
        const tot=dy.visit+dy.chart+dy.ai_question;
        const row=el('div'); row.style.cssText='display:flex;align-items:center;gap:8px;margin:3px 0;font-size:12px';
        row.appendChild(el('span','tiny',dy.date));
        const bar=el('div'); bar.style.cssText='height:14px;width:'+Math.max(4,Math.round(tot/maxv*200))+'px;border-radius:3px;background:#d4af37'; row.appendChild(bar);
        row.appendChild(el('span','tiny',tot+' (v:'+dy.visit+' c:'+dy.chart+' q:'+dy.ai_question+')'));
        dl.appendChild(row);
      });
    }
    // [loop 1351] top questions + countries
    const tq=document.getElementById('topq'); if (tq) { tq.textContent='';
      const col1=el('div'); col1.style.cssText='flex:1;min-width:240px'; col1.appendChild(el('h4',null,'💬 Câu hỏi AI hay gặp'));
      (d.topQuestions||[]).forEach(function(q){ col1.appendChild(el('div','tiny', q.count+'× «'+q.q+'»')); });
      if (!(d.topQuestions||[]).length) col1.appendChild(el('div','tiny','(chưa có)'));
      tq.appendChild(col1);
      const col2=el('div'); col2.style.cssText='flex:1;min-width:200px'; col2.appendChild(el('h4',null,'🌍 Quốc gia'));
      (d.topCountries||[]).forEach(function(c){ col2.appendChild(el('div','tiny', c.count+'× '+(c.country||'?'))); });
      tq.appendChild(col2);
      const col3=el('div'); col3.style.cssText='flex:1;min-width:200px'; col3.appendChild(el('h4',null,'🔗 Nguồn traffic'));
      (d.topReferrers||[]).forEach(function(r){ col3.appendChild(el('div','tiny', r.count+'× '+r.referrer)); });
      tq.appendChild(col3);
    }
  }
  async function toggle(en){ await fetch('/admin/api/ai', { method:'POST', headers:{...H,'Content-Type':'application/json'}, body: JSON.stringify({enabled:en}) }); load(); }
  load(); setInterval(load, 15000);
  async function tgSave(){ var t=document.getElementById('tg-token').value.trim(),c=document.getElementById('tg-chat').value.trim(); if(!t||!c){alert('Nhập token + chat ID');return;} var r=await fetch('/admin/api/notify?token='+TOKEN,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tg_token:t,tg_chat:c})}).then(function(r){return r.json()}); alert(r.enabled?'✅ Telegram alert ĐÃ BẬT!':'❌ Lỗi'); }
  async function tgOff(){ await fetch('/admin/api/notify?token='+TOKEN,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({disable:true})}); alert('Telegram alert đã tắt'); }
  </script></body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}
