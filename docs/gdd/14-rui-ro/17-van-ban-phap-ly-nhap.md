# 14.17 · Văn bản pháp lý bản nháp — Chính sách quyền riêng tư, Điều khoản sử dụng, Nội quy cộng đồng, Điều kiện mua hàng

> **Bản nháp do đội sản xuất soạn để luật sư sửa.** Không công bố khi chưa có luật sư duyệt (tập 14.11). Chỗ `[…]` là thông tin chủ dự án điền. Chỗ đánh dấu **(cần luật sư xác minh)** là điều khoản đội không chắc về căn cứ.
> Mã: `RISK-DOC-xx`. Chủ: `PC`. Nguồn dữ liệu cho nội dung: bảng kê tập 14.12 §1, bảng tính năng × nền tảng tập 14.11 §8.1.
> Nguyên tắc viết: tiếng Việt đơn giản; câu ngắn; nói đúng những gì mã làm; không hứa quá.

---

## 0. Yêu cầu chung với bộ văn bản

| Mã | Yêu cầu |
|---|---|
| RISK-DOC-01 | Mỗi văn bản có số phiên bản, ngày hiệu lực, bảng thay đổi so với bản trước. |
| RISK-DOC-02 | Có bản tóm tắt một màn hình («Điều chính cần biết») đặt trước bản đầy đủ. |
| RISK-DOC-03 | Văn bản hiển thị được trong app **không cần link ngoài** (yêu cầu bản iOS — `verify-ios-review-path.mjs` kiểm không có link `http`). |
| RISK-DOC-04 | Khi văn bản đổi nội dung quan trọng (dữ liệu gửi đi, bên nhận, giá): hỏi lại đồng ý (tập 14.12 RISK-PV-10). |
| RISK-DOC-05 | Văn bản khớp hành vi mã; thay đổi giao thức, nhà cung cấp AI phải cập nhật văn bản trong cùng mốc (RISK-CK-ALL-07). |
| RISK-DOC-06 | Có bản tiếng Anh khi phục vụ người chơi ngoài Việt Nam; bản tiếng Việt là bản chính tại Việt Nam **(cần luật sư xác minh)**. |

---

## 1. Chính sách quyền riêng tư — «Điều chính cần biết»

> **Huyền Giới — Quyền riêng tư của bạn (tóm tắt)**
>
> 1. **Ngày giờ sinh của bạn ở trên máy bạn.** Chúng tôi không lưu ngày giờ sinh của bạn trên máy chủ.
> 2. **Khi bạn chơi cùng người khác**, họ thấy tên nhân vật, hình nhân vật và màu áo của bạn. Màu áo mặc định theo hành hợp mệnh, nên người khác có thể đoán được hành đó.
> 3. **Khi bạn hỏi Thầy AI**, câu hỏi và bảng tóm tắt lá số (đủ để suy ra ngày sinh) được gửi tới nhà cung cấp AI [tên] tại [nơi xử lý]. Game hỏi bạn trước lần đầu. Bạn có thể tắt Thầy AI bất cứ lúc nào.
> 4. **Chúng tôi không bán dữ liệu**, không dùng dữ liệu của bạn để quảng cáo.
> 5. **Nội dung âm tà** chỉ hiện khi bạn tự bật.
> 6. **Bạn có thể xem, xuất, xóa** dữ liệu trong Sổ Mệnh → Cài đặt → Dữ liệu của tôi.
> 7. Câu hỏi về quyền riêng tư: [email].

---

## 2. Chính sách quyền riêng tư — bản đầy đủ (nháp)

### Điều 1. Chúng tôi là ai

[Tên chủ thể / doanh nghiệp], địa chỉ [..], email liên hệ bảo vệ dữ liệu: [..]. Chính sách này áp dụng cho trò chơi Huyền Giới · Mệnh Do Ta Tạo trên web, iOS (tab Học Quán trong ứng dụng [tên app]), Android và PC.

