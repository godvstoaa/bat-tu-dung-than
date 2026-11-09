# 14.11 · Pháp lý và chính sách nền tảng — Việt Nam, Apple, Google, PC, quốc tế; cờ bạc và hộp ngẫu nhiên; thanh toán

> Mã nghĩa vụ: `RISK-LG-xx`. Chủ: `PC`; đồng chủ: `TPH` (nền tảng), `TKT` (thanh toán), `TMC` (kỹ thuật tuân thủ).
>
> **Cảnh báo quan trọng.** Tài liệu này do đội sản xuất soạn để định hướng thiết kế, **không phải ý kiến pháp lý**. Mọi trích dẫn văn bản ghi **(cần luật sư xác minh)** là chưa được người có chuyên môn kiểm tra số hiệu, điều khoản, hiệu lực hoặc nội dung. Quyết định phát hành phải dựa trên ý kiến của luật sư được cấp phép tại Việt Nam (và tại thị trường liên quan).
>
> Ký hiệu độ chắc chắn: **[C]** — thông tin phổ biến, đội tin là đúng nhưng vẫn nên xác minh; **[X]** — cần luật sư xác minh trước khi dùng.

---

## 1. Bảng tổng quan nghĩa vụ

| Mã | Lĩnh vực | Văn bản (đội hiểu) | Nghĩa vụ chính với game | Áp dụng khi | Độ chắc | Chủ |
|---|---|---|---|---|---|---|
| RISK-LG-01 | Trò chơi điện tử | Nghị định 147/2024/NĐ-CP về quản lý, cung cấp, sử dụng dịch vụ Internet và thông tin trên mạng (thay Nghị định 72/2013/NĐ-CP và các văn bản sửa đổi) | Phân loại G1–G4; giấy phép G1; phê duyệt nội dung kịch bản G1; phân loại độ tuổi; quản lý thời gian chơi; xác thực tài khoản; quy định vật phẩm ảo | Cung cấp game có máy chủ cho người chơi ở Việt Nam | [X] | PC |
| RISK-LG-02 | An ninh mạng | Luật An ninh mạng 2018 (Luật số 24/2018/QH14), Nghị định 53/2022/NĐ-CP; thông tin về luật an ninh mạng mới năm 2025 | Không đăng, gỡ thông tin vi phạm; phối hợp cơ quan chức năng; lưu trữ dữ liệu tại Việt Nam trong điều kiện luật định | Có người dùng ở Việt Nam, có nội dung người dùng tạo | [X] | PC |
| RISK-LG-03 | Dữ liệu cá nhân | Nghị định 13/2023/NĐ-CP; Luật Bảo vệ dữ liệu cá nhân 2025 (Luật số 91/2025/QH15, hiệu lực 01/01/2026) và văn bản hướng dẫn | Thông báo, đồng ý, quyền chủ thể, đánh giá tác động, chuyển dữ liệu ra nước ngoài, thông báo vi phạm, dữ liệu trẻ em, dữ liệu nhạy cảm | Xử lý bất kỳ dữ liệu cá nhân nào (kể cả `pid`, IP) | [X] | PC |
| RISK-LG-04 | Tín ngưỡng, tôn giáo | Luật Tín ngưỡng, tôn giáo 2016 (Luật số 02/2016/QH14) | Không xúc phạm niềm tin; không lợi dụng để trục lợi | Toàn bộ nội dung | [X] | PC + TND |
| RISK-LG-05 | Hình sự | Bộ luật Hình sự 2015 (sửa đổi 2017), tội hành nghề mê tín, dị đoan (Điều 320) | Không bán, không quảng bá dịch vụ «giải hạn, trừ tà» | Kiếm tiền, quảng cáo | [X] | PC |
| RISK-LG-06 | Xử phạt hành chính văn hóa | Nghị định về xử phạt vi phạm hành chính trong lĩnh vực văn hóa, quảng cáo (thường được dẫn là Nghị định 38/2021/NĐ-CP) và lĩnh vực an ninh trật tự | Các hành vi liên quan mê tín dị đoan, quảng cáo | Nội dung, quảng cáo | [X] | PC |
| RISK-LG-07 | Di sản | Luật Di sản văn hóa 2024 (Luật số 45/2024/QH15) | Bản sao di vật, cổ vật, bảo vật quốc gia; sử dụng hình ảnh di tích | Mô phỏng, quảng bá | [X] | PC + AD |
| RISK-LG-08 | Người tiêu dùng | Luật Bảo vệ quyền lợi người tiêu dùng 2023 (Luật số 19/2023/QH15), văn bản hướng dẫn | Minh bạch, điều kiện giao dịch chung, người tiêu dùng dễ bị tổn thương | Bán Ngọc, VIP | [X] | PC + TKT |
| RISK-LG-09 | Quảng cáo | Luật Quảng cáo 2012 và các lần sửa đổi | Nội dung quảng cáo; quảng cáo game cần điều kiện | Mọi chiến dịch | [X] | TT + PC |
| RISK-LG-10 | Thương mại điện tử | Các nghị định về thương mại điện tử | Thông báo / đăng ký nếu bán hàng qua website | Bán Ngọc trên web | [X] | PC |
| RISK-LG-11 | Thanh toán | Nghị định về thanh toán không dùng tiền mặt (thường được dẫn là Nghị định 52/2024/NĐ-CP) | Chỉ thu qua tổ chức được cấp phép | Bán trên web | [X] | TKT |
| RISK-LG-12 | Trẻ em | Luật Trẻ em 2016 (Luật số 102/2016/QH13) | Bảo vệ thông tin bí mật đời sống riêng tư của trẻ; nội dung phù hợp | Người chơi < 16 | [X] | TAT + PC |
| RISK-LG-13 | Sở hữu trí tuệ | Luật Sở hữu trí tuệ (sửa đổi gần nhất 2022) | Quyền tác giả bản dịch, âm nhạc, mô hình, phông chữ | Mọi tài sản | [C] | PC + AD |
| RISK-LG-14 | Thuế | Luật Quản lý thuế và văn bản về thương mại điện tử, nền tảng số | Kê khai doanh thu | Có doanh thu | [X] | GĐSX |
| RISK-LG-15 | Apple | App Store Review Guidelines (4.3(b), 2.3.1, 1.1.1, 1.2, 1.4.1, 3.1.1, 3.1.2, 4.8, 5.1.1, 5.1.2, 5.3) | Xem §8 | Bản iOS | [C] (số mục) | TPH |
| RISK-LG-16 | Google Play | Chính sách nhà phát triển (Payments, UGC, AI-generated content, Data safety, Account deletion, Gambling, Families) | Xem §9 | Bản Android | [C] (tên chính sách) | TPH |
| RISK-LG-17 | EU / Vương quốc Anh | GDPR / UK GDPR; Đạo luật AI của EU (nghĩa vụ minh bạch) | Cơ sở pháp lý, quyền, dữ liệu đặc biệt (tôn giáo, sức khỏe), minh bạch chatbot | Nhắm hoặc phục vụ người dùng EU / Anh | [C] khung, [X] chi tiết | PC |
| RISK-LG-18 | Hoa Kỳ | COPPA; luật quyền riêng tư cấp bang (vd California) | Trẻ < 13; quyền người dùng | Nhắm người dùng Mỹ | [C] khung, [X] chi tiết | PC |
| RISK-LG-19 | Hộp ngẫu nhiên | Quy định khác nhau theo nước (Bỉ, Hàn Quốc, Trung Quốc…) + quy định cửa hàng | Không có gacha → giữ như vậy | Mọi thị trường | [C] khung | TKT |

