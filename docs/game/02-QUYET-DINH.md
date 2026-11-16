# 02 · Sổ quyết định

> **Trạng thái:** `[ĐÃ CÓ]`; mục §2.4 và §2.5 là `[ĐỀ XUẤT]` chờ chủ dự án
> **Bộ phận chủ trì:** Thiết kế game (người quyết cuối: chủ dự án)
> **Nguồn sự thật trong mã:** không; mỗi quyết định dẫn tới chương thi hành
> **Test:** không
> **Thay thế:** `GAME-THIET-KE-CHOT` §1 (Q1–Q7), `GAME-SINH-TON-KINH-TE-DAC-TA` §11 (Quyết định 1–16), mục «decisions» của `GAME-TROI-THIET-KE` và `GAME-AAA-MODEL-THANH-PHO`
> **Kiểm với mã ngày:** 2026-11-16

## 2.1 Mục đích và cách dùng

Mọi quyết định của game nằm ở đây, mỗi quyết định một dòng: bối cảnh, quyết định, hệ quả, nơi thi hành. Quy tắc:
- Quyết định cũ **không sửa, không xoá**. Bị đảo thì thêm quyết định mới và ghi «thay bằng».
- Số không dùng lại. `QĐ-01…16` giữ nguyên số của đặc tả kinh tế; `QĐ-C1…C7` là bảy quyết định của thiết kế chốt ngày 05/11; từ `QĐ-17` là quyết định sau đó.
- Quyết định mới: thêm vào cuối §2.3, kèm ngày.

## 2.2 Quyết định đang hiệu lực, gom theo chủ đề

| Chủ đề | Quyết định |
|---|---|
| Trục chính và phạm vi | QĐ-17, QĐ-C3, QĐ-24 |
| Mệnh và riêng tư | QĐ-07, QĐ-30 |
| Tiền và điểm | QĐ-03, QĐ-12, QĐ-13, QĐ-20 |
| Đời sống | QĐ-04, QĐ-09, QĐ-16 |
| Tu luyện, luân hồi | QĐ-12, QĐ-14 |
| Tài khoản, máy chủ | QĐ-01, QĐ-19, QĐ-21 |
| AI | QĐ-05, QĐ-10, QĐ-22 |
| Kinh tế xã hội | QĐ-08, QĐ-11, QĐ-15 |
| Thế giới | QĐ-18, QĐ-23, QĐ-25, QĐ-28 |
| Tài sản 3D | QĐ-26, QĐ-27, QĐ-C2 |

## 2.3 Danh sách quyết định

### Thiết kế chốt 2026-11-05

| Mã | Bối cảnh | Quyết định | Trạng thái hôm nay |
|---|---|---|---|
| QĐ-C1 | Tài liệu cấm «tu tiên» trong khi mã đã có cấp, gia trì, ngự kiếm; bản tầm nhìn thêm cảnh giới 6 bậc | Giữ cái đã có mã; cắt cảnh giới | **Thay bằng QĐ-12**: cảnh giới trở lại dưới dạng bảy bậc dựa trên cấp có sẵn |
| QĐ-C2 | Spec đầu cấm tượng thần; mã đã dựng Tam Thanh | Theo cái đã dựng; giữ luật «tượng không chữ, không thánh tích» | Hiệu lực → LN-11 |
| QĐ-C3 | Lộ trình tầm nhìn cần 35 tuần, 15–16 người, hàng nghìn credit | Cắt khỏi kế hoạch thực thi; bộ `docs/gdd/` là tầm nhìn tham khảo | Hiệu lực → lớp L4 |
| QĐ-C4 | Tài liệu ghi Sổ Mệnh có các thẻ chưa tồn tại | Chốt theo mã: Tu học · Hồ sơ · Xăm · Đèn · Thành tựu · Cài đặt | Hiệu lực; menu đã mở rộng ở v4 (§22) |
| QĐ-C5 | Ba điện vùng thiếu tượng | Không chặn phát triển; sảnh nghề chạy ở bàn sảnh | **Vượt bởi QĐ-17/18**: miếu tám vị thần thay vai trò điện vùng |
| QĐ-C6 | Hai lỗi engine (so chuỗi giản/phồn thể; đọc sai khoá Dụng thần) | Không sửa engine; phía game tự lách | Hiệu lực cho tới khi engine sửa |
| QĐ-C7 | Điểm thông thạo cho nội dung mới | Chấm ngay trong bảng, chưa ghi vào tiến trình | Hiệu lực |

