# 03 · Phần 13 — Kịch bản biến thể bổ sung và kiểm thử xuyên truyện

> Phần A: đi trọn cốt truyện với năm lá số mẫu — mỗi lá số ra con đường nào, câu nào, năm nào (số liệu chạy engine thật, năm tham chiếu 2026). Phần B: các cảnh biến thể mà phần chính chỉ ghi bằng bảng (hành thiếu theo từng hành, nhà riêng theo mệnh quái, việc hợp tay theo từng trục, bạn cũ quay lưng theo từng loại phạm, biến thể iOS). Phần C: bảng kiểm thử chấp nhận cho từng nhiệm vụ.

---

## A. Năm lá số mẫu đi trọn cốt truyện

### A.1 Bảng tổng

| Trường | MAU-A | MAU-B | TT-1 | NT-1 | DK-1 |
|---|---|---|---|---|---|
| Ngày giờ | 1990-05-15 08:30 nam | 1995-06-15 08:30 nam | 1976-12-05 10:00 nam | 1970-05-19 08:00 nam | 1970-09-27 08:00 nam |
| Tứ trụ | 庚午 辛巳 庚辰 庚辰 | 乙亥 壬午 丁丑 甲辰 | 丙辰 己亥 辛卯 癸巳 | 庚戌 辛巳 己亥 戊辰 | 庚戌 乙酉 庚戌 庚辰 |
| Tiềm Lực · Phẩm căn | 41 · Tứ Linh Căn | 48 · Tứ Linh Căn thuận | 71 · Song Linh Căn | 19 · Phàm Căn | 43 · Tứ Linh Căn thuận |
| Bách phân vị | 31 | 53 | 94 | 2 | 37 |
| Hệ số Nghịch Thiên | 1,19 | 1,12 | 1,00 | 1,41 | 1,17 |
| `F_LOW_SCORE` (< 46) | có | không | không | có | có |
| Cách · chất lượng | Thất Sát cách · 有救 | Chính Quan cách · 败格 | Thương Quan cách · 成格 | Thương Quan cách · 败格 | Chuyên Vượng Kim (special) · 成格 |
| **Nhánh** (README §2.2) | **DC** | **NT** | **TT** | **NT** | **DK** |
| Dụng / Hỷ / Kỵ / Cừu | Thủy / Kim / Thổ / Hỏa | Thủy / Kim / Thổ / Hỏa | Thủy / Kim / Thổ / Hỏa | Thủy / Kim / Thổ / Hỏa | Thủy / Kim / Thổ / Hỏa |
| Hành thấp nhất (MQ-1-05) | Thủy 2,2 (= Dụng) | Kim 1,2 (= Hỷ) | Kim 14,5 (= Hỷ) | Mộc 6,1 (nhàn thần) | Thủy 1,1 (= Dụng) |
| Vật MQ-1-05 | nước đầu nguồn Cùng Thông Hồ | nước đầu nguồn + việc phụ lục lạc đồng Manh Phái | như MAU-B | nước đầu nguồn | nước đầu nguồn |
| Thái Tuế 2026 (Bính Ngọ) | tuổi Ngọ: **Trị + Hình** | tuổi Hợi: không | tuổi Thìn: không | tuổi Tuất: không | tuổi Tuất: không |
| Mệnh quái (`computeZhai`) | Khảm · Đông Tứ | Khôn · Tây Tứ | Càn · Tây Tứ | Chấn · Đông Tứ | Chấn · Đông Tứ |
| Ngũ Duy mạnh / yếu | Tỷ 100 / Thực 15 | Ấn 100 / Tài 13 | Thực 100 / Tỷ 25 | Thực 100 / Quan 31 | Tỷ 100 / Thực 13 |
| Biến thể MQ-2-11 | Đồng đạo | Học đạo | Nghệ đạo | Nghệ đạo | Đồng đạo |
| Vị thuốc (`rescues[].drug`) | Thực, Tài | (Ấn, Tỷ — nhưng nhánh NT, không dùng) | — | (Ấn — dùng ở BR-NT-04 làm «chỗ cứu») | — |
| `Y*` (năm hạn) | 2036 丙辰 · 29 Hơi kỵ | 2027 丁未 · 10 Hung | 2030 庚戌 · 14 Hung | 2027 丁未 · 4 Đại hung | 2036 丙辰 · 6 Đại hung |
| Thái Tuế ở `Y*` | không | không | **Xung** | **Hình + Phá** | **Xung** |
| Biến thể MQ-3-07 | B (không phạm) | B | A — Xung | A — Hình + Phá | A — Xung |
| Biến thể MQ-3-08 (Kỵ) | Thổ | Thổ | Thổ | Thổ | Thổ |
| Năm vàng (`findGoldenYear`) | 2031 辛亥 (thật sự vàng) | 2030 庚戌 | 2034 甲寅 | 2032 壬子 | 2035 乙卯 |
| Thể chất (`bodyConstitution`) — A Mậu đọc | Dương Hư | Khí Uất | Đặc Bẩm | Đàm Thấp | Dương Hư |
| Tâm ma cao nhất (`liudao.poisons`) | Sân 37 | Sân 40 | Si 27 | Sân 30 | Tham 37 |
| Nguyên Khí (`baseVitality`) | 23 | 25 | 22 | 21 | 25 |
| Nghiệp dễ vướng (`getYeguoForChart`) | (rỗng) | Thâu đạo; nghiệp chướng tổng (cách bại) | Thâu đạo | Thâu đạo; Ỷ ngữ; nghiệp chướng tổng | (rỗng) |