---

## 2. An ninh mạng

| Mã | Việc phải làm | Bằng chứng |
|---|---|---|
| RISK-LG-20 | Nội quy cộng đồng cấm nội dung trái pháp luật (xúc phạm tôn giáo, dân tộc, danh nhân; kích động; lừa đảo) — dẫn trong Điều khoản sử dụng | Văn bản Điều khoản |
| RISK-LG-21 | Khả năng gỡ nội dung người dùng tạo (tên, Bảng Vàng) trong thời hạn luật định khi có yêu cầu hợp lệ *(cần luật sư xác minh thời hạn, thường được nhắc là 24 giờ)* | Công cụ admin «ẩn tên / đổi tên» + nhật ký thao tác |
| RISK-LG-22 | Kênh tiếp nhận yêu cầu từ cơ quan chức năng: email riêng, người phụ trách, quy trình xác minh yêu cầu | Quy trình nội bộ |
| RISK-LG-23 | Đánh giá điều kiện lưu trữ dữ liệu tại Việt Nam và đặt văn phòng đại diện theo Nghị định 53/2022/NĐ-CP *(cần luật sư xác minh điều kiện kích hoạt; nhiều điều kiện chỉ áp khi doanh nghiệp nước ngoài vi phạm và nhận yêu cầu)* | Ý kiến luật sư |
| RISK-LG-24 | Theo dõi luật an ninh mạng mới (2025) và văn bản hướng dẫn khi có hiệu lực | Mục §12 |

**Tối thiểu hóa để giảm phạm vi nghĩa vụ:** không có chat tự do; không có nội dung người dùng tạo ngoài tên (đã lọc) và tên trên Bảng Vàng; không lưu nội dung hội thoại AI (tập 14.10 §6).

---

## 3. Trò chơi điện tử trên mạng

### 3.1 Game thuộc loại nào

Phân loại G1–G4 dưới đây theo cách đội hiểu quy định hiện hành *(cần luật sư xác minh định nghĩa chính xác trong Nghị định 147/2024/NĐ-CP)*:

| Loại | Định nghĩa (tóm tắt) | Cấu hình của Huyền Giới rơi vào |
|---|---|---|
| G1 | Nhiều người chơi tương tác với nhau đồng thời qua máy chủ của doanh nghiệp | **MMO** (`worker/quan-room.js`: thấy nhau, emote, cụm từ, mời giải án hợp tác), Thiên Bảng máy chủ, môn phái |
| G2 | Nhiều người chơi, chỉ tương tác người – máy chủ | Có thể: bảng xếp hạng nếu không có tương tác người – người *(cần xác minh)* |
| G3 | Nhiều người chơi tương tác với nhau nhưng không qua máy chủ doanh nghiệp | — |
| G4 | Tải về, chơi một người, không tương tác với người khác | Bản **chơi đơn offline** (`net.js` offline-first) *(cần luật sư xác minh: bản web chạy trên trình duyệt có thuộc G4 không, và bản có kết nối AI qua máy chủ có làm đổi loại không)* |

**Hệ quả:** khi bật MMO cho người chơi ở Việt Nam, game là **G1** — cần giấy phép và quyết định phê duyệt nội dung kịch bản trước khi phát hành (RISK-073).

### 3.2 Ba phương án

| Phương án | Mô tả | Ưu | Nhược | Khuyến nghị |
|---|---|---|---|---|
| **A · Tắt MMO ở Việt Nam** | Bản phát hành cho người chơi Việt Nam chỉ chơi đơn (+ AI nếu được phép); MMO chỉ thử nghiệm kín có mời | Không cần giấy phép G1 *(cần xác minh)* | Mất trải nghiệm xã hội; thị trường chính là Việt Nam | **Mặc định từ nay tới khi có quyết định khác** |
| **B · Phát hành qua đối tác có giấy phép G1** | Hợp tác doanh nghiệp phát hành game tại Việt Nam | Đối tác lo hồ sơ, hạ tầng tuân thủ | Chia doanh thu; mất kiểm soát một phần; đối tác có thể muốn gacha (mâu thuẫn §7.3) | Cân nhắc từ M3; điều kiện: hợp đồng ghi rõ bất biến kinh tế (tập 14.03 §4) |
| **C · Tự xin giấy phép** | Lập doanh nghiệp đủ điều kiện, xin giấy phép G1, nộp kịch bản | Kiểm soát hoàn toàn | Chi phí, thời gian, điều kiện về pháp nhân, hạ tầng, nhân sự *(cần luật sư xác minh)* | Đánh giá ở M4 |

