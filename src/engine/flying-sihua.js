// ============================================================================
//  TỨ HÓA PHI TINH 四化飞星 — FLYING SIHUA BETWEEN PALACES
//  Kỹ thuật Tử Vi cao cấp: từ mỗi cung → can cung đó hóa 4 hóa → bay đến
//  cung nào chứa sao được hóa → cho biết "mệnh (hay lĩnh vực X) ảnh hưởng
//  đến lĩnh vực Y thế nào" qua禄/权/科/忌.
//  Nguồn: 紫微斗数 飞星四化, 梁若瑜 飞星.
// ============================================================================
import { GAN } from './constants.js';

const SIHUA_TABLE = {
  甲: ['廉贞', '破军', '武曲', '太阳'], 乙: ['天机', '天梁', '紫微', '太阴'],
  丙: ['天同', '天机', '文昌', '廉贞'], 丁: ['太阴', '天同', '天机', '巨门'],
  戊: ['贪狼', '太阴', '右弼', '天机'], 己: ['武曲', '贪狼', '天梁', '文曲'],
  庚: ['太阳', '武曲', '太阴', '天同'], 辛: ['巨门', '太阳', '文曲', '文昌'],
  壬: ['天梁', '紫微', '左辅', '武曲'], 癸: ['破军', '巨门', '太阴', '贪狼'],
};
const SIHUA_KEY = ['禄', '权', '科', '忌'];
const SIHUA_VI = { 禄: 'Hóa Lộc (tài lộc, thuận)', 权: 'Hóa Quyền (quyền lực)', 科: 'Hóa Khoa (danh tiếng)', 忌: 'Hóa Kỵ (trở ngại)' };
const SIHUA_TONE = { 禄: 'cat', 权: 'cat', 科: 'cat', 忌: 'hung' };

const GAN_ORDER = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];

/**
 * Tính phi tinh từ 1 cung cụ thể.
 * @param {string} gan — thiên can của cung gốc
 * @param {object} starMap — { sao: chi_cung } (từ mainStars + fuxing)
 * @returns {{ from, flies:[{ hua, star, toZhi, tone, vi }] }}
 */
function flyFromGan(gan, starMap) {
  const four = SIHUA_TABLE[gan] || SIHUA_TABLE['癸'];
  const flies = [];
  for (let i = 0; i < 4; i++) {
    const hua = SIHUA_KEY[i]; // 禄/权/科/忌
    const star = four[i];
    const toZhi = starMap[star] || null;
    flies.push({
      hua, star, toZhi,
      vi: SIHUA_VI[hua], tone: SIHUA_TONE[hua],
      placed: !!toZhi,
    });
  }
  return { fromGan: gan, flies };
}

/**
 * Tính phi tinh từ TẤT CẢ 12 cung.
 * @param {object} z — kết quả computeZiwei
 * @returns {{ fromMing, fromFortune, fromCareer, fromWealth, fromSpouse,
 *            allFlies:[{palace, gan, flies}], summary }}
 */
export function flyingSihua(z) {
  if (!z?.palaces) return null;

  // Build star map: sao → chi
  const starMap = { ...(z.mainStars || {}) };
  if (z.fuxing?.stars) {
    for (const s of z.fuxing.stars) starMap[s.star] = s.atZhi;
  }

  // Map palace → gan
  const allFlies = [];
  const keyPalaces = ['命宫','财帛','官禄','夫妻','福德','疾厄','迁移','田宅'];

  for (const p of z.palaces) {
    const result = flyFromGan(p.gan, starMap);
    allFlies.push({
      palace: p.zh, palaceVi: p.vi?.split('(')[0] || p.zh,
      gan: p.gan, ganZhi: p.gan + p.zhi,
      flies: result.flies,
    });
  }

  // Focus: từ cung chính (命/财/官/夫/福)
  const findByPalace = (name) => allFlies.find(f => f.palace === name);
  const fromMing = findByPalace('命宫');
  const fromWealth = findByPalace('财帛');
  const fromCareer = findByPalace('官禄');
  const fromSpouse = findByPalace('夫妻');
  const fromFortune = findByPalace('福德');

  // Map chi → palace name for interpretation
  const chiToPalace = {};
  for (const p of z.palaces) chiToPalace[p.zhi] = p.vi?.split('(')[0]?.trim() || p.zh;

  // Summary: từ 命宫 → ảnh hưởng cung nào?
  const summaryLines = [];
  if (fromMing) {
    for (const f of fromMing.flies) {
      if (f.toZhi) {
        const toPalace = chiToPalace[f.toZhi] || '?';
        const tone = f.tone === 'cat' ? '✓ giúp' : '⚠ hại';
        summaryLines.push(`${tone} ${f.hua}${f.star} → cung ${toPalace} (${f.toZhi}): mệnh ảnh hưởng ${f.vi.includes('cát') ? 'tốt' : 'xấu'} ${toPalace.toLowerCase()}.`);
      }
    }
  }

  return {
    fromMing, fromWealth, fromCareer, fromSpouse, fromFortune,
    allFlies, chiToPalace,
    summary: summaryLines.join(' '),
  };
}

export { flyFromGan };
