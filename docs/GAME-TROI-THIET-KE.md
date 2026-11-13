# QUẬN ĐẢO BAY «THIÊN BÀN» — thiết kế mở rộng diện tích trời ×50 (bản 2, sửa góp ý duyệt)

Ngày 2026-11-13 · Kiến trúc sư quận trời · mọi toạ độ đơn vị mét, gốc (0,0) = tâm Huyền Thành, **Bắc = −Z** (terrain.js:6).

Số liệu nền đã đối chiếu code (khảo sát + đọc lại nguồn trong phiên này — bản 2 bổ sung các dòng người duyệt chỉ ra):
- Đảo hiện tại: 1 SPOT đặt model `sky_palace` fit 240 m, đáy y 460, `solid:false`, KHÔNG nền đi được (landmarks.js:182-185; terrain.js:69 `SKY_ISLAND y:520`, đặt tại `y−60`).
- Nền cao: `addPlatform(x,z,w,d,ry,top,bot)` (obstacles.js:93), `platformTop(x,z,y)` bỏ nền có `bot` cao hơn đầu (`y < r.bot−0.3`, obstacles.js:151-161); `motion.groundHeight` (motion.js:28-32) và `surfaceAt` (motion.js:46-56) truyền y → đi/đáp nền 460 chạy được (người duyệt đã chạy node CASE2/CASE3 xác nhận: tp `y3=null` đáp đúng 460, đi trên nền giữ y).
- **Mọi nơi gọi `world.groundY` trong render3d.js đều 2D và sẽ sai dưới đảo** (world3d.js:379 không truyền y): :913 avatar bay · :962 vòng số phận · :964 bảng hiệu việc · :1011 nhãn trạm · :1012 dấu bàn · **:1055-1056 camera clamp** · :1340 avatar người khác · :1352 vòng đích · :1410 tên người khác. Đặc biệt **:1055-1056**: `floorY = groundY+0.6; if (camera.y < floorY) camera.y = floorY` — SPAWN (3, 43) (court.js:109) nằm trọn trong footprint đảo chủ → không vá thì **mọi người mới vào game bị kẹp camera lên y 460,6**.
- **Bay không thể lên đảo và hạ không đúng chỗ bằng cơ chế hiện có** (người duyệt chạy `node _skytest.mjs`: bay từ đất tới đảo rồi hạ → `y3 = 0.0`): khi bay `freeStep` bị bỏ qua (main.js:1250), `setFlying(false)` (main.js:559-577) chỉ `alt = 0`, không bao giờ gộp `alt` vào `phys.y3` → không có dòng nào gọi `platformTop(x, z, y≈402–420)`.
- **Station/door/spot thuần 2D**: `nearestStation` (world.js:320-325) và `openSpotNear` (rooms.js:74-81) chỉ đo `Math.hypot(x,z)` → người trên đảo đi qua (x,z) trùng station/bảng/cửa dưới đất sẽ mở nhầm, ngược lại người dưới đảo chạm spot 'down'. Heaven không gặp vì nằm riêng dải ROOM_X0+1300 (heaven.js:15).
- Nơi khởi tạo `phys.y3 = null`: main.js:831 (placeAt), :1003, :1160 (reset về START = spawn dưới đảo!), :1178 — null-init gọi `groundHeight(x,z)` không y → dưới đảo sẽ nhảy lên 460.
- Hiệu năng: LOD near/far/vc2 (assets.js:113-115), `cullDist(v≥40)=Infinity` (:116), `instanceModel` (:223) cut theo hướng nhìn (:256), >4 bản không nâng .bk (:257); bóng sun ±45 m/far 400 (render3d.js:200) → đảo không đổ bóng xuống đất; sương 190–1700 m (render3d.js:141); LOAD_R 1500 (landmarks.js:377); Sơn Môn 3,84 tr/678 lệnh (DOHOA-MANIFEST:104). Tile tp xa nhất x≈872 < WORLD_TILES (protocol.js:50).

---

## 1. LAYOUT — 9 đảo, 4 cầu vân

### 1.1 Bảng đảo (thay `SKY_ISLAND` terrain.js:69 bằng bảng `SKY_DISTRICT`)

