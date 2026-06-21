// ============================================================================
//  TÀI KHỐ 财库 — KHO CHỨA TÀI LỘC (wealth storage)
//  Mỗi ngũ hành có "kho" (库/墓) riêng trong 4 chi Thổ: 辰戌丑未.
//  Có tài khố → giữ được tiền; không → tiền chảy qua tay.
//  Cũng kiểm 官库/印库. Nguồn: 三命通会, 渊海子平, 盲派 财库论.
// ============================================================================
import { GAN, ZHI, WX_VI } from './constants.js';

// 四库: mỗi hành → chi chứa (kho)
const WX_KU = { 水: '辰', 火: '戌', 金: '丑', 木: '未' };
// Thổ đặc biệt: 4 chi 辰戌丑未 đều là Thổ → Thổ kho = tất cả 4
const KU_VI = { 辰: 'Thìn', 戌: 'Tuất', 丑: 'Sửu', 未: 'Mùi' };

// Hành Tài = what 日 Chủ khắc
const TAI_WX = (dmWx) => ({ 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' })[dmWx];
// Hành Quan = what khắc 日 Chủ
const GUAN_WX = (dmWx) => ({ 木: '金', 火: '水', 土: '木', 金: '火', 水: '土' })[dmWx];
// Hành Ấn = what sinh 日 Chủ
const YIN_WX = (dmWx) => ({ 木: '水', 火: '木', 土: '火', 金: '土', 水: '金' })[dmWx];

/**
 * Kiểm tài khố + quan khố + ấn khố trong lá số.
 * @returns {{ taiku, hasTaiku, taikuZhi, guanku, hasGuanku, guankuZhi,
 *            yinku, hasYinku, yinkuZhi, allFour, opens, profile, advice }}
 */
export function analyzeCaiKu(R) {
  const chart = R.chart;
  const dmWx = chart.dayMaster.wx;

  // Hành Tài / Quan / Ấn
  const taikuWx = TAI_WX(dmWx);
  const guankuWx = GUAN_WX(dmWx);
  const yinkuWx = YIN_WX(dmWx);

  // Chi trong tứ trụ
  const allZhi = ['year', 'month', 'day', 'time'].map((k) => chart.pillars[k].zhi);

  // Tài khố
  const taikuZhi = WX_KU[taikuWx] || '?';
  const hasTaiku = taikuWx === '土' ? allZhi.some((z) => ['辰', '戌', '丑', '未'].includes(z)) : allZhi.includes(taikuZhi);
  const taikuPos = taikuWx === '土' ? allZhi.filter((z) => ['辰', '戌', '丑', '未'].includes(z)) : allZhi.filter((z) => z === taikuZhi);

  // Quan khố
  const guankuZhi = WX_KU[guankuWx] || '?';
  const hasGuanku = allZhi.includes(guankuZhi);

  // Ấn khố
  const yinkuZhi = WX_KU[yinkuWx] || '?';
  const hasYinku = allZhi.includes(yinkuZhi);

  // Có bao nhiêu trong 4 chi Thổ
  const fourTu = allZhi.filter((z) => ['辰', '戌', '丑', '未'].includes(z));

  // Khố bị xung (mở kho — tốt cho lấy tài; nhưng nếu kho mở vô tứ → hao)
  const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };
  const opens = [];
  for (const z of allZhi) {
    if (['辰', '戌', '丑', '未'].includes(z)) {
      const opp = CHONG[z];
      if (allZhi.includes(opp)) opens.push(`${z}↔${opp} (kho bị xung mở)`);
    }
  }

  // Hồ sơ
  const profile = [
    hasTaiku
      ? `✓ Có TÀI KHỐ: ${taikuWx === '土' ? '4 chi Thổ (' + taikuPos.join(',') + ')' : KU_VI[taikuZhi] + ' (' + taikuZhi + ')'} → GIỮ ĐƯỢC TIỀN. Tiền vào có nơi chứa, tích luỹ được.`
      : `✗ KHÔNG có tài khố (${taikuWx === '土' ? 'không chi Thổ nào' : 'thiếu ' + KU_VI[taikuZhi]}) → tiền dễ chảy qua tay, cần tích cực giữ (gửi tiết kiệm, mua BĐS).`,
    hasGuanku ? `✓ Có QUAN KHỐ (${KU_VI[guankuZhi]}): sự nghiệp có nền, quyền lực tích luỹ được.` : `Không quan khố: sự nghiệp phải liên tục duy trì.`,
    hasYinku ? `✓ Có ẤN KHỐ (${KU_VI[yinkuZhi]}): học vấn/bảo vệ có tích luỹ.` : `Không ấn khố.`,
    fourTu.length ? `4 chi Thổ (kho/tài cho nhiều mệnh): ${fourTu.map((z) => KU_VI[z]).join(', ')} (${fourTu.length} chi).` : 'Không chi Thổ nào trong tứ trụ.',
    opens.length ? `🔓 Kho mở (xung): ${opens.join(', ')} → kho bị mở, tài dễ ra (tốt cho chi tiêu đầu tư, xấu cho tích luỹ).` : 'Kho yên (không bị xung) → tiền tích luỹ được, khó lấy ra (cần vận mở kho).',
  ];

  const advice = hasTaiku && !opens.length
    ? 'Có tài khố + không bị xung → GIỮ TIỀN TỐT. Nên tích luỹ, gửi tiết kiệm, mua BĐS. Khi đại vận/lưu niên mang chi xung kho → cửa mở → lúc đó rút/đầu tư.'
    : hasTaiku && opens.length
      ? 'Có tài khố NHƯNG bị xung → kho MỞ → tiền vào ra nhanh. Tốt cho kinh doanh/đầu tư (dòng tiền lưu thông) nhưng khó tích luỹ dưa.'
      : !hasTaiku
        ? 'KHÔNG có tài khố → tiền dễ chảy. Bù đắp: (1) gửi tiết kiệm có kỷ luật, (2) mua BĐS/vàng (chuyển tiền thành vật), (3) đợi đại vận/lưu niên mang chi khố (vd ' + (WX_KU[taikuWx] || '?') + ') → "mở kho" để tích.'
        : 'Tài khố trung tính.';

  return {
    taikuWx, taikuWxVi: WX_VI[taikuWx], taikuZhi, taikuZhiVi: KU_VI[taikuZhi] || '?',
    hasTaiku, taikuPos,
    guankuWx: guankuWx, guankuZhi, hasGuanku,
    yinkuWx: yinkuWx, yinkuZhi, hasYinku,
    fourTu, opens, profile, advice,
  };
}

export { WX_KU, KU_VI, TAI_WX, GUAN_WX, YIN_WX };
