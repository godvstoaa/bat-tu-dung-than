# GAME-AAA-MODEL-THANH-PHO — Chuẩn tỉ lệ thật + bộ asset AAA nhà cửa Huyền Thành & phương án nhân vật

Ngày: 2026-11-14 (v2 — sửa theo biên bản duyệt lần 1: 3 gạch chí mạng ở wiring đã xử) · Người viết: kiến trúc sư AAA (workflow subagent)

Nguồn đầu vào: (1) bản đo tỉ lệ trong-game (bbox từng model + chỗ đặt + số tam giác) — tin được;
(2) bảng tỉ lệ thật + style AAA (gian/jian, chiều cao tầng, mái, kỳ lâu, biển ngang, PBR, tỉ lệ đầu:thân Genshin vs Black Myth);
(3) mã nguồn đối chiếu trực tiếp phiên này, và **số đo generator chạy Node** (lệnh dưới §0.1).

## 0. Chẩn đoán (từ bản đo + đo generator — không đoán)

- **Nhân vật ĐÚNG hết** (1,60–1,76 m, `characters.js:137`). Cảm giác lệch của người chơi đến 100% từ nhà cửa:
  (a) quầy chợ cao 6,83–7,52 m — cao hơn nhà phố 2 tầng đứng cạnh; (b) nhà phố rộng 3 gian nhưng chỉ cao 5,0–6,0 m → dáng lùn;
  (c) 5 chỗ fit-to-width làm bùng chiều cao (Am Vân Cốc 16,6 m, kho Khôn 17,4 m, cổng thành 62,7 m, cổng tông môn 17,5 m, nhà đảo 10,3 m).
- Lỗi gốc kỹ thuật: `place()/instanceModel()` scale theo MỘT trục (`fitKey` — `assets.js:86-90/275`) trong khi nhiều model có hệ số cao/rộng ≥ 0,79.
- `house_town.glb` (10.510 tris) mồ côi — không file src/ nào tham chiếu (grep toàn dự án trừ node_modules/dist; chỉ docs + assets-meshy/manifest.json nhắc).

### 0.1 Pipeline nhà phố ĐO ĐƯỢC — ai render, ai không (bằng chứng chạy Node 2026-11-14)

Lệnh: `node --input-type=module -e "import {renderHouses} from './src/game/city4.js'; import {innerHouses} from './src/game/innerfill.js'; import {generateCity} from './src/game/cityblocks.js'; …"`

| Nguồn | Số nhà | Chọn model từ | Render 3D + va chạm? |
|---|---|---|---|
| `city4.renderHouses()` (city4.js:181) | **17.373** | `RES_POOL/SHOP_POOL/GARDEN_POOL` (city4.js:102-119) qua `pick()` (city4.js:135-151) | **CÓ** — `cityHouses()` tổng hợp tại cityblocks3d.js:353, `addSolidOBB` :354 |
| `innerfill.innerHouses()` (innerfill.js:72) | **154** | RES/SHOP hard-code (innerfill.js:67-68) | **CÓ** (cùng dòng 353) |
| `cityblocks.generateCity().houses` (cityblocks.js:218, THEME_MIX :65-73) | 2.132 | `THEME_MIX.res/shop` | **KHÔNG** — chỉ nuôi biển estate qua `citylook.houseLooks()` (citylook.js:49) → `estate.js:9` |

Số nhà theo mẫu đang render (đo renderHouses): bq_house_2f 3.381 · bq_tower_house 1.891 · bq_teashop 1.975 · bq_house_stone 1.729 · bq_shop_lantern 1.438 · bq_house_tiled 1.273 · **lib_courtyard 1.242** · bq_granary 726 · bq_rural_house 455 · bq_forge 422 · bq_carpentry 418 · **lib_mtn_house 567** · … ⇒ **wire nhà mới vào city4.js pools + innerfill.js, KHÔNG wire vào THEME_MIX** (v1 sai chỗ này — nhà mới sẽ không thay được cái nào).

