# 13.06 · Công trình đi vào được: ô cổng (portal cell), va chạm nhiều lớp, nội thất mô-đun

> Bản sơ đồ tổng §8 đặt «Luật số 1 của level design»: mọi công trình trong tầm đi bộ đều đi vào được, nội thất dựng **bên trong vỏ**, cùng tọa độ, đi qua cửa là vào thẳng. §8.2 liệt kê 6 yêu cầu kỹ thuật (3 lớp model, ẩn mái, ô cổng, va chạm khoét cửa, cửa là vật thật). Tài liệu 07 cấp mã công trình `BLD-<region>-xx`, tài liệu 08 cấp mô-đun `MOD-<bộ>-xx` và `INT-<bld>`. Phần này đặc tả **hệ thống** chở các dữ liệu đó.

## 1. Từ «phòng ngoài bản đồ» tới ô cổng

| | Hiện tại (`world.js › ROOMS`, `interior.js`) | Đích |
|---|---|---|
| Vị trí nội thất | dải x = 1.500–2.000 m, z ≈ 0 (ngoài bản đồ cũ) | trong vỏ ngoại thất, cùng tọa độ |
| Vào/ra | trạm `door_*`/`exit_*` + màn chuyển 1 s, dịch chuyển người chơi | bước qua ngưỡng cửa |
| Dựng | tất cả 6 điện dựng ngay khi khởi động (`createInteriors`) | nạp khi ≤ 60 m, dỡ khi > 90 m |
| Đèn | `LIGHTS[].room` + `roomAt()` | `LIGHTS[].cell` + ô cổng chứa camera/người chơi |
| Camera | kẹp trong hộp phòng (`roomAt` trong `render3d.js`) | kẹp trong đa giác ô + ẩn mái/tầng trên |
| Va chạm | `addPlatform` sàn + `addBlock` cột, một lớp | lưới nhiều lớp (tầng), có chủ sở hữu, nướng sẵn |

**Giữ «phòng túi» cho cảnh đặc biệt** (bản sơ đồ tổng §8.2 ý 1: Âm ty, mạn-đà-la) nhưng dời khỏi chỗ trùng Long Hổ Sơn (D4, TASK-071):

| Dải | Trước | Sau |
|---|---|---|
| Phòng túi | x 1.500–2.000, z ≈ 0 | x **2.600–3.600**, z ∈ [−400, 400] (ngoài biên thế giới mới ±2.304 m, phần 07) |
| `protocol.WORLD_TILES.maxX` | `10 + 1200` | `10 + 2250` (3.600 m ÷ 1,6 = 2.250 ô) |
| Điện hiện có (Chính Điện Tam Thanh, Văn Xương Các, Đẩu Mẫu Điện, Lão Quân Điện, Vận Mệnh Các, Thái Tuế Điện) | phòng túi | chuyển dần thành ô cổng trong vỏ thật (§9), phòng túi chỉ còn cho Âm ty và mạn-đà-la |

## 2. Ba lớp model (quy ước tệp)

| Lớp | Tệp | Nội dung | Ai tạo |
|---|---|---|---|
| `shell` | `bld_<region>_<nn>_shell[.hd\|.lod].glb` | tường có độ dày thật, mái, nền, lỗ cửa và cửa sổ mở thật | Meshy (ngoại thất) + chỉnh tay (khoét cửa), phần 10 |
| `interior` | không có tệp riêng; dựng từ bộ mô-đun theo `INT-<bld>` | cột, sàn, trần, vách ngăn, bậc | bộ `MOD-<bộ>-xx` |
| `props` | `prop_<tên>.glb` hoặc thủ tục | vật tương tác (bàn phù, chuông, kệ kinh) | Meshy nhẹ / thủ tục |

Quy ước tên mesh con trong `shell` (đặt trong Blender/gltf-transform trước khi đóng gói, kiểm ở `validate-assets`):

