// ============================================================================
//  THẦN SÁT HÔN NHÂN (theo NHẬT TRỤ) — 孤鸾 / 阴阳差错 / 八专 / 九丑
//  "Sao chủ hôn nhân bẩm sinh — cớ sao duyên trắc?" — chẩn đoán cổ pháp.
//  Khác shensha-marriage (theo NIÊN CHI: 孤辰寡宿/亡神劫煞): module này theo
//    NHẬT TRỤ (và củng cố bởi THỜI TRỤ) — 4 sao ĐẶC TRƯNG trắc hôn nhân.
//  * 孤鸾煞 (8 nhóm): nam khắc vợ / nữ khắc chồng. "孤鸾日犯本无儿,一见官星得子奇".
//  * 阴阳差错 (12 nhóm): mâu thuẫn với nhà vợ/chồng, hôn nhân vì việc gia đình mà rạn nứt.
//  * 八专 (8 nhóm): "nam sợ bát chuyên" — dâm dục, can-chi đồng khí thái quá, p妨 hại phối ngẫu.
//  * 九丑 (9 nhóm): "nữ sợ cửu sỉu" —妨害, tự toạ đào hoa mộc dục, sắc đẹp gây thị phi.
//  Hóa giải: có QUAN TINH (chính quan/thất sát) → giải 孤鸾; có quý nhân/thiên đức → giảm.
//  Nguồn: 三命通会 卷七 妻室篇, 渊海子平 孤鸾煞, 壶中子 八专九丑.
// ============================================================================

const GULUAN = ['乙巳', '丁巳', '辛亥', '戊申', '壬寅', '戊午', '壬子', '丙午'];
const YINCHACUO = ['丙子', '丁丑', '戊寅', '辛卯', '壬辰', '癸巳', '丙午', '丁未', '戊申', '辛酉', '壬戌', '癸亥'];
const BAZHUAN = ['甲寅', '乙卯', '己未', '丁未', '庚申', '辛酉', '戊戌', '癸亥'];
const JIUZHOU = ['壬子', '壬午', '戊子', '戊午', '乙卯', '己卯', '辛卯', '癸卯', '己酉'];

const STAR_DEF = {
  孤鸾: {
    vi: 'Cô Loan', base: 6,
    meaning: 'Nam khắc vợ / nữ khắc chồng, tình cảm vợ chồng không tốt, hôn nhân trắc trở; dễ hiếm muộn con ("Cô Loan nhật phạm bản vô nhi").',
    verse: '«Cô Loan nhật phạm bản vô nhi, nhất kiến quan tinh đắc tử kỳ» (三命通会).',
    note: 'Đặc trưng: can-chi nhật mang khí tượng "chim trống/chim mái cô độc" (sợ bạn đời).',
  },
  阴阳差错: {
    vi: 'Âm Dương Sai Lạc', base: 5,
    meaning: 'Nữ: mâu thuẫn với cha mẹ chồng / nhà chồng lạnh nhạt. Nam: xung đột với nhà vợ. Hôn nhân rạn nứt thường vì CHUYỆN GIA ĐÌNH (lễ tế, của cải, họ hàng), không phải vì 2 người.',
    verse: '«Âm dương sai lạc — công cô quả hợp,妯娌 bất túc, phu gia lãnh thoái» (渊海子平).',
    note: 'Đặc trưng: sự "sai nhịp" âm-dương giữa 2 họ.',
  },
  八专: {
    vi: 'Bát Chuyên', base: 5,
    meaning: '"Nam sợ Bát Chuyên" — can-chi đồng khí thái quá (dương quá vượng hoặc âm quá vượng), dễ tham dục,妨 hại phối ngẫu, hôn nhân bất ổn; tính cách cương quyết độc đoán.',
    verse: '«Lão tuý Tần lâu thập nhị, trực duyên trọng phạm bát chuyên» (壶中子: già mà chìm chốn phong trần vì trùng Bát Chuyên).',
    note: 'Đặc trưng: nhật can + nhật chi CÙNG HÀNH CÙNG ÂM-DƯƠNG → khí "chuyên" một bên.',
  },
  九丑: {
    vi: 'Cửu Sửu', base: 4,
    meaning: '"Nữ sợ Cửu Sửu" — tự toạ đào hoa mộc dục (tý/ngọ/mão/dậu), dung mạo thường ĐẸP nhưng vì nhan sắc mà招 thị phi, hôn nhân妨 hại, dễ phong ba tình cảm.',
    verse: '«Cửu sỉu vi妨 hại chi thần» (壶中子: Cửu Sửu là thần妨 hại).',
    note: 'Đặc trưng: không phải "xấu" — mà là ĐẸP gây họa.',
  },
};

const PILLAR_VI = { year: 'Niên', month: 'Nguyệt', day: 'Nhật', time: 'Thời' };