### 3.3 Hồ sơ phê duyệt nội dung kịch bản (khi chọn B hoặc C)

Cấu trúc tài liệu đề xuất (tận dụng GDD):

1. **Giới thiệu:** game giáo dục văn hóa cổ học và đạo đức; trụ cột T1–T6; thông điệp «mệnh do ta tạo»; phản diện là lừa đảo tâm linh.
2. **Cốt truyện tóm tắt** (tập 03) — nhấn mạnh tuyến chống Định Mệnh Hội, tuyến cứu người.
3. **Hệ thống nhân vật, hoạt động** (tập 04, 09) — không có chiến đấu, không có giết chóc.
4. **Nội dung tín ngưỡng:** danh sách vùng, cách trình bày, biên bản HĐCV (tập 14.05–14.07).
5. **Biện pháp an toàn:** âm tà tự nguyện bật, chuyển hướng sức khỏe tâm thần, không chẩn bệnh, không bán cải mệnh.
6. **Kinh tế:** chỉ bán trang trí, tiện ích; không gacha; không quy đổi ngược.
7. **Phân loại độ tuổi** (§3.4).
8. **Quản lý giờ chơi, xác thực** (§3.5, §3.6).
9. **Ảnh chụp màn hình** từng vùng.

**Nội dung có thể cần cắt cho bản Việt Nam** (quyết định sau khi có ý kiến luật sư): xin xăm, Thái Tuế Điện, Vận Mệnh Các (xem vận bản thân), nội dung âm tà Lớp 1, Phong Đô — thực hiện bằng cờ bản build theo vùng (cùng cơ chế `features.js`).

### 3.4 Tự đánh giá độ tuổi

Thang Việt Nam theo quy định hiện hành *(cần luật sư xác minh các mức và tiêu chí; đội hiểu có các mức 18+, 16+, 12+, 00+)*. Tự đánh giá theo nội dung:

| Tiêu chí | Nội dung trong game | Mức gợi ý |
|---|---|---|
| Bạo lực | Không có chiến đấu; Phong Đô có bích họa địa ngục mờ (RISK-021) | 12+ |
| Kinh dị, sợ hãi | Phong Đô, Tà Lộ (người quen ốm), âm tà (opt-in) | 16+ nếu bật Tà Lộ / âm tà; 12+ nếu tắt |
| Tình dục | Không | 00+ |
| Ngôn ngữ | Không có chat tự do | 00+ |
| Tôn giáo, tín ngưỡng | Nhiều; trình bày nghiêm túc | 12+ (cần xác minh có tiêu chí riêng) |
| Bói toán, tâm linh | Lá số, xin xăm, Thái Tuế | 12+ – 16+ *(cần xác minh)* |
| Cờ bạc | Không | 00+ |
| Tương tác trực tuyến | MMO cụm từ soạn sẵn | 12+ |
| Mua bán trong game | Ngọc, VIP | Ghi chú «có mua trong game» |

**Khuyến nghị:** bản đầy đủ **16+**; bản rút gọn (tắt Tà Lộ, âm tà, Phong Đô) **12+**. Cổng tuổi trong game (RISK-040) khớp với mức này.

Thang cửa hàng: Apple (bảng câu hỏi xếp hạng, các mức hiện hành *(cần xác minh sau lần cập nhật hệ thống xếp hạng của Apple)*), Google (IARC). Khai nhất quán với tự đánh giá Việt Nam.

### 3.5 Giờ chơi và người dưới 18 tuổi

| Mã | Việc | Ghi chú |
|---|---|---|
| RISK-LG-30 | Xác định giới hạn thời gian chơi cho người dưới 18 theo văn bản hiện hành *(cần luật sư xác minh: đội từng thấy nhắc giới hạn theo từng trò chơi mỗi ngày và tổng thời gian mỗi ngày)* | Tham số cấu hình máy chủ |
| RISK-LG-31 | Bộ đếm giờ phía máy chủ theo tài khoản (không tin máy khách) | Cần tài khoản (tập 14.12 §5) |
| RISK-LG-32 | Thông báo trong game trước khi hết giờ; khi hết: MMO ngắt, chơi đơn vẫn được hay không *(cần xác minh — có thể giới hạn áp dụng cho dịch vụ G1, không cho chơi đơn)* | |
| RISK-LG-33 | Hiển thị khuyến cáo sức khỏe, thời gian chơi theo quy định (nếu có) | Màn đầu |

### 3.6 Xác thực tài khoản

| Mã | Việc |
|---|---|
| RISK-LG-34 | Xác định yêu cầu xác thực tài khoản người chơi G1 (bằng số điện thoại di động Việt Nam hoặc số định danh cá nhân — *cần luật sư xác minh*) |
| RISK-LG-35 | Thiết kế: dữ liệu xác thực tách khỏi dữ liệu chơi; chỉ lưu kết quả «đã xác thực», năm sinh tuân thủ; không lưu ảnh giấy tờ trừ khi bắt buộc |
| RISK-LG-36 | Không dùng dữ liệu xác thực cho mục đích khác (quảng cáo, phân tích) |

### 3.7 Vật phẩm ảo, tiền ảo

| Mã | Quy tắc thiết kế (đáp ứng quy định đội hiểu — *cần luật sư xác minh*) |
|---|---|
| RISK-LG-37 | Ngọc, Phúc Khí chỉ dùng trong game; **không** đổi ngược ra tiền, tài sản; **không** chuyển giữa người chơi |
| RISK-LG-38 | Không có sàn giao dịch, không có «tặng quà» bằng Ngọc giữa người chơi |
| RISK-LG-39 | Giá vật phẩm hiển thị bằng Ngọc kèm quy đổi VNĐ tham chiếu ở màn nạp |
| RISK-LG-40 | Lưu nhật ký giao dịch (RISK-141) |

---

## 4. Dữ liệu cá nhân (Việt Nam)

### 4.1 Phân loại dữ liệu của game

*(Theo cách phân loại «cơ bản / nhạy cảm» của Nghị định 13/2023/NĐ-CP mà đội hiểu; Luật 2025 có thể điều chỉnh — cần luật sư xác minh.)*

