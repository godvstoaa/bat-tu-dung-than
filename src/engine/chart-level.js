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
  // [loop 71 guard] upstream (analyze/synthesize) có thể fail im lặng → wx/yong/pattern undefined.
  //   Trả nhãn an toàn thay vì throw hoặc tính bậy (vd Math.max(...[]=-Infinity) → balanced SAI).
  if (!wx || !yong || !pattern || !wx.score) {
    return { level: 'unknown', levelVi: 'Không đủ dữ liệu', criteria: [], note: 'Lá số thiếu dữ liệu ngũ hành/Dụng (upstream fail) — không xếp bậc.', passCount: 0 };
  }
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
  //   [loop 71 sửa bug] guard pct rỗng: Math.max(...[])=-Infinity, Math.min(...[])=+Infinity
  //   → balanced=true SAI (đẩy bậc quá cao) khi upstream wx.pct fail. Nay yêu cầu pct có dữ liệu.
  const pct = Object.values(wx.pct || {});
  const hasPct = pct.length > 0;
  const maxPct = hasPct ? Math.max(...pct) : 0, minPct = hasPct ? Math.min(...pct) : 0;
  const balanced = hasPct && maxPct < 50 && minPct > 5;
  criteria.push({ name: '配合流通', pass: balanced, detail: !hasPct ? 'Không đủ dữ liệu ngũ hành' : (balanced ? 'Ngũ hành tương đối cân' : `Thiên lệch (max ${maxPct.toFixed(0)}%, min ${minPct.toFixed(0)}%)`) });

  // 5. 神煞 cát tinh
  const hasStars = catShensha >= 3;
  criteria.push({ name: '吉神', pass: hasStars, detail: `${catShensha} cát tinh${hasStars ? ' (nhiều)' : ''}` });

  // 6. 运势 (đại vận cát)
  const goodFortune = dayunCat >= 3;
  criteria.push({ name: '运势', pass: goodFortune, detail: `${dayunCat}/8 đại vận cát` });

  // Đếm tiêu chí pass
  const passCount = criteria.filter((c) => c.pass).length;
  // [loop 1007] 大败 tổ hợp hung cap — 伤官见官/枭夺食/群劫争财/杀攻身 là「大败」patterns
  //   phá cách cục; chart có các flaws này KHÔNG nên xếp bậc cao (Phú/Quý) dù khác tiêu chí pass.
  //   Vd cháu 2023-1-13: 3/6 structural nhưng có 伤官见官 + 枭夺食 → cap xuống (tránh «Phú Cách» sai).
  //   (官杀混杂 guanZha TOO common — chỉ tính khi ≥2 serious khác, không cap một mình.)
  const SERIOUS = new Set(['shangGuan', 'xiaoShi', 'qunJie', 'shaGong']);
  const seriousXiong = (synthesis?.combos || []).filter((c) => c.tone === 'xiong' && SERIOUS.has(c.id) && !c.mitigation);
  // [loop 673 FIX] cap by synthesis score — tránh chart điểm thấp bị xếp bậc cao (vd cháu 16/100
  //   nhưng 3/6 tiêu chí structural → «Thanh Quý» sai thực tế). Cổ pháp: mệnh đó low → bậc phải thấp.
  let _effPass = passCount;
  if (synthesis?.score != null && synthesis.score < 22) _effPass = Math.min(_effPass, 1);      // Hạ đặng nặng → max Hạ Cách
  else if (synthesis?.score != null && synthesis.score < 31) _effPass = Math.min(_effPass, 2);  // Hạ đẳng → max Thường Cách
  else if (synthesis?.score != null && synthesis.score < 40) _effPass = Math.min(_effPass, 3);  // [loop 1007] Trung hạ → max Thanh Quý (tránh «Phú Cách» cho chart điểm 35-39)
  if (seriousXiong.length >= 2) _effPass = Math.min(_effPass, 2);   // ≥2 大败 (chưa chế) → max Thường Cách
  else if (seriousXiong.length >= 1) _effPass = Math.min(_effPass, 3); // 1 大败 (chưa chế) → max Thanh Quý

  // Phân tầng (dùng _effPass có cap)
  let level, levelVi;
  if (_effPass >= 6) { level = '极品'; levelVi = 'Cực Phẩm (帝王/Thượng thượng — cực hiếm, toàn mỹ)'; }
  else if (_effPass >= 5) { level = '贵格'; levelVi = 'Quý Cách (将相/Thượng — quý hiển, quyền uy)'; }
  else if (_effPass >= 4) { level = '富格'; levelVi = 'Phú Cách (富豪/Trung thượng — giàu có, phúc lộc)'; }
  else if (_effPass >= 3) { level = '清贵'; levelVi = 'Thanh Quý (văn nhân/Trung — học vấn, thanh cao)'; }
  else if (_effPass >= 2) { level = '常格'; levelVi = 'Thường Cách (bình dân/Trung hạ — no ấm, cần nỗ lực)'; }
  else { level = '下格'; levelVi = 'Hạ Cách (bần tiện — nhiều trở ngại, cần cải vận mạnh)'; }

  // [loop 675] capNote — làm rõ khi bậc bị cap thấp hơn passCount thô
  const capped = _effPass < passCount;
  const capReason = seriousXiong.length >= 1
    ? `cap: có ${seriousXiong.length} tổ hợp「大败」chưa chế (${seriousXiong.map((c) => c.vi).join(', ')}) — phá cách cục, bậc giới hạn dù structural ${passCount}/6`
    : (synthesis?.score != null && synthesis.score < 31 ? `cap: điểm mệnh ${synthesis.score}/100 thấp → bậc giới hạn (structural ${passCount}/6 nhưng vận hạn kéo xuống)`
    : (synthesis?.score != null && synthesis.score < 40 ? `cap: điểm mệnh ${synthesis.score}/100 trung bình → bậc giới hạn tối đa Thanh Quý (structural ${passCount}/6)` : ''));
  const note = `Mệnh cách: ${levelVi}. ${_effPass}/6 tiêu chí cổ pháp đạt (thực tế).` +
    `${capped ? ` (${capReason})` : ''} ` +
    `${_effPass >= 4 ? 'Mệnh có nền tốt — nên phát huy thế mạnh.' : _effPass >= 2 ? 'Mệnh trung bình — cần nỗ lực + cải vận.' : 'Mệnh nhiều khó — cải vận + tích đức là then chốt.'}`;

  return { level, levelVi, criteria, passCount: _effPass, rawPassCount: passCount, capped, note };
}
