# 04-13 · An toàn và ngôn từ — nói về chỉ số mà không phán mệnh

## 1. Nguyên tắc

Trụ cột T2 «Mệnh do ta tạo» và T6 «Tôn trọng và an toàn» áp vào **mọi chữ** liên quan đến chỉ số: nhãn, tooltip, «Vì sao?», thoại NPC, thông báo, tên danh hiệu.

Game dùng đúng năm ranh giới của app (`anti-manipulation-data › REFUSAL_BOUNDARIES`) làm luật chữ:

| Ranh giới app | Áp vào chỉ số trong game |
|---|---|
| **RB1** — không tiên đoán y khoa tất định | Không chỉ số nào được diễn giải thành bệnh. Nguyên Khí là **thể lực trong game**, không phải sức khỏe thật. Không dùng `profile.health` (04-07 §4). Đặc Tính Huyết Nhận, Lưu Hà, Tai Sát: không thương tích, không bệnh, không thai sản (04-06 §2.4). |
| **RB2** — không xác nhận định mệnh tất định | Không câu nào dạng «số bạn là…», «bạn sẽ…», «không đổi được». Mọi chỉ số Tiên Thiên đi kèm lối Hậu Thiên. |
| **RB3** — không dùng lá số hại người khác | Không so lá số người chơi khác để «khắc» họ; `avoid` của nạp âm không có tác dụng (04-07 §5). |
| **RB4** — không khuyên tiền bạc tất thắng | Phúc phận là **Phúc Khí trong game**. Không dùng `profile.finance`. Không có chữ «giàu», «nghèo» gắn với người chơi. |
| **RB5** — không bán «giải mệnh» | Không SKU nào đổi chỉ số Tiên Thiên hay cộng Hậu Thiên (canon §7). Hóa giải trong game = hành động (Bổ Hành, Mệnh Đồ), miễn phí. |

## 2. Câu dẫn bắt buộc khi gặp điểm thấp

### 2.1 Câu gốc (canon bản sơ đồ tổng §4.7)

> «Lá số là hạt giống, không phải cái cây. Hạt nhỏ thì phải chăm nhiều hơn. Thầy chưa từng thấy ai chăm mà cây không lớn.»

Bắt buộc xuất hiện **một lần** trong lần đầu người chơi mở Mệnh Bàn nếu Tiềm Lực < 43 (Phẩm căn PC1–PC3), do Thầy Tử Bình nói; và luôn có ở cuối «Vì sao?» Tiềm Lực (xoay vòng với các biến thể dưới).

### 2.2 Biến thể theo ngữ cảnh — `STAT-LOI-*`

