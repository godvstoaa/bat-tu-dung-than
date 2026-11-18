# 02 — Thành quách Nhật Bản thời Edo (tiên phủ «nhatban»)

Nghiên cứu cho 10 nhà + 6 đình / lầu góc + Thiên Thủ Các + giả sơn trong `list-2-nhatban.txt`.
Nguyên mẫu chính: Thành Himeji (姫路城) cho tenshu, yagura, cổng; Ninomaru Goten của Thành Nijō (二条城二の丸御殿)
cho các dinh shoin-zukuri; Katsura Rikyū (桂離宮) cho trà thất và đình vườn kiểu sukiya-zukuri.

Ký hiệu độ tin cậy dùng trong bảng:
- **[Đo]**: số có trong nguồn chính thức hoặc nguồn có trích dẫn.
- **[Blog]**: số chỉ có ở một trang cá nhân hoặc trang phụ; dùng được nhưng cần kiểm lại.
- **[Suy]**: tự suy ra; cách suy ghi ngay bên cạnh.
- **[Ước]**: ước lượng theo thông lệ hoặc theo tỉ lệ ảnh, chưa có nguồn đo; phải kiểm lại trước khi dựng chi tiết.

Giới hạn của phiên này:
- Đã dùng hết hạn mức WebSearch giữa chừng. Phần sau chỉ dùng WebFetch vào trang đã biết.
- Không truy cập được các tên miền `kojodan.jp`, `city.himeji.lg.jp`, `online.bunka.go.jp`, `city.hikone.lg.jp`.
  Số từ các trang này lấy từ đoạn trích trong kết quả tìm kiếm, không phải từ việc mở trang.

---

## 0. Tóm tắt nhanh: khung hiện tại sai tỉ lệ ở đâu

| id | Khung hiện tại (rộng × sâu, m) | Thật (m) | Lỗi chính | Khung đề xuất ở tỉ lệ 1:1 (m) |
|---|---|---|---|---|
| tower | Vuông, cạnh 34 → 22 m; bệ đá 8 m; tầng 5 m | Tầng 1 Himeji 13 × 10 間 (≈ 25,6 × 19,7); bệ đá 14,85 m; thân 31,5 m | Mặt bằng phải là **chữ nhật** (tỉ lệ 1,3 : 1). Bệ đá quá thấp (0,15 thân; thật 0,47). Thu nhỏ dần đều thay vì thu theo **cặp tầng** | Xem mục Thiên Thủ Các: bệ 18 m, thân 40 m, tầng 1 thân 32,5 × 25 |
| main | 50 × 26 | ≈ 29 × 27 (784 m²) | Thật gần **vuông**, khung dài gấp 1,9 lần | 29 × 27 |
| shikidai | 34 × 18 | ≈ 18 × 18,5 (332 m²) | Khung dài gấp 1,9 lần | 18 × 18,5 |
| kuroshoin | 34 × 18 | ≈ 25 × 23 (569 m²) | Thật gần vuông | 25 × 23 |
| shiroshoin | 28 × 16 | ≈ 17 × 18,5 (318 m²) | Thật gần vuông (6 × 6 nhịp) | 17 × 18,5 |
| kesho | 40 × 12, 2 tầng | 7,8 × 3,3 間 ≈ 15,4 × 6,5 | Khung dài gấp 2,6 lần, sâu gấp 1,8 lần | 15,4 × 6,5 |
| kura | 34 × 12, 2 tầng | 17 × 3 間 ≈ 33,5 × 5,9; một tầng mái | Sâu gấp đôi | 33,5 × 6 |
| umaya | 44 × 12, thẳng | Chữ L: 25,2 × 5,9 + 31,1 × 5,9 | Sai hình (phải chữ L), sâu gấp đôi | L: 25,2 × 5,9 và 31,1 × 5,9 |
| masuW / masuE | Hai lầu 18 × 10 đứng hai bên cổng | Masugata = cổng ngoài kōraimon + sân vuông + cổng trong yaguramon, vuông góc | Sai **cấu trúc**, không chỉ kích thước | masuW = kōraimon ≈ 8 × 4, cao ≈ 8; masuE = yaguramon ≈ 19,7 × 7,9, cao ≈ 12 |
| chashitsu | 18 × 12 | 56 m² (Shōkintei) | Diện tích gấp 3,9 lần | ≈ 10 × 6 (thêm hiên đất 1,8 m phía Bắc) |
| summit | 9 × 9 | 2 × 1,5 間 ≈ 3,9 × 3,0 (12 m², Shōkatei) | Diện tích gấp ≈ 7 lần | 3,9 × 3,0 |
| yagura × 4 | 9 × 9 | 7,2 → 10 m vuông (2 tầng); ≈ 12,7 × 10,9 (3 tầng) | Khung 9 × 9 tạm được cho lầu 2 tầng; lầu 3 tầng cần lớn hơn | Xem từng mục |
| azumaya | 8 × 8 | 2,83 × 2,83 (Manji-tei) | Diện tích gấp 8 lần | 2,83 × 2,83 |
| machiai | 8 × 8 | 3 × 1 間 ≈ 5,5–5,9 × 1,8–2,0 (Soto-koshikake) | Sai hình (phải dài, nông) | 5,9 × 2,0 |

Lỗi cấu hình phong cách (đọc từ `src/game/tienphu/styles.js`, mục `nhatban`):
- `gate: 'torii'` là **sai**. Torii là cổng đền Thần đạo, thành quách không dùng. Cổng thành phải là kōraimon / yaguramon.
- `tower.n: 4` và `a: 17 − 0,667k` cho mặt bằng vuông thu đều. Himeji chữ nhật, thu theo bậc (xem bảng tầng).
- `podium: 8` là bệ đá quá thấp so với thân.

---

## 1. Phần chung của phong cách

### 1.1 Hệ đo: ken (間), shaku (尺), tatami (畳)

| Đại lượng | Giá trị | Nguồn |
|---|---|---|
| 1 shaku (尺) | 10/33 m ≈ 0,303 m | ja.wikipedia 間 [Đo] |
| 1 ken (間) chuẩn hiện đại / Edo-ma (江戸間, 田舎間) | 6 shaku ≈ 1,818 m | ja.wikipedia 間 [Đo] |
| Kyō-ma (京間, 本間) | 6 shaku 5 sun ≈ 1,97 m | ja.wikipedia 間 [Đo]; quy ra mét là [Suy] |
| Ken thời Edo (đo đạc đất) | 6 shaku 1 bu (6,01 shaku) | ja.wikipedia 間 [Đo] |
| Tatami Kyō-ma | 6 shaku 3 sun × 3 shaku 1 sun 5 bu ≈ 1,91 × 0,955 m | ja.wikipedia 間 [Đo]; quy đổi [Suy] |
| Tatami Edo-ma | 5 shaku 8 sun × 2 shaku 9 sun ≈ 1,76 × 0,88 m | ja.wikipedia 間 [Đo]; quy đổi [Suy] |

Quy tắc dùng trong dự án:
- Công trình vùng Kansai (Himeji, Nijō, Katsura, Osaka) quy đổi bằng **Kyō-ma 1,97 m** khi nguồn chỉ cho số 間.
  Công trình Edo (Sakuradamon, Fujimi-yagura) dùng **1,818 m**.
- Kyō-ma đặt chiếu theo kích thước chiếu (畳割), nên khoảng cột thật hơi lớn hơn 1,97 m.
  Edo-ma đặt cột theo lưới 6 shaku (柱割), nên chiếu nhỏ đi bằng bề dày cột.
  Nguồn chỉ nói chiếu bị hụt bởi bề rộng cột; cách gọi 畳割 / 柱割 là thông lệ [Ước].
- **Chú ý quan trọng:** trong dữ liệu Văn hóa sảnh (文化遺産オンライン), «桁行八間» là **số nhịp cột**, không phải chiều dài 8 × 1,97 m.
  Ví dụ Ōhiroma «桁行 8 間 × 梁間 7 間» nhưng rộng ≈ 29 m. Mỗi nhịp ở đây ≈ 3,6 m (≈ 2 ken).
  Không được nhân thẳng số nhịp với 1,97 m.
- Một số hiếm nguồn ghi số lẻ như «7 間 8 分» (Keshō-yagura). Đó là chiều dài theo ken, quy đổi bình thường.

### 1.2 Hai «thể» trong cùng phong cách

| Thể | Dùng cho | Đặc điểm nhận diện |
|---|---|---|
| **Thành quách** (城郭) | tenshu, yagura, cổng, kho, chuồng ngựa, Keshō-yagura | Bệ đá thành nghiêng cong (ishigaki); tường trát vữa vôi trắng toàn bộ (白漆喰総塗籠, 大壁) che kín cột; cửa sổ nhỏ có song gỗ; lỗ bắn (狭間) hình tròn, tam giác, vuông, chữ nhật đứng; hộc thả đá (石落とし) ở góc; mái ngói xám nhiều tầng với các đầu hồi trang trí |
| **Dinh thự shoin-zukuri** (書院造) | main, shikidai, kuroshoin, shiroshoin | Một tầng; nền gỗ nâng trên cột (sàn gỗ, có hiên); **cột gỗ vuông vát cạnh lộ ra** (真壁); mảng tường trắng chỉ ở phần trên (小壁); mái irimoya ngói rất to và cao; các nhà xếp chéo kiểu «nhạn bay» (雁行) nối bằng hành lang |
| **Sukiya-zukuri** (数寄屋造) | chashitsu, summit, azumaya, machiai | Nhỏ; cột còn vỏ cây hoặc vỏ một phần (皮付柱, 面皮柱); tường đất màu vàng nâu; mái tranh (茅葺) hoặc ván mỏng (杮葺); không đối xứng |

### 1.3 Quy tắc tỉ lệ có nguồn

| Quy tắc | Giá trị | Nguồn |
|---|---|---|
| Tenshu Himeji: bệ đá / thân gỗ | 14,85 / 31,5 = 0,47 | ja.wikipedia 姫路城; shirofan [Đo] |
| Tenshu Himeji: số mái / số sàn | 5 tầng mái (重), 6 sàn (階) + 1 tầng hầm | Văn hóa sảnh (五重六階、地下一階付) [Đo] |
| «重» và «階» | 重 = số lớp mái nhìn bên ngoài; 階 = số sàn bên trong | ja.wikipedia 天守 (dẫn Miura Masayuki) [Đo] |
| Tenshu Himeji thuộc kiểu | **Vọng lâu hình (望楼型)** kiểu muộn, và **liên lập thức (連立式)** | ja.wikipedia 天守 [Đo] |
| Vọng lâu hình | Một khối lầu mái irimoya lớn ở dưới, đặt lầu vọng nhỏ lên trên. Mái gốc **luôn** tạo một đầu hồi irimoya lớn | ja.wikipedia 天守 [Đo] |
| Tầng tháp hình (層塔型) | Giống tháp năm tầng: các tầng là hình chữ nhật đều, thu nhỏ đều | ja.wikipedia 天守 [Đo] |
| Thu nhỏ tầng của tháp ba tầng điển hình (Fujimi-yagura Edo) | 7 × 6 間 → 6 × 5 間 → 4,5 × 3,5 間 | artexhibition.jp (香原斗志) [Blog] |
| Lỗ sàn hộc thả đá | ≈ 20 cm | ja.wikipedia 石落とし [Đo] |
| Bề dày tường trát có lỗ bắn | 20–30 cm | ja.wikipedia 狭間 [Đo] |
| Phòng trà sōan | 2 → 8 chiếu; thường 4,5 chiếu trở xuống | en.wikipedia Shoin-zukuri, Sukiya-zukuri [Đo] |
| Độ dốc mái, độ vươn hiên | **Không tìm được nguồn đo** trong phiên này | Dùng [Ước] bên dưới, phải đo lại trên ảnh chính diện |

Giá trị ước lượng tạm dùng [Ước]:
- Mái ngói thành quách và dinh: dốc ≈ 28–35°, mặt mái hơi lõm (反り) rất nhẹ.
- Góc mái chỉ hơi nhích lên. Đường mép hiên gần như thẳng khi nhìn chính diện.
- Hiên vươn ra ≈ 1,2–1,8 m ở tenshu và yagura, ≈ 2–2,5 m ở dinh shoin.
- Mái tranh sukiya dốc hơn, ≈ 40–45°, dày 40–60 cm ở mép.

### 1.4 Bảng màu và vật liệu chung

| Phần | Vật liệu | Hex gần đúng | Ghi chú |
|---|---|---|---|
| Tường thành, tenshu, yagura | Vữa vôi trắng 白漆喰 (大壁, phủ kín cột) | `#F2F0EA` | Trắng hơi ngà, không trắng tinh |
| Mái ngói | Ngói hun xám いぶし瓦 (本瓦葺: ngói ống + ngói lòng máng) | `#5E6266` | Ở Himeji các mạch ngói trát vữa trắng, nhìn từ xa thành xám nhạt `#8E9196` |
| Vữa mạch ngói Himeji | 目地漆喰 | `#E8E6E0` | Tạo sọc trắng dọc mái, là đặc trưng «Bạch Lộ» |
| Đá thành | Đá granite / sa thạch xám | `#9C968A`, mạch tối `#6E695F` | Góc xếp kiểu 算木積 (đá dài xen kẽ) |
| Gỗ lộ ra (shoin, cổng 真壁) | Bách hinoki, zelkova đã phong hóa | `#7A5C40` | Cột vuông vát cạnh |
| Song cửa sổ thành | Gỗ sơn đen hoặc trát trắng | `#1C1A18` / `#F2F0EA` | Hishi-no-mon: song sơn mài đen, phụ kiện mạ vàng |
| Phụ kiện kim loại | Đồng mạ vàng (飾金具) | `#C9A24A` | Đầu hồi, 懸魚, chốt cửa, nageshi |
| Hiên gỗ, sàn hiên | Gỗ trần | `#9A7B58` | |
| Mái vỏ bách (檜皮葺) | Vỏ cây bách | `#5A3E2E` | Kurumayose của Nijō |
| Mái ván mỏng (杮葺) | Ván gỗ chẻ | `#7A6A55` khi phong hóa | Umaya Hikone, phần trà thất của Shōkintei |
| Mái tranh (茅葺) | Cỏ tranh | `#8C7A5A` | Shōkintei, Shōkatei, Manji-tei, Soto-koshikake |
| Tường đất sukiya | Đất trát 聚楽 | `#C8A97E` | |
| Ván ốp tường thấp | 簓子下見板 (ván chồng, có nẹp) | `#3A2E26` | Umaya Hikone, phần dưới tường |
| Chiếu tatami | Cói | `#C9C08A` | |
| Vách giấy shōji | Giấy washi | `#F4F1E6` | |
| Fusuma vẽ nền vàng (nội thất) | Lá vàng | `#D4AF37` | Ōhiroma, Tōzamurai |

