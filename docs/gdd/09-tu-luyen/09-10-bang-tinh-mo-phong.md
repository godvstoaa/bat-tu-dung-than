# 09-10 · Bảng tính cân bằng và kết quả mô phỏng

> Mọi con số ở đây là **kết quả chạy thật** bộ mô phỏng ở §12 với hằng số của `09-03` (bản chốt). Không có số «ước chừng» trừ khi ghi rõ. Mục đích: (1) trả lời câu hỏi «người TL 20 / 40 / 60 / 85 mất bao nhiêu giờ cho mỗi bậc»; (2) cho đội vận hành biết **cần vặn núm nào** khi số liệu thật lệch.

---

## 1. Mô hình

### 1.1 Ba kiểu người chơi

| Kiểu | Phút / ngày chơi | Ngày chơi / tuần | Phút MG / ngày | Phút cốt truyện + chuỗi đạo / ngày | Điểm MG trung bình (`f(s)` quy đổi) | Làm Nhật Khóa | Dự việc tuần | Dự Sóc / Vọng | Dự lễ tiết | Công / ngày chơi |
|---|---|---|---|---|---|---|---|---|---|---|
| **Thong thả** | 25 | 5 | 17 | 8 | 0,72 thô / phút | 60% ngày chơi | 50% | 50% | 40% | 2 |
| **Đều đặn** | 50 | 6 | 32 | 18 | 0,80 | 90% | 85% | 80% | 70% | 3 |
| **Chuyên tu** | 110 | 7 | 60 | 50 | 0,88 | 100% | 100% | 100% | 100% | 5 |

`0,72 / 0,80 / 0,88 thô / phút` là tốc độ MG thực tế sau thời gian đi lại và sai sót: MG được cân ≈ 1 thô / phút khi `s ≈ 0,8` (`09-03` §6), trừ đi 10–30% thời gian di chuyển giữa các nơi.

### 1.2 Nguồn trong mô hình (đúng hằng số `09-03`)

| Nguồn | Mô hình hóa |
|---|---|
| MG trong trần | `min(TRẦN_NGÀY(bậc), phútMG × tốc độ)`; phần vượt vào Dư Hương (≤ 20), mỗi ngày chuyển ≤ 10 |
| Nhật Khóa | 6 + `min(4, ⌊chuỗi/7⌋)` với xác suất làm của kiểu |
| Cốt truyện `MQ-*` | 700 thô, nhận 20 thô / giờ cốt truyện cho tới hết |
| Chuỗi đạo `CQ-*` | 250 / đạo; đạo 1 mở ở bậc 2, đạo 2 ở bậc 3, đạo 3 ở bậc 4; 15 thô / giờ khi còn cốt truyện, 45 thô / giờ sau đó |
| Việc tuần | mỗi thứ Hai (nếu chơi): lễ tuần 15 + Hội thí 20 (bậc ≥ 3) + Mệnh Đồ 20 + đồng tu 5 |
| Sóc / Vọng | mỗi 15 ngày lịch: 15; mỗi 30 ngày thêm Đình thí 40 (bậc ≥ 4) |
| Lễ tiết | 240 / năm, rải đều theo tỉ lệ dự |
| Công | 1 thô / công |
| Độ kiếp | 50 thô mỗi lần lên bậc |
| Điều kiện lên bậc | ngưỡng canon; ngày củng cố [0, 0, 3, 10, 20, 30]; công [—, —, —, 20, 60, 150]; Quy nhất 3 đạo ≥ 250 |
| Hệ số | NT theo TL; `K_dụng`, `K_sung` **không** tính ở bản gốc (xem độ nhạy §5.4) |

Giả định có lợi cho tính đơn giản: độ kiếp đạt ngay lần đầu (cùng ngày đủ điều kiện). Mỗi lần thử lại thêm ~1 ngày lịch (20 giờ chờ).

---

## 2. Kết quả chính — ngày lịch và giờ chơi tới từng bậc

### 2.1 Bảng tổng (bản gốc)

`d` = ngày lịch kể từ ngày tạo nhân vật; `h` = giờ chơi tích lũy; `c` = công tích lũy lúc đạt.

| Kiểu | TL | Bậc 2 | Bậc 3 | Bậc 4 | Bậc 5 | Bậc 6 |
|---|---|---|---|---|---|---|
| Thong thả | 20 | d3 · 1,3 h | d15 · 4,6 h | d35 · 10,4 h | d65 · 19,6 h | **d136 · 40,8 h** · c196 |
| Thong thả | 40 | d4 · 1,7 h | d15 · 4,6 h | d38 · 11,7 h | d78 · 23,3 h | **d161 · 47,9 h** · c230 |
| Thong thả | 41 (`MAU-A`) | d4 · 1,7 h | d15 · 4,6 h | d38 · 11,7 h | d78 · 23,3 h | **d163 · 48,7 h** · c234 |
| Thong thả | 60 | d4 · 1,7 h | d17 · 5,4 h | d46 · 14,2 h | d94 · 28,3 h | **d197 · 58,7 h** · c282 |
| Thong thả | 85 | d3 · 1,3 h | d16 · 5,0 h | d46 · 14,2 h | d94 · 28,3 h | **d197 · 58,7 h** · c282 |
| Đều đặn | 20 | d2 · 1,7 h | d7 · 5,0 h | d18 · 13,3 h | d42 · 30,0 h | **d77 · 55,0 h** · c198 |
| Đều đặn | 40 | d2 · 1,7 h | d8 · 5,8 h | d19 · 14,2 h | d43 · 30,8 h | **d78 · 55,8 h** · c201 |
| Đều đặn | 41 (`MAU-A`) | d2 · 1,7 h | d8 · 5,8 h | d19 · 14,2 h | d43 · 30,8 h | **d78 · 55,8 h** · c201 |
| Đều đặn | 60 | d2 · 1,7 h | d8 · 5,8 h | d21 · 15,0 h | d44 · 31,7 h | **d91 · 65,0 h** · c234 |
| Đều đặn | 85 | d2 · 1,7 h | d8 · 5,8 h | d21 · 15,0 h | d44 · 31,7 h | **d91 · 65,0 h** · c234 |
| Chuyên tu | 20 | d1 · 1,8 h | d4 · 7,3 h | d14 · 25,7 h | d34 · 62,3 h | **d64 · 117,3 h** · c320 |
| Chuyên tu | 40 | d1 · 1,8 h | d4 · 7,3 h | d14 · 25,7 h | d34 · 62,3 h | **d64 · 117,3 h** · c320 |
| Chuyên tu | 60 | d1 · 1,8 h | d4 · 7,3 h | d14 · 25,7 h | d34 · 62,3 h | **d64 · 117,3 h** · c320 |
| Chuyên tu | 85 | d1 · 1,8 h | d4 · 7,3 h | d14 · 25,7 h | d34 · 62,3 h | **d64 · 117,3 h** · c320 |

