# 11 · Phần 13 — Chống gian lận, tranh chấp thanh toán, khôi phục tài khoản, hỗ trợ

> Kinh tế của Huyền Giới có một đặc điểm làm gian lận **ít lợi**: không có chợ, không chuyển Ngọc, không chuyển món, không đổi ngược ra tiền (phần 01 §5). Phần lớn rủi ro còn lại là: sửa trạng thái cục bộ, khai thác thưởng, thẻ đánh cắp, lạm dụng hoàn tiền, chiếm tài khoản. Phần này đặt luật phát hiện, cách xử lý, quy trình tranh chấp và khôi phục tài khoản.
>
> Các nhãn như «G-1», «TC-1» chỉ là đánh số **trong phần này**, không phải mã định danh dùng chung giữa các tài liệu.

---

## 1. Mô hình đe dọa

| # | Ai | Muốn gì | Cách | Tác hại | Khả năng | Ưu tiên |
|---|---|---|---|---|---|---|
| G-1 | Người chơi tò mò | Ngọc / món miễn phí | sửa `localStorage` (`huyenquan:v1`) | trước máy chủ: mặc món đắt trong MMO; sau máy chủ: không còn tác dụng | cao (trước máy chủ) | cao — chặn bằng phần 10 §9, §10 |
| G-2 | Người chơi | điểm danh nhiều lần | đổi đồng hồ máy | Ngọc Tặng thừa | cao (trước máy chủ) | cao — ngày kinh tế máy chủ |
| G-3 | Người chơi | Phúc Khí vô hạn | vòng xóa / thêm hồ sơ (phần 02 PK-2) | lạm phát Phúc Khí, cấp | cao | cao — khóa băm lá số |
| G-4 | Bot | cày Phúc Khí, Lộ Điểm | tự động giải án / sảnh | lạm phát; tài khoản bot đem bán | trung bình | trung bình |
| G-5 | Kẻ dùng thẻ trộm | rửa thẻ | mua gói, mua tặng | tranh chấp thẻ, phí phạt, nguy cơ bị cổng thanh toán khóa | trung bình | cao |
| G-6 | Người chơi | dùng xong rồi đòi tiền | mua Ngọc, tiêu, yêu cầu hoàn qua nền tảng / ngân hàng | mất doanh thu | trung bình | trung bình |
| G-7 | Kẻ chiếm tài khoản | lấy tài khoản có món hiếm để bán | lừa đảo, đoán mật khẩu email, SIM swap | người chơi mất tài khoản | thấp–trung bình | cao (tổn hại lớn với người bị hại) |
| G-8 | Người bán tài khoản | bán tài khoản ngoài game | rao bán trên mạng | lừa đảo giữa người mua và bán | trung bình | thấp (không kiểm soát được hoàn toàn) |
| G-9 | Kẻ giả IPN | nhận Ngọc không trả tiền | gọi điểm cuối IPN / webhook giả | mất doanh thu | thấp nếu kiểm chữ ký | cao — phần 10 §11 |
| G-10 | Trẻ em | mua bằng thẻ của cha mẹ | khai tuổi sai | khiếu nại, hoàn tiền | trung bình | cao — phần 11 §5 |
| G-11 | Người trong đội | cấp Ngọc cho mình / bạn | công cụ quản trị | gian lận nội bộ | thấp | cao — §6 |

---

## 2. Luật phát hiện

Mọi luật chạy trên **máy chủ** (Két và bản sao D1, phần 10 §4). Hành động mặc định là **đánh dấu để người xét**, không tự khóa, trừ ghi chú «tự động».

### 2.1 Thưởng bất thường

