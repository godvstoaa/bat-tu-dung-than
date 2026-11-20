# Biệt phủ — họ «asia»: Phủ Đệ Huế (hue), Nhà Vườn Huế (nhavuon), Cung Điện Thái Lan (thai)

Mã: `src/game/archcity/est-asia.js` (điều phối) · `est-asia-hue.js` (hue + nhavuon) · `est-asia-thai.js` (thai).
Chỉ import bộ dựng tiên phủ: `tienphu/arch/vn-build.js`, `vn-kit.js`, `kit.js` (Huế); `th-kit.js`, `th-build.js` (Thái).
Vật liệu lặp theo mét `archcity/mats.js` (`tiled` + `retex` + `consolidate`), cộng texture canvas riêng (cửa, vách, ngói Thái).

## 1. Nguyên mẫu và nguồn

| Phần | Nguyên mẫu thật | Nguồn |
|---|---|---|
| hue · chính đường | Từ đường Tuy Lý Vương (Vỹ Dạ, Huế): nhà rường 3 gian 2 chái kiểu **nhà kép «trùng thiềm điệp ốc»**, hai bộ mái nối trần thừa lưu, nóc sau cao hơn nóc trước, mặt trước 3 bộ cửa bàn khoa, sau và hai bên tường gạch | [Tạp chí KH ĐH Cần Thơ — cảnh quan phủ Tuy Lý Vương](https://ctujsvn.ctu.edu.vn/index.php/ctujsvn/article/download/3755/64/64), [thanhdiavietnamhoc.com](https://thanhdiavietnamhoc.com/nghe-thuat-kien-tao-canh-quan-phu-tuy-ly-vuong-thua-thien-hue-viet-nam/), [vanhoahoc.edu.vn](https://vanhoahoc.edu.vn/nghien-cuu/van-hoa-hoc-ung-dung/van-hoa-giao-tiep/3783-nguyen-van-cuong-di-san-van-hoa-han-nom-tai-phu-tuy-ly-vuong-phuong-vy-da-thanh-pho-hue.html); `docs/tienphu-nghiencuu/07-hue.md` C1.1–C1.6, C2, C3 |
| hue · Đông / Tây Sương | nhà rường 3 gian 2 chái chồng diêm (mái hạ + cổ diêm «nhất thi nhất họa» + mái thượng) | 07-hue C1.4, C1.5 |
| hue · tháp (sig `bell`) | gác chuông 2 tầng trên đài gạch theo lầu Ngũ Phụng Đông (Ngọ Môn): tầng dưới thoáng treo chuông, tầng trên thượng song hạ bản, cửa sổ tròn / khánh | 07-hue ngomonE |
| hue · đình | thủy đình 16 cột «một gian bốn chái», 2 tầng mái (Trường Du Tạ 1849) — vuông, KHÔNG bát giác | 07-hue kimthuyW, C1.5 |
| hue · cổng phủ | cổng tam quan gạch của phủ Tuy Lý Vương (cao 7 m, rộng 8,3 m, trán đắp mặt trời + rồng khảm sành sứ; chỉ tước Vương được làm tam quan) | như dòng chính đường |
| nhavuon · nhà | nhà vườn An Hiên (1883): nhà rường 3 gian 2 chái, 48 cột, ngói liệt, bờ nóc rồng chầu, giữa nóc hoa sen | [VnExpress](https://vnexpress.net/nha-vuon-an-hien-tai-co-do-hue-don-du-khach-tham-quan-tro-lai-3926812.html), [kientrucvietnam.org.vn](https://kientrucvietnam.org.vn/an-hien-ngoi-nha-vuon-dep-va-doc-nhat-co-do-hue/) |
| thai · nhà | Phra Thinang điện ở 2 tầng tường trắng; vào qua **mukh** (hồi nhô) giữa mặt tiền như Dusit / Chakri (A7.1: vào ở đầu hồi); chính điện có 3 mukh theo nhịp 3 lầu của Chakri Maha Prasat | `docs/tienphu-nghiencuu/08-thai.md` A1–A7, main, monthien |
| thai · tháp (sig `stupa`) | Phra Si Rattana Chedi (Wat Phra Kaew, 1855): chedi chuông tròn kiểu Tích Lan, phủ gạch khảm vàng, ~40 m; chedi = chuông + 20 đĩa vòng + mũi | 08-thai A7.5; [World History Encyclopedia](https://www.worldhistory.org/article/1555/the-temple-of-the-emerald-buddha/) (công trình cao nhất khuôn viên); số 40 m chỉ có từ [TripAdvisor](https://www.tripadvisor.com/Attraction_Review-g293916-d548184-Reviews-Phra_Si_Ratana_Chedi-Bangkok.html) (không chính thức) |
| thai · đình | sala mở Sitalaphirom / sala rai (th-spec sala1) | 08-thai sala1, sala4 |
| thai · cổng | cổng tường trắng có cánh gỗ đỏ lớn (Grand Palace «gigantic red doors»), mái hồi đủ lamyong | 08-thai A5 |

Lệch có chủ ý: Huế nhà ở dùng gỗ nâu, ngói đất nung theo `S.roofCol` (07-hue C2: «mái nhà thường: ngói liệt, ngói âm dương
không men»), KHÔNG sơn son thếp vàng, KHÔNG hoàng lưu ly. Chính đường phủ thêm chồng diêm (nguyên mẫu Tuy Lý chỉ một tầng
mái) vì lô đòi hai tầng hiên b.h = 11.

## 2. Quy tắc có số đo

**Chung (khuôn lô 00-HOP-DONG §3):** nền (w + 2,4) × (d + 2,4) cao b.plinth; bậc giữa rộng min(6, 0,3 w), thêm bậc sau nếu back.

**Huế**
- Gian lẻ, gian giữa rộng nhất, kề giữa 95 %, giảm 5 % mỗi bậc, chái 66 % gian giữa (07 C1.1). Chính đường 9 nhịp
  (7 gian 2 chái, gian giữa 5,35 m), nhà phụ / biệt thự 5 nhịp (3 gian 2 chái).
- Hiên 1,4 m (cửa bàn khoa ở hàng cột trong, cách chu vi 1,4 m — trong dung sai 1,6). Chính đường sâu: hiên 1,4 ·
  nhà trước 3,65 + 3,19 · nhà sau 3,80 + 4,56 · hiên 1,4 → nhà sau sâu hơn → nóc sau cao hơn.
- Cột quân: chính đường 5,0 m Ø 0,46; nhà phụ 3,7 m Ø 0,38; biệt thự 3,1–3,5 m Ø 0,30; chân tảng đá Thanh 2 cấp.
- Cửa đi: bàn khoa cao 3,0–3,4 m (lá cửa ~2,4–2,7 m + liên ba 0,45–0,55 m), cánh ~0,95 m; gian giữa mở ≥ 2,4 m.
- Mái: mái hạ vươn 1,4–1,8 m dốc 0,50–0,56; cổ diêm 1,9 m (chính) / 1,1 m (phụ) / 0,85 m (biệt thự 1); mái thượng dốc
  0,8–0,9 (39–42°); biệt thự một mái dốc 0,98 (44°) có lá mái thoải 0,6; ngói ống cách 0,6 m; đầu đao rồng sành sứ 0,5–0,85.
- Vật liệu: ngói `tile` nhuộm roofCol × 1,35; gỗ cột / xà `plank` nâu (#6a4024 / #553219); tường hồi `plaster` vàng ngà;
  nền đá Thanh `stone` #7e8488, sân / sàn gạch Bát Tràng `stone` #b06a48; cửa / vách / liên ba / cổ diêm: canvas 256–1024 px
  (cửa 256 × 640 cho lá 0,95 × 2,5 m ≈ 270 px/m; cổ diêm 1024 px / 2,4 m ≈ 430 px/m).
- Biến thể biệt thự (`opt.variant`): 0 một mái 3 gian 2 chái ngói đỏ nâu tường ngà; 1 chồng diêm ngói rêu #6e5a4c tường
  vàng hoàng thổ #d6b87e; 2 nhà kép 5 gian đều, vách gỗ ở hai gian đầu, lan can gỗ hiên, ngói đỏ #b0583a tường trắng vôi.
  Cổng biệt thự: 0 hai trụ + mái ngói; 1 hai trụ biểu lồng đèn + xà liên ba; 2 cổng xây cuốn vòm bán nguyệt R 1,75 m + mái + mặt nhật.
- Tháp: đài gạch 9,6 × 9,6 × 3,8 m (cửa cuốn mù, nữ tường gạch hoa men 0,9 m) + gác 6,6 × 6,6 m: cột 3,2 m, tầng lầu
  2,6 m ban công 0,5 m; tổng 14,4 m.
- Đình: 16 cột lưới 5,8 m (chái 1,6 · gian 2,6), cột quân 2,8 m, nền 0,5 m, 2 tầng mái + cổ diêm 0,5 m, lan can gỗ.
- Cổng phủ: khe giữa 8,4 m cao 5,6 m; 4 trụ biểu 1,0 / 0,9 m cao 7,6 / 6,4 m; 2 cửa bên 2,6 m; trán + 2 tầng mái; tổng
  rộng 17,9 m, cao 10,7 m.

**Thái**
- Tường trắng lùi 1,1 m trong chu vi (mặt trong cách chu vi 1,55 m); hiên cột 12 góc lõm đầu sen (Ø 0,58 / 0,48) ở
  z = d/2 + 0,75 (ngoài chu vi, trên nền) — hiên sâu 1,85 m.
- 2 tầng: tầng 1 = 0,53 b.h, tầng 2 = 0,47 b.h (chính 5,83 + 5,17 m; phụ 3,92 + 3,48 m); cửa đi 2,6 × 3,2 m khung sum,
  cánh gấp sát mặt trong; cửa sổ khung sum + cửa chớp, cách ~3,3 m, cao ½ tầng; gờ tầng vàng + băng bóng.
- Mái: nóc dọc mặt tiền, 2 son + dải hiên (dốc chính 0,84 ≈ 40°, khớp ước ảnh 40–42° của Chakri), lot hạ 1,0 m ở hai đầu
  hồi; mukh giữa nửa rộng 4,2 m (chính, 2 lot) / 2,9 m (phụ), mukh bên 2,7 m; chofa 1,6–2,1 m; ngói đỏ cam
  (roofCol trộn 55 % #d2582c) viền xanh #2f7a45 (A6, A7.8); ngói canvas krabueang 256 px/m.
- Bệ chân sư tử cao b.plinth, băng Garuda 1,5 m/tượng (chính điện), bậc lan can Naga 5 đầu, lan can trắng búp sen.
- Chedi: 3 bệ 12 góc lõm 1,3 / 1,15 / 1,0 m (nửa cạnh 4,75 → 3,5 m), 4 chedi phụ góc 2,3 m, đế sen tròn, 3 vòng malai,
  chuông R 2,7 m cao 3,8 m, balang + 8 cột, 20 đĩa vòng, búp plee, mũi + giọt sương; đỉnh 35 m; khảm vàng = `brick` nhuộm vàng kim loại.
- Đình sala: 4,7 × 5,4 m cột 3,0 m nền 0,5 m, mái 2 son 1 lot mỗi đầu (p 1,1). Cổng: trụ 1,6 × 2,0 × 5,8 m, khe 8,4 m,
  tường cánh 3,2 m răng cưa, mái hồi hai mặt p 0,95; rộng 18,5 m, cao 13,7 m.

**Ngân sách / lệnh vẽ** (sau consolidate): Huế 7–11 lưới mỗi phần, Thái 3–12 (≤ 15).

## 3. Kết quả kiểm

`STYLE=hue,nhavuon,thai node --max-old-space-size=3000 scripts/bietphu-check.mjs` (2026-11-20):

```
== hue
  phủ    main  41×18 ĐẠT  tris  27864/ 16296 sàn 100% đỉnh 16.7 (1.25×)
  phủ    guest 20×11 ĐẠT  tris  12776/  8432 sàn 100% đỉnh 12.7 (1.47×)
  phủ    wing  20×11 ĐẠT  tris  12776/  8432 sàn 100% đỉnh 12.7 (1.47×)
  tháp ĐẠT tris 10068 cao 14.4 (lô 36) rộng 10.3×10.3 (lô 10×10)
  đình ĐẠT tris 6496 cao 7.7 rộng 8.8×8.9
  cổng phủ  ĐẠT tris 7956 cao 10.7 rộng 17.9
== nhavuon
  villa0 main  12×9 ĐẠT  tris   9588/  7764 sàn 100% đỉnh 10.8 (1.33×)
  villa1 main  12×9 ĐẠT  tris  10896/  7896 sàn 100% đỉnh 10.6 (1.31×)
  villa2 main  12×9 ĐẠT  tris  11184/  8400 sàn 100% đỉnh 8.2 (1.02×)
  cổng villa ĐẠT tris 1700 cao 5.0 rộng 6.0
== thai
  phủ    main  39×18 ĐẠT  tris  49296/ 35400 sàn 91% đỉnh 23.6 (1.76×)
  phủ    guest 20×10 ĐẠT  tris  21684/ 14140 sàn 94% đỉnh 15.4 (1.79×)
  tháp ĐẠT tris 7688 cao 35.0 (lô 36) rộng 9.7×9.7 (lô 10×10)
  đình ĐẠT tris 9124 cao 8.1 rộng 8.0×9.4
  cổng phủ  ĐẠT tris 3876 cao 13.7 rộng 18.5
Tổng 15 phần, lỗi 0
```

Ba biến thể cổng biệt thự (bietphu-check chỉ chạy biến thể 0 cho cổng) — `node scripts/tmp/asia_gatecheck.mjs`:
`cổng villa0 ĐẠT tris 1700 · villa1 ĐẠT tris 1108 · villa2 ĐẠT tris 2384` (lối |x| ≤ 1,1 thông ở y 1,2 từ z +6 tới −12).

## 4. Ảnh đã xem (`output/bietphu-look/`)

- `hue-phu-{main,guest,wing}-{persp,eye,door}.png`, `hue-tower-{persp,eye}.png`, `hue-pav-{persp,eye}.png`, `hue-phu-gate-{persp,eye}.png`
- `nhavuon-villa{0,1,2}-main-{persp,eye,door}.png`, `nhavuon-villa{0,1,2}-gate-{persp,eye}.png` (biến thể cổng chụp bằng `scripts/tmp/asia_look_gates.mjs`)
- `thai-phu-{main,guest}-{persp,eye,door}.png`, `thai-tower-{persp,eye}.png`, `thai-pav-{persp,eye}.png`, `thai-phu-gate-{persp,eye}.png`

Đã sửa sau khi xem: liên ba và cổ diêm canvas đầu (đọc thành chữ «ccc», ô 0,6 m quá hẹp, núi tam giác) → hồi văn + hoa
thị, ô 1,2 m, sơn thủy cong; chính đường Huế thấp bẹt → cột 5,0 m, cổ diêm 1,9 m, mái thượng dốc 0,9; chedi chuông dài
như nón → chuông rộng hơn cao + 4 chedi phụ thay tượng Garuda lẻ; ngói Thái đỏ thẫm → đỏ cam; cửa Thái bị tường tầng 2
chồng ô và cánh cửa chắn tia → tường từng tầng, cánh gấp sát tường.

## 5. Chưa đạt

- Chính đường Huế đỉnh chỉ 1,25 × (plinth + h) — thấp hơn mức 1,4–1,8 «thường»; giữ vì nhà Huế «thấp và bè» (07 C1.2), nhưng
  hiên mái thượng (~ nền + 8,5 m) vẫn thấp hơn b.h = 11.
- Tháp Huế (gác chuông) cao 14,4 m trong lô tháp 36 m — đúng đề bài «gác chuông 2 tầng» nhưng kém nổi so với tháp các họ khác.
- Biến thể biệt thự 1: chái không có cửa sổ tròn (vn-build cố định r 0,7 m, chái 1,4 m không đủ chỗ).
- Thái: đầu Naga ở bậc là hình phẳng đùn (của th-kit) — gần thì thô; khung cửa / gờ vàng là vật liệu kim loại phẳng không
  texture; tường trắng dùng texture vữa chung (hơi xám, có vết); tầng 2 không có cầu thang (sàn lầu chỉ là trần).
- Thái: phủ không có biệt thự nên không có biến thể; chính điện không có chóp prasat (đúng A3/A7.6: chóp chỉ cho điện vua),
  nên nhận diện từ xa dựa vào mái + chedi.
- Huế: đầu đao / bờ nóc dùng hình đùn phẳng của vn-kit; bờ nóc đắp vôi trơn (chưa có hoa văn đắp nổi); chuông trong gác
  khó thấy từ ngoài.
- Chưa kiểm trong game thật (chỉ trang `tools/bietphu.html`) và chưa đo FPS (`perf_probe.js`).

## 6. Goal tiếp theo

1. Chính đường Huế: thử thêm tầng lầu thật (storey 3,4 m, kiểu Phu Văn Lâu) cho bản «lầu» — tiêu chí: hiên mái thượng
   ≥ nền + 10,5 m, đỉnh ≥ 1,4 ×, tris ≤ 60k; so ảnh persp trước / sau.
2. Gác chuông Huế: nâng đài lên 6–8 m (kiểu lầu Ngũ Phụng trên đài Ngọ Môn) hoặc 3 tầng mái để đạt ≥ 20 m.
3. Thái: thay khung vàng phẳng bằng texture vàng chạm (canvas lai kranok 256 px/m), đầu Naga dựng khối tròn xoay.
