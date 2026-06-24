// ============================================================================
//  七政四余 (QI ZHENG SI YU — Chinese real-planet astrology)
//  Hệ chiêm tinh Hán cổ thứ ba (cùng BaZi 子平 & Tử Vi 紫微), dùng TOẠ ĐỘ THẬT
//  của 7 chính tinh (七政: Nhật/Nguyệt/Thủy/Kim/Hỏa/Mộc/Thổ) tính bằng thư viện
//  astronomy-engine (GEOCENTRIC ecliptic longitude, EQJ→ECT), sau đó trừ AYANAMSA (岁差)
//  → hệ SIDEREAL (theo sao) để đặt vào 28 túc (二十八宿) cố định với 距 độ cổ điển BẤT ĐỀU,
//  và 12 cung (十二宫) phái sinh từ vị trí Nhật + giờ sinh.
//
//  Bốn 余 (四余: 罗睺/计都/月孛/紫气) dùng công thức MEAN MOTION cổ điển
//  (không cần lịch thiên văn chính xác — truyền thống 七政 cũng làm vậy):
//    - 罗睺 (La Hầu)   = Mean lunar ascending node   (chu kỳ 18.613 năm, nghịch hành)
//    - 计都 (Kế Đô)    = La Hầu + 180° (descending node)
//    - 月孛 (Nguyệt Bạt) = Mean lunar apogee            (chu kỳ 8.850 năm, THUẬN HÀNH — cycle 40 sửa)
//    - 紫气 (Tử Khí)   = Mean motion 29.5 năm          (thuận hành — cổ thư)
//
//  Nguồn: 天文书 / 星学大成 / 果老星宗 + cosinekitty/astronomy-engine (MIT).
//  Tất cả hàm ĐỀU TẤT ĐỊNH (deterministic) — cùng input → cùng output.
// ============================================================================
import { Body, EclipticGeoMoon, SunPosition, GeoVector, Rotation_EQJ_ECT, RotateVector } from 'astronomy-engine';
import { ZHI, WX_VI } from './constants.js';

// ---- 28 TÚC (二十八宿) — 距 độ cổ điển BẤT ĐỀU (degrees) ----
// Thứ tự theo hoàng đạo (từ 春分點-area truyền thống). Tổng ≈ 365.25° cổ.
// wx = ngũ hành túc; beast = tứ tượng (Thanh Long/Huyền Vũ/Bạch Hổ/Chu Tước).
const MANSIONS_28 = [
  // 东方青龙 (Eastern Dragon) — 7 túc, ~75°
  { zhi: '角', vi: 'Giác',  wx: '木', beast: 'Thanh Long', width: 12 },
  { zhi: '亢', vi: 'Cang',  wx: '金', beast: 'Thanh Long', width: 9  },
  { zhi: '氐', vi: 'Đê',    wx: '土', beast: 'Thanh Long', width: 15 },
  { zhi: '房', vi: 'Phòng', wx: '日', beast: 'Thanh Long', width: 5  },
  { zhi: '心', vi: 'Tâm',   wx: '月', beast: 'Thanh Long', width: 5  },
  { zhi: '尾', vi: 'Vĩ',    wx: '火', beast: 'Thanh Long', width: 18 },
  { zhi: '箕', vi: 'Cơ',    wx: '水', beast: 'Thanh Long', width: 11 },
  // 北方玄武 (Northern Turtle) — 7 túc, ~81°
  { zhi: '斗', vi: 'Đẩu',   wx: '木', beast: 'Huyền Vũ', width: 10 },
  { zhi: '牛', vi: 'Ngưu',  wx: '金', beast: 'Huyền Vũ', width: 7  },
  { zhi: '女', vi: 'Nữ',    wx: '土', beast: 'Huyền Vũ', width: 11 },
  { zhi: '虚', vi: 'Hư',    wx: '日', beast: 'Huyền Vũ', width: 9  },
  { zhi: '危', vi: 'Nguy',  wx: '月', beast: 'Huyền Vũ', width: 16 },
  { zhi: '室', vi: 'Thất',  wx: '火', beast: 'Huyền Vũ', width: 18 },
  { zhi: '壁', vi: 'Bích',  wx: '水', beast: 'Huyền Vũ', width: 10 },
  // 西方白虎 (Western Tiger) — 7 túc, ~79°
  { zhi: '奎', vi: 'Khuê',  wx: '木', beast: 'Bạch Hổ', width: 16 },
  { zhi: '娄', vi: 'Lâu',   wx: '金', beast: 'Bạch Hổ', width: 12 },
  { zhi: '胃', vi: 'Vị',    wx: '土', beast: 'Bạch Hổ', width: 14 },
  { zhi: '昴', vi: 'Mão',   wx: '日', beast: 'Bạch Hổ', width: 11 },
  { zhi: '毕', vi: 'Tất',   wx: '月', beast: 'Bạch Hổ', width: 16 },
  { zhi: '觜', vi: 'Chu',   wx: '火', beast: 'Bạch Hổ', width: 1  },
  { zhi: '参', vi: 'Sâm',   wx: '水', beast: 'Bạch Hổ', width: 9  },
  // 南方朱雀 (Southern Bird) — 7 túc, ~88°
  { zhi: '井', vi: 'Tỉnh',  wx: '木', beast: 'Chu Tước', width: 8  },
  { zhi: '鬼', vi: 'Quỷ',   wx: '金', beast: 'Chu Tước', width: 4  },
  { zhi: '柳', vi: 'Liễu',  wx: '土', beast: 'Chu Tước', width: 14 },
  { zhi: '星', vi: 'Tinh',  wx: '日', beast: 'Chu Tước', width: 7  },
  { zhi: '张', vi: 'Trương',wx: '月', beast: 'Chu Tước', width: 17 },
  { zhi: '翼', vi: 'Dực',   wx: '火', beast: 'Chu Tước', width: 20 },
  { zhi: '轸', vi: 'Chẩn',  wx: '水', beast: 'Chu Tước', width: 18 },
];

