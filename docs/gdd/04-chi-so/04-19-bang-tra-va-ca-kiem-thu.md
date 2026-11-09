# 04-19 · Bảng tra thần sát, 60 Giáp Tý, bộ ca kiểm thử mở rộng

## 0. Mục đích

- **Bảng tra** (§1–§2): QA và thiết kế viên tra nhanh vì sao một lá số có / không có một Đặc Tính, không cần đọc mã. Mọi bảng **in ra từ hằng số của engine** (`shensha.js`, `noble-stars.js`), không gõ tay.
- **Bộ ca** (§3–§8): mỗi giá trị rời rạc của mọi chỉ số có ít nhất một ngày sinh thật làm ví dụ, để kiểm thử «mỗi nhánh chạy ít nhất một lần». Tìm bằng quét 20.000 lá số (seed 9001, `refYear` 2026). Ghi đúng định dạng `YYYY-MM-DD HH:MM giới` để chạy lại `analyze(y, m, d, h, mi, giới, 2026)`.

## 1. Bảng tra thần sát

### 1.1 Theo can ngày (`chart.dayGan`)

Sao gặp khi chi đích có ở **bất kỳ** trụ (năm, tháng, ngày, giờ). Thái Cực và Thiên Trù tra **cả** can năm (§1.4).

| Can ngày | Thiên Ất | Văn Xương | Lộc | Dương Nhận | Học Đường | Kim Dư | Hồng Diễm | Lưu Hà | Thái Cực | Thiên Trù | Quốc Ấn |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 甲 | 丑 未 | 巳 | 寅 | 卯 | 亥 | 辰 | 午 | 酉 | 子 午 | 巳 | 戌 |
| 乙 | 子 申 | 午 | 卯 | 辰 | 午 | 巳 | 午 | 戌 | 子 午 | 午 | 亥 |
| 丙 | 亥 酉 | 申 | 巳 | 午 | 寅 | 未 | 寅 | 未 | 卯 酉 | 巳 | 丑 |
| 丁 | 亥 酉 | 酉 | 午 | 未 | 酉 | 申 | 未 | 申 | 卯 酉 | 午 | 寅 |
| 戊 | 丑 未 | 申 | 巳 | 午 | 寅 | 未 | 辰 | 巳 | 辰 戌 丑 未 | 申 | 丑 |
| 己 | 子 申 | 酉 | 午 | 未 | 酉 | 申 | 辰 | 午 | 辰 戌 丑 未 | 酉 | 寅 |
| 庚 | 丑 未 | 亥 | 申 | 酉 | 巳 | 戌 | 戌 | 辰 | 寅 亥 | 亥 | 辰 |
| 辛 | 寅 午 | 子 | 酉 | 戌 | 子 | 亥 | 酉 | 卯 | 寅 亥 | 子 | 巳 |
| 壬 | 卯 巳 | 寅 | 亥 | 子 | 申 | 丑 | 子 | 亥 | 巳 申 | 寅 | 未 |
| 癸 | 卯 巳 | 卯 | 子 | 丑 | 卯 | 寅 | 申 | 寅 | 巳 申 | 卯 | 申 |

### 1.2 Theo nguyệt chi (`chart.monthZhi`)

Thiên Đức, Thiên Đức Hợp gặp ở **can hoặc chi**; Nguyệt Đức, Nguyệt Đức Hợp, Đức Tú chỉ ở **can**; Thiên Y, Huyết Nhận chỉ ở **chi**. Đức Tú cần **cả hai** can.

