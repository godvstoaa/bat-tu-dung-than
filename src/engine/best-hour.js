// ============================================================================
//  BEST HOUR TODAY 择吉时合成 — "Hôm nay giờ nào tốt nhất cho [việc]?"
//  Composite: chấm điểm 12 时辰 (mỗi 时辰 = 2h) trên 5 chiều rồi xếp hạng.
//
//  6 chiều đánh giá (mỗi chiều đóng góp điểm, có lý do đi kèm):
//    1. 黄道/黑道 giờ       (lucky-hours.js — hoàng/hắc đạo của từng thìn)
//    2. 建除 trực của ngày   (zheri.js/daily.js — trực ngày làm nền)
//    3. Dụng Thần ngũ hành  (can/chi giờ có mang hành Dụng/Hỷ/Kỵ không)
//    4. 紫微流时             (ziwei-liuri.js — cung lưu thời được kích hoạt)
//    5. 流时神煞 quý nhân    (shensha.js — Thiên Ất/Văn Xương có kích hoạt giờ)
//    6. 格局喜忌             (pattern-quality.js — thập thần giờ vs patternYong.xi/ji)
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
import { tenGod, godGroup } from './core.js';
import { ZHI_CHONG_MAP, ZHI_LIUHE_MAP } from './interactions.js';

const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// Giờ đại diện cho mỗi thìn (lấy giữa khoảng) — 子 = 23:00 (thuộc ngày kế)
const REP_HOUR = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
const RANGE_VI = {
  子: '23:00–01:00', 丑: '01:00–03:00', 寅: '03:00–05:00', 卯: '05:00–07:00',
  辰: '07:00–09:00', 巳: '09:00–11:00', 午: '11:00–13:00', 未: '13:00–15:00',
  申: '15:00–17:00', 酉: '17:00–19:00', 戌: '19:00–21:00', 亥: '21:00–23:00',
};
const ZHI_VI = { 子:'Tý', 丑:'Sửu', 寅:'Dần', 卯:'Mão', 辰:'Thìn', 巳:'Tỵ', 午:'Ngọ', 未:'Mùi', 申:'Thân', 酉:'Dậu', 戌:'Tuất', 亥:'Hợi' };

// ---- Trọng số 6 chiều (tổng 100) ----
//  Phân bổ lại khi thêm 格局 (chiều 6): mỗi chiều cũ nhường ~2%.
//  Khi KHÔNG có patternYong → trả trọng số 格局 về huangdao (giữ tổng 100).
const W = { huangdao: 26, yong: 22, ziwei: 18, shensha: 14, officer: 12, geju: 8 };

// Nhãn Việt của 5 nhóm thập thần (cho lý do hiển thị).
const GROUP_VI = { ti: 'Tỷ Kiếp', yin: 'Ấn', shi: 'Thực Thương', cai: 'Tài', guan: 'Quan Sát' };

function clampScore(x) { return Math.max(0, Math.min(100, Math.round(x))); }

/**
 * Composite "giờ tốt nhất hôm nay".
 * @param {object} R - reading object (cần R.chart.input, R.yong, R.chart.dayGan)
 * @param {number} year/month/day - ngày dương lịch (mặc định hôm nay)
 * @param {object} [patternYong] - TÙY CHỌN: patternYong.xi/ji (từ patternQuality).
 *   Khi có → bật chiều 6 (格局喜忌). Khi không/v_null → bỏ qua chiều 6 (backward compatible).
 * @returns {{
 *   date, dayGanZhi, dayOfficer:{officer,officerVi,tone},
 *   hours: Array<{ zhi, vi, range, ganZhi, score, rating,
 *     dim:{huangdao,yong,ziwei,shensha,officer,geju?},
 *     gejuScore?, gejuReason?, reasons:string[] }>,
 *   best: Array, worst: Array,
 *   summary: string, gejuEnabled: boolean
 * }}
 */
