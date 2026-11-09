# 01 · Phần 19 — Nguyên tắc UX theo màn hình và thư viện lời văn giao diện

> Đặt **ý đồ** cho từng màn hình chính (mục đích, thông tin, hành động chính, trạng thái rỗng / lỗi, trụ cột chi phối, chống mẫu) và cấp **lời văn chuẩn** cho UI. Tài liệu 12 sẽ cấp mã `UI-xx` và dựng bố cục chi tiết; câu chữ dưới đây là bản chuẩn để tài liệu 12 dùng nguyên văn hoặc sửa có lý do.

## 1. Màn hình chính

### 1.1 Cổng — form ngày sinh

| Mục | Ý đồ |
|---|---|
| Mục đích | thu ngày giờ sinh trung thực, an tâm, nhanh |
| Thông tin | tên · ngày · tháng · năm · giờ (ô «không rõ giờ») · giới tính · dòng riêng tư |
| Hành động chính | «Dựng tứ trụ» |
| Tự điền | nếu có hồ sơ «Bản thân» từ app (`YC-03`) |
| Lỗi | ngày không hợp lệ → chỉ ra ô sai, không xóa ô khác |
| Trụ cột | T1 (dữ liệu thật), T6 (riêng tư) |
| Chống mẫu | bắt đăng nhập trước khi xem lá số; hỏi email ở đây; form nhiều màn |

### 1.2 Lễ lật trụ

| Mục | Ý đồ |
|---|---|
| Mục đích | khoảnh khắc «đây là mình» |
| Trình tự | 4 trụ lật (4 chuông) → thanh ngũ hành → Dụng / Hỷ / Kỵ → áo đổi màu → (nếu < 36: câu dẫn) → Mệnh Bàn |
| Hành động chính | không có nút trong lúc lật; sau đó «Xem Mệnh Bàn» |
| Bỏ qua | được (lần thứ hai trở đi) |
| Trụ cột | T1, T2 (`YC-01`) |
| Chống mẫu | hiện điểm to trước mọi thứ; màu đỏ cho bậc thấp |

### 1.3 Mệnh Bàn

| Mục | Ý đồ |
|---|---|
| Mục đích | hiểu nhân vật Tiên Thiên của mình |
| Bố cục | la bàn 4 vòng (phần 13 §6.3); danh sách thay thế cho đọc màn hình (`TN-10`) |
| Hành động chính | chạm vòng → thẻ chi tiết → «Vì sao?» |
| Tùy chọn | «Tên gốc trước» (`YC-16`); «ẩn con số khỏi màn chính» (`AL-10`) |
| Trạng thái đặc biệt | Tam Trụ: ô giờ phủ sương, nhãn «chưa định» ở chỉ số phụ thuộc giờ |
| Trụ cột | T1, T5 |
| Chống mẫu | so sánh với người khác trên màn này; nút mua bất cứ thứ gì |

### 1.4 Sổ (Sổ Mệnh / Sổ Tu Học)

| Mục | Ý đồ |
|---|---|
| Thẻ | Mệnh Bàn · Mệnh Đồ · Sổ Công Quá · Cảnh giới · Tủ đồ · Từ đã học · Lời người làm game |
| Hành động chính | mở thẻ gần nhất đã dùng |
| Trụ cột | T1, T2 |
| Chống mẫu | thẻ cửa hàng trong Sổ |

### 1.5 Mệnh Đồ

| Mục | Ý đồ |
|---|---|
| Mục đích | biết mình làm gì tiếp, vì sao |
| Bố cục | 6 nút theo thứ tự cố định; nút ưu tiên đậm; mỗi nút: chẩn đoán (`diagnosis[].d` nguyên văn) + 3–5 việc |
| Hành động chính | «Đi làm việc này» (đặt dấu dẫn đường) |
| Trạng thái rỗng | lá số tốt, ít chẩn đoán: «Lá số của bạn ít chỗ phải bù. Tầng cuối luôn mở: tích âm đức.» |
| iOS | không hiện nút của tính năng tắt (`YC-07`) |
| Trụ cột | T1 (nguyên văn engine), T2 (luôn có tầng mở) |

### 1.6 Sổ Công Quá

| Mục | Ý đồ |
|---|---|
| Mục đích | nhìn lại việc mình làm, như sổ công quá cách |
| Bố cục | trang kẻ ô theo ngày can chi; dòng thiện (dấu son), dòng ác (mực đen), cột ròng |
| Mốc | 300 / 600 / 1.000 (thang /10 so với Liễu Phàm), ghi rõ đã chia |
| Hành động | chạm dòng → xem việc gì, ở đâu, với ai |
| Sổ đời thực | thẻ riêng, mặc định tắt, không thưởng |
| Trụ cột | T1, T2, T6 |
| Chống mẫu | biểu đồ đỏ – xanh kiểu chứng khoán; so với người khác |

