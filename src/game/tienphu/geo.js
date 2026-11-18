// ============================================================================
//  HÌNH HỌC DÙNG CHUNG cho tiên phủ (three.js): hộp UV theo mét, sàn đa giác có lỗ, vành mái hiên (skirt) cong vểnh
//  góc, mái chóp đa giác, lan can, cột có chân / đầu. Toạ độ đa giác khớp tienphu/tower.js (cạnh phẳng trên trục).
// ============================================================================
import * as THREE from 'three';
import { polyVerts, polySides } from './tower.js';

/** UV theo mét: mặt đứng u = dọc cạnh / su, v = y / sv; mặt ngang u = x / sh, v = z / sh */
export function uvMeters(geo, su = 3.6, sv = 5, sh = 4, yOff = 0) {
  const p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv;
  if (!uv || !n) return geo;
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i));
    if (ay > 0.7) uv.setXY(i, p.getX(i) / sh, p.getZ(i) / sh);
    else uv.setXY(i, (ax > 0.5 ? p.getZ(i) : p.getX(i)) / su, (p.getY(i) - yOff) / sv);
  }
  uv.needsUpdate = true; return geo;
}
/** hộp đặt tại (x, y tâm, z) xoay ry, UV theo mét (gọi uvMeters SAU khi đặt để vân liền giữa các hộp) */
export function boxAt(w, h, d, x, y, z, ry = 0, uv = null) {
  const g = new THREE.BoxGeometry(w, h, d);
  if (ry) g.rotateY(ry);
  g.translate(x, y, z);
  if (uv) uvMeters(g, ...uv);
  return g;
}
export function cylAt(r1, r2, h, x, y, z, seg = 12) { const g = new THREE.CylinderGeometry(r1, r2, h, seg); g.translate(x, y, z); return g; }

