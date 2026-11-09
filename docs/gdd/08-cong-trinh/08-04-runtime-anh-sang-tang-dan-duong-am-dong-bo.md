# 08-04 · Runtime: ánh sáng trong nhà, nhiều tầng, dẫn đường, che âm, lưu và đồng bộ

> Tiếp 08-03. Phần này xử lý năm hệ còn lại để nội thất tại chỗ chạy đúng: đèn theo khoang, nhà nhiều tầng (vấn đề lớn nhất của va chạm 2D hiện tại), A* trong nhà, âm thanh qua cửa, lưu trạng thái và đồng bộ MMO.

---

## 1. Ánh sáng trong nhà

### 1.1 Hệ đang có

- `lights.js › LIGHTS`: mảng `{ x, y, z, color, power, room }`; `addLight(…)`, `addGlow(mat, …)`, `glowAll(obj, …)`.
- `render3d.js`: pool `POOL_N` đèn điểm (`high` 16 · `mid` 10 · `low` 6), mỗi đèn `new THREE.PointLight(color, 0, 26, 1.6)`; mỗi 0,3 s chọn các đèn gần người chơi nhất **cùng `room`** với `lightRoom`; cường độ `power × (lightRoom ? 14 : 1,2 + 16 · lightNight)`.
- `interior.js` đã đăng ký đèn với `room: r.id` (nến bàn lễ, đèn lồng lối giữa, đèn chiếu tượng).

### 1.2 Mở rộng `addLight`

```js
// lights.js (mở rộng — chưa có)
addLight(x, y, z, { color, power, room = null, cell = null, lv = 0, kind = 'denlong', flicker = 0, sched = null, bld = null })
```

| `kind` | Tầm (m) | Suy giảm | Hệ số cường độ trong nhà | Nhấp nháy | Ví dụ |
|---|---|---|---|---|---|
| `nen` (nến) | 6 | 2 | 6 | 0,08 | bàn thờ, bàn lễ |
| `dendau` (đèn dầu) | 7 | 2 | 7 | 0,05 | bàn nhà dân, án thư |
| `denlong` (đèn lồng) | 10 | 2 | 10 | 0,02 | treo lối giữa, hiên |
| `denbo` (đèn bơ Tạng) | 5 | 2 | 5 | 0,06 | hàng đèn bơ |
| `bep` (bếp lửa) | 7 | 2 | 9 | 0,15 | bếp nhà dân, hỏa đường Miêu |
| `ma` (đèn ma Âm ty) | 9 | 2 | 8, màu lam | 0,1 | Phong Đô |
| `troi` (ánh trời qua cửa) | 12 | 1,5 | theo mặt trời | 0 | đèn giả đặt sau cửa lớn ban ngày |
| `ngoai` (ngoài trời — như cũ) | 26 | 1,6 | `1,2 + 16 · night` | 0 | đèn đá, cột đèn |

`room` giữ để tương thích phòng ngoài bản đồ chưa chuyển; công trình mới dùng `cell` + `bld`.

### 1.3 Chọn đèn cho pool

```js
// render3d.js › updateLightPool — thay bộ lọc `(L.room || null) !== lightRoom`
function candidates(px, py, pz) {
  const cur = cells.current;                                   // khoang người chơi (08-03 §3)
  const out = [];
  for (const L of LIGHTS) {
    let w;
    if (cur) {
      if (L.cell === cur.id) w = 1;                                     // đèn khoang hiện tại
      else if (L.cell && cells.isVisible(L.cell) && cells.adjacent(cur.id, L.cell)) w = 0.6;   // khoang kề thấy được
      else if (!L.cell && cells.nearOutPortal(cur.id, L, 12)) w = 0.4;  // đèn ngoài trời sát cửa ra
      else continue;
    } else {
      if (L.cell) continue;                                    // đứng ngoài: không bật đèn trong nhà (đã có thẻ cửa sổ, 08-02 §7)
      w = 1;
    }
    const d = (L.x - px) ** 2 + (L.z - pz) ** 2 + ((L.y - py) * 0.5) ** 2;
    out.push([d / w, L]);
  }
  return out.sort((a, b) => a[0] - b[0]);
}
```

Khi ở trong: pool ưu tiên nến bàn thờ / đèn trên đường người chơi nhìn; khoang kề qua cửa mở được thắp yếu hơn. Khi đứng ngoài: **không** thắp đèn trong nhà (tránh xuyên tường), ô cửa sổ sáng nhờ thẻ phát sáng.