Ghi chú dữ liệu: cả năm lá số mẫu đều ra Dụng Thủy, Kỵ Thổ (với TT-1 là do điều hậu override sinh tháng Hợi; với DK-1 do chuyên vượng lấy tiết). Biến thể Kỵ Hỏa / Kim / Thủy / Mộc của MQ-3-08 được kiểm bằng lá số nhân vật phụ (Lê Khiêm, bà Lựu — Kỵ Hỏa; Ông Kha — Kỵ Kim; anh Lý Thuận, bé Lúa — Kỵ Thủy; anh Bảy Sơn — Kỵ Mộc) chạy như lá số người chơi trong môi trường kiểm thử. Tập 04 nên bổ sung lá số mẫu `MAU-C…` có Kỵ khác Thổ.

### A.2 Đi trọn với MAU-A (nhánh Đắc Cứu)

| Chặng | Điều người chơi thấy / nghe (rút gọn) |
|---|---|
| MQ-P-02 | Tứ trụ 庚午 辛巳 庚辰 庚辰; Kim 55,1, Thủy 2,2; Thân quá vượng; 41 điểm, Tứ Linh Căn, hơn 31%; câu dẫn hạt giống (vì < 46) |
| MQ-P-03 | dòng trừ nặng nhất: «Tổ hợp hung … −10»; Mệnh Cấp Thanh Quý |
| MQ-P-04 | phẩm phục Thủy: đen huyền viền lam |
| MQ-P-06 | ba lời phán ví dụ 1 (`03-01` §6.2) |
| MQ-P-08 | Cát Huyền tới Trà Thất: hai bệnh, hai vị Thực, Tài (CUT-007) |
| MQ-1-05 | «Thiếu đúng cái cần» → Cùng Thông Hồ |
| MQ-1-06 | cổng 3 甲申 Bình hòa, Lâm Quan; cổng kế 乙酉; cổng dè chừng 丙戌 (48–57) |
| MQ-1-07 | phạm Trị + Hình; bùa gỗ Hổ, Chó; phương Nam |
| MQ-1-12 | 3 chẩn đoán; tầng Không gian Vận 9 (đương lệnh Cửu Tử; tránh Chính Tây, Đông Bắc, Chính Bắc) |
| BR-DC | BR-DC-01 (rèn dao) → BR-DC-02 (kết phù Long Hổ) → BR-DC-04 (bán nấm) → BR-DC-07 |
| MQ-2-03 | Khảm; nếu chọn gian cửa Nam: ba thứ chồng ở Nam (Diên Niên / Ngũ Hoàng niên bàn / Thái Tuế) |
| MQ-2-05 | đạo hiệu gợi ý «Hải Thành» (họ Nguyễn: 8 / 17 / 17 / 7 / 23, tất cả Cát) |
| MQ-2-09 | nhánh phạm: 7 ngày giữ đèn, một ngày khẩu, giúp Thanh Phong (Phá) |
| MQ-2-11 | Đồng đạo: tổ đồng tu ba buổi |
| MQ-2-22 / Hồi III | `Y*` 2036 Bính Thìn Hơi kỵ 29; mộng: Thanh Phong 25 tuổi; niên bàn 2036 Ngũ Hoàng Chính Bắc; ngày xấu 2036-03-10 Bính Tý (Trực Thu, xung Ngọ, điểm 7); MQ-3-07 biến thể B; MQ-3-08 Thổ |
| MQ-3-12 | năm vàng 2031 Tân Hợi |
| MQ-4-02 | A Mậu: «Dương Hư, yếu Thủy, mạnh Kim» |
| MQ-4-10 | Phán quan: lá số không chỉ nghiệp nào nặng |
| MQ-E-04 | khuôn chạy lại năm hiện tại |

### A.3 Đi trọn với NT-1 (nhánh Nghịch Thiên, điểm thấp nhất)

| Chặng | Điều người chơi thấy / nghe (rút gọn) |
|---|---|
| MQ-P-02 | 19 điểm, Phàm Căn, hơn 2%; câu dẫn hạt giống |
| MQ-P-06 | ví dụ 3 (lời phán thuận: Chính Ấn năm nay, vận Đinh Hợi vừa vào) |
| MQ-P-08 | đèn đứng yên; Thầy tách đèn khỏi điểm; nhà trọ Mái Rêu (CUT-008) |
| BR-NT-01 … 03 | ghế khách học; Hứa Khang; đêm Vân Cốc gõ cửa: hệ số × 1,41 |
| MQ-1-05 | hành thấp nhất Mộc 6,1 là nhàn thần → «lá số không đòi nó, lá số đòi Thủy» |
| MQ-1-14 | trang khách học |
| BR-NT-04 | Tế tửu: ba lớp thuốc cho cách bại; chỗ cứu Ấn; trục mạnh Thực 100 → Nghệ đạo |
| BR-NT-05 … 07 | đường đá; anh Đạt học mộc; đèn sáng; chữ «K.» là Tử Bình Khải |
| `Y*` | 2027 Đinh Mùi **Đại hung 4**, tuổi Tuất phạm **Hình + Phá** — năm hạn rất gần (năm sau năm hiện tại); MQ-3-07 biến thể A ghép Hình (kiện ở Hội Đồng) và Phá (tan việc) |
| MQ-4-10 | Phán quan: «lấy cái không nên lấy», «lời vô nghĩa», nghiệp chướng tổng — đọc như chỗ dễ trượt chân |
| MQ-E-03 | câu nhánh NT + câu dẫn «đó là cái cây» |