### 1.7 Cảnh giới

| Mục | Ý đồ |
|---|---|
| Thông tin | bậc hiện tại theo **đạo thống đang tu** (Đạo / Phật / Nho tên khác nhau); điểm cảnh giới = Tiên Thiên × 0,4 + Đạo Hạnh (bậc 1–3), chỉ Đạo Hạnh (bậc ≥ 4) |
| «Vì sao?» | hiện công thức bằng chữ và hệ số Nghịch Thiên |
| Trụ cột | T2 |

### 1.8 Tàng Y Các

| Mục | Ý đồ |
|---|---|
| Mục đích | mua / thử ngoại hình |
| Thông tin mỗi món | tên, ô, bậc hiếm, giá (Phúc Khí hoặc Ngọc + tiền thật tương ứng nếu là Ngọc nạp), mô tả, ảnh hưởng (nếu có, ghi «không ảnh hưởng Đạo Hạnh») |
| Hành động chính | «Thử 20 giây» (to) · «Mua» (cùng cỡ với «Không») |
| Mua bằng tiền thật | xác nhận hai bước, hiện trần chi tiêu tháng còn lại |
| iOS | ẩn mục nạp (đã có) |
| Trụ cột | T6, phần 16 §5 |
| Chống mẫu | xem §5.1 phần 16 |

### 1.9 Thiên Bảng

| Mục | Ý đồ |
|---|---|
| Cột | Đạo Hạnh (chính) · Tiên Thiên (nhạt; chỉ người công khai căn cốt) |
| Phạm vi | bạn bè · vùng · máy chủ · tuần · mùa (`PS-02`) |
| Bảng phụ | Sư phụ tận tâm · Người dẫn đường (`YC-11`) |
| Trụ cột | T2 |
| Chống mẫu | bảng chi tiêu; bảng Tiên Thiên làm mặc định |

### 1.10 Hội thoại và Thầy AI

| Mục | Ý đồ |
|---|---|
| Bố cục | dải giấy dưới màn; tên NPC trên ấn son; tối đa 3 câu / lượt |
| Thầy AI | ô gõ tự do + 3 gợi ý (`suggestFollowups`); nhãn nhỏ «Thầy trả lời bằng dữ liệu lá số của bạn» |
| Chờ | hoạt cảnh rót trà; > 6 s chuyển thoại kịch bản |
| Giới hạn ngày | hiện số lượt còn; hết lượt: «Hôm nay hỏi nhiều rồi. Mai thầy trả lời tiếp. Thoại thường vẫn mở.» |
| Trụ cột | T5, T6 |
| Chống mẫu | «Mua thêm lượt» bật ra khi hết lượt (chỉ ở cài đặt / Tàng Y Các) |

### 1.11 Bản đồ và đi nhanh

| Mục | Ý đồ |
|---|---|
| Bản đồ lớn | tranh cuộn; vùng chưa tới vẽ mờ; Côn Lôn vẽ mây |
| Trạm đi nhanh | xe / đò / hạc, mở khi tới tận nơi (`VD-T4-16`) |
| Đặt dấu | đặt dấu → cờ ngũ hành trong cảnh chỉ hướng |
| Trụ cột | T4 |

### 1.12 Cài đặt

| Nhóm | Mục |
|---|---|
| Hiển thị | cỡ chữ, mức chữ Hán, tên gốc trước, ẩn con số Tiên Thiên |
| Âm thanh | ba lớp âm, giọng đọc |
| Trợ năng | giảm chuyển động, chống say khi bay, mù màu, không thời gian, bấm thay giữ |
| Nội dung | «Nhẹ nhàng» cho cảnh u tối; **mục Âm tà** (tự nguyện bật, có xác nhận); **cho phép Tà Lộ** (vị thành niên: tắt mặc định) |
| Xã hội | công khai căn cốt (tắt mặc định), chat trong điện, nhận lời mời |
| Thông báo | từng loại tắt được; tối đa 1 / ngày |
| Chi tiêu | trần tháng (hạ ngay, nâng chờ 72 giờ) |
| Dữ liệu | xem dữ liệu gửi đi; tắt chia sẻ phân tích; xóa dữ liệu máy chủ |

### 1.13 Khủng hoảng

