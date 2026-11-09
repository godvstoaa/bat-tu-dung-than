# 05-18 · Giao diện hệ cải mệnh — đặc tả màn hình

> Đặc tả **chức năng** của mọi màn hình hệ 05: mục đích, thành phần, trạng thái, trạng thái rỗng, lời trên màn hình, tương tác, trợ năng, biến thể iOS. Tài liệu 12 cấp mã `UI-xx`, quyết định hình ảnh, âm thanh (`SFX-*`, `BGM-*`); ở đây đặt tên màn hình theo `S-xx` **nội bộ của tài liệu 05** để các phần khác tham chiếu, tài liệu 12 ánh xạ sang mã chuẩn.
> Nguyên tắc chung (đúng `high-end` tinh thần của game: tĩnh, thủy mặc, không ồn):
> - **Không màu đỏ báo động** cho nghiệp, Nợ Âm, phạm giới. Dùng mực đen, xám tro; màu son chỉ cho việc **tốt** (dòng thiện, con dấu xong).
> - **Không chấm đỏ thông báo** trên biểu tượng Sổ Mệnh vì việc «chưa làm». Chỉ có chấm khi có **thư**.
> - Mọi số hệ quả (Đạo Hạnh bị trừ, Nợ Âm) luôn đi kèm **một dòng «lấy lại thế nào»**.

---

## S-01 · Dải trạng thái HUD

| Thành phần | Nội dung | Trạng thái |
|---|---|---|
| Phúc Khí | số hiện có (đã có) | — |
| Dải Vận (mới) | tối đa 4 biểu tượng Vận Phù đang chạy (hành → màu hành), «+x% / trần y%» | ẩn khi không có Vận Phù; ẩn trên iOS |
| Đạo Hạnh hôm nay (mới) | vòng nhỏ: phần gốc đã dùng / hạn mềm | vòng chuyển màu trà khi chạm hạn mềm, không chuyển đỏ |
| Âm Ấn (chỉ khi có Âm Bài) | công tắc; khi bật: viền mực mảnh quanh màn hình | mặc định tắt mỗi lần đăng nhập |
| Lối tắt Sổ Mệnh | biểu tượng cuốn sổ | chấm nhỏ chỉ khi có **thư** chưa đọc |

**Tương tác:** chạm Dải Vận → mở S-03. Chạm vòng Đạo Hạnh → mở S-04. Giữ Âm Ấn 1 giây mới bật (chống chạm nhầm); tắt bằng một chạm.
**Trợ năng:** mọi biểu tượng có nhãn đọc màn hình («Phù Phương Vị, cộng năm phần trăm Phúc Khí»); vòng Đạo Hạnh đọc «bảy mươi tư trên một trăm hai mươi điểm gốc hôm nay».

---

## S-02 · Sổ Mệnh — trang chủ hệ cải mệnh

**Mục đích:** một chỗ cho ba tầng. Mở bằng phím tắt hoặc biểu tượng sổ.

| Khu | Nội dung |
|---|---|
| Đầu trang | tên / đạo hiệu · cảnh giới (tên theo đạo chính) · ba chấm sen Đại Nguyện |
| Thẻ «Hôm nay» | 3 dòng: (1) một việc thiện nhỏ gợi ý (từ nút Tích Âm Đức); (2) nút Mệnh Đồ sáng nhất còn việc; (3) hoạt động lõi của đạo chưa làm hôm nay |
| Lưới chương | Vận Khí Bàn · Đạo Hạnh · Cảnh giới · Mệnh Đồ · Sổ Công Quá · Nghiệp · Đạo Lộ · Tàng Kinh · (Nợ Âm — chỉ khi > 0 hoặc có lịch sử) · Nhật ký thiện (chỉ khi bật) |
| Hòm thư | thư Vân Cốc, Diệu Âm, thầy các đạo |

**Trạng thái rỗng (người chơi chưa gặp Vân Cốc):** chỉ có Vận Khí Bàn (web) và Tàng Kinh; các chương khác hiện mờ với dòng «Mở khi gặp người dẫn đường» — không nói tên NPC (tránh lộ truyện).
**iOS:** tên «Sổ Tu Học»; không Vận Khí Bàn; Mệnh Đồ → «Lộ Tu Học».

