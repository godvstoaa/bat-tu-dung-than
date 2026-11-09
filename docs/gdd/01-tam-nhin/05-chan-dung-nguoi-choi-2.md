# 01 · Phần 5 — Chân dung người chơi (2/2): PS-06 đến PS-10 và tổng hợp

> Tiếp phần 4. Cuối phần là **ma trận rời bỏ** (ai rời ở đâu, vì sao), **ma trận giữ chân**, bảng yêu cầu thiết kế gộp, và cách dùng chân dung trong kiểm thử.

---

## PS-06 · Anh Tuấn — «Tôi sẽ bắt lỗi game này»

### Hồ sơ

| Mục | Nội dung |
|---|---|
| Đời thường | kỹ sư xây dựng, làm thêm tư vấn phong thủy nhà ở 8 năm, Hải Phòng; học Tử Bình và Huyền Không từ thầy |
| Quan hệ với app | dùng app làm công cụ tra nhanh; từng báo hai lỗi engine qua góp ý |
| Lá số | **`MAU-A`** (1990-05-15 08:30, nam): Canh Kim tháng Ngọ, Thân quá vượng, Dụng Thủy / Hỷ Kim, Tiềm Lực 41 (TRUNG ĐẲNG · Cân bằng → Tứ Linh Căn), 七殺格, Kim 55 %, Thủy 2 %; đại vận đang đi 甲申 (28–37 tuổi); tuổi Ngọ phạm Trị + Hình Thái Tuế năm 2026 丙午 |
| Hệ số Nghịch Thiên | 1 + (60 − 41)/100 = 1,19 |
| Thời gian chơi | tối muộn 22:30–0:30 (giờ Hợi – Tý), chơi dồn cuối tuần |
| Động cơ | (1) xem game có nói đúng không; (2) chiều sâu nghề: án khó, Dị Cách, Huyền Không; (3) được công nhận là người giỏi |
| Nỗi sợ | game đơn giản hóa sai; tên «linh căn» rẻ tiền; AI nói bừa |
| Câu nói | «Canh Kim tháng Ngọ, Kim 55 % mà bảo Thân nhược là tôi gỡ game.» |

### Hành trình 0 → 60 giờ

| Giờ | Làm gì | Cảm thấy | Nguy cơ rời | Điều giữ lại |
|---|---|---|---|---|
| 0 | Nhập `MAU-A`; mở song song trang chính trên tab khác | soi | — | — |
| 0,3 | So từng số: 41, Kim 55 %, Thủy 2 %, 七殺格 | **khớp — yên tâm** | **một số lệch là rời** | test đối chiếu T5 (`KT-T5-01`) |
| 0,5 | Thấy «Tứ Linh Căn» | nhăn mặt | «game tu tiên rẻ tiền» | dòng gốc «TRUNG ĐẲNG · Cân bằng» ngay dưới; cài đặt «Hiện tên gốc trước» |
| 0,7 | Khổng tiên sinh: «Canh Kim sinh tháng Ngọ, lửa luyện mà kim cứng. Năm nay Bính Ngọ, Thất Sát lâm năm…» | gật gù | AI bịa | `checkNeo`; không thêm dữ kiện |
| 1 | Bàn Thầy: hỏi Thầy AI câu bẫy («Dụng Hỏa đúng không?») | thử AI | AI chiều theo | AI giữ Dụng Thủy theo brief; RESTATE trước (thang `escalationLadder`) |
| 3 | Án khách khó nhất có thể chọn sớm | hài lòng nếu khó thật | án dễ | bộ lọc độ khó cho người đã chứng minh trình độ (5 án đúng liên tiếp) |
| 6 | Sảnh Tượng Pháp: game nói «theo Manh phái» | tôn trọng | trộn phái | `VD-T5-09` |
| 10 | Kết Hồi I; Mệnh Đồ tầng KHÔNG GIAN | — | — | bắt tay sửa nhà |
| 12 | Sửa nhà riêng: Huyền Không vận 9, kiểm sơn tinh hướng tinh | **chuyên môn được dùng** | sai vận | `VD-T5-10` |
| 15 | Phát hiện một câu khoa cử có đáp án tranh cãi | khó chịu | — | kênh «hiệu đính cổ pháp»; phản hồi ≤ 7 ngày (`CB-T5-03`) |
| 20 | Được ghi công «hiệu đính» trong Tàng kinh | **được công nhận** | — | danh sách hiệu đính công khai (tùy chọn ẩn tên) |
| 25 | Đình thí: đỗ cao, khắc bia | tự hào | — | dãy bia người chơi ở Văn Miếu |
| 30 | Định Mệnh Hội: án lừa đảo dùng kiến thức thật | rất thích | án nông | mỗi vùng một kiểu lừa khác (Thái Tuế giả, phong thủy giả, hợp hôn giả) |
| 35 | Hồi III năm hạn | thấy hợp lý: năm Kỵ Hỏa vượng | — | logic năm hạn minh bạch («Vì sao năm này?») |
| 45 | Hồi IV; Mao Sơn chẩn đoán đời thực trước phù | đồng ý | — | đúng nghề đạo đức của anh |
| 55 | Côn Lôn | — | — | — |
| 60 | Nhận ba đệ tử; mở «án Dị Cách» cuối game | — | hết án khó | mùa có án mới; án do cộng đồng đề xuất được duyệt |

