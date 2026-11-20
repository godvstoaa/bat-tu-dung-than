# Biệt phủ — họ «west»: Moorish, Tuscan, Địa Trung Hải

File: `src/game/archcity/est-west.js` (bốn phần `hall`, `tower`, `pav`, `gate`) và `src/game/archcity/est-west-kit.js` (cấu kiện chung).
Bộ dựng chỉ import từ `tienphu/arch/kit.js` (`Acc`, `rectRoof`, `roofProfile`, `lathe`, `beam`, `ribAlong`) và `tienphu/arch/mg-kit.js` (`sweepXY`).
Vật liệu lấy từ `archcity/mats.js` (`tiled`, `boxUV`, `consolidate`, `SPAN`).

## 1. Nguyên mẫu đã tham chiếu

Nguồn trong dự án:

- `docs/tienphu-nghiencuu/06-tancodien.md` §1: thức Toscan của Vignola (cột cao 7 D, đế 0,5 D, đầu cột 0,5 D).
- `docs/tienphu-nghiencuu/09-mughal.md` và `mg-kit.js`: cách dựng vòm, ô hốc và khung alfiz trên mặt đứng.

Nguồn ngoài (kiến thức tham khảo chung; trong phiên này không tải ảnh về):

| Phần | Nguyên mẫu | Học được gì | Nguồn |
|---|---|---|---|
| Moorish, nhà chính | Real Alcázar Sevilla: mặt tiền Palacio de Pedro I (1364) và các tháp góc của Alcázar | Hai tầng cửa sổ đôi ajimez trong khung alfiz; mái hắt gỗ chạm ngói men xanh (tejaroz) trên 3 gian giữa; tháp góc có răng cưa | es.wikipedia.org/wiki/Real_Alcázar_de_Sevilla |
| Moorish, hiên và qubba | Alhambra: Patio de los Leones và Generalife, Patio de la Acequia | Vòm nhiều múi trên cột Nasrid mảnh, cột đôi ở trụ; dải sebka (lưới trám) trên vòm; chân tường ốp azulejo khoảng 1,2 m; sảnh qubba có mái ngói chóp | en.wikipedia.org/wiki/Court_of_the_Lions, en.wikipedia.org/wiki/Generalife |
| Moorish, tháp | Giralda (Sevilla, 1184–1198) và Koutoubia (Marrakesh) | Thân vuông bằng gạch; mỗi mặt có cột cửa sổ ajimez ở giữa; ô sebka hai bên phần trên; sân thượng răng cưa; đèn lồng nhỏ có yamur 3 quả cầu | en.wikipedia.org/wiki/Giralda, en.wikipedia.org/wiki/Kutubiyya_Mosque |
| Moorish, cổng | Puerta de la Justicia (Alhambra, 1348) và Bab Agnaou | Vòm móng ngựa lớn trong alfiz, vòng vòm thứ hai, diềm vòm mù, ô sebka hai bên, lối đi có vòm trần | en.wikipedia.org/wiki/Gate_of_Justice_(Alhambra) |
| Moorish, đình | Đình ở hai đầu Patio de los Leones | Cột chùm ở góc, 3 vòm nhiều múi mỗi mặt (vòm giữa rộng), mái ngói chóp vươn, giữa có đài phun nước | như trên |
| Tuscan, nhà | Villa Medici ở Careggi và Fiesole (Michelozzo), Villa di Poggio a Caiano (Sangallo) | Khối hộp vữa vàng đất; khung cửa đá pietra serena; đá góc; mái chóp cụt thấp ngói coppi vươn sâu trên xà gỗ (sporto); lô gia trên cao; altana / colombaia giữa mái | en.wikipedia.org/wiki/Villa_Medici_at_Careggi, en.wikipedia.org/wiki/Villa_Medici_in_Fiesole |
| Tuscan, lô gia | Ospedale degli Innocenti, Firenze (Brunelleschi 1419) | Vòm tròn đặt thẳng lên cột Toscan đá xám; gờ vòm đá; trabeazione phía trên | en.wikipedia.org/wiki/Ospedale_degli_Innocenti |
| Tuscan, tháp | Campanile Romanesque Tuscany (pieve vùng Casentino và Chianti) | Thân vuông đá; gờ chia tầng; diềm vòm treo (archetti pensili); lỗ cửa lớn dần từ đơn tới bifora; tầng chuông mở 2 vòm mỗi mặt; mái chóp ngói thấp | it.wikipedia.org/wiki/Campanile |
| Tuscan, cổng | Porta Romana (Firenze) | Cổng vòm tròn đá có viên vòm (conci) xen dài ngắn, đá khoá, huy hiệu; mái ngói phía trên | it.wikipedia.org/wiki/Porta_Romana_(Firenze) |
| Địa Trung Hải, biệt thự | Cortijo / casa Andalucía, mas và bastide Provence, nhà Cyclades (Santorini) | Vôi trắng; cửa vòm tròn tầng trệt; cửa chớp sơn xanh; génoise (2 hàng ngói dưới diềm); ban công sắt; mái hắt tejaroz trên cửa; mirador trên mái; cổng có espadaña (tháp chuông dẹt) | es.wikipedia.org/wiki/Cortijo, fr.wikipedia.org/wiki/Génoise_(architecture) |

