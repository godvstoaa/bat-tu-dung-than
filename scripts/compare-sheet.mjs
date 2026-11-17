// ============================================================================
//  BẢNG SO SÁNH TRƯỚC / SAU (docs/TIEN-PHU-DOHOA-MANIFEST.md §4): ghép cặp ảnh cùng tên từ hai thư mục thành một ảnh lưới.
//    node scripts/compare-sheet.mjs <trước> <sau> <ra.png> tên1.png tên2.png …
// ============================================================================
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const [A, B, OUT, ...names] = process.argv.slice(2);
const img = (p) => `data:image/png;base64,${readFileSync(p).toString('base64')}`;
const rows = names.map((n) => `<tr><td><img src="${img(`${A}/${n}`)}"></td><td><img src="${img(`${B}/${n}`)}"></td></tr><tr><td colspan=2 class=n>${n}</td></tr>`).join('');
const html = `<html><body style="margin:0;background:#111;color:#ddd;font:14px sans-serif"><table style="border-spacing:6px"><tr><th>TRƯỚC (commit 8bf26924)</th><th>SAU</th></tr>${rows}</table>
<style>img{width:640px;height:360px;object-fit:cover;object-position:center 55%;display:block}.n{text-align:center;color:#999;font-size:12px}th{font-size:18px;color:#f0cf6a}</style></body></html>`;
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1310, height: 400 } })).newPage();
await page.setContent(html); await page.screenshot({ path: OUT, fullPage: true }); await browser.close();
console.log('ok', OUT);
