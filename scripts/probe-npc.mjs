// ============================================================================
//  ĐO NPC ĐI / ĐỨNG XUYÊN VẬT (Playwright — docs/TIEN-PHU-MANIFEST.md §9b): tới cổng từng tiên phủ (+ sân trong),
//  theo dõi mọi NPC đang hiện trong SEC giây, mỗi 0,5 s hỏi lớp vật cản thật (citizens.blockedAtGround — đặc 2D + voxel
//  theo tầng, bỏ vòng chặn nhân vật) xem thân NPC có nằm trong cột / vách / cây không. Mục tiêu: 0 mẫu xuyên.
//    node scripts/probe-npc.mjs [url]   ·   H=283,… · SEC=20 · SHOT=thư-mục (chụp cổng)
// ============================================================================
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const URL_ = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:5180/game.html';
const HS = (process.env.H || '283,284,285,286,287,288,289,290,291').split(',').map(Number);
const SEC = Number(process.env.SEC || 20), SHOT = process.env.SHOT;
if (SHOT) mkdirSync(SHOT, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errs = []; page.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
await page.goto(URL_, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#hq-gate button', { timeout: 120000 });
if (await page.$('#hq-gate input[name=date]')) { const vis = await page.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false); if (vis) { await page.fill('#hq-gate input[name=date]', '1994-05-12'); await page.click('#hq-gate button[type=submit]'); } }
const go = page.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ }); await go.first().waitFor({ timeout: 30000 }); await go.first().click();
await page.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 180000 });
let total = 0, bad = 0;
for (const h of HS) {
  for (const spot of ['gate', 'yard']) {
    const p = await page.evaluate(async ([h, spot]) => { const M = await import('/src/game/mansions.js'); const m = M.estateByH(h); return spot === 'gate' ? m.toWorld(0, m.D / 2 + 8) : m.toWorld(0, m.D / 2 - 30); }, [h, spot]);
    await page.evaluate(([x, z]) => window.__hq.api.travel(x, z, 'đo'), [p.x, p.z]);
    await page.waitForFunction((h) => { const r = window.__hq.renderer?.mansions?.builtRec?.(h); return r && r.g && !r.job && r.vox && !r.vox.job; }, h, { timeout: 150000, polling: 500 }).catch(() => {});
    await page.waitForTimeout(1500);
    const seen = {};
    for (let s = 0; s < SEC * 2; s++) {
      const snap = await page.evaluate(() => { const hq = window.__hq, C = hq.renderer.citizens, P = hq.player.phys || {};
        return C.list.filter((n) => n.active && n.ch && n.pose !== 'sit' && Math.hypot(n.x - P.x, n.z - P.z) < 60).map((n) => ({ id: n.id, name: n.name, hit: C.blockedAtGround(n.x, n.z), moving: n.moving, x: +n.x.toFixed(1), z: +n.z.toFixed(1), moved: n.moved || 0, bumped: n.bumped || 0 })); });
      for (const r of snap) { const b = (seen[r.id] ||= { name: r.name, n: 0, hit: 0, walk: 0, moved: 0, bumped: 0, at: null }); b.n++; if (r.moving) b.walk++; if (r.hit) { b.hit++; b.at = [r.x, r.z]; } b.moved = r.moved; b.bumped = r.bumped; }
      await page.waitForTimeout(500);
    }
    const rows = Object.values(seen), n = rows.reduce((a, r) => a + r.n, 0), hit = rows.reduce((a, r) => a + r.hit, 0);
    total += n; bad += hit;
    console.log(`${h} ${spot}: ${rows.length} NPC · ${n} mẫu · XUYÊN ${hit}` + (hit ? '  ' + JSON.stringify(rows.filter((r) => r.hit)) : '') + `  (dời chỗ ${rows.reduce((a, r) => a + r.moved, 0)}, quay đầu ${rows.reduce((a, r) => a + r.bumped, 0)})`);
    if (SHOT && spot === 'gate') { await page.evaluate(() => document.querySelectorAll('.hq-tut, .hq-digest, .hq-toast').forEach((e) => e.remove())); await page.screenshot({ path: `${SHOT}/npc-${h}-gate.png` }); }
  }
}
console.log(`\ntổng ${total} mẫu · xuyên ${bad} — mục tiêu 0: ${bad === 0 ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
if (errs.length) console.log('lỗi trang:', [...new Set(errs)].slice(0, 8).join(' | '));
await browser.close();