### 1.4 Ánh sáng nền và phơi sáng

`render3d.js` có `HemisphereLight('#cfe2ff', '#5a4a3a', 1)` và mặt trời `DirectionalLight` cường độ 2,5. Trong nhà ánh nền bán cầu làm mọi góc sáng đều như ngoài sân — sai. Khi **camera** ở trong khoang:

| Thông số | Ngoài trời | Trong khoang (ngày) | Trong khoang (đêm) |
|---|---|---|---|
| `hemi.intensity` | 1 (hiện có, đổi theo giờ) | `cell.ambient` × giá trị ngoài (mặc định 0,30) | 0,12 × giá trị ngoài |
| Mặt trời | 2,5 | giữ nguyên (bóng mái tự làm râm; nắng lọt qua cửa vẫn đúng) | giữ |
| `renderer.toneMappingExposure` | hiện có | + `cell.exposure` (mặc định +0,25 EV) — «mắt quen tối» | + 0,35 EV |
| Bloom (`UnrealBloomPass`) | 0,28 / 0,5 / 0,96 | ngưỡng 0,96 → 0,98 (nến không lóa) | như ngày |

Nội suy 1,2 s khi vào / ra (giảm chuyển động: 0,3 s).

### 1.5 Ánh trời qua cửa (ban ngày)

Cửa lớn mở ban ngày là nguồn sáng chính của điện. Mỗi cửa nhìn `door` / `window` ra `out` có **một đèn `troi`** đặt lùi 1,5 m vào trong, màu theo bầu trời (lấy màu `hemi.color` × 1,1), cường độ = `clamp(sunUp, 0, 1) × 1,4 × độ mở cửa`. Đóng cửa → tắt. Mức `high` thêm **dải bụi nắng**: tứ giác cộng màu (additive) xiên theo hướng mặt trời khi mặt trời ở phía cửa (`dot(sunDir, pháp tuyến cửa) > 0,2`), opacity 0,08–0,14, 1 draw call / cửa.

### 1.6 Lịch đèn

| Loại công trình | Nến bàn thờ | Đèn treo / đèn dầu | Bếp | Thẻ cửa sổ (nhìn từ ngoài) |
|---|---|---|---|---|
| A (điện) | thắp suốt ngày đêm; đạo đồng thay nến giờ Mão và giờ Dậu (hoạt cảnh) | Dậu → Dần | — | Dậu → Dần; giờ Tý – Dần chỉ 1/3 cửa sổ sáng (đèn trực) |
| B | khi có bàn thờ: như A | Dậu → Hợi | trai đường: Mão, Ngọ, Dậu | Dậu → Hợi |
| C (nhà dân) | gia tiên: rằm, mồng một và giờ Dậu → Tuất | Dậu → Hợi | Mão (sáng), Ngọ, Dậu (chiều) | khi có người thức trong nhà |
| D | — | đèn lồng / đèn đá Dậu → Dần | — | — |

`sched` của đèn = tên lịch ở `doors.js › SCHEDULES` hoặc một hàm. Đèn tắt theo lịch vẫn nằm trong `LIGHTS` (pool bỏ qua).

### 1.7 Nhấp nháy

`intensity × (1 + flicker · (0,6 · sin(13t + φ) + 0,4 · n(t)))`, `n` là nhiễu giá trị thấp tần (bảng 64 mẫu nội suy). `φ` theo vị trí đèn. `reduced` → 0. Vật liệu sáp nến (`M.wax` trong `interior.js`) đổi `emissiveIntensity` cùng nhịp.

### 1.8 Chống lọt sáng

`PointLight` của Three không bị tường chặn → đèn khoang A sáng sang khoang B qua tường mỏng. Biện pháp (đủ cả bốn):

1. Chỉ thắp đèn của khoang **thấy được** (§1.3 + portal culling 08-03 §4).
2. Tầm đèn ≤ đường chéo khoang chứa nó (công thức tự kẹp).
3. Đèn cách tường lót ≥ 0,6 m (test 08-12 kiểm).
4. Khoang kề chỉ thắp ở trọng số 0,6 — lọt sang (nếu có) là yếu.

### 1.9 Đèn theo hạng — tối thiểu

