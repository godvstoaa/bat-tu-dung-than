# 11 · Phần 17 — Vận hành SEASON-01 (丁未 Đinh Mùi): lịch tuần, Lộ Thư, phát hành món

> Lịch vận hành cụ thể cho mùa đầu tiên: mốc ngày (tính bằng `lunar-javascript` đã có trong dự án), cách chia tuần Lộ, kho mẫu việc Lộ Thư, Lộ Thư từng tuần của 4 chương, lịch phát hành món ở Y Các, cửa sổ giảm giá, thông báo, và các mốc quyết định của mùa thử (phần 08: chương Xuân và Hạ chỉ có Thanh Lộ; Kim Thư mở từ Thu).
>
> Sự kiện lễ (`EV-*`) do tài liệu 10 viết kịch bản; ở đây chỉ ghi phần kinh tế của lễ.

---

## 1. Mốc ngày SEASON-01

Tính bằng `Lunar.fromYmd(...).getSolar()` và `getJieQiTable()` của `lunar-javascript`:

| Mốc | Âm lịch | Dương lịch | Thứ |
|---|---|---|---|
| Lập Xuân — mở mùa, mở chương Xuân | tiết 立春 | 04/02/2027 | Năm |
| Tết Đinh Mùi | 1/1 | 06/02/2027 | Bảy |
| Hết cửa sổ bán món Tết | 10/1 | 15/02/2027 | Hai |
| Thượng Nguyên | 15/1 | 20/02/2027 | Bảy |
| Hàn Thực | 3/3 | 09/04/2027 | Sáu |
| Lập Hạ — chương Hạ | tiết 立夏 | 06/05/2027 | Năm |
| Phật đản (không bán) | 15/4 | 20/05/2027 | Năm |
| Đoan Ngọ | 5/5 | 09/06/2027 | Tư |
| Lập Thu — chương Thu, **mở Kim Thư** | tiết 立秋 | 08/08/2027 | Chủ nhật |
| Thất Tịch | 7/7 | 08/08/2027 | Chủ nhật |
| Vu Lan (không bán, chỉ quà) | 15/7 | 16/08/2027 | Hai |
| Trung Thu | 15/8 | 15/09/2027 | Tư |
| Trùng Cửu | 9/9 | 08/10/2027 | Sáu |
| Lập Đông — chương Đông | tiết 立冬 | 07/11/2027 | Chủ nhật |
| Hạ Nguyên (không bán) | 15/10 | 12/11/2027 | Sáu |
| Tết Thầy (không bán) | — | 20/11/2027 | Bảy |
| Đông Chí | tiết 冬至 | 22/12/2027 | Tư |
| Ông Công Ông Táo | 23/12 | 19/01/2028 | Tư |
| Tết Mậu Thân | 1/1 | 26/01/2028 | Tư |
| Lập Xuân — hết SEASON-01, mở SEASON-02 | tiết 立春 | 04/02/2028 | Sáu |

**Ca biên đã gặp:** Tết Mậu Thân (26/01/2028) rơi **trước** Lập Xuân 2028, tức trong chương Đông của SEASON-01. Cửa sổ bán món Tết (23 tháng Chạp → mùng 10 = 19/01 → 04/02/2028) vắt qua ranh giới mùa. Quy tắc: cửa sổ lễ theo **âm lịch**, không cắt theo mùa; món Tết 2028 bán liên tục qua ranh giới; quà Tết (200 Ngọc) phát theo ngày Tết, không theo mùa. Tết Đinh Mùi 2027 (06/02) thì ngược lại — cửa sổ bán mở 23 tháng Chạp năm Bính Ngọ (30/01/2027), **trước** khi SEASON-01 mở; nếu cửa hàng đã bán món trước mùa thì món Tết 2027 bán từ 30/01, nếu chưa thì từ ngày mở bán thực tế.

---

## 2. Chia tuần Lộ

- Tuần Lộ bắt đầu thứ Hai 00:00 giờ kinh tế.
- Phần lẻ đầu / cuối chương **< 4 ngày** gộp vào tuần liền kề; **≥ 4 ngày** là tuần riêng với trần LĐ tuần và ngưỡng Lộ Dư **nhân theo tỷ lệ ngày** (ví dụ 4 ngày: trần 4.000 × 4/7 = 2.286 → làm tròn 2.290; ngưỡng Lộ Dư 2.400 × 4/7 ≈ 1.370).

