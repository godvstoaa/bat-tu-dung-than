// ============================================================================
//  ĐO VA CHẠM ĐỒ GLB TIÊN PHỦ (docs/TIEN-PHU-DOHOA-MANIFEST.md §4): đồ GLB nằm trong nhóm noCollide (nhân bản, cắt theo tầm
//  nhìn), va chạm là hộp / trụ ẩn ở lớp proxy → kiểm ĐỘC LẬP «đi vào trong món đồ được không»: với mỗi món đặc (cao > 0,3 m) và
//  mỗi gốc cây model, tiến từ ngoài vào tâm theo 8 hướng (bước 0,05 m, __hq.blockedAt có cao độ) — phải bị chặn TRƯỚC khi tâm người
//  đi quá nửa đường từ mép vào tâm. (Voxel chỉ ghi vỏ: ruột khối to rỗng nhưng không tới được — đo «chặn ở tâm» là sai câu hỏi.)
//  Mục tiêu: 100 %.   node scripts/probe-props.mjs [url]   ·   H=283,…
// ============================================================================
import { chromium } from 'playwright';
const URL_ = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:5180/game.html';
const HS = (process.env.H || '283,284,285,286,287,288,289,290,291').split(',').map(Number);
const SOFT = new Set(['lib_lib_flower_meadow', 'lib_lib_shrub_under', 'pr_teaset', 'lib_lantern']); // mềm / thấp / treo cao: không chặn
const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 800, height: 450 } })).newPage();
await page.goto(URL_, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#hq-gate button', { timeout: 120000 });
if (await page.$('#hq-gate input[name=date]')) { const vis = await page.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false); if (vis) { await page.fill('#hq-gate input[name=date]', '1994-05-12'); await page.click('#hq-gate button[type=submit]'); } }
const go = page.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ }); await go.first().waitFor({ timeout: 30000 }); await go.first().click();
await page.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 180000 });
let tot = 0, ok = 0;
for (const h of HS) {
  const at = await page.evaluate(async (h) => (await import('/src/game/mansions.js')).estateByH(h).toWorld(0, 0), h);
  await page.evaluate(([x, z]) => window.__hq.api.travel(x, z, 'đo'), [at.x, at.z]);
  await page.waitForFunction((h) => { const r = window.__hq.renderer?.mansions?.builtRec?.(h); return r && r.g && !r.job && r.vox && !r.vox.job && r.props?.outdoor.world; }, h, { timeout: 150000, polling: 500 });
  const res = await page.evaluate(async ([h, soft]) => {
    const hq = window.__hq, r = hq.renderer.mansions.builtRec(h), m = r.m, S = new Set(soft);
    const { propSize } = await import('/src/game/tienphu/props.js'); const F = await import('/src/game/tienphu/flora.js');
    const blocked = (x, z, y) => hq.blockedAt(x / 1.6 + 10, z / 1.6 + 7, { phys: { y3: y } });
    const out = { n: 0, ok: 0, miss: {} };
    // 8 hướng: từ mép + 0,6 m tiến vào; chặn trước khi tới nửa đường mép → tâm (b / 2). hw, hd: nửa cỡ theo trục cục bộ của món (xoay ry)
    const sealed = (x, z, y, hw, hd, ry) => { for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4, ca = Math.cos(a), sa = Math.sin(a), b = Math.min(Math.abs(ca) > 1e-6 ? hw / Math.abs(ca) : 1e9, Math.abs(sa) > 1e-6 ? hd / Math.abs(sa) : 1e9);
      const c = Math.cos(ry), s = Math.sin(ry), wx = c * ca + s * sa, wz = -s * ca + c * sa; let hit = false;
      for (let d = b + 0.6; d >= b / 2; d -= 0.05) if (blocked(x + wx * d, z + wz * d, y)) { hit = true; break; }
      if (!hit) return false; } return true; };
    const sets = [r.props.outdoor, ...r.props.halls, ...r.props.floors].filter(Boolean);
    for (const ps of sets) for (const w of ps.world || []) {
      if (S.has(w.id) || propSize(w.id, w.s, w.fit).h <= 0.3) continue;
      const sz = propSize(w.id, w.s, w.fit); out.n++; if (sealed(w.x, w.z, w.y, sz.w * 0.85 / 2, sz.d * 0.85 / 2, w.ry)) out.ok++; else out.miss[w.id] = (out.miss[w.id] || 0) + 1;
    }
    for (const t of m.tp.trees) { if (!F.hasModel(t.kind)) continue; const p = m.toWorld(t.x, t.z), q = F.treeProxy(t); out.n++; if (sealed(p.x, p.z, 0, q.r || q.w / 2, q.r || q.d / 2, m.ry)) out.ok++; else out.miss.tree = (out.miss.tree || 0) + 1; }
    return { name: m.name, ...out };
  }, [h, [...SOFT]]);
  tot += res.n; ok += res.ok;
  console.log(`${h} ${res.name}: ${res.ok}/${res.n} món kín (không đi vào được)` + (Object.keys(res.miss).length ? `  · lọt: ${JSON.stringify(res.miss)}` : ''));
}
console.log(`\n${ok}/${tot} (${(100 * ok / Math.max(1, tot)).toFixed(2)} %) — mục tiêu 100 %: ${ok === tot ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
await browser.close();
