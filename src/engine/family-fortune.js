// ============================================================================
//  GIA ĐẠO LUẬN 家道论 — FAMILY HARMONY & KIN ANALTEGRATION
//  "Gia đình hòa hợp không? Cha mẹ/anh em/vợ chồng/con cái ra sao?"
//  Tổng hợp: lục thân + phối ngẫu + tử nữ + hội hợp giữa các trụ +
//  khuyến nghị cải thiện từng mối quan hệ.
//  Nguồn: 渊海子平 六亲篇, 滴天髓 父子兄弟.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { SHENG, KE } from './constants.js';

const RELATION_KEYS = ['father', 'mother', 'siblings', 'spouse', 'children'];

const RELATION_MAP_MALE = {
  father: { stars: ['偏財','正財'], palace: 'year,month', name: 'Cha', starLabel: 'Tài (cha)' },
  mother: { stars: ['正印','偏印'], palace: 'year,month', name: 'Mẹ', starLabel: 'Ấn (mẹ)' },
  siblings: { stars: ['比肩','劫財'], palace: 'month', name: 'Anh chị em', starLabel: 'Tỷ Kiếp' },
  spouse: { stars: ['正財','偏財'], palace: 'day', name: 'Vợ', starLabel: 'Tài (vợ)' },
  children: { stars: ['七殺','正官'], palace: 'time', name: 'Con cái', starLabel: 'Quan Sát (con)' },
};
const RELATION_MAP_FEMALE = {
  father: { stars: ['偏財','正財'], palace: 'year,month', name: 'Cha', starLabel: 'Tài (cha)' },
  mother: { stars: ['正印','偏印'], palace: 'year,month', name: 'Mẹ', starLabel: 'Ấn (mẹ)' },
  siblings: { stars: ['比肩','劫財'], palace: 'month', name: 'Anh chị em', starLabel: 'Tỷ Kiếp' },
  spouse: { stars: ['正官','七殺'], palace: 'day', name: 'Chồng', starLabel: 'Quan (chồng)' },
  children: { stars: ['食神','傷官'], palace: 'time', name: 'Con cái', starLabel: 'Thực Thương (con)' },
};

/**
 * @returns {{ relations:[{key, name, stars, count, strength, palaceZhi, palaceStable,
 *            isYong, isJi, harmonyScore, issues, advice}], familyScore, advice }}
 */
export function analyzeFamilyHarmony(R) {
  const { chart, yong, interactions } = R;
  const isMale = chart.input.gender === 'nam';
  const map = isMale ? RELATION_MAP_MALE : RELATION_MAP_FEMALE;
  const dayZhi = chart.pillars.day.zhi;

  const relations = [];

  for (const [key, info] of Object.entries(map)) {
    // Đếm sao
    let count = 0;
    const positions = [];
    for (const k of ['year','month','time']) {
      if (info.stars.includes(chart.pillars[k].ganGod)) { count += 1; positions.push(k+'(can)'); }
    }
    for (const k of ['year','month','day','time']) {
      if (info.stars.includes(chart.pillars[k].hidden[0]?.god)) { count += 0.5; positions.push(k+'(tàng)'); }
    }

    // Cung vị
    const palKeys = info.palace.split(',');
    const palaceZhi = palKeys.map(k => chart.pillars[k.trim()].zhi).join('/');
    const palaceStable = palKeys.every(k => {
      const z = chart.pillars[k.trim()].zhi;
      return !interactions.chong.some(c => c.a === z || c.b === z) && !interactions.xing.some(c => c.a === z || c.b === z);
    });

    // Dụng/Kỵ
    const starWx = info.stars[0] === '正財' || info.stars[0] === '偏財' ? ({木:'土',火:'金',土:'水',金:'木',水:'火'})[chart.dayMaster.wx]
      : info.stars[0] === '正印' || info.stars[0] === '偏印' ? ({木:'水',火:'木',土:'火',金:'土',水:'金'})[chart.dayMaster.wx]
      : info.stars[0] === '七殺' || info.stars[0] === '正官' ? ({木:'金',火:'水',土:'木',金:'火',水:'土'})[chart.dayMaster.wx]
      : info.stars[0] === '食神' || info.stars[0] === '傷官' ? ({木:'火',火:'土',土:'金',金:'水',水:'木'})[chart.dayMaster.wx]
      : chart.dayMaster.wx; // Tỷ Kiếp
    const isYong = yong.primary === starWx || yong.xi === starWx;
    const isJi = yong.ji === starWx || yong.chou === starWx;

    // Harmony score
    let harmonyScore = 55;
    if (count >= 1.5) harmonyScore += 12;
    else if (count <= 0) harmonyScore -= 10;
    if (palaceStable) harmonyScore += 8;
    else harmonyScore -= 8;
    if (isYong) harmonyScore += 10;
    if (isJi) harmonyScore -= 10;
    harmonyScore = Math.max(15, Math.min(95, harmonyScore));

    // Issues
    const issues = [];
    if (count <= 0) issues.push(`Sao ${info.starLabel} khuyết/ẩn → duyên ${info.name} mỏng, tự lập sớm.`);
    if (!palaceStable) issues.push(`Cung ${info.name} (${palaceZhi}) bị xung → quan hệ bất ổn.`);
    if (isJi) issues.push(`Sao ${info.name} = Kỵ Thần → mối quan hệ này mang áp lực.`);
    if (count >= 3) issues.push(`Sao ${info.starLabel} quá nhiều → ${info.name} nhiều/đa tạo phức tạp.`);

    // Advice
    let advice;
    if (harmonyScore >= 70) advice = `✓ ${info.name}: quan hệ tốt — nên trân trọng, duy trì.`;
    else if (harmonyScore >= 50) advice = `${info.name}: quan hệ trung — cần chủ động giao tiếp.`;
    else advice = `⚠ ${info.name}: quan hệ thử thách — cần bao dung, nhẫn nhịn, cải vận.`;

    relations.push({ key, name: info.name, starLabel: info.starLabel, stars: info.stars, count,
      strength: count >= 1.5 ? 'vượng' : count > 0 ? 'vừa' : 'nhược',
      palaceZhi, palaceStable, starWx, starWxVi: WX_VI[starWx], isYong, isJi,
      harmonyScore, issues, advice });
  }

  // Family score tổng
  const familyScore = Math.round(relations.reduce((s, r) => s + r.harmonyScore, 0) / relations.length);
  const weakest = relations.reduce((a, b) => b.harmonyScore < a.harmonyScore ? b : a);
  const strongest = relations.reduce((a, b) => b.harmonyScore > a.harmonyScore ? b : a);

  const advice = familyScore >= 70
    ? `Gia đạo HÒA HỢP (score ${familyScore}). Mạnh nhất: ${strongest.name}. Duy trì + trân trọng.`
    : familyScore >= 55
      ? `Gia đạo TRUNG BÌNH (score ${familyScore}). Cần chú ý: ${weakest.name} (${weakest.advice}).`
      : `Gia đạo THỬ THÁCH (score ${familyScore}). Yếu nhất: ${weakest.name}. Cải vận: bao dung, tích đức, chọn Dụng Thần thời điểm giải quyết xung đột.`;

  return { relations, familyScore, weakest, strongest, advice };
}
