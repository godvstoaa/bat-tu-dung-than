# 04-18 · Mô phỏng quần thể, núm chỉnh, thẻ hành cho hoạt động, rủi ro khai thác

## 1. Mô phỏng quần thể (engine thật)

Mẫu: 3.000 lá số, năm 1950–2009, ngày/giờ ngẫu nhiên, seed 4242, `refYear` 2026, bản tham chiếu `buildMenhBan`.

### 1.1 Số Đặc Tính mỗi người chơi

| Phân vị | 0 (ít nhất) | 10 | 25 | 50 | 75 | 90 | 100 (nhiều nhất) |
|---|---|---|---|---|---|---|---|
| Số Đặc Tính | 1 | 6 | 7 | 9 | 11 | 12 | 18 |

Trung bình 9,06. Người ít nhất có 1 sao — 04-06 §5 bảo đảm khác biệt nằm ở **nội dung**, không ở sức mạnh (rổ R1 trần 40%).

### 1.2 Kiếp số

| Số sao hung trong lá số | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Tỉ lệ người chơi | 38,6% | 43,5% | 15,8% | 2,0% | < 0,1% |

Có ít nhất một kiếp số: **61,4%** (khớp ước lượng độc lập 61% ở 04-06 §5). Người có 3–4 kiếp: ải kiếp xếp cách nhau ít nhất một chương ở Hồi III để không dồn.

### 1.3 Hành Khuyết

| Số hành ở tầng 0 | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Tỉ lệ | 51,9% | 42,1% | 5,8% | 0,3% |

48,1% người chơi có ít nhất một hành Khuyết; **10,1%** có Dụng thần Khuyết (mẫu seed 777 cho 12,0% — dao động mẫu; dùng khoảng 10–12%).

### 1.4 Hệ số Nghịch Thiên trên quần thể

| Phân vị | 0 | 10 | 25 | 50 | 75 | 90 | 100 |
|---|---|---|---|---|---|---|---|
| NT | 1,00 | 1,00 | 1,04 | 1,13 | 1,21 | 1,28 | 1,50 |

15,7% người chơi có NT = 1,00 (Tiềm Lực ≥ 60); 7,5% có NT ≥ 1,30.

### 1.5 Thời gian tới cảnh giới 6 (chuẩn 40 công tu/ngày, không R1–R3)

| Phân vị quần thể | 0 | 10 | 25 | 50 | 75 | 90 | 100 |
|---|---|---|---|---|---|---|---|
| Ngày | 75 | 88 | 93 | 100 | 109 | 113 | 113 |

Theo Phẩm căn:

| Phẩm căn | Số lá | Nhanh nhất | Trung vị | Chậm nhất |
|---|---|---|---|---|
| PC1 Phàm Căn | 126 | 75 | 83 | 85 |
| PC2 Ngũ Linh Căn | 396 | 86 | 89 | 90 |
| PC3 Tứ Linh Căn | 544 | 91 | 93 | 96 |
| PC4 Tứ Linh Căn thuận | 667 | 97 | 99 | 102 |
| PC5 Tam Linh Căn | 661 | 103 | 106 | 110 |
| PC6 Tam Linh Căn thượng | 430 | 111 | 113 | 113 |
| PC7–PC9 | 176 | 113 | 113 | 113 |

Khoảng cách giữa người nhanh nhất và chậm nhất ở cùng nỗ lực: 38 ngày (~34%). Đủ để «lá số thấp có lợi thế tu» thành **cảm nhận được**, chưa đủ để người lá số cao thấy vô vọng (họ vẫn về đích, và dẫn trước trong ~10 ngày đầu nhờ Căn Cơ + Phúc Tiên Thiên).

### 1.6 Ảnh hưởng của hành vi so với Tiên Thiên

So sánh độ lớn các đòn bẩy lên tốc độ Đạo Hạnh:

| Đòn bẩy | Biên độ | Ai kiểm soát |
|---|---|---|
| NT (Tiên Thiên) | ×1,00 → ×1,50 | không ai (cố định) |
| Số công tu/ngày (trong trần) | 20 → 93 hiệu dụng (×4,6) | người chơi |
| R1 năng khiếu | ×1,00 → ×1,40 | lá số + Bổ Hành + cây kỹ năng (người chơi) |
| R2 thiên thời | ×1,00 → ×1,15 | chọn vùng/giờ/mùa (người chơi) + năm thật |
| R3 thử thách | ×1,00 → ×1,69 | chọn việc khó (người chơi) + vận |