| Dữ liệu | Loại | Ở đâu | Ghi chú |
|---|---|---|---|
| Ngày giờ sinh, giới tính | Cơ bản | Trên máy | Rời máy qua brief AI (RISK-105) |
| Họ tên hiển thị | Cơ bản | Máy + MMO | |
| `pid`, `u`, IP | Cơ bản (định danh) | Máy, máy chủ | |
| Lá số người thân | Cơ bản (của người khác) | Trên máy | RISK-106 |
| Câu hỏi AI về bệnh, tâm lý | **Nhạy cảm** (sức khỏe) | Gửi nhà cung cấp | RISK-059 |
| Lựa chọn đạo thống, môn phái (nếu lưu máy chủ) | Có thể bị coi là **nhạy cảm** (quan điểm tôn giáo) | Máy chủ (D1, tương lai) | RISK-077, RISK-112 |
| Tín hiệu khủng hoảng | **Nhạy cảm** (sức khỏe) | Không lưu nội dung; chỉ đếm | tập 14.09 §0 |
| Dữ liệu xác thực tuổi, số điện thoại | Cơ bản / định danh | Máy chủ (tương lai) | §3.6 |
| Thanh toán | Tài chính (có thể nhạy cảm) | Cửa hàng / cổng thanh toán | Game không lưu số thẻ |
| Năm sinh trẻ em | Dữ liệu trẻ em | Trên máy | RISK-080 |

### 4.2 Nghĩa vụ và việc làm

| Mã | Nghĩa vụ (đội hiểu) | Việc làm cụ thể |
|---|---|---|
| RISK-LG-50 | Thông báo xử lý dữ liệu trước khi xử lý | Chính sách quyền riêng tư bản tiếng Việt, ngắn gọn; thẻ thông báo lúc nhập ngày sinh («ngày sinh chỉ lưu trên máy bạn») |
| RISK-LG-51 | Đồng ý của chủ thể, rõ ràng, có thể rút | Thẻ đồng ý AI; thẻ đồng ý MMO (gửi tên, màu áo); rút trong «Dữ liệu của tôi» |
| RISK-LG-52 | Đồng ý riêng cho dữ liệu nhạy cảm | Không lưu dữ liệu nhạy cảm ở máy chủ; nếu phải lưu (môn phái) → đồng ý riêng |
| RISK-LG-53 | Quyền của chủ thể (biết, truy cập, sửa, xóa, hạn chế, phản đối, rút đồng ý…) | Màn «Dữ liệu của tôi» (tập 14.12 §4) |
| RISK-LG-54 | Hồ sơ đánh giá tác động xử lý dữ liệu | PC lập trước M1, cập nhật mỗi mốc |
| RISK-LG-55 | Hồ sơ đánh giá tác động chuyển dữ liệu ra nước ngoài | Cloudflare, nhà cung cấp AI (RISK-078) |
| RISK-LG-56 | Thông báo vi phạm cho cơ quan chuyên trách trong thời hạn (đội hiểu là 72 giờ) | Quy trình tập 14.12 §8 |
| RISK-LG-57 | Dữ liệu trẻ em: đồng ý của trẻ (từ đủ 7 tuổi) và cha mẹ / người giám hộ | Cổng tuổi; không MMO, không AI cho < 13 (RISK-080) |
| RISK-LG-58 | Chỉ định bộ phận / nhân sự bảo vệ dữ liệu | PC kiêm |
| RISK-LG-59 | Không mua bán dữ liệu cá nhân | Không có |

---

## 5. Quảng cáo, tiếp thị, bảo vệ người tiêu dùng

### 5.1 Quy tắc quảng cáo của dự án

| Mã | Quy tắc |
|---|---|
| RISK-LG-60 | Không hứa kết quả đời thực: không «đổi mệnh», «giải hạn», «cải vận trong 7 ngày», «biết trước tương lai». |
| RISK-LG-61 | Không dùng hình Phật, Bồ Tát, thần, tượng thờ làm hình chính của quảng cáo; không dùng tên, hình tu sĩ thật. |
| RISK-LG-62 | Không dùng ảnh di tích thật khi chưa xin phép ban quản lý (RISK-019). |
| RISK-LG-63 | Ghi xếp hạng độ tuổi trên quảng cáo (nếu quy định yêu cầu — *cần xác minh*). |
| RISK-LG-64 | Không quảng cáo dịch vụ G1 trước khi có phê duyệt (*cần luật sư xác minh*). |
| RISK-LG-65 | Không nhắm quảng cáo theo dữ liệu tôn giáo, sức khỏe, tình trạng «năm hạn». |
| RISK-LG-66 | Không dùng câu «AI đoán chính xác 99%» hay số liệu không có cơ sở; điểm Neo là đo khớp dữ liệu, không phải đo «đoán đúng». |
| RISK-LG-67 | Người có ảnh hưởng quảng bá game: hợp đồng ghi rõ quy tắc trên, ghi rõ là quảng cáo, cấm kết hợp bán dịch vụ tâm linh (RISK-172). |

### 5.2 Người tiêu dùng

| Mã | Việc |
|---|---|
| RISK-LG-70 | Điều khoản sử dụng + điều kiện mua hàng bằng tiếng Việt, dễ đọc, hiển thị trước lần nạp đầu |
| RISK-LG-71 | Giá bằng VNĐ, đã gồm thuế, trước khi xác nhận |
| RISK-LG-72 | Chính sách hoàn tiền (theo cửa hàng với iOS/Android; theo chính sách dự án với web) |
| RISK-LG-73 | Không thiết kế lừa: không đồng hồ đếm ngược giả, không «chỉ còn 1 món», không ẩn nút đóng |
| RISK-LG-74 | Người dưới 18: khóa nạp tiền (RISK-040) |
| RISK-LG-75 | Kênh khiếu nại, thời hạn phản hồi |

---

## 6. Tín ngưỡng, mê tín, di sản

### 6.1 Tín ngưỡng, tôn giáo và mê tín