### Ba khoảnh khắc quyết định

1. **Giờ 0,3.** Một con số lệch với trang chính là mất anh mãi mãi — và anh sẽ viết bài về điều đó.
2. **Giờ 1.** AI bị thử bằng câu bẫy. AI phải giữ dữ kiện, giải thích bằng lá số.
3. **Giờ 15–20.** Lỗi được tiếp nhận và ghi công biến người bắt lỗi thành người bảo vệ game.

### Yêu cầu thiết kế rút ra

- Cài đặt «Tên gốc trước»: Mệnh Bàn hiện gradeVi / chữ Hán làm nhãn chính, tên tu tiên làm phụ.
- Án khách có thang độ khó mở theo năng lực đã chứng minh, không theo cảnh giới.
- Kênh hiệu đính cổ pháp là **tính năng**, không chỉ là email hỗ trợ.

---

## PS-07 · Vy — «Chơi để ở cạnh người ta»

### Hồ sơ

| Mục | Nội dung |
|---|---|
| Đời thường | nhân viên chăm sóc khách hàng, Hà Nội; người yêu (Nam) làm ở Đà Lạt — yêu xa |
| Quan hệ với app | Nam dùng app; Vy chưa |
| Lá số giả định | Tiềm Lực 46 (Tứ Linh Căn thuận), **Dị Cách** (tòng cách: Dụng thuận theo thế mạnh), Đào Hoa, Thiên Ất Quý Nhân |
| Thời gian chơi | 21:30–23:00 cùng Nam qua gọi thoại; cuối tuần dài |
| Động cơ | (1) có một nơi chung với Nam; (2) đẹp, lễ hội; (3) chụp ảnh cặp |
| Nỗi sợ | game một người; bị lạc khi Nam đi trước; hợp hôn ra kết quả «không hợp» |
| Câu nói | «Tụi mình ở xa. Ở đây tụi mình đi bộ cạnh nhau được.» |

### Hành trình 0 → 60 giờ

