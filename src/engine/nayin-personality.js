// ============================================================================
//  NHẬT TRỤ NẠP ÂM LUẬN MỆNH (Day Pillar Nayin Destiny) — tính cách bẩm sinh
//  "Bản chất thật của bạn theo NẠP ÂM trụ NGÀY (không phải năm như Quỷ Cốc Tử)"
//  Mỗi người có 1 nạp âm ngày sinh → tính cách + xu hướng + tương hợp.
//  Nguồn: 三命通會 納音論, 渊海子平 納音取象.
// ============================================================================
import { ganZhiNayin } from './nayin.js';

// 30 nạp âm → tính cách + xu hướng + compatible/incompatible nạp âm
const NAYIN_PERSONALITY = {
  '海中金': { vi: 'Kim Trong Biển', nature: 'ẩn mình, kiên nhẫn, tích lũy',
    traits: 'Trầm tĩnh, tài năng ẩn sâu, khó bộc lộ ban đầu nhưng bền bỉ. Giống vàng dưới đáy biển — cần người khai thác. Thích sự ổn định, ghét thay đổi đột ngột.',
    strength: 'kiên nhẫn vượt bậc, tầm nhìn dài hạn', weakness: 'quá thụ động, dễ bỏ lỡ cơ hội',
    compat: '泉水/天河/大溪 (thủy tiết kim)', avoid: '霹雳火/山下火 (hỏa khắc)' },
  '炉中火': { vi: 'Lửa Trong Lò', nature: 'nhiệt huyết, quyết tâm, rèn luyện',
    traits: 'Nhiệt tình, có khả năng truyền lửa cho người khác. Cần «nhiên liệu» (tri thức, người hỗ trợ) liên tục. Mạnh mẽ nhưng dễ kiệt sức nếu không quản lý năng lượng.',
    strength: 'truyền cảm hứng, quyết đoán', weakness: 'dễ nóng, kiệt sức',
    compat: '大林木/松柏木 (mộc sinh hỏa)', avoid: '涧下水/天河水 (thủy khắc)' },
  '大林木': { vi: 'Gỗ Cây Lớn', nature: 'che chở, phát triển, uy tín',
    traits: 'Đại lượng, bao dung, thích bảo vệ người yếu. Phát triển chậm nhưng vững. Lãnh đạo bẩm sinh kiểu «cây cổ thụ».',
    strength: 'uy tín, chịu tải nặng', weakness: 'cứng nhắc, khó uốn nắn',
    compat: '覆灯火/山头火 (hỏa mộc tương sinh)', avoid: '剑锋金/石榴木 (kim khắc mộc)' },
  '路旁土': { vi: 'Đất Ven Đường', nature: 'phục vụ, kiên nhẫn, thực tế',
    traits: 'Thực tế, khiêm tốn, sẵn sàng «được đạp lên» để người khác đi. Thu hoạch chậm nhưng chắc. Cần được tưới tiêu (sự quan tâm).',
    strength: 'chịu đựng, đáng tin', weakness: 'tự hạ thấp bản thân',
    compat: '涧下水/泉中水 (thủy nhuận thổ)', avoid: '大林木/平地木 (mộc khắc thổ)' },
  '剑锋金': { vi: 'Kim Mũi Kiếm', nature: 'sắc bén, quyết đoán, trực diện',
    traits: 'Trực tiếp, dứt khoát, không sợ xung đột. Lưỡi kiếm sắc — cần mài giũa (học hỏi) + vỏ bọc (kiểm soát). Tài năng nhưng dễ «sát thương» người khác.',
    strength: 'quyết đoán, dũng cảm', weakness: 'thiếu tế nhị, dễ gây tổn thương',
    compat: '天河/大海 (thủy tẩy kiếm)', avoid: '霹雳火/山下火 (hỏa khắc)' },
  '山头火': { vi: 'Lửa Trên Núi', nature: 'rực rỡ, bùng phát, ngắn hạn',
    traits: 'Bùng nổ nhanh, thu hút sự chú ý, nhưng dễ tàn. Tài năng lớn trong thời gian ngắn. Cần kiểm soát, tránh «cháy rừng».',
    strength: 'thu hút, ấn tượng mạnh', weakness: 'không bền, dễ kiệt',
    compat: '大林木/松柏木', avoid: '天河水/大海水' },
  '涧下水': { vi: 'Nước Khe Suối', nature: 'nhẹ nhàng, liên tục, tinh tế',
    traits: 'Tinh tế, nhẫn nại, chảy liên tục không ngừng. Thanh khiết, thấu cảm. Dễ bị «chặn» — cần dòng chảy tự do.',
    strength: 'kiên nhẫn, thanh khiết, thấu cảm', weakness: 'dễ bị chặn, thiếu thế lực',
    compat: '路旁土/城头土 (thổ giữ nước)', avoid: '大林木/杨柳木' },
  '城头土': { vi: 'Đất Thành Lũy', nature: 'bảo vệ, vững chắc, cố chấp',
    traits: 'Vững vàng, bảo vệ, đáng tin. Giống tường thành — giữ gìn an toàn nhưng khó thay đổi. Cần mở cửa (cởi mở).',
    strength: 'bảo vệ, trách nhiệm', weakness: 'cố chấp, kháng thay đổi',
    compat: '涧下水/泉中水', avoid: '城头土 (tự cường), 大林木' },
  '白蜡金': { vi: 'Kim Sáp Trắng', nature: 'tinh xảo, quý giá, mong manh',
    traits: 'Đẹp, quý, tinh tế. Nhưng mỏng manh — dễ hỏng trong môi trường khắc (hỏa). Cần bảo quản cẩn thận.',
    strength: 'tinh xảo, thẩm mỹ cao', weakness: 'mỏng manh, dễ tổn thương',
    compat: '泉中水/涧下水', avoid: '山下火/山头火' },
  '杨柳木': { vi: 'Gỗ Liễu Yếu', nature: 'linh hoạt, duyên dáng, thích nghi',
    traits: 'Uyển chuyển, duyên dáng, dễ hòa nhập. Như cành liễu — uốn theo gió. Tốt cho giao tiếp, ngoại giao. Cần có lập trường.',
    strength: 'linh hoạt, duyên dáng', weakness: 'thiếu lập trường, dễ bị ảnh hưởng',
    compat: '涧下水/泉中水', avoid: '剑锋金/石榴木' },
  '泉中水': { vi: 'Nước Suối Trong', nature: 'trong vắt, nuôi dưỡng, tri thức',
    traits: 'Thanh khiết, liên tục, nuôi dưỡng vạn vật. Tâm thiện, trí sáng. Phù hợp giáo dục, y tế, tâm linh.',
    strength: 'thanh khiết, nuôi dưỡng', weakness: 'dễ bị ô nhiễm (môi trường xấu)',
    compat: '路旁土/屋上土', avoid: '大林木/松柏木' },
  '屋上土': { vi: 'Đất Trên Mái', nature: 'che chở, gia đình, trách nhiệm',
    traits: 'Che chở gia đình, trách nhiệm cao. Giống mái nhà — bảo vệ những người bên dưới. Cần mở rộng tầm nhìn ra ngoài.',
    strength: 'che chở, gia đình', weakness: 'hẹp tầm nhìn, quá nội bộ',
    compat: '泉中水/涧下水', avoid: '城头土 (tự cường), 大林木' },
  '霹雳火': { vi: 'Lửa Sấm Sét', nature: 'bùng nổ, bất ngờ, quyền uy đột ngột',
    traits: 'Năng lượng bùng nổ, sáng tạo đột phá. Khó dự đoán, mạnh mẽ. Cần kiểm soát, tránh phá hoại.',
    strength: 'đột phá, sáng tạo bất ngờ', weakness: 'khó kiểm soát, phá hoại',
    compat: '大林木/松柏木', avoid: '天河水/大海水' },
  '松柏木': { vi: 'Gỗ Tùng Bách', nature: 'kiên cường, trường tồn, trầm mặc',
    traits: 'Kiên cường, bất khuất, xanh four mùa. Chịu được gian nan. Phát triển chậm, thành đại khí muộn.',
    strength: 'kiên cường, trường tồn', weakness: 'cứng nhắc, chậm',
    compat: '覆灯火/山头火', avoid: '剑锋金/石榴木' },
  '长流水': { vi: 'Nước Sông Dài', nature: 'kiên nhẫn, liên tục, kết nối',
    traits: 'Chảy xa, kết nối nhiều nơi, tầm nhìn rộng. Kiên nhẫn, không ngừng. Cần giữ hướng, tránh phân tán.',
    strength: 'kiên nhẫn, kết nối', weakness: 'phân tán, thiếu tập trung',
    compat: '路旁土/壁上土', avoid: '大林木/杨柳木' },
  '沙中金': { vi: 'Kim Trong Cát', nature: 'rải rác, cần thu thập, đáng giá',
    traits: 'Tài năng rải rác, cần thu thập, gom góp. Vất vả sớm, thu hoạch muộn. Cần kiên nhẫn «sa li đào kim».',
    strength: 'đáng giá khi thu gom', weakness: 'rời rạc, cần thời gian dài',
    compat: '泉中水/涧下水', avoid: '山下火/山头火' },
  '山下火': { vi: 'Lửa Chân Núi', nature: 'ấm áp, ổn định, nuôi dưỡng',
    traits: 'Ấm áp, đều đặn, không bùng phát. Tốt cho chăm sóc, nuôi dưỡng. Bền nhưng thiếu sức ép.',
    strength: 'ổn định, ấm áp', weakness: 'thiếu đột phá',
    compat: '大林木/平地木', avoid: '天河水/大海水' },
  '平地木': { vi: 'Gỗ Đồng Bằng', nature: 'phổ thông, đa năng, thực tế',
    traits: 'Phổ thông nhưng hữu dụng, đa năng. Thực tế, dễ thích nghi. Không nổi bật nhưng đáng tin.',
    strength: 'đa năng, thực tế', weakness: 'thiếu nổi bật',
    compat: '山下火/覆灯火', avoid: '剑锋金/石榴木' },
  '壁上土': { vi: 'Đất Tường Vách', nature: 'cản trở, bảo vệ, ranh giới',
    traits: 'Tạo ranh giới, cản trở, bảo vệ. Giữ an toàn nhưng khó phá vỡ. Cần linh hoạt hơn.',
    strength: 'bảo vệ, ranh giới rõ', weakness: 'khó thay đổi, cứng nhắc',
    compat: '涧下水/泉中水', avoid: '城头土 (tự cường), 大林木' },
  '金箔金': { vi: 'Kim Lá Mỏng', nature: 'đẹp, trang trí, hào nhoáng',
    traits: 'Bề ngoài hào nhoáng, đẹp mắt. Nhưng mỏng, dễ hỏng. Cần nội dung thực bên trong.',
    strength: 'thẩm mỹ, trang trí', weakness: 'thiếu chiều sâu, dễ hỏng',
    compat: '泉中水/涧下水', avoid: '山下火/霹雳火' },
  '覆灯火': { vi: 'Lửa Đèn Phủ', nature: 'soi sáng, dẫn đường, tâm linh',
    traits: 'Soi sáng, hướng dẫn, tâm linh. Đèn dẫn đường trong bóng tối. Cần dưỡng năng lượng.',
    strength: 'soi sáng, dẫn đường, tâm linh', weakness: 'dễ kiệt, cần nhiên liệu',
    compat: '大林木/松柏木', avoid: '天河水/大海水' },
  '天河水': { vi: 'Nước Sông Trời', nature: 'rộng lớn, tinh thần, bao dung',
    traits: 'Rộng lớn, tinh thần cao, bao dung «hải nạp bách xuyên». Tầm nhìn vĩ mô, triết lý.',
    strength: 'bao dung, tầm nhìn vĩ mô', weakness: 'quá trừu tượng, thiếu thực tế',
    compat: '路旁土/壁上土', avoid: '山下火/霹雳火' },
  '大驿土': { vi: 'Đất Trạm Đường', nature: 'giao thiệp rộng, năng động, bận rộn',
    traits: 'Giao thiệp rộng, nhiều mối quan hệ, năng động. Cần chọn lọc, tránh quá tải.',
    strength: 'giao thiệp, năng động', weakness: 'phân tán, bận rộn vô ích',
    compat: '涧下水/泉中水', avoid: '大林木/平地木' },
  '钗钏金': { vi: 'Kim Trâm Cài', nature: 'tinh xảo, trang sức, khéo léo',
    traits: 'Tinh xảo, trang sức, khéo léo. Đẹp nhưng nhỏ — cần «đóng gói» tốt. Cận trọng sự hao mòn.',
    strength: 'tinh xảo, thẩm mỹ', weakness: 'nhỏ, dễ hao mòn',
    compat: '泉中水/涧下水', avoid: '山下火/山头火' },
  '桑柘木': { vi: 'Gỗ Dâu Tằm', nature: 'thực dụng, nuôi dưỡng, nền tảng',
    traits: 'Thực dụng, nuôi dưỡng (dâu nuôi tằm → tơ → lụa). Làm việc nền tảng để người khác phát triển.',
    strength: 'thực dụng, nuôi dưỡng', weakness: 'ít nhận được credit',
    compat: '山下火/覆灯火', avoid: '剑锋金/石榴木' },
  '大溪水': { vi: 'Nước Khe Lớn', nature: 'năng động, mạnh mẽ, hướng đi rõ',
    traits: 'Năng động, mạnh mẽ, hướng đi rõ. Chảy xiên, không ngừng. Cẩn trọng vội vàng.',
    strength: 'năng động, hướng rõ', weakness: 'vội vàng, thiếu kiên nhẫn',
    compat: '路旁土/城头土', avoid: '大林木/杨柳木' },
  '沙中土': { vi: 'Đất Trong Cát', nature: 'rời rạc, cần gom, xây dựng',
    traits: 'Rời rạc, cần gom góp, kỷ luật. Khó tập trung. Nên tìm nền tảng vững.',
    strength: 'linh hoạt, xây dựng được', weakness: 'rời rạc, thiếu kỷ luật',
    compat: '涧下水/泉中水', avoid: '大林木/平地木' },
  '天上火': { vi: 'Lửa Trên Trời', nature: 'rực rỡ, uy quyền, lãnh đạo',
    traits: 'Rực rỡ, uy quyền, chiếu sáng vạn vật. Lãnh đạo bẩm sinh. Cẩn trọng kiêu ngạo.',
    strength: 'uy quyền, lãnh đạo, sáng tạo', weakness: 'kiêu ngạo, thiêu đốt người khác',
    compat: '大林木/松柏木', avoid: '天河水/大海水' },
  '石榴木': { vi: 'Gỗ Lựu', nature: 'nhiều quả, phong phú, sáng tạo',
    traits: 'Nhiều quả, phong phú, sáng tạo. Đời sống phong phú, nhiều thành quả. Cần chọn lọc.',
    strength: 'phong phú, sáng tạo, nhiều thành quả', weakness: 'phân tán, khó chọn',
    compat: '山下火/覆灯火', avoid: '剑锋金/白蜡金' },
  '大海水': { vi: 'Nước Biển Lớn', nature: 'bao dung, sâu thẳm, bí ẩn',
    traits: 'Bao dung «hải nạp bách xuyên», sâu thẳm, bí ẩn. Chứa đựng mọi thứ, phong phú nhưng khó hiểu.',
    strength: 'sâu thẳm, bao dung', weakness: 'khó hiểu, bí ẩn quá',
    compat: '路旁土/城头土', avoid: '山下火/天上火' },
};

