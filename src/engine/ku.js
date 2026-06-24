// ============================================================================
//  开库闭库冲库 — KHỞ MỞ / KHỞA / XUNG KHỔ (dynamic của 四墓库 辰戌丑未)
//  "Tài nguyên Dụng/Hỷ/Tài của tôi có bị KHÓA trong kho không? Bao giờ mở?"
//  * 四墓库: 辰=Thủy khố | 戌=Hỏa khố | 丑=Kim khố | 未=Mộc khố (đều bản khí Thổ).
//  * Mỗi khố CHỨA 1 hành; hành đó bị cất → tiềm tàng, chỉ "phát" khi khở MỞ.
//  * 3 trạng thái:
//    - 开库 (MỞ): khố gặp XUNG đối (辰↔戌, 丑↔未) → hành chứa ĐỔ RA, phát lực mạnh.
//    - 闭库 (KHÓA): không xung → hành chứa nằm im, tiềm tàng khó dùng.
//    - 合闭 (KHÓA bởi hợp): khố gặp LỤC HỢP (辰酉/戌卯/丑子/未午) → càng khóa chặt.
//  * Khi Dụng/Hỷ/TÀI bị nhốt trong khổ ĐÓNG → có mà không dùng được, đợi LƯU NIÊN
//    mang chi XUNG đối đến mới "mở kho phát tài/phát dụng".
//  Khác caiku.js (tĩnh: chỉ/TRỊ khổ nào có): module này = ĐỘNG (mở/khóa) + THỜI ĐIỂM mở.
//  Nguồn: 三命通会 四墓库, 子平真诠 冲开库, 盲派 开库论.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { WX_VI } from './constants.js';

const KU = {
  辰: { store: '水', storeVi: 'Thủy', pair: '戌', he: '酉' },
  戌: { store: '火', storeVi: 'Hỏa', pair: '辰', he: '卯' },
  丑: { store: '金', storeVi: 'Kim', pair: '未', he: '子' },
  未: { store: '木', storeVi: 'Mộc', pair: '丑', he: '午' },
};
const KU_VI = { 辰: 'Thìn', 戌: 'Tuất', 丑: 'Sửu', 未: 'Mùi' };
const PILLAR_VI = { year: 'Niên', month: 'Nguyệt', day: 'Nhật', time: 'Thời' };

function yearGanZhi(year) {
  const s = Solar.fromYmdHms(year, 6, 15, 12, 0, 0);
  const ec = s.getLunar().getEightChar();
  return ec.getYearGan() + ec.getYearZhi();
}

/**
 * @param {object} R — analyze()
 * @param {number} scanYear
 * @returns {{ kuInChart, locked:[], opened:[], openYears:[], summary }}
 */
