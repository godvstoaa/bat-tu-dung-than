// ============================================================================
//  未来 10 年 一览 — BẢNG DỰ BÁO THẬP KỶ (1 dòng/năm: vận + Tài + Quan + Duyên)
//  "10 năm tới của tôi trông thế nào?" — tổng hợp các scanner thành 1 bảng.
//  * Mỗi năm: rating lưu niên (liunian-pro 6 phái) + cờ kích hoạt:
//    💰 Tài thấu (yingqi-wealth), 🎯 Quan thấu, 💞 duyên/hôn (marriage-timing).
//  * Synthesis của các scanner có sẵn — không trùng lặp logic, chỉ gộp view.
//  Nguồn: tổng hợp liunian-pro + yingqi-wealth + marriage-timing.
// ============================================================================
import { analyzeLiunianDeep } from './liunian-pro.js';
import { scanWealthCareerYingqi } from './yingqi-wealth.js';
import { scanMarriageTiming } from './marriage-timing.js';

const FLAG = { cai: '💰', guan: '🎯', marriage: '💍', romance: '💞' };

/**
 * @param {object} R — analyze()
 * @param {number} fromYear
 * @returns {{ years:[{year,ganZhi,rating,score,flags}], bestYear, worstYear, summary }}
 */
export function decadeForecast(R, fromYear, count = 10) {
  const start = fromYear || new Date().getFullYear();
  const wc = scanWealthCareerYingqi(R, start, count);
  const mt = scanMarriageTiming(R, start, count);
  const caiYears = new Set(wc.caiYears.map((y) => y.year));
  const guanYears = new Set(wc.guanYears.map((y) => y.year));
  const marriageSet = new Set(mt.topMarriage.map((y) => y.year));
  const romanceSet = new Set(mt.topRomance.map((y) => y.year));

  const years = [];
  for (let i = 0; i < count; i++) {
    const y = start + i;
    let ln;
    try { ln = analyzeLiunianDeep(R, y); } catch (e) { continue; }
    const flags = [];
    if (caiYears.has(y)) flags.push(FLAG.cai + 'Tài');
    if (guanYears.has(y)) flags.push(FLAG.guan + 'Quan');
    if (marriageSet.has(y)) flags.push(FLAG.marriage + 'Hôn');
    else if (romanceSet.has(y)) flags.push(FLAG.romance + 'Duyên');
    years.push({ year: y, ganZhi: ln.ganZhi, rating: ln.rating, score: ln.score, flags });
  }

  // best/worst by liunian score
  const best = years.reduce((a, b) => (b.score > (a?.score || -99) ? b : a), null);
  const worst = years.reduce((a, b) => (b.score < (a?.score ?? 99) ? b : a), null);

  const fmtYear = (y) => `${y.year}(${y.ganZhi}) ${y.rating}${y.flags.length ? ' ' + y.flags.join(' ') : ''}`;
  const summary = `10 năm tới (${start}–${start + count - 1}): ` +
    `TỐT NHẤT ${best ? `${best.year}(${best.rating}, ${best.score}/100${best.flags.length ? ', ' + best.flags.join(' ') : ''})` : '?'}, ` +
    `XẤU NHẤT ${worst ? `${worst.year}(${worst.rating}, ${worst.score})` : '?'}. ` +
    `Cờ: 💰Tài=${[...caiYears].join('/') || '-'} 🎯Quan=${[...guanYears].join('/') || '-'} 💍Hôn=${[...marriageSet].join('/') || '-'} 💞Duyên=${[...romanceSet].slice(0, 4).join('/') || '-'}.`;

  return { years, best, worst, summary };
}

export { FLAG };
