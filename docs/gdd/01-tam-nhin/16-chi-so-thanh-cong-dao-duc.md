# 01 · Phần 16 — Chỉ số thành công và tuyên ngôn kiếm tiền có đạo đức

> Chỉ số đo **trụ cột có đang đứng không**, không chỉ đo tăng trưởng. Mỗi chỉ số có định nghĩa chính xác (tử số, mẫu số, cửa sổ, nhóm), mục tiêu, ngưỡng báo động, nguồn dữ liệu và trụ cột liên quan. Phần cuối là **tuyên ngôn kiếm tiền** — văn bản công bố được cho người chơi.

## 1. Quy ước đo

### 1.1 Định nghĩa chung

| Thuật ngữ | Định nghĩa |
|---|---|
| **Người chơi mới (ngày 0)** | tài khoản hoàn tất form ngày sinh ở cổng lần đầu trong ngày đó (giờ máy chủ) |
| **Hoạt động** | có ít nhất một phiên ≥ 2 phút trong ngày |
| **D*n*** | người chơi mới ngày 0 có hoạt động vào **đúng** ngày *n* (không cộng dồn) |
| **Phiên** | từ lúc vào cảnh tới lúc thoát hoặc 10 phút không thao tác |
| **Tuần hoạt động** | có hoạt động ≥ 1 ngày trong 7 ngày lịch |

### 1.2 Nhóm điểm (dữ liệu tối thiểu)

Để đo trụ cột T2 mà **không gửi Tiềm Lực thật** (T6, canon §10, phần 2 §7), máy người chơi chỉ gửi **nhãn nhóm**, và chỉ khi người chơi đồng ý chia sẻ dữ liệu phân tích:

| Nhóm | Tiềm Lực | Phẩm căn tương ứng |
|---|---|---|
| `NA` | < 36 | Phàm Căn, Ngũ Linh Căn |
| `NB` | 36–49 | Tứ Linh Căn, Tứ Linh Căn thuận |
| `NC` | 50–65 | Tam Linh Căn, Tam Linh Căn thượng |
| `ND` | ≥ 66 | Song Linh Căn trở lên |

Kèm **Mệnh Cách** (4 nhãn) và **nền tảng** (web / iOS / Android web). **Không** gửi ngày sinh, giờ sinh, điểm cụ thể, Dụng thần.

### 1.3 Nhóm tuổi

Từ nhóm tuổi `T0`–`T4` (phần 8 §1.1), gửi nhãn nhóm, không gửi tuổi.

## 2. Bảng chỉ số

### 2.1 Trải nghiệm đầu và giữ chân

| Mã | Tên | Định nghĩa | Cửa sổ / nhóm | Mục tiêu | Báo động | Trụ cột |
|---|---|---|---|---|---|---|
| `KPI-01` | Hoàn tất Mở đầu | số người tới nhịp P8 (phần 6 §4.1) ÷ số người hoàn tất form ngày sinh | trong 48 giờ từ ngày 0 | ≥ 75 % | < 65 % | T1, T2 |
| `KPI-02` | D1 | số D1 ÷ số người mới ngày 0 | theo ngày ra mắt | ≥ 40 % | < 30 % | — |
| `KPI-03` | D7 | số D7 ÷ số người mới ngày 0 | — | ≥ 18 % | < 12 % | — |
| `KPI-04` | **Chỉ số công bằng mệnh** | D7(`NA`) ÷ D7(`ND`) | cửa sổ 4 tuần, ≥ 300 người / nhóm | **≥ 1,00** (bản sơ đồ §13.5: không thấp hơn) | < 0,90 | **T2** |
| `KPI-05` | Rời sau lễ lật trụ | số người xong lễ lật trụ (P3) nhưng **không** tới P6 trong phiên đó **và** không quay lại trong 72 giờ ÷ số người xong P3 | theo nhóm điểm | chênh `NA` − toàn bộ ≤ 3 điểm % | > 5 điểm % | **T2** |
| `KPI-06` | D30 | số D30 ÷ số người mới ngày 0 | — | ≥ 8 % | < 5 % | — |
| `KPI-07` | Mệnh Đồ tuần đầu | số người mở Mệnh Đồ **và** xong ≥ 1 tầng trong 7 ngày ÷ số người mới | — | ≥ 60 % (bản sơ đồ §13.5) | < 45 % | T2 |
| `KPI-08` | «Game hiểu mình» | điểm trung bình câu khảo sát sau Mở đầu: «Mệnh Bàn mô tả đúng bạn» (1–5) | người trả lời ≥ 200 / tuần | ≥ 4,0 và ≥ 70 % chọn 4–5 | < 3,5 | T1 |
| `KPI-09` | Dùng «Vì sao?» | số người bấm «Vì sao?» ≥ 1 lần trong phiên đầu ÷ số người mới | phiên đầu | ≥ 50 % | < 30 % | T1 |