| Mã | Ngữ cảnh | Người nói | Câu |
|---|---|---|---|
| `STAT-LOI-01` | Phàm Căn, nghi lễ cổng | Lão Tùng | «Cổng chính dành cho khách. Cổng phụ dành cho người nhà. Con đi cổng phụ — lão mở cho.» |
| `STAT-LOI-02` | Phàm Căn / Ngũ Linh Căn, lần đầu xem Mệnh Bàn | Thầy Tử Bình | câu gốc §2.1 |
| `STAT-LOI-03` | «Vì sao?» Tiềm Lực (xoay vòng) | Thầy | «Con số này là chỗ con bắt đầu, không phải chỗ con dừng.» |
| `STAT-LOI-04` | «Vì sao?» Tiềm Lực (xoay vòng) | Thầy | «Mỗi dòng trừ điểm đều có một con đường đi kèm. Thầy chỉ cho con xem đường.» |
| `STAT-LOI-05` | «Vì sao?» Tiềm Lực (xoay vòng) | Thầy | «Liễu Phàm cũng từng bị đoán trước cả đời. Ông ấy đổi được. Sổ sách vẫn còn đó.» |
| `STAT-LOI-06` | Hành Dụng ở tầng Khuyết | Thầy | «Con thiếu đúng thứ con cần. Vậy đường của con đã rõ.» |
| `STAT-LOI-07` | Trục Ngũ Duy = 0 | Thầy | «Lá số của con không có sao này. Con học nó như người lạ học một thứ tiếng — người học tiếng lạ thường nói chuẩn hơn.» |
| `STAT-LOI-08` | Mệnh Cách Nghịch Thiên, sau cảnh bị từ chối | Vân Cốc | «Cửa đóng là để con biết có cửa. Ngồi xuống uống trà đã.» |
| `STAT-LOI-09` | Mệnh Cách Nghịch Thiên, Mệnh Đồ mở | Vân Cốc | «Cách vỡ không phải đời vỡ. Cái bình vỡ, người ta gắn vàng vào, còn quý hơn.» |
| `STAT-LOI-10` | Mệnh Cách Đắc Cứu | Đan Đỉnh chân nhân | «Có bệnh mới quý. Thuốc của con mọc ngay trong lá số của con — chỉ là mọc ở xa.» |
| `STAT-LOI-11` | Dị Cách bại | Phương sĩ Vô Danh | «Thế của con bị cưỡng. Con có hai đường, đường nào cũng tới.» |
| `STAT-LOI-12` | Mệnh Cấp «Ngọc Trong Đá» | Lão Tùng | «Đá xấu ngoài mà ngọc ở trong. Lão mở cổng cho con.» |
| `STAT-LOI-13` | Đại vận / lưu niên Hung, Đại hung | Thầy | «Năm nay đường dốc. Đường dốc thì đi chậm, nhưng mỗi bước được hai bước.» |
| `STAT-LOI-14` | Kiếp số (ải kiếp mở) | Thầy | «Kiếp là ải, không phải án. Qua ải thì thành người dẫn đường.» |
| `STAT-LOI-15` | Túc Nghiệp Địa Ngục Đạo | Diệu Âm (Hồi II) | «Ánh đèn con mang theo là ánh đèn của người đã dắt con ra. Giờ đến lượt con cầm đèn.» |
| `STAT-LOI-16` | Thân quá nhược | Thầy | «Cây non cần cọc. Có cọc không phải là yếu — là đang lớn.» |
| `STAT-LOI-17` | Phúc phận tiềm năng ẩn | (không ai nói — chuỗi ẩn tự kể bằng chi tiết lạ, 04-02 §5.5) | — |
| `STAT-LOI-18` | Giờ không rõ | Thầy | «Không biết giờ thì thầy đọc phần chắc trước. Phần chưa chắc, con tu thì cũng như nhau cả.» |
| `STAT-LOI-19` | Sửa bát tự lần 2 trở đi | Thầy | «Lá số thật mới dùng được. Lá số đẹp mà không phải của con thì con tu cho ai?» |
| `STAT-LOI-20` | Người chơi điểm cao mở Mệnh Bàn (PC8–PC10) | Thầy | «Trời cho sẵn thì phải giữ. Giữ khó hơn được.» |
| `STAT-LOI-21` | Người chơi so Tiềm Lực với bạn (mở cột Tiên Thiên trên Thiên Bảng) | Thầy | «Hai hạt giống khác nhau. Thầy chỉ xem cây.» |
| `STAT-LOI-22` | Lên cảnh giới 4 (Tiên Thiên thôi tính) | Thầy | «Từ hôm nay, lá số không còn đứng trước con nữa. Nó đứng sau lưng con.» |

Quy tắc: không câu nào chứa con số Tiềm Lực của người chơi. Thầy nói về **đường**, không nhắc lại **điểm**.

## 3. Khuôn giải thích mỗi chỉ số: Sự thật → Ý nghĩa → Lối đi

Mọi tooltip / «Vì sao?» viết theo ba phần, không bỏ phần nào:

| Phần | Nội dung | Ví dụ (Linh Tuệ của `MAU-A`) |
|---|---|---|
| **Sự thật** | con số và nguồn, không tính từ | «Thủy chiếm 2,2% lá số. Thủy là Dụng thần nên nhân 1,3 → lực 3.» |
| **Ý nghĩa** | trong game nó làm gì (không nói về đời thật) | «Đọc cổ thư, tượng pháp, du phương chưa có thêm lợi thế.» |
| **Lối đi** | việc cụ thể làm được ngay | «Chuỗi Bổ Thủy đang mở ở Thư Lâu Lâm. Mỗi tuần đọc 3 buổi thêm 3 điểm.» |

Không có tooltip nào chỉ có «Sự thật» mà thiếu «Lối đi» khi chỉ số ở mức thấp (tầng 0–1, trục 0–25, Tiềm Lực < 43, Thời Vận âm, kiếp số).

## 4. Danh sách chữ

### 4.1 Không bao giờ hiển thị

