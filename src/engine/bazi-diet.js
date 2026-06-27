// ============================================================================
//  DINH DƯỠNG CÁ NHÂN HOÁ 个人化营养 — PERSONALIZED NUTRITION BY BAZI
//  Kết hợp 黄帝内经 五味入五脏 + Dụng Thần → thực đơn + bài thuốc nhỏ.
//  Khác health-analysis.js (tạng phủ): tập trung THỰC ĐƠN + vitamin + menu.
//  Nguồn: 黄帝内经 五味篇, 本草纲目 食疗.
// ============================================================================
import { GAN, WX_VI } from './constants.js';

// Ngũ vị → ngũ hành (tạng phủ)
const FIVE_FLAVORS = {
  木: { flavor: 'chua (酸)', vi: 'Chua', organ: 'Gan–Mật', foods: 'chanh, giấm, dưa muối, cà chua xanh, me, sấu, bưởi', action: 'liễm can, sinh tân dịch, kích thích tiêu hóa', caution: 'quá chua → tổn gan, tỳ' },
  火: { flavor: 'đắng (苦)', vi: 'Đắng', organ: 'Tim–Ruột non', foods: 'cà phê (vừa), trà xanh, khổ qua, rau đắng, sầu riêng, atiso, lạc tiên', action: 'thanh nhiệt, hạ hỏa, lợi tâm', caution: 'quá đắng → tổn tỳ' },
  土: { flavor: 'ngọt (甘)', vi: 'Ngọt', organ: 'Tỳ–Vị', foods: 'khoai lang, bí đỏ, gạo lứt, yến mạch, táo, kẹo mật ong, hạt sen, kỷ tử', action: 'bổ tỳ, dưỡng vị, an thần', caution: 'quá ngọt → đàm thấp, tiểu đường' },
  金: { flavor: 'cay (辛)', vi: 'Cay', organ: 'Phổi–Đại tràng', foods: 'gừng, hành, tỏi, tiêu, ớt (vừa), hẹ, tía tô, quế', action: 'tán hàn, thông phổi, ra mồ hôi', caution: 'quá cay → hao khí, tổn phổi' },
  水: { flavor: 'mặn (咸)', vi: 'Mặn', organ: 'Thận–Bàng quang', foods: 'cá, hải sản, rong biển, miso, nước mắm, đậu đen, muối biển', action: 'nhuyễn kiên, bổ thận,滋养 tủy', caution: 'quá mặn → huyết áp cao' },
};

const WX_MEALS = {
  木: {
    breakfast: 'cháo bí xanh + giá đỗ + trà xanh',
    lunch: 'cá hấp + rau luộc + cơm lứt',
    dinner: 'canh mùng tơi + đậu phụ + salad rau',
    tea: 'trà xanh, trà hoa cúc, trà atiso',
    fruit: 'chanh, bưởi, dưa hấu, kiwi',
    supplement: 'vitamin B, sắt (nuôi gan/máu)',
  },
  火: {
    breakfast: 'trà xanh + bánh mì đen + cà chua',
    lunch: 'gà xào ớt (vừa) + canh khổ qua + cơm',
    dinner: 'canh atiso + cá nướng + salad đắng',
    tea: 'trà xanh, trà sen, cà phê (1 ly/vừa)',
    fruit: 'dưa hấu, thạch đen, sầu riêng (vừa)',
    supplement: 'vitamin C, omega-3 (tim mạch)',
  },
  土: {
    breakfast: 'cháo khoai lang + hạt sen + mật ong',
    lunch: 'thịt bò hầm khoai tây + cơm gạo lứt',
    dinner: 'canh bí đỏ + yến mạch + táo',
    tea: 'trà đỏ, trà kỷ tử, trà táo',
    fruit: 'táo, chuối, đào, lê',
    supplement: 'kẽm, magie, men tiêu hóa',
  },
  金: {
    breakfast: 'cháo gà + gừng + hành',
    lunch: 'gà luộc + súp nấm + cơm trắng',
    dinner: 'canh lê đường phèn + tỏi nướng',
    tea: 'trà bạc hà, trà gừng, trà quế',
    fruit: 'lê, nho, lựu, dứa',
    supplement: 'vitamin D, kẽm (phổi/đề kháng)',
  },
  水: {
    breakfast: 'cháo đậu đen + cá hồi + rong biển',
    lunch: 'cá kho + canh rong biển + cơm',
    dinner: 'canh hải sản + miso soup + đậu đen',
    tea: 'trà đen, trà đậu đen, trà nhục quế',
    fruit: 'dừa, thanh long, dưa hấu',
    supplement: 'omega-3, selen, kẽm (thận)',
  },
};