| Mã | Rủi ro pháp lý | Biện pháp |
|---|---|---|
| RISK-LG-80 | Nội dung bị coi là xúc phạm niềm tin tín ngưỡng, tôn giáo (Luật 2016, Luật An ninh mạng) | Tập 14.05–14.07, HĐCV |
| RISK-LG-81 | Bị coi là lợi dụng tín ngưỡng để trục lợi | Không bán gì gắn yếu tố thiêng (tập 14.03 §4.1); không nhận quyên góp (RISK-142) |
| RISK-LG-82 | Bị coi là hoạt động mê tín dị đoan / hành nghề mê tín | Không bán dịch vụ, vật phẩm hứa tác dụng; khung «tham khảo và chiêm nghiệm»; thông điệp chống lừa đảo; tham khảo ý luật sư về ranh giới giữa trình bày văn hóa và «hoạt động mê tín» trong văn bản xử phạt *(cần luật sư xác minh)* |
| RISK-LG-83 | Thông tin xúc phạm danh nhân, anh hùng dân tộc | Nhân vật lịch sử không là NPC đối thoại, không persona AI (RISK-024) |
| RISK-LG-84 | Kỳ thị dân tộc | Tập 14.07 §4 |

### 6.2 Di sản

| Nguyên mẫu | Tình trạng đội biết | Rủi ro | Biện pháp |
|---|---|---|---|
| Văn Miếu – Quốc Tử Giám | Di tích quốc gia đặc biệt *(cần xác minh)*; 82 bia Tiến sĩ — di sản tư liệu UNESCO [C] | Mô phỏng bia, khắc tên | RISK-020; «lấy cảm hứng» |
| Yên Tử | Di tích quốc gia đặc biệt *(cần xác minh)* | Mô phỏng chùa, tháp | Đổi chi tiết; ghi codex |
| Chùa Bút Tháp | Di tích quốc gia đặc biệt *(cần xác minh)*; tượng Quan Âm nghìn mắt nghìn tay là bảo vật quốc gia *(cần xác minh)* | Bản sao bảo vật | RISK-019, RISK-G-TD-14 |
| Chùa Tây Phương | Tượng La Hán *(cần xác minh tình trạng xếp hạng)* | Sao chép tượng | Phong cách chung |
| Thực hành thờ Mẫu Tam phủ | Di sản phi vật thể đại diện của nhân loại (UNESCO 2016) [C] | Trình bày sai | Tập 14.07 §3 |
| Di tích ở Trung Quốc (Long Hổ, Võ Đang, Bạch Vân Quán, Mao Sơn, Phong Đô), Tây Tạng | Một số thuộc di sản thế giới *(cần xác minh)* | Uy tín, chính trị (Tây Tạng) | Lấy cảm hứng; tập 14.06 §6 |

| Mã | Việc |
|---|---|
| RISK-LG-85 | PC lấy ý kiến luật sư: dựng mô hình 3D lấy cảm hứng có thuộc «làm bản sao» theo Luật Di sản văn hóa 2024 không *(cần luật sư xác minh)* |
| RISK-LG-86 | Nếu dùng tên, ảnh di tích trong quảng bá: xin phép ban quản lý |
| RISK-LG-87 | Codex «lấy cảm hứng từ…» cho từng thánh địa, ghi rõ đây là bản hư cấu |

---

## 7. Thanh toán, tiền ảo, cờ bạc và hộp ngẫu nhiên

### 7.1 Nguyên tắc: game **không có** gacha — và phải giữ như vậy

Canon §14: «Cờ bạc hóa / bán số → Không gacha; không bán cải mệnh». Tập này nâng thành **bất biến pháp lý – đạo đức**:

| Mã | Bất biến |
|---|---|
| RISK-LG-90 | Không có vật phẩm, hộp, lượt quay nào có kết quả ngẫu nhiên mà mua được bằng tiền thật hoặc bằng tiền tệ mua được bằng tiền thật (Ngọc). |
| RISK-LG-91 | Kết quả ngẫu nhiên miễn phí (xin xăm, gieo quẻ — web) không đổi được ra vật phẩm có giá trị, không «quay lại» bằng tiền tệ. |
| RISK-LG-92 | Không có cơ chế cược Phúc Khí, Ngọc giữa người chơi. |
| RISK-LG-93 | Hợp đồng với đối tác phát hành (phương án B) ghi rõ RISK-LG-90 … 92; vi phạm là căn cứ chấm dứt. |

### 7.2 Vì sao — bối cảnh quốc tế

| Nơi | Tình hình đội biết | Độ chắc |
|---|---|---|
| Bỉ | Cơ quan quản lý cờ bạc coi hộp ngẫu nhiên trả phí là cờ bạc (từ 2018) | [C] khung, [X] hiện trạng thực thi |
| Hà Lan | Có vụ xử phạt rồi bị tòa cấp cao hủy (2022) | [X] |
| Hàn Quốc | Luật yêu cầu công bố tỉ lệ vật phẩm ngẫu nhiên (hiệu lực 2024) | [X] |
| Trung Quốc | Yêu cầu công bố tỉ lệ từ lâu | [X] |
| Nhật Bản | Cấm cơ chế «kompu gacha» (ghép bộ từ hộp ngẫu nhiên) từ 2012 | [C] |
| Apple | Yêu cầu công bố tỉ lệ trước khi mua vật phẩm ngẫu nhiên (3.1.1) | [C] |
| Google Play | Yêu cầu công bố tỉ lệ vật phẩm ngẫu nhiên | [C] |
| Việt Nam | Bộ luật Hình sự có các tội đánh bạc, tổ chức đánh bạc; quy định trò chơi điện tử có nội dung về vật phẩm ảo *(cần luật sư xác minh quy định riêng về vật phẩm ngẫu nhiên)* | [X] |

Ngoài pháp lý: game về **số mệnh** mà có hộp ngẫu nhiên trả phí là đang **bán vận may** — trái RB5 và trụ cột T6. Đây là lý do mạnh nhất.

### 7.3 Xin xăm và gieo quẻ có phải cờ bạc không