| Nguyệt chi | Thiên Đức | Thiên Đức Hợp | Nguyệt Đức | Nguyệt Đức Hợp | Thiên Y | Huyết Nhận | Đức Tú (đức + tú) | Mùa (Thiên Xá / Tứ Phế) |
|---|---|---|---|---|---|---|---|---|
| 寅 | 丁 | 壬 | 丙 | 辛 | 丑 | 丑 | 丙 + 戊 | Xuân |
| 卯 | 申 | 巳 | 甲 | 己 | 寅 | 未 | 甲 + 丁 | Xuân |
| 辰 | 壬 | 丁 | 壬 | 丁 | 卯 | 寅 | 壬 + 甲 | Xuân |
| 巳 | 辛 | 丙 | 庚 | 乙 | 辰 | 申 | 庚 + 癸 | Hạ |
| 午 | 亥 | 寅 | 丙 | 辛 | 巳 | 卯 | 丙 + 戊 | Hạ |
| 未 | 甲 | 己 | 甲 | 己 | 午 | 酉 | 甲 + 丁 | Hạ |
| 申 | 癸 | 戊 | 壬 | 丁 | 未 | 辰 | 壬 + 甲 | Thu |
| 酉 | 寅 | 亥 | 庚 | 乙 | 申 | 戌 | 庚 + 癸 | Thu |
| 戌 | 丙 | 辛 | 丙 | 辛 | 酉 | 巳 | 丙 + 戊 | Thu |
| 亥 | 乙 | 庚 | 甲 | 己 | 戌 | 亥 | 甲 + 丁 | Đông |
| 子 | 巳 | 申 | 壬 | 丁 | 亥 | 午 | 壬 + 甲 | Đông |
| 丑 | 庚 | 乙 | 庚 | 乙 | 子 | 申 | 庚 + 癸 | Đông |

### 1.3 Theo nhóm tam hợp

Đào Hoa, Dịch Mã, Tướng Tinh, Hoa Cái: tra theo nhóm của **chi năm và chi ngày** (hai nhóm, lấy hợp hai tập đích). Tai Sát: **chỉ** chi năm.

| Nhóm tam hợp | Đào Hoa | Dịch Mã | Tướng Tinh | Hoa Cái | Tai Sát |
|---|---|---|---|---|---|
| 申子辰 | 酉 | 寅 | 子 | 辰 | 午 |
| 寅午戌 | 卯 | 申 | 午 | 戌 | 子 |
| 巳酉丑 | 午 | 亥 | 酉 | 丑 | 卯 |
| 亥卯未 | 子 | 巳 | 卯 | 未 | 酉 |

### 1.4 Quy tắc đặc biệt

| Sao | Quy tắc |
|---|---|
| Từ Quán | **can năm** → chi Lộc của can năm (cột «Lộc» ở §1.1, đọc theo can năm) |
| Thái Cực, Thiên Trù | hợp của đích theo can ngày **và** đích theo can năm |
| Khôi Cương | nhật trụ ∈ {庚辰, 庚戌, 壬辰, 戊戌} |
| Thập Linh | nhật trụ ∈ {甲辰, 乙亥, 丙辰, 丁酉, 戊午, 庚戌, 庚寅, 辛亥, 壬寅, 癸未} |
| Thiên Xá | nhật trụ theo mùa: Xuân 戊寅 · Hạ 甲午 · Thu 戊申 · Đông 甲子 |
| Tứ Phế | nhật trụ theo mùa: Xuân 庚申 辛酉 · Hạ 壬子 癸亥 · Thu 甲寅 乙卯 · Đông 丙午 丁巳 |
| Kim Thần | **giờ trụ** ∈ {乙丑, 己巳, 癸酉} |
| Tam Kỳ | 4 can có đủ một bộ: 甲戊庚 / 乙丙丁 / 辛壬癸 (bộ đầu tìm thấy theo thứ tự này) |
| Quốc Ấn | `noble-stars` (cột cuối §1.1) — không có trong `computeShensha` |

## 2. Sáu mươi Giáp Tý — nhật trụ → nạp âm, danh xưng, giọng, sao theo nhật trụ

Dùng để tra nhanh `STAT-NAPAM`, `STAT-TINHKHI` và các Đặc Tính chỉ phụ thuộc nhật trụ. Cột cuối chỉ liệt kê sao **chỉ** do nhật trụ quyết định (Thiên Xá / Tứ Phế còn cần đúng mùa sinh).

