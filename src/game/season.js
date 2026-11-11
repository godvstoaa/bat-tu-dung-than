// ============================================================================
//  MÙA trong game (docs/CAY-QUAN-MANIFEST.md §5 — G-5.3): theo tiết khí giờ Việt Nam
//    Lập xuân 4/2 · Lập hạ 5/5 · Lập thu 7/8 · Lập đông 7/11. Thử mùa khác: localStorage 'huyenquan:season'.
//  Dùng chung: cây phố (citydress3d — màu tán / lá rụng), bình hoa trong quán (interior-build — tứ thời hoa).
// ============================================================================
export const SEASONS = ['xuan', 'ha', 'thu', 'dong'];
export function seasonOf(now = Date.now()) {
  try { const o = globalThis.localStorage?.getItem('huyenquan:season'); if (SEASONS.includes(o)) return o; } catch (e) { /* không có localStorage */ }
  const d = new Date(now + 7 * 3600e3), md = (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
  return md >= 204 && md < 505 ? 'xuan' : md >= 505 && md < 807 ? 'ha' : md >= 807 && md < 1107 ? 'thu' : 'dong';
}
