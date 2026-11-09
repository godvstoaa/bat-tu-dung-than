# 13.07 · Thế giới 4,6 km và streaming theo vùng

> Canon §3 thêm 12 thánh địa, tâm xa nhất ở ±1.500–1.900 m. Thế giới hiện tại 2.048 m (±1.024 m) với rìa biển mây bắt đầu ở bán kính 960 m (phần 01 §5). Phần này đặc tả: biên thế giới mới, địa hình cho vùng mới, lưới streaming, ngân sách bộ nhớ, luồng nạp/dỡ, va chạm và tìm đường quy mô lớn, di chuyển nhanh. Bố cục từng vùng do tài liệu 07 viết.

## 1. Biên thế giới mới

### 1.1 Vì sao không đủ hình tròn bán kính 2.000 m

Tâm Mao Sơn (1.500, 1.300) cách gốc √(1.500² + 1.300²) ≈ 1.985 m; Tạng Địa (−1.500, −1.300) cũng ≈ 1.985 m. Với rìa tròn, hai vùng này nằm ngay mép vách đổ xuống biển mây (vùng chuyển tiếp rộng 200 m), không còn chỗ cho quần thể bán kính ~250 m.

### 1.2 Quyết định đề xuất

| Tham số | Hiện tại | Mới |
|---|---|---|
| `WORLD` | 2.048 | **4.608** (36 chunk × 128 m) |
| `HALF` | 1.024 | **2.304** |
| Hàm khoảng cách rìa | tròn `hypot(x, z)` | **siêu elip bậc 4** `r₄ = (x⁴ + z⁴)^¼` |
| `EDGE` | 960 | **2.080** |
| Biển mây | `r > 960` dốc xuống `CLOUD_SEA = −70` | `r₄ > 2.080` dốc xuống, chạm `−70` ở `r₄ = HALF` |
| Ô MMO (`WORLD_TILES`) | `minX −630 … maxX 1.210`, `minY −633 … maxY 647` | `minX 10 − 1.440`, `maxX 10 + 2.250` (gồm dải phòng túi, phần 06 §1), `minY 7 − 1.440`, `maxY 7 + 1.440` |

Kiểm bằng `r₄`: Mao Sơn ≈ 1.677 m, Tạng Địa ≈ 1.678 m, Văn Miếu (0, 1.900) = 1.900 m, Chung Nam (1.400, −1.300) ≈ 1.609 m — đều < 2.080 m, còn ≥ 180 m lề tới rìa. Siêu elip giữ bốn góc bản đồ dùng được mà vẫn có viền mây mềm.

**Hệ quả:** `heightAt` thay đổi ở mọi điểm có `hypot(x, z) > 960` (vùng trước đây đổ dốc nay thành đồi). Những gì đặt theo `H(x, z)` (landmarks, đường, cây) tự đúng; va chạm nướng sẵn phải nướng lại (TASK-127); ảnh chụp chuẩn cũ ở rìa phải chụp lại.

### 1.3 Địa hình 12 vùng mới

Thêm vào `terrain.REGIONS` (tọa độ tâm theo canon §3; `kind` và tham số là đề xuất kỹ thuật, tài liệu 07 chỉnh):

