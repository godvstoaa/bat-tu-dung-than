// ============================================================================
//  NƠI LÀM CỦA NGHỀ NGOÀI TIỆM (P7 — thuần, dùng chung client + Guild DO). Đặc tả §4.2.
//  Mỗi nghề «khu vực» làm ở các điểm có thật trong thế giới (công trình Bát Quái, bến thuyền, rừng, cổng thành),
//  hoặc trong phòng các loại tiệm có sẵn (không giữ chỗ). Không giới hạn số người — giới hạn ở số ca / ngày như mọi nghề.
//  Pháo hoa chỉ có ca vào đêm rằm (tuổi trăng 13,3–16,3 ngày, 18–23 giờ Việt Nam).
// ============================================================================
import { guaById, toWorld } from './batquai.js';
import { TRUNG_A, OUTER_A, OUTER_GATE_D } from './cityblocks.js';
const outerGateU = OUTER_A + OUTER_GATE_D / 2;
const CANAL_AVE = ['kan', 'xun']; // đại lộ có kênh giữa (waterways / cityblocks)
import { docks } from './boats.js';
import { cityShops } from './shops.js';
import { slotOrigin, shopSize } from './roomgrid.js';

const G = (g, u, v) => toWorld(guaById(g), u, v);
const pt = (p, r, name) => ({ x: Math.round(p.x * 10) / 10, z: Math.round(p.z * 10) / 10, r, name });
let Z = null;
/** jobId → { spots: [{ x, z, r, name }], rooms: [loại tiệm] } */
export function zones() {
  if (Z) return Z;
  // bến hồ Cùng Thông: tâm bến là nhà thủy tạ (có va chạm) → đứng ở bậc đá phía Tây Nam (đo trong game: 34/35 điểm đứng được ngay)
  const STAND = { lake: { x: 786.1, z: 772.1 } };
  const D = docks(), dock = (kinds) => D.filter((d) => kinds.includes(d.kind)).map((d) => pt(STAND[d.id] || d, 14, d.name));
  const ring = (u, r, name) => ['li', 'kun', 'dui', 'qian', 'kan', 'gen', 'zhen', 'xun'].map((g) => pt(G(g, u, CANAL_AVE.includes(g) ? 16 : 0), r, `${name} ${guaById(g).gate}`)); // đại lộ Khảm / Tốn có kênh giữa → đứng lề v 16
  Z = {
    kephat: { spots: [pt(G('dui', 104, 25), 12, 'Ca Đài · Đoài Trạch Lâu')] },
    lodan: { spots: [pt(G('li', 136, 8), 9, 'Cửu Chuyển Đan Lô'), pt(G('li', 120, 15), 10, 'Đan Dược Các')] },
    phaohoa: { spots: [pt(G('li', 150, 0), 16, 'Phố chợ Cảnh Môn')] },
    laido: { spots: dock(['moat', 'canal']) },
    nguphu: { spots: dock(['river', 'lake']) },
    buonmuoi: { spots: [pt(G('dui', 200, 0), 14, 'Diêm Thị · đại lộ Đoài')] },
    hamruou: { spots: [], rooms: ['tuu'] },
    tieuphu: { spots: [pt({ x: 0, z: 1040 }, 30, 'Rừng Nam Hoang'), pt({ x: 788, z: 455 }, 30, 'Rừng Đông Lĩnh')] },
    kimhoan: { spots: [pt(G('qian', 120, 0), 14, 'Kim Hoàn Phố · Càn Kiếm Các')] },
    thungan: { spots: [], rooms: ['dichtram', 'namon'] },
    baotieu: { spots: ['li', 'kun', 'dui', 'qian', 'kan', 'gen', 'zhen', 'xun'].map((g) => pt(G(g, outerGateU + 12, CANAL_AVE.includes(g) ? 18 : 0), 22, `Cổng Ngoại Thành ${guaById(g).gate}`)) },
    nhadich: { spots: [], rooms: ['namon'] },
    thoxay: { spots: ring(TRUNG_A - 8, 18, 'Công trường cổng Trung Thành') },
    nongphu: { spots: [pt(G('kun', 104, -27), 12, 'Khôn Nguyên Thương'), pt(G('kun', 93, 0), 16, 'Linh điền Nông Gia')] },
    thoda: { spots: [pt(G('gen', 128, 0), 18, 'Trấn Sơn Bảo Tháp')] },
  };
  return Z;
}
let ROOMS = null;
function roomsOf(type) {
  ROOMS = ROOMS || {};
  if (!ROOMS[type]) ROOMS[type] = cityShops().filter((s) => s.type === type).map((s) => { const [w, d] = shopSize(s.type), o = slotOrigin(s.k); return { x: o.x, z: o.z, w, d }; });
  return ROOMS[type];
}
/** đứng trong khu làm của nghề jobId (toạ độ mét) — máy chủ dùng toạ độ nó biết */
export function inZone(jobId, p) {
  const z = zones()[jobId];
  if (!z || !p) return false;
  if (z.spots.some((s) => Math.hypot(p.x - s.x, p.z - s.z) <= s.r)) return true;
  return (z.rooms || []).some((t) => roomsOf(t).some((r) => Math.abs(p.x - r.x) <= r.w / 2 + 1 && Math.abs(p.z - r.z) <= r.d / 2 + 1));
}
/** tuổi trăng (ngày) — chu kỳ sóc vọng 29,53059 ngày tính từ sóc 2000-01-06 18:14 UTC */
export const moonAge = (now = Date.now()) => { const P = 29.530588853, a = ((now - Date.UTC(2000, 0, 6, 18, 14)) / 86400000) % P; return a < 0 ? a + P : a; };
export const isRam = (now = Date.now()) => { const a = moonAge(now); return a >= 13.3 && a <= 16.3; };
/** nghề có mở ca lúc này không (pháo hoa: đêm rằm 18–23 giờ VN) */
export function open(jobId, now = Date.now()) {
  if (jobId !== 'phaohoa') return true;
  const h = new Date(now + 7 * 3600000).getUTCHours();
  return isRam(now) && h >= 18 && h <= 23;
}
