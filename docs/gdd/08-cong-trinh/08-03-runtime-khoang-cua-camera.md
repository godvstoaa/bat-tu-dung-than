# 08-03 · Runtime: khoang, cửa nhìn, cửa thật, mờ mái, camera trong nhà

> Thiết kế hệ chạy trong trình duyệt (Three.js 0.170, `render3d.js`) để **nội thất nằm đúng chỗ trong vỏ**, đi qua cửa là vào thẳng. Mọi module mới ghi «(chưa có — cần làm)». Chỗ nối vào code hiện có ghi theo tên hàm / biến thật.

---

## 1. Kiến trúc module

| Module | Trạng thái | Trách nhiệm |
|---|---|---|
| `src/game/int/*.js` | chưa có — cần làm | **Công thức** từng công trình (dữ liệu thuần: khoang, cửa nhìn, cửa, thang, trạm, NPC, đèn, mảnh mô-đun). Node đọc được. |
| `src/game/int/index.js` | chưa có — cần làm | Xuất mảng `BUILDINGS` (import tường minh, không dùng `import.meta.glob` để test Node chạy được) |
| `src/game/buildings.js` | chưa có — cần làm | Sổ đăng ký: tra công trình theo id, gắn vỏ đã đặt (`registerShell`), sinh trạm vào `world.js › STATIONS` |
| `src/game/cells.js` | chưa có — cần làm | Đồ thị khoang – cửa nhìn, tra khoang theo điểm, tính khoang thấy được mỗi khung, nạp / dỡ nội thất |
| `src/game/doors.js` | chưa có — cần làm | Thực thể cửa: trạng thái, lịch giờ can chi, hoạt cảnh, chặn động |
| `src/game/kit.js` | chưa có — cần làm | Nạp bộ mô-đun, lắp mảnh thành nhóm khoang (instancing + `mergeStatic`) |
| `src/game/obstacles.js` | **có**, mở rộng | thêm tầng `lv`, ô nướng (`addBakedCells`), chặn động (`setDynamicBlock`), liên kết cầu thang |
| `src/game/world.js` | **có**, mở rộng | `blockedAt` theo `lv`; A* phân cấp (08-04 §3); gỡ `ROOMS` khi chuyển xong |
| `src/game/render3d.js` | **có**, mở rộng | gọi `cells.update`, `doors.update`; luật mờ mới; camera trong nhà; pool đèn theo khoang |
| `src/game/interior.js` | **có**, thay vai | từ «dựng phòng ngoài bản đồ» thành «bộ lắp đặc biệt» (biển can chi Vận Mệnh, vách 60 bài vị Thái Tuế) gọi từ công thức |
| `src/game/lights.js` | **có**, mở rộng | `addLight(…, { cell, lv, kind })` |
| `src/game/audio.js` | **có**, mở rộng | vang theo khoang, che âm qua cửa nhìn (08-04 §4) |

### 1.1 Dòng chảy mỗi khung hình

```
render3d.loop(dt)
  ├─ world.update(px, pz)                         (có)
  ├─ cells.update(player, camera, dt)             (mới)
  │    ├─ cellAt(player) → cells.current, player.lv
  │    ├─ stream: hàng đợi nạp / dỡ (≤ 4 ms / khung)
  │    └─ visibility(camera) → group.visible từng khoang
  ├─ doors.update(now, avatars, dt)               (mới)
  ├─ updateLightPool(px, py, pz, dt)              (có, đổi bộ lọc theo khoang)
  ├─ camera: rig ngoài trời (có) → rig trong nhà (mới, §8)
  ├─ fade: fadeGroups với luật (§7)               (có, mở rộng)
  └─ interiors.update(dt)                         (có: hoạt cảnh NPC, biển động)
```

### 1.2 Chỗ nối vào `render3d.js` hiện có

| Dòng hiện có | Đổi thành |
|---|---|
| `lightRoom = roomAt(w.x, w.z)?.id \|\| null;` | `lightCell = cells.current?.id \|\| null;` và bộ lọc `updateLightPool` dùng tập đèn của khoang hiện tại + khoang kề (08-04 §1.3) |
| khối `const inRoom = roomAt(cam.target.x, cam.target.z); if (inRoom) { … }` | `cameraIndoor(cam, camera, cells.current)` (§8) |
| vòng `for (const g of fadeGroups) { … }` | `applyFade(fadeGroups, ctx)` với luật theo `g.userData.fadeRule` (§7) |
| `onBig: (obj) => { MD.ownMaterials(obj); … fadeGroups.push(obj); }` trong `buildSect` | `onBig` nhận thêm `bldId`; nếu công trình có trong `BUILDINGS` thì `buildings.registerShell(bldId, obj)` tách nhóm `SH__*` và đăng ký từng nhóm với luật riêng |
| `const interiors = createInteriors(scene);` | `const cells = createCells(scene, { buildings, kit })`; `createInteriors` chỉ còn dựng phòng đặc biệt chưa chuyển |

---

## 2. Cấu trúc dữ liệu

