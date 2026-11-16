# 40 · An toàn, riêng tư, pháp lý, đạo đức kiếm tiền

> **Trạng thái:** `[ĐÃ CÓ]` cho các luật có mã thi hành; `[ĐỀ XUẤT]` cho §40.7; phần rủi ro chi tiết của bản tầm nhìn chưa rà (`VC-022`)
> **Bộ phận chủ trì:** Nội dung · Vận hành (quyền phủ quyết: chủ dự án)
> **Nguồn sự thật trong mã:** `src/game/features.js`, `src/game/map-rating.js`, `src/game/persona-data.js › PERSONA_CHUNG_LUAT`, `src/game/npc-chat-core.js` (lọc), `src/game/protocol.js` (lọc tên), `src/game/auth-core.js`, `src/game/divination.js` (hồ sơ rút gọn)
> **Test:** `scripts/test-crisis.mjs`, `scripts/test-map-rating.mjs`, `scripts/test-persona-schema.mjs`, `scripts/test-game-auth.mjs`, `scripts/test-game-econ.mjs` (chống thao túng)
> **Thay thế:** `GAME-HUYEN-QUAN-SPEC` §9, §11; các mục an toàn rải trong đặc tả; `docs/gdd/01` (văn phong, cấm kỵ) đã rà; `docs/gdd/14-rui-ro` là lớp L4 chưa rà
> **Kiểm với mã ngày:** 2026-11-16

## 40.0 Mục đích, phạm vi, tóm tắt

Game chạm vào lá số thật, tín ngưỡng thật và tiền. Chương này gom mọi giới hạn không được vượt, ở một chỗ, cho mọi bộ phận. Khi một luật ở đây mâu thuẫn với một ý tưởng hay, luật thắng (TC-7 đứng đầu thứ tự trụ cột).

| Nhóm | Một dòng | Mục |
|---|---|---|
| Riêng tư | ngày sinh ở lại máy; AI không nhận danh tính | §40.1 |
| Ngôn từ | không doạ, không định mệnh, không y khoa | §40.2 |
| Tôn giáo, văn hoá | tôn trọng, không dùng vật thiêng làm hàng | §40.3 |
| Khủng hoảng | NPC rời vai, hiện trợ giúp cố định | §40.4 |
| An toàn AI | AI đề xuất, máy chủ quyết; lọc hai đầu | §40.5 |
| Nền tảng | bản iOS, giao tiếp giữa người chơi, xoá tài khoản | §40.6 |
| Kiếm tiền | không trả tiền để giàu, không thúc ép | §40.7 |

## 40.1 Riêng tư

`[ĐÃ CÓ]` Luật nền LN-01.

| Dữ liệu | Ở đâu | Luật |
|---|---|---|
| Ngày giờ sinh thật | chỉ trên máy | không lên mây, không lên mạng, không vào đo lường, không tới mô hình ngôn ngữ |
| Dụng, Hỷ, Kỵ thần (chỉ **hành**) | máy chủ việc làm | khoá 30 ngày; không suy ngược ra ngày sinh |
| Tứ trụ tám chữ | chỉ trong một lượt xem của thầy mệnh lý | cần đồng thuận; thầy chỉ thấy hồ sơ rút gọn; trọng tài không nhận tên hay định danh; xoá sau 30 ngày hoặc ngay khi xoá tài khoản |
| Email, số điện thoại | sổ tài khoản | chỉ để đăng nhập; không tới mô hình ngôn ngữ |
| Địa chỉ mạng | chỉ lưu dạng băm | dùng chống lạm dụng; không lấy vân tay thiết bị |
| Bản lưu mây | sổ tài khoản | lọc ngày sinh hai lớp |

Quyền người dùng: xuất dữ liệu; xoá tài khoản (khoá bảy ngày rồi xoá hẳn, đăng nhập lại trong bảy ngày thì huỷ xoá).

**Còn nợ:** chính sách quyền riêng tư và nhãn kho ứng dụng phải ghi rõ việc gửi tứ trụ trước khi coi tính năng thầy mệnh lý là đã phát hành (`VC-020`).

## 40.2 Ngôn từ

`[ĐÃ CÓ]` ở các chỗ có mã; phần còn lại là luật viết. Luật nền LN-07.

