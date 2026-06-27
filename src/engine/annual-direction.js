// ============================================================================
//  流年到向 (cá nhân) — ĐÁNH GIÁ HƯỚNG CÁT CÁ NHÂN QUA PHI TINH LƯU NIÊN
//  "Hướng tốt của tôi NĂM NAY còn tốt không? Có bị 5 hoàng/2 hắc nhiễm không?"
//  * Ghép 2 hệ: BÁT TRẠCH (zhai — 4 cát方 cố định theo Mệnh Quái) + HUYỀN KHÔNG
//    PHI TINH LƯU NIÊN (yearFlyingStar — 9 sao đổi mỗi năm tới 8 hướng).
//  * Mỗi cát方 của bản mệnh: nếu lưu niên phi tinh tới đó là CÁT (1/4/6/8/9) →
//    "cát + cát" (kích hoạt); nếu là HUNG (2 hắc/3 bích/5 hoàng/7 xích) → cát方 bị
//    tạm nhiễm → năm nay TRÁNH khu vực đó (đặc biệt 5 hoàng kỵ động thổ).
//  Nguồn: 玄空飞星 年星, 八宅明镜 游年, 沈氏玄空 年月飞星到向.
// ============================================================================
import { yearFlyingStar, STAR } from './xuankong.js';
import { computeZhai } from './zhai.js';

// chuẩn hoá tên hướng (zhai có thể dùng 'Tây' ngắn, xuankong dùng 'Chính Tây')
function normDir(d) {
  const m = { 'Bắc': 'Chính Bắc', 'Nam': 'Chính Nam', 'Đông': 'Chính Đông', 'Tây': 'Chính Tây' };
  return m[d] || d;
}
const CAT_STAR = new Set([1, 4, 6, 8, 9]); // 一白/四绿/六白/八白/九紫 = cát
const HUNG_STAR = new Set([2, 3, 5, 7]);   // 二黑/三碧/五黄/七赤 = hung