| # | Luật | Ngưỡng | Hành động |
|---|---|---|---|
| G-R1 | Án khách nhiều hơn `CASES_PER_DAY` | > 3 / ngày kinh tế | **tự động** từ chối thưởng (máy chủ đã chặn theo bảng) — nếu vẫn thấy yêu cầu: đánh dấu sửa client |
| G-R2 | Sảnh nghề lặp | > 1 lần thưởng / sảnh / ngày | tự động từ chối |
| G-R3 | Trà vượt thời gian thật | phút trà báo > thời gian phiên thực | tự động cắt về thời gian phiên |
| G-R4 | Án hoàn hảo quá nhanh | ≥ 10 án liên tiếp điểm ≥ 0,98 với thời gian mỗi án < 20 giây | đánh dấu bot |
| G-R5 | Nhịp thao tác máy móc | khoảng cách giữa các bước án có độ lệch chuẩn < 50 ms trong 20 án | đánh dấu bot |
| G-R6 | Chơi 24/7 | hoạt động có thưởng > 20 giờ / ngày trong 3 ngày | đánh dấu bot |
| G-R7 | Trang trại tài khoản | > 10 tài khoản mới cùng thiết bị (định danh thiết bị của nền tảng) hoặc cùng dải IP trong 24 giờ | đánh dấu; **không** dùng băm lá số để so giữa tài khoản (băm có muối riêng mỗi tài khoản — phần 10 §3.2) |
| G-R8 | Lộ Điểm chạm trần tuần trong < 1 ngày | — | đánh dấu bot |

### 2.2 Thanh toán

| # | Luật | Ngưỡng | Hành động |
|---|---|---|---|
| G-P1 | Nhiều thẻ trên một tài khoản | ≥ 3 thẻ khác nhau / 7 ngày (Stripe) | đánh dấu; giao dịch kế tiếp cần 3-D Secure |
| G-P2 | Nhiều tài khoản trên một thẻ | ≥ 3 tài khoản / 30 ngày | đánh dấu; chặn thẻ ở mức quán |
| G-P3 | Tài khoản mới mua lớn | tuổi tài khoản < 24 giờ và giao dịch ≥ 449.000đ | chờ 30 phút trước khi cấp (ghi «đang xác nhận an toàn»), nhân viên có thể xem |
| G-P4 | Mua tặng ngay sau khi tạo bạn | tình bạn < 7 ngày | **tự động** từ chối (phần 01 §4.8) |
| G-P5 | Quốc gia thẻ khác khu vực tài khoản và IP | ba nguồn khác nhau | 3-D Secure bắt buộc |
| G-P6 | Hoàn tiền lặp | ≥ 3 hoàn / 90 ngày | tài khoản `restricted` (phần 10 §8.2) |
| G-P7 | Tranh chấp thẻ | bất kỳ | quy trình §3 |
| G-P8 | Đơn `pending` dồn | > 5 đơn chưa trả tiền / giờ / tài khoản | chặn tạo đơn mới 1 giờ |

### 2.3 Tài khoản

| # | Luật | Ngưỡng | Hành động |
|---|---|---|---|
| G-A1 | Đăng nhập máy mới | thiết bị chưa thấy | email báo «Có đăng nhập mới»; mua hàng trong 24 giờ đầu trên máy mới cần xác nhận lại danh tính |
| G-A2 | Đổi email | — | email cũ nhận thông báo và liên kết hủy trong 7 ngày; trong 7 ngày đó không đổi được phương thức đăng nhập khác |
| G-A3 | Đổi tên + đổi email + mua lớn trong 24 giờ | — | đánh dấu chiếm tài khoản; tạm giữ giao dịch |
| G-A4 | Rao bán tài khoản (người chơi báo cáo) | — | cảnh cáo theo Điều khoản; không xóa món của người mua trung gian vô tình |

### 2.4 Nội bộ

| # | Luật |
|---|---|
| G-I1 | Mọi lệnh cấp Ngọc / món thủ công cần **hai người** (một tạo, một duyệt), ghi lý do và mã phiếu hỗ trợ |
| G-I2 | Trần cấp thủ công: 1.000 Ngọc / phiếu, 20.000 Ngọc / tháng / nhân viên; vượt cần chủ dự án |
| G-I3 | Nhật ký công cụ quản trị không sửa được; rà hằng tháng |
| G-I4 | Nhân viên không cấp cho tài khoản của chính mình, người thân (khai báo xung đột lợi ích) |

