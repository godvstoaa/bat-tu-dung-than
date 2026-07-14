// ============================================================================
//  NGHIỆM CHỨNG GIA TỘC BÁT TỰ (家族八字交叉验证) — đa trụ gia tộc
//  Engine thuần deterministic: nhận R = analyze() của chủ thể + người thân,
//  chấm độ nhất quán đa trục cổ pháp. Không phụ thuộc UI.
//  6 trục: (1) vai trò phản nghiệm 十神角色互验 · (2) cung★ tiền nghiệm 星宫交叉验证
//  · (3) can-chi tương tác · (4) cân bằng ngũ hành gia tộc · (5) thời vận
//  · (6) nạp âm tương quan. Xuất pair + cluster + ledger + radar.
//  Nguồn: 子平真诠(十神六亲) · 渊海子平(宫位) · 家族八字互验法 · 校正时辰.
// ============================================================================
import { GAN, ZHI, WX_VI, SHENG, KE, SHENG_BY, KE_BY, TEN_GOD_VI } from './constants.js';
import { nayinInfo } from './nayin.js';

// ---- CATALOG VAI TRÒ ----
export const ROLE = {
  father:  { vi: 'Cha',         palace: 'month' },
  mother:  { vi: 'Mẹ',         palace: 'month' },
  sibling: { vi: 'Anh/chị/em',  palace: 'month' },
  spouse:  { vi: 'Vợ/Chồng',    palace: 'day'   },
  child:   { vi: 'Con cái',     palace: 'time'  },
};
export const PALACE_VI = { year: 'Trụ Năm', month: 'Trụ Tháng', day: 'Trụ Ngày', time: 'Trụ Giờ' };

// ---- SAO + HÀNH ĐẠI DIỆN 1 VAI TRÒ (nhìn TỪ chủ thể) — chuẩn 渊海子平/邵伟华 ----
// Trùng starMap() trong liuqin.js — chuẩn hoá ở đây để DRY (sau này liuqin import đây).
/** @returns {{ wx:string, gods:string[] }} */
export function elementForRole(dayGan, isMale, role, partnerGender) {
  const dmWx = GAN[dayGan].wx;
  // [SAME-SEX] partner cùng giới → spouse = peer (cùng hành, 比/劫) — lens hiện đại, không cổ chuẩn.
  const _normG = (g) => ({ nam: 'nam', 'nữ': 'nu', nu: 'nu', male: 'nam', female: 'nu' })[String(g || '').toLowerCase()] || '';
  const _sameSex = !!(partnerGender && _normG(partnerGender) === _normG(isMale ? 'nam' : 'nu'));
  const map = {
    father:  { wx: KE[dmWx],       gods: ['偏財', '正財'] },      // ta khắc = Tài → cha
    mother:  { wx: SHENG_BY[dmWx], gods: ['正印', '偏印'] },     // sinh ta = Ấn → mẹ
    sibling: { wx: dmWx,           gods: ['比肩', '劫財'] },      // đồng hành
    spouse:  _sameSex
      ? { wx: dmWx,         gods: ['比肩', '劫財'] }            // [SAME-SEX] partner = peer (cùng hành)
      : (isMale
        ? { wx: KE[dmWx],      gods: ['正財', '偏財'] }          // nam: vợ = Tài
        : { wx: KE_BY[dmWx],   gods: ['正官', '七殺'] }),         // nữ: chồng = Quan
    child:   isMale
      ? { wx: KE_BY[dmWx],   gods: ['七殺', '正官'] }            // nam: con = Quan Sát
      : { wx: SHENG[dmWx],   gods: ['食神', '傷官'] },           // nữ: con = Thực Thương
  };
  return map[role];
}

