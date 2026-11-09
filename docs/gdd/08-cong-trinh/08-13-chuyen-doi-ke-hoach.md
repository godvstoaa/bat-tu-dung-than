# 08-13 · Chuyển đổi: từ phòng ngoài bản đồ sang nội thất tại chỗ — giai đoạn, danh sách việc, ước lượng

> Kế hoạch đưa game từ hiện trạng (6 phòng ngoài bản đồ `world.js › ROOMS` + ~110 vỏ khối liền) tới trạng thái «mọi công trình trong tầm đi bộ đều vào được» mà **không lúc nào làm hỏng bản đang chạy** (web + iOS + MMO). Mã việc dùng số thứ tự cục bộ `V<giai đoạn>.<số>`; tài liệu 13 có thể gán `TASK-xxx` sau.

---

## 1. Nguyên tắc chuyển đổi

1. **Song song, có cờ.** `features.js` thêm `FEATURES.inplace = new Set([...INT id đã xong])`. Công trình **chưa** trong tập → chạy như hiện nay (phòng ngoài bản đồ nếu có, vỏ khối liền nếu không). Bật từng công trình, không bật cả loạt.
2. **Một lần giải thể một phòng.** Mỗi phòng `ROOMS` chỉ bị xóa khỏi mảng **sau** khi công trình thay thế qua đủ bốn cửa nghiệm thu (08-12) và một vòng phát hành có số liệu kẹt = 0 trong 7 ngày.
3. **Giữ id trạm.** `van0…van8`, `vanbia`, `thaitue`, `que`, `thay`, `tra`… giữ nguyên id → lưu (`stationsVisited`, `grantDaily`) và thành tựu không vỡ.
4. **Va chạm trước, hình sau.** Va chạm nướng (`col.json`) và test Node đi trước nội thất hình ảnh: công trình có thể «vào được với lớp lót trơn» trước khi có đồ đạc đẹp — nhưng **không bật cờ** cho người chơi tới khi đủ DoD.
5. **Không có «tạm làm màu».** Trong lúc chờ, công trình chưa thật hóa nằm ở trạng thái hiện nay (đúng như bây giờ). Không thêm cửa vẽ mới, không thêm công trình mới vào tầm đi bộ nếu chưa thật hóa được (luật cho tài liệu 07).

### 1.1 Chính sách «đang trùng tu» (tùy chọn, có thời hạn)

Một công trình đã **mở lối** (cửa thật, khoang có va chạm) nhưng nội thất chưa đủ DoD có thể bật dưới dạng **công trường trùng tu**: giàn giáo tre ngoài mặt tiền, cửa hé, bên trong lớp lót trơn + đồ đạc phủ vải + 1 NPC thợ («Điện đang trùng tu, mời khách xem tạm»). Đây là **khoang có lý do trong thế giới** (08-01 §1.3), không phải vỏ giả. Giới hạn: tối đa **một mốc** (M) cho mỗi công trình, tối đa 4 công trình cùng lúc.

---

## 2. Giai đoạn

