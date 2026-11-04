// ============================================================================
//  VA CHẠM THEO HÌNH KHỐI — cắt lát model ở tầm thân người rồi đánh dấu vào lưới 0,5 m (obstacles.js).
//  Mỗi tam giác được cắt theo dải [chân + lo, chân + hi]; phần còn lại chiếu xuống mặt phẳng XZ:
//  cạnh → đánh dấu dọc theo cạnh (tường mỏng, cột), mặt → tô các ô có tâm nằm trong.
//  Nhờ vậy tường / cột / bậc đều chặn thật, cửa vòm mở ở tầm thân người vẫn đi qua được.
//  Model có LOD: lấy bản xa (ít tam giác, cùng hình dáng). InstancedMesh: mỗi bản sao một lần.
// ============================================================================
import * as THREE from 'three';
import { CELL, markSolidCell, cellOf } from './obstacles.js';

const M = new THREE.Matrix4(), IM = new THREE.Matrix4(), V = new THREE.Vector3();

function clipY(poly, y, above) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    const pin = above ? p[1] >= y : p[1] <= y, qin = above ? q[1] >= y : q[1] <= y;
    if (pin) out.push(p);
    if (pin !== qin) { const t = (y - p[1]) / (q[1] - p[1]); out.push([p[0] + (q[0] - p[0]) * t, y, p[2] + (q[2] - p[2]) * t]); }
  }
  return out;
}

function rasterPoly(poly, mark) {
  // cạnh: lấy mẫu mỗi nửa ô
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    const len = Math.hypot(q[0] - p[0], q[2] - p[2]);
    const n = Math.max(1, Math.ceil(len / (CELL * 0.5)));
    for (let k = 0; k <= n; k++) mark(cellOf(p[0] + (q[0] - p[0]) * (k / n)), cellOf(p[2] + (q[2] - p[2]) * (k / n)));
  }
  if (poly.length < 3) return;
  // mặt: đa giác lồi (tam giác bị cắt) — tô ô có tâm nằm trong
  let area = 0, x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    area += p[0] * q[2] - q[0] * p[2];
    x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); z0 = Math.min(z0, p[2]); z1 = Math.max(z1, p[2]);
  }
  if (Math.abs(area) < CELL * CELL * 0.5) return;
  const sgn = Math.sign(area);
  for (let i = cellOf(x0); i <= cellOf(x1); i++) for (let j = cellOf(z0); j <= cellOf(z1); j++) {
    const cx = (i + 0.5) * CELL, cz = (j + 0.5) * CELL;
    let inside = true;
    for (let k = 0; k < poly.length && inside; k++) {
      const p = poly[k], q = poly[(k + 1) % poly.length];
      if (((q[0] - p[0]) * (cz - p[2]) - (q[2] - p[2]) * (cx - p[0])) * sgn < 0) inside = false;
    }
    if (inside) mark(i, j);
  }
}

function rasterGeometry(geo, matrix, y0, y1, mark) {
  const pos = geo.attributes.position; if (!pos) return;
  const W = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) { V.fromBufferAttribute(pos, i).applyMatrix4(matrix); W[i * 3] = V.x; W[i * 3 + 1] = V.y; W[i * 3 + 2] = V.z; }
  const idx = geo.index ? geo.index.array : null;
  const n = idx ? idx.length : pos.count;
  const P = (k) => [W[k * 3], W[k * 3 + 1], W[k * 3 + 2]];
  for (let t = 0; t < n; t += 3) {
    const a = idx ? idx[t] : t, b = idx ? idx[t + 1] : t + 1, c = idx ? idx[t + 2] : t + 2;
    const ya = W[a * 3 + 1], yb = W[b * 3 + 1], yc = W[c * 3 + 1];
    if (Math.max(ya, yb, yc) < y0 || Math.min(ya, yb, yc) > y1) continue;
    let poly = [P(a), P(b), P(c)];
    poly = clipY(poly, y0, true); if (!poly.length) continue;
    poly = clipY(poly, y1, false); if (!poly.length) continue;
    rasterPoly(poly, mark);
  }
}

/**
 * Đưa hình khối của obj vào lưới va chạm.
 * @param lo, hi    dải cắt tính từ chân (m) — mặc định 0,4 → 2,0 (tầm thân người, bước qua bậc thấp)
 * @param base      độ cao chân; mặc định = đáy khung bao (InstancedMesh: ground(x, z) tại từng bản sao)
 * @param ground    (x, z) → độ cao mặt đất, cho InstancedMesh
 * @param keep      (x, z) → false = bỏ qua ô này (khoét lối đi qua cổng)
 * @returns số ô đã đánh dấu
 */
export function addFootprint(obj, { lo = 0.4, hi = 2.0, base = null, ground = null, keep = null } = {}) {
  if (!obj) return 0;
  obj.updateMatrixWorld(true);
  const root = obj.isLOD && obj.levels.length ? obj.levels[obj.levels.length - 1].object : obj;
  root.updateMatrixWorld(true);
  let n = 0;
  const mark = (i, j) => { if (keep && !keep((i + 0.5) * CELL, (j + 0.5) * CELL)) return; markSolidCell(i, j); n++; };
  const b0 = base ?? new THREE.Box3().setFromObject(root).min.y;
  root.traverse((o) => {
    if (!o.isMesh || !o.geometry) return;
    if (o.isInstancedMesh) {
      for (let k = 0; k < o.count; k++) {
        o.getMatrixAt(k, IM); M.multiplyMatrices(o.matrixWorld, IM);
        V.setFromMatrixPosition(M);
        const b = ground ? ground(V.x, V.z) : b0;
        rasterGeometry(o.geometry, M, b + lo, b + hi, mark);
      }
    } else rasterGeometry(o.geometry, o.matrixWorld, b0 + lo, b0 + hi, mark);
  });
  return n;
}
