// ============================================================================
//  TỬ VI LƯU NIÊN 紫微流年 — CUNG NĂM + SAO KÍCH HOẠT
//  Khác tiểu hạn (tuổi xoay): lưu niên = chi năm trực tiếp → đọc cung + sao.
//  Vd 2026 午 → cung at 午 branch → palace label + stars = chủ đề năm.
//  Nguồn: ziweicn, 紫微斗数 流年论.
// ============================================================================
import { computeZiwei, computeSihua, yunXianSihua } from './ziwei.js';
import { WX_VI } from './constants.js';
import { Solar } from 'lunar-javascript';

const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * Tính Tử Vi lưu niên cho 1 năm.
 * @param {number} birthYear
 * @param {number} birthMonth
 * @param {number} birthDay
 * @param {number} birthHour
 * @param {number} birthMinute
 * @param {string} gender
 * @param {number} liunianYear - năm cần luận
 * @returns {{ year, yearGanZhi, lnGongZhi, palace, palaceVi, stars, sihua, theme, note }}
 */
export function ziweiLiunian(birthYear, birthMonth, birthDay, birthHour, birthMinute, gender, liunianYear) {
  // Lấy mệnh bàn gốc
  const z = computeZiwei(birthYear, birthMonth, birthDay, birthHour, birthMinute, gender);

  // Chi năm lưu niên
  const yearSolar = Solar.fromYmdHms(liunianYear, 6, 15, 12, 0, 0);
  const yearGan = yearSolar.getLunar().getYearGan();
  const yearZhi = yearSolar.getLunar().getYearZhi();
  const yearGanZhi = yearGan + yearZhi;

  // Lưu niên cung = chi năm → tìm cung trong mệnh bàn
  const lnPalace = z.palaces.find((p) => p.zhi === yearZhi);
  const lnStars = lnPalace?.stars || [];

  // Lưu niên四化 (theo can năm)
  const allStars = { ...(z.mainStars || {}) };
  for (const s of (z.fuxing?.stars || [])) allStars[s.star] = s.atZhi;
  const lnSihua = computeSihua(yearGan, allStars).sihua;

  // Chủ đề: theo palace label
  const PALACE_THEME = {
    命宫: 'bản thân, sức khoẻ, tính cách, tổng quan',
    兄弟: 'anh chị em, bạn bè, đồng nghiệp, hợp tác',
    夫妻: 'phối ngẫu, tình cảm, hôn nhân',
    子女: 'con cái, học trò,下属',
    财帛: 'tài chính, tiền bạc, thu nhập',
    疾厄: 'sức khoẻ, bệnh tật, thể chất',
    迁移: 'xuất ngoại, di chuyển, thay đổi',
    奴仆: 'bạn bè, nhân viên, quan hệ ngoài',
    官禄: 'sự nghiệp, công danh, chức vụ',
    田宅: 'nhà cửa, bất động sản, gia đình',
    福德: 'phúc đức, tinh thần, tâm lý',
    父母: 'cha mẹ, người trên, cấp trên',
  };

  const theme = PALACE_THEME[lnPalace?.zh] || '?';

  // Đánh giá: sao cát/hung tại cung + 四化
  const catStars = lnStars.filter((s) => ['紫微','天府','太阳','太阴','武曲','天相','左辅','右弼','文昌','文曲','天魁','天钺'].includes(s));
  // [loop 548 FIX BUG3] 擎羊/陀罗/火铃/空劫 (6 hung tinh) nằm trong z.fuxing.stars
  //   (KHÔNG trong palace.stars chỉ chứa 14 chính tinh) → trước đây HUNG_STARS filter
  //   mù với chúng. Nay gộp hung tinh phụ tại cung lưu niên vào.
  const FU_HUNG = ['擎羊','陀罗','火星','铃星','地空','地劫'];
  const fuHungAtGong = (z.fuxing?.stars || [])
    .filter((s) => FU_HUNG.includes(s.star) && s.atZhi === yearZhi)
    .map((s) => s.star);
  const hungStars = lnStars.filter((s) => ['七杀','破军','贪狼','巨门','廉贞','擎羊','陀罗'].includes(s)).concat(fuHungAtGong);
  const hasLu = Object.values(lnSihua).some((v) => v.star && lnStars.includes(v.star) && v.tone === 'cat');
  const hasJi = Object.values(lnSihua).some((v) => v.star && lnStars.includes(v.star) && v.tone === 'hung');

  let tone;
  if (catStars.length >= 2 || hasLu) tone = 'cat';
  else if (hungStars.length >= 2 || hasJi) tone = 'hung';
  else tone = 'mid';

  return {
    year: liunianYear, yearGanZhi,
    lnGongZhi: yearZhi,
    palace: lnPalace?.zh || '?',
    palaceVi: lnPalace?.vi || '?',
    stars: lnStars,
    sihua: lnSihua,
    theme, tone,
    catStars, hungStars,
    note: `Lưu niên cung tại ${lnPalace?.zh || yearZhi} (${lnPalace?.vi?.split('(')[0] || '?'}) — chủ đề "${theme}". Sao tại cung: ${lnStars.join(', ') || '(trống)'}. 四 hóa năm ${yearGan}: ${Object.entries(lnSihua).map(([k, v]) => k + v.star + (v.palace ? '@' + v.palace : '')).join(' ')}.`,
  };
}

export { ZHI_ORDER };
