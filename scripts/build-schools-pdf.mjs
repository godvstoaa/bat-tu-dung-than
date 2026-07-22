#!/usr/bin/env node
// build-schools-pdf.mjs — render the school comparison matrix (data-driven from
// schools-data.js) → HTML → PDF (Edge/Chrome headless). Zero deps.
// Output: public/downloads/08-doi-chieu-truong-phai.pdf
import { SCHOOLS, COMPARE_DIMS, compareMatrix } from '../src/engine/schools-data.js';
import { writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
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
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const matrix = compareMatrix();
const headRow = `<tr><th class="dim-h">Chiều \\ Phái</th>` + SCHOOLS.map((s) => `<th><span class="zh">${esc(s.zh)}</span><span class="vi">${esc(s.vi)}</span></th>`).join('') + `</tr>`;
const bodyRows = matrix.map((r) => `<tr><th class="dim">${esc(r.dim.vi)}</th>` + r.cells.map((c) => `<td>${esc(c.value)}</td>`).join('') + `</tr>`).join('');

// Per-school detail cards (collapsible in print = always open)
const profiles = SCHOOLS.map((s) => `
<div class="profile">
<h3><span class="zh">${esc(s.zh)}</span> ${esc(s.vi)}</h3>
<div class="dist"><b>Đặc trưng:</b> ${esc(s.distinctive)}</div>
<div class="src"><b>Nguồn (${(s.sources || []).length}):</b><ul>${(s.sources || []).map((u) => { const m = u.match(/^(https?:\/\/\S+)/); return `<li>${m ? `<a href="${m[1]}">${esc(u)}</a>` : esc(u)}</li>`; }).join('')}</ul></div>
</div>`).join('');

const today = new Date().toISOString().slice(0, 10);
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"/>
<title>Đối chiếu Trường phái Đạo giáo</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Be+Vietnam+Pro:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page { size: A3 landscape; margin: 14mm; }
body { font-family: 'Be Vietnam Pro', sans-serif; font-size: 8.5pt; color: #1a1a1a; }
h1 { font-size: 18pt; color: #7a4a12; border-bottom: 2px solid #9b6a2a; padding-bottom: 5px; }
.zh { font-family: 'Noto Serif SC', serif; }
table { border-collapse: collapse; width: 100%; margin-top: 10px; }
th, td { border: 1px solid #c9b89a; padding: 5px 6px; vertical-align: top; text-align: left; line-height: 1.4; }
thead th { background: #f3e9d2; }
th .zh { font-size: 11pt; font-weight: 700; color: #7a4a12; display: block; }
th .vi { font-size: 7.5pt; font-weight: 400; color: #555; display: block; }
.dim, .dim-h { background: #f7f1e3; font-weight: 600; white-space: nowrap; color: #6b4a1a; }
.profile { page-break-inside: avoid; border: 1px solid #c9b89a; border-radius: 6px; padding: 8px 12px; margin: 10px 0; background: #fcfaf5; }
.profile h3 { margin: 0 0 4px; font-size: 12pt; }
.profile .zh { color: #7a4a12; font-size: 13pt; }
.profile .dist { font-size: 9pt; margin: 4px 0; }
.profile .src ul { margin: 4px 0; padding-left: 16px; font-size: 8pt; }
.profile .src a { color: #9b6a2a; word-break: break-all; }
.ethics { background: #fdf3f3; border: 1px solid #d9a3a3; border-radius: 6px; padding: 8px 12px; font-size: 8.5pt; color: #5a2a2a; margin: 10px 0; }
.foot { margin-top: 18px; font-size: 8pt; color: #888; border-top: 1px solid #ddd; padding-top: 6px; }
h2 { color: #9b6a2a; margin-top: 22px; border-left: 4px solid #c9a86a; padding-left: 8px; }
</style></head><body>
<h1>Đối chiếu Trường phái <span class="zh">諸派對照</span></h1>
<div class="ethics"><b>Tham chiếu văn hoá-tôn giáo/học thuật.</b> Không phái nào «đúng nhất» — đây là đối chiếu đặc trưng để dễ phân biệt; ghi nhận biến thể khu vực/trường phái. Mỗi phái ≥2 nguồn độc lập.</div>
<h2>Ma trận đối chiếu (${SCHOOLS.length} phái × ${COMPARE_DIMS.length} chiều)</h2>
<table><thead>${headRow}</thead><tbody>${bodyRows}</tbody></table>
<h2>Hồ sơ từng phái</h2>
${profiles}
<div class="foot">Đối chiếu ${SCHOOLS.length} trường phái Đạo giáo / phương sĩ · sinh ${today} · data: src/engine/schools-data.js · ≥2 nguồn/phái.</div>
</body></html>`;

mkdirSync(OUT, { recursive: true });
const htmlPath = resolve(OUT, '08-doi-chieu-truong-phai.html');
const pdfPath = resolve(OUT, '08-doi-chieu-truong-phai.pdf');
writeFileSync(htmlPath, html, 'utf8');
let ok = false;
if (EDGE) {
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/').replace(/^\//, '');
  const r = spawnSync(EDGE, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${pdfPath}`, fileUrl], { cwd: ROOT, encoding: 'utf8', timeout: 90000 });
  ok = r.status === 0 && existsSync(pdfPath);
  if (!ok) console.warn('[schools-pdf] render issue:', (r.stderr || '').slice(0, 200));
} else console.warn('[schools-pdf] no Edge/Chrome — HTML only');
console.log(`[schools-pdf] 08-doi-chieu-truong-phai: ${ok ? 'PDF+HTML (' + Math.round(statSync(pdfPath).size / 1024) + 'KB)' : 'HTML only'}`);
