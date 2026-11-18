# 05 — Tiên phủ Art Deco (U Thiên): nghiên cứu kiến trúc 1925–1935

Nguyên mẫu chính: **Villa Cavrois** (Robert Mallet-Stevens, Croix, 1929–1932).
Đối chiếu: Villa Noailles (Hyères), Villa Empain (Brussels), Casa de Serralves (Porto), Eltham Palace (London),
Raadhuis Hilversum (Dudok, nguồn cảm hứng gạch vàng của Cavrois), rạp Grand Rex / Radio City / Odeon, Piscine Molitor.
Lầu 10 tầng đối chiếu: Chrysler Building, Empire State Building, luật setback New York 1916, tháp Hilversum, tháp Pavillon du
Tourisme 1925.

Quy ước trong file:
- **[đo]** = số lấy thẳng từ nguồn.
- **[suy]** = số suy ra; cách suy ghi ngay cạnh.
- **[chưa có]** = không tìm được nguồn; không điền số.
- Mã hex là **ước lượng màu** để dựng, không phải số đo phổ màu.
- Khung game = "khung hiện tại" trong `list-5-artdeco.txt`.

Ghi chú về quá trình tra cứu: hạn mức WebSearch của lượt này đã hết giữa chừng. Phần còn lại dùng WebFetch vào trang đã biết.
Vì vậy một số công trình phụ (đình) chỉ có nguồn về nguyên mẫu, không có bản vẽ đo.

---

## Phần chung của phong cách

### 1. Quy tắc tỉ lệ chung

Art Deco không có "thức cột" như cổ điển. Ngữ pháp tỉ lệ đến từ ba nguồn: luật setback New York 1916, mô-đun gạch
nằm ngang (Dudok → Mallet-Stevens), và bố cục đối xứng kiểu lâu đài Pháp.

**1a. Phong bao setback (Zoning Resolution New York 1916) — dùng cho tháp**

| Quy tắc | Giá trị | Nguồn |
|---|---|---|
| Số vùng chiều cao | 5 vùng, hệ số 1 · 1,25 · 1,5 · 2 · 2,5 × bề rộng phố | [đo] buildingtheskyline (Barr 2019, trích Final Report 1916) |
| Vùng 2× (phố rộng 60 ft) | Lên thẳng 120 ft (36,6 m ≈ 10 tầng) rồi mới phải lùi | [đo] buildingtheskyline |
| Dốc phong bao vùng 2× | Lên 4 ft cho mỗi 2 ft lùi vào (dốc 2 : 1) | [đo] buildingtheskyline |
| Tháp không giới hạn cao | Khi diện tích tháp ≤ 25 % diện tích lô | [đo] Wikipedia 1916 Zoning Resolution, buildingtheskyline |
| Hệ quả hình khối | Tháp "bánh cưới" bậc thang Art Deco 1920–30 là "hệ quả trực tiếp" của luật | [đo] Wikipedia; Hugh Ferriss phổ biến bằng nghiên cứu khối 1922, sách *The Metropolis of Tomorrow* 1929 |

Nguồn Grokipedia nói dốc 1 : 1; nguồn Barr nói 2 : 1 cho vùng 2×. Chọn **2 : 1** vì Barr trích báo cáo gốc 1916.

**1b. Tỉ lệ khối tháp Art Deco thật**

| Công trình | Cao mái | Số tầng | Sàn-tới-sàn trung bình | Đế (tầng) | Các tầng lùi | Nguồn |
|---|---|---|---|---|---|---|
| Empire State | 381 m (tầng trên cùng 373,1 m) | 102 | 373,1 / 102 ≈ 3,66 m [suy] | 5 tầng phủ kín lô | Lùi 18 m (60 ft) mọi phía trên tầng 5; lùi tiếp ở tầng 21, 25, 30, 72, 81, 85 | Wikipedia |
| Chrysler | 282 m (tầng trên 274 m), đỉnh kim 319 m | 77 | 274 / 77 ≈ 3,56 m [suy] | 16 tầng | Lùi ở tầng 16, 18, 23, 28, 31 | Wikipedia |
| Raadhuis Hilversum (tháp) | 48 m (một nguồn ghi 47 m) | — | — | Tháp đứng riêng nổi trên khối thấp | — | dudok.org, architectuur.org, actuart |
| Pavillon du Tourisme 1925 | 35 m (nguồn khác: 36 m) | — | — | Gara ở chân tháp | 3 "cánh buồm" ngang ở chân, 3 ở đỉnh làm cổ; tháp chuông vuông 5 m mang đồng hồ | worldfairs, dezeen, bybeton |

Rút ra:
- Sàn-tới-sàn tháp Art Deco thật ≈ **3,6–3,7 m** [suy]. Game dùng `FH = 5,0 m` vì cầu thang 29 bậc. Giữ 5,0 m được, nhưng
  phải "chia giả" mặt đứng: mỗi tầng game hiện 1 băng cửa sổ + 1 băng spandrel (tấm lửng), như Empire State có
  spandrel nhôm ngang giữa các cửa sổ.
- Mỗi lần lùi phải **đọc được từ xa**. Empire State lùi 18 m trên bề rộng 57 m, tức ≈ 32 % mỗi phía [suy].

**1c. Mô-đun gạch nằm ngang (Dudok → Cavrois)**

| Thông số | Giá trị | Nguồn |
|---|---|---|
| Gạch Hilversum ("Hilversums formaat") | 232 × 43 × 113 mm; khoảng 680 000 viên vàng | [đo] architectuur.org; tgooi.info ghi 23 × 11 × 4 cm |
| Mạch Hilversum | Mạch ngang "schaduwvoeg" vát tạo bóng, nhấn đường ngang | [đo] architectuur.org (kết quả tìm kiếm) |
| Cavrois: số khuôn gạch | 26 khuôn khác nhau (hãng Bonzel) để không phải cắt gạch ở góc, đường cong | [đo] Wikipedia EN/FR, WikiArquitectura |
| Cavrois: mạch | Mạch ngang lõm, sơn đen; mạch đứng bằng mặt, rất mảnh, màu vàng | [đo] WikiArquitectura; bài trên villacavrois.org |
| Cavrois: tổng mạch sơn | 200 km | [đo] một nguồn (kết quả tìm kiếm, villacavrois.org) |
| Cavrois: kích thước viên | [chưa có]. WikiArquitectura nói kích thước viên là đơn vị chuẩn cho toàn công trình nhưng không ghi số | — |
| Bước sọc ngang dùng trong game | ≈ 5 cm (43 mm gạch + ≈ 7–10 mm mạch) | [suy] lấy theo gạch Hilversum, vì Cavrois lấy Hilversum làm mẫu |

**1d. Bố cục**
- Cavrois: lõi giữa (tiền sảnh + hall-salon) và **hai cánh đối xứng** (cánh cha mẹ phía đông, cánh con cái + gia nhân phía tây),
  "theo truyền thống lâu đài Pháp" [đo, Wikipedia FR, Mérimée].
- Cavrois: cả khối nằm ngang, **chỉ một tháp** phá thế ngang [đo, nhiều nguồn].
- Empain: khối gần lập phương; tầng trên cùng là attic **lùi vào mọi phía** [đo, heritage.brussels].
- Eltham: mặt bằng **hình bướm**, hai cánh, hàng cột cong một tầng ở giữa [đo, English Heritage qua kết quả tìm kiếm].

### 2. Bảng màu và vật liệu chung

| Phần | Vật liệu thật | Nguyên mẫu | Hex ước lượng |
|---|---|---|---|
| Tường biệt thự | Gạch ốp vàng, mạch ngang đen | Cavrois | gạch `#d8c48c`, mạch `#1b1b1b` |
| Tường biệt thự (biến thể) | Vữa trát trắng / kem | Noailles, nhà phố Mallet-Stevens | `#ecebe4` |
| Tường biệt thự (biến thể) | Đá granite Baveno đánh bóng (hồng xám), kẹp đồng | Empain | `#cdb2a6` |
| Tường biệt thự (biến thể) | Vữa hồng ("Casa Cor de Rosa") | Serralves | `#e2b6aa` |
| Nẹp góc, khung kính | Đồng thau mạ vàng lá | Empain | `#c8a050` |
| Khung cửa sổ | Kim loại mảnh (thép) | Cavrois, Empain | `#2a2c2e` |
| Lan can sân thượng | Ống thép sơn trắng | Cavrois, Molitor ("lisse" trắng) | `#f2f2ee` |
| Mái | Sân thượng bê tông phẳng | Cavrois (Mérimée: "terrasse en béton") | `#b9b6ae` |
| Rạp: mặt tiền | Gạch men faience kem + đen | Odeon Kingstanding | kem `#e8dcc0`, đen `#141414` |
| Rạp: mặt tiền (biến thể) | Vitrolite đen + nẹp crôm | Daily Express | `#0d0d0f`, crôm `#d0d4d8` |
| Rạp: mặt tiền (biến thể) | Champagne / ngà / kem | Grand Rex (màu trả lại năm 2022) | `#e9dcc2` / `#f1ead8` / `#efe3c8` |
| Tháp | Đá vôi Indiana màu vàng nhạt; trụ thép crôm-niken; spandrel nhôm | Empire State | `#d9cfb8`, `#a8adb2` |
| Chóp tháp | Thép không gỉ Nirosta (18 % Cr, 8 % Ni) | Chrysler | `#c9ced3` |
| Đế tháp | Granite đen đánh bóng | Chrysler (Shastone), Empire State (mặt tiền tầng trệt) | `#161616` |
| Hồ bơi | Gạch men trắng | Noailles (POP) | `#f4f6f6`, nước `#5fa9c4` |
| Cabin hồ bơi | Cabin xanh, mặt tiền vàng "tango" | Molitor | `#2f5fa8`, `#e8b830` |

### 3. Sai lầm hay gặp phải tránh

