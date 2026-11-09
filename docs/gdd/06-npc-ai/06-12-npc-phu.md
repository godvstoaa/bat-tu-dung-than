# 06-12 · NPC phụ (`NPC-*`) — 44 nhân vật theo vùng + mẫu dân làng sinh thủ tục

## 1. Quy ước chung

### 1.1 Mã và lá số

- **Mã:** `NPC-<region>-NN`. Vùng theo canon §3; riêng `langthang` (lang thang) cho NPC không cố định.
- **Lá số:** mỗi NPC phụ có **lá số thật** sinh bằng `src/game/npc.js › makeNpc(key, year)` rồi chạy `chart.js › analyze()` (cùng cách `cases.js` dựng án khách). Mọi số liệu dưới đây là **kết quả chạy engine thật** ngày 2026-11-05.

### 1.2 Ràng buộc kỹ thuật: năm gốc cố định

- `makeNpc` tính năm sinh bằng `year − (18 + r·55)`. Nếu gọi với năm hiện tại, **năm sinh của NPC sẽ trôi mỗi năm**.
- Vì vậy game phải gọi với hằng số `NPC_EPOCH = 2026` **(chưa có — cần làm)**. Tuổi hiển thị vẫn tính theo năm thật.
- **Khoá có hậu tố `#n`:** hậu tố là «muối» để `makeNpc` trả đúng giới tính và khoảng tuổi mong muốn (đã dò trước). Khoá đầy đủ được lưu cố định trong bảng dữ liệu, không tính lại.
- Tên, nghề, câu hỏi do `makeNpc` sinh **bị thay** bằng tên, vai thiết kế ở đây. Chỉ lấy ngày giờ sinh và giới tính.

### 1.3 Thoại và trạng thái

- **Thoại:** NPC phụ **chỉ chạy kịch bản** (06-01 §9.3). Người chơi có thể nhờ Thầy Tử Bình luận lá số của họ qua khung `openMaster` với `subject.kind = 'khach'`, khi nhiệm vụ cho phép.
- **Nhiệm vụ:**
  - `SQ-<region>-xx` do tài liệu 03 cấp mã; ở đây ghi «TBD-03» kèm tên làm việc.
  - Việc thiện, ác ghi theo `DEED-*` của 05 (TBD-05).
- **Bark:** `BARK-NPC-<region>-NN-k`.
- **Ký hiệu engine:** điểm = `synthesis.score`; phẩm căn theo canon §5; cách = `patternQuality.quality`; Dụng = `yong.primary`; thân = `strength.level`.

## 2. Bảng tổng hợp lá số

| Mã | Khoá `makeNpc` | Giới | Sinh | Tứ trụ (năm · tháng · ngày · giờ) | Điểm · Phẩm căn | Mệnh Cách | Dụng | Thân |
|---|---|---|---|---|---|---|---|---|
| NPC-thanh-01 | `NPC-thanh-01#19` | nữ | 1967-12-14 11:15 | 丁未 · 壬子 · 壬子 · 丙午 | 36 · Tứ Linh Căn | Đắc Cứu | Mộc | quá vượng |
| NPC-thanh-02 | `NPC-thanh-02#37` | nam | 2007-09-11 05:00 | 丁亥 · 己酉 · 戊申 · 乙卯 | 41 · Tứ Linh Căn | Nghịch Thiên | Hỏa | quá nhược |
| NPC-thanh-03 | `NPC-thanh-03#9` | nam | 1959-01-30 20:45 | 戊戌 · 乙丑 · 壬子 · 庚戌 | 28 · Ngũ Linh Căn | Nghịch Thiên | Hỏa | vượng |
| NPC-thanh-04 | `NPC-thanh-04#10` | nữ | 1988-03-08 02:30 | 戊辰 · 乙卯 · 壬戌 · 辛丑 | 44 · Tứ Linh Căn thuận | Nghịch Thiên | Mộc | quá nhược |
| NPC-thanh-05 | `NPC-thanh-05#4` | nam | 1977-06-27 06:45 | 丁巳 · 丙午 · 乙卯 · 己卯 | 38 · Tứ Linh Căn | Nghịch Thiên | Thủy | quá nhược |
| NPC-thanh-06 | `NPC-thanh-06#16` | nữ | 1999-07-15 13:30 | 己卯 · 辛未 · 戊辰 · 己未 | 53 · Tam Linh Căn | Đắc Cứu | Kim | quá vượng |
| NPC-thanh-07 | `NPC-thanh-07#2` | nam | 1957-10-04 06:00 | 丁酉 · 己酉 · 己酉 · 丁卯 | 41 · Tứ Linh Căn | Nghịch Thiên | Hỏa | nhược |
| NPC-thanh-08 | `NPC-thanh-08#1` | nam | 2003-04-02 10:45 | 癸未 · 乙卯 · 乙巳 · 辛巳 | 39 · Tứ Linh Căn | Nghịch Thiên | Kim | vượng |
| NPC-thanh-09 | `NPC-thanh-09#1` | nữ | 1984-03-03 02:15 | 甲子 · 丙寅 · 丙申 · 己丑 | 34 · Ngũ Linh Căn | Nghịch Thiên | Thủy | vượng |
| NPC-tubinh-01 | `NPC-tubinh-01#17` | nam | 1966-06-19 00:45 | 丙午 · 甲午 · 己酉 · 甲子 | 32 · Ngũ Linh Căn | Nghịch Thiên | Thủy | vượng |
| NPC-tubinh-02 | `NPC-tubinh-02` | nữ | 1999-06-06 22:30 | 己卯 · 庚午 · 己丑 · 乙亥 | 26 · Phàm Căn | Nghịch Thiên | Thủy | trung hòa |
| NPC-manh-01 | `NPC-manh-01#10` | nam | 1970-01-01 01:30 | 己酉 · 丙子 · 辛巳 · 己丑 | 50 · Tam Linh Căn | Nghịch Thiên | Hỏa | vượng |
| NPC-manh-02 | `NPC-manh-02#52` | nữ | 2007-12-28 02:45 | 丁亥 · 壬子 · 丙申 · 己丑 | 36 · Tứ Linh Căn | Đắc Cứu | Mộc | quá nhược |
| NPC-trichthien-01 | `NPC-trichthien-01#31` | nam | 1979-02-03 22:45 | 戊午 · 乙丑 · 辛丑 · 己亥 | 48 · Tứ Linh Căn thuận | Nghịch Thiên | Kim | quá vượng |
| NPC-cungthong-01 | `NPC-cungthong-01#12` | nữ | 1966-07-17 04:00 | 丙午 · 乙未 · 丁丑 · 壬寅 | 34 · Ngũ Linh Căn | Nghịch Thiên | Thủy | quá vượng |
| NPC-cungthong-02 | `NPC-cungthong-02#11` | nam | 1976-11-29 17:00 | 丙辰 · 己亥 · 乙酉 · 乙酉 | 52 · Tam Linh Căn | Nghịch Thiên | Hỏa | vượng |
| NPC-thulau-01 | `NPC-thulau-01#4` | nữ | 1996-02-09 18:45 | 丙子 · 庚寅 · 丙子 · 丁酉 | 44 · Tứ Linh Căn thuận | Nghịch Thiên | Mộc | nhược |
| NPC-phongthuy-01 | `NPC-phongthuy-01#17` | nam | 1977-06-06 14:00 | 丁巳 · 丙午 · 甲午 · 辛未 | 75 · Song Linh Căn thượng | Thuận Thiên | Hỏa | quá nhược |
| NPC-phongthuy-02 | `NPC-phongthuy-02#2` | nam | 1984-01-07 18:45 | 癸亥 · 乙丑 · 庚子 · 乙酉 | **86 · Thiên Linh Căn** | Đắc Cứu | Thủy | quá nhược |
| NPC-lichduong-01 | `NPC-lichduong-01#3` | nữ | 1968-12-15 06:30 | 戊申 · 甲子 · 己未 · 丁卯 | 52 · Tam Linh Căn | Nghịch Thiên | Mộc | vượng |
| NPC-lichduong-02 | `NPC-lichduong-02#33` | nam | 2005-04-30 16:15 | 乙酉 · 庚辰 · 甲申 · 壬申 | 69 · Song Linh Căn | Đắc Cứu | Thủy | nhược |
| NPC-longho-01 | `NPC-longho-01#1` | nam | 2005-04-16 10:00 | 乙酉 · 庚辰 · 庚午 · 辛巳 | 30 · Ngũ Linh Căn | Nghịch Thiên | Thủy | vượng |
| NPC-longho-02 | `NPC-longho-02#2` | nữ | 1959-03-31 10:15 | 己亥 · 丁卯 · 壬子 · 乙巳 | 35 · Ngũ Linh Căn | Nghịch Thiên | Kim | nhược |
| NPC-vodang-01 | `NPC-vodang-01#3` | nữ | 1992-01-10 07:15 | 辛未 · 辛丑 · 乙酉 · 庚辰 | 40 · Tứ Linh Căn | Đắc Cứu | Hỏa | quá nhược |
| NPC-vodang-02 | `NPC-vodang-02#5` | nam | 1995-12-10 07:00 | 乙亥 · 戊子 · 乙亥 · 庚辰 | 42 · Tứ Linh Căn | Nghịch Thiên | Hỏa | quá vượng |
| NPC-chungnam-01 | `NPC-chungnam-01#9` | nam | 2001-09-10 13:00 | 辛巳 · 丁酉 · 丙子 · 乙未 | 45 · Tứ Linh Căn thuận | Nghịch Thiên | Thủy | trung hòa |
| NPC-chungnam-02 | `NPC-chungnam-02#3` | nữ | 1968-09-17 09:15 | 戊申 · 辛酉 · 庚寅 · 辛巳 | 36 · Tứ Linh Căn | Đắc Cứu | Thủy | quá vượng |
| NPC-maoshan-01 | `NPC-maoshan-01#1` | nữ | 1990-05-29 02:15 | 庚午 · 辛巳 · 甲午 · 乙丑 | 31 · Ngũ Linh Căn | Nghịch Thiên | Thủy | quá nhược |
| NPC-maoshan-02 | `NPC-maoshan-02#1` | nam | 1969-02-10 13:15 | 己酉 · 丙寅 · 丙辰 · 乙未 | 23 · Phàm Căn | Nghịch Thiên | Thủy | vượng |
| NPC-yentu-01 | `NPC-yentu-01#14` | nam | 2008-10-19 23:45 | 戊子 · 壬戌 · 癸巳 · 壬子 | 57 · Tam Linh Căn | Thuận Thiên | Mộc | vượng |
| NPC-yentu-02 | `NPC-yentu-02#1` | nam | 1956-10-12 06:15 | 丙申 · 戊戌 · 壬子 · 癸卯 | 54 · Tam Linh Căn | Đắc Cứu | Mộc | quá vượng |
| NPC-buttap-01 | `NPC-buttap-01` | nữ | 1961-02-07 15:45 | 辛丑 · 庚寅 · 辛未 · 丙申 | 31 · Ngũ Linh Căn | Nghịch Thiên | Hỏa | quá vượng |
| NPC-buttap-02 | `NPC-buttap-02#5` | nam | 1992-04-04 05:15 | 壬申 · 癸卯 · 庚戌 · 己卯 | 44 · Tứ Linh Căn thuận | Nghịch Thiên | Thổ | trung hòa |
| NPC-tangdia-01 | `NPC-tangdia-01#3` | nam | 1992-05-23 11:15 | 壬申 · 乙巳 · 己亥 · 庚午 | 54 · Tam Linh Căn | Nghịch Thiên | Thủy | nhược |
| NPC-vanmieu-01 | `NPC-vanmieu-01#3` | nam | 1996-10-31 05:15 | 丙子 · 戊戌 · 辛丑 · 辛卯 | 38 · Tứ Linh Căn | Nghịch Thiên | Mộc | quá vượng |
| NPC-vanmieu-02 | `NPC-vanmieu-02#3` | nữ | 1994-05-22 02:15 | 甲戌 · 己巳 · 戊申 · 癸丑 | 44 · Tứ Linh Căn thuận | Nghịch Thiên | Mộc | vượng |
| NPC-phongdo-01 | `NPC-phongdo-01` | nam | 1960-05-24 19:30 | 庚子 · 辛巳 · 壬子 · 庚戌 | 53 · Tam Linh Căn | Nghịch Thiên | Hỏa | quá vượng |
| NPC-phongdo-02 | `NPC-phongdo-02#8` | nam | 1984-10-16 13:00 | 甲子 · 甲戌 · 癸未 · 己未 | 25 · Phàm Căn | Nghịch Thiên | Kim | nhược |
| NPC-mieucuong-01 | `NPC-mieucuong-01#4` | nữ | 2004-01-09 07:45 | 癸未 · 乙丑 · 丁亥 · 甲辰 | 57 · Tam Linh Căn | Đắc Cứu | Mộc | nhược |
| NPC-mieucuong-02 | `NPC-mieucuong-02#4` | nam | 1967-10-14 19:00 | 丁未 · 庚戌 · 辛亥 · 戊戌 | 48 · Tứ Linh Căn thuận | Nghịch Thiên | Hỏa | quá vượng |
| NPC-vancoc-01 | `NPC-vancoc-01#4` | nam | 2008-03-14 08:30 | 戊子 · 乙卯 · 癸丑 · 丙辰 | 38 · Tứ Linh Căn | Nghịch Thiên | Kim | quá nhược |
| NPC-conlon-01 | `NPC-conlon-01#6` | nữ | 1968-06-18 13:30 | 戊申 · 戊午 · 己未 · 辛未 | 77 · Song Linh Căn thượng | Thuận Thiên | Kim | quá vượng |
| NPC-langthang-01 | `NPC-langthang-01#2` | nữ | 1988-07-11 12:15 | 戊辰 · 己未 · 丁卯 · 丙午 | 28 · Ngũ Linh Căn | Nghịch Thiên | Thủy | quá vượng |
| NPC-langthang-02 | `NPC-langthang-02#2` | nam | 1992-03-01 02:15 | 壬申 · 壬寅 · 丙子 · 己丑 | 45 · Tứ Linh Căn thuận | Nghịch Thiên | Mộc | quá nhược |

