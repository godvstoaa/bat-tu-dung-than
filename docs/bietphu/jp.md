# Biệt phủ — họ «jp»: Dinh Thự Nhật Bản (`nhatban`) và Biệt Viện Bali (`bali`)

Mã: `src/game/archcity/est-jp.js` (điều phối + tháp / đình / cổng Nhật), `est-jp-house.js` (nhà Nhật 2 tầng, vật liệu, rui),
`est-jp-bali.js` (toàn bộ Bali), `est-jp-tex.js` (texture canvas mái tranh / ijuk / poleng).
Chỉ import từ `tienphu/arch/jp-kit.js`, `jp.js`, `jp-res.js`; vật liệu lặp theo mét từ `archcity/mats.js`.

## 1. Nguyên mẫu và nguồn

### nhatban

| Phần | Dựng theo | Nguồn |
|---|---|---|
| Nhà chính phủ (41 × 19, nền 2,4) | Dinh shoin-zukuri 2 tầng thời Edo cuối: Seisonkaku 成巽閣 (Kanazawa 1863, tầng dưới buke shoin, tầng trên sukiya), Hiunkaku 飛雲閣; ngôn ngữ mặt nhà lấy từ Ōhiroma Ninomaru Goten Nijō (cột vuông lộ, cửa trượt 舞良戸 + 明障子, 欄間, 長押 có 釘隠 vàng, dải vữa trắng 小壁, irimoya ngói bản, hồi 狐格子 + 懸魚 vàng). Nền 2,4 m là 石垣 đá đẽo 切込接 như ngự điện trên nền thành | `docs/tienphu-nghiencuu/02-nhatban.md` §1, main, shiroshoin; kit `jp-res.js` shoinBlock; https://en.wikipedia.org/wiki/Shoin-zukuri |
| Đông sương (21 × 11) | Cùng ngôn ngữ, thu nhỏ, không vàng, không kara-hafu | như trên |
| Biệt thự v0 | Machiya Kyōto 平入り: trệt song gỗ 千本格子 trước cửa giấy, lầu thấp 虫籠窓 trát, kirizuma ngói xám + 下屋 | https://en.wikipedia.org/wiki/Machiya |
| Biệt thự v1 | Nhà sukiya võ gia: irimoya mái ván 杮葺, vách đất 聚楽 vàng nâu, trệt 7 gian cửa giấy hẹp | 02-nhatban §1.2, §1.4 (sukiya, kokera, đất 聚楽) |
| Biệt thự v2 | Nhà 妻入り đầu hồi ra đường: kirizuma nóc dọc, ngói 銀鼠 xám lam, 3 gian rộng, lan can 手摺 trước cửa sổ lầu, vách hồi có thanh 貫 | ảnh nhà phố Takayama / Kurashiki (quan sát chung, không có số đo) |
| Tháp | Thiên thủ nhỏ tầng tháp hình 層塔型 4 重 (kiểu Marugame / Uwajima, nâng cao) trên 石垣 8 m nghiêng cong, chidori-hafu N/B tầng 1, Đ/T tầng 2, kara-hafu tầng 3, hộc thả đá Đ/T, sọc vữa mạch ngói, shachi; cửa sắt ở chân đá | 02 §1.3, tower, yagura*; kit `jp.js` jpYagura |
| Đình | Azumaya 東屋 mái tranh chóp vuông 宝形 (Manji-tei Katsura) trên nền đá 0,38 m | 02 › azumaya; kit `jp-res.js` jpAzumaya |
| Cổng phủ | Nagaya-mon 長屋門 của dinh võ gia (Akamon Kaga-yashiki 1827, nagaya-mon Hagi / Kakunodate): gian giữa kiểu yakuimon 2 trụ chính + 2 trụ chống, xà 冠木, kirizuma ngói cao, cánh ván nẹp sắt mở vào, huy hiệu vàng; hai dãy nhà lính tường ván đen / vữa trắng, cửa sổ 武者窓, mái irimoya | https://en.wikipedia.org/wiki/Nagayamon ; 02 › masuW (kōraimon) cho chi tiết cổng |
| Cổng biệt thự | Munamon 棟門, 3 biến thể: v0 ngói + tường trát 築地塀, v1 mái ván + rào tre 建仁寺垣, v2 ngói xám lam + tường ván cháy 焼杉 | quan sát chung |

### bali

