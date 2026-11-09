# 14.19 · Tình huống điều hành mẫu — 48 ca xử lý báo cáo, tên, hành vi MMO, phản ánh tôn giáo

> Tài liệu huấn luyện điều hành viên (tập 14.12 §6.6, RISK-151). Mỗi ca: **tình huống → phân loại → xử lý → lý do → lưu ý**. Thang xử phạt: tập 14.12 §6.5 (bậc 1–4).
> Mã ca: `RISK-MODCASE-xx`. Chủ: `TCĐ`; ca có yếu tố tôn giáo duyệt bởi HĐCV; ca trẻ em, khủng hoảng duyệt bởi `TAT`.
> Tên trong ca là ví dụ hư cấu.

---

## 1. Nguyên tắc ra quyết định

1. **An toàn trước, công bằng sau, tiện lợi cuối.** Nghi ngờ dụ dỗ trẻ em hoặc nguy cơ tính mạng → hành động ngay, xét kỹ sau.
2. **Xử lý hành vi, không xử lý niềm tin.** Người chơi theo đạo nào cũng được; tên xúc phạm đạo nào cũng bị xử lý như nhau.
3. **Biện pháp nhẹ nhất đủ hiệu quả.** Đổi tên trước khi khóa.
4. **Ghi lại lý do** bằng câu đầy đủ trong nhật ký admin.
5. **Không tranh luận giáo lý** với người chơi; ca khó chuyển HĐCV.
6. **Không xem dữ liệu không cần.** Điều hành viên không có quyền và không cần xem ngày sinh, lá số (máy chủ không có).

---

## 2. Tên và danh hiệu

| Mã | Tình huống | Phân loại | Xử lý | Lý do / lưu ý |
|---|---|---|---|---|
| MODCASE-01 | Tên «ĐứcPhậtTáiThế» | F4 danh xưng thiêng | Bậc 1: đổi tên «Khách», thông báo «Tên dùng danh xưng thiêng» | Bộ lọc lẽ ra phải chặn → thêm biến thể viết liền vào `name-filter.json` |
| MODCASE-02 | Tên «Thích Tâm An» | F4 giống pháp danh | Bậc 1 | Dù có thể là tên thật; gợi ý người chơi đổi «Tâm An» |
| MODCASE-03 | Tên «Tâm An Thích Trà» | Hợp lệ | Đóng báo cáo | «Thích» không đứng đầu (RISK-MOD-12) |
| MODCASE-04 | Tên «Thầy Hưng giải hạn» | F8 dịch vụ tâm linh | Bậc 3 (quảng cáo dịch vụ) | Kiểm thêm có số điện thoại ẩn trong danh hiệu không |
| MODCASE-05 | Tên «khongchin.bay.tam…» (số viết bằng chữ) | F7 liên hệ | Bậc 3 | Thêm mẫu vào bộ lọc |
| MODCASE-06 | Tên «Admin Huyền Quán» | F9 mạo danh nhân viên | Bậc 2 | Nhân viên thật có huy hiệu riêng, không dùng tên |
| MODCASE-07 | Tên chế giễu một dân tộc | F3 | Bậc 2 | Lần hai → bậc 3 |
| MODCASE-08 | Tên chế giễu vùng miền | F3 | Bậc 1 lần đầu | |
| MODCASE-09 | Tên tục tĩu viết lách «đ.m.a.y» | F1 | Bậc 1 | Kiểm chuẩn hóa ký tự chen |
| MODCASE-10 | Tên «Pháp Luân Đại Pháp» | F6 chính trị – tôn giáo | Bậc 2 | Không bình luận nội dung với người chơi |
| MODCASE-11 | Tên trùng NPC «Vân Cốc» | F5 | Bậc 1 | Gây nhầm với NPC |
| MODCASE-12 | Tên một ca sĩ nổi tiếng | Không thuộc nhóm cấm | Đóng báo cáo nếu không có dấu hiệu mạo danh lừa đảo | Mạo danh người nổi tiếng chỉ xử lý khi gây nhầm lẫn có hại |
| MODCASE-13 | Danh hiệu lạ không có trong danh mục (client sửa đổi) | RISK-122 | Máy chủ đã phải loại; nếu lọt: bậc 2 + báo `TMC` lỗi | Bằng chứng gian lận phần mềm |
| MODCASE-14 | Tên là tên thật đầy đủ của một người khác kèm lời chê | Quấy rối | Bậc 2; nếu người bị nêu tên báo cáo → bậc 3 | Bảo vệ người ngoài game |