### 2.2 Giờ chơi **cho từng bậc** (hiệu số, không cộng dồn)

| Kiểu · TL | 1→2 | 2→3 | 3→4 | 4→5 | 5→6 | Tổng |
|---|---|---|---|---|---|---|
| Thong thả · 20 | 1,3 | 3,3 | 5,8 | 9,2 | 21,2 | 40,8 |
| Thong thả · 40 | 1,7 | 2,9 | 7,1 | 11,6 | 24,6 | 47,9 |
| Thong thả · 60 | 1,7 | 3,7 | 8,8 | 14,1 | 30,4 | 58,7 |
| Thong thả · 85 | 1,3 | 3,7 | 9,2 | 14,1 | 30,4 | 58,7 |
| Đều đặn · 20 | 1,7 | 3,3 | 8,3 | 16,7 | 25,0 | 55,0 |
| Đều đặn · 40 | 1,7 | 4,1 | 8,4 | 16,6 | 25,0 | 55,8 |
| Đều đặn · 60 | 1,7 | 4,1 | 9,2 | 16,7 | 33,3 | 65,0 |
| Đều đặn · 85 | 1,7 | 4,1 | 9,2 | 16,7 | 33,3 | 65,0 |
| Chuyên tu · mọi TL | 1,8 | 5,5 | 18,4 | 36,6 | 55,0 | 117,3 |

### 2.3 Đọc kết quả

1. **Ba chế độ hãm** khác nhau theo kiểu người chơi:
   - Thong thả bị hãm bởi **Đạo Hạnh** → hệ số Nghịch Thiên phát huy đủ: TL 20 lên bậc 6 sớm hơn TL 60 **61 ngày (−31%)**, ít hơn **18 giờ chơi**.
   - Đều đặn bị hãm một phần bởi **ngày củng cố** ở bậc 5→6 với TL thấp: TL 20 / 40 / 41 đều về đích ≈ d77–78; TL 60 / 85 d91. Lợi thế lá số thấp còn **14%**.
   - Chuyên tu bị hãm hoàn toàn bởi **ngày củng cố** (3 + 10 + 20 + 30 = 63 ngày tu): mọi TL cùng về d64. Lợi thế lá số thấp của người chuyên tu **chuyển sang Thiên Bảng** (§4), không ở tốc độ cảnh giới.
2. TL 85 và TL 60 gần như trùng nhau từ bậc 3: lợi thế khởi điểm `0,4 × TL` chỉ là 10 điểm ĐCG chênh lệch — đúng canon «đi trước một bước, đường còn dài như nhau».
3. Bậc 2 đến trong 1–2 giờ chơi với mọi người — khớp phần Mở đầu «Nhập Môn» (0,5–1 giờ) + đầu Hồi I.
4. Bậc 6 ở **55–65 giờ** với người đều đặn: sau cốt truyện chính (45–60 giờ theo bản sơ đồ tổng §3) — Côn Lôn là đích sau Vĩ thanh, đúng thứ tự.

### 2.4 Đối chiếu với nhịp cốt truyện (bản sơ đồ tổng §3)

| Mốc cốt truyện | Giờ chơi (sơ đồ) | Bậc người đều đặn TL 60 có lúc đó | Khớp? |
|---|---|---|---|
| Hết Mở đầu | 0,5–1 h | bậc 1 → sắp bậc 2 | ✓ (bậc 2 ở 1,7 h) |
| Hết Hồi I (Bản Mệnh) | 6–10 h tích lũy (giả định chỉ chơi cốt truyện 36% thời gian → ≈ 20 h tổng) | bậc 3 → 4 | ✓ — Hồi II «Vạn Đạo» đi các thánh địa: bậc 3 mở Bút Tháp, Văn Miếu; bậc 4 mở thánh địa xa |
| Hồi III (Năm Hạn) | ≈ 30–40 h tổng | bậc 4 → 5 | ✓ |
| Hồi IV (Âm Dương — Phong Đô) | ≈ 40–55 h | bậc 5 (mở Phong Đô ở 31,7 h) | ✓ (Phong Đô mở trước Hồi IV) |
| Vĩ thanh Côn Lôn | ≈ 55–65 h | bậc 6 ở 65 h | ✓ sát; tài liệu 03 nên đặt Vĩ thanh mở **sau** khi bậc 6 đạt, hoặc cho lối cốt truyện (`09-01` §6.2) |

Người thong thả đến Hồi IV trước bậc 5 (cốt truyện chỉ 8 phút / ngày nhưng ĐH chậm hơn) → **cần lối cốt truyện** cho Phong Đô (đã có quy tắc ở `09-01` §6.2). Người chuyên tu lên bậc 5 (d34) khi cốt truyện mới ≈ 28 giờ → đi trước cốt truyện; không vấn đề vì bậc chỉ mở **nơi chốn**, không làm hỏng cảnh.

---

## 3. Đạo Hạnh tới bậc 6 đến từ đâu

ĐH (đã nhân NT) tích lũy **tại thời điểm đạt bậc 6**:

| Kiểu · TL | MG trong trần | Nhật Khóa | Dư Hương | Cốt truyện | Chuỗi đạo | Việc tuần | Sóc/Vọng/Đình | Lễ tiết | Công | Độ kiếp | **Tổng** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Thong thả · 20 | 1.679 | 734 | 0 | 366 | 266 | 644 | 217 | 51 | 274 | 350 | **4.581** |
| Thong thả · 60 | 1.726 | 754 | 0 | 376 | 274 | 640 | 210 | 52 | 282 | 250 | **4.564** |
| Đều đặn · 20 | 2.364 | 762 | 2 | 554 | 403 | 672 | 42 | 50 | 277 | 350 | **5.476** |
| Đều đặn · 41 | 2.040 | 659 | 1 | 478 | 348 | 619 | 36 | 43 | 239 | 298 | **4.761** |
| Đều đặn · 60 | 1.996 | 644 | 1 | 468 | 342 | 580 | 30 | 42 | 234 | 250 | **4.587** |
| Chuyên tu · 20 | 3.185 | 804 | 896 | 980 | 1.050 | 812 | 196 | 59 | 448 | 350 | **8.780** |
| Chuyên tu · 60 | 2.275 | 574 | 640 | 700 | 750 | 580 | 140 | 42 | 320 | 250 | **6.251** |

**Tỉ trọng (đều đặn · TL 60):** MG trong trần 43,5% · ngoài trần định kỳ (Nhật Khóa, tuần, tháng, lễ) 28,3% · cốt truyện + chuỗi đạo 17,7% · công 5,1% · độ kiếp 5,5%.

Đúng ý `09-03` §5.2: người đều đặn nhận **hơn nửa** Đạo Hạnh từ ngoài trần. Người chuyên tu vượt xa ngưỡng 4.500 khi bị ngày củng cố giữ lại (TL 20: 8.780 ĐH lúc lên bậc 6) — phần dư không lãng phí, nó đẩy Thiên Bảng.

Ghi chú: Sóc / Vọng của người đều đặn thấp (30–42) vì trong mô hình những ngày rằm, mùng 1 trùng ngày nghỉ của người chơi khá thường; số thật sẽ cao hơn vì Sóc / Vọng cho dự **cả ngày âm lịch** (`09-08` §5.2).

---

## 4. Thiên Bảng — Đạo Hạnh theo thời gian

### 4.1 Ảnh chụp ĐH (đã nhân NT) theo ngày lịch

| Kiểu · TL | Ngày 7 | Ngày 30 | Ngày 60 | Ngày 90 | Ngày 180 | Ngày 365 |
|---|---|---|---|---|---|---|
| Thong thả · 20 | 230 (b2) | 902 (b3) | 2.005 (b4) | 3.033 (b5) | 5.900 (b6) | 11.590 |
| Thong thả · 41 | 193 (b2) | 764 (b3) | 1.702 (b4) | 2.576 (b5) | 5.013 (b6) | 9.849 |
| Thong thả · 60 | 162 (b2) | 642 (b3) | 1.430 (b4) | 2.115 (b4) | 4.162 (b5) | 8.277 |
| Đều đặn · 20 | 511 (b3) | 2.220 (b4) | 4.258 (b5) | 6.394 (b6) | 12.460 | 23.091 |
| Đều đặn · 41 | 375 (b2) | 1.863 (b4) | 3.595 (b5) | 5.411 (b6) | 10.567 | 19.604 |
| Đều đặn · 60 | 315 (b2) | 1.566 (b4) | 3.021 (b5) | 4.497 (b5) | 8.880 | 16.474 |
| Chuyên tu · 20 | 973 (b3) | 4.286 (b4) | 8.269 (b5) | 11.519 (b6) | 21.178 | 41.040 |
| Chuyên tu · 41 | 827 (b3) | 3.643 (b4) | 7.029 (b5) | 9.792 (b6) | 18.002 | 34.884 |
| Chuyên tu · 60 | 695 (b3) | 3.061 (b4) | 5.906 (b5) | 8.228 (b6) | 15.127 | 29.314 |

### 4.2 Nhận xét cho Thiên Bảng

- Sau một năm, người chuyên tu TL 20 có **41.040 ĐH** so với 29.314 của TL 60 cùng công sức (+40%) — đúng hệ số NT 1,4. Bảng chính xếp theo Đạo Hạnh nên **người lá số thấp chăm chỉ đứng đầu** — đây là hình ảnh trung tâm của canon §4.7.
- Ở ngày 180, người đều đặn TL 20 (12.460) vẫn đứng **dưới** người chuyên tu TL 85 (15.127): công sức quyết định nhiều nhất; NT là đòn bẩy, không phải phép màu. Nhưng người đều đặn TL 20 đứng **trên** người đều đặn TL 85 (8.880) tới 40%.
- **Thiên Bảng mùa** (ĐH trong năm can chi) làm người vào sau vẫn có chỗ: người chơi vào giữa mùa 6 tháng có thể đứng ngang người đã chơi cả năm trước nếu chăm như nhau.

### 4.3 Khoảng cách tối đa trên bảng mùa (đề xuất kiểm tra hằng tháng)

| Chỉ số | Mục tiêu | Cách đo |
|---|---|---|
| Tỉ lệ ĐH mùa top 1% / trung vị | ≤ 3,5 | máy chủ, chốt Sóc |
| Tỉ lệ top 100 có TL < 40 | 25–45% (phản ánh NT, không áp đảo) | so với phân phối TL người chơi |
| Tỉ lệ top 100 bị cờ chống gian | < 1% | `mg_flag` |

---

## 5. Độ nhạy — vặn từng núm

Mỗi dòng: đổi **một** hằng số, giữ phần còn lại; ngày lịch tới bậc 6 (và bậc 5 khi đáng chú ý).

### 5.1 Bảng tổng

| Thử nghiệm | Thay đổi | Thong thả TL 20 | Thong thả TL 60 | Đều đặn TL 20 | Đều đặn TL 60 | Chuyên tu TL 20 | Chuyên tu TL 60 |
|---|---|---|---|---|---|---|---|
| Gốc | — | d136 | d197 | d77 | d91 | d64 | d64 |
| Bỏ ngày củng cố | DWELL = 0 | d136 | d197 | **d64** | d91 | **d31** | **d44** |
| Trần +20% | CAP = [30, 36, 38, 42, 46, 48] | d136 | d197 | d77 | d91 | d64 | d64 |
| Không cốt truyện (người vào muộn) | STORY = 0 | d130 | d193 | d77 | d92 | d64 | d64 |
| Hệ số trung bình +8% (`K_dụng`, `K_sung` thật) | ×1,08 | d122 | d182 | d75 | d84 | d64 | d64 |
| Không Dư Hương | tắt | d136 | d197 | d77 | d91 | d64 | d65 |
| Điều kiện công ×2 | CONG = [—, —, —, 40, 120, 300] | **d210** | **d210** | **d116** | **d116** | d64 | d64 |

