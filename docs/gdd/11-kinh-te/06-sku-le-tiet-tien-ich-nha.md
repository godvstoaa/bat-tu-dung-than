# 11 · Phần 06 — Món lễ tiết, món không bán, gói, tiện ích, nhà riêng

> Phần này gồm năm nhóm SKU còn lại ngoài món vùng và món mùa:
>
> - `SKU-F-*` món lễ tiết theo lịch âm (30 món);
> - `SKU-A-*` danh mục **không bán** — món tu, món thành tựu (27 mục), để người duyệt và người làm dữ liệu biết chúng tồn tại và không bao giờ vào cửa hàng;
> - `SKU-B-*` gói (12 gói);
> - `SKU-U-*` tiện ích (8 SKU);
> - `SKU-H-*` nội thất nhà riêng (44 món).

---

## 1. Lịch lễ dùng trong kinh tế

Ngày âm lịch tính bằng `lunar-javascript` (đã có trong dự án). Sự kiện lễ (`EV-*`) do tài liệu 10 cấp mã và kịch bản; phần này chỉ cấp SKU, quà và thời gian bán.

| Lễ | Ngày | Bán món lễ | Quà miễn phí (Ngọc) | Ghi chú |
|---|---|---|---|---|
| Lập Xuân / Tết Nguyên Đán | Lập Xuân (≈ 4/2 dương) và mùng 1 Tết | từ 23 tháng Chạp tới mùng 10 | 200 | mở `SEASON-xx` mới; đổi niên chủ Thái Tuế |
| Thượng Nguyên | 15/1 âm | 13–17/1 | 50 | dâng đèn chung |
| Hàn Thực | 3/3 âm | 1–5/3 | — | bánh trôi bánh chay |
| Đoan Ngọ | 5/5 âm | 1–8/5 | — | chỉ ngũ sắc, đua thuyền |
| Thất Tịch | 7/7 âm | 5–9/7 | — | Ngưu Lang Chức Nữ, cầu Ô Thước |
| Vu Lan / Trung Nguyên | 15/7 âm | **không bán món lễ** | 80 | lễ báo hiếu và xá tội vong nhân; chỉ quà tặng |
| Trung Thu | 15/8 âm | 8–18/8 | — | đèn ông sao, rước đèn |
| Trùng Cửu | 9/9 âm | 6–12/9 | 50 | hoa cúc, lên cao |
| Hạ Nguyên | 15/10 âm | **không bán** | 50 | lễ ở Cùng Thông Hồ |
| Đông Chí | tiết Đông Chí | Đông Chí ± 3 ngày | — | chè, lò sưởi |
| Ông Công Ông Táo | 23/12 âm | 20–23/12 | — | đèn cá chép (không bán «cá chép cưỡi lên trời») |
| Phật đản | 15/4 âm | **không bán** | 50 | hoa sen giấy miễn phí cho mọi người |
| Tết Thầy | 20/11 dương | **không bán** | 50 | — |
| Sinh nhật Huyền Quán | ngày ra mắt | ± 3 ngày | 100 | — |

**Ba lễ không bán gì** (Vu Lan, Hạ Nguyên, Phật đản) và Tết Thầy: lễ có tính tâm linh hoặc tri ân sâu, game chỉ tặng. Đây là quy tắc §4.9 phần 01 áp vào lịch.

---

## 2. Món lễ tiết `SKU-F-*`

Mọi món lễ bán **mỗi năm một lần** vào lễ đó (phần 03 §7). Món lễ không có hiệu ứng gameplay, không gắn công đức của hoạt động lễ.

### 2.1 Tết Nguyên Đán (`tet`)

| SKU | Tên | Ô | Bậc | Giá | Ghi chú |
|---|---|---|---|---|---|
| `SKU-F-tet-01` | Áo Dài Gấm Đỏ Du Xuân | robe | Huyền | 160 Ngọc | áo dài gấm hoa văn chữ thọ cách điệu (không chữ thật của kinh) |
| `SKU-F-tet-02` | Khăn Đóng Xuân | head | Linh | 200 PK | khăn đóng đen ánh lụa |
| `SKU-F-tet-03` | Cành Đào Nhật Tân | hand | Huyền | 130 Ngọc | cành đào cầm tay, cánh rơi chậm |
| `SKU-F-tet-04` | Cành Mai Phương Nam | hand | Huyền | 130 Ngọc | bản mai vàng cho người thích Tết miền Nam |
| `SKU-F-tet-05` | Pháo Giấy Đỏ | trail | Huyền | 120 Ngọc | xác giấy đỏ rơi (không âm thanh nổ — tôn trọng người nhạy âm) |
| `SKU-F-tet-06` | Câu Đối Đỏ | frame | Linh | 150 PK | viền đôi câu đối chữ hư cấu (không chữ thật để tránh câu sai nghĩa) |