export function analyzeKu(R, scanYear) {
  const curYear = scanYear || new Date().getFullYear();
  const order = ['year', 'month', 'day', 'time'];
  const allZhi = order.map((k) => R.chart.pillars[k].zhi);
  const kuInChart = [];
  for (const k of order) {
    const zhi = R.chart.pillars[k].zhi;
    if (KU[zhi]) kuInChart.push({ pillar: k, vi: PILLAR_VI[k], zhi, zhiVi: KU_VI[zhi], ...KU[zhi] });
  }

  // Dụng/Hỷ/财/Quan để gắn nhãn "tài nguyên nào bị khóa"
  const dung = R.yong?.primary, xi = R.yong?.xi;
  const dmWx = R.chart.dayMaster.wx;
  const cai = ({ 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' })[dmWx]; // 财 = khắc ra
  const guan = ({ 木: '金', 火: '水', 土: '木', 金: '火', 水: '土' })[dmWx];
  const labelFor = (wx) => wx === dung ? 'DỤNG' : wx === xi ? 'HỶ' : wx === cai ? 'TÀI' : wx === guan ? 'QUAN' : WX_VI[wx];

  const locked = [], opened = [];
  for (const ku of kuInChart) {
    const chongHit = allZhi.includes(ku.pair);  // có chi xung đối trong lá số → MỞ
    const heHit = allZhi.includes(ku.he);        // có chi lục hợp → KHÓA bởi hợp
    let state, stateVi;
    if (chongHit) { state = 'open'; stateVi = `开库 (xung ${ku.zhiVi}↔${KU_VI[ku.pair]} → hành ${ku.storeVi} ĐỔ RA, phát lực mạnh)`; }
    else if (heHit) { state = 'heClosed'; stateVi = `合闭 (hợp ${ku.zhiVi}+${KU_VI[ku.he]} → khóa chặt, khó mở)`; }
    else { state = 'closed'; stateVi = `闭库 (không xung → hành ${ku.storeVi} tiềm tàng, khó dùng)`; }
    ku.chongHit = chongHit; ku.heHit = heHit; ku.state = state; ku.stateShort = stateVi.split(' (')[0]; ku.stateVi = stateVi;
    ku.storeLabel = labelFor(ku.store);
    if (state === 'open') opened.push(ku); else locked.push(ku);
  }

  // 流年 mở khổ: với mỗi khổ ĐÓNG, tìm năm mang chi xung đối tới (next 12 năm)
  const openYears = [];
  const closedYears = [];
  for (let y = curYear; y <= curYear + 12; y++) {
    const gz = yearGanZhi(y);
    const yz = gz[1];
    for (const ku of locked) {
      if (yz === ku.pair) openYears.push({ year: y, ganZhi: gz, zhiVi: ku.zhiVi, storeVi: ku.storeVi, storeLabel: ku.storeLabel, action: `xung mở ${ku.zhiVi}(${ku.storeVi}/${ku.storeLabel})` });
      if (yz === ku.zhi) closedYears.push({ year: y, ganZhi: gz, zhiVi: ku.zhiVi, storeVi: ku.storeVi, storeLabel: ku.storeLabel, action: `tự khổ đáo (khổ trì — KHÔNG mở,加重 đóng)` });
    }
  }

  // summary
  const lockedLabels = [...new Set(locked.filter((k) => ['DỤNG', 'HỶ', 'TÀI', 'QUAN'].includes(k.storeLabel)).map((k) => `${k.storeLabel}(${k.storeVi})@${k.zhiVi}`))];
  let summary;
  if (!kuInChart.length) {
    summary = 'Lá số KHÔNG có 四墓库 (Thìn/Tuất/Sửu/Mùi) → không có "kho chứa" → tài nguyên không bị khóa, nhưng cũng khó "tích trữ/kho vận".';
  } else {
    summary = `Có ${kuInChart.length} khổ: ${kuInChart.map((k) => `${k.zhiVi}(${k.storeVi}/${k.storeLabel}, ${k.stateShort})`).join(', ')}. `;
    if (lockedLabels.length) summary += `⚠ Tài nguyên ${lockedLabels.join(', ')} đang BỊ KHÓA trong khổ đóng → có mà khó dùng, đợi LƯU NIÊN mang chi xung đến mới mở. `;
    if (opened.length) summary += `✓ Khổ đã MỞ: ${opened.map((k) => k.zhiVi + '(' + k.storeVi + ')').join(', ')} → phát lực. `;
    if (openYears.length) summary += `Năm mở khổ tới: ${openYears.slice(0, 4).map((o) => `${o.year}(${o.action})`).join(', ')} → cơ hội phát ${[...new Set(openYears.map((o) => o.storeVi + '/' + o.storeLabel))].slice(0, 3).join(', ')}.`;
    else if (locked.length) summary += `(12 năm tới không có chi xung đối → khổ vẫn đóng, cần chủ động tạo "xung" qua phương vị/ngày辰戌/丑未).`;
    if (closedYears.length) summary += ` ⚠ Năm khổ đáo (tự thân khổ về,加重 đóng, KHÔNG mở): ${closedYears.map((c) => c.year).join(', ')}.`;
  }

  return { kuInChart, locked, opened, openYears, closedYears, summary };
}

export { KU, KU_VI };
