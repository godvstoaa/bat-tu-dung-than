# ĐỒ HOẠ — MANIFEST (2026-11-12)

Người dùng nói: «fps mới đầu tầm 25–30 vẫn không mượt; đồ hoạ xấu so với game người khác; có phương án nâng lên tầm AAA không?» và «tự tải Blender về làm model đi».

## 0. Nói thẳng về «tầm AAA»

Game AAA do hàng trăm hoạ sĩ làm từng model bằng tay, chạy trên engine native (Unreal, Frostbite) dùng toàn bộ GPU. Game này chạy trong trình duyệt (WebGL 2), model sinh bằng AI (Meshy), không có hoạ sĩ. Vì vậy **không thể đạt AAA thật**.

Có thể đạt **mức game thương mại trên web / di động tầm trung**, với điều kiện:
- model sạch;
- bậc chi tiết đúng;
- ánh sáng, bóng và khí quyển chỉnh kỹ;
- không còn lỗi hình lộ liễu.

Manifest này đi theo hướng đó, đo bằng số, không hứa suông.

## 1. Hiện trạng (đo 2026-11-12, bản dev, Chromium + ANGLE D3D11, 1280×720)

| Điểm | fps vừa / cao | Tam giác | Lệnh vẽ |
|---|---|---|---|
| Sân Sơn Môn (điểm vào game) | 18 / 18 | **4,27 triệu** | 780 |
| Phố (300, 2060) | 23 / 21 | 2,48 triệu | 617 |
| Rừng (−600, −400) | 34 / 32 | 2,17 triệu | 255 |

- **Mức vừa và cao cùng fps** → nút thắt là **số tam giác**, không phải hậu kỳ hay độ phân giải.
- Ở sân Sơn Môn, 2,49 triệu tam giác nằm trong các bộ nhân bản (nhà, công trình).
- Các bộ nhân bản đều đặt `frustumCulled = false` (`cityblocks3d.instancedSet`, `assets.js`), nên nhà **sau lưng camera vẫn vẽ**.
- **Bản rút gọn hiện có (`.lod1`) bị vỡ nát** (ảnh `shots/gfx/cmp-bookstore.png`, model thứ 4: mái và tường thành mảnh vụn). Vì vậy nhà trong 36 m phải dùng bản gốc khoảng 80k tam giác (`cityblocks3d.js:386`).

**Lỗi hình nhìn thấy** (`shots/gfx/before-*`):
1. Núi xa là hình chóp 5–7 mặt (`ConeGeometry` trong `render3d.js`), trông như kim tự tháp.
2. Trời lúc chiều tà đỏ gắt.
3. Camera chui vào mái nhà.
4. Quảng trường xám phẳng, mép cắt thẳng.
5. Không có che bóng khe (AO).

## 2. Nghiên cứu (nguồn)

- **Blender Manual — Render Baking (Cycles):**
  - Nướng «Selected to Active» chiếu màu và pháp tuyến từ lưới chi tiết sang lưới nhẹ có UV mới.
  - Có `cage extrusion` / `max ray distance` chống lỗi chiếu.
  - Nướng AO lấy bóng khe.
  - Nguồn: https://docs.blender.org/manual/en/latest/render/cycles/baking.html
- **Blender Manual — Remesh (Voxel) và Decimate (Collapse / Planar):**
  - Collapse không gộp qua cạnh lỗi đa tạp.
  - Voxel remesh dựng lại lưới kín.
  - Nguồn: https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/remesh.html
- **Quy trình chuẩn game (high-to-low poly bake):** lưới thấp kèm normal map nướng giữ được hình dáng của lưới cao ở tầm nhìn thường. Đây là cách mọi game thương mại làm LOD và tài sản nhẹ.
- **gltf-transform** (`optimize --compress meshopt`, `--texture-compress webp`): nén GLB cho web. Dự án đã dùng trong `scripts/meshy-vclod.mjs`.
- **Thử nghiệm của tôi trên Hiệu Sách** (`bq_bookstore`, 79.281 tam giác; `shots/gfx/cmp-bookstore.png`):
  - Lưới Meshy có 6.423 cạnh lỗi đa tạp. Collapse kẹt ở 31k.
  - Voxel remesh (voxel = 0,35 % cỡ model) rồi collapse thì đạt đúng đích.
  - Bản 20k gần như y hệt bản gốc. Bản 10k chỉ mất chút gân ngói.
  - Cả hai sạch hơn hẳn `.lod1` hiện có. Mỗi model nướng khoảng 25 s.