Tọa độ trong công thức là **cục bộ công trình** (gốc = tâm khung bao chân vỏ đã đặt, +Z = mặt tiền, đơn vị mét, Y tuyệt đối theo đáy vỏ). `buildings.js` đổi sang thế giới bằng `local()` cùng quy ước `landmarks.js`.

### 2.1 Công trình

```js
// src/game/int/sm-chinhduong.js (chưa có — cần làm)
export default {
  id: 'INT-SM-CHINHDUONG', slug: 'sm-chinhduong', cls: 'A', region: 'thanh',
  shell: { model: 'palace_grand', cut: 'bld/sm-chinhduong/shell', fit: { width: 44 }, at: { x: 0, y: 4, z: -31, ry: 0 } },
  kit: ['BAC', 'KT'], palette: 'huyenquan',
  levels: [ { lv: 0, floorY: 0.45, ceilY: 6.4 }, { lv: 1, floorY: 9.65, ceilY: 12.9 } ],   // cục bộ: cộng at.y khi ra thế giới
  cells: [ /* §2.2 */ ], portals: [ /* §2.3 */ ], doors: [ /* §2.4 */ ], stairs: [ /* 08-04 §2 */ ],
  stations: [ /* §2.6 */ ], npcs: [ /* §2.7 */ ], lights: [ /* 08-04 §1 */ ], audio: { /* 08-04 §4 */ },
  pieces: [ /* §2.8 */ ], special: [ /* bộ lắp đặc biệt trong interior.js */ ],
  stream: { load: 80, unload: 120 },
  ios: { /* trạm thay thế khi features.js tắt */ },
  col: 'bld/sm-chinhduong.col.json',
};
```

| Trường | Bắt buộc | Ý nghĩa |
|---|---|---|
| `id` | có | mã `INT-*` |
| `cls` | có | `A`…`E` (08-01) |
| `shell` | có | vỏ: mô hình gốc, bản khoét, fit, vị trí — **trùng** lời gọi `placeModel` hiện có (kiểm trong test) |
| `kit` | có (A–C) | bộ mô-đun dùng; `KT` (kỹ thuật chung) luôn có |
| `palette` | có | bảng màu khóa nhân vào atlas xám (08-02 §3.4) |
| `levels` | có | cao độ sàn / trần từng tầng — lấy từ `void.json` |
| `stream` | không | mặc định theo hạng (08-01 §2) |
| `ios` | khi có trạm bị `features.js` tắt | công năng thay thế (08-01 §9.4) |

### 2.2 Khoang (cell)

```js
{ id: 'cd.l0.chinh', lv: 0, name: 'Tổ Sư đường',
  box: [-10.0, 0.45, -9.6, 10.0, 6.4, 0.9],           // x0 y0 z0 x1 y1 z1 (cục bộ)
  sealed: true,                                        // kín: không thấy trời khi đóng cửa
  ambient: 0.30, exposure: 0.25,                       // 08-04 §1.4
  reverb: 'dai_dien', bed: 'tung_xa_mo',               // 08-04 §4
  camera: { mode: 'trong', maxDist: 7.5, pitch: [0.12, 0.75], fovAdd: 6 },
  fade: ['roof_L0', 'roof_L1', 'upper_L1'],            // nhóm vỏ mờ khi người chơi ở khoang này
  lightsMax: 4, npcMax: 4 }
```

Khoang là **hộp theo trục cục bộ**; phòng hình chữ L dùng hai khoang nối bằng cửa nhìn loại `open`. Khoang không chồng nhau trong cùng `lv` (test kiểm). Hai khoang khác `lv` được chồng theo XZ.

### 2.3 Cửa nhìn (portal)

```js
{ id: 'cd.p.giua', a: 'out', b: 'cd.l0.chinh', kind: 'door',
  quad: [[-1.6, 0.45, 0.9], [1.6, 0.45, 0.9], [1.6, 4.2, 0.9], [-1.6, 4.2, 0.9]],
  door: 'cd.d.giua', walk: true }
```

| `kind` | Đi qua được | Nhìn qua được | Ví dụ |
|---|---|---|---|
| `door` | có (khi cửa mở) | khi cửa mở / hé | cửa chính, cửa phòng |
| `window` | không | luôn (song cửa, giấy dán mờ: nhìn qua 35 %) | cửa sổ |
| `open` | có | luôn | ô thông giữa hai khoang của phòng chữ L, cửa vòm không cánh |
| `stair` | có | luôn | miệng cầu thang giữa hai tầng |
| `lattice` | không | luôn, đủ | vách lưới (bức bàn đóng), song sắt Âm ty |

`a` / `b` là id khoang hoặc `'out'` (ngoài trời). Tứ giác theo thứ tự ngược chiều kim đồng hồ nhìn từ `a`.

### 2.4 Cửa thật (door)