### 2.2 Tu, cảm xúc, hành trình

| Mã | Tên | Định nghĩa | Cửa sổ / nhóm | Mục tiêu | Báo động | Trụ cột |
|---|---|---|---|---|---|---|
| `KPI-10` | Tu không vì thưởng | số người có ≥ 2 hoạt động tĩnh **ngoài nhiệm vụ** (trà, tọa thiền tự do, ngắm cảnh ≥ 10 s) trong tuần ÷ người hoạt động tuần | tuần | ≥ 40 % | < 25 % | T3 |
| `KPI-11` | Tới Côn Lôn | số người tới Vĩ thanh ÷ số người bắt đầu Hồi II | 120 ngày | ≥ 30 % | < 15 % | — |
| `KPI-15` | Tỷ lệ hồi đầu | số người nhận «Hồi Đầu» ÷ số người nhận Âm Bài | trong 30 ngày từ khi nhận Âm Bài | ≥ 70 % | < 50 % | T2, T6 |
| `KPI-16` | Tỷ lệ vào Tà Lộ (chẩn đoán) | số người nhận Âm Bài ÷ số người tới cảnh Lỗ Ban mời | — | **15–40 %** (dưới: cám dỗ yếu; trên: chính lộ nhạt) | ngoài 10–50 % | T2 |
| `KPI-17` | Nại Hà có người thật | số lượt Nại Hà hoàn tất với người chơi thật ÷ tổng lượt Nại Hà | tuần | ≥ 50 % | < 30 % | — |
| `KPI-30` | «Game giúp tôi bình tâm» | điểm khảo sát hằng tháng (1–5) | ≥ 300 người | ≥ 4,0 | < 3,5 | T3, T6 |
| `KPI-31` | Thiên Bảng công bằng | tỷ lệ `NA` + `NB` trong top 100 Đạo Hạnh mùa ÷ tỷ lệ `NA` + `NB` trong người chơi tới cảnh giới 4 | mùa | ≥ 0,8 | < 0,6 | **T2** |
| `KPI-32` | Sư đồ có kết quả | số sư phụ có ≥ 1 đệ tử xong Mệnh Đồ ÷ số sư phụ | mùa | ≥ 40 % | < 20 % | — |

### 2.3 Đúng cổ pháp và an toàn AI

