# 11 · Phần 11 — Pháp lý, thuế, hóa đơn, giới hạn tuổi

> Phần này liệt kê nghĩa vụ pháp lý khi bật kiếm tiền ở Việt Nam và cách thiết kế kinh tế đáp ứng. **Đây không phải ý kiến pháp lý.** Mỗi dòng có cột «Độ chắc» và mọi điều khoản phải được luật sư Việt Nam đối chiếu văn bản hiện hành trước khi ra mắt; các văn bản về Internet, trò chơi, dữ liệu cá nhân, thương mại điện tử thay đổi nhanh trong 2024–2026, và bộ máy quản lý nhà nước được sắp xếp lại năm 2025.
>
> Ký hiệu «Độ chắc»: **C** = chắc (văn bản và nội dung chính đã rõ); **K** = cần kiểm điều khoản / số hiệu / hiệu lực; **M** = chưa rõ, phải hỏi luật sư.

---

## 1. Bản đồ nghĩa vụ

| Lĩnh vực | Văn bản (theo hiểu biết tới khi viết) | Ảnh hưởng tới kinh tế | Độ chắc |
|---|---|---|---|
| Trò chơi điện tử trên mạng | Nghị định 147/2024/NĐ-CP về quản lý, cung cấp, sử dụng dịch vụ Internet và thông tin trên mạng (thay Nghị định 72/2013 và các văn bản sửa đổi) | giấy phép trò chơi nhiều người chơi kết nối máy chủ (G1), phê duyệt nội dung, phân loại tuổi, xác thực tài khoản, giới hạn giờ chơi người dưới 18, quy định vật phẩm ảo | K |
| Cơ quan quản lý trò chơi | sau sắp xếp bộ máy năm 2025, chức năng quản lý trò chơi điện tử chuyển về bộ quản lý văn hóa — cần xác định đầu mối nhận hồ sơ | nơi nộp hồ sơ G1 | M |
| Bảo vệ người tiêu dùng | Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15 (hiệu lực 01/7/2024) và văn bản hướng dẫn | thông tin giá, điều khoản, giao kết từ xa, người tiêu dùng dễ bị tổn thương (trẻ em) | K |
| Thương mại điện tử | quy định về thương mại điện tử (Nghị định 52/2013 sửa bởi 85/2021; luật thương mại điện tử mới nếu đã có hiệu lực) | thông báo / đăng ký website, ứng dụng bán hàng | M |
| Trung gian thanh toán | quy định về thanh toán không dùng tiền mặt (Nghị định 52/2024/NĐ-CP) | chỉ thu tiền qua tổ chức được cấp phép (VNPay, MoMo, ZaloPay là các tổ chức trung gian thanh toán) | K |
| Thuế | Luật Thuế giá trị gia tăng (sửa đổi 2024), Luật Thuế thu nhập doanh nghiệp, Luật Quản lý thuế 2019 và Thông tư 80/2021/TT-BTC (nhà cung cấp nước ngoài) | VAT bán lẻ trên web; doanh thu qua Apple / Google; ghi nhận doanh thu tiền ảo | K |
| Hóa đơn điện tử | Nghị định 123/2020/NĐ-CP, sửa đổi bởi Nghị định 70/2025/NĐ-CP | xuất hóa đơn cho giao dịch web | K |
| Dữ liệu cá nhân | Nghị định 13/2023/NĐ-CP; Luật Bảo vệ dữ liệu cá nhân 2025 (hiệu lực 01/01/2026) và văn bản hướng dẫn | đồng ý, dữ liệu trẻ em, dữ liệu nhạy cảm, chuyển dữ liệu ra nước ngoài (máy chủ Cloudflare toàn cầu) | K |
| Quảng cáo | Luật Quảng cáo (sửa đổi) | khuyến mãi, lời mô tả gói | K |
| Cờ bạc | quy định về kinh doanh trò chơi có thưởng | game **không** có cơ chế may rủi trả phí (phần 01 nhóm R) → tránh bị coi là trò chơi có thưởng | C (về thiết kế) |
| Phòng chống rửa tiền | Luật Phòng, chống rửa tiền 2022 | game có thể không phải đối tượng báo cáo, nhưng trần số dư và chặn chuyển nhượng (phần 03 §6.3, phần 01 §4.8) giảm rủi ro | M |
| Nền tảng | App Store Review Guidelines, Google Play Developer Program Policies | IAP bắt buộc cho nội dung số trong app; chính sách thuê bao; phân loại tuổi | C |
| Bán ra nước ngoài | GDPR (EU), COPPA (Mỹ, < 13 tuổi), luật thuế số các nước | chỉ khi mở thị trường ngoài VN — **chưa** trong phạm vi ra mắt | — |