### 2.2 Thượng Nguyên (`thuongnguyen`)

| SKU | Tên | Ô | Bậc | Giá | Ghi chú |
|---|---|---|---|---|---|
| `SKU-F-thuongnguyen-01` | Đèn Nguyên Tiêu | hand | Huyền | 130 Ngọc | đèn lồng tròn đêm rằm |
| `SKU-F-thuongnguyen-02` | Trăng Rằm Giêng | aura | Huyền | 150 Ngọc | vầng trăng tròn mờ dưới chân — **không** vẽ thành vầng hào quang sau đầu |

### 2.3 Hàn Thực (`hanthuc`)

| SKU | Tên | Ô | Bậc | Giá | Ghi chú |
|---|---|---|---|---|---|
| `SKU-F-hanthuc-01` | Mẹt Bánh Trôi | hand | Phàm | 90 PK | mẹt tre với bánh trôi bánh chay |
| `SKU-F-hanthuc-02` | Khung Hoa Gạo | frame | Linh | 150 PK | hoa gạo tháng ba |

### 2.4 Đoan Ngọ (`doanngo`)

| SKU | Tên | Ô | Bậc | Giá | Ghi chú |
|---|---|---|---|---|---|
| `SKU-F-doanngo-01` | Chỉ Ngũ Sắc | head | Linh | 200 PK | dây ngũ sắc buộc tóc (phong tục, không hứa trừ bệnh — mô tả: «phong tục ngày Đoan Ngọ») |
| `SKU-F-doanngo-02` | Thuyền Rồng Đua | mount | Tiên | 340 Ngọc | thuyền đua mũi rồng |
| `SKU-F-doanngo-03` | Lá Ngải Bay | trail | Huyền | 120 Ngọc | lá ngải xanh |

### 2.5 Thất Tịch (`thattich`)

| SKU | Tên | Ô | Bậc | Giá | Ghi chú |
|---|---|---|---|---|---|
| `SKU-F-thattich-01` | Cầu Ô Thước | mount | Tiên | 340 Ngọc | đàn quạ đen kết cầu dưới chân |
| `SKU-F-thattich-02` | Mưa Ngâu | aura | Huyền | 150 Ngọc | mưa bụi tháng bảy |
| `SKU-F-thattich-03` | Ngân Hà Đôi Bờ | frame | Huyền | 90 Ngọc | — |
| `SKU-F-thattich-04` | Song Hành | trail | Huyền | 120 Ngọc | **tặng được**: người mua chọn một bạn, cả hai cùng nhận một vệt bước giống nhau (tính 1 món tặng trong trần 5 / tuần) |

### 2.6 Vu Lan — chỉ quà, không bán (`vulan`)

| SKU | Tên | Ô | Giá | Ghi chú |
|---|---|---|---|---|
| `SKU-F-vulan-01` | Bông Hồng Cài Áo | head (cài ngực) | **miễn phí cho mọi người** | người chơi **tự chọn** hồng đỏ hoặc hồng trắng; không hỏi, không suy từ dữ liệu; có thể tắt hiển thị |

Lý do không bán: màu bông hồng cài áo Vu Lan cho biết người cài còn mẹ hay không. Bán nó là thương mại hóa nỗi mất mát.

### 2.7 Trung Thu (`trungthu`)

| SKU | Tên | Ô | Bậc | Giá | Ghi chú |
|---|---|---|---|---|---|
| `SKU-F-trungthu-01` | Đèn Ông Sao | hand | Linh | 210 PK | đèn năm cánh giấy bóng kính |
| `SKU-F-trungthu-02` | Đèn Kéo Quân | back | Tiên | 240 Ngọc | đèn kéo quân xoay bóng hình người cưỡi ngựa |
| `SKU-F-trungthu-03` | Mặt Nạ Giấy Bồi | head | Huyền | 120 Ngọc | mặt nạ ông Địa, Tôn Ngộ Không giấy bồi đẩy lên trán (không che mặt — giữ biểu cảm) |
| `SKU-F-trungthu-04` | Thỏ Ngọc | trail | Huyền | 120 Ngọc | thỏ ánh trăng nhảy theo bước |
| `SKU-F-trungthu-05` | Trăng Rước Đèn | frame | Linh | 150 PK | — |

