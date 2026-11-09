# 04-31 · «Thầy đọc Mệnh Bàn» — khuôn lời đọc và đầu ra mẫu cho 15 lá số

## 0. Mục đích

Khi người chơi bấm «Thầy đọc cho con» ở Mệnh Bàn, Thầy Tử Bình nói một đoạn **sáu câu** tóm lá số. Bản web có Thầy AI nhưng đoạn này **không cần AI**: dựng bằng khuôn từ Mệnh Bàn (tất định, đúng T5, chạy cả trên iOS). Đầu ra mẫu dưới đây là **đáp án vàng** cho 06 (Thầy AI được so với nó để không nói lệch) và cho kiểm thử.

## 1. Khuôn sáu câu

| # | Câu | Nguồn | Luật |
|---|---|---|---|
| 1 | Hình ảnh nhật chủ | `tinhKhi` → `PROFILES[gan].temperament` (rút gọn hình ảnh đầu) | không dùng `health`, `finance`, `love`, `career` |
| 2 | Hành cần nhất và tình trạng | `thienMenh.dung` + tầng Tiên Thiên của Dụng | tầng 0: «còn để ngỏ — đường của con đã rõ»; tầng ≥ 4: «đã dày — việc của con là dùng nó cho người khác» |
| 3 | Mệnh Cách và lối | `menhCach` | dùng tên lớp và người dẫn; không dùng chữ «bại» ở câu này |
| 4 | Sở trường | trục trội Ngũ Duy + một Đặc Tính nổi bật (ưu tiên: kiếp số → song nhận → sao hiếm < 10% → sao bậc II) | Đặc Tính kiếp số nói bằng «ải», không bằng «hạn» |
| 5 | Chỗ đáng tu | trục Bổ Khuyết; nếu trục = 0 dùng câu «tiếng lạ» | luôn kèm lối đi |
| 6 | Năm nay + câu kết | `thoiVan` (tên mặt trước 04-13 §4.3) + một câu `STAT-LOI-*` hợp ngữ cảnh | không nói số Tiềm Lực |

Độ dài: 6 câu, mỗi câu ≤ 35 chữ. Không câu nào chứa con số Tiềm Lực, bách phân vị, hay chữ ở 04-13 §4.1.

## 2. Đầu ra mẫu

### `MAU-A` · 1990-05-15 08:30 nam

1. Con là chữ Canh — sắt thép, cương nghị, làm gì cũng dứt khoát.
2. Hành con cần nhất là Thủy, mà trong lá số Thủy còn để ngỏ — đường của con đã rõ.
3. Cách của con là Đắc Cứu: có bệnh, và thuốc nằm ngay trong lá số; Đan Đỉnh chân nhân sẽ chỉ con hai vị.
4. Con mạnh nhất ở chỗ có bạn đồng hành; lá số còn mang một ải «Ráng Chiều» — qua rồi con thành người dẫn đường.
5. Chỗ đáng tu là tay nghề; tìm một người khéo tay mà học.
6. Năm nay là Năm Hạn của con — đường dốc thì đi chậm, nhưng mỗi bước được hai bước.

### `MAU-B` · 1995-06-15 08:30 nam

1. Con là chữ Đinh — ngọn đèn, ấm và tinh tế.
2. Hành con cần nhất là Thủy, đã dày trong lá số — việc của con là dùng nó cho người khác.
3. Cách của con là Nghịch Thiên: Vân Cốc sau núi sẽ cùng con tháo nút; hai nút đã có thuốc trong lá số.
4. Con mạnh nhất ở việc học — chữ đến với con dễ hơn người khác.
5. Chỗ đáng tu là buôn bán, giữ của; tìm một người buôn giỏi mà học.
6. Mười năm này là vận đại thử thách, năm nay cũng là Năm Hạn — con chọn việc khó thì tu nhanh nhất đời.

### `MAU-C` · 1986-09-01 13:15 nữ

1. Con là chữ Mậu — núi cao, vững và đáng tin.
2. Hành con cần nhất là Mộc, đang còn mỏng — gieo một hạt rồi chờ, con sẽ hiểu.
3. Cách của con là Nghịch Thiên: cổng chính chưa mở thì có cổng phụ, Lão Tùng mở cho con.
4. Con mạnh nhất ở việc học; lá số còn mang sao Thiên Xá — một trăm người mới có một người.
5. Chỗ đáng tu là buôn bán, giữ của; tìm một người buôn giỏi mà học.
6. Mười năm này thuận, năm nay bình — lá số là hạt giống, không phải cái cây.

### `MAU-D` · 1999-03-05 07:15 nữ