| Hậu tố tên mesh | Ý nghĩa | Hành vi lúc chạy |
|---|---|---|
| `__roof` | mái | mờ dần về 0 khi người chơi ở trong công trình |
| `__floorN` (N = 1, 2…) | sàn/tường thuộc tầng N | ẩn mọi tầng > tầng người chơi đang đứng khi ở trong |
| `__door_<id>` | cánh cửa | tách thành đối tượng động, xoay theo bản lề |
| `__win` | khung cửa sổ trong suốt | không đưa vào va chạm |
| `__nocol` | trang trí không va chạm | bỏ qua khi nướng va chạm |

## 3. SCHEMA-BUILDING

Tệp `src/game/data/buildings/<region>.json`, một mục cho mỗi công trình:

```jsonc
{
  "id": "BLD-thanh-01",                    // mã tài liệu 07 (minh họa)
  "name": "Chính Đường",
  "class": "A",                            // 'A'|'B'|'C'|'D'|'E' — bản sơ đồ tổng §8.1
  "region": "thanh",
  "shell": { "model": "palace_grand", "fit": { "width": 44 }, "at": { "x": 0, "y": 4, "z": -31, "ry": 0 } },
  "interior": "INT-BLD-thanh-01",          // SCHEMA-INTERIOR-LAYOUT (tài liệu 08 viết nội dung)
  "collision": "col/BLD-thanh-01.json",    // SCHEMA-COLLISION-BAKE (sinh bằng script)
  "cells": [ /* SCHEMA-CELL */ ],
  "portals": [ /* SCHEMA-PORTAL */ ],
  "doors": [ /* SCHEMA-DOOR */ ],
  "floors": [ { "n": 1, "y": 4.0 }, { "n": 2, "y": 9.2 } ],   // độ cao mặt sàn từng tầng (mét thế giới)
  "stairs": [ { "id": "s1", "from": 1, "to": 2, "poly": [[-3,-8],[-1,-8],[-1,-2],[-3,-2]], "axis": "z+" } ],
  "stations": ["thay"],                    // id STATIONS đặt trong công trình
  "npcs": [ { "npc": "thay_tubinh", "cell": "c1", "at": [0, -6], "schedule": "day" } ],
  "lights": [ { "cell": "c1", "at": [3, 3.2, -6], "color": "#ffb35c", "power": 1.2, "kind": "candle" } ],
  "loadRadius": 60, "unloadRadius": 90,    // m — bản sơ đồ tổng §8.2 ý 4
  "budget": { "drawCalls": 60, "tris": 150000, "lights": 4 },
  "dod": { "photos": "docs/art/thanh/BLD-thanh-01/", "status": "todo" }   // bản sơ đồ tổng §8.5
}
```

Tọa độ trong `cells`, `portals`, `stairs`, `npcs`, `lights` là **cục bộ** công trình (mét, gốc = `shell.at`, đã xoay `ry`). Hàm `toWorldB(b, [x, z])` đổi sang thế giới.

### 3.1 SCHEMA-CELL

```jsonc
{
  "id": "c1",
  "name": "Tổ Sư đường",
  "floor": 1,                              // tầng (khớp floors[].n)
  "poly": [[-20,-12],[20,-12],[20,6],[-20,6]],   // đa giác lồi XZ cục bộ, ngược chiều kim đồng hồ
  "yMin": 0, "yMax": 5.0,                  // so với mặt sàn tầng
  "ambient": 0.35,                         // hệ số đèn bán cầu khi camera trong ô (0–1)
  "camera": { "maxDist": 9, "pitch": [0.05, 0.6] }   // giới hạn camera khi người chơi ở ô này
}
```

Ô phải lồi (để `cellAt` O(cạnh)). Phòng hình chữ L tách thành hai ô nối bằng cổng ảo (`portal.virtual = true`, không có hình cửa).

### 3.2 SCHEMA-PORTAL

```jsonc
{
  "id": "p_front",
  "a": "outside", "b": "c1",               // hai phía; 'outside' = thế giới ngoài
  "quad": [[-2.5, 0, 6], [2.5, 0, 6], [2.5, 4.6, 6], [-2.5, 4.6, 6]],   // 4 đỉnh cục bộ (x, y so sàn, z), phẳng đứng
  "door": "d_front",                       // cửa đóng/mở gắn ở cổng này (null nếu lối trống)
  "virtual": false
}
```

