// ============================================================================
//  TUẾ VẬN TỊNH LÂM 岁运并临 — LƯU NIÊN × ĐẠI VẬN TƯƠNG TÁC
//  Khi lưu niên và đại vận cùng ganZhi/can/chi → hiệu ứng KHUẾCH ĐẠI (lực nhân đôi).
//  [loop 1382] Cổ ngữ «岁运并临, 不死自己死他人» BỊ HIỆN ĐẠI PHẢN BÁC (ghép nhầm từ
//    đoạn 羊刃 trong《三命通会»; 李双林/德清 v.v.): nếu trùng = DỤNG → CÁT mạnh;
//    = KỴ → HUNG mạnh. KHÔNG dùng để dọa user. Hướng CÁT/HUNG do Dụng thần quyết định.
//  Nguồn: 滴天髓, 三命通会 岁运论 + bingLinInfo (single source of truth cho framing).
// ============================================================================
import { GAN, ZHI } from './constants.js';
import { tenGod } from './core.js';
import { getActiveDayun } from './dayun-active.js';

const GAN_HE_MAP = { 甲:'己', 己:'甲', 乙:'庚', 庚:'乙', 丙:'辛', 辛:'丙', 丁:'壬', 壬:'丁', 戊:'癸', 癸:'戊' };
const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };

/**
 * [loop 1382] Source-of-truth cho framing 岁运并临 (tuế vận tịnh lâm).
 *   Đồng bộ cách trình bày giữa suiyunCheck / scanSuiyun / tang-analyze / liunian-pro.
 *   Nguyên lý: lực LUÔN nhân đôi (magnitude cứng), HƯỚNG CÁT/HUNG do Dụng thần (sign).
 *   «不死自己死他人» chỉ là khẩu quyết bị tuyệt đối hoá — KHÔNG dùng dọa.
 * @param {string} dayunGanZhi
 * @param {string} liunianGanZhi
 * @param {object} [yong] — R.yong {primary,xi,ji,chou} (wx). Có → tính sign chính xác.
 * @returns {{ binglin:boolean, sign:(-1|0|1), note:string }}
 */
export function bingLinInfo(dayunGanZhi, liunianGanZhi, yong) {
  if (!dayunGanZhi || !liunianGanZhi || dayunGanZhi !== liunianGanZhi) return { binglin: false, sign: 0, note: '' };
  const lnGan = liunianGanZhi[0];
  const lnWx = GAN[lnGan] ? GAN[lnGan].wx : null;
  let sign = 0;
  if (yong && lnWx) {
    const dung = new Set([yong.primary, yong.xi].filter(Boolean));
    const ji = new Set([yong.ji, yong.chou].filter(Boolean));
    sign = dung.has(lnWx) ? 1 : ji.has(lnWx) ? -1 : 0;
  }
  const dir = sign > 0
    ? '★ DỤNG → CÁT MẠNH (lực nhân đôi theo chiều thuận)'
    : sign < 0
      ? '⚠ KỴ → HUNG MẠNH (lực nhân đôi theo chiều nghịch)'
      : 'lực NHÂN ĐÔI — hướng CÁT/HUNG tuỳ Dụng thần';
  return {
    binglin: true,
    sign,
    note: `⚡ 岁运并临 — lưu niên TRÙNG đại vận (cùng ${liunianGanZhi}): ${dir}. Cổ ngữ «不死自己死他人» bị hiện đại phản bác (ghép nhầm đoạn 羊刃《三命通会»); KHÔNG dùng để dọa.`,
  };
}

/**
 * Kiểm tương tác lưu niên × đại vận đang hành cho 1 năm.
 * @param {object} [yong] — R.yong (tuỳ chọn) để tính hướng Dụng/Kỵ cho 岁运并临.
 * @returns {{ year, dayunGanZhi, liunianGanZhi, type, severity, note }}
 */
