// runes-kb.js — 24 Elder Futhark (grok research)
export const RUNES = {
  "Fehu": {
    "symbol": "ᚠ",
    "text": "Tài sản, giàu có và khởi đầu thịnh vượng; năng lượng nuôi dưỡng và sự lưu thông của của cải."
  },
  "Uruz": {
    "symbol": "ᚢ",
    "text": "Sức mạnh nguyên thủy, sức khỏe và ý chí; năng lượng hoang dã giúp vượt qua thử thách."
  },
  "Thurisaz": {
    "symbol": "ᚦ",
    "text": "Lực phá vỡ và bảo vệ sắc bén; cảnh báo nguy hiểm nhưng cũng là sức mạnh bảo hộ."
  },
  "Ansuz": {
    "symbol": "ᚨ",
    "text": "Trí tuệ, lời nói thiêng và cảm hứng từ thần linh; giao tiếp và thông điệp sâu sắc."
  },
  "Raidho": {
    "symbol": "ᚱ",
    "text": "Hành trình, nhịp sống và con đường đúng đắn; tiến bước có trật tự và mục đích."
  },
  "Kenaz": {
    "symbol": "ᚲ",
    "text": "Ngọn lửa tri thức, sáng tạo và soi sáng; biến ý tưởng thành kỹ năng, nghệ thuật."
  },
  "Gebo": {
    "symbol": "ᚷ",
    "text": "Quà tặng, cân bằng và quan hệ đôi bên cùng có lợi; sự kết nối thiêng liêng."
  },
  "Wunjo": {
    "symbol": "ᚹ",
    "text": "Niềm vui, hài hòa và thành tựu; trạng thái hạnh phúc khi mọi thứ thuận hòa."
  },
  "Hagalaz": {
    "symbol": "ᚺ",
    "text": "Bão tố, biến động bất ngờ; phá hủy cái cũ để mở đường cho thay đổi cần thiết."
  },
  "Nauthiz": {
    "symbol": "ᚾ",
    "text": "Nhu cầu, hạn chế và kiên nhẫn trong khó khăn; học bài học qua sự thiếu thốn."
  },
  "Isa": {
    "symbol": "ᛁ",
    "text": "Băng giá, tĩnh lặng và dừng lại; thời kỳ chờ đợi để nội tâm vững chắc."
  },
  "Jera": {
    "symbol": "ᛃ",
    "text": "Mùa màng, chu kỳ và phần thưởng sau lao động; kết quả đến đúng thời điểm."
  },
  "Eihwaz": {
    "symbol": "ᛇ",
    "text": "Cây thế giới, chuyển hóa và sức chịu đựng; cầu nối giữa chết và tái sinh."
  },
  "Perthro": {
    "symbol": "ᛈ",
    "text": "Bí ẩn, số mệnh và cái chưa biết; may rủi, tiềm năng ẩn giấu trong đời."
  },
  "Algiz": {
    "symbol": "ᛉ",
    "text": "Bảo vệ, kết nối tâm linh và cảnh giác; khiên hộ mệnh che chở linh hồn."
  },
  "Sowilo": {
    "symbol": "ᛊ",
    "text": "Mặt trời, chiến thắng và sức sống; ánh sáng dẫn đường tới thành công."
  },
  "Tiwaz": {
    "symbol": "ᛏ",
    "text": "Công lý, dũng khí và hy sinh vì lẽ phải; chiến đấu chính trực, trung thành với lý tưởng."
  },
  "Berkano": {
    "symbol": "ᛒ",
    "text": "Sinh sôi, nuôi dưỡng và khởi đầu mới; năng lượng nữ tính, chữa lành và tăng trưởng."
  },
  "Ehwaz": {
    "symbol": "ᛖ",
    "text": "Ngựa, hợp tác và tiến bộ tin cậy; sự đồng hành, thay đổi có kiểm soát."
  },
  "Mannaz": {
    "symbol": "ᛗ",
    "text": "Con người, bản ngã và cộng đồng; trí tuệ nhân loại, quan hệ xã hội và tự nhận thức."
  },
  "Laguz": {
    "symbol": "ᛚ",
    "text": "Nước, trực giác và dòng chảy cảm xúc; tiềm thức, giấc mơ và sự thanh tẩy."
  },
  "Ingwaz": {
    "symbol": "ᛜ",
    "text": "Hạt giống, tiềm năng và sự hoàn tất nội tại; tích tụ năng lượng trước khi bung nở."
  },
  "Dagaz": {
    "symbol": "ᛞ",
    "text": "Bình minh, thức tỉnh và bước ngoặt; ngày mới mang hy vọng và cân bằng sáng–tối."
  },
  "Othala": {
    "symbol": "ᛟ",
    "text": "Di sản, quê hương và tài sản tổ tiên; gốc rễ, truyền thống và sự thuộc về."
  }
};
export function drawRune(n = 1) {
  const all = Object.entries(RUNES); const out = []; const used = new Set();
  while (out.length < n && out.length < all.length) {
    const i = Math.floor(Math.random() * all.length);
    if (used.has(i)) continue; used.add(i);
    const [name, d] = all[i];
    out.push({ name, symbol: d.symbol, text: d.text, reversed: Math.random() < 0.5 });
  }
  return out;
}
