// ============================================================================
//  Đo giật khung (công cụ phát triển): đoạn việc nào chiếm luồng chính > 8 ms thì ghi lại.
//  Xem trong console: __perf.top() — gộp theo tên, sắp theo tổng thời gian.
// ============================================================================
const spans = [];
const T0 = performance.now();

export function record(name, ms) {
  if (ms < 8) return;
  spans.push([name, Math.round(ms), Math.round(performance.now() - T0)]);
  if (spans.length > 2000) spans.shift();
}

/** Chạy fn, ghi tên nếu chậm. */
export function span(name, fn) {
  const t = performance.now();
  try { return fn(); } finally { record(name, performance.now() - t); }
}

if (typeof window !== 'undefined') {
  window.__perf = {
    spans,
    top() {
      const m = new Map();
      for (const [n, ms] of spans) { const e = m.get(n) || { n, count: 0, total: 0, max: 0 }; e.count++; e.total += ms; e.max = Math.max(e.max, ms); m.set(n, e); }
      return [...m.values()].sort((a, b) => b.total - a.total);
    },
  };
}