---

## 2. Điều kiện kinh doanh trước khi bật thanh toán

| # | Điều kiện | Ai lo | Ghi chú |
|---|---|---|---|
| P1 | Pháp nhân tại Việt Nam có ngành nghề phù hợp (xuất bản phần mềm, phát hành trò chơi) | chủ dự án | ví VN và Google Play payments profile cần pháp nhân / tài khoản ngân hàng |
| P2 | Giấy phép cung cấp trò chơi G1 + quyết định phê duyệt nội dung kịch bản (nếu bản có MMO là G1) | pháp chế | hồ sơ nội dung phải mô tả **hệ kinh tế**: tiền ảo, vật phẩm ảo, cách mua — dùng phần 01, 03 làm phụ lục |
| P3 | Hợp đồng merchant VNPay, MoMo, ZaloPay | chủ dự án | — |
| P4 | Stripe: **Stripe không hỗ trợ tài khoản doanh nghiệp đăng ký tại Việt Nam** (theo danh sách quốc gia Stripe hỗ trợ tới khi viết) → cần pháp nhân ở nước được hỗ trợ, hoặc thay Stripe bằng cổng thẻ quốc tế có ở VN (cổng thẻ của các trung gian VN thường nhận Visa / Mastercard / JCB) | chủ dự án | câu hỏi mở (README) |
| P5 | Apple Developer Program dạng tổ chức (cần số D-U-N-S), ký Paid Apps Agreement, khai thuế, ngân hàng | chủ dự án | ứng dụng hiện tên «Lữ Đăng», `shop.god8.lvdang` |
| P6 | Google Play: hồ sơ thanh toán của nhà phát triển, tài khoản tổ chức | chủ dự án | — |
| P7 | Thông báo / đăng ký website và ứng dụng thương mại điện tử nếu luật yêu cầu | pháp chế | M |
| P8 | Hóa đơn điện tử với nhà cung cấp dịch vụ hóa đơn | kế toán | — |
| P9 | Bộ văn bản công khai (§3) | pháp chế + tài liệu 11 | — |

---

## 3. Bộ văn bản công khai cho người chơi

| Văn bản | Nội dung tối thiểu | Ở đâu trong game |
|---|---|---|
| Điều khoản sử dụng | tài khoản, hành vi cấm, quyền sở hữu nội dung, chấm dứt, giải quyết tranh chấp | màn hình tạo tài khoản, Cài đặt |
| Chính sách quyền riêng tư | dữ liệu thu (§4), mục đích, lưu ở đâu, bao lâu, quyền của chủ thể dữ liệu, liên hệ | như trên |
| **Chính sách Ngọc và vật phẩm ảo** | Ngọc là đơn vị ảo dùng trong game; **không quy đổi ra tiền**, không chuyển nhượng; hai ví và thứ tự tiêu; trần số dư; xử lý khi đóng dịch vụ | Y Các › «Về Ngọc» |
| Chính sách hoàn tiền | phần 10 §8 viết lại bằng lời thường | Y Các, trang hỗ trợ |
| Chính sách thuê bao | giá, kỳ, tự gia hạn, cách hủy, hết hạn thì giữ gì (phần 07 §3.4) | màn hình VIP trước nút mua |
| Chính sách Đạo Lộ | nội dung hai nhánh, thời hạn chương, không bán bậc, món quay lại sau 24 tháng | màn hình Đạo Lộ |
| Hiến chương bán hàng | bốn câu thề (phần 01 §1.1) | Y Các › «Về Tàng Y Các» |
| Lịch sử giao dịch | mọi đơn hàng, số tiền, thời gian, trạng thái, mã đơn (`/api/pay/orders`) | Cài đặt › Giao dịch |