| Mã | Tên | Định nghĩa | Cửa sổ | Mục tiêu | Báo động | Trụ cột |
|---|---|---|---|---|---|---|
| `KPI-12` | `checkNeo` | điểm `checkNeo` trung bình của câu trả lời AI hiển thị; và tỷ lệ câu < 70 điểm | tuần | trung bình ≥ 90; < 70 điểm ≤ 2 % | < 85 hoặc > 5 % | **T5** |
| `KPI-13` | An toàn AI | (a) bộ test RB1–RB5 + khủng hoảng: tỷ lệ đúng nhánh; (b) số câu trả lời bị người chơi báo «có hại» được xác nhận / 10.000 câu | (a) mỗi bản build; (b) tuần | (a) 100 %; (b) ≤ 1 | (a) < 100 %; (b) > 3 | **T6** |
| `KPI-14` | Chuyển hướng khủng hoảng | số lần NPC rời vai đưa thông tin hỗ trợ | tuần | **không đặt mục tiêu**; chỉ theo dõi và kiểm mẫu ngẫu nhiên 20 lượt / tuần về chất lượng | mẫu kiểm có lỗi | T6 |
| `KPI-23` | Hiệu đính cổ pháp | số báo lỗi cổ pháp được phản hồi trong 7 ngày ÷ tổng báo lỗi | tháng | ≥ 90 % | < 70 % | T5 |
| `KPI-24` | Đối chiếu trang chính | test tự động: số lá số mẫu cho kết quả trùng trang chính ÷ tổng lá số mẫu | mỗi bản build | 100 % | < 100 % (chặn phát hành) | **T1, T5** |

### 2.4 Cộng đồng và an toàn xã hội

| Mã | Tên | Định nghĩa | Cửa sổ | Mục tiêu | Báo động | Trụ cột |
|---|---|---|---|---|---|---|
| `KPI-18` | Miệt thị căn cốt | số báo cáo xác nhận về miệt thị căn cốt / 1.000 tin nhắn | tuần | ≤ 0,5 | > 1 | T2 |
| `KPI-22` | Cảm nhận bị ép / mê tín | tỷ lệ người chọn «game ép tôi mua» hoặc «game cổ xúy mê tín» trong khảo sát tháng | tháng | ≤ 3 % | > 6 % | T6 |

### 2.5 Kinh tế (đo để **giữ ranh giới**, không để tối đa hóa)

| Mã | Tên | Định nghĩa | Cửa sổ | Mục tiêu | Báo động | Trụ cột |
|---|---|---|---|---|---|---|
| `KPI-19` | Tỷ lệ người trả tiền | số người có giao dịch thật ÷ người hoạt động tháng | tháng | đủ nuôi máy chủ và đội (tài liệu 11 đặt sàn) — **không** đặt trần tăng trưởng | dưới sàn | — |
| `KPI-20` | Vượt trần chi tiêu | số người chạm trần chi tiêu tháng (mặc định hoặc tự đặt) ÷ người trả tiền | tháng | theo dõi; ≤ 5 % | > 10 % → xem lại giá / thiết kế | T6 |
| `KPI-21` | Hoàn tiền | số giao dịch hoàn tiền ÷ tổng giao dịch | tháng | ≤ 2 % | > 4 % | T6 |
| `KPI-33` | Tập trung doanh thu | phần doanh thu từ 1 % người trả nhiều nhất | quý | ≤ 30 % | > 45 % → dấu hiệu phụ thuộc người chi quá tay | T6 |

### 2.6 Chất lượng kỹ thuật, trợ năng, sức khỏe người chơi

| Mã | Tên | Định nghĩa | Cửa sổ | Mục tiêu | Báo động | Trụ cột |
|---|---|---|---|---|---|---|
| `KPI-25` | Trợ năng | số mục `TN-01`…`TN-15` đạt trên màn mới ÷ tổng mục áp dụng | mỗi mốc | 100 % | < 100 % | — |
| `KPI-26` | Khung hình | số phiên có khung hình trung bình ≥ 30 ÷ tổng phiên | tuần | ≥ 90 % | < 80 % | T4 |
| `KPI-27` | iOS ngang hàng | D7(iOS) ÷ D7(web) | 4 tuần | ≥ 0,8 | < 0,65 | — |
| `KPI-28` | Độ dài phiên lành mạnh | trung vị độ dài phiên | tuần | **trong khoảng** 15–35 phút (không tối đa hóa) | < 8 hoặc > 60 | — |
| `KPI-29` | Chơi quá dài | số phiên > 3 giờ liên tục ÷ tổng phiên | tuần | ≤ 2 % | > 4 % | T6 |
| `KPI-34` | Vị thành niên khuya | số phiên của nhóm `T0` sau 23:00 ÷ phiên `T0` | tuần | ≤ 5 % | > 10 % | T6 |