```js
{ id: 'cd.d.giua', portal: 'cd.p.giua', kind: 'canh2', lv: 0,
  leaves: [ { hinge: [-1.6, 0.45, 0.9], w: 1.6, h: 3.75, open: 1.75, dir: -1 },
            { hinge: [ 1.6, 0.45, 0.9], w: 1.6, h: 3.75, open: 1.75, dir: +1 } ],
  schedule: 'dien_chinh', lock: null, carve: [-1.6, 0.6, 1.6, 1.2], sound: 'go_nang',
  mod: 'MOD-BAC-20' }
```

Chi tiết ở §6.

### 2.5 Trạng thái runtime của khoang

```js
cellState.get('cd.l0.chinh') = {
  status: 'none' | 'loading' | 'ready',
  group: THREE.Group | null,      // gốc nội thất khoang (đã gộp)
  props: THREE.Object3D[],        // đạo cụ động
  visible: false, seenAt: 0,      // để dỡ theo LRU
  lights: LightRef[],             // tham chiếu tới LIGHTS
}
```

### 2.6 Trạm (station) trong công trình

```js
{ id: 'tosu', kind: 'van', cell: 'cd.l0.chinh', lv: 0,
  name: 'Bài Vị Tổ Sư', verb: 'Dâng hương tổ sư',
  at: [0, 0.45, -7.2], spot: [0, 0.45, -5.2], label: [0, 3.4, -7.2],
  engine: 'remedy-fate › TEN_THIEN', daily: 'tosu' }
```

`buildings.js` đổi `spot` / `at` sang thế giới rồi sang ô (`toTile`) và **đẩy vào `world.js › ALL_STATIONS`** với thêm `bld`, `cell`, `lv`, `world`, `y`. Trường `engine` bắt buộc với trạm nối engine (08-01 §9.3), `quest` với trạm nhiệm vụ.

### 2.7 NPC trong công trình

```js
{ npc: 'thay_tubinh', cell: 'cd.l0.chinh', lv: 0,
  schedule: [ ['Mão', 'Ngọ', 'bethay'], ['Mùi', 'Dậu', 'bethay'], ['Tuất', 'Tuất', 'cd.l0.chinh:SE__tosu_ghe'], ['Hợi', 'Dần', 'nghi'] ],
  model: 'master', pose: 'sit' }
```

Lịch theo **giờ can chi** (§6.3). `nghi` = rời cảnh (không vẽ).

### 2.8 Mảnh mô-đun

```js
pieces: [
  ['MOD-BAC-07', [-8.0, 0.45, -8.0], { ry: 0, cell: 'cd.l0.chinh', n: 4, step: [5.33, 0, 0] }],   // 4 cột lặp theo bước
  ['MOD-BAC-31', [0, 0.45, -8.4], { ry: 0, cell: 'cd.l0.chinh', color: '#7a1c14' }],
  …
]
```

`n` + `step` cho hàng lặp; `kit.js` gom mọi bản cùng mã trong một khoang thành một `InstancedMesh`.

---

## 3. Tra khoang

### 3.1 `cellAt(x, y, z, lvHint)`

1. **Lưới băm 16 m** (dựng khi nạp công trình): ô băm → danh sách công trình có khung bao chạm ô.
2. Với từng công trình ứng viên: đổi điểm sang cục bộ (trừ `at`, xoay `−ry`), kiểm `box` từng khoang.
3. Nhiều khoang chứa điểm (khác `lv`): chọn khoang có `lv === lvHint`; không có `lvHint` (camera) thì chọn khoang mà `y ∈ [box.y0 − 0,2, box.y1]`.
4. Trả `null` nếu ở ngoài mọi khoang (ngoài trời — kể cả đứng dưới hiên không thuộc khoang).

Chi phí: ≤ 3 công trình × ≤ 12 khoang mỗi lần gọi; gọi 2 lần / khung (người chơi, camera).

### 3.2 Ngưỡng và trễ

Đổi khoang của **người chơi** chỉ khi đã vượt mặt cửa nhìn ≥ 0,3 m (đo theo pháp tuyến tứ giác) — tránh nhấp nháy đèn / âm khi đứng ngay ngưỡng. Đổi khoang của **camera** không trễ (camera phải biết ngay mình ở đâu để tính cửa nhìn).

### 3.3 Tầng người chơi `player.lv`

Do cầu thang quyết định (08-04 §2.3). `cellAt` dùng `player.lv` làm `lvHint`. Khi người chơi dịch chuyển (truyền tống, hồi sinh), `lv` đặt theo đích.

---

## 4. Tính khoang thấy được (portal culling)

### 4.1 Thuật toán