| # | Nhật trụ | Nạp âm | Danh xưng | Giọng | Sao theo nhật trụ |
|---|---|---|---|---|---|
| 1 | 甲子 | 海中金 | Hải Để Kim | `truc` | Thiên Xá (Đông) |
| 2 | 乙丑 | 海中金 | Hải Để Kim | `nhu` | — |
| 3 | 丙寅 | 炉中火 | Lô Trung Hỏa | `nhiet` | — |
| 4 | 丁卯 | 炉中火 | Lô Trung Hỏa | `te` | — |
| 5 | 戊辰 | 大林木 | Đại Lâm Mộc | `tram` | — |
| 6 | 己巳 | 大林木 | Đại Lâm Mộc | `hoa` | — |
| 7 | 庚午 | 路旁土 | Lộ Bàng Thổ | `cuong` | — |
| 8 | 辛未 | 路旁土 | Lộ Bàng Thổ | `thanh` | — |
| 9 | 壬申 | 剑锋金 | Kiếm Phong Kim | `phong` | — |
| 10 | 癸酉 | 剑锋金 | Kiếm Phong Kim | `tinh` | — |
| 11 | 甲戌 | 山头火 | Sơn Đầu Hỏa | `truc` | — |
| 12 | 乙亥 | 山头火 | Sơn Đầu Hỏa | `nhu` | Thập Linh |
| 13 | 丙子 | 涧下水 | Giản Hạ Thủy | `nhiet` | — |
| 14 | 丁丑 | 涧下水 | Giản Hạ Thủy | `te` | — |
| 15 | 戊寅 | 城头土 | Thành Đầu Thổ | `tram` | Thiên Xá (Xuân) |
| 16 | 己卯 | 城头土 | Thành Đầu Thổ | `hoa` | — |
| 17 | 庚辰 | 白蜡金 | Bạch Lạp Kim | `cuong` | Khôi Cương |
| 18 | 辛巳 | 白蜡金 | Bạch Lạp Kim | `thanh` | — |
| 19 | 壬午 | 杨柳木 | Dương Liễu Mộc | `phong` | — |
| 20 | 癸未 | 杨柳木 | Dương Liễu Mộc | `tinh` | Thập Linh |
| 21 | 甲申 | 泉中水 | Tuyền Trung Thủy | `truc` | — |
| 22 | 乙酉 | 泉中水 | Tuyền Trung Thủy | `nhu` | — |
| 23 | 丙戌 | 屋上土 | Ốc Thượng Thổ | `nhiet` | — |
| 24 | 丁亥 | 屋上土 | Ốc Thượng Thổ | `te` | — |
| 25 | 戊子 | 霹雳火 | Tích Lịch Hỏa | `tram` | — |
| 26 | 己丑 | 霹雳火 | Tích Lịch Hỏa | `hoa` | — |
| 27 | 庚寅 | 松柏木 | Tùng Bách Mộc | `cuong` | Thập Linh |
| 28 | 辛卯 | 松柏木 | Tùng Bách Mộc | `thanh` | — |
| 29 | 壬辰 | 长流水 | Trường Lưu Thủy | `phong` | Khôi Cương |
| 30 | 癸巳 | 长流水 | Trường Lưu Thủy | `tinh` | — |
| 31 | 甲午 | 沙中金 | Sa Trung Kim | `truc` | Thiên Xá (Hạ) |
| 32 | 乙未 | 沙中金 | Sa Trung Kim | `nhu` | — |
| 33 | 丙申 | 山下火 | Sơn Hạ Hỏa | `nhiet` | — |
| 34 | 丁酉 | 山下火 | Sơn Hạ Hỏa | `te` | Thập Linh |
| 35 | 戊戌 | 平地木 | Bình Địa Mộc | `tram` | Khôi Cương |
| 36 | 己亥 | 平地木 | Bình Địa Mộc | `hoa` | — |
| 37 | 庚子 | 壁上土 | Bích Thượng Thổ | `cuong` | — |
| 38 | 辛丑 | 壁上土 | Bích Thượng Thổ | `thanh` | — |
| 39 | 壬寅 | 金箔金 | Kim Bạc Kim | `phong` | Thập Linh |
| 40 | 癸卯 | 金箔金 | Kim Bạc Kim | `tinh` | — |
| 41 | 甲辰 | 覆灯火 | Phúc Đăng Hỏa | `truc` | Thập Linh |
| 42 | 乙巳 | 覆灯火 | Phúc Đăng Hỏa | `nhu` | — |
| 43 | 丙午 | 天河水 | Thiên Hà Thủy | `nhiet` | Tứ Phế (Đông) |
| 44 | 丁未 | 天河水 | Thiên Hà Thủy | `te` | — |
| 45 | 戊申 | 大驿土 | Đại Dịch Thổ | `tram` | Thiên Xá (Thu) |
| 46 | 己酉 | 大驿土 | Đại Dịch Thổ | `hoa` | — |
| 47 | 庚戌 | 钗钏金 | Thoa Xuyến Kim | `cuong` | Khôi Cương, Thập Linh |
| 48 | 辛亥 | 钗钏金 | Thoa Xuyến Kim | `thanh` | Thập Linh |
| 49 | 壬子 | 桑柘木 | Tang Chá Mộc | `phong` | Tứ Phế (Hạ) |
| 50 | 癸丑 | 桑柘木 | Tang Chá Mộc | `tinh` | — |
| 51 | 甲寅 | 大溪水 | Đại Khê Thủy | `truc` | Tứ Phế (Thu) |
| 52 | 乙卯 | 大溪水 | Đại Khê Thủy | `nhu` | Tứ Phế (Thu) |
| 53 | 丙辰 | 沙中土 | Sa Trung Thổ | `nhiet` | Thập Linh |
| 54 | 丁巳 | 沙中土 | Sa Trung Thổ | `te` | Tứ Phế (Đông) |
| 55 | 戊午 | 天上火 | Thiên Thượng Hỏa | `tram` | Thập Linh |
| 56 | 己未 | 天上火 | Thiên Thượng Hỏa | `hoa` | — |
| 57 | 庚申 | 石榴木 | Thạch Lựu Mộc | `cuong` | Tứ Phế (Xuân) |
| 58 | 辛酉 | 石榴木 | Thạch Lựu Mộc | `thanh` | Tứ Phế (Xuân) |
| 59 | 壬戌 | 大海水 | Đại Hải Thủy | `phong` | — |
| 60 | 癸亥 | 大海水 | Đại Hải Thủy | `tinh` | Tứ Phế (Hạ) |