### Điều 2. Dữ liệu chúng tôi xử lý

**2.1. Dữ liệu chỉ nằm trên thiết bị của bạn** (chúng tôi không nhận được):
- ngày, giờ, phút sinh, giới tính, tên bạn nhập ở cổng Sơn Môn;
- hồ sơ lá số người khác bạn lập trong Sổ Mệnh (tối đa 5);
- tiến độ chơi, Phúc Khí, thành tựu, nhật ký án, trang phục, cài đặt;
- danh sách người chơi bạn đã ẩn;
- sổ ghi việc thiện ngoài đời (nếu bạn bật).

**2.2. Dữ liệu gửi lên máy chủ của chúng tôi khi bạn chơi trực tuyến:**

| Dữ liệu | Để làm gì | Lưu bao lâu |
|---|---|---|
| Tên nhân vật | Hiển thị cho người cùng phòng | Trong phiên kết nối |
| Màu áo, màu đai, kiểu nhân vật, trang phục, danh hiệu | Hiển thị nhân vật | Trong phiên kết nối |
| Vị trí nhân vật trong thế giới, động tác, cụm từ chọn sẵn | Cho người khác thấy bạn | Trong phiên; cụm từ không lưu |
| Mã thiết bị ngẫu nhiên (không gắn với danh tính thật) | Chặn, báo cáo, chống lạm dụng | Trong phiên; trong báo cáo tối đa 90 ngày |
| Địa chỉ IP | Chống lạm dụng, giới hạn tốc độ | Vài phút; nhật ký kỹ thuật [..] **(cần điền khi có quyết định băm IP)** |
| Báo cáo bạn gửi về người khác, báo cáo người khác gửi về bạn | Kiểm duyệt cộng đồng | Tối đa 90 ngày sau khi xử lý |

**2.3. Dữ liệu gửi tới nhà cung cấp AI** (chỉ khi bạn hỏi Thầy AI và đã đồng ý):
- câu hỏi bạn gõ và các câu trong cùng lần trò chuyện;
- bảng tóm tắt lá số: bốn trụ can chi, tỉ lệ ngũ hành, vượng suy, Dụng thần, cách cục, đại vận theo tuổi, lưu niên, thần sát, tuổi hiện tại, giới tính, ngày hôm nay. **Từ bảng này có thể suy ra ngày sinh của bạn.**

Chúng tôi không gửi tên bạn. Đừng gõ vào câu hỏi những thông tin bạn không muốn chia sẻ (họ tên thật, địa chỉ, bệnh án). Nhà cung cấp hiện tại: [tên, quốc gia xử lý, chính sách lưu giữ]. Chúng tôi yêu cầu nhà cung cấp không dùng dữ liệu này để huấn luyện mô hình **(điền theo hợp đồng thực tế)**.

**2.4. Dữ liệu tài khoản** (khi có tính năng tài khoản): [phương thức đăng nhập, email, năm sinh để tuân thủ quy định trò chơi, trạng thái xác thực, tiến độ đồng bộ, số dư Ngọc, lịch sử giao dịch] **(hoàn thiện khi triển khai P1–P2, tập 14.12 §5)**.

**2.5. Dữ liệu chúng tôi không thu thập:** vị trí địa lý của thiết bị, danh bạ, ảnh, micro, camera, nội dung trò chuyện với Thầy AI trên máy chủ của chúng tôi.

**2.6. Số liệu an toàn:** chúng tôi đếm (không kèm nội dung, không kèm định danh) số lần bộ lọc an toàn hoạt động để cải thiện an toàn.

### Điều 3. Dữ liệu nhạy cảm

Câu hỏi của bạn với Thầy AI có thể chứa thông tin về sức khỏe, niềm tin tôn giáo. Chúng tôi không lưu nội dung đó trên máy chủ của mình. Lựa chọn đạo thống, môn phái trong game là **lựa chọn trong trò chơi**, không thể hiện niềm tin thật của bạn; nếu được lưu trên máy chủ, chúng tôi chỉ lưu mã trò chơi và không dùng cho mục đích nào khác **(cần luật sư xác minh cách phân loại)**.

