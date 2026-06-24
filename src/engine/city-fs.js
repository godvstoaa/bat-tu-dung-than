// ============================================================================
//  THÀNH PHỐ PHONG THỦY 城市风水 — CITY/REGION RECOMMENDATION
//  "Nên sống/kinh doanh ở thành phố nào?" theo Dụng Thần + phương vị.
//  Kết hợp hướng Dụng Thần + đặc tính thành phố (biển/núi/rừng/tài chính).
//  Nguồn: 风水 方位学, 五行地理.
// ============================================================================
import { WX_VI } from './constants.js';

// Hướng Dụng Thần → phương vị
const WX_DIRECTION = {
  木: { vi: 'Đông / Đông Nam', dir: 'east', cities_vn: ['TP.HCM', 'Đồng Nai', 'Bình Dương', 'Vũng Tàu', 'Bà Rịa', 'Đà Lạt (rừng)'], cities_world: ['Singapore', 'Tokyo', 'Shanghai', 'Bangkok', 'Sydney'], characteristics: 'nhiều cây xanh, gần rừng/nông nghiệp, khí hậu ôn hòa' },
  火: { vi: 'Nam', dir: 'south', cities_vn: ['Cần Thơ', 'Cà Mau', 'An Giang', 'Kiên Giang', 'Tiền Giang', 'Đồng Tháp'], cities_world: ['Dubai', 'Miami', 'Los Angeles', 'Bangkok', 'Manila'], characteristics: 'nóng ấm, dương khí mạnh, năng lượng, gần xích đạo' },
  土: { vi: 'Trung tâm / Đông Bắc / Tây Nam', dir: 'center', cities_vn: ['Hà Nội', 'Huế', 'Nam Định', 'Vinh', 'Thanh Hóa', 'Ninh Bình'], cities_world: ['Beijing', 'London', 'Paris', 'Madrid', 'Mexico City'], characteristics: 'trung tâm, đất đai rộng, ổn định, có lịch sử' },
  金: { vi: 'Tây / Tây Bắc', dir: 'west', cities_vn: ['Điện Biên Phủ', 'Sơn La', 'Lai Châu', 'Lào Cai', 'Hà Giang'], cities_world: ['Hong Kong', 'Zurich', 'Frankfurt', 'San Francisco', 'Seoul'], characteristics: 'trung tâm tài chính, công nghệ, luật pháp, kỷ luật' },
  水: { vi: 'Bắc / ven biển/sông', dir: 'north', cities_vn: ['Hải Phòng', 'Quảng Ninh', 'Nha Trang', 'Đà Nẵng', 'Phú Quốc', 'Hạ Long'], cities_world: ['Amsterdam', 'Venice', 'Hong Kong', 'New York', 'Shenzhen'], characteristics: 'gần biển/sông, thương mại, giao thương, vận tải' },
};

// Đặc tính thành phố → ngũ hành
const CITY_TYPE = {
  coastal: { vi: 'Ven biển', wx: '水', benefit: 'thương mại, giao thương, vận tải, du lịch', cities: ['Hải Phòng', 'Đà Nẵng', 'Nha Trang', 'Vũng Tàu', 'Phú Quốc'] },
  mountain: { vi: 'Miền núi', wx: '土', benefit: 'ổn định, nông-lâm nghiệp, nghỉ dưỡng, thiền', cities: ['Đà Lạt', 'Sapa', 'Tam Đảo', 'Ba Vì'] },
  financial: { vi: 'Tài chính', wx: '金', benefit: 'tài chính, ngân hàng, công nghệ, luật', cities: ['Hà Nội', 'TP.HCM'] },
  industrial: { vi: 'Công nghiệp', wx: '金', benefit: 'sản xuất, xuất khẩu, logistics', cities: ['Bình Dương', 'Đồng Nai', 'Hải Phòng', 'Bắc Ninh'] },
  agricultural: { vi: 'Nông nghiệp', wx: '木', benefit: 'nông-lâm-thủy sản, thực phẩm, chế biến', cities: ['Cần Thơ', 'An Giang', 'Đồng Tháp', 'Tây Nguyên'] },
  cultural: { vi: 'Văn hóa', wx: '火', benefit: 'giáo dục, du lịch văn hóa, nghệ thuật, truyền thông', cities: ['Huế', 'Hội An', 'Hà Nội'] },
  trade: { vi: 'Thương mại', wx: '水', benefit: 'buôn bán, XNK, thương mại điện tử', cities: ['TP.HCM', 'Hà Nội', 'Đà Nẵng'] },
};

/**
 * @returns {{ bestDirection, bestDirectionVi, bestCities, bestCitiesWorld,
 *            bestCityType, cityReasons, avoidDirection, avoidCities,
 *            careerCity, wealthCity, healthCity, advice }}
 */
export function cityRecommendation(R) {
  const dungWx = R.yong.primary;
  const xiWx = R.yong.xi;
  const kyWx = R.yong.ji;

  const dungDir = WX_DIRECTION[dungWx];
  const xiDir = WX_DIRECTION[xiWx];
  const kyDir = WX_DIRECTION[kyWx];

  // Loại thành phố tốt nhất theo Dụng Thần
  const dungCityType = Object.entries(CITY_TYPE).find(([k, v]) => v.wx === dungWx)?.[1] || CITY_TYPE.trade;

  // Tài lộc city = loại hành Tài
  const wealthWx = ({木:'土',火:'金',土:'水',金:'木',水:'火'})[R.chart.dayMaster.wx];
  const wealthCity = WX_DIRECTION[wealthWx] || dungDir;

  // Sự nghiệp city = loại hành Quan
  const officerWx = ({木:'金',火:'水',土:'木',金:'火',水:'土'})[R.chart.dayMaster.wx];
  const careerCity = WX_DIRECTION[officerWx] || dungDir;

  // Sức khoẻ city = loại hành Dụng
  const healthCity = dungDir;

  const advice = `Thành phố TỐT NHẤT (Dụng ${WX_VI[dungWx]}): ${dungDir.cities_vn.slice(0, 3).join(', ')} — ${dungDir.characteristics}. ` +
    `Đặc tính phù hợp: ${dungCityType.vi} (${dungCityType.benefit}). ` +
    `Quốc tế: ${dungDir.cities_world.slice(0, 3).join(', ')}. ` +
    `Tránh: ${kyDir.cities_vn.slice(0, 2).join(', ')} (Kỵ ${WX_VI[kyWx]}).`;

  return {
    dungWx, dungVi: WX_VI[dungWx],
    bestDirection: dungDir.dir, bestDirectionVi: dungDir.vi,
    bestCities: dungDir.cities_vn, bestCitiesWorld: dungDir.cities_world,
    bestCityType: dungCityType,
    cityCharacteristics: dungDir.characteristics,
    avoidDirection: kyDir.vi, avoidCities: kyDir.cities_vn.slice(0, 3),
    xiCities: xiDir.cities_vn.slice(0, 2), xiVi: WX_VI[xiWx],
    careerCity: careerCity.cities_vn.slice(0, 2), careerCityVi: careerCity.vi,
    wealthCity: wealthCity.cities_vn.slice(0, 2), wealthCityVi: wealthCity.vi,
    healthCity: healthCity.cities_vn.slice(0, 2),
    advice,
  };
}

export { WX_DIRECTION, CITY_TYPE };
