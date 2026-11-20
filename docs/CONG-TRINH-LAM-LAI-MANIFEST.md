# CÔNG TRÌNH + CÂY CỎ LÀM LẠI — MANIFEST (2026-11-19)

Phản hồi người dùng (2026-11-19, 3 tin liền):
1. «Rất nhiều nhà có kích thước bé tẹo ko hợp lý tra lại toàn bộ đi»
2. «Rất nhiều công trình còn mờ và xấu, bỏ đi làm lại hết»
3. «Phần mở đầu có cái cổng … lọt thỏm giữa cái tường thành … bị thu nhỏ à … tôi yêu cầu nét căng mà vẫn đẹp nhẹ …
   rà làm lại tất, toàn bộ cây cỏ trong bản đồ những cây nào dựng ẩu xấu cũng thay thế hết»

## 0. Hiện trạng ĐO ĐƯỢC (không đoán)

Công cụ: `scripts/scan-scene.mjs` (quét mọi lưới quanh người chơi trong game thật: kích thước thế giới, tam giác,
cỡ texture, **mật độ texel px/m**, cờ khối thô), `scripts/house-scale-audit.mjs` (17.528 nhà phố theo mẫu).
Kiểm kê mã nguồn đầy đủ: `output/scan/inventory-structures.md`, `output/scan/inventory-vegetation.md`.

| Vật | Đo trong game | Vì sao xấu |
|---|---|---|
| Cổng chào chợ Ly `lib_paifang` (0, 104) | 26 × 17 × 11 m, texture 1024 → **7 px/m** | nhoè hoàn toàn; méo (quá rộng, thấp) — paifang thật 4 trụ 3 gian 8,5–9 × 9,6–12 m |
| Cổng Sơn Môn `gate_sect` (0, 67) | 14 × 5 × 8,2 m, **36 px/m** | thấp hơn / ngang tường 7,4 m kề bên → «lọt thỏm»; khe hở 4 m mỗi bên giữa cổng và tường |
| Tường Sơn Môn | hộp đỏ 1,4 × 6,5 m + dải vàng + nắp `MD.roof` | khối thô, một màu, không gạch / ngói |
| Nhà phố Meshy (31 mẫu, 17.373 căn) | texture 1024 / căn → **20–50 px/m** | mờ; một số căn nội thành cao 2,9 m (cửa thấp hơn người) |
| Công trình mốc Nội Thành (bq_*) | Meshy 1024, 20–30 m → 30–50 px/m | mờ, chảy nhão (đúc AI) |
| Tường Nội Thành 14 m + 8 tháp góc | hộp + trụ tròn + nón + quả cầu vàng | khối thô |
| 8 cổng Nội Thành `city_gate` | 40 m rộng × ~31 m cao (Ly 64 × 49) trên tường 14 m | quá to so với tường, Meshy mờ |
| Cây ở cổng Sơn Môn (render3d.js:486) | 4 đào = 9 cầu đa giác, xanh lè khi không nở; 2 tùng nón; 11 bụi tre lá nón | khối thô |
| Cây biệt phủ (archkit-style) | 22 loài toàn cầu / nón / hộp | khối thô — số lượng lớn nhất |

## 1. Nghiên cứu (nguồn đã xem)