// Mỗi túc bắt đầu tại toạ độ tích luỹ (start longitude). Hệ cổ tổng width = 365.25°,
// nhưng bảng width ở trên dùng giá trị rút gọn (sum = 323). Để ánh xạ toạ độ hoàng đạo
// thật (0..360°) vào 28 túc MỘT CÁCH TỈ LỆ ĐÚNG, ta CHUẨN HOÁ các width về tổng 360°
// (mỗi túc chiếm đúng tỷ lệ hoàng đạo theo width cổ). Như vậy một tinh ở 207° hoàng đạo
// sẽ rơi vào túc có khoảng [start, start+width) chứa 207° — không nén/mở sai tỷ lệ.
const MANSION_TOTAL_RAW = MANSIONS_28.reduce((s, m) => s + m.width, 0); // = 323 (giá trị thô)
const MANSION_TOTAL = 360; // sau chuẩn hoá: tổng = 360° hoàng đạo
const MANSION_START = (() => {
  const arr = [];
  let acc = 0;
  for (const m of MANSIONS_28) {
    arr.push(acc);
    acc += (m.width / MANSION_TOTAL_RAW) * 360; // chuẩn hoá width → tỷ lệ 360°
  }
  return arr; // start[i] = độ hoàng đạo bắt đầu túc i (0..360)
})();
const MANSION_WIDTH_NORM = MANSIONS_28.map((m) => (m.width / MANSION_TOTAL_RAW) * 360);

// ---- 12 CUNG (十二宫) — 七政 dùng 12 cung hoàng đạo kiểu Tây nhưng đặt tên Hán ----
// Thứ tự thuận hoàng đạo; mỗi cung 30°. Cung 命 (Mệnh) = cung chứa Nhật,
// rồi các cung còn lại đặt theo Mệnh (cổ: 月将逆数至生时 để định 命宫 —
// simplified: dùng cung hoàng đạo của Nhật làm 命).
const PALACES_12 = [
  { key: 'ming',  zh: '命宫', vi: 'Mệnh',     domain: 'bản ngã, thể chất, cả cuộc đời' },
  { key: 'cai',   zh: '财帛', vi: 'Tài Bạch', domain: 'tài sản, tiền bạc, vận tài' },
  { key: 'xiong', zh: '兄弟', vi: 'Huynh Đệ', domain: 'anh em, bạn bè, đồng nghiệp' },
  { key: 'tian',  zh: '田宅', vi: 'Điền Trạch',domain: 'nhà cửa, điền sản, gia đình' },
  { key: 'er',    zh: '男女', vi: 'Nữ Nam',   domain: 'con cái, học vấn, sắc dục' },
  { key: 'nu',    zh: '奴仆', vi: 'Nô Bộc',   domain: 'bộc thuộc, nhân viên, sức khỏe' },
  { key: 'qi',    zh: '妻妾', vi: 'Thê Thiếm',domain: 'vợ/chồng, hôn nhân, tình cảm' },
  { key: 'ji',    zh: '疾厄', vi: 'Tật Ách',  domain: 'bệnh tật, tai nạn, hiểm nguy' },
  { key: 'qian',  zh: '迁移', vi: 'Thiên Di', domain: 'di chuyển, du học, xuất ngoại' },
  { key: 'guan',  zh: '官禄', vi: 'Quan Lộc', domain: 'sự nghiệp, quan chức, danh vọng' },
  { key: 'fu',    zh: '福德', vi: 'Phúc Đức', domain: 'phúc đức, tâm tính, giàu nghổ' },
  { key: 'xiang', zh: '相貌', vi: 'Tướng Mạo',domain: 'ngoại hình, nhân duyên, cuối đời' },
];