### 5.2 Bỏ ngày củng cố

Người chuyên tu TL 20 lên bậc 6 ở **ngày 31** (56,8 giờ), TL 60 ở ngày 44. Không chấp nhận: bậc 5–6 trở thành chuyện của một tháng, Côn Lôn tới trước Hồi III. Ngày củng cố **không** ảnh hưởng người thong thả (họ tự nhiên chậm hơn). Kết luận: **giữ** `DWELL = [0, 0, 3, 10, 20, 30]`.

### 5.3 Trần ngày ±20%

Không đổi kết quả cho cả ba kiểu: người thong thả và đều đặn không chạm trần (17 × 0,72 = 12,2 và 32 × 0,8 = 25,6 thô < trần), người chuyên tu bị ngày củng cố giữ. Trần chủ yếu là **chống cày ngắn hạn** và giữ Thiên Bảng khỏi bị người chơi 8 tiếng / ngày áp đảo. Kết luận: trần có thể hạ hoặc nâng ±20% khi vận hành mà không làm vỡ nhịp cảnh giới; dùng trần để điều chỉnh Thiên Bảng, **không** để điều chỉnh tốc độ lên bậc.

### 5.4 Hệ số thật (+8%)

`K_dụng` (1,10 khi tu đạo hợp Dụng) và `K_sung` (1,10 khi Nguyên Khí ≥ 70) thực tế cộng ≈ +8% trung bình (người đều đặn hầu như luôn Sung Mãn — `09-09` §5.5; khoảng nửa thời gian ở đạo hợp Dụng/Hỷ). Kết quả: nhanh hơn 2–15 ngày cho người không bị ngày củng cố giữ. Chấp nhận.

### 5.5 Điều kiện công

Nhân đôi điều kiện công (`CONG` ×2) làm công trở thành **cổ chai duy nhất** với người thong thả và đều đặn: mọi TL về cùng một ngày (d210 / d116) → **mất hoàn toàn hệ số Nghịch Thiên**. Đây là kết quả quan trọng nhất của bảng độ nhạy:

> **Không được** đặt điều kiện công cao hơn mức «người làm việc thiện đều» tự nhiên đạt. Tài liệu 05 khi chốt tốc độ công / ngày phải chạy lại mô phỏng; nếu công trung bình người đều đặn < 2,6 / ngày chơi thì phải **hạ** `CONG[5]` (150) tương ứng.

Ngưỡng an toàn suy ra: `CONG[bậc] ≤ 0,8 × (công / ngày chơi) × (ngày chơi tới bậc đó của người TL 20)`. Với người đều đặn (3 công / ngày, 6 / 7 ngày): bậc 6 ở d77 → 66 ngày chơi → `0,8 × 3 × 66 = 158` ≥ 150 ✓ (vừa sát).

### 5.6 Không cốt truyện (người vào sau khi đã có nhiều chương)

Người vào muộn bỏ qua cốt truyện (hoặc cốt truyện chưa phát hành đủ) vẫn tới bậc 6 gần như cùng ngày: chuỗi đạo chạy 45 thô / giờ khi không có cốt truyện, bù lại. Điều này bảo đảm **phát hành từng phần** (cốt truyện theo đợt) không làm nhịp cảnh giới lệch.

---

## 6. Đường cong tiến trình

### 6.1 Ngưỡng và khoảng cách (canon)

| Bậc | Ngưỡng | Khoảng cách tới bậc kế | Tỉ lệ khoảng cách so với bậc trước | Trần ngày (thô) | Số ngày ở trần để vượt khoảng cách (TL 60, chỉ MG) |
|---|---|---|---|---|---|
| 1 | 0 | 100 | — | 25 | 3,0 (khởi điểm 24) |
| 2 | 100 | 300 | ×3,0 | 30 | 10,0 |
| 3 | 400 | 600 | ×2,0 | 32 | 18,8 |
| 4 | 1.000 | 1.200 | ×2,0 | 35 | 34,3 |
| 5 | 2.200 | 2.300 | ×1,9 | 38 | 60,5 |
| 6 | 4.500 | — | — | 40 | — |

Khoảng cách tăng ×2 mỗi bậc, trần tăng ×1,1 mỗi bậc → **thời gian mỗi bậc gần gấp đôi bậc trước** — đúng hình dạng mong muốn (người mới thấy tiến bộ nhanh, người lâu năm có mục tiêu dài).

### 6.2 Thô tích lũy cần (khớp `09-03` §3.2, trừ thưởng độ kiếp)

| TL | Bậc 2 | Bậc 3 | Bậc 4 | Bậc 5 | Bậc 6 |
|---|---|---|---|---|---|
| 20 | 66 | 230 | 614 | 1.421 | 3.014 |
| 40 | 70 | 270 | 733 | 1.683 | 3.550 |
| 60 | 76 | 326 | 900 | 2.050 | 4.300 |
| 85 | 66 | 316 | 900 | 2.050 | 4.300 |

(= thô cần ở `09-03` §3.2 trừ `50 × số lần độ kiếp đã qua` — mỗi lần kiếp cho 50 thô ngoài trần.)

### 6.3 Tốc độ thô / phút của từng MG (`s = 0,8` → `f = 0,86`)

