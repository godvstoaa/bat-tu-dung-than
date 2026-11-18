// ============================================================================
//  BỘ KHUNG DỰNG KIẾN TRÚC THEO LOẠI HÌNH (docs/TIEN-PHU-KIENTRUC-MANIFEST.md §3).
//  Gom hình theo khoá vật liệu → mỗi vật liệu một lưới (ít lệnh vẽ). Các hàm hình học thuần (không cần DOM).
//  Quy ước khung cục bộ công trình: gốc = tâm mặt bằng trên mặt đất (y = 0), +z = mặt tiền, x = bề ngang.
// ============================================================================
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** bộ gom hình theo vật liệu */
export class Acc {
  constructor() { this.parts = new Map(); this.plats = []; }
  /** khai MẶT ĐI ĐƯỢC cho va chạm game (nền, bậc, sân thượng có lối lên): { x, z, w, d, ry, top } hộp, hoặc { poly: true, x, z, n, a, top } đa giác đều */
  plat(p) { this.plats.push({ ry: 0, ...p }); return p; }
  add(key, geo) { if (!geo) return geo; if (!this.parts.has(key)) this.parts.set(key, []); this.parts.get(key).push(geo.index ? geo.toNonIndexed() : geo); return geo; }
  /** dựng nhóm: mats[key] = THREE.Material (thiếu → xám) */
  build(mats, name = 'arch') {
    const g = new THREE.Group(); g.name = name;
    for (const [key, list] of this.parts) {
      const clean = list.map((x) => { for (const a of Object.keys(x.attributes)) if (!['position', 'normal', 'uv'].includes(a)) x.deleteAttribute(a); if (!x.attributes.uv) x.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(x.attributes.position.count * 2), 2)); if (!x.attributes.normal) x.computeVertexNormals(); return x; });
      const geo = mergeGeometries(clean, false); if (!geo) continue;
      const m = new THREE.Mesh(geo, mats[key] || mats.default || new THREE.MeshStandardMaterial({ color: '#888' }));
      m.name = key; m.castShadow = m.receiveShadow = true; g.add(m);
    }
    return g;
  }
  tris() { let n = 0; for (const l of this.parts.values()) for (const x of l) n += x.attributes.position.count / 3; return n; }
}

