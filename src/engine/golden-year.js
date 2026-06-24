// ============================================================================
//  NĂM VÀNG 黄金年 — QUÉT 10 NĂM, XẾP HẠNG TOÀN HỆ THỐNG
//  Tìm năm TỐT NHẤT nên tiến thủ lớn — tổng hợp 6 hệ thống timing.
//  Nguồn: tổng hợp từ các module timing.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { analyzeLiunianDeep } from './liunian-pro.js';
import { liunian12Shen } from './liunian-shen.js';
import { ziweiLiunian } from './ziwei-liunian.js';
import { personalTaSui } from './taisui.js';
import { dayunGodMeaning } from './dayun-god.js';
import { suiyunCheck } from './suiyun.js';
import { GAN } from './constants.js';
import { tenGod } from './core.js';

/**
 * @returns {{ ranked:[{year, totalScore, details, alert, rank}], golden, worst }}
 */
export function findGoldenYear(R, startYear, scanYears = 10) {
  const { chart, dayun } = R;
  const birthZhi = chart.pillars.year.zhi;
  const birthYear = chart.input.year;
  const results = [];

  // Đại vận đang hành — chỉ lấy dayun nếu user đã thực sự bước vào giai đoạn đó
  const age0 = startYear - birthYear;
  const activeDy = (dayun || []).find((d) => age0 >= d.startAge && age0 < d.startAge + 10) || null;
  const dyGanZhi = activeDy?.ganZhi || '?';

  for (let i = 0; i < scanYears; i++) {
    const year = startYear + i;
    let totalScore = 0;
    const details = [];

    // 1. Lưu niên 6 phái (weight: 40%)
    const ln = analyzeLiunianDeep(R, year);
    const lnScore = ln.score; // 2-98
    totalScore += lnScore * 0.4;
    details.push(`6 phái: ${ln.rating} (${lnScore})`);

    // 2. 12 thần (weight: 15%)
    const yearZhi = Solar.fromYmdHms(year, 6, 15, 12, 0, 0).getLunar().getYearZhi();
    const s12 = liunian12Shen(birthZhi, yearZhi);
    const s12Score = s12.god.tone === 'cat' ? 80 : s12.god.tone === 'hung' ? 30 : 50;
    totalScore += s12Score * 0.15;
    details.push(`12 thần: ${s12.god.zh} (${s12.god.tone})`);

    // 3. Thái tuế (weight: 20%)
    const ts = personalTaSui(birthZhi, yearZhi);
    const tsScore = ts?.offends ? 20 : 75;
    totalScore += tsScore * 0.20;
    if (ts?.offends) details.push(`⚠ Phạm thái tuế`);

    // 4. Tuế vận tương tác (weight: 10%)
    const sy = suiyunCheck(dyGanZhi, year, ln.ganZhi);
    const syScore = sy ? (sy.severity >= 2 ? 25 : sy.severity >= 1 ? 50 : 60) : 60;
    totalScore += syScore * 0.10;
    if (sy?.severity >= 2) details.push(`⚡ Tuế vận: ${sy.type}`);

    // 5. Đại vận god (weight: 15%)
    const age = year - birthYear;
    const dg = dayunGodMeaning(chart, dayun);
    const activeDg = dg.items.find((d) => age >= d.startAge && age < d.startAge + 10);
    const dyCat = activeDg?.cat || 'mid';
    const dyScore = dyCat === 'cat' ? 75 : dyCat === 'hung' ? 30 : 50;
    totalScore += dyScore * 0.15;
    details.push(`Đại vận: ${activeDg?.godVi || '?'} (${dyCat})`);

    const alert = totalScore >= 60 ? '🟢 TỐT' : totalScore >= 48 ? '🟡 TRUNG' : '🔴 KÉM';
    results.push({ year, ganZhi: ln.ganZhi, totalScore: Math.round(totalScore), details, alert });
  }

  // Xếp hạng
  const ranked = results.slice().sort((a, b) => b.totalScore - a.totalScore);
  ranked.forEach((r, i) => { r.rank = i + 1; });

  return {
    ranked,
    golden: ranked[0] || null,
    worst: ranked[ranked.length - 1] || null,
  };
}
