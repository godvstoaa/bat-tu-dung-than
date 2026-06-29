// Cloudflare Worker — serve static app (dist/) + proxy LLM API (tránh CORS).
// "up qua worker": 1 Worker duy nhất lo cả static assets lẫn /zai /openai ... proxy.
import { makeProxy } from '../functions/_proxy.js';

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
    // 1) proxy LLM API (cùng-origin → không CORS)
    for (const [prefix, host] of PROXIES) {
      if (url.pathname === prefix || url.pathname.startsWith(prefix + '/')) {
        const sub = url.pathname.slice(prefix.length);
        const params = { path: sub.split('/').filter(Boolean) };
        return makeProxy(host)({ request, params, env });
      }
    }
    // 2) static assets (fallback index.html cho SPA)
    const res = await env.ASSETS.fetch(request);
    if (res.status === 404) {
      return env.ASSETS.fetch(new Request(new URL('/index.html', url), request));
    }
    return res;
  },
};
