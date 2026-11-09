# 11 · Phần 03 — Ngọc, mô phỏng thu nhập và kiểm soát lạm phát

> Ngọc (`wardrobe.ngoc`) là tiền tệ **cao cấp**: nhận miễn phí qua điểm danh, VIP, lên cấp, lễ tiết; và mua được bằng tiền thật. Phần này mô tả mọi nguồn Ngọc, bảng gói nạp `SKU-P-*`, mô phỏng thu nhập ngày / tuần / năm cho bốn kiểu người chơi, rồi đặt các trần và van chống lạm phát.

---

## 1. Ngọc trong code hiện tại

| Hằng / hàm | Giá trị | Tệp |
|---|---|---|
| `CHECKIN` | `[10, 15, 20, 25, 30, 40, 80]` — vòng 7 ngày, tổng **220** | `cosmetics.js` |
| `checkin(s, now)` | mỗi ngày một lần; ngày hôm trước có điểm danh thì `streak + 1`, không thì **về 1** | `cosmetics.js` |
| `VIP_DAILY` | **30** / ngày, nhận khi giao diện cập nhật (`main.js › updateHud` gọi `vipDaily`) | `cosmetics.js`, `main.js` |
| `LEVEL_GIFT` | **20** / cấp mới, nhận dồn (`levelGifts`) | `cosmetics.js` |
| `wardrobe().ngoc` | số nguyên ≥ 0 (`Math.max(0, Math.floor(...))`) | `cosmetics.js` |
| `buy()` | trừ `price.ngoc` | `cosmetics.js` |
| Gói nạp (chỉ hiển thị, nút bị khóa) | 60 / 22.000đ · 330 / 109.000đ · 700 / 219.000đ · 1.600 / 449.000đ | `wardrobe-ui.js › vipView` |
| iOS | mục Nạp Ngọc ẩn hẳn (`IOS ? '' : …`) | `wardrobe-ui.js` |

### 1.1 Nhận xét từ code

| # | Nhận xét | Hệ quả | Đề xuất |
|---|---|---|---|
| NG-1 | Đứt chuỗi điểm danh thì về ngày 1 | người chơi 4 ngày / tuần chỉ nhận ~45 Ngọc / tuần thay vì 125 (mô phỏng §5); áp lực «sợ mất chuỗi» | **chuỗi tạm dừng**: lỡ ngày thì vòng 7 ngày **dừng tại chỗ**, lần sau tiếp ngày kế. Điều kiện khung Kim Long đổi thành «7 lần điểm danh trong 9 ngày» |
| NG-2 | Điểm danh dùng đồng hồ máy | chỉnh giờ máy nhận Ngọc liên tục | ngày kinh tế do máy chủ cấp (phần 02 §1.1 PK-3) |
| NG-3 | Ngọc VIP chỉ nhận khi mở game trong ngày | VIP không chơi ngày đó mất 30 | giữ nguyên (VIP là «quà khi ghé quán»); ghi rõ ở bảng quyền lợi VIP |
| NG-4 | Ngọc lưu cục bộ, chung một số | không phân biệt Ngọc mua với Ngọc tặng → không hoàn tiền đúng, không ghi doanh thu đúng | **hai ví** §2 |
| NG-5 | Không có giới hạn số dư | không vấn đề với Ngọc tặng; với Ngọc mua có ý nghĩa pháp lý (phần 09 §8.4) | trần số dư Ngọc **mua** 20.000 |

---

## 2. Hai ví Ngọc

Người chơi chỉ thấy **một con số** Ngọc. Trên máy chủ, Ngọc nằm ở hai ví:

| Ví | Nguồn | Tiêu thứ tự | Hoàn tiền | Kế toán |
|---|---|---|---|---|
| **Ngọc Tặng** (`ngoc_free`) | điểm danh, VIP hằng ngày, quà cấp, lễ tiết, Đạo Lộ nhánh miễn phí, bồi thường | **tiêu trước** | không áp dụng | không phải doanh thu |
| **Ngọc Nạp** (`ngoc_paid`) | mua gói `SKU-P-*`, phần Ngọc trong gói `SKU-B-*` | tiêu sau | Ngọc chưa tiêu hoàn được theo phần 09 §7 | doanh thu chưa thực hiện cho tới khi tiêu (phần 09 §8.3) |