| Giai đoạn | Nội dung | Điều kiện ra | Ước lượng |
|---|---|---|---|
| **P0 · Nền móng** | va chạm tầng, nướng va chạm, sổ công trình, khoang – cửa nhìn, cửa thật, bộ mô-đun, camera / mờ / đèn / âm trong nhà, A* phân cấp, giao thức `l` / `ix`, test harness | test cũ xanh; `test-game-buildings` chạy với **một công trình mẫu** (lầu trống) ở chế độ cờ tắt | 70 ngày |
| **P1 · Thí điểm** | vỏ `hall_main` khoét chung; Thái Tuế Điện, Vận Mệnh Các tại chỗ; giải thể `ROOMS › thaitue`, `vanmenh`; lầu chuông + lầu trống (gói `ix`) | 4 công trình đạt DoD; số liệu kẹt 0 trong 7 ngày | 30 ngày (+ bộ BAC, KT phần cần dùng) |
| **P2 · Sơn Môn** | Chính Đường 2 tầng, 4 tháp (dời), Sơn Môn, Hậu Môn, Tàng Y Các, trạm sân, Thiên Bảng | 100 % công trình Sơn Môn đạt DoD | 57 ngày |
| **P3 · Hậu Sơn** | sửa `palaceComplex` / `terrace` chung; Chính Điện Tam Thanh; điện phụ; tháp; giải thể `ROOMS › chinhdien` | như trên | 43 ngày |
| **P4 · Huyền Thành** | thành môn, 36 nhà (vỏ chung + 4 kiểu + sinh gia đình + án tại nhà), sạp (dời), bài phường, Văn Phong Tháp, Du Phương Lâu | như trên | 72 ngày |
| **P5 · Vùng** | 8 sảnh; Tử Bình (giải thể `laoquan`), Manh, Trích Thiên (giải thể `daumau`), Cùng Thông, Thư Lâu (giải thể `vanxuong`), Phong Thủy, Lịch Đường, Lưng Chừng Quán, 7 cổng, cầu | `ROOMS` rỗng | 278 ngày |
| **P6 · Đánh bóng** | hiệu năng (KTX2 tùy chọn), duyệt art lượt cuối, bộ ảnh, iOS, âm | cổng hồi quy hiệu năng xanh | 20 ngày |
| **P7 · Dọn** | xóa `ROOMS` và nhánh `door` / `exit` trong `main.js › enterRoom`; `interior.js` chỉ còn bộ lắp đặc biệt; thu `WORLD_TILES.maxX` về `10 + 640`; xóa `roomAt` | không còn tham chiếu `ROOMS` | 4 ngày |

Bộ mô-đun sản xuất xen trong P0–P5: KT (6), BAC (18), DAN (12), NHO (12), GNA (14) = **62 ngày**. Bốn bộ VIE / TAN / MIE / AMT làm theo lịch thánh địa (tài liệu 07, mốc M2–M5): 4 × 14 = **56 ngày**, không tính vào chuyển đổi công trình đang có.

**Tổng chuyển đổi công trình đang có ≈ 70 + 30 + 57 + 43 + 72 + 278 + 20 + 4 + 62 ≈ 636 ngày người.**

### 2.1 Khớp lộ trình tài liệu tổng (§13.4)

Tài liệu tổng đặt «thật hóa nội thất các công trình Sơn Môn» vào **M1 (4 tuần)**. Với ước lượng trên, M1 bốn tuần chỉ đủ khi:

| Phương án | Người | Phạm vi M1 | Dời sang sau |
|---|---|---|---|
| **A (đề xuất)** | 2 lập trình runtime + 1 tech artist + 1 level designer (≈ 80 ngày người / 4 tuần) | P0 (rút gọn: chưa âm che, chưa KTX2) + P1 đủ | P2 Sơn Môn sang M2 cùng 3 thánh địa đầu |
| B | 4 runtime + 2 TA + 2 LD (≈ 160 / 4 tuần) | P0 + P1 + Chính Đường + lầu / tháp | cổng, Tàng Y Các, trạm sân sang M2 |
| C | giữ 4 tuần, giữ đội nhỏ | chỉ P0 | mọi công trình sang M2+ — **không khuyến nghị** (Luật số 1 bị hoãn cả mốc) |

Câu hỏi mở cho chủ dự án: chọn phương án (README).

### 2.2 Thứ tự ưu tiên trong P5

Theo **lượt người qua lại** (hub trước), rồi theo **phòng ngoài bản đồ còn lại**:

1. 8 sảnh nghề (7 ngày — rẻ, người chơi tới hằng ngày).
2. Thư Lâu (giải thể `vanxuong`) — vùng gần thành nhất phía Bắc.
3. Tử Bình (giải thể `laoquan`), Trích Thiên (giải thể `daumau`).
4. Cùng Thông, Phong Thủy, Lịch Đường, Manh.
5. Cổng tông môn, Lưng Chừng Quán, cầu.

---

## 3. Danh sách việc

### 3.1 P0 — Nền móng

