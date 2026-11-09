# 01 · Phần 1 — Trụ cột T1, T2, T3

> Thuộc tài liệu **01 · Tầm nhìn, trụ cột và kinh thánh phong cách**. Đọc cùng `docs/gdd/00-KINH-DIEN-CHUNG.md` §2 (định nghĩa gốc của sáu trụ cột) và `docs/GAME-AAA-THIET-KE.md` §1.
>
> Phần này nở ba trụ cột đầu thành **luật thi hành**: định nghĩa đầy đủ, câu hỏi kiểm, ví dụ làm / không làm lấy từ tính năng đã có hoặc đã lên kế hoạch, ca biên, checklist. Phần 2 (`02-tru-cot-T4-T6-xung-dot.md`) làm tương tự cho T4–T6 và đặt **luật phân xử khi các trụ cột xung đột**.

## 0. Cách dùng phần này

### 0.1 Ai dùng, dùng lúc nào

| Vai | Dùng khi nào | Dùng mục nào |
|---|---|---|
| Thiết kế hệ thống | viết spec một cơ chế mới (vd «Kết phù», «Khoa cử») | câu hỏi kiểm của cả 6 trụ cột; bảng làm / không làm cùng loại |
| Biên kịch | viết cảnh, thoại NPC, lựa chọn | T2 (giọng không phán), T3 (thử thách không sát phạt), phần 07–08 (văn phong) |
| Họa sĩ, dựng cảnh | concept, Meshy prompt, dựng nội thất | T4 (phần 2), kinh thánh mỹ thuật (phần 12–13) |
| Kỹ sư | nối engine vào game | T1 (nguồn sự thật), T5 (phần 2: đối chiếu trang chính) |
| Duyệt nội dung | trước mỗi mốc M0–M6 | checklist cuối mỗi trụ cột |
| Sản xuất | cắt phạm vi | luật xung đột (phần 2 §8): cắt gì thì không được cắt trụ cột |

### 0.2 Quy ước mã trong phần này

Canon §9 chưa cấp không gian tên cho tài liệu 01. Phần này dùng **mã nội bộ** (đề nghị ghi vào canon, xem README):

| Mã | Nghĩa | Ví dụ |
|---|---|---|
| `KT-Tn-xx` | câu hỏi kiểm của trụ cột n | `KT-T1-03` |
| `VD-Tn-xx` | ví dụ làm / không làm | `VD-T2-17` |
| `CB-Tn-xx` | ca biên | `CB-T3-04` |

Một tính năng **đạt trụ cột** khi trả lời «có» cho mọi câu hỏi kiểm bắt buộc (đánh dấu **[B]**) và không vướng cột «Không làm» nào. Câu hỏi không đánh dấu là câu hỏi chất lượng: trả lời «không» thì phải ghi lý do trong spec.

### 0.3 Một câu cho mỗi trụ cột (để dán lên tường phòng làm việc)

| # | Trụ cột | Một câu |
|---|---|---|
| T1 | Lá số là nhân vật | «Con số nào trên màn hình cũng phải truy được về một trường của `analyze()`.» |
| T2 | Mệnh do ta tạo | «Ta nói thật về hạt giống, và nói thật rằng cây là do người trồng.» |
| T3 | Văn tu, không sát phạt | «Không có gì để giết; chỉ có điều để hiểu, để chữa, để giữ.» |
| T4 | Thế giới thật | «Nhìn thấy cửa thì vào được; vào được thì có việc để làm.» |
| T5 | Đúng cổ pháp | «Game và trang chính là một người thầy nói hai lần.» |
| T6 | Tôn trọng và an toàn | «Không có cảnh nào khiến một người tu thật phải quay mặt đi.» |

---

## 1. T1 · Lá số là nhân vật

### 1.1 Định nghĩa đầy đủ

Nhân vật của người chơi **không được tạo** bằng thanh trượt, điểm cộng hay chọn lớp. Nhân vật **được đọc ra** từ ngày giờ sinh mà người chơi nhập ở cổng Sơn Môn. `chart.js › analyze()` chạy **một lần**, sinh ra đối tượng `R`. Từ `R` mà có:

- **chỉ số Tiên Thiên** (Tiềm Lực, Phẩm căn, Phúc phận, Ngũ Hành Lực, Thân Lực, Thiên Mệnh Hành, Ngũ Duy, Mệnh Cách, Mệnh Cấp, Nguyên Khí, Đặc Tính, Túc Nghiệp, Tính Khí, Thời Vận — bảng canon §5);
- **ngoại hình khởi đầu** (Bản Mệnh Y: áo theo `yong.primary`, đai theo `yong.xi`; gia trì theo hành Dụng thần — `progress.js › WX_GIATRI`);
- **mở màn cốt truyện** (nhánh `BR-TT/DC/NT/DK` theo `patternQuality.quality`);
- **giọng nhân vật trong lựa chọn thoại** (Tính Khí từ `personality-profile` + `nayin-personality`);
- **thời tiết vận cá nhân** (Thời Vận: `dayun[current]`, `liunian[isNow]`).

Ba hệ quả thiết kế:

1. **Không có công thức bói riêng của game.** Game được phép *ánh xạ* (nhân hệ số, đổi tên, chia bậc), không được *tính lại* mệnh theo cách khác engine.
2. **Mọi con số đều giải thích được.** Nút «Vì sao?» mở `synthesis.factors[]` hoặc trường gốc tương ứng.
3. **Nhân vật của hai người cùng ngày giờ sinh là một.** Khác nhau chỉ ở Hậu Thiên (việc làm), ngoại hình đã thay, đạo hiệu và lựa chọn.

### 1.2 Vì sao trụ cột này tồn tại

- Người dùng app Bát Tự (nhóm lõi) đến để **thấy lá số của mình sống**. Một chỉ số bịa ra là một lời nói dối với chính họ, và họ sẽ phát hiện (họ đã xem trang chính hàng chục lần).
- Không có thanh trượt thì không có «build tối ưu». Điều này cắt tận gốc động cơ **nhập ngày sinh giả để lấy lá số đẹp**, vốn là điều phá T2.
- Mọi hệ thống khác (cải mệnh, NPC, mỹ thuật nhân vật) cần một **nguồn sự thật duy nhất**. T1 là nguồn đó.

### 1.3 Nguồn sự thật — bảng tham chiếu nhanh

| Lớp dữ liệu | Trường engine | Ai được ghi | Ai được đọc | Đổi được không |
|---|---|---|---|---|
| Tứ trụ, ngũ hành, Dụng / Hỷ / Kỵ | `R.chart`, `R.wx`, `R.yong` | chỉ `analyze()` | mọi hệ thống | không (chỉ khi người chơi sửa ngày giờ sinh, xem `CB-T1-02`) |
| Điểm, bậc, lý do | `R.synthesis.score/gradeVi/factors` | chỉ `analyze()` | Mệnh Bàn, Thiên Bảng (cột Tiên Thiên), NPC | không |
| Mệnh Cách | `R.patternQuality.quality`, `R.pattern` | chỉ `analyze()` | máy nhiệm vụ (nhánh BR) | không |
| Đại vận, lưu niên | `R.dayun`, `R.liunian` | chỉ `analyze()` | Vận Mệnh Các, Hồi III, Thời Vận | tự đổi theo thời gian thật |
| Hậu Thiên | Đạo Hạnh, Sổ Công Quá | **máy nhiệm vụ** (deterministic) | Thiên Bảng, cảnh giới | có (tăng; giảm khi phạm giới) |
| Ngoại hình | `wardrobe.equipped` | người chơi | MMO, cảnh | có |

**Luật cứng:** AI (Thầy AI, NPC persona) **chỉ đọc**. AI không ghi chỉ số, không cấp thưởng (`GAME-AAA §6.1` mục 4).

