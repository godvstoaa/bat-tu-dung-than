// ============================================================================
//  禽星 — 年禽 ANNUAL ROTATION (演禽通纂 / 禽星易见 / 禽遁大全 起例)
//  "Năm nay con vật tinh nào trụ trị? Có hợp bản mệnh禽 của tôi không?"
//  * Bổ sung cho yanqin.js (本命禽 = birth bird). yanqin tính禽 theo NGÀY SINH.
//    Module này tính 禽 THEO NĂM (年禽) + so khớp với 本命禽 → feng shui timing.
//
//  * [cycle-49 correctness fix] CANONICAL 演禽 年禽起例 (KHÔNG phải công thức bịa):
//    Năm禽 = 28 tú xoay thuận, mỗi năm tiến 1 tú, neo tại **1984 甲子年 = 虚日鼠**.
//    Công thức: idx = (index(虚) + (year - 1984)) mod 28, với index(虚)=10 trong
//    QIN_ORDER (Đông→Bắc→Tây→Nam). Công thức cũ `((year-1) % 28)` là sai hẳn
//    (khớp 0 anchor, cho 2026=女 thay vì chuẩn =星).
//
//  * HIỆU CHUẨN 6 mốc độc lập (đều pass):
//      1918=角, 1919=亢, 1924 甲子=箕  [中华预测网 zhycw.com]
//      1984 甲子=虚                    [zhycw.com "1984年下元甲子虚宿值年"]
//      2021 辛丑=觜火猴, 2022 壬寅=参水猿  [知乎演禽排盘 worked example]
//    → 2024=鬼金羊, 2026=星日马, 2027=张月鹿 ...
//
//  * GHI CHÚ phương pháp: 七元 anchors (虚/奎/毕/鬼/翼/氐/箕) là khởi算 của 日禽
//    (chu kỳ 60 ngày / 7元 = 420 ngày). 年禽 dùng hệ đơn giản hơn: 1 tú/năm xoay thuận,
//    neo 甲子=虚. Đây là hệ "年禽起例" phổ biến trong 演禽通纂 / 禽星易见, khác với
//    một số phái dùng "七元禽星 196-năm" cho phép chính xác đến tháng/ngày (月禽/日禽).
//    Module này chỉ tính NĂM禽 (sufficient cho feng-shui timing theo năm).
//
//  Nguồn: 演禽通纂(四库全书本), 禽星易见(ctext), 新刊禽遁大全(Wikimedia),
//         中华预测网 演禽七元四将二十八宿禽星起诀, 知乎 演禽 中国古代术数.
// ============================================================================
import { QIN_28, YAO_WX } from './yanqin.js';
import { analyzeYanQin } from './yanqin.js';

// 28禽 theo thứ tự canonical (Đông→Bắc→Tây→Nam), khớp QIN_28 trong yanqin.js
export const QIN_ORDER = [
  '角', '亢', '氐', '房', '心', '尾', '箕',           // Đông - Thanh Long (7)
  '斗', '牛', '女', '虚', '危', '室', '壁',           // Bắc - Huyền Vũ (7)
  '奎', '娄', '胃', '昴', '毕', '觜', '参',           // Tây - Bạch Hổ (7)
  '井', '鬼', '柳', '星', '张', '翼', '轸',           // Nam - Chu Tước (7)
];

// CANONICAL ANCHOR (演禽 年禽起例): 1984 甲子年 = 虚日鼠.
// Bằng chứng: 中华预测网 zhycw.com "1984年下元甲子虚宿值年" + ngược tính từ
// 2 mốc知乎 worked-example 2021=觜 / 2022=参 đều cho ra 1984=虚 (xem selftest).
export const QINXING_ANCHOR_YEAR = 1984;
export const QINXING_ANCHOR_TU = '虚'; // index 10 trong QIN_ORDER (Bắc Huyền Vũ)
const ANCHOR_IDX = QIN_ORDER.indexOf(QINXING_ANCHOR_TU);

// Ngũ hành sinh/khắc (đồng bộ yanqin.js)
const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const KE = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };

// Đánh giá tone theo ngũ hành 禽 (cát nếu sinh/trùng bản mệnh, hung nếu khắc)
function relBetween(annualWx, benMingWx) {
  if (annualWx === benMingWx) return { rel: 'tong', vi: 'đồng hành (Tỷ) — cùng tần, thuận', tone: 'cat' };
  if (SHENG[annualWx] === benMingWx) return { rel: 'sheng', vi: 'NĂM HÀM SINH bản mệnh (Ấn) — được nâng đỡ, cát', tone: 'cat' };
  if (SHENG[benMingWx] === annualWx) return { rel: 'xie', vi: 'bản mệnh sinh NĂM HÀM (Thực) — hao nhẹ, chủ động được', tone: 'mid' };
  if (KE[annualWx] === benMingWx) return { rel: 'ke', vi: 'NĂM HÀM KHẮC bản mệnh (Quan) — áp lực, cẩn trọng', tone: 'hung' };
  if (KE[benMingWx] === annualWx) return { rel: 'cai', vi: 'bản mệnh khắc NĂM HÀM (Tài) — nắm chủ động, có lời nhưng mệt', tone: 'mid' };
  return { rel: '?', vi: 'trung tính', tone: 'mid' };
}

