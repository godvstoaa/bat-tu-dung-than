# FEEDBACK LOG — <tên game>

AI ghi vào đây MỖI KHI người dùng không hài lòng, và đọc lại đầu mỗi phiên. Mới nhất ở trên cùng.

## Nhật ký

### 2026-11-18 — Tiên phủ: cây cối và nền đất
- **Nguyên văn**:
  - «Cây cối không phù hợp với không gian rộng như vậy phải có kích thước to lớn như những cây cổ thụ luôn mới phù hợp, đặc biệt ở 9 công trình, thực vật mỗi vùng cả địa hình sinh trưởng phải phù hợp với kiến trúc không giống nhau»
  - (thêm) «các mẫu sẵn trong meshy rất nhiều và đẹp cả nhân vật nữa tự kiểm nghiệm rồi dùng luôn đi đừng làm giảm độ chi tiết điểm ảnh mà làm vỡ công trình, tìm cách làm sao vẫn đẹp và mượt luôn»
- **Lần thứ**: 1 về cỡ cây và loài cây (trước đó lần 1 chê đồ hoạ cây đèn nói chung)
- **Chẩn đoán**:
  - Cây cao 4–10 m: 3 model bonsai / đào / liễu kéo giãn, trong khu 520 m có nhà cao 20–60 m.
  - 9 phủ dùng chung 3 model ấy nên trông như nhau.
  - Rải đều cách 4,2 m, kể cả sân chầu.
  - Một thảm cỏ cùng màu cho mọi phủ.
- **Đã đổi**:
  - Nghiên cứu cây thật của 9 nguyên mẫu: `docs/tienphu-nghiencuu/10-thuc-vat.md`.
  - Manifest có số đo: `docs/TIEN-PHU-THUCVAT-MANIFEST.md`.
  - 24 model cây Meshy CC0 chọn bằng mắt, 3 cấp chi tiết không kéo sọc texture (near có texture, mid / far màu đỉnh).
  - Cây thủ tục cho loài Meshy không có.
  - Trồng theo vai trò, mỗi phủ một chữ ký: hàng bách kênh Taj, đại lộ dẻ ngựa Versailles, hàng me đôi Thái, liễu và dương Lhasa, sồi đứng lẻ quanh lâu đài…
  - Sân chầu và trục nghi lễ để trống.
  - Màu nền đất theo phủ.
  - Công trình không bị hạ chi tiết.
- **Bằng chứng**: trước `output/tienphu-thucvat/before/`; sau `output/tienphu-thucvat/after/`; từng loài `output/cay-look/m-big.png`
- **Kết quả**: chưa phản hồi
- **Rút thành luật?**: có → cây trong cảnh rộng phải theo loài thật của nguyên mẫu, cỡ 75–100 % chiều cao thật; ưu tiên model Meshy CC0 đã xem bằng mắt

### 2026-11-18 — Tiên phủ: bản vẽ / hình từng công trình
- **Nguyên văn**: "mấy bản thiết kế tôi thấy quá thô sơ rồi không lột tả được công trình, hãy nghiên cứu kỹ lưỡng trước khi làm cấm làm ẩu"
- **Lần thứ**: 3 về chất lượng tiên phủ (1: đồ hoạ cây đèn nội thất xấu; 2: 9 phủ lặp một bố cục; 3: từng công trình thô sơ)
- **Chẩn đoán**: mọi nhà của 9 phủ sinh từ một hàm chung `archkit-style.styledBuilding` = hộp tường + hàng cửa sổ + mái cong / bằng / vòm chụp lên. Bản vẽ vẽ lại đúng cái hộp đó, nên "Đại Môn" Taj thành hộp cửa sổ xanh có vòm củ hành, "Ngân An Điện" thành hộp đỏ có mái vàng, không có đấu củng, gian, cấp mái.
- **Đã đổi (phương pháp mới, không chỉnh thông số)**: dừng commit; nghiên cứu nguyên mẫu thật từng công trình (số đo, cấu kiện nhận diện, nguồn) → `docs/tienphu-nghiencuu/`; sẽ thay bộ sinh chung bằng bộ dựng theo loại hình kiến trúc của từng phong cách, bản vẽ có đủ cấu kiện.
- **Bằng chứng**: sau — 155 tờ `docs/tienphu-banve/*/ct-*.png`; ảnh trong game `output/tienphu-eye/m-main.png`, `m-tower.png`, `m-tower2.png`; từ trên cao `output/tienphu-matbang/m-aerial.png`
- **Kết quả**: chưa phản hồi
- **Rút thành luật?**: có → mỗi công trình phải có nguyên mẫu + số đo có nguồn + danh sách cấu kiện nhận diện trước khi vẽ / dựng

### <ngày> — <asset / hạng mục>
- **Nguyên văn**: "<lời người dùng>"
- **Lần thứ**: <1 | 2 | 3> về vấn đề này
- **Chẩn đoán** (thấy gì trong ảnh): <…>
- **Đã đổi**: <thay đổi cụ thể; nếu là lần 2 thì phương pháp mới là gì>
- **Bằng chứng**: <đường dẫn ảnh trước / sau>
- **Kết quả**: <người dùng đồng ý | vẫn chưa | chưa phản hồi>
- **Rút thành luật?**: <không | có → đã thêm vào ART_BIBLE.md mục 9, luật số …>

## Từ điển riêng của dự án
Những cách nói của người dùng chưa có trong từ điển của skill, và cách sửa đã hiệu quả.

| Người dùng nói | Hoá ra nghĩa là | Cách sửa đã hiệu quả |
|---|---|---|
| | | |

## Sở thích đã biết
Điều người dùng thích hoặc ghét, kể cả khi chưa thành luật.

- <Ví dụ: thích ánh sáng chiều ấm; ghét bloom mạnh.>