### A.4 Đi trọn với TT-1, DK-1, MAU-B (các điểm khác biệt)

| Lá số | Điểm khác biệt chính |
|---|---|
| TT-1 | đèn sáng ngay (CUT-006); BR-TT-03 vận nghịch cách 丙午 (62 tuổi, 2037), 丁未 (72, 2047); BR-TT-06 chẩn đoán «Thương Quan Kiến Quan, Kiêu Đoạt Thực»; `Y*` 2030 Canh Tuất phạm **Xung** (tuổi Thìn); Khổng tiên sinh (phụ lục A) nói «Tân Kim sinh tháng Hợi, tự hao mình cho mùa… Thương Quan cách thành, khung còn nguyên» |
| DK-1 | nhánh DK dù `quality` là 成格; Phương sĩ trên mái (CUT-009); bệnh tiềm ẩn Quan Sát; đại vận Hung 壬辰 (65), 癸巳 (75), 甲午 (85); `Y*` 2036 Bính Thìn — can Bính là Thất Sát, lại phạm **Xung** (tuổi Tuất) → câu riêng của Phương sĩ ở MQ-3-08 |
| MAU-B | nhánh NT (败格) dù điểm 48 không thấp; lời phán ví dụ 2 («phải gồng mười năm»); hành thấp nhất Kim là Hỷ → việc phụ Manh Phái; `Y*` 2027 Đinh Mùi Hung 10 — tuổi Hợi gặp năm Mùi là **tam hợp**, không phạm; A Mậu đọc «Khí Uất» |

---

## B. Kịch bản biến thể bổ sung

### B.1 MQ-1-05 «Hành thiếu» — bốn hành còn lại

```
[CẢNH MQ-1-05.Mộc · Thư Lâu Lâm · giờ Mão · sương rừng đào]
THẦY TỬ BÌNH: (trước khi đi) Mộc. Ra Thư Lâu Lâm. Đừng bẻ cành sống.
THỦ THƯ THƯ LÂU: (đang tưới hàng đào già trước cổng) Người trên Quán lên lấy chồi đào phải không? Mỗi năm có vài người. Tưới giúp ta hết hàng này đã.
(Mini-game tưới: 12 gốc đào, gốc nào đất khô thì tưới hai lần; tưới thừa thì nước đọng — tưới lại gốc khác.)
THỦ THƯ THƯ LÂU: (khi xong, chỉ một cành nhỏ gãy vì gió đêm qua) Cành này tự gãy. Lấy chồi trên cành này. Cây không mất gì.
THỦ THƯ THƯ LÂU: Người Dụng Mộc hay sốt ruột muốn lớn nhanh. Đào trăm năm mới già được như hàng này.
```

```
[CẢNH MQ-1-05.Hỏa · Đẩu Mẫu Điện, Trích Thiên Đỉnh · giờ Tuất · gió lạnh]
ÔNG GIỮ ĐÈN: Bảy ngọn Bắc Đẩu. Châu dầu cho đủ bảy, ta cho mồi lửa mang về.
(Mini-game châu dầu bảy đèn; đèn thứ bảy ở chỗ gió lùa, phải che tay.)
ÔNG GIỮ ĐÈN: (trao đèn mồi trong lồng giấy) Mồi này đi bộ về tới Sơn Môn. Không ngự kiếm — gió trên cao tắt lửa. Mưa thì che bằng áo.
(Đường về: nếu đèn tắt, quay lại xin mồi khác — không phạt; Thanh Phong (nếu đi cùng) nói «Lửa tắt thì mồi lại. Mình tắt ba lần hồi năm ngoái.»)
THẦY TỬ BÌNH: (khi đặt đèn) Hỏa giữ được qua một đoạn đường dài. Người Dụng Hỏa hay bùng rồi tắt. Giữ một ngọn nhỏ lâu thì hơn.
```

```
[CẢNH MQ-1-05.Thổ · Sân la bàn Phong Thủy Viên · giờ Ngọ]
THẦY SẢNH DƯƠNG TRẠCH: La bàn sân này lệch từ trận gió tháng trước. Cân lại cho đúng Bắc thật.
(Mini-game: xoay đĩa la bàn đá theo bóng gậy chính Ngọ — đúng khi kim trùng vạch Tý.)
THẦY SẢNH DƯƠNG TRẠCH: Đúng rồi. Ô Trung cung có đất ngũ sắc người xưa đổ khi dựng sân. Lấy một nắm. Đất ở giữa thì không thuộc hướng nào, nên hợp với mọi hướng.
THẦY TỬ BÌNH: (khi đặt đất) Thổ là cái đứng yên cho người khác đứng lên. Người Dụng Thổ hay quên mình cũng cần đứng.
```

