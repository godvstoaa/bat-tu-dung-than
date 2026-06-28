// ============================================================================
//  ĐỊNH VỊ PHONG THỦY — LA BÀN 24 SƠN [loop 631]
//  ----------------------------------------------------------------------------
//  Feature user yêu cầu (từ hội thoại): user chọn hướng (24 sơn / độ la bàn) →
//  app luận CÁT/HUNG theo cổ pháp, gộp NHIỀU tầng:
//    (1) Bát Trạch cá nhân (命卦 4 cát/4 hung — Sinh Khí/Thiên Y/Diên Niên/Phục Vị)
//    (2) Sát phương năm: Thái Tuế / Tuế Phá / Tam Sát / Ngũ Hoàng / Nhị Hắc
//    (3) Phi tinh lưu niên (sao 1-9 đương lệnh tại cung đó)
//    (4) Ngũ hành hướng vs Dụng Thần (bổ Dụng hay không)
//  + bestDirection(): quét 24 sơn → recommend hướng tốt nhất cho mục đích.
//
//  Cổ pháp (researched loop 631): 24 sơn mỗi sơn 15°, nhóm 8 hướng;
//    东四命{1,3,4,9} hợp Đông tứ trạch, 西四命{2,6,7,8} hợp Tây tứ trạch.
//  Nguồn đối chiếu: zhihu 八宅東西四命, wiki.batdongsan Tây tứ mệnh,
//    scribd 东四宅速查表, youtube 24 sơn hướng.
//  KHÔNG đo sensor điện thoại (sai số 5-15°) — user nhập hướng/sơn hoặc la bàn cơ.
// ============================================================================
import { idealHouse } from './ideal-house.js';
import { checkAnnualTaboo } from './annual-taboo.js';
import { yearFlyingStar } from './xuankong.js';

// ---- 24 SƠN: mỗi sơn 15°, từ 337.5° (壬) chiều kim đồng hồ ----
// [shan, vi, palace8 (8-hướng), trungQuai (quẻ giữa hướng)]
const SHAN_24 = [
  ['壬', 'Nhâm', 'Bắc', '子'], ['子', 'Tý', 'Bắc', '子'], ['癸', 'Quý', 'Bắc', '子'],
  ['丑', 'Sửu', 'Đông Bắc', '艮'], ['艮', 'Cấn', 'Đông Bắc', '艮'], ['寅', 'Dần', 'Đông Bắc', '艮'],
  ['甲', 'Giáp', 'Đông', '卯'], ['卯', 'Mão', 'Đông', '卯'], ['乙', 'Ất', 'Đông', '卯'],
  ['辰', 'Thìn', 'Đông Nam', '巽'], ['巽', 'Tốn', 'Đông Nam', '巽'], ['巳', 'Tỵ', 'Đông Nam', '巽'],
  ['丙', 'Bính', 'Nam', '午'], ['午', 'Ngọ', 'Nam', '午'], ['丁', 'Đinh', 'Nam', '午'],
  ['未', 'Mùi', 'Tây Nam', '坤'], ['坤', 'Khôn', 'Tây Nam', '坤'], ['申', 'Thân', 'Tây Nam', '坤'],
  ['庚', 'Canh', 'Tây', '酉'], ['酉', 'Đoài', 'Tây', '酉'], ['辛', 'Tân', 'Tây', '酉'],
  ['戌', 'Tuất', 'Tây Bắc', '乾'], ['乾', 'Càn', 'Tây Bắc', '乾'], ['亥', 'Hợi', 'Tây Bắc', '乾'],
];
// Độ bắt đầu mỗi sơn (index → startDeg), LIÊN TỤC 337.5→697.5 (KHÔNG mod 360) để
// so sánh được qua ranh 0°. [loop 631 FIX] trước đây mod 360 → 225°/270° sai về 壬.
const SHAN_START = SHAN_24.map((_, i) => 337.5 + i * 15);

// Ngũ hành của trung quái (quẻ giữa mỗi hướng) — để đối chiếu Dụng Thần
const QUAI_WX = { 子: 'Thủy', 艮: 'Thổ', 卯: 'Mộc', 巽: 'Mộc', 午: 'Hỏa', 坤: 'Thổ', 酉: 'Kim', 乾: 'Kim' };