---

## 3. Hành vi trong MMO

| Mã | Tình huống | Phân loại | Xử lý | Lý do / lưu ý |
|---|---|---|---|---|
| MODCASE-15 | Một người spam emote «vỗ tay» liên tục trước mặt người khác | Spam | Nhắc (thông báo hệ thống); lặp lại → bậc 2 | `rateGate` đã giới hạn tốc độ; đây là phiền nhiễu xã hội |
| MODCASE-16 | Một người đứng chắn cửa Chính Điện | Phiền nhiễu | Nhắc; lặp lại → bậc 2 | Đề xuất kỹ thuật: người chơi không chặn va chạm nhau ở cửa |
| MODCASE-17 | Một người đi theo một người khác khắp bản đồ sau khi bị ẩn | Bám theo | Bậc 2; lặp → bậc 3 | Người bị theo không thấy (đã ẩn) nhưng người thứ ba báo cáo |
| MODCASE-18 | Một nhóm dùng cụm «Chờ mình chút» + emote tạo thành chuỗi chế giễu một người | Quấy rối có tổ chức | Bậc 2 cho từng người | Xem lại thư viện cụm từ có tổ hợp xấu không (tập 14.12 §6.8) |
| MODCASE-19 | Một người chiếm chỗ bồ đoàn Trà Thất cả ngày (treo máy) | Treo máy | Không phạt; đề xuất kỹ thuật tự đứng dậy sau 15 phút không thao tác | Không phải vi phạm nội quy |
| MODCASE-20 | Hai người cãi nhau bằng emote trong điện thờ | Bất kính nơi thờ | Nhắc cả hai | Trong vùng thiêng chỉ có `bow`, `palm` — nếu có emote khác, báo lỗi kỹ thuật |
| MODCASE-21 | Người chơi bay ngự kiếm lên mái điện (lỗi vùng thiêng) | Lỗi kỹ thuật | Không phạt người chơi; báo `QA`, `TMC` (RISK-003) | Chụp ảnh vị trí |
| MODCASE-22 | Người chơi lợi dụng lỗi để vào vùng chưa mở | Khai thác lỗi | Nhắc; nếu có lợi ích kinh tế → bậc 2 | |

---

## 4. Trẻ em, dụ dỗ, an toàn

| Mã | Tình huống | Phân loại | Xử lý | Lý do / lưu ý |
|---|---|---|---|---|
| MODCASE-23 | Báo cáo `groom`: người lớn liên tục mời một tài khoản trẻ giải án chung, mời trà, theo sau | Nghi dụ dỗ | Ưu tiên khẩn; tạm ngắt MMO người bị báo trong khi xét; xem lịch sử báo cáo | RISK-145, RISK-MOD-23 |
| MODCASE-24 | Tên chứa «inbox mình nhé» | F7 + nghi dụ dỗ | Bậc 3 | Kiểm thêm báo cáo cũ |
| MODCASE-25 | ≥ 2 người khác nhau báo `groom` cùng đối tượng trong 24 giờ | Nghi dụ dỗ nghiêm trọng | Tạm ngắt tự động (đã có); TCĐ + TAT xét trong 4 giờ; nếu xác định → bậc 4, lưu bằng chứng, PC xem nghĩa vụ báo cơ quan | |
| MODCASE-26 | Báo cáo `other` với nội dung gợi ý người báo đang muốn tự hại (trong ô ghi chú báo cáo nếu có) | Khủng hoảng | Chuyển TAT ngay; không phản hồi bằng mẫu điều hành thông thường | Hệ thống báo cáo hiện không có ô văn bản; ca này áp khi có kênh email |
| MODCASE-27 | Email hỗ trợ của một em nhỏ kể bị bắt nạt ở trường | Trẻ em, không vi phạm trong game | Trả lời bằng mẫu trẻ em (111), khuyến khích nói với người lớn tin cậy | Tập 14.09 §4.4 |
| MODCASE-28 | Phụ huynh email yêu cầu xóa dữ liệu của con | Quyền dữ liệu | Xác minh tối thiểu (mã `pid` do con cung cấp), xóa máy chủ, xác nhận | Tập 14.12 RISK-PV-54 |

