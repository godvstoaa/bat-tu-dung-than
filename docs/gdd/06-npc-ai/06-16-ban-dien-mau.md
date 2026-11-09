# 06-16 · Bản điền mẫu với dữ liệu engine thật (golden)

> **Mục đích**
> 1. Chứng minh các khung thoại `{…}` của 06-02 … 06-11 điền ra câu đúng và đọc được.
> 2. Làm **đáp án vàng** cho bộ kiểm cây kịch bản (06-14 §3.7) và cho trục D (Đúng dữ liệu) của người duyệt.
> 3. Ghi lại những **phát hiện khi chạy engine thật** mà các tài liệu khác cần biết.
>
> **Chạy ngày 2026-11-05:** `analyze(y, m, d, h, min, gender, 2026)` + `gaimenhPlan`, `computeLiuDao`, `getYeguoForChart`, `fiveDimRadar`, `computeLiuyue`. Số liệu chép nguyên văn; tên Hán dịch sang Hán Việt.

---

## 1. Ba lá số mẫu

### 1.1 MAU-A — 1990-05-15 08:30, nam (canon §11)

| Trường | Giá trị engine |
|---|---|
| Tứ trụ | 庚午 Canh Ngọ · 辛巳 Tân Tỵ · 庚辰 Canh Thìn · 庚辰 Canh Thìn |
| Nhật chủ | Canh Kim |
| Tiềm Lực / phẩm căn | 41 · TRUNG ĐẲNG · Cân bằng, cần nỗ lực → **Tứ Linh Căn**; bách phân vị 31 |
| Phúc phận | «Khá no ấm — có thành tựu nếu biết nắm đúng vận» |
| Ngũ hành % | Kim 55,1 · Hỏa 18,3 · Thổ 17,9 · Mộc 6,5 · Thủy 2,2 |
| Thân | quá vượng |
| Dụng / Hỷ / Kỵ / Cừu | Thủy / Kim / Thổ / Hỏa |
| Cách | Thất Sát cách — **有救 Đắc Cứu** |
| Bệnh | ① Tài đảng Sát mà không có Thực / Ấn chế → Sát vô chế; ② Thực thần chế Sát nhưng bị Kiêu đoạt thực |
| Thuốc | ① `shi` Thực Thương; ② `cai` Tài |
| Mệnh Đồ — chẩn đoán | Mệnh cục thiên lệch · Tổ hợp hung · Manh phái «làm công» thấp |
| Lục đạo / tam độc | Nhân đạo · tham 29, **sân 37**, si 27 |
| Nghiệp gợi ý (`getYeguoForChart`) | **mảng rỗng** (xem §4 phát hiện P3) |
| Ngũ Duy | mạnh nhất Tỷ Kiếp (100) → **Đồng đạo**; yếu nhất Thực Thương (15) → **Nghệ đạo** |
| Đại vận | 壬午 8 · 癸未 18 (Cát) · **甲申 28 (Bình hòa) — đang đi** · 乙酉 38 (Bình hòa) · 丙戌 48 (Đại hung) · 丁亥 58 (Cát) · 戊子 68 (Cát) · 己丑 78 (Hung) |
| Lưu niên 2026 | 丙午 Bính Ngọ · điểm **6** · can năm là Thất Sát |
| Lưu nguyệt 2026 | tốt: tháng Thìn (壬辰), tháng Dậu (丁酉) · kỵ: tháng Tuất (戊戌), tháng Ngọ (甲午) |
| Thần sát | Học Đường, Tướng Tinh, Hoa Cái, Thiên Y, Thiên Đức, Nguyệt Đức, Khôi Cương, Lưu Hà |
| Sao bản mệnh (bái Đẩu) | năm Ngọ → Phá Quân |
| Hệ số Nghịch Thiên | 1 + (60 − 41)/100 = **1,19** |
| Nạp âm năm | 庚午 Lộ Bàng Thổ |

### 1.2 L-THAP — 1969-02-10 13:15, nam (`NPC-maoshan-02`)