| MG | B | Phút / lượt | Thô / phút | NK / lượt | Thô / NK | Thêm |
|---|---|---|---|---|---|---|
| `MG-01` Tĩnh tọa | 1 / phút | 3–15 | 0,86 | **hồi** 2 / phút | — | |
| `MG-02` Kết phù | 6 | 4 | **1,29** | 8 | 0,65 | cao nhất — theo dõi |
| `MG-03` Hương thí | 8 | 8 | 0,86 | 10 | 0,69 | |
| `MG-04` Thái Cực | 5 | 4 | 1,08 | 6 | 0,72 | |
| `MG-05` Mạn-đà-la cát | 10 | 10 | 0,86 | 10 | 0,86 | |
| `MG-06` Tụng · lạy | 6 | 5 | 1,03 | 5 | 1,03 | |
| `MG-07` Bốc thuốc | 7 | 6 | 1,00 | 6 | 1,00 | |
| `MG-08` Dương trạch | 8 | 8 | 0,86 | 8 | 0,86 | |
| `MG-09` Trạch nhật | 6 | 5 | 1,03 | 5 | 1,03 | |
| `MG-10` Đạo hiệu | 6 | 6 | 0,86 | 5 | 1,03 | |
| `MG-11` Công án | 8 | ≈ 10 | 0,69 | 4 | 1,72 | |
| `MG-12` Thư pháp | 5 | 4 | 1,08 | 5 | 0,86 | |
| `MG-13` Hái thuốc | 1 / cây | ≈ 1,5 / cây | 0,57 | 1 / cây | 0,86 | ≤ 6 cây |
| `MG-14` Pha trà | 4 | 3 | 1,15 | **hồi** 10 | — | |
| `MG-15` Luyện đan | 9 | 10 | 0,77 | 12 | 0,65 | + đan |
| `MG-16` Thả đèn | 2 | 2 | 0,86 | 0 | — | 1 / ngày |
| `MG-17` Chuông | 3 | 3 | 0,86 | 3 | 0,86 | |
| `MG-18` Họa luân | 5 | ≈ 7,5 | 0,57 | 4 | 1,08 | |
| `MG-19` Bái Đẩu | 6 | 5 | 1,03 | 5 | 1,03 | |
| `MG-20` Kinh hành | 0,8 / phút | 5–12 | 0,69 | 4 | 1,72 (lượt 10 phút) | |
| `MG-21` Phóng sinh | 5 | 4 | 1,08 | 3 | 1,43 | + ≤ 3 công |
| `MG-22` Đối chất | 8 | 6 | 1,15 | 8 | 0,86 | + ≤ 2 công |
| `MG-23` Sổ nghiệp | 8 | 8 | 0,86 | 8 | 0,86 | trả Nợ Âm |
| `MG-24` Tam chẩn | 12 | 10 | 1,03 | 12 | 0,86 | + ≤ 3 công |
| `ACT-001` Án khách | 5 | 6 | 0,72 | 4 | 1,08 | PK cao nhất |
| `ACT-021`–`028` Sảnh nghề | 4 | 5 | 0,69 | 4 | 0,86 | |

**Kiểm tra chiến lược áp đảo:** MG nhanh nhất (`MG-02`, 1,29 thô / phút) chơi 3 lượt đủ hệ số = 15,5 thô; lượt 4–5 chỉ còn 0,65 thô / phút (`K_lặp` 0,5), thấp hơn mọi MG khác → người chơi tự đổi MG. Không có MG nào vừa nhanh vừa không tiêu NK. Chênh lệch tối đa giữa MG nhanh và chậm (1,29 / 0,57 = 2,3 lần) là chủ ý: các MG chậm (`MG-13`, `MG-18`) có giá trị khác (vật phẩm, sáng tác) và MG nhóm Hạnh cho thêm công.

**Đề xuất theo dõi:** nếu đo lường cho thấy `MG-02` chiếm > 20% thô trong trần của người bậc 2–4 → hạ B xuống 5.

---

## 7. Bảng mọi trần và giới hạn (một chỗ để tra)

| Giới hạn | Giá trị | Nơi định nghĩa |
|---|---|---|
| Trần thô ngày | 25 / 30 / 32 / 35 / 38 / 40 theo bậc | `09-03` §5.1 |
| Dư Hương | tích ≤ 20; chuyển ≤ 10 / sáng | `09-03` §5.3 |
| `K_lặp` | lượt 1–3: 1 · 4–5: 0,5 · 6+: 0,1 (mỗi MG mỗi ngày) | `09-03` §2.2 |
| Nguồn tuần ngoài trần | ≤ 60 thô / tuần | `09-03` §5.4 |
| Nhật Khóa | 6–10 thô / ngày | `09-09` §3.1 |
| Hái thuốc tính thưởng | 6 cây / ngày | `09-06` MG-13 |
| Công từ MG | `MG-21` ≤ 3 · `MG-22` ≤ 2 · `MG-24` ≤ 3 / ngày | `09-07` |
| Hộ pháp | ≤ 2 công / ngày | `09-02` §1.5 |
| Mời trà | 1 công / ngày | `09-06` MG-14 |
| Bố thí đổi Phúc Khí | 1 lần / ngày (30 PK → 2 công) | `09-08` `ACT-082` |
| Án Cổ | 5 thô / án, một lần | `09-03` §7 |
| SQ vùng | ≤ 1.200 thô suốt đời | `09-03` §8 |
| Hồi Nguyên Khí chủ động | ≤ 150 / ngày | `09-09` §5.6 |
| Nghỉ đêm | 1 / ngày, cách ≥ 6 giờ | `09-09` §5.6 |
| Pha trà hồi NK | lượt 1–3: +10, lượt 4+: +3 | `09-06` MG-14 |
| Đan Thanh Tâm | 1 viên / ngày | `09-06` MG-15 |
| Thử lại pha kiếp | sau 20 giờ | `09-02` §1.3 |
| Đổi đạo chính | 1 / 30 ngày | `09-01` §10.2 |
| Sửa ngày giờ sinh | 1 lần, trong 7 ngày đầu và trước bậc 2 | `09-01` §12.2 |
| Đổi múi giờ | giữ múi cũ nếu > 1 lần / 30 ngày | `09-03` §5.1 |
| Đồng bộ ngoại tuyến | > 72 giờ → nhận theo trần ngày đồng bộ | `09-03` §12 |

---

## 8. Phúc Khí và Cấp (`progress.js`) song song

### 8.1 Phúc Khí ước tính mỗi ngày chơi (web)

| Nguồn | Thong thả | Đều đặn | Chuyên tu | Nguồn code |
|---|---|---|---|---|
| Án khách (3 × `15 × total`) | 11 (1 khách) | 33 | 36 | `CASE_REWARD.npcMax` |
| Sảnh nghề (`15 × total`) | 0 | 22 (2 sảnh) | 77 (7 sảnh) | `DESK_REWARD` |
| Lịch + nhang + la bàn + Tam Sự | 12 | 17 | 17 | `REWARD` |
| Trà ngồi | 5 | 15 | 15 | `CAPS.teaPerDay` |
| Xăm, đèn | 3 | 9 | 12 | `REWARD.stick`, `.lantern` |
| MG (`round(thô × 0,5)`) | 6 | 13 | 20 | `09-03` §2.2 |
| Đèn Thái Tuế | 3 | 3 | 3 | `LAMP_REWARD.daily` |
| **Tổng / ngày chơi** | **≈ 40** | **≈ 112** | **≈ 180** | |

