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
    if (url.pathname === '/api/event' || url.pathname === '/api/ai-config' || url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
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
        // [loop 905/1351] /cf-ai: inject key — ưu tiên ADMIN custom key (KV ai:config), fallback CF_AI_KEY
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

    // 3) static assets (fallback index.html cho SPA)
    const res = await env.ASSETS.fetch(request);
    if (res.status === 404) {
      return env.ASSETS.fetch(new Request(new URL('/index.html', url), request));
    }
    return res;
  },
};