```js
// cells.js (chưa có — cần làm) — gọi mỗi khung, sau khi camera đã đặt
function visibility(camera) {
  for (const st of loaded) st.visible = false;
  const camCell = cellAt(camera.position, null);
  const full = { x0: -1, y0: -1, x1: 1, y1: 1 };                // NDC
  if (camCell) walk(camCell, full, 0);
  else for (const b of nearBuildings(camera.position, 80))        // camera ngoài trời
    for (const p of b.outPortals) {
      if (p.kind === 'door' && !doors.seeThrough(p.door)) continue;
      if (dist(camera.position, p.center) > 60) continue;
      const r = clipRect(project(p.quad, camera), full); if (!r) continue;
      walk(p.inner, r, 1);
    }
  if (player.cell) walk(player.cell, full, 0);                    // BỔ DỌC: camera ngoài, người trong
  for (const st of loaded) st.group.visible = st.visible;
}
function walk(cell, rect, depth) {
  const st = state(cell); st.visible = true; st.seenAt = now;
  if (depth >= 4) return;
  for (const p of cell.portals) {
    const next = p.a === cell.id ? p.b : p.a;
    if (next === 'out' || visitedThisFrame(next, rect)) continue;
    if (p.kind === 'door' && !doors.seeThrough(p.door)) continue;
    const r = clipRect(project(p.quad, camera), rect); if (!r) continue;
    walk(cell(next), r, depth + 1);
  }
}
```

### 4.2 Chiếu tứ giác

- Chiếu 4 góc sang NDC bằng `vector.project(camera)`.
- Nếu **bất kỳ** góc nằm sau camera (`w ≤ 0` trước khi chia) → coi như toàn màn (`full`) — bảo thủ, tránh mất khoang khi camera sát cửa.
- Hình chữ nhật bao 4 điểm, giao với `rect` cha; rỗng → dừng.
- Nới mỗi cạnh 0,02 NDC (tránh rách mép).

### 4.3 Ngoài trời khi đang ở trong

- Khoang `sealed: true` và **không** cửa nhìn ra `out` nào lọt vào màn (đã chiếu) → tắt nhóm ngoài trời nặng: `world.group` (địa hình chunk xa, rừng), `landmarks.root` trừ công trình hiện tại. Tiết kiệm 40–70 % draw call ở chính điện kín.
- Khoang có cửa sổ ra `out` (thường là vậy) → giữ ngoài trời nhưng hạ `QUALITY.treesNear` hiệu lực về 1/3 trong lúc ở trong (cây chỉ thấy qua ô cửa).

### 4.4 Ca biên

| Ca | Xử lý |
|---|---|
| Camera xuyên tường (trước khi rig kẹp kịp) | `camCell = null` → coi như ngoài trời; rig §8 kẹp ngay khung sau |
| Hai khoang thông nhau bằng nhiều cửa nhìn | `visitedThisFrame` theo (khoang, rect) — cho phép thăm lại nếu rect mới không nằm trong rect cũ |
| Cửa sổ giấy dán | `window` thấy qua nhưng vật liệu cửa sổ bán trong (opacity 0,35) — vẫn tính khoang sau là thấy |
| Gương, mặt nước phản chiếu trong nhà | không dùng (không có reflection render-target trong game) |
| Công trình chưa nạp nội thất mà camera nhìn qua cửa | thấy **thẻ tối** (quad đen ấm sau ô cửa, §7.6 08-02) — không thấy xuyên ra phía sau vỏ |

---

## 5. Nạp / dỡ nội thất (streaming)

### 5.1 Bán kính

| Hạng | Bắt đầu nạp | Dỡ khi | Giới hạn đồng thời |
|---|---|---|---|
| A | 80 m | > 120 m và không thấy 60 s | 2 |
| B | 60 m | > 100 m và không thấy 45 s | 4 |
| C | 40 m | > 70 m và không thấy 30 s | 3 nhà |
| D | cùng lúc với vỏ (`landmarks` ≤ 900 m) | cùng vỏ | — |

Khoảng cách tính tới **cửa gần nhất** của công trình, không tới tâm (công trình 170 m rộng ở Tử Bình).

### 5.2 Hàng đợi

- Ưu tiên = `khoảng cách / (1 + 2 · hướng)` với `hướng` = cos góc giữa hướng nhìn camera và hướng tới cửa (nhìn về phía công trình thì nạp trước).
- Mỗi khung dành **≤ 4 ms** cho lắp ráp: `kit.assemble` chạy theo lô 200 bản sao; đo bằng `performance.now()`, hết giờ thì nhường khung sau.
- Bộ mô-đun nạp theo vùng (cùng lúc `landmarks` nạp vùng ≤ 900 m), giữ trong bộ nhớ suốt phiên (dùng chung giữa công trình).
- Dỡ: `geometry.dispose()` / `material.dispose()` cho thứ **thuộc riêng** công trình (lưới gộp, canvas); không đụng hình học bộ mô-đun dùng chung.

### 5.3 Truyền tống vào trong nhà

Dịch chuyển tới trạm trong nhà (menu «Các gian», hồi sinh): (1) màn mờ; (2) đặt người chơi; (3) chờ khoang đích `ready` (tối đa 3 s, hiện «Đang thắp đèn…»); (4) mở màn. Không bao giờ thả người chơi vào khoang chưa có va chạm: va chạm nướng (`col.json`) nạp cùng vỏ, độc lập với nội thất hình ảnh, nên luôn có trước.

---

## 6. Cửa thật

### 6.1 Loại cửa