| Mã | Việc | Tệp chạm | Ngày | Phụ thuộc |
|---|---|---|---|---|
| V0.1 | Tầng `lv` trong `obstacles.js`: khóa ô theo tầng, `addPlatform(..., { lv, stair, seg })`, `platformTop(x, z, lv, seg)`, `blockedByBuilding(x, z, lv)`; mặc định 0 → không đổi hành vi cũ | `obstacles.js` | 2 | — |
| V0.2 | `addBakedCells`, `setDynamicBlock`, `addStair`, hàm phụ test (`freeCellsIn`, `floodFill`, `sampleStair`…) | `obstacles.js` | 2 | V0.1 |
| V0.3 | `scripts/bld-void.mjs` (bản chính thức từ nguyên mẫu đo đã chạy), xuất `void.json` + ASCII | mới | 2 | — |
| V0.4 | Script Blender: `import.py`, `cut_door.py`, `hollow.py`, `export.py` | `scripts/bld/` mới | 5 | — |
| V0.5 | `bld-split.mjs`, `bld-pack.mjs` (3 lớp, 3 mức), `bld-bake.mjs` (`col.json` + hash) | mới | 5 | V0.1, V0.3 |
| V0.6 | `buildings.js`: sổ công trình, `registerShell`, đổi cục bộ ↔ thế giới, đẩy trạm vào `STATIONS`, `migrateLegacyPos`, `ROOMS_LEGACY` | mới + `world.js` | 4 | V0.1 |
| V0.7 | `cells.js`: tra khoang, ngưỡng có trễ, portal culling, nạp / dỡ theo bán kính, cắt lô 4 ms | mới | 7 | V0.6, V0.9 |
| V0.8 | `doors.js`: loại, trạng thái, lịch giờ can chi, tự mở, hoạt cảnh, chặn động, gõ cửa | mới | 5 | V0.2 |
| V0.9 | `kit.js`: nạp bộ, lắp mảnh (instancing + `mergeStatic` theo khoang), danh mục `kit/<bộ>.json` | mới | 4 | — |
| V0.10 | `render3d.js`: luật mờ mới (`applyFade`, `colorWrite` giữ bóng), bản rời nhà nhân bản | `render3d.js`, `assets.js` | 3 | V0.7 |
| V0.11 | `render3d.js`: camera trong nhà (TRONG / BỔ DỌC, kẹp, chuyển 0,6 s, ngước nhìn trần) | `render3d.js` | 4 | V0.7 |
| V0.12 | Pool đèn theo khoang + `addLight` mở rộng + phơi sáng / ánh nền trong nhà | `lights.js`, `render3d.js` | 3 | V0.7 |
| V0.13 | A* phân cấp: `findPath3`, A* mịn trong khoang, chọn điểm theo sàn có `lv`, bấm vỏ → cửa, gỡ kẹt | `world.js`, `main.js` | 6 | V0.6 |
| V0.14 | Âm: bus trong / ngoài, vang theo khoang, nền khoang, che âm qua cửa nhìn, bước chân, `creak` / `thump` | `audio.js` | 5 | V0.7 |
| V0.15 | Giao thức: `mv.l`, gói `ix`, `props` trong gói chào; khách + máy chủ | `protocol.js`, `net.js`, `worker/quan-room.js` | 4 | — |
| V0.16 | `state.js`: `s.int` (seen / flags / props / last), chuyển lưu cũ | `state.js` | 2 | V0.6 |
| V0.17 | `scripts/test-game-buildings.mjs` + sửa test cũ (08-12 §2.4) + thêm vào `test:game` | test | 5 | V0.1–V0.13 |
| V0.18 | Script chụp ảnh nghiệm thu (`?shots=`) | `main.js` / `render3d.js` | 2 | V0.11 |

### 3.2 P1 — Thí điểm

| Mã | Việc | Ngày |
|---|---|---|
| V1.1 | Khoét vỏ `hall_main` dùng chung (`_shared/hall_main-cut`) + `void.json` | 2 |
| V1.2 | Bộ KT (32 mảnh, phần lớn thủ tục) | 6 |
| V1.3 | Bộ BAC phần cần cho điện phụ / lầu (≈ 30 mảnh đầu) | 10 |
| V1.4 | INT-SM-DIENDONG (Thái Tuế Điện) — 08-07 §4 | 8 |
| V1.5 | INT-SM-DIENTAY (Vận Mệnh Các «Vòng Đời») — 08-07 §3 | 10 |
| V1.6 | INT-SM-LAUCHUONG + LAUTRONG (chuông, trống, gói `ix`) | 11,5 |
| V1.7 | Bật cờ, theo dõi 7 ngày, giải thể `ROOMS › thaitue`, `vanmenh` | 1 |