## 2. Quy tắc có số đo

### Chung

- Vách nằm trên chu vi w × d, dày: Moorish 0,6 m, Tuscan 0,55 m, Địa Trung Hải 0,42 m (biệt thự tối đa 0,45 m).
- Lỗ cửa khoét thật (`ExtrudeGeometry` có lỗ), nên má cửa sâu bằng bề dày vách.
- Kính lõm vào 0,55 × bề dày vách.
- Bậu cửa nhô 0,16 m. Khung đố bằng gỗ. Cửa chớp mở áp vách, có nan ngang cách 0,24 m.
- Tầng: tầng trệt tối đa 4,5 m, các tầng trên chia đều.
  - Moorish và Địa Trung Hải 3 tầng: 4,5 / 4,05 / 4,05 m.
  - Tuscan 3 tầng: 4,45 / 4,45 / 3,7 m (tầng áp mái có cửa sổ vuông 0,95 m).
- Gian mặt tiền: số lẻ.
  - Phủ: Moorish 4,1 m, Tuscan 3,85 m.
  - Biệt thự: 3 hoặc 5 gian.
- Cửa đi giữa mặt +z: rộng 2,5 m (khe 2,4 m), đỉnh 3,2 m.
  - Vòm tròn (chân vòm 1,95 m), hoặc vòm móng ngựa R = w/2 ÷ 0,94 (chân vòm 1,42 m).
  - Hai cánh mở hẳn, áp mặt trong vách, không chiếm sàn và không chắn tia.
- Hiên cuốn tầng trệt:
  - Vách trong lùi `min(rec, 1,55 − t)`, nên mặt trong vách lùi không quá 1,6 m so với chu vi.
  - Dãy vòm đứng trên nền ngoài, tâm cách chu vi 0,72–0,78 m (nền ngoài rộng 1,2 m).
  - Hiên sâu khoảng 1,7 m.
- Nền ngoài (w + 2,4) × (d + 2,4) cao b.plinth.
  - Bậc cao tối đa 0,16 m, mặt bậc 0,32 m, có má bậc.
  - Có bậc giữa trước rộng min(6, 0,3 w), thêm bậc sau nếu `back`.
- Sàn tầng trên dày 0,24 m, mặt trên ở cao độ tầng. Tầng trệt để trống.

### Moorish

- Hiên 5 gian:
  - Gian giữa: vòm móng ngựa rộng 2,9 m trong alfiz men.
  - Gian bên: mỗi gian 2 vòm 3 múi rộng khoảng 1,57 m, trên cột Nasrid đơn Ø 0,26 m; cột đôi ở trụ giữa các gian.
  - Trên vòm có lưới sebka, ô trám rộng 0,55 m.
- Dải men (azulejo): chân tường hiên cao 1,2 m; gờ tầng 0,3 m; diềm đỉnh 0,34 m.
- Cửa sổ:
  - Tầng 1: chữ nhật 1,15 × 1,75 m, song sắt (reja).
  - Tầng 2: ajimez, 2 vòm móng ngựa trên cột nhỏ, khung alfiz.
  - Tầng 3: móng ngựa 1,05 m, song gỗ celosía.
