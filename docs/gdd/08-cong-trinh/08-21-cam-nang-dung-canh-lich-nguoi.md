# 08-21 · Cẩm nang dựng cảnh trong nhà và lịch người tổng hợp

> Phần A: quy tắc **bố cục cảnh** cho level designer khi đặt mảnh mô-đun vào khoang — những gì DoD (08-12) không đo được bằng máy nhưng quyết định công trình «sống» hay «trưng bày». Mỗi quy tắc kèm **phản ví dụ thật** tìm thấy khi đo game hiện tại. Phần B: **lịch người theo giờ** cho Sơn Môn và Huyền Thành — bảng một nguồn để lập trình lịch NPC và test T-17.

---

## A. Cẩm nang dựng cảnh

### A1. Trục nhìn từ cửa

**Quy tắc**: đứng ngay trong ngưỡng, nhìn thẳng — phải thấy **vật quan trọng nhất của khoang** (bàn thờ, tượng, bàn đọc chính) ở giữa khung, sáng nhất khung. Không để cột, phướn, bình phong chắn trục giữa ở khoảng 2–8 m đầu.

| Ngoại lệ có chủ đích | Lý do |
|---|---|
| Bình phong sau cửa Chính Đường (MOD-BAC-52) | lệ «chắn sát khí» — nhưng **thấp hơn tầm mắt bàn thờ trên bệ** (bình phong 2,4 m, tượng tổ sư trên bệ cao tới ~5 m → vẫn thấy phần trên) |
| Bình phong Mệnh trong Vận Mệnh Các | bàn 命 nằm **trên mặt bình phong** — chính bình phong là trục nhìn |

**Phản ví dụ hiện có**: cửa hai điện phụ Sơn Môn nhìn thẳng vào vách nền L1 cách 4 m (08-16 §2) — trục nhìn **từ trong ra** cũng là một trục: ra khỏi điện mà thấy vách đá là cảm giác «hậu trường».

### A2. Đường người đi phải là đường mắt đi

Lối đi chính trong khoang (rộng ≥ 1,2 m, 08-01 §9.2) nối cửa → trạm chính → các trạm phụ → cửa khác, **không phải đi lùi** qua chỗ vừa đi để tới trạm sau. Vận Mệnh Các «Vòng Đời» là ví dụ đúng: vòng kín, trạm nối tiếp, kết ở điểm bắt đầu.

### A3. Ba lớp chiều sâu

Mỗi khoang lớn (A / B) có **tiền cảnh** (đồ thấp gần cửa: bồ đoàn, lư), **trung cảnh** (bàn lễ, bàn đọc), **hậu cảnh** (khám, kệ, tường có biển). Thiếu trung cảnh → khoang trống trải như kho; thiếu hậu cảnh → mắt «rơi» vào tường lót trơn.

### A4. Mật độ đồ — «kể chuyện» nhưng không bày hàng

| Loại khoang | Mật độ gợi ý (mảnh / 10 m² sàn, không tính kết cấu) |
|---|---|
| Điện thờ | 2–4 |
| Tàng kinh, thư lâu | 5–8 (kệ dày, lối thoáng) |
| Nhà dân | 4–6 |
| Trà lâu | 3–5 |
| Phòng gác, kho | 4–7 (chất đồ có lý do) |

Mỗi khoang **một chi tiết kể chuyện** đặt có chủ ý: chén trà dở trên án Thầy, sách mở ở trang đánh dấu, chổi dựng góc phòng đạo đồng, đôi giày ở ngưỡng nhà dân (người đang ở nhà). Chi tiết này đổi theo lịch (giày biến mất khi chủ nhà ra chợ).

### A5. Đồ phải «có người dùng»

Không đặt ghế quay vào tường, giường trước cửa ra vào, bếp dưới cửa sổ giấy, lư hương sát phướn (cháy). Đồ của NPC đặt đúng tư thế NPC dùng (neo `SE__` trùng ghế).

### A6. Ánh sáng dẫn đường (08-12 R07)

Trạm chính sáng nhất; lối đi có đèn mỗi ≤ 6 m; góc không có trạm được phép tối (đúng không khí điện cổ). Ban đêm: cửa sổ sáng là lời mời — chỉ sáng ở khoang có người hoặc trạm dùng được.

### A7. Không chặn vô lý

Mọi vật cản trong khoang phải **nhìn ra được là vật cản**: không có ô va chạm không có hình (tường vô hình). Phản ví dụ hiện có:

| Chỗ | Vấn đề | Đã ghi sửa |
|---|---|---|
| Đế bài phường đại lộ Nam | khối va chạm 20 × 17 m mà mắt thấy là sân đá thấp | 08-09 §6 |
| Trà Thất | khối đặc cả đình, ghế ngồi nằm ngoài khối | 08-08 §7 |
| Bệ đình 8 sảnh nghề | bệ đặc, không có bậc | 08-10 §2.2 |
| Thân sạp chợ | khối đặc cao 8 m | 08-09 §5.4 |

Và ngược lại — **không có hình mà không có va chạm**: trà lâu Cùng Thông, cầu Huyền Hà (08-11 §1.1, §7).

### A8. Không lơ lửng, không cắm vào nhau

Đáy mọi vỏ và mọi mảnh đặt đúng mặt đỡ (sai ≤ 0,05 m — P8 ở 08-02 §11). Phản ví dụ hiện có: công trình phụ `palaceComplex` lơ lửng trên tầng nền thấp (08-10 §1.2); bốn tháp Sơn Môn cắm vào tường (08-08 §1, §2); hai Tàng Thư Các cắm vào Thư Lâu (08-11 §2.2). Test T-03 / T-04 chặn từ nay.

### A9. Trước cửa phải trống

2,4 m trước mỗi cửa đi trống hoàn toàn (08-01 §9.2). Phản ví dụ: sạp SAP-03 / SAP-06 chắn cửa NHA-03 / NHA-08 (08-09 §5.2).

### A10. Hai chế độ camera đều phải đẹp

Dựng xong khoang: xem ở TRONG (tầm người) **và** BỔ DỌC (nhìn xuống). Ở BỔ DỌC, bố cục đọc được như bản vẽ: lối đi rõ, đồ không chồng lấn từ trên nhìn xuống, nắp đầu tường (KT-12) liền mạch.

### A11. Tôn trọng không gian thờ

Không đặt trạm «vui» (mini-game ồn ào) trong khoang có bàn thờ chính; không cho người chơi ngồi lên bàn thờ / bệ tượng (va chạm bệ là `H`, không phải nền đi được); camera không xuyên được vào khám tượng.

### A12. Kiểm nhanh trước khi gửi duyệt

1. Đứng cửa — trục nhìn (A1).
2. Đi lối chính — không quay lui (A2).
3. Chụp BỔ DỌC — đọc được (A10).
4. Bật `debugHour` 0 — cửa sổ nào sáng, có người không (A6).
5. Dò va chạm bằng chế độ hiện ô (`?col=1`, chưa có — cần làm: vẽ ô đặc của `lv` hiện tại thành lưới đỏ mờ trên sàn) — không có ô đỏ ngoài vật nhìn thấy (A7).

---

## B. Lịch người theo giờ

Ký hiệu chỗ: tên khoang (08-07 … 08-11) hoặc «rời» (không vẽ). NPC phụ ghi theo vai — tài liệu 06 cấp mã `NPC-*`.

### B1. Sơn Môn

| Người | Tý | Sửu | Dần | Mão | Thìn | Tỵ | Ngọ | Mùi | Thân | Dậu | Tuất | Hợi |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Thầy Tử Bình (`thay_tubinh`) | rời | rời | rời | Bệ Thầy | Bệ Thầy | Bệ Thầy | Trà Thất | Bệ Thầy | Bệ Thầy | Bệ Thầy | `cd.l0.tay` | rời |
| Lão Tùng (`gac_cong`) | rời | rời | `sm.l0.tay` | `sm.l0.tay` | `sm.l0.tay` | `sm.l0.tay` | `sm.l0.tay` | `sm.l0.tay` | `sm.l0.tay` | `sm.l0.tay` | `sm.l0.tay` | thắp đèn cổng → rời |
| Khổng tiên sinh (`khong_tiensinh`) | rời | rời | rời | rời | bậc Sơn Môn | bậc | bậc | bậc | bậc | `sm.l1.lau` | `sm.l1.lau` | rời |
| Bà Tư (`tho_may`) | rời | rời | rời | rời | `ty.dinh` | `ty.dinh` | `ty.buong` | `ty.dinh` | `ty.dinh` | `ty.dinh` | rời | rời |
| Đạo đồng hương đăng | rời | rời | quét sân | `cd.l0.chinh` (thay nến) → sân | sân | sân | trai (rời) | sân | sân | `cd.l0.chinh` (thay nến) | `hm.l0.dong` | `hm.l0.dong` (ngủ) |
| Thủ kinh | rời | rời | rời | rời | `cd.l1.kinh` | `cd.l1.kinh` | `cd.l1.kinh` | `cd.l1.kinh` | `cd.l1.kinh` | rời | rời | rời |
| Thủ các Vận Mệnh | rời | rời | rời | rời | hiên Điện Tây | hiên | hiên | hiên | hiên | rời | rời | rời |
| Thủ điện Thái Tuế | rời | rời | rời | `tt.l0.dien` | `tt.l0.dien` | … | … | … | … | `tt.l0.dien` | rời | rời |
| Chung đầu | rời | rời | `lc.l1.chuong` | `lc.l1.chuong` (khóa chuông) | `lc.l0.phong` | `lc.l0.phong` | `lc.l0.phong` | `lc.l0.phong` | `lc.l0.phong` | rời | rời | rời |
| Cổ đầu | rời | rời | rời | rời | `lt.l0.phong` | … | … | … | `lt.l1.trong` | `lt.l1.trong` (trống chiều) | rời | rời |
| Thầy Giải Quẻ (Hậu Sơn) | rời | rời | rời | `hs.l0.tamthanh` (tụng) | `hs.l0.tay` | `hs.l0.tay` | `hs.l0.tay` | `hs.l0.tay` | `hs.l0.tay` | `hs.l0.tamthanh` (tụng) | rời | rời |
| Đạo sĩ trực điện Hậu Sơn | `hs.l0.tamthanh` | `hs.l0.tamthanh` | `hs.l0.tamthanh` | `hs.l0.tamthanh` | rời | rời | rời | rời | rời | `hs.l0.tamthanh` | `hs.l0.tamthanh` | `hs.l0.tamthanh` |
| Khách hành hương (2–4, sinh theo ngày) | rời | rời | rời | rời | sân, Lư Hương | sân, điện | rời | sân | sân, điện | rời | rời | rời |

