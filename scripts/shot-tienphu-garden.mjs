// ============================================================================
//  ẢNH CẬN VƯỜN + SẢNH TIÊN PHỦ (docs/TIEN-PHU-DOHOA-MANIFEST.md §4): cây gần, cây hoa, hoa viền lối, đèn, đá; trong sảnh chính.
//  Giờ khoá 10:00 (HOUR) để ảnh trước / sau cùng ánh sáng.   node scripts/shot-tienphu-garden.mjs [url] [outDir]   ·   H=283,…
// ============================================================================
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const URL_ = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:5180/game.html';
const OUT = process.argv.slice(2).find((a) => !a.startsWith('http')) || 'output/tienphu-dohoa/after';
mkdirSync(OUT, { recursive: true });
const HS = (process.env.H || '283').split(',').map(Number);
const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errs = []; page.on('pageerror', (e) => errs.push('pageerror: ' + e.message.slice(0, 200))); page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|WebSocket/.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
await page.goto(URL_, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#hq-gate button', { timeout: 120000 });
if (await page.$('#hq-gate input[name=date]')) { const vis = await page.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false); if (vis) { await page.fill('#hq-gate input[name=date]', '1994-05-12'); await page.click('#hq-gate button[type=submit]'); } }
const go = page.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ }); await go.first().waitFor({ timeout: 30000 }); await go.first().click();
await page.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 180000 });
await page.evaluate((h) => window.__hq.renderer.setDebugHour?.(h), Number(process.env.HOUR || 10));
const clean = () => page.evaluate(() => document.querySelectorAll('.hq-tut, .hq-digest, .hq-toast').forEach((e) => e.remove()));
for (const h of HS) {
  const v = await page.evaluate(async (h) => {
    const M = await import('/src/game/mansions.js'); const m = M.estateByH(h), P = m.tp, main = P.buildings[0];
    const W = (x, z) => m.toWorld(x, z);
    // cụm cây dày nhất trong vườn sau (z < −60): ô 30 m nhiều cây nhất
    const cnt = new Map(); for (const t of P.trees) if (t.z < -60 && t.kind !== 'bamboo') { const k = `${Math.round(t.x / 30)},${Math.round(t.z / 30)}`; cnt.set(k, (cnt.get(k) || 0) + 1); }
    const [best] = [...cnt.entries()].sort((a, b) => b[1] - a[1]); const [gx, gz] = best[0].split(',').map((n) => Number(n) * 30);
    const ge = W(gx + 14, gz + 18), gt = W(gx, gz), pe = W(-40, 120), pt = W(-130, 85);
    const he = W(main.x + main.w * 0.32, main.z + main.d * 0.3), ht = W(main.x - main.w * 0.1, main.z - main.d * 0.25), hp = W(main.x, main.z + main.d / 2 - 2);
    return { walk: W(gx + 14, gz + 18), cams: { garden: { pos: [ge.x, 6, ge.z], look: [gt.x, 2.5, gt.z] }, court: { pos: [pe.x, 9, pe.z], look: [pt.x, 2, pt.z] }, hall: { pos: [he.x, (main.plinth || 0) + 4.2, he.z], look: [ht.x, (main.plinth || 0) + 0.8, ht.z] } }, hallAt: hp, id: m.tp.st.id };
  }, h);
  await page.evaluate(([x, z]) => window.__hq.api.travel(x, z, 'chụp'), [v.walk.x, v.walk.z]);
  await page.waitForFunction((h) => { const r = window.__hq.renderer?.mansions?.builtRec?.(h); return r && r.g && !r.job && r.vox && !r.vox.job; }, h, { timeout: 150000, polling: 500 }).catch(() => {});
  await page.waitForTimeout(4000);
  for (const [nm, c] of Object.entries(v.cams)) {
    if (nm === 'hall') { await page.evaluate(([x, z]) => window.__hq.api.travel(x, z, 'chụp'), [v.hallAt.x, v.hallAt.z]); await page.waitForTimeout(3500); }
    await page.evaluate((c) => window.__hq.renderer.setDebugCam(c), c); await page.waitForTimeout(2500); await clean();
    await page.screenshot({ path: `${OUT}/${h}-${v.id}-3-${nm}.png` });
  }
  await page.evaluate(() => window.__hq.renderer.setDebugCam(null));
  console.log(h, v.id, 'xong');
}
console.log(errs.length ? 'LỖI: ' + [...new Set(errs)].slice(0, 8).join(' | ') : 'không lỗi trang');
await browser.close();
