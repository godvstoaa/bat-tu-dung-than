// ============================================================================
//  HÉ HŪN 合婚 — HỢP TUỔI / HỢP ĐỐI TÁC (2 lá số đối chiếu)
//  4 nguyên tắc cổ pháp: (1) 五行互补, (2) 生肖三合六合/冲, (3) 日主干支相合,
//  (4) 用神互不损伤. Trả điểm + chốt hợp/không. Nguồn: 渊海子平, 八字合婚.
// ============================================================================
import { ZHI } from './constants.js';
import { tenGod } from './core.js';
import { XING_PAIRS, HAI_PAIRS } from './zodiac-deep.js';
import { computeZhai } from './zhai.js';
import { ganZhiNayin } from './nayin.js'; // [loop 530] 納音配婚

// Tam hợp / Lục hợp / Xung của Địa Chi
const SANHE = [['申', '子', '辰'], ['寅', '午', '戌'], ['巳', '酉', '丑'], ['亥', '卯', '未']];
const LIUHE = ['子丑', '寅亥', '卯戌', '辰酉', '巳申', '午未'];
const CHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };

function zhiRel(a, b) {
  if (a === b) return { type: 'tự', vi: 'tự hợp / đồng chi' };
  if (LIUHE.some((p) => (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a))) return { type: 'lục hợp', vi: 'Lục Hợp (ám hợp, quý nhân)' };
  if (CHONG[a] === b) return { type: 'xung', vi: 'Lục Xung' };
  for (const trio of SANHE) if (trio.includes(a) && trio.includes(b)) return { type: 'tam hợp', vi: 'Tam Hợp' };
  return { type: 'bình', vi: 'không hợp không xung' };
}

/**
 * @param R1, R2 - kết quả analyze() của 2 người
 * @returns {{ score, rating, factors[], verdict, detail }}
 */