| Giờ | Làm gì | Cảm thấy | Nguy cơ rời | Điều giữ lại |
|---|---|---|---|---|
| 0 | Nhập ngày sinh; Nam đứng chờ ở cổng (MMO) | vui | phải làm Mở đầu một mình | Mở đầu cho phép người bạn đứng xem, «đứng cạnh» trong lễ lật trụ |
| 0,5 | Dị Cách: Phương Sĩ Vô Danh nhận ra «cách lạ» | tò mò, thấy mình đặc biệt | — | nhánh `BR-DK` có giọng huyền bí nhẹ |
| 1 | Hợp Hôn với Nam ở Bàn Hợp Hôn | **lo** | **kết quả nghe như «không hợp»** | kết quả là «chỗ hai người bù cho nhau» (phần 3 §3); không có điểm «tỷ lệ hợp» to |
| 3 | Đồng tu hai người ở Trà Thất | ấm | — | ngồi cùng, uống trà cùng nhịp |
| 6 | Quý Nhân Phù: NPC tặng quà mỗi ngày | vui | — | — |
| 10 | Hồi I; Nam ở Hồi II | lo bị bỏ lại | **lệch tiến độ cặp** | nhiệm vụ đồng hành: người đi trước giúp người sau được thưởng «dẫn đường» (không bỏ qua nội dung của người sau) |
| 15 | Lễ Thượng Nguyên: dâng đèn chung | **đỉnh cảm xúc** | — | sự kiện máy chủ theo âm lịch |
| 20 | Chụp ảnh cặp ở Yên Tử lúc mây | vui | — | chế độ chụp ảnh có tư thế đôi (đứng cạnh, ngồi cạnh, chắp tay) |
| 25 | Kết nghĩa kim lan? Không — Vy chọn «đạo lữ» (bạn đồng tu) | — | không có lựa chọn phù hợp quan hệ yêu | quan hệ «đạo lữ» (Đạo giáo dùng cho bạn đồng tu) tách khỏi «kết nghĩa» |
| 30 | Nam vào Tà Lộ để «test» | giận | — | Vy có nhiệm vụ cứu Nam (Hồi IV, Nại Hà) |
| 45 | Nại Hà: Vy kéo Nam lên | **cao trào riêng của cặp** | — | cảnh MMO đôi, có nhạc riêng |
| 55 | Côn Lôn cùng nhau | — | — | vĩ thanh cho phép đứng cạnh nhau trước Thiên Mệnh Bàn |
| 60 | Sửa nhà chung ở Huyền Thành | — | — | nhà đôi: bát trạch hai quái mệnh (bài toán thật của phong thủy) |

### Ba khoảnh khắc quyết định

1. **Giờ 1.** Hợp Hôn là cửa ngõ của cặp. Lời phải xây, không phá (T2 + T6).
2. **Giờ 10.** Lệch tiến độ giữa hai người là lý do số một cặp đôi rời game MMO.
3. **Giờ 45.** Nại Hà là cảnh cặp đôi nhớ mãi. Cần ngân sách nhạc và camera.

### Yêu cầu thiết kế rút ra

- Mọi cảnh then chốt có chế độ «người đồng hành đứng xem».
- Quan hệ: đồng tu (ai cũng), đạo lữ (cặp, hai bên đồng ý), kết nghĩa (bạn), sư đồ. Hủy được, không phạt.
- Nhà chung tính bát trạch cho hai người là nội dung **thật** (T5), không giản lược.
- Dị Cách phải có giọng riêng (Phương Sĩ), không là bản sao của Thuận Thiên.

---

## PS-08 · Bảo — «Lá số 88 thì phải đứng đầu chứ»

### Hồ sơ

| Mục | Nội dung |
|---|---|
| Đời thường | quản lý sản phẩm công ty công nghệ, TP.HCM; chạy marathon; thích bảng xếp hạng |
| Quan hệ với app | đã xem lá số, chụp màn hình điểm 88 khoe |
| Lá số giả định | Tiềm Lực 88 (Thiên Linh Căn, ĐỈNH CAO HUYỀN THOẠI · CỰC PHẨM), Thuận Thiên, Mệnh Cấp «Quý Cách» |
| Hệ số Nghịch Thiên | 1 + (60 − 88)/100 = 0,72 → **kẹp 1,0** |
| Thời gian chơi | sáng sớm 5:30–6:15 (trước chạy bộ) và tối 22:00 |
| Động cơ | (1) đứng đầu; (2) tối ưu; (3) được nhìn nhận |
| Nỗi sợ | «game phạt người giỏi»; tốn thời gian không hiệu quả |
| Câu nói | «Hệ số của tôi là 1,0, người 24 điểm là 1,36. Vậy là game ghét người lá số tốt?» |

