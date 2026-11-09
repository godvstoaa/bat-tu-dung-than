# 11 · Phần 20 — Lộ trình triển khai, kinh tế xã hội, giao diện với tài liệu khác, hỏi đáp người chơi

> Phần khép tài liệu 11: bật kinh tế theo từng giai đoạn có cửa kiểm (để không bao giờ thu tiền trước khi rào chắn sẵn sàng); luật kinh tế cho các hệ xã hội của tài liệu 10; điểm nối với các tài liệu 02–14; và bộ hỏi đáp viết cho người chơi.

---

## 1. Lộ trình bật kinh tế

Các giai đoạn E0–E6 bám mốc M0–M6 của sơ đồ tổng §13.4. Mỗi giai đoạn có **cửa kiểm**: chưa qua thì không sang giai đoạn sau. Không có thanh toán thật nào trước E4.

| GĐ | Song song mốc | Nội dung | Cửa kiểm để sang giai đoạn sau |
|---|---|---|---|
| **E0 · Sửa nền** | M0 | sửa PK-1 (danh xưng, trà theo `xp`), PK-2 (khóa băm lá số); bình giá 5 bộ + `SKU-K-01..06`; hoàn chênh lệch bộ đắt; đổi tên `phap_luan`; sửa 6 mô tả; lint L1–L12; quyết định tên VIP | K-15 … K-18, K-33, K-34, K-37 xanh; chủ dự án ký quyết định tên VIP |
| **E1 · Máy chủ ví (chạy bóng)** | M1 | tài khoản ẩn danh; Két; sổ cái Phúc Khí / Ngọc **ghi song song** với `localStorage` nhưng client vẫn dùng số cục bộ; ngày kinh tế máy chủ | 30 ngày chạy bóng, lệch số dư giữa máy chủ và client < 0,5% (lệch do lỗi client cũ); K-42 … K-53 xanh |
| **E2 · Máy chủ là nguồn sự thật** | M2 | client đọc số dư từ máy chủ; di trú một lần; phiếu trang bị MMO; chuỗi điểm danh tạm dừng | di trú chạy trên ≥ 95% người chơi hoạt động không lỗi; không khiếu nại mất tiến độ chưa giải quyết > 7 ngày |
| **E3 · Mùa thử** | M2–M3 | SEASON-01 Thanh Lộ (phần 17); analytics có đồng ý; bảng rào chắn | mốc quyết định phần 17 §8 (X4, X13) |
| **E4 · Mở Ngọc web** | M3–M4 | pháp nhân, merchant VNPay / MoMo / ZaloPay; G1 (nếu áp dụng); bộ văn bản công khai; trần chi tiêu; Bảng Phụ Huynh; `SKU-P-01..04`, `SKU-B-01` | phần 11 §8 đủ; K-54 … K-61, K-79 … K-82 xanh; đối soát 14 ngày chênh lệch 0 |
| **E5 · IAP iOS / Android** | M4–M5 | plugin StoreKit 2, Play Billing; ASN v2, RTDN; sản phẩm trên App Store Connect / Play Console; xóa tài khoản trong app | duyệt App Store / Google Play thành công; K-62 … K-66 xanh |
| **E6 · VIP và Kim Thư** | M5–M6 (chương Thu SEASON-01) | `SKU-V-*`, `SKU-DL-*`; `SKU-P-05` | `ETH_REFUND_RATE` ≤ 2% sau 60 ngày E4–E5; hội đồng phần 01 §8.1 ký mở |

**Lùi giai đoạn:** nếu một chỉ số rào chắn (phần 12 §4.3) đỏ hai tuần liền, giai đoạn hiện tại có thể lùi (ví dụ tắt `SKU-P-05` bằng cần gạt, hoặc hoãn Kim Thư sang chương sau). Lùi không bao giờ làm mất thứ người chơi đã mua.

---

## 2. Kinh tế trong các hệ xã hội

Tài liệu 10 thiết kế hệ xã hội (`GUILD-*`, `EV-*`); phần này chỉ đặt **luật tiền** cho các hệ đó.

### 2.1 Môn phái

