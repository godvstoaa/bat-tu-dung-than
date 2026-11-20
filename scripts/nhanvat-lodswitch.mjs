// ============================================================================
//  KIỂM ĐỔI BẬC LOD (manifest §10): 8 nhân vật xếp hàng trước camera, lùi 10 → 22 m rồi tiến lại 22 → 10 m (bước 0,2 m).
//  Mỗi bước ghi bậc đang hiện + số lưới đang vẽ (phải đúng MỘT bậc, không trống, không chồng); số lần đổi bậc mỗi chiều;
//  ảnh ngay trước / sau lúc đổi bậc → độ chênh điểm ảnh (output/nhanvat/lodswitch/)
// ============================================================================
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
const OUT = 'output/nhanvat/lodswitch'; mkdirSync(OUT, { recursive: true });
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
const ids = ['hero_m', 'hero_f', 'master', 'npc_villager', 'npc_merchant', 'npc_lao', 'npc_ba', 'npc_nu'];
await page.evaluate(() => document.querySelectorAll('.hq-tut, .hq-digest, .hq-toast, .hq-panel').forEach((e) => { if (e.classList.contains('hq-panel')) e.hidden = true; else e.remove(); }));
await page.evaluate(async (ids) => {
  const url = (performance.getEntriesByType('resource').map((e) => e.name).find((u) => /\/src\/game\/characters\.js/.test(u)) || '/src/game/characters.js'); const C = await import(url); const TR = await import('/src/game/terrain.js');
  const R = window.__hq.renderer, sc = R.scene, list = [];
  const cam = R.camera, f = new cam.position.constructor(); cam.getWorldDirection(f); f.y = 0; f.normalize(); const side = new cam.position.constructor(-f.z, 0, f.x);
  for (let i = 0; i < ids.length; i++) { const ch = await C.createCharacter(ids[i]); ch.obj.rotation.y = Math.atan2(-f.x, -f.z); sc.add(ch.obj); list.push(ch); }
  // đặt hàng người cách camera d (m, đo phẳng) — dàn ngang theo góc nhìn để ai cũng trong khung
  window.__nvPlace = (d) => { list.forEach((ch, i) => { const p = cam.position.clone().addScaledVector(f, d).addScaledVector(side, (i - 3.5) * d * 0.075); ch.obj.position.set(p.x, TR.heightAt(p.x, p.z), p.z); }); };
  window.__nvPlace(10);
  window.__nvChars = list; let last = performance.now();
  const tick = () => { const now = performance.now(); const dt = (now - last) / 1000; last = now; for (const c of list) c.update(dt); requestAnimationFrame(tick); }; requestAnimationFrame(tick);
}, ids);
await page.waitForTimeout(8000);
const step = (d) => page.evaluate((d) => new Promise((res) => { window.__nvPlace(d); requestAnimationFrame(() => requestAnimationFrame(() => {
  const R = window.__hq.renderer, out = window.__nvChars.map((ch) => { let v = 0, n = 0; ch.obj.traverse((o) => { if (o.isSkinnedMesh) { n++; if (o.visible) v++; } });
    const w = ch.obj.getWorldPosition(R.camera.position.clone()); return { near: ch.lodState().near, ready: ch.lodState().nearState, v, n, d: +w.distanceTo(R.camera.position).toFixed(2) }; });
  res(out); })); }), d);
const ds = []; for (let d = 10; d <= 22.001; d += 0.2) ds.push(+d.toFixed(1)); const path = [...ds, ...ds.slice().reverse().slice(1)];
const log = []; let bad = 0; const flips = ids.map(() => ({ out: [], in: [] })); let prev = null;
for (let k = 0; k < path.length; k++) {
  const r = await step(path[k]); log.push(r);
  r.forEach((c, i) => { if (c.v === 0 || (c.n > 1 && c.v === c.n)) bad++; if (prev && prev[i].near !== c.near) (c.near ? flips[i].in : flips[i].out).push(c.d); });
  prev = r;
}
// ảnh sát ngưỡng: chiều lùi (đổi xa ở > 18 m) và chiều tiến (đổi gần ở < 15 m)
const snap = async (d, name) => { await step(d); await page.waitForTimeout(400); await step(d); return page.screenshot({ path: `${OUT}/${name}.png`, clip: { x: 240, y: 160, width: 800, height: 420 } }); };
const diff = async (a, b) => { const A = await sharp(a).raw().toBuffer(), B = await sharp(b).raw().toBuffer(); let s = 0, big = 0; for (let i = 0; i < A.length; i++) { const e = Math.abs(A[i] - B[i]); s += e; if (e > 40) big++; } return { meanAbs: +(s / A.length).toFixed(2), px40: big }; };
await step(12); for (let d = 12; d <= 17.8; d += 0.4) await step(d);
const o1 = await snap(17.8, 'lui-17.8-gan'), o2 = await snap(18.4, 'lui-18.4-xa');
for (let d = 22; d >= 15.4; d -= 0.4) await step(d);
const i1 = await snap(15.4, 'tien-15.4-xa'), i2 = await snap(14.8, 'tien-14.8-gan');
// đối chứng: hai ảnh cùng bậc cách 0,6 m (độ chênh do khoảng cách / gió / động tác, không do đổi bậc)
const c1 = await snap(20, 'chung-20.0'), c2 = await snap(20.6, 'chung-20.6');
console.log(JSON.stringify({ steps: path.length, chars: ids.length, frameBad: bad, flips: flips.map((f, i) => `${ids[i]} xa@${f.out.join('/')} gan@${f.in.join('/')}`),
  pop: { lui: await diff(o1, o2), tien: await diff(i1, i2), doiChung: await diff(c1, c2) }, errs: errs.filter((e) => !/500|WebSocket/.test(e)).slice(0, 5) }, null, 1));
await browser.close();