### Đặc tả đời sống – kinh tế 2026-11-10

| Mã | Quyết định | Thi hành |
|---|---|---|
| QĐ-01 | Đăng nhập tự dựng trên Worker (Google, mã email; SMS sau), không mật khẩu, không dùng Firebase | §31.2 |
| QĐ-02 | Tài khoản bên ngoài (Google OAuth, dịch vụ mail, SMS) do chủ dự án tự tạo | `TAI-KHOAN-CAI-DAT` |
| QĐ-03 | Tiền sinh hoạt tách khỏi Phúc Khí và Ngọc; nhà mua bằng tiền | §13.1, §15 |
| QĐ-04 | Chỉ số sinh tồn giảm cả khi vắng mặt, ở 25 % tốc độ và có sàn | §13.2.2 |
| QĐ-05 | Ngân sách LLM tháng cho NPC và trọng tài: **chưa có con số** | §21; chờ duyệt §2.5 |
| QĐ-06 | Deploy phần máy chủ chỉ khi chủ dự án cho phép | §32 |
| QĐ-07 | Mỗi lượt xem của thầy mệnh lý luôn gửi tứ trụ tám chữ kèm hồ sơ rút gọn; không gửi ngày giờ dạng lịch; xoá sau 30 ngày; phải có đồng thuận | §12.6.3, LN-01 |
| QĐ-08 | Có Thương hội mồi khởi động: hạn mức 2 lượng mỗi người mỗi ngày, giảm dần và tắt khi đủ 30 người hoạt động | §17.1.4 |
| QĐ-09 | Đồng hồ sản xuất là giờ thật, không tăng tốc, chạy cả khi vắng mặt | §17 |
| QĐ-10 | Trọng tài AI chung ngân sách với NPC chat, được ưu tiên khi còn dưới 20 %; hết thì chỉ chạy lớp 0; quá 72 giờ không ai duyệt thì hoàn tiền | §21.4 |
| QĐ-11 | Hôn nhân không chặn tuổi; nội dung chỉ là nghi lễ và khế ước tài sản | §20.2 |
| QĐ-12 | Tiền mua bán là hệ kim loại. Phúc Khí và Âm Đức là điểm Huyền học, không phải tiền; thêm Nghiệp Lực. Có tu luyện tới đắc đạo. Chết vì đói hoặc bệnh thì luân hồi | §13.1, §18 |
| QĐ-13 | Bỏ mọi Ngọc miễn phí (điểm danh, VIP hằng ngày, quà lên cấp) | §11, §18.2 |
| QĐ-14 | Vật cưỡi bậc cao nhanh hơn 5 % mỗi bậc, tối đa 20 %; trần chung 35 % | §16.4 |
| QĐ-15 | Bán cả Hài Hộ Thân lẫn Định Thủy Châu bằng Ngọc; nhánh thân pháp học bằng Phúc Khí | §16.3 |
| QĐ-16 | Đuối nước chỉ ngất, không chết | §16.3, §18.5.1 |

### Sau 2026-11-10 (rút từ nhật ký thi công và các manifest)