// ---- TRỤC 1: VAI TRÒ PHẢN NGHIỆM (role reciprocity) — cân 0.35 ----
// A nhìn B qua vai trò ρ → ρ ứng hành X. B thật có 日 chủ = X? X vượng? → chấm.
export function scoreReciprocity(S, R, role) {
  const isMale = S.chart.input.gender === 'nam';
  const need = elementForRole(S.chart.dayGan, isMale, role, S.chart.input?.partner);
  const rDmWx = R.chart.dayMaster.wx;
  const rHas = (R.wx.score[need.wx] || 0) / (R.wx.total || 1);
  const reasons = [];
  let score;
  if (rDmWx === need.wx) {
    score = 100;
    reasons.push(`✓ ${ROLE[role].vi}: Nhật Chủ người này ${R.chart.dayMaster.gan} ${WX_VI[rDmWx]} = đúng hành "${need.gods.map((g) => TEN_GOD_VI[g]).join('/')}" mà chủ thể quy định cho ${ROLE[role].vi} (hành ${WX_VI[need.wx]}). Khớp hoàn hảo.`);
  } else if (rHas >= 0.20) {
    score = 70;
    reasons.push(`● ${ROLE[role].vi}: Nhật Chủ ${WX_VI[rDmWx]} (không trùng ${WX_VI[need.wx]}), nhưng hành ${WX_VI[need.wx]} chiếm ${(rHas * 100).toFixed(0)}% trong lá → vai trò vẫn hiện diện mạnh.`);
  } else if (SHENG[rDmWx] === need.wx || SHENG_BY[rDmWx] === need.wx) {
    score = 45;
    reasons.push(`• ${ROLE[role].vi}: Nhật Chủ ${WX_VI[rDmWx]} sinh ra / được sinh bởi hành ${WX_VI[need.wx]} → liên hệ gián tiếp, vai trò mờ.`);
  } else if (KE[rDmWx] === need.wx) {
    score = 30;
    reasons.push(`⚠ ${ROLE[role].vi}: Nhật Chủ ${WX_VI[rDmWx]} khắc hành ${WX_VI[need.wx]} của vai trò → quan hệ có xung khắc chủ quan.`);
  } else {
    score = 15;
    reasons.push(`✗ ${ROLE[role].vi}: Nhật Chủ ${WX_VI[rDmWx]} không liên quan hành ${WX_VI[need.wx]} → vai trò không phản ánh trong lá người này. Có thể sai giờ/dữ liệu.`);
  }
  return { score, reasons };
}

// ---- TRỤC 2: CUNG★ TIỀN NGHIỆM (palace-star forward) — cân 0.20 ----
// Cung ρ trong lá S: sao ρ có tại cung? cung có bị xung/hình?
// + đối chiếu thực tế lá R (grade synthesis) → nhất quán hay mâu thuẫn.
const PALACE_PILLAR = { father: 'month', mother: 'month', sibling: 'month', spouse: 'day', child: 'time' };
function pillarGodsAt(pillar) {
  const out = [pillar.ganGod];
  for (const h of pillar.hidden) out.push(h.god);
  return out.filter((g) => g && g !== '日主');
}
export function scorePalaceForward(S, R, role) {
  const isMale = S.chart.input.gender === 'nam';
  const need = elementForRole(S.chart.dayGan, isMale, role, S.chart.input?.partner);
  const palKey = PALACE_PILLAR[role];
  const pillar = S.chart.pillars[palKey];
  const godsAt = pillarGodsAt(pillar);
  const starPresent = need.gods.some((g) => godsAt.includes(g));
  const zhi = pillar.zhi;
  const unstable = S.interactions.chong.some((c) => c.a === zhi || c.b === zhi)
    || S.interactions.xing.some((c) => c.a === zhi || c.b === zhi);
  const rGrade = (R.synthesis && typeof R.synthesis.score === 'number') ? R.synthesis.score : 55;
  let score = 50;
  const reasons = [];
  if (starPresent && !unstable) {
    score += 22;
    reasons.push(`✓ Cung ${ROLE[role].vi} (${PALACE_VI[palKey]}) có đúng sao ${need.gods.map((g) => TEN_GOD_VI[g]).join('/')} và cung yên → dự đoán vai trò tốt.`);
  } else if (starPresent && unstable) {
    score += 6;
    reasons.push(`● Cung ${ROLE[role].vi} có sao đúng nhưng bị xung/hình → vai trò biến động.`);
  } else {
    score -= 6;
    reasons.push(`• Cung ${ROLE[role].vi} không thấy rõ sao vai trò → vai trò mờ/ẩn.`);
  }
  const predictGood = starPresent && !unstable;
  const rGood = rGrade >= 55;
  if (predictGood === rGood) {
    score += 14;
    reasons.push(`✓ Nhất quán: dự đoán ${predictGood ? 'tốt' : 'khó'} ↔ thực tế lá ${ROLE[role].vi} ${rGood ? 'khá tốt' : 'trở ngại'} (grade ${rGrade}).`);
  } else {
    score -= 10;
    reasons.push(`⚠ Mâu thuẫn: dự đoán ${predictGood ? 'tốt' : 'khó'} nhưng lá ${ROLE[role].vi} thực tế ${rGood ? 'khá tốt' : 'trở ngại'} (grade ${rGrade}) — nên đối chiếu giờ/dữ liệu.`);
  }
  return { score: Math.max(5, Math.min(100, Math.round(score))), reasons };
}

