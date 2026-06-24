// ============================================================================
//  PHONG THỦY THỰC VẬT 风水植物 — PLANTS BY ELEMENT & ROOM
//  "Đặt cây gì ở đâu? Cây nào hợp mệnh?" theo Dụng Thần + ngũ hành + phòng.
//  Nguồn: 风水植物学, 五行花卉.
// ============================================================================
import { WX_VI } from './constants.js';

// Cây theo ngũ hành
const WX_PLANTS = {
  木: {
    plants: ['Bàng Singapore', 'Thiết mộc lan', 'Ngũ gia bì', 'Phú quý', 'Trầu bà'],
    desc: 'cây lá to, xanh đậm, vượng Mộc — tăng sinh khí',
    placement: 'Đông, Đông Nam (Mộc phương)',
    care: 'tưới vừa, tránh úng, sáng nhẹ',
  },
  火: {
    plants: ['Hồng môn (Anthurium)', 'Phong lộc hoa', 'Đỗ quyên', 'Cẩm chướng', 'Hoa giấy (Bougainvillea)', 'Hoa trạng nguyên'],
    desc: 'cây hoa đỏ/hồng/cam — kích hoạt Hỏa, tăng nhiệt huyết',
    placement: 'Nam (Hỏa phương)',
    care: 'nhiều nắng, tưới đều',
  },
  土: {
    plants: ['Sen đá', 'Cactus nhỏ', ' Ngọc ngân', 'Lưỡi hổ (Sansevieria)', 'Cây phú quý (Aglaonema)', 'Hạnh phúc'],
    desc: 'cây thân mập, lá dày, chịu hạn — vượng Thổ, ổn định',
    placement: 'Trung cung, Đông Bắc, Tây Nam (Thổ phương)',
    care: 'ít nước, chịu hạn tốt',
  },
  金: {
    plants: ['Kim tiền (Zamioculcas)', 'Kim ngân', 'Ngọc ngân', 'Bạch mã (Dieffenbachia)', 'Cây lan ý (Spathiphyllum)', 'Cúc trắng', 'Bồ kết'],
    desc: 'Kim tiền/Kim ngân (tên chữ Kim = hành Kim!), cây lá trắng/bạc — vượng Kim, tài lộc',
    placement: 'Tây, Tây Bắc (Kim phương)',
    care: 'sáng gián tiếp, ẩm vừa',
  },
  水: {
    plants: ['Sen (Lotus)', 'Cây thủy sinh (Pothos nước)', 'Cây kim ngân nước', 'Trúc mây', 'Tre nhỏ (Lucky bamboo - trồng nước)', 'Thủy tùng'],
    desc: 'cây thủy sinh/thủy tùng, phong thủy — vượng Thủy, lưu thông',
    placement: 'Bắc (Thủy phương)',
    care: 'nước nhiều, ẩm ướt, sáng nhẹ',
  },
};

