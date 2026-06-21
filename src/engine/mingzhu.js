// ============================================================================
//  MỆNH CHỦ / THÂN CHỦ 命主身主 (Tử Vi — sao chủ mệnh + chủ thân)
//  命主: theo mệnh cung địa chi → sao chủ. 身主: theo năm chi → sao chủ.
//  Mệnh chủ = sao quản lý bản tính cốt lõi; Thân chủ = sao quản lý thể chất/hậu thiên.
//  Nguồn: 博客园 ziweidoushu_lib (安命主/身主星).
// ============================================================================

// 命主 theo mệnh cung chi
const MINGZHU_MAP = {
  子: '贪狼', 丑: '巨门', 亥: '巨门',
  寅: '禄存', 戌: '禄存',
  卯: '文曲', 酉: '文曲',
  巳: '武曲', 未: '武曲',
  辰: '廉贞', 申: '廉贞',
  午: '破军',
};

// 身主 theo năm chi
const SHENZHU_MAP = {
  子: '铃星', 午: '火星',
  丑: '天相', 未: '天相',
  寅: '天梁', 申: '天梁',
  卯: '天同', 酉: '天同',
  巳: '天机', 亥: '天机',
  辰: '文昌', 戌: '文昌',
};

const STAR_VI = {
  贪狼: 'Tham Lang', 巨门: 'Cự Môn', 禄存: 'Lộc Tồn', 文曲: 'Văn Khúc',
  武曲: 'Vũ Khúc', 廉贞: 'Liêm Trinh', 破军: 'Phá Quân',
  铃星: 'Linh Tinh', 火星: 'Hỏa Tinh', 天相: 'Thiên Tướng',
  天梁: 'Thiên Lương', 天同: 'Thiên Đồng', 天机: 'Thiên Cơ', 文昌: 'Văn Xương',
};

const STAR_DESC = {
  贪狼: 'dục vọng, tài năng đa năng, đào hoa, biến đổi',
  巨门: 'khẩu tài, thị phi, nghi ngờ, hố sâu',
  禄存: 'tài lộc, ổn định, quý nhân, bảo thủ',
  文曲: 'tài nghệ, khẩu tài, lãng mạn, học thuật phi chính thống',
  武曲: 'cương quyết, tài chính, hành động, cô độc',
  廉贞: 'phức tạp, tình cảm mạnh, tù/ngục, biến hoá',
  破军: 'phá hoại, tiên phong, thay đổi, cô quả',
  铃星: 'âm hoả, nộ khí âm ỉ, bạo phát bạo tàn',
  火星: 'dương hoả, bạo liệt, nhanh mẽ, huyết quang',
  天相: 'ảnh, quyền lực ổn định, phù trợ, quan hệ',
  天梁: 'lão thành, bảo vệ, y học, tôn giáo, thâm sâu',
  天同: 'nhu hoà, hưởng thụ, trẻ con, lạc quan',
  天机: 'trí tuệ, mưu lược, thay đổi, đa nghi',
  文昌: 'học vấn chính thống, văn chương, thi cử, nghiêm',
};

/**
 * @param {string} mingGongZhi - mệnh cung địa chi
 * @param {string} yearZhi - năm địa chi
 * @returns {{ mingZhu, mingZhuVi, mingZhuDesc, shenZhu, shenZhuVi, shenZhuDesc }}
 */
export function mingZhuShenZhu(mingGongZhi, yearZhi) {
  const mz = MINGZHU_MAP[mingGongZhi] || '贪狼';
  const sz = SHENZHU_MAP[yearZhi] || '铃星';
  return {
    mingZhu: mz, mingZhuVi: STAR_VI[mz] || mz, mingZhuDesc: STAR_DESC[mz] || '',
    shenZhu: sz, shenZhuVi: STAR_VI[sz] || sz, shenZhuDesc: STAR_DESC[sz] || '',
  };
}

export { STAR_VI, STAR_DESC };