| `kind` | Mô tả | Hoạt cảnh mở | Thời gian | Dùng ở |
|---|---|---|---|---|
| `canh1` | một cánh bản lề | xoay quanh bản lề 95° | 0,7 s | phòng nhà dân, tĩnh thất |
| `canh2` | hai cánh đối xứng | mỗi cánh xoay 100° ra hai phía | 0,9 s | điện, nhà chính |
| `bucban` | cửa bức bàn nhiều tấm (4–6 tấm lưới) | hai tấm giữa xoay vào trong 95°; các tấm còn lại giữ (là `lattice`) | 0,9 s | điện Giang Nam, Chùa Việt |
| `congnang` | cổng gỗ nặng đinh đồng | xoay 90° vào trong, có rung dư 0,1 s | 2,4 s | Sơn Môn, thành môn, cổng tông môn |
| `ngach` | cửa nhỏ trổ trên cánh cổng / tường | xoay 90° | 0,6 s | ngách đêm |
| `rem` | rèm vải (Tạng, Miêu) | vén sang hai bên (biến dạng đỉnh lưới) | 0,5 s | không chặn đi |
| `truot` | cánh trượt | trượt ngang dài 1 cánh | 0,7 s | gác, kho |
| `luoi` | song sắt (Âm ty) | nâng lên dọc | 1,6 s | Phong Đô |
| `vom` | ô vòm không cánh | — | — | luôn mở |

### 6.2 Trạng thái

| Trạng thái | Nghĩa | Chặn đi | Nhìn qua |
|---|---|---|---|
| `DONG` | đóng, mở được khi tới gần | không (tự mở khi tiếp cận) | không (`bucban`: qua lưới) |
| `DANG_MO` | đang mở | không | có |
| `MO` | mở hẳn | không | có |
| `DANG_DONG` | đang đóng | không (nếu có người trong ô cửa → quay lại `DANG_MO`) | có |
| `HE` | hé (đêm, ngách) | không với người có quyền; có với người không quyền | một phần (cửa nhìn thu còn 30 %) |
| `KHOA` | khóa | **có** | không / qua song |

| Sự kiện | Từ → Tới |
|---|---|
| có avatar tới gần (§6.4) và `lịch cho phép` | `DONG` → `DANG_MO` → `MO` |
| không avatar trong 3 m suốt 6 s | `MO` → `DANG_DONG` → `DONG` |
| hết giờ mở theo lịch | `MO` / `DONG` → `DANG_DONG` → `KHOA` (đợi tới khi ô cửa trống) |
| tới giờ mở theo lịch | `KHOA` → `DONG` |
| người chơi có cờ nhiệm vụ / quan hệ mở khóa | `KHOA` → `HE` (riêng người đó) |
| gõ cửa (§6.6) có người trả lời | `KHOA` → `HE` 30 s |

### 6.3 Lịch giờ can chi

Giờ thế giới = giờ thực máy khách (`render3d.js` đang dùng `now.getHours()` cho mặt trời; `debugHour` để thử). Đổi giờ dương lịch sang giờ can chi:

| Giờ | Tý | Sửu | Dần | Mão | Thìn | Tỵ | Ngọ | Mùi | Thân | Dậu | Tuất | Hợi |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Dương lịch | 23–1 | 1–3 | 3–5 | 5–7 | 7–9 | 9–11 | 11–13 | 13–15 | 15–17 | 17–19 | 19–21 | 21–23 |

```js
// doors.js (chưa có — cần làm)
export const GIO = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
export const gioOf = (h) => GIO[Math.floor(((h + 1) % 24) / 2)];
const span = (a, b) => (g) => { const i = GIO.indexOf(g), x = GIO.indexOf(a), y = GIO.indexOf(b); return x <= y ? i >= x && i <= y : i >= x || i <= y; };
export const SCHEDULES = {
  dien_chinh: span('Mão', 'Tuất'),   // điện chính: mở đầu giờ Mão, khóa cuối giờ Tuất (tài liệu tổng §8.2)
  dien_phu:   span('Mão', 'Tuất'),
  nha_dan:    span('Thìn', 'Dậu'),
  cho:        span('Thìn', 'Thân'),
  son_mon:    span('Dần', 'Hợi'),    // cổng quán: khóa giờ Tý, Sửu (vẫn có ngách)
  thanh_mon:  span('Mão', 'Dậu'),    // cổng thành: khóa từ giờ Tuất (ngách mở cho người chơi)
  dem:        span('Dậu', 'Dần'),    // Âm ty: chỉ mở đêm
  luon_mo:    () => true,
};
```

**Luật không nhốt**: lối nối các vùng cho người chơi (Sơn Môn, Hậu Môn, thành môn, cổng tông môn) **luôn có ngách `luon_mo`** ngay bên cạnh cánh chính. Test 08-12 §2.6 chạy A* lúc 0 giờ để chứng minh.

**MMO**: lịch tính tại máy khách theo giờ máy; người chơi khác múi giờ thấy cổng khác nhau (chấp nhận được vì trạng thái cửa không ảnh hưởng người khác — ngách luôn mở). Câu hỏi mở: có dùng «giờ Huyền Giới» chung theo máy chủ (UTC+7) không (README).

