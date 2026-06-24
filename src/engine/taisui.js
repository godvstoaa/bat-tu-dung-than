// ============================================================================
//  THÁI TUẾ 太岁 — Phạm Thái Tuế & Hoá Giải (chạy cho MỌI năm)
//  5 loại phạm: 值/冲/刑/破/害 thái tuế. Mỗi con → loại phạm + hoá giải
//  (三合饰物 + phương pháp chung). + phương vị thái tuế + thời điểm lập xuân.
//  Nguồn: 通胜太岁, 商业周刊/知乎 2026化太岁, 维基太岁.
// ============================================================================
import { ZHI, ZHI_ORDER } from './constants.js';

// Quan hệ (mutual): 六害, 六破
const HAI_PAIRS = ['子未', '丑午', '寅巳', '卯辰', '申亥', '酉戌']; // mutual
const PO_PAIRS = ['子酉', '丑辰', '寅亥', '卯午', '巳申', '未戌']; // mutual
const CHONG_PAIRS = ['子午', '丑未', '寅申', '卯酉', '辰戌', '巳亥']; // mutual

// Tam hợp cục → mỗi chi có 2 "đồng minh" (三合) để佩 trị (hoặc hoá giải)
const SANHE_TRIO = [['申', '子', '辰'], ['寅', '午', '戌'], ['巳', '酉', '丑'], ['亥', '卯', '未']];
const SANHE_PARTNER = (() => {
  const m = {};
  for (const t of SANHE_TRIO) for (const z of t) m[z] = t.filter((x) => x !== z);
  return m;
})();

// Hình: cho 1 chi, trả mảng chi "hình" nó (gồm tự hình)
function xingOf(zhi) {
  // Tự hình
  if (['辰', '午', '酉', '亥'].includes(zhi)) return [zhi];
  // Vô lễ: 子↔卯
  if (zhi === '子') return ['卯'];
  if (zhi === '卯') return ['子'];
  // Thế thế: 寅巳申 (cyclic, mỗi con bị 2 con kia hình)
  if (['寅', '巳', '申'].includes(zhi)) return ['寅', '巳', '申'].filter((x) => x !== zhi);
  // Vô ân: 丑戌未
  if (['丑', '戌', '未'].includes(zhi)) return ['丑', '戌', '未'].filter((x) => x !== zhi);
  return [];
}
function inPair(zhi, yearZhi, pairs) {
  return pairs.some((p) => (p[0] === zhi && p[1] === yearZhi) || (p[0] === yearZhi && p[1] === zhi));
}

const TYPE_VI = {
  zhi: 'Giá trị (值太岁) — bản mệnh năm, "năm tuổi", biến động nặng',
  chong: 'Xung (冲太岁) — đối diện thái tuế, đại biến động/Phá',
  xing: 'Hình (刑太岁) — quan phi, thị phi, hình sự nhẹ',
  po: 'Phá (破太岁) — phá hoại, đổ vỡ hợp tác/tình cảm',
  hai: 'Hại (害太岁) — tiểu nhân ám toán, hao mòn ngầm',
};

// Phương vị thái tuế = phương của chi năm
const ZHI_DIR = { 子: 'Bắc', 丑: 'Đông Bắc', 寅: 'Đông Bắc', 卯: 'Đông', 辰: 'Đông Nam', 巳: 'Đông Nam', 午: 'Nam', 未: 'Tây Nam', 申: 'Tây Nam', 酉: 'Tây', 戌: 'Tây Bắc', 亥: 'Tây Bắc' };

/**
 * Toàn bộ 12 con giáp → trạng thái phạm thái tuế trong năm yearZhi.
 * @returns [{zhi, zodiac, types:[...], level}]
 */
export function taSuiTable(yearZhi) {
  const out = [];
  for (const z of ZHI_ORDER) {
    const types = [];
    if (z === yearZhi) types.push('zhi');
    if (inPair(z, yearZhi, CHONG_PAIRS)) types.push('chong');
    if (xingOf(yearZhi).includes(z)) types.push('xing');
    if (inPair(z, yearZhi, PO_PAIRS)) types.push('po');
    if (inPair(z, yearZhi, HAI_PAIRS)) types.push('hai');
    let level = 'an';
    if (types.includes('zhi') || types.includes('chong')) level = 'nặng';
    else if (types.length) level = 'nhẹ';
    out.push({ zhi: z, zodiac: ZHI[z].con, types, level });
  }
  return out;
}

/**
 * Trạng thái phạm + hoá giải CÁ NHÂN (theo chi năm sinh).
 */
export function personalTaSui(birthZhi, yearZhi) {
  const row = taSuiTable(yearZhi).find((r) => r.zhi === birthZhi);
  if (!row || !row.types.length) return { offends: false, msg: `Tuổi ${ZHI[birthZhi].con} (${birthZhi}) KHÔNG phạm thái tuế năm này — bình an.` };
  const typeNames = row.types.map((t) => TYPE_VI[t].split('—')[0].trim());
  const partners = (SANHE_PARTNER[birthZhi] || []).map((z) => ZHI[z].con);
  return {
    offends: true,
    level: row.level,
    types: row.types.map((t) => ({ key: t, vi: TYPE_VI[t] })),
    msg: `Tuổi ${ZHI[birthZhi].con} (${birthZhi}) PHẠM ${typeNames.join(' + ')} thái tuế → ${row.level === 'nặng' ? 'cần hoá giải gấp' : 'nên chú ý'}.`,
    remedyCharms: partners,
  };
}

// 7 pháp hoá thái tuế (chung)
export const TAISUI_REMEDY = [
  '① 拜太岁 / 安太岁 — sau Lập Xuân (≈4/2 dương), đến đền/chùa đăng ký an thái tuế.',
  '② 佩 tam hợp sinh tiếu — 戴 hình con giáp tam hợp với tuổi mình (xem gợi ý) để mượn sức đồng minh.',
  '③ Trị "huyết quang" — hiến máu / cạo máu / trích nha (đánh răng rút máu) chủ động ứng huyết quang, hoá tai nạn.',
  '④ Đỗ xuân (躲春) — đúng giờ Lập Xuân ở yên trong nhà, trấn tĩnh, tránhdynamic.',
  '⑤ Thái tuế phù — mang theo/贴 太岁符; cuối năm hoá (đốt/trả đền).',
  '⑥ Hành thiện tích đức — quyên góp, phóng sinh, làm việc tốt (thái tuế tinh quân tra xét thiện ác).',
  '⑦ Giữ 提供 — cẩn trọng, khiêm nhường, tránh khẩu thiệt; không động thổ phương thái tuế.',
];

export function taSuiDirection(yearZhi) { return ZHI_DIR[yearZhi] || '?'; }
export { SANHE_PARTNER, TYPE_VI };