1. Con là chữ Bính — mặt trời, nhiệt thành, lan tỏa.
2. Hành con cần nhất là Kim, mà lá số con không có chút Kim nào — con thiếu đúng thứ con cần, vậy đường đã rõ.
3. Cách của con là Nghịch Thiên: Vân Cốc sẽ cùng con tháo một nút.
4. Con mạnh nhất ở tay nghề, làm ra cái mới.
5. Lá số con không mang sao Tài — con học buôn bán như người lạ học một thứ tiếng, mà người học tiếng lạ thường nói chuẩn hơn.
6. Mười năm này là vận thử thách, năm nay là Năm Hạn — đường dốc thì đi chậm, nhưng mỗi bước được hai bước.

### `MAU-E` · 1989-04-14 22:00 nữ

1. Con là chữ Giáp — đại thụ, chính trực, có chí.
2. Hành con cần nhất là Hỏa, đang còn mỏng — giữ một ngọn đèn ba đêm, con sẽ hiểu.
3. Cách của con là Đắc Cứu: một vị thuốc, hái hai lần.
4. Con mạnh nhất ở chỗ biết thứ gì ở đâu thì quý; người con giúp sẽ quay lại giúp con.
5. Chỗ đáng tu là kỷ cương; tìm một người xử việc giỏi mà học.
6. Năm nay con bước qua cổng vận mới — cổng cũ đi được gì thì mang theo.

### `MAU-F` · 1957-02-22 17:30 nam

1. Con là chữ Ất — dây leo, mềm mà không gãy.
2. Hành con cần nhất là Kim, đã dày trong lá số — việc của con là dùng nó cho người khác.
3. Cách của con là Đắc Cứu: một vị thuốc kép — con chọn hái ở Yên Tử hay ở Thư Lâu.
4. Con mạnh nhất ở chỗ giữ kỷ cương; lá số mang một ải «Thân Chắn» — kiếp dành cho người dám đứng ra.
5. Chỗ đáng tu là buôn bán, giữ của.
6. Mười năm này thuận; năm nay là Năm Hạn — chọn việc khó thì tu nhanh.

### `MAU-G` · 1969-09-10 09:00 nam

1. Con là chữ Mậu — núi cao, vững và đáng tin.
2. Hành con cần nhất là Hỏa, đã có lực trong lá số.
3. Cách của con là Thuận Thiên: cách nguyên vẹn; việc của con là giữ.
4. Con mạnh nhất ở tay nghề; lá số còn mang một ải «Ráng Chiều».
5. Lá số con không mang sao Quan — con học kỷ cương như người lạ học một thứ tiếng.
6. Mười năm này là đỉnh vận — thuận gió thì đi xa, nhưng nhớ ai chèo cùng mình.

### `MAU-H` · 2003-08-10 06:45 nữ

1. Con là chữ Ất — dây leo, mềm mà không gãy.
2. Hành con cần nhất là Kim, đã có lực trong lá số.
3. Cách của con là Thuận Thiên: cách nguyên vẹn; việc của con là giữ.
4. Con mạnh nhất ở chỗ có bạn đồng hành; lá số còn mang ải «Hồi Sinh» — dựng lại một ngôi miếu qua bốn mùa.
5. Chỗ đáng tu là tay nghề.
6. Mười năm này thuận; năm nay gợn — chừng ấy gió chỉ đủ mát.

### `MAU-I` · 1997-03-17 05:00 nữ

1. Con là chữ Mậu — núi cao, vững và đáng tin.
2. Hành con cần nhất là Hỏa, đã có lực trong lá số.
3. Cách của con là Đắc Cứu: một vị thuốc ở Thư Lâu Lâm.
4. Con mạnh nhất ở chỗ giữ kỷ cương; lá số mang một ải «Bạch Hổ» — người qua kiếp này thường là người cứu tai.
5. Chỗ đáng tu là tay nghề.
6. Mười năm này là đỉnh vận — trời cho sẵn thì phải giữ.

### `MAU-J` · 1972-05-12 22:15 nam

1. Con là chữ Quý — mưa móc, kín đáo, nhẫn nại.
2. Hành con cần nhất là Mộc, đã dày trong lá số — việc của con là dùng nó cho người khác.
3. Cách của con là Dị Cách: lá số đọc theo thế, như biển tìm chỗ chảy ra; Phương sĩ sẽ dạy con.
4. Con mạnh nhất ở chỗ có bạn đồng hành; con có sao Quý Nhân hai lần.
5. Chỗ đáng tu là kỷ cương.
6. Mười năm này gợn; năm nay gợn — Thầy nhắc: năm nào gặp đất đắp đê, đừng phá đê, tìm khe mà chảy.

### `MAU-K` · 1992-10-12 07:15 nữ