### 2.8 Trùng Cửu (`trungcuu`)

| SKU | Tên | Ô | Bậc | Giá | Ghi chú |
|---|---|---|---|---|---|
| `SKU-F-trungcuu-01` | Cúc Vàng Cài Tóc | head | Linh | 200 PK | phong tục cài cúc ngày 9/9 |
| `SKU-F-trungcuu-02` | Thù Du | trail | Huyền | 120 Ngọc | cánh thù du đỏ |

### 2.9 Đông Chí và Ông Táo (`dongchi`, `ongtao`)

| SKU | Tên | Ô | Bậc | Giá | Ghi chú |
|---|---|---|---|---|---|
| `SKU-F-dongchi-01` | Áo Bông Đông Chí | robe | Linh | 260 PK | áo bông chần |
| `SKU-F-dongchi-02` | Lò Sưởi Tay | hand | Huyền | 130 Ngọc | lò sưởi đồng cầm tay |
| `SKU-F-ongtao-01` | Đèn Cá Chép | hand | Huyền | 130 Ngọc | đèn lồng hình cá chép — **không** có ngự vật «cá chép cưỡi về trời» (phương tiện của Táo Quân trong tín ngưỡng) |

### 2.10 Sinh nhật Huyền Quán (`sinhnhat`)

| SKU | Tên | Ô | Bậc | Giá | Ghi chú |
|---|---|---|---|---|---|
| `SKU-F-sinhnhat-01` | Khung Năm Thứ N | frame | Linh | **miễn phí** | khung có số năm quán mở; ai đăng nhập trong tuần sinh nhật đều nhận; mỗi năm một khung |
| `SKU-F-sinhnhat-02` | Trà Bánh Quán | hand | Huyền | 130 Ngọc | khay trà nhỏ |

**Tổng món lễ: 30** — 28 món bán (9 giá Phúc Khí, 19 giá Ngọc) và 2 món miễn phí cho mọi người (`vulan-01`, `sinhnhat-01`).

---

## 3. Danh mục không bán `SKU-A-*`

Những món này **có mã** để theo dõi trong dữ liệu và analytics, nhưng trường giá luôn rỗng và lint (phần 04 §9) kiểm: món `SKU-A-*` không bao giờ có `price`, không bao giờ có `giftable: true`.

