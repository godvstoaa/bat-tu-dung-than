// ============================================================================
//  CHỤP ẢNH KIỂM TIÊN PHỦ (Playwright — docs/TIEN-PHU-MANIFEST.md §9): mỗi phủ chụp trước lầu (xa), toàn cảnh trên cao,
//  trong tầng 1 / 5 / 10, Vọng Đài; đo vật cản voxel + khung hình. Ghi lỗi trang.
//    node scripts/shot-tienphu.mjs [url] [outDir]   ·   H=283,284 (chọn phủ) · FLOORS=0,4,9,10 · PROBE=1 (đo lọt)
// ============================================================================
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL_ = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:5180/game.html';
const OUT = process.argv.slice(2).find((a) => !a.startsWith('http')) || 'output/tienphu-after';
mkdirSync(OUT, { recursive: true });
const HS = (process.env.H || '283,284,285,286,287,288,289,290,291').split(',').map(Number);
const FLOORS = (process.env.FLOORS || '0,4,9,10').split(',').map(Number);
const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errs = [];
page.on('pageerror', (e) => errs.push('pageerror: ' + e.message.slice(0, 300)));
page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|WebSocket/.test(m.text())) errs.push('console: ' + m.text().slice(0, 300)); });
await page.goto(URL_, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#hq-gate button', { timeout: 30000 });
if (await page.$('#hq-gate input[name=date]')) { const vis = await page.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false); if (vis) { await page.fill('#hq-gate input[name=date]', '1994-05-12'); await page.click('#hq-gate button[type=submit]'); } }
const go = page.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ });
await go.first().waitFor({ timeout: 30000 }); await go.first().click();
await page.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 180000 });
await page.evaluate((h) => window.__hq.renderer.setDebugHour?.(h), Number(process.env.HOUR || 10)); // khoá giờ (ảnh trước / sau cùng ánh sáng)
await page.waitForTimeout(2000);
const clean = () => page.evaluate(() => document.querySelectorAll('.hq-tut, .hq-digest, .hq-toast').forEach((e) => e.remove()));
const zoom = async (n) => { await page.mouse.move(640, 360); for (let k = 0; k < Math.abs(n); k++) { await page.mouse.wheel(0, n > 0 ? 400 : -400); await page.waitForTimeout(60); } await page.waitForTimeout(800); };
const tilt = async (dy, dx = 0) => { await page.mouse.move(640, 300); await page.mouse.down(); for (let k = 1; k <= 10; k++) await page.mouse.move(640 + (dx * k) / 10, 300 + (dy * k) / 10); await page.mouse.up(); await page.waitForTimeout(700); };

