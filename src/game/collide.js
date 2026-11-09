// ============================================================================
//  VA CHẠM THEO HÌNH KHỐI — cắt lát model ở tầm thân người rồi đánh dấu vào lưới 0,5 m (obstacles.js).
//  Mỗi tam giác được cắt theo dải [chân + lo, chân + hi]; phần còn lại chiếu xuống mặt phẳng XZ:
//  cạnh → đánh dấu dọc theo cạnh (tường mỏng, cột), mặt → tô các ô có tâm nằm trong.
//  Nhờ vậy tường / cột / bậc đều chặn thật, cửa vòm mở ở tầm thân người vẫn đi qua được.
//  Model có LOD: lấy bản xa (ít tam giác, cùng hình dáng). InstancedMesh: mỗi bản sao một lần.
// ============================================================================
import * as THREE from 'three';
import { span } from './perf.js';
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

// Một việc cắt lát = một mesh (một bản sao) — chạy cuốn chiếu theo tam giác, tiếp tục được
function rasterJob(geo, matrix, y0, y1, mark) {
  const pos = geo.attributes.position;
  if (!pos) return null;
  const e = matrix.elements.slice(), idx = geo.index ? geo.index.array : null, n = idx ? idx.length : pos.count;
  const tx = (k, out, o) => {
    const x = pos.getX(k), y = pos.getY(k), z = pos.getZ(k), w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
    out[o] = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w; out[o + 1] = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w; out[o + 2] = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
  };
  const Pt = new Float64Array(9);
  let t = 0;
  // trả true khi xong; dừng giữa chừng khi hết `deadline`
  return (deadline) => {
    for (; t < n; t += 3) {
      if ((t & 1023) === 0 && performance.now() > deadline) return false;
      tx(idx ? idx[t] : t, Pt, 0); tx(idx ? idx[t + 1] : t + 1, Pt, 3); tx(idx ? idx[t + 2] : t + 2, Pt, 6);
      if (Math.max(Pt[1], Pt[4], Pt[7]) < y0 || Math.min(Pt[1], Pt[4], Pt[7]) > y1) continue;
      let poly = [[Pt[0], Pt[1], Pt[2]], [Pt[3], Pt[4], Pt[5]], [Pt[6], Pt[7], Pt[8]]];
      poly = clipY(poly, y0, true); if (!poly.length) continue;
      poly = clipY(poly, y1, false); if (!poly.length) continue;
      rasterPoly(poly, mark);
    }
    return true;
  };
}

// Hàng đợi cắt lát: mỗi lượt tối đa ~4 ms rồi nhường luồng (không còn khung giật 60+ ms khi một
// công trình lớn vừa nạp). Va chạm của công trình có hiệu lực sau vài khung — màn nạp chờ hết hàng.
const jobs = [];
// sổ hình khối đã cắt (gỡ lỗi va chạm: __footprints trong console)
const FP = [];
if (typeof window !== 'undefined') window.__footprints = FP;
let pumping = false, idleWaiters = [];
// MessageChannel tạo lười (Node giữ tiến trình sống nếu cổng có onmessage) — ngoài trình duyệt dùng setTimeout
let ch = null, chCb = null;
const tick = (f) => {
  if (typeof window === 'undefined' || typeof MessageChannel === 'undefined') return setTimeout(f, 0);
  if (!ch) { ch = new MessageChannel(); ch.port1.onmessage = () => chCb && chCb(); }
  chCb = f; ch.port2.postMessage(0);
};
function pump() {
  const deadline = performance.now() + 4;
  span('footprint', () => {
    while (jobs.length && performance.now() < deadline) { if (jobs[0](deadline)) jobs.shift(); }
  });
  if (jobs.length) setTimeout(() => tick(pump), 0); // setTimeout: để khung hình kịp vẽ giữa hai lượt
  else { pumping = false; const w = idleWaiters; idleWaiters = []; w.forEach((r) => r()); }
}
/** Lời hứa xong khi mọi hình khối đã vào lưới va chạm. */
export function footprintIdle() { return jobs.length ? new Promise((r) => idleWaiters.push(r)) : Promise.resolve(); }
/** Chạy hết hàng ngay (kiểm thử). */
export function flushFootprints() { while (jobs.length) if (jobs[0](Infinity)) jobs.shift(); }

/**
 * Đưa hình khối của obj vào lưới va chạm (cuốn chiếu, không chặn khung hình).
 * @param lo, hi    dải cắt tính từ chân (m) — mặc định 0,4 → 2,0 (tầm thân người, bước qua bậc thấp)
 * @param base      độ cao chân; mặc định = đáy khung bao (InstancedMesh: ground(x, z) tại từng bản sao)
 * @param ground    (x, z) → độ cao mặt đất, cho InstancedMesh
 * @param keep      (x, z) → false = bỏ qua ô này (khoét lối đi qua cổng)
 */
export function addFootprint(obj, { lo = 0.4, hi = 2.0, base = null, ground = null, keep = null } = {}) {
  if (!obj) return;
  obj.updateMatrixWorld(true);
  const root = obj.isLOD && obj.levels.length ? obj.levels[obj.levels.length - 1].object : obj;
  root.updateMatrixWorld(true);
  const bb = new THREE.Box3().setFromObject(root);
  const rec = { name: obj.name || root.children[0]?.name || obj.type, x: (bb.min.x + bb.max.x) / 2, z: (bb.min.z + bb.max.z) / 2, w: bb.max.x - bb.min.x, d: bb.max.z - bb.min.z, h: bb.max.y - bb.min.y, base: base ?? bb.min.y, cells: 0 };
  FP.push(rec);
  const mark = (i, j) => { if (keep && !keep((i + 0.5) * CELL, (j + 0.5) * CELL)) return; markSolidCell(i, j); rec.cells++; };
  const b0 = base ?? bb.min.y;
  root.traverse((o) => {
    if (!o.isMesh || !o.geometry) return;
    if (o.isInstancedMesh) {
      for (let k = 0; k < o.count; k++) {
        o.getMatrixAt(k, IM); M.multiplyMatrices(o.matrixWorld, IM);
        V.setFromMatrixPosition(M);
        const b = ground ? ground(V.x, V.z) : b0;
        const j = rasterJob(o.geometry, M, b + lo, b + hi, mark); if (j) jobs.push(j);
      }
    } else { const j = rasterJob(o.geometry, o.matrixWorld, b0 + lo, b0 + hi, mark); if (j) jobs.push(j); }
  });
  if (!pumping && jobs.length) { pumping = true; tick(pump); }
}
