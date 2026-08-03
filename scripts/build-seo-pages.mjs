// ============================================================================
//  build-seo-pages.mjs — Generate 1523 SEO landing pages from daozang kinh corpus.
//  Each kinh = 1 static HTML page with proper meta + JSON-LD + internal links.
//  Output: public/kinh/{slug}.html + public/sitemap-kinh.xml + public/kinh/index.html
// ============================================================================
import { DAOZANG } from '../src/engine/daozang-data.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'public/kinh');
mkdirSync(OUT_DIR, { recursive: true });

const SITE = 'https://battu.god8.shop'; // adjust if domain differs

// slug: name_vi → lowercase-hyphenated, strip diacritics for URL friendliness
function slugify(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, '-') // keep alphanum + CJK
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let count = 0;
const sitemapUrls = [];
const indexEntries = []; // { slug, name_han, name_vi, bu, topic, dz, meaning }

for (const e of DAOZANG) {
  const slug = slugify(e.name_vi || e.name_han);
  if (!slug) continue;
  const dz = (e.notes || '').match(/DZ0*\d+/i)?.[0] || '';
  const title = `${e.name_vi || e.name_han} (${e.name_han})${dz ? ' — ' + dz : ''} | Thư viện Huyền học`;
  const desc = (e.meaning || '').slice(0, 155).replace(/\n/g, ' ');
  const url = `${SITE}/kinh/${slug}.html`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    name: e.name_vi || e.name_han,
    description: desc,
    about: e.name_han,
    author: { '@type': 'Organization', name: 'Bát Tự Dụng Thần' },
    keywords: [e.name_han, e.name_vi, e.bu, e.topic].filter(Boolean).join(', '),
  };

  const sources = (e.sources || []).slice(0, 4).map((s) => {
    const m = s.match(/^(https?:\/\/\S+)/);
    return m ? `<li><a href="${esc(m[1])}" rel="nofollow noopener" target="_blank">${esc(m[1].replace(/^https?:\/\//, '').slice(0, 50))}</a></li>` : '';
  }).join('');

  const html = `<!doctype html><html lang="vi"><head>
<meta charset="utf-8"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}"/>
<meta name="keywords" content="${esc(e.name_han)}, ${esc(e.name_vi || '')}, ${esc(e.bu || '')}, kinh đạo giáo, huyền học, bát tự"/>
<meta property="og:type" content="article"/>
<meta property="og:title" content="${esc(e.name_vi || e.name_han)}"/>
<meta property="og:description" content="${esc(desc)}"/>
<meta name="robots" content="index,follow"/>
<link rel="canonical" href="${esc(url)}"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>body{font-family:system-ui,sans-serif;max-width:720px;margin:0 auto;padding:24px;line-height:1.7;color:#1a1a1a}h1{font-size:1.5rem}.zh{font-family:'Noto Serif SC',serif;color:#9b6a2a}.meta{color:#666;font-size:0.9rem}.han-box{background:#f7f1e3;border-left:3px solid #9b6a2a;padding:12px 16px;margin:16px 0;font-family:'Noto Serif SC',serif}.src{font-size:0.85rem;color:#555;margin-top:16px}.src ul{padding-left:18px}.back{margin-top:24px}.back a{color:#9b6a2a}</style>
</head><body>
<h1><span class="zh">${esc(e.name_han)}</span> — ${esc(e.name_vi || '')}</h1>
<p class="meta">${esc(e.bu || '')}${e.author ? ' · ' + esc(e.author) : ''}${e.era ? ' · ' + esc(e.era) : ''}${dz ? ' · ' + esc(dz) : ''}${e.textual_certainty ? ' · certainty: ' + esc(e.textual_certainty) : ''}</p>
${e.han_text ? `<div class="han-box">${esc(e.han_text)}</div>` : ''}
<p>${esc(e.meaning || '')}</p>
${e.use ? `<p><b>Ứng dụng:</b> ${esc(e.use)}</p>` : ''}
${e.deep_essence ? `<h2>📖 Phân tích sâu</h2><p>${esc(e.deep_essence)}</p>` : ''}
${e.deep_passages ? `<h2>墨 Đoạn Hán verbatim</h2><div class="han-box">${esc(e.deep_passages)}</div>` : ''}
${e.deep_application ? `<p><b>⚡ Ứng dụng chuyên sâu:</b> ${esc(e.deep_application)}</p>` : ''}
${e.deep_related ? `<p><b>🔗 Liên quan:</b> ${esc(e.deep_related)}</p>` : ''}
${e.logic_thesis ? `<h2>🎯 Lý luận — Luận điểm</h2><p>${esc(e.logic_thesis)}</p>` : ''}
${e.logic_chain ? `<h3>🔗 Chuỗi lý luận</h3><p>${esc(e.logic_chain)}</p>` : ''}
${e.logic_practice ? `<h3>⚡ Thực hành BaZi</h3><p>${esc(e.logic_practice)}</p>` : ''}
${e.logic_compare ? `<h3>⚖ So sánh</h3><p>${esc(e.logic_compare)}</p>` : ''}
${e.full_vn ? `<h2>🇻🇳 Bản dịch Việt</h2><p>${esc(e.full_vn)}</p>` : ''}
${sources ? `<div class="src"><b>Nguồn tham chiếu:</b><ul>${sources}</ul></div>` : ''}
<p class="back"><a href="/">← Xem lá số Bát Tự của bạn</a> · <a href="/kinh/index.html">← Mục lục ${DAOZANG.length} kinh</a></p>
</body></html>`;

  writeFileSync(resolve(OUT_DIR, slug + '.html'), html, 'utf8');
  sitemapUrls.push(url);
  indexEntries.push({
    slug,
    name_han: e.name_han || '',
    name_vi: e.name_vi || '',
    bu: e.bu || 'khác',
    topic: e.topic || '',
    dz,
    meaning: (e.meaning || '').replace(/\s+/g, ' ').slice(0, 120),
  });
  count++;
}