| SKU | Món | Ô / loại | Nhận bằng | Tài liệu nguồn |
|---|---|---|---|---|
| `SKU-A-01` | Pháp Y Thụ Lục (theo bậc lục) | robe | thụ lục ở Long Hổ | 05 |
| `SKU-A-02` | Áo Tràng Lam | robe | quy y ở Bút Tháp | 05 |
| `SKU-A-03` | Áo Tràng Nâu | robe | quy y ở Yên Tử | 05 |
| `SKU-A-04` | Đạo Bào Môn Nhân Võ Đang | robe | nhập môn Võ Đang | 05, 10 |
| `SKU-A-05` | Đạo Bào Toàn Chân | robe | nhập môn Chung Nam | 05, 10 |
| `SKU-A-06` | Áo Mão Vinh Quy | robe + head | đỗ đình thí | 09 |
| `SKU-A-07` | Chuỗi Hạt 108 | hand | đủ thời khóa trì niệm | 09 |
| `SKU-A-08` | Mõ Gỗ Mít | hand | làm việc ở chùa | 09 |
| `SKU-A-09` | Kiếm Gỗ Đào Khai Quang | back | chuỗi Mao Sơn | 05 |
| `SKU-A-10` | Mũ Có Đạo Hiệu | head | lễ nhập đạo, thầy ban | 05 |
| `SKU-A-11` | Danh hiệu cảnh giới 2–6 (theo đạo) | danh hiệu | đạt cảnh giới | 04, 09 |
| `SKU-A-12` | Khung Liễu Phàm 300 công | frame | Sổ Công Quá 300 | 05 |
| `SKU-A-13` | Khung Liễu Phàm 600 công | frame | Sổ Công Quá 600 | 05 |
| `SKU-A-14` | Khung Liễu Phàm 1.000 công | frame | Sổ Công Quá 1.000 | 05 |
| `SKU-A-15` | Danh hiệu và khung Hồi Đầu | frame | trả xong Nợ Âm | 05 |
| `SKU-A-16` | Huy hiệu Quy Nhất | huy hiệu | đủ điều kiện Quy nhất | 05 |
| `SKU-A-17` | Khung Côn Lôn Khách | frame | vào Côn Lôn | 03 |
| `SKU-A-18` | Khung Trùng Tu | frame | góp vào mục tiêu trùng tu hoàn thành (phần 02 §4.8) | 11 |
| `SKU-A-19` | Khung Án Cổ Toàn Thông | frame | giải đủ 38 Án Cổ ≥ 60% | 11 |
| `SKU-A-20` | Khung Thập Bát Sảnh | frame | thông thạo ≥ 80% (`deskMastery`) cả 8 sảnh | 11 |
| `SKU-A-21` | Hào Quang Đồng Tu | aura | thiền cùng người khác 100 buổi | 10 |
| `SKU-A-22` | Khung Sư Đồ | frame | có đệ tử xong Mệnh Đồ | 10 |
| `SKU-A-23` | Khung Kỳ Cựu chương (theo `SEASON-xx`) | frame | đạt bậc 30 của một chương Đạo Lộ, nhánh Thanh Lộ (miễn phí) | 11 |
| `SKU-A-24` | Danh hiệu «Định Mệnh Hội · Kẻ Vạch Mặt» | danh hiệu | xong chuỗi vạch mặt | 03 |
| `SKU-A-25` | Áo Trà Nhân | robe | ngồi trà tổng 3.000 phút (`tea.totalMin`) | 11 |
| `SKU-A-26` | Khung Thượng Thượng | frame | thành tựu `top_stick` (web) | 11 |
| `SKU-A-27` | Khung Thập Nhị Chi | frame | có ít nhất một món của đủ 12 mùa `SEASON-01..12` (miễn phí hay trả phí đều tính) | 11 (phần 09) |

Lưu ý `SKU-A-26`: thành tựu thẻ Thượng Thượng là may rủi; phần thưởng chỉ là khung kỷ niệm, không bán được, không gắn Phúc Khí (phần 01 §3.2).

---

## 4. Gói `SKU-B-*`

### 4.1 Luật gói

| # | Luật |
|---|---|
| B1 | Mọi thành phần gói hiện rõ trước khi trả tiền; không gói ngẫu nhiên |
| B2 | Màn hình gói hiện «tổng giá lẻ» (tính theo giá Ngọc lẻ × tỷ giá gói `SKU-P-02`) và «tiết kiệm …%» |
| B3 | Tiết kiệm tối đa **40%** (gói khởi đầu), **20%** (gói khác) |
| B4 | Nếu người mua đã có một món trong gói, giá gói **tự trừ** phần món đó (gói «trừ món đã có»); nếu đã có hết, gói không bán cho người đó |
| B5 | Không gói nào chứa thân bộ ngũ hành bán bằng tiền thật, không gói nào được giới thiệu theo hành Dụng thần của người xem (phần 01 X4) |
| B6 | Gói tiền thật trên iOS / Android là sản phẩm IAP **tiêu hao** (phần 09 §2); quyền lợi bên trong (món) cấp vĩnh viễn trên máy chủ |
| B7 | Gói giới hạn số lần mua phải ghi số lần ngay trên thẻ gói |

### 4.2 Danh sách gói

