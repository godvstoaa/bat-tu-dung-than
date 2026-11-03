// Chạy worker + Durable Object Huyền Quán cục bộ (wrangler dev) — `npm run dev:mmo`.
// Vì sao không chạy thẳng `wrangler dev` trong repo: workerd trên Windows sập khi thư mục
// làm việc (.wrangler/tmp, state) nằm dưới đường dẫn có dấu («app bói toán»). Script này
// dựng cấu hình tạm trong thư mục ASCII (os.tmpdir()) trỏ ngược về worker/ và dist/ của repo.
// workerd còn sập nếu main/assets trỏ vào đường dẫn có dấu → tự tạo junction ASCII trỏ về repo.
// Cổng mặc định 8788 (8787 hay bị dịch vụ khác chiếm); vite dev proxy /ws → 8788 (vite.config.js).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = process.argv[2] || '8788';
const dir = path.join(os.tmpdir(), 'huyenquan-mmo-dev');
fs.mkdirSync(dir, { recursive: true });

// Đọc wrangler.jsonc (bỏ chú thích //) để giữ đồng bộ binding với cấu hình thật.
const raw = fs.readFileSync(path.join(ROOT, 'wrangler.jsonc'), 'utf8').replace(/^\s*\/\/.*$/gm, '');
const cfg = JSON.parse(raw);
const fwd = (p) => p.split(path.sep).join('/');
let base = ROOT;
if (/[^\x00-\x7f]/.test(ROOT)) {
  base = path.join(os.tmpdir(), 'huyenquan-repo');
  if (!fs.existsSync(path.join(base, 'package.json'))) {
    try { fs.rmSync(base, { recursive: false, force: true }); } catch (e) { /* chưa có */ }
    fs.symlinkSync(ROOT, base, 'junction');
  }
}
cfg.main = fwd(path.join(base, cfg.main));
if (cfg.assets) cfg.assets.directory = fwd(path.join(base, cfg.assets.directory));
if (!fs.existsSync(cfg.assets?.directory || '')) console.warn('[dev-mmo] chưa có dist/ — chạy `npm run build` trước nếu cần phục vụ trang.');
fs.writeFileSync(path.join(dir, 'wrangler.jsonc'), JSON.stringify(cfg, null, 2));

// gọi thẳng JS của wrangler bằng node (không qua shell — đường dẫn repo có khoảng trắng)
const bin = path.join(ROOT, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
console.log(`[dev-mmo] ${dir} → ws://127.0.0.1:${port}/ws/quan`);
const child = spawn(process.execPath, [bin, 'dev', '--port', port, '--ip', '127.0.0.1'], { cwd: dir, stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
