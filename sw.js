// Service worker — PWA (cho Android/Chrome install + offline shell).
// An toàn: NETWORK-FIRST, không bao giờ block bằng cache cũ (tránh trắng trang).
const CACHE = 'bazi-mr2fd4qk'; // [loop 236] auto-versioned by Vite plugin (swAutoVersion) — replaced at build time with timestamp. This default only used if plugin doesn't run.
self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // POST (AI API) luôn đi thẳng
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;          // không đụng cross-origin (font, v.v.)
  if (url.pathname.startsWith('/zai') || url.pathname.startsWith('/openai') || url.pathname.startsWith('/deepseek') || url.pathname.startsWith('/bigmodel')) return; // proxy API: không cache
  // network-first, fallback cache (chỉ khi mất mạng)
  e.respondWith(
    fetch(req).then((res) => {
      if (res && res.status === 200 && res.type === 'basic') {
        const cp = res.clone();
        caches.open(CACHE).then((c) => c.put(req, cp)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match(req).then((m) => m || caches.match('/index.html')))
  );
});