// ---- TRỤC 3: CAN-CHI TƯƠNG TÁC (stem-branch cross) — cân 0.15 ----
const SANHE = [['申', '子', '辰'], ['寅', '午', '戌'], ['巳', '酉', '丑'], ['亥', '卯', '未']];
const LIUHE = ['子丑', '寅亥', '卯戌', '辰酉', '巳申', '午未'];
const CHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
const GAN_HE5 = { '甲己': 1, '乙庚': 1, '丙辛': 1, '丁壬': 1, '戊癸': 1 };
function zhiRel(a, b) {
  if (a === b) return { type: 'tự', vi: 'tự hợp/đồng chi' };
  if (LIUHE.some((p) => (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a))) return { type: 'lục hợp', vi: 'Lục Hợp' };
  if (CHONG[a] === b) return { type: 'xung', vi: 'Lục Xung' };
  for (const t of SANHE) if (t.includes(a) && t.includes(b)) return { type: 'tam hợp', vi: 'Tam Hợp' };
  return { type: 'bình', vi: 'bình' };
}
export function scoreStemBranch(S, R, role) {
  const a = S.chart, b = R.chart;
  let score = 50;
  const reasons = [];
  const yRel = zhiRel(a.pillars.year.zhi, b.pillars.year.zhi);
  if (yRel.type === 'tam hợp') { score += 12; reasons.push(`✓ Chi năm ${ZHI[a.pillars.year.zhi].vi}–${ZHI[b.pillars.year.zhi].vi} ${yRel.vi} → hai tuổi hòa.`); }
  else if (yRel.type === 'lục hợp') { score += 8; reasons.push(`✓ Chi năm ${yRel.vi}.`); }
  else if (yRel.type === 'xung') { score -= 10; reasons.push(`⚠ Chi năm ${ZHI[a.pillars.year.zhi].vi}–${ZHI[b.pillars.year.zhi].vi} Xung → tuổi xung khắc nhẹ.`); }
  const dRel = zhiRel(a.pillars.day.zhi, b.pillars.day.zhi);
  if (dRel.type === 'lục hợp' || dRel.type === 'tam hợp') { score += 12; reasons.push(`✓ Nhật Chi ${dRel.vi} → cung mệnh tương đắc.`); }
  else if (dRel.type === 'xung') { score -= 12; reasons.push(`⚠ Nhật Chi Xung → bản ngã dễ va chạm.`); }
  const dg = a.dayGan + b.dayGan;
  if (GAN_HE5[dg] || GAN_HE5[dg.split('').reverse().join('')]) { score += 10; reasons.push(`✓ Nhật Can ${a.dayGan}–${b.dayGan} ngũ hợp → tâm đầu ý hợp.`); }
  return { score: Math.max(5, Math.min(100, Math.round(score))), reasons };
}