function hasGuanXing(R) {
  for (const k of ['year', 'month', 'day', 'time']) {
    const p = R.chart.pillars[k];
    if (p.ganGod === '正官' || p.ganGod === '七殺') return true;
    if ((p.hidden || []).some((h) => h.god === '正官' || h.god === '七殺')) return true;
  }
  return false;
}
function hasMitigator(R) {
  const keys = Object.keys(R.shensha || {});
  return keys.some((n) => /tianYi|tianDe|yueDe|tianYue|guiRen|taiJi/.test(n));
}
function hasTaoHua(R) {
  return Object.keys(R.shensha || {}).some((n) => /taoHua|hongYan|xianChi/.test(n));
}

/**
 * @param {object} R — analyze()
 * @returns {{ hits:[{star,starVi,pillar,pillarVi,ganZhi,severity,meaning,verse,note,mitigated}],
 *            worst, hasGuan, hasNoble, summary }}
 */
export function marriageStars(R) {
  const sets = [['孤鸾', GULUAN], ['阴阳差错', YINCHACUO], ['八专', BAZHUAN], ['九丑', JIUZHOU]];
  const hits = [];

  for (const [star, list] of sets) {
    for (const k of ['year', 'month', 'day', 'time']) {
      const gz = R.chart.pillars[k].gan + R.chart.pillars[k].zhi;
      if (!list.includes(gz)) continue;
      const def = STAR_DEF[star];
      let severity = def.base;
      if (k === 'day') severity += 3;          // nhật trụ = chính
      if (k === 'time') severity += 1;          // thời trụ củng cố
      // 孤鸾: nhật + thời đều phạm = "trùng phạm" rất nặng
      // hóa giải
      let mitigation = '';
      if (star === '孤鸾' && hasGuanXing(R)) { severity -= 3; mitigation = ' ⚖ Có QUAN TINH (Chính Quan/Thất Sát) → "nhất kiến quan tinh đắc tử kỳ": hung giảm, có thể sinh được con.'; }
      if (hasMitigator(R)) { severity -= 1; mitigation += ' Có quý nhân/Thiên Đức → giảm thêm.'; }
      if (hasTaoHua(R)) severity += 1;          // đào hoa + sao hôn = trầm trọng
      severity = Math.max(1, severity);
      hits.push({
        star, starVi: def.vi, pillar: k, pillarVi: PILLAR_VI[k],
        ganZhi: gz, severity, meaning: def.meaning, verse: def.verse, note: def.note,
        mitigated: !!mitigation, mitigation: mitigation.trim(),
      });
    }
  }

  // 孤鸾 "trùng phạm" (nhật + thời cùng phạm) → bonus severity
  const gl = hits.filter((h) => h.star === '孤鸾');
  if (gl.length >= 2) {
    gl.forEach((h) => { h.severity += 2; h.meaning += ' ⚠ TRÙNG PHẠM (≥2 trụ) → khắc nặng.'; });
  }

  const worst = hits.reduce((a, b) => (b.severity > (a?.severity || -1) ? b : a), null);
  const level = !worst ? 'sạch' : worst.severity >= 8 ? 'nặng' : worst.severity >= 5 ? 'trung' : 'nhẹ';
  const hasGuan = hasGuanXing(R);
  const hasNoble = hasMitigator(R);

  let summary;
  if (!hits.length) {
    summary = 'Nhật trụ KHÔNG phạm 4 sao hôn nhân cổ (Cô Loan/Âm-Dương Sai Lạc/Bát Chuyên/Cửu Sửu) — bẩm sinh không mang "khắc" hôn nhân; trắc trở (nếu có) đến từ lưu niên/đại vận (đào hoa, thương quan, thái tuế), KHÔNG phải bẩm sinh.';
  } else {
    let tail;
    if (worst.mitigation) tail = worst.mitigation;
    else if (hasGuan || hasNoble) {
      const aids = [hasGuan && 'Quan tinh (Chính Quan/Thất Sát)', hasNoble && 'quý nhân / Thiên-Đức'].filter(Boolean).join(' + ');
      tail = ` Có ${aids} bẩm sinh → giúp giảm khắc chung.`;
    } else {
      tail = ' Không thấy quý nhân/quan tinh hóa giải → nên chọn 配偶 hợp Dụng Thần + kết hôn năm lưu niên CÁT để giảm khắc.';
    }
    summary = `Phạm ${hits.length} sao hôn nhân (${level}): ${hits.map((h) => `${h.starVi}@${h.pillarVi}(sev${h.severity}${h.mitigated ? ',giảm' : ''})`).join(', ')}. Nặng nhất: ${worst.starVi} — ${worst.meaning.split(/[.。]/)[0]}.${tail}`;
  }

  return { hits, worst, level, hasGuan: hasGuanXing(R), hasNoble: hasMitigator(R), summary };
}

export { GULUAN, YINCHACUO, BAZHUAN, JIUZHOU, STAR_DEF };