**Vì sao tiêu Ngọc Tặng trước:** bảo vệ người mua. Nếu người mua đổi ý trong thời hạn hoàn tiền, phần Ngọc Nạp còn nguyên nhiều nhất có thể. Ngược lại với cách nhiều game làm (tiêu Ngọc Nạp trước để «khóa» doanh thu).

**Ngoại lệ:** món chỉ bán bằng Ngọc Nạp — **không có**. Mọi món Ngọc mua được bằng bất kỳ Ngọc nào. Không có «Ngọc Kim» riêng cho người nạp.

Ngọc VIP hằng ngày (`VIP_DAILY`) thuộc **Ngọc Tặng** dù VIP là thứ mua bằng tiền: doanh thu VIP ghi theo kỳ thuê bao (phần 09 §8.3), Ngọc VIP là quyền lợi đi kèm.

---

## 3. Nguồn Ngọc

### 3.1 Nguồn miễn phí hiện có

| Nguồn | Mỗi lần | Tối đa / tuần | Tối đa / năm |
|---|---|---|---|
| Điểm danh (đủ 7 ngày) | 10 → 80 | 220 | 11.440 |
| Quà cấp | 20 / cấp | phụ thuộc tốc độ cấp | người chơi chăm: ~59 cấp năm đầu → 1.180; năm sau ~20 cấp → 400 |
| VIP hằng ngày | 30 | 210 | 10.950 (chỉ VIP) |

### 3.2 Nguồn miễn phí dự kiến

| Nguồn | Ngọc | Tần suất | Ghi chú |
|---|---|---|---|
| Lập Xuân / Tết (đổi niên chủ, `EV-*` của tài liệu 10) | 200 | 1 / năm | quà cho mọi người đăng nhập trong 15 ngày đầu năm can chi |
| Rằm tháng Giêng (Thượng Nguyên) | 50 | 1 / năm | — |
| Vu Lan (15/7 âm) | 80 | 1 / năm | quà, không gắn hoạt động «cúng» |
| Hạ Nguyên (15/10 âm) | 50 | 1 / năm | — |
| Trùng Cửu (9/9 âm) | 50 | 1 / năm | — |
| Phật đản | 50 | 1 / năm | — |
| Tết Thầy (20/11) | 50 | 1 / năm | — |
| Sinh nhật Huyền Quán (ngày ra mắt) | 100 | 1 / năm | — |
| Đạo Lộ nhánh miễn phí | 300 / chương | 4 / năm | phần 07 §5 |
| Bồi thường bảo trì quá 2 giờ | 50 – 200 | khi có sự cố | phần 10 §9 |
| Hoàn thành Hồi I, II, III, IV, Vĩ thanh (một lần) | 100 / hồi | một lần | thưởng mốc cốt truyện |
| **Tổng lễ + cốt truyện + Đạo Lộ (năm đầu)** | | | 680 + 1.200 + 500 = **2.380** |

**Không có:** Ngọc thưởng từ thành tựu, Ngọc thưởng từ giới thiệu bạn bè (dễ thành spam, và người giới thiệu kiếm Ngọc từ tiền người khác), Ngọc thưởng xếp hạng Thiên Bảng (M9), Ngọc thưởng từ đăng mạng xã hội.

### 3.3 Ngân sách Ngọc miễn phí mục tiêu

| Kiểu người chơi | Ngọc miễn phí / năm (đề xuất) | So với danh mục mới mỗi năm |
|---|---|---|
| Khách thong thả (4 ngày / tuần) | 6.000 – 8.000 | mua được ~20% món Ngọc mới |
| Đệ tử chăm (hằng ngày, miễn phí) | 14.000 – 15.000 | ~40% |
| VIP | 25.000 – 26.000 | ~70% |