### Điều 4. Căn cứ xử lý

Chúng tôi xử lý dữ liệu dựa trên sự đồng ý của bạn (chơi trực tuyến, Thầy AI, nội dung âm tà) và để thực hiện dịch vụ bạn yêu cầu; một số dữ liệu được xử lý theo nghĩa vụ pháp luật (xác thực, giờ chơi, hóa đơn) **(cần luật sư xác minh căn cứ theo Luật Bảo vệ dữ liệu cá nhân 2025 và văn bản hướng dẫn)**.

### Điều 5. Chia sẻ dữ liệu

| Bên nhận | Dữ liệu | Mục đích |
|---|---|---|
| Người chơi cùng phòng | Tên, hình, màu áo, danh hiệu, vị trí, động tác | Chơi cùng nhau |
| Nhà cung cấp hạ tầng [Cloudflare] | Dữ liệu kết nối | Vận hành máy chủ |
| Nhà cung cấp AI [tên] | Như Điều 2.3 | Trả lời câu hỏi |
| Cửa hàng ứng dụng, cổng thanh toán | Thông tin giao dịch | Thanh toán |
| Cơ quan nhà nước có thẩm quyền | Theo yêu cầu hợp pháp | Tuân thủ pháp luật |

Chúng tôi không bán dữ liệu cá nhân.

### Điều 6. Chuyển dữ liệu ra nước ngoài

Hạ tầng máy chủ và nhà cung cấp AI có thể xử lý dữ liệu ngoài Việt Nam [liệt kê]. Chúng tôi lập hồ sơ theo quy định **(cần luật sư xác minh thủ tục)**.

### Điều 7. Quyền của bạn

Bạn có quyền được biết, đồng ý, truy cập, chỉnh sửa, xóa, hạn chế xử lý, rút đồng ý, phản đối, khiếu nại **(cần luật sư xác minh danh mục theo luật hiện hành)**. Cách thực hiện:
- trên máy: Sổ Mệnh → Cài đặt → Dữ liệu của tôi (xem, xuất, sửa, xóa, tắt Thầy AI, tắt chơi trực tuyến);
- trên máy chủ: nút «Yêu cầu xóa dữ liệu trên máy chủ» hoặc email [..]. Chúng tôi trả lời trong [30] ngày **(cần luật sư xác minh thời hạn)**.

### Điều 8. Trẻ em

- Dưới 13 tuổi: game chỉ chạy chế độ chơi đơn; không kết nối máy chủ, không có Thầy AI.
- Từ 13 đến dưới 18 tuổi: một số tính năng bị giới hạn (âm tà, hợp hôn, nạp tiền, trò chuyện AI tự do theo độ tuổi); cần đồng ý của cha mẹ hoặc người giám hộ theo quy định **(cần luật sư xác minh mốc tuổi và cách lấy đồng ý)**.
- Tuổi được xác định từ năm sinh bạn nhập (trên máy) và, khi có tài khoản, năm sinh tuân thủ.
- Cha mẹ có thể yêu cầu xóa dữ liệu của con qua [email].

### Điều 9. Bảo mật

Chúng tôi dùng kết nối mã hóa, giới hạn quyền truy cập quản trị, lọc dữ liệu đầu vào. Không có hệ thống nào an toàn tuyệt đối. Nếu xảy ra sự cố ảnh hưởng tới dữ liệu của bạn, chúng tôi sẽ thông báo cho cơ quan có thẩm quyền và cho bạn theo quy định.

### Điều 10. Lưu trữ

Như bảng Điều 2. Khi bạn xóa dữ liệu trên máy, dữ liệu mất vĩnh viễn trừ khi bạn đã xuất bản sao.

### Điều 11. Thay đổi chính sách

