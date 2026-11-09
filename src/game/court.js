// ============================================================================
//  HUYỀN QUÁN SƠN MÔN — bố cục khu quán khởi đầu (mét thế giới, tâm quán = gốc toạ độ).
//  Một nguồn duy nhất cho: vị trí các gian (world.js), nền bậc + vật cản (obstacles.js),
//  dựng 3D (render3d.js), mặt đất phẳng (world3d.js). Thuần JS — test Node đọc được.
//
//  Trục Nam → Bắc (+z → −z):
//    Sơn Môn (z 66) · hồ sen đôi hai bên lối giữa · sân lớn: Đại Đỉnh + Lư Hương, khách hỏi việc,
//    cánh Tây (Trà Thất, Ống Xăm), cánh Đông (La Bàn Đài, Bảng Lịch) ·
//    nền đá tầng 1 (cao 2 m) với lầu chuông / lầu trống, điện phụ hai bên ·
//    nền đá tầng 2 (cao 4 m): Bàn Thầy Tử Bình trước Chính Đường · Hậu Môn (z −66) lên Hậu Sơn.
// ============================================================================
import { addPlatform, addSolidRect, clearSolidRect } from './obstacles.js';

export const U = 1.6; // 1 ô lưới = 1,6 m (toạ độ ô của người chơi, MMO)
export const toTile = (x, z) => ({ x: x / U + 10, y: z / U + 7 });

// Tường bao (mép trong) và cổng
export const COURT = { x0: -60, x1: 60, z0: -66, z1: 66, wall: 1.4, wallH: 6.5, gateS: 5, gateN: 3.5 };
export const inCourt = (x, z) => x > COURT.x0 - 1 && x < COURT.x1 + 1 && z > COURT.z0 - 1 && z < COURT.z1 + 1;

// Nền đá (mặt trên ở top). Bậc: dải [x0, x1] dọc trục, từ z «from» lên z «to».
export const TERRACES = [
  { id: 'L1', x0: -36, x1: 36, z0: -56, z1: 8, top: 2 },
  { id: 'L2', x0: -28, x1: 28, z0: -50, z1: -6, top: 4 },
];
export const STAIRS = [
  { x0: -8, x1: 8, zLow: 13, zHigh: 8, y0: 0, y1: 2 },    // sân → tầng 1 (mặt Nam)
  { x0: -7, x1: 7, zLow: -1, zHigh: -6, y0: 2, y1: 4 },   // tầng 1 → tầng 2
  { x0: -6, x1: 6, zLow: -61, zHigh: -56, y0: 0, y1: 2 }, // tầng 1 → sân sau (mặt Bắc)
];
const STEP = 0.4;

// Hồ sen đôi hai bên lối giữa
export const PONDS = [
  { id: 'sen', cx: 21, cz: 50, W: 24, D: 8 },
  { id: 'sen-w', cx: -21, cz: 50, W: 24, D: 8 },
];

// Gian trong sân: mỗi gian là mô hình thủ công cũ (models.js, toạ độ dựng sẵn quanh `base`) dời tới `at`.
// block / spot / label: theo khung cũ (mét), cộng độ dời. y: độ cao nền dưới gian.
const OLD = {
  tra: { base: [-10, -6.85], block: [-14.4, -9.6, -6.4, -6.4], spot: [-10.4, -5.44] },
  compass: { base: [10.4, -8], block: [8, -9.6, 12.8, -6.4], spot: [10.4, -5.44] },
  xam: { base: [-11.2, 0], block: [-12.8, -1.6, -9.6, 1.6], spot: [-8.64, 0] },
  huong: { base: [0, 0.8], block: [-1.6, 0, 1.6, 1.6], spot: [0, 2.72] },
  lich: { base: [11.2, 0], block: [9.6, -1.6, 12.8, 1.6], spot: [8.64, 0] },
  an0: { base: [-7.2, 2.4], block: [-8, 1.6, -6.4, 3.2], spot: [-7.2, 3.84] },
  an1: { base: [7.2, 2.4], block: [6.4, 1.6, 8, 3.2], spot: [7.2, 3.84] },
  an2: { base: [7.2, -4], block: [6.4, -4.8, 8, -3.2], spot: [7.2, -2.56] },
};
export const PLACE = {
  tra: [-40, 24], compass: [40, 22], xam: [-40, 40], huong: [0, 34],
  lich: [40, 40], an0: [-16, 22], an1: [16, 22], an2: [26, 30],
};

// Bàn Thầy Tử Bình: trên tầng 2, ngay trên đầu bậc, trước Chính Đường
export const DAIS = { x: 0, z: -11, y: 4 };
// Quầy Tàng Y Các (cánh Tây, giữa Ống Xăm và hồ sen Tây)
export const TANGY = { x: -22, z: 37 };
// Chính Đường (palace_grand) — tâm, bề ngang
export const MAIN_HALL = { x: 0, z: -31, w: 44 };

