// ============================================================================
//  5 NĂM DỰ BÁO 五年预测 — TỔNG HỢP ĐA HỆ THỐNG
//  Kéo 6 module timing (lưu niên 6 phái + tử vi lưu niên + thái tuế +
//  lưu niên 12 thần + tuế vận + đại vận thập thần) → "năm nào làm gì, cẩn thận gì".
//  Nguồn: tổng hợp từ các module.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { analyzeLiunianDeep } from './liunian-pro.js';
import { liunian12Shen } from './liunian-shen.js';
import { ziweiLiunian } from './ziwei-liunian.js';
import { personalTaSui } from './taisui.js';
import { dayunGodMeaning } from './dayun-god.js';
import { suiyunCheck } from './suiyun.js';
import { GAN, ZHI, TEN_GOD_VI } from './constants.js';

/**
 * @param {object} R - kết quả analyze()
 * @param {number} startYear - năm bắt đầu (thường hiện tại)
 * @param {number} years - số năm (mặc định 5)
 * @returns {{ years:[{year, ganZhi, score, rating, schools, taSui, shen12,
 *            ziwei, suiyun, dayunGod, summary, alert}] }}
 */
export function forecast5(R, startYear, years = 5) {
  const { chart, dayun } = R;
  const birthZhi = chart.pillars.year.zhi;
  const birthYear = chart.input.year;
  const out = [];

  // [cycle 48 H1] age / activeDy / dyGanZhi tính MỖI NĂM trong loop (trước đây tính 1 lần ngoài
  //   loop → đại vận thập thần + tuế vận bị "đóng băng" cả 5 năm, sai sau ranh giới đại vận).
  // [cycle 51 sửa regression] dyGanZhi phải ở SCOPE HÀM (theo dõi đại vận cuối) — trước đây `const`
  //   trong loop → return ngoài scope throws ReferenceError → section "5 NĂM TỚI" brief = [lỗi].
  let dyGanZhi = '?';
  // [loop 22 sửa bug CAO] dayunGodMeaning bất biến trong loop → hoist ra ngoài (perf).
  //   + giải active 大运 THEO startYear (năm dương lịch), KHÔNG theo startAge (虚岁).
  //   Trước đây age=year-birthYear (tuổi thật) vs startAge (虚岁=startYear-birthYear+1)
  //   lệch 1 → dayunGod/suiyun lệch CẢ THẬP KỶ so với ln.score (đã đúng qua startYear).
  const dg = dayunGodMeaning(chart, dayun);

  for (let i = 0; i < years; i++) {
    const year = startYear + i;
    const activeDy = (dayun || []).find((d) => d && d.startYear != null && d.startYear <= year && year < d.startYear + 10) || null;
    dyGanZhi = activeDy?.ganZhi || '?';
    const alerts = [];
    const positives = [];

    // 1. Lưu niên 6 phái
    const ln = analyzeLiunianDeep(R, year);
    const tone = ln.score >= 56 ? 'cat' : ln.score >= 36 ? 'mid' : 'hung'; // [loop 652] align liunian unified (Cát≥56)
    if (tone === 'hung') alerts.push(`⚠ Vận năm ${ln.rating} (${ln.score}/100): ${ln.schools.filter(s => s.d < -8).map(s => s.note.slice(0, 50)).join('; ')}`);
    else if (tone === 'cat') positives.push(`✓ Vận năm ${ln.rating} (${ln.score}/100) — nên tiến thủ.`);

    // 2. Lưu niên 12 thần
    const yearZhi = Solar.fromYmdHms(year, 6, 15, 12, 0, 0).getLunar().getYearZhi();
    const shen12 = liunian12Shen(birthZhi, yearZhi);
    if (shen12.god.tone === 'hung') alerts.push(`${shen12.god.zh} (${shen12.god.vi}) — ${shen12.god.meaning.slice(0, 40)}`);
    else positives.push(`${shen12.god.zh} (${shen12.god.vi})`);

    // 3. Thái tuế
    const ts = personalTaSui(birthZhi, yearZhi);
    if (ts?.offends) {
      const typeStr = (ts.types || []).map((t) => typeof t === 'string' ? t : (t.vi || t.name || JSON.stringify(t))).join('+');
      alerts.push(`⚡ Phạm thái tuế (${typeStr}): ${(ts.msg || '').slice(0, 40)}`);
    }

    // 4. Tử vi lưu niên
    let zw = null;
    try {
      zw = ziweiLiunian(birthYear, chart.input.month, chart.input.day, chart.input.hour, chart.input.minute, chart.input.gender, year);
      const zwTone = zw.tone === 'cat' ? 'cát' : zw.tone === 'hung' ? 'hung' : 'trung';
      if (zw.tone === 'hung') alerts.push(`Tử Vi: cung ${zw.palace} (${zw.stars.join(',')}) [${zwTone}]`);
      else positives.push(`Tử Vi: cung ${zw.palace} (${zw.stars.join(',')}) [${zwTone}]`);
    } catch (e) {}

    // 5. Tuế vận tương tác
    const sy = suiyunCheck(dyGanZhi, year, ln.ganZhi);
    if (sy?.severity >= 2) alerts.push(`⚡ Tuế vận: ${sy.note.slice(0, 50)}`);

    // 6. Đại vận thập thần [loop 22] — giải theo startYear (khớp analyzeLiunianDeep), dg đã hoist
    const activeDg = dg.items.find((d) => d && d.startYear != null && d.startYear <= year && year < d.startYear + 10);

    // Tổng hợp
    const summary = (positives.length ? positives.join(' | ') : '—') + (alerts.length ? ' ‖ ' + alerts.join(' | ') : '');
    const alert = alerts.length >= 2 ? '🔴 NĂM CẨN THẬN' : alerts.length === 1 ? '🟡 CẨN THẬN NHẸ' : positives.length >= 2 ? '🟢 NĂM TỐT' : '⚪ BÌNH THƯỜNG';

    out.push({
      year, ganZhi: ln.ganZhi, score: ln.score, rating: ln.rating, tone,
      shen12: shen12.god.zh,
      ziwei: zw ? { palace: zw.palace, palaceVi: zw.palaceVi, stars: zw.stars, tone: zw.tone === 'cat' ? 'cát' : zw.tone === 'hung' ? 'hung' : 'trung', theme: zw.theme } : null,
      dayunGod: activeDg?.godVi || '?',
      yearStage: ln.yearStage || null, yearHealthTheme: ln.yearHealthTheme || null, // [loop 1106] TCM năm
      positives, alerts, summary, alert,
    });
  }

  return { years: out, activeDayun: dyGanZhi };
}
