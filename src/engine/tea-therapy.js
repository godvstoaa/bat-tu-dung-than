// ============================================================================
//  TRÀ LIỆU PHÁP 茶疗法 — TEA THERAPY BY ELEMENT
//  5 loại trà → ngũ hành → tạng phủ. Dụng Thần → loại trà phù hợp.
//  "Uống trà gì? Khi nào? Pha thế nào? Tránh trà nào?"
//  Nguồn: 本草纲目 茶, 黄帝内经 茶疗.
// ============================================================================
import { WX_VI } from './constants.js';

const FIVE_TEAS = {
  木: {
    type: 'Trà xanh (绿茶)', vi: 'Lục trà',
    examples: 'Long Tỉnh (龙井), Bích Loa Xuân (碧螺春), Thái Nguyên Lục Trà, Tâm Tỷ Lộc Trà',
    wx: 'Mộc', organ: 'Gan–Mật',
    taste: 'than mát, hơi chát nhẹ, hậu ngọt',
    effect: 'thanh nhiệt gan, giải độc, sinh tân, hạ huyết áp, chống lão hóa',
    bestTime: 'sáng 7-11h (sau ăn sáng 30ph) — Mộc khí thịnh, thanh can',
    brewing: '70-80°C, 2-3ph, 2-3g/trà — tránh nước sôi (cháy lá xanh)',
    pairWith: 'thịt béo (giải ngấy), đồ chiên, mùa hè',
    caution: 'tránh uống lúc đói (sơ vị), tối (mất ngủ), đang uống thuốc',
    color: 'xanh lá nhạt',
  },
  火: {
    type: 'Trà đen (红茶)', vi: 'Hồng trà',
    examples: 'Chính Sơn Tiểu Chủng (Lapsang), Kỳ Môn Hồng Trà, Điền Hồng, Hồng trà Sri Lanka',
    wx: 'Hỏa', organ: 'Tim–Ruột non',
    taste: 'than noãn, ngọt, đậm, mùi hoa/quả',
    effect: 'noãn vị, dưỡng tâm, bổ huyết, kích thích tiêu hóa, hạ cholesterol',
    bestTime: '9-11h sáng hoặc 14-16h chiều — Hỏa khí ấm, dưỡng tâm',
    brewing: '90-95°C, 3-5ph, 3-5g/trà — nước sôi gần để dưỡng noãn',
    pairWith: 'sữa (trà sữa), bánh ngọt, mùa đông',
    caution: 'tránh tối (hưng phấn tim, mất ngủ); người huyết áp cao giảm',
    color: 'đỏ nâu/cam',
  },
  土: {
    type: 'Trà Ô Long (乌龙茶)', vi: 'Ô Long / Thanh trà',
    examples: 'Thiết Quan Âm (铁观音), Đại Hồng Bào (大红袍),Đông Phương Mỹ Nhân, Đài Loan Ô Long',
    wx: 'Thổ', organ: 'Tỳ–Vị',
    taste: 'than trung tính, hương hoa lan, hậu ngọt kéo dài',
    effect: 'bổ tỳ dưỡng vị, tiêu thực, giúp tiêu hóa mỡ, giảm cân, ổn định',
    bestTime: '11-13h trưa hoặc 15-17h chiều — Thổ khí ổn, sau bữa',
    brewing: '95°C, 1-2ph (ngắn), 5-7g/trà — có thể pha nhiều lần (7-10 lần)',
    pairWith: 'sau bữa trưa (tiêu thực), thịt nướng, đồ dầu mỡ',
    caution: 'tránh quá đậm (sơ vị); ô long phát triển nên giảm tối',
    color: 'vàng xanh/vàng mật',
  },
  金: {
    type: 'Trà trắng (白茶)', vi: 'Bạch trà',
    examples: 'Bạch Hào Ngân Châm (白毫银针), Bạch Mẫu Đan (白牡丹), Thọ Mỹ',
    wx: 'Kim', organ: 'Phổi–Đại tràng',
    taste: 'nhẹ, thanh, hơi ngọt, hoa nhài nhẹ',
    effect: 'thanh nhiệt phổi, hạ hỏa, đẹp da, chống viêm, cường phế',
    bestTime: '7-9h sáng hoặc 15-17h — Kim khí thịnh, thanh phế',
    brewing: '85-90°C, 3-5ph, 3-5g/trà — có thể hâm nhiều lần',
    pairWith: 'mùa thu (táo), da khô, viêm họng',
    caution: 'tránh quá lạnh (bạch trà già mới ngọt — năm càng lâu càng quý)',
    color: 'trắng vàng nhạt',
  },
  水: {
    type: 'Trà Pu-erh / Hắc trà (普洱/黑茶)', vi: 'Hắc trà / Phổ Nhĩ',
    examples: 'Pu-erh Shou (thục), Pu-erh Sheng (sanh), Lục Bảo, Hồ Nam Hắc Trà',
    wx: 'Thủy', organ: 'Thận–Bàng quang',
    taste: 'đậm, đất, ngọt hậu, trầm, ấm',
    effect: 'bổ thận, noãn vị, tiêu mỡ mạnh, hạ axit dạ dày, dưỡng tủy',
    bestTime: '15-19h chiều hoặc sau bữa tối — Thủy khí thịnh, dưỡng thận',
    brewing: '95-100°C, 3-5ph, 5-8g/trà — "rửa trà" 1 lần trước khi pha',
    pairWith: 'sau ăn mập (tiêu mỡ), mùa đông, tối (thục pu-erh ít caffeine)',
    caution: 'sheng pu-erh mạnh — tránh đói; shou pu-erh êm — uống tối được',
    color: 'đỏ sậm/đen',
  },
};