Đòn bẩy người chơi kiểm soát lớn gấp nhiều lần đòn bẩy Tiên Thiên. Đây là bằng chứng định lượng cho trụ cột T2.

## 2. Núm chỉnh

Cột «Khóa» = cố định theo canon, không chỉnh. Các núm khác chỉnh được qua `MENHBAN_VERSION` (04-01 §7).

| Núm | Giá trị | Khóa | Khoảng an toàn | Tác động khi tăng |
|---|---|---|---|---|
| Hệ số Dụng trong Ngũ Hành Lực | 1,3 | **canon** | — | — |
| Hệ số Kỵ trong Ngũ Hành Lực | 0,8 | **canon** | — | — |
| Kỵ ×Đạo Hạnh | 1,3 | **canon** | — | — |
| Công thức NT | `1 + (60 − TL)/100`, kẹp 1,0–1,5 | **canon** | — | — |
| Căn Cơ | TL × 0,4, bậc 1–3 | **canon** | — | — |
| Ngưỡng cảnh giới | 0 / 100 / 400 / 1.000 / 2.200 / 4.500 | **canon** | — | — |
| Ngưỡng Phẩm căn | 28 / 36 / 43 / 50 / 58 / 66 / 73 / 80 / 86 | **canon** (= engine) | — | — |
| Ngưỡng tầng hành | 5 / 12 / 20 / 30 / 45 | | ±2 mỗi mốc | tầng cao hiếm hơn |
| % mỗi tầng | 4–8% / tầng tùy chỉ | | ±50% | R1 đầy nhanh hơn |
| Trần R1 | 40% | | 30–50% | lá số «nhiều sao» mạnh hơn |
| Trần R2 | 15% | | 10–20% | thiên thời quan trọng hơn |
| Trần R3 thử thách | 30% | | 20–40% | năm hạn hấp dẫn hơn |
| Cừu ×Đạo Hạnh | 1,15 | | 1,05–1,20 | — |
| Trần ngày công tu | 60 / 120 (×1 / ×0,5 / ×0,1) | | ±20 | người cày được nhiều hơn |
| NK tối đa | 100 + nền × 0,5 | | sàn 90–110, hệ số 0,3–0,7 | thể chất lá số rõ hơn |
| Hồi NK | 8/giờ + Sinh Cơ | | 6–12 | phiên chơi dài hơn |
| TM Ngũ Duy | 1 + score/500 | | /400–/1000 | trục mạnh học nhanh hơn |
| Bổ Khuyết | +0,25 | | 0,15–0,35 | trục yếu đổi chiều nhanh hơn |
| Ngộ | 60 XP | | 40–90 | cây đầy nhanh hơn |
| Trần Bổ Hành | 20 / hành, 3 / tuần | | 15–25; 2–5 | hành Khuyết lên tầng 3 nhanh hơn |
| Phúc gốc / tăng | 12·9·6·3·0·0 / 0·0,5·1·1,5·2,5·3 | | ±30% | — |
| Thân Lực tự lực / nhận trợ | +20·10·5·0·0 / ×1·1·1,25·1,5·1,5 | ×1,5 nhược là **canon** | tự lực ±10 | — |
| Ải tâm ma: tầng | 1 + floor(v/25) | | /20–/33 | ải dài hơn |
| Ải kiếp: thưởng | 120 công tu | | 80–200 | — |

Quy trình chỉnh: đổi núm → chạy lại 04-12 §7.3 (thống kê) và §7.4 (Hậu Thiên) → cập nhật bảng 04-08 §4 và 04-18 §1.5.

## 3. Thẻ hành cho hoạt động (đề xuất cho 09)

09 cấp công tu cho từng hoạt động. 04 cần mỗi hoạt động mang **ba thẻ** để các chỉ số tác động đúng chỗ: hành `A` (để biết Dụng/Kỵ/Cừu và Bổ Hành), trục Ngũ Duy (XP cây), và mã tác động tầng (04-03 §2.1).

