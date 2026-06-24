// ============================================================================
//  真太陽時 (CHÂN THÁI DƯƠNG THỜI — True Solar Time) + MÚI GIỜ
//  Bát Tự / Tử Vi dùng giờ MẶT TRỜI THẬT tại nơi sinh (地方时/真太阳时), KHÔNG phải giờ
//  đồng hồ múi giờ (standard time). Giờ nhập = giờ đồng hồ tại nơi sinh; cần hiệu chỉnh
//  theo KINH ĐỘ + phương trình thời gian (EOT) để ra 真太阳时 — đặc biệt quan trọng khi
//  sinh gần ranh giờ chi (时辰) thì sai vài phút có thể đổi 时柱.
//
//  Công thức:
//    meridian chuẩn = tzOffset * 15°  (GMT+7 → 105°Đ)
//    hiệu kinh độ  = 4 * (longitude − meridian)  [phút; mỗi độ = 4 phút; đông hơn = sớm hơn]
//    EOT (phương trình thời gian) ≈ 9.87·sin(2B) − 7.53·cos(B) − 1.5·sin(B), B = 2π(N−81)/365
//    真太阳时 (phút) = giờ_đồng_hồ(tại nơi sinh) + hiệu kinh độ + EOT
//  Nguồn: Meeus ô.28.3 (xấp xỉ), 各命理 Cổ pháp «以真太阳时定时辰».
// ============================================================================
import { Solar } from 'lunar-javascript';

// Kinh độ các thành phố VN (°Đ) — quick-pick. GMT+7 mạc định.
export const VN_CITIES = {
  'Hà Nội': 105.85,
  'TP.HCM': 106.70,
  'Đà Nẵng': 108.22,
  'Hải Phòng': 106.68,
  'Cần Thơ': 105.78,
  'Huế': 107.58,
  'Nha Trang': 109.22,
  'Quy Nhơn': 109.22,
  'Vinh': 105.67,
  'Đà Lạt': 108.45,
  'Biên Hòa': 106.85,
  'Long Xuyên': 105.44,
};

// Phương trình thời gian (EOT) — đơn vị phút. B = 2π(N−81)/365, N = ngày trong năm.
function equationOfTime(year, month, day) {
  // ngày trong năm N (1..365/366)
  const d0 = Date.UTC(year, month - 1, day);
  const y0 = Date.UTC(year, 0, 0);
  const N = Math.floor((d0 - y0) / 86400000);
  const B = (2 * Math.PI * (N - 81)) / 365;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

/**
 * Tính 真太阳时 từ giờ đồng hồ (tại nơi sinh) + múi giờ + kinh độ.
 * @param {object} p { year, month, day, hour, minute, tzOffset (giờ, default 7), longitude (°Đ, default=null) }
 * @returns {{ solar:{year,month,day,hour,minute}, shiftMin, eotMin, longMin, usedTrueSolar:boolean, note }}
 *   - solar = thời gian dùng cho analyze (真太阳时 nếu có longitude, else giờ nhập y nguyên)
 *   - shiftMin = tổng hiệu chỉnh (phút)
 *   - note = giải thích cho user
 */
export function trueSolarTime({ year, month, day, hour, minute, tzOffset = 7, longitude = null }) {
  const stdMeridian = tzOffset * 15; // GMT+7 → 105°
  const eotMin = equationOfTime(year, month, day);
  let longMin = 0;
  let usedTrueSolar = false;
  let shiftMin = 0;
  if (longitude != null && !Number.isNaN(longitude)) {
    longMin = 4 * (longitude - stdMeridian); // mỗi độ = 4 phút
    usedTrueSolar = true;
    shiftMin = longMin + eotMin;             // 真太阳时 = kinh độ + EOT (đầy đủ)
  }
  // Không longitude → KHÔNG hiệu chỉnh (dùng giờ đồng hồ nhập y nguyên làm giờ sinh địa-phương).

  // Giờ đồng hồ gốc (phút từ nửa đêm)
  let totalMin = hour * 60 + minute + Math.round(shiftMin);
  // Xử lý lăn ngày (đổi sang Date để an toàn qua tháng/năm)
  let base = new Date(Date.UTC(year, month - 1, day));
  const dayShift = Math.floor(totalMin / 1440);
  totalMin = ((totalMin % 1440) + 1440) % 1440;
  if (dayShift !== 0) base = new Date(base.getTime() + dayShift * 86400000);
  const solar = {
    year: base.getUTCFullYear(),
    month: base.getUTCMonth() + 1,
    day: base.getUTCDate(),
    hour: Math.floor(totalMin / 60),
    minute: totalMin % 60,
  };

  let note;
  if (usedTrueSolar) {
    const sign = shiftMin >= 0 ? '+' : '';
    note = `真太阳时 (giờ Mặt Trời thật tại kinh độ ${longitude}°Đ): đồng hồ ${pad(hour)}:${pad(minute)} → 真太阳时 ${pad(solar.hour)}:${pad(solar.minute)} (hiệu ${sign}${Math.round(shiftMin)} phút = kinh độ ${sign}${Math.round(longMin)}′ + EOT ${eotMin >= 0 ? '+' : ''}${eotMin.toFixed(1)}′).`;
  } else {
    note = `Giờ nhập được dùng nguyên làm giờ sinh địa-phương (GMT${tzOffset >= 0 ? '+' : ''}${tzOffset}). Chọn nơi sinh / kinh độ để hiệu chỉnh 真太阳时 (chính xác hơn, quan trọng khi sinh gần ranh 时辰).`;
  }
  return { solar, shiftMin, eotMin, longMin, usedTrueSolar, note };
}

const pad = (n) => String(Math.abs(n)).padStart(2, '0');

// Helper: 时辰 (chi giờ) từ giờ 真太阳时 — cho UI hiển thị.
const SHICHEN = [
  { zhi: '子', range: '23:00–01:00' }, { zhi: '丑', range: '01:00–03:00' },
  { zhi: '寅', range: '03:00–05:00' }, { zhi: '卯', range: '05:00–07:00' },
  { zhi: '辰', range: '07:00–09:00' }, { zhi: '巳', range: '09:00–11:00' },
  { zhi: '午', range: '11:00–13:00' }, { zhi: '未', range: '13:00–15:00' },
  { zhi: '申', range: '15:00–17:00' }, { zhi: '酉', range: '17:00–19:00' },
  { zhi: '戌', range: '19:00–21:00' }, { zhi: '亥', range: '21:00–23:00' },
];
export function shichenOf(hour, minute) {
  // 子时 = 23:00–00:59 (gồm晚子 23-24)
  if (hour === 23 || hour < 1) return SHICHEN[0];
  return SHICHEN[Math.ceil((hour + (minute > 0 ? 1 : 0)) / 2)] || SHICHEN[0];
}

export { equationOfTime };
