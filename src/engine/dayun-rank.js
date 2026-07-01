// ============================================================================
//  ĐẠI VẬN XẾP HẠNG 大运排名 — TỐT → XẤU
//  Tổng hợp: rating (Dụng Thần) + thập thần cat/hung + tương tác nhật trụ
//  → so sánh trực quan 8 thập niên.
//  Nguồn: 滴天髓 运论, 渊海子平 大运比较.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { tenGod, changSheng } from './core.js';
import { GOD_DECADE } from './dayun-god.js';
// [loop 1080] trọng số 十二长生 dùng chung (canonical ở dayun-changsheng) — rankDayun + analyzeLiunianDeep.
import { STAGE_WEIGHT, STAGE_VI } from './dayun-changsheng.js';
// [loop 1081] 盖头/截脚 pillar-strength — quan hệ can-chi nội tại trụ đại vận.
import { pillarRelation } from './pillar-quality.js';

const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };
// [loop 1018 FIX] 六合 — đại vận chi LỤC HỢP Nhật Chi = thập niên thuận hoà (reward, đối xứng 冲罚).
//   Cùng bug-class loop 1014-1016, nay ở lõi dayun ranking.
const LIUHE = { 子:'丑', 丑:'子', 寅:'亥', 亥:'寅', 卯:'戌', 戌:'卯', 辰:'酉', 酉:'辰', 巳:'申', 申:'巳', 午:'未', 未:'午' };
// [loop 1042] 三合 bán-hợp — đại vận chi cùng cụm 三合 với Nhật Chi = «半合» (yếu hơn 六 hợp).
const SANHE = [['申','子','辰'],['亥','卯','未'],['寅','午','戌'],['巳','酉','丑']];

const CAT_BOOST = { cat: 15, volatile: -5, hung: -10, mid: 0 };
// [loop 1080] STAGE_WEIGHT/STAGE_VI giờ dùng chung từ dayun-changsheng.js (xem import).

/**
 * @returns {{ ranked:[{ ganZhi, startAge, rank, totalScore, ratingScore, godCat, godVi,
 *            interaction, interactionNote, summary }], best, worst }}
 */
export function rankDayun(R) {
  const { chart, yong, dayun } = R;
  const dayGan = chart.dayGan;
  const dayZhi = chart.pillars.day.zhi;
  const monthZhi = chart.pillars.month.zhi; // [loop 1107] 提纲 (sự nghiệp/cơ nghiệp)
  const yearZhi = chart.pillars.year.zhi;   // [loop 1107] 本命 (gia căn/trưởng bối)

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
    // [loop 1107] 冲/合 月柱(提纲) + 年柱(本命) — cổ法: «运冲提纲动摇事业根基», «冲本命伤长辈/根».
    //   Mỗi chi chỉ có 1 đối 冲 → dayun chi 冲 ĐÚNG 1 trong {日,月,年} trụ (loại trừ nhau).
    else if (!interaction && CHONG[d.zhi] === monthZhi) { interaction = '⚡冲提纲(月)'; intScore -= 6; }
    else if (!interaction && CHONG[d.zhi] === yearZhi) { interaction = '⚡冲本命(年)'; intScore -= 4; }
    else if (!interaction && LIUHE[d.zhi] === monthZhi) { interaction = '💕合月(提纲)'; intScore += 5; }
    else if (!interaction && LIUHE[d.zhi] === yearZhi) { interaction = '💕合年(本命)'; intScore += 4; }
    score += intScore;

    // [loop 1079→1080] 4. 十二長生 SINH KHÍ — Nhật Chủ ở giai đoạn nào của vòng 12長生 khi入 vận.
    //   «运好不如运旺»: sinh khí KHUẾCH ĐẠI khuynh hướng sẵn có (amplify-from-0, cùng semantics
    //   analyzeLiunianDeep loop 1080) — KHÔNG phải boost độc lập. Vận TỐT ở 帝旺 → thêm tốt;
    //   vận XẤU ở 帝旺 → Kỵ phát mạnh (thêm xấu), KHÔNG «bớt xấu». 死/墓/绝 → co lực (dampen).
    //   Fix loop 1080: additive cũ (score += stageW) lệch hướng ở decade Kỵ.
    const stage = d.zhi ? changSheng(dayGan, d.zhi) : '';
    const stageW = STAGE_WEIGHT[stage] || 0;
    const stageVi = STAGE_VI[stage] || stage || '';
    if (stageW) score = Math.round(score * (1 + stageW / 100)); // 帝旺 ×1.08 … 衰 ×0.97 … 绝 ×0.93

    // [loop 1081] 盖头/截脚 pillar-strength — «盖头截脚其力减半»: can-chi trụ vận KHẮC nhau →
    //   khí không thông, lực vận giảm; SINH/Bỉ hoà → khí thông, lực đầy. Amplify (cùng mô hình
    //   1080): trụ hài hoà khuếch đại khuynh hướng, trụ 盖头/截脚 co lực (vận khó phát huy).
    const _rel = (d.gan && d.zhi) ? pillarRelation({ gan: d.gan, zhi: d.zhi }) : { type: '', vi: '', flow: 0 };
    const _psFactor = _rel.flow > 0 ? 1.04 : _rel.flow < 0 ? 0.92 : 1.0;
    if (_psFactor !== 1) score = Math.round(score * _psFactor);

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
      pillarStrength: _rel.type, pillarStrengthVi: _rel.vi, pillarFlow: _rel.flow,
      summary: `${d.ganZhi} [${d.startAge}-${d.startAge + 9}t] ${godVi}(${godInfo.cat}) ${d.rating}${stageVi ? ' · ' + stageVi : ''}${_rel.type && _rel.type !== '?' ? ' · ' + _rel.type : ''}${interaction ? ' ' + interaction : ''} → ${score > 20 ? 'RẤT TỐT' : score > 5 ? 'TỐT' : score > -10 ? 'TRUNG BÌNH' : score > -25 ? 'KÉM' : 'XẤU'}`,
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