| Hạng | Tối thiểu mỗi khoang | Ví dụ bố trí (khoang 20 × 10,5 m — Tổ Sư đường) |
|---|---|---|
| A | 1 nến bàn thờ × 2 + 1 đèn treo mỗi 2 gian lối giữa + 1 `troi` mỗi cửa | 2 `nen` bàn thờ, 4 `denlong` treo, 1 `troi` cửa giữa = 7 đèn khai báo; pool bật ≤ 4 |
| B | 1 nguồn thật + 1 `troi` | lầu chuông tầng 2: 1 `denlong` + 2 `troi` (4 mặt lan can) |
| C | 1 `dendau` + 1 `bep` | |
| D | ≤ 1 `ngoai` | |

---

## 2. Nhà nhiều tầng và cầu thang

### 2.1 Vấn đề của va chạm hiện tại

`obstacles.js` là **mặt phẳng XZ**: tập ô đặc `solid` và danh sách nền `rects`. `platformTop(x, z)` trả **cao nhất** trong các nền chứa điểm. Nếu dựng sàn tầng 2 Chính Đường (cao 13,65 m) chồng lên sảnh tầng 1 (4,45 m), người chơi đứng ở tầng 1 sẽ bị đặt lên độ cao 13,65 — xuyên trần. Tường tầng 2 khác tường tầng 1 nhưng lưới ô chỉ có một lớp. → Cần **tầng (`lv`)**.

### 2.2 API mới của `obstacles.js` (chưa có — cần làm)

```js
// khóa ô theo tầng: (lv, i, j) — lv 0…7; lv 0 = mặt đất + tầng trệt mọi công trình
const ck = (i, j, lv = 0) => (lv * SPAN + (i + OFF)) * SPAN + (j + OFF);   // ≤ 8 · 6,4e9 < 2^53
export function markSolidCell(i, j, lv = 0);
export function addSolidRect(x0, z0, x1, z1, lv = 0);
export function clearSolidRect(x0, z0, x1, z1, lv = 0);
export function addPlatform(x, z, w, d, ry, top, { lv = 0, stair = null, seg = 0 } = {});
export function platformTop(x, z, lv = 0, seg = null);       // chỉ xét nền của lv (+ bậc thang của lv, §2.4)
export function blockedByBuilding(x, z, lv = 0);             // ô đặc của lv + chặn động + vòng tròn (vòng tròn chỉ lv 0)
export function addBakedCells(colJson);                       // 08-02 §6.5
export function setDynamicBlock(id, rect, lv = 0);            // 08-03 §6.7
export function addStair(stair);                              // §2.3
```

Mọi lời gọi hiện có không truyền `lv` → mặc định 0 → **không đổi hành vi** (`court.js`, `landmarks.js`, test cũ chạy nguyên).

`world.js › blockedAt(x, y, from, lv = 0)`; `world3d.js › groundY(x, z, lv = 0)`.

### 2.3 Cầu thang và đổi tầng

```js
addStair({
  id: 'cd.s.tay', from: 0, to: 1,
  steps: [ { x, z, w, d, ry, top }, … ],      // nền từng bậc (thế giới)
  switchY: 9.0,                               // vượt độ cao này → sang tầng `to`; dưới → `from`
  railing: true,                              // lan can hai bên: ô đặc ở cả hai tầng dọc mép
});
```

- Bậc thang thuộc **cả hai tầng** (`platformTop` của `from` lẫn `to` đều thấy) → bước lên / xuống không hẫng.
- Ô sàn tầng trên ở **miệng cầu thang** (lỗ sàn) phải trống ở tầng trên **và** có lan can ba mặt (người đi tầng trên không rơi xuống lỗ — trò chơi không có rơi; lỗ không có lan can sẽ thành «sàn vô hình»).
- Mỗi bước di chuyển (`main.js`, nơi cập nhật vị trí người chơi): nếu đang đứng trên nền bậc của cầu thang `S` thì
  `player.lv = top >= S.switchY ? S.to : S.from`.
- A* coi bậc là cạnh nối hai tầng (§3.3).

### 2.4 Thang xoắn trong tháp — «con trỏ bậc»

Thang xoắn nhiều vòng có bậc **chồng lên nhau** theo XZ (vòng trên cách vòng dưới 3,5 m). Nếu mọi bậc cùng tầng thì `platformTop` lại lấy bậc cao nhất → nhảy vòng. Giải:

- mỗi bậc mang `seg` (số thứ tự bậc trong thang);
- người chơi trên thang giữ `player.seg`;
- `platformTop(x, z, lv, seg)` chỉ xét bậc có `|bậc.seg − seg| ≤ 2`;
- bước khỏi bậc cuối / đầu → bỏ `seg` (về sàn tầng).