| Trường | Giá trị engine |
|---|---|
| Tứ trụ | 己酉 Kỷ Dậu · 丙寅 Bính Dần · 丙辰 Bính Thìn · 乙未 Ất Mùi |
| Nhật chủ | Bính Hỏa |
| Tiềm Lực / phẩm căn | 23 · HẠ ĐẲNG → **Phàm Căn**; bách phân vị 4 |
| Phúc phận | «Khởi đầu vất vả nhưng có tiềm năng — cần đúng Dụng Thần + đúng thời điểm để bứt phá» |
| Ngũ hành % | Thổ 35,8 · Hỏa 28,2 · Mộc 24,9 · Kim 9,9 · Thủy 1,1 |
| Thân | vượng |
| Dụng / Hỷ / Kỵ / Cừu | Thủy / Kim / Thổ / Hỏa |
| Cách | Thiên Ấn cách (Kiêu Thần) — **败格 Nghịch Thiên** |
| Bệnh | ① Kiêu đoạt Thực; ② Tài phá Kiêu khi không cần phá |
| Thuốc (vẫn có trong dữ liệu dù bại cách) | `cai` Tài |
| Lục đạo / tam độc | Nhân đạo · tham 8, **sân 40**, si 27 |
| Nghiệp gợi ý | ① Thâu đạo (Tài nhược / khuyết); ② Ỷ ngữ (Thương Quan = khẩu) |
| Ngũ Duy | mạnh nhất Thực Thương (100) → **Nghệ đạo**; yếu nhất Quan (14) → **Trị đạo** |
| Đại vận | 乙丑 3 · 甲子 13 · 癸亥 23 (Cát) · 壬戌 33 (Đại hung) · 辛酉 43 (Đại cát) · **庚申 53 (Đại cát) — đang đi** · 己未 63 (Hung) · 戊午 73 (Hung) |
| Lưu niên | 2026 丙午 **9** · 2027 丁未 24 · 2028 戊申 62 · 2029 己酉 22 · 2030 庚戌 54 |
| Lưu nguyệt 2026 | tốt: tháng Tý (庚子), tháng Dần (庚寅) · kỵ: tháng Tuất, tháng Ngọ |
| Thần sát | Thiên Ất, Học Đường, Đào Hoa, Dịch Mã, Tướng Tinh, Hoa Cái, Nguyệt Đức, Kim Dư, Hồng Diễm, Thái Cực, Thiên Trù, Lưu Hà, Thập Linh |
| Sao bản mệnh | năm Dậu → Văn Khúc |
| Hệ số Nghịch Thiên | 1 + (60 − 23)/100 = **1,37** |

### 1.3 L-CAO — 1984-01-07 18:45, nam (`NPC-phongthuy-02`)

| Trường | Giá trị engine |
|---|---|
| Tứ trụ | 癸亥 Quý Hợi · 乙丑 Ất Sửu · 庚子 Canh Tý · 乙酉 Ất Dậu |
| Nhật chủ | Canh Kim |
| Tiềm Lực / phẩm căn | **86** · ĐỈNH CAO HUYỀN THOẠI · CỰC PHẨM → **Thiên Linh Căn**; bách phân vị 99 |
| Phúc phận | «ĐẠI PHÚ / QUÝ — danh lợi lẫy lừng…» |
| Ngũ hành % | Thủy 47 · Mộc 21,9 · Kim 20,8 · Thổ 10,3 · Hỏa 0 |
| Thân | quá nhược |
| Dụng / Hỷ / Kỵ / Cừu | Thủy / Kim / Thổ / Hỏa |
| Cách | **Tòng Nhi cách (Tòng Thực Thương)** — `patternQuality.quality = 有救` (giả tòng: nhật chủ đắc gốc tàng ở Dậu) |
| Thuốc | `shi`, `cai` |
| Lục đạo / tam độc | **Ngạ quỷ đạo** · **tham 67**, sân 53, si 0 |
| Nghiệp gợi ý | ① Thâu đạo; ② Ỷ ngữ |
| Ngũ Duy | mạnh nhất Thực Thương (100); yếu nhất Quan (0) |
| Đại vận | 甲子 1 (Đại cát) · 癸亥 11 (Đại cát) · 壬戌 21 (Cát) · 辛酉 31 (Bình hòa) · **庚申 41 (Bình hòa) — đang đi** · 己未 51 (Đại hung) · 戊午 61 (Đại hung) · 丁巳 71 |
| Lưu niên | 2026 丙午 **6** · 2027 丁未 49 · 2028 戊申 34 · 2029 己酉 38 · 2030 庚戌 54 · 2031 辛亥 42 · 2032 壬子 80 · 2033 癸丑 59 |
| Lưu nguyệt 2026 | tốt: tháng Tý (庚子), tháng Thìn (壬辰) · kỵ: tháng Tuất, tháng Thân (丙申) |
| Thần sát | Thiên Ất, Văn Xương, Dương Nhận, Đào Hoa, Tướng Tinh, Thiên Y, Thiên Đức, Nguyệt Đức, Nguyệt Đức hợp, Thiên Đức hợp, Đức Tú, Từ Quán, Thái Cực, Thiên Trù, Tai Sát |
| Sao bản mệnh | năm Hợi → Cự Môn |
| Hệ số Nghịch Thiên | 1 + (60 − 86)/100 = 0,74 → kẹp **1,0** |