| Chữ (engine hoặc thường gặp) | Nguồn | Thay bằng |
|---|---|---|
| «bần tiện» | `classifyChartLevel.levelVi` (下格) | «Ngọc Trong Đá» |
| «Mệnh nhiều khó — cải vận + tích đức là then chốt» | `classifyChartLevel.note` | (không dùng `note`) |
| «top x%» khi x > 50 | `synthesis.paragraphs[0]` | không hiện |
| «vô dụng», «phế» | `SHENSHA_INFO.siFei.desc`, tên «Tứ Phế» | «Hồi Sinh» ở mặt chính |
| «tội», «đọa», «báo ứng» | — | «hồi quang», «xuất phát» |
| «súc sinh» | `SIX_REALMS['畜生道'].vi` | «Linh Thú» |
| «khắc phu», «khắc thê», «bất lợi hôn nhân», «nữ mạng…» | `combos.desc`, `SHENSHA_INFO.kuiGang` | không hiện (chỉ trong «Xem lời gốc» nếu người chơi bấm, kèm dòng «Câu cổ văn này phản ánh quan niệm thời xưa; trò chơi không dùng.») |
| «chắc chắn», «định sẵn», «không thể đổi», «số phận» (đi với «của bạn») | — | không dùng |
| «giờ … sẽ cho điểm CAO hơn giờ thật» | `chartSensitivity.insight` | không hiện |
| «thiếu», «yếu», «kém» làm **tính từ cho người chơi** («bạn yếu …») | — | «… còn để ngỏ», «… đang mỏng» (tính từ cho **hành / trục**, không cho người) |

### 4.2 Hiển thị có điều kiện

| Chữ | Ở đâu được | Ở đâu không |
|---|---|---|
| «Hạ Đẳng», «Trung Hạ» (`gradeVi`) | «Vì sao?» › «Xem lời gốc» | mặt trước Mệnh Bàn |
| «Bại cách», «败格» | «Vì sao?» Mệnh Cách | nhãn lớp (dùng «Nghịch Thiên») |
| «Đại hung», «Hung» (rating Thời Vận) | «Vì sao?» Thời Vận | vòng Thời Vận (dùng tên game §4.3) |
| «Kỵ thần» | Sổ Mệnh, «Vì sao?» | nghi lễ cổng: dùng «cửa thử thách» (04-03 §5.3) |
| Tên sao hung (Tai Sát, Huyết Nhận, Lưu Hà) | thẻ Đặc Tính, kèm «kiếp số» | thông báo nổi |

### 4.3 Tên hiển thị của rating Thời Vận

| Đại vận (engine) | Mặt trước | Lưu niên (engine) | Mặt trước |
|---|---|---|---|
| Đại cát | **Đỉnh vận** | Đại cát | **Năm đỉnh** |
| Cát | Thuận | Cát | Thuận |
| Hơi thuận | Hơi thuận | Bình | Bình |
| Bình hòa | Bình | Hơi kỵ | **Gợn** |
| Hơi nghịch | **Gợn** | Hung | **Năm thử thách** |
| Hung | **Vận thử thách** | Đại hung | **Năm Hạn** |
| Đại hung | **Vận đại thử thách** | | |

«Năm Hạn» là tên Hồi III của canon — người chơi gặp năm Đại hung là được vào «Năm Hạn» sớm, kèm thưởng thử thách +15% (04-08 §6.2).

## 5. Phản đề trong cốt truyện: Khổng tiên sinh và Định Mệnh Hội

Khổng tiên sinh (`khong_tiensinh`) là **phản đề có chủ đích**: «định mệnh luận», «đoán đúng mọi điều». Ông được phép nói câu tất định — vì vai của ông là để người chơi **phản bác**. Luật:

1. Mọi câu tất định của Khổng tiên sinh hoặc quầy Định Mệnh Hội nhắc tới chỉ số người chơi phải đi kèm một **cơ chế phản bác** trong cùng cảnh: người chơi có lựa chọn mở «Vì sao?» ngay trong thoại để chỉ ra dòng nào ông nói sai / nói thiếu (nối `Uy Nghi` `STAT-ND-QUAN-09` nếu có).
2. Ông không bao giờ nói đúng **toàn bộ**: mỗi lời phán dựa trên một phần thật của lá số (vd «Thủy của ngươi 2%, ngươi sẽ không bao giờ học được») + một kết luận tất định sai. Game để người chơi thấy phần thật (Thủy 2%) **và** bằng chứng phần sai (chuỗi Bổ Thủy đang chạy, Bổ Hành +5).
3. Không cảnh nào kết thúc bằng lời Khổng tiên sinh mà không có lượt nói của người chơi.

Ví dụ khuôn (03 viết cảnh thật):