Khi thay đổi điều quan trọng, chúng tôi thông báo trong game và hỏi lại đồng ý nếu cần.

### Điều 12. Liên hệ

[email bảo vệ dữ liệu], [địa chỉ].

---

## 3. Điều khoản sử dụng — bản nháp

### Điều 1. Chấp nhận

Bằng việc chơi Huyền Giới, bạn đồng ý với Điều khoản này, Chính sách quyền riêng tư và Nội quy cộng đồng. Nếu bạn dưới 18 tuổi, cha mẹ hoặc người giám hộ cần đọc cùng bạn **(cần luật sư xác minh)**.

### Điều 2. Trò chơi là gì

2.1. Huyền Giới là trò chơi văn hóa – giáo dục: người chơi tìm hiểu cổ học phương Đông (Tứ Trụ, phong thủy, lịch pháp) và các truyền thống tín ngưỡng qua câu chuyện về việc **tự sửa mình**.

2.2. **Mọi luận giải trong game để tham khảo và chiêm nghiệm.** Game không đưa ra lời khuyên y tế, tâm lý, pháp lý, tài chính, không dự báo chắc chắn tương lai. Đừng dựa vào game để ra quyết định quan trọng về sức khỏe, hôn nhân, tiền bạc.

2.3. **Thầy AI** là phần mềm. Lời của Thầy AI có thể sai. Game hiển thị nhãn «AI» và điểm «Neo» để bạn biết câu trả lời khớp dữ liệu lá số tới đâu.

2.4. Phép thuật, bùa, Âm Bài, yểm thuật trong game là **ký hiệu hư cấu**, không có tác dụng ngoài đời. Nghi lễ tôn giáo thật do người thực hành của truyền thống đó thực hiện; game không thay thế.

2.5. Các thánh địa trong game **lấy cảm hứng** từ công trình có thật nhưng là bản hư cấu.

### Điều 3. Tài khoản và thiết bị

3.1. Hiện tại game dùng mã thiết bị ngẫu nhiên. Nếu bạn xóa dữ liệu trình duyệt hoặc đổi máy, tiến độ có thể mất; hãy dùng chức năng xuất dữ liệu.

3.2. Khi có tài khoản: bạn chịu trách nhiệm giữ an toàn phương thức đăng nhập; không chia sẻ, mua bán, cho thuê tài khoản.

### Điều 4. Hành vi bị cấm

Bạn không được:
- đặt tên, dùng danh hiệu xúc phạm, thô tục, mạo danh tu sĩ, nhân vật thiêng, người nổi tiếng, nhân viên;
- quảng cáo dịch vụ (đặc biệt dịch vụ tâm linh: xem bói, giải hạn, bùa), đưa thông tin liên lạc vào tên;
- quấy rối, dụ dỗ người khác, nhất là trẻ em, liên lạc ngoài game;
- sửa đổi phần mềm, dùng công cụ gian lận, tự động hóa, tấn công máy chủ, rút hạn mức AI;
- dùng game hoặc Thầy AI để tìm cách gây hại cho người khác;
- vi phạm pháp luật Việt Nam và pháp luật nơi bạn ở.

### Điều 5. Nội dung người dùng

Nội dung bạn tạo (hiện chỉ là tên nhân vật, sau này có thể là tên trên Bảng Vàng) phải tuân thủ Nội quy cộng đồng. Chúng tôi có quyền đổi, ẩn nội dung vi phạm.

### Điều 6. Kiểm duyệt, xử lý vi phạm

Chúng tôi xử lý báo cáo theo thang ở Nội quy cộng đồng. Bạn được thông báo lý do và có thể kháng nghị một lần trong 14 ngày.

### Điều 7. Vật phẩm ảo, Ngọc, VIP

7.1. Ngọc, Phúc Khí, vật phẩm, VIP là quyền sử dụng trong game, **không phải tài sản**, không quy đổi ra tiền, không chuyển nhượng **(cần luật sư xác minh cách diễn đạt phù hợp quy định hiện hành)**.