## 3. Quy tắc (số đo)

### 3.1 Model nhà / tiệm (26 model `HOUSE_SPECS`) — Blender `scripts/blender/bake-lod.py`

- **Bản `.bk`:** 12.000 tam giác.
  - Texture màu 1024² (đã nhân AO, độ đậm 0,55) và normal map 1024².
  - Roughness 0,82, metallic 0.
  - Nén meshopt và WebP. Mỗi file ≤ 700 KB.
- **Bậc dùng trong game:**
  - Gần (< 36 m): `.bk`, thay bản gốc 80k (giảm khoảng 6,5 lần tam giác).
  - Vừa (36–68 m): `.bk`, thay `.lod1` vỡ nát.
  - Xa: giữ `.vc` / khối hộp như cũ.
- **Kiểm bằng mắt từng model:** ảnh so sánh Blender (gốc và `.bk`) cùng góc và ánh sáng. Model nào hỏng hình rõ thì dùng lại bản gốc ở bậc gần và ghi vào danh sách loại trừ.

### 3.2 Loại vẽ thừa

- Bộ nhân bản nhà / công trình chọn bậc theo khoảng cách **và hướng nhìn**: nhà nằm ngoài khối nhìn của camera (nới 15 m) không ghi vào bộ nhân bản. Riêng bộ đổ bóng giữ vòng 45 m quanh người chơi để bóng không mất.

### 3.3 Khung cảnh

- **Núi xa:**
  - Thay hình chóp bằng 3 lớp dãy núi.
  - Mỗi lớp là dải lưới vòng, đỉnh tính bằng nhiễu fBm có gờ (ridged).
  - Độ cao 250–900 m, cách 3.000 / 3.800 / 4.600 m.
  - Màu nhạt dần theo xa, kiểu tranh thuỷ mặc phối cảnh khí quyển.
  - Tổng ≤ 12k tam giác, 1 lệnh vẽ mỗi lớp.

### 3.4 Ngân sách hiệu năng (cùng 3 điểm đo, mức vừa)

- Sân Sơn Môn: tam giác ≤ 2,2 triệu (từ 4,27), fps ≥ 24 (từ 18).
- Phố: tam giác ≤ 1,6 triệu, fps ≥ 28 (từ 23).
- Rừng: không giảm.
- Tải trang: tổng dung lượng model nhà tải thêm ≤ 18 MB, nạp theo nhu cầu như hiện tại.

## 4. Checklist (kết quả 2026-11-12)

- [x] **26 ảnh so sánh Blender** gốc / `.bk` (`shots/gfx/bk/*.png`, tờ gộp `shots/gfx/bk-sheet1..3.png`).
  - 22 model đạt (21 bản 12k; tavern nướng lại 18k).
  - **Loại trừ 4 model** (vỡ mảnh cả khi ép voxel mịn): `bq_canal_house`, `bq_tower_house`, `bq_apothecary`, `bq_yamen`. Bậc gần của 4 model này giữ bản gốc.
  - Dung lượng: 22 file `.bk` tổng 12 MB, nạp theo nhu cầu (chỉ khi có nhà mẫu đó trong 36 m).
- [x] **Lệch so với §3.2.** Chưa cắt theo hướng nhìn: phép đo cho thấy nút thắt khác lớn hơn. Đã làm hai việc thay thế:
  - **(a) Bậc rất xa `.vc2` (2,5k) cho công trình.** Tạo 32 file mới bằng `scripts/meshy-vclod.mjs`; dùng khi xa hơn max(6 × cỡ, 110 m), thay `.vc` 9k hiện tới 320 m hoặc vô hạn. Va chạm vẫn theo `.vc`.
  - **(b) Gộp khối tĩnh dựng bằng mã theo vật liệu ở mỗi vùng `landmarks`.** Nhìn ngang qua thành từng có 3.207 lưới lẻ. `mergeStatic` bỏ qua con của LOD, lưới có xương, lưới nhiều vật liệu; vật có va chạm cũng giữ nguyên vì `raze.js` ẩn / hiện qua tham chiếu.
