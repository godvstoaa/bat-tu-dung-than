// ============================================================================
//  七政四余天星择日 (TIAN XING ZHE RI — Star-based date selection)
//  "Tôi muốn khởi công / dọn nhà / an táng hướng X — ngày nào sao sáng chiếu đúng
//   hướng?" — chọn ngày dựa trên vị trí THẬT của 7 chính tinh (đặc biệt 日/月) tới
//   坐向 (sơn toạ / hướng đối cung) của nhà/mộ. Nền tảng: qizheng.js (cycle 37 đã
//   sửa sidereal + geocentric) đã tính đúng kinh độ sidereal của 7 chính tinh + 4 dư.
//
//  Thuật toán (chỉ hiện quy tắc CỔ THƯ ĐỒNG THUẬN — bảo thủ, đánh dấu phần tranh
//  luận trong comment, KHÔNG bịa bảng trường phái không có nguồn verified):
//    Tier 1: 太阳到向/到山, 太阴到山/到向, 金水辅日月 (Kim/Thủy kẹp Nhật/Nguyệt).
//    Tier 2: 恩用仇难 — ngũ hành tinh × ngũ hành (化气) của sơn → vai (恩/主/用/财/难).
//    Tier 3: 归垣 (tinh về cung nhà).
//    Tier 4: 调候 mùa (đông chuộng Hỏa, hạ chuộng Thủy/Kim).
//    Tier 5: cấm cứng — 罗计掩日月 (cửa nhật/nguyệt thực) → −100; 燃烧 (<8° Nhật) −2.
//
//  ⚠️ PHÂN BIỆT HỆ TOẠ ĐỘ (QUAN TRỌNG — spec TIANXING-ZHERI-SPEC.md dòng 43 ghi
//     dùng sidereal_lon cho mountainIndexOf là SAI):
//    - 24 sơn 到山/到山/到向 được NEO theo KHÍ TIẾT (冬至→子, 春分→卯, 夏至→午, 秋分→酉)
//      = hệ 天盘 theo tiết khí = KINH ĐỘ TROPICAL (đo từ điểm xuân phân). Đây là
//      "太阳到山盘" kinh điển. → mountainIndexOf dùng TROPICAL.
//      Verify: 冬至(tropical 270°)→子(0), 春分(0°)→卯(6), 夏至(90°)→午(12), 秋分(180°)→酉(18).
//    - 28 túc placement (display) dùng SIDEREAL (đo theo sao cố định) — qizheng.js
//      `getLuminaries` đã trả sidereal. → display mansion dùng sidereal.
//    - qizheng.getLuminaries(date) trả SIDEREAL. Để có TROPICAL: tropical = sidereal + ayanamsa(date).
//
//  Nguồn: 易先生/赖布衣 (七政四余择日法), 搜狐/岳鼎竣 (天星择日三), 福山堂 七政四余天星课,
//  钦定协纪辨方书 卷34. Spec đầy đủ: docs/TIANXING-ZHERI-SPEC.md.
// ============================================================================
import { Solar } from 'lunar-javascript';
import {
  getLuminaries, getSiYu, ayanamsa, longitudeToMansion,
} from './qizheng.js';

