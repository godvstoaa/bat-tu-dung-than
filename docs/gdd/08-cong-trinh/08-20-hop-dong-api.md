# 08-20 · Hợp đồng API các module runtime (chữ ký, bất biến, ca biên, test đơn vị)

> 08-03 / 08-04 mô tả **thiết kế**; phần này chốt **hợp đồng** từng hàm để nhiều người làm song song mà khớp nhau: chữ ký, đơn vị, bất biến, lỗi, độ phức tạp, và các ca test đơn vị tối thiểu (đặt trong `scripts/test-game-buildings.mjs` phần «unit»). Tất cả **chưa có — cần làm**, trừ chỗ ghi «(có)».

Quy ước chung: tọa độ mét thế giới trừ khi tên tham số có hậu tố `Tile` (ô 1,6 m) hoặc `Local`; `lv` là số nguyên 0…7; hàm thuần (không DOM) đặt ở module mà test Node nhập được.

---

## 1. `obstacles.js` (có — mở rộng)

### 1.1 Lưu trữ

```js
// khóa ô: số an toàn (≤ 2^53): lv ≤ 7, |i|,|j| < 40000
const ck = (i, j, lv = 0) => (lv * SPAN + (i + OFF)) * SPAN + (j + OFF);
```

| Hàm | Chữ ký | Hợp đồng |
|---|---|---|
| `markSolidCell` | `(i, j, lv = 0) → void` | đánh dấu một ô; gọi lại không đổi gì |
| `addSolidRect` | `(x0, z0, x1, z1, lv = 0) → void` | như cũ, thêm `lv`; đảo thứ tự góc vẫn đúng |
| `clearSolidRect` | `(x0, z0, x1, z1, lv = 0) → void` | như cũ, thêm `lv` |
| `solidAt` | `(x, z, lv = 0) → boolean` | |
| `addPlatform` | `(x, z, w, d, ry, top, { lv = 0, stair = null, seg = null } = {}) → void` | nền chữ nhật xoay `ry` (cùng quy ước `landmarks.js › local`); `stair` = id thang nếu là bậc (thuộc cả `from` và `to`) |
| `platformTop` | `(x, z, lv = 0, seg = null) → number \| null` | **cao nhất** trong các nền của `lv` (và bậc thang có `lv` ∈ {from, to}) chứa điểm; khi `seg ≠ null`, bậc thang chỉ xét `|bậc.seg − seg| ≤ 2` |
| `blockedByBuilding` | `(x, z, lv = 0) → boolean` | thân 5 điểm như cũ; xét ô đặc của `lv` + chặn động của `lv`; vòng tròn `addBlock` **chỉ ở lv 0** |
| `addBakedCells` | `(colJson) → { cells: number, plats: number }` | nạp RLE mọi tầng + nền + thang + vùng khoét; gọi hai lần cùng `id` → thay thế (gỡ bản cũ trước) |
| `removeBaked` | `(id) → void` | gỡ mọi ô / nền / thang của công trình `id` (dùng khi dỡ, khi nướng lại lúc dev) |
| `setDynamicBlock` | `(id, rect \| null, lv = 0) → void` | đặt / gỡ chặn động; `rect` = `[x0, z0, x1, z1]` |
| `addStair` | `(stair) → void` | đăng ký thang (08-04 §2.3); kiểm bậc liền kề chênh ≤ 0,41, sai → `console.warn` + vẫn đăng ký (test bắt) |
| `stairAt` | `(x, z, lv) → { stair, seg } \| null` | bậc thang dưới chân (để cập nhật `player.lv`, `player.seg`) |

Độ phức tạp: `platformTop` hiện duyệt toàn bộ `rects` (O(n)). Với ~3.000 nền sau khi thêm bậc trong nhà → thêm **lưới băm 8 m** cho `rects` (O(1) trung bình). Bất biến: mọi hàm cũ gọi không có `lv` cho **cùng kết quả** như trước (test U-OB-1).

### 1.2 Test đơn vị

