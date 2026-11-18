// Đóng gói CÂY CỔ THỤ tải từ thư viện cộng đồng Meshy (CC0) — assets-meshy/library/tp_<loài>.glb (docs/TIEN-PHU-THUCVAT-MANIFEST.md)
// → public/models/lib_tp_<loài>.near.glb (UV + texture 1024, ~NEAR tam giác: cây trong 45 m, giữ chi tiết)
//   + .vc.glb (màu đỉnh, ~VC tam giác: 45–140 m) + .vc2.glb (màu đỉnh, ~VC2: 140–330 m) — bản xa không kéo sọc texture (meshy-vclod).
// Dùng: node scripts/meshy-pack-trees.mjs [loài…]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIB = path.join(ROOT, 'assets-meshy', 'library'), OUT = path.join(ROOT, 'public', 'models'), TMP = path.join(LIB, '.tmp');
fs.mkdirSync(TMP, { recursive: true });
const NEAR = +process.env.NEAR || 50000, VC = +process.env.VC || 12000, VC2 = +process.env.VC2 || 1600;
const cli = path.join(ROOT, 'node_modules', '@gltf-transform', 'cli', 'bin', 'cli.js'), lod = path.join(ROOT, 'scripts', 'meshy-lod.mjs'), vclod = path.join(ROOT, 'scripts', 'meshy-vclod.mjs');
const run = (args, env = {}) => execFileSync(process.execPath, ['--max-old-space-size=12000', ...args], { stdio: 'pipe', maxBuffer: 1e8, env: { ...process.env, ...env } }).toString().trim();
const want = process.argv.slice(2);
const mb = (f) => (fs.statSync(f).size / 1048576).toFixed(2);
for (const f of fs.readdirSync(LIB).filter((x) => /^tp_.*\.glb$/.test(x))) {
  const key = f.slice(3, -4); if (want.length && !want.includes(key)) continue;
  const id = `lib_tp_${key}`, src = path.join(LIB, f), t0 = Date.now();
  const tmp = path.join(TMP, `${id}.near.glb`), near = path.join(OUT, `${id}.near.glb`);
  const a = run([lod, src, tmp, `t:${NEAR}`, 'auto']);
  run([cli, 'optimize', tmp, near, '--texture-compress', 'webp', '--texture-size', '1024', '--compress', 'meshopt', '--simplify', 'false']); fs.rmSync(tmp);
  run([vclod, String(VC), id]); run([vclod, String(VC2), id], { SUFFIX: 'vc2' });
  console.log(key.padEnd(11), `near ${mb(near)} MB (${a.split('\n').pop()})`, `vc ${mb(path.join(OUT, id + '.vc.glb'))} MB`, `vc2 ${mb(path.join(OUT, id + '.vc2.glb'))} MB`, `${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