## 3. Đo theo chân dung và nhóm

| Câu hỏi | Chỉ số | Cắt theo |
|---|---|---|
| Lá số thấp có bị bỏ rơi? (PS-02) | `KPI-04`, `KPI-05`, `KPI-31` | nhóm điểm |
| iOS có đủ? (PS-03) | `KPI-27`, `KPI-01` | nền tảng |
| Người hành động có ở lại? (PS-04) | `KPI-03` | nguồn cài (quảng cáo game hành động) |
| Người lớn tuổi có dùng được? (PS-05) | `KPI-01`, `KPI-25` | nhóm tuổi `T3`, `T4` |
| Chuyên gia có tin? (PS-06) | `KPI-24`, `KPI-23`, `KPI-12` | — |
| Cặp đôi có lệch tiến độ? (PS-07) | tỷ lệ cặp đạo lữ cùng hoạt động sau 14 ngày | quan hệ |
| Lá số cao có thấy bị phạt? (PS-08) | `KPI-03` nhóm `ND`; câu khảo sát «game công bằng» | nhóm điểm |
| Người hoài nghi có thấy bị giảng? (PS-09) | `KPI-22` | nguồn cài |
| Tà Lộ có đường về? (PS-10) | `KPI-15`, `KPI-16` | — |

**Luật dùng số theo nhóm:** chỉ báo cáo nhóm có ≥ 300 người để tránh nhận diện cá nhân.

## 4. Chỉ số ta **không** tối đa hóa

| Chỉ số | Vì sao không |
|---|---|
| Thời gian chơi trung bình mỗi ngày | tối đa hóa kéo theo thiết kế ép (U2, U3); ta đo trong khoảng lành mạnh (`KPI-28`) |
| Doanh thu trung bình mỗi người trả tiền | đẩy lên thường nghĩa là khai thác người chi quá tay (`KPI-33`) |
| Số thông báo đẩy được mở | dẫn tới thông báo dọa (U4) |
| Chuỗi điểm danh dài nhất | dẫn tới phạt nghỉ |
| Số lượt hỏi AI | dẫn tới khuyến khích hỏi bói nhiều; AI có giới hạn ngày là đúng |

## 5. Tuyên ngôn kiếm tiền có đạo đức

> Văn bản dưới đây được công bố trong game (Sổ › «Lời người làm game») và trên trang web, bằng lời của đội làm game.

### Huyền Giới kiếm tiền thế nào

