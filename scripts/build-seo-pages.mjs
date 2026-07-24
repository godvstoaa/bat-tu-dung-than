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
${sources ? `<div class="src"><b>Nguồn tham chiếu:</b><ul>${sources}</ul></div>` : ''}
<p class="back"><a href="/">← Xem lá số Bát Tự của bạn</a> · <a href="/#thu-vien-huyen-hoc">Thư viện Huyền học</a></p>
</body></html>`;

  writeFileSync(resolve(OUT_DIR, slug + '.html'), html, 'utf8');
  sitemapUrls.push(url);
  count++;
}

// sitemap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((u) => `  <url><loc>${u}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`).join('\n')}
</urlset>`;
writeFileSync(resolve(ROOT, 'public/sitemap-kinh.xml'), sitemap, 'utf8');

// index page (hub)
const indexHtml = `<!doctype html><html lang="vi"><head><meta charset="utf-8"/><title>Thư viện Huyền học — ${count} kinh 道藏 | Bát Tự Dụng Thần</title><meta name="description" content="Thư viện ${count} kinh điển Huyền học Trung Hoa — 道藏, 符咒, tu luyện, phong thủy. Tham chiếu học thuật."/><meta name="viewport" content="width=device-width,initial-scale=1"/></head><body><h1>Thư viện Huyền học — ${count} kinh</h1><p>Danh sách kinh điển. Mỗi kinh có trang riêng với giải nghĩa + nguồn.</p></body></html>`;
writeFileSync(resolve(OUT_DIR, 'index.html'), indexHtml, 'utf8');

console.log(`[seo] Generated ${count} kinh pages + sitemap-kinh.xml (${sitemapUrls.length} URLs) + index.html`);