// ---- 7 CHÍNH TINH (七政) ----
const SEVEN_GOVS = [
  { name: '日', vi: 'Thái Dương', en: 'Sun',     wx: '火', body: 'sun' },
  { name: '月', vi: 'Thái Âm',   en: 'Moon',    wx: '水', body: 'moon' },
  { name: '水', vi: 'Thủy Tinh', en: 'Mercury', wx: '水', body: Body.Mercury },
  { name: '金', vi: 'Kim Tinh',  en: 'Venus',   wx: '金', body: Body.Venus },
  { name: '火', vi: 'Hỏa Tinh',  en: 'Mars',    wx: '火', body: Body.Mars },
  { name: '木', vi: 'Mộc Tinh',  en: 'Jupiter', wx: '木', body: Body.Jupiter },
  { name: '土', vi: 'Thổ Tinh',  en: 'Saturn',  wx: '土', body: Body.Saturn },
];

// ---- 4 DƯ (四余) — MEAN MOTION cổ điển ----
// Epoch J2000.0 = 2000-01-01 12:00 TT ≈ JD 2451545.0. Toạ độ mean tại epoch
// (giá trị cổ điển thường trích) + vận tốc góc/năm (nghịch hành = âm).
// Nguồn:.bill false-ephemeris mean elements (Meeus / 台湾中央研究院).
const SI_YU = [
  // 罗睺 = mean ascending node (Ω). Chu kỳ 18.613 năm → -19.3414°/năm.
  // Epoch mean longitude @ J2000 = 125.04452° (Meeus, Astronomical Algorithms eq. 22.1).
  // [cycle 39] SỬA: giá trị cũ 86.554847° sai ~38.5° → 天星择日 eclipse guard báo sai ngày
  //   (0/8 nhật thực thật, ~9 ngày không phải nhật thực). Verify: 6/8 nhật thực thật bắt được.
  { name: '罗睺', vi: 'La Hầu',  wx: '火', epochLon: 125.04452,  ratePerYear: -19.3414, retrograde: true  },
  // 计都 = descending node = 罗睺 + 180° (= 305.04452 @ J2000, derived tự động trong getSiYu).
  { name: '计都', vi: 'Kế Đô',   wx: '土', epochLon: 305.04452,  ratePerYear: -19.3414, retrograde: true, derived: 'luohead' },
  // 月孛 = mean lunar APOGEE (Lilith). Meeus Astronomic Algorithms: mean perigee
  //   M' = 83.3532432 + 4069.0137·T → mean APOGEE = perigee + 180° = 263.3532432° @ J2000.
  //   [cycle 40] SỬA 2 lỗi: (1) epoch cũ 83.3286° là PERIGEE, không phải apogee → antipodal ~180°;
  //   (2) rate cũ -40.6767 (nghịch hành) SAI — hệ số Meeus DƯƠNG (+4069°/century) = PROGRADE
  //   (tháng cận điểm 27.55d > tháng恒星 27.32d → viễn điểm thuận hành). Audit-cycle trước gán
  //   nhãn "retrograde" cho rate dương là nhầm. Nay: epoch apogee + rate PROGRADE.
  { name: '月孛', vi: 'Nguyệt Bạt', wx: '水', epochLon: 263.3532432, ratePerYear:  40.690137, retrograde: false },
  // 紫气 = tinh dư THUẬN HÀNH, CỔ ĐIỂN (không có vật thể thiên văn thật — construct truyền thống).
  // NOTE [cycle 40]: CHU KỲ & EPOCH KHÔNG verificar được — tài liệu chênh: Wikipedia 七政四馀 nói 28 năm
  //   (→ 12.857°/năm), code dùng 29.5 năm (→ 12.2034°/năm, có thể nhầm với tháng hội). Epoch 276.04°
  //   cũng không khớp nguồn nào xác định. Giữ nguyên + flag vì không có ground-truth — đổi 1 giá trị
  //   không verificar được sang giá trị khác không tốt hơn. (TODO: verify từ 果老星宗 nguyên thư.)
  { name: '紫气', vi: 'Tử Khí',  wx: '木', epochLon: 276.04,    ratePerYear:  12.2034, retrograde: false },
];

