// ============================================================================
//  MÙA GIÁC DẠY SINH 季节养生 — SEASONAL LIFESTYLE per Dụng Thần
//  4 mùa × Dụng Thần ngũ hành → thức phẩm/bài tập/giấc ngủ/thời điểm hoạt động.
//  Kết hợp 黄帝内经 四季养生 + Bát Tự Dụng Thần. Nguồn: 黄帝内经 四气调神.
// ============================================================================
import { WX_VI } from './constants.js';

const SEASONS = [
  { key: 'spring', vi: 'Xuân (Mộc vượng)', months: 'T1-T3 (lập xuân → lập hạ)', wxPeak: '木', wxLow: '金', nature: 'dương sinh, vạn vật đâm chồi' },
  { key: 'summer', vi: 'Hạ (Hỏa vượng)', months: 'T4-T6 (lập hạ → lập thu)', wxPeak: '火', wxLow: '水', nature: 'dương cực, nhiệt đỉnh' },
  { key: 'lateSummer', vi: 'Trường Hạ (Thổ vượng)', months: 'cuối mỗi mùa (辰戌丑未)', wxPeak: '土', wxLow: '木', nature: 'thổ vượng, trung tâm, chuyển tiếp' },
  { key: 'autumn', vi: 'Thu (Kim vượng)', months: 'T7-T9 (lập thu → lập đông)', wxPeak: '金', wxLow: '木', nature: 'âm sinh, thu hoạch, khô ráo' },
  { key: 'winter', vi: 'Đông (Thủy vượng)', months: 'T10-T12 (lập đông → lập xuân)', wxPeak: '水', wxLow: '火', nature: 'âm cực, tàng trữ, hàn lạnh' },
];
// [loop 35] 调候 warming/cooling foods theo khí hậu sinh
const CLIMATE_FOODS = {
  cold: { vi: 'HÀN (sinh mùa đông) — cần NOÃN', foods: 'gừng, quế, nhục đậu khấu, thịt cừu, tỏi, hồ tiêu, chà là, rượu thuốc warmed', avoid: 'đồ lạnh, sống, dưa leo, rau luộc quá, chuối, mộc nhĩ đen' },
  hot: { vi: 'NHIỆT (sinh mùa hạ) — cần MÁT', foods: 'đậu xanh, mướp đắng, sen tâm, rong biển, dưa hấu, atiso, trà xanh, nước chanh', avoid: 'thịt nướng, ớt cay, rượu, cà phê nhiều, đồ chiên' },
};

const WX_LIFESTYLE = {
  木: { foods: 'rau xanh, giá, mầm, chanh, trà xanh, ngũ cốc nguyên cám, giấm', exercise: 'dãn cơ, yoga, đi bộ trong rừng/công viên, kéo giãn', sleep: 'ngủ sớm (22h), dậy sớm (6h) — theo mùa xuân', color: 'xanh lá', avoid: 'quá nhiều thịt đỏ, đồ cay, rượu — hại gan' },
  火: { foods: 'vị đắng (cà phê vừa, trà xanh, rau đắng), cà chua, ớt vừa, trà đỏ', exercise: 'tim mạch, chạy, HIIT, bơi lội — vận động mạnh', sleep: 'ngủ trưa 20-30ph (dưỡng tâm), tránh thức khuya', color: 'đỏ, hồng, cam', avoid: 'thức cay nóng quá, thức khuya, stress kéo dài' },
  土: { foods: 'vị ngọt (khoai lang, bí đỏ, gạo lứt, yến mạch, táo, kẹo mật ong)', exercise: 'đi bộ nhẹ, thái cực quyền, Pilates — vận động vừa, ổn định', sleep: 'giấc ngủ đều đặn, không quá nhiều — tỳ quản giấc ngủ', color: 'vàng, nâu đất, be', avoid: 'đồ lạnh, sống, ngọt nhân tạo — hại tỳ vị' },
  金: { foods: 'vị cay (gừng, hành, tỏi, tiêu), thịt trắng (gà, cá), lê, tỏi', exercise: 'thở (khí công), đạp xe, leo cầu thang — rèn phổi', sleep: 'ngủ sớm (22h), dậy sớm (5-6h) — phổi hoạt động sáng', color: 'trắng, xám, bạc', avoid: 'đồ lạnh, kem — hại phổi; không khí ô nhiễm' },
  水: { foods: 'vị mặn (cá, hải sản, rong biển, miso, đậu đen), nước đủ', exercise: 'bơi lội, chạy bộ đường dài, leo núi — rèn thận/bàng quang', sleep: 'ngủ sớm (21-22h), ngủ nhiều hơn vào đông — dưỡng thận', color: 'đen, xanh đậm', avoid: 'đồ mặn quá, thức lạnh — hại thận; nhịn tiểu' },
};