```
[CẢNH MQ-1-05.Kim · Đường đá Manh Phái Cốc · giờ Thân · tiếng gậy gõ]
THẦY MANH PHÁI: (gậy gõ đá) Người trên Quán. Dắt ta xuống hết đường đá. Ta biết đường, ta muốn có người đi cạnh.
(Mini-game dẫn đường: người chơi đi trước nửa bước, chọn chỗ đặt chân; gậy ông gõ theo nhịp người chơi. Đi nhanh quá thì ông dừng.)
THẦY MANH PHÁI: (cuối đường, tháo một chiếc lục lạc đồng cũ khỏi gậy) Cầm. Nghe tiếng nó là biết mình đi nhanh hay chậm. Người Dụng Kim cần biết lúc nào dừng.
```

### B.2 MQ-2-03 «Căn nhà của mình» — quy tắc chung và hai gian còn lại

**Quy tắc chấm ô la bàn khi đặt đồ** (mọi mệnh quái):

| Màu ô | Điều kiện |
|---|---|
| xanh | phương thuộc 4 cát của mệnh quái (`computeZhai.auspicious`) **và** không phải Ngũ Hoàng / Nhị Hắc của niên bàn **và** không phải phương Thái Tuế năm |
| vàng | thỏa một trong hai: cát bát trạch **hoặc** không hung niên bàn |
| đỏ | **động thổ** (đào, xây, dời nền) ở phương Thái Tuế năm hoặc phương Ngũ Hoàng niên bàn |
| (không tô) | đồ không phải động thổ đặt ở phương hung: chỉ hiện chú thích, không đỏ |

```
[CẢNH MQ-2-03.Đ · MAU-A chọn gian cửa Đông]
THẦY SẢNH: Cửa Đông. Đông là Thiên Y của người Khảm — lành. Niên bàn năm nay Đông là Bát Bạch — cũng lành. Vận bàn hai mươi năm thì Đông là Thất Xích, khí không tốt.
THẦY SẢNH: Hai sách khen, một sách chê. Con làm gì?
> ① «Giữ cửa, không sửa cửa trong vận này, giữ cửa sạch, thông gió.» → THẦY SẢNH: «Phải. Khen thì đi qua, chê thì đừng động.»
> ② «Năm nay tốt thì sửa cửa luôn.» → THẦY SẢNH: «Năm nay tốt, hai mươi năm thì không. Sửa cửa là việc của hai mươi năm.»
```

```
[CẢNH MQ-2-03.TB · MAU-A chọn gian cửa Tây Bắc]
THẦY SẢNH: Cửa Tây Bắc. Với người Khảm là Lục Sát — không lành. Nhưng vận bàn Vận 9 thì Tây Bắc là Nhất Bạch, sinh khí tương lai — sao đang lên.
THẦY SẢNH: Bát trạch chê, huyền không khen. Con thấy chưa: không có cửa nào hai sách cùng chê, cũng ít cửa nào hai sách cùng khen.
THẦY SẢNH: Cửa có sẵn thì cứ đi. Giường, bàn ngồi con đặt theo bốn hướng lành của mình. Cái cửa không quyết định cả đời.
```

### B.3 MQ-2-09 «An Thái Tuế» — bốn việc giúp người phạm (năm Bính Ngọ)

```
[CẢNH MQ-2-09.TP · Thanh Phong (Mão, Phá) · ôn bài]
THANH PHONG: Phạm Phá là hay đổ vỡ hợp tác. Mình với bạn ôn bài mà vỡ thì kỳ lắm. (cười) Hỏi mình câu khó nhất đi.
(Mini-game hỏi đáp 5 câu về lập trụ.)
THANH PHONG: Đúng bốn. Phạm Phá mà còn đúng bốn. Ông Thái Tuế chắc thương mình.
```

```
[CẢNH MQ-2-09.LĐ · ông lái đò Bến Mây (Sửu, Hại) · tấm ván mục]
ÔNG LÁI ĐÒ: Người ta nói Hại là tiểu nhân ám toán. Tui có ai ám toán đâu. Chỉ có tấm ván này mục, đứng lên là lún.
(Thay ván: mini-game mộc nhỏ. Đây là pháp ⑦ «cẩn trọng» — tránh tai nạn đời thường.)
ÔNG LÁI ĐÒ: Hết mục. Tiểu nhân nào thì tui chịu, ván thì không chịu nữa.
```

```
[CẢNH MQ-2-09.CT · cô Tơ dệt lụa (Tý, Xung) · khung cửi góc Nam]
CÔ TƠ: Khung cửi tui kê góc Nam. Người ta nói năm nay đừng động thổ phía Nam. Mà khung cửi kê đó ba năm rồi, có động gì đâu.
NGƯỜI CHƠI: (lựa chọn) ① «Đặt khung cửi không phải động thổ. Để yên.» → CÔ TƠ: «Vậy tui khỏi dời?» → đúng ② «Dời sang Đông.» → CÔ TƠ: «Dời thì phải đục chân tường gắn lại.» → NGƯỜI CHƠI: «…Vậy đừng dời. Đục tường mới là động thổ.» (dạy: phân biệt đặt đồ với động thổ)
```