### 3.3 SCHEMA-DOOR

```jsonc
{
  "id": "d_front",
  "mesh": "__door_front",                  // mesh trong shell; null → cửa thủ tục
  "hinge": [[-2.5, 6], [2.5, 6]],          // cửa hai cánh: bản lề hai đầu
  "openAngle": 1.9,                        // rad
  "trigger": 3.0,                          // m — người chơi trong bán kính thì mở
  "schedule": { "open": "卯", "close": "戌" },   // giờ can chi; null = luôn mở
  "sideDoor": "d_side",                    // cửa ngách luôn mở ban đêm (bản sơ đồ tổng §8.2 ý 6)
  "locked": null                           // SCHEMA-COND (phần 03) — vd chỉ mở khi có nhiệm vụ đêm
}
```

Trạng thái cửa **tính từ thời gian và điều kiện** (tất định), không đồng bộ qua MMO: mọi người cùng giờ thấy cùng trạng thái đóng/mở; cánh cửa xoay là hiệu ứng cục bộ.

## 4. Module `src/game/cells.js`

### 4.1 API

```js
export function createCellSystem({ scene, camera, quality }) {
  return {
    add(building),                         // SCHEMA-BUILDING đã nạp shell; tạo đồ thị ô/cổng
    remove(buildingId),                    // dỡ: ẩn, dispose interior, gỡ đèn, gỡ va chạm (owner)
    cellAt(x, y, z) → { building, cell } | null,
    update(player, dt) → { playerCell, cameraCell, visible: Set<cellKey> },
    doorState(buildingId, doorId, now) → { open: bool, reason },
    stats() → { buildings, cellsVisible, portalsTested, ms }
  };
}
```

### 4.2 `cellAt`

```
cellAt(x, y, z):
  cand = buildingsNear(x, z)                         // lưới băm 64 m → danh sách công trình
  for b in cand:
    (lx, lz) = toLocal(b, x, z)
    if !aabb(b).contains(lx, lz): continue
    for c in b.cells (theo floor giảm dần):
      fy = floorY(b, c.floor)
      if y ∈ [fy + c.yMin − 0.5, fy + c.yMax] && convexContains(c.poly, lx, lz): return { b, c }
  return null
```

O(B × C × V) với B công trình gần (≤ 6), C ô mỗi công trình (≤ 12), V đỉnh mỗi ô (≤ 8) → ≤ 600 phép so, dưới 0,02 ms.

### 4.3 Thuật toán hiển thị qua cổng

Mục tiêu: nội thất chỉ vẽ khi camera ở trong, hoặc nhìn thấy qua cửa (bản sơ đồ tổng §8.2 ý 4).

```
update():
  camCell = cellAt(camera.position)
  visible = ∅
  if camCell:                                        // camera trong nhà
    flood(camCell, rect = fullScreen, depth = 0)
    if có cổng 'outside' nhìn thấy → bật vẽ thế giới ngoài với rect đó (nếu không: tắt địa hình xa → tiết kiệm)
  else:                                              // camera ngoài trời
    for b in buildingsWithin(camera, 60 m):
      for p in b.portals where p.a == 'outside' && !p.virtual:
        if !doorOpenOrGlass(p) continue
        if distance(camera, p) > 40 m continue
        if dot(normal(p), camera − center(p)) ≤ 0 continue    // nhìn từ phía trong ra → bỏ
        r = screenRect(p)                                       // chiếu 4 đỉnh, cắt theo mặt near
        if r ∩ screen ≠ ∅: flood(p.b, r, depth = 1)

flood(cell, rect, depth):
  visible.add(cell)
  if depth ≥ 4 return
  for p in portals(cell):
    other = p.otherSide(cell); if other == 'outside' continue
    if p.door && !open(p.door) continue
    r2 = rect ∩ screenRect(p); if r2 rỗng continue
    flood(other, r2, depth + 1)
```

