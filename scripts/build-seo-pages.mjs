// ============================================================================
//  build-seo-pages.mjs — Generate 1523 SEO landing pages (PREMIUM template)
// ============================================================================
import { DAOZANG } from '../src/engine/daozang-data.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'public/kinh');
mkdirSync(OUT_DIR, { recursive: true });
const SITE = 'https://battu.god8.shop';

function slugify(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0d0b14;color:#e8e0d0;line-height:1.65;max-width:760px;margin:0 auto;padding:0}
.zh{font-family:'Noto Serif SC','Songti SC',serif}
.hero{background:linear-gradient(135deg,#1a1530,#0f0c1f);padding:32px 24px 24px;border-bottom:2px solid #d4af37}
.hero h1{font-size:1.6rem;color:#d4af37;line-height:1.3}
.hero .han{font-size:1.8rem;color:#e0c890;display:block;margin-bottom:4px}
.hero .meta{color:#a09070;font-size:0.82rem;margin-top:8px}
.hero .meta .badge{display:inline-block;background:rgba(212,175,55,.12);border:1px solid rgba(212,175,55,.3);color:#d4af37;padding:2px 10px;border-radius:12px;font-size:0.72rem;margin:2px}
.section{padding:20px 24px;border-bottom:1px solid #1e1a2e}
.section h2{font-size:1.05rem;color:#d4af37;margin-bottom:10px;display:flex;align-items:center;gap:6px}
.section h3{font-size:0.9rem;color:#c0a060;margin:12px 0 6px}
.section p{font-size:0.88rem;color:#c8c0b0;margin-bottom:8px}
.han-box{background:#13111c;border-left:3px solid #d4af37;padding:12px 16px;margin:10px 0;border-radius:0 6px 6px 0;font-size:0.92rem;line-height:1.9;color:#e8d8b8}
.logic-box{background:rgba(212,175,55,.05);border:1px solid rgba(212,175,55,.15);border-radius:8px;padding:14px 16px;margin:10px 0}
.logic-box .step{display:flex;gap:8px;margin:6px 0;font-size:0.82rem;color:#b0a090}
.logic-box .step::before{content:'→';color:#d4af37;font-weight:700}
.vi-box{background:rgba(127,191,127,.06);border:1px solid rgba(127,191,127,.15);border-radius:8px;padding:14px 16px;margin:10px 0;font-size:0.88rem;color:#b8d0b8}
.src{padding:16px 24px;font-size:0.78rem;color:#807060}
.src a{color:#d4af37}
.src li{margin:4px 0}
.back-nav{padding:16px 24px 32px;text-align:center}
.back-nav a{color:#d4af37;font-size:0.85rem;margin:0 8px}
.foot{padding:12px 24px;background:#0a0810;font-size:0.72rem;color:#555;text-align:center}
@media(max-width:600px){.hero{padding:24px 16px}.section{padding:16px}.hero h1{font-size:1.3rem}.hero .han{font-size:1.5rem}}
`;

let count = 0;
const sitemapUrls = [];
const indexEntries = [];

for (const e of DAOZANG) {
  const slug = slugify(e.name_vi || e.name_han);
  if (!slug) continue;
  const dz = (e.notes || '').match(/DZ0*\d+/i)?.[0] || '';
  const title = `${e.name_vi || e.name_han} (${e.name_han})${dz ? ' — ' + dz : ''} | Thư viện Huyền học`;
  const desc = (e.meaning || '').slice(0, 155).replace(/\n/g, ' ');
  const url = `${SITE}/kinh/${slug}.html`;
  const jsonLd = { '@context':'https://schema.org','@type':'Article',name:e.name_vi||e.name_han,description:desc,about:e.name_han,author:{'@type':'Organization',name:'Lữ Đăng'},keywords:[e.name_han,e.name_vi,e.bu,e.topic].filter(Boolean).join(', ') };

  const sources = (e.sources || []).slice(0, 4).map((s) => {
    const m = s.match(/^(https?:\/\/\S+)/);
    return m ? `<li><a href="${esc(m[1])}" rel="nofollow noopener" target="_blank">${esc(m[1].replace(/^https?:\/\//,'').slice(0,50))}</a></li>` : '';
  }).join('');

  // Count layers for badge
  const layers = [];
  if (e.meaning) layers.push('Essence');
  if (e.deep_essence) layers.push('Deep');
  if (e.logic_thesis) layers.push('Logic');
  if (e.full_vn) layers.push('VN');

  // Build logic chain as visual steps
  const logicChainHtml = e.logic_chain
    ? e.logic_chain.split(/[→\n]|-\s>/).filter(s=>s.trim()).map(s => `<div class="step">${esc(s.trim())}</div>`).join('')
    : '';

  const html = `<!doctype html><html lang="vi"><head>
<meta charset="utf-8"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}"/>
<meta name="keywords" content="${esc(e.name_han)}, ${esc(e.name_vi||'')}, ${esc(e.bu||'')}, kinh đạo giáo, huyền học, bát tự"/>
<meta property="og:type" content="article"/>
<meta property="og:title" content="${esc(e.name_vi||e.name_han)}"/>
<meta property="og:description" content="${esc(desc)}"/>
<meta name="robots" content="index,follow"/>
<link rel="canonical" href="${esc(url)}"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600;700&display=swap" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>${CSS}</style>
</head><body>

<div class="hero">
<span class="han zh">${esc(e.name_han)}</span>
<h1>${esc(e.name_vi || '')}</h1>
<div class="meta">
${e.bu ? `<span class="badge">${esc(e.bu)}</span>` : ''}
${e.author ? `<span class="badge">${esc(e.author)}</span>` : ''}
${e.era ? `<span class="badge">${esc(e.era)}</span>` : ''}
${dz ? `<span class="badge">${esc(dz)}</span>` : ''}
${layers.length ? `<span class="badge">${layers.length} tầng phân tích</span>` : ''}
</div>
</div>

${e.han_text ? `<div class="section"><div class="han-box zh">${esc(e.han_text)}</div></div>` : ''}

${e.meaning ? `<div class="section"><h2>📋 Tóm tắt <span class="zh" style="font-size:.8rem;color:#807060">提要</span></h2><p>${esc(e.meaning)}</p>${e.use ? `<p style="color:#a09070;font-size:.82rem"><b>Ứng dụng:</b> ${esc(e.use)}</p>` : ''}</div>` : ''}

${e.deep_essence ? `<div class="section"><h2>📖 Phân tích sâu <span class="zh" style="font-size:.8rem;color:#807060">深度分析</span></h2><p>${esc(e.deep_essence)}</p>${e.deep_passages ? `<div class="han-box zh">${esc(e.deep_passages)}</div>` : ''}${e.deep_application ? `<p style="color:#d4af37;font-size:.82rem;margin-top:8px"><b>⚡ Ứng dụng:</b> ${esc(e.deep_application)}</p>` : ''}${e.deep_related ? `<p style="color:#807060;font-size:.8rem"><b>🔗 Liên quan:</b> ${esc(e.deep_related)}</p>` : ''}</div>` : ''}

${e.logic_thesis ? `<div class="section"><h2>🎯 Lý luận <span class="zh" style="font-size:.8rem;color:#807060">邏輯鏈</span></h2><div class="logic-box"><p style="color:#d4af37;font-weight:600">${esc(e.logic_thesis)}</p>${logicChainHtml ? `<h3 style="margin-top:10px">🔗 Chuỗi lý luận</h3>${logicChainHtml}` : ''}${e.logic_practice ? `<h3 style="margin-top:10px">⚡ Thực hành BaZi</h3><p>${esc(e.logic_practice)}</p>` : ''}${e.logic_compare ? `<h3 style="margin-top:10px">⚖ So sánh</h3><p style="color:#a0b0c0">${esc(e.logic_compare)}</p>` : ''}</div></div>` : ''}

${e.full_vn ? `<div class="section"><h2>🇻🇳 Bản dịch Việt <span style="font-size:.8rem;color:#807060">越譯</span></h2><div class="vi-box">${esc(e.full_vn)}</div></div>` : ''}

${sources ? `<div class="src"><b>Nguồn tham chiếu học thuật:</b><ul>${sources}</ul></div>` : ''}

<div class="back-nav">
<a href="/">← Xem lá số Bát Tự</a>
<a href="/kinh/index.html">← Mục lục ${DAOZANG.length} kinh</a>
</div>

<div class="foot">Lữ Đăng · Bát Tự Dụng Thần · Tham chiếu văn hoá-tôn giáo · KHÔNG chẩn đoán y tế</div>
</body></html>`;

  writeFileSync(resolve(OUT_DIR, slug + '.html'), html, 'utf8');
  sitemapUrls.push(url);
  indexEntries.push({ slug, name_han: e.name_han || '', name_vi: e.name_vi || '', bu: e.bu || 'khác', topic: e.topic || '', dz, meaning: (e.meaning||'').replace(/\s+/g,' ').slice(0,120) });
  count++;
}

// sitemap
writeFileSync(resolve(ROOT, 'public/sitemap-kinh.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map(u=>`  <url><loc>${u}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`).join('\n')}\n</urlset>`, 'utf8');

// index
const byBu = new Map();
for (const it of indexEntries) { if (!byBu.has(it.bu)) byBu.set(it.bu, []); byBu.get(it.bu).push(it); }
const buGroups = [...byBu.entries()].sort((a,b)=>b[1].length-a[1].length||a[0].localeCompare(b[0],'zh')).map(([bu,items])=>{items.sort((a,b)=>(a.name_vi||a.name_han).localeCompare(b.name_vi||b.name_han,'vi'));return[bu,items];});
const groupHtml = buGroups.map(([bu,items])=>{
  const lis = items.map(it=>{
    const label = it.name_vi ? `<span class="zh">${esc(it.name_han)}</span> — ${esc(it.name_vi)}` : `<span class="zh">${esc(it.name_han)}</span>`;
    const meta = [it.topic,it.dz].filter(Boolean).join(' · ');
    const blurb = it.meaning ? `<span class="blurb">${esc(it.meaning)}${it.meaning.length>=120?'…':''}</span>` : '';
    return `<li class="kinh-item" data-q="${esc((it.name_han+' '+it.name_vi+' '+it.bu+' '+it.topic+' '+it.dz).toLowerCase())}"><a href="/kinh/${esc(it.slug)}.html">${label}</a>${meta?`<span class="tag">${esc(meta)}</span>`:''}${blurb}</li>`;
  }).join('\n');
  return `<section class="bu-group" data-bu="${esc(bu)}"><h2><span class="zh">${esc(bu)}</span> <span class="cnt">${items.length}</span></h2><ul class="kinh-list">${lis}</ul></section>`;
}).join('\n');

const indexHtml = `<!doctype html><html lang="vi"><head>
<meta charset="utf-8"/>
<title>Thư viện Huyền học — ${count} kinh 道藏 | Lữ Đăng</title>
<meta name="description" content="Thư viện ${count} kinh điển Huyền học — 道藏, 符咒, tu luyện, phong thủy. Mỗi kinh có 4 tầng phân tích + nguồn học thuật."/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="robots" content="index,follow"/>
<link rel="canonical" href="${SITE}/kinh/index.html"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}
body{font-family:-apple-system,sans-serif;max-width:820px;margin:0 auto;padding:20px 16px 48px;line-height:1.55;color:#e8e0d0;background:#0d0b14}
h1{font-size:1.55rem;margin:0 0 6px;color:#d4af37}.zh{font-family:'Noto Serif SC',serif;color:#e0c890}
.sub{color:#a09070;font-size:.92rem;margin:0 0 14px}
.stats{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 16px}
.stat{background:#13111c;border:1px solid #2a2440;border-radius:8px;padding:8px 12px;font-size:.78rem;color:#a09070}
.stat b{display:block;font-size:1.15rem;color:#d4af37}
#q{width:100%;padding:12px 14px;border:1px solid #3a3450;border-radius:10px;font-size:1rem;margin:8px 0 6px;background:#13111c;color:#e8e0d0}
#q:focus{outline:2px solid #d4af37;border-color:#d4af37}
#hit{font-size:.8rem;color:#807060;margin-bottom:12px}
.bu-group{margin:18px 0}
.bu-group h2{font-size:1.05rem;margin:0 0 8px;padding:8px 12px;background:linear-gradient(135deg,#1a1530,#13111c);color:#d4af37;border-radius:8px;display:flex;justify-content:space-between;align-items:center;border:1px solid #2a2440}
.bu-group h2 .cnt{font-size:.75rem;color:#c0a060;font-weight:600}
.kinh-list{list-style:none;padding:0;margin:0;display:grid;gap:6px}
.kinh-item{background:#13111c;border:1px solid #1e1a2e;border-radius:8px;padding:10px 12px;transition:border-color .15s}
.kinh-item:hover{border-color:#d4af37}
.kinh-item a{color:#e8e0d0;text-decoration:none;font-weight:600;font-size:.92rem}
.kinh-item a:hover{color:#d4af37}
.kinh-item .tag{display:inline-block;margin-left:6px;font-size:.68rem;color:#d4af37;background:rgba(212,175,55,.1);padding:1px 7px;border-radius:10px}
.kinh-item .blurb{display:block;font-size:.78rem;color:#807070;margin-top:4px;font-weight:400}
.kinh-item.hidden,.bu-group.hidden{display:none}
.foot{margin-top:28px;padding-top:16px;border-top:1px solid #1e1a2e;font-size:.82rem;color:#666;text-align:center}
.foot a{color:#d4af37}
.sample{margin:10px 0 16px;padding:10px 12px;background:rgba(212,175,55,.06);border-left:3px solid #d4af37;border-radius:0 8px 8px 0;font-size:.85rem}
.sample a{color:#d4af37;font-weight:600}
</style></head><body>
<h1>Thư viện Huyền học — <span class="zh">${count} kinh</span></h1>
<p class="sub">Danh sách đầy đủ ${count} kinh điển. Mỗi kinh có trang riêng: tóm tắt · phân tích sâu · chuỗi lý luận · bản dịch Việt + nguồn học thuật.</p>
<div class="stats"><div class="stat"><b>${count}</b>Kinh điển</div><div class="stat"><b>${buGroups.length}</b>Bộ / 部</div><div class="stat"><b>4</b>Tầng phân tích</div><div class="stat"><b>3.14M</b>Ký tự</div></div>
<div class="sample">Mẫu: <a href="/kinh/dao-duc-kinh.html">道德经 / Đạo Đức Kinh</a> · <a href="/kinh/am-phu-kinh-tam-hoang-ngoc-quyet-nguyen-de-hien-vien-hoang-de.html">阴符经 / Âm Phù Kinh</a> · <a href="/">← App Bát Tự</a></div>
<input id="q" type="search" placeholder="Tìm kinh… (Hán / Việt / DZ / chủ đề)" autocomplete="off" aria-label="Tìm kiếm"/>
<div id="hit">Hiển thị tất cả ${count} kinh · gõ để lọc</div>
${groupHtml}
<div class="foot"><p>Lữ Đăng · Tham chiếu văn hoá-tôn giáo · không thay thế tư vấn chuyên môn.</p><p><a href="/">Bát Tự Dụng Thần</a> · <a href="/sitemap-kinh.xml">Sitemap</a></p></div>
<script>(function(){var q=document.getElementById('q'),hit=document.getElementById('hit'),items=[].slice.call(document.querySelectorAll('.kinh-item')),groups=[].slice.call(document.querySelectorAll('.bu-group')),total=${count};function run(){var s=(q.value||'').trim().toLowerCase(),n=0;items.forEach(function(li){var ok=!s||(li.getAttribute('data-q')||'').indexOf(s)!==-1;li.classList.toggle('hidden',!ok);if(ok)n++;});groups.forEach(function(g){g.classList.toggle('hidden',!g.querySelector('.kinh-item:not(.hidden)'));});hit.textContent=s?('Tìm thấy '+n+' / '+total+' kinh'):('Hiển thị tất cả '+total+' kinh');}q.addEventListener('input',run);})();</script>
</body></html>`;
writeFileSync(resolve(OUT_DIR, 'index.html'), indexHtml, 'utf8');
console.log(`[seo] Generated ${count} kinh pages + sitemap + index (${buGroups.length} 部)`);
