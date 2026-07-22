#!/usr/bin/env node
// ============================================================================
//  build-pdfs.mjs — Generate per-topic PDFs from the library corpus.
//  Zero npm deps: builds self-contained print HTML per topic, then renders to
//  PDF via installed Edge/Chrome headless --print-to-pdf (perfect Hán rendering).
//
//  Usage:
//    node scripts/build-pdfs.mjs --all          # every layer + index
//    node scripts/build-pdfs.mjs --topic fu     # one layer
//  Output: public/downloads/<slug>.pdf (+ .html source).
// ============================================================================
import { LIBRARY, LAYERS, ETHICS } from '../src/engine/library-data.js';
import { writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'public/downloads');
const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((p) => existsSync(p));

const TOPICS = [
  { layer: 'classic',     slug: '01-kinh-dien-bat-tu', title: 'Kinh Điển Bát Tự', zh: '經典' },
  { layer: 'fu',          slug: '02-phu-chu-talismans', title: 'Phù Bùa · Ấn', zh: '符籙' },
  { layer: 'mantra',      slug: '03-than-chu', title: 'Thần Chú', zh: '神咒' },
  { layer: 'ritual',      slug: '04-nghi-thuc', title: 'Nghi Thức · Ấn · 雷法', zh: '科儀' },
  { layer: 'cultivation', slug: '05-cong-phap', title: 'Công Pháp Tu Hành', zh: '功法' },
  { layer: 'phuongthuat', slug: '06-phuong-thuat', title: 'Phương Thuật', zh: '方術' },
  { layer: 'bitruyen',    slug: '07-bi-truyen-that-truyen', title: 'Bí Truyền · Thất Truyền · Tàn Quyển', zh: '秘傳' },
];

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const STRUCT_ZH = { head: '符頭', body: '符身', belly: '符腹', core: '符膽', foot: '符腳' };

function renderEntry(e) {
  const parts = [];
  parts.push(`<h2><span class="zh han">${esc(e.name_han)}</span> <small>${esc(e.name_vi || '')}</small></h2>`);
  parts.push(`<div class="meta"><span class="school">${esc(e.school)}</span> · <span class="cert cert-${esc(e.textual_certainty)}">● ${esc(e.textual_certainty)}</span></div>`);
  if (e.han_text) parts.push(`<div class="han-box"><span class="zh">${esc(e.han_text)}</span></div>`);
  if (e.layer === 'fu' && e.structure) {
    const rows = ['head', 'body', 'belly', 'core', 'foot'].filter((k) => e.structure[k])
      .map((k) => `<div><b class="zh">${STRUCT_ZH[k]}:</b> ${esc(e.structure[k])}</div>`).join('');
    parts.push(`<div class="struct"><i>Cấu trúc 符 (mô tả, không phải hướng dẫn vẽ):</i>${rows}</div>`);
  }
  if (e.visual) parts.push(`<p><b>Thị giác:</b> ${esc(e.visual)}</p>`);
  if (e.meaning) parts.push(`<p>${esc(e.meaning)}</p>`);
  if (e.use) parts.push(`<p class="muted"><b>Dùng:</b> ${esc(e.use)}</p>`);
  if (e.recitation_context) parts.push(`<p class="muted"><b>Context:</b> ${esc(e.recitation_context)}</p>`);
  if (e.notes) parts.push(`<p class="muted"><i>${esc(e.notes)}</i></p>`);
  const srcs = (e.sources || []).map((s) => { const m = s.match(/^(https?:\/\/\S+)\s*\(([^)]*)\)/); return `<li>${m ? `<a href="${m[1]}">${esc(m[2] || m[1])}</a> — <span class="muted">${esc(m[1])}</span>` : esc(s)}</li>`; }).join('');
  parts.push(`<div class="src"><b>Nguồn (${(e.sources || []).length}):</b><ul>${srcs}</ul></div>`);
  if (e.scan_path && existsSync(resolve(ROOT, e.scan_path))) parts.push(`<img class="scan" src="file://${resolve(ROOT, e.scan_path).replace(/\\/g, '/')}" />`);
  return `<section class="entry">${parts.join('\n')}</section>`;
}