---

## 3. Tranh chấp thanh toán (chargeback)

### 3.1 Theo kênh

| Kênh | Hình thức | Quán làm gì |
|---|---|---|
| Stripe (thẻ quốc tế) | ngân hàng phát hành mở tranh chấp → `charge.dispute.created` | §3.2 |
| Ví VN (VNPay / MoMo / ZaloPay) | khách khiếu nại / tra soát qua ví hoặc ngân hàng | trả lời yêu cầu tra soát qua cổng merchant trong hạn của ví; cung cấp bằng chứng giao hàng (§3.3) |
| Apple | không có tranh chấp với nhà phát triển; Apple xử lý hoàn tiền | nhận `REFUND` → phần 10 §8.2 |
| Google | hoàn / hủy qua Google | nhận voided purchase → phần 10 §8.2 |

### 3.2 Quy trình tranh chấp Stripe

| Bước | Hạn | Việc |
|---|---|---|
| 1 | ngay | đánh dấu đơn `chargeback`; thu hồi quyền lợi chưa dùng (VIP dừng; Ngọc của đơn trừ như hoàn tiền) |
| 2 | ≤ 3 ngày | xét: giao dịch có dấu hiệu thẻ trộm (G-P1, G-P2, G-P5)? → **không phản đối**, chấp nhận mất, chặn thẻ |
| 3 | ≤ 5 ngày | nếu giao dịch hợp lệ (người chơi thật, dùng sản phẩm): gửi bằng chứng §3.3 |
| 4 | — | kết quả `won`: khôi phục quyền lợi nếu người chơi vẫn muốn chơi; `lost`: giữ trạng thái |
| 5 | — | tài khoản có tranh chấp `lost` không phải thẻ trộm → `restricted` |

### 3.3 Bằng chứng giao hàng

| Bằng chứng | Nguồn |
|---|---|
| Mã đơn, thời điểm, số tiền | bảng đơn hàng |
| Quyền lợi đã cấp và thời điểm | sổ cái ví, bảng quyền lợi |
| Tiêu dùng sau khi cấp: món mua bằng Ngọc của đơn, thời gian chơi | sổ cái, phiên chơi |
| Thiết bị / IP trùng với lịch sử tài khoản | nhật ký đăng nhập (giữ 12 tháng) |
| Điều khoản đã đồng ý, chính sách hoàn tiền đã hiện trước khi mua | phiên bản văn bản + thời điểm đồng ý |

Không gửi dữ liệu lá số, không gửi nội dung trò chuyện.

---

## 4. Khôi phục tài khoản

### 4.1 Theo phương thức đăng nhập

| Phương thức | Mất máy | Quên đăng nhập | Ghi chú |
|---|---|---|---|
| Đăng nhập với Apple | đăng nhập lại trên máy mới | Apple ID | — |
| Google | như trên | tài khoản Google | — |
| Email (mã một lần) | nhập email nhận mã | — | mã 6 số, hạn 10 phút, tối đa 5 lần sai / giờ |
| Ẩn danh (chưa liên kết) | **không khôi phục được** | — | §4.2 |

### 4.2 Tài khoản ẩn danh

- Tài khoản ẩn danh chưa mua gì (không mua được — phần 10 §3.1). Mất máy = mất tiến độ máy chủ của tài khoản đó.
- Nhắc liên kết: sau 3 ngày chơi, sau khi đạt cấp 10, và khi có món hiếm đầu tiên. Lời nhắc: «Liên kết tài khoản để không mất tủ đồ khi đổi máy.» Không nhắc quá 1 lần / tuần.

### 4.3 Khôi phục qua hỗ trợ (khi mất cả phương thức đăng nhập)