- Mái bằng, lan can 0,85 m, răng cưa bậc (0,62 × 0,75 m, mỗi 1,15 m, mũ chóp).
- Riêng phủ chính:
  - 4 tháp góc 4,6 × 4,6 m, cao hơn mái 3,6 m.
  - Qubba ở 3 gian giữa, cao 4,2 m, mái ngói men xanh dốc 0,5, vươn 0,95 m, đỉnh có yamur.
  - Tejaroz 3 gian giữa, vươn 1,5 m, công-xon gỗ cách 0,42 m.
- Lan can ban công trên hiên: con tiện gỗ (mudéjar).

### Tuscan

- Lô gia 3 vòm tròn: rộng = gian − 0,55 m, trên cột Toscan Ø 0,4 m bằng pietra serena nguyên khối, có trabeazione.
- Cửa sổ có viền đá pietra serena 0,2 m và mày cửa:
  - Tầng trệt: kiểu «inginocchiata» (công-xon dưới bậu, song sắt).
  - Tầng 2: có cửa chớp xanh rêu.
  - Áp mái: ô vuông 0,95 m.
- Chân tường đá cao 0,75 m. Gờ tầng (marcapiano) cao 0,2 m, nhô 0,1 m. Đá góc so le 0,55 / 0,9 m, mỗi hàng 0,42 m.
- Mái chóp cụt dốc 0,4 (≈ 22°), vươn 1,25 m.
  - Xà gỗ cách 0,62 m, ván diềm.
  - Ngói ống cách 0,42 m. Phào 3 nấc.
- Altana giữa mái 8,2 × 6,2 m, cao 7 m; tầng trên là lô gia 3 + 2 vòm. Hai ống khói.

### Địa Trung Hải

- 3 biến thể biệt thự (`opt.variant`):
  - **0 Andalucía:**
    - Hiên 3 vòm trụ vữa toàn mặt tiền, ban công sắt trên hiên.
    - Mái chóp cụt, chớp xanh lam.
  - **1 Provence:**
    - 5 gian, tầng trệt bỏ 2 gian cạnh cửa.
    - Mái hai mái (đầu hồi) có génoise.
    - Vách màu kem đất, chớp xanh xám, đá góc vữa.
    - Ban công sắt gian giữa, mái hắt trên cửa.
  - **2 Cycladic / Andalucía:**
    - Hành lang cuốn tầng 2 (galería: cột Toscan trắng, lan can sắt, vách lùi 1,7 m).
    - Mái hắt trên cửa, mirador 3,6 × 3,6 m ở góc sau trên mái.
    - Chớp xanh đậm, vách trắng tinh.
- Génoise: 2 hàng, mỗi hàng 0,13 m, nhô 0,22 / 0,34 m. Mái dốc 0,38–0,4, vươn 0,55 m.
- Cổng biệt thự (theo `variant`):
  - 0: vòm tròn có mũ ngói.
  - 1: hai trụ 0,84 m cao 2,9 m có mũ ngói chóp và quả cầu, vòm sắt.
  - 2: vòm + espadaña cao 1,75 m treo chuông.
  - Tường cánh hai bên có mũ ngói.

### Tháp, đình, cổng phủ

- **Minaret:**
  - Thân 7,2 m bằng gạch, cao 0,76 H.
  - Mỗi 4,4 m có xen cửa sổ móng ngựa / 3 múi.
  - Sebka ở 10,5 m trên cùng của thân.
  - Đèn lồng 3,3 m, mũ ngói men dốc 0,95, yamur.
  - Cao 35,9 m (lô 36).
- **Campanile:**
  - Thân 6,6 m bằng đá, 3 tầng thân (7,6 / 6,8 / phần còn lại).
  - Tầng chuông cao 5,6 m, 2 vòm mỗi mặt; có chuông đồng.
  - Diềm vòm treo mỗi 0,55 m. Mái dốc 0,42, có thánh giá.
  - Cao 35,3 m.