| id | Tâm | `kind` | `r` | `h` | Ghi chú địa hình |
|---|---|---|---|---|---|
| `longho` | 1.500, −200 | `peak` (mới: `danxia`) | 220 | 260 | núi đá đỏ đỉnh bằng, vách dựng; thêm noise phân tầng ngang |
| `vodang` | 0, −1.500 | `peak` | 260 | 520 | núi cao nhất, đường thần đạo dài; bình đài đỉnh |
| `chungnam` | 1.400, −1.300 | `peak` | 230 | 380 | |
| `maoshan` | 1.500, 1.300 | `hills` (mới) | 240 | 120 | đồi thấp nhiều đỉnh, thung lũng ruộng |
| `yentu` | −400, 1.500 | `peak` | 220 | 450 | chuỗi chùa từ chân lên đỉnh: cần 4 bình đài theo độ cao (khai báo `pads`) |
| `buttap` | 500, 1.500 | `plateau` | 160 | 20 | đồng bằng làng quê, ao |
| `tangdia` | −1.500, −1.300 | `plateau` + tuyết | 260 | 420 | cao nguyên lạnh: ngưỡng tuyết `colorAt` hạ cục bộ |
| `vanmieu` | 0, 1.900 | `city` | 180 | 10 | phố phẳng, hồ Văn |
| `phongdo` | −1.500, 0 | `hills` + sông | 200 | 90 | đồi ven sông; nối sông Huyền Hà kéo dài |
| `mieucuong` | −1.400, 1.300 | `valley` | 230 | 260 | ruộng bậc thang: thêm noise bậc `floor(h/3)·3` trong vùng |
| `vancoc` | 0, −260 | `hill` (mới, áp **sau** bước làm phẳng Huyền Thành) | 60 | 70 | núi nhỏ sau Hậu Sơn (z −116); hiện nằm trong vùng làm phẳng `thanh` (`r × 1,45 = 261 m`) nên phải áp sau |
| `conlon` | 0, −900, cao 260 m | — (đảo trời, không phải địa hình) | 160 | — | dùng cơ chế `SKY_ISLAND` (hiện có Thiên Bàn Đảo ở (0, 300) cao 520 m); thêm mảng `SKY_ISLANDS` |

- Thứ tự áp trong `heightAt` mới: nền → `peak`/`valley`/`lake`/`hills`/`danxia` → sông → bình đài đỉnh → làm phẳng `city`/`plateau` → **`hill` nhỏ áp sau làm phẳng** → rìa siêu elip.
- `CLEARINGS` (sân trống quanh sảnh) và `treeDensity` thêm vùng mới (không trồng cây trên quảng trường Văn Miếu, sân chùa).
- `test-terrain.mjs` thêm: tâm mỗi vùng `walkable`; bình đài phẳng (độ dốc < 0,1) trong bán kính quần thể; đường từ Huyền Thành tới tâm vùng tồn tại trên đồ thị đường (§6); hiệu năng `heightAt` 50.000 lần vẫn < 400 ms dù thêm 12 vùng (mỗi vùng thêm một `hypot` + nhánh; nếu vượt, dùng lưới băm vùng 256 m để chỉ xét vùng gần).

## 2. Lưới streaming

### 2.1 Ô streaming

- Kích thước **256 m** (2 × 2 chunk địa hình) → lưới 18 × 18 = 324 ô.
- Mỗi ô có tệp kê khai `public/stream/<cx>_<cz>.json` (SCHEMA-STREAM-CELL), sinh bằng `scripts/build-stream.mjs` từ dữ liệu vùng (SCHEMA-REGION-MANIFEST) + công trình (SCHEMA-BUILDING) + đạo cụ.

### 2.2 SCHEMA-REGION-MANIFEST

`src/game/data/regions/<id>.json` (tài liệu 07 viết nội dung, kỹ thuật kiểm):

```jsonc
{
  "id": "longho",
  "name": "Long Hổ Sơn · Tự Hán Thiên Sư Phủ",
  "center": [1500, -200], "radius": 260,
  "unlock": { "realm": { "gte": 2 } },     // SCHEMA-COND (phần 03) — chưa mở thì có cảnh nền nhưng không có đường
  "buildings": ["BLD-longho-01", "BLD-longho-02"],
  "pois": ["POI-longho-01"],
  "props": "props/longho.json",            // đạo cụ nhân bản: [{ asset, items: [{x,z,ry,s}] }]
  "roads": [[[820, 0], [1100, -80], [1380, -170]]],   // polyline đường đá nối vùng (thêm vào đồ thị đường)
  "audio": "BGM-longho",                   // mã tài liệu 12
  "palette": "palette/longho.json",
  "skyline": "far/longho.glb",             // bóng quần thể nhìn từ xa (impostor, §3.3)
  "budget": { "drawCalls": 220, "tris": 600000, "texMB": 120 }   // khi đứng giữa vùng, mức mid
}
```

### 2.3 SCHEMA-STREAM-CELL

