// ============================================================================
//  TỔNG LUẬN MỆNH (命局總論) — chấm đẳng cấp & xu hướng phú quý
//  Dựa 5 chiều cổ pháp (子平真詮/滴天髓): 格局 – 有情 – 有力 – 清濁 – 配合.
//  Tổng hợp Dụng Thần, 喜/忌/仇, tổ hợp Thập thần, hội hợp, thần sa → kết luận.
// ============================================================================
import { WX_VI, GAN } from './constants.js';
import { detectCombos } from './combos.js';
import { detectGongjia } from './gongjia.js'; // [loop 513] 拱夹 synthesis factor
import { dayunChangsheng } from './changsheng-deep.js'; // [loop 20] 十二长生运 giai đoạn đại vận

const wxVi = (w) => WX_VI[w];
// [loop 503] WX_REMEDY map — dùng cho remedy factors (Dụng yếu/Kỵ thái quá/盖头截脚 trúng Dụng)
const WX_REMEDY = { 木: 'xanh/Đông', 火: 'đỏ/Nam', 土: 'vàng/Tây Nam', 金: 'trắng/Tây', 水: 'đen/Bắc' };
const remedyHint = (wx) => (WX_REMEDY[wx] ? ` → ${wxVi(wx)}: màu ${WX_REMEDY[wx]}` : '');

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
  else if (yongScore / total < 0.08) { score -= 6; factors.push(`Dụng Thần ${wxVi(yong.primary)} yếu (${((yongScore / total) * 100).toFixed(0)}%) — thiếu lực, −6.${remedyHint(yong.primary)}补 mạnh.`); }
  // Dụng ở can năm/tháng (vị trí mạnh)
  const yongInYueGan = ['year', 'month', 'time'].some((k) => GAN[chart.pillars[k].gan].wx === yong.primary);
  if (yongInYueGan) { score += 3; factors.push('Dụng Thần thấu Thiên Can năm/tháng/giờ — vị trí hữu lực, +3.'); }

  // --- 3. 有情 (Dụng có nguồn <喜> không; Kỵ có chế không) ---
  if (xiScore / total >= 0.12) { score += 5; factors.push(`Có Hỷ Thần ${wxVi(yong.xi)} (${((xiScore / total) * 100).toFixed(0)}%) sinh trợ Dụng — hữu tình, +5.`); }
  else { score -= 3; factors.push('Hỷ Thần (nguồn sinh Dụng) mỏng — Dụng thiếu hậu thuẫn, −3.'); }
  if (jiScore / total >= 0.25) { score -= 6; factors.push(`Kỵ Thần ${wxVi(yong.ji)} thái quá (${((jiScore / total) * 100).toFixed(0)}%) — Dụng bị khắc nặng, −6.${remedyHint(yong.primary)}tăng, tránh ${wxVi(yong.ji)}.`); }
  if (yongScore >= jiScore) { score += 3; factors.push('Lực Dụng ≥ lực Kỵ — thế cục chủ động, +3.'); }

  // --- 4. 清浊 (tổ hợp hung làm trọc cục) ---
  const xiong = combos.filter((c) => c.tone === 'xiong');
  const catCombos = combos.filter((c) => c.tone === 'cat');
  if (xiong.length) {
    score -= 5 * xiong.length;
    const _xMit = xiong.filter((c) => c.mitigation).map((c) => c.mitigation).join('; ');
    factors.push(`Tổ hợp hung (${xiong.map((c) => c.vi).join(', ')}) làm trọc cục, ${-5 * xiong.length}.${_xMit ? ` Hóa giải: ${_xMit}.` : ''}`);
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

  // [loop 150] KHÔNG VONG penalty — trụ rơi旬空 = sao/Dụng ở đó «treo» → trừ điểm
  const kw = R.kongwang;
  if (kw && kw.affected && kw.affected.length) {
    const penalty = -2 * kw.affected.length;
    score += penalty;
    factors.push(`Không vong (空亡): ${kw.affected.length} trụ rơi旬空 (${kw.affected.map((a) => a.pos).join('/')}) → tàng can «treo» («空则不实»), ${penalty}. → đợi lưu niên/đại vận «xuất旬空» tàng can mới phát huy.`);
  }

  // [loop 457] 源流 (ngũ hành lưu thông — 滴天髓源流篇) — chiều đo thứ 6.
  //   Trước đây 源流 (loop 452) chỉ là card độc lập, KHÔNG ảnh hưởng tổng luận. Nay tích hợp:
  //   khí流通 tuần hoàn (源远流长) = mệnh thuận hoà (+5); khí trệ = tài khó phát huy (−4).
  const yl = R.yuanliu;
  if (yl) {
    if (yl.fullCycle) { score += 5; factors.push(`源流 源远流长 — ngũ hành lưu thông tuần hoàn (5/5) → khí mệnh thuận hoà, phú quý bền, +5.`); }
    else if (yl.flowLen >= 3) { score += 2; factors.push(`源流 dòng khí thông ${yl.flowLen}/5, quy ${yl.aspectKey} (${yl.aspectVi}) → khía cạnh ${yl.aspectKey} hữu duyên, +2.`); }
    else if (yl.flowLen <= 1) { score -= 4; factors.push(`源流 khí trệ (chỉ ${yl.flowLen}/5) — nguồn ${wxVi(yl.source)} vượng nhưng dòng tắc → tài năng khó phát huy, cần vận «mở dòng», −4.`); }
    // flowLen === 2: trung tính (khí chảy vừa, không thưởng/phạt)
  }

  // [loop 468] 盖头截脚 — can-chi khắc nhau TRONG trụ. Context-dependent (滴天髓 气通):
  //   trụ 盖头/截脚 trúng DỤNG → Dụng bị khắc yếu (−2/hit); trúng KỴ → khắc được忌 = tốt (+1/hit).
  //   pillar-quality đã đếm dungHits/jiHits. Trước đây tổng luận bỏ qua (chỉ tính ở render).
  const pql = R.pillarQuality;
  if (pql && pql.gaijieCount > 0) {
    let pqDelta = 0;
    if (pql.dungHits) pqDelta += -2 * pql.dungHits;
    if (pql.jiHits) pqDelta += 1 * pql.jiHits;
    if (pqDelta !== 0) {
      score += pqDelta;
      const why = [];
      if (pql.dungHits) {
        why.push(`${pql.dungHits} trụ 盖头/截脚 trúng DỤNG → Dụng bị khắc yếu (${-2 * pql.dungHits}) → 补 Dụng${remedyHint(yong.primary)}.`);
      }
      if (pql.jiHits) why.push(`${pql.jiHits} trụ trúng KỴ → khắc được忌, lợi (+${pql.jiHits})`);
      factors.push(`盖头截脚 (${pql.gaijieCount}/4 trụ can-chi khắc): ${why.join('; ')}.`);
    }
  }

  // [loop 513] 拱夹 (gongjia) — 拱禄/拱贵 = significant auspicious (子平真诠)
  try {
    const gj = detectGongjia(R);
    if (gj.arches && gj.arches.length) {
      let gjDelta = 0;
      for (const a of gj.arches) {
        if (a.type.includes('拱禄')) gjDelta += 5;
        else if (a.type.includes('拱贵')) gjDelta += 3;
        else if (a.type.includes('Dụng')) gjDelta += 2;
      }
      if (gjDelta > 0) { score += gjDelta; factors.push(`拱夹: ${gj.summary} (+${gjDelta}).`); }
    }
  } catch (e) {}

  score = Math.max(0, Math.min(100, Math.round(score)));

  // --- Đẳng cấp ---
  // [loop 458→587] RECALIBRATE theo percentile 2160 lá post-Thông-Quan-fix (loop 575).
  //   Nay neo percentile: 上 = top ~10% (≥62), 中 = quanh median 47 (≥41), 下 = bottom ~6% (<31).
  let grade, gradeVi, percentile;
  // [loop 587] percentile neo theo phân bố thực 2160 lá: 下=p0-7, 中下=p7-31, 中=p31-65, 中上=p65-90, 上=p90-100
  if (score >= 62) { grade = '上'; gradeVi = 'Thượng đẳng (mệnh tốt, hiếm)'; percentile = 90 + Math.round(10 * (score - 62) / 21); }
  else if (score >= 52) { grade = '中上'; gradeVi = 'Trung thượng (khá tốt)'; percentile = 65 + Math.round(25 * (score - 52) / 10); }
  else if (score >= 41) { grade = '中'; gradeVi = 'Trung đẳng (cân bằng)'; percentile = 31 + Math.round(34 * (score - 41) / 11); }
  else if (score >= 31) { grade = '中下'; gradeVi = 'Trung hạ (khá vất vả)'; percentile = 7 + Math.round(24 * (score - 31) / 10); }
  else { grade = '下'; gradeVi = 'Hạ đẳng (nhiều thử thách)'; percentile = Math.max(1, Math.round(7 * (score - 14) / 17)); }
  percentile = Math.max(1, Math.min(99, percentile));

  // --- Phú quý bần tiện (xu hướng) ---
  // [loop 458] neo percentile cùng đẳng cấp (p80/p37/p12)
  let fortune, fortuneVi;
  if (score >= 55 && catCombos.length >= 1) { fortune = 'phú quý'; fortuneVi = 'Phú/Qúy — danh lợi đều có, đáng tiến thủ'; }
  else if (score >= 41) { fortune = 'tiểu phú quý'; fortuneVi = 'Tiểu phú/qúy — ấm no, có thành tựu vừa'; }
  else if (score >= 31) { fortune = 'bình'; fortuneVi = 'Bình thường — no ấm, cần nỗ lực nhiều'; }
  else { fortune = 'bần tiện'; fortuneVi = 'Khó nhọc — cần dựa Dụng Thần + đúng thời để vươn lên'; }

  const paragraphs = [
    `Mệnh bạn xếp ở ${gradeVi} — điểm tổng hợp ${score}/100 (top ${percentile}% người cùng tuổi mệnh).`,
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

  return { score, grade, gradeVi, percentile, fortune, fortuneVi, factors, paragraphs, combos, patternQuality: pq || null };
}