| SKU | Tên | Bán bằng | Giá | Thành phần | Giá lẻ quy đổi | Tiết kiệm | Giới hạn |
|---|---|---|---|---|---|---|---|
| `SKU-B-01` | Gói Khởi Đạo | tiền | 49.000đ / 1,99 USD | 150 Ngọc + `khung_sen` (90) | 240 Ngọc ≈ 79.300đ | 38% | 1 lần / tài khoản, trong 30 ngày đầu |
| `SKU-B-02` | Gói Hành Hương Huyền Thành | Ngọc | 520 Ngọc | `SKU-R-thanh-01`, `-03`, `-07`, `-08` (530 Ngọc) + `-04`, `-06`, `-10` (440 PK) | 530 Ngọc + 440 PK (≈ 589 Ngọc khi quy PK theo 7,5×) | ≈ 12% | — |
| `SKU-B-03` | Gói Long Hổ | Ngọc | 680 Ngọc | `SKU-R-longho-01`, `-05`, `-07`, `-08` | 710 Ngọc | 4% + tặng nhuộm 1 lần | — |
| `SKU-B-04` | Gói Võ Đang Sớm Mai | Ngọc | 780 Ngọc | `SKU-R-vodang-01`, `-03`, `-05`, `-06` | 780 Ngọc | 0% + đồ đi kèm: tư thế ngồi «Thái Cực» (emote) | — |
| `SKU-B-05` | Gói Sĩ Tử | Ngọc | 520 Ngọc | `SKU-R-vanmieu-03`, `-04`, `-05` (530 Ngọc) + `-01`, `-02` (460 PK) | 530 Ngọc + 460 PK (≈ 591 Ngọc) | ≈ 12% | — |
| `SKU-B-06` | Gói Tết | tiền | 129.000đ / 5,99 USD | 200 Ngọc + `SKU-F-tet-01` + `SKU-F-tet-05` | 480 Ngọc ≈ 158.500đ | 19% | 1 lần / năm |
| `SKU-B-07` | Gói Trung Thu | tiền | 129.000đ / 5,99 USD | 120 Ngọc + `SKU-F-trungthu-02` + `SKU-F-trungthu-04` | 480 Ngọc ≈ 158.500đ | 19% | 1 lần / năm |
| `SKU-B-08` | Gói Quà Tặng Bạn Đạo | tiền | 49.000đ / 1,99 USD | 1 món Huyền tùy chọn ≤ 160 Ngọc **gửi cho bạn** + thiệp | — | 0% | tính trong trần 5 món tặng / tuần |
| `SKU-B-09` | Gói Nhà Mới | Ngọc | 800 Ngọc | 5 món giá Ngọc của bộ Nhà Rường: `SKU-H-nharuong-01`, `-02`, `-03`, `-04`, `-07` | 920 Ngọc | 13% | 1 lần |
| `SKU-B-10` | Gói Trà Thất | Ngọc | 600 Ngọc | 5 món giá Ngọc của bộ Trà Thất: `SKU-H-trathat-01` … `-05` | 700 Ngọc | 14% | 1 lần |
| `SKU-B-11` | Gói Bốn Mùa Hồ | Ngọc | 520 Ngọc | `SKU-R-cungthong-04`, `-05` + `SKU-R-thulau-05` + `SKU-R-maoshan-05` | 560 Ngọc | 7% | — |
| `SKU-B-12` | Gói Ủng Hộ Cố Vấn | tiền | 99.000đ / 4,99 USD | 100 Ngọc + khung «Tri Ân Cố Vấn» (chỉ có ở gói này, thẩm mỹ) | — | không tính | phần doanh thu ròng chuyển cho quỹ thù lao cố vấn truyền thống (công bố ở «Sổ Quán» — câu hỏi mở cho chủ dự án) |

Ghi chú về `SKU-B-06`, `SKU-B-07`: phương án đầu (109.000đ kèm 3 món) tiết kiệm 33–41%, vượt trần B3; giá và thành phần trong bảng là bản đã cắt về ≤ 20%.

### 4.3 Không làm

| Loại gói | Vì sao không |
|---|---|
| Gói «tăng tốc tu» | M1 |
| Gói «may mắn đầu năm» chứa vật phẩm ngẫu nhiên | R1 |
| Gói chỉ mở khi lá số «phạm Thái Tuế» | X4 |
| Gói «cứu cấp» xuất hiện khi người chơi thua thi khoa cử | X5, X12 |
| Gói theo ngày sinh nhật người chơi | dùng ngày sinh (dữ liệu lá số) để bán hàng — X4; ngày sinh nhật chỉ dùng cho lời chúc và quà miễn phí nhỏ (khung «Sinh Thần», không bán) |

---

## 5. Tiện ích `SKU-U-*`