```
KHỔNG TIÊN SINH: (nhìn áo người chơi) Áo đen. Dụng Thủy. Mà Thủy của ngươi chưa tới ba phần trăm. Học gì cũng không vào đâu.
> Lựa chọn: ① «Thầy nói đúng phần đầu.» (mở «Vì sao?» Ngũ Hành Lực)  ② «Thế sao tuần trước tôi đọc xong ba quyển?» (dẫn Bổ Hành +3)  ③ (im lặng, đi tiếp)
```

## 6. Quyền của người chơi đối với chỉ số của mình

| Cài đặt (Cài đặt › Riêng tư) | Mặc định | Tác dụng |
|---|---|---|
| Ẩn so sánh với người khác (bách phân vị) | tắt (nghĩa là bách phân vị hiện trong «Vì sao?») | ẩn mọi «hơn x% lá số» |
| Ẩn Mệnh Cấp khỏi khung tên | **bật** (không gửi lên mạng) | — |
| Ẩn Túc Nghiệp | tắt | ẩn thẻ + dùng mở đầu Nhân Đạo |
| Ẩn ba thanh tâm ma | tắt | thanh vẫn chạy, chỉ không hiện |
| Hiện cột Tiên Thiên trên Thiên Bảng (của mình) | **tắt** | 04-08 §5 |
| **Chế độ «Chỉ đường, không số»** | tắt | ẩn mọi con số Tiên Thiên (Tiềm Lực, Lực, Thân Lực, Ngũ Duy, bách phân vị); Mệnh Bàn chỉ hiện hành Dụng, cây khởi đầu, Mệnh Cách, Đặc Tính và **các lối đi**. Cơ chế game vẫn dùng số như cũ. Dành cho người chơi thấy con số gây áp lực. |

Bật / tắt không ảnh hưởng thưởng, không được ghi lại công khai.

## 7. Những gì Thầy không nói về chỉ số (cho 06)

| Người chơi hỏi | Thầy không nói | Thầy nói |
|---|---|---|
| «Điểm của con thấp, có phải đời con sẽ khổ?» | xác nhận hay phủ nhận đời thật | câu gốc §2.1 + chỉ 1 dòng ▼ có lối đi gần nhất |
| «Nguyên Khí thấp nghĩa là con yếu sức khỏe?» | bất kỳ nhận định sức khỏe | «Nguyên Khí là sức đi đường trong quán, không phải thân thể con. Sức khỏe thật thì hỏi thầy thuốc.» (RB1) |
| «Phúc phận “bình” là con nghèo?» | tiền bạc đời thật | «Phúc phận ở đây là Phúc Khí trong quán — và con thấy đấy, nó tăng theo cảnh giới.» (RB4) |
| «Con với bạn X hợp hay khắc?» | kết luận khắc / tránh | «Hai nạp âm của hai con có câu chuyện riêng. Tu chung thì thầy thấy cả hai cùng được.» (RB3) |
| «Đổi giờ sinh cho điểm cao hơn được không?» | cách chọn giờ | `STAT-LOI-19` |
| «Mua gì để tăng Tiềm Lực?» | — (không có) | «Không mua được. Tiềm Lực là hạt giống; cái lớn lên là Đạo Hạnh, và cái đó chỉ có một cách.» (RB5) |

## 8. Quy trình duyệt chữ

1. Mọi chuỗi mới của 04 (nhãn, tooltip, `STAT-LOI-*`) qua quét tự động theo §4.1 (kiểm thử UI8, 04-12 §7.5).
2. Chuỗi do engine sinh hiển thị trong «Xem lời gốc» được đặt dưới tiêu đề «Lời gốc của sách — giữ nguyên để minh bạch» và một dòng nhỏ: «Cách nói của sách cổ có thể nặng lời; trò chơi không dùng chúng để đánh giá con.»
3. Người duyệt văn hóa / tôn giáo (14 quy định) đọc §2, §4, 04-07 §2 trước khi phát hành.

## 9. Checklist nghiệm thu phần 04-13

- [ ] Câu gốc §2.1 xuất hiện đúng điều kiện; 22 câu `STAT-LOI-*` có chỗ dùng.
- [ ] Quét DOM không thấy chữ ở §4.1 trên mặt trước.
- [ ] Rating Thời Vận hiển thị theo §4.3.
- [ ] Mọi tooltip mức thấp có đủ Sự thật → Ý nghĩa → Lối đi.
- [ ] Khổng tiên sinh luôn có cơ chế phản bác trong cùng cảnh.
- [ ] Chế độ «Chỉ đường, không số» hoạt động mà không đổi thưởng.
- [ ] Không chuỗi nào chứa con số Tiềm Lực trong thoại NPC.