// Map palace8 (vocab checkAnnualTaboo) ↔ palace pan flying star
const PALACE8_TO_PAN = {
  'Bắc': 'Chính Bắc', 'Đông Bắc': 'Đông Bắc', 'Đông': 'Chính Đông', 'Đông Nam': 'Đông Nam',
  'Nam': 'Chính Nam', 'Tây Nam': 'Tây Nam', 'Tây': 'Chính Tây', 'Tây Bắc': 'Tây Bắc',
};

/** Độ la bàn (0-360) → sơn 24 + palace8. Bắc = 0/360. */
export function shanFromDegree(degree) {
  // [loop 632] guard NaN/garbage — trước đây Number('abc')=NaN → fallback mù về 壬
  if (degree == null || degree === '' || Number.isNaN(Number(degree))) return null;
  let d = ((Number(degree) % 360) + 360) % 360;
  //	chuyển về khoảng [337.5, 697.5) để so sánh liên tục qua 0°
  if (d < 337.5) d += 360;
  let idx = SHAN_START.findIndex((s) => d >= s && d < s + 15);
  if (idx < 0) idx = 0;
  const [han, vi, palace8, trungQuai] = SHAN_24[idx];
  return { han, vi, palace8, trungQuai, degree: ((Number(degree) % 360) + 360) % 360 };
}

/** Tên hướng/palace8 (vd «Tây Nam») hoặc sơn Hán (vd «坤») → đối tượng shan. */
export function shanFromName(name) {
  const n = String(name || '').trim();
  // khớp sơn Hán hoặc vi
  let row = SHAN_24.find(([h, v]) => h === n || v.toLowerCase() === n.toLowerCase());
  if (!row) row = SHAN_24.find(([h, v, p]) => p === n); // khớp palace8
  if (!row) return null;
  const [han, vi, palace8, trungQuai] = row;
  return { han, vi, palace8, trungQuai };
}

// ---- Bát Trạch: từ idealHouse.auspicious (4 cát) tìm star của 1 palace8 ----
function baziTrachFor(ideal, palace8) {
  if (!ideal || !ideal.auspicious) return null;
  // auspicious = { «Sinh Khí (...)»: «Tây Bắc», ... }
  for (const [starKey, dir] of Object.entries(ideal.auspicious)) {
    if (dir === palace8) return { star: starKey, cat: true };
  }
  // 4 hung = 8 hướng còn lại (không có trong auspicious). Gán nhãn hung chung.
  return { star: '(hung phương)', cat: false };
}

