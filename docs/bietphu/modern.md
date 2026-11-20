# Biệt phủ — họ Hiện Đại (kinh · toigian · nhietdoi)

Mã: `src/game/archcity/est-modern.js` (họ) + `src/game/archcity/est-modern-kit.js` (bộ dựng riêng).
Hợp đồng: `docs/bietphu/00-HOP-DONG.md` (kể cả dòng «Biến thể biệt thự» `opt.variant` 0/1/2).
Bộ kit tiên phủ chỉ import, không sửa: `tienphu/arch/kit.js` (Acc, box) và `tienphu/arch/ad-kit.js` (face, fbox, wallOpen, fillOpening, steps, prism).

## 1. Nguyên mẫu đã tham chiếu

Nguồn trong dự án: `docs/tienphu-nghiencuu/05-artdeco.md` (phần chung §1–§4). Lấy từ đó:
- khung cửa kim loại ≤ 6 cm, màu tối (sai lầm 5);
- không để lộ mái dốc (sai lầm 3);
- mỗi nhà ít nhất 3 cao độ mái (sai lầm 1);
- lan can mảnh, «trong», không xây đặc (sai lầm 8).

Nguồn ngoài: kiến thức kiến trúc phổ thông (Wikipedia / ArchDaily). **Phiên này không tải lại trang để kiểm**, xem mục Chưa đạt.

| Phần | Nguyên mẫu | Lấy gì |
|---|---|---|
| kinh — nhà chính | Farnsworth House (Mies, 1951), Glass House (P. Johnson, 1949), Seagram (gân đố đồng chữ I) | vách kính suốt đố mảnh có gân nhô, tấm sàn trắng công-xôn, tầng trên lùi lấy sân thượng, mái tấm mỏng vươn |
| kinh — vách hồi, đình | Barcelona Pavilion (Mies, 1929) | nền travertine, vách đá trượt ra ngoài mặt kính, cột thép chữ thập crôm, vách onyx đứng tự do, bể phản chiếu |
| kinh — nhà phụ | Glass House + Brick House (Johnson) | đế kính, hộp trắng kín cửa băng lơ lửng công-xôn |
| kinh — tháp | tháp kính khung mảnh kiểu Mies / Seagram | sảnh kính 5,4 m, 6 tầng, tấm sàn trắng, ban công công-xôn xoay vòng f → r → b → l, vương miện lam kính |
| toigian — nhà chính, biệt thự 0 | Villa Savoye (Le Corbusier, 1931) | hộp trắng công-xôn trên cột pilotis, cửa băng (fenêtre en longueur), vườn mái, vách gió cong (solarium) |
| toigian — tầng trệt, biệt thự 1, đình | Tadao Ando (Nhà thờ Ánh Sáng 1989, Azuma House) | bê tông trần tấm 1,8 × 0,9 m có 6 lỗ ty, cửa sổ khung hộp nhô, khe chữ thập, lô-gia khoét |
| toigian — tháp, biệt thự 2 | Vitra Haus (Herzog & de Meuron, 2010), nhà khối xếp lệch | khối lập phương trắng xếp lệch, khe kính lùi giữa các khối |
| nhietdoi | Geoffrey Bawa (Lunuganga, Kandalama), biệt thự nhiệt đới Bali – Việt Nam (Võ Trọng Nghĩa «Stacking Green») | chân tường đá, sàn và mái vươn sâu có trần gỗ, lam gỗ đứng / ngang, ban công sâu lan can gỗ, cột gỗ mảnh, bale gỗ bên hồ |

## 2. Quy tắc có số đo

### Chung

**Tầng và cửa**
- Tầng = `b.h / floors` = 4,2 m: kính 3,75 m + sàn 0,45 m. Đố ngang ở 3,0 m (đỉnh cửa).
- Cửa đi giữa mặt +z: thông thủy 2,8 × 3,0 m, không có cánh chắn.
  - Hai cánh mở vuông góc vào trong (`doorLeaves`): kinh dùng kính khung thép, hai họ kia dùng gỗ.
  - Có cửa sau nếu `b.back`.