### 2.1 Nhận xét thiết kế từ dữ liệu thật

- **Phân bố Mệnh Cách:** 32/44 bại cách (Nghịch Thiên), 9 Đắc Cứu, 3 Thuận Thiên. Mẫu nhỏ, chọn theo giới và tuổi, không phải thống kê dân số; tài liệu 04 nên đo tỉ lệ `败格` trên mẫu lớn để kiểm engine (câu hỏi mở). Game tận dụng: thế giới đầy người «lá số xấu» sống tử tế, đúng trụ cột T2.
- **Không NPC nào ra Dị Cách** (`特殊`). Phương sĩ Vô Danh vì vậy là gương duy nhất cho người chơi Dị Cách. Nếu cần thêm, dò muối tới khi `patternQuality.quality === '特殊'` (câu hỏi mở cho 04).
- **Cặp đối lập có chủ ý:**
  - Triệu Sát (`NPC-phongthuy-02`), kẻ lừa của Định Mệnh Hội, có lá số **86 điểm Thiên Linh Căn**. Lá số cực phẩm mà đi lừa: bài học «lá số không làm nên người».
  - Hắc Phù Lão (`NPC-maoshan-02`) 23 điểm Phàm Căn.
  - Hai kẻ lừa ở hai đầu thang điểm.
- Thợ cả Đoàn Mộc (75, Thuận Thiên) là người thợ lương thiện. Gương ngược của Công Thâu Nghiệt (bại cách, thành yểm sư).

---

## 3. Huyền Thành (`thanh`)

### NPC-thanh-01 · Bà Hai Nhạn — chủ nhà trọ «Mây Lành»

| Mục | Nội dung |
|---|---|
| Vai | chủ nhà trọ nơi người chơi Nghịch Thiên nghỉ đêm bị «chưa nhận» (06-02 VC.20); nơi Khổng tiên sinh thuê phòng |
| Tiểu sử | góa chồng từ năm 40, nuôi ba con ăn học bằng cái nhà trọ sáu phòng. Thân quá vượng: làm không biết mệt, nói không biết dừng. Không tin bói («bói thì trọ ai trả tiền?»), nhưng cho Khổng tiên sinh ở rẻ vì «ông ấy thật thà» |
| Ngoại hình | ngoài 55, người đậm, áo cánh nâu, khăn vấn, chùm chìa khóa ở thắt lưng, tay cầm chổi lông gà |
| Lịch | Mão mở cửa · Thìn–Thân dọn phòng, nấu cơm · Tuất ngồi quầy · Hợi khóa cổng (không khóa với người chơi Nghịch Thiên đêm đầu) |
| Thoại | «Lại một người bị Sơn Môn trả về à? Vào đi, nhà còn phòng cuối hành lang.» · «Ăn cơm chưa? Cơm nguội thì bà hâm.» · «Bà không tin bói. Tin thì trọ ai trả tiền?» · «Ông Khổng ở phòng hai. Ông ấy ít nói, trả tiền đúng ngày.» · «Đêm qua có ông sư già ướt sũng tới tìm cậu. Bà cho ông ấy cái khăn.» |
| Nhiệm vụ | «Thùng nước cho bà Hai» (việc thiện đầu tiên gợi ý ở VC.19b — TBD-03, DQ); «Đứa con trai thứ ba» (con trai bà sắp thi, nhờ người chơi đưa lên Văn Miếu gặp Tế tửu — SQ-thanh-?? TBD-03) |
| Bark | BARK-NPC-thanh-01-1 «Ai ở phòng ba chưa trả chìa?» · BARK-NPC-thanh-01-2 (G:Hợi) «Khóa cổng đây! Ai về muộn gõ ba tiếng.» |

### NPC-thanh-02 · Cu Tí — tiểu đồng bán trà rong

| Mục | Nội dung |
|---|---|
| Vai | bán trà rong quanh Sơn Môn; hướng dẫn đường đi cho người mới; nguồn tin đồn |
| Tiểu sử | mười chín tuổi, mồ côi, được ông Lục Bảng nuôi. Lá số bại cách, thân quá nhược. Cậu từng bị một thầy quầy bảo «số làm thuê suốt đời», tin luôn, thôi học chữ. Nhiệm vụ của cậu là học lại |
| Ngoại hình | gầy, đen nhẻm, áo nâu vá, quang gánh hai ấm trà, nón mê |
| Lịch | Mão–Mùi gánh trà quanh Sơn Môn · Thân về quán ông Lục Bảng · Tuất học chữ (sau nhiệm vụ) |
| Thoại | «Trà đây! Một chén nóng, đỡ mỏi chân leo Sơn Môn!» · «Cậu mới tới à? Bàn Thầy ở giữa sân, Tàng Y Các bên trái.» · «Người ta bảo số tôi làm thuê suốt đời.» · (sau nhiệm vụ) «Tôi viết được tên mình rồi! Cu… không, Tí. Tên thật là Phúc.» |
| Nhiệm vụ | «Chữ cho Cu Tí» — dẫn cậu tới Tế tửu, chứng minh «số làm thuê» là lời sai (DMH án phụ; SQ-thanh-?? TBD-03); việc thiện «khuyên học» (TBD-05) |
| Bark | BARK-NPC-thanh-02-1 «Trà nóng đây!» · BARK-NPC-thanh-02-2 «Nghe nói ông Khổng hôm nay đoán trúng ba người liền!» |

### NPC-thanh-03 · Ông Lục Bảng — chủ Trà Thất

| Mục | Nội dung |
|---|---|
| Vai | chủ quán trà Huyền Thành; nơi Khổng tiên sinh ăn tối; **nạn nhân đầu tiên của Tà Lộ** (canon §5.5: «nhà Trà Thất có người ốm») |
| Tiểu sử | 67 tuổi, Ngũ Linh Căn, bại cách. Bán trà bốn mươi năm, nuôi Cu Tí. Biết chuyện cả thành, giữ kín mọi chuyện người ta kể. Vợ ông là người ốm khi người chơi dùng Âm Bài (cơ chế hậu quả do 03/05) |
| Ngoại hình | già, gầy, lưng còng, râu dê, áo the đen cũ, khăn xếp, tay luôn cầm ấm |
| Lịch | Mão mở quán · cả ngày pha trà · Tuất phục vụ Khổng tiên sinh · Hợi đóng quán |
| Thoại | «Trà Thái hay trà sen? Trà sen thì đợi bà nhà ướp.» · «Ông Khổng ngồi góc ấy ba mươi năm, chưa gọi món khác.» · (TL) «Bà nhà tôi ốm mấy hôm nay. Lạ, bà chưa ốm bao giờ.» · (HD, sau khi người chơi trả nghiệp) «Bà nhà khỏe rồi. Cậu ngồi đi, chén này tôi mời.» |
| Nhiệm vụ | chuỗi trả nghiệp mục 1 (PQ.05 «Người đầu tiên: ông Lục Bảng» — TL-xx TBD-03); việc thiện «kính lão» (TBD-05) |
| Bark | BARK-NPC-thanh-03-1 «Nước sôi rồi.» · BARK-NPC-thanh-03-2 (G:Tuất) «Ông Khổng, trà như cũ nhé.» |

### NPC-thanh-04 · Chị Sen — bán chim lồng ở chợ

| Mục | Nội dung |
|---|---|
| Vai | điểm phóng sinh «mua lại chim đã bị bắt» (canon §5.3); án lừa đảo số 2 (06-10 C3) |
| Tiểu sử | 38 tuổi, chồng đi phu xa, nuôi hai con. Bán chim vì không có vốn khác. Bị Định Mệnh Hội bảo «Kim khắc Mộc năm nay, phải bán chim đi lễ». Người chơi giúp chị chuyển nghề (bán hạt giống — nghề hợp Dụng Mộc) |
| Ngoại hình | gầy, nón lá, áo bà ba nâu, quang gánh lồng chim tre |
| Lịch | Thìn–Ngọ ở chợ · Mùi về nhà · Thân–Dậu chợ chiều |
| Thoại | «Mua chim thả à? Mua đi, nhưng đừng hẹn tôi mai bắt thêm. Ni sư dặn rồi.» · «Thầy quầy bảo năm nay Kim khắc Mộc, tôi chết.» · (sau án) «Năm nay là năm Hỏa à? Thế mà tôi sợ cả tháng.» · «Hạt giống bán chậm hơn chim, nhưng tôi ngủ ngon hơn.» |
| Nhiệm vụ | án DMH số 2 (SQ-thanh-?? TBD-03); «Nghề mới cho chị Sen» (Thương đạo, Ngũ Duy Tài); phóng sinh (DEED TBD-05) |
| Bark | BARK-NPC-thanh-04-1 «Chim sẻ, chim khuyên đây!» · BARK-NPC-thanh-04-2 (sau nhiệm vụ) «Hạt cải, hạt mùi đây!» |