| Bằng chứng (cần ≥ 2) | Trọng số |
|---|---|
| Biên lai Apple / Google (email biên lai của nền tảng) có mã giao dịch khớp | mạnh |
| Mã đơn web + 4 số cuối thẻ / số điện thoại ví đã thanh toán | mạnh |
| Email đã dùng để liên kết | mạnh nếu nhận được mã ở email đó |
| Tên nhân vật, ngày tạo gần đúng, món hiếm đang có | yếu |
| Thiết bị cũ (nếu còn) | mạnh |

**Không bao giờ dùng ngày giờ sinh lá số làm câu hỏi bảo mật.** Ngày sinh thường bị người khác biết (bạn bè, mạng xã hội), và trong game người chơi lập lá số cho nhiều người.

Quy trình: tiếp nhận → xác minh (≤ 3 ngày làm việc) → khôi phục vào phương thức đăng nhập mới → thông báo tới mọi phương thức cũ còn liên lạc được → khóa mua hàng 72 giờ sau khôi phục.

### 4.4 Tài khoản bị chiếm

| Bước | Việc |
|---|---|
| 1 | Người chơi báo → khóa tạm tài khoản (không chơi, không mua) trong lúc xét |
| 2 | Xác minh chủ thật theo §4.3 |
| 3 | Khôi phục phương thức đăng nhập; đăng xuất mọi phiên |
| 4 | Ngọc / Phúc Khí bị tiêu trong thời gian bị chiếm: **khôi phục** bằng Ngọc Tặng / Phúc Khí (không hoàn tiền thật — tiền không bị chuyển ra khỏi game được) |
| 5 | Món bị tháo / đổi: khôi phục trang bị |
| 6 | Giao dịch tiền thật kẻ chiếm thực hiện bằng phương thức thanh toán của chủ: hỗ trợ chủ yêu cầu hoàn qua kênh |

---

## 5. Chế tài

| Mức | Khi nào | Biện pháp | Món đã mua |
|---|---|---|---|
| 1 · Nhắc | lần đầu khai thác lỗi nhỏ (G-3) | thông báo, thu hồi phần thưởng khai thác | giữ |
| 2 · Hạn chế | bot rõ (G-R4–R6), hoàn tiền lặp (G-P6) | tắt thưởng Phúc Khí / Lộ Điểm 7–30 ngày; hoặc chỉ mua qua web có xác minh | giữ |
| 3 · Tạm khóa | trang trại tài khoản, chiếm tài khoản người khác, gian lận thanh toán có chủ ý | khóa 30 ngày | giữ (trừ món mua bằng tiền gian lận) |
| 4 · Khóa vĩnh viễn | gian lận thanh toán lặp, rửa thẻ, quấy rối nghiêm trọng (tài liệu 10) | khóa | món mua bằng tiền hợp lệ: theo luật; Ngọc Nạp chưa tiêu hợp lệ: hoàn theo Chính sách Ngọc nếu luật yêu cầu |

Mọi chế tài từ mức 2 có quyền **khiếu nại** trong 30 ngày; người xét khiếu nại khác người ra quyết định.

**Không chế tài:** người chơi có Hợp mệnh, người chơi nhiều giờ nhưng không có dấu hiệu bot, người chơi mua nhiều (chi tiêu không phải tội).

---

## 6. Hỗ trợ khách hàng

### 6.1 Thời gian phản hồi

| Loại | Phản hồi đầu | Xử lý xong |
|---|---|---|
| Đã trả tiền chưa nhận | 4 giờ (giờ hành chính), 24 giờ (ngoài giờ) | 24 giờ |
| Chiếm tài khoản | 4 giờ | 3 ngày làm việc |
| Hoàn tiền | 24 giờ | 5 ngày làm việc |
| Phụ huynh | 24 giờ | 3 ngày làm việc |
| Khác | 72 giờ (VIP 24 giờ — phần 07 §3.2) | — |

### 6.2 Mẫu trả lời (rút gọn)

**Đã trả tiền chưa nhận Ngọc**