Nhận xét: 庚戌 là nhật trụ duy nhất vừa Khôi Cương vừa Thập Linh. Không nhật trụ nào vừa Thiên Xá vừa Tứ Phế.

## 3. Bộ ca — mỗi Đặc Tính một lá số

| Đặc Tính | Lá số (chạy lại) | Tứ trụ | `at` (engine) |
|---|---|---|---|
| `PERK-tianYi` | 1967-06-07 06:15 nữ | 丁未 丙午 壬寅 癸卯 | ["卯"] |
| `PERK-wenChang` | 1967-06-07 06:15 nữ | 丁未 丙午 壬寅 癸卯 | ["寅"] |
| `PERK-luShen` | 1972-04-05 10:15 nam | 壬子 甲辰 丙寅 癸巳 | ["巳"] |
| `PERK-yangRen` | 2002-09-05 09:00 nữ | 壬午 戊申 丙子 癸巳 | ["午"] |
| `PERK-xueTang` | 1960-12-15 17:30 nữ | 庚子 戊子 丁丑 己酉 | ["酉"] |
| `PERK-taoHua` | 1967-06-07 06:15 nữ | 丁未 丙午 壬寅 癸卯 | ["卯"] |
| `PERK-yiMa` | 1972-04-05 10:15 nam | 壬子 甲辰 丙寅 癸巳 | ["寅"] |
| `PERK-jiangXing` | 1967-06-07 06:15 nữ | 丁未 丙午 壬寅 癸卯 | ["午","卯"] → bậc II |
| `PERK-huaGai` | 1967-06-07 06:15 nữ | 丁未 丙午 壬寅 癸卯 | ["未"] |
| `PERK-tianYiMed` | 2003-10-06 16:00 nữ | 癸未 辛酉 壬子 戊申 | ["申"] |
| `PERK-tianDe` | 1972-04-05 10:15 nam | 壬子 甲辰 丙寅 癸巳 | ["壬"] |
| `PERK-yueDe` | 1967-06-07 06:15 nữ | 丁未 丙午 壬寅 癸卯 | ["丙"] |
| `PERK-yueDeHe` | 1960-12-15 17:30 nữ | 庚子 戊子 丁丑 己酉 | ["丁"] |
| `PERK-tianDeHe` | 1967-06-07 06:15 nữ | 丁未 丙午 壬寅 癸卯 | ["寅"] |
| `PERK-dexiu` | 1972-04-05 10:15 nam | 壬子 甲辰 丙寅 癸巳 | ["壬","甲"] → luôn bậc I |
| `PERK-ciGuan` | 1967-06-07 06:15 nữ | 丁未 丙午 壬寅 癸卯 | ["午"] (Lộc của can năm 丁) |
| `PERK-jinYu` | 1950-06-07 05:00 nữ | 庚寅 壬午 癸酉 乙卯 | ["寅"] |
| `PERK-hongYan` | 1972-04-05 10:15 nam | 壬子 甲辰 丙寅 癸巳 | ["寅"] |
| `PERK-kuiGang` | 1990-11-23 07:15 nam | 庚午 丁亥 壬辰 甲辰 | ["壬辰"] |
| `PERK-taiJi` | 1967-06-07 06:15 nữ | 丁未 丙午 壬寅 癸卯 | ["卯"] |
| `PERK-tianChu` | 1967-06-07 06:15 nữ | 丁未 丙午 壬寅 癸卯 | ["午","寅"] → bậc II |
| `PERK-liuXia` | 2003-04-27 03:00 nữ | 癸未 丙辰 庚午 戊寅 | ["辰"] |
| `PERK-xueRen` | 1967-06-07 06:15 nữ | 丁未 丙午 壬寅 癸卯 | ["卯"] |
| `PERK-zaiSha` | 2002-09-05 09:00 nữ | 壬午 戊申 丙子 癸巳 | ["子"] |
| `PERK-shiLing` | 1967-06-07 06:15 nữ | 丁未 丙午 壬寅 癸卯 | ["壬寅"] |
| `PERK-tianShe` | 1974-06-22 12:30 nam | 甲寅 庚午 甲午 庚午 | ["甲午"] (Hạ) |
| `PERK-siFei` | 1967-06-17 01:30 nữ | 丁未 丙午 壬子 辛丑 | ["壬子"] (Hạ) |
| `PERK-jinShen` | 1950-06-03 18:45 nữ | 庚寅 辛巳 己巳 癸酉 | ["癸酉"] |
| `PERK-sanQi` | 1990-02-18 13:00 nam | 庚午 戊寅 甲寅 辛未 | ["甲","戊","庚"] (thiên kỳ) |
| `PERK-guoYin` | 1967-06-07 06:15 nữ | 丁未 丙午 壬寅 癸卯 | `noble-stars` (壬 → 未 ở trụ năm) |

