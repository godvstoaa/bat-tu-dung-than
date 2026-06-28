// ============================================================================
//  LỤC THÂN ĐOẠN — 家庭全息 / 以亲测主 (FAMILY HOLOGRAPHIC DEDUCTION)  [loop 626]
//  ----------------------------------------------------------------------------
//  Khác với family.js (chỉ CHẤM ĐIỂM nhất quán), engine này DUYỆT sâu + SUY LUẬN:
//  Lấy lá số chủ thể + lá số THẬT của người thân →
//    (1) Đọc «sao lục thân» (十神) + «cung» (四柱宫位) trong lá chủ thể → dự đoán số phận mỗi người thân.
//    (2) Đối chiếu dự đoán với lá THẬT của người thân đó (điểm mệnh, vượng nhược, đại vận)
//        → XÁC NHẬN (verified) hay PHỦ NHẬN (refuted) + bật ra điều ẩn.
//    (3) Đảo ngược — dùng gia đình SUY ra điều mà lá chủ thể «không nói thẳng» (holographic).
//
//  Cổ pháp: 子平真诠(十神六亲) · 渊海子平(宫位) · 大宗师六亲反推(全息融合).
//  NGUỒN (crawled/researched loop 626): starbook.ai/wiki/liuqin-duanfa,
//    zhuanlan.zhihu.com 六亲推断, 渊海子平·六亲第四, ifeng 论六亲原则.
//  KHÔNG dự đoán y tế/chết chóc — chỉ xu hướng + khuyến nghị. Disclaimer rõ.
// ============================================================================
import { WX_VI, TEN_GOD_VI, SHENG, KE } from './constants.js';
import { elementForRole, ROLE, PALACE_VI } from './family.js';
import { personalTaSui } from './taisui.js'; // [loop 643] family taisui overview

const PALACE_PILLAR = { father: 'month', mother: 'month', sibling: 'month', spouse: 'day', child: 'time' };
const ROLE_VI_LONG = { father: 'Cha', mother: 'Mẹ', sibling: 'Anh/chị/em', spouse: 'Vợ/chồng', child: 'Con cái' };
// [loop 643] solar year → địa chi (子=0..亥=11). (year-4)%12 vì 4 AD = 甲子.
const _ZHI12 = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const _yearZhiOf = (year) => _ZHI12[((year - 4) % 12 + 12) % 12];

// Ngũ hành VI + tương quan cho diễn giải
const SHENG_VI = { 木: 'Mộc sinh Hỏa', 火: 'Hỏa sinh Thổ', 土: 'Thổ sinh Kim', 金: 'Kim sinh Thủy', 水: 'Thủy sinh Mộc' };
const KE_VI = { 木: 'Mộc khắc Thổ', 土: 'Thổ khắc Thủy', 水: 'Thủy khắc Hỏa', 火: 'Hỏa khắc Kim', 金: 'Kim khắc Mộc' };

function pillarGodsAt(pillar) {
  const out = [pillar.ganGod];
  for (const h of pillar.hidden) out.push(h.god);
  return out.filter((g) => g && g !== '日主');
}
function isZhiUnstable(S, zhi) {
  return (S.interactions?.chong || []).some((c) => c.a === zhi || c.b === zhi)
    || (S.interactions?.xing || []).some((c) => c.a === zhi || c.b === zhi);
}

// Sức khoẻ của một sao (hành) trong lá chủ thể: tỷ trọng + bị khắc?
function starHealth(S, needWx) {
  const score = (S.wx?.score?.[needWx] || 0);
  const total = S.wx?.total || 1;
  const pct = score / total;
  // hành khắc needWx = hành «tàn phá» sao này
  const damager = Object.keys(KE).find((k) => KE[k] === needWx);
  const damagerPct = (S.wx?.score?.[damager] || 0) / total;
  let level, note;
  if (pct >= 0.25) { level = 'strong'; note = `hành ${WX_VI[needWx]} vượng (${(pct * 100).toFixed(0)}%) → sao lục thân HIỆN + MẠNH`; }
  else if (pct >= 0.12) { level = 'mid'; note = `hành ${WX_VI[needWx]} vừa phải (${(pct * 100).toFixed(0)}%) → sao lục thân hiện ở mức trung`; }
  else { level = 'weak'; note = `hành ${WX_VI[needWx]} nhược (${(pct * 100).toFixed(0)}%) → sao lục thần MỜ/ẨN`; }
  if (damagerPct >= 0.25) note += `. ⚠ Nhưng bị hành ${WX_VI[damager]} (${(damagerPct * 100).toFixed(0)}%) khắc (tàn) → sao BỊ TỔN`;
  return { level, pct, note, damager, damagerPct };
}