| Phần | Dựng theo | Nguồn |
|---|---|---|
| Nhà chính (37 × 16, nền 2,4) | Bale lớn mái hai tầng (tumpang) kiểu Kerta Gosa / Bale Kambang Klungkung: bataran gạch đỏ chân paras, gờ paras 2 lớp, ô chạm paras; vách gạch đỏ có trụ paras chạm đầu, diềm paras hoa văn karang, cửa kori son + vàng mở vào, cửa sổ gỗ son song vàng; hàng cột saka son 3 vòng vàng ngoài vách 0,95 m; mái tranh alang-alang dày 0,55 m, dải song thông gió giữa hai tầng mái, bờ nóc / bờ chái phủ ijuk đen, 3 murdha vàng | Puri Saren Agung Ubud (quan sát ảnh), https://en.wikipedia.org/wiki/Balinese_architecture (balé gede 12 cột, mái tranh / ijuk, nền đá + gạch đỏ, dvarapala giữ cổng, murdha vàng) |
| Đông sương (18 × 10) | Bale một tầng mái tranh dốc, cùng vách / cột | như trên |
| Tháp | Meru tumpang solas 11 mái ijuk đen: bệ xây 2 cấp, buồng thờ gedong gạch + paras cửa son vàng, cột gỗ sơn đen đỏ, 11 mái thu đều 8,7 → 1,9 m cách 2,2 m, cổ gỗ có viền son + vàng, murdha vàng trên chóp đất nung | https://en.wikipedia.org/wiki/Pura_Taman_Ayun ; https://en.wikipedia.org/wiki/Meru_tower ; https://badungtourism.badungkab.go.id/detail_obyek_wisata/detail/TA2021/pura-taman-ayun.html (meru 11 tầng mái sợi ijuk; bệ xây ~1 m, buồng gỗ trên cột, mái giảm dần) |
| Đình | Bale bengong 4 saka son, mái chóp tranh dốc + nắp ijuk + murdha, ghế ván 2 bên, lan can song sau, trên bataran 0,5 m | Balinese architecture (bale bengong vườn) |
| Cổng phủ | Candi bentar: tháp gạch đỏ chẻ đôi, mặt chẻ phẳng hướng vào lối, hai nửa đối xứng gương, giật cấp 7 tầng có chóp nhỏ ở góc ngoài, ô chạm paras, không mái, không cánh; nền đá có bậc hai phía; hai đoạn tường rào gạch đỏ mũ paras | https://en.wikipedia.org/wiki/Candi_bentar (hai nửa gương, mặt trong trơn, lối nâng có bậc, không cửa; Wringin Lawang cao 15,5 m) |

Tìm kiếm phiên này: «Pura Taman Ayun meru 11 tiers height ijuk roof candi bentar dimensions» — không có số đo chiều cao meru / candi;
dùng số [Ước] bên dưới.

## 2. Quy tắc có số đo

### Chung (cả hai phong cách)
- Vách trên chu vi w × d; khe cửa giữa +z (và −z nếu `back`) rộng ≥ 2,4 m, không cánh chắn.
- Nền (w + 2,4) × (d + 2,4), mặt trên = plinth; bậc giữa rộng min(6, 0,3 w), 0,17 × 0,32 m mỗi bậc.
- Sàn trong ở plinth (chiếu Nhật +0,02; lát paras Bali +0,02), trống ≥ 85 %.
- Vật liệu lặp theo mét (`tiled`): vữa 256 px/m, gỗ / ván 512 px/m, đá 427 px/m, ngói 512 px/m, gạch 533 px/m.
  Mái tranh / ijuk canvas 512 px/m (u dọc mép hiên, v xuôi dốc).
- Sau `consolidate`: 13 lệnh vẽ nhà chính Nhật, 13 Bali (≤ 15).

### nhatban
- Gian: phủ 2,4 m (gian giữa 3,2), biệt thự 2,2 / 1,8 / 3,4 theo biến thể; cột vuông 0,26.
- Cửa trượt cao 2,35 m, ô giấy 欄間 0,42, 長押 0,22, vách vữa trên tới 桁.
- Trệt: h1 = max(4,4; 0,46 b.h) phủ chính, max(3,9; 0,56 b.h) phụ, max(3,6; 0,54 b.h) biệt thự.
  Vách trệt dừng ở mặt dưới mái hiên vòng (thực tế 4,1 m phủ chính).
- Lầu lùi 1,8 / 1,3 / 0,9 m; cao h2 = max(3,6; 0,36 b.h) phủ chính.
  Chân tường 0,82, cửa sổ giấy 1,32, vữa trên.
- Mái hiên vòng 下屋 vươn 2,0 / 1,6 / 1,15 m, dốc 0,40 → 0,50; mái đỉnh vươn 2,3 / 1,8 / 0,95 m, dốc 0,40 → 0,80, irimoya dG = vươn + 0,42 × nửa sâu.
  Ngói ống bước 0,46 m, rui kép 二軒 bước 0,55 m.
