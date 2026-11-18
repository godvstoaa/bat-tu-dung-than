// Ảnh tầm mắt trong game: H=283 node scripts/shot-tienphu-eye.mjs  ·  CAMS='x,y,z,lx,ly,lz;…' (cục bộ phủ, +z mặt tiền) · OUT=output/tienphu-eye
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const H = Number(process.env.H || 283), OUT = process.env.OUT || 'output/tienphu-eye'; mkdirSync(OUT, { recursive: true });
const CAMS = (process.env.CAMS || '36,7,240,0,9,165;-60,5,120,-165,6,172;40,40,-20,0,30,10').split(';').map((c) => c.split(',').map(Number));
const b = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const p = await (await b.newContext({ viewport: { width: 1600, height: 900 } })).newPage();
const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
await p.goto('http://localhost:5180/game.html', { waitUntil: 'domcontentloaded' });
await p.waitForSelector('#hq-gate button', { timeout: 120000 });
if (await p.$('#hq-gate input[name=date]')) { const vis = await p.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false); if (vis) { await p.fill('#hq-gate input[name=date]', '1994-05-12'); await p.click('#hq-gate button[type=submit]'); } }
const go = p.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ }); await go.first().waitFor({ timeout: 30000 }); await go.first().click();
await p.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 180000 });
await p.evaluate(() => window.__hq.renderer.setDebugHour?.(10));
const c0 = await p.evaluate(async (h) => { const M = await import('/src/game/mansions.js'); const m = M.estateByH(h); return m.toWorld(0, 200); }, H);
await p.evaluate(([x, z]) => window.__hq.api.travel(x, z, 'chụp'), [c0.x, c0.z]);
await p.waitForFunction((h) => { const r = window.__hq.renderer?.mansions?.builtRec?.(h); return r && r.g && !r.job && r.vox && !r.vox.job; }, H, { timeout: 200000, polling: 500 }).catch(() => {});
let i = 0;
const cams = process.env.AUTO ? await p.evaluate(async (h) => { const M = await import('/src/game/mansions.js'); const m = M.estateByH(h), P = m.tp, b = P.buildings[0], f = Math.sin(b.ry || 0), g = Math.cos(b.ry || 0), u = (b.front || b.d / 2) + 34, T = P.tower; return [[b.x + f * u + g * 14, 3.5, b.z + g * u - f * 14, b.x, Math.min(10, (b.h || 10) * 0.5), b.z], [T.x + 55, 6, T.z + 75, T.x, 28, T.z]]; }, H) : CAMS;
for (const [x, y, z, lx, ly, lz] of cams) {
  const v = await p.evaluate(async ([h, x, y, z, lx, ly, lz]) => { const M = await import('/src/game/mansions.js'); const m = M.estateByH(h); const a = m.toWorld(x, z), l = m.toWorld(lx, lz); return { pos: [a.x, y, a.z], look: [l.x, ly, l.z] }; }, [H, x, y, z, lx, ly, lz]);
  await p.evaluate((c) => window.__hq.renderer.setDebugCam(c), v); await p.waitForTimeout(3500);
  await p.evaluate(() => document.querySelectorAll('.hq-tut, .hq-digest, .hq-toast, .hq-label, .hq-bubble').forEach((e) => e.remove()));
  await p.screenshot({ path: `${OUT}/eye-${H}-${++i}.png` });
}
console.log(errs.length ? 'LỖI: ' + [...new Set(errs)].slice(0, 5).join(' | ') : 'không lỗi trang');
await b.close();
