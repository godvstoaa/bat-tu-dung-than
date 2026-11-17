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
export function shapeWithHoles(outer, holes, y, t = 0.05) {
  const s = new THREE.Shape(); outer.forEach(([x, z], i) => (i ? s.lineTo(x, -z) : s.moveTo(x, -z))); s.closePath();
  for (const h of holes) {
    const p = new THREE.Path();
    if (h.rx) p.absellipse(h.x, -h.z, h.rx, h.rz, 0, Math.PI * 2, true, 0);
    else { p.moveTo(h.x - h.hw, -(h.z - h.hd)); p.lineTo(h.x - h.hw, -(h.z + h.hd)); p.lineTo(h.x + h.hw, -(h.z + h.hd)); p.lineTo(h.x + h.hw, -(h.z - h.hd)); p.closePath(); }
    s.holes.push(p);
  }
  const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false, curveSegments: 24 });
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
