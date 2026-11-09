// ============================================================================
//  ĐÈN THẾ GIỚI — mọi đèn lồng / nến / lư hương đăng ký vị trí ở đây.
//  render3d giữ một nhóm PointLight cố định (theo mức chất lượng) và mỗi 0,3 s gán
//  cho các đèn gần người chơi nhất → phố đêm sáng mà không tốn hàng trăm đèn thật.
//  Vật liệu phát sáng (đèn lồng GLB, nến) đăng ký để chỉnh độ sáng theo ngày/đêm.
// ============================================================================

import { warmObject } from './assets.js';

export const LIGHTS = [];     // { x, y, z, color, power, room }
export const GLOW_MATS = new Set();

/** Đèn điểm tại (x, y, z). room: null = ngoài trời, hoặc id điện (nội thất). */
export function addLight(x, y, z, { color = '#ffb35c', power = 1, room = null } = {}) {
  const l = { x, y, z, color, power, room };
  LIGHTS.push(l);
  return l;
}

/** Vật liệu tự phát sáng: lấy màu (map) làm vùng phát sáng; độ mạnh theo đêm. */
export function addGlow(mat, { base = 0.35, night = 1.6, color = '#ffb070' } = {}) {
  if (!mat || GLOW_MATS.has(mat)) return;
  if (mat.emissive) {
    mat.emissive.set(color);
    if (mat.map && !mat.emissiveMap) mat.emissiveMap = mat.map;
    mat.userData.glow = { base, night };
    mat.needsUpdate = true;
    GLOW_MATS.add(mat);
  }
}

export function glowAll(obj, opts) {
  obj.traverse((o) => { if (o.isMesh) for (const m of [].concat(o.material)) addGlow(m, opts); });
  // gắn emissiveMap đổi biến thể shader → biên dịch song song ngay, đừng đợi khung hình vẽ tới
  warmObject(obj);
}