Phân tích của đội (để luật sư xác nhận):
- Không có tiền cược (miễn phí, giới hạn 3 lần/ngày — `CAPS.sticksPerDay`).
- Không có giải thưởng có giá trị (chỉ là lời bàn + Phúc Khí cố định nhỏ `REWARD.stick = 3`, không phụ thuộc kết quả).
- → Đội cho rằng **không phải** cờ bạc. Tuy vậy: (a) thưởng Phúc Khí không phụ thuộc thẻ tốt/xấu (giữ như hiện tại); (b) thành tựu «Thượng thượng» (`top_stick`) là thành tựu ngẫu nhiên — chấp nhận được vì không có giá trị kinh tế, nhưng không gắn Ngọc.

### 7.4 Thanh toán

| Kênh | Quy tắc |
|---|---|
| iOS | Chỉ In-App Purchase (RISK-094); VIP dạng thuê bao tự gia hạn theo 3.1.2 với mô tả quyền lợi rõ |
| Android | Chỉ Google Play Billing (RISK-101) trừ chương trình thay thế ở thị trường được phép *(cần xác minh)* |
| Web | Chỉ qua trung gian thanh toán được cấp phép tại Việt Nam *(cần luật sư xác minh)*; không thu qua chuyển khoản cá nhân; hóa đơn theo quy định |
| Mọi kênh | Sổ cái máy chủ cho Ngọc, VIP (RISK-119, RISK-141); khóa nạp cho < 18 |

---

## 8. Apple App Store

### 8.1 Bảng tính năng × nền tảng (nguồn sự thật duy nhất — RISK-104)

| Tính năng | Web | iOS (Học Quán) | Android | PC | Ghi chú |
|---|---|---|---|---|---|
| Nhập ngày sinh, lập lá số | ✓ | ✓ (chỉ dùng cho màu áo, «Học Quán») | ✓ | ✓ | |
| Mệnh Bàn đầy đủ (Tiềm Lực, Phẩm căn…) | ✓ | — | ✓ | ✓ | iOS: không chấm điểm lá số bản thân |
| Mệnh Đồ, Nghịch Thiên Cải Mệnh | ✓ | — (thay bằng «Lộ trình tu học» không chẩn đoán) | ✓ | ✓ | RISK-091 |
| Khổng tiên sinh (lời phán) | ✓ | — | ✓ | ✓ | |
| Vận Mệnh Các, Thái Tuế Điện | ✓ | — | ✓ (cân nhắc) | ✓ | `features.js › IOS_OFF` |
| Xin xăm, đèn hoa đăng điều ước, giải quẻ | ✓ | — | cân nhắc | ✓ | |
| Giải án khách NPC, sảnh nghề | ✓ | ✓ | ✓ | ✓ | lõi «học» của iOS |
| Thầy AI (game) | ✓ | — | ✓ | ✓ | `FEATURES.ai = !IOS` |
| Hỏi AI trong Chart Lab (app nghiên cứu, ngoài game) | ✓ | ✓ (theo hồ sơ nộp v4) | — | — | Cần thẻ đồng ý chia sẻ AI (RISK-096) |
| Âm tà Lớp 1, Tà Lộ, Phong Đô, Miêu Cương | ✓ (opt-in) | — | ✓ (opt-in) | ✓ (opt-in) | tập 14.08 |
| MMO (cụm từ, emote) | ✓ | ✓ (sau khi có đủ 1.2) | ✓ | ✓ | |
| Tàng Y Các | ✓ | ✓ (IAP) | ✓ (Play Billing) | ✓ | |
| Nạp Ngọc | web: cổng thanh toán | IAP | Play Billing | cửa hàng PC | |
| Tham số `?server=` | dev | — | — | — | RISK-129 |

### 8.2 Từ cấm mở rộng cho kiểm iOS

`verify-ios-review-path.mjs` hiện kiểm `/xin xăm|bói|giải hạn|đổi vận/i` trong overlay game. Đề xuất mở rộng (cả overlay game và `dist-ios` toàn bộ chuỗi giao diện):

```
/xin xăm|gieo quẻ|bói|giải hạn|đổi vận|đổi mệnh|cải mệnh|cải vận|nghịch thiên cải mệnh|mệnh do ta tạo|vận mệnh các|thái tuế điện|khổng tiên sinh|năm hạn|phạm thái tuế|tiên đoán|dự đoán tương lai|xem vận/i
```

Lưu ý: chữ «mệnh» đứng riêng (trong «Bản Mệnh Y», «Sổ Mệnh») — iOS đã đổi «Sổ Mệnh» → «Sổ Tu Học» (`TEXT.book`); cần đổi tiếp «Bản Mệnh Y» → «Bản Hành Y» trên iOS.

### 8.3 Đối chiếu từng mục hướng dẫn

*(Số mục theo App Store Review Guidelines mà đội biết [C]; nội dung chi tiết, phiên bản mới nhất cần TPH đọc lại trước mỗi lần nộp.)*