// ---------------------------------------------------------------- hình cơ bản
export function box(w, h, d, x = 0, y = 0, z = 0, ry = 0) { const g = new THREE.BoxGeometry(w, h, d); if (ry) g.rotateY(ry); g.translate(x, y, z); return g; }
/** hộp đặt đáy tại y */
export const boxB = (w, h, d, x, y, z, ry = 0) => box(w, h, d, x, y + h / 2, z, ry);
export function cyl(r0, r1, h, x, y, z, seg = 12) { const g = new THREE.CylinderGeometry(r1, r0, h, seg); g.translate(x, y + h / 2, z); return g; } // r0 = đáy, r1 = đỉnh
/** dầm hộp nối hai điểm 3D (w ngang, h đứng) */
export function beam(a, b, w, h) {
  const d = new THREE.Vector3().subVectors(b, a), L = d.length(), g = new THREE.BoxGeometry(w, h, L);
  const m = new THREE.Matrix4().lookAt(new THREE.Vector3(0, 0, 0), d, Math.abs(d.y / L) > 0.99 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0));
  g.applyMatrix4(m); g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2); return g;
}
/** đa giác 2D (trong mặt phẳng XY) đùn dày t theo z, rồi xoay ry quanh y và đặt tại (x, y, z) */
export function slabXY(pts, t, x = 0, y = 0, z = 0, ry = 0) {
  const s = new THREE.Shape(pts.map(([a, b]) => new THREE.Vector2(a, b)));
  const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false, steps: 1 }); g.translate(0, 0, -t / 2); if (ry) g.rotateY(ry); g.translate(x, y, z); return g;
}
/** khối tròn xoay từ biên dạng [[r, y], …] */
export function lathe(prof, x, y, z, seg = 16) { const g = new THREE.LatheGeometry(prof.map(([r, h]) => new THREE.Vector2(Math.max(0.001, r), h)), seg); g.translate(x, y, z); return g; }
/** dải tứ giác từ lưới điểm rows[i][j] (mỗi hàng cùng số điểm) */
export function gridSurface(rows, closeU = false) {
  const nI = rows.length, nJ = rows[0].length, pos = [], idx = [], uv = [];
  for (let i = 0; i < nI; i++) for (let j = 0; j < nJ; j++) { const p = rows[i][j]; pos.push(p.x, p.y, p.z); uv.push(j / (nJ - 1), i / (nI - 1)); }
  const J = closeU ? nJ : nJ - 1;
  for (let i = 0; i < nI - 1; i++) for (let j = 0; j < J; j++) { const j2 = (j + 1) % nJ, a = i * nJ + j, b = i * nJ + j2, c = (i + 1) * nJ + j, d = (i + 1) * nJ + j2; idx.push(a, c, b, b, c, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
/** ống tiết diện vuông chạy theo đường gấp khúc (gân ngói, bờ cong) */
export function ribAlong(pts, w, h) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) out.push(beam(pts[i], pts[i + 1], w, h));
  return out.length ? mergeGeometries(out.map(ni), false) : null;
}
export const V = (x, y, z) => new THREE.Vector3(x, y, z);
/** bỏ chỉ mục nếu có (gộp hình cần cùng dạng) */
export const ni = (g) => (g.index ? g.toNonIndexed() : g);

// ---------------------------------------------------------------- biên dạng mái theo «cử giá»
/**
 * Biên dạng mặt mái: độ dốc thay đổi từ mép hiên vào nóc.
 * slopes: mảng độ dốc (cao / ngang) chia đều theo chiều ngang run; vd Thanh [0.35 (phi rui), 0.5, 0.7, 0.9]
 * round: bề ngang đoạn bo tròn ở đỉnh (mái quyển bằng) — độ dốc giảm về 0
 * trả hàm P(d) (cao trên mép hiên tại khoảng cách ngang d từ mép) và mảng mẫu
 */
export function roofProfile(run, slopes, round = 0, steps = 16) {
  // slopes: [s, …] chia đều, hoặc [[bề ngang m, s], …] (đoạn cuối kéo tới nóc)
  const segs = slopes.map((s) => (Array.isArray(s) ? s : [null, s])), n = segs.length;
  const fixed = segs.reduce((a, [w]) => a + (w || 0), 0), free = segs.filter(([w]) => !w).length;
  const wFree = free ? Math.max(0, run - round - fixed) / free : 0;
  const bounds = []; let acc = 0; for (const [w, s] of segs) { acc += w || wFree; bounds.push([acc, s]); }
  const slopeAt = (d) => { if (d >= run - round) { const t = (d - (run - round)) / Math.max(1e-6, round); return bounds[n - 1][1] * (1 - t); } for (const [b, s] of bounds) if (d < b) return s; return bounds[n - 1][1]; };
  const ds = [0], hs = [0];
  const N = steps; let h = 0;
  for (let i = 1; i <= N; i++) { const d0 = ((i - 1) / N) * run, d1 = (i / N) * run, m = (d0 + d1) / 2; h += slopeAt(m) * (d1 - d0); ds.push(d1); hs.push(h); }
  const P = (d) => { if (d <= 0) return 0; if (d >= run) return hs[N]; const f = (d / run) * N, i = Math.floor(f); return hs[i] + (hs[i + 1] - hs[i]) * (f - i); };
  return { P, H: hs[N], ds, run };
}

/**
 * MÁI CHỮ NHẬT tổng quát (mặt cong theo cử giá, góc nâng nhẹ). Khung: tâm (0, yE, zc), nóc chạy theo x.
 *  type: 'hip' (vũ điện / mái chóp dài) · 'xieshan' (yết sơn: chân mái hồi tới dG rồi tam giác hồi đứng)
 *        'gable' (ngạnh sơn / huyền sơn: không có mái hồi; xe = ex cố định) · 'ring' (mái hiên vòng — dừng ở dMax)
 *  ex, ez: nửa kích thước tính tới MÉP HIÊN; prof: roofProfile(run = ez, …); lift: độ nâng góc (m) — 0 cho ngạnh sơn
 *  trả { tiles: geo (mặt ngói, hai mặt), ribs: geo (gân ngói ống), eaveEdge: geo (diềm mép + hàng đầu ngói), ridges: [[a,b],…] (đoạn bờ),
 *        gable: [{x, pts}] (đa giác tam giác hồi cho yết sơn), top: cao nóc tuyệt đối, ridgeX: nửa dài bờ nóc }
 */
export function rectRoof({ type = 'hip', ex, ez, yE, zc = 0, prof, dG = 0, dMax = Infinity, lift = 0, liftPow = 3, rib = 0.42, ribW = 0.16, thick = 0.22, xs = 24 }) {
  const P = prof.P, run = prof.run, dTop = Math.min(run, dMax);
  const xg = ex - dG;                                                    // mặt tam giác hồi (yết sơn)
  const xe = (d) => (type === 'gable' ? ex : type === 'xieshan' ? (d <= dG ? ex - d : xg) : Math.max(ex - run, ex - d));
  const L = (x, z) => (lift ? lift * Math.pow(Math.min(1, Math.abs(x) / ex), liftPow) * Math.pow(Math.min(1, Math.abs(z - zc) / ez), liftPow) : 0);
  const Y = (x, z, d) => yE + P(d) + L(x, z);
  const ds = prof.ds.filter((d) => d <= dTop + 1e-6); if (ds[ds.length - 1] < dTop - 1e-6) ds.push(dTop);
  const tiles = [], ribs = [], edge = [], ridges = [], gable = [];
  const thin = (arr) => arr.filter((_, i) => i % 3 === 0 || i === arr.length - 1);  // gân ngói: ít điểm (mặt mái lồi → dây cung nằm trên mặt ngói)
  const dsR = thin(ds);
  // --- hai mái dài (±z)
  for (const sz of [1, -1]) {
    const rows = ds.map((d) => { const w = xe(d), z = zc + sz * (ez - d), r = []; for (let j = 0; j <= xs; j++) { const x = -w + (2 * w * j) / xs; r.push(V(x, Y(x, z, d), z)); } return r; });
    tiles.push(gridSurface(sz > 0 ? rows : rows.map((r) => [...r].reverse())));
    // gân ngói ống: mỗi gân đi từ mép lên tới khi ra ngoài xe(d)
    for (let x = -ex + rib / 2; x <= ex - rib / 2 + 1e-6; x += rib) {
      const pts = []; for (const d of dsR) { if (Math.abs(x) > xe(d) - ribW) break; const z = zc + sz * (ez - d); pts.push(V(x, Y(x, z, d) + ribW * 0.45, z)); }
      if (pts.length > 1) ribs.push(ribAlong(pts, ribW, ribW * 0.9));
    }
    // diềm mép hiên (dày thick) theo đường mép có nâng góc
    const w0 = xe(0), z0 = zc + sz * ez, ePts = []; for (let j = 0; j <= xs; j++) { const x = -w0 + (2 * w0 * j) / xs; ePts.push(V(x, Y(x, z0, 0) - thick / 2, z0)); }
    edge.push(ribAlong(ePts, thick * 1.1, thick));
  }
  // --- hai mái hồi (±x): hip / xieshan / ring
  if (type !== 'gable') {
    const dEnd = type === 'xieshan' ? dG : dTop;
    const dsE = ds.filter((d) => d <= dEnd + 1e-6); if (dsE[dsE.length - 1] < dEnd - 1e-6) dsE.push(dEnd);
    for (const sx of [1, -1]) {
      const rows = dsE.map((d) => { const w = ez - d, x = sx * (ex - d), r = []; for (let j = 0; j <= xs; j++) { const z = zc - w + (2 * w * j) / xs; r.push(V(x, Y(x, z, d), z)); } return r; });
      tiles.push(gridSurface(sx > 0 ? rows.map((r) => [...r].reverse()) : rows));
      for (let z = zc - ez + rib / 2; z <= zc + ez - rib / 2 + 1e-6; z += rib) {
        const pts = []; for (const d of thin(dsE)) { if (Math.abs(z - zc) > ez - d - ribW) break; const x = sx * (ex - d); pts.push(V(x, Y(x, z, d) + ribW * 0.45, z)); }
        if (pts.length > 1) ribs.push(ribAlong(pts, ribW, ribW * 0.9));
      }
      const w0 = ez, x0 = sx * ex, ePts = []; for (let j = 0; j <= xs; j++) { const z = zc - w0 + (2 * w0 * j) / xs; ePts.push(V(x0, Y(x0, z, 0) - thick / 2, z)); }
      edge.push(ribAlong(ePts, thick * 1.1, thick));
      // bờ góc (戗脊 / hip) từ góc tới chân hồi / nóc
      for (const sz of [1, -1]) { const pts = dsE.map((d) => { const x = sx * (ex - d), z = zc + sz * (ez - d); return V(x, Y(x, z, d) + 0.18, z); }); ridges.push(pts); }
    }
    if (type === 'xieshan') for (const sx of [1, -1]) {
      // tam giác hồi đứng tại x = ±xg: chân ở dG, đỉnh theo biên dạng tới nóc
      const x = sx * xg, pts = [];
      for (const d of ds.filter((d) => d >= dG)) pts.push([zc + (ez - d), Y(x, zc + ez - d, d)]);
      for (const d of ds.filter((d) => d >= dG).reverse()) pts.push([zc - (ez - d), Y(x, zc - ez + d, d)]);
      gable.push({ x, sx, pts, yFoot: Y(x, zc + ez - dG, dG) });
      // bờ đứng (垂脊) theo cạnh dốc tam giác hồi
      for (const sz of [1, -1]) ridges.push(ds.filter((d) => d >= dG).map((d) => { const z = zc + sz * (ez - d); return V(x, Y(x, z, d) + 0.18, z); }));
    }
  }
  const top = yE + P(dTop), ridgeX = type === 'gable' ? ex : type === 'xieshan' ? xg : Math.max(0, ex - run);
  return { tiles: mergeGeometries(tiles.map(ni), false), ribs: ribs.length ? mergeGeometries(ribs.filter(Boolean).map(ni), false) : null, eaveEdge: mergeGeometries(edge.map(ni), false), ridges, gable, top, ridgeX, Y, xe };
}

/** MÁI CHÓP đa giác đều n cạnh (攒尖 / mái chóp): apothem mép hiên ae, biên dạng prof (run = ae) */
export function polyRoof({ n, ae, yE, prof, lift = 0, rib = 0.42, ribW = 0.15, thick = 0.2, rot = 0, cx = 0, cz = 0 }) {
  const P = prof.P, run = prof.run, re = ae / Math.cos(Math.PI / n), tiles = [], ribs = [], edge = [], ridges = [];
  for (let k = 0; k < n; k++) {
    const t = (2 * Math.PI * k) / n + rot, nx = Math.cos(t), nz = Math.sin(t), tx = -nz, tz = nx;
    const half = (d) => (ae - d) * Math.tan(Math.PI / n);
    const pt = (d, u) => { const a = ae - d, x = cx + nx * a + tx * u, z = cz + nz * a + tz * u, hw = half(0); return V(x, yE + P(d) + lift * Math.pow(Math.min(1, Math.abs(u) / Math.max(1e-6, (ae - d) * Math.tan(Math.PI / n))), 3) * Math.max(0, 1 - d / run) ** 0.5 * (hw ? 1 : 0), z); };
    const rows = prof.ds.map((d) => { const h = half(d), r = []; for (let j = 0; j <= 10; j++) r.push(pt(d, -h + (2 * h * j) / 10)); return r; });
    tiles.push(gridSurface(rows.map((r) => [...r].reverse())));
    for (let u = -half(0) + rib / 2; u <= half(0) - rib / 2; u += rib) { const pts = []; for (const d of prof.ds.filter((_, i, a) => i % 3 === 0 || i === a.length - 1)) { if (Math.abs(u) > half(d) - ribW) break; const p = pt(d, u); p.y += ribW * 0.45; pts.push(p); } if (pts.length > 1) ribs.push(ribAlong(pts, ribW, ribW * 0.9)); }
    const e = []; for (let j = 0; j <= 10; j++) { const p = pt(0, -half(0) + (2 * half(0) * j) / 10); p.y -= thick / 2; e.push(p); } edge.push(ribAlong(e, thick * 1.1, thick));
    ridges.push(prof.ds.map((d) => { const p = pt(d, half(d)); p.y += 0.16; return p; }));
  }
  return { tiles: mergeGeometries(tiles.map(ni), false), ribs: ribs.length ? mergeGeometries(ribs.map(ni), false) : null, eaveEdge: mergeGeometries(edge.map(ni), false), ridges, top: yE + P(run), re };
}

/** bờ (đoạn gấp khúc) thành khối */
export function ridgeGeo(pts, w, h) { return ribAlong(pts, w, h); }

/** biên dạng hình bóng (silhouette) đùn dày — dùng cho vẫn thú, linh vật, chóp trang trí */
export function silhouette(pts, t, x, y, z, ry = 0, sc = 1) { return slabXY(pts.map(([a, b]) => [a * sc, b * sc]), t * sc, x, y, z, ry); }
