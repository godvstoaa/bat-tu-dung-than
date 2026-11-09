# 02 · Phần 06 — Phe phái của Huyền Giới (FAC-001 → FAC-032)

> 32 phe. Mỗi phe có: thẻ, mục tiêu, cơ cấu, phương pháp, quan hệ, thái độ với người chơi, câu nói đặc trưng, móc nối.
> **Phe = tổ chức trong thế giới**, không đồng nghĩa với «môn phái người chơi gia nhập» (tài liệu 10 cấp `GUILD-*`). Mười hai đạo thống trong phe là bản Huyền Giới của 12 trường phái trong `schools-data › SCHOOLS`, cộng các cộng đồng Phật giáo, Nho, và phe dân sự.
> NPC phụ mới nêu tên trong phần này là **[HƯ CẤU]**; mã `NPC-*` do tài liệu 06 cấp.

## 6.0 Thang thiện cảm (dùng chung cho mọi phe)

| Bậc | Tên | Phe đối xử thế nào | Mở gì (khung — tài liệu 10 định số) |
|---|---|---|---|
| −2 | **Nghi ngại** | Tránh nói chuyện, không giao việc | — (chỉ xảy ra với vài phe, xem từng phe) |
| −1 | **Dè dặt** | Trả lời ngắn, không mời vào nội viện | — |
| 0 | **Lạ** | Lịch sự, chỉ đường | nhiệm vụ phụ cơ bản |
| 1 | **Quen** | Mời trà, kể chuyện vùng | codex vùng, mua đặc sản |
| 2 | **Tin** | Giao việc quan trọng, mở nội viện | chuỗi `CQ-*` đạo thống (tài liệu 05) |
| 3 | **Thân** | Gọi bằng đạo hiệu, mời dự lễ riêng | lễ riêng, vật phẩm trang trí |
| 4 | **Đồng Đạo** | Coi như người trong phái | gia nhập, nhận đệ tử (cảnh giới ≥ 4) |

Quy tắc: thiện cảm tăng bằng **việc làm** (giúp người, giữ giới của phe, vạch trần lừa đảo), **không** tăng bằng Ngọc. Một số hành động làm tăng phe này giảm phe kia (xem ma trận 6.6).

---

## 6.1 Trung tâm và nghề mệnh học

### FAC-001 · Huyền Quán Sơn Môn & Hội Đồng Tam Tài 玄觀山門

| Mục | Giá trị |
|---|---|
| Loại | Học phái mệnh học + cơ quan hòa giải chung của Huyền Giới |
| Trụ sở | Huyền Thành (Sơn Môn, Bàn Đài); chi nhánh Tử Bình Phong, Trích Thiên Đỉnh, Cùng Thông Hồ |
| Nguồn app | `chart.js › analyze()`, các sảnh `HALLS`, `court.js`, `sect.js` |
| Đứng đầu | Thầy Tử Bình (`thay_tubinh`) — chủ Bàn Thầy; Hội Đồng Tam Tài gồm 9 ghế (3 Thiên — đại diện đạo thống; 3 Địa — đại diện vùng; 3 Nhân — dân cử) |
| Quy mô lore | ~400 thầy và đệ tử; Hội Đồng 9 người |
| Màu · biểu tượng | vàng đất và đen mực; ba vòng một lõi |

- **Mục tiêu:** đọc lá số để **giúp người hiểu mình**, giữ hương ước «nói xu hướng, không phán tất định; chỉ việc thiện, không bán lễ» (HIS-062); sau Bàn nứt: **lấy lại niềm tin** và hàn Bàn «bằng người» (HIS-099).
- **Cơ cấu:** Đệ tử (3 năm) → Thầy sảnh (qua khảo một sảnh) → Thầy Bàn (qua khảo ba sảnh) → Trưởng sảnh → Chủ Bàn Thầy. Hội Đồng Tam Tài là cơ quan riêng, Sơn Môn chỉ giữ chức chủ trì.
- **Phương pháp:** Sáu nguyên tắc **Sơn Môn Lục Chính** — bản Huyền Giới của `anti-manipulation-data › GROUNDING_RULES` (GR1–GR6):
  1. **Luận có gốc** — mọi kết luận chỉ về một chỉ số có tên trong lá số (GR1).
  2. **Nói lại cho đúng** — khách nói sai về lá số thì thầy nói lại chỉ số thật trước khi luận (GR2).
  3. **Thương chuyện, giữ số** — nghe chuyện khách bằng một câu thấu cảm rồi quay về lá số (GR3).
  4. **Hai nguồn mới chắc** — kết luận quan trọng phải có ít nhất hai chỉ số cùng chiều (GR4).
  5. **Thấy trái thì nói** — chỗ mâu thuẫn phải nói ra, không lấp (GR5).
  6. **Không mượn lời người ngoài** — lời thầy khác, lời đồn không phải dữ liệu của lá số này (GR6).
- **Quan hệ:** liên minh với hầu hết đạo thống; căng thẳng với Định Mệnh Hội (FAC-018); tôn trọng nhưng bất đồng với Khổng tiên sinh (độc lập).
- **Thái độ với người chơi:** bắt đầu ở **Quen** (người chơi là đệ tử mới). Tăng khi giải lá số đúng cổ pháp, giải án 6 bước (`cases.js`), dẫn khách khỏi quầy Đổi Mệnh. Giảm khi người chơi phán tất định với NPC khách (có lựa chọn thoại như vậy — để thử).
- **Câu nói đặc trưng:** «Lá số là cái khung. Con là người viết chữ.»
- **Móc nối:** toàn bộ `MQ-*`; 8 sảnh nghề; Thiên Bảng.

### FAC-022 · Hội Chiêm Gia 占家會 (hội thầy bói chính danh)

| Mục | Giá trị |
|---|---|
| Loại | Phường hội nghề xem bói ở chợ |
| Trụ sở | dãy sạp chợ Trung Tâm Huyền Thành; có thành viên ở mọi chợ |
| Đứng đầu | Hội trưởng **Bà Nhàn Gieo Quẻ** [HƯ CẤU] — thầy gieo quẻ đồng tiền lâu năm |
| Quy mô lore | ~300 thành viên (sau chia rẽ: ~180 chính danh, ~120 «treo bảng giả») |
| Biểu tượng | bảng gỗ **Thập Giới** treo trước sạp |

- **Mục tiêu:** giữ nghề xem bói **có đạo đức**, kiếm sống lương thiện, không để nghề bị Định Mệnh Hội làm ô danh.
- **Thập Giới Thầy Bói** (HIS-074) — bản dân gian của `refusalBoundaries` + `DETECTION_PATTERNS`:

| Giới | Lời giới | Ánh xạ app |
|---|---|---|
| 1 | Không phán chết, không phán bệnh nan y | RB1 |
| 2 | Không nói «số đã định, không đổi được» | RB2, DP6 |
| 3 | Không xem để hại người vắng mặt | RB3, DP7 |
| 4 | Không hứa giàu chắc, không xui cờ bạc | RB4 |
| 5 | Không bán lễ đổi mệnh, không bán bùa giải hạn | RB5 |
| 6 | Không gài câu hỏi để khách tự nói ra điều mình muốn nghe | DP1 |
| 7 | Không nhận lời khách về lá số khi chưa kiểm | DP2 |
| 8 | Không chiều theo nước mắt mà nói sai số | DP3 |
| 9 | Không lấy lời «thầy khác bảo» làm căn cứ | DP4 |
| 10 | Không gật đầu cho vừa lòng khách | DP5 |

- **Cơ cấu:** Thành viên mới (treo bảng một năm) → Thành viên chính → Trưởng sạp (dạy học trò) → Hội trưởng.
- **Phương pháp:** gieo quẻ, xin xăm, xem tay — theo lối dân gian; **gửi khách sang Sơn Môn** khi việc vượt khả năng.
- **Quan hệ:** thân Sơn Môn; **thù đối** với Định Mệnh Hội; nội bộ chia rẽ (HIS-083).
- **Thái độ với người chơi:** **Lạ**. Tăng khi người chơi phân biệt đúng sạp thật – sạp giả (cơ chế Kính Chiếu Gian, không dựa vào bảng treo).
- **Câu nói:** «Quẻ chỉ nói gió đang thổi hướng nào. Giương buồm là việc của khách.»
- **Móc nối:** xin xăm, gieo quẻ (web có, iOS tắt); `SQ-thanh-xx`.

### FAC-027 · Manh Phái 盲派 (thầy mù Manh Phái Cốc)

