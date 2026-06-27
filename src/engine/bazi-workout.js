// ============================================================================
//  VẬN ĐỘNG CÁ NHÂN HOÁ 个人化运动 — WORKOUT BY BAZI
//  "Tập gì? Bao lâu? Khi nào? Tránh gì?" theo Dụng Thần + thể chất.
//  Nguồn: 黄帝内经 运动养生, 五行体质运动.
// ============================================================================
import { WX_VI } from './constants.js';

const WORKOUT = {
  木: {
    type: 'dãn cơ, kéo giãn, linh hoạt',
    best: 'yoga, Pilates, kéo giãn, đi bộ trong công viên, leo núi vừa',
    intensity: 'trung — không quá gắng sức, nhẹ nhàng kéo giãn gân cốt',
    duration: '40-60 phút/buổi, 4-5 lần/tuần',
    timing: 'sáng sớm (5-7h) — Mộc khí thịnh, không khí trong lành',
    avoid: 'cử tạ nặng quá (cứng — tổn gân), thể thao đối kháng bạo lực',
    breathwork: 'hít thở sâu, dài — dưỡng gan, thư giãn thần kinh',
    goal: 'mềm dẻo, thư giãn, giải tỏa căng thẳng',
    injury_risk: 'cơ gân, vai, cổ — giãn trước khi tập',
  },
  火: {
    type: 'cardio cường độ cao, năng động',
    best: 'chạy bộ, HIIT, đạp xe nhanh, boxing, khiêu vũ, bơi sôi',
    intensity: 'cao — đẩy tim, đổ mồ hôi, đốt năng lượng',
    duration: '30-45 phút/buổi, 5-6 lần/tuần',
    timing: '9-11h sáng hoặc 15-17h chiều (dương khí thịnh)',
    avoid: 'tập quá lâu trong nóng bức — say nắng,脱水',
    breathwork: 'hít thở nhanh, mạnh — đẩy oxy, tăng tuần hoàn',
    goal: 'sức bền tim mạch, đốt mỡ, năng lượng',
    injury_risk: 'tim mạch, mắt — kiểm tra huyết áp trước',
  },
  土: {
    type: 'ổn định, bền bỉ, vừa sức',
    best: 'đi bộ, thái cực quyền, dưỡng sinh, đạp xe vừa, pilates đất',
    intensity: 'thấp-trung — đều đặn, không giật cục',
    duration: '45-60 phút/buổi, 3-4 lần/tuần (đều quan trọng hơn nhiều)',
    timing: '7-9h sáng (thổ khí thịnh) hoặc 15-17h',
    avoid: 'nhảy cao/nhảy xa (tổn khớp), tạ quá nặng, thể thao nhịp nhanh',
    breathwork: 'hít thở bụng (tỳ vị) — đều, chậm, sâu',
    goal: 'ổn định tiêu hóa, kiểm soát cân nặng, bền bỉ',
    injury_risk: 'đầu gối, thắt lưng, mắt cá — giày tốt, nền phẳng',
  },
  金: {
    type: 'sức mạnh, chính xác, kỷ luật',
    best: 'cử tạ, kettlebell, push-up, plank, leo tường, võ thuật chính quy',
    intensity: 'cao (sức mạnh) — nhưng kiểm soát tốt, chính xác',
    duration: '40-50 phút/buổi, 4-5 lần/tuần',
    timing: '5-7h sáng (phổi khí thịnh, không khí trong) hoặc 15-17h',
    avoid: 'môi trường ô nhiễm/khói bụi — tổn phổi tuyệt đối',
    breathwork: 'khí công, hít thở phổi — mạnh, sâu, đẩy hơi thải',
    goal: 'sức mạnh cơ bắp, đề kháng hô hấp, kỷ luật',
    injury_risk: 'phổi, da, hệ hô hấp — tránh lạnh/khói',
  },
  水: {
    type: 'bền bỉ, chảy, linh hoạt',
    best: 'bơi lội, chạy đường dài (marathon), chèo thuyền, yoga nước',
    intensity: 'trung-cao bền bỉ — chảy liên tục, không giật',
    duration: '60-90 phút/buổi, 3-4 lần/tuần (dài, đều)',
    timing: '15-19h chiều (thận khí thịnh) hoặc sáng',
    avoid: 'môi trường quá lạnh khô — thận sợ hàn+khô; tắm lạnh sau tập',
    breathwork: 'hít thở sâu chậm — dưỡng thận, giữ ấm bụng dưới',
    goal: 'sức bền toàn thân, thận-tủy, xương khớp',
    injury_risk: 'thận, lưng dưới, xương — khởi động kĩ, giữ ấm',
  },
};

