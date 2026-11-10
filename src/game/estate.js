// ============================================================================
//  NHÀ RIÊNG — danh sách nhà rao bán, giá, hợp mệnh, mã hoá bố cục đồ đạc, kiểm tra bài trí.
//  Thuần JS, tất định (máy chủ worker/estate.js và test Node dùng chung).
//  Chủ sở hữu do máy chủ giữ (Estate DO); máy người chơi giữ bản bố cục của chính mình (state.home.own).
// ============================================================================
import * as BQ from './batquai.js';
import { generateCity } from './cityblocks.js';
import { cityShops } from './shops.js';
import { estates } from './mansions.js';
import { houseLooks } from './citylook.js';
import { HOUSE_SPECS } from './cityblocks.js';

export { TIERS, MAX_ITEMS, MAX_ITEMS_PHU, SELL_BACK, LISTING_TIERS, LISTING_COUNT, zonesOfH, zoneOfH, zoneRoom, isPhuH, isMansionH, estatePlanOfH, encodeLayout, decodeLayout, footOf, snapWall, canPlace, unreachable, validLayout, fitLayout, LISTING_ROOMS, roomOfH } from './estate-core.js';
import { TIERS } from './estate-core.js';
const TIER_MODELS = { tieuxa: ['bq_house_stone', 'bq_house_tiled', 'lib_mtn_house'], nhapho: ['bq_house_2f', 'bq_farmhouse'], tuhop: ['lib_courtyard'] };

let CACHE = null;
/** Nhà rao bán: [{ h, tier, g, wx, house, name, inner }] — h = chỉ số ổn định (máy chủ dùng) */
export function listings() {
  if (CACHE) return CACHE;
  const looks = houseLooks();
  // khung nhà nhìn từ ngoài (cityblocks3d.houseScale: mẫu lấp đủ mặt tiền lô, sâu theo tỉ lệ mẫu, không quá lô)
  const outer = (h, i) => { const id = looks[i]?.id || h.id, sp = HOUSE_SPECS[id] || HOUSE_SPECS[h.id], W = h.f * 1.015; return { W, D: Math.min(W / sp.wd, h.d) }; };
  const C = generateCity(), shopIdx = new Set(cityShops().filter((s) => s.hi != null).map((s) => s.hi));
  const out = [], taken = new Set();
  // 16 biệt phủ (h 0–15) + 240 biệt thự (h 16–255) ở vành phủ (mansions.js) — đi bộ vào thật, bài trí theo vùng
  for (const m of estates()) out.push({ tier: m.kind === 'phu' ? 'bietphu' : 'bietthu', g: m.g, wx: m.wx, mansion: m.h, unit: m, style: m.S.name, facing: m.facing, W: m.W, D: m.D, house: { door: m.gate, x: m.x, z: m.z, ry: m.ry }, hi: null, inner: false, phuName: m.name });
  const free = (h, i) => h.door && !h.inner && !shopIdx.has(i) && !taken.has(i);
  for (const g of BQ.GUA) {
    const mine = C.houses.map((h, i) => ({ h, i })).filter(({ h, i }) => h.g === g.id && free(h, i));
    // mỗi cung: 1 tiểu xá (dải ngoài), 1 nhà phố (giữa), 1 tứ hợp viện (dải trong) — xa đại lộ một chút cho yên tĩnh
    for (const [tier, u0, extra] of [['tieuxa', 370, 0], ['nhapho', 300, 0], ['tuhop', 220, 0], ['tieuxa', 250, 1]]) {
      if (extra && !['li', 'kan', 'zhen', 'dui', 'xun'].includes(g.id)) continue;
      // chọn: đúng mẫu + đủ rộng → (thiếu) mẫu nhà ở khác đủ rộng → (vẫn thiếu) đúng mẫu như cũ — giữ nguyên số căn và thứ tự h
      const RES = ['bq_house_stone', 'bq_house_tiled', 'lib_mtn_house', 'bq_house_2f', 'bq_farmhouse', 'lib_courtyard'];
      const pick = (okModel, needRoom) => {
        let b = null;
        for (const c of mine) {
          if (taken.has(c.i) || !okModel(c.h.id) || Math.abs(c.h.v) < 30) continue;
          if (needRoom) { const o = outer(c.h, c.i); if (o.W < 7 || o.D < 5.5) continue; } // nhà lấp đầu dãy (5–6 m) quá chật làm nhà ở
          const d = Math.abs(c.h.u - u0) + Math.abs(Math.abs(c.h.v) - 70) * 0.3;
          if (!b || d < b.d) b = { ...c, d };
        }
        return b;
      };
      const orig = pick((id) => TIER_MODELS[tier].includes(id), false);
      if (!orig) continue; // suất này vốn không có căn → giữ nguyên như cũ (số căn / thứ tự h không đổi)
      const best = pick((id) => TIER_MODELS[tier].includes(id), true) || pick((id) => RES.includes(id), true) || orig;
      taken.add(best.i);
      const o = outer(best.h, best.i);
      out.push({ tier, g: g.id, wx: g.wx, house: best.h, hi: best.i, inner: false, room: { w: Math.round((o.W - 0.6) * 2) / 2, d: Math.round((o.D - 0.6) * 2) / 2 } });
    }
  }
  out.forEach((l, i) => { l.h = i; l.name = l.phuName || `${TIERS[l.tier].name} ${BQ.guaById(l.g).name} số ${i + 1}`; });
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
export const isPhu = (l) => l?.tier === 'bietphu' || l?.tier === 'bietthu';
/** Giá mua (theo hạng; Nội Thành đã là Biệt Viện) */
// biệt phủ: giá theo diện tích (3 Phúc Khí / m² — 4.550 m² ≈ 13.650, 10.000 m² = 30.000; hoặc Ngọc = m² / 5)
// biệt phủ: 300 lượng bạc cho 100 × 100 m, theo diện tích, tròn tới lượng bạc (P18)
export const priceOf = (l) => (l.tier === 'bietphu' ? { xu: Math.max(1, Math.round((l.W * l.D * 300) / 10000)) * 100000 } : { ...TIERS[l.tier].price });
export const altPriceOf = (l) => (l.tier === 'bietphu' ? { ngoc: Math.round(l.W * l.D / 5 / 10) * 10 } : TIERS[l.tier].alt ? { ...TIERS[l.tier].alt } : null);
