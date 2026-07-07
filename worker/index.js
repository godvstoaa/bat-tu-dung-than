// Cloudflare Worker — serve static app + proxy LLM + admin + anti-scraping + anti-abuse.
import { makeProxy } from '../functions/_proxy.js';
import { handleAdminRoute, isAiEnabled, isFreeAiEnabled, logFreeUsage, logEvent } from './admin.js';

const PROXIES = [
  ['/cf-ai', 'https://api.cloudflare.com'],
  ['/zai', 'https://api.z.ai'],
  ['/groq', 'https://api.groq.com'],
  ['/nvidia', 'https://integrate.api.nvidia.com'],
  ['/openai', 'https://api.openai.com'],
  ['/deepseek', 'https://api.deepseek.com'],
  ['/bigmodel', 'https://open.bigmodel.cn'],
];

// [loop 1351] Anti-scraping — block known scraper/bot UA (KHÔNG block Googlebot/Bingbot)
const SCRAPER_RE = /scrapy|python-requests|python\/|wget|httpclient|java\/|go-http-client|okhttp|phantomjs|selenium|puppeteer|headless|curl\/|jakarta|httpunit|nutch|heritrix/i;
// Allow legit crawlers (SEO)
const GOOD_BOT_RE = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit/i;

function clientIP(request) {
  return request.headers.get('CF-Connecting-IP') || (request.headers.get('X-Forwarded-For') || '').split(',')[0].trim() || 'unknown';
}