### 1.5 Sai lầm hay gặp phải tránh

1. **Mái vểnh kiểu Trung Hoa.** Mái Nhật có góc chỉ hơi nhích lên, mép hiên nhìn chính diện gần như thẳng. Không có đầu đao cong vút, không có tượng thú xếp hàng trên sống mái. Trên nóc chỉ có **shachi** (鯱) hai đầu nóc và **onigawara** (鬼瓦) ở đầu sống.
2. **Cột đỏ, tường đỏ, mái vàng.** Himeji trắng và xám. Nijō là gỗ trần, tường trắng, mái xám, chỉ có điểm vàng ở đầu hồi.
3. **Torii làm cổng thành.** Sai. Torii là cổng đền.
4. **Thiên thủ mặt bằng vuông, thu đều.** Himeji chữ nhật. Tầng thu theo bậc, có những cặp tầng cùng kích thước: 1F ≈ 2F, 4F = 5F.
5. **Các tầng mái giống nhau như tháp chùa.** Himeji là vọng lâu hình. Hai mái dưới cùng bao một khối lớn, đầu hồi irimoya lớn ở mặt Đông và Tây. Các tầng trên mỗi mặt có **tổ hợp đầu hồi khác nhau**.
6. **Đặt chidori-hafu như đầu hồi kết cấu.** Chidori-hafu (千鳥破風) là đầu hồi tam giác đặt thẳng **lên mặt dốc** mái (据破風), không phải đầu hồi của mái chính. Kara-hafu (唐破風) là đầu hồi **cong lồi giữa, cong lõm hai bên** (むくり), riêng của Nhật.
7. **Bệ đá thẳng đứng như tường gạch.** Ishigaki nghiêng mạnh ở chân rồi đứng dần lên đỉnh (đường cong kiểu cánh quạt). Góc xếp đá dài xen kẽ (算木積).
8. **Cửa sổ lớn, có kính, đều đặn.** Thành chỉ có cửa sổ nhỏ có song đứng, lỗ bắn và hộc thả đá. Dinh shoin không có «cửa sổ». Mặt ngoài là cả dãy cửa trượt gỗ (舞良戸, 雨戸) và shōji giữa các cột.
9. **Shoin đặt trên bệ đá cao kiểu Trung Hoa.** Shoin có sàn gỗ nâng trên cột ngắn, quanh nhà là hiên gỗ. Chân nhà chỉ là đá kê thấp, không có bệ đá xây bậc.
10. **Hắc Thư Viện sơn đen, Bạch Thư Viện sơn trắng.** Sai. Ở Nijō hai nhà nhìn ngoài giống nhau. Khác nhau ở công năng và tranh nội thất: Kuroshoin vẽ màu hoa anh đào, tùng, mai; Shiroshoin vẽ mực tàu.
11. **Một lưới cửa sổ chạy đều quanh nhà.** Shoin chia mặt tiền theo nhịp cột. Các nhà xếp chéo kiểu nhạn bay, không thẳng hàng.

### 1.6 Phân biệt với phong cách gần

| Đặc điểm | Nhật (Edo) | Trung Hoa (Minh–Thanh) | Huế (Nguyễn) |
|---|---|---|---|
| Góc mái | Hơi nhích, mép hiên gần thẳng | Vểnh cong rõ, có đầu đao | Có đầu đao, uốn mềm, thường trang trí sành sứ |
| Màu chủ đạo | Trắng vữa + ngói xám + gỗ trần | Cột đỏ, ngói lưu ly vàng hoặc xanh, đấu củng sơn màu | Cột sơn son thếp vàng, ngói hoàng lưu ly |
| Đỉnh nóc | Shachi + onigawara | Long hôn, tiên nhân và thú xếp hàng | Bờ nóc gắn sành sứ, rồng chầu, hồ lô |
| Hệ đấu củng | Thành và dinh gần như **không lộ** đấu củng | Lộ đấu củng nhiều tầng, sơn màu | Có kẻ chuyền, ít đấu củng |
| Đầu hồi đặc trưng | Chidori-hafu, kara-hafu, irimoya-hafu chồng nhiều lớp trên một mặt | Hiết sơn, đầu hồi đỏ trang trí | Trùng thiềm điệp ốc (mái chồng 2 tầng liền) |
| Thành | Ishigaki cong + tường trát trắng phủ cột | Tường gạch thẳng đứng, lỗ châu mai răng cưa | Tường gạch kiểu Vauban + kỳ đài |
| Bệ nhà ở | Sàn gỗ nâng trên cột, có hiên gỗ | Đài đá (台基) có bậc, lan can đá | Nền gạch hoặc đá, có bậc |

---

## tower — Thiên Thủ Các (10 tầng)

### 1. Nguyên mẫu thật
- **Đại thiên thủ Thành Himeji** (姫路城大天守, Đại Thiên Thủ Cơ Lộ Thành), 1601–1609, Bảo vật quốc gia.
- Nhóm liên lập gồm đại thiên thủ, 3 tiểu thiên thủ (Đông, Càn, Tây) và 4 hành lang lầu (イ・ロ・ハ・ニの渡櫓).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Cao bệ đá (石垣) | 14,85 m | [Đo] ja.wiki, shirofan |
| Cao thân gỗ (tính tới nóc) | 31,5 m (31,49 m) | [Đo] |
| Tổng cao bệ + thân | 46,35 m; en.wiki ghi 46,4 m | [Đo] |
| Đỉnh so với mực nước biển | 92 m (đồi Himeyama cao 45,6 m) | [Đo] |
| Số mái / sàn | 5 重 / 6 階 + 1 tầng hầm | [Đo] Văn hóa sảnh |
| Tầng hầm | Đông–Tây ≈ 11,5 間, Nam–Bắc ≈ 8,5 間 (≈ 22,7 × 16,7 m) | [Đo] ken; quy ra mét [Suy] theo 1,97 m |
| Tầng 1 | 13 × 10 間 (≈ 25,6 × 19,7 m) | [Đo]/[Suy] |
| Tầng 2 | «gần giống tầng 1» | [Đo] |
| Tầng 3 | 11 × 8 間 (≈ 21,7 × 15,8 m) | [Đo]/[Suy] |
| Tầng 4 | 9 × 6 間 (≈ 17,7 × 11,8 m) | [Đo]/[Suy] |
| Tầng 5 | 9 × 6 間 | [Đo]/[Suy] |
| Tầng 6 (trên cùng) | 7 × 5 間 (≈ 13,8 × 9,9 m) | [Đo]/[Suy] |
| Diện tích sàn (en.wiki, dẫn sách hướng dẫn) | Hầm 385; T1 554; T2 550; T3 440; T4 240; T6 115 m². T5 không có | [Đo] |
| Tổng diện tích sàn | 2.400 m² | [Blog] shirofan |
| Hai cột cái (心柱) | Từ hầm tới dưới sàn T6. Cao 24,6 m. Đường kính gốc 95 cm (en.wiki: Đông 97 cm, Tây 85 × 95 cm) | [Đo] |
| Trọng lượng | ≈ 5.700 t | [Đo] |
| Số ngói | ≈ 75.000 viên | [Đo] |
| Shachi | 11 con trên đại thiên thủ. Bản thay 2012 cao ≈ 190 cm, nặng ≈ 300 kg | [Đo] ja.wiki |
| Hộc thả đá tầng 1 | 3 cái, ở góc Đông Bắc, Đông Nam, Tây Nam | [Đo] ja.wiki |
| Cửa sổ lồi có song (出格子窓) | Mái 1 mặt Đông rộng 4 間; mái 2 mặt Nam rộng 5 間 | [Đo] ja.wiki |
| Thời Hideyoshi (1581) | Tháp 3 tầng, ≈ 55 m² (để so sánh) | [Đo] en.wiki |

Mâu thuẫn số liệu và cách chọn:
- Diện tích sàn không khớp với số ken: 13 × 10 間 × 1,97² = 504 m², nhưng nguồn ghi 554 m².
  Tầng 3: 343 m² (theo ken) so với 440 m² (theo nguồn). Tầng 6: 136 m² so với 115 m².
- Có thể diện tích tính cả phần chìa ra (hộc thả đá, phòng đầu hồi 破風の間), hoặc ken ở Himeji không phải 1,97 m.
- **Chọn số ken làm chuẩn tỉ lệ mặt bằng**, vì cùng một nguồn và cùng đơn vị. Chiều dài tuyệt đối có sai số ±10%.

### 3. Cấu trúc từ dưới lên
1. **Bệ đá thiên thủ (天守台):** cao 14,85 m. Mặt đá nghiêng cong, chân thoải và đỉnh gần đứng. Góc xếp 算木積.
   Bên trong có tầng hầm (穴蔵), vào từ sân thiên thủ.
2. **Thân 1–2 (khối gốc vọng lâu):** tường trát trắng phủ kín cột.
   Hai cột cái xuyên suốt. Sàn treo ngang các cột phụ.
   Tầng 1 có hộc thả đá ở 3 góc và cửa sổ lồi có song ở mặt Đông.
3. **Đỡ mái:** không lộ đấu củng. Hiên mái đỡ bằng dầm và xà chìa (腕木, 出桁) giấu trong tường trát.
   Mép hiên trát trắng (軒裏塗籠).
4. **Mái** (theo tổng hợp các nguồn về bố trí đầu hồi, tính cho mặt Nam là mặt chính):

| Tầng mái | Mặt Nam / Bắc | Mặt Đông / Tây |
|---|---|---|
| 1 重 | Mái hiên (腰屋根) chạy quanh; mặt Nam chỉ có hiên và hộc thả đá góc | Kara-hafu hiên (軒唐破風) giữa mặt Đông, trên cửa sổ lồi 4 間 |
| 2 重 | Kara-hafu hiên giữa mặt Nam, dưới là cửa sổ lồi 5 間 | **Đầu hồi irimoya lớn** (mái gốc vọng lâu), chạm vào mái 3 重 |
| 3 重 | **Đầu hồi irimoya đôi** (比翼入母屋破風) | — |
| 4 重 | Chidori-hafu (千鳥破風) | Kara-hafu hiên |
| 5 重 | Kara-hafu hiên | Đầu hồi irimoya (mái chóp irimoya, nóc chạy Đông–Tây) |

   - Một số nguồn gọi đầu hồi 3 重 là «chidori-hafu đôi» (比翼千鳥破風), số khác gọi «irimoya đôi».
     Chọn **«irimoya đôi»** vì ja.wiki và đa số trang chuyên về thành thống nhất cách gọi này.
   - Sườn 5 重 tường để lộ cột (真壁), khác các tầng dưới trát kín.
5. **Đỉnh:** nóc chạy Đông–Tây. Mỗi đầu nóc một shachi. Đầu sống có onigawara.

### 4. Mặt bằng
- Chữ nhật, cạnh dài theo trục **Đông–Tây**. Tỉ lệ ≈ 1,3 : 1 ở tầng 1, ≈ 1,4 : 1 ở tầng 6.
- Hai cột cái đặt trên trục Đông–Tây, gần tâm.
- Mỗi tầng có lõi phòng (身舎) và hành lang vòng (武者走り) chạy sát tường ngoài.
- Cầu thang đặt lệch, các tầng không chồng thẳng hàng.
- Tầng 1 có hơn 330 chiếu [Đo en.wiki].
- Nối với tiểu thiên thủ Càn, Tây, Đông qua hành lang lầu, tạo sân trong kín (連立式).

### 5. Cấu kiện nhận diện (xếp theo mức quan trọng)
1. Bệ đá cao, chân thoải, nghiêng cong, góc xếp đá dài xen kẽ.
2. Thân trắng, mái xám có sọc vữa trắng.
3. **5 lớp mái**, mỗi mặt có một **tổ hợp đầu hồi riêng** (bảng mục 3). Mặt Nam là quan trọng nhất.
4. Đầu hồi irimoya lớn hai bên Đông–Tây ở mái 2 重 (dấu hiệu vọng lâu hình).
5. Kara-hafu cong ở mái 1 Đông, mái 2 Nam, mái 5 Nam–Bắc.
6. Chidori-hafu tam giác ở mái 4 Nam–Bắc. Irimoya đôi ở mái 3.
7. Shachi hai đầu nóc.
8. Cửa sổ lồi có song và hộc thả đá ở góc tầng 1.
9. Tường đầu hồi có lỗ bắn tròn, tam giác, vuông. Cửa sổ song đứng nhỏ.
10. Tiểu thiên thủ và hành lang lầu bao quanh (nếu đủ chỗ trong game).

### 6. Vật liệu và màu
- Bệ: đá xám `#9C968A`.
- Tường: vữa trắng `#F2F0EA`.
- Mái: ngói hun xám `#5E6266` với mạch vữa trắng; trung bình nhìn xa `#8E9196`.
- Song cửa và mép ván: xám tối `#3A3632` [Ước].
- Shachi: ngói hun (cùng màu mái), **không mạ vàng** như Nagoya [Suy từ nặng 300 kg/con và ảnh].