| Chương | Từ – đến | Các tuần |
|---|---|---|
| Xuân | 04/02 – 05/05/2027 | X1 04–07/02 (4 ngày) · X2 08/02 · X3 15/02 · X4 22/02 · X5 01/03 · X6 08/03 · X7 15/03 · X8 22/03 · X9 29/03 · X10 05/04 · X11 12/04 · X12 19/04 · X13 26/04–05/05 (10 ngày, gộp 3 ngày lẻ) |
| Hạ | 06/05 – 07/08/2027 | H1 06–09/05 (4 ngày) · H2 10/05 · H3 17/05 · H4 24/05 · H5 31/05 · H6 07/06 · H7 14/06 · H8 21/06 · H9 28/06 · H10 05/07 · H11 12/07 · H12 19/07 · H13 26/07 · H14 02–07/08 (6 ngày) |
| Thu | 08/08 – 06/11/2027 | T1 08–15/08 (8 ngày, gộp Chủ nhật lẻ) · T2 16/08 · T3 23/08 · T4 30/08 · T5 06/09 · T6 13/09 · T7 20/09 · T8 27/09 · T9 04/10 · T10 11/10 · T11 18/10 · T12 25/10 · T13 01–06/11 (6 ngày) |
| Đông | 07/11/2027 – 03/02/2028 | D1 07–14/11 (8 ngày) · D2 15/11 · D3 22/11 · D4 29/11 · D5 06/12 · D6 13/12 · D7 20/12 · D8 27/12 · D9 03/01 · D10 10/01 · D11 17/01 · D12 24/01 · D13 31/01–03/02 (4 ngày) |

Tuần 8 ngày: trần tuần × 8/7 = 4.570; ngưỡng Lộ Dư 2.740. Tuần 10 ngày: trần 5.710; ngưỡng 3.430.

---

## 3. Kho mẫu việc Lộ Thư

Mỗi tuần chọn 6 mẫu (người chơi tính 4). Luật chọn: ≥ 1 mẫu nhóm «Tĩnh», ≥ 1 «Nghề» hoặc «Án», ≥ 1 «Đi» hoặc «Học»; không quá 1 mẫu «Giao lưu»; tuần có lễ có 1 mẫu «Lễ». Mọi mẫu **không** yêu cầu: mở cửa hàng, mua, mặc thử, hỏi Thầy AI, xin xăm, gieo quẻ, xem Vận Mệnh / Thái Tuế, làm việc thiện có công đức (phần 07 §5.4).