// J2000.0 epoch (JD 2451545.0) → Date
const J2000 = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));

// ============================================================================
//  HÀM CỐT LÕI
// ============================================================================

const norm360 = (x) => ((x % 360) + 360) % 360;

// ---- AYANAMSA (岁差) — hệ SIDEREAL (định tinh theo 28 túc cố định theo sao) ----
// astronomy-engine trả về kinh độ hoàng đạo TROPICAL (đo từ điểm xuân phân, điểm này
// tiến trước ~50.3"/năm). Nhưng 28 túc (二十八宿) CỐ ĐỊNH theo sao → cần trừ AYANAMSA
// để đưa về hệ SIDERAL (theo sao). Nếu KHÔNG trừ → mọi tinh lệch ~24° → sai túc toàn bộ.
// (Bug cũ: dùng tropical + geocentric cho nhật/muội nhưng HELIOCENTRIC cho 5 tinh + không
//  trừ ayanamsa → Mặt Trời Hạ chí báo ở 斗 thay vì 觜/参. Đã sửa.)
// Lahiri ayanamsa: 23.856° @ J2000 + 0.013964°/năm (≈24.2° năm 2026). Chuẩn phổ biến,
// có thể kiểm chứng (Spica 角宿一 = 180° sidereal).
const AYANAMSA_J2000 = 23.856;
const AYANAMSA_RATE = 0.013964; // °/năm
export function ayanamsa(date) {
  const yrs = (date.getTime() - J2000.getTime()) / (365.25 * 86400000);
  return AYANAMSA_J2000 + AYANAMSA_RATE * yrs;
}
// Túc 角 (Jiao) — túc ĐẦU TIÊN — bắt đầu tại ~174° sidereal (Spica 角宿一 tại 180° sidereal
// nằm trong 角, rộng ~12°). Do mảng MANSION_START đặt 角@0, toạ độ dò túc phải DỊCH −174°.
// Convention tài liệu (Lahiri + 果老); các phái cổ cổ điển lệch ±vài độ — đây là 1 convention
// khả bảo, chỉnh ~24° ayanamsa mới là sửa chữa lớn.
const JIAO_ANCHOR = 174; // sidereal°

const toSidereal = (tropicalLon, date) => norm360(tropicalLon - ayanamsa(date));

/**
 * Toạ độ SIDEREAL (0..360°, theo 28 túc cố định) cho 7 chính tinh tại thời điểm sinh.
 * Sun = SunPosition (geocentric of-date), Moon = EclipticGeoMoon (geocentric of-date),
 * 5 hành tinh = GeoVector + Rotation_EQJ_ECT (geocentric of-date — KHÔNG heliocentric).
 * Sau đó trừ ayanamsa → hệ sidereal. `longitude` trả về = sidereal.
 *
 * @param {Date} date - UTC Date của thời điểm sinh
 * @returns {Array<{name, vi, en, wx, longitude:number}>}
 */
export function getLuminaries(date) {
  return SEVEN_GOVS.map((g) => {
    let tropical;
    if (g.body === 'sun') tropical = SunPosition(date).elon;
    else if (g.body === 'moon') tropical = EclipticGeoMoon(date).lon;
    else {
      // 5 hành tinh: GEOCENTRIC (KHÔNG phải heliocentric!). EclipticLongitude là heliocentric
      // (lỗi cũ) → trừ đỡ sai elongation ±50° cho Thủy/Kim. Đúng phải GeoVector (geocentric EQJ)
      // rồi xoay EQJ→ECT (hoàng đạo thật của ngày), cuối cùng atan2(y,x) ra kinh độ.
      const geoEqj = GeoVector(g.body, date, true);
      const geoEct = RotateVector(Rotation_EQJ_ECT(date), geoEqj);
      tropical = (Math.atan2(geoEct.y, geoEct.x) * 180) / Math.PI;
    }
    // Trừ ayanamsa → hệ SIDEREAL (theo 28 túc cố định), khớp với mảng túc.
    const longitude = toSidereal(tropical, date);
    return { name: g.name, vi: g.vi, en: g.en, wx: g.wx, longitude };
  });
}

