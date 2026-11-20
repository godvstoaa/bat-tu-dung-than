# Biệt phủ và biệt thự làm lại — manifest

Đợt kế tiếp của [CONG-TRINH-LAM-LAI-MANIFEST.md](CONG-TRINH-LAM-LAI-MANIFEST.md): người dùng yêu cầu «Làm biệt phủ».

Phạm vi: 16 biệt phủ và 240 biệt thự ở vành Ngoại Thành (`mansions.js`, bố cục `estate-layout.js`, dựng 3D `mansion3d.js`). 9 tiên phủ Cửu Trọng Thiên đã làm riêng, không thuộc đợt này.

## 0. Hiện trạng đo được (trước khi làm)

Ảnh `output/bietphu/before/*.png`, 8 điểm: phủ 0 cung đình, 1 Moorish, 4 Nhật, 5 kính, 7 lâu đài, 14 Mughal, biệt thự 16 Địa Trung Hải và 106 Pháp.

| Phần | Bản cũ (`archkit-style.js`) | Lỗi theo ART_BIBLE |
|---|---|---|
| Nhà Tây / hiện đại | Hộp bốn vách; mặt tiền là texture canvas 256 px vẽ cửa sổ, lặp mỗi 3,5 m; mái là chóp 4 cạnh (`CylinderGeometry` 4 cạnh) | Primitive mặc định; cửa sổ vẽ phẳng; ~73 px/m |
| Nhà Á Đông | `archkit.hall`: hộp và mái cong một mặt; vách sọc canvas | Mờ, ít chi tiết |
| Tháp | Chồng hộp, trụ, nón (minaret là trụ trắng, nón đỏ, 2 đĩa) | Primitive |
| Cổng Tây | Hai trụ hộp và một nửa xuyến (`TorusGeometry`) | Primitive |
| Cây | `styledTree`: nón (cọ = 8 nón, bách = nón), cầu 12 mặt | Cây khối, không gió |
| Ao | 64 khối 12 mặt xám đen quanh mặt nước | Viền đen giả |
| Non bộ | 16 khối 12 mặt chồng | Primitive |
| Tường rào | Hộp một màu (`k.redWall`…), mũ là hộp | Một màu |

## 1. Nghiên cứu (nguồn đã xem)

- **Bộ kiến trúc tiên phủ** (`src/game/tienphu/arch/*`), đã có nghiên cứu nguyên mẫu đầy đủ trong `docs/tienphu-nghiencuu/`:
  - `01-trunghoa`: Cung Vương phủ, Bắc Kinh
  - `02-nhatban`: Ninomaru Goten, Nijō
  - `05-artdeco`: Villa Cavrois / Villa Noailles
  - `06-tancodien`: Versailles và các Trianon
  - `07-hue`: Hoàng thành Huế
  - `08-thai`: Đại Hoàng Cung Bangkok
  - `09-mughal`: lăng Humayun / Taj
  - `04-gothic`: lâu đài Anh thời Trung cổ muộn

  Các bộ này đều nhận tham số (gian, tầng, khối), chạy được cả trong node (đã thử: `scripts/tmp/specs.mjs` dựng 110 đặc tả). Có thể dựng lại theo đúng khuôn lô biệt phủ thay vì thu nhỏ mẫu tiên phủ 50–110 m: thu nhỏ thì cửa còn 1,3 m, sai tỉ lệ người.
- **Nguyên mẫu riêng từng phong cách** do 6 họ ghi trong `docs/bietphu/<họ>.md`. Họ Trung Hoa do tôi làm, xem §3.1.
- **Cây** (`output/cay-look/m-big.png`): 24 model CC0 `lib_tp_*` (Meshy, đã làm sạch ở đợt tiên phủ), 3 bậc chi tiết, có gió.
- **Va chạm**: `mansions.mansionSolids` (vách trên chu vi nhà, khe cửa 2,4 m, nền (w + 2,4) × (d + 2,4)) và `archkit.plinth` cũ (bậc 0,22 × 0,34 m, rộng min(6, 0,3 w)). Bản mới phải khớp va chạm này. Không sửa va chạm, vì đồ đạc, NPC và A* đều dựa vào nó.

## 2. Phương pháp

1. **Hợp đồng chung** [`docs/bietphu/00-HOP-DONG.md`](bietphu/00-HOP-DONG.md):
   - Mỗi họ phong cách là một file `src/game/archcity/est-<họ>.js` xuất `{ hall, tower, pav, gate }`.
   - Đăng ký và bộ nhớ đệm ở [`src/game/archcity/estatekit.js`](../src/game/archcity/estatekit.js).
   - Họ nào chưa có hàm thì game giữ bản cũ.