---

## 2. Bản điền — kịch bản các NPC luận lá số

> Cột «Câu đã điền» là đầu ra **mong đợi chính xác** của bộ chạy cây thoại (06-15 §6 việc 8), dùng để so chuỗi.
> Chỗ nào chưa có hàm định dạng thì ghi `⟨…⟩` kèm mô tả.

### 2.1 Khổng tiên sinh — KTS.01 «Lời phán» (Mở đầu 0.4)

| Lá số | Câu đã điền |
|---|---|
| MAU-A | «Canh Kim sinh tháng Tỵ, lửa luyện mà kim cứng. Năm nay Bính Ngọ, Thất Sát lâm năm. ⟨`liunianNow.oneLine` — câu đầu `analyzeLiunianDeep(2026)`⟩. Ba mươi tám tuổi đổi vận Ất Dậu, bình hòa mười năm. Ta nói sai câu nào chưa?» |
| L-THAP | «Bính Hỏa sinh tháng Dần, cây non nhóm lửa. Năm nay Bính Ngọ, Tỷ Kiên lâm năm. ⟨oneLine⟩. Sáu mươi ba tuổi đổi vận Kỷ Mùi, hung mười năm. Ta nói sai câu nào chưa?» |
| L-CAO | «Canh Kim sinh tháng Sửu, kim nằm trong đất lạnh. Năm nay Bính Ngọ, Thất Sát lâm năm. ⟨oneLine⟩. Năm mươi mốt tuổi đổi vận Kỷ Mùi, đại hung mười năm. Ta nói sai câu nào chưa?» |

- **Ghi chú L-THAP:** «Tỷ Kiên lâm năm» suy từ can năm 丙 gặp nhật chủ 丙. Bộ chạy phải lấy từ `liunian[isNow].ganGod`, không tự suy.
- **Ghi chú `imageLine`:** «lửa luyện mà kim cứng», «cây non nhóm lửa», «kim nằm trong đất lạnh» là ví dụ đầu ra của hàm rút gọn hình ảnh **(chưa có — cần làm)**. Nếu chưa có hàm, bỏ cụm này; câu vẫn đúng.
- **Lưu ý giọng cho người chơi L-CAO:** câu thứ ba báo «đại hung» cho mười năm tới. Đúng engine, nhưng KTS-KET bắt buộc nối câu hỏi ngược; persona không thêm lời bi quan.

### 2.2 Khổng tiên sinh — KTS.06 «Năm nay»

| Lá số | Câu đã điền |
|---|---|
| MAU-A | «Năm nay Bính Ngọ. Điểm 6. ⟨oneLine⟩. Năm thấp. Đừng ký gì lớn.» + KTS-KET |
| L-THAP | «Năm nay Bính Ngọ. Điểm 9. ⟨oneLine⟩. Năm thấp. Đừng ký gì lớn.» + KTS-KET |
| L-CAO | «Năm nay Bính Ngọ. Điểm 6. ⟨oneLine⟩. Năm thấp. Đừng ký gì lớn.» + KTS-KET |

**Phát hiện thiết kế (P5):** ba lá số Dụng Thủy đều có năm 2026 Bính Ngọ (Hỏa vượng) điểm rất thấp. Mọi người chơi Dụng Thủy năm nay sẽ nghe «năm thấp».

- Persona và kịch bản đã chặn tất định. Nhưng **tần suất** lời báo xấu cao trong năm 2026 cần nhóm cân bằng xem lại.
- Đề xuất: KTS.06 thêm câu hai khi `score < 20`: «Năm thấp không phải năm hỏng. Năm thấp là năm giữ.»

### 2.3 Khổng tiên sinh — KTS.08 «Đại vận»