Lá 1967-06-07 06:15 nữ (Dị Cách bại, `從財格`) mang **13** Đặc Tính cùng lúc — dùng làm ca «nhiều sao» cho kiểm thử giao diện (gom nhóm hạt ngọc trên màn hẹp, 04-12 §2.5).

## 4. Bộ ca — mỗi cách × chất lượng một lá số

58 tổ hợp (cách, chất lượng) xuất hiện trong 20.000 lá. Tổ hợp không xuất hiện (vd `化木格/败格`, `正財格/成格`) ghi «chưa gặp» — không có nghĩa engine không sinh được.

| Cách | 成格 | 有救 | 败格 |
|---|---|---|---|
| 正官格 | 1972-09-20 03:30 nam (74) | 1972-04-05 10:15 nam (50) | 2004-05-22 06:00 nam (34) |
| 七殺格 | 2006-01-03 01:00 nam (60) | 1968-05-02 04:30 nam (48) | 1961-06-07 20:45 nam (26) |
| 正財格 | chưa gặp | 1967-06-17 01:30 nữ (44) | 1978-09-11 03:15 nữ (29) |
| 偏財格 | 1988-03-07 00:45 nam (56) | 2008-07-24 19:00 nữ (32) | 1969-05-27 11:30 nam (35) |
| 正印格 | 1989-06-07 17:15 nam (41) | 2009-04-16 01:30 nam (56) | 1991-05-01 08:45 nữ (49) |
| 偏印格 | 1959-11-20 11:30 nữ (54) | chưa gặp | 2003-04-27 03:00 nữ (44) |
| 食神格 | 1984-11-14 21:00 nam (81) | 1958-07-19 10:00 nam (63) | 1970-10-23 14:00 nữ (46) |
| 傷官格 | 1981-02-14 10:15 nam (71) | 1950-06-03 18:45 nữ (52) | 1965-02-12 17:30 nữ (39) |
| 建祿格 | 1951-09-18 18:15 nữ (40) | 1970-01-03 00:15 nam (42) | 2005-03-22 21:15 nam (39) |
| 月劫格 | 2007-04-24 12:15 nữ (58) | 1951-11-05 01:30 nữ (44) | 1952-11-23 04:00 nam (28) |
| 羊刃格 | 2008-03-25 01:15 nữ (40) | 1974-09-16 06:00 nữ (38) | 1955-03-24 18:15 nữ (23) |
| 從財格 | 1960-08-28 00:15 nữ (72) | 1982-07-18 13:00 nam (57) | 1967-06-07 06:15 nữ (51) |
| 從殺格 | 1960-12-15 17:30 nữ (61) | 2002-09-05 09:00 nữ (52) | 1993-12-22 20:45 nam (59) |
| 從兒格 | 1983-08-18 16:00 nam (64) | 1989-04-26 01:15 nữ (65) | 1974-06-22 12:30 nam (61) |
| 從旺格 | 1967-06-23 09:15 nữ (72) | 1964-03-19 11:30 nam (74) | 1972-04-03 03:15 nam (60) |
| 曲直格 | 1995-04-03 00:00 nữ (**37**) | chưa gặp | chưa gặp |
| 炎上格 | 1954-07-10 10:45 nam (58) | chưa gặp | chưa gặp |
| 稼穡格 | 2003-07-25 08:00 nữ (46) | chưa gặp | chưa gặp |
| 從革格 | 1968-10-17 18:30 nữ (74) | chưa gặp | chưa gặp |
| 潤下格 | 1960-07-04 21:45 nữ (**36**) | chưa gặp | chưa gặp |
| 化土格 | 1991-01-24 15:15 nam (78) | 1981-06-20 12:30 nam (62) | 1952-04-28 09:45 nữ (43) |
| 化金格 | 1992-09-16 08:15 nữ (74) | chưa gặp | chưa gặp |
| 化水格 | 1957-11-20 08:45 nam (51) | chưa gặp | chưa gặp |
| 化木格 | 1989-10-09 14:00 nam (53) | chưa gặp | chưa gặp |
| 化火格 | 1977-07-25 11:30 nam (69) | 1980-02-15 21:45 nam (73) | 1957-04-01 11:30 nam (49) |

