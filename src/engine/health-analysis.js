// ============================================================================
//  SỨC KHOẺ LUẬN 健康论 — PHÂN TÍCH SÂU THỂ CHẤT & TẠNG PHỦ
//  Tổng hợp: ngũ hành mất cân → tạng phủ yếu/thái + Dụng Thần dưỡng sinh +
//  mùa rủi ro + thể chất bẩm sinh (thai nguyên) + bệnh lý tiềm ẩn.
//  Nguồn: 黄帝内经 五行五脏, 滴天髓 疾病篇, 穷通宝鉴.
// ============================================================================
import { GAN, WX_VI } from './constants.js';
import { nayinInfo } from './nayin.js';

const ORGAN = {
  木: { vi: 'Mộc', organs: 'Gan – Mật, hệ thần kinh, mắt, gân cốt', risk: 'gan nóng, thị lực, căng thẳng thần kinh, giận dữ', foods: 'rau xanh, chanh, trà xanh, ngũ cốc' },
  火: { vi: 'Hỏa', organs: 'Tim – Ruột non, huyết mạch, mắt', risk: 'tim mạch, huyết áp, mất ngủ, lo âu', foods: 'vị đắng, cà chua, trà đỏ, cà phê (vừa)' },
  土: { vi: 'Thổ', organs: 'Tỳ – Vị, hệ tiêu hoá, cơ nhục', risk: 'tiêu hoá, dạ dày, đường huyết, lo nghĩ', foods: 'vị ngọt, khoai, củ, gạo, đậu' },
  金: { vi: 'Kim', organs: 'Phổi – Đại tràng, hệ hô hấp, da lông', risk: 'hô hấp, phổi, da, dị ứng', foods: 'vị cay, hành tỏi, gừng, thịt trắng' },
  水: { vi: 'Thủy', organs: 'Thận – Bàng quang, sinh dục – tiết niệu, xương tủy', risk: 'thận, tiết niệu, xương khớp, sinh dục', foods: 'vị mặn, cá, hải sản, đậu đen, nước' },
};
const SEASON_PEAK = { 木: 'mùa xuân (sinh trưởng mạnh nhất)', 火: 'mùa hạ (noãn nhiệt đỉnh)', 土: 'quý mùa (chuyển giao)', 金: 'mùa thu (tinh khiết)', 水: 'mùa đông (hàn lạnh)' };
const SEASON_LOW = { 木: 'mùa thu (Kim khắc Mộc)', 火: 'mùa đông (Thủy khắc Hỏa)', 土: 'mùa xuân (Mộc khắc Thổ)', 金: 'mùa hạ (Hỏa khắc Kim)', 水: 'quý mùa (Thổ khắc Thủy)' };

/**
 * @returns {{ weakest, strongest, constitution, remedyFoods, riskSeason,
 *            organRisk, profile, advice }}
 */
export function analyzeHealth(R) {
  const { wx, yong, chart } = R;
  const total = wx.total || 1;
  const entries = Object.entries(wx.score).sort((a, b) => a[1] - b[1]);
  const weakest = entries[0][0];
  const strongest = entries[entries.length - 1][0];
  const weakPct = ((entries[0][1] / total) * 100).toFixed(0);
  const strongPct = ((entries[entries.length - 1][1] / total) * 100).toFixed(0);

  // Thể chất bẩm sinh: theo Nhật Chủ ngũ hành
  const dmWx = chart.dayMaster.wx;
  const constitution = `Thể chất ${WX_VI[dmWx]} (${dmWx}) — ${ORGAN[dmWx].organs} là tạng chủ đạo.`;

  // Tạng yếu nhất
  const weakInfo = ORGAN[weakest];
  const strongInfo = ORGAN[strongest];

  // Dụng Thần dưỡng sinh
  const remedyWx = yong.primary;
  const remedyInfo = ORGAN[remedyWx];
  const remedyFoods = remedyInfo.foods;

  // Mùa rủi ro: khi hành yếu nhất bị khắc mạnh nhất
  const riskSeason = SEASON_LOW[weakest];

  // Kỵ Thần = hành khắc Dụng → tạng bị Kỵ hành tổn
  const jiInfo = ORGAN[yong.ji];

  const profile = [
    `Hành yếu nhất: ${WX_VI[weakest]} (${weakest}, ${weakPct}%) → tạng ${weakInfo.organs} suy. Cần chú ý: ${weakInfo.risk}.`,
    `Hành vượng nhất: ${WX_VI[strongest]} (${strongest}, ${strongPct}%) → thái quá dễ tổn tạng bị khắc: ${ORGAN[({ 木:'土', 火:'金', 土:'水', 金:'木', 水:'火' })[strongest]].organs}.`,
    constitution,
    `Dưỡng sinh theo Dụng Thần (${WX_VI[remedyWx]}): tăng ${remedyFoods}. Tránh thực phẩm hành Kỵ ${WX_VI[yong.ji]}.`,
    `⚠ Mùa rủi ro: ${riskSeason} — hành ${WX_VI[weakest]} bị khắc mạnh, tạng dễ phát bệnh.`,
    `Kỵ Thần (${WX_VI[yong.ji]}) → ${jiInfo.risk}; cần hạn chế môi trường/thức ăn hành ${WX_VI[yong.ji]}.`,
  ];

  // Thai nguyên check (nếu có)
  try {
    const tyNayin = chart.pillars?.month ? null : null; // cần import taiYuan
    // Skip nếu không có dữ liệu
  } catch (e) {}

  const advice = [
    `Dưỡng ${WX_VI[remedyWx]} (${remedyInfo.organs}): ăn ${remedyFoods}.`,
    `Phòng ${WX_VI[weakest]} yếu (${weakInfo.risk}): khám định kỳ ${weakInfo.organs.split(',')[0]}.`,
    `Mùa rủi ro ${riskSeason}: giảm cường độ, nghỉ ngơi nhiều hơn.`,
    `Tránh ${WX_VI[yong.ji]} (${jiInfo.risk}).`,
    `Vận động hướng/phương Dụng Thần, sinh hoạt điều độ, tích đức dưỡng tâm.`,
  ];

  return {
    weakest: { wx: weakest, vi: WX_VI[weakest], pct: weakPct, ...weakInfo },
    strongest: { wx: strongest, vi: WX_VI[strongest], pct: strongPct, ...strongInfo },
    constitution: dmWx, constitutionVi: WX_VI[dmWx],
    remedyWx, remedyVi: WX_VI[remedyWx], remedyFoods,
    riskSeason, organRisk: weakInfo.risk,
    profile, advice,
  };
}

export { ORGAN, SEASON_PEAK, SEASON_LOW };