Tháp `tower_nine` (Hậu Sơn, 9 tầng ~3,7 m) và `lib_pagoda5` (tầng ~5,4 m) dùng thang xoắn quanh trụ tâm (`MOD-BAC-44`, 08-05).

### 2.5 Chuẩn cầu thang

| Loại | Bậc cao × sâu | Rộng | Chiếu nghỉ | Dùng ở |
|---|---|---|---|---|
| Thang thẳng thường | 0,20 × 0,30 | ≥ 1,2 m (C), ≥ 1,6 m (A, B) | mỗi ≤ 3,6 m cao | nhà dân có gác, trai đường |
| Thang lầu dốc (kiểu lầu các) | 0,25 × 0,25 | ≥ 1,4 m | mỗi ≤ 4,6 m | Chính Đường, lầu chuông, Du Phương Lâu |
| Thang gãy chữ U | 0,20 × 0,30 | ≥ 1,4 m | ở chỗ gãy | Thư Lâu, tháp lớn vùng |
| Thang xoắn quanh trụ | 0,22 cao, 16 bậc / vòng | bán kính trong 0,6 / ngoài 2,6 m | không (vòng liên tục) | tháp `tower_nine`, `lib_pagoda5` |
| Thang gỗ dốc (Miêu) | 0,25 × 0,25 | ≥ 1,0 m | không | nhà sàn Miêu (tài liệu 07) |
| Mã đạo (dốc lát đá) | dốc ≤ 1 : 4, chia nền 0,4 m cao | ≥ 3,2 m | mỗi 6 m cao | thành môn (lên thành đài) |
| Bậc ngoài nền | 0,40 × 0,625 (như `court.js › STAIRS`) | theo nền | — | nền đá, bệ điện |

Mọi loại: mỗi nền bậc chênh ≤ 0,41 m với nền kề (cùng ngưỡng test Sơn Môn hiện có).

### 2.6 Va chạm từng tầng

- Nướng (08-02 §6.5): tầng `k` cắt lát dải `[floorY(k) + 0,4, floorY(k) + 2,0]`.
- Lan can ≥ 0,9 m cao → nằm trong dải → chặn đúng.
- Dầm thấp hơn `floorY + 2,0` (đầu người) → bị đánh dấu đặc ở tầng đó: công thức **không** đặt dầm thấp trên lối đi; trần thông thủy tối thiểu theo hạng (08-01 §9.2).

### 2.7 Ngự kiếm và mái

- Hạ cánh (`mount.js`): cấm hạ trong khung bao bất kỳ vỏ công trình nào trừ khi điểm hạ có `platformTop(x, z, 0)` thuộc **nền ngoài trời** (sân, nền đá). Tức không đáp lên mái.
- Bay ngang qua ngưỡng cửa → tự xuống kiếm (mở rộng luật hiện có ở `main.js`: `if (player.flying && st.room) setFlying(false)` thành «vào bất kỳ khoang nào»).
- Không bay trong nhà.

### 2.8 Độ cao avatar

`gy = world.groundY(x, z, lv)` = `platformTop(x, z, lv, seg) ?? địa hình`. Người chơi khác (MMO): cùng công thức với `l` nhận qua gói `mv` (§5.3).

---

## 3. Dẫn đường (A*) trong nhà

### 3.1 Hệ đang có

`world.js › findPath(from, to)`: tọa độ ô 1,6 m; đi thẳng nếu không vướng; xa > 150 ô thì đi thẳng; ngược lại A* 8 hướng bước 0,5 ô (0,8 m), không cắt góc, lề 40 ô, tối đa 60.000 nút; rút gọn theo tầm nhìn thẳng (`clearLine`, mẫu 0,2 ô). `nearestFreePoint` tìm điểm trống quanh chỗ bấm.

### 3.2 Vì sao không đủ trong nhà

| Vấn đề | Hệ quả |
|---|---|
| Bước 0,8 m | khe cửa 1,2–1,8 m có thể không có nút nào lọt vào vùng trống (thân 0,6 m) → «không có đường» |
| Không có tầng | không lên gác được, hoặc đi xuyên trần |
| Bấm vào vỏ công trình → điểm trống gần nhất | người chơi đi tới **chân tường**, không tới cửa |
| Đường dài trong + ngoài | A* một lưới 60.000 nút hết ngân sách với quần thể lớn (Tử Bình 190 × 160 m) |