/**
 * @returns {{ dungWx, dungVi, dungFlavor, kyWx, kyFlavor, meals, tea, fruit,
 *            supplement, weeklyMenu, profile, advice }}
 */
export function personalNutrition(R) {
  const dungWx = R.yong.primary;
  const xiWx = R.yong.xi;
  const kyWx = R.yong.ji;
  const chouWx = R.yong.chou;
  const dmWx = R.chart.dayMaster.wx;

  const dungFlavor = FIVE_FLAVORS[dungWx];
  const kyFlavor = FIVE_FLAVORS[kyWx];
  const meals = WX_MEALS[dungWx];

  // Weekly menu — 7 ngày xoay vòng Dụng + Hỷ
  // [loop 554 FIX BUG1] dmWx (Nhật Chủ hành) có thể trùng Kỵ/Thù (chart thân vượng) →
  //   ăn/tập đúng hành cần tránh. Nếu trùng, thay bằng Hỷ (bổ Dụng).
  const dmSafeWx = (dmWx === kyWx || dmWx === chouWx) ? (xiWx || dungWx) : dmWx;
  const dayWx = [dungWx, xiWx, dungWx, dmSafeWx, xiWx, dungWx, xiWx];
  const weeklyMenu = dayWx.map((wx, i) => ({
    day: `T${i + 1}`, wx, vi: WX_VI[wx], focus: wx === dungWx ? 'Dụng' : wx === xiWx ? 'Hỷ' : 'Nhật Chủ',
    flavor: FIVE_FLAVORS[wx]?.vi || '?',
    main: (WX_MEALS[wx]?.lunch || '').split(' + ')[0] || '?',
  }));

  const profile = [
    `Dụng Thần ${WX_VI[dungWx]} → vị ${dungFlavor.vi} bổ tạng ${dungFlavor.organ}: ${dungFlavor.foods}.`,
    `Hỷ Thần ${WX_VI[xiWx]} → phụ trợ: vị ${FIVE_FLAVORS[xiWx]?.vi}, ${FIVE_FLAVORS[xiWx]?.foods}.`,
    `⚠ Kỵ Thần ${WX_VI[kyWx]} → HẠN CHẾ vị ${kyFlavor.vi}: ${kyFlavor.foods} — ${kyFlavor.caution}.`,
    `⚠ Thù Thần ${WX_VI[chouWx]} → giảm: vị ${FIVE_FLAVORS[chouWx]?.vi}.`,
    `Bữa chính theo Dụng ${WX_VI[dungWx]}:`,
    `  Sáng: ${meals.breakfast}`,
    `  Trưa: ${meals.lunch}`,
    `  Tối: ${meals.dinner}`,
    `Trà: ${meals.tea}. Trái cây: ${meals.fruit}. Bổ sung: ${meals.supplement}.`,
  ];

  const advice = `Ăn theo vị ${dungFlavor.vi} (${WX_VI[dungWx]}) bổ ${dungFlavor.organ}; hạn chế vị ${kyFlavor.vi} (${WX_VI[kyWx]}). ` +
    `Thực đơn: ${meals.breakfast} / ${meals.lunch} / ${meals.dinner}. ` +
    `Trà: ${meals.tea}. Trái cây: ${meals.fruit}. ` +
    `Bổ sung: ${meals.supplement}. ` +
    `Lưu ý: ${dungFlavor.caution}.`;

  return {
    dungWx, dungVi: WX_VI[dungWx], dungFlavor, xiWx, xiVi: WX_VI[xiWx],
    kyWx, kyVi: WX_VI[kyWx], kyFlavor, chouWx, chouVi: WX_VI[chouWx],
    meals, tea: meals.tea, fruit: meals.fruit, supplement: meals.supplement,
    weeklyMenu, profile, advice,
  };
}
