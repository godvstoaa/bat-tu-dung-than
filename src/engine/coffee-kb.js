// coffee-kb.js — ký hiệu đọc bã cà phê/trà (grok research)
export const COFFEE_SYMBOLS = {
  "Tim": "Tình yêu, hạnh phúc lứa đôi hoặc tin vui từ người thương đang đến gần.",
  "Mắt": "Ai đó đang chú ý tới bạn; cũng là lời nhắc cần tỉnh táo, nhìn rõ sự thật.",
  "Chim": "Tin vui, tin nhắn, hoặc tin từ xa sắp tới.",
  "Rắn": "Có kẻ dối trá hoặc mối nguy ngầm; cần thận trọng với lời hứa.",
  "Cây": "Sự phát triển, sức khỏe ổn định, dự án lớn dần kết trái.",
  "Số": "Thường chỉ ngày, tháng, tuổi hoặc mốc thời gian quan trọng sắp tới.",
  "Chữ cái": "Gợi ý tên người, nơi chốn liên quan đến tin sắp nhận.",
  "Nhẫn": "Hôn nhân, cam kết, hoặc mối quan hệ tiến tới bước chính thức.",
  "Ngôi sao": "Hy vọng, may mắn, ước muốn có cơ hội thành hiện thực.",
  "Mặt trăng": "Cảm xúc thay đổi, chuyện thầm kín, hoặc chu kỳ sắp hoàn tất.",
  "Mặt trời": "Thành công, sức sống, niềm vui và sự công nhận.",
  "Ngôi nhà": "Gia đình, nơi ở, hoặc tin liên quan đến nhà cửa.",
  "Cửa": "Cơ hội mới mở ra, hoặc quyết định “bước qua ngưỡng” quan trọng.",
  "Chìa khóa": "Lời giải cho vấn đề, quyền lực, hoặc cánh cửa sắp mở.",
  "Tiền xu": "Tài lộc, thu nhập, hoặc cơ hội kiếm tiền sắp xuất hiện.",
  "Núi": "Trở ngại lớn cần vượt qua; kiên nhẫn sẽ thắng.",
  "Cầu": "Kết nối, hòa giải, hoặc chuyển giai đoạn cuộc sống.",
  "Thuyền": "Hành trình, du lịch, hoặc tin từ nước ngoài/xa xôi.",
  "Ngựa": "Sức mạnh, tự do, tiến bộ nhanh trong công việc.",
  "Chó": "Bạn bè trung thành, sự bảo vệ và tin cậy.",
  "Mèo": "Độc lập, bí ẩn, hoặc ai đó khéo léo đang quan sát bạn.",
  "Cá": "Tin tức bất ngờ, dòng chảy may mắn, hoặc sự dồi dào.",
  "Bướm": "Biến đổi đẹp đẽ, tái sinh sau giai đoạn khó khăn.",
  "Hoa": "Niềm vui, lời khen, tình cảm nở rộ.",
  "Trái tim vỡ": "Thất vọng tình cảm, cần chữa lành trước khi yêu lại.",
  "Vương miện": "Thành công, địa vị, được tôn trọng hoặc thăng tiến.",
  "Thập tự": "Thử thách đức tin/sức chịu đựng; cũng là bảo vệ tâm linh.",
  "Đường kẻ": "Hành trình phía trước; đường thẳng = suôn sẻ, đường gãy = trắc trở.",
  "Mây": "Ý nghĩ mơ hồ, lo âu tạm thời; rồi sẽ tan.",
  "Con dao": "Cắt đứt quan hệ/tình thế độc hại, hoặc xung đột sắc nhọn sắp tới."
};
const ADJ = ['rõ nét', 'mờ', 'lớn ở giữa', 'nằm gần miệng ly', 'nằm dưới đáy'];
export function coffeeRead(n = 3) {
  const all = Object.entries(COFFEE_SYMBOLS); const out = []; const used = new Set();
  while (out.length < n && out.length < all.length) {
    const i = Math.floor(Math.random() * all.length); if (used.has(i)) continue; used.add(i);
    const [sym, text] = all[i]; out.push({ symbol: sym, position: ADJ[out.length % ADJ.length], text });
  }
  return out;
}