**Tất cả 9 đảo cùng cao độ mặt nền y = 460** (quyết định bản 2 — xem §6.4): thống nhất trần bay giữa các đảo, không cần nâng trần, không cần cơ chế hạ đặc biệt. Sự đa dạng chiều cao làm bằng khối cảnh (đỉnh tháp, núi đá trang trí), không làm bằng mặt nền.

| # | id | Tên | x | z | y nền | R nền đi được | Nền đặt | Công trình trên đảo |
|---|---|---|---|---|---|---|---|---|
| 1 | `thienban` | Thiên Bàn Đảo (CHỦ) | 0 | 0 | 460 | 260 (Ø520) | `dao_vua` **s×2 = Ø520** đặt hero riêng (placeLod đủ bậc) | **sky_palace giữ nguyên làm tâm** (fit 240, đáy 460 như nay) + `nam_mon` mép nam + `dien_dai` (có cửa vào phòng) + 2 `tieu_quan` |
| 2 | `quanthinh` | Quan Tinh Đảo | 500 | −260 | 460 | 130 | `dao_vua` s 260 | `lau_cac` 3 tầng, nóc đặt armilla (từ `noi_that`) |
| 3 | `thudao` | Thư Đạo Đảo | −500 | −280 | 460 | 130 | `dao_vua` s 260 | `lau_cac` biến thể thư các s×0.8 + hồ mây có sẵn trong asset |
| 4 | `laungoc` | Lầu Ngọc Đảo | 20 | −640 | 460 | 130 | `dao_vua` s 260 | 2 `lau_cac` song sinh (penthouse) |
| 5 | `thiendan` | Thiên Đàn Đảo | −40 | 640 | 460 | 130 | `dao_vua` s 260 | `thien_dan` đài tròn + thông cổ |
| 6 | `thienquan` | Thiền Quán Đảo | −640 | 420 | 460 | 130 | `dao_vua` s 260 | 3 `tieu_quan` biến thể thảo lư mái tranh |
| 7 | `ansi` | Ứn Sĩ Đảo | 640 | 420 | 460 | 90 | `dao_vua` s 182 | 1 thảo lư + tùng–trúc + núi đá trang trí cao 30 m (drama chiều cao, KHÔNG phải mặt nền) |
| 8 | `duocvien` | Dược Viên Đảo | 1290 | 60 | 460 | 90 | `dao_vua` s 182 | vườn dược + 1 `tieu_quan` |
| 9 | `vancanh` | Vân Cảnh Đảo | −1290 | 60 | 460 | 90 | `dao_vua` s 182 | đình tròn nhỏ + đào tiên |

Trục +Z = Nam (cổng + điểm tp, cùng quy ước Nam Thiên Môn heaven.js:55). Cặp tâm gần nhất `thienban–quanthinh` = **563,6 m** → không đảo nào trùng (x,z) (ràng buộc net.teleport 2D + platformTop một-max-một-ô). Cách Cửu Trọng Thiên (5646, 1300) 4.810 m; xa nhất |x| 1380, |z| 730 — trong EDGE 3800 (terrain.js:20); tile tp xa nhất x ≈ 872, y ≈ 463 — trong WORLD_TILES (protocol.js:50, đã tính).

### 1.2 Cầu vân (đi bộ, y 460, rộng 5 m, cấu kiện 40 m — asset `cau_van` lắp lặp)

| Cầu | Đoạn | khoảng tâm | hở mép | cấu kiện | dài sàn |
|---|---|---|---|---|---|
| B1 | thienban → quanthinh | 563,6 | 173,6 | 5 | 200 m |
| B2 | thienban → thudao | 573,1 | 183,1 | 5 | 200 m |
| B3 | thienban → laungoc | 640,3 | 250,3 | 7 | 280 m |
| B4 | thienban → thiendan | 641,2 | 251,2 | 7 | 280 m |

Công thức lắp: A = tâm_chủ + u·(R_chủ−8), B = tâm_đảo + (−u)·(R_đảo−8), u = (B−A)/‖B−A‖; cấu kiện k tại A + u·(40k+20), `ry = atan2(ux, uz)`; nền mỗi cấu kiện `addPlatform(x, z, 5, 40, ry, 460, 457)` (bot 457 → bay dưới cầu không bị nhấc). Cầu dài có 1–2 «đều mây» đá nổi trang trí (pattern heaven3d.js:111).