### 3.1 Khi đóng dịch vụ

Cam kết ghi trong Chính sách Ngọc: báo trước **≥ 90 ngày**; ngừng bán Ngọc ngay khi báo; Ngọc Nạp chưa tiêu tại thời điểm báo được **hoàn tiền** theo tỷ lệ gói đã mua (hoặc theo yêu cầu pháp luật nếu cao hơn); bản đơn (không MMO) của game giữ chơi được với tủ đồ đã có nếu kỹ thuật cho phép. Độ chắc yêu cầu pháp lý: M — đây là cam kết tự nguyện tối thiểu.

### 3.2 Hiển thị giá (luật người tiêu dùng)

| Yêu cầu | Cách làm |
|---|---|
| Giá rõ ràng, đã gồm thuế | mọi giá VND trên web là giá cuối; giá trong App Store / Google Play do nền tảng hiển thị |
| Thông tin trước khi giao kết | trước nút thanh toán: tên sản phẩm, nội dung nhận được, giá, kỳ (với thuê bao), điều kiện hoàn tiền, liên kết chính sách |
| Không gây nhầm lẫn | phần 01 nhóm X (đồng hồ giả, giá gạch giả…) |
| Người tiêu dùng dễ bị tổn thương | trẻ em: §5 |

### 3.3 Ghi nhận doanh thu (cho kế toán)

| Sản phẩm | Ghi nhận |
|---|---|
| Gói Ngọc | khi nhận tiền: doanh thu chưa thực hiện (nợ phải trả theo số Ngọc Nạp); ghi doanh thu khi Ngọc Nạp được **tiêu**; phần không bao giờ tiêu (breakage) ghi theo ước tính được kiểm toán chấp nhận |
| VIP | phân bổ đều theo kỳ thuê bao |
| Kim Thư | phân bổ theo thời gian chương (hoặc theo mức nhận thưởng — kế toán chọn) |
| Gói có món | tách phần Ngọc (như gói Ngọc) và phần món (ghi khi cấp) theo giá trị tương đối |
| Hoàn tiền | ghi giảm doanh thu kỳ hoàn |

Sổ cái ví (phần 10 §4.3) cung cấp số liệu Ngọc Nạp tiêu theo ngày cho bút toán này.

---

## 4. Dữ liệu cá nhân trong kinh tế

### 4.1 Dữ liệu kinh tế thu thập

| Dữ liệu | Mục đích | Cơ sở xử lý (đề xuất) | Lưu |
|---|---|---|---|
| `accountId`, phương thức đăng nhập | cung cấp dịch vụ, giữ quyền lợi | thực hiện hợp đồng | tới khi xóa tài khoản + thời hạn lưu chứng từ |
| Email | đăng nhập, hóa đơn, liên hệ hoàn tiền | thực hiện hợp đồng | như trên |
| Năm sinh khai báo | giới hạn tuổi | nghĩa vụ pháp lý | như trên |
| Số điện thoại (nếu xác thực tài khoản theo yêu cầu pháp luật) | xác thực | nghĩa vụ pháp lý | như trên, mã hóa |
| Đơn hàng, giao dịch | kế toán, hoàn tiền, chống gian lận | nghĩa vụ pháp lý (chứng từ) | theo luật kế toán (thường ≥ 10 năm cho chứng từ kế toán — K) |
| Sự kiện analytics (phần 12) | cải thiện game | đồng ý (bật / tắt được) | 25 tháng, sau đó tổng hợp ẩn danh |
| Ngày giờ sinh lá số, kết quả luận giải | **không** thu ở máy chủ kinh tế | — | — |

### 4.2 Dữ liệu nhạy cảm

