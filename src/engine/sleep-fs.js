// ============================================================================
//  NGỦ PHONG THỦY 睡眠风水 — SLEEP OPTIMIZATION BY BAZI
//  "Ngủ hướng nào? Giờ nào? Màu gì? Vật liệu gì?" — tổng hợp Dụng + Bát Trạch.
//  Nguồn: 黄帝内经 睡眠养生, 八宅明镜 卧室.
// ============================================================================
import { WX_VI } from './constants.js';
import { computeZhai } from './zhai.js';

const DIR_VI = { '正北':'Bắc','正南':'Nam','正东':'Đông','正西':'Tây','东北':'Đông Bắc','东南':'Đông Nam','西北':'Tây Bắc','西南':'Tây Nam' };

const SLEEP_TIME = {
  木: { best: '22:00-06:00 (giấc dài, dưỡng gan)', nap: '12:30-13:00 (20ph)', reason: 'gan排毒 1-3h sáng — phải ngủ say lúc đó' },
  火: { best: '22:30-05:30 (ngắn vừa)', nap: '11:30-12:00 (30ph dưỡng tâm)', reason: 'tim nghỉ ngơi trưa — ngũ ngủ dưỡng tâm' },
  土: { best: '22:00-06:30 (đều đặn)', nap: 'không cần trưa — tỳ喜 ổn định', reason: 'tỳ quản giấc ngủ — đều đặn quan trọng nhất' },
  金: { best: '21:30-05:00 (ngủ sớm dậy sớm)', nap: 'không cần', reason: 'phổi thanh khí sáng sớm — dậy sớm hấp thụ' },
  水: { best: '21:00-07:00 (dài, dưỡng thận)', nap: '13:00-13:30 (20ph)', reason: 'thận phục hồi ban đêm — ngủ sớm sâu' },
};

const MATTRESS_MATERIAL = {
  木: 'bông hữu cơ, tre (thoáng, tự nhiên)',
  火: 'vải lụa, sợi tre (mát)',
  土: 'cotton dày, đệm cao su (vững, êm)',
  金: 'kim loại khung sắt, vải lanh (cứng, thoáng)',
  水: 'highper Foam, gel (mềm, mát)',
};

const ROOM_COLOR = {
  木: 'xanh lá nhạt, be',
  火: 'hồng nhạt, cam nhẹ (tránh đỏ quá mạnh)',
  土: 'vàng kem, nâu nhạt, be',
  金: 'trắng, xám nhạt, bạc',
  水: 'xanh đậm nhạt, xám xanh, đen (accent)',
};

const AROMA = {
  木: 'sả chanh, oải hương, bạc hà — thanh thoáng',
  火: 'trầm hương, đàn hương, hoa hồng — dịu',
  土: 'cam ngọt, quế, vani — ấm áp',
  金: 'bạch đàn, thông, phong lữ — sạch',
  水: 'nhục quế, gừng, hoa nhài — ấm',
};

/**
 * @returns {{ headDir, roomColor, mattress, aroma, bestSleepTime, napTime,
 *            sleepReason, avoidDir, tips, profile, advice }}
 */