### Hành trình 0 → 60 giờ

| Giờ | Làm gì | Cảm thấy | Nguy cơ rời | Điều giữ lại |
|---|---|---|---|---|
| 0,3 | Lễ lật trụ: 88, Thiên Linh Căn | đắc ý | — | — |
| 0,4 | Mô tả bậc: «Trời ban sẵn — con đường là giữ, không phải cải. Thử thách chính: kiêu ngạo (tâm ma "mạn")» | hơi phật ý | — | lời thẳng mà tôn trọng |
| 0,6 | Khổng tiên sinh: phán toàn điều tốt rồi hỏi «tốt như vậy, con định làm gì với nó?» | bất ngờ | — | câu hỏi ngược cho cả lá số tốt |
| 1 | Thuận Thiên: được nhận ngay | — | — | — |
| 3 | Bảng Đạo Hạnh tuần: hạng 3 | hài lòng | — | khởi đầu cao (×0,4 Tiên Thiên = 35,2) |
| 8 | Thử thách BR-TT: khách quý xin mua lá số đẹp để ghép danh tính | **bài toán đạo đức thật** | — | chọn bán → Sổ Công Quá −, hệ quả truyện; chọn không → thoại khách đe dọa nhẹ, rồi chuỗi bảo vệ |
| 12 | Đọc «Vì sao hệ số của con 1,0?» | hiểu cơ chế | **thấy bất công** | Thầy Tử Bình: «Con khởi đầu ở bậc cao hơn. Đường của con là giữ và cho.» + chuỗi sư đồ mở sớm cho Thiên Linh Căn |
| 20 | Bị Minh (`PS-02`) vượt ở bảng tuần | **khó chịu** | rời | tâm ma «mạn» kích hoạt chuỗi riêng; vượt chuỗi nhận đặc tính «Khiêm» (thưởng công đức khi giúp người khác) |
| 25 | Nhận đệ tử đầu tiên | — | — | cơ chế sư đồ thưởng công đức thật: «cho» là cách người lá số cao tu nhanh nhất |
| 30 | Kết Hồi II | — | — | — |
| 35 | Hồi III: điểm thấp nhất 10 năm tới là 58 (đại vận tốt) | «dễ quá» | chán | `CB-T2-05`: thử thách chuyển sang giúp NPC khác qua hạn |
| 45 | Hồi IV chính lộ: cứu bạn ở Phong Đô | — | — | — |
| 55 | Côn Lôn; Thiên Bảng: cột Tiên Thiên hạng 1, cột Đạo Hạnh hạng 12 | **đã chấp nhận** | — | bảng tôn trọng cả hai sự thật |
| 60 | Dẫn 5 đệ tử; đứng đầu bảng «sư phụ tận tâm» | thành tích mới | — | bảng xếp hạng phụ theo **công đức trao đi** |

### Ba khoảnh khắc quyết định

1. **Giờ 12.** Bảo hiểu cơ chế rất nhanh. Câu trả lời phải vừa thật vừa cho anh một **con đường thành tích khác**.
2. **Giờ 20.** Bị người lá số thấp vượt. Chuỗi «mạn» phải là nội dung hay, không phải bài giảng.
3. **Giờ 60.** Người thích thành tích cần một bảng xếp hạng phù hợp giá trị game (công đức trao đi).

### Yêu cầu thiết kế rút ra

- Bảng xếp hạng phụ: «Sư phụ tận tâm» (đệ tử hoàn thành Mệnh Đồ), «Người dẫn đường» (giúp người mới).
- Lá số cao mở sư đồ sớm hơn (ngưỡng cảnh giới 4 có thể hạ cho Tiềm Lực ≥ 80 — tài liệu 10 quyết).
- Không câu thoại nào chế giễu lá số cao; thử thách của họ là đạo đức và tâm, không bị «trừng phạt cân bằng».

---