| Mục | Ý đồ |
|---|---|
| Kích hoạt | bộ phát hiện trong ô gõ tự do (Thầy AI, chat với NPC) |
| Bố cục | khung riêng không mang hình NPC; ba nút: gọi ngay · xem thêm · quay lại |
| Sau đó | cờ phiên: không nhắc điểm Tiên Thiên (`CB-T2-02`) |

## 2. Thư viện lời văn giao diện

> Giọng giao diện theo phần 7 §11: «bạn», hiện tại, ngắn, động từ + danh từ cho nút. Không chấm than. Không «Chúc mừng!!!».

### 2.1 Nút

| Ngữ cảnh | Chuẩn | Không dùng |
|---|---|---|
| Bắt đầu | «Đi tiếp» | «Bắt đầu ngay!» |
| Form ngày sinh | «Dựng tứ trụ» | «Xem bói» |
| Sau lễ lật trụ | «Xem Mệnh Bàn» | «Xem kết quả» |
| Mở lý do | «Vì sao?» | «Chi tiết» |
| Mệnh Đồ | «Đi làm việc này» | «Nhận nhiệm vụ» |
| Sổ Công Quá | «Ghi vào Sổ» | «Nhận điểm» |
| Tàng Y Các | «Thử 20 giây» · «Mua» · «Không» | «Sở hữu ngay» |
| Thoát | «Nghỉ đã» | «Thoát game» |
| Thầy AI | «Hỏi thầy» | «Chat với AI» |
| Đồng tu | «Ngồi cùng» | «Ghép đội» |
| Tà Lộ — nhận | «Nhận Âm Bài» | «Mở khóa sức mạnh» |
| Tà Lộ — từ chối | «Không» | «Bỏ qua cơ hội» |
| Quay về | «Quay về» | «Hủy Tà Lộ» |

### 2.2 Tiêu đề và nhãn

| Ngữ cảnh | Chuẩn |
|---|---|
| Mệnh Bàn lần đầu | «Mệnh Bàn của bạn. Chạm vào chỗ nào cũng có "Vì sao?".» |
| Tam Trụ | «Không rõ giờ sinh: Mệnh Bàn dựng trên ba trụ. Những chỗ phủ sương sẽ rõ khi bạn biết giờ.» |
| Ô giờ sương | «Chưa định» |
| Phẩm căn (dòng phụ) | «Tên gốc: {{gradeVi}}» |
| Hệ số | «×{{he_so}} Nghịch Thiên — lá số càng cần chăm, mỗi việc tu càng được nhiều» |
| Hợp mệnh | «Hợp mệnh: +10 % Phúc Khí khi giải án. Không ảnh hưởng Đạo Hạnh.» |
| Thời Vận | «Năm nay: năm {{nhan_thoi_van}}» — nhãn trong: «năm gió thuận», «năm bình», «năm nên giữ» |
| Kỵ thần | «Giờ / vùng hành Kỵ: khó hơn, tu được nhiều hơn (×1,3)» |
| Cảnh giới bậc 4 | «Từ bậc này, Tiên Thiên không còn tính. Chỉ còn việc bạn làm.» |
| Nợ Âm | «Nợ Âm: {{so}} — trả bằng việc thiện. Quay về được bất cứ lúc nào.» |
| Thiên Bảng | «Xếp theo Đạo Hạnh» |

### 2.3 Thông báo trong game

| Sự kiện | Chuẩn |
|---|---|
| Nhận Đạo Hạnh | «+{{n}} Đạo Hạnh» (kèm «×{{he_so}}» nếu > 1) |
| Ghi việc thiện | «Đã ghi: {{viec}} · +{{diem}}» |
| Ghi việc ác (người chơi chọn) | «Sổ đã ghi: {{viec}}. Sửa được.» |
| Lên cảnh giới | «Bạn đã tới bậc {{ten_bac}}.» |
| Mở trạm | «Từ giờ có đò tới {{vung}}.» |
| Lễ sắp tới | «Rằm tháng {{thang}}: dâng đèn ở {{noi}} lúc giờ {{gio}}.» |
| Khách mới ở Bàn Thầy | «Có khách chờ ở Bàn Thầy.» |
| Sổ đầy mốc | «Sổ Công Quá đã đủ {{moc}}. Vân Cốc muốn gặp bạn.» |

### 2.4 Thông báo đẩy (tối đa 1 / ngày, tắt từng loại)

