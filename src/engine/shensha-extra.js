// ============================================================================
//  THẦN SÁT MỞ RỘNG (神煞扩展) — các sao theo năm CAN/CHI (生年干支系)
//  Bổ sung cho shensha.js: 红鸾/天喜 (hôn nhân), 华盖/劫煞/孤辰/寡宿/破碎/大耗
//  (凶煞), 禄存 (lộc), 擎羊/陀罗 (xung đột/trở ngại), 天魁/天钺 (quý nhân).
//  Bảng CHUẨN theo cnblogs voidobject (安生年干支系诸星).
// ============================================================================
const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// Nhóm tam hợp của chi
const GROUP = (z) => {
  if (['申', '子', '辰'].includes(z)) return 'SZC';
  if (['亥', '卯', '未'].includes(z)) return 'HMW';
  if (['寅', '午', '戌'].includes(z)) return 'PWZ';
  return 'SYC'; // 巳酉丑
};

// 红鸾: 从卯(3)起子年逆数
export function hongLuan(z) { return ZHI_ORDER[((3 - ZHI_ORDER.indexOf(z)) % 12 + 12) % 12]; }
// 天喜 = 红鸾对宫 (+6)
export function tianXi(z) { return ZHI_ORDER[(ZHI_ORDER.indexOf(hongLuan(z)) + 6) % 12]; }
// 华盖 (四墓): SZC→辰, HMW→未, PWZ→戌, SYC→丑
export function huaGai2(z) { return { SZC: '辰', HMW: '未', PWZ: '戌', SYC: '丑' }[GROUP(z)]; }
// 劫煞 (四马): SZC→巳, HMW→申, PWZ→亥, SYC→寅
export function jieSha(z) { return { SZC: '巳', HMW: '申', PWZ: '亥', SYC: '寅' }[GROUP(z)]; }
// 孤辰 (四马): 寅卯辰→巳, 巳午未→申, 申酉戌→亥, 亥子丑→寅
export function guChen(z) {
  const i = ZHI_ORDER.indexOf(z);
  const grp = Math.floor((((i - 2 + 12) % 12)) / 3); // 0=寅卯辰... nhưng ta dùng nhóm mùa
  return ['巳', '申', '亥', '寅'][['寅卯辰', '巳午未', '申酉戌', '亥子丑'].findIndex((g) => g.includes(z))];
}
// 寡宿 (四墓): 寅卯辰→丑, 巳午未→辰, 申酉戌→未, 亥子丑→戌
export function guaSu(z) {
  return ['丑', '辰', '未', '戌'][['寅卯辰', '巳午未', '申酉戌', '亥子丑'].findIndex((g) => g.includes(z))];
}
// 破碎: 子午卯酉→巳, 辰戌丑未→丑, 寅申巳亥→酉
export function poSui(z) {
  if (['子', '午', '卯', '酉'].includes(z)) return '巳';
  if (['辰', '戌', '丑', '未'].includes(z)) return '丑';
  return '酉';
}
// 大耗 (12 chi riêng)
export function daHao(z) {
  const m = { 子: '未', 丑: '午', 寅: '酉', 卯: '申', 辰: '亥', 巳: '戌', 午: '丑', 未: '子', 申: '卯', 酉: '寅', 戌: '巳', 亥: '辰' };
  return m[z];
}
// 禄存 (年干): 甲→寅 乙→卯 丙戊→巳 丁己→午 庚→申 辛→酉 壬→亥 癸→子
export function luCun(g) {
  const m = { 甲: '寅', 乙: '卯', 丙: '巳', 戊: '巳', 丁: '午', 己: '午', 庚: '申', 辛: '酉', 壬: '亥', 癸: '子' };
  return m[g];
}
// 擎羊 = 禄存+1 (顺), 陀罗 = 禄存-1 (逆)
export const qingYang = (g) => ZHI_ORDER[(ZHI_ORDER.indexOf(luCun(g)) + 1) % 12];
export const tuoLuo = (g) => ZHI_ORDER[(ZHI_ORDER.indexOf(luCun(g)) - 1 + 12) % 12];
// 天魁/天钺 (年干, ≈ 天乙贵人): 甲戊庚→丑/未, 乙己→子/申, 辛→午/寅, 丙丁→亥/酉, 壬癸→卯/巳
export function tianKui(g) {
  const m = { 甲: '丑', 戊: '丑', 庚: '丑', 乙: '子', 己: '子', 辛: '午', 丙: '亥', 丁: '亥', 壬: '卯', 癸: '卯' };
  return m[g];
}
export function tianYue(g) {
  const m = { 甲: '未', 戊: '未', 庚: '未', 乙: '申', 己: '申', 辛: '寅', 丙: '酉', 丁: '酉', 壬: '巳', 癸: '巳' };
  return m[g];
}