| Thứ | Luật |
|---|---|
| Vào môn phái | miễn phí, theo điều kiện đạo thống (tài liệu 05, 10) |
| Quỹ môn phái | chỉ nhận **vật liệu mua bằng Phúc Khí** và **Cống Hiến từ việc chung**; không nhận Ngọc, không nhận tiền thật |
| Cống Hiến | tối đa 50% / tuần từ Phúc Khí (phần 02 §4.9); không đổi ra Ngọc, Phúc Khí, Đạo Hạnh, công đức |
| Đạo tràng chung | công trình xây bằng quỹ; mọi công trình vẫn phải đi vào được (T4); không có công trình «trả tiền xây nhanh» |
| Sổ công đức chung của môn phái (sơ đồ tổng §10) | **chỉ** cộng từ việc thiện của thành viên (tài liệu 05); không có đường từ quỹ vật liệu sang sổ công đức |
| Chức vị môn phái | theo cảnh giới / Cống Hiến / bầu (tài liệu 10); không bán |
| Trang phục môn phái | đồng phục môn phái (nếu có) **miễn phí** cho thành viên; màu theo đạo thống, không phải món bán |

### 2.2 Sư đồ

| Thứ | Luật |
|---|---|
| Nhận đệ tử | điều kiện cảnh giới ≥ 4 (sơ đồ tổng §10); không bán quyền (M11) |
| Thưởng sư phụ | Phúc Khí theo phần 02 D19; công đức theo tài liệu 05 |
| Quà sư phụ cho đệ tử | sư phụ được **mua tặng** đệ tử trong trần 5 món / tuần (phần 01 §4.8); không có «gói nhận đệ tử» |
| Đệ tử trả ơn | không có cơ chế chuyển tiền / Ngọc lên sư phụ |

### 2.3 Hợp hôn, kết nghĩa

| Thứ | Luật |
|---|---|
| Lễ kết nghĩa / hợp hôn trong game | miễn phí; trang phục lễ có thể mua (món thẩm mỹ thường) nhưng **không bắt buộc** |
| Vật phẩm đôi (vệt bước Song Hành `SKU-F-thattich-04`) | mua một, hai người cùng nhận; tính 1 món tặng |
| Kết quả so lá số (`hehun`, `nayin-relation`) | không bao giờ có bản trả phí «xem sâu hơn» (M6) |

### 2.4 Nhà riêng và khách

| Thứ | Luật |
|---|---|
| Mời khách | miễn phí; sức chứa 4, mở rộng bằng `SKU-U-07` |
| Khách «tặng quà tân gia» | chỉ qua mua tặng (trần chung) |
| Chấm phong thủy nhà | điểm như nhau giữa món bán và món miễn phí cùng chức năng (phần 06 §6.1) |
| Xếp hạng nhà đẹp (nếu có, tài liệu 10) | bình chọn của người chơi; **không** tính số món đắt; không thưởng Ngọc |

### 2.5 Thiên Bảng

| Thứ | Luật |
|---|---|
| Xếp theo | Đạo Hạnh (sơ đồ tổng §14) |
| Hiển thị | tên, cảnh giới, đạo thống, Đạo Hạnh; **không** khung tên, hào quang, VIP |
| Thưởng chốt bảng | danh hiệu (vòng giữa); không Ngọc, không món bán (phần 03 §3.2 «Không có») |

---

## 3. Điểm nối với các tài liệu khác

| Tài liệu | Tài liệu 11 cần | Tài liệu 11 cung cấp |
|---|---|---|
| 00 Kinh điển chung | tên tiền tệ, vùng, NPC, chỉ số | đề xuất đổi tên VIP (phần 04 §5.5) — chờ chủ dự án |
| 02 Thế giới | mô tả vùng để thiết kế món vùng | — |
| 03 Cốt truyện | thưởng Phúc Khí / Ngọc theo chương (`MQ-*`) — tài liệu 03 ghi số theo khung phần 02 D15 và phần 03 §3.2 | khung thưởng; luật «NPC không nhắc cửa hàng» |
| 04 Chỉ số | ngưỡng danh xưng (`TITLES`) sau sửa PK-1; dải Tiềm Lực cho chỉ số công bằng | yêu cầu: cấp (`levelOf`) và cảnh giới tách nhau; Hợp mệnh chỉ chạm `phucKhi`, `xp` |
| 05 Cải mệnh | danh sách `DEED-*`; chuỗi tu cấp món vòng giữa (`SKU-A-*`) | bức tường: không đường nào từ tiền / Ngọc / Phúc Khí vào công đức, Đạo Hạnh, Nợ Âm |
| 06 NPC · AI | persona Bà Tư (`tho_may`); quy tắc AI hỏi lặp, khủng hoảng | lời thoại phần 15 §11; luật lượt AI (phần 01 §4.3) |
| 07 Thánh địa | `POI-*` sạp hàng vùng; cờ không gian tĩnh | danh mục món vùng (phần 05), câu hỏi cố vấn (phần 05 §6) |
| 08 Công trình | `MOD-*` bản miễn phí của nội thất; cờ «không gian tĩnh» cho nội thất | danh mục `SKU-H-*` theo chức năng (phần 06 §6) |
| 09 Tu luyện | mã hoạt động `MG-xx`, `ACT-xx`; Đạo Hạnh từng hoạt động | Phúc Khí từng hoạt động (phần 02 §3.2), trần, ngân sách ngày |
| 10 Xã hội | `GUILD-*`, `EV-*` (sự kiện lễ, Lập Xuân) | luật tiền xã hội (§2), quà lễ (phần 03 §3.2), món lễ (phần 06) |
| 12 Trình bày | `UI-xx` cho màn hình kinh tế; âm thanh mua | đặc tả nội dung màn hình và lời (phần 15) |
| 13 Kỹ thuật | `TASK-*`, `SCHEMA-*` cho Két, sổ cái, API, plugin IAP | đặc tả nghiệp vụ (phần 10), test (phần 18), hằng số (phần 16) |
| 14 Rủi ro | `RISK-xx` | rủi ro kinh tế cần đưa vào sổ: bán nhầm thứ thiêng; bị coi là trò chơi có thưởng; chi phí AI; tranh chấp thanh toán; khiếu nại trẻ em; Apple 4.3(b) |