export function suiyunCheck(dayunGanZhi, liunianYear, liunianGanZhi, yong) {
  const dyGan = dayunGanZhi[0], dyZhi = dayunGanZhi[1];
  const lnGan = liunianGanZhi[0], lnZhi = liunianGanZhi[1];
  const events = [];
  let severity = 0;
  let isBinglin = false; // [loop 61] track 并临 separately from severity

  // 1. 岁运并临 (cùng ganZhi) — framing qua bingLinInfo [loop 1382]: Dụng/Kỵ nuance, không dọa.
  const _bl = bingLinInfo(dayunGanZhi, liunianGanZhi, yong);
  if (_bl.binglin) {
    isBinglin = true;
    events.push(_bl.note);
    severity += 3; // magnitude vẫn nhân đôi (cứng) — chỉ hướng là tuỳ Dụng
  }
  // 2. 同气 (cùng can)
  else if (dyGan === lnGan) {
    events.push(`同气 — lưu niên can ${lnGan} trùng đại vận can ${dyGan}: chủ đề thập thần NHÂN ĐÔI trong năm này.`);
    severity += 1;
  }
  // 3. 同基 (cùng chi)
  if (dyZhi === lnZhi && dayunGanZhi !== liunianGanZhi) {
    events.push(`同基 — lưu niên chi ${lnZhi} trùng đại vận chi ${dyZhi}: cùng cung/palace được kích hoạt mạnh.`);
    severity += 1;
  }
  // 4. Can hợp (lưu niên hợp đại vận → hóa)
  if (GAN_HE_MAP[lnGan] === dyGan || GAN_HE_MAP[dyGan] === lnGan) {
    events.push(`🔄 Lưu niên can ${lnGan} HỢP đại vận can ${dyGan}: năm có sự chuyển hóa/đổi hướng trong đại vận.`);
    severity += 1;
  }
  // 5. Chi xung (lưu niên xung đại vận → biến động)
  if (CHONG[lnZhi] === dyZhi) {
    events.push(`⚡ Lưu niên chi ${lnZhi} XUNG đại vận chi ${dyZhi}: BIẾN ĐỘNG lớn trong thập niên — cẩn thận.`);
    severity += 2;
  }
  // 6. Chi 合 (lưu niên hợp đại vận chi → ổn định/hòa hợp)
  const ZHI_LIUHE = ['子丑','寅亥','卯戌','辰酉','巳申','午未'];
  if (ZHI_LIUHE.some((p) => (p === lnZhi+dyZhi) || (p === dyZhi+lnZhi))) {
    events.push(`🤝 Lưu niên chi ${lnZhi} HỢP đại vận chi ${dyZhi}: hòa hợp, ổn định trong năm.`);
    severity += 0;
  }

  if (!events.length) return null;

  return {
    year: liunianYear,
    dayunGanZhi, liunianGanZhi,
    type: isBinglin ? '并临' : severity >= 2 ? 'tương tác mạnh' : 'tương tác nhẹ',
    severity, events,
    note: events.join(' '),
  };
}

/**
 * Quét tất cả lưu niên trong đại vận đang hành → tìm các năm có tương tác.
 * @param {object} [yong] — R.yong (tuỳ chọn) để 岁运并临 có hướng Dụng/Kỵ chính xác.
 * @returns {{ activeDayun, specialYears:[{year, ...suiyunCheck}] }}
 */
export function scanSuiyun(chart, dayun, liunianList, currentAge, yong) {
  // Tìm đại vận đang hành — currentAge phải là tuổi THẬT của mệnh chủ,
  // không phải age của phần tử đầu liunianList (list có thể bắt đầu ở thập niên khác).
  // Ưu tiên currentAge truyền vào; nếu thiếu, tính từ năm sinh gốc của lá số.
  let age;
  if (typeof currentAge === 'number' && Number.isFinite(currentAge)) {
    age = currentAge;
  } else if (chart?.input?.year) {
    age = new Date().getFullYear() - chart.input.year;
  } else {
    // fallback cuối cùng (không đáng tin — chỉ dùng nếu không có gì khác)
    age = (liunianList?.[0]?.age) || 0;
  }
  const _yr = (chart && chart.input && chart.input.year ? chart.input.year : 0) + age;
  const activeDy = getActiveDayun({ dayun }, _yr) || dayun?.[0] || null;
  if (!activeDy) return { activeDayun: null, specialYears: [] };

  const dyGanZhi = activeDy.ganZhi;
  const specialYears = [];

  for (const ln of (liunianList || [])) {
    const result = suiyunCheck(dyGanZhi, ln.year, ln.ganZhi, yong);
    if (result) specialYears.push(result);
  }

  return {
    activeDayun: { ganZhi: dyGanZhi, from: activeDy.startAge, to: activeDy.startAge + 9 },
    specialYears: specialYears.sort((a, b) => b.severity - a.severity),
  };
}
