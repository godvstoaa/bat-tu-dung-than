// ============================================================================
//  ÂM TRẠCH SÂU — Đại Quái phối hợp + thời điểm hạ huyệt  [loop 634]
//  ----------------------------------------------------------------------------
//  Bổ sung 2 tầng THIẾU cho yinzhai.js/sittingDirectionAnalysis (chỉ có
//  Tam Hợp/SITTING_FORTUNE):
//    (A) Huyền Không Đại Quái: toạ-hướng phối hợp (合十/生成/同运/相生相克)
//    (B) Sát phương năm — Âm Trạch kỵ sat ở CẢ toạ LẪN hướng khi hạ huyệt.
//  Tách module riêng (không sửa yinzhai.js) để TRÁNH circular import
//    (xuankong-dagua.js đã import yinzhai.js → yinzhai không được import ngược lại).
//  ⚠ «Địa năng bổ thiên, bất năng thay thiên» — nâng nền Dụng, KHÔNG nghịch thiên.
// ============================================================================
import { MOUNTAINS_24, MOUNTAIN_MAP, oppositeMountain, sittingDirectionAnalysis } from './yinzhai.js';
import { daguaCompatibility } from './xuankong-dagua.js';
import { checkAnnualTaboo } from './annual-taboo.js';
import { sanshaDirection } from './sansha.js';

const QUAI_TO_PALACE8 = { 坎: 'Bắc', 艮: 'Đông Bắc', 震: 'Đông', 巽: 'Đông Nam', 离: 'Nam', 坤: 'Tây Nam', 兑: 'Tây', 乾: 'Tây Bắc' };
const WX_VI_LOCAL = { 水: 'Thủy', 土: 'Thổ', 木: 'Mộc', 火: 'Hỏa', 金: 'Kim' };
// [loop 635] CHONG map (đối cung 6 xung) cho Thái Tuế/Tuế Phá precise 24-sơn
const CHONG_ZHI = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };

/**
 * [loop 635 FIX] Sát phương ÂM TRẠCH — PRECISE 24-sơn (không 8-palace mù).
 *   checkAnnualTaboo chỉ xét 8 hướng → 三煞 亥(NW)/丑(NE) bị MISS, 壬/癸(Bắc nhưng
 *   không phải 亥子丑) bị FALSE flag. Âm Trạch cần exact sơn.
 *   - 三煞: 3 CHÍNH XÁC branches (vd 2026 亥子丑) — from sanshaDirection
 *   - Thái Tuế: exact year branch + 冲 (Tuế Phá) — 24-sơn
 *   - Ngũ Hoàng/Nhị Hắc: giữ 8-palace (phi tinh theo cung, đúng)
 */
function preciseGraveSat(faceZhi, sitZhi, year) {
  const taboos = [];
  const faceP8 = QUAI_TO_PALACE8[MOUNTAIN_MAP[faceZhi].palace];
  const sitP8 = QUAI_TO_PALACE8[MOUNTAIN_MAP[sitZhi].palace];
  // (1) 三煞 precise — check cả toạ + hướng vs 3 branches chính xác
  const ss = sanshaDirection(year);
  const sanshaChis = new Set((ss.sansha || []).map((s) => s.chi));
  const ssNames = {};
  for (const s of (ss.sansha || [])) ssNames[s.chi] = s.name;
  for (const [zhi, at, p8] of [[sitZhi, 'toạ', sitP8], [faceZhi, 'hướng', faceP8]]) {
    if (sanshaChis.has(zhi)) {
      taboos.push({ at: `${at} ${zhi}(${p8})`, type: 'Tam Sát', detail: `${at} ${zhi} = ${ssNames[zhi]} (三煞 ${[...sanshaChis].join('')})`, severity: 4 });
    }
  }
  // (2) Thái Tuế/Tuế Phá precise — exact year branch + 冲
  const yearZhi = ss.yearZhi; // vd 午
  const suiPo = CHONG_ZHI[yearZhi]; // vd 子
  for (const [zhi, at, p8] of [[sitZhi, 'toạ', sitP8], [faceZhi, 'hướng', faceP8]]) {
    if (zhi === yearZhi) taboos.push({ at: `${at} ${zhi}(${p8})`, type: 'Thái Tuế', detail: `${at} ${zhi} = Thái Tuế năm (${yearZhi})`, severity: 3 });
    if (zhi === suiPo) taboos.push({ at: `${at} ${zhi}(${p8})`, type: 'Tuế Phá', detail: `${at} ${zhi} = Tuế Phá (đối Thái Tuế ${suiPo})`, severity: 4 });
  }
  // (3) Ngũ Hoàng/Nhị Hắc — 8-palace (phi tinh theo cung là đúng), mượn checkAnnualTaboo
  const faceTaboo8 = checkAnnualTaboo(faceP8, year);
  const sitTaboo8 = checkAnnualTaboo(sitP8, year);
  for (const t of faceTaboo8.taboos) {
    if (t.type === 'Ngũ Hoàng' || t.type === 'Nhị Hắc') taboos.push({ at: `hướng ${faceZhi}(${faceP8})`, ...t });
  }
  for (const t of sitTaboo8.taboos) {
    if (t.type === 'Ngũ Hoàng' || t.type === 'Nhị Hắc') taboos.push({ at: `toạ ${sitZhi}(${sitP8})`, ...t });
  }
  const maxSev = taboos.reduce((m, t) => Math.max(m, t.severity), 0);
  return { taboos, maxSeverity: maxSev };
}