```
[CẢNH MQ-2-09.CB · cậu bé Bờm (Ngọ, Trị + Hình) · đếm hơi thở]
CẬU BỜM: Mẹ con nói năm nay năm tuổi của con, con hay đánh nhau là tại ông Thái Tuế.
NGƯỜI CHƠI: Năm tuổi là năm nhiều đổi. Đánh nhau là tại tay. Mình chơi trò này: khi muốn đánh, đếm mười hơi.
(Mini-game đếm hơi thở với cậu bé.)
CẬU BỜM: (hơi thứ mười) …Hết muốn đánh rồi. Mà còn muốn mắng.
NGƯỜI CHƠI: Đếm thêm mười hơi.
```

### B.4 MQ-2-11 «Việc hợp tay» — bốn trục còn lại

```
[CẢNH MQ-2-11.Tài · quầy chung ở chợ]
CHỊ MẬN: Gom dược liệu ba vùng về bán chung? Em có chỗ, bác Thủy có thuyền, người trên Quán có mắt nhìn hàng.
(Mini-game: chọn mua ở 3 vùng, chở về, bán; chia lời ba phần đều được đánh dấu là «hợp».)
TRƯỞNG SẢNH TƯỢNG PHÁP: (thư) «Tài về chủ vị là có phúc. Tài về ba chủ vị là có ba phúc.»
```

```
[CẢNH MQ-2-11.Quan · hòa giải bến đò]
ÔNG LÁI ĐÒ: Xóm Lò Gạch giành bến sáng, xóm Ngõ Đậu giành bến chiều. Cãi nhau ba tháng.
TRƯỞNG XÓM LÒ GẠCH: Bến của tổ tiên tụi tui.
(Mini-game hòa giải: nghe hai bên, đề xuất 3 điều; điều nào cả hai gật thì ghi vào hương ước nhỏ.)
NGƯỜI CHƠI: (gợi ý điều 1) Sáng chẵn bên này, sáng lẻ bên kia. (điều 2) Ai sửa bến thì được ưu tiên tháng sau. (điều 3) Cãi nhau thì ra Bàn Thầy uống trà trước.
TRƯỞNG XÓM: (đọc) …Điều ba lạ mà được.
```

```
[CẢNH MQ-2-11.Ấn · dạy ba đứa trẻ phố Thợ]
BÉ LÚA / CẬU BỜM / CON ANH LÝ THUẬN: (ngồi thành hàng) …Trăng rơi xuống hồ, ai vớt lên?
NGƯỜI CHƠI: Mỗi câu hát là một chữ. Tý, Sửu, Dần…
(Mini-game: ba buổi; cuối buổi ba, ba đứa tự lập trụ năm của mình.)
CẬU BỜM: Con Giáp Ngọ! Ngựa gỗ!
NGƯỜI CHƠI: Ngựa lửa. Giáp là cây, Ngọ là lửa.
CẬU BỜM: Ngựa cây cháy!
```

```
[CẢNH MQ-2-11.Thực · rèn chuông gió với anh Lý Thuận]
ANH LÝ THUẬN: Chuông gió đồng cho xóm Ngõ Đậu hả? (nếu MQ-2-04 xong: «Nhà ông Tư Đậu treo một cái rồi, ổng khoe khắp xóm.») Mỗi nhà một cái.
(Mini-game rèn hai người: một người giữ phôi, một người gõ; nhịp lệch thì chuông kêu đục.)
ANH LÝ THUẬN: (gõ thử) Kêu trong. Tay nghề hai người thì kêu trong hơn một người.
```

### B.5 MQ-3-07 «Bạn cũ quay lưng» — ba loại phạm đơn lẻ

```
[CẢNH MQ-3-07.Trị · năm tuổi (vd lá số tuổi Thìn với Y* năm Thìn)]
NGƯỜI BẠN (mộng): Năm nay năm tuổi của cậu / cô. Tôi rút vốn. Không phải giận. Tôi sợ dính.
> Giữ: «Anh rút cũng được. Năm sau quay lại thì quay lại.» · Vỡ: «Sợ thì đi luôn đi.»
```

```
[CẢNH MQ-3-07.Xung · đối diện (TT-1 Y* 2030, DK-1 Y* 2036)]
(Chợ mộng: người bạn chia đôi quầy chung giữa đám đông, kéo vạch phấn.)
NGƯỜI BẠN (mộng): Từ hôm nay bên này của tôi, bên kia của cậu / cô. Năm nay hai ta xung nhau.
> Giữ: «Vạch phấn thì vạch. Khách nào hỏi bên kia, tôi chỉ sang anh.» · Vỡ: «Bên tôi bán rẻ hơn. Để coi khách sang bên nào.»
(Phương sĩ — chỉ khi nhánh DK — hiện ở rìa đám đông: «Nhường.»)
```

```
[CẢNH MQ-3-07.Hại · tiểu nhân ám toán]
NGƯỜI LẠ (áo xám): (nói nhỏ với người bạn) Người kia năm nay hại cậu đấy. (đi)
NGƯỜI BẠN (mộng): (lạnh nhạt cả ngày, không nói lý do)
> Giữ: «Anh nghe ai nói gì về tôi? Hỏi thẳng tôi.» · Vỡ: (đi nói xấu lại người bạn với người khác)
```

### B.6 Biến thể iOS (không đoán vận)