// =====================================================================
//  API 1: compassReading — luận 1 hướng đầy đủ cho năm
//    R: analyze() chủ thể (lấy Bát Trạch + Dụng)
//    input: degree (số) HOẶC shanName (string) HOẶC palace8 (string)
//    scanYear: năm xem (mặc định hiện tại)
// =====================================================================
export function compassReading(R, input, scanYear) {
  const year = scanYear || new Date().getFullYear();
  let shan;
  if (typeof input === 'number' || (typeof input === 'string' && /^\d+(\.\d+)?$/.test(input))) {
    shan = shanFromDegree(parseFloat(input));
  } else {
    shan = shanFromName(input);
  }
  if (!shan) return { error: 'Hướng không hợp lệ — nhập độ (0-360), tên sơn (vd 坤, Khôn) hoặc palace (vd Tây Nam).' };
  const palace8 = shan.palace8;
  const ideal = (() => { try { return idealHouse(R); } catch (e) { return null; } })();
  const taboo = checkAnnualTaboo(palace8, year);
  // phi tinh lưu niên tại cung này
  const panPalace = PALACE8_TO_PAN[palace8];
  const fs = (() => { try { return yearFlyingStar(year); } catch (e) { return null; } })();
  const star = fs?.pan?.find((p) => p.palace === panPalace) || null;
  const bt = ideal ? baziTrachFor(ideal, palace8) : null;
  // ngũ hành hướng vs Dụng
  const dirWx = QUAI_WX[shan.trungQuai] || '?';
  const dung = R?.yong?.primary;
  const hy = R?.yong?.xi;
  const dungMatch = dung ? (dirWx === dung ? 'bổ ĐÚNG Dụng' : hy && dirWx === hy ? 'bổ Hỷ' : 'không bổ Dụng') : '?';

  // ---- tổng hợp verdict ----
  // điểm cơ bản: Bát Trạch cát +2, hung -2; taboo theo severity (âm); phi tinh cát +1/hung -1; Dụng +1
  let score = 0;
  const layers = [];
  if (bt) {
    if (bt.cat) { score += 2; layers.push(`✓ Bát Trạch: ${bt.star} cho mệnh ${ideal.gua} (${ideal.grpVi})`); }
    else { score -= 2; layers.push(`✗ Bát Trạch: hướng này thuộc hung phương với mệnh ${ideal.gua}`); }
  }
  for (const t of taboo.taboos) {
    score -= t.severity;
    layers.push(`⚠ ${t.type} (năm): ${t.detail}`);
  }
  if (star) {
    // [loop 632 FIX] Ngũ Hoàng(5)/Nhị Hắc(2) ĐÃ được penalty trong annualTaboo (severity 5/2)
    //   → KHÔNG trừ thêm ở phi tinh (trước đây double-count, score bị phình — vd Nam 2026 = −11).
    const alreadyTabooed = taboo.taboos.some((t) => t.type === 'Ngũ Hoàng' || t.type === 'Nhị Hắc');
    const isStar52 = star.star === 5 || star.star === 2;
    if (/cát/i.test(star.base)) { score += 1; layers.push(`★ Phi tinh ${year}: ${star.name} (${star.vi}) — cát`); }
    else if (/hung/i.test(star.base)) {
      if (!(isStar52 && alreadyTabooed)) score -= 1; // skip double-count cho 5/2 đã trong taboo
      layers.push(`⚠ Phi tinh ${year}: ${star.name} (${star.vi}) — hung${(isStar52 && alreadyTabooed) ? ' (đã tính ở sát phương)' : ''}`);
    }
    else layers.push(`• Phi tinh ${year}: ${star.name} (${star.vi})`);
  }
  if (dungMatch === 'bổ ĐÚNG Dụng') { score += 1; layers.push(`✓ Ngũ hành hướng ${dirWx} = Dụng Thần ${dung} → bổ mệnh`); }
  else if (dungMatch === 'bổ Hỷ') { score += 0.5; layers.push(`• Ngũ hành hướng ${dirWx} = Hỷ ${hy} → khá bổ`); }

  let verdict, advice;
  if (score >= 3) { verdict = 'ĐẠI CÁT'; advice = 'Hướng rất tốt — nên ưu tiên cho việc chính (cửa chính, bàn làm việc, giường, động thổ).'; }
  else if (score >= 1) { verdict = 'CÁT'; advice = 'Hướng tốt — dùng được cho sinh hoạt hàng ngày.'; }
  else if (score === 0) { verdict = 'BÌNH'; advice = 'Hướng trung tính — được mất tùy mục đích cụ thể.'; }
  else if (score >= -3) { verdict = 'KỴ'; advice = 'Hướng kỵ — hạn chế, nếu bắt buộc phải hóa giải (an tinh / chọn tháng cát / dụng vật hóa giải).'; }
  else { verdict = 'ĐẠI KỴ'; advice = 'Hướng rất xấu năm nay — TRÁNH động thổ/cải tạo/dời về. Chờ sang năm (sát phương thay đổi).'; }

  return {
    input, year, shan: `${shan.han} (${shan.vi})`, palace8, trungQuai: shan.trungQuai, dirWx,
    baziTrach: bt, annualTaboo: taboo, flyingStar: star ? { name: star.name, vi: star.vi, base: star.base } : null,
    dungMatch, score, verdict, advice, layers,
    summary: `Sơn ${shan.han} (${shan.vi}, hướng ${palace8}, ngũ hành ${dirWx}) năm ${year}: ${verdict}. ${layers.join('; ')}.`,
  };
}

