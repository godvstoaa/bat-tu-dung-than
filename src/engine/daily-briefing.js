// ============================================================================
//  DAILY BRIEFING 每日简报 — COMPOSITE LAYER (KHÔNG tính toán mới)
//  ----------------------------------------------------------------------------
//  Mục tiêu: trả lời "Hôm nay tôi cần biết gì?" trong MỘT thẻ tóm tắt khả thi,
//  thay vì user phải lướt 70 thẻ. Module này KHÔNG thêm thuật toán nào — chỉ
//  TỔNG HỢP dữ liệu từ các module đã có vào một "summary card" nhất.
//
//  Các nguồn được tổng hợp (mỗi nguồn bọc try/catch — lỗi 1 nguồn không sập composite):
//    1. 今日 vận rating      ← huangdao12 + analyzeDaySpecial (天赦/四废/凶日)
//    2. Giờ tốt nhất          ← bestHourToday (composite 5 chiều)
//    3. 紫微流日命宫          ← ziweiLiuri (cung lưu nhật kích hoạt)
//    4. Sát phương hôm nay    ← sanshaDirection + annualTabooOverview
//    5. Thái Tuế              ← taiSuiOverview (trị niên + bản mệnh)
//    6. Dụng Thần hành động   ← R.yong + WX (can/chi ngày vs Dụng/Hỷ/Kỵ)
//    7. 流年 event            ← liunianEvents (sự kiện chính của năm)
//    8. Cải vận ngắn          ← dẫn xuất từ can/chi ngày + Dụng Thần
//
//  Pure composition: mọi logic tính toán nằm trong module nguồn. Module này
//  chỉ lắp ghép + viết câu `oneLiner`/`summary`. Nhanh (<50ms — gọi module cache).
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI } from './constants.js';
import { huangdao12 } from './huangdao.js';
import { analyzeDaySpecial } from './zheri-stars.js';
import { bestHourToday } from './best-hour.js';
import { ziweiLiuri } from './ziwei-liuri.js';
import { sanshaDirection } from './sansha.js';
import { annualTabooOverview } from './annual-taboo.js';
import { taiSuiOverview } from './taisui-general.js';
import { liunianEvents } from './liunian-event.js';
import { WX_REMEDY } from './remedy.js';

// ---- Định nghĩa action theo tone ngày + Dụng Thần (cho `tips` cải vận ngắn) ----
// Tone hoàng đạo → tiến thủ; tone hắc đạo → tĩnh/thu dọn.
const ACTION_CAT = ['khai trương', 'ký kết', 'gặp người lớn', 'đầu tư vừa phải', 'thương lượng', 'cầu tài'];
const ACTION_HUNG = ['dọn dẹp', 'thu xếp sổ sách', 'nghỉ ngơi', 'an tĩnh', 'tích đức', 'tránh việc lớn'];

/**
 * Tổng hợp thông tin HÔM NAY thành một "briefing card".
 *
 * @param {object} R - kết quả analyze() (cần R.chart, R.yong, R.chart.input)
 * @param {number} [year]  - năm dương lịch (mặc định hôm nay)
 * @param {number} [month] - tháng (1..12)
 * @param {number} [day]   - ngày
 * @returns {{
 *   date: string, lunarStr: string, dayGanZhi: string,
 *   rating: { score:number, level:string, tone:'cat'|'hung'|'bình', summary:string },
 *   bestHours: Array<{ zhi:string, vi:string, score:number, topReason:string }>,
 *   avoidHours: Array<{ zhi:string, vi:string, reason:string }>,
 *   ziweiDaily: { palace:string, vi:string, tone:string, meaning:string },
 *   directionTaboo: { avoid:string[], safe:string[], reason:string },
 *   taisui: { current:string, relation:string },
 *   yongAction: { boost:string, reduce:string, reason:string },
 *   yearEvent: { god:string, event:string, who:string },
 *   tips: string[],
 *   oneLiner: string,
 *   summary: string
 * }}
 */