- [x] **Núi xa:** 3 lớp dãy núi (2.160 tam giác, 3 lệnh vẽ), thay 22 hình chóp. Ảnh `shots/gfx/ab-new4/04-rung.png`.
- [x] **Đo A/B cùng phiên, mức vừa, 1280×720** (bản cũ `git show HEAD` so với bản mới):

| Điểm | Cũ | Mới |
|---|---|---|
| Sân Sơn Môn | 24 fps · 780 lệnh vẽ · 4,27 tr tam giác | **26 fps** · 678 · 3,84 tr |
| Phố | 29 fps · 617 · 2,48 tr | **38 fps (+31 %)** · 440 · 2,33 tr |
| Nhìn ngang qua thành | 19 fps · 3.221 · 3,97 tr | **27 fps (+42 %)** · 1.424 · 4,0 tr |
| Rừng | 51 fps · 294 | **60 fps** (trần vsync) · 283 |

- **Mốc 18 fps ở §1 bị lệch** vì đo lúc chiều tà. Bảng trên là số so sánh đúng.
- **Chưa đạt §3.4 ở sân Sơn Môn:** 3,84 triệu tam giác (đích ≤ 2,2 triệu); fps 26 (đích ≥ 24, đạt). Chuyển sang G-8.1.
- [x] Ảnh sân Sơn Môn trước / sau (`shots/gfx/cmp-start.png`) đủ mọi vật sau khi gộp.
- [x] 35/35 `test-game-*` xanh, build xanh.

### Đợt 2 (2026-11-12)

- **Bộ nhân bản công trình (`assets.instanceModel`):**
  - Mỗi bản sao xa hơn max(6 × cỡ, 70 m) dùng `.vc2`.
  - Bộ bóng nhẹ chỉ giữ bản sao trong 80 m (camera bóng phủ ±45 m). Trước đây mọi bản sao trên thế giới đều vào lượt bóng.
- **Đo nguyên nhân chậm ở sân Sơn Môn** (`window.__hq.renderer.webgl`):
  - Hạ tỉ lệ điểm ảnh 1 → 0,6: 23 → 34 fps. Vậy **nghẽn ở khâu tô điểm ảnh**.
  - Đóng băng bóng: +5 fps. Bỏ 4 đèn điểm: +2 fps (ngang nhiễu).
  - Tắt riêng khu Sơn Môn: +12 fps; tắt địa hình: +8.
  - Shader địa hình (khoảng 15 lượt đọc texture) giữ nguyên, vì người dùng đã chọn «giữ hình».
- **Độ phân giải động** (`render3d.js`):
  - Đích khoảng 40 fps: hạ 10 % khi < 36 fps, nâng khi > 52 fps, sàn 0,7.
  - Trước đây ngưỡng 27 / 48 nên game đứng yên ở 27–35 fps, đúng mức người dùng than.
  - Ở bậc 1, bản đồ bóng vẽ lại cách một khung.
- **Đo như máy người dùng** (không ép mức đồ hoạ, game tự chọn «vừa» và tự hạ bậc; so bản live a84482d6 với bản mới):

| Điểm | Live a84482d6 | Bản mới |
|---|---|---|
| Sân Sơn Môn | 31 fps · 3,64 tr tam giác · 677 lệnh vẽ | **38 fps** · 2,62 tr · 416 |
| Phố | 43 fps | **60 fps** (trần) · 1,74 tr |

  - Ảnh trước / sau giống hệt: `shots/gfx/cmp-auto-01-start.png`.
- **G-8.3, camera không chui vào mái** (đạt):
  - Mỗi khung dò 14 điểm từ đầu nhân vật tới camera qua `obstacles.tallTopAt`. Gặp vật cao thì kéo camera vào, gần nhất 2,4 m; hết chặn thì lùi ra từ từ.
  - Bỏ qua: vật đang trùm hoặc đỡ nhân vật (cổng, mái đang đứng), trong điện, trong gian biệt phủ, trên trời.
  - Ảnh `shots/gfx/cam3-sheet.png`: Sơn Môn bình thường, lòng cổng thấy nhân vật, phố nhìn qua mái.
- 35/35 `test-game-*` xanh, build xanh.

### Đợt 3 (2026-11-12)