### 6.4 Tự mở khi tới gần

Điều kiện mở (kiểm mỗi 0,1 s):

- có avatar (người chơi, người chơi khác qua `net.js`, hoặc NPC đang đi theo lịch) trong bán kính **2,4 m** tính từ tâm ô cửa, ở phía `a` hoặc `b`;
- **và** (đang đi về phía cửa: tích vô hướng vận tốc với pháp tuyến cửa, đổi dấu theo phía, > 0,3) **hoặc** đường A* của avatar đi qua ô cửa trong 3 bước tới;
- **và** lịch cho phép (hoặc avatar có quyền với cửa `KHOA`).

Người chơi bấm vào cánh cửa → coi như tiếp cận (đi tới + mở).

### 6.5 Hoạt cảnh và âm

- Đường cong `easeInOutCubic`; cổng nặng thêm rung `sin(t · 40) · e^(−8t) · 1,5°` khi chạm điểm mở.
- `reduced` (giảm chuyển động, đã có trong game) → thời gian 0,15 s, bỏ rung.
- Âm: `audio.js` thêm `creak(kind)` (tổng hợp: tiếng ồn hồng lọc dải 300–900 Hz điều biến chậm) và `thump()` cho cổng nặng (chưa có — cần làm). Âm phát tại vị trí cửa, qua che âm (08-04 §4).
- Cánh cửa là đạo cụ `PR__`, không gộp; bóng đổ bật.

### 6.6 Gõ cửa (cửa `KHOA` của nhà dân, tĩnh thất)

1. Người chơi bấm cửa khóa → hoạt cảnh gõ (3 tiếng `knock()` — đã có trong `audio.js`).
2. Nếu khoang sau cửa có NPC **thức** theo lịch: sau 1,5–3 s có câu trả lời (thoại do tài liệu 06 cấp `BARK-*`), cửa sang `HE` 30 s.
3. Nếu NPC ngủ (giờ Tý–Dần): không ai trả lời; lần gõ thứ 3 trong 60 s → thoại «ngái ngủ» khó chịu, trừ quan hệ nhỏ (tài liệu 06).
4. Nhiệm vụ đêm có cờ → NPC ra mở dù giờ ngủ.

### 6.7 Khoét va chạm và chặn động

- **Khoét tĩnh**: ô lưới 0,5 m nằm trong `carve` của cửa (hình chữ nhật cục bộ, sâu bằng tường + 0,3 m mỗi phía) **luôn trống** trong va chạm nướng — thực hiện bằng `keep` của `collide.js › addFootprint` ở bước nướng (08-02 §6.5): `keep = (x, z) => !inAnyCarve(x, z)`.
- **Chặn động**: `obstacles.js › setDynamicBlock(doorId, rect | null)` (chưa có — cần làm): một tập ô đặc phụ, `blockedByBuilding` kiểm thêm tập này. Cửa sang `KHOA` → đặt `rect = carve`; sang trạng thái khác → `null`.
- Cánh cửa **không** tham gia va chạm (cánh mở xoay vào khoảng trống cạnh ô cửa — công thức phải chừa ≥ 1,7 m trống sau bản lề, test kiểm).
- **A\***: cửa `DONG` coi như trống (nó sẽ mở); cửa `KHOA` là đặc, trừ khi người chơi có quyền; cửa `HE` trống với người có quyền.

### 6.8 Hành vi MMO

- Trạng thái mở / đóng do tiếp cận là **cục bộ** từng máy khách, tính theo vị trí mọi avatar mà máy đó biết → hai người thấy cùng một cửa mở khi một người đi qua (vị trí đã đồng bộ 8 Hz).
- `KHOA` theo cờ nhiệm vụ là **riêng từng người**: người khác đi qua cửa đang khóa với mình → máy mình thấy cửa hé cho người đó đi qua rồi khóa lại (diễn như «người ta có chìa»).
- Không gửi gói tin riêng cho cửa (tiết kiệm băng thông); cổng lớn cũng vậy.

---

## 7. Mờ mái và tầng trên khi ở trong

### 7.1 Luật

`fadeGroups` hiện có (trong `render3d.js`) làm mờ **cả công trình** khi tia camera → đầu người chơi cắt khung bao. Mở rộng: mỗi nhóm có `userData.fadeRule`.

| `fadeRule` | Nhóm | Đích độ mờ | Điều kiện |
|---|---|---|---|
| `occ` (giữ như cũ) | công trình chưa tách nhóm, cây lớn, cột đá ngoài trời | 0,22 | tia camera → đầu cắt khung bao, đầu không ở trong khung |
| `roof` | `SH__roof_Lk` | 0 (ẩn màu, giữ bóng) | người chơi ở khoang thuộc công trình **và** (camera BỔ DỌC **hoặc** camera cao hơn `ceilY` tầng của người chơi) |
| `upper` | `SH__upper_Lk`, `IN__*__lvk` (k > lv người chơi) | 0 | người chơi ở công trình, tầng < k |
| `front` | `SH__front` | 0,18 | camera BỔ DỌC và camera ở nửa không gian phía trước mặt tiền |
| `wallcam` | `SH__wall` | 0,25 | tia camera → đầu cắt nhóm này (như `occ` nhưng chỉ phần tường) |
| `prop` | đạo cụ to có cờ `fadeable` (cột trong, tượng > 3 m, chuông) | 0,3 | che tia camera → đầu khi ở trong |
| `never` | `SH__base`, sàn | 1 | — |

