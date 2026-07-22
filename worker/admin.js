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

// [loop 1365] parseUA — rút device label từ User-Agent (OS/browser/type/brand Android).
//   UA chuẩn không含 model iPhone (chỉ «iPhone»), nên iOS chỉ ra OS+browser. Android có brand.
export function parseUA(ua) {
  if (!ua) return { label: '?', os: '?', browser: '?', type: '?', brand: '' };
  const u = ua.toLowerCase();
  let os = 'Unknown';
  if (/iphone/.test(u)) os = 'iOS';
  else if (/ipad/.test(u)) os = 'iPadOS';
  else if (/android/.test(u)) os = 'Android';
  else if (/windows nt 1/.test(u)) os = 'Windows';
  else if (/mac os x|macintosh/.test(u)) os = 'macOS';
  else if (/linux/.test(u)) os = 'Linux';
  let browser = 'Other';
  if (/edg\//.test(u)) browser = 'Edge';
  else if (/opr\/|opera/.test(u)) browser = 'Opera';
  else if (/samsungbrowser/.test(u)) browser = 'Samsung Internet';
  else if (/crios|chrome/.test(u)) browser = 'Chrome';
  else if (/firefox/.test(u)) browser = 'Firefox';
  else if (/safari/.test(u)) browser = 'Safari';
  let type = 'Desktop';
  if (/iphone/.test(u)) type = 'Phone';
  else if (/ipad/.test(u)) type = 'Tablet';
  else if (/android/.test(u)) type = /mobile/.test(u) ? 'Phone' : 'Tablet';
  let brand = '';
  if (os === 'Android') {
    if (/sm-|samsung|galaxy/.test(u)) brand = 'Samsung';
    else if (/xiaomi|redmi|mi\s\d|pocophin/.test(u)) brand = 'Xiaomi';
    else if (/oppo|cph\d/.test(u)) brand = 'OPPO';
    else if (/vivo/.test(u)) brand = 'Vivo';
    else if (/huawei|honor/.test(u)) brand = 'Huawei';
    else if (/realme/.test(u)) brand = 'Realme';
    else if (/nokia/.test(u)) brand = 'Nokia';
  }
  const icon = type === 'Phone' ? '📱' : type === 'Tablet' ? '📲' : '💻';
  return { label: icon + ' ' + (brand ? brand + ' ' : '') + os + ' · ' + browser, os, browser, type, brand, icon };
}

// [loop 1355] Admin audit log — accountability: ghi mọi action admin làm (toggle/block/clear/...)
//   để truy vết «ai đã đổi gì, khi nào, từ IP nào». Cap 200, TTL 90 ngày.
async function auditLog(env, request, action, detail) {
  if (!env.ADMIN_KV) return;
  const ip = clientIP(request);
  const ts = Date.now();
  let log = [];
  try { log = JSON.parse((await env.ADMIN_KV.get('audit:log')) || '[]'); } catch (e) {}
  log.unshift({ ts, action, ip, detail: detail || {} });
  if (log.length > 200) log.length = 200;
  await env.ADMIN_KV.put('audit:log', JSON.stringify(log), { expirationTtl: TTL_EVENT });
}

export async function isAiEnabled(env) {
  if (!env.ADMIN_KV) return true;
  const v = await env.ADMIN_KV.get('ai:enabled');
  return v === null || v === '1' || v === 'true';
}

// [loop 1357] Free glm-5.2 model toggle — riêng biệt với kill-switch AI toàn cục.
//   «ai cũng dùng được» = free CF glm-5.2 (CF_AI_KEY public). Admin có thể tắt khi hết quota.
export async function isFreeAiEnabled(env) {
  if (!env.ADMIN_KV) return true;
  const v = await env.ADMIN_KV.get('ai:free_enabled');
  return v === null || v === '1' || v === 'true';
}

// [loop 1378 MOAT] Feedback flywheel — user rate 👍/👎 câu trả lời → dataset chart↔outcome
//   độc quyền (không model nào có). Cộng dồn theo thời gian → refine engine/KB.
export async function logFeedback(env, ip, body) {
  if (!env.ADMIN_KV) return true;
  const rating = body && body.rating === 'good' ? 'good' : 'bad';
  const ts = Date.now();
  for (const k of ['cnt:feedback', 'cnt:feedback_' + rating]) {
    const cur = parseInt((await env.ADMIN_KV.get(k)) || '0', 10);
    await env.ADMIN_KV.put(k, String(cur + 1));
  }
  let log = []; try { log = JSON.parse((await env.ADMIN_KV.get('feedback:log')) || '[]'); } catch (e) {}
  log.unshift({ ts, rating, ip, q: String((body && body.q) || '').slice(0, 150), chartHash: String((body && body.chartHash) || '').slice(0, 32), source: (body && body.source) || '', aspect: (body && body.aspect) || '' });
  if (log.length > 500) log.length = 500;
  await env.ADMIN_KV.put('feedback:log', JSON.stringify(log));
  return true;
}

// [loop 1357] Track usage free model — đếm calls (ok/err) + per-IP + per-day + recent log.
//   Cloudflare Workers AI free tier = 10k Neurons/ngày → call count là metric quota thực tế.
export async function logFreeUsage(env, ip, status, backend) {
  if (!env.ADMIN_KV) return;
  const ok = status >= 200 && status < 300;
  const ts = Date.now();
  const be = backend || 'cf-glm';
  for (const k of ['cnt:free_calls', ok ? 'cnt:free_ok' : 'cnt:free_err']) {
    const cur = parseInt((await env.ADMIN_KV.get(k)) || '0', 10);
    await env.ADMIN_KV.put(k, String(cur + 1));
  }
  const day = new Date(ts).toISOString().slice(0, 10);
  let agg = {}; try { agg = JSON.parse((await env.ADMIN_KV.get('dayagg:' + day)) || '{}'); } catch (e) {}
  agg.free_calls = (agg.free_calls || 0) + 1;
  if (!ok) agg.free_err = (agg.free_err || 0) + 1;
  await env.ADMIN_KV.put('dayagg:' + day, JSON.stringify(agg), { expirationTtl: TTL_EVENT });
  let log = []; try { log = JSON.parse((await env.ADMIN_KV.get('free:log')) || '[]'); } catch (e) {}
  log.unshift({ ts, ip, status, backend: be });
  if (log.length > 200) log.length = 200;
  await env.ADMIN_KV.put('free:log', JSON.stringify(log));
}

export async function logEvent(env, request, type, data) {
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
  // [loop 1352] events:log cap 1500 (KV value limit 25MB → 1500 events ≈ 700KB, thừa sức).
  //   Cap cũ 200 → lịch sử chat/lá số bị xóa vĩnh viễn sau vài giờ, phá «thống kê chi tiết».
  const logRaw = await env.ADMIN_KV.get('events:log');
  let log = [];
  try { log = logRaw ? JSON.parse(logRaw) : []; } catch (e) {}
  const isNewIp = type === 'visit' && !log.some((e) => e.ip === ip);
  log.unshift({ ts, type, ip, ua, country, city, data: data || {} });
  if (log.length > 1500) log.length = 1500;
  await env.ADMIN_KV.put('events:log', JSON.stringify(log));
  // [visitor-finder] profile bền vững — chart identity (dob|time|gender) sống qua events:log rollover + đổi IP.
  //   Chỉ upsert khi chart có name → admin tìm theo tên dài hạn. Không TTL (persistent).
  if (type === 'chart' && data && data.name) {
    try {
      const pk = 'vprof:' + String(data.dob || '?') + '|' + String(data.time || 'na') + '|' + String(data.gender || '?');
      await env.ADMIN_KV.put(pk, JSON.stringify({ name: String(data.name).slice(0, 40), dob: data.dob || '', time: data.time || '', gender: data.gender || '', ip: ip, score: data.score != null ? data.score : null, grade: data.grade || '', patternQ: data.patternQ || '', yong: data.yong || '', lastTs: ts }));
    } catch (e) {}
  }
  // [loop 1361] test events (data.test/audit/xss) — log vào events:log (cho raw endpoint check)
  //   NHƯNG KHÔNG đếm cnt:/dayagg → không inflate production stats. Chống audit/test pollute.
  const isTest = data && (data.test || data.audit || data.xss);
  if (!isTest) {
    // [loop 1352] dayagg:<date> — 1 JSON key thay cho 3 key daily:day:type cũ (ít KV op hơn,
    //   richer, TTL 90 ngày cho long-term trend). events:log chỉ giữ recent 1500.
    const day = new Date(ts).toISOString().slice(0, 10);
    let agg = {};
    try { agg = JSON.parse((await env.ADMIN_KV.get('dayagg:' + day)) || '{}'); } catch (e) {}
    agg[type] = (agg[type] || 0) + 1;
    agg.all = (agg.all || 0) + 1;
    await env.ADMIN_KV.put('dayagg:' + day, JSON.stringify(agg), { expirationTtl: TTL_EVENT });
    for (const k of ['cnt:' + type, 'cnt:all']) {
      const cur = parseInt((await env.ADMIN_KV.get(k)) || '0', 10);
      await env.ADMIN_KV.put(k, String(cur + 1));
    }
  }
  // [loop 1351] Telegram alert cho chart/ai_question/error (fire-and-forget, không block)
  if (type === 'chart' || type === 'ai_question' || type === 'error') {
    notifyTelegram(env, { ts, type, ip, ua, country, city, data: data || {} }).catch(function () {});
  }
  if (isNewIp) {
    notifyTelegram(env, { ts, type: 'new_visitor', ip, ua: '', country, city, data: data || {} }).catch(function () {});
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
  if (event.type === 'new_visitor') msg = '🆕 <b>Visitor mới!</b>\n';
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
  await auditLog(env, request, 'notify_config', { enabled: !!token });
  return json({ ok: true, enabled: !!token });
}

// [loop 1351] AI config — admin kiểm soát sâu AI (mode/endpoint/apiKey/model)
async function adminAiConfigSet(env, request) {
  const body = await request.json().catch(() => ({}));
  const config = {};
  if (body.mode) config.mode = String(body.mode); // 'off' | 'free' | 'custom'
  if (body.endpoint) config.endpoint = String(body.endpoint);
  if (body.apiKey) config.apiKey = String(body.apiKey);
  else if (body.mode === 'free') config.apiKey = ''; // [loop 1393] mode=free → clear apiKey (freeRoute path)
  if (body.model) config.model = String(body.model);
  if (body.zaiKey) config.zaiKey = String(body.zaiKey); // [loop 1384] z.ai paid key (last resort)
  if (body.disable) { await env.ADMIN_KV.delete('ai:config'); return json({ ok: true, config: { mode: 'free' } }); }
  // merge với config cũ
  let old = {};
  try { old = JSON.parse((await env.ADMIN_KV.get('ai:config')) || '{}'); } catch (e) {}
  const merged = Object.assign({}, old, config);
  await env.ADMIN_KV.put('ai:config', JSON.stringify(merged));
  // nếu mode='off' → cũng set ai:enabled=0 (kill-switch cũ tương thích)
  if (merged.mode === 'off') await env.ADMIN_KV.put('ai:enabled', '0');
  else await env.ADMIN_KV.put('ai:enabled', '1');
  await auditLog(env, request, 'ai_config', { mode: merged.mode, hasKey: !!merged.apiKey, model: merged.model || '', endpoint: merged.endpoint || '' });
  return json({ ok: true, config: Object.assign({}, merged, { apiKey: merged.apiKey ? '***' + merged.apiKey.slice(-4) : '', zaiKey: merged.zaiKey ? '***' + String(merged.zaiKey).slice(-4) : '' }) });
}

async function adminAiConfigGet(env) {
  let config = {};
  try { config = JSON.parse((await env.ADMIN_KV.get('ai:config')) || '{}'); } catch (e) {}
  const masked = Object.assign({}, config, { apiKey: config.apiKey ? '***' + config.apiKey.slice(-4) : '', zaiKey: config.zaiKey ? '***' + String(config.zaiKey).slice(-4) : '' });
  // [loop 1376] freePool — mask key mỗi backend (admin-only, không public)
  if (Array.isArray(masked.freePool)) masked.freePool = masked.freePool.map(function (p) { return Object.assign({}, p, { apiKey: p.apiKey ? '***' + String(p.apiKey).slice(-4) : '' }); });
  return json({ config: masked });
}

// [loop 1376] free pool — admin quản lý nhiều free backend (NVIDIA/Groq/...). Server-side key,
//   user không cần key («ai cũng dùng được»). freeRoute (index.js) thử pool + cf-glm fallback.
async function adminFreePoolSet(env, request) {
  const body = await request.json().catch(() => ({}));
  let old = {}; try { old = JSON.parse((await env.ADMIN_KV.get('ai:config')) || '{}'); } catch (e) {}
  const oldPool = Array.isArray(old.freePool) ? old.freePool : [];
  const newPool = Array.isArray(body.pool) ? body.pool : [];
  const mergedPool = newPool.filter(function (p) { return p && p.endpoint && p.model; }).map(function (p, i) {
    const oldEntry = oldPool[i] || oldPool.find(function (o) { return o.endpoint === p.endpoint; });
    return { name: String(p.name || '').slice(0, 40), endpoint: String(p.endpoint).slice(0, 200), model: String(p.model).slice(0, 80), apiKey: p.apiKey ? String(p.apiKey) : (oldEntry ? oldEntry.apiKey : '') };
  }).filter(function (p) { return p.apiKey; });
  old.freePool = mergedPool;
  await env.ADMIN_KV.put('ai:config', JSON.stringify(old));
  await auditLog(env, request, 'free_pool', { count: mergedPool.length, names: mergedPool.map(function (p) { return p.name; }) });
  return json({ ok: true, pool: mergedPool.map(function (p) { return Object.assign({}, p, { apiKey: p.apiKey ? '***' + String(p.apiKey).slice(-4) : '' }); }) });
}

export async function handleAdminRoute(request, env, url) {
  const path = url.pathname;
  const method = request.method;
  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,X-Admin-Token' } });

  if (path === '/api/event' && method === 'POST') {
    try {
      const body = await request.json();
      const type = ['visit', 'chart', 'ai_question', 'ai_chat', 'error', 'click'].includes(body && body.type) ? body.type : 'other';
      const ok = await logEvent(env, request, type, body && body.data);
      return json(ok ? { ok: true } : { ok: false, err: 'rate_limited (max 30/phút/IP)' }, ok ? 200 : 429);
    } catch (e) { return json({ ok: false, err: e.message }, 400); }
  }
  // [loop 1378 MOAT] /api/feedback — public, log 👍/👎 (data flywheel)
  if (path === '/api/feedback' && method === 'POST') {
    try { const body = await request.json(); await logFeedback(env, clientIP(request), body); return json({ ok: true }); }
    catch (e) { return json({ ok: false }, 400); }
  }
  // [R46] /api/log-error — AI tự log lỗi khi luận SAI (public POST → lưu KV 30 ngày)
  if (path === '/api/log-error' && method === 'POST') {
    try {
      const body = await request.json();
      const id = 'err:' + Date.now() + ':' + Math.random().toString(36).slice(2, 8);
      const entry = JSON.stringify({ ...body, ts: new Date().toISOString(), ip: clientIP(request) });
      if (env.ADMIN_KV) await env.ADMIN_KV.put(id, entry, { expirationTtl: 86400 * 30 });
      return json({ ok: true, id });
    } catch (e) { return json({ ok: false, error: e.message }, 500); }
  }
  // [loop 1380] /api/inbox — user poll tin nhắn admin inject (can thiệp chat real-time)
  if (path === '/api/inbox' && method === 'GET') {
    const sid = url.searchParams.get('sid');
    if (!sid || !env.ADMIN_KV) return json({ message: null });
    const key = 'inbox:' + String(sid).slice(0, 64);
    const raw = await env.ADMIN_KV.get(key);
    if (raw) {
      await env.ADMIN_KV.delete(key); // one-shot delivery
      try { return json({ message: JSON.parse(raw) }); } catch (e) { return json({ message: null }); }
    }
    return json({ message: null });
  }

  // [loop 1351] GET /api/ai-config (public) — frontend biết AI config admin đặt
  if (path === '/api/ai-config' && method === 'GET') {
    let config = {};
    try { const raw = env.ADMIN_KV ? await env.ADMIN_KV.get('ai:config') : null; config = raw ? JSON.parse(raw) : {}; } catch (e) {}
    return json({ mode: config.mode || 'free', endpoint: config.endpoint || '', hasKey: !!config.apiKey || !!env.CF_AI_KEY, model: config.model || '', freeEnabled: await isFreeAiEnabled(env) });
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
    const ck = (request.headers.get('Cookie') || '').match(/btu_admin=([^;]+)/);
    const token = url.searchParams.get('token') || request.headers.get('X-Admin-Token') || (ck ? decodeURIComponent(ck[1]) : '') || '';
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
    // [loop 1364] auth thành công → clear fail counter IP này (user hợp lệ không bị lock cumulate)
    if (env.ADMIN_KV) env.ADMIN_KV.delete('fail:' + clientIP(request)).catch(function () {});
    // [loop 1364] session cookie — auth lần đầu (URL/header token) → set cookie HttpOnly+Secure.
    //   Reload /admin (URL đã strip token khỏi history) vẫn work qua cookie. URL sạch + reload OK.
    if (path === '/admin' || path === '/admin/') {
      const _d = adminDashboard();
      const _h = new Headers(_d.headers);
      _h.append('Set-Cookie', 'btu_admin=' + encodeURIComponent(expected) + '; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=86400');
      return new Response(_d.body, { status: _d.status, headers: _h });
    }
    if (path === '/admin/api/stats') { try { return await adminStats(env, url); } catch (e) { return json({ error: e.message }, 500); } }
    // [R46] admin xem error log (AI tự log khi luận sai)
    if (path === '/admin/api/error-log' && method === 'GET') {
      try {
        const list = env.ADMIN_KV ? await env.ADMIN_KV.list({ prefix: 'err:', limit: 100 }) : { keys: [] };
        const errors = [];
        for (const k of list.keys) { const v = await env.ADMIN_KV.get(k.name); if (v) errors.push(JSON.parse(v)); }
        return json({ count: errors.length, errors: errors.sort((a, b) => (b.ts || '').localeCompare(a.ts || '')) });
      } catch (e) { return json({ error: e.message }, 500); }
    }
    if (path === '/admin/api/ai' && method === 'POST') return adminToggleAi(env, request);
    if (path === '/admin/api/ai-free' && method === 'POST') return adminToggleFreeAi(env, request);
    if (path === '/admin/api/free-test' && method === 'POST') { try { return await adminFreeTest(env, request); } catch (e) { return json({ ok: false, err: e.message }, 500); } }
    if (path === '/admin/api/token' && method === 'POST') return adminChangeToken(env, request);
    if (path === '/admin/api/export' && method === 'GET') return adminExport(env);
    if (path === '/admin/api/events' && method === 'GET') {
      const type = url.searchParams.get('type');
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '200', 10), 200);
      const logRaw = env.ADMIN_KV ? await env.ADMIN_KV.get('events:log') : null;
      let events = []; try { events = logRaw ? JSON.parse(logRaw) : []; } catch (e) {}
      const filtered = type ? events.filter((e) => e.type === type) : events;
      return json({ events: filtered.slice(0, limit), total: filtered.length });
    }
    // [loop 1365] visitor detail — click IP → load HẾT data 1 visitor (timeline/charts/chats/device, không cap)
    if (path === '/admin/api/visitor' && method === 'GET') {
      const ip = url.searchParams.get('ip');
      if (!ip) return json({ ok: false, err: 'Cần ?ip=' }, 400);
      const logRaw = env.ADMIN_KV ? await env.ADMIN_KV.get('events:log') : null;
      let events = []; try { events = logRaw ? JSON.parse(logRaw) : []; } catch (e) {}
      const ipEvents = events.filter(function (e) { return e.ip === ip; });
      if (!ipEvents.length) return json({ ok: false, err: 'Không có data cho IP ' + ip }, 404);
      ipEvents.sort(function (a, b) { return a.ts - b.ts; });
      const last = ipEvents[ipEvents.length - 1];
      const charts = ipEvents.filter(function (e) { return e.type === 'chart'; }).map(function (e) { return e.data || {}; });
      const questions = ipEvents.filter(function (e) { return e.type === 'ai_question'; }).map(function (e) { return (e.data && e.data.q) || ''; });
      const chats = ipEvents.filter(function (e) { return e.type === 'ai_chat'; }).map(function (e) { return { ts: e.ts, q: (e.data && e.data.q) || '', response: (e.data && e.data.response) || '', source: (e.data && e.data.source) || '', durationMs: (e.data && e.data.durationMs) || null, rounds: (e.data && e.data.rounds) || 0, bailed: (e.data && e.data.bailed) || null }; });
      const visits = ipEvents.filter(function (e) { return e.type === 'visit'; }).length;
      const clicks = ipEvents.filter(function (e) { return e.type === 'click'; }).map(function (e) { return { id: (e.data && e.data.id) || '', ts: e.ts }; });
      const refEv = ipEvents.find(function (e) { return e.type === 'visit' && e.data && e.data.ref; });
      var sidEv = ipEvents.filter(function (e) { return e.data && e.data.sid; }).slice(-1)[0];
      return json({ ok: true, ip: ip, sid: (sidEv && sidEv.data && sidEv.data.sid) || '', country: last.country || '', city: last.city || '', ua: last.ua || '', device: parseUA(last.ua), firstTs: ipEvents[0].ts, lastTs: last.ts, count: ipEvents.length, visits: visits, referrer: (refEv && refEv.data && refEv.data.ref) || '', charts: charts, questions: questions, chats: chats, clicks: clicks, timeline: ipEvents.map(function (e) { return { ts: e.ts, type: e.type, data: e.data || {} }; }) });
    }
    if (path === '/admin/api/notify' && method === 'POST') return adminNotifyConfig(env, request);
    if (path === '/admin/api/ai-config' && method === 'POST') return adminAiConfigSet(env, request);
    if (path === '/admin/api/free-pool' && method === 'POST') return adminFreePoolSet(env, request);
    // [loop 1380] admin inject message vào chat user (can thiệp real-time)
    if (path === '/admin/api/inject' && method === 'POST') {
      const body = await request.json().catch(() => ({}));
      if (!body.sid || !body.text) return json({ ok: false, err: 'Cần {sid, text}' }, 400);
      if (!env.ADMIN_KV) return json({ ok: false, err: 'no store' }, 500);
      const msg = { ts: Date.now(), text: String(body.text).slice(0, 2000), from: 'admin' };
      await env.ADMIN_KV.put('inbox:' + String(body.sid).slice(0, 64), JSON.stringify(msg), { expirationTtl: 3600 });
      await auditLog(env, request, 'inject_msg', { sid: String(body.sid).slice(0, 16), len: msg.text.length });
      return json({ ok: true, msg: 'Đã gửi — user sẽ thấy trong chat (poll 8s)' });
    }
    if (path === '/admin/api/ai-config' && method === 'GET') { try { return await adminAiConfigGet(env); } catch (e) { return json({ error: e.message }, 500); } }
    if (path === '/admin/api/clear' && method === 'POST') {
      if (env.ADMIN_KV) {
        await env.ADMIN_KV.delete('events:log');
        await env.ADMIN_KV.delete('cache:stats');
        await env.ADMIN_KV.delete('free:log');
        for (const k of ['cnt:visit','cnt:chart','cnt:ai_question','cnt:ai_chat','cnt:error','cnt:all','cnt:free_calls','cnt:free_ok','cnt:free_err']) await env.ADMIN_KV.delete(k);
        // [loop 1352] cleanup dayagg + legacy daily:type keys (list + batch delete)
        for (const prefix of ['dayagg:', 'daily:', 'vnote:', 'vprof:']) {
          let cursor = undefined;
          do {
            const ls = await env.ADMIN_KV.list({ prefix, limit: 1000, cursor });
            await Promise.all(ls.keys.map((k) => env.ADMIN_KV.delete(k.name)));
            cursor = ls.list_complete ? undefined : ls.cursor;
          } while (cursor);
        }
      }
      await auditLog(env, request, 'clear_data', {});
      return json({ ok: true, msg: 'Events + counters + dayagg cleared' });
    }
    // [loop 1369] xóa events của 1 IP (dọn test pollution / spammer data hỏng)
    if (path === '/admin/api/events-delete' && method === 'POST') {
      const body = await request.json().catch(() => ({}));
      if (!body.ip) return json({ ok: false, err: 'Cần {ip}' }, 400);
      if (!env.ADMIN_KV) return json({ ok: false, err: 'no store' }, 500);
      const logRaw = await env.ADMIN_KV.get('events:log');
      let evs = []; try { evs = logRaw ? JSON.parse(logRaw) : []; } catch (e) {}
      const before = evs.length;
      evs = evs.filter((e) => e.ip !== body.ip);
      const removed = before - evs.length;
      await env.ADMIN_KV.put('events:log', JSON.stringify(evs));
      await env.ADMIN_KV.delete('cache:stats');
      await env.ADMIN_KV.delete('vnote:' + body.ip); // [visitor-finder] dọn ghi chú theo IP luôn
      await auditLog(env, request, 'events_delete', { ip: body.ip, removed });
      return json({ ok: true, removed, msg: 'Đã xóa ' + removed + ' events của ' + body.ip });
    }
    // [visitor-finder] note + tag per visitor — bộ nhớ dài hạn admin «ai là ai». Lưu/xóa vnote:<ip>.
    if (path === '/admin/api/note' && method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const ip = String((body && body.ip) || '').slice(0, 64);
      if (!ip) return json({ ok: false, err: 'Cần {ip}' }, 400);
      const note = String((body && body.note) || '').slice(0, 500);
      const tags = Array.isArray(body && body.tags) ? body.tags.filter((t) => typeof t === 'string' && t.trim()).map((t) => t.trim().slice(0, 20)).slice(0, 10) : [];
      if (!note && !tags.length) await env.ADMIN_KV.delete('vnote:' + ip);
      else await env.ADMIN_KV.put('vnote:' + ip, JSON.stringify({ note: note, tags: tags, ts: Date.now() }));
      await env.ADMIN_KV.delete('cache:stats'); // note mới phải phản ánh ngay (bypass cache 60s)
      await auditLog(env, request, 'visitor_note', { ip: ip, hasNote: !!note, tagCount: tags.length });
      return json({ ok: true });
    }
    if (path === '/admin/api/block' && method === 'POST') {
      const body = await request.json().catch(() => ({}));
      if (body.ip && body.block) { await env.ADMIN_KV.put('block:' + body.ip, '1'); await auditLog(env, request, 'ip_block', { ip: body.ip, block: true }); return json({ ok: true, msg: 'Blocked ' + body.ip }); }
      if (body.ip && !body.block) { await env.ADMIN_KV.delete('block:' + body.ip); await auditLog(env, request, 'ip_block', { ip: body.ip, block: false }); return json({ ok: true, msg: 'Unblocked ' + body.ip }); }
      if (body.list) { const ks = await env.ADMIN_KV.list({ prefix: 'block:' }); return json({ blocked: ks.keys.map((k) => k.name.slice(6)) }); }
      return json({ ok: false, err: 'Cần {ip, block:true/false} hoặc {list:true}' }, 400);
    }
    if (path === '/admin/api/audit' && method === 'GET') {
      let log = []; try { log = JSON.parse((await env.ADMIN_KV.get('audit:log')) || '[]'); } catch (e) {}
      return json({ audit: log });
    }
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
  // [loop 1361] lọc test events (data.test/audit/xss + q chứa 'audit test') ra khỏi stats
  //   — production sạch. (Raw /admin/api/events vẫn trả tất cả, cho audit self-check.)
  events = events.filter((e) => !(e.data && (e.data.test || e.data.audit || e.data.xss || (typeof e.data.q === 'string' && e.data.q.indexOf('audit test') >= 0))));
  const get = async (k) => parseInt((await env.ADMIN_KV.get(k)) || '0', 10);
  const totals = { visit: await get('cnt:visit'), chart: await get('cnt:chart'), ai_question: await get('cnt:ai_question'), ai_chat: await get('cnt:ai_chat'), error: await get('cnt:error'), all: await get('cnt:all') };
  const ips = new Set(events.map((e) => e.ip));
  // [loop 1351] byIp — group events theo visitor (đúng nhu cầu «người nào xem gì hỏi gì»)
  const byIp = {};
  for (const e of events) {
    const ip = e.ip || '?';
    if (!byIp[ip]) byIp[ip] = { ip, country: e.country || '', city: e.city || '', ua: (e.ua || '').slice(0, 80), device: parseUA(e.ua).label, count: 0, visits: 0, charts: [], questions: [], chats: [], timeline: [], firstTs: e.ts, lastTs: 0 };
    const g = byIp[ip];
    g.count++;
    g.timeline.push({ ts: e.ts, type: e.type, data: e.data || {} });
    if (e.type === 'visit') g.visits++;
    else if (e.type === 'chart') g.charts.push(e.data || {});
    else if (e.type === 'ai_question') g.questions.push((e.data && e.data.q) || '');
    else if (e.type === 'ai_chat') g.chats.push({ q: (e.data && e.data.q) || '', response: (e.data && e.data.response) || '', source: (e.data && e.data.source) || '', durationMs: (e.data && e.data.durationMs) || null, rounds: (e.data && e.data.rounds) || 0, bailed: (e.data && e.data.bailed) || null, detail: (e.data && e.data.detail) || null, ts: e.ts });
    if (e.ts > g.lastTs) g.lastTs = e.ts;
    if (e.ts < g.firstTs) g.firstTs = e.ts;
  }
  const byIpArr = Object.values(byIp).sort((a, b) => b.lastTs - a.lastTs).map(function(v) {
    // [loop 1351 perf] truncate timeline to last 15 events (reduce response size)
    if (v.timeline && v.timeline.length > 15) v.timeline = v.timeline.slice(0, 15);
    return v;
  });
  // [visitor-finder] load notes (vnote:<ip>) + durable profiles (vprof:<chartkey>) + tag cloud;
  //   đính kèm note/tags/name/returning vào mỗi byIp entry (cho filter/search client-side).
  let notesMap = {}, profiles = [];
  if (env.ADMIN_KV) {
    const [nl, pl] = await Promise.all([ env.ADMIN_KV.list({ prefix: 'vnote:', limit: 1000 }), env.ADMIN_KV.list({ prefix: 'vprof:', limit: 1000 }) ]);
    const nRaw = await Promise.all(nl.keys.map((k) => env.ADMIN_KV.get(k.name)));
    nl.keys.forEach((k, i) => { try { notesMap[k.name.slice(6)] = JSON.parse(nRaw[i] || '{}'); } catch (e) {} });
    const pRaw = await Promise.all(pl.keys.map((k) => env.ADMIN_KV.get(k.name)));
    pl.keys.forEach((k, i) => { try { const p = JSON.parse(pRaw[i] || '{}'); if (p && p.name) profiles.push(p); } catch (e) {} });
  }
  const _tagCount = {};
  for (const nip in notesMap) (notesMap[nip].tags || []).forEach((t) => { _tagCount[t] = (_tagCount[t] || 0) + 1; });
  const tagCloud = Object.entries(_tagCount).map(([t, n]) => ({ tag: t, count: n })).sort((a, b) => b.count - a.count);
  byIpArr.forEach((v) => {
    const n = notesMap[v.ip] || {};
    v.note = n.note || ''; v.tags = n.tags || []; v.noteTs = n.ts || 0;
    const namedChart = (v.charts || []).find((c) => c && c.name);
    v.name = namedChart ? namedChart.name : '';
    v.returning = new Date(v.firstTs).toISOString().slice(0, 10) !== new Date(v.lastTs).toISOString().slice(0, 10);
  });
  profiles.sort((a, b) => (b.lastTs || 0) - (a.lastTs || 0));
  // [loop 1351] top countries (geo distribution)
  const ctry = {};
  for (const e of events) { const c = e.country || '?'; ctry[c] = (ctry[c] || 0) + 1; }
  const topCountries = Object.entries(ctry).map(([c, n]) => ({ country: c, count: n })).sort((a, b) => b.count - a.count);
  // top AI questions (insight mối quan tâm user)
  const qmap = {};
  for (const e of events) { if (e.type === 'ai_question' && e.data && e.data.q) { const q = String(e.data.q).slice(0, 80); qmap[q] = (qmap[q] || 0) + 1; } }
  const topQuestions = Object.entries(qmap).map(([q, n]) => ({ q, count: n })).sort((a, b) => b.count - a.count).slice(0, 10);
  // [loop 1351] top clicks — feature nào được dùng nhiều nhất
  const clickMap = {};
  for (const e of events) { if (e.type === 'click' && e.data && e.data.id) { clickMap[e.data.id] = (clickMap[e.data.id] || 0) + 1; } }
  const topClicks = Object.entries(clickMap).map(([id, n]) => ({ id, count: n })).sort((a, b) => b.count - a.count).slice(0, 10);
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
  // [loop 1351] referrer conversion — traffic source nào convert tốt nhất (visit → chart)
  const refConv = {};
  for (const ip in byIp) {
    const v = byIp[ip];
    const visitEv = v.timeline && v.timeline.find((t) => t.type === 'visit' && t.data && t.data.ref);
    let ref = '(direct)';
    if (visitEv && visitEv.data.ref) { try { ref = new URL(visitEv.data.ref).hostname.replace(/^www\./, ''); } catch (_) { ref = visitEv.data.ref.slice(0, 30); } }
    if (!refConv[ref]) refConv[ref] = { visits: 0, charts: 0, questions: 0 };
    refConv[ref].visits++;
    if (v.charts.length > 0) refConv[ref].charts++;
    if (v.questions.length > 0) refConv[ref].questions++;
  }
  const referrerConversion = Object.entries(refConv).map(([r, d]) => ({ referrer: r, visits: d.visits, charts: d.charts, questions: d.questions, chartRate: d.visits ? Math.round((d.charts / d.visits) * 100) : 0 })).sort((a, b) => b.visits - a.visits);
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
  // [loop 1351] hourly activity (giờ VN — UTC+7) — biết giờ user active nhất
  const hourly = new Array(24).fill(0);
  for (const e of events) {
    if (e.type === 'visit' && !/bot|crawl|spider|facebookexternalhit|googleweblight|preview|semrush|ahrefs|dataforseo|pingdom|uptime/i.test(e.ua || '')) {
      const h = (new Date(e.ts).getUTCHours() + 7) % 24;
      hourly[h]++;
    }
  }
  // [loop 1351] session tracking — group events per IP (gap >30min = new session)
  const ipTs = {}; const ipDays = {};
  for (const e of events) { const ip = e.ip || '?'; if (!ipTs[ip]) ipTs[ip] = []; ipTs[ip].push(e.ts); const d2 = new Date(e.ts).toISOString().slice(0,10); if (!ipDays[ip]) ipDays[ip] = new Set(); ipDays[ip].add(d2); }
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
  // [loop 1352] 30-day trend từ dayagg (retention dài — events:log chỉ giữ recent 1500).
  //   Promise.all → 30 KV get song song (stats cached 60s nên chấp nhận được).
  const trend30 = [];
  for (let i = 29; i >= 0; i--) trend30.push(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10));
  const trendRaw = await Promise.all(trend30.map((d) => env.ADMIN_KV.get('dayagg:' + d)));
  const trend = trend30.map(function (d, i) {
    var a = {}; try { a = trendRaw[i] ? JSON.parse(trendRaw[i]) : {}; } catch (e) {}
    return { date: d, visit: a.visit || 0, chart: a.chart || 0, ai_question: a.ai_question || 0, ai_chat: a.ai_chat || 0, error: a.error || 0, all: a.all || 0, free_calls: a.free_calls || 0, free_err: a.free_err || 0 };
  });
  // [loop 1352] AI latency — durationMs aggregation (admin thấy AI chậm hay nhanh).
  //   156589ms (2.6 phút) là outlier nghiêm trọng — trước đây invisible.
  const durs = events.filter((e) => e.type === 'ai_chat' && e.data && e.data.durationMs).map((e) => e.data.durationMs);
  const dSorted = durs.slice().sort((a, b) => a - b);
  const aiLatency = durs.length ? {
    count: durs.length,
    avgMs: Math.round(durs.reduce((a, b) => a + b, 0) / durs.length),
    p95Ms: dSorted[Math.min(dSorted.length - 1, Math.floor(dSorted.length * 0.95))],
    maxMs: dSorted[dSorted.length - 1],
    bailCount: events.filter((e) => e.type === 'ai_chat' && e.data && e.data.bailed).length,
  } : null;
  // [loop 1357] free glm-5.2 usage stats (calls ok/err + today + top IP + recent)
  let freeLog = []; try { freeLog = JSON.parse((await env.ADMIN_KV.get('free:log')) || '[]'); } catch (e) {}
  const freeByIp = {};
  for (const fe of freeLog) { if (fe.ip) freeByIp[fe.ip] = (freeByIp[fe.ip] || 0) + 1; }
  const freeTopIps = Object.entries(freeByIp).map(([ip, n]) => ({ ip, count: n })).sort((a, b) => b.count - a.count).slice(0, 10);
  const _todayStr = new Date().toISOString().slice(0, 10);
  const freeUsage = {
    enabled: await isFreeAiEnabled(env),
    calls: await get('cnt:free_calls'),
    ok: await get('cnt:free_ok'),
    err: await get('cnt:free_err'),
    today: (trend.find((t) => t.date === _todayStr) || {}).free_calls || 0,
    topIps: freeTopIps,
  };
  // [loop 1366] Mệnh cách aggregate — tổng hợp «số mệnh» tập thể những người lập lá số.
  //   score từ R.synthesis.score (0-100) — frontend log khi submit chart.
  const scored = events.filter((e) => e.type === 'chart' && e.data && e.data.score != null);
  const scores = scored.map((e) => e.data.score);
  const sSorted = scores.slice().sort((a, b) => a - b);
  const dGrades = {}, dPat = {}, dFort = {};
  let strongCnt = 0, yongMap = {};
  scored.forEach((e) => {
    if (e.data.grade) dGrades[e.data.grade] = (dGrades[e.data.grade] || 0) + 1;
    if (e.data.patternQ) dPat[e.data.patternQ] = (dPat[e.data.patternQ] || 0) + 1;
    if (e.data.fortune) dFort[e.data.fortune] = (dFort[e.data.fortune] || 0) + 1;
    if (e.data.strong) strongCnt++;
    if (e.data.yong) yongMap[e.data.yong] = (yongMap[e.data.yong] || 0) + 1;
  });
  const destiny = scores.length ? {
    count: scores.length,
    avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    min: sSorted[0], max: sSorted[sSorted.length - 1],
    median: sSorted[Math.floor(sSorted.length / 2)],
    p25: sSorted[Math.min(sSorted.length - 1, Math.floor(sSorted.length * 0.25))],
    p75: sSorted[Math.min(sSorted.length - 1, Math.floor(sSorted.length * 0.75))],
    strongRate: Math.round((strongCnt / scores.length) * 100),
    grades: Object.entries(dGrades).map(([g, n]) => ({ grade: g, count: n })).sort((a, b) => b.count - a.count),
    patternQs: Object.entries(dPat).map(([q, n]) => ({ q, count: n })).sort((a, b) => b.count - a.count),
    fortunes: Object.entries(dFort).map(([f, n]) => ({ f, count: n })).sort((a, b) => b.count - a.count).slice(0, 5),
    yongs: Object.entries(yongMap).map(([y, n]) => ({ y, count: n })).sort((a, b) => b.count - a.count),
    histogram: [0, 1, 2, 3, 4].map(function (b) { var lo = b * 20, hi = (b + 1) * 20; var cnt = scores.filter(function (s) { return b === 4 ? (s >= lo && s <= 100) : (s >= lo && s < hi); }).length; return { bucket: lo + '-' + (b === 4 ? 100 : hi), count: cnt }; }),
    top: scored.map((e) => ({ dob: e.data.dob, gender: e.data.gender, score: e.data.score, grade: e.data.grade })).sort((a, b) => b.score - a.score).slice(0, 5),
    bottom: scored.map((e) => ({ dob: e.data.dob, gender: e.data.gender, score: e.data.score, grade: e.data.grade })).sort((a, b) => a.score - b.score).slice(0, 5),
  } : null;
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
    aiSuccessRate: totals.ai_question > 0 ? Math.round((totals.ai_chat / totals.ai_question) * 100) : null,
    returningVisitors: Object.values(ipDays).filter((s) => s.size > 1).length,
  };
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  const activeNow = new Set(events.filter((e) => e.ts > fiveMinAgo).map((e) => e.ip)).size;
  const BOT_RE = /bot|crawl|spider|facebookexternalhit|googleweblight|preview|semrush|ahrefs|dataforseo|pingdom|uptime/i;
  let botCount = 0; const realIps = new Set();
  for (const e of events) { if (BOT_RE.test(e.ua || '')) botCount++; else if (e.ip) realIps.add(e.ip); }
  const eventsLite = events.map(function (e) { var c = { ts: e.ts, type: e.type, ip: e.ip, country: e.country, city: e.city, data: e.data }; return c; });
  // [loop 1378 MOAT] feedback flywheel — data độc quyền chart↔outcome
  const fbTotal = await get('cnt:feedback');
  const fbGood = await get('cnt:feedback_good');
  const feedback = { total: fbTotal, good: fbGood, bad: await get('cnt:feedback_bad'), rate: fbTotal ? Math.round((fbGood / fbTotal) * 100) : null };
  let feedbackLog = []; try { feedbackLog = JSON.parse((await env.ADMIN_KV.get('feedback:log')) || '[]'); } catch (e) {}
  // [loop 1388] device fingerprint — group theo sid (cùng thiết bị = cùng sid), detect nhiều IP
  const bySid = {};
  for (const e of events) {
    const sid = e.data && e.data.sid;
    if (!sid || sid === 'sid-anon') continue;
    if (!bySid[sid]) bySid[sid] = { sid, ips: {}, count: 0, firstTs: e.ts, lastTs: 0, ua: e.ua || '', country: e.country || '', city: e.city || '' };
    const g = bySid[sid];
    g.count++;
    if (e.ip) g.ips[e.ip] = (g.ips[e.ip] || 0) + 1;
    if (e.ts > g.lastTs) g.lastTs = e.ts;
    if (e.ts < g.firstTs) g.firstTs = e.ts;
  }
  const deviceGroups = Object.values(bySid).map(function (v) {
    var ipArr = Object.entries(v.ips).map(function (kv) { return { ip: kv[0], count: kv[1] }; }).sort(function (a, b) { return b.count - a.count; });
    return { sid: v.sid.slice(0, 20), ips: ipArr, ipCount: ipArr.length, count: v.count, firstTs: v.firstTs, lastTs: v.lastTs, device: parseUA(v.ua).label, country: v.country, city: v.city };
  }).sort(function (a, b) { return b.ipCount - a.ipCount || b.lastTs - a.lastTs; }).slice(0, 50);
  const result = { aiEnabled: ai, totals, uniqueIps: ips.size, realUniqueIps: realIps.size, bots: botCount, activeNow, funnel, engagement, events: eventsLite, byIp: byIpArr, daily, trend, aiLatency, freeUsage, freeRecent: freeLog.slice(0, 30), feedback, feedbackRecent: feedbackLog.slice(0, 30), destiny, deviceGroups, topCountries, topQuestions, topReferrers, referrerConversion, devices, hourly, topClicks, notes: notesMap, profiles, tagCloud };
  if (env.ADMIN_KV) await env.ADMIN_KV.put('cache:stats', JSON.stringify(result), { expirationTtl: 60 });
  return json(result);
}