| Mục | Nội dung (tóm tắt) | Liên quan game | Trạng thái / việc |
|---|---|---|---|
| 4.3(b) | Danh mục bão hòa, nêu «fortune telling» | Toàn bộ trục lá số | Bản Học Quán; §8.1, §8.2 (RISK-091) |
| 2.3.1 | Không có tính năng ẩn, không đổi tính năng sau duyệt | Cờ server, `?server=` | Cờ build-time (RISK-092) |
| 2.1 | Độ hoàn chỉnh, hồ sơ duyệt khớp | Review notes | §8.5 (RISK-104) |
| 1.1.1 | Nội dung phỉ báng, phân biệt, xúc phạm (gồm tôn giáo) | Phong Đô, Tà Lộ (đã tắt iOS), vật thiêng | Tập 14.05–14.07 |
| 1.2 | UGC: lọc, báo cáo, chặn, liên hệ | MMO tên, `title` | §8.4 (RISK-093, RISK-122) |
| 1.4.1 | Thông tin y tế có thể gây hại | Tĩnh tọa, đan | Tập 14.09 §6 |
| 3.1.1 | IAP cho hàng số; công bố tỉ lệ hộp ngẫu nhiên | Ngọc | IAP; không có hộp ngẫu nhiên |
| 3.1.2 | Thuê bao | VIP | Mô tả quyền lợi rõ, không quyền lợi «cải vận» |
| 4.8 | Dịch vụ đăng nhập | Khi thêm đăng nhập bên thứ ba | Sign in with Apple (RISK-095) |
| 5.1.1 | Thu thập dữ liệu, chính sách quyền riêng tư, xóa tài khoản (v) | `pid`, tên, tài khoản | Tập 14.12 §4–§5 |
| 5.1.2 | Sử dụng, chia sẻ dữ liệu; chia sẻ với AI bên thứ ba cần công bố và xin phép *(cần xác minh nguyên văn mới)* | Chart Lab AI | Thẻ đồng ý (RISK-096) |
| 5.3 | Game, cờ bạc, xổ số | Không có | Giữ |
| Nhãn quyền riêng tư, privacy manifest | Khai dữ liệu thu thập, lý do API | MMO, AI | Bảng tập 14.12 §1 (RISK-099) |
| Xếp hạng tuổi | Bảng câu hỏi | Tôn giáo, kinh dị nhẹ, tương tác người dùng | §3.4 |

### 8.4 Checklist Guideline 1.2 (UGC) cho tab Học Quán

- [ ] Lọc nội dung gây phản cảm: tên (`cleanName` mở rộng — tập 14.12 §6.2), `title` chỉ từ danh mục (RISK-122).
- [ ] Cơ chế báo cáo trong game: nút báo cáo người chơi (đã có `report`, 3 lý do + thêm «Dụ dỗ / rủ ra ngoài», «Quảng cáo dịch vụ tâm linh»).
- [ ] Chặn người dùng lạm dụng: «ẩn người này» (đã có, theo `u`).
- [ ] Thông tin liên hệ hỗ trợ trong app (email, trang hỗ trợ — không link ngoài trên iOS: hiển thị địa chỉ email dạng văn bản sao chép được).
- [ ] Phản hồi báo cáo kịp thời: hàng đợi admin, cam kết ≤ 24 giờ (tập 14.12 §6.3).
- [ ] Điều khoản sử dụng có nội quy cộng đồng, chấp nhận trước khi vào MMO.
- [ ] Chỉ cụm từ soạn sẵn (`PHRASES`) — ghi trong review notes.

### 8.5 Đoạn review notes cho tab Học Quán (mẫu, tiếng Anh)

```
HỌC QUÁN (optional study game tab, not the launch screen)
- Purpose: practise classical Chinese-metaphysics case analysis on fictional NPC clients.
  Players solve "cases" step by step; answers are graded deterministically by the app's
  offline engine with classical citations.
- The player's own birth date is used only to colour the avatar's robe. It never leaves
  the device for this tab. No personal readings, predictions, or "luck" features exist
  in this build (no fortune sticks, no yearly forecasts, no AI master in the game tab).
- Multiplayer: players see each other's avatars. Communication is limited to 8 preset
  phrases and 6 emotes (no free text). Names are filtered; players can report and hide
  others; reports are reviewed within 24 hours. Support contact: <email> (Settings).
- No random paid items, no gambling mechanics. Cosmetic items via In-App Purchase only.
```

### 8.6 Nếu bị từ chối

| Lý do | Hành động |
|---|---|
| 4.3(b) | Trả lời Resolution Center theo `docs/APPLE-APPEAL-4.3b-READY.txt` + §8.5; nếu vẫn bị: gỡ tab game khỏi iOS, giữ app nghiên cứu |
| 1.2 | Bổ sung theo §8.4; nộp lại |
| 2.3.1 | Rà cờ, nộp bằng chứng cờ build-time |
| 5.1.x | Sửa chính sách, nhãn; nộp lại |

---

## 9. Google Play

| Chính sách *(tên theo hiểu biết của đội — TPH đọc bản hiện hành)* | Liên quan | Việc |
|---|---|---|
| Payments | Ngọc, VIP | Play Billing (RISK-101) |
| User Generated Content | Tên, Bảng Vàng | Lọc, báo cáo, chặn, điều khoản (như §8.4) |
| AI-Generated Content | Thầy AI, persona | Nút báo cáo nội dung AI trong app (RISK-100); rào chắn tập 14.10 |
| Data safety | Toàn bộ | Khai theo tập 14.12 §1 |
| Account deletion | Khi có tài khoản | Xóa trong app + trang web yêu cầu xóa |
| Gambling / Real-Money Gambling, Games and Contests | Không có | Giữ |
| Families / Target audience | Khán giả 16+ (hoặc 13+) | Không nhắm trẻ em (RISK-102) |
| Inappropriate content (hate, sensitive events) | Tôn giáo, dân tộc | Tập 14.05–14.07 |
| Health content and services | Tĩnh tọa, đan | Tập 14.09 §6 |
| Monetization (loot box odds) | Không có hộp ngẫu nhiên | Giữ |

---

## 10. PC và web

| Kênh | Nghĩa vụ | Việc |
|---|---|---|
| Steam *(nếu phát hành)* | Khai báo nội dung do AI tạo (trước phát hành và sinh trong lúc chơi), cam kết rào chắn *(cần xác minh)* | Tờ khai: Meshy (tài sản), LLM (thoại NPC); mô tả rào chắn tập 14.10 |
| Steam | Xếp hạng tuổi theo khu vực | Theo §3.4 |
| Web (`battu.god8.shop`) | Chính sách quyền riêng tư, điều khoản, đồng ý cookie nếu có cookie không thiết yếu (EU) | Game không dùng cookie theo dõi (RISK-116) |
| Web | Bảo mật | HSTS, nosniff, Referrer-Policy, X-Frame-Options đã có (`withSecurityHeaders`); CSP cho trang game (tập 14.12 §7) |

---

## 11. Quốc tế

### 11.1 Quyết định thị trường