| SKU | Tên | Giá | Hiệu lực | Trần | Nền tảng | Ghi chú đạo đức |
|---|---|---|---|---|---|---|
| `SKU-U-01` | Thêm 5 ô hồ sơ khách | 300 Ngọc | vĩnh viễn | 4 lần (5 → 25 ô) | web, Android, iOS | lưu trữ; thưởng `grantChart` khóa theo băm lá số (phần 02 PK-2) nên ô mới không thành nguồn Phúc Khí |
| `SKU-U-02` | Thêm 3 ô phối đồ (lưu bộ trang phục) | 120 Ngọc | vĩnh viễn | 5 lần (3 → 18 ô) | mọi nền tảng | 3 ô đầu miễn phí |
| `SKU-U-03` | Thầy AI +10 lượt / ngày · 30 ngày | 200 Ngọc | 30 ngày | tổng ≤ 60 lượt / ngày gồm cả VIP | web, Android | không bán độ sâu; ẩn khi có cờ hỏi lặp / khủng hoảng (phần 01 §4.3) |
| `SKU-U-04` | Thầy AI 20 lượt dùng dần | 150 Ngọc | 90 ngày | mua tối đa 3 gói đang hiệu lực | web, Android | dùng sau khi hết lượt ngày; vẫn trong trần 60 / ngày |
| `SKU-U-05` | Đổi tên hiển thị | 100 Ngọc | — | lần đầu miễn phí; 1 lần / 30 ngày | mọi nền tảng | tên mới qua bộ lọc tên |
| `SKU-U-06` | Mở rộng Sổ Án (lưu 400 án thay vì 40) | 150 Ngọc | vĩnh viễn | 1 lần | mọi nền tảng | `caseLog.length` hiện cắt ở 40; đây là lưu trữ, không đổi thưởng |
| `SKU-U-07` | Ghế khách nhà riêng +4 | 200 Ngọc | vĩnh viễn | 2 lần (4 → 12 khách) | mọi nền tảng | sức chứa không gian riêng (MMO) |
| `SKU-U-08` | Hòm thư lễ (gửi thiệp lễ có hình động) | 60 Ngọc / 10 thiệp | không hết hạn | — | mọi nền tảng | thiệp thường miễn phí 3 / ngày; thiệp không có Ngọc hay vật phẩm bên trong |

**Không bán làm tiện ích:**

| Đề xuất bị loại | Lý do |
|---|---|
| Đổi dáng nhân vật (giới tính, khuôn mặt) có phí | danh tính người chơi; miễn phí 1 lần / 30 ngày |
| Xuất «Sổ Mệnh» bản in đẹp có phí | gần với bán luận giải (M6); bản xuất (nếu có) miễn phí cho mọi người |
| Mở khóa thêm khách giải án / ngày (`CASES_PER_DAY` > 3) | bán thêm nguồn Phúc Khí → phá bức tường (phần 01 §5) |
| Mở thêm sảnh nghề / ngày | như trên |
| Tự động điểm danh | bán Ngọc gián tiếp cho người không đến quán |
| Bỏ qua tranh (cảnh cắt) | không cần — cảnh cắt luôn bỏ qua được miễn phí |

---

## 6. Nhà riêng `SKU-H-*`

### 6.1 Nguyên tắc «da trên xương miễn phí»

Phần 01 §4.6. Mỗi món nội thất có **chức năng gốc**. Chức năng gốc luôn có bản miễn phí (nhận ở nhiệm vụ nhà riêng, tài liệu 08 cấp `MOD-*`). Món bán là **da** của chức năng đó.

| Chức năng gốc | Bản miễn phí | Vai trò trong bài phong thủy (`zhai`, `xuankong`) |
|---|---|---|
| `giuong` giường | giường tre | vị trí đầu giường theo hướng |
| `ban` bàn làm việc | bàn gỗ mộc | vị trí văn xương |
| `ghe` chỗ ngồi | ghế đẩu | — |
| `ke` kệ, tủ | kệ tre | vật chắn |
| `cay` cây | chậu trầu bà | nguồn Mộc |
| `nuoc` nước | chum nước | nguồn Thủy |
| `den` đèn | đèn dầu | nguồn Hỏa |
| `da` đá, gốm | vại sành | nguồn Thổ |
| `kim` kim loại | chuông gió tre | nguồn Kim — chuông gió bản bán là **đồng** nhưng điểm như bản tre |
| `rem` rèm, bình phong | phên tre | vật chắn |
| `tranh` tranh treo | tranh Đông Hồ đơn giản | — |
| `tham` thảm, chiếu | chiếu cói | — |

**Luật điểm:** công thức chấm bài phong thủy đọc `chức năng`, `hành`, `vị trí`, `hướng` — **không** đọc `sku`, `rarity`, `price`. Test bắt buộc: thay mọi món bán bằng bản miễn phí cùng chức năng, điểm bài **bằng hệ**.

