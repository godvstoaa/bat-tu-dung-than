// ============================================================================
//  ẢNH NHÌN THẲNG TỪ TRÊN CAO của tiên phủ đã dựng (Bắc cục bộ ở trên, như tổng mặt bằng) — đối chiếu bản vẽ
//  (docs/TIEN-PHU-MATBANG-MANIFEST.md §4). Ghép cạnh 00-tong-mat-bang.svg thành output/tienphu-matbang/so-sanh-<id>.png
//    node scripts/shot-tienphu-aerial.mjs [url]   ·   H=283,…   ·   ALT=620 (độ cao camera, m)
// ============================================================================
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const URL_ = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:5180/game.html';
const HS = (process.env.H || '283,284,285,286,287,288,289,290,291').split(',').map(Number), ALT = Number(process.env.ALT || 620), OUT = 'output/tienphu-matbang';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1100, height: 1100 } })).newPage();
const errs = []; page.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
await page.goto(URL_, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#hq-gate button', { timeout: 120000 });
if (await page.$('#hq-gate input[name=date]')) { const vis = await page.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false); if (vis) { await page.fill('#hq-gate input[name=date]', '1994-05-12'); await page.click('#hq-gate button[type=submit]'); } }
const go = page.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ }); await go.first().waitFor({ timeout: 30000 }); await go.first().click();
await page.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 180000 });
await page.evaluate(() => window.__hq.renderer.setDebugHour?.(11));
for (const h of HS) {
  const v = await page.evaluate(async ([h, ALT]) => { const M = await import('/src/game/mansions.js'); const m = M.estateByH(h); const c = m.toWorld(0, 0), e = m.toWorld(0, 1.5); return { id: m.tp.st.id, n: m.tp.i + 1, c, pos: [e.x, ALT, e.z], look: [c.x, 0, c.z] }; }, [h, ALT]);
  await page.evaluate(([x, z]) => window.__hq.api.travel(x, z, 'chụp'), [v.c.x, v.c.z]);
  await page.waitForFunction((h) => { const r = window.__hq.renderer?.mansions?.builtRec?.(h); return r && r.g && !r.job && r.vox && !r.vox.job; }, h, { timeout: 150000, polling: 500 }).catch(() => {});
  await page.evaluate((c) => window.__hq.renderer.setDebugCam(c), { pos: v.pos, look: v.look });
  await page.waitForTimeout(5000);
  await page.evaluate(() => document.querySelectorAll('.hq-tut, .hq-digest, .hq-toast, .hq-label, .hq-bubble').forEach((e) => e.remove()));
  const shot = `${OUT}/aerial-${String(v.n).padStart(2, '0')}-${v.id}.png`;
  await page.screenshot({ path: shot });
  // ghép với tổng mặt bằng (cắt phần bản vẽ, bỏ chú giải)
  const svgPath = `docs/tienphu-banve/${String(v.n).padStart(2, '0')}-${v.id}/00-tong-mat-bang.svg`;
  if (existsSync(svgPath)) {
    const p2 = await browser.newPage({ viewport: { width: 2260, height: 1180 } });
    const img = (p) => `data:image/png;base64,${readFileSync(p).toString('base64')}`;
    const svg = `data:image/svg+xml;base64,${readFileSync(svgPath).toString('base64')}`;
    await p2.setContent(`<body style='margin:0;background:#222;color:#eee;font:16px sans-serif;display:flex;gap:10px'><div><div style='padding:6px'>BẢN VẼ — tổng mặt bằng</div><div style='width:1100px;height:1100px;overflow:hidden'><img src='${svg}' style='margin:-90px 0 0 -70px;width:1910px'></div></div><div><div style='padding:6px'>ĐÃ DỰNG — nhìn thẳng từ trên cao ${ALT} m (Bắc ở trên)</div><img src='${img(shot)}' width='1100'></div></body>`);
    await p2.waitForTimeout(400); await p2.screenshot({ path: `${OUT}/so-sanh-${String(v.n).padStart(2, '0')}-${v.id}.png` }); await p2.close();
  }
  console.log(h, v.id, 'xong');
}
await page.evaluate(() => window.__hq.renderer.setDebugCam(null));
console.log(errs.length ? 'LỖI: ' + [...new Set(errs)].slice(0, 6).join(' | ') : 'không lỗi trang');
await browser.close();