| Mã mẫu | Nhóm | Việc | Phương án một mình / iOS |
|---|---|---|---|
| Đi-1 | Đi | Ghé 2 vùng khác nhau | — |
| Đi-2 | Đi | Đi bộ (không bay) tổng 2.000 m trong tuần | — |
| Đi-3 | Đi | Vào một công trình bạn chưa vào lần nào | — |
| Đi-4 | Đi | Đi hết đường lên một đỉnh núi trong vùng thánh địa đang mở | — |
| Học-1 | Học | Đọc 1 bài ở Thư Lâu Lâm | — |
| Học-2 | Học | Xem Bảng Lịch 5 ngày trong tuần | — |
| Học-3 | Học | Đọc 1 mục ở Tàng kinh các (`daozang-data`) | — |
| Học-4 | Học | Đọc 1 câu trong «Trích Thiên Tủy» ở Trích Thiên Đỉnh | — |
| Nghề-1 | Nghề | Đạt ≥ 70% ở một sảnh nghề bất kỳ | — |
| Nghề-2 | Nghề | Làm 3 sảnh nghề khác nhau trong tuần | — |
| Nghề-3 | Nghề | Đạt ≥ 80% ở sảnh Trạch Nhật | — |
| Nghề-4 | Nghề | Đạt ≥ 80% ở sảnh Dương Trạch | — |
| Nghề-5 | Nghề | Đạt ≥ 80% ở sảnh Điều Hậu | — |
| Nghề-6 | Nghề | Đạt ≥ 80% ở sảnh Cách Cục | — |
| Nghề-7 | Nghề | Đạt ≥ 80% ở sảnh Thư Lâu | — |
| Nghề-8 | Nghề | Đạt ≥ 80% ở sảnh Hợp Hôn | — |
| Nghề-9 | Nghề | Đạt ≥ 80% ở sảnh Tử Vi | trên iOS thay bằng Nghề-1 nếu sảnh bị tắt |
| Nghề-10 | Nghề | Đạt ≥ 80% ở sảnh Tượng Pháp | — |
| Án-1 | Án | Giải 1 Án Cổ (mới hoặc giải lại) | — |
| Án-2 | Án | Giải 5 án khách trong tuần | — |
| Án-3 | Án | Đạt ≥ 0,8 ở bước «Tìm Dụng thần» trong một án | — |
| Án-4 | Án | Đạt ≥ 0,8 ở bước «Vượng hay nhược» trong một án | — |
| Án-5 | Án | Giải 3 án khách mà không dùng gợi ý | — |
| Tĩnh-1 | Tĩnh | Ngồi trà hoặc tĩnh tọa tổng 30 phút trong tuần | — |
| Tĩnh-2 | Tĩnh | Thắp nhang / đốt trầm 4 ngày trong tuần | iOS: «đốt trầm» |
| Tĩnh-3 | Tĩnh | Ngồi trà 3 ngày khác nhau | — |
| Lễ-Tết | Lễ | Ghé chợ Tết Huyền Thành và ngắm câu đối | — |
| Lễ-Nguyên | Lễ | Dâng một ngọn đèn ở Sơn Môn đêm rằm | — |
| Lễ-HànThực | Lễ | Ăn bánh trôi ở Trà Thất | — |
| Lễ-ĐoanNgọ | Lễ | Xem đua thuyền ở Cùng Thông Hồ | — |
| Lễ-ThấtTịch | Lễ | Ngồi bên cầu ở Cùng Thông Hồ đêm mưa ngâu | — |
| Lễ-TrungThu | Lễ | Rước đèn quanh sân Sơn Môn | — |
| Lễ-TrùngCửu | Lễ | Lên một đỉnh núi trong ngày 9/9 | — |
| Lễ-ĐôngChí | Lễ | Ăn chè ở Trà Thất ngày Đông Chí | — |
| Lễ-ÔngTáo | Lễ | Ngắm thả cá ở Hồ Sen (web) / ở ao Trà Thất (iOS) | — |
| GL-1 | Giao lưu (tùy chọn) | Ngồi trà cùng một người khác | **hoặc** ngồi trà 15 phút ở Trà Thất |
| GL-2 | Giao lưu (tùy chọn) | Chào 3 người chơi khác ở sân Sơn Môn | **hoặc** chào 3 NPC ở sân Sơn Môn |

Lưu ý: các mẫu «Lễ» chỉ là hoạt động vui của lễ (ăn, ngắm, rước đèn), **không** phải dâng hương cúng, không gắn công đức (phần 01 §4.9).

---

## 4. Lộ Thư từng tuần

### 4.1 Chương Xuân (chỉ Thanh Lộ)

| Tuần | Việc 1 | Việc 2 | Việc 3 | Việc 4 | Việc 5 | Việc 6 |
|---|---|---|---|---|---|---|
| X1 | Lễ-Tết | Tĩnh-1 | Nghề-1 | Đi-3 | Học-2 | GL-2 |
| X2 | Án-1 | Tĩnh-2 | Nghề-2 | Đi-1 | Học-1 | Lễ-Tết |
| X3 | Lễ-Nguyên | Tĩnh-3 | Án-2 | Học-2 | Đi-2 | GL-1 |
| X4 | Nghề-3 | Tĩnh-1 | Án-3 | Đi-3 | Học-4 | Án-1 |
| X5 | Nghề-4 | Tĩnh-2 | Án-2 | Đi-1 | Học-1 | GL-2 |
| X6 | Nghề-5 | Tĩnh-3 | Án-4 | Học-3 | Đi-2 | Án-1 |
| X7 | Nghề-6 | Tĩnh-1 | Án-5 | Đi-3 | Học-2 | GL-1 |
| X8 | Nghề-7 | Tĩnh-2 | Án-3 | Đi-1 | Học-4 | Nghề-2 |
| X9 | Nghề-8 | Tĩnh-3 | Án-2 | Học-1 | Đi-2 | Án-1 |
| X10 | Lễ-HànThực | Tĩnh-1 | Nghề-9 | Án-4 | Đi-3 | GL-2 |
| X11 | Nghề-10 | Tĩnh-2 | Án-5 | Học-3 | Đi-1 | Nghề-1 |
| X12 | Nghề-2 | Tĩnh-3 | Án-1 | Học-2 | Đi-2 | GL-1 |
| X13 | Nghề-1 | Tĩnh-1 | Án-2 | Học-1 | Đi-3 | Án-3 |

