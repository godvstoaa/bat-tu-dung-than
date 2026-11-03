// Dựng lại lưới bằng Meshy Remesh API (giữ texture, không kéo sọc như giản lược tại chỗ).
// Dùng: node scripts/meshy-remesh.mjs <tên> <số mặt đích> [model_url]
//   model_url mặc định lấy từ assets-meshy/library/links.json (link GLB ký sẵn của thư viện).
// Kết quả: assets-meshy/library/remesh/<tên>.<số mặt>.glb · khoá API đọc từ .env.meshy (không lên git).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIB = path.join(ROOT, 'assets-meshy', 'library');
const OUT = path.join(LIB, 'remesh'); fs.mkdirSync(OUT, { recursive: true });
const KEY = (fs.readFileSync(path.join(ROOT, '.env.meshy'), 'utf8').match(/MESHY_API_KEY\s*=\s*(\S+)/) || [])[1];
if (!KEY) throw new Error('Thiếu MESHY_API_KEY trong .env.meshy');
const [name, targetArg, urlArg] = process.argv.slice(2);
const target = Number(targetArg) || 80000;
const url = urlArg || JSON.parse(fs.readFileSync(path.join(LIB, 'links.json'), 'utf8'))[name];
if (!url) throw new Error(`Không có link cho ${name}`);
const api = async (method, p, body) => {
  const r = await fetch(`https://api.meshy.ai${p}`, { method, headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${r.status} ${JSON.stringify(j).slice(0, 300)}`);
  return j;
};
const dst = path.join(OUT, `${name}.${target}.glb`);
if (fs.existsSync(dst)) { console.log(`${name}: đã có ${path.basename(dst)}`); process.exit(0); }
// gói tài khoản giới hạn số tác vụ đang chờ → gặp 429 thì đợi rồi gửi lại
let id;
for (let tries = 0; !id; tries++) {
  try { ({ result: id } = await api('POST', '/openapi/v1/remesh', { model_url: url, topology: 'triangle', target_polycount: target, target_formats: ['glb'] })); }
  catch (e) { if (!String(e.message).startsWith('429') || tries > 90) throw e; await new Promise((r) => setTimeout(r, 20000)); }
}
console.log(`${name}: remesh ${id}`);
let t;
for (;;) {
  await new Promise((r) => setTimeout(r, 8000));
  t = await api('GET', `/openapi/v1/remesh/${id}`);
  if (t.status === 'SUCCEEDED' || t.status === 'FAILED' || t.status === 'CANCELED') break;
}
if (t.status !== 'SUCCEEDED') throw new Error(`${name}: ${t.status} ${t.task_error?.message || ''}`);
const glb = t.model_urls?.glb;
fs.writeFileSync(dst, Buffer.from(await (await fetch(glb)).arrayBuffer()));
console.log(`${name}: ✓ ${(fs.statSync(dst).size / 1048576).toFixed(1)} MB · credit ${t.consumed_credits ?? '?'} · textures ${JSON.stringify(t.texture_urls || []).slice(0, 120)}`);