| Lá số | Câu đã điền |
|---|---|
| MAU-A | «Đại vận đang đi là Giáp Thân, từ 28 tới 37 tuổi. Sang Ất Dậu thì bình hòa.» |
| L-THAP | «Đại vận đang đi là Canh Thân, từ 53 tới 62 tuổi. Sang Kỷ Mùi thì hung.» |
| L-CAO | «Đại vận đang đi là Canh Thân, từ 41 tới 50 tuổi. Sang Kỷ Mùi thì đại hung.» |

**Phát hiện (P6):** `R.dayun[i].endAge` trả `null` trong lần chạy. Tuổi kết thúc phải tính `startAge(i+1) − 1` **(chưa có — cần làm trong hàm định dạng)**. Trường `current` cũng không có cờ trong mảng ta in; phải xác định vận hiện tại bằng tuổi.

### 2.4 Thầy Tử Bình — TB.01 … TB.05 (lễ lật trụ, MAU-A)

| Nút | Câu đã điền |
|---|---|
| TB.01 | «Trụ năm Canh Ngọ — gốc nhà, tổ tiên.» · «Trụ tháng Tân Tỵ — thân, môi trường con lớn lên.» · «Trụ ngày Canh Thìn — chính con. Nhật chủ Canh.» · «Trụ giờ Canh Thìn — quả, về già, con cái.» |
| TB.02 | «Ngũ hành của con: Kim 55%, Hỏa 18%, Thổ 18%, Mộc 7%, Thủy 2%. Thanh dài nhất là chỗ con mạnh: Kim. Thanh ngắn nhất là chỗ phải bù: Thủy.» |
| TB.03 | «Thân con quá vượng. Nên Dụng Thần là Thủy: hành giúp con cân lại. Hỷ Kim, kỵ Thổ.» |
| TB.04 | «Điểm tiềm lực của con là 41, hơn 31% người. Sách gọi là TRUNG ĐẲNG · Cân bằng, cần nỗ lực; trong thế giới này gọi Tứ Linh Căn.» + câu dẫn «Lá số là hạt giống…» (vì 41 < 46) |
| TB.05 | nhánh `MC:DC`: «Cách con có bệnh mà có thuốc. Thầy nhận con. Nhưng con phải đi hái thuốc: Võ Đang có Đan Đỉnh chân nhân.» |

**Phát hiện (P7) — `checkNeo` phép 2:** câu TB.02 làm tròn % (55 so với 55,1).

- Phép 2 cho lệch ≤ 3% → **khớp**.
- Cần giữ quy tắc làm tròn số nguyên; **không** làm tròn tới bội số 5.

**Hỷ Kim khi thân quá vượng:** engine trả `yong.xi = 金` cho MAU-A dù nhật chủ Kim quá vượng. Canon §11 cũng ghi «Hỷ Kim». Thoại theo engine; câu hỏi chuyên môn chuyển tài liệu 04 (P8).

### 2.5 Thầy Tử Bình — TB.04 với L-THAP và L-CAO

| Lá số | Câu đã điền |
|---|---|
| L-THAP | «Điểm tiềm lực của con là 23, hơn 4% người. Sách gọi là HẠ ĐẲNG · Nhiều thử thách, «có bệnh mới quý»…; trong thế giới này gọi Phàm Căn.» + «Lá số là hạt giống…» |
| L-CAO | «Điểm tiềm lực của con là 86, hơn 99% người. Sách gọi là ĐỈNH CAO HUYỀN THOẠI · CỰC PHẨM…; trong thế giới này gọi Thiên Linh Căn.» + «Hạt tốt. Hạt tốt mà để trong túi thì cũng không thành cây.» |

**Ghi chú độ dài:** `gradeVi` của L-THAP và L-CAO rất dài (có ngoặc, gạch ngang). Hàm định dạng chỉ lấy phần trước dấu «·» thứ hai, hoặc 40 ký tự đầu **(chưa có — cần làm)**.

### 2.6 Vân Cốc — VC.10 … VC.30