### 4.2 Chương Hạ (chỉ Thanh Lộ)

| Tuần | Việc 1 | Việc 2 | Việc 3 | Việc 4 | Việc 5 | Việc 6 |
|---|---|---|---|---|---|---|
| H1 | Tĩnh-1 | Nghề-1 | Đi-3 | Học-2 | Án-1 | GL-2 |
| H2 | Nghề-7 | Tĩnh-2 | Án-2 | Học-1 | Đi-1 | Án-3 |
| H3 | Tĩnh-3 | Nghề-2 | Án-4 | Đi-2 | Học-3 | GL-1 |
| H4 | Nghề-4 | Tĩnh-1 | Án-5 | Đi-3 | Học-4 | Án-1 |
| H5 | Nghề-3 | Tĩnh-2 | Án-2 | Đi-1 | Học-2 | GL-2 |
| H6 | Lễ-ĐoanNgọ | Tĩnh-3 | Nghề-5 | Án-3 | Đi-2 | Học-1 |
| H7 | Nghề-6 | Tĩnh-1 | Án-1 | Đi-4 | Học-3 | GL-1 |
| H8 | Nghề-8 | Tĩnh-2 | Án-4 | Đi-1 | Học-2 | Nghề-2 |
| H9 | Nghề-9 | Tĩnh-3 | Án-2 | Đi-4 | Học-1 | GL-2 |
| H10 | Nghề-10 | Tĩnh-1 | Án-5 | Đi-3 | Học-4 | Án-1 |
| H11 | Nghề-1 | Tĩnh-2 | Án-3 | Đi-4 | Học-3 | GL-1 |
| H12 | Nghề-2 | Tĩnh-3 | Án-1 | Đi-1 | Học-2 | Án-2 |
| H13 | Nghề-7 | Tĩnh-1 | Án-4 | Đi-2 | Học-1 | GL-2 |
| H14 | Nghề-1 | Tĩnh-2 | Án-2 | Đi-3 | Học-2 | Án-1 |

### 4.3 Chương Thu (Thanh Lộ + Kim Thư)

| Tuần | Việc 1 | Việc 2 | Việc 3 | Việc 4 | Việc 5 | Việc 6 |
|---|---|---|---|---|---|---|
| T1 | Lễ-ThấtTịch | Tĩnh-1 | Nghề-1 | Đi-1 | Học-2 | GL-1 |
| T2 | Tĩnh-3 | Nghề-2 | Án-1 | Đi-3 | Học-1 | Án-2 |
| T3 | Nghề-3 | Tĩnh-1 | Án-3 | Đi-4 | Học-4 | GL-2 |
| T4 | Nghề-4 | Tĩnh-2 | Án-2 | Đi-1 | Học-3 | Án-1 |
| T5 | Nghề-5 | Tĩnh-3 | Án-4 | Đi-2 | Học-2 | GL-1 |
| T6 | Lễ-TrungThu | Tĩnh-1 | Nghề-6 | Án-5 | Đi-3 | Học-1 |
| T7 | Nghề-7 | Tĩnh-2 | Án-1 | Đi-4 | Học-4 | GL-2 |
| T8 | Nghề-8 | Tĩnh-3 | Án-3 | Đi-1 | Học-3 | Nghề-2 |
| T9 | Lễ-TrùngCửu | Tĩnh-1 | Nghề-9 | Án-2 | Đi-4 | Học-2 |
| T10 | Nghề-10 | Tĩnh-2 | Án-4 | Đi-3 | Học-1 | GL-1 |
| T11 | Nghề-1 | Tĩnh-3 | Án-5 | Đi-1 | Học-4 | Án-1 |
| T12 | Nghề-2 | Tĩnh-1 | Án-2 | Đi-2 | Học-3 | GL-2 |
| T13 | Nghề-3 | Tĩnh-2 | Án-1 | Đi-3 | Học-2 | Án-3 |