- **Đình:** 7 × 7 m, nền 0,5 m, bậc ở 4 mặt.
  - Moorish: chân vòm 2,55 m, cột chùm ở góc.
  - Tuscan: 2 vòm mỗi mặt, trụ góc đá.
- **Cổng phủ:**
  - Khe 8,4 m (lối qua |x| < 3,6 m thông suốt).
  - Thân cổng rộng 15,6 m, tường cánh mỗi bên 3,2 m.
  - Moorish: cao 11 m, sâu 6 m. Tuscan: cao 8,4 m, sâu 3,4 m.

### Vật liệu

Theo mét (≥ 200 px/m):

| Vật liệu | Texture | Mật độ | Dùng cho |
|---|---|---|---|
| Vữa | plaster | 256 px/m | Màu theo `STYLES` |
| Ngói | tile | 512 px/m | Đỏ đất; xanh men cho qubba và tejaroz |
| Đá | stone | 427 px/m | |
| Cẩm thạch | marble | 512 px/m | Cột Nasrid, bậu; pietra serena nhuộm xám |
| Gạch | brick | 533 px/m | Minaret; azulejo xanh men |
| Gỗ | plank | 512 px/m | |

- Kính để lưới riêng, mặt phẳng 2 phía.
- `consolidate` gộp theo ảnh texture, nên mỗi công trình còn ≤ 9 lệnh vẽ.
- Khoá chi tiết bậc vừa bỏ:
  - `rib*`: gân ngói.
  - `railBar`: song sắt.
  - `lattice*`: sebka, nan chớp, celosía.
  - `baluster*`: con tiện.
  - `carveA`: gờ alfiz cong.

## 3. Kết quả kiểm

`STYLE=moorish,tuscan,diatrunghai node --max-old-space-size=3000 scripts/bietphu-check.mjs`:

```
== moorish
  phủ    main  37×16 ĐẠT  tris  75934/ 37698 sàn 98% đỉnh 22.3 (1.62×)
  phủ    guest 18×10 ĐẠT  tris  30050/ 14590 sàn 100% đỉnh 10.9 (1.19×)
  tháp ĐẠT tris 16674 cao 35.9 (lô 36) rộng 9.0×10.2 (lô 10×10)
  đình ĐẠT tris 13672 cao 8.0 rộng 9.6×9.6
  cổng phủ  ĐẠT tris 6484 cao 12.7 rộng 22.5
== diatrunghai
  villa0 main  12×9 ĐẠT  tris  16263/  8499 sàn 100% đỉnh 16.5 (1.25×)
  villa1 main  12×9 ĐẠT  tris  20029/ 11983 sàn 100% đỉnh 17.0 (1.29×)
  villa2 main  12×9 ĐẠT  tris  22087/ 12967 sàn 100% đỉnh 18.0 (1.36×)
  cổng villa0 ĐẠT tris 4164 cao 5.2 rộng 8.5
  cổng villa1 ĐẠT tris 4764 cao 4.2 rộng 8.9
  cổng villa2 ĐẠT tris 4968 cao 7.3 rộng 8.5
== tuscan
  phủ    main  35×16 ĐẠT  tris  46584/ 30960 sàn 99% đỉnh 21.9 (1.59×)
  phủ    guest 18×9 ĐẠT  tris  24538/ 14890 sàn 100% đỉnh 13.1 (1.42×)
  tháp ĐẠT tris 14381 cao 35.3 (lô 36) rộng 8.6×9.2 (lô 10×10)
  đình ĐẠT tris 5968 cao 7.3 rộng 9.6×9.6
  cổng phủ  ĐẠT tris 8240 cao 9.5 rộng 22.1
Tổng 16 phần, lỗi 0
```

## 4. Ảnh đã xem

Ảnh nằm ở `output/bietphu-look/`, chụp bằng `bietphu-look.mjs` (đã xem từng ảnh và sửa theo).

**moorish**

- `moorish-phu-main-persp|eye|door`
- `moorish-phu-guest-persp|door`
- `moorish-tower-persp|eye`
- `moorish-pav-persp|eye`
- `moorish-phu-gate-persp|eye`