export function computeHehun(R1, R2) {
  const a = R1.chart, b = R2.chart;
  let score = 50;
  const factors = [];

  // 1. 生肖 (chi năm) 三合/六合/冲 [loop 22 GIẢM trọng số — 生肖 là yếu tố ÍT quan trọng
  //   nhất cổ pháp (渊海子平/三命通会 trọng 日柱=phu thê cung nhất). Trước đây 三合+15/冲−15
  //   cho phép 生肖 lấn át 日柱 → ngược cổ pháp. Nay giảm thành bổ trợ nhẹ.]
  const zRel = zhiRel(a.pillars.year.zhi, b.pillars.year.zhi);
  if (zRel.type === 'tam hợp') { score += 8; factors.push(`• Chi năm ${ZHI[a.pillars.year.zhi].vi}–${ZHI[b.pillars.year.zhi].vi} ${zRel.vi} → hợp tuổi (bổ trợ nhẹ).`); }
  else if (zRel.type === 'lục hợp') { score += 5; factors.push(`• Chi năm ${ZHI[a.pillars.year.zhi].vi}–${ZHI[b.pillars.year.zhi].vi} ${zRel.vi} → hơi hợp tuổi.`); }
  else if (zRel.type === 'xung') { score -= 8; factors.push(`• Chi năm ${ZHI[a.pillars.year.zhi].vi}–${ZHI[b.pillars.year.zhi].vi} ${zRel.vi} → xung tuổi (nhẹ, có thể hóa giải).`); }
  else { factors.push(`• Chi năm ${ZHI[a.pillars.year.zhi].vi}–${ZHI[b.pillars.year.zhi].vi}: ${zRel.vi}.`); }

  // 1b. 六害 / 三刑 (bổ sung — zhiRel cũ chỉ bắt 合/Xung, bỏ sót Hại/Hình)
  const ya = a.pillars.year.zhi, yb = b.pillars.year.zhi;
  const haiHit = HAI_PAIRS.find((h) => h.pair.includes(ya) && h.pair.includes(yb) && ya !== yb);
  if (haiHit) { score -= 6; factors.push(`• Chi năm ${ZHI[ya].vi}–${ZHI[yb].vi} Lục Hại (${haiHit.vi}) — 暗 tổn nhẹ, lục đục dai dẳng.`); }
  // [loop 550 FIX] skip 刑 khi cặp đã là Xung hoặc Hợp — một cặp không thể vừa 冲 vừa 形, hoặc vừa 合 vừa 形.
  //   Tránh double-count (vd 丑未: 冲-8 + 形-5) và mâu thuẫn (vd 巳申: 合+5 + 形-5).
  const yXingBlocked = zRel.type === 'xung' || zRel.type === 'lục hợp' || zRel.type === 'tam hợp';
  const xingHit = yXingBlocked ? null : XING_PAIRS.find((x) => x.pair.includes(ya) && x.pair.includes(yb) && ya !== yb);
  if (xingHit) { score -= 5; factors.push(`• Chi năm ${ZHI[ya].vi}–${ZHI[yb].vi} ${xingHit.vi} — hình thương nhẹ.`); }

  // 2. 五行互补: Dụng của A có mạnh trong cục B không & ngược lại
  const aNeed = R1.yong.primary, bNeed = R2.yong.primary;
  // [loop 22] same-用神 penalty: 2 người cùng cần 1 hành → cùng thiếu, KHÔNG bổ nhau (kém).
  if (aNeed === bNeed) {
    score -= 5;
    factors.push(`✗ Cùng Dụng Thần (${aNeed}): hai mệnh cùng thiếu/khuynh về 1 hành → khó bổ sung nhau, duyên dựa nỗ lực vun đắp chứ không互补 trời cho.`);
  }
  const bHasA = (R2.wx.score[aNeed] || 0) / (R2.wx.total || 1);
  const aHasB = (R1.wx.score[bNeed] || 0) / (R1.wx.total || 1);
  if (aNeed !== bNeed && bHasA > 0.18 && aHasB > 0.18) { score += 18; factors.push(`✓ Ngũ Hành tương bổ: A cần ${aNeed}, B vượng ${aNeed} (${(bHasA * 100).toFixed(0)}%); B cần ${bNeed}, A vượng ${bNeed} (${(aHasB * 100).toFixed(0)}%) → bổ sung cho nhau.`); }
  else if (bHasA > 0.18 || aHasB > 0.18) { score += 8; factors.push(`• Bổ một chiều: ${bHasA > 0.18 ? `B bổ A` : `A bổ B`}五行.`); }
  else if (aNeed !== bNeed) { score -= 6; factors.push(`✗ Ngũ Hành ít bổ sung nhau (A cần ${aNeed}, B chỉ ${(bHasA * 100).toFixed(0)}%; B cần ${bNeed}, A ${(aHasB * 100).toFixed(0)}%).`); }

  // 3. 用神互不损伤: A có khắc Dụng của B / B khắc Dụng của A không?
  // (đơn giản: A kỵ hành có trùng Dụng của B không → kiểm Kỵ của A vs Dụng của B)
  const aHurtB = R1.yong.avoid.includes(bNeed);
  const bHurtA = R2.yong.avoid.includes(aNeed);
  if (aHurtB || bHurtA) { score -= 12; factors.push(`✗ Tổn dụng: ${aHurtB ? 'mệnh A kỵ đúng Dụng ' + bNeed : ''}${bHurtA ? ' mệnh B kỵ đúng Dụng ' + aNeed : ''} — một bên bất lợi.`); }
  else { score += 6; factors.push(`✓ Dụng Thần hai bên không tổn thương nhau.`); }

  // 4. 日柱 天干 / 地支 相合 [loop 22 TĂNG trọng số — 日柱 = cung phu thê, yếu tố #1 cổ pháp]
  const dgRel = a.dayGan + b.dayGan;
  const dayZhiRel = zhiRel(a.pillars.day.zhi, b.pillars.day.zhi);
  const GAN_HE = { '甲己': 1, '乙庚': 1, '丙辛': 1, '丁壬': 1, '戊癸': 1 };
  const ganHe = GAN_HE[dgRel] || GAN_HE[dgRel.split('').reverse().join('')];
  if (ganHe) { score += 16; factors.push(`✓ Nhật Can ${a.dayGan}–${b.dayGan} ngũ hợp → tâm đầu ý hợp (cung bản mệnh hợp).`); }
  if (dayZhiRel.type === 'lục hợp' || dayZhiRel.type === 'tam hợp') { score += 18; factors.push(`✓ Nhật Chi ${ZHI[a.pillars.day.zhi].vi}–${ZHI[b.pillars.day.zhi].vi} ${dayZhiRel.vi} → CUNG PHU THÊ hợp — yếu tố quan trọng nhất.`); }
  else if (dayZhiRel.type === 'xung') { score -= 18; factors.push(`✗ Nhật Chi ${ZHI[a.pillars.day.zhi].vi}–${ZHI[b.pillars.day.zhi].vi} Xung → CUNG PHU THÊ biến động — trọng yếu, cần cố ý hóa giải.`); }
  // [loop 325 nâng logic] Nhật Chi Lục Hại / 三刑 — cùng bug-class loop 290/324: zhiRel chỉ bắt
  //   合/Xung, bỏ sót Hại/Hình ở CUNG PHU THÊ (quan trọng nhất). Lớn hơn year (~2×).
  const dza = a.pillars.day.zhi, dzb = b.pillars.day.zhi;
  const dHai = HAI_PAIRS.find((h) => h.pair.includes(dza) && h.pair.includes(dzb) && dza !== dzb);
  // [loop 550 FIX] skip 刑 nếu cặp đã Xung/Hợp — tránh double-count (vd 丑未: 冲-18+形-12=-30)
  //   và mâu thuẫn (vd 巳申: 合+18 + 形-12 = vừa hợp vừa khắc cùng cặp).
  const dXingBlocked = dayZhiRel.type === 'xung' || dayZhiRel.type === 'lục hợp' || dayZhiRel.type === 'tam hợp';
  const dXing = dXingBlocked ? null : XING_PAIRS.find((x) => x.pair.includes(dza) && x.pair.includes(dzb) && dza !== dzb);
  if (dHai) { score -= 10; factors.push(`✗ Nhật Chi ${ZHI[dza].vi}–${ZHI[dzb].vi} ${dHai.vi} → CUNG PHU THÊ trệ/tiểu nhân — cần bao dung, tránh so đo.`); }
  if (dXing) { score -= 12; factors.push(`✗ Nhật Chi ${ZHI[dza].vi}–${ZHI[dzb].vi} ${dXing.vi} → CUNG PHU THÊ hình khắc — bất lợi hôn nhân, cần cố ý hóa giải (chọn năm cát cưới).`); }

  // 4b. [loop 22 NEW] 十神 spouse-star cross-check (giới tính): nam lấy 财 làm vợ, nữ lấy 官
  //   làm chồng. Nếu Nhật Chủ A nhìn B đúng sao phối ngẫu (và B nhìn A) → tín hiệu mạnh.
  const aMale = (a.input && a.input.gender) === 'nam';
  const bMale = (b.input && b.input.gender) === 'nam';
  const wifeGods = ['正財', '偏財']; // nam → vợ = Tài
  const husbGods = ['正官', '七殺']; // nữ → chồng = Quan Sát
  const aSeesB = tenGod(a.dayGan, b.dayGan);
  const bSeesA = tenGod(b.dayGan, a.dayGan);
  const aHit = (aMale ? wifeGods : husbGods).includes(aSeesB);
  const bHit = (bMale ? wifeGods : husbGods).includes(bSeesA);
  if (aHit && bHit) { score += 14; factors.push(`★ Sao phối ngẫu tương ứng: A (nhìn B = ${aSeesB}) đúng sao vợ/chồng, B (nhìn A = ${bSeesA}) cũng vậy → duyên "sao mệnh đối ứng" rất mạnh.`); }
  else if (aHit || bHit) { score += 7; factors.push(`✓ Một bên nhìn đối phương đúng sao phối ngẫu (${aHit ? 'A' : 'B'}) → duyên có chiều.`); }

  // [loop 357] 命卦 (八宅) compat — cùng nhóm Đông/Tứ Tứ Mệnh → thuận sống chung; khác nhóm → trệ phong thuỷ ở chung.
  try {
    const za = computeZhai(a.input.year, a.input.gender);
    const zb = computeZhai(b.input.year, b.input.gender);
    const ga = (za.grpVi || '').includes('Tây') ? 'Tây' : 'Đông';
    const gb = (zb.grpVi || '').includes('Tây') ? 'Tây' : 'Đông';
    if (ga === gb) { score += 6; factors.push(`✓ Cùng nhóm Mệnh quái ${ga} Tứ Mệnh (${za.guaName}/${zb.guaName}) → thuận ở chung, hướng nhà/bếp hợp cả hai.`); }
    else { score -= 4; factors.push(`• Khác nhóm Mệnh quái (${ga} vs ${gb} Tứ Mệnh) → phong thuỷ ở chung cần thỏa hiệp hướng (chọn hướng Đông/Tây trung tính hoặc dụng người yếu hơn).`); }
  } catch (e) {}

  // 5. [loop 530] 納音配婚 (Nayin marriage compatibility — classical 納音論)
  try {
    const na = ganZhiNayin(a.dayGan + a.pillars.day.zhi);
    const nb = ganZhiNayin(b.dayGan + b.pillars.day.zhi);
    const SHENG5 = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
    const KE5 = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };
    const nayinWx = { '海中金':'金','炉中火':'火','大林木':'木','路旁土':'土','剑锋金':'金','山头火':'火','涧下水':'水','城头土':'土','白蜡金':'金','杨柳木':'木','泉中水':'水','屋上土':'土','霹雳火':'火','松柏木':'木','长流水':'水','沙中金':'金','沙中土':'土','山下火':'火','平地木':'木','壁上土':'土','金箔金':'金','覆灯火':'火','天河水':'水','大驿土':'土','钗钏金':'金','桑柘木':'木','大溪水':'水','砂中金':'金','天上火':'火','石榴木':'木','大海水':'水' };
    const wa = nayinWx[na] || '?', wb = nayinWx[nb] || '?';
    if (wa !== '?' && wb !== '?') {
      if (SHENG5[wa] === wb && SHENG5[wb] !== wa) { score += 8; factors.push(`✓ Nạp âm tương sinh: ${na}(${wa}) sinh ${nb}(${wb}) → CỔ PHÁP «納音相生為上婚» — bồi bổ bẩm sinh.`); }
      else if (SHENG5[wb] === wa && SHENG5[wa] !== wb) { score += 8; factors.push(`✓ Nạp âm tương sinh: ${nb}(${wb}) sinh ${na}(${wa}) → «納音相生為上婚».`); }
      else if (SHENG5[wa] === wb && SHENG5[wb] === wa) { score += 5; factors.push(`✓ Nạp âm tương sinh lẫn nhau (${na}/${nb}) → «納音互生» cực thuận.`); }
      else if (KE5[wa] === wb || KE5[wb] === wa) { score -= 6; factors.push(`• Nạp âm tương khắc: ${na}(${wa}) ↔ ${nb}(${wb}) → «納音相剋為次婚» — bản chất hơi xung, cần bao dung.`); }
      else if (wa === wb) { score += 3; factors.push(`• Nạp âm đồng hành (${na}/${nb}, cùng ${wa}) → «納音比和» — trung tính, hiểu nhau.`); }
      else { factors.push(`• Nạp âm ${na}(${wa}) – ${nb}(${wb}): quan hệ trung tính.`); }
    }
  } catch (e) {}

  score = Math.max(5, Math.min(98, Math.round(score)));
  let rating, verdict;
  if (score >= 78) { rating = 'Đại hợp'; verdict = 'Rất hợp — Ngũ Hành tương bổ, cung phối ngẫu tương đắc; nên tiến tới.'; }
  else if (score >= 62) { rating = 'Hợp'; verdict = 'Khá hợp — có bổ trợ, có thể chung sống lâu dài, cần bao dung chỗ thiếu.'; }
  else if (score >= 45) { rating = 'Trung'; verdict = 'Bình thường — hợp một mặt, khắc một mặt, phụ thuộc nỗ lực vun đắp.'; }
  else { rating = 'Khắc'; verdict = 'Khó hợp — nhiều xung khắc, cần cố ý hóa giải (chọn năm cát, bao dung, hoặc chỉ hợp tác kinh doanh).'; }

  return { score, rating, factors, verdict };
}