| Hoạt động (canon §9.3 + phần này) | Hành `A` | Trục Ngũ Duy | Tác động tầng áp dụng | NK |
|---|---|---|---|---|
| Giải án khách (`cases.js`) | Kim | Trị đạo | K1 | 10 |
| Sảnh Cách Cục | Kim | Học đạo | K1 | 10 |
| Sảnh Tượng Pháp (Manh phái) | Thủy | Học đạo | S2 | 10 |
| Sảnh Tử Vi | Hỏa | Học đạo | — | 10 |
| Sảnh Điều Hậu | Thủy | Học đạo | — | 10 |
| Sảnh Thư Lâu | Thủy | Học đạo | S1 | 10 |
| Sảnh Hợp Hôn | Hỏa | Đồng đạo | H4 | 10 |
| Sảnh Dương Trạch | Thổ | Nghệ đạo | T2 | 10 |
| Sảnh Trạch Nhật | Mộc | Học đạo | — | 10 |
| Tĩnh tọa (thường) | Thổ | — (đạo thống) | T1, T4 | 0 (ngắn) / 20 (dài) |
| Tĩnh tọa ở rừng | Mộc | — | M4, T1 | 20 |
| Kết phù (ký tự hư cấu) | Hỏa | Nghệ đạo | K5 | 10 |
| Khoa cử (một vòng) | Kim | Học đạo | K3, S5 | 25 |
| Đặt tên / đạo hiệu (`naming`) | Mộc | Nghệ đạo | — | 0 |
| Sửa nhà (`zhai`, `xuankong`) | Thổ | Nghệ đạo | T2, T3 | 10 |
| Chọn ngày lễ (`zheri`) | Mộc | Học đạo | — | 0 |
| Thiền công án | Kim | — (đạo thống) | K2 | 10 |
| Mạn-đà-la cát | Thổ | Nghệ đạo | T1 | 10 |
| Vạch mặt Định Mệnh Hội | Kim | Trị đạo | K4 | 10 |
| Cứu người trúng yểm | Hỏa | Đồng đạo | — | 20 |
| Y dược (sắc thuốc, hư cấu) | Mộc | Nghệ đạo | M5 | 10 |
| Hái dược thảo | Mộc | Thương đạo | M2 | 8 |
| Chăm vườn nhà riêng | Mộc | — | M3 | 0 |
| Luyện đan | Hỏa | Nghệ đạo | H1 | 12 |
| Giữ đèn / thắp nhang | Hỏa | — | H2 | 0 |
| Lễ hội `EV-*` | Hỏa | Đồng đạo | H3 | 0 |
| Đọc cổ thư | Thủy | Học đạo | S1 | 0 (ngắn) |
| Du phương (đi bộ giữa vùng) | Thủy | — | S3 | 8 |
| Thư pháp, câu đối, đề biển | Kim | Nghệ đạo | — | 5 |
| Đàn, nhạc | Hỏa | Nghệ đạo | — | 5 |
| Họa sơn thủy | Thủy | Nghệ đạo | — | 5 |
| Buôn tuyến | Kim | Thương đạo | — | 8 |
| Bố thí | Thổ | Thương đạo | — | 0 |
| Xử tranh chấp NPC | Kim | Trị đạo | — | 10 |
| Đồng tu (tĩnh tọa đôi) | theo vùng | Đồng đạo | T1 | 20 |
| Dựng đạo tràng | Thổ | Nghệ đạo | T3 | 15 |
| Leo thần đạo | Thổ | — | T5 | 15 |
| Tĩnh tọa bên nước (hồ, suối, thác) | Thủy | — (đạo thống) | T1 | 20 |

Quy tắc chọn hành `A`: theo **bản chất việc** trong ngũ hành cổ (Mộc sinh trưởng, Hỏa lễ nghi và nhiệt, Thổ tĩnh và dựng, Kim xét đoán và cắt, Thủy trí và đi). Phân bố hiện tại (không tính «Đồng tu» lấy hành theo vùng): Mộc 7, Hỏa 8, Thổ 7, Kim 8, Thủy 7 hoạt động — mọi Kỵ hành đều có ≥ 7 loại việc thử thách, đáp ứng yêu cầu ở 04-08 §4.5 mục 5.