---

## 5. Lừa đảo, dịch vụ tâm linh

| Mã | Tình huống | Phân loại | Xử lý | Lý do / lưu ý |
|---|---|---|---|---|
| MODCASE-29 | Người chơi dùng tên + danh hiệu để gợi ý «xem số thật, liên hệ ngoài» | `scam` | Bậc 3 | RISK-147 |
| MODCASE-30 | Nhóm ngoài game (Facebook) mạo danh «Huyền Quán chính thức» bán bùa | Ngoài game | TT báo cáo nền tảng; đăng cảnh báo trên kênh chính thức | RISK-148, RISK-172 |
| MODCASE-31 | Người chơi báo một người khác «nói em bị ma theo» (qua cụm từ không thể; có thể qua tên) | Kiểm tra tên | Nếu tên chứa thông điệp → bậc 2 | |
| MODCASE-32 | Người dùng báo một streamer dùng game để quảng cáo «giải hạn online» | Ngoài game | TT liên hệ yêu cầu gỡ dùng thương hiệu; tuyên bố nếu lan rộng | RISK-172 |

---

## 6. Tôn giáo, văn hóa

| Mã | Tình huống | Phân loại | Xử lý | Lý do / lưu ý |
|---|---|---|---|---|
| MODCASE-33 | Email của một nhà sư phản ánh vật phẩm «sen dưới chân» | Phản ánh tôn giáo | Phản hồi trong 72 giờ theo mẫu tập 14.04 §6.3; chuyển HĐCV; nếu món chưa gỡ → gỡ (RISK-001) | Cảm ơn, không tranh luận |
| MODCASE-34 | Người chơi phản ánh «Phong Đô làm con tôi sợ» | Nội dung + trẻ em | Cảm ơn; kiểm cổng tuổi có hoạt động không; hướng dẫn phụ huynh cài đặt | RISK-021, RISK-040 |
| MODCASE-35 | Người chơi theo đạo Công giáo phản ánh game «truyền đạo Phật, Đạo» | Phản ánh quan điểm | Giải thích game trình bày văn hóa, không yêu cầu người chơi tin; tôn trọng | Không tranh luận; ghi nhận cho RISK-028 |
| MODCASE-36 | Người chơi phản ánh Khổng tiên sinh «chế giễu Khổng Tử» | Hiểu nhầm | Giải thích nguồn Liễu Phàm; ghi nhận số lần cho RISK-011 | Nếu nhiều → thêm phụ đề |
| MODCASE-37 | Hội nghề mộc phản ánh «Yểm sư Lỗ Ban» | Phản ánh văn hóa | Ưu tiên cao; GĐSX + TND trả lời; kiểm tên hiển thị đã là «Công Thâu Nghiệt» chưa (RISK-010) | |
| MODCASE-38 | Người H'Mông phản ánh vùng Miêu Cương | Phản ánh tộc người | Ưu tiên cao; chuyển HĐCV Tộc người; cân nhắc tạm đóng vùng (RISK-012 dự phòng) | |
| MODCASE-39 | Thanh đồng phản ánh cảnh điện Mẫu sai thứ tự | Sai nội dung | Cảm ơn; chuyển HĐCV; sửa | |
| MODCASE-40 | Người chơi hỏi «tại sao không có đạo Cao Đài, Hòa Hảo, Công giáo» | Câu hỏi | Trả lời: game hiện chỉ trình bày một số truyền thống liên quan cổ học; mọi truyền thống mới phải qua quy trình cố vấn đầy đủ | Không hứa thêm |