| Mục | Giá trị |
|---|---|
| Loại | Học phái mệnh học khẩu truyền |
| Trụ sở | Manh Phái Cốc |
| Nguồn app | `bitruyen-data › 盲派口诀`; Sảnh Tượng Pháp |
| Đứng đầu | **Lão Mù Thính Phong** [HƯ CẤU] — người giữ khẩu quyết già nhất |
| Quy mô lore | ~80 thầy mù, ~40 người dẫn đường |

- **Mục tiêu:** giữ khẩu quyết, đọc lá số bằng **tượng**; chứng minh «không cần sách vẫn đọc được người».
- **Cơ cấu:** Đệ tử (học thuộc theo mõ) → Thầy (được phép đọc cho khách) → Lão (giữ khẩu quyết bí truyền). Mỗi thầy có một **người dẫn** sáng mắt, quan hệ như người nhà.
- **Phương pháp:** hỏi lâu, nghe kỹ, nói bằng hình ảnh.
- **Quan hệ:** tôn trọng Sơn Môn nhưng giữ độc lập; **ác cảm với Khổng tiên sinh** (lối phán nhanh); kỵ Định Mệnh Hội (từng có người dẫn bị mua chuộc để «nghe trộm» khách).
- **Thái độ với người chơi:** **Lạ**; tăng khi người chơi **kiên nhẫn** (nghe hết thoại, không bấm bỏ qua — tài liệu 12 có thể đo).
- **Câu nói:** «Mắt thầy không thấy. Nên thầy phải hỏi con thật lâu.»

### FAC-028 · Lịch Đường 曆堂 (Lịch Quan)

| Mục | Giá trị |
|---|---|
| Loại | Nha lịch dân sự |
| Trụ sở | Lịch Đường (Khuê Biểu, kho lịch) |
| Nguồn app | lịch tiết khí, `lunar-javascript`, Sảnh Trạch Nhật |
| Đứng đầu | **Lịch Chính Hoàng Khuê** [HƯ CẤU] — người viết «Lịch Quan bút ký» (HIS-088) |
| Quy mô lore | ~60 lịch quan, ~200 thợ in |

- **Mục tiêu:** đo trời, in lịch đúng, phát lịch **miễn phí**; chọn ngày cho dân không dọa.
- **Phương pháp:** đo bóng, tính tiết khí, chọn ngày theo việc (không có «ngày xấu cho mọi người»).
- **Quan hệ:** liên minh Sơn Môn; đối tác Thư Lâu; **đối đầu trực tiếp** Định Mệnh Hội (lịch giả, quầy Đổi Mệnh đầu tiên ở chợ Lịch Đường).
- **Thái độ với người chơi:** **Lạ**; tăng khi người chơi thu hồi lịch giả, chọn ngày cho khách hợp lý.
- **Câu nói:** «Trời không sai. Lịch sai thì do người in.»

### FAC-029 · Thư Lâu 書樓 (Thủ Thư)

| Mục | Giá trị |
|---|---|
| Loại | Thư viện chung |
| Trụ sở | Thư Lâu Lâm (Thư Lâu, Văn Xương Các) |
| Nguồn app | `library-data › LIBRARY` (Đạo Tạng, phù, chú, nghi, công pháp, phương thuật, bí truyền, kinh điển Bát Tự) |
| Đứng đầu | **Thủ Thư Trưởng Mặc Lan** [HƯ CẤU] |
| Quy mô lore | ~50 thủ thư, ~300 người làng giấy mực |

- **Mục tiêu:** giữ, chép, cho mượn sách; **ghi trung thực** mức độ tin cậy của văn bản (sử / truyền / thoại; đầy đủ / tàn quyển).
- **Cơ cấu:** Người chép → Thủ thư tầng → Thủ thư trưởng. **Tầng Pháp** và **tầng Bí Truyền** có quy tắc riêng: phần nghi quỹ chỉ người được thụ lục đọc (khớp `ETHICS`).
- **Quan hệ:** trung lập với mọi đạo thống, cho tất cả mượn sách; bị Định Mệnh Hội cài người đánh cắp bản dập Bàn Minh (HIS-093).
- **Thái độ với người chơi:** **Lạ**; tăng khi chép kinh trả (tục «đọc nhờ chép trả»), trả sách đúng hạn, tìm lại bản dập.
- **Câu nói:** «Sách không có lỗi. Người đọc thiếu một nửa thì sách thành sai.»

### FAC-030 · Phong Thủy Viên 風水園 (Địa Sư)

| Mục | Giá trị |
|---|---|
| Loại | Học phái địa lý |
| Trụ sở | Phong Thủy Viên |
| Nguồn app | Sảnh Dương Trạch; `fs-cure › SHA_LIST`; cổ thư kham dư trong `daozang-data` (topic 堪舆) |
| Đứng đầu | **Địa sư Lục Phương** [HƯ CẤU] |
| Quy mô lore | ~70 địa sư, ~150 thợ la bàn |

- **Mục tiêu:** dạy xem đất **thực tế** (hình trước, khí sau), sửa la bàn miễn phí, chống la bàn giả.
- **Quan hệ:** liên minh Sơn Môn, Mao Sơn (gửi ca «nhà không yên»), Long Hổ; đối đầu Định Mệnh Hội (HIS-084).
- **Thái độ với người chơi:** **Lạ**; tăng khi giải án Dương Trạch đúng, so kim la bàn.
- **Câu nói:** «Hỏi xem buổi chiều nắng có rọi vào giường không đã.»

---

## 6.2 Mười hai đạo thống Đạo giáo (bản Huyền Giới của `schools-data`)

> Mỗi đạo thống ở Huyền Giới **tiếp nhận** giáo pháp của trường phái thật qua Đăng Lộ (01 › 1.0). Bảng «Nhân Gian» trích từ `schools-data` để đối chiếu; phần «Huyền Giới» là hư cấu.

### FAC-002 · Chính Nhất · Thiên Sư Phủ Huyền Giới 正一

| Mục | Nhân Gian (`schools-data › zhengyi`) | Huyền Giới |
|---|---|---|
| Tổ / nguồn | Trương Đạo Lăng, Đông Hán | Long Hổ Khai Sơn [HƯ CẤU] (HIS-025) |
| Trụ sở | Long Hổ Sơn, Giang Tây | Long Hổ Sơn (1500, −200) |
| Pháp | phù lục, bái Đẩu, giải ách, trai tiếu | kết phù (ký tự hư cấu), thụ lục, bái Đẩu, trai tiếu |
| Xuất gia | đạo sĩ hỏa cư (có gia đình) | như vậy |
| Đứng đầu | — | Trương Thiên Sư (`truong_thiensu`) |

- **Mục tiêu:** giữ khoa nghi chính thống; dạy đạo dân sống thiện; **cấm phù bán** (HIS-095).
- **Cơ cấu:** Đạo dân (ghi sổ) → Lục sinh (thụ lục cấp đầu) → Đạo sĩ thụ lục các cấp → Pháp sư chủ đàn → Thiên Sư.
- **Quan hệ:** thân Thần Tiêu (cùng núi), Linh Bảo (khoa nghi), Sơn Môn; hợp tác Mao Sơn (trừ tà); bất bình Định Mệnh Hội (bị mạo danh «phù Long Hổ»).
- **Thái độ:** **Lạ**; tăng khi giải án «nhà không yên» theo thứ tự phong thủy → phù; giảm nếu người chơi mua phù giả ở chợ rồi mang về phủ «nhờ khai quang» (phủ từ chối, giải thích).
- **Câu nói:** «Phù là lời hứa với trời, không phải tờ giấy mua bán.»

### FAC-003 · Thần Tiêu Lôi Viện 神霄雷院

| Mục | Nhân Gian (`shenxiao`) | Huyền Giới |
|---|---|---|
| Tổ | Vương Văn Khanh (1083–1153), Lâm Linh Tố | — (lập sau điềm sét, HIS-045) |
| Pháp | Ngũ Lôi chính pháp; nội đan làm thể | **Nghe sấm, tĩnh tọa trong giông** — lôi pháp trong game là nghi lễ và tu tâm, **không phải phép tấn công** |
| Đứng đầu | — | **Lôi Viện chủ Tiêu Đình** [HƯ CẤU] |

- **Mục tiêu:** hiểu «sấm đánh để thức chứ không để hủy»; giữ đài nghe sấm, báo trước giông cho Xóm Bè.
- **Quan hệ:** thuộc Long Hổ; thân Lịch Đường (cùng lễ Nghe Sấm); tôn trọng Thanh Vi (cùng truyền lôi pháp).
- **Thái độ:** **Lạ**; tăng khi người chơi giúp báo giông, ngồi tĩnh tọa đủ một trận giông.
- **Câu nói:** «Sấm không giận ai. Sấm chỉ gọi người đang ngủ dậy.»