```
[CẢNH MQ-1-06.iOS · Bia Tổ Sư (thay Vận Mệnh Các)]
(Hành lang Vận Mệnh Các trên iOS là một sân đá có bảy tấm bia giáo huấn của Tổ Sư về thời gian.)
THẦY TỬ BÌNH: Bảy tấm bia. Tổ Sư viết cho người đi đường dài. Đọc hết rồi chọn một tấm mang theo.
BIA 1: «Mười năm là một mùa của người. Đừng hỏi mùa này tốt hay xấu. Hỏi mùa này mình gieo gì.»
BIA 2: «Người sợ mưa không phải người biết mùa.»
BIA 3: «Cái gì đến nhanh thì đi nhanh. Cái gì gieo lâu thì ăn lâu.»
BIA 4: «Đừng đứng lâu trước một cửa đóng. Cửa khác đang mở.»
BIA 5: «Năm khó thì giữ một việc nhỏ.»
BIA 6: «Người đi trước để lại bậc. Người đi sau để lại đèn.»
BIA 7: «Chữ không ai viết thay được.»
(Người chơi chọn một tấm; câu đó hiện ở trang đầu Sổ Mệnh.)
```

```
[CẢNH MQ-1-07.iOS · Đèn cầu an chung (thay Thái Tuế Điện)]
THANH PHONG: Mình hay lo vặt. Thầy bảo thắp một ngọn đèn cho người mình lo. Bạn thắp cho mình nha.
(Mini-game châm đèn như bản thường; không bảng đồng 12 tuổi, không nói phạm hay không phạm.)
THANH PHONG: Đèn sáng thì mình lo ít hơn. Không phải đèn có phép. Là có người thắp cho mình.
```

### B.7 Lời phán mở đầu cho TT-1 và DK-1 (bổ sung ví dụ khuôn §6.2)

```
[CẢNH MQ-P-06.D · TT-1]
KHỔNG TIÊN SINH: Tân Kim sinh tháng Hợi, tự hao mình cho mùa. Thân như ngọn đèn trước gió, Thủy hai mươi bảy phần. Thương Quan cách thành, khung còn nguyên.
KHỔNG TIÊN SINH: Năm nay Bính Ngọ, Chính Quan lâm năm. Năm này việc công, người trên không lên không xuống.
KHỔNG TIÊN SINH: Năm mươi hai tuổi đổi vận Ất Tỵ, bình hòa mười năm.
KHỔNG TIÊN SINH: (ngẩng lên) Ta nói sai câu nào chưa?
```

```
[CẢNH MQ-P-06.E · DK-1]
KHỔNG TIÊN SINH: Canh Kim sinh tháng Dậu, đúng mùa của mình. Kim chiếm sáu mươi mốt phần cục, dày mà khó uốn. Cách lạ: Chuyên Vượng Kim, không đọc theo lối thường.
KHỔNG TIÊN SINH: Năm nay Bính Ngọ, Thất Sát lâm năm. Năm này việc công, người trên hay vấp.
KHỔNG TIÊN SINH: Vận Tân Mão còn tám năm, êm.
KHỔNG TIÊN SINH: (ngẩng lên) Ta nói sai câu nào chưa?
```

Ghi chú: với TT-1, Thân quá nhược nhưng hành cao nhất là Thủy (hành Thực Thương của Tân Kim) — khuôn bảng B dòng «Thân quá nhược» dùng hành cao nhất **bất kể** là hành gì, đúng như engine. Với DK-1, đại vận 辛卯 bắt đầu 2024 nên «còn tám năm» (2026 → hết 2033).

### B.8 Kết của vĩ thanh theo hai cờ phụ (thêm vào MQ-E-06)

```
[CẢNH MQ-E-06.Khiêm · F_KHIEM = cuu]
LÊ KHIÊM: (bước ra từ hàng thư sinh) Khoa Mậu Thân tôi đỗ. Tên tôi khắc ở bia Văn Miếu, dòng cuối. (nhìn Thiên Bảng) Tên người trên Quán khắc ở đây. Hai bảng khác nhau.
LÊ KHIÊM: (nếu F_KHIEM_HOA) Nhuận đỗ khoa trước. Hôm khắc tên tôi, nó tới xem. Nó mang theo cái bút gãy — tôi nhờ nó giữ. Nó bảo để làm chặn giấy.
```

```
[CẢNH MQ-E-06.LoBan · F_LOBAN = quay_ve]
(Dưới chân Thiên Bảng, một ông già áo nâu thợ đứng ở rìa đám đông, tay cầm một cái xẻng nhỏ dính đất.)
ÔNG KHA: (đứng cạnh) Thầy tôi đào được hai trăm mười ba nhà rồi. Còn một trăm lẻ bảy. Có nhà đóng cửa không cho đào. Thầy ngồi trước cửa đến khi người ta mở.
CÔNG THÂU NGHIỆT: (không nhìn Thiên Bảng) Ta không có tên trên đó. Ta không cần. Ta có danh sách nhà.
```

---

## C. Kiểm thử chấp nhận theo nhiệm vụ

Mỗi dòng là một ca kiểm tối thiểu cho máy nhiệm vụ (chạy tự động với lá số mẫu ghi ở cột «Dữ liệu»). Kiểm nội dung an toàn chung ở các bảng cuối từng phần.

