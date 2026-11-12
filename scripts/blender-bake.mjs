// ============================================================================
//  NƯỚNG BẢN NHẸ CHO MODEL NHÀ / TIỆM BẰNG BLENDER (docs/DOHOA-MANIFEST.md §3.1)
//    mỗi model: Blender (scripts/blender/bake-lod.py) → gltf-transform nén meshopt + WebP → public/models/<id>.bk.glb
//    + ảnh so sánh gốc / .bk (scripts/blender/compare.py) → shots/gfx/bk/<id>.png
//  Chạy:  node scripts/blender-bake.mjs [id …]      (mặc định: mọi model HOUSE_SPECS)
//  BLENDER=<đường dẫn blender.exe>  TRIS=12000  TEX=1024  JOBS=4  VOX=0.0035 (cỡ voxel / cỡ model; nhỏ hơn = giữ chi tiết mảnh hơn)  MODE=voxel (ép dựng lại lưới bằng voxel)
// ============================================================================
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, statSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { HOUSE_SPECS } from '../src/game/cityblocks.js';

const BLENDER = process.env.BLENDER || 'C:/tools/blender/blender-5.2.4-windows-x64/blender.exe';
const TRIS = Number(process.env.TRIS || 12000), TEX = Number(process.env.TEX || 1024), JOBS = Number(process.env.JOBS || 4), VOX = process.env.VOX || '0.0035', MODE = process.env.MODE || 'auto';
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(HOUSE_SPECS);
const ROOT = resolve('.'), TMP = join(tmpdir(), 'hq-bake'), SHOTS = join(ROOT, 'shots/gfx/bk');
mkdirSync(TMP, { recursive: true }); mkdirSync(SHOTS, { recursive: true });
const cli = resolve('node_modules/@gltf-transform/cli/bin/cli.js');

const run = (args) => new Promise((ok, bad) => {
  const p = spawn(BLENDER, ['-b', '--factory-startup', ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
  let out = ''; p.stdout.on('data', (d) => { out += d; }); p.stderr.on('data', (d) => { out += d; });
  p.on('close', (c) => (c === 0 ? ok(out) : bad(new Error(`blender thoát ${c}\n${out.slice(-1500)}`))));
});

async function one(id) {
  const src = join(ROOT, 'public/models', `${id}.glb`), raw = join(TMP, `${id}.raw.glb`), dst = join(ROOT, 'public/models', `${id}.bk.glb`);
  const log = await run(['-P', 'scripts/blender/bake-lod.py', '--', src, raw, String(TRIS), String(TEX), '0.55', VOX, MODE]);
  const info = JSON.parse(log.match(/BAKE (\{.*\})/)[1]);
  execFileSync(process.execPath, [cli, 'optimize', raw, dst, '--compress', 'meshopt', '--texture-compress', 'webp', '--simplify', 'false', '--join', 'false', '--instance', 'false', '--flatten', 'false'], { stdio: 'pipe' });
  await run(['-P', 'scripts/blender/compare.py', '--', join(SHOTS, `${id}.png`), src, raw]);
  rmSync(raw, { force: true });
  return { id, tri: `${info.tri_hi}→${info.tri_lo}`, kb: Math.round(statSync(dst).size / 1024), origKb: Math.round(statSync(src).size / 1024), sec: info.sec };
}

const queue = ids.filter((id) => existsSync(join(ROOT, 'public/models', `${id}.glb`)));
const res = [], fails = [];
await Promise.all(Array.from({ length: JOBS }, async () => {
  for (let id = queue.shift(); id; id = queue.shift()) {
    try { const r = await one(id); res.push(r); console.log(`✓ ${r.id} ${r.tri} tam giác · ${r.origKb} KB → ${r.kb} KB · ${r.sec}s`); }
    catch (e) { fails.push(id); console.log(`✗ ${id}: ${e.message.split('\n').slice(0, 6).join(' | ')}`); }
  }
}));
console.log(`xong ${res.length}/${ids.length}; tổng ${res.reduce((a, r) => a + r.kb, 0)} KB${fails.length ? '; lỗi: ' + fails.join(' ') : ''}`);