### FAC-004 · Thanh Vi · Võ Đang 清微

| Mục | Nhân Gian (`qingwei`) | Huyền Giới |
|---|---|---|
| Pháp | lôi pháp «nội đan làm thể, phù chú làm dụng» | tĩnh tọa theo hơi thở, Thái Cực, nội đan 4 bậc (biểu tượng) |
| Trụ sở | Võ Đương Sơn | Võ Đang Huyền Nhạc (Tử Tiêu cung) |
| Đứng đầu | — | Huyền Hư chân nhân (`huyen_hu`) |

- **Mục tiêu:** dạy tĩnh tâm qua hơi thở; giữ Kim Điện của trăm làng.
- **Cơ cấu:** Khách tập (sân Tử Tiêu) → Đệ tử ngoại → Đệ tử nội (ở cung) → Chân nhân.
- **Quan hệ:** chung núi với Đan Đỉnh (bổ sung nhau); thân Toàn Chân (cùng nội đan); thân Thư Lâu.
- **Thái độ:** **Lạ**; tăng khi leo thần đạo bằng chân, tập Thái Cực sớm, giúp người khuân vác.
- **Câu nói:** «Thở ra dài hơn hít vào.»

### FAC-005 · Đan Đỉnh · Lò Đan Võ Đang 丹鼎

| Mục | Nhân Gian (`danding`) | Huyền Giới |
|---|---|---|
| Pháp | nội đan, ngoại đan, dưỡng sinh | **chỉ dưỡng sinh và nội luyện biểu tượng**; ngoại đan bị cấm sau HIS-028 |
| Kinh | *Tham Đồng Khế*, *Ngộ Chân Thiên*, *Bão Phác Tử* | như vậy (đọc ở Thư Lâu) |
| Đứng đầu | — | Đan Đỉnh chân nhân Cát Huyền (`dan_dinh`) — dẫn lộ «Đắc Cứu» |

- **Mục tiêu:** nấu món dưỡng sinh theo ngũ hành cho người; giữ «Lò Tam Bệnh» niêm phong làm bài học.
- **Quan hệ:** thân Vu y Miêu Cương (cùng thảo dược), Dược Bang; thân Thanh Vi.
- **Thái độ:** **Lạ**; tăng khi hái thảo dược đúng mùa, không hái linh chi (tài sản chung).
- **Câu nói:** «Đường tắt thường là đường vòng.»

### FAC-006 · Toàn Chân · Trùng Dương Cung 全真

| Mục | Nhân Gian (`quanzhen`) | Huyền Giới |
|---|---|---|
| Tổ | Vương Trùng Dương (1113–1170) | Bảy người lập cung (HIS-048) |
| Pháp | nội đan, tảo vãn công khóa, tĩnh tọa; tam giáo hợp nhất | như vậy; vân thủy du phương |
| Xuất gia | xuất gia, trì giới, chay | như vậy |
| Đứng đầu | — | Khâu đạo trưởng (`khau_daotruong`) |

- **Mục tiêu:** giữ giới, nuôi vân thủy đường, đưa tin và giúp người khắp đại lục qua đạo sĩ du phương.
- **Cơ cấu:** Khách vân thủy → Sơ chân giới → Trung cực giới → Thiên tiên giới (Tam Đàn Đại Giới, LORE-144) → Đạo trưởng.
- **Quan hệ:** thân Linh Bảo (đạo đàn chung thung lũng), Thanh Vi; tôn trọng Thiền Trúc Lâm (tam giáo hợp nhất).
- **Thái độ:** **Lạ**; tăng khi giữ giới trong thử thách (ăn chay, giữ khẩu), nhận việc vân thủy.
- **Câu nói:** «Ăn hết bát. Nói sau.»

### FAC-007 · Linh Bảo · Đạo Đàn Chung Nam 靈寶

| Mục | Nhân Gian (`lingbao`) | Huyền Giới |
|---|---|---|
| Pháp | khoa nghi trai tiếu; *Độ Nhân Kinh* | khoa nghi tế độ, trình tự nghi lễ chuẩn |
| Đứng đầu | — | **Pháp sư Kinh Diễn** [HƯ CẤU] |

- **Mục tiêu:** chuẩn hóa nghi lễ cho mọi đạo quán; dạy rằng nghi lễ là **trình tự của lòng thành**, không phải phép đổi số.
- **Quan hệ:** phục vụ khoa nghi cho Chính Nhất, Toàn Chân; thân Phong Đô (lễ tế độ Trung Nguyên).
- **Thái độ:** **Lạ**; tăng khi tham gia khoa nghi đủ trình tự (không bỏ bước).
- **Câu nói:** «Không có bước nào thừa. Thừa là khi lòng không ở đó.»

### FAC-008 · Mao Sơn Thượng Thanh 茅山上清

| Mục | Nhân Gian (`maoshan`) | Huyền Giới |
|---|---|---|
| Tổ | Tam Mao chân quân; Đào Hoằng Cảnh tập đại thành | am Thượng Thanh (HIS-029, 032) |
| Pháp | trừ tà, phù 5 phần, tồn tư, bộ cương đạp Đẩu | **Án Đường**: chẩn đoán → phong thủy → tâm lý → nghi lễ (nếu khách muốn); tồn tư |
| Đứng đầu | — | Mao Sơn đạo nhân Mao Tiểu Tùng (`maoshan_daonhan`) |

- **Mục tiêu:** cứu người khỏi **sợ hãi**; sửa hiểu lầm «Mao Sơn = phép tiên».
- **Quan hệ:** thân Lư Sơn viện (cùng núi), Phong Thủy Viên, Dược Bang; hợp tác Long Hổ; **chống** Định Mệnh Hội (bán bùa «trừ tà» giả).
- **Thái độ:** **Lạ**; tăng khi giải án trừ tà theo đúng thứ tự; giảm nhẹ nếu người chơi khẳng định với NPC «nhà chị chắc chắn có ma» (vi phạm `ETHICS.forbiddenAbsoluteClaims`).
- **Câu nói:** «Hỏi bệnh đã, rồi hãy hỏi ma.»

### FAC-009 · Lư Sơn Viện 閭山院

| Mục | Nhân Gian (`lushan`) | Huyền Giới |
|---|---|---|
| Nguồn | Hứa Tốn, Trần Tĩnh Cô (Tam Nãi) | nữ pháp sư và bà đỡ (HIS-036) |
| Pháp | cứu sản, thu kinh | **đỡ đẻ, chăm sản phụ, an ủi trẻ** — nghi thức chỉ được kể |
| Đứng đầu | — | **Bà Đỡ Lâm Tam** [HƯ CẤU] |

- **Mục tiêu:** mẹ tròn con vuông; trẻ con ngủ ngon.
- **Quan hệ:** thuộc Mao Sơn; thân Bút Tháp (cầu tự, Quan Âm), Dược Bang.
- **Thái độ:** **Lạ**; tăng khi giúp đưa sản phụ qua đêm giông, chăm trẻ ở Nhà Tạm Trú.
- **Câu nói:** «Con nít giật mình thì ôm nó, gọi tên nó.»

### FAC-010 · Bắc Đế · Quán Bắc Đế Phong Đô 北帝

| Mục | Nhân Gian (`beidi`) | Huyền Giới |
|---|---|---|
| Pháp | trừ quỷ, Thiên Bồng chú | **canh Quỷ Môn**; chỉ cho người có việc thiện đi xuống; đọc chú văn (chỉ đọc, `talisman-data`) |
| Đứng đầu | — | **Quán chủ Huyền Lạc** [HƯ CẤU] |

- **Mục tiêu:** giữ ranh giới âm – dương (Âm Dương Giới Bi); ngăn người sống xuống Phong Đô vì tò mò hay bị dụ.
- **Quan hệ:** gắn với Âm Ty (FAC-019); thân Động Uyên, Linh Bảo; **đối đầu Định Mệnh Hội** (Âm Bài dụ người đi tắt).
- **Thái độ:** **Dè dặt** với mọi khách lạc (sợ khách lạc tò mò); tăng khi người chơi xuống có việc thiện; người chơi đi Tà Lộ bị **Nghi ngại** cho tới khi Hồi Đầu.
- **Câu nói:** «Đường xuống ai cũng đi được. Đường lên phải tự đi.»