| Mã | Ngày | Bối cảnh | Quyết định | Thi hành |
|---|---|---|---|---|
| QĐ-17 | 11/11 | Người chơi đến để xem bói nhưng việc đó bị giấu sau nút bấm | **Bói toán là trục chính**: gặp thầy là mở thẳng ô hỏi; mỗi miếu một nghi thức | §12.1, TC-3 |
| QĐ-18 | 11/11 | Thành nhỏ, sảnh nghề xa ngoài thành | Thế giới 8.192 m, thành gấp 10, tám sảnh dời vào Ngoại Thành; **giữ nguyên chỉ số nhà `h`** để người đã mua không mất nhà | §10, LN-12 |
| QĐ-19 | 11/11 | Đặc tả vẽ sáu Durable Object cho kinh tế | Gộp vào **một** `Economy`, luật ở `econ-core.js` dùng chung máy chủ, test và máy ngoại tuyến | §31.4 |
| QĐ-20 | 11/11 | Ví còn nằm trên máy người chơi | Thêm **ví chợ** trên máy chủ, gửi lên có trần mỗi ngày (khách 300, tài khoản 5.000 đồng); là cầu nối tới khi ví lên hẳn máy chủ | §17.7, VC-013 |
| QĐ-21 | 11/11 | Client tự khai cấp để mở nghề thầy và kết hôn | Máy chủ giữ **tuổi tài khoản**: thầy mệnh lý từ 14 ngày, kết hôn cả hai từ 7 ngày | §12.6.1, §20.2.1 |
| QĐ-22 | 11/11 | Chọn mô hình cho NPC và trọng tài | Dùng chung cấu hình AI của app (`ai:config`); tắt chế độ suy luận; lời người chơi đặt trong khối rào; lọc cả vế câu có chữ Hán | §21.3 |
| QĐ-23 | 11/11 | Phố v4 đủ chức năng nhưng như khu công nghiệp | Quy hoạch theo `THANH-MANIFEST`: phường có trung tâm, nhà bao chu vi, góc vát, không hai nhà kề giống nhau | §10 |
| QĐ-24 | 12/11 | «Có nâng lên tầm AAA được không?» | Nói thẳng: không đạt AAA thật trên web với model AI. Đích là mức game thương mại web tầm trung, **đo bằng số** ở các điểm cố định | §30, `DOHOA-MANIFEST` §0 |
| QĐ-25 | 12/11 | Nhà đã có nhưng không lộ ra; thiếu phủ trên trời | Cửu Trọng Thiên: chín tiên phủ nối vào **cuối** sổ nhà; menu «Địa điểm» theo nhu cầu thay menu theo gian | §10, §22 |
| QĐ-26 | 14/11 | Hết credit tạo model; nhà sai tỉ lệ người | Model mới sinh bằng **Blender thủ tục theo mét thật**; có bảng tỉ lệ chuẩn làm luật | §23, LN-13 |
| QĐ-27 | 14/11 | Nhân vật bị chê xấu | Nâng bằng phụ kiện thủ tục và nhuộm màu; không đụng khung xương, không đổi chiều cao | §11, §23 |
| QĐ-28 | 14/11 | Mở rộng diện tích trời | Quận Thiên Bàn chín đảo cùng độ cao 460 m, nối bằng bốn cầu; lên duy nhất bằng Vân Thang | §10 |
| QĐ-29 | 11/11 | Thông báo dồn dập | Hàng đợi một thông báo mỗi 1,5 giây, gộp trùng; đầu ngày chỉ một thẻ «Sáng nay» | §22 |
| QĐ-30 | 10/11 | Đổi Dụng thần để trục lợi kinh tế | Máy chủ khoá Dụng thần đã khai 30 ngày; đầu thai là ngoại lệ | §14.2, §18.5.4 |

## 2.4 Mâu thuẫn giữa các tài liệu và cách giải `[ĐỀ XUẤT]`

Mỗi dòng là một chỗ hai tài liệu (hoặc tài liệu và mã) nói ngược nhau. Cột «Đề xuất» là hướng người soạn chọn để bộ tài liệu nhất quán; **chưa phải quyết định** cho tới khi chủ dự án duyệt.