**Nền**
- Bục (w + 2,4) × (d + 2,4), cao `b.plinth`.
- Gờ hắt bóng chân 0,25 m khi nền ≥ 0,8 m.
- Bậc giữa rộng min(6, 0,3 w), bậc cao 0,165 m, mặt bậc 0,32 m (`ad-kit steps`).
- Mặt sàn trong nhà trống.

**Vách**
- Tường dày 0,3 m (kính); 0,4–0,45 m (Ando / Savoye, kính lùi 0,2 m cho ô cửa sâu).
- Khung `fillOpening` 6 cm. Gân đố kinh nhô 0,09 m (0,14 m ở tháp).

**Lan can**
- Kính 1,05 m: tấm 24 mm, opacity 0,32, tay vịn và chân kẹp thép.
- Gỗ 1,0 m: trụ bước 1,6 m, 2 thanh ngang.

**Rèm vải**
- Lùi 0,42–0,5 m sau kính, kéo dở theo mẫu cố định.
- Chừa |u − giữa| < 2 m để không chắn cửa.

### kinh
- Đố đứng bước 1,6 m. Tầng trệt hai hồi travertine, có khe kính 1,1 m.
- Vách travertine trượt ra ngoài mặt tiền 1,6 m.
- Sàn tầng 2 công-xôn 2,2 m ra trước, 0,6 m ba phía còn lại.
- Tầng 3 lùi: rộng 0,64 W, sâu d − 3,2.
- Mái tấm 0,45 m vươn 1,5 m, gờ thép đen 0,1 m.
- Nhà phụ: hộp trắng vươn 1,6 m ra trước và 2,6 m sang phải; cửa băng cao 1,8 m, bệ 0,85 m.

### toigian
- Trệt: vách kính lớn đố 2,2 m trong khung bê tông, chừa min(1,8, 0,12 W) mỗi đầu. Khe cửa đứng 0,75 m.
- Tầng 2 công-xôn 1,8 m (biệt thự 1,5 m). Cột pilotis Ø 0,34 m ở x = ±0,3 W.
- Cửa băng cao 1,4 m, bệ 0,95 m.
- Tầng 3: khối 0,42 W × 0,66 d ở góc sau-phải.
- Tường sân thượng 1,1 m. Vách gió cong r ≤ 3,2 m, cao 2,6 m.
- Cửa sổ khung hộp nhô 0,5–0,6 m, dày 0,22–0,25 m.

### nhietdoi
- Trệt: hồi đá, mặt tiền kính khung gỗ đố 1,4 m.
- Sàn tầng 2 vươn 2,0 m ra trước (biệt thự 1,7 m), 0,9 m ba phía, trần gỗ dưới.
- Lam gỗ đứng: thanh 0,05 × 0,16 m, bước 0,22–0,26 m, cách mặt 0,3–0,4 m. Chừa ô giữa min(4,4, 0,22 W).
- Tầng 3: khối ốp gỗ lùi (W − 0,28 W) × (d − 2,8).
- Mái bằng vươn 2,4 m (nhà phụ 2,0, biệt thự 1 là 2,3), dày 0,4–0,45 m.
  - Trần gỗ, viền thép tối, mặt mái ván.
  - Cột gỗ 0,22 m đỡ mép sân thượng.

### Biệt thự 12 × 9, 3 tầng — 3 biến thể (`opt.variant`)

| Biến thể | toigian | nhietdoi |
|---|---|---|
| 0 | Savoye: trệt bê tông, hộp trắng công-xôn 1,5 m + pilotis, khối tầng 3 + vách gió cong. Vách `#f6f5f1` | ban công sâu + lam đứng, tầng 3 gỗ lùi, mái bằng vươn 2,4 m |
| 1 | «Hộp Ando»: trệt vữa trắng kính suốt; tầng 2–3 một khối bê tông trần vươn 2,0 m sang phải và 1,2 m ra trước, cửa sổ khung hộp, lô-gia khoét sâu 1,6 m. Vách `#efe8dc` | «Ba lớp mái» Bawa: ban công bọc góc phải, lam ngang, sàn tầng 3 vươn 1,6 m quanh, khối gỗ, mái vươn 2,3 m. Vách cát `#e2d0b0`, đá sẫm |
| 2 | «Hộp xếp lệch»: tầng 2 lệch trái-trước (−1,2 / +1,6), tầng 3 lệch phải-sau (+1,0 / −0,6), sân thượng lan can kính, khung thép tối. Vách xám trắng | màn lam đứng cao 2 tầng ở mép ban công, mái một dốc nâng 1,5 m về trước, cửa sổ mái. Vách `#efe9de`, đá sáng |