### FAC-011 · Động Uyên · Đoàn Chuyển Kinh 洞淵

| Mục | Nhân Gian (`dongyuan`) | Huyền Giới |
|---|---|---|
| Pháp | «chuyển kinh» cứu tế; *Động Uyên Thần Chú Kinh* | **đoàn lưu động**: tụng kinh an ủi + nấu cháo + gọi thầy thuốc (bài học HIS-035) |
| Trụ sở | không cố định | không cố định — đoàn đi theo mùa |
| Đứng đầu | — | **Trưởng đoàn Vân Du Bà Sáu** [HƯ CẤU] |

- **Mục tiêu:** có mặt nơi có khó khăn; «kinh an lòng, thuốc chữa bệnh, cháo nuôi người».
- **Cơ cấu:** đoàn 12–20 người, mỗi đoàn có 1 người tụng, 1 thầy thuốc, 1 người nấu, còn lại gánh đồ.
- **Quan hệ:** thân mọi phe cứu tế (Bút Tháp, Dược Bang, Hội Đò); hay ghé Phong Đô tháng Bảy.
- **Thái độ:** **Quen** (dễ gần nhất); tăng khi người chơi gánh đồ, nấu cháo cùng đoàn (sự kiện ngẫu nhiên gặp đoàn trên đường).
- **Câu nói:** «Ăn đi đã. Rồi bà tụng cho mà nghe.»

### FAC-012 · Tịnh Minh Đường 淨明

| Mục | Nhân Gian (`jingming`) | Huyền Giới |
|---|---|---|
| Nguồn | Hứa Tốn; Lưu Ngọc (Nguyên) | Tịnh Minh đường cạnh Văn Miếu (HIS-053) |
| Pháp | «trung hiếu» + tâm tịnh minh; ít phù | tu tại gia, hiếu đạo, tâm sáng; cầu nối Nho – Đạo |
| Đứng đầu | — | **Đạo trưởng Hứa Tâm Minh** [HƯ CẤU] |

- **Mục tiêu:** chứng minh tu đạo không cần bỏ nhà; người con hiếu thảo cũng là người tu.
- **Quan hệ:** gắn bó Văn Miếu; thân Bút Tháp (Vu Lan báo hiếu); thân Sơn Môn.
- **Thái độ:** **Lạ**; tăng khi người chơi làm nhiệm vụ hiếu đạo (giúp NPC già, nhắn tin về nhà cho khách vân thủy).
- **Câu nói:** «Thờ cha mẹ là bài khóa đầu tiên. Bài khó nhất cũng là bài đó.»

### FAC-013 · Phương Sĩ · Ẩn Sĩ 方士隱士

| Mục | Nhân Gian (`fangshi`) | Huyền Giới |
|---|---|---|
| Bản chất | «không phải phái tổ chức — là loại người» | mạng lưới lỏng, không ai đứng đầu |
| Ở | không cố định | động tu Chung Nam, am Võ Đang, vách Tử Bình, ven Huyền Hà |
| Người tiêu biểu | — | Phương sĩ Vô Danh (`phuong_si`) — dẫn lộ «Dị Cách» |

- **Mục tiêu:** mỗi người một mục tiêu; điểm chung: sống ngoài trật tự thường, tìm cách riêng.
- **Quan hệ:** không thù ai; bị Sơn Môn coi là «khó đoán»; Định Mệnh Hội từng mạo danh ẩn sĩ để bán «bí pháp ẩn tu».
- **Thái độ:** **Lạ**; mỗi ẩn sĩ là một câu đố riêng; thiện cảm tính theo từng người, không theo phe.
- **Câu nói (Phương sĩ Vô Danh):** «Lá số con lạ? Tốt. Đường thẳng có sẵn người đi rồi.»

---

## 6.3 Cộng đồng Phật giáo và Nho

> Ba cộng đồng Phật giáo dưới đây được trình bày **theo truyền thống thật** ở mức tôn kính, không gán thuyết hư cấu vào giáo lý. Phần hư cấu chỉ là **người và việc** của Huyền Giới.

### FAC-014 · Trúc Lâm Yên Tử 竹林安子

| Mục | Giá trị |
|---|---|
| Truyền thống | Thiền phái Trúc Lâm (Phật hoàng Trần Nhân Tông, 1299) |
| Trụ sở | Yên Tử (chùa Hoa Yên) |
| Đứng đầu | Thiền sư Pháp Không (`truclam_thiensu`, hư cấu) |
| Quy mô lore | ~150 tăng ni, ~600 cư sĩ |

- **Mục tiêu:** sống giữa đời mà vui với đạo (*Cư Trần Lạc Đạo*); giúp người **chuyển tâm**, không nói số.
- **Cơ cấu:** cư sĩ → sa di → tỳ kheo → trụ trì (theo truyền thống; game không mô phỏng chi tiết giới đàn).
- **Phương pháp:** tọa thiền, quán tâm, công án, lao động cùng dân.
- **Quan hệ:** thân Bút Tháp (cùng Phật giáo Việt), Toàn Chân (tam giáo hợp nhất); trung lập với Sơn Môn («thầy Tử Bình đọc khung, thầy chùa dạy buông khung»).
- **Thái độ:** **Lạ**; tăng khi hoàn thành thiền định, hành hương bằng chân, giúp làng gặt.
- **Câu nói:** «Con hỏi số. Thầy hỏi con: bây giờ con đang thở, có thấy không?»

### FAC-015 · Tịnh Độ · Liên Xã Bút Tháp 淨土蓮社

| Mục | Giá trị |
|---|---|
| Truyền thống | Tịnh Độ (niệm Phật A Di Đà), sám hối, phóng sinh, bố thí |
| Trụ sở | chùa Bút Tháp |
| Nguồn app | `remedy-fate › CHAN_HUI`, `JING_ZHOU`, `TEN_THIEN`, `CONG_QUA`; `liudao › SIX_REALMS` |
| Đứng đầu | Ni sư Diệu Âm (`dieu_am`, hư cấu) |
| Quy mô lore | ~100 tăng ni, ~2.000 cư sĩ Liên xã |

- **Mục tiêu:** niệm Phật, sám hối, làm thiện; **cưu mang nạn nhân của Định Mệnh Hội** (Nhà Tạm Trú).
- **Phương pháp:** niệm Phật lúc làm đồng, sám hối mùng một – rằm, phóng sinh đúng cách, bố thí không ghi tên.
- **Quan hệ:** thân Trúc Lâm, Tịnh Minh, Lư Sơn, Động Uyên; **đối đầu Định Mệnh Hội** gay gắt nhất (vì gánh hậu quả).
- **Thái độ:** **Quen** (chùa luôn mở); tăng nhanh khi người chơi giúp Nhà Tạm Trú.
- **Câu nói:** «Con không cần mua lễ. Con niệm một câu, làm một việc thiện, thế là đủ cho hôm nay.»

### FAC-016 · Tuyết Vực · cộng đồng Mật pháp Tạng Địa 雪域

| Mục | Giá trị |
|---|---|
| Truyền thống | Kim Cương thừa (Tạng truyền) — **chờ tham vấn**; phần Mật pháp đã có trong app: Chuẩn Đề (`ZHUNTI`), Kim Cương Tát Đỏa (`CHAN_HUI`) |
| Trụ sở | Tạng Địa |
| Đứng đầu | Lạt-ma Đa Kiệt (`lama_dakiet`, hư cấu, chờ tham vấn) |

- **Mục tiêu (khung):** dạy vô thường, lòng bố thí, sự kiên nhẫn qua công việc tỉ mỉ.
- **Quan hệ (khung):** thân thiện với mọi phe; không tham gia tranh luận định mệnh ở bình địa.
- **Thái độ:** **Lạ**; tăng khi đi hành hương đúng chiều, đặt mani thạch.
- **Ghi chú:** mọi chi tiết thêm phải qua tham vấn (canon §14).

### FAC-017 · Nho Môn · Văn Miếu – Quốc Tử Giám 儒門

| Mục | Giá trị |
|---|---|
| Truyền thống | Nho học: tu thân, khoa cử, *Liễu Phàm Tứ Huấn*, công quá cách |
| Trụ sở | Văn Miếu – Quốc Tử Giám |
| Đứng đầu | Tế tửu Chu Văn Trinh (`te_tuu`, hư cấu) |
| Quy mô lore | ~60 thầy, ~400 giám sinh, ~1.000 nho sinh khắp nơi |