**tuscan**

- `tuscan-phu-main-persp|eye|door`
- `tuscan-phu-guest-persp|door` (lần trước khi đổi cột)
- `tuscan-tower-persp|eye`
- `tuscan-pav-persp|eye`
- `tuscan-phu-gate-persp|eye`

**diatrunghai**

- `diatrunghai-villa0|1|2-main-persp|door`
- `diatrunghai-villa0-main-eye`
- `diatrunghai-villa0|1|2-gate-eye`
- `diatrunghai-villa0|1|2-gate-persp`

Lỗi đã thấy trong ảnh và đã sửa:

- Gờ chân tường chạy ngang qua cửa và hiên. Giờ chừa khe.
- Đình Moorish bị vách đặc che kín, do mảng vòm không sắp xếp. Đã sửa.
- Răng cưa ban công che chân cửa sổ ajimez. Đã đổi sang lan can gỗ tiện.
- Lưới sebka đè lên cửa sổ dưới tejaroz. Giờ chỉ đặt giữa các cửa.
- Cột Toscan bị vân gạch đá. Đã đổi sang pietra serena nguyên khối.
- Mũ ngói trên tường mỏng quá thô. Bờ và diềm giờ co theo cỡ mái.
- Viên vòm cổng Tuscan mỏng như mảnh vỡ. Đã làm lại đủ bề rộng, bằng đá sáng hơn.

## 5. Chưa đạt / chưa làm

- **Nguồn:** chưa tải ảnh tham chiếu thật trong phiên này. Số đo lấy theo hiểu biết chung về nguyên mẫu và tài liệu kit, chưa đối chiếu bản vẽ đo.
- **Chi tiết Moorish:**
  - Azulejo đang là texture gạch nhuộm xanh men, chưa có hoa văn zellige.
  - Sebka là lưới thanh nổi, chưa phải vữa chạm.
  - Chưa có muqarnas ở đầu cột và vòm.
- **Mái:** ngói ống cách 0,42 m, thưa hơn coppi thật (≈ 0,25–0,3 m) để giữ ngân sách tam giác.
- **Nhà phủ Moorish 3 tầng** có tháp góc, qubba và tejaroz là bố cục ghép từ Alcázar và Alhambra, không phải một công trình có thật.
- **Không có cầu thang trong nhà:** tầng trên không lên được, đúng luật «sàn trống».
  - Cánh cửa áp mặt trong vách.
  - Kính tối phẳng, chưa có rèm.
- **Bậc vừa (> 75 m):** mới đo bằng số tam giác, chưa chụp ảnh xem.
- **Chưa có biến thể:**
  - Biệt thự Moorish và Tuscan (không có khu biệt thự hai phong cách này) chỉ có một dạng.
  - `pav` của diatrunghai (không có phủ) dùng dạng lô gia Tuscan sơn trắng.
- **Màu đá:** campanile dùng đá xám (pietra serena). Campanile nông thôn thật thường đá vàng nâu ấm hơn.
- **Tỉ lệ nóc mái:** biệt thự Địa Trung Hải và nhà khách Moorish có nóc chỉ 1,19–1,36 × (plinth + h), thấp hơn mức «thường» 1,4–1,8, vì mái thấp hoặc mái bằng đúng phong cách. Kiểm báo, không chặn.

## 6. Goal tiếp theo (tự đặt)

1. **Texture zellige / azulejo riêng** (ô men 10–15 cm, ≥ 400 px/m), thay gạch nhuộm.
   - Tiêu chí: ảnh `eye` của hiên Moorish nhìn ra ô men, không phải hàng gạch.
2. **Ngói coppi cách 0,3 m** cho phủ.
   - Tiêu chí: tam giác phủ chính vẫn ≤ 100k / 55k.
3. **Chụp và duyệt ảnh bậc vừa** (camera 120 m) cho cả 16 phần.
   - Tiêu chí: không mất silhouette răng cưa, altana và qubba khi bỏ chi tiết.
4. **Muqarnas giản lược** ở đầu cột Nasrid và vòm giữa: lathe bậc 3–4 tầng, ≤ 300 tam giác mỗi cột.