## 1. proportionTable — CON SỐ LÀM LUẬT cho mọi asset (đơn vị: mét, đỉnh = đỉnh mái)

| # | Loại | Con số luật | Ghi chú nguồn |
|---|------|-------------|----------------|
| 1 | **Gian (间) — module nền** | 1 gian = **3,6 m** (dải thật 3–4). Mặt tiền lặp bội: 1 gian 3,6–4,2 · 2 gian 7,2–7,4 · 3 gian 10,8–11,0 | China's Old Dwellings (uhpress) |
| 2 | **Nhà phố 1 tầng** | Thân **3,0** + mái dốc 24–28° → đỉnh **4,6 m**. 3 gian: **11,0×7,0×4,6 m**; 2 gian: **7,2–7,4×6,0–7,0×4,6 m**. Tỉ lệ cao nhà : rộng sân ≥ 1:3. **GIỚI HẠN GENERATOR**: dãy phố sinh lô `f≥7` (cityblocks.js:249 đổi mẫu nếu `f<7`; innerfill.js:91 bỏ nếu `f<6`) → nhà ở 1 gian 4,2 m **chỉ đặt tay** (tiệm/prop §2.4/2.6), bộ nhà generator nhỏ nhất = 2 gian | Zhang, Courtyard Houses of Beijing (TDSR) + ràng buộc code |
| 3 | **Nhà phố 2 tầng** (tiền điếm hậu trạch) | Trệt 3,4 + lầu 2,8 = thân 6,2 + mái 1,8 → đỉnh **8,0 m** (dải cho phép 7,4–8,6 do nhịp cao thấp §3.4 v5.1). Chuẩn: **11,0×8,0×8,0 m**. Trần thông thủy trệt ≥ 3,0 | GB 50352 (trệt thương mại 3,5–4,2); HCAP 10,5 (`cityblocks3d.js:234-241`) giữ làm trần an toàn |
| 4 | **Tiệm chợ 1 gian** | Footprint **4,2×3,6**, đỉnh mái hiên **3,2**, mép hiên 3,0 vươn **1,0** ra phố. Quầy: dài 2,8 × sâu 0,6 × **cao 1,1** (= hông NPC 1,60 m — chuẩn "quầy theo người" vì không có nguồn mét chuẩn cho quầy cổ) | bố cục gian 3–5 m; cấm số bịa |
| 5 | **Quầy 2 gian (Tàng Y Các)** | **6,6×4,2**, đỉnh **3,8**; khoảng cột trước–sau 3,5 | MDPI Buildings 2025 (kỳ lâu: gian 3–5 m) |
| 6 | **Cửa** | Cửa bản xếp cả gian: **3,2×2,8** (thông thủy 2,6). Cửa nhà 2 cánh: **1,4×2,1**, tay nắm 1,0. Biển ngang 匾额: **0,9–1,5 × 0,3–0,5 (tỉ lệ 1:3)**, tâm 2,2 (ngang mắt +0,5) | cscanada.net + bảo tàng 812×440 mm, cổ lớn 187×84 cm |
| 7 | **Người** | Giữ nguyên **1,60–1,76** (`characters.js:137` — cấm đụng). Đầu:thân **1:6–6,5** (giữa Genshin 1:5,5–6 và Black Myth 1:7,5–8). Mọi chi tiết bắt tay/bậc/òi nước ≤ 1,2 | r/Genshin_Impact + docs.meshy.ai |
| 8 | **Cổng** | Cổng tông môn: **14×8,2** (fit width 14). Cổng thành Ngoại: giữ rộng 81, **kẹp cao về 38** (≈ Thiên An Môn 34,7). Khe đi bộ ≥ 3,2 thông suốt | Thiên An Môn 34,7 m làm quy chiếu |

Quy tắc chung: **model sinh ra ĐÚNG tỉ lệ mét trong Blender** (1 unit = 1 m) để `fitKey` hết là nguồn lệch.

## 2. Bộ asset — 7 NHÓM, tổng 670.000 tris (ngân sách ≤ 800.000, dư 130.000)