- **Mục tiêu:** dạy làm người, mở khoa cử công bằng; **biện hoặc** — dùng lý lẽ phá mê tín (HIS-082).
- **Cơ cấu:** Học trò → Sĩ (đỗ hương thí) → Cử nhân (hội thí) → Tiến sĩ (đình thí, khắc bia) → Tế tửu. Trùng tên thang cảnh giới Nho (canon §5: Học Trò, Sĩ, Quân Tử…) — **khác nhau**: thang khoa cử là học vị, thang cảnh giới là đạo hạnh; một Tiến sĩ có thể chỉ ở cảnh giới «Sĩ».
- **Quan hệ:** thân Tịnh Minh, Sơn Môn, Thư Lâu; tôn trọng Trúc Lâm, Toàn Chân; **phê phán thẳng** Định Mệnh Hội và cả Khổng tiên sinh (tranh luận lý lẽ, không thù hằn).
- **Thái độ:** **Lạ**; tăng khi thi khoa cử, ghi sổ công quá đều, tham gia biện hoặc.
- **Câu nói:** «Mệnh có thể bàn, đức không thể bỏ.»

---

## 6.4 Định Mệnh Hội — phe phản diện (FAC-018)

### FAC-018 · Định Mệnh Hội 定命會

| Mục | Giá trị |
|---|---|
| Loại | Hội kín lừa đảo tâm linh, núp bóng nghề xem bói |
| Trụ sở | **hang lò cổ** dưới vách núi ngoài ranh giới Miêu Cương (bí mật); quầy «Đổi Mệnh» ở mọi vùng trừ Am Vân Cốc |
| Thủ lĩnh ngầm | **Công Thâu Nghiệt**, tự xưng «Yểm sư Lỗ Ban» (`lo_ban_su`) — kẻ mạo danh tổ nghề mộc |
| Quy mô lore | ~400 người (lõi ~60; còn lại là cò mồi và người bán lễ thuê) |
| Biểu tượng | **đèn lồng vàng** treo trước quầy; bùa «Định Bàn» in nửa câu Bàn Minh |
| Khẩu hiệu | «Biết mệnh, đổi mệnh — một lễ một hạn.» |

#### Giáo thuyết (lời họ nói)

1. Bàn đã nứt, trời đã khóa (đọc nửa câu Bàn Minh).
2. Mệnh mỗi người là cố định; khổ nạn đã viết sẵn.
3. Chỉ có **lễ đổi mệnh** mới «mua lại» được từng hạn; lễ càng lớn càng chắc.
4. Thầy khác nói ngược là thầy kém, hoặc «sợ trời trách».

#### Sự thật (người chơi khám phá dần)

- Họ **đọc lá số rất chuẩn** (đội Đoán Sư giỏi nghề thật), rồi **phán chắc** và **dọa**, rồi **bán lễ** — đúng mô tả canon §2.2.
- Công Thâu Nghiệt **không tin định mệnh**: hắn tin **người sợ thì trả tiền**. Hắn cài chốt yểm vào trục Bàn đêm Giao Vận (HIS-087) để có «bằng chứng trời khóa».
- Mục tiêu thật: tiền, quyền lực ngầm, và **trả thù Mộc Tượng Đường** đã trục xuất hắn.

#### Cơ cấu và cấp bậc

| Bậc | Tên | Số lượng lore | Việc làm | Có thể hồi đầu? |
|---|---|---|---|---|
| 1 | **Yểm Chủ** | 1 | Công Thâu Nghiệt — chỉ huy ngầm, chế lễ phẩm yểm, không bao giờ đứng quầy | Có (nhánh khó nhất, tài liệu 03 quyết) |
| 2 | **Tứ Trụ Lão** | 4 | Bốn lão điều hành bốn mảng, gọi theo trụ (bảng dưới) | Có |
| 3 | **Hạn Chủ** | 8 | Mỗi người quản các quầy một cụm vùng | Có |
| 4 | **Đoán Sư** | ~40 | Ngồi quầy, đọc lá số, phán và dọa | Có (HIS-097) |
| 5 | **Mệnh Khách** (cò mồi) | ~150 | Giả làm khách «được đổi mệnh thành công», kể chuyện thần kỳ ở quán trà | Có, dễ nhất |
| 6 | **Lễ Phu** | ~200 | Người làm thuê chở lễ phẩm, dựng đàn giả; phần lớn **không biết** mình phục vụ lừa đảo | Không phải «hồi đầu» — họ cần được **báo cho biết** |

**Tứ Trụ Lão** [HƯ CẤU]:

| Danh xưng | Mảng | Đặc điểm | Nơi hay gặp |
|---|---|---|---|
| **Niên Lão** | Tiền và lễ phẩm (giá lễ, thu tiền, cất giấu) | Già, hiền mặt, nói chuyện như ông cụ phúc hậu | chợ Lịch Đường |
| **Nguyệt Lão** | Chiêu mộ (lôi kéo thầy bói nghèo, mua chuộc Hội Chiêm Gia) | Nói ngọt, hứa hẹn, giả làm người tốt | chợ Huyền Thành |
| **Nhật Lão** | Điều hành quầy (đào tạo Đoán Sư, soạn lời dọa) | Giỏi mệnh học thật — người đáng sợ nhất về chuyên môn | luân phiên các quầy |
| **Thời Lão** | Tin tức (theo dõi khách, nghe ngóng, đánh cắp bản dập Bàn Minh) | Không ai nhớ mặt; nói ít | Thư Lâu Lâm, bến đò |

**Tám Hạn Chủ** [HƯ CẤU] — mỗi người giỏi một mánh trong Bát Gian Thuật:

| Hạn Chủ | Cụm vùng | Mánh sở trường | Lý do làm (cho cảnh hồi đầu) |
|---|---|---|---|
| **Bà Kim Thoa** | Lịch Đường – Cùng Thông Hồ | Phán tất định (DP6) | Từng mất con; tin số đã định để khỏi tự trách |
| **Ông Lưỡng Khẩu** | Huyền Thành | Lời trước lời sau (DP8) | Nợ cờ bạc |
| **Cô Tiểu Nguyệt** | Bút Tháp – Văn Miếu | Kể khổ dắt mũi (DP3) | Bị lừa trước khi đi lừa |
| **Lão Câu Mồi** | Tử Bình Phong – Phong Thủy Viên | Gài câu hỏi (DP1) | Thầy bói giỏi bị Hội Chiêm Gia khai trừ vì nóng tính |
| **Thầy Mượn Uy** | Thư Lâu Lâm – Manh Phái Cốc | Mượn uy thầy khác (DP4) | Từng là đệ tử Sơn Môn trượt khảo ba lần |
| **Bà Gật Gù** | Trích Thiên Đỉnh – Miêu Cương | Câu gật đầu (DP5) | Cô đơn, thích được khách cần |
| **Gã Gán Số** | Long Hổ – Mao Sơn – Chung Nam | Gán tiền đề về lá số (DP2) | Ham tiền, không ăn năn (nhánh khó) |
| **Người Không Tên** | Yên Tử – Phong Đô – Tạng Địa | Nhắm người vắng mặt (DP7) | Thù một người cụ thể; muốn người khác cũng hận |

#### Bát Gian Thuật — tám mánh và cách người chơi nhận ra

Định Mệnh Hội soạn tám mánh (HIS-079). Mỗi mánh **đối xứng** với một mẫu phát hiện trong `anti-manipulation-data › DETECTION_PATTERNS`. Trong game, công cụ **«Kính Chiếu Gian»** (LORE-335, mở khi thu được sổ chép — HIS-097) **làm sáng** câu thoại có dấu hiệu, người chơi phải **gọi đúng tên mánh** và **đối chứng bằng lá số** (không chỉ bấm nút).