/**
 * 4 DƯ (四余) theo công thức MEAN MOTION cổ điển.
 * 计都 = 罗睺 + 180° (luôn đối xứng qua điểm xuân phân).
 *
 * @param {Date} date
 * @returns {Array<{name, vi, wx, longitude:number, retrograde:boolean}>}
 */
export function getSiYu(date) {
  // Số năm (TT xấp xỉ UT, sai số nhỏ — truyền thống chấp nhận được)
  const yearsSinceJ2000 = (date.getTime() - J2000.getTime()) / (365.25 * 86400000);
  return SI_YU.map((s) => {
    let tropical;
    if (s.derived === 'luohead') {
      // 计都 = 罗睺 + 180° — tính từ La Hầu đã norm
      const luo = norm360(SI_YU[0].epochLon + SI_YU[0].ratePerYear * yearsSinceJ2000);
      tropical = norm360(luo + 180);
    } else {
      tropical = norm360(s.epochLon + s.ratePerYear * yearsSinceJ2000);
    }
    // Mean-motion cổ = tropical-of-epoch; trừ ayanamsa để đồng hệ sidereal với 7 chính tinh.
    const longitude = toSidereal(tropical, date);
    return { name: s.name, vi: s.vi, wx: s.wx, longitude, retrograde: s.retrograde };
  });
}

/**
 * Map toạ độ hoàng đạo (0..360) → túc (二十八宿).
 * Hệ 28 túc tổng ≈ 365.25°, nên modulo 365.25 để vào vòng túc, rồi dò start.
 *
 * @param {number} longitude - toạ độ hoàng đạo 0..360
 * @returns {{idx:number, zhi:string, vi:string, wx:string, beast:string, width:number,
 *           startInMansion:number, offset:number, fraction:number}}
 */
export function longitudeToMansion(longitude) {
  // Dịch về hệ mảng (角@0): trừ JIAO_ANCHOR (174° sidereal). lon sidereal đầu vào.
  const lon = norm360(longitude - JIAO_ANCHOR);
  // Dò túc: tìm start cuối cùng ≤ lon (mảng tile đầy [0,360) nên wrap tự nhiên).
  let idx = 0;
  for (let i = 0; i < MANSIONS_28.length; i++) {
    if (MANSION_START[i] <= lon) idx = i;
    else break;
  }
  const m = MANSIONS_28[idx];
  const wNorm = MANSION_WIDTH_NORM[idx];
  const offset = lon - MANSION_START[idx];
  return {
    idx,
    zhi: m.zhi,
    vi: m.vi,
    wx: m.wx,
    beast: m.beast,
    width: m.width,
    startInMansion: MANSION_START[idx],
    offset,
    fraction: wNorm > 0 ? offset / wNorm : 0,
  };
}

/**
 * Map toạ độ hoàng đạo → cung (十二宫). Mỗi cung 30°.
 *
 * @param {number} longitude
 * @returns {{idx:number, key:string, zh:string, vi:string, domain:string}}
 */
export function longitudeToPalace(longitude) {
  const lon = norm360(longitude);
  return { ...PALACES_12[Math.floor(lon / 30) % 12], idx: Math.floor(lon / 30) % 12 };
}

/**
 * Phái sinh 12 cung: 命宫 = cung chứa Nhật (classical simplification của 月将逆数至生时).
 * Các cung còn lại đặt theo Mệnh (Mệnh cung = Nhật cung, rồi thuận hành hoàng đạo).
 *
 * Thực ra longitudeToPalace đã dùng toạ độ tuyệt đối; ở đây ta ĐỊNH NGHĨA lại:
 * cung Mệnh = cung hoàng đạo của Nhật, và GÁN nhãn cung theo offset từ Mệnh.
 * (Đây là cách 果老星宗 đặt cung: cung Mệnh là mốc, 11 cung còn lại đếm thuận.)
 *
 * @param {number} sunLongitude - toạ độ hoàng đạo của Nhật
 * @param {number} birthHour - giờ sinh 0..23 (dùng để tinh chỉnh 命 cung theo cổ)
 * @returns {{palaceOfSun:number, palaces:Array}}
 */