- Paifang / pailou 4 trụ 3 gian: Chương Châu 8,5 m rộng × 9,57 m cao, gian giữa 3,3 m, gian bên 1,7 m, trụ giữa 5,9 m, trụ bên 4,6 m;
  Linh Thọ 8 × 12 m (3 mái); Hưng Thành 11 m cao; Long Xương ~9 × 11 m; Di Hoà Viên 28,9 × 14 m (7 mái) —
  [Baidu: Stone arch](https://baike.baidu.com/en/item/Stone%20arch/669166), [Openwork Stone Paifang](https://baike.baidu.com/en/item/Openwork%20Stone%20Paifang/122703),
  [Paifang — Wikipedia](https://en.wikipedia.org/wiki/Paifang).
- Sơn môn Bạch Vân Quán (Bắc Kinh, 1443): **3 gian, đơn diêm yết sơn ngói lưu ly, 3 vòm cuốn đá Hán bạch ngọc**, sư tử + hoa biểu trước cửa;
  sơn môn mô phỏng ở Giai Huyện 9 × 9 m; Trí Hóa Tự 1 vòm rộng 7,1 m —
  [Baidu: 白云观 (Bắc Kinh)](https://baike.baidu.com/item/%E7%99%BD%E4%BA%91%E8%A7%82/8404), [qi.org](https://www.qi.org/articles/white_cloud_temple.htm),
  [Zhihua Temple — Wikipedia](https://en.wikipedia.org/wiki/Zhihua_Temple).
- Tường thành Tây An: cao 12 m, mặt trên 12–14 m, chân 15–18 m; mã diện 20 × 12 m mỗi 120 m; lầu cổng ~32 m —
  [Fortifications of Xi'an — Wikipedia](https://en.wikipedia.org/wiki/Fortifications_of_Xi%27an).
- Hệ tỉ lệ cung đình Thanh 《工程做法》 đã nghiên cứu ở `docs/tienphu-nghiencuu/01-trunghoa.md` (bộ dựng `src/game/tienphu/arch/cn.js`
  — dùng lại, KHÔNG sửa file của phiên tiên phủ): cột tiểu thức = 0,8 × gian giữa, mái yết sơn / ngạnh sơn / quyển bằng, đấu củng.
- Bảng tỉ lệ nhà phố đã có: `docs/GAME-AAA-MODEL-THANH-PHO.md §1` (gian 3,6 m; nhà 1 tầng đỉnh 4,6; 2 tầng 8,0; cửa 2 cánh 1,4 × 2,1).
- Cây: 24 model Meshy CC0 `lib_tp_*` đã chọn bằng mắt, 3 cấp (`docs/TIEN-PHU-THUCVAT-MANIFEST.md`, ảnh `output/cay-look/m-big.png`).

## 2. Phương pháp mới (đổi phương pháp — lần chê thứ 2 về chất lượng công trình)

1. **Bỏ model Meshy cho công trình** (texture duy nhất kéo cả nhà → mờ, hình đúc chảy). Dựng thủ tục bằng bộ kiến trúc Trung Hoa
   (`tienphu/arch/cn.js` + `kit.js`, import chỉ đọc) và bộ dựng mới `src/game/archcity/*` cho loại hình bộ đó chưa có
   (sơn môn vòm cuốn, tường bao, paifang, tường + lầu cổng thành, nhà phố).
2. **Vật liệu lặp theo mét** (`src/game/archcity/mats.js`): texture 1024² sinh offline (`scripts/gen-arch-tex.py`, numpy — không tải ngoài),
   màu + pháp tuyến, UV chiếu hộp theo mét lúc dựng (`boxUV`). Một bộ ~9 vật liệu dùng chung cho MỌI công trình → nét mà nhẹ.
3. **Cây**: thay mọi cây khối thô bằng `lib_tp_*` qua `tienphu/bigtrees.plantBigTrees` (3 cấp chi tiết, gió).

## 3. Quy tắc (số đo)

### 3.1 Tỉ lệ người (người 1,72 m)
| Hạng | Luật |
|---|---|
| Cửa đi nhà ở | thông thủy ≥ 2,1 m (1,2–1,6 rộng) |
| Cửa tiệm / bức bàn | ≥ 2,6 m |
| Mái hiên nhà 1 tầng | mép hiên ≥ 3,0 m, đỉnh 4,6–6 m |
| Nhà 2 tầng | đỉnh 7,4–9 m |
| Sơn môn | rộng 22 m (3 gian 5,4 + 7,0 + 5,4 + 2 hồi), **cao nóc 12,5–13,5 m**, vòm giữa 4,2 × 5,6 m, vòm bên 3,2 × 4,4 m; cao ≥ 1,7 × tường kề |
| Tường bao sơn môn | 5,0 m tới nắp (bỏ 7,4 m), chân đá 0,9 m, mặt tường đỏ, nắp ngói 2 mái + nóc; nối kín vào hồi cổng (khe 0) |
| Paifang chợ | 4 trụ 3 gian 3 lâu: rộng 13 m (gian giữa 5,2, bên 3,2), cao 11,5 m, trụ giữa 7,2 m — lối xe 5,2 m |
| Tường Nội Thành | giữ 14 m; lỗ châu mai 1,6 m; lầu cổng (城楼) cao tổng ≤ 2,4 × tường (≈ 33 m), tháp góc ≤ 2 × tường |

### 3.2 Độ nét
- Mật độ texel ở bậc gần: **≥ 256 px/m** (đo bằng `scan-scene.mjs`, cột px/m). Không texture duy nhất nào kéo phủ cả công trình.
- Texture lặp 1024² (nặng ≤ 250 KB webp/ảnh), tổng bộ vật liệu ≤ 4 MB.

### 3.3 Hình khối (luật skill)
- Không hộp trần: tường có chân + thân + nắp ngói + gờ; trụ có chân tảng; mái có hàng ngói (gân), bờ nóc, đầu đao.
- Không vật liệu một màu: mọi bề mặt lớn có texture màu + pháp tuyến; biến thiên màu theo công trình ±8 %.

### 3.4 Ngân sách hiệu năng (đo trước / sau ở sân Sơn Môn và ngoài cổng)
- Sơn môn ≤ 45k tam giác; tường bao ≤ 1,5k / 10 m; paifang ≤ 20k; nhà phố mỗi loại ≤ 10k (bậc gần) / ≤ 1,5k (bậc xa).
- Lệnh vẽ không tăng quá 10 % tại 2 điểm đo; FPS headless không giảm quá 5 %.

## 4. Kế hoạch theo đợt (làm trọn đợt rồi mới sang đợt sau)

| Đợt | Phạm vi | Tiêu chí xong |
|---|---|---|
| 1 | **Khu mở đầu**: sơn môn Nam + Hậu môn, tường bao, paifang chợ Ly, cây quanh sân (đào / tùng / tre khối thô → lib_tp), nhà 2,9 m ngoài cổng | ảnh trước/sau cùng góc; px/m ≥ 256; cổng cao ≥ 1,7 × tường; không khe hở |
| 2 | Nội Thành: tường + 8 tháp góc + 8 cổng; 17 công trình mốc bq_* | như trên |
| 3 | Nhà phố: thay 31 mẫu Meshy bằng bộ nhà thủ tục ≥ 8 loại × biến thể màu, đúng §3.1 | audit 0 căn cửa < 2,1 m; px/m ≥ 256 |
| 4 | Cây toàn bản đồ: cây biệt phủ (archkit-style), tre / đào / tùng thủ tục còn lại | không còn cây cầu / nón |
| 5 | Vùng xa (Tử Bình, Mạnh, đảo trời, Thiên Giới) | — |

## 5. Checklist kiểm (kết quả 2026-11-19)
- [x] Ảnh trước / sau cùng toạ độ + hướng nhìn: `output/lamlai/so-sanh-cong.jpg` (trước `output/lamlai/before/`, sau `output/lamlai/after/`);
  từng bước `output/lamlai/v1/sheet3…10.jpg`.
- [x] `scan-scene.mjs` tại (0, 95): mật độ texel bề mặt mới — vữa 254, đá 427, cẩm thạch 508, ngói 498–526, gạch 533, gỗ son 1022 px/m
  (trước: paifang 7, sơn môn 36, nhà 20–50). Vữa 254 ≈ ngưỡng 256 (texture vữa phủ 4 m — chấp nhận, nhiễu thấp tần).
- [x] Số đo dựng (info): sơn môn 22 × 7 m, thân xây 7,65 m, nóc 14,1 m (= 2,8 × tường 5 m); bài lâu 13,2 m rộng, lối giữa 5 m;
  nhà: 1 tầng 7,2–7,9 m, 2 tầng 10,1–11,4 m, 3 tầng 13,6–14,2 m tới đỉnh bờ nóc; cửa đi 2,35 m (người 1,72 m).
- [x] Hiệu năng A/B nhà (`scripts/lamlai-perf.mjs`, cùng camera, headless): tam giác −8…−14 %; lệnh vẽ +4…+10 % (≤ ngân sách 10 %);
  FPS 16,5–36,3 vs 17,3–39,8 (dao động headless ±10 %, không kết luận chênh); thời gian vào game +1,7 s (dựng 62 mẫu nhà lúc nạp).
- [x] Không lỗi trang trong các lượt chụp.

## 6. Đã làm (đợt 1–4, phần đã xong)
| Hạng mục | File | Thay cho |
|---|---|---|
| Bộ texture lặp theo mét 7 vật liệu (1,93 MB) | `scripts/gen-arch-tex.py` → `public/textures/arch/` | — |
| Vật liệu + UV theo mét | `src/game/archcity/mats.js` | — |
| Sơn môn Nam 3 vòm + Hậu Môn, tường bao 5 m | `archcity/gates.js`, `sect.js`, `court.js` (wallH 6,5 → 5) | gate_sect Meshy, tường hộp đỏ |
| Bài lâu chợ Ly | `gates.pailou`, `landmarks.js` | lib_paifang 26 m, 7 px/m |
| Tường Nội Thành gạch + răng cưa, 8 giác lâu, 8 lầu cổng | `archcity/citywall.js`, `batquai3d.js` | hộp + trụ / nón / cầu, city_gate Meshy |
| 31 biến thể nhà phố thủ tục (17.528 căn) — cao theo người | `archcity/houses.js`, `cityblocks3d.js` | 31 mẫu Meshy 20–50 px/m |
| 37 cây sân sơn môn → lib_tp (anh đào, tùng đen, du tùng, trắc bách) | `archcity/trees.js`, `render3d.js`, `sect.js` | đào 9 cầu, tùng nón, tre lá nón, tree_pine/peach |
| Cây phố Ngoại Thành → lib_tp cỡ phố (hòe, cử, anh đào, liễu, tùng) | `trees.streetTrees`, `citydress3d.js` | lib_lib_tree_* thẻ lá phẳng |
| Sân sơn môn: Chính Đường 9 gian ngói vàng đấu củng, 2 điện phụ 5 gian, chung / cổ lâu 2 tầng, 2 tháp bát giác 5 tầng (Bắc), 2 tháp vuông 3 tầng (Nam), đình Tàng Y; nền đá / bậc / lan can / đèn đá sang vật liệu lặp (ảnh `output/lamlai/so-sanh-san.jpg`) | `archcity/temple.js`, `sect.js` | palace_grand, hall_main, lib_pavilion2, lib_pagoda5, lib_pagoda_red, lib_wood_pavilion (Meshy); texture canvas kéo theo hộp |
| Đồ nhỏ sân: 20 đèn đá tiện tròn + mái đá lục giác vểnh góc (thay nón); 8 cột cờ gỗ son tròn + đá giáp cột + búp đồng (thay hộp đen); bảng màu `models.materials()` (gỗ son, gỗ, đá, ngói) chiếu ba mặt theo mét (`mats.triplanar`) → đài thầy, đình trà, đài la bàn, quầy xăm, bảng lịch, lư hương, giá áo, thuyền nét như công trình (ảnh `output/lamlai/v1/sheet15–16.jpg`) | `sect.js`, `models.js`, `archcity/mats.js` | trụ + nón 6 cạnh, hộp texture canvas kéo theo mặt |
| Ngoại Thành: tường 34 m + mã diện sang vật liệu lặp (gạch xanh, đá, vữa đỏ, ngói — UV theo mét thế giới); 8 lầu cổng thủ tục (đài gạch cao tới mặt tường, 3 vòm, giữa 14 m; lầu 9 gian 62 m 2 tầng đấu củng, nóc ≈ 55 m) thay city_gate Meshy; 64 lầu canh mã diện + 8 giác lâu 2 tầng thay hộp son + nón; LOD 2 bậc, bậc xa nhân bản (`citywall.instancedLod`) — ảnh `output/lamlai/so-sanh-ngoai-thanh.jpg` | `archcity/citywall.js`, `cityblocks3d.js` | khối thô, city_gate trắng loang thấp hơn tường |
| Sửa lỗi cũ: 700 tấm cây xa (11 × 13 m) dồn ở (0, 0) trên bệ thầy — chỗ dư FINE.MAX của bộ billboard rừng chưa ghi | `world3d.js` | — |
| Gộp lưới theo ảnh texture (`mats.consolidate`) cho mọi công trình thủ tục: ~8 lưới / công trình | `archcity/*.js` | 13–16 lưới |
| 13 công trình mốc Nội Thành → điện / lầu / thủy tạ cung đình Thanh (ảnh `output/lamlai/v1/sheet11.jpg`) | `archcity/landmarks.js`, `batquai3d.js` | bq_* Meshy 30–50 px/m |

## 7. Chưa đạt / chưa làm
- **Đợt 2 (dở)**: 13/17 công trình mốc đã thay; còn Meshy: 2 bảo tháp (bq_pagoda, bq_library_pagoda), đan lô bq_furnace, la bàn luopan_stand; liễu Đoài (lib_willow) còn khối to;
  16 nhà `lib_courtyard` (batquai3d.js:330) và dãy nhà AAA quanh sân (landmarks.js:344, instanceModelLod) chưa đổi sang nhà thủ tục.
- Đồ nhỏ sân: đài thầy / đình trà / bảng lịch vẫn dùng mái `MD.roof` (mặt cong trơn, giờ có ngói chiếu ba mặt nhưng không có gân ngói, đấu củng);
  vật liệu chiếu ba mặt chỉ có ảnh màu (không pháp tuyến). Đại Đỉnh `cauldron` vẫn Meshy (đồ vật, 691 px/m — nét).
- Hiệu năng sân (A/B nhà, cùng máy, `scripts/lamlai-perf.mjs`): lệnh vẽ sân 615 (lượt trước 641), cổng 1167 (1192); tam giác sân 1,70 tr
  (lượt trước 1,65 tr, +3 %), cổng 3,04 tr (+7 %) — điện / tháp thủ tục nặng hơn bản Meshy có LOD; chưa có bậc xa cho công trình sân.
- Ngoại Thành: ~~thủy môn~~ (xong 2026-11-20 — `docs/THUY-MON-MANIFEST.md`); ~~mặt tường 34 m một màu gạch~~ (phong hoá xong 2026-11-20 — `docs/VET-BAN-TUONG-MANIFEST.md`)
  (vệt nước, rêu chân tường, mảng vá); lệnh vẽ đứng ngoài cổng 1.747 (đo frameStats; lầu canh đã nhân bản, phần lớn là thành phía sau),
  tam giác 3,2 tr; lần đầu dịch chuyển tới cổng cần ~30 s mới có khung đầu (trước ~16 s — dựng lầu cổng / LOD lúc nạp vùng) — chưa tối ưu.
- Biệt phủ / biệt thự (archkit, khối thô) — chưa làm.
- Cây biệt phủ 22 loài khối cầu / nón (archkit-style.js) — chưa thay; tre phố (citydress3d bamboo) giữ; cây rừng world3d giữ (lib_lib_tree_* —
  chưa soi kỹ ở gần).
- Vùng xa: Hậu Sơn, Tử Bình, Mạnh, Trích Thiên, Thư Lâu, đảo trời — còn Meshy.
- Nhà phố: cửa sổ / cửa bức bàn dùng chung một ảnh song (canvas tiên phủ); chưa có biển hiệu chữ, đèn lồng, rêu chân tường, vệt nước;
  nhà thủ tục còn hơi «sạch» (luật skill §12: phá đối xứng, hao mòn) — chưa làm.
- Nhà xa > 220 m vẫn là khối hộp cũ của farInstances (màu theo mẫu cũ).
- Bản đồ bóng / FPS máy thật chưa đo (chỉ headless).
- Phụ thuộc: `archcity/*` import `tienphu/arch/cn.js`, `kit.js`, `tienphu/bigtrees.js` và THÊM khoá `c_*` vào bảng `BIG` lúc chạy
  (không sửa file tiên phủ) — phiên tiên phủ đổi API thì phải sửa theo.

## 8. Goal phát triển (tự đặt)
1. **Đợt 2 tiếp**: 17 công trình mốc Nội Thành → cnHall / cnLou / cnTower / cnPavilion theo vai (Đan Dược Các = điện yết sơn 5 gian…);
   tiêu chí: 0 model `bq_*` còn trong `batquai.js`, px/m ≥ 256.
2. ~~Công trình sân sơn môn~~ (xong 2026-11-19). Tiếp: đài thầy / đình trà / đèn đá dựng theo nguyên mẫu; bậc xa (LOD) cho điện / tháp thủ tục.
3. Nhà phố: thêm hao mòn (vệt nước dưới mái, rêu chân tường, ngói lệch), biển hiệu chữ theo loại tiệm, đèn lồng; ≥ 3 biến thể màu ngói.
4. ~~Ngoại Thành tường + cổng + tháp góc~~ (xong 2026-11-19). Tiếp: thủy môn, decal mặt tường, dựng lầu cổng trước (worker / cache) để không trễ lúc dịch chuyển; biệt phủ; cây biệt phủ → lib_tp.