## 4. Rủi ro khai thác và cách chặn

| # | Khai thác | Mức | Cách chặn | Nơi |
|---|---|---|---|---|
| X1 | Khai lá số điểm thấp để có NT cao, cày rồi sửa về lá thật | cao | quy đổi Đạo Hạnh theo `dhKhongNT` khi Sửa bát tự | 04-11 §9.3 |
| X2 | Dò giờ sinh «đẹp» | thấp (điểm cao không cho tốc độ) | không hiện câu «giờ … cao hơn»; giới hạn Sửa bát tự | 04-11 §2.4 |
| X3 | Đứng mãi ở vùng Kỵ để ăn ×1,3 | chủ ý | không chặn — đó là thiết kế; trần ngày công tu giới hạn tổng | 04-08 §1.2 |
| X4 | Dùng tài khoản phụ thân nhược để ăn Tiết Tú / ×1,5 | trung bình | Tiết Tú chỉ tính với **sư đồ đã kết** (`STAT-ND-TY-05`), mỗi người tối đa 3 đồ đệ, đồ đệ phải chênh ≥ 1 cảnh giới; buff ×1,5 chỉ nhân buff của NPC sư phụ và bạn đã kết bạn ≥ 3 ngày | 04-03 §4 |
| X5 | Đồng tu duyên cày với cùng một người | thấp | +5% chỉ tính 2 giờ / ngày / cặp | 04-07 §5 |
| X6 | Cày Bổ Hành | thấp | trần 3 điểm / hành / tuần, trần tổng 20 | 04-03 §3 |
| X7 | Ép «Tự Tạo Quý Nhân» bằng giúp NPC lặp | thấp | tối đa 5 quý nhân tự tạo; mỗi NPC một lần | 04-06 §4.2 |
| X8 | Chỉnh đồng hồ máy để qua Lập Xuân sớm | thấp | Thời Vận không cho đủ lợi để đáng (R2 ≤ 10%); lấy `max` năm đã ghi | 04-11 §11 |
| X9 | So bì Tiên Thiên trên MMO | xã hội | cột Tiên Thiên ẩn mặc định; tập công khai tối thiểu | 04-12 §6 |
| X10 | Người chơi dùng điểm thấp để tự ti / bị trêu | an toàn | chế độ «Chỉ đường, không số»; câu dẫn; không hiện bách phân vị thấp đứng một mình | 04-13 |

## 5. Số liệu cần theo dõi sau phát hành (gửi 13 / 14)

Chỉ thu thập **ẩn danh, đã gộp** (không ngày sinh, không tứ trụ):

| Chỉ báo | Mục tiêu | Báo động khi |
|---|---|---|
| Trung vị cảnh giới theo nhóm Phẩm căn sau 30 / 90 ngày | nhóm PC1–PC2 ≥ nhóm PC7+ | nhóm PC7+ cao hơn PC1–PC2 quá 1 bậc |
| Tỉ lệ bật chế độ «Chỉ đường, không số» theo Phẩm căn | < 15% ở mọi nhóm | > 30% ở PC1–PC3 (chữ đang gây áp lực) |
| Tỉ lệ Sửa bát tự lần 2+ | < 5% | > 15% (dấu hiệu dò giờ) |
| Tỉ lệ người Nghịch Thiên rời game trước hết Hồi I | ≤ tỉ lệ chung | cao hơn tỉ lệ chung 20% (cảnh từ chối gây hụt hẫng) |
| Thời gian trung bình ở ngăn «Vì sao?» | > 20 giây | < 5 giây (người chơi không đọc) |
| Tỉ lệ hoàn thành Bổ Khuyết | > 40% người đã tới cảnh giới 3 | < 15% |
| Tỉ lệ ải kiếp bỏ dở | < 30% | > 50% |

## 6. Checklist nghiệm thu phần 04-18

- [ ] Mô phỏng §1 tái tạo được bằng seed 4242.
- [ ] Mọi núm khóa canon không nằm trong cấu hình chỉnh được.
- [ ] Mỗi hoạt động của 09 mang đủ ba thẻ (hành, trục, mã tác động).
- [ ] Mỗi hành có ≥ 7 loại việc.
- [ ] X1–X10 có kiểm thử hoặc chỉ báo theo dõi.