«Danh mục mới mỗi năm» ≈ 35.000 Ngọc món giá Ngọc (phần 05, 06: ~150 món, trung bình ~230 Ngọc / món, cộng món vùng mới). Mục tiêu thiết kế: **người chơi miễn phí chăm luôn có món để để dành, nhưng không ai mua hết danh mục nếu chỉ chơi**; người trả tiền mua rộng hơn chứ không «mạnh hơn».

### 3.4 Gói nạp `SKU-P-*`

| Mã | Ngọc | Giá web (VND, đã gồm thuế) | Giá app (USD) | VND / Ngọc | Rẻ hơn gói nhỏ | Ghi chú |
|---|---|---|---|---|---|---|
| `SKU-P-01` | 60 | 22.000 | 0,99 | 366,7 | — | đã có trong UI |
| `SKU-P-02` | 330 | 109.000 | 4,99 | 330,3 | 9,9% | đã có |
| `SKU-P-03` | 700 | 219.000 | 9,99 | 312,9 | 14,7% | đã có |
| `SKU-P-04` | 1.600 | 449.000 | 19,99 | 280,6 | 23,5% | đã có |
| `SKU-P-05` | 4.200 | 1.099.000 | 49,99 | 261,7 | 28,6% | **mới**; ẩn với tài khoản < 18 tuổi |

Quy tắc gói:

- Mọi gói có số Ngọc chia hết cho 10, khớp bước giá món (X8).
- **Không** «nhân đôi lần nạp đầu», **không** «Ngọc thưởng thêm hôm nay». Mỗi gói luôn đúng số ghi. Lý do: hai cơ chế này là đòn tâm lý thúc nạp sớm.
- **Không** gói > 49,99 USD. Người muốn chi nhiều hơn mua nhiều lần và gặp các bước xác nhận của phần 01 §9.3.
- Giá trên App Store / Google Play theo **bậc giá** của nền tảng cho VN; nếu bậc giá VND của nền tảng khác giá web, số Ngọc **giữ nguyên** và chênh lệch được ghi công khai trên trang hỗ trợ web. Trong ứng dụng iOS không nhắc giá web (quy định chống dẫn hướng — phần 11 §4).
- Gói khởi đầu, gói ủng hộ dạng combo nằm ở phần 06 §4 (`SKU-B-*`), không phải gói Ngọc.

---

## 4. Ngọc đi đâu — chỗ tiêu

| Chỗ tiêu | Tỷ trọng mục tiêu trong Ngọc tiêu |
|---|---|
| Món thẩm mỹ (Tàng Y Các, món vùng, món lễ) | 60–70% |
| Đạo Lộ trả phí mua bằng Ngọc (phần 07 §4.3) | 10–15% |
| Nội thất nhà riêng bản đặc biệt (phần 06 §6) | 10–15% |
| Tiện ích (ô hồ sơ, ô tủ đồ) | 5% |
| Lượt hỏi Thầy AI thêm | ≤ 5% (cố ý thấp; phần 01 §4.3) |

Ngọc **không** tiêu cho: thời gian chờ (game không có chờ), hồi sinh, «may mắn», bất cứ gì ở lõi.

---

## 5. Mô phỏng thu nhập

### 5.1 Giả định chung

- Chạy với hằng số thật của `state.js` và `cosmetics.js` (phần 02 §2.1).
- Điểm án theo phần 02 §2.3.
- Án Cổ: người chơi chăm giải 2 án mới / ngày cho tới hết 38 án.
- Khi đủ 570 Ngọc, người chơi mua thân bộ Hợp mệnh đã bình giá (phần 01 §4.1) và nhận ×1,1 cho án và sảnh từ hôm sau.
- Chưa tính nguồn dự kiến (phần 02 §3, phần 03 §3.2) — mô phỏng **sàn**, phản ánh game hôm nay.
- «Cũ» = quy tắc đứt chuỗi hiện tại; «Tạm dừng» = đề xuất NG-1.
- Mô phỏng chạy bằng script ngoài kho (tái lập được theo các giả định trên); số đã làm tròn.