| Mã | Ca | Mong đợi |
|---|---|---|
| U-OB-1 | gọi API cũ (`platformTop(0, −8.1)`) sau khi thêm nền tầng 1 chồng XZ | vẫn 4,25 (bệ thầy) |
| U-OB-2 | nền lv 0 cao 4,45 và lv 1 cao 13,65 cùng XZ | `platformTop(x, z, 0) = 4,45`, `(…, 1) = 13,65` |
| U-OB-3 | ô đặc lv 1 không chặn lv 0 | `blockedByBuilding(x, z, 0) = false` |
| U-OB-4 | thang xoắn 2 vòng, bậc chồng XZ | `platformTop` với `seg = 3` không trả bậc `seg = 19` |
| U-OB-5 | `setDynamicBlock('d', rect)` rồi `null` | chặn rồi hết chặn |
| U-OB-6 | `addBakedCells` hai lần cùng id | số ô không gấp đôi |
| U-OB-7 | khóa `ck` ở biên (`i = ±39999`, `lv = 7`) | không trùng khóa ô khác |

---

## 2. `buildings.js`

| Hàm / hằng | Chữ ký | Hợp đồng |
|---|---|---|
| `BUILDINGS` | `Building[]` (từ `int/index.js`) | thứ tự cố định; `id` duy nhất |
| `byId` | `(id) → Building \| null` | |
| `toWorld` | `(b, [x, y, z]) → { x, y, z }` | `x_tg = at.x + cos(ry)·x + sin(ry)·z`, `z_tg = at.z − sin(ry)·x + cos(ry)·z`, `y_tg = at.y + y` |
| `toLocal` | `(b, { x, y, z }) → [x, y, z]` | nghịch đảo `toWorld` (sai ≤ 1e−9) |
| `registerShell` | `(id, obj3d) → void` | gắn vỏ đã đặt; tách nhóm `SH__*`, `ownMaterials` từng nhóm, đẩy vào `fadeGroups` với `fadeRule`; kiểm vị trí vỏ khớp `shell.at` (lệch > 0,05 m → `console.warn`) |
| `stationsOf` | `(b) → Station[]` | trạm đã đổi sang thế giới + ô (`spot` ô 1,6 m), có `bld`, `cell`, `lv`, `world`, `y` |
| `injectStations` | `(ALL_STATIONS) → void` | đẩy trạm mọi công trình có cờ `FEATURES.inplace` (08-13 §1); bỏ trạm trùng id với phòng cũ khi cờ bật |
| `buildingGraph` | `(b) → { nodes, edges, outDoors, regionStart }` | đồ thị 08-04 §3.3; tính lười, nhớ đệm theo `col.hash` |
| `migrateLegacyPos` | `(x, z) → { x, z, lv, bld } \| null` | nằm trong khung `ROOMS_LEGACY` → `door:in`; không thì `null` |
| `ROOMS_LEGACY` | `{ id, origin, w, d, to }[]` | sáu phòng cũ (08-04 §5.2) |

Test: U-BD-1 `toLocal(toWorld(p)) = p`; U-BD-2 cửa Thái Tuế (cục bộ (0, 0,6, 1,4)) → thế giới (45,6, 0,6, −36); U-BD-3 `migrateLegacyPos(2000, 0).bld = 'INT-SM-DIENDONG'`; U-BD-4 `migrateLegacyPos(0, 0) = null`.

---

## 3. `cells.js`

| Hàm | Chữ ký | Hợp đồng |
|---|---|---|
| `createCells` | `(scene, { buildings, kit, camera }) → Cells` | |
| `Cells.cellAt` | `(x, y, z, lvHint = null) → Cell \| null` | 08-03 §3.1 |
| `Cells.update` | `(player, camera, dt) → void` | đổi khoang người chơi có trễ 0,3 m; cập nhật `player.lv` từ `stairAt`; chạy luồng nạp; tính khoang thấy được |
| `Cells.current` | getter → `Cell \| null` | khoang người chơi |
| `Cells.isVisible` | `(cellId) → boolean` | kết quả khung hiện tại |
| `Cells.adjacent` | `(a, b) → boolean` | có cửa nhìn trực tiếp |
| `Cells.nearOutPortal` | `(cellId, light, r) → boolean` | đèn ngoài trời cách cửa ra `out` của khoang ≤ r |
| `Cells.preload` | `(bldId) → Promise<void>` | dùng khi truyền tống (08-03 §5.3); giải quyết khi mọi khoang `ready` hoặc sau 3 s (khi đó vẫn giải quyết, kèm cờ `partial`) |
| `Cells.stats` | `() → { loaded, visible, ms }` | cho `render3d.info()` |