export function derive12Palaces(sunLongitude, birthHour) {
  const sunLon = norm360(sunLongitude);
  // Cung hoàng đạo tuyệt đối của Nhật (0..11)
  const sunPalaceAbs = Math.floor(sunLon / 30) % 12;

  // Cổ: 命宫 = 月将 (cung hoàng đạo của Nhật vào tháng sinh) 逆数 tới 生时 (giờ sinh).
  // 月将 = sunPalaceAbs; 生时 idx (子=0..亥=11). Mệnh cung offset = (sunPalaceAbs - hourZhi + 12) % 12.
  const hourZhi = Math.floor(((birthHour + 1) % 24) / 2); // 23-1=子(0), 1-3=丑(1)...
  const mingAbs = ((sunPalaceAbs - hourZhi) % 12 + 12) % 12;

  // Gán nhãn cung theo offset từ Mệnh: PALACES_12[0]=命 tại mingAbs, [1]=tài tại mingAbs+1, ...
  const palaces = PALACES_12.map((p, i) => {
    const absIdx = (mingAbs + i) % 12;
    return {
      ...p,
      absIdx,
      centerLongitude: absIdx * 30 + 15, // độ trung tâm cung
    };
  });

  return { palaceOfSun: sunPalaceAbs, palaceOfMing: mingAbs, hourZhi, palaces };
}

// ============================================================================
//  LUẬN GIẢI — ý nghĩa chính tinh × cung (rút gọn 1-2 câu, theo 果老星宗 / 星学大成)
// ============================================================================

// Ý nghĩa cơ bản của mỗi chính tinh (không phân cung)
const PLANET_MEANING = {
  '日': 'Thái Dương — ngôi sao chủ tể, danh vọng, người cha, sự nghiệp hiển hách, sức sống dồi dào.',
  '月': 'Thái Âm — ngôi sao nhu thuận, người mẹ, tình cảm, gia đạo, cảm xúc, của cải ẩn.',
  '水': 'Thủy Tinh — trí tuệ, văn thư, giao thiệp, lanh lợi, học vấn, buôn bán.',
  '金': 'Kim Tinh — tài lộc, sắc đẹp, nghệ thuật, tình duyên, hưởng thụ, vợ/chồng.',
  '火': 'Hỏa Tinh — chiến đấu, dũng cảm, nóng nảy, quân sự, bất ngờ, tai hoạ hình thương.',
  '木': 'Mộc Tinh — nhân từ, trưởng giả, học vấn, tôn giáo, phúc đức, tăng tiến.',
  '土': 'Thổ Tinh — kiên nhẫn, thủ cựu, thứ bậc, điền sản, nghịch cảnh, chậm trễ.',
};
const SIYU_MEANING = {
  '罗睺': 'La Hầu — kế đô tinh nghịch, chủ thị phi, khẩu thiệp, tai nạn bất ngờ, khuất tất.',
  '计都': 'Kế Đô — la hầu đối xứng, chủ ốm đau, hiểm nguy, hao tài, dèm pha.',
  '月孛': 'Nguyệt Bạt — tinh dư chủ sắc dục, ảo tưởng, bạo liệt, ẩn nịnh, thị phi nam nữ.',
  '紫气': 'Tử Khí — tinh dư cát, chủ phúc đức, quý nhân, thanh cao, tôn giáo, thọ.',
};

// Đặc tính 12 cung (luận khi chính tinh nhập cung)
const PALACE_DOMAIN = Object.fromEntries(PALACES_12.map((p) => [p.key, p.domain]));

/**
 * Luận ngắn cho 1 chính tinh/tinh dư tại 1 cung.
 * Tone (cat/hung/mid) cố định theo TINH (bảng PALACE_TONE — thiên tính Hán cổ);
 * cung chỉ đóng góp domain (chủ đề lĩnh vực) vào văn bản luận.
 * (NOTE: phiên bản này KHÔNG làm ngũ hành tinh×cung sinh/khắc — bảng ngũ hành cung
 *  bị tranh chấp giữa các phái 果老/星学. Nếu sau này thống nhất được 1 convention, thêm
 *  fiveCycleRole(planet.wx, palaceWx) để tone biến thiên theo cung.)
 */