(Số trong ngoặc là Tiềm Lực.) Ca đáng chú ý cho kiểm thử giao diện và an toàn ngôn từ:

- **Dị Cách thành mà Tiềm Lực thấp**: `曲直格` 37 điểm, `潤下格` 36 điểm — lộ Dị Cách không gắn với điểm cao.
- **Thuận Thiên Tiềm Lực 41** (`正印格/成格`, 1989-06-07 17:15 nam) — Thuận Thiên không gắn với điểm cao.
- **Nghịch Thiên Tiềm Lực 59–61** (`從殺格/败格`, `從兒格/败格`) — bại cách không gắn với điểm thấp.

## 5. Bộ ca — Túc Nghiệp (6 cõi)

| Cõi | Lá số | Tham / Sân / Si · thiện / định / bố |
|---|---|---|
| 天道 Thiên | 1980-08-18 15:45 nam | 0 / 20 / 33 · 88 / 70 / 15 |
| 人道 Nhân | 1972-04-05 10:15 nam | 8 / 60 / 33 · 75 / 30 / 30 |
| 阿修罗道 A Tu La | 1951-11-05 01:30 nữ | 8 / 70 / 27 · 27 / 7 / 50 |
| 畜生道 Súc Sinh (Linh Thú) | 1998-03-09 17:00 nam | 24 / 17 / 53 · 12 / 0 / 5 |
| 饿鬼道 Ngạ Quỷ | 1967-06-07 06:15 nữ | 83 / 57 / 53 · 36 / 0 / 20 |
| 地狱道 Địa Ngục | 2003-04-27 03:00 nữ | 24 / 97 / 27 · 71 / 47 / 15 |