### 4.4 Chương Đông (Thanh Lộ + Kim Thư)

| Tuần | Việc 1 | Việc 2 | Việc 3 | Việc 4 | Việc 5 | Việc 6 |
|---|---|---|---|---|---|---|
| D1 | Tĩnh-1 | Nghề-1 | Án-1 | Đi-1 | Học-2 | GL-2 |
| D2 | Tĩnh-3 | Nghề-4 | Án-2 | Học-1 | Đi-3 | Án-3 |
| D3 | Nghề-5 | Tĩnh-1 | Án-4 | Đi-2 | Học-4 | GL-1 |
| D4 | Nghề-6 | Tĩnh-2 | Án-1 | Đi-4 | Học-3 | Nghề-2 |
| D5 | Nghề-7 | Tĩnh-3 | Án-5 | Đi-1 | Học-2 | GL-2 |
| D6 | Nghề-8 | Tĩnh-1 | Án-2 | Đi-3 | Học-1 | Án-1 |
| D7 | Lễ-ĐôngChí | Tĩnh-2 | Nghề-9 | Án-3 | Đi-2 | Học-4 |
| D8 | Nghề-10 | Tĩnh-3 | Án-4 | Đi-4 | Học-3 | GL-1 |
| D9 | Nghề-1 | Tĩnh-1 | Án-1 | Đi-1 | Học-2 | Án-2 |
| D10 | Nghề-2 | Tĩnh-2 | Án-5 | Đi-3 | Học-1 | GL-2 |
| D11 | Lễ-ÔngTáo | Tĩnh-3 | Nghề-3 | Án-2 | Đi-2 | Học-4 |
| D12 | Lễ-Tết | Tĩnh-1 | Nghề-1 | Án-1 | Đi-1 | GL-1 |
| D13 | Tĩnh-2 | Nghề-2 | Án-3 | Học-2 | Đi-3 | Án-1 |

Chương Xuân (X3) và Đông (D12) chọn mẫu «Lễ» trùng tuần có lễ theo §1. Tuần Vu Lan (T2), Phật đản (H3), Hạ Nguyên (D1), Tết Thầy (D2) **không** có mẫu «Lễ» — lễ không gắn với tiến độ vé.

---

## 5. Lịch phát hành Y Các

### 5.1 Món đã có đủ điều kiện từ đầu mùa

| Tuần | Phát hành | Ghi chú |
|---|---|---|
| trước X1 | bình giá bộ: `SKU-K-01..06` + hoàn chênh lệch bộ đắt (phần 04 §6.4); sửa mô tả 6 món (phần 04 §5.1); đổi tên `phap_luan` | **bắt buộc trước khi bật bất kỳ thanh toán thật nào** |
| X1 | `SKU-F-tet-01..06` (cửa sổ Tết) | món lễ |
| X1 | `SKU-R-thanh-01`, `-02`, `-03` | Huyền Thành đợt 1 |
| X2 | `SKU-R-thanh-04`, `-05`, `-06` | — |
| X3 | `SKU-F-thuongnguyen-01`, `-02` | món lễ (cửa sổ 13–17/1 âm = 18–22/02/2027) |
| X4 | `SKU-R-thanh-07` … `-10` | Huyền Thành đợt 3 |
| X5 | `SKU-R-vancoc-01..04` | Vân Cốc (chỉ Phúc Khí) |
| X6 | `SKU-R-tubinh-01..05` | — |
| X8 | `SKU-R-manh-01..05` | — |
| X10 | `SKU-F-hanthuc-01`, `-02` | món lễ |
| X11 | `SKU-R-cungthong-01..05` | — |
| H2 | `SKU-R-thulau-01..06` | khớp chủ đề mùa (sách) |
| H4 | `SKU-R-phongthuy-01..05` | — |
| H5 – H6 | `SKU-F-doanngo-01..03` | cửa sổ 1–8/5 âm = 05–12/06/2027 |
| H7 | `SKU-R-lichduong-01..05` | — |
| H10 | `SKU-R-trichthien-01..05` | — |
| T1 | `SKU-F-thattich-01..04` | cửa sổ 5–9/7 âm = 06–10/08/2027 (mở trước chương Thu 2 ngày — vẫn trong chương Hạ, không sao) |
| T2 | `SKU-F-vulan-01` (quà, không bán) + 80 Ngọc quà | — |
| T5 – T7 | `SKU-F-trungthu-01..05` | cửa sổ 8–18/8 âm = 08–18/09/2027 |
| T9 | `SKU-F-trungcuu-01`, `-02` + 50 Ngọc quà | cửa sổ 6–12/9 âm = 05–11/10/2027 |
| D1 | 50 Ngọc quà Hạ Nguyên; **không** bán | — |
| D2 | 50 Ngọc quà Tết Thầy | — |
| D7 | `SKU-F-dongchi-01`, `-02` | Đông Chí ± 3 ngày = 19–25/12/2027 |
| D11 | `SKU-F-ongtao-01` | 20–23/12 âm = 16–19/01/2028 |
| D11 – D13 → SEASON-02 | `SKU-F-tet-01..06` (năm 2028) + `SKU-B-06` Gói Tết | 23 Chạp → mùng 10 = 19/01 → 04/02/2028 |

