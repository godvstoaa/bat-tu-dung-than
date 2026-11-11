// ============================================================================
//  BẢN XA KHÔNG VỠ (<id>.vc.glb) — màu texture «nướng» vào ĐỈNH của mesh gốc rồi giản lược.
//  Vì sao: mesh Meshy tách đỉnh theo đường nối UV rất vụn → giản lược giữ UV dừng ở ~100k tam giác; ép xuống 3–20k
//  (bản .lod/.lod1/.lod2/.far/.mid cũ) phải gộp qua đường nối → texture kéo sọc, hình vỡ mảnh (ảnh người chơi 2026-11-11).
//  Bỏ hẳn UV: hàn đỉnh theo vị trí (không còn đường nối) → giản lược sạch; màu lấy mẫu từ texture (đã thu nhỏ = lọc trung bình).
//  Nhìn từ 30 m trở ra không thấy khác texture, mà không có mảnh vỡ.
//  Dùng: node scripts/meshy-vclod.mjs [tam_giác_đích=9000] [id…]   (mặc định: mọi model nhà phố cityblocks.HOUSE_SPECS)
//        SUFFIX=vc2 node scripts/meshy-vclod.mjs 2500   → <id>.vc2.glb cho nhà rất xa (thay khối hộp)
//  Giải mã ảnh texture bằng Chromium (Playwright) — máy dev không có sharp.
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize, normals } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import { chromium } from 'playwright';
import { HOUSE_SPECS } from '../src/game/cityblocks.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'models'), LIB = path.join(ROOT, 'assets-meshy', 'library'), TMP = path.join(LIB, '.tmp');
fs.mkdirSync(TMP, { recursive: true });
const cli = path.join(ROOT, 'node_modules', '@gltf-transform', 'cli', 'bin', 'cli.js');
const args = process.argv.slice(2);
const target = Number(args[0]) > 0 ? Number(args.shift()) : 9000;
const ids = args.length ? args : Object.keys(HOUSE_SPECS);
function source(id) {
  const name = id.replace(/^(bq|lib)_/, '');
  const c = id.startsWith('bq_') ? [path.join(LIB, 'bq', `${name}.glb`)]
    : id.startsWith('lib_') ? [path.join(LIB, 'remesh', `${name}.300000.glb`), path.join(LIB, 'remesh', `${name}.80000.glb`), path.join(LIB, `${name}.glb`)]
    : [path.join(ROOT, 'assets-meshy', 'raw', `${id}.glb`)];
  return c.find((f) => fs.existsSync(f)) || path.join(OUT, `${id}.glb`); // thiếu file gốc → từ bản đóng gói (~80k)
}

await MeshoptSimplifier.ready; await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const TEX = 512; // thu nhỏ texture trước khi lấy mẫu: mỗi đỉnh nhận màu trung bình một vùng (giản lược xong 1 đỉnh ~ nhiều texel)
async function decode(bytes, mime) {
  const r = await page.evaluate(async ({ b64, mime, S }) => {
    const blob = await (await fetch(`data:${mime};base64,${b64}`)).blob();
    const bmp = await createImageBitmap(blob);
    const c = new OffscreenCanvas(S, S), g = c.getContext('2d');
    g.imageSmoothingQuality = 'high'; g.drawImage(bmp, 0, 0, S, S);
    const d = g.getImageData(0, 0, S, S).data;
    let s = ''; for (let i = 0; i < d.length; i += 0x8000) s += String.fromCharCode.apply(null, d.subarray(i, i + 0x8000));
    return btoa(s);
  }, { b64: Buffer.from(bytes).toString('base64'), mime, S: TEX });
  return new Uint8Array(Buffer.from(r, 'base64'));
}
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; // sRGB → tuyến tính (COLOR_0)
const LIN = Float32Array.from({ length: 256 }, (_, i) => lin(i));