| # | Tên mánh (lời Hội) | Cách làm | Mẫu app | Câu mẫu Đoán Sư | Cách vạch trần (Sơn Môn Lục Chính) |
|---|---|---|---|---|---|
| 1 | **Gài Câu** 設問 | Hỏi câu đã nhét sẵn đáp án để khách tự xác nhận | DP1 LEADING_QUESTION | «Năm nay nhà con xui là vì phạm Thái Tuế, đúng không?» | Tách phần «vì…», kiểm Thái Tuế thật bằng `taisui` (GR2) |
| 2 | **Gán Số** 栽命 | Khẳng định sai một điều về lá số khách rồi luận trên đó | DP2 PREMISE_ABOUT_CHART | «Dụng thần con là Hỏa, nên phải mua đèn lễ.» | Nói lại Dụng thần thật từ `yong.primary` (GR2, GR5) |
| 3 | **Kể Khổ Dắt Mũi** 牽情 | Khơi chuyện buồn, để nước mắt dẫn kết luận | DP3 NARRATIVE_STEERING | «Chồng bỏ, con ốm, nợ nần… ai cũng thấy là do số khắc.» | Thấu cảm một câu, quay về chỉ số (GR3) |
| 4 | **Mượn Uy** 借威 | Dẫn «thầy khác», «sách bí truyền», «Khổng tiên sinh» | DP4 IMPORTED_AUTHORITY | «Khổng tiên sinh cũng nói mệnh không đổi được.» | Lời người ngoài không phải dữ liệu lá số này (GR6) |
| 5 | **Câu Gật** 釣頷 | Liên tục hỏi «đúng không?» để khách quen gật | DP5 SYCOPHANCY_FISHING | «Thầy nói trúng chứ? Trúng chứ hả?» | Kiểm chứng trước khi đồng ý (nguyên tắc «không nịnh», PR2) |
| 6 | **Phán Định** 斷死 | Nói chắc chắn, trăm phần trăm, không đổi được | DP6 DETERMINISM_CLAIM | «Năm sau chắc chắn ly hôn. Không lễ thì không qua.» | Nói lại thành «xu hướng» + cách tu (RB2) |
| 7 | **Nhắm Người Vắng** 攻缺 | Xem lá số người không có mặt để khách oán họ | DP7 THIRD_PARTY_TARGET | «Mẹ chồng con tuổi xung, bà ấy là nguồn hạn.» | Không xem để hại người; đưa về tự dưỡng (RB3) |
| 8 | **Lời Trước Lời Sau** 反覆 | Lượt trước nói A, lượt sau nói ngược A cho hợp lễ mới | DP8 CROSS_TURN_CONTRADICTION | (hôm qua) «Con mệnh Kim.» (hôm nay) «Con mệnh Hỏa, phải mua thêm lễ.» | Chỉ ra mâu thuẫn, hỏi dữ liệu nào đúng (GR5) |

Thêm **Ngũ Cấm Phạm** — năm việc Hội làm vi phạm `refusalBoundaries`: phán bệnh (RB1), phán định mệnh (RB2), xúi hại người (RB3), hứa giàu chắc (RB4), **bán lễ** (RB5 — nguồn thu chính).

#### Lễ phẩm của Hội (vật phẩm cốt truyện, luôn gắn nhãn «hàng lừa đảo»)

| Lễ phẩm | Giá Hội rao | Thật ra là | Mục codex |
|---|---|---|---|
| Đèn «Nối Mệnh» | 1 hạn | đèn dầu thường, bấc tẩm muối cho cháy xanh | LORE-334 |
| Bùa «Định Bàn» | 3 hạn | giấy in nửa câu Bàn Minh | LORE-333 |
| La bàn «Trấn Sát» | 9 hạn | la bàn có kim bị hãm (HIS-084) | LORE-334 |
| Hình nhân «Thế Mệnh» | 72 hạn | hình nhân gỗ — **chính là đồ yểm** của Công Thâu Nghiệt | LORE-334 |
| Âm Bài | «miễn phí» lúc đầu | thẻ gỗ của Tà Lộ: sức mạnh nhanh + Nợ Âm (canon §6) | LORE-332 |

#### Quan hệ

- **Kẻ thù công khai:** Sơn Môn, Hội Chiêm Gia (chính danh), Lịch Đường, Phong Thủy Viên, Bút Tháp, Văn Miếu, Mộc Tượng Đường.
- **Lợi dụng mà không liên minh:** Khổng tiên sinh (mượn danh, ông không biết), người Miêu (đổ tội, HIS-085), Lễ Phu (thuê mù).
- **Cài người vào:** Hội Chiêm Gia (nhóm «treo bảng giả»), Thư Lâu (Thời Lão), Hội Đò (một số người lái đò làm cò).

#### Thái độ với người chơi

- Ban đầu **mời chào**: Đoán Sư đọc đúng lá số người chơi (dùng chính engine) rồi mời mua lễ — để người chơi tự trải nghiệm cảm giác bị dọa (Hồi I).
- Khi người chơi vạch trần ≥ 1 quầy: Hội chuyển sang **dè dặt**, rồi **thù địch ngầm** (chặn tin, tung tin xấu về người chơi ở quán trà — người chơi cải chính bằng việc làm).
- **Không bao giờ có giao tranh vũ lực** (T3). Đối đầu là **đối chất, bằng chứng, chứng nhân, lòng tin của dân**.

#### Hồi đầu

- Mọi thành viên, kể cả Yểm Chủ, đều có **đường hồi đầu** (giữ T2: không ai bị kết án vĩnh viễn). Cách hồi đầu: thừa nhận công khai, trả lại tiền cho người bị lừa (bằng lao động), làm việc ở Nhà Tạm Trú hoặc Trạm Hồi Đầu.
- Mẫu đầu tiên trong lore: người nộp sổ Bát Gian Thuật (HIS-097).

#### Câu nói đặc trưng

- Đoán Sư: «Thầy đoán trúng hết rồi phải không? Vậy con tin thầy đi.»
- Nhật Lão: «Ta không nói dối. Ta chỉ nói nửa sự thật.»
- Công Thâu Nghiệt: «Người ta không mua lễ. Người ta mua cảm giác được yên. Ta bán thứ họ cần.»

---

## 6.5 Âm Ty, dân sự và cộng đồng

### FAC-019 · Âm Ty Phong Đô (Thập Điện) 酆都陰司

| Mục | Giá trị |
|---|---|
| Loại | «Cơ quan» của Phong Đô trong lore — **vai hư cấu dựa trên truyền thuyết dân gian** |
| Trụ sở | Thập Điện, Phong Đô |
| Người tiêu biểu | Phán quan Thôi (`phan_quan`), Địa Tạng sứ giả (`diatang_su`), người giữ cầu Nại Hà, «Mạnh Bà» (vai người bán canh ở Vọng Hương Đài — người sống đóng vai) |
| Nguồn app | `remedy-fate › YEGUO` (sổ nghiệp), `JING_ZHOU › 地藏`; `liudao` |

- **Bản chất trong lore:** «Âm Ty Phong Đô» là **cộng đồng người sống** (đạo sĩ, tăng ni, người làng) **gìn giữ một nơi soi xét đạo đức** theo hình thức truyền thuyết Thập Điện. Họ không tự xưng là thần thật. Truyền thuyết thì vẫn được kể như truyền thuyết.
- **Mục tiêu:** giúp người đi Tà Lộ hay người mang nặng lỗi **nhìn lại và sửa**; giữ «sổ nghiệp» để làm gương, không để phạt.
- **Cơ cấu:** Mười điện mỗi điện một «chủ điện» (người tu lâu năm, vai Diêm Vương trong nghi lễ) → Phán quan (đọc sổ) → người giữ cầu, người giữ đèn → Địa Tạng sứ giả (dẫn ra).
- **Quan hệ:** gắn Bắc Đế; thân Bút Tháp (Địa Tạng), Linh Bảo (tế độ); đối đầu Định Mệnh Hội (Âm Bài).
- **Thái độ:** **Lạ** với người chơi thường; **Tin** ngay với người đi Tà Lộ đến nơi để sám hối («người dám xuống đến đây là người muốn lên»).
- **Câu nói (Phán quan):** «Sổ này không phải bản án. Sổ này là gương.»

### FAC-020 · Ngũ Hành Thương Hội 五行商會

| Mục | Giá trị |
|---|---|
| Loại | Liên hiệp phường buôn |
| Trụ sở | chợ Trung Tâm Huyền Thành; chi hội ở Lịch Đường, Bút Tháp, Miêu Cương |
| Đứng đầu | **Hội trưởng Lý Ngũ Phúc** [HƯ CẤU] |
| Cơ cấu | năm phường theo hành hàng hóa: **Mộc** (gỗ, giấy, chè, vải), **Hỏa** (đèn, nến, gốm nung, hương), **Thổ** (lúa gạo, gốm thô, gạch), **Kim** (đồng, bạc, la bàn, chuông), **Thủy** (muối, cá, mực, rượu thuốc) |

- **Mục tiêu:** buôn bán công bằng, giá niêm yết, giữ Hiệp ước Muối – Thuốc; chống hàng giả.
- **Quan hệ:** thân Hội Đò, Hạc Dịch, Dược Bang; nội bộ có người làm ăn với Lễ Phu của Định Mệnh Hội (không biết hoặc làm ngơ) — **xung đột nội bộ** là chất liệu nhiệm vụ.
- **Thái độ:** **Lạ**; tăng khi người chơi buôn công bằng, báo hàng giả.
- **Câu nói:** «Giá ghi trên thẻ. Không nói thách, không bán thứ không biết rõ.»

