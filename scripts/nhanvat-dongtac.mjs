// ============================================================================
//  KIỂM ĐA DẠNG ĐỘNG TÁC TRONG GAME (manifest §11): 12 người đứng quanh người chơi, chờ <id>.anim.glb tải xong,
//  lấy mẫu clip đang chạy mỗi 0,5 s trong 90 s → số clip khác nhau, số cặp CÙNG clip CÙNG pha (lệch < 0,3 s), số lần cử chỉ.
//  Ảnh: output/nhanvat/dongtac/*.png
// ============================================================================
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
const OUT = 'output/nhanvat/dongtac'; mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
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
const ids = ['npc_villager', 'npc_merchant', 'npc_lao', 'npc_ba', 'npc_nu', 'master', 'npc_lao', 'npc_nu', 'npc_villager', 'npc_merchant', 'npc_ba', 'hero_f'];
await page.evaluate(() => document.querySelectorAll('.hq-tut, .hq-digest, .hq-toast, .hq-panel').forEach((e) => { if (e.classList.contains('hq-panel')) e.hidden = true; else e.remove(); }));
await page.evaluate(async (ids) => {
  const url = (performance.getEntriesByType('resource').map((e) => e.name).find((u) => /\/src\/game\/characters\.js/.test(u)) || '/src/game/characters.js'); const C = await import(url); const TR = await import('/src/game/terrain.js');
  C.enableHd?.();
  const R = window.__hq.renderer, sc = R.scene, list = [];
  const cam = R.camera, f = new cam.position.constructor(); cam.getWorldDirection(f); f.y = 0; f.normalize(); const side = new cam.position.constructor(-f.z, 0, f.x);
  for (let i = 0; i < ids.length; i++) {
    const ch = await C.createCharacter(ids[i]); const row = Math.floor(i / 6), col = i % 6;
    const p = cam.position.clone().addScaledVector(f, 6 + row * 2.2).addScaledVector(side, (col - 2.5) * 1.3);
    ch.obj.position.set(p.x, TR.heightAt(p.x, p.z), p.z); ch.obj.rotation.y = Math.atan2(-f.x, -f.z); sc.add(ch.obj); list.push(ch);
  }
  window.__nvChars = list; let last = performance.now();
  const tick = () => { const now = performance.now(); const dt = (now - last) / 1000; last = now; for (const c of list) c.update(dt); requestAnimationFrame(tick); }; requestAnimationFrame(tick);
}, ids);
await page.waitForTimeout(12000);
const nAct = await page.evaluate(() => window.__nvChars.map((c) => c.id + ':' + Object.keys(c.actions).length));
await page.screenshot({ path: `${OUT}/1.png` });
const stat = await page.evaluate(() => new Promise((res) => {
  const L = window.__nvChars, used = {}, gest = {}; let sync = 0, samples = 0, sameClip = 0, prev = L.map(() => null), run = {}, longSync = 0;
  const G = new Set(['bow', 'wave', 'hello', 'pick', 'agree', 'scratch', 'hip', 'listen', 'shrug', 'pickup', 'rub']);
  const t0 = performance.now();
  const iv = setInterval(() => {
    const now = L.map((c) => c.clipNow());
    now.forEach((x, i) => { if (!x) return; used[x[0]] = (used[x[0]] || 0) + 1; if (G.has(x[0]) && prev[i]?.[0] !== x[0]) gest[x[0]] = (gest[x[0]] || 0) + 1; });
    for (let i = 0; i < now.length; i++) for (let j = i + 1; j < now.length; j++) { if (!now[i] || !now[j] || now[i][0] !== now[j][0]) continue; sameClip++; if (Math.abs(now[i][1] - now[j][1]) < 0.3) { sync++; const k = i + '-' + j; run[k] = (run[k] || 0) + 1; if (run[k] === 3) longSync++; } }
    for (const k in run) { const [i, j] = k.split('-').map(Number); if (!now[i] || !now[j] || now[i][0] !== now[j][0] || Math.abs(now[i][1] - now[j][1]) >= 0.3) delete run[k]; }
    samples++; prev = now;
    if (performance.now() - t0 > 90000) { clearInterval(iv); res({ samples, distinct: Object.keys(used).length, used, gest, sameClipPairsPerSample: +(sameClip / samples).toFixed(2), syncPairsPerSample: +(sync / samples).toFixed(3), syncRuns15s: longSync }); }
  }, 500);
}));
await page.screenshot({ path: `${OUT}/2.png` });
console.log(JSON.stringify({ nAct, ...stat, errs: errs.filter((e) => !/500|WebSocket/.test(e)).slice(0, 5) }, null, 1));
await browser.close();