---

## S-03 · Vận Khí Bàn

| Khu | Thành phần |
|---|---|
| Đầu | «Vận hôm nay: +10% · trần 10% (năm 2026 — năm nên giữ)»; chạm «trần» → thẻ giải thích Nghịch Duyên |
| Danh sách Vận Phù đang chạy | biểu tượng · tên · % · đồng hồ (nếu có) · nút «Vì sao?» |
| Gợi ý (từ thẻ Tam Tầng Dược lớp 形 và `twelveLaws` ①–⑨) | tối đa 3 gợi ý chưa kích hoạt, vd «Ngồi quay hướng Bắc khi thiền» |
| Đèn Niên | trạng thái đèn Thái Tuế năm nay (từ `lampState`) |

**Thẻ «Vì sao?»:** tiêu đề pháp số mấy (①…⑨), câu `twelveLaws` nguyên văn, hành Dụng / Hỷ, dòng cuối cố định: «Đây là thuận vận. Đổi số thật nằm ở Sổ Công Quá.»
**Không có:** nút mua, nút «kích hoạt nhanh», đếm ngược thúc ép.

---

## S-04 · Đạo Hạnh

| Khu | Thành phần |
|---|---|
| Tổng | Đạo Hạnh hiện tại (số lớn) · Đạo Hạnh đời (số nhỏ) |
| Hôm nay | thanh «gốc đã dùng / hạn mềm 120 · Tĩnh Khí còn x»; chú thích hạn cứng 200 |
| Hệ số | ba dòng: «Nghịch Thiên k = 1,19 — căn càng thấp, mỗi việc càng nặng ký»; «Ái lực: Bắc Đế +10% · Mật +10% · Thiền +5%…»; «Nghịch Duyên +10% cho tu tâm (năm giữ)» |
| Biểu đồ 30 ngày | cột chồng theo nguồn: công · tu · học · truyện · chuyển niệm |
| Án giới | danh sách án còn lấy lại: giới gì · ngày · «còn 5 ngày để lấy lại đủ» · nút «Đi sám hối» (mở bản đồ tới nơi gần nhất) |
| Tâm Đề tuần | tên đức · 7 ô ngày · việc đã làm |
| Ngũ Bộ | bộ đếm chuyển niệm thành công · nút «Ngồi lại một chút» (tự gọi) |

**iOS:** ẩn dòng k (k = 1) và Nghịch Duyên.

---

## S-05 · Cảnh giới và đột phá

| Khu | Thành phần |
|---|---|
| Bậc hiện tại | tên theo đạo chính + hai tên kia nhỏ hơn (người chơi chọn cách gọi) |
| Điểm | bậc 1–3: «Đạo Hạnh 365 + căn cốt 35,2 = 400,2»; bậc ≥ 4: chỉ Đạo Hạnh, có dòng «căn cốt không còn tính» |
| Điều kiện đột phá | hộp kiểm theo bảng 05-01 §4.1; mỗi ô chưa đạt có nút «đi tới» |
| Nút Đột phá | sáng khi đủ; chạm → đường dẫn tới nơi đột phá của đạo chính (05-01 §4.2) |
| Lối tắt | Thiên Bảng (S-15) |

**Trạng thái «bị chặn bởi Nợ Âm»:** dòng xám «Bậc 5 chờ con khép Phong Đô» + nút mở S-09. Không có biểu tượng khóa đỏ.

---

## S-06 · Mệnh Đồ

Đặc tả bố cục ở 05-02 §7. Bổ sung tương tác:

| Thao tác | Kết quả |
|---|---|
| chạm nút | thẻ nút: tên · «Vì sao cần» (nguyên văn `diagnosis[].d`, hoặc nhãn «nhắc của Mệnh Đồ») · các hạng mục `acts` (nguyên văn) với nhiệm vụ con · NPC · vùng · nút «Dẫn đường» |
| giữ nút 1 giây | xem nhanh số đèn được tính thế nào (minh bạch: «2 đèn từ "Tổ hợp hung", 1 đèn vì phạm Thái Tuế nặng») |
| chạm `verdict` | đọc đủ, có nút «Hỏi Vân Cốc» (mở thoại AI với persona Vân Cốc; web) |
| vuốt sang trái | Mệnh Đồ các năm trước (đọc) |
| nút «Chia sẻ tu trình» | bật / tắt cho bạn bè thấy tên nút đang làm (không bao giờ chia sẻ chẩn đoán) |
| nút «Cho sư phụ xem» | chỉ hiện khi có sư phụ; bật / tắt |