Cổng biệt thự cũng có 3 biến thể. Lối qua 3,2 m.

| Biến thể | Dạng |
|---|---|
| 0 | Hai trụ 0,55 m + tấm mái mỏng |
| 1 | Tường danh bạ 2,0 × 2,5 m (biển số, đèn) + cột mảnh đỡ tấm mái công-xôn |
| 2 | Khung cổng (trụ + dầm 0,4 m) có giàn lam trên |

Cả ba đều có cánh trượt lam đỗ sau trụ và ray âm sàn.

### Tháp ~10 × 10 × 36 m (khối đặc va chạm 0,84 w = 8,4 m)

- **kinh**:
  - Sảnh 5,4 m, rồi 6 tầng 4,5 m. Tấm sàn 9,2 m. Ban công vươn 0,75 m, xoay vòng.
  - Vương miện lùi 0,9 m, đố 0,6 m, gân 0,3 m.
  - Mái 10 × 10 ở 36 m, cột ăng-ten 3,2 m.
- **toigian**:
  - 5 khối: 8,4 / 7,8 / 8,0 / 7,6 / 7,2 m, cao 7,0 / 6,4 / 6,4 / 6,4 / 6,0 m.
  - Lệch tâm ≤ 0,6 m. Khe kính lùi 0,55 m giữa các khối.
  - Khối đáy bê tông trần. Đỉnh 35,5 m.
- **nhietdoi**:
  - Chân đá 2 tầng (8,4 m), rồi 5 tầng 4,6 m bọc lam gỗ bước 0,25 m. Tấm sàn vươn 0,6 m.
  - Đỉnh: sân thượng có 4 cột gỗ, mái 11,2 × 11,2 m ở 36,1 m.

### Đình 7 × 7, nền 0,5 m
- **kinh** (Barcelona):
  - Tấm mái 6,2 × 7,6 m dày 0,25 m, cao 3,7 m, trên 4 cột chữ thập 0,26 m.
  - Vách onyx 3,2 × 3,4 m, vách travertine 4,6 m.
  - Bể 2,3 × 5,8 m, băng ghế.
- **toigian** (Ando):
  - Tường chữ L 0,35 m có khe chữ thập (2,2 × 0,22 / 0,22 × 2,9 m).
  - Mái bê tông hai tấm, khe trời 0,3 m.
  - Cột thép Ø 0,16 m, ghế bê tông mặt gỗ, bể.
- **nhietdoi** (bale):
  - 4 cột gỗ 0,28 m trên đế đá.
  - Mái 8,8 × 8,8 m, trần lam 0,3 m.
  - Vách lam sau cao 2,4 m, giường nghỉ.

### Cổng phủ (khe 8 m, rộng ~21 m)
- **kinh**: nhà gác kính 4,6 × 4,4 m. Tấm mái công-xôn 16,6 × 7,4 m ở 3,55 m. Vách travertine 5,6 m. Cánh trượt lam thép 2 lớp đỗ sau vách.
- **toigian**: khối bê tông 5,2 × 3,6 m có khe ngang. Tường thấp 2,6 m. Tấm mái trắng ở 3,95 m.
- **nhietdoi**: tường đá ốp. 4 cột gỗ, mái gỗ vươn ở 3,85 m có trần lam. Cánh trượt lam gỗ.

### Vật liệu

Tối đa 14 khoá mỗi công trình (đếm bằng `scripts/tmp/keys.mjs`). `consolidate` gộp theo ảnh texture.