| Loại | Chuẩn | Cấm |
|---|---|---|
| Giờ đẹp | «Chuông giờ Mão vừa đánh. Lên Sơn Môn?» | «Đừng bỏ lỡ!» |
| Ngày hợp Dụng | «Ngày {{can_chi}} — ngày {{hanh}}, hợp Dụng thần của bạn. Ghé quán uống trà?» | «Ngày xung tuổi bạn» |
| Lễ âm lịch | «Rằm hôm nay. Bút Tháp thả đèn lúc giờ Tuất.» | — |
| Bạn bè | «{{ban}} đang ngồi đồng tu ở Trà Thất.» | «{{ban}} đã vượt bạn!» |
| Trở lại sau lâu | (không gửi) | «Bạn đã bỏ tu 14 ngày» |

### 2.5 Trạng thái rỗng

| Màn | Chuẩn |
|---|---|
| Sổ Công Quá trống | «Chưa có dòng nào. Việc đầu tiên có thể nhỏ thôi.» |
| Tủ đồ chỉ có món miễn phí | «Bản Mệnh Y là áo của lá số bạn. Thêm áo thì ghé Tàng Y Các — không bắt buộc.» |
| Danh sách bạn trống | «Chưa có đạo hữu. Ngồi cùng ai đó ở Trà Thất là đủ để bắt đầu.» |
| Không có khách ở Bàn Thầy | «Hôm nay vắng khách. Thầy đang viết chữ.» |
| Mệnh Đồ ít chẩn đoán | «Lá số của bạn ít chỗ phải bù. Tầng cuối luôn mở: tích âm đức.» |

### 2.6 Lỗi

| Lỗi | Chuẩn |
|---|---|
| Mất mạng | «Mất kết nối. Thầy vẫn nói được bằng sổ — câu trả lời có thể ngắn hơn.» |
| AI chậm | «Thầy đang nghĩ…» (sau 6 s: chuyển thoại kịch bản, không báo lỗi) |
| Máy chủ MMO đầy | «Sơn Môn đông quá. Bạn đang ở một sân khác cùng thế giới.» |
| Lưu thất bại | «Chưa lưu được. Thử lại sau vài giây; tiến độ trên máy vẫn còn.» |
| Ngày sinh không hợp lệ | «Ngày này không có trong lịch. Xem lại ô {{o}}.» |
| Mua thất bại | «Chưa thanh toán. Bạn chưa bị trừ tiền.» |

### 2.7 Xác nhận

| Hành động | Chuẩn |
|---|---|
| Sửa ngày sinh trong 24 giờ đầu | «Sửa ngày sinh? Mệnh Bàn dựng lại, việc bạn đã làm vẫn giữ.» |
| Sửa ngày sinh sau 24 giờ | «Sau 24 giờ, sửa ngày sinh là lập Mệnh Bàn mới. Đạo Hạnh hiện có không mang theo. Lập mới?» |
| Bật mục Âm tà | «Mục này nói về tín ngưỡng trừ tà, hộ thân. Đây là văn hóa, không phải chẩn đoán. Bạn có thể tắt bất cứ lúc nào. Bật?» |
| Nhận Âm Bài | «Âm Bài: ×2 Hậu Thiên trong 7 ngày. Mỗi lần dùng sinh Nợ Âm, hiện công khai trong Sổ. Quay về được bất cứ lúc nào. Nhận?» |
| Mua bằng tiền thật | «{{mon}} · {{gia_tien_that}}. Trần tháng còn {{con_lai}}. Mua?» |
| Nâng trần chi tiêu | «Trần mới có hiệu lực sau 72 giờ. Đặt?» |
| Công khai căn cốt | «Người khác sẽ thấy Tiềm Lực và Phẩm căn của bạn (không thấy ngày sinh). Công khai?» |

### 2.8 Hướng dẫn nhẹ (lần đầu)

| Ngữ cảnh | Chuẩn |
|---|---|
| Đi lại | «Chạm vào đất để đi.» |
| Camera | «Kéo để nhìn quanh. Kéo lên để ngước nhìn trời.» |
| Trạm | «Chạm vào người, vật có viền sáng để tương tác.» |
| Bay (khi mở) | «Kiếm đã nhận bạn. Giữ ▲ để bay lên.» |
| Đất thánh | «Đất thánh — xin đi bộ.» |
| Trà Thất | «Ngồi đây bao lâu cũng được.» |

## 3. Luật kiểm lời văn giao diện

- [ ] Nút: động từ + danh từ, ≤ 3 từ khi có thể.
- [ ] Không chấm than; không «Chúc mừng».
- [ ] Không cụm cấm phần 8 §2 (đặc biệt §2.3 sợ hãi, §2.4 bán hàng).
- [ ] Mỗi con số có cách xem «Vì sao?» gần nó.
- [ ] Mọi giá bằng Ngọc nạp có tiền thật tương ứng.
- [ ] Bản iOS: không chuỗi «xin xăm», «giải hạn», «vận hạn của bạn», «đoán».
