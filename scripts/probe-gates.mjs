// ============================================================================
//  ĐO LỐI QUA CỔNG TIÊN PHỦ (Playwright — docs/TIEN-PHU-MANIFEST.md §9b): với mỗi phủ, mỗi cổng (chính / sau / Đông / Tây),
//  dò đường thẳng qua tâm cổng theo pháp tuyến, từ 8 m ngoài (mép đảo + lan can cách tường 10 m) tới 12 m trong, mỗi 0,1 m — dùng chính va chạm của game
//  (__hq.blockedAt có cao độ chân + renderer.groundY). LỖI khi: điểm bị chặn, hoặc mặt nền nhảy > 0,3 m giữa hai mẫu.
//  Cũng đo hai CỘT cổng (± nửa bề rộng cổng + 0,6 m): phải bị chặn ở tầm thân người.
//    node scripts/probe-gates.mjs [url]   ·   H=283,…
// ============================================================================
import { chromium } from 'playwright';
const URL_ = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:5180/game.html';
const HS = (process.env.H || '283,284,285,286,287,288,289,290,291').split(',').map(Number);
const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1000, height: 560 } })).newPage();
await page.goto(URL_, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#hq-gate button', { timeout: 120000 });
if (await page.$('#hq-gate input[name=date]')) { const vis = await page.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false); if (vis) { await page.fill('#hq-gate input[name=date]', '1994-05-12'); await page.click('#hq-gate button[type=submit]'); } }
const go = page.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ }); await go.first().waitFor({ timeout: 30000 }); await go.first().click();
await page.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 180000 });
let fails = 0, lanes = 0;
for (const h of HS) {
  const at = await page.evaluate(async (h) => { const M = await import('/src/game/mansions.js'); return M.estateByH(h).toWorld(0, 0); }, h);
  await page.evaluate(([x, z]) => window.__hq.api.travel(x, z, 'đo'), [at.x, at.z]);
  await page.waitForFunction((h) => { const r = window.__hq.renderer?.mansions?.builtRec?.(h); return r && r.g && !r.job && r.vox && !r.vox.job; }, h, { timeout: 150000, polling: 500 });
  const res = await page.evaluate(async (h) => {
    const M = await import('/src/game/mansions.js'); const m = M.estateByH(h), hq = window.__hq;
    const blocked = (x, z, y) => hq.blockedAt(x / 1.6 + 10, z / 1.6 + 7, { phys: { y3: y } });
    const out = [];
    for (const gt of m.tp.gates) {
      // pháp tuyến «ra ngoài» (cục bộ): cổng nằm trên tường Đông / Tây (|x| ≈ W/2) hay Nam / Bắc
      const side = Math.abs(Math.abs(gt.x) - m.W / 2) < 1, nx = side ? Math.sign(gt.x) : 0, nz = side ? 0 : Math.sign(gt.z), tx = -nz, tz = nx;
      const P = (u, s) => m.toWorld(gt.x + nx * u + tx * s, gt.z + nz * u + tz * s);
      let prev = null, bad = [], maxY = 0;
      for (let u = 8; u >= -12; u -= 0.1) {
        const p = P(u, 0), y = hq.renderer.groundY(p.x, p.z, (prev ?? 0) + 0.45);
        if (blocked(p.x, p.z, y)) bad.push(`chặn@${u.toFixed(1)}(y ${y.toFixed(2)})`);
        else if (prev != null && Math.abs(y - prev) > 0.3) bad.push(`bậc ${(y - prev).toFixed(2)}@${u.toFixed(1)}`);
        prev = y; maxY = Math.max(maxY, y);
      }
      // cột / má cổng hai bên: phải chặn
      let jambs = 0;
      for (const sx of [-1, 1]) { const p = P(0, sx * (gt.w / 2 + 0.6)), y = hq.renderer.groundY(p.x, p.z, maxY + 0.5); if (blocked(p.x, p.z, y)) jambs++; }
      out.push({ id: gt.id, ok: !bad.length && jambs === 2, bad: bad.slice(0, 4), nbad: bad.length, jambs, maxY: +maxY.toFixed(2) });
    }
    return { name: m.name, gate: m.tp.st.gate, out };
  }, h);
  for (const g of res.out) { lanes++; if (!g.ok) fails++; }
  console.log(`${h} ${res.name} (${res.gate}): ` + res.out.map((g) => `${g.id} ${g.ok ? 'ĐẠT' : 'LỖI'}${g.ok ? '' : ` [${g.nbad} điểm: ${g.bad.join(' ')} · má cổng chặn ${g.jambs}/2]`} (cao ${g.maxY})`).join(' · '));
}
console.log(`\n${lanes - fails}/${lanes} lối cổng đạt — ${fails ? 'CHƯA ĐẠT' : 'ĐẠT'}`);
await browser.close();
