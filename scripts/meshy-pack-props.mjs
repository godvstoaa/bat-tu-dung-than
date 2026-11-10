// Đóng gói prop đồ đạc (assets-meshy/library/pr/<id>.glb) → public/models/pr_<id>.glb: ~6k tam giác, texture 512.
// Dùng: node scripts/meshy-pack-props.mjs [id…]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIB = path.join(ROOT, 'assets-meshy', 'library', 'pr'), OUT = path.join(ROOT, 'public', 'models'), TMP = path.join(ROOT, 'assets-meshy', 'library', '.tmp');
fs.mkdirSync(TMP, { recursive: true });
const cli = path.join(ROOT, 'node_modules', '@gltf-transform', 'cli', 'bin', 'cli.js'), lod = path.join(ROOT, 'scripts', 'meshy-lod.mjs');
const run = (a) => execFileSync(process.execPath, ['--max-old-space-size=12000', ...a], { stdio: 'pipe', maxBuffer: 1e8 }).toString().trim();
const ids = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(LIB).filter((f) => f.endsWith('.glb')).map((f) => f.slice(0, -4));
for (const id of ids) {
  const t = path.join(TMP, `pr_${id}.glb`), dst = path.join(OUT, `pr_${id}.glb`);
  console.log(run([lod, path.join(LIB, `${id}.glb`), t, 't:6000', 'auto']));
  run([cli, 'optimize', t, dst, '--texture-compress', 'webp', '--texture-size', '512', '--compress', 'meshopt', '--simplify', 'false']);
  fs.rmSync(t);
  console.log(`  pr_${id}.glb ${(fs.statSync(dst).size / 1024).toFixed(0)} KB`);
}