| Vật liệu | Nguồn | Mật độ |
|---|---|---|
| `render` — vữa trắng | canvas 512 px / 2 m | 256 px/m |
| `conc` — bê tông Ando | canvas 1024 × 512 / tấm 1,8 × 0,9 m | 569 px/m |
| plaster | `mats.js tiled` | 256 px/m |
| stone | `mats.js tiled` | 427 px/m |
| plank, marble | `mats.js tiled` | 512 px/m |

**Kính**
- Canvas dải trời → đất theo từng ô kính, có mây và bóng cây.
- Phát sáng nhẹ 0,2, opacity 0,6 (thấy rèm và người bên trong).

Bậc vừa (> 75 m) bỏ các khoá `railBar | railWood | lattice | fin | curtain | glassRail` (`midDrop`).

## 3. Kết quả kiểm

`STYLE=kinh,toigian,nhietdoi node --max-old-space-size=3000 scripts/bietphu-check.mjs` (dòng lỗi `est-jp-bali.js` là của họ khác, không thuộc file này):

```
== kinh
  phủ    main  32×14 ĐẠT  tris   5544/  3144 sàn 100% đỉnh 13.9 (1.01×)
  phủ    guest 15×8 ĐẠT  tris   2304/  1860 sàn 100% đỉnh 9.6 (1.04×)
  tháp ĐẠT tris 7880 cao 39.2 (lô 36) rộng 10.7×11.6 (lô 10×10)
  đình ĐẠT tris 348 cao 4.2 rộng 7.4×8.3
  cổng phủ  ĐẠT tris 1500 cao 3.6 rộng 21.4
== toigian
  phủ    main  30×14 ĐẠT  tris   3264/  3204 sàn 100% đỉnh 14.4 (1.04×)
  phủ    guest 15×8 ĐẠT  tris   1524/  1488 sàn 100% đỉnh 9.8 (1.07×)
  tháp ĐẠT tris 4512 cao 35.5 (lô 36) rộng 9.7×10.2
  đình ĐẠT tris 256 cao 4.2 rộng 7.0×8.0
  cổng phủ  ĐẠT tris 660 cao 4.0 rộng 21.2
  villa0 main  12×9 ĐẠT  tris   2400/  2364 sàn 100% đỉnh 13.7 (1.04×)
  villa1 main  12×9 ĐẠT  tris   2232/  2172 sàn 100% đỉnh 13.5 (1.03×)
  villa2 main  12×9 ĐẠT  tris   2220/  2028 sàn 100% đỉnh 13.7 (1.04×)
  cổng villa ĐẠT tris 384 cao 3.1 rộng 7.9
== nhietdoi
  phủ    main  32×15 ĐẠT  tris   7080/  3756 sàn 100% đỉnh 13.9 (1.01×)
  phủ    guest 17×8 ĐẠT  tris   3384/  1992 sàn 100% đỉnh 9.3 (1.01×)
  tháp ĐẠT tris 12324 cao 36.1 (lô 36) rộng 11.3×11.9
  đình ĐẠT tris 960 cao 4.4 rộng 8.9×8.9
  cổng phủ  ĐẠT tris 912 cao 3.9 rộng 21.0
  villa0 main  12×9 ĐẠT  tris   4236/  2484 sàn 100% đỉnh 13.3 (1.01×)
  villa1 main  12×9 ĐẠT  tris   2844/  2160 sàn 100% đỉnh 13.3 (1.01×)
  villa2 main  12×9 ĐẠT  tris   3792/  2712 sàn 100% đỉnh 15.0 (1.14×)
  cổng villa ĐẠT tris 408 cao 3.3 rộng 8.0
Tổng 23 phần, lỗi 0
```

Kiểm thêm cổng biệt thự cả 3 biến thể (`scripts/tmp/gatev.mjs`): lối qua thông ở x = −1,15 / 0 / 1,15. Số tam giác 348–456.

## 4. Ảnh đã xem

Thư mục `output/bietphu-look/`. Ảnh ghép ở `scripts/tmp/sheet1–9.png`.