```jsonc
{
  "c": [21, 7],                            // chỉ số ô (cx, cz), gốc ở góc −HALF
  "v": 12,                                 // phiên bản nội dung (đổi → client bỏ bộ đệm)
  "region": "longho",                      // vùng chiếm phần lớn ô (null nếu hoang dã)
  "bytes": { "near": 6420000, "mid": 1310000, "far": 220000 },   // ước lượng tải theo vòng (§2.4)
  "buildings": ["BLD-longho-01"],          // công trình có tâm trong ô
  "spots": [ { "id": "longho-terrace", "fn": "longho.terrace" } ],   // quần thể thủ tục (landmarks)
  "props": [ { "asset": "lib_lantern", "n": 24 } ],
  "col": ["col/BLD-longho-01.json", "col/cell-21-7-props.json"],
  "nav": "nav/21_7.json",                  // mảnh đồ thị đường trong ô
  "npc": ["NPC-xxx"],                      // NPC cư trú (tài liệu 06)
  "audioZones": [ { "poly": [[…]], "bgm": "BGM-longho" } ]
}
```

### 2.4 Các vòng tải

| Vòng | Khoảng cách tới tâm ô (người chơi) | Tải | Dỡ khi |
|---|---|---|---|
| **N** (gần) | ≤ 300 m | shell bản thường/HD theo chất lượng, đạo cụ đầy đủ, va chạm, đồ thị đường chi tiết, NPC, ứng viên nội thất (nội thất thật tải theo 60 m, phần 06) | > 390 m |
| **M** (vừa) | 300–900 m | shell bản `.lod`, đạo cụ lớn (cây cổ thụ, cột đèn) bản `.lod`, không va chạm, không NPC | > 1.170 m |
| **F** (xa) | 900–2.600 m | impostor bóng quần thể (`skyline`), địa hình macro | không dỡ (rất nhẹ) |

Hệ số trễ (hysteresis) 1,3 tránh tải/dỡ liên tục khi đi dọc ranh giới. Khi bay ngự kiếm (độ cao > 60 m) vòng N thu về 200 m và vòng M mở rộng tới 1.200 m (nhìn xa hơn, ít cần chi tiết gần).

## 3. Địa hình quy mô lớn

### 3.1 Vấn đề hiện tại

Khởi động dựng toàn bộ chunk ở mức xa (`world3d.js`), mỗi chunk là một `Mesh`. Với 36 × 36 = 1.296 chunk, số đối tượng gấp 5 lần hiện nay; số lượt vẽ địa hình trong tầm nhìn xa tăng tương ứng.

### 3.2 Hai tầng địa hình

| Tầng | Ô | Đoạn lưới | Phạm vi | Số mesh |
|---|---|---|---|---|
| **Gần** | chunk 128 m | 64/48/32 (theo chất lượng) với vòng `near`, 32/24/16 với vòng `mid` | ≤ 4 chunk quanh người chơi (như hiện nay) | ≤ 81 |
| **Macro** | ô 512 m | 16 | toàn thế giới, trừ ô có chunk gần phủ hết | ≤ 81 (9 × 9) |

- Ô macro bị chunk gần phủ **một phần** → vẫn vẽ macro nhưng hạ 0,5 m dưới chunk gần (skirt 10 m của chunk gần che khe) — đơn giản hơn cắt lỗ.
- Ô macro dùng cùng vật liệu địa hình (một chương trình shader); có thể gộp 81 ô thành **4 mesh** (mỗi góc phần tư một mesh) vì chúng tĩnh → ≤ 4 lượt vẽ cho toàn bộ địa hình xa.

### 3.3 Impostor quần thể xa

- Mỗi vùng có `skyline` GLB rất nhẹ (≤ 3.000 tam giác, texture 256²), dựng bằng `scripts/build-skyline.mjs`: gộp các bản `.lod` của công trình vùng, giản lược tiếp bằng `meshy-lod.mjs` (tỉ lệ đích theo số tam giác `t:3000`).
- Vòng F chỉ vẽ `skyline`; vào vòng M thay bằng các `.lod` riêng.

### 3.4 Sinh hình học trong Web Worker

