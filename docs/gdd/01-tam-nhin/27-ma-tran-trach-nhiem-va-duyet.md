# 01 · Phần 27 — Ma trận trách nhiệm trụ cột cho các tài liệu 02–14, quy trình duyệt, biểu mẫu

> Tài liệu 01 đặt luật; các tài liệu 02–14 thi hành. Phần này nói **mỗi tài liệu phải chứng minh gì** với từng trụ cột, **ai duyệt**, **khi nào**, và cấp **biểu mẫu** dùng chung.

## 1. Ma trận: tài liệu × trụ cột

Ô ghi điều tài liệu đó **bắt buộc chứng minh** (đính kèm trong README của tài liệu ấy, mục «Đối chiếu tài liệu 01»).

| Tài liệu | T1 | T2 | T3 | T4 | T5 | T6 |
|---|---|---|---|---|---|---|
| **02 Thế giới** | lore không mâu thuẫn chỉ số | Định Mệnh Hội trình bày đủ mạnh (`VD-T2-28`) | phe phản diện không là quái | 12 thánh địa có nguyên mẫu | tín ngưỡng đúng nguồn; quyết Vân Cốc là ai (phần 7 §2.3) | không bôi nhọ dân tộc / tôn giáo |
| **03 Cốt truyện** | lời phán từ engine; nhánh `BR-*` theo `patternQuality` | mọi nhánh tới Côn Lôn; lời khó có việc làm; can chi thay năm (`AL-08`) | không trận đánh; phản diện bị vạch mặt | cảnh đặt ở nơi đi tới được | `checkNeo` cho cảnh AI | biến thể iOS, vị thành niên; Tà Lộ không hướng dẫn |
| **04 Chỉ số** | bảng nguồn engine cho từng chỉ số; chạy bộ `MAU-C…` | hệ số Nghịch Thiên; mô phỏng 60 giờ (phần 1 §2.6) | không chỉ số sát thương | — | tên gốc cạnh tên game | Nguyên Khí không là «sức khỏe»; lọc câu y khoa của thần sát |
| **05 Cải mệnh** | `CONG_QUA` đúng điểm engine (phần 22 §3.4) | không khóa đích; hồi đầu luôn mở | sám hối kèm hành động | việc thiện ở nơi có thật | mốc Liễu Phàm ghi rõ đã chia 10 | không bán; trần «đọc kinh» mỗi ngày |
| **06 NPC · AI** | AI chỉ đọc brief | RB2 trong mọi persona | — | NPC có lịch sinh hoạt | thẻ persona phần 8 §6; bộ thử phần 23 | khủng hoảng rời vai; Lạt-ma chờ tham vấn |
| **07 Thánh địa** | — | — | không đấu trường | hạng A–E, 7 thứ, bảng màu khóa, đường nhìn (phần 18) | cố vấn duyệt | Tạng chờ; không phá nơi thờ |
| **08 Công trình** | — | — | — | Definition of Done bản sơ đồ §8.5 | bộ mô-đun đúng đạo thống | không leo tượng |
| **09 Tu luyện** | đạo thống hợp Dụng +10 % (`_YONG2CULT`) | không bắt buộc đạo hợp Dụng | Tứ Tu, năm thành phần thử thách (phần 1 §3.2) | hoạt động gắn nơi | nội đan, thiền đúng | tịch cốc, khí công: cảnh báo |
| **10 Xã hội** | dữ liệu MMO tối thiểu | Thiên Bảng theo Đạo Hạnh; bảng phụ | không va chạm người chơi; không PvP | lễ theo âm lịch | — | chat lọc; vị thành niên |
| **11 Kinh tế** | Hợp mệnh chỉ Phúc Khí | không bán tu (phần 16 §5) | — | — | — | kiểm toán phần 3; trần chi tiêu; không dark pattern |
| **12 Trình bày** | «Vì sao?» mọi số | lời văn phần 19 | không ngôn ngữ chiến đấu | ánh sáng phần 12 | chữ Hán duyệt | trợ năng `TN-*`; âm thanh nghi lễ có phép |
| **13 Kỹ thuật** | test đối chiếu `KPI-24` | — | — | portal cell, hiệu năng | `checkNeo` trong luồng | dữ liệu: không gửi ngày sinh; nhóm điểm có đồng ý |
| **14 Rủi ro** | — | theo dõi `KPI-04`, `KPI-05` | — | — | sổ cố vấn | danh mục thiêng phần 2 §7.2 |

## 2. Quy trình duyệt

| Bước | Ai | Khi | Đầu ra |
|---|---|---|---|
| 1. Tự kiểm | tác giả spec | trước khi xin duyệt | bảng «một tính năng mới phải qua» (phần 2 §8.6) đã điền |
| 2. Quét tự động | công cụ (tài liệu 13) | mỗi lần gộp nội dung | báo cáo cụm cấm (phần 8 §2), palette (phần 12 §6), `KPI-24` |
| 3. Duyệt trụ cột | người giữ trụ cột liên quan (phần 2 §8.5) | trong 3 ngày làm việc | đạt / sửa / chặn, kèm mã câu kiểm |
| 4. Duyệt cố vấn | cố vấn truyền thống | trước mốc M của vùng | biên bản ký |
| 5. Chơi thử | người chơi thật (phần 21 §2) | mỗi mốc | báo cáo sáu trục + phỏng vấn |
| 6. Cho phát hành | sản xuất + người giữ T6 | trước bản build | ký; điều kiện chặn phần 16 §6 |

