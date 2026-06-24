// ============================================================================
//  QUÝ NHÂN BỒI DƯỠNG 贵人培养 — HOW TO ATTRACT & KEEP NOBLE PEOPLE
//  Khác emperor-star.js (AI là quý nhân): module này = LÀM SAO gặp/giữ.
//  "Làm sao để gặp quý nhân? Đâu tìm? Tiếp cận thế nào? Nuôi quan hệ ra sao?"
//  Nguồn: 渊海子平 贵人篇, 鬼谷子 抵巇, 了凡四训 积善方.
// ============================================================================
import { WX_VI, TEN_GOD_VI } from './constants.js';

// Cách tìm/gặp quý nhân theo ngũ hành Dụng Thần
const WX_NOBLE_SEEK = {
  木: { place: 'rừng/công viên/trường học/hội chợ nông', occasion: 'lớp học, hội sinh thái, sự kiện giáo dục, làm vườn cộng đồng', approach: 'trồng chung gốc cây — giúp họ phát triển, họ sẽ nâng bạn' },
  火: { place: 'sự kiện/vũ trường/kitchen/show/networking', occasion: 'tiệc, hội thảo, thắp đèn/mang nhiệt huyết, ánh sáng', approach: 'truyền cảm hứng — bạn lan tỏa năng lượng, họ quay lại giúp' },
  土: { place: 'BĐS/xây dựng/trung tâm/thiền đường', occasion: 'mua nhà, xây dựng, bất động sản, từ thiện ổn định', approach: 'đáng tin — giữ lời hứa, xây uy tín, họ tin bạn' },
  金: { place: 'tài chính/công nghệ/văn phòng luật', occasion: 'giao dịch, ký kết, hội tài chính, framework kỷ luật', approach: 'kỷ luật + chuyên nghiệp — bạn thực hiện đúng, họ đề bạt' },
  水: { place: 'cảng/thương mại/sông hồ/networking rộng', occasion: 'xuất ngoại, logistics, thương mại, giao thương', approach: 'linh hoạt + uyển chuyển — bạn thích nghi, họ dẫn dắt' },
};

// Cách tiếp cận theo thập thần nổi bật của BẠN
const GOD_APPROACH = {
  正官: 'tiếp cận qua "uy tín + kỷ luật" — họ thấy bạn đáng tin → nâng đỡ',
  七殺: 'tiếp cận qua "quyết đoán + dũng cảm" — họ nể bạn dám làm → giúp',
  正財: 'tiếp cận qua "thực tế + đáng tin" — họ thấy bạn ổn định → ủng hộ',
  偏財: 'tiếp cận qua "hào phóng + giao tế" — bạn cho đi, họ quay lại gấp bội',
  正印: 'tiếp cận qua "học vấn + khiêm cung" — họ thấy bạn ham học → dạy bảo',
  偏印: 'tiếp cận qua "độc đáo + sâu sắc" — họ thấy bạn khác biệt → chú ý',
  食神: 'tiếp cận qua "tài hoa + vui vẻ" — họ thích năng lượng bạn → gần',
  傷官: 'tiếp cận qua "sáng tạo + thuyết phục" — họ thấy bạn giỏi → hợp tác',
  比肩: 'tiếp cận qua "bình đẳng + hợp tác" — họ thấy bạn xứng tầm → đồng hành',
  劫財: '⚠ tiếp cận cẩn thận — dễ bị coi là "đối thủ", cần nhường nhịn trước',
};

// "Cho đi" gì để thu hút quý nhân (luật nhân quả - 了凡四训)
const GIVE_BACK = {
  木: 'giúp người phát triển (dạy/hướng dẫn/chia sẻ kiến thức)',
  火: 'truyền cảm hứng, thắp sáng hy vọng cho người khác',
  土: 'ổn định, đáng tin, xây dựng nền tảng cho người khác',
  金: 'kỷ luật, công bằng, thực hiện đúng cam kết',
  水: 'linh hoạt, lắng nghe, kết nối người với người',
};

// "Drainers" — người nên tránh (Kỵ Thần element people)
const DRAINER_DESC = {
  木: 'người quá cứng đầu/độc đoán (Mộc thái) → kìm hãm bạn',
  火: 'người quá bốc đồng/nóng (Hỏa thái) → hao mòn bạn',
  土: 'người quá trì/bảo thủ (Thổ thái) → kéo bạn dừng',
  金: 'người quá sắc lạnh/phê bình (Kim thái) → tổn thương bạn',
  水: 'người quá âm u/trôi nổi (Thủy thái) → lạc lối bạn',
};

/**
 * @returns {{ whoToSeek, whereToFind, howToApproach, whatToGive,
 *            drainers, timing, maintenance, advice }}
 */
export function nobleCultivation(R) {
  const dungWx = R.yong.primary;
  const kyWx = R.yong.ji;
  const dayGan = R.chart.dayGan;

  // Thập thần nổi bật nhất → cách tiếp cận
  const gods = {};
  for (const key of ['year', 'month', 'time']) {
    const g = R.chart.pillars[key].ganGod;
    if (g && g !== '日主') gods[g] = (gods[g] || 0) + 1;
  }
  const topGod = Object.entries(gods).sort((a, b) => b[1] - a[1])[0]?.[0] || '正官';

  const seek = WX_NOBLE_SEEK[dungWx];
  const approach = GOD_APPROACH[topGod] || GOD_APPROACH['正官'];
  const give = GIVE_BACK[dungWx];
  const drainer = DRAINER_DESC[kyWx];

  // Timing: khi nào quý nhân đến (từ shensha-activation + liunian)
  const curYear = new Date().getFullYear();
  const timing = [];
  // Mỗi năm kiểm can: nếu = Thiên Ất can → quý nhân
  // (đơn giản hóa: dùng năm chi = chi quý nhân)

  // Maintenance: 5 nguyên tắc giữ quý nhân
  const maintenance = [
    '1. "Cho trước nhận sau" — giúp người trước, quý nhân tự đến (luật nhân quả).',
    '2. Giữ liên lạc đều — không chỉ tìm khi cần; thăm hỏi thường xuyên.',
    `3. Tôn trọng khác biệt — quý nhân của bạn tính cách ${seek.approach.slice(0, 40)}...`,
    '4. Đáp ơn đúng cách — khi được giúp, báo đáp xứng đáng (không rẻ tiền).',
    '5. Trở thành quý nhân của người khác — 《了凡四训》: tích âm đức = tự tạo quý nhân.',
  ];

  const advice = `Quý nhân của bạn mang hành ${WX_VI[dungWx]} (Dụng Thần). ` +
    `Tìm ở: ${seek.place}. Cách tiếp cận: ${approach}. ` +
    `Cho đi: ${give}. ` +
    `Tránh: người ${drainer}. ` +
    `Trên hết: 《了凡四训》 dạy "tích âm đức" = cách THẬT SỰ thu hút quý nhân — giúp người vô điều kiện, quý nhân tự hội tụ.`;

  return {
    dungWx, dungVi: WX_VI[dungWx],
    whoToSeek: `Người mang hành ${WX_VI[dungWx]} (= Dụng Thần) + tính cách ${seek.approach.slice(0, 40)}...`,
    whereToFind: `${seek.place} — ${seek.occasion}`,
    howToApproach: approach,
    whatToGive: give,
    drainers: `Tránh người ${drainer} (Kỵ ${WX_VI[kyWx]})`,
    maintenance, advice,
    allSeek: WX_NOBLE_SEEK,
  };
}

export { WX_NOBLE_SEEK, GOD_APPROACH, GIVE_BACK, DRAINER_DESC };
