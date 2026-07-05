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
  if (!env.ADMIN_KV) return;
  const ip = clientIP(request);
  const ua = (request.headers.get('User-Agent') || '').slice(0, 200);
  const country = (request.cf && request.cf.country) || '';
  const city = (request.cf && request.cf.city) || '';
  const ts = Date.now();
  const id = Math.random().toString(36).slice(2, 10);
  await env.ADMIN_KV.put(`ev:${ts}-${id}`, JSON.stringify({ ts, type, ip, ua, country, city, data: data || {} }), { expirationTtl: TTL_EVENT });
  const day = new Date(ts).toISOString().slice(0, 10);
  for (const k of [`cnt:${type}`, 'cnt:all', `daily:${day}:${type}`]) {
    const cur = parseInt((await env.ADMIN_KV.get(k)) || '0', 10);
    await env.ADMIN_KV.put(k, String(cur + 1));
  }
}

export async function handleAdminRoute(request, env, url) {
  const path = url.pathname;
  const method = request.method;
  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,X-Admin-Token' } });

  if (path === '/api/event' && method === 'POST') {
    try {
      const body = await request.json();
      const type = ['visit', 'chart', 'ai_question'].includes(body && body.type) ? body.type : 'other';
      await logEvent(env, request, type, body && body.data);
      return json({ ok: true });
    } catch (e) { return json({ ok: false, err: e.message }, 400); }
  }

  if (path === '/admin' || path.startsWith('/admin/')) {
    const token = url.searchParams.get('token') || request.headers.get('X-Admin-Token') || '';
    const expected = env.ADMIN_TOKEN || '';
    if (!expected) return new Response('ADMIN_TOKEN secret chưa đặt. Chạy: wrangler secret put ADMIN_TOKEN', { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    if (token !== expected) return new Response('Unauthorized', { status: 401 });
    if (path === '/admin' || path === '/admin/') return adminDashboard();
    if (path === '/admin/api/stats') return adminStats(env);
    if (path === '/admin/api/ai' && method === 'POST') return adminToggleAi(env, request);
    return new Response('Not found', { status: 404 });
  }
  return null;
}

async function adminStats(env) {
  const ai = await isAiEnabled(env);
  const list = await env.ADMIN_KV.list({ prefix: 'ev:', limit: 200, reverse: true });
  const events = [];
  for (const k of list.keys) {
    const v = await env.ADMIN_KV.get(k.name);
    if (v) { try { events.push(JSON.parse(v)); } catch (e) {} }
  }
  const get = async (k) => parseInt((await env.ADMIN_KV.get(k)) || '0', 10);
  const totals = { visit: await get('cnt:visit'), chart: await get('cnt:chart'), ai_question: await get('cnt:ai_question'), all: await get('cnt:all') };
  const ips = new Set(events.map((e) => e.ip));
  return json({ aiEnabled: ai, totals, uniqueIps: ips.size, events });
}

async function adminToggleAi(env, request) {
  const body = await request.json().catch(() => ({}));
  const enabled = body && body.enabled ? '1' : '0';
  await env.ADMIN_KV.put('ai:enabled', enabled);
  return json({ ok: true, aiEnabled: enabled === '1' });
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
  .b-visit{background:rgba(127,191,127,.2);color:#7fbf7f}.b-chart{background:rgba(212,175,55,.2);color:#d4af37}.b-ai_question{background:rgba(180,120,200,.2);color:#b478c8}.b-other{background:rgba(150,150,150,.2);color:#aaa}
  </style></head><body>
  <h1>🛡️ Admin — Bát Tự Dụng Thần</h1>
  <div id="status">Đang tải…</div>
  <div id="controls" style="margin:12px 0"></div>
  <h3>Sự kiện gần đây <select class="filter" id="ftype" onchange="load()"><option value="">Tất cả</option><option value="visit">visit</option><option value="chart">chart</option><option value="ai_question">ai_question</option></select> <button class="btn" style="padding:5px 12px;font-size:12px" onclick="load()">↻</button></h3>
  <table><thead><tr><th>Thời gian</th><th>Loại</th><th>IP</th><th>Địa lý</th><th>Dữ liệu</th></tr></thead><tbody id="events"></tbody></table>
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
    st.appendChild(statBlock(d.uniqueIps,'IP unique'));
    st.appendChild(statBlock(d.aiEnabled?'BẬT':'TẮT','AI mode', d.aiEnabled?'#7fbf7f':'#c0392b'));
    const c=document.getElementById('controls'); c.textContent='';
    const btn=el('button', d.aiEnabled?'btn off':'btn', d.aiEnabled?'⏸ Tắt AI toàn cục':'▶ Bật AI'); btn.onclick=()=>toggle(!d.aiEnabled); c.appendChild(btn);
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
  }
  async function toggle(en){ await fetch('/admin/api/ai', { method:'POST', headers:{...H,'Content-Type':'application/json'}, body: JSON.stringify({enabled:en}) }); load(); }
  load(); setInterval(load, 15000);
  </script></body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}