### 7.2 Thực hiện

```js
// render3d.js — thay vòng fadeGroups hiện có
function applyFade(groups, ctx, dt) {
  for (const g of groups) {
    const goal = FADE_RULES[g.userData.fadeRule || 'occ'](g, ctx);   // 0…1
    const k = Math.min(1, dt * (goal < g.userData.op ? 10 : 6));      // mờ nhanh, hiện chậm
    g.userData.op += (goal - g.userData.op) * k;
    for (const m of g.userData.fadeMats) {
      m.opacity = g.userData.op;
      m.depthWrite = g.userData.op > 0.95;
      m.colorWrite = g.userData.op > 0.02;      // §7.4: ẩn màu nhưng vẫn đổ bóng
    }
  }
}
```

`ctx` = `{ player, playerCell, playerLv, camera, cameraMode, ray, headV }`.

### 7.3 Vật liệu riêng

`models.js › ownMaterials(group)` đã nhân bản vật liệu để mờ riêng. Với vỏ tách nhóm: gọi `ownMaterials` **cho từng nhóm** (`SH__roof_L0` mờ không kéo theo tường). Chi phí: thêm ≤ 6 vật liệu mỗi công trình đang ở gần.

### 7.4 Ẩn mà vẫn đổ bóng

`visible = false` làm mất bóng mái → nắng chiếu thẳng vào sàn trong nhà, sai. Cách làm: giữ `visible = true`, đặt `colorWrite = false` + `depthWrite = false` khi độ mờ ~0. Shadow map của `DirectionalLight` dựng bằng vật liệu độ sâu riêng của Three (không đọc `colorWrite` / `opacity` của vật liệu chính) → mái vẫn đổ bóng, trong nhà vẫn râm. Kiểm bằng ảnh 08-12 §4.

### 7.5 Nhà nhân bản tức thời (hạng C)

36 nhà vườn là `InstancedMesh` (`assets.js › instanceModelLod`) → không mờ riêng một bản được. Khi người chơi **bước vào ngưỡng** một nhà:

1. Ẩn bản sao đó trong `InstancedMesh` bằng ma trận co về 0 (cùng mẹo `world3d.js › occlusion` đang làm với cây).
2. Dựng một **bản rời** của vỏ `lib_courtyard` đã khoét (`public/models/bld/_shared/courtyard-cut/shell.glb`) ở đúng ma trận, vật liệu riêng, tách nhóm `roof` / `front`.
3. Ra khỏi nhà > 8 m và 5 s → gỡ bản rời, trả ma trận bản sao.

Bản rời của tối đa 3 nhà tồn tại cùng lúc (khớp giới hạn nạp hạng C).

### 7.6 Nắp đầu tường khi bổ dọc

Mái mờ đi thì đỉnh tường lộ ra mặt cắt rỗng (vỏ Meshy là bề mặt). Lớp lót (08-02 §5.6) có mảnh **nắp đầu tường** (`MOD-KT-12`, vật liệu tối mờ) chạy dọc đỉnh lớp lót ở `ceilY`, chỉ bật khi luật `roof` đang mờ — nhìn xuống thấy mép tường dày, gọn như mô hình kiến trúc cắt ngang.

---

## 8. Camera trong nhà

### 8.1 Hai chế độ

| | **TRONG** | **BỔ DỌC** |
|---|---|---|
| Vị trí camera | trong khoang, sau lưng người chơi | ngoài / trên công trình |
| Khoảng cách | ≤ `cell.camera.maxDist` (mặc định 0,45 × cạnh ngắn khoang, ≤ 9 m) | 9–12 m |
| Góc ngẩng (pitch) | 0,12 – 0,75 rad | 0,85 – 1,15 rad |
| Mờ | `wallcam`, `prop` | `roof`, `upper`, `front` |
| FOV | +6° so với ngoài trời (`camera.fov` 45 → 51; dọc 64 → 70) | như ngoài trời |
| Dùng cho | A, B, khoang có cạnh ngắn ≥ 5 m | C, khoang nhỏ, cầu thang hẹp |

Người chơi đổi chế độ bằng nút «⌂» (hoặc phím V); lựa chọn nhớ theo **hạng** trong `localStorage` (`huyenquan:cammode:<hạng>`).

### 8.2 Kẹp camera chế độ TRONG

