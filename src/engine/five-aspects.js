// ============================================================================
//  NGŨ ĐỨC LUẬN 五德论 — 5 ĐỨC TÍNH theo nhật chủ ngũ hành
//  Mỗi hành có 2 đức tính chính → đánh giá nhu cầu phát triển cá nhân.
//  Nguồn: 尚书 洪范 五行, 黄帝内经 阴阳应象, 滴天髓.
//  Mộc=仁, Hỏa=礼, Thổ=信, Kim=义, Thủy=智.
// ============================================================================
import { GAN, WX_VI } from './constants.js';

const FIVE_VIRTUES = {
  木: {
    virtue: '仁 (Nhân)', desc: 'yêu thương, từ bi, bao dung',
    strong: 'giàu lòng thương, giúp người, bảo vệ kẻ yếu, chính trực',
    weak: 'dễ tức giận, cố chấp, thiếu khoan dung, tổn thương gan',
    cultivation: 'rèn lòng bao dung, giảm nóng giận, tha thứ, trồng cây/thiên nhiên',
    balance: 'Nhân cần 礼 (Hỏa) để bộc lộ + 智 (Thủy) để linh hoạt',
  },
  火: {
    virtue: '礼 (Lễ)', desc: 'tôn trọng, lễ nghi, trật tự, văn minh',
    strong: 'lễ phép, biết tôn trọng, lan tỏa nhiệt huyết, văn minh',
    weak: 'dễ vô lễ/hống hạch, phô trương, thiểu lễ, bốc đồng',
    cultivation: 'học lễ nghi, khiêm nhường, kiểm soát nóng giận, giảm phô',
    balance: 'Lễ cần 智 (Thủy) để tiết chế + 信 (Thổ) để bền vững',
  },
  土: {
    virtue: '信 (Tín)', desc: 'uy tín, thành thật, đáng tin, trung thành',
    strong: 'giữ lời hứa, tin cậy, trung thành, bao dung nuôi dưỡng',
    weak: 'đa nghi, không giữ lời, thiếu tín, dễ bị lợi dụng',
    cultivation: 'giữ lời hứa, thành thật, xây dựng uy tín, kiên nhẫn',
    balance: 'Tín cần 智 (Thủy) để linh hoạt + 仁 (Mộc) để từ bi',
  },
  金: {
    virtue: '义 (Nghĩa)', desc: 'công lý, chính nghĩa, trách nhiệm, liêm khiết',
    strong: 'trọng nghĩa khí, công bình, quyết đoán, dũng cảm',
    weak: 'cứng rắn quá, thiếu tình người, dễ tổn thương người khác',
    cultivation: 'rèn lòng thương (Nhân), mềm mỏng hơn, biết nhường nhịn',
    balance: 'Nghĩa cần 礼 (Hỏa) để ấm áp + 仁 (Mộc) để từ bi',
  },
  水: {
    virtue: '智 (Trí)', desc: 'trí tuệ, mưu lược, uyển chuyển, thấu hiểu',
    strong: 'thông minh, mưu lược, linh hoạt, giàu trực giác, học hỏi nhanh',
    weak: 'xảo quyệt, thiếu chính trực, trôi nổi, không kiên định',
    cultivation: 'dùng trí vì thiện, giữ chữ tín, bền bỉ, tránh xảo trá',
    balance: 'Trí cần 信 (Thổ) để vững + 义 (Kim) để chính trực',
  },
};

/**
 * @returns {{ primary, primaryVi, virtue, desc, strong, weak, cultivation, balance,
 *            missingVirtue, missingDesc, secondary, secondaryVi, advice }}
 */
export function analyzeFiveVirtues(R) {
  const dmWx = chart_dayMaster_wx(R);
  const yongPrimary = R.yong?.primary;
  const yongXi = R.yong?.xi;
  const yongJi = R.yong?.ji;

  const primary = FIVE_VIRTUES[dmWx];
  // Dụng Thần đức tính → cần bồi
  const dungVirtue = FIVE_VIRTUES[yongPrimary];
  // Kỵ Thần đức tính → cần kiểm soát
  const kyVirtue = FIVE_VIRTUES[yongJi];

  const advice = [
    `Đức tính cốt lõi: **${primary.virtue}** (${primary.desc}). Mạnh: ${primary.strong}. Cần bồi: ${primary.cultivation}.`,
    `Dụng Thần (${WX_VI[yongPrimary] || '?'}) = đức **${dungVirtue?.virtue || '?'}**: nên phát triển ${dungVirtue?.desc || ''} để bổ mệnh.`,
    `Kỵ Thần (${WX_VI[yongJi] || '?'}) = đức **${kyVirtue?.virtue || '?'}**: cần kiểm soát ${kyVirtue?.weak || ''} — khi thái quá dễ gây họa.`,
    `Cân bằng: ${primary.balance}.`,
  ];

  return {
    primary: dmWx, primaryVi: WX_VI[dmWx],
    virtue: primary.virtue, desc: primary.desc,
    strong: primary.strong, weak: primary.weak,
    cultivation: primary.cultivation, balance: primary.balance,
    dungVirtue: dungVirtue?.virtue || '?', dungCultivation: dungVirtue?.cultivation || '',
    kyVirtue: kyVirtue?.virtue || '?', kyWeak: kyVirtue?.weak || '',
    advice,
  };
}

function chart_dayMaster_wx(R) { return R.chart?.dayMaster?.wx || '木'; }