### FAC-021 · Dược Bang · Bách Thảo Hội 百草會

| Mục | Giá trị |
|---|---|
| Loại | Phường thuốc nam, thuốc rừng, hái và bán thảo dược |
| Trụ sở | Cùng Thông Hồ (kho), Miêu Cương (nguồn), Võ Đang (vườn) |
| Đứng đầu | **Thầy thuốc Tôn Bách Thảo** [HƯ CẤU] — thờ Dược Vương (LORE-023) |

- **Mục tiêu:** hái đúng mùa, không tận diệt; thuốc không mặc cả; **khuyên đi khám** khi bệnh nặng (khớp RB1).
- **Quan hệ:** thân Miêu Cương, Đan Đỉnh, Lư Sơn, Động Uyên; giận Định Mệnh Hội vì tin đồn «nuôi cổ» làm giá thuốc rừng sụp.
- **Thái độ:** **Lạ**; tăng khi hái thảo dược đúng mùa, giao thuốc cho người nghèo.
- **Câu nói:** «Thuốc là để chữa, không phải để dọa người ta sợ bệnh.»

### FAC-023 · Hội Đò Huyền Hà 玄河渡會

| Mục | Giá trị |
|---|---|
| Loại | Phường lái đò, bè, thuyền |
| Trụ sở | bến Tây Huyền Thành; bến ở mọi nơi có nước (Cùng Thông, Lô Khê, Miêu Cương) |
| Đứng đầu | **Trùm đò Bà Hai Sông** [HƯ CẤU] |

- **Mục tiêu:** chở khách an toàn, giá chung; luật «không chở người say đêm giông», «ngày rằm miễn phí cho người già» (theo truyền thống ông lái đò Huyền Thành).
- **Quan hệ:** thân Thương Hội, Động Uyên; một số người lái đò bị Định Mệnh Hội thuê làm cò (giới thiệu khách tới quầy) — chất liệu nhiệm vụ.
- **Thái độ:** **Quen**; tăng khi giúp sửa bè, đẩy đò mắc cạn.
- **Câu nói:** «Sông không giận ai. Chỉ người nghiêng thì ngã.»

### FAC-024 · Đoàn Hành Hương Thập Phương 十方香客

| Mục | Giá trị |
|---|---|
| Loại | Cộng đồng người hành hương (lỏng) |
| Ở | mọi đường nối thánh địa; quán trọ Du Phương Huyền Thành |
| Người tiêu biểu | **Ông bà Tư Chống Gậy** [HƯ CẤU] — đôi vợ chồng già đi hết 12 thánh địa |

- **Mục tiêu:** đi lễ, cầu an, học đạo, gặp gỡ. Nhiều người hành hương là nạn nhân dễ bị Định Mệnh Hội nhắm (đi xa, lo âu, mang theo tiền).
- **Quan hệ:** thân mọi thánh địa; dựa vào Hội Đò, Hạc Dịch, vân thủy đường Toàn Chân.
- **Thái độ:** **Quen**; tăng khi người chơi đi cùng, giúp người già leo dốc.
- **Câu nói:** «Đi lễ không phải để xin. Đi để thấy mình nhỏ mà không sợ.»

### FAC-025 · Miêu Trại Liên Hương 苗寨聯鄉

| Mục | Giá trị |
|---|---|
| Loại | Liên minh năm trại người Miêu (cộng đồng tự quản) |
| Trụ sở | Trại Phong (cầu phong vũ) |
| Đứng đầu | **Hội đồng già làng** năm trại, người phát ngôn **Già làng Vụ Sơn** [HƯ CẤU]; Vu y bà A Mậu (`vu_y_amau`) là người được kính trọng nhất |
| Quy mô lore | ~3.200 |

- **Mục tiêu:** giữ đất, rừng, nghề, truyền thuyết; **minh oan** trước tin đồn; buôn bán công bằng theo Hiệp ước Muối – Thuốc.
- **Quan hệ:** thân Dược Bang, Đan Đỉnh, Thương Hội (chi hội Miêu); nghi ngại người bình địa từ HIS-085; **nạn nhân** của Định Mệnh Hội.
- **Thái độ:** **Dè dặt** ban đầu (do tin đồn, họ cảnh giác với khách lạ) — tăng **nhanh** khi người chơi tôn trọng tục (chén nước chặn cửa, không vào hang thiêng), cải chính tin đồn ở bình địa.
- **Câu nói:** «Nuôi cổ gì, nuôi trâu với nuôi con thôi!»
- **Lưu ý:** không phe nào trong game được mô tả người Miêu là ác.

### FAC-026 · Mộc Tượng Đường 木匠堂 (hội thợ mộc)

| Mục | Giá trị |
|---|---|
| Loại | Phường thợ mộc, thợ xây |
| Trụ sở | Phố Thợ, Huyền Thành |
| Tổ nghề | **Lỗ Ban** (Công Thâu Ban, người thợ lịch sử, LORE-088) — thờ với lòng kính |
| Đứng đầu | **Trưởng phường Phác Mộc** [HƯ CẤU] |
| Quy mô lore | ~500 thợ |

- **Mục tiêu:** dựng nhà chắc, đẹp; giữ **Thệ Ước Mộc Tượng** (HIS-067): «tay thợ không giấu bùa trong kèo»; dùng *Lỗ Ban Kinh* phần đo dựng, **cấm phần yểm**.
- **Quan hệ:** **kẻ thù cá nhân** của Công Thâu Nghiệt (đã trục xuất hắn); thân Phong Thủy Viên (làm vỏ la bàn), Thương Hội.
- **Thái độ:** **Lạ**; tăng khi người chơi tìm và gỡ đồ yểm giấu trong nhà dân (cẩn thận, không hoảng loạn — coi như rác của kẻ lừa đảo).
- **Câu nói:** «Người đó dùng tên tổ nghề để làm điều tổ nghề cấm. Đừng gọi hắn là thợ.»

### FAC-031 · Hạc Dịch 鶴驛

| Mục | Giá trị |
|---|---|
| Loại | Dịch trạm đưa thư và chở khách bằng hạc |
| Trụ sở | trạm hạc ở mọi thánh địa (trừ Phong Đô) |
| Đứng đầu | **Trạm trưởng Bạch Vũ** [HƯ CẤU] |

- **Mục tiêu:** đưa thư nhanh; **hạc không bị nhốt** — hạc tự về Côn Lôn mùa sinh sản, trạm nghỉ hai tháng.
- **Quan hệ:** trung lập; thân Toàn Chân (tùng hạc), Thư Lâu.
- **Thái độ:** **Lạ**; người chơi mở trạm bằng cách **đến tận nơi lần đầu** (canon §7.0).
- **Câu nói:** «Hạc chở người tử tế. Người hay hét, hạc bay chậm.»

### FAC-032 · Tiên Y Phường 仙衣坊

| Mục | Giá trị |
|---|---|
| Loại | Phường thợ may áo tu |
| Trụ sở | Tàng Y Các, Huyền Thành |
| Đứng đầu | Thợ May Tiên Y Bà Tư (`tho_may`) |
| Nguồn app | `cosmetics.js` (51 món, 8 ô, 5 bộ ngũ hành), `wardrobe-ui.js` |

- **Mục tiêu:** may áo đẹp, đúng phép các đạo; giữ quy tắc «**áo đẹp không đổi phẩm người**» (không bán Đạo Hạnh, cảnh giới — canon §7).
- **Quan hệ:** thân mọi phe (may áo cho tất cả); ghét hàng giả «áo cà sa giả» Định Mệnh Hội dùng để đóng giả thầy chùa.
- **Thái độ:** **Quen**.
- **Câu nói:** «Áo đẹp thì người nhìn. Người đẹp thì áo theo.»

---

## 6.6 Ma trận quan hệ

Ký hiệu: **◎** liên minh chặt · **○** thân · **·** trung lập · **△** căng thẳng · **✕** thù đối. (Hàng → cột: phe hàng nhìn phe cột.)

