// ============================================================================
//  BÁT TỰ NGƯỢC (逆推八字) — INVERSE SOLVER
//  Nguyên lý user [loop 21]: «phương pháp nào cũng phải DỊCH NGƯỢC được thì mới là
//    phương pháp chuẩn». Ta đã chấm được điểm Tổng Mệnh cho 1 lá số (synthesize); vậy
//    phải tìm ra được lá số Bát Tự có điểm CAO NHẤT / THẤP NHẤT có thể đạt — hoặc gần
//    một điểm target. Đây là bài toán ngược: cho điểm, tìm lá số.
//
//  Phương pháp: quét cửa sổ thời gian (năm × tháng × ngày × 12时辰 × 2 giới) bằng
//    analyze() THẬT (cùng hàm app dùng) → lấy synthesis.score → trả về cực đại/cực tiểu
//    thật + phân phối điểm + top/bottom K + lá số gần target nhất. Quét-thật chứng minh
//    khoảng điểm có thể đạt và tìm được lá số thực tế ở các điểm cực.
//
//  Note: quét là heuristic (không duyệt hết ∞ combos), nhưng vì chỉ số phụ thuộc 4 trụ
//    (tuần hoàn 60 hoa giáp) + đại vận/niên theo refYear, một cửa sổ vài năm × đủ ngày
//    đã lướt phần lớn tổ hợp khác biệt. Caller có thể mở rộng window/step để sát cực hơn.
// ============================================================================
import { analyze } from './chart.js';

// 12 时辰 — lấy giờ giữa mỗi时辰 để chắc thuộc đúng chi (tránh ranh 早子/晚子).
//   子 23-01, 丑 01-03, 寅 03-05, ... , 亥 21-23.
const SHICHEN_HOURS = [
  { zhi: '子', h: 0, m: 30 }, { zhi: '丑', h: 2, m: 30 }, { zhi: '寅', h: 4, m: 30 },
  { zhi: '卯', h: 6, m: 30 }, { zhi: '辰', h: 8, m: 30 }, { zhi: '巳', h: 10, m: 30 },
  { zhi: '午', h: 12, m: 30 }, { zhi: '未', h: 14, m: 30 }, { zhi: '申', h: 16, m: 30 },
  { zhi: '酉', h: 18, m: 30 }, { zhi: '戌', h: 20, m: 30 }, { zhi: '亥', h: 22, m: 30 },
];

function summarize(R) {
  const c = R.chart;
  return {
    score: R.synthesis?.score ?? null,
    grade: R.synthesis?.grade ?? '',
    gradeVi: R.synthesis?.gradeVi ?? '',
    fortune: R.synthesis?.fortune ?? '',
    fortuneVi: R.synthesis?.fortuneVi ?? '',
    pattern: R.pattern?.vi ?? R.pattern?.name ?? '',
    patternName: R.pattern?.name ?? '',
    dayGan: c.dayGan,
    strength: R.strength?.strong ? 'vượng' : 'nhược',
    yong: R.yong?.primary ?? '',
    gejuQuality: R.patternQuality?.quality ?? '',
    pillars: ['year', 'month', 'day', 'time'].map((k) => c.pillars[k].gan + c.pillars[k].zhi),
  };
}

/**
 * Tìm lá số Bát Tự có điểm Tổng Mệnh cực đại / cực tiểu (hoặc gần target) trong cửa sổ.
 * @param {object} opts
 * @param {number} [opts.refYear] năm tham chiếu (đại vận/niện), default = năm hiện tại
 * @param {number} [opts.yearStart] năm bắt đầu quét (default refYear)
 * @param {number} [opts.yearEnd] năm kết thúc quét (default yearStart)
 * @param {number} [opts.stepDays] bước nhảy ngày (default 3)
 * @param {string[]} [opts.genders] default ['nam','nu']
 * @param {number} [opts.topK] số lá số top/bottom (default 5)
 * @param {number} [opts.maxSamples] giới hạn an toàn (default 6000)
 * @param {number|null} [opts.target] nếu set → tìm lá số gần điểm này nhất
 * @param {function|null} [opts.onProgress] (fraction, currentBest) callback tiến độ
 * @returns {{ scanned, durationMs, refYear, window, max, min, topK, bottomK, nearestToTarget, histogram, scoreStats }}
 */