// ---------------------------------------------------------------------------
//  BẢNG 24 SƠN (天盘 tiết-khí) — thứ tự la bàn thuận từ 子, mỗi sơn 15°.
//  NEO theo tiết khí: trung tâm 子 (index 0) = 冬至 = kinh độ tropical 270°.
//  (Đây là mảng RIÊNG của天星择日 — KHÔNG trùng thứ tự MOUNTAINS_24 của yinzhai.js,
//   vốn neo theo hướng la bàn địa lý 0°=Bắc. Ở đây neo theo KHÍ TIẾT cho 太阳到山盘.)
// ---------------------------------------------------------------------------
const MOUNTAINS_24 = [
  '子', '癸', '丑', '艮', '寅', '甲', '卯', '乙',
  '辰', '巽', '巳', '丙', '午', '丁', '未', '坤',
  '申', '庚', '酉', '辛', '戌', '乾', '亥', '壬',
];
const MOUNTAIN_VI = {
  子: 'Tý', 癸: 'Quý', 丑: 'Sửu', 艮: 'Cấn', 寅: 'Dần', 甲: 'Giáp', 卯: 'Mão', 乙: 'Ất',
  辰: 'Thìn', 巽: 'Tốn', 巳: 'Tỵ', 丙: 'Bính', 午: 'Ngọ', 丁: 'Đinh', 未: 'Mùi', 坤: 'Khôn',
  申: 'Thân', 庚: 'Canh', 酉: 'Dậu', 辛: 'Tân', 戌: 'Tuất', 乾: 'Càn', 亥: 'Hợi', 壬: 'Nhâm',
};

// Lục xung (đối cung 180° = cách 12 sơn) — hướng đối xứng của toạ sơn.
const CHONG = {
  子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯',
  辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳',
  // 4 trục giữa thiên-can/gua: đối cung 180° trong mảng 24 (idx+12)
  癸: '丁', 丁: '癸', 艮: '坤', 坤: '艮', 甲: '庚', 庚: '甲', 乙: '辛', 辛: '乙',
  巽: '乾', 乾: '巽', 丙: '壬', 壬: '丙',
};

// ---------------------------------------------------------------------------
//  BẢNG PLANET → NGŨ HÀNH (đồng thuận cao — spec dòng 47-48).
//  ⚠️ DEBATED: Nguyệt (月) — có phái dùng Kim thay Thủy. Spec + task yêu cầu bảo thủ
//     dùng Thủy (theo 大六壬/果老 thường thấy). Đánh dấu ở comment, không toggle v1.
// ---------------------------------------------------------------------------
const PLANET_WX = {
  日: '火', 月: '水', // ⚠ 月=水 (bảo thủ, spec); phái khác dùng 金.
  水: '水', 金: '金', 火: '火', 木: '木', 土: '土',
};
const PLANET_VI = {
  日: 'Thái Dương', 月: 'Thái Âm', 水: 'Thủy Tinh', 金: 'Kim Tinh',
  火: 'Hỏa Tinh', 木: 'Mộc Tinh', 土: 'Thổ Tinh',
};

// ---------------------------------------------------------------------------
//  BẢNG SƠN → NGŨ HÀNH (2 hệ: 化气 mặc định + 正体 toggle) — spec dòng 50-65.
// ---------------------------------------------------------------------------
// Hệ HÓA KHÍ (地支六合化气 — phái 易先生/赖布衣). 丙午=太阳/丁未=太阴 là sơn đặc biệt.
// ⚠ Đây là 1 trường phái cụ thể — document rõ + cho toggle (spec dòng 61).
const HUAQI_WX = {
  // 4 sơn / nhóm, theo bảng spec:
  壬: '土', 子: '土', 癸: '土', 丑: '土',          // 壬子癸丑 → 土
  艮: '木', 寅: '木', 乾: '木', 亥: '木',          // 艮寅乾亥 → 木
  甲: '火', 卯: '火', 辛: '火', 戌: '火',          // 甲卯辛戌 → 火
  乙: '金', 辰: '金', 庚: '金', 酉: '金',          // 乙辰庚酉 → 金
  巽: '水', 巳: '水', 坤: '水', 申: '水',          // 巽巳坤申 → 水
  丙: '太阳', 午: '太阳',                           // 丙午 → 太阳 (đặc biệt)
  丁: '太阴', 未: '太阴',                           // 丁未 → 太阴 (đặc biệt)
};