async function adminToggleAi(env, request) {
  const body = await request.json().catch(() => ({}));
  const enabled = body && body.enabled ? '1' : '0';
  await env.ADMIN_KV.put('ai:enabled', enabled);
  await auditLog(env, request, 'ai_toggle', { enabled: enabled === '1' });
  return json({ ok: true, aiEnabled: enabled === '1' });
}

// [loop 1357] toggle free glm-5.2 model (riêng với kill-switch AI toàn cục)
async function adminToggleFreeAi(env, request) {
  const body = await request.json().catch(() => ({}));
  const enabled = body && body.enabled ? '1' : '0';
  await env.ADMIN_KV.put('ai:free_enabled', enabled);
  await auditLog(env, request, 'free_ai_toggle', { enabled: enabled === '1' });
  return json({ ok: true, freeEnabled: enabled === '1' });
}

// [loop 1360] Test free glm-5.2 — Worker gọi thật free model (server-side, non-stream, max_tokens 20)
//   → báo status + timing + preview. Admin thấy model còn sống / tốc độ / lỗi gì. Rẻ (1 call nhỏ).
async function adminFreeTest(env, request) {
  const t0 = Date.now();
  const key = env.CF_AI_KEY;
  if (!key) return json({ ok: false, err: 'CF_AI_KEY chưa set (không test được free model)' });
  const account = 'bc101a2962ca21a084172c5334ad7dad';
  const url = 'https://api.cloudflare.com/client/v4/accounts/' + account + '/ai/v1/chat/completions';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify({ model: '@cf/zai-org/glm-5.2', messages: [{ role: 'user', content: 'Trả lời đúng 1 chữ «OK».' }], stream: false, max_tokens: 20 }),
    });
    const durationMs = Date.now() - t0;
    const text = await res.text();
    let preview = '', tokens = null;
    try { const j = JSON.parse(text); preview = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || ''; tokens = (j.usage && j.usage.total_tokens) || null; } catch (e) { preview = text.slice(0, 120); }
    await auditLog(env, request, 'free_test', { status: res.status, durationMs });
    return json({ ok: res.ok, status: res.status, durationMs, preview: preview.slice(0, 120), tokens });
  } catch (e) {
    return json({ ok: false, err: e.message, durationMs: Date.now() - t0 });
  }
}