// [loop 1355] security headers cho main app HTML (HSTS/nosniff/Referrer/X-Frame — zero breakage risk).
//   KHÔNG thêm CSP strict ở đây vì app có inline script → CSP có thể gây trắng trang (bug từng gặp).
//   CSP strict chỉ áp dụng cho admin dashboard (nơi chứa token + user data).
function withSecurityHeaders(res) {
  const ct = res.headers.get('Content-Type') || '';
  if (ct.indexOf('text/html') < 0) return res; // chỉ inject cho HTML document, không mỗi asset
  const h = new Headers(res.headers);
  h.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  h.set('X-Content-Type-Options', 'nosniff');
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  h.set('X-Frame-Options', 'SAMEORIGIN');
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

// [loop 1376] FREE model pool — multi-backend gateway. Admin thêm free provider keys (NVIDIA,
//   Groq...) vào ai:config.freePool → app thử pool + cf-glm theo thứ tự, fallback khi 1 provider
//   fail (401/429/500/timeout). Ai cũng dùng được (key server-side, user không cần key).
const CF_FREE_BASE = 'https://api.cloudflare.com/client/v4/accounts/bc101a2962ca21a084172c5334ad7dad/ai/v1';
async function freeRoute(request, env, ctx, ip, aiCfg) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'authorization, content-type' } });
  let bodyObj = {};
  try { bodyObj = await request.json(); } catch (e) { try { bodyObj = JSON.parse(await request.text()); } catch (_) {} }
  const pool = Array.isArray(aiCfg && aiCfg.freePool) ? aiCfg.freePool.filter(function (p) { return p && p.apiKey && p.endpoint && p.model; }) : [];
  // [loop 1385] SMART ROUTING — câu phức tạp → z.ai GLM-5.2 TRƯỚC (ổn định + chất lượng);
  //   câu đơn giản → Groq (nhanh, free). Detect bằng độ dài + keyword BaZi.
  var userMsgs = (bodyObj.messages || []).filter(function (m) { return m.role === 'user'; });
  var lastQ = userMsgs.length ? String(userMsgs[userMsgs.length - 1].content || '') : '';
  var qNorm = lastQ.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  var isComplex = qNorm.length > 60 || /hop hon|dai van|phong thuy|dau tu|gia dinh|khi nao|nam nao|ngay nao|cai van|suc khoe|con cai|nghe nghiep|tai loc|quy nhan|dao hoa|huong(?: nha|ngu)?|cuoi|sinh con|dung than|menh cach|tu vi|bat tu|luan|phan tich|xem/g.test(qNorm);
  var zaiBackend = aiCfg.zaiKey ? [{ name: 'z.ai-paid', endpoint: 'https://api.z.ai/api/coding/paas/v4', model: 'glm-5.2', apiKey: String(aiCfg.zaiKey) }] : [];
  var cfBackend = [{ name: 'cf-glm', endpoint: CF_FREE_BASE, model: '@cf/zai-org/glm-5.2', apiKey: env.CF_AI_KEY || '' }];
  var poolBackends = pool.map(function (p) { return { name: p.name || 'pool', endpoint: String(p.endpoint).replace(/\/$/, ''), model: String(p.model), apiKey: String(p.apiKey) }; });
  // complex → z.ai FIRST (GLM-5.2 stable + quality), cf-glm fallback, skip Groq (llama yếu cho BaZi)
  // simple → Groq (fast, free) → cf-glm → z.ai (last resort)
  const backends = isComplex ? [].concat(zaiBackend, cfBackend) : [].concat(poolBackends, cfBackend, zaiBackend);
  for (let i = 0; i < backends.length; i++) {
    const b = backends[i];
    if (!b.apiKey) continue;
    var ac = new AbortController();
    var timer = setTimeout(function () { ac.abort(); }, 12000); // 12s cho status/TTFT
    try {
      bodyObj.model = b.model;
      // [loop 1383] pool backends (Groq) — bỏ tools/tool_choice (payload quá lớn → HTTP 413).
      //   cf-glm (built-in) giữ tools. Pool backends trả lời từ brief (engine đã tính sẵn).
      var bodySend = bodyObj;
      if (b.name !== 'cf-glm') { bodySend = Object.assign({}, bodyObj); delete bodySend.tools; delete bodySend.tool_choice; }
      const res = await fetch(b.endpoint + '/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + b.apiKey }, body: JSON.stringify(bodySend), signal: ac.signal });
      clearTimeout(timer);
      if (res.status === 200 && res.body) {
        if (env.ADMIN_KV) logFreeUsage(env, ip, 200, b.name).catch(function () {});
        // [loop 1381 SERVER-SIDE CAPTURE] tee stream → log FULL response server-side
        //   (bypass frontend truncation entirely — old bundle / mid-reload đều OK)
        var _streamStart = Date.now();
        var _tee = res.body.tee();
        if (ctx && ctx.waitUntil) ctx.waitUntil((async function () {
          try {
            var reader = _tee[1].getReader();
            var decoder = new TextDecoder();
            var sbuf = '', fullContent = '';
            while (true) {
              var chunk = await reader.read();
              if (chunk.done) break;
              sbuf += decoder.decode(chunk.value, { stream: true });
              var slines = sbuf.split('\n'); sbuf = slines.pop();
              for (var li = 0; li < slines.length; li++) {
                var sl = slines[li].trim();
                if (sl.indexOf('data:') !== 0) continue;
                var sp = sl.slice(5).trim();
                if (!sp || sp === '[DONE]') continue;
                try { var sj = JSON.parse(sp); var sd = sj.choices && sj.choices[0] && sj.choices[0].delta; if (sd && sd.content) fullContent += sd.content; } catch (pe) {}
              }
            }
            if (fullContent.length > 5) {
              var um = (bodyObj.messages || []).filter(function (m) { return m.role === 'user'; });
              var qText = um.length ? String(um[um.length - 1].content || '').slice(0, 200) : '';
              await logEvent(env, request, 'ai_chat', { q: qText, response: fullContent, source: 'ai', durationMs: Date.now() - _streamStart, backend: b.name });
            }
          } catch (ce) {}
        })());
        return new Response(_tee[0], { status: 200, headers: { 'Content-Type': res.headers.get('Content-Type') || 'text/event-stream', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store', 'X-Free-Backend': b.name } });
      }
      if (env.ADMIN_KV) logFreeUsage(env, ip, res.status, b.name).catch(function () {});
    } catch (e) {
      clearTimeout(timer);
      if (env.ADMIN_KV) logFreeUsage(env, ip, 0, b.name).catch(function () {});
    }
  }
  return new Response(JSON.stringify({ error: { message: 'Tất cả free backend đều thất bại — thử lại, hoặc admin thêm key ở «AI Config».', type: 'free_disabled' } }), { status: 503, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' } });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const ua = request.headers.get('User-Agent') || '';
    const ip = clientIP(request);

    // === [loop 1351] ANTI-SCRAPING + ANTI-ABUSE ===

    // 0a) IP blacklist check (admin có thể block IP qua /admin/api/block)
    if (env.ADMIN_KV) {
      const blocked = await env.ADMIN_KV.get('block:' + ip);
      if (blocked === '1') {
        return new Response('Access denied.', { status: 403, headers: { 'Content-Type': 'text/plain' } });
      }
    }

    // 0b) Block scraper UAs — CHỈ cho main site (KHÔNG cho /api/ /admin/ — admin dùng curl/CLI OK)
    const isAdminOrApi = url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin');
    if (!isAdminOrApi && SCRAPER_RE.test(ua) && !GOOD_BOT_RE.test(ua)) {
      return new Response('Forbidden', { status: 403 });
    }

    // 0c) Global rate-limit: 120 req/phút/IP (CHỈ cho main site, không /api/ /admin/ /assets/)
    if (env.ADMIN_KV && !isAdminOrApi && url.pathname !== '/favicon.ico' && !url.pathname.startsWith('/assets/')) {
      const rlKey = 'grl:' + ip + ':' + Math.floor(Date.now() / 60000);
      const rlCount = parseInt((await env.ADMIN_KV.get(rlKey)) || '0', 10);
      if (rlCount >= 120) {
        return new Response('Rate limited. Thử lại sau 1 phút.', { status: 429, headers: { 'Retry-After': '60' } });
      }
      await env.ADMIN_KV.put(rlKey, String(rlCount + 1), { expirationTtl: 120 });
    }

    // 1) Admin + logging routes
    if (url.pathname === '/api/event' || url.pathname === '/api/feedback' || url.pathname === '/api/inbox' || url.pathname === '/api/ai-config' || url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
      return handleAdminRoute(request, env, url);
    }

    // 2) proxy LLM API
    for (const [prefix, host] of PROXIES) {
      if (url.pathname === prefix || url.pathname.startsWith(prefix + '/')) {
        if (!(await isAiEnabled(env))) {
          return new Response(JSON.stringify({ error: { message: 'AI đang bị TẮT bởi quản trị viên.', type: 'ai_disabled' } }), { status: 503, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' } });
        }
        const sub = url.pathname.slice(prefix.length);
        const params = { path: sub.split('/').filter(Boolean) };
        if (prefix === '/cf-ai') {
          // [loop 1376] FREE pool: KHÔNG có admin custom key → freeRoute (NVIDIA/Groq/... + cf-glm fallback)
          let adminKey = null, aiCfg = {};
          try { aiCfg = JSON.parse((await env.ADMIN_KV.get('ai:config')) || '{}'); adminKey = aiCfg.apiKey || null; } catch (e) {}
          if (!adminKey) {
            if (!(await isFreeAiEnabled(env))) return new Response(JSON.stringify({ error: { message: 'Model free đang bị TẮT.', type: 'free_ai_disabled' } }), { status: 503, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' } });
            return await freeRoute(request, env, ctx, ip, aiCfg);
          }
          // admin custom key (single backend, như cũ)
          const headers = new Headers(request.headers);
          if (!headers.get('Authorization') && adminKey) headers.set('Authorization', `Bearer ${adminKey}`);
          request = new Request(request, { headers });
          return makeProxy(host)({ request, params, env });
        }
        return makeProxy(host)({ request, params, env });
      }
    }

    // 3) static assets (SPA fallback)
    const res = withSecurityHeaders(await env.ASSETS.fetch(request));
    if (res.status === 404) {
      return withSecurityHeaders(await env.ASSETS.fetch(new Request(new URL('/index.html', url), request)));
    }
    return res;
  },
};
