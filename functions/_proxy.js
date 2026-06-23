// Proxy chung cho LLM API — tránh CORS khi gọi từ web production (Cloudflare Pages).
// Browser → /zai/... (cùng origin, không CORS) → function forward → nhà cung cấp.
// Key đi theo header Authorization từ browser (localStorage của user), không lưu ở server.
export function makeProxy(host) {
  return async (context) => {
    const { request, params } = context;
    const url = new URL(request.url);
    const origin = url.origin;
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    const sub = Array.isArray(params.path) && params.path.length ? '/' + params.path.join('/') : '';
    const target = host + sub + url.search;
    // chỉ forward header cần thiết (Content-Type + Authorization)
    const headers = new Headers();
    const ct = request.headers.get('content-type');
    if (ct) headers.set('content-type', ct);
    const auth = request.headers.get('authorization');
    if (auth) headers.set('authorization', auth);
    const init = { method: request.method, headers };
    if (!['GET', 'HEAD'].includes(request.method)) init.body = request.body;
    let res;
    try {
      res = await fetch(target, init);
    } catch (err) {
      return new Response(JSON.stringify({ error: { message: 'proxy fetch failed: ' + err.message } }), {
        status: 502, headers: { 'content-type': 'application/json', ...corsHeaders(origin) },
      });
    }
    const out = new Response(res.body, { status: res.status, statusText: res.statusText });
    for (const h of ['content-type', 'x-request-id', 'x-ratelimit-remaining-requests']) {
      const v = res.headers.get(h);
      if (v) out.headers.set(h, v);
    }
    for (const [k, v] of Object.entries(corsHeaders(origin))) out.headers.set(k, v);
    return out;
  };
}
function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
}