// =====================================================================
//  API 2: bestDirection — quét 24 sơn, recommend hướng tốt nhất cho mục đích
//    R: analyze() chủ thể; purpose: 'cuakhach'|'banlamviec'|'giuong'|'bep'|'dongtho'|'khaitruong'|'khach'
// =====================================================================
// [loop 633] purpose → sao Bát Trạch lý tưởng (cổ pháp 八宅明镜). Trước đây bestDirection
//   chỉ xếp theo score tổng → có thể recommend Sinh Khí cho giường (sai — giường cần Thiên Y/Phục Vị).
const PURPOSE_IDEAL_STAR = {
  cuakhach:   ['Sinh Khí', 'Diên Niên'],   // cửa chính: tài lộc/sinh vượng, nhân duyên
  banlamviec: ['Sinh Khí'],                // bàn làm việc: tài lộc, sự nghiệp
  giuong:     ['Thiên Y', 'Phục Vị'],      // giường: sức khoẻ, bình yên
  bep:        ['Thiên Y', 'Phục Vị'],      // bếp: sức khoẻ gia đình
  khach:      ['Diên Niên', 'Sinh Khí'],   // phòng khách: nhân duyên, giao tế
  dongtho:    ['Sinh Khí', 'Diên Niên'],   // động thổ: sinh vượng (nếu sạch sát)
  khaitruong: ['Sinh Khí', 'Diên Niên'],
};
const PURPOSE_VI = {
  cuakhach: 'cửa chính', banlamviec: 'bàn làm việc', giuong: 'giường ngủ', bep: 'bếp',
  khach: 'phòng khách', dongtho: 'động thổ', khaitruong: 'khai trương',
};
export function bestDirection(R, purpose = 'cuakhach', scanYear) {
  const year = scanYear || new Date().getFullYear();
  const ideal = PURPOSE_IDEAL_STAR[purpose] || PURPOSE_IDEAL_STAR.cuakhach;
  const all = SHAN_24.map(([han, vi, palace8, trungQuai]) => {
    const rd = compassReading(R, han, year);
    if (rd.error) return null;
    let s = rd.score;
    // [loop 633] purpose-specific: matching ideal Bát Trạch star.
    //   Cổ pháp: đồ NỘI THẤT (giường/bếp/bàn — đặt cố định) theo Bát Trạch NATAL (vĩnh viễn)
    //   là CHỦ ĐẠO; lưu niên phi tinh (đổi mỗi năm, hóa giải được) là thứ yếu. Nay boost mạnh (+4).
    //   Cửa chính/động thổ: cân bằng hơn (+2), vì cửa cũng chịu lưu niên nhiều.
    const isFurniture = ['giuong', 'bep', 'banlamviec', 'khach'].includes(purpose);
    const btStar = rd.baziTrach?.star || '';
    const idealHit = ideal.some((st) => btStar.includes(st));
    if (idealHit) s += isFurniture ? 4 : 2;
    // purpose-specific weighting (giữ logic cũ)
    if (purpose === 'dongtho' || purpose === 'khaitruong') {
      if (rd.annualTaboo && rd.annualTaboo.maxSeverity >= 4) s -= 5; // sát phương năm TUYỆT ĐỐI
    }
    if (purpose === 'giuong' || purpose === 'cuakhach') {
      if (rd.baziTrach && rd.baziTrach.cat) s += 1; // Bát Trạch cá nhân quan trọng nhất
    }
    return { shan: han, vi, palace8, score: s, verdict: rd.verdict, dungMatch: rd.dungMatch,
      flyingStar: rd.flyingStar?.name, baziStar: btStar.replace(/\s*\(.*$/, ''), idealHit };
  }).filter(Boolean);
  all.sort((a, b) => b.score - a.score);
  const top = all[0];
  const worst = all[all.length - 1];
  const top3 = all.slice(0, 3);
  return {
    purpose, year, purposeVi: PURPOSE_VI[purpose] || purpose,
    idealStars: ideal,
    best: top ? { shan: `${top.shan} (${top.vi})`, palace8: top.palace8, verdict: top.verdict,
      score: top.score, dung: top.dungMatch, star: top.flyingStar,
      baziStar: top.baziStar, idealHit: top.idealHit } : null,
    top3: top3.map((d) => `${d.shan}(${d.vi}, ${d.palace8}, ${d.baziStar || '?'}, ${d.verdict})`),
    worst: worst ? { shan: `${worst.shan} (${worst.vi})`, palace8: worst.palace8, verdict: worst.verdict } : null,
    summary: top
      ? `Hướng TỐT NHẤT cho «${PURPOSE_VI[purpose] || purpose}» (cần sao ${ideal.join('/')}): ${top.shan} (${top.vi}, hướng ${top.palace8}, ${top.baziStar || '?'}) — ${top.verdict}${top.idealHit ? ' ★ ĐÚNG sao lý tưởng' : ''}. Top 3: ${top3.map((d) => d.shan).join(', ')}. Tránh: ${worst.shan} (${worst.palace8}).`
      : '(không tính được)',
    note: 'Sơn 24 mỗi sơn 15° — cần la bàn cơ để chính xác; sensor điện thoại sai số 5-15°.',
  };
}