| Nhiệm vụ | Dữ liệu | Thao tác | Kết quả mong đợi |
|---|---|---|---|
| MQ-P-01 | MAU-A; một lần «không rõ giờ» | nhập form | `F_HOUR_UNSURE` đặt khi chọn ③; Phúc Khí +10 |
| MQ-P-02 | MAU-A, TT-1 | chạy lễ | MAU-A thấy cảnh 02.4a; TT-1 thấy 02.4b |
| MQ-P-03 | MAU-A | chạm dòng âm lớn nhất | dòng «Tổ hợp hung … −10» được chấp nhận |
| MQ-P-04 | 5 lá số | mở Tàng Y Các | bộ phẩm phục đúng `yong.primary` (Thủy cho cả năm) |
| MQ-P-05 | — | ba lựa chọn | đều tới bia tám chữ |
| MQ-P-06 | MAU-A, MAU-B, NT-1, TT-1, DK-1 | chạy khuôn | đúng §6.2 và B.7 |
| MQ-P-07 | MAU-A | Trà Thất | ba thanh tâm ma: Tham 29, Sân 37, Si 27 |
| MQ-P-08 | 5 lá số | rẽ nhánh | DC, NT, TT, NT, DK |
| MQ-1-01 | `F_HOUR_UNSURE` | sửa giờ | cho sửa đúng một lần |
| MQ-1-02 | khách anh Đạt | giải 2 bước | khóa trụ 戊辰 乙卯 壬戌 癸卯; vượng Mộc, yếu Hỏa |
| MQ-1-03 | khách anh Lý Thuận | chọn Hỏa | `gradeYong` = 1 |
| MQ-1-04 | khách ông Hai Cương | chọn 2031 | `gradeTiming` = 1 |
| MQ-1-05 | MAU-A, MAU-B, NT-1 | trả lời «thiếu gì» | đích luôn Thủy; MAU-B mở việc phụ Kim |
| MQ-1-06 | MAU-A | vào Các | cổng sáng 甲申; cổng dè chừng 丙戌 |
| MQ-1-07 | MAU-A; một lá số tuổi Thân | đèn | MAU-A phạm Trị + Hình; tuổi Thân không phạm, thắp đèn cho Thanh Phong |
| MQ-1-08 | chị Mận | nghe phán | 2026 Thất Sát Cát; 2027 Chính Quan Đại cát |
| MQ-1-09 | Nguyên Khí thấp | leo | hồi ở Đá Ngồi |
| MQ-1-10 | `F_LOW_SCORE` | vào am | lời mở «Mệnh do ta tạo» |
| MQ-1-11 | — | giữ túi tiền | DEED-A02 −3 chỉ khi chọn giữ |
| MQ-1-12 | MAU-A | Mệnh Đồ | gọi `gaimenhPlan(R, {year: 2026})`; tầng Không gian «đương lệnh Cửu Tử» |
| MQ-1-13 | — | đọc cáo thị | cáo thị ghi sai Thân, Dậu, Dần; thiếu Sửu |
| MQ-1-14 | Đạo Hạnh < ngưỡng | vào lễ | bị chặn, chỉ 3 nguồn Đạo Hạnh |
| MQ-2-01 | Dụng Thủy | bàn đá | cổng Yên Tử được gợi ý |
| MQ-2-02 | chị Mận | Soi | `personalTaSui('申','午').offends = false` |
| MQ-2-03 | MAU-A gian cửa Nam | đào phía Nam | ô đỏ; đặt giường phía Bắc: ô vàng |
| MQ-2-04 | — | Soi một nguồn | không mở pha Nói |
| MQ-2-05 | họ Nguyễn | «Hải Thành» | ngũ cách 8 / 17 / 17 / 7 / 23 |
| MQ-2-06 | — | tìm ngày sinh Phạm Nhuận | không có |
| MQ-2-07 | tuổi Ngọ | chọn ngày Tý | lịch quan hỏi lại; không chặn |
| MQ-2-08 | năm chạy 2026 | Soi 2026-12-10 | Trực Phá, xung Tý, điểm 5 |
| MQ-2-09 | MAU-A | quên dầu 1 ngày | đếm lại từ ngày thắp lại |
| MQ-2-10 | bà Lựu | Soi | lưu niên 2026 Đại hung 6 hiện thật |
| MQ-2-11 | MAU-A | — | biến thể Đồng đạo |
| MQ-2-12 | anh Bảy Sơn | Soi tổ hợp | không có «Thương Quan Kiến Quan» |
| MQ-2-13 | bác Thủy | Soi | `han-nuan` NOÃN; nạp âm Đại Khê Thủy |
| MQ-2-14 | — | tra kệ | mục `LOST_LIXUZHONG` |
| MQ-2-15 | ông Cả Lộc | Tử Vi hai giờ | Mệnh 午 Thiên Cơ / Mệnh 卯 Cự Môn + Thiên Cơ |
| MQ-2-16 | 2 đạo thống | vào | bị chặn tới khi đủ 3 |
| MQ-2-17 | — | mua hết cá | nhiệm vụ chưa xong tới khi chọn ① / ③ |
| MQ-2-18 | 4 án | vào | chưa mở (cần 5) |
| MQ-2-19 | — | Thư Lâu sau giờ Dậu | kho đóng |
| MQ-2-20 | 9 án | vòng 1–3 đúng | Lòng dân ≥ 70% |
| MQ-2-20 | 5 án, kết tội 2 lần | — | Lòng dân < 70% → hoãn, giữ bằng chứng |
| MQ-2-21 | — | — | `rings[2]` dừng; không bộ đếm thời gian |
| MQ-2-22 | 5 lá số | năm hạn | đúng bảng A.1 |
| MQ-3-01 | MAU-A | ngẩng nhìn | chữ 丙辰 sáng (phân pha riêng) |
| MQ-3-03 | MAU-A | vào mộng | lịch «Giáp 34 · 丙辰»; Thái Tuế Tân Á |
| MQ-3-04 | MAU-A | đào phía Bắc | `F_MONG_SPACE = vo`, không trừ gì |
| MQ-3-05 | — | giữ 2/3 | `giu` |
| MQ-3-06 | MAU-A | — | ngày 2036-03-10 Bính Tý, Trực Thu, điểm 7 |
| MQ-3-07 | NT-1 | — | biến thể A Hình + Phá |
| MQ-3-08 | lá số Kỵ Hỏa (Lê Khiêm) | — | biến thể Hỏa |
| MQ-3-09 | 3 tầng giữ | — | Đạo Hạnh +50 +30 |
| MQ-3-10 | — | bỏ qua khuyên khám | bước 6 bị khóa |
| MQ-3-11 | `F_TALO_OPTIN = false` | chọn Nhận | lựa chọn xám |
| MQ-3-12 | MAU-A | — | năm vàng 2031 |
| MQ-3-13 | `F_TALO = dang` | — | câu Khổng riêng cho người cầm bài |
| MQ-4-01 | — | ba lựa chọn | `F_DINH_KIEN` đặt; không phạt |
| MQ-4-02 | MAU-A | A Mậu xem | «Dương Hư», không tên vị thuốc |
| MQ-4-03 | — | — | không lựa chọn dùng bùa |
| MQ-4-04 | — | mở cửa | cần thước thợ |
| MQ-4-05 | cảnh giới 3 | vào | bị chặn |
| MQ-4-06 | `F_TALO = dang` | — | mở TL-10 |
| MQ-4-07 | `F_CANH_QUEN = uong` | — | không mất cờ, không mất tiến trình |
| MQ-4-08 | phòng vắng | thả đèn | Địa Tạng sứ giả cầm dây thứ hai; hồn khách lên cầu Bình |
| MQ-4-08 | cùng cặp lần 2 trong 7 ngày | kéo | không ghi công |
| MQ-4-09 | `F_GIAO_LO`, `F_CASE_DP6` | — | hai khung đầu đúng ưu tiên |
| MQ-4-10 | MAU-B | — | đọc «Thâu đạo», «nghiệp chướng tổng» |
| MQ-4-11 | — | gọi nhẹ tên việc | không qua được |
| MQ-4-12 | chọn ③ | — | `F_LOBAN = quay_ve` |
| MQ-4-13 | — | — | `rings[2]` quay; vết rạn còn |
| MQ-E-01 | 2 đạo thống + `hoi_dau` | — | Quy nhất đạt |
| MQ-E-02 | không gia trì bay | — | cưỡi hạc |
| MQ-E-03 | MAU-A | — | bốn trụ trùng MQ-P-02 |
| MQ-E-04 | năm chạy 2027 | — | lời 2 «Đinh Mùi, Chính Quan» |
| MQ-E-05 | bot 100 công / ngày | — | chỉ 15 tính |
| MQ-E-06 | không bật công khai căn cốt | — | cột Tiên Thiên ẩn |
| MQ-E-07 | 2027 | — | Mâu Bính đại tướng quân; phạm Mùi, Sửu, Tuất, Tý |
| BR-TT-02 | — | — | không có đường đưa ngày sinh |
| BR-TT-03 | TT-1 | — | vận nghịch cách 丙午, 丁未 |
| BR-TT-05 | bé Lúa | — | năm 2027 nói rõ «năm tuổi, phạm Trị» |
| BR-DC-01 | MAU-A | — | Bản đồ dược chỉ có Thực, Tài |
| BR-DC-06 | báo sai một tối | — | thêm một ngày |
| BR-NT-04 | đứt 3 ngày | — | đếm tiếp |
| BR-NT-06 | anh Đạt | chọn Kim | Thầy giải «tòng»; `gradeYong` = 0 |
| BR-DK-03 | DK-1 | — | bệnh tiềm ẩn đúng câu engine |
| BR-DK-05 | chọn Giữ | — | Nguyên Khí gần cạn, không phạt khác |
| TL-02 | — | danh sách hộ | không có nhà người chơi khác |
| TL-03 | chôn Trà Thất, thông rãnh ở 02.4 | — | biến thể «ngã nhẹ» |
| TL-05 | `NO_AM ≥ 180` | hỏi Thầy AI | câu kịch bản duy nhất; câu hỏi được lưu |
| TL-08 | `NO_AM = 0` | — | không hiện số |
| TL-12 | lạy đủ 88 nhịp, chưa đào | — | pháp chưa hoàn thành |
| TL-13 | `NO_AM = 0`, còn một hộ chưa nói thật | — | chưa Hồi Đầu |
