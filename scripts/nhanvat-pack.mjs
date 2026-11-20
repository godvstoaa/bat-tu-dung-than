// Đóng gói nhân vật Meshy cộng đồng (CC0) + thư viện động tác ghép (docs/NHAN-VAT-MESHY-MANIFEST.md):
//   node scripts/nhanvat-pack.mjs [id …]        (không id = tất cả)   OUTDIR=… để thử ra thư mục khác
// 1) trình duyệt (tools/nhanvat.html): ghép từng clip nguồn sang xương model mới theo KHÔNG GIAN THẾ GIỚI, bù tư thế nghỉ T↔A
// 2) gltf-transform: giản lược giữ trọng số da tới TRIS; bản thường texture 1024, bản .hd 2048 (cùng lưới / UV)
// Bản cũ giữ ở assets-meshy/library/chars/old/ để quay lại.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
const gio = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const ROOT = process.cwd(), LIB = path.join(ROOT, 'assets-meshy', 'library', 'chars'), MOD = path.join(ROOT, 'public', 'models');
const OUT = process.env.OUTDIR ? path.resolve(process.env.OUTDIR) : MOD;
fs.mkdirSync(path.join(LIB, 'old'), { recursive: true });
for (const id of ['hero_m', 'hero_f', 'master', 'npc_villager', 'npc_merchant']) for (const s of ['', '.hd']) { const f = path.join(MOD, `${id}${s}.glb`), o = path.join(LIB, 'old', `${id}${s}.glb`); if (fs.existsSync(f) && !fs.existsSync(o)) fs.copyFileSync(f, o); }
const L = (f) => '/assets-meshy/library/chars/' + f;
const OM = L('old/hero_m.glb'), OF = L('old/hero_f.glb'), A76 = L('cA76_namlam.glb'), W19 = L('c19_woman.glb'), A71 = L('cA71_daosixam.glb');
const base = (o, walk, sit) => [['idle', o, 'Idle'], ['walk', o, walk], ['run', o, 'Run_02'], ['sit', o, sit], ['bow', o, 'Formal_Bow'], ['wave', o, 'Wave_One_Hand']];
const BASE_M = base(OM, 'Casual_Walk', 'Chair_Sit_Idle_M'), BASE_F = base(OF, 'Walking_Woman', 'Chair_Sit_Idle_F');
// thư viện biến thể (động tác Meshy mà tác giả bài đăng đã gắn sẵn) — mỗi NPC bốc ngẫu nhiên, không ai lặp ai
const EXTRA = [['idle2', A76, 'Idle_02'], ['idle3', A76, 'Idle_03'], ['chat', W19, 'Stand_and_Chat'], ['drink', W19, 'Stand_and_Drink'], ['talk', A76, 'Talk_Passionately'],
  ['look', A76, 'Alert'], ['pick', A76, 'Collect_Object'], ['hello', A71, 'Big_Wave_Hello'], ['walk2', W19, 'Thoughtful_Walk'], ['walk3', W19, 'Walk_Slowly_and_Look_Around']];
