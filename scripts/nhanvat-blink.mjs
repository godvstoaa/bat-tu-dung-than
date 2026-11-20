// ============================================================================
//  KIỂM CHỚP MẮT TRONG GAME THẬT (docs/NHAN-VAT-MESHY-MANIFEST.md §10): vào game → dựng 8 nhân vật cạnh người chơi
//  (bậc gần) → mỗi người chụp cận mặt ở mí 0 / 0,5 / 1 → output/nhanvat/blink/sheet.jpg (hàng = nhân vật, cột = độ khép)
//  BIEN=1: thêm cột «mở tự nhiên» chụp 30 khung liên tiếp, đếm số khung đang chớp (đo nhịp 2,5–6,5 s)
// ============================================================================
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
const OUT = 'output/nhanvat/blink'; mkdirSync(OUT, { recursive: true });
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
const ids = (process.env.IDS || 'hero_m,hero_f,master,npc_villager,npc_merchant,npc_lao,npc_ba,npc_nu').split(',');
await page.evaluate(async (ids) => {
  const url = (performance.getEntriesByType('resource').map((e) => e.name).find((u) => /\/src\/game\/characters\.js/.test(u)) || '/src/game/characters.js'); const C = await import(url); const TR = await import('/src/game/terrain.js');
  const sc = window.__hq.renderer.scene, hx = window.__nvSpot.x, hz = window.__nvSpot.z, list = [];
  for (let i = 0; i < ids.length; i++) {
    const ch = await C.createCharacter(ids[i]); const a = (i / ids.length) * Math.PI * 2, r = 4;
    const x = hx + Math.cos(a) * r, z = hz + Math.sin(a) * r; ch.obj.position.set(x, TR.heightAt(x, z), z); ch.obj.rotation.y = a; sc.add(ch.obj); list.push(ch);
  }
  window.__nvChars = list; let last = performance.now();
  const tick = () => { if (window.__nvStop) { last = performance.now(); requestAnimationFrame(tick); return; } const now = performance.now(); const dt = (now - last) / 1000; last = now; for (const c of list) c.update(dt); requestAnimationFrame(tick); }; requestAnimationFrame(tick);
}, ids);
await page.waitForTimeout(10000);
const lod = await page.evaluate(() => window.__nvChars.map((c) => c.lodState().near + '/' + c.blinkState()));
// tư thế gốc (bỏ clip): động tác đứng xoay đầu → khung cận mặt lệch
await page.evaluate(() => { window.__nvStop = true; });
// chụp cận mặt bằng camera riêng (cùng cảnh, cùng ánh sáng)
const shot = (i, v) => page.evaluate(async ([i, v]) => {
  const ch = window.__nvChars[i]; ch._blinkSet(v); ch.update(0);
  const R = window.__hq.renderer, gl = R.webgl, T = R.camera.constructor;
  const V3 = R.camera.position.constructor, Q = R.camera.quaternion.constructor, M4 = R.camera.matrixWorld.constructor;
  const head = ch.bone('Head'); ch.obj.updateMatrixWorld(true); const hp = head.getWorldPosition(new V3());
  // hướng mặt: trục «trước» (+z lưới) đổi về khung xương đầu lúc bind, rồi theo xương đầu hiện tại
  let sm = null; ch.obj.traverse((o) => { if (o.isSkinnedMesh && o.visible && o.skeleton.bones.includes(head)) sm = o; });
  const Bh = new M4().copy(sm.skeleton.boneInverses[sm.skeleton.bones.indexOf(head)]).invert(), B = new M4().copy(sm.bindMatrix).multiply(Bh);
  const qB = new Q(); B.decompose(new V3(), qB, new V3()); qB.invert();
  const hq = head.getWorldQuaternion(new Q());
  const fwd = new V3(0, 0, 1).applyQuaternion(qB).applyQuaternion(hq).normalize(), up = new V3(0, 1, 0).applyQuaternion(qB).applyQuaternion(hq).normalize();
  const cam = new T(18, gl.domElement.width / gl.domElement.height, 0.02, 200);
  const at = hp.clone().addScaledVector(up, 0.08); cam.position.copy(at).addScaledVector(fwd, 0.75); cam.up.copy(up); cam.lookAt(at); cam.updateMatrixWorld();
  gl.render(R.scene, cam);
  return gl.domElement.toDataURL('image/jpeg', 0.9);
}, [i, v]);
const tiles = [];
for (let i = 0; i < ids.length; i++) for (const v of [0, 0.5, 1]) {
  const d = await shot(i, v); const buf = Buffer.from(d.split(',')[1], 'base64'); const m = await sharp(buf).metadata();
  tiles.push(await sharp(buf).extract({ left: Math.round(m.width * 0.3), top: Math.round(m.height * 0.3), width: Math.round(m.width * 0.4), height: Math.round(m.height * 0.55) }).resize(300, 231).toBuffer());
}
await sharp({ create: { width: 900, height: 231 * ids.length, channels: 3, background: '#fff' } }).composite(tiles.map((b, k) => ({ input: b, left: (k % 3) * 300, top: Math.floor(k / 3) * 231 }))).jpeg({ quality: 88 }).toFile(`${OUT}/sheet.jpg`);
// nhịp tự nhiên: thả lại, lấy mẫu uBlink 20 s
const rate = await page.evaluate(async () => { window.__nvStop = false; for (const c of window.__nvChars) c._blinkSet(null); const n = window.__nvChars.map(() => 0), prev = window.__nvChars.map(() => 0); const t0 = performance.now();
  await new Promise((res) => { const f = () => { window.__nvChars.forEach((c, i) => { const b = c.blinkState(); if (b > 0.5 && prev[i] <= 0.5) n[i]++; prev[i] = b; }); if (performance.now() - t0 < 20000) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); });
  return n; });
console.log(JSON.stringify({ lod, blinksIn20s: rate, errs: errs.slice(0, 6) }));
await browser.close();