| Phần | Ảnh |
|---|---|
| Nhà kinh | `kinh-phu-{main,guest}-{persp,eye,door}.png` |
| Nhà toigian | `toigian-phu-{main,guest}-{persp,eye,door}.png`, `toigian-villa{0,1,2}-main-{persp,eye,door}.png` |
| Nhà nhietdoi | `nhietdoi-phu-{main,guest}-{persp,eye,door}.png`, `nhietdoi-villa{0,1,2}-main-{persp,eye,door}.png` |
| Tháp, đình, cổng phủ | `{kinh,toigian,nhietdoi}-{tower,pav,phu-gate}-{persp,eye}.png` |
| Cổng biệt thự | `{toigian,nhietdoi}-villa{0,1,2}-gate-persp.png` (chụp bằng `scripts/tmp/mlook.mjs`, có thêm biến thể cổng) |

**Đã sửa sau khi xem:**
- Vách «trắng» trông xám → texture vữa canvas albedo cao.
- Lan can kính đặc tối → kính trong suốt riêng.
- Kính đục hoàn toàn, rèm không thấy → opacity 0,6.
- Viền thép đè mép tấm gây sọc nhấp nháy (z-fighting, ở cổng biệt thự 0 và lớp mái biệt thự nhietdoi 1) → bỏ hoặc đẩy ra ngoài.
- Thêm cánh cửa mở và rèm, để nhà kính không còn giống văn phòng.

## 5. Chưa đạt / chưa làm

**Hình ảnh**
- **Chưa có cây xanh gắn công trình** (bồn cây ban công, vườn mái, dây leo). Họ nhietdoi thiếu lớp xanh đặc trưng Võ Trọng Nghĩa / Bawa. Cây chỉ đến từ khuôn viên.
- **Kính là phản chiếu giả** (dải màu canvas, không có env map):
  - mặt nghiêng có vệt sáng chéo lặp lại;
  - hai mặt hộp kính chồng nên nhìn chéo đục hơn;
  - kính vẫn đổ bóng đầy nên trong nhà tối.
- Nhà chính kinh nhìn xa vẫn hơi giống văn phòng: nhiều tầng kính đều nhau, nội thất trống theo hợp đồng.
- Không có đèn đêm (cửa sổ phát sáng), không có hiệu ứng thời tiết.

**Số đo lệch luật**
- Đỉnh mái bằng 1,0–1,14 × (plinth + h), dưới mức 1,4–1,8 của luật. Luật đó dành cho mái dốc; mái bằng hiện đại có chủ đích.
- Tháp kinh có cột ăng-ten tới 39,2 m (mái ở 36 m).
- Ban công tháp kinh vươn 0,35 m ra ngoài lô 10 m. Tháp nhietdoi có mái 11,2 m, rộng hơn lô.

**Chưa kiểm**
- Chưa xem ảnh `door` cho tháp và cổng (script chỉ chụp `door` cho nhà).
- Chưa kiểm trong cảnh game thật: không đo `perf_probe` hay draw call trong game, chỉ trong `tools/bietphu.html`.
- Nguồn ngoài chưa mở lại để kiểm số trong phiên này. Số đo nguyên mẫu (ví dụ tấm cốp pha Ando 1,8 × 0,9 m, 6 lỗ ty) là kiến thức phổ thông, nên kiểm lại.
- Phong cách kinh không có khu biệt thự trong `estate-layout`, nên chưa có biến thể biệt thự riêng cho kinh. Bộ dựng vẫn chạy được nếu sau này có.

## 6. Mục tiêu phát triển tiếp

| Mục tiêu | Tiêu chí đo được |
|---|---|
| Lớp xanh cho nhietdoi | Bồn cây ban công + dây leo, texture lá ≥ 256 px/m, ≤ 1,5k tam giác mỗi nhà; ảnh `nhietdoi-*-persp` trước / sau |
| Kính có env map nhỏ (cubemap trời của game) | Bỏ dải giả; kính nhìn xiên không còn vệt lặp |
| Cửa sổ phát sáng ban đêm | Khoá `glow` riêng, chỉ bật theo giờ game |
| Đo trong game | `perf_probe` khu Đoài / Khảm / Chấn trước / sau; draw call mỗi khuôn viên ≤ 12 |