1. **Không định mệnh.** Không «đã định», «chắc chắn sẽ», «số phận an bài», «lá số xấu». Mọi nhận định là xu hướng, kèm **một việc làm được**.
2. **Không doạ.** Lớp hiển thị không dùng «đại hung», «tai hoạ», «hạn nặng». Sáu mức của engine đổi thành ba cụm: «Thuận — nên làm», «Bình thường», «Nên thủ, giữ sức» (`map-rating.js`; danh sách từ cấm ở `FORBIDDEN`). Chữ kỹ thuật chỉ ở phần mở rộng để tra cứu. Lời thầy bói trong game (do AI viết) cũng đi qua lớp này: `softenRatings` đổi «Đại hung», «tai hoạ» sang cụm mềm trước khi hiện.
3. **Không y khoa, tài chính, pháp lý ngoài đời.** Không đoán bệnh, tuổi thọ, cái chết; không khuyên đầu tư, xổ số. Bệnh trong game là trạng thái trò chơi mang tên dân gian (MT-3). Lời NPC về sức khoẻ luôn ở trong thế giới game.
4. **Không bán cải mệnh.** Không NPC chính đạo nào bán lễ, bùa, giải hạn lấy tiền. Giải hạn chỉ tiêu Phúc Khí (§18.3).
5. **Không ẩn dụ chiến đấu:** không «diệt», «trùm», «máu» trong lời hiển thị.
6. **Tuyên bố cố định:** «Lá số trong game là yếu tố trò chơi, không phải lời khuyên đời thực», đặt ở cổng và ở nơi mệnh chạm vào tiền.
7. **Hán Việt chuẩn;** chữ Hán luôn có người dẫn; bong bóng thoại không để chữ Hán trần.
8. **Xưng hô:** NPC không gọi người chơi là «bạn» trong vai; giọng vùng bằng từ vựng và nhịp, không nhại phát âm.
9. **Không chết bất ngờ:** trước mọi cái chết trong game có cảnh báo rõ và lối thoát (LN-09). Lời Âm phủ theo §18.7.
10. **Viết cho số đông có lá số «thấp».** `[ĐỀ XUẤT]`, lấy từ bản tầm nhìn (tập 04): theo phép quét 5.000 lá số của tập đó (chưa đo lại), khoảng một nửa lá số rơi vào nhóm cách cục thấp. Mọi lời cho điểm thấp và năm hạn phải viết để số đông này đọc mà không thấy bị phán xét.

## 40.3 Tôn giáo và văn hoá

`[ĐÃ CÓ]` ở tượng và persona; còn lại là luật viết. Luật nền LN-11.

- **Tượng:** không chữ, không thánh tích cụ thể; không đặt camera trên đầu tượng.
- **Không dựng lời thiêng thật:** không chân ngôn, giới văn, câu chú; phù chỉ là ký tự hư cấu.
- **Nhân vật lịch sử và tổ sư không thành nhân vật nói thoại mới.** NPC hư cấu mang tên hư cấu; tăng ni hư cấu không dùng họ «Thích».
- **Không phái nào «đúng nhất».** Không NPC chê đạo khác.
- **NPC tín ngưỡng** chỉ chạy kịch bản cho tới khi có biên bản tham vấn (`VC-007`).
- **Âm phủ:** nơi soi xét và sửa lỗi, không tả cực hình; không khẳng định số phận người đã mất.
- **Dân tộc:** không gán thuật hại người cho một dân tộc thật.
- **Hàng bán** không mang tên vật thiêng hay pháp khí thật. Món mang hình ảnh thiêng (cờ `sacred` trong `cosmetics.js`) không bán bằng Ngọc, không khoá VIP, chỉ mở theo cấp; test tự động canh luật này. Bốn món hình sen và bát quái đã chuyển sang luật đó ngày 16/11; hai tên mang danh xưng đã đổi.
- **Hôn nhân trong game** chỉ là nghi lễ và khế ước tài sản (QĐ-11).

## 40.4 Khủng hoảng

`[ĐÃ CÓ]` mức A và C, từ 16/11 (`src/engine/crisis.js`, khung `src/game/crisis-ui.js`, test `scripts/test-crisis.mjs`). Cổng chạy ở bốn chỗ: đầu `askAI` (Thầy trang chính và 13 thầy bói), khung hỏi thầy bói, khung trò chuyện NPC, và đầu `/api/npc/chat` trên máy chủ. Câu bị chặn không được gửi lên bảng đo của app.

