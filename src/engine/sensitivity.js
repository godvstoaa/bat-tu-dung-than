// ============================================================================
//  MỆNH NHẠY CẢM (敏感度分析) — CHART SENSITIVITY
//  Nguyên lý [loop 26]: nếu đổi giờ sinh (12时辰) hoặc ±ngày, điểm mệnh đổi bao
//  nhiêu? Trả lời "Trụ Giờ của mình quan trọng bao nhiêu" — liên kết 真太阳时 (loop 23,
//  sinh gần ranh 时辰 thì vài phút đổi Trụ Giờ → đổi mệnh). Output = bảng điểm theo
//  时辰 + độ phân tán + insight + giờ TỐT NHẤT/XẤU NHẤT có thể (nếu sinh trễ/ sớm hơn).
// ============================================================================
import { analyze } from './chart.js';

// 12 时辰 giờ giữa (tránh ranh 早子/晚子)
const SHICHEN = [
  { zhi: '子', h: 0, m: 30 }, { zhi: '丑', h: 2, m: 30 }, { zhi: '寅', h: 4, m: 30 },
  { zhi: '卯', h: 6, m: 30 }, { zhi: '辰', h: 8, m: 30 }, { zhi: '巳', h: 10, m: 30 },
  { zhi: '午', h: 12, m: 30 }, { zhi: '未', h: 14, m: 30 }, { zhi: '申', h: 16, m: 30 },
  { zhi: '酉', h: 18, m: 30 }, { zhi: '戌', h: 20, m: 30 }, { zhi: '亥', h: 22, m: 30 },
];
const SHICHEN_VI = { 子: 'Tý', 丑: 'Sửu', 寅: 'Dần', 卯: 'Mão', 辰: 'Thìn', 巳: 'Tỵ', 午: 'Ngọ', 未: 'Mùi', 申: 'Thân', 酉: 'Dậu', 戌: 'Tuất', 亥: 'Hợi' };

function shichenOfHour(h) {
  if (h >= 23 || h < 1) return '子';
  const idx = Math.floor(((h + 1) / 2)) % 12; // 1-2→丑(1)... map
  // đơn giản: 每 2 giờ 1 chi, 丑=1-3, 寅=3-5...
  if (h >= 1 && h < 3) return '丑';
  if (h >= 3 && h < 5) return '寅';
  if (h >= 5 && h < 7) return '卯';
  if (h >= 7 && h < 9) return '辰';
  if (h >= 9 && h < 11) return '巳';
  if (h >= 11 && h < 13) return '午';
  if (h >= 13 && h < 15) return '未';
  if (h >= 15 && h < 17) return '申';
  if (h >= 17 && h < 19) return '酉';
  if (h >= 19 && h < 21) return '戌';
  if (h >= 21 && h < 23) return '亥';
  return '子';
}

/**
 * Phân tích nhạy cảm: đổi 12 时辰 → điểm mệnh đổi ra sao + (tuỳ chọn) ±ngày.
 * @param {object} input {year,month,day,hour,minute,gender}
 * @param {object} opts {refYear, varyDays=0}
 * @returns {{ baseScore, baseShichen, hourScores:[{shichen,shichenVi,score,pattern,gejuQuality,isUser}], max, min, spread, bestShichen, worstShichen, insight, dayVary?[] }}
 */
export function chartSensitivity(input, opts = {}) {
  const refYear = opts.refYear ?? new Date().getFullYear();
  const varyDays = opts.varyDays ?? 0;
  const { year, month, day, gender } = input;
  const userShichen = shichenOfHour(input.hour);

  // base = giờ thật của user
  let baseR;
  try { baseR = analyze(year, month, day, input.hour, input.minute, gender, refYear); }
  catch (e) { baseR = null; }
  const baseScore = baseR?.synthesis?.score ?? null;

  // Quét 12 时辰 (cùng ngày sinh)
  const hourScores = SHICHEN.map((sc) => {
    let R;
    try { R = analyze(year, month, day, sc.h, sc.m, gender, refYear); } catch (e) { return null; }
    const score = R.synthesis?.score ?? null;
    return {
      shichen: sc.zhi, shichenVi: SHICHEN_VI[sc.zhi], hour: sc.h,
      score, pattern: R.pattern?.vi ?? '', gejuQuality: R.patternQuality?.quality ?? '',
      dayGan: R.chart.dayGan, isUser: sc.zhi === userShichen,
    };
  }).filter(Boolean);

  const valid = hourScores.filter((h) => h.score != null);
  const scores = valid.map((h) => h.score);
  const max = scores.length ? Math.max(...scores) : null;
  const min = scores.length ? Math.min(...scores) : null;
  const spread = (max != null && min != null) ? max - min : null;
  const best = valid.find((h) => h.score === max) || null;
  const worst = valid.find((h) => h.score === min) || null;

  // ±ngày (tuỳ chọn) — xem đổi ngày sinh tác động bao nhiêu
  let dayVary = null;
  if (varyDays > 0) {
    dayVary = [];
    for (let dd = -varyDays; dd <= varyDays; dd++) {
      if (dd === 0) continue;
      // dựng Date + offset
      const dt = new Date(Date.UTC(year, month - 1, day));
      dt.setUTCDate(dt.getUTCDate() + dd);
      let R;
      try { R = analyze(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate(), input.hour, input.minute, gender, refYear); }
      catch (e) { continue; }
      dayVary.push({ offset: dd, score: R.synthesis?.score ?? null, pattern: R.pattern?.vi ?? '' });
    }
  }

  // Insight: độ nhạy cảm Trụ Giờ
  let insight;
  if (spread == null) insight = '(không tính được điểm).';
  else if (spread >= 25) insight = `Trụ Giờ RẤT quan trọng: đổi 时辰 alone làm điểm mệnh dao động ${spread}đ (${min}→${max}). Giờ sinh chính xác (真太阳时) cực kỳ cần — sinh gần ranh 时辰 thì vài phút đổi cả Trụ Giờ → đổi mệnh.`;
  else if (spread >= 12) insight = `Trụ Giờ khá quan trọng: dao động ${spread}đ (${min}→${max}) khi đổi 时辰. Nên cố gắng giờ sinh chính xác.`;
  else insight = `Trụ Giờ ÍT tác động: đổi 时辰 chỉ dao động ${spread}đ (${min}→${max}) — mệnh chủ yếu do năm/tháng/ngày quyết định, giờ sinh sai vài giờ không đổi lớn bản chất.`;
  if (best && worst && best.shichen !== worst.shichen && baseScore != null) {
    const vsBest = best.score - baseScore;
    if (vsBest > 5) insight += ` ⚠ Giờ ${best.shichenVi}(${best.shichen}) sẽ cho điểm CAO hơn giờ thật của bạn ${vsBest}đ — nhưng đó là "có thể" của lá số, không phải đổi được.`;
  }

  return { baseScore, baseShichen: userShichen, baseShichenVi: SHICHEN_VI[userShichen], hourScores, max, min, spread, best, worst, insight, dayVary };
}

export { SHICHEN_VI, shichenOfHour };