### 5.2 Bốn kiểu người chơi

| Kiểu | Tên | Chơi | Thời lượng | Trả tiền |
|---|---|---|---|---|
| **A** | Khách Thong Thả | 4 ngày / tuần (T2, T3, T5, T7) | 15–20 phút | không |
| **B** | Đệ Tử Chăm | mỗi ngày | 60–75 phút | không |
| **C** | Chân Nhân | mỗi ngày | 30 phút | VIP tháng + Đạo Lộ |
| **D** | Hộ Quán Sưu Tầm | mỗi ngày | 45 phút | VIP + Đạo Lộ + 1 gói `SKU-P-04` / tháng |

### 5.3 Ngày điển hình

**A — Khách Thong Thả (một ngày có chơi):**

| Việc | Phúc Khí | Ngọc |
|---|---|---|
| Điểm danh | — | 10–80 theo ngày vòng |
| Bảng Lịch | 2 | — |
| Thắp nhang | 5 | — |
| La Bàn | 5 | — |
| 1 án khách (điểm 0,55) | 8 | — |
| 3 việc trong ngày | 5 | — |
| Trà 8 phút | 8 | — |
| 1 sảnh nghề (0,55) | 8 | — |
| 1 thẻ xăm | 3 | — |
| **Tổng** | **44** | **10–80** |

**B — Đệ Tử Chăm (web):**

| Việc | Phúc Khí |
|---|---|
| La Bàn, nhang, lịch, hoa đăng, 3 việc | 5 + 5 + 2 + 3 + 5 = 20 |
| 3 thẻ xăm | 9 |
| Trà 15 phút | 15 |
| 3 án khách (0,82 → 12 mỗi án) | 36 |
| 8 sảnh nghề (0,82 → 12) | 96 |
| Đèn Thái Tuế | 3 |
| 2 Án Cổ (19 ngày đầu) | 50 |
| **Tổng** | **229** (19 ngày đầu) · **179** (sau đó) |
| Với Hợp mệnh | án 13, sảnh 13 → **192** / ngày sau Án Cổ |

**B-iOS (Học Quán):** không xăm (−9), không hoa đăng (−3), không đèn Thái Tuế (−3) → **164** / ngày (Hợp mệnh: 177).

**C — Chân Nhân:**

| Việc | Phúc Khí | Ngọc |
|---|---|---|
| Nhỏ hằng ngày (La Bàn, nhang, lịch, 3 việc, 1 thẻ xăm, đèn) | 23 | — |
| Trà 10 phút | 10 | — |
| 3 án (0,65 → 10) | 30 | — |
| 4 sảnh (0,65 → 10) | 40 | — |
| Án Cổ (1 án / 2 ngày) | 12,5 trung bình | — |
| Điểm danh + VIP | — | 31 trung bình + 30 |
| **Tổng** | **≈ 116** | **≈ 61 + quà cấp** |

**D — Hộ Quán Sưu Tầm:** Phúc Khí ≈ 140 / ngày (6 sảnh, 3 án, Hợp mệnh từ ngày 1 vì mua bộ ngay). Ngọc như C cộng 1.600 / tháng từ gói và Ngọc nhánh trả phí Đạo Lộ.

### 5.4 Kết quả theo thời gian (sàn, chưa có nguồn dự kiến)

**Phúc Khí tích lũy (`xp`) và cấp:**

| Kiểu | 1 tuần | 4 tuần | 12 tuần | 26 tuần | 52 tuần |
|---|---|---|---|---|---|
| A | 176 · cấp 3 | 704 · cấp 6 | 2.134 · cấp 11 | 4.710 · cấp 16 | 9.494 · cấp 22 |
| B | 1.603 · cấp 9 | 6.163 · cấp 18 | 16.803 · cấp 29 | 35.423 · cấp 43 | 70.003 · cấp 60 |
| B-iOS | 1.498 · cấp 9 | 5.743 · cấp 17 | 15.543 · cấp 28 | 32.693 · cấp 41 | 64.543 · cấp 57 |
| C | 809 · cấp 7 | 3.404 · cấp 14 | 10.236 · cấp 23 | 21.016 · cấp 33 | 41.036 · cấp 46 |