/**
 * Luận hướng mộ SÂU: toạ-hướng Tam Hợc (cũ) + Đại Quái phối hợp + sát năm + Dụng.
 * @param {string} faceZhi — sơn HÁN hướng mộ (vd «午»). Toạ = đối cung tự động.
 * @param {object} R — analyze() chủ thể (lấy Dụng Thần dòng họ). Có thể null.
 * @param {number} scanYear — năm xem hạ huyệt.
 */
export function graveDirectionDeep(faceZhi, R, scanYear) {
  const year = scanYear || new Date().getFullYear();
  const faceMap = MOUNTAIN_MAP[faceZhi];
  if (!faceMap) return { error: `Sơn «${faceZhi}» không hợp lệ. 24 sơn: ${MOUNTAINS_24.map((m) => m.zhi).join(' ')}` };
  const sitObj = oppositeMountain(faceZhi);
  const sitZhi = sitObj?.zhi;
  if (!sitZhi) return { error: 'Không tính được toạ (đối cung).' };
  const legacy = sittingDirectionAnalysis(sitZhi);
  const dg = daguaCompatibility(sitZhi, faceZhi);
  const sitP8 = QUAI_TO_PALACE8[MOUNTAIN_MAP[sitZhi].palace];
  const faceP8 = QUAI_TO_PALACE8[faceMap.palace];
  // [loop 635] sat Âm Trạch PRECISE 24-sơn (tam sát + thái tuế exact, ngũ hoàng/nhị hắc 8-palace)
  const { taboos, maxSeverity: maxSev } = preciseGraveSat(faceZhi, sitZhi, year);

  // score (0-100): Đại Quái 40% + Tam Hợc legacy 40% + base 20%
  let score = Math.round(dg.score * 0.4 + (legacy?.score ?? 50) * 0.4 + 50 * 0.2);
  const layers = [];
  layers.push(`📐 Đại Quái phối hợp: toạ ${sitZhi} ⇔ hướng ${faceZhi} → ${dg.rating} (${dg.score}/100). ${(dg.rules || []).map((r) => r.type).join(', ') || 'phối bình thường'}.`);
  layers.push(`📜 Tam Hợc/SITTING_FORTUNE: toạ ${sitZhi} → ${legacy?.verdict || '?'} (${legacy?.score ?? '?'}/100).`);
  if (maxSev >= 5) { score -= 30; layers.push(`⛔ Năm ${year} phạm sat NẶNG: ${taboos.filter((t) => t.severity >= 5).map((t) => t.at + '=' + t.type).join(', ')} → KHÔNG hạ huyệt năm này.`); }
  else if (maxSev >= 3) { score -= 15; layers.push(`⚠ Năm ${year} phạm sat: ${taboos.filter((t) => t.severity >= 3).map((t) => t.at + '=' + t.type).join(', ')} → hạn chế, chờ năm khác.`); }
  else if (maxSev >= 1) { score -= 5; layers.push(`• Năm ${year}: ${taboos.map((t) => t.at + '=' + t.type).join(', ')} — nhẹ, chọn tháng cát.`); }
  else layers.push(`✓ Năm ${year}: toạ + hướng KHÔNG phạm sat lớn → thời điểm hạ huyệt ĐƯỢC.`);
  const dungWx = R?.yong?.primary;
  const faceWxVi = WX_VI_LOCAL[faceMap.wx];
  if (dungWx && faceWxVi && faceWxVi === dungWx) { score += 5; layers.push(`★ Ngũ hành hướng mộ (${faceWxVi}) = Dụng dòng họ (${dungWx}) → bổ nền.`); }

  score = Math.max(0, Math.min(100, Math.round(score)));
  let verdict, advice;
  if (maxSev >= 5) { verdict = 'ĐẠI KỴ (năm)'; advice = `Hướng mộ ${dg.rating} theo Đại Quái NHƯNG năm ${year} phạm sat nặng → CHỜ năm khác (sat dịch cung).`; }
  else if (score >= 72) { verdict = 'ĐẠI CÁT'; advice = `Hướng mộ rất tốt — Đại Quái ${dg.rating}${maxSev === 0 ? ', năm sạch sat' : ''}. Kết hợp thực địa long mạch.`; }
  else if (score >= 55) { verdict = 'CÁT'; advice = `Hướng mộ khá — Đại Quái ${dg.rating}. Dùng được, ưu tiên năm sạch sat.`; }
  else if (score >= 40) { verdict = 'BÌNH'; advice = `Hướng mộ trung — cân nhắc hướng khác.`; }
  else { verdict = 'KỴ'; advice = `Hướng mộ kém — Đại Quái không phối tốt. Chọn hướng khác.`; }

  return {
    face: faceZhi, faceVi: faceMap.vi, sit: sitZhi, facePalace: faceP8, sitPalace: sitP8, year,
    dagua: { score: dg.score, rating: dg.rating, rules: dg.rules },
    legacy: legacy ? { score: legacy.score, verdict: legacy.verdict } : null,
    taboos, maxSeverity: maxSev, score, verdict, advice, layers,
    summary: `Mộ toạ ${sitZhi} ⇔ hướng ${faceZhi} (${faceMap.vi}, ${faceP8}) năm ${year}: ${verdict}. Đại Quái ${dg.rating} ${dg.score} + Tam Hợc ${legacy?.score ?? '?'}.${maxSev ? ' Phạm sat: ' + taboos.map((t) => t.at).join('; ') : ' Sạch sat.'}`,
  };
}