// Hệ CHÍNH THỂ (正体五行 — địa chi bản quẻ / hà đồ). Toggle thay thế.
const ZHENGTI_WX = {
  壬: '水', 子: '水', 癸: '水',
  丑: '土', 艮: '木', 寅: '木',
  甲: '木', 卯: '木', 乙: '木',
  辰: '土', 巽: '木', 巳: '火',
  丙: '火', 午: '火', 丁: '火',
  未: '土', 坤: '土', 申: '金', // 坤申: spec ghi 土/金 — dùng 土 (bảo thủ, địa chi 申=Kim/quẻ 坤=Thổ)
  庚: '金', 酉: '金', 辛: '金',
  戌: '土', 乾: '金', 亥: '水',
};

// ---------------------------------------------------------------------------
//  NGŨ HÀNH TƯƠNG SINH / TƯƠNG KHẮC — dùng cho vai 恩用仇难 (Tier 2).
//  fiveCycleRole(planetWx, mountainWx) → vai của tinh đối với sơn:
//    恩 (sinh tôi — sinh sơn):     +3     主 (đồng hành, = sơn):  +2
//    用 (tôi sinh — sơn sinh tinh): +2    财/仇 (tôi khắc sơn):     0 (bảo thủ — có phái +1)
//    难 (khắc tôi — khắc sơn):      −3
// ---------------------------------------------------------------------------
const SHENG = { 水: '木', 木: '火', 火: '土', 土: '金', 金: '水' }; // A sinh B
const KE = { 水: '火', 火: '金', 金: '木', 木: '土', 土: '水' };    // A khắc B

function fiveCycleRole(planetWx, mountainWx) {
  if (planetWx === mountainWx) return { role: '主', score: 2, vi: 'Chủ (đồng hành)' };
  if (SHENG[planetWx] === mountainWx) return { role: '恩', score: 3, vi: 'Ân (tinh sinh sơn)' };
  if (SHENG[mountainWx] === planetWx) return { role: '用', score: 2, vi: 'Dụng (sơn sinh tinh)' };
  if (KE[planetWx] === mountainWx) return { role: '财', score: 0, vi: 'Tài (tinh khắc sơn — bảo thủ=0)' };
  if (KE[mountainWx] === planetWx) return { role: '难', score: -3, vi: 'Nạn (sơn khắc tinh)' };
  return { role: '财', score: 0, vi: 'Tài (bảo thủ=0)' };
}

// ---------------------------------------------------------------------------
//  HÀM CỐT LÕI
// ---------------------------------------------------------------------------
const norm360 = (x) => ((x % 360) + 360) % 360;
const angDist = (a, b) => {
  const d = Math.abs(norm360(a) - norm360(b)) % 360;
  return d > 180 ? 360 - d : d;
};

/**
 * mountainIndexOf — ánh xạ KINH ĐỘ TROPICAL → 24 sơn (天盘 tiết-khí).
 * Neo: 冬至 (Nhật tropical 270°) → trung tâm 子 (index 0). Mỗi sơn 15°.
 * ⚠ Dùng TROPICAL (KHÔNG phải sidereal — spec dòng 43 SAI). Xem header file.
 *
 * Verify: tropical 270→子(0), 0→卯(6), 90→午(12), 180→酉(18).
 *
 * @param {number} tropicalLon - kinh độ hoàng đạo tropical 0..360
 * @returns {number} index 0..23 trong MOUNTAINS_24
 */
export function mountainIndexOf(tropicalLon) {
  const offset = norm360(tropicalLon - 270); // 270° (冬至) → 0
  return ((Math.round(offset / 15) % 24) + 24) % 24;
}

/** Tên sơn từ kinh độ tropical. */
export function mountainOf(tropicalLon) {
  return MOUNTAINS_24[mountainIndexOf(tropicalLon)];
}

/** Ngũ hành của sơn theo hệ chọn (huaji mặc định | zhengti toggle). */
export function mountainElement(sitting, mountainSystem = 'huaji') {
  const tbl = mountainSystem === 'zhengti' ? ZHENGTI_WX : HUAQI_WX;
  return tbl[sitting] || '土';
}

