# Biệt phủ — họ Mughal và Tudor

File mã: `src/game/archcity/est-mughal.js`, `src/game/archcity/est-tudor.js`. Hợp đồng: `docs/bietphu/00-HOP-DONG.md`.
Chỉ import bộ kit tiên phủ (`tienphu/arch/mg-kit.js`, `mg-build.js`, `go-kit.js`, `kit.js`), không sửa.

## 1. Nguyên mẫu và nguồn

Nguồn trong repo (đã đọc trong phiên): `docs/tienphu-nghiencuu/09-mughal.md` (bảng Koch & Barraud: tỉ lệ minaret, chhajja, chhatri,
Darwaza-i Rauza), `docs/tienphu-nghiencuu/04-gothic.md` (mái dốc thẳng, đầu hồi, răng cưa, cửa sổ song đá).
Nguồn ngoài: hiểu biết chung về các công trình dưới đây (Wikipedia / National Trust / Historic Royal Palaces). Chưa mở lại
trang trong phiên này nên không trích số đo trực tiếp; mọi số đo dưới đây là quy tắc dựng theo người 1,75 m và theo kit.

| Phần | Mughal (phủ «Cung Điện Mughal») | Tudor (phủ «Trang Viên Tudor») |
|---|---|---|
| Chính đường | Lăng Itimad-ud-Daulah (Agra): khối thấp cẩm thạch trắng, 4 tháp góc bát giác đội chhatri, khảm pietra dura. Mặt pishtaq hai phía + lưới ô vòm theo tầng của lăng Humayun / Diwan-i-Khas. Vòm bầu trên trống (Taj, thu nhỏ). | Little Moreton Hall (khung gỗ lộ đen trên vữa trắng, tầng nhô jetty, ô tứ diệp, long gallery tầng trên) + Compton Wynyates (tầng trệt gạch đỏ, cửa sổ đá song đứng – song ngang, cửa sổ lồi, ống khói xoắn) |
| Nhà khách | Cổng phụ lăng Humayun / haveli: sa thạch đỏ viền cẩm thạch trắng (Koch: chỉ nhà chủ trắng toàn phần) | Cùng ngôn ngữ, 2 tầng, khối cửa có hồi gỗ |
| Tháp | Minaret Taj (3 ban công ở 0,26 / 0,51 / 0,81 H, chhatri đỉnh) trên bệ bát giác sa thạch | Anne Boleyn's Gate / Clock Court, Hampton Court: tháp gạch, 4 tháp góc bát giác nắp chì, răng cưa, mặt đồng hồ, chòi chuông |
| Đình | Chhatri bát giác 8 trụ Shahjahani (Shalimar Bagh / Rambagh) | Nhà vườn khung gỗ (banqueting / garden house): trụ + giằng cong vòm bốn tâm, lan can tiện, đầu hồi gỗ chạm |
| Cổng | Darwaza-i Rauza thu nhỏ: pishtaq hai mặt, hành lang vòm xuyên, 4 tháp góc, hàng 3 chhatri trắng trên đỉnh | Great Gatehouse, Hampton Court: vòm Tudor xuyên, tháp góc bát giác, cửa sổ lồi đá trên vòm, khiên huy hiệu, răng cưa |

## 2. Quy tắc có số đo

### Mughal
- Tầng 4,2 m (theo b.h / floors). Tường 0,9 m. Gian mặt đứng ≈ 3,9 m.
- Tầng trệt: ô vòm nhiều múi (5 múi) rộng ≤ 2,0 m, bậu 0,5 m, đỉnh vòm cách sàn tầng trên 1,05 m, lấp jali.
  Tầng trên: cửa sổ jharokha jali rộng ≤ 1,5 m, bậu 0,95 m; tầng trên cùng vòm 3 múi.
- Pishtaq: rộng 0,3 w (7,4–14 m), lỗ iwan 0,56 khung (5,0–7,6 m), đỉnh vòm 0,78 H, nhô 0,45 m, vượt lan can 2,6 m (nhà chủ) / 1,5 m.
  Hốc iwan nửa bát giác sâu ≤ d/4 + 0,45 − 1,35 (để không lấn vách). Cửa hậu iwan 2,8 × 3,4 m mở.