// Cây theo vị trí trong nhà
const ROOM_PLANTS = {
  livingRoom: {
    vi: 'Phòng khách',
    best: ['Kim tiền', 'Lưỡi hổ', 'Thiết mộc lan', 'Kim ngân'],
    purpose: 'Tài vị (góc Đông Nam), sinh khí, đón khách',
    avoid: 'cây gai nhọn trước cửa (xung)', tip: 'Cây to góc Đông Nam = Tài vị',
  },
  bedroom: {
    vi: 'Phòng ngủ',
    best: ['Lan hồ điệp', 'Nhện (Chlorophytum)', 'Lưỡi hổ nhỏ'],
    purpose: 'lọc khí, an thần (không đặt quá nhiều — đêm争夺 oxy)',
    avoid: 'xương rồng/cây gai (sát khí phòng ngủ)', tip: '1-2 cây nhỏ, xa giường',
  },
  office: {
    vi: 'Bàn làm việc',
    best: ['Cỏ đồng tiền', 'Tre nhỏ (Lucky bamboo)', 'Kim ngân mini', 'Sen đá'],
    purpose: 'tài lối, tĩnh tâm, chống bức xạ máy tính',
    avoid: 'cây quá to (che tầm nhìn)', tip: 'Bên trái bàn = Thanh Long (đặt cây cao)',
  },
  kitchen: {
    vi: 'Bếp',
    best: ['Basil, bạc hà (rau thơm)', 'Ớt cảnh'],
    purpose: 'thực vật ăn được, hóa giải Hỏa',
    avoid: 'cây độc/trồng (cận thức ăn)', tip: 'Cửa sổ bếp, ánh sáng',
  },
  bathroom: {
    vi: 'Nhà vệ sinh',
    best: ['Nhện (Chlorophytum)', 'Trầu bà', 'Tre nhỏ'],
    purpose: 'hút ẩm, lọc khí xấu, át hung',
    avoid: 'cây cần nắng (bathroom thiếu sáng)', tip: 'Đặt ở hướng HUNG = "tọa hung"',
  },
  entrance: {
    vi: 'Lối vào/hoa hồng',
    best: ['Kim tiền to', 'Thiết mộc lan cao', 'Ngũ gia bì'],
    purpose: 'đón vượng khí, chắn hung, "mở cửa thấy xanh"',
    avoid: 'cây khô/lá vàng (hao tài)', tip: '2 cây đối xứng 2 bên cửa',
  },
  balcony: {
    vi: 'Ban công/sân',
    best: ['Phong lộc hoa', 'Đỗ quyên', 'Hoa giấy', 'Cây ăn quả'],
    purpose: 'đón dương khí, phóng sinh',
    avoid: 'cây quá rậm rạp (che sáng)', tip: 'Hướng ban công theo Dụng Thần',
  },
};

// Cây kỵ theo Kỵ Thần
const WX_AVOID_PLANTS = {
  木: ['cây gai, xương rồng (sát khí Mộc thái quá)'],
  火: ['cây hoa đỏ quá rực (Hỏa thái)'],
  土: ['cây mọng nước quá nhiều (Thổ úng)'],
  金: ['cây trắng quá nhiều (Kim lạnh)'],
  水: ['cây thủy sinh quá nhiều (Thủy trầm)'],
};

/**
 * @returns {{ dungPlants, dungPlacement, dungCare, kyPlants,
 *            roomGuide:[{room, plants, purpose, avoid, tip}], advice }}
 */
export function plantFengShui(R) {
  const dungWx = R.yong.primary;
  const kyWx = R.yong.ji;
  const dungInfo = WX_PLANTS[dungWx];
  const kyInfo = WX_PLANTS[kyWx];
  const kyAvoid = WX_AVOID_PLANTS[kyWx] || [];

  const roomGuide = Object.entries(ROOM_PLANTS).map(([key, info]) => ({
    room: key, vi: info.vi, plants: info.best, purpose: info.purpose,
    avoid: info.avoid, tip: info.tip,
  }));

  const advice = `Cây Dụng Thần (${WX_VI[dungWx]}): ${dungInfo.plants.slice(0, 3).join(', ')} — ${dungInfo.desc}. ` +
    `Đặt: ${dungInfo.placement}. Chăm: ${dungInfo.care}. ` +
    `Tài vị (phòng khách góc Đông Nam): Kim tiền/Lưỡi hổ. ` +
    `Bàn làm việc: Cỏ đồng tiền/Tre nhỏ. ` +
    `Tránh: ${kyInfo.plants.slice(0, 2).join(', ')} (Kỵ ${WX_VI[kyWx]}).`;

  return {
    dungWx, dungVi: WX_VI[dungWx],
    dungPlants: dungInfo.plants, dungDesc: dungInfo.desc,
    dungPlacement: dungInfo.placement, dungCare: dungInfo.care,
    kyWx, kyVi: WX_VI[kyWx],
    kyPlants: kyInfo.plants.slice(0, 3), kyAvoid,
    roomGuide, advice,
    allPlants: WX_PLANTS,
  };
}

export { WX_PLANTS, ROOM_PLANTS };