- Luật Việt Nam xếp **quan điểm tôn giáo** vào dữ liệu cá nhân nhạy cảm. Việc người chơi chọn đạo thống **trong game** là lựa chọn hư cấu, nhưng analytics **không** được gộp thành hồ sơ «người này theo Phật / Đạo», không dùng đạo thống để nhắm quảng cáo, không bán / chia sẻ.
- Sự kiện analytics ghi đạo thống chỉ ở mức **tổng hợp** (bao nhiêu người vào môn phái X), không gắn với danh tính trong kho dữ liệu dài hạn.
- Dữ liệu sức khỏe: bộ lọc khủng hoảng (phần 01 §9.2) **không** ghi nội dung câu hỏi; chỉ ghi cờ «đã bật chế độ hỗ trợ» và tự xóa sau 72 giờ.

### 4.3 Trẻ em

Xử lý dữ liệu của trẻ em cần sự đồng ý của cha mẹ / người giám hộ theo luật dữ liệu cá nhân (ngưỡng tuổi và thủ tục: K). Thiết kế: tài khoản dưới 16 tuổi do cha mẹ xác nhận (§5.3), analytics của tài khoản dưới 16 chỉ thu sự kiện kỹ thuật (lỗi, hiệu năng), **không** thu sự kiện kinh tế hành vi để tối ưu bán hàng.

---

## 5. Giới hạn tuổi

### 5.1 Hai «năm sinh» khác nhau

Game có **ngày giờ sinh của lá số** (có thể là của người khác — người chơi lập lá số cho khách, cho người thân) và **năm sinh của chủ tài khoản**. Kinh tế chỉ dùng năm sinh chủ tài khoản, hỏi riêng, giải thích lý do: «Quán hỏi năm sinh của **bạn** để áp quy định cho người dưới 18 tuổi. Đây không phải ngày sinh dùng để lập lá số.»

### 5.2 Nhóm tuổi và quyền mua

| Nhóm | Tạo tài khoản | Mua gói Ngọc | VIP tự gia hạn | Thẻ VIP 30 ngày | Kim Thư | `SKU-P-05` | Mua tặng | Trần nạp 30 ngày |
|---|---|---|---|---|---|---|---|---|
| Chưa khai | chơi được ngoại tuyến | không | không | không | không | không | không | 0 |
| < 16 | cha mẹ xác nhận | có, **mỗi giao dịch cha mẹ duyệt** | không | có (cha mẹ duyệt) | có (cha mẹ duyệt) | không | không | **200.000đ** |
| 16–17 | tự tạo | có | không | có | có | không | không | **500.000đ** |
| ≥ 18 | tự tạo | có | có | có | có | có | có | theo phần 01 §9.3 |

Trên App Store / Google Play: nền tảng có cơ chế riêng (Ask to Buy của Apple Family Sharing; kiểm soát của phụ huynh trên Google Play). Game **cộng thêm** trần của quán bằng kiểm `/api/pay/quote` trước khi mở bảng thanh toán nền tảng.

### 5.3 Cha mẹ xác nhận (dưới 16)

| Bước | Mô tả |
|---|---|
| 1 | Trẻ nhập email cha mẹ khi tạo tài khoản |
| 2 | Cha mẹ nhận email có liên kết tới **Bảng Phụ Huynh** (web) |
| 3 | Bảng Phụ Huynh: đồng ý / từ chối tài khoản; đặt trần nạp (≤ 200.000đ / 30 ngày, có thể đặt 0); bật duyệt từng giao dịch (mặc định bật); xem lịch sử giao dịch và thời gian chơi; yêu cầu hoàn tiền |
| 4 | Mỗi yêu cầu mua của trẻ → email / thông báo cho cha mẹ → duyệt trong 24 giờ, quá hạn tự hủy |
| 5 | Xác thực cha mẹ: email + (nếu pháp luật yêu cầu) xác thực số điện thoại |

### 5.4 Giới hạn giờ chơi

Theo quy định về trò chơi điện tử cho người dưới 18 tuổi (giới hạn thời lượng mỗi trò chơi và tổng thời lượng mỗi ngày — số phút cụ thể: K, đối chiếu Nghị định 147/2024):

