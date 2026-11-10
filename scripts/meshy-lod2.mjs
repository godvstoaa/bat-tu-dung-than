// Mức chi tiết riêng cho nhà phố Ngoại Thành (cityblocks3d.js) — hàng nghìn bản sao:
//   <id>.lod1.glb  ~10k tam giác, texture 512 — nhà trong 55 m (đổ bóng)
//   <id>.lod2.glb  ~3k tam giác,  texture 256 — nhà 55–140 m
// Sinh từ file GỐC độ phân giải cao (assets-meshy/library/…) bằng chế độ «auto» giữ đường nối UV.
// (Bản .lod 12k có sẵn được giản lược kiểu Permissive — gộp qua đường nối UV làm texture kéo sọc,
//  nhìn như giấy bạc nhàu khi rải hàng trăm nhà; giản lược lại từ bản .lod cũng không cứu được.)
// Dùng: node scripts/meshy-lod2.mjs [id…]   (mặc định: mọi model nhà phố trong cityblocks.js)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { HOUSE_SPECS } from '../src/game/cityblocks.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'models');
const LIB = path.join(ROOT, 'assets-meshy', 'library');
const TMP = path.join(LIB, '.tmp'); fs.mkdirSync(TMP, { recursive: true });
const cli = path.join(ROOT, 'node_modules', '@gltf-transform', 'cli', 'bin', 'cli.js');
const lod = path.join(ROOT, 'scripts', 'meshy-lod.mjs');
const run = (args) => execFileSync(process.execPath, ['--max-old-space-size=12000', ...args], { stdio: 'pipe', maxBuffer: 1e8 }).toString().trim();
// file gốc: bq_<x> → library/bq/<x>.glb · lib_<x> → library/remesh/<x>.80000.glb (texture nướng lại sạch) hoặc library/<x>.glb
function source(id) {
  const name = id.replace(/^(bq|lib)_/, '');
  const cands = id.startsWith('bq_') ? [path.join(LIB, 'bq', `${name}.glb`)]
    : id.startsWith('lib_') ? [path.join(LIB, 'remesh', `${name}.300000.glb`), path.join(LIB, 'remesh', `${name}.80000.glb`), path.join(LIB, `${name}.glb`)]
    : [path.join(ROOT, 'assets-meshy', 'raw', `${id}.glb`)]; // công trình trùm (HD_IDS)
  return cands.find((f) => fs.existsSync(f)) || null;
}
// --mid: bậc giữa cho công trình / prop đặt bằng placeLod (assets.js) — 20k tam giác, texture 1024,
// thay bản .hd 300k khi đứng gần vừa phải (bản thường 80k chỉ nạp khi rất gần)
const MID = process.argv.includes('--mid');
// --far: bậc xa giữ đường nối UV (thay .lod giản lược kiểu Permissive — texture kéo sọc như giấy bạc nhàu)
const FAR = process.argv.includes('--far');
const LEVELS = MID ? [['.mid', 20000, 1024]] : FAR ? [['.far', 6000, 512]] : [['.lod1', 10000, 512], ['.lod2', 3000, 256]];
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const ids = args.length ? args : Object.keys(HOUSE_SPECS);
for (const id of ids) {
  const src = source(id);
  if (!src) { console.log(`✗ ${id}: thiếu file gốc`); continue; }
  for (const [suf, tris, tex] of LEVELS) {
    const t = path.join(TMP, `${id}${suf}.glb`), dst = path.join(OUT, `${id}${suf}.glb`);
    console.log(run([lod, src, t, `t:${tris}`, 'auto']));
    run([cli, 'optimize', t, dst, '--texture-compress', 'webp', '--texture-size', String(tex), '--compress', 'meshopt', '--simplify', 'false']);
    fs.rmSync(t);
    console.log(`  ${id}${suf}.glb ${(fs.statSync(dst).size / 1024).toFixed(0)} KB`);
  }
}