async function adminChangeToken(env, request) {
  const body = await request.json().catch(() => ({}));
  const t = body && body.new && String(body.new).length >= 8 ? String(body.new) : null;
  if (!t) return json({ ok: false, err: 'Cần body {new: "..."} độ dài ≥ 8 ký tự' }, 400);
  if (env.ADMIN_KV) await env.ADMIN_KV.put('admin:token', t);
  await auditLog(env, request, 'token_change', {}); // KHÔNG log giá trị token mới
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
  :root{--bg:#0a0913;--surface:#15131f;--surface2:#1c1928;--border:rgba(212,175,55,.14);--border2:rgba(212,175,55,.28);--text:#e8d9b0;--muted:#9a8a6a;--gold:#d4af37;--green:#7fbf7f;--red:#e0533d;--blue:#64b4ff;--purple:#b478c8;--r:12px;--rs:8px}
  *{box-sizing:border-box}
  body{background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,"Segoe UI",sans-serif;margin:0;line-height:1.5;font-size:14px;-webkit-font-smoothing:antialiased}
  h1,h2,h3,h4{margin:0}
  h3{color:var(--gold);font-size:14px}
  /* === LAYOUT: sidebar + main === */
  .app{display:grid;grid-template-columns:230px 1fr;min-height:100vh}
  .sidebar{background:var(--surface);border-right:1px solid var(--border);padding:18px 12px;position:sticky;top:0;height:100vh;display:flex;flex-direction:column;gap:10px}
  .brand{font-size:17px;font-weight:800;color:var(--gold);line-height:1.15;padding:4px 8px}
  .brand span{display:block;font-size:10px;color:var(--muted);font-weight:500;letter-spacing:3px;margin-top:2px}
  .live{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--green);padding:5px 12px;background:rgba(127,191,127,.08);border:1px solid rgba(127,191,127,.2);border-radius:20px;width:fit-content;margin:0 4px}
  #live-dot{width:8px;height:8px;border-radius:50%;background:var(--green);animation:pulse 1.5s infinite}
  .pill{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:14px;font-size:11px;background:rgba(212,175,55,.07);border:1px solid var(--border);color:var(--text);font-weight:500;letter-spacing:.2px;white-space:nowrap}
  .pill .dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulse 1.5s infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  nav{display:flex;flex-direction:column;gap:2px;margin-top:6px}
  .nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border:none;background:transparent;color:var(--text);border-radius:var(--rs);cursor:pointer;font-size:14px;text-align:left;font-family:inherit;width:100%}
  .nav-item:hover{background:rgba(212,175,55,.07)}
  .nav-item.active{background:rgba(212,175,55,.14);color:var(--gold);font-weight:600;box-shadow:inset 2px 0 0 var(--gold)}
  .nav-item .ni-badge{margin-left:auto;font-size:10px;background:var(--surface2);color:var(--muted);padding:1px 6px;border-radius:8px}
  .sidebar-footer{margin-top:auto;padding:8px;display:flex;flex-direction:column;gap:6px;font-size:11px;color:var(--muted)}
  .main{padding:22px 26px;max-width:1180px;animation:fade .25s}
  @keyframes fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
  .tab{display:none}
  .tab.active{display:block}
  .pagehead{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:6px 14px;padding-bottom:14px;border-bottom:1px solid var(--border)}
  .pagehead h2{font-size:20px;color:var(--gold);font-weight:700;letter-spacing:.2px}
  .pagehead .tiny{font-size:12px;color:var(--muted)}
  /* === CARDS === */
  .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:16px;margin-bottom:14px;transition:border-color .15s}
  .card:hover{border-color:var(--border2)}
  .empty{color:var(--muted);font-size:12px;padding:8px 0;text-align:center;font-style:italic}
  .card h3{margin:0 0 12px;color:var(--gold);font-size:13px;text-transform:uppercase;letter-spacing:.6px;display:flex;align-items:center;gap:8px}
  .card .card-actions{margin-left:auto;display:flex;gap:6px;align-items:center;font-size:11px;text-transform:none;letter-spacing:0}
  .row-2col{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
  .row-3col{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:14px}
  /* === KPI grid (.stat → auto card) === */
  .kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:10px;margin-bottom:14px}
  .stat{display:flex;flex-direction:column;justify-content:center;padding:15px 16px;background:linear-gradient(180deg,var(--surface),#13111c);border:1px solid var(--border);border-radius:var(--r);min-width:0;transition:border-color .15s,transform .15s}
  .stat b{display:block;font-size:28px;color:var(--gold);line-height:1;font-weight:800;margin-bottom:6px;letter-spacing:-.5px}
  .stat span{font-size:10.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;line-height:1.3}
  .stat:hover{border-color:var(--border2);transform:translateY(-1px)}
  /* scrollbar polish */
  ::-webkit-scrollbar{width:10px;height:10px}
  ::-webkit-scrollbar-track{background:var(--bg)}
  ::-webkit-scrollbar-thumb{background:rgba(212,175,55,.25);border-radius:5px;border:2px solid var(--bg)}
  ::-webkit-scrollbar-thumb:hover{background:rgba(212,175,55,.4)}
  /* === TABLE / IP / tiny === */
  table{width:100%;border-collapse:collapse;font-size:12.5px}
  th,td{padding:10px 12px;border-bottom:1px solid var(--border);text-align:left;vertical-align:top}
  th{color:var(--gold);font-size:10px;text-transform:uppercase;letter-spacing:.6px;font-weight:700;background:rgba(212,175,55,.04);position:sticky;top:0}
  tbody tr:nth-child(even) td{background:rgba(212,175,55,.025)}
  tr:hover td{background:rgba(212,175,55,.07)!important}
  .ip{font-family:ui-monospace,"SF Mono",monospace;color:var(--green);font-size:12px}
  .tiny{color:var(--muted);font-size:11px}
  /* === BUTTONS / INPUTS === */
  .btn{padding:8px 14px;border:1px solid var(--gold);background:rgba(212,175,55,.1);color:var(--gold);border-radius:var(--rs);cursor:pointer;font-size:13px;font-weight:600;font-family:inherit;transition:background .15s}
  .btn:hover{background:rgba(212,175,55,.2)}
  .btn.off{border-color:var(--red);color:var(--red);background:rgba(192,57,43,.12)}
  .btn.sm{padding:4px 10px;font-size:11px}
  .filter{padding:7px 10px;background:var(--surface2);border:1px solid var(--border);color:var(--text);border-radius:var(--rs);font-size:13px;font-family:inherit}
  .filter:focus{outline:none;border-color:var(--gold)}
  .toolbar{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:center}
  .badge{display:inline-block;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700}
  .b-visit{background:rgba(127,191,127,.2);color:#7fbf7f}.b-chart{background:rgba(212,175,55,.2);color:#d4af37}.b-ai_question{background:rgba(180,120,200,.2);color:#b478c8}.b-other{background:rgba(150,150,150,.2);color:#aaa}.b-error{background:rgba(192,57,43,.25);color:#e0533d}.b-ai_chat{background:rgba(100,180,255,.2);color:#64b4ff}.b-click{background:rgba(100,200,150,.2);color:#64c896}
  details{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);margin-bottom:12px}
  details>summary{cursor:pointer;color:var(--gold);font-size:13px;padding:12px 16px;list-style:none}
  details>summary::-webkit-details-marker{display:none}
  details>summary:before{content:"▸ ";color:var(--muted)}
  details[open]>summary:before{content:"▾ "}
  details>div,.details-body{padding:0 16px 14px}
  /* === MOBILE === */
  @media(max-width:820px){.app{grid-template-columns:1fr}.sidebar{position:sticky;top:0;height:auto;flex-direction:row;align-items:center;flex-wrap:wrap;gap:8px;padding:10px 12px;z-index:10}.brand{padding:0}.live{margin:0}nav{flex-direction:row;flex-wrap:wrap;margin:0;flex:1}.nav-item{width:auto;padding:6px 10px;font-size:13px}.nav-item .ni-badge{display:none}.sidebar-footer{margin:0;flex-direction:row}.main{padding:14px}.row-2col,.row-3col{grid-template-columns:1fr}}
  </style></head><body>
  <div class="app">
    <aside class="sidebar">
      <div class="brand">🛡️ Bát Tự<span>ADMIN</span></div>
      <div class="live"><span id="live-dot"></span> <span id="live-txt">LIVE</span></div>
      <nav>
        <button class="nav-item active" data-tab="overview">📊 <span>Tổng quan</span></button>
        <button class="nav-item" data-tab="visitors">👥 <span>Visitors</span></button>
        <button class="nav-item" data-tab="ai">🤖 <span>AI</span></button>
        <button class="nav-item" data-tab="system">⚙️ <span>Hệ thống</span></button>
      </nav>
      <div class="sidebar-footer">
        <button class="btn sm" id="sound-btn" onclick="_soundOn=!_soundOn;this.textContent=_soundOn?'🔊 Sound':'🔇 Sound';this.style.color=_soundOn?'#7fbf7f':''">🔇 Sound</button>
        <div>↻ auto-refresh 3s · realtime</div>
      </div>
    </aside>
    <main class="main">
      <!-- ===== TỔNG QUAN ===== -->
      <section class="tab active" id="tab-overview">
        <div class="pagehead"><h2>📊 Tổng quan</h2><span class="pill"><span class="dot"></span>Snapshot realtime · 5s nắm tình hình</span></div>
        <div id="alerts"></div>
        <div id="status" class="kpi-grid">Đang tải…</div>
        <div class="row-2col">
          <div class="card"><h3>💚 Health</h3><div id="health"></div></div>
          <div class="card"><h3>🜂 Funnel <span class="card-actions tiny">visitor → lá số → AI</span></h3><div id="funnel"></div></div>
        </div>
        <div class="card"><h3>📊 Engagement <span class="card-actions tiny">chất lượng & sâu traffic</span></h3><div id="engagement" class="kpi-grid"></div></div>
        <div class="card"><h3>📈 Hoạt động 7 ngày <span class="card-actions tiny">số liệu gần đây</span></h3><div id="daily"></div></div>
        <div class="card"><h3>📉 Xu hướng 30 ngày <span class="card-actions tiny">dayagg TTL 90d · retention dài</span></h3><div id="trend30"></div></div>
        <div class="card"><h3>⏰ Giờ hoạt động (VN, UTC+7)</h3><div id="hourly" style="display:flex;align-items:flex-end;gap:1px;height:44px;margin-top:4px"></div></div>
        <div class="card"><h3>🔮 Mệnh cách tổng hợp <span class="card-actions tiny">số mệnh tập thể người lập lá số</span></h3><div id="destiny"></div></div>
        <div class="card"><h3>📱 Thiết bị <span class="card-actions tiny">cùng thiết bị dùng nhiều IP = VPN/chuyển mạng</span></h3><div id="device-groups"></div></div>
        <div class="card"><h3>🌍 Quốc gia · nguồn traffic · clicks</h3><div id="topq" style="display:flex;gap:20px;flex-wrap:wrap"></div></div>
      </section>
      <!-- ===== VISITORS ===== -->
      <section class="tab" id="tab-visitors">
        <div class="pagehead"><h2>👥 Visitors</h2><span class="pill">Tìm lại bất kỳ ai · tên / ngày sinh / câu hỏi / ghi chú / tag</span></div>

        <!-- 🔎 VISITOR FINDER -->
        <div class="card">
          <h3>🔎 Tìm visitor <span class="card-actions tiny">tìm + lọc + sắp xếp · gõ bất kỳ đặc điểm nào admin nhớ</span></h3>
          <div class="toolbar">
            <input class="filter" id="vq" placeholder="🔍 tên / ngày sinh / IP / câu hỏi / trả lời AI / ghi chú / tag…" oninput="vRender()" style="flex:1;min-width:220px">
            <select class="filter" id="vf-gender" onchange="vRender()"><option value="">Mọi giới</option><option value="nam">Nam</option><option value="nữ">Nữ</option></select>
            <select class="filter" id="vf-country" onchange="vRender()"></select>
            <select class="filter" id="vf-sort" onchange="vRender()">
              <option value="recent">Gần nhất</option><option value="old">Cũ nhất</option><option value="scorehi">Điểm cao</option><option value="scorelo">Điểm thấp</option><option value="charts">Nhiều lá số</option><option value="qs">Nhiều câu hỏi</option><option value="named">Có tên</option><option value="note">Có ghi chú</option>
            </select>
            <span class="tiny" id="vcount" style="margin-left:auto;white-space:nowrap"></span>
            <button class="btn sm" onclick="vReset()">✕ lọc</button>
          </div>
          <div class="toolbar" style="font-size:11px;gap:10px;align-items:center">
            <label style="display:inline-flex;align-items:center;gap:3px;cursor:pointer"><input type="checkbox" id="vf-chart" onchange="vRender()"> lá số</label>
            <label style="display:inline-flex;align-items:center;gap:3px;cursor:pointer"><input type="checkbox" id="vf-chat" onchange="vRender()"> chat</label>
            <label style="display:inline-flex;align-items:center;gap:3px;cursor:pointer"><input type="checkbox" id="vf-q" onchange="vRender()"> câu hỏi</label>
            <label style="display:inline-flex;align-items:center;gap:3px;cursor:pointer"><input type="checkbox" id="vf-note" onchange="vRender()"> ghi chú</label>
            <label style="display:inline-flex;align-items:center;gap:3px;cursor:pointer"><input type="checkbox" id="vf-tag" onchange="vRender()"> tag</label>
            <label style="display:inline-flex;align-items:center;gap:3px;cursor:pointer"><input type="checkbox" id="vf-name" onchange="vRender()"> có tên</label>
            <label style="display:inline-flex;align-items:center;gap:3px;cursor:pointer"><input type="checkbox" id="vf-ret" onchange="vRender()"> quay lại</label>
            <span style="margin-left:6px">điểm</span>
            <input class="filter" id="vf-smin" type="number" min="0" max="100" placeholder="từ" oninput="vRender()" style="width:50px">
            <span>–</span>
            <input class="filter" id="vf-smax" type="number" min="0" max="100" placeholder="đến" oninput="vRender()" style="width:50px">
            <span style="margin-left:4px">thăm</span>
            <input class="filter" id="vf-from" type="date" oninput="vRender()" style="width:128px">
            <span>→</span>
            <input class="filter" id="vf-to" type="date" oninput="vRender()" style="width:128px">
          </div>
          <div id="vtagcloud" class="tiny" style="margin-top:6px;line-height:2"></div>
          <div id="byip"></div>
        </div>

        <!-- 📒 DANH BẠ TÊN (profiles bền vững — sống qua rollover log) -->
        <div class="card"><h3>📒 Danh bạ tên <span class="card-actions tiny">bền vững · tìm theo tên dù đã lâu (sống qua rollover log 1500 events)</span></h3><div id="profiles"></div></div>

        <!-- SỰ KIỆN (chi tiết) -->
        <div class="card"><h3>Sự kiện gần đây <span class="card-actions tiny">click dòng ai_chat → xem full Q+A</span></h3>
          <div class="toolbar">
            <select class="filter" id="ftype" onchange="load()"><option value="">Tất cả</option><option value="visit">visit</option><option value="chart">chart</option><option value="ai_question">ai_question</option><option value="ai_chat">ai_chat (Q+A)</option><option value="error">error</option><option value="click">click</option></select>
            <input class="filter" id="sq" placeholder="🔍 tìm trong sự kiện" oninput="var q=this.value.toLowerCase();document.querySelectorAll('#events tr').forEach(function(tr){tr.style.display=!q||tr.textContent.toLowerCase().indexOf(q)>=0?'':'none'})">
          </div>
          <table><thead><tr><th>Thời gian</th><th>Loại</th><th>IP</th><th>Địa lý</th><th>Dữ liệu</th></tr></thead><tbody id="events"></tbody></table>
        </div>
      </section>
      <!-- ===== AI ===== -->
      <section class="tab" id="tab-ai">
        <div class="pagehead"><h2>🤖 AI</h2><span class="pill">Free glm-5.2 · latency · config</span></div>
        <div class="card"><h3>⚡ Latency & free model <span class="card-actions tiny">avg / p95 / max / quota</span></h3><div id="ai-kpis" class="kpi-grid"></div></div>
        <div class="card"><h3>🆓 Free glm-5.2 usage <span class="card-actions"><button class="btn sm" onclick="freeTest()">🧪 Test model</button><span id="free-test-result" class="tiny"></span></span></h3><div id="free-usage"></div></div>
        <details><summary>🤖 AI Config — mode / endpoint / key / model</summary>
        <div class="details-body" id="ai-cfg-box">
          <select class="filter" id="ai-mode" onchange="aiModeChange()"><option value="free">Free (cf-glm)</option><option value="custom">Custom API Key</option><option value="off">Tắt AI</option></select>
          <input class="filter" id="ai-endpoint" placeholder="Endpoint (vd https://api.z.ai/api/coding/paas/v4)" style="width:100%;margin:6px 0;box-sizing:border-box">
          <input class="filter" id="ai-apikey" placeholder="API Key (dán từ z.ai/model-api)" style="width:100%;margin:6px 0;box-sizing:border-box">
          <input class="filter" id="ai-model" placeholder="Model (vd glm-5.2)" style="width:60%;box-sizing:border-box">
          <button class="btn sm" onclick="aiSave()">💾 Lưu Config</button>
          <p class="tiny" id="ai-status">Đang tải...</p>
        </div></details>
        <details><summary>🌐 Free model pool — gộp free provider (NVIDIA/Groq...), ai cũng dùng được</summary>
        <div class="details-body">
          <p class="tiny">Admin dán key FREE (NVIDIA/Groq/...) → app thử pool + cf-glm theo thứ tự, fallback khi 1 provider fail. User <b>KHÔNG cần key</b> — dùng chung. Lấy key NVIDIA: <b>build.nvidia.com/settings/api-keys</b> (free 5000 credit).</p>
          <div id="free-pool-list"></div>
          <div class="toolbar" style="margin-top:8px">
            <input class="filter" id="fp-name" placeholder="Tên (NVIDIA)" style="width:90px">
            <input class="filter" id="fp-endpoint" placeholder="endpoint (/nvidia/v1)" style="width:150px">
            <input class="filter" id="fp-model" placeholder="model (z-ai/glm-5.2)" style="width:140px">
            <input class="filter" id="fp-key" placeholder="API key free" style="width:130px">
            <button class="btn sm" onclick="fpAdd()">+ Thêm</button>
          </div>
          <button class="btn sm" onclick="fpSave()" style="margin-top:6px">💾 Lưu pool</button>
          <span id="fp-status" class="tiny"></span>
        </div></details>
      </section>
      <!-- ===== HỆ THỐNG ===== -->
      <section class="tab" id="tab-system">
        <div class="pagehead"><h2>⚙️ Hệ thống</h2><span class="pill">Controls · Telegram · audit</span></div>
        <div class="card"><h3>🎛️ Controls <span class="card-actions tiny">toggle AI · free · export · token</span></h3><div id="controls"></div></div>
        <details><summary>📱 Telegram Alert — nhận TB khi user lập lá số / hỏi AI</summary>
        <div class="details-body">
          <input class="filter" id="tg-token" placeholder="Bot Token (123:ABC...)" style="width:100%;margin:4px 0;box-sizing:border-box">
          <input class="filter" id="tg-chat" placeholder="Chat ID" style="width:50%;box-sizing:border-box">
          <button class="btn sm" onclick="tgSave()">Bật Alert</button>
          <button class="btn sm" onclick="tgOff()">Tắt</button>
          <p class="tiny">@BotFather → /newbot → token. Chat ID: nhắn bot rồi /getUpdates.</p>
        </div></details>
        <div class="card"><h3>🔒 Audit log — admin actions <span class="card-actions"><button class="btn sm" onclick="loadAudit()">↻</button></span></h3><div id="audit"></div></div>
        <div class="card"><h3>🚧 Security actions</h3>
          <button class="btn sm" onclick="blockList()">🚫 Blocked IPs</button>
          <button class="btn sm off" onclick="if(confirm('Xoá TẤT CẢ events + counters?')){clearData()}">🗑 Clear Data</button>
        </div>
        <details><summary>📋 Quick Start — 3 bước setup</summary>
        <div class="details-body" style="font-size:13px;line-height:1.8">
          <b>1. 🤖 AI:</b> tab «AI» → chọn Custom → dán key (z.ai/model-api) → Lưu.<br>
          <b>2. 📱 Telegram:</b> @BotFather → /newbot → token → dán trên → Bật.<br>
          <b>3. 📊 Monitor:</b> refresh 3s realtime. Click AI chat (tab Visitors) xem full Q+A. Export CSV ở «Controls».
        </div></details>
      </section>
    </main>
  </div>
  <script>
  const TOKEN = new URLSearchParams(location.search).get('token') || '';
  const H = { 'X-Admin-Token': TOKEN };
  function el(tag, cls, txt){ const e=document.createElement(tag); if(cls) e.className=cls; if(txt!=null) e.textContent=txt; return e; }
  function statBlock(val, label, accent){ const s=el('span','stat'); const b=el('b'); b.textContent=val; if(accent) b.style.color=accent; s.appendChild(b); s.appendChild(el('span',null,label)); return s; }
  async function load(){
    const r = await fetch('/admin/api/stats?nocache=1', { headers: H });
    if (!r.ok) { document.getElementById('status').textContent='Lỗi '+r.status; return; }
    const d = await r.json();
    // [loop 1351] sound notification + flash khi event mới
    if (_lastCount > 0 && d.totals.all > _lastCount) {
      if (_soundOn) { try { var ctx = new (window.AudioContext||window.webkitAudioContext)(); var osc = ctx.createOscillator(); osc.frequency.value = 880; osc.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.15); } catch(se){} }
      // flash title
      document.title = '🔔 (' + d.totals.all + ') Admin — Bát Tự';
      setTimeout(function() { document.title = 'Admin — Bát Tự'; }, 3000);
    }
    _lastCount = d.totals.all;
    const st=document.getElementById('status'); st.textContent='';
    var eng=document.getElementById('engagement'); if(eng) eng.textContent='';
    var aik=document.getElementById('ai-kpis'); if(aik) aik.textContent='';
    // [loop 1362] PRIMARY KPI (overview headline — 5-second glance)
    st.appendChild(statBlock(d.totals.visit,'visits'));
    st.appendChild(statBlock(d.totals.chart,'lá số'));
    st.appendChild(statBlock(d.totals.ai_question,'AI hỏi'));
    if (d.totals.ai_chat) st.appendChild(statBlock(d.totals.ai_chat, '💬 chats', '#b478c8'));
    if (d.totals.error) st.appendChild(statBlock(d.totals.error, '⚠ lỗi JS', '#e0533d'));
    st.appendChild(statBlock(d.realUniqueIps||d.uniqueIps,'IP thật'+((d.bots||0)>0?' (bot:'+d.bots+')':'')));
    st.appendChild(statBlock(d.activeNow||0,'🔴 active', (d.activeNow||0)>0?'#7fbf7f':'#666'));
    st.appendChild(statBlock(d.aiEnabled?'BẬT':'TẮT','AI mode', d.aiEnabled?'#7fbf7f':'#c0392b'));
    var hb=document.getElementById('health'); if (hb) { hb.textContent='';
      var hItems=[];
      if (d.engagement && d.engagement.aiSuccessRate !== null) hItems.push([(d.engagement.aiSuccessRate>=50)+'', 'AI trả lời: '+d.engagement.aiSuccessRate+'%']);
      if (d.aiLatency && d.aiLatency.count >= 3) hItems.push([(d.aiLatency.p95Ms<60000)+'', 'AI latency p95: '+fmtMs(d.aiLatency.p95Ms)+' ('+d.aiLatency.count+' chat)']);
      hItems.push([(d.totals.error===0)+'', 'JS errors: '+d.totals.error]);
      if (d.engagement && d.engagement.avgLoadMs) hItems.push([(d.engagement.avgLoadMs<5000)+'', 'Load TB: '+(d.engagement.avgLoadMs/1000).toFixed(1)+'s']);
      if (d.engagement && d.engagement.bounceRate!=null) hItems.push([(d.engagement.bounceRate<60)+'', 'Bounce: '+d.engagement.bounceRate+'%']);
      hItems.forEach(function(it){ var r=el('div',null,(it[0]==='true'?'✅':'⚠️')+' '+it[1]); r.style.cssText='padding:3px 0;font-size:12px;color:var(--text)'; hb.appendChild(r); });
    }
    // [loop 1351] action alerts — guide admin fix issues
    var al=document.getElementById('alerts'); if (al) { al.textContent='';
      if (d.engagement && d.engagement.aiSuccessRate !== null && d.engagement.aiSuccessRate < 50 && d.totals.ai_question > 2) { var wa=el('div'); wa.style.cssText='padding:10px 14px;background:rgba(192,57,43,.15);border:1px solid rgba(192,57,43,.35);border-radius:8px;margin:0 0 10px;font-size:13px'; wa.appendChild(el('span',null,'⚠️ AI FAIL ('+d.engagement.aiSuccessRate+'%) — '+d.totals.ai_question+' câu hỏi không trả lời. Mở tab «AI» thêm API key.')); al.appendChild(wa); }
      if (d.engagement && d.engagement.avgLoadMs > 5000) { var wl=el('div'); wl.style.cssText='padding:10px 14px;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.25);border-radius:8px;margin:0 0 10px;font-size:13px'; wl.appendChild(el('span',null,'⚠️ Load chậm ('+(d.engagement.avgLoadMs/1000).toFixed(1)+'s TB) — cân nhắc tối ưu bundle.')); al.appendChild(wl); }
      if (d.aiLatency && d.aiLatency.count >= 3 && (d.aiLatency.maxMs > 90000 || d.aiLatency.p95Ms > 60000)) { var ws=el('div'); ws.style.cssText='padding:10px 14px;background:rgba(212,175,55,.12);border:1px solid rgba(212,175,55,.3);border-radius:8px;margin:0 0 10px;font-size:13px'; ws.appendChild(el('span',null,'🐢 AI CHẬM — max '+fmtMs(d.aiLatency.maxMs)+', p95 '+fmtMs(d.aiLatency.p95Ms)+'. User đợi lâu — tab «AI» đổi model/endpoint.')); al.appendChild(ws); }
    }
    // [loop 1362] ENGAGEMENT metrics → #engagement card (detail, tránh metric wall ở headline)
    if (eng) {
      if (d.engagement && d.engagement.aiSuccessRate !== null) eng.appendChild(statBlock(d.engagement.aiSuccessRate+'%', 'AI rate', d.engagement.aiSuccessRate < 50 ? '#c0392b' : '#7fbf7f'));
      if (d.engagement && d.engagement.returningVisitors) eng.appendChild(statBlock(d.engagement.returningVisitors, '🔄 quay lại', '#7fbf7f'));
      if (d.engagement) { eng.appendChild(statBlock(d.engagement.bounceRate+'%','bounce', d.engagement.bounceRate>60?'#c0392b':'#7fbf7f')); eng.appendChild(statBlock(d.engagement.avgEvents,'events/IP')); if (d.engagement.avgLoadMs) eng.appendChild(statBlock(d.engagement.avgLoadMs+'ms','⏱ load', d.engagement.avgLoadMs>3000?'#c0392b':'#7fbf7f')); eng.appendChild(statBlock(d.engagement.sessions||0,'sessions')); eng.appendChild(statBlock((d.engagement.avgSessionMin||0)+'min','⏱/sess')); }
    }
    // [loop 1362] AI latency + free model → #ai-kpis (tab AI)
    if (aik) {
      if (d.aiLatency) { aik.appendChild(statBlock(fmtMs(d.aiLatency.avgMs), 'AI ⏱ avg', d.aiLatency.avgMs>30000?'#c0392b':'#7fbf7f')); aik.appendChild(statBlock(fmtMs(d.aiLatency.p95Ms), 'AI ⏱ p95', d.aiLatency.p95Ms>60000?'#c0392b':'#d4af37')); aik.appendChild(statBlock(fmtMs(d.aiLatency.maxMs), 'AI ⏱ max', '#9a8a6a')); if (d.aiLatency.bailCount>0) aik.appendChild(statBlock(d.aiLatency.bailCount, '⏱ cắt 60s', '#e0533d')); }
      if (d.freeUsage) { aik.appendChild(statBlock(d.freeUsage.calls, '🆓 free calls', '#64b4ff')); if (d.freeUsage.today) aik.appendChild(statBlock(d.freeUsage.today, '🆓 free hôm nay', '#64b4ff')); if (d.freeUsage.err) aik.appendChild(statBlock(d.freeUsage.err, '🆓 free lỗi', d.freeUsage.err>0?'#e0533d':'#9a8a6a')); aik.appendChild(statBlock(d.freeUsage.enabled?'BẬT':'TẮT', '🆓 free mode', d.freeUsage.enabled?'#7fbf7f':'#c0392b')); }
    }
    const c=document.getElementById('controls'); c.textContent='';
    // [loop 1351] conversion funnel
    const fn=document.getElementById('funnel'); if (fn && d.funnel) { fn.textContent='';
      var denom=d.funnel.visitors||1;
      [['👥 Visit',d.funnel.visitors],['📊 Lập lá số',d.funnel.chartUsers],['💬 Hỏi AI',d.funnel.aiUsers]].forEach(function(it){
        var row=el('div'); row.style.cssText='display:flex;align-items:center;gap:8px;margin:4px 0;font-size:12px';
        var lab=el('span','tiny',it[0]); lab.style.flex='0 0 92px'; row.appendChild(lab);
        var track=el('div'); track.style.cssText='flex:1;height:16px;background:rgba(212,175,55,.08);border-radius:3px;overflow:hidden;min-width:0';
        var bar=el('div'); bar.style.cssText='height:100%;width:'+(denom?Math.round(it[1]/denom*100):0)+'%;background:#d4af37;min-width:3px'; track.appendChild(bar); row.appendChild(track);
        row.appendChild(el('span','tiny',it[1]+' ('+Math.round(it[1]/denom*100)+'%)'));
        fn.appendChild(row);
      });
    }
    const btn=el('button', d.aiEnabled?'btn off':'btn', d.aiEnabled?'⏸ Tắt AI toàn cục':'▶ Bật AI'); btn.onclick=()=>toggle(!d.aiEnabled); c.appendChild(btn);
    if (d.freeUsage) { const fb=el('button', d.freeUsage.enabled?'btn off':'btn', d.freeUsage.enabled?'🆫 Tắt free glm-5.2':'🆫 Bật free glm-5.2'); fb.style.marginLeft='8px'; fb.onclick=()=>toggleFree(!d.freeUsage.enabled); c.appendChild(fb); }
    const exp=el('a','btn','📥 Export CSV'); exp.href='/admin/api/export?token='+encodeURIComponent(TOKEN); exp.style.cssText='margin-left:8px;text-decoration:none;padding:9px 14px;display:inline-block'; c.appendChild(exp);
    const chg=el('button','btn','🔑 Đổi token'); chg.style.marginLeft='8px'; chg.onclick=function(){ var n=prompt('Token mới (≥8 ký tự):'); if(!n||n.length<8){if(n!==null)alert('Cần ≥8 ký tự');return;} fetch('/admin/api/token?token='+encodeURIComponent(TOKEN),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({new:n})}).then(function(r){return r.json()}).then(function(j){ if(j.ok){alert('Đã đổi! Đang chuyển sang token mới…'); location.href='/admin?token='+encodeURIComponent(n);} else alert('Lỗi: '+(j.err||'?')); }); }; c.appendChild(chg);
    const ft=document.getElementById('ftype').value;
    const evs = ft ? d.events.filter(e=>e.type===ft) : d.events;
    const tb=document.getElementById('events'); tb.textContent='';
    evs.forEach(function(e){
      const tr=el('tr');
      const td1=el('td','tiny',new Date(e.ts).toLocaleString('vi-VN')); tr.appendChild(td1);
      const td2=el('td'); const badge=el('span','badge b-'+(e.type||'other'), e.type); td2.appendChild(badge); tr.appendChild(td2);
      var tdIp=el('td','ip', e.ip||'?'); if(e.ip){tdIp.style.cursor='pointer';tdIp.title='Click xem chi tiết visitor';tdIp.onclick=function(){showVisitor(e.ip);};tdIp.onmouseenter=function(){tdIp.style.textDecoration='underline';};tdIp.onmouseleave=function(){tdIp.style.textDecoration='none';};} tr.appendChild(tdIp);
      tr.appendChild(el('td','tiny', (e.country||'?')+(e.city?' / '+e.city:'')));
      tr.appendChild(el('td','tiny', (function(){ if(!e.data) return ''; if(e.type==='ai_chat') return (e.data.source==='local'?'⚠ ':'')+'«'+String(e.data.q||'').slice(0,46)+'» → '+(e.data.source==='ai'?'🤖':'📦LOCAL')+(e.data.durationMs!=null?' '+fmtMs(e.data.durationMs):'')+(e.data.rounds?' · '+e.data.rounds+'v':'')+(e.data.bailed?' · BỊ CẮT':'')+(e.data.error?' · ERR: '+String(e.data.error).slice(0,80):'')+' — «click»'; if(e.type==='ai_question') return 'Q: '+String(e.data.q||'').slice(0,200); if(e.type==='chart') return '📊 '+String(e.data.dob||'')+' '+String(e.data.time||'')+' '+String(e.data.gender||'')+(e.data.score!=null?' · 🔢 '+e.data.score+'/100'+(e.data.grade?' ('+e.data.grade+')':''):''); if(e.type==='error') return '⚠ '+String(e.data.msg||'').slice(0,200); if(e.type==='click') return '🖱 '+String(e.data.id||'')+' ('+String(e.data.txt||'').slice(0,30)+')'; if(e.type==='visit'&&e.data.ref) return '← '+String(e.data.ref).slice(0,80); return JSON.stringify(e.data).slice(0,200); })()));
      // [loop 1352] ai_chat row click → modal full Q+A (không truncate)
      if (e.type==='ai_chat' && e.data) { tr.style.cursor='pointer'; tr.onmouseenter=function(){tr.style.background='rgba(212,175,55,.08)';}; tr.onmouseleave=function(){tr.style.background='';}; tr.onclick=function(){showChat(e.data.q, e.data.response, e.data.source, e.data.durationMs, e.ts, e.ip, e.data.rounds, e.data.bailed, e.data.detail);}; }
      tb.appendChild(tr);
    });
    // [loop 1351] hourly activity — 24 bars (giờ VN)
    var hl=document.getElementById('hourly'); if (hl && d.hourly) { hl.textContent=''; var mx=Math.max.apply(null,d.hourly.concat([1])); d.hourly.forEach(function(n,h){ var bar=el('div'); bar.style.cssText='flex:1;min-width:4px;background:'+(n>0?'#d4af37':'rgba(212,175,55,.1)')+';height:'+Math.max(2,Math.round(n/mx*36))+'px'; bar.title=h+'h: '+n+' visits'; hl.appendChild(bar); }); }
    // [visitor-finder] render visitor cards qua engine search/filter/sort (hàm vRender)
    _lastD = d; vRender();
    // [loop 1351] daily breakdown — mini bar chart 7 ngày
    const dl=document.getElementById('daily'); if (dl && d.daily) { dl.textContent='';
      const maxv=Math.max.apply(null, d.daily.map(function(x){return x.visit+x.chart+x.ai_question;}).concat([1]));
      d.daily.forEach(function(dy){
        const tot=dy.visit+dy.chart+dy.ai_question;
        const row=el('div'); row.style.cssText='display:flex;align-items:center;gap:8px;margin:3px 0;font-size:12px';
        var dt=el('span','tiny',dy.date); dt.style.flex='0 0 72px'; row.appendChild(dt);
        var track=el('div'); track.style.cssText='flex:1;height:14px;background:rgba(212,175,55,.06);border-radius:3px;overflow:hidden;min-width:0';
        const bar=el('div'); bar.style.cssText='height:100%;width:'+Math.round(tot/maxv*100)+'%;background:#d4af37'; track.appendChild(bar); row.appendChild(track);
        row.appendChild(el('span','tiny',tot+' (v:'+dy.visit+' c:'+dy.chart+' q:'+dy.ai_question+')'));
        dl.appendChild(row);
      });
    }
    // [loop 1352] 30-day trend — sparkline bars từ dayagg (retention dài hạn)
    var tr=document.getElementById('trend30'); if (tr && d.trend) { tr.textContent='';
      var active=d.trend.filter(function(x){return x.all>0;});
      var tmax=Math.max.apply(null,d.trend.map(function(x){return x.all;}).concat([1]));
      var sumAll=d.trend.reduce(function(a,x){return a+x.all;},0);
      var sumVis=d.trend.reduce(function(a,x){return a+x.visit;},0);
      var sumChart=d.trend.reduce(function(a,x){return a+x.chart;},0);
      var sumAi=d.trend.reduce(function(a,x){return a+x.ai_chat;},0);
      var sumErr=d.trend.reduce(function(a,x){return a+x.error;},0);
      var hdr=el('div','tiny','30 ngày: '+sumAll+' events · '+sumVis+' visits · '+sumChart+' lá số · '+sumAi+' AI chat'+(sumErr?' · '+sumErr+' lỗi':'')+' · '+active.length+'/'+30+' ngày có activity'); hdr.style.cssText='margin-bottom:6px';
      tr.appendChild(hdr);
      // [loop 1363] 30-day trend — SVG area+line (mượt, chuyên nghiệp hơn thin bars)
      var SVGNS='http://www.w3.org/2000/svg', W=100, H=42;
      var coords=d.trend.map(function(x,i){return [(i/(d.trend.length-1))*W, H-(x.all/tmax*(H-4))-2];});
      var polyPts=coords.map(function(p){return p[0].toFixed(2)+','+p[1].toFixed(2);}).join(' ');
      var svg=document.createElementNS(SVGNS,'svg');
      svg.setAttribute('viewBox','0 0 '+W+' '+H); svg.setAttribute('preserveAspectRatio','none');
      svg.style.cssText='width:100%;height:64px;display:block;margin:6px 0 2px';
      var area=document.createElementNS(SVGNS,'polygon');
      area.setAttribute('points','0,'+H+' '+polyPts+' '+W+','+H);
      area.setAttribute('fill','rgba(212,175,55,.16)'); svg.appendChild(area);
      var ln=document.createElementNS(SVGNS,'polyline');
      ln.setAttribute('points',polyPts); ln.setAttribute('fill','none'); ln.setAttribute('stroke','#e6c14a');
      ln.setAttribute('stroke-width','2'); ln.setAttribute('vector-effect','non-scaling-stroke');
      ln.setAttribute('stroke-linejoin','round'); ln.setAttribute('stroke-linecap','round'); svg.appendChild(ln);
      tr.appendChild(svg);
      var xlab=el('div','tiny',''); xlab.style.cssText='display:flex;justify-content:space-between;margin-top:2px';
      xlab.appendChild(el('span',null,d.trend[0].date.slice(5))); xlab.appendChild(el('span',null,'hôm nay'));
      tr.appendChild(xlab);
    }
    // [loop 1357] free glm-5.2 usage — summary + top IP + recent calls
    var fu=document.getElementById('free-usage'); if (fu && d.freeUsage) { fu.textContent='';
      var u=d.freeUsage;
      var summary=el('div','tiny', 'Tổng: '+u.calls+' calls · ✅ '+u.ok+' OK · ❌ '+u.err+' lỗi · Hôm nay: '+u.today+' · Mode: '+(u.enabled?'BẬT':'TẮT')); summary.style.marginBottom='6px'; fu.appendChild(summary);
      // [loop 1359] 7-day free calls sparkline (từ trend.dayagg free_calls) — xem growth quota
      if (d.trend) {
        var last7=d.trend.slice(-7);
        var fmax=Math.max.apply(null,last7.map(function(x){return x.free_calls;}).concat([1]));
        var sb=el('div'); sb.style.cssText='display:flex;align-items:flex-end;gap:2px;height:36px;margin:4px 0 8px';
        last7.forEach(function(x){ var b=el('div'); b.style.cssText='flex:1;min-width:18px;background:'+(x.free_calls>0?'#64b4ff':'rgba(100,180,255,.12)')+';height:'+Math.max(2,Math.round(x.free_calls/fmax*32))+'px;border-radius:2px'; b.title=x.date+': '+x.free_calls+' free calls'+(x.free_err?' ('+x.free_err+' lỗi)':''); sb.appendChild(b); });
        fu.appendChild(sb);
      }
      if (u.topIps && u.topIps.length) {
        var tip=el('div','tiny','🌐 Top IP dùng free:'); tip.style.marginTop='4px'; fu.appendChild(tip);
        u.topIps.forEach(function(t){ var r=el('div','tiny', t.count+'× '+t.ip); r.style.paddingLeft='10px'; fu.appendChild(r); });
      }
      if (d.freeRecent && d.freeRecent.length) {
        var rl=el('details'); rl.style.marginTop='4px';
        var rs=el('summary','tiny','Lịch sử calls gần đây ('+Math.min(d.freeRecent.length,20)+')'); rs.style.cursor='pointer'; rs.style.color='#d4af37'; rl.appendChild(rs);
        d.freeRecent.slice(0,20).forEach(function(c){ var row=el('div','tiny', new Date(c.ts).toLocaleString('vi-VN')+' · '+c.ip+' · HTTP '+c.status+(c.status>=200&&c.status<300?' ✅':' ❌')); row.style.padding='1px 0 1px 8px'; row.style.borderLeft='1px solid rgba(100,180,255,.15)'; rl.appendChild(row); });
        fu.appendChild(rl);
      }
      if (!u.calls) fu.appendChild(el('div','tiny','(chưa có call nào — user chưa dùng AI free, hoặc admin đang dùng custom key)'));
    }
    // [loop 1366] mệnh cách tổng hợp — «số mệnh» tập thể những người lập lá số
    var dy=document.getElementById('destiny'); if (dy && d.destiny) { dy.textContent='';
      var dd=d.destiny;
      var head=el('div'); head.style.cssText='display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin-bottom:8px';
      var ab=el('div'); ab.style.cssText='text-align:center;min-width:64px';
      var avgN=el('div'); avgN.style.cssText='font-size:38px;font-weight:800;color:'+(dd.avg>=60?'#7fbf7f':dd.avg>=40?'#d4af37':'#e0533d')+';line-height:1'; avgN.textContent=dd.avg; ab.appendChild(avgN);
      ab.appendChild(el('div','tiny','avg /100')); head.appendChild(ab);
      var stt=el('div'); stt.style.cssText='font-size:11.5px;line-height:1.7;color:var(--muted)';
      stt.appendChild(el('div',null,'min '+dd.min+' · max '+dd.max+' · median '+dd.median+' · p25 '+dd.p25+' · p75 '+dd.p75));
      stt.appendChild(el('div',null,dd.count+' lá số có điểm · 日主 vượng '+dd.strongRate+'%')); head.appendChild(stt);
      dy.appendChild(head);
      var hmax=Math.max.apply(null, dd.histogram.map(function(h){return h.count;}).concat([1]));
      var hb=el('div'); hb.style.cssText='display:flex;align-items:flex-end;gap:6px;height:52px;margin:6px 0 2px';
      dd.histogram.forEach(function(h){ var col=h.bucket.indexOf('80')===0?'#7fbf7f':h.bucket.indexOf('60')===0?'#d4af37':h.bucket.indexOf('40')===0?'#c8a44a':'#9a8a6a'; var b=el('div'); b.style.cssText='flex:1;display:flex;flex-direction:column;align-items:center;gap:2px'; var bar=el('div'); bar.style.cssText='width:100%;max-width:64px;background:'+col+';height:'+Math.max(2,Math.round(h.count/hmax*44))+'px;border-radius:3px 3px 0 0'; bar.title=h.bucket+': '+h.count+' lá'; b.appendChild(bar); b.appendChild(el('div','tiny',h.count)); hb.appendChild(b); });
      dy.appendChild(hb);
      var hl=el('div'); hl.style.cssText='display:flex;gap:6px'; dd.histogram.forEach(function(h){var l=el('span','tiny',h.bucket);l.style.cssText='flex:1;text-align:center';hl.appendChild(l);}); dy.appendChild(hl);
      var grid=el('div'); grid.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px;margin-top:14px';
      if (dd.grades.length) { var g=el('div'); g.appendChild(el('div','tiny','PHÂN BỐ GRADE')); g.firstChild.style.cssText='color:#d4af37;font-weight:600;margin-bottom:4px'; dd.grades.slice(0,6).forEach(function(x){g.appendChild(el('div','tiny',x.count+'× '+x.grade));}); grid.appendChild(g); }
      if (dd.patternQs.length) { var p=el('div'); p.appendChild(el('div','tiny','CÁCH CỤC')); p.firstChild.style.cssText='color:#d4af37;font-weight:600;margin-bottom:4px'; var map={'成格':'成格 nguyên vẹn','有救':'有救 có cứu','败格':'败格 vỡ','特殊':'特殊 đặc biệt'}; dd.patternQs.forEach(function(x){p.appendChild(el('div','tiny',x.count+'× '+(map[x.q]||x.q)));}); grid.appendChild(p); }
      if (dd.yongs.length) { var yc=el('div'); yc.appendChild(el('div','tiny','DỤNG THẦN')); yc.firstChild.style.cssText='color:#d4af37;font-weight:600;margin-bottom:4px'; dd.yongs.forEach(function(x){yc.appendChild(el('div','tiny',x.count+'× '+x.y));}); grid.appendChild(yc); }
      dy.appendChild(grid);
      if (dd.top.length) { var t=el('details'); t.style.cssText='margin-top:10px'; var ts=el('summary','tiny','🏆 Mệnh cao nhất ('+dd.top.length+')'); ts.style.cssText='color:#d4af37;cursor:pointer'; t.appendChild(ts); dd.top.forEach(function(x){t.appendChild(el('div','tiny',x.score+'/100 · '+(x.dob||'?')+' '+(x.gender||'')+(x.grade?' · '+x.grade:'')));}); dy.appendChild(t); }
      if (dd.bottom.length) { var bo=el('details'); bo.style.cssText='margin-top:4px'; var bs=el('summary','tiny','🔻 Mệnh thấp nhất ('+dd.bottom.length+')'); bs.style.cssText='color:#d4af37;cursor:pointer'; bo.appendChild(bs); dd.bottom.forEach(function(x){bo.appendChild(el('div','tiny',x.score+'/100 · '+(x.dob||'?')+' '+(x.gender||'')+(x.grade?' · '+x.grade:'')));}); dy.appendChild(bo); }
    } else if (dy) { dy.textContent=''; dy.appendChild(el('div','tiny','(chưa có lá số nào có điểm — user mới lập lá số sẽ hiện đây. Điểm mệnh cách tính khi user submit.)')); }
    // [loop 1388] device fingerprint — group theo sid, detect nhiều IP
    var dg=document.getElementById('device-groups'); if (dg && d.deviceGroups) { dg.textContent='';
      var multi=d.deviceGroups.filter(function(g){return g.ipCount>1;});
      if (multi.length) { var warn=el('div'); warn.style.cssText='padding:8px 12px;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.25);border-radius:8px;margin-bottom:8px;font-size:12px'; warn.appendChild(el('span',null,'⚠️ '+multi.length+' thiết bị dùng nhiều IP (VPN/chuyển mạng) — xem dưới')); dg.appendChild(warn); }
      if (!d.deviceGroups.length) { dg.appendChild(el('div','tiny','(chưa có data — visitor mới (có sid) sẽ hiện)')); }
      d.deviceGroups.slice(0, 20).forEach(function(g) {
        var card=el('div'); card.style.cssText='background:'+(g.ipCount>1?'rgba(192,57,43,.06)':'rgba(212,175,55,.04)')+';border:1px solid '+(g.ipCount>1?'rgba(192,57,43,.2)':'rgba(212,175,55,.12)')+';border-radius:8px;padding:8px 12px;margin:5px 0';
        var head=el('div'); head.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap';
        head.appendChild(el('span','tiny',(g.ipCount>1?'⚠ ':'📱 ')+g.device+' · '+g.count+' events · '+g.ipCount+' IP'));
        head.appendChild(el('span','tiny',new Date(g.firstTs).toLocaleDateString('vi-VN')+' → '+new Date(g.lastTs).toLocaleDateString('vi-VN')));
        card.appendChild(head);
        g.ips.forEach(function(ip) {
          var ipRow=el('div','tiny','  '+ip.ip+' ('+ip.count+'×)');
          ipRow.style.cssText='padding:1px 0 1px 12px;font-family:monospace;color:#7fbf7f';
          card.appendChild(ipRow);
        });
        dg.appendChild(card);
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
      if (d.topClicks && d.topClicks.length) { var col4=el('div'); col4.style.cssText='flex:1;min-width:180px'; col4.appendChild(el('h4',null,'🖱 Feature clicks')); d.topClicks.forEach(function(c){ col4.appendChild(el('div','tiny', c.count+'× '+c.id)); }); tq.appendChild(col4); }
      if (d.referrerConversion && d.referrerConversion.length) { d.referrerConversion.forEach(function(r){ col3.appendChild(el('div','tiny', '  → '+r.chartRate+'% chart ('+r.charts+'/'+r.visits+')')); }); }
    }
  }
  // ===== [visitor-finder] SEARCH + FILTER + SORT + NOTE/TAG ENGINE =====
  var _lastD = null;
  function _vf(){ return {
    q:(document.getElementById('vq').value||'').toLowerCase().trim(),
    gender:document.getElementById('vf-gender').value,
    country:document.getElementById('vf-country').value,
    sort:document.getElementById('vf-sort').value,
    chart:document.getElementById('vf-chart').checked, chat:document.getElementById('vf-chat').checked, hasQ:document.getElementById('vf-q').checked,
    note:document.getElementById('vf-note').checked, tag:document.getElementById('vf-tag').checked, name:document.getElementById('vf-name').checked, ret:document.getElementById('vf-ret').checked,
    smin:document.getElementById('vf-smin').value!==''?parseInt(document.getElementById('vf-smin').value,10):null,
    smax:document.getElementById('vf-smax').value!==''?parseInt(document.getElementById('vf-smax').value,10):null,
    from:document.getElementById('vf-from').value?new Date(document.getElementById('vf-from').value).getTime():null,
    to:document.getElementById('vf-to').value?new Date(document.getElementById('vf-to').value).getTime()+86400000:null,
  }; }
  function _bestScore(v){ var sc=(v.charts||[]).map(function(c){return c.score;}).filter(function(s){return s!=null;}); return sc.length?Math.max.apply(null,sc):null; }
  function _vHay(v){ var refEv=(v.timeline||[]).find(function(t){return t.type==='visit'&&t.data&&t.data.ref;}); var ref=refEv?(' '+refEv.data.ref):'';
    return [v.name,v.ip,v.country,v.city,v.device,v.note,(v.tags||[]).join(' '),(v.charts||[]).map(function(c){return (c.dob||'')+' '+(c.time||'')+' '+(c.gender||'')+' '+(c.name||'')+' '+(c.score!=null?c.score:'')+' '+(c.grade||'')+' '+(c.patternQ||'')+' '+(c.yong||'');}).join(' '),(v.questions||[]).join(' '),(v.chats||[]).map(function(c){return (c.q||'')+' '+(c.response||'');}).join(' '),ref].join(' ').toLowerCase(); }
  function _vHit(v,f){ if(!f.q)return true; var hay=_vHay(v); return f.q.split(/\\s+/).every(function(t){return t&&hay.indexOf(t)>=0;}); }
  function _vMatch(v,f){
    if(!_vHit(v,f))return false;
    if(f.gender&&!(v.charts||[]).some(function(c){return c.gender===f.gender;}))return false;
    if(f.country&&v.country!==f.country)return false;
    if(f.chart&&!(v.charts&&v.charts.length))return false;
    if(f.chat&&!(v.chats&&v.chats.length))return false;
    if(f.hasQ&&!(v.questions&&v.questions.length))return false;
    if(f.note&&!v.note)return false;
    if(f.tag&&!(v.tags&&v.tags.length))return false;
    if(f.name&&!v.name)return false;
    if(f.ret&&!v.returning)return false;
    var sc=_bestScore(v);
    if(f.smin!=null&&(sc==null||sc<f.smin))return false;
    if(f.smax!=null&&(sc==null||sc>f.smax))return false;
    if(f.from!=null&&v.lastTs<f.from)return false;
    if(f.to!=null&&v.firstTs>f.to)return false;
    return true;
  }
  function _vCard(v){
    var card=el('div'); card.style.cssText='background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:10px 14px;margin:6px 0;cursor:pointer;transition:border-color .15s,transform .1s;position:relative';
    card.onmouseenter=function(){card.style.borderColor='var(--border2)';card.style.transform='translateX(2px)';}; card.onmouseleave=function(){card.style.borderColor='var(--border)';card.style.transform='none';};
    card.onclick=function(){showVisitor(v.ip);};
    var r1=el('div'); r1.style.cssText='display:flex;align-items:center;gap:8px;flex-wrap:wrap';
    if(v.name){var nm=el('span',null,v.name); nm.style.cssText='color:var(--gold);font-weight:700'; r1.appendChild(nm);}
    var ipE=el('span','ip',v.ip); ipE.style.cssText='font-weight:700'; r1.appendChild(ipE);
    if(v.returning){var rb=el('span','badge','🔄 quen'); rb.style.cssText='background:rgba(127,191,127,.2);color:#7fbf7f'; r1.appendChild(rb);}
    if(v.note){var nb=el('span','badge','📝'); nb.style.cssText='background:rgba(212,175,55,.2);color:#d4af37'; nb.title=v.note; r1.appendChild(nb);}
    (v.tags||[]).forEach(function(t){var tb=el('span','badge','🏷 '+t); tb.style.cssText='background:rgba(100,180,255,.15);color:#64b4ff'; r1.appendChild(tb);});
    card.appendChild(r1);
    var r2=el('div','tiny',(v.country||'?')+(v.city?' / '+v.city:'')+' · '+(v.device||''));
    card.appendChild(r2);
    (v.charts||[]).slice(0,3).forEach(function(c){
      var cr=el('div','tiny','📊 '+(c.dob||'?')+' '+(c.time||'')+' '+(c.gender||'')+(c.name?' · '+c.name:'')+(c.score!=null?' · 🔢 '+c.score+'/100':'')+(c.grade?' ('+c.grade+')':'')+(c.patternQ?' '+c.patternQ:'')+(c.yong?' Dụng '+c.yong:''));
      var a=el('a','btn'); a.textContent='🔗'; a.target='_blank'; a.rel='noopener'; a.href='/?dob='+encodeURIComponent(c.dob||'')+'&time='+encodeURIComponent(c.time||'12:00')+'&g='+encodeURIComponent(c.gender||'nam')+'&from=admin&nolog=1'; a.style.cssText='padding:1px 6px;font-size:10px;text-decoration:none;margin-left:6px'; a.onclick=function(e){e.stopPropagation();}; cr.appendChild(a); card.appendChild(cr);
    });
    var sc=_bestScore(v);
    card.appendChild(el('div','tiny',(v.count||0)+' ev · '+(v.visits||0)+' visit · '+(v.charts||[]).length+'📊'+(sc!=null?' '+sc:'')+' · '+(v.questions||[]).length+'❓ · '+(v.chats||[]).length+'💬'));
    if(v.note){var np=el('div','tiny','📝 '+(v.note.length>90?v.note.slice(0,90)+'…':v.note)); np.style.cssText='font-style:italic;color:#d4af37'; card.appendChild(np);}
    if((v.questions||[]).length){var qp=el('div','tiny','❓ «'+String(v.questions[v.questions.length-1]).slice(0,80)+'»'); qp.style.cssText='color:var(--muted)'; card.appendChild(qp);}
    card.appendChild(el('div','tiny','⏱ '+new Date(v.firstTs).toLocaleString('vi-VN')+' → '+new Date(v.lastTs).toLocaleString('vi-VN')));
    var ed=el('button','btn'); ed.textContent='✏️'; ed.style.cssText='position:absolute;right:8px;top:8px;padding:1px 7px;font-size:11px;opacity:.6';
    ed.onmouseenter=function(){ed.style.opacity='1';}; ed.onmouseleave=function(){ed.style.opacity='.6';};
    ed.onclick=(function(ip){return function(e){e.stopPropagation();editNote(ip);};})(v.ip); card.appendChild(ed);
    var bk=el('button','btn'); bk.textContent='🚫'; bk.style.cssText='position:absolute;right:42px;top:8px;padding:1px 5px;font-size:10px;opacity:.4';
    bk.onmouseenter=function(){bk.style.opacity='1';}; bk.onmouseleave=function(){bk.style.opacity='.4';};
    bk.onclick=(function(ip){return function(e){e.stopPropagation();if(confirm('Block IP '+ip+'?'))blockIp(ip,1);};})(v.ip); card.appendChild(bk);
    return card;
  }
  function vRender(){
    var d=_lastD; if(!d)return; var f=_vf();
    var arr=(d.byIp||[]).slice();
    arr.sort(function(a,b){
      switch(f.sort){
        case 'old':return a.lastTs-b.lastTs;
        case 'scorehi':return (_bestScore(b)||-1)-(_bestScore(a)||-1);
        case 'scorelo':return (_bestScore(a)||101)-(_bestScore(b)||101);
        case 'charts':return (b.charts||[]).length-(a.charts||[]).length;
        case 'qs':return (b.questions||[]).length-(a.questions||[]).length;
        case 'named':return (a.name?0:1)-(b.name?0:1)||b.lastTs-a.lastTs;
        case 'note':return (a.note?0:1)-(b.note?0:1)||b.lastTs-a.lastTs;
        default:return b.lastTs-a.lastTs;
      }
    });
    var matched=arr.filter(function(v){return _vMatch(v,f);});
    var bip=document.getElementById('byip'); if(bip){bip.textContent='';
      var vc=document.getElementById('vcount'); if(vc) vc.textContent=matched.length+' / '+arr.length+' visitor';
      if(!matched.length) bip.appendChild(el('div','tiny','(không khớp — bớt filter hoặc bấm «✕ lọc»)'));
      matched.slice(0,200).forEach(function(v){ bip.appendChild(_vCard(v)); });
    }
    var tc=document.getElementById('vtagcloud'); if(tc){tc.textContent='';
      (d.tagCloud||[]).slice(0,20).forEach(function(t){ var chip=el('span','badge','🏷 '+t.tag+' '+t.count); chip.style.cssText='background:rgba(100,180,255,.12);color:#64b4ff;cursor:pointer;margin:2px'; chip.title='Lọc theo tag «'+t.tag+'»'; chip.onclick=function(){document.getElementById('vq').value=t.tag;vRender();}; tc.appendChild(chip); });
      if(!(d.tagCloud||[]).length) tc.appendChild(el('span','tiny','(chưa có tag — thêm ở nút ✏️ mỗi visitor)'));
    }
    var csel=document.getElementById('vf-country'); if(csel && !csel.options.length){ var cs={}; (d.byIp||[]).forEach(function(v){if(v.country)cs[v.country]=1;}); Object.keys(cs).sort().forEach(function(c){var o=document.createElement('option');o.value=c;o.textContent=c;csel.appendChild(o);}); }
    var pr=document.getElementById('profiles'); if(pr){pr.textContent='';
      var profs=(d.profiles||[]);
      var pf=profs.filter(function(p){if(!f.q)return true;var hay=((p.name||'')+' '+(p.dob||'')+' '+(p.gender||'')+' '+(p.grade||'')+' '+(p.score!=null?p.score:'')).toLowerCase();return f.q.split(/\\s+/).every(function(t){return t&&hay.indexOf(t)>=0;});});
      if(!pf.length){pr.appendChild(el('div','tiny','(chưa có tên nào — khách nhập tên (tùy chọn) khi lập lá số sẽ hiện đây, bền vững qua rollover)'));}
      else{ var cnt=el('div','tiny',pf.length+' tên'+(pf.length<profs.length?' (trong '+profs.length+' đã lưu)':'')); cnt.style.marginBottom='6px'; pr.appendChild(cnt);
        pf.slice(0,100).forEach(function(p){ var row=el('div'); row.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid rgba(212,175,55,.06);flex-wrap:wrap';
          row.appendChild(el('span','tiny','👤 '+(p.name||'?')+' · '+(p.dob||'?')+' '+(p.time||'')+' '+(p.gender||'')+(p.score!=null?' · '+p.score+'/100':'')+(p.grade?' '+p.grade:'')+(p.yong?' Dụng '+p.yong:'')));
          var a=el('a','btn'); a.textContent='🔗 Mở lá số'; a.target='_blank'; a.rel='noopener'; a.href='/?dob='+encodeURIComponent(p.dob||'')+'&time='+encodeURIComponent(p.time||'12:00')+'&g='+encodeURIComponent(p.gender||'nam')+'&from=admin&nolog=1'; a.style.cssText='padding:3px 9px;font-size:11px;text-decoration:none;white-space:nowrap'; row.appendChild(a); pr.appendChild(row); });
      }
    }
  }
  function vReset(){ ['vq','vf-smin','vf-smax','vf-from','vf-to'].forEach(function(id){var e=document.getElementById(id);if(e)e.value='';}); ['vf-gender','vf-country','vf-sort'].forEach(function(id){var e=document.getElementById(id);if(e)e.selectedIndex=0;}); ['vf-chart','vf-chat','vf-q','vf-note','vf-tag','vf-name','vf-ret'].forEach(function(id){var e=document.getElementById(id);if(e)e.checked=false;}); vRender(); }
  function editNote(ip){
    var d=_lastD||{}; var n=(d.notes&&d.notes[ip])||{}; var note=n.note||''; var tags=((n.tags)||[]).slice();
    var m=document.getElementById('note-modal'); if(!m)return; m.textContent='';
    var box=el('div'); box.style.cssText='background:#15131f;border:1px solid #d4af37;border-radius:12px;padding:18px 22px;max-width:560px;width:calc(100% - 40px);max-height:85vh;overflow:auto';
    var h=el('div'); h.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px;border-bottom:1px solid rgba(212,175,55,.2);padding-bottom:8px;flex-wrap:wrap';
    var hl=el('div'); hl.appendChild(el('div',null,'📝 Ghi chú & 🏷️ Tag')); var ipE=el('div','ip',ip); ipE.style.fontSize='12px'; hl.appendChild(ipE); h.appendChild(hl);
    var close=el('button','btn','✕ Đóng'); close.style.cssText='padding:4px 12px;font-size:12px'; close.onclick=function(){m.style.display='none';}; h.appendChild(close); box.appendChild(h);
    var ta=el('textarea'); ta.value=note; ta.placeholder='Ghi chú tự do — vd: «Nguyễn A — hỏi hôn nhân 2026, khuyên quay lại tháng 8»...'; ta.style.cssText='width:100%;height:90px;margin:6px 0;background:rgba(0,0,0,.3);border:1px solid rgba(212,175,55,.2);color:#e8d9b0;border-radius:6px;padding:8px;box-sizing:border-box;font-family:inherit;font-size:13px;resize:vertical'; box.appendChild(ta);
    box.appendChild(el('div','tiny','🏷 Tag (gõ + Enter, hoặc click gợi ý / ✕ để xóa) — tối đa 10 tag'));
    var chipBox=el('div'); chipBox.style.cssText='display:flex;flex-wrap:wrap;gap:5px;margin:4px 0 8px'; box.appendChild(chipBox);
    function renderChips(){ chipBox.textContent=''; tags.forEach(function(t,i){ var c=el('span','badge','🏷 '+t); c.style.cssText='background:rgba(100,180,255,.15);color:#64b4ff;display:inline-flex;align-items:center;gap:4px'; var x=el('span',null,'✕'); x.style.cursor='pointer'; x.onclick=function(){tags.splice(i,1);renderChips();}; c.appendChild(x); chipBox.appendChild(c); }); }
    renderChips();
    var sug=el('div','tiny','Gợi ý:'); sug.style.marginTop='4px';
    (((_lastD||{}).tagCloud)||[]).slice(0,12).forEach(function(t){ var s=el('span','badge','+'+t.tag); s.style.cssText='background:rgba(212,175,55,.1);color:#d4af37;cursor:pointer;margin:2px'; s.onclick=function(){if(tags.indexOf(t.tag)<0&&tags.length<10)tags.push(t.tag);renderChips();}; sug.appendChild(s); });
    box.appendChild(sug);
    var inp=el('input','filter'); inp.placeholder='thêm tag…'; inp.style.cssText='width:160px;margin-top:6px'; inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();var v=inp.value.trim();if(v&&tags.indexOf(v)<0&&tags.length<10)tags.push(v.slice(0,20));inp.value='';renderChips();}}); box.appendChild(inp);
    var act=el('div'); act.style.cssText='margin-top:10px;display:flex;gap:8px;justify-content:flex-end';
    var dl=el('button','btn off','🗑 Xóa'); dl.style.cssText='padding:6px 12px;font-size:12px'; dl.onclick=function(){ if(confirm('Xóa ghi chú + tag của «'+ip+'»?')){ _saveNote(ip,'',[]); } };
    var sv=el('button','btn','💾 Lưu'); sv.style.cssText='padding:6px 16px;font-size:13px'; sv.onclick=function(){ _saveNote(ip, ta.value.trim(), tags); };
    act.appendChild(dl); act.appendChild(sv); box.appendChild(act);
    m.appendChild(box); m.style.display='flex';
    function _saveNote(ip2,note2,tags2){ sv.textContent='⏳...'; sv.disabled=true; fetch('/admin/api/note?token='+TOKEN,{method:'POST',headers:Object.assign({},H,{'Content-Type':'application/json'}),body:JSON.stringify({ip:ip2,note:note2,tags:tags2})}).then(function(r){return r.json();}).then(function(j){ sv.textContent='💾 Lưu'; sv.disabled=false; if(j.ok){m.style.display='none';load();loadAudit();} else alert('❌ '+(j.err||'lỗi')); }).catch(function(){sv.textContent='💾 Lưu';sv.disabled=false;alert('❌ lỗi mạng');}); }
  }
  async function toggle(en){ await fetch('/admin/api/ai', { method:'POST', headers:{...H,'Content-Type':'application/json'}, body: JSON.stringify({enabled:en}) }); load(); loadAudit(); }
  async function toggleFree(en){ await fetch('/admin/api/ai-free?token='+TOKEN, { method:'POST', headers:{...H,'Content-Type':'application/json'}, body: JSON.stringify({enabled:en}) }); load(); loadAudit(); }
  // [loop 1360] test free glm-5.2 trực tiếp — admin thấy model sống/chết + tốc độ
  async function freeTest(){
    var rEl=document.getElementById('free-test-result'); if(rEl){rEl.textContent='⏳ đang test...';rEl.style.color='#d4af37';}
    var r=await fetch('/admin/api/free-test?token='+TOKEN,{method:'POST',headers:H}).then(function(r){return r.json();}).catch(function(e){return {ok:false,err:e.message};});
    if(rEl){ rEl.textContent = r.ok ? ('✅ HTTP '+r.status+' · '+r.durationMs+'ms'+(r.tokens?' · '+r.tokens+' tokens':'')+(r.preview?' · «'+String(r.preview).slice(0,40)+'»':'')) : ('❌ '+(r.err||('HTTP '+r.status))+' · '+(r.durationMs||'?')+'ms'); rEl.style.color=r.ok?'#7fbf7f':'#e0533d'; }
  }
  var _lastCount = 0; var _soundOn = false;
  load(); setInterval(load, 3000);
  async function tgSave(){ var t=document.getElementById('tg-token').value.trim(),c=document.getElementById('tg-chat').value.trim(); if(!t||!c){alert('Nhập token + chat ID');return;} var r=await fetch('/admin/api/notify?token='+TOKEN,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tg_token:t,tg_chat:c})}).then(function(r){return r.json()}); alert(r.enabled?'✅ Telegram alert ĐÃ BẬT!':'❌ Lỗi'); }
  async function tgOff(){ await fetch('/admin/api/notify?token='+TOKEN,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({disable:true})}); alert('Telegram alert đã tắt'); }
  async function aiLoad(){ var r=await fetch('/admin/api/ai-config?token='+TOKEN).then(function(r){return r.json()}); var c=r.config||{}; document.getElementById('ai-mode').value=c.mode||'free'; document.getElementById('ai-endpoint').value=c.endpoint||'https://api.z.ai/api/coding/paas/v4'; document.getElementById('ai-apikey').value=''; document.getElementById('ai-apikey').placeholder=c.apiKey?'Đã đặt ('+c.apiKey+')':'API Key (dán từ z.ai/model-api)'; document.getElementById('ai-model').value=c.model||'glm-5.2'; document.getElementById('ai-status').textContent='Mode: '+(c.mode||'free')+(c.apiKey?' | Key: '+c.apiKey:' | No key'); aiModeChange(); }
  function aiModeChange(){ var m=document.getElementById('ai-mode').value; var dis=m==='off'; ['ai-endpoint','ai-apikey','ai-model'].forEach(function(id){document.getElementById(id).disabled=dis;}); }
  async function aiSave(){ var body={mode:document.getElementById('ai-mode').value}; if(document.getElementById('ai-endpoint').value)body.endpoint=document.getElementById('ai-endpoint').value; if(document.getElementById('ai-apikey').value)body.apiKey=document.getElementById('ai-apikey').value; if(document.getElementById('ai-model').value)body.model=document.getElementById('ai-model').value; var r=await fetch('/admin/api/ai-config?token='+TOKEN,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(r){return r.json()}); alert(r.ok?'✅ AI config đã lưu!':'❌ Lỗi'); aiLoad(); load(); }
  // [loop 1376] free model pool — load + render + add + save
  var _freePool = [];
  async function fpLoad(){ var r=await fetch('/admin/api/ai-config?token='+TOKEN).then(function(r){return r.json()}).catch(function(){return {config:{}}}); var c=r.config||{}; _freePool=Array.isArray(c.freePool)?c.freePool:[]; fpRender(); }
  function fpRender(){ var lst=document.getElementById('free-pool-list'); if(!lst)return; lst.textContent=''; if(!_freePool.length){lst.appendChild(el('div','tiny','(chưa có backend free nào — thêm NVIDIA/Groq bên dưới. cf-glm luôn là fallback cuối.)'));return;} _freePool.forEach(function(p,i){ var row=el('div'); row.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid rgba(212,175,55,.08);flex-wrap:wrap'; var info=el('span','tiny',(p.name||'?')+' · '+p.endpoint+' · '+p.model+(p.apiKey?' · '+p.apiKey:'')); row.appendChild(info); var rm=el('button','btn off'); rm.textContent='✕'; rm.style.cssText='padding:2px 7px;font-size:10px'; rm.onclick=(function(idx){return function(){_freePool.splice(idx,1);fpRender();};})(i); row.appendChild(rm); lst.appendChild(row); }); }
  function fpAdd(){ var name=document.getElementById('fp-name').value.trim(), endpoint=document.getElementById('fp-endpoint').value.trim(), model=document.getElementById('fp-model').value.trim(), key=document.getElementById('fp-key').value.trim(); if(!endpoint||!model||!key){alert('Cần endpoint + model + key');return;} _freePool.push({name:name||'backend-'+(_freePool.length+1),endpoint:endpoint,model:model,apiKey:key}); document.getElementById('fp-name').value='';document.getElementById('fp-endpoint').value='';document.getElementById('fp-model').value='';document.getElementById('fp-key').value=''; fpRender(); }
  async function fpSave(){ var st=document.getElementById('fp-status'); if(st){st.textContent='⏳ đang lưu...';st.style.color='#d4af37';} var r=await fetch('/admin/api/free-pool?token='+TOKEN,{method:'POST',headers:{...H,'Content-Type':'application/json'},body:JSON.stringify({pool:_freePool})}).then(function(r){return r.json()}).catch(function(e){return {ok:false,err:e.message};}); if(r.ok&&st){_freePool=r.pool||_freePool;fpRender();st.textContent='✅ Đã lưu '+(_freePool.length)+' backend. App tự dùng pool + cf-glm.';st.style.color='#7fbf7f';} else if(st){st.textContent='❌ '+(r.err||'lỗi');st.style.color='#e0533d';} }
  aiLoad(); fpLoad();
  async function clearData(){ var r=await fetch('/admin/api/clear?token='+TOKEN,{method:'POST',headers:H}).then(function(r){return r.json()}); alert(r.ok?'✅ Data cleared':'❌ '+r.err); load(); loadAudit(); }
  async function blockList(){ var r=await fetch('/admin/api/block?token='+TOKEN,{method:'POST',headers:{...H,'Content-Type':'application/json'},body:JSON.stringify({list:true})}).then(function(r){return r.json()}); alert('Blocked IPs: '+((r.blocked||[]).join(', ')||'(không có)')); }
  function blockIp(ip,block){ fetch('/admin/api/block?token='+TOKEN,{method:'POST',headers:{...H,'Content-Type':'application/json'},body:JSON.stringify({ip:ip,block:block})}).then(function(){load();loadAudit();}); }
  // [loop 1352] full-chat modal — admin xem TOÀN BỘ Q+A (không bị truncate 200 chars).
  function fmtMs(ms){ if(ms==null)return ''; if(ms<1000)return ms+'ms'; var s=ms/1000; return s<60?(s.toFixed(1)+'s'):(Math.round(s/60)+'m'+String(Math.round(s%60)).padStart(2,'0')+'s'); }
  function showChat(q, resp, src, dur, ts, ip, rounds, bailed, detail){
    var m=document.getElementById('chat-modal'); m.textContent='';
    var box=el('div'); box.style.cssText='background:#15131f;border:1px solid '+(bailed?'#c0392b':'#d4af37')+';border-radius:10px;padding:18px 22px;max-width:780px;width:calc(100% - 40px);max-height:85vh;overflow:auto';
    var meta=el('div'); meta.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;border-bottom:1px solid rgba(212,175,55,.2);padding-bottom:8px';
    var left=el('div'); left.style.cssText='font-size:13px';
    left.appendChild(el('span',null, (src==='ai'?'🤖 AI trả lời':'📦 Local (offline)') + (ip?'  ·  ':'')));
    if(ip){var ipE=el('span','ip',ip); ipE.style.fontSize='12px'; left.appendChild(ipE);}
    left.appendChild(el('div','tiny', (ts?new Date(ts).toLocaleString('vi-VN'):'') + (dur!=null?'  ·  ⏱ '+fmtMs(dur):'') + (rounds?'  ·  🔄 '+rounds+' vòng':'') + (bailed?'  ·  ⚠ BỊ CẮT: '+bailed:'')));
    if (detail && detail.length) left.appendChild(el('div','tiny','🔀 mỗi round: ' + detail.join(' → ')));
    meta.appendChild(left);
    var close=el('button','btn','✕ Đóng'); close.style.cssText='padding:4px 12px;font-size:12px'; close.onclick=function(){m.style.display='none';}; meta.appendChild(close);
    box.appendChild(meta);
    var qb=el('div'); qb.style.cssText='margin:10px 0;padding:8px 10px;background:rgba(180,120,200,.1);border-left:3px solid #b478c8;border-radius:4px';
    qb.appendChild(el('div','tiny','❓ CÂU HỎI')); qb.appendChild(el('div',null, q||'(trống)')); box.appendChild(qb);
    var rb=el('div'); rb.style.cssText='margin:10px 0;padding:8px 10px;background:rgba(0,0,0,.25);border-left:3px solid #d4af37;border-radius:4px;white-space:pre-wrap;line-height:1.6';
    rb.appendChild(el('div','tiny','💬 TRẢ LỜI')); rb.appendChild(document.createTextNode(resp||'(không có)')); box.appendChild(rb);
    var actions=el('div'); actions.style.cssText='margin-top:8px;text-align:right';
    var copy=el('button','btn','📋 Copy'); copy.style.cssText='padding:4px 12px;font-size:12px'; copy.onclick=function(){navigator.clipboard.writeText((q||'')+'\\n\\n'+(resp||''));copy.textContent='✓ Copied';setTimeout(function(){copy.textContent='📋 Copy';},1500);}; actions.appendChild(copy);
    box.appendChild(actions);
    m.appendChild(box); m.style.display='flex';
  }
  // [loop 1365] visitor detail modal — click IP → load HẾT (device + timeline + charts + full chats)
  async function showVisitor(ip){
    var m=document.getElementById('visitor-modal'); if(!m) return;
    m.textContent='';
    var box=el('div'); box.style.cssText='background:#15131f;border:1px solid #d4af37;border-radius:12px;padding:18px 22px;max-width:820px;width:calc(100% - 40px);max-height:88vh;overflow:auto';
    box.appendChild(el('div','tiny','⏳ Đang load toàn bộ dữ liệu «'+ip+'»…'));
    m.appendChild(box); m.style.display='flex';
    var r;
    try { r = await fetch('/admin/api/visitor?token='+TOKEN+'&ip='+encodeURIComponent(ip), {headers:H}).then(function(x){return x.json();}); }
    catch(e){ r = {ok:false, err:e.message}; }
    box.textContent='';
    if (!r.ok) { box.appendChild(el('div',null,'❌ '+(r.err||'Lỗi load'))); var ce=el('button','btn','✕ Đóng'); ce.onclick=function(){m.style.display='none';}; box.appendChild(ce); return; }
    var head=el('div'); head.style.cssText='display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px;border-bottom:1px solid rgba(212,175,55,.2);padding-bottom:8px;flex-wrap:wrap';
    var hl=el('div');
    var ipE=el('div'); ipE.style.cssText='font-family:ui-monospace,monospace;color:#7fbf7f;font-size:14px;font-weight:700;word-break:break-all'; ipE.textContent=ip; hl.appendChild(ipE);
    hl.appendChild(el('div','tiny',(r.country||'?')+(r.city?' / '+r.city:'')+' · '+(r.device&&r.device.label||'?')));
    head.appendChild(hl);
    var close=el('button','btn','✕ Đóng'); close.style.cssText='padding:4px 12px;font-size:12px'; close.onclick=function(){m.style.display='none';}; head.appendChild(close);
    var del=el('button','btn off','🗑 Xóa data IP'); del.style.cssText='padding:4px 10px;font-size:11px;margin-right:6px'; del.onclick=(function(ip){return function(){if(confirm('Xóa HẾT events của «'+ip+'» khỏi log? (không hoàn tác — dùng dọn test/spam/hỏng)')){fetch('/admin/api/events-delete?token='+TOKEN,{method:'POST',headers:{...H,'Content-Type':'application/json'},body:JSON.stringify({ip:ip})}).then(function(r){return r.json();}).then(function(j){alert(j.ok?'✅ Đã xóa '+j.removed+' events của '+ip:'❌ '+(j.err||'lỗi'));m.style.display='none';load();loadAudit();});}};})(ip); head.appendChild(del);
    box.appendChild(head);
    box.appendChild(el('div','tiny','⏱ '+new Date(r.firstTs).toLocaleString('vi-VN')+' → '+new Date(r.lastTs).toLocaleString('vi-VN')));
    var st=el('div'); st.style.cssText='display:flex;gap:14px;flex-wrap:wrap;margin:8px 0;font-size:12px';
    st.appendChild(el('span','tiny','📊 '+r.count+' events')); st.appendChild(el('span','tiny','👀 '+r.visits+' visits')); st.appendChild(el('span','tiny','📊 '+r.charts.length+' lá số')); st.appendChild(el('span','tiny','💬 '+r.chats.length+' chat'));
    if(r.referrer) st.appendChild(el('span','tiny','← '+String(r.referrer).slice(0,50)));
    box.appendChild(st);
    // [visitor-finder] tên (nếu khách nhập) + ghi chú/tag (từ _lastD.notes) + nút sửa
    var _firstName = (r.charts||[]).map(function(c){return c.name;}).filter(function(nx){return nx;})[0];
    if(_firstName){ var _nm=el('div',null,'👤 '+_firstName); _nm.style.cssText='font-size:16px;color:var(--gold);font-weight:700;margin:4px 0'; box.appendChild(_nm); }
    var _nd=(_lastD&&_lastD.notes&&_lastD.notes[ip])||{};
    var _nbox=el('div'); _nbox.style.cssText='background:rgba(212,175,55,.06);border:1px solid rgba(212,175,55,.2);border-radius:8px;padding:8px 12px;margin:8px 0';
    var _nth=el('div','tiny','📝 GHI CHÚ & 🏷️ TAG'); _nth.style.color='#d4af37'; _nbox.appendChild(_nth);
    if(_nd.note){var _nt=el('div',null,_nd.note); _nt.style.cssText='font-style:italic;margin:3px 0'; _nbox.appendChild(_nt);}
    if(_nd.tags&&_nd.tags.length){var _tg=el('div'); _nd.tags.forEach(function(t){var c=el('span','badge','🏷 '+t); c.style.cssText='background:rgba(100,180,255,.15);color:#64b4ff;margin:2px'; _tg.appendChild(c);}); _nbox.appendChild(_tg);}
    if(!_nd.note&&!(_nd.tags&&_nd.tags.length)) _nbox.appendChild(el('div','tiny','(chưa có — bấm «✏️ Sửa» thêm ghi chú/tag để tìm lại visitor sau này)'));
    var _eb=el('button','btn','✏️ Sửa ghi chú/tag'); _eb.style.cssText='margin-top:6px;padding:4px 12px;font-size:12px'; _eb.onclick=function(){editNote(ip);}; _nbox.appendChild(_eb);
    box.appendChild(_nbox);
    var dv=el('div'); dv.style.cssText='background:rgba(100,180,255,.06);border-left:3px solid #64b4ff;padding:7px 11px;margin:6px 0 12px;font-size:12px';
    dv.appendChild(el('div','tiny','💻 DEVICE')); dv.appendChild(el('div',null,(r.device&&r.device.icon||'💻')+' '+(r.device&&r.device.os||'?')+' · '+(r.device&&r.device.browser||'?')+' · '+(r.device&&r.device.type||'?')+(r.device&&r.device.brand?' · '+r.device.brand:'')));
    if(r.ua){ var ua=el('div','tiny','UA: '+r.ua); ua.style.cssText='word-break:break-all;opacity:.65;margin-top:3px'; dv.appendChild(ua); }
    box.appendChild(dv);
    if (r.charts.length) { var cc=el('div'); cc.style.cssText='margin:10px 0'; cc.appendChild(el('div','tiny','📊 LÁ SỐ ĐÃ XEM ('+r.charts.length+') · «Mở» xem lá số tab mới (KHÔNG ghi log)')); r.charts.forEach(function(c){
      var row=el('div'); row.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid rgba(212,175,55,.06)';
      row.appendChild(el('span','tiny',(c.dob||'?')+' '+(c.time||'')+' '+(c.gender||'')+(c.score!=null?' · '+c.score+'/100':'')));
      var a=el('a','btn'); a.textContent='🔗 Mở lá số'; a.target='_blank'; a.rel='noopener';
      a.href='/?dob='+encodeURIComponent(c.dob||'')+'&time='+encodeURIComponent(c.time||'12:00')+'&g='+encodeURIComponent(c.gender||'nam')+'&from=admin&nolog=1';
      a.style.cssText='padding:3px 9px;font-size:11px;text-decoration:none;white-space:nowrap';
      row.appendChild(a); cc.appendChild(row);
    }); box.appendChild(cc); }
    if (r.chats.length) {
      var ch=el('div'); ch.style.cssText='margin:10px 0'; ch.appendChild(el('div','tiny','💬 CHAT AI ('+r.chats.length+') — mở để xem full trả lời'));
      r.chats.forEach(function(c){
        var cd=el('details'); cd.style.cssText='border-left:2px solid '+(c.bailed?'#c0392b':'#d4af37')+';padding:4px 10px;margin:4px 0;background:rgba(0,0,0,.18);border-radius:0 4px 4px 0';
        var sm=el('summary','tiny',(c.bailed?'⏱ ':'')+'Q: '+String(c.q).slice(0,70)+(c.durationMs!=null?' · '+fmtMs(c.durationMs):'')+(c.source==='ai'?' 🤖':' 📦')); sm.style.cursor='pointer'; sm.style.color='#e8d9b0'; cd.appendChild(sm);
        var body=el('div'); body.style.cssText='white-space:pre-wrap;line-height:1.55;font-size:12.5px;padding:6px 0;color:#e8d9b0';
        body.appendChild(document.createTextNode(c.response||'(trống)')); cd.appendChild(body);
        ch.appendChild(cd);
      });
      box.appendChild(ch);
    }
    if (r.timeline && r.timeline.length) {
      var tl=el('details'); tl.style.cssText='margin:10px 0'; tl.open=true;
      var tsm=el('summary','tiny','📅 TIMELINE ('+r.timeline.length+' events)'); tsm.style.cursor='pointer'; tsm.style.color='#d4af37'; tl.appendChild(tsm);
      r.timeline.slice().reverse().forEach(function(t){
        var icon=t.type==='visit'?'👀':t.type==='chart'?'📊':t.type==='ai_question'?'💬':t.type==='ai_chat'?'🤖':t.type==='error'?'⚠️':t.type==='click'?'🖱':'•';
        var det='';
        if(t.type==='chart'&&t.data) det=(t.data.dob||'')+' '+(t.data.gender||'')+(t.data.score!=null?' · '+t.data.score+'/100':'');
        else if(t.type==='ai_question'&&t.data) det=String(t.data.q||'').slice(0,60);
        else if(t.type==='ai_chat'&&t.data) det='→ '+(t.data.source==='ai'?'AI':'local');
        else if(t.type==='click'&&t.data) det=t.data.id;
        else if(t.type==='visit'&&t.data&&t.data.ref) det='← '+String(t.data.ref).slice(0,40);
        var row=el('div','tiny',icon+' '+new Date(t.ts).toLocaleTimeString('vi-VN')+(det?' — '+det:''));
        row.style.cssText='padding:1px 0 1px 8px;border-left:1px solid rgba(212,175,55,.1)';
        tl.appendChild(row);
      });
      box.appendChild(tl);
    }
    if (!r.chats.length && !r.charts.length) box.appendChild(el('div','tiny','(visitor chỉ xem, chưa lập lá số/chat)'));
    // [loop 1380] 📨 inject message — admin can thiệp chat (gửi tin hiện sau câu luận giải)
    if (r.sid) {
      var inj = el('div'); inj.style.cssText = 'margin-top:12px;padding:10px;background:rgba(100,180,255,.08);border:1px solid rgba(100,180,255,.25);border-radius:8px';
      inj.appendChild(el('div',null,'📨 NHẮN TIN RIÊNG')).style.cssText='color:#64b4ff;font-size:12px;font-weight:700;margin-bottom:4px';
      inj.appendChild(el('div','tiny','Tin hiện TRONG chat của visitor (sau câu luận giải), real-time (poll 8s). sid: '+r.sid.slice(0,16)+'…'));
      var ta = el('textarea'); ta.placeholder = 'Nhập tin nhắn... (vd: «Thầy thấy con hỏi về hôn nhân — thầy muốn thêm 1 điều riêng...»)';
      ta.style.cssText = 'width:100%;height:64px;margin:6px 0;background:rgba(0,0,0,.3);border:1px solid rgba(212,175,55,.2);color:#e8d9b0;border-radius:6px;padding:8px;box-sizing:border-box;font-family:inherit;font-size:13px;resize:vertical';
      var send = el('button','btn','📨 Gửi'); send.style.cssText = 'padding:6px 16px;font-size:12px';
      send.onclick = (function (sid) { return function () {
        if (!ta.value.trim()) return;
        send.textContent = '⏳...'; send.disabled = true;
        fetch('/admin/api/inject?token=' + TOKEN, { method: 'POST', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify({ sid: sid, text: ta.value.trim() }) }).then(function (r) { return r.json(); }).then(function (j) {
          send.textContent = '📨 Gửi'; send.disabled = false;
          if (j.ok) { ta.value = ''; alert('✅ Đã gửi! Visitor sẽ thấy trong chat (~8 giây).'); }
          else alert('❌ ' + (j.err || 'lỗi'));
        }).catch(function () { send.textContent = '📨 Gửi'; send.disabled = false; });
      }; })(r.sid);
      inj.appendChild(ta); inj.appendChild(send);
      box.appendChild(inj);
    }
  }
  // [loop 1355] audit log loader — truy vết admin actions
  async function loadAudit(){
    var r = await fetch('/admin/api/audit?token='+TOKEN, { headers: H }).then(function(r){return r.json();}).catch(function(){return {audit:[]};});
    var al = document.getElementById('audit'); if (!al) return; al.textContent='';
    var rows = r.audit || [];
    if (!rows.length) { al.appendChild(el('div','tiny','(chưa có action nào được log)')); return; }
    rows.slice(0, 50).forEach(function(a){
      var row = el('div'); row.style.cssText='display:flex;gap:10px;padding:4px 8px;border-bottom:1px solid rgba(212,175,55,.1);font-size:12px;flex-wrap:wrap;align-items:center';
      var icon = a.action==='ai_toggle'?'🤖':a.action==='ip_block'?'🚫':a.action==='clear_data'?'🗑':a.action==='token_change'?'🔑':a.action==='ai_config'?'⚙️':a.action==='notify_config'?'📱':'•';
      row.appendChild(el('span','tiny', new Date(a.ts).toLocaleString('vi-VN')));
      row.appendChild(el('span',null, icon + ' ' + a.action));
      row.appendChild(el('span','ip', a.ip || '?'));
      var det = '';
      if (a.detail) {
        if (a.action==='ai_toggle') det = a.detail.enabled ? 'BẬT AI' : 'TẮT AI';
        else if (a.action==='ip_block') det = (a.detail.block?'Block ':'Unblock ')+(a.detail.ip||'');
        else if (a.action==='ai_config') det = 'mode='+(a.detail.mode||'?')+(a.detail.hasKey?' · có key':'')+(a.detail.model?' · '+a.detail.model:'')+(a.detail.endpoint?' · '+a.detail.endpoint:'');
        else if (a.action==='notify_config') det = a.detail.enabled ? 'Bật Telegram' : 'Tắt Telegram';
        else det = JSON.stringify(a.detail);
      }
      row.appendChild(el('span','tiny', det));
      al.appendChild(row);
    });
  }
  loadAudit();
  // [loop 1362] tab switching — sidebar nav đổi section (redesign). [1363] +hash deep-link
  function switchTab(name){
    document.querySelectorAll('.nav-item').forEach(function(x){x.classList.toggle('active', x.dataset.tab===name);});
    document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('active');});
    var t=document.getElementById('tab-'+name); if(t) t.classList.add('active');
  }
  document.querySelectorAll('.nav-item').forEach(function(b){
    b.addEventListener('click', function(){ switchTab(b.dataset.tab); if(history.replaceState) history.replaceState(null,'',location.pathname+location.search+'#'+b.dataset.tab); });
  });
  (function(){var h=location.hash.replace('#',''); if(h && ['overview','visitors','ai','system'].indexOf(h)>=0) switchTab(h);})();
  // [loop 1355] token URL hygiene — strip token khỏi URL sau load (chống leak via history/share)
  if (location.search && location.search.indexOf('token=') >= 0) {
    var _u = new URL(location.href); _u.searchParams.delete('token');
    history.replaceState(null, '', _u.pathname + (_u.search || '') + (_u.hash || ''));
  }
  </script>
  <div id="chat-modal" onclick="if(event.target===this)this.style.display='none'" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:9999;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px)"></div>
  <div id="visitor-modal" onclick="if(event.target===this)this.style.display='none'" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9999;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px)"></div>
  <div id="note-modal" onclick="if(event.target===this)this.style.display='none'" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:10000;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px)"></div>
  </body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer',
    // [loop 1355] security headers — CSP cho admin dashboard (inline script/style cần 'unsafe-inline';
    //   connect chỉ same-origin, chặn framing/external). HSTS + nosniff cho mọi response.
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  } });
}