/** lăng trụ đa giác n cạnh (apothem a) từ y0 cao h — cạnh phẳng trên trục */
export function polyPrism(n, a, y0, h, aTop = a) {
  const r = a / Math.cos(Math.PI / n), rt = aTop / Math.cos(Math.PI / n);
  const g = new THREE.CylinderGeometry(rt, r, h, n, 1, false, Math.PI / n);
  g.translate(0, y0 + h / 2, 0); return g;
}
/** Shape đa giác (toạ độ x, −z để sau khi xoay nằm đúng z) */
function polyShape(n, a) {
  const v = polyVerts(n, a), s = new THREE.Shape();
  v.forEach(([x, z], i) => (i ? s.lineTo(x, -z) : s.moveTo(x, -z))); s.closePath(); return s;
}
/** sàn đa giác dày t, mặt trên ở y; holes: [{ x, z, hw, hd }] chữ nhật khoét */
export function polySlab(n, a, y, t, holes = []) {
  const s = polyShape(n, a);
  for (const h of holes) { const p = new THREE.Path(); p.moveTo(h.x - h.hw, -(h.z - h.hd)); p.lineTo(h.x + h.hw, -(h.z - h.hd)); p.lineTo(h.x + h.hw, -(h.z + h.hd)); p.lineTo(h.x - h.hw, -(h.z + h.hd)); p.closePath(); s.holes.push(p); }
  const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false, curveSegments: 1 });
  g.rotateX(-Math.PI / 2); g.translate(0, y - t, 0);
  // ExtrudeGeometry: sau xoay, mặt trên ở y; UV mặt ngang theo mét / 4
  const p = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / 4, p.getZ(i) / 4);
  g.computeVertexNormals(); return g;
}
/** mặt phủ (shape + lỗ elip / chữ nhật) mỏng — thảm cỏ có lỗ hồ */
// ---- GỘP LỖ CHỒNG NHAU (docs/TIEN-PHU-MATBANG-MANIFEST.md): earcut không chịu lỗ chồng / chạm nhau — ao con dơi 3 elip,
//      kênh chữ thập + hồ tâm Mughal, hào vuông 4 dải chạm góc từng làm thảm cỏ / mặt đảo vỡ (ảnh trên cao Quân Thiên).
//      Nhóm lỗ chạm nhau → raster 0,25 m → lần biên (ô nước bên trái) → bỏ điểm thẳng hàng → Douglas–Peucker 0,15 m.
//      Biên ngược chiều (CW) = đảo đất bên trong nhóm nước (hào bao nội thành) → trả về để phủ cỏ riêng.
export const inHole = (h, x, z, m = 0) => (h.rx ? ((x - h.x) / (h.rx + m)) ** 2 + ((z - h.z) / (h.rz + m)) ** 2 < 1 : Math.abs(x - h.x) < h.hw + m && Math.abs(z - h.z) < h.hd + m);
const holeBB = (h) => (h.rx ? [h.x - h.rx, h.z - h.rz, h.x + h.rx, h.z + h.rz] : [h.x - h.hw, h.z - h.hd, h.x + h.hw, h.z + h.hd]);
function touch(a, b) {
  const A = holeBB(a), B = holeBB(b), x0 = Math.max(A[0], B[0]) - 0.3, z0 = Math.max(A[1], B[1]) - 0.3, x1 = Math.min(A[2], B[2]) + 0.3, z1 = Math.min(A[3], B[3]) + 0.3;
  if (x0 > x1 || z0 > z1) return false;
  for (let x = x0; x <= x1; x += 0.25) for (let z = z0; z <= z1; z += 0.25) if (inHole(a, x, z, 0.15) && inHole(b, x, z, 0.15)) return true;
  return false;
}
function simplify(pts, tol) {
  // bỏ điểm thẳng hàng rồi Douglas–Peucker (vòng kín: cắt tại điểm 0 và điểm xa nhất)
  const q = pts.filter((p, i) => { const a = pts[(i - 1 + pts.length) % pts.length], b = pts[(i + 1) % pts.length]; return Math.abs((p[0] - a[0]) * (b[1] - a[1]) - (p[1] - a[1]) * (b[0] - a[0])) > 1e-9; });
  const dp = (seg) => { if (seg.length < 3) return seg; const [a, b] = [seg[0], seg[seg.length - 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-9; let mi = 0, md = 0; for (let i = 1; i < seg.length - 1; i++) { const d = Math.abs((b[0] - a[0]) * (a[1] - seg[i][1]) - (a[0] - seg[i][0]) * (b[1] - a[1])) / L; if (d > md) { md = d; mi = i; } } return md > tol ? [...dp(seg.slice(0, mi + 1)).slice(0, -1), ...dp(seg.slice(mi))] : [a, b]; };
  if (q.length < 4) return q;
  let far = 0, fd = 0; for (let i = 1; i < q.length; i++) { const d = Math.hypot(q[i][0] - q[0][0], q[i][1] - q[0][1]); if (d > fd) { fd = d; far = i; } }
  return [...dp(q.slice(0, far + 1)).slice(0, -1), ...dp([...q.slice(far), q[0]]).slice(0, -1)];
}
/** hợp các lỗ chồng nhau: { loops: [[x,z]…] (biên nước), islands: [[x,z]…] (đất bên trong) } */
export function unionHoles(group, cell = 0.25) {
  const B = group.map(holeBB), x0 = Math.min(...B.map((b) => b[0])) - 2 * cell, z0 = Math.min(...B.map((b) => b[1])) - 2 * cell, x1 = Math.max(...B.map((b) => b[2])) + 2 * cell, z1 = Math.max(...B.map((b) => b[3])) + 2 * cell;
  const nx = Math.ceil((x1 - x0) / cell), nz = Math.ceil((z1 - z0) / cell), occ = new Uint8Array(nx * nz);
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) { const x = x0 + (i + 0.5) * cell, z = z0 + (j + 0.5) * cell; if (group.some((h) => inHole(h, x, z))) occ[j * nx + i] = 1; }
  const O = (i, j) => i >= 0 && j >= 0 && i < nx && j < nz && occ[j * nx + i];
  const out = new Map(), key = (i, j) => j * (nx + 1) + i, add = (a, b) => { const k = key(...a); if (!out.has(k)) out.set(k, []); out.get(k).push(b); };
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) if (O(i, j)) {
    if (!O(i, j - 1)) add([i, j], [i + 1, j]); if (!O(i + 1, j)) add([i + 1, j], [i + 1, j + 1]);
    if (!O(i, j + 1)) add([i + 1, j + 1], [i, j + 1]); if (!O(i - 1, j)) add([i, j + 1], [i, j]);
  }
  const loops = [], islands = [];
  for (const [k0] of out) {
    while (out.get(k0)?.length) {
      const ring = []; let cur = [k0 % (nx + 1), Math.floor(k0 / (nx + 1))];
      for (let guard = 0; guard < nx * nz * 4; guard++) { const k = key(...cur), list = out.get(k); if (!list || !list.length) break; const nxt = list.pop(); ring.push([x0 + cur[0] * cell, z0 + cur[1] * cell]); cur = nxt; if (key(...cur) === k0) break; }
      if (ring.length < 4) continue;
      let area = 0; for (let i = 0; i < ring.length; i++) { const a = ring[i], b = ring[(i + 1) % ring.length]; area += a[0] * b[1] - b[0] * a[1]; }
      (area > 0 ? loops : islands).push(simplify(ring, cell * 0.6));
    }
  }
  return { loops, islands };
}
export function shapeWithHoles(outer, holes, y, t = 0.05) {
  const s = new THREE.Shape(); outer.forEach(([x, z], i) => (i ? s.lineTo(x, -z) : s.moveTo(x, -z))); s.closePath();
  // nhóm lỗ chạm nhau (union-find)
  const par = holes.map((_, i) => i), find = (i) => (par[i] === i ? i : (par[i] = find(par[i])));
  for (let a = 0; a < holes.length; a++) for (let b = a + 1; b < holes.length; b++) if (touch(holes[a], holes[b])) par[find(a)] = find(b);
  const groups = new Map(); holes.forEach((h, i) => { const r = find(i); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(h); });
  const isles = [];
  for (const grp of groups.values()) {
    if (grp.length === 1) {
      const h = grp[0], p = new THREE.Path();
      if (h.rx) p.absellipse(h.x, -h.z, h.rx, h.rz, 0, Math.PI * 2, true, 0);
      else { p.moveTo(h.x - h.hw, -(h.z - h.hd)); p.lineTo(h.x - h.hw, -(h.z + h.hd)); p.lineTo(h.x + h.hw, -(h.z + h.hd)); p.lineTo(h.x + h.hw, -(h.z - h.hd)); p.closePath(); }
      s.holes.push(p); continue;
    }
    const U = unionHoles(grp);
    for (const L of U.loops) { const p = new THREE.Path(); L.forEach(([x, z], i) => (i ? p.lineTo(x, -z) : p.moveTo(x, -z))); p.closePath(); s.holes.push(p); }
    isles.push(...U.islands);
  }
  const shapes = [s, ...isles.map((L) => { const q = new THREE.Shape(); L.forEach(([x, z], i) => (i ? q.lineTo(x, -z) : q.moveTo(x, -z))); q.closePath(); return q; })];
  const g = new THREE.ExtrudeGeometry(shapes, { depth: t, bevelEnabled: false, curveSegments: 24 });
  g.rotateX(-Math.PI / 2); g.translate(0, y - t, 0);
  const p = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / 6, p.getZ(i) / 6);
  g.computeVertexNormals(); return g;
}