### 1.3 Nền BÁT GIÁC nội tiếp, không phải vuông (sửa Gạch 4)

`addPlatform` lưu hình chữ nhật (obstacles.js:94) — nền `2R×2R` vuông sẽ nhô 4 góc ra ngoài đĩa đảo (góc cách tâm 367,7 m khi R 260 → đi trên không ~107 m). **Mỗi đảo = 2 lệnh addPlatform tạo bát giác đều nội tiếp đường tròn R:**
```
addPlatform(x, z, R*Math.SQRT2, R*Math.SQRT2, 0,        460, 455); // vuông dọc trục
addPlatform(x, z, R*Math.SQRT2, R*Math.SQRT2, Math.PI/4, 460, 455); // vuông xoay 45°
```
Hai hình vuông cạnh √2·R (đã kiểm node): đỉnh xa nhất cách đúng R ≤ bán kính đĩa; hợp lại = bát giác đều **90,0% diện tích đĩa** (phần vành 0,076·R ≈ 20 m với R 260 không đi được — assets chắn bằng lan can/vườn raised bed). Hai rect chồng nhau cùng top 460 → platformTop lấy max, không xung đột.

### 1.4 Phép tính diện tích (node, bát giác footprint — số liệu đã chạy lại bản 2)

- **Diện tích trải quận (bao lồi 9 nền bát giác) = 2.361.388 m² ≈ 2,361 km² = ×52,5** so với 45.000 m² của đảo hôm nay → **đạt ≥ 2,2 km² (×50)**. Hộp bao x −1380…1380, z −730…730.
- Σ mặt nền đi được (bát giác 90% đĩa) = 498.935 m² + cầu (200+200+280+280)×5 = **4.800 m²** → tổng **503.735 m² ≈ 0,50 km² (×11,2)**. (Nếu đo theo đĩa model: 554.177 m².)
- Ghi thẳng: 9 đảo đúng cỡ yêu cầu không thể đạt 2,25 km² nếu tính tổng mặt phiến (trần lý thuyết ~0,97 km²) — ×50 hiểu theo **diện tích trải quận**, hai số đều công khai.
- **Che khu vực sinh hoạt mặt đất:** đảo chủ đã treo trên sân quán từ trước (giữ nguyên vị trí); SPAWN (3,43) court.js:109 nằm ngay dưới footprint đảo chủ → mọi vá groundY ở §5.4 là **điều kiện chơi được của game**, không phải tuỳ chọn. Đảo không đổ bóng xuống đất (bóng ±45 m, render3d.js:200); đi bộ dưới đảo không bị chặn sau các vá (a)(c)(g).

## 2. ASSETS — 8 asset Blender (bản 2: gộp `dao_lLon` vào `dao_vua` ×2, sửa Gạch 7)

`dao_vua` Ø260 × dày 60 phóng **s×2 = Ø520 × dày 120** đúng kích thước đảo chủ — scale-reuse đã tự chứng minh (dùng s×0.7 cho đảo 90 m; `instanceModel` nhận `s`, assets.js:223). UV theo mét nên mật độ chất liệu không đổi khi phóng. Đảo chủ đặt **riêng bằng placeLod** (1 bản hero, đủ bậc .hd/.glb/.vc, assets.js:118), 8 đảo còn lại một nhóm `instanceModel`.

Tổng bản giữa = **251.000 ≤ 700.000** (50+65+45+28+18+7+16+22). Pack tự sinh .hd 300k / .lod 12k. Quy ước chung: gốc model = đáy chạm mặt nền (placeModel tự đặt, assets.js:98); gộp ≤4 nhóm vật liệu; chi tiết nhỏ nhất 8 cm; UV theo mét (ô 2–4 m) như heaven3d.js:98.