Ca `地狱道` này có **thiện 71** — kiểm thử rằng giao diện không suy diễn «người xấu» từ cõi (thiện cao vẫn có thể Địa Ngục vì Sân 97 trội).

## 6. Bộ ca — Mệnh Cấp, Thân Lực, Phúc phận, Quý Khí

### 6.1 Mệnh Cấp

| `level` | Lá số | Tiềm Lực | Đạt / thô |
|---|---|---|---|
| 极品 Cực Phẩm | 1963-07-20 11:15 nữ | **51** | 6 / 6 |
| 贵格 Quý Cách | 1950-06-07 05:00 nữ | 52 | 5 / 5 |
| 富格 Phú Cách | 1961-07-05 01:45 nữ | **41** | 4 / 4 |
| 清贵 Thanh Quý | 1967-06-07 06:15 nữ | 51 | 3 / 3 |
| 常格 Thường Cách | 2003-04-27 03:00 nữ | 44 | 2 / 2 |
| 下格 Ngọc Trong Đá | 1964-08-21 10:00 nam | 13 | 1 / 3 (chặn vì < 22) |

Cực Phẩm ở Tiềm Lực 51 — Mệnh Cấp đo tiêu chí cổ pháp, không phải điểm. Ca này kiểm thử rằng khung tên «Cực Phẩm» không kéo theo bất kỳ thưởng số nào.

### 6.2 Thân Lực

| Mức | Lá số | `effRatio` |
|---|---|---|
| Thân quá vượng | 1980-08-18 15:45 nam | 0.874 |
| Thân vượng | 2003-04-27 03:00 nữ | 0.518 |
| Thân trung hòa | 1990-11-23 07:15 nam | 0.499 (`strong: false`) |
| Thân nhược | 1990-02-18 13:00 nam | 0.399 |
| Thân quá nhược | 1967-06-07 06:15 nữ | 0.225 |

Cặp trung hòa `MAU-H` (0,501, `strong: true`) và 1990-11-23 07:15 nam (0,499, `strong: false`) kiểm thử rằng nhãn giống nhau nhưng hướng Phù Ức khác — game chỉ dùng nhãn, không dùng `strong` để đổi lối chơi.

### 6.3 Phúc phận

| Bậc | Lá số | Tiềm Lực |
|---|---|---|
| đại phú quý | 1969-11-27 15:15 nam | 75 (đúng ngưỡng) |
| phú quý | 1960-12-15 17:30 nữ | 61 |
| tiểu phú quý | 1967-06-07 06:15 nữ | 51 |
| khá no | 2003-04-27 03:00 nữ | 44 |
| bình | 2008-07-24 19:00 nữ | 32 |
| tiềm năng ẩn | 1952-11-23 04:00 nam | 28 |

### 6.4 Quý Khí

| Mức | Lá số | Điểm |
|---|---|---|
| 贵气显赫 | 1950-06-03 18:45 nữ | 7 |
| 贵气中上 | 1967-06-07 06:15 nữ | 4 |
| 贵气平平 | 1960-12-15 17:30 nữ | 2 |
| 贵气微薄 | 1950-06-07 05:00 nữ | 0 |

## 7. Bộ ca — ranh Phẩm căn

