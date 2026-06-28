// ============================================================================
//  LỊCH THÁNG VẬN 月历运势 — MONTHLY FORTUNE CALENDAR (visual, actionable)
//  Lịch tháng hiển thị mỗi ngày tô màu theo điểm lưu nhật. User nhìn 1 cái
//  biết ngày nào tốt/xấu trong tháng. Dùng analyzeLiuRi (verify).
// ============================================================================
import { Solar } from 'lunar-javascript';
import { analyzeLiuRi } from './liuri.js';

const WEEKDAY_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTH_VI = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

/**
 * @param {object} R analyze()
 * @param {object} opts { year, month, patternQuality }
 * @returns {{ year, month, monthVi, days:[{day,weekdayVi,solar,ganZhi,ganGod,score,rating,tone,inMonth}], best, worst, summary }}
 */
export function monthCalendar(R, opts = {}) {
  const year = opts.year || new Date().getFullYear();
  const month = opts.month || (new Date().getMonth() + 1);
  const pq = opts.patternQuality || R.patternQuality || null;

  const firstDay = Solar.fromYmdHms(year, month, 1, 12, 0, 0);
  const startWeekday = firstDay.getWeek(); // 0=CN
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const dim = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const daysInMonth = dim[month - 1];

  // Tính điểm từng ngày
  const dayData = [];
  for (let d = 1; d <= daysInMonth; d++) {
    let base;
    try { base = analyzeLiuRi(R, year, month, d, pq); } catch (e) { continue; }
    dayData.push({
      day: d, weekdayVi: WEEKDAY_VI[new Date(year, month - 1, d).getDay()],
      ganZhi: base.ganZhi, ganGod: base.ganGod,
      score: base.score, rating: base.rating,
      tone: base.score >= 54 ? 'cat' : base.score >= 44 ? 'mid' :'hung', // [loop 652] align liuri unified (Cát≥54)
      gejuDelta: base.gejuDelta || 0,
      inMonth: true,
    });
  }

  // Padding ngày trước (ngày tháng trước để lấp lịch)
  const prevMonthDays = [];
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevDim = dim[prevMonth - 1];
  for (let i = startWeekday - 1; i >= 0; i--) {
    prevMonthDays.push({ day: prevDim - i, inMonth: false, tone: 'pad' });
  }

  const allDays = [...prevMonthDays, ...dayData];

  // Best/worst
  const sorted = [...dayData].sort((a, b) => b.score - a.score);
  const best = sorted[0] || null;
  const worst = sorted[sorted.length - 1] || null;
  const catCount = dayData.filter((d) => d.tone === 'cat').length;
  const hungCount = dayData.filter((d) => d.tone === 'hung').length;

  const summary = catCount > hungCount + 5
    ? `Tháng TỐT — ${catCount} ngày cát / ${hungCount} ngày hung. Tiến thủ lớn ngày ${best?.day}.`
    : hungCount > catCount + 5
      ? `Tháng CẨN THẬN — ${hungCount} ngày hung / ${catCount} ngày cát. Tránh ngày ${worst?.day}.`
      : `Tháng CÂN BẰNG — ${catCount} cát / ${hungCount} hung. Tốt nhất: ngày ${best?.day} (${best?.score}).`;

  return {
    year, month, monthVi: `${MONTH_VI[month - 1]} ${year}`,
    days: allDays, dayCount: daysInMonth,
    best, worst, catCount, hungCount, summary,
  };
}

export { WEEKDAY_VI, MONTH_VI };