/**
 * @returns {{ seasons:[{key, vi, months, nature, yourAdvice, fav, score}], advice }}
 */
export function seasonalAdvice(R) {
  const yong = R.yong;
  const dungWx = yong.primary;
  const life = WX_LIFESTYLE[dungWx];
  const kyLife = WX_LIFESTYLE[yong.ji];

  const seasons = SEASONS.map((s) => {
    // Điểm mùa: Dụng Thần hành vượng = tốt; Kỵ Thần vượng = xấu
    let fav = false, score = 50;
    if (s.wxPeak === dungWx) { score = 75; fav = true; }
    else if (s.wxPeak === yong.xi) { score = 65; fav = true; }
    else if (s.wxPeak === yong.ji) { score = 30; }
    else if (s.wxPeak === yong.chou) { score = 40; }

    let yourAdvice;
    if (fav) {
      yourAdvice = `✓ Mùa ${s.vi}: hành Dụng Thần (${WX_VI[dungWx]}) đang VƯỢNG → mùa thuận lợi! ` +
        `Ăn: ${life.foods}. Vận động: ${life.exercise}. Ngủ: ${life.sleep}. Mặc màu ${life.color}.`;
    } else if (score < 40) {
      yourAdvice = `⚠ Mùa ${s.vi}: hành Kỵ Thần (${WX_VI[yong.ji]}) đang VƯỢNG → mùa bất lợi. ` +
        `TRÁNH: ${kyLife.avoid}. BỔI: ${life.foods.slice(0, 30)}... Mặc ${life.color} để bù Dụng.`;
    } else {
      yourAdvice = `Mùa ${s.vi}: trung tính. Duy trì: ${life.foods.slice(0, 30)}... Vận động: ${life.exercise.slice(0, 30)}...`;
    }

    return { ...s, yourAdvice, fav, score };
  });

  const bestSeason = seasons.reduce((a, b) => b.score > a.score ? b : a);
  const worstSeason = seasons.reduce((a, b) => b.score < a.score ? b : a);

  // [loop 35] 调候 INTEGRATION — sinh mùa hàn/nóng → ưu tiên mùa mang hành 调候 + advice ấm/mát
  const EXTREME_COLD = ['亥', '子', '丑'];
  const EXTREME_HOT = ['巳', '午', '未'];
  const birthMonth = R.chart.monthZhi;
  const climateType = EXTREME_COLD.includes(birthMonth) ? 'cold' : EXTREME_HOT.includes(birthMonth) ? 'hot' : null;
  let climateNote = '';
  if (climateType && R.yong.tiaohou) {
    const cf = CLIMATE_FOODS[climateType];
    climateNote = `${cf.vi}. Ưu tiên: ${cf.foods}. Tránh: ${cf.avoid}. ${R.yong.tiaohou.note || ''}`;
    // boost mùa mang hành 调候 (cold→summer/火, hot→winter/水)
    const tiaoWx = R.yong.tiaohou.primaryWx;
    if (tiaoWx) {
      seasons.forEach((s) => { if (s.wxPeak === tiaoWx) { s.score += 10; s.fav = true; s.yourAdvice += ` ★ 调候: hành ${WX_VI[tiaoWx]} noãn/nhuận — mùa này KHÍ HẬU thuận (bù mùa sinh ${climateType === 'cold' ? 'hàn' : 'nhiệt'}).`; } });
    }
  }

  // [loop 35 S3] best/worst framing theo absolute score (không chỉ relative)
  const bestLabel = bestSeason.score >= 50 ? 'TỐT NHẤT' : 'ĐỠ HẠI NHẤT';
  const advice = [
    `Mùa ${bestLabel}: **${bestSeason.vi}** — hành ${bestSeason.score >= 50 ? 'Dụng Thần vượng → nên tiến thủ' : 'Kỵ không quá vượng → đỡ bất lợi'}.`,
    `Mùa CẨN THẬN: **${worstSeason.vi}** — hành Kỵ Thần vượng → giữ sức, dưỡng sinh, bổ Dụng Thần.`,
    `Ăn uống quanh năm theo Dụng Thần (${WX_VI[dungWx]}): ${life.foods}.`,
    `Vận động: ${life.exercise}. Giấc ngủ: ${life.sleep}. Mặc màu ${life.color}.`,
    climateNote ? `🔥🌡️ KHÍ HẬU SINH: ${climateNote}` : `Tránh: ${life.avoid}.`,
  ];

  return { seasons, bestSeason, worstSeason, dungWx, dungVi: WX_VI[dungWx], advice, lifestyle: life, climate: climateType, climateNote };
}
