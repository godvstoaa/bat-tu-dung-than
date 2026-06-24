// ============================================================================
//  PHƯƠNG HƯỚNG LIỆU PHÁP 芳香疗法 — AROMATHERAPY BY ELEMENT
//  "Dùng tinh dầu gì? Xông/ma sát/thoa thế nào? Khi nào?"
//  5 loại tinh dầu → ngũ hành → tạng phủ → cảm xúc → công dụng.
//  Nguồn: 中医芳疗, 黄帝内经 香疗.
// ============================================================================
import { WX_VI } from './constants.js';

const WX_OILS = {
  木: {
    oils: ['Bạc hà (Peppermint)', 'Sả chanh (Lemongrass)', 'Oải hương (Lavender)', 'Bưởi (Grapefruit)', 'Pơ-mai (Rosemary)', 'Tràm trà (Tea Tree)'],
    carrier: 'dầu hạnh nhân, dầu jojoba',
    organ: 'Gan–Mật',
    emotion: 'giải nóng giận, thư giãn thần kinh, dịu căng thẳng',
    benefits: 'sơ can, thanh nhiệt, giảm stress, chống viêm gan, làm dịu',
    method: { diffuser: 'xông phòng 3-5 giọt (sáng/chiều)', massage: 'pha 2% (4 giọt/10ml dầu nền) — mas sát vùng sườn phải (gan)', bath: '5 giọt vào bồn tắm ấm (tối)' },
    blend: 'Bạc hà 2 + Oải hương 3 + Sả chanh 1 = "Giải uất can"',
    avoid: 'phụ nữ mang thai tránh bạc hà/ sả chanh liều cao',
  },
  火: {
    oils: ['Trầm hương (Frankincense)', 'Đàn hương (Sandalwood)', 'Hoa hồng (Rose)', 'Nhài (Jasmine)', 'Cam ngọt (Sweet Orange)', 'Bergamot'],
    carrier: 'dầu dừa, dầu macadamia',
    organ: 'Tim–Ruột non',
    emotion: 'an tâm, giảm lo âu, tăng vui vẻ, dưỡng tâm',
    benefits: 'noãn tâm, hạ hỏa, an thần, hạ huyết áp, đẹp da',
    method: { diffuser: 'xông 3-5 giọt (trưa/tối)', massage: '2% — mas sát ngực trái (tim), cổ tay', bath: '5 giọt + muối Epsom' },
    blend: 'Trầm hương 2 + Hoa hồng 1 + Bergamot 2 = "Dưỡng tâm an thần"',
    avoid: 'tránh xông tối nếu bergamot (quang nhạy — trên da rồi ra nắng)',
  },
  土: {
    oils: ['Cam ngọt (Sweet Orange)', 'Quế (Cinnamon)', 'Vani (Vanilla)', 'Gừng (Ginger)', 'Hồi (Fennel)', 'Cỏ ngọt (Lemongrass nhẹ)'],
    carrier: 'dầu ô liu, dầu mè',
    organ: 'Tỳ–Vị',
    emotion: 'ổn định, an thần, giảm lo nghĩ, nuôi dưỡng',
    benefits: 'bổ tỳ, tiêu thực, noãn vị, giảm buồn nôn, ổn định tiêu hóa',
    method: { diffuser: 'xông 3 giọt (sau ăn)', massage: '2% — mas sát bụng theo chiều kim đồng hồ', bath: '4 giọt + gừng tươi' },
    blend: 'Cam ngọt 3 + Quế 1 + Gừng 1 = "Bổ tỳ tiêu thực"',
    avoid: 'quế da nhạy cảm — giảm nồng độ; gừng tránh mắt',
  },
  金: {
    oils: ['Bạch đàn (Eucalyptus)', 'Thông (Pine)', 'Phong lữ (Geranium)', 'Hương nhu (Basil)', 'Sả (Citronella)', 'Cúc la mã (Roman Chamomile)'],
    carrier: 'dầu phỉ (hazelnut), dầu nho',
    organ: 'Phổi–Đại tràng',
    emotion: 'sạch sẽ, minh mẫn, giảm buồn, mạnh ý chí',
    benefits: 'tuyên phế, thông mũi, chống viêm hô hấp, thanh nhiệt da',
    method: { diffuser: 'xông 3-5 giọt (sáng)', massage: '2% — mas sát ngực + cổ họng', bath: '5 giọt + muối biển' },
    blend: 'Bạch đàn 2 + Thông 2 + Cúc 1 = "Thông phế giảm cảm"',
    avoid: 'bạch đàn tránh với trẻ < 6t; người hen suyễn test trước',
  },
  水: {
    oils: ['Nhục quế (Cassia/Cinnamon bark)', 'Gừng (Ginger)', 'Cỏ ngọt (Palmarosa)', 'Đàn hương (Sandalwood)', 'Hoa lan (Ylang Ylang)', 'Cỏ vetiver'],
    carrier: 'dầu mè đen, dầu argan',
    organ: 'Thận–Bàng quang',
    emotion: 'sâu lắng, tĩnh tâm, giảm sợ hãi, dưỡng thận',
    benefits: 'noãn thận, bổ dương, tĩnh tâm sâu, nuôi tủy, tăng sinh lực',
    method: { diffuser: 'xông 2-3 giọt (tối)', massage: '2% — mas sát thắt lưng + bụng dưới', bath: '4 giọt + nước ấm (ngâm chân)' },
    blend: 'Nhục quế 1 + Đàn hương 2 + Vetiver 1 = "Bổ thận tĩnh tâm"',
    avoid: 'nhục quế nóng — người huyết áp cao giảm; vetiver mùi nặng — dùng ít',
  },
};