iOS: trừ xăm, đèn, đèn Thái Tuế → ≈ 34 / 100 / 165.

### 8.2 Cấp theo ngày lịch (`xpFor(L) = 20·(L−1)²`)

| Cấp | XP cần | Thong thả (≈ 29 / ngày lịch) | Đều đặn (≈ 96 / ngày lịch) | Chuyên tu (≈ 180 / ngày lịch) |
|---|---|---|---|---|
| 2 | 20 | d1 | d1 | d1 |
| 4 | 180 | d7 | d2 | d1 |
| 6 | 500 | d18 | d6 | d3 |
| 8 | 980 | d34 | d11 | d6 |
| 10 | 1.620 | d57 | d17 | d9 |
| 15 | 3.920 | d137 | d41 | d22 |
| 20 | 7.220 | d252 | d76 | d41 |
| 30 | 16.820 | d588 | d176 | d94 |

Cấp tăng nhanh hơn cảnh giới ở đầu (người mới thấy «lên cấp» liên tục, nhận Ngọc +20 / cấp — canon §7), chậm dần theo căn bậc hai. Từ cấp 10 trở đi Cấp chỉ còn là thước đo tham gia + Ngọc; tiến trình chính là cảnh giới.

**Hệ quả migration** (`09-01` §7.4): người cũ cấp 8 (xp ≥ 980) có `fly` trước khi lên bậc 3. Với người mới, `fly` ở bậc 3 = d4 (chuyên tu) đến d17 (thong thả) — sớm hơn cấp 8 cũ (d6–d34). Không ai thiệt khi đổi.

---

## 9. Ước tính phân bố người chơi theo bậc

Giả định cơ cấu (cần thay bằng số đo thật của app sau tháng đầu): 50% thong thả, 35% đều đặn, 15% chuyên tu; TL phân bố quanh 45 (độ lệch 12) → nhóm TL 20 ≈ 3%, 40 ≈ 35%, 60 ≈ 10%. Dùng hàng TL 41 cho số đông.

| Ngày kể từ ra mắt (người chơi từ ngày đầu, còn chơi) | Bậc 1–2 | Bậc 3 | Bậc 4 | Bậc 5 | Bậc 6 |
|---|---|---|---|---|---|
| Ngày 7 | 85% | 15% | 0% | 0% | 0% |
| Ngày 30 | 0% | 50% | 50% | 0% | 0% |
| Ngày 60 | 0% | 0% | 50% | 50% | 0% |
| Ngày 90 | 0% | 0% | 0% | 50% | 50% |
| Ngày 180 | 0% | 0% | 0% | 0% | 100% |

(Bảng chỉ cho người **còn chơi đều** theo đúng kiểu; người bỏ dở nằm ở bậc thấp hơn. Mục đích: đội sự kiện biết vào ngày 60 phần lớn người chơi trung thành ở bậc 4–5, nên lễ tiết tháng thứ 3 nên thiết kế cho bậc 4–5.)

---

## 10. Nguyên Khí — kiểm tra bằng số

| Kịch bản | Kết quả | Chi tiết |
|---|---|---|
| Đều đặn V = 50, 3 phiên / ngày | luôn Sung Mãn đầu lượt | `09-09` §5.5 |
| Chuyên tu V = 20, 110 phút liền có xen trà + tĩnh tọa | thấp nhất 26 (Hư một lượt) | `09-09` §5.5 |
| Chuyên tu V = 80, 110 phút liền **không** nghỉ (8 MG nặng) | Hư ở phút ≈ 70, Kiệt ở phút ≈ 85 | chi phí ≈ 96 / 85 phút, hồi tự nhiên +15 |
| Người chơi đêm (23:00–03:00) 2 giờ | hồi tự nhiên 10 thay vì 20 | không phạt gì khác |

Mất mát ĐH do Hư / Kiệt với người chuyên tu không nghỉ: lượt Hư mất 20% thô; trong 110 phút chỉ 2–3 lượt bị ảnh hưởng → ≈ −3% ĐH ngày. Nguyên Khí là **gợi ý nhịp**, không phải trần thứ hai — đúng thiết kế.

---

## 11. Núm vận hành (live-ops)

| Triệu chứng đo được | Núm vặn | Tác động dự kiến (từ §5) | Không được vặn |
|---|---|---|---|
| Người chuyên tu lên bậc 6 quá nhanh | `DWELL[5]` 30 → 40 | +10 ngày cho chuyên tu; 0 cho thong thả | ngưỡng canon |
| Người thong thả bỏ cuộc ở bậc 3–4 (tỉ lệ rời > 40% ở bậc 3) | Nhật Khóa 6 → 8; Dư Hương ≤ 15 / sáng | −10–15% ngày cho thong thả | NT |
| Thiên Bảng bị vài người áp đảo | trần ngày −10% | không đổi nhịp cảnh giới | — |
| Một MG chiếm > 20% thô | B của MG đó −1 | — | `K_lặp` |
| Điều kiện công thành cổ chai (mọi TL về cùng ngày) | hạ `CONG[k]` theo công thức §5.5 | khôi phục NT | — |
| Tỉ lệ rẽ Tà Lộ ở độ kiếp > 20% | viết lại lời thoại pha Tâm Tham | — | thưởng Âm Bài (canon) |
| Hội thí / Đình thí quá khó (< 30% đạt `s_min`) | ngân hàng câu theo độ khó (`09-04` MG-03) | — | ngưỡng `s_min` của kiếp |

Mọi hằng số nằm trong một tệp cấu hình máy chủ (chưa có — cần làm, tài liệu 13 đặt `SCHEMA-*`); đổi hằng số phải chạy lại bộ mô phỏng §12 và đính kèm kết quả vào ghi chú phát hành.

---

## 12. Bộ mô phỏng (để chạy lại)

