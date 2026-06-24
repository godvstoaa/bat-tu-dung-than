// ============================================================================
//  ĐẠI VẬN XẾP HẠNG 大运排名 — TỐT → XẤU
//  Tổng hợp: rating (Dụng Thần) + thập thần cat/hung + tương tác nhật trụ
//  → so sánh trực quan 8 thập niên.
//  Nguồn: 滴天髓 运论, 渊海子平 大运比较.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { tenGod } from './core.js';
import { GOD_DECADE } from './dayun-god.js';

const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };

const CAT_BOOST = { cat: 15, volatile: -5, hung: -10, mid: 0 };

/**
 * @returns {{ ranked:[{ ganZhi, startAge, rank, totalScore, ratingScore, godCat, godVi,
 *            interaction, interactionNote, summary }], best, worst }}
 */
export function rankDayun(R) {
  const { chart, yong, dayun } = R;
  const dayGan = chart.dayGan;
  const dayZhi = chart.pillars.day.zhi;

  const items = (dayun || []).map((d) => {
    // 1. Base score from Dụng Thần rating
    let score = d.score * 10; // existing -4..+3 → -40..+30

    // 2. 十神 cat/hung
    const god = tenGod(dayGan, d.gan);
    const godInfo = GOD_DECADE[god] || { cat: 'mid' };
    score += CAT_BOOST[godInfo.cat] || 0;
    const godVi = TEN_GOD_VI[god] || god;

    // 3. Tương tác nhật trụ
    let interaction = '';
    let intScore = 0;
    if (d.ganZhi === dayGan + dayZhi) { interaction = '伏吟'; intScore -= 5; }
    else if (CHONG[d.zhi] === dayZhi) {
      // [cycle 48 C2] 天克地冲 bidirectional — cả 克入(官杀) LẪN 克出(财).
      const godClash = ['七殺', '正官', '正財', '偏財'].includes(god);
      if (godClash) { interaction = '⚡天克地冲(反吟)'; intScore -= 15; }
      else { interaction = '⚡地冲'; intScore -= 8; } // chỉ xung chi, can không khắc = 地冲 (không phải 反吟)
    }
    else if (d.gan === dayGan) { interaction = '同气'; intScore += 3; }
    score += intScore;

    // [cycle 48 M1] bỏ bước "Dụng Thần match" riêng — d.score (từ computeDaYun, ×10 ở bước 1) ĐÃ
    //   bao gồm khớp Dụng cho cả can LẪN chi. Trước đây cộng thêm +8 can → đếm KÉP (can 28, chi 10),
    //   lệch + tổng score/band không tin cậy. Nay chỉ dựa d.score*10 + CAT_BOOST + tương tác.

    return {
      ganZhi: d.ganZhi, startAge: d.startAge, rating: d.rating,
      totalScore: Math.round(score),
      ratingScore: d.score,
      god, godVi, godCat: godInfo.cat,
      godTheme: godInfo.theme || '',
      interaction, intScore,
      summary: `${d.ganZhi} [${d.startAge}-${d.startAge + 9}t] ${godVi}(${godInfo.cat}) ${d.rating}${interaction ? ' ' + interaction : ''} → ${score > 20 ? 'RẤT TỐT' : score > 5 ? 'TỐT' : score > -10 ? 'TRUNG BÌNH' : score > -25 ? 'KÉM' : 'XẤU'}`,
    };
  });

  // Xếp hạng
  const ranked = items.slice().sort((a, b) => b.totalScore - a.totalScore);
  ranked.forEach((r, i) => { r.rank = i + 1; });

  return {
    ranked,
    best: ranked[0] || null,
    worst: ranked[ranked.length - 1] || null,
  };
}