// Đánh giá lá THẬT của người thân: điểm mệnh + vượng nhược + đại vận đỉnh
function relativeActual(R) {
  const sc = R.synthesis?.score ?? 55;
  const strong = R.strength?.strong;
  const topDy = (R.dayun || []).filter((d) => /Đại cát|Cát/.test(d.rating)).slice(0, 2)
    .map((d) => `${d.ganZhi}(${d.startAge}-${d.startAge + 9}t)`);
  const badDy = (R.dayun || []).filter((d) => /Hung|nghịch/.test(d.rating)).slice(0, 2)
    .map((d) => `${d.ganZhi}(${d.startAge}-${d.startAge + 9}t)`);
  return {
    score: sc, grade: sc >= 62 ? 'cao' : sc >= 41 ? 'trung' : 'thấp',
    strong, topDy, badDy,
    dm: `${R.chart.dayMaster.vi} ${WX_VI[R.chart.dayMaster.wx]}`,
  };
}

// =====================================================================
//  API CHÍNH: deduceFromFamily(subject, members)
//    subject: R (analyze() của chủ thể)
//    members: [{ role, label, R }]  (R = analyze() của người thân)
// =====================================================================
export function deduceFromFamily(subject, members) {
  const S = subject;
  const isMale = S.chart.input.gender === 'nam';
  const results = [];
  for (const m of members) {
    if (!m || !m.R || !m.role) continue;
    const role = m.role;
    const need = elementForRole(S.chart.dayGan, isMale, role);
    if (!need || !PALACE_PILLAR[role]) continue; // [loop 627] role không hợp lệ → bỏ qua (không crash)
    const palKey = PALACE_PILLAR[role];
    const pillar = S.chart.pillars[palKey];
    const godsAt = pillarGodsAt(pillar);
    const starPresent = need.gods.some((g) => godsAt.includes(g));
    const palaceUnstable = isZhiUnstable(S, pillar.zhi);
    const sh = starHealth(S, need.wx);
    const actual = relativeActual(m.R);

    // --- (1) DỰ ĐOÁN từ sao + cung của chủ thể ---
    let prediction, tone;
    if (sh.level === 'strong' && !sh.damagerPct && starPresent && !palaceUnstable) {
      prediction = `Sao ${need.gods.map((g) => TEN_GOD_VI[g]).join('/')} (= ${ROLE_VI_LONG[role]}) vượng + có mặt tại cung ${PALACE_VI[palKey]} yên ổn → chủ thể DỰ ĐOÁN: ${ROLE_VI_LONG[role]} KHỎE MẠNH/thuận lợi, có hậu thuẫn.`;
      tone = 'good';
    } else if (sh.damagerPct >= 0.25) {
      prediction = `Sao ${ROLE_VI_LONG[role]} (hành ${WX_VI[need.wx]}) bị hành ${WX_VI[sh.damager]} khắc mạnh → chủ thể DỰ ĐOÁN: ${ROLE_VI_LONG[role]} gặp KHÓ KHĂN/suy yếu/thử thách.`;
      tone = 'bad';
    } else if (sh.level === 'weak' || !starPresent) {
      prediction = `Sao ${ROLE_VI_LONG[role]} mờ/không lộ rõ ở cung → chủ thể DỰ ĐOÁN: quan hệ với ${ROLE_VI_LONG[role]} NHẠT hoặc duyên mỏng (có thể xa cách/ẩn).`;
      tone = 'weak';
    } else if (palaceUnstable) {
      prediction = `Cung ${ROLE_VI_LONG[role]} (${PALACE_VI[palKey]}, chi ${pillar.zhi}) bị xung/hình → chủ thể DỰ ĐOÁN: quan hệ với ${ROLE_VI_LONG[role]} BIẾN ĐỘNG (lúc tốt lúc xấu, hoặc đứt đoạn).`;
      tone = 'unstable';
    } else {
      prediction = `Sao + cung ${ROLE_VI_LONG[role]} trung bình → quan hệ bình ổn, không大凶大吉.`;
      tone = 'mid';
    }

    // --- (2) XÁC THỰC bằng lá THẬT của người thân ---
    let verify, insight;
    const actualGood = actual.score >= 55;
    // [loop 626 refine] tách riêng «sức sao» khỏi «cung»: sao vượng = người thân có TÁC ĐỘNG mạnh
    //   lên chủ thể (dù đời họ vất vả). Cung bất ổn = quan hệ biến động. Hai trục khác nhau.
    const starStrong = sh.level === 'strong' && sh.damagerPct < 0.25;
    if (starStrong && actualGood) {
      verify = 'XÁC NHẬN ✓ (tác động mạnh)';
      insight = `Sao ${ROLE_VI_LONG[role]} vượng + lá thật (${actual.score}/100, ${actual.dm}) KHÁ → ${ROLE_VI_LONG[role]} vừa GIỎI vừa có ảnh hưởng LỚN tới chủ thể (hậu thuẫn thực, «ấn» mạnh). Tương ứng全息 hoàn hảo.`;
    } else if (starStrong && !actualGood) {
      verify = 'TÁC ĐỘNG MẠNH NHƯNG ĐỜI VẤT VẢ ⚡';
      insight = `Sao ${ROLE_VI_LONG[role]} (hành ${WX_VI[need.wx]}, ${(sh.pct * 100).toFixed(0)}%) vượng trong lá chủ thể → ${ROLE_VI_LONG[role]} có TÁC ĐỘNG/đóng góp LỚN vào đời chủ thể (chủ thể «nợ» / được nuôi bởi người này). NHƯNG lá thật của ${m.label || ROLE_VI_LONG[role]} chỉ ${actual.score}/100 → ĐỜI ${ROLE_VI_LONG[role]} vất vả. Đây là tương ứng全息 kiểu «hy sinh»: người này gánh vác/cho đi nhiều (nên sao mới vượng ở chủ thể) nhưng bản thân nhọc nhằn ${actual.badDy.length ? `(vận Hung ${actual.badDy.join(', ')})` : ''}. Chủ thể nên «bù ơn» bằng hành tương sinh ${WX_VI[need.wx]}.`;
    } else if ((tone === 'bad') && !actualGood) {
      verify = 'XÁC NHẬN ✓';
      insight = `Sao ${ROLE_VI_LONG[role]} bị khắc/tổn → lá thật (điểm ${actual.score}/100) XÁC NHẬN sự suy/khó. Tương ứng全息: tổn sao trong chủ thể = phản ảnh số phận thật của ${ROLE_VI_LONG[role]}. ${actual.badDy.length ? `Vận Hung ${ROLE_VI_LONG[role]}: ${actual.badDy.join(', ')}.` : ''}`;
    } else if ((tone === 'unstable') && !actualGood) {
      verify = 'XÁC NHẬN ✓ (biến động)';
      insight = `Cung ${ROLE_VI_LONG[role]} (chi ${pillar.zhi}) bị xung/hình → quan hệ BIẾN ĐỘNG. Lá thật (${actual.score}/100) cũng phản ánh nhiều biến ${actual.badDy.length ? `(vận Hung ${actual.badDy.join(', ')})` : ''}. Quan hệ lúc gắn lúc đứt, cần chủ động giữ liên lạc.`;
    } else if ((tone === 'good') && !actualGood) {
      verify = 'BẤT NGỜ ⚠';
      insight = `Lá chủ thể dự đoán ${ROLE_VI_LONG[role]} TỐT nhưng lá thật (${actual.score}/100) KÉM HƠN → ${ROLE_VI_LONG[role]} đang trong giai đoạn vận Hung ${actual.badDy.length ? `(${actual.badDy.join(', ')})` : ''}. Khuyên nắm bắt vận tốt ${actual.topDy.length ? actual.topDy.join(', ') : '(chờ đại vận)'} để bứt phá.`;
    } else if ((tone === 'bad' || tone === 'unstable') && actualGood) {
      verify = 'BẤT NGỜ ⚠';
      insight = `Lá chủ thể dự đoán ${ROLE_VI_LONG[role]} khó/biến nhưng lá thật (${actual.score}/100) LẠI KHÁ → ${ROLE_VI_LONG[role]} tự cường vượt số (cổ法「命好不如运好」). Vận đẹp ${actual.topDy.length ? actual.topDy.join(', ') : ''} đang bù đắp.`;
    } else {
      verify = 'TRUNG TÍNH';
      insight = `Quan hệ với ${ROLE_VI_LONG[role]} ở mức trung — lá thật (điểm ${actual.score}/100) không trái ngược dự đoán. ${actual.topDy.length ? `Vận tốt: ${actual.topDy.join(', ')}.` : ''}`;
    }

    results.push({
      role, label: m.label || ROLE_VI_LONG[role],
      star: need.gods.map((g) => TEN_GOD_VI[g]).join('/'),
      starWx: WX_VI[need.wx],
      palace: PALACE_VI[palKey],
      starHealthNote: sh.note,
      prediction, verify, insight,
      relativeActual: actual,
    });
  }

  // --- (3) HOLOGRAPHIC — dùng gia đình SUY ngược chủ thể ---
  const holographic = [];
  const parents = results.filter((r) => r.role === 'father' || r.role === 'mother');
  const strongParents = parents.filter((r) => r.relativeActual.score >= 55).length;
  if (parents.length >= 2) {
    if (strongParents === 2) holographic.push(`🏠 Cả bố lẫn mẹ đều có mệnh根基 tốt → chủ thể được «Ấn tinh» (hậu thuẫn gia đình) vững. Nền tảng tuổi thơ ổn định, thừa hưởng tài sản/trí thức. Đây là lợi thế «phúc đức» khó thấy trong lá chủ thể đơn lẻ.`);
    else if (strongParents === 0) holographic.push(`🏠 Cả bố và mẹ đều mệnh vất vả → chủ thể phải «tự lập» sớm (Ấn tinh suy). Đây có thể là động lực tiến thủ (cổ法「Ấn suy thân cường» = người tự cường), nhưng tuổi thơ nhiều thiếu thốn.`);
  }
  // Đối chiếu đại vận: cha mẹ vận Hung trùng năm chủ thể nhỏ → ảnh hưởng tuổi thơ
  // (đơn giản: nếu parent có badDy rơi vào khoảng chủ thể 0-15t)
  const subjBirthYear = S.chart.input.year;
  const validMembers = members.filter((m) => m && m.R && m.role); // [loop 627] guard null/missing-R
  for (const p of parents) {
    for (const member of validMembers.filter((m) => m.role === p.role)) {
      const badInRange = (member.R.dayun || []).filter((d) => {
        if (!/Hung|nghịch/.test(d.rating)) return false;
        const dyYear = d.startYear || (member.R.chart.input.year + d.startAge);
        return dyYear >= subjBirthYear && dyYear <= subjBirthYear + 15;
      });
      if (badInRange.length) {
        holographic.push(`📅 ${ROLE_VI_LONG[p.role]} (${p.label}) có vận Hung ${badInRange.map((d) => d.ganZhi).join(', ')} rơi vào khoảng chủ thể 0–15 tuổi → giai đoạn này gia đình nhiều biến, in dấu lên tuổi thơ chủ thể (có thể là nguyên nhân «Ấn tổn» nếu thấy trong lá).`);
      }
    }
  }
  // Anh chị em: số lượng + độc lập
  const sibs = validMembers.filter((m) => m.role === 'sibling');
  if (sibs.length) {
    const sibWx = elementForRole(S.chart.dayGan, isMale, 'sibling').wx;
    const sibPct = (S.wx?.score?.[sibWx] || 0) / (S.wx?.total || 1);
    if (sibPct >= 0.25) holographic.push(`👥 Chủ thể có nhiều hành ${WX_VI[sibWx]} (Tỷ/Kiếp ${ (sibPct * 100).toFixed(0) }%) → anh chị em nhiều + có sức, nhưng dễ cạnh tranh/phân gia. Đối chiếu thực: ${sibs.length} người ghi nhận.`);
    else holographic.push(`👥 Tỷ/Kiếp nhược → duyên anh chị em mỏng hoặc chủ thể «độc hành» trong nhà.`);
  }
  // Con cái (nếu có)
  const kids = validMembers.filter((m) => m.role === 'child');
  if (kids.length) {
    const childStar = elementForRole(S.chart.dayGan, isMale, 'child');
    const ksh = starHealth(S, childStar.wx);
    holographic.push(`🧒 Sao con (${childStar.gods.map((g) => TEN_GOD_VI[g]).join('/')}, ${WX_VI[childStar.wx]}): ${ksh.note}. ${kids.length} con ghi nhận — đối chiếu lá con thật để «chọn giờ đẻ» bài học cho sau.`);
  }
  // [loop 643] FAMILY THÁI TUẾ — ai trong nhà phạm thái tuế năm nay (cần hóa giải).
  //   Cảnh báo sớm: vd em gái 子 năm 午 冲太岁 (nặng). Trước đây family analysis không có.
  const tsYear = new Date().getFullYear();
  const tsOffenders = [];
  const subjZhi = S.chart.pillars?.year?.zhi;
  if (subjZhi) {
    const ps = personalTaSui(subjZhi, _yearZhiOf(tsYear));
    if (ps.offends) tsOffenders.push({ who: 'chủ thể', zhi: subjZhi, msg: ps.msg, level: ps.level });
  }
  for (const m of validMembers) {
    const z = m.R?.chart?.pillars?.year?.zhi;
    if (!z) continue;
    const ps = personalTaSui(z, _yearZhiOf(tsYear));
    if (ps.offends) tsOffenders.push({ who: m.label || ROLE_VI_LONG[m.role], zhi: z, msg: ps.msg, level: ps.level });
  }
  if (tsOffenders.length) {
    holographic.push(`⛩️ THÁI TUẾ ${tsYear}: ${tsOffenders.map((o) => `${o.who} (${o.zhi}) — ${o.msg}`).join(' | ')}. Người phạm nên hóa giải (an thái tuế /佩 tam hợp /trị huyết quang /đỗ xuân) — đặc biệt 冲太岁 (nặng) thì tránh thay đổi lớn đầu năm.`);
  } else {
    holographic.push(`⛩️ THÁI TUẾ ${tsYear}: cả nhà KHÔNG ai phạm thái tuế nặng — bình an.`);
  }
  // [loop 646] VẬN HIỆN CẢ NHÀ — mỗi người đang ở đại vận gì (peak/khó) → ai cần hỗ trợ.
  //   Cổ法 «一家之兴衰，观其成员之运»: tổng khí cả nhà = tổng vận các thành viên.
  const curYear = new Date().getFullYear();
  const famFortune = [];
  // chủ thể
  const subjDy = (S.dayun || []).find((d) => { const a = curYear - S.chart.input.year; return a >= d.startAge && a < d.startAge + 10; });
  if (subjDy) famFortune.push({ who: 'chủ thể', r: subjDy.rating });
  for (const m of validMembers) {
    const age = curYear - m.R.chart.input.year;
    const dy = (m.R.dayun || []).find((d) => age >= d.startAge && age < d.startAge + 10);
    if (dy) famFortune.push({ who: m.label || ROLE_VI_LONG[m.role], r: dy.rating });
  }
  if (famFortune.length) {
    const peak = famFortune.filter((f) => f.r === 'Đại cát').map((f) => f.who);
    const hard = famFortune.filter((f) => /Hung|nghịch/.test(f.r)).map((f) => f.who);
    const detail = famFortune.map((f) => `${f.who}=${f.r}`).join(', ');
    let note = `🎭 VẬN HIỆN CẢ NHÀ (${curYear}): ${detail}.`;
    if (peak.length) note += ` ⭐ Đang ĐỈNH VẬN: ${peak.join(', ')} — nên tiến thủ lớn.`;
    if (hard.length) note += ` ⚠ Đang vận khó: ${hard.join(', ')} — cần hỗ trợ/khích lệ, tránh gây áp lực. [loop 670] Mẹ khó đến ~${(() => { const m = validMembers.find(mm => /Mẹ|mẹ/.test(mm.label||'')); if (!m) return '?'; const dy = (m.R.dayun||[]).find(d => { const a = curYear - m.R.chart.input.year; return a >= d.startAge && a < d.startAge + 10; }); const nxt = (m.R.dayun||[])[(m.R.dayun||[]).indexOf(dy)+1]; return dy ? (m.R.chart.input.year + dy.startAge + 10) + (nxt ? ` → chuyển ${nxt.ganZhi}[${nxt.rating}]` : '') : '?'; })()} —「命好不如运好」vận sẽ đổi.`;
    holographic.push(note);
  }

  return {
    ok: results.length > 0,
    subjectDm: `${S.chart.dayMaster.vi} ${WX_VI[S.chart.dayMaster.wx]}`,
    subjectScore: S.synthesis?.score,
    relations: results,
    holographic,
    summary: results.length
      ? `Đã duyệt ${results.length} người thân qua song trục «sao十神 × cung宫位» của lá chủ thể, rồi đối chiếu lá thật → ${results.filter((r) => r.verify.includes('XÁC NHẬN')).length} tương ứng全息 được xác nhận, ${results.filter((r) => r.verify.includes('BẤT NGỜ')).length} bất ngờ cần lưu ý. ${holographic.length ? 'Có ' + holographic.length + ' insight holographic (suy ngược về chủ thể).' : ''}`
      : '(cần ít nhất 1 người thân có ngày sinh)',
    disclaimer: '六亲断/家庭全息 là kỹ thuật cổ pháp tham chiếu — dùng để HIỂU + đối chiếu, KHÔNG dự đoán y tế/tử vong/sự kiện cụ thể. Vận mệnh chịu tác động đa nhân (cá nhân, hoàn cảnh, nỗ lực).',
  };
}