**Mốc cấp (ngày lịch thứ, ngày 1 là ngày bắt đầu chơi):**

| Kiểu | Cấp 10 | Cấp 20 | Cấp 30 |
|---|---|---|---|
| A | ngày 62–64 (tuần 9–10) | ngày 275–277 (tuần 40) | ngoài 52 tuần |
| B | ngày 8 | ngày 34 | ngày 85 |
| B-iOS | ngày 8 | ngày 37 | ngày 92 |
| C | ngày 14 | ngày 59 | ngày 144 |

**Ngọc còn lại (đã trừ 570 mua bộ khi đủ), không mua gì khác:**

| Kiểu | Quy tắc chuỗi | 1 tuần | 4 tuần | 12 tuần | 26 tuần | 52 tuần | Ngày có bộ Hợp mệnh |
|---|---|---|---|---|---|---|---|
| A | Cũ | 85 | 280 | 170 | 900 | 2.190 | ngày 64 |
| A | **Tạm dừng** | 110 | 565 | 1.090 | 2.950 | **6.330** | **ngày 29** |
| B | Cũ = Tạm dừng | 380 | 650 | 2.630 | 5.990 | 12.050 | ngày 13 |
| B-iOS | — | 380 | 630 | 2.610 | 5.950 | 11.990 | ngày 13 |
| C | — | 550 | 1.410 | 5.030 | 11.250 | 22.690 | ngày 8 |

**Đọc bảng:**

1. **Quy tắc đứt chuỗi hiện tại phạt nặng người chơi thong thả.** Cùng số ngày chơi, A nhận 2.190 Ngọc / năm với quy tắc cũ, 6.330 với quy tắc tạm dừng — gấp 2,9 lần. Người chơi đều đặn (B, C) không đổi. Đề xuất NG-1 chỉ có lợi cho người có đời sống bận, đúng tinh thần «không ai giục» của quán (`TEXT.gateLead`).
2. **Quà cấp chiếm phần lớn Ngọc tuần đầu của người chăm.** B tuần 1 nhận 220 điểm danh + 160 quà cấp. Sau tuần 4, quà cấp giảm còn ~20–40 / tuần (khoảng cách cấp tăng tuyến tính). Đây là đường cong tốt: «quà nhập môn» hào phóng, sau đó ổn định.
3. **iOS chậm hơn web ~8%** vì thiếu 3 gian bói. Nguồn dự kiến D1–D9 bù được khoảng cách này.
4. **VIP gần gấp đôi Ngọc của người chơi chăm miễn phí** (22.690 so với 12.050). Đây là giá trị chính VIP mua, cùng với thẩm mỹ độc quyền và Ngự Vân Thường. Không có gì trong đó chạm lõi.

### 5.5 Tuần điển hình (sau tuần 4, có nguồn dự kiến của bản AAA)

| Kiểu | Phúc Khí kiếm / tuần (sau ngân sách ngày) | Phúc Khí tiêu / tuần (mục tiêu) | Ngọc miễn phí / tuần | Ngọc nạp / tuần | Chi tiêu tiền / tháng |
|---|---|---|---|---|---|
| A | 300 – 400 | 200 – 300 (nhuộm, trà, món Phàm / Linh, xe trạm) | 125 + lễ | 0 | 0 |
| B | 2.000 – 2.300 | 1.500 – 2.000 (nhà, trùng tu, thân bộ, món Phúc Khí) | 240 + lễ + Đạo Lộ miễn phí | 0 | 0 |
| C | 1.100 – 1.300 | 800 – 1.000 | 450 + lễ + Đạo Lộ cả hai nhánh | 0 | 99.000đ VIP + 36.000đ (Đạo Lộ năm chia tháng) ≈ **135.000đ** |
| D | 1.400 – 1.600 | 1.000 – 1.300 | 450 + lễ + Đạo Lộ | ~370 | 99.000 + 449.000 + 36.000 ≈ **584.000đ** |