| Thị trường | Lộ trình | Lý do |
|---|---|---|
| Việt Nam | Chính | Người dùng app; phương án A cho MMO tới khi có quyết định |
| Người Việt hải ngoại (Mỹ, Úc, Âu…) | Có thể truy cập web; không tiếp thị chủ động trước M6 | Giảm nghĩa vụ GDPR/COPPA cho tới khi sẵn sàng |
| Trung Quốc đại lục | Không | Giấy phép game, nhạy cảm Tây Tạng, Pháp Luân Công (RISK-002, RISK-171) |
| Đài Loan, Hồng Kông | Cân nhắc sau M6 | Nhiều nguyên mẫu Đạo giáo dân gian; cần bản địa hóa và HĐCV địa phương |

### 11.2 EU / Vương quốc Anh (nếu phục vụ)

| Mã | Nghĩa vụ (khung [C], chi tiết [X]) | Việc |
|---|---|---|
| RISK-LG-100 | Cơ sở pháp lý cho từng xử lý; dữ liệu đặc biệt (niềm tin tôn giáo, sức khỏe) cần điều kiện đặc biệt (thường là đồng ý rõ ràng) | Giống §4.2; không lưu dữ liệu đặc biệt ở máy chủ |
| RISK-LG-101 | Quyền chủ thể, thời hạn trả lời (thường 1 tháng) | Màn «Dữ liệu của tôi» |
| RISK-LG-102 | Chuyển dữ liệu ra ngoài EU (nhà cung cấp AI) | Điều khoản chuyển dữ liệu chuẩn hoặc tương đương |
| RISK-LG-103 | Tuổi đồng ý số của trẻ (13–16 tùy nước) | Cổng tuổi |
| RISK-LG-104 | Minh bạch chatbot theo Đạo luật AI của EU *(cần xác minh thời điểm áp dụng nghĩa vụ)* | Nhãn «AI» (RISK-070) |
| RISK-LG-105 | Đại diện tại EU nếu nhắm thị trường EU *(cần xác minh điều kiện)* | Chưa nhắm |

### 11.3 Hoa Kỳ (nếu phục vụ)

| Mã | Nghĩa vụ | Việc |
|---|---|---|
| RISK-LG-110 | COPPA: trẻ < 13 — đồng ý có thể kiểm chứng của phụ huynh trước khi thu thập dữ liệu cá nhân | < 13: không MMO, không AI, không gửi gì lên máy chủ (RISK-080) |
| RISK-LG-111 | Luật quyền riêng tư cấp bang | Không bán, không chia sẻ dữ liệu cho quảng cáo |
| RISK-LG-112 | Tài nguyên khủng hoảng | 988 trong bảng tập 14.09 §5.2 (đã xác minh) |

---

## 12. Theo dõi văn bản mới

| Việc | Tần suất | Ai |
|---|---|---|
| Rà văn bản mới về trò chơi điện tử, dữ liệu cá nhân, an ninh mạng, quảng cáo, thương mại điện tử | Mỗi quý | PC |
| Đọc lại App Store Review Guidelines, chính sách Google Play | Trước mỗi lần nộp + mỗi quý | TPH |
| Rà thay đổi điều khoản của nhà cung cấp AI | Mỗi quý | PC + TAI |
| Cập nhật bảng §1 và các mục [X] khi luật sư xác nhận | Khi có | PC |

Danh sách theo dõi hiện tại:
- Văn bản hướng dẫn Luật Bảo vệ dữ liệu cá nhân 2025.
- Luật an ninh mạng mới (2025) và văn bản hướng dẫn.
- Văn bản hướng dẫn Nghị định 147/2024/NĐ-CP về trò chơi điện tử (thông tư về phân loại độ tuổi, phê duyệt kịch bản).
- Thay đổi hệ thống xếp hạng tuổi của Apple.
- Chính sách AI của Apple (5.1.2) và Google (AI-Generated Content).
- Quy định hộp ngẫu nhiên các nước (dù game không có).

---

## 13. Câu hỏi gửi luật sư (ưu tiên trước M2)

1. Bản web chơi đơn có kết nối AI qua máy chủ của dự án có thuộc diện trò chơi G1–G4 không? Bản web có MMO cụm từ soạn sẵn có chắc chắn là G1 không?
2. Doanh nghiệp / cá nhân nước ngoài hoặc trong nước chưa có pháp nhân có thể cung cấp G1 qua đối tác không; điều kiện tối thiểu?
3. Tiêu chí phê duyệt nội dung kịch bản G1 hiện hành nói gì về tôn giáo, tín ngưỡng, mê tín dị đoan, bói toán? Nội dung nào trong tập 14.05–14.08 có nguy cơ bị từ chối?
4. Các mức phân loại độ tuổi hiện hành và tiêu chí; nghĩa vụ hiển thị.
5. Giới hạn thời gian chơi cho người dưới 18 và cách xác thực tài khoản hiện hành; áp cho cả chơi đơn không?
6. Lựa chọn đạo thống trong game lưu ở máy chủ có bị coi là dữ liệu về quan điểm tôn giáo không?
7. Thủ tục hồ sơ chuyển dữ liệu ra nước ngoài theo luật 2025 khi dùng nhà cung cấp AI nước ngoài, Cloudflare.
8. Nghĩa vụ thông báo vi phạm dữ liệu: thời hạn, cơ quan nhận, nội dung.
9. Ranh giới giữa trình bày văn hóa tín ngưỡng và «hoạt động mê tín dị đoan» trong văn bản xử phạt hành chính và Điều 320 Bộ luật Hình sự.
10. Dựng mô hình 3D lấy cảm hứng từ di tích, bảo vật quốc gia có cần xin phép không?
11. Bán vật phẩm ảo trên web: cần đăng ký thương mại điện tử không; trung gian thanh toán phù hợp; thuế.
12. Nghĩa vụ khi nhận thư của người dùng có nguy cơ tự hại (có nghĩa vụ báo cơ quan nào không).
13. Thời hạn gỡ nội dung khi có yêu cầu; kênh tiếp nhận hợp lệ.
14. Ghi tên cố vấn tôn giáo trong credits có cần chấp thuận của tổ chức tôn giáo họ thuộc về không.
