// ============================================================================
//  VẬT CẢN TỪ CHÍNH LƯỚI HÌNH (TIEN-PHU-MANIFEST §4): mọi tam giác của tiên phủ chiếu xuống lưới 0,5 m kèm KHOẢNG CAO thật
//  của nó trên từng ô → lớp vật cản theo tầng (obstacles.setVoxelLayer). Cột, lan can, tượng, đèn, cây, đồ bài trí… thấy được
//  ở tầm thân người là chặn — khớp hình tuyệt đối, không có vật cản «vẽ tay» lệch.
//   · tam giác đứng (vách, cột): lấy mẫu dọc hình chiếu mỗi 0,2 m, khoảng cao = giao đường thẳng đứng với tam giác
//   · tam giác nghiêng / ngang (mái, mặt bàn): tô ô theo tâm + cạnh, khoảng cao = mặt phẳng tam giác quanh tâm ô
//   · BỎ thân của chính nền đi được (sàn, bậc, mặt cầu, thềm): khoảng có đỉnh trùng mặt nền ở ô đó (±6 cm)
//   · ô đứng trên mặt đất / nền một tầng mà bị chặn ở tầm thân người → thêm đặc 2D (A*, dân phố, camera biết)
//  Chạy từng phần qua nhiều khung (job generator) — không khựng.
// ============================================================================
import * as THREE from 'three';
import { CELL, cellKey, platformTop, pitAt } from '../obstacles.js';

const V0 = new THREE.Vector3(), V1 = new THREE.Vector3(), V2 = new THREE.Vector3();
const cellOf = (v) => Math.floor(v / CELL);
const E = CELL / 2 - 0.01, CORNERS = [[0, 0], [E, E], [-E, E], [E, -E], [-E, -E], [E, 0], [-E, 0], [0, E], [0, -E]]; // tâm, 4 góc, 4 giữa cạnh ô