### 5.2 Món vùng theo mốc mở vùng

Vùng thánh địa mở theo tiến độ sản xuất (sơ đồ tổng §13.4), không theo mùa. Gọi «R» là tuần vùng mở:

| Khi | Phát hành |
|---|---|
| R | 3 món đầu của vùng (ưu tiên 1 món Phúc Khí, 1 phẩm phục, 1 khung) |
| R + 1 | 2–3 món tiếp |
| R + 3 | phần còn lại + gói vùng (`SKU-B-03`, `-04`, `-05` nếu có) |

Trần nhịp: ≤ 12 món mới bán bằng Ngọc / tuần trên toàn Y Các (để người chơi không bị ngợp và Ngọc miễn phí theo kịp).

### 5.3 Nhịp tổng hợp chương

| Chương | Món Ngọc mới (ngoài Đạo Lộ) | Món Phúc Khí mới | Nằm trong mục tiêu 25–35 món / chương (phần 03 §6.2 V1)? |
|---|---|---|---|
| Xuân | thanh 5 + tet 4 + thuongnguyen 2 + tubinh 4 + manh 3 + cungthong 2 = 20 (+ K 6 bình bộ) | thanh 5 + tet 2 + vancoc 4 + tubinh 1 + manh 2 + cungthong 3 + hanthuc 2 = 19 | 26 Ngọc (gồm K) — **đạt** |
| Hạ | thulau 4 + phongthuy 4 + doanngo 2 + lichduong 4 + trichthien 5 = 19 + vùng thánh địa mở trong chương | thulau 2 + phongthuy 1 + doanngo 1 + lichduong 1 = 5 | đạt khi có ≥ 1 vùng thánh địa mở; nếu không, chương Hạ dưới mục tiêu — chấp nhận ở mùa thử |
| Thu | thattich 4 + trungthu 3 + trungcuu 1 = 8 + Kim Thư 6 + vùng thánh địa | trungthu 2 + trungcuu 1 = 3 | phụ thuộc vùng |
| Đông | dongchi 1 + ongtao 1 + tet 4 = 6 + Kim Thư 7 + vùng | dongchi 1 + tet 2 = 3 | phụ thuộc vùng |

---

## 6. Cửa sổ giảm giá năm đầu

Luật phần 01 §6.3: ≤ 30%, ≤ 4 đợt / năm / món, không «giảm sốc 1 giờ», không giá gạch giả.

| Đợt | Thời gian | Món | Mức |
|---|---|---|---|
| 1 | tuần X13 (cuối chương Xuân) | món Huyền Thành, Vân Cốc đã bán ≥ 14 ngày | 15% |
| 2 | tuần H14 | món 4 vùng sảnh nghề đã bán ≥ 14 ngày | 15% |
| 3 | tuần T13 | món lễ Xuân / Hạ **không** giảm (món lễ chỉ bán theo lễ); giảm món thánh địa đã bán ≥ 14 ngày | 20% |
| 4 | tuần D13 | toàn bộ món Y Các thường (không món mùa, không món lễ) | 20% |

