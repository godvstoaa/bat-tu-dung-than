// Ghép ảnh (png/jpg) có nhãn: node scripts/img-montage.mjs <thư-mục> <regex> <ra.png> [cột]
import { chromium } from 'playwright';
import { readFileSync, readdirSync } from 'node:fs';
const [dir, pat, out, cols = '5'] = process.argv.slice(2);
const files = readdirSync(dir).filter((f) => new RegExp(pat).test(f)).sort();
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1900, height: 1000 } });
const w = Math.floor(1900 / +cols) - 6;
await p.setContent(`<body style="margin:0;background:#222;color:#eee;font:14px sans-serif;display:flex;flex-wrap:wrap;gap:6px">${files.map((f) => `<div style="width:${w}px"><img src="data:image/${f.endsWith('png') ? 'png' : 'jpeg'};base64,${readFileSync(dir + '/' + f).toString('base64')}" style="width:100%"><div>${f}</div></div>`).join('')}</body>`);
await p.waitForTimeout(300); await p.screenshot({ path: out, fullPage: true }); await b.close(); console.log(files.length);