// Trà theo mục đích sức khoẻ
const PURPOSE_TEA = {
  detox: { vi: 'Giải độc/thanh nhiệt', tea: '木 (Lục trà)', alt: '金 (Bạch trà)' },
  digest: { vi: 'Tiêu hóa/sau ăn mập', tea: '土 (Ô long)', alt: '水 (Pu-erh)' },
  calm: { vi: 'An thần/tĩnh tâm', tea: '金 (Bạch trà)', alt: '水 (Pu-erh shou)' },
  energy: { vi: 'Tăng năng lượng/sáng', tea: '木 (Lục trà)', alt: '火 (Hồng trà)' },
  warm: { vi: 'Sưởi ấm/mùa đông', tea: '火 (Hồng trà)', alt: '水 (Pu-erh shou)' },
  weight: { vi: 'Giảm cân/tiêu mỡ', tea: '土 (Ô long)', alt: '水 (Pu-erh)' },
  skin: { vi: 'Đẹp da/chống lão hóa', tea: '木 (Lục trà)', alt: '金 (Bạch trà)' },
  sleep: { vi: 'Ngủ ngon (tối)', tea: '水 (Pu-erh shou)', alt: 'Kim (Bạch trà già)' },
  stomach: { vi: 'Dạ dày/đau vị', tea: '火 (Hồng trà)', alt: '土 (Ô long nhẹ)' },
  kidney: { vi: 'Bổ thận/dưỡng tủy', tea: '水 (Pu-erh)', alt: '土 (Ô long)' },
};

/**
 * @returns {{ dungTea, dungInfo, kyTea, kyInfo, purposeMap,
 *            dailySchedule, brewingTips, advice }}
 */
export function teaTherapy(R) {
  const dungWx = R.yong.primary;
  const xiWx = R.yong.xi;
  const kyWx = R.yong.ji;
  const dmWx = R.chart.dayMaster.wx;

  const dungTea = FIVE_TEAS[dungWx] || FIVE_TEAS['土']; // [loop 45] guard crash khi yong undefined
  const xiTea = FIVE_TEAS[xiWx] || FIVE_TEAS['土'];
  const kyTea = FIVE_TEAS[kyWx] || FIVE_TEAS['土'];

  // Lịch uống trà theo giờ
  const dailySchedule = [
    { time: '7-9h (Thìn)', season: 'sáng', tea: dungWx, teaVi: dungTea.type, effect: `Dụng Thần (${WX_VI[dungWx]}) — ${dungTea.effect.slice(0, 40)}`, note: dungTea.bestTime },
    { time: '11-13h (Ngọ)', season: 'trưa', tea: '土', teaVi: 'Ô Long', effect: 'tiêu thực sau bữa trưa', note: 'Ô long tiêu mỡ, ổn tỳ' },
    { time: '15-17h (Thân)', season: 'chiều', tea: xiWx, teaVi: xiTea.type, effect: `Hỷ Thần (${WX_VI[xiWx]}) — ${xiTea.effect.slice(0, 40)}`, note: xiTea.bestTime },
    { time: '19-21h (Tuất)', season: 'tối', tea: '水', teaVi: 'Pu-erh Shou', effect: 'dưỡng thận, an thần (nếu uống tối → chỉ shou pu-erh ít caffeine)', note: 'Tránh lục trà/hồng trà tối → mất ngủ' },
  ];

  const advice = `Trà Dụng Thần: ${dungTea.type} (${WX_VI[dungWx]}). ` +
    `${dungTea.effect}. ` +
    `Giờ tốt: ${dungTea.bestTime}. ` +
    `Pha: ${dungTea.brewing}. ` +
    `Tránh: ${kyTea.type} (${WX_VI[kyWx]} = Kỵ Thần). ` +
    `Mua: ${dungTea.examples.split(',').slice(0,2).join(', ')}.`;

  return {
    dungTea: dungWx, dungVi: WX_VI[dungWx], dungInfo: dungTea,
    xiTea: xiWx, xiVi: WX_VI[xiWx], xiInfo: xiTea,
    kyTea: kyWx, kyVi: WX_VI[kyWx], kyInfo: kyTea,
    purposeMap: PURPOSE_TEA, dailySchedule, advice,
    allTeas: FIVE_TEAS,
  };
}

export { FIVE_TEAS, PURPOSE_TEA };