### 3.3 Thiết kế: A* phân cấp (chưa có — cần làm)

**Tầng 1 — ngoài trời**: giữ nguyên `findPath` cho mọi điểm ngoài khoang (`lv 0`).

**Tầng 2 — đồ thị công trình** (dựng khi nạp `col.json`, lưu trong `buildings.js`):

| Nút | Đặt ở |
|---|---|
| `door:out` | 1,2 m ngoài ngưỡng mỗi cửa đi ra `out` |
| `door:in` | 1,2 m trong ngưỡng |
| `portal` | giữa ô cửa nối hai khoang |
| `stair:lo` / `stair:hi` | chân và đỉnh mỗi cầu thang |
| `spot` | chỗ đứng mỗi trạm |

Cạnh trong cùng khoang: chạy **A\* mịn** (bước 0,25 ô = 0,4 m, khung = hộp khoang + 2 m, ≤ 20.000 nút) một lần khi nạp, lưu đường đã rút gọn + chi phí. Cạnh cầu thang: chi phí = chiều dài bậc × 1,5. Cạnh cửa: chi phí 1 nếu cửa mở được với người chơi, ∞ nếu `KHOA` không quyền.

**Truy vấn** `findPath3(from, to)` với `from`, `to` = `{ x, y, lv }`:

1. Cả hai ngoài khoang → `findPath` cũ.
2. `to` trong công trình B: với mỗi `door:out` của B: `chiPhí = ước lượng ngoài(from → door:out) + Dijkstra trong B(door:in → nút gần to)`. Chọn cửa rẻ nhất; ghép đường ngoài (A* cũ) + ngưỡng + đường trong (đồ thị) + A* mịn đoạn cuối tới `to`.
3. `from` trong công trình: đối xứng.
4. Trong A → trong B: trong A → cửa → ngoài → cửa → trong B.

### 3.4 Bấm chọn điểm

- Raycast vào **lưới sàn** của khoang thấy được (`IN__san_*`, mang `lv`) trước, rồi mới tới mặt đất / nền ngoài trời. Đích = `{ x, z, lv }`.
- Bấm vào **vỏ** (tường, mái) → đích = `door:out` gần nhất của công trình đó (đi tới cửa), không phải chân tường.
- Bấm vào tầng trên đang thấy qua chế độ BỔ DỌC → đích có `lv` của tầng đó, A* tự đi cầu thang.
- Bấm vào đạo cụ có `station` → như bấm trạm (đi tới `spot`).

### 3.5 NPC đi lại

NPC đi theo lịch (08-03 §2.7) bằng cùng đồ thị công trình; NPC **không chặn** người chơi (xuyên qua nhau như avatar MMO hiện nay) nhưng tránh đứng trên `spot` của trạm (đứng lệch 0,8 m).

### 3.6 Chống kẹt

- Mỗi khung kiểm: người chơi bị chặn cả 8 hướng (thử bước 0,3 m) liên tục 1,5 s → **gỡ kẹt**: BFS trên lưới ô cùng `lv`, bán kính 3 m, tới ô trống gần nhất có đường tới `door:in` của khoang; không có → đặt ở `door:in` gần nhất.
- Gỡ kẹt ghi `console.warn('[unstuck]', bld, cell, x, z, lv)` và đếm vào thống kê phiên (để biết công trình nào hay kẹt — 08-12 §6).

---

## 4. Âm thanh: vang và che âm

### 4.1 Hệ đang có

`audio.js`: WebAudio tổng hợp, không file; mặc định **tắt** (bật bằng 🔈); `startWind()` (tiếng ồn nâu lọc thấp 500 Hz, gain 0,05), `bell(base, vol)`, `knock(freq, vol)`, `rattle()`.

### 4.2 Đồ thị âm mở rộng (chưa có — cần làm)

```
                ┌──────── busNgoai (gió, chim, nguồn ngoài trời) ── lọcChe ──┐
nguồn ──► lọc ──┤                                                            ├──► master ──► loa
                └──────── busTrong (âm nền khoang, nguồn trong) ──┬──────────┘
                                                                 └─► send ──► Convolver(vang khoang) ──► master
```

### 4.3 Vang theo khoang

Dựng sẵn **xung đáp ứng** (impulse) cho từng kiểu, một lần khi bật âm: nhiễu trắng hai kênh lệch nhau × `exp(−6,9 · t / RT60)`, dài `min(RT60, 3,5)` s.

