// ============================================================================
//  NHÀ RIÊNG — danh sách nhà rao bán, giá, hợp mệnh, mã hoá bố cục đồ đạc, kiểm tra bài trí.
//  Thuần JS, tất định (máy chủ worker/estate.js và test Node dùng chung).
//  Chủ sở hữu do máy chủ giữ (Estate DO); máy người chơi giữ bản bố cục của chính mình (state.home.own).
// ============================================================================
import * as BQ from './batquai.js';
import { streetListings } from './city4.js';
import { estates } from './mansions.js';
import { houseLooks } from './citylook.js';
import { HOUSE_SPECS } from './cityblocks.js';

export { TIERS, MAX_ITEMS, MAX_ITEMS_PHU, SELL_BACK, LISTING_TIERS, LISTING_COUNT, zonesOfH, zoneOfH, zoneRoom, isPhuH, isMansionH, estatePlanOfH, encodeLayout, decodeLayout, footOf, snapWall, canPlace, unreachable, validLayout, fitLayout, LISTING_ROOMS, roomOfH } from './estate-core.js';
import { TIERS, roomOfH } from './estate-core.js';
const TIER_MODELS = { tieuxa: ['bq_house_stone', 'bq_house_tiled', 'lib_mtn_house'], nhapho: ['bq_house_2f', 'bq_farmhouse'], tuhop: ['lib_courtyard'] };

let CACHE = null;
/** Nhà rao bán: [{ h, tier, g, wx, house, name, inner }] — h = chỉ số ổn định (máy chủ dùng) */
export function listings() {
  if (CACHE) return CACHE;
  // khung nhà nhìn từ ngoài (cityblocks3d.houseScale: mẫu lấp đủ mặt tiền lô, sâu theo tỉ lệ mẫu, không quá lô)
  const out = [];
  // 16 biệt phủ (h 0–15) + 240 biệt thự (h 16–255) ở vành phủ (mansions.js) — đi bộ vào thật, bài trí theo vùng
  const unit = (m) => ({ tier: m.heaven ? 'tienphu' : m.kind === 'phu' ? 'bietphu' : 'bietthu', g: m.g, wx: m.wx, mansion: m.h, unit: m, style: m.S.name, facing: m.facing, W: m.W, D: m.D, house: { door: m.gate, x: m.x, z: m.z, ry: m.ry }, hi: null, inner: false, phuName: m.name, heaven: !!m.heaven });
  for (const m of estates()) if (!m.heaven) out.push(unit(m));
  // v4: nhà phố rao bán (h 256–282) trên lô nhà ở thành mới — cùng hạng, cùng phòng trong (LISTING_ROOMS) như bản cũ
  for (const s of streetListings()) {
    const h = s.house, g = BQ.guaById(s.g);
    out.push({ tier: s.tier, g: s.g, wx: g.wx, house: { ...h, f: h.w }, hi: h.id, inner: false });
  }
  // v6: 9 tiên phủ Cửu Trọng Thiên nối CUỐI sổ (h 283–291) — giữ chỉ số các căn cũ
  for (const m of estates()) if (m.heaven) out.push(unit(m));
  out.forEach((l, i) => { l.h = i; l.name = l.phuName || `${TIERS[l.tier].name} ${BQ.guaById(l.g).name} số ${i + 1}`; if (l.hi != null) { const r = roomOfH(i); l.room = { w: r.w, d: r.d }; } }); // phòng trong theo bảng máy chủ (giữ bài trí cũ)
  CACHE = out;
  return out;
}
export const listing = (h) => listings()[h] || null;

// --- hợp mệnh: hành của cung chứa nhà so với Dụng thần / Hỷ thần / Kỵ thần (lá số người chơi)
const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' }; // tương sinh
export function fitStars(wx, yong) {
  if (!yong || !yong.primary) return 3;
  if (wx === yong.primary) return 5;
  if (wx === yong.accent) return 4;
  if (wx === yong.ji) return 1;
  if (SHENG[wx] === yong.primary) return 4; // hành sinh ra Dụng thần
  return 3;
}
export const FIT_TEXT = ['', 'Kỵ — hành phường khắc mệnh', 'Bình thường', 'Bình thường', 'Hợp — sinh trợ Dụng thần', 'Rất hợp — đúng hành Dụng thần'];

// phòng trong = khung nhà ngoài trừ tường (2026-11-11 — trước đây mọi Tiểu Xá 10×8, Tứ Hợp 18×14 trong khi nhà ngoài chỉ ~8×8 / 11×7)
export const roomOf = (l) => (l.W ? { ...TIERS[l.tier], w: l.W, d: l.D } : { ...TIERS[l.tier], ...(l.room || {}) });
/** căn đi bộ ngoài trời (biệt phủ / biệt thự) */
export const isPhu = (l) => l?.tier === 'bietphu' || l?.tier === 'bietthu' || l?.tier === 'tienphu';
/** Giá mua (theo hạng; Nội Thành đã là Biệt Viện) */
// biệt phủ: giá theo diện tích (3 Phúc Khí / m² — 4.550 m² ≈ 13.650, 10.000 m² = 30.000; hoặc Ngọc = m² / 5)
// biệt phủ: 300 lượng bạc cho 100 × 100 m, theo diện tích, tròn tới lượng bạc (P18)
export const priceOf = (l) => (l.tier === 'tienphu' ? { xu: TIERS.tienphu.price.xu * (l.unit?.tien === 'quan' ? 2 : 1) } : l.tier === 'bietphu' ? { xu: Math.max(1, Math.round((l.W * l.D * 300) / 10000)) * 100000 } : { ...TIERS[l.tier].price });
export const altPriceOf = (l) => (l.tier === 'tienphu' ? { ngoc: TIERS.tienphu.alt.ngoc * (l.unit?.tien === 'quan' ? 2 : 1) } : l.tier === 'bietphu' ? { ngoc: Math.round(l.W * l.D / 5 / 10) * 10 } : TIERS[l.tier].alt ? { ...TIERS[l.tier].alt } : null);