### 7. Trang trí
- Kara-hafu và đầu hồi có ván gió (破風板) trát trắng.
- Treo lá chắn gió (懸魚) trát trắng hoặc phủ kim loại ở đỉnh đầu hồi.
- Ngói đầu sống (鬼瓦) có huy hiệu gia tộc.
- Lỗ bắn hình học trên tường. Vị trí và hình dạng ở mục 5.

### 8. Đề xuất cho game: ánh xạ 10 tầng chơi

Ràng buộc kỹ thuật:
- `tower.js` dùng chiều cao tầng `FH = 5,0 m` chung cho cả 9 phong cách (29 bậc thang).
- Đề xuất **giữ FH = 5** và giữ được tỉ lệ Himeji.

Cách làm: **3 tầng nằm trong bệ đá + 7 tầng thân gỗ**, hệ số phóng s = 1,27 so với Himeji.
- Thân gỗ: 7 × 5 m + mái chóp ≈ 5 m = 40 m = 31,5 × 1,27.
- Bệ đá nên cao 18 m. Tầng chơi 1 bắt đầu ở +3 m (đế đá đặc 3 m), các tầng hầm cách nhau 5 m.
- Tỉ lệ bệ / thân = 18 / 40 = 0,45 (thật 0,47).
- Himeji thật có 1 tầng hầm; tiểu thiên thủ Tây có 2 tầng hầm, nên «tầng nằm trong đá» là có cơ sở.

| Tầng chơi | Cao độ sàn (m) | Tương ứng Himeji | Mặt bằng (間) | Mặt bằng game Đ–T × N–B (m), s = 1,27 | Lớp mái / đầu hồi |
|---|---|---|---|---|---|
| G1 | +3 | (thêm) kho trong bệ | — | ≈ 29 × 21 | Trong đá, không mái |
| G2 | +8 | (thêm) kho trong bệ | — | ≈ 29 × 21 | Trong đá |
| G3 | +13 | Tầng hầm 穴蔵 | 11,5 × 8,5 | 28,8 × 21,3 | Trong đá |
| G4 | +18 (mặt bệ) | Tầng 1 | 13 × 10 | 32,5 × 25,0 | Mái 1 重: kara-hafu hiên mặt Đông; hộc thả đá 3 góc |
| G5 | +23 | Tầng 2 | ≈ 13 × 10 | 32,0 × 24,5 | Mái 2 重: irimoya lớn Đ/T; kara-hafu hiên mặt Nam |
| G6 | +28 | Tầng 3 | 11 × 8 | 27,5 × 20,0 | (cùng mái 3 重 với G7) |
| G7 | +33 | (thêm) tầng phòng đầu hồi 破風の間 | nội suy ≈ 10 × 7 | 25,0 × 17,5 | Mái 3 重: irimoya đôi Nam/Bắc |
| G8 | +38 | Tầng 4 | 9 × 6 | 22,5 × 15,0 | (cùng mái 4 重 với G9) |
| G9 | +43 | Tầng 5 | 9 × 6 | 22,5 × 15,0 | Mái 4 重: chidori-hafu Nam/Bắc; kara-hafu hiên Đ/T |
| G10 | +48 | Tầng 6 (vọng lâu) | 7 × 5 | 17,5 × 12,6 | Mái 5 重: kara-hafu Nam/Bắc, irimoya Đ/T; tường lộ cột |
| Nóc | ≈ +57,5 | — | — | — | Shachi cao ≈ 2,4 m (190 cm × 1,27) |

Ghi chú về cách ánh xạ:
- Himeji tầng 4 và tầng 5 cùng 9 × 6 間. Suy ra hai tầng này **chung một lớp mái** (4 重).
  Đây là [Suy]; cần đối chiếu mặt cắt `File:Himeji_model7.JPG`. Vì vậy G8–G9 đặt trong 4 重.
- Lớp mái 3 重 chứa G6 + G7. G7 là tầng thêm duy nhất của thân gỗ, đóng vai phòng đầu hồi.
- Nhịp mái giữ đúng 5 lớp. Khoảng cách giữa các mép hiên: 5 m, 5 m, 10 m, 10 m, 5 m.
  Thân thật cũng không đều nhịp, vì thế mái 3 và 4 «cao vai» là đúng tinh thần Himeji.
- Bệ đá: mặt trên ≈ 34 × 27 m (chừa 0,8 m quanh G4).
  Chân bệ với độ nghiêng ước ≈ 0,3 × chiều cao mỗi bên (≈ 5,5 m) → ≈ 45 × 38 m.
  Cạnh 46 m trong danh sách **khớp với chiều Đông–Tây ở chân bệ**. Nên đổi sang chữ nhật 46 × 38 m.
  Độ nghiêng 0,3 × H là [Ước], chưa có số đo bệ Himeji.
- Phương án thay thế «4 + 6»: 4 tầng trong đá + 6 tầng gỗ, khớp đúng 1–1 với 6 sàn Himeji.
  Nhưng bệ cao 20–23 m sẽ thành 0,57 × thân, vượt tỉ lệ 21%. Không khuyến nghị.
- So với `styles.js` hiện tại (vuông 34 → 22 m, bệ 8 m): cần đổi sang chữ nhật Đ–T, bậc thu như bảng, bệ 18 m.
  Engine hiện chỉ nhận đa giác đều `n`. Cần thêm hai nửa cạnh `ax`, `az` riêng (đề xuất kỹ thuật, không thuộc phạm vi file này).
- Hộc thả đá 20 cm là quá nhỏ để thấy trong game. Phóng phần chìa của hộc (khung hình hakama) lên ≈ 1,2–1,5 m rộng.