// [loop 29] Thái Tuế & Tam Sát theo năm — 2 hướng KỴ ĐỘNG THỔ quan trọng nhất (mà module cũ bỏ sót).
//   Thái Tuế = hướng chi năm (后天八卦). Tam Sát = 3 chi đối lập nhóm tam hợp.
const ZHI_TO_DIR = { 子:'Chính Bắc', 丑:'Đông Bắc', 寅:'Đông Bắc', 卯:'Chính Đông', 辰:'Đông Nam', 巳:'Đông Nam', 午:'Chính Nam', 未:'Tây Nam', 申:'Tây Nam', 酉:'Chính Tây', 戌:'Tây Bắc', 亥:'Tây Bắc' };
// [loop 555 FIX] SANSHA_BY_GROUP (dead, không dùng — code thực dùng SANSHA_CENTER dòng 28)
//   từng ghi SAI 申子辰='Chính Bắc' (phải=Chính Nam, Thủy cục → tam sát 巳午未=Hỏa=Nam).
//   Sửa đúng để tránh maintainer dùng nhầm. Khớp SANSHA_CENTER + sansha.js.
const SANSHA_BY_GROUP = { '申子辰': 'Chính Nam', '寅午戌': 'Chính Bắc', '亥卯未': 'Chính Tây', '巳酉丑': 'Chính Đông' };
// Tam Sát: nhóm tam hợp năm → 3 chi đối lập → hướng trung tâm. 寅午戌(火)→亥子丑(北); 申子辰(水)→巳午未(南);
//   亥卯未(木)→申酉戌(西); 巳酉丑(金)→寅卯辰(东).
const SANSHA_CENTER = { '申子辰': 'Chính Nam', '寅午戌': 'Chính Bắc', '亥卯未': 'Chính Tây', '巳酉丑': 'Chính Đông' };
function yearZhiOf(year) { const Z = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']; return Z[((year - 4) % 12 + 12) % 12]; }
function sanshaDirOf(yearZhi) {
  const groups = [['申','子','辰'],['寅','午','戌'],['亥','卯','未'],['巳','酉','丑']];
  const g = groups.find((gg) => gg.includes(yearZhi));
  if (!g) return null;
  return SANSHA_CENTER[g.join('')];
}

/**
 * @param {object} R — analyze()
 * @param {number} scanYear
 * @returns {{ gua, grpVi, auspicious:[{star,dir,annualStar,annualVi,tone,note}], summary }}
 */
export function annualDirection(R, scanYear) {
  const curYear = scanYear || new Date().getFullYear();
  const inp = R.chart.input;
  const zhai = computeZhai(inp.year, inp.gender);
  const yfs = yearFlyingStar(curYear);
  const panByDir = {}; for (const p of yfs.pan) panByDir[p.palace] = p;

  const ausp = [];
  for (const [starRaw, dirRaw] of Object.entries(zhai.auspicious || {})) {
    const dir = normDir(dirRaw);
    const starName = starRaw.split(' (')[0];
    const annual = panByDir[dir];
    const num = annual?.star;
    let tone, note;
    if (num == null) { tone = 'mid'; note = '(không tra được phi tinh)'; }
    else if (num === 5) { tone = 'very-hung'; note = `⚠ ${num} (${annual.name}) ĐẾN ${dir} — NGŨ HOÀNG đại sát! Cát方 "${starName}" bị nhiễm nặng năm ${curYear}: TRÁNH động thổ/phòng ngủ ở hướng này.`; }
    else if (num === 2) { tone = 'hung'; note = `${num} (${annual.name}) ĐẾN ${dir} — nhị hắc bệnh phù; cát方 "${starName}" yếu sức khoẻ năm nay, hạn chế khu vực.`; }
    else if (HUNG_STAR.has(num)) { tone = 'hung'; note = `${num} (${annual.name}) ĐẾN ${dir} — cát方 "${starName}" bị sao hung (${annual.vi}) giảm lực năm ${curYear}.`; }
    else { tone = 'cat'; note = `✓ ${num} (${annual.name}, ${annual.vi}) ĐẾN ${dir} — CÁT phương "${starName}" được sao cát tăng lực năm ${curYear}: KÍCH HOẠT (cửa/phòng khách/hướng bàn).`; }
    ausp.push({ star: starName, dir: dirRaw, annualStar: num, annualName: annual?.name, annualVi: annual?.vi, tone, note });
  }

  const goodDirs = ausp.filter((a) => a.tone === 'cat').map((a) => a.dir);
  const badDirs = ausp.filter((a) => a.tone === 'very-hung' || a.tone === 'hung').map((a) => `${a.dir}(${a.annualStar})`);

  // [loop 29] Thái Tuế + Tam Sát (2 hướng kỵ động thổ quan trọng nhất, module cũ bỏ sót).
  const yZhi = yearZhiOf(curYear);
  const taisuiDir = ZHI_TO_DIR[yZhi];
  const sanshaDir = sanshaDirOf(yZhi);
  // Thái Tuế trùng Ngũ Hoàng? Fact TOÀN CỤC (cùng hướng, không phụ thuộc cát方 user).
  const taisuiStar = panByDir[normDir(taisuiDir)]?.star;
  const taisuiDouble = taisuiStar === 5;

  let summary = `Mệnh ${zhai.grpVi}, 4 cát方 ${ausp.map((a) => a.dir).join('/')}. Lưu niên ${curYear} phi tinh: ` +
    (goodDirs.length ? `KÍCH HOẠT: ${goodDirs.join(', ')} (cát phương được sao cát); ` : '') +
    (badDirs.length ? `TRÁNH/giữ yên: ${badDirs.join(', ')} (cát phương bị sao hung, đặc biệt 5 hoằng/2 hắc). ` : '(cát phương đều ổn). ');
  summary += ` | ⚠ THÁI TUẾ ${curYear} (${yZhi}) tọa ${taisuiDir} — kỵ động thổ/phá hoại hướng này${taisuiDouble ? ' ★TRÙNG NGŨ HOÀNG = kỵ KÉP, tuyệt đối tránh!' : ''}. TAM SÁT ${sanshaDir} — kỵ động thổ/xây cất hướng này cả năm.`;

  return { year: curYear, gua: zhai.guaName, grpVi: zhai.grpVi, auspicious: ausp, taisuiDir, taisuiZhi: yZhi, sanshaDir, taisuiDouble, summary };
}

export { normDir };