### NPC-thanh-05 · «Thầy» Quách Toàn — quầy đổi mệnh Huyền Thành (Định Mệnh Hội)

| Mục | Nội dung |
|---|---|
| Vai | thầy quầy Định Mệnh Hội ở chợ Huyền Thành; án lừa đảo số 1 (bà khách tuổi Dậu) |
| Tiểu sử | 49 tuổi, bại cách, thân quá nhược. Từng là học trò bỏ dở của Sơn Môn. Hắn đọc lá số đúng ba phần, rồi bán bảy phần. Hắn sợ Công Thâu Nghiệt hơn sợ ai |
| Ngoại hình | béo tròn, áo dài gấm xanh rẻ tiền, mũ quả dưa, nhẫn đồng to, quạt giấy vẽ bát quái in sai thứ tự |
| Lịch | Thìn–Dậu ngồi quầy · Tuất uống rượu ở quán cuối phố |
| Thoại | kịch bản DMH.00–DMH.14 (06-10 C5) · «Ngồi! Xem miễn phí.» · (bị vạch) «Ngươi đọc sách ở đâu?» · (Hồi IV, nếu người chơi Hồi Đầu thuyết phục) «Ta… ta bỏ quầy. Ta đi trả tiền từng nhà.» (nhánh tuỳ 03) |
| Nhiệm vụ | án DMH số 1 (SQ-thanh-?? TBD-03) |
| Bark | BARK-dinh_menh_hoi-01/02 (dùng chung) · BARK-NPC-thanh-05-1 (sau khi bị vạch) «Hôm nay nghỉ.» |

### NPC-thanh-06 · Lý Hằng — người viết ký sự điều tra Định Mệnh Hội

| Mục | Nội dung |
|---|---|
| Vai | đồng minh Hồi II: ghi chép các án lừa; người chơi gửi bằng chứng cho cô; kết Hồi II cô in «Sổ Đỏ Định Mệnh Hội» |
| Tiểu sử | 27 tuổi, Tam Linh Căn, Đắc Cứu, thân quá vượng. Mẹ cô mất tiền dành dụm vì «lễ đổi mệnh». Cô học chữ ở Văn Miếu, viết ký sự cho tờ báo vách Huyền Thành |
| Ngoại hình | tóc tết gọn, áo dài vải lam, túi vải đeo chéo đầy giấy, bút lông cài tai |
| Lịch | Thìn–Ngọ đi chợ ghi chép · Mùi–Thân viết ở quán ông Lục Bảng · Tuất dán báo vách |
| Thoại | «Anh vừa vạch quầy kia à? Kể tôi nghe từ đầu, tôi ghi.» · «Mẹ tôi mất mười năm dành dụm cho một mâm lễ.» · «Tôi không chửi họ. Tôi in chỉ số thật cạnh lời họ nói.» · «Bằng chứng thứ năm rồi. Đủ để in.» |
| Nhiệm vụ | «Sổ Đỏ» — thu bằng chứng từ ≥ 5 án vùng (SQ-thanh-?? TBD-03); việc thiện «khuyên thiện» (TBD-05) |
| Bark | BARK-NPC-thanh-06-1 «Báo vách mới dán đây!» · BARK-NPC-thanh-06-2 «Ai bị phán hạn mà mất tiền, gặp tôi.» |

### NPC-thanh-07 · Ông đồ Vũ — viết câu đối ở chợ

| Mục | Nội dung |
|---|---|
| Vai | viết câu đối, chữ đầu năm; gợi ý đạo hiệu (dẫn về bàn đặt tên của Tế tửu) |
| Tiểu sử | 69 tuổi, bại cách, thân nhược. Thi hỏng ba lần thời trẻ, về viết chữ thuê. Bạn học cũ của Tế tửu Văn Miếu, hai ông vẫn gửi thơ cho nhau |
| Ngoại hình | áo the thâm, khăn xếp, kính tròn, râu bạc thưa, ngồi chiếu bên nghiên mực và giấy đỏ |
| Lịch | Thìn–Thân ngồi chợ · mùa Tết ngồi từ Mão tới Dậu (sự kiện EV-Tết, 10) |
| Thoại | «Xin chữ gì? Chữ Nhẫn, chữ Phúc, hay chữ của riêng mình?» · «Chữ tôi viết không đổi mệnh ai. Nó chỉ treo trên tường cho người ta nhớ.» · «Tôi thi hỏng ba lần. Ông Trinh đỗ một lần. Chữ tôi đẹp hơn.» · «Đạo hiệu à? Lên Văn Miếu. Ông bạn tôi đặt giỏi hơn tôi.» |
| Nhiệm vụ | «Thư cho bạn cũ» (mang thư lên Văn Miếu — +thiện cảm Tế tửu; SQ-thanh-?? TBD-03) |
| Bark | BARK-NPC-thanh-07-1 «Cho chữ đây!» · BARK-NPC-thanh-07-2 (W:gió) «Chặn giấy lại, gió bay mất chữ.» |

### NPC-thanh-08 · Tiểu đạo Minh Khê — đệ tử trực Bàn Thầy

| Mục | Nội dung |
|---|---|
| Vai | đệ tử của Thầy Tử Bình; dẫn khách vào án; hướng dẫn 6 bước luận cho người chơi lần đầu (bổ trợ TB.06) |
| Tiểu sử | 23 tuổi, bại cách nhưng **được Sơn Môn nhận** vì lá số cũ ghi sai giờ; khi tính lại giờ đúng thì ra bại cách. Thầy Tử Bình giữ cậu lại: «Lệ là của Sơn Môn. Bàn này là của thầy.» Cậu là bằng chứng sống cho TB.33 |
| Ngoại hình | đạo bào chàm ngắn, búi tóc trâm gỗ, mặt trẻ nghiêm, ôm sổ khách |
| Lịch | Mão quét Bàn Thầy · Thìn–Tỵ, Thân dẫn khách · Mùi học ở sảnh |
| Thoại | «Khách thứ hai mời vào. Huynh/tỷ là người giải án hôm nay à?» · «Bước ba khó nhất: vượng hay nhược. Đệ toàn sai ở đó.» · «Lá số đệ tính lại thì ra bại cách. Thầy vẫn giữ đệ.» · «Giờ sinh quan trọng lắm. Huynh nhớ quét mười hai giờ.» |
| Nhiệm vụ | «Án song luận» (giải án cùng Minh Khê, 09); chuỗi «giờ sinh đúng» (dạy quét 12 giờ) |
| Bark | BARK-NPC-thanh-08-1 «Khách tiếp theo!» · BARK-NPC-thanh-08-2 «Tàng can, tàng can…» (lẩm bẩm) |

### NPC-thanh-09 · Chấp sự Hà Cẩn — quản sổ khách Sơn Môn

| Mục | Nội dung |
|---|---|
| Vai | quản sổ «nhận / chưa nhận» của Sơn Môn; người đọc lệ cho người chơi Nghịch Thiên (0.5) bằng giọng hành chính; về sau là người đề nghị sửa lệ (Hồi IV/Vĩ thanh, tuỳ 03) |
| Tiểu sử | 42 tuổi, Ngũ Linh Căn, bại cách. Bà giữ lệ vì «lệ là lệ», dù chính lá số bà cũng sẽ bị «chưa nhận» nếu xét theo lệ. Bà vào Sơn Môn từ trước khi có lệ ấy |
| Ngoại hình | áo giao lĩnh xám, tóc búi chặt, cầm sổ bìa đỏ và bút |
| Lịch | Thìn–Thân ngồi phòng chấp sự · Dậu đóng sổ |
| Thoại | «Theo lệ, cách thành hoặc có cứu thì nhận làm đệ tử ngay. Cách của khách… chưa.» · «Tôi không viết lệ. Tôi chỉ giữ sổ.» · (A≥40) «Nếu xét theo lệ bây giờ, tôi cũng không được nhận.» · (Vĩ thanh) «Tôi đề nghị bỏ lệ. Thầy Tử Bình ký trước.» |
| Nhiệm vụ | «Sửa lệ Sơn Môn» (chuỗi cuối, cần chữ ký 3 NPC chính — SQ-thanh-?? TBD-03) |
| Bark | BARK-NPC-thanh-09-1 «Ai chưa ghi sổ thì vào ghi.» · BARK-NPC-thanh-09-2 «Lệ là lệ.» |

---

## 4. Tử Bình Phong (`tubinh`)

### NPC-tubinh-01 · Lão Kỷ — thủ thư sảnh Cách Cục

| Mục | Nội dung |
|---|---|
| Vai | giữ sách cách cục; mở án Cổ (lá số kinh điển — `cases.js` classical) cho người chơi đã đủ thiện cảm với Thầy Tử Bình |
| Tiểu sử | 60 tuổi, Ngũ Linh Căn, bại cách. Thuộc lòng «Tử Bình chân thuyên», nhưng chưa luận cho ai: «Tôi giữ sách, không giữ người.» |
| Ngoại hình | gầy gò, áo dài xám, kính lão hai lớp, tay áo lấm bụi sách |
| Lịch | Thìn–Dậu ở sảnh Cách Cục · Tuất đọc sách dưới đèn |
| Thoại | «Cách lấy từ tháng sinh. Tháng là nền nhà.» · «Án cổ này của một người sống cách đây năm trăm năm. Sách ghi đáp án. Đừng cãi sách, cứ chứng minh.» · «Sổ Cách Cục có ba trăm lá số. Tôi đọc hết rồi, chưa luận cái nào.» |
| Nhiệm vụ | «Án Cổ» mở rộng (09); «Bảy cách tháng Dần» (bài tập học cách cục) |
| Bark | BARK-NPC-tubinh-01-1 «Khẽ thôi, sảnh đọc sách.» · BARK-NPC-tubinh-01-2 «Thất Sát cách… ai mượn quyển này chưa trả?» |

### NPC-tubinh-02 · Phùng Vy — học trò luyện án

| Mục | Nội dung |
|---|---|
| Vai | bạn học ngang hàng; nạn nhân án DMH số 3 («cách bại, học vô ích») |
| Tiểu sử | 27 tuổi, **Phàm Căn 26 điểm**, bại cách. Học cổ pháp vì muốn hiểu vì sao đời mình khó. Bị Định Mệnh Hội bảo «học vô ích, mua cách giả». Sau án, cô trở thành người giải án giỏi nhất Tử Bình Phong — ví dụ sống cho hệ số Nghịch Thiên |
| Ngoại hình | tóc ngắn ngang vai, áo dài nâu nhạt, ôm chồng sách, bút chì sau tai |
| Lịch | Thìn–Ngọ học sảnh · Mùi tự luyện án · Thân gặp người chơi luyện chung |
| Thoại | «Bạn luận thử án này đi, tôi sai bước ba ba lần rồi.» · «Họ bảo cách tôi bại, học cũng vô ích.» · (sau án) «Cách bại là bệnh của cách, không phải lệnh cấm học. Tôi chép câu ấy lên tường.» · «Tôi giải xong một trăm án rồi. Điểm lá số tôi vẫn hai mươi sáu.» |
| Nhiệm vụ | án DMH số 3 (SQ-tubinh-?? TBD-03); «Một trăm án» (đồng tu — Ngũ Duy Tỷ) |
| Bark | BARK-NPC-tubinh-02-1 «Thân nhược… hay vượng nhỉ?» · BARK-NPC-tubinh-02-2 (sau nhiệm vụ) «Án thứ một trăm lẻ một!» |