function addRange(map, i, j, y0, y1) {
  const k = cellKey(i, j); let a = map.get(k);
  if (!a) { map.set(k, [y0, y1]); return; }
  // gộp khoảng chồng / sát nhau (< 0,25 m)
  for (let q = 0; q < a.length; q += 2) if (y0 <= a[q + 1] + 0.25 && y1 >= a[q] - 0.25) { a[q] = Math.min(a[q], y0); a[q + 1] = Math.max(a[q + 1], y1); return; }
  if (a.length < 160) a.push(y0, y1); // lầu 10 tầng: một ô có thể chồng 11 sàn + đồ + xà — giữ đủ (trước: 12 khoảng → mất tầng trên)
}
/** một tam giác (toạ độ thế giới) */
function rasterTri(map, a, b, c) {
  const ymin = Math.min(a.y, b.y, c.y), ymax = Math.max(a.y, b.y, c.y);
  const x0 = Math.min(a.x, b.x, c.x), x1 = Math.max(a.x, b.x, c.x), z0 = Math.min(a.z, b.z, c.z), z1 = Math.max(a.z, b.z, c.z);
  if (x1 - x0 > 90 || z1 - z0 > 90) return; // mặt phủ khổng lồ (thảm cỏ / nền đảo) — không phải vật cản
  // pháp tuyến
  const ux = b.x - a.x, uy = b.y - a.y, uz = b.z - a.z, vx = c.x - a.x, vy = c.y - a.y, vz = c.z - a.z;
  const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, nl = Math.hypot(nx, ny, nz);
  if (nl < 1e-9) return;
  const vertical = Math.abs(ny / nl) < 0.2;
  if (vertical) {
    // hình chiếu ≈ đoạn thẳng: trục u theo phương ngang dài nhất của tam giác
    const pts = [a, b, c];
    let best = 0, P = a, Q = b; for (const [p, q] of [[a, b], [b, c], [a, c]]) { const d = Math.hypot(q.x - p.x, q.z - p.z); if (d > best) { best = d; P = p; Q = q; } }
    if (best < 1e-4) { addRange(map, cellOf(a.x), cellOf(a.z), ymin, ymax); return; }
    const dx = (Q.x - P.x) / best, dz = (Q.z - P.z) / best;
    const U = pts.map((p) => (p.x - P.x) * dx + (p.z - P.z) * dz);
    // mẫu dọc u: mỗi ≤ 0,2 m + ĐÚNG vị trí u của 3 đỉnh. Chiều cao tam giác theo u tuyến tính từng khúc,
    // lớn nhất tại một đỉnh — trước đây chỉ lấy hai đầu mút (nơi tam giác nhọn về một điểm) nên tam giác hẹp < 0,2 m (thành trụ
    // nhỏ, chấn song, chân cột mảnh, thân cây proxy r 0,2) chỉ ra khoảng cao suy biến [0,0] / [h,h] → mất hẳn vật cản.
    const steps = Math.max(1, Math.ceil(best / 0.2)), us = [];
    for (let s = 0; s <= steps; s++) us.push((best * s) / steps);
    for (const v of U) if (v > 0 && v < best) us.push(v); // (thử chỉ khi 1 bước: trụ r 0,4 m mất ô mép — giữ cho mọi tam giác, chi phí không đáng kể)
    for (const u of us) {
      // giao đường đứng u với 3 cạnh tam giác trong mặt (u, y)
      let lo = Infinity, hi = -Infinity;
      for (const [i, j] of [[0, 1], [1, 2], [0, 2]]) {
        const ua = U[i], ub = U[j];
        if ((u < Math.min(ua, ub) - 1e-6) || (u > Math.max(ua, ub) + 1e-6)) continue;
        const t = Math.abs(ub - ua) < 1e-6 ? 0 : (u - ua) / (ub - ua);
        const y1 = pts[i].y + (pts[j].y - pts[i].y) * t; lo = Math.min(lo, y1); hi = Math.max(hi, y1);
        if (Math.abs(ub - ua) < 1e-6) { lo = Math.min(lo, pts[i].y, pts[j].y); hi = Math.max(hi, pts[i].y, pts[j].y); }
      }
      if (lo > hi) continue;
      addRange(map, cellOf(P.x + dx * u), cellOf(P.z + dz * u), lo, hi);
    }
    return;
  }
  // nghiêng / ngang: y = mặt phẳng; tô ô có tâm trong tam giác + ô dọc cạnh
  const gy = (x, z) => a.y - (nx * (x - a.x) + nz * (z - a.z)) / ny;
  const slope = Math.hypot(nx, nz) / Math.abs(ny) * CELL * 0.71;
  const mark = (i, j) => { const cx = (i + 0.5) * CELL, cz = (j + 0.5) * CELL, y = gy(cx, cz); addRange(map, i, j, Math.max(ymin, y - slope), Math.min(ymax, y + slope)); };
  const area = (px, pz, qx, qz, rx, rz) => (qx - px) * (rz - pz) - (qz - pz) * (rx - px);
  const A = area(a.x, a.z, b.x, b.z, c.x, c.z);
  if (Math.abs(A) > 1e-6) {
    for (let i = cellOf(x0); i <= cellOf(x1); i++) for (let j = cellOf(z0); j <= cellOf(z1); j++) {
      const px = (i + 0.5) * CELL, pz = (j + 0.5) * CELL;
      const w0 = area(b.x, b.z, c.x, c.z, px, pz) / A, w1 = area(c.x, c.z, a.x, a.z, px, pz) / A, w2 = 1 - w0 - w1;
      if (w0 >= -1e-6 && w1 >= -1e-6 && w2 >= -1e-6) mark(i, j);
    }
  }
  for (const [p, q] of [[a, b], [b, c], [c, a]]) {
    const len = Math.hypot(q.x - p.x, q.z - p.z), m = Math.max(1, Math.ceil(len / 0.25));
    for (let s = 0; s <= m; s++) { const t = s / m; mark(cellOf(p.x + (q.x - p.x) * t), cellOf(p.z + (q.z - p.z) * t)); }
  }
}

/**
 * Generator: lấy mẫu mọi mesh trong roots (bỏ userData.noCollide, mesh trong suốt mờ của tia sáng).
 * opts.skip2D(x, z) → true: không thêm đặc 2D ở đây (trong lầu nhiều tầng). Mỗi lần yield ≈ budget tam giác.
 * Kết quả trong out: { cells3: Map, cells2: Set }
 */
