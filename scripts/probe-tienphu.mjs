// ============================================================================
//  ĐO ĐI XUYÊN TIÊN PHỦ (Playwright — docs/TIEN-PHU-MANIFEST.md §9): kiểm ĐỘC LẬP với voxel.js.
//  Băm tam giác của phủ (trừ nhóm noCollide) vào ô 2 m; tại mỗi điểm mẫu (mặt đất / nền / từng tầng lầu) bắn 8 tia ngang
//  dài 0,18 m ở cao 0,5 · 1,0 · 1,5 m trên sàn. Có tia chạm hình = «có vật ở tầm thân người» → phải bị chặn
//  (obstacles.blockedByBuilding(x, z, y)). Không bị chặn = LỌT (đi xuyên). Cũng đếm «tường vô hình»: bị chặn mà trong 0,7 m
//  không có hình nào. Mục tiêu §9: lọt ≤ 2 %.
//    node scripts/probe-tienphu.mjs [url]   ·   H=283 (mặc định 283,284,…) · STEP=1.5
// ============================================================================
import { chromium } from 'playwright';
const URL_ = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:5180/game.html';
const HS = (process.env.H || '283,284,285,286,287,288,289,290,291').split(',').map(Number);
const STEP = Number(process.env.STEP || 1.5);
const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 800, height: 450 } })).newPage();
await page.goto(URL_, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#hq-gate button', { timeout: 30000 });
if (await page.$('#hq-gate input[name=date]')) { const vis = await page.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false); if (vis) { await page.fill('#hq-gate input[name=date]', '1994-05-12'); await page.click('#hq-gate button[type=submit]'); } }
const go = page.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ }); await go.first().waitFor({ timeout: 30000 }); await go.first().click();
await page.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 180000 });
let worst = 0;
for (const h of HS) {
  const at = await page.evaluate(async (h) => { const M = await import('/src/game/mansions.js'); const m = M.estateByH(h); return m.toWorld(0, 30); }, h);
  await page.evaluate(([x, z]) => window.__hq.api.travel(x, z, 'đo'), [at.x, at.z]);
  await page.waitForFunction((h) => { const r = window.__hq.renderer?.mansions?.builtRec?.(h); return r && r.g && !r.job && r.vox && !r.vox.job; }, h, { timeout: 150000, polling: 500 });
  const res = await page.evaluate(async ([h, STEP]) => {
    // trạng thái va chạm của CHÍNH game đang chạy (import lại obstacles.js trong trang ra bản module khác, rỗng)
    const hq = window.__hq, O = { blockedByBuilding: (x, z, y) => hq.blockedAt(x / 1.6 + 10, z / 1.6 + 7, { phys: { y3: y } }), ground: (x, z, y) => hq.renderer.groundY(x, z, y) };
    const rec = window.__hq.renderer.mansions.builtRec(h), m = rec.m, sp = m.tp.tower.spec;
    const THREE = { Vector3: rec.g.position.constructor }; // không import 'three' trần trong trang
    // băm tam giác (thế giới) theo ô 2 m — chỉ mesh hiện + không noCollide (bản gộp lầu / sảnh thay cho từng tầng / sảnh khi đứng ngoài: lấy cả hai)
    const C = 2, H = new Map(), A = new THREE.Vector3(), B = new THREE.Vector3(), Cc = new THREE.Vector3();
    rec.g.updateMatrixWorld(true);
    const roots = []; rec.g.traverse((o) => { if (o.isMesh && !o.userData.noCollide) { let p = o, skip = false; while (p) { if (p.userData?.noCollide && p.name !== 'towerWhole' && p.name !== 'hallsWhole') { skip = true; break; } if (p.name === 'towerWhole' || p.name === 'hallsWhole') { skip = true; break; } p = p.parent; } if (!skip) roots.push(o); } });
    let nt = 0;
    for (const o of roots) { const g = o.geometry, pos = g.attributes.position, idx = g.index, n = idx ? idx.count / 3 : pos.count / 3; for (let t = 0; t < n; t++) {
      const i0 = idx ? idx.getX(t * 3) : t * 3, i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1, i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
      A.fromBufferAttribute(pos, i0).applyMatrix4(o.matrixWorld); B.fromBufferAttribute(pos, i1).applyMatrix4(o.matrixWorld); Cc.fromBufferAttribute(pos, i2).applyMatrix4(o.matrixWorld);
      const tri = [A.x, A.y, A.z, B.x, B.y, B.z, Cc.x, Cc.y, Cc.z, (o.userData.matKey || o.material?.name || o.parent?.name || '?')]; nt++;
      const x0 = Math.floor(Math.min(A.x, B.x, Cc.x) / C), x1 = Math.floor(Math.max(A.x, B.x, Cc.x) / C), z0 = Math.floor(Math.min(A.z, B.z, Cc.z) / C), z1 = Math.floor(Math.max(A.z, B.z, Cc.z) / C);
      if ((x1 - x0) * (z1 - z0) > 400) continue;
      for (let i = x0; i <= x1; i++) for (let j = z0; j <= z1; j++) { const k = i * 100000 + j; let a = H.get(k); if (!a) H.set(k, (a = [])); a.push(tri); }
    } }
    // giao đoạn thẳng p → p + d·L với tam giác (Möller–Trumbore)
    const segHit = (px, py, pz, dx, dy, dz, L, tri) => {
      const e1x = tri[3] - tri[0], e1y = tri[4] - tri[1], e1z = tri[5] - tri[2], e2x = tri[6] - tri[0], e2y = tri[7] - tri[1], e2z = tri[8] - tri[2];
      const hx = dy * e2z - dz * e2y, hy = dz * e2x - dx * e2z, hz = dx * e2y - dy * e2x, a = e1x * hx + e1y * hy + e1z * hz;
      if (Math.abs(a) < 1e-9) return false; const f = 1 / a, sx = px - tri[0], sy = py - tri[1], sz = pz - tri[2], u = f * (sx * hx + sy * hy + sz * hz); if (u < 0 || u > 1) return false;
      const qx = sy * e1z - sz * e1y, qy = sz * e1x - sx * e1z, qz = sx * e1y - sy * e1x, v = f * (dx * qx + dy * qy + dz * qz); if (v < 0 || u + v > 1) return false;
      const t = f * (e2x * qx + e2y * qy + e2z * qz); return t >= 0 && t <= L;
    };
    const DIRS = Array.from({ length: 8 }, (_, k) => [Math.cos((k * Math.PI) / 4), Math.sin((k * Math.PI) / 4)]);
    let lastHit = ''; const occupied = (x, y, z, L) => { const list = H.get(Math.floor(x / C) * 100000 + Math.floor(z / C)) || []; for (const dy of [0.5, 1.0, 1.5]) for (const [dx, dz] of DIRS) for (const tri of list) if (segHit(x, y + dy, z, dx, 0, dz, L, tri)) { lastHit = `${tri[9]}@${dy}`; return true; } return false; };
    let occ = 0, leak = 0, ghost = 0, tot = 0; const leaks = [], ghosts = [], byKind = {}, ex = {};
    const sample = (x, z, y, tag) => {
      tot++;
      const o = occupied(x, y, z, 0.18), b = O.blockedByBuilding(x, z, y);
      if (o) { occ++; if (!b) { leak++; const kk = `${tag.startsWith('tầng') ? 'tầng' : tag}:${lastHit.split('@')[0]}`; byKind[kk] = (byKind[kk] || 0) + 1; if (!ex[kk]) ex[kk] = []; if (ex[kk].length < 3) { const c = Math.cos(m.ry), s2 = Math.sin(m.ry), dx = x - m.x, dz = z - m.z; ex[kk].push([+(c * dx - s2 * dz - m.tp.tower.x).toFixed(2), +(y).toFixed(1), +(s2 * dx + c * dz - m.tp.tower.z).toFixed(2), lastHit]); } if (leaks.length < 12) leaks.push([tag, Math.round(x * 10) / 10, Math.round(y * 10) / 10, Math.round(z * 10) / 10, lastHit]); } }
      else if (b && !occupied(x, y, z, 0.7)) { ghost++; if (ghosts.length < 8) ghosts.push([tag, Math.round(x * 10) / 10, Math.round(y * 10) / 10, Math.round(z * 10) / 10]); }
    };
    // mặt đất / nền một tầng (trừ thân lầu)
    for (let a = -m.W / 2 - 8; a < m.W / 2 + 8; a += STEP) for (let b = -m.D / 2 - 8; b < m.D / 2 + 8; b += STEP) { // gồm 8 m ngoài tường: lầu cổng / cổng phụ
      const lx = a - m.tp.tower.x, lz = b - m.tp.tower.z; if (Math.abs(lx) < sp.podium.a + 1 && Math.abs(lz) < sp.podium.a + sp.podium.run + 1) continue;
      const p = m.toWorld(a, b), y = O.ground(p.x, p.z, 30); if (y < -0.2 || y > 12) continue; // lòng hồ / nóc giả sơn: bỏ
      sample(p.x, p.z, y, 'đất');
    }
    // từng tầng lầu + Vọng Đài (lưới 0,5 m)
    const levels = [...sp.floors.map((f) => ({ y: f.y, a: f.slabA })), { y: sp.deck.y, a: sp.deck.a }];
    levels.forEach((f, k) => { for (let a = -f.a; a <= f.a; a += 0.5) for (let b = -f.a; b <= f.a; b += 0.5) { const p = m.toWorld(m.tp.tower.x + a, m.tp.tower.z + b), top = O.ground(p.x, p.z, f.y + 0.1); if (top == null || Math.abs(top - f.y) > 0.05) continue; sample(p.x, p.z, f.y, `tầng ${k + 1}`); } });
    return { h, name: m.name, tris: nt, tot, occ, leak, ghost, pct: occ ? +(100 * leak / occ).toFixed(2) : 0, leaks, ghosts, byKind: Object.entries(byKind).sort((a, b) => b[1] - a[1]).slice(0, 12), ex };
  }, [h, STEP]);
  worst = Math.max(worst, res.pct);
  console.log(`${res.h} ${res.name}: mẫu ${res.tot} · có vật ${res.occ} · LỌT ${res.leak} (${res.pct} %) · tường vô hình ${res.ghost}`);
  if (res.leaks.length) console.log('  lọt:', JSON.stringify(res.leaks)); if (res.byKind.length) console.log('  lọt theo loại:', JSON.stringify(res.byKind)); if (process.env.EX) console.log('  ví dụ (cục bộ lầu):', JSON.stringify(res.ex));
  if (res.ghosts.length) console.log('  vô hình:', JSON.stringify(res.ghosts));
}
console.log(`\nlọt lớn nhất ${worst} % — mục tiêu ≤ 2 % ${worst <= 2 ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
await browser.close();
