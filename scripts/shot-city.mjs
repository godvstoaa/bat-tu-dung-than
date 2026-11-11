// ============================================================================
//  CHỤP ẢNH KIỂM THÀNH (Playwright, Chromium thật): vào game ở sân Sơn Môn rồi dịch chuyển tới các điểm (x,z),
//  chụp ảnh từng chỗ + ảnh từ trên cao. Ghi lỗi trang / tài nguyên lỗi.
//    node scripts/shot-city.mjs [url] [outDir]       mặc định http://localhost:5180/game.html  ./shots
// ============================================================================
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL_ = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:5180/game.html';
const OUT = process.argv.slice(2).find((a) => !a.startsWith('http')) || 'shots';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errs = [], tiers = [];
page.on('response', (r) => { const u = r.url(); if (/\.(lod1|mid)\.glb/.test(u)) tiers.push(u.split('/').pop()); });
page.on('pageerror', (e) => errs.push('pageerror: ' + e.message.slice(0, 300)));
page.on('response', (r) => { if (r.status() >= 400) errs.push(`${r.status()} ${r.url().slice(0, 160)}`); });
page.on('console', (m) => { if ((m.type() === 'error' && !/Failed to load resource|WebSocket/.test(m.text())) || /[city]|lod/i.test(m.text())) errs.push('console: ' + m.text().slice(0, 300)); });
await page.goto(URL_, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#hq-gate button', { timeout: 30000 });
if (await page.$('#hq-gate input[name=date]')) {
  const vis = await page.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false);
  if (vis) { await page.fill('#hq-gate input[name=date]', '1994-05-12'); await page.click('#hq-gate button[type=submit]'); }
}
const go = page.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ });
await go.first().waitFor({ timeout: 30000 });
await go.first().click();
await page.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 120000 });
await page.waitForTimeout(3000);
await page.evaluate(() => document.querySelectorAll('.hq-tut, .hq-digest, .hq-toast').forEach((e) => e.remove()));
await page.screenshot({ path: `${OUT}/00-start.png` });
// điểm chụp: (x, z) mét thế giới — dịch chuyển bằng api.travel (màn chuyển cảnh) rồi chờ dựng
const SPOTS = JSON.parse(process.env.SPOTS || '[]');
for (const [i, s] of SPOTS.entries()) {
  await page.evaluate(([x, z]) => window.__hq?.api?.travel?.(x, z, 'chụp ảnh'), [s.x, s.z]);
  await page.waitForTimeout(s.wait || 9000);
  if (s.place) await page.evaluate(async ([id, x, z]) => { const A = await import('/src/game/assets.js'); const sc = window.__hq.renderer.scene; for (const [k, v] of [['', -8], ['.lod1', 8], ['.lod2', 24]]) await A.placeModel(sc, id + k, { fit: { width: 12 }, at: { x: x + v, y: 0, z: z - 18, ry: 0 } }); }, [s.place, s.x, s.z]), await page.waitForTimeout(4000);
  if (s.inst) await page.evaluate(async ([id, x, z]) => { const A = await import('/src/game/assets.js'), C = await import('/src/game/cityblocks3d.js'); const sc = window.__hq.renderer.scene; const ids = id.split(','); let k = 0; for (const mid of ids) { const g = await A.loadModel(mid); const set = C.instancedSet(g, [{ x: x - 24 + k * 16, y: 0, z: z - 18, ry: k % 2 ? 1.57 : 0, f: 12.9, lotF: 12.9, d: 16, id: mid.split('.')[0], ys: 1, tint: [1, 0.86, 0.82] }], { shadow: k < 2, flat: k >= 2 }); for (const m of set.meshes) sc.add(m.im); set.write([0]); k++; } }, [s.inst, s.x, s.z]), await page.waitForTimeout(3000);
  if (s.zoom) { await page.mouse.move(640, 360); for (let k = 0; k < s.zoom; k++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(80); } await page.waitForTimeout(2500); }
  await page.evaluate(() => document.querySelectorAll('.hq-tut, .hq-digest, .hq-toast, .hq-panel').forEach((e) => { if (e.classList.contains('hq-panel')) e.hidden = true; else e.remove(); }));
  if (s.stats) { const fps = await page.evaluate(() => new Promise((r) => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else r(Math.round(n / 3)); }; requestAnimationFrame(f); })); console.log(s.name, 'fps', fps, JSON.stringify(await page.evaluate(() => window.__hq?.renderer?.frameStats?.() || null))); }
  if (s.eval) { await page.evaluate(s.eval); await page.waitForTimeout(2500); }
  if (s.debug) console.log(await page.evaluate(async ([hx, hz]) => { const THREE = await import('/node_modules/.vite/deps/three.js'); const out = []; const v = new THREE.Vector3(), m = new THREE.Matrix4(); window.__hq.renderer.scene.traverse((o) => { if (!o.isInstancedMesh || !o.visible || !o.count) return; o.geometry.computeBoundingBox(); const c = o.geometry.boundingBox.getCenter(new THREE.Vector3()); for (let k = 0; k < o.count; k++) { m.fromArray(o.instanceMatrix.array, k * 16); v.copy(c).applyMatrix4(m); if (Math.hypot(v.x - hx, v.z - hz) < 6) out.push(`${o.name || o.geometry.uuid.slice(0, 6)} k${k}/${o.count} @${v.x.toFixed(1)},${v.z.toFixed(1)} sh=${o.castShadow}`); } }); return out.join(' | '); }, [s.hx, s.hz]));
  await page.screenshot({ path: `${OUT}/${String(i + 1).padStart(2, '0')}-${s.name || 'spot'}.png`, ...(s.clip ? { clip: s.clip } : {}) });
}
console.log('bậc chi tiết đã nạp:', tiers.length, tiers.slice(-12).join(' '));
console.log(errs.length ? errs.slice(0, 40).join('\n') : 'không có lỗi');
await browser.close();