/**
 * @param {object} R — kết quả analyze() đầy đủ
 * @returns {{ dayJiaZi, nayin, vi, nature, traits, strength, weakness, compat, avoid, summary }}
 */
export function dayNayinPersonality(R) {
  const dayP = R.chart?.pillars?.day;
  const dayGz = dayP?.gan + dayP?.zhi;
  if (!dayGz) return null;
  // [loop 563 FIX BUG2] ưu tiên .nayin có sẵn (chart.js tính bằng lunar-javascript, chính xác)
  //   — trước đây tự ganZhiNayin (từng nhiễm BUG 1 alias lệch). Fallback chỉ khi thiếu.
  let nayin = dayP?.nayin || '';
  if (!nayin) { try { nayin = ganZhiNayin(dayGz); } catch (e) { return null; } }
  const info = NAYIN_PERSONALITY[nayin] || NAYIN_PERSONALITY[nayin.replace('砂', '沙')];
  if (!info) return { dayJiaZi: dayGz, nayin, vi: nayin, summary: `Nhật trụ ${dayGz} nạp âm ${nayin}.` };
  const summary = `Nhật trụ ${dayGz} — nạp âm ${nayin} (${info.vi}): ${info.nature}. ${info.traits.slice(0, 80)}`;
  return { dayJiaZi: dayGz, nayin, ...info, summary };
}
