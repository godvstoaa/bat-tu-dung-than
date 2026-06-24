// ============================================================================
//  BEST HOUR TODAY 择吉时合成 — "Hôm nay giờ nào tốt nhất cho [việc]?"
//  Composite: chấm điểm 12 时辰 (mỗi 时辰 = 2h) trên 5 chiều rồi xếp hạng.
//
//  5 chiều đánh giá (mỗi chiều đóng góp điểm, có lý do đi kèm):
//    1. 黄道/黑道 giờ       (lucky-hours.js — hoàng/hắc đạo của từng thìn)
//    2. 建除 trực của ngày   (zheri.js/daily.js — trực ngày làm nền)
//    3. Dụng Thần ngũ hành  (can/chi giờ có mang hành Dụng/Hỷ/Kỵ không)
//    4. 紫微流时             (ziwei-liuri.js — cung lưu thời được kích hoạt)
//    5. 流时神煞 quý nhân    (shensha.js — Thiên Ất/Văn Xương có kích hoạt giờ)
//
//  Đầu ra: 12 giờ chấm điểm + best 3 + worst 2 + tóm tắt 1 câu.
//  Tất cả các trạm đều bọc try/catch → lỗi 1 chiều không làm sập cả composite.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI } from './constants.js';
import { luckyHours } from './lucky-hours.js';
import { evaluateDate, OFFICER_VI } from './zheri.js';
import { ziweiLiushi } from './ziwei-liuri.js';
import { TIAN_YI, WEN_CHANG } from './shensha.js';

const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// Giờ đại diện cho mỗi thìn (lấy giữa khoảng) — 子 = 23:00 (thuộc ngày kế)
const REP_HOUR = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
const RANGE_VI = {
  子: '23:00–01:00', 丑: '01:00–03:00', 寅: '03:00–05:00', 卯: '05:00–07:00',
  辰: '07:00–09:00', 巳: '09:00–11:00', 午: '11:00–13:00', 未: '13:00–15:00',
  申: '15:00–17:00', 酉: '17:00–19:00', 戌: '19:00–21:00', 亥: '21:00–23:00',
};
const ZHI_VI = { 子:'Tý', 丑:'Sửu', 寅:'Dần', 卯:'Mão', 辰:'Thìn', 巳:'Tỵ', 午:'Ngọ', 未:'Mùi', 申:'Thân', 酉:'Dậu', 戌:'Tuất', 亥:'Hợi' };

// ---- Trọng số 5 chiều (tổng 100) ----
const W = { huangdao: 28, yong: 24, ziwei: 20, shensha: 16, officer: 12 };

function clampScore(x) { return Math.max(0, Math.min(100, Math.round(x))); }

/**
 * Composite "giờ tốt nhất hôm nay".
 * @param {object} R - reading object (cần R.chart.input, R.yong, R.chart.dayGan)
 * @param {number} year/month/day - ngày dương lịch (mặc định hôm nay)
 * @returns {{
 *   date, dayGanZhi, dayOfficer:{officer,officerVi,tone},
 *   hours: Array<{ zhi, vi, range, ganZhi, score, rating, dim:{huangdao,yong,ziwei,shensha,officer}, reasons:string[] }>,
 *   best: Array, worst: Array,
 *   summary: string
 * }}
 */