// ---------------------------------------------------------------------------
//  Lấy toạ độ 7 chính tinh cho 1 ngày (đúng hệ: tropical cho 24-sơn, sidereal cho 28-túc).
//  Trả về mảng 7 body, mỗi body có: name, vi, wx, sidereal (cho 28-túc), tropical (cho 24-sơn),
//  mountainIdx, mansion ({zhi, vi}), distToSun.
// ---------------------------------------------------------------------------
function bodiesForDate(date) {
  const aya = ayanamsa(date);
  const lums = getLuminaries(date); // sidereal
  const sunSid = lums.find((l) => l.name === '日').longitude;
  const sunTrop = norm360(sunSid + aya);
  return lums.map((l) => {
    const tropical = norm360(l.longitude + aya); // sidereal + ayanamsa → tropical
    const mIdx = mountainIndexOf(tropical);
    const man = longitudeToMansion(l.longitude); // sidereal cho 28-túc
    return {
      name: l.name,
      vi: l.vi,
      wx: PLANET_WX[l.name] || l.wx,
      sidereal: l.longitude,
      tropical,
      mountainIdx: mIdx,
      mountain: MOUNTAINS_24[mIdx],
      mansion: { zhi: man.zhi, vi: man.vi },
      distToSun: l.name === '日' ? 0 : angDist(tropical, sunTrop),
    };
  });
}

// 4 dư (罗睺/计都/月孛/紫气) — sidereal từ getSiYu, +ayanamsa → tropical.
function siyuForDate(date) {
  const aya = ayanamsa(date);
  return getSiYu(date).map((s) => ({
    name: s.name, vi: s.vi, wx: s.wx,
    sidereal: s.longitude,
    tropical: norm360(s.longitude + aya),
  }));
}

// Mùa theo chi tháng (lunar) — dùng cho 调候 (Tier 4).
function seasonOf(monthZhi) {
  if (['寅', '卯', '辰'].includes(monthZhi)) return 'xuân';
  if (['巳', '午', '未'].includes(monthZhi)) return 'hạ';
  if (['申', '酉', '戌'].includes(monthZhi)) return 'thu';
  return 'đông'; // 亥子丑
}

