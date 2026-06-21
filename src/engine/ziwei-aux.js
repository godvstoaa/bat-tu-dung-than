// ============================================================================
//  TỬ VI LỤC CÁT + LỤC SÁT (六吉六煞) — 12 sao phụ trợ THIẾT YẾU
//  六吉: 左辅 右弼 文昌 文曲 天魁 天钺 — modify/boost 14 chính tinh.
//  六煞: 擎羊 陀罗 火星 铃星 地空 地劫 — damage/hinder 14 chính tinh.
//  Nguồn: 紫微斗数全书 安星诀 (verified).
// ============================================================================
const ZHI12 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const PAL12 = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑']; // 寅-based order
const idxOf = (z) => PAL12.indexOf(z);

// 生年干 → 禄存宫 (LU_SHEN table, verified)
const LUCUN = { 甲: '寅', 乙: '卯', 丙: '巳', 丁: '午', 戊: '巳', 己: '午', 庚: '申', 辛: '酉', 壬: '亥', 癸: '子' };
// 生年干 → 天魁(阳贵) + 天钺(阴贵)
const KUIYUE = {
  甲: { kui: '丑', yue: '未' }, 乙: { kui: '子', yue: '申' }, 丙: { kui: '酉', yue: '亥' },
  丁: { kui: '亥', yue: '酉' }, 戊: { kui: '丑', yue: '未' }, 己: { kui: '子', yue: '申' },
  庚: { kui: '丑', yue: '未' }, 辛: { kui: '寅', yue: '午' }, 壬: { kui: '卯', yue: '巳' },
  癸: { kui: '巳', yue: '卯' },
};
// 火铃 starting position by year branch group
const HUOLING_START = {
  申: { huo: '寅', ling: '戌' }, 子: { huo: '寅', ling: '戌' }, 辰: { huo: '寅', ling: '戌' },
  寅: { huo: '丑', ling: '卯' }, 午: { huo: '丑', ling: '卯' }, 戌: { huo: '丑', ling: '卯' },
  巳: { huo: '卯', ling: '戌' }, 酉: { huo: '卯', ling: '戌' }, 丑: { huo: '卯', ling: '戌' },
  亥: { huo: '酉', ling: '戌' }, 卯: { huo: '酉', ling: '戌' }, 未: { huo: '酉', ling: '戌' },
};

const AUX_INFO = {
  左辅: { vi: 'Tả Phụ', tone: 'cat', desc: 'phụ tá đắc lực — giúp đỡ, ổn định, hiền lành' },
  右弼: { vi: 'Hữu Bật', tone: 'cat', desc: 'phụ tá đắc lực — giao tế, hỗ trợ, nhu hoà' },
  文昌: { vi: 'Văn Xương', tone: 'cat', desc: 'học vấn, thi cử, tài năng văn học — lợi học hành' },
  文曲: { vi: 'Văn Khúc', tone: 'cat', desc: 'nghệ thuật,口 tài, âm nhạc — duyên dáng' },
  天魁: { vi: 'Thiên Khôi', tone: 'cat', desc: 'quý nhân dương — nam quý nhân giúp đỡ' },
  天钺: { vi: 'Thiên Việt', tone: 'cat', desc: 'quý nhân âm — nữ quý nhân phù trợ' },
  擎羊: { vi: 'Kình Dương', tone: 'sha', desc: 'sát khí cương mãnh — tổn thương, xung đột, phẫu thuật' },
  陀罗: { vi: 'Đà La', tone: 'sha', desc: ' trì trệ, đau đớn — trì hoãn, keo kiệt, vướng víu' },
  火星: { vi: 'Hỏa Tinh', tone: 'sha', desc: 'bạo hoả — nóng nảy, đột ngột, tai nạn' },
  铃星: { vi: 'Linh Tinh', tone: 'sha', desc: 'linh (伏火) — ẩn nộ, u uất, thị phi âm thầm' },
  地空: { vi: 'Địa Không', tone: 'sha', desc: 'không vong — hao tổn, phá tài, tâm linh, phi thực tế' },
  地劫: { vi: 'Địa Kiếp', tone: 'sha', desc: 'cướp đoạt — hao tài, trộm cắp, biến động bất ngờ' },
};

function fwd(start, steps) { return PAL12[(idxOf(start) + steps + 12) % 12]; }
function bwd(start, steps) { return PAL12[(idxOf(start) - steps + 12) % 12]; }

/**
 * Tính 12 sao phụ (六吉 + 六煞).
 * @param yearGan - 生年天干
 * @param yearZhi - 生年地支
 * @param lunarMonth - 农历月 (1-12)
 * @param timeZhi - 生时地支
 * @returns { starName: { branch, ...info } }
 */
export function computeAuxStars(yearGan, yearZhi, lunarMonth, timeZhi) {
  const m = lunarMonth - 1; // 0-based offset
  const t = ZHI12.indexOf(timeZhi); // 0-11 (子=0)
  const result = {};

  // 六吉: 左辅 右弼 (生月, 辰/戌起, 顺行)
  result['左辅'] = { branch: fwd('辰', m), ...AUX_INFO['左辅'] };
  result['右弼'] = { branch: fwd('戌', m), ...AUX_INFO['右弼'] };
  // 文昌 文曲 (生月, 戌/辰起, 逆行)
  result['文昌'] = { branch: bwd('戌', m), ...AUX_INFO['文昌'] };
  result['文曲'] = { branch: bwd('辰', m), ...AUX_INFO['文曲'] };
  // 天魁 天钺 (生年干)
  const ky = KUIYUE[yearGan] || { kui: '丑', yue: '未' };
  result['天魁'] = { branch: ky.kui, ...AUX_INFO['天魁'] };
  result['天钺'] = { branch: ky.yue, ...AUX_INFO['天钺'] };

  // 六煞: 擎羊 陀罗 (禄存 ± 1)
  const lucun = LUCUN[yearGan] || '寅';
  result['擎羊'] = { branch: fwd(lucun, 1), ...AUX_INFO['擎羊'] };
  result['陀罗'] = { branch: bwd(lucun, 1), ...AUX_INFO['陀罗'] };
  // 火星 铃星 (年支 group + 时)
  const hl = HUOLING_START[yearZhi] || { huo: '寅', ling: '戌' };
  result['火星'] = { branch: fwd(hl.huo, t), ...AUX_INFO['火星'] };
  result['铃星'] = { branch: fwd(hl.ling, t), ...AUX_INFO['铃星'] };
  // 地空 地劫 (亥起子时, 逆/顺)
  result['地空'] = { branch: bwd('亥', t), ...AUX_INFO['地空'] };
  result['地劫'] = { branch: fwd('亥', t), ...AUX_INFO['地劫'] };

  return result;
}

export { AUX_INFO, ZHI12, PAL12 };
