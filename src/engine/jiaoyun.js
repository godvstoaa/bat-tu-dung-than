// ============================================================================
//  大运交运 — GIAO THỜI ĐẠI VẬN (khi nào vận 10 năm đổi + kiêng kỵ)
//  "Vận tôi bao giờ đổi? Ngày đó làm gì/kiêng gì?" — công cụ hành động.
//  Cơ chế: 起运 (bắt đầu大运 1) tính từ ngày sinh → tiết khí gần nhất, 3 ngày = 1 năm.
//    Mỗi大运 = 10 năm. GIAO THỜI = ngày大运 sau tiếp management大运 trước, đúng ngày
//    起运 + i×10 năm, đúng canh giờ 起运. Ngày này quyết định "nhịp" 10 năm tới.
//  * Cổ pháp kiêng giao thời (交运注意): giờ giao phải TĨNH (không cãi/khóc/thấy máu/
//    quyết định lớn), ngồi hướng Dụng Thần, tránh tiếp xúc người tuổi XUNG.
//    Đại vận vào CÁT → chào đón vui; vào HUNG → giữ điệu thấp, né họa.
//  Khác dayun-check (天克地冲 trong 10 năm): module này = ĐIỂM GIAO THỜI chính xác.
//  Nguồn: 三命通会 起运法, 渊海子平 大运交脱, 民俗 交运禁忌.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { WX_VI } from './constants.js';

const HOUR_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ZHI_VI = { 子: 'Tý', 丑: 'Sửu', 寅: 'Dần', 卯: 'Mão', 辰: 'Thìn', 巳: 'Tỵ', 午: 'Ngọ', 未: 'Mùi', 申: 'Thân', 酉: 'Dậu', 戌: 'Tuất', 亥: 'Hợi' };
const CHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
const DUNG_DIR = { 木: 'Đông / Đông Nam', 火: 'Nam', 土: 'Đông Nam / Đông Bắc', 金: 'Tây / Tây Bắc', 水: 'Bắc' };

function hourToZhi(h) { return HOUR_ZHI[Math.floor(((h + 1) % 24) / 2)]; }
function fmt(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; }

/**
 * Tính 起运 date + 8 điểm giao thời (đại vận 1..8).
 */
export function computeJiaoYun(year, month, day, hour, minute, gender) {
  const s = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const ec = s.getLunar().getEightChar();
  const yun = ec.getYun(gender === 'nam' ? 1 : 0);
  const ss = yun.getStartSolar();
  const qiyun = new Date(ss.getYear(), ss.getMonth() - 1, ss.getDay(), ss.getHour(), ss.getMinute());
  const transitions = [];
  for (let i = 0; i < 8; i++) {
    const t = new Date(qiyun);
    t.setFullYear(qiyun.getFullYear() + i * 10);
    transitions.push({ index: i, date: t, zhi: hourToZhi(t.getHours()) });
  }
  return { qiyunDate: qiyun, isForward: yun.isForward(), transitions };
}

/**
 * Phân tích giao thời cho lá số: điểm giao kế tiếp + kiêng kỵ.
 * @param {object} R — analyze()
 * @param {Date} refDate — mốc "hiện tại"
 */
export function jiaoYunAnalysis(R, refDate) {
  const inp = R.chart.input;
  const { qiyunDate, isForward, transitions } = computeJiaoYun(inp.year, inp.month, inp.day, inp.hour, inp.minute, inp.gender);
  const now = refDate && refDate.getTime ? refDate : new Date();
  const dayun = R.dayun || [];
  transitions.forEach((t, i) => {
    const dy = dayun[i];
    if (dy) { t.ganZhi = dy.ganZhi; t.age = dy.startAge; t.rating = dy.rating; }
  });

  const next = transitions.find((t) => t.date.getTime() > now.getTime());
  const prev = [...transitions].reverse().find((t) => t.date.getTime() <= now.getTime());
  const daysUntil = next ? Math.ceil((next.date.getTime() - now.getTime()) / 86400000) : null;

  // kiêng kỵ giao thời
  const dungDir = DUNG_DIR[R.yong?.primary] || 'hướng Dụng Thần';
  const birthZhi = R.chart?.pillars?.year?.zhi;
  const avoidZhiSet = new Set();
  if (next?.ganZhi) avoidZhiSet.add(CHONG[next.ganZhi[1]]);          // xung chi大运 tới
  if (birthZhi) avoidZhiSet.add(CHONG[birthZhi]);                     // xung bản mệnh chi
  const avoidZhi = [...avoidZhiSet];

  let summary;
  if (!next) {
    summary = `Đã qua hết 8 đại vận trong khung. 起运 ${fmt(qiyunDate)}.`;
  } else {
    const tone = next.rating === 'Cát' || next.rating === 'Hơi thuận' ? 'CÁT (chào đón)' : next.rating === 'Hung' ? 'HUNG (giữ thấp, né họa)' : 'bình';
    summary = `GIAO THỜI kế tiếp: ${fmt(next.date)} (giờ ${ZHI_VI[next.zhi] || next.zhi}) — bước sang đại vận ${next.ganZhi} [${next.age}–${next.age + 9}t], ${next.rating} → ${tone}. Còn ${daysUntil} ngày. ` +
      `Kiêng giao thời: giờ ${ZHI_VI[next.zhi]} phải TĨNH (không cãi/khóc/thấy máu/quyết định lớn), ngồi hướng ${dungDir} (Dụng ${WX_VI[R.yong?.primary]}), tránh tiếp xúc người tuổi ${avoidZhi.map((z) => ZHI_VI[z]).join(' / ')} (xung).`;
  }

  return {
    qiyunDate, isForward, transitions,
    current: prev, next, daysUntil, dungDir, avoidZhi,
    summary,
    allTransitions: transitions.map((t) => `${fmt(t.date)} → ${t.ganZhi || '?'}[${t.age ? t.age + '–' + (t.age + 9) + 't' : '?'}${t.rating ? ', ' + t.rating : ''}]`),
  };
}