// ---------------------------------------------------------------------------
//  scoreDay — chấm 1 ngày cho 1 toạ sơn. Trả về {score, hits, breakdown, eclipse}.
//  hits = mảng điều kiện cổ điển khớp (để hiển thị + giải thích).
// ---------------------------------------------------------------------------
function scoreDay(date, sitting, mountainSystem) {
  const sittingIdx = MOUNTAINS_24.indexOf(sitting);
  if (sittingIdx < 0) throw new Error('Sitting mountain không hợp lệ: ' + sitting);
  const facing = CHONG[sitting];
  const facingIdx = MOUNTAINS_24.indexOf(facing);
  // Tam hợp toạ (3 sơn cách nhau 120° = 8 sơn trong mảng 24).
  const trineIdx = [(sittingIdx + 8) % 24, (sittingIdx + 16) % 24];

  const M = mountainElement(sitting, mountainSystem); // ngũ hành sơn (có thể là '太阳'/'太阴')
  const bodies = bodiesForDate(date);
  const siyu = siyuForDate(date);
  const sun = bodies.find((b) => b.name === '日');
  const moon = bodies.find((b) => b.name === '月');

  const hits = [];
  let score = 0;

  // Body tại sơn toạ / hướng / tam hợp?
  // onFacing=1.0 (tới hướng), onSitting=1.0 (tới sơn), trine=0.5 (tam hợp).
  const posOf = (b) => {
    if (b.mountainIdx === facingIdx) return { where: '到向', mag: 1.0 };
    if (b.mountainIdx === sittingIdx) return { where: '到山', mag: 1.0 };
    if (trineIdx.includes(b.mountainIdx)) return { where: '三合', mag: 0.5 };
    return null;
  };

  // ---- TIER 1: Nhật / Nguyệt (cổ thư rõ ràng) ----
  const sunPos = posOf(sun);
  if (sunPos) {
    if (sunPos.where === '到向') { score += 5 * sunPos.mag; hits.push({ tier: 1, zh: '太阳到向', vi: 'Thái Dương đến hướng (+5)', d: +5 * sunPos.mag }); }
    else if (sunPos.where === '到山') { score += 3 * sunPos.mag; hits.push({ tier: 1, zh: '太阳到山', vi: 'Thái Dương đến sơn (+3)', d: +3 * sunPos.mag }); }
    else { score += 3 * sunPos.mag; hits.push({ tier: 1, zh: '太阳三合', vi: 'Thái Dương tam hợp sơn', d: +3 * sunPos.mag }); }
  }
  const moonPos = posOf(moon);
  if (moonPos) {
    if (moonPos.where === '到山') { score += 4 * moonPos.mag; hits.push({ tier: 1, zh: '太阴到山', vi: 'Thái Âm đến sơn (+4)', d: +4 * moonPos.mag }); }
    else if (moonPos.where === '到向') { score += 2 * moonPos.mag; hits.push({ tier: 1, zh: '太阴到向', vi: 'Thái Âm đến hướng (+2)', d: +2 * moonPos.mag }); }
    else { score += 2 * moonPos.mag; hits.push({ tier: 1, zh: '太阴三合', vi: 'Thái Âm tam hợp sơn', d: +2 * moonPos.mag }); }
  }

  // 金水辅日月: Kim + Thủy cùng tới hướng/sơn với Nhật hoặc Nguyệt → "kẹp" phụ chiếu (+2).
  // Định nghĩa bảo thủ: Kim/Thủy ở 到向 hoặc 到山 (không phải tam hợp) → +2 (1 lần).
  const auxAtSittingFacing = bodies.filter((b) => (b.name === '金' || b.name === '水') &&
    (b.mountainIdx === facingIdx || b.mountainIdx === sittingIdx));
  if (auxAtSittingFacing.length >= 1 && (sunPos || moonPos)) {
    score += 2;
    hits.push({ tier: 1, zh: '金水辅日月', vi: 'Kim/Thủy phụ chiếu Nhật/Nguyệt (+2)', d: +2 });
  }

  // ---- TIER 2: 恩用仇难 — chỉ cho 5 hành tinh (日/月 là chủ, bỏ) với sơn 5 hành.
  //   Sơn 太阳/太阴 đặc biệt: bỏ Tier 2 (không có ngũ hành để tương sinh). ----
  if (M !== '太阳' && M !== '太阴') {
    for (const b of bodies) {
      if (b.name === '日' || b.name === '月') continue; // Nhật/Nguyệt = chủ, đã Tier 1
      const pos = posOf(b);
      if (!pos) continue;
      const role = fiveCycleRole(b.wx, M);
      if (role.score === 0) continue; // 财/仇 bảo thủ = 0 → không thêm (giữ hits gọn)
      const delta = +(role.score * pos.mag).toFixed(2);
      score += delta;
      hits.push({
        tier: 2,
        zh: `${b.name}${pos.where}${role.role}`,
        vi: `${b.vi} (${b.name}/${b.wx}) ${pos.where} sơn ${M} → ${role.vi} (${delta>=0?'+':''}${delta})`,
        d: delta,
      });
    }
  }

  // ---- TIER 3: 归垣 — tinh về CUNG NHÀ (cung ngũ hành = ngũ hành tinh). +1.
  //   Định nghĩa bảo thủ: tinh ở sơn có ngũ hành (chính thể) ĐỒNG ngũ hành tinh → +1.
  //   Dùng chính-thể cho "cung nhà" (đơn giản, ít tranh cãi hơn hóa-khí). ----
  for (const b of bodies) {
    if (b.name === '日' || b.name === '月') continue;
    const srtWx = ZHENGTI_WX[b.mountain];
    if (srtWx && srtWx === b.wx) {
      score += 1;
      hits.push({ tier: 3, zh: `${b.name}归垣`, vi: `${b.vi} quy viên (về sơn ${b.mountain} đồng ngũ hành ${b.wx}, +1)`, d: +1 });
    }
  }

  // ---- TIER 4: 调候 mùa — đông chuộng Hỏa, hạ chuộng Thủy/Kim. ----
  const monthZhi = monthZhiOf(date);
  const season = seasonOf(monthZhi);
  if (season === 'đông') {
    const fireAtSF = bodies.some((b) => b.name === '火' && (b.mountainIdx === facingIdx || b.mountainIdx === sittingIdx));
    if (fireAtSF) { score += 1; hits.push({ tier: 4, zh: '冬令调候火', vi: 'Đông lạnh — Hỏa tinh đến sơn/hướng ấm (调候 +1)', d: +1 }); }
  } else if (season === 'hạ') {
    const coolAtSF = bodies.some((b) => (b.name === '水' || b.name === '金') && (b.mountainIdx === facingIdx || b.mountainIdx === sittingIdx));
    if (coolAtSF) { score += 1; hits.push({ tier: 4, zh: '夏令调候水金', vi: 'Hạ nóng — Thủy/Kim đến sơn/hướng mát (调候 +1)', d: +1 }); }
  }

  // ---- TIER 5: CẤM CỨNG / TRỪ ĐIỂM ----
  // 5a. 罗计掩日月 — CỬA NHẬT/NGUYỆT THỰC. Điều kiện cổ điển bảo thủ: cả Nhật VÀ Nguyệt
  //     đều nằm trong ~12° của CÙNG MỘT nút (罗睺 ascending HOẶC 计都 descending).
  //     (Hình học thực: thực chỉ xảy ra khi cả 2 luminaries gần cùng nút + gần sóc/vọng.
  //      Dùng "cả 2 cùng nút" là điều kiện đủ — nghiệm chứng ~3 ngày/năm, khớp mùa thực
  //      thật. Dùng chỉ 1 trong 2 (日 hoặc 月 gần nút) sẽ quá rộng — Mặt Trăng qua nút 2 lần/tháng.)
  let eclipse = false;
  const luo = siyu.find((s) => s.name === '罗睺');
  const ji = siyu.find((s) => s.name === '计都');
  const ECLIPSE_WINDOW = 12; // độ — eclipse limit cổ (major saros ~11-12°)
  const sunNearLuo = angDist(sun.tropical, luo.tropical) < ECLIPSE_WINDOW;
  const sunNearJi = angDist(sun.tropical, ji.tropical) < ECLIPSE_WINDOW;
  const moonNearLuo = angDist(moon.tropical, luo.tropical) < ECLIPSE_WINDOW;
  const moonNearJi = angDist(moon.tropical, ji.tropical) < ECLIPSE_WINDOW;
  // Cả 2 gần CÙNG nút (罗睺 hoặc 计都) → cửa thực.
  const eclipseLuo = sunNearLuo && moonNearLuo;
  const eclipseJi = sunNearJi && moonNearJi;
  if (eclipseLuo || eclipseJi) {
    eclipse = true;
    score = -100;
    const which = eclipseLuo && eclipseJi ? '罗计' : eclipseLuo ? '罗睺' : '计都';
    hits.push({ tier: 5, zh: '罗计掩日月', vi: `⚠ Cửa nhật/nguyệt thực — Nhật+Nguyệt đều trong 12° ${which} → CẤM (−100)`, d: -100 });
    return { score, hits, eclipse, bodies, siyu, season };
  }

  // 5b. 燃烧 (combustion) — tinh (trừ Nhật) quá gần Nhật <8° → yếu, −2 mỗi tinh.
  for (const b of bodies) {
    if (b.name === '日') continue;
    if (b.distToSun < 8) {
      score -= 2;
      hits.push({ tier: 5, zh: `${b.name}燃烧`, vi: `${b.vi} (${b.name}) ${b.distToSun.toFixed(1)}° từ Nhật → 燃烧 (kị, −2)`, d: -2 });
    }
  }

  return { score: +score.toFixed(2), hits, eclipse: false, bodies, siyu, season };
}