export function bestHourToday(R, year, month, day, patternYong) {
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

  // ---- Nhật can: PHÂN BIỆT SINH (cho 格局) vs CAN NGÀY (cho thần煞 quý nhân) ----
  // [loop 81 sửa bug] 天乙/文昌 quý nhân GIỜ theo CAN NGÀY đang xem («甲戊庚牛羊...» —
  //   quý nhân ở giờ = hàm số CAN NGÀY, đổi mỗi ngày). Trước đây dùng R.chart.dayGan
  //   (Nhật Chủ sinh) → quý nhân giờ CỐ ĐỊNH 2 giờ/yếu cho mỗi user (sai — phải đổi daily).
  //   Riêng 格局喜忌 (line ~177) dùng birthDayGan (Nhật Chủ) là ĐÚNG (patternYong của user).
  const birthDayGan = R?.chart?.dayGan || '甲';
  const evalDayGan = (() => { try { return Solar.fromYmdHms(y, mo, d, 12, 0, 0).getLunar().getDayGan(); } catch (_) { return birthDayGan; } })();
  const tianYiZhis = TIAN_YI[evalDayGan] || [];
  const wenChangZhi = WEN_CHANG[evalDayGan];

  // ---- Chiều 6: 格局喜忌 (TÙY CHỌN — chỉ bật khi truyền patternYong hợp lệ) ----
  //  patternYong.xi/ji là mảng {group, wx, vi} (ti/yin/shi/cai/guan).
  //  Mỗi giờ: lấy thập thần của GIỜ CAN (tenGod(dayGan, hourGan)) → godGroup → so xi/ji.
  //  Thang điểm: 格局喜 giờ = +5 (cột điểm 0..100 ánh xạ: 95/50/5), 格局忌 = −5, trung tính 0.
  //  Ánh xạ sang dim.geju (0..100 để nhất quán với 5 chiều kia):
  //    格局喜 → dim.geju = 95, 格局忌 → dim.geju = 5, trung tính → 50.
  const gejuEnabled = !!patternYong && Array.isArray(patternYong.xi) && Array.isArray(patternYong.ji);
  const xiGroups = gejuEnabled ? new Set(patternYong.xi.map((x) => x.group)) : null;
  const jiGroups = gejuEnabled ? new Set(patternYong.ji.map((x) => x.group)) : null;
  // Trọng số thực tế: nếu tắt geju → dồn 8% sang huangdao để tổng vẫn 100.
  const Weff = gejuEnabled
    ? W
    : { huangdao: W.huangdao + W.geju, yong: W.yong, ziwei: W.ziwei, shensha: W.shensha, officer: W.officer };

  // Day gan-zhi (cho hiển thị)
  let dayGanZhi = '?';
  try { const l = Solar.fromYmdHms(y, mo, d, 12, 0, 0).getLunar(); dayGanZhi = l.getDayGan() + l.getDayZhi(); } catch (_) {}

  const hours = [];
  for (let i = 0; i < 12; i++) {
    const zhi = ZHI_ORDER[i];
    const lh = hoursMap.get(zhi) || {};
    const reasons = [];
    const dim = { huangdao: 50, yong: 50, ziwei: 50, shensha: 50, officer: dayOfficer.score, geju: 50 };
    let gejuScore = 0;       // điểm thô chiều 格局 (+5 / −5 / 0)
    let gejuReason = '';     // lý do ngắn cho hiển thị
    let score = 0;

    // === 1. 黄道/黑道 giờ ===
    try {
      const road = lh.road; // 'yellow' | 'black'
      const tone = lh.tone; // 'cat' | 'hung'
      // [loop 554 FIX] label 黄道/黑道 phải dùng DEITY (青龙/明堂...) không phải OFFICER (建除 trực).
      //   Trước đây「黄道Phá」hiểu nhầm trực Phá(hung) là thần hoàng đạo.
      if (road === 'yellow') { dim.huangdao = 82; reasons.push(`黄道${lh.deityVi || ''} (giờ hoàng đạo — thuận)${lh.officerVi ? ' · trực ' + lh.officerVi : ''}`); }
      else if (road === 'black') { dim.huangdao = 28; reasons.push(`黑道${lh.deityVi || ''} (giờ hắc đạo — kỵ)${lh.officerVi ? ' · trực ' + lh.officerVi : ''}`); }
      else { dim.huangdao = 50; }
    } catch (_) { dim.huangdao = 50; }

    // [loop 554 FIX BUG3] 日破时 — giờ chi xung chi NGÀY → đại hung, kỵ khởi sự.
    //   Trước đây thiếu chiều này → giờ xung chi ngày có thể lọt top best (vd 巳日 giờ亥).
    try {
      const dayZhi = dayGanZhi[1];
      if (dayZhi && ZHI_CHONG_MAP[dayZhi] === zhi) {
        dim.huangdao = Math.min(dim.huangdao, 15);
        reasons.push(`⚡ 日破时: giờ ${WX_VI[ZHI[zhi]?.wx] || zhi}(${zhi}) xung chi ngày ${dayZhi} — đại hung, kỵ khởi sự/ký/cưới.`);
      }
      // [loop 1005] 时合日 — giờ chi LỤC HỢP chi ngày → CÁT (đối xứng 日破时).
      //   Cổ法 «时合日柱为吉» — giờ hợp chi ngày → thuận hoà, sự việc hanh thông.
      else if (dayZhi && ZHI_LIUHE_MAP[dayZhi + zhi]) {
        dim.huangdao = Math.max(dim.huangdao, 78);
        reasons.push(`💕 时合日: giờ ${zhi} LỤC HỢP chi ngày ${dayZhi} (hóa ${WX_VI[ZHI_LIUHE_MAP[dayZhi + zhi]]}) → thuận hoà, hanh thông.`);
      }
    } catch (_) {}

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

    // === 6. 格局喜忌 (thập thần của GIỜ CAN vs patternYong.xi/ji — 子平真詮 ch.10-11) ===
    //  Nguyên lý cổ pháp: "行运之阴阳有别，取用之喜忌相同" — cùng luật 喜忌 đặc trưng
    //  của cách áp dụng cho 大运/Lưu niên CŨNG áp dụng cho LƯU THỜI: một giờ có thập thần
    //  "sinh trợ Dụng/相" = 格局喜 (giờ giúp cách cục phát huy), thập thần "khắc phá Dụng"
    //  = 格局忌 (giờ làm cách cục tổn thương). Dùng thập thần của GIỜ CAN (chính khí giờ).
    if (gejuEnabled) {
      try {
        const hGan = lh.gan;
        if (hGan && hGan !== '?') {
          const god = tenGod(birthDayGan, hGan);          // [loop 81] thập thần của giờ can vs Nhật Chủ SINH (cách của user)
          const grp = godGroup(god);                 // nhóm (ti/yin/shi/cai/guan)
          if (grp && xiGroups.has(grp)) {
            dim.geju = 95; gejuScore = +5;
            gejuReason = `格局喜: giờ ${hGan} (${god}/${GROUP_VI[grp]}) sinh trợ格 (+5)`;
            reasons.push(gejuReason);
          } else if (grp && jiGroups.has(grp)) {
            dim.geju = 5; gejuScore = -5;
            gejuReason = `格局忌: giờ ${hGan} (${god}/${GROUP_VI[grp]}) khắc phá格 (−5)`;
            reasons.push(gejuReason);
          } else {
            dim.geju = 50; gejuScore = 0;
            gejuReason = `Giờ ${hGan} (${god}/${GROUP_VI[grp] || '—'}) — trung tính với格`;
          }
        }
      } catch (_) { dim.geju = 50; gejuScore = 0; }
    }

    // === Tổng hợp có trọng số ===
    score = Weff.huangdao * dim.huangdao / 100
          + Weff.yong * dim.yong / 100
          + Weff.ziwei * dim.ziwei / 100
          + Weff.shensha * dim.shensha / 100
          + Weff.officer * dim.officer / 100
          + (gejuEnabled ? (Weff.geju * dim.geju / 100) : 0);
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
      ...(gejuEnabled ? { gejuScore, gejuReason } : {}),
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
    weights: gejuEnabled ? W : Weff,   // trọng số thực tế dùng (tổng luôn 100)
    gejuEnabled,
    hours,
    best,
    worst,
    summary,
  };
}

export { ZHI_ORDER, RANGE_VI, ZHI_VI, W as BEST_HOUR_WEIGHTS };
