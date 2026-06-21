// ============================================================================
//  HỌC VẤN LUẬN 学业论 — PHÂN TÍCH SÂU HỌC TẬP & THI CỬ
//  Hoàn thiện bộ 5 chuyên sâu (hôn nhân + tài + sự nghiệp + sức khoẻ + học vấn).
//  Ấn tinh (học thuật) + Thực Thương (sáng tạo) + Văn Xương/文曲 + Dụng Thần hướng học.
//  Nguồn: 渊海子平 印星篇, 三命通会 文昌, 子平真诠 学业论.
// ============================================================================
import { GAN, WX_VI, TEN_GOD_VI } from './constants.js';

const STUDY_FIELD = {
  木: 'văn chương, ngữ văn, triết học, giáo dục, nông-lâm, đông y, môi trường',
  火: 'nghệ thuật, biểu diễn, truyền thông, quảng cáo, điện ảnh, tâm lý học',
  土: 'quản lý, kinh tế, bất động sản, kiến trúc, nông nghiệp, luật dân sự',
  金: 'kỹ thuật, công nghệ thông tin, cơ khí, luật, tài chính, y khoa (gây mê/riêng)',
  水: 'thương mại, ngoại giao, ngôn ngữ học, logistics, hải dương học, triết học phương đông',
};

/**
 * @returns {{ sealStar, sealWx, sealCount, foodCount, hasWenChang,
 *            hasXueTang, bodyCanStudy, isYong, studyFields, timing, profile, advice }}
 */
export function analyzeStudy(R) {
  const { chart, yong, shensha, dayun } = R;
  const dayGan = chart.dayGan;
  const dayWx = GAN[dayGan].wx;

  // 1. Ấn tinh (sao học) = sinh Nhật Chủ
  const sealGods = ['正印', '偏印'];
  const sealWx = ({ 木:'水', 火:'木', 土:'火', 金:'土', 水:'金' })[dayWx]; // sinh Nhật = Ấn
  const foodGods = ['食神', '傷官'];

  // 2. Đếm Ấn + Thực Thương
  let sealCount = 0, foodCount = 0;
  for (const key of ['year', 'month', 'time']) {
    const g = chart.pillars[key].ganGod;
    if (sealGods.includes(g)) sealCount += 1;
    if (foodGods.includes(g)) foodCount += 1;
  }
  for (const key of ['year', 'month', 'day', 'time']) {
    const g = chart.pillars[key].hidden[0]?.god;
    if (sealGods.includes(g)) sealCount += 0.5;
    if (foodGods.includes(g)) foodCount += 0.5;
  }

  // 3. Văn Xương / Học Đường / Tam Kỳ (sao học)
  const hasWenChang = !!(shensha && shensha.wenChang);
  const hasXueTang = !!(shensha && shensha.xueTang);
  const hasSanQi = !!(shensha && shensha.sanQi);

  // 4. Dụng Thần hướng học
  const studyFields = [...new Set([yong.primary, yong.xi].filter(Boolean))]
    .map((w) => WX_VI[w] + ': ' + (STUDY_FIELD[w] || '')).join(' | ');

  // 5. Dụng/Kỵ
  const isYong = (yong.primary === sealWx || yong.xi === sealWx);

  // 6. Thân đủ học?
  const bodyCanStudy = R.strength.strong;

  // 7. Đại vận Ấn/Thực timing (kỳ thi thuận lợi)
  const studyDayun = (dayun || []).filter((d) => {
    const dgWx = GAN[d.gan]?.wx;
    return dgWx === sealWx || dgWx === yong.primary || dgWx === yong.xi;
  }).map((d) => `${d.ganZhi}[${d.startAge}-${d.startAge + 9}t:${d.rating}]`);

  // 8. Hồ sơ
  const sealStrength = sealCount >= 1.5 ? 'vượng' : sealCount > 0 ? 'vừa' : 'nhược/ẩn';
  const foodStrength = foodCount >= 1.5 ? 'vượng' : foodCount > 0 ? 'vừa' : 'ít';

  const profile = [
    `Ấn tinh (${sealGods.map((g) => TEN_GOD_VI[g]).join('/')}, hành ${WX_VI[sealWx]}): ${sealStrength} (${sealCount.toFixed(1)}) → ${sealStrength === 'vượng' ? 'tư chất ham học, trí nhớ tốt, hợp học thuật/nghiên cứu' : sealStrength === 'vừa' ? 'học vừa, cần cố gắng' : 'học qua thực hành nhanh hơn lý thuyết'}.`,
    `Thực Thương (${foodGods.map((g) => TEN_GOD_VI[g]).join('/')}): ${foodStrength} (${foodCount.toFixed(1)}) → ${foodStrength === 'vượng' ? 'giàu sáng tạo, khéo diễn đạt, hợp nghệ thuật/khởi nghiệp' : 'mạnh ở kỷ luật, ít phá cách'}.`,
    hasWenChang ? `🌟 Có Văn Xương → lợi thi cử, tư duy sắc.'` : '',
    hasXueTang ? `📚 Có Học Đường → tư chất học hỏi tốt.` : '',
    hasSanQi ? `✨ Có Tam Kỳ → tài năng kỳ xuất, đa năng.` : '',
    bodyCanStudy ? `Thân vượng → đủ sức học cường độ cao, thi cử cạnh tranh.` : `Thân nhược → nên học theo lộ trình chia nhỏ, có thầy kèm.`,
    isYong ? `✓ Ấn = Dụng/Hỷ → học tập thuận, nên đầu tư học vấn.` : `Ấn không phải Dụng → học qua thực hành/kinh nghiệm hiệu quả hơn lý thuyết.`,
    `Hướng học theo Dụng Thần: ${studyFields}.`,
    studyDayun.length ? `⏰ Đại vận Ấn/Dụng: ${studyDayun.join(', ')} — giai đoạn học tập/thi cử thuận.` : '',
  ].filter(Boolean);

  const advice = sealCount >= 1.5 && isYong
    ? 'Tư chất học thuật tốt + Ấn = Dụng → nên đầu tư bằng cấp/học thuật; đón đại vận Ấn để thi cử.'
    : foodCount >= 1.5
      ? 'Thực Thương vượng → hợp học qua sáng tạo/kỹ năng thực hành hơn lý thuyết; nghệ thuật/kỹ thuật.'
      : sealCount < 1
        ? 'Ấn ít → học qua trải nghiệm thực tế, học nghề, kỹ năng thực hành sẽ vào nhanh.'
        : 'Học vấn trung bình → kiên nhẫn; học hiệu quả khi đại vận mang hành Dụng/Ấn.';

  return {
    sealStar: sealGods.map((g) => TEN_GOD_VI[g]).join('/'),
    sealWx, sealWxVi: WX_VI[sealWx],
    sealCount, sealStrength,
    foodCount, foodStrength,
    hasWenChang, hasXueTang, hasSanQi,
    bodyCanStudy, isYong, studyFields, timing: studyDayun,
    profile, advice,
  };
}

export { STUDY_FIELD };