Kiểm chéo: giờ Tuất Thầy ở Tĩnh thất mà cửa giữa Chính Đường vẫn mở (`dien_chinh` tới hết Tuất) — người chơi vào được bằng cửa giữa **hoặc** ngách; giờ Hợi Thầy rời, ngách vẫn mở nhưng Tĩnh thất trống (đúng 08-07 §2.6).

### B2. Huyền Thành

| Người | Tý – Dần | Mão | Thìn – Tỵ | Ngọ | Mùi – Thân | Dậu | Tuất – Hợi |
|---|---|---|---|---|---|---|---|
| Đội trưởng tuần thành | rời | `tm.l0.tay` | `tm.l0.tay` | `tm.l0.tay` | `tm.l0.tay` | `tm.l0.tay` | Tuất: `tm.l0.tay`; Hợi: rời |
| Lính gác vòm (2) | ca đêm (2 người khác) | đổi ca | vòm | đổi ca | vòm | vòm | ca đêm |
| Lính Lầu Trống Canh | `tm.l2.trong` (đánh canh mỗi giờ) | rời | rời | rời | rời | `tm.l2.trong` | `tm.l2.trong` |
| Người giữ trạm đi nhanh | rời | rời | `tm.l0.dong` | `tm.l0.dong` | `tm.l0.dong` | rời | rời |
| Người bán sạp (6) | rời | dọn hàng (Mão cuối) | sạp | sạp | sạp | dọn | rời — **trừ** quầy Định Mệnh Hội: Dậu → Hợi vẫn có người |
| Tháp chủ Văn Phong | rời | rời | `vp.san` | `vp.san` | `vp.san` | rời | rời |
| Chưởng quỹ Du Phương | rời | `dp.l0` | `dp.l0` | `dp.l0` | `dp.l0` | `dp.l0` | `dp.l0` (Hợi: đóng quầy, ngủ tầng trệt) |
| Tiểu nhị | rời | rời | `dp.l0` / `dp.l1` | … | … | … | Tuất: `dp.l0`; Hợi: rời |
| Gia đình 36 nhà | lịch `nha_dan` 08-09 §3.5 | | | | | | |
| Người đánh xe | rời | trạm xe | trạm xe | trạm xe | trạm xe | trạm xe | rời |

### B3. Quy tắc lập trình lịch

- Lịch là **bảng dữ liệu** (trường `schedule` trong công thức, 08-03 §2.7), không viết logic riêng từng NPC.
- Đổi chỗ giữa hai giờ: NPC **đi bộ** theo đồ thị công trình (08-04 §3.5) nếu người chơi trong 60 m; xa hơn thì đặt thẳng.
- NPC «rời» = không vẽ, không chiếm neo; trạm của họ dùng chế độ tự phục vụ nếu có (thủ kinh vắng → biển «tự đọc»).
- Hai NPC không cùng một neo trong cùng giờ (test T-17).
- Sự kiện (khóa chuông, trống thu không, khánh thành) **chồng lên** lịch: NPC tới vị trí sự kiện trước 1 phút giờ bắt đầu, xong quay lại lịch.
