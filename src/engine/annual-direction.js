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
  const summary = `Mệnh ${zhai.grpVi}, 4 cát方 ${ausp.map((a) => a.dir).join('/')}. Lưu niên ${curYear} phi tinh: ` +
    (goodDirs.length ? `KÍCH HOẠT: ${goodDirs.join(', ')} (cát phương được sao cát); ` : '') +
    (badDirs.length ? `TRÁNH/giữ yên: ${badDirs.join(', ')} (cát phương bị sao hung, đặc biệt 5 hoằng/2 hắc).` : '(cát phương đều ổn).');

  return { year: curYear, gua: zhai.guaName, grpVi: zhai.grpVi, auspicious: ausp, summary };
}

export { normDir };