| `reverb` | RT60 (s) | Ướt (wet) | Dùng ở |
|---|---|---|---|
| `dai_dien` | 2,6 | 0,35 | Chính Đường, Chính Điện Tam Thanh, đại điện vùng |
| `dien_vua` | 1,6 | 0,28 | điện phụ, giảng đường, tàng kinh |
| `lau_go` | 0,9 | 0,2 | lầu chuông / trống, gác, Du Phương Lâu |
| `thap_da` | 1,8 | 0,3 | lòng tháp, thang xoắn |
| `hang_da` | 3,2 | 0,4 | tàng binh động thành môn, hang (Miêu, Âm ty) |
| `phong_nho` | 0,6 | 0,15 | tĩnh thất, phòng gác |
| `nha_dan` | 0,5 | 0,12 | nhà dân |
| `ngoai` | — | 0 | ngoài trời |

RT60 tham khảo công thức Sabine `T = 0,161 · V / A` cho khoang thật: Tổ Sư đường 20 × 10,5 × 6 m = 1.260 m³, hút âm trung bình α ≈ 0,08 (gạch, gỗ sơn) trên ~ 790 m² → T ≈ 3,2 s; giảm còn 2,6 vì có tượng, phướn, người. Đổi khoang → nội suy độ ướt 0,8 s (không đổi impulse giữa chừng; mỗi kiểu một Convolver, trộn theo gain).

### 4.4 Âm nền khoang

| `bed` | Tổng hợp | Gain | Theo giờ |
|---|---|---|---|
| `tung_xa_mo` | drone formant (3 dao động sin 110 / 165 / 220 Hz, lọc dải) + mõ `knock(600, 0.08)` 1 nhịp / s | 0,06 | giờ Mão, Dậu: rõ (khóa lễ); giờ khác: drone 0,02, không mõ |
| `nen_lach_tach` | nhiễu xung thưa | 0,03 | luôn |
| `bep_lua` | nhiễu hồng + xung lách tách + sôi (sin 80 Hz điều biến) | 0,05 | theo lịch bếp |
| `go_gio` | nhiễu lọc dải 700 Hz điều biến chậm | 0,04 | lầu, tháp |
| `giot_nuoc` | sin ngắn ngẫu nhiên 1,2–2,4 kHz, khoảng 1–4 s | 0,05 | hang |
| `cho_xa` | nhiễu dải 300–1.200 Hz điều biến kiểu tiếng người | 0,03 | phố, sạp (giờ chợ) |
| `trang_sach` | nhiễu cao tần ngắn ngẫu nhiên 5–12 s | 0,03 | tàng kinh, thư lâu |

Bản thu thật (`SFX-*`, `BGM-*`) do tài liệu 12 cấp thay dần; tên `bed` giữ làm khóa.

### 4.5 Che âm qua cửa nhìn

Nguồn ở khoang `E`, người nghe ở khoang `L` (hoặc ngoài trời):

1. BFS trên đồ thị cửa nhìn từ `E` tới `L`, tối đa 3 bước.
2. Hệ số mỗi cửa nhìn đi qua:

| Cửa nhìn | Suy giảm | Lọc thấp |
|---|---|---|
| `open`, `stair`, `door` đang mở | 0 dB | — |
| `door` hé (`HE`) | −6 dB | 3 kHz |
| `window`, `lattice` | −6 dB | 2,5 kHz |
| `door` đóng | −14 dB | 800 Hz |
| không có đường trong 3 bước (xuyên tường) | −24 dB | 400 Hz |

3. Cộng dồn dB, lấy tần cắt **nhỏ nhất**; cộng suy giảm khoảng cách (nghịch đảo, tham chiếu 2 m).
4. **Nguồn ảo tại cửa**: âm đi qua cửa nhìn được định vị tại tâm cửa nhìn cuối cùng (âm «đi vòng» qua cửa), không định vị xuyên tường.

**Ngoài trời khi ở trong**: gió (`startWind`) gain × 0,25 và lọc 900 Hz, nhân thêm tỉ lệ (tổng diện tích cửa nhìn ra `out` đang mở) / (diện tích bề mặt khoang), kẹp 0,1–1.

### 4.6 Tiếng bước chân

