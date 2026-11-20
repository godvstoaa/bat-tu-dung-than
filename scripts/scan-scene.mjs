// ============================================================================
//  QUÉT CẢNH (Playwright): vào game, dịch chuyển tới các điểm, liệt kê MỌI vật thể nhìn thấy quanh người chơi theo
//  tên model: số bản, kích thước thế giới (rộng × sâu × cao, m), tam giác, cỡ texture, mật độ texel (px/m — đo
//  «mờ»), có phải khối thô (BoxGeometry / ≤ 24 đỉnh) không. Ghi JSON + bảng.
//    SPOTS='[{"name":"son","x":0,"z":30}]' node scripts/scan-scene.mjs [url] [outDir]
// ============================================================================
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const URL_ = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:5181/game.html';
const OUT = process.argv.slice(2).find((a) => !a.startsWith('http')) || 'output/scan';
mkdirSync(OUT, { recursive: true });
const R = Number(process.env.R || 70);
const browser = await chromium.launch({ headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
page.on('pageerror', (e) => console.log('pageerror', e.message.slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'warning' || m.type() === 'error') { const t = m.text(); if (!/Failed to load resource|WebSocket|THREE\.|GPU stall/.test(t)) console.log('console.' + m.type(), t.slice(0, 240)); } });
await page.goto(URL_, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#hq-gate button', { timeout: 60000 });
if (await page.$('#hq-gate input[name=date]')) {
  const vis = await page.$eval('#hq-gate input[name=date]', (e) => e.offsetParent !== null).catch(() => false);
  if (vis) { await page.fill('#hq-gate input[name=date]', '1994-05-12'); await page.click('#hq-gate button[type=submit]'); }
}
const go = page.locator('#hq-gate button', { hasText: /Mặc phẩm phục|Bước qua cổng/ });
await go.first().waitFor({ timeout: 60000 }); await go.first().click();
await page.waitForFunction(() => document.getElementById('hq-loading')?.hidden, null, { timeout: 180000 });
await page.waitForTimeout(4000);
await page.evaluate(() => document.querySelectorAll('.hq-tut, .hq-digest, .hq-toast').forEach((e) => e.remove()));

const SPOTS = JSON.parse(process.env.SPOTS || '[{"name":"start"}]');
const all = {};
for (const s of SPOTS) {
  if (s.x != null) { await page.evaluate(([x, z]) => window.__hq?.api?.travel?.(x, z, 'quét'), [s.x, s.z]); await page.waitForTimeout(s.wait || 12000); }
  if (s.yaw != null || s.pitch != null || s.dist != null) { await page.evaluate((v) => window.__hq.renderer.setView(v), { yaw: s.yaw, pitch: s.pitch, dist: s.dist }); await page.waitForTimeout(2500); }
  await page.evaluate((c) => window.__hq.renderer.setDebugCam(c || null), s.cam ? { pos: s.cam, look: s.look } : null); if (s.cam) await page.waitForTimeout(2500);
  if (s.hour != null) await page.evaluate((h) => { window.__hq?.renderer?.setDebugHour?.(h); }, s.hour);
  await page.evaluate(() => document.querySelectorAll('.hq-tut, .hq-digest, .hq-toast').forEach((e) => e.remove()));
  await page.screenshot({ path: `${OUT}/${s.name}.png` });
  if (s.pick) console.log('pick', s.name, await page.evaluate(async (pts) => {
    const THREE = await import('/node_modules/three/build/three.module.js');
    const R = window.__hq.renderer, cam = R.camera || R.scene.getObjectByProperty('isCamera', true); const rc = new THREE.Raycaster(); const out = [];
    for (const [x, y] of pts) { rc.setFromCamera(new THREE.Vector2(x, y), cam); const vis = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; }; const h = rc.intersectObjects(R.scene.children, true).find((i) => vis(i.object)); if (!h) { out.push('—'); continue; } const chain = []; for (let o = h.object; o && chain.length < 6; o = o.parent) chain.push(o.name || o.type); out.push(`${chain.join(' < ')} @${h.point.x.toFixed(1)},${h.point.y.toFixed(1)},${h.point.z.toFixed(1)} inst=${h.instanceId ?? '-'}`); }
    return out.join(' | ');
  }, s.pick));
  if (s.eval) console.log('eval', s.name, await page.evaluate(s.eval));
  if (process.env.NOSCAN) continue;
  const rows = await page.evaluate(async (R) => {
    const THREE = await import('/node_modules/three/build/three.module.js');
    const sc = window.__hq.renderer.scene, P = window.__hq.renderer.camera?.position || { x: 0, z: 0 };
    const pl = window.__hq?.player || null;
    const cx = pl?.x ?? P.x, cz = pl?.z ?? P.z;
    sc.updateMatrixWorld(true);
    const out = new Map(), v = new THREE.Vector3(), M = new THREE.Matrix4(), box = new THREE.Box3();
    const tex = (m) => { const t = m?.map?.image; return t ? Math.max(t.width || 0, t.height || 0) : 0; };
    const geoStat = (g) => { // tổng diện tích thế giới (đơn vị local) và diện tích UV
      if (g.userData.__st) return g.userData.__st;
      const p = g.attributes.position, uv = g.attributes.uv, idx = g.index; let wa = 0, ua = 0;
      const n = idx ? idx.count : p.count; const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
      const step = Math.max(3, Math.floor(n / 3 / 4000) * 3);
      for (let i = 0; i + 2 < n; i += step) {
        const i0 = idx ? idx.getX(i) : i, i1 = idx ? idx.getX(i + 1) : i + 1, i2 = idx ? idx.getX(i + 2) : i + 2;
        a.fromBufferAttribute(p, i0); b.fromBufferAttribute(p, i1); c.fromBufferAttribute(p, i2);
        wa += b.clone().sub(a).cross(c.clone().sub(a)).length() / 2;
        if (uv) { const ux = uv.getX(i1) - uv.getX(i0), uy = uv.getY(i1) - uv.getY(i0), vx = uv.getX(i2) - uv.getX(i0), vy = uv.getY(i2) - uv.getY(i0); ua += Math.abs(ux * vy - uy * vx) / 2; }
      }
      return (g.userData.__st = { wa, ua });
    };
    const add = (name, o, mw) => {
      if (!o.geometry?.attributes?.position) return;
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      box.copy(o.geometry.boundingBox).applyMatrix4(mw);
      const c = box.getCenter(v);
      const d = Math.hypot(c.x - cx, c.z - cz); if (d > R) return;
      const sz = box.getSize(new THREE.Vector3());
      const sx = new THREE.Vector3().setFromMatrixColumn(mw, 0).length(), sy = new THREE.Vector3().setFromMatrixColumn(mw, 1).length(), sz2 = new THREE.Vector3().setFromMatrixColumn(mw, 2).length();
      const sc2 = (sx * sy + sy * sz2 + sx * sz2) / 3; // ~ hệ số diện tích
      const mat = [].concat(o.material)[0], T = tex(mat), st = geoStat(o.geometry);
      const dens = T && st.wa > 0 ? Math.sqrt((st.ua * T * T) / (st.wa * sc2)) : 0;
      const nv = o.geometry.attributes.position.count, tris = (o.geometry.index ? o.geometry.index.count : nv) / 3;
      const prim = /Box|Cylinder|Sphere|Cone|Plane/.test(o.geometry.type) || nv <= 24;
      let r = out.get(name); if (!r) out.set(name, (r = { name, n: 0, w: 0, dpt: 0, h: 0, tris: 0, tex: 0, dens: [], prim: 0, near: 1e9, vc: !!o.geometry.attributes.color, mats: new Set() }));
      r.n++; r.w = Math.max(r.w, Math.max(sz.x, sz.z)); r.dpt = Math.max(r.dpt, Math.min(sz.x, sz.z)); r.h = Math.max(r.h, sz.y); r.tris += tris; r.tex = Math.max(r.tex, T);
      if (dens) r.dens.push(dens); if (prim) r.prim++; r.near = Math.min(r.near, d); if (mat?.name) r.mats.add(mat.name);
    };
    const nameOf = (o) => { let p = o; while (p) { if (p.name && !/^(Scene|Object|mesh|Mesh|node)/i.test(p.name)) return p.name; p = p.parent; } return o.type; };
    sc.traverse((o) => {
      if (!o.visible || !(o.isMesh)) return;
      let vis = true; for (let p = o; p; p = p.parent) if (!p.visible) { vis = false; break; } if (!vis) return;
      if (o.isSkinnedMesh) return;
      const nm = nameOf(o);
      if (o.isInstancedMesh) { const n = Math.min(o.count, 4000); for (let i = 0; i < n; i++) { o.getMatrixAt(i, M); M.premultiply(o.matrixWorld); add(nm, o, M); } }
      else add(nm, o, o.matrixWorld);
    });
    return [...out.values()].map((r) => ({ ...r, dens: r.dens.length ? Math.round(r.dens.sort((a, b) => a - b)[r.dens.length >> 1]) : 0, mats: [...r.mats].slice(0, 3).join(','), w: +r.w.toFixed(1), dpt: +r.dpt.toFixed(1), h: +r.h.toFixed(1), near: +r.near.toFixed(0), tris: Math.round(r.tris) })).sort((a, b) => b.h * b.w - a.h * a.w);
  }, R);
  all[s.name] = rows;
  console.log(`\n== ${s.name} (${rows.length} nhóm, R ${R} m)`);
  console.log('name | n | w×d×h | tris | tex | px/m | prim | near');
  for (const r of rows.slice(0, Number(process.env.TOP || 60))) console.log(`${r.name} | ${r.n} | ${r.w}×${r.dpt}×${r.h} | ${r.tris} | ${r.tex} | ${r.dens} | ${r.prim} | ${r.near}`);
}
writeFileSync(`${OUT}/scan.json`, JSON.stringify(all, null, 1));
await browser.close();
