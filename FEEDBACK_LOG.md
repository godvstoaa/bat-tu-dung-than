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

### 2026-11-18 — Nhân vật: động tác lặp
- **Nguyên văn**: "có hàng trăm ngàn động tác trên meshy đó ko chỉ có mỗi đi bộ đâu, đừng có lặp lại"
- **Lần thứ**: 1 về động tác nhân vật
- **Chẩn đoán**: mọi nhân vật dùng chung 6 clip cố định (đứng / đi / chạy / ngồi / cúi / vẫy), cùng nhịp; phố toàn 4 khuôn áo đỏ / ngọc.
- **Đã đổi**: gom động tác do tác giả các bài đăng Meshy cộng đồng gắn sẵn thành thư viện 16 clip, ghép sang mọi rig theo không gian
  thế giới (`tools/nhanvat.js`); mỗi bản sao bốc kiểu đi riêng, đổi kiểu đứng 6–14 s, lệch pha, NPC chen cử chỉ (characters.js);
  thêm 3 NPC mới + nam / nữ mới. Manifest `docs/NHAN-VAT-MESHY-MANIFEST.md`.
- **Bằng chứng**: trước / sau `output/nhanvat/perf/so-sanh-vong.jpg`; mọi clip `output/nhanvat/test/*-clips.jpg`
- **Kết quả**: chưa phản hồi
- **Rút thành luật?**: có → nhân vật đứng gần nhau không được cùng động tác / cùng pha; ưu tiên động tác có sẵn trong model cộng đồng (miễn phí)

### 2026-11-19 — Công trình thành: nhà bé, mờ, cổng lọt thỏm, cây dựng ẩu
- **Nguyên văn**: "Rất nhiều nhà có kích thước bé tẹo ko hợp lý tra lại toàn bộ đi" · "Rất nhiều công trình còn mờ và xấu, bỏ đi làm lại hết" ·
  "Phần mở đầu có cái cổng … lọt thỏm giữa cái tường thành … tôi yêu cầu nét căng mà vẫn đẹp nhẹ … rà làm lại tất, toàn bộ cây cỏ trong bản đồ những cây nào dựng ẩu xấu cũng thay thế hết"
- **Lần thứ**: 2 về chất lượng công trình thành (lần 1: «phố chưa ra phố phường» — THANH-MANIFEST v5.1); 1 về cỡ nhà; 2 về cây (lần 1 ở tiên phủ)
- **Chẩn đoán** (đo, `scripts/scan-scene.mjs`): Meshy 1 texture 1024 kéo cả công trình → 7 px/m (paifang), 36 (sơn môn), 20–50 (nhà);
  sơn môn 14 × 8,2 m kẹp giữa tường 7,4 m, hở 4 m mỗi bên; nhà đá chen 2,9 m tới nóc; tường / tháp / cây cầu–nón khối thô.
- **Đã đổi (phương pháp mới)**: bỏ Meshy cho công trình → dựng thủ tục bằng bộ kiến trúc Trung Hoa (tienphu/arch/cn.js) + texture lặp theo mét
  (7 vật liệu, 1,9 MB, 254–1022 px/m); nhà cao theo NGƯỜI (cửa 2,35 m) không theo bề ngang lô; cây → model Meshy CC0 lib_tp_*.
  Manifest `docs/CONG-TRINH-LAM-LAI-MANIFEST.md`.
- **Bằng chứng**: `output/lamlai/so-sanh-cong.jpg`, `output/lamlai/so-sanh-san.jpg` (trước / sau cùng góc), `output/lamlai/v1/sheet3–14.jpg`
- **Đợt sau (người dùng chọn «Làm tiếp sân sơn môn»)**: Chính Đường, điện phụ, chung / cổ lâu, 4 bảo tháp, đình Tàng Y dựng thủ tục; nền / lan can sang vật liệu lặp; sửa 700 tấm cây dồn ở bệ thầy
- **Đợt «Đồ nhỏ trong sân»**: đèn đá, cột cờ dựng lại; bảng vật liệu chung chiếu ba mặt theo mét
- **Đợt «Làm Ngoại Thành»**: tường 34 m vật liệu gạch lặp, 8 lầu cổng + 64 lầu canh + 8 giác lâu thủ tục (ảnh `output/lamlai/so-sanh-ngoai-thanh.jpg`)
- **Đợt «Vệt bẩn mặt tường»** (2026-11-20): tường 34 m một màu → shader phong hoá theo toạ độ thế giới (vệt nước dưới mũ / khe răng cưa, muối trắng, rêu chân tường, mảng vá, loang) + 290 máng thoát nước mặt trong kiểu Tây An (`docs/VET-BAN-TUONG-MANIFEST.md`, ảnh `output/vetban/so-sanh-vet-ban.jpg`)
- **Đợt «Thủy môn»** (2026-11-20): 3 chỗ sông xuyên tường 34 m (thân tường treo phẳng trên mặt nước) → thủy môn 3 tầng vòm kiểu Đông Thủy Quan Nam Kinh + áp quan Bàn Môn, trụ mũi rẽ nước có va chạm thuyền (`docs/THUY-MON-MANIFEST.md`, ảnh `output/thuymon/so-sanh-thuy-mon.jpg`)
- **Đợt «Làm biệt phủ»** (2026-11-20): 16 phủ + 240 biệt thự bỏ hộp / nón / texture canvas (archkit-style) → bộ kiến trúc tiên phủ theo 8 họ phong cách dựng đúng khuôn lô (`docs/BIET-PHU-MANIFEST.md`); cây → lib_tp_* cỡ vườn; ao viền đá xếp + đá nhiễu; tường rào vật liệu lặp + mũ ngói; biệt thự 3 biến thể
- **Kết quả**: chưa phản hồi
- **Rút thành luật?**: có → công trình không dùng texture duy nhất phủ cả nhà; mật độ texel gần ≥ 256 px/m; chiều cao nhà theo người (cửa ≥ 2,1 m), không phóng theo lô

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