// Lấy chi tháng âm lịch cho 1 Date (UTC) — dùng lunar-javascript.
function monthZhiOf(date) {
  // lunar-javascript dùng giờ local; ta chuyển UTC → Y/m/d近似 (đủ cho chi tháng).
  const s = Solar.fromYmdHms(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), 12, 0, 0);
  return s.getLunar().getMonthZhi();
}

// Định dạng 1 ngày (dương + âm lịch + can-chi trụ ngày).
function formatDay(date) {
  const s = Solar.fromYmdHms(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), 12, 0, 0);
  const l = s.getLunar();
  const gz = l.getDayGan() + l.getDayZhi();
  return {
    solar: `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`,
    lunar: `${l.getMonthInChinese()}月${l.getDayInChinese()}`,
    ganZhi: gz,
  };
}

// ---------------------------------------------------------------------------
//  API CHÍNH: tianxingZheri
//
//  @param {string} sitting      - toạ sơn (1 trong 24, vd '子')
//  @param {number} fromY        - năm DL bắt đầu quét
//  @param {number} fromM        - tháng DL 1..12
//  @param {number} fromD        - ngày DL 1..31
//  @param {number} [days=60]    - số ngày ứng viên
//  @param {object} [opts]       - { mountainSystem: 'huaji'|'zhengti' }
//  @returns {{ sitting, facing, mountainElement, mountainSystem, best, worst, summary }}
// ---------------------------------------------------------------------------
export function tianxingZheri(sitting, fromY, fromM, fromD, days = 60, opts = {}) {
  const mountainSystem = opts.mountainSystem === 'zhengti' ? 'zhengti' : 'huaji';
  const sittingIdx = MOUNTAINS_24.indexOf(sitting);
  if (sittingIdx < 0) throw new Error('Sitting không thuộc 24 sơn: ' + sitting);
  const facing = CHONG[sitting];
  const M = mountainElement(sitting, mountainSystem);
  const Mlabel = M === '太阳' ? '太阳 (đặc biệt)' : M === '太阴' ? '太阴 (đặc biệt)' : M;

  // Tạo `days` ngày ứng viên, trừ đi 0 (từ fromY/fromM/fromD).
  const start = new Date(Date.UTC(fromY, fromM - 1, fromD, 12, 0, 0));
  const ranked = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(start.getTime() + i * 86400000);
    let sc;
    try { sc = scoreDay(date, sitting, mountainSystem); }
    catch (e) { continue; }
    ranked.push({
      date: formatDay(date),
      score: sc.score,
      hits: sc.hits,
      eclipse: sc.eclipse,
      bodies: sc.bodies,
    });
  }

  // Sắp xếp: điểm cao → thấp.
  ranked.sort((a, b) => b.score - a.score);

  const best = ranked.slice(0, 5);
  const worst = ranked.slice(-3).reverse(); // 3 thấp nhất, xấu nhất đầu

  // Summary 1-2 câu.
  const top1 = best[0];
  const worst1 = worst[0];
  const eclipseCount = ranked.filter((r) => r.eclipse).length;
  const summary =
    `天星择日 — toạ ${sitting} (${MOUNTAIN_VI[sitting]}) · hướng ${facing} (${MOUNTAIN_VI[facing]}) · ngũ hành sơn ${Mlabel} (hệ ${mountainSystem === 'zhengti' ? '正体' : '化气'}). ` +
    `Quét ${ranked.length} ngày từ ${fromY}-${fromM}-${fromD}: TỐT NHẤT ${top1 ? `${top1.date.solar} (${top1.date.ganZhi}, ${top1.score})` : '(?)'}` +
    `${worst1 ? ` | KỴ NHẤT ${worst1.date.solar} (${worst1.score})` : ''}` +
    `${eclipseCount ? ` | ⚠ ${eclipseCount} ngày phạm cửa nhật/nguyệt thực (罗计掩日月, cấm).` : ''} ` +
    `Top đầu thường có 太阳/太阴 đến sơn/hướng hoặc tinh Ân/Dụng (sinh sơn) chiếu.`;

  return {
    sitting,
    facing,
    mountainElement: M,
    mountainElementLabel: Mlabel,
    mountainSystem,
    range: { from: `${fromY}-${fromM}-${fromD}`, days: ranked.length },
    best,
    worst,
    summary,
  };
}