const EMOTION_OILS = {
  angry: { vi: 'Nóng giận', oil: '木 (Bạc hà + Oải hương)', effect: 'sơ can, làm dịu cơn giận' },
  anxious: { vi: 'Lo âu', oil: '土 (Cam ngọt + Quế)', effect: 'ổn định tỳ, an thần' },
  sad: { vi: 'Buồn', oil: '金 (Cúc la mã + Phong lữ)', effect: 'hóa giải bi ai' },
  fearful: { vi: 'Sợ hãi', oil: '水 (Đàn hương + Vetiver)', effect: 'bổ thận, dũng cảm' },
  excited: { vi: 'Quá phấn khích', oil: '火 (Trầm hương)', effect: 'an tâm, hạ hỏa' },
  worried: { vi: 'Lo nghĩ nhiều', oil: '土 (Cam ngọt + Vani)', effect: 'ổn định, ngọt ngào' },
};

/**
 * @returns {{ dungOils, dungCarrier, dungOrgan, dungEmotion, dungBenefits,
 *            dungMethod, dungBlend, dungAvoid, emotionMap, advice }}
 */
export function aromaTherapy(R) {
  const dungWx = R.yong.primary;
  const xiWx = R.yong.xi;
  const kyWx = R.yong.ji;
  const dungInfo = WX_OILS[dungWx];
  const xiInfo = WX_OILS[xiWx];
  const kyInfo = WX_OILS[kyWx];

  const advice = `Tinh dầu Dụng Thần (${WX_VI[dungWx]}): ${dungInfo.oils.slice(0, 3).join(', ')} → ${dungInfo.benefits}. ` +
    `Xông: ${dungInfo.method.diffuser}. Ma sát: ${dungInfo.method.massage}. ` +
    `Blend: ${dungInfo.blend}. ` +
    `Tránh: ${kyInfo.oils[0]} (Kỵ ${WX_VI[kyWx]}). ` +
    `Dầu nền: ${dungInfo.carrier}.`;

  return {
    dungWx, dungVi: WX_VI[dungWx],
    dungOils: dungInfo.oils, dungCarrier: dungInfo.carrier,
    dungOrgan: dungInfo.organ, dungEmotion: dungInfo.emotion,
    dungBenefits: dungInfo.benefits, dungMethod: dungInfo.method,
    dungBlend: dungInfo.blend, dungAvoid: dungInfo.avoid,
    xiOils: xiInfo.oils.slice(0, 2), xiVi: WX_VI[xiWx],
    kyOil: kyInfo.oils[0], kyVi: WX_VI[kyWx],
    emotionMap: EMOTION_OILS, advice,
    allOils: WX_OILS,
  };
}

export { WX_OILS, EMOTION_OILS };