**Quyết định v2 (xử gạch 2 của duyệt): MỖI MESH MỘT FILE GLB riêng** — `buildInstanced` (assets.js:271-305) nhân bản MỌI mesh của file vào MỌI vị trí và `placeModel` (assets.js:85-90) không có tham số chọn mesh, grep toàn src/game không có `getObjectByName` ⇒ file 2 mesh sẽ vẽ chồng + fit theo bbox union. Chia file đạt cùng mục tiêu với **0 sửa assets.js** (không đụng đường ấm instancing đang chạy 26 mẫu). Mỗi nhóm dùng CHUNG 1 atlas 2048 (nhúng lại mỗi file, chấp nhận +2-3 MB/nhóm). Mỗi file kèm `.far.glb` (≤18% tris, texture 256, metalness 0 — tránh lỗi "nhà bạc" `cityblocks3d.js:228`); LOD giữa (.lod1/.mid) theo pipeline nạp lười sẵn (cityblocks3d.js:365-368).

### 2.1 NHÓM `lib_house_a` — nhà phố 2 tầng 3 gian + 1 tầng 3 gian (BIẾN THỂ CHÍNH)
- **File**: `lib_house_a2.glb` (2 tầng, 135k) + `lib_house_a1.glb` (1 tầng, 75k). **triBudget nhóm**: 210.000.
- **Dims**: a2 **11,0×8,0×8,0 m**; a1 **11,0×7,0×4,6 m**. HOUSE_SPECS: a2 `{wd:1,375, f:[10,12], hd:0,73}` · a1 `{wd:1,571, f:[10,12], hd:0,42}`.
- **blenderHints**: 1 unit = 1 m, Y-up, origin đáy–tâm, mặt tiền +Z. KHUNG: cột hiên Ø0,28 cao 3,4 nhịp 3,6 — 1 cột + Array Modifier count 4 trục X, xà ăn theo. TƯỜNG: gạch xám #8A8580, vôi #F5F2E9, chân ẩm taupe #C8B8A0 cao 0,5 (nứt bằng normal map, không đường đen). CỬA BẢN XẾP: 1 tấm ván 0,42×2,7×0,05 gỗ son #964B00 + Array 7; 2 tấm giữa xuất thêm bản xoay 35° quanh mép trong file `lib_house_a2_open.glb` (tuỳ chọn, code chọn khi cần cửa mở); khung #664228. TẦNG 2 (chỉ a2): cửa sổ con 1,2×1,4 + lan làm "diên" gỗ sâu 1,0. MÁI dốc 24–28°: ngói ván xám #4A5459 — 1 ngói pan 0,32×0,22 (~8 tris) + Array 2 chiều ~12×34 miếng; đầu hồi GẠCH CHỤM #A44139 — 1 viên 0,24×0,115×0,05 (~12 tris) + Array; bờ it #3B424C. BIỂN NGANG: khung 1,5×0,5×0,06 #664228 mặt sơn son — UV riêng `sign_face` cho code dè chữ CanvasTexture (như `sign()` hiện có). ĐÈN LỒNG: Ø0,45×0,55 treo 2 đầu cột, KHÔNG emissive (code gán `glowAll` như `lib_lantern` — landmarks.js:325). Roughness: ngói 0,9 / gỗ 0,8–0,9. Script bpy theo mẫu sẵn `scripts/blender/gen_tieu_quan.py` (modifier WELD/DECIMATE :275-294), `.far` bằng `bake-lod.py` (decimate → UV mới → nướng MÀU+PHÁP TUYẾN).
- **replaces**: `lib_courtyard` + `bq_house_2f` trong **RES_POOL** (city4.js:110-117) — trụ 6 mẫu/giữ lại làm dự phòng; `lib_courtyard` GIỮ trong GARDEN_POOL (city4.js:119) cho nhà vườn + `batquai3d.js:331` + citylook.