- Nóc: phủ chính 18,2 m (1,36 × (plinth + h)), phụ 12,3 m, biệt thự 10,7–12,3 m.
- Nền phủ: 石垣 nghiêng 0,3 m, góc 算木積, gầm tối lùi 0,28 m, cột chống 束 cách ~1,95, dầm mép 縁葛, ván hiên phủ cả nền.
- Màu: vữa #fbf8f1, gỗ #6e5239, ngói #8d9398 (xám lam #6f7d8e ở v2), mái ván 杮葺 canvas kit, vàng #c9a24a chỉ ở phủ.
- Tháp: bệ 8 m nghiêng 0,75; tầng 7,2 × 6,6 → 3,9 × 3,5 m, cao 4,8 / 4,0 / 3,7 / 3,5; nóc 26,9 m.
- Cổng phủ: lối 8 m, trụ chính 0,5 × 0,62 cao 5,1 m; mỗi dãy nhà lính 4,6 × 4,2 m, tường 3,4 m; rộng 20,6 m.
- Cổng biệt thự: trụ 0,3 × 0,36 cao 2,75 m; tường 1,6 m mỗi bên; rộng 7,7 m.

### bali
- Vách gạch cao 3,7 m (nhà chính) / 3,3 m (phụ); chân paras 0,45, diềm paras 0,42 có khối karang bước 0,7 m; trụ paras 0,54 ở mỗi mép gian (gian 3,0, giữa ≥ 3,6).
- Cửa kori 2,7 × 2,75 m, khung son 0,3, cánh son có tấm chạm vàng, vương miện vàng trên lanh tô.
- Cửa sổ 1,35 × 1,5 m, bệ 1,0 m, ván son + song vàng bước 0,17.
- Cột saka 0,3 m, cách vách 0,95 m; chân paras 0,56; đầu cột chạm vàng.
- Mái tranh: dốc 0,80 → 1,00 (tầng dưới), 0,85 → 1,30 (tầng trên, 40–52°); vươn 1,15 / 1,1 m; dày mép 0,55 m.
  Nhà chính: lùi tầng trên 2,56 m, dải song 1,5 m. Nóc nhà chính 20,5 m (1,53×), phụ 13,1 m.
- Meru: 11 mái, nửa rộng 4,35 → 0,95 m, khoảng 2,2 m, dày 0,34, dốc 0,5 / 0,7; cao 31,7 m.
- Đình: 4 saka cách 5,1 m, cột 2,9 m, mái chóp vươn 1,35, dốc tới 1,38; nóc 9,4 m.
- Candi bentar: nửa rộng chân 3,0 m, thân gạch 3,0 m, 7 tầng giật cấp thu 18 % mỗi tầng; cao 11,4 m. Lối 8 m; rộng 18,3 m.

## 3. Kết quả kiểm

`STYLE=nhatban,bali node --max-old-space-size=3000 scripts/bietphu-check.mjs`:

```
== nhatban
  phủ    main  41×19 ĐẠT  tris  72156/ 13216 sàn 100% đỉnh 18.2 (1.36×)
  phủ    guest 21×11 ĐẠT  tris  35664/  8636 sàn 100% đỉnh 12.3 (1.43×)
  tháp ĐẠT tris 37392 cao 26.9 (lô 36) rộng 10.5×10.3 (lô 10×10)
  đình ĐẠT tris 2812 cao 7.3 rộng 7.4×7.8
  cổng phủ  ĐẠT tris 17348 cao 8.6 rộng 20.6
  villa0 main  12×9 ĐẠT  tris  23024/  8284 sàn 100% đỉnh 10.8 (1.33×)
  villa1 main  12×9 ĐẠT  tris  12056/  7976 sàn 100% đỉnh 10.7 (1.32×)
  villa2 main  12×9 ĐẠT  tris  20024/  6844 sàn 100% đỉnh 12.3 (1.52×)
  cổng villa ĐẠT tris 7876 cao 4.2 rộng 7.7
== bali
  phủ    main  37×16 ĐẠT  tris  40448/ 15008 sàn 100% đỉnh 20.5 (1.53×)
  phủ    guest 18×10 ĐẠT  tris  14924/  6980 sàn 100% đỉnh 13.1 (1.52×)
  tháp ĐẠT tris 16276 cao 31.7 (lô 36) rộng 9.0×10.5 (lô 10×10)
  đình ĐẠT tris 4996 cao 9.4 rộng 8.1×8.9
  cổng phủ  ĐẠT tris 2324 cao 11.4 rộng 18.3
Tổng 14 phần, lỗi 0
```

Kiểm thêm (`scripts/tmp/gatevar.mjs`):
- Cổng biệt thự v0 / v1 / v2: 7876 / 1796 / 7876 tam giác. Tia ở x = −1,15 / 0 / 1,15 thông suốt.
- Cổng phủ Nhật và Bali: 5 tia ở |x| ≤ 3,55 thông suốt từ z = +6 tới −12.