// ---------------------------------------------------------------------------
//  UI HELPER: renderTianxingCard — thẻ HTML (reuse .ln-decade, .zr-head như qizheng).
// ---------------------------------------------------------------------------
export function renderTianxingCard(r) {
  const scoreCls = (s) => (s >= 8 ? 'rate-cat' : s <= -3 ? 'rate-hung' : '');
  const hitRow = (h) => {
    const cls = h.d >= 0 ? 'rate-cat' : 'rate-hung';
    return `<div class="ln-flags" style="font-size:11px;color:var(--muted)"><span class="zh">${h.zh}</span> ${h.vi} <span class="lm-rate ${cls}">${h.d >= 0 ? '+' : ''}${h.d}</span></div>`;
  };
  const dayRow = (d, label) => {
    if (!d) return '';
    const cls = scoreCls(d.score);
    const bodiesTxt = (d.bodies || []).slice(0, 7).map((b) => `<span class="zh">${b.name}</span>${b.mountain}`).join(' ');
    return `
      <div class="ln" style="min-width:240px">
        <div class="ln-year">${label} <b>${d.date.solar}</b> <span class="hint-inline">${d.date.lunar} · ${d.date.ganZhi}</span></div>
        <div class="ln-gz">Điểm: <span class="lm-rate ${cls}">${d.score}</span> · ${d.eclipse ? '⚠ CẤM (thực)' : ''}</div>
        <div class="ln-rate" style="font-size:11px">Vị trí: ${bodiesTxt}</div>
        ${d.hits.map(hitRow).join('')}
      </div>`;
  };
  return `
    <div class="zr-head"><b>天星择日</b> · toạ <span class="zh">${r.sitting}</span> ${MOUNTAIN_VI[r.sitting]} · hướng <span class="zh">${r.facing}</span> ${MOUNTAIN_VI[r.facing]} · sơn ${r.mountainElementLabel} (${r.mountainSystem === 'zhengti' ? '正体' : '化气'})</div>
    <p class="hint" style="margin:4px 0">${r.summary}</p>
    <h4 class="syn-h4" style="margin-top:6px">⭐ Top 5 ngày tốt nhất</h4>
    <div class="ln-decade" style="display:flex;flex-wrap:wrap;gap:6px">${r.best.map((d) => dayRow(d, '#')).join('')}</div>
    <h4 class="syn-h4" style="margin-top:8px">⚠ 3 ngày kỵ nhất</h4>
    <div class="ln-decade" style="display:flex;flex-wrap:wrap;gap:6px">${r.worst.map((d) => dayRow(d, '✗')).join('')}</div>
    <p class="hint" style="margin-top:6px">注: 24 sơn 到山/到向 dùng kinh độ TROPICAL (neo 冬至→子 @270°, hệ 天盘 theo tiết khí); 28 túc (display) dùng SIDEREAL (qizheng cycle 37). Tier 1: 太阳到向+5/到山+3, 太阴到山+4/到向+2, 金水辅日月+2. Tier 2 恩用仇难 (×đến=1.0/tam hợp=0.5). Tier 5: 罗计掩日月 (cửa thực) → −100 cấm; 燃烧 <8° Nhật → −2. ⚠ 月=水 bảo thủ; 化气=1 phái (易先生/赖布衣) — có toggle 正体.</p>`;
}

// Export constants cho selftest/external.
export { MOUNTAINS_24, MOUNTAIN_VI, CHONG, PLANET_WX, HUAQI_WX, ZHENGTI_WX };
