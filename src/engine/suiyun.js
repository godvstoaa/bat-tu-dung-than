// ============================================================================
//  TUẾ VẬN TỊNH LÂM 岁运并临 — LƯU NIÊN × ĐẠI VẬN TƯƠNG TÁC
//  Khi lưu niên và đại vận cùng ganZhi/can/chi → hiệu ứng KHUẾCH ĐẠI.
//  Cổ ngữ: "岁运并临, 不死自己死他人" — năm tuế vận tịnh lâm rất trọng.
//  Nguồn: 滴天髓, 三命通会 岁运论.
// ============================================================================
import { GAN, ZHI } from './constants.js';
import { tenGod } from './core.js';

const GAN_HE_MAP = { 甲:'己', 己:'甲', 乙:'庚', 庚:'乙', 丙:'辛', 辛:'丙', 丁:'壬', 壬:'丁', 戊:'癸', 癸:'戊' };
const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };

/**
 * Kiểm tương tác lưu niên × đại vận đang hành cho 1 năm.
 * @returns {{ year, dayunGanZhi, liunianGanZhi, type, severity, note }}
 */
export function suiyunCheck(dayunGanZhi, liunianYear, liunianGanZhi) {
  const dyGan = dayunGanZhi[0], dyZhi = dayunGanZhi[1];
  const lnGan = liunianGanZhi[0], lnZhi = liunianGanZhi[1];
  const events = [];
  let severity = 0;
  let isBinglin = false; // [loop 61] track 并临 separately from severity

  // 1. 岁运并临 (cùng ganZhi)
  if (dayunGanZhi === liunianGanZhi) {
    isBinglin = true;
    events.push('⚡ 岁运并临 — lưu niên TRÙNG đại vận (cùng ganZhi): hiệu ứng NHÂN ĐÔI. Cổ ngữ "不死自己死他人" — năm CỰC TRỌNG, mọi thứ amplified.');
    severity += 3;
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
 * @returns {{ activeDayun, specialYears:[{year, ...suiyunCheck}] }}
 */
export function scanSuiyun(chart, dayun, liunianList, currentAge) {
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
  const activeDy = dayun?.find((d) => age >= d.startAge && age < d.startAge + 10) || dayun?.[0];
  if (!activeDy) return { activeDayun: null, specialYears: [] };

  const dyGanZhi = activeDy.ganZhi;
  const specialYears = [];

  for (const ln of (liunianList || [])) {
    const result = suiyunCheck(dyGanZhi, ln.year, ln.ganZhi);
    if (result) specialYears.push(result);
  }

  return {
    activeDayun: { ganZhi: dyGanZhi, from: activeDy.startAge, to: activeDy.startAge + 9 },
    specialYears: specialYears.sort((a, b) => b.severity - a.severity),
  };
}