---

## 5. Manh Phái Cốc (`manh`)

### NPC-manh-01 · Ông mù Đàn Tam — kể tượng Manh phái

| Mục | Nội dung |
|---|---|
| Vai | người đọc «tượng» (`mangpai-view`); dạy «làm công» (tầng Mệnh Đồ 5); kéo đàn nhị kể chuyện |
| Tiểu sử | 56 tuổi, Tam Linh Căn, bại cách. Mù từ năm mười tuổi vì sốt. Học Manh phái từ một ông thầy mù khác, theo lối truyền miệng. Ông «nhìn» lá số như nghe một bản nhạc: hành nào lên giọng, hành nào lạc phách |
| Ngoại hình | kính đen tròn, áo nâu, đàn nhị khoác vai, gậy trúc, con chó vàng dẫn đường |
| Lịch | Thìn–Ngọ ngồi gốc đa đầu cốc · Mùi nghỉ · Thân–Dậu kể chuyện · Tuất kéo đàn |
| Thoại | «Đưa tay đây. Không, tôi không xem tay. Tôi nghe giọng. Đọc to ngày sinh của anh.» · «Lá số anh như bản đàn: dây Kim căng quá, dây Thủy chùng. Làm công thì gảy dây căng, đừng gảy dây chùng.» · «Tôi mù mà đọc tượng. Anh sáng mà đọc chữ. Ai thấy nhiều hơn?» · «Con Vàng, về nào.» |
| Nhiệm vụ | «Làm công» (gợi ý nghề hợp trục mạnh Ngũ Duy — tầng Mệnh Đồ 5; SQ-manh-?? TBD-03) |
| Bark | BARK-NPC-manh-01-1 (tiếng đàn nhị) · BARK-NPC-manh-01-2 «Ai đi qua mà bước nặng thế, lo chuyện tiền à?» |

### NPC-manh-02 · Bé Na — cháu dắt đường của ông Đàn Tam

| Mục | Nội dung |
|---|---|
| Vai | dắt đường ông mù; nạn nhân án DMH số 4 («Cô Thần, phải gả bán đi») |
| Tiểu sử | 19 tuổi, Đắc Cứu, thân quá nhược. Mồ côi, ông Đàn Tam nuôi. Muốn học chữ nổi để ghi lại chuyện ông kể |
| Ngoại hình | tóc tết hai bên, áo cánh hồng nhạt đã bạc, chân đất, tay dắt gậy ông |
| Lịch | theo ông Đàn Tam |
| Thoại | «Ông ơi, có khách.» · «Họ bảo cháu có sao Cô Thần, cả đời một mình, phải gả đi cho người ta "phá".» · (sau án) «Cô Thần là thích ở một mình một lúc. Cháu thích thật. Thế thôi à?» · «Cháu muốn ghi chuyện ông kể. Chữ nổi học ở đâu ạ?» |
| Nhiệm vụ | án DMH số 4 (SQ-manh-?? TBD-03); «Chữ nổi cho Na» (Thư Lâu Lâm) |
| Bark | BARK-NPC-manh-02-1 «Ông ơi, bậc thang!» · BARK-NPC-manh-02-2 «Con Vàng, đừng chạy!» |

---

## 6. Trích Thiên Đỉnh (`trichthien`)

### NPC-trichthien-01 · Đạo sĩ coi sao Trình Lam — sảnh Tử Vi

| Mục | Nội dung |
|---|---|
| Vai | thầy sảnh Tử Vi (đã có); dạy an sao (án Tử Vi `halls.js`); kể chuyện sao trên đài quan sát |
| Tiểu sử | 47 tuổi, Tứ Linh Căn thuận, bại cách, thân quá vượng. Nửa đời lên đỉnh núi đếm sao, nửa đời xuống chợ chửi bọn «dời sao giá rẻ». Ông nói: «Sao không dời được. Người dời được.» |
| Ngoại hình | áo đạo màu đen thêu chòm sao bạc, mũ vải, ống đồng quan sát đeo hông, râu tỉa ngắn |
| Lịch | Thìn–Ngọ dạy sảnh · Mùi ngủ · Tuất–Sửu trên đài quan sát (đêm) |
| Thoại | «Mệnh cung an từ tháng sinh, giờ sinh. Đếm cùng tôi.» · «Sao không dời được. Người dời được.» · «Mấy quầy "dời sao giá rẻ" dưới chợ? Bảo họ dời giúp tôi Bắc Đẩu sang trái một tấc xem.» · «Đêm nay trời trong. Lên đài với tôi.» |
| Nhiệm vụ | «Đêm đếm sao» (sự kiện thiên văn theo lịch thật — 10); án Tử Vi nâng cao |
| Bark | BARK-NPC-trichthien-01-1 (G:Tý) «Thiên Lang mọc rồi.» · BARK-NPC-trichthien-01-2 «Ai còn thức lên đài!» |

---

## 7. Cùng Thông Hồ (`cungthong`)

### NPC-cungthong-01 · Bà lái đò Năm Thủy

| Mục | Nội dung |
|---|---|
| Vai | chở đò qua hồ; giúp nhiệm vụ Hồi I.2 «Hành thiếu» (lấy nước suối cho người thiếu Thủy) |
| Tiểu sử | 60 tuổi, Ngũ Linh Căn, bại cách, Dụng Thủy. Chèo đò bốn mươi năm. Bà không biết lá số mình Dụng Thủy, chỉ biết «ở gần nước thì khỏe» |
| Ngoại hình | nón quai thao, áo nâu, quần đen xắn, tay chai, mái chèo dài |
| Lịch | Mão–Dậu chở đò · Tuất ngồi bến hút thuốc lào (đạo cụ) |
| Thoại | «Qua hồ không? Đò đầy thì chờ chuyến sau.» · «Bà không biết lá số. Bà chỉ biết ở gần nước thì khỏe.» · «Nước suối đầu nguồn ngọt nhất. Cậu thiếu Thủy à? Lên mà lấy, bà chờ.» · «Sóng to. Ngồi giữa đò.» |
| Nhiệm vụ | Hồi I.2 «Hành thiếu» (bến xuất phát; TBD-03 MQ-1-xx) |
| Bark | BARK-NPC-cungthong-01-1 «Đò sang đây!» · BARK-NPC-cungthong-01-2 (W:gió) «Hôm nay sóng, đi chậm.» |

### NPC-cungthong-02 · Ngư phủ Tư Lưới

| Mục | Nội dung |
|---|---|
| Vai | đánh cá; nạn nhân án DMH số 5 (Ngũ Hoàng, tượng đồng trấn); điểm «thả cá ngược lại hồ» |
| Tiểu sử | 50 tuổi, Tam Linh Căn, bại cách. Đánh cá nuôi cả nhà. Bị doạ mua tượng đồng năm lượng trấn Ngũ Hoàng. Sau án, ông để dành tiền ấy mua lưới mắt to — tha cá nhỏ |
| Ngoại hình | da cháy nắng, cởi trần khoác áo tơi, quần đùi, lưới vắt vai, giỏ cá |
| Lịch | Dần–Thìn kéo lưới · Tỵ–Mùi bán cá · Thân vá lưới |
| Thoại | «Cá mới đây!» · «Thầy quầy bảo nhà tôi phạm Ngũ Hoàng, phải mua tượng đồng.» · (sau án) «Năm lượng ấy tôi mua lưới mắt to. Cá con lọt ra, năm sau lại có cá.» · «Thả lại con này đi, nó còn bé.» |
| Nhiệm vụ | án DMH số 5 (SQ-cungthong-?? TBD-03); «Lưới mắt to» (việc thiện bảo vệ cá con — DEED TBD-05) |
| Bark | BARK-NPC-cungthong-02-1 «Cá rô, cá diếc đây!» · BARK-NPC-cungthong-02-2 «Lưới rách rồi.» |

---

## 8. Thư Lâu Lâm (`thulau`)

### NPC-thulau-01 · Thủ kho sách Ôn Như

| Mục | Nội dung |
|---|---|
| Vai | giữ kho Thư Lâu (`daozang-data`, `library-data`); án DMH số 8 (sách chép tay giá mười lượng một trang) |
| Tiểu sử | 30 tuổi, Tứ Linh Căn thuận, bại cách. Thuộc mục lục 1.523 quyển. Ghét nhất người xé sách và người bán sách miễn phí với giá đắt |
| Ngoại hình | áo dài xanh rêu, tóc búi lệch, kính, ống tay áo đính mảnh vải chống bụi |
| Lịch | Thìn–Dậu ở kho · Tuất phơi sách (ngày nắng) |
| Thoại | «Tìm gì? Nói tên việc, không cần tên sách.» · «Kệ thứ ba, ngăn dưới. Rửa tay trước khi cầm.» · «Sách ở đây đọc miễn phí. Ai bán mười lượng một trang là lừa.» · «Sách là người chết nói với người sống. Đừng xé.» |
| Nhiệm vụ | án DMH số 8 (SQ-thulau-?? TBD-03); «Phơi sách mùa nồm» (DQ) |
| Bark | BARK-NPC-thulau-01-1 «Khẽ thôi!» · BARK-NPC-thulau-01-2 (W:nắng) «Phơi sách! Ai rảnh giúp một tay.» |

---

## 9. Phong Thủy Viên (`phongthuy`)

### NPC-phongthuy-01 · Thợ cả Đoàn Mộc

| Mục | Nội dung |
|---|---|
| Vai | sửa nhà của người chơi ở Huyền Thành (tầng Mệnh Đồ «Không gian»); gương ngược của Công Thâu Nghiệt |
| Tiểu sử | 49 tuổi, **Song Linh Căn thượng 75 điểm**, Thuận Thiên. Học nghề cùng thầy với Công Thâu Nghiệt khi còn trẻ. Lá số đẹp, Sơn Môn nhận, nhưng ông từ chối: «Tôi thích đục gỗ hơn đọc sách.» Biết bí mật về kèo Thiên Mệnh Bàn (đề xuất 02/03) |
| Ngoại hình | vai u thịt bắp, áo nâu xắn tay, thước Lỗ Ban (vạch hư cấu) giắt lưng, bút chì thợ sau tai |
| Lịch | Mão–Thân làm ở công trường người chơi đặt · Dậu về xưởng · Tuất uống rượu với thợ phụ |
| Thoại | «Nhà này cửa quay hướng nào? Để tôi đo.» · «Phong thủy đúng nhất là cái cửa không kêu và cái mái không dột.» · «Thầy tôi dạy hai đứa. Tôi học đục gỗ. Thằng kia học giấu bùa vào gỗ.» · «Đừng bao giờ để thợ nào làm việc trong nhà mà không cho mình xem kèo.» |
| Nhiệm vụ | «Nhà của mình» (sửa hướng, phòng ngủ — Mệnh Đồ tầng 1; SQ-phongthuy-?? TBD-03); «Người học cùng thầy» (gợi ý danh tính Lỗ Ban) |
| Bark | BARK-NPC-phongthuy-01-1 (tiếng đục gỗ) · BARK-NPC-phongthuy-01-2 «Mộng này khít. Đẹp.» |

