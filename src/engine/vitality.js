// ============================================================================
//  SINH LỰC LUẬN 生命力论 — VITALITY TRAJECTORY OVER LIFE
//  Khác health-analysis.js (tạng phủ): tập trung SINH LỰC (vitality) theo thời gian.
//  Đánh giá đỉnh/đáy sinh lực qua các đại vận → biết giai đoạn mạnh/yếu nhất.
//  Nguồn: 滴天髓 气势, 黄帝内经 生命节律.
// ============================================================================
import { GAN, ZHI, WX_VI } from './constants.js';
import { tenGod } from './core.js';

/**
 * @returns {{ currentVitality, peakAge, lowAge, trajectory:[{age, score, phase, note}],
 *            constitution, advice }}
 */
export function analyzeVitality(R) {
  const { chart, yong, wx, strength, dayun } = R;
  const dmWx = chart.dayMaster.wx;
  const total = wx.total || 1;

  // 1. Thể chất nền (constitution). [loop 32 V3] guard yong.primary thiếu → NaN.
  const yongWx = yong?.primary || dmWx;
  const dmScore = (wx.score[dmWx] / total) * 100;
  const yongScore = ((wx.score[yongWx] || 0) / total) * 100;
  const baseVitality = (dmScore * 0.4 + yongScore * 0.6); // yong weight higher

  // 2. Sinh lực qua từng đại vận
  const trajectory = (dayun || []).map((d) => {
    const ganWx = GAN[d.gan]?.wx;
    const zhiWx = ZHI[d.zhi]?.wx;
    const favSet = new Set([yong.primary, yong.xi].filter(Boolean));
    const avoidSet = new Set([yong.ji, yong.chou]);

    let score = 50;
    if (favSet.has(ganWx)) score += 12;
    if (favSet.has(zhiWx)) score += 8;
    if (avoidSet.has(ganWx)) score -= 12;
    if (avoidSet.has(zhiWx)) score -= 8;

    // Thập thần cat/hung ảnh hưởng sinh lực
    const god = tenGod(chart.dayGan, d.gan);
    const godBoost = { 正印: 8, 食神: 6, 正官: 4, 正財: 2, 偏印: -2, 偏財: 0, 比肩: 3, 劫財: -4, 傷官: -3, 七殺: -8 };
    score += godBoost[god] || 0;

    // Phase: giai đoạn cuộc đời
    const fromAge = d.startAge;
    let phase;
    if (fromAge < 15) phase = 'thiếu thời (nhi đồng — phát triển)';
    else if (fromAge < 25) phase = 'thanh xuân (học — khởi đầu)';
    else if (fromAge < 40) phase = 'tráng niên (sự nghiệp — đỉnh)';
    else if (fromAge < 55) phase = 'trung niên (thành tựu — ổn định)';
    else if (fromAge < 70) phase = 'vãn niên (thu hoạch — dưỡng sinh)';
    else phase = '暮年 (an nghỉ — tĩnh)';

    let note;
    if (score >= 65) note = 'Sinh lực CAO — năng lượng dồi dào, nên tận dụng';
    else if (score >= 45) note = 'Sinh lực TRUNG BÌNH — ổn định, duy trì';
    else note = 'Sinh lực THẤP — cần dưỡng sinh, giảm cường độ';

    return { age: `${d.startAge}-${d.startAge + 9}`, score: Math.max(10, Math.min(95, Math.round(score))), phase, note, ganZhi: d.ganZhi };
  });

  // 3. Đỉnh/đáy
  const peak = trajectory.reduce((a, b) => b.score > a.score ? b : a, trajectory[0] || { age: '?', score: 0 });
  const low = trajectory.reduce((a, b) => b.score < a.score ? b : a, trajectory[0] || { age: '?', score: 100 });

  // 4. Sinh lực hiện tại (dựa tuổi). [loop 32 V1] dùng năm tham chiếu (R.asOfYear/R.now) thay
  //   vì new Date() (wall-clock) — đảm bảo deterministic cho engine mệnh lý.
  const refYear = R.asOfYear || R.now || new Date().getFullYear();
  const curAge = refYear - chart.input.year;
  const current = trajectory.find((t) => {
    const [from, to] = t.age.split('-').map(Number);
    return curAge >= from && curAge <= to;
  }) || trajectory[0];

  // 5. Advice
  const advice = current
    ? current.score >= 60
      ? `Hiện tại (${current.age}t) sinh lực CAO — nên tận dụng làm việc lớn.`
      : current.score >= 45
        ? `Hiện tại (${current.age}t) sinh lực TRUNG — ổn định, duy trì nhịp độ.`
        : `Hiện tại (${current.age}t) sinh lực THẤP — giảm cường độ, dưỡng sinh, đợi đỉnh (${peak?.age}t).`
    : '';

  return {
    baseVitality: Math.round(baseVitality),
    constitution: `Nhật Chủ ${WX_VI[dmWx]} nền ${baseVitality.toFixed(0)}/100`,
    currentAge: curAge,
    currentVitality: current?.score || 0,
    currentPhase: current?.phase || '',
    peakAge: peak?.age || '?', peakScore: peak?.score || 0,
    lowAge: low?.age || '?', lowScore: low?.score || 0,
    trajectory, advice,
  };
}