function interpret(planet, palace) {
  const base = (PLANET_MEANING[planet.name] || SIYU_MEANING[planet.name] || '');
  const tone = PALACE_TONE[planet.name] || 'mid';
  const toneVi = tone === 'cat' ? 'cát' : tone === 'hung' ? 'hung' : 'trung';
  return {
    tone,
    toneVi,
    text: `${planet.vi} (${planet.name}) nhập ${palace.vi} (${palace.zh}) — ${toneVi} tinh. Chủ ${PALACE_DOMAIN[palace.key] || ''}. ${base}`,
  };
}

// Tone tổng quát của mỗi chính tinh (thiên tính Hán cổ)
const PALACE_TONE = {
  '日': 'cat', '月': 'cat', '木': 'cat', '紫气': 'cat',
  '金': 'cat', '水': 'mid',
  '火': 'hung', '土': 'mid',
  '罗睺': 'hung', '计都': 'hung', '月孛': 'hung',
};

// ============================================================================
//  API CHÍNH
// ============================================================================

/**
 * Tính lá số 七政四余 đầy đủ.
 *
 * @param {number} year  - năm DL (vd 1993)
 * @param {number} month - tháng DL 1..12
 * @param {number} day   - ngày 1..31
 * @param {number} hour  - giờ 0..23
 * @param {number} minute - phút 0..59
 * @param {number} [tzOffset=7] - offset giờ VN (UTC+7). Mặc định Việt Nam.
 * @returns {{
 *   input:{year,month,day,hour,minute,tzOffset},
 *   utcDate:Date,
 *   luminaries:Array, siyu:Array,
 *   palaces:Array, palaceOfMing:number, palaceOfSun:number,
 *   chart:{planets:Array, mansionsUsed:object, mingPalace:object, summary:string},
 * }}
 */
export function qizheng(year, month, day, hour, minute, tzOffset = 7) {
  // Chuyển giờ địa phương (VN) sang UTC
  const localMs = Date.UTC(year, month - 1, day, hour, minute || 0, 0);
  const utcDate = new Date(localMs - tzOffset * 3600000);

  const luminaries = getLuminaries(utcDate);
  const siyu = getSiYu(utcDate);

  // Nhật toạ độ → phái sinh 12 cung
  const sun = luminaries.find((l) => l.name === '日');
  const { palaceOfSun, palaceOfMing, hourZhi, palaces } = derive12Palaces(sun.longitude, hour);

  // Map mỗi tinh (7 chính + 4 dư) vào túc + cung
  const allPlanets = [...luminaries, ...siyu];
  const planets = allPlanets.map((p) => {
    const mansion = longitudeToMansion(p.longitude);
    const palaceAbs = longitudeToPalace(p.longitude); // cung tuyệt đối
    // Tìm cung theo hệ Mệnh (đếm từ Mệnh): offset = (absIdx - mingAbs + 12) % 12
    const offsetFromMing = ((palaceAbs.idx - palaceOfMing) % 12 + 12) % 12;
    const namedPalace = PALACES_12[offsetFromMing];
    const inter = interpret(p, namedPalace);
    return {
      name: p.name,
      vi: p.vi,
      wx: p.wx,
      longitude: +p.longitude.toFixed(3),
      retrograde: p.retrograde ?? false,
      mansion: { zhi: mansion.zhi, vi: mansion.vi, wx: mansion.wx, beast: mansion.beast, fraction: +mansion.fraction.toFixed(3) },
      palace: { key: namedPalace.key, zh: namedPalace.zh, vi: namedPalace.vi, domain: namedPalace.domain, offsetFromMing, absIdx: palaceAbs.idx },
      tone: inter.tone,
      toneVi: inter.toneVi,
      interpretation: inter.text,
      isShadow: p.name === '罗睺' || p.name === '计都' || p.name === '月孛' || p.name === '紫气',
    };
  });

  // Cung Mệnh = cung mà Mệnh (offset 0) trỏ tới = PALACES_12[0] tại absIdx = palaceOfMing
  const mingPalace = {
    ...PALACES_12[0],
    absIdx: palaceOfMing,
    centerLongitude: palaceOfMing * 30 + 15,
    planets: planets.filter((p) => p.palace.offsetFromMing === 0).map((p) => p.name),
  };

  // Mansions used (lookup) + summary
  const mansionsUsed = {};
  for (const p of planets) mansionsUsed[p.mansion.zhi] = p.mansion.vi;

  const catCount = planets.filter((p) => p.tone === 'cat').length;
  const hungCount = planets.filter((p) => p.tone === 'hung').length;
  const summary =
    `Lá số 七政四余 — ${year}-${month}-${day} ${String(hour).padStart(2,'0')}:${String(minute||0).padStart(2,'0')} (UTC${tzOffset>=0?'+':''}${tzOffset}). ` +
    `Mệnh cung hoàng đạo #${palaceOfMing + 1} (${PALACES_12[0].vi}, tuyệt đối ${palaceOfMing * 30}–${(palaceOfMing+1)*30}°). ` +
    `Nhật tại ${sun.longitude.toFixed(1)}° sidereal (tropical ${(sun.longitude + ayanamsa(utcDate)).toFixed(1)}°, ${longitudeToMansion(sun.longitude).vi} túc). ` +
    `11 tinh (7 chính + 4 dư): ${catCount} cát / ${hungCount} hung. ` +
    `Nhật+Mộc+Thái Âm thuận vị → danh vọng, phúc đức; Hỏa/La Hầu hung vị → cẩn thận hình thương, thị phi.`;

  return {
    input: { year, month, day, hour, minute: minute || 0, tzOffset },
    utcDate: utcDate.toISOString(),
    luminaries,
    siyu,
    palaceOfMing,
    palaceOfSun,
    hourZhi,
    palaces: palaces.map((p) => ({ ...p, planets: planets.filter((pl) => pl.palace.absIdx === p.absIdx).map((pl) => pl.name) })),
    chart: {
      planets,
      mansionsUsed,
      mingPalace,
      summary,
    },
  };
}