Hàm thuần tách riêng để test Node: `projectQuad(quad, viewProj) → rect | 'full' | null`, `clipRect(a, b) → rect | null`, `walkPortals(graph, startCell, rectFull, isOpen, project) → Set<cellId>`.

| Mã | Ca | Mong đợi |
|---|---|---|
| U-CE-1 | camera trong `cd.l0.chinh`, cửa giữa đóng | thấy {chinh, tay, dong} (ô thông `open`), không thấy tầng 2 |
| U-CE-2 | camera ngoài trời, nhìn thẳng cửa mở Thái Tuế từ 20 m | thấy `tt.l0.dien` |
| U-CE-3 | như U-CE-2 nhưng quay lưng | không thấy |
| U-CE-4 | góc tứ giác sau camera | `projectQuad` trả `'full'` |
| U-CE-5 | `cellAt` tại thang giữa hai tầng với `lvHint` | trả khoang đúng tầng |
| U-CE-6 | người chơi đứng đúng mặt cửa nhìn, nhích ±0,2 m | khoang **không** đổi (trễ 0,3) |

---

## 4. `doors.js`

| Hàm / hằng | Chữ ký | Hợp đồng |
|---|---|---|
| `GIO`, `gioOf` | `gioOf(hour0to24) → 'Tý' … 'Hợi'` | 23 → Tý, 0 → Tý, 1 → Sửu, 5 → Mão, 21 → Hợi |
| `SCHEDULES` | `{ [name]: (gio) → boolean }` | 08-03 §6.3 |
| `createDoors` | `(scene, buildings, { obstacles, audio }) → Doors` | |
| `Doors.update` | `(now, avatars, dt) → void` | `avatars`: `{ id, x, z, lv, vx, vz, path? }[]` |
| `Doors.state` | `(doorId) → 'DONG' \| 'DANG_MO' \| 'MO' \| 'DANG_DONG' \| 'HE' \| 'KHOA'` | |
| `Doors.seeThrough` | `(doorId) → boolean` | `MO`, `DANG_*`, `HE` (một phần) |
| `Doors.canPass` | `(doorId, who = 'player') → boolean` | dùng cho A*: `KHOA` → theo quyền |
| `Doors.knock` | `(doorId) → Promise<'mo' \| 'khong' \| 'ngu'>` | 08-03 §6.6 |
| `Doors.grant` | `(doorId, flag) → void` | mở quyền theo cờ nhiệm vụ (lưu `s.int.flags`) |

Bất biến: cửa đang có avatar trong ô cửa **không** chuyển sang `KHOA` (chờ); `setDynamicBlock` chỉ khi `KHOA`.

| Mã | Ca | Mong đợi |
|---|---|---|
| U-DO-1 | `dien_chinh` các giờ | mở Mão…Tuất, khóa Hợi…Dần |
| U-DO-2 | người chơi đứng ô cửa lúc chuyển `KHOA` | trạng thái giữ `MO` tới khi ra khỏi ô |
| U-DO-3 | `KHOA` + `grant` | `canPass = true`, trạng thái riêng `HE` |
| U-DO-4 | `thanh_mon` lúc 0 giờ | khóa; ngách liền kề `luon_mo` |
| U-DO-5 | `reduced = true` | thời gian mở 0,15 s |

---

## 5. `kit.js`

