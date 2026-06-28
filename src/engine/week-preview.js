// ============================================================================
//  TUẦN NÀY 7 NGÀY — WEEK PREVIEW (compact, visual, actionable)
//  Thanh 7 ô màu theo điểm lưu nhật từng ngày. Nhanh — user nhìn 1 cái biết
//  tuần nào thuận/ắc, ngày nào nên tiến thủ/tránh. Dùng analyzeLiuRi (verify)
//  + 真太阳时 (nếu có). Nguồn: 流日论 (tương tác lưu niên/đại vận).
// ============================================================================
import { Solar } from 'lunar-javascript';
import { analyzeLiuRi } from './liuri.js';

const WEEKDAY_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

/**
 * @param {object} R analyze()
 * @param {object} opts { startDate='YYYY-MM-DD' (default hôm nay), days=7, patternQuality }
 * @returns {{ days:[{date,weekdayVi,day,solar,ganZhi,ganGod,score,rating,tone,note}], best, worst, summary }}
 */
export function weekPreview(R, opts = {}) {
  const days = opts.days || 7;
  let start;
  if (opts.startDate) {
    const [y, m, d] = opts.startDate.split('-').map(Number);
    start = Solar.fromYmdHms(y, m, d, 12, 0, 0);
  } else {
    const n = new Date();
    start = Solar.fromYmdHms(n.getFullYear(), n.getMonth() + 1, n.getDate(), 12, 0, 0);
  }
  const pq = opts.patternQuality || R.patternQuality || null;
  const out = [];
  for (let i = 0; i < days; i++) {
    const s = start.next(i);
    const y = s.getYear(), m = s.getMonth(), d = s.getDay();
    let base;
    try { base = analyzeLiuRi(R, y, m, d, pq); } catch (e) { continue; }
    const score = base.score;
    const rating = base.rating;
    const tone = score >= 54 ? 'cat' : score >= 44 ? 'mid' : 'hung'; // [loop 652] align liuri unified (Cát≥54)
    out.push({
      date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      weekdayVi: WEEKDAY_VI[s.getWeek()],
      day: d, month: m,
      solar: s.toYmd(),
      ganZhi: base.ganZhi, ganGod: base.ganGod,
      score, rating, tone,
      gejuDelta: base.gejuDelta || 0,
      note: (base.advice || '').slice(0, 50),
    });
  }
  const sorted = [...out].sort((a, b) => b.score - a.score);
  const best = sorted[0] || null;
  const worst = sorted[sorted.length - 1] || null;
  const catCount = out.filter((d) => d.tone === 'cat').length;
  const hungCount = out.filter((d) => d.tone === 'hung').length;
  const summary = catCount >= 4
    ? `Tuần TỐT — ${catCount}/${days} ngày cát. Nên tiến thủ lớn vào ${best ? best.weekdayVi + ' ' + best.day + '/' + best.month : '?'}.`
    : hungCount >= 4
      ? `Tuần CẨN THẬN — ${hungCount}/${days} ngày hung. Tránh quyết định lớn; ngày đỡ: ${best ? best.weekdayVi + ' ' + best.day + '/' + best.month : '?'}.`
      : `Tuần TRUNG BÌNH — ${catCount} cát / ${hungCount} hung. Tốt nhất: ${best ? best.weekdayVi + ' ' + best.day + '/' + best.month + ' (' + best.score + ')' : '?'}.`;
  return { days: out, best, worst, summary };
}