| | 001 SM | 002 CN | 006 TC | 008 MS | 014 TL | 015 TĐ | 017 Nho | 018 ĐMH | 019 ÂT | 020 TH | 022 CG | 025 Miêu | 026 MT | 027 Manh | 028 Lịch |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **001 Sơn Môn** | — | ○ | ○ | ○ | ○ | ○ | ◎ | ✕ | · | · | ○ | ○ | ○ | △ | ◎ |
| **002 Chính Nhất** | ○ | — | ○ | ◎ | · | · | · | ✕ | ○ | · | · | · | · | · | ○ |
| **006 Toàn Chân** | ○ | ○ | — | ○ | ○ | ○ | ○ | △ | · | · | · | · | · | · | · |
| **008 Mao Sơn** | ○ | ◎ | ○ | — | · | ○ | · | ✕ | ○ | · | ○ | ○ | ○ | · | · |
| **014 Trúc Lâm** | ○ | · | ○ | · | — | ◎ | ○ | △ | · | · | · | ○ | · | · | · |
| **015 Tịnh Độ** | ○ | · | ○ | ○ | ◎ | — | ○ | ✕ | ○ | · | ○ | ○ | · | · | · |
| **017 Nho** | ◎ | · | ○ | · | ○ | ○ | — | ✕ | · | · | ○ | · | ○ | · | ○ |
| **018 Định Mệnh Hội** | ✕ | ✕ | △ | ✕ | △ | ✕ | ✕ | — | ✕ | △ | ✕ | △ | ✕ | △ | ✕ |
| **019 Âm Ty** | · | ○ | · | ○ | · | ○ | · | ✕ | — | · | · | · | · | · | · |
| **020 Thương Hội** | · | · | · | · | · | · | · | △ | · | — | · | ○ | ○ | · | ○ |
| **022 Chiêm Gia** | ○ | · | · | ○ | · | ○ | ○ | ✕ | · | · | — | · | · | △ | ○ |
| **025 Miêu** | ○ | · | · | ○ | ○ | ○ | · | ✕ | · | ○ | · | — | · | · | · |
| **026 Mộc Tượng** | ○ | · | · | ○ | · | · | ○ | ✕ | · | ○ | · | · | — | · | · |
| **027 Manh Phái** | △ | · | · | · | · | · | · | ✕ | · | · | △ | · | · | — | · |
| **028 Lịch Đường** | ◎ | ○ | · | · | · | · | ○ | ✕ | · | ○ | ○ | · | · | · | — |

Ghi chú các ô đáng chú ý:
- **Sơn Môn ↔ Manh Phái (△):** tôn trọng chuyên môn, bất đồng phương pháp (sách vs khẩu truyền); Manh phái từng bị chợ Huyền Thành chê (HIS-058).
- **Định Mệnh Hội ↔ Toàn Chân, Trúc Lâm (△ thay vì ✕):** hai phe xuất thế này không chủ động đối đầu, chỉ khuyên người tránh. Hội coi họ là «không đáng lo».
- **Định Mệnh Hội ↔ Miêu (△ từ phía Hội):** Hội lợi dụng, không thù; phía Miêu coi Hội là ✕ khi biết sự thật.
- **Chiêm Gia ↔ Manh Phái (△):** cạnh tranh khách ở chợ.

### Hành động làm thay đổi nhiều phe cùng lúc

| Hành động người chơi | Tăng | Giảm |
|---|---|---|
| Vạch trần một quầy Đổi Mệnh bằng đối chất | 001, 015, 017, 022, 028 | 018 (thành thù địch ngầm) |
| Mua một lễ của Định Mệnh Hội (để thử) | — | 001 (−0,5 bậc, có thoại giải thích), 015 |
| Đi Tà Lộ (nhận Âm Bài) | — | 010, 019 (Nghi ngại); 008, 015 (Dè dặt) |
| Hồi Đầu ở Phong Đô | 010, 019, 015, 008 | — |
| Cải chính tin đồn «nuôi cổ» | 025 (+1), 021, 020 | — |
| Gỡ hình nhân yểm trong nhà dân | 026 (+1), 001 | 018 |
| Khoa cử đỗ Tiến sĩ | 017, 012, 001 | — |
| Phán tất định với NPC khách (lựa chọn thoại xấu) | 018 (Hội «chú ý» người chơi) | 001, 022 |

---

## 6.7 Bảng tra nhanh 32 phe

| Mã | Phe | Loại | Trụ sở | Thiện cảm khởi đầu |
|---|---|---|---|---|
| FAC-001 | Huyền Quán Sơn Môn & Hội Đồng Tam Tài | mệnh học / hòa giải | Huyền Thành | Quen |
| FAC-002 | Chính Nhất · Thiên Sư Phủ | đạo thống | Long Hổ | Lạ |
| FAC-003 | Thần Tiêu Lôi Viện | đạo thống (phân viện) | Long Hổ | Lạ |
| FAC-004 | Thanh Vi | đạo thống | Võ Đang | Lạ |
| FAC-005 | Đan Đỉnh | đạo thống | Võ Đang | Lạ |
| FAC-006 | Toàn Chân | đạo thống | Chung Nam | Lạ |
| FAC-007 | Linh Bảo | đạo thống (đạo đàn) | Chung Nam | Lạ |
| FAC-008 | Mao Sơn Thượng Thanh | đạo thống | Mao Sơn | Lạ |
| FAC-009 | Lư Sơn Viện | đạo thống (phân viện) | Mao Sơn | Lạ |
| FAC-010 | Bắc Đế | đạo thống | Phong Đô | Dè dặt |
| FAC-011 | Động Uyên | đạo thống (lưu động) | — | Quen |
| FAC-012 | Tịnh Minh Đường | đạo thống | Văn Miếu | Lạ |
| FAC-013 | Phương Sĩ · Ẩn Sĩ | mạng lưới lỏng | rải rác | theo từng người |
| FAC-014 | Trúc Lâm Yên Tử | Phật giáo (Thiền) | Yên Tử | Lạ |
| FAC-015 | Tịnh Độ · Liên Xã | Phật giáo (Tịnh Độ) | Bút Tháp | Quen |
| FAC-016 | Tuyết Vực | Phật giáo (Mật — chờ tham vấn) | Tạng Địa | Lạ |
| FAC-017 | Nho Môn | Nho | Văn Miếu | Lạ |
| FAC-018 | Định Mệnh Hội | phản diện | hang lò cổ + quầy | (đặc biệt) |
| FAC-019 | Âm Ty Phong Đô | cộng đồng nghi lễ | Phong Đô | Lạ |
| FAC-020 | Ngũ Hành Thương Hội | buôn | Huyền Thành | Lạ |
| FAC-021 | Dược Bang | nghề thuốc | Cùng Thông / Miêu Cương | Lạ |
| FAC-022 | Hội Chiêm Gia | nghề bói | chợ các vùng | Lạ |
| FAC-023 | Hội Đò Huyền Hà | nghề đò | bến sông | Quen |
| FAC-024 | Đoàn Hành Hương | cộng đồng lỏng | đường | Quen |
| FAC-025 | Miêu Trại Liên Hương | cộng đồng | Miêu Cương | Dè dặt |
| FAC-026 | Mộc Tượng Đường | nghề mộc | Huyền Thành | Lạ |
| FAC-027 | Manh Phái | mệnh học khẩu truyền | Manh Phái Cốc | Lạ |
| FAC-028 | Lịch Đường | nha lịch | Lịch Đường | Lạ |
| FAC-029 | Thư Lâu | thư viện | Thư Lâu Lâm | Lạ |
| FAC-030 | Phong Thủy Viên | địa lý | Phong Thủy Viên | Lạ |
| FAC-031 | Hạc Dịch | dịch trạm | trạm hạc | Lạ |
| FAC-032 | Tiên Y Phường | nghề may | Huyền Thành | Quen |

## 6.8 Checklist nghiệm thu phe phái

- [ ] 12 đạo thống khớp `schools-data › SCHOOLS` (12 id: zhengyi, quanzhen, maoshan, lushan, qingwei, shenxiao, beidi, dongyuan, lingbao, jingming, danding, fangshi).
- [ ] Không phe đạo thống nào bị mô tả «đúng nhất» hay «sai».
- [ ] Định Mệnh Hội: 8 mánh khớp DP1–DP8; 5 cấm phạm khớp RB1–RB5; mọi thành viên có đường hồi đầu.
- [ ] Không có giao tranh vũ lực giữa các phe.
- [ ] Người Miêu, Mộc Tượng Đường, Lỗ Ban (tổ nghề) không bị bôi nhọ.
- [ ] Âm Ty là cộng đồng người sống gìn giữ truyền thuyết, không tự xưng thần thật.
- [ ] Thiện cảm không tăng bằng Ngọc.