## PS-09 · Hùng — «Tôi không tin bói, nhưng game này thú vị»

### Hồ sơ

| Mục | Nội dung |
|---|---|
| Đời thường | kỹ sư phần mềm, Hà Nội; đọc nhiều về thiên kiến nhận thức; bạn gái tin tử vi |
| Quan hệ với app | không dùng; bạn gái rủ |
| Lá số giả định | Tiềm Lực 38 (Tứ Linh Căn), **Nghịch Thiên** (败格) dù điểm không thấp nhất |
| Thời gian chơi | tối 20:00–21:30; thích hệ thống, thống kê |
| Động cơ | (1) hiểu hệ thống; (2) game hay không cần tin; (3) chống lừa đảo (anh ghét thầy bói lừa) |
| Nỗi sợ | game giảng đạo; game tiếp tay mê tín |
| Câu nói | «Hiệu ứng Barnum. Nói chung chung thì ai cũng thấy đúng.» |

### Hành trình 0 → 60 giờ

| Giờ | Làm gì | Cảm thấy | Nguy cơ rời | Điều giữ lại |
|---|---|---|---|---|
| 0,4 | Mệnh Bàn, bấm «Vì sao?» mọi chỗ | bất ngờ vì minh bạch | — | `factors[]` chi tiết |
| 0,6 | Khổng tiên sinh phán | «Barnum» | **khinh** | ngay sau đó, game **tự nói** điều anh nghĩ: Thầy Tử Bình: «Lời phán đúng không có nghĩa là đời con phải theo.» |
| 1 | Nghịch Thiên dù 38 điểm | «tại sao?» | — | «Vì sao?» giải thích 败格 là chuyện **cấu trúc** (cách bị phá), không phải điểm |
| 3 | Án khách | thích như giải đố | — | án là bài toán logic trên hệ quy tắc |
| 6 | Đọc Liễu Phàm | «ẩn dụ hay về tự quyết» | giọng giảng | Vân Cốc kể chuyện, không giảng; câu hỏi ngược nhiều hơn câu khẳng định |
| 10 | Kết Hồi I | — | — | — |
| 15 | Định Mệnh Hội: dùng `detectionPatterns` vạch mặt | **rất thích** | — | đây là «game chống lừa đảo», giá trị thật ngoài đời |
| 20 | Đọc phần «Vì sao game cho lá số thấp hệ số cao?» | thấy thiết kế có chủ đích | — | Tàng kinh có mục «Lời người làm game» (tùy chọn) |
| 25 | Sửa nhà theo bát trạch | «quy tắc thú vị như board game» | — | — |
| 30 | Bạn gái hỏi anh «game có bảo hai đứa hợp không?» | — | — | Hợp Hôn khung «bù cho nhau» |
| 40 | Hồi III; từ chối Âm Bài | hợp lý | — | — |
| 50 | Hồi IV: Mao Sơn «phần lớn tà là mệt» | **tôn trọng game** | — | — |
| 60 | Viết bài review: «game về văn hóa, không phải bói» | đại sứ | — | — |

### Yêu cầu thiết kế rút ra

- Game **tự nói trước** lời phản biện của người hoài nghi (qua Thầy Tử Bình, Vân Cốc). Không phòng thủ.
- Mục «Lời người làm game» tùy chọn: giải thích lựa chọn thiết kế (T2) bằng giọng thẳng.
- Nhiệm vụ chống lừa đảo có giá trị ngoài đời (dấu hiệu nhận biết thầy bói lừa) — đây là cầu nối với người hoài nghi.
- Giọng không giảng đạo: tỷ lệ câu hỏi / câu khẳng định trong thoại NPC dẫn đạo ≥ 1 : 3 (phần 07 §1).

---

## PS-10 · Lan — «Cho tôi đường tắt»

### Hồ sơ

