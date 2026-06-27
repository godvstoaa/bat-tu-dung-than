// ============================================================================
//  紫微 三方四正 — TAM PHƯƠNG TỨ CHÍNH (cốt lõi đọc mệnh bàn 紫微)
//  "Cung Mệnh (Tài/Quan/Duyên) mạnh hay yếu?" — phải xét TAM PHƯƠNG TỨ CHÍNH,
//    không chỉ sao trong cung. Mỗi cung lấy: 本宫 + 2 cung tam hợp + 对宫 (xung).
//  * Tam phương (三合): cùng nhóm 地支三合 — 申子辰 / 寅午戌 / 巳酉丑 / 亥卯未.
//  * Tứ chính (对宫): chi đối xung (cách 6) — 子↔午 丑↔未 ...
//  * Ý nghĩa: 命宫三方四正 = 命 + 财帛 + 官禄 + 迁移 → đo CẢ CUỘC ĐỜI (cốt tủy).
//    Cung mạnh = tam phương tứ chính nhiều sao CÁT + chính tinh miếu vượng;
//    cung yếu = nhiều sao HÙNG/không + tinh hãm địa.
//  Khác ziwei.js (đặt sao từng cung): module này = ĐỌC SỨC CUNG qua tổ hợp 4 cung.
//  Nguồn: 紫微斗数全书 三方四正, 紫微斗数 看命要诀.
// ============================================================================
import { STARS_14 } from './ziwei-stars.js';

const TRINE = { 申: ['申', '子', '辰'], 子: ['申', '子', '辰'], 辰: ['申', '子', '辰'], 寅: ['寅', '午', '戌'], 午: ['寅', '午', '戌'], 戌: ['寅', '午', '戌'], 巳: ['巳', '酉', '丑'], 酉: ['巳', '酉', '丑'], 丑: ['巳', '酉', '丑'], 亥: ['亥', '卯', '未'], 卯: ['亥', '卯', '未'], 未: ['亥', '卯', '未'] };
const OPP = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
const AUX_TONE = { 左辅: '吉', 右弼: '吉', 文昌: '吉', 文曲: '吉', 天魁: '吉', 天钺: '吉', 禄存: '吉', 天马: '中', 擎羊: '凶', 陀罗: '凶', 火星: '凶', 铃星: '凶', 地空: '凶', 地劫: '凶' };

function starTone(star) {
  if (STARS_14[star]) {
    const t = STARS_14[star].tone;
    if (t === '吉' || t === '中吉') return 'cat';
    if (t === 'hung' || t === 'volatile') return 'hung'; // [loop 548] volatile=廉贞/贪狼/七杀/破军 — thiên hung/biến động
    return 'mid';
  }
  if (AUX_TONE[star] === '吉') return 'cat';
  if (AUX_TONE[star] === '凶') return 'hung';
  if (AUX_TONE[star] === '中') return 'mid';
  return 'mid';
}

/** 4 chi (本 + 2 tam hợp + đối cung) của 1 chi. */
export function sanfangSizheng(zhi) {
  const sanfang = TRINE[zhi].filter((z) => z !== zhi);
  return { self: zhi, sanfang, sizheng: OPP[zhi], all: [zhi, ...sanfang, OPP[zhi]] };
}

/**
 * Phân tích tam phương tứ chính của 1 cung.
 * @param {object} zr — kết quả computeZiwei() (có zr.palaces)
 * @param {string} focusZhi — chi của cung cần xét
 */
