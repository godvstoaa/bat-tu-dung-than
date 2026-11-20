// Xem nhanh công trình biệt phủ qua tools/bietphu.html (docs/BIET-PHU-MANIFEST.md):
//   STYLE=cungdinh,hue KIND=hall,tower,pav,gate V=persp,eye,door node scripts/bietphu-look.mjs  → output/bietphu-look/<style>-<phu|villa>-<id>-<view>.png
//   Khuôn lô lấy từ estates(): phủ của phong cách đó + biệt thự đầu tiên (nếu phong cách có khu biệt thự). VILLA=1 chỉ biệt thự, PHU=1 chỉ phủ.
//   URL mặc định http://localhost:5181 (vite dev của dự án).
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
globalThis.document ??= { baseURI: 'http://localhost/', createElement: () => ({ getContext: () => null }) };
const { estates } = await import('../src/game/mansions.js');
const OUT = process.env.OUT || 'output/bietphu-look'; mkdirSync(OUT, { recursive: true });
const styles = (process.env.STYLE || 'cungdinh').split(','), kinds = (process.env.KIND || 'hall').split(','), views = (process.env.V || 'persp,eye,door').split(',');
const L = estates().filter((m) => !m.heaven);
const jobs = [];
for (const st of styles) for (const m of [L.find((u) => u.kind === 'phu' && u.style === st), L.find((u) => u.kind === 'villa' && u.style === st)].filter(Boolean)) {
  const v = m.kind === 'villa'; if (process.env.VILLA && !v) continue; if (process.env.PHU && v) continue;
  for (const kind of kinds) {
    if (kind === 'hall') for (const b of m.layout.buildings) for (const variant of v ? [0, 1, 2] : [0]) jobs.push({ name: `${st}-${v ? `villa${variant}` : 'phu'}-${b.id}`, style: st, kind, villa: v, variant, b: { id: b.id, w: b.w, d: b.d, h: b.h, floors: b.floors, plinth: b.plinth, back: !!b.back } });
    if (kind === 'tower' && !v) for (const t of m.layout.towers || []) jobs.push({ name: `${st}-tower`, style: st, kind, b: { w: t.w, d: t.d, h: t.h } });
    if (kind === 'pav' && !v) for (const pv of m.layout.pavs) jobs.push({ name: `${st}-pav`, style: st, kind, b: { w: pv.w, d: pv.d, h: pv.h, octa: !!pv.octa } });
    if (kind === 'gate') for (const variant of v ? [0, 1, 2] : [0]) jobs.push({ name: `${st}-${v ? `villa${variant}` : 'phu'}-gate`, style: st, kind, villa: v, variant, b: { w: m.layout.gate.w, villa: v, d: 0 } });
  }
}
const br = await chromium.launch({ args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: 1280, height: 800 } });
pg.on('pageerror', (e) => console.log('pageerror', e.message)); pg.on('console', (m) => { if (m.type() === 'error') console.log('console', m.text().slice(0, 300)); });
const open = async () => { await pg.goto((process.env.URL || 'http://localhost:5181') + '/tools/bietphu.html'); await pg.waitForFunction(() => window.bpReady, null, { timeout: 60000 }); };
await open();
for (const j of jobs) for (const view of (j.kind === 'hall' ? views : views.filter((v) => v !== 'door'))) {
  // lần 1 nạp texture, chờ, lần 2 chụp. Trang có thể tải lại giữa chừng (Vite HMR khi phiên khác sửa file) → mở lại, thử tối đa 3 lần
  let r = null;
  for (let tries = 0; tries < 3 && !r; tries++) {
    try { r = await pg.evaluate(async ([j, view]) => { window.bp.render({ ...j, view }); await new Promise((res) => setTimeout(res, 700)); return window.bp.render({ ...j, view }); }, [j, view]); }
    catch (e) { console.log('  (trang tải lại — thử lại)', String(e.message).slice(0, 80)); await new Promise((res) => setTimeout(res, 1500)); await open().catch(() => {}); }
  }
  if (!r) { console.log(j.name, view, 'không chụp được'); continue; }
  if (r.err) { console.log(j.name, view, r.err); continue; }
  writeFileSync(`${OUT}/${j.name}-${view}.png`, Buffer.from(r.png.split(',')[1], 'base64'));
  console.log(j.name, view, 'tris', r.info.tris, 'bb', JSON.stringify(r.bb));
}
await br.close();