Vật liệu sàn khai trong `extras.mat` của lưới sàn: `da` (đá, gạch bát), `go` (ván), `chieu` (chiếu cói), `dat` (đất nện), `dong` (Kim Điện), `tuyet`. Mỗi bước: nhiễu ngắn 30 ms lọc theo vật liệu (đá 2,5 kHz sắc; gỗ 900 Hz đục + cộng hưởng 180 Hz; chiếu 4 kHz nhẹ). Tần suất theo `avState.phase`.

### 4.7 Chuông, trống toàn vùng

Đánh chuông lầu chuông: `bell(196, 0.22)` + bội âm thấp (thêm sin 98 Hz tắt 6 s) — nghe khắp Sơn Môn và Huyền Thành; suy giảm nghịch đảo tham chiếu 30 m, tối thiểu −36 dB tới 600 m; che âm áp dụng khi người nghe trong nhà. Trống: `thump` 60 Hz + nhiễu ngắn. Đồng bộ MMO ở §5.4.

### 4.8 Giới hạn

- ≤ 12 nguồn đang kêu (ưu tiên gần + to); ≤ 3 Convolver đang trộn.
- iOS: `AudioContext` mở khóa ở lần chạm đầu (đã có cơ chế bật 🔈).
- Ba nhóm âm lượng trong cài đặt: Nhạc · Âm nền · Hiệu ứng (chưa có — cần làm, tài liệu 12 vẽ giao diện).

---

## 5. Lưu trạng thái và đồng bộ MMO

### 5.1 Trạng thái cục bộ (`state.js`, thêm trường — chưa có)

```js
s.int = {
  v: 1,
  seen:  { 'INT-SM-CHINHDUONG': '2026-11-05', … },     // lần đầu vào từng công trình
  flags: { 'sm.tosu.danghuong': '2026-11-05', … },     // việc đã làm theo ngày (khóa riêng công trình)
  props: { 'sm.lauchuong.danhsom': 14, … },             // bộ đếm vật dụng cá nhân
  last:  { bld: 'INT-SM-CHINHDUONG', cell: 'cd.l1.kinh', lv: 1, x: 3.2, z: -33.0 },   // chỗ đứng khi thoát
};
```

- `seen` → thành tựu «Du Khách Tận Tường» (vào đủ mọi công trình A / B của Sơn Môn) theo cùng cách `evaluateAchievements` đang xét `walker` (đi đủ trạm). Phần thưởng do tài liệu 11 định; đề xuất +1 Phúc Khí **một lần** mỗi công trình A / B lần đầu vào.
- Trạm trong nhà dùng `grantDaily(s, id)` như trạm sân (khóa = id trạm).
- `last` để mở lại game đúng tầng; nếu công thức đổi làm điểm `last` thành ô đặc → đặt ở `door:in` gần nhất.
- `loadState` hiện bỏ dữ liệu hỏng về mặc định — `int` thiếu / sai kiểu thì tạo mới (không làm sập, cùng chuẩn test «dữ liệu hỏng không làm sập»).

### 5.2 Chuyển lưu cũ

Bản hiện tại có thể lưu / gửi vị trí người chơi **trong phòng ngoài bản đồ** (x ≈ 1.500–2.014 m). Khi giải thể `ROOMS`:

| Vị trí cũ (khung `ROOMS`) | Đưa tới |
|---|---|
| `chinhdien` (1500 ± 17, 0 ± 14) | `door:in` cửa giữa INT-HS-CHINHDIEN |
| `vanxuong` (1600 ± 12, 0 ± 10) | `door:in` INT-TL-THULAU |
| `daumau` (1700 ± 12, 0 ± 10) | `door:in` INT-TT-QUANTINH (cửa Đẩu Mẫu Điện) |
| `laoquan` (1800 ± 12, 0 ± 10) | `door:in` INT-TB-CHINHDIEN (cửa Lão Quân Điện) |
| `vanmenh` (1900 ± 10, 0 ± 36) | `door:in` INT-SM-DIENTAY |
| `thaitue` (2000 ± 14, 0 ± 12) | `door:in` INT-SM-DIENDONG |

Hàm `migrateLegacyPos(x, z)` trong `buildings.js` (chưa có), gọi trong `loadState` và khi máy chủ gửi vị trí người chơi khác còn ở tọa độ cũ (bản khách chưa cập nhật).

