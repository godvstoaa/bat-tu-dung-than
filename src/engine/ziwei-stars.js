// ============================================================================
//  TỬ VI 14 CHÍNH TINH — Ý NGHĨA sao (để user đọc được, không chỉ xem tên)
//  14 sao chia 2 hệ: 紫微系 (6: 紫微/天机/太阳/武曲/天同/廉贞)
//  + 天府系 (8: 天府/太阴/贪狼/巨门/天相/天梁/七杀/破军).
//  Mỗi sao: { vi, nature, inMingGong, element, tone }.
//  Nguồn: 紫微斗数全书, 维基百科紫微斗数.
// ============================================================================
export const STARS_14 = {
  紫微: {
    vi: 'Tử Vi', nature: 'Đế vương tinh — lãnh đạo, tôn quý, tự phụ, thích被人 phục vụ. Bắc Đẩu chủ.',
    inMing: 'Tử Vi tại Mệnh:天生 khí chất lãnh đạo, thích chỉ huy, tự trọng cao; cần "phụ tá" (左辅右弼) mới phát, không thì "cô đế". Kỵ kiêu ngạo.',
    element: 'Thổ', tone: '中吉',
  },
  天机: {
    vi: 'Thiên Cơ', nature: 'Trí tuệ tinh — thông minh, đa mưu, nhạy cảm, thay đổi. Khí chất quân sư.',
    inMing: 'Thiên Cơ tại Mệnh: cực thông minh, giỏi phân tích/kế hoạch; nhưng hay lo nghĩ, thiếu quyết đoán. Hợp tham mưu, nghiên cứu.',
    element: 'Mộc', tone: '吉',
  },
  太阳: {
    vi: 'Thái Dương', nature: 'Quang minh tinh — nhiệt tình, bao dung, cống hiến, danh tiếng. Nam tinh chính.',
    inMing: 'Thái Dương tại Mệnh: quang minh lỗi lạc, hào phóng, thích giúp người; cẩn thận quá cố chấp/phô trương. Hợp chính trị, giáo dục.',
    element: 'Hỏa', tone: '吉',
  },
  武曲: {
    vi: 'Vũ Khúc', nature: 'Tài tinh — cương quyết, thực tế, tài lộc, kỷ luật. "Vũ khúc vi tài tinh".',
    inMing: 'Vũ Khúc tại Mệnh: cương nghị, quyết đoán, trọng lợi; giỏi kinh doanh/tài chính. Kỵ quá cứng, thiếu tình.',
    element: 'Kim', tone: '吉',
  },
  天同: {
    vi: 'Thiên Đồng', nature: 'Phúc tinh — lạc quan, nhàn hạ, hưởng thụ, nhu hoà. "Thiên đồng vi phúc tinh".',
    inMing: 'Thiên Đồng tại Mệnh: hiền lành, lạc quan, thích an nhàn; muộn phát, phúc đức. Kỵ lười biếng.',
    element: 'Thủy', tone: '吉',
  },
  廉贞: {
    vi: 'Liêm Trinh', nature: 'Đào hoa chính trị tinh — tài năng, nhiệt huyết, đào hoa; cẩn thận "tù tinh".',
    inMing: 'Liêm Trinh tại Mệnh: nhiệt huyết, tài năng chính trị/nghệ thuật; đào hoa mạnh. Cần kỷ luật, kỵ sa đọa.',
    element: 'Hỏa', tone: 'volatile',
  },
  天府: {
    vi: 'Thiên Phủ', nature: 'Tài khố tinh — ổn định, bảo thủ, phúc lộc, 包容. Nam Đẩu chủ.',
    inMing: 'Thiên Phủ tại Mệnh: ổn trọng, bao dung, có tài sản; hợp quản lý tài chính, bất động sản. An nhàn phúc.',
    element: 'Thổ', tone: '吉',
  },
  太阴: {
    vi: 'Thái Âm', nature: 'Mẫu tính tinh — nhu thuận, tinh tế, nhà đất, mẫu tính. Nữ tinh chính.',
    inMing: 'Thái Âm tại Mệnh: nhu hoà, tinh tế, trực giác tốt; hợp nghệ thuật, nhà đất. Ấm no, có phúc mẫu.',
    element: 'Thủy', tone: '吉',
  },
  贪狼: {
    vi: 'Tham Lang', nature: 'Đào hoa tài nghệ tinh — đa tài, đa dục, giao tế, mạo hiểm. "Đào hoa chủ".',
    inMing: 'Tham Lang tại Mệnh: đa tài, duyên dáng, giỏi giao tế; đào hoa cực mạnh. Hợp nghệ thuật, giải trí; kỵ sa sắc.',
    element: 'Mộc', tone: 'volatile',
  },
  巨门: {
    vi: 'Cự Môn', nature: 'Khẩu thiệt ám mí tinh — khẩu tài, đa nghi, thị phi. "Hóa khí vi ám".',
    inMing: 'Cự Môn tại Mệnh: giỏi khẩu tài/pháp luật; nhưng dễ dính thị phi, khẩu chiến. Cần Thái Dương chiếu mới giải "ám".',
    element: 'Thủy', tone: 'hung',
  },
  天相: {
    vi: 'Thiên Tướng', nature: 'Ấn tín phò tá tinh — trung thành, phục vụ, ngoại hình tốt. "Hóa khí vi ấn".',
    inMing: 'Thiên Tướng tại Mệnh: trung thành, cẩn thận, giỏi phò tá; hợp tham mưu, ngoại giao, y tế. Ổn định.',
    element: 'Thủy', tone: '吉',
  },
  天梁: {
    vi: 'Thiên Lương', nature: 'Thọ tinh shelther — bảo vệ, thọ, đạo đức, thanh cao. "Hóa khí vi荫".',
    inMing: 'Thiên Lương tại Mệnh: thẳng thắn, có đạo đức, thích che chở; hợp y tế, luật, giáo dục. Thọ, nhưng cô cao.',
    element: 'Thổ', tone: '吉',
  },
  七杀: {
    vi: 'Thất Sát', nature: 'Quyền uy tướng tinh — cương mãnh, quyết đoán, mạo hiểm, quyền lực. "Hóa khí vi quyền".',
    inMing: 'Thất Sát tại Mệnh: cực cương mãnh, dũng cảm, độc lập; hợp quân sự, khởi nghiệp. Kỵ quá cứng gãy.',
    element: 'Kim', tone: 'volatile',
  },
  破军: {
    vi: 'Phá Quân', nature: 'Tiên phong biến động tinh — phá旧 lập新, mạo hiểm, độc lập, biến động. "Hóa khí vi耗".',
    inMing: 'Phá Quân tại Mệnh: phá cách, tiên phong, thích thay đổi; cuộc đời biến động nhiều. Hợp khởi nghiệp, sáng tạo.',
    element: 'Thủy', tone: 'volatile',
  },
};

/**
 * Tra ý nghĩa sao + luận theo cung Mệnh.
 * @param {object} z - computeZiwei output (có mainStars, mingGong)
 * @returns [{ star, branch, info, inMingNote }]
 */
export function interpretZiweiStars(z) {
  if (!z.mainStars) return [];
  const mingGong = z.mingGong; // e.g. "壬戌" → the branch is the palace
  const mingBranch = mingGong.length > 1 ? mingGong[mingGong.length - 1] : mingGong;
  const out = [];
  for (const [star, branch] of Object.entries(z.mainStars)) {
    const info = STARS_14[star] || { vi: star, nature: '(chưa encode)', inMing: '', element: '', tone: '' };
    const inMingGong = branch === mingBranch || branch === mingGong;
    out.push({ star, vi: info.vi, branch, nature: info.nature, inMingNote: inMingGong ? info.inMing : '', element: info.element, tone: info.tone, inMingGong });
  }
  // Sort: Mệnh cung stars first, then others
  out.sort((a, b) => (b.inMingGong ? 1 : 0) - (a.inMingGong ? 1 : 0));
  return out;
}