/**
 * @returns {{ dmProfile, dungProfile, weeklyPlan, advice }}
 */
export function personalWorkout(R) {
  const dmWx = R.chart.dayMaster.wx;
  const dungWx = R.yong.primary;
  // [loop 554 FIX BUG2] dmWx có thể trùng Kỵ/Thù (chart thân vượng) → tập đúng hành cần tránh.
  //   Nếu trùng, thay bằng Hỷ để tập hành bổ Dụng.
  const kyWx = R.yong.ji, chouWx = R.yong.chou, xiWx = R.yong.xi;
  const dmSafeWx = (dmWx === kyWx || dmWx === chouWx) ? (xiWx || dungWx) : dmWx;
  const dmInfo = WORKOUT[dmSafeWx];
  const dungInfo = WORKOUT[dungWx];
  const kyInfo = WORKOUT[R.yong.ji];

  // Kế hoạch tuần: xen kẽ Nhật Chủ + Dụng Thần
  const week = [
    { day: 'T2', focus: dungWx, focusVi: WX_VI[dungWx] + ' (Dụng)', workout: dungInfo.best, duration: dungInfo.duration, intensity: dungInfo.intensity },
    { day: 'T3', focus: dmSafeWx, focusVi: WX_VI[dmSafeWx] + (dmSafeWx === dmWx ? ' (Nhật Chủ)' : ' (Hỷ — Nhật Chủ trùng Kỵ)'), workout: dmInfo.best, duration: dmInfo.duration, intensity: dmInfo.intensity },
    { day: 'T4', focus: 'rest', focusVi: 'Nghỉ', workout: 'đi bộ nhẹ 20ph + giãn cơ', duration: '20 phút', intensity: 'rất nhẹ' },
    { day: 'T5', focus: dungWx, focusVi: WX_VI[dungWx] + ' (Dụng)', workout: dungInfo.best, duration: dungInfo.duration, intensity: dungInfo.intensity },
    { day: 'T6', focus: dmSafeWx, focusVi: WX_VI[dmSafeWx] + (dmSafeWx === dmWx ? ' (Nhật Chủ)' : ' (Hỷ — Nhật Chủ trùng Kỵ)'), workout: dmInfo.best, duration: dmInfo.duration, intensity: dmInfo.intensity },
    { day: 'T7', focus: dungWx, focusVi: WX_VI[dungWx] + ' (Dụng)', workout: dungInfo.best, duration: dungInfo.duration, intensity: dungInfo.intensity },
    { day: 'CN', focus: 'rest', focusVi: 'Nghỉ', workout: 'thái cực/yoga nhẹ', duration: '30 phút', intensity: 'nhẹ' },
  ];

  // [loop 35 W2] Kỵ avoid — KHÔNG dùng kyInfo.avoid (đó là chấn thương của NGƯỜI DỤNG Kỵ-hành,
  //   không phải việc TRÁNH vì Kỵ). Dùng KY_AMPLIFY: việc/phong cảnh làm TĂNG Kỵ → tránh.
  const KY_AMPLIFY = {
    木: 'gió lạnh & rừng sâu vào mùa xuân (tăng Mộc)',
    火: 'nắng trưa/nóng bức quá lâu (tăng Hỏa)',
    土: 'ẩm thấp, bùn lầy, trong nhà kín quá (tăng Thổ)',
    金: 'khô hanh, không khí lạnh/lạnh lẽo (tăng Kim)',
    水: 'tắm lạnh lâu, môi trường hàn lạnh (tăng Thủy)',
  };
  const advice = `Tập chính: ${dungInfo.best} (Dụng ${WX_VI[dungWx]}). ` +
    `Giờ tốt: ${dungInfo.timing}. Cường độ: ${dungInfo.intensity}. ` +
    `Mục tiêu: ${dungInfo.goal}. ` +
    `⚠ Kỵ ${WX_VI[R.yong.ji]} — tránh: ${KY_AMPLIFY[R.yong.ji] || 'môi trường quá thiên lệch'}. ` +
    `Chấn thương: chú ý ${dungInfo.injury_risk}. ` +
    `Hô hấp: ${dungInfo.breathwork}.`;

  return {
    dmProfile: { wx: dmWx, vi: WX_VI[dmWx], ...dmInfo },
    dungProfile: { wx: dungWx, vi: WX_VI[dungWx], ...dungInfo },
    kyProfile: { wx: R.yong.ji, vi: WX_VI[R.yong.ji], ...kyInfo },
    weeklyPlan: week,
    advice,
  };
}