1. Con là chữ Tân — châu ngọc, thanh tú, cầu toàn.
2. Hành con cần nhất là Thủy, đã dày trong lá số — việc của con là dùng nó cho người khác.
3. Cách của con là Dị Cách: một hành tuyệt đối, tiết ra ngoài thì thành.
4. Con mạnh nhất ở chỗ có bạn đồng hành; quý nhân của con là người con tự giúp.
5. Chỗ đáng tu là kỷ cương.
6. Mười năm này là vận đại thử thách — đúng mười năm thế của con bị thử; trời cho sẵn thì phải giữ.

### `MAU-L` · 1999-03-07 16:15 nữ

1. Con là chữ Mậu — núi cao, vững và đáng tin.
2. Hành con cần nhất là Hỏa, đã có lực trong lá số.
3. Cách của con là Thuận Thiên: cách nguyên vẹn; việc của con là giữ — và hai cổng vận phía trước là chỗ gió lùa.
4. Con mạnh nhất ở chỗ giữ kỷ cương; con có sao Thiên Đức — trời che chở người có lòng.
5. Chỗ đáng tu là buôn bán, giữ của.
6. Mười năm này hơi thuận, năm nay bình — trời cho sẵn thì phải giữ, giữ khó hơn được.

### `MAU-M` · 1966-05-26 20:15 nam

1. Con là chữ Ất — dây leo, mềm mà không gãy.
2. Hành con cần nhất là Hỏa, đã dày trong lá số.
3. Cách của con là Dị Cách — thế của con đang bị cưỡng; Phương sĩ sẽ cho con chọn: giữ thế, hay về đường thường.
4. Con mạnh nhất ở tay nghề; lá số còn mang một ải «Ráng Chiều».
5. Lá số con không mang sao Tỷ — con học có bạn như người lạ học một thứ tiếng.
6. Mười năm này gợn; năm nay gợn — cây non cần cọc, có cọc là đang lớn.

### `MAU-N` · 2000-02-29 (không rõ giờ) nữ

1. Con là chữ Đinh — ngọn đèn, ấm và tinh tế.
2. Thầy tạm lấy giờ Ngọ: hành con cần nhất là Thủy, đang còn để ngỏ — mấy chỗ có chấm hỏi là chỗ thầy đoán.
3. Cách của con là Nghịch Thiên — mười hai giờ đều ra cách ấy, nên đường này chắc.
4. Con mạnh nhất ở chỗ có bạn đồng hành; con có ba sao quý nhân.
5. Chỗ đáng tu là kỷ cương.
6. Năm nay là Năm Hạn — không biết giờ thì thầy đọc phần chắc trước; phần chưa chắc, con tu thì cũng như nhau cả.

### `MAU-O` · 1989-04-18 23:30 nữ

1. Con là chữ Kỷ — đất ruộng, ôn hòa, cần mẫn (con sinh giờ Tý sớm, sách tính sang ngày hôm sau).
2. Hành con cần nhất là Kim, đã có lực trong lá số.
3. Cách của con là Đắc Cứu: một vị thuốc kép.
4. Con mạnh nhất ở chỗ có bạn đồng hành.
5. Chỗ đáng tu là việc học; tìm một người học giỏi để học cách học.
6. Mười năm này bình; năm nay gợn — mười năm bình là mười năm làm được việc nhất.

## 3. Quy tắc chọn câu 6

| Đại vận \ Lưu niên | Năm đỉnh / Thuận | Bình | Gợn | Năm thử thách / Năm Hạn |
|---|---|---|---|---|
| Đỉnh vận / Thuận | «thuận gió thì đi xa — nhớ ai chèo cùng mình» | «thuận gió» | «gió nhẹ ngược chỉ đủ mát» | «trong thuận có dốc — dốc thì đi chậm» |
| Bình / Hơi thuận | «năm nay nắng đẹp» | «mười năm bình là mười năm làm được việc nhất» | «gợn chút thôi» | «đường dốc thì đi chậm, mỗi bước được hai bước» |
| Gợn / thử thách | «năm nay là chỗ nghỉ chân giữa dốc» | «giữa dốc có đoạn bằng» | «cây non cần cọc» | «con chọn việc khó thì tu nhanh nhất đời» |

Nếu Phẩm căn PC1–PC3 thì thêm câu `STAT-LOI-02` hoặc `STAT-LOI-03` làm vế cuối; nếu PC8–PC10 thì `STAT-LOI-20`.

## 4. Checklist nghiệm thu phần 04-31

- [ ] Khuôn dựng tất định từ Mệnh Bàn; không gọi AI.
- [ ] 15 đầu ra mẫu khớp dữ liệu 04-09 / 04-10.
- [ ] Không câu nào chứa Tiềm Lực, bách phân vị, chữ cấm.
- [ ] Thầy AI (06) khi tóm Mệnh Bàn không mâu thuẫn đầu ra khuôn.