### 2.1 `dao_vua` — Đảo nền (platform) — Ø260×60, s×0.7→Ø182, s×2→Ø520 — 50.000 tri
Đĩa đảo, gốc local y0 = MẶT SÂN, đáy chôn −60 (×2 → −120). Mặt trên chia vòng: (1) sân trung tâm cẩm thạch trắng Ø95 (Ø520: Ø190 quanh sky_palace) lát ô 4 m, viền lan can đá trụ mỗi 3 m, chừa 2 miệng cầu 6 m (đảo vành trong chừa 4); (2) vành vườn: cỏ + luống dược + lối đá 3 m + 1 hồ mây Ø18 (đĩa căng #dfe8f2 opacity 0,55 phát sáng nhẹ #cfe0ff×0,3 + viền đá) + 4–6 vị trí phẳng 14×10 m cho villa; (3) gờ mép đá 1 m. Đáy đá: viết lại công thức `rockUnder` heaven3d.js:29-47 bằng Python (Cylinder 28×7, siêu-elip vuông ở miệng → tròn dần, nhiễu góc 0,82±0,32, thuôn sâu bằng max(hw,hd)×0,45, rêu 12% đỉnh) — ~28 mảng ~450 tri (×2 → ~56 mảng lớn hơn tự nhiên vì seed thay đổi, vẫn trong 50k). Chất liệu: đá #8a8172→#5f584e vertex-color, rêu #6f9a58, sân #ece7da, cỏ #86b46c. Script Python tham số seed theo đảo. Gộp 3 mesh: sân+vườn+hồ / đáy đá / lan can.

### 2.2 `dien_dai` — Đại sảnh 9 gian (villa) — 40×22×17 — 65.000 tri
THÂN 36×18 m, minh gian 4,4 m rộng nhất hẹp dần hai bên (tỉ lệ gian thật); 12 cột hiên + 20 cột trong đỏ chu sa #9c2318 Ø0,42×4,5 m (≈10× đường kính), chân tảng đá trắng; tường hồi gạch sơn son #7a1c14; khung cửa mở xuyên 3 gian giữa (lỗ 10×4 m nhìn xuyên thấy đạo cụ). DOUGONG đơn giản hoá: vành 24 cụm chồng đấu 2 tầng (~60 tri/cụm). MÁI chồng diêm 2 tầng dốc 28°: hạ 27×13 @ 8 m, thượng 15×9 @ 12 m, mép vươn 0,9 m (=1/5 cột) cong Bezier, ridges 5 pleat, đỉnh hiểm + 2 rồng chầu lưới 12 cạnh. ĐÀI 2 tầng đá trắng: 40×22, tầng 1 cao 2 m, tầng 2 cao 1,5 m thu 12%, bậc chính diện 9 bậc rộng 10 m, lan can trụ mỗi 3 m. Ngói lưu li VÀNG #d9a441 (metalness 0,4), đá trắng #ece7da, viền đồng #c9963c. 4 mesh: đài / thân+cột / mái / lan can.

### 2.3 `lau_cac` — Lầu các 3 tầng (villa) — 17×17×27, biến thể s×0.8 = 21,6 m — 45.000 tri
3 tầng vuông thu 12%/tầng: T1 17×17 sảnh 4,5 m, T2 14,5, T3 12; mỗi tầng = hành lang bao 2 m (sàn ván nhô + lan can ngọc trụ 2,5 m) + khung cửa liền bức 12 ô/cạnh (lưới gỗ mờ #2a1712) + mái riêng 4 mặt dốc 30° cong riềm răng cưa; chóp 3 m + Hồ lô; tổng 3×(4,5+2,6)+3 ≈ 27 m. Biến thể bằng vật liệu lúc đặt (không ra file riêng): (a) quan tinh — nóc T3 MỞ chừa bệ Ø5 đặt armilla, ngói XANH #2e6b6e; (b) thư các s×0.8 ngói sẫm #3a4448; (c) penthouse ngói xanh ngọc. Xà vẽ dân gian giản lược dải emissive #d9b04a. 3 mesh: khối tầng / mái / lan can.

### 2.4 `thien_dan` — Đài tế tròn (villa) — Ø38×12 — 28.000 tri
3 tầng đài cẩm thạch trắng đồng tâm (TRÒN = trời): T1 Ø38, T2 Ø30, T3 Ø22, mỗi tầng cao 2,2 m, lùi sân 2 m; bậc chính diện BẮC 9+9+9 bậc, thẻ đá khắc số 9; lan can trắng trụ 2,2 m, 4 cổng bậc 4 hướng. Nóc T3: điện tròn Ø12 không dầm — 12 cột đỏ, mái lưu li xanh thẫm #1f5a55 3 tầng chồng thu 20% + chóp cầu ngọc. Sàn khắc 9 vòng đồng kềm emissive nhẹ #c9963c. 3 mesh: đài / điện / mái.

### 2.5 `tieu_quan` — Tiểu quán 3 gian (villa) — 13×8×6 — 18.000 tri
3 gian × 5架 đúng luật nhà ở Minh–Thanh (KHÔNG dougong, KHÔNG lưu li): mặt tiền 4,2+4,4+4,2 m, sâu 7,5 m; 6 cột hiên đỏ Ø0,3×3,2 m (=4/5 gian giữa); tường whitewash #b8b2a6, mặt trước mở (3 cánh lattice gỗ mờ). Mái dốc 30° hai lớp ngói xám #6b6560, vươn mép 0,64 m, bờ nóc con triện. Biến thể ỨN SĨ THẢO LƯ (đổi vật liệu lúc đặt): mái tranh #a98d54 sợi dọc + khung gỗ lộ #7d5f43 + tường tre đan + sàn nhô hiên 1,2 m nhìn ra vách đá. 2 mesh: thân / mái. Nhân bản nhiều nhất (6 bản).

### 2.6 `cau_van` — Cầu vân (bridge) — 40×5×1,2/cấu kiện — 7.000 tri
Sàn 8 tấm ván mây so le #d8cdb4 võng 0,5 m parabol; lan can ngọc hai bên: trụ chai 1,1 m mỗi 2,5 m + tay vịn ống #ece7da; dưới sàn 2 xà gỗ + 3 vòm bán nguyệt 5 thanh cong (kiểu dầm treo chùa Treo); 2 đầu mỏ mây #f4f1e8 alpha 0,9; 2 đèn lồng treo emissive #ffd27a×0,8. 2 mesh: sàn+xà+đèn / lan can. Đặt lặp 24 lần bằng instanceModel.

### 2.7 `nam_mon` — Cổng Nam Môn quận (gate) — 26×8×12 — 16.000 tri
5 gian rộng 26 m, lối xuyên giữa 6 m (khớp corridor() landmarks.js:47 hw 3): 6 cột đỏ Ø0,5×6 m trên đài trắng 1,8 m; 2 lầu canh 4×4×7 hai tầng mái xanh; thân giữa 2 tầng — dưới xuyên lòng, trên gác chuông khung mở; mái VÀNG 2 tầng chồng dốc 30°, bờ nóc 2 cánh phượng; bảng giữa để trống cho plaque runtime (heaven3d.js:198) vẽ «Nam Môn»; 2 cột đèn đồng 3 m. 3 mesh: đài+cột / thân+lầu / mái. Đặt (0, 225, y460) ry 0.

### 2.8 `noi_that` — Bộ đạo cụ nội thất (interior) — 22.000 tri
~12 đạo cụ, mỗi món 1 collection đặt tên (thợ game instance chọn theo sảnh): (1) án thư 2,2×0,7×1,05 gỗ sơn đen #1f1a14 + tứ bảo: nghiên đen, bút ống tre, thẻ sách, ấn đỏ, trấn chỉ đồng (món nhỏ = hộp/cylinder 40–90 tri, không tách <3 cm); (2) lư bạc sơn Ø0,8 + nón núi 3 hàng lỗ (lỗ boolean emit #ffb35c làm khói sáng), đế 3 chân co, đồng #8a6a2f khảm vàng; (3) bình phong 6 cánh 3,0×2,2: khung đỏ, mặt lụa 2 texture canvas 512 (rồng vàng / sơn thủy); (4) armilla Ø1,8: 4 vòng đồng đồng tâm + trục nghiêng 23,5° + bàn đá 8 cạnh; (5) bồ đoàn Ø0,6×0,15 ×6; (6) hạc đồng ×2; (7) đèn lồng lụa 3 cỡ; (8) scholar's rock Ø0,5 + chõ 3 nhánh; (9) khay quỳ + giá cuộn thư. ≤12 mesh cả bộ.

### 2.9 Ước lượng tải màn hình (đứng tâm đảo chủ quay 360°)
đảo chủ hero ~50k + sky_palace ~80k + 8 đảo .vc ~12k×8 = 96k + 12 villa .vc ~10k×12 = 120k + cổng .bk 12k + 24 cấu kiện .vc2 ~2,5k×24 = 60k + đạo cụ 22k ≈ **440k tr, ~35–40 lệnh vẽ nhóm quận** (≈11% mức Sơn Môn 3,84 tr).

## 3. ACCESS — lên quận & di chuyển giữa đảo

- **Lên (duy nhất, mọi người chơi):** spot «Vân Thang» trong sân quán — ứng viên ô (−72, −18), **DÒ ô trống bằng lưới va chạm trước khi chốt** (bài học Thiên Thê heaven.js:19-21). Handler main.js nhánh `room === 'sky'` copy pattern :450-453: id 'up' → `rideTo(0, 205)` — cách cổng ≥ 20 m (bài học camera lọt cột heaven.js:53-55) → `placeAt` tới (0, 205) **kèm targetY 460** (xem §5.6). **Không có lối bay từ đất lên đảo**: trần bay từ đất = 420 < bot nền 455 — đây là giới hạn cơ chế (main.js:1258 giữ nguyên toàn cục), như Cửu Trọng Thiên cũng chỉ lên bằng thang mây.
- **Xuống:** spot 'down' trước Nam Môn (0, 245, y460) → `placeAt` về sân, targetY = terrain.
- **Giữa đảo:** 4 cầu vân đi bộ (B1–B4, cùng y 460) + **ngự kiếm tự do**: cất cánh từ bất kỳ đảo nào (groundY 460 → trần 880), bay sang đảo khác rồi hạ — hoạt động sau vá y3-đồng-bộ (§5.5): tắt bay giữa trời trên đảo B, `y3` đã được đồng bộ theo độ cao bay thật → rơi đáp nền 460. Bay ra ngoài đảo về mặt đất: hạ dần rồi tắt bay, rơi từ đúng độ cao hiện tại (không còn bug rơi từ 460).

## 4. INTERIOR — chốt 1 cách

**Room scene kiểu `interior.js` (bước vào cửa station kind 'door' → chuyển phòng dải ROOM_X0) cho MỌI biệt thự.** Sàn đi được + `addBlock` + đèn room + station cửa sẵn có (interior.js:5-6; main.js:442 `enterRoom`); model villa chỉ dựng vỏ + ô cửa; 0 tam giác nội thất cho hàng chục villa. Bộ `noi_that` Blender chỉ đặt **3 sảnh mở chủ lực**: Đại Sảnh đảo chủ (án thư + lư + bình phong sau ngai), đài quan tinh (bàn + armilla), Thiên Đàn (bồ đoàn ×6 + đỉnh trầm) — `instanceModel` + 1 `addBlock`/nhóm.

Đạo cụ đầy đủ: án thư + tứ bảo (bút–mực–giấy–nghiên, ống bút tre, ấn + khay giấy, trấn chỉ), bình gốm + giá cuộn thư, bàn bình phong nhỏ; lư bạc sơn + đỉnh đồng khảm vàng; bồ đoàn ×6; bình phong 6 cánh (rồng / sơn thủy); armilla + mặt trời đồng + tinh đồ; hạc đồng ×2, đèn lồng 3 cỡ, scholar's rock + chõ, khay quỳ.

## 5. WIRING NOTES — dặn thợ game (làm theo thứ tự; (4)–(7) là điều kiện chơi được)

1. **terrain.js:69** — thay const bằng bảng `SKY_DISTRICT` (9 dòng §1.1: id, name, x, z, y=460, R); giữ `export const SKY_ISLAND = SKY_DISTRICT[0]` cho tham chiếu cũ. Nguồn toạ độ DUY NHẤT cho cảnh + nền + nhãn.
2. **landmarks.js:182-185** — vòng for mỗi đảo 1 SPOT (`at:[x,z]`, `noMerge` vì chứa InstancedMesh, landmarks.js:394): đảo chủ đặt `dao_vua` **fit width 520 qua placeLod** (assets.js:118, hero 1 bản đủ bậc); 8 đảo kia MỘT nhóm `instanceModel('dao_vua', items)` với `s` = 260 (×5) / 182 (×3), `at.y = 460`, `solid:false`, KHÔNG addFootprint. SPOT sky_palace giữ nguyên dòng 184. Villas/cầu/đạo cụ lặp lại qua `instanceModel`, tuyệt đối không `placeModel` từng bản.
3. **registerSkyDistrict()** (pattern `registerHeaven` render3d.js:690, gọi lúc dựng cảnh): mỗi đảo **2 lệnh nền bát giác** §1.3 `addPlatform(x, z, R√2, R√2, 0, 460, 455)` + `(..., Math.PI/4, 460, 455)`; cầu §1.2 mỗi cấu kiện `addPlatform(x, z, 5, 40, ry, 460, 457)`. KHÔNG sửa obstacles.js.
4. **VÁ (a) — groundY y-aware, ÁP DỤNG CHO TẤT CẢ 9 CHỖ GỌI trong render3d.js** (world3d.js:379 đổi thành `groundY(x, z, y = null) → platformTop(x, z, y)`):
   - :913 avatar bay — truyền y = độ cao thế giới bay hiện tại (giữ biến riêng, tính = groundY lần trước + alt);
   - **:1055-1056 camera clamp — TRUYỀN y = camera.position.y − 0.7** (clamp mục tiêu ngay dưới camera; không vá = SPAWN (3,43) bị kẹp y 460,6);
   - :1340 + :1410 avatar/tên người khác — probe y = heightAt(x,z) + (o.a||0) + 0,5 (đi bộ dưới đảo probe ≈ terrain → nền bị bỏ qua; bay cao thì nền tính);
   - :962 vòng số phận, :964 bảng hiệu, :1012 dấu bàn, :1352 vòng đích — probe y = heightAt(x,z)+1 (vật mặt đất);
   - :1011 nhãn — dùng `st.world.y ?? groundY(probe terrain)`, trạm đảo khai `world.y = 460`.
5. **VÁ bay/y3-đồng-bộ (sửa Gạch 2):** main.js:1256-1259 nhánh bay thêm mỗi bước: `if (player.phys) player.phys.y3 = world.groundY(w.x, w.z, player.phys.y3 ?? undefined) + player.alt;` (sau khi (a) đã vá). Nhờ vậy tắt bay giữa trời: freeStep chạy tiếp với y3 đúng độ cao thật → đáp nền đảo (y3 ≥ 454,7 → nền tính) hoặc rơi đúng từ độ cao về terrain. KHÔNG sửa trần 420.
6. **VÁ khởi tạo y3 (cùng họ Gạch 2):** mọi chỗ `phys.y3 = null` (main.js:831, :1003, :1160 = reset SPAWN, :1178) — `placeAt(p, label, sub, targetY)` nhận targetY tường minh: tp lên đảo truyền 460; tp mặt đất/spawn mặc định `y3 = groundHeight(x, z, T.heightAt(x,z)+1)` (terrain probe, không null-init dưới đảo).
7. **VÁ station/door/spot theo tầng (sửa Gạch 3):** station/spot/door khai thêm `floorY` (mặc định groundY 2D tại trạm — hành vi cũ); `nearestStation` (world.js:320-325), `openSpotNear` (rooms.js:74-81), `doorNear` chỉ match khi `|playerWorldY − floorY| < 30` (playerWorldY = phys.y3 khi đi bộ, groundY+alt khi bay). Trạm quán/bảng việc/cửa nhà phố dưới đảo chủ được floorY≈terrain → người trên đảo (y460) không mở nhầm; spot 'down' floorY 460 → người dưới sân không dính.
8. **Lối lên:** `setOpenSpots('sky', [up: (−72,−18) dò ô trống, down: (0,245)])` theo heaven.js:69-72; main.js:450-453 thêm nhánh `room==='sky'` (up → rideTo(0,205) + placeAt targetY 460; down → placeAt về START targetY terrain). Cửa biệt thự = station kind 'door' (main.js:442) + floorY 460, phòng đăng ký pattern halls.js/interior.js.
9. **LOD/nạp:** LOAD_R 1500 (landmarks.js:377) > bán kính quận 1380 → đứng sân nạp đủ 9 SPOT — mọi asset PHẢI có bậc .vc/.vc2 (pack sinh); nhóm 8 đảo >4 bản ở bậc xa ~12k/bản (assets.js:257) — chấp nhận. Đích đo: ≤800k tr + ≤60 lệnh vẽ nhóm quận tại tâm đảo chủ (`window.__hq.renderer.webgl`, pattern DOHOA-MANIFEST:119).
10. **Sương/neo sáng:** sương 190–1700 (render3d.js:141) mờ đảo 1290 m — mỗi đảo ngoài + đầu cầu 1–2 `addLight` '#ffb35c' (pattern landmarks.js:223) + cột sáng heaven3d.js:60-64.
11. **Bóng:** không chỉnh — sun ±45 m/far 400 (render3d.js:200) nên đảo không đổ bóng xuống đất.
12. **Checklist chạy thật trước nhận (mở rộng theo 3 gạch chặn):** (i) spawn (3,43) camera KHÔNG bị kẹp 460,6, nhìn lên thấy đảo; (ii) đứng dưới đảo chủ: không mở bảng quán/cửa nhà, avatar người khác render ở terrain; (iii) bay dưới đảo y<400 không bị nhấc; (iv) bay đảo A → đảo B tắt bay giữa trời: đáp nền 460 không rơi xuống đất; (v) bay đảo → ra sân: tắt bay rơi từ đúng độ cao; (vi) tp Vân Thang đáp (0,205) y460, camera không lọt cột; (vii) đi 4 góc mép mỗi đảo không «đi trên không» ngoài vành (bát giác §1.3); (viii) đo tri/draw tâm đảo chủ đạt đích §9.

## 6. DECISIONS (bản 2)

1. **Giữ sky_palace làm tâm đảo chủ** — SPOT landmarks.js:184 giữ nguyên fit 240 đáy 460; đảo chủ Ø520 ôm quanh.
2. **Ngói theo đẳng cấp thật:** VÀNG lưu li = sky_palace + dien_dai + nam_mon; XANH lưu li = lau_cac + thien_dan; tieu_quan ngói xám + biến thể tranh; cột đỏ chu sa; đài/lan can cẩm thạch trắng; đồng dát vàng.
3. **×50 theo diện tích trải quận** (bao lồi nền bát giác 2,361 km² = ×52,5, node §1.4); Σ nền đi được 0,50 km² (×11,2) công khai — 9 đảo đúng cỡ không thể đạt 2,25 km² mặt phiến, ghi rõ thay vì giả số.
4. **Tất cả 9 đảo cùng mặt nền y 460** (bản 1 từng để 405/510 — bỏ: cơ chế bay hiện có không hạ đúng chỗ, người duyệt chạy node chứng minh `y3=0.0`). Chiều cao kịch tính làm bằng khối cảnh. Lên quận duy nhất bằng Vân Thang tp; KHÔNG nâng trần bay toàn cục (main.js:1258).
5. **Nền = bát giác nội tiếp 2×addPlatform/đảo** (bản 1 ghi vuông 2R×2R — sai, góc nhô 107 m ngoài đĩa); cầu bot 457.
6. **6 vá bắt buộc trước khi mở** (§5.4-5.7): groundY y-aware cho 9 chỗ gọi render3d (gồm camera clamp :1055), đồng bộ y3 khi bay, placeAt/spawn targetY, cổng tầng cho station/door/spot. Không vá = spawn gãy / mở bảng nhầm / hạ bay sai tầng.
7. **Interior: room scene kiểu interior.js cho mọi biệt thự**; bộ đạo cụ Blender chỉ 3 sảnh mở chủ lực.
8. **8 asset = 1 nền đảo (×3 tỉ lệ 0,7/1/2) + 4 villa + 1 cầu + 1 cổng + 1 đạo cụ**, tổng bản giữa 251k ≤ 700k (bản 1 có dao_lLon riêng — thừa, gộp vào dao_vua s×2 đặt hero bằng placeLod).
9. **Thủ tục Blender Python** (rockUnder theo công thức heaven3d.js:29-47, seed cố định) — không Meshy, không credit; mỗi asset 1 thư mục, gộp ≤4 mesh/vật liệu; hướng chi tiết dựng đầy đủ nằm ngay §2 doc (không tham chiếu JSON ngoài repo).