- Chhajja trên consol: vươn 0,7 m (trên tầng trệt) và 0,95 m (diềm mái), consol mỗi 1,15 m.
- Tháp góc bát giác apothem 1,3 m (nhà chủ) / 0,95 m, cao tới diềm + 1,6 m, chhatri a = 1,6 m.
- Vòm bầu: trống bán kính 0,22 min(w, d) (2,6–4 m), cao 2,2 m; bầu R = 1,13 rd, H = 1,42 R; sen 14 cánh + finial có trăng.
- Nền: sa thạch đỏ, panel khảm trắng mỗi 2,6 m có vòm mù khi nền ≥ 2 m; bậc 0,16 × 0,32 m.
- Minaret: H = lô − 5,8 m, Ø = H / 7,6 (Koch: 7,6), kẹp 3,4–4,6 m; bệ bát giác 0,42 lô cao 3,2 m.
- Đình: chhatri a ≥ 3,2 m (bậc chi tiết cao: trụ đôi Shahjahani, vòm 5 múi), cao trụ = pv.h, nền bát giác 0,5 m.
- Cổng: khe vòm g.w + 0,4 (8,4 m), trụ 4,6 m mỗi bên, sâu 8 m, đỉnh khung 13,4 m, vòm xuyên đỉnh 9,6 m.
- Vật liệu: cẩm thạch = `tiled('marble')` (512 px/m), sa thạch đỏ = `tiled('stone')` nhuộm #b67e66 (427 px/m); chi tiết khảm
  (thư pháp, pietra dura, jali, cửa) giữ texture canvas của kit. Khoá chi tiết đổi tên `carve…` để bậc vừa bỏ.

### Tudor
- Tầng 4,2 m. Tầng trệt gạch đỏ dày 0,6 m, chân đá vát 0,32 m, góc đá quoins. Tầng trên khung gỗ dày 0,3 m, nhô 0,4 m mỗi tầng
  (tối đa 2 bậc) ở mặt trước và sau; dầm nhô (bressumer) 0,36 m + đầu dầm sàn mỗi 0,55 m.
- Khung gỗ: trụ 0,26 m ở mép, má cửa sổ và mỗi ~2,4 m; song đứng 0,17 m cách 0,55 m (close studding); thanh bậu và thanh đầu cửa
  liền; dải dưới bậu: ô tứ diệp (nhà chủ, tầng 2) hoặc giằng chữ V (long gallery).
- Cửa sổ đá tầng trệt 2,1 × 2,1 m (3 ô) / 1,5 m (2 ô), song ngang ở 0,62 h, gờ mũ có hai đầu thả. Cửa sổ lồi 3 mặt nhô 0,95 m, mái chì.
- Long gallery tầng trên cùng: cửa kính chì 1,7 × 2,0 m cách 2,35 m suốt chiều dài.
- Cửa đi vòm Tudor (bốn tâm dẹt, cao vòm 0,3 w): cửa chính 2,6 m, chân vòm 2,25 m (đỉnh 3,0 m); khối cửa rộng 0,14 w (3,6–4,8 m) nhô 1,1 m
  (tới mép nền), vòm 2,8 m mở.
- Mái 47°, ngói đất nung (texture goMats clay, 256 px/m) nhuộm nâu xám; đầu hồi gỗ có ván diềm 0,42 m, chóp + quả treo.
  Hồi ngang: khối cửa + 2 hồi bên rộng 0,18 w (4,2–6,4 m) nhô thêm 0,3 m; nhà chủ có thêm 2 hồi mặt sau.
- Ống khói: bầu lò gạch 1,0 × 2,6 m ở hai đầu hồi, 3 ống xoắn (8 cánh, xoắn 20°/đoạn) cao 2,3 m; thêm 2 cụm 2 ống trên nóc (w ≥ 20 m).
- Tháp đồng hồ: thân 0,68 lô (6,8 m), thân tới 24 m, tháp góc a = 0,85 m tới 27,2 m + nắp chì 2,6 m, mặt đồng hồ R = 1,75 m ở 20,6 m,
  chòi chuông bát giác 8 trụ, nắp chì 3,4 m (đỉnh 32,2 m).
- Cổng: vòm Tudor rộng g.w + 0,3 (8,3 m), chân vòm 3,7 m, khối gác 3 m mỗi bên, sâu 6 m, răng cưa ở 10,6 m, tháp góc a = 1,25 m tới 13,2 m.
- Đình: khung 5,8 × 5,8 m, trụ 0,26 m, tấm giằng vòm bốn tâm, lan can tiện 0,85 m, mái 50°.
- Vật liệu: gạch `tiled('brick')` #b4644a, vữa `tiled('plaster')` #efe7d4, gỗ `tiled('plank')` #3a2b22, đá `tiled('stone')` #cdbb93;
  kính chì goMats glass (427 px/m).

## 3. Kết quả kiểm

`STYLE=mughal,tudor node --max-old-space-size=3000 scripts/bietphu-check.mjs`:

