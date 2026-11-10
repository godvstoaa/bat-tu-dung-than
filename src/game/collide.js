// ============================================================================
//  VA CHẠM THEO HÌNH KHỐI — cắt lát model ở tầm thân người rồi đánh dấu vào lưới 0,5 m (obstacles.js).
//  Mỗi tam giác được cắt theo dải [chân + lo, chân + hi]; phần còn lại chiếu xuống mặt phẳng XZ:
//  cạnh → đánh dấu dọc theo cạnh (tường mỏng, cột), mặt → tô các ô có tâm nằm trong.
//  Nhờ vậy tường / cột / bậc đều chặn thật, cửa vòm mở ở tầm thân người vẫn đi qua được.
//  Model có LOD: lấy bản xa (ít tam giác, cùng hình dáng). InstancedMesh: mỗi bản sao một lần.
// ============================================================================
import * as THREE from 'three';
import { span } from './perf.js';
import { CELL, markSolidCell, unmarkSolidCell, cellOf, isReserved, addTall } from './obstacles.js';

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

// ---------------------------------------------------------------------------
// Đặc hoá công trình lớn: lát cắt tầm thân người chỉ cho VIỀN tường, mà mô hình Meshy (remesh)
// hay có khe hở 1–3 m trên viền → chui qua một khe là vào lòng điện rỗng, đi lại trong đó.
// Sau khi cắt xong: đóng khe (giãn rồi co R ô) + lấp mọi vùng kín không thông ra ngoài.
// Lối thông suốt hai đầu (đường hầm cổng thành) vẫn thông ra ngoài → không bị lấp; lối giữa
// cổng còn được `keep` khoét lại sau cùng.
// ---------------------------------------------------------------------------
const KO = 32768, KS = 65536;
const keyOf = (i, j) => (i + KO) * KS + (j + KO);
function morph(src, W, H, r, grow) {
  const tmp = new Uint8Array(W * H), out = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = grow ? 0 : 1;
    for (let d = -r; d <= r; d++) { const xx = x + d; const s = xx < 0 || xx >= W ? 0 : src[y * W + xx]; if (grow ? s : !s) { v = grow ? 1 : 0; break; } }
    tmp[y * W + x] = v;
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = grow ? 0 : 1;
    for (let d = -r; d <= r; d++) { const yy = y + d; const s = yy < 0 || yy >= H ? 0 : tmp[yy * W + x]; if (grow ? s : !s) { v = grow ? 1 : 0; break; } }
    out[y * W + x] = v;
  }
  return out;
}
/** Tập ô (khoá keyOf) → danh sách [i, j] sau khi đóng khe bán kính r và lấp vùng kín. */
export function solidifyCells(cells, r = 2) {
  if (!cells.size) return [];
  let i0 = Infinity, i1 = -Infinity, j0 = Infinity, j1 = -Infinity;
  for (const k of cells) { const i = Math.floor(k / KS) - KO, j = (k % KS) - KO; if (i < i0) i0 = i; if (i > i1) i1 = i; if (j < j0) j0 = j; if (j > j1) j1 = j; }
  const pad = r + 1, W = i1 - i0 + 1 + 2 * pad, H = j1 - j0 + 1 + 2 * pad;
  let g = new Uint8Array(W * H);
  for (const k of cells) { const i = Math.floor(k / KS) - KO, j = (k % KS) - KO; g[(j - j0 + pad) * W + (i - i0 + pad)] = 1; }
  if (r > 0) { const c = morph(morph(g, W, H, r, true), W, H, r, false); for (let n = 0; n < g.length; n++) g[n] |= c[n]; }
  // loang từ viền khung (luôn trống nhờ pad) qua ô trống, 4 hướng — ô trống không tới được = vùng kín
  const seen = new Uint8Array(W * H), stack = new Int32Array(W * H);
  let sp = 0;
  const push = (n) => { if (!g[n] && !seen[n]) { seen[n] = 1; stack[sp++] = n; } };
  for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
  while (sp) {
    const n = stack[--sp], x = n % W, y = (n - x) / W;
    if (x > 0) push(n - 1); if (x < W - 1) push(n + 1); if (y > 0) push(n - W); if (y < H - 1) push(n + W);
  }
  const out = [];
  for (let n = 0; n < g.length; n++) if (g[n] || !seen[n]) out.push([(n % W) - pad + i0, Math.floor(n / W) - pad + j0]);
  return out;
}