### 5.6 «Bao lâu để có …» — bảng trả lời câu hỏi thường gặp

| Mục tiêu | A (thong thả, tạm dừng) | B (chăm) | C (VIP) | D (sưu tầm) |
|---|---|---|---|---|
| Thân bộ Hợp mệnh (570 Ngọc hoặc 2.400 Phúc Khí) | 4 tuần | 2 tuần (hoặc 2 tuần bằng Phúc Khí) | 1 tuần | ngay |
| Một món Tiên 260 Ngọc | 2 tuần | 1 tuần | 4 ngày | ngay |
| Một món Thần 640–780 Ngọc (không điều kiện VIP) | 6 tuần | 3 tuần | 12 ngày | ngay |
| Toàn bộ 38 món Ngọc hiện có (9.470; trừ 2.560 món VIP-only nếu không VIP) | không trong năm đầu | ~29 tuần (6.910) | ~22 tuần | ~11 tuần |
| Toàn bộ 8 món Phúc Khí hiện có (1.510) | 9 tuần | 9 ngày | 2 tuần | 11 ngày |
| Nhà 3 gian (5.500 Phúc Khí) | không trong năm đầu nếu tiêu thứ khác | 4–5 tuần | 6–7 tuần | 5 tuần |

---

## 6. Kiểm soát lạm phát Ngọc

### 6.1 Vì sao Ngọc có thể lạm phát

- Nguồn miễn phí đều đặn và tăng (thêm lễ, Đạo Lộ), trong khi số món có hạn.
- Người chơi lâu năm tích Ngọc lớn, mỗi món mới mua ngay → món mới «mất giá trị cảm nhận», cộng đồng thấy món mới «ai cũng có».
- Ngược lại, nếu danh mục mới quá đắt so với Ngọc miễn phí, người miễn phí nản.

### 6.2 Van giữ cân bằng

| Van | Cơ chế | Khi nào dùng |
|---|---|---|
| V1 · Nhịp ra món | mỗi chương Đạo Lộ (≈ 91 ngày) thêm 25–35 món Ngọc ở Y Các ngoài Đạo Lộ | luôn |
| V2 · Món điều kiện | Thần cần điều kiện (cấp, chuỗi, thành tựu, VIP) → không chỉ là tiền | luôn; tỷ lệ món Thần ≤ 10% danh mục |
| V3 · Giá theo bậc hiếm cố định | dải giá chuẩn (phần 04 §3), không lạm phát giá | luôn |
| V4 · Ngân sách Ngọc miễn phí | §3.3; khi thêm nguồn miễn phí mới phải cân lại | khi thêm sự kiện |
| V5 · Chỉ số `NGOC_FREE_BALANCE_P50` | trung vị số dư Ngọc của người chơi hoạt động ≥ 90 ngày | nếu > 6.000 trong 2 chương liên tiếp → V1 tăng nhịp |
| V6 · Kho món quay lại | §7 | luôn |

**Không dùng:** Ngọc hết hạn; trần số dư Ngọc Tặng; thuế tủ đồ; tăng giá món cũ; giảm quà cấp hồi tố.

### 6.3 Trần

| Trần | Giá trị | Lý do |
|---|---|---|
| Số dư Ngọc Nạp | 20.000 | pháp lý vật phẩm ảo trả trước (phần 09 §8.4); chặn rửa tiền bằng tài khoản game |
| Nạp / 30 ngày, tài khoản ≥ 18 | không trần cứng dưới 10.000.000đ; các bước xác nhận phần 01 §9.3 | — |
| Nạp / 30 ngày, tài khoản 16–17 | 500.000đ | phần 09 §9 |
| Nạp / 30 ngày, tài khoản < 16 | 200.000đ, cần cha mẹ đồng ý | phần 09 §9 |
| Mua tặng | 5 món / tuần / người gửi | phần 01 §4.8 |
| Lượt AI mua thêm | trần 60 lượt / ngày tổng | phần 01 §4.3 |
| Ngọc Tặng từ bồi thường | 500 / tháng | tránh bị khai thác bằng cách tạo sự cố |

