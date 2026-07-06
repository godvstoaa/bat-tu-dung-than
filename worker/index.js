// Cloudflare Worker — serve static app + proxy LLM + admin + anti-scraping + anti-abuse.
import { makeProxy } from '../functions/_proxy.js';
import { handleAdminRoute, isAiEnabled } from './admin.js';

const PROXIES = [
  ['/cf-ai', 'https://api.cloudflare.com'],
  ['/zai', 'https://api.z.ai'],
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

export default {
  async fetch(request, env) {
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

    // 0b) Block scraper UAs (trừ legit crawlers)
    if (SCRAPER_RE.test(ua) && !GOOD_BOT_RE.test(ua)) {
      return new Response('Forbidden', { status: 403 });
    }

    // 0c) Global rate-limit: 120 req/phút/IP (normal browsing <20/min; scraper >100/min)
    if (env.ADMIN_KV && url.pathname !== '/favicon.ico' && !url.pathname.startsWith('/assets/')) {
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
          const headers = new Headers(request.headers);
          const key = adminKey || env.CF_AI_KEY;
          if (!headers.get('Authorization') && key) headers.set('Authorization', `Bearer ${key}`);
          request = new Request(request, { headers });
        }
        return makeProxy(host)({ request, params, env });
      }
    }

    // 3) static assets (SPA fallback)
    const res = await env.ASSETS.fetch(request);
    if (res.status === 404) {
      return env.ASSETS.fetch(new Request(new URL('/index.html', url), request));
    }
    return res;
  },
};