- `screenRect(p)`: biến 4 đỉnh sang không gian camera; đỉnh có z ≥ −near bị cắt bằng cạnh giao với mặt near (Sutherland–Hodgman một mặt), rồi chiếu, lấy hộp bao. Cổng nằm hẳn sau camera → rỗng.
- Đối tượng nội thất mỗi ô là một `Group` (`cellGroup`); `visible` của group = ô có trong tập. Không dùng `scissor` (đơn giản hóa: chỉ quyết định vẽ/không vẽ cả ô).
- **Độ phức tạp:** O(Σ cổng duyệt) mỗi khung; giới hạn độ sâu 4 và mỗi ô chỉ thêm một lần (bỏ `visible` đã có) → ≤ số cổng của các công trình gần (thường < 40). Mục tiêu ≤ 0,15 ms/khung trên máy tầm trung.
- Camera nhìn qua cửa sổ (`__win`): cửa sổ khai báo là cổng `virtual: false, door: null, glass: true` → xét như cổng mở.

### 4.4 Chế độ trong nhà

Khi `playerCell` thuộc công trình `b`:

1. **Mái và tầng trên:** mesh `__roof` của `b` mờ về 0 trong 0,4 s (dùng cơ chế `ownMaterials` + opacity như `fadeGroups` hiện có); `__floorN` với N > tầng người chơi ẩn hẳn (không chỉ mờ, để không chặn tia chọn điểm).
2. **Camera:** áp `cell.camera.maxDist`, khoảng `pitch`; kẹp vị trí camera trong đa giác ô mở rộng 0,3 m (thay kẹp hộp của `roomAt`). Nếu kẹp làm camera quá gần (< 2 m), chuyển sang góc nhìn qua vai cao hơn.
3. **Ánh sáng:** `hemi.intensity × cell.ambient`; `scene.environmentIntensity` giảm 40%; nhóm đèn điểm ưu tiên đèn trong `visible` (§6).
4. **Sương:** tắt sương xa (`fog.far` ×3) để không mờ nội thất.
5. **Thế giới ngoài:** nếu không có cổng `outside` nào trong `visible`, đặt `world.group.visible = false` và `landmarks.root.visible = false` (tiết kiệm lớn trong điện kín).

Ra khỏi công trình: hoàn tác theo thứ tự ngược, chuyển tiếp 0,4 s.

## 5. Va chạm nhiều lớp và có chủ sở hữu

### 5.1 Mở rộng `obstacles.js`

```js
export const CELL = 0.5;
// khóa ô gồm lớp: layer 0 = mặt đất/tầng 1; 1 = tầng 2 …
const ck = (layer, i, j) => ((layer * 160000) + (i + 40000)) * 80000 + (j + 40000);   // vẫn < 2^53
// chủ sở hữu: mỗi ô giữ số đếm theo chủ (đa số ô chỉ có 1 chủ)
const solid = new Map();                   // key → owner id (int) | Set<int> khi > 1 chủ
let currentOwner = 0;
export function withOwner(ownerId, fn) { const prev = currentOwner; currentOwner = ownerId; try { return fn(); } finally { currentOwner = prev; } }
export function markSolidCell(i, j, layer = 0) { … thêm currentOwner vào solid[ck(layer,i,j)] … }
export function removeOwner(ownerId) { … duyệt chỉ mục ngược owner → keys, gỡ … }
export function solidAt(x, z, layer = 0) { return solid.has(ck(layer, cellOf(x), cellOf(z))); }
export function blockedByBuilding(x, z, layer = 0) { … BODY 5 điểm trên lớp `layer` … }
```

- Chỉ mục ngược `ownerKeys: Map<ownerId, Uint32Array|number[]>` để `removeOwner` O(số ô của chủ) thay vì quét toàn bộ.
- Chủ `0` = tĩnh vĩnh viễn (tường Sơn Môn, vẽ thủ công trong `court.js`).
- Bộ nhớ: Sơn Môn + Huyền Thành hiện tại ước tính vài chục nghìn ô (suy luận theo diện tích công trình ÷ 0,25 m²); mỗi khóa trong `Map` ≈ 40–60 byte → vài MB. Phần 07 chuyển sang lưới bitset theo ô streaming khi thế giới lớn.

### 5.2 Nền, dốc, cầu thang

