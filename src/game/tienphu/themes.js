// ============================================================================
//  ĐỒ BÀI TRÍ THEO CHỦ ĐỀ TẦNG (lầu 10 tầng — TIEN-PHU-MANIFEST §3): Đại Sảnh · Trà Thất · Thư Lâu · Yến Sảnh · Tẩm Cung ·
//  Thiền Phòng · Đan Phòng · Bảo Khố · Nhạc Các · Vọng Nguyệt Đường. Chủ phủ đổi chủ đề từng tầng (custom.themes).
//  Mọi món đặt trong vùng sạch: tránh dải thang, lỗ thang, đĩa thang phép, lối cửa trước / sau (khớp floorZone.keep).
//  Va chạm: lấy từ chính lưới hình (tienphu/voxel.js) — món nào thấy được ở tầm thân người là chặn.
// ============================================================================
import * as THREE from 'three';
import { insidePoly, floorZone, LEVELS } from './tower.js';
import { boxAt, cylAt } from './geo.js';

const sph = (r, x, y, z, sx = 1, sy = 1, sz = 1) => { const g = new THREE.SphereGeometry(r, 12, 8); g.scale(sx, sy, sz); g.translate(x, y, z); return g; };
const torus = (r, t, x, y, z, rx = 0, ry = 0) => { const g = new THREE.TorusGeometry(r, t, 6, 24); g.rotateX(rx); g.rotateY(ry); g.translate(x, y, z); return g; };