### 1.4 Câu hỏi kiểm T1

| Mã | Câu hỏi | Bắt buộc | Cách kiểm |
|---|---|---|---|
| `KT-T1-01` | Mỗi con số tính năng này hiện ra có truy được về một trường cụ thể của `R` (hoặc hàm engine có thật) không? | **[B]** | spec phải có cột «Nguồn engine» cho từng số |
| `KT-T1-02` | Có công thức nào *tính lại mệnh* (không chỉ ánh xạ) không? Nếu có, bỏ. | **[B]** | rà spec tìm từ «tính», «công thức», đối chiếu engine |
| `KT-T1-03` | Người chơi bấm «Vì sao?» ở con số này thì thấy gì? | **[B]** | có văn bản hiện ra, lấy từ `factors[]` hoặc mô tả trường |
| `KT-T1-04` | Hai người cùng ngày giờ sinh có cùng con số này không (khi chưa tính Hậu Thiên)? | **[B]** | test với `MAU-A` hai lần, hai tài khoản |
| `KT-T1-05` | Con số trong game có trùng con số trang chính (cùng lá số) không? | **[B]** | test đối chiếu tự động (xem T5) |
| `KT-T1-06` | Khi không rõ giờ sinh (`hourUnknown`), tính năng xử lý thế nào? | **[B]** | có nhánh «Tam Trụ» ghi rõ |
| `KT-T1-07` | Tính năng có dùng lá số để *phân biệt đối xử* (khóa nội dung lõi theo điểm) không? Nếu có, chỉ được khóa **lối vào**, không khóa **đích đến**. | **[B]** | rà điều kiện mở khóa |
| `KT-T1-08` | Chỉ số này có tạo cảm giác «đây là mình» không (có câu mô tả bằng đời thường)? | | thử với 5 người chơi thật, hỏi «có giống bạn không» |
| `KT-T1-09` | Chỉ số này có ảnh hưởng *nhìn thấy được* trong lối chơi, hay chỉ là số trang trí? | | spec có cột «ảnh hưởng lối chơi» |
| `KT-T1-10` | Hệ số game áp lên chỉ số (vd ×1,3 Dụng) có ghi ngay cạnh số, không giấu? | | ảnh UI |
| `KT-T1-11` | Dữ liệu này có rời máy người chơi không? Nếu có, đã qua cờ «công khai căn cốt» chưa? | **[B]** | rà gói tin MMO (`protocol.js`) |
| `KT-T1-12` | NPC cư dân có lá số riêng (`npc.js › makeNpc`) có dùng **cùng engine** không? | | test sinh 100 NPC |

### 1.5 Ví dụ làm / không làm (T1)

