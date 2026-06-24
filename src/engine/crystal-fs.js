// ============================================================================
//  THẠCH ANH & KHAI VẬN VẬT PHẨM 水晶开运 — CRYSTALS & LUCKY OBJECTS
//  "Đeo đá gì? Mua vật phẩm gì? Để ở đâu?" theo Dụng Thần ngũ hành.
//  Nguồn: 矿物学 五行, 风水摆件.
// ============================================================================
import { WX_VI } from './constants.js';

const WX_CRYSTALS = {
  木: {
    crystals: ['Thạch anh xanh (Green Quartz)', 'Điện khí thạch (Aventurine)', 'Malachite', 'Ngọc cẩm thạch (Jadeite)', 'Phong thuỷ thạch xanh', 'Olivine/Peridot'],
    color: 'xanh lá',
    organ: 'Gan–Mật',
    benefit: 'sơ can, giảm nóng giận, tăng sinh khí, may mắn tài lộc (diện tài)',
    metal: 'đồng (copper), gỗ chai',
    objects: ['thuyền buồm gỗ (rước tài)', 'tỳ hù gỗ', 'thuy tiên trong bình gỗ'],
    placement: 'Đông, Đông Nam',
  },
  火: {
    crystals: ['Thạch anh hồng/đỏ (Rose/Strawberry Quartz)', 'Rubellite (hồng lục bảo)', 'Garnet (đỏ)', 'Sunstone', 'Rhodonite', 'Thạch anh tím (Amethyst — Hỏa/Tử)'],
    color: 'đỏ, hồng, tím',
    organ: 'Tim–Ruột non',
    benefit: 'noãn tâm, tăng nhiệt huyết, duyên (đào hoa), may mắn tình cảm',
    metal: 'vàng hồng (rose gold), đồng đỏ',
    objects: ['đèn thạch anh hồng', 'tranh phượng hoàng', 'nến đỏ'],
    placement: 'Nam',
  },
  土: {
    crystals: ['Thạch anh vàng (Citrine)', 'Thạch anh khói (Smoky Quartz)', 'Hổ phách (Tiger Eye)', 'Topaz vàng', 'Ruby zoisite (đỏ xanh)', 'Moonstone vàng kem'],
    color: 'vàng, nâu, be',
    organ: 'Tỳ–Vị',
    benefit: 'ổn định, bổ tỳ, tăng tín dụng, tài lộc ổn (chính tài), an thần',
    metal: 'vàng (gold), vàng trắng',
    objects: ['thuyền vàng (tài lộc)', 'tỳ hù đá vàng', 'tranh núi non (thổ)', 'tròn gốm'],
    placement: 'Trung cung, Đông Bắc, Tây Nam',
  },
  金: {
    crystals: ['Thạch anh trắng (Clear Quartz)', 'Diamond (kim cương)', 'White Topaz', 'Selenite', 'Hematite (kim loại)', 'Pyrite (vàng fool)'],
    color: 'trắng, xám, ánh kim',
    organ: 'Phổi–Đại tràng',
    benefit: 'sạch phế, mạnh ý chí, quyết đoán, thanh khiết, chống tà',
    metal: 'bạc (silver), bạch kim (platinum), thép',
    objects: ['chuông đồng', 'kiếm/poor đòng', 'khảm/khung kim loại', 'đồng tiền cổ'],
    placement: 'Tây, Tây Bắc',
  },
  水: {
    crystals: ['Thạch anh đen (Morion)', 'Obsidian (hắc曜)', 'Tourmaline đen', 'Aquamarine (xanh biển)', 'Lapis Lazuli', 'Sodalite'],
    color: 'đen, xanh đậm, navy',
    organ: 'Thận–Bàng quang',
    benefit: 'tĩnh tâm, dưỡng thận, trừ tà, bảo vệ, sâu lắng, tăng trí tuệ',
    metal: 'chì (lead), sắt đen, inox',
    objects: ['bình nước phong thuỷ', 'thủy tinh', 'cá chép Koi (thủy)', 'phong thủy luân nước'],
    placement: 'Bắc',
  },
};

// Vật phẩm khai vận theo mục đích
const PURPOSE_OBJECTS = {
  wealth: { vi: 'Cầu tài lộc', objects: ['thuyền buồm (Đông Nam)', 'cá chép (Tài vị)', 'thạch anh vàng Citrine', 'Tỳ Hù đá'], placement: 'góc Đông Nam phòng khách' },
  career: { vi: 'Cầu sự nghiệp', objects: ['Long Quy (rùa đầu rồng)', 'tháp Văn Xương', 'thiết quan âm (trà)', 'đồng tiền cổ 5'], placement: 'bàn làm việc, góc Tây Bắc' },
  love: { vi: 'Cầu tình duyên', objects: ['thạch anh hồng', 'hoa hồng tươi', 'đôi bồ câu', 'phỉ thúy xanh đôi'], placement: 'Đông Nam (đào hoa vị)' },
  health: { vi: 'Cầu sức khoẻ', objects: ['thạch anh trắng (mạnh phế)', 'hổ phách (an thần)', 'ngọc bích (lành)', 'muối đá'], placement: 'Đông (Mộc = sinh khí)' },
  protection: { vi: 'Tránh tà/hóa sát', objects: ['Obsidian (hắc曜)', 'gương Bát Quái', 'Tỳ Hù (hóa sát)', 'đồng tiền cổ trừ tà'], placement: 'trên cửa chính / hướng hung' },
  study: { vi: 'Cầu học vấn/thi cử', objects: ['tháp Văn Xương', 'thạch anh trắng (minh mẫn)', 'bút lông/loa màu Dụng'], placement: 'Đông Bắc (Văn Xương vị)' },
  children: { vi: 'Cầu con cái', objects: ['quả bí ngô (đa tử)', 'tượng [con nít]', 'quả dưa hấu (tử tựu)'], placement: 'Tây (con cái cung)' },
};

/**
 * @returns {{ dungCrystals, dungColor, dungBenefit, dungMetal, dungObjects,
 *            dungPlacement, kyCrystals, purposeObjects, advice }}
 */
export function crystalLuckyObjects(R) {
  const dungWx = R.yong.primary;
  const kyWx = R.yong.ji;
  const dungInfo = WX_CRYSTALS[dungWx];
  const kyInfo = WX_CRYSTALS[kyWx];

  const advice = `Đeo ${dungInfo.crystals.slice(0, 2).join(' / ')} (${WX_VI[dungWx]} = Dụng Thần) → ${dungInfo.benefit}. ` +
    `Trang sức kim loại: ${dungInfo.metal}. ` +
    `Vật phẩm phong thuỷ: ${dungInfo.objects.slice(0, 2).join(', ')} → đặt ${dungInfo.placement}. ` +
    `Tránh: ${kyInfo.crystals[0]} (${WX_VI[kyWx]} = Kỵ Thần).`;

  return {
    dungWx, dungVi: WX_VI[dungWx],
    dungCrystals: dungInfo.crystals, dungColor: dungInfo.color,
    dungOrgan: dungInfo.organ, dungBenefit: dungInfo.benefit,
    dungMetal: dungInfo.metal, dungObjects: dungInfo.objects,
    dungPlacement: dungInfo.placement,
    kyWx, kyVi: WX_VI[kyWx],
    kyCrystals: kyInfo.crystals.slice(0, 3),
    purposeObjects: PURPOSE_OBJECTS,
    advice,
    allCrystals: WX_CRYSTALS,
  };
}

export { WX_CRYSTALS, PURPOSE_OBJECTS };