1. **Chúng tôi không bán tu.** Đạo Hạnh, cảnh giới, công đức, Mệnh Đồ, vị trí trên Thiên Bảng không mua được bằng tiền, Ngọc hay VIP.
2. **Chúng tôi không bán cải mệnh, không bán bói, không bán giải hạn.** Mọi «cách hóa giải» trong game là việc người chơi tự làm và miễn phí — đúng như app Bát Tự gốc đã cam kết. Ai bán cho bạn lễ «đổi mệnh» trong game, đó là Định Mệnh Hội.
3. **Chúng tôi bán những thứ để nhìn và để tiện:** trang phục, phụ kiện, hiệu ứng, ngự vật, khung tên, trang trí nhà riêng, thêm ô lưu lá số khách, thêm lượt hỏi Thầy AI mỗi ngày. Món bộ «Hợp mệnh» cho thêm Phúc Khí (tiền trong game) khi giải án, và **không** ảnh hưởng Đạo Hạnh.
4. **Không quay thưởng ngẫu nhiên trả tiền.** Bạn luôn biết mình mua món gì trước khi trả.
5. **Không bán vật thiêng.** Ca-sa, pháp y, hình tượng Phật, Bồ-tát, thần linh không bao giờ là hàng. Một số y phục chỉ được **trao** khi bạn đi hết một con đường tu trong game.
6. **Giá rõ ràng.** Giá hiện bằng tiền thật của bạn trước khi bấm; mọi giao dịch xác nhận hai bước; Ngọc mua được hiện cả số tiền tương ứng.
7. **Không đếm ngược, không dọa.** Không «chỉ còn 2 giờ», không thông báo «năm hạn» để bán hàng. Món theo mùa ghi ngày kết thúc mùa, một lần.
8. **Trần chi tiêu.** Mỗi tài khoản có trần chi tiêu tháng mặc định; bạn tự hạ được, muốn nâng phải chờ 72 giờ. Tài khoản dưới 18 tuổi có trần thấp hơn và cần người lớn xác nhận khi mua.
9. **NPC không bán hàng.** Không thầy, không sư, không NPC dẫn đạo nào nhắc tới cửa hàng, Ngọc hay VIP. Chỉ người bán ở quầy Tàng Y Các nói về đồ — và không nói về vận.
10. **VIP là tiện ích, không là đặc quyền tu.** VIP được Ngọc mỗi ngày, thêm lượt hỏi AI (câu trả lời như nhau), một số món trang phục; VIP không mở sớm bay hay bất cứ thứ gì gắn với cảnh giới.
11. **Dữ liệu của bạn.** Ngày giờ sinh chỉ lưu trên máy bạn. Chúng tôi không bán dữ liệu, không dùng lá số để chọn quảng cáo.
12. **Hoàn tiền.** Mua nhầm trong 48 giờ và chưa dùng món: hoàn lại (theo chính sách nền tảng).
13. **Kiểm toán công khai mỗi năm.** Chúng tôi công bố danh sách mọi món bán, mọi thay đổi giá, và đối chiếu với 12 điều trên. Nếu bạn thấy điều nào bị vi phạm, báo ở Sổ › «Góp ý» — chúng tôi trả lời công khai.

### 5.1 Mẫu tối kỵ (dark patterns) — danh sách cấm cho thiết kế cửa hàng

| Mẫu | Cấm vì |
|---|---|
| tiền ảo nhiều lớp (tiền A đổi tiền B đổi món) để giấu giá | điều 6 |
| gói «ưu đãi» giá lẻ không khớp số Ngọc cần, để dư lẻ | điều 6 |
| nút «Mua» to, nút «Không» nhỏ / xám | điều 6, U12 |
| bật cửa hàng khi người chơi vừa thất bại hoặc vừa nghe tin xấu về lá số | điều 2, 7 |
| món «chỉ còn N chiếc» giả | điều 7 |
| xếp hạng người chi tiêu | điều 1 |
| quà «miễn phí» cần đăng nhập liên tiếp dài để không mất | U2 |
| ẩn nút hủy VIP | điều 6 |

## 6. Nhịp xem số

| Nhịp | Ai xem | Xem gì | Quyết định gì |
|---|---|---|---|
| Hằng tuần | sản xuất, thiết kế, người giữ trụ cột | §2.1–2.4, `KPI-26` | sửa nóng nội dung, AI |
| Hằng tháng | toàn đội | toàn bảng, khảo sát | ưu tiên mốc kế |
| Mỗi mốc M0–M6 | người giữ trụ cột | checklist các phần 1–14 + `KPI-24`, `KPI-25`, `KPI-13` | cho / chặn phát hành |
| Hằng năm | công khai | kiểm toán kiếm tiền (§5 điều 13) | công bố |

**Quyền chặn:** `KPI-24` < 100 %, `KPI-13`(a) < 100 %, hoặc vi phạm điều 1–5 của §5 → **không phát hành** bản build, bất kể chỉ số khác.
