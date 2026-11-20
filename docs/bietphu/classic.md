# Họ «classic» — Palladio · Lâu Đài Pháp · Biệt Thự Pháp

Mã: `src/game/archcity/est-classic.js` (4 hàm hợp đồng) + `src/game/archcity/est-classic-kit.js` (cấu kiện phụ: mặt đứng,
ô cửa, mái co vào, lucarne, tourelle, trán tường, vật liệu). Chỉ import `tienphu/arch/fr-kit.js` (column, pilaster, entab,
band, balus, opening, refends, keystone, insetPoly, statue, potAFeu, cartouche, roundSteps, frMats) và `archcity/mats.js`
(tiled, retex, consolidate). Dựng theo tham số ở cỡ nhà ở; không phóng / thu mẫu Versailles.

## 1. Nguyên mẫu và nguồn

| Phần | Nguyên mẫu | Lấy gì |
|---|---|---|
| palladian chính đường 44 × 19 | Villa La Rotonda (Palladio, 1567–), Wanstead House / Prior Park (portico lục trụ khổng lồ), Chiswick House (vòm trên trống) | portico 6 cột Ionic khổng lồ + trán tam giác có tượng (Rotonda: «six Ionic columns», tượng thần trên trán); chân tường khía rãnh, tầng chính cửa sổ trán tam giác / cung xen kẽ + lan can giả dưới bậu, tầng trên cửa gần vuông; mái ngói ống thấp; trống tròn có cửa tròn + vòm ngói bậc chân + đèn lồng |
| palladian nhà khách 21 × 12 | Villa Emo (Palladio, 1559), Marble Hill | portico tứ trụ khổng lồ + trán có cửa tròn, đá góc so le, cửa tầng trệt có trán, mái ngói bốn dốc, 2 ống khói |
| palladian tháp «rotunda» | Mausoleum Castle Howard (Hawksmoor), Radcliffe Camera, Tempietto (Bramante) | bệ vuông khía rãnh 4 cửa vòm + lan can có bình lửa; đền tròn 12 cột Ionic quanh trống; trống attic cửa tròn; đền tròn 8 cột Corinthian; vòm có gân + đèn lồng |
| palladian đình | Temple de l'Amour (Mique; kit `frAmour`), đền Ionic vườn Chiswick | monopteros 8 cột Ionic trên 2 bậc tròn, entablature tròn có hoa chạm, vòm đá thấp 8 gân + quả thông |
| chateau chính đường 39 × 19 | Château de Chambord / Blois (lưới pilaster chồng thức + gờ tầng, cửa croisée, lucarne Phục Hưng, ống khói đá), Azay-le-Rideau (tourelle góc mái nón), Cheverny / Vaux-le-Vicomte (khối giữa nhô cao + vòm vuông «à l'impériale» + đèn lồng) | 4 tầng đá tuffeau, tầng trệt khía rãnh, pilaster Doric / Ionic / Corinthian theo tầng, khung cửa chính cặp cột Doric + ban công con tiện + bình lửa, mái Mansart đá đen có bờ gãy chì, lucarne Phục Hưng mỗi ô, 4 tourelle treo góc (công-xon cul-de-lampe), attic khối giữa + vòm vuông + đèn lồng |
| chateau nhà khách 21 × 10 | manoir vùng Loire (Azay-le-Rideau thu nhỏ) | 2 tầng, mái Mansart có lucarne, 2 tourelle treo góc trước |
| chateau tháp «donjon» | Donjon de Vincennes, Château de Langeais | tháp vuông chân xiên (talus), 4 tầng cửa croisée, gờ tầng, mâchicoulis + lan can đá, mái chóp đá đen có 4 lucarne, 4 tourelle treo góc mái nón |
| chateau đình | gloriette vườn Pháp | vuông, 4 vòm mở có đá khoá, đá góc, entablature Doric có triglyph, vòm vuông đá đen + đèn lồng |
| cổng phủ | cổng sắt rèn Vaux-le-Vicomte / Versailles (grille d'honneur) | 2 trụ đá khía rãnh 1,3 m có bình (palladian) / bình lửa (chateau), cánh sắt đầu giáo mở vào trong, vòm sắt có huy hiệu vàng; palladian: tường thấp + rào sắt + trụ nhỏ; chateau: 2 nhà gác cổng mái vòm vuông |
| phap biệt thự 12 × 9 (3 biến thể) | hôtel particulier Paris (Haussmann), biệt thự Pháp Hà Nội 1920–30, biệt thự Đà Lạt | v0: vách kem, mansard đá đen, lucarne mắt bò + vòm, ban công sắt chạy suốt tầng 3, ống khói gạch đỏ · v1: vách vàng Đông Dương, 5 ô, mái ngói hông + trán có cửa tròn, ban công đá giữa · v2: vách trắng, tầng trệt đá khía rãnh, mái «pavillon» dốc 51° có diềm sắt nóc, lucarne trán tam giác, cửa chớp xanh xám |
| cổng biệt thự | cổng trụ biệt thự Hà Nội / Đà Lạt | v0 trụ quả cầu + vòm sắt · v1 trụ mũ ngói + vòm sắt thấp · v2 trụ đá bình + thanh sắt đầu nhọn |

Nguồn:
- Kit: `docs/tienphu-nghiencuu/06-tancodien.md` (Phần chung §1 thức Vignola: Ionic 9 D, entablature ¼; §2 ngữ pháp mặt đứng; §3 bảng màu; §4 sai lầm phải tránh).
- https://en.wikipedia.org/wiki/Villa_La_Rotonda (6 cột Ionic mỗi portico, tượng thần trên trán, vòm thấp Scamozzi có cupola).
- https://en.wikipedia.org/wiki/Villa_Emo · https://en.wikipedia.org/wiki/Chiswick_House · https://en.wikipedia.org/wiki/Wanstead_House
- https://en.wikipedia.org/wiki/Château_d%27Azay-le-Rideau (1518–27, tháp góc nón nhọn, mái đá đen dốc, lucarne chồng, mâchicoulis tượng trưng).
- https://en.wikipedia.org/wiki/Château_de_Cheverny (1624–30, Jacques Bougier; tháp giữa + hai cánh).
- https://en.wikipedia.org/wiki/Château_de_Chambord · https://en.wikipedia.org/wiki/Vaux-le-Vicomte · https://en.wikipedia.org/wiki/Hôtel_particulier

## 2. Quy tắc có số đo

**Khuôn chung**: vách trên chu vi w × d (dày 0,45, biệt thự 0,40); nền (w + 2,4) × (d + 2,4) cao b.plinth, gờ đầu nền 0,16,
chân 0,24; bậc ≤ 0,165 × 0,34 m có má xiên; sàn đá trong nhà ở b.plinth; trần tối mỗi tầng ở y0 + h − 0,3 (trên đầu người).
Cửa chính 2,6 m rộng (khe va chạm 2,4), cao 3,35–3,7, hai cánh gỗ mở vào áp má cửa, ô kính vòm / ô thoáng trên 3,0 m.
Tầng = b.h / floors = 4,2 m.

| Mục | palladian | chateau | phap |
|---|---|---|---|
| Thức | Ionic khổng lồ: cột H = b.h − entablature, D = H/9 (phủ 1,19 m, khách 0,78 m); nhịp giữa 4 D, nhịp thường 3,25 D (eustyle) | pilaster 0,42 m chồng thức Doric / Ionic / Ionic / Corinthian; khung cửa cặp cột Doric D 0,46 | không thức; entablature Ionic 0,95 m có công-xon |
| Entablature đỉnh | 1,9 m (phủ) / 1,43 m (khách), có công-xon | 1,25 / 0,95 m | 0,95 m |
| Ô cửa (bề rộng × cao) | trệt 1,2 × 1,9 đá khoá; tầng chính 1,3 × 2,6 trán tam giác / cung xen kẽ + lan can giả 0,8 m; tầng trên 1,2 × 1,35 | croisée 1,45 × 2,6–2,75 (đố đá 0,14), tầng trên 2,0 | 1,1–1,35 × 2,3–2,9 cửa chớp lá sách; tầng chính cửa sát sàn |
| Nhịp ô | portico: giữa các cột; ngoài ≈ 3,6 m | khối giữa 4,2 m, cánh ≈ 3,65 m; chừa góc 2,3 m cho tourelle | v0 3,33 m (3 ô) · v1 2,08 m (5 ô) · v2 3 ô (giữa rộng) |
| Mái | ngói ống 4 dốc 0,45 (24°), vươn 0,9 m; trán dốc ≤ 0,4 | Mansart: dốc dưới 4,2 m / co 1,4 m (≈ 72°), dốc trên 0,30; khách 3,6 / 1,2 / 0,42 | v0 Mansart 3,8 / 1,0 / 0,34 · v1 hông 0,70 · v2 «pavillon» 1,25 (51°) + diềm sắt |
| Điểm nhấn | trống r 3,6 nhô 1,3 m trên nóc, vòm r 3,75 cao 2,4, đèn lồng 6 trụ | tourelle r 2,0 (khách 1,5) treo từ tầng 2, nón 2,7 r; attic khối giữa 2,5 m + vòm vuông 13,5 × 20,8 × 7,4 m | ban công sắt (song 0,12 m, vòng 0,48 m), ban công đá con tiện |
| Vật liệu (texture lặp, px/m) | vữa ngà plaster 256, chân / đá góc vữa sẫm, cột vữa trắng, ngói ống tile 512 | đá tuffeau stone 427, gờ / pilaster vữa trắng 256, đá đen ardoise brick 533 | vữa kem / vàng / trắng 256, đá stone 427 (v2), cửa chớp plank 512, ống khói brick 533 |

Màu (nhuộm texture): palladian vách `#efe4c8`, chân `#d9caa8`, ngói `#ad5d3c`; chateau đá `#f1ecdf`, đá đen `#39424d`;
phap v0 `#ead39f` / v1 `#e6b965` / v2 `#ebe8de`, cửa chớp `#3f6a4e` / `#2f5c43` / `#58717f`.

Khoá vật liệu: nền `plinth · step · floor`; thân `wall · rust · ash · trim · cap · col · tileRoof · tileRidge · slate · lead ·
chim · wood · shutter`; bậc vừa bỏ (`midDrop`) `carve · statue · louver · railBar · groove · potAFeu`. Sau `consolidate`
còn 4–10 lưới mỗi công trình (đo: palladian chính 9, chateau chính 10, biệt thự 8, cổng 5–8).

## 3. Kết quả kiểm

`STYLE=palladian,chateau,phap node --max-old-space-size=3000 scripts/bietphu-check.mjs`

```
== palladian
  phủ    main  44×19 ĐẠT  tris  27714/ 25742 sàn 100% đỉnh 25.5 (1.85×)
  phủ    guest 21×12 ĐẠT  tris  11730/ 10366 sàn 100% đỉnh 13.2 (1.43×)
  tháp ĐẠT tris 27884 cao 30.9 (lô 36) rộng 10.2×10.2 (lô 10×10)
  đình ĐẠT tris 6240 cao 7.3 rộng 8.1×8.1
  cổng phủ  ĐẠT tris 4092 cao 7.0 rộng 19.9
== chateau
  phủ    main  39×19 ĐẠT  tris  53458/ 47682 sàn 100% đỉnh 32.7 (1.82×)
  phủ    guest 21×10 ĐẠT  tris  19713/ 16697 sàn 100% đỉnh 16.1 (1.75×)
  tháp ĐẠT tris 11497 cao 35.2 (lô 36) rộng 10.8×10.8 (lô 10×10)
  đình ĐẠT tris 3160 cao 10.1 rộng 7.5×10.1
  cổng phủ  ĐẠT tris 6324 cao 7.4 rộng 18.1
== phap
  villa0 main  12×9 ĐẠT  tris  18916/ 12004 sàn 100% đỉnh 20.3 (1.52×)
  villa1 main  12×9 ĐẠT  tris  15814/ 12978 sàn 100% đỉnh 17.2 (1.28×)
  villa2 main  12×9 ĐẠT  tris  15437/ 13293 sàn 100% đỉnh 20.2 (1.51×)
  cổng villa0 ĐẠT tris 1896 cao 3.4 rộng 4.7
  cổng villa1 ĐẠT tris 1752 cao 3.1 rộng 4.8
  cổng villa2 ĐẠT tris 1388 cao 3.3 rộng 4.7
Tổng 16 phần, lỗi 0
```

## 4. Ảnh đã xem (`output/bietphu-look/`)

- palladian: `palladian-phu-main-{persp,eye,door}.png`, `palladian-phu-guest-{persp,eye}.png`, `palladian-tower-{persp,eye}.png`,
  `palladian-pav-persp.png`, `palladian-phu-gate-persp.png`.
- chateau: `chateau-phu-main-{persp,eye,door}.png`, `chateau-phu-guest-{persp,door}.png`, `chateau-tower-{persp,eye}.png`,
  `chateau-pav-persp.png`, `chateau-phu-gate-{persp,eye}.png`.
- phap: `phap-villa{0,1,2}-main-{persp,eye,door}.png`, `phap-villa{0,1,2}-gate-persp.png`.

Đã sửa sau khi xem: gờ đỉnh thò khối ở góc nhà (đổi sang khối góc chỉ phần gờ); cột / chân tường palladian dùng vữa thay đá
hoa (vân đá hoa ra «đường đồng mức»); vòm khối giữa chateau chìm trong mái Mansart → tách mái hai cánh + attic khối giữa +
vòm vuông cao hơn; lá sách cửa chớp từ hộp sang tấm (biệt thự v1 vượt ngân sách 25,9k → 15,8k); tháp donjon thu tourelle
vào (rộng 11,4 → 10,8); vòm sắt cổng biệt thự thu nhỏ huy hiệu.

## 5. Chưa đạt

- Mặt chính đường chateau 4 tầng giống nhau vẫn hơi «khối căn hộ» khi nhìn xa — lưới pilaster đều; chưa có khối góc nhô
  (avant-corps) hay mái riêng cho hai đầu như Cheverny.
- Vòm vuông khối giữa chateau thấp và tròn trịa hơn nguyên mẫu (giữ đỉnh ≤ 1,82 × cao hiên); chưa có diềm chì / lucarne
  chạm như Cheverny.
- Tượng trên trán palladian là dáng giản lược của kit (`statue`), nhỏ khi nhìn gần; chưa có phù điêu trong tam giác trán.
- Biệt thự v1 đỉnh 1,28 × (dưới mức «thường» 1,4) — mái ngói Hà Nội để dốc 35°, không đẩy cao hơn cho khớp con số.
- Tháp donjon / tourelle rộng 10,8 m (lô 10 m) do tourelle treo góc vươn ngoài khối đặc va chạm 8,4 m (phía trên đầu người).
  Tháp palladian cao 30,9 m (lô 36 m) — thấp hơn mốc chiều cao lô.
- Đình gloriette có bậc trước / sau nhô ngoài nền va chạm 8,2 m (khung bao 7,5 × 10,1).
- Portico palladian: sàn portico nhô 0,8 m ra ngoài nền va chạm (cột đứng cách tường 1,0 m) — người chơi đứng ở mép đó sẽ ở cao độ đất.
- Cửa chính chateau có nan quạt ô kính vòm hơi thô; khung cửa gỗ chỉ là tấm hộp, chưa có pano chạm.
- Chưa xem ảnh `front` / `top`; chưa đo hiệu năng trong game thật (chỉ đếm tam giác và số lưới).

## 6. Goal tiếp theo

1. Chateau: thêm hai khối đầu nhô 0,3 m (trong dung sai vách) với mái chóp vuông riêng → tiêu chí: ảnh persp đọc được 3 khối
   (giữa + 2 đầu) như Cheverny, tam giác ≤ 60k.
2. Palladian: phù điêu tam giác trán (cartouche + vòng lá) và tượng to hơn (2,4 m) → nhìn eye không còn «que».
3. Đo draw call / tam giác trong game thật ở khu Càn (palladian + chateau cạnh nhau) bằng `perf_probe.js`.