---

## 4. Hỏi đáp cho người chơi

Bản này đặt trong Y Các › «Hỏi đáp» và trang hỗ trợ. Viết cho người chơi, không dùng thuật ngữ nội bộ.

### 4.1 Tiền trong quán

**Phúc Khí là gì?**
Là điểm bạn nhận khi ghé quán, giải án, làm nghề, ngồi trà. Dùng để thỉnh trang phục, nội thất, nhuộm áo. Phúc Khí không mua được bằng tiền.

**Tiêu Phúc Khí có làm tụt cấp không?**
Không. Cấp tính theo tổng Phúc Khí bạn từng nhận, không theo số đang có. Danh xưng cũng vậy.

**Ngọc là gì?**
Là đá quý của quán, dùng để thỉnh trang phục đẹp, vé Đạo Lộ, tiện ích. Bạn nhận Ngọc mỗi ngày điểm danh, khi lên cấp, dịp lễ — và có thể nạp.

**Ngọc có hết hạn không?**
Không.

**Đổi Ngọc ra tiền được không? Chuyển cho bạn được không?**
Không. Ngọc chỉ dùng trong quán. Muốn tặng bạn, bạn thỉnh món rồi gửi tặng (tối đa 5 món một tuần, cho bạn đã kết bạn từ 7 ngày).

**Đổi Phúc Khí sang Ngọc hay ngược lại được không?**
Không. Hai thứ tách riêng để người cày và người nạp đều công bằng.

**Lỡ một ngày điểm danh thì sao?**
Vòng 7 ngày chỉ dừng lại, lần sau bạn đi tiếp từ ngày đang dừng. Không mất gì.

### 4.2 Trang phục và mệnh

**Mặc áo đẹp có giúp vận mệnh không?**
Không. Trang phục chỉ là trang phục. Không món nào thay đổi Đạo Hạnh, cảnh giới, công đức hay lời Thầy luận về lá số.

**«Hợp mệnh» là gì?**
Mặc đủ 4 món của bộ ngũ hành trùng hành Dụng thần trong lá số của bạn thì quán tính thêm 10% Phúc Khí khi giải án và làm sảnh nghề. Chỉ vậy. Mọi bộ cùng giá, và đổi được bằng Phúc Khí.

**Sao tôi không mua được áo tràng, chuỗi hạt, pháp y?**
Vì đó là đồ của người tu. Trong quán, bạn nhận chúng khi tu tới đó — quy y, thụ lục, trì niệm. Không bán.

**Năm nay tôi phạm Thái Tuế, nên mua gì?**
Không cần mua gì. Thắp đèn an Thái Tuế trong Thái Tuế Điện không mất tiền, và Thầy sẽ chỉ những việc bạn tự làm được.

**Món bán có hình Phật, Thánh không?**
Không. Quán không bán tượng hay hình thờ.

### 4.3 VIP và Đạo Lộ

**Thượng Khách (VIP) được gì?**
30 Ngọc mỗi ngày bạn ghé quán, bay thấp ngay, mở sớm hiệu ứng ngũ hành, được thỉnh vài món riêng, thêm lượt hỏi Thầy (web, Android), thêm ô phối đồ. Không có Đạo Hạnh, cảnh giới, thứ hạng.

