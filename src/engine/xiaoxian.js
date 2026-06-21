// ============================================================================
//  TIỂU HẠN 小限 (annual palace rotation — Tử Vi vi thời điểm)
//  Từ sinh năm chi cung khởi 1 tuổi, nam thuận / nữ nghịch, mỗi năm tiến 1 cung.
//  小限 cung của năm = xem sao/palace đó → biết chủ đề năm (tài/sự nghiệp/sức khoẻ).
//  Nguồn: 通胜/ziweicn 小限起例.
// ============================================================================
const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ZHI_VI = { 子:'Tý', 丑:'Sửu', 寅:'Dần', 卯:'Mão', 辰:'Thìn', 巳:'Tỵ', 午:'Ngọ', 未:'Mùi', 申:'Thân', 酉:'Dậu', 戌:'Tuất', 亥:'Hợi' };

// Nhãn 12 cung (từ 命 cung逆排): 命/兄弟/夫妻/子女/财帛/疾厄/迁移/奴仆/官禄/田宅/福德/父母
// Mỗi nhãn ứng một chủ đề khi 小限 rơi vào cung đó
const PALACE_THEME = {
  命宫: 'bản thân — sức khoẻ, tính cách, tổng quan năm',
  兄弟: 'huynh đệ, bạn bè, đồng nghiệp, hợp tác',
  夫妻: 'phối ngẫu, tình cảm, hôn nhân',
  子女: 'con cái, học trò,下属',
  财帛: 'tài chính, tiền bạc, thu nhập',
  疾厄: 'sức khoẻ, bệnh tật, thể chất',
  迁移: 'xuất ngoại, di chuyển, thay đổi môi trường',
  奴仆: 'bạn bè, người dưới, nhân viên, quan hệ ngoài',
  官禄: 'sự nghiệp, công danh, chức vụ',
  田宅: 'nhà cửa, bất động sản, gia đình',
  福德: 'phúc đức, tinh thần, tâm lý,興 thú',
  父母: 'cha mẹ, người trên, cấp trên',
};

/**
 * @param {string} birthZhi - chi năm sinh
 * @param {number} virtualAge - tuổi âm (虛歲 = năm hiện - năm sinh + 1)
 * @param {string} gender - 'nam' | 'nu'
 * @returns {{ branch, branchVi, direction, palaceLabel?, palaceTheme? }}
 */
export function xiaoxian(birthZhi, virtualAge, gender) {
  const bIdx = ZHI_ORDER.indexOf(birthZhi);
  const isMale = gender === 'nam';
  // nam thuận (+), nữ nghịch (-); từ 1 tuổi, mỗi tuổi +1
  const offset = (virtualAge - 1) * (isMale ? 1 : -1);
  const xIdx = ((bIdx + offset) % 12 + 12) % 12;
  return {
    branch: ZHI_ORDER[xIdx],
    branchVi: ZHI_VI[ZHI_ORDER[xIdx]],
    direction: isMale ? 'thuận' : 'nghịch',
    virtualAge,
  };
}

/**
 * Tính tiểu hạn + gắn vào palace labels của Tử Vi.
 * @param {object} z - kết quả computeZiwei (có palaces + mingGong)
 * @param {number} currentYear
 * @param {number} birthYear
 * @returns {{ branch, branchVi, direction, palace, palaceVi, palaceTheme, stars }}
 */
export function xiaoxianInChart(z, currentYear, birthYear, gender) {
  const virtualAge = currentYear - birthYear + 1;
  const birthZhiCalc = ZHI_ORDER[((birthYear - 4) % 12 + 12) % 12];
  const g = gender || 'nam';
  const xx = xiaoxian(birthZhiCalc, virtualAge, g);
  // Tìm palace label tại branch đó
  const targetPalace = z.palaces?.find((p) => p.zhi === xx.branch);
  const stars = targetPalace?.stars || [];
  return {
    ...xx,
    palace: targetPalace?.zh || '?',
    palaceVi: targetPalace?.vi || '?',
    palaceTheme: PALACE_THEME[targetPalace?.zh] || '?',
    stars,
  };
}

export { ZHI_VI, PALACE_THEME };