- `terrain.js` thuần JS → chạy được trong Worker. Tạo `src/game/terrain-worker.js`: nhận `{ cx, cz, seg, kind: 'chunk'|'macro' }`, trả `ArrayBuffer` vị trí/pháp tuyến/màu/chỉ số (chuyển quyền sở hữu, không sao chép).
- Luồng chính chỉ tạo `BufferGeometry` từ mảng nhận về (≤ 0,5 ms/chunk 64 đoạn, suy luận theo kích thước mảng ~4.400 đỉnh).
- Hàng đợi ưu tiên theo khoảng cách; hủy yêu cầu đã cũ khi người chơi đổi ô (mỗi yêu cầu mang `epoch`).
- Thiết bị không hỗ trợ module Worker → giữ đường cũ (luồng chính, 6 ms/khung).

## 4. Nạp tài sản

### 4.1 Hàng đợi

```js
// src/game/stream.js
export function createStreamer({ budget, quality, fetchManifest, loadModel, onCellReady }) {
  return {
    update(px, pz, alt),                   // gọi mỗi 0,5 s: tính tập ô cần ở từng vòng, xếp yêu cầu
    preload(x, z) → Promise,               // cho truyền tống: chờ vòng N ở đích sẵn sàng
    stats() → { cells: {N, M, F}, inflight, queue, gpuMB, heapMB, evicted }
  };
}
```

- Đồng thời tối đa 4 yêu cầu GLB (HTTP/2 qua Cloudflare; cao hơn không nhanh hơn trên di động, suy luận). Tệp kê khai ô và va chạm (nhỏ) không tính vào giới hạn.
- Ưu tiên: (1) va chạm ô đang đứng; (2) shell vòng N theo khoảng cách; (3) đạo cụ vòng N; (4) vòng M; (5) tải trước theo hướng đi (ô phía trước theo vận tốc 5 s).
- Hủy: yêu cầu của ô đã rời khỏi tập mong muốn bị bỏ khỏi hàng đợi (chưa gửi) hoặc bỏ kết quả (đã gửi); không dùng `AbortController` cho GLB đã gửi (tránh hỏng bộ đệm HTTP).

### 4.2 Đếm tham chiếu và giải phóng

- `assets.loadModel` hiện đệm vĩnh viễn (`cache: Map`). Thêm đếm tham chiếu: `acquire(id)`, `release(id)`. Khi đếm về 0 và bộ nhớ vượt ngân sách → dỡ theo LRU: `geometry.dispose()`, `material.dispose()`, `texture.dispose()`, xóa khỏi `cache`.
- Đối tượng đặt trong cảnh (`placeModel`, `instanceModel`) ghi `userData.assetIds` để `remove` của ô gọi `release`.
- `landmarks.js`: tập `done` (không bao giờ dỡ) thay bằng trạng thái theo ô của streamer (D7, TASK-132).

### 4.3 Ước lượng bộ nhớ

- Texture: `Σ w × h × 4 × 1,33` (mipmap) theo ảnh đã giải mã (WebP giải nén thành RGBA trong GPU). Tệp `.glb` texture 1.024² → ≈ 5,6 MB GPU mỗi texture.
- Hình học: `Σ byteLength` thuộc tính + chỉ số (meshopt giải nén khi nạp).
- Bộ đếm duy trì khi nạp/dỡ (không quét cảnh).

## 5. Ngân sách bộ nhớ

| Mức | GPU texture | GPU hình học | Heap JS | Vòng N / M |
|---|---|---|---|---|
| low (điện thoại cũ, iGPU cũ) | ≤ 96 MB | ≤ 48 MB | ≤ 250 MB | 240 m / 700 m |
| mid (mặc định cảm ứng) | ≤ 180 MB | ≤ 96 MB | ≤ 400 MB | 300 m / 900 m |
| high (máy bàn) | ≤ 400 MB | ≤ 200 MB | ≤ 800 MB | 360 m / 1.200 m |

