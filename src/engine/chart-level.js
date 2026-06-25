// ============================================================================
//  MỆNH CÁCH TẦNG LỚP 命格层次 — PHÂN LOẠI CỔ ĐIỂN LÁ SỐ
//  Khác synthesis.js (điểm số): dùng tiêu chí cổ pháp → nhãn cổ điển.
//  6 tầng: 帝王/极品 → 将相/贵格 → 富豪/富格 → 文人/清贵 → 平民/常格 → 贫贱/下格.
//  Nguồn: 滴天髓 命格论, 子平真诠 格局高低, 三命通会 贵贱赋.
// ============================================================================
import { GAN } from './constants.js';

/**
 * @returns {{ level, levelVi, criteria:[{name, pass, detail}], note }}
 */
export function classifyChartLevel(R) {
  const { chart, wx, yong, pattern, synthesis, shensha, dayun } = R;
  const total = wx.total || 1;
  const yongScore = (wx.score[yong.primary] || 0) / total;
  const jiScore = (wx.score[yong.ji] || 0) / total;
  const catCombos = (synthesis?.combos || []).filter((c) => c.tone === 'cat');
  const xiongCombos = (synthesis?.combos || []).filter((c) => c.tone === 'xiong');
  const catShensha = shensha ? ['tianYi','tianDe','yueDe','wenChang','jiangXing','jinYu','sanQi','luShen'].filter((k) => shensha[k]).length : 0;
  const dayunCat = (dayun || []).filter((d) => d.score >= 2).length;

  // 6 tiêu chí cổ pháp
  const criteria = [];

  // 1. 格局成败 — [loop 63 sửa] 建祿/月劫/羊刃 (type='luyue') CŨNG là cách chính thống
  //   (子平真詮 liệt kê trong 8 nội cách). Trước đây exclude → under-rate ~1/3 chart.
  const patternOK = pattern.type === 'normal' || pattern.type === 'special' || pattern.type === 'luyue';
  criteria.push({ name: '格局成败', pass: patternOK, detail: patternOK ? `${pattern.vi} thành cách` : 'Cách không thành/khuyết' });

  // 2. 用神有力
  const yongStrong = yongScore >= 0.15;
  criteria.push({ name: '用神有力', pass: yongStrong, detail: `${yongScore >= 0.15 ? 'Đắc lực' : yongScore >= 0.08 ? 'Hơi yếu' : 'Vô lực'} (${(yongScore * 100).toFixed(0)}%)` });

  // 3. 清浊 (tổ hợp hung ít)
  const clean = xiongCombos.length === 0;
  criteria.push({ name: '清浊', pass: clean, detail: clean ? 'Mệnh thanh (không tổ hợp hung)' : `Trọc (${xiongCombos.length} tổ hợp hung: ${xiongCombos.map((c) => c.vi).join(',')})` });

  // 4. 配合 (ngũ hành lưu thông — không có hành quá thái/quá suy)
  const pct = Object.values(wx.pct);
  const maxPct = Math.max(...pct), minPct = Math.min(...pct);
  const balanced = maxPct < 50 && minPct > 5;
  criteria.push({ name: '配合流通', pass: balanced, detail: balanced ? 'Ngũ hành tương đối cân' : `Thiên lệch (max ${maxPct.toFixed(0)}%, min ${minPct.toFixed(0)}%)` });

  // 5. 神煞 cát tinh
  const hasStars = catShensha >= 3;
  criteria.push({ name: '吉神', pass: hasStars, detail: `${catShensha} cát tinh${hasStars ? ' (nhiều)' : ''}` });

  // 6. 运势 (đại vận cát)
  const goodFortune = dayunCat >= 3;
  criteria.push({ name: '运势', pass: goodFortune, detail: `${dayunCat}/8 đại vận cát` });

  // Đếm tiêu chí pass
  const passCount = criteria.filter((c) => c.pass).length;

  // Phân tầng
  let level, levelVi;
  if (passCount >= 6) { level = '极品'; levelVi = 'Cực Phẩm (帝王/Thượng thượng — cực hiếm, toàn mỹ)'; }
  else if (passCount >= 5) { level = '贵格'; levelVi = 'Quý Cách (将相/Thượng — quý hiển, quyền uy)'; }
  else if (passCount >= 4) { level = '富格'; levelVi = 'Phú Cách (富豪/Trung thượng — giàu có, phúc lộc)'; }
  else if (passCount >= 3) { level = '清贵'; levelVi = 'Thanh Quý (văn nhân/Trung — học vấn, thanh cao)'; }
  else if (passCount >= 2) { level = '常格'; levelVi = 'Thường Cách (bình dân/Trung hạ — no ấm, cần nỗ lực)'; }
  else { level = '下格'; levelVi = 'Hạ Cách (bần tiện — nhiều trở ngại, cần cải vận mạnh)'; }

  const note = `Mệnh cách: ${levelVi}. ${passCount}/6 tiêu chí cổ pháp đạt. ` +
    `${passCount >= 4 ? 'Mệnh có nền tốt — nên phát huy thế mạnh.' : passCount >= 2 ? 'Mệnh trung bình — cần nỗ lực + cải vận.' : 'Mệnh nhiều khó — cải vận + tích đức là then chốt.'}`;

  return { level, levelVi, criteria, passCount, note };
}