## 4. Ảnh đã xem (`output/bietphu-look/`)

- nhatban:
  - `nhatban-phu-main-{persp,eye,door}`, `nhatban-phu-guest-{persp,eye,door}`
  - `nhatban-villa{0,1,2}-main-{persp,eye,door}`
  - `nhatban-tower-{persp,eye}`, `nhatban-pav-{persp,eye}`
  - `nhatban-phu-gate-{persp,eye}`, `nhatban-villa-gate-{persp,eye}`, `nhatban-villa-gate-v1-*`, `nhatban-villa-gate-v2-*`
- bali:
  - `bali-phu-main-{persp,eye,door}`, `bali-phu-guest-{persp,eye,door}`
  - `bali-tower-{persp,eye}`, `bali-pav-{persp,eye}`, `bali-phu-gate-{persp,eye}`

Các vòng sửa sau khi xem ảnh:
1. Ngói quá đen, vữa xám bẩn: ngói đổi #62676c → #8d9398, vữa đổi → #fbf8f1.
2. Chiếu một tấm kéo giãn 41 m: nhân UV để mỗi ô = 1,91 × 0,955 m.
3. Mái tranh Bali phẳng, vàng như bìa:
   - texture mới: lớp bó tranh, sợi, vệt phong hóa, mặt cắt mép;
   - màu tối hơn, dốc 0,85 → 1,30, mép dày 0,55.
4. Cửa sổ Bali là hộp đen: thay bằng ván son + song vàng.
5. Mái tranh đình Nhật dùng texture kaya mới, thay texture canvas trơn của kit.
6. Cổng phủ Nhật vượt ngân sách (20,6k): giãn ngói ống, lưới mái 10 cột, giãn rui → 17,3k.

## 5. Chưa đạt / chưa làm

- **Bệ đá 2,4 m dưới dinh Nhật** là lệch phong cách. Shoin thật chỉ có sàn gỗ trên đá kê (02 §1.5 mục 9).
  Hợp đồng lô bắt nền 2,4 m nên dựng thành 石垣 đẽo + gầm gỗ, như ngự điện trên nền thành.
- **Nhà Nhật 2 tầng phủ** là tổng hợp (Seisonkaku / Hiunkaku), không có số đo cao diềm thật cho loại này. Các số h1 / h2 là [Ước].
- **Đình** Nhật và Bali đều vuông. Lô gửi `octa: true` nhưng Nhật và Bali không dùng đình bát giác.
- **Tháp Nhật** cao 26,9 m (lô gợi ý ~36). Mặt bằng vuông gần đều nên dáng hơi «tháp chùa». Chưa có tiểu thiên thủ / tsuke-yagura.
  Mái chìa ra 10,5 m, quá lô 10 m 0,25 m mỗi bên.
- **Bali:**
  - Chạm khắc chỉ là khối nổi + texture vân (marble nhuộm), chưa có hoa văn karang / patra thật.
  - Tượng dwarapala giản lược (khối tiện).
  - Mái tranh nhìn xa vẫn khá phẳng: chưa có độ võng / lớp so le hình học.
  - Meru: cổ gỗ giữa các mái hầu như bị che, nhìn từ dưới giống chồng khối. Chưa có cột / lan can buồng gỗ như meru thật.
- **Candi bentar** chỉ có 7 tầng hộp giật cấp + chóp góc. Thiếu bóng dáng cong của «cánh» (sayap) và mặt nạ Bhoma trên thân.
- **Biệt thự Bali** không làm (không có khu). Hàm vẫn trả bản bale một tầng nếu được gọi.
- **Texture canvas** (giấy shoji, cửa ván, ô cờ, chiếu, mái ván 杮葺 của kit; mái tranh / ijuk của họ này) chưa có normal map. Ngói và vữa thì có.
- **Ảnh cổng biệt thự v1 / v2** chụp bằng bản sao script ở `scripts/tmp/look-gatevar.mjs`, vì `bietphu-look` chưa truyền `variant` cho cổng.

## 6. Mục tiêu tiếp theo

1. Hoa văn Bali thật: texture canvas karang / patra cho `carveParas` / `carveGold`, có normal.
   Đo: ảnh mắt người thấy được hoa văn ở 3 m.
2. Meru lộ buồng gỗ và cột giữa các mái. Đo: nhìn từ mặt đất thấy ≥ 5 khe sáng giữa các tầng.
3. Thiên thủ thêm tiểu thiên thủ hoặc tsuke-yagura và nâng lên ~32 m, giữ ≤ 50k tam giác.
4. Đồ trong nhà (bình phong, đèn andon / tượng Bali) đặt trong dải 1,2 m sát vách để không phạm sàn trống.