export function dailyBriefing(R, year, month, day) {
  const _now = new Date();
  const y = year ?? _now.getFullYear();
  const mo = month ?? (_now.getMonth() + 1);
  const d = day ?? _now.getDate();

  // Nền ngày: can chi + âm lịch (dùng cho mọi nhánh, lấy 1 lần)
  let dayGanZhi = '?';
  let lunarStr = '';
  let dayGan = '甲', dayZhi = '子';
  try {
    const s = Solar.fromYmdHms(y, mo, d, 12, 0, 0);
    const l = s.getLunar();
    dayGan = l.getDayGan();
    dayZhi = l.getDayZhi();
    dayGanZhi = dayGan + dayZhi;
    lunarStr = `${l.getMonthInChinese()}月${l.getDayInChinese()}`;
  } catch (_) {}

  // Dụng / Hỷ / Kỵ ngũ hành (fallback an toàn nếu R thiếu yong)
  const yong = R?.yong || {};
  const dung = yong.primary;        // 行 Dụng
  const hy = yong.xi;               // 行 Hỷ
  const ky = yong.ji;               // 行 Kỵ

  // ============================================================
  // 1. RATING — kết hợp 黄道 (huangdao12) + 天赦/四废/凶日 (analyzeDaySpecial)
  // ============================================================
  let rating = { score: 50, level: 'Bình', tone: 'bình', summary: 'Ngày trung bình.' };
  let huang = null;
  try {
    huang = huangdao12(y, mo, d);
    let score = huang.tone === 'cat' ? 70 : 32;      // nền hoàng/hắc đạo
    let level = huang.tone === 'cat' ? 'Hoàng Đạo' : 'Hắc Đạo';
    let tone = huang.tone === 'cat' ? 'cat' : 'hung';

    // Cộng/trừ theo sao đặc biệt trong ngày (天赦 +, 四废/十恶 -)
    try {
      const sp = analyzeDaySpecial(y, mo, d);
      for (const s of (sp.special || [])) {
        if (s.type === '天赦') { score += 20; level = 'Thiên Xá (Đại Cát)'; tone = 'cat'; }
        else if (s.type === '四废') { score -= 16; level = 'Tứ Phế (Đại Hung)'; tone = 'hung'; }
        else if (s.type === '十恶大败') { score -= 12; if (tone !== 'hung') { level = 'Thập Ác (Kỵ tài)'; } }
      }
    } catch (_) {}

    score = Math.max(2, Math.min(98, Math.round(score)));
    const roadVi = huang.road === 'yellow' ? 'HOÀNG ĐẠO' : 'HẮC ĐẠO';
    rating = {
      score,
      level,
      tone,
      summary: `${roadVi} ${huang.deity} (${huang.deityVi}) — chủ "${huang.domain}". ${huang.advice || ''}`.trim(),
    };
  } catch (_) {}

  // ============================================================
  // 2. BEST/WORST HOURS — bestHourToday (composite 5 chiều)
  // ============================================================
  let bestHours = [];
  let avoidHours = [];
  let bhDayOfficerVi = '';
  try {
    const bh = bestHourToday(R, y, mo, d);
    bhDayOfficerVi = bh.dayOfficer?.officerVi || '';
    bestHours = (bh.best || []).map((h) => ({
      zhi: h.zhi,
      vi: h.vi,
      score: h.score,
      topReason: (h.reasons && h.reasons[0]) || '',
    }));
    avoidHours = (bh.worst || []).map((h) => ({
      zhi: h.zhi,
      vi: h.vi,
      reason: (h.reasons && h.reasons[0]) || `${h.rating || ''}`,
    }));
  } catch (_) {}

  // ============================================================
  // 3. 紫微流日 — ziweiLiuri (cung lưu nhật kích hoạt)
  // ============================================================
  let ziweiDaily = { palace: '?', vi: '?', tone: 'bình', meaning: '' };
  try {
    // ziweiLiuri cần R.input (hoặc {input}); analyze() trả R.chart.input → bọc lại.
    const zR = R?.input ? R : { input: R?.chart?.input || R };
    const zlr = ziweiLiuri(zR, y, mo, d);
    const g = zlr.liuriGong || {};
    ziweiDaily = {
      palace: g.zhi || '?',
      vi: g.vi || '?',
      tone: g.tone || 'bình',
      meaning: g.meaning || '',
    };
  } catch (_) {}

  // ============================================================
  // 4. SÁT PHƯƠNG — sanshaDirection + annualTabooOverview
  // ============================================================
  let directionTaboo = { avoid: [], safe: [], reason: '' };
  try {
    const ov = annualTabooOverview(y);
    const avoid = (ov.worst || []).map((s) => s.replace(/\(.*\)$/, '').trim()).filter(Boolean);
    // Làm gọn: nếu có nhiều, lấy 3 hướng nặng nhất
    const safe = (ov.clean || []).slice(0, 3);
    // Bổ sung Tam Sát chính phương (năm) để nhấn nếu chưa nằm trong worst
    try {
      const ss = sanshaDirection(y);
      if (ss.mainDir && !avoid.some((a) => a.startsWith(ss.mainDir))) {
        avoid.unshift(`${ss.mainDir} (Tam Sát)`);
      }
    } catch (_) {}
    directionTaboo = { avoid: avoid.slice(0, 4), safe, reason: ov.summary || '' };
  } catch (_) {}

  // ============================================================
  // 5. THÁI TUẾ — taiSuiOverview (trị niên + bản mệnh)
  // ============================================================
  let taisui = { current: '?', relation: '' };
  try {
    const ts = taiSuiOverview(R, y);
    taisui = {
      current: ts.current?.ganZhi ? `${ts.current.ganZhi} (${ts.current.nameShort || ''})` : '?',
      relation: ts.isBenMingYear
        ? 'Phạm THÁI TUẾ (值太岁) — năm xui yếu, nên an/hóa'
        : (ts.summary || '').split('Khuyến nghị')[0].trim(),
    };
  } catch (_) {}

  // ============================================================
  // 6. DỤNG THẦN HÀNH ĐỘNG — can/chi ngày vs Dụng/Hỷ/Kỵ
  // ============================================================
  let yongAction = { boost: '', reduce: '', reason: '' };
  try {
    const ganWx = GAN[dayGan]?.wx;
    const zhiWx = ZHI[dayZhi]?.wx;
    const hits = [];
    const bad = [];
    if (ganWx && ganWx === dung) hits.push(`can ngày ${WX_VI[ganWx]} (=Dụng)`);
    if (zhiWx && zhiWx === dung) hits.push(`chi ngày ${WX_VI[zhiWx]} (=Dụng)`);
    if (ganWx && ganWx === hy) hits.push(`can ngày ${WX_VI[ganWx]} (=Hỷ)`);
    if (zhiWx && zhiWx === hy) hits.push(`chi ngày ${WX_VI[zhiWx]} (=Hỷ)`);
    if (ganWx && ganWx === ky) bad.push(`can ngày ${WX_VI[ganWx]} (=Kỵ)`);
    if (zhiWx && zhiWx === ky) bad.push(`chi ngày ${WX_VI[zhiWx]} (=Kỵ)`);
    yongAction = {
      boost: hits.length ? hits.join(' + ') : (dung ? `hành ${WX_VI[dung]} (Dụng)` : ''),
      reduce: bad.length ? bad.join(' + ') : '',
      reason: hits.length
        ? `Ngày mang ngũ hành Dụng/Hỷ → nền thuận, nên KÍCH HOẠT Dụng Thần.`
        : bad.length
          ? `Ngày mang ngũ hành Kỵ → nên GIẢM bớt, dè chừng.`
          : `Ngày không trực tiếp mang Dụng/Kỵ → trung tính, giữ phong độ.`,
    };
  } catch (_) {}

  // ============================================================
  // 7. 流年 EVENT — liunianEvents (sự kiện chính của năm)
  // ============================================================
  let yearEvent = { god: '?', event: '', who: '' };
  try {
    const le = liunianEvents(R, y);
    const top = (le.events || [])[0];
    yearEvent = {
      god: le.yearGodVi || '?',
      event: top?.vi || '',
      who: top?.who || '',
    };
  } catch (_) {}

  // ============================================================
  // 8. CẢI VẬN NGẮN — 2-3 tips hành động dựa trên tone + Dụng Thần
  // ============================================================
  const tips = [];
  try {
    const isCat = rating.tone === 'cat';
    const pool = isCat ? ACTION_CAT : ACTION_HUNG;
    const verb = isCat ? 'Nên' : 'Ưu tiên';
    const pick = pool.slice(0, 2);
    if (pick.length) tips.push(`${verb}: ${pick.join(' / ')}.`);
    // Tip theo Dụng Thần (phương vị/màu) từ WX_REMEDY
    if (dung && WX_REMEDY[dung]) {
      const r = WX_REMEDY[dung];
      tips.push(`Kích Dụng ${WX_VI[dung]}: hướng ${r.direction.split(',')[0]}, màu ${r.color.split(',')[0]}, số ${r.number.split(',')[0]}.`);
    }
    // Tip hướng tránh (nếu có)
    if (directionTaboo.avoid.length) {
      tips.push(`Tránh động thổ/dời nhà về hướng ${directionTaboo.avoid[0]}.`);
    } else {
      tips.push('Hôm nay không phạm sát phương lớn — fairly thoải mái về hướng.');
    }
  } catch (_) {}

  // ============================================================
  // ONE-LINER — câu chốt tóm tắt cả ngày
  // ============================================================
  const oneLiner = buildOneLiner({ rating, huang, bestHours, directionTaboo, yongAction, bhDayOfficerVi });

  // ============================================================
  // SUMMARY — bản multi-line đầy đủ
  // ============================================================
  const lines = [];
  lines.push(`📅 ${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')} (ÂL ${lunarStr || '?'}) · <${dayGanZhi}>`);
  lines.push(`VẬN: ${rating.level} (${rating.score}/100) — ${rating.summary}`);
  if (bestHours.length) lines.push(`GIỜ TỐT: ${bestHours.map((h) => `${h.vi}(${h.score})`).join(', ')}${bestHours[0]?.topReason ? ' — ' + bestHours[0].topReason : ''}`);
  if (avoidHours.length) lines.push(`GIỜ KỴ: ${avoidHours.map((h) => h.vi).join(', ')}`);
  if (ziweiDaily.palace !== '?') lines.push(`紫微流日 @ ${ziweiDaily.palace} ${ziweiDaily.vi} [${ziweiDaily.tone}] — ${ziweiDaily.meaning}`);
  if (directionTaboo.avoid.length) lines.push(`HƯỚNG KỴ: ${directionTaboo.avoid.join(', ')}${directionTaboo.safe.length ? ' | AN TOÀN: ' + directionTaboo.safe.join(', ') : ''}`);
  if (taisui.current !== '?') lines.push(`THÁI TUẾ: ${taisui.current}${taisui.relation ? ' — ' + taisui.relation : ''}`);
  if (yongAction.boost || yongAction.reduce) lines.push(`DỤNG THẦN: ${yongAction.boost ? 'tăng ' + yongAction.boost : ''}${yongAction.reduce ? ' | giảm ' + yongAction.reduce : ''}`);
  if (yearEvent.god !== '?') lines.push(`LƯU NIÊN: sao ${yearEvent.god}${yearEvent.event ? ' → ' + yearEvent.event : ''}${yearEvent.who ? ' (' + yearEvent.who + ')' : ''}`);
  if (tips.length) lines.push(`CẢI VẬN: ${tips.join(' ')}`);
  const summary = lines.join('\n');

  return {
    date: `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    lunarStr,
    dayGanZhi,
    rating,
    bestHours,
    avoidHours,
    ziweiDaily,
    directionTaboo,
    taisui,
    yongAction,
    yearEvent,
    tips,
    oneLiner,
    summary,
  };
}

// ---- Helper: dựng câu oneLiner (KEY output) ----
function buildOneLiner({ rating, huang, bestHours, directionTaboo, yongAction, bhDayOfficerVi }) {
  const bits = [];

  // 1. Tone ngày + trực
  if (huang) {
    const roadVi = huang.road === 'yellow' ? 'HOÀNG ĐẠO' : 'HẮC ĐẠO';
    bits.push(`Hôm nay ngày ${roadVi} (${huang.deityVi}${bhDayOfficerVi ? '/' + bhDayOfficerVi : ''})`);
  } else {
    bits.push(`Hôm nay vận ${rating.level} (${rating.score}/100)`);
  }

  // 2. Giờ tốt nhất + lý do
  if (bestHours.length) {
    const b0 = bestHours[0];
    const why = b0.topReason ? ` — ${b0.topReason}` : '';
    bits.push(`giờ tốt ${b0.vi}${why}`);
  }

  // 3. Dụng Thần hành động (nếu ngày mang Dụng/Hỷ/Kỵ rõ)
  if (yongAction.boost) bits.push(`ngày ${yongAction.boost}`);
  else if (yongAction.reduce) bits.push(`ngày ${yongAction.reduce}`);

  // 4. Hướng tránh
  if (directionTaboo.avoid.length) {
    bits.push(`hướng tránh ${directionTaboo.avoid[0]}`);
  }

  const head = bits.join(', ') + '.';

  // 5. Nên / Tránh (câu hành động ngắn)
  const isCat = rating.tone === 'cat';
  const should = isCat ? 'Nên: khai trương/ký kết/gặp người lớn' : 'Nên: dọn dẹp/thu xếp/an tĩnh';
  const avoid = isCat
    ? (directionTaboo.avoid.length ? `Tránh: động thổ hướng ${directionTaboo.avoid[0]}` : 'Tránh: liều lĩnh/quá mức')
    : 'Tránh: khai trương/đầu tư/việc lớn';
  return `${head} ${should}. ${avoid}.`;
}

export { ACTION_CAT, ACTION_HUNG };