### 3.3 P2 – P5

Theo bảng tổng hợp cuối mỗi phần spec: Sơn Môn 08-08 §9, Huyền Thành 08-09 §11, Hậu Sơn + sảnh + vùng 1 08-10 §6, vùng 2 08-11 §9. Mỗi công trình là một gói việc gồm đủ: khoét → `void.json` → công thức → mảnh → trạm → NPC → nướng → test → ảnh → duyệt → bật cờ.


### 3.4 Lịch tuần P0 – P1 theo phương án A (2 runtime · 1 tech artist · 1 level designer)

| Tuần | Runtime 1 | Runtime 2 | Tech artist | Level designer |
|---|---|---|---|---|
| 1 | V0.1, V0.2 (tầng `lv`, nướng, chặn động) | V0.15 (giao thức `l`, `ix`) + V0.16 (`s.int`) | V0.3 (`bld-void` chính thức), đo lại 24 vỏ | sửa ngay 8 lỗi bố cục (§6) |
| 2 | V0.6 (`buildings.js`) + V0.13 phần A* mịn | V0.8 (`doors.js`) | V0.4 (Blender: import, cut_door) | `void.json` → chốt khoang Thái Tuế, Vận Mệnh, lầu chuông |
| 3 | V0.7 (`cells.js`: tra khoang, portal culling) | V0.9 (`kit.js`) + V0.12 (đèn) | V0.5 (`bld-split`, `bld-pack`, `bld-bake`); khoét `hall_main` dùng chung (V1.1) | dựng KT (V1.2) bằng trình đặt mảnh tạm |
| 4 | V0.10, V0.11 (mờ, camera) | V0.14 (âm, bản rút gọn) + V0.17 (test harness) | BAC 30 mảnh đầu (V1.3) | công thức `sm-diendong.js`, `sm-lauchuong.js` (cờ tắt) |
| 5 | V0.13 phần đồ thị công trình + gỡ kẹt | V0.18 (ảnh) + sửa test cũ | chuông, trống (thủ tục tạm nếu chưa có credit) | `sm-dientay.js` («Vòng Đời»), trạm mới |
| 6 | P1: bật cờ lầu chuông → Thái Tuế; theo dõi | gói `ix` chuông / trống chạy thật | duyệt art, ảnh nghiệm thu | thử tay phiếu 08-12 §4, Vận Mệnh Các |
| 7 | bật Vận Mệnh Các; giải thể `ROOMS › thaitue`, `vanmenh` sau 7 ngày | dọn lỗi | — | chuẩn bị P2 (Chính Đường) |

Mốc kiểm: cuối tuần 3 — `test-game-buildings.mjs` chạy với lầu trống giả lập; cuối tuần 5 — ba công trình thí điểm xanh toàn bộ test khi cờ tắt; cuối tuần 7 — hai phòng ngoài bản đồ đã giải thể.

---

## 4. Trình tự giải thể một phòng ngoài bản đồ (mẫu: `thaitue`)

```
 1. Công thức INT-SM-DIENDONG xong, col.json nướng, test-game-buildings xanh (cờ tắt)
 2. Duyệt art + nội dung + đo hiệu năng → phiếu DoD ĐẠT
 3. FEATURES.inplace.add('INT-SM-DIENDONG')
      ├─ world.js: bỏ qua door_thaitue / exit_thaitue khi cờ bật (không xóa mã)
      ├─ trạm `thaitue` lấy vị trí từ công thức (bld, cell, lv) thay vì origin (2000, 0)
      ├─ interior.js: không dựng phòng `thaitue` ngoài bản đồ
      └─ buildings.js › migrateLegacyPos: (2000 ± 14, 0 ± 12) → door:in Điện Đông
 4. Phát hành; theo dõi 7 ngày: gỡ kẹt, lỗi trạm, số người dùng trạm (so trước / sau)
 5. Xóa mục `thaitue` khỏi ROOMS; xóa test «cửa ↔ trong điện» cho phòng đó; giữ migrateLegacyPos thêm 2 bản phát hành
 6. Khi ROOMS rỗng → P7 dọn mã
```