export function* voxelJob(roots, out, { budget = 12000, skip2D = () => false } = {}) {
  const raw = new Map();
  let work = 0;
  for (const root of roots) {
    // updateWorldMatrix(cha = true): tính cả nhóm phủ / cảnh phía trên. updateMatrixWorld(true) cũ dùng matrixWorld của cha
    // CÒN CŨ (nhóm phủ vừa thêm, chưa qua lượt vẽ nào = đơn vị) → loạt lưới đầu (tường, lầu cổng, cổng phụ) bị raster ở toạ độ
    // CỤC BỘ: cổng 9 phủ không chặn (đi xuyên cột cổng) + «tường vô hình» rơi quanh gốc thế giới (giữa thành).
    root.updateWorldMatrix(true, true);
    const meshes = [];
    root.traverse((o) => { if ((o.isMesh || o.isInstancedMesh) && !o.userData.noCollide) { let p = o, skip = false; while (p) { if (p.userData?.noCollide) { skip = true; break; } p = p.parent; } if (!skip) meshes.push(o); } });
    for (const o of meshes) {
      o.updateWorldMatrix(true, false); // job chạy qua nhiều khung: nhóm có thể vừa đổi vị trí — đọc ma trận mới nhất
      const g = o.geometry, pos = g.attributes.position, idx = g.index;
      const inst = o.isInstancedMesh ? o.count : 1, IM = new THREE.Matrix4(), W = new THREE.Matrix4();
      for (let n = 0; n < inst; n++) {
        if (o.isInstancedMesh) { o.getMatrixAt(n, IM); W.multiplyMatrices(o.matrixWorld, IM); } else W.copy(o.matrixWorld);
        const tris = idx ? idx.count / 3 : pos.count / 3;
        for (let t = 0; t < tris; t++) {
          const i0 = idx ? idx.getX(t * 3) : t * 3, i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1, i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
          V0.fromBufferAttribute(pos, i0).applyMatrix4(W); V1.fromBufferAttribute(pos, i1).applyMatrix4(W); V2.fromBufferAttribute(pos, i2).applyMatrix4(W);
          rasterTri(raw, V0, V1, V2);
          if (++work >= budget) { work = 0; yield; }
        }
      }
    }
  }
  // lọc thân nền đi được + tách lớp 2D
  const cells3 = new Map(), cells2 = new Set();
  let n = 0;
  for (const [k, ranges] of raw) {
    const ii = Math.floor(k / 80000) - 40000, jj = (k % 80000) - 40000, cx = (ii + 0.5) * CELL, cz = (jj + 0.5) * CELL;
    const keep = [];
    for (let q = 0; q < ranges.length; q += 2) {
      const y0 = ranges[q], y1 = ranges[q + 1];
      if (y1 - y0 < 0.01 && y1 < 0.08) continue; // vệt sát mặt đảo
      // thân của chính nền đi được ở ô này: khoảng không vượt mặt nền CAO NHẤT trong ô (tâm, góc, giữa cạnh).
      // (trước: chỉ so với nền ở TÂM ô ±6 cm → ô 0,5 m chứa hai bậc sâu 0,34 m thành «khối đặc» — kẹt chân bậc cổng / thềm)
      // Hỏi tâm trước; 8 điểm phụ chỉ khi khoảng nằm THẤP (≤ 1 m trên nền tâm ô — ca bậc thang): hỏi 9 điểm cho mọi khoảng
      // làm job voxel 1 s → 8–14 s CPU (đo $TEMP/tpg/buildcpu.mjs 2026-11-17)
      const c0 = platformTop(cx, cz, y1 + 0.05);
      if (c0 != null && y1 <= c0 + 0.06) continue;
      // (đã thử chỉ hỏi khi đỉnh ≥ nền + 0,3 và đệm điểm biên dùng chung giữa các ô: CPU không giảm đáng kể mà mất 1 lối cổng / 3 món đồ — bỏ)
      if (y1 - (c0 ?? 0) < 1.0) {
        let top = c0;
        for (let c = 1; c < CORNERS.length; c++) { const t2 = platformTop(cx + CORNERS[c][0], cz + CORNERS[c][1], y1 + 0.05); if (t2 != null && (top == null || t2 > top)) top = t2; }
        if (top != null && y1 <= top + 0.06) continue;
      }
      keep.push(y0, y1);
    }
    if (!keep.length) continue;
    cells3.set(k, keep);
    if (!skip2D(cx, cz) && !pitAt(cx, cz)) {
      const f = platformTop(cx, cz) ?? 0;
      for (let q = 0; q < keep.length; q += 2) if (keep[q] < f + 1.75 && keep[q + 1] > f + 0.3) { cells2.add(k); break; }
    }
    if (++n % 20000 === 0) yield;
  }
  out.cells3 = cells3; out.cells2 = cells2;
}