---

## 7. Món giới hạn và lịch quay lại

FOMO (sợ bỏ lỡ) là đòn bẩy mạnh nhất và độc nhất của game có mùa. Quy tắc:

| Loại món | Có thời hạn bán? | Quay lại |
|---|---|---|
| Món Y Các thường | không | — |
| Món lễ tiết (`SKU-F-*`) | bán trong mùa lễ ± 7 ngày | **mỗi năm** vào lễ đó |
| Món nhánh trả phí Đạo Lộ (`SKU-S*`) | trong mùa | sau **24 tháng** vào «Tàng Bảo Lục» (kho món cũ) với giá Ngọc theo dải chuẩn; bản quay lại có **chữ khắc mùa** khác («Đinh Mùi niên chế» vs «Đinh Mùi phục chế») để người giữ bản gốc vẫn có dấu riêng |
| Món nhánh miễn phí Đạo Lộ | trong mùa | sau 24 tháng như trên |
| Món thành tựu, món tu (vòng giữa) | không bán bao giờ | không quay lại dạng bán |
| Món độc quyền VIP | luôn có khi đang VIP | — |
| Món ra mắt hợp tác (nếu có) | theo hợp đồng | ghi rõ «không quay lại» ngay trên thẻ món nếu đúng như vậy |

Đồng hồ đếm ngược chỉ hiện khi **có thời hạn thật**, và luôn kèm câu «sẽ quay lại vào …» nếu món thuộc loại có quay lại.

---

## 8. Ca biên

| Ca | Hành vi đúng |
|---|---|
| Mua gói trong lúc mất mạng | giao dịch chỉ ghi Ngọc sau khi máy chủ xác nhận biên lai (phần 09 §5); giao diện hiện «đang chờ xác nhận» |
| Mua thành công nhưng game đóng trước khi nhận | máy chủ ghi quyền lợi; lần mở sau tự cộng (phần 09 §5.4 «giao hàng lại») |
| Hoàn tiền một gói đã tiêu một phần Ngọc | trừ phần Ngọc Nạp còn lại; nếu thiếu, ví Ngọc Nạp **âm** và chặn mua bằng Ngọc cho tới khi bù; không thu hồi món đã mua (phần 09 §7.3) |
| Ngọc Tặng hiện ở `localStorage` lúc di trú lên máy chủ | nhận một lần, trần di trú 3.000 Ngọc (phần 09 §5.6) |
| Đổi giờ máy để điểm danh nhiều lần | sau khi có máy chủ: vô hiệu (NG-2) |
| VIP hết hạn giữa ngày | đã nhận 30 hôm nay thì giữ; từ mai không nhận |
| Lên nhiều cấp cùng lúc (Án Cổ hàng loạt) | `levelGifts` cộng dồn `n × 20` — đúng thiết kế |
| Món giá Ngọc giảm 30% trong đợt giảm giá, người vừa mua giá đủ hôm trước | trong 48 giờ trước đợt giảm: hoàn chênh lệch bằng Ngọc Tặng tự động |

---

## 9. Checklist nghiệm thu phần 03

- [ ] Hai ví Ngọc trên máy chủ, giao diện hiện một số.
- [ ] Thứ tự tiêu: Ngọc Tặng trước.
- [ ] Chuỗi điểm danh tạm dừng (NG-1); khung Kim Long theo «7 lần trong 9 ngày».
- [ ] `SKU-P-05` ẩn với tài khoản < 18.
- [ ] Không gói nào có thưởng lần đầu hay thưởng ngày.
- [ ] Bảng mô phỏng §5.4 chạy lại được bằng script trong `scripts/` (tài liệu 13 cấp mã) và khớp ± 2%.
- [ ] Chỉ số `NGOC_FREE_BALANCE_P50` có trên bảng điều khiển.
- [ ] Kho «Tàng Bảo Lục» có lịch quay lại cho mọi món mùa.