1. **Một hộp dài + hàng cửa sổ đều.** Cavrois là nhiều khối lập phương cao thấp khác nhau. Nhìn từ hồ gương thấy villa
   "dâng lên qua nhiều cao độ" [villa-cavrois.fr, trang miroir d'eau]. Mỗi nhà phải có ít nhất 3 cao độ mái.
2. **Rải sunburst, zigzag khắp biệt thự.** Mặt ngoài Cavrois, Noailles gần như trơn. Trang trí nằm ở vật liệu: sọc gạch, kim
   loại, kính. Sunburst / zigzag / chevron thuộc về **tháp chọc trời, rạp, sảnh, cổng sắt**.
3. **Mái dốc lộ ra.** Không có. Kể cả Empain có mái đồng hai dốc thì cũng **giấu sau gờ mái** (corniche) [heritage.brussels].
4. **Tường trắng trơn cho mọi nhà.** Cavrois là gạch vàng sọc đen, không phải trát trắng. Chọn một vật liệu chủ đạo cho
   cả tiên phủ (gạch vàng Cavrois), biến thể dùng cho 1–2 công trình.
5. **Khung cửa dày như nhựa.** Khung thật là kim loại "rất mảnh" [WikiArquitectura]. Trong game khung ≤ 6 cm, màu tối.
6. **Tháp lùi bậc quá nông hoặc đều nhau.** Hiện code lùi 3 m → 2 m → 1,5 m mỗi phía; nhìn xa không thấy. Xem mục lầu.
7. **Thiếu chóp tháp.** Tháp Art Deco luôn kết bằng chóp: vòm bậc thang có cửa tam giác (Chrysler), cột buồm 4 bậc (Empire),
   tháp đồng hồ có cánh buồm (Pavillon du Tourisme).
8. **Lan can xây đặc màu tường.** Cavrois dùng lan can ống mảnh trắng, nhẹ và "trong".
9. **Lẫn với kiểu Quốc tế.** Không dựng nhà trên cột pilotis kiểu Le Corbusier; Cavrois đặt trên tầng hầm nửa chìm,
   tầng trệt nâng cao (rez-de-chaussée surélevé) [Mérimée].

### 4. Phân biệt với phong cách gần

| | Art Deco (biệt thự Mallet-Stevens) | Art Deco (chọc trời / rạp) | Streamline Moderne | Quốc tế (Le Corbusier) | Art Nouveau |
|---|---|---|---|---|---|
| Khối | Lập phương ghép, đối xứng, 1 tháp | Lùi bậc, đối xứng, chóp | Ngang, góc bo tròn | Hộp trên cột pilotis | Hữu cơ, uốn |
| Trang trí | Ít; sọc gạch, kim loại | Zigzag, chevron, sunburst, chữ nổi | Gần như không; "speed lines" | Không | Hoa lá, đường roi |
| Cửa sổ | Băng ngang, kính lớn, khung mảnh | Cột cửa dọc, spandrel | Cửa tròn (porthole), gạch kính | Băng ngang dài | Vòm uốn |
| Màu | Vàng gạch, trắng, kim loại | Kem, đen, bạc, vàng | Trắng / pastel | Trắng | Xanh rêu, mật ong |
| Nguồn | Mérimée, WikiArquitectura | Wikipedia Chrysler, Art Deco | Wikipedia Streamline Moderne | — | Wikipedia Art Deco (Grasset ↔ Guimard) |

Wikipedia Streamline Moderne: Streamline "lột bỏ trang trí của Art Deco" để lấy đường thuần khí động học; góc nhọn
nhường cho đường cong.

---

## lau10 — Thiên Kim Lâu (10 tầng)

### 1. Nguyên mẫu thật
- **Ngữ pháp setback**: Empire State Building (New York, 1931) và Chrysler Building (New York, 1930).
- **Tỉ lệ và vật liệu gần nhất cho tháp ~50 m**: tháp Raadhuis Hilversum (Dudok, 1928–1931), cao 48 m, gạch vàng. Đây là nguồn
  cảm hứng gạch của Cavrois [Wikipedia Villa Cavrois]. Hai cái cùng một gia đình vật liệu với tiên phủ.
- **Chóp kiểu tháp nhỏ**: tháp Pavillon du Tourisme của Mallet-Stevens (Expo 1925), 35–36 m, cánh buồm ngang + tháp đồng hồ.
- **Bề ngoài mặt cong, kính đen**: Daily Express Building London (1932) — góc bo tròn, Vitrolite đen, nẹp crôm.

### 2. Số đo thật

| Hạng mục | Empire State | Chrysler | Hilversum | Pavillon du Tourisme |
|---|---|---|---|---|
| Cao tới mái | 381 m [đo] | 282 m [đo] | 48 m [đo] (47 m một nguồn) | 35 m [đo] (36 m nguồn khác) |
| Cao đỉnh | 443,2 m [đo] | 319 m [đo] | — | — |
| Số tầng | 102 [đo] | 77 [đo] | — | — |
| Đế | 5 tầng phủ cả lô 129,2 × 57,0 m [đo] | Mặt Lexington 201 ft (61 m) [đo] | — | 4 trụ chịu lực tiết diện vài dm² [đo] |
| Lùi bậc | 18 m mọi phía trên tầng 5; tiếp ở 21, 25, 30, 72, 81, 85 [đo] | Tầng 16, 18, 23, 28, 31 [đo] | — | — |
| Chóp | Cột buồm thép rỗng ≈ 48 m trên tầng 86: 4 bậc chữ nhật + trụ tròn + chóp nón [đo] | 7 vòm bậc toả tia, cửa tam giác, thép Nirosta; kim 185 ft (nguồn khác 125 ft) [đo] | — | Tháp chuông vuông 5 m mang đồng hồ [đo] |
| Trang trí theo tầng | Chữ "Empire State" vàng trên cửa sổ tầng 5 [đo] | Tầng 31: gargoyle nắp két nước xe Chrysler; tầng 61: đại bàng; tầng 24–27 zigzag gạch xám-đen [đo] | — | 3 cánh buồm chân + 3 cánh cổ [đo] |

Mâu thuẫn: kim Chrysler 185 ft (Van Alen, *Architectural Forum* 1930) và 125 ft (giấy phép) — chọn 185 ft vì là mô tả của
kiến trúc sư sau khi xây.

### 3. Cấu trúc từ dưới lên (đề xuất cho Thiên Kim Lâu)
1. **Bệ**: bệ vuông 46 m, cao 1,5 m (giữ của code), viền granite đen, bậc lên ở 4 mặt chính giữa.
2. **Đế (tầng 1–3)**: khối vuông 34 m, góc **bo tròn** bán kính ≈ 3 m (Daily Express), mặt gạch vàng sọc đen. Lối vào giữa mỗi
   mặt có khung đồng vàng + diềm sunburst trên cửa (kiểu Eastern Columbia Building, Wikipedia Art Deco).
3. **Thân (tầng 4–6)**: lùi về 26 m. Cột gạch dọc liền 3 tầng, giữa các cột là cửa sổ + spandrel kim loại.
4. **Thân trên (tầng 7–8)**: lùi về 20 m. Bốn góc cắt bậc thụt (notched corners).
5. **Đầu tháp (tầng 9–10)**: lùi về 14 m. Cửa sổ dọc cao, nẹp crôm.
6. **Vọng đài + chóp**: 3 vòm bậc toả tia lồng nhau với cửa tam giác (Chrysler), thép không gỉ; trên cùng cột buồm 4 bậc
   (Empire State) và cột cờ.

### 4. Mặt bằng
- Vuông, đối xứng 4 mặt; thang trong lõi lệch theo `towerSpec` hiện có.
- Mỗi mặt chia 5 khoang (bay) ở đế, 5 khoang ở thân, 3 khoang ở đầu tháp — số khoang giảm theo bề rộng. [suy]
- Ràng buộc game: thang 29 bậc dài 8,4 m + rộng 2,0 m. Tầng 14 m còn lòng ≈ 14 − 2 × 0,6 tường − 0,4 = 12,4 m [suy], đủ chứa
  vế thang 8,4 m nhưng chiếu nghỉ hẹp. **Phải chạy lại `towerCollision` để kiểm** trước khi chốt.

### 5. Cấu kiện nhận diện (theo mức quan trọng)
1. Các bậc lùi **rõ ràng**, ít nhất 3 lần, mỗi lần ≥ 3 m mỗi phía.
2. Chóp tầng tầng toả tia bằng kim loại sáng, cửa tam giác.
3. Cột / trụ dọc liên tục chạy suốt nhiều tầng; spandrel tối nằm lùi giữa các trụ.
4. Đế góc bo tròn, gạch sọc ngang (nối với ngôn ngữ Cavrois).
5. Cột buồm / cột cờ trên đỉnh.
6. Diềm sunburst trên cửa vào, chữ nổi tên lầu "THIÊN KIM LÂU" bằng chữ kim loại vàng trên cửa chính (như chữ
   "Empire State" trên tầng 5).
7. Gargoyle / linh vật kim loại ở góc một tầng lùi (Chrysler tầng 31 và 61).

### 6. Vật liệu và màu

| Phần | Vật liệu | Hex |
|---|---|---|
| Bệ, chân đế | Granite đen đánh bóng | `#161616` |
| Đế, thân | Gạch vàng, mạch ngang đen | `#d8c48c` / `#1b1b1b` |
| Trụ dọc thân trên | Đá vôi vàng nhạt | `#d9cfb8` |
| Spandrel | Nhôm xám tối | `#5b6066` |
| Khung cửa | Thép / đồng | `#2a2c2e` / `#c8a050` |
| Chóp | Thép không gỉ | `#c9ced3` |
| Đèn chóp ban đêm | Đèn ẩn trong cửa tam giác (Chrysler có 120 ô cửa viền đèn) | phát sáng `#ffe6b0` |

### 7. Trang trí
- Zigzag gạch hai màu ở băng dưới mỗi bậc lùi (Chrysler tầng 24–27).
- Sunburst ở chóp và trên cửa.
- Chevron trên spandrel.
- Linh vật kim loại ở 4 góc bậc lùi thứ hai.

### 8. Kích thước đề xuất cho game

Khung hiện tại (code `styles.js`): cạnh 34 m (tầng 1–3) → 28 m (4–6) → 24 m (7–8) → 21 m (9–10), FH 5 m, bệ 1,5 m.

| Hạng mục | Hiện tại | Đề xuất | Lý do |
|---|---|---|---|
| Cạnh tầng 1–3 | 34 m | 34 m | Giữ; bệ 46 m chừa sân 6 m mỗi phía |
| Cạnh tầng 4–6 | 28 m | **26 m** | Lùi 4 m mỗi phía (12 % cạnh) |
| Cạnh tầng 7–8 | 24 m | **20 m** | Lùi 3 m mỗi phía |
| Cạnh tầng 9–10 | 21 m | **14 m** | Lùi 3 m mỗi phía; diện tích 196 m² = 17 % đế 1 156 m² → đúng luật "tháp ≤ 25 %" |
| Cao thân | 10 × 5 = 50 m + bệ 1,5 | giữ | Tương đương 13–14 tầng thật (3,66 m) |
| Chóp (vòm toả tia) | `crown: 'sunburst'`, chưa rõ cao | **10 m** | [suy] |
| Cột buồm + cờ | không có | **8 m** | [suy] |
| Tổng cao | ≈ 55 m | **≈ 69,5 m** | |

Kiểm phong bao 2 : 1: từ đỉnh tầng 3 (y ≈ 16,5 m) tới đỉnh tầng 10 (y ≈ 51,5 m) lên 35 m, lùi 10 m mỗi phía → dốc 3,5 : 1,
nằm trong phong bao 2 : 1 (dốc hơn là được phép). [suy]

Tỉ lệ cao / cạnh đế: 69,5 / 34 ≈ 2,0. Hilversum 48 m là tháp đơn mảnh trên khối thấp; Chrysler ≈ 282 / 61 ≈ 4,6. Tháp game
10 tầng sẽ "mập" hơn chọc trời thật — chấp nhận được vì là lầu leo được, nhưng **chóp phải cao** để lấy lại cảm giác vút.

### 9. Nguồn
- https://en.wikipedia.org/wiki/Empire_State_Building
- https://en.wikipedia.org/wiki/Chrysler_Building
- https://en.wikipedia.org/wiki/1916_Zoning_Resolution
- https://buildingtheskyline.org/tag/building-setbacks/ (Jason M. Barr, 27/3/2019)
- https://en.wikipedia.org/wiki/Daily_Express_Building,_London
- https://dudok.org/alle-werken/raadhuis-hilversum-1927-1931/ ; https://www.architectuur.org/bouwwerk/189/Raadhuis_Hilversum.html (kết quả tìm kiếm)
- https://en.worldfairs.info/expopavillondetails.php?expo_id=33&pavillon_id=2817 ; https://www.dezeen.com/2025/03/31/1925-paris-exposition-roundup-art-deco-centenary/ (kết quả tìm kiếm)
- Ảnh / bản vẽ: https://commons.wikimedia.org/wiki/File:CB_top.jpg ; https://commons.wikimedia.org/wiki/File:Chrysler_Building_31st_to_41st_floor_plan.png ; https://commons.wikimedia.org/wiki/File:Chrysler-building.svg

---

## main — Biệt Thự Chính

### 1. Nguyên mẫu thật
**Villa Cavrois** (Croix, Nord, Pháp). Kiến trúc sư Robert Mallet-Stevens; chủ Paul Cavrois. Đặt hàng 1929, đồ án 1930,
xây 1931–1932, khánh thành 5/7/1932. Di tích lịch sử 1990. Nhà nước mua 2001, mở cửa 2015.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Dài khối chính | ≈ 60 m | [đo] | Wikipedia EN/FR, Mérimée ("une soixantaine de mètres"), Google Arts & Culture |
| Dài (nguồn khác) | 56 m | [đo] | lescarnetsdigor.fr — chọn 60 m vì Mérimée + CMN thống nhất |
| Rộng | 15 m | [đo, 1 nguồn] | lescarnetsdigor.fr |
| Cao | 21 m (gần như chắc chắn tính tới đỉnh tháp) | [đo, 1 nguồn] | lescarnetsdigor.fr |
| Số cao độ | Hầm (rez-de-jardin) + trệt nâng + 2 tầng; tầng 2 chỉ có 1 phòng chính + sân thượng pergola | [đo] | Mérimée, Wikipedia FR |
| Hall-salon | Cao 6,75 m, rộng 92 m², hai tầng thông | [đo] | lescarnetsdigor.fr; nguồn khác ghi 6 m / 7 m |
| Diện tích ở | 1 840 m² | [đo] | Wikipedia |
| Sân thượng | 830 m² | [đo] | Wikipedia, WikiArquitectura |
| Hướng | Trục dài Tây Bắc – Đông Nam; mặt vườn quay Tây Nam | [đo] | Mérimée |
| Hồ gương | Dài 72 m, vuông góc với nhà, ở mặt nam | [đo] | Google Arts & Culture, WikiArquitectura (một nguồn ghi 100 m) |
| Hồ bơi | 27 × 4 m, sâu tối đa 2,80 m, song song với nhà, phía đông | [đo] | villacavrois.org trích *Architecture d'Aujourd'hui* số 8, 11/1932 |
| Chiều cao 1 tầng | ≈ 3,4 m | [suy] | 6,75 m hall / 2 tầng |
| Cao parapet cánh | ≈ 9 m | [suy] | nền nâng ≈ 1 m + 2 × 3,4 + lan can ≈ 1 m |
| Cao khối giữa (có tầng 2) | ≈ 12,5 m | [suy] | + 1 tầng 3,4 m |
| Cao tháp | ≈ 21 m | [suy] | lấy số 21 m tổng của lescarnetsdigor |

Mâu thuẫn hồ bơi: Wikipedia ghi sâu 4 m ở cầu nhảy; villacavrois.org trích tạp chí 1932 ghi 2,80 m. Chọn 2,80 m vì là nguồn
năm xây.

### 3. Cấu trúc từ dưới lên
1. **Nền**: tầng hầm nửa chìm (giặt, nồi hơi, bể dầu, hầm rượu), cửa sổ hầm lộ ở mặt tây [Wikipedia FR; tìm kiếm].
2. **Tầng trệt nâng**: bậc thang lớn mặt nam xuống sân + hồ gương (file Commons "Escalier de la façade sud").
3. **Thân**: khung bê tông cốt thép (cột, sàn, sân thượng bê tông), tường gạch, ốp gạch vàng [Mérimée].
4. **Kết cấu đỡ mái**: sàn bê tông phẳng; mái hiên công-xôn mỏng (mái che phía tây ở tầng 2 [villa-cavrois.fr]).
5. **Mái**: sân thượng phẳng nhiều cao độ, lan can ống trắng, pergola trên tầng 2.
6. **Đỉnh**: tháp belvédère — phòng tròn nhỏ chỉ đủ 1 bàn 2 ghế, cửa sổ tròn nhìn 360° [lescarnetsdigor; villa-cavrois.fr].

### 4. Mặt bằng
- Lõi giữa: tiền sảnh + hall-salon hai tầng thông, kính cả chiều cao mở ra sân thượng nam.
- Cánh đông (cha mẹ): trệt — phòng hút thuốc, văn phòng Paul Cavrois, 2 phòng con trai lớn; lầu 1 — phòng ngủ cha mẹ, boudoir,
  phòng tắm ≈ 60 m².
- Cánh tây (con cái + gia nhân): trệt — phòng ăn trẻ em, bếp, pantry, phòng gia nhân; lầu 1 — 3 phòng ngủ trẻ + gia sư;
  lầu 2 — phòng chơi + 2 phòng học, sân thượng pergola.
- Hành lang phân phối chạy dọc mặt **bắc**; phòng sống, phòng ngủ ở **nam** (nguyên tắc vệ sinh thời đó) [Mérimée].
- Tháp cầu thang lớn đặt ở trục, nhô ra mặt bắc (cầu thang "demi-hors-œuvre" [Mérimée]); mặt bắc là mặt lối vào.
- Cửa vào lệch khỏi mặt tiền chính [Wikipedia FR].

### 5. Cấu kiện nhận diện
1. Khối nằm ngang rất dài (dài / rộng ≈ 4 : 1), gạch vàng sọc đen chạy suốt.
2. **Một** tháp duy nhất ở trục, cao gấp ≈ 2 khối cánh.
3. Sân thượng bậc thang nhiều cao độ, lan can ống trắng.
4. Hall-salon kính cả chiều cao ở giữa mặt nam.
5. Cửa sổ băng ngang và cửa sổ kéo đứng kiểu Mỹ, khung kim loại mảnh [WikiArquitectura].
6. Pergola bê tông trên sân thượng tầng 2.
7. Hồ gương 72 m vuông góc mặt nam, phản chiếu mặt tiền.
8. Góc bo tròn ở vài khối (gạch khuôn cong — lý do có 26 khuôn).

### 6. Vật liệu và màu

| Phần | Vật liệu | Hex |
|---|---|---|
| Tường | Gạch ốp vàng | `#d8c48c` |
| Mạch ngang | Lõm, sơn đen | `#1b1b1b` |
| Mạch đứng | Bằng mặt, vàng | `#d0bb82` |
| Khung cửa | Kim loại mảnh | `#2a2c2e` |
| Lan can | Ống sơn trắng | `#f2f2ee` |
| Sàn sân thượng | Bê tông / gạch lát | `#b9b6ae` |
| Kính | Kính trong khung lớn | `#9fb4bf` (phản chiếu) |

### 7. Trang trí
- Mặt ngoài gần như không có phù điêu. "Trang trí" là sọc ngang của mạch đen, nhịp cửa sổ băng và lan can trắng.
- Trong nhà: đá hoa xanh Thuỵ Điển, vàng Siena, Carrara; gỗ quý — không cần dựng ngoài.

### 8. Kích thước đề xuất cho game

| Hạng mục | Khung hiện tại | Đề xuất | Lý do |
|---|---|---|---|
| Rộng × sâu thân nhà | 76 × 22 | **76 × 19** thân + sân thượng nam 3 m trong khung 22 | Giữ dài 76 = 60 × 1,27; sâu thật 15 × 1,27 = 19 |
| Số tầng | 2 | **2 ở cánh, 3 ở lõi giữa** + tháp | Đúng cao độ thật |
| Cao parapet cánh | — | **11,5 m** | 9 × 1,27 [suy] |
| Cao lõi giữa | — | **16 m** | 12,5 × 1,27 [suy] |
| Cao tháp | — | **26,5 m**; mặt bằng tháp ≈ 7 × 7 m | 21 × 1,27; mặt bằng tháp [chưa có], ước từ cầu thang lớn |
| Bệ | 0,6 | **1,2 m** + thềm bậc rộng ở mặt nam | Tầng trệt nâng trên hầm nửa chìm |
| Hồ gương | — | 91 × ≈ 6 m (72 × 1,27; bề rộng [chưa có]) | Nếu mặt bằng tiên phủ đủ chỗ |

### 9. Nguồn
- https://en.wikipedia.org/wiki/Villa_Cavrois ; https://fr.wikipedia.org/wiki/Villa_Cavrois
- https://www.pop.culture.gouv.fr/notice/merimee/IA59001908 (Mérimée, hồ sơ kiểm kê)
- https://fr.wikiarquitectura.com/b%C3%A2timent/villa-cavrois/
- https://www.lescarnetsdigor.fr/post/la-villa-cavrois-ch%C3%A2teau-moderne-tr%C3%A9sor-d-architecture
- https://www.villa-cavrois.fr/en/discover/the-water-mirror
- https://artsandculture.google.com/story/explore-the-villa-cavrois-villa-cavrois/bwXhROJxNKdJLg?hl=en (kết quả tìm kiếm)
- http://www.villacavrois.org/2000/12/la-piscine.html
- Ảnh: https://commons.wikimedia.org/wiki/File:Villa_Cavrois_fa%C3%A7ade_sud_et_miroir_d'eau.JPG ;
  https://commons.wikimedia.org/wiki/File:Villa_Cavrois_fa%C3%A7ade_nord.jpg ;
  https://commons.wikimedia.org/wiki/File:Villa_Cavrois,_aspect_horizontal_de_la_brique._Croix,_Nord,_France.jpg

---

## guest — Cánh Khách

### 1. Nguyên mẫu thật
- **Cánh tây Villa Cavrois** (cánh con cái + gia nhân) — cùng quần thể, cùng ngôn ngữ.
- Đối chiếu: **các cánh phòng ngủ khách Villa Noailles** (Hyères, nối thêm sau 1925, kiến trúc sư không rõ theo POP), phục vụ
  bằng một cầu thang thẳng trong nhà.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Cánh tây Cavrois — dài | [chưa có]. Khối 60 m chia lõi + 2 cánh; nếu lõi ≈ 16 m thì mỗi cánh ≈ 22 m | [suy] | — |
| Cánh tây — số tầng | Hầm + trệt + lầu 1 + lầu 2 (phòng chơi) | [đo] | Wikipedia FR |
| Cánh tây — cửa | Mặt tây: cửa sổ hầm (phòng giặt), 4 cửa phòng gia nhân ở trệt | [đo] | kết quả tìm kiếm (villacavrois.org) |
| Noailles — tổng | 1 800 m² ở, 2 400 m² tổng (1933), 600 m² sân thượng đi lại được | [đo] | izart.fr (PDF giáo dục); Wikipedia |
| Noailles — số phòng | "khoảng 50 phòng" | [đo, ước của người viết hồi ký] | Wikipedia |
| Cao tầng | ≈ 3,4 m | [suy] | như main |

### 3. Cấu trúc từ dưới lên
Nền hầm nửa chìm có cửa sổ thấp → 2 tầng ốp gạch vàng → sàn bê tông → sân thượng phẳng lan can trắng → khối tầng 3 nhỏ lùi vào
có pergola (lặp mô-típ của cánh tây Cavrois).

### 4. Mặt bằng
- Hành lang một bên (phía bắc), phòng khách xếp một dãy về phía nam, mỗi phòng có phòng tắm (như Empain lầu 1: 4 phòng, mỗi phòng
  một phòng tắm [heritage.brussels]).
- Cầu thang thẳng trong một khối tháp thấp ở đầu cánh (Noailles).
- Mặt tiền nam chia 6–8 phòng × ≈ 5,5 m [suy] + một phòng góc bo tròn.

### 5. Cấu kiện nhận diện
1. Khối thấp dài, nối về biệt thự chính bằng hành lang có mái phẳng.
2. Gạch vàng sọc đen như nhà chính.
3. Sân thượng lùi bậc ở mái, lan can ống trắng.
4. Cửa sổ băng ngang mỗi phòng + ban công nhỏ.
5. Khối thang đứng ở đầu cánh, cao hơn mái 1 tầng.

### 6. Vật liệu và màu
Như `main`. Biến thể cho phép: tường trát trắng `#ecebe4` (kiểu Noailles) với viền gạch vàng.

### 7. Trang trí
Trơn. Chỉ có sọc mạch, khung cửa mảnh, lan can.

### 8. Kích thước đề xuất cho game

| Hạng mục | Khung hiện tại | Đề xuất | Lý do |
|---|---|---|---|
| Rộng × sâu | 50 × 16 | **44 × 14** | Cánh Cavrois [suy] 22 m × 1,27 ≈ 28 m quá ngắn cho nhà khách độc lập; 44 m giữ dài/sâu ≈ 3,1, sâu 14 = phòng 9 m + hành lang 2 m + tường |
| Tầng | 2 | 2 + khối tầng 3 nhỏ (≈ 1/4 mái) | Lặp mô-típ cánh tây |
| Cao | — | parapet 10 m, khối thang 14 m | [suy] |
| Bệ | 0,6 | 0,9 m + cửa sổ hầm | [suy] |

### 9. Nguồn
- https://fr.wikipedia.org/wiki/Villa_Cavrois
- https://en.wikipedia.org/wiki/Villa_Noailles
- https://pop.culture.gouv.fr/notice/merimee/IA83000028 (piscine couverte; nêu cầu thang thẳng phục vụ phòng khách)
- https://izart.fr/wp-content/uploads/2013/08/villanoailles.pdf (kết quả tìm kiếm)
- https://monument.heritage.brussels/fr/buildings/16139
- Ảnh: https://commons.wikimedia.org/wiki/File:Villa_Cavrois_Northeast_Wing.jpg ;
  https://commons.wikimedia.org/wiki/File:Croix_villa_cavrois_ouest.JPG

---

## studio — Xưởng Hoạ (khối chéo)

### 1. Nguyên mẫu thật
- **Salon rose / xưởng ở Villa Noailles** (Mallet-Stevens thêm năm 1927), trần kính màu của Louis Barillet.
- **Nhà-xưởng anh em Martel**, số 10 rue Mallet-Stevens, Paris (1927) — xưởng của hai nhà điêu khắc, di tích 1990, là nhà duy
  nhất trên phố còn giữ đúng chiều cao 1927.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Salon rose Noailles | Năm 1927; trần kính màu Barillet | [đo] | izart.fr / POP (kết quả tìm kiếm) |
| Phòng khách Noailles | Không cửa sổ, sáng nhờ giếng trời lập thể phủ gần hết trần | [đo] | Wikipedia Villa Noailles |
| Nhà Martel | 1927; cầu thang trong nhà | [đo] | Wikipedia FR Rue Mallet-Stevens |
| Kích thước xưởng | [chưa có] | — | — |
| Cao xưởng | ≈ 6–7 m (hai tầng thông) | [suy] | lấy theo hall Cavrois 6,75 m |

### 3. Cấu trúc từ dưới lên
Bệ thấp → khối xưởng hai tầng thông, một mặt kính lớn khung kim loại chia ô vuông (hướng bắc) → sàn mái bê tông dày, đỡ bằng
dầm lộ → mái phẳng có giếng trời kính màu → khối phụ 2 tầng (kho, phòng ở) lùi so le.

### 4. Mặt bằng
- Phòng xưởng chính ≈ 2/3 diện tích, hai tầng thông, một ban công gác lửng chạy dọc tường trong.
- Khối phụ đặt **chéo 45°** so với khối chính (đúng "khối chéo" trong tên); đây là cách hiểu theo vườn tam giác Noailles
  (Guevrekian) và mặt "đa giác" của nhà Allatini cùng phố [Wikipedia FR Rue Mallet-Stevens]. [suy]
- Cầu thang trong một khối tháp nhỏ nối hai khối.

### 5. Cấu kiện nhận diện
1. Mặt kính xưởng lớn, chia lưới ô vuông khung thép mảnh.
2. Giếng trời / trần kính màu nhìn thấy từ ngoài như hộp kính trên mái.
3. Hai khối giao nhau theo góc, cao thấp khác nhau.
4. Khối thang đứng.
5. Mái phẳng, gờ mái mỏng nhô.

### 6. Vật liệu và màu
Trát trắng `#ecebe4` (khác nhà chính để phân biệt) + đế gạch vàng `#d8c48c`; kính màu hồng `#e7b8c0` và xanh `#9fc0d8` ở giếng
trời [suy, theo tên "salon rose"]; khung `#2a2c2e`.

### 7. Trang trí
Kính màu hình học Barillet là trang trí duy nhất; không phù điêu.

### 8. Kích thước đề xuất cho game

| Hạng mục | Khung hiện tại | Đề xuất | Lý do |
|---|---|---|---|
| Rộng × sâu | 30 × 18 | 30 × 18 (khối chính 20 × 14, khối phụ 12 × 9 xoay 45°) | Khung đủ; chỉ chia khối |
| Tầng | 2 | 1 tầng thông cao 8,5 m (6,75 × 1,27) + khối phụ 2 tầng | Xưởng hoạ là không gian thông |
| Bệ | 0,6 | 0,6 | Giữ |

### 9. Nguồn
- https://en.wikipedia.org/wiki/Villa_Noailles
- https://fr.wikipedia.org/wiki/Rue_Mallet-Stevens
- https://izart.fr/wp-content/uploads/2013/08/villanoailles.pdf (kết quả tìm kiếm)
- Ảnh: https://commons.wikimedia.org/wiki/File:Glasdecke_Rosa_Salon.jpg ;
  https://commons.wikimedia.org/wiki/File:Villa_Noailles_(Mallet-Stevens,_1923).JPG

---

## cinema — Rạp Chiếu & Phòng Nhạc

### 1. Nguyên mẫu thật
- **Odeon Kingstanding** (Birmingham, 1935; Clavering & Bullivant của hãng Harry Weedon) — rạp khu phố cỡ vừa, mặt tiền có
  3 vây (fin) dọc.
- Đối chiếu: **Le Grand Rex** (Paris, 1932; Auguste Bluysen + John Eberson) — tháp góc 35 m; **Radio City Music Hall** (New York,
  1932) — vòm sân khấu dải sunburst; **Odeon Leicester Square** (1937) — granite đen, tháp 37 m.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Odeon Kingstanding — chỗ ngồi | 968 dưới + 324 ban công = 1 292 | [đo] | Wikipedia |
| Odeon Kingstanding — mặt tiền | Giữa ốp faience kem + đen; 3 vây mảnh nhô trên tường chắn mái xây bậc | [đo] | Wikipedia |
| Odeon Kingstanding — cao vây | [chưa có] | — | — |
| Grand Rex — tháp | 35 m | [đo] | Wikipedia FR |
| Grand Rex — vòm trần | "hơn 30 m"; trần sao đêm, phố Địa Trung Hải nổi trên tường | [đo] | Wikipedia FR |
| Grand Rex — màn hình lớn | 24,90 × 11,35 m | [đo] | Wikipedia FR |
| Grand Rex — chỗ | 2 702 | [đo] | Wikipedia FR |
| Radio City — khung sân khấu | Cao > 60 ft (18 m), rộng 100 ft (30 m), bán nguyệt, trần dải liên tiếp | [đo] | Wikipedia (Douglas Haskell) |
| Radio City — biển dọc | 3 biển cao 90 ft (27 m) | [đo] | Wikipedia |
| Odeon Leicester Square — tháp | 120 ft (37 m), granite đen | [đo] | kết quả tìm kiếm (manchestervictorianarchitects, flarestudio) |
| Tỉ lệ khung màn / khung sân khấu | Radio City 18 : 30 = 0,6 | [suy] | |

### 3. Cấu trúc từ dưới lên
Bậc thềm ngắn → sảnh (foyer) thấp có mái hiên (marquee) cong chạy suốt mặt tiền → tường mặt tiền ốp faience, giữa nổi 3 vây
dọc vượt lên trên mái → hộp khán phòng cao phía sau (mái phẳng hoặc gờ bậc) → tường chắn mái xây bậc (stepped parapet) ở hai
vai mặt tiền → chữ nổi tên rạp trên vây giữa.

### 4. Mặt bằng
- Sảnh vào ở trục, quầy vé giữa, cầu thang hai bên lên ban công.
- Khán phòng hình chữ nhật hơi loe, sân khấu + khung bán nguyệt ở cuối.
- "Phòng nhạc": dùng sân khấu + hố dàn nhạc làm phòng hoà nhạc; bên hông có phòng nhạc nhỏ một tầng, cửa sổ băng.
- Phòng chiếu treo cao ở cuối khán phòng (Grand Rex có phòng chiếu nhô ra phía phố).

### 5. Cấu kiện nhận diện
1. Vây dọc (1 hoặc 3) vượt cao hơn mái, mang chữ tên rạp.
2. Mái hiên marquee dài, mép cong, viền đèn.
3. Mặt tiền hai màu kem / đen hoặc đen bóng + nẹp crôm.
4. Tường chắn mái xây bậc ở hai vai.
5. Vòm sân khấu dải đồng tâm (sunburst) — thấy được nếu vào trong.

### 6. Vật liệu và màu

| Phần | Vật liệu | Hex |
|---|---|---|
| Mặt tiền | Faience kem | `#e8dcc0` |
| Dải nhấn, vây | Faience đen | `#141414` |
| Nẹp | Crôm | `#d0d4d8` |
| Marquee | Kim loại sơn + đèn | `#c8a050`, đèn `#ffe6b0` |
| Hộp khán phòng | Gạch | `#c9a77a` [suy, Kingstanding là nhà gạch] |

### 7. Trang trí
Chữ nổi đèn neon; sunburst trên cửa vào; dải chevron ở marquee; trong khán phòng trần dải sáng.

### 8. Kích thước đề xuất cho game

| Hạng mục | Khung hiện tại | Đề xuất | Lý do |
|---|---|---|---|
| Rộng × sâu | 40 × 22 | **24 × 40** (mặt tiền 24, sâu 40) | Rạp thật hẹp ngang, sâu dọc; 40 × 22 đặt mặt tiền ở cạnh dài thì khán phòng chỉ sâu 22 m, không ra rạp |
| Cao khán phòng | 1 tầng | **10 m** | [suy] đủ một ban công; Grand Rex > 30 m là rạp 2 700 chỗ |
| Cao vây | — | **18 m** (≈ 1,8 × mái) | [suy]; tham chiếu tháp Grand Rex 35 m trên khối ≈ 6 tầng |
| Khung sân khấu | — | 12 × 7,2 m | Tỉ lệ 0,6 của Radio City [suy] |
| Bệ | 0,6 | 0,6 | Giữ |

Nếu mặt bằng tổng không cho xoay nhà: giữ 40 × 22 nhưng đặt **khán phòng dọc theo cạnh 40** và mặt tiền + vây ở **đầu hồi 22 m**.

### 9. Nguồn
- https://en.wikipedia.org/wiki/Odeon,_Kingstanding
- https://fr.wikipedia.org/wiki/Le_Grand_Rex
- https://en.wikipedia.org/wiki/Radio_City_Music_Hall
- https://manchestervictorianarchitects.org.uk/index.php/buildings/odeon-cinema-leicester-square-london (kết quả tìm kiếm)
- https://flarestudio.uk/blogs/journal/odeon-art-deco-cinemas (kết quả tìm kiếm)
- Ảnh: https://commons.wikimedia.org/wiki/File:Le_Grand_Rex_fa%C3%A7ade.jpg ;
  https://commons.wikimedia.org/wiki/File:Le_Rex_-_Grande_Salle_By_Nicolas_Thomas.jpg

---

## garage — Nhà Xe & Kho

### 1. Nguyên mẫu thật
- **Nhà phụ Villa Empain**, số 32 avenue Victoria, Brussels (1932, Michel Polak): gara, chuồng ngựa, kho cỏ, phòng gia nhân.
- Đối chiếu: **gara-remise Villa Cavrois** có dốc xe xuống (đường xe vòng tròn trước cổng); **chân tháp Pavillon du Tourisme**
  1925 là gara.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Empain nhà phụ — tầng | 2 | [đo] | heritage.brussels |
| Empain nhà phụ — khoang | 4 khoang (travées) | [đo] | heritage.brussels |
| Empain nhà phụ — vật liệu | Trệt ốp đá trắng; lầu trát; gờ mái nhô | [đo] | heritage.brussels |
| Empain nhà phụ — mặt sau | Khối nhô bo tròn | [đo] | heritage.brussels |
| Empain nhà phụ — công năng | 6 ô chuồng ngựa, mái hiên bê tông, kho cỏ, 5 phòng gia nhân | [đo] | heritage.brussels |
| Empain — gara | 3 cửa gara mở trong tường chắn của hồ bơi | [đo] | heritage.brussels; La Libre (kết quả tìm kiếm) |
| Cavrois — gara | Gara-remise có dốc xe; vị trí còn mâu thuẫn (nhà gác cổng / gắn nhà chính) | [đo] | Wikipedia EN; villacavrois.org (kết quả tìm kiếm) |
| Rộng cửa gara | ≈ 3 m | [suy] | xe thập niên 1930; không có nguồn |

### 3. Cấu trúc từ dưới lên
Sân lát trước gara → trệt ốp đá trắng, dãy cửa gara → mái hiên bê tông mỏng nhô suốt dãy cửa → lầu trát (phòng tài xế, kho) →
gờ mái nhô → mái phẳng. Một đầu khối bo tròn.

### 4. Mặt bằng
- Dãy 5–6 ô xe song song, mỗi ô ≈ 3,5 × 6,5 m [suy].
- Đầu hồi tròn: cầu thang lên lầu + kho.
- Mặt sau: cửa sổ băng nhỏ.

### 5. Cấu kiện nhận diện
1. Dãy cửa gara đều dưới một mái hiên bê tông chạy liền.
2. Đầu khối bo tròn.
3. Phân tầng vật liệu: đá trắng dưới, trát trên.
4. Gờ mái nhô mỏng.

### 6. Vật liệu và màu
Đá trắng `#e7e2d6`; trát `#ecebe4`; cửa gara kim loại sơn `#3b3f44`; mái hiên bê tông `#bdb9b0`.
Biến thể đồng bộ quần thể: trệt gạch vàng `#d8c48c` như Cavrois.

### 7. Trang trí
Số ô xe / chữ nổi nhỏ trên mái hiên; đèn tường tròn kim loại.

### 8. Kích thước đề xuất cho game

| Hạng mục | Khung hiện tại | Đề xuất | Lý do |
|---|---|---|---|
| Rộng × sâu | 44 × 14 | 44 × 14 | 6 ô × 3,5 m = 21 m + kho + đầu tròn; sâu 14 = ô 6,5 + kho 6 [suy] |
| Tầng | 1 | **2** (lầu chỉ phủ ≈ 60 %) | Empain nhà phụ 2 tầng |
| Cao | — | trệt 3,6 m, tổng 7,5 m | [suy] |
| Bệ | 0,6 | 0,15 (xe phải vào được) | Gara không nâng nền |

### 9. Nguồn
- https://monument.heritage.brussels/fr/buildings/16139
- https://en.wikipedia.org/wiki/Villa_Empain
- https://en.wikipedia.org/wiki/Villa_Cavrois
- Ảnh: https://commons.wikimedia.org/wiki/File:Chemin_circulaire_pour_les_v%C3%A9hicules_%C3%A0_l'entr%C3%A9e_de_la_villa_Cavrois_(Croix)_en_2023.jpg ;
  https://commons.wikimedia.org/wiki/File:La_villa_Empain-Brussels.jpg

---

## poolhouse — Nhà Hồ Bơi

### 1. Nguyên mẫu thật
- **Hồ bơi có mái của Villa Noailles** (1926–27; kiến trúc sư không rõ theo POP), một trong những hồ bơi tư nhân có mái đầu
  tiên ở Pháp; kính hạ xuống sàn để thành hồ ngoài trời.
- Đối chiếu: **hồ bơi Villa Cavrois** (27 m, ngoài trời, 3 cầu nhảy); **Piscine Molitor** (Paris, 1929, Lucien Pollet) cho dãy
  cabin trên hành lang; **hồ Villa Empain** (đầu cong, pergola bao quanh).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Noailles — bể | 15 × 7 m | [đo, 1 nguồn] | izart.fr (kết quả tìm kiếm) |
| Noailles — phòng che | ≈ 120 m² | [đo, 1 nguồn] | izart.fr |
| Noailles — khu thể thao quanh solarium | 400 m² | [đo] | izart.fr |
| Noailles — mặt nam | 4 khung kính đôi lớn khung kim loại, kính trượt xuống sàn trên ray, quay tay | [đo] | POP IA83000028 |
| Noailles — mái | Sân thượng phẳng trên lưới dầm bê tông (giống thí nghiệm của Van Doesburg); sàn mái lắp gạch kính | [đo] | POP IA83000028 |
| Noailles — bể | Gạch men trắng | [đo] | POP |
| Cavrois — bể | 27 × 4 m, sâu 2,80 m; 2 cầu nhảy phía tây (cầu đôi), 1 phía đông; lối đi dọc phía bắc là chân sân thượng | [đo] | villacavrois.org (trích tạp chí 1932) |
| Molitor — bể có mái | 33 m, hai dãy cabin | [đo] | Wikipedia FR |
| Molitor — bể ngoài trời | 50 m (nay 46 m), 3 tầng cabin trên hành lang | [đo] | Wikipedia FR |
| Molitor — màu | Cabin xanh; lan can "lisse" trắng; mặt tiền vàng "tango"; cửa sổ tròn kiểu tàu thuỷ | [đo] | Wikipedia FR |
| Empain — hồ | 500 m³, sâu 1–3,5 m (một nguồn: 3,80 m), đầu cong, pergola chạy quanh | [đo] | heritage.brussels; kết quả tìm kiếm |

Mâu thuẫn: 120 m² phòng che chỉ hơn bể 15 × 7 = 105 m² một chút; có thể 120 m² là riêng bể + lối nhỏ. Chưa có nguồn thứ hai.

### 3. Cấu trúc từ dưới lên
Sàn bể gạch trắng → bờ bể + lối đi → tường dọc phía bắc trát, có cửa vào cabin → mặt nam là 4 khung kính lớn (trượt xuống) →
lưới dầm bê tông lộ dưới trần, ô gạch kính lấy sáng → mái sân thượng phẳng (tắm nắng) với lan can ống trắng → một đầu có
cầu thang ngoài lên sân thượng + cầu nhảy.

### 4. Mặt bằng
- Phòng bể ở giữa, bể đặt dọc trục dài.
- Dọc cạnh bắc: dãy cabin thay đồ + vòi sen (Molitor).
- Hai đầu: một đầu khu nghỉ / bar, một đầu kỹ thuật.
- Mặt nam mở ra sân tắm nắng.

### 5. Cấu kiện nhận diện
1. Mặt kính lớn chia khung đứng, có thể mở hết ra ngoài.
2. Trần lưới dầm ô vuông với ô gạch kính phát sáng.
3. Sân thượng mái có lan can ống trắng kiểu boong tàu.
4. Cửa sổ tròn (porthole) ở dãy cabin.
5. Cầu nhảy kim loại ở đầu bể.

### 6. Vật liệu và màu
Tường trát trắng `#ecebe4`; gạch bể `#f4f6f6`; nước `#5fa9c4`; cabin `#2f5fa8`; viền / lan can `#f2f2ee`; nhấn vàng tango
`#e8b830` (tuỳ chọn, Molitor).

### 7. Trang trí
Kính màu Barillet (Molitor có kính màu ở lối vào) ở cửa chính; sọc ngang; số cabin bằng chữ kim loại.

### 8. Kích thước đề xuất cho game

| Hạng mục | Khung hiện tại | Đề xuất | Lý do |
|---|---|---|---|
| Rộng × sâu | 34 × 14 | 34 × 14 giữ, nhưng **bể trong nhà 19 × 9** (15 × 7 × 1,27) | Phòng bể ≈ 23 × 14; dãy cabin + kỹ thuật 11 × 14 |
| Tầng | 1 | 1 + sân thượng | Noailles |
| Cao | — | 5,5 m tới mái, + lan can 1,1 | [suy] |
| Hồ ngoài trời (nếu có) | — | 34 × 5 (27 × 4 × 1,27) song song nhà chính | Cavrois |
| Bệ | 0,6 | 0,6 | Giữ |

### 9. Nguồn
- https://pop.culture.gouv.fr/notice/merimee/IA83000028
- https://izart.fr/wp-content/uploads/2013/08/villanoailles.pdf (kết quả tìm kiếm)
- http://www.villacavrois.org/2000/12/la-piscine.html
- https://fr.wikipedia.org/wiki/Piscine_Molitor
- https://monument.heritage.brussels/fr/buildings/16139
- Ảnh: https://commons.wikimedia.org/wiki/File:La_grande_terrasse_et_la_piscine_de_la_villa_Cavrois_(Croix)_(20553480232).jpg ;
  https://commons.wikimedia.org/wiki/File:Piscine_de_la_villa_Cavrois_(Croix)_en_2023.jpg

---

## gym — Phòng Tập

### 1. Nguyên mẫu thật
**Phòng tập (1928) và sân squash (1932) của Villa Noailles** — nối vào khu hồ bơi có mái, quanh solarium. Kiến trúc sư không rõ
(POP).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Năm phòng tập / squash | 1928 / 1932 | [đo] | POP (kết quả tìm kiếm) |
| Khu thể thao Noailles tổng | 400 m² | [đo] | izart.fr |
| Kích thước phòng tập | [chưa có] | — | — |
| Sân squash (chuẩn) | 9,75 × 6,40 m; cao sân 5,64 m; tin ≈ 0,5 m | [đo] | Wikipedia Squash |

### 3. Cấu trúc từ dưới lên
Bệ thấp → hộp sân squash tường kín, cao (≥ 5,64 m) → phòng tập thấp hơn (≈ 4,5 m) với cửa sổ băng cao trên tường → mái phẳng
có giếng trời → sân thượng tắm nắng trên phần phòng tập.

### 4. Mặt bằng
- Một đầu: sân squash 9,75 × 6,4 (lòng), hành lang khán giả phía sau tường kính.
- Giữa: phòng tập ≈ 14 × 12 [suy].
- Đầu kia: thay đồ, nối sang nhà hồ bơi bằng hành lang có mái.

### 5. Cấu kiện nhận diện
1. Hai khối cao thấp: hộp squash cao kín, phòng tập thấp nhiều kính.
2. Cửa sổ băng cao sát trần.
3. Sân thượng mái lan can trắng.
4. Lối nối có mái phẳng sang hồ bơi.

### 6. Vật liệu và màu
Trát trắng `#ecebe4`; đế gạch vàng `#d8c48c`; khung `#2a2c2e`; sàn gỗ trong nhà `#b88a58`.

### 7. Trang trí
Không. Chữ nổi nhỏ "GYMNASE" trên cửa nếu cần nhận diện [đề xuất].

### 8. Kích thước đề xuất cho game

| Hạng mục | Khung hiện tại | Đề xuất | Lý do |
|---|---|---|---|
| Rộng × sâu | 30 × 16 | 30 × 16 | Đủ: squash 12,4 × 8,2 ngoài tường (9,75 × 6,4 × 1,27) + phòng tập 14 + thay đồ |
| Cao | 1 tầng | squash **8 m**, phòng tập **5,5 m** | 5,64 × 1,27 + kết cấu |
| Bệ | 0,6 | 0,6 | Giữ |

### 9. Nguồn
- https://pop.culture.gouv.fr/notice/merimee/IA83000028 (khu hồ bơi; POP liệt kê phòng tập 1928, squash 1932 qua kết quả tìm kiếm)
- https://izart.fr/wp-content/uploads/2013/08/villanoailles.pdf (kết quả tìm kiếm)
- https://en.wikipedia.org/wiki/Squash_(sport)
- Ảnh: https://commons.wikimedia.org/wiki/File:Villa_Noailles_(Hy%C3%A8res)_(1).jpg

---

## summit — Đài Ngắm Cảnh

### 1. Nguyên mẫu thật
- **Belvédère trên tháp Villa Cavrois**: phòng tròn nhỏ ở tầng trên cùng của tháp giữa, cửa sổ tròn, nhìn 360° ra vườn và đồi
  Beaumont.
- Đối chiếu hình khối: **tháp Pavillon du Tourisme** 1925 (cánh buồm ngang).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Phòng belvédère | Chỉ đủ 1 bàn + 2 ghế | [đo, mô tả] | lescarnetsdigor.fr |
| Đường kính phòng | ≈ 2,5–3 m | [suy] | 1 bàn 2 ghế |
| Tầm nhìn | 360° | [đo] | villa-cavrois.fr |
| Pavillon du Tourisme | Tháp 35–36 m; 3 cánh buồm ngang ở chân, 3 ở cổ; tháp chuông vuông 5 m | [đo] | worldfairs, bybeton (kết quả tìm kiếm) |

### 3. Cấu trúc từ dưới lên
Bệ vuông bậc thấp → thân tháp vuông ốp gạch vàng (2 tầng) → 3 tấm "cánh buồm" bê tông ngang mỏng nhô ra → phòng tròn kính băng
liên tục (360°) → mái đĩa phẳng nhô → cột cờ.

### 4. Mặt bằng
Vuông 9 × 9 ở chân, cầu thang xoắn trong lõi; phòng ngắm tròn Ø ≈ 6 m (đã phóng cho người chơi) đặt giữa.

### 5. Cấu kiện nhận diện
1. Phòng tròn kính băng 360° trên đỉnh.
2. Cánh buồm ngang mỏng.
3. Gạch vàng sọc đen ở thân.
4. Mái đĩa mỏng + cột cờ.

### 6. Vật liệu và màu
Gạch `#d8c48c` / `#1b1b1b`; cánh buồm bê tông trắng `#ecebe4`; khung kính `#2a2c2e`; cột cờ thép `#c9ced3`.

### 7. Trang trí
Không phù điêu; đồng hồ trên thân là tuỳ chọn (Pavillon du Tourisme).

### 8. Kích thước đề xuất cho game

| Hạng mục | Khung hiện tại | Đề xuất | Lý do |
|---|---|---|---|
| Mặt bằng | 9 × 9 | 9 × 9 | Giữ |
| Cao | — | thân 7 m + phòng tròn 3 m + mái 0,4 + cột cờ 4 m ≈ 14,5 m | [suy] |
| Phòng tròn | — | Ø 6 m | Phóng từ 2,5–3 m để người chơi đứng được; lệch tỉ lệ có chủ đích, ghi lại |

### 9. Nguồn
- https://www.lescarnetsdigor.fr/post/la-villa-cavrois-ch%C3%A2teau-moderne-tr%C3%A9sor-d-architecture
- https://www.villa-cavrois.fr/en/discover/the-water-mirror
- https://bybeton.fr/paris-1925-lart-deco-et-ses-architectes (kết quả tìm kiếm)
- Ảnh: https://commons.wikimedia.org/wiki/File:Villa_Cavrois_Belvedere.jpg

---

## gaz1 — Đình Kính

### 1. Nguyên mẫu thật
- **Sảnh vào Eltham Palace** (London, 1933–36; nội thất Rolf Engströmer): mặt bằng tam giác cạnh cong, vòm bê tông-kính.
- Đối chiếu: **tường kính tam giác của "Vườn Nước và Ánh sáng"** (Guevrekian, Expo 1925).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Vòm Eltham | Ø 7 m, bê tông + 720 cốc kính nhỏ gắn trong trần | [đo] | geograph.org.uk (kết quả tìm kiếm) |
| Mặt bằng sảnh | Tam giác (đều) cạnh cong | [đo] | geograph; teaching kit English Heritage (kết quả tìm kiếm) |
| Vườn Guevrekian | Tam giác đều chia ô tam giác; 2 tường thấp ghép tam giác kính trắng + hồng; 4 bể bậc; quả cầu xoay phát sáng | [đo, không kích thước] | Wikipedia Gabriel Guevrekian |

### 3. Cấu trúc từ dưới lên
Bệ tam giác 3 bậc → 3 tường cong thấp ốp gỗ / kính khung kim loại → vành bê tông → vòm nông bê tông lắp gạch kính tròn → đỉnh
mắt kính.

### 4. Mặt bằng
Tam giác đều cạnh cong nội tiếp ô 10 × 10; 3 lối vào ở 3 đỉnh vát. Giữa đặt một quả cầu đèn (Guevrekian).

### 5. Cấu kiện nhận diện
1. Vòm nông lỗ chỗ gạch kính phát sáng.
2. Mặt bằng tam giác cạnh cong.
3. Tường kính ghép tam giác trắng + hồng.
4. Quả cầu sáng ở tâm.

### 6. Vật liệu và màu
Bê tông `#cfcac0`; gạch kính `#cfe3e8` (phát sáng); kính hồng `#f0c8cc`; gỗ đậu đen (blackbean) mặt trong `#3b2a1e`.

### 7. Trang trí
Ô kính tam giác; không cần phù điêu.

### 8. Kích thước đề xuất cho game

| Hạng mục | Khung hiện tại | Đề xuất | Lý do |
|---|---|---|---|
| Mặt bằng | 10 × 10 | 10 × 10 (tam giác cạnh ≈ 10) | Giữ |
| Vòm | — | Ø 8,9 m (7 × 1,27), cao đỉnh 5,5 m | [suy] |

### 9. Nguồn
- https://en.wikipedia.org/wiki/Eltham_Palace
- https://www.geograph.org.uk/photo/5797256 (kết quả tìm kiếm)
- https://en.wikipedia.org/wiki/Gabriel_Guevrekian

---

## gaz2 — Đình Tennis

### 1. Nguyên mẫu thật
Sân tennis có trong quần thể **Casa de Serralves** (SIPA liệt kê "campo de ténis" cùng nhà, nhà nguyện, vườn hồng, hồ).
Không tìm được ảnh / bản vẽ của nhà nghỉ cạnh sân → dựng theo ngôn ngữ Cavrois/Empain: mái hiên công-xôn + pergola.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Sân tennis | 23,77 × 10,97 m (đôi), 8,23 m (đơn); lưới 0,914 m giữa / 1,07 m cột | [đo] | Wikipedia Tennis court |
| Khoảng đất khuyến nghị | 18 × 37 m | [đo] | Wikipedia Tennis court |
| Nhà nghỉ Serralves | [chưa có] | — | — |
| Pergola Empain | Pergola rộng chạy quanh hồ bơi; pergola trên khối nhô hai bên | [đo, không kích thước] | heritage.brussels |

### 3. Cấu trúc từ dưới lên
Bậc khán đài 3 cấp → phòng thay đồ nhỏ tường gạch vàng → mái phẳng công-xôn nhô ra phía sân (bóng mát) → nửa còn lại là pergola
dầm bê tông → cột cờ / bảng điểm.

### 4. Mặt bằng
Đặt cạnh dọc sân. Nửa kín (thay đồ, kho vợt) 5 × 9; nửa mở (khán đài có mái) 7 × 9.

### 5. Cấu kiện nhận diện
1. Mái phẳng công-xôn mỏng, nhô dài.
2. Pergola dầm song song.
3. Bậc khán đài.
4. Bảng điểm chữ số kiểu Deco.

### 6. Vật liệu và màu
Gạch `#d8c48c`; bê tông trắng `#ecebe4`; sân đất nện `#b5633a` hoặc cỏ `#5f8a3c` [chọn một].

### 7. Trang trí
Chữ số bảng điểm; sọc gạch.

### 8. Kích thước đề xuất cho game

| Hạng mục | Khung hiện tại | Đề xuất | Lý do |
|---|---|---|---|
| Đình | 12 × 9 | 12 × 9 | Giữ |
| Cao | — | 3,8 m tới mái | [suy] |
| Sân kèm | — | 23 × 46 khoảng đất nếu phóng 1,27 (18 × 37 × 1,27); tối thiểu 18 × 37 | Không phóng sân thì người chơi thấy sân nhỏ so với nhà |

### 9. Nguồn
- http://www.monumentos.gov.pt/Site/APP_PagesUser/SIPA.aspx?id=6713 (kết quả tìm kiếm)
- https://en.wikipedia.org/wiki/Tennis_court
- https://monument.heritage.brussels/fr/buildings/16139
- Ảnh vườn Serralves: https://commons.wikimedia.org/wiki/File:Parque_de_Serralves_5_(6115541023).jpg

---

## gaz3 — Đình Đọc Sách

### 1. Nguyên mẫu thật
**Sân thượng-pergola tầng 2 Villa Cavrois** (cạnh phòng chơi và 2 phòng học của trẻ). Commons có riêng một chuyên mục
"Terrasse-pergola (Villa Cavrois)".

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Vị trí | Tầng 2, cánh tây, cạnh phòng chơi + 2 phòng học | [đo] | Wikipedia FR; kết quả tìm kiếm |
| Kích thước pergola | [chưa có] | — | — |
| Mái hiên tầng 2 phía tây | Có, nhô | [đo] | villa-cavrois.fr |

### 3. Cấu trúc từ dưới lên
Sàn sân thượng → 2 bức tường ngăn gió thấp gạch vàng (hình chữ L) → khung cột vuông mảnh → dầm pergola song song (không lợp) ở nửa
ngoài, tấm mái bê tông kín ở nửa trong → ghế băng xây liền tường.

### 4. Mặt bằng
Vuông 9 × 9; góc L kín hướng gió, hai mặt mở; giá sách xây liền tường L.

### 5. Cấu kiện nhận diện
1. Pergola dầm song song mảnh.
2. Tường gạch thấp hình L.
3. Một nửa mái kín, một nửa thoáng.
4. Lan can ống trắng ở cạnh mở (nếu đặt trên cao).

### 6. Vật liệu và màu
Gạch `#d8c48c`; bê tông `#ecebe4`; lan can `#f2f2ee`; gỗ ghế `#8a5a36`.

### 7. Trang trí
Không.

### 8. Kích thước đề xuất cho game

| Hạng mục | Khung hiện tại | Đề xuất |
|---|---|---|
| Mặt bằng | 9 × 9 | 9 × 9 |
| Cao | — | 3,4 m dầm pergola [suy = 1 tầng Cavrois] |

### 9. Nguồn
- https://fr.wikipedia.org/wiki/Villa_Cavrois
- https://www.villa-cavrois.fr/en/discover/the-water-mirror
- Ảnh: https://commons.wikimedia.org/wiki/File:La_terrasse-pergola_(Villa_Cavrois,_Croix)_(19956880373).jpg

---

## gaz4 — Đình Hồ Gương

### 1. Nguyên mẫu thật
**Đầu hồ gương Villa Cavrois** — điểm cuối hồ là chỗ ngắm lại mặt tiền nam (villa-cavrois.fr). Kết hợp mô-típ **bể bậc + quả cầu
sáng** của vườn Guevrekian 1925.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Hồ gương | Dài 72 m, vuông góc nhà | [đo] | Google Arts & Culture, WikiArquitectura |
| Hồ gương (nguồn khác) | 100 m | [đo] | Aubert Jansem (kết quả tìm kiếm) — chọn 72 m vì nhiều nguồn |
| Công năng mùa đông | Dùng làm sân trượt băng; bị lấp thời chiếm đóng | [đo] | kết quả tìm kiếm (villacavrois.org) |
| Bề rộng hồ | [chưa có] | — | — |

### 3. Cấu trúc từ dưới lên
Bậc thềm xuống mặt nước → sàn đài bán nguyệt → hàng cột vuông mảnh → tấm mái phẳng mỏng hình bán nguyệt → một quả cầu sáng ở tâm
(Guevrekian).

### 4. Mặt bằng
Bán nguyệt 9 m, cạnh thẳng quay ra hồ, trục đài trùng trục hồ và trục nhà.

### 5. Cấu kiện nhận diện
1. Đặt đúng trên trục hồ, nhìn về nhà.
2. Mái phẳng mỏng nổi trên cột mảnh.
3. Bậc xuống nước.
4. Quả cầu sáng.

### 6. Vật liệu và màu
Bê tông trắng `#ecebe4`; viền gạch vàng `#d8c48c`; nước tối phản chiếu `#2e4a52`.

### 7. Trang trí
Không; phản chiếu là trang trí.

### 8. Kích thước đề xuất cho game

| Hạng mục | Khung hiện tại | Đề xuất |
|---|---|---|
| Mặt bằng | 9 × 9 | 9 × 4,5 (bán nguyệt) + bậc |
| Cao | — | 3,2 m |

### 9. Nguồn
- https://www.villa-cavrois.fr/en/discover/the-water-mirror
- https://fr.wikiarquitectura.com/b%C3%A2timent/villa-cavrois/
- https://en.wikipedia.org/wiki/Gabriel_Guevrekian
- Ảnh: https://commons.wikimedia.org/wiki/File:Villa_Cavrois_fa%C3%A7ade_sud_miroir_eau.jpg

---

## gaz5 — Đình Cuối Vườn

### 1. Nguyên mẫu thật
**Vườn Mallet-Stevens ở Expo 1925 với 4 "cây lập phương" bê tông của anh em Martel** (Esplanade des Invalides).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Cao cây | ≈ 5 m ("près de cinq mètres") | [đo] | villa-cavrois.fr (trang Expo 1925); amisvillacavrois.org |
| Cao cây (nguồn khác) | > 7 m | [đo, nguồn thương mại] | galerie-creation — bỏ |
| Bản sao hiện đại | 8,50 m, bê tông Ductal (Boulogne-Billancourt) | [đo] | otbb.org (kết quả tìm kiếm) — không phải bản gốc |
| Số cây | 4, mỗi cây trên một thảm cỏ viền bờ hoàng dương thấp | [đo] | villa-cavrois.fr; amisvillacavrois.org |
| Cấu tạo | Thân cạnh sắc, lá là tấm xi măng mỏng công-xôn; 4 cách gắn lá | [đo] | amisvillacavrois.org |
| Mô hình | 82 × 38 × 36,5 cm gỗ okoumé sơn | [đo] | kết quả tìm kiếm |

### 3. Cấu trúc từ dưới lên
Thảm cỏ vuông viền bờ hoàng dương thấp → bệ vuông → thân hộp chữ thập cạnh sắc → các tấm "lá" vuông mỏng gắn so le ở 3–4 cao độ
→ tấm trên cùng làm mái che.

### 4. Mặt bằng
Ô 8 × 8: 4 cây ở 4 góc (mỗi cây một thảm cỏ), ghế băng ở giữa dưới tán tấm bê tông. Bố cục lặp vườn 1925.

### 5. Cấu kiện nhận diện
1. "Cây" bê tông lập phương: thân sắc cạnh + lá tấm phẳng.
2. 4 cây, mỗi cây một thảm cỏ viền hoàng dương.
3. Màu xi măng xám trơn.

### 6. Vật liệu và màu
Xi măng `#bdb9b0`; hoàng dương `#3f5f2e`; cỏ `#6a9a48`.

### 7. Trang trí
Chính cây là trang trí.

### 8. Kích thước đề xuất cho game

| Hạng mục | Khung hiện tại | Đề xuất |
|---|---|---|
| Mặt bằng | 8 × 8 | 8 × 8 |
| Cao cây | — | 6,4 m (5 × 1,27) |

Lưu ý: 4 cây phải là ít nhất 3 biến thể (4 cách gắn lá thật) — khớp luật "≥ 3 biến thể" của dự án.

### 9. Nguồn
- https://www.villa-cavrois.fr/decouvrir/l-exposition-internationale-des-arts-decoratifs-et-industriels-modernes-de-paris-en-1925 (kết quả tìm kiếm)
- https://www.amisvillacavrois.org/2000/12/les-arbres-cubistes.html (kết quả tìm kiếm)
- https://freresmartel.blogspot.com/2000/03/les-arbres-cubistes.html (kết quả tìm kiếm)

---

## gaz6 — Đình Góc Đông

### 1. Nguyên mẫu thật
**Vườn lập thể Villa Noailles** (Gabriel Guevrekian, 1926) — chiếm một khoảnh đất **hình tam giác** ở góc villa.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Hình | Tam giác, chia ô | [đo] | Wikipedia Guevrekian |
| Kích thước | [chưa có] | — | — |
| Thay đổi | Cây mọc lệch phá bố cục; Charles de Noailles trồng lại toàn bộ ngay sau đó | [đo] | Wikipedia Guevrekian |

### 3. Cấu trúc từ dưới lên
Sàn ô bàn cờ tam giác nhiều cao độ → bồn cây khối vuông xếp bậc → tường thấp trát màu → tượng / điểm nhấn ở đỉnh tam giác
(Noailles có tượng Lipchitz "La joie de vivre", file Commons).

### 4. Mặt bằng
Tam giác vuông trong ô 8 × 8, đỉnh nhọn chĩa ra góc đông; lối vào ở cạnh huyền.

### 5. Cấu kiện nhận diện
1. Mặt bằng tam giác.
2. Ô bàn cờ (gạch + cỏ / sỏi) xếp bậc.
3. Bồn cây hộp vuông.
4. Tượng đỉnh trục.

### 6. Vật liệu và màu
Gạch lát `#c9b9a0`; tường trát `#e6c9b8` [suy, theo ảnh vườn lập thể — chưa đo]; cỏ `#6a9a48`.

### 7. Trang trí
Hình học ô; tượng.

### 8. Kích thước đề xuất cho game

| Hạng mục | Khung hiện tại | Đề xuất |
|---|---|---|
| Mặt bằng | 8 × 8 | tam giác cạnh góc vuông 8 m |
| Cao | — | tường 1,2 m; tượng 2,5 m |

### 9. Nguồn
- https://en.wikipedia.org/wiki/Gabriel_Guevrekian
- https://en.wikipedia.org/wiki/Villa_Noailles
- Ảnh: https://commons.wikimedia.org/wiki/File:Villa_Noailles,_jardin_cubiste,_Gabriel_Gu%C3%A9vr%C3%A9kian_(Hyeres,_Var,_France)_1.jpg ;
  https://commons.wikimedia.org/wiki/File:Jacques_lipchitz_la_joie_de_vivre_1927.jpg

---

## giason — Sân Thượng Ngắm Cảnh (giả sơn)

### 1. Nguyên mẫu thật
**Hệ sân thượng bậc của Villa Cavrois** (830 m², nhiều cao độ) và **sân thượng đi lại được của Villa Noailles** (600 m²) —
Villa Noailles "đặt trên đỉnh đồi" (Wikipedia). Art Deco không có "núi giả"; tương đương đúng phong cách là **đồi trồng có sân
thượng bê tông xếp bậc**.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Sân thượng Cavrois | 830 m² | [đo] | Wikipedia |
| Sân thượng Noailles | 600 m² | [đo] | izart.fr |
| Cao mỗi bậc | ≈ 3,4 m (= 1 tầng) | [suy] | |

### 3. Cấu trúc từ dưới lên
Taluy đá + cây bụi → tường chắn gạch vàng → sân 1 → cầu thang thẳng ngoài trời → sân 2 lùi vào → sân 3 nhỏ nhất có pergola →
lan can ống trắng mọi mép.

### 4. Mặt bằng
3 sân lùi so le (không đồng tâm), cầu thang đổi hướng mỗi bậc.

### 5. Cấu kiện nhận diện
Bậc sân bê tông lùi so le; lan can trắng; tường gạch vàng; pergola trên đỉnh.

### 6. Vật liệu và màu
Như `main`.

### 7. Trang trí
Không.

### 8. Kích thước đề xuất cho game
3 bậc × 4,3 m (3,4 × 1,27) = 13 m cao. Mặt bằng theo tổng mặt bằng hiện có.

### 9. Nguồn
- https://en.wikipedia.org/wiki/Villa_Cavrois ; https://en.wikipedia.org/wiki/Villa_Noailles
- Ảnh: https://commons.wikimedia.org/wiki/File:Croix_villa_cavrois_SE.jpg

---

## Ghi chú thêm: cổng và rào

- **Rào sắt rèn Villa Empain** (Michel Polak, 1931): ô **hình thoi** phía đại lộ Roosevelt; đơn giản hơn phía Victoria
  [heritage.brussels]. Dùng cho rào mặt chính tiên phủ.
- **Cổng Cavrois**: cổng chính + nhà gác cổng, đường xe vòng tròn cho xe tới gara không phải lùi [Wikipedia EN; Commons
  "L'entrée principale de la villa Cavrois et la maison du gardien.jpg"].
- **Cửa vào Empain**: cửa sắt rèn, mái hiên đồng thau [heritage.brussels].

---

## Độ tin cậy

| Công trình | Mức | Ghi chú |
|---|---|---|
| lau10 Thiên Kim Lâu | **Chắc** (quy tắc + nguyên mẫu) / **suy** (kích thước đề xuất) | Số Empire State, Chrysler, Hilversum, luật 1916 có nguồn. Kích thước từng bậc là đề xuất, phải chạy `towerCollision` |
| main Biệt Thự Chính | **Chắc một phần** | Dài 60 m, 830 m² sân thượng, hall 6,75 m, hồ bơi, hồ gương có nguồn. Rộng 15 m và cao 21 m chỉ 1 nguồn (blog). Cao từng khối là suy ra. Không có bản vẽ đo trực tuyến (bản vẽ gốc mất; phục dựng dựa 90 ảnh 1933) |
| guest Cánh Khách | **Suy ra** | Có công năng, tầng; không có kích thước cánh |
| studio Xưởng Hoạ | **Suy ra** | Có nguyên mẫu, không có số đo |
| cinema Rạp | **Chắc một phần** | Số Grand Rex, Radio City chắc; rạp cỡ nhỏ (Odeon Kingstanding) không có kích thước; khối rạp game là suy ra |
| garage Nhà Xe | **Chắc một phần** | Bố cục Empain nhà phụ chắc (tầng, khoang, vật liệu); không có kích thước |
| poolhouse Nhà Hồ Bơi | **Chắc một phần** | Bể Cavrois 27 × 4 × 2,8 chắc (tạp chí 1932); bể Noailles 15 × 7 chỉ 1 nguồn |
| gym Phòng Tập | **Suy ra** | Chỉ có năm xây Noailles; kích thước dựa sân squash chuẩn |
| summit Đài Ngắm Cảnh | **Suy ra** | Có mô tả phòng belvédère, không có số |
| gaz1 Đình Kính | **Chắc một phần** | Vòm Eltham Ø 7 m, 720 cốc kính (1 nguồn) |
| gaz2 Đình Tennis | **Suy ra** | Sân chuẩn chắc; nhà nghỉ không tìm được |
| gaz3 Đình Đọc Sách | **Suy ra** | Có nguyên mẫu (pergola Cavrois), không có số |
| gaz4 Đình Hồ Gương | **Chắc một phần** | Hồ 72 m (nhiều nguồn); không có bề rộng |
| gaz5 Đình Cuối Vườn | **Chắc** | Cây Martel ≈ 5 m, 4 cây, 4 kiểu gắn lá — 2 nguồn độc lập |
| gaz6 Đình Góc Đông | **Không có số** | Chỉ biết hình tam giác |
| giason | **Suy ra** | Diện tích sân thượng chắc, hình khối suy ra |

**Không tìm được**: cao tháp Cavrois riêng (chỉ có tổng 21 m), kích thước viên gạch Cavrois, bề rộng hồ gương, mọi kích thước
của Odeon Kingstanding, phòng tập Noailles, xưởng Martel, nhà nghỉ tennis Serralves. Màu hex toàn bộ là ước lượng, chưa đo trên
ảnh.

**Phát hiện chính về khung hiện tại**:
1. **Lầu 10 tầng** lùi bậc quá nông (3 → 2 → 1,5 m mỗi phía; đỉnh 21 m = 62 % đế) nên không đọc ra ngữ pháp setback. Đề xuất
   34 → 26 → 20 → 14 m (đỉnh 41 % cạnh, 17 % diện tích) + chóp 10 m + cột buồm 8 m.
2. **Rạp 40 × 22 một tầng** sai loại hình nếu mặt tiền ở cạnh 40: rạp thật hẹp ngang, sâu dọc, khán phòng cao ≈ 10 m. Đặt
   mặt tiền + vây ở đầu hồi 22 m.
3. **Biệt thự chính 76 × 22 × 2 tầng** dài đúng (≈ 60 × 1,27) nhưng phải có 3 cao độ: cánh 2 tầng, lõi 3 tầng, một tháp
   ≈ 26 m. Thiếu tháp là mất nhận diện Cavrois.
4. **Bệ 0,6 m** quá thấp cho biệt thự (trệt nâng trên hầm nửa chìm) và quá cao cho gara (xe phải vào). Đề xuất 1,2 m / 0,15 m.