**Thời hạn phúc đáp:** người giữ trụ cột trả lời trong 3 ngày; quá hạn thì chuyển lên người giữ T6 (không coi là đồng ý ngầm).

## 3. Biểu mẫu

### 3.1 Phiếu xung đột trụ cột

```
PHIẾU XUNG ĐỘT — số: XD-<năm>-<số>
Tính năng / spec: …
Trụ cột A: …   Câu kiểm bị chạm: KT-…
Trụ cột B: …   Câu kiểm bị chạm: KT-…
Đề xuất A (nghiêng trụ cột A): …
Đề xuất B (nghiêng trụ cột B): …
Đề xuất tách lớp (nếu có): lớp nào trụ cột nào quản …
Án lệ gần nhất (phần 2 §8.4): AL-…
Quyết định: …   Người ký: …   Ngày: …
Ghi vào sổ án lệ: AL-<số mới>
```

### 3.2 Phiếu duyệt cố vấn truyền thống

```
PHIẾU DUYỆT CỐ VẤN — vùng / chuỗi: …
Truyền thống: …   Cố vấn: … (vai trong truyền thống)
Hạng mục đã xem: kiến trúc □ trang phục □ thoại □ nghi lễ □ âm thanh □ chữ □
Chỗ đồng ý: …
Chỗ yêu cầu sửa (bắt buộc trước phát hành): …
Chỗ khuyên (không bắt buộc): …
Nội dung cấm đưa vào: …
Ký: …   Ngày: …
```

### 3.3 Phiếu báo lỗi cổ pháp (cho người chơi — `YC-12`)

```
Bạn thấy chỗ nào chưa đúng?
Màn / nơi: …            (tự điền vị trí, nhiệm vụ)
Game nói: …
Theo bạn đúng là: …
Nguồn (sách, thầy, trang): …
Ghi tên bạn trong Tàng kinh nếu được sửa? □ có □ không
```

Phản hồi trong 7 ngày (`KPI-23`): «đã sửa», «giữ nguyên vì …» (kèm nguồn), hoặc «đang hỏi cố vấn».

### 3.4 Phiếu chơi thử — sáu trục (phát cho người chơi, phút 15 / 30 / 45)

```
Lúc này bạn cảm thấy (0 = không chút nào, 10 = rất nhiều):
Được hiểu: __   Lo lắng: __   Hy vọng: __   Tự mình làm chủ: __   Yên: __   Gắn với người khác: __
Một câu bạn muốn nói ngay bây giờ: ……
```

## 4. Sổ án lệ — cách dùng

- Mỗi án lệ mới đánh số tiếp `AL-17` trở đi, ghi vào bảng phần 2 §8.4 (tài liệu 01 là chủ sổ).
- Án lệ **không bị xóa**; nếu đổi quyết định, thêm án lệ mới dẫn số cũ («thay `AL-07`»).
- Mỗi quý, người giữ T6 rà sổ và đề xuất nâng án lệ lặp lại thành câu kiểm **[B]** mới.

## 5. Lịch áp dụng tài liệu 01 theo mốc sản xuất

| Mốc (bản sơ đồ §13.4) | Phần của tài liệu 01 phải áp | Cổng chặn |
|---|---|---|
| **M0** — Mệnh Bàn, persona AI, Vân Cốc, Khổng tiên sinh, Mở đầu | phần 1 (T1, T2), 4–5 (PS-02, PS-03, PS-06), 6 §4.1, 7 §2, 8, 9, 23, 25 §2 | `KPI-24` 100 %; bộ thử AI nhóm B, C 100 %; chơi thử nhóm `NA` không ai «bị phán xét» |
| **M1** — Sổ Công Quá, Mệnh Đồ, Hồi I, nội thất Sơn Môn | phần 2 (T4), 3 (kiểm toán P0 xong), 12 §3.2, 13 §6, 19, 22 §3.4 | kiểm toán Tàng Y Các P0 xong trước khi bật thanh toán |
| **M2** — Long Hổ, Võ Đang, Bút Tháp, Hồi II | phần 12 §3.3–3.4, §3.8; 17 (cảnh 08, 09, 12); 18 §3, §4, §8; 24 | duyệt cố vấn Đạo, Phật |
| **M3** — Yên Tử, Văn Miếu, Mao Sơn, Chung Nam, cảnh giới, Định Mệnh Hội | phần 17 (10, 11, 13), 20 (24–27), 18 | duyệt cố vấn Thiền, Nho |
| **M4** — Hồi III–IV, Tà Lộ, Phong Đô, Miêu Cương | phần 6 §4.4–4.6, 17 (14–17), 21 (PS-11, PS-14), 26 §3 | duyệt nội dung nhạy cảm; `KPI-15`, `KPI-16` có kế hoạch đo |
| **M5** — Tạng Địa, Côn Lôn, Vĩ thanh | phần 7 §6 (sau tham vấn), 17 (18) | **không ra Tạng nếu chưa có biên bản cố vấn** |
| **M6** — môn phái, sư đồ, mùa | phần 5 (PS-08), 16 (toàn bộ) | công bố tuyên ngôn kiếm tiền (phần 16 §5) |