### 6.2 Cấm trong nhà riêng

| Thứ | Lý do |
|---|---|
| Tượng Phật, Bồ Tát, Thần Tài, Ông Địa, Quan Công, Thái Tuế | T1 |
| Bàn thờ gia tiên **bản bán** | T7 — mỗi nhà có **một** bàn thờ gia tiên chuẩn, miễn phí, không skin, không bài vị có tên; đặt hay không là quyền người chơi |
| Gương bát quái, tỳ hưu, thiềm thừ, kỳ lân, hồ lô khai quang, đồng tiền xu buộc chỉ đỏ | vật «hóa sát» tín ngưỡng — chỉ nhận qua bài học phong thủy (tài liệu 09), lời giảng theo `RB5` |
| Câu đối, hoành phi có chữ kinh thật | T2 — dùng câu đối chữ hư cấu hoặc thơ cổ của tác giả đã mất quyền tác giả và đã được kiểm nghĩa |
| Bùa dán cửa | T3 |
| Cây có «chỉ số tài lộc» (kim tiền, phát tài) ghi trong mô tả | §7.1 phần 01 — tên cây giữ, mô tả không hứa |

### 6.3 Danh mục 44 món

**Bộ Nhà Rường Bắc Bộ (`nharuong`)**

| SKU | Món | Chức năng | Hành | Giá |
|---|---|---|---|---|
| `SKU-H-nharuong-01` | Sập Gụ Chân Quỳ | ghe | Mộc | 260 Ngọc |
| `SKU-H-nharuong-02` | Tủ Chè Khảm Trai | ke | Mộc | 220 Ngọc |
| `SKU-H-nharuong-03` | Giường Lát Gỗ Mít | giuong | Mộc | 180 Ngọc |
| `SKU-H-nharuong-04` | Chum Sành Hương Canh | nuoc | Thổ / Thủy | 120 Ngọc |
| `SKU-H-nharuong-05` | Đèn Dầu Đế Đồng | den | Hỏa | 900 PK |
| `SKU-H-nharuong-06` | Chiếu Cói Nga Sơn | tham | Mộc | 600 PK |
| `SKU-H-nharuong-07` | Bình Phong Gỗ Tứ Quý | rem | Mộc | 140 Ngọc |
| `SKU-H-nharuong-08` | Tranh Đông Hồ «Đám Cưới Chuột» | tranh | — | 400 PK |

**Bộ Phố Hội (`phohoi`)**

| SKU | Món | Chức năng | Hành | Giá |
|---|---|---|---|---|
| `SKU-H-phohoi-01` | Đèn Lồng Lụa Ba Màu | den | Hỏa | 130 Ngọc |
| `SKU-H-phohoi-02` | Bàn Gỗ Mặt Đá | ban | Thổ | 160 Ngọc |
| `SKU-H-phohoi-03` | Chậu Hoa Giấy | cay | Mộc | 500 PK |
| `SKU-H-phohoi-04` | Rèm Tre Mành Mành | rem | Mộc | 400 PK |
| `SKU-H-phohoi-05` | Lu Nước Men Lam | nuoc | Thủy | 120 Ngọc |
| `SKU-H-phohoi-06` | Ghế Mây | ghe | Mộc | 500 PK |

**Bộ Thư Phòng (`thuphong`)**

| SKU | Món | Chức năng | Hành | Giá |
|---|---|---|---|---|
| `SKU-H-thuphong-01` | Án Thư Gỗ Hoàng Đàn | ban | Mộc | 220 Ngọc |
| `SKU-H-thuphong-02` | Giá Sách Năm Tầng | ke | Mộc | 180 Ngọc |
| `SKU-H-thuphong-03` | Đôn Gốm Men Rạn | ghe | Thổ | 140 Ngọc |
| `SKU-H-thuphong-04` | Nghiên Bút Giá Treo | ban (phụ) | Thổ | 600 PK |
| `SKU-H-thuphong-05` | Đèn Bàn Chụp Giấy | den | Hỏa | 500 PK |
| `SKU-H-thuphong-06` | Bản Chép Tay Đóng Hộp | tranh | — | 200 PK (phần 02 §4.10) |
| `SKU-H-thuphong-07` | Chậu Lan Hồ Điệp | cay | Mộc | 120 Ngọc |