// ---- TRỤC 6: NẠP ÂM TƯƠNG QUAN — cân 0.05 ----
const NAYIN_NOTE = { same: 'tỷ hòa–hài hoà', sheng: 'B nuôi dưỡng A', ke: 'B kiểm soát A', shengBy: 'B được A nuôi', keBy: 'B bị A kiểm soát' };
export function scoreNayin(S, R, role) {
  const dayWx = (pillar) => { const ni = nayinInfo(pillar.nayin); return ni?.wx || (pillar.nayin || '').slice(-1); };
  const aWx = dayWx(S.chart.pillars.day), bWx = dayWx(R.chart.pillars.day);
  let rel = '';
  if (aWx === bWx) rel = 'same';
  else if (SHENG[aWx] === bWx) rel = 'sheng';
  else if (KE[aWx] === bWx) rel = 'ke';
  else if (SHENG[bWx] === aWx) rel = 'shengBy';
  else if (KE[bWx] === aWx) rel = 'keBy';
  const map = { same: 90, shengBy: 80, sheng: 65, ke: 50, keBy: 40, '': 55 };
  const reasons = [`Nạp âm nhật trụ: ${S.chart.pillars.day.nayin}(${WX_VI[aWx]}) ↔ ${R.chart.pillars.day.nayin}(${WX_VI[bWx]}) → ${NAYIN_NOTE[rel] || 'bình'}.`];
  return { score: map[rel], reasons };
}

// ---- TRỤC 4: CÂN BẰNG NGŨ HÀNH GIA TỘC (cluster) — cân 0.15 ----
export function scoreFamilyBalance(center, members) {
  const all = [center.R, ...members.map((m) => m.R)];
  const need = center.R.yong.primary;
  let sum = 0;
  all.forEach((R) => { sum += (R.wx.score[need] || 0) / (R.wx.total || 1); });
  const avg = sum / all.length;
  let score = Math.round(Math.min(100, avg * 320));
  const reasons = [`Cả gia tộc (${all.length} người) trung bình hành ${WX_VI[need]} (Dụng chủ thể) = ${(avg * 100).toFixed(0)}%. ${avg >= 0.2 ? '✓ Gia đình tự bổ Dụng' : '• Dụng ít được gia đình hỗ trợ, chủ thể tự lập.'}`];
  const present = new Set();
  all.forEach((R) => { Object.entries(R.wx.score).forEach(([w, v]) => { if (v > 0) present.add(w); }); });
  if (present.size >= 4) { score = Math.min(100, score + 8); reasons.push(`✓ Ngũ Hành gia tộc đa dạng (${[...present].map((w) => WX_VI[w]).join('/')}) → bổ sung lẫn nhau.`); }
  return { score: Math.max(5, Math.min(100, score)), reasons };
}

// ---- TRỤC 5: THỜI VẬN TƯƠNG QUAN (cluster) — cân 0.10 ----
export function scoreTimingCorrelation(center, members) {
  const dayun = center.R.dayun || [];
  if (!members.length || !dayun.length) return { score: 55, reasons: ['(chưa đủ dữ liệu thời vận)'] };
  let hits = 0;
  const reasons = [];
  for (const m of members) {
    const bYear = m.R.chart.input.year;
    const dy = dayun.find((d) => bYear >= d.startYear && bYear < d.startYear + 10);
    if (dy) {
      const cat = dy.rating === 'Cát' || dy.rating === 'Hơi thuận';
      if (cat) { hits++; reasons.push(`✓ ${ROLE[m.role]?.vi || m.label}: sinh ${bYear} trong đại vận ${dy.ganZhi} (${dy.rating}) → cát.`); }
      else if (dy.rating === 'Hung' || dy.rating === 'Hơi nghịch') { reasons.push(`⚠ ${ROLE[m.role]?.vi || m.label}: sinh ${bYear} trong đại vận ${dy.ganZhi} (${dy.rating}) → trở ngại.`); }
    }
  }
  return { score: Math.max(5, Math.min(100, 45 + Math.round(hits / members.length * 55))), reasons };
}