for (const h of HS) {
  const info = await page.evaluate(async (h) => { const M = await import('/src/game/mansions.js'); const m = M.estateByH(h); const sp = m.tp.tower.spec; const f = m.toWorld(m.tp.tower.x, m.tp.tower.z + sp.podium.a + sp.podium.run + 14), pad = m.toWorld(m.tp.tower.x + sp.pad.x, m.tp.tower.z + sp.pad.z + 2.5), gate = m.toWorld(0, m.D / 2 + 10); const inside = [...sp.floors.map((q) => m.toWorld(m.tp.tower.x, m.tp.tower.z + q.a - 3.2)), pad]; const cams = sp.floors.map((q) => { const e = m.toWorld(m.tp.tower.x + q.a * 0.55, m.tp.tower.z + q.a * 0.75), t = m.toWorld(m.tp.tower.x - q.a * 0.2, m.tp.tower.z - q.a * 0.3); return { pos: [e.x, q.y + 4.2, e.z], look: [t.x, q.y + 0.6, t.z] }; }); return { id: m.tp.st.id, name: m.name, f, pad, gate, inside, cams, ys: [...sp.floors.map((q) => q.y), sp.deck.y] }; }, h);
  console.log(`== ${h} ${info.id} ${info.name}`);
  await page.evaluate(([x, z]) => window.__hq.api.travel(x, z, 'chụp'), [info.f.x, info.f.z]);
  const t0 = Date.now();
  await page.waitForFunction((h) => { const r = window.__hq.renderer?.mansions?.builtRec?.(h); return r && r.g && !r.job && r.vox && !r.vox.job; }, h, { timeout: 120000, polling: 500 }).catch(() => console.log('  (chưa dựng xong)'));
  const st = await page.evaluate((h) => { const r = window.__hq.renderer.mansions.builtRec(h); let tris = 0, draws = 0; r.g.traverse((o) => { if (o.isMesh) { draws++; tris += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3; } }); return { tris: Math.round(tris), draws, vox: r.vox?.stats }; }, h);
  if (process.env.DEBUG) console.log('  lưới theo nhóm:', JSON.stringify(await page.evaluate((h) => { const r = window.__hq.renderer.mansions.builtRec(h), c = {}; r.g.traverse((o) => { if (!o.isMesh) return; let p = o.parent, path = []; while (p && p !== r.g) { path.unshift(p.name || p.type); p = p.parent; } const k = path.slice(0, 3).join('/'); c[k] = (c[k] || 0) + 1; }); return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 18); }, h)));
  console.log(`  dựng ${((Date.now() - t0) / 1000).toFixed(1)} s · ${st.draws} lệnh vẽ · ${(st.tris / 1000).toFixed(0)}k tam giác · voxel ${JSON.stringify(st.vox)}`);
  await page.waitForTimeout(1500); await clean();
  await page.screenshot({ path: `${OUT}/${h}-${info.id}-0-towerfront.png` });
  // toàn cảnh (camera gỡ lỗi): trên cao trước cổng nhìn vào tâm phủ · cận lầu chính
  const cams = await page.evaluate(async (h) => { const M = await import('/src/game/mansions.js'); const m = M.estateByH(h), sp = m.tp.tower.spec; const c = m.toWorld(0, -40), e = m.toWorld(0, 420), t = m.toWorld(m.tp.tower.x, m.tp.tower.z), tf = m.toWorld(m.tp.tower.x + 40, m.tp.tower.z + 75); return { wide: { pos: [e.x, 230, e.z], look: [c.x, 0, c.z] }, tower: { pos: [tf.x, 32, tf.z], look: [t.x, sp.height * 0.5, t.z] } }; }, h);
  for (const [nm, v] of Object.entries(cams)) { await page.evaluate((v) => window.__hq.renderer.setDebugCam(v), v); await page.waitForTimeout(1800); await clean(); await page.screenshot({ path: `${OUT}/${h}-${info.id}-1-${nm}.png` }); }
  await page.evaluate(() => window.__hq.renderer.setDebugCam(null));
  if (process.env.FPS) { const fps = await page.evaluate(() => new Promise((r) => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else r(Math.round(n / 3)); }; requestAnimationFrame(f); })); console.log('  fps', fps); }
  // trong các tầng: đặt người lên đĩa thang phép ở tầng k
  for (const k of FLOORS) {
    await page.evaluate(([p, y]) => { const hq = window.__hq, P = hq.player.phys || (hq.player.phys = {}); P.x = p.x; P.z = p.z; P.y3 = y + 0.05; P.vy = 0; hq.player.y3 = P.y3; const t = { x: p.x / 1.6 + 10, y: p.z / 1.6 + 7 }; hq.player.x = t.x; hq.player.y = t.y; hq.player.path = []; }, [info.inside[k], info.ys[k]]);
    await page.waitForTimeout(1800); await clean();
    await page.screenshot({ path: `${OUT}/${h}-${info.id}-f${k + 1}.png` });
    // góc máy trong phòng (nhìn chéo cả tầng từ trên cao 4,2 m)
    if (info.cams[k]) { await page.evaluate((v) => window.__hq.renderer.setDebugCam(v), info.cams[k]); await page.waitForTimeout(1500); await clean(); await page.screenshot({ path: `${OUT}/${h}-${info.id}-f${k + 1}-room.png` }); await page.evaluate(() => window.__hq.renderer.setDebugCam(null)); }
  }
  await page.evaluate(([x, z]) => window.__hq.api.travel(x, z, 'chụp'), [info.gate.x, info.gate.z]);
  await page.waitForTimeout(2500); await clean(); await zoom(4); await tilt(-60);
  await page.screenshot({ path: `${OUT}/${h}-${info.id}-2-gate.png` });
  await zoom(-4); await tilt(60);
}
console.log(errs.length ? `LỖI:\n${[...new Set(errs)].slice(0, 20).join('\n')}` : 'không lỗi trang');
await browser.close();