**Bộ Trà Thất (`trathat`)**

| SKU | Món | Chức năng | Hành | Giá |
|---|---|---|---|---|
| `SKU-H-trathat-01` | Kỷ Trà Gỗ Mộc | ban | Mộc | 140 Ngọc |
| `SKU-H-trathat-02` | Bồ Đoàn Cói | ghe | Mộc | 120 Ngọc |
| `SKU-H-trathat-03` | Lò Than Đất | den | Hỏa | 120 Ngọc |
| `SKU-H-trathat-04` | Bộ Ấm Chén Bát Tràng | trang trí | Thổ | 160 Ngọc |
| `SKU-H-trathat-05` | Chậu Trúc Quân Tử | cay | Mộc | 160 Ngọc |
| `SKU-H-trathat-06` | Chiếu Tre Mịn | tham | Mộc | 400 PK |

**Bộ Giang Nam (`giangnam`)**

| SKU | Món | Chức năng | Hành | Giá |
|---|---|---|---|---|
| `SKU-H-giangnam-01` | Cửa Sổ Tròn Song Gỗ | rem | Mộc | 200 Ngọc |
| `SKU-H-giangnam-02` | Hòn Non Bộ Nhỏ | da | Thổ | 220 Ngọc |
| `SKU-H-giangnam-03` | Bể Cá Vại | nuoc | Thủy | 160 Ngọc |
| `SKU-H-giangnam-04` | Chuông Gió Đồng | kim | Kim | 120 Ngọc |
| `SKU-H-giangnam-05` | Tranh Sơn Thủy Cuộn | tranh | — | 140 Ngọc |

**Bộ Sân Vườn (`sanvuon`)**

| SKU | Món | Chức năng | Hành | Giá |
|---|---|---|---|---|
| `SKU-H-sanvuon-01` | Giếng Đá Ong | nuoc | Thủy / Thổ | 1.200 PK |
| `SKU-H-sanvuon-02` | Giàn Bầu Bí | cay | Mộc | 800 PK |
| `SKU-H-sanvuon-03` | Cây Cau Đôi | cay | Mộc | 900 PK |
| `SKU-H-sanvuon-04` | Chum Tương | da | Thổ | 600 PK |
| `SKU-H-sanvuon-05` | Đèn Đá Sân | den | Hỏa / Thổ | 160 Ngọc |
| `SKU-H-sanvuon-06` | Ao Sen Nhỏ | nuoc | Thủy | 200 Ngọc |
| `SKU-H-sanvuon-07` | Lối Gạch Bát | tham (ngoài trời) | Thổ | 700 PK |
| `SKU-H-sanvuon-08` | Chuồng Gà Tre (có hai con gà đi lại) | trang trí | — | 600 PK |

**Bộ Mùa (đổi theo tiết khí, `mua`)**

| SKU | Món | Chức năng | Hành | Giá |
|---|---|---|---|---|
| `SKU-H-mua-01` | Bình Đào Xuân | cay | Mộc | 120 Ngọc (bán theo lễ Tết) |
| `SKU-H-mua-02` | Chậu Sen Hạ | nuoc | Thủy | 120 Ngọc |
| `SKU-H-mua-03` | Lọ Cúc Thu | cay | Mộc | 600 PK |
| `SKU-H-mua-04` | Lò Sưởi Đông | den | Hỏa | 120 Ngọc |

**Thống kê:** 44 món; 27 giá Ngọc (tổng 4.250 Ngọc), 17 giá PK (tổng 10.400 PK). Nhà là sink Phúc Khí lớn (phần 02 §4.6) cộng phần đất / xây; phần nội thất cân đôi giữa hai tiền.

---

## 7. Checklist nghiệm thu phần 06

- [ ] Vu Lan, Hạ Nguyên, Phật đản, Tết Thầy: cửa hàng lễ **không có** món bán (test lịch).
- [ ] `SKU-A-*` không có `price`, không `giftable` (lint).
- [ ] Gói hiện tổng giá lẻ và tiết kiệm đúng luật B2, B3; gói trừ món đã có (B4).
- [ ] `SKU-U-03`, `SKU-U-04` không có trên iOS.
- [ ] Điểm bài phong thủy bằng nhau khi thay món bán bằng bản miễn phí (test).
- [ ] Không món nội thất nào thuộc danh sách §6.2.
