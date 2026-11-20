// ============================================================================
//  ẢNH ÁNH SÁNG NHÂN VẬT (manifest §10): 8 nhân vật xếp hàng trước camera, chụp 10 giờ và 21 giờ.
//  node scripts/nhanvat-light.mjs <nhãn>   (EMIS=1: giữ emissive Meshy như trước khi sửa) → output/nhanvat/light/<nhãn>-<giờ>.jpg
// ============================================================================
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
const OUT = 'output/nhanvat/light', TAG = process.argv[2] || 'run'; mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
if (process.env.EMIS) await page.addInitScript(() => { globalThis.__charEmissive = true; });
const errs = []; page.on('pageerror', (e) => errs.push(e.message.slice(0, 300)));
page.on('console', (m) => { if (m.type() === 'error' || /characters|shader|program/i.test(m.text())) errs.push('console: ' + m.text().slice(0, 300)); });
await page.goto('http://localhost:5180/game.html', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#hq-gate button', { timeout: 60000 });
if (await page.$('#hq-gate input[name=date]')) { const vis = await page.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false); if (vis) { await page.fill('#hq-gate input[name=date]', '1994-05-12'); await page.click('#hq-gate button[type=submit]'); } }
const go = page.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ }); await go.first().waitFor({ timeout: 30000 }); await go.first().click();
await page.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 180000 });
await page.waitForTimeout(3000);
const spot = await page.evaluate(async () => { const C = await import('/src/game/city4.js'); const w = C.walkers4(); const p = w[0].path?.[0] || w[0]; window.__nvSpot = { x: p.x, z: p.z }; return { x: p.x, z: p.z }; });
await page.evaluate(([x, z]) => window.__hq.api.travel(x, z, 'đo'), [spot.x, spot.z]);
await page.evaluate(() => { window.__hq?.renderer?.setDebugHour?.(10); window.__hq?.api?.setDebugHour?.(10); });
await page.waitForTimeout(12000);
const ids = ['hero_m', 'hero_f', 'master', 'npc_villager', 'npc_merchant', 'npc_lao', 'npc_ba', 'npc_nu'];
await page.evaluate(async (ids) => {
  const url = (performance.getEntriesByType('resource').map((e) => e.name).find((u) => /\/src\/game\/characters\.js/.test(u)) || '/src/game/characters.js'); const C = await import(url); const TR = await import('/src/game/terrain.js');
  const R = window.__hq.renderer, sc = R.scene, list = [];
  const cam = R.camera, f = new cam.position.constructor(); cam.getWorldDirection(f); f.y = 0; f.normalize(); const side = new cam.position.constructor(-f.z, 0, f.x);
  const base = cam.position.clone().addScaledVector(f, 7);
  for (let i = 0; i < ids.length; i++) {
    const ch = await C.createCharacter(ids[i]); const p = base.clone().addScaledVector(side, (i - 3.5) * 0.95);
    ch.obj.position.set(p.x, TR.heightAt(p.x, p.z), p.z); ch.obj.rotation.y = Math.atan2(-f.x, -f.z); sc.add(ch.obj); list.push(ch);
  }
  window.__nvChars = list; let last = performance.now();
  const tick = () => { const now = performance.now(); const dt = (now - last) / 1000; last = now; for (const c of list) c.update(dt); requestAnimationFrame(tick); }; requestAnimationFrame(tick);
}, ids);
await page.evaluate(() => document.querySelectorAll('.hq-tut, .hq-digest, .hq-toast, .hq-panel').forEach((e) => { if (e.classList.contains('hq-panel')) e.hidden = true; else e.remove(); }));
for (const h of [10, 21]) {
  await page.evaluate((h) => { window.__hq?.renderer?.setDebugHour?.(h); window.__hq?.api?.setDebugHour?.(h); }, h);
  await page.waitForTimeout(6000);
  await page.screenshot({ path: `${OUT}/${TAG}-${h}h.jpg`, quality: 88, clip: { x: 140, y: 120, width: 1000, height: 480 } });
}
console.log(JSON.stringify({ tag: TAG, errs: errs.filter((e) => !/500|WebSocket/.test(e)).slice(0, 6) }));
await browser.close();