Mã tham chiếu (JavaScript, chạy bằng `node`), đúng phiên bản sinh ra mọi bảng trên. Đề xuất đặt tại `scripts/sim-tu-luyen.mjs` khi đội kỹ thuật dựng (chưa có — cần làm).

```js
const TH = [0, 100, 400, 1000, 2200, 4500];
const BASE = {
  CAP: [25, 30, 32, 35, 38, 40], CONG: [0, 0, 0, 20, 60, 150], DWELL: [0, 0, 3, 10, 20, 30], QUY: 250,
  STORY: 700, STORY_RATE: 20, CQ_EACH: 250, CQ_RATE_DURING_STORY: 15, CQ_RATE: 45,
  NHAT_KHOA: 6, WEEK: { le: 15, hoi: 20, menhdo: 20, dongtu: 5 }, SOC: 15, VONG: 15, DINH: 40,
  FEST_YEAR: 240, KIEP: 50, CONG_DH: 1, AVGK: 1.0, DUHUONG: true,
};
const NT = (tl) => Math.min(1.5, Math.max(1, 1 + (60 - tl) / 100));
const ARCH = {
  thongtha: { min: 25, days: 5, mgMin: 17, storyMin: 8, nk: 0.6, wk: 0.5, mo: 0.5, fe: 0.4, cong: 2, eff: 0.72 },
  deudan:   { min: 50, days: 6, mgMin: 32, storyMin: 18, nk: 0.9, wk: 0.85, mo: 0.8, fe: 0.7, cong: 3, eff: 0.8 },
  chuyentu: { min: 110, days: 7, mgMin: 60, storyMin: 50, nk: 1, wk: 1, mo: 1, fe: 1, cong: 5, eff: 0.88 },
};
export function sim(tl, a, o = {}) {
  const A = ARCH[a], Q = { ...BASE, ...o }, nt = NT(tl) * Q.AVGK;
  let dh = 0, tier = 1, cong = 0, hours = 0, story = Q.STORY, cq = 0, streak = 0, r = 7, act = 0, du = 0;
  const trad = [0, 0, 0], res = [];
  const rnd = () => { r = (r * 16807) % 2147483647; return r / 2147483647; };   // hạt giống cố định
  for (let d = 1; d <= 700; d++) {
    const dow = d % 7;
    if (!(A.days === 7 || dow < A.days)) continue;                               // ngày nghỉ
    hours += A.min / 60; act++;
    const raw = A.mgMin * A.eff, cap = Q.CAP[tier - 1];
    const tho = Math.min(cap, raw);
    if (Q.DUHUONG) du = Math.min(20, du + Math.max(0, raw - cap));
    const nTrad = tier >= 4 ? 3 : tier >= 3 ? 2 : tier >= 2 ? 1 : 0;
    if (nTrad) { if (tier >= 4) { const i = trad.indexOf(Math.min(...trad)); trad[i] += tho * 0.7; }
                 else for (let i = 0; i < nTrad; i++) trad[i] += (tho * 0.6) / nTrad; }
    let x = tho;
    if (Q.DUHUONG && du > 0) { const c = Math.min(10, du); du -= c; x += c; }
    if (rnd() < A.nk) { streak++; x += Q.NHAT_KHOA + Math.min(4, Math.floor(streak / 7)); }
    const sm = A.storyMin / 60;
    if (story > 0) { const s = Math.min(story, Q.STORY_RATE * sm); story -= s; x += s; }
    const cqOpen = (tier >= 2 ? Q.CQ_EACH : 0) + (tier >= 3 ? Q.CQ_EACH : 0) + (tier >= 4 ? Q.CQ_EACH : 0);
    if (cq < cqOpen) { const g = Math.min(cqOpen - cq, (story > 0 ? Q.CQ_RATE_DURING_STORY : Q.CQ_RATE) * sm);
                       cq += g; x += g; const i = Math.min(nTrad - 1, Math.floor(cq / Q.CQ_EACH)); if (nTrad) trad[Math.max(0, i)] += g; }
    if (dow === 1 && rnd() < A.wk) { const W = Q.WEEK; x += W.le + (tier >= 3 ? W.hoi : 0) + W.menhdo + W.dongtu; }
    if (d % 15 === 0 && rnd() < A.mo) x += Q.SOC + ((d % 30 === 0 && tier >= 4) ? Q.DINH : 0);
    x += (A.fe * Q.FEST_YEAR / 365) * 7 / A.days;
    cong += A.cong; x += A.cong * Q.CONG_DH;
    dh += x * nt;
    while (tier < 6) {
      const score = tier < 3 ? dh + 0.4 * tl : dh;
      const ok = act >= Q.DWELL[tier] && score >= TH[tier] && cong >= Q.CONG[tier]
              && (tier !== 5 || trad.every((t) => t >= Q.QUY));
      if (!ok) break;
      tier++; act = 0; dh += Q.KIEP * nt;
      res.push({ tier, d, h: +hours.toFixed(1), cong });
    }
  }
  return res;
}
```

Giới hạn của mô hình (ghi rõ để không tin quá mức):

| Giới hạn | Ảnh hưởng | Cách khắc phục khi có số thật |
|---|---|---|
| Tốc độ MG cố định theo kiểu | thực tế tăng dần khi người chơi thạo | thay `eff` bằng đường cong học từ `mg_end` |
| Không mô phỏng thử lại độ kiếp | +1 ngày / lần thử lại | thêm xác suất đạt theo `kiep_phase` |
| Không có Tà Lộ (Âm Bài ×2 rồi Nợ Âm) | người rẽ Tà Lộ nhanh 7 ngày rồi chậm | mô phỏng nhánh riêng khi tài liệu 05 chốt |
| Mùa hè / lễ Tết làm thay đổi thời gian chơi | dao động ±20% | dùng phân phối thời gian chơi thật |
| Tốc độ công (2 / 3 / 5) là giả định | quyết định cổ chai §5.5 | lấy từ Sổ Công Quá thật |

---

## 13. Nghiệm thu phần cân bằng