| Nút | MAU-A | L-THAP | L-CAO |
|---|---|---|---|
| VC.10 «Tầng sáng nhất» | «… Tầng sáng nhất là tầng lá số con lệch nhiều nhất: Không gian.» | như MAU-A | «… : Làm công.» (chỉ có chẩn đoán «Manh phái làm công thấp») |
| VC.15 «Làm công» | «Lá số con mạnh ở Đồng đạo.» | «… mạnh ở Nghệ đạo.» | «… mạnh ở Nghệ đạo.» |
| VC.17 (A ≥ 40) | «Lá số con lệch ở: Mệnh cục thiên lệch. Nên làm tầng Không gian trước…» | như MAU-A | «Lá số con lệch ở: Manh phái làm công thấp. Nên làm tầng Làm công trước…» |
| VC.18 | hiện (41 < 46): «Mệnh do ta tạo. Lá số con điểm 41, người ta gọi TRUNG ĐẲNG · Cân bằng, cần nỗ lực. … nhân 1,19.» | «… điểm 23, người ta gọi HẠ ĐẲNG… nhân 1,37.» | không hiện (86) |
| VC.21 (Đắc Cứu) | «Thuốc của con là Thực Thương. Lên Võ Đang tìm Đan Đỉnh chân nhân…» | không hiện (bại cách) | «Thuốc của con là Thực Thương…» |
| VC.30 «Dễ vướng nghiệp gì» | **mảng nghiệp rỗng** → dùng nhánh dự phòng (§4 P3): «Sổ không thấy nghiệp nào nổi. Tam độc của con nặng phần sân. Đi chậm ở chỗ ấy.» | «Lá số con nghiêng về Thâu đạo nghiệp (trộm cắp). Không phải con đã làm…» | như L-THAP |

**Câu VC.30 với L-THAP:** «Thâu đạo» nghe nặng với người chơi.

- Persona đã có «Không phải con đã làm. Là con dễ trượt chân ở chỗ đó.» Câu này **bắt buộc** đi liền sau.
- Đề xuất đổi nhãn hiển thị thành «nghiệp lấy của» (dịch đời thường), giữ tên gốc trong ngoặc (P9).

### 2.7 Diệu Âm — DA.02, DA.04

| Lá số | DA.02 | DA.04 |
|---|---|---|
| MAU-A | «Lá số con nặng phần sân (37). Không phải con xấu. Là chỗ con dễ trượt.» | «… Lá số con nghiêng về nhân đạo…» |
| L-THAP | «… nặng phần sân (40)…» | «… nhân đạo…» |
| L-CAO | «… nặng phần tham (67)…» | «… nghiêng về ngạ quỷ đạo. Sách nói vậy để con biết mình hay đứng ở đâu, không phải để con sợ.» |

- **L-CAO kích hoạt người dẫn Diệu Âm**, vì `liudao.primary` thuộc ba đường dữ (canon §5.2).
- Đây là ca kiểm quan trọng: người chơi **86 điểm Thiên Linh Căn** vẫn được dẫn tới sám hối, vì tam độc tham 67. Đúng tinh thần «không ai được miễn tu».
- **Lưu ý `checkNeo` phép 5:** câu DA.04 cho L-CAO chứa «ngạ quỷ» viết thường. Brief chứa «Ngạ Quỷ» → khớp, không xung đột.

### 2.8 Đan Đỉnh — DD.02 … DD.06

| Nút | MAU-A | L-CAO |
|---|---|---|
| DD.02 | «Bệnh của cách con: Tài đảng Sát mà không có Thực, Ấn chế. Nói dễ: áp lực lớn, tiền lại đổ thêm vào áp lực, mà không có chỗ xả.» | «Bệnh của cách con: Nhật Chủ đắc gốc tàng ở Dậu — tòng không thuần. Nói dễ: con muốn theo dòng mà vẫn níu một bờ.» |
| DD.03 | «Còn một bệnh nữa: Thực thần chế Sát nhưng lại bị Kiêu đoạt thực.» | «Một bệnh thôi. Dễ chữa.» |
| DD.04 | «Thuốc là Thực Thương: nói ra, làm ra cái mình nghĩ…» | «Thuốc là Thực Thương và Tài…» |
| DD.05 | «Vị thứ nhất mọc ở Long Hổ Sơn. Vị thứ hai ở Manh Phái Cốc và chợ Huyền Thành.» | «Vị thứ nhất mọc ở Long Hổ Sơn. Vị thứ hai ở Manh Phái Cốc và chợ Huyền Thành.» |
| DD.06 | «Đại vận Đinh Hợi (58 tuổi) mang thuốc tới cho con…» — chọn vận Cát gần nhất **sau** hiện tại có Thủy / Thực Thương | «Đại vận … » — với L-CAO các vận Cát đều **đã qua**; dùng câu dự phòng: «Vận thuốc của con đi trước rồi. Giờ thuốc phải tự trồng.» |