| Mục | Nội dung |
|---|---|
| Đời thường | nhân viên thiết kế thời trang, Đà Lạt; thích truyện kinh dị, phong cách u tối; hay chọn phe phản diện trong game |
| Quan hệ với app | có, xem cho vui |
| Lá số giả định | Tiềm Lực 30 (Ngũ Linh Căn), Đắc Cứu, Thương Quan mạnh (dễ vướng nghiệp «khẩu» theo `getYeguoForChart`) |
| Thời gian chơi | khuya 0:00–2:00 (giờ Tý – Sửu) |
| Động cơ | (1) thẩm mỹ u tối, Phong Đô, Miêu Cương; (2) lựa chọn có hệ quả; (3) cảm giác «nổi loạn» |
| Nỗi sợ | game «ngoan» quá, phán xét người chọn khác |
| Câu nói | «Game nào cũng bắt làm người tốt. Cho tôi xem cái giá của làm người xấu.» |

### Hành trình 0 → 60 giờ

| Giờ | Làm gì | Cảm thấy | Nguy cơ rời | Điều giữ lại |
|---|---|---|---|---|
| 0,5 | Thấy Thương Quan, tâm ma «khẩu» | thích (đúng tính mình) | — | Tính Khí cho giọng thoại sắc |
| 1 | Đắc Cứu: Đan Đỉnh chân nhân chỉ vị thuốc | — | nhàm | vị thuốc của Lan có một nơi ở Miêu Cương |
| 3 | Bật mục «Âm tà» (tự nguyện, xác nhận) | hồi hộp | — | cổng opt-in đúng `ETHICS`; Lan thấy được tôn trọng |
| 8 | Đi trước tới Miêu Cương; Vu y bà A Mậu | mê không khí | — | trại đẹp, không định kiến |
| 15 | Lần đầu nghe về yểm sư | — | — | tin đồn, dấu vết, không lộ hết |
| 30 | Hồi III, nhận Âm Bài **ngay** | sướng | — | ×2 Hậu Thiên 7 ngày; Nợ Âm công khai |
| 33 | NPC Trà Thất ốm; khách Sơn Môn bỏ về | khó chịu nhưng tò mò | **thấy bị phạt kiểu đạo đức giả** | hệ quả là **truyện**, không phải trừ chỉ số; NPC không trách Lan trực tiếp |
| 37 | Thầy Tử Bình không tiếp | **đau** | rời | Thầy không mắng; đóng cửa, để đèn sáng; một câu: «Thầy vẫn ở đây.» |
| 40 | Nợ Âm lớn; Lỗ Ban đòi thêm | thấy bị lợi dụng | — | Lỗ Ban lộ mặt thật: kẻ ác nhất là kẻ bảo mình «mệnh đã định» |
| 45 | Phong Đô: Phán quan đọc Sổ Công Quá của Lan | **xúc động mạnh** | — | sổ ghi đúng từng việc Lan đã chọn — không thêm, không bớt |
| 48 | Sám hối + cứu từng người đã hại | — | dài | độ dài tỷ lệ Nợ Âm; có thể đồng hành (người chơi khác giúp) |
| 50 | Nại Hà: Vy (hoặc người lạ) kéo lên | — | — | cảnh hợp tác |
| 52 | Danh hiệu «Hồi Đầu» | **tự hào** | — | khung tên hiếm; NPC kính trọng |
| 60 | Hướng dẫn người mới đang cám dỗ Tà Lộ (vai «Người Từng Qua») | có vai trò | — | danh hiệu cho phép kể chuyện cho người khác |

### Yêu cầu thiết kế rút ra

- Tà Lộ hấp dẫn thật trong giai đoạn đầu (sức mạnh, thẩm mỹ), cái giá đến **chậm và qua người khác**.
- Không NPC nào mắng người chơi Tà Lộ; thế giới im lặng đau. Đây là ngôn ngữ của hệ quả, không phải lời giảng.
- Hồi Đầu là danh hiệu đáng muốn **hơn** danh hiệu chính lộ ở một vài mặt (vai «Người Từng Qua»).
- Chơi khuya: Âm ty, Miêu Cương phải đẹp nhất về đêm (phần 12).

---