/** đặt đồ của tầng k theo chủ đề theme (0..9, 10 = để trống) vào acc (khoá vật liệu tpMats) */
export function themeFurniture(acc, spec, k, theme, st) {
  const f = spec.floors[k], n = spec.n, a = f.a, z0 = floorZone(spec, k);
  furnishCore(acc, { Y: f.y, a, q: Math.min(z0.half, a - 3.4), keep: z0.keep, inside: (x, z, r) => insidePoly(n, a - 0.9, x, z, r) }, theme);
}
/** đồ mặc định trong một SẢNH (cục bộ sảnh, cửa +z): hw / hd nửa lòng sảnh, y mặt sàn, back: có cửa sau */
export function hallFurniture(acc, { hw, hd, y, back }, theme) {
  const keep = [{ x: 0, z: hd - 1.6, w: 3.4, d: 3.6 }]; if (back) keep.push({ x: 0, z: -hd + 1.6, w: 3.4, d: 3.6 });
  furnishCore(acc, { Y: y, a: hd, q: Math.min(hw, hd) - 1.8, keep, inside: (x, z, r) => Math.abs(x) < hw - 0.9 - r && Math.abs(z) < hd - 0.9 - r }, theme);
}
function furnishCore(acc, F, theme) {
  const { Y, a, q, keep } = F;
  // điểm (x, z) có r bán kính còn sạch?
  const clear = (x, z, rx, rz = rx) => F.inside(x, z, Math.hypot(rx, rz)) && !keep.some((kp) => Math.abs(x - kp.x) < kp.w / 2 + rx && Math.abs(z - kp.z) < kp.d / 2 + rz);
  const put = (x, z, rx, rz, fn) => { if (clear(x, z, rx, rz)) fn(x, z); };
  const table = (x, z, w, d, h = 0.78, mat = 'wood') => { acc.add(mat, boxAt(w, 0.08, d, x, Y + h, z)); for (const sx of [-1, 1]) for (const sz of [-1, 1]) acc.add(mat, boxAt(0.1, h, 0.1, x + sx * (w / 2 - 0.12), Y + h / 2, z + sz * (d / 2 - 0.12))); };
  const cushion = (x, z) => acc.add('redLacquer', cylAt(0.38, 0.42, 0.16, x, Y + 0.08, z, 10));
  const vase = (x, z, h = 1.4) => acc.add('marble', sph(0.35, x, Y + h * 0.45, z, 1, h / 0.9, 1), cylAt(0.16, 0.2, 0.3, x, Y + h * 0.95, z, 10));
  const plant = (x, z) => { acc.add('stoneDark', cylAt(0.35, 0.28, 0.5, x, Y + 0.25, z, 10)); acc.add('hedge', sph(0.6, x, Y + 1.0, z, 1, 0.9, 1)); };
  const shelf = (x, z, len, ry = 0) => { acc.add('wood', boxAt(len, 2.4, 0.55, x, Y + 1.2, z, ry)); for (let i = 0; i < 4; i++) acc.add(['redLacquer', 'beam', 'gold', 'trim'][i], boxAt(len - 0.3, 0.3, 0.4, x, Y + 0.45 + i * 0.55, z, ry)); };
  const lamp = (x, z) => { acc.add('gold', cylAt(0.06, 0.08, 1.4, x, Y + 0.7, z, 6)); acc.add('lampGlow', sph(0.28, x, Y + 1.55, z, 1, 1.3, 1)); };
  const chest = (x, z, ry = 0) => { acc.add('redLacquer', boxAt(1.2, 0.7, 0.8, x, Y + 0.35, z, ry)); acc.add('gold', boxAt(1.24, 0.08, 0.84, x, Y + 0.72, z, ry), boxAt(0.1, 0.72, 0.84, x, Y + 0.36, z, ry)); };
  // khung đồ hai bên (đối xứng) + giữa
  const sides = (fn, rows = 3, xr = 0.62) => { for (const sx of [-1, 1]) for (let i = 0; i < rows; i++) { const x = sx * q * xr, z = -q * 0.55 + (i * q * 1.3) / Math.max(1, rows - 1); fn(x, z, sx); } };
  if (theme >= 10) { for (const sx of [-1, 1]) put(sx * q * 0.9, q * 0.9, 0.4, 0.4, lamp); return; } // để trống: chủ phủ tự bài trí
  switch (((theme % 10) + 10) % 10) {
    case 0: // Đại Sảnh: thảm tròn, bệ + ngai, hai dãy ghế khách + bàn trà, đỉnh hương, bình, đèn
      acc.add('redLacquer', cylAt(Math.min(4.5, q * 0.55), Math.min(4.5, q * 0.55), 0.03, 0, Y + 0.04, 1.5, 32));
      put(0, -1.6, 3, 1.6, (x, z) => { acc.add('stone', boxAt(5, 0.4, 2.8, x, Y + 0.2, z)); acc.add('gold', boxAt(1.6, 0.5, 1, x, Y + 0.65, z), boxAt(1.6, 1.6, 0.25, x, Y + 1.2, z - 0.4), boxAt(0.2, 0.6, 1, x - 0.7, Y + 0.9, z), boxAt(0.2, 0.6, 1, x + 0.7, Y + 0.9, z)); acc.add('banner', boxAt(4.4, 2.6, 0.08, x, Y + 2.3, z - 1.3)); });
      sides((x, z) => put(x, z, 1, 1, () => { acc.add('wood', boxAt(0.9, 0.5, 0.9, x, Y + 0.25, z), boxAt(0.9, 0.9, 0.12, x, Y + 0.95, z - 0.4)); table(x + Math.sign(-x) * 1.2, z, 0.7, 0.7, 0.6); }), 4, 0.6);
      put(0, 3.4, 0.8, 0.8, (x, z) => { acc.add('gold', cylAt(0.6, 0.45, 0.8, x, Y + 0.7, z, 12)); for (let i = 0; i < 3; i++) acc.add('gold', cylAt(0.06, 0.06, 0.7, x + Math.cos(i * 2.1) * 0.45, Y + 0.25, z + Math.sin(i * 2.1) * 0.45, 5)); });
      for (const sx of [-1, 1]) { put(sx * 3.4, -2.2, 0.5, 0.5, (x, z) => vase(x, z, 1.6)); put(sx * 2.6, 4.6, 0.4, 0.4, lamp); }
      break;
    case 1: // Trà Thất: 4 bàn trà thấp + 4 nệm mỗi bàn, lò trà, bình phong trúc, chậu cây
      for (const [u, v] of [[-0.45, -0.3], [0.45, -0.3], [-0.45, 0.45], [0.45, 0.45]]) put(u * q, v * q, 1.6, 1.6, (x, z) => { table(x, z, 1.2, 1.2, 0.35); for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) cushion(x + dx * 1.05, z + dz * 1.05); acc.add('marble', cylAt(0.08, 0.1, 0.12, x, Y + 0.45, z, 8)); });
      put(0, 0.6, 0.6, 0.6, (x, z) => { acc.add('dark', cylAt(0.35, 0.4, 0.7, x, Y + 0.35, z, 10)); acc.add('stoneDark', cylAt(0.22, 0.25, 0.35, x, Y + 0.85, z, 10)); });
      for (const sx of [-1, 1]) { put(sx * q * 0.85, 0.4, 0.2, 1.4, (x, z) => acc.add('wood', boxAt(0.1, 1.8, 2.6, x, Y + 0.9, z))); put(sx * q * 0.2, q * 0.8, 0.5, 0.5, plant); }
      break;
    case 2: // Thư Lâu: kệ sách hai bên, bàn đọc giữa, giá cuộn thư, đèn
      for (const sx of [-1, 1]) for (let i = 0; i < 4; i++) put(sx * q * 0.62, -q * 0.6 + i * q * 0.42, 0.4, 1.6, (x, z) => shelf(x, z, 3, Math.PI / 2));
      put(0, 1.4, 1.4, 0.8, (x, z) => { table(x, z, 2.4, 1.1, 0.8, 'redLacquer'); acc.add('wood', boxAt(0.6, 0.5, 0.6, x, Y + 0.25, z + 1.0)); acc.add('marble', boxAt(0.5, 0.06, 0.35, x - 0.5, Y + 0.87, z)); });
      for (const sx of [-1, 1]) { put(sx * 2.4, -1.6, 0.4, 0.4, lamp); put(sx * 2.6, 3.6, 0.6, 0.4, (x, z) => { acc.add('wood', boxAt(1, 1.4, 0.5, x, Y + 0.7, z)); for (let i = 0; i < 4; i++) acc.add('marble', cylAt(0.06, 0.06, 0.9, x - 0.3 + i * 0.2, Y + 1.0, z + 0.05, 6)); }); }
      break;
    case 3: // Yến Sảnh: bàn tiệc dài + ghế hai bên, 4 bàn tròn, vò rượu, đèn
      put(0, 1.6, 1.0, 3.4, (x, z) => { table(x, z, 1.5, 6, 0.8, 'redLacquer'); for (const sx of [-1, 1]) for (let i = 0; i < 5; i++) acc.add('wood', boxAt(0.5, 0.48, 0.5, x + sx * 1.15, Y + 0.24, z - 2.4 + i * 1.2)); acc.add('gold', cylAt(0.25, 0.2, 0.2, x, Y + 0.95, z, 10)); });
      for (const [u, v] of [[-0.55, -0.35], [0.55, -0.35], [-0.55, 0.55], [0.55, 0.55]]) put(u * q, v * q, 1.4, 1.4, (x, z) => { acc.add('redLacquer', cylAt(0.9, 0.9, 0.08, x, Y + 0.78, z, 20), cylAt(0.18, 0.25, 0.75, x, Y + 0.38, z, 10)); for (let i = 0; i < 5; i++) acc.add('wood', cylAt(0.22, 0.22, 0.45, x + Math.cos(i * 1.26) * 1.3, Y + 0.22, z + Math.sin(i * 1.26) * 1.3, 8)); });
      for (const sx of [-1, 1]) put(sx * q * 0.85, -q * 0.7, 0.5, 0.5, (x, z) => { acc.add('stoneDark', sph(0.4, x, Y + 0.4, z, 1, 1.2, 1)); acc.add('redLacquer', cylAt(0.2, 0.22, 0.1, x, Y + 0.85, z, 8)); });
      break;
    case 4: // Tẩm Cung: giường màn bốn cột, bàn trang điểm, tủ áo, bình phong, thảm
      put(-q * 0.45, -0.6, 1.8, 1.4, (x, z) => { acc.add('wood', boxAt(3, 0.55, 2.2, x, Y + 0.28, z)); acc.add('marble', boxAt(2.8, 0.2, 2, x, Y + 0.65, z)); for (const sx of [-1, 1]) for (const sz of [-1, 1]) acc.add('redLacquer', boxAt(0.14, 2.6, 0.14, x + sx * 1.45, Y + 1.3, z + sz * 1.05)); acc.add('banner', boxAt(3.1, 0.08, 2.3, x, Y + 2.6, z), boxAt(3.1, 1.2, 0.04, x, Y + 2.0, z - 1.1)); });
      put(q * 0.5, -q * 0.5, 0.7, 0.4, (x, z) => { table(x, z, 1.2, 0.6, 0.75, 'redLacquer'); acc.add('glass', boxAt(0.8, 0.9, 0.04, x, Y + 1.3, z - 0.25)); });
      put(q * 0.62, 1.4, 0.4, 1.0, (x, z) => acc.add('wood', boxAt(0.7, 2.2, 1.8, x, Y + 1.1, z)));
      put(0, 2.6, 1.6, 0.2, (x, z) => { for (let i = -2; i <= 2; i++) acc.add('banner', boxAt(0.6, 1.8, 0.05, x + i * 0.62, Y + 0.95, z + (i % 2) * 0.12)); });
      acc.add('redLacquer', boxAt(Math.min(6, q * 1.1), 0.03, 3.4, -q * 0.2, Y + 0.04, 2.2));
      break;
    case 5: // Thiền Phòng: 9 bồ đoàn, lư hương lớn, bia ngọc, cây cảnh
      for (let i = -1; i <= 1; i++) for (let j = 0; j < 3; j++) put(i * 1.6, 0.6 + j * 1.5, 0.4, 0.4, (x, z) => cushion(x, z));
      put(0, -1.8, 0.8, 0.8, (x, z) => { acc.add('gold', cylAt(0.55, 0.4, 0.7, x, Y + 0.55, z, 12), cylAt(0.3, 0.4, 0.2, x, Y + 1.0, z, 12)); });
      for (const sx of [-1, 1]) { put(sx * q * 0.6, -q * 0.5, 0.6, 0.3, (x, z) => { acc.add('stone', boxAt(1.1, 0.3, 0.6, x, Y + 0.15, z)); acc.add('jade', boxAt(0.8, 1.8, 0.2, x, Y + 1.2, z)); }); put(sx * q * 0.65, q * 0.6, 0.5, 0.5, plant); }
      break;
    case 6: // Đan Phòng: lò luyện đan ba chân, tủ thuốc trăm ngăn, bàn cối, hồ lô
      put(0, 0.8, 1.2, 1.2, (x, z) => { acc.add('beam', cylAt(1.0, 0.8, 1.4, x, Y + 1.1, z, 16), sph(1.0, x, Y + 1.8, z, 1, 0.45, 1)); acc.add('gold', cylAt(0.2, 0.25, 0.4, x, Y + 2.3, z, 8)); for (let i = 0; i < 3; i++) acc.add('beam', cylAt(0.12, 0.1, 0.5, x + Math.cos(i * 2.1) * 0.7, Y + 0.25, z + Math.sin(i * 2.1) * 0.7, 6)); acc.add('lampGlow', cylAt(0.6, 0.6, 0.06, x, Y + 0.42, z, 12)); });
      for (const sx of [-1, 1]) for (let i = 0; i < 2; i++) put(sx * q * 0.66, -q * 0.4 + i * q * 0.7, 0.4, 1.3, (x, z) => { acc.add('wood', boxAt(0.6, 2.1, 2.4, x, Y + 1.05, z)); for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) acc.add('gold', boxAt(0.04, 0.04, 0.04, x + Math.sign(-x) * 0.31, Y + 0.3 + r * 0.38, z - 0.9 + c * 0.6)); });
      for (const sx of [-1, 1]) put(sx * 2.8, 3.4, 0.7, 0.5, (x, z) => { table(x, z, 1.2, 0.8, 0.8); acc.add('stone', cylAt(0.2, 0.15, 0.25, x, Y + 0.95, z, 8)); acc.add('trim', sph(0.18, x + 0.35, Y + 1.0, z, 1, 1.4, 1)); });
      break;
    case 7: // Bảo Khố: rương báu, kệ trưng bày, thỏi vàng, tượng ngọc
      sides((x, z, sx) => put(x, z, 0.7, 0.5, () => chest(x, z, sx > 0 ? -Math.PI / 2 : Math.PI / 2)), 4, 0.68);
      for (let i = -1; i <= 1; i++) put(i * 2.4, 1.6, 0.6, 0.6, (x, z) => { acc.add('marble', boxAt(0.9, 1.0, 0.9, x, Y + 0.5, z)); if (i) acc.add('jade', sph(0.35, x, Y + 1.4, z, 1, 1.5, 1)); else for (let r = 0; r < 3; r++) acc.add('gold', boxAt(0.5 - r * 0.12, 0.12, 0.3, x, Y + 1.06 + r * 0.12, z)); });
      put(0, -2.0, 1.2, 0.3, (x, z) => { acc.add('wood', boxAt(2.4, 1.8, 0.5, x, Y + 0.9, z)); for (let i = 0; i < 3; i++) acc.add('gold', sph(0.18, x - 0.7 + i * 0.7, Y + 1.25, z + 0.1)); });
      break;
    case 8: // Nhạc Các: ba cổ cầm, giá trống lớn, giá chuông biên chung, nệm khán giả
      for (let i = -1; i <= 1; i++) put(i * 2.6, -1.4, 1.0, 0.5, (x, z) => { table(x, z, 1.7, 0.5, 0.45); acc.add('wood', boxAt(1.6, 0.08, 0.36, x, Y + 0.53, z)); cushion(x, z + 0.8); });
      put(-q * 0.55, 1.6, 1.0, 1.0, (x, z) => { acc.add('redLacquer', cylAt(0.75, 0.75, 0.9, x, Y + 1.45, z, 18)); acc.add('wood', boxAt(0.12, 2.2, 0.12, x - 0.9, Y + 1.1, z), boxAt(0.12, 2.2, 0.12, x + 0.9, Y + 1.1, z), boxAt(1.9, 0.12, 0.12, x, Y + 2.2, z)); });
      put(q * 0.55, 1.6, 1.4, 0.4, (x, z) => { acc.add('wood', boxAt(0.12, 2.0, 0.12, x - 1.3, Y + 1.0, z), boxAt(0.12, 2.0, 0.12, x + 1.3, Y + 1.0, z), boxAt(2.7, 0.14, 0.14, x, Y + 2.0, z), boxAt(2.7, 0.12, 0.12, x, Y + 1.3, z)); for (let i = 0; i < 6; i++) acc.add('gold', sph(0.16 + i * 0.015, x - 1.0 + i * 0.4, Y + 1.7 - (i % 2) * 0.7, z, 1, 1.3, 0.8)); });
      for (let i = -2; i <= 2; i++) put(i * 1.3, 4.2, 0.4, 0.4, (x, z) => cushion(x, z));
      break;
    default: // 9 — Vọng Nguyệt Đường: nghi khí hỗn thiên, kính thiên lý, bàn tinh đồ, cửa trăng
      put(0, 1.2, 1.2, 1.2, (x, z) => { acc.add('stone', cylAt(0.5, 0.7, 0.9, x, Y + 0.45, z, 10)); acc.add('gold', torus(0.9, 0.05, x, Y + 1.8, z, 0, 0), torus(0.9, 0.05, x, Y + 1.8, z, Math.PI / 2, 0), torus(0.9, 0.05, x, Y + 1.8, z, Math.PI / 2, Math.PI / 3), sph(0.18, x, Y + 1.8, z)); });
      put(q * 0.35, q * 0.7, 0.6, 0.6, (x, z) => { for (let i = 0; i < 3; i++) { const g = cylAt(0.04, 0.04, 1.4, 0, 0, 0, 5); g.rotateZ(0.35); g.rotateY(i * 2.1); g.translate(x, Y + 0.65, z); acc.add('wood', g); } const t = cylAt(0.12, 0.18, 1.6, 0, 0, 0, 10); t.rotateX(-1.0); t.translate(x, Y + 1.5, z + 0.2); acc.add('gold', t); });
      put(-q * 0.45, -0.4, 1.0, 0.7, (x, z) => { table(x, z, 1.8, 1.2, 0.85, 'redLacquer'); acc.add('marble', boxAt(1.6, 0.02, 1.0, x, Y + 0.9, z)); });
      put(0, -2.4, 1.6, 0.3, (x, z) => acc.add('trim', torus(1.4, 0.18, x, Y + 1.6, z, 0, 0)));
  }
  // chung mọi tầng: đèn đứng 4 góc trong + 2 chậu cây cạnh cửa trước
  for (const sx of [-1, 1]) { put(sx * q * 0.9, q * 0.9, 0.4, 0.4, lamp); put(sx * 2.2, a - 2.2, 0.5, 0.5, plant); }
}
export { LEVELS };