/** Gian trong sân dạng { id, block(m), spot(m), label(m), center(m), offset, y } */
export const COURT_STATIONS = (() => {
  const out = [];
  for (const [id, o] of Object.entries(OLD)) {
    const [px, pz] = PLACE[id]; const dx = px - o.base[0], dz = pz - o.base[1];
    out.push({
      id, y: 0, offset: [dx, dz], center: [px, pz],
      block: [o.block[0] + dx, o.block[1] + dz, o.block[2] + dx, o.block[3] + dz],
      spot: [o.spot[0] + dx, o.spot[1] + dz],
      label: [px, pz],
    });
  }
  // Bàn thầy: án thư + chỗ thầy ngồi; khách đứng phía trước (gần đầu bậc)
  out.push({ id: 'thay', y: DAIS.y, offset: [0, 0], center: [DAIS.x, DAIS.z], block: [-1.6, -13.8, 1.6, -9.2], spot: [0, -8.1], label: [0, -11.5] });
  // Tàng Y Các: quầy Thợ May Tiên Y (sect.js dựng quầy + giá áo; render3d đặt người bán)
  out.push({ id: 'tangy', y: 0, offset: [0, 0], center: [TANGY.x, TANGY.z], block: [TANGY.x - 2.8, TANGY.z - 1.6, TANGY.x + 2.8, TANGY.z + 0.9], spot: [TANGY.x, TANGY.z + 2.3], label: [TANGY.x, TANGY.z] });
  // Hồ sen (gian thả đèn): khách đứng mép Nam
  const p = PONDS[0];
  out.push({ id: 'sen', y: 0, offset: [0, 0], center: [p.cx, p.cz], block: [p.cx - p.W / 2 - 0.4, p.cz - p.D / 2 - 0.4, p.cx + p.W / 2 + 0.4, p.cz + p.D / 2 + 0.4], spot: [p.cx - 6, p.cz + p.D / 2 + 1.4], label: [p.cx, p.cz] });
  return out;
})();

// Bồ đoàn Trà Thất (models.js › teaPavilion: x −12,4 / −10 / −7,6, z −5,7) dời theo gian «tra» → toạ độ ô
export const TEA_SEATS = [-12.4, -10, -7.6].map((x) => {
  const dx = PLACE.tra[0] - OLD.tra.base[0], dz = PLACE.tra[1] - OLD.tra.base[1];
  return toTile(x + dx, -5.7 + dz);
});

export const START_M = { x: 3, z: 43 }; // giữa sân trước, nhìn thẳng lên Chính Đường

// ---------------------------------------------------------------------------
// Đăng ký va chạm (chạy một lần khi nạp module)
// ---------------------------------------------------------------------------
const T = COURT.wall;
// tường bao (chừa Sơn Môn phía Nam, Hậu Môn phía Bắc)
addSolidRect(COURT.x0 - T, COURT.z0 - T, COURT.x0, COURT.z1 + T);
addSolidRect(COURT.x1, COURT.z0 - T, COURT.x1 + T, COURT.z1 + T);
addSolidRect(COURT.x0 - T, COURT.z1, -COURT.gateS, COURT.z1 + T);
addSolidRect(COURT.gateS, COURT.z1, COURT.x1 + T, COURT.z1 + T);
addSolidRect(COURT.x0 - T, COURT.z0 - T, -COURT.gateN, COURT.z0);
addSolidRect(COURT.gateN, COURT.z0 - T, COURT.x1 + T, COURT.z0);

// nền đá: mặt trên đi được, mép là vách (dải 0,5 m) — chừa chỗ bậc
for (const t of TERRACES) addPlatform((t.x0 + t.x1) / 2, (t.z0 + t.z1) / 2, t.x1 - t.x0, t.z1 - t.z0, 0, t.top);
const EDGE = 0.5;
for (const t of TERRACES) {
  addSolidRect(t.x0, t.z0, t.x0 + EDGE, t.z1);
  addSolidRect(t.x1 - EDGE, t.z0, t.x1, t.z1);
  addSolidRect(t.x0, t.z0, t.x1, t.z0 + EDGE);
  addSolidRect(t.x0, t.z1 - EDGE, t.x1, t.z1);
}
// bậc: từng bậc là một nền nhỏ; hai bên có lan can đá (đặc)
for (const s of STAIRS) {
  const n = Math.round((s.y1 - s.y0) / STEP), dir = Math.sign(s.zHigh - s.zLow), depth = Math.abs(s.zHigh - s.zLow) / n;
  for (let k = 0; k < n; k++) {
    const za = s.zLow + dir * k * depth, zb = za + dir * depth;
    addPlatform((s.x0 + s.x1) / 2, (za + zb) / 2, s.x1 - s.x0, depth + 0.1, 0, s.y0 + (k + 1) * STEP); // chồng 5 cm: ranh giới bậc không hụt
  }
  const lo = Math.min(s.zLow, s.zHigh), hi = Math.max(s.zLow, s.zHigh);
  addSolidRect(s.x0 - 0.6, lo, s.x0, hi); addSolidRect(s.x1, lo, s.x1 + 0.6, hi);
  // mở mép nền ở đầu bậc
  const tz = s.zHigh, wz = dir < 0 ? [tz - EDGE - 0.1, tz + 0.1] : [tz - 0.1, tz + EDGE + 0.1];
  clearSolidRect(s.x0, wz[0], s.x1, wz[1]);
}
// hồ sen: mặt nước không lội được
for (const p of PONDS) addSolidRect(p.cx - p.W / 2 - 0.4, p.cz - p.D / 2 - 0.4, p.cx + p.W / 2 + 0.4, p.cz + p.D / 2 + 0.4);
// gian: khối mô hình
for (const s of COURT_STATIONS) if (s.id !== 'sen') addSolidRect(...s.block);
// Bàn thầy: bệ gỗ cao 0,25 m (models.js › masterDais)
addPlatform(DAIS.x, DAIS.z, 10.4, 6.8, 0, DAIS.y + 0.25);
// Chính Đường: khung thân điện (model thật còn cắt lát thêm khi nạp — collide.js)
addSolidRect(MAIN_HALL.x - MAIN_HALL.w / 2 + 2, -46, MAIN_HALL.x + MAIN_HALL.w / 2 - 2, -17);
