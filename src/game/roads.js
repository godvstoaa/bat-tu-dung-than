// ============================================================================
//  HUYỀN GIỚI — mạng đường đá. Đường KHÔNG còn là dải mesh nổi (mép cứng, lơ lửng trên dốc):
//  được vẽ thẳng vào địa hình qua một trường khoảng cách (roadField) mà shader địa hình đọc
//  → mặt đường bám đất tuyệt đối, mép có lề đất, cỏ không mọc trên mặt đường.
// ============================================================================
import * as T from './terrain.js';
import { HALLS } from './world.js';
import { COURT } from './court.js';
import { ringRoad, diagonalAvenues, RING_W, GUA } from './batquai.js';
import { cityRoads, outerGate } from './cityblocks.js';

export const CITY_R = 158;

// Từ cổng Ngoại Thành cùng hướng (8 cổng ngoài hướng đúng 8 vùng — cityblocks.js) thẳng tới sảnh nghề;
// gặp dốc quá (> ~38°) thì dừng ở chân núi — lên đỉnh bằng trạm đi nhanh («Các gian»).
export function roadPath(tx, tz) {
  const g = GUA.reduce((b, q) => (q.dir[0] * tx + q.dir[1] * tz > b.dir[0] * tx + b.dir[1] * tz ? q : b), GUA[0]);
  const s0 = outerGate(g, 4);
  const pts = [[s0.x, s0.z]];
  const sx = s0.x, sz = s0.z;
  const L = Math.hypot(tx - sx, tz - sz), n = Math.ceil(L / 8);
  const nx = -(tz - sz) / L, nz = (tx - sx) / L; // pháp tuyến ngang: uốn nhẹ cho tự nhiên
  for (let i = 1; i <= n; i++) {
    const t = i / n, bend = Math.sin(t * Math.PI) * 26 * T.fbm(tx / 300 + i * 0.02, tz / 300, 2);
    const x = sx + (tx - sx) * t + nx * bend, z = sz + (tz - sz) * t + nz * bend;
    if (Math.hypot(tx - x, tz - z) < 14) break; // chừa sân trước bàn
    if (T.slopeAt(x, z) > 0.78) break;
    pts.push([x, z]);
  }
  return pts;
}

let LINES = null;
// Mọi tuyến đường: { pts: [[x, z]…], w: bề rộng mặt đường (m) }
export function roadLines() {
  if (LINES) return LINES;
  LINES = HALLS.filter((h) => h.region !== 'thanh').map((h) => ({ pts: roadPath(h.world.x, h.world.z), w: 5 }));
  // trong thành: đại lộ Nam (thành môn → cổng Sơn Môn) và trục Đông – Tây giữa hai dãy phố
  LINES.push({ pts: [[0, CITY_R + 12], [0, COURT.z1 + 1]], w: 9 });
  for (const sx of [-1, 1]) LINES.push({ pts: [[sx * (COURT.x1 + 1), 0], [sx * (CITY_R - 4), 0]], w: 8 });
  // Bát Quái Thành: đường vành bát giác nối 8 khu + đại lộ 4 khu chéo ra cổng
  LINES.push({ pts: ringRoad(), w: RING_W }, ...diagonalAvenues());
  // Ngoại Thành: 8 đại lộ, 9 vành phố bát giác, ngõ dọc, phố ranh giữa các cung
  for (const r of cityRoads()) LINES.push({ pts: r.pts, w: r.w });
  // Nam Môn: từ cổng Cảnh Môn thẳng Nam qua Nam Môn Đại Kiều (bridges.riverBridges) tới bến sông bờ Nam
  { const g = GUA.find((q) => q.id === 'li'), s0 = outerGate(g, 4); LINES.push({ pts: [[s0.x, s0.z], [0, 1190]], w: 8 }); }
  return LINES;
}

// Trường khoảng cách tới MÉP đường, mã hoá 8 bit: v = 0,5 − s/8 (s = khoảng cách tới mép, âm là
// trong mặt đường) → nội suy song tuyến của trường khoảng cách cho mép mịn dù 2 m/điểm ảnh.
export const FIELD_RANGE = 8;
export function roadField(res = 1024) {
  const W = T.WORLD, k = res / W, data = new Uint8Array(res * res);
  for (const { pts, w } of roadLines()) {
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, az] = pts[i], [bx, bz] = pts[i + 1];
      const pad = w / 2 + FIELD_RANGE / 2 + 2;
      const i0 = Math.max(0, Math.floor((Math.min(ax, bx) - pad + T.HALF) * k)), i1 = Math.min(res - 1, Math.ceil((Math.max(ax, bx) + pad + T.HALF) * k));
      const j0 = Math.max(0, Math.floor((Math.min(az, bz) - pad + T.HALF) * k)), j1 = Math.min(res - 1, Math.ceil((Math.max(az, bz) + pad + T.HALF) * k));
      const vx = bx - ax, vz = bz - az, ll = vx * vx + vz * vz || 1;
      for (let j = j0; j <= j1; j++) for (let ii = i0; ii <= i1; ii++) {
        const x = (ii + 0.5) / k - T.HALF, z = (j + 0.5) / k - T.HALF;
        const t = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / ll));
        const s = Math.hypot(x - ax - vx * t, z - az - vz * t) - w / 2;
        const v = Math.max(0, Math.min(1, 0.5 - s / FIELD_RANGE));
        const q = (v * 255) | 0, idx = j * res + ii;
        if (q > data[idx]) data[idx] = q;
      }
    }
  }
  return { data, res };
}

// Tra trường trên CPU (cho mật độ cỏ): khoảng cách tới mép đường (m), dương = ngoài đường
export function makeRoadSampler({ data, res }) {
  const k = res / T.WORLD;
  return (x, z) => {
    const fx = (x + T.HALF) * k - 0.5, fz = (z + T.HALF) * k - 0.5;
    const i = Math.max(0, Math.min(res - 2, Math.floor(fx))), j = Math.max(0, Math.min(res - 2, Math.floor(fz)));
    const tx = Math.min(1, Math.max(0, fx - i)), tz = Math.min(1, Math.max(0, fz - j));
    const a = data[j * res + i], b = data[j * res + i + 1], c = data[(j + 1) * res + i], d = data[(j + 1) * res + i + 1];
    const v = ((a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + d * tx) * tz) / 255;
    return (0.5 - v) * FIELD_RANGE;
  };
}