export function sleepOptimization(R, birthYear, gender) {
  const dungWx = R.yong.primary;
  const xiWx = R.yong.xi;
  const kyWx = R.yong.ji;
  const dmWx = R.chart.dayMaster.wx;

  // Bát Trạch
  const z = computeZhai(birthYear, gender);
  const ausp = z.auspicious || {};
  const inausp = z.inauspicious || {};

  // Hướng đầu ngủ = hướng Dụng Thần + ưu tiên Thiên Y (sức khoẻ)
  const WX_DIR = {
    木: ['东', '东南'], 火: ['南'], 土: ['东北', '西南', '中'],
    金: ['西', '西北'], 水: ['北'],
  };
  const DIR_MAP = { '东':'Đông','东南':'Đông Nam','南':'Nam','东北':'Đông Bắc','西南':'Tây Nam','西':'Tây','西北':'Tây Bắc','北':'Bắc','中':'Trung cung' };

  const dungDirs = (WX_DIR[dungWx] || []).map(d => DIR_MAP[d] || d);
  const xiDirs = (WX_DIR[xiWx] || []).map(d => DIR_MAP[d] || d);
  const kyDirs = (WX_DIR[kyWx] || []).map(d => DIR_MAP[d] || d);

  // Ưu tiên: trùng Dụng Thần + Bát Trạch Thiên Y/Sinh Khí
  const allCat = Object.values(ausp);
  const tianYiDir = ausp['天医'] || ausp['Thiên Y (天医 — sức khoẻ, quý nhân)'] || '?';

  // [loop 40 sửa] Ưu tiên DỤNG THẦN hướng (KHÔNG fallback Thiên Y + gán nhãn sai "(Dụng Mộc)"
  //   khi hướng thực ra là Kim). Dụng Thần hướng là primary; Thiên Y chỉ là tiebreaker.
  let headDir, headSource;
  const dungInCat = dungDirs.find(d => allCat.includes(d));
  if (dungInCat) { headDir = dungInCat; headSource = 'dung+cat'; }
  else if (dungDirs[0]) { headDir = dungDirs[0]; headSource = 'dung'; } // [loop 40] Dụng Thần > Thiên Y
  else if (xiDirs[0]) { headDir = xiDirs[0]; headSource = 'xi'; }
  else if (tianYiDir && tianYiDir !== '?') { headDir = tianYiDir; headSource = 'tianYi'; }
  else { headDir = '?'; headSource = 'none'; }

  // Hướng tránh = Kỵ Thần + Tuyệt Mệnh/Họa Hại
  const allHung = Object.values(inausp);
  const kyInHung = kyDirs.find(d => allHung.includes(d));
  const avoidDir = kyInHung || kyDirs[0] || allHung[0] || '?';

  const sleepInfo = SLEEP_TIME[dmWx] || SLEEP_TIME['土'];

  const tips = [
    `Đầu hướng ${headDir} khi ngủ (hướng Dụng Thần ${WX_VI[dungWx]}${allCat.includes(headDir) ? ' + Bát Trạch cát' : ''}).`,
    `Màu phòng ngủ: ${ROOM_COLOR[dungWx].split(',')[0]} (Dụng Thần).`,
    `Đệm: ${MATTRESS_MATERIAL[dungWx]}.`,
    `Hương: ${AROMA[dungWx]}.`,
    `Giờ ngủ: ${sleepInfo.best}.`,
    sleepInfo.nap !== 'không cần' ? `Ngủ trưa: ${sleepInfo.nap}.` : 'Không cần ngủ trưa.',
    `Tránh đầu hướng ${avoidDir}${kyDirs.includes(avoidDir) ? ` (Kỵ Thần ${WX_VI[kyWx]})` : ''}.`,
    'Tránh gương đối diện giường.',
    'Tránh giường dưới dầm/xà.',
    'Tránh điện thoại gần đầu (< 1m).',
  ];

  const profile = [
    `Nhật Chủ ${WX_VI[dmWx]} → ${sleepInfo.reason}.`,
    `Dụng Thần ${WX_VI[dungWx]} → đầu hướng ${headDir}, màu ${ROOM_COLOR[dungWx]}, hương ${AROMA[dungWx]}.`,
    `Giấc ngủ: ${sleepInfo.best}. ${sleepInfo.nap}.`,
    `Tránh: hướng ${avoidDir}, màu ${ROOM_COLOR[kyWx]}.`,
  ];

  // [loop 40] gán nhãn đúng: chỉ nói "(Dụng X)" khi headDir thực sự từ Dụng Thần, else "(Thiên Y Bát Trạch)"
  const headLabel = (headSource === 'dung' || headSource === 'dung+cat') ? `Dụng ${WX_VI[dungWx]}` : (headSource === 'xi') ? `Hỷ ${WX_VI[xiWx]}` : (headSource === 'tianYi') ? 'Thiên Y (Bát Trạch)' : '?';
  const advice = `Đầu hướng ${headDir} (${headLabel}), ngủ ${sleepInfo.best}, ` +
    `phòng màu ${ROOM_COLOR[dungWx].split(',')[0]}, hương ${AROMA[dungWx].split(',')[0]}. ` +
    `${sleepInfo.reason}.`;

  return {
    headDir, avoidDir, roomColor: ROOM_COLOR[dungWx], mattress: MATTRESS_MATERIAL[dungWx],
    aroma: AROMA[dungWx], bestSleepTime: sleepInfo.best, napTime: sleepInfo.nap,
    sleepReason: sleepInfo.reason, tianYiDir, dungWx: WX_VI[dungWx], kyWx: WX_VI[kyWx],
    tips, profile, advice,
  };
}
