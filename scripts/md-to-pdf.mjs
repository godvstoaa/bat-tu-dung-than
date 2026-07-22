#!/usr/bin/env node
// md-to-pdf.mjs — minimal Markdown → styled HTML → PDF (Edge/Chrome headless).
// Zero deps. Handles: #/##/### headers, > blockquote, | tables |, -/* ul, 1. ol,
// ``` fenced code, **bold**, `code`, paragraphs. Reused for synthesis/long-form docs.
//
// Usage: node scripts/md-to-pdf.mjs <input.md> <output.pdf>
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((p) => existsSync(p));

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');

function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  const flushList = (type) => { if (type) { out.push(`</${type}>`); } };
  let listType = null;
  let table = [];
  const flushTable = () => {
    if (!table.length) return;
    const rows = table.map((r) => r.split('|').map((c) => c.trim()).filter((c, _i, a) => c !== '' || (_i > 0 && _i < a.length - 1)));
    // simpler: split on | and drop empties at ends
    const clean = table.map((r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
    const [head, ...body] = clean;
    const thead = `<tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr>`;
    const tbody = body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('');
    out.push(`<table><thead>${thead}</thead><tbody>${tbody}</tbody></table>`);
    table = [];
  };
  let inCode = false, codeBuf = [];
  for (const raw of lines) {
    const line = raw;
    if (line.trim().startsWith('```')) { if (inCode) { out.push(`<pre><code>${esc(codeBuf.join('\n'))}</code></pre>`); codeBuf = []; inCode = false; } else { flushList(listType); listType = null; flushTable(); inCode = true; } continue; }
    if (inCode) { codeBuf.push(line); continue; }
    if (/^\s*\|.*\|\s*$/.test(line)) { flushList(listType); listType = null; table.push(line.trim()); continue; }
    if (table.length) flushTable();
    if (!line.trim()) { flushList(listType); listType = null; continue; }
    let m;
    if ((m = line.match(/^###\s+(.*)/))) { flushList(listType); listType = null; out.push(`<h3>${inline(m[1])}</h3>`); continue; }
    if ((m = line.match(/^##\s+(.*)/))) { flushList(listType); listType = null; out.push(`<h2>${inline(m[1])}</h2>`); continue; }
    if ((m = line.match(/^#\s+(.*)/))) { flushList(listType); listType = null; out.push(`<h1>${inline(m[1])}</h1>`); continue; }
    if ((m = line.match(/^>\s?(.*)/))) { flushList(listType); listType = null; out.push(`<blockquote>${inline(m[1])}</blockquote>`); continue; }
    if ((m = line.match(/^[-*]\s+(.*)/))) { if (listType !== 'ul') { flushList(listType); out.push('<ul>'); listType = 'ul'; } out.push(`<li>${inline(m[1])}</li>`); continue; }
    if ((m = line.match(/^\d+\.\s+(.*)/))) { if (listType !== 'ol') { flushList(listType); out.push('<ol>'); listType = 'ol'; } out.push(`<li>${inline(m[1])}</li>`); continue; }
    flushList(listType); listType = null;
    out.push(`<p>${inline(line)}</p>`);
  }
  flushList(listType); flushTable();
  if (inCode) out.push(`<pre><code>${esc(codeBuf.join('\n'))}</code></pre>`);
  return out.join('\n');
}

const [mdPath, pdfPath] = process.argv.slice(2);
if (!mdPath || !pdfPath) { console.log('Usage: node scripts/md-to-pdf.mjs <input.md> <output.pdf>'); process.exit(0); }
const md = readFileSync(resolve(ROOT, mdPath), 'utf8');
const today = new Date().toISOString().slice(0, 10);
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Be+Vietnam+Pro:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page { size: A4; margin: 16mm 14mm; }
body { font-family: 'Be Vietnam Pro', sans-serif; font-size: 10.5pt; line-height: 1.6; color: #1a1a1a; }
h1 { font-size: 19pt; color: #7a4a12; border-bottom: 2px solid #9b6a2a; padding-bottom: 5px; }
h2 { font-size: 14pt; color: #9b6a2a; margin-top: 18px; border-left: 4px solid #c9a86a; padding-left: 8px; }
h3 { font-size: 12pt; color: #6b4a1a; margin-top: 12px; }
.zh, code { font-family: 'Noto Serif SC', monospace; }
blockquote { border-left: 3px solid #c9a86a; background: #faf6ed; margin: 8px 0; padding: 6px 12px; color: #555; font-size: 10pt; }
table { border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 9.5pt; }
th, td { border: 1px solid #c9b89a; padding: 5px 7px; text-align: left; vertical-align: top; }
th { background: #f3e9d2; }
code { background: #f4f0e6; padding: 1px 4px; border-radius: 3px; font-size: 9.5pt; }
pre { background: #f4f0e6; padding: 8px 12px; border-radius: 5px; overflow-x: auto; font-size: 9pt; }
pre code { background: none; padding: 0; }
.foot { margin-top: 26px; font-size: 8.5pt; color: #888; border-top: 1px solid #ddd; padding-top: 8px; }
</style></head><body>
${mdToHtml(md)}
<div class="foot">Tổng hợp Huyền Học Trung Hoa — Bát Tự app · tham chiếu văn hoá-tôn giáo/học thuật (≥2 nguồn/entry) · sinh ${today}</div>
</body></html>`;
const htmlPath = resolve(ROOT, dirname(pdfPath), (pdfPath.split(/[/\\]/).pop()).replace(/\.pdf$/, '.html'));
writeFileSync(htmlPath, html, 'utf8');
if (!EDGE) { console.warn('[md2pdf] no Edge — HTML only:', htmlPath); process.exit(0); }
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/').replace(/^\//, '');
const r = spawnSync(EDGE, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${resolve(ROOT, pdfPath)}`, fileUrl], { cwd: ROOT, encoding: 'utf8', timeout: 90000 });
const ok = r.status === 0 && existsSync(resolve(ROOT, pdfPath));
console.log(`[md2pdf] ${pdfPath}: ${ok ? 'PDF+HTML (' + Math.round(statSync(resolve(ROOT, pdfPath)).size / 1024) + 'KB)' : 'FAIL'}${r.status !== 0 ? ' stderr=' + (r.stderr || '').slice(0, 200) : ''}`);
