// ============================================================================
//  LƯU NHẬT CẢ NĂM (流日整年) — luận TỪNG NGÀY của BẤT KỲ năm nào
//  Wrap analyzeLiuRi (lưu nhật 1 ngày) + thêm ngữ cảnh LƯU NĂM & ĐẠI VẬN
//  (theo 流日论断: lưu nhật tương tác lưu năm/đại vận → 合 thì cát, 冲 thì hung).
//  Nền R phải là lá số ĐÃ NGHIỆM CHỨNG/hiệu chỉnh (đặc biệt trụ Giờ) để chuẩn.
//  Nguồn: 知乎 流年吉凶 · 凤凰 流月论断 · 算准网 流年流月流日分析.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { analyzeLiuRi } from './liuri.js';

// ---- Tương tác can-chi (天干五合 / 地支六合 / 六冲) ----
const GAN_HE = { 甲己: 1, 乙庚: 1, 丙辛: 1, 丁壬: 1, 戊癸: 1 };
const ZHI_LIUHE = ['子丑', '寅亥', '卯戌', '辰酉', '巳申', '午未'];
const CHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };

// Mức tương tác của LƯU NGÀY (dgz) với một Gan-Zhi tham chiếu (đại vận hoặc lưu năm)
function interact(dgz, ref) {
  let d = 0; const notes = [];
  const pair = dgz.gan + ref.gan;
  if (GAN_HE[pair] || GAN_HE[pair.split('').reverse().join('')]) { d += 3; notes.push(`Can hợp ${ref.gan}`); }
  if (CHONG[dgz.zhi] === ref.zhi) { d -= 4; notes.push(`Chi xung ${ref.zhi}`); }
  if (ZHI_LIUHE.some((p) => (p[0] === dgz.zhi && p[1] === ref.zhi) || (p[0] === ref.zhi && p[1] === dgz.zhi))) { d += 3; notes.push(`Chi lục hợp ${ref.zhi}`); }
  return { d, notes };
}

const GAN_ORDER = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// Lưu năm Can-Chi (công thức chu kỳ 60甲子, không cần thư viện)
export function liunianGanZhi(year) {
  const g = GAN_ORDER[((year - 4) % 10 + 10) % 10];
  const z = ZHI_ORDER[((year - 4) % 12 + 12) % 12];
  return { gan: g, zhi: z, ganZhi: g + z };
}

// Đại vận đang hành trong `year` (từ R.dayun)
function activeDayun(R, year) {
  return (R.dayun || []).find((d) => year >= d.startYear && year < d.startYear + 10) || null;
}

function ratingOf(score) {
  if (score >= 64) return 'Cát';
  if (score >= 50) return 'Bình';
  if (score >= 38) return 'Hơi kỵ';
  return 'Kỵ';
}

/**
 * Luận từng ngày của cả `year`.
 * @param R kết quả analyze() của người trung tâm (nền đã nghiệm chứng/hiệu chỉnh)
 * @param year năm bất kỳ (quá khứ/tương lai)
 * @returns {{ year, dayun, liunian, days:[{date,month,day,ganZhi,ganGod,score,rating,baseNote,ctx:[]}],
 *            monthSummary:[{month,avg,catCount,kyCount,count}], best:[], worst:[] }}
 */
export function computeYearDaily(R, year) {
  const dayun = activeDayun(R, year);
  const ln = liunianGanZhi(year);
  const days = [];
  let cur = Solar.fromYmdHms(year, 1, 1, 12, 0, 0);
  while (cur.getYear() === year) {
    const y = cur.getYear(), m = cur.getMonth(), d = cur.getDay();
    let base;
    try { base = analyzeLiuRi(R, y, m, d); } catch (e) { cur = cur.next(1); continue; }
    const dgz = { gan: base.ganZhi[0], zhi: base.ganZhi[1] };
    let ctxD = 0; const ctx = [];
    const withLn = interact(dgz, ln);
    ctxD += withLn.d; withLn.notes.forEach((n) => ctx.push('lưu năm: ' + n));
    if (dayun) {
      const withDy = interact(dgz, { gan: dayun.gan, zhi: dayun.zhi });
      ctxD += withDy.d; withDy.notes.forEach((n) => ctx.push('đại vận: ' + n));
    }
    const score = Math.max(5, Math.min(95, base.score + ctxD));
    days.push({
      date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      weekday: cur.getWeek(), month: m, day: d,
      ganZhi: base.ganZhi, ganGod: base.ganGod, score, rating: ratingOf(score),
      baseNote: base.advice, ctx,
    });
    cur = cur.next(1);
  }

  // Tổng hợp theo tháng
  const byMonth = {};
  for (const dd of days) (byMonth[dd.month] = byMonth[dd.month] || []).push(dd);
  const monthSummary = Object.keys(byMonth).map(Number).sort((a, b) => a - b).map((mk) => {
    const arr = byMonth[mk];
    const avg = arr.reduce((a, x) => a + x.score, 0) / arr.length;
    return { month: mk, avg: +avg.toFixed(1), catCount: arr.filter((x) => x.rating === 'Cát').length, kyCount: arr.filter((x) => x.rating === 'Kỵ').length, count: arr.length };
  });

  const sorted = [...days].sort((a, b) => b.score - a.score);
  return {
    year, dayun, liunian: ln, days, monthSummary,
    best: sorted.slice(0, 12),
    worst: sorted.slice(-12).reverse(),
    stats: {
      total: days.length,
      cat: days.filter((x) => x.rating === 'Cát').length,
      binh: days.filter((x) => x.rating === 'Bình').length,
      hoiky: days.filter((x) => x.rating === 'Hơi kỵ').length,
      ky: days.filter((x) => x.rating === 'Kỵ').length,
    },
  };
}