### 2.2 NHÓM `lib_house_b` — nhà 2 gian khá (2 tầng + 1 tầng) — biến thể trộn dãy
- **File**: `lib_house_b2.glb` (100k) + `lib_house_b1.glb` (60k). **triBudget nhóm**: 160.000.
- **Dims**: b2 **7,4×8,0×8,0 m**; b1 **7,4×7,0×4,6 m**. HOUSE_SPECS: b2 `{wd:0,925, f:[8,9], hd:1,08}` · b1 `{wd:1,057, f:[8,9], hd:0,62}`.
- **blenderHints**: cùng hệ module 2.1 nhưng 2 gian; tầng 2 lùi 0,6 làm diên ban gỗ cả mặt tiền; mái ngói BẠC phai #6B7A80 xen mảng ẩm #3B424C (nhà cũ); biển ngang cỡ nhỏ 0,9×0,3; khay cây trước lan làm (~1,5k). Chi tiết lặp đều Array; đổi tỉ lệ mái:thân để silhouette khác A ở camera xa.
- **replaces**: `bq_house_tiled` trong RES_POOL các cung (city4.js:110-117) — bq_house_tiled giữ dự phòng.

### 2.3 NHÓM `lib_house_c` — nhà 2 gian NGHÈO vách gỗ (2 tầng thấp + 1 tầng)
- **File**: `lib_house_c2.glb` (65k) + `lib_house_c1.glb` (45k). **triBudget nhóm**: 110.000.
- **Dims**: c2 **7,2×6,0×6,4 m**; c1 **7,2×6,0×4,0 m**. HOUSE_SPECS: c2 `{wd:1,2, f:[7,8,5], hd:0,89}` · c1 `{wd:1,2, f:[7,8,5], hd:0,56}`.
- **RÀNG BUỘC GENERATOR (xử gạch 3 của duyệt)**: `row()` của cityblocks tính `d = f/wd` với `maxD ≤ 10,5` rồi ĐỔI MẪU khi `f < 7` (cityblocks.js:247-249); innerfill bỏ nhà khi `f < 6` (innerfill.js:91). wd 1,2 + f[7;8,5] ⇒ d 5,8–7,1 ≤ 10,5 và f ≥ 7 luôn sống qua cả hai generator. (v1 định nhà 1 gian 4,2 m wd 0,65 → f ≤ 6,83 luôn bị đổi mẫu — bỏ.)
- **blenderHints**: vách gỗ trát vôi nứt (#F5F2E9 + mảng phai #EDEAE0), chân đá vụn; mái ngói ván ghép — ván 0,15 + Array dốc 30°; cửa đơn 1,4×2,1 hai cánh; gác lửng nhô 0,4 + cửa sập; thềm đá 3 bậc ≤0,45; không biển ngang — đèn dầu giấy nhỏ. Atlas 1024 riêng cho nhóm nghèo (màu ít).
- **replaces**: `bq_rural_house` + `bq_farmhouse` (một phần) trong RES_POOL kun/gen (city4.js:110-117) và RES của innerfill (innerfill.js:67).

### 2.4 `lib_shop_stall` — tiệm chợ 1 gian ĐÚNG TỈ LỆ (thay cái to quá — worst #1)
- **Dims**: **4,2×3,6×3,2 m** (đỉnh mái hiên); quầy 2,8×0,6×1,1. File đơn + `.far.glb`. **triBudget**: 60.000.
- **blenderHints**: 4 cột gỗ Ø0,20 cao 2,9; mái hiên một dốc 24° bằng ván gỗ 0,15 + Array, mép vươn 1,0 ra phố, đỉnh 3,2; quầy chữ L ván #C19A6B đế #7D5839, cao đúng 1,1 (thay 6,83–7,52 m hiện tại), đáy hở 0,1; 3 thùng 0,6³ + sọt tre; biển ngang 0,9×0,3 (UV sign_face); ván dựng sau lưng. Con số 1,1 m = hông NPC 1,60 m.
- **replaces**: `lib_stall_timber` ở CẢ 3 chỗ: `landmarks.js:334` (fit width 5,5 → **4,2**), `cityblocks3d.js:570` (s: 5 → **4,2**), `lifeplaces3d.js:24` (fit height 4,2 → **fit width 4,2**). `addSolidOBB` ở cityblocks3d.js:570 đổi 2,4/2,0 → **2,1/1,8**.

### 2.5 `lib_shop_counter` — quầy Thợ May Tàng Y Các 2 gian (thay gian chòi 6 m — worst #7)
- **Dims**: **6,6×4,2×3,8 m**. File đơn + `.far.glb`. **triBudget**: 65.000.
- **blenderHints**: 6 cột Ø0,22, gian 3,3×3,5; mái ngói ván xám dốc 26°; quầy chữ U gỗ bóng (roughness 0,5) cao 1,1; giá thuốc sau quầy 2,2 m với lọ sứ Ø0,12 (1 lọ + Array ~24); móc treo vải lụa đỏ #C3272B viền #E7C969 (roughness 0,3; sheen = input có sẵn Principled BSDF, bpy set được — việc mới, chưa script nào trong repo dùng); biển 1,2×0,4. Chừa mép quầy trống tại TANGY.x+1,2 chỗ NPC bán (render3d.js:343, court.js:70).
- **replaces**: `lib_wood_pavilion` **chỉ ở `sect.js:233`** (fit width 6,2 → **6,6**); GIỮ ở Đại Hí Đài (dui, LANDMARK cityblocks.js:79) + Nông Gia (batquai.js:126).

### 2.6 NHÓM `lib_prop_street` — xe hàng + thùng hàng + cột phướng
- **File**: `lib_prop_cart.glb` (16k) + `lib_prop_crate.glb` (10k) + `lib_prop_pole.glb` (14k) — 3 file vì cùng lý do gạch 2. **triBudget nhóm**: 40.000.
- **Dims**: cart **1,9×0,95×1,15** (bánh Ø0,6, cán 1,3); crate **0,85³** (+biến thể chồng 0,6³ dựng bằng scale code); pole **cao 6,2** (cột Ø0,14) + cờ 1,6×0,9.
- **blenderHints**: cart kiểu xe hàng rùa khung gỗ + thành đan tre, bánh nan 12 căi (1 căi + Array dọc vành); crate gỗ đai tre sơn son mòn mép (edge wear #946E4A); pole đế đá + cờ lụa đỏ #C3272B hai mặt DoubleSide, cờ phất bằng xoay nhẹ quanh trục cột trong code — không vải vật lý.
- **replaces**: `lib_cart` ở các điểm chợ (landmarks.js:338 giữ, thêm chỗ mới qua `cityDress`); cột phướng thay cờ tường tạm ở cityblocks3d.js:170.

### 2.7 NHÓM `lib_signage_kit` — biển ngang gỗ + đèn lồng treo
- **File**: `lib_sign_board.glb` (10k, biển chuẩn 1,2×0,4 — code scale 0,75/1,25 ra cỡ 0,9/1,5 vì là khối hộp cứng, scale đều an toàn) + `lib_lantern_hang.glb` (15k, đèn Ø0,45×0,55 + đòn ngang 1,2 + cần 0,35). **triBudget nhóm**: 25.000.
- **blenderHints**: khung gỗ #664228 mặt sơn son #964B00 mòn mép, UV `sign_face` trống cho chữ code; đèn khung tre #664228 + lụa đỏ #C3272B, KHÔNG emissive trong model (code gán `glowAll` + `addLight` như landmarks.js:325-328). Instanced dọc dãy `bq_*` cũ giữ lại.
- **replaces**: không thay model — thay biển canvas phẳng lơ lửng và đèn chỉ có cột (`lib_lantern`).

**Không làm đợt này**: .hd 300k cho bộ mới (dư địa 130k giữ cho chỉnh sau đo fps); model cổng mới (city_gate/gate_sect chỉ sai SCALE — §4.5).

## 3. charPlan — CHỐT PHƯƠNG ÁN (a): nâng look qua phụ kiện procedural, KHÔNG đụng rig (duyệt: ĐẠT, giữ nguyên)

**Lý do chốt**: cả 6 nhân vật đo đúng người thật (1,60–1,76 m — `characters.js:137`); khoảng trống "wow" là silhouette + chất liệu. Hạ tầng sẵn: `accessories.js` bám vị trí THẾ GIỚI của xương qua `ch.bone(bn)` + `getWorldPosition` (accessories.js:340-342) mỗi khung — tránh hoàn toàn rig Meshy tỉ lệ 0,01 (đúng docs.meshy.ai: giữ topology + skeleton + skin weights). Hero đã gắn `createOutfit` tại render3d.js:576; `tint` là param sẵn (characters.js:138).

Việc cụ thể trong `accessories.js` (mở rộng, không sửa code nhân vật):
1. **HEAD thêm**: búi tóc giả + trâm ngọc (M.jade sẵn), khăn trán tiểu nhị (#5C2223), nón lá (M.straw, DoubleSide sẵn).
2. **BACK (Spine02) thêm**: túi vải, bình rượu hông, ống quyển — vật CỨNG bám 1 điểm; **CẤM áo vải mềm** (không parent xương được → không theo khớp gập).
3. **NPC dân (npc_villager/npc_merchant)**: phân hóa theo cung bằng `tint` — 8 bộ màu bám 60-30-10 (60% áo ngoài chủ đạo / 30% áo trong ngà #F5F2E9 hở cổ-tay / 10% đai #5C2223-#664228).
4. **Hero 'wow'** (chi tiết §4.8): outfit set tu tiên mới + 2-3 preset robe màu; texture .hd 2048 đã tự nâng (characters.js:132-136).

NPC đứng kiểu `ong_lao` (80k tris) chỉ làm sau này cho NPC có thoại — ngoài phạm vi đợt này.

## 4. wiringNotes — dặn thợ wire (file:dòng, thao tác, kiểm) — ĐÃ SỬA THEO DUYỆT

**(0) assets.js KHÔNG sửa** (quyết định v2): thiết kế chia mỗi mesh một file (§2) nên không cần hook chọn mesh — tránh đụng `buildInstanced` (assets.js:271-305) đang chạy cho 26 mẫu.

**(1) NHÀ PHỐ — wire vào ĐÚNG bảng render** (sửa gạch 1):
- `HOUSE_SPECS` (cityblocks.js:33): thêm 6 id `lib_house_a2/a1/b2/b1/c2/c1` với wd/f/hd đúng §2.1-2.3.
- `RES_POOL` (city4.js:110-117): mỗi cung thay 2-3 mục cũ bằng id mới — ví dụ li: `['lib_house_a2','lib_house_b2','lib_house_c2','lib_house_a1','bq_tower_house','lib_mtn_house']`; làm tương tự kun/dui/qian/kan/gen/zhen/xun (giữ bq_tower_house cho tim phố cao). `GARDEN_POOL` (city4.js:119): thêm `lib_house_a1` (nhà vườn 1 tầng).
- `innerfill.js:67` RES: thêm `lib_house_c2`, `lib_house_b2` (154 nhà chen Nội Thành cũng đổi da).
- **Chặn kéo cao quá luật (xử gạch 9 của duyệt)**: `pick()` đích chiều cao theo tier `HT` (city4.js:116) — avenue [10,14] sẽ kéo nhà lên ~10 m > luật 8,0.Thêm 1 dòng đầu vòng `pool.forEach` (city4.js:146): `if (id.startsWith('lib_house_') && ht > 8.6) return;` ⇒ lib_house không bao giờ được chọn cho avenue/plaza/ring và nửa trên street/lane; `ht` trả về bị HT_DISTORT [0.85,1.25] kẹp quanh cao tự nhiên ⇒ đỉnh kết cuộc ≤ 8,6 m (luật 8,0 ± 0,6 nhịp §3.4 v5.1). Avenue/plaza giữ bq_tower_house/bq_house_2f như cũ.
- **Bảo hiểm nhánh không-ht** (nhà innerfill không có ht → houseScale nhánh HCAP, cityblocks3d.js:239-240): thêm vào `HCAP` (cityblocks3d.js:233): `lib_house_a2: 8.6, lib_house_b2: 8.6, lib_house_c2: 6.8` (bản 1 tầng không cần — tự thấp).
- `THEME_MIX` (cityblocks.js:65-73): đồng bộ id mới **tuỳ chọn** — chỉ ảnh hưởng biển estate (`citylook.houseLooks()` → estate.js:9), không render.
- **Va chạm KHÔNG đụng nếu giữ lô**: `hw=f/2, hd=d/2` theo LÔ (cityblocks.js:181; innerfill theo lu/lv) → `addSolidOBB` theo khung lô (cityblocks3d.js:354) không đổi khi chỉ đổi model; lô đã lùi SETBACK=1 khỏi mép đường (cityblocks.js:27) — đường (RING_W=6 batquai.js:21; đại lộ Nam w=9, trục E–W w=8 — roads.js:13/40-41; AVE 32/RING 24/STREET 12/ALLEY 6 — citylayout.js:31) không bị lấn vì chiều rộng nhà = mặt tiền lô. Cấm đổi f/d của lô khi chưa cộng lại footprint.

**(2) KIỂM BẮT BUỘC sau wire**: (a) `node scripts/test-game-collide.mjs` (tường chặn, 8 cổng thông, bậc terrace — đi bước 5 cm); (b) `node scripts/test-game-city-v4.mjs`; (c) đo lại generator như §0.1 — kỳ vọng `lib_house_*` > 0 trong renderHouses (mục tiêu lib_courtyard/bq_house_2f/bq_house_tiled giảm 50-70% ở các cung đã thêm; tổng lib_house ≈ 4-6k/17.373); (d) fps `game.html?fps` trước–sau ghi DOHOA-MANIFEST.

**(3) TIỆM swap 3 chỗ** (như v1 — duyệt xác nhận trúng dòng): landmarks.js:334 + cityblocks3d.js:570 (đổi cả `s:5 → 4,2` VÀ `addSolidOBB 2,4/2,0 → 2,1/1,8`) + lifeplaces3d.js:24 (fit height 4,2 → fit width 4,2; biển "Quầy Cơm" lifeplaces3d.js:30 hạ y 3,2 → **2,6**). Quầy đại lộ Nam giữ tâm x=±10,5: mép hiên mới 8,4 vs mép đại lộ 4,5 → thông 3,9 m mỗi bên, tổng hành lang 16,8 m > ngưỡng corridor 4 m.

**(4) TÀNG Y CÁC**: sect.js:233 `lib_wood_pavilion` → `lib_shop_counter` fit width 6,6, giữ `solid()`; kiểm npc_merchant render3d.js:343 (TANGY.x+1,2 — court.js:70) không chìm vào quầy.

**(5) KẸP SCALE chỗ fit-to-width bùng cao** (0 tris):
- Cổng thành cityblocks3d.js:182-183 (fit width 56×1,45 vì A=2125>500): sau `place` nhân `obj.scale.y × 0,61` (62,73 → **38 m**), giữ scale.x (rộng 81 m); tính lại `addTall` theo đỉnh mới; `keep: corridor(...,6)` vẫn thông.
- Cổng tông môn sect.js:222/223: fit 30/20 → **14** (→ 14×5,1×8,2 m). **CHỐT (gạch 5 của duyệt)**: `keep` của `addFootprint` nhận **toạ độ THẾ GIỚI theo mét** — `keep((i+0.5)*CELL,(j+0.5)*CELL)` (collide.js:178) — nên khe |x|>3,4 giữ nguyên = 6,8 m thông, KHÔNG cần co hệ số 14/30. Fallback landmarks.js:280 width 70 → **30**.
- Am Vân Cốc landmarks.js:431: fit width 21 → **fit height 8,0** (→ 10,1×10,1×8,0 m); bàn Khổng Tiên Sinh landmarks.js:433 offset sin/cos(ry)×11,5 → **10,5** (giữ mép nhà +5 m).
- Kho Khôn batquai.js:125: fit width 22 → **fit height 9,5** (→ 12×12×9,5 m) VÀ `foot [22,22]` → **[12,12]** (foot = khung kiểm đè, batquai.js:106).
- Nhà đảo bay landmarks.js:191/241/243/246: fit width 13 → **fit height 8,2** (→ 10,3×10,3×8,2 m; đảo solid:false chỉ visual).

**(6) house_town.glb**: xoá khỏi pack + assets-meshy/manifest.json (mồ côi — grep toàn src/ không tham chiếu).

**(7) GIỮ NGUYÊN**: lib_courtyard (GARDEN_POOL + nhà vườn batquai3d.js:331 + citylook), lib_mtn_house, lib_ong_lao (landmarks.js:421), bq_* còn lại, lib_lantern/lanternPosts, toàn bộ HEIGHT + model nhân vật (characters.js:137 cấm sửa).

**(8) HERO WOW** không đụng mesh/rig: outfit set mới + preset robe qua accessories.js (outfit.set — render3d.js:576; tint robeTint — render3d.js:567/616), .hd tự nâng (characters.js:132-136); phụ kiện npc theo cung bằng tint sẵn — 0 tris ngân sách nhà.

## 5. decisions — lý do từng quyết (v2)

1. **Sửa nhà phố bằng model đúng tỉ lệ mét, wire qua city4 pools + innerfill** (không phải THEME_MIX): THEME_MIX chỉ nuôi 2.132 nhà biển estate không render; 17.373 + 154 nhà render lấy mẫu từ city4.js:102-119 + innerfill.js:67-68 (đo Node §0.1). Đây là sửa trực tiếp gạch 1 của duyệt.
2. **Chia mỗi mesh một file GLB thay vì thêm hook chọn mesh vào assets.js**: buildInstanced/placeModel không có chọn theo tên (grep không có getObjectByName); chia file đạt cùng kết quả, 0 rủi ro hồi quy trên đường ấm instancing 26 mẫu — đổi lấy +2-3 MB atlas nhúng lại mỗi nhóm.
3. **lib_house_c là nhà 2 GIAN 7,2 m (wd 1,2, f[7;8,5])** thay vì nhà 1 gian 4,2 m: generator đổi mẫu mọi lô f<7 (cityblocks.js:249) và bỏ lô f<6 (innerfill.js:91) — nhà 1 gian không thể xuất hiện qua generator, chỉ đặt tay (dạng tiệm §2.4). Sửa gạch 3.
4. **Chặn tier cao bằng 1 dòng trong pick() (ht > 8,6) + HCAP cho nhánh không-ht**: bảo đảm luật đỉnh 8,0±0,6 m trong khi HT.avenue [10,14] tiếp tục được đáp bởi bq_tower_house/bq_house_2f — hoà mục tiêu D/H đại lộ §3.5 v5.1 với tỉ lệ thật. Sửa gạch 9.
5. **Tiệm thay MODEL thay vì kẹp height**: model cũ cao/rộng 1,37 — kẹp về 3 m dập mái + biển; model mới dựng đúng 3 cột đo (quầy 1,1 / mép hiên 3,0 / đỉnh 3,2).
6. **Cổng/kho/am sửa scale tại chỗ**: thuần lỗi hệ số — 4 chỗ 4 dòng, 0 tris.
7. **charPlan (a)**: nhân vật đo đúng hết; accessories procedural 0 tris, 0 rủi ro rig (bám xương world-space accessories.js:340-342); NPC đứng 80k tris không mua giá trị tương đương đợt này.
8. **Tổng 670k/800k, không .hd**: dư 130k cho chỉnh sau đo fps; .glb + .far.glb đủ cho khoảng xa (assets.js:249).
9. **house_town.glb xoá**: mồ côi + lệch chuẩn.
10. **Bảng §1 là LUẬT**: mọi model check bbox theo §1 trước khi nạp; từ chối model vi phạm hệ số cao/rộng.
11. **keep() = toạ độ thế giới mét (collide.js:178)** — chốt, không còn câu mở; các chỗ kẹp cổng không phải co hệ số keep.