export function inverseBaZiSolve(opts = {}) {
  const refYear = opts.refYear ?? new Date().getFullYear();
  const yearStart = opts.yearStart ?? refYear;
  const yearEnd = opts.yearEnd ?? yearStart;
  const stepDays = Math.max(1, opts.stepDays ?? 3);
  const genders = opts.genders ?? ['nam', 'nu'];
  const topK = opts.topK ?? 5;
  const maxSamples = opts.maxSamples ?? 6000;
  const target = opts.target ?? null;
  const targetYong = opts.targetYong ?? null; // [loop 229] filter by desired 用神 element
  const onProgress = opts.onProgress ?? null;

  // Liệt kê (y,m,d) trong window
  const days = [];
  for (let y = yearStart; y <= yearEnd; y++) {
    const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    const dim = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (let m = 0; m < 12; m++) {
      for (let d = 1; d <= dim[m]; d += stepDays) days.push([y, m + 1, d]);
    }
  }
  // days × 12时辰 × genders
  let samples = [];
  for (const [y, m, d] of days) {
    for (const sc of SHICHEN_HOURS) {
      for (const g of genders) samples.push({ y, m, d, h: sc.h, min: sc.m, g, shichen: sc.zhi });
    }
  }
  if (samples.length > maxSamples) {
    const stride = Math.ceil(samples.length / maxSamples);
    samples = samples.filter((_, i) => i % stride === 0);
  }

  const results = [];
  let best = null, worst = null, nearest = null;
  const t0 = Date.now();
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    let R;
    try { R = analyze(s.y, s.m, s.d, s.h, s.min, s.g, refYear); } catch (e) { continue; }
    const score = R.synthesis?.score;
    if (score == null) continue;
    const entry = { ...s, ...summarize(R) };
    results.push(entry);
    if (!best || score > best.score) best = entry;
    if (!worst || score < worst.score) worst = entry;
    if (target != null && (!nearest || Math.abs(score - target) < Math.abs(nearest.score - target))) nearest = entry;
    if (onProgress && i % 200 === 0) onProgress(i / samples.length, best);
  }
  const durationMs = Date.now() - t0;

  results.sort((a, b) => b.score - a.score);
  // [loop 229] nếu targetYong → chỉ giữ lá số có Dụng = hành mong muốn, rank lại
  if (targetYong) {
    const filtered = results.filter((r) => r.yong === targetYong);
    const top = filtered.slice(0, topK);
    return {
      scanned: results.length, totalPossible: samples.length, durationMs,
      refYear, window: `${yearStart}${yearEnd !== yearStart ? '-' + yearEnd : ''}`, stepDays, maxSamples,
      targetYong,
      max: filtered[0] || null, min: filtered[filtered.length - 1] || null,
      topK: top, bottomK: filtered.slice(-topK).reverse(),
      scoreStats: {
        mean: +(filtered.reduce((s, r) => s + r.score, 0) / (filtered.length || 1)).toFixed(1),
        min: filtered.length ? filtered[filtered.length - 1].score : null,
        max: filtered.length ? filtered[0].score : null,
      },
      note: `Lọc ${filtered.length}/${results.length} lá số có Dụng Thần = ${targetYong} (trong ${results.length} lá số đạt). ${filtered.length ? 'Đây là ngày sinh THỰC SỰ có bát tự mong muốn.' : 'Không tìm thấy lá số nào có Dụng ' + targetYong + ' trong khoảng quét — thử rộng hơn.'}`,
    };
  }
  const top = results.slice(0, topK);
  const bottom = results.slice(-topK).reverse();

  const buckets = Array(10).fill(0);
  for (const r of results) buckets[Math.max(0, Math.min(9, Math.floor(r.score / 10)))]++;

  return {
    scanned: results.length,
    totalPossible: samples.length,
    durationMs,
    refYear,
    window: `${yearStart}${yearEnd !== yearStart ? '-' + yearEnd : ''}`,
    stepDays,
    max: best,
    min: worst,
    topK: top,
    bottomK: bottom,
    nearestToTarget: target != null ? nearest : null,
    histogram: buckets.map((count, i) => ({ range: `${i * 10}-${i * 10 + 9}`, count })),
    scoreStats: {
      mean: +(results.reduce((s, r) => s + r.score, 0) / (results.length || 1)).toFixed(1),
      min: worst?.score ?? null,
      max: best?.score ?? null,
    },
  };
}

/** Nhãn dễ đọc cho 1 kết quả. */
export function labelResult(r) {
  if (!r) return '(không có)';
  return `${r.y}-${String(r.m).padStart(2, '0')}-${String(r.d).padStart(2, '0')} | ${r.g === 'nam' ? 'Nam' : 'Nữ'} | giờ ${r.shichen}(${String(r.h).padStart(2, '0')}:${String(r.min).padStart(2, '0')}) | ${r.pillars.join(' ')} | ${r.score}đ · ${r.gradeVi} · ${r.pattern}${r.gejuQuality ? ' (' + r.gejuQuality + ')' : ''}`;
}

export { SHICHEN_HOURS };