/**
 * Tra 禽 trụ trị của 1 năm dương lịch (年禽).
 * @param {number} year — năm dương lịch (vd 2026)
 * @returns {{ bird, vi, animal, wx, element, meaning, compatible, avoid }}
 */
export function qinxingYear(year) {
  // [cycle-49 fix] Canonical 演禽 年禽起例: 28 tú xoay thuận, neo 1984 甲子 = 虚.
  // Công thức cũ ((year-1)%28) là bịa, không khớp bất kỳ mốc chuẩn nào.
  const idx = ((ANCHOR_IDX + (year - QINXING_ANCHOR_YEAR)) % 28 + 28) % 28; // 0-27, an toàn cho năm âm
  const tu = QIN_ORDER[idx];
  const info = QIN_28[tu];
  const bird = info.qin;
  const wx = YAO_WX[info.wx] || info.wx;
  // elementVietnamese
  const elementVi = { 木: 'Mộc', 火: 'Hoả', 土: 'Thổ', 金: 'Kim', 水: 'Thuỷ' }[wx] || wx;
  //禽 cùng hành = đồng khí (hợp); hành sinh/khắc định quan hệ
  const compatible = Object.keys(SHENG).filter((k) => SHENG[k] === wx || k === wx); // ai được nó sinh + đồng hành
  const avoid = Object.keys(KE).filter((k) => KE[k] === wx); // ai bị nó khắc (khắc = kẻ nó trị)
  const compatibleVi = compatible.map((w) => ({ 木: 'Mộc', 火: 'Hoả', 土: 'Thổ', 金: 'Kim', 水: 'Thuỷ' }[w]));
  const avoidVi = avoid.map((w) => ({ 木: 'Mộc', 火: 'Hoả', 土: 'Thổ', 金: 'Kim', 水: 'Thuỷ' }[w]));

  const meaning = `Năm ${year}: 禽 trụ trị = ${bird} (${info.animal}, hành ${elementVi}). ` +
    `Tính cách chủ đạo năm: ${info.nature}. ` +
    `Ngũ hành ${elementVi} là "khí" của năm — ` +
    `người có bản mệnh HÀM hành ${compatibleVi.join('/')} (được sinh/trùng) THUẬN lợi; ` +
    `hành ${avoidVi.join('/')} (bị khắc) cần cẩn trọng, hoà giải bằng hành hoá giải.`;

  return {
    year,
    index: idx,
    tu,
    bird,
    vi: info.vi,
    animal: info.animal,
    wx,
    element: elementVi,
    meaning,
    compatible: compatibleVi,
    avoid: avoidVi,
    nature: info.nature,
  };
}

/**
 * So khớp 禽 NĂM (annual) vs BẢN MỆNH HÀM (birth bird) của user.
 * @param {object} R — kết quả analyze() (cần R.chart.input để tính bản mệnh禽)
 * @param {number} [scanYear] — năm cần xem (mặc định = năm hiện tại)
 */
export function qinxingOverview(R, scanYear) {
  if (!scanYear) scanYear = new Date().getFullYear();
  const ann = qinxingYear(scanYear);
  let bm = null;
  let rel = { rel: '?', vi: 'không xác định bản mệnh禽', tone: 'mid' };
  try {
    const yq = analyzeYanQin(R);
    bm = yq.benMing;
    rel = relBetween(ann.wx, bm.wx);
  } catch (e) {
    bm = null;
  }

  const toneVi = rel.tone === 'cat' ? 'CÁT' : rel.tone === 'hung' ? 'HUNG' : 'TRUNG BÌNH';
  const advice = rel.tone === 'cat'
    ? `Năm ${scanYear} thuận bản mệnh禽 — nên tiến hành việc lớn (khai trương, ký kết, đầu tư) theo đúng thế mạnh của ${ann.bird}.`
    : rel.tone === 'hung'
      ? `Năm ${scanYear}禽 khắc bản mệnh — hoà giải bằng hành sinh bản mệnh (vd bản mệnh ${bm ? bm.wx : '?'} cần hành ${SHENG[bm ? bm.wx : '木']||'?'} để giải), tránh rủi ro lớn.`
      : `Năm ${scanYear} trung bình — làm việc theo kế hoạch, không quá thận trọng cũng không mạo hiểm.`;

  const summary = bm
    ? `Năm ${scanYear}: 禽 trụ trị = ${ann.bird} (hành ${ann.element}). Bản mệnh ${bm.qin} (hành ${YAO_WX[bm.wx]||bm.wx}). Quan hệ: ${rel.vi} → ${toneVi}. ${advice}`
    : `Năm ${scanYear}: 禽 trụ trị = ${ann.bird} (hành ${ann.element}). (Không xác định được bản mệnh禽 để so khớp.)`;

  return {
    scanYear,
    annual: ann,
    benMing: bm,
    rel: rel.rel,
    relVi: rel.vi,
    tone: rel.tone,
    toneVi,
    advice,
    summary,
  };
}

// 28-year cycle preview (N năm xung quanh năm trung tâm, N lẻ → chính giữa)
export function qinxingCycle(centerYear, span = 5) {
  const out = [];
  const half = Math.floor(span / 2);
  for (let i = -half; i <= half; i++) {
    const y = centerYear + i;
    const q = qinxingYear(y);
    out.push({ year: y, bird: q.bird, vi: q.vi, element: q.element, wx: q.wx });
  }
  return out;
}