## 6. Ma trận rời bỏ (churn) theo chân dung

| Điểm rời | PS-01 | PS-02 | PS-03 | PS-04 | PS-05 | PS-06 | PS-07 | PS-08 | PS-09 | PS-10 | Biện pháp chính |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Form ngày sinh | | | ● | ● | | | | | | | hồ sơ app tự điền; dòng riêng tư; form một màn |
| Lễ lật trụ / điểm | | ●●● | | | | | | | | | thứ tự câu dẫn → lý do → số |
| Lời phán Khổng tiên sinh | ● | ●● | | | | ● (nếu bịa) | | | ●● | | câu hỏi ngược + cảnh Thầy ngay sau |
| Thao tác 3D | ● | | | | ●●● | | | | | | chạm để đi, chữ lớn |
| Án khách đầu | | | | ●●● | | ● (nếu dễ) | | | | | án trực quan ≤ 5 phút; độ khó theo năng lực |
| Người lạ / MMO | ●● | | | | ●● | | | | | | đồng tu im lặng; chat tắt trong điện |
| Lệch tiến độ bạn bè / cặp | | | | | | | ●●● | | | | nhiệm vụ dẫn đường |
| Bị người khác vượt | | | | ●● | | | | ●●● | | | tâm ma «mạn»; bảng phụ |
| Giọng giảng đạo | | | | ● | | | | | ●●● | ●● | tỷ lệ câu hỏi; NPC không mắng |
| Năm hạn liên hệ đời thật | ●● | ● | | | | | | | | | can chi, không năm dương lịch |
| Nội dung u tối (Phong Đô) | ● | | ● | | ●●● | | | | | | cài đặt «nhẹ nhàng» |
| Thiếu nội dung iOS | | | ●● | | | | | | | | biến thể iOS liền mạch |
| Dữ kiện sai | | | | | | ●●● | | | ● | | đối chiếu T5, `checkNeo` |
| Hệ quả Tà Lộ nặng | | | | | | | | | | ●● | hệ quả qua truyện, không trừ số |
| Hết nội dung khó | | | | ●● | | ●● | | ● | | | mùa, án cộng đồng, Thái Cực mới |

● thấp · ●● vừa · ●●● cao

## 7. Ma trận giữ chân

| Điều giữ chân | Người được giữ | Hệ thống | Trụ cột |
|---|---|---|---|
| «Game hiểu mình» (Mệnh Bàn đúng, «Vì sao?») | PS-01, 06, 09 | Mệnh Bàn | T1, T5 |
| Câu chuyện «mình làm được» (hệ số, bậc 4) | PS-02, 10 | cảnh giới, Thiên Bảng | T2 |
| Không gian đẹp, tĩnh | PS-03, 05 | thánh địa, ánh sáng | T4 |
| Kỹ năng có trần cao | PS-04, 06 | Thái Cực, đình thí, án Dị Cách | T3 |
| Cộng đồng lễ hội theo âm lịch | PS-05, 07 | sự kiện | T4 |
| Quan hệ (đạo lữ, sư đồ) | PS-07, 08 | xã hội | T3 |
| Chống lừa đảo | PS-06, 09 | Định Mệnh Hội | T5, T6 |
| Lựa chọn có hệ quả thật | PS-04, 10 | Tà Lộ, BR-TT | T2 |
| Được công nhận (hiệu đính, sư phụ) | PS-06, 08 | Tàng kinh, sư đồ | T5 |

## 8. Yêu cầu thiết kế gộp (rút từ 10 chân dung)

