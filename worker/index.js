// Cloudflare Worker — serve static app + proxy LLM + admin + anti-scraping + anti-abuse.
import { makeProxy } from '../functions/_proxy.js';
import { handleAdminRoute, isAiEnabled, isFreeAiEnabled, logFreeUsage, logEvent, adminPath } from './admin.js';

const PROXIES = [
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
  // [AUDIT FIX] bỏ fallback X-Forwarded-For (spoof nếu worker lộ ra ngoài CF)
  return request.headers.get('CF-Connecting-IP') || 'unknown';
}

// [AUDIT FIX C3] Restrict CORS — trước đây * → bất kỳ site nào cũng drain AI quota
const ALLOWED_ORIGINS = /^(https:\/\/battu\.god8\.shop|https:\/\/battu\.maz-elements0\.workers\.dev|capacitor:\/\/localhost|ionic:\/\/localhost|http:\/\/localhost:\d+)$/;
function corsOrigin(request) {
  const o = request.headers.get('Origin') || '';
  return ALLOWED_ORIGINS.test(o) ? o : 'https://battu.god8.shop';
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

// [loop 1376] FREE model pool — multi-backend gateway. Z.ai Coding Plan (glm-5.2) là PRIMARY,
//   admin thêm free provider keys (Groq/NVIDIA...) vào ai:config.freePool làm FALLBACK khi z.ai
//   fail (401/429/500/timeout). Ai cũng dùng được (key server-side, user không cần key).
async function freeRoute(request, env, ctx, ip, aiCfg) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': corsOrigin(request), 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'authorization, content-type' } });
  // [AUDIT FIX] chỉ nhận POST (trước đây GET cũng POST /chat/completions → 503 rác)
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: { message: 'method not allowed' } }), { status: 405, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': corsOrigin(request) } });
  let bodyObj = {};
  try { bodyObj = await request.json(); } catch (e) { try { bodyObj = JSON.parse(await request.text()); } catch (_) {} }
  const pool = Array.isArray(aiCfg && aiCfg.freePool) ? aiCfg.freePool.filter(function (p) { return p && p.apiKey && p.endpoint && p.model; }) : [];
  // [cloudflare-gỡ] z.ai Coding Plan (glm-5.2) là DEFAULT/PRIMARY — nhanh, ổn, hỗ trợ tool-use.
  //   Pool (Groq/NVIDIA/...) chỉ là FALLBACK khi z.ai fail. (Trước đây cf-glm default; Groq từng
  //   đứng đầu pool nhưng key chết 403/413 → mọi request fail ở Groq trước khi tới z.ai.)
  var poolBackends = pool.map(function (p) { return { name: p.name || 'pool', endpoint: String(p.endpoint).replace(/\/$/, ''), model: String(p.model), apiKey: String(p.apiKey), stripTools: true }; });
  var zaiBackend = aiCfg.zaiKey ? [{ name: 'z.ai-paid', endpoint: 'https://api.z.ai/api/coding/paas/v4', model: 'glm-5.2', apiKey: String(aiCfg.zaiKey), stripTools: false }] : [];
  const backends = [].concat(zaiBackend, poolBackends); // z.ai TRƯỚC, pool fallback
  for (let i = 0; i < backends.length; i++) {
    const b = backends[i];
    if (!b.apiKey) continue;
    var ac = new AbortController();
    var timer = setTimeout(function () { ac.abort(); }, 45000); // 45s — brief 20K tokens cần thời gian process
    try {
      bodyObj.model = b.model;
      // [cloudflare-gỡ] z.ai coding plan làm PRIMARY. Giữ nguyên thinking (frontend gửi
      //   thinking:{enabled} → z.ai reasoning) — coding plan glm-5.2 thinking ~6s/call, chấp nhận
      //   được, chất lượng luận giải tốt hơn no-thinking. Chỉ strip tools cho POOL (Groq/NVIDIA)
      //   vì payload tools lớn → HTTP 413; z.ai-paid giữ tools (tool-use đầy đủ).
      // [AUDIT FIX] dùng cờ nội bộ stripTools (trước đây so tên 'z.ai-paid' → admin đặt pool entry
      //   trùng tên là vô hiệu hóa strip → 413).
      var bodySend = Object.assign({}, bodyObj);
      if (b.stripTools) { delete bodySend.tools; delete bodySend.tool_choice; }
      const res = await fetch(b.endpoint + '/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + b.apiKey }, body: JSON.stringify(bodySend), signal: ac.signal });
      clearTimeout(timer);
      if (res.status === 200 && res.body) {
        if (env.ADMIN_KV) logFreeUsage(env, ip, 200, b.name).catch(function () {});
        // [loop 1395] BỎ tee/server-side capture — gây backpressure → BodyStreamBuffer aborted.
        //   Frontend đã log full response (loop 1387). Trả response TRỰC TIẾP → không tee.
        // [AUDIT FIX] bỏ header X-Free-Backend (lộ backend name cho client)
        return new Response(res.body, { status: 200, headers: { 'Content-Type': res.headers.get('Content-Type') || 'text/event-stream', 'Access-Control-Allow-Origin': corsOrigin(request), 'Cache-Control': 'no-store' } });
      }
      if (env.ADMIN_KV) logFreeUsage(env, ip, res.status, b.name).catch(function () {});
    } catch (e) {
      clearTimeout(timer);
      if (env.ADMIN_KV) logFreeUsage(env, ip, 0, b.name).catch(function () {});
    }
  }
  return new Response(JSON.stringify({ error: { message: 'Tất cả free backend đều thất bại — thử lại, hoặc admin thêm key ở «AI Config».', type: 'free_disabled' } }), { status: 503, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': corsOrigin(request), 'Cache-Control': 'no-store' } });
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
    const ap = adminPath(env);
    const isAdminOrApi = url.pathname.startsWith('/api/') || url.pathname === '/' + ap || url.pathname.startsWith('/' + ap + '/') || url.pathname.startsWith('/admin');
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
    // [AUDIT FIX] route MỌI /api/* về handleAdminRoute (trước đây chỉ các path đã biết →
    //   /api/unknown rơi xuống SPA fallback trả HTML 200; giờ 405 JSON từ admin.js)
    // [AUDIT FIX ẨN PANEL] khi ADMIN_PATH được cấu hình → /admin cũ trả 404 (scanner không tìm thấy),
    //   panel chỉ ở /<ADMIN_PATH> (vd /panel-7xK2mQ9p)
    if (env.ADMIN_PATH && (url.pathname === '/admin' || url.pathname.startsWith('/admin/'))) {
      return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' } });
    }
    if (url.pathname.startsWith('/api/') || url.pathname === '/' + ap || url.pathname.startsWith('/' + ap + '/')) {
      return handleAdminRoute(request, env, url);
    }


    // 2) proxy LLM API
    for (const [prefix, host] of PROXIES) {
      if (url.pathname === prefix || url.pathname.startsWith(prefix + '/')) {
        // [AUDIT FIX] per-IP AI budget riêng (30/phút/IP) — mỗi call đốt quota trả phí admin;
        //   global 120/min quá lỏng để chống drain từ server-side (không cần Origin).
        if (env.ADMIN_KV) {
          const ark = 'airl:' + ip + ':' + Math.floor(Date.now() / 60000);
          const arc = parseInt((await env.ADMIN_KV.get(ark)) || '0', 10);
          if (arc >= 30) return new Response(JSON.stringify({ error: { message: 'AI quota giới hạn 30 call/phút/IP — thử lại sau.' } }), { status: 429, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': corsOrigin(request), 'Retry-After': '60', 'Cache-Control': 'no-store' } });
          await env.ADMIN_KV.put(ark, String(arc + 1), { expirationTtl: 120 });
        }
        if (!(await isAiEnabled(env))) {
          return new Response(JSON.stringify({ error: { message: 'AI đang bị TẮT bởi quản trị viên.', type: 'ai_disabled' } }), { status: 503, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': corsOrigin(request), 'Cache-Control': 'no-store' } });
        }
        const sub = url.pathname.slice(prefix.length);
        const params = { path: sub.split('/').filter(Boolean) };
        if (prefix === '/zai') {
          // FREE pool gateway: KHÔNG có admin custom key → freeRoute (pool Groq/NVIDIA + z.ai)
          let adminKey = null, aiCfg = {};
          try { aiCfg = JSON.parse((await env.ADMIN_KV.get('ai:config')) || '{}'); adminKey = aiCfg.apiKey || null; } catch (e) {}
          if (!adminKey) {
            if (!(await isFreeAiEnabled(env))) return new Response(JSON.stringify({ error: { message: 'Model free đang bị TẮT.', type: 'free_ai_disabled' } }), { status: 503, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': corsOrigin(request), 'Cache-Control': 'no-store' } });
            return await freeRoute(request, env, ctx, ip, aiCfg);
          }
          // admin custom key (single backend — forward tới z.ai với key admin)
          const headers = new Headers(request.headers);
          if (!headers.get('Authorization') && adminKey) headers.set('Authorization', `Bearer ${adminKey}`);
          request = new Request(request, { headers });
          return makeProxy(host)({ request, params, env });
        }
        return makeProxy(host)({ request, params, env });
      }
    }

    // 3) static assets (SPA fallback) — [R49] Cache-Control cho /assets/ (immutable 1 năm)
    const res = withSecurityHeaders(await env.ASSETS.fetch(request));
    if (res.status === 404) {
      return withSecurityHeaders(await env.ASSETS.fetch(new Request(new URL('/index.html', url), request)));
    }
    // [R49 OPTIMIZE] /assets/*.js + *.css có hash → immutable cache 1 năm
    if (url.pathname.startsWith('/assets/')) {
      const headers = new Headers(res.headers);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return new Response(res.body, { status: res.status, headers });
    }
    // [R49 OPTIMIZE] PNG/WebP → cache 1 ngày
    if (/\.(png|webp|jpg|jpeg|gif|svg)$/.test(url.pathname)) {
      const headers = new Headers(res.headers);
      headers.set('Cache-Control', 'public, max-age=86400');
      return new Response(res.body, { status: res.status, headers });
    }
    // [R49 OPTIMIZE] fonts → immutable 1 năm
    if (/\.(woff2?|ttf|eot)$/.test(url.pathname)) {
      const headers = new Headers(res.headers);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return new Response(res.body, { status: res.status, headers });
    }
    return res;
  },
};

// [REMOVED] VIP redeem/vip-gen + PLANS — gỡ hệ thống payment cho App Store (app free).