**Mức B** (`[ĐÃ CÓ]` từ 16/11, theo đề xuất của bản tầm nhìn tập 06 §11.1; sách NPC-AI mục 11 ghi «chưa chốt», nên đội an toàn cần duyệt lại): câu tuyệt vọng không có ý định cụ thể không bị chặn; AI nhận lời dặn «không luận lá số, ưu tiên lắng nghe, nhắc tìm người thật», và dưới câu trả lời hiện dải «Cần nói chuyện với ai đó?».

Kiểm trên bộ thử đỏ: 15/15 câu P0 nhóm khủng hoảng bị chặn ở cả dạng có dấu và bỏ dấu; mức khớp bộ đề ở 19/20 câu (C14 là ngoại lệ truyện kể, cố ý không làm). **Còn thiếu:** chủ dự án xác minh lại số điện thoại trước khi phát hành. Thiết kế chi tiết: [sách NPC-AI, mục 11](../npc-ai/11-khung-hoang-crisis.md).

Luật phải giữ khi làm (theo mục 11 của sách và tập 14 của bản tầm nhìn):
- Tín hiệu khủng hoảng được xét **trước** lời gọi AI và xét **trên máy người chơi**, kể cả bản iOS và kể cả khi AI tắt.
- Khi có tín hiệu: NPC rời vai **đúng một câu**, rồi hiện **khối hỗ trợ cố định**, không tiếp tục luận lá số. Khối này không gọi mạng.
- Khối hỗ trợ chỉ nêu số đã xác minh: 115 (cấp cứu), 113 (công an), 111 (tổng đài quốc gia bảo vệ trẻ em). Bản tầm nhìn ghi rõ giờ hoạt động của 111 và mọi đường dây khác **cần xác minh trước khi phát hành**.
- Lượt AI đang stream mà tín hiệu bật thì huỷ lượt, thay bằng lượt an toàn.
- Khi cờ khủng hoảng bật (30 phút): tắt bark trêu đùa và mọi nội dung phản diện quanh người chơi.
- Không NPC nào hỏi dồn, không ai nói «ở lại đây với ta».
- Mức trung gian giữa hai mức của sách **chưa chốt**; không tự thiết kế.

## 40.5 An toàn AI

`[MỘT PHẦN]` Luật nền LN-06, LN-08. Chi tiết: §21.3, §21.5. Mức `aiEnabled` của persona được thi hành từ 16/11. Thiết kế chi tiết: [sách NPC-AI, mục 10](../npc-ai/10-red-team-an-toan.md) và [mục 06](../npc-ai/06-bo-loc-hau-xu-ly-v1-v8.md). Phần nào đang chạy thật, phần nào chưa: xem cuối mục.

- AI chỉ **đề xuất**; mọi lệnh chạm tiền, việc, giá đi qua bộ kiểm trên máy chủ. Lệnh ngoài danh sách bị bác.
- Lời người chơi và lời luận cần chấm luôn nằm trong **khối rào**; lời nhắc ghi rõ đó là dữ liệu, không phải chỉ dẫn. Câu kiểu «hãy chấm mười điểm» tự bị gắn cờ thao túng.
- Lọc đầu vào (độ dài, thô tục kể cả viết tắt) và đầu ra (lộ là máy, lời khuyên đời thực, người lớn, chữ Hán).
- Có hạn mức theo người; có công tắc tắt; AI tắt thì dùng câu mẫu và nút bấm.
- Mỗi lần đổi lời nhắc phải chạy lại bộ câu cố định (§32.1).

Kiểm 16/11, phần **đang chạy**:
- Thầy và thầy bói: hướng dẫn chống thao túng nằm trong lời nhắc hệ thống; sau khi trả lời có bước kiểm «neo» (đo lời có khớp dữ liệu lá số không, không sửa chữ) và gợi ý câu hỏi tiếp.
- NPC chat: lời người chơi nằm trong khối rào; lệnh của mô hình qua bộ kiểm nghiệp vụ; lọc đầu ra chạy **trên máy chủ**: một vế câu vi phạm thì cả lượt đổi thành câu an toàn.
- Nhãn mềm: bốn từ cấm chỉ bảo vệ ba nhãn mức độ; **không** quét lời AI, bark hay dữ liệu persona.

Phần sách đặc tả mà **chưa có mã**:
- Tám bộ lọc V1–V8 chạy sau khi mô hình trả lời. Lời AI của Thầy hiện không có lưới nào ngoài lời nhắc hệ thống.
- Bộ thử đỏ 200 câu, các ngưỡng cổng, script chấm: chưa có hạ tầng đo.