### NPC-phongthuy-02 · «Phong thủy sư» Triệu Sát (Định Mệnh Hội)

| Mục | Nội dung |
|---|---|
| Vai | mạo danh đệ tử Thiên Sư, bán phù trấn trạch trăm lượng (06-05 TTS.18); án DMH số 6 |
| Tiểu sử | 42 tuổi, **Thiên Linh Căn 86 điểm**, Đắc Cứu. Lá số cực phẩm. Từ nhỏ được khen «sinh ra để giàu sang», hắn tin mình không cần học, chỉ cần lấy. Bài học T2 ngược: lá số đẹp không làm nên người |
| Ngoại hình | áo đạo bào vàng loè loẹt (sai màu, sai kiểu — thiết kế để người chơi tinh mắt nhận ra), mũ cao, kiếm gỗ sơn đỏ, túi đầy phù in sẵn |
| Lịch | Thìn–Thân bày quầy ở cổng Phong Thủy Viên · Dậu đi «khám nhà» cho khách giàu |
| Thoại | «Bùa đệ tử Thiên Sư, chính tông Long Hổ!» · «Nhà ông phạm sát nặng. Phù này trấn trăm năm.» · (bị vạch) «Lá số ta tám mươi sáu điểm, ngươi biết gì mà nói!» · (Hồi IV, tuỳ 03) «Tám mươi sáu điểm… mà ta chưa làm được việc gì tử tế.» |
| Nhiệm vụ | án DMH số 6 (SQ-phongthuy-?? TBD-03) |
| Bark | BARK-dinh_menh_hoi-08 · BARK-NPC-phongthuy-02-1 «Lá số ta tám mươi sáu điểm!» |

---

## 10. Lịch Đường (`lichduong`)

### NPC-lichduong-01 · Bà mối Hồng Đào

| Mục | Nội dung |
|---|---|
| Vai | làm mối, chọn ngày cưới; án DMH số 7 («ngày Sát Chủ, cô dâu chết trong năm») |
| Tiểu sử | 58 tuổi, Tam Linh Căn, bại cách. Làm mối ba trăm đám, nhớ ngày cưới từng đám. Từng tin lời thầy quầy và hoãn một đám cưới hai năm; đôi ấy chia tay. Bà ân hận, và nhờ người chơi giúp đám tiếp theo |
| Ngoại hình | áo dài đỏ mận, khăn vấn, trầu cau trong túi gấm, quạt nan |
| Lịch | Thìn–Ngọ ở Lịch Đường · Mùi đi «xem mặt» · Thân–Dậu ngồi hàng nước |
| Thoại | «Cưới ngày nào thì đẹp? Đưa bà ngày sinh hai đứa.» · «Thầy quầy bảo ngày ấy cô dâu chết trong năm. Bà sợ quá hoãn hai năm. Hai đứa bỏ nhau.» · (sau án) «Ngày lành là ngày hai đứa còn thương nhau.» · «Ba trăm đám. Đám nào bà cũng nhớ.» |
| Nhiệm vụ | án DMH số 7 (SQ-lichduong-?? TBD-03); «Đám cưới thứ ba trăm lẻ một» (chọn ngày bằng `find_good_days` qua Thầy Tử Bình) |
| Bark | BARK-NPC-lichduong-01-1 «Ai chọn ngày cưới thì lại đây!» · BARK-NPC-lichduong-01-2 «Ăn miếng trầu cho ấm miệng.» |

### NPC-lichduong-02 · Cậu học lịch Tống Tiết

| Mục | Nội dung |
|---|---|
| Vai | học trò sảnh Trạch Nhật; giải thích 24 tiết khí; người chơi dạy lại cậu (đảo vai) |
| Tiểu sử | 21 tuổi, Song Linh Căn 69, Đắc Cứu. Thông minh, kiêu. Tin mình «lá số đẹp, chẳng cần cố». Thử thách đạo đức nhỏ: cậu muốn bán lá số đẹp của mình cho một khách giàu để «ghép danh tính» (đúng thử thách Thuận Thiên của bản sơ đồ, Hồi I) |
| Ngoại hình | áo dài lam mới, búi tóc gọn, quạt giấy đề chữ, cầm cuốn lịch vạn niên |
| Lịch | Thìn–Ngọ học · Mùi–Thân ở hiên Lịch Đường · Tuất đi chơi |
| Thoại | «Hôm nay tiết gì? Ngươi không biết à? Tiết {jieqi}.» · «Lá số ta sáu mươi chín điểm. Chẳng cần cố.» · «Có ông khách giàu muốn mua lá số của ta để làm giấy tờ. Trả hậu lắm.» · (sau thử thách) «Ta không bán. Lá số là ta. Bán đi thì ta là ai?» |
| Nhiệm vụ | «Lá số không bán» (thử thách Thuận Thiên — BR-TT TBD-03, dùng được cho mọi người chơi) |
| Bark | BARK-NPC-lichduong-02-1 «Lập đông rồi!» · BARK-NPC-lichduong-02-2 «Hỏi gì về tiết khí cứ hỏi ta.» |

---

## 11. Long Hổ Sơn (`longho`)

### NPC-longho-01 · Đạo đồng Thanh Phù

| Mục | Nội dung |
|---|---|
| Vai | mài chu sa, giấy phù; bạn tập kết phù với người chơi (mini-game 09) |
| Tiểu sử | 21 tuổi, Ngũ Linh Căn, bại cách. Vào phủ năm 12 tuổi. Viết nét đầu tiên run suốt ba năm. Trương Thiên Sư bảo «run là thật lòng», nên cậu không xấu hổ nữa |
| Ngoại hình | đạo bào lam ngắn, búi tóc nhỏ, tay đỏ chu sa, ống tay áo buộc dây |
| Lịch | Mão tảo khóa · Thìn–Tỵ mài chu sa · Mùi tưới lan · Dậu vãn khóa |
| Thoại | «Chu sa phải mài thuận một chiều.» · «Nét đầu của đệ run ba năm.» · «Phù ở đây viết bằng chữ của Huyền Giới. Đệ không biết chữ ngoài kia.» · «Huynh viết thử đi, run cũng được.» |
| Nhiệm vụ | «Kết phù đầu tiên» (mini-game); việc thiện «giúp đạo đồng» |
| Bark | BARK-NPC-longho-01-1 (tiếng mài đá) · BARK-NPC-longho-01-2 «Thiên Sư bảo run là thật lòng!» |

### NPC-longho-02 · Bà Mười Nhang — khách hành hương

| Mục | Nội dung |
|---|---|
| Vai | khách hành hương Long Hổ; nạn nhân nhỏ của nạn «bán nhang chân núi giá cao» |
| Tiểu sử | 67 tuổi, Ngũ Linh Căn, bại cách. Mỗi tháng lên núi lễ cho con trai đi phu xa. Mua nhang chân núi giá gấp mười vì nghe «nhang trên phủ không linh». Trương Thiên Sư cho nhang miễn phí, bà vẫn mua vì sợ |
| Ngoại hình | áo nâu, khăn mỏ quạ, giỏ lễ, gậy tre, đi chậm từng bậc |
| Lịch | ngày rằm, mùng một: Mão leo núi · Thìn–Tỵ lễ · Ngọ xuống |
| Thoại | «Cháu ơi, đỡ bà bậc này.» · «Nhang chân núi người ta bảo linh hơn.» · (sau khi người chơi đưa bà gặp Thiên Sư) «Ông Thiên Sư bảo nhang nào cũng thơm như nhau. Bà tin ông ấy.» · «Thằng con bà đi phu ba năm chưa về.» |
| Nhiệm vụ | «Đưa bà lên phủ» (việc thiện kính lão — DEED TBD-05); «Thư cho con trai bà Mười» (MMO: thư gửi qua bưu trạm — 10) |
| Bark | BARK-NPC-longho-02-1 «Còn bao nhiêu bậc nữa cháu?» · BARK-NPC-longho-02-2 «Nam mô… à, đây là phủ Đạo. Thôi thì lạy cả.» |

---

## 12. Võ Đang (`vodang`)

### NPC-vodang-01 · Đạo cô Tĩnh Hư — dạy Thái Cực cho người già

| Mục | Nội dung |
|---|---|
| Vai | học trò của Huyền Hư; dạy Thái Cực bản dễ cho NPC già; con gái Bà Tư thợ may (06-11 B2) — **nếu** 03 đồng ý; nếu không, con gái Bà Tư là đạo cô ở Chung Nam như 06-11 viết. Đề xuất: Tĩnh Hư đã chuyển từ Chung Nam sang Võ Đang |
| Tiểu sử | 34 tuổi, Đắc Cứu, thân quá nhược. Từng du phương với Toàn Chân. Mẹ hay gửi áo bông |
| Ngoại hình | đạo bào lam, tóc búi trâm gỗ, giày vải, áo bông vá hai miếng (mẹ may) |
| Lịch | Mão tập cùng Huyền Hư · Thìn–Tỵ dạy các cụ · Thân đọc kinh |
| Thoại | «Các cụ đứng thẳng, thả vai. Chậm thôi.» · «Thái Cực cho người già là để không ngã.» · «Mẹ tôi lại gửi áo bông. Tôi có ba cái rồi.» · «Anh từ Sơn Môn lên à? Có ghé quầy mẹ tôi không?» |
| Nhiệm vụ | nhận áo bông (kết nhiệm vụ của Bà Tư); «Thái Cực cho cụ già» (việc thiện) |
| Bark | BARK-NPC-vodang-01-1 «Một, hai… thả vai!» · BARK-NPC-vodang-01-2 «Cụ ơi, đừng vội.» |

### NPC-vodang-02 · Phu khuân thần đạo Lực Đá

| Mục | Nội dung |
|---|---|
| Vai | gánh đá sửa bậc thần đạo Võ Đang; sự kiện máy chủ «sửa cầu đường» (canon §5.3 tu kiều bổ lộ) |
| Tiểu sử | 31 tuổi, bại cách, thân quá vượng. Khoẻ, nóng tính, từng đánh nhau. Huyền Hư dạy anh gánh đá như tập Thái Cực |
| Ngoại hình | cao to, cởi trần, khăn quấn đầu, đòn gánh và hai sọt đá |
| Lịch | Mão–Thân gánh đá · Dậu tắm suối · Tuất ăn cơm với Đan Đỉnh |
| Thoại | «Tránh ra, đá nặng!» · «Trước tôi đánh người. Giờ tôi gánh đá cho người ta đi.» · «Ông Huyền Hư bảo gánh chậm thì vai không đau. Đúng thật.» · «Góp một hòn đá không? Bậc thứ ba trăm còn thiếu.» |
| Nhiệm vụ | «Một hòn đá cho thần đạo» (sự kiện máy chủ — EV-* TBD-10; DEED tu kiều bổ lộ TBD-05) |
| Bark | BARK-NPC-vodang-02-1 «Hây dô!» · BARK-NPC-vodang-02-2 «Bậc này xong rồi!» |