**Trợ năng:** chế độ danh sách thay cho cuộn tranh (đọc màn hình đọc theo thứ tự gợi ý).

---

## S-07 · Sổ Công Quá

Đặc tả nội dung ở 05-03 §8. Bổ sung:

| Trang | Thành phần | Tương tác |
|---|---|---|
| Hôm nay | dòng sổ (son / đen / son nhạt «vô cầu»); thanh 15 công; 10 ô trần nhóm | chạm dòng → chi tiết: DEED, nơi, NPC, hạnh, âm / dương |
| Tuần | `verdict` 7 ngày nguyên văn + câu Vân Cốc; biểu đồ 7 cột | — |
| Đời | ba con số; ba chấm sen; thanh tới mốc kế + điều kiện thêm (hạnh, âm thiện, khiêm) | chạm điều kiện chưa đạt → gợi ý DEED phù hợp |
| Thập Thiện | 10 hạnh, mỗi hạnh 3 huy hiệu | chạm hạnh → danh sách DEED thuộc hạnh |
| Mực đen | quá chưa cải: dòng · ngày · việc sửa · nút «Xem cách sửa» | mở chuỗi `CQ-SH` / việc sửa |
| Nhật ký thiện | (khi bật) ô ghi, lịch chấm, biểu đồ đếm dòng | nút xóa toàn bộ (xác nhận) |

**Không có:** nút chia sẻ sổ, bảng xếp hạng công.

---

## S-08 · Nghiệp

| Khu | Thành phần |
|---|---|
| Mười thanh | hình tượng thanh (05-05 §2.1) · tên · số · mức (Nhẹ / Vướng / Nặng / Chướng) — **thanh = 0 không hiện**, chỉ hiện thanh có số |
| Sự vụ | mỗi sự vụ: ngày, nơi, người bị hại, lượng còn lại, ba ô tiến độ (việc sửa / sám / giữ giới) |
| Chuỗi giải | `CQ-SH` đang mở |
| Khuynh hướng (web) | thẻ «khuynh hướng tu học» (Lục Đạo, kèm `disclaimer`) — chỉ khi người chơi chạm «Xem khuynh hướng» |

**Trạng thái rỗng:** «Sổ nghiệp trống. Giữ được như vậy là tốt — mà không giữ được cũng sửa được.»
**Không có:** màu đỏ, biểu tượng đầu lâu / lửa địa ngục, quả báo (`result`) cạnh thanh.

---

## S-09 · Nợ Âm

Chỉ hiện khi Nợ Âm > 0 hoặc đã từng có.

| Khu | Thành phần |
|---|---|
| Đầu | **con số Nợ Âm** chính xác; dòng «Ước lượng ngày về: ~23 ngày theo nhịp của con» |
| Âm Bài | còn bao lâu · số lần dùng hôm nay / 30 · nút «Đập thẻ» (mở chỉ đường tới điện thờ gần nhất) |
| Lịch sử | từng dòng cộng / trừ (thời điểm, lý do) |
| Án hệ quả | danh sách nạn nhân và bậc hệ quả đã xảy ra; mỗi dòng: tình trạng («chưa cứu / đang cứu / đã cứu») · nút «Dẫn đường» |
| Đường về | 5 bước 05-12 §6.1 dạng hộp kiểm |
| Hũ Hồi Đầu | số đang dồn / 200 |

**Lời đầu trang cố định:** «Con số này công khai với chính con. Người khác chỉ thấy một vệt mực trên tên con. Về được mọi lúc.»

---

## S-10 · Đạo Lộ

Đặc tả ở 05-06 §10. Bổ sung:

| Thao tác | Kết quả |
|---|---|
| chạm đạo | trang đạo: thang 5 hạng · ĐH-đạo · điều kiện hạng kế · giới (thường trực, đạo tràng) · chuỗi nhiệm vụ (đã / đang / chưa) · hoạt động lõi hôm nay (phiên có thưởng còn lại) |
| «Hoàn đạo» | hộp xác nhận ghi rõ: hạng và ĐH-đạo **đóng băng, không mất**; chờ 14 ngày nếu muốn quay lại |
| «So các đạo» | ma trận `compareMatrix` 9 chiều, không bình luận |
| dấu sao | «hợp Dụng» (web) |

---

## S-11 · Thẻ Tàng Kinh

| Thành phần | Nội dung |
|---|---|
| Tên | Hán + Hán Việt + nghĩa |
| Thuộc | bộ / phái / thời / tác giả (từ dữ liệu app) |
| Tinh túy | `meaning` / `essence` (rút gọn ≤ 400 ký tự) |
| Một câu gốc | ≤ 15 chữ Hán, kèm nghĩa |
| Độ chắc chắn | `textual_certainty` (cao / một phần) — hiện bằng chữ, không bằng sao |
| Nguồn | danh sách `sources` (liên kết mở ngoài, có cảnh báo «rời game») |
| Dòng cố định | «Đây là giới thiệu văn hóa – tôn giáo. Muốn tu tập thật, hãy tìm thầy và cộng đồng của truyền thống này.» |
| Nút | «Đọc xong» (ghi DEED kinh nếu đủ điều kiện) |

---

## S-12 · Lớp phủ Ngũ Bộ Chuyển Niệm

| Bước | Màn hình | Thời lượng | Nút |
|---|---|---|---|
| Giác | thời gian chậm (âm thanh trầm xuống), phương án đang giữ có chữ mờ thẻ nghiệp; nếu có cảnh báo theo lá số: một dòng giọng NPC | 1,5 s | «Thôi» (thoát) |
| Đình | ba vòng hơi thở | ~9 s | giữ phím Thở; «Thôi» |
| Chuyển | 4 thẻ chìa khóa (bố cục 2 × 2) | tự do | chọn thẻ |
| Tịnh | màu rút, nhạc lặng, một câu kinh | 3 s | chạm = thoát |
| Hóa | hội thoại trở lại, phương án mới | — | — |

**Trợ năng:** người chơi bật «giảm hiệu ứng» → bỏ chậm thời gian và rút màu; bước Đình có thể thay bằng nút «Con đã dừng lại» (không cần giữ phím theo nhịp).

---

## S-13 · Thẻ giới và thẻ hậu quả

| Loại | Hiện khi | Nội dung | Nút |
|---|---|---|---|
| Thẻ giới | trước khi người chơi xác nhận một hành động phạm giới | «Giới {đạo}: {giới}. {Hậu quả: Đạo Hạnh −20; lấy lại được trong 7 ngày}» | «Thôi» (mặc định) · «Vẫn làm» |
| Thẻ hậu quả việc ác | trước khi chọn phương án có DEED ác | «{tên mục app} {−p} · nghiệp {tên thanh}. Có thể sửa sau.» | «Thôi» · «Vẫn chọn»; p = 3: thêm hộp «Con chắc chứ?» |
| Thẻ hậu quả Tà Lộ | trước việc yểm | «Việc này làm hại {tên NPC}. Nợ Âm +80. Con có thể quay về bất cứ lúc nào, nhưng {tên} sẽ gặp chuyện.» | «Thôi» · «Vẫn làm» |

**Luật:** không đếm ngược, không rung cảnh báo, nút «Thôi» luôn ở vị trí dễ chạm hơn.

---

## S-14 · Khung chung mini-game nghi lễ

