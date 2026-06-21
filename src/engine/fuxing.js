// ============================================================================
//  TỬ VI PHỤ TINH 紫微辅星 (6 sao phụ tá)
//  左辅/右弼 (theo tháng sinh), 文昌/文曲 (theo giờ sinh), 天魁/天钺 (theo năm can).
//  Nguồn: 博客园 ziweidoushu_lib (安左辅右弼/文昌文曲/天魁天钺).
// ============================================================================
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 左辅: 从辰(4)起正月顺行 → DIZHI[(month+3)%12]
export const zuoFu = (lunarMonth) => DIZHI[((lunarMonth + 3) % 12 + 12) % 12];
// 右弼: 从戌(10)起正月逆行 → DIZHI[(11-month+12)%12]
export const youBi = (lunarMonth) => DIZHI[((11 - lunarMonth) % 12 + 12) % 12];
// 文曲: 从辰(4)起子时顺行 → DIZHI[(hourOrder+3)%12], hourOrder 子=1..亥=12
export const wenQu = (hourOrder) => DIZHI[((hourOrder + 3) % 12 + 12) % 12];
// 文昌: 从戌(10)起子时逆行 → DIZHI[(11-hourOrder+12)%12]
export const wenChang = (hourOrder) => DIZHI[((11 - hourOrder) % 12 + 12) % 12];
// 天魁 (from yearGan, ≈天乙贵人)
export const tianKui2 = (gan) => ({ 甲:'丑',戊:'丑',庚:'丑',乙:'子',己:'子',辛:'午',丙:'亥',丁:'亥',壬:'卯',癸:'卯' })[gan];
// 天钺
export const tianYue2 = (gan) => ({ 甲:'未',戊:'未',庚:'未',乙:'申',己:'申',辛:'寅',丙:'酉',丁:'酉',壬:'巳',癸:'巳' })[gan];

const FUXING_INFO = {
  左辅: { vi: 'Tả Phù', tone: 'cat', desc: 'quý nhân trợ lực, từ thiện' },
  右弼: { vi: 'Hữu Biệt', tone: 'cat', desc: 'quý nhân trợ lực, hòa giải' },
  文昌: { vi: 'Văn Xương', tone: 'cat', desc: 'học vấn, thi cử, văn chương' },
  文曲: { vi: 'Văn Khúc', tone: 'cat', desc: 'tài năng nghệ thuật, khẩu tài' },
  天魁: { vi: 'Thiên Khôi', tone: 'cat', desc: 'quý nhân nam, trên đề bạt' },
  天钺: { vi: 'Thiên Việt', tone: 'cat', desc: 'quý nhân nữ, dưới phò trợ' },
};

/**
 * @param {number} lunarMonth - tháng âm lịch (1-12)
 * @param {number} hourOrder - thứ tự giờ (子=1..亥=12)
 * @param {string} yearGan - năm thiên can
 * @returns {{stars:[{star,vi,tone,desc,atZhi}]}}
 */
export function computeFuxing(lunarMonth, hourOrder, yearGan) {
  const stars = [
    { star: '左辅', ...FUXING_INFO['左辅'], atZhi: zuoFu(lunarMonth) },
    { star: '右弼', ...FUXING_INFO['右弼'], atZhi: youBi(lunarMonth) },
    { star: '文昌', ...FUXING_INFO['文昌'], atZhi: wenChang(hourOrder) },
    { star: '文曲', ...FUXING_INFO['文曲'], atZhi: wenQu(hourOrder) },
    { star: '天魁', ...FUXING_INFO['天魁'], atZhi: tianKui2(yearGan) },
    { star: '天钺', ...FUXING_INFO['天钺'], atZhi: tianYue2(yearGan) },
  ];
  return { stars };
}

export { FUXING_INFO };
