// Vẽ vùng mắt (EYES_RAW trong characters.js) lên texture gốc: output/nhanvat/eyes/tex-<id>.png — kiểm đo mắt
import fs from 'node:fs'; import sharp from 'sharp';
const src = fs.readFileSync('src/game/characters.js', 'utf8');
const E = eval('(' + src.slice(src.indexOf('const EYES_RAW = ') + 17, src.indexOf('};', src.indexOf('const EYES_RAW')) + 1) + ')');
for (const id of process.argv.slice(2)) {
  const bf = fs.readFileSync(`public/models/${id}.hd.glb`), jl = bf.readUInt32LE(12), j = JSON.parse(bf.slice(20, 20 + jl));
  const bin = bf.slice(20 + jl + 8), tex = j.materials[0].pbrMetallicRoughness.baseColorTexture.index, im = j.images[j.textures[tex].extensions?.EXT_texture_webp?.source ?? j.textures[tex].source];
  const bv = j.bufferViews[im.bufferView], img = bin.slice(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength);
  const meta = await sharp(img).metadata(), W = meta.width, H = meta.height;
  let svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">`; let box = [1, 1, 0, 0];
  for (const [cx, cy, ax, ay, bx, by, lift = 0, sc = 1] of E[id]) {
    const P = (u, v) => [u * W, v * H];
    const pts = []; for (let t = 0; t < 32; t++) { const a = t / 32 * Math.PI * 2, x = Math.cos(a) * 1.3 * sc, y = Math.sin(a) * 1.7 * sc; pts.push(P(cx + ax * x + bx * y, cy + ay * x + by * y).join(',')); }
    svg += `<polygon points="${pts.join(' ')}" fill="none" stroke="lime" stroke-width="1"/>`;
    for (const k of [-1, 0, 1]) { const [x, y] = P(cx + ax * k * 0.8 - bx * (1.8 + lift), cy + ay * k * 0.8 - by * (1.8 + lift)); svg += `<circle cx="${x}" cy="${y}" r="2" fill="red"/>`; }
    const [x0, y0] = P(cx, cy); svg += `<circle cx="${x0}" cy="${y0}" r="2" fill="cyan"/>`;
    box = [Math.min(box[0], cx), Math.min(box[1], cy), Math.max(box[2], cx), Math.max(box[3], cy)];
  }
  svg += '</svg>';
  const pad = 0.03, L = Math.max(0, Math.floor((box[0] - pad) * W)), T = Math.max(0, Math.floor((box[1] - pad) * H));
  const w = Math.min(W - L, Math.ceil((box[2] - box[0] + 2 * pad) * W)), h = Math.min(H - T, Math.ceil((box[3] - box[1] + 2 * pad) * H));
  const comp = await sharp(img).composite([{ input: Buffer.from(svg) }]).png().toBuffer();
  await sharp(comp).extract({ left: L, top: T, width: w, height: h }).resize({ width: 700, kernel: 'nearest' }).toFile(`output/nhanvat/eyes/tex-${id}.png`);
  console.log(id, W, H, 'crop', L, T, w, h);
}