```js
// nền phẳng (đã có): addPlatform(x, z, w, d, ry, top)
// mới: dốc/cầu thang — mặt trên nội suy tuyến tính theo trục cục bộ z từ top0 tới top1
export function addRamp(x, z, w, d, ry, top0, top1, { layerFrom, layerTo }) { … }
export function surfaceAt(x, z, nearY) → { y, layer } | null   // chọn mặt gần nearY nhất trong ±1,2 m
```

- `platformTop(x, z)` hiện trả `top` lớn nhất → sai khi có hai tầng chồng nhau (luôn trả tầng trên). Thay bằng `surfaceAt(x, z, player.y)`: chọn mặt có |y − y_hiện_tại| nhỏ nhất và y ≤ y_hiện_tại + 0,45 (bước lên được bậc 45 cm).
- `player.layer` cập nhật theo `surfaceAt`; trên dốc cầu thang, lớp đổi khi đi qua nửa dốc.
- `world3d.groundY(x, z)` đổi chữ ký thành `groundY(x, z, nearY)` (tham số mới mặc định giữ hành vi cũ).

### 5.3 A* nhiều lớp

- Nút A* thêm chiều lớp: `(layer, i, j)`. Cạnh trong lớp như cũ; cạnh giữa lớp **chỉ** tại ô thuộc đa giác cầu thang (`stairs[].poly`), chi phí = độ dài dốc.
- Heuristic octile + 4 × |Δlayer| (mỗi lần đổi tầng ít nhất phải đi qua cầu thang).
- Giữ `MAX_NODES = 60.000`; trong nhà khung bao nhỏ nên đủ.

### 5.4 Cửa trong va chạm

- Ô của cánh cửa thuộc chủ `door:<bld>:<id>`. Cửa mở → `removeOwner`; đóng → đánh dấu lại (từ dữ liệu nướng sẵn của cửa, không cắt lát lại).
- Người chơi đứng trong ô cửa khi cửa sắp đóng → hoãn đóng tới khi ra khỏi bán kính trigger.

## 6. Ánh sáng trong ô cổng

- `lights.js › addLight(x, y, z, { cell })` thay `room` bằng `cell` (`'<bld>:<cellId>'`); `room` cũ giữ làm bí danh trong thời gian chuyển đổi.
- Chọn đèn cho nhóm `POOL_N` mỗi 0,3 s:

```
if playerCell:
  pool ← đèn thuộc các ô trong `visible`, sắp theo khoảng cách; nếu dư chỗ, thêm đèn ngoài trời gần cửa (≤ 20 m)
else:
  pool ← như hiện tại (đèn ngoài trời trong 140 m) + đèn của ô thấy qua cửa (cường độ × 0,6)
```

- Ngân sách đèn/ô ≤ 4 (`budget.lights`); kiểm ở `validate-buildings`.
- Nguồn sáng thật (nến, đèn bơ, đèn lồng) bắt buộc có mesh phát sáng (`addGlow`) cùng vị trí (bản sơ đồ tổng §8.5 ý 4).

## 7. Va chạm nướng sẵn — SCHEMA-COLLISION-BAKE

### 7.1 Vì sao nướng sẵn

1. Không đi xuyên khi GLB chưa nạp (D6).
2. Node test kiểm được Định nghĩa Done (đường A* vào/ra) mà không cần THREE.
3. Không tốn CPU cắt lát lúc chơi (cắt lát `palace_grand` hiện chạy trên luồng chính khi nạp).

### 7.2 Định dạng

`public/col/<bldId>.json` (hoặc `.bin` nếu > 64 KB):

```jsonc
{
  "id": "BLD-thanh-01",
  "v": 3,                                  // tăng khi model hoặc vị trí đổi
  "srcHash": "e81c…",                      // băm GLB nguồn + transform → phát hiện cũ
  "cell": 0.5,
  "origin": [-24.0, -46.5],                // góc (x, z) thế giới của ô (0, 0) trong lưới
  "w": 104, "h": 96,                       // số ô
  "layers": [
    { "layer": 0, "y0": 4.0, "rle": "…" },  // RLE theo hàng: «n0,n1,n2…» luân phiên trống/đặc, base64 nén
    { "layer": 1, "y0": 9.2, "rle": "…" }
  ],
  "platforms": [ { "x": 0, "z": -31, "w": 40, "d": 26, "ry": 0, "top": 4.0, "layer": 0 } ],
  "ramps": [ { "x": -2, "z": -5, "w": 2, "d": 6, "ry": 0, "top0": 4.0, "top1": 9.2, "from": 0, "to": 1 } ],
  "doors": { "d_front": { "layer": 0, "cells": "…rle…" } }
}
```