Đảo ngược (nếu lỗi nặng ở bước 4): bỏ id khỏi `FEATURES.inplace` → game quay về phòng ngoài bản đồ ngay ở bản phát hành kế (không cần đổi dữ liệu lưu: id trạm không đổi; `migrateLegacyPos` chỉ chạy một chiều cũ → mới và bỏ qua khi cờ tắt).

---

## 5. Rủi ro và cách giảm

| Rủi ro | Dấu hiệu | Giảm thiểu |
|---|---|---|
| Vỏ Meshy khó khoét (lưới không kín, boolean vỡ) | `cut_door.py` báo tia không xuyên | khung che rộng hơn; nếu vẫn vỡ → dựng lại thân bằng mô-đun (08-02 §5.7) |
| Lòng đo sai vì vỏ rỗng (V1) không có sàn | `floorY` tia dọc rơi xuống đáy | dùng `floorY` thiết kế trong công thức, không lấy tia |
| Tầng `lv` làm vỡ code cũ gọi `platformTop(x, z)` | test cũ đỏ | mặc định `lv = 0`; thêm test «gọi không truyền lv giữ hành vi» |
| Hiệu năng tụt khi đứng ngoài nhìn nhiều nhà | S3, S9 vượt ngưỡng | nội thất C không nạp khi ngoài; thẻ cửa sổ đêm gộp 1 draw call / nhà |
| `InstancedMesh` nhà không mờ riêng được | mái che nhân vật khi vào nhà | bản rời (08-03 §7.5) |
| Sai khác giờ máy (MMO) | cửa người này mở, người kia đóng | trạng thái cửa cục bộ, ngách luôn mở → không chặn ai |
| Nội dung tín ngưỡng sai | duyệt nội dung bác | tượng hư cấu; người duyệt riêng; Tạng chờ tham vấn |
| Ước lượng vượt mốc M1 | P0 trễ | phương án A (§2.1) — chấp nhận P2 sang M2 |
| Credit Meshy (còn 7) | không có đạo cụ anh hùng | kế hoạch 330 credit (08-02 §10); trước đó dùng đạo cụ thủ tục tạm (chuông `LatheGeometry`, trống trụ) — **vẫn là vật thật, tương tác được** |
| Xung đột bố cục chưa phát hiện | T-03 đỏ khi thêm công trình | T-03 chạy cho mọi công trình mới của tài liệu 07 |

---

## 6. Việc cần làm ngay (trước P0, ≤ 3 ngày)

Những lỗi phát hiện khi đo đáng sửa ngay, độc lập với nội thất:

| # | Lỗi | Sửa | Ngày |
|---|---|---|---|
| 1 | `WORLD_TILES.maxX` nhỏ hơn tọa độ Thái Tuế Điện → máy chủ bỏ gói `mv` (08-04 §5.2) | tạm nâng `maxX` lên `10 + 1280` tới khi P1 xong | 0,1 |
| 2 | Bốn bảo tháp Sơn Môn lấn tường (08-08 §1, §2) | dời tâm + bỏ 4 cây tùng | 0,5 |
| 3 | Sạp SAP-03, SAP-06 chắn cửa nhà; SAP-03, SAP-04 lấn đế bài phường (08-09 §5.2) | mảng vị trí mới | 0,5 |
| 4 | Hai Tàng Thư Các chồng vào Thư Lâu (08-11 §2.2) | thu `fit` + dời xuống mặt đất | 0,5 |
| 5 | Trà lâu Cùng Thông không va chạm (08-11 §1.1) | `addFootprint` cột + nền tạm ở mặt sàn | 0,5 |
| 6 | Cầu Huyền Hà `solid: false` (08-11 §7) | nền mặt cầu tạm bằng 3 `addPlatform` + lan can | 0,5 |
| 7 | Nền `palaceComplex` một mặt phẳng → lơ lửng (08-10 §1.2) | nền từng tầng (phần 2 của sửa chung) | 0,5 |
| 8 | Cửa hai điện phụ Sơn Môn nhìn thẳng vào vách nền L1 cách 4 m, chỉ tới được bằng hành lang đất dọc vách (08-16 §2) | thêm bậc phụ L1 → sân điện ở x ±(36…40), z −38…−34 | 0,5 |