- `{plainDisease}` («áp lực lớn, tiền lại đổ thêm vào áp lực…») là đầu ra của bảng dịch đời thường theo `via` **(chưa có — cần làm)**. Đề xuất bản đầu:

| `via` | Lời đời thường |
|---|---|
| `dang` (Tài đảng Sát) | «áp lực lớn, tiền lại đổ thêm vào áp lực, mà không có chỗ xả» |
| `duo` (Kiêu đoạt thực) | «cái muốn làm bị cái lo nghĩ ăn mất» |
| tòng bất thuần | «muốn theo dòng mà vẫn níu một bờ» |

- **DD.06 cần quy tắc rõ:** «đại vận mang thuốc» = vận **tương lai** gần nhất có `gejuDelta > 0`, hoặc mang hành của nhóm thuốc. Không có thì dùng câu dự phòng. Không bao giờ chỉ vận đã qua như thể sắp tới.

### 2.9 Trương Thiên Sư — TTS.08

| Lá số | Câu đã điền |
|---|---|
| MAU-A | «Bảy sao Bắc Đẩu. Mỗi người có một sao bản mệnh theo năm sinh. Thí chủ tuổi Ngọ, sao bản mệnh là Phá Quân.» |
| L-THAP | «… tuổi Dậu, sao bản mệnh là Văn Khúc.» |
| L-CAO | «… tuổi Hợi, sao bản mệnh là Cự Môn.» |

**Kiểm `checkNeo` phép 4:** câu không có «cung» trong cửa sổ → không cờ đỏ (06-05 lưu ý).

### 2.10 Tế tửu — TT.10, TT.18

| Lá số | TT.10 | TT.18 |
|---|---|---|
| MAU-A | «Trò thiếu hành Thủy, Dụng Thần là Thủy. Một chữ mang hành ấy trong đạo hiệu…» | ⟨`studyYear`: năm gần nhất lưu niên có can / chi là Chính / Thiên Ấn — với nhật chủ Canh là năm Mậu / Kỷ (Thổ); cần hàm `worstYearAhead`-tương tự `studyYearAhead` **(chưa có)**⟩ |
| L-THAP | «Trò thiếu hành Thủy, Dụng Thần là Thủy…» | Ấn của Bính là Giáp / Ất (Mộc) |
| L-CAO | «Trò thiếu hành Hỏa, Dụng Thần là Thủy…» — **hành thiếu ≠ Dụng** (Hỏa 0%, nhưng Hỏa là Cừu thần) | Ấn của Canh là Mậu / Kỷ |

**Phát hiện (P10):** với L-CAO, hành thiếu nhất (Hỏa 0%) lại là **Cừu thần**. Câu TT.10 «một chữ mang hành ấy» sẽ khuyên sai.

- **Sửa quy tắc:** gợi ý chữ theo **Dụng Thần**, không theo «hành thiếu nhất», khi hành thiếu thuộc Kỵ / Cừu.
- Tương tự VC.11 … VC.16 và 06-12 mẫu dân làng: mọi chỗ «bù hành thiếu» phải kiểm điều kiện này.

### 2.11 Phương sĩ — PS.02 với L-CAO

| Lá số | Câu đã điền |
|---|---|
| L-CAO | «Cách của người lạ là Tòng Nhi cách (Tòng Thực Thương). Cả lá số nghiêng về Thủy. Thế thì thuận theo Thủy.» |

**Phát hiện (P4):** L-CAO là **tòng cách** — đúng đối tượng của Phương sĩ — nhưng `patternQuality.quality = 有救`, nên theo canon §4.5 người chơi này rơi vào nhánh **Đắc Cứu**, không phải Dị Cách.

- **Đề xuất cho 03 / 04:** Phương sĩ cũng xuất hiện (nhánh phụ) khi `R.pattern.type !== 'normal'`, kể cả khi `quality` không phải `特殊`.
- Trong lần chạy, `R.pattern.type` của MAU-A là `'normal'`; với L-CAO cần đọc giá trị thật khi làm.

---

## 3. Bản điền — NPC không luận lá số