export function analyzePalaceSanfang(zr, focusZhi) {
  const { all } = sanfangSizheng(focusZhi);
  const palByZhi = {};
  for (const p of zr.palaces) palByZhi[p.zhi] = p;
  const focusPalace = palByZhi[focusZhi];

  const cat = [], hung = [], mid = [];
  const detail = [];
  for (const z of all) {
    const p = palByZhi[z];
    if (!p) continue;
    const role = z === focusZhi ? '本宫' : (z === OPP[focusZhi] ? '对宫' : '三方');
    for (const star of (p.stars || [])) {
      const tone = starTone(star);
      const e = { star, starVi: STARS_14[star]?.vi || star, tone, at: `${p.vi}(${role})` };
      if (tone === 'cat') cat.push(e); else if (tone === 'hung') hung.push(e); else mid.push(e);
    }
    detail.push({ zhi: z, palaceVi: p.vi, role, stars: p.stars || [] });
  }
  const score = cat.length - hung.length * 1.2;
  let verdict, verdictVi;
  if (score >= 2) { verdict = '旺强'; verdictVi = `Cung ${focusPalace?.vi || focusZhi} tam phương tứ chính CÁT VƯỢNG (${cat.length} cát / ${hung.length} hung) — cung mạnh, chủ sự nghiệp thuận, hiển đạt.`; }
  else if (score >= 0) { verdict = '中平'; verdictVi = `Cung ${focusPalace?.vi || focusZhi} tam phương tứ chính cân bằng (${cat.length} cát / ${hung.length} hung) — cung trung bình, cần nỗ lực.`; }
  else { verdict = '弱陷'; verdictVi = `Cung ${focusPalace?.vi || focusZhi} tam phương tứ chính suy yếu (${cat.length} cát / ${hung.length} hung) — cung hãm, chủ sự nghiệp gian nan, cần cát tinh lưu niên/new hỗ trợ.`; }
  return { focusZhi, focusPalace: focusPalace?.vi, all, detail, cat, hung, mid, score, verdict, verdictVi };
}

/**
 * Đọc CỐT TỦY = 命宫 tam phương tứ chính (= Mệnh + Tài + Quan + Duyên).
 */
export function ziweiCoreReading(zr) {
  const mingPalace = zr.palaces.find((p) => p.isMing);
  if (!mingPalace) return { summary: '(không tìm thấy Mệnh cung)' };
  const core = analyzePalaceSanfang(zr, mingPalace.zhi);
  let summary = `Mệnh cung (${mingPalace.vi}) tam phương tứ chính = Mệnh + Tài Bố + Quan Lộc + Thiên Di: ${core.verdictVi} ` +
    `Chính tinh: ${[mingPalace.zhi, ...TRINE[mingPalace.zhi].filter((z) => z !== mingPalace.zhi), OPP[mingPalace.zhi]].map((z) => zr.palaces.find((p) => p.zhi === z)?.vi + ':' + (zr.palaces.find((p) => p.zhi === z)?.stars || []).join('')).join(' | ')}.`;
  // 宫干自化 — nếu Mệnh cung có tự hóa thì ghi rõ (rất quan trọng), nếu không thì note toàn bàn.
  const zh = zr.zihua;
  if (zh && Array.isArray(zh.list) && zh.list.length) {
    const mingZihua = (zh.byPalace?.[mingPalace.zh]) || [];
    if (mingZihua.length) {
      summary += ` 宫干自化 tại Mệnh (${mingPalace.gan}${mingPalace.zhi}): ${mingZihua.map((r) => `tự化${r.hua}@${r.star} (${r.interpretation})`).join(' · ')}.`;
    } else {
      summary += ` Mệnh cung không bị tự hóa (ổn định). Toàn bàn có ${zh.list.length} cung tự hóa.`;
    }
  }
  // 飞星化入 (fly-IN) — các cung ĐỔ hóa vào Mệnh: cho biết vùng đời nào nuôi dưỡng (禄/权/科) hay
  // thương tổn (忌) bản thân. Ưu tiên 忌 (hại) + 禄 (nuôi) vì 2 loại tác động rõ nhất.
  const fx = zr.feixing;
  if (fx && fx.flyIn && fx.flyIn[mingPalace.zh]?.length) {
    const ins = fx.flyIn[mingPalace.zh];
    const ji = ins.filter((r) => r.hua === '忌').map((r) => `${r.fromVi} hóa Kỵ vào Mệnh`);
    const lu = ins.filter((r) => r.hua === '禄').map((r) => `${r.fromVi} hóa Lộc vào Mệnh`);
    const parts = [...lu, ...ji];
    if (parts.length) summary += ` 飛星化入 Mệnh: ${parts.join(' · ')}.`;
  }
  return { core, summary };
}

export { TRINE, OPP, AUX_TONE };