### 9. Nguồn
- https://ja.wikipedia.org/wiki/姫路城 (đã mở: kích thước tầng theo ken, cao bệ, cột cái, đầu hồi, hộc thả đá, shachi)
- https://en.wikipedia.org/wiki/Himeji_Castle (đã mở: 46,4 m, diện tích sàn, cột cái)
- https://www.shirofan.com/shiro/kinki/himeji/tensyu/tensyu.html (đã mở: 31,49 m; 14,85 m; 2.400 m²; 5.700 t)
- https://online.bunka.go.jp/heritages/detail/147461 (trong kết quả tìm kiếm: 五重六階、地下一階付、本瓦葺)
- https://ja.wikipedia.org/wiki/天守 (đã mở: vọng lâu hình, liên lập thức, 重 / 階)
- https://ja.wikipedia.org/wiki/破風 (đã mở: định nghĩa chidori-hafu, kara-hafu, irimoya đôi)
- Bố trí đầu hồi (trong kết quả tìm kiếm): https://shirobito.jp/article/1711 · https://himejijo-jpn.info/guide11d.html · https://www.i-treasury.net/himeji_castle_roof.html
- Ảnh / mặt cắt (tên file lấy từ trang Category đã mở https://commons.wikimedia.org/wiki/Category:Main_Keep_(Himeji_Castle)):
  - https://commons.wikimedia.org/wiki/File:Shirasagi_Castle.JPG (ảnh toàn cảnh)
  - https://commons.wikimedia.org/wiki/File:Himeji_model7.JPG (mô hình mặt cắt)
  - https://commons.wikimedia.org/wiki/File:Himeji_model2.JPG (mô hình)

---

## main — Đại Quảng Gian (Ōhiroma, 大広間)

### 1. Nguyên mẫu thật
**Ōhiroma của Ninomaru Goten, Thành Nijō** (二条城二の丸御殿大広間, Đại Quảng Gian Nhị Hoàn Ngự Điện Nhị Điều Thành), 1625–1626, Bảo vật quốc gia.
Đây là sảnh yết kiến chính của Shōgun. Năm 1867 Tokugawa Yoshinobu tuyên bố trả quyền về Thiên hoàng tại đây.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Kết cấu theo hồ sơ | 桁行 cạnh phải 8 nhịp, cạnh trái 7 nhịp; 梁間 mặt trước 7 nhịp, mặt sau 5 nhịp; 1 tầng mái; irimoya; ngói bản 本瓦葺 | [Đo] Văn hóa sảnh |
| Diện tích | 784 m² | [Đo] ja.wiki, kyototravel |
| Kích thước bao | ≈ 30 × 27 m kể cả hành lang trong (入側), 810 m² | [Blog] Yahoo Chiebukuro |
| Kích thước bao đo trên mặt bằng chính thức | ≈ 26,8 (Đ–T) × 29,2 (N–B) m | [Suy] đo pixel Hình 2 trong PDF của Nijō, hiệu chỉnh theo tổng diện tích 4 nhà; sai số ±10% |
| Phòng | Nhất (thượng đoạn) 48 chiếu; Nhị (hạ đoạn) 44; Tam 44; Tứ (Thương chi gian) 52,5; Trướng đài + nạp hộ 35 | [Đo] 48/44; số còn lại [Blog] |
| Phòng Tứ | 14,7 × 6,7 m; cao tới nageshi 4 m | [Blog] buổi giảng của giám tuyển, ghi trên blog kojodan |
| Lá gỗ trổ ô thoáng (欄間) | Bách dày hơn 35 cm | [Đo] trang chính thức Nijō |
| Cao diềm, cao nóc | **Không tìm được.** Ước: sàn +0,9; diềm +6; nóc ≈ +15 m | [Ước] (cách suy ở mục 8) |

Chọn kích thước: dùng **≈ 29 × 27 m** (trung bình hai cách đo, khớp 784–810 m²).

### 3. Cấu trúc từ dưới lên
1. **Nền:** sàn gỗ nâng trên cột ngắn và đá kê, quanh nhà có hiên gỗ (縁). Không có bệ đá xây.
2. **Thân:** cột gỗ vuông vát cạnh, lộ ra (真壁).
   Mặt ngoài giữa các cột là cửa trượt gỗ (舞良戸, 雨戸) và shōji.
   Phần tường trên dầm nageshi là vữa trắng.
   Bên trong: phòng lõi (身舎) bao bởi hành lang lát chiếu (入側).
3. **Đỡ mái:** vì kèo kiểu Nhật (和小屋) giấu trong mái; không lộ đấu củng.
   Hiên đỡ bằng xà chìa có kèo hiên (垂木) lộ ra.
4. **Mái:** **irimoya một tầng mái**, rất to và cao. Ngói bản xám.
   Mái nhiều khối do mặt bằng gãy khúc (cạnh trái 7 nhịp, phải 8 nhịp → mặt bằng có bậc).
5. **Đỉnh:** sống nóc ngói, onigawara ở đầu.
   Đầu hồi irimoya có ván gió và lá chắn gió (懸魚) phủ **kim loại mạ vàng**
   (bản vẽ của Nijō có mục «大広間飾り金具表 (破風・懸魚)»).

### 4. Mặt bằng
- Hai dãy phòng lõi:
  - Nhất chi gian (thượng đoạn, sàn cao hơn) nối thẳng Nhị chi gian (hạ đoạn), đối diện nhau theo trục yết kiến.
  - Tam chi gian và Tứ chi gian ở dãy kia.
- Quanh lõi là hành lang lát chiếu, ngoài cùng là hiên gỗ.
- Nhất chi gian có hốc tường (床), kệ so le (違棚), cửa trang trí trướng đài (帳台構), bàn cửa sổ (付書院).
  Trần **nhị trùng chiết thượng cách thiên tỉnh** (二重折上格天井: trần ô cờ nâng hai lần).
- Phía Tây hướng ra vườn ao Ninomaru.
- Phía Đông nối Shikidai; phía Bắc nối Sotetsu-no-ma (hành lang) rồi tới Kuroshoin.
- Thứ tự phòng cụ thể cần đọc trên `Ninomaru_Palace_Nijo_Castle_plan.svg`.

### 5. Cấu kiện nhận diện
1. Mái irimoya **khổng lồ**, chiếm hơn nửa chiều cao nhà, xám, mép hiên thẳng.
2. Đầu hồi irimoya có lá chắn gió mạ vàng.
3. Mặt bằng gần vuông, mép gãy bậc. Hiên gỗ chạy quanh.
4. Mặt ngoài là nhịp cột lộ và cửa trượt, không có cửa sổ, không có tường kín.
5. Dải tường trắng mảnh trên dầm nageshi.
6. Nối chéo kiểu nhạn bay với Shikidai và Kuroshoin.

### 6. Vật liệu và màu
- Mái `#5E6266`.
- Cột, khung, cửa trượt: gỗ phong hóa `#7A5C40`.
- Tường trên: vữa trắng `#F2F0EA`.
- Phụ kiện: vàng `#C9A24A`.
- Hiên gỗ `#9A7B58`.
- Nội thất: fusuma nền vàng `#D4AF37`, tranh tùng–ưng của Kanō Tan'yū.

### 7. Trang trí
- Phụ kiện kim loại mạ vàng trên nageshi: hoa gói làm quà.
- Lá gỗ trổ hai mặt khác nhau giữa phòng Tam và phòng Tứ.
- Trần ô cờ sơn màu.
- Tua đỏ ở trướng đài.
- Tranh vách «Tùng Ưng đồ» (松鷹図) ở phòng Tứ.

### 8. Đề xuất game
- Khung mới **29 × 27 m** (thay 50 × 26). Nếu cần hoành tráng hơn: phóng đều ×1,2 → 35 × 32 m. **Không kéo dài một chiều.**
- Cao, ước lượng [Ước]:
  - Sàn +0,9 m (giả định; chưa có nguồn).
  - Cao trong tới nageshi 4 m [Blog], trần nâng thêm ≈ 1 m.
  - Diềm ≈ +6 m.
  - Mái: nửa nhịp kể cả hiên ≈ 15,5 m × độ dốc ≈ 0,6 → nóc ≈ +15 m.
  - Mái ≈ 60% tổng cao.
- Plinth hiện tại 1,2 m là hợp lý cho cao sàn, nhưng phải dựng là **sàn gỗ trên cột + hiên**, không phải khối bệ.

### 9. Nguồn
- https://online.bunka.go.jp/heritages/detail/174942 (trong kết quả tìm kiếm: kết cấu)
- https://kyototravel.info/ninomarugoten (đã mở: diện tích, phòng)
- https://ja.wikipedia.org/wiki/二条城 (đã mở: 784 m²)
- https://nijo-jocastle.city.kyoto.lg.jp/introduction/highlights/ninomaru/?lang=en (đã mở: trang trí)
- https://nijo-jocastle.city.kyoto.lg.jp/wp-content/uploads/2024/06/03_zumen.pdf (đã mở: mặt bằng tổng, danh mục bản vẽ)
- https://kojodan.jp/blog/entry/2019/07/12/233712 (trong kết quả tìm kiếm: phòng Tứ 14,7 × 6,7 m, nageshi 4 m)
- https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q1413829939 (trong kết quả tìm kiếm: 30 × 27 m; độ tin thấp)
- https://en.wikipedia.org/wiki/Shoin-zukuri · https://ja.wikipedia.org/wiki/書院造 (đã mở)
- Ảnh / bản vẽ (tên file từ en.wiki Nijō Castle và Category Ninomaru Palace, đã mở):
  - https://commons.wikimedia.org/wiki/File:Ninomaru_Palace_Nijo_Castle_plan.svg
  - https://commons.wikimedia.org/wiki/File:Ninomaru-goten_palace.jpg
  - https://commons.wikimedia.org/wiki/File:View_on_north_side_of_Ninomaru-Goden_Hall_of_Nijo_Castle.JPG

---

## shikidai — Thức Đài (Shikidai, 式台)

### 1. Nguyên mẫu thật
**Shikidai của Ninomaru Goten, Nijō** (二条城二の丸御殿式台), 1625–1626, Bảo vật quốc gia.
Sảnh tiếp nhận lễ vật và chỗ các lão trung (老中) chờ; nối Tōzamurai với Ōhiroma.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Kết cấu | 桁行 mặt trước 3 nhịp, mặt sau 5 nhịp; 梁間 cạnh phải 4, cạnh trái 6; 1 tầng mái; irimoya; ngói bản | [Đo] Văn hóa sảnh |
| Diện tích | 332 m² | [Đo] |
| Kích thước bao | ≈ 16,4 × 17,3 m trên mặt bằng; hiệu chỉnh theo diện tích ≈ 18 × 18,5 m | [Suy] đo Hình 2 |
| Phòng | Lão trung chi gian (3 phòng: nhất, nhị, tam) + Thức đài chi gian | [Đo] |
| Cao | Không tìm được | — |

### 3. Cấu trúc từ dưới lên
- Giống Ōhiroma: sàn gỗ trên cột, cột vuông lộ, cửa trượt, mái irimoya ngói một tầng mái.
- Mặt bằng gãy bậc (3/5 nhịp, 4/6 nhịp) nên mái là **tổ hợp irimoya gãy khúc** nối hai nhà lớn.

### 4. Mặt bằng
- Phòng Thức đài phía trước (hướng sân, nhận lễ vật).
- Ba phòng lão trung xếp phía sau.
- Hai đầu nối hành lang sang Tōzamurai (Đông) và Ōhiroma (Tây).

### 5. Cấu kiện nhận diện
1. Là **khâu nối** trong chuỗi nhạn bay; thấp và nhỏ hơn Ōhiroma rõ rệt.
2. Mái irimoya xám, mép thẳng.
3. Mặt ngoài nhịp cột + cửa trượt.
4. Tường trên nageshi trắng. Nguồn chính thức nói phòng lão trung có tường trên dầm màu trắng, sắc độ tiết chế hơn các phòng khác.

### 6. Vật liệu và màu
Như Ōhiroma: mái `#5E6266`, gỗ `#7A5C40`, vữa `#F2F0EA`.
Nội thất: tranh tùng; phòng lão trung vẽ ngỗng trời và cò, liễu.

### 7. Trang trí
- Tranh tùng trên vách (biểu tượng thịnh vượng lâu dài).
- Phụ kiện kim loại ít hơn Ōhiroma.

### 8. Đề xuất game
- Khung mới **18 × 18,5 m** (thay 34 × 18).
- Cao nóc phải **thấp hơn Ōhiroma** ≈ 20–25%: ≈ +11,5 m [Ước].
- Giữ nối chéo: góc Tây Bắc của Shikidai chạm góc Đông Nam của Ōhiroma.

### 9. Nguồn
- https://online.bunka.go.jp/heritages/detail/146901 (trong kết quả tìm kiếm)
- https://kyototravel.info/ninomarugoten (đã mở)
- https://nijo-jocastle.city.kyoto.lg.jp/introduction/highlights/ninomaru/?lang=en (đã mở)
- https://nijo-jocastle.city.kyoto.lg.jp/wp-content/uploads/2024/06/03_zumen.pdf (đã mở)
- Ảnh: https://commons.wikimedia.org/wiki/File:Nijo_Castle.jpg ; https://commons.wikimedia.org/wiki/File:Ninomaru_Palace_Nijo_Castle_plan.svg

---

## kuroshoin — Hắc Thư Viện (Kuroshoin, 黒書院 / 小広間)

### 1. Nguyên mẫu thật
**Kuroshoin (Tiểu Quảng Gian) của Ninomaru Goten, Nijō** (二条城二の丸御殿黒書院), 1625–1626, Bảo vật quốc gia.
Sảnh tiếp kiến thân cận, cấp thứ hai sau Ōhiroma. Còn gọi Anh chi gian (櫻之間) vì tranh hoa anh đào.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Kết cấu | 桁行 mặt trước 7 nhịp, mặt sau 8; 梁間 cạnh phải 6, cạnh trái 8; 1 tầng mái; irimoya; ngói bản | [Đo] Văn hóa sảnh |
| Diện tích | 569 m² | [Đo] |
| Kích thước bao | Đo hình ≈ 26,5 × 23,7 m (có lẽ tính cả hiên). Hiệu chỉnh theo diện tích ≈ 25 × 23 m | [Suy] |
| Nhất chi gian | 24,5 chiếu; có hốc tường, kệ so le, trướng đài, bàn cửa sổ | [Đo] |
| Phòng khác | Nhị (Anh chi gian), Tam (Bang Tùng chi gian), Tứ (Cúc chi gian), Trướng đài chi gian, Mẫu Đơn chi gian; hành lang Nam và Tây | [Đo] danh mục bản vẽ Nijō, kyototravel |

### 3. Cấu trúc từ dưới lên
- Giống Ōhiroma, cùng hệ cột, cửa trượt, mái irimoya ngói.
- Mặt bằng gãy bậc nhẹ (7/8 × 6/8).

### 4. Mặt bằng
- Lõi 2 dãy phòng.
- Hành lang lát chiếu ở mặt Nam và Tây (theo tên bản vẽ «南入側», «西入側»).
- Hiên gỗ ngoài cùng.
- Nối với Ōhiroma qua Sotetsu-no-ma (hành lang 8–9 nhịp × 1–3 nhịp); nối Shiroshoin qua hành lang.

### 5. Cấu kiện nhận diện
1. Cùng ngôn ngữ với Ōhiroma nhưng **nhỏ hơn ≈ 27%** diện tích.
2. Mặt bằng gần vuông, mái irimoya to.
3. Lệch chéo so với Ōhiroma (nhạn bay về Tây Bắc).
4. **Không sơn đen.** Tên «Hắc» không phải màu ngoại thất.

### 6. Vật liệu và màu
Như Ōhiroma. Nội thất tranh màu (anh đào, tùng phủ tuyết, mai) của Kanō Naonobu.

### 7. Trang trí
- Phụ kiện mạ vàng.
- Trần ô cờ.
- Trướng đài trong Nhất chi gian.

### 8. Đề xuất game
- Khung mới **25 × 23 m** (thay 34 × 18).
- Nóc ≈ +13,5 m [Ước] (tỉ lệ theo bề sâu so với Ōhiroma).

### 9. Nguồn
- https://online.bunka.go.jp/heritages/detail/122514 (trong kết quả tìm kiếm; cùng nội dung tại https://kunishitei.bunka.go.jp/bsys/maindetails/102/1705)
- https://kyototravel.info/ninomarugoten (đã mở)
- https://nijo-jocastle.city.kyoto.lg.jp/introduction/highlights/ninomaru/?lang=en (đã mở)
- https://nijo-jocastle.city.kyoto.lg.jp/wp-content/uploads/2024/06/03_zumen.pdf (đã mở)
- Ảnh: https://commons.wikimedia.org/wiki/File:Taisei_Hōkan.jpg (tranh, cảnh Kuroshoin); https://commons.wikimedia.org/wiki/File:Ninomaru_Palace_Nijo_Castle_plan.svg

---

## shiroshoin — Bạch Thư Viện (Shiroshoin, 白書院 / 御座の間)

### 1. Nguyên mẫu thật
**Shiroshoin (Ngự Tọa Chi Gian) của Ninomaru Goten, Nijō** (二条城二の丸御殿白書院), 1625–1626, Bảo vật quốc gia.
Nơi ở riêng và tẩm điện của Shōgun; nhà trong cùng của chuỗi.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Kết cấu | 桁行 6 nhịp × 梁間 6 nhịp; 1 tầng mái; irimoya; ngói bản | [Đo] Văn hóa sảnh (bunka.nii.ac.jp) |
| Diện tích | 318 m² | [Đo] |
| Kích thước bao | Đo hình ≈ 16,8 × 18,3 m → **≈ 17 × 18,5 m** | [Suy] |
| Nhất chi gian | 15 chiếu (thượng đoạn, phòng ngủ) | [Đo] |
| Phòng khác | Nhị, Tam, Tứ, Trướng đài chi gian, phòng phụ | [Đo] |

### 3. Cấu trúc từ dưới lên
Như các shoin khác. Mặt bằng **đều 6 × 6 nhịp**, nên là nhà đơn giản và vuông vức nhất trong nhóm.

### 4. Mặt bằng
- Lõi 2 × 2 hoặc 2 × 3 phòng.
- Hành lang quanh; hiên gỗ.
- Hành lang nối Kuroshoin (渡廊).

### 5. Cấu kiện nhận diện
1. Nhà nhỏ nhất, **vuông**, một khối irimoya gọn.
2. Nằm cuối chuỗi nhạn bay, xa cổng nhất.
3. **Không sơn trắng toàn bộ.** Tên «Bạch» không phải màu ngoại thất.

### 6. Vật liệu và màu
Như Ōhiroma. Nội thất: tranh **thủy mặc** (cảnh Tây Hồ), ít vàng hơn. Nếu cần một điểm khác bên ngoài, giảm phụ kiện vàng.

### 7. Trang trí
Tranh thủy mặc (Tây Hồ ở phòng Nhất và Nhị; nhân vật cổ sự Trung Hoa ở phòng Tam).

### 8. Đề xuất game
- Khung mới **17 × 18,5 m** (thay 28 × 16).
- Nóc ≈ +11 m [Ước].

### 9. Nguồn
- https://bunka.nii.ac.jp/heritages/detail/156245 (trong kết quả tìm kiếm; cùng tại https://kunishitei.bunka.go.jp/bsys/maindetails/102/1706)
- https://kyototravel.info/ninomarugoten (đã mở)
- https://nijo-jocastle.city.kyoto.lg.jp/introduction/highlights/ninomaru/?lang=en (đã mở)
- Ảnh: https://commons.wikimedia.org/wiki/File:Ninomaru_Palace_Nijo_Castle_plan.svg ; https://commons.wikimedia.org/wiki/File:Kyoto_Nijo-jo_Ninomaru-goten-Palast_Rückseite_1.jpg

---

## kesho — Hóa Trang Lâu (Keshō-yagura, 化粧櫓)

### 1. Nguyên mẫu thật
**Keshō-yagura, Tây Hoàn (西の丸), Thành Himeji** (姫路城化粧櫓), Di sản văn hóa quan trọng.
Tương truyền dựng cho công chúa Senhime khi về làm dâu dòng Honda.
Niên đại: Văn hóa sảnh ghi 1601–1609; ja.wiki ghi 1618 (tiền hồi môn 10 vạn thạch). Ghi cả hai, không ảnh hưởng hình dáng.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Kích thước | 桁行 7 間 8 分 × 梁間 3 間 3 分 ≈ **15,4 × 6,5 m** (Kyō-ma) hoặc 14,2 × 6,0 m (6 shaku) | [Đo] trang chính thức thành phố Himeji (trích trong kết quả tìm kiếm); quy đổi [Suy] |
| Kết cấu | Một phần lầu 1 tầng, một phần lầu 2 tầng mái / 2 sàn; ngói bản | [Đo] Văn hóa sảnh |
| Ngoài | 2 tầng mái, 2 sàn (ja.wiki) | [Đo] |
| Phòng | 3 phòng chiếu: 18, 15, 6 chiếu; có hốc tường; trần ván sam (杉柾張り) | [Blog] |
| Kiểu mái | **Chưa xác nhận** irimoya bằng văn bản. Theo thông lệ yagura là irimoya | [Ước]; cần xem ảnh |
| Cao | Không tìm được | — |

Kiểm tra chéo: 18 + 15 + 6 = 39 chiếu ≈ 71 m². Diện tích sàn 15,4 × 6,5 = 100 m². Phần còn lại là hành lang và lối vào. Hợp lý.

### 3. Cấu trúc từ dưới lên
1. Đặt trên tường đá Tây Hoàn, ở đầu hành lang lầu dài «Bách Gian Lang Hạ» (百間廊下).
2. Thân trát trắng kiểu thành bên ngoài. **Bên trong là phòng ở kiểu dinh**: chiếu, cửa trượt, hốc tường, như một phòng thường.
3. Mái ngói xám. Phần 2 tầng có mái chồng trên phần 1 tầng.

### 4. Mặt bằng
- Chữ nhật dài theo hướng hành lang (桁行 7,8 間).
- Ba phòng chiếu nối nhau: 18 + 15 + 6 chiếu.
- Một đầu nối hành lang lầu (rộng 1 間).

### 5. Cấu kiện nhận diện
1. **Ngoài là yagura trắng** (không phải dinh), **trong là phòng ở**. Dấu hiệu từ ngoài: cửa sổ rộng và nhiều hơn yagura chiến đấu.
2. Chiều dài ngắn, gắn ở đầu một hành lang lầu rất dài và hẹp.
3. Hai khối cao thấp (1 tầng + 2 tầng).

### 6. Vật liệu và màu
- Tường `#F2F0EA`, mái `#5E6266`.
- Nội thất: chiếu `#C9C08A`, trần ván sam `#C9A57A` [Ước].

### 7. Trang trí
- Hốc tường (床の間), cửa trượt.
- Ngoài gần như trơn.

### 8. Đề xuất game
- Khung mới **15,4 × 6,5 m** (thay 40 × 12).
- Nếu muốn giữ «khối dài 40 m»: dựng Keshō-yagura 15,4 × 6,5 m nối với một đoạn **hành lang lầu** rộng ≈ 4 m (≈ 2 間), dài 25 m.
  Hành lang thật rộng 1 間 phía ngoài, toàn tuyến ≈ 240 m (121 間).
- Cao [Ước]:
  - Phần 2 tầng: diềm 1 ≈ +4 m, diềm 2 ≈ +7,5 m, nóc ≈ +10 m.
  - Phần 1 tầng: nóc ≈ +6,5 m.

### 9. Nguồn
- https://ja.wikipedia.org/wiki/姫路城 (đã mở: 二重二階, 3 phòng, 1618; hành lang 121 間)
- https://online.bunka.go.jp/heritages/detail/186436 (trong kết quả tìm kiếm: kết cấu)
- https://www.city.himeji.lg.jp/kanko/0000001875.html (trong kết quả tìm kiếm: 7 間 8 分 × 3 間 3 分)
- https://kunishitei.bunka.go.jp/heritage/detail/102/2289 (trong kết quả tìm kiếm)
- Blog phòng 18/15/6 chiếu (trong kết quả tìm kiếm, không mở được để xác nhận trang nào): https://ameblo.jp/highhillhide/entry-12851378486.html · https://4travel.jp/travelogue/11026901
- Ảnh (tên file từ Category đã mở https://commons.wikimedia.org/wiki/Category:Keshō-yagura_(Himeji_Castle)):
  - https://commons.wikimedia.org/wiki/File:Keshoyagura_Turret_of_Himeji_Castle.jpg
  - https://commons.wikimedia.org/wiki/File:Himejijo_keshoyagura.jpg

---

## kura — Kho Gạo (Kura, 土蔵 / 米蔵)

### 1. Nguyên mẫu thật
**Thổ tàng (Mễ tàng) Bắc, Thành Nijō** (二条城北土蔵（米蔵）), Di sản văn hóa quan trọng, đầu Edo.
Nijō là thành duy nhất còn kho thổ tàng loại này (3 nhà).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Kết cấu | Thổ tàng tạo (土蔵造), 1 tầng mái, irimoya, ngói bản | [Đo] Văn hóa sảnh (kho Nam, cùng kiểu kho Bắc) |
| Kho Bắc | 桁行 17 間 × 梁間 3 間 ≈ **33,5 × 5,9 m**; 2 gian trong; 4 cửa sổ; 2 cửa | [Blog] kyotofukoh; quy đổi [Suy] |
| Kho Nam | 桁行 «18 間・9 間», 梁間 3 間 (có thể là hình gãy góc, chưa xác nhận); 2 cửa | [Blog] |
| Kho Đông Bắc | Có cổng trường ốc (長屋門) và nhà gác cổng; xưa nối thêm 7 gian theo hình chữ L | [Blog] |
| Cao | Không tìm được | — |

### 3. Cấu trúc từ dưới lên
1. Chân tường đá thấp.
2. Tường đất dày trát vữa trắng phủ kín (chống cháy). Cửa sắt hoặc gỗ bọc vữa dày, có bậc.
3. Cửa sổ nhỏ ít, có song và cánh cửa trát.
4. Mái irimoya ngói một tầng mái. Thường có khung mái tách khỏi tường để chống nóng (置屋根) [Ước, chưa có nguồn cho Nijō].

### 4. Mặt bằng
- Dải dài hẹp 17 × 3 間, chia 2 gian.
- Mỗi gian một cửa ra phía sân.
- 4 cửa sổ phân bố đều trên hai mặt dài.

### 5. Cấu kiện nhận diện
1. **Dài và rất hẹp** (tỉ lệ ≈ 5,7 : 1).
2. Tường trắng trơn, gần như không mở cửa.
3. Cửa ra vào khung dày có bậc, cánh trát vữa.
4. Mái irimoya xám dài.

### 6. Vật liệu và màu
- Tường `#F2F0EA`.
- Chân tường đá `#9C968A`.
- Mái `#5E6266`.
- Cánh cửa trát vữa trắng hoặc đen [Ước].

### 7. Trang trí
Gần như không có. Có thể có huy hiệu trên ngói đầu sống.

### 8. Đề xuất game
- Khung mới **33,5 × 6 m** (thay 34 × 12).
- Danh sách ghi «2 tầng». Nguyên mẫu là **1 tầng mái**; bên trong có thể có gác lửng.
- Cao [Ước]: diềm ≈ +4,5 m, nóc ≈ +8 m.

### 9. Nguồn
- https://online.bunka.go.jp/heritages/detail/185866 (trong kết quả tìm kiếm: kho Nam)
- https://kyotofukoh.jp/report118.html (trong kết quả tìm kiếm: 17 × 3 間)
- https://ja.kyoto.travel/tourism/single01.php?category_id=8&tourism_id=2020 (trong kết quả tìm kiếm: 3 kho, duy nhất cả nước)
- https://en.wikipedia.org/wiki/Nij%C5%8D_Castle (đã mở: «three storehouses»)
- Ảnh (từ Category đã mở https://commons.wikimedia.org/wiki/Category:North_Dozō_(Nijō_Castle)): https://commons.wikimedia.org/wiki/File:Northwest_storehouse_of_Nijo_Castle.JPG

---

## umaya — Chuồng Ngựa (Umaya, 馬屋)

### 1. Nguyên mẫu thật
**Mã Ốc Thành Hikone** (彦根城馬屋), khoảng 1688–1703, Di sản văn hóa quan trọng.
Là chuồng ngựa lớn duy nhất còn trong thành thời Edo trên cả nước.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Cánh Đông–Tây | 桁行 25,2 m × 梁間 5,9 m; 1 tầng mái; irimoya; có lầu giếng (井戸屋形) | [Đo] Văn hóa sảnh |
| Cánh Nam–Bắc | 桁行 31,1 m × 梁間 5,9 m; 1 tầng mái; mặt Nam irimoya, mặt Bắc nối cánh Đông–Tây | [Đo] |
| Tổng | Chữ L, dài toàn bộ 62 m | [Đo] shirofan |
| Mái | Ván mỏng (杮葺). Sau hỏa hoạn thời Meiwa từng lợp ngói; trùng tu 1966–68 trả về ván | [Đo] |
| Tường | Trên: vữa phủ cột (大壁). Dưới: ván chồng có nẹp (簓子下見板張) | [Đo] |
| Ngăn ngựa | 21 ngăn (đa số nguồn); hồ sơ chính thức ghi 19 | [Đo]; chọn **21** vì thành phố Hikone ghi 21 sau trùng tu |
| Khác | Trần ván có nẹp (竿縁天井). Sàn có lỗ đóng mở để dọn phân. Đầu Đông có phòng chiếu nhỏ quản lý. Gần đầu Tây có cổng, cổng phía Bắc có cửa ngách | [Đo] |

### 3. Cấu trúc từ dưới lên
1. Nền đất nện, chân đá kê.
2. Khung gỗ. Tường trên vữa, dưới ván tối màu.
3. Mặt trong: dãy ngăn ngựa mở về hành lang.
4. Mái irimoya ván mỏng, hai cánh gặp nhau ở góc.

### 4. Mặt bằng
- Chữ L. Mỗi cánh sâu 5,9 m (≈ 3 間).
- Dãy ngăn ngựa (馬立場) và chỗ buộc ngựa (馬繋場) chạy dọc.
- Đầu Đông: phòng chiếu nhỏ, giáp cổng lầu Sawaguchi.
- Gần đầu Tây: cổng ra vào.

### 5. Cấu kiện nhận diện
1. **Hình chữ L**, dài, hẹp, thấp.
2. Mái **ván mỏng** màu nâu xám, không phải ngói.
3. Tường hai màu: trên trắng, dưới ván đen.
4. Nhịp ngăn ngựa đều đặn trên mặt trong.
5. Lầu giếng nhỏ ở cánh Đông–Tây.

### 6. Vật liệu và màu
- Mái ván `#7A6A55`.
- Tường trên `#F2F0EA`.
- Ván dưới `#3A2E26`.
- Gỗ khung `#6B4F36`.

### 7. Trang trí
Không có trang trí; đẹp nhờ nhịp kết cấu.

### 8. Đề xuất game
- Khung mới **chữ L**: cánh A 25,2 × 5,9 m + cánh B 31,1 × 5,9 m. Hộp bao ≈ 25,2 × 37 m.
- Nếu vị trí chỉ chứa được hình thẳng: một khối **44 × 6 m** (giữ sâu 6 m, không phải 12 m) và ghi rõ là «biến thể thẳng».
- Cao [Ước]: diềm ≈ +3,2 m, nóc ≈ +7 m.

### 9. Nguồn
- https://online.bunka.go.jp/heritages/detail/145098 (trong kết quả tìm kiếm: kích thước bằng mét)
- https://www.shirofan.com/shiro/kinki/hikone/a08.html (đã mở: 62 m, 21 ngăn, mái ván)
- https://www.city.hikone.lg.jp/kakuka/kanko_bunka/8/2_1/3/4581.html (trong kết quả tìm kiếm: tường, 21 ngăn)
- https://www.weblio.jp/content/彦根城馬屋 (trong kết quả tìm kiếm)
- Ảnh (từ Category đã mở https://commons.wikimedia.org/wiki/Category:Umaya,_Hikone_Castle):
  - https://commons.wikimedia.org/wiki/File:Hikone_castle05s3200.jpg
  - https://commons.wikimedia.org/wiki/File:Hikone_Castle_20221113_07.jpg

---

## masuW — Masugata Tây (cổng ngoài kōraimon, 高麗門)

Ghi chú cấu trúc chung cho masuW + masuE:
- Masugata (枡形) **không phải** hai lầu đứng hai bên cổng.
- Cấu trúc đúng: cổng ngoài kōraimon → sân vuông có tường bao → **rẽ vuông góc** → cổng trong yaguramon (櫓門).
- Kẻ vào bị bắn từ ba phía (ja.wiki 枡形).
- Đề xuất: masuW = cổng ngoài, masuE = cổng trong, đặt vuông góc quanh một sân.

### 1. Nguyên mẫu thật
- **Kōraimon của Ngoại Anh Điền Môn, Thành Edo** (旧江戸城外桜田門 高麗門), xây lại khoảng 1663, Di sản văn hóa quan trọng.
- Đối chiếu: **Kōraimon của Đại Thủ Môn, Thành Osaka** (大坂城大手門).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Sân masugata Sakurada | 15 × 21 間; ≈ 27 × 38 m; 320 tsubo. Lớn nhất trong các cổng masugata còn lại | [Đo] Bộ Môi trường, ja.wiki |
| Lối mở kōraimon Osaka | Rộng ≈ 5,5 m, cao ≈ 7,1 m | [Blog] trang du lịch trong kết quả tìm kiếm |
| Cột và cánh Osaka | Cánh và trụ chính bọc thép sơn đen | [Blog] |
| Cấu tạo kōraimon | 2 trụ chính (鏡柱) + 2 trụ chống sau (控柱). Dầm ngang (冠木) trên trụ chính. Mái kirizuma nhỏ trên trụ chính; hai mái kirizuma nhỏ hơn nối trụ chính với trụ chống. Nhìn từ trên, mái thành hình chữ «コ» | [Đo] ja.wiki 高麗門, kotobank, kojodan |
| Kiểu cũ / mới | Kiểu cũ (Keichō): mái đặt thẳng trên dầm. Kiểu mới (sau Genna): trụ chính lên tới mái, dầm cắm ngang trụ, trên dầm có ô tường nhỏ. Sakurada là kiểu mới | [Đo] |
| Cánh cửa (bản dựng 2015, theo đúng tỉ lệ truyền thống) | Mỗi cánh cao 3,9 m, rộng 2,16 m | [Đo] Shimizu, cổng chùa Honmyō-ji |

### 3. Cấu trúc từ dưới lên
1. Đá kê chân trụ, giữa có ngưỡng.
2. Hai trụ chính lớn, hai trụ chống sau; giằng ngang (貫) 2–3 tầng.
3. Dầm ngang lớn. Theo kiểu mới: trên dầm có ô tường nhỏ.
4. Mái kirizuma ngói nhỏ trên trụ chính; hai mái phụ nhỏ hơn trên khoảng trụ chính–trụ chống.
5. Onigawara ở đầu sống.

### 4. Mặt bằng
- 4 trụ. Lối giữa 2 cánh; có thể có cửa ngách.
- Hai bên nối tường đất trát trắng có lỗ bắn, ôm sân masugata.

### 5. Cấu kiện nhận diện
1. **Mái chính nhỏ, hẹp** đặt ngay trên trụ chính, cộng hai mái phụ thấp hơn ở phía sau.
2. Cánh cửa lớn bọc sắt sơn đen, đinh tán.
3. Tường trắng ôm ra hai bên.
4. Không có tầng lầu.

### 6. Vật liệu và màu
- Gỗ / sắt sơn đen `#1C1A18`.
- Đinh và phụ kiện sắt `#2E2C2A`.
- Mái `#5E6266`.
- Tường hai bên `#F2F0EA`.

### 7. Trang trí
Đinh tán và nẹp sắt trên cánh. Huy hiệu trên onigawara.

### 8. Đề xuất game
- **Đổi vai trò:** masuW thành cổng ngoài kōraimon. Khung bao ≈ **8 × 4,5 m** (lối 5,5 m + trụ); cao ≈ **8 m** tới nóc.
- Sân masugata: Sakurada 27 × 38 m là lớn nhất cả nước. Sân trong game có thể ≈ 20 × 24 m.
- Cổng trong (masuE) đặt **vuông góc 90°** với cổng ngoài.
- Bố cục hiện tại (hai lầu 18 × 10 đứng hai bên cổng, x = ±32) phải dựng lại thành hình chữ L quanh sân.

### 9. Nguồn
- https://ja.wikipedia.org/wiki/枡形 (đã mở)
- https://ja.wikipedia.org/wiki/桜田門 (đã mở: 27 × 38 m, 320 tsubo, khoảng 1663)
- https://www.env.go.jp/garden/kokyogaien/1_intro/his_02.html (trong kết quả tìm kiếm: 15 × 21 間)
- https://ja.wikipedia.org/wiki/高麗門 · https://kotobank.jp/word/高麗門-497789 · https://blog.kojodan.jp/entry/2020/08/17/180000 (trong kết quả tìm kiếm: cấu tạo, kiểu cũ / mới)
- https://www.shimz.co.jp/shazi/topics/t151006.html (trong kết quả tìm kiếm: cánh 3,9 × 2,16 m)
- https://online.bunka.go.jp/heritages/detail/175352 (trong kết quả tìm kiếm: kōraimon Osaka)
- Ảnh: https://commons.wikimedia.org/wiki/File:Bjh36_Yedo_TycoonPalace.jpg (ảnh cũ Sakurada-mon, từ en.wiki Edo Castle đã mở)

---

## masuE — Masugata Đông (cổng trong yaguramon, 櫓門)

### 1. Nguyên mẫu thật
- **Hishi-no-mon, Thành Himeji** (姫路城菱の門), 1601–1609, Di sản văn hóa quan trọng. Cổng lầu lớn nhất còn ở Himeji. Dùng làm hình dáng.
- **Đa Văn Lầu Đại Thủ Khẩu, Thành Osaka** (大坂城多聞櫓), dựng lại 1848. Dùng làm tham chiếu kích thước lầu cổng trên masugata.
- Lầu cổng Sakurada-mon (渡櫓, dài ≈ 35 m) là tham chiếu thứ ba.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Hishi-no-mon: kết cấu | Cổng lầu (櫓門), irimoya, ngói bản | [Đo] Văn hóa sảnh |
| Hishi-no-mon: kích thước | 桁行 10 間 × 梁間 4 間 ≈ **19,7 × 7,9 m** | [Đo] trang thành phố Himeji (trích trong tìm kiếm); quy đổi [Suy] |
| Hishi-no-mon: cao, dài | Cao ≈ 12 m, Đông–Tây ≈ 18 m | [Blog] japanese-heritage.com |
| Hishi-no-mon: mặt đứng | 2 tầng, mỗi mặt có cửa sổ lồi (出格子). Mặt Nam và Bắc mỗi mặt có 3 cửa song sơn mài đen, phụ kiện vàng hình hoa đồng, và 2 cửa sổ hình chuông (華頭窓 / 火灯窓), xếp đối xứng | [Đo] thành phố Himeji |
| Hishi-no-mon: tường | Lộ cột (真壁): cổng duy nhất trong thành như vậy. Trên dầm đầu trụ gắn hoa văn hoa lăng (花菱) bằng gỗ | [Đo] |
| Đa Văn Lầu Osaka | Cao 14,7 m; tổng diện tích 710,25 m²; chữ L (lầu cổng + lầu nối) | [Đo] osaka-castle.jp, PDF Osaka Castle Park |
| Đa Văn Lầu Osaka: phòng | Lầu cổng có 3 phòng ván (giữa ≈ 70 chiếu, hai bên ≈ 50 chiếu). Lầu nối: hành lang ván rộng ≈ 2,7 m + 6 phòng 9/12/15 chiếu | [Đo] PDF |
| Đa Văn Lầu Osaka: thiết bị | «Thương lạc» (槍落し): khe thả giáo trên đầu cổng lớn | [Đo] |

### 3. Cấu trúc từ dưới lên
1. **Bệ:** hai khối tường đá hai bên, lầu cổng **bắc ngang qua** khe giữa hai khối đá.
2. **Tầng dưới:** lối cổng lớn hai cánh, trụ chính và dầm ngang lộ (ở Hishi-no-mon có hoa lăng).
3. **Tầng lầu:** chạy suốt trên đỉnh hai khối đá.
   Mặt ngoài: cửa sổ song sơn đen + cửa sổ hình chuông + cửa sổ lồi có mái hiên nhỏ.
4. **Mái:** irimoya ngói, có thêm một mái hiên ngăn giữa tầng cổng và tầng lầu.
5. Shachi hoặc onigawara ở đầu nóc.

### 4. Mặt bằng
- Chữ nhật 10 × 4 間.
- Lối cổng ở giữa. Hai đầu lầu tựa trên tường đá.
- Trong lầu: phòng lính, dọc tường có lỗ bắn.
- Có khe thả giáo / thả đá trên lối cổng.

### 5. Cấu kiện nhận diện
1. **Cầu lầu bắc qua giữa hai khối đá**, lối cổng tối bên dưới.
2. Hàng cửa song sơn đen kẹp giữa hai cửa sổ hình chuông, đối xứng.
3. Cửa sổ lồi có mái nhỏ.
4. Hoa lăng gỗ trên dầm cổng (riêng Hishi-no-mon).
5. Tường lộ cột (Hishi-no-mon). Các cổng khác trát trắng toàn bộ.

### 6. Vật liệu và màu
- Gỗ cột `#6B4F36`.
- Ô tường `#F2F0EA`.
- Song sơn đen `#1C1A18`.
- Phụ kiện vàng `#C9A24A`.
- Mái `#5E6266`.
- Khối đá `#9C968A`.

### 7. Trang trí
- Hoa lăng.
- Phụ kiện kim loại hình hoa đồng (桐紋) mạ vàng trên song cửa.
- Khung cửa sổ hình chuông.

### 8. Đề xuất game
- Khung **19,7 × 7,9 m**, cao ≈ **12 m** tới nóc, 2 tầng (lối cổng + lầu). Thay 18 × 10 × 6 m.
- Chiều cao hiện tại 6 m là quá thấp một nửa.
- Bệ: hai khối đá cao ≈ 4–5 m [Ước], rộng mỗi khối ≈ 6 m, chừa lối giữa ≈ 6 m.
- Đặt **vuông góc** với masuW quanh sân ≈ 20 × 24 m.
- Phương án lớn: làm theo Osaka, chữ L dài ≈ 35 m ôm hai cạnh sân. Chỉ dùng nếu bản đồ có chỗ.

### 9. Nguồn
- https://online.bunka.go.jp/heritages/detail/186446 (trong kết quả tìm kiếm)
- https://www.city.himeji.lg.jp/kanko/0000001875.html (trong kết quả tìm kiếm: 10 × 4 間, cửa sổ)
- https://japanese-heritage.com/himeji-castle-hishinomon/ (trong kết quả tìm kiếm: 12 m, 18 m)
- https://osaka-castle.jp/osakajo/tamonyagura.html (đã mở)
- https://www.osakacastlepark.jp/cms/public/admin/uploads/events/pdf/d4dd5befaa2e33896b72c8e808c30e6a.pdf (đã mở: phòng, hành lang 2,7 m, 710,25 m²)
- https://ja.wikipedia.org/wiki/桜田門 (đã mở: lầu cổng dài ≈ 35 m)
- Ảnh (từ Category đã mở https://commons.wikimedia.org/wiki/Category:Hishi-no-mon_(Himeji_Castle)):
  - https://commons.wikimedia.org/wiki/File:Hishinomon_Gate_of_Himeji_Castle.jpg
  - https://commons.wikimedia.org/wiki/File:Side_view_of_Hishinomon_Gate_of_Himeji_Castle.jpg

---

## chashitsu — Trà Thất Kōraku

### 1. Nguyên mẫu thật
- **Shōkintei, Katsura Rikyū** (桂離宮松琴亭, Tùng Cầm Đình), đầu thế kỷ 17. Trà thất sukiya-zukuri tiêu biểu, đúng đề bài.
- Tên «Kōraku» gợi Kōraku-en Okayama (岡山後楽園, 14,4 ha). Kōraku-en có nhà Enyō-tei (延養亭) và nhà nghỉ có dòng nước chảy qua Ryūten (流店).
  ja.wiki không ghi kích thước các nhà này. Vì vậy chọn Shōkintei làm hình dáng.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Diện tích xây dựng | 56 m² | [Đo] ja.wiki 桂離宮 |
| Mái | Nhà chính: irimoya **mái tranh**, mặt Bắc. Phần trà thất: mái ván mỏng. Phía sau (phòng ván, hậu gian, thủy ốc): mái ngói một mái dốc; máng nước bằng tre | [Đo] ja.wiki, kotobank, blog Takahashi |
| Phòng | Nhất chi gian 11 chiếu (hình chữ L), Nhị chi gian 6 chiếu, trà thất 3 chiếu + 1 chiếu daime (三畳台目), thủy ốc (水屋), bếp | [Đo] |
| Mặt Bắc | Hiên đất sâu (土庇) | [Đo] |
| Nhất chi gian | Hốc tường phía Đông. Lò đá rộng ≈ 1 chiếu, trên có tủ túi (袋棚). Giấy dán ô vuông xanh trắng (市松) trên hốc tường và vách ngăn | [Đo] |
| Trà thất | Cửa chui (躙口) phía Đông, hốc tường phía Nam, chỗ pha trà phía Tây; «bát song»: 8 cửa sổ. Trần phần daime để lộ mái; phần 3 chiếu trần cói có nẹp tre. Cột giữa (中柱) còn vỏ, cong | [Đo] |
| Kích thước bao | Không có trong nguồn | — |

Kiểm tra diện tích:
- 11 + 6 + 3,75 = 20,75 chiếu × 1,82 m² ≈ 38 m².
- Cộng thủy ốc, bếp, hiên đất và tường → 56 m². Khớp.

### 3. Cấu trúc từ dưới lên
1. Đá kê thấp. Sàn gỗ nâng ≈ 40–50 cm [Ước].
2. Cột gỗ còn vỏ hoặc vỏ một phần. Tường đất trát vàng nâu. Cửa shōji, cửa ván.
3. Vì kèo đơn giản; kèo tre hoặc gỗ tròn lộ ở hiên.
4. Mái tranh irimoya dày, dốc. Ghép mái ván (trà thất) và mái ngói (phía sau) **thấp hơn, nối vào**, tạo khối không đối xứng.
5. Sống nóc tranh có nẹp tre / mái ngói nhỏ trên nóc [Ước].

### 4. Mặt bằng
- Mặt Bắc là hiên đất sâu hướng ra ao.
- Sau hiên: Nhất chi gian (Tây, hình L) và Nhị chi gian (Đông).
- Trà thất 3 chiếu daime gắn thêm.
- Phía sau (Nam): phòng ván, hậu gian, thủy ốc, bếp.

### 5. Cấu kiện nhận diện
1. Mái tranh irimoya **dày, dốc** chiếm phần lớn chiều cao.
2. Mái ván và mái ngói phụ nối thấp hơn; không đối xứng.
3. Hiên đất sâu có cột thô.
4. Tường đất vàng nâu, shōji trắng.
5. Giấy ô vuông xanh trắng ở hốc tường (nhìn qua cửa).
6. Cửa chui nhỏ của trà thất.

### 6. Vật liệu và màu
- Tranh `#8C7A5A`.
- Ván mái `#7A6A55`.
- Ngói `#5E6266`.
- Tường đất `#C8A97E`.
- Cột còn vỏ `#5C4A3A`.
- Shōji `#F4F1E6`.
- Ô vuông xanh `#3E5A8C` / trắng `#F2F2EE` [Ước màu].

### 7. Trang trí
- Ô vuông xanh trắng.
- Lò đá.
- 8 cửa sổ trà thất.
- Đường đá bước và đèn đá ngoài vườn.

### 8. Đề xuất game
- Khung mới **≈ 10 × 6 m** + hiên đất 1,8 m phía Bắc (thay 18 × 12 = 216 m², gấp 3,9 lần).
- Nếu cần cho người chơi đi lại bên trong: phóng đều ×1,3 → 13 × 8 m. Không phóng một chiều.
- Cao [Ước]: sàn +0,45; diềm tranh ≈ +2,4 m; nóc ≈ +6,5 m.

### 9. Nguồn
- https://ja.wikipedia.org/wiki/桂離宮 (đã mở: 56 m², phòng, mái)
- https://kotobank.jp/word/松琴亭-1545259 (trong kết quả tìm kiếm: cấu tạo)
- https://mirai-wood-archi.seesaa.net/article/502760195.html (trong kết quả tìm kiếm: mái ngói phía sau, máng tre)
- https://en.wikipedia.org/wiki/Katsura_Imperial_Villa (đã mở) · https://en.wikipedia.org/wiki/Sukiya-zukuri (đã mở)
- https://ja.wikipedia.org/wiki/岡山後楽園 (đã mở: 14,4 ha, Enyō-tei, Ryūten)
- Ảnh (từ Category đã mở https://commons.wikimedia.org/wiki/Category:Shōkin-tei):
  - https://commons.wikimedia.org/wiki/File:Shokin-tei_seen_from_the_Geppa-ro.jpg
  - https://commons.wikimedia.org/wiki/File:Shokin-tei.jpg
  - https://commons.wikimedia.org/wiki/File:Tea_room,_its_Nijiri-guchi_and_window_in_Shōkin-tei.png

---

## summit — Vọng Sơn Đình

### 1. Nguyên mẫu thật
**Shōkatei, Katsura Rikyū** (桂離宮賞花亭, Thưởng Hoa Đình).
Quán trà nhỏ trên đỉnh đảo núi trong vườn, kiểu «quán trà đèo» (峠の茶屋). Vị trí cao nhất vườn. Đúng chức năng «đình ngắm núi trên đỉnh».

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Kích thước | Mặt tiền 2 間 × sâu 1,5 間 ≈ **3,9 × 3,0 m** (Kyō-ma) hoặc 3,6 × 2,7 m | [Đo] thành phố Kyoto; quy đổi [Suy] |
| Diện tích xây dựng | 12 m² | [Đo] ja.wiki |
| Mái | Kirizuma, mái tranh | [Đo] |
| Cột | Cột còn vỏ | [Đo] |
| Nền | Nền đất giữa, 4 chiếu xếp hình chữ «コ» quanh. Có lò và bếp trên nền đất | [Đo] |
| Mở | Mặt Bắc (chính) và phần lớn mặt Tây để trống. Tường lề phía Tây và tường phía Đông có cửa sổ khung tre lớn (下地窓). Phía Nam có thủy ốc, trên là cửa sổ song tre | [Đo] |
| Lịch sử | Đổ hoàn toàn trong bão Muroto 1934; dựng lại 1935 bằng gỗ mới | [Đo] |

Chọn kích thước: 12 m² khớp 3,6 × 3,3 hoặc 3,9 × 3,0. Dùng **3,9 × 3,0 m** (Kyō-ma, vì ở Kyoto).

### 3. Cấu trúc từ dưới lên
1. Nền đất nện, chân đá.
2. 4–6 cột còn vỏ. Tường đất chỉ ở mặt Đông, Nam và một phần Tây.
3. Kèo gỗ tròn.
4. Mái tranh kirizuma, hai đầu hồi hở.

### 4. Mặt bằng
- Nền đất giữa có lò.
- Chiếu ngồi quanh ba cạnh.
- Mặt Bắc mở ra cảnh.
- Phía Nam là thủy ốc.

### 5. Cấu kiện nhận diện
1. Rất nhỏ, mái tranh kirizuma.
2. Hai mặt mở hoàn toàn.
3. Cột còn vỏ.
4. Đặt trên đỉnh đồi, có đá bước dẫn lên. Có bồn rửa tay đá phía trước (theo tên file Commons «Chōzu-bachi in front of Shōka-tei»).

### 6. Vật liệu và màu
- Tranh `#8C7A5A`.
- Cột `#5C4A3A`.
- Tường đất `#C8A97E`.
- Nền đất `#8A7660` [Ước].

### 7. Trang trí
Biển gỗ «賞花亭» trên tường Nam (chữ của Ryōshō Hosshinnō). Cửa sổ khung tre.

### 8. Đề xuất game
- Khung mới **3,9 × 3,0 m** (thay 9 × 9, gấp 6,9 lần diện tích).
- Nếu cần đứng được 3–4 người chơi: phóng ×1,4 → 5,5 × 4,2 m.
- Cao [Ước]: diềm ≈ 2,1 m, nóc ≈ 4,2 m.

### 9. Nguồn
- https://www2.city.kyoto.lg.jp/somu/rekishi/fm/nenpyou/htmlsheet/bunka11.html (trong kết quả tìm kiếm: 2 × 1,5 間, kirizuma tranh)
- https://ja.wikipedia.org/wiki/桂離宮 (đã mở: 12 m², 4 chiếu, cột còn vỏ)
- https://www.kikuyou.or.jp/gosyo_rikyu/katsura-rikyu.html (trong kết quả tìm kiếm: điểm cao nhất vườn)
- Ảnh (từ Category đã mở https://commons.wikimedia.org/wiki/Category:Shōka-tei):
  - https://commons.wikimedia.org/wiki/File:Shōka_tei.png
  - https://commons.wikimedia.org/wiki/File:Chōzu-bachi_in_front_of_Shōka-tei.png

---

## yaguraSW — Lầu Góc Tây Nam

### 1. Nguyên mẫu thật
**Tây Nam Ngung Lầu, Thành Nijō** (二条城西南隅櫓, góc «Khôn»), khoảng 1625–1626, Di sản văn hóa quan trọng.
Một trong hai lầu góc còn lại của Nijō (trận cháy 1788 thiêu các lầu khác).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Kiểu | Lầu 2 tầng mái / 2 sàn, irimoya, ngói bản | [Đo] |
| Mặt bằng tầng 1 | ≈ 7,2 m vuông (4 間) | [Blog] dẫn sách «Kettei-ban Nihon no meijō» |
| So sánh | Nhỏ hơn lầu Đông Nam một cỡ | [Đo] trang chính thức Nijō |
| Đầu hồi | Mái tầng 1 có **kara-hafu** hướng Tây (向唐破風). Huy hiệu hoa quỳ (葵紋) trên kara-hafu và đầu các sống xuôi | [Đo] |
| Hộc thả đá | Ở mặt Tây và Nam; làm trong cửa sổ lồi | [Đo] |
| Nội thất | Sàn ván; chỉ tầng 2 có trần ván nẹp | [Đo] |
| Cao | Không tìm được | — |

Ghi chú: 4 間 × 1,97 = 7,9 m; blog ghi 7,2 m (ứng với ken ≈ 1,8 m). Chọn **7,5 m**, ghi sai số ±0,4 m.

### 3. Cấu trúc từ dưới lên
1. Đặt trên góc tường đá ngoài.
2. Thân tầng 1 trát trắng; cửa sổ lồi có hộc thả đá ở hai mặt hướng hào.
3. Mái tầng 1 vòng quanh. Trên mặt Tây là kara-hafu.
4. Thân tầng 2 nhỏ hơn.
5. Mái irimoya trên cùng.

### 4. Mặt bằng
Vuông. Tầng 2 thu nhỏ. Cầu thang trong một góc.

### 5. Cấu kiện nhận diện
1. 2 tầng mái, trắng xám.
2. **Kara-hafu** cong trên mái tầng 1, mặt Tây. Đây là điểm khác với lầu Đông Nam.
3. Cửa sổ lồi có hộc thả đá.
4. Huy hiệu hoa quỳ.

### 6. Vật liệu và màu
- Tường `#F2F0EA`.
- Mái `#5E6266`.
- Đá `#9C968A`.
- Song cửa xám tối.

### 7. Trang trí
Huy hiệu hoa quỳ mạ hoặc khắc trên ngói [Ước: có thể là ngói thường, không mạ vàng].

### 8. Đề xuất game
- Khung **7,5 × 7,5 m** (khung 9 × 9 hơi lớn; nếu giữ 9 × 9 thì coi là phóng ×1,2).
- Cao [Ước]: diềm 1 ≈ +4,5; diềm 2 ≈ +8,5; nóc ≈ +11 m (so với lầu Đông Nam 12,6 m và nhỏ hơn một cỡ).

### 9. Nguồn
- https://nijo-jocastle.city.kyoto.lg.jp/introduction/highlights/teien/ (trong kết quả tìm kiếm: kara-hafu, nhỏ hơn Đông Nam)
- https://kokuho.tabibun.net/4/26/2613/s10/ (trong kết quả tìm kiếm)
- Blog 4 間 ≈ 7,2 m (trong kết quả tìm kiếm): https://ameblo.jp/shouta09/entry-12907448064.html
- https://bunkazai-map.colour-field.jp/cultural-property/B/I/01080/15 (trong kết quả tìm kiếm)
- Ảnh (từ Category đã mở https://commons.wikimedia.org/wiki/Category:Seinan_Sumi-yagura_(Nijō_Castle)):
  - https://commons.wikimedia.org/wiki/File:Nijo_Castle_09.JPG
  - https://commons.wikimedia.org/wiki/File:Nijo_Castle_14.JPG

---

## yaguraSE — Lầu Góc Đông Nam

### 1. Nguyên mẫu thật
**Đông Nam Ngung Lầu, Thành Nijō** (二条城東南隅櫓, góc «Tốn»), 1626, Di sản văn hóa quan trọng.
Có thể dựng lại bằng gỗ của Thành Fushimi (lỗ mộng cũ trên cột).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Kiểu | Lầu 2 tầng mái / 2 sàn, irimoya, ngói bản | [Đo] |
| Tầng 1 | 5 間 vuông (≈ 9,9 m Kyō-ma, hoặc 9 m ở 1,8 m/ken) | [Blog]; quy đổi [Suy] |
| Cao | 12,6 m (Đông Đại Thủ Môn bên cạnh: 13,5 m) | [Blog] |
| Đầu hồi | Mái tầng 1 có **chidori-hafu** hướng Nam | [Đo] trang chính thức Nijō |
| Cửa sổ | 6 cửa sổ trên cạnh dài tầng 1; tầng 2 phía trong chỉ 1 cửa | [Blog] |
| Hộc thả đá | Mặt Nam và Đông, làm trong cửa sổ lồi; tương truyền chỉ để trang trí | [Blog] |
| Nội thất | Sàn ván; chỉ tầng 2 có trần ván nẹp; có đinh tre để treo dây mồi súng | [Đo]/[Blog] |

### 3. Cấu trúc từ dưới lên
Giống lầu Tây Nam, khác ở: lớn hơn; **chidori-hafu tam giác** trên mái tầng 1 mặt Nam.

### 4. Mặt bằng
Vuông 5 間. Tầng 2 ≈ 4 間 [Ước].

### 5. Cấu kiện nhận diện
1. 2 tầng mái.
2. **Chidori-hafu tam giác** mặt Nam (lầu Tây Nam dùng kara-hafu cong; đây là cặp đối lập cần giữ).
3. Cửa sổ lồi có hộc thả đá ở hai mặt ngoài.
4. Hàng 6 cửa sổ tầng 1.

### 6. Vật liệu và màu
Như yaguraSW.

### 7. Trang trí
Ván gió chidori-hafu trát trắng. Onigawara.

### 8. Đề xuất game
- Khung **9,9 × 9,9 m** (khung 9 × 9 hiện tại gần đúng).
- Cao **12,6 m** tới nóc. Diềm 1 ≈ +5, diềm 2 ≈ +9,5 [Ước].

### 9. Nguồn
- https://nijo-jocastle.city.kyoto.lg.jp/introduction/highlights/teien/ (trong kết quả tìm kiếm)
- https://castle.jpn.org/yamashiro/nijyo/2.html (trong kết quả tìm kiếm: nội thất)
- https://serai.jp/tour/185794 (trong kết quả tìm kiếm)
- Blog 5 間, 12,6 m (trong kết quả tìm kiếm): https://watashinouta.at.webry.info/201010/article_5.html · https://www.kyoto-tabiya.com/2017/04/01/60586/
- Ảnh (từ Category đã mở https://commons.wikimedia.org/wiki/Category:Tōnan_Sumi-yagura_(Nijō_Castle)):
  - https://commons.wikimedia.org/wiki/File:Burg_Nijo,_Südost-Wachturm,_Tonan_Sumi_Yagura.jpg
  - https://commons.wikimedia.org/wiki/File:Kyoto_Nijo-jo_Südost-Wachturm_1.jpg

---

## yaguraNE — Lầu Góc Đông Bắc

### 1. Nguyên mẫu thật
**Cấn Lầu (Ushitora-yagura), Thành Takamatsu** (高松城旧東之丸艮櫓, góc «Cấn» = Đông Bắc), 1677, Di sản văn hóa quan trọng.
Chọn vì đúng hướng và là kiểu **3 tầng mái**, khác hai lầu Nijō.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Kiểu | Lầu góc 3 tầng mái / 3 sàn, kiểu tầng tháp (層塔型), irimoya, ngói bản, trát trắng toàn bộ | [Đo] Văn hóa sảnh, thành phố Takamatsu |
| Đầu hồi | Tầng 1: **chidori-hafu lớn ở đầu hồi, xuyên qua hai lớp mái**. Tầng 2: kara-hafu ở cạnh dài. Tầng 3: đầu hồi irimoya | [Đo]/[Blog] |
| Hộc thả đá | Kiểu váy hakama (袴型) ở góc phía ngoài thành | [Đo] thành phố Takamatsu |
| Cao | ≈ 11,5 m | [Blog] một trang cá nhân; độ tin thấp |
| Mặt bằng | Không tìm được số 間 | — |
| Lịch sử | Dời từ Đông Hoàn về nền lầu trống cũ năm 1965 hoặc 1967; **xoay 90°** so với hướng gốc | [Đo] |

Ghi chú: 11,5 m cho lầu 3 tầng là thấp so với Fujimi-yagura (15,5 m), nhưng hợp với lầu góc nhỏ. Dùng tạm, đánh dấu cần kiểm.

### 3. Cấu trúc từ dưới lên
1. Bệ đá góc.
2. Tầng 1 trát trắng; hộc thả đá kiểu hakama ở góc.
3. Mái 1 + chidori-hafu lớn chồng lên mái 2.
4. Tầng 2 nhỏ hơn; kara-hafu cạnh dài.
5. Tầng 3; mái irimoya trên cùng.

### 4. Mặt bằng
- Gần vuông, thu đều theo tầng (kiểu tầng tháp).
- Đối chiếu tỉ lệ thu của lầu 3 tầng Fujimi-yagura: 7 × 6 → 6 × 5 → 4,5 × 3,5 間 (tức ≈ 1 : 0,85 : 0,62).

### 5. Cấu kiện nhận diện
1. **3 tầng mái** thu đều.
2. Chidori-hafu lớn xuyên hai mái ở tầng 1.
3. Kara-hafu ở tầng 2.
4. Hộc thả đá kiểu váy hakama (chân phình ra ở góc tường).

### 6. Vật liệu và màu
Như các yagura khác.

### 7. Trang trí
Ván gió trát trắng; onigawara.

### 8. Đề xuất game
- Khung tầng 1 **≈ 9 × 9 m** (giữ khung hiện tại); tầng 2 ≈ 7,7 × 7,7; tầng 3 ≈ 5,6 × 5,6 (thu theo tỉ lệ Fujimi) [Suy].
- Cao ≈ 11,5 m [Blog]. Nếu muốn nổi bật hơn hai lầu Nijō, có thể tăng tới 13 m. Ghi rõ là lệch nguồn.

### 9. Nguồn
- https://online.bunka.go.jp/heritages/detail/191113 (trong kết quả tìm kiếm)
- https://www.city.takamatsu.kagawa.jp/smph/kurashi/kosodate/bunka/bunkazai/shiteibunkazai/kenzo/siro.html (trong kết quả tìm kiếm: chidori-hafu, hộc hakama)
- https://ja.wikipedia.org/wiki/高松城_(讃岐国) (đã mở: lịch sử dời)
- https://artexhibition.jp/topics/features/20220703-AEJ871452/ (trong kết quả tìm kiếm: tỉ lệ thu Fujimi-yagura 7 × 6 / 6 × 5 / 4,5 × 3,5 間; cao 15,5 m)
- Ảnh (từ Category đã mở https://commons.wikimedia.org/wiki/Category:Ushitora-yagura_(Takamatsu_Castle)):
  - https://commons.wikimedia.org/wiki/File:Takamatsu_Castle_(Sanuki),_Ushitora-yagura.jpg
  - https://commons.wikimedia.org/wiki/File:Takamatsu_castle_Ushitorayagura.jpg

---

## yaguraNW — Lầu Góc Tây Bắc

### 1. Nguyên mẫu thật
**Càn Lầu (Inui-yagura), Tây Hoàn Thành Osaka** (大坂城乾櫓, góc «Càn» = Tây Bắc), 1620, thiết kế của Kobori Enshū, Di sản văn hóa quan trọng.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Kiểu | 2 tầng mái / 2 sàn, ngói bản. Mặt bằng **chữ L**, **hai tầng bằng nhau** (総2階造) | [Đo] PDF Osaka Castle Park |
| Diện tích | Tầng 1: 186,23 m². Tầng 2: 186,23 m². Tổng 372,46 m² | [Đo] |
| Hộc thả đá | Giữa tường mặt Tây và mặt Bắc (hướng hào) mỗi mặt một hộc **dạng chìa có đầu hồi kirizuma** | [Đo] |
| Biệt danh | «Lầu ba mặt chính» (三方正面): nhìn được từ Nam, Tây, Bắc | [Đo] |
| Cao | Không tìm được | — |

Đối chiếu cùng tác giả: Thiên Quán Lầu (千貫櫓) Osaka, 2 tầng, tầng 1 217,26 m², tầng 2 162,95 m², trong mỗi tầng có hành lang vòng + 4 phòng.

### 3. Cấu trúc từ dưới lên
1. Bệ đá góc tù.
2. Hai tầng **cùng mặt bằng**: tường thẳng từ đất tới mái 2, chỉ có một mái hiên ngăn giữa hai tầng.
3. Hộc thả đá chìa ra có mái kirizuma nhỏ.
4. Mái irimoya trên cùng chạy theo hình chữ L (hai cánh gặp ở góc).

### 4. Mặt bằng
- Chữ L ôm góc thành.
- 186 m² mỗi tầng. Nếu mỗi cánh sâu ≈ 7 m [Ước], tổng chiều dài trục hai cánh ≈ 26 m (≈ 13 + 13 m).

### 5. Cấu kiện nhận diện
1. **Chữ L**, hai tầng bằng nhau (khối hộp đứng, không thu tầng). Rất khác ba lầu góc kia.
2. Hộc thả đá chìa ra có đầu hồi kirizuma ở giữa mặt Tây và Bắc.
3. Mái irimoya gãy góc.

### 6. Vật liệu và màu
Như các yagura khác.

### 7. Trang trí
Đầu hồi kirizuma của hộc thả đá là điểm nhấn duy nhất.

### 8. Đề xuất game
- Khung 9 × 9 không đúng hình. Đề xuất **chữ L, mỗi cánh 13 × 7 m**, hộp bao ≈ 13 × 13 m.
- Cao [Ước]: diềm 1 ≈ +4,5, diềm 2 ≈ +9, nóc ≈ +12 m.
- Nếu bắt buộc 9 × 9: dùng chữ L nhỏ, mỗi cánh 9 × 4,5 m, giữ «hai tầng bằng nhau» và hộc chìa.

### 9. Nguồn
- https://www.osakacastlepark.jp/cms/public/admin/uploads/events/pdf/d4dd5befaa2e33896b72c8e808c30e6a.pdf (đã mở: diện tích, chữ L, hộc chìa có kirizuma; cả số Thiên Quán Lầu)
- https://osaka-castle.jp/osakajo/tamonyagura.html (đã mở, cùng hệ thống trang)
- Ảnh: không tìm thấy trang Category Commons cho lầu này trong phiên. Cần bổ sung.

---

## azumaya — Đình Nghỉ Vườn

### 1. Nguyên mẫu thật
**Manji-tei (Tứ Yêu Quải), Katsura Rikyū** (桂離宮卍亭 / 四ツ腰掛).
Đình nghỉ vuông, 4 ghế ngồi xoay theo hình chữ 卍. Người ngồi không nhìn thẳng mặt nhau.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Kích thước | **2,83 m vuông** | [Đo] ja.wiki 桂離宮 (cũng có trong kết quả tìm kiếm) |
| Mái | Hōgyō (宝形造, mái chóp bốn mặt), mái tranh | [Đo] |
| Ghế | 4 ghế, xếp hình chữ 卍; không có chiếu | [Đo] |

### 3. Cấu trúc từ dưới lên
1. Nền đất có đá lát.
2. 4 cột góc (+ cột giữa ghế) [Ước].
3. 4 ghế ván bám vào 4 cạnh, mỗi ghế lệch về một góc.
4. Mái tranh hōgyō, đỉnh nhọn có chóp nhỏ.

### 4. Mặt bằng
- Vuông 2,83 m.
- 4 ghế ván xoay vòng (mỗi ghế chiếm hơn nửa cạnh, đầu ghế chạm góc).

### 5. Cấu kiện nhận diện
1. Mái tranh **chóp bốn mặt** trên đình vuông nhỏ.
2. **4 ghế hình chữ 卍**.
3. Mở bốn phía.

### 6. Vật liệu và màu
- Tranh `#8C7A5A`.
- Cột `#5C4A3A`.
- Ghế ván `#9A7B58`.

### 7. Trang trí
Không có. Vẻ đẹp nằm ở bố cục ghế.

### 8. Đề xuất game
- Khung **2,83 × 2,83 m** (thay 8 × 8, gấp 8 lần diện tích).
- Nếu cần chỗ cho người chơi: phóng ×1,5 → 4,2 m vuông.
- Cao [Ước]: diềm 2,1 m, đỉnh ≈ 4 m.

### 9. Nguồn
- https://ja.wikipedia.org/wiki/桂離宮 (đã mở)
- Ảnh: https://commons.wikimedia.org/wiki/File:Manji_tei.png (tên file từ Category Katsura Imperial Villa, đã mở)

---

## machiai — Đình Chờ Trà

### 1. Nguyên mẫu thật
**Soto-koshikake (Ngoại Yêu Quải, ghế chờ ngoài), Katsura Rikyū** (桂離宮外腰掛).
Chỗ khách ngồi chờ trước khi vào Shōkintei.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Kích thước | Mặt tiền **3 間 × sâu 1 間** ≈ 5,9 × 2,0 m (Kyō-ma) | [Đo] ja.wiki; quy đổi [Suy] |
| Mái | Mái tranh, yosemune (寄棟, mái bốn mái dốc) | [Đo] ja.wiki (mái tranh); trang tìm kiếm ghi «間口三間の茅葺寄棟造» |
| Cột | Gỗ sồi kunugi còn vỏ | [Đo] |
| Ghế | Ghế ván, không chiếu | [Đo] |

### 3. Cấu trúc từ dưới lên
1. Nền đất có đá lát; trước ghế là hàng đá bước.
2. Cột kunugi còn vỏ. Tường đất phía sau [Ước].
3. Ghế ván dài suốt mặt tiền.
4. Mái tranh yosemune thấp, vươn xa che ghế.

### 4. Mặt bằng
Dải dài 3 × 1 間. Ghế dọc tường sau. Mặt trước mở.

### 5. Cấu kiện nhận diện
1. Mái tranh bốn mái **dài, thấp**.
2. Ghế ván dài.
3. Cột còn vỏ cong.
4. Hàng đá bước phía trước.

### 6. Vật liệu và màu
- Tranh `#8C7A5A`.
- Cột kunugi `#4E3D30`.
- Tường đất `#C8A97E`.
- Ghế `#9A7B58`.

### 7. Trang trí
Không có; đá lát và đá bước là phần trang trí.

### 8. Đề xuất game
- Khung **5,9 × 2,0 m**, thêm hiên mái 0,8 m mỗi bên → bao mái ≈ 7,5 × 3,6 m (thay 8 × 8).
- Cao [Ước]: diềm ≈ 2,0 m, nóc ≈ 3,8 m.

### 9. Nguồn
- https://ja.wikipedia.org/wiki/桂離宮 (đã mở)
- Ảnh (từ Category đã mở https://commons.wikimedia.org/wiki/Category:Soto-Koshikake_(Katsura_Imperial_Villa)):
  - https://commons.wikimedia.org/wiki/File:Katsura_Rikyu_(3264656044).jpg
  - https://commons.wikimedia.org/wiki/File:Katsura_Villa,_Kyoto_(1).jpg

---

## tsukiyama — Giả sơn (núi vườn)

Không phải công trình, ghi ngắn để đủ danh sách.
- **Nguyên mẫu:** núi Yuishin-zan (唯心山), Kōraku-en Okayama, hoàn thành khoảng 1743. Thêm đảo núi có Shōkatei ở Katsura.
- **Số đo:** ja.wiki không cho chiều cao Yuishin-zan; chưa tìm được nguồn đo trong phiên.
- **Đề xuất:**
  - Giữ khung 40 × 30 × 9 m của `siteplans.js` nhưng làm **đồi cỏ thoải**, phủ cỏ và cây bụi tỉa tròn (karikomi).
  - Có đường xoắn lên đỉnh. Đá tảng chỉ điểm vài chỗ.
  - Không làm núi đá dựng đứng kiểu non bộ Trung Hoa.
  - Nếu đặt Vọng Sơn Đình lên đỉnh, đúng tinh thần Shōkatei.
- **Nguồn:** https://ja.wikipedia.org/wiki/岡山後楽園 (đã mở).

---

## Độ tin cậy

| Mức | Công trình | Ghi chú |
|---|---|---|
| **Chắc** (số đo từ nguồn chính thức / có trích dẫn) | tower (cao, số tầng, kích thước tầng theo ken); umaya (mét chính thức); chashitsu (56 m²); summit (2 × 1,5 間, 12 m²); azumaya (2,83 m); machiai (3 × 1 間); yaguraNW (diện tích sàn); masuE (10 × 4 間; Osaka 14,7 m, 710 m²) | Chiều cao các nhà vườn vẫn là ước lượng |
| **Khá chắc** (hồ sơ chính thức cho diện tích và số nhịp; kích thước bao suy từ mặt bằng chính thức) | main, shikidai, kuroshoin, shiroshoin | Kích thước bao ±10%; **chiều cao và độ dốc mái chưa có nguồn**, đang là ước lượng |
| **Một phần** (kích thước có, chi tiết phải suy) | kesho (7,8 × 3,3 間 chắc; mái irimoya chưa xác nhận); kura (17 × 3 間 chỉ từ một trang phụ); masuW (sân 27 × 38 m chắc; kích thước kōraimon chỉ có lối mở 5,5 × 7,1 m từ trang phụ) | |
| **Yếu** (số chủ yếu từ blog) | yaguraSW (≈ 7,2 m), yaguraSE (5 間, 12,6 m), yaguraNE (11,5 m, không có mặt bằng) | Cần tra hồ sơ trùng tu hoặc bản đo |
| **Không tìm được** | Độ dốc mái và độ vươn hiên của mọi công trình; độ nghiêng bệ đá Himeji; cao diềm và nóc của các dinh Nijō; chiều cao Yuishin-zan; ảnh Commons cho Osaka Inui-yagura | Đều đánh dấu [Ước] trong file |

Việc nên làm tiếp (khi có thêm lượt tìm kiếm):
1. Tìm 修理工事報告書 (báo cáo trùng tu) của Ninomaru Goten và Himeji. Lấy cao diềm, cao nóc, độ dốc mái (寸勾配).
2. Đo trên ảnh chính diện độ dốc mái và tỉ lệ mái / tường (Ōhiroma, Himeji mặt Nam).
3. Xác nhận phân bổ tầng trong 3 重 / 4 重 của Himeji trên mặt cắt `Himeji_model7.JPG`.
4. Tra hồ sơ Văn hóa sảnh của Nijō Đông Nam / Tây Nam Ngung Lầu (số 間 chính thức).