const EXTRA_INFO = {
  hongLuan: { zh: '红鸾', vi: 'Hồng Loan', desc: 'sao hôn nhân — năm gặp dễ có chuyện tình duyên, cưới hỏi', tone: 'cat' },
  tianXi: { zh: '天喜', vi: 'Thiên Hỷ', desc: 'sao vui vẻ, hỷ sự — đối cung Hồng Loan, lợi hôn nhân', tone: 'cat' },
  huaGai2: { zh: '华盖', vi: 'Hoa Cái (niên)', desc: 'trí tuệ, tâm linh, nghệ thuật (niên ban khác nhật ban)', tone: 'neutral' },
  jieSha: { zh: '劫煞', vi: 'Kiếp Sát', desc: 'sao hao tổn, dễ gặp mất mát, cẩn thận tiền bạc', tone: 'hung' },
  guChen: { zh: '孤辰', vi: 'Cô Thần', desc: 'cô đơn — nam kỵ, dễ cô quả, ảnh hưởng hôn nhân', tone: 'hung' },
  guaSu: { zh: '寡宿', vi: 'Quả Túc', desc: 'góa bụa — nữ kỵ, dễ cô đơn, ảnh hưởng hôn nhân', tone: 'hung' },
  poSui: { zh: '破碎', vi: 'Phách Toái', desc: 'dễ vỡ, hao tốn, tiểu nhân', tone: 'hung' },
  daHao: { zh: '大耗', vi: 'Đại Hao', desc: 'hao tiền lớn, phá tán', tone: 'hung' },
  luCun: { zh: '禄存', vi: 'Lộc Tồn', desc: 'sao tài lộc thật sự — mang phú quý (紫微 lộc tinh)', tone: 'cat' },
  qingYang: { zh: '擎羊', vi: 'Thanh Dương', desc: 'sao đao thương, xung đột, phẫu thuật, cẩn thận thương tích', tone: 'hung' },
  tuoLuo: { zh: '陀罗', vi: 'Đà La', desc: 'trở ngại, dây dưa,延迟, tiểu nhân ngầm', tone: 'hung' },
  tianKui: { zh: '天魁', vi: 'Thiên Khôi', desc: 'quý nhân nam — trên đắc lực đề bạt', tone: 'cat' },
  tianYue: { zh: '天钺', vi: 'Thiên Việt', desc: 'quý nhân nữ — dưới đắc lực phò trợ', tone: 'cat' },
};

/**
 * Tính toàn bộ thần sát mở rộng (theo năm can + năm chi).
 * @returns {Array<{key,zh,vi,desc,tone,at}>} at = chi cung sao đó đóng
 */
export function computeShenshaExtra(chart) {
  const yearZhi = chart.pillars.year.zhi;
  const yearGan = chart.pillars.year.gan;
  const atZ = (b) => chart.pillars && [chart.pillars.year.zhi, chart.pillars.month.zhi, chart.pillars.day.zhi, chart.pillars.time.zhi].includes(b) ? `cư ${b}` : `đóng ${b}`;
  const list = [
    ['hongLuan', hongLuan(yearZhi)], ['tianXi', tianXi(yearZhi)],
    ['huaGai2', huaGai2(yearZhi)], ['jieSha', jieSha(yearZhi)],
    ['guChen', guChen(yearZhi)], ['guaSu', guaSu(yearZhi)],
    ['poSui', poSui(yearZhi)], ['daHao', daHao(yearZhi)],
    ['luCun', luCun(yearGan)], ['qingYang', qingYang(yearGan)], ['tuoLuo', tuoLuo(yearGan)],
    ['tianKui', tianKui(yearGan)], ['tianYue', tianYue(yearGan)],
  ];
  return list.map(([key, branch]) => ({ key, ...EXTRA_INFO[key], at: branch, inChart: atZ(branch) }))
    .filter((x) => x.zh); // bỏ nếu thiếu info
}

export { EXTRA_INFO };