Không giảm giá: gói tiền thật, VIP, Kim Thư, món VIP độc quyền, thân bộ (đã ở giá chuẩn và có đường Phúc Khí).

---

## 7. Thông báo đẩy năm đầu

Mọi thông báo theo phần 01 §6.4 (khung 08:00–21:00; loại khuyến mãi tắt mặc định).

| Khi | Nội dung | Loại |
|---|---|---|
| 04/02/2027 10:00 | «Lập Xuân rồi. Quán mở Đạo Lộ năm Đinh Mùi — Thư Hương Thiên Hà.» | Đạo Lộ mùa mới |
| 06/02/2027 09:00 | «Chúc mừng năm mới. Quán gửi bạn 200 Ngọc lì xì.» | Lễ |
| 20/02/2027 18:00 | «Rằm tháng Giêng. Đèn Sơn Môn đã thắp.» | Lễ |
| 06/05/2027 10:00 | «Lập Hạ — Đạo Lộ chương Hạ.» | Đạo Lộ |
| 20/05/2027 | **không gửi** (Phật đản — không thông báo thương mại; chỉ thông báo lễ nếu người chơi bật «nhắc lễ») | — |
| 09/06/2027 09:00 | «Đoan Ngọ. Thuyền đua ở Cùng Thông Hồ.» | Lễ |
| 08/08/2027 10:00 | «Lập Thu — chương Thu, Kim Thư đã mở.» | Đạo Lộ |
| 16/08/2027 09:00 | «Rằm tháng Bảy. Quán tặng bông hồng cài áo — bạn tự chọn màu.» | Lễ |
| 15/09/2027 18:00 | «Trung Thu. Rước đèn quanh sân lúc lên đèn.» | Lễ |
| 08/10/2027 09:00 | «Trùng Cửu. Lên cao ngắm cúc.» | Lễ |
| 07/11/2027 10:00 | «Lập Đông — chương Đông.» | Đạo Lộ |
| 22/12/2027 17:00 | «Đông Chí. Trà Thất có chè nóng.» | Lễ |
| 26/01/2028 09:00 | «Chúc mừng năm Mậu Thân. 200 Ngọc lì xì.» | Lễ |
| 04/02/2028 10:00 | «Lập Xuân — Đạo Lộ năm Mậu Thân.» | Đạo Lộ |

---

## 8. Mốc quyết định của mùa thử

| Mốc | Câu hỏi | Dữ liệu | Nếu «không» |
|---|---|---|---|
| hết X4 (01/03/2027) | Nhịp Lộ Điểm thật có gần mô phỏng (phần 07 §5.6)? | `dl_points` theo kiểu người chơi | chỉnh LĐ / bậc **trước** chương Hạ (thay đổi loại A nếu giảm yêu cầu) |
| hết X13 | ≥ 60% người chơi kiểu A đạt bậc 30 Thanh Lộ? | `DL_FREE_COMPLETION_A` | giảm LĐ / bậc cho Hạ |
| giữa Hạ (H7) | Kinh tế máy chủ (phần 10) chạy ổn ≥ 30 ngày, đối soát chênh lệch 0? | đối soát | lùi mở Kim Thư sang chương Đông |
| H12 | Pháp lý (phần 11 §8) đủ? Sản phẩm IAP đã duyệt? | checklist | lùi mở Kim Thư |
| T1 | mở Kim Thư | — | — |
| hết T13 | `DL_PAID_COMPLETION` ≥ 70%? rào chắn (phần 12 §4.3) xanh? | bảng điều khiển | rà trước chương Đông |
| hết D13 | Sổ Quán SEASON-01; quyết định Niên Lộ cho SEASON-02 | — | — |

---

## 9. Checklist nghiệm thu phần 17

- [ ] Ngày trong §1 được sinh lại bằng script dùng `lunar-javascript` (không gõ tay) khi lập lịch mùa sau.
- [ ] Tuần lẻ tính đúng trần theo tỷ lệ (test).
- [ ] Không tuần nào có mẫu Lộ Thư thuộc danh sách cấm §3.
- [ ] Lễ không bán (Phật đản, Vu Lan, Hạ Nguyên, Tết Thầy) không có món bán và không có thông báo thương mại.
- [ ] Bình giá bộ và đổi tên `phap_luan` xong trước mọi thanh toán thật.
