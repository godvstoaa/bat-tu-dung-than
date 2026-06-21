// ============================================================================
//  HIỆU CHỈNH GIỜ SINH (校正时辰) — dùng cụm gia tộc để suy diễn/kiểm chứng
//  Người "giờ chưa rõ": thử 12 时辰 (giờ đại diện 0..22 bước 2), mỗi giờ tính
//  lại analyze() + chấm coherence cụm → rank. Trọng số thêm vai trò con vì
//  trụ Giờ = cung Tử Nữ (nhạy nhất với giờ sinh).
//  Nguồn: 校正时辰 qua gia tộc — 子女宫 = 时柱.
// ============================================================================
import { analyze } from './chart.js';
import { analyzeFamily } from './family.js';
import { ZHI } from './constants.js';

const ZHI_BY_HOUR = { 0: '子', 2: '丑', 4: '寅', 6: '卯', 8: '辰', 10: '巳', 12: '午', 14: '未', 16: '申', 18: '酉', 20: '戌', 22: '亥' };

/**
 * @param center {R,label?}               (chủ thể, giờ đã rõ)
 * @param member {role,label,R}           R.chart.input dùng lấy y/m/d + gender (chỉ đổi giờ)
 * @param otherMembers [{role,label,R}]   người thân khác (giờ đã rõ)
 * @returns {{ candidates:[{hour,zhi,zhiVi,familyScore,score,delta}], best, verdict }}
 */
export function rectifyHour(center, member, otherMembers = []) {
  const inp = member.R.chart.input;
  const candidates = [];
  for (const hour of [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]) {
    const R = analyze(inp.year, inp.month, inp.day, hour, 0, inp.gender);
    const members = [{ role: member.role, label: member.label, R }, ...otherMembers];
    const fam = analyzeFamily(center, members);
    // nhấn mạnh vai trò con (trụ Giờ = cung Tử Nữ): nếu member là con, reciprocity child加权
    let childBoost = 0;
    const childPair = fam.pairs.find((p) => p.role === 'child');
    if (childPair) childBoost = (childPair.pair.axes.reciprocity.score - 50) * 0.2;
    const score = Math.round(fam.score + childBoost);
    candidates.push({ hour, zhi: ZHI_BY_HOUR[hour], zhiVi: ZHI[ZHI_BY_HOUR[hour]].vi, familyScore: fam.score, score, delta: 0 });
  }
  candidates.sort((a, b) => b.score - a.score);
  const top = candidates[0].score;
  candidates.forEach((c) => { c.delta = c.score - top; });
  const best = candidates[0];
  const second = candidates[1];
  const clear = best.score - (second ? second.score : 0) >= 4;
  const verdict = clear
    ? `Giờ ${best.zhiVi} (${best.hour}h) cho điểm nhất quán cao nhất (${best.score}), hơn giờ nhì ${best.score - (second ? second.score : 0)} điểm → khả năng cao đây là giờ sinh thật.`
    : `Nhiều giờ cho điểm gần nhau (top ${best.score}, nhì ${second ? second.score : '?'}). Giờ khó phân biệt rõ — cần thêm dữ kiện (số anh chị em, sự kiện đời).`;
  return { candidates: candidates.slice(0, 5), best, verdict };
}