// ---- UI helper: render thẻ HTML (dùng chung class với huangdao/ziwei) ----
export function renderQizhengCard(r) {
  const planetRow = (p) => {
    const cls = p.tone === 'cat' ? 'rate-cat' : p.tone === 'hung' ? 'rate-hung' : '';
    const shadow = p.isShadow ? ' <span class="hint-inline">(dư)</span>' : '';
    return `
      <div class="ln" style="min-width:150px">
        <div class="ln-year"><span class="zh">${p.name}</span> ${p.vi}${shadow}</div>
        <div class="ln-gz">${p.longitude}° · <span class="zh">${p.mansion.zhi}</span> ${p.mansion.vi} túc</div>
        <div class="ln-rate ${cls}"><span class="zh">${p.palace.zh}</span> ${p.palace.vi}</div>
        <div class="ln-flags" style="font-size:11px;color:var(--muted)">${p.interpretation}</div>
      </div>`;
  };
  const seven = r.chart.planets.filter((p) => !p.isShadow);
  const yu = r.chart.planets.filter((p) => p.isShadow);
  return `
    <div class="zr-head"><b>${r.input.year}-${r.input.month}-${r.input.day} ${String(r.input.hour).padStart(2,'0')}:${String(r.input.minute).padStart(2,'0')}</b> · 七政四余 · Mệnh cung hoàng đạo <b>#${r.palaceOfMing + 1}</b> <span class="zh">${PALACES_12[0].zh}</span></div>
    <p class="hint" style="margin:4px 0">${r.chart.summary}</p>
    <h4 class="syn-h4" style="margin-top:6px">七政 — 7 chính tinh (toạ độ hoàng đạo thật)</h4>
    <div class="ln-decade" style="display:flex;flex-wrap:wrap;gap:6px">${seven.map(planetRow).join('')}</div>
    <h4 class="syn-h4" style="margin-top:8px">四余 — 4 tinh dư (mean motion cổ)</h4>
    <div class="ln-decade" style="display:flex;flex-wrap:wrap;gap:6px">${yu.map(planetRow).join('')}</div>
    <p class="hint" style="margin-top:6px">注: 七政 dùng toạ độ GEOCENTRIC thật (astronomy-engine) trừ ayanamsa (岁差 ~24°) → hệ SIDERAL theo 28 túc cố định; 四余 dùng mean-motion cổ (罗睺/计都/月孛/紫气). Toạ độ hiển thị = kinh độ sidereal (theo sao), 角@174°.</p>`;
}

// ---- Export constants cho selftest/external ----
// MANSION_TOTAL_RAW = tổng width thô (323) — dùng cho kiểm chứng cấu trúc 4 phương.
// MANSION_TOTAL     = 360 — tổng sau chuẩn hoá, dùng cho toạ độ hoàng đạo thật.
export { MANSIONS_28, PALACES_12, SEVEN_GOVS, SI_YU, MANSION_TOTAL, MANSION_TOTAL_RAW, PLANET_MEANING, SIYU_MEANING };