- Game đếm thời gian **trực tuyến** (MMO và mọi chức năng cần máy chủ) cho tài khoản < 18.
- Hết giờ: kết thúc phiên trực tuyến nhẹ nhàng (Thầy nói lời chào, không cắt ngang giữa án); chơi ngoại tuyến các phần không cần máy chủ có tính không — **K**, theo cách cơ quan quản lý hiểu «thời gian chơi».
- Kinh tế **không** thưởng thêm cho người chơi lâu; Đạo Lộ thiết kế để 4 ngày × 15–20 phút / tuần vẫn đạt bậc 30 (phần 07 §5.6) — vừa giới hạn giờ.

### 5.5 Hoàn tiền giao dịch của trẻ

| Ca | Xử lý |
|---|---|
| Giao dịch của tài khoản < 18 mà cha mẹ không duyệt (do lỗi hệ thống) | hoàn đủ |
| Trẻ dùng tài khoản / thẻ của cha mẹ (tài khoản khai ≥ 18) | cha mẹ gửi yêu cầu kèm chứng cứ; xét từng ca; nếu chấp nhận, hoàn và chuyển tài khoản sang nhóm tuổi đúng |
| Qua Apple / Google | hướng dẫn cha mẹ yêu cầu hoàn tiền trên nền tảng; quán trả lời yêu cầu tiêu dùng trung thực (phần 10 §6.2) |

### 5.6 Khai sai tuổi

- Không thể kiểm hoàn toàn. Biện pháp: hỏi năm sinh trước lần mua đầu tiên; đổi năm sinh làm **tăng** tuổi phải chờ 30 ngày và (nếu từ < 18 lên ≥ 18) xác thực thêm.
- Dấu hiệu là trẻ (giờ chơi theo lịch học, ngôn ngữ trong hỗ trợ) **không** dùng để tự động hạ nhóm (tránh phân biệt sai), nhưng nhân viên hỗ trợ được quyền đề nghị xác minh.

---

## 6. Thuế và hóa đơn — vận hành

### 6.1 Theo kênh

| Kênh | Ai thu thuế gián thu từ người mua | Doanh nghiệp làm gì |
|---|---|---|
| Web — ví VN | doanh nghiệp | kê khai VAT đầu ra; xuất hóa đơn điện tử (từng giao dịch, hoặc theo hình thức bán lẻ được phép — K); nộp CIT trên lợi nhuận |
| Web — thẻ quốc tế | doanh nghiệp (khách VN); khách nước ngoài: theo luật nước khách nếu vượt ngưỡng | — |
| App Store | Apple đóng vai nhà cung cấp nước ngoài kê khai VAT cho giao dịch tại VN (theo cơ chế nhà cung cấp nước ngoài — K) | doanh nghiệp nhận tiền ròng; ghi doanh thu theo báo cáo Apple; CIT |
| Google Play | tương tự | tương tự |

### 6.2 Hóa đơn cho người mua web

- Mặc định: hóa đơn điện tử gửi email sau mỗi giao dịch thành công.
- Người mua là doanh nghiệp (ví dụ mua gói ủng hộ) có thể nhập mã số thuế trước khi thanh toán.
- Nội dung hóa đơn ghi tên sản phẩm theo SKU (ví dụ «Gói 330 Ngọc — Huyền Quán»), không ghi dữ liệu lá số.

---

## 7. Phân loại tuổi của game

| Nội dung | Ảnh hưởng | Đề xuất |
|---|---|---|
| Không bạo lực (T3) | — | — |
| Tín ngưỡng, âm phủ, Tà Lộ, yểm thuật (opt-in theo `amta-data › ETHICS`) | có thể nâng nhóm tuổi | đề xuất **12+** với Tà Lộ và Phong Đô bản đầy đủ chỉ mở cho tài khoản ≥ 16 (pháp chế xác nhận theo tiêu chí phân loại của Nghị định 147) |
| Mua hàng trong game | ghi rõ «có mua vật phẩm» | — |
| MMO, trò chuyện | bộ lọc trò chuyện, chặn / báo cáo | tài liệu 10 |

---

## 8. Bản thảo văn bản công khai

Bản thảo lời thường cho bốn văn bản kinh tế của §3. Luật sư rà và bổ sung phần pháp lý bắt buộc (bên cung cấp, địa chỉ, mã số doanh nghiệp, luật áp dụng, giải quyết tranh chấp). Số liệu trong ngoặc nhọn lấy từ cấu hình hiện hành (phần 16), không gõ tay.