---

## 13. Chung Nam (`chungnam`)

### NPC-chungnam-01 · Đạo sĩ vân du Mặc Tử Vân

| Mục | Nội dung |
|---|---|
| Vai | đạo sĩ du phương trẻ ở vân thủy đường; bạn đồng hành chuỗi vân thủy (06-08 KD.10) |
| Tiểu sử | 25 tuổi, bại cách, thân trung hòa. Đi bộ từ Côn Lôn xuống. Giày rách, lạc quan, nói nhiều. Đang học «biết đủ» |
| Ngoại hình | đạo bào lam bạc màu, nón lá, gậy du phương, túi vải mỏng, giày rách mũi |
| Lịch | trú vân thủy đường 3 ngày rồi đi (vị trí thay đổi theo tuần) |
| Thoại | «Đi bộ ba tháng, đây là đôi giày thứ hai.» · «Đạo trưởng bảo biết đủ thì không nhục. Ta đang tập biết đủ giày.» · «Đi cùng ta xuống núi không? Làm việc đổi cơm, vui lắm.» · «Ta không có gì cho người. Chỉ có chuyện.» |
| Nhiệm vụ | «Vân thủy ba ngày» (05/09); «Đôi giày cho Tử Vân» (việc thiện bố thí) |
| Bark | BARK-NPC-chungnam-01-1 «Giày lại rách!» · BARK-NPC-chungnam-01-2 «Mây đi đâu ta đi đó.» |

### NPC-chungnam-02 · Bà Phúc Chay — trai đường

| Mục | Nội dung |
|---|---|
| Vai | nấu cơm chay trai đường Chung Nam; mở việc «ăn chay một ngày» (`CONG_QUA`: Ăn chay 1 ngày +1) |
| Tiểu sử | 58 tuổi, Đắc Cứu, thân quá vượng. Nấu chay ba mươi năm. Không tu, «chỉ nấu cho người tu». Hay bị đạo trưởng chê mặn |
| Ngoại hình | tạp dề trắng, áo nâu, khăn trùm tóc, muôi gỗ to |
| Lịch | Dần nấu cháo · Tỵ–Ngọ nấu cơm trưa · Thân rửa nồi · Dậu nấu cơm chiều |
| Thoại | «Đói không? Ngồi xuống, chay mà ngon.» · «Đạo trưởng chê mặn. Lão ấy ăn nhạt như Vân Cốc.» · «Ăn chay một ngày là cho cái bụng nghỉ, cái lòng cũng nghỉ.» · «Rửa bát giúp tôi thì ăn thêm bát chè.» |
| Nhiệm vụ | «Một ngày chay» (DQ); «Rửa nồi trai đường» (việc nhỏ) |
| Bark | BARK-NPC-chungnam-02-1 «Cơm chín rồi!» · BARK-NPC-chungnam-02-2 «Ai lấy muối của tôi?» |

---

## 14. Mao Sơn (`maoshan`)

### NPC-maoshan-01 · Cô Thu Liên — người bị doạ «vong theo»

| Mục | Nội dung |
|---|---|
| Vai | nạn nhân án DMH số 9; trường hợp mẫu của «chẩn đoán đời thực» (06-08 C) |
| Tiểu sử | 36 tuổi, Ngũ Linh Căn, bại cách, thân quá nhược. Mẹ mất năm ngoái. Từ đó mất ngủ, nghe tiếng gọi lúc nửa đêm. Hắc Phù Lão bảo «vong mẹ theo, cúng ba tháng». Ông Mao hỏi chuyện ngủ, rồi ngồi với cô suốt một đêm. Cô khóc, rồi ngủ được |
| Ngoại hình | gầy, quầng mắt thâm, áo nâu, khăn tang trắng buộc tóc, ôm một chiếc áo cũ của mẹ |
| Lịch | Thìn tới phòng khám ông Mao · Mùi ngồi đầu làng · Tuất về nhà |
| Thoại | «Đêm nào tôi cũng nghe mẹ gọi.» · «Ông thầy ở chợ bảo phải cúng ba tháng.» · (sau án) «Ông Mao bảo đó là nhớ, không phải ma. Tôi ngủ được rồi.» · «Tôi giữ áo mẹ. Mỗi tối gấp lại một lần.» |
| Nhiệm vụ | án DMH số 9 (SQ-maoshan-?? TBD-03). **Ràng buộc:** cảnh này phải được đội viết duyệt nhạy cảm (tang thương); có nút «bỏ qua cảnh» |
| Bark | BARK-NPC-maoshan-01-1 (ngồi gấp áo, im lặng) · BARK-NPC-maoshan-01-2 (sau án) «Đêm qua tôi ngủ thẳng tới sáng.» |

### NPC-maoshan-02 · Hắc Phù Lão (Định Mệnh Hội)

| Mục | Nội dung |
|---|---|
| Vai | «thầy trừ tà» giả ở chân Mao Sơn; án DMH số 9 |
| Tiểu sử | 57 tuổi, **Phàm Căn 23 điểm**, bại cách. Lá số thấp nhất trong các thành viên Hội. Kể khổ «số tôi khổ nên tôi phải sống bằng cái khổ của người khác». Hắn là gương cho câu hỏi T2: lá số thấp không bắt ai đi lừa |
| Ngoại hình | áo đen bạc, râu dài bẩn, cổ đeo chuỗi hạt nhựa, túi đầy bùa in, đèn lồng giấy đỏ |
| Lịch | Thìn–Thân ngồi đầu làng Mao Sơn · Dậu đi «trừ tà» tận nhà |
| Thoại | «Cô bị vong theo, nặng lắm. Cúng ba tháng mới khỏi.» · «Số tôi khổ, nên tôi phải sống bằng cái khổ của người khác.» · (bị vạch) «Thằng Mao lại phá đám!» · (nhánh tuỳ 03) «Hai mươi ba điểm… người ta cũng hai mươi mấy điểm mà mở phòng khám.» |
| Nhiệm vụ | án DMH số 9 |
| Bark | BARK-dinh_menh_hoi-12 · BARK-NPC-maoshan-02-1 «Ai bị ám thì lại đây!» |

---

## 15. Yên Tử (`yentu`)

### NPC-yentu-01 · Chú tiểu Tâm Nhiên

| Mục | Nội dung |
|---|---|
| Vai | chú tiểu quét lá cùng thiền sư Pháp Không; bạn cho người chơi trên đường leo |
| Tiểu sử | 18 tuổi, Tam Linh Căn, **Thuận Thiên**, thân vượng. Vào chùa từ bé. Lá số đẹp nhất chùa; thiền sư không bao giờ nhắc tới. Chú hay hỏi «lá số con đẹp thì sao ạ?» và nhận câu trả lời «Quét lá.» |
| Ngoại hình | đầu cạo, áo nâu ngắn, dép tổ ong (đạo cụ hư cấu kiểu cũ), chổi tre to hơn người |
| Lịch | Mão quét lá cùng thầy · Thìn–Tỵ đón khách hành hương · Mùi học kinh |
| Thoại | «A Di Đà Phật. Còn ba nghìn bậc nữa ạ.» · «Thầy con không nói nhiều. Con quen rồi.» · «Lá số con đẹp lắm, người ta bảo. Thầy bảo: quét lá.» · «Uống nước suối Giải Oan đi, ngọt lắm.» |
| Nhiệm vụ | «Quét lá cùng chú tiểu» (DQ); dẫn đường lên Chùa Đồng |
| Bark | BARK-NPC-yentu-01-1 (tiếng chổi) · BARK-NPC-yentu-01-2 «Bậc này trơn, đi bên phải ạ!» |

### NPC-yentu-02 · Ông Bảy Gậy — người hành hương già

| Mục | Nội dung |
|---|---|
| Vai | khách hành hương leo Yên Tử năm thứ mười; việc thiện «đỡ người già» |
| Tiểu sử | 70 tuổi, Đắc Cứu, thân quá vượng. Hứa với vợ đã mất sẽ lên Chùa Đồng mười năm liền. Năm nay năm thứ mười, gối yếu |
| Ngoại hình | áo nâu, khăn đóng, gậy song bóng mòn, túi lễ, đi từng bậc |
| Lịch | mùa lễ hội Yên Tử (tháng Giêng — EV-* TBD-10): Mão–Mùi leo |
| Thoại | «Năm thứ mười. Năm cuối.» · «Bà nhà tôi muốn lên mà không kịp. Tôi lên thay.» · «Cháu đi trước đi, ông chậm.» · (trên đỉnh) «Đến rồi, bà ơi.» |
| Nhiệm vụ | «Năm thứ mười» (đưa ông lên đỉnh — kính lão; SQ-yentu-?? TBD-03) |
| Bark | BARK-NPC-yentu-02-1 «Thêm một bậc.» · BARK-NPC-yentu-02-2 (nghỉ) «Gió ở đây mát như hồi bà còn.» |

---

## 16. Bút Tháp (`buttap`)

### NPC-buttap-01 · Bà Ba Từ — Phật tử già

| Mục | Nội dung |
|---|---|
| Vai | bạn tụng kinh của Diệu Âm; nạn nhân án DMH số 11 (phóng sinh nghìn con đặt trước) |
| Tiểu sử | 65 tuổi, Ngũ Linh Căn, bại cách. Hiền, tin người. Bị bảo nghiệp sát nặng (vì chồng từng làm đồ tể), phải phóng sinh nghìn con chim đặt trước |
| Ngoại hình | áo lam, tràng hạt, giỏ hoa, khăn vấn, đi dép cói |
| Lịch | Dần công phu · Mão ra hồ sen · Thân ngồi «bàn trả lời» ngày rằm cùng Diệu Âm |
| Thoại | «Nam mô A Di Đà Phật. Con lên chùa sớm thế.» · «Ông nhà tôi làm nghề mổ lợn. Người ta bảo nghiệp nặng, phải thả nghìn con chim.» · (sau án) «Ni sư bảo đặt trước là thuê người bắt. Tôi suýt làm điều ác mà tưởng là thiện.» · «Thôi, tôi thả con cá này thôi.» |
| Nhiệm vụ | án DMH số 11 (SQ-buttap-?? TBD-03) |
| Bark | BARK-NPC-buttap-01-1 «Nam mô A Di Đà Phật.» · BARK-NPC-buttap-01-2 «Sen nở rồi kìa.» |

### NPC-buttap-02 · Anh Khải — người sám hối

