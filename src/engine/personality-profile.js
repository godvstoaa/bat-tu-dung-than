// ============================================================================
//  TÍNH CÁCH HỒ SƠ 性格画像 — structured personality per day master
//  Khác DITIANSUI (verse cổ): hồ sơ cấu trúc 8 trục cho mỗi nhật chủ.
//  Nguồn: 滴天髓 十干论, 渊海子平 性情篇, 黄帝内经 阴阳五行人.
// ============================================================================
import { GAN, WX_VI } from './constants.js';

const PROFILES = {
  甲: {
    temperament: 'Đại thụ dương — sừng sững, chính trực, có chí tiến thủ, lãnh đạo bẩm sinh.',
    strengths: 'kiên nhẫn, trách nhiệm, bao dung, lập kế hoạch dài hạn, bảo vệ người yếu.',
    weaknesses: 'cứng nhắc, bảo thủ, khó uốn nắn, đôi khi độc đoán, chậm thay đổi.',
    social: 'giao tế trang trọng, ít nói nhiều làm, được cấp dưới tôn trọng; không giỏi nịnh.',
    love: 'trọng gia đình, chung thủy nhưng thiếu lãng mạn, đôi khi gia trưởng.',
    career: 'hợp quản lý, lãnh đạo, giáo dục, nông-lâm, mộc, tổ chức phi lợi nhuận.',
    health: 'gan–mật chủ đạo — dễ nóng giận ảnh hưởng gan; cần vận động giải tỏa.',
    finance: 'tích lũy chậm nhưng vững; đầu tư BĐS/dài hạn hơn đầu cơ.',
  },
  乙: {
    temperament: 'Hoa cỏ dây leo âm — mềm dẻo, khéo léo, thích nghi cực tốt, giàu trực giác.',
    strengths: 'linh hoạt, kiên nhẫn bền bỉ, giao tiếp khéo, nghệ thuật, ngoại giao.',
    weaknesses: 'phụ thuộc, thiếu quyết đoán, hay do dự, dễ bị ảnh hưởng, đôi khi quá mềm.',
    social: 'giao tế khéo léo, duyên dáng, dễ được lòng người; giỏi đọc vị cảm xúc.',
    love: 'lãng mạn, nhạy cảm, cần cảm giác an toàn; dễ bị tổn thương khi phản bội.',
    career: 'hợp nghệ thuật, thiết kế, ngoại giao, tâm lý, giáo dục, thời trang, y tế.',
    health: 'gan–mật nhưng dạng nhu — dễ suy nhược thần kinh, mất ngủ; cần dưỡng tĩnh.',
    finance: 'linh hoạt đa dạng nhưng dễ hao vì tình/nghệ thuật; nên có người quản lý.',
  },
  丙: {
    temperament: 'Mặt trời dương — nhiệt thành, hào sảng, quang minh, lan tỏa năng lượng.',
    strengths: 'lan tỏa, truyền cảm hứng, hào phóng, nhanh nhẹn, lãnh đạo bằng nhiệt huyết.',
    weaknesses: 'nóng vội, phô trương, dễ bốc đồng, thiếu kiên nhẫn, hay hứa suông.',
    social: 'sôi nổi, trung tâm chú ý, dễ kết bạn; đôi khi quá ồn/lấn át người khác.',
    love: 'nồng nhiệt, chủ động, thích thể hiện; cần người biết "hạ nhiệt" cho mình.',
    career: 'hợp truyền thông, quảng cáo, giải trí, năng lượng, ẩm thực, chính trị.',
    health: 'tim – huyết quản — dễ huyết áp cao, mất ngủ, bốc hỏa; cần giảm stress.',
    finance: 'hào phóng, dễ tiêu nhiều; kiếm nhanh tiêu nhanh; cần kỷ luật tiết kiệm.',
  },
  丁: {
    temperament: 'Ngọn đèn/đom đóm âm — ấm áp, tinh tế, trực giác mạnh, nội tâm sâu.',
    strengths: 'nhạy bén, sáng tạo âm thầm, kiên trì, giàu lòng thương, chiếu sáng người khác.',
    weaknesses: 'đa cảm, dễ lo nghĩ, nhạy cảm quá, hay che giấu cảm xúc, thiếu dũng khí đôi khi.',
    social: 'tinh tế, ít nói sâu, chọn lọc bạn; giỏi lắng nghe, được tin tưởng.',
    love: 'nồng nàn nhưng kín đáo, cần được thấu hiểu; dễ tổn thương khi bị phớt lờ.',
    career: 'hợp văn chương, tâm lý, tôn giáo, nghệ thuật, nghiên cứu, điều dưỡng.',
    health: 'tim – huyết nhưng dạng nhu — dễ ưu tư, mất ngủ, lo âu; cần dưỡng tâm.',
    finance: 'tích lũy âm thầm, kiên nhẫn; không hợp đầu cơ lớn, hợp đầu tư an toàn.',
  },
  戊: {
    temperament: 'Núi cao dương — vững vàng, bao dung, đáng tin, sức chịu đựng lớn.',
    strengths: 'ổn định, tin cậy, bao dung, kiên định, tổ chức tốt, "tảng đá" cho gia đình.',
    weaknesses: 'bảo thủ, chậm đổi thay, cứng đầu, đôi khi ì ạch, thiếu linh hoạt.',
    social: 'trầm ổn, ít nói nhiều làm, được tôn trọng; không giỏi thể hiện cảm xúc.',
    love: 'trọng trách nhiệm, chung thủy, ít lãng mạn; "yêu = lo cho gia đình".',
    career: 'hợp BĐS, xây dựng, quản lý, bảo hiểm, quân sự, chính phủ, tài nguyên.',
    health: 'tỳ – vị — dễ béo phì, tiểu đường, tiêu hoá chậm; cần vận động + ăn kiêng.',
    finance: 'tích lũy vững (BĐS/vàng); chậm nhưng chắc; không mạo hiểm.',
  },
  己: {
    temperament: 'Đất ruộng âm — ôn hòa, cần mẫn, bao dung nuôi dưỡng, thực tế.',
    strengths: 'chăm chỉ, nhẫn nại, nuôi dưỡng, thực tế, chi tiết, giỏi chăm sóc.',
    weaknesses: 'hay đa nghi, giữ kẽ, thiếu quyết đoán, dễ bị lợi dụng lòng tốt.',
    social: 'mềm mỏng, hiền lành, dễ gần; giỏi chăm sóc người khác; ít khi tranh.',
    love: 'hy sinh, bao dung, cần được trân trọng; dễ bị bỏ rơi nếu không được đáp lại.',
    career: 'hợp y tế, chăm sóc, giáo dục mầm non, nông nghiệp, nội thất, tư vấn.',
    health: 'tỳ – vị dạng nhu — dễ suy nhược, tiêu hoá kém; cần ăn ấm, tránh lạnh.',
    finance: 'tích lũy cần mẫn từng đồng; không rủi ro; hợp gửi tiết kiệm lâu dài.',
  },
  庚: {
    temperament: 'Sắt thép dương — cương nghị, quả cảm, trọng nghĩa khí, hành động dứt khoát.',
    strengths: 'quyết đoán, dũng cảm, thẳng thắn, hành động nhanh, trọng chữ tín.',
    weaknesses: 'cứng rắn, hiếu thắng, dễ tổn thương người khác bằng lời nói thẳng, độc đoán.',
    social: 'thẳng thắn, ít vòng vo, trọng bằng hữu; đôi khi quá sắc bén gây mất lòng.',
    love: 'quyết đoán, chiếm hữu cao, cần người nhường; "yêu = bảo vệ".',
    career: 'hợp quân sự, cảnh sát, luật, cơ khí, tài chính, phẫu thuật, thể thao.',
    health: 'phổi – đại tràng — dễ hô hấp, dị ứng, da; cần không khí trong lành.',
    finance: 'quyết đoán đầu tư, dám rủi ro nhưng cũng dám cắt lỗ; hợp giao dịch.',
  },
  辛: {
    temperament: 'Châu ngọc âm — thanh tú, cầu toàn, nhạy bén thẩm mỹ, tự trọng cao.',
    strengths: 'thẩm mỹ tốt, tinh tế, sáng tạo nghệ thuật, chú trọng chất lượng, nhạy cảm.',
    weaknesses: 'nhạy cảm quá, dễ tổn thương, cầu toàn gây áp lực, hay so sánh.',
    social: 'tinh tế, thanh lịch, chọn lọc; dễ bị tổn thương bởi lời phê bình.',
    love: 'lãng mạn, tinh tế, cần được trân trọng như "ngọc"; dễ vỡ nếu bị thô lỗ.',
    career: 'hợp trang sức, nghệ thuật, thời trang, thẩm mỹ, âm nhạc, thiết kế cao cấp.',
    health: 'phổi – da dạng nhu — da nhạy, dị ứng, hô hấp nhẹ; cần dưỡng ẩm, tránh khô.',
    finance: 'đầu tư vào cái đẹp (trang sức/nghệ thuật); khéo kiếm tiền nhưng chi sang.',
  },
  壬: {
    temperament: 'Sông biển dương — thông tuệ, phóng khoáng, mưu lược, giàu tầm nhìn.',
    strengths: 'trí tuệ, linh hoạt, mưu lược, bao dung, giao tế rộng, tầm nhìn xa.',
    weaknesses: 'phóng túng, thiếu kiên định, dễ chán, hay hứa nhưng không làm, trôi nổi.',
    social: 'rộng mở, giỏi kết nối, duyên; nhưng không sâu — "nước chảy chỗ trũng".',
    love: 'phóng khoáng, cần tự do; dễ đa tình; cần người "giữ nước lại".',
    career: 'hợp thương mại, vận tải, du lịch, ngoại giao, tài chính, xuất nhập khẩu.',
    health: 'thận – bàng quang — dễ thận yếu, tiết niệu; cần uống đủ nước, tránh lạnh.',
    finance: 'dòng tiền lưu thông nhanh; giỏi kinh doanh nhưng cũng dễ chảy; cần đập nước.',
  },
  癸: {
    temperament: 'Mưa móc âm — kín đáo, nhu thuận, nhẫn nại, trí tưởng tượng phong phú.',
    strengths: 'kiên nhẫn, thấu cảm, trực giác mạnh, trí tưởng tượng, linh hoạt mềm.',
    weaknesses: 'ưu tư, hay che giấu, thiếu dũng khí, dễ bị động, phụ thuộc cảm xúc.',
    social: 'kín đáo, chọn lọc, thấu cảm; ít khi chủ động; giỏi giữ bí mật.',
    love: 'nhu mì, thầm lặng, hy sinh; cần người chủ động dắt; dễ bị bỏ rơi im lặng.',
    career: 'hợp văn chương, tâm lý, nghiên cứu, tôn giáo, từ thiện, thư viện, kế toán.',
    health: 'thận – tủy dạng nhu — dễ suy nhược, lạnh tay chân; cần dưỡng ấm, tránh lạnh.',
    finance: 'tích lũy âm thầm từng giọt; kiên nhẫn; hợp tiết kiệm dài hạn không rủi ro.',
  },
};

/**
 * @returns {{ gan, ganVi, wx, wxVi, profile:{[key]:string}, keys:string[] }}
 */
export function getPersonalityProfile(R) {
  const gan = R.chart.dayGan;
  const p = PROFILES[gan] || {};
  const ganVi = GAN[gan]?.vi || gan;
  const wx = GAN[gan]?.wx || '';
  const wxVi = WX_VI[wx] || '';
  return { gan, ganVi, wx, wxVi, profile: p, keys: Object.keys(p) };
}

export { PROFILES };