- Mức mid khớp ngân sách `DAI-THE-GIOI-DESIGN.md › C7` (texture GPU ≤ 180 MB).
- Vượt ngân sách → (1) dỡ LRU ở vòng M; (2) hạ bản `.hd` về bản thường; (3) thu hẹp vòng N 15%; (4) báo `stats().pressure` cho HUD hiệu năng.
- iOS WKWebView không có API đo bộ nhớ; dựa vào bộ đếm của streamer. Khi app quay lại từ nền (`resume()`), không nạp lại toàn bộ — chỉ kiểm WebGL context còn sống (`webglcontextlost` → dựng lại renderer, giữ trạng thái game).

### 5.1 Tải lần đầu

Mục tiêu (DAI-THE-GIOI C7): **≤ 8 MB** để vào Huyền Thành ở mức mid.

| Thành phần | Kích thước hiện tại / ước | Hành động |
|---|---|---|
| JS chunk `render3d` (gồm Three.js) | 792 KB (chưa nén gzip/brotli) | giữ; tách `EffectComposer` khi mức low |
| JS chunk `game` + `main` dùng chung | 126 KB + phần dùng chung | giữ |
| GLB Sơn Môn (palace_grand, hall_main, gate_sect, lib_pavilion2, tháp, nhân vật) | vài MB (bản thường) | ưu tiên vòng N ô (9, 9) |
| Tượng thần 5 × ~1 MB | 4,9 MB | chỉ tải khi vào điện (nội thất, 60 m) — hiện tải ngay khi khởi động (`createInteriors`) |

## 6. Tìm đường quy mô lớn

### 6.1 Đồ thị đường — SCHEMA-NAVGRAPH

```jsonc
// public/nav/<cx>_<cz>.json — mảnh trong một ô streaming
{
  "c": [21, 7],
  "nodes": [ { "id": "n21_7_0", "x": 1382.0, "z": -168.5, "tag": "road" },
             { "id": "n21_7_1", "x": 1450.0, "z": -190.0, "tag": "gate", "bld": "BLD-longho-01" } ],
  "edges": [ { "a": "n21_7_0", "b": "n21_7_1", "len": 70.9, "kind": "road" } ],
  "links": [ { "a": "n21_7_0", "cell": [20, 7], "b": "n20_7_5" } ]   // nối sang ô kề
}
```

- Nút: điểm trên đường đá (`roads` của vùng + `landmarks.roadPath`), cổng công trình, bến đò, trạm truyền tống.
- Sinh bằng `scripts/build-nav.mjs`: lấy mẫu polyline đường mỗi 40 m, nối cạnh, kiểm từng cạnh bằng `clearLine` trên địa hình + va chạm nướng.

### 6.2 Tìm đường hai tầng

```
findPathLong(from, to):
  if dist ≤ 150 ô (240 m): return findPath(from, to)                 // A* lưới như hiện tại
  a = nút đồ thị gần `from` nhất mà clearLine(from, a); b = tương tự cho `to`
  route = A* trên đồ thị (heuristic Euclid), chỉ dùng mảnh của ô đã nạp + kê khai ô (nạp nav trước shell)
  path = [from → a] + route + [b → to], các đoạn đầu/cuối dùng findPath
  trả path dạng điểm; client đi từng đoạn, đoạn kế tiếp tính khi tới gần (lazy)
```

- Đồ thị toàn cục ước tính ≤ 3.000 nút → A* < 2 ms.
- Thay hành vi hiện tại «xa > 150 ô thì đi thẳng, gặp núi thì dừng».

### 6.3 Di chuyển nhanh và truyền tống

- Giữ trạm đi nhanh (xe ngựa, đò; `main.js › teleportTo`). Thêm **trận truyền tống** mỗi vùng (mở khi đã tới vùng một lần, `world.visited`).
- Trước khi dịch chuyển: `streamer.preload(x, z)` → màn chuyển cảnh giữ tới khi vòng N ở đích có va chạm và shell bản thường (tối đa 8 s; quá thì vào với bản `.lod` và va chạm nướng sẵn, chi tiết đến sau).
- Ngự kiếm: không dỡ vòng N ở điểm cất cánh trong 10 s đầu (người chơi hay đáp lại gần).

