// ============================================================================
//  ĐẠI VẬN XẾP HẠNG 大运排名 — TỐT → XẤU
//  Tổng hợp: rating (Dụng Thần) + thập thần cat/hung + tương tác nhật trụ
//  → so sánh trực quan 8 thập niên.
//  Nguồn: 滴天髓 运论, 渊海子平 大运比较.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { tenGod, changSheng } from './core.js';
import { GOD_DECADE } from './dayun-god.js';

const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };
// [loop 1018 FIX] 六合 — đại vận chi LỤC HỢP Nhật Chi = thập niên thuận hoà (reward, đối xứng 冲罚).
//   Cùng bug-class loop 1014-1016, nay ở lõi dayun ranking.
const LIUHE = { 子:'丑', 丑:'子', 寅:'亥', 亥:'寅', 卯:'戌', 戌:'卯', 辰:'酉', 酉:'辰', 巳:'申', 申:'巳', 午:'未', 未:'午' };
// [loop 1042] 三合 bán-hợp — đại vận chi cùng cụm 三合 với Nhật Chi = «半合» (yếu hơn 六 hợp).
const SANHE = [['申','子','辰'],['亥','卯','未'],['寅','午','戌'],['巳','酉','丑']];

const CAT_BOOST = { cat: 15, volatile: -5, hung: -10, mid: 0 };

// [loop 1079] 十二長生 SINH KHÍ vận — «运好不如运旺»: đại vận Dụng cát NHƯNG rơi 死/墓/绝
//   thì Dụng khó phát huy; 帝旺/臨官 thì khuếch đại. Modifier CỘNG vào totalScore.
//   Nguồn: 滴天髓 «运逢长生如苗逢春, 运逢帝旺如日中天, 运逢墓绝如秋冬».
//   Cân đối: 帝旺=đỉnh nhưng quá vượng dễ kiêu → +8 (không +10); 墓=kho thu nạp → nhẹ hơn 死/绝.
const STAGE_WEIGHT = {
  '帝旺': 8, '臨官': 8, '長生': 6, '冠帶': 5,
  '衰': -3, '病': -5, '死': -6, '墓': -4, '絕': -7,
  '沐浴': 0, '胎': 0, '養': 0,
};
const STAGE_VI = {
  '長生': 'Trường Sinh', '沐浴': 'Mộc Dục', '冠帶': 'Quan Đới', '臨官': 'Lâm Quan',
  '帝旺': 'Đế Vượng', '衰': 'Suy', '病': 'Bệnh', '死': 'Tử', '墓': 'Mộ',
  '絕': 'Tuyệt', '胎': 'Thai', '養': 'Dưỡng',
};

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
    let score = d.score * 10; // [loop 71 sửa comment] range thật -3..+3 (can±2 + chi±1, chart.js:366-369) → -30..+30

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
      // [loop 59 sửa] 天克 = GAN_CHONG (4 cặp thất sát), KHÔNG phải tenGod ∈ {七殺,正官,正財,偏財}.
      //   Cùng bug fuyin.js L19 + dayun-check.js: tenGod-based 克 → 384 false positive.
      const GANCHONG = { 甲:'庚', 庚:'甲', 乙:'辛', 辛:'乙', 丙:'壬', 壬:'丙', 丁:'癸', 癸:'丁' };
      if (GANCHONG[dayGan] === d.gan) { interaction = '⚡天克地冲(反吟)'; intScore -= 15; }
      else { interaction = '⚡地冲'; intScore -= 8; }
    }
    else if (d.gan === dayGan) { interaction = '同气'; intScore += 3; }
    // [loop 1018] 六合 — đại vận chi lục hợp Nhật Chi → thuận hoà (reward, đối xứng 地冲 −8).
    if (!interaction && LIUHE[d.zhi] === dayZhi) { interaction = '💕合日'; intScore += 6; }
    // [loop 1042] 三合 bán-hợp — cùng cụm 三合 (nếu chưa 六 hợp) → thuận nhẹ.
    else if (!interaction && d.zhi !== dayZhi && SANHE.some((g) => g.includes(d.zhi) && g.includes(dayZhi))) { interaction = '🔗半合日'; intScore += 4; }
    score += intScore;

    // [loop 1079] 4. 十二長生 SINH KHÍ — Nhật Chủ ở giai đoạn nào của vòng 12長生 khi入 vận.
    //   Độc lập với Dụng/十神/冲合: «运好不如运旺» — vận Dụng TỐT nhưng 死/墓/绝 → sinh khí kém,
    //   Dụng khó phát huy; 帝旺/臨官 → sinh khí dồi dào, khuếch đại vận (dù Dụng trung tính).
    const stage = d.zhi ? changSheng(dayGan, d.zhi) : '';
    const stageW = STAGE_WEIGHT[stage] || 0;
    const stageVi = STAGE_VI[stage] || stage || '';
    score += stageW;

    // [cycle 48 M1] bỏ bước "Dụng Thần match" riêng — d.score (từ computeDaYun, ×10 ở bước 1) ĐÃ
    //   bao gồm khớp Dụng cho cả can LẪN chi. Trước đây cộng thêm +8 can → đếm KÉP (can 28, chi 10),
    //   lệch + tổng score/band không tin cậy. Nay chỉ dựa d.score*10 + CAT_BOOST + tương tác + 长生.

    return {
      ganZhi: d.ganZhi, startAge: d.startAge, rating: d.rating,
      totalScore: Math.round(score),
      ratingScore: d.score,
      god, godVi, godCat: godInfo.cat,
      godTheme: godInfo.theme || '',
      interaction, intScore,
      stage, stageVi, stageWeight: stageW,
      summary: `${d.ganZhi} [${d.startAge}-${d.startAge + 9}t] ${godVi}(${godInfo.cat}) ${d.rating}${stageVi ? ' · ' + stageVi : ''}${interaction ? ' ' + interaction : ''} → ${score > 20 ? 'RẤT TỐT' : score > 5 ? 'TỐT' : score > -10 ? 'TRUNG BÌNH' : score > -25 ? 'KÉM' : 'XẤU'}`,
    };
  });

  // Xếp hạng
  const ranked = items.slice().sort((a, b) => b.totalScore - a.totalScore);
  ranked.forEach((r, i) => { r.rank = i + 1; });

  return {
    ranked,
    // [loop 1078] scored = items theo thứ tự gốc (cùng index với R.dayun) — để biểu đồ/
    //   sparkline dùng totalScore giàu logic (Dụng+十神+冲合+伏吟) thay vì raw d.score.
    scored: items,
    best: ranked[0] || null,
    worst: ranked[ranked.length - 1] || null,
  };
}