| Mã | Yêu cầu | Từ | Tài liệu thực thi |
|---|---|---|---|
| `YC-01` | Thứ tự hiển thị kết quả lễ lật trụ: câu dẫn (nếu điểm < 36) → lý do → số | PS-02 | 03, 12 |
| `YC-02` | Cảnh Thầy Tử Bình / Vân Cốc theo ngay sau lời phán Khổng tiên sinh (≤ 1 màn) | PS-01, 02, 09 | 03 |
| `YC-03` | Hồ sơ «Bản thân» từ app tự điền vào cổng | PS-01, 06 | 13 |
| `YC-04` | Chạm để đi, chữ 150 %, chế độ một ngón | PS-05 | 12 |
| `YC-05` | Án khách đầu dạng trực quan ≤ 5 phút; độ khó theo năng lực đã chứng minh | PS-04, 06 | 09 |
| `YC-06` | Đồng tu không cần chat | PS-01, 05 | 10 |
| `YC-07` | Biến thể iOS khai báo cho mọi nhiệm vụ chạm tính năng bị tắt | PS-03 | 03, 13 |
| `YC-08` | Mọi thánh địa đến thăm được sớm; truyện khóa chuỗi, không khóa chỗ | PS-05 | 07 |
| `YC-09` | Cài đặt «nhẹ nhàng» cho nội dung u tối | PS-05, 01 | 12 |
| `YC-10` | Nhiệm vụ dẫn đường cho người đi trước | PS-07 | 10 |
| `YC-11` | Bảng xếp hạng phụ theo công đức trao đi | PS-08 | 10 |
| `YC-12` | Kênh hiệu đính cổ pháp với ghi công | PS-06 | 06, 13 |
| `YC-13` | Tà Lộ: hệ quả qua người khác, chậm; NPC không mắng | PS-10 | 03, 05 |
| `YC-14` | Giọng NPC dẫn đạo: tỷ lệ câu hỏi ≥ 1 : 3 | PS-09 | 06 |
| `YC-15` | Chế độ chụp ảnh với tư thế đôi | PS-03, 07 | 12 |
| `YC-16` | Cài đặt «tên gốc trước» | PS-06 | 12 |
| `YC-17` | Hồi III hiện can chi, không năm dương lịch | PS-01 | 03 |
| `YC-18` | Quan hệ đạo lữ tách khỏi kết nghĩa | PS-07 | 10 |

## 9. Chân dung phụ (không có hành trình đầy đủ, nhưng phải tính)

| Mã | Ai | Điều cần tính |
|---|---|---|
| `PS-11` | Học sinh 15 tuổi (nhập ngày sinh thật) | chế độ vị thành niên (`VD-T6-15`): Tà Lộ tắt mặc định, trần chi tiêu, AI không bàn tình cảm sâu, giờ chơi khuya có nhắc nghỉ |
| `PS-12` | Người cao tuổi 70+ do con cháu cài | như `PS-05`, thêm: không đăng nhập phức tạp, chơi được không cần mạng (phần đơn) |
| `PS-13` | Người khiếm thị một phần | phóng to, tương phản cao, giọng đọc (phần 14 §6) |
| `PS-14` | Người đang khủng hoảng tinh thần, tìm đến game vì lá số | quy tắc khủng hoảng (`CB-T2-02`); không khuyến khích chơi khuya liên tục |
| `PS-15` | Người hành nghề tâm linh muốn dùng game quảng cáo dịch vụ | chặn quảng cáo trong chat / tên; Định Mệnh Hội là tấm gương |
| `PS-16` | Người Hoa / người nước ngoài đọc Hán tốt hơn Việt | cài đặt hiển thị Hán trước; bản địa hóa sau (tài liệu 12) |

## 10. Dùng chân dung thế nào trong sản xuất

1. **Mỗi spec** chọn 2–3 chân dung bị ảnh hưởng nhiều nhất, viết một dòng «PS-xx sẽ cảm thấy gì».
2. **Mỗi buổi chơi thử** tuyển người gần chân dung: tối thiểu một người lá số < 36, một người iOS, một người không chơi game hành động, một người ≥ 50 tuổi.
3. **Mỗi mốc M** đo `KPI-*` theo nhóm chân dung (phần 16 §3).
4. Khi hai chân dung muốn điều ngược nhau (Khoa muốn tua thoại, Hùng muốn đọc kỹ): làm **tùy chọn**, mặc định theo chân dung dễ tổn thương hơn.