| NPC / nút | Dữ liệu | Câu đã điền (MAU-A) |
|---|---|---|
| Huyền Hư HH.11 | Dụng Thủy → bảng `yongPlace` | «Hành của tiểu hữu là Thủy. Tập ở bên suối thì dễ yên hơn.» |
| Lão Tùng LT.06 | tuổi 36 | không hiện (≥ 13) |
| Bà Tư BT.01 | Dụng Thủy, Hỷ Kim | «Dụng thần của con là Thủy. Áo đầu tiên bà may theo màu ấy, đai theo Hỷ thần Kim. Tặng con, không lấy gì.» |
| Bà Tư BT.07 | bộ theo Dụng | «Bộ Huyền Thủy hợp hành của con.» (`set: 'thuy'` — Huyền Thủy Long Bào, Bích Ngọc Trâm, Ô Giấy Dầu Vẽ Sen…) |
| Vu y bà VY.02 | Thủy thiếu (2,2%), Kim thừa (55,1%) | «Lá số cháu nặng Kim, nhẹ Thủy. Ông bà ta bảo ăn uống cũng nên bù chỗ nhẹ. ⟨`foodHint` từ `health_profile`⟩. Ăn vừa thôi, không phải thuốc.» |
| Phán quan PQ.01 | trạng thái mẫu: thiện 12 việc, ác 3, ròng +18 | «Cột bên phải: 12 việc. Cột bên trái: 3 việc. Ròng: 18.» |

---

## 4. Phát hiện khi chạy engine thật (chuyển tài liệu khác)

| Mã | Phát hiện | Ảnh hưởng | Chuyển cho |
|---|---|---|---|
| P1 | Trụ tháng MAU-A là **辛巳 (tháng Tỵ)**, không phải «tháng Ngọ» như canon §11 và bản sơ đồ §3 (0.4) | Lời phán mẫu của Khổng tiên sinh trong canon sai một chữ; 06-03 đã sửa theo engine | 00 (canon), 03 |
| P2 | `R.liunian` là cửa sổ 10 năm quanh tuổi, **không** luôn nhìn tới; MAU-A trả 2017–2026 | «Năm hạn 10 năm tới» (Hồi III) không lấy được từ `R.liunian` | 03, 13 |
| P3 | `getYeguoForChart(MAU-A)` trả **mảng rỗng** | VC.30 cần nhánh dự phòng theo tam độc | 05 |
| P4 | Tòng cách (L-CAO) có `quality = 有救` → không vào nhánh Dị Cách | Phương sĩ bỏ sót người chơi tòng cách | 03, 04 |
| P5 | Năm 2026 Bính Ngọ: ba lá số Dụng Thủy đều điểm lưu niên 6–9 | Tần suất lời «năm thấp» rất cao năm nay | 04, 03 (cân bằng giọng) |
| P6 | `R.dayun[i].endAge = null`; không có cờ `current` | Hàm định dạng phải tự tính | 13 |
| P7 | `checkNeo` phép 2 so % lệch ≤ 3 | Làm tròn số nguyên an toàn | — |
| P8 | Hỷ thần Kim khi nhật chủ Kim quá vượng (MAU-A) | Câu hỏi chuyên môn về `yong.xi` | 04 |
| P9 | Tên nghiệp «Thâu đạo nghiệp (trộm cắp)» nặng nề khi hiện cho người chơi | Đổi nhãn hiển thị sang lời đời thường | 05, 12 |
| P10 | Hành thiếu nhất có thể là Cừu thần (L-CAO: Hỏa 0%) | Mọi câu «bù hành thiếu» phải kiểm Kỵ / Cừu | 04, 09 |

---

## 5. Dùng tài liệu này trong kiểm thử

- **Ba lá số trên** là `chart` mặc định của bộ cây thoại (06-14 §3.7). Bộ chạy so chuỗi đã điền với cột «Câu đã điền».
  - Chấp nhận khác biệt ở chỗ `⟨…⟩` (hàm chưa có).
  - Chấp nhận khác biệt ở câu `KTS-KET` (ngẫu nhiên).
- **Khi engine đổi** (vd sửa P1 phía engine, hay đổi công thức điểm): chạy lại script dò số liệu, cập nhật §1, đánh dấu ngày chạy. Mọi khác biệt ở §2 phải được người duyệt xác nhận là **đúng engine mới**, không phải lỗi khung thoại.
- **Ngày chạy hiện tại:** 2026-11-05 · tham số `refYear = 2026`.