// ---- TỔNG HỢP TỪNG CẶP ----
export function analyzePair(S, R, role) {
  const reciprocity = scoreReciprocity(S, R, role);
  const palaceForward = scorePalaceForward(S, R, role);
  const stemBranch = scoreStemBranch(S, R, role);
  const nayin = scoreNayin(S, R, role);
  const pairW = { reciprocity: 0.45, palaceForward: 0.25, stemBranch: 0.20, nayin: 0.10 };
  const pairScore = Math.round(
    reciprocity.score * pairW.reciprocity + palaceForward.score * pairW.palaceForward
    + stemBranch.score * pairW.stemBranch + nayin.score * pairW.nayin
  );
  const ledger = [];
  [reciprocity, palaceForward, stemBranch, nayin].forEach((ax) => {
    ax.reasons.forEach((r) => {
      if (r.startsWith('✓')) ledger.push({ ok: true, msg: r });
      else if (r.startsWith('⚠') || r.startsWith('✗')) ledger.push({ ok: false, msg: r });
    });
  });
  const rating = pairScore >= 72 ? 'Khớp cao' : pairScore >= 55 ? 'Khớp vừa' : pairScore >= 40 ? 'Lệch nhẹ' : 'Lệch lớn';
  return { role, roleVi: ROLE[role].vi, pairScore, rating, axes: { reciprocity, palaceForward, stemBranch, nayin }, ledger };
}

function avgAx(pairs, key) {
  const v = pairs.map((p) => p.pair.axes[key]?.score).filter((x) => x != null);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 50;
}

// ---- TỔNG HỢP CẢ CỤM ----
// center: { R, label? }   members: [{ role, label, R, hourUnknown? }]
export function analyzeFamily(center, members) {
  const pairs = members.map((m) => ({ role: m.role, label: m.label, hourUnknown: !!m.hourUnknown, pair: analyzePair(center.R, m.R, m.role) }));
  const familyBalance = scoreFamilyBalance(center, members);
  const timing = scoreTimingCorrelation(center, members);
  const avgPair = pairs.length ? pairs.reduce((a, p) => a + p.pair.pairScore, 0) / pairs.length : 50;
  const score = Math.round(avgPair * 0.75 + familyBalance.score * 0.15 + timing.score * 0.10);
  // [loop 459] recalibrate theo percentile 120 gia đình (range 47-77, median 59). Cũ 72/55/40
  //   khiến «mâu thuẫn nhiều» (<40) CHẾT (min thực tế 47) + «khá» quá rộng (75%). Nay neo p85/p45/p15.
  const rating = score >= 67 ? 'Gia tộc nhất quán cao' : score >= 57 ? 'Gia tộc khá nhất quán' : score >= 51 ? 'Gia tộc lệch nhẹ' : 'Gia tộc mâu thuẫn nhiều';
  const ledger = [];
  pairs.forEach((p) => p.pair.ledger.forEach((l) => ledger.push({ ...l, who: p.label || ROLE[p.role].vi })));
  [familyBalance, timing].forEach((ax) => ax.reasons.forEach((r) => ledger.push({ ok: !/⚠|✗/.test(r), msg: r, who: 'Cả gia tộc' })));
  const confirms = ledger.filter((l) => l.ok).length;
  const radar = [
    { axis: 'Vai trò', value: avgAx(pairs, 'reciprocity') },
    { axis: 'Cung★', value: avgAx(pairs, 'palaceForward') },
    { axis: 'Can-Chi', value: avgAx(pairs, 'stemBranch') },
    { axis: 'Ngũ hành', value: familyBalance.score },
    { axis: 'Thời vận', value: timing.score },
    { axis: 'Nạp âm', value: avgAx(pairs, 'nayin') },
  ].map((d) => ({ ...d, value: +(d.value / 10).toFixed(1) }));
  return { center, members, pairs, familyBalance, timing, score, rating, ledger, confirms, conflicts: ledger.length - confirms, radar };
}
