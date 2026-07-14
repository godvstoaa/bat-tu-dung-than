// tarot-kb.js — 22 Major Arcana (grok research) + Minor framework
export const TAROT_MAJOR = {
  "Fool": {
    "num": 0,
    "upright": "Bước vào hành trình mới với lòng tin và sự ngây thơ trong sáng. Cửa cơ hội mở rộng nếu dám nhảy mà không sợ rủi ro.",
    "reversed": "Cảnh báo — liều lĩnh mù quáng, thiếu chuẩn bị hoặc bị lừa vì cả tin."
  },
  "Magician": {
    "num": 1,
    "upright": "Bạn có đủ kỹ năng, ý chí và công cụ để biến ý tưởng thành hiện thực. Tập trung năng lượng, hành động có chủ đích sẽ mang kết quả.",
    "reversed": "Cảnh báo — thao túng, lừa dối, hoặc năng lực bị phân tán không đi đến đâu."
  },
  "High Priestess": {
    "num": 2,
    "upright": "Lắng nghe trực giác và tri thức ẩn giấu sâu bên trong. Sự im lặng, chờ đợi và quan sát sẽ hé lộ sự thật chưa lộ diện.",
    "reversed": "Cảnh báo — bỏ qua trực giác, bí mật bị che giấu, hoặc bị cuốn theo ảo tưởng."
  },
  "Empress": {
    "num": 3,
    "upright": "Dồi dào, nuôi dưỡng và sáng tạo đang nở rộ quanh bạn. Hãy chăm sóc bản thân, mối quan hệ và những gì bạn đang vun trồng.",
    "reversed": "Cảnh báo — tắc nghẽn sáng tạo, phụ thuộc, hoặc thiếu tự chăm sóc."
  },
  "Emperor": {
    "num": 4,
    "upright": "Trật tự, kỷ luật và lãnh đạo vững chắc mang lại an toàn lâu dài. Xây dựng cấu trúc, đặt ranh giới và chịu trách nhiệm sẽ củng cố vị thế.",
    "reversed": "Cảnh báo — độc đoán, cứng nhắc, hoặc mất kiểm soát vì lạm dụng quyền lực."
  },
  "Hierophant": {
    "num": 5,
    "upright": "Học hỏi từ truyền thống, thầy cô hoặc hệ thống đã được kiểm chứng. Cam kết, nghi lễ và giá trị chung giúp bạn đứng vững.",
    "reversed": "Cảnh báo — mù quáng theo quy tắc, giáo điều, hoặc nổi loạn vô hướng."
  },
  "Lovers": {
    "num": 6,
    "upright": "Lựa chọn quan trọng dựa trên giá trị và sự hòa hợp. Tình yêu, quan hệ hoặc quyết định sống cần sự chân thành và đồng lòng.",
    "reversed": "Cảnh báo — bất hòa, lựa chọn sai, hoặc xung đột giá trị trong mối quan hệ."
  },
  "Chariot": {
    "num": 7,
    "upright": "Ý chí sắt đá và quyết tâm giúp bạn thắng nghịch cảnh. Kiểm soát cảm xúc, giữ hướng đi rõ ràng sẽ đưa bạn tới đích.",
    "reversed": "Cảnh báo — mất phương hướng, hung hăng thiếu kiểm soát, hoặc thất bại vì kiêu ngạo."
  },
  "Strength": {
    "num": 8,
    "upright": "Sức mạnh thật nằm ở lòng dũng cảm dịu dàng và sự kiên nhẫn. Chinh phục nỗi sợ bằng từ bi, không bằng bạo lực.",
    "reversed": "Cảnh báo — tự nghi, yếu ý chí, hoặc đàn áp cảm xúc thay vì làm chủ chúng."
  },
  "Hermit": {
    "num": 9,
    "upright": "Rút lui để suy ngẫm, tìm ánh sáng nội tâm và sự thật riêng. Thời gian một mình mang lại minh triết và chỉ dẫn rõ ràng.",
    "reversed": "Cảnh báo — cô lập quá mức, trốn tránh thế giới, hoặc từ chối lời khuyên cần thiết."
  },
  "Wheel of Fortune": {
    "num": 10,
    "upright": "Vận may xoay chuyển; chu kỳ mới đang mở ra. Chấp nhận thay đổi và nắm lấy cơ hội khi bánh xe quay thuận.",
    "reversed": "Cảnh báo — vận xấu tạm thời, kháng cự thay đổi, hoặc lặp lại chu kỳ lỗi cũ."
  },
  "Justice": {
    "num": 11,
    "upright": "Sự thật được cân bằng, quyết định công bằng đến đúng lúc. Hành động thẳng thắn mang lại kết quả xứng đáng.",
    "reversed": "Cảnh báo — thiên vị, phủ nhận trách nhiệm hoặc né tránh hậu quả."
  },
  "Hanged Man": {
    "num": 12,
    "upright": "Buông chấp giúp bạn nhìn rõ góc khuất. Tạm dừng đúng lúc mở ra lối thoát mới.",
    "reversed": "Cảnh báo — hy sinh vô ích hoặc trì hoãn quá lâu vì sợ đổi hướng."
  },
  "Death": {
    "num": 13,
    "upright": "Kết thúc cũ nhường chỗ cho chuyển hóa thật. Buông cái hết hạn để năng lượng sống lại.",
    "reversed": "Cảnh báo — bám víu quá khứ, chối bỏ thay đổi cần thiết."
  },
  "Temperance": {
    "num": 14,
    "upright": "Trung dung hài hòa mọi mâu thuẫn. Kiên nhẫn pha trộn đúng liều mang lại bình an bền.",
    "reversed": "Cảnh báo — thái quá, mất cân bằng hoặc nóng vội làm hỏng tiến trình."
  },
  "The Devil": {
    "num": 15,
    "upright": "Nhìn thẳng xiềng xích dục vọng và thói quen. Ý thức ràng buộc là bước đầu giải phóng.",
    "reversed": "Cảnh báo — tự lừa mình rằng đã thoát, trong khi vẫn bị lệ thuộc."
  },
  "The Tower": {
    "num": 16,
    "upright": "Sụp đổ đột ngột phá ảo tưởng để dựng nền vững. Sự thật phũ phàng mở đường xây lại đúng.",
    "reversed": "Cảnh báo — trì hoãn đổ vỡ, khủng hoảng kéo dài vì không dám đối diện."
  },
  "The Star": {
    "num": 17,
    "upright": "Hy vọng trong sáng dẫn lối sau đêm dài. Chữa lành nhẹ nhàng khôi phục niềm tin.",
    "reversed": "Cảnh báo — mất niềm tin, bi quan hoặc kỳ vọng ảo không dựa thực tế."
  },
  "The Moon": {
    "num": 18,
    "upright": "Trực giác thì thầm giữa mơ hồ và ảo ảnh. Lắng nghe cảm xúc sâu, đừng vội kết luận.",
    "reversed": "Cảnh báo — sợ hãi vô cớ, tự lừa dối hoặc bị cảm xúc che mờ lý trí."
  },
  "The Sun": {
    "num": 19,
    "upright": "Ánh sáng rực rỡ mang thành công và vui sống. Sự thật sáng tỏ, năng lượng dồi dào lan tỏa.",
    "reversed": "Cảnh báo — tự mãn quá mức, lạc quan giả tạo che giấu vấn đề."
  },
  "Judgement": {
    "num": 20,
    "upright": "Gọi thức tỉnh, đánh giá lại và tái sinh. Quyết định dứt khoát mở chương đời mới.",
    "reversed": "Cảnh báo — tự phán xét khắc nghiệt, chối bỏ lời gọi nội tâm."
  },
  "The World": {
    "num": 21,
    "upright": "Hoàn tất chu kỳ, hòa hợp và thành tựu trọn vẹn. Bạn đứng giữa trung tâm, sẵn sàng vòng mới.",
    "reversed": "Cảnh báo — dang dở, trì hoãn kết thúc hoặc sợ bước sang giai đoạn kế."
  }
};
export const TAROT_SUITS = {
  Wands: { vi: 'Gậy (Lửa)', element: 'Hỏa', theme: 'đam mê, hành động, sáng tạo, ý chí' },
  Cups: { vi: 'Chén (Nước)', element: 'Thủy', theme: 'cảm xúc, tình yêu, quan hệ, trực giác' },
  Swords: { vi: 'Kiếm (Khí)', element: 'Khí', theme: 'tư duy, giao tiếp, xung đột, sự thật' },
  Pentacles: { vi: 'Đồng (Thổ)', element: 'Thổ', theme: 'tiền bạc, công việc, cơ thể, vật chất' },
};
export const TAROT_COURT = { Page: 'học hỏi/thông điệp', Knight: 'hành động/sự kiện', Queen: 'nhân cách nội tâm', King: 'thẩm quyền/lãnh đạo' };
const POS = ['Quá khứ', 'Hiện tại', 'Tương lai', 'Bối cảnh', 'Lời khuyên'];
export function drawTarot(n = 3) {
  const all = Object.entries(TAROT_MAJOR); const out = []; const used = new Set();
  while (out.length < n && out.length < all.length) {
    const i = Math.floor(Math.random() * all.length);
    if (used.has(i)) continue; used.add(i);
    const [name, d] = all[i]; const rev = Math.random() < 0.5;
    out.push({ name, num: d.num, position: POS[out.length] || ('Lá ' + (out.length + 1)), reversed: rev, reading: rev ? d.reversed : d.upright });
  }
  return out;
}
export function tarotSummary(draw) { return draw.map(c => c.position + ': ' + c.name + ' (' + c.num + ')' + (c.reversed ? ' ℞ đảo' : '') + ' — ' + c.reading).join('\\n'); }