### 7.3 Script `scripts/bake-collision.mjs`

```
node scripts/bake-collision.mjs [BLD-id…|--region thanh|--all] [--check]
```

1. Đọc SCHEMA-BUILDING; nạp GLB bằng `@gltf-transform/core` `NodeIO` (đăng ký `ALL_EXTENSIONS`, giải nén meshopt bằng `meshoptimizer` — cả hai đã có trong `devDependencies`/phụ thuộc gián tiếp, dùng như `meshy-lod.mjs`).
2. Áp transform đặt (`fit`, `at`) giống hệt `assets.placeModel` (tính khung bao, tỉ lệ, dời đáy) — tách công thức `placeTransform()` thành hàm thuần dùng chung client và script (TASK-074).
3. Với mỗi tầng: cắt lát dải `[y_sàn + 0,4, y_sàn + 2,0]` bằng **cùng thuật toán** `collide.js` (tách phần raster thành `collide-core.js` thuần, không phụ thuộc THREE).
4. Bỏ mesh `__nocol`, `__win`; mesh `__door_*` ghi riêng vào `doors`.
5. Khoét cửa: ô nằm trong hình chiếu của `portals[].quad` (lối đi) bị bỏ khỏi lớp tương ứng.
6. `--check`: so `srcHash` với tệp hiện có, báo công trình cần nướng lại (CI chạy).

Thời gian ước tính: `palace_grand.lod` (~12% tam giác của 150k) cắt lát < 1 s trên Node (suy luận theo độ phức tạp tuyến tính số tam giác).

### 7.4 Nạp lúc chạy

- `cells.add(b)` → tải `col/<id>.json` (nhỏ, có trước GLB) → `withOwner('bld:' + id, () => applyBake(bake))`.
- Nếu không có tệp nướng (công trình đang làm) → rơi về cắt lát lúc chạy như hiện nay, kèm cảnh báo dev.

## 8. Nội thất mô-đun

### 8.1 SCHEMA-INTERIOR-KIT

`src/game/data/kits/<bộ>.json` — danh mục mô-đun của một bộ (tài liệu 08 viết nội dung `MOD-*`):

```jsonc
{
  "kit": "dao-bac",                        // bộ «Đạo quán phương Bắc» (bản sơ đồ tổng §8.3)
  "grid": 3.2,                             // m — một gian
  "palette": "palette/dao-bac.json",       // bảng màu khóa của bộ
  "modules": [
    {
      "id": "MOD-daobac-01",               // mã tài liệu 08 (minh họa)
      "name": "Cột sơn đỏ + chân tảng",
      "asset": "mod_daobac_01",            // public/models/mod_daobac_01.glb
      "snap": "corner",                    // 'corner' (giao lưới) | 'bay' (giữa gian) | 'edge' (cạnh gian) | 'free'
      "size": [0.9, 6.0, 0.9],             // m (khung bao)
      "col": "circle:0.45",                // va chạm: 'none' | 'bake' | 'circle:r' | 'rect:w,d'
      "lights": [],
      "tris": 2400,
      "variants": ["MOD-daobac-01b"]
    }
  ]
}
```

### 8.2 SCHEMA-INTERIOR-LAYOUT

`src/game/data/interiors/INT-<bld>.json`:

```jsonc
{
  "id": "INT-BLD-thanh-01",
  "building": "BLD-thanh-01",
  "kit": "dao-bac",
  "origin": [-19.2, -12.8],                // góc lưới gian, cục bộ công trình
  "items": [
    { "mod": "MOD-daobac-01", "g": [0, 0], "floor": 1, "rot": 0 },
    { "mod": "MOD-daobac-07", "g": [6, 1], "floor": 1, "rot": 2, "cell": "c1" },
    { "prop": "prop_ban_phu", "at": [2.4, -6.0], "floor": 1, "rot": 0.3, "station": "ketphu" }
  ]
}
```