### 8.1 Chính sách Ngọc và vật phẩm ảo

```
CHÍNH SÁCH NGỌC VÀ VẬT PHẨM ẢO — Huyền Quán
Hiệu lực từ: {ngày}. Phiên bản: {số}.

1. Ngọc là gì
   Ngọc là đơn vị ảo chỉ dùng trong Huyền Quán để thỉnh trang phục, nội thất,
   vé Đạo Lộ và tiện ích. Ngọc không phải tiền, không có giá trị ngoài trò chơi.

2. Cách có Ngọc
   - Nhận miễn phí: điểm danh, lên cấp, quà lễ, Đạo Lộ, quyền lợi Thượng Khách,
     bồi thường sự cố («Ngọc Tặng»).
   - Mua bằng tiền qua kênh thanh toán được công bố («Ngọc Nạp»).
   Bạn thấy một số Ngọc tổng; lịch sử ở Cài đặt › Giao dịch cho biết từng phần.

3. Cách tiêu
   Khi bạn thỉnh một món, Ngọc Tặng được dùng trước, Ngọc Nạp dùng sau.

4. Không quy đổi, không chuyển nhượng
   - Ngọc, Phúc Khí và vật phẩm không đổi ra tiền, thẻ cào, hiện vật hay
     tài sản nào ngoài trò chơi.
   - Không chuyển Ngọc hay vật phẩm đã có sang tài khoản khác. Bạn có thể thỉnh
     món mới để tặng bạn bè trong giới hạn {5} món mỗi tuần.

5. Không hết hạn
   Ngọc và vật phẩm không hết hạn khi tài khoản còn hoạt động.

6. Giới hạn
   - Số dư Ngọc Nạp tối đa: {20.000}.
   - Trần nạp theo độ tuổi và trần tự đặt: xem Chính sách chi tiêu.

7. Những gì Ngọc không mua được
   Ngọc không mua được Đạo Hạnh, cảnh giới, công đức, thứ hạng, hay bất kỳ
   thay đổi nào về nội dung luận giải lá số. Mọi món là trang phục, nội thất
   hoặc tiện ích.

8. Khi tài khoản bị hạn chế
   Vật phẩm mua hợp lệ không bị thu hồi trừ khi giao dịch mua là gian lận
   (thẻ đánh cắp, giả mạo thanh toán).

9. Khi quán ngừng dịch vụ
   Quán báo trước ít nhất {90} ngày, ngừng bán Ngọc ngay khi báo, và hoàn tiền
   phần Ngọc Nạp chưa tiêu tại thời điểm báo theo giá gói đã mua.
```

### 8.2 Chính sách hoàn tiền

```
CHÍNH SÁCH HOÀN TIỀN — Huyền Quán

A. Mua trên web (VNPay, MoMo, ZaloPay, thẻ)
   Quán hoàn đủ khi:
   1. Bạn đã trả tiền nhưng không nhận được hàng sau 24 giờ do lỗi của quán.
   2. Bạn bị trừ tiền hai lần cho cùng một đơn trong 2 phút.
   3. Gói Ngọc chưa tiêu đồng nào, yêu cầu trong {7} ngày.
   4. Thượng Khách lần đầu, yêu cầu trong {48} giờ, chưa nhận Ngọc Thượng Khách.
   5. Vé Đạo Lộ chưa nhận phần thưởng Kim Thư nào, yêu cầu trong {7} ngày.
   6. Người dưới 18 tuổi mua mà không có sự đồng ý theo quy định.
   Tiền về theo phương thức đã thanh toán, thường {3–10} ngày làm việc tùy
   ngân hàng / ví.

B. Mua trên App Store / Google Play
   Yêu cầu hoàn tiền gửi cho Apple / Google theo chính sách của nền tảng.
   Quán trả lời nền tảng thông tin sử dụng một cách trung thực.

C. Khi giao dịch được hoàn
   - Ngọc của giao dịch được thu lại; nếu đã tiêu, số dư Ngọc Nạp có thể âm
     và bạn tạm không thỉnh được bằng Ngọc cho tới khi bù.
   - Món đã thỉnh không bị lấy lại.
   - Quyền Thượng Khách / Kim Thư của giao dịch dừng.

D. Đổi ý trong 10 phút
   Trong trò chơi, bạn trả lại một món vừa thỉnh trong {10} phút để nhận lại Ngọc
   hoặc Phúc Khí (tối đa {3} lần mỗi ngày). Việc này không cần liên hệ quán.
```