---

## 7. AI

| Mã | Tình huống | Phân loại | Xử lý | Lý do / lưu ý |
|---|---|---|---|---|
| MODCASE-41 | Báo cáo câu trả lời AI: NPC nói «năm 45 tuổi con gặp nạn» | SEV2 (hoặc SEV1 nếu khẳng định chết) | Chuyển TAI; tập 14.10 §7 | Không xin lỗi bằng lời đổ cho «AI tự nói» |
| MODCASE-42 | Báo cáo AI: Vu y kể chi tiết làm bùa | SEV1 | Tắt persona ngay; TAI | RISK-053 |
| MODCASE-43 | Người chơi báo «Thầy nói sai Dụng thần» | SEV3 | TAI đối chiếu checkNeo; trả lời người chơi cảm ơn | |
| MODCASE-44 | Ảnh chụp AI tồi tệ lan trên mạng, không có báo cáo trong game | Có thể giả | TAI kiểm mã phiên mờ trên ảnh (RISK-169); TT theo mẫu §6.2 tập 14.04 | |

---

## 8. Kháng nghị và trường hợp đặc biệt

| Mã | Tình huống | Xử lý |
|---|---|---|
| MODCASE-45 | Người chơi kháng nghị bị đổi tên «Thích Gia» (là họ tên thật) | Người xét khác người xử lý; nếu hợp lý → thêm `allowlist` kèm lý do, khôi phục tên |
| MODCASE-46 | Người chơi bị bậc 4 tạo `pid` mới quay lại | Ở P0 không ngăn được tuyệt đối; xử lý lại khi tái phạm; P1–P2 chặn theo tài khoản (RISK-152) |
| MODCASE-47 | Cơ quan chức năng yêu cầu thông tin một người chơi | Chuyển PC ngay; không tự cung cấp; xác minh yêu cầu (RISK-LG-22) |
| MODCASE-48 | Một người chơi nổi tiếng yêu cầu được đặt tên có chữ «Admin» vì là «người hỗ trợ cộng đồng» | Từ chối; nhân viên thật có huy hiệu hệ thống |

---

## 9. Mẫu thông báo xử lý (gửi người bị xử lý)

| Bậc | Văn bản |
|---|---|
| 1 | «Tên nhân vật của bạn đã được đổi thành "Khách" vì [lý do ngắn]. Bạn có thể chọn tên mới trong Sổ Mệnh. Nội quy: [Nội quy Sơn Môn].» |
| 2 | «Bạn tạm không chơi cùng người khác trong 24 giờ vì [lý do]. Bạn vẫn chơi một mình được. Nếu bạn cho rằng có nhầm lẫn, hãy gửi kháng nghị tới [email] trong 14 ngày.» |
| 3 | «Bạn tạm không chơi cùng người khác trong 7 ngày vì [lý do]. …» |
| 4 | «Bạn không thể chơi cùng người khác nữa vì [lý do]. Tiến độ chơi một mình của bạn được giữ nguyên. Kháng nghị: [email], trong 14 ngày.» |

| Mã | Quy tắc |
|---|---|
| RISK-MODCASE-R1 | Không nêu tên người báo cáo. |
| RISK-MODCASE-R2 | Lý do viết theo nhóm (vd «tên dùng danh xưng tôn giáo»), không nhắc lại nguyên văn từ xúc phạm. |
| RISK-MODCASE-R3 | Không dùng giọng NPC trong thông báo xử lý (tách vai trò hệ thống khỏi thế giới truyện). |

---

## 10. Bài kiểm tra cho điều hành viên mới

Điều hành viên mới làm 20 ca chọn ngẫu nhiên từ §2–§8 (giấu cột xử lý), đạt ≥ 18/20 và **100%** các ca nhóm §4 (trẻ em, an toàn) mới được xử lý báo cáo thật. Ca sai được TCĐ giải thích lại; làm lại sau 7 ngày.