// đợt 2 (2026-11-19): preset Meshy (web app, 0 credit; assets-meshy/library/chars/preset/, giấy phép cc0) — file riêng <id>.anim.glb,
// tải SAU khi vào game (không tăng tải đầu). Chọn theo bảng ảnh output/nhanvat/preset/sheet.jpg (bỏ thế võ, động tác cần ghế / đạo cụ).
const PR = (as, n, opt) => (opt ? [as, 'preset:' + n, n, opt] : [as, 'preset:' + n, n]);
const ANIM_IDLE = [PR('idle4', 'Idle_3'), PR('idle5', 'Idle_4'), PR('idle6', 'Idle_6'), PR('idle7', 'Idle_7'), PR('breathe', 'Long_Breathe_and_Look_Around'), PR('breathe2', 'Short_Breathe_and_Look_Around'), PR('sway', 'Happy_Sway_Standing')];
const ANIM_GEST = [PR('agree', 'Agree_Gesture'), PR('scratch', 'Confused_Scratch'), PR('hip', 'Hand_on_Hip_Gesture'), PR('listen', 'Listening_Gesture'), PR('shrug', 'Shrug'), PR('pickup', 'Male_Bend_Over_Pick_Up')];
const ANIM_WALK = [PR('walk5', 'Discuss_While_Moving')], ANIM_OLD = [PR('walk4', 'Elderly_Shaky_Walk')];
const ANIM = [...ANIM_IDLE, ...ANIM_GEST, ...ANIM_WALK];
const OMS = L('old/master.glb'), OV = L('old/npc_villager.glb'), OME = L('old/npc_merchant.glb');
export const ROLES = {
  hero_m: { src: A76, tris: 40000, clips: [...BASE_M, ...EXTRA] },
  // c19: tay áo rộng bị kéo thành mảng khi giơ tay → bỏ cúi chào / vẫy / vươn vai / nói hăng / nhặt đồ (ảnh output/nhanvat/test/hero_f-clips.jpg)
  // 2026-11-19: cúi chào giữ tay như lúc đứng (arms 0), vẫy tay giảm biên độ (arms 0,45) — tay áo không bị kéo (ảnh output/nhanvat/test/hero_f-chao.jpg)
  hero_f: { src: W19, tris: 30000, err: 0.05, lod: 8000, lodVc: true, clips: [...BASE_F.map((x) => (x[0] === 'bow' ? [...x, { arms: 0 }] : x[0] === 'wave' ? [...x, { arms: 0.45 }] : x)), ...EXTRA].filter((x) => !['idle3', 'talk', 'hello', 'pick'].includes(x[0])) },
  master: { src: L('old/master.hd.glb'), tris: 40000, lodVc: true, clips: [['idle', OMS, 'Idle'], ['sit', OMS, 'Chair_Sit_Idle_M'], ['bow', OMS, 'Formal_Bow'], ['walk', OM, 'Casual_Walk'], ...EXTRA.filter((x) => !['pick', 'look'].includes(x[0]))] },
  npc_villager: { src: L('old/npc_villager.hd.glb'), tris: 40000, lodVc: true, clips: [['idle', OV, 'Idle'], ['wave', OV, 'Wave_One_Hand'], ['walk', OV, 'Casual_Walk'], ['bow', OM, 'Formal_Bow'], ['sit', OF, 'Chair_Sit_Idle_F'], ...EXTRA] },
  npc_merchant: { src: L('old/npc_merchant.hd.glb'), tris: 40000, clips: [['idle', OME, 'Idle'], ['bow', OME, 'Formal_Bow'], ['walk', OME, 'Casual_Walk'], ['wave', OM, 'Wave_One_Hand'], ['sit', OM, 'Chair_Sit_Idle_M'], ...EXTRA] },
  npc_lao: { src: L('c276_laonong.glb'), tris: 40000, clips: [...BASE_M, ...EXTRA] },
  npc_ba: { src: L('cA80_balao.glb'), tris: 40000, clips: [...BASE_F, ...EXTRA] },
  npc_nu: { src: L('cA88_nubacha.glb'), tris: 40000, clips: [...BASE_F, ...EXTRA].filter((x) => x[0] !== 'pick') }, // ngồi xổm: váy toé
};
for (const [id, R] of Object.entries(ROLES)) R.anim = id === 'hero_f' ? [...ANIM_IDLE, ...ANIM_WALK] // tay áo rộng: bỏ cử chỉ giơ tay
  // Thầy: giữ phong thái — bỏ đung đưa / nhún vai / gãi đầu / chống hông / cúi nhặt / đi run (ảnh output/nhanvat/preset/master.jpg)
  : id === 'master' ? [...ANIM_IDLE.filter((x) => x[0] !== 'sway'), PR('agree', 'Agree_Gesture'), PR('listen', 'Listening_Gesture')]
  : [...ANIM, ...(/npc_lao|npc_ba/.test(id) ? ANIM_OLD : []), ...(id === 'npc_merchant' ? [PR('rub', 'Scheming_Hand_Rub')] : [])];