**Lỗi hiện có phát hiện khi rà**: `protocol.js › WORLD_TILES.maxX = 10 + 1200` (= 1.920 m) nhưng Thái Tuế Điện ở x = 1.986–2.014 m (ô ≈ 1.251–1.269) → máy chủ **bỏ** gói `mv` của người đứng trong Thái Tuế Điện (`parseClient` trả `null`), người khác thấy họ đứng yên ở cửa. Giải thể phòng ngoài bản đồ sẽ hết lỗi; sau khi chuyển xong, thu `maxX` về `10 + 640` cho chặt.

### 5.3 Thay đổi giao thức (`protocol.js`, `net.js`, `worker/quan-room.js`)

| Gói | Hiện có | Thêm |
|---|---|---|
| `mv` (khách → chủ, ≤ 8 Hz) | `{ t, x, y, h, s, a }` | `l` = tầng 0–7 (mặc định 0). `parseClient`: `l: Number.isInteger(m.l) && m.l >= 0 && m.l <= 7 ? m.l : 0` |
| `mv` (chủ → khách) | `{ t, id, x, y, h, s, a }` | `l` |
| `ix` (khách → chủ) | — | `{ t: 'ix', o, a }`: `o` ∈ danh sách trắng vật dùng chung (§5.4), `a` ∈ hành động của vật đó |
| `ix` (chủ → khách) | — | `{ t: 'ix', id, o, a, at, n }`: ai làm, vật gì, khi nào (ms máy chủ), bộ đếm |
| `full` / chào (chủ → khách khi vào phòng) | danh sách người | thêm `props: { o: { a, at, n } }` — trạng thái vật dùng chung |

`net.js` nhận `ix` → gọi `onEvent({ t: 'ix', … })` → `render3d` phát hoạt cảnh + âm tại vật; người tự làm thì phát ngay ở máy mình (không chờ vòng về).

### 5.4 Vật dùng chung (đồng bộ máy chủ)

| `o` | Vật | `a` | Giới hạn máy chủ | Ghi chú |
|---|---|---|---|---|
| `sm.chuong` | Chuông lầu chuông Sơn Môn | `danh` | 1 lần / 4 s toàn phòng; 1 lần / 10 s mỗi người | cả phòng nghe; bộ đếm `n` hiện trên biển lầu |
| `sm.trong` | Trống lầu trống | `danh` | như trên | |
| `ht.trongcanh` | Trống canh thành lâu | `danh` | 1 lần / 6 s | |
| `hs.bacdau.chuong` | Chuông đỉnh Bắc Đẩu Lâu | `danh` | như chuông | |
| `sm.hoadang` | Đèn hoa đăng hồ sen (đã có trạm `sen`) | `tha` | 1 / 3 s | đèn thả trôi thấy được của người khác (tài liệu 10 quyết) |
| `ev.*` | Vật sự kiện lễ tiết | theo sự kiện | theo sự kiện | tài liệu 10 cấp `EV-*` |

**Không** đồng bộ: cửa (08-03 §6.8), đèn trong nhà, sách đang mở, ghế đang ngồi (ghế ngồi đã đồng bộ gián tiếp qua `sit` / `stand` hiện có).

### 5.5 Máy chủ (`worker/quan-room.js`)

- `parseClient` mới trả `{ t: 'ix', o, a }` nếu `o` trong `IX_OBJECTS` và `a` trong `IX_OBJECTS[o].actions`; ngược lại `null` (bị đếm vào `rateGate` như gói rác).
- Lưu `this.props = Map<o, { a, at, by, n }>`; kiểm giới hạn tần suất theo bảng §5.4; hợp lệ → `n += 1`, phát `broadcast`.
- Gửi `props` trong gói chào.
- Không lưu bền `props` qua lúc Durable Object ngủ (đếm theo phiên phòng); bộ đếm bền (nếu tài liệu 10 cần «chuông thứ 10.000 của máy chủ») dùng storage của Durable Object — để tài liệu 10 / 13 quyết.

### 5.6 Avatar người khác trong nhà

- Vẽ ở `groundY(x, z, l)`.
- Chỉ vẽ nếu khoang của họ **thấy được** (08-03 §4) hoặc họ ở ngoài trời — người ở tầng 2 không hiện xuyên trần khi mình ở tầng 1.
- Nhãn tên ẩn theo cùng luật.

### 5.7 Chơi đơn

Không kết nối: mọi `ix` xử lý cục bộ, bộ đếm `n` lấy từ `s.int.props`. Không có tính năng nào **bắt buộc** mạng để vào hay dùng công trình.