| Hàm | Chữ ký | Hợp đồng |
|---|---|---|
| `loadKit` | `(name, quality) → Promise<Kit>` | nạp `kit/<name>{.hd,,.lod}.glb` + `kit/<name>.json`; nhớ đệm theo `(name, quality)` |
| `Kit.piece` | `(modId) → PieceDef` | ném lỗi nếu không có (bắt ở test T-26 trước) |
| `assemble` | `(cellGroup, pieces, { kits, palette, at }) → { group, props, lights, colliders }` | gom bản sao cùng mã → `InstancedMesh`; mảnh tĩnh `mergeStatic` theo vật liệu; mảnh có `hook` → `props` (không gộp); trả mốc đèn đã đổi thế giới |
| `assembleSliced` | `(... , budgetMs = 4) → AsyncIterator` | bản cắt lô cho `cells.js` |
| `expandPieces` | `(pieces) → PieceInstance[]` | **thuần**: bung `n`, `step`, `rows`, `rowStep`, `ring` thành danh sách bản sao — test Node đếm được |

| Mã | Ca | Mong đợi |
|---|---|---|
| U-KI-1 | `expandPieces([['MOD-BAC-01', [0,0,0], { n: 5, step: [3.2,0,0], rows: 3, rowStep: [0,0,2.5] }]])` | 15 bản sao, bản cuối ở (12,8, 0, 5) |
| U-KI-2 | mảnh có `widthTo` | co giãn X đúng tỉ lệ, các trục khác giữ |
| U-KI-3 | mã không tồn tại | lỗi có tên mã |

---

## 6. `world.js` (có — mở rộng)

| Hàm | Chữ ký | Hợp đồng |
|---|---|---|
| `blockedAt` | `(xTile, yTile, from = null, lv = 0) → boolean` | như cũ, thêm `lv`; trên nền của `lv` → không xét dốc địa hình |
| `findPath` (có) | `(fromTile, toTile) → point[]` | **giữ nguyên** cho ngoài trời |
| `findPath3` | `(from: { x, y, lv }, to: { x, y, lv }) → { x, y, lv }[]` | tọa độ ô; 08-04 §3.3; đường rỗng = không tới được; mọi điểm có `lv` |
| `nearestStation` (có) | `(pos, maxDist = 1.5) → Station \| null` | thêm lọc `pos.lv === st.lv` (mặc định `lv` 0) |
| `stationAt` (có) | như cũ | thêm lọc `lv` |
| `pickTarget` | `(ray, cells) → { x, y, lv } \| { door } \| null` | 08-04 §3.4 |

| Mã | Ca | Mong đợi |
|---|---|---|
| U-WO-1 | `findPath3` ngoài trời → ngoài trời | bằng `findPath` (cùng điểm) |
| U-WO-2 | sân → tầng 2 Chính Đường | đi qua cửa giữa, thang Tây, `lv` đổi 0 → 1 đúng một lần |
| U-WO-3 | cửa `KHOA` không quyền | đường vòng qua ngách hoặc rỗng |
| U-WO-4 | `nearestStation` đứng dưới trạm tầng 2 | `null` (hoặc trạm tầng 0) |
| U-WO-5 | khe 1,4 m trong nhà | A* mịn tìm được |

---

## 7. `lights.js` (có — mở rộng) và pool đèn

| Hàm | Chữ ký | Hợp đồng |
|---|---|---|
| `addLight` (có) | `(x, y, z, { color, power, room, cell, lv, kind, flicker, sched, bld }) → LightRef` | trường mới tùy chọn; `kind` mặc định `'denlong'` |
| `removeLightsOf` | `(bldId) → number` | khi dỡ công trình |
| `lightIntensity` | `(L, ctx) → number` | **thuần**: `power × hệ số kind × lịch × nhấp nháy(t)`; `ctx = { indoor, night, gio, t, reduced }` |

Test: U-LI-1 đèn `sched: 'nha_dan'` giờ Tý → 0; U-LI-2 `reduced` → không nhấp nháy (đạo hàm theo t = 0).

---

## 8. `audio.js` (có — mở rộng)