2. **Kiểm bằng số** [`scripts/bietphu-check.mjs`](../scripts/bietphu-check.mjs), chạy trong node: dựng mọi phần theo khuôn lô thật của `estates()`, rồi đo
   - số tam giác bậc gần và bậc vừa;
   - vách đúng chu vi (tia ngang từ trong ra 6 hướng);
   - cửa trước / sau thông;
   - sàn trong nhà trống (lưới 1,5 m, ≥ 85 %).
3. **Kiểm bằng mắt** [`tools/bietphu.html`](../tools/bietphu.html) và [`scripts/bietphu-look.mjs`](../scripts/bietphu-look.mjs): nắng, bóng, ACES, người 1,75 m, khung đỏ là chu vi va chạm, vạch xanh là khe cửa. Ba góc: ¾, mắt người cách 14 m, sát cửa.
4. **Song song**: 6 tác tử, mỗi tác tử một họ, làm trong file riêng. Tôi làm họ Trung Hoa, tích hợp vào game, cây, tường rào, ao, non bộ và lối lát.
5. **Tích hợp** ([`mansion3d.js`](../src/game/mansion3d.js)):
   - Mỗi phần là nền (không mờ) + thân (mờ khi vào nhà) + thân bậc vừa (bỏ đấu củng, gân ngói, con tiện…).
   - Đổi bậc theo khoảng cách người chơi: ≤ 75 m là bậc gần.
   - Hình dùng chung qua bộ nhớ đệm theo kích thước, nên không giải phóng khi dỡ khuôn viên.
   - `globalThis.__noEstateKit = true` trả lại bản cũ để đo A/B ([`scripts/bietphu-perf.mjs`](../scripts/bietphu-perf.mjs)).

## 3. Quy tắc (số đo)

### 3.1 Khuôn và tỉ lệ người

- Vách trên chu vi w × d, lệch không quá 1,6 m.
- Khe cửa 2,4 m giữa mặt +z, thông thủy ≥ 2,3 m.
- Sàn ở cao độ `b.plinth`, trống ≥ 85 %.
- Nền (w + 2,4) × (d + 2,4); bậc rộng min(6, 0,3 w).
- Tầng 3,4–4,8 m; cửa đi 2,3–3,2 m. Nóc mái bằng 1,4–1,8 lần (plinth + h).

**Họ Trung Hoa** ([`est-cn.js`](../src/game/archcity/est-cn.js), bộ dựng `cn.js`):

- Gian lẻ, gian giữa 4,6–6,2 m, các gian khác thu 6 % mỗi bậc ra hồi.
- Nhà 2 tầng là `cnLou`: tầng dưới bằng 0,44 h (≥ 3,4 m), tầng trên 0,34 h (≥ 2,9 m).
- Đấu củng chỉ ở chính đường cung đình (dk 0,075), đúng lệ nhà ở.
- Mái:
  - cung đình: ngói lưu ly xanh, 5 linh vật;
  - Giang Nam: ngói xám, nâng góc 1,0, vươn 0,3 (đầu đao Tô Châu vểnh mạnh);
  - Hanok: nâng góc 0,6, không đấu củng.