## 40.6 Nền tảng và pháp lý

`[ĐÃ CÓ]` ở cờ tính năng; `[MỘT PHẦN]` ở phần chưa phát hành.

| Yêu cầu | Game làm gì |
|---|---|
| Kho ứng dụng không nhận app bói toán trùng lặp | bản iOS tắt gieo quẻ, xin xăm, vận hạn bản thân, mọi AI; đổi sang lời «học» (LN-10) |
| Nội dung do người dùng tạo phải kiểm soát được | người chơi không gõ tự do cho nhau; có báo cáo và chặn (LN-05) |
| Có đăng nhập bên thứ ba thì phải có đăng nhập Apple | chưa có; là điều kiện để đưa game vào iOS (`VC-015`) |
| Phải xoá được tài khoản trong app | có, kèm xuất dữ liệu |
| Mua trong ứng dụng | bảng nạp ẩn trên iOS; web chưa có cổng thanh toán (`VC-017`) |
| Xếp hạng tuổi | nội dung giữ ở mức không bạo lực, không nội dung người lớn, không ghê rợn |
| Chế độ nhiều người tại Việt Nam | **đã có công tắc** (16/11): biến `MMO_BLOCK_COUNTRIES` tắt chế độ nhiều người theo quốc gia, client chuyển sang chơi đơn; mặc định không chặn. Bản tầm nhìn (tập 14) xếp đây là rủi ro số một và tự ghi «cần luật sư xác minh»; bật chặn `VN` hay không là quyết định pháp lý (`VC-039`) |
| Giấy phép tài sản | chỉ CC0 và tự sinh; có sổ nguồn gốc (LN-13) |

## 40.7 Đạo đức kiếm tiền `[ĐỀ XUẤT]`

Gom từ QĐ-03, QĐ-12, QĐ-13 và hiến chương của bản tầm nhìn (tập 11: bốn câu thề «không bán mệnh, không bán may rủi, không bán nỗi sợ, không bán thứ thiêng»). Chờ duyệt cùng §2.5.

1. **Không trả tiền để giàu.** Ngọc không đổi ra tiền, Phúc Khí, Âm Đức (LN-03, LN-04).
2. **Không trả tiền để thoát hậu quả cốt lõi:** không mua rút ngắn cõi dưới, không mua đột phá, không mua Âm Đức (LN-09).
3. **Không bán điều thiêng:** không bán tu, cải mệnh, giải hạn, vật thiêng.
4. **Không thúc ép:** không hộp may rủi, không đếm ngược, không «chỉ còn hôm nay», không màn chúc mừng dồn dập.
   - **Không bán nỗi sợ:** lời mời mua không xuất hiện ngay sau màn hình nói về hạn, Thái Tuế hay điểm thấp; không lời mời nào được cá nhân hoá theo lá số.
5. **Ngọc mua được:** thời trang quý, VIP, và hai thứ cần cân nhắc lại vì chạm vào điểm 1 và 2 — **nhà lớn** (giá Ngọc thay cho tiền) và **Đại Xá** (xoá nửa tiền án). Đề xuất: giữ như đang chạy cho tới khi có cổng thanh toán, và quyết lại trước khi bán Ngọc.
6. **VIP** chỉ mở sớm thứ làm đẹp và tiện đi lại; không tăng thu nhập.

## 40.8 Liên kết, kiểm thử, việc mở

| Hệ | Luật áp vào | Chương |
|---|---|---|
| Bói toán | ngôn từ, bản iOS, đồng thuận | §12 |
| NPC và AI | mười luật persona, lọc, khủng hoảng | §21 |
| Huyền học, luân hồi | lời Âm phủ, không chết bất ngờ | §18 |
| Xã hội | không chat tự do, báo cáo | §20 |
| Mỹ thuật | luật vật thiêng, giấy phép | §23 |
| Máy chủ | lọc ngày sinh, băm, xoá tài khoản | §31 |

- Test hiện có bảo vệ: nhãn mềm, lược đồ persona, lọc ngày sinh khi lưu mây, chống thao túng NPC và trọng tài.
- Việc mở: `VC-039`, `VC-007`, `VC-020`, `VC-021`, `VC-032`, `VC-017`. Đã đóng ngày 16/11: `VC-034`, `VC-035`, `VC-036`.