function topicHtml(topic, entries) {
  const today = new Date().toISOString().slice(0, 10);
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"/>
<title>${esc(topic.title)} ${topic.zh}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Be+Vietnam+Pro:wght@400;600&display=swap" rel="stylesheet">
<style>
@page { size: A4; margin: 18mm 16mm; }
* { box-sizing: border-box; }
body { font-family: 'Be Vietnam Pro', sans-serif; color: #1a1a1a; line-height: 1.6; font-size: 11pt; }
.zh, .han { font-family: 'Noto Serif SC', serif; }
h1 { font-size: 22pt; border-bottom: 2px solid #9b6a2a; padding-bottom: 6px; }
h1 .zh { color: #9b6a2a; }
h2 { font-size: 14pt; margin: 18px 0 2px; }
h2 .han { font-size: 17pt; color: #7a4a12; font-weight: 700; }
h2 small { color: #555; font-weight: 400; font-size: 10pt; }
.meta { font-size: 9pt; color: #666; margin-bottom: 6px; }
.school { background: #f3e9d2; padding: 1px 6px; border-radius: 8px; }
.cert-high { color: #1a7f4c; } .cert-partial { color: #9b6a2a; } .cert-low { color: #9b2c2c; }
.han-box { background: #f7f1e3; border-left: 3px solid #9b6a2a; padding: 8px 12px; margin: 8px 0; }
.han-box .zh { font-size: 12pt; line-height: 1.9; white-space: pre-wrap; }
.struct { background: #faf6ed; padding: 8px 12px; border-radius: 6px; font-size: 9.5pt; }
.struct div { margin-top: 3px; }
.muted { color: #555; font-size: 9.5pt; }
.src { margin-top: 8px; font-size: 9pt; }
.src ul { margin: 4px 0; padding-left: 18px; }
.src a { color: #9b6a2a; word-break: break-all; }
.entry { page-break-inside: avoid; border-bottom: 1px dashed #ccc; padding-bottom: 14px; margin-bottom: 14px; }
.scan { max-height: 280px; border: 1px solid #ccc; padding: 6px; background: #f4ecd8; }
.ethics { background: #fdf3f3; border: 1px solid #d9a3a3; border-radius: 8px; padding: 10px 14px; font-size: 9pt; color: #5a2a2a; margin: 12px 0; }
.foot { margin-top: 24px; font-size: 8.5pt; color: #888; border-top: 1px solid #ddd; padding-top: 8px; }
</style></head><body>
<h1>${esc(topic.title)} <span class="zh">${topic.zh}</span></h1>
<div class="ethics"><b>⚠ Tham chiếu văn hoá-tôn giáo.</b> ${esc(ETHICS.disclaimerVi)} 符 chỉ mô tả cấu trúc/thị giác; nghi lễ do đạo sĩ <span class="zh">受箓</span> chủ trì.</div>
${entries.map(renderEntry).join('\n')}
<div class="foot">Thư viện Huyền học — corpus verify ≥2 nguồn độc lập · textual_certainty đi kèm mỗi mục · sinh ${today} · nguồn cổ PD (Kanripo/ctext/wikisource) + OCR Grok-4.5.</div>
</body></html>`;
}

function htmlToPdf(htmlPath, pdfPath) {
  if (!EDGE) { console.warn('[pdf] no Edge/Chrome found — leaving HTML only:', htmlPath); return false; }
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/').replace(/^\//, '');
  const args = ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${pdfPath}`, fileUrl];
  const r = spawnSync(EDGE, args, { cwd: ROOT, encoding: 'utf8', timeout: 90000 });
  if (r.status !== 0 || !existsSync(pdfPath)) {
    console.warn(`[pdf] render issue (status=${r.status}). stderr: ${(r.stderr || '').slice(0, 300)}`);
    return false;
  }
  return true;
}

function buildTopic(topic) {
  const entries = LIBRARY.filter((e) => e.layer === topic.layer);
  const html = topicHtml(topic, entries);
  const htmlPath = resolve(OUT, topic.slug + '.html');
  const pdfPath = resolve(OUT, topic.slug + '.pdf');
  writeFileSync(htmlPath, html, 'utf8');
  const ok = htmlToPdf(htmlPath, pdfPath);
  console.log(`[pdf] ${topic.slug}: ${entries.length} entries → ${ok ? 'PDF+HTML' : 'HTML only'} (${ok && existsSync(pdfPath) ? Math.round(statSync(pdfPath).size / 1024) : '?'}KB)`);
  return { topic, n: entries.length, pdf: ok };
}

function buildIndex(results) {
  const today = new Date().toISOString().slice(0, 10);
  const rows = results.map((r) => `<tr><td>${esc(r.topic.title)} <span class="zh">${r.topic.zh}</span></td><td>${r.n}</td><td>${r.topic.slug}.pdf</td></tr>`).join('');
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"/><title>Mục lục Thư viện Huyền học</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600;700&family=Be+Vietnam+Pro:wght@400;600&display=swap" rel="stylesheet">
<style>@page{size:A4;margin:20mm}body{font-family:'Be Vietnam Pro',sans-serif;color:#1a1a1a}.zh{font-family:'Noto Serif SC',serif;color:#9b6a2a}h1{border-bottom:2px solid #9b6a2a;padding-bottom:6px}table{border-collapse:collapse;width:100%;margin-top:14px}td,th{border:1px solid #ccc;padding:8px;text-align:left}th{background:#f3e9d2}.foot{margin-top:30px;font-size:9pt;color:#888}</style></head>
<body><h1>Mục lục <span class="zh">玄學藏書</span> — Thư viện Huyền học</h1>
<p>Sinh ${today}. Mỗi PDF là một chủ đề; mỗi mục ≥2 nguồn độc lập + textual_certainty.</p>
<table><tr><th>Chủ đề</th><th>Số mục</th><th>File</th></tr>${rows}</table>
<div class="foot">Nguồn: Kanripo (CC BY-SA) · ctext · wikisource · OCR Grok-4.5 (scan PD). Tham chiếu văn hoá-tôn giáo, không thay thế y tế/tâm lý.</div>
</body></html>`;
  const htmlPath = resolve(OUT, '00-muc-luc.html');
  const pdfPath = resolve(OUT, '00-muc-luc.pdf');
  writeFileSync(htmlPath, html, 'utf8');
  const ok = htmlToPdf(htmlPath, pdfPath);
  console.log(`[pdf] 00-muc-luc → ${ok ? 'PDF' : 'HTML only'}`);
}

// ---- CLI ----
const args = process.argv.slice(2);
mkdirSync(OUT, { recursive: true });
const todo = args.includes('--all') ? TOPICS : TOPICS.filter((t) => args.includes('--topic') ? args[args.indexOf('--topic') + 1] === t.layer : false);
if (!todo.length && !args.length) { console.log('Usage: node scripts/build-pdfs.mjs --all | --topic <layer>'); process.exit(0); }
const results = todo.map(buildTopic);
if (args.includes('--all')) buildIndex(results);
console.log(`[pdf] done — ${results.filter((r) => r.pdf).length}/${results.length} PDFs rendered.`);