| Mã | Mâu thuẫn | Đề xuất | Hệ quả nếu duyệt |
|---|---|---|---|
| MT-1 | Trụ cột T3 «không thanh máu, không chết» ↔ sinh tồn, bệnh, luân hồi (QĐ-12) | Viết lại trụ cột như §0.3: không sát phạt, nhưng có đời sống khắt khe | Bản tầm nhìn tập 01 thành lịch sử ở điểm này |
| MT-2 | «Thái Tuế là thời tiết, không phải án phạt» ↔ `law.js` nhân điểm tội 1,5 lần vào ngày xung tuổi | Giữ hệ số vì là luật chơi minh bạch (bảng phán quyết ghi rõ từng hệ số); lời hiển thị không dùng chữ «phạm Thái Tuế nên bị phạt» | Rà chuỗi hiển thị ở §19 |
| MT-3 | «Không chạm y khoa» ↔ sáu bệnh, Y Quán | Bệnh là trạng thái trò chơi theo ngũ hành, tên dân gian, không tên bệnh và thuốc thật; NPC không khuyên chuyện sức khoẻ ngoài đời | Giữ bộ lọc đầu ra ở §21.3.4 |
| MT-4 | «AI chỉ nói, không làm» ↔ NPC có lệnh nghiệp vụ | Sửa câu luật thành LN-06: AI đề xuất, máy chủ quyết | Persona luật 4 cần sửa lời |
| MT-5 | «Không mua bán dịch vụ tâm linh» ↔ thầy mệnh lý người chơi lấy tiền | Cho phép vì trả bằng tiền trong game, có trọng tài, không đổi ra tiền thật; cấm quảng cáo dịch vụ ngoài đời trong lời luận | Thêm một ý vào lớp 0 của trọng tài |
| MT-6 | Đầu đặc tả kinh tế ghi «P3–P21 chưa code» ↔ mã và bảng lộ trình | Theo mã: tất cả đã có | Đã sửa ở chương 03 |
| MT-7 | Tên thành: Huyền Thành, Bát Quái Thành, Thành Bát Quái | «Huyền Thành» là tên; «Bát Quái» chỉ bố cục | Chương 01 |
| MT-8 | Bản tầm nhìn: «VIP không mở sớm bay» ↔ mã: ngự kiếm ở cấp 8 **hoặc** VIP; leo bám chỉ VIP | Giữ theo mã (quyền đã trao); VIP không bỏ qua được đột phá | §11, §18.4.1 |
| MT-9 | Sách persona yêu cầu NPC tín ngưỡng chờ biên bản tham vấn ↔ mã đặt ba thầy trong ba điện và để vài persona tín ngưỡng ở mức được gọi AI | Rà lại từng persona theo LN-11 trước khi bật `personaAi`; trong lúc chờ, các thầy này chỉ nói kịch bản | VC-007 |
| MT-10 | Đặc tả: Guild mỗi phòng một bản ↔ mã: một bản toàn cục | Theo mã (mọi phòng thấy cùng một thành) | §14.2 |
| MT-11 | QĐ-06: deploy phần máy chủ cần chủ dự án cho phép ↔ quy trình tự động deploy mỗi lần nhánh chính nhận commit (bản tầm nhìn cũng nêu, xếp mức nặng nhất) | Coi «đẩy lên nhánh chính» là hành vi deploy: chỉ đẩy khi được phép; hoặc chuyển quy trình sang chạy tay | **Đã giải 16/11:** quy trình CI chỉ chạy tay (`workflow_dispatch`); đẩy lên nhánh chính không còn là deploy. Theo QĐ-06, không cần quyết định mới |
| MT-13 | Bản tầm nhìn: màu áo đồng bộ qua mạng để lộ Dụng thần ↔ thiết kế phẩm phục theo mệnh (§11.2) | Giữ: màu áo là một phần nhận diện của game, không lộ ngày sinh (LN-01) | §11.2, §40.1 |
| MT-12 | Luật 8 của persona và LN-11 (NPC tín ngưỡng chờ biên bản tham vấn mới bật AI) ↔ mã không đọc mức `aiEnabled`; hai persona mức `kichban` đang được nạp vào AI của thầy bói trong game | Thi hành mức `aiEnabled` bằng mã trước (`VC-034`), rồi mới xét từng persona (`VC-007`) | §21.2, §40.3 |