| Mục | Nội dung |
|---|---|
| Vai | cựu cò mồi Định Mệnh Hội đang sám hối; ví dụ sống của chuỗi sám hối «kèm hành động» (06-06 DA.36) |
| Tiểu sử | 34 tuổi, Tứ Linh Căn thuận, bại cách, Dụng Thổ. Từng dẫn khách tới quầy đổi mệnh lấy hoa hồng. Một khách tự tử hụt vì sợ lời phán. Anh bỏ hội, lên chùa, gánh nước, đi trả lại tiền từng nhà. **Chi tiết «tự tử hụt»** chỉ nhắc gián tiếp («một khách suýt không qua khỏi»), không mô tả cách |
| Ngoại hình | áo nâu cũ, đầu húi cua, vai đỏ vì gánh nước, sổ tay ghi tên các nhà đã trả |
| Lịch | Mão–Tỵ gánh nước · Mùi–Dậu đi trả tiền (vắng mặt ở chùa) · Tuất về chùa |
| Thoại | «Tôi từng dẫn khách tới quầy. Giờ tôi đi trả lại.» · «Còn mười bảy nhà.» · «Một khách suýt không qua khỏi vì sợ lời phán. Từ hôm ấy tôi không ngủ được, cho tới khi lên đây.» · «Sám hối không phải lạy. Là đi trả.» |
| Nhiệm vụ | «Mười bảy nhà» (đi cùng anh trả tiền — mẫu chuỗi trả nghiệp cho người chơi Tà Lộ; SQ-buttap-?? TBD-03) |
| Bark | BARK-NPC-buttap-02-1 «Còn mười bảy.» (con số giảm theo tiến độ) · BARK-NPC-buttap-02-2 (tiếng đòn gánh kẽo kẹt) |

---

## 17. Tạng Địa (`tangdia`)

### NPC-tangdia-01 · Người dẫn đường tuyết Đa Ba

> **Chờ tham vấn** cùng `lama_dakiet`. Tên, trang phục là bản nháp.

| Mục | Nội dung |
|---|---|
| Vai | dẫn người chơi qua đèo tuyết; cảnh báo thời tiết; không có nội dung tôn giáo |
| Tiểu sử | 34 tuổi, Tam Linh Căn, bại cách. Sinh ở chân đèo, dắt đàn la chở hàng. Biết mọi khúc đèo |
| Ngoại hình | áo khoác lông dày, mũ lông, khăn quàng, găng tay, dây thừng vắt vai |
| Lịch | Mão–Thân dẫn đèo (trời quang) · ngày bão tuyết: ở trạm nghỉ |
| Thoại | «Đèo hôm nay đi được. Mai thì không.» · «Đi sau la. La biết chỗ nào băng mỏng.» · «Trà bơ ở trạm nghỉ. Uống đi, lạnh.» · «Lên tu viện thì chào Lạt-ma. Ông ấy hiền.» |
| Nhiệm vụ | «Qua đèo» (dẫn đường tới Tạng Địa; TBD-03) |
| Bark | BARK-NPC-tangdia-01-1 «Bão tới, vào trạm!» · BARK-NPC-tangdia-01-2 «Đi nào, la ơi.» |

---

## 18. Văn Miếu (`vanmieu`)

### NPC-vanmieu-01 · Sĩ tử Lương Văn Khoa

| Mục | Nội dung |
|---|---|
| Vai | học trò thi trượt bốn lần; nạn nhân án DMH số 10 (bùa Văn Xương) |
| Tiểu sử | 30 tuổi, Tứ Linh Căn, bại cách, thân quá vượng, Dụng Mộc. Học giỏi, nhưng run trong phòng thi. Mua bùa Văn Xương bảo đảm đỗ. Tế tửu bảo «cậu ấy chỉ sợ» |
| Ngoại hình | áo dài xanh cũ, khăn đóng, tay ôm sách, đeo túi bùa đỏ (sau án bỏ) |
| Lịch | Thìn học · Mùi đi dọc hàng bia (hay định xoa đầu rùa) · Thân thi thử |
| Thoại | «Tôi trượt bốn lần. Lần này có bùa Văn Xương rồi.» · «Run quá, tay không cầm được bút.» · (sau án) «Năm thuận thi của tôi là năm Ấn tới. Tôi học kỹ năm ấy.» · «Thầy Tế tửu bảo tôi chỉ sợ. Sợ thì học được cách bớt sợ.» |
| Nhiệm vụ | án DMH số 10 (SQ-vanmieu-?? TBD-03); «Ngồi thi cùng Khoa» (khoa cử 09 — người chơi ngồi bàn bên, thở cùng: kỹ thuật thở của Huyền Hư) |
| Bark | BARK-NPC-vanmieu-01-1 «Học, học, học…» · BARK-NPC-vanmieu-01-2 (gần rùa đá, rụt tay lại) «Thôi, không xoa.» |

### NPC-vanmieu-02 · Cô giáo làng Bùi Thục

| Mục | Nội dung |
|---|---|
| Vai | dạy chữ cho trẻ nghèo ở Văn Miếu; mở việc thiện «khuyên học» |
| Tiểu sử | 32 tuổi, Tứ Linh Căn thuận, bại cách. Thi đỗ tú tài, không ra làm quan, về dạy trẻ. Học trò cũ của Tế tửu |
| Ngoại hình | áo dài nâu, tóc búi, bảng đen nhỏ, phấn trắng dính tay áo |
| Lịch | Thìn–Ngọ dạy trẻ · Mùi chấm bài · Thân đưa trẻ về |
| Thoại | «Các em, đọc theo cô: nhân, nghĩa, lễ, trí, tín.» · «Anh dạy giúp tôi một buổi được không? Chữ gì cũng được.» · «Đứa nào lá số xấu cũng học được chữ. Tôi chưa thấy chữ nào chọn người.» · «Cu Tí ở Huyền Thành giờ viết được tên rồi đấy.» |
| Nhiệm vụ | «Một buổi dạy chữ» (DQ — việc thiện khuyên học, TBD-05); nối nhiệm vụ Cu Tí |
| Bark | BARK-NPC-vanmieu-02-1 «Các em, ngồi ngay ngắn!» · BARK-NPC-vanmieu-02-2 «Chữ này viết nét nào trước?» |

---

## 19. Phong Đô (`phongdo`)

### NPC-phongdo-01 · Ông lái đò âm Lão Sa

| Mục | Nội dung |
|---|---|
| Vai | chở đò qua sông Vong Xuyên; người kể luật Phong Đô cho người mới |
| Tiểu sử | 66 tuổi, Tam Linh Căn, bại cách. Trong truyện, ông là người sống làm nghề chở đò ở Phong Đô, «đưa người ta xuống để nhìn lại mình, rồi đưa lên». Không phải hồn ma — thiết kế có chủ ý để Phong Đô bớt rùng rợn |
| Ngoại hình | áo tơi lá, nón rộng vành, râu bạc, đèn lồng ở mũi thuyền, mái chèo đen |
| Lịch | mọi giờ chở đò; giờ Ngọ nghỉ, ăn cơm nắm |
| Thoại | «Xuống à? Ngồi giữa thuyền.» · «Ở đây ai cũng xuống để nhìn lại mình rồi lên. Ông chở hai chiều.» · «Sông này không làm ai quên. Người ta tự quên vì đau quá.» · «Lên chưa? Chưa thì ông chờ.» |
| Nhiệm vụ | «Qua sông» (lối vào Phong Đô; TBD-03) |
| Bark | BARK-NPC-phongdo-01-1 «Đò sang!» · BARK-NPC-phongdo-01-2 «Chở hai chiều. Nhớ đấy.» |

### NPC-phongdo-02 · «Kẻ Đếm Nợ» Tạ Hối — người Tà Lộ đang hồi đầu

| Mục | Nội dung |
|---|---|
| Vai | NPC đi trước người chơi một bước trên Tà Lộ: đã nhận Âm Bài, giờ đang trả nghiệp; gương sống cho người chơi Tà Lộ |
| Tiểu sử | 42 tuổi, **Phàm Căn 25**, bại cách, thân nhược. Nhận Âm Bài của Lỗ Ban để qua năm hạn. Qua được, nhưng ba nhà hàng xóm gặp nạn. Xuống Phong Đô, đọc sổ, giờ đang đi trả từng nhà. Phán quan gọi anh «Tạ Hối» (tạ lỗi, hối hận) |
| Ngoại hình | áo xám rách, tay cầm sổ nợ tự ghi, đeo một tấm Âm Bài đã gãy đôi trên cổ (để nhớ) |
| Lịch | ở Phong Đô (giờ Tý–Dần) · dương gian các vùng (Thìn–Thân, đi trả nghiệp) |
| Thoại | «Anh cũng đeo cái ấy à. Tôi đeo ba năm.» · «Qua được năm hạn. Ba nhà hàng xóm thì không.» · «Còn một nhà. Nhà ấy chưa mở cửa cho tôi.» · (HD người chơi) «Anh lên trước tôi rồi. Tốt.» |
| Nhiệm vụ | «Nhà cuối cùng của Tạ Hối» (người chơi giúp anh thuyết phục nhà cuối mở cửa — chỉ mở khi người chơi đã tự Hồi Đầu; SQ-phongdo-?? TBD-03) |
| Bark | BARK-NPC-phongdo-02-1 «Còn một nhà.» · BARK-NPC-phongdo-02-2 (lần giở sổ, gạch một dòng) |

---

## 20. Miêu Cương (`mieucuong`)

### NPC-mieucuong-01 · A Lê — thiếu nữ thợ bạc

| Mục | Nội dung |
|---|---|
| Vai | thợ bạc trẻ; nạn nhân án DMH số 12 (định kiến «người Miêu bỏ bùa»); chuỗi VY.13 |
| Tiểu sử | 22 tuổi, Tam Linh Căn, Đắc Cứu, thân nhược. Làm bạc ngày đêm nuôi em. Bị người chợ dưới xuôi đồn «mang bùa», không ai dám mua hàng, không ai dám hỏi cưới. Người chơi giúp cô bán hàng ở chợ Huyền Thành và phản bác định kiến |
| Ngoại hình | **tham vấn văn hoá trước khi dựng**: áo chàm thêu viền (hoa văn hư cấu), vòng bạc nhỏ, tay đen bạc vì làm nghề, mắt sáng |
| Lịch | Mão–Thân làm bạc ở hiên nhà · Dậu nấu cơm cho em · phiên chợ (can Canh): xuống chợ Huyền Thành bán hàng (sau nhiệm vụ) |
| Thoại | «Vòng này tôi làm ba ngày.» · «Người dưới xuôi bảo tôi mang bùa. Tôi chỉ mang bạc.» · «Bà A Mậu bảo tôi ăn cơm đã rồi hẵng làm.» · (sau án) «Hôm nay bán được năm chiếc. Có chị còn hẹn đặt thêm.» |
| Nhiệm vụ | án DMH số 12 (SQ-mieucuong-?? TBD-03); «Phiên chợ của A Lê» (Thương đạo) |
| Bark | BARK-NPC-mieucuong-01-1 (tiếng búa gõ bạc lách cách) · BARK-NPC-mieucuong-01-2 «Em ơi, về ăn cơm!» |

### NPC-mieucuong-02 · Trưởng trại Cổ Sơn