> Chào bạn, quán đã nhận được thông tin đơn <mã đơn>. Quán kiểm thấy <ví / Apple / Google> đã xác nhận thanh toán lúc <giờ>, nhưng Ngọc chưa vào tủ do <lý do>. Quán vừa cấp <N> Ngọc vào tài khoản. Bạn mở lại game là thấy. Xin lỗi bạn vì phải chờ.

**Yêu cầu hoàn tiền trong thời hạn, chưa dùng**

> Chào bạn, đơn <mã đơn> đủ điều kiện hoàn theo chính sách (gói chưa tiêu Ngọc nào, trong 7 ngày). Quán đã gửi lệnh hoàn <số tiền> về <phương thức>. Thời gian tiền về tài khoản tùy ngân hàng / ví, thường 3–10 ngày làm việc. <N> Ngọc của đơn đã được thu lại.

**Yêu cầu hoàn tiền ngoài chính sách**

> Chào bạn, quán hiểu bạn muốn hoàn đơn <mã đơn>. Theo chính sách, gói này đã dùng <x> Ngọc từ <ngày> nên quán không hoàn tự nguyện được. Nếu bạn mua qua <Apple / Google>, bạn có thể gửi yêu cầu trực tiếp tại <đường dẫn trang hỗ trợ nền tảng>; quán sẽ trả lời nền tảng thông tin sử dụng một cách trung thực.

**Phụ huynh báo trẻ mua**

> Chào anh / chị, quán rất tiếc về việc này. Anh / chị gửi giúp quán: mã đơn (hoặc email biên lai), và xác nhận tài khoản của cháu. Quán sẽ hoàn các giao dịch không được phép và chuyển tài khoản của cháu sang chế độ người dưới 18 tuổi với Bảng Phụ Huynh để anh / chị đặt trần chi tiêu.

**Người chơi hỏi «mua món này có tốt cho mệnh không»**

> Chào bạn, món ở Tàng Y Các chỉ là trang phục, không ảnh hưởng vận mệnh, Đạo Hạnh hay công đức. Riêng bộ Hợp mệnh có thêm 10% Phúc Khí (tiền tiêu trong game) khi giải án, và bộ này đổi được bằng Phúc Khí cày trong game. Nếu bạn đang lo lắng về một chuyện trong đời, Thầy trong quán có thể cùng bạn xem lá số; những việc bạn có thể làm đều miễn phí.

(Câu cuối dựa trên `RB5`: hóa giải là hành động, không phải mua.)

---

## 7. Bồi thường

| Sự cố | Bồi thường | Ai nhận |
|---|---|---|
| Máy chủ ngừng ngoài kế hoạch 2–6 giờ | 50 Ngọc + 600 Lộ Điểm | mọi tài khoản hoạt động trong 7 ngày trước |
| > 6 giờ | 150 Ngọc + 1 ngày VIP cho người đang VIP (cộng vào hạn) + 1.200 Lộ Điểm | như trên |
| Lỗi làm mất thưởng ngày (điểm danh, VIP) | cấp lại đúng phần mất | người bị ảnh hưởng (từ nhật ký) |
| Lỗi giá (bán rẻ sai) | người đã mua **giữ** món; sửa giá; không thu hồi | — |
| Lỗi giá (bán đắt sai) | hoàn chênh lệch bằng hình thức đã trả | người đã mua |

Trần bồi thường Ngọc: 500 / tháng / tài khoản (phần 03 §6.3).

---

## 8. Checklist nghiệm thu phần 13

- [ ] Luật G-R1–R3, G-P4 chạy tự động ở máy chủ (test).
- [ ] Luật đánh dấu có hàng chờ người xét, có nhật ký quyết định.
- [ ] Cấp thủ công cần hai người (G-I1), có trần (G-I2).
- [ ] Không có câu hỏi bảo mật dùng ngày sinh lá số.
- [ ] Quy trình tranh chấp Stripe và tra soát ví có người phụ trách, có hạn.
- [ ] Mẫu trả lời có trong công cụ hỗ trợ; mẫu cuối (hỏi «tốt cho mệnh») được cố vấn duyệt lời.