7.2. Game **không bán** công đức, Đạo Hạnh, cảnh giới, kết quả luận giải, vật phẩm hứa thay đổi vận mệnh, hộp ngẫu nhiên.

7.3. Điều kiện mua hàng chi tiết ở Mục 5 tài liệu này.

### Điều 8. Sở hữu trí tuệ

Nội dung game thuộc [chủ dự án] hoặc được cấp phép. Văn bản cổ thuộc phạm vi công cộng được trích theo nguồn; bản dịch có ghi tác giả, nguồn khi có.

### Điều 9. Giới hạn trách nhiệm

Trong phạm vi pháp luật cho phép, chúng tôi không chịu trách nhiệm cho quyết định đời thực bạn đưa ra dựa trên nội dung game **(cần luật sư xác minh phạm vi được phép giới hạn, đặc biệt với người tiêu dùng)**.

### Điều 10. Sức khỏe

Nghỉ ngơi sau mỗi 90 phút. Nếu bạn từng bị động kinh do ánh sáng, hãy hỏi bác sĩ trước khi chơi. Bài thở trong game là thở chậm nhẹ nhàng; dừng lại nếu chóng mặt.

### Điều 11. Thay đổi, chấm dứt

Chúng tôi có thể thay đổi, tạm ngừng tính năng (ví dụ tắt Thầy AI) để bảo đảm an toàn. Bạn có thể ngừng chơi và xóa dữ liệu bất cứ lúc nào.

### Điều 12. Giải quyết tranh chấp, luật áp dụng

[Luật áp dụng, cơ quan giải quyết] **(cần luật sư xác minh)**.

### Điều 13. Liên hệ

[email hỗ trợ].

---

## 4. Nội quy cộng đồng — bản hiển thị trong game

> **Nội quy Sơn Môn**
>
> Huyền Giới là nơi tĩnh. Ở đây người ta tới để học, để giúp người, để ngồi uống chén trà.
>
> **Được khuyến khích:** chào nhau, mời trà, cùng giải án, giúp người mới.
>
> **Không được:**
> 1. Đặt tên thô tục, xúc phạm tôn giáo, dân tộc, vùng miền.
> 2. Đặt tên giả làm tu sĩ, thần Phật, người nổi tiếng, nhân viên quán.
> 3. Đưa số điện thoại, Zalo, Facebook, đường dẫn vào tên.
> 4. Quảng cáo xem bói, giải hạn, bùa, dịch vụ tâm linh.
> 5. Rủ người khác ra ngoài game, xin thông tin cá nhân — đặc biệt với người nhỏ tuổi.
> 6. Quấy rối, bám theo, chắn đường, làm phiền liên tục.
> 7. Gian lận, dùng phần mềm can thiệp.
> 8. Bất kính nơi thờ: trong điện, hãy đi chậm, giữ yên lặng.
>
> **Nếu gặp chuyện không ổn:** bấm vào người đó → «Ẩn người này» hoặc «Báo cáo». Báo cáo «Dụ dỗ, rủ ra ngoài» được xử lý trước tiên.
>
> **Xử lý vi phạm:** đổi tên → khóa chơi chung 24 giờ → 7 ngày → vĩnh viễn, tùy mức độ. Bạn được biết lý do và có thể kháng nghị.
>
> **Nếu bạn đang rất buồn hoặc gặp nguy hiểm:** Sổ Mệnh → Nơi hỗ trợ.

### 4.1 Ví dụ cụ thể cho người chơi (trang trợ giúp)

