// Cloudflare Worker — serve static app + proxy LLM + admin + anti-scraping + anti-abuse.
import { makeProxy } from '../functions/_proxy.js';
import { handleAdminRoute, isAiEnabled, isFreeAiEnabled, logFreeUsage } from './admin.js';

const PROXIES = [
  ['/cf-ai', 'https://api.cloudflare.com'],
  ['/zai', 'https://api.z.ai'],
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
    if (url.pathname === '/api/event' || url.pathname === '/api/ai-config' || url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
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
          let adminKey = null;
          try { const c = JSON.parse((await env.ADMIN_KV.get('ai:config')) || '{}'); adminKey = c.apiKey || null; } catch (e) {}
          // [loop 1357] free model = KHÔNG có admin custom key → dùng CF_AI_KEY public (glm-5.2)
          const isFree = !adminKey;
          if (isFree && !(await isFreeAiEnabled(env))) {
            return new Response(JSON.stringify({ error: { message: 'Model free glm-5.2 đang bị TẮT bởi quản trị viên.', type: 'free_ai_disabled' } }), { status: 503, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' } });
          }
          const headers = new Headers(request.headers);
          const key = adminKey || env.CF_AI_KEY;
          if (!headers.get('Authorization') && key) headers.set('Authorization', `Bearer ${key}`);
          request = new Request(request, { headers });
          const out = await makeProxy(host)({ request, params, env });
          // [loop 1357] track usage free model (calls ok/err + IP + day).
          //   Dùng ctx.waitUntil — KHÔNG fire-and-forget (Worker kill isolate sau return → KV write bị cắt).
          if (isFree && env.ADMIN_KV && ctx && ctx.waitUntil) ctx.waitUntil(logFreeUsage(env, ip, out.status));
          return out;
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