export function bestHourToday(R, year, month, day) {
  const _now = new Date();
  const y = year ?? _now.getFullYear();
  const mo = month ?? (_now.getMonth() + 1);
  const d = day ?? _now.getDate();
  const inp = (R?.chart?.input) || R?.input || R;

  // ---- Nền ngày: trực 建除 + tone ngày ----
  let dayOfficer = { officer: '?', officerVi: '?', tone: 'bình', score: 50 };
  try {
    const userZhi = R?.chart?.pillars?.year?.zhi;
    const ev = evaluateDate(y, mo, d, 'sign', userZhi);
    dayOfficer = { officer: ev.officer, officerVi: ev.officerVi, tone: ev.tone, score: ev.score };
  } catch (_) {}

  // ---- 12 giờ 黄道/黑道 + can chi giờ ----
  let lucky = null;
  try { lucky = luckyHours(y, mo, d); } catch (_) {}
  const hoursMap = new Map();
  if (lucky) for (const h of lucky.hours) hoursMap.set(h.zhi, h);

  // ---- Dụng / Hỷ / Kỵ ngũ hành ----
  const yong = R?.yong || {};
  const dung = yong.primary;       // hành Dụng
  const hy = yong.xi;              // hành Hỷ
  const ky = yong.ji;              // hành Kỵ
  const cho = yong.chou;           // hành Thù

  // ---- Nhật can (để xét quý nhân Thiên Ất/Văn Xương theo giờ chi) ----
  const dayGan = R?.chart?.dayGan || (() => { try { return Solar.fromYmdHms(y, mo, d, 12, 0, 0).getLunar().getDayGan(); } catch (_) { return '甲'; } })();
  const tianYiZhis = TIAN_YI[dayGan] || [];
  const wenChangZhi = WEN_CHANG[dayGan];

  // Day gan-zhi (cho hiển thị)
  let dayGanZhi = '?';
  try { const l = Solar.fromYmdHms(y, mo, d, 12, 0, 0).getLunar(); dayGanZhi = l.getDayGan() + l.getDayZhi(); } catch (_) {}

  const hours = [];
  for (let i = 0; i < 12; i++) {
    const zhi = ZHI_ORDER[i];
    const lh = hoursMap.get(zhi) || {};
    const reasons = [];
    const dim = { huangdao: 50, yong: 50, ziwei: 50, shensha: 50, officer: dayOfficer.score };
    let score = 0;

    // === 1. 黄道/黑道 giờ ===
    try {
      const road = lh.road; // 'yellow' | 'black'
      const tone = lh.tone; // 'cat' | 'hung'
      if (road === 'yellow') { dim.huangdao = 82; reasons.push(`黄道${lh.officerVi || ''} (giờ hoàng đạo — thuận)`); }
      else if (road === 'black') { dim.huangdao = 28; reasons.push(`黑道${lh.officerVi || ''} (giờ hắc đạo — kỵ)`); }
      else { dim.huangdao = 50; }
    } catch (_) { dim.huangdao = 50; }

    // === 2. Dụng Thần ngũ hành (can + chi giờ) ===
    try {
      const hGan = lh.gan, hZhi = zhi;
      const ganWx = hGan ? GAN[hGan]?.wx : null;
      const zhiWx = ZHI[zhi]?.wx;
      const hits = [];
      if (ganWx === dung || zhiWx === dung) { hits.push(`Dụng ${WX_VI[dung]}`); }
      if (ganWx === hy || zhiWx === hy) { hits.push(`Hỷ ${WX_VI[hy]}`); }
      const bad = [];
      if (ganWx === ky || zhiWx === ky) { bad.push(`Kỵ ${WX_VI[ky]}`); }
      if (ganWx === cho || zhiWx === cho) { bad.push(`Thù ${WX_VI[cho]}`); }
      let y = 50;
      if (hits.length) { y = 78; reasons.push(hits.join(' + ') + ' (ngũ hành giờ hợp Dụng)'); }
      if (bad.length) { y = 24; reasons.push(bad.join(' + ') + ' (ngũ hành giờ phạm Kỵ)'); }
      dim.yong = y;
    } catch (_) { dim.yong = 50; }

    // === 3. 紫微流时 (cung lưu thời kích hoạt) ===
    try {
      const rep = REP_HOUR[i];
      const ls = ziweiLiushi({ input: inp }, y, mo, d, rep);
      const g = ls.liushiGong;
      if (g.tone === 'cat') { dim.ziwei = 80; reasons.push(`紫微@${g.vi} [Cát] — ${g.meaning}`); }
      else if (g.tone === 'hung') { dim.ziwei = 26; reasons.push(`紫微@${g.vi} [Hung] — ${g.meaning}`); }
      else { dim.ziwei = 50; reasons.push(`紫微@${g.vi} [Bình]`); }
    } catch (_) { dim.ziwei = 50; }

    // === 4. 流时神煞 quý nhân (Thiên Ất / Văn Xương kích hoạt giờ chi) ===
    try {
      const nobles = [];
      if (tianYiZhis.includes(zhi)) nobles.push('天乙贵人');
      if (wenChangZhi === zhi) nobles.push('文昌');
      if (nobles.length) { dim.shensha = 86; reasons.push(nobles.join(' + ') + ' kích hoạt giờ (quý nhân phò)'); }
      else { dim.shensha = 48; }
    } catch (_) { dim.shensha = 50; }

    // === 5. Officer ngày (nền chung, cùng cho mọi giờ) ===
    dim.officer = dayOfficer.score;

    // === Tổng hợp có trọng số ===
    score = W.huangdao * dim.huangdao / 100
          + W.yong * dim.yong / 100
          + W.ziwei * dim.ziwei / 100
          + W.shensha * dim.shensha / 100
          + W.officer * dim.officer / 100;
    score = clampScore(score);

    let rating;
    if (score >= 72) rating = 'Đại cát';
    else if (score >= 60) rating = 'Cát';
    else if (score >= 45) rating = 'Bình';
    else if (score >= 32) rating = 'Hơi kỵ';
    else rating = 'Kỵ';

    hours.push({
      zhi,
      vi: ZHI_VI[zhi],
      range: RANGE_VI[zhi],
      ganZhi: (lh.gan || '?') + zhi,
      score,
      rating,
      dim,
      reasons,
    });
  }

  // ---- Xếp hạng: điểm giảm dần; huỳnhđạo-breaking tie ----
  const sorted = [...hours].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (b.dim.huangdao) - (a.dim.huangdao);
  });
  const best = sorted.slice(0, 3);
  const worst = sorted.slice(-2).reverse(); // xấu nhất trước

  // ---- Tóm tắt 1 câu ----
  const b0 = best[0];
  const w0 = worst[0];
  const bestStr = b0 ? `${ZHI_VI[b0.zhi]} (${b0.range}, ${b0.rating})` : '?';
  const bestWhy = b0 && b0.reasons.length ? b0.reasons.slice(0, 2).join(' + ') : '';
  const worstStr = w0 ? `${ZHI_VI[w0.zhi]} (${w0.range})` : '?';
  const worstWhy = w0 && w0.reasons.length ? w0.reasons.slice(0, 1).join('') : '';
  const summary = `Hôm nay giờ tốt nhất: ${bestStr}${bestWhy ? ' — ' + bestWhy : ''}.${w0 && w0.score < 45 ? ` Tránh: ${worstStr}${worstWhy ? ' (' + worstWhy + ')' : ''}.` : ''}`;

  return {
    date: `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    dayGanZhi,
    dayOfficer,
    weights: W,
    hours,
    best,
    worst,
    summary,
  };
}

export { ZHI_ORDER, RANGE_VI, ZHI_VI, W as BEST_HOUR_WEIGHTS };