/** Quét 24 sơn → recommend hướng mộ tốt nhất năm đó (Đại Quái + sạch sat). */
export function bestGraveDirectionDeep(R, scanYear) {
  const year = scanYear || new Date().getFullYear();
  const all = MOUNTAINS_24.map((m) => {
    const g = graveDirectionDeep(m.zhi, R, year);
    if (g.error) return null;
    return { face: m.zhi, faceVi: m.vi, sit: g.sit, palace: g.facePalace, score: g.score, verdict: g.verdict, maxSev: g.maxSeverity, dgRating: g.dagua.rating };
  }).filter(Boolean);
  all.sort((a, b) => b.score - a.score);
  const top = all[0], worst = all[all.length - 1];
  const clean = all.filter((d) => d.maxSev === 0);
  return {
    year,
    best: top ? { face: top.face, faceVi: top.faceVi, sit: top.sit, palace: top.palace, verdict: top.verdict, dgRating: top.dgRating, score: top.score } : null,
    top3: all.slice(0, 3).map((d) => `toạ${d.sit}⇔${d.face}${d.faceVi}(${d.palace}, ${d.dgRating}, ${d.verdict})`),
    worst: worst ? { face: worst.face, sit: worst.sit, verdict: worst.verdict } : null,
    cleanCount: clean.length,
    summary: top
      ? `Hướng mộ TỐT NHẤT năm ${year}: toạ ${top.sit} ⇔ hướng ${top.face} ${top.faceVi} (${top.palace}) — Đại Quái ${top.dgRating}, ${top.verdict}. ${clean.length ? clean.length + '/24 sơn năm nay SẠCH sat (hạ huyệt được).' : '⚠ Năm nay không sơn nào sạch sat hoàn toàn — hạn chế động thổ mộ.'}`
      : '(không tính được)',
    disclaimer: 'Âm Trạch nâng nền Dụng (5-10 điểm), KHÔNG «nghịch thiên» biến bát tự. Cần thầy thật biết long mạch/huyệt/phân kim + xem thực địa — app chỉ tham khảo hướng + thời điểm.',
  };
}
