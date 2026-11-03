// Nén GLB Meshy cho điện thoại: texture ≤ 1024 WebP + nén hình học meshopt + bỏ dữ liệu thừa.
// assets-meshy/raw/<id>.glb → public/models/<id>.glb. Chạy: node scripts/meshy-pack.mjs [id…]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = path.join(ROOT, 'assets-meshy', 'raw');
const OUT = path.join(ROOT, 'public', 'models');
fs.mkdirSync(OUT, { recursive: true });
const cli = path.join(ROOT, 'node_modules', '@gltf-transform', 'cli', 'bin', 'cli.js');
const ids = process.argv.slice(2);
const files = fs.readdirSync(RAW).filter((f) => f.endsWith('.glb') && !f.includes('.lodtmp') && (!ids.length || ids.includes(f.replace('.glb', ''))));
const report = [];
const HD = new Set(['palace_grand', 'tower_nine', 'sect_gate_grand', 'cliff_palace', 'city_gate', 'sky_palace']);
const opt = (src, dst, args) => execFileSync(process.execPath, [cli, 'optimize', src, dst, ...args], { stdio: 'pipe' });
const mb = (f) => (fs.statSync(f).size / 1048576).toFixed(2);
for (const f of files) {
  const id = f.replace('.glb', '');
  const src = path.join(RAW, f), dst = path.join(OUT, f);
  const isChar = /^(hero|master|npc)/.test(f);
  if (HD.has(id)) {
    // công trình trùm: 3 bản — hd (2048, máy mạnh), thường (1024), lod (giản lược ~12%, texture 512, nhìn từ xa)
    const hd = path.join(OUT, `${id}.hd.glb`), lod = path.join(OUT, `${id}.lod.glb`);
    opt(src, hd, ['--texture-compress', 'webp', '--texture-size', '2048', '--compress', 'meshopt', '--simplify-error', '0.0004']);
    opt(src, dst, ['--texture-compress', 'webp', '--texture-size', '1024', '--compress', 'meshopt', '--simplify-error', '0.0008']);
    const tmp = path.join(RAW, `${id}.lodtmp.glb`);
    execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'meshy-lod.mjs'), src, tmp, '0.1'], { stdio: 'pipe' });
    opt(tmp, lod, ['--texture-compress', 'webp', '--texture-size', '512', '--compress', 'meshopt', '--simplify', 'false']);
    fs.rmSync(tmp);
    report.push(`${f}: ${mb(src)} MB → hd ${mb(hd)} · ${mb(dst)} · lod ${mb(lod)} MB`);
    continue;
  }
  // nhân vật có xương: không simplify (giữ trọng số skin), texture 1024; kiến trúc: texture 1024
  // tượng thần: vật nhìn cận cảnh trong điện → texture 2048
  const tex = f.startsWith('deity_') ? '2048' : '1024';
  opt(src, dst, ['--texture-compress', 'webp', '--texture-size', tex, '--compress', 'meshopt', ...(isChar ? ['--simplify', 'false'] : ['--simplify-error', '0.0008'])]);
  report.push(`${f}: ${mb(src)} MB → ${mb(dst)} MB`);
}
console.log(report.join('\n') || 'Không có file trong assets-meshy/raw');