```js
// render3d.js — thay khối roomAt hiện có (chưa có — cần làm)
function cameraIndoor(cam, camera, cell) {
  const box = cell.worldBox.clone().expandByScalar(-0.4);              // lùi 0,4 m khỏi tường lót
  const want = desiredCameraPos(cam, Math.min(cam.dist, cell.camera.maxDist), clamp(cam.pitch, ...cell.camera.pitch));
  const hit = raycastColliders(cam.target, want, cell.camColliders);   // COL__ + cột lớn của khoang
  const pos = hit ? hit.point.addScaledVector(dirFromTargetTo(want), -0.3) : want;
  box.clampPoint(pos, pos);
  pos.y = Math.min(pos.y, cell.ceilWorld - 0.4);                       // không chui trần / sàn tầng trên
  camera.position.copy(pos);
}
```

- `camColliders`: lưới `COL__` của khoang + hộp bao các cột `fadeable = false` (cột mảnh không cần, cột > 0,6 m đường kính cần).
- Camera không bao giờ ở khoang **khác tầng** người chơi: trần tầng hiện tại là trần cứng.

### 8.3 Chuyển cảnh qua ngưỡng

- Người chơi đổi khoang ngoài → trong: nội suy tham số camera (khoảng cách, pitch, FOV) trong **0,6 s**; vị trí camera nội suy theo điểm kẹp mới (không nhảy xuyên tường: nếu đường nội suy cắt vỏ, nhảy thẳng — chấp nhận 1 khung giật hơn là thấy xuyên tường).
- `reduced`: cắt thẳng.
- Ra ngoài: phục hồi khoảng cách ngoài trời mà người chơi đặt trước khi vào (không ép về mặc định).

### 8.4 Ngước nhìn

Ngoài trời có «ngước nhìn trời» (`cam.pitch < 0.15` → camera hạ sát đất, điểm nhìn nâng lên). Trong nhà:

- pitch tối thiểu 0,12 (không hạ sát sàn);
- kéo xuống hết cỡ = **ngước nhìn trần / tượng**: điểm nhìn nâng tới `min(ceilY − 0,5, đỉnh tượng gần nhất)` — để chiêm ngưỡng tượng Tam Thanh, xà vẽ, phướn.

### 8.5 Dưới mái hạng D

Người chơi đứng dưới mái đình / sạp / bệ thầy (khung `roofZone` khai trong công thức D): camera y ≤ cao độ diềm mái − 0,3, hoặc tự động BỔ DỌC nếu không đủ chỗ (mái thấp < 3 m).

### 8.6 Ngồi, hội thoại, màn dọc

| Tình huống | Quy tắc |
|---|---|
| Ngồi bồ đoàn / ghế (`p.sitting`) | khoảng cách × 0,75 (như hiện có), pitch 0,25, điểm nhìn hạ 0,4 m |
| Nói chuyện với NPC | dùng neo `CA__<cell>` gần nhất nếu có; không có → qua vai 2,2 m, góc 25° lệch phải; giữ trong khoang |
| Màn dọc (`camera.aspect < 0.8`) | «nhìn vượt lên trước» giảm từ 3,4 xuống 1,2 m trong nhà (không đẩy khung qua tường) |
| Truyền tống vào trong | camera đặt thẳng vào điểm kẹp, không trượt từ vị trí cũ (như luật «dịch chuyển xa» hiện có, ngưỡng 40 m) |

### 8.7 Thử tay bắt buộc

Mỗi khoang A / B: đi vòng sát 4 tường, xoay camera 360°, ngồi mọi chỗ ngồi, nói chuyện mọi NPC — không lần nào thấy xuyên tường / thấy mặt sau vỏ. Ghi vào phiếu 08-12 §3.

---

## 9. Nhãn, biển, câu đối

- Nhãn trạm (`labels` trong `render3d.js`) đã bám mặt sàn bằng `world.groundY`. Trong nhà: bám `levels[lv].floorY` của trạm; **ẩn** nhãn của khoang không thấy được (§4) và của tầng khác người chơi.
- Biển, câu đối (`LB__`): chạm → bảng nhỏ ba dòng: chữ Hán · Hán Việt · nghĩa (quy ước trình bày của bộ tài liệu). Nội dung chữ do tài liệu 02 / 12 cấp; tài liệu này chỉ quy định **mọi biển nhìn thấy đều đọc được** (lời hứa H7).
- Dấu vàng trạm (`deskMarks`) trong nhà thu nhỏ 0,7 lần và không tỏa sáng mạnh (bloom trong nhà dễ chói).

---

## 10. Hiệu năng của chính các hệ runtime

| Hệ | Chi phí mục tiêu (`mid`) | Cách đo |
|---|---|---|
| `cellAt` × 2 | < 0,05 ms | `performance.now()` bao quanh |
| `visibility` | < 0,2 ms với ≤ 30 khoang đã nạp | như trên |
| `doors.update` | < 0,1 ms với ≤ 40 cửa trong 60 m | |
| Lắp ráp nội thất | ≤ 4 ms / khung (cắt lô) | |
| `applyFade` | < 0,1 ms với ≤ 24 nhóm | |
| Kẹp camera (raycast ≤ 12 hộp) | < 0,1 ms | |

Tổng thêm ≤ 0,6 ms / khung ngoài phần lắp ráp — trong ngân sách 33 ms của 30 khung/giây.
