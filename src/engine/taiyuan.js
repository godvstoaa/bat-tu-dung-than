// ============================================================================
//  THAI NGUYÊN 胎元 (prenatal pillar — "trụ thứ 5" của Bát Tự)
//  Công thức cố định: nguyệt can +1, nguyệt chi +3 → can chi thai nguyên.
//  Dùng luận: thể chất bẩm sinh, nghiệp tiềm ẩn, sức khoẻ thai kỳ, bổ trợ tứ trụ.
//  Nguồn: 渊海子平, 三命通会, 韋千里《千里命稿》.
// ============================================================================
import { GAN } from './constants.js';

const GAN_ORDER = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const ZHI_ORDER = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

/**
 * @param {string} monthGan - nguyệt thiên can (vd 壬)
 * @param {string} monthZhi - nguyệt địa chi (vd 戌)
 * @returns {{ ganZhi, gan, zhi, ganVi, zhiVi, meaning, nayin }}
 */
export function taiYuan(monthGan, monthZhi) {
  const gIdx = GAN_ORDER.indexOf(monthGan);
  const zIdx = ZHI_ORDER.indexOf(monthZhi);
  // thai can = nguyệt can + 1; thai chi = nguyệt chi + 3
  const tGan = GAN_ORDER[(gIdx + 1) % 10];
  const tZhi = ZHI_ORDER[(zIdx + 3) % 12];
  const ganVi = GAN[tGan]?.vi || tGan;
  const zhiVi = GAN[tGan] ? { 子:'Tý',丑:'Sửu',寅:'Dần',卯:'Mão',辰:'Thìn',巳:'Tỵ',午:'Ngọ',未:'Mùi',申:'Thân',酉:'Dậu',戌:'Tuất',亥:'Hợi' }[tZhi] : tZhi;

  // Nạp âm (tra nhanh)
  const nayin = nayinQuick(tGan, tZhi);

  // Luận thai nguyên theo ngũ hành
  const tWx = GAN[tGan]?.wx || '?';
  const meaning = `Thai nguyên ${tGan}${tZhi} (${ganVi} ${zhiVi}) hành ${tWx}. ` +
    `Thai nguyên đại biểu điều kiện thụ thai (~10 tháng trước sinh), phản ánh thể chất bẩm sinh, ` +
    `nghiệp tiềm ẩn, và sức khoẻ thai kỳ. Nếu thai nguyên hành trùng Dụng Thần → bẩm sinh có gốc tốt; ` +
    `nếu trùng Kỵ Thần → thể chất bẩm sinh suy, cần bồi dưỡng sớm.`;

  return { ganZhi: tGan + tZhi, gan: tGan, zhi: tZhi, ganVi, zhiVi, wx: tWx, nayin, meaning };
}

// Nạp âm tra nhanh (30 cặp → ngũ hành)
const NAYIN_PAIRS = ['金','火','木','土','金','火','水','土','金','木','水','土','火','木','水','金','火','木','土','金','火','水','土','金','木','水','土','火','木','水'];
function nayinQuick(gan, zhi) {
  for (let i = 0; i < 60; i++) {
    if (GAN_ORDER[i % 10] === gan && ZHI_ORDER[i % 12] === zhi) {
      return NAYIN_PAIRS[Math.floor(i / 2)];
    }
  }
  return '?';
}

// Thai tức (thái dương +1, thái âm +4 — một biến thể khác)
export function taiXi(monthGan, monthZhi) {
  const gIdx = GAN_ORDER.indexOf(monthGan);
  const zIdx = ZHI_ORDER.indexOf(monthZhi);
  return GAN_ORDER[(gIdx + 1) % 10] + ZHI_ORDER[(zIdx + 4) % 12];
}

export { GAN_ORDER, ZHI_ORDER };