| Hàm | Chữ ký | Hợp đồng |
|---|---|---|
| `setCellAcoustics` | `({ reverb, bed, outdoorOpen }) → void` | nội suy 0,8 s; an toàn khi âm tắt (không tạo `AudioContext`) |
| `playAt` | `(soundName, { x, y, z, cell }, opts) → void` | áp che âm qua cửa nhìn (08-04 §4.5) |
| `occlusion` | `(fromCell, toCell, portals, doorStates) → { db, lpHz, via }` | **thuần** — test Node |
| `creak`, `thump`, `footstep` | `(kind, vol)` | tổng hợp, như `bell` / `knock` hiện có |

Test: U-AU-1 nguồn và người nghe cùng khoang → 0 dB; U-AU-2 qua một cửa đóng → −14 dB, 800 Hz; U-AU-3 không đường trong 3 bước → −24 dB, 400 Hz.

---

## 9. `protocol.js` / `net.js` / `worker/quan-room.js`

| Thay đổi | Hợp đồng |
|---|---|
| `parseClient` `mv` | thêm `l: Number.isInteger(m.l) && m.l >= 0 && m.l <= 7 ? m.l : 0`; mọi kiểm cũ giữ nguyên |
| `parseClient` `ix` | `{ t: 'ix', o, a }` chỉ khi `IX_OBJECTS[o]?.actions.includes(a)`; khác → `null` |
| `IX_OBJECTS` | `{ 'sm.chuong': { actions: ['danh'], cooldownRoomMs: 4000, cooldownUserMs: 10000 }, … }` — xuất từ `protocol.js` để khách và chủ dùng chung |
| Máy chủ `ix` | kiểm hai thời gian chờ; hợp lệ → `n += 1`, `broadcast({ t: 'ix', id, o, a, at: Date.now(), n })` |
| Gói chào | thêm `props` |
| `net.js` | `send({ t: 'mv', …, l })`; nhận `mv` lưu `o.tl`; nhận `ix` → `onEvent` |
| `WORLD_TILES` | tạm `maxX = 10 + 1280` (08-13 §6); sau P7 về `10 + 640` |

Test (`test-quan-protocol.mjs`): U-PR-1 `mv` với `l: 3` giữ; `l: '3'` → 0; U-PR-2 `ix` sai vật → `null`; U-PR-3 hai `ix` cùng vật trong 4 s → lần hai bị máy chủ bỏ (test MMO).

---

## 10. `state.js` (có — mở rộng)

| Hàm | Chữ ký | Hợp đồng |
|---|---|---|
| `createState` (có) | thêm `int: { v: 1, seen: {}, flags: {}, props: {}, last: null }` | |
| `loadState` (có) | `int` thiếu / sai kiểu → tạo mới; `int.last` qua `migrateLegacyPos` nếu nằm khung cũ | không làm sập (cùng chuẩn test hiện có) |
| `markSeen` | `(s, bldId, now) → boolean` | lần đầu → `true` (để thưởng một lần) |
| `setLast` | `(s, { bld, cell, lv, x, z }) → void` | gọi khi lưu định kỳ / thoát |
| `grantOnce` | `(s, key, amount) → number` | thưởng một lần đời (khác `grantDaily`) |

Test: U-ST-1 `loadState` với `int: 'rác'` → `int` mặc định; U-ST-2 `markSeen` hai lần → `true`, `false`.

---

## 11. Điểm nối `render3d.js` (có)

| Điểm | Hợp đồng |
|---|---|
| `fadeGroups` | phần tử có thể mang `userData.fadeRule`; thiếu → `'occ'` (hành vi cũ) |
| `applyFade(groups, ctx, dt)` | độ mờ mục tiêu theo 08-03 §7.1; `colorWrite = op > 0,02` |
| `cameraIndoor(cam, camera, cell)` | chỉ gọi khi `cells.current` khác `null`; ngoài trời giữ khối camera hiện có |
| `updateLightPool` | bộ lọc mới (08-04 §1.3) thay `(L.room \|\| null) !== lightRoom`; giữ nhánh `room` cho phòng cũ chưa chuyển |
| `info()` (có) | thêm `cells: cells.stats()`, `doors: doors.count`, `lv: player.lv` |
| `debugCam` / `debugHour` (có) | dùng cho bộ ảnh nghiệm thu (08-12 §3.3); thêm `?shots=` |