- `g` là chỉ số gian (nguyên); vị trí = `origin + g × grid` (+ nửa gian với `snap: 'bay'`).
- `rot` theo bội 90° cho mô-đun lưới; số thực (rad) cho đạo cụ tự do.
- Dựng lúc chạy: gom mô-đun cùng `asset` thành `InstancedMesh` theo ô (`cellGroup`) → số lượt vẽ ≈ số loại mô-đun khác nhau trong ô, không theo số mảnh.

### 8.3 Công cụ khớp lòng nhà — `scripts/interior-fit.mjs`

```
node scripts/interior-fit.mjs BLD-thanh-01 [--kit dao-bac] [--out draft]
```

1. Đọc va chạm nướng sẵn lớp 0, lấy vùng trống **bên trong** vỏ (flood fill từ ô ngoài cùng; ô trống không chạm được từ ngoài = lòng nhà; bản sơ đồ tổng §8.2 ý 2).
2. Khớp lưới gian 3,2 m vào hộp bao lòng nhà (dịch gốc để cực đại số gian trọn).
3. Đặt cột ở giao lưới không đè cửa; đặt mô-đun bắt buộc theo hạng công trình (hạng A: bàn thờ ở gian giữa sau cùng, hương án trước nó, bồ đoàn).
4. Ghi `INT-<bld>.draft.json` để họa sĩ/level designer sửa; không ghi đè bản đã duyệt.

## 9. Lộ trình chuyển các công trình Sơn Môn (bản sơ đồ tổng §8.4)

| Công trình | Hiện tại | Bước kỹ thuật | TASK |
|---|---|---|---|
| Chính Đường (`palace_grand`) | khối liền, có bàn thầy bên ngoài | khoét cửa giữa trong shell; 2 tầng; ô `c1` Tổ Sư đường, `c2` tàng kinh; bàn thầy vào trong (trạm `thay` dời) | TASK-101 … TASK-104 |
| Điện phụ Đông/Tây (`hall_main`) | cửa trạm `door_vanmenh`/`door_thaitue` → phòng túi | dựng Vận Mệnh Các, Thái Tuế Điện **trong** vỏ; bỏ hai phòng túi; giữ dữ liệu `vanmenh-ui › roomData` | TASK-105, TASK-106 |
| Lầu chuông/trống (`lib_pavilion2`) | không vào được | tầng 2 + cầu thang + chuông/trống tương tác; sự kiện MMO «chuông sớm/trống chiều» | TASK-107 |
| 4 bảo tháp góc | không vào được | tầng trệt + cầu thang lên tầng ngắm cảnh + chuông gió theo hành | TASK-108 |
| Sơn Môn, Hậu Môn (`gate_sect`) | cổng xuyên được | phòng gác hai bên cổng, NPC `gac_cong` | TASK-109 |
| 30 nhà vườn (`lib_courtyard`, nhân bản) | khối liền | mỗi nhà một `BLD-thanh-xx`; vỏ vẫn nhân bản (InstancedMesh) nhưng nội thất + cửa riêng nạp khi ≤ 60 m; NPC gia đình từ `npc.js › makeNpc` | TASK-110, TASK-111 |
| Hậu Sơn (`cliff_palace`) + Chính Điện Tam Thanh | phòng túi (1.500, 0) | dựng Chính Điện trong `cliff_palace`; Thầy Giải Quẻ dời theo | TASK-112 |

## 10. Ngân sách hiệu năng cho một công trình

| Chỉ số | Hạng A | Hạng B | Hạng C | Hạng D/E |
|---|---|---|---|---|
| Lượt vẽ nội thất (khi ở trong) | ≤ 60 | ≤ 35 | ≤ 20 | 0 |
| Tam giác nội thất | ≤ 150k | ≤ 80k | ≤ 40k | — |
| Đèn điểm dùng | ≤ 4/ô | ≤ 3/ô | ≤ 2/ô | — |
| Texture riêng (ngoài atlas bộ mô-đun) | ≤ 2 × 1.024² | ≤ 1 × 1.024² | 0 | — |
| Thời gian dựng khi nạp | ≤ 8 ms/khung (chia nhiều khung) | ≤ 4 ms | ≤ 2 ms | — |

