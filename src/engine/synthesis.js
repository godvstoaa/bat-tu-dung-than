// ============================================================================
//  TỔNG LUẬN MỆNH (命局總論) — chấm đẳng cấp & xu hướng phú quý
//  Dựa 5 chiều cổ pháp (子平真詮/滴天髓): 格局 – 有情 – 有力 – 清濁 – 配合.
//  Tổng hợp Dụng Thần, 喜/忌/仇, tổ hợp Thập thần, hội hợp, thần sa → kết luận.
// ============================================================================
import { WX_VI, GAN } from './constants.js';
import { detectCombos } from './combos.js';
import { dayunChangsheng } from './changsheng-deep.js'; // [loop 20] 十二长生运 giai đoạn đại vận

const wxVi = (w) => WX_VI[w];

/**
 * @param {object} R - kết quả analyze() đầy đủ
 * @returns {{ score, grade, gradeVi, fortune, fortuneVi, factors[], paragraphs[] }}
 */
export function synthesize(R) {
  const { chart, wx, strength, pattern, yong, interactions, shensha, dayun } = R;
  const combos = detectCombos(chart, strength);
  let score = 45;
  const factors = [];
  const qualityLines = [];

  // --- 0. 格局成败救应 (子平真詮 chương 9) — lớp đoạt trước khi chấm điểm ---
  const pq = R.patternQuality;
  if (pq) {
    const QUALITY_DELTA = { 成格: 6, 有救: 2, 败格: -7, 特殊: 3, 未知: 0 };
    const QUALITY_VI = { 成格: 'Thành cách', 有救: 'Có cứu ứng (bại trung hữu thành)', 败格: 'Bại cách', 特殊: 'Cách đặc biệt' };
    const d = QUALITY_DELTA[pq.quality] || 0;
    score += d;
    factors.push(`格局成败 (${pq.quality} — ${QUALITY_VI[pq.quality] || pq.quality}): ${pq.summary.split('。').slice(1).join('。').trim() || pq.summary} ${d > 0 ? '+' : ''}${d}.`);
    qualityLines.push(`Cách ${pattern.vi} ở trạng thái ${QUALITY_VI[pq.quality] || pq.quality}: ${pq.summary}`);
  }

  const yongScore = wx.score[yong.primary] || 0;
  const jiScore = wx.score[yong.ji] || 0;
  const xiScore = wx.score[yong.xi] || 0;
  const total = wx.total || 1;

  // --- 1. 格局 (có cách cục sạch không) ---
  if (pattern.type === 'special') { score += 6; factors.push('Cách đặc biệt (thuận thế) —气势 nhất quán, +6.'); }
  else if (pattern.type === 'normal') { score += 4; factors.push(`Thành chính cách (${pattern.vi}) — có cách rõ, +4.`); }
  else { factors.push('Nguyệt lệnh là Tỷ Kiếp — Dụng phải lấy ở chỗ khác (kiến lộc/nguyệt kiếp).'); }

  // --- 2. 有力 (Dụng Thần có gốc/có lực không) ---
  if (yongScore / total >= 0.15) { score += 6; factors.push(`Dụng Thần ${wxVi(yong.primary)} có lực (${((yongScore / total) * 100).toFixed(0)}%) — có gốc, +6.`); }
  else if (yongScore / total < 0.08) { score -= 6; factors.push(`Dụng Thần ${wxVi(yong.primary)} yếu (${((yongScore / total) * 100).toFixed(0)}%) — thiếu lực, −6.`); }
  // Dụng ở can năm/tháng (vị trí mạnh)
  const yongInYueGan = ['year', 'month', 'time'].some((k) => GAN[chart.pillars[k].gan].wx === yong.primary);
  if (yongInYueGan) { score += 3; factors.push('Dụng Thần thấu Thiên Can năm/tháng/giờ — vị trí hữu lực, +3.'); }

  // --- 3. 有情 (Dụng có nguồn <喜> không; Kỵ có chế không) ---
  if (xiScore / total >= 0.12) { score += 5; factors.push(`Có Hỷ Thần ${wxVi(yong.xi)} (${((xiScore / total) * 100).toFixed(0)}%) sinh trợ Dụng — hữu tình, +5.`); }
  else { score -= 3; factors.push('Hỷ Thần (nguồn sinh Dụng) mỏng — Dụng thiếu hậu thuẫn, −3.'); }
  if (jiScore / total >= 0.25) { score -= 6; factors.push(`Kỵ Thần ${wxVi(yong.ji)} thái quá (${((jiScore / total) * 100).toFixed(0)}%) — Dụng bị khắc nặng, −6.`); }
  if (yongScore >= jiScore) { score += 3; factors.push('Lực Dụng ≥ lực Kỵ — thế cục chủ động, +3.'); }

  // --- 4. 清浊 (tổ hợp hung làm trọc cục) ---
  const xiong = combos.filter((c) => c.tone === 'xiong');
  const catCombos = combos.filter((c) => c.tone === 'cat');
  if (xiong.length) {
    score -= 5 * xiong.length;
    factors.push(`Tổ hợp hung (${xiong.map((c) => c.vi).join(', ')}) làm trọc cục, ${-5 * xiong.length}.`);
  }
  if (catCombos.length) {
    const bonus = 3 * Math.min(catCombos.length, 2);
    score += bonus;
    factors.push(`Tổ hợp cát (${catCombos.slice(0, 2).map((c) => c.vi).join(', ')}) nâng tầng cách cục, +${bonus}.`);
  }

  // --- 5. 配合 (hội hợp: Kỵ hợp xung phá Dụng?) ---
  const chongCnt = interactions.chong.length;
  const xingCnt = interactions.xing.length;
  if (chongCnt >= 2 || xingCnt >= 2) { score -= 5; factors.push(`Xung/hình nhiều (${chongCnt} xung, ${xingCnt} hình) — phối hợp bất ổn, −5.`); }
  const dayZhi = chart.pillars.day.zhi;
  if (interactions.chong.some((c) => c.a === dayZhi || c.b === dayZhi)) { score -= 3; factors.push('Nhật Chi (cung gốc) bị xung —根基 bất ổn, −3.'); }
  const sanHelper = [...(interactions.sanHe || []), ...(interactions.sanHui || [])].some((s) => s.wx === yong.primary);
  if (sanHelper) { score += 4; factors.push(`Tam hợp/hội đóng về hành Dụng ${wxVi(yong.primary)} — Dụng thêm vững, +4.`); }

  // --- Thần sa cát tinh ---
  const catStars = ['tianYi', 'tianDe', 'yueDe', 'wenChang', 'jiangXing', 'jinYu', 'sanQi'];
  const catHit = catStars.filter((k) => shensha && shensha[k]);
  if (catHit.length >= 2) { score += 3; factors.push(`Nhiều cát tinh (${catHit.join(', ')}) phù trợ, +3.`); }

  score = Math.max(0, Math.min(100, Math.round(score)));

  // --- Đẳng cấp ---
  let grade, gradeVi;
  if (score >= 80) { grade = '上'; gradeVi = 'Thượng đẳng (mệnh tốt, hiếm)'; }
  else if (score >= 68) { grade = '中上'; gradeVi = 'Trung thượng (khá tốt)'; }
  else if (score >= 55) { grade = '中'; gradeVi = 'Trung đẳng (cân bằng)'; }
  else if (score >= 43) { grade = '中下'; gradeVi = 'Trung hạ (khá vất vả)'; }
  else { grade = '下'; gradeVi = 'Hạ đẳng (nhiều thử thách)'; }

  // --- Phú quý bần tiện (xu hướng) ---
  let fortune, fortuneVi;
  if (score >= 68 && catCombos.length >= 1) { fortune = 'phú quý'; fortuneVi = 'Phú/Qúy — danh lợi đều có, đáng tiến thủ'; }
  else if (score >= 55) { fortune = 'tiểu phú quý'; fortuneVi = 'Tiểu phú/qúy — ấm no, có thành tựu vừa'; }
  else if (score >= 43) { fortune = 'bình'; fortuneVi = 'Bình thường — no ấm, cần nỗ lực nhiều'; }
  else { fortune = 'bần tiện'; fortuneVi = 'Khó nhọc — cần dựa Dụng Thần + đúng thời để vươn lên'; }

  const paragraphs = [
    `Mệnh bạn xếp ở ${gradeVi} — điểm tổng hợp ${score}/100.`,
    `Trục cốt lõi: Dụng Thần ${wxVi(yong.primary)}, Hỷ ${wxVi(yong.xi)} (trợ), Kỵ ${wxVi(yong.ji)} (hại), 仇 ${wxVi(yong.chou)} (hại gián tiếp). Xu hướng: ${fortuneVi}.`,
    factors.map((f) => '• ' + f).join('\n'),
    score >= 58
      ? 'Khuyên dùng: giữ vững hướng Dụng/Hỷ Thần (màu/phương/ngành nghề), đón lưu niên/đại vận mang hành Dụng để tiến thủ.'
      : 'Khuyên dùng: tránh Kỵ/仇 Thần, chủ động bổ sung Dụng Thần; đổi vận nhờ lưu niên/đại vận mang hành Dụng (xem mục Lưu Niên).',
  ];
  if (qualityLines.length) paragraphs.splice(2, 0, qualityLines[0]);

  // --- 格局大运喜忌 (子平真詮 ch.10-11): vận nào 格局-thuận / 格局-nghịch nhất ---
  //   + 运中救应 (ALGORITHM ELEVATION #7): nhắc riêng các vận CỨU CÁCH cụ thể.
  if (pq && Array.isArray(dayun) && dayun.length) {
    const fav = dayun.filter((d) => d.gejuDelta > 0);
    const host = dayun.filter((d) => d.gejuDelta < 0);
    if (fav.length || host.length) {
      const fv = fav.map((d) => `${d.ganZhi}(${d.startAge}t)`).join(', ');
      const hv = host.map((d) => `${d.ganZhi}(${d.startAge}t)`).join(', ');
      let para =
        `Theo 格局 (子平真詮 ch.10-11): ${fav.length ? `vận cách-thuận = ${fv}` : 'không có vận cách-thuận rõ'}${host.length ? `; vận cách-nghịch = ${hv}` : ''}. ` +
        (fav.length ? `Đại vận mang thập thần sinh trợ Dụng/相 (${pq.patternYong.xi.map((x) => x.vi).join('/')}) là vận nên tiến thủ.` : '');
      paragraphs.push(para);
    }
    // 运中救应 (运能改格): các vận tạm CỨU một bệnh bại cụ thể của cách → nhấn mạnh riêng.
    const rescuers = dayun.filter((d) => d.gejuRescue);
    if (rescuers.length) {
      const rc = rescuers.map((d) => `${d.ganZhi}(${d.startAge}t)`).join(', ');
      paragraphs.push(
        `★ 运中救应 (运能改格): đại vận ${rc} tạm CỨU CÁCH — thập thần vận trùng với phần tử cứu ứng của bệnh bại, ` +
        `nên dù cách vốn ${pq.quality} vẫn có cửa bại-trung-hữu-thành trong khoảng 10 năm này. Đây là vận đáng chờ đợi để xoay chuyển.`
      );
    }
  }

  // --- [loop 20 NEW] 十二长生运: giai đoạn sinh mệnh đại vận hiện tại (滴天髓 运元) ---
  try {
    const dcs = dayunChangsheng(R);
    if (dcs.current) {
      paragraphs.push(
        `Giai đoạn sinh mệnh (十二长生运): ${dcs.note} ` +
        `Cả nửa đời: ${dcs.riseCount} thập niên trỗi dậy / ${dcs.declineCount} thập niên thu lại.`
      );
    }
  } catch (e) {}

  return { score, grade, gradeVi, fortune, fortuneVi, factors, paragraphs, combos, patternQuality: pq || null };
}
