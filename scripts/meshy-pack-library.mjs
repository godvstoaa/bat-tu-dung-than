// Đóng gói model tải từ thư viện cộng đồng Meshy (CC0) — assets-meshy/library/<id>.glb → public/models/
// Model thư viện rất nặng (1–10 triệu tam giác) → 3 bản: <id>.hd.glb (~300k, tex 2048, máy mạnh),
// <id>.glb (~80k, tex 1024, điện thoại), <id>.lod.glb (~12k, tex 512, nhìn xa). Dùng: node scripts/meshy-pack-library.mjs [id…]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// --set bq: model thành Bát Quái (assets-meshy/library/bq/<tên>.glb → public/models/bq_<tên>*.glb)
const SET = process.argv.includes('--set') ? process.argv[process.argv.indexOf('--set') + 1] : '';
const LIB = path.join(ROOT, 'assets-meshy', 'library', SET);
const PREFIX = SET ? `${SET}_` : 'lib_';
const OUT = path.join(ROOT, 'public', 'models');
const TMP = path.join(LIB, '.tmp'); fs.mkdirSync(TMP, { recursive: true });
const cli = path.join(ROOT, 'node_modules', '@gltf-transform', 'cli', 'bin', 'cli.js');
const lod = path.join(ROOT, 'scripts', 'meshy-lod.mjs');
const NODE = [process.execPath, '--max-old-space-size=12000'];
const run = (args) => execFileSync(NODE[0], [NODE[1], ...args], { stdio: 'pipe', maxBuffer: 1e8 });
const mb = (f) => (fs.statSync(f).size / 1048576).toFixed(2);
// hd + thường giữ đường nối UV (texture sạch); lod gộp mạnh — chỉ thấy khi rất xa
const LEVELS = [['.hd', 300000, 2048, 'auto'], ['', 80000, 1024, 'auto'], ['.lod', 12000, 512, '']];
const ids = process.argv.slice(2).filter((a, i, all) => a !== '--set' && all[i - 1] !== '--set');
for (const f of fs.readdirSync(LIB).filter((x) => x.endsWith('.glb') && (!ids.length || ids.includes(x.replace('.glb', ''))))) {
  const id = PREFIX + f.replace('.glb', '');
  const src = path.join(LIB, f);
  const out = [];
  for (const [suf, tris, tex, mode] of LEVELS) {
    const t = path.join(TMP, `${id}${suf}.glb`), dst = path.join(OUT, `${id}${suf}.glb`);
    // có bản Meshy Remesh (scripts/meshy-remesh.mjs, texture nướng lại sạch) thì dùng thẳng; bản lod giản lược từ bản remesh 80k
    const rm = path.join(LIB, 'remesh', `${f.replace('.glb', '')}.${tris}.glb`);
    const rm80 = path.join(LIB, 'remesh', `${f.replace('.glb', '')}.80000.glb`);
    if (fs.existsSync(rm)) fs.copyFileSync(rm, t);
    else console.log(run([lod, suf === '.lod' && fs.existsSync(rm80) ? rm80 : src, t, `t:${tris}`, mode]).toString().trim());
    run([cli, 'optimize', t, dst, '--texture-compress', 'webp', '--texture-size', String(tex), '--compress', 'meshopt', '--simplify', 'false']);
    fs.rmSync(t);
    out.push(`${suf || 'base'} ${mb(dst)} MB`);
  }
  console.log(`${id}: ${mb(src)} MB → ${out.join(' · ')}`);
}