| Mục | Nội dung |
|---|---|
| Vai | trưởng trại; người quyết định dỡ cây cầu mái ngói do Lỗ Ban dựng (Hồi IV/Vĩ thanh, tuỳ 03) |
| Tiểu sử | 59 tuổi, Tứ Linh Căn thuận, bại cách, thân quá vượng. Cứng rắn, tự trọng. Không cho người dưới xuôi vào trại sau tin đồn bùa ngải; người chơi phải được bà A Mậu bảo lãnh |
| Ngoại hình | **tham vấn văn hoá trước khi dựng**: áo chàm dài, khăn quấn đầu, tẩu thuốc (đạo cụ), dáng to khỏe |
| Lịch | Thìn họp trại · Tỵ–Thân đi rẫy · Tuất ngồi bếp bà A Mậu |
| Thoại | «Người dưới xuôi lên làm gì? Bà A Mậu bảo lãnh à. Thì vào.» · «Cái cầu kia đẹp. Mỗi lần đi qua tôi lại nhớ ai dựng nó.» · «Trại này bị yểm nhiều nhất vùng. Thế mà người ta bảo chúng tôi đi yểm.» · (Vĩ thanh) «Dỡ cầu. Làm lại bằng tay mình.» |
| Nhiệm vụ | «Cây cầu mới» (sự kiện máy chủ dựng lại cầu — EV-* TBD-10; tu kiều bổ lộ TBD-05) |
| Bark | BARK-NPC-mieucuong-02-1 «Ai lên trại thì chào trước.» · BARK-NPC-mieucuong-02-2 (nhìn cây cầu, nhíu mày) |

---

## 21. Am Vân Cốc (`vancoc`)

### NPC-vancoc-01 · Sa di Tịnh Thủy — người gánh nước cho am

| Mục | Nội dung |
|---|---|
| Vai | sa di nhỏ duy nhất ở am; bạn gánh nước của người chơi giờ Mão; người kể lại cho người chơi những gì Vân Cốc «không nói» |
| Tiểu sử | 18 tuổi, bại cách, thân quá nhược, Dụng Kim. Được Vân Cốc nhặt về từ chợ năm 8 tuổi, khi một thầy quầy bảo cha mẹ cậu «đứa này khắc cha, bỏ đi thì nhà mới yên». Cậu không biết lá số mình, cũng không muốn biết |
| Ngoại hình | đầu cạo, áo nâu ngắn, chân đất, đòn gánh và hai thùng gỗ nhỏ |
| Lịch | Mão gánh nước · Thìn quét sân · Tỵ làm vườn · Dậu đánh chuông gió |
| Thoại | «Thầy dặn gánh vai trái trước.» · «Người ta bảo con khắc cha, bỏ con ở chợ. Thầy nhặt con về.» · «Con không muốn biết lá số. Biết làm gì, con ở đây rồi.» · «Thầy ăn nhạt lắm. Ni sư dưới Bút Tháp hay gửi muối vừng.» |
| Nhiệm vụ | «Gánh nước mùa cạn» (06-02 bậc Tin cậy — SQ-vancoc-?? TBD-03) |
| Bark | BARK-NPC-vancoc-01-1 «Nước lên rồi!» · BARK-NPC-vancoc-01-2 (đánh chuông gió ba tiếng) |

---

## 22. Côn Lôn Thiên Trì (`conlon`)

### NPC-conlon-01 · Người giữ Thiên Trì «Thủy Kính»

| Mục | Nội dung |
|---|---|
| Vai | NPC end-game; giữ hồ Thiên Trì nơi người chơi «soi» Sổ Công Quá cuối cùng; nói lời chào ở Vĩ thanh trước Thiên Mệnh Bàn |
| Tiểu sử | 58 tuổi, **Song Linh Căn thượng 77**, Thuận Thiên. Bà là người lá số đẹp nhất mà người chơi gặp, và là người nói rõ nhất rằng điều đó **không quan trọng ở đây**: «Ở Côn Lôn không ai hỏi lá số. Người ta hỏi đã đi qua bao nhiêu người.» |
| Ngoại hình | áo trắng ngà dài, tóc bạc xõa buộc dải lụa lam, chuỗi hạt ngọc nước, gậy trúc, đi chân trần trên đá ướt |
| Lịch | luôn ở bờ hồ; giờ Mão rửa mặt hồ (sóng lăn tăn), giờ Hợi thắp đèn quanh hồ |
| Thoại | «Ở Côn Lôn không ai hỏi lá số. Người ta hỏi đã đi qua bao nhiêu người.» · «Soi đi. Hồ không phản chiếu mặt, chỉ phản chiếu việc.» · «Người lá số đẹp như tôi tới đây chậm hơn người khác. Vì không ai đẩy.» · «Bàn ở trên kia. Đi cùng mọi người, không đi một mình.» |
| Nhiệm vụ | «Soi Thiên Trì» (MQ-E TBD-03) |
| Bark | BARK-NPC-conlon-01-1 (tiếng nước vỗ đá) · BARK-NPC-conlon-01-2 «Thêm một người tới.» |

---

## 23. Lang thang (`langthang`)

### NPC-langthang-01 · Đào Kép Mai — gánh hát rong

| Mục | Nội dung |
|---|---|
| Vai | gánh hát đi khắp vùng; diễn tích Liễu Phàm và tích «Ông Khổng đoán mệnh» (cách game kể lại cốt truyện nền cho người mới); vô tình lan tin đồn của Định Mệnh Hội |
| Tiểu sử | 38 tuổi, Ngũ Linh Căn, bại cách. Đóng vai Liễu Phàm hai mươi năm. Từng diễn bản «Liễu Phàm thua ông Khổng» do Định Mệnh Hội thuê viết. Người chơi giúp đoàn sửa lại tích đúng |
| Ngoại hình | áo lụa tuồng sặc sỡ đã bạc, son phấn sân khấu, quạt, theo sau là xe gỗ chở phông màn |
| Lịch | theo phiên chợ: diễn giờ Tuất ở quảng trường vùng có phiên |
| Thoại | «Tối nay diễn tích Liễu Phàm! Ai xem thì ngồi!» · «Bản cũ thì Liễu Phàm chết năm năm mươi ba. Có người trả tiền cho chúng tôi diễn thế.» · (sau nhiệm vụ) «Bản mới Liễu Phàm sống tới bảy mươi tư. Khán giả vỗ tay to hơn.» · «Đời đào kép mười năm diễn một vai. Tôi muốn đổi vai.» |
| Nhiệm vụ | «Sửa tích Liễu Phàm» (SQ-langthang-?? TBD-03; thông tin `LIAOFAN_STORY`) |
| Bark | BARK-NPC-langthang-01-1 (trống chầu tùng tùng) · BARK-NPC-langthang-01-2 «Liễu Phàm đây! Liễu Phàm đổi mệnh đây!» |

### NPC-langthang-02 · «Cò» Lưu Nhanh (Định Mệnh Hội)

| Mục | Nội dung |
|---|---|
| Vai | cò mồi dẫn khách tới quầy đổi mệnh ở mọi vùng; có thể «lật» thành đồng minh như Anh Khải |
| Tiểu sử | 34 tuổi, Tứ Linh Căn thuận, bại cách, thân quá nhược. Nhanh mồm, nhanh chân, nợ nần. Lấy hoa hồng mỗi khách. Biết mình làm sai nhưng «nợ phải trả». Người chơi có thể giúp anh trả nợ bằng nghề khác (Thương đạo) |
| Ngoại hình | áo sơ mi ta màu cháo lòng, quần ống túm, mũ lưỡi trai vải, túi đeo hông, đi nhanh |
| Lịch | đi theo người chơi trong vùng có quầy (khoảng cách 15 m), giờ Thìn–Dậu |
| Thoại | «Anh ơi, có thầy giỏi lắm, xem miễn phí!» · «Thầy này đoán trúng hết, không tin anh hỏi ông Khổng.» · (bị vạch) «Thôi thôi, em đi chỗ khác.» · (nhánh lật) «Em nợ ba mươi lượng. Không dẫn khách thì lấy gì trả?» |
| Nhiệm vụ | «Nợ của Lưu Nhanh» (lật cò — chuỗi Thương đạo; SQ-langthang-?? TBD-03) |
| Bark | BARK-NPC-langthang-02-1 «Xem miễn phí! Xem miễn phí!» · BARK-NPC-langthang-02-2 (huýt sáo gọi đồng bọn) |

---

## 24. Mẫu dân làng sinh thủ tục (`NPC-GEN-<region>`)

**Mục đích:** lấp đầy đường phố bằng người có lá số thật mà không cần viết tay.

**Cách sinh:**

- Khoá: `NPC-GEN-<region>-<slot>-<YYYYMMDD>`. Đổi người mỗi ngày, cùng người trong ngày.
- Gọi `makeNpc(key, NPC_EPOCH)`; tên, giới, tuổi giữ nguyên từ `makeNpc`; nghề lấy từ bảng dưới.
- Thoại ghép từ ba phần: câu chào theo giờ, câu theo nghề, câu theo **chính lá số của NPC**:
  - điểm < 36: «Người ta bảo số tôi vất vả. Mà tôi vẫn sống tốt đấy thôi.»;
  - Dụng = hành của ngày hôm nay: «Hôm nay người tôi khoẻ lạ.»;
  - năm nay phạm Thái Tuế: «Năm nay tôi phạm Thái Tuế. Đi chậm thôi.».

| Mẫu | Vùng | Nghề (chọn theo tuổi như `QUESTIONS.age` của `npc.js`) | Câu nghề (chọn 1) |
|---|---|---|---|
| NPC-GEN-thanh | Huyền Thành | bán rau, thợ rèn, phu kiệu, học trò, bà bán xôi | «Rau sáng nay tươi lắm.» · «Sắt nguội thì không rèn được.» · «Xôi gấc, xôi đỗ đây.» |
| NPC-GEN-tubinh | Tử Bình Phong | học trò, chép sách, quét sảnh | «Tàng can khó quá.» · «Chép sai một chữ là chép lại cả trang.» |
| NPC-GEN-manh | Manh Phái Cốc | người kể chuyện mù, dắt đường, bán nhạc cụ | «Nghe tiếng mưa đi, mưa nói nhiều lắm.» |
| NPC-GEN-cungthong | Cùng Thông Hồ | ngư dân, bán cá, lái đò | «Cá đây! Mới kéo lưới.» |
| NPC-GEN-phongthuy | Phong Thủy Viên | thợ xây, thợ mộc, người làm vườn | «Cửa nhà ai kêu thì gọi tôi.» |
| NPC-GEN-lichduong | Lịch Đường | bà mối, người xem lịch, học trò lịch | «Hôm nay tiết gì nhỉ?» |
| NPC-GEN-hanhhuong | Long Hổ, Võ Đang, Yên Tử, Bút Tháp | khách hành hương | «Lên lễ cho mẹ.» · «Còn bao nhiêu bậc?» |
| NPC-GEN-mieucuong | Miêu Cương | người làm rẫy, thợ dệt, trẻ con (chỉ NPC ≥ 18 có lá số; trẻ con là hoạt cảnh không lá số) | «Lúa trên rẫy chín rồi.» |
| NPC-GEN-phongdo | Phong Đô | «người lạc» (chỉ hoạt cảnh: ngồi, đứng, không thoại cá nhân hoá — tránh mô tả cái chết cá nhân) | (không có) |

**Ràng buộc dân làng sinh thủ tục:**

- Không NPC sinh thủ tục nào nói câu tiêu cực về **lá số của người chơi**.
- Không NPC sinh thủ tục nào được gắn vai Định Mệnh Hội: kẻ lừa luôn là NPC viết tay, có kiểm duyệt.
- Câu «số tôi vất vả» chỉ dùng cho NPC có điểm thật < 36. Không bịa (T1).
