// Cloudflare Worker — serve static app (dist/) + proxy LLM + admin analytics/kill-switch.
// "1 worker lo cả": static assets + /zai /openai ... proxy + /api/event log + /admin dashboard.
import { makeProxy } from '../functions/_proxy.js';
import { handleAdminRoute, isAiEnabled } from './admin.js';

const PROXIES = [
  ['/cf-ai', 'https://api.cloudflare.com'],
  ['/zai', 'https://api.z.ai'],
  ['/openai', 'https://api.openai.com'],
  ['/deepseek', 'https://api.deepseek.com'],
  ['/bigmodel', 'https://open.bigmodel.cn'],
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1) Admin + logging routes (/api/event, /admin*) — trước proxy & assets
    if (url.pathname === '/api/event' || url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
      return handleAdminRoute(request, env, url);
    }

    // 2) proxy LLM API (cùng-origin → không CORS)
    for (const [prefix, host] of PROXIES) {
      if (url.pathname === prefix || url.pathname.startsWith(prefix + '/')) {
        // [admin kill-switch loop 1351] AI bị tắt → chặn TẤT CẢ proxy LLM (503)
        if (!(await isAiEnabled(env))) {
          return new Response(JSON.stringify({ error: { message: 'AI đang bị TẮT bởi quản trị viên.', type: 'ai_disabled' } }), { status: 503, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' } });
        }
        const sub = url.pathname.slice(prefix.length);
        const params = { path: sub.split('/').filter(Boolean) };
        // [loop 905] /cf-ai: inject key server-side — user không cần nhập
        if (prefix === '/cf-ai') {
          const headers = new Headers(request.headers);
          if (!headers.get('Authorization') && env.CF_AI_KEY) headers.set('Authorization', `Bearer ${env.CF_AI_KEY}`);
          request = new Request(request, { headers });
        }
        return makeProxy(host)({ request, params, env });
      }
    }

    // 3) static assets (fallback index.html cho SPA)
    const res = await env.ASSETS.fetch(request);
    if (res.status === 404) {
      return env.ASSETS.fetch(new Request(new URL('/index.html', url), request));
    }
    return res;
  },
};