```
== tudor
  phủ    main  35×16 ĐẠT  tris  59684/ 22732 sàn 100% đỉnh 26.8 (1.94×)
  phủ    guest 18×9 ĐẠT  tris  14568/  9856 sàn 100% đỉnh 18.0 (1.96×)
  tháp ĐẠT tris 6812 cao 32.2 (lô 36) rộng 8.9×8.9 (lô 10×10)
  đình ĐẠT tris 6956 cao 8.3 rộng 7.0×7.7
  cổng phủ  ĐẠT tris 5356 cao 17.1 rộng 17.2
== mughal
  phủ    main  44×18 ĐẠT  tris  89528/ 52788 sàn 94% đỉnh 26.7 (1.73×)
  phủ    guest 20×12 ĐẠT  tris  32546/ 20234 sàn 88% đỉnh 15.7 (1.60×)
  tháp ĐẠT tris 12036 cao 34.6 (lô 36) rộng 9.5×9.5 (lô 10×10)
  đình ĐẠT tris 5524 cao 9.5 rộng 6.9×7.8
  cổng phủ  ĐẠT tris 17524 cao 19.5 rộng 20.4
Tổng 10 phần, lỗi 0
```

Đỉnh Tudor 1,94× là đỉnh ống khói; nóc mái chính ≈ 23,6 m (1,71×). Số khoá vật liệu: 8–14 mỗi công trình (consolidate gộp còn
≈ 6–10 lệnh vẽ theo ảnh texture). Biệt thự (không có lô biệt thự nào dùng hai họ này) thử riêng: nhà Mughal 23,0k, Tudor 9,8k tam giác.

## 4. Ảnh đã xem (`output/bietphu-look/`)

- Mughal: `mughal-phu-main-{persp,eye,door}.png`, `mughal-phu-guest-{persp,door}.png`, `mughal-tower-{persp,eye}.png`,
  `mughal-pav-{persp,eye}.png`, `mughal-phu-gate-{persp,eye}.png`.
- Tudor: `tudor-phu-main-{persp,eye,door}.png`, `tudor-phu-guest-{persp,eye,door}.png`, `tudor-tower-{persp,eye}.png`,
  `tudor-pav-{persp,eye}.png`, `tudor-phu-gate-{persp,eye}.png`.

Đã sửa sau khi xem: khung panel đen quá dày đặc trên mặt cẩm thạch → đổi sang gờ nổi cùng màu; vòm mù trên bệ chỉ là nét cung
→ vẽ đủ chân vòm; khối xây sau pishtaq trơ → thêm lan can jali; thân minaret texture 160 px/m → đá khối lặp; vòm «bốn tâm» của
go-kit có chỗ lõm ở đỉnh → tự dựng vòm Tudor dẹt từ archCurve; hồi ngang nhà khách Tudor chồng lên hồi khối cửa → chọn ô không chồng;
mái ngói quá đỏ → nhuộm nâu xám; nắp tháp chì từ chóp nhọn → củ hành (ogee); góc đá khối cửa nhà khách lấn vào vòm → chỉ đặt khi đủ rộng.

## 5. Chưa đạt

- Gạch Tudor chưa có hoa văn quả trám gạch sẫm (diaper) như Hampton Court / Compton Wynyates; mái là một texture lặp, chưa có ngói
  bò nóc chạm, chưa có mái hắt cong ở chân.
- Mái chính Tudor rất lớn so với mặt đứng (một mặt dốc liền 35 m); hồi ngang nhỏ, chưa có cửa sổ mái (dormer) phụ.
- Kính chì mặt bên tháp Tudor nhìn xa thành hoa văn chéo (moiré của texture quả trám).
- Mughal: sa thạch đỏ dùng texture đá khối nhuộm nên đọc gần giống gạch to; chưa có mặt lát / hoa văn khảm hình học trên mặt mái;
  vòm hành lang cổng phẳng một màu (tileVaultR), chưa có gân vòm.
- Nhà chủ Mughal 89,5k / 52,8k tam giác (bậc vừa sát ngân sách 55k): thêm chi tiết sẽ phải đổi bậc vừa của chhatri.
- Nội thất chỉ có sàn + trần tầng trệt; cầu thang lên tầng chưa dựng (hợp đồng yêu cầu sàn trống).
- Nguồn ngoài chưa mở lại để đối chiếu số đo trong phiên này (chỉ dùng số đo của tài liệu nghiên cứu trong repo).

## 6. Goal tiếp theo

1. Diaper gạch Tudor bằng texture thứ hai (gạch sẫm hình quả trám, ≥ 256 px/m) phủ tầng trệt + ống khói; đo: ảnh eye có hoa văn rõ ở 14 m.
2. Dormer + mái hắt cho mặt mái dài Tudor; đo: không mặt mái liền > 12 m trong ảnh persp.
3. Sa thạch đỏ Mughal: texture riêng (vân đá, mạch mảnh) thay đá khối nhuộm; đo: so ảnh eye trước / sau.
