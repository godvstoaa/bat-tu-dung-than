// ============================================================================
//  PHỐI NGẪU TINH LUẬN 配偶星论 (spouse star deep analysis)
//  Tổng hợp từ tứ trụ: sao phối ngẫu + cung phối ngẫu + mạnh/yếu + vị trí
//  + Dụng/Kỵ + tương tác → hồ sơ bạn đời.
//  Nguồn: 渊海子平 配偶论, 滴天髓 夫妻篇.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { tenGod } from './core.js';
import { TAO_HUA } from './shensha.js';

/**
 * @returns {{ spouseStar, spouseStarVi, isMale, spouseWx, palaceZhi, palaceZhiVi, palaceStable,
 *            strength, position, isYong, isJi, interactions, profile, advice }}
 */
export function analyzeSpouseStar(R) {
  const { chart, yong, wx, interactions, shensha } = R;
  const isMale = chart.input.gender === 'nam';
  const dayGan = chart.dayGan;
  const dayZhi = chart.pillars.day.zhi;

  // 1. Sao phối ngẫu
  const spouseGods = isMale ? ['正財', '偏財'] : ['正官', '七殺'];
  const spouseStarVi = spouseGods.map((g) => TEN_GOD_VI[g]).join('/');
  const spouseWx = isMale
    ? ({ 木:'土', 火:'金', 土:'水', 金:'木', 水:'火' })[GAN[dayGan].wx]  // Tài = what 日 克
    : ({ 木:'金', 火:'水', 土:'木', 金:'火', 水:'土' })[GAN[dayGan].wx]; // Quan = what 克 日

  // 2. Cung phối ngẫu (Nhật Chi)
  const palaceZhiVi = ZHI[dayZhi]?.vi || dayZhi;
  const palaceMainGod = chart.pillars.day.hidden[0]?.god || '';
  const palaceGodVi = TEN_GOD_VI[palaceMainGod] || palaceMainGod;
  const palaceStable = !interactions.chong.some((c) => c.a === dayZhi || c.b === dayZhi)
    && !interactions.xing.some((c) => c.a === dayZhi || c.b === dayZhi);

  // 3. Đếm số lần sao phối ngẫu xuất hiện (can hiển + tàng chính)
  let count = 0; let positions = [];
  for (const key of ['year', 'month', 'time']) {
    const p = chart.pillars[key];
    if (spouseGods.includes(p.ganGod)) { count += 1; positions.push(key); }
  }
  for (const key of ['year', 'month', 'day', 'time']) {
    const main = chart.pillars[key].hidden[0];
    if (spouseGods.includes(main?.god)) { count += 0.5; positions.push(key + '(tàng)'); }
  }

  // 4. Dụng/Kỵ
  const isYong = (yong.primary === spouseWx || yong.xi === spouseWx);
  const isJi = (yong.ji === spouseWx || yong.chou === spouseWx);

  // 5. Tương tác
  const interacts = [];
  // Can hiển nào hợp với can nào khác → sao bị "hợp" (đoạt)
  for (const gh of interactions.ganHe) {
    // Kiểm xem can bị hợp có phải sao phối ngẫu không
    const godA = tenGod(dayGan, gh.a);
    const godB = tenGod(dayGan, gh.b);
    if (spouseGods.includes(godA) || spouseGods.includes(godB)) {
      interacts.push(`Can hợp ${gh.a}${gh.b}→${gh.hua}: sao phối ngẫu bị hợp → dễ ngoại tình/đoạt.`);
    }
  }
  // Nhật chi bị xung
  if (!palaceStable) {
    const clash = interactions.chong.find((c) => c.a === dayZhi || c.b === dayZhi);
    if (clash) interacts.push(`Nhật Chi ${dayZhi} bị xung ${clash.a}↔${clash.b}: cung phối ngẫu bất ổn → hôn nhân biến động.`);
  }
  // Đào hoa
  if (shensha?.taoHua) {
    interacts.push('🌸 Có Đào Hoa: duyên sắc mạnh, cẩn thận đào hoa lệch/烂桃花.');
  }

  // 6. Hồ sơ bạn đời
  const strength = count >= 1.5 ? 'vượng' : count > 0 ? 'vừa' : 'nhược/ẩn';
  const posMeaning = positions.includes('month') ? 'gặp qua gia đình/công việc'
    : positions.includes('year') ? 'gặp sớm/quen từ nhỏ'
    : positions.includes('time') ? 'gặp muộn/qua bạn bè'
    : 'chưa rõ';

  const profile = [
    `Sao phối ngẫu: ${spouseStarVi} (hành ${WX_VI[spouseWx]}), độ xuất hiện ${strength} (${count.toFixed(1)}). Bạn đời ${strength === 'vượng' ? 'năng lực tốt, cá tính rõ' : strength === 'vừa' ? 'cân đối' : 'khiêm tốn/ẩn sau'}.`,
    `Cung phối ngẫu (Nhật Chi ${palaceZhiVi}): tàng ${palaceGodVi}${palaceStable ? ' — cung yên, hôn nhân nền' : ' — cung bị xung, biến động'}.`,
    `Gặp bạn đời: ${posMeaning}.`,
    isYong ? `✓ Sao phối ngẫu = Dụng/Hỷ Thần → hôn nhân mang lại may mắn, nên kết hôn.` : '',
    isJi ? `⚠ Sao phối ngẫu = Kỵ Thần → hôn nhân mang áp lực, cần chọn người bổ Dụng Thần.` : '',
    `Người hợp: mệnh mang hành ${WX_VI[yong.primary]}/${WX_VI[yong.xi]} (Dụng/Hỷ).`,
  ].filter(Boolean);

  const advice = isYong
    ? 'Hôn nhân là điểm sáng — nên kết hôn đúng lúc để khai vận.'
    : isJi
      ? 'Chọn bạn đời có mệnh bổ Dụng Thần để hoá giải; kết hôn muộn một chút tốt hơn.'
      : 'Hôn nhân trung tính — chất lượng phụ thuộc nỗ lực vun đắp.';

  return {
    spouseStar: spouseStarVi, isMale, spouseWx, spouseWxVi: WX_VI[spouseWx],
    palaceZhi: dayZhi, palaceZhiVi, palaceStable, palaceGodVi,
    strength, count, positions, posMeaning,
    isYong, isJi, interactions: interacts, profile, advice,
  };
}