### 8.3 Điều khoản thuê bao Thượng Khách

```
THƯỢNG KHÁCH — ĐIỀU KHOẢN THUÊ BAO

- Giá: {99.000đ}/tháng · {269.000đ}/quý · {899.000đ}/năm (web, đã gồm thuế);
  trên App Store / Google Play theo giá nền tảng hiển thị.
- Tự gia hạn vào cuối mỗi kỳ cho tới khi bạn hủy. Quán gửi nhắc trước
  {3} ngày khi gia hạn năm.
- Hủy: web — Y Các › Thượng Khách › Quản lý; iPhone — Cài đặt Apple ID ›
  Đăng ký; Android — Google Play › Thanh toán và gói thuê bao.
  Hủy có hiệu lực cuối kỳ đang dùng; không hoàn tiền phần kỳ còn lại, trừ
  trường hợp ở Chính sách hoàn tiền mục A.4.
- Quyền lợi: {30} Ngọc mỗi ngày bạn ghé quán; bay thấp; hiệu ứng ngũ hành
  mở sớm; được thỉnh món dành riêng; thêm ô phối đồ; thêm lượt hỏi Thầy
  (web, Android); hỗ trợ trong 24 giờ.
- Không bao gồm: Đạo Hạnh, cảnh giới, công đức, thứ hạng, nội dung luận giải.
- Hết hạn: bạn giữ mọi món đã thỉnh và Ngọc đã nhận.
- Đổi quyền lợi: quyền lợi bị giảm chỉ áp dụng từ kỳ sau, báo trước {14} ngày.
- Người dưới 18 tuổi: không mua thuê bao tự gia hạn; có Thẻ 30 ngày.
```

### 8.4 Chính sách chi tiêu và độ tuổi

```
CHI TIÊU AN TOÀN

- Trần tự đặt: Cài đặt › Chi tiêu. Hạ trần có hiệu lực ngay; nâng trần sau {7} ngày.
- Khi tổng nạp 30 ngày vượt {2.000.000đ}: quán hiện tổng kết chi tiêu một lần.
- Khi vượt {5.000.000đ}: mỗi giao dịch từ {400.000đ} cần xác nhận lại.
- Trần mặc định {10.000.000đ} / 30 ngày; muốn nâng, gửi yêu cầu, chờ {72} giờ.
- Dưới 16 tuổi: cha mẹ xác nhận tài khoản; trần tối đa {200.000đ} / 30 ngày;
  mỗi giao dịch cha mẹ duyệt.
- 16–17 tuổi: trần {500.000đ} / 30 ngày; không thuê bao tự gia hạn;
  không gói lớn nhất; không mua tặng.
- Không có bảng xếp hạng nạp. Không có cấp VIP theo tổng nạp.
```

---

## 9. Checklist pháp lý trước khi bật thanh toán

- [ ] Ý kiến bằng văn bản của luật sư VN cho mọi dòng «K», «M» ở §1.
- [ ] P1–P9 hoàn thành.
- [ ] Bộ văn bản §3 công khai, có phiên bản và ngày hiệu lực.
- [ ] Năm sinh chủ tài khoản tách biệt với ngày sinh lá số (§5.1).
- [ ] Bảng Phụ Huynh hoạt động; trần < 16 và 16–17 áp ở máy chủ.
- [ ] Đếm giờ chơi trực tuyến cho < 18.
- [ ] Hóa đơn điện tử tự động cho web.
- [ ] Analytics không lập hồ sơ tôn giáo; tài khoản < 16 không có sự kiện kinh tế hành vi.
- [ ] Cam kết đóng dịch vụ (§3.1) có trong Chính sách Ngọc.