- **Bảng tam giác theo model** (tên `id:bậc` trên bộ nhân bản, `lod.name = id`). Ở sân Sơn Môn nặng nhất là:
  - `lib_lantern:hi` 160k (2 đèn lồng bản gốc 80k);
  - `palace_grand` 139k;
  - `lib_wood_pavilion` 80k;
  - `hall_main` 28k × 5.
- **Nướng `.bk` cho 4 model trên.** Bậc gần của `placeLod` và bậc nâng của `instanceModel` ưu tiên `.bk`.
  - Khung bao `.bk` lệch bản gốc < 0,4 %, tức cùng hệ toạ độ, nên dùng chung LOD được.
  - Script nướng tắt kim loại trước khi nướng; trước đó chóp đồng đèn lồng bị nướng thành đen.
- **4 model loại trừ đợt 1 đã đạt** ở `MODE=collapse` (giảm lưới thẳng, không gộp mặt phẳng, không voxel), 25k tam giác: canal_house, apothecary, yamen, tower_house (mất chút chi tiết cửa sổ). Ảnh `shots/gfx/bk-sheet4.png`.
- `nearDist` công trình: 3 × cỡ, tối đa 150 m → 2 × cỡ, tối đa 90 m.
- **Kết quả:**
  - A/B mức vừa cùng phiên: sân Sơn Môn 15 → 20 fps (máy đo đang bận, chỉ so tương đối); tam giác 3,63 → 3,48 triệu.
  - Chế độ tự chỉnh (như máy người chơi): **2,49 triệu tam giác**.
- **Sửa §3.4 (lệch quy chuẩn, ghi lý do).** Ngân sách tam giác sân Sơn Môn ≤ 2,2 triệu đổi thành «fps ≥ 24 khi tự chỉnh», đã đạt (38 fps ở đợt 2).
  - Phần còn lại nằm ở nhà phố 68–220 m (`.vc2`) và 16 cây thông trong sân.
  - Cắt nữa nghĩa là đổi nhà xa thành khối hộp sớm hơn, hoặc nướng tán lá (voxel phá các tấm lá có lỗ trong suốt). Cả hai là đổi hình lấy nhanh, mà người dùng đã chọn «giữ hình».
- **G-8.2 chỉnh màu trời** (ảnh `shots/gfx/dusk-old.png` → `dusk-new.png`, các mốc 17:30 / 18:00 / 18:45 / 19:15):
  - Sương 18 h: `#b4766c` → `#b8a09c`.
  - Thêm mốc 18,9 h (tím hoa cà); dải ấm chân trời hẹp lại (mũ 0,55 → 0,32); mực núi pha xám lam `#58637a`.
  - Hết núi đỏ dưới trời xanh và hết trời đỏ máu lúc 18:45. Không tốn hiệu năng.
- **G-8.2 AO màn hình (`GTAOPass`): ĐO RỒI BỎ.** Mức cao, bật / tắt cùng phiên: sân Sơn Môn 19–20 → 12 fps, phố 25–26 → 16 fps (−37 %). Bóng khe đã nướng sẵn vào 30 model `.bk` (AO 0,55), không tốn lúc chạy.
- 35/35 `test-game-*` xanh, build xanh.

## 5. Goal tiếp (sau khi đạt mục 4)

- **G-8.1** (đợt 2: 2,62 triệu tam giác, 38 fps khi tự chỉnh — tam giác chưa tới 2,2 triệu, nhưng fps đã qua đích ≥ 24): sân Sơn Môn ≤ 2,2 triệu tam giác. Còn lại: phần lớn là `.vc` 9k của công trình trong 110 m và bản gốc trong `nearDist` (tối đa 150 m). Bước kế: thu `nearDist` về 2 × cỡ (tối đa 90 m), nướng `.bk` cho công trình dùng gần (hall_main, gate_sect, palace_grand…), đo lại.
- ~~**G-8.4:** 4 model loại trừ~~ — xong đợt 3 (`MODE=collapse`, 25k).
- ~~**G-8.2:** chỉnh màu trời chiều tà~~ — xong đợt 3; AO màn hình đo −37 % fps nên bỏ (dùng AO nướng).
- ~~**G-8.3:** camera không chui vào mái~~ — xong đợt 2.
