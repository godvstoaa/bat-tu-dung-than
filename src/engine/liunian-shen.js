// ============================================================================
//  LƯU NIÊN THẬP NHỊ THẦN 流年十二神 (十二太岁 / 通胜流年神煞)
//  Nguồn: 唐·李淳风《四利三元》. 12 thần theo 流年太岁 × chi năm sinh:
//  chỉ vị trí godIndex = (chiNămSinh - chiLưuNiên) mod 12.
//  太岁/太阳/丧门/太阴/官符/死符/岁破/龙德/白虎/福德/吊客/病符.
// ============================================================================
const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 12 thần theo thứ tự (godIndex 0..11),李淳风四利三元 hệ
export const LIUNIAN_GODS = [
  { key: 'taisui', zh: '太岁', vi: 'Thái Tuế', tone: 'hung', meaning: '“太岁当头坐，无喜恐有祸” — năm biến động lớn, dễ bệnh/tai nạn/tiểu nhân. Tránh động thổ phương太岁, cẩn trọng quyết định lớn.', remedy: '拜太岁/安太岁, mang生肖 tam hợp, giữ điều độ, tích đức.' },
  { key: 'taiyang', zh: '太阳', vi: 'Thái Dương', tone: 'cat', meaning: 'NAM: sự nghiệp cao cường, quang minh, tiến cát. NỮ: dễ bệnh/nhược (dương sát).', remedy: 'Nam tiến thủ; nữ giữ sức khoẻ, tránh nắng gắt.' },
  { key: 'sangmen', zh: '丧门', vi: 'Táng Môn', tone: 'hung', meaning: 'Chủ孝服/khóc loạn,灾病 — cẩn thận người lớn tuổi trong nhà, sức khoẻ.', remedy: 'Cẩn trọng sức khoẻ người lớn tuổi, tránh viếng heavy, tích đức.' },
  { key: 'taiyin', zh: '太阴', vi: 'Thái Âm', tone: 'cat', meaning: 'NỮ: đại cát, tài lộc/âm trợ. NAM: vợ/âm nhân hữu lực, tài lộc nhẹ.', remedy: 'Phát huy giao tế nữ giới, đầu tư穩 định.' },
  { key: 'guanfu', zh: '官符', vi: 'Quan Phù (Ngũ Quỷ)', tone: 'hung', meaning: 'Chủ quan phi/khiếu nại/口舌/纠纷 — cẩn thận hợp đồng, vbvb.', remedy: 'Ký kết cẩn thận, tránh tranh chấp, nhẫn nhịn.' },
  { key: 'sifu', zh: '死符', vi: 'Tử Phù', tone: 'hung', meaning: 'Chủ bệnh/thiên Hospital/kinh ưu — chú ý sức khoẻ, an toàn.', remedy: 'Khám sức khoẻ định kỳ, tránh nguy hiểm, dưỡng sinh.' },
  { key: 'suipo', zh: '岁破', vi: 'Tuế Phá (Đại Hao)', tone: 'hung', meaning: 'Xung Thái Tuế (đối cung) — 破财 lớn, biến động, 惹是非. Tránh đầu tư lớn.', remedy: 'Giữ tiền chặt, tránh đầu cơ/động thổ phương岁破, bao dung.' },
  { key: 'longde', zh: '龙德', vi: 'Long Đức', tone: 'cat', meaning: 'Quý nhân/逢凶化吉 — năm được nâng đỡ, tai nạn giảm.', remedy: 'Tận dụng quý nhân, tiến thủ适度.' },
  { key: 'baihu', zh: '白虎', vi: 'Bạch Hổ', tone: 'hung', meaning: '血光/đao thương/hình thương — cẩn thận thương tích, phẫu thuật, xe cộ.', remedy: 'Tránh nguy hiểm, hiến máu/nhổ răng (hóa blood light), an toàn giao thông.' },
  { key: 'fude', zh: '福德', vi: 'Phúc Đức', tone: 'cat', meaning: '“福德临命宫，百事皆顺通” — phúc lộc, thuận lợi, tâm an.', remedy: 'Tiến thủ, làm việc thiện nhân phúc tăng.' },
  { key: 'diaoke', zh: '吊客', vi: 'Điếu Khách (Thiên Cẩu)', tone: 'hung', meaning: 'Chủ tang/吊丧/break tài/thị phi — cẩn thại người ốm, hao tiền.', remedy: 'Cẩn thận sức khoẻ người nhà, tránh hao tiền vô ích.' },
  { key: 'bingfu', zh: '病符', vi: 'Bệnh Phù', tone: 'hung', meaning: 'Chủ bệnh nhẹ/mệt mỏi/tâm trạng — dưỡng sinh, nghỉ ngơi.', remedy: 'Dưỡng sinh, ngủ đủ, giảm stress.' },
];

/**
 * Tìm 流年十二神 cho một người trong một năm.
 * @param {string} birthZhi - chi năm sinh (vd 酉)
 * @param {string} yearZhi - chi lưu niên (vd 午 = 2026)
 * @returns {{ god, allGods:[{zh,vi,atZhi,isMine}], note }}
 */
export function liunian12Shen(birthZhi, yearZhi) {
  const birthIdx = ZHI_ORDER.indexOf(birthZhi);
  const yearIdx = ZHI_ORDER.indexOf(yearZhi);
  // godIndex theo chi năm sinh (từ太岁=yearZhi顺排): (birthIdx - yearIdx) mod 12
  const godIdx = ((birthIdx - yearIdx) % 12 + 12) % 12;
  const god = LIUNIAN_GODS[godIdx];
  // bản đồ 12 thần → chi (mỗi神 tại chi yearZhi + godIdx; nhưng ta liệt kê god theo từng chi tuổi)
  const allGods = ZHI_ORDER.map((z, i) => {
    const gi = ((i - yearIdx) % 12 + 12) % 12;
    return { ...LIUNIAN_GODS[gi], atZhi: z, isMine: z === birthZhi };
  });
  return {
    god,
    allGods,
    note: 'Lưu niên 12 thần (李淳风四利三元) — tham chiếu通胜; đây là 1 lớp tín hiệu, kết hợp Bát Tự lưu niên (Thập thần/Dụng/桃花) và 大运 để chốt.',
  };
}

export { ZHI_ORDER };