## 2.5 Chờ chủ dự án quyết

| # | Câu hỏi | Vì sao cần | Mặc định nếu chưa quyết |
|---|---|---|---|
| 1 | Duyệt bảy trụ cột §0.3 và mười mâu thuẫn §2.4 | để bộ tài liệu thành chuẩn | dùng bản đề xuất |
| 2 | Ngân sách LLM mỗi tháng (QĐ-05) và ngưỡng cảnh báo | NPC chat và trọng tài đang chạy không trần tiền | giữ hạn mức theo người: 30 câu thường, 10 câu nghiệp vụ mỗi ngày |
| 3 | Có bật `FEATURES.personaAi` và `FEATURES.gamePersona` không | giọng Thầy và thầy bói đổi | **Đã giải 16/11 bằng cổng đánh giá:** `gamePersona` **bật** sau khi cổng đạt (200/200 câu do mô hình thật trả lời (glm-5.3 qua proxy `/zai` của app); P0 100 %, từ chối thừa 0 %, giữ vai 100 %; 2 câu bộ chấm đánh dấu đã được đọc lại và kết luận đạt (`scripts/eval-persona-review.json`)). `personaAi` cho Thầy trang chính **giữ tắt**: trang đó không có lớp làm mềm nhãn mà cổng đã dựa vào (`VC-005`) |
| 4 | Nhà cung cấp SMS và có bật đăng nhập số điện thoại | tốn phí từng tin | giữ tắt |
| 5 | Cổng thanh toán Ngọc trên web | Ngọc hiện không có nguồn nào | chưa bán |
| 6 | Bản iOS: có đưa game vào không, khi nào làm Sign in with Apple | bắt buộc nếu có đăng nhập Google | game chưa vào iOS |
| 7 | Chính sách quyền riêng tư và nhãn kho ứng dụng cho việc gửi tứ trụ (QĐ-07) | điều kiện pháp lý của thầy mệnh lý | tính năng đang chạy trên web |
| 8 | Sửa `package.json` (lệnh test gãy) và đổi 40 chú thích mã | đụng mã | `package.json` **đã sửa 16/11**; 40 chú thích chưa đổi (`VC-003`) |
| 9 | Thu hồi nhà bỏ hoang | rủi ro đã chấp nhận từ 10/11 | không thu hồi |
| 10 | Chế độ nhiều người tại Việt Nam: tắt, phát hành qua đối tác có phép, hay tự xin phép (loại G1) | bản tầm nhìn xếp là rủi ro số một; cần luật sư xác minh | **Phần kỹ thuật xong 16/11:** biến `MMO_BLOCK_COUNTRIES` tắt chế độ nhiều người theo quốc gia, mặc định không chặn ai. Quyết định pháp lý: đặt `VN` vào biến này hay không (`VC-039`) |
| 11 | Món mang hình ảnh thiêng trong Tàng Y Các | lệch luật «hàng bán không mang tên vật thiêng» (§40.3) | **Đã xử lý 16/11** theo yêu cầu «sửa mọi lỗi»: bốn món mở theo cấp, hai tên đổi; giữ nguyên mã món. Chủ dự án vẫn có thể đổi hướng (`VC-036`) |
| 12 | Cho sửa ba lỗi an toàn trong mã | phát hiện khi rà sách NPC-AI | **Đã sửa 16/11** theo yêu cầu «sửa mọi lỗi» (`VC-034`, `VC-035`, `VC-038`) |
| 13 | «Đẩy lên nhánh chính là deploy» (MT-11) | lệch QĐ-06 | **Đã giải 16/11:** deploy chạy tay |

## 2.6 Liên kết

- Việc phát sinh từ các dòng trên: [04-LO-TRINH](04-LO-TRINH.md).
- Lịch sử đầy đủ của từng quyết định: [90-PHA-HE-TAI-LIEU](90-PHA-HE-TAI-LIEU.md).