| Được | Không được | Vì sao |
|---|---|---|
| «Tiểu Vân», «Lam Sơn Khách» | «Thích Minh [..]» | Giống pháp danh tu sĩ |
| «Hạc Già» | «Ngọc Hoàng Đại Đế» | Danh xưng thiêng |
| «Mây Chiều 1990» | «Thầy Hùng 09xx…» | Thông tin liên lạc, quảng cáo |
| «Người Học Việc» | «Admin Huyền Quán» | Mạo danh nhân viên |
| Chào, mời trà người mới | Đi theo một người khắp bản đồ sau khi bị ẩn | Quấy rối |

---

## 5. Điều kiện mua hàng — bản nháp (khi bật thanh toán, M6)

| Mục | Nội dung |
|---|---|
| Hàng hóa | Ngọc (tiền tệ trong game), gói VIP «Chân Nhân» (thuê bao [kỳ hạn]) |
| Giá | Hiển thị bằng VNĐ, đã gồm thuế, trước khi xác nhận |
| Dùng để | Mua trang phục, hào quang, ngự vật, khung tên, tiện ích. **Không** mua được công đức, Đạo Hạnh, cảnh giới, luận giải, vật phẩm hứa thay đổi vận mệnh |
| Không có | Hộp ngẫu nhiên, quay thưởng, vật phẩm có tỉ lệ |
| Quyền lợi VIP | [liệt kê đúng như màn VIP sau khi sửa RISK-134: Ngọc hằng ngày, trang phục độc quyền không mang biểu tượng thiêng, thêm lượt hỏi AI cùng chất lượng] |
| Hủy VIP | Trên iOS / Android: trong cài đặt cửa hàng; trên web: [..] |
| Hoàn tiền | iOS / Android: theo chính sách cửa hàng; web: [chính sách] **(cần luật sư xác minh nghĩa vụ hoàn tiền với hàng số)** |
| Người dưới 18 | Không nạp được |
| Khi đóng dịch vụ | [Cam kết thông báo trước N ngày; xử lý Ngọc chưa dùng] **(cần luật sư xác minh)** |
| Khiếu nại | [email], phản hồi trong [..] ngày |

---

## 6. Văn bản trong game (vi văn bản bắt buộc)

| Vị trí | Văn bản | Mã liên quan |
|---|---|---|
| Cổng Sơn Môn, trước form ngày sinh | «Ngày giờ sinh của bạn được lưu trên máy này để lập nhân vật. Chúng tôi không lưu nó trên máy chủ.» | RISK-PV-01 |
| Dưới form (cờ không rõ giờ) | «Không rõ giờ sinh? Thầy sẽ lập lá số không có trụ giờ — một phần chỉ số sẽ kém chính xác.» | (bám `hourWarning` của app) |
| Màn đầu tiên | «Game có hiệu ứng ánh sáng. Nếu bạn từng bị động kinh do ánh sáng, hãy hỏi bác sĩ trước khi chơi.» | RISK-MH-52 |
| Trước khi vào MMO lần đầu | «Khi chơi cùng người khác, họ thấy tên, hình nhân vật và màu áo của bạn. [Nội quy] [Đồng ý] [Chơi một mình]» | RISK-LG-51 |
| Khung chat Thầy AI | Nhãn «AI»; dòng «Thầy luận bằng AI trên lá số đã tính sẵn… để tham khảo và học, không thay quyết định của bạn.» (đã có trong `master-ui.js`) | RISK-070 |
| Mọi màn luận giải | «Để tham khảo và chiêm nghiệm.» | `GAME-MMO-PROMPT-PLAN.md` |
| Thái Tuế Điện | «Đây là phong tục văn hóa. Cải vận thật là sửa mình: xem Mệnh Đồ.» | RISK-016 |
| Tàng Y Các, mô tả «Hợp mệnh» | «Thưởng Phúc Khí trong game, không ảnh hưởng Đạo Hạnh, không có tác dụng ngoài đời.» | §11 canon |
| Trước Quỷ Môn Quan | tập 14.08 §3.6 AT-50 | RISK-021 |
| Sổ Mệnh → Nơi hỗ trợ | Danh sách tập 14.09 §5 | RISK-MH-33 |