| Mã | Tính năng | ✔ Làm | ✘ Không làm | Vì sao |
|---|---|---|---|---|
| `VD-T1-01` | Mệnh Bàn — Tiềm Lực | Hiện `synthesis.score` nguyên số (vd 41), kèm bách phân vị `percentile` | Làm tròn lên «cho đẹp», hoặc đổi thang 0–1000 để số nghe to | trang chính hiện 41; người chơi so ngay |
| `VD-T1-02` | Phẩm căn | Tên game «Tứ Linh Căn» **và** dòng nhỏ tên gốc «TRUNG ĐẲNG · Cân bằng» | Chỉ hiện tên tu tiên, giấu gradeVi | tách khỏi cổ pháp là vi phạm T5, và người chơi mất cầu nối với app |
| `VD-T1-03` | Ngũ Hành Lực | Năm thanh đúng `wx.pct`, tổng 100; nhãn «×1,3 Dụng thần» cạnh thanh Thủy của `MAU-A` | Cho người chơi «phân bổ 10 điểm tự do» lúc tạo nhân vật | phá «nhân vật được đọc ra» |
| `VD-T1-04` | Phẩm phục khởi đầu | Bản Mệnh Y nhuộm theo `yong.primary`, đai theo `yong.xi` (đã có, V2-2) | Cho chọn màu áo khởi đầu tự do trước lễ lật trụ | màu áo là lời đầu tiên lá số «nói» với người chơi |
| `VD-T1-05` | Thân Lực | Vượng → thưởng đi một mình; nhược → nhận trợ ×1,5 từ sư phụ, bạn đồng hành | Thân nhược = trừ chỉ số, đi chậm | ánh xạ đúng nghĩa «cần trợ», không phạt |
| `VD-T1-06` | Kỵ Hành | Vùng / giờ của hành kỵ khó hơn, thưởng tu vi ×1,3 | Vùng hành kỵ bị khóa | Kỵ là thử thách (T2), khóa là phân biệt (KT-T1-07) |
| `VD-T1-07` | Ngũ Duy | Trục `dominant` cho kỹ năng khởi đầu; trục `weakest` mở chuỗi «học bù» | Trục yếu khóa nhánh kỹ năng | trang chính có mục *Khuyết Thập Thần*; game biến thành việc làm |
| `VD-T1-08` | Mệnh Cách | `patternQuality.quality` chọn nhánh `BR-*` | Cho người chơi chọn nhánh ở menu | nhánh là câu chuyện của lá số, không phải độ khó |
| `VD-T1-09` | Mệnh Cấp | Danh hiệu khởi đầu «Thanh Quý» (清貴) trên khung tên | Bán danh hiệu Mệnh Cấp cao hơn ở Tàng Y Các | bán danh tính lá số = bán mệnh (T6) |
| `VD-T1-10` | Đặc Tính | Mỗi sao có trong `R.shensha` là một perk (Quý Nhân Phù, Văn Xương Chiếu…) | Thêm perk «Long Mạch Hộ Thể» không có trong engine | sao bịa = T5 vỡ; AI sẽ bị `checkNeo` bắt |
| `VD-T1-11` | Nguyên Khí | Số lượt hoạt động tốn sức lấy từ `analyzeVitality.baseVitality` | Gọi là «Sức khỏe» và giảm khi người chơi «ốm» | T6: không chạm y khoa; Nguyên Khí là thể lực **trong game** |
| `VD-T1-12` | Túc Nghiệp | Mở đầu kể «xuất thân tiền kiếp» là truyện, ghi «hư cấu, tham khảo» | Viết như sự thật: «kiếp trước bạn là ngạ quỷ» | `liudao` của app là tham khảo; lời khẳng định kiếp trước là mê tín hóa |
| `VD-T1-13` | Tính Khí | Lựa chọn thoại của nhân vật nhuốm giọng nhật chủ (Canh Kim: thẳng, ngắn) | Ép người chơi chỉ được chọn câu hợp tính khí | giọng gợi ý, không giam; người chơi luôn có câu trung tính |
| `VD-T1-14` | Thời Vận | Ảnh hưởng nhỏ ±10% theo `liunian[isNow].score`, hiện ở góc Sổ Mệnh | Năm vận xấu: giảm 50% thưởng | ±10% là «thời tiết», 50% là «trừng phạt» (T2) |
| `VD-T1-15` | Vận Mệnh Các | Cổng đại vận đang đi mở theo tuổi thật (vd `MAU-A`: 甲申 28–37) | Cho tua đại vận để «xem trước» bằng Ngọc | bán thông tin vận = bán bói |
| `VD-T1-16` | Thái Tuế Điện | Tuổi Ngọ năm 2026 丙午 hiện «Trị + Hình Thái Tuế» đúng `thaitue.js` | Thông báo đẩy «Bạn phạm Thái Tuế! Thắp đèn ngay» | dữ kiện đúng (T1), lời đúng (T2), không thúc ép (T6) |
| `VD-T1-17` | Giải án khách | Khách có lá số thật sinh bằng engine, người chơi luận 6 bước, chấm theo engine | Đáp án án khách do biên kịch viết tay, lệch engine | `cases.js` đã chấm bằng engine; giữ vậy |
| `VD-T1-18` | NPC cư dân | 30 gia đình Huyền Thành, mỗi người có ngày sinh, `makeNpc` sinh lá số | NPC có «lá số» là đoạn văn mô tả không chạy engine | án phong thủy / án mệnh tại nhà họ phải luận được |
| `VD-T1-19` | Đạo hiệu (Văn Miếu) | Chấm tên bằng `naming.js › analyzeName` theo Dụng thần | Bảng «tên đẹp» cố định cho mọi người | tên hợp người này có thể kỵ người kia |
| `VD-T1-20` | Nhà riêng (Huyền Thành) | Hướng nhà đọc từ model thật; luận bát trạch theo **quái mệnh** người chơi | Một bố cục «phong thủy chuẩn» chung | bát trạch phụ thuộc người ở |
| `VD-T1-21` | Thiên Bảng | Hai cột: Tiên Thiên (không ai đổi được) và Đạo Hạnh; bảng chính xếp Đạo Hạnh | Một cột «Sức mạnh» gộp cả hai | gộp là để căn cốt quyết định thứ hạng (phá T2) |
| `VD-T1-22` | Người chơi khác (MMO) | Thấy màu áo, đồ, Đạo Hạnh tổng; căn cốt chỉ khi họ bật «công khai căn cốt» | Hiện Phẩm căn trên đầu mọi người | phân tầng xã hội theo lá số; lộ dữ liệu sinh |
| `VD-T1-23` | Khổng tiên sinh | Ba câu phán lấy từ `dayun`, `liunian`, `synthesis.paragraphs`; `checkNeo` kiểm | AI tự «đoán thêm» sự kiện đời (vd «con có hai anh em») | không có trong brief = bịa |
| `VD-T1-24` | Sổ Mệnh «Vì sao?» | Bấm Tiềm Lực → danh sách «+4 Ấn sinh thân», «−6 Thất Sát vô chế»… | «Vì sao?» hiện một câu văn chung chung | minh bạch là cốt lõi T1 |
| `VD-T1-25` | Gia trì nguyên tố | Màu và chuyển động theo hành Dụng thần (`WX_GIATRI`: Huyền Thủy #4f9cff, giọt nước rơi) | Gia trì theo lớp nhân vật tự chọn | gia trì là «linh khí của lá số» |
| `VD-T1-26` | Bộ Hợp mệnh | Bộ ngũ hành trùng Dụng → +10% Phúc Khí (đã có `SET_BONUS`) | +10% Đạo Hạnh | mua được bộ → mua được tu (T6, canon §7) |
| `VD-T1-27` | Lá số khách lưu trong Sổ Mệnh | Lưu hồ sơ người thân để luận ở Bàn Thầy | Cho «chơi bằng lá số người khác» làm nhân vật chính | nhân vật là **bản thân**; luận người khác là nghề |
| `VD-T1-28` | Nhiệm vụ «Hành thiếu» (MQ-1) | Tìm vật phẩm của hành yếu nhất theo `wx.pct` (MAU-A: Thủy 2% → nước suối Cùng Thông Hồ) | Mọi người cùng đi lấy một vật | nhiệm vụ phải khác nhau theo lá số |
| `VD-T1-29` | Lá số «Dị Cách» | Dụng thần theo `pattern.special` (tòng, hóa) — game không tự sửa thành phù ức | Áp công thức Dụng thần thường cho tòng cách | engine đã xử lý; game không «chỉnh tay» |
| `VD-T1-30` | Hiển thị Hán | Mọi chỉ số kèm chữ Hán gốc của engine khi mở chi tiết (七殺格, 有救) | Dịch hết, mất chữ gốc | người dùng app tra lại trang chính bằng chữ Hán |

### 1.6 Ca biên T1

| Mã | Tình huống | Xử lý |
|---|---|---|
| `CB-T1-01` | Người chơi không rõ giờ sinh | Chạy Tam Trụ. Mệnh Bàn hiện «Tam Trụ» trên la bàn (trụ giờ là ô sương mù). Các chỉ số phụ thuộc trụ giờ (một số thần sát, cách cục có thể đổi) ghi **«chưa định»**, không bịa. Nhánh cốt truyện: dùng kết quả Tam Trụ, có nhiệm vụ phụ «Tìm giờ sinh» (hỏi gia đình ngoài đời — **chỉ gợi ý**, không ép) và cho sửa sau. |
| `CB-T1-02` | Người chơi gõ nhầm ngày sinh | Cho **một lần sửa miễn phí trong 24 giờ đầu**, giữ Hậu Thiên. Sau 24 giờ: sửa là **lập Mệnh Bàn mới** (ô nhân vật mới), Hậu Thiên không mang theo. Nói rõ trước khi xác nhận. Không có động cơ gian lận vì lá số thấp được hệ số Nghịch Thiên cao hơn. |
| `CB-T1-03` | Người chơi cố ý nhập ngày giờ của người nổi tiếng | Không chặn (không xác minh danh tính, không lưu ngày sinh lên máy chủ). Không có thưởng riêng. Nếu người chơi tự công khai căn cốt, chỉ hiện điểm, không hiện ngày sinh. |
| `CB-T1-04` | Sinh gần giờ giao tiết (lập xuân, giao tháng) | Dùng đúng cách engine xử lý. Mệnh Bàn có dấu «sinh sát giờ giao tiết» và nút «Vì sao?» giải thích; Thầy Tử Bình có thoại riêng. |
| `CB-T1-05` | Sinh ở múi giờ khác, giờ mùa hè | Theo form hiện có của app (nếu app chưa xử lý chân thái dương thời thì ghi **(chưa có — cần làm)** trong tài liệu 13). Game không tự hiệu chỉnh khác app. |
| `CB-T1-06` | Engine trả kết quả lạ do lỗi (Phụ lục B bản sơ đồ: `'劫财'` vs `'劫財'`) | Sửa engine, không vá trong game. Game và trang chính phải sai / đúng cùng nhau (T5). |
| `CB-T1-07` | Lá số điểm cực thấp (< 15) | Không có trần dưới giả. Hệ số Nghịch Thiên chạm trần 1,5. Câu dẫn bắt buộc (T2) chạy. |
| `CB-T1-08` | Hai người chơi trùng lá số gặp nhau trong MMO | Nếu cả hai công khai căn cốt: hiện huy hiệu «Đồng Mệnh» (cùng tám chữ). Một sự kiện nhỏ: Vân Cốc bình «tám chữ như nhau, hai con đường». Tuyệt vời cho T2. |
| `CB-T1-09` | Người chơi chưa đủ tuổi bắt đầu đại vận (trẻ em nhập ngày sinh) | Engine trả tiểu vận / chưa khởi vận. Vận Mệnh Các hiện «chưa khởi vận». Đồng thời kích hoạt chế độ vị thành niên (T6, phần 2). |
| `CB-T1-10` | Lá số thay đổi điểm sau khi engine được cải tiến | Thông báo minh bạch trong Sổ Mệnh: «Thầy đã sửa cách tính X; Tiềm Lực của con đổi từ 41 thành 43». Hệ số Nghịch Thiên tính lại từ thời điểm đó, Đạo Hạnh đã có giữ nguyên. |

### 1.7 Checklist nghiệm thu T1

- [ ] Spec có bảng «Nguồn engine» cho mọi con số.
- [ ] Không có biến số nào trong mã game mang nghĩa «mệnh» mà không đọc từ `R`.
- [ ] Test đối chiếu trang chính ↔ game chạy trên `MAU-A`, `MAU-B` và bộ `MAU-C…` của tài liệu 04 cho ra cùng số.
- [ ] Nhánh `hourUnknown` có ảnh chụp UI.
- [ ] Gói tin MMO không chứa ngày sinh, không chứa điểm Tiên Thiên khi cờ công khai tắt.
- [ ] Mọi nút «Vì sao?» có nội dung, không câu chung chung.

---

## 2. T2 · Mệnh do ta tạo

### 2.1 Định nghĩa đầy đủ

Game **nói thật** về lá số và **không bao giờ nói** rằng lá số quyết định đời người. Hai mệnh đề này không mâu thuẫn; toàn bộ câu chuyện được dựng trên khoảng cách giữa chúng (chuyện Liễu Phàm, `remedy-fate › LIAOFAN_STORY`).

Trụ cột có **ba tầng thi hành**:

1. **Lời** — không câu thoại, chú thích, thông báo nào phán «mệnh đã định» (khớp `anti-manipulation-data › refusalBoundaries` RB2). Câu đoán nào cũng mở ra hành động: «con có thể…».
2. **Cơ chế** — lá số thấp có **lợi thế tu luyện thật**:
   - **Hệ số Nghịch Thiên** `clamp(1 + (60 − Tiềm Lực)/100, 1,0, 1,5)` nhân vào mọi điểm Hậu Thiên;
   - từ **cảnh giới 4**, Tiên Thiên thôi tính (canon §5);
   - Thiên Bảng chính xếp theo **Đạo Hạnh**.
3. **Truyện** — mọi nhánh Mệnh Cách đều đi tới cùng một đích (Côn Lôn), bằng những con đường dài ngắn khác nhau. Lá số tốt có thử thách riêng (tâm ma «mạn», giữ cách), không được miễn tu.

### 2.2 Toán của «khổ tận cam lai» (để mọi người cùng hiểu một con số)

| Tiềm Lực | Phẩm căn | Hệ số Nghịch Thiên | Điểm cảnh giới khởi đầu (×0,4) | Việc thiện thô cần để tới bậc 2 (100) | … tới bậc 4 (1.000, chỉ Đạo Hạnh) |
|---|---|---|---|---|---|
| 12 | Phàm Căn | 1,48 | 4,8 | (100 − 4,8) / 1,48 ≈ 64 | 1.000 / 1,48 ≈ 676 |
| 24 | Phàm Căn | 1,36 | 9,6 | ≈ 66 | ≈ 735 |
| 33 | Ngũ Linh Căn | 1,27 | 13,2 | ≈ 68 | ≈ 787 |
| 41 (`MAU-A`) | Tứ Linh Căn | 1,19 | 16,4 | ≈ 70 | ≈ 840 |
| 55 | Tam Linh Căn | 1,05 | 22,0 | ≈ 74 | ≈ 952 |
| 60 | Tam Linh Căn thượng | 1,00 | 24,0 | 76 | 1.000 |
| 88 | Thiên Linh Căn | 1,00 | 35,2 | ≈ 65 | 1.000 |

Đọc bảng:

- Ở **bậc 2** người căn cốt cao tới sớm hơn **một chút** (65 so với 66 việc). Người chơi mới không thấy mình bị bỏ xa.
- Từ **bậc 4**, Phàm Căn 24 điểm cần ít hơn Thiên Linh Căn **≈ 27%** công sức. Đây là lúc câu chuyện «khổ tận cam lai» trở thành cảm giác thật.
- Hệ số **không vượt 1,5**, để Thiên Bảng không thành cuộc thi «ai có lá số tệ nhất».

*(Tài liệu 04 là chuẩn chi tiết của công thức; bảng này chỉ minh họa cho đội nội dung.)*

### 2.3 Câu hỏi kiểm T2

| Mã | Câu hỏi | Bắt buộc | Cách kiểm |
|---|---|---|---|
| `KT-T2-01` | Có câu chữ nào nói hoặc ngụ ý «không đổi được», «số con là vậy», «chắc chắn sẽ» về đời người chơi không? | **[B]** | quét từ khóa (phần 08 §2) + đọc tay |
| `KT-T2-02` | Mỗi lần game nói một điều khó nghe về lá số, có kèm ít nhất **một hành động** người chơi làm được ngay không? | **[B]** | rà thoại: câu khó → câu «con có thể» trong cùng lượt |
| `KT-T2-03` | Người chơi lá số thấp có bị **khóa đích đến** nào không (vùng, cảnh giới, kết thúc)? | **[B]** | rà điều kiện mở khóa trong máy nhiệm vụ |
| `KT-T2-04` | Tính năng có cho người căn cốt cao lợi thế **tích lũy** mãi không? | **[B]** | mô phỏng 60 giờ cho Tiềm Lực 24 và 88 |
| `KT-T2-05` | Thất bại trong tính năng có bị gọi tên bằng lá số («vì con thân nhược nên…») không? | **[B]** | rà thông báo thất bại |
| `KT-T2-06` | Có chỗ nào người chơi lá số **cao** được nhắc rằng họ vẫn phải tu không? | | rà nhánh `BR-TT` |
| `KT-T2-07` | Từ ngữ mô tả bậc thấp có trung tính không («Phàm Căn» được; «phế căn», «tạp chủng» cấm)? | **[B]** | từ điển cấm (phần 08 §2) |
| `KT-T2-08` | So sánh xã hội (Thiên Bảng, khung tên) có xếp theo việc làm thay vì căn cốt? | **[B]** | ảnh UI Thiên Bảng |
| `KT-T2-09` | Năm / tháng / giờ xấu có được trình bày như **thời tiết** (chuẩn bị, giữ) thay vì **án phạt**? | **[B]** | rà Hồi III, Thái Tuế, lịch ngày |
| `KT-T2-10` | Người chơi có lúc nào **tự tay viết lại** một phần câu chuyện (lựa chọn có hệ quả) trong tính năng này không? | | spec có ít nhất một lựa chọn |
| `KT-T2-11` | Có cách nào **mua** lối tắt của tu (tiền, Ngọc, VIP) không? | **[B]** | rà SKU (tài liệu 11) |
| `KT-T2-12` | Đọc kết thúc tính năng: người chơi rời đi với câu «mình làm được» hay «mình được ban cho»? | | thử nghiệm phỏng vấn |

### 2.4 Ví dụ làm / không làm (T2)

| Mã | Tính năng | ✔ Làm | ✘ Không làm | Vì sao |
|---|---|---|---|---|
| `VD-T2-01` | Câu dẫn điểm thấp | Câu bắt buộc: «Lá số là hạt giống, không phải cái cây…» hiện ngay sau lễ lật trụ khi điểm < 36 | Hiện điểm 24 kèm màu đỏ và chữ «HẠ ĐẲNG» cỡ lớn | màn đầu quyết định người chơi ở hay đi |
| `VD-T2-02` | Nhánh Nghịch Thiên | Sơn Môn «chưa nhận» là **tình tiết** có ấm áp (nhà trọ, Vân Cốc tìm tới đêm đó) | Màn hình «Bạn không đủ điều kiện» | khác nhau giữa truyện và cửa khóa |
| `VD-T2-03` | Khổng tiên sinh | Phán đúng ba câu rồi hỏi ngược «con định sống đúng như vậy à?» | Phán xong rồi thôi, để người chơi ra về với lời phán | ông là phản đề; phản đề cần câu hỏi để người chơi trả lời bằng hành động |
| `VD-T2-04` | Thiên Bảng | Cột chính Đạo Hạnh; cột Tiên Thiên xám nhạt, chỉ để xem | Sắp theo Tiềm Lực | xếp hạng theo thứ không ai đổi được là phán định mệnh |
| `VD-T2-05` | Kỵ thần | «Giờ Ngọ hôm nay là giờ kỵ của con: khó hơn, nhưng tu được nhiều hơn (×1,3)» | «Giờ kỵ: hiệu quả −30%» | cùng sự thật, khác khung |
| `VD-T2-06` | Năm phạm Thái Tuế | Chuỗi «năm hạn» là thử thách có thưởng, NPC đồng hành | Debuff cả năm | Thái Tuế là thời tiết của năm (canon §2.4 luật 2) |
| `VD-T2-07` | Đặc Tính «Kiếp số» (xueRen, siFei) | Thêm **một ải kiếp** trong chuỗi chính; vượt được thưởng lớn | Trừ chỉ số vĩnh viễn | sao «xấu» là đề bài, không phải án |
| `VD-T2-08` | Thiên Linh Căn | Tâm ma «mạn» là thử thách chính; Vân Cốc có thoại «tốt thì giữ, không ai được miễn tu» | Cho Thiên Linh Căn bỏ qua Hồi I | người căn cốt cao cũng phải có hành trình |
| `VD-T2-09` | Lời kết Vĩ thanh | «Mệnh con vẫn vậy: tám chữ ấy không đổi một nét. Nhưng người mang tám chữ ấy đã khác.» | «Con đã đổi được mệnh!» kèm điểm Tiềm Lực tăng | Tiên Thiên **không đổi**; nói đổi là nói dối (T1) và hứa hão (T6) |
| `VD-T2-10` | Mệnh Đồ | Lá số tốt vẫn có nút cuối «Tích âm đức», luôn mở | Lá số tốt có Mệnh Đồ trống «không cần cải» | thông điệp: ai cũng tu |
| `VD-T2-11` | Sổ Công Quá | Ghi việc thiện người chơi **chọn** làm; việc ác chỉ khi người chơi chọn | Tự trừ điểm khi người chơi không có lựa chọn | trừ khi không chọn = định mệnh trá hình |
| `VD-T2-12` | Tà Lộ | Mọi lúc đều hồi đầu được; Nợ Âm công khai | «Điểm không quay lại» sau Hồi IV | quay đầu là đạo (canon §6) |
| `VD-T2-13` | Danh hiệu «Hồi Đầu» | Hiếm, được kính trọng, khung tên riêng | Dấu «từng đi Tà Lộ» như vết nhơ | game tôn vinh sửa sai |
| `VD-T2-14` | Thầy AI trả lời «con có lấy được vợ không» | Xu hướng theo lá số + việc con làm được (đúng RB2 «nói theo xu hướng + cultivate») | «Lá số con cô thần quả tú, khó lấy vợ» | RB2 cấm khẳng định tất định |
| `VD-T2-15` | Thời Vận năm xấu | Sổ Mệnh ghi «năm thu, nên giữ» kèm ba việc nên làm | Biểu đồ đỏ chói «Năm đại hung» | ngôn ngữ thời tiết, không ngôn ngữ thảm họa |
| `VD-T2-16` | Thất bại án khách | «Con luận Dụng thần sai ở bước 3. Xem lại nguyệt lệnh nhé.» | «Thân nhược nên con không đủ tuệ để giải án này» | thất bại do việc làm, không do mệnh (`KT-T2-05`) |
| `VD-T2-17` | Khoa cử | Ai cũng thi được; Văn Xương Chiếu +20% điểm, không phải điều kiện | Không có Văn Xương thì không được thi đình | perk là gió thuận, không là vé vào |
| `VD-T2-18` | Bia Tiến sĩ | Khắc tên theo kết quả thi | Khắc tên kèm Phẩm căn | không đem căn cốt lên bia |
| `VD-T2-19` | Người chơi hỏi «sao lá số con thấp vậy?» | Thầy Tử Bình đọc `factors[]` từng dòng rồi nói dòng nào sửa được bằng Hậu Thiên (Mệnh Đồ) | «Đó là số trời» | minh bạch (T1) + hành động (T2) |
| `VD-T2-20` | Đồng Mệnh | Hai người trùng lá số được nhắc «tám chữ như nhau, hai con đường» | Gộp hai người vào một hội «cùng số phận» | nhấn khác biệt do việc làm |
| `VD-T2-21` | Liễu Phàm | Kể chuyện ông bị đoán đúng, rồi thôi cầu, rồi gặp thầy, rồi đổi | Kể như phép màu «đổi số nhờ cúng» | câu chuyện gốc là về tự tu |
| `VD-T2-22` | Hồi III «Năm Hạn» | «Thuận vận thì làm, nghịch vận thì giữ»: giữ được thành quả cũng là thắng | Hồi III mất hết Đạo Hạnh | dạy chiến lược sống, không dạy sợ |
| `VD-T2-23` | Nhánh Đắc Cứu | «Con có bệnh, nhưng trời cũng gửi thuốc» — thuốc là nơi phải tự đi tới | Thuốc là vật phẩm rơi ngẫu nhiên | thuốc phải hái bằng chân |
| `VD-T2-24` | Lời chào khi trở lại sau 2 tuần | «Về rồi à. Sổ của con vẫn ở đây.» | «Con đã bỏ tu 14 ngày, Đạo Hạnh suy giảm» | không phạt nghỉ; không gây tội lỗi |
| `VD-T2-25` | Giới hạn hệ số | Trần 1,5 | Không trần | tránh cuộc đua «ai lá số tệ nhất» làm méo T2 theo chiều ngược |
| `VD-T2-26` | Quảng bá | «Lá số của bạn là nhân vật. Bạn là người viết tiếp.» | «Xem bạn có căn cốt Thiên Linh không!» | quảng cáo khêu căn cốt sẽ hút đúng người ghét T2 |
| `VD-T2-27` | Chia sẻ mạng xã hội | Thẻ chia sẻ hiện cảnh giới + đạo hiệu + Đạo Hạnh | Thẻ chia sẻ hiện Phẩm căn to giữa thẻ | so căn cốt ngoài game = phán xét ngoài game |
| `VD-T2-28` | Định Mệnh Hội | Thuyết của họ được trình bày đủ mạnh để có sức hút, rồi bị vạch bằng bằng chứng | Phản diện ngu ngốc, nói câu vô lý | phản đề yếu thì bài học rỗng |
| `VD-T2-29` | Tâm ma Tham / Sân / Si | Thanh giảm bằng tu; NPC nhắc **trước** khi người chơi chọn lựa dính nghiệp (`getYeguoForChart`) | Lá số Thất Sát bị tự động cộng «Sân» khi chơi | lá số chỉ gợi ý điểm yếu để phòng, không để kết tội |
| `VD-T2-30` | Thông báo đẩy | «Ngày Nhâm Tý — ngày Thủy, hợp Dụng của con. Ghé quán uống trà?» | «Hôm nay ngày xung tuổi bạn, cẩn thận!» | không dùng nỗi sợ để kéo người chơi về |

### 2.5 Ca biên T2

| Mã | Tình huống | Xử lý |
|---|---|---|
| `CB-T2-01` | Người chơi điểm thấp thoát game ngay sau lễ lật trụ | Lần vào lại đầu tiên: không lặp lễ lật trụ; mở thẳng cảnh Vân Cốc tìm tới. Đo tỷ lệ này (phần 16, `KPI-05`). |
| `CB-T2-02` | Người chơi nói với NPC «con muốn chết» trong cơn buồn vì lá số | Quy tắc khủng hoảng (`GAME-AAA §6.4` mục 3): NPC rời vai, đưa thông tin hỗ trợ thật, rồi mới quay lại. Ghi cờ để Thầy không nhắc lá số xấu trong phiên đó. |
| `CB-T2-03` | Người chơi lá số cao chế giễu người lá số thấp trong chat | Bộ lọc chat bắt cụm «phàm căn», «căn rác»… gửi cảnh báo; hệ thống báo cáo. NPC Vân Cốc có câu dạy chung trên kênh vùng khi có nhiều báo cáo. |
| `CB-T2-04` | Người chơi xin «tua» tới năm tốt để chơi Hồi III dễ | Không. Hồi III dùng năm có điểm thấp nhất trong 10 năm tới (`liunian`) vì đó là bài học. Có thể chọn độ khó **trình bày** (giảm áp thời gian), không đổi năm. |
| `CB-T2-05` | Lá số đang đi đại vận rất tốt, cả Hồi III «Năm Hạn» chỉ có điểm thấp nhất là 58 | Vẫn chọn năm thấp nhất tương đối; thoại thừa nhận «năm này với con không quá khó. Thử thách của con là đừng chủ quan», chuyển trọng tâm sang giúp NPC khác qua hạn. |
| `CB-T2-06` | Người chơi phản đối: «game bảo mệnh do ta tạo mà vẫn cho tôi điểm 24, vậy là phán rồi» | Thoại Thầy Tử Bình giải thích phân biệt Tiên Thiên / Hậu Thiên; có cảnh minh họa hạt giống. Đội cộng đồng có bài viết sẵn. |
| `CB-T2-07` | Người chơi lá số thấp tăng nhanh, đứng đầu Thiên Bảng, bị nghi «hack» | Thiên Bảng có nút «Vì sao?» công khai (nếu người đó đồng ý): hệ số Nghịch Thiên, số việc. Biến nghi ngờ thành câu chuyện. |

### 2.6 Checklist nghiệm thu T2

- [ ] Quét từ cấm (phần 08 §2) cho toàn bộ chuỗi văn bản của tính năng: 0 lỗi.
- [ ] Mỗi câu «khó nghe» có câu «con có thể» trong cùng lượt thoại.
- [ ] Mô phỏng 60 giờ: Tiềm Lực 24 và 88 cùng tới được Côn Lôn; người 24 không chậm hơn quá 15% thời gian ở bất kỳ mốc nào sau bậc 3.
- [ ] Không SKU nào ảnh hưởng Đạo Hạnh, cảnh giới, Sổ Công Quá.
- [ ] Không thông báo đẩy nào dùng từ trong nhóm «sợ» (phần 08 §2.3).

---

## 3. T3 · Văn tu, không sát phạt

### 3.1 Định nghĩa đầy đủ

Huyền Giới **không có quái để giết, không có thanh máu đối thủ, không có vũ khí gây sát thương**. Thử thách của game thuộc bốn loại, gọi là **Tứ Tu**:

| Loại | Thử thách | Ví dụ cơ chế |
|---|---|---|
| **Tâm** (心) | giữ định, buông, đối diện tâm ma | tĩnh tọa nhịp thở, công án, Hồi III giữ thành quả, ải tâm ma Tham / Sân / Si |
| **Trí** (智) | hiểu, luận, phân biệt thật giả | giải án 6 bước, sảnh nghề, khoa cử, vạch mặt Định Mệnh Hội |
| **Đức** (德) | chọn điều đúng khi có giá | cứu người, từ chối Âm Bài, sám hối kèm sửa sai, kéo người lên ở Nại Hà |
| **Nghề** (藝) | làm khéo một việc | kết phù (ký tự hư cấu), luyện đan, thư pháp, y dược, sửa nhà, vẽ mạn-đà-la cát |

«Đối thủ» trong game là **ý niệm và thói quen** (định mệnh luận, lừa đảo tâm linh, tâm ma), không phải sinh thể. Phản diện là người; người thì được **vạch mặt, thuyết phục, cứu**, không bị giết.

### 3.2 Ngữ pháp của thử thách không sát phạt

Mỗi thử thách phải có đủ năm thành phần. Thiếu một là thử thách «nhạt» hoặc trượt về sát phạt:

| Thành phần | Câu hỏi | Ví dụ (ải tâm ma «Sân» của người có Dương Nhận) |
|---|---|---|
| **Áp lực** | Điều gì làm khó? | NPC khiêu khích, thời gian thở bị nhiễu |
| **Kỹ năng** | Người chơi giỏi lên ở đâu? | giữ nhịp thở khi có kích động; chọn câu trả lời không nóng |
| **Thất bại** | Thua thì sao? | ải kết thúc, NPC bỏ đi, người chơi ngồi lại; thử lại ngay, không mất gì ngoài thời gian |
| **Phần thưởng** | Thắng được gì ngoài số? | đặc tính «Kiên Nhẫn», một câu thoại mới của NPC, cảnh trời tạnh |
| **Ý nghĩa** | Nó dạy điều gì đúng với cổ pháp? | Dương Nhận là ý chí mạnh; điều hậu là chế bằng nhẫn |

### 3.3 Câu hỏi kiểm T3

| Mã | Câu hỏi | Bắt buộc | Cách kiểm |
|---|---|---|---|
| `KT-T3-01` | Có sinh thể nào bị tiêu diệt, đánh ngã, làm hại bởi người chơi để tiến bộ không? | **[B]** | rà spec, rà hoạt cảnh |
| `KT-T3-02` | Có thanh «máu» / «HP» của bất kỳ ai không? | **[B]** | rà UI |
| `KT-T3-03` | Vật phẩm hình vũ khí (kiếm gỗ đào, kiếm bay) có gây sát thương hay chỉ là pháp khí / phương tiện / trang phục? | **[B]** | rà hành vi vật phẩm |
| `KT-T3-04` | Thử thách thuộc loại nào trong Tứ Tu? Có đủ năm thành phần §3.2? | **[B]** | spec có bảng năm thành phần |
| `KT-T3-05` | Thất bại có phạt bằng mất Đạo Hạnh / vật phẩm không? (Chỉ được mất **thời gian** và **cơ hội trong lượt**.) | **[B]** | rà luật thất bại |
| `KT-T3-06` | Có tương tác MMO nào cho phép người này gây hại cho người kia (đẩy, chặn, cướp) không? | **[B]** | rà giao thức (`protocol.js`) |
| `KT-T3-07` | Phản diện (Lỗ Ban, Định Mệnh Hội) được giải quyết bằng gì? Phải là bằng chứng, thuyết phục, cứu, pháp luật trong truyện. | **[B]** | rà kịch bản Hồi II–IV |
| `KT-T3-08` | «Trừ tà» có được trình bày như chẩn đoán đời thực + lòng từ thay vì «diệt ma»? | **[B]** | rà chuỗi Mao Sơn, Phong Đô |
| `KT-T3-09` | Tính năng có nhịp **tĩnh** (ngồi, nhìn, nghe) ít nhất một lần không? | | spec có «khoảnh khắc tĩnh» |
| `KT-T3-10` | Kỹ năng người chơi có tăng thật (không chỉ chỉ số tăng)? | | thử: người chơi lần 5 làm tốt hơn lần 1 |
| `KT-T3-11` | Động vật trong tính năng có được đối xử như sinh mạng (không săn, không câu để ăn)? | **[B]** | rà |
| `KT-T3-12` | Từ ngữ có mang ngôn ngữ chiến đấu («diệt», «chém», «hạ gục», «farm quái») không? | **[B]** | quét từ (phần 08 §2) |

### 3.4 Ví dụ làm / không làm (T3)

| Mã | Tính năng | ✔ Làm | ✘ Không làm | Vì sao |
|---|---|---|---|---|
| `VD-T3-01` | Ngự kiếm (đã có, cấp 8) | Kiếm là **phương tiện**: bay 3–420 m, nhanh ×4 | Chém, phóng kiếm vào mục tiêu | kiếm của đạo sĩ là pháp khí và biểu tượng, không phải vũ khí trong game |
| `VD-T3-02` | Kiếm Gỗ Đào (Tàng Y Các) | Đeo lưng, đứng yên cầm trước ngực (`characters.js › hold`) | Hoạt cảnh múa kiếm đánh người khác | trang phục không có hành vi tấn công |
| `VD-T3-03` | Hồi IV · Phong Đô | Thử thách là đạo đức: đọc sổ nghiệp, cứu người | Đánh boss Diêm La | «Vùng không có quái vật để giết» (bản sơ đồ §7.9) |
| `VD-T3-04` | Mao Sơn trừ tà | Chẩn đoán đời thực (ngủ, ăn, áp lực) **trước**, phong thủy nhà, rồi mới phù (ký tự hư cấu) | Bắn phù vào ma | trừ tà chính tông của app là cứu người |
| `VD-T3-05` | Cản thi (truyền thuyết Miêu) | Kể như chuyện dẫn hồn về quê, lòng thương người chết xa nhà | Cương thi nhảy ra tấn công | truyền thuyết hóa quái vật là xúc phạm văn hóa (T6) |
| `VD-T3-06` | Định Mệnh Hội | Vạch mặt bằng đối chiếu lá số thật (`anti-manipulation-data › detectionPatterns`) trước dân làng | Đánh nhau với thầy bói lừa đảo | chân lý thắng bằng bằng chứng |
| `VD-T3-07` | Yểm sư Lỗ Ban (kết) | Bị vạch trần, mất người theo, đối diện nạn nhân; có cảnh ngỏ đường hồi đầu | Trận đấu cuối tiêu diệt Lỗ Ban | game tin cả kẻ ác cũng có thể quay đầu (nhưng không ép tha thứ) |
| `VD-T3-08` | Tâm ma | Hiện như **thời tiết trong tâm**: mây đen, tiếng ồn, bóng người quen | Quái vật «Tâm Ma» có thanh máu để chém | tâm ma không bị giết, chỉ được thấy rõ và lắng |
| `VD-T3-09` | Thái Cực (Võ Đang) | Nhịp điệu theo chiêu, đánh giá độ tròn đều của chuyển động | Đối kháng hai người tính điểm hạ đối thủ | Thái Cực trong game là dưỡng sinh, không là võ đối kháng |
| `VD-T3-10` | Phóng sinh | Mua lại chim trong lồng ở chợ rồi thả; thả cá ở hồ sen Bút Tháp | Câu cá để bán / nấu | sinh mạng trong game được tôn trọng |
| `VD-T3-11` | Ăn uống | Trai đường Toàn Chân: cơm chay nhận buff Nguyên Khí; trà | Săn thú lấy thịt | phù hợp các truyền thống có trong game |
| `VD-T3-12` | Nhà sàn Miêu Cương | Treo thịt hun là **đạo cụ bối cảnh** đời sống (bản sơ đồ §8.3) | Nhiệm vụ đi săn lợn rừng | đời sống thật được phép hiện diện; người chơi không là thợ săn |
| `VD-T3-13` | Thất Sát (七殺) | Đặc tính «Thất Sát» trong Ngũ Duy là **Trị đạo** (quyết đoán, quản lý) | Đổi thành «sát thương +» | đọc đúng thập thần: Sát là áp lực, quyền, kỷ luật |
| `VD-T3-14` | Dương Nhận | Ải tâm ma «Sân» khó hơn; vượt được nhận «Kiên Nhẫn» | +20% «công kích» | (bản sơ đồ §4.6) |
| `VD-T3-15` | Thất bại tĩnh tọa | Tạp niệm tràn → mở mắt, nghe tiếng chuông, ngồi lại được ngay | Mất Nguyên Khí lớn, «tẩu hỏa nhập ma» | không dọa (T6) và không phạt nặng (T3) |
| `VD-T3-16` | Khoa cử | Thi kiến thức; người chơi khác đỗ không làm mình trượt (chấm tuyệt đối, không chấm tương đối) | Xếp hạng loại trừ, chỉ 3 người đỗ mỗi kỳ | thi để học, không để đè nhau |
| `VD-T3-17` | MMO va chạm người chơi | Người chơi đi xuyên nhau (không chặn cửa điện) | Va chạm người chơi cho phép chặn đường | chặn đường là sát phạt xã hội |
| `VD-T3-18` | Cử chỉ (emote) | chắp tay, cúi chào, Tý Ngọ quyết (lễ Đạo), mời trà, vẫy | cử chỉ chém, đá, chỉ tay khinh miệt | mỗi cử chỉ là một lời |
| `VD-T3-19` | Nại Hà (Hồi IV, MMO) | Người chơi chính lộ **kéo** người Tà Lộ lên — hai bên cùng giữ nhịp | Người chính lộ «đánh tan» âm khí trên người kia | cứu là hợp tác |
| `VD-T3-20` | Lôi pháp (Thần Tiêu, Long Hổ) | Trình bày trong Tàng kinh như truyền thống khoa nghi; trong game là **nghi lễ cầu mưa / trừ ôn** (hư cấu, ký hiệu game) | Phép «Cửu Thiên Lôi» đánh mục tiêu | giữ đúng nghĩa lễ, không biến thành chiêu |
| `VD-T3-21` | Hào quang «Cửu Thiên Lôi Quang» (Tàng Y Các) | Tia sét nhỏ quanh thân, **không** phát ra hướng người khác | Hiệu ứng sét bắn vào người đứng gần | trang phục không tấn công, kể cả bằng hình |
| `VD-T3-22` | Hồi III · Lỗ Ban mời | Từ chối là một lựa chọn **có thưởng tương đương về truyện** (chuỗi «tự lực qua hạn») | Từ chối thì bị Lỗ Ban «tấn công» | không biến cám dỗ thành trận đánh |
| `VD-T3-23` | Hàng xóm cãi nhau (Huyền Thành) | Trị đạo: xử án tranh chấp NPC bằng hòa giải | Chọn phe đánh nhau | Trị đạo = xử, không = đánh |
| `VD-T3-24` | Bắt kẻ trộm kinh (SQ) | Lần dấu, đoán người, thuyết phục trả lại, Sổ Công Quá ghi «cải quá» cho cả kẻ trộm nếu được | Đuổi bắt, đánh ngã | cơ hội sửa sai cho NPC cũng là việc thiện |
| `VD-T3-25` | Rắn trong núi Võ Đang | Rắn là sinh vật bối cảnh; người chơi đứng yên chờ rắn đi (bài học nhẫn) | Diệt rắn để mở đường | thiên nhiên không phải chướng ngại để phá |
| `VD-T3-26` | Từ vựng UI | «Hóa giải», «vượt ải», «chuyển hóa», «giải án» | «Diệt», «hạ gục», «farm», «săn» | từ vựng định hình cách nghĩ |
| `VD-T3-27` | Vu y Miêu Cương | Hái thảo theo mùa, sắc thuốc cho NPC trong truyện; **không** công thức thật | Luyện «cổ trùng» để hại đối thủ | T6 + T3 |
| `VD-T3-28` | Hồ lô (Tàng Y Các) | Đựng «đan dược» trang trí; trong cảnh: mở nắp có hương khói | Hồ lô «thu yêu» kiểu Tây Du | thu yêu = bắt giữ sinh thể = sát phạt mềm |
| `VD-T3-29` | Tranh luận với Khổng tiên sinh | Đối thoại nhiều lượt; người chơi «thắng» khi đưa ra hành động, không khi làm ông câm lặng | Thanh «thuyết phục» kiểu đấu khẩu đánh gục đối phương | mục tiêu là hiểu, không là hạ |
| `VD-T3-30` | Cơ chế «đuổi bắt» tiến độ (nhiệm vụ thời gian) | Hiếm; nếu có thì là **kịp làm việc thiện** (kịp đưa thuốc trước giờ Dậu) | Truy đuổi kẻ địch | áp lực thời gian phục vụ việc thiện |

### 3.5 Ca biên T3

| Mã | Tình huống | Xử lý |
|---|---|---|
| `CB-T3-01` | Người chơi bay ngự kiếm lao thẳng vào NPC | NPC né nhẹ (hoạt cảnh lùi), không ngã, không bị thương. Lặp lại 3 lần thì NPC có câu «Đạo hữu bay chậm thôi.» |
| `CB-T3-02` | Người chơi dùng nhân vật đứng chắn cửa điện (MMO) | Va chạm người chơi tắt (`VD-T3-17`); không chắn được. |
| `CB-T3-03` | Người chơi viết vào chat ngôn ngữ đe dọa | Bộ lọc + báo cáo; hệ thống này thuộc tài liệu 10. |
| `CB-T3-04` | Truyền thống thật có nghi lễ «chém» (kiếm trảm tà trong khoa nghi) | Được **mô tả** trong Tàng kinh và **diễn** bởi NPC trong cảnh lễ (hoạt cảnh múa kiếm có chủ đích nghi lễ, không đối tượng), người chơi xem, không điều khiển. Đúng T5, không vi phạm T3. |
| `CB-T3-05` | Người chơi muốn «độ khó» và cảm giác căng thẳng | Thử thách khó có ở: đình thí, ải tâm ma bậc cao, án khách «Dị Cách», vạch mặt Lỗ Ban (nhiều tầng bằng chứng). Áp lực từ **trí và tâm**, không từ phản xạ. Xem phần 06 §5. |
| `CB-T3-06` | Người chơi đi Tà Lộ hỏi «yểm có đánh người được không» | Không có cơ chế yểm người chơi khác. Âm Bài chỉ nhân Hậu Thiên của chính mình; cái giá rơi vào **NPC trong truyện** (bản sơ đồ §5.5), không vào người chơi thật. |

### 3.6 Checklist nghiệm thu T3

- [ ] Không có thành phần «HP», «sát thương», «tấn công» trong mã và UI của tính năng.
- [ ] Bảng năm thành phần (§3.2) có trong spec.
- [ ] Thất bại chỉ mất thời gian / lượt.
- [ ] Quét từ vựng chiến đấu: 0 lỗi.
- [ ] Hoạt cảnh có vật hình vũ khí được duyệt bởi người phụ trách T3.

---

## 4. Ba trụ cột đầu đặt cạnh nhau — bảng đọc nhanh cho từng hệ thống lớn

Bảng này cho biết **ba trụ cột đầu đòi hỏi gì** ở mỗi hệ thống lớn của game. Phần 2 làm tiếp cho T4–T6; ma trận ở phần 2 §8.2 chỉ ra chỗ sáu trụ cột giằng co.

| Hệ thống | T1 đòi | T2 đòi | T3 đòi |
|---|---|---|---|
| Mở đầu «Nhập Môn» (MQ-P) | form bát tự, lễ lật trụ đọc `R` | câu dẫn điểm thấp; Khổng tiên sinh hỏi ngược | không có «tutorial chiến đấu»; dạy đi, ngồi, chào, hỏi |
| Mệnh Bàn | mọi vòng la bàn từ engine, «Vì sao?» | không tô đỏ bậc thấp; ghi «Tiên Thiên — hạt giống» | — |
| Mệnh Đồ | `gaimenhPlan(R)` nguyên văn | luôn có nút «Tích âm đức» mở | mỗi nút là việc tu, không là trận |
| Sổ Công Quá | `CONG_QUA`, `meritLedger` | chỉ ghi điều người chơi chọn | việc thiện là hành động có kỹ năng (cứu, giải án) |
| Cảnh giới | công thức canon | Tiên Thiên thôi tính từ bậc 4 | lên bậc bằng tu, không bằng hạ đối thủ |
| Giải án / sảnh nghề | lá số khách sinh bằng engine | thất bại gọi tên lỗi luận, không gọi tên mệnh | trí tu thuần |
| Thánh địa | đạo thống hợp Dụng +10% (`_YONG2CULT`) | không bắt buộc đạo hợp Dụng | mỗi thánh địa có Tứ Tu riêng |
| MMO | chỉ gửi dữ liệu được phép | Thiên Bảng theo Đạo Hạnh | không va chạm, không hại người |
| Tàng Y Các | bộ Hợp mệnh theo Dụng | không bán tu | đồ hình vũ khí không tấn công |
| Thầy AI | brief lá số thật, `checkNeo` | RB2 | — |
| Hồi III · Năm Hạn | năm thấp nhất từ `liunian` | thử thách, không phạt | cám dỗ không biến thành trận |
| Tà Lộ | Nợ Âm là số công khai | luôn hồi đầu được | hệ quả là người bị hại trong truyện, không là quái |

## 5. Mười câu hỏi khó đội thiết kế đã trả lời (để không hỏi lại)

1. **«Không có chiến đấu thì game có chán không?»** — Chán nếu thử thách không có áp lực và kỹ năng. Tứ Tu (§3.1) và năm thành phần (§3.2) là câu trả lời. Các tham chiếu thị trường (phần 15) cho thấy game không chiến đấu vẫn giữ người chơi bằng xã hội, nhịp ngày, khám phá và cảm xúc (Sky, Journey, Animal Crossing, Stardew Valley).
2. **«Sao không cho người chơi chọn chỉ số rồi gắn lá số làm hương vị?»** — Vì như vậy lá số thành trang trí, mất lý do tồn tại của game (T1).
3. **«Lá số tốt có bị thiệt không?»** — Không. Họ tới sớm hơn ở bậc thấp, có nhánh `BR-TT` với thử thách đạo đức riêng, có Mệnh Cấp đẹp. Họ chỉ không được bảo đảm đứng đầu Thiên Bảng.
4. **«Hệ số Nghịch Thiên có khuyến khích nhập ngày sinh giả để lấy lá số thấp không?»** — Có thể với người tối ưu hóa. Trần 1,5 và lợi thế chỉ rõ từ bậc 4 làm động cơ này nhỏ. Lá số giả cũng làm mất thứ quý nhất game cho: «game hiểu mình». Không chặn bằng kỹ thuật (không xác minh ngày sinh), chặn bằng thiết kế.
5. **«Năm Hạn dùng lưu niên thật — người chơi sẽ sợ năm thật của mình?»** — Có rủi ro. Vì vậy Hồi III được trình bày là **chuỗi mộng** (bản sơ đồ §3), với bài học «nghịch vận thì giữ». Lời thoại không nói «năm 2031 con sẽ gặp nạn»; nói «năm Tân Hợi là năm Kỵ thần vượng của con: năm để giữ». Chi tiết ở phần 06.
6. **«Bản iOS không có bói — T1 còn đứng không?»** — Còn. Mệnh Bàn, Ngũ Hành Lực, Dụng thần, Ngũ Duy vẫn là **học cổ pháp về lá số của mình** (Học Quán). Phần bị tắt là đoán vận (Vận Mệnh Các, Thái Tuế Điện, quẻ, xăm, Thầy AI). Xem chân dung `PS-03` (phần 04).
7. **«Có người thật sự tin lá số và sẽ đau khi thấy điểm thấp. Có nên giấu điểm?»** — Không giấu (giấu là T1 vỡ, và họ đã thấy điểm trên trang chính). Đổi khung trình bày (`VD-T2-01`) và cho cơ chế đứng sau lời nói (§2.2).
8. **«Phản diện không bị đánh bại thì người chơi có thỏa mãn?»** — Thỏa mãn của game là **thấy sự thật được phơi ra trước đám đông** và **thấy người bị hại được cứu**. Cảnh vạch mặt cần dựng như cao trào (âm nhạc, đám đông, camera) — phần 06.
9. **«Tại sao Kỵ thần không đơn giản là bất lợi?»** — Vì «bất lợi vĩnh viễn gắn với ngày sinh» chính là định mệnh luận bằng cơ chế.
10. **«T1 có mâu thuẫn với lời "mệnh do ta tạo" không, khi Tiên Thiên không đổi?»** — Không. Game tách **mệnh** (tám chữ, không đổi) và **vận đời** (việc làm, đổi được). Đây cũng là cách chuyện Liễu Phàm phân biệt. Câu kết Vĩ thanh nói đúng điều đó.