- [ ] Bộ mô phỏng có trong `scripts/`, chạy bằng `node`, in lại đúng bảng §2.1 (sai số 0 ngày với hạt giống 7).
- [ ] Mọi thay đổi hằng số kinh tế kèm kết quả chạy lại §2.1 và §5.1 trong ghi chú phát hành.
- [ ] Sau 30 ngày vận hành: so `kiep_result` thật với §2.1; lệch > 25% thì vặn núm theo §11.
- [ ] Thiên Bảng: chỉ số §4.3 nằm trong khoảng mục tiêu.
- [ ] Kiểm tra cổ chai công (§5.5) mỗi khi tài liệu 05 đổi bảng `DEED-*`.

---

## 14. Ra mắt theo mốc (khớp lộ trình M0–M6 của bản sơ đồ tổng §13.4)

### 14.1 Mini-game có ở từng mốc

Bản sơ đồ tổng đặt «cảnh giới» ở **M3** và các thánh địa theo đợt (M2: Long Hổ, Võ Đang, Bút Tháp; M3: Yên Tử, Văn Miếu, Mao Sơn, Chung Nam; M4: Phong Đô, Miêu Cương; M5: Tạng Địa, Côn Lôn).

| Mốc | MG mới phát hành | Tổng MG | Nhóm Nhật Khóa đủ? | Độ kiếp có |
|---|---|---|---|---|
| M1 (Sơn Môn thật hóa) | `MG-01`, `03` (Hương thí), `04`, `06`, `07`, `08`, `09`, `12`, `13`, `14`, `16`, `17`, `18`, `20` (bậc Sơn Môn) | 14 | đủ 6 nhóm (Hạnh = án khách) | — |
| M2 (Long Hổ, Võ Đang, Bút Tháp) | `MG-02`, `10`, `15`, `19`, `21` | 19 | đủ | (đề xuất) `ACT-K2-*`, `ACT-K3-CN / TV / TD` |
| M3 (Yên Tử, Văn Miếu, Mao Sơn, Chung Nam + cảnh giới + Định Mệnh Hội) | `MG-11`, `22`, `24`, `05` (khay nhỏ Am Vân Cốc), `03` Hội thí / Đình thí | 23 | đủ | `ACT-K3-*` còn lại, `ACT-K4-*` |
| M4 (Phong Đô, Miêu Cương) | `MG-23` | 24 | đủ | `ACT-K5-*` |
| M5 (Tạng Địa, Côn Lôn) | `MG-05` đàn lớn | 24 | đủ | `ACT-K6-*`, `ACT-K6-QN` |

Với 14 MG ở M1, `K_lặp` không bao giờ ép người chơi xuống lượt thứ 4 của cùng MG trước khi chạm trần (3 lượt × 14 MG ≫ trần 25–30) → nhịp Đạo Hạnh **không phụ thuộc** số MG đã phát hành, chỉ phụ thuộc thời gian chơi (`§6.3`).

### 14.2 Vấn đề «Đạo Hạnh tích trước khi có cảnh giới»

Nếu Đạo Hạnh bắt đầu tích từ M1 mà thang cảnh giới tới M3 mới có, người chơi sớm mang theo một khối ĐH lớn. Mô phỏng 70 ngày (M1 + M2 ≈ 10 tuần), bậc bị giữ ở 1 (trần 25), cốt truyện có ≈ 200 thô (Mở đầu + Hồi I + một phần Hồi II):

| Kiểu · TL | ĐH tích lũy ngày 70 | Công | Đủ ĐH cho bậc |
|---|---|---|---|
| Thong thả · 20 | 1.838 | 100 | 4 |
| Thong thả · 41 | 1.562 | 100 | 4 |
| Thong thả · 60 | 1.313 | 100 | 4 |
| Đều đặn · 20 | 3.818 | 180 | 5 |
| Đều đặn · 41 | 3.245 | 180 | 5 |
| Đều đặn · 60 | 2.727 | 180 | 5 |
| Chuyên tu · 20 | 5.796 | 350 | 6 (ĐH) |
| Chuyên tu · 60 | 4.140 | 350 | 5 |

Khi M3 mở cảnh giới, những người này vẫn phải đi **từng độ kiếp** và **từng ngày củng cố** (3 + 10 + 20 + 30 = 63 ngày tu tối thiểu tới bậc 6). Kết quả: người chơi sớm không «nhảy» lên bậc 6 trong một ngày, nhưng có cảm giác bị giữ lại (ĐH thừa, bậc thấp) trong 2 tháng.

**Hai phương án:**

| Phương án | Mô tả | Ưu | Nhược |
|---|---|---|---|
| A — Ra cảnh giới bậc 1–3 ở **M2** | thang và độ kiếp bậc 2–3 của 3 đạo đã có thánh địa (CN, TV, TD) + 3 cửa nhập môn; bậc 4+ ở M3 | ĐH tích lũy được «tiêu» vào tiến trình ngay; người chơi sớm thấy thang; khớp M2 có Long Hổ, Võ Đang, Bút Tháp | M2 nặng hơn (thêm 6 độ kiếp, Sổ Tu, HUD) |
| B — Giữ cảnh giới ở M3, ĐH ẩn tới M3 | ĐH vẫn tính (máy chủ), Sổ Tu chỉ hiện «tích lũy» | M2 nhẹ | tạo «bức tường» ở M3; giảm ngày củng cố tạm thời (×0,5 trong 30 ngày đầu M3) để bù |

Đề xuất của tài liệu 09: **phương án A** (đưa vào câu hỏi mở cho tài liệu 13). Với phương án A, bậc 3 (cần độ kiếp đạo thống) ở M2 chỉ chọn được CN / TV / TD; các đạo khác có phân đàn nhưng độ kiếp bậc 3 của họ mở ở M3 — người chọn đạo đó đứng ở bậc 2 tới M3 (ghi rõ trong Sổ Tu: «Thầy của con đang lên đường»).

### 14.3 Kiểm tra cân bằng sau mỗi mốc

| Sau mốc | Chạy lại | So với |
|---|---|---|
| M1 | thô / phút từng MG thật (`dh_gain`) | §6.3 |
| M2 | ngày tới bậc 2, 3 (phương án A) | §2.1 |
| M3 | tỉ lệ cổ chai công, ngày củng cố | §5.5, §5.2 |
| M4 | Nợ Âm, sám hối, tỉ lệ rẽ Tà Lộ | `09-11` §9.2 |
| M5 | ngày tới bậc 6, Thiên Bảng | §2.1, §4.3 |