/**
 * VÀNH MÁI HIÊN quanh đa giác: từ chân tường (apothem ai, cao y) dốc ra mép (apothem ao, thấp hơn drop), góc vểnh upturn.
 * Trả geometry (mặt trên + mặt dưới) — dùng cho mái từng tầng (Trung Hoa, Nhật, Huế, Thái) và mái đỉnh khi ai = 0.
 */
export function skirt(n, ai, ao, y, drop, upturn = 0.6, seg = 6) {
  const vi = polyVerts(n, ai), vo = polyVerts(n, ao), pos = [], idx = [];
  const corners = n <= 8; // đầu đao chỉ vểnh ở góc (bát giác / vuông), tròn 16 cạnh thì đều
  for (let k = 0; k < n; k++) {
    const a0 = vi[k], a1 = vi[(k + 1) % n], b0 = vo[k], b1 = vo[(k + 1) % n];
    for (let i = 0; i <= seg; i++) for (let j = 0; j <= 2; j++) {
      const t = i / seg, s = j / 2; // t dọc cạnh, s từ trong ra ngoài
      const ix = a0[0] + (a1[0] - a0[0]) * t, iz = a0[1] + (a1[1] - a0[1]) * t, ox = b0[0] + (b1[0] - b0[0]) * t, oz = b0[1] + (b1[1] - b0[1]) * t;
      const x = ix + (ox - ix) * s, z = iz + (oz - iz) * s;
      const cornerness = corners ? Math.max(0, 1 - Math.min(t, 1 - t) * 4) : 0; // 1 ở góc, 0 từ 1/4 cạnh
      const sag = Math.sin(s * Math.PI * 0.5);
      const yy = y - drop * sag * (1 - 0.15 * s) + upturn * cornerness * s * s * 1.4 + (s > 0.01 ? 0 : 0);
      pos.push(x, yy, z);
    }
  }
  const per = (seg + 1) * 3;
  for (let k = 0; k < n; k++) for (let i = 0; i < seg; i++) for (let j = 0; j < 2; j++) {
    const a = k * per + i * 3 + j, b = a + 3, c = a + 1, d = b + 1;
    idx.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  const uv = new Float32Array((pos.length / 3) * 2); for (let i = 0; i < pos.length / 3; i++) { uv[i * 2] = pos[i * 3] / 3; uv[i * 2 + 1] = pos[i * 3 + 2] / 3; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
}
/** mái chóp đa giác (ai = 0 ở đỉnh): từ apothem a ở y lên đỉnh cao h, phình cong (curve > 0) */
export function pyramidRoof(n, a, y, h, curve = 0.25, upturn = 0.5) {
  const g = new THREE.BufferGeometry(), pos = [], idx = [], rings = 6, v0 = polyVerts(n, a);
  for (let r = 0; r <= rings; r++) {
    const t = r / rings, sc = 1 - t, yy = y + h * Math.pow(t, 1 + curve); // lõm (mái Á Đông): thoải ở hiên, dốc dần lên đỉnh
    for (let k = 0; k <= n; k++) { const [x, z] = v0[k % n]; const corner = r === 0 && n <= 8 ? upturn : 0; pos.push(x * sc, yy + corner, z * sc); }
  }
  for (let r = 0; r < rings; r++) for (let k = 0; k < n; k++) { const a0 = r * (n + 1) + k, b0 = a0 + n + 1; idx.push(a0, b0, a0 + 1, a0 + 1, b0, b0 + 1); }
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  const uv = new Float32Array((pos.length / 3) * 2); for (let i = 0; i < pos.length / 3; i++) { uv[i * 2] = pos[i * 3] / 3; uv[i * 2 + 1] = pos[i * 3 + 2] / 3; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
}
/** lan can dọc đa giác apothem a ở cao y: trụ mỗi ~1,6 m + tay vịn + thanh dưới. skip(x, z) → bỏ trụ / đoạn (lối cửa) */
export function railPoly(n, a, y, h = 1.1, skip = null, step = 1.6) {
  const out = [];
  for (const sd of polySides(n, a)) {
    const m = Math.max(1, Math.round(sd.len / step));
    for (let i = 0; i <= m; i++) { const t = i / m, x = sd.x0 + (sd.x1 - sd.x0) * t, z = sd.z0 + (sd.z1 - sd.z0) * t; if (skip && skip(x, z)) continue; out.push(boxAt(0.16, h, 0.16, x, y + h / 2, z)); }
    for (let i = 0; i < m; i++) {
      const t = (i + 0.5) / m, x = sd.x0 + (sd.x1 - sd.x0) * t, z = sd.z0 + (sd.z1 - sd.z0) * t; if (skip && skip(x, z)) continue;
      out.push(boxAt(sd.len / m + 0.05, 0.1, 0.14, x, y + h - 0.05, z, sd.ry), boxAt(sd.len / m + 0.05, 0.08, 0.1, x, y + 0.25, z, sd.ry));
    }
  }
  return out;
}
/** đoạn lan can thẳng từ (ax, az) tới (bx, bz) ở cao y */
export function railLine(ax, az, bx, bz, y, h = 1.0, step = 1.4) {
  const out = [], len = Math.hypot(bx - ax, bz - az), m = Math.max(1, Math.round(len / step)), ry = Math.atan2(-(bz - az), bx - ax);
  for (let i = 0; i <= m; i++) { const t = i / m; out.push(boxAt(0.14, h, 0.14, ax + (bx - ax) * t, y + h / 2, az + (bz - az) * t)); }
  out.push(boxAt(len, 0.09, 0.12, (ax + bx) / 2, y + h - 0.05, (az + bz) / 2, ry), boxAt(len, 0.07, 0.09, (ax + bx) / 2, y + 0.3, (az + bz) / 2, ry));
  return out;
}
/** cột có chân đá + đầu cột (style: 'round' | 'square' | 'corinth' | 'lotus') */
export function columnGeo(x, z, y, h, r = 0.32, style = 'round') {
  const out = [];
  if (style === 'square') out.push(boxAt(r * 2, h, r * 2, x, y + h / 2, z));
  else out.push(cylAt(r * 0.92, r, h, x, y + h / 2, z, style === 'corinth' ? 16 : 12));
  out.push(cylAt(r * 1.35, r * 1.5, 0.3, x, y + 0.15, z, 10));                                  // chân
  if (style === 'corinth') out.push(cylAt(r * 1.6, r * 1.05, 0.7, x, y + h - 0.35, z, 12), boxAt(r * 3.4, 0.22, r * 3.4, x, y + h - 0.05, z));
  else if (style === 'lotus') out.push(cylAt(r * 1.5, r, 0.5, x, y + h - 0.25, z, 10));
  else out.push(boxAt(r * 2.6, 0.32, r * 2.6, x, y + h - 0.16, z));                                // đấu / đầu cột
  return out;
}
