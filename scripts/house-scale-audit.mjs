// ============================================================================
//  ĐO TỈ LỆ NHÀ PHỐ (Node): mọi nhà city4.renderHouses + innerfill.innerHouses → mẫu model, hệ số phóng thật
//  (cityblocks3d.houseScale), kích thước cuối (rộng × sâu × cao m) và — với số đo cửa / mái hiên trong
//  model (đơn vị model, đo tay trong Blender — MODEL_DOOR) — chiều cao cửa và mái hiên thật.
//    node scripts/house-scale-audit.mjs  → bảng theo mẫu + output/scan/house-scale.json
// ============================================================================
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { renderHouses } from '../src/game/city4.js';
import { innerHouses } from '../src/game/innerfill.js';
import { HOUSE_SPECS } from '../src/game/cityblocks.js';

// cityblocks3d.houseScale (chép nguyên — file đó nạp three/DOM)
const HCAP = { bq_drum_tower: 16, bq_tower_house: 11, bq_granary: 10, bq_yamen: 12, lib_lib_house_a2: 8.6, lib_lib_house_b2: 8.6, lib_house_c2: 6.8 };
const houseScale = (h, size) => {
  const kx = ((h.lotF || h.f) * 1.015) / (size.x || 1);
  const kz = h.d ? (h.ht ? Math.min(kx * 1.5, h.d / (size.z || 1)) : Math.min(kx, h.d / (size.z || 1))) : kx;
  if (h.ht) return { kx, ky: Math.min(kx * 1.25, Math.max(kx * 0.85, h.ht / (size.y || 1))), kz };
  const vary = 1 + Math.min(0.12, Math.max(-0.04, ((h.ys || 1) - 1) * 0.2));
  const ky = Math.min(kx * vary, (HCAP[h.id] || 10.5) / (size.y || 1));
  return { kx, ky, kz };
};
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const bbox = async (id) => {
  const f = existsSync(`public/models/${id}.vc.glb`) ? `${id}.vc` : id; // cùng khung với bản gốc
  const doc = await io.read(`public/models/${f}.glb`);
  const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh(); if (!mesh) continue;
    const M = node.getWorldMatrix();
    for (const p of mesh.listPrimitives()) {
      const a = p.getAttribute('POSITION'), v = [0, 0, 0];
      for (let i = 0; i < a.getCount(); i++) {
        a.getElement(i, v);
        const x = M[0] * v[0] + M[4] * v[1] + M[8] * v[2] + M[12], y = M[1] * v[0] + M[5] * v[1] + M[9] * v[2] + M[13], z = M[2] * v[0] + M[6] * v[1] + M[10] * v[2] + M[14];
        mn[0] = Math.min(mn[0], x); mn[1] = Math.min(mn[1], y); mn[2] = Math.min(mn[2], z); mx[0] = Math.max(mx[0], x); mx[1] = Math.max(mx[1], y); mx[2] = Math.max(mx[2], z);
      }
    }
  }
  return { x: mx[0] - mn[0], y: mx[1] - mn[1], z: mx[2] - mn[2] };
};
// cửa / mái hiên: phần trăm chiều cao model (đo ảnh mặt đứng — output/scan/elev/*.png); null = chưa đo
const FRAC = existsSync('output/scan/model-frac.json') ? JSON.parse(readFileSync('output/scan/model-frac.json', 'utf8')) : {};
const houses = [...renderHouses(), ...innerHouses().map((h) => ({ ...h, lotF: h.f }))];
const by = new Map();
for (const h of houses) { let l = by.get(h.id); if (!l) by.set(h.id, (l = [])); l.push(h); }
const rows = [];
for (const [id, list] of by) {
  if (!HOUSE_SPECS[id]) continue;
  const s = await bbox(id);
  const H = list.map((h) => { const k = houseScale(h, s); return { w: s.x * k.kx, d: s.z * k.kz, h: s.y * k.ky }; });
  const q = (arr, p) => { const a = [...arr].sort((m, n) => m - n); return a[Math.min(a.length - 1, Math.floor(p * a.length))]; };
  const hs = H.map((o) => o.h), ws = H.map((o) => o.w);
  const fr = FRAC[id];
  rows.push({ id, n: list.length, model: s, w50: q(ws, 0.5), h10: q(hs, 0.1), h50: q(hs, 0.5), h90: q(hs, 0.9), door50: fr?.door ? q(hs, 0.5) * fr.door : null, door10: fr?.door ? q(hs, 0.1) * fr.door : null, eave50: fr?.eave ? q(hs, 0.5) * fr.eave : null });
}
rows.sort((a, b) => b.n - a.n);
mkdirSync('output/scan', { recursive: true });
writeFileSync('output/scan/house-scale.json', JSON.stringify(rows, null, 1));
const f1 = (v) => (v == null ? '–' : v.toFixed(1));
console.log(`tổng ${houses.length} nhà`);
console.log('mẫu | số nhà | model x×y×z | rộng p50 | cao p10/p50/p90 | cửa p10/p50 | hiên p50');
for (const r of rows) console.log(`${r.id} | ${r.n} | ${f1(r.model.x)}×${f1(r.model.y)}×${f1(r.model.z)} | ${f1(r.w50)} | ${f1(r.h10)}/${f1(r.h50)}/${f1(r.h90)} | ${f1(r.door10)}/${f1(r.door50)} | ${f1(r.eave50)}`);