for (const id of ids) {
  const src = source(id), t0 = Date.now();
  const doc = await io.read(src);
  await doc.transform(dequantize());
  const P = [], C = [], I = [];
  let before = 0;
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh(); if (!mesh) continue;
    const W = node.getWorldMatrix();
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION'), uv = prim.getAttribute('TEXCOORD_0'), idx = prim.getIndices(); if (!pos) continue;
      const mat = prim.getMaterial(), tex = mat?.getBaseColorTexture(), fac = mat?.getBaseColorFactor() || [1, 1, 1, 1];
      const px = tex && uv ? await decode(tex.getImage(), tex.getMimeType() || 'image/png') : null;
      const base = P.length / 3, v = [0, 0, 0], t = [0, 0];
      for (let i = 0; i < pos.getCount(); i++) {
        pos.getElement(i, v);
        P.push(W[0] * v[0] + W[4] * v[1] + W[8] * v[2] + W[12], W[1] * v[0] + W[5] * v[1] + W[9] * v[2] + W[13], W[2] * v[0] + W[6] * v[1] + W[10] * v[2] + W[14]);
        let r = 1, g = 1, b = 1;
        if (px) {
          uv.getElement(i, t);
          const x = Math.min(TEX - 1, Math.max(0, Math.floor((t[0] - Math.floor(t[0])) * TEX))), y = Math.min(TEX - 1, Math.max(0, Math.floor((t[1] - Math.floor(t[1])) * TEX)));
          const o = (y * TEX + x) * 4; r = LIN[px[o]]; g = LIN[px[o + 1]]; b = LIN[px[o + 2]];
        }
        C.push(r * fac[0], g * fac[1], b * fac[2]);
      }
      const ia = idx ? idx.getArray() : Uint32Array.from({ length: pos.getCount() }, (_, i) => i);
      for (let i = 0; i < ia.length; i++) I.push(base + ia[i]);
      before += ia.length / 3;
    }
  }
  // hàn đỉnh theo vị trí (bỏ đường nối UV) — màu = trung bình các bản sao
  let mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < P.length; i += 3) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], P[i + k]); mx[k] = Math.max(mx[k], P[i + k]); }
  const q = Math.max(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]) / 2e5;
  const map = new Map(), remap = new Uint32Array(P.length / 3), WP = [], WC = [], WN = [];
  for (let i = 0; i < P.length / 3; i++) {
    const k = `${Math.round(P[i * 3] / q)},${Math.round(P[i * 3 + 1] / q)},${Math.round(P[i * 3 + 2] / q)}`;
    let j = map.get(k);
    if (j === undefined) { j = WP.length / 3; map.set(k, j); WP.push(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]); WC.push(0, 0, 0); WN.push(0); }
    remap[i] = j; WC[j * 3] += C[i * 3]; WC[j * 3 + 1] += C[i * 3 + 1]; WC[j * 3 + 2] += C[i * 3 + 2]; WN[j]++;
  }
  for (let j = 0; j < WN.length; j++) for (let k = 0; k < 3; k++) WC[j * 3 + k] /= WN[j];
  let idx = new Uint32Array(I.length); for (let i = 0; i < I.length; i++) idx[i] = remap[I[i]];
  const pos32 = new Float32Array(WP), col32 = new Float32Array(WC);
  // giản lược có tính màu (sai số màu cũng tính vào), không khoá biên → đạt đích
  const [out, err] = MeshoptSimplifier.simplifyWithAttributes(idx, pos32, 3, col32, 3, [0.6, 0.6, 0.6], null, Math.floor(target) * 3, Number(process.env.ERR || 0.05), []); // ERR: sai số cho phép (bản rất xa cần lớn hơn để đạt đích)
  idx = out;
  // mesh nhiều mảnh rời / mép hở (vd trống lầu): giản lược thường kẹt xa đích → «sloppy» (gộp theo lưới không gian)
  if (idx.length / 3 > target * 1.5) { const [o2] = MeshoptSimplifier.simplifySloppy(idx, pos32, 3, null, Math.floor(target) * 3, 0.5); if (o2.length >= 300) idx = o2; }
  // nén đỉnh còn dùng
  const used = new Int32Array(WN.length).fill(-1), FP = [], FC = [];
  const FI = new Uint32Array(idx.length);
  for (let i = 0; i < idx.length; i++) {
    const o = idx[i]; if (used[o] < 0) { used[o] = FP.length / 3; FP.push(pos32[o * 3], pos32[o * 3 + 1], pos32[o * 3 + 2]); FC.push(col32[o * 3], col32[o * 3 + 1], col32[o * 3 + 2]); }
    FI[i] = used[o];
  }
  const d2 = new Document(); const buf = d2.createBuffer();
  const prim = d2.createPrimitive()
    .setAttribute('POSITION', d2.createAccessor().setType('VEC3').setArray(new Float32Array(FP)).setBuffer(buf))
    .setAttribute('COLOR_0', d2.createAccessor().setType('VEC3').setArray(new Float32Array(FC)).setBuffer(buf))
    .setIndices(d2.createAccessor().setType('SCALAR').setArray(FI).setBuffer(buf))
    .setMaterial(d2.createMaterial('vc').setBaseColorFactor([1, 1, 1, 1]).setMetallicFactor(0).setRoughnessFactor(0.85).setDoubleSided(true));
  d2.createScene().addChild(d2.createNode(id).setMesh(d2.createMesh(id).addPrimitive(prim)));
  await d2.transform(normals({ overwrite: true }));
  const SUF = process.env.SUFFIX || 'vc'; // SUFFIX=vc2: bản rất xa (~2,5k)
  const tmp = path.join(TMP, `${id}.${SUF}.glb`), dst = path.join(OUT, `${id}.${SUF}.glb`);
  await new NodeIO().write(tmp, d2);
  execFileSync(process.execPath, [cli, 'optimize', tmp, dst, '--compress', 'meshopt', '--simplify', 'false', '--join', 'false', '--instance', 'false'], { stdio: 'pipe' });
  fs.rmSync(tmp);
  console.log(`${id}: ${before} → ${FI.length / 3} tam giác (sai số ${err.toFixed(4)}) · ${(fs.statSync(dst).size / 1024).toFixed(0)} KB · ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
await browser.close();