| Thành phần | Quy định |
|---|---|
| Vào | màn chuẩn bị: tên nghi, nơi, thời lượng ước tính, nút «Bắt đầu», nút «Chia phiên» (nếu nghi cho chia) |
| Trong | không HUD điểm số; chỉ một vòng tiến độ mảnh ở mép; nút tạm dừng |
| Lỡ nhịp | không âm báo sai; nhịp đó không tính; nghi kéo dài thêm một nhịp |
| Kết | tiếng chuông · một câu của NPC · tóm tắt nhỏ (Đạo Hạnh nhận, nghiệp giảm) **sau** 2 giây |
| Camera | góc cố định nghiêng thấp phía sau; không cận mặt tượng (TT-1…TT-4) |
| Trợ năng | chế độ «nhịp rộng» (cửa sổ ±400 ms) không giảm thưởng; chế độ một nút |

---

## S-15 · Thiên Bảng

| Khu | Thành phần |
|---|---|
| Thẻ bảng | Chính (Đạo Hạnh) · Tiên Thiên (chỉ người công khai) · Tân Tú (< 30 ngày) · Hồi Đầu (theo ngày đạt) · Môn Phái Tích Đức (tháng) |
| Dòng | hạng · tên / đạo hiệu · cảnh giới · Đạo Hạnh (dấu «Âm» nếu có) · biểu tượng đạo · chấm sen |
| Bộ lọc | bạn bè · môn phái · máy chủ |
| Chốt | đồng hồ tới ngày chốt tháng âm |

**Không có:** cột công / quá; nút «thách đấu»; hiện Tiên Thiên khi người chơi chưa bật công khai.

---

## S-16 · Cài đặt nội dung

| Mục | Mặc định | Mô tả |
|---|---|---|
| Lời nhắc cải vận | bật | nhắc màu / hướng hợp Dụng (tối đa 1 / ngày / loại) |
| Nhắc theo lá số (nghiệp) | bật | cảnh báo trước lựa chọn theo khuynh hướng lá số |
| Âm tà · trừ tà (văn hóa – tôn giáo) | **tắt** | màn `ETHICS.disclaimerVi` khi bật |
| Tuyến Tà Lộ | **tắt** | màn 05-12 §2.2 |
| Không bao giờ mời tôi vào Tà Lộ | tắt | |
| Ghi sổ đời thực | **tắt** | 05-03 §6 |
| Công khai căn cốt | **tắt** | Tiên Thiên trên Thiên Bảng |
| Chia sẻ tu trình | tắt | tên nút Mệnh Đồ cho bạn bè |
| Nhận lời «Đưa tay» ở cầu Nại Hà | bật | |
| Giảm hiệu ứng | theo hệ điều hành | |

Mỗi mục có nút «?» mở một đoạn giải thích. Thay đổi có hiệu lực ngay, không cần khởi động lại.

---

## S-17 · Thư

| Loại thư | Người gửi | Khi | Hành động |
|---|---|---|---|
| Thư tuần | Vân Cốc | tối Chủ nhật | «Đánh dấu đã đọc» |
| Thư mời | Diệu Âm | khuynh hướng dữ / thanh Nặng / Nợ Âm ≥ 400 | «Dẫn đường» |
| Thư nhắc sự vụ | Diệu Âm | sự vụ > 30 ngày (một lần) | «Xem cách sửa» |
| Thư thầy đạo | NPC dẫn | đủ điều kiện thăng hạng | «Dẫn đường» |
| Thư sư phụ / đệ tử | người chơi | sự kiện sư đồ | — |
| Thư hẹn | Vân Cốc | Quy nhất đủ QN-1 | «Dẫn đường» |

**Luật:** không gửi thông báo đẩy ngoài game cho thư hệ 05 (trừ khi người chơi bật «thông báo thư» chung).

---

## 18. Kiểm nghiệm giao diện

- [ ] Không màn nào dùng màu đỏ / chấm đỏ cho nghiệp, giới, Nợ Âm.
- [ ] Mọi con số trừ có dòng «lấy lại thế nào».
- [ ] Mọi văn bản engine hiển thị nguyên văn có nhãn nguồn (chạm giữ → «từ lá số / từ sổ của con»).
- [ ] Trợ năng: đọc màn hình đọc được mọi biểu tượng; chế độ giảm hiệu ứng; chế độ nhịp rộng.
- [ ] iOS: không có S-03, S-09, dòng k, Nghịch Duyên, khuynh hướng Lục Đạo; đổi tên theo `TEXT`.