Mỗi ngưỡng có một lá **đúng ở ngưỡng** và một lá **ngay dưới** (khi tìm được):

| Tiềm Lực | Lá số | Phẩm căn kỳ vọng |
|---|---|---|
| 27 | 1956-09-20 17:30 nam | Phàm Căn |
| 28 | 1952-11-23 04:00 nam | Ngũ Linh Căn |
| 35 | 1969-05-27 11:30 nam | Ngũ Linh Căn |
| 36 | 2006-02-28 07:15 nữ | Tứ Linh Căn |
| 42 | 1965-07-24 21:00 nữ | Tứ Linh Căn |
| 43 | 1988-04-14 03:00 nữ | Tứ Linh Căn thuận |
| 49 | 1991-05-01 08:45 nữ | Tứ Linh Căn thuận |
| 50 | 1972-04-05 10:15 nam | Tam Linh Căn |
| 57 | 1980-08-18 15:45 nam | Tam Linh Căn |
| 58 | 1981-02-27 **23:15** nam | Tam Linh Căn thượng (đồng thời là ca giờ Tý) |
| 65 | 1989-04-26 01:15 nữ | Tam Linh Căn thượng |
| 66 | 2001-04-23 20:00 nữ | Song Linh Căn |
| 72 | 1993-02-08 **23:15** nam | Song Linh Căn (giờ Tý) |
| 73 | 1980-02-15 21:45 nam | Song Linh Căn thượng |
| 79 | 1984-11-24 **23:00** nam | Song Linh Căn thượng (đúng phút đổi ngày) |
| 80 | 1993-09-04 06:15 nữ | Dị Linh Căn |
| 86 | `MAU-L` 1999-03-07 16:15 nữ | Thiên Linh Căn |

## 8. Bộ ca — Thời Vận 2026

| Rating đại vận | Lá số | Đại vận, điểm |
|---|---|---|
| Đại cát | 1950-06-07 05:00 nữ | 甲戌, 5 |
| Cát | 1972-04-05 10:15 nam | 己酉, 2 |
| Hơi thuận | 1960-12-15 17:30 nữ | 辛巳, 1 |
| Bình hòa | 1990-02-18 13:00 nam | 壬午, 0 |
| Hơi nghịch | 1991-05-01 08:45 nữ | 丙申, −1 |
| Hung | 2003-04-27 03:00 nữ | 己未, −3 |
| Đại hung | 1967-06-07 06:15 nữ | 辛亥, −7 |

| Rating lưu niên | Lá số | Điểm (丙午) |
|---|---|---|
| Đại cát | 1967-06-07 06:15 nữ | 74 |
| Cát | 1952-11-23 04:00 nam | 59 |
| Bình | 2003-04-27 03:00 nữ | 43 |
| Hơi kỵ | 1980-08-18 15:45 nam | 34 |
| Hung | 2006-02-28 07:15 nữ | 13 |
| Đại hung | 1960-12-15 17:30 nữ | **−1** (điểm âm — kiểm thử giao diện không vỡ, không hiện số âm ở mặt trước) |

Lá 1967-06-07 06:15 nữ: đại vận **Đại hung** nhưng lưu niên **Đại cát** cùng năm — kiểm thử vòng Thời Vận hiện hai tầng độc lập, R2 lấy +4% của lưu niên, R3 lấy +15% của đại vận.

## 9. Checklist nghiệm thu phần 04-19

- [ ] Bảng §1 sinh tự động từ hằng số engine (không gõ tay) và có kiểm thử so khớp.
- [ ] Mỗi Đặc Tính, mỗi cõi, mỗi Mệnh Cấp, mỗi mức Thân Lực, mỗi Phúc phận, mỗi Quý Khí, mỗi rating Thời Vận có ít nhất một ca chạy trong `scripts/test-game-menhban.mjs`.
- [ ] Ca điểm âm lưu niên không làm vỡ giao diện.
- [ ] Ca 13 Đặc Tính (và ca 18 Đặc Tính lớn nhất quần thể, 04-18 §1.1) hiển thị đúng trên màn 375 px.