const ANIM_ONLY = process.argv.includes('--anim'); // chỉ sinh <id>.anim.glb (động tác thêm, tải muộn)
const LOD_ONLY = process.argv.includes('--lod-only'); // chỉ sinh lại bản xa từ output/nhanvat/pack/<id>.raw.glb đã có
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const ids = args.length ? args : Object.keys(ROLES);
const tmpDir = path.join(ROOT, 'output', 'nhanvat', 'pack'); fs.mkdirSync(tmpDir, { recursive: true }); fs.mkdirSync(OUT, { recursive: true });
const cli = path.join(ROOT, 'node_modules', '@gltf-transform', 'cli', 'bin', 'cli.js');
const run = (...a) => execFileSync(process.execPath, [cli, ...a], { stdio: 'pipe' }).toString();
const glbTris = (f) => { const bf = fs.readFileSync(f), j = JSON.parse(bf.slice(20, 20 + bf.readUInt32LE(12)).toString()); let t = 0; for (const m of j.meshes || []) for (const pr of m.primitives) t += (pr.indices != null ? j.accessors[pr.indices].count : j.accessors[pr.attributes.POSITION].count) / 3; return Math.round(t); };
// bản xa (docs/NHAN-VAT-MESHY-MANIFEST.md §9): cùng xương + clip, texture 512.
// giản lược THƯỜNG (giữ UV, sai số 0,05). KHÔNG dùng sloppy (2026-11-19: sloppy nối tam giác qua mảnh UV → áo loang như cẩm thạch,
// ảnh output/nhanvat/lodcmp/gan-xa.jpg). Model UV vụn (R.lodVc) → màu nướng vào đỉnh (scripts/nhanvat-vclod.mjs), bỏ UV.
function makeLod(id, R) {
  const raw = path.join(tmpDir, `${id}.raw.glb`), a = path.join(tmpDir, `${id}.lodA.glb`);
  const want = R.lod || 4000, t0 = glbTris(raw);
  if (R.lodVc) execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'nhanvat-vclod.mjs'), raw, a, String(want)], { stdio: 'pipe' });
  else run('simplify', raw, a, '--ratio', String(Math.min(1, want / t0)), '--error', '0.05');
  const t1 = glbTris(a);
  const dst = path.join(OUT, `${id}.lod.glb`), rs = path.join(tmpDir, `${id}.lodR.glb`);
  // hoạt ảnh chiếm ~70 % file: gộp khoá gần nhau (sai số 0,002 / thành phần ≈ 0,25° mỗi xương) — 600 → ~380 KB
  run('resample', a, rs, '--tolerance', '0.002');
  run('optimize', rs, dst, '--texture-compress', 'webp', '--texture-size', '512', '--compress', 'meshopt', '--simplify', 'false');
  console.log(`  ${id}.lod: ${t0} → ${t1}${R.lodVc ? ' (màu đỉnh)' : ''} tg · ${(fs.statSync(dst).size / 1e6).toFixed(2)} MB`);
}
// <id>.anim.glb: chỉ nút xương + clip (bỏ lưới / da / vật liệu), gộp khoá gần nhau, nén meshopt
async function makeAnim(id, R, b) {
  const p = await b.newPage(); await p.goto('http://localhost:5180/tools/nhanvat.html'); await p.waitForFunction(() => window.nvReady);
  const r = await p.evaluate(([s, c]) => window.nv.pack(s, c), [R.src, R.anim]); await p.close();
  const raw = path.join(tmpDir, `${id}.animraw.glb`), a = path.join(tmpDir, `${id}.animA.glb`), rs = path.join(tmpDir, `${id}.animR.glb`), dst = path.join(OUT, `${id}.anim.glb`);
  fs.writeFileSync(raw, Buffer.from(r.b64, 'base64'));
  const doc = await gio.read(raw), root = doc.getRoot();
  for (const n of root.listNodes()) { n.setMesh(null); n.setSkin(null); }
  for (const x of [...root.listMeshes(), ...root.listSkins(), ...root.listMaterials(), ...root.listTextures()]) x.dispose();
  const { prune } = await import('@gltf-transform/functions'); await doc.transform(prune({ keepLeaves: true }));
  await gio.write(a, doc);
  run('resample', a, rs, '--tolerance', '0.002');
  run('optimize', rs, dst, '--compress', 'meshopt', '--simplify', 'false', '--join', 'false', '--instance', 'false', '--flatten', 'false', '--prune', 'false');
  console.log(`  ${id}.anim: ${r.clips.length} clip · ${(fs.statSync(dst).size / 1e6).toFixed(2)} MB${r.miss.length ? ' · THIẾU ' + r.miss.join(',') : ''}`);
}
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--js-flags=--max-old-space-size=8000'] });
for (const id of ids) {
  const R = ROLES[id]; if (!R) { console.log('bỏ id lạ', id); continue; }
  if (LOD_ONLY) { makeLod(id, R); continue; }
  if (ANIM_ONLY) { await makeAnim(id, R, b); continue; }
  const p = await b.newPage(); await p.goto('http://localhost:5180/tools/nhanvat.html'); await p.waitForFunction(() => window.nvReady);
  const r = await p.evaluate(([s, c]) => window.nv.pack(s, c), [R.src, R.clips]); await p.close();
  const raw = path.join(tmpDir, `${id}.raw.glb`); fs.writeFileSync(raw, Buffer.from(r.b64, 'base64'));
  const tris = glbTris(raw), ratio = Math.min(1, R.tris / tris), simp = path.join(tmpDir, `${id}.simp.glb`);
  if (ratio < 1) run('simplify', raw, simp, '--ratio', String(ratio), '--error', String(R.err || 0.01)); else fs.copyFileSync(raw, simp);
  const sizes = [];
  // bản gần / .hd không mang clip: characters.js gắn lưới gần vào bộ xương + clip của bản xa (.lod)
  const near = path.join(tmpDir, `${id}.near.glb`); { const doc = await gio.read(simp); for (const a of doc.getRoot().listAnimations()) a.dispose(); await gio.write(near, doc); }
  for (const [suf, px] of [['', 1024], ['.hd', 2048]]) {
    const dst = path.join(OUT, `${id}${suf}.glb`);
    // --simplify false: đã giản lược ở trên; nén hoạt ảnh (resample) giữ khoá cần thiết
    run('optimize', near, dst, '--texture-compress', 'webp', '--texture-size', String(px), '--compress', 'meshopt', '--simplify', 'false');
    sizes.push((fs.statSync(dst).size / 1e6).toFixed(2));
  }
  makeLod(id, R);
  console.log(`${id}: ${tris} → ${glbTris(simp)} tg · ${sizes.join(' / ')} MB · ${r.clips.length} clip ${r.clips.join(' ')}${r.miss.length ? ' · THIẾU ' + r.miss.join(',') : ''}`);
}
await b.close();
