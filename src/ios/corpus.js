// ============================================================================
//  corpus.js — loader + search offline cho public/corpus/
// ============================================================================
const CORPUS_BASE = 'corpus';

let _index = null;
const _cache = new Map();
const LRU = 40;

function baseUrl() {
  return new URL(`${CORPUS_BASE}/`, document.baseURI).href;
}

export async function loadIndex() {
  if (_index) return _index;
  const res = await fetch(new URL('index.json', baseUrl()).href);
  if (!res.ok) throw new Error(`corpus index HTTP ${res.status}`);
  _index = await res.json();
  return _index;
}

export async function loadEntry(sid) {
  if (_cache.has(sid)) return _cache.get(sid);
  const res = await fetch(new URL(`entries/${encodeURIComponent(sid)}.json`, baseUrl()).href);
  if (!res.ok) throw new Error(`entry ${sid} HTTP ${res.status}`);
  const e = await res.json();
  _cache.set(sid, e);
  if (_cache.size > LRU) _cache.delete(_cache.keys().next().value);
  return e;
}

export function searchIndex(items, q) {
  const raw = String(q || '').trim().toLowerCase();
  if (!raw) return items.slice(0, 40);
  const tokens = raw.split(/\s+/).filter(Boolean);
  return items
    .map((it) => {
      const hay = it.search || '';
      let score = 0;
      for (const t of tokens) {
        if (hay.includes(t)) score += t.length >= 2 ? 3 : 1;
        if ((it.name_han || '').includes(q)) score += 5;
        if ((it.dz || '').toLowerCase() === t || (it.dz || '').toLowerCase().includes(t)) score += 6;
      }
      return { it, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 60)
    .map((x) => x.it);
}

/** Mục đọc hôm nay — xác định từ certainty=high theo ngày UTC. */
export function readerOfDay(items) {
  const high = items.filter((i) => i.textual_certainty === 'high');
  const pool = high.length ? high : items;
  if (!pool.length) return null;
  const day = new Date().toISOString().slice(0, 10);
  let h = 0;
  for (let i = 0; i < day.length; i++) h = (h * 33 + day.charCodeAt(i)) >>> 0;
  return pool[h % pool.length];
}

export function collectChips(items) {
  const bu = new Map();
  const topic = new Map();
  for (const it of items) {
    if (it.bu) bu.set(it.bu, (bu.get(it.bu) || 0) + 1);
    if (it.topic) topic.set(it.topic, (topic.get(it.topic) || 0) + 1);
  }
  const top = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
  return { bu: top(bu, 8), topic: top(topic, 8) };
}