## 7. Va chạm quy mô lớn

### 7.1 Lưới bit theo ô streaming

Thay `Map` ô đặc toàn cục (phần 06 §5.1, phù hợp quy mô Sơn Môn) bằng **lưới bit theo ô streaming**:

- Ô 256 m với độ phân giải 0,5 m → 512 × 512 ô = 262.144 bit = **32 KB/lớp**.
- Mỗi ô streaming giữ `Uint8Array(32.768)` cho lớp 0, thêm lớp khi có công trình nhiều tầng.
- Lưới hợp thành = OR của các rastơ va chạm thuộc ô (công trình nướng sẵn + đạo cụ + khối thủ công). Thêm/bớt công trình → **dựng lại** lưới hợp thành của ô đó (262.144 phép OR theo byte ≈ 32.768 phép trên `Uint8Array` → < 1 ms).
- Không cần đếm chủ sở hữu từng ô; chủ sở hữu ở mức «rastơ thành phần».
- `solidAt(x, z, layer)`: tính ô streaming, tra bit → O(1), nhanh hơn băm `Map`.

### 7.2 Va chạm với vòng M

Ngoài vòng N không có va chạm công trình (người chơi không thể tới đó mà không đi qua vòng N). Ngoại lệ: **bay ngự kiếm** vốn đã bỏ va chạm (`main.js › step`).

## 8. MMO theo vùng (tóm tắt, chi tiết phần 08)

- Phòng theo vùng: `town-<region>-<n>` (DAI-THE-GIOI C6); vượt ranh giới vùng → đổi socket sau khi đã ở vùng mới ≥ 3 s (tránh nhảy qua lại).
- Gói `mv` vẫn dùng tọa độ ô toàn cục; máy chủ kiểm trong biên `WORLD_TILES` mới và trong hộp bao vùng + lề 200 m.

## 9. Chế độ lỗi

| Lỗi | Phát hiện | Xử lý |
|---|---|---|
| Mạng chậm, vòng N chưa có va chạm khi người chơi tới | ô đang đứng chưa `colReady` | giới hạn tốc độ đi 50% trong ô đó + hiện mây mờ quanh nhân vật; không cho đi vào ô chưa có va chạm khi tốc độ > 2 ô/s |
| Lỗi tải GLB (404, hỏng) | `loadModel → null` | dùng `.lod` nếu có; không có thì bỏ qua công trình (va chạm nướng vẫn chặn đúng chỗ) |
| Tràn bộ nhớ GPU (context lost) | sự kiện `webglcontextlost` | dừng vòng lặp, dựng lại renderer + scene từ trạng thái streamer, hạ chất lượng một nấc |
| Kê khai ô và nội dung lệch phiên bản | `v` trong kê khai khác bộ đệm | bỏ bộ đệm ô, tải lại |
| Người chơi đi tới rìa siêu elip | `walkable` | chặn như hiện tại (biển mây) |

## 10. Kiểm thử

| Bộ | Ca |
|---|---|
| `test-terrain.mjs` (mở rộng) | §1.3: tâm vùng đi được, bình đài phẳng, `r₄` của mọi tâm < `EDGE − 150`; hiệu năng |
| `test-stream-plan.mjs` | hàm thuần `planRings(px, pz, alt, manifestIndex)` → tập ô theo vòng; trễ 1,3 không dao động khi đi dọc ranh giới; bay đổi bán kính |
| `test-nav.mjs` | đường dài Huyền Thành → mỗi vùng mở được tồn tại; độ dài ≤ 1,6 × khoảng cách thẳng; mảnh đồ thị nối liền qua ô |
| `test-colgrid.mjs` | OR rastơ; dựng lại khi bỏ công trình chỉ gỡ đúng phần của nó; `solidAt` khớp bản `Map` cũ trên Sơn Môn |
| Ngâm bộ nhớ (Playwright, Chrome) | bot đi Huyền Thành → Long Hổ → Võ Đang → Bút Tháp → về, 3 vòng; `performance.memory.usedJSHeapSize` và bộ đếm GPU của streamer quay về ±10% sau mỗi vòng (không rò rỉ) |
| Hiệu năng địa hình | lượt vẽ địa hình ≤ 30 ở mọi điểm khảo sát (phần 09) |