- Giang Nam và Hanok không có thải họa cung đình: xà, đấu, đầu rui đều gỗ mộc (Giang Nam #4a3324, Hanok #9a7650); vách hồi và tam giác hồi vôi trắng; cửa song nhuộm màu gỗ.

### 3.2 Độ nét

Vách, mái, nền, lối lát và tường rào dùng texture lặp theo mét của [`archcity/mats.js`](../src/game/archcity/mats.js), ≥ 250 px/m. Các họ khác dùng texture UV thế giới của chính bộ kit (≥ 200 px/m).

### 3.3 Đồ ngoài nhà ([`estate-dress.js`](../src/game/archcity/estate-dress.js))

- **Cây**: 20 loài cũ ánh xạ sang model `lib_tp_*` ở cỡ vườn nhà (khoá `e_*`).

  | Loài cũ | Model | Cao (m) |
  |---|---|---|
  | tùng | kuromatsu | 5,5–8 |
  | ngân hạnh | bachqua | 9–12 |
  | đào, mai | sakura | 3,8–5,5 |
  | liễu | lieutang | 6,5–9 |
  | quế | doan | 5–6,5 |
  | cọ | dua | 8–11 |
  | bách Ý | bachy | 7–10 |
  | ô liu | xoai | 4,5–6 |
  | phượng tím | muamy | 6–8 |
  | đại | dai | 4–5,5 |
  | đa | da | 9–12 |
  | phong | keyaki | 6–8 |
  | bạch dương | duonglhasa | 8–11 |
  | trà, bờ rào | camchau | 1,7–3,3 |

  Bờ rào cây (`fence: hedge`) và gò rào biệt thự là hàng camchau mỗi 1,6 m.
- **Tường rào** (8 kiểu):
  - Thân vật liệu lặp theo mét, chân đá 0,5 m, trụ bổ tường mỗi ~6 m.
  - Mũ tường: ngói hai mái (lăng trụ 0,42 m, UV rãnh ngói) cho tường Á Đông / gạch / stucco; gờ cẩm thạch cho tường đá; nẹp kim loại cho tường hiện đại.
  - Tường sắt: chân đá 0,7 m, song Ø 3,6 cm cách 16 cm, đầu giáo, trụ đá mỗi ~4 m.
  - Tường tre: cây tre Ø 10 cm.
  - Tất cả gộp còn ≤ 6 lưới mỗi khuôn viên.
- **Ao**:
  - Bờ đá xếp: vành elip rộng 0,7 m, cao 0,32 m, có vát.
  - Đá tảng rải không đều, khoảng 0,9 × (rx + rz) viên, bỏ ngẫu nhiên 35 %, chừa đầu cầu.
  - Đá: khối 20 mặt chia 3 lần, đẩy theo nhiễu 3 tầng, chân lún 0,12 m, texture đá chiếu ba mặt, 4 biến thể, vẽ nhân bản.
- **Non bộ** (phủ Á Đông): mỗi 14 m một cụm đá Thái Hồ cao 2–3,6 m (hõm xoáy) và 4 tảng chân.
- **Lối lát**: tấm đá 2,4 m mỗi ảnh, viền cẩm thạch 0,25 m.

### 3.4 Ngân sách hiệu năng

| Phần | Bậc gần (≤ 75 m) | Bậc vừa |
|---|---|---|
| Nhà chính phủ | ≤ 100k | ≤ 55k |
| Nhà phụ | ≤ 40k | ≤ 22k |
| Nhà biệt thự | ≤ 25k | ≤ 14k |
| Tháp | ≤ 90k | — |
| Đình | ≤ 16k | — |
| Cổng phủ | ≤ 18k | — |
| Cổng biệt thự | ≤ 9k | — |

Tối đa 3 phủ và 8 biệt thự dựng chi tiết cùng lúc (`mansion3d` NEAR / MAX, không đổi).

Đo A/B lệnh vẽ, tam giác và FPS bằng `bietphu-perf.mjs` (kết quả ở §5).

## 4. Checklist kiểm (kết quả 2026-11-20)

- [x] `node scripts/bietphu-check.mjs`: 19 phong cách, **132 phần, lỗi 0**. Gồm 3 biến thể nhà và 3 biến thể cổng cho mỗi phong cách biệt thự.
- [x] Ảnh `bietphu-look` của mọi phần đã xem.
  - Tác tử từng họ xem và sửa nhiều vòng; ghi chi tiết ở `docs/bietphu/{asia,jp,modern,classic,west,mughal-tudor}.md`.
  - Tôi duyệt lại bằng ảnh ghép `output/bietphu-look/sheet-{asia,jp,modern,mt,west,classic}.jpg`.
- [x] Ảnh trong game trước / sau cùng góc, 8 khuôn viên: `output/bietphu/so-sanh-a.jpg` và `so-sanh-b.jpg` (từ `before/` và `after/`).
- [ ] Vào trong nhà kiểm vỏ mờ và đặt đồ: chưa kiểm bằng tay. Số liệu sàn trống 88–100 % đạt.
- [x] Đo A/B cùng góc (§5).

## 5. Kết quả

Đo A/B bằng `bietphu-perf.mjs` (1280 × 720, headless, máy đang có tải nên FPS nhiễu khoảng ±10 %):

| Góc | Bản cũ | Bản mới |
|---|---|---|
| Phủ 0 cung đình | 43 fps · 706 lệnh vẽ · 2,34 tr tg | 38,5 fps · 575 lệnh vẽ · 2,59 tr tg |
| Phủ 7 lâu đài | 45,3 · 512 · 2,23 | 42,3 · 409 · 2,50 |
| Phủ 14 Mughal | 45,8 · 507 · 2,27 | 42,3 · 356 · 2,49 |
| Biệt thự 106 Pháp | 49–54 · 254–337 · 1,10–1,43 | 46,8–59,5 · 266–337 · 1,23–1,75 |
| Biệt thự 16 Địa Trung Hải | 25,8 · 1676 · 2,94 | 33 · 1678 · 3,07 |

Hai lỗi hiệu năng đo được và đã sửa:

1. **Cây vườn qua `plantBigTrees`.** Bộ này dùng ngưỡng của cây cổ thụ: bản gần khoảng 50k tam giác, trong vòng 45 m. Cả vườn vì vậy ở bản gần, tốn khoảng 1,3 triệu tam giác. Đã đổi sang bộ trồng riêng: bản gần trong 14 m, bản vừa tới 40 m.
2. **Thân nhà luôn vẽ ở lượt trong suốt** (`ownMaterials` đặt `transparent`), nên không có sớm-z. Đã đổi: chỉ trong suốt khi đang mờ. Đo được +3 fps ở phủ Mughal.

Bậc gần của biệt thự chỉ dùng trong 35 m (các căn cách nhau khoảng 25 m).

Bộ dựng các họ (đều chỉ import từ tiên phủ):

- `est-cn.js` (tôi làm)
- `est-asia.js`
- `est-jp.js` + `est-jp-bali.js`
- `est-modern.js` + `-kit`
- `est-classic.js` + `-kit`
- `est-west.js` + `-kit`
- `est-mughal.js`
- `est-tudor.js`

## 6. Chưa đạt / chưa làm

- **FPS ở phủ kém bản cũ 3–10 %.** Tam giác tăng khoảng 0,25 triệu, dù lệnh vẽ giảm 20–30 %. Phần còn lại chủ yếu nằm ở nhà chính bậc gần (Mughal 89k, Nhật 72k, Moorish 76k).
- **Bậc xa vẫn là khối hộp chung** (`AK.farProxyGeometry`): nhìn từ 240–330 m sẽ thấy nhảy hình khi nhà dựng chi tiết nhả ra.
- **Vườn hình học** (`parterre`) vẫn là hộp xanh mặt hồng của bản cũ. Bể bơi, kênh, đài phun là hộp hoặc trụ cũ, chỉ ao elip được làm lại.
- **Nhà Huế, Nhật, Bali đặt trên nền 2,4 m** vì khuôn lô bắt buộc. Với Nhật, nền cao như vậy sai phong cách nên tác tử dựng thành tường đá ishigaki.
- **Tháp thấp hơn lô 36 m**: gác chuông Huế 14,4 m, Hanok 13,3 m, Nhật 26,9 m, Palladio 30,9 m. Vài tháp vươn quá lô 10 m một chút (lâu đài 10,8, Nhật 10,5).
- **Chi tiết điêu khắc còn phẳng**: đầu Naga Thái, chạm Bali, muqarnas / zellige Moorish, phù điêu trán Palladio. Kính hiện đại chưa có env map. Các texture canvas của bộ Nhật / Bali chưa có normal map.
- **Chưa kiểm bằng tay** việc vào nhà mới (vỏ mờ, đặt đồ, NPC trong sân) và đi qua cổng mới.
- **Đường lát** chưa uốn theo cổng mới. Biển tên phủ treo theo toạ độ cũ, có thể lệch so với nhà cổng.
- **Cây ngoài khuôn viên** (cây phố quanh lô) chưa đổi trong đợt này.

## 7. Goal phát triển

1. **Đạt (2026-11-20):** đủ 19 phong cách, `bietphu-check` 132 phần, lỗi 0.
   - Goal tiếp: FPS ở phủ không kém bản cũ. Đo được: A/B ≥ 0 %.
   - Bước kế: bậc vừa cho nhà chính ở 30–75 m, bỏ bóng của chi tiết nhỏ.
2. **Đạt:** 3 biến thể nhà và cổng mỗi khu biệt thự (`opt.variant` = số nhà % 3).
   - Goal tiếp: 5 biến thể và đổi màu theo nhóm.
3. **Bậc xa thật.** Bản xa vẫn là khối hộp chung của mọi khuôn viên (`AK.farProxyGeometry`), nên khi nhà dựng chi tiết nhả ra ở 330 m thì nhảy hình.
   - Đo được: khác biệt bóng và hình ở 240–330 m nhỏ hơn 5 px.
   - Bước kế: nướng thân bậc vừa thành hộp có ảnh (impostor) cho từng phong cách.