/**
 * Đưa hình khối của obj vào lưới va chạm (cuốn chiếu, không chặn khung hình).
 * @param lo, hi    dải cắt tính từ chân (m) — mặc định 0,4 → 2,0 (tầm thân người, bước qua bậc thấp)
 * @param base      độ cao chân; mặc định = đáy khung bao (InstancedMesh: ground(x, z) tại từng bản sao)
 * @param ground    (x, z) → độ cao mặt đất, cho InstancedMesh
 * @param keep      (x, z) → false = bỏ qua ô này (khoét lối đi qua cổng)
 * @param fill      đặc hoá (đóng khe + lấp lòng kín): true / false / 'auto' (mặc định — chỉ khi
 *                  khung bao mỗi bản ≥ FILL_MIN m cả hai chiều: điện, cổng, nhà; không đụng đình nhỏ, cây)
 */
const FILL_MIN = 10;
const BB = new THREE.Box3();
export function addFootprint(obj, { lo = 0.4, hi = 2.0, base = null, ground = null, keep = null, fill = 'auto' } = {}) {
  if (!obj) return;
  obj.updateWorldMatrix(true, true); // cả chuỗi cha (vật nằm trong nhóm con chưa cập nhật ma trận vẫn đúng chỗ)
  // LOD: bậc xa nhất CÓ hình (bậc cuối có thể là Object3D rỗng «ẩn khi rất xa» — assets.placeLod)
  const hasMesh = (o) => { let m = false; o.traverse((c) => { if (c.isMesh) m = true; }); return m; };
  const root = obj.isLOD && obj.levels.length ? [...obj.levels].reverse().find((l) => hasMesh(l.object))?.object || obj : obj;
  root.updateMatrixWorld(true);
  const bb = new THREE.Box3().setFromObject(root);
  const rec = { name: obj.name || root.children[0]?.name || obj.type, x: (bb.min.x + bb.max.x) / 2, z: (bb.min.z + bb.max.z) / 2, w: bb.max.x - bb.min.x, d: bb.max.z - bb.min.z, h: bb.max.y - bb.min.y, base: base ?? bb.min.y, cells: 0, filled: false };
  FP.push(rec); Object.defineProperty(rec, 'obj', { value: obj }); // gỡ lỗi: __footprints[i].obj
  // ô + đỉnh của riêng công trình này (phá hủy / dựng lại — raze.js); bị phá rồi thì chỉ ghi, không đánh dấu
  Object.defineProperty(rec, 'own', { value: { cells: [], tops: [] } });
  const markFinal = (i, j) => { if (keep && !keep((i + 0.5) * CELL, (j + 0.5) * CELL)) return; if (!rec.razed) markSolidCell(i, j); rec.own.cells.push(i, j); rec.cells++; };
  const big = (w, d) => fill === true || (fill === 'auto' && Math.min(w, d) >= FILL_MIN);
  // một «đơn vị» = một vật (hoặc một bản sao của InstancedMesh): các việc cắt lát + việc đặc hoá cuối
  const unit = (solidify, w, d, addJobs) => {
    if (!solidify) { addJobs(markFinal); return; }
    rec.filled = true;
    const cells = new Set(), before = jobs.length;
    addJobs((i, j) => cells.add(keyOf(i, j)));
    if (jobs.length === before) return;
    // khe / hốc lõm rộng ≤ 2r ô được đóng: 1 m (nhà, điện phụ) · 2 m (điện, cổng dài ≥ 30 m — hốc bậc
    // bên hông bệ hay rộng 3–4 m); lối qua cổng thật được `keep` khoét lại
    const r = Math.max(w, d) >= 30 ? 4 : 2;
    jobs.push(() => {
      for (const [i, j] of solidifyCells(cells, r)) {
        // ô do lấp thêm (không phải hình khối thật) rơi vào vùng chừa trống của trạm → bỏ
        if (!cells.has(keyOf(i, j)) && isReserved((i + 0.5) * CELL, (j + 0.5) * CELL)) continue;
        markFinal(i, j);
      }
      return true;
    });
  };
  const b0 = base ?? bb.min.y;
  // InstancedMesh: bản sao thứ k của mọi mesh con (một model nhiều mesh) gộp thành một đơn vị
  const inst = [];
  root.traverse((o) => { if (o.isInstancedMesh && o.geometry) { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); inst.push(o); } });
  const nInst = inst.reduce((m, o) => Math.max(m, o.count), 0);
  for (let k = 0; k < nInst; k++) {
    const parts = [];
    BB.makeEmpty();
    for (const o of inst) {
      if (k >= o.count) continue;
      o.getMatrixAt(k, IM); const Mk = new THREE.Matrix4().multiplyMatrices(o.matrixWorld, IM);
      BB.union(new THREE.Box3().copy(o.geometry.boundingBox).applyMatrix4(Mk));
      parts.push([o.geometry, Mk]);
    }
    if (!parts.length) continue;
    rec.own.tops.push(addTall((BB.min.x + BB.max.x) / 2, (BB.min.z + BB.max.z) / 2, (BB.max.x - BB.min.x) / 2, (BB.max.z - BB.min.z) / 2, 0, BB.max.y)); // đỉnh từng bản sao (leo trèo)
    V.setFromMatrixPosition(parts[0][1]);
    const b = ground ? ground(V.x, V.z) : b0, w = BB.max.x - BB.min.x, d = BB.max.z - BB.min.z;
    unit(big(w, d), w, d, (mark) => { for (const [geo, Mk] of parts) { const j = rasterJob(geo, Mk, b + lo, b + hi, mark); if (j) jobs.push(j); } });
  }
  // các mesh thường của cùng một vật gộp chung một đơn vị (lòng điện kín tạo bởi nhiều mesh)
  const meshes = [];
  root.traverse((o) => { if (o.isMesh && o.geometry && !o.isInstancedMesh) meshes.push(o); });
  if (meshes.length && rec.w < 300 && rec.d < 300) rec.own.tops.push(addTall(rec.x, rec.z, rec.w / 2, rec.d / 2, 0, bb.max.y)); // đỉnh công trình (leo trèo)
  if (meshes.length) unit(big(rec.w, rec.d), rec.w, rec.d, (mark) => { for (const o of meshes) { const j = rasterJob(o.geometry, o.matrixWorld, b0 + lo, b0 + hi, mark); if (j) jobs.push(j); } });
  rec.inst = nInst > 0; rec.top = bb.max.y;
  for (const f of onAdd) f(rec);
  if (!pumping && jobs.length) { pumping = true; tick(pump); }
}

// ---------------------------------------------------------------------------
// PHÁ HỦY (raze.js): gỡ ô va chạm + hạ đỉnh của một công trình; dựng lại thì đánh dấu lại.
// ---------------------------------------------------------------------------
const onAdd = [];
/** gọi f(rec) mỗi khi một công trình vào sổ (raze.js đánh dấu công trình phá được) */
export function onFootprint(f) { onAdd.push(f); for (const r of FP) f(r); }
export const footprints = () => FP;
export function razeFootprint(rec) {
  if (rec.razed) return; rec.razed = true;
  const c = rec.own.cells; for (let k = 0; k < c.length; k += 2) unmarkSolidCell(c[k], c[k + 1]);
  for (const t of rec.own.tops) { t.top0 = t.top; t.top = -1e9; }
}
export function restoreFootprint(rec) {
  if (!rec.razed) return; rec.razed = false;
  const c = rec.own.cells; for (let k = 0; k < c.length; k += 2) markSolidCell(c[k], c[k + 1]);
  for (const t of rec.own.tops) if (t.top0 != null) t.top = t.top0;
}