## 11. Bảng vùng trên lưới streaming

Ô streaming tính bằng `floor((v + 2.304) / 256)` (gốc ở góc −HALF). «Số ô phủ» = số ô 256 m có giao với hình tròn bán kính `r` quanh tâm (lấy mẫu mỗi 16 m). `d` = khoảng cách thẳng tới gốc; `r₄` = khoảng cách siêu elip dùng cho rìa (§1.2). Bán kính `r` lấy từ `terrain.REGIONS` (vùng có sẵn) hoặc đề xuất §1.3.

| Vùng | Tâm (x, z) | Ô tâm (cx, cz) | Số ô phủ | `d` (m) | `r₄` (m) | Mốc |
|---|---|---|---|---|---|---|
| `thanh` | 0, 0 | 9, 9 | 4 | 0 | 0 | có |
| `vancoc` | 0, −260 | 9, 7 | 4 | 260 | 260 | M2 (địa hình), M0 tạm |
| `thulau` | 0, −700 | 9, 6 | 4 | 700 | 700 | có |
| `tubinh` | −620, −560 | 6, 6 | 7 | 835 | 704 | có |
| `manh` | 640, −520 | 11, 6 | 6 | 825 | 701 | có |
| `trichthien` | −600, 600 | 6, 11 | 8 | 849 | 714 | có |
| `cungthong` | 620, 620 | 11, 11 | 9 | 877 | 737 | có |
| `phongthuy` | −820, 0 | 5, 9 | 4 | 820 | 820 | có |
| `lichduong` | 820, 0 | 12, 9 | 4 | 820 | 820 | có |
| `conlon` (đảo trời, cao 260 m) | 0, −900 | 9, 5 | 6 | 900 | 900 | M5 |
| `longho` | 1.500, −200 | 14, 8 | 6 | 1.513 | 1.500 | M2 |
| `vodang` | 0, −1.500 | 9, 3 | 6 | 1.500 | 1.500 | M2 |
| `buttap` | 500, 1.500 | 10, 14 | 4 | 1.581 | 1.505 | M2 |
| `yentu` | −400, 1.500 | 7, 14 | 6 | 1.552 | 1.502 | M3 |
| `vanmieu` | 0, 1.900 | 9, 16 | 6 | 1.900 | 1.900 | M3 |
| `maoshan` | 1.500, 1.300 | 14, 14 | 7 | 1.985 | 1.677 | M3 |
| `chungnam` | 1.400, −1.300 | 14, 3 | 6 | 1.910 | 1.609 | M3 |
| `phongdo` | −1.500, 0 | 3, 9 | 4 | 1.500 | 1.500 | M4 |
| `mieucuong` | −1.400, 1.300 | 3, 14 | 6 | 1.910 | 1.609 | M4 |
| `tangdia` | −1.500, −1.300 | 3, 3 | 8 | 1.985 | 1.677 | M5 |

Nhận xét:

1. Mọi vùng chiếm ≤ 9 ô → khi đứng ở tâm vùng, vòng N (300 m) phủ gần trọn vùng; ngân sách vùng (SCHEMA-REGION-MANIFEST › budget) chính là ngân sách vòng N tại tâm.
2. `conlon` (0, −900) nằm cách Thư Lâu Lâm (0, −700) 200 m theo phương ngang nhưng cao 260 m: streaming phải theo khoảng cách **3D** (TASK-251) để đứng ở Thư Lâu không nạp nội thất đảo.
3. `vancoc` (0, −260) cách Hậu Sơn (0, −116) 144 m: cùng vòng N với Sơn Môn → ngân sách Sơn Môn phải chừa phần cho Am Vân Cốc (nhỏ, hạng B/C).
4. Bốn vùng góc (`maoshan`, `tangdia`, `chungnam`, `mieucuong`) có `d` ≈ 1.900–1.985 m nhưng `r₄` ≤ 1.677 m, xác nhận lý do chọn rìa siêu elip.
