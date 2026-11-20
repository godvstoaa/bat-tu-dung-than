// ĐO TRỄ ẢNH SAU DỊCH CHUYỂN (docs/TRE-DICH-CHUYEN-MANIFEST.md): vào game, travel tới điểm, ghi khung hình (rAF), tác vụ dài
// (PerformanceObserver longtask) và hồ sơ CPU (CDP Profiler) trong T giây → thời điểm khung «ổn» đầu tiên + top hàm tốn.
//   SPOT='{"x":0,"z":2190}' T=40 PROF=1 node scripts/travel-probe.mjs
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
const S = JSON.parse(process.env.SPOT || '{"x":0,"z":2190}'), T = Number(process.env.T || 40);
const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } }); const page = await ctx.newPage(); page.on('pageerror', (e) => console.log('pageerror', e.message.slice(0, 200))); page.on('console', (m) => { if (m.type() === 'error') console.log('console.error', m.text().slice(0, 200)); });
if (process.env.INIT) await page.addInitScript((f) => { globalThis[f] = true; }, process.env.INIT);
await page.goto('http://localhost:5181/game.html', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#hq-gate button', { timeout: 60000 });
if (await page.$('#hq-gate input[name=date]')) { const vis = await page.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false); if (vis) { await page.fill('#hq-gate input[name=date]', '1994-05-12'); await page.click('#hq-gate button[type=submit]'); } }
const go = page.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ }); await go.first().waitFor({ timeout: 60000 }); await go.first().click();
await page.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 180000 });
await page.waitForTimeout(6000);
if (process.env.DIAG) await page.evaluate(() => {
  // CHẨN ĐOÁN SHADER SÓT: chương trình nào sinh ra trong compile() (làm nóng) và chương trình nào sinh ra lúc vẽ; mỗi lần
  // setProgram dùng LẦN ĐẦU một chương trình thì ghi thời gian getProgramInfoLog (onFirstUse) + khoá + vật dùng nó
  const R = window.__hq.renderer.webgl, gl = R.getContext(), D = (window.__sd = { warm: new Set(), born: [], slow: [] });
  const progs = () => R.info.programs;
  const c0 = R.compile.bind(R);
  R.compile = function (...a) { const r = c0(...a); for (const p of progs()) D.warm.add(p.id); return r; };
  const gpil = gl.getProgramInfoLog.bind(gl);
  gl.getProgramInfoLog = function (p) { const t = performance.now(), r = gpil(p); const dt = performance.now() - t; if (dt > 8) D.slow.push({ dt: Math.round(dt), t: Math.round(performance.now()) }); return r; };
  const r0 = R.renderBufferDirect.bind(R);
  const seen = new Set(progs().map((p) => p.id));
  R.renderBufferDirect = function (camera, scene, geometry, material, object, group) {
    const n = progs().length; const t = performance.now(); const out = r0(camera, scene, geometry, material, object, group); const dt = performance.now() - t;
    if (dt > 8) { const p = progs().find((q) => !seen.has(q.id)); const nm = []; for (let o = object; o && nm.length < 5; o = o.parent) nm.push(o.name || o.type);
      D.born.push({ dt: Math.round(dt), newProg: !!p, warm: p ? D.warm.has(p.id) : null, mat: material.name || material.type, key: material.customProgramCacheKey?.() || '', obj: nm.join('<'), vis: object.visible, inst: !!object.isInstancedMesh, depth: !!scene?.isScene === false }); }
    for (const q of progs()) seen.add(q.id); return out;
  };
});
const cdp = await ctx.newCDPSession(page);
if (process.env.PROF) { await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 }); await cdp.send('Profiler.start'); }
await page.evaluate(([x, z, T]) => {
  window.__tp = { frames: [], long: [], t0: performance.now(), stats: [] };
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__tp.long.push([Math.round(e.startTime - window.__tp.t0), Math.round(e.duration)]); }).observe({ type: 'longtask', buffered: false });
  const f = () => { const t = performance.now() - window.__tp.t0; window.__tp.frames.push(Math.round(t)); if (t < T * 1000) requestAnimationFrame(f); }; requestAnimationFrame(f);
  const iv = setInterval(() => { const st = window.__hq.renderer.frameStats?.(); window.__tp.stats.push([Math.round(performance.now() - window.__tp.t0), st?.calls, st?.tris]); if (performance.now() - window.__tp.t0 > T * 1000) clearInterval(iv); }, 1000);
  window.__tp.p0 = new Set(window.__hq.renderer.webgl.info.programs.map((q) => q.id));
  // ai biên dịch đồng bộ: vá onBeforeRender của mọi lưới mới vào cảnh sau dịch chuyển? → đơn giản: ghi tên chương trình mới mỗi giây
  const iv2 = setInterval(() => { const P = window.__hq.renderer.webgl.info.programs; window.__tp.newp = P.filter((q) => !window.__tp.p0.has(q.id)).map((q) => q.name + ' | ' + (q.cacheKey || '').slice(0, 150)); if (performance.now() - window.__tp.t0 > T * 1000) clearInterval(iv2); }, 1000);
  window.__hq.api.travel(x, z, 'đo');
}, [S.x, S.z, T]);
await page.waitForTimeout(T * 1000 + 1500);
const r = await page.evaluate(() => window.__tp);
// khung «ổn»: từ đó trở đi mọi khoảng cách khung < 100 ms trong 2 s
const fr = r.frames, gaps = fr.slice(1).map((t, i) => [fr[i], t - fr[i]]);
let settle = null; for (let i = 0; i < gaps.length; i++) { if (gaps[i][1] >= 100) continue; let ok = true; for (let j = i; j < gaps.length && gaps[j][0] - gaps[i][0] < 2000; j++) if (gaps[j][1] >= 100) { ok = false; break; } if (ok && gaps[i][0] > 1300) { settle = gaps[i][0]; break; } }
const big = gaps.filter((g) => g[1] >= 100);
console.log(`khung ổn sau ${settle} ms · khoảng trống ≥100 ms: ${big.length}, tổng ${big.reduce((a, g) => a + g[1], 0)} ms, lớn nhất ${Math.max(0, ...big.map((g) => g[1]))} ms`);
console.log('tác vụ dài (bắt đầu ms, dài ms) ≥ 300:', JSON.stringify(r.long.filter((l) => l[1] >= 300)));
console.log('tổng tác vụ dài:', r.long.reduce((a, l) => a + l[1], 0), 'ms /', r.long.length);
console.log('chương trình mới:', (r.newp || []).length); const cnt = new Map(); for (const k of r.newp || []) cnt.set(k, (cnt.get(k) || 0) + 1); for (const [k, v] of [...cnt].sort((a, b) => b[1] - a[1]).slice(0, 25)) console.log('  ', v, k);
if (process.env.DIAG) { const d = await page.evaluate(() => ({ born: window.__sd.born, slow: window.__sd.slow.length, warm: window.__sd.warm.size })); console.log('DIAG: số CT làm nóng', d.warm, '· getProgramInfoLog > 8 ms:', d.slow); for (const b of d.born.sort((a, b) => b.dt - a.dt).slice(0, 25)) console.log('  ', JSON.stringify(b)); }
console.log('stats', JSON.stringify(r.stats.filter((_, i) => i % 4 === 0)));
if (process.env.PROF) {
  const { profile } = await cdp.send('Profiler.stop'); mkdirSync('output/travel', { recursive: true }); writeFileSync('output/travel/prof.cpuprofile', JSON.stringify(profile));
  const self = new Map(), dt = profile.timeDeltas, idx = new Map(profile.nodes.map((n) => [n.id, n]));
  profile.samples.forEach((id, i) => { const n = idx.get(id), k = `${n.callFrame.functionName || '(anon)'} ${n.callFrame.url.split('/').slice(-2).join('/')}:${n.callFrame.lineNumber + 1}`; self.set(k, (self.get(k) || 0) + (dt[i] || 0) / 1000); });
  // tổng gồm con: theo cây
  const tot = new Map(); const kids = (n) => (n.children || []).map((c) => idx.get(c));
  const selfOf = new Map(); profile.samples.forEach((id, i) => selfOf.set(id, (selfOf.get(id) || 0) + (dt[i] || 0) / 1000));
  const total = (n) => { let t = selfOf.get(n.id) || 0; for (const c of kids(n)) t += total(c); const k = `${n.callFrame.functionName || '(anon)'} ${n.callFrame.url.split('/').slice(-2).join('/')}:${n.callFrame.lineNumber + 1}`; tot.set(k, Math.max(tot.get(k) || 0, t)); return t; };
  total(idx.get(profile.nodes[0].id));
  console.log('TOP self (ms):'); for (const [k, v] of [...self].sort((a, b) => b[1] - a[1]).slice(0, 18)) console.log('  ', v.toFixed(0), k);
  console.log('TOP tổng (ms):'); for (const [k, v] of [...tot].filter(([k]) => /src\/game|archcity|tienphu/.test(k)).sort((a, b) => b[1] - a[1]).slice(0, 30)) console.log('  ', v.toFixed(0), k);
}
await browser.close();