Đo ở phần 09; vượt ngân sách → `validate-buildings` báo đỏ.

## 11. Định nghĩa Done tự động (bản sơ đồ tổng §8.5)

`scripts/test-building-dod.mjs [region|BLD-id]` — chạy bằng Node trên dữ liệu nướng sẵn:

| Ý §8.5 | Kiểm tự động | Kiểm thủ công |
|---|---|---|
| 1. Đi từ đường chính tới cửa, vào, ra, không kẹt | A* nhiều lớp từ điểm đường gần nhất (`landmarks.roadPath`) tới từng ô và trở ra; mọi ô tới được; cửa rộng ≥ 1,2 m (3 ô trống liền) | — |
| 2. Nội thất khớp phong cách và công năng | mọi `items[].mod` thuộc đúng `kit` của vùng; hạng A có đủ mô-đun bắt buộc | duyệt ảnh |
| 3. ≥ 1 tương tác (A: ≥ 3) gắn engine/nhiệm vụ | đếm `stations` + `npcs` + đạo cụ có `station`; mỗi `station` có trong `STATIONS` hoặc danh mục mini-game | — |
| 4. Ánh sáng ngày/đêm, nguồn sáng thật | mỗi `lights[]` có mesh phát sáng trong bán kính 0,5 m | duyệt ảnh đêm |
| 5. ≥ 30 khung/giây trong nhà, nội thất ẩn ở xa | đo bằng phần 09 (Playwright, đường camera đi vào) | — |
| 6. Ảnh 4 góc + 1 trong nhà | Playwright chụp theo `dod.photos`, kiểm tệp tồn tại | duyệt |

## 12. Chế độ lỗi

| Lỗi | Phát hiện | Xử lý |
|---|---|---|
| Ô không lồi | validator | từ chối dữ liệu |
| Cổng không nằm trên ranh giới hai ô | validator: tâm cổng cách cạnh chung ≤ 0,2 m | từ chối |
| Camera kẹt trong tường khi kẹp đa giác | khoảng cách camera–người < 1,5 m quá 1 s | chuyển góc qua vai |
| Người chơi đứng sai lớp (rơi tầng) | `surfaceAt` không tìm được mặt trong ±1,2 m | đặt lại về mặt gần nhất bên dưới, ghi cảnh báo |
| Tệp nướng cũ so với model | `--check` trong CI; lúc chạy so `srcHash` khai báo | dùng cắt lát lúc chạy, cảnh báo |
| Nội thất chưa nạp xong khi người chơi tới cửa | `cells.add` theo bán kính 60 m (đủ ~10 s đi bộ ở 3,5 ô/s ≈ 5,6 m/s) | cửa giữ đóng tới khi nạp xong (cửa ngách cũng vậy), hiện hạt bụi vàng «đang thắp đèn» |

## 13. Kiểm thử

| Bộ | Ca |
|---|---|
| `test-cells.mjs` | `cellAt` biên đa giác, hai tầng chồng nhau; `flood` qua cửa đóng/mở; cổng sau camera rỗng; độ sâu 4 |
| `test-obstacles-layers.mjs` | đánh dấu/gỡ theo chủ; hai chủ cùng một ô; `removeOwner` chỉ gỡ ô của mình; `surfaceAt` chọn đúng tầng; dốc đổi lớp |
| `test-astar-layers.mjs` | đường lên tầng 2 qua cầu thang; không đi xuyên sàn; giới hạn nút |
| `test-bake.mjs` | nướng một GLB mẫu nhỏ (hộp có lỗ cửa) → ô cửa trống, tường đặc; kết quả nướng khớp cắt lát lúc chạy (`collide.js`) trên cùng model ở trình duyệt (so trong Playwright) |
| `test-building-dod.mjs` | §11 cho mọi công trình có `dod.status ≠ 'todo'` |