**Hết VIP thì sao?**
Bạn giữ mọi món đã thỉnh và Ngọc đã nhận.

**Hủy VIP thế nào?**
Web: Y Các › VIP › Quản lý › Hủy tự gia hạn. iPhone: Cài đặt Apple ID › Đăng ký. Android: Google Play › Thanh toán và gói thuê bao.

**Đạo Lộ là gì?**
Con đường của mỗi mùa (một năm can chi, 4 chương). Làm việc hằng ngày để lên bậc, nhận quà. Nhánh Thanh Lộ miễn phí; nhánh Kim Thư mua thêm (109.000đ hoặc 1.000 Ngọc).

**Mua được bậc không?**
Không. Bậc chỉ lên bằng việc làm.

**Tôi bận, vắng hai tuần, có kịp không?**
Có. Tuần bạn kiếm ít, quán ghi phần thiếu vào «quỹ bù»; khi quay lại, điểm bạn kiếm được nhân đôi tới khi bù xong.

**Món Đạo Lộ mùa cũ có mua lại được không?**
Sau 2 năm, món mùa cũ quay lại Tàng Bảo Lục với chữ «phục chế».

### 4.4 Thanh toán

**Thanh toán bằng gì?**
Web: VNPay, MoMo, ZaloPay (và thẻ quốc tế nếu quán có). iPhone: App Store. Android: Google Play.

**Đã trả tiền mà chưa thấy Ngọc?**
Đợi vài phút rồi mở lại game. Nếu sau 30 phút vẫn chưa có, vào Cài đặt › Giao dịch › chọn đơn › «Yêu cầu hỗ trợ».

**Hoàn tiền được không?**
Gói Ngọc chưa dùng trong 7 ngày, VIP lần đầu trong 48 giờ chưa nhận Ngọc VIP, vé Đạo Lộ chưa nhận thưởng trong 7 ngày: hoàn đủ (web). Mua qua App Store / Google Play: gửi yêu cầu cho nền tảng.

**Tôi lỡ tay thỉnh nhầm món?**
Trong 10 phút sau khi thỉnh, bạn bấm «Đổi ý» trong tủ đồ để trả món và nhận lại Ngọc (tối đa 3 lần một ngày).

**Tôi muốn tự giới hạn chi tiêu.**
Cài đặt › Chi tiêu › Đặt trần. Hạ trần có hiệu lực ngay; nâng trần sau 7 ngày.

**Con tôi dưới 16 tuổi chơi game.**
Tài khoản của cháu cần anh / chị xác nhận qua email. Bảng Phụ Huynh cho đặt trần (tối đa 200.000đ / 30 ngày), duyệt từng giao dịch, xem giờ chơi và yêu cầu hoàn tiền.

### 4.5 Tài khoản

**Đổi máy có mất đồ không?**
Không, nếu bạn đã liên kết tài khoản (Apple, Google hoặc email). Tài khoản chưa liên kết thì đổi máy sẽ mất.

**Quán có lưu ngày giờ sinh của tôi không?**
Ngày giờ sinh dùng để lập lá số chỉ lưu trên máy của bạn. Quán chỉ hỏi **năm sinh của bạn** để áp quy định cho người dưới 18 tuổi.

**Xóa tài khoản thế nào?**
Cài đặt › Tài khoản › Xóa tài khoản. Thuê bao VIP mua qua App Store / Google Play cần hủy riêng ở nền tảng.

**Quán có bán gì khi tôi vừa xem vận hạn không?**
Không. Sau khi bạn xem Mệnh Bàn, Vận Mệnh Các, Thái Tuế Điện, quẻ, xăm, quán tắt mọi đề cử và khuyến mãi trong 10 phút.

---

## 5. Checklist nghiệm thu phần 20

- [ ] Mỗi giai đoạn E0–E6 có biên bản qua cửa kiểm.
- [ ] Không thanh toán thật nào trước E4 (kiểm cấu hình `eco.sales.off` mặc định bật cho tới E4).
- [ ] Luật §2 được tài liệu 10 tham chiếu khi thiết kế môn phái, sư đồ, nhà.
- [ ] Bảng §3 được các tài liệu liên quan xác nhận (mỗi dòng một chữ ký người giữ tài liệu).
- [ ] Hỏi đáp §4 có trong game và trang hỗ trợ; khớp số với cấu hình hiện hành (kiểm khi đổi hằng số — phần 16).