// sitemap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((u) => `  <url><loc>${u}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`).join('\n')}
</urlset>`;
writeFileSync(resolve(ROOT, 'public/sitemap-kinh.xml'), sitemap, 'utf8');

// index page (hub) — full list of all kinh, searchable, grouped by 部
const byBu = new Map();
for (const it of indexEntries) {
  if (!byBu.has(it.bu)) byBu.set(it.bu, []);
  byBu.get(it.bu).push(it);
}
// sort groups by size desc, items by name_vi/han
const buGroups = [...byBu.entries()]
  .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'zh'))
  .map(([bu, items]) => {
    items.sort((a, b) => (a.name_vi || a.name_han).localeCompare(b.name_vi || b.name_han, 'vi'));
    return [bu, items];
  });

const groupHtml = buGroups.map(([bu, items]) => {
  const lis = items.map((it) => {
    const label = it.name_vi
      ? `<span class="zh">${esc(it.name_han)}</span> — ${esc(it.name_vi)}`
      : `<span class="zh">${esc(it.name_han)}</span>`;
    const meta = [it.topic, it.dz].filter(Boolean).join(' · ');
    const blurb = it.meaning ? `<span class="blurb">${esc(it.meaning)}${it.meaning.length >= 120 ? '…' : ''}</span>` : '';
    return `<li class="kinh-item" data-q="${esc((it.name_han + ' ' + it.name_vi + ' ' + it.bu + ' ' + it.topic + ' ' + it.dz).toLowerCase())}"><a href="/kinh/${esc(it.slug)}.html">${label}</a>${meta ? `<span class="tag">${esc(meta)}</span>` : ''}${blurb}</li>`;
  }).join('\n');
  return `<section class="bu-group" data-bu="${esc(bu)}"><h2><span class="zh">${esc(bu)}</span> <span class="cnt">${items.length}</span></h2><ul class="kinh-list">${lis}</ul></section>`;
}).join('\n');

const indexHtml = `<!doctype html>
<html lang="vi"><head>
<meta charset="utf-8"/>
<title>Thư viện Huyền học — ${count} kinh 道藏 | Bát Tự Dụng Thần</title>
<meta name="description" content="Thư viện ${count} kinh điển Huyền học Trung Hoa — 道藏, 符咒, tu luyện, phong thủy. Mỗi kinh có 4 tầng phân tích + nguồn học thuật."/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="robots" content="index,follow"/>
<link rel="canonical" href="${SITE}/kinh/index.html"/>
<style>
*{box-sizing:border-box}
body{font-family:system-ui,-apple-system,sans-serif;max-width:820px;margin:0 auto;padding:20px 16px 48px;line-height:1.55;color:#1a1a1a;background:#faf8f4}
h1{font-size:1.55rem;margin:0 0 6px;color:#1a1530}
.zh{font-family:'Noto Serif SC','Songti SC',serif;color:#9b6a2a}
.sub{color:#666;font-size:.92rem;margin:0 0 14px}
.stats{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 16px}
.stat{background:#fff;border:1px solid #e5dcc8;border-radius:8px;padding:8px 12px;font-size:.78rem;color:#555}
.stat b{display:block;font-size:1.15rem;color:#9b6a2a}
#q{width:100%;padding:12px 14px;border:1px solid #d4c4a0;border-radius:10px;font-size:1rem;margin:8px 0 6px;background:#fff}
#q:focus{outline:2px solid #d4af37;border-color:#d4af37}
#hit{font-size:.8rem;color:#888;margin-bottom:12px}
.bu-group{margin:18px 0}
.bu-group h2{font-size:1.05rem;margin:0 0 8px;padding:8px 10px;background:#1a1530;color:#f0e8d0;border-radius:8px;display:flex;justify-content:space-between;align-items:center}
.bu-group h2 .zh{color:#e0c890}
.bu-group h2 .cnt{font-size:.75rem;color:#c0a060;font-weight:600}
.kinh-list{list-style:none;padding:0;margin:0;display:grid;gap:6px}
.kinh-item{background:#fff;border:1px solid #ebe3d2;border-radius:8px;padding:10px 12px}
.kinh-item a{color:#1a1530;text-decoration:none;font-weight:600;font-size:.92rem}
.kinh-item a:hover{color:#9b6a2a}
.kinh-item .tag{display:inline-block;margin-left:6px;font-size:.68rem;color:#9b6a2a;background:rgba(155,106,42,.1);padding:1px 7px;border-radius:10px}
.kinh-item .blurb{display:block;font-size:.78rem;color:#777;margin-top:4px;font-weight:400}
.kinh-item.hidden,.bu-group.hidden{display:none}
.foot{margin-top:28px;padding-top:16px;border-top:1px solid #e5dcc8;font-size:.82rem;color:#666}
.foot a{color:#9b6a2a}
.sample{margin:10px 0 16px;padding:10px 12px;background:#fff;border-left:3px solid #d4af37;border-radius:0 8px 8px 0;font-size:.85rem}
.sample a{color:#9b6a2a;font-weight:600}
</style>
</head><body>
<h1>Thư viện Huyền học — <span class="zh">${count} kinh</span></h1>
<p class="sub">Danh sách đầy đủ ${count} kinh điển. Mỗi kinh có trang riêng: tóm tắt · phân tích sâu · chuỗi lý luận · bản dịch Việt + nguồn học thuật (Schipper · ctext · 道藏).</p>
<div class="stats">
  <div class="stat"><b>${count}</b>Kinh điển</div>
  <div class="stat"><b>${buGroups.length}</b>Bộ / 部</div>
  <div class="stat"><b>4</b>Tầng phân tích</div>
  <div class="stat"><b>VI·ZH·EN</b>Đa ngữ</div>
</div>
<div class="sample">
  Mẫu xem nhanh:
  <a href="/kinh/dao-duc-kinh.html">道德经 / Đạo Đức Kinh</a> ·
  <a href="/kinh/am-phu-kinh-tam-hoang-ngoc-quyet-nguyen-de-hien-vien-hoang-de.html">阴符经 / Âm Phù Kinh</a> ·
  <a href="/">← App Bát Tự</a>
</div>
<input id="q" type="search" placeholder="Tìm kinh… (Hán / Việt / DZ / chủ đề)" autocomplete="off" aria-label="Tìm kiếm kinh điển"/>
<div id="hit">Hiển thị tất cả ${count} kinh · gõ để lọc</div>
${groupHtml}
<div class="foot">
  <p>Thư viện Huyền học · tham chiếu văn hoá-tôn giáo · không thay thế tư vấn chuyên môn.</p>
  <p><a href="/">Bát Tự Dụng Thần</a> · <a href="/review-evidence.html">Evidence for App Review</a> · <a href="/sitemap-kinh.xml">Sitemap</a></p>
</div>
<script>
(function(){
  var q=document.getElementById('q'), hit=document.getElementById('hit');
  var items=[].slice.call(document.querySelectorAll('.kinh-item'));
  var groups=[].slice.call(document.querySelectorAll('.bu-group'));
  var total=${count};
  function run(){
    var s=(q.value||'').trim().toLowerCase();
    var n=0;
    items.forEach(function(li){
      var ok=!s || (li.getAttribute('data-q')||'').indexOf(s)!==-1;
      li.classList.toggle('hidden', !ok);
      if(ok) n++;
    });
    groups.forEach(function(g){
      var any=g.querySelector('.kinh-item:not(.hidden)');
      g.classList.toggle('hidden', !any);
    });
    hit.textContent = s
      ? ('Tìm thấy '+n+' / '+total+' kinh cho «'+q.value.trim()+'»')
      : ('Hiển thị tất cả '+total+' kinh · gõ để lọc');
  }
  q.addEventListener('input', run);
})();
</script>
</body></html>`;
writeFileSync(resolve(OUT_DIR, 'index.html'), indexHtml, 'utf8');

console.log(`[seo] Generated ${count} kinh pages + sitemap-kinh.xml (${sitemapUrls.length} URLs) + index.html (${indexEntries.length} listed, ${buGroups.length} 部)`);
