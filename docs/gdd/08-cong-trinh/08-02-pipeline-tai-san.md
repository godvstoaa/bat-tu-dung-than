# 08-02 · Pipeline tài sản: vỏ, nội thất, đạo cụ

> Phần này nói **làm ra file thế nào**: từ mô hình Meshy khối liền tới bộ ba lớp `shell / interior / props` chạy được trong Three.js, kèm lưới va chạm nướng sẵn để test Node đọc được. Mọi script mới ghi rõ «(chưa có — cần làm)». Script đã có: `scripts/meshy-gen.mjs`, `meshy-pack.mjs`, `meshy-pack-library.mjs`, `meshy-lod.mjs`, `meshy-remesh.mjs`.

---

## 1. Luồng tổng

```
 ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐   ┌───────────────┐
 │ Meshy        │   │ ĐO LÒNG      │   │ KHOÉT · LÀM RỖNG │   │ TÁCH LỚP      │
 │ text-to-3D   │──▶│ bld-void     │──▶│ Blender headless │──▶│ bld-split     │
 │ (vỏ ngoài)   │   │ lát cắt 0,5m │   │ cut_door.py      │   │ SH / IN / PR  │
 │ hoặc thư viện│   │ → void.json  │   │ hollow.py        │   │ COL / meta    │
 └──────────────┘   └──────────────┘   └──────────────────┘   └───────┬───────┘
        ▲ duyệt lát cắt trước khi refine (tiết kiệm credit)                │
        │                                                                  ▼
 ┌──────┴───────┐   ┌──────────────┐   ┌──────────────────┐   ┌───────────────┐
 │ CÔNG THỨC    │   │ BỘ MÔ-ĐUN    │   │ NƯỚNG VA CHẠM    │   │ ĐÓNG GÓI      │
 │ int-*.js     │◀──│ MOD-<bộ>.glb │   │ bld-bake         │◀──│ bld-pack      │
 │ (khoang, cửa,│   │ (Blender     │   │ → .col.json      │   │ meshopt, webp │
 │  mảnh, trạm) │   │  một file/bộ)│   │ theo tầng lv     │   │ hd/mid/lod    │
 └──────┬───────┘   └──────────────┘   └────────┬─────────┘   └───────────────┘
        │                                      │
        ▼                                      ▼
   runtime: buildings.js · cells.js · doors.js · kit.js     test Node: test-game-buildings.mjs
```

Nguyên tắc:

1. **Meshy chỉ làm vỏ ngoài và đạo cụ «anh hùng»** (tượng, chuông, đỉnh, trống). Nội thất kết cấu dựng bằng **bộ mô-đun** (08-05, 08-06) — lắp theo lưới 3,2 m, nhân bản tức thời.
2. Mọi bước sau Meshy **chạy lại được bằng lệnh** (không sửa tay trong trình chỉnh rồi quên ghi). Bước sửa tay trong Blender phải lưu `.blend` vào `assets-bld/<slug>/work/` và ghi vào `assets-bld/<slug>/LOG.md`.
3. Kết quả đo (lòng nhà, cao sàn, trần) là **dữ liệu**, nằm trong `void.json`, và công thức nội thất đọc dữ liệu đó — không chép số tay.

---

## 2. Ba lớp và các nút phụ

### 2.1 Định nghĩa lớp

| Lớp | Tiền tố nút | Nội dung | Gộp lưới | Va chạm | Mờ khi vào trong |
|---|---|---|---|---|---|
| **Vỏ** | `SH__` | tường ngoài có độ dày thật, mái từng tầng mái, nền / bệ, ô cửa đi và cửa sổ **khoét thật**, lan can ngoài | gộp theo vật liệu, chia nhóm con theo vai | từ `COL__` nếu có, không thì cắt lát vỏ | theo nhóm con (`roof`, `upper`, `front`) |
| **Nội** | `IN__` | cột trong, sàn từng tầng, trần, vách ngăn, cầu thang, xà, vì kèo, lớp lót tường trong | gộp theo vật liệu **trong từng khoang** | cắt lát (cột, vách) + nền (`addPlatform`) | ẩn cả khoang khi không thấy |
| **Đạo cụ** | `PR__` | cánh cửa, chuông, trống, bàn thờ, tượng, kệ, bàn, đèn, sách — mọi vật có hook | **không gộp** | hộp / tròn theo loại | không |

### 2.2 Nút phụ (empty hoặc lưới ẩn)

| Tiền tố | Loại nút | Ý nghĩa | Bắt buộc |
|---|---|---|---|
| `COL__` | lưới ẩn, hình hộp / lăng trụ đơn giản | thay vỏ cho va chạm khi vỏ Meshy quá nhiễu (lá cây đắp, mái chìa xuống thấp) | khi vỏ có > 2 % ô va chạm sai (08-12 §3.3) |
| `CE__<cell>` | lưới hộp ẩn | khung khoang (cell AABB), xem 08-03 §2.2 | mỗi khoang |
| `PT__<a>__<b>` | lưới tứ giác ẩn | cửa nhìn (portal) giữa khoang `a` và `b` (`out` = ngoài trời) | mỗi ô cửa đi / cửa sổ / ô thông |
| `DR__<door>` | empty | trục bản lề cánh cửa; `extras.door` mô tả | mỗi cánh |
| `ST__<stair>` | lưới ẩn | dải cầu thang: hướng lên, độ cao đầu / cuối, tầng nối | mỗi đợt thang |
| `LT__<cell>__<n>` | empty | điểm đèn: `extras.light = { color, power, kind }` | ≥ 1 / khoang |
| `SP__<station>` | empty | chỗ đứng của trạm (spot) | mỗi trạm |
| `SE__<seat>` | empty | chỗ ngồi (bồ đoàn, ghế), hướng mặt theo trục +Z của empty | mỗi chỗ ngồi |
| `NP__<npc>` | empty | vị trí đứng / ngồi mặc định của NPC theo lịch | mỗi NPC |
| `AU__<cell>__<n>` | empty | nguồn âm tại chỗ (`extras.audio`) | tùy |
| `CA__<cell>` | empty | điểm neo camera gợi ý (cảnh hội thoại) | khoang có cảnh |
| `LB__<n>` | empty | nhãn (biển, câu đối) — `extras.label` | mỗi biển |

### 2.3 Nhóm con của vỏ (để mờ đúng phần)

| Nhóm | Tên nút | Mờ khi |
|---|---|---|
| Mái tầng 1 | `SH__roof_L0` | người chơi ở bất kỳ khoang nào của công trình và camera ở chế độ BỔ DỌC |
| Mái tầng 2 … | `SH__roof_L1`, `SH__roof_L2` | người chơi ở tầng thấp hơn tầng của mái đó |
| Tường tầng trên | `SH__upper_L1` … | người chơi ở tầng thấp hơn |
| Tường mặt trước | `SH__front` | camera BỔ DỌC và camera ở phía trước mặt tiền |
| Tường còn lại | `SH__wall` | chỉ mờ theo tia che khuất (cơ chế `fadeGroups` hiện có) |
| Nền, bệ | `SH__base` | không bao giờ |

Quy tắc tách nhóm tự động (khi vỏ Meshy là một lưới liền): tam giác có pháp tuyến hướng lên (`n.y > 0,35`) và nằm **trên** cao độ trần tầng cao nhất `ceilY(lv)` → `roof_Lk`; tam giác đứng nằm giữa `floorY(k)` và `ceilY(k)` của tầng `k ≥ 1` → `upper_Lk`; tam giác đứng thuộc dải 2 m sát mặt tiền (theo trục +Z cục bộ) → `front`; còn lại `wall`; dưới `floorY(0)` → `base`. Script `bld-split.mjs` (§7.3).

---

## 3. Quy ước đặt tên

### 3.1 Mã → tên tệp

| Thứ | Quy tắc | Ví dụ |
|---|---|---|
| Slug công trình | chữ thường, gạch nối, bỏ tiền tố `INT-` | INT-SM-CHINHDUONG → `sm-chinhduong` |
| Thư mục làm việc | `assets-bld/<slug>/{raw,work,cut,out}` | `assets-bld/sm-chinhduong/work/sm-chinhduong.blend` |
| Vỏ | `public/models/bld/<slug>/shell.glb`, `shell.hd.glb`, `shell.lod.glb` | |
| Nội thất riêng (mảnh không thuộc bộ) | `public/models/bld/<slug>/interior.glb` | tượng Tổ sư đặt làm riêng |
| Đạo cụ riêng | `public/models/bld/<slug>/props.glb` | chuông đồng lầu chuông |
| Dữ liệu đo | `assets-bld/<slug>/void.json` (không lên `public/`) | |
| Va chạm nướng | `public/bld/<slug>.col.json` | |
| Công thức | `src/game/int/<slug>.js` | `src/game/int/sm-chinhduong.js` |
| Bộ mô-đun | `public/models/kit/<bộ>.glb` (+ `.hd`, `.lod`), nút `MOD-<BỘ>-<xx>` | `public/models/kit/bac.glb` › nút `MOD-BAC-07` |
| Atlas bộ | nhúng trong GLB bộ; tên ảnh `kit-<bộ>-<kênh>` | `kit-bac-base`, `kit-bac-orm`, `kit-bac-normal` |
| Nhà nhân bản (hạng C) | vỏ dùng chung `lib_courtyard`; công thức theo **kiểu** `src/game/int/ht-nha-t1.js` … `t4.js` + biến thể sinh từ hạt giống | |

Công trình đang có giữ nguyên tệp vỏ cũ (`public/models/palace_grand.glb` …) cho tới khi có bản khoét; khi có, bản khoét nằm ở `public/models/bld/<slug>/shell*.glb` và công thức trỏ sang. Vỏ dùng chung nhiều nơi (`hall_main` ở 9 chỗ) **khoét một lần** thành `public/models/bld/_shared/hall_main-cut/shell*.glb`, công thức từng nơi trỏ tới bản chung.

### 3.2 Tên nút trong GLB

```
<LỚP>__<tên>[__<cờ>]
LỚP ∈ SH | IN | PR | COL | CE | PT | DR | ST | LT | SP | SE | NP | AU | CA | LB
cờ  ∈ lv0 … lv7 (tầng) · c:<cell> (khoang) · dyn (đạo cụ động) · nocast (không đổ bóng)
```

Ví dụ: `IN__cot_hien_03__lv0__c:cd.l0.chinh`, `PR__chuong_dong__dyn`, `PT__cd.l0.chinh__out`, `DR__cd.d.giua.trai`.

### 3.3 Khóa `extras` (glTF → `userData` trong Three)

| Khóa | Kiểu | Dùng ở | Ý nghĩa |
|---|---|---|---|
| `cell` | chuỗi | mọi nút IN / PR / LT / AU | khoang chứa |
| `lv` | số nguyên 0–7 | như trên | tầng |
| `hook` | chuỗi | PR | tên tương tác (`bell`, `drum`, `book`, `altar`, `seat`, `lamp`…) |
| `station` | chuỗi | PR / SP | id trạm trong `world.js › STATIONS` |
| `door` | `{ kind, w, h, leaves, swing, schedule }` | DR | 08-03 §6 |
| `stair` | `{ from, to, y0, y1, dir, width }` | ST | 08-04 §2 |
| `light` | `{ color, power, kind, flicker }` | LT | 08-04 §1 |
| `audio` | `{ bed, gain, radius }` | AU | 08-04 §4 |
| `label` | `{ han, hv, nghia }` | LB | chữ Hán, Hán Việt, nghĩa |
| `mod` | chuỗi | mảnh lắp từ bộ | mã `MOD-*` gốc (để thống kê) |

### 3.4 Vật liệu và ảnh

- Tên vật liệu: `<bộ>_<chất>_<màu>` — ví dụ `bac_go_son_do`, `vie_ngoi_mui_hai`, `chung_da_xanh`.
- Một bộ mô-đun có **tối đa 6 vật liệu**: `trim` (atlas viền / chạm), `wood`, `stone`, `fabric`, `metal`, `emissive`. Tất cả tham chiếu **một atlas 2048²** (bản `mid` thu 1024²).
- Ảnh WebP (đã có trong `meshy-pack.mjs`); kênh ORM gộp (AO-Rough-Metal) cho mọi atlas bộ.
- Màu khóa vùng (bảng màu 5 màu của từng thánh địa, tài liệu tổng §7) là **giá trị `color` nhân vào atlas xám** — cùng một mảnh MOD dùng được ở hai vùng cùng phong cách mà khác bảng màu.

---

## 4. Thư mục và vòng đời tệp

```
assets-bld/
  _shared/
    hall_main-cut/        ← vỏ dùng chung đã khoét (9 nơi đặt hall_main)
  sm-chinhduong/
    raw/palace_grand.glb  ← bản gốc chép từ assets-meshy/raw (không sửa)
    void.json             ← bld-void sinh
    work/sm-chinhduong.blend
    cut/shell.glb         ← sau khoét + làm rỗng + tách nhóm
    out/                  ← bld-pack sinh (rồi chép sang public/)
    LOG.md                ← nhật ký thao tác tay
public/
  models/bld/sm-chinhduong/shell{,.hd,.lod}.glb
  models/kit/bac{,.hd,.lod}.glb
  bld/sm-chinhduong.col.json
src/game/int/sm-chinhduong.js
```

`assets-bld/` giống `assets-meshy/`: lên git trừ `raw/` lớn (> 20 MB) — dùng LFS hoặc ổ chung (câu hỏi mở ở README).

---

## 5. Lấy nội thất từ mô hình Meshy khối liền

### 5.1 Bốn loại vỏ Meshy

Meshy (text-to-3D, `meshy-7.1`, `topology: triangle`) sinh **một lưới bề mặt** cho cả công trình. Đo bằng lát cắt cho thấy bốn loại:

| Loại | Đặc điểm | Ví dụ đo được | Cách xử lý |
|---|---|---|---|
| **V1 · vỏ rỗng kín** | Bề mặt khép kín, bên trong trống, không có sàn / vách trong | `cliff_palace` (sảnh trệt 61,5 × 15 ở bề rộng 64 m), `city_gate` (thân thành đài rỗng 62 × 23), `library_tower`, `observatory`, `sect_gate_grand` | Khoét cửa (§5.3) + lót tường trong bằng mô-đun (§5.6) + dựng sàn / tầng |
| **V2 · vỏ rỗng có phòng** | Đã có tường trong phân phòng, có lỗ ở chỗ mô hình «mở» | `gate_sect` (2 phòng gác kín + lối giữa thông), `palace_grand` (sảnh lõi + hành lang cột hai bên), `hall_main` (sảnh + hiên) | Khoét cửa đúng vị trí cửa vẽ; giữ vách Meshy nếu đủ dày, che vết cắt bằng khung cửa mô-đun |
| **V3 · khối đặc / bệ đặc** | Có mặt ngang lấp lòng ở tầm thân người (bệ, sàn nâng), lòng thật nhỏ | `lib_courtyard` (bệ ~1,5 m, sảnh 8,6 × 4,5 phía trên), `lib_pagoda_red` (đế đặc), `lib_stall_timber` (thân sạp đặc 5 × 4,5), `lib_wood_pavilion` (bệ đặc 5 × 3), `lib_paifang` (đế 20 × 17) | Không khoét được lòng → **dựng bệ thành nền đi được** (`addPlatform` + bậc), khoét lòng phía trên; sạp: cắt bỏ nửa sau thân |
| **V4 · lòng rác** | Bên trong có mảng tam giác thừa (mặt trong của mái chọc xuống, «mạng nhện» do remesh) | thường gặp ở model thư viện `lib_*` sau `meshy-remesh` | Xóa tam giác rác bằng phân loại khả kiến (§5.4) |

### 5.2 Đo lòng nhà bằng lưới va chạm — `scripts/bld-void.mjs` (chưa có — cần làm)

#### Thuật toán

1. Nạp GLB bằng `@gltf-transform/core` (`NodeIO` + `MeshoptDecoder` như `meshy-lod.mjs`), nhân ma trận thế giới của từng nút, **co giãn đúng như trong game** (`fit` của `placeModel`), đưa đáy về y = 0, tâm XZ về 0.
2. Với mỗi **dải cao** `[lo, hi]` (mặc định 0,4–2,0 · 2,0–3,6 · 3,6–5,2 · … bước 1,6 m tới đỉnh): cắt tam giác theo dải, chiếu xuống XZ, đánh dấu ô 0,5 m **đúng như `collide.js › addFootprint`** (cạnh lấy mẫu mỗi nửa ô, mặt tô ô có tâm nằm trong). Dùng lại mã `collide.js` (thuần, chỉ cần `three`), không viết thuật toán thứ hai.
3. **Lấp từ ngoài vào** (flood fill 4 hướng) từ mép khung bao + lề 2 m: ô trống chạm được từ ngoài = «ngoài». Ô trống không chạm được = **lòng kín**.
4. Với mỗi vùng lòng kín liên thông: diện tích, khung bao, **các hình chữ nhật cực đại** (thuật toán «maximal rectangles» trên lưới ô) — dùng để đặt khoang.
5. **Cao độ sàn / trần**: bắn tia dọc từ tâm mỗi hình chữ nhật cực đại xuống / lên, lấy mặt ngang gần nhất có pháp tuyến hướng lên / xuống.
6. **Độ dày tường**: khoảng cách từ ô lòng kín ngoài cùng tới ô «ngoài» gần nhất theo 4 hướng (trung vị).
7. Xuất `void.json` + bản đồ ASCII (`#` đặc, `.` ngoài, `o` lòng kín) mỗi dải.

#### Định dạng `void.json`

```json
{
  "model": "palace_grand", "fit": { "width": 44 }, "size": [44.0, 31.2, 26.2],
  "bands": [
    { "lo": 0.4, "hi": 2.0, "solidCells": 499, "voids": [
      { "area": 210, "box": [-10.0, -9.6, 10.0, 0.9], "rects": [[-10.0, -9.6, 10.0, 0.9]],
        "floorY": 0.45, "ceilY": 6.40, "wall": 0.55 } ] }
  ],
  "levels": [ { "lv": 0, "floorY": 0.45, "ceilY": 6.40 }, { "lv": 1, "floorY": 9.65, "ceilY": 12.9 } ],
  "measuredAt": "2026-11-05", "tool": "bld-void 0.1"
}
```

#### Kết quả đo thử (bản nguyên mẫu chạy trên GLB thật trong `public/models`, 2026-11-05)

Kích thước theo **fit đang dùng trong game**. Tọa độ cục bộ: X ngang, Z sâu (+Z = mặt tiền), gốc tâm khung bao.

| Mô hình · fit | Kích thước (R × C × S) | Dải 0,4–2,0 m | Dải trên | Kết luận |
|---|---|---|---|---|
| `palace_grand` · w 44 | 44 × 31,2 × 26,2 | lòng kín 20 × 10,5 (x −10…10, z −9,6…0,9) | 4,0–6,4: thêm lô gia trước 26 × 4 (lan can); 6,4–9,6 **đặc** (sàn + diềm); 9,6–12,8: lòng 19 × 13 có vách ngăn ở z ≈ 0,4 | V2 · 2 tầng: sảnh trệt ~6 m thông thủy, tầng 2 sàn ~9,6 |
| `palace_grand` · w 55,2 | 55,2 × 39,1 × 32,9 | (bệ) | 2,0–3,6: lòng 46,5 × 26,5; 12–16: 27 × 19 | dùng ở PT / LD |
| `hall_main` · w 22 | 22 × 17,1 × 20,2 | lòng 17,5 × 7 (x −9…8,5, z −6,1…0,9) | 3,6–5,2: 18 × 10 (gồm hiên); 6,8–10 đặc; 10–12: gác 15 × 8 | V2 · sảnh + hiên + gác |
| `lib_pavilion2` · w 12 | 12 × 13,4 × 13,3 | lòng 6 × 6 | 3,6–5,2: lan can lầu 8 × 8; 5,2–6,8: phòng lầu 5 × 5 | V2 · 2 tầng |
| `lib_pavilion2` · w 24 | 24 × 26,8 × 26,6 | lòng 21 × 21 (gồm hiên có lan can) | 2–8,4: sảnh 13 × 12,5; 8,4–10: lầu 17 × 17,5; 14–16: gác 12 × 11,5 | V2 · 3 mức |
| `lib_pagoda5` · h 26 | 17,2 × 26 × 17,3 | lòng 9 × 9 có trụ tâm | 6,8–8,4: hành lang tầng 2 11 × 11; 8,4–10: phòng 7 × 7,5; 12–14: 10 × 10,5; 14–16: 7 × 6,5 | V2 · tầng ~5,4 m |
| `lib_pagoda_red` · h 20 | 20,1 × 20 × 17,3 | đế đặc, lòng 4 × 4,5 | 2–3,6: sân đế có lan can 14 × 12; 3,6–5,2: phòng 7 × 9; > 8,4: ≤ 3 × 2,5 | V3 · trên tầng 1 là tháp đặc |
| `lib_pagoda_red` · h 46 | 46,2 × 46 × 39,7 | đế đặc, túi rỗng rải rác | 2–6,8: lòng đế 14 × 11; 6,8–10: sân thượng 33 × 28; 14–18: tầng 25 × 22; 18–20: 12 × 10,5 | V3 + V2 |
| `gate_sect` · w 30 | 30 × 17,4 × 10,9 | 2 phòng kín ~10 × 5 (x ±3…±13), lối giữa 5 m thông | 5,2–6,8: 2 phòng 4 × 6; 6,8–12: lầu cổng 12–13 × 3,5–5 trên lối giữa | V2 |
| `gate_sect` · w 20 | 20 × 11,6 × 7,2 | 2 phòng 6,3 × 3,3, lối 3,3 m | trên: < 3 m | V2 nhỏ |
| `lib_wood_pavilion` · w 7 | 7 × 6,8 × 5,3 | **bệ đặc** 5 × 3 | 2–3,6: khám 3 × 1,5 | V3 · đình trên bệ |
| `lib_courtyard` · w 11,5 | 11,5 × 5,7 × 7,7 | **bệ đặc** ~9,5 × 7 | 2–3,6: sảnh 8,6 × 4,5; trên 3,6 đặc (mái) | V3 · nhà trên bệ |
| `lib_stall_timber` · w 5,5 | 5,5 × 7,5 × 4,7 | **thân đặc** 5 × 4,5 | đặc tới 8,4 | V3 · phải cắt |
| `lib_paifang` · w 26 | 26 × 11,4 × 17,2 | **đế đặc** 20 × 17 (lối giữa khoét 8 m) | 5,2–6,8: khoảng giữa xà 16 × 6,5 | V3 · D |
| `cliff_palace` · w 64 | 64 × 24,9 × 17,3 | lòng 61,5 × 15 | 5,2–6,8: 4 phòng 5–6 m; 10–16: phòng 45 × 9 | V1 · sảnh dài |
| `cliff_palace` · w 55,2 | 55,2 × 21,5 × 15 | lòng 53 × 12,9 (suy theo tỉ lệ) | | dùng ở Hậu Sơn |
| `city_gate` · w 64 | 64 × 49,2 × 30,1 | thân thành đài **rỗng** 62 × 23 tới 20 m; lối giữa ~7 m | 24–28: túi phòng nhỏ; 32–36: thành lâu 24 × 8 | V1 · vỏ không lõi |
| `tower_nine` · h 37,2 | 14,8 × 37,2 × 14,9 | phòng 6 × 6,5 (tường dày ~4 m) | 8,4–10: 8 × 8; 14–16: 7,5 × 8; 20–24: 5 × 5,5 | V2 · 9 tầng ~3,7 m |
| `library_tower` · h 48 | 51,2 × 48 × 48,9 | **rỗng toàn khối** 43 × 44 tới 24 m | | V1 · vỏ không lõi |
| `observatory` · w 90 | 90 × 36,7 × 82,7 | **rỗng** 82 × 77 tới 5,2 m | 5,2–6,8 đặc (mặt đài); 6,8–8,4: lan can quanh đài 81 × 70 | V1 · đài rỗng |
| `tea_pavilion` · w 34 | 34 × 20,6 × 31,5 | mở (cột chống) | 3,6–5,2: sàn có lan can 24,5 × 23,5; 8,4–10: 23 × 20,5; 10–16: 16,5 × 15 | V2 · lầu trên cột |
| `lib_garden_pav` · w 16 | 16 × 9,2 × 15,7 | mở | 2–5,2: phòng 11 × 10,5 | V2 · trên bệ thấp |
| `lib_mtn_house` · w 34 | 34 × 26,8 × 33,9 | **bệ đá đặc** toàn bộ | 2–5,2: sân trên bệ 31,5 × 29; 5,2–10: nhà 28 × 17–26; 10–12: 25,5 × 27,5; 18–20: 13,5 × 18 | V3 + V2 · nhiều cấp |
| `sect_gate_grand` · w 70 | 70 × 44,6 × 40,7 | rỗng 69 × 40 | 3,6–14: 66 × 27; 14–20: 65 × 21; 20–24: 65 × 10,5 | V1 · cổng có thân lớn |

Những con số này là **đầu vào thiết kế** cho spec INT (08-07 … 08-11). Khi có `bld-void` chính thức phải chạy lại và cập nhật; sai lệch > 0,4 m ở bất kỳ cạnh khoang nào → mở lại spec.

### 5.3 Khoét cửa (boolean) — `scripts/bld/cut_door.py` (chưa có — cần làm)

**Công cụ chính: Blender 4.x chạy headless** (`blender -b assets-bld/<slug>/work/<slug>.blend -P scripts/bld/cut_door.py -- <slug>`), bộ giải boolean **Exact** (chịu lưới không kín tốt hơn). Công cụ phụ: thư viện `manifold-3d` (WASM, chạy trong Node) — chỉ dùng khi lưới vỏ đã kín (manifold); vỏ Meshy hiếm khi kín nên Blender là mặc định.

**Đầu vào** `assets-bld/<slug>/cuts.json`:

```json
{ "fit": { "width": 44 }, "cuts": [
  { "id": "cd.d.giua", "kind": "door", "center": [0, 0.45, 0.9], "w": 3.2, "h": 3.75, "depth": 1.4, "frame": "MOD-BAC-21" },
  { "id": "cd.w.dong1", "kind": "window", "center": [9.95, 2.6, -4.2], "w": 1.6, "h": 1.6, "depth": 1.2, "axis": "x", "frame": "MOD-BAC-24" }
] }
```

**Các bước script:**

1. Nhập GLB vỏ, áp dụng toàn bộ biến đổi, **co giãn theo fit** (làm việc ở mét thế giới cho dễ đo), gộp các lưới con thành một đối tượng `SHELL`.
2. Hàn đỉnh (merge by distance 0,002 m), tính lại pháp tuyến hướng ra ngoài (`normals_make_consistent`).
3. Mỗi `cut`: tạo hộp cắt `w + 0,02` × `h` × `depth` (xuyên tường, thò mỗi phía ≥ 0,3 m), đáy hộp đặt **đúng cao độ sàn** (`center.y` lấy từ `void.json › levels[lv].floorY`) để bậc cửa không nhô.
4. Boolean **Difference**, solver Exact, `use_self = false`, `use_hole_tolerant = true`.
5. **Kiểm sau cắt** (tự động): bắn 9 tia ngang qua ô cửa (3 × 3 điểm trong khung `w − 0,2` × `h − 0,2`) — mọi tia phải xuyên qua không chạm vỏ. Lỗi → ghi `LOG.md`, dừng.
6. Gắn **khung cửa mô-đun** (`frame`) đúng tâm ô: khung che toàn bộ mép cắt thô (rộng hơn ô 0,15 m mỗi bên, sâu bằng độ dày tường đo được + 0,1 m). Đây là **mẹo bắt buộc**: không bao giờ để lộ mép boolean.
7. Mặt mới sinh do boolean (má cửa) gán vật liệu `chung_go_tham` (gỗ sẫm trơn) và UV hộp (box projection 1 m) — phần lớn bị khung che.
8. Xuất `cut/shell.glb` (chưa tách nhóm).

**Chọn vị trí cửa**: ưu tiên **đúng chỗ cửa vẽ trên texture Meshy** (người chơi đã thấy cửa ở đó). Lấy tọa độ bằng ảnh chiếu thẳng mặt tiền (render orthographic trong Blender, lưới 0,5 m chồng lên) — họa sĩ đánh dấu khung, script đọc. Nếu cửa vẽ không trùng ô lòng kín (cửa vẽ dẫn vào tường đặc) → dời cửa vào ô lòng gần nhất và **vẽ lại texture vùng cửa cũ** thành tường (bước tay, ghi `LOG.md`).

### 5.4 Làm rỗng và dọn lòng — `scripts/bld/hollow.py` (chưa có — cần làm)

Cho loại V3 / V4:

1. **Phân loại tam giác theo khả kiến**: lấy mẫu điểm trong lòng kín (từ `void.json`, mỗi ô lòng một điểm ở độ cao giữa dải) và điểm bên ngoài (vòng tròn cách khung bao 10 m, 64 điểm × 4 độ cao). Một tam giác:
   - thấy được từ ngoài → giữ (thuộc vỏ);
   - thấy được từ trong, không thấy từ ngoài → **mặt trong** (giữ, gắn nhóm `SH__inner`, sau này bị lớp lót che);
   - không thấy từ đâu (nằm kẹt trong khối) → **xóa**.
2. **Khoét lòng khối đặc** (V3): hộp lòng = hình chữ nhật cực đại của dải trên bệ, kéo xuống tới `floorY` mong muốn, thu vào trong `wall` đo được; boolean Difference. Bệ nhà dân (`lib_courtyard`) **không khoét**: bệ là bệ thật (nhà Bắc Bộ / Hoa Bắc đều đặt trên nền tôn cao), chỉ thêm bậc và mặt nền đi được.
3. Xóa mảnh rời nhỏ (< 50 tam giác, không nối vỏ) nằm trong lòng.
4. Lặp lại `bld-void` trên kết quả; lòng phải tăng hoặc giữ nguyên, không được thủng ra ngoài (ô lòng không được thành ô «ngoài» trừ qua ô cửa đã khoét).

### 5.5 Chọn mẫu Meshy có cửa mở

Với công trình **mới** (tài liệu 07), sinh vỏ có ý đồ ngay từ prompt. Quy tắc prompt (ghép với `manifest.style` trong `meshy-gen.mjs`):

| Nên có trong prompt | Tránh trong prompt |
|---|---|
| «open double doors», «doorway leading inside», «hollow interior», «visible interior through doorway», «single-storey hall with front porch», «two-storey hall with balcony and railings» | «solid», «closed shutters», «sealed», «fortress», chi tiết đắp kín chân tường |
| số gian: «five-bay facade, central bay doorway 3 m wide» | «ornate wall covering every surface» |
| «flat interior floor at plinth level» | «stepped massive base» (sinh bệ đặc như `lib_paifang`) |

**Kiểm lát cắt trước khi refine**: `preview` (20 credit) → tải GLB preview → chạy `bld-void` → chỉ `refine` (10 credit) khi:

- lòng kín dải 0,4–2,0 m ≥ 55 % diện tích khung bao trong (trừ hiên);
- cửa vẽ trùng một ô lòng kín;
- tầng trên (nếu nhìn thấy cửa sổ) có lòng ≥ 3,2 × 3,2 m.

Không đạt → `meshy-gen.mjs reject <id> "lòng < 55 %"` rồi `preview` lại. Tiết kiệm 10 credit mỗi mẫu hỏng.

**Bảng liên hệ** (contact sheet) hiện có ở `assets-meshy/contact-sheet.jpg`: thêm cột «lát cắt 0,4–2,0» cạnh mỗi ảnh để duyệt cùng lúc.

### 5.6 «Tái sinh vỏ nội» — lớp lót trong tự động

Mặt trong của vỏ Meshy thô, texture kéo giãn, pháp tuyến lộn. Không sửa mặt trong; **phủ một lớp lót** bằng mô-đun:

1. Từ `void.json`, lấy **đường biên** của mỗi vùng lòng kín ở dải sàn (thuật toán dò biên trên lưới ô → đa giác vuông góc).
2. **Làm thẳng** đa giác theo lưới phụ 0,4 m (gộp đoạn lệch < 0,3 m), bo góc vuông.
3. Rải mảnh **tường lót** của bộ (`MOD-<BỘ>-03`, `-04`: dài 3,2 / 1,6 m) dọc biên, lùi vào trong 0,05 m so với mặt trong vỏ; chỗ có ô cửa đã khoét → rải khung cửa tương ứng (đã đặt ở §5.3).
4. Rải **trần lót** (`MOD-<BỘ>-10` ô cờ / `-11` vì kèo hở) theo hình chữ nhật cực đại, ở `ceilY`.
5. Rải **sàn** (`MOD-<BỘ>-01` gạch / `-02` ván) ở `floorY`.
6. Xuất thành phần `IN__liner_*` của công thức (không phải sửa vỏ).

Kết quả: người chơi trong nhà chỉ thấy lớp lót sạch; nhìn từ ngoài qua cửa thấy lớp lót; vỏ Meshy giữ nguyên ngoại thất.

**Lót kép cho tường mỏng**: nếu `wall` đo được < 0,25 m, lớp lót lùi 0,05 m sẽ xuyên ra ngoài ở chỗ vỏ lồi → dùng `COL__` thay vỏ cho va chạm và lùi lót 0,12 m.

### 5.7 Khi nào bỏ vỏ Meshy, dựng lại toàn bộ bằng mô-đun

Bỏ khi có **≥ 2** điều sau:

- lòng kín dải sàn < 40 % khung bao trong;
- công trình cần **> 2 tầng đi được** mà lát cắt không có sàn tầng trên;
- vỏ có > 15 % ô va chạm sai (lá cây đắp tường, mái chạm đất);
- công trình nằm trong khoang nhìn gần của cảnh cắt (CUT, tài liệu 03) và mặt trong bị thấy nhiều.

Khi bỏ: giữ **mái và trang trí đỉnh** của vỏ Meshy (cắt theo cao độ, `SH__roof_*`), dựng thân và nội thất bằng mô-đun. Ví dụ đề xuất: các tháp `tower_nine` cao 80–112 m ở vùng (tầng ~8–11 m mỗi tầng sau khi phóng, lát cắt không có sàn tầng ở tỉ lệ đó) → thân dựng lại bằng `MOD-BAC` thân tháp (08-05 §3, mảnh 40–45).

---

## 6. Blender và gltf-transform — từng lệnh

### 6.1 Chuẩn bị (một lần mỗi công trình)

```bash
mkdir -p "assets-bld/sm-chinhduong/"{raw,work,cut,out}
cp assets-meshy/raw/palace_grand.glb assets-bld/sm-chinhduong/raw/
node scripts/bld-void.mjs sm-chinhduong --model palace_grand --fit width=44 --bands auto   # → void.json + ASCII
```

### 6.2 Blender (headless, có thể mở GUI để duyệt)

| Bước | Lệnh / thao tác | Kết quả |
|---|---|---|
| B1 | `blender -b -P scripts/bld/import.py -- sm-chinhduong` | `work/sm-chinhduong.blend`: vỏ đã co giãn theo fit, áp biến đổi, hàn đỉnh |
| B2 | Họa sĩ mở `.blend`, đặt hộp cắt theo `cuts.json` (hoặc sửa `cuts.json` rồi chạy lại) | |
| B3 | `blender -b work/sm-chinhduong.blend -P scripts/bld/cut_door.py -- sm-chinhduong` | ô cửa khoét, khung gắn, kiểm tia |
| B4 | `blender -b … -P scripts/bld/hollow.py -- sm-chinhduong` (chỉ V3 / V4) | lòng sạch |
| B5 | Đặt nút phụ `CE__`, `PT__`, `DR__`, `ST__`, `LT__`, `SP__` … (có thể sinh từ công thức rồi nhập ngược — §6.4) | |
| B6 | `blender -b … -P scripts/bld/export.py -- sm-chinhduong` | `cut/shell.glb` (Y-up, mét, `export_extras = True`, không nén) |

Thiết lập xuất glTF bắt buộc: `export_format='GLB'`, `export_yup=True`, `export_apply=True`, `export_extras=True`, `export_materials='EXPORT'`, `export_image_format='AUTO'`, `export_draco_mesh_compression_enable=False` (nén meshopt làm ở bước sau, `assets.js` đã đăng ký `MeshoptDecoder`).

### 6.3 Tách lớp — `scripts/bld-split.mjs` (chưa có — cần làm)

Đọc `cut/shell.glb` bằng `@gltf-transform/core`:

1. Với vỏ một lưới liền: tách tam giác theo quy tắc §2.3 thành các nút `SH__roof_L0`, `SH__upper_L1`, `SH__front`, `SH__wall`, `SH__base` (mỗi nhóm một `Primitive` mới cùng vật liệu, chỉ số đỉnh lọc lại).
2. Nút `COL__`, `CE__`, `PT__` … giữ nguyên, gắn `extras.hidden = true` (runtime không vẽ).
3. `prune()` + `dedup()` + `weld({ tolerance: 0.0005 })`.
4. Xuất `cut/shell.split.glb`.

### 6.4 Đóng gói — `scripts/bld-pack.mjs` (chưa có — cần làm)

Mở rộng logic `meshy-pack.mjs` cho ba lớp:

```bash
# vỏ: 3 mức như công trình trùm hiện nay
node node_modules/@gltf-transform/cli/bin/cli.js optimize cut/shell.split.glb out/shell.hd.glb \
  --texture-compress webp --texture-size 2048 --compress meshopt --simplify-error 0.0004
node node_modules/@gltf-transform/cli/bin/cli.js optimize cut/shell.split.glb out/shell.glb \
  --texture-compress webp --texture-size 1024 --compress meshopt --simplify-error 0.0008
node scripts/meshy-lod.mjs cut/shell.split.glb out/shell.lodtmp.glb t:15000 auto
node node_modules/@gltf-transform/cli/bin/cli.js optimize out/shell.lodtmp.glb out/shell.lod.glb \
  --texture-compress webp --texture-size 512 --compress meshopt --simplify false
```

Lưu ý: `--simplify` phải **giữ tên nút và nhóm** (simplify của gltf-transform giữ nút). Bản `.lod` **gộp mọi nhóm vỏ** (nhìn xa không mờ từng phần) và **bỏ** mọi nút phụ trừ `PT__` cửa ngoài (để biết cửa sổ sáng đèn ban đêm, §8.3).

Nội thất riêng / đạo cụ riêng: một mức (`.glb`, texture 1024; tượng thần 2048 như `meshy-pack.mjs` đang làm với `deity_*`), không có `.lod` — không vẽ khi ở xa.

### 6.5 Nướng va chạm — `scripts/bld-bake.mjs` (chưa có — cần làm)

Lý do: hiện va chạm của model chỉ có **trong trình duyệt** (`collide.js` chạy khi model nạp xong), test Node (`test-game-state.mjs`) chỉ thấy khối tay của `court.js`. Muốn test «đi vào mọi công trình» bằng Node phải có va chạm dạng dữ liệu.

1. Dựng cảnh ảo trong Node: vỏ (đã khoét) đặt đúng `at`/`fit` của công thức + toàn bộ mảnh mô-đun theo công thức (dùng chính `kit.js` ở chế độ không vẽ).
2. Với mỗi tầng `lv`: chạy `addFootprint` với dải `[floorY(lv) + 0,4, floorY(lv) + 2,0]` lên **một tập ô riêng của tầng đó**.
3. Áp **khoét cửa** (`keep`) theo danh sách ô cửa của công thức (08-03 §6.7) — ô dưới khung cửa luôn trống.
4. Ghi nền (`addPlatform` của sàn, bậc, chiếu nghỉ) và liên kết cầu thang.
5. Xuất `public/bld/<slug>.col.json`:

```json
{ "v": 1, "id": "INT-SM-CHINHDUONG", "cell": 0.5,
  "levels": {
    "0": { "i0": -46, "j0": -90, "w": 92, "h": 60, "rle": "46.#3.12#...", "plats": [[0, -35.35, 20, 10.5, 0, 4.45]] },
    "1": { "i0": -40, "j0": -80, "w": 80, "h": 30, "rle": "…", "plats": [[0, -33.1, 19, 13, 0, 13.65]] } },
  "stairs": [ { "id": "cd.s.tay", "from": 0, "to": 1, "rects": [[-9.3, -38.0, 1.4, 0.25, 0, 4.7], "…"], "switchY": 9.0 } ],
  "doors": [ { "id": "cd.d.giua", "lv": 0, "rect": [-1.6, -30.35, 1.6, -29.85] } ],
  "hash": "sha1:…" }
```

`rle`: chuỗi mã hóa độ dài loạt theo hàng (`.` trống, `#` đặc). Runtime: `obstacles.js › addBakedCells(data)` (chưa có — cần làm) — nhanh hơn cắt lát hàng chục nghìn tam giác lúc nạp, và **giống hệt** giữa trình duyệt và Node.

`hash` = SHA-1 của (vỏ + công thức + phiên bản bộ mô-đun). CI so `hash` với tệp nguồn; lệch → báo «quên nướng lại».

---

## 7. LOD theo lớp

| Lớp | Mức | Khi dùng | Nguồn |
|---|---|---|---|
| Vỏ | `shell.hd.glb` (≤ 300k tam giác A, tex 2048) | chất lượng `high`, < `max(4·fit, 80)` m — cùng quy tắc `assets.js › placeLod` | `bld-pack` |
| Vỏ | `shell.glb` (≤ 140k A / 80k B, tex 1024) | `mid` / `low`, gần | |
| Vỏ | `shell.lod.glb` (≤ 15k, tex 512) | xa | `meshy-lod.mjs t:15000` |
| Nội thất (khoang) | LOD0 duy nhất | chỉ khi khoang **thấy được qua cửa nhìn** và trong bán kính tải | bộ mô-đun mức `mid` / `hd` |
| Nội thất | — | ngoài bán kính tải: **không tồn tại trong cảnh** | |
| Đạo cụ | LOD0; ẩn khi cách camera > 25 m (trừ đạo cụ lớn: chuông, tượng > 3 m: 60 m) | | |
| Bộ mô-đun | `kit/<bộ>.hd.glb` / `<bộ>.glb` / `<bộ>.lod.glb` | `.lod` chỉ cho **mảnh lộ ngoài** (hiên, lan can, cột hiên) khi công trình ở xa | `bld-pack --kit` |
| Cửa sổ đêm | thẻ phát sáng (quad emissive) gắn sau mỗi ô cửa sổ ngoài | xa > 60 m, ban đêm, khoang có người | sinh từ `PT__…__out` loại `window` |

**Thẻ cửa sổ đêm**: khi nội thất chưa tải (xa), ô cửa sổ vẫn phải «có người» ban đêm (lời hứa H3). Mỗi `PT__` loại cửa sổ sinh một quad lùi 0,3 m sau ô cửa, vật liệu emissive màu ấm, cường độ theo lịch đèn của khoang (08-04 §1.6). Một công trình A có tối đa 24 quad → gộp thành một lưới, một draw call.

---

## 8. Ngân sách texture và đa giác

### 8.1 Texture

| Thứ | `low` | `mid` | `high` | Ghi chú |
|---|---|---|---|---|
| Atlas một bộ mô-đun (base + ORM + normal) | 512² | 1024² | 2048² | dùng chung toàn vùng |
| Vỏ công trình A | 1024² × 3 ảnh | 1024² × 3 | 2048² × 3 | như `HD_IDS` hiện nay |
| Vỏ công trình B / C / D | 512² | 1024² | 1024² | |
| Tượng thần, chuông, đạo cụ anh hùng | 1024² | 1024² | 2048² | như `deity_*` |
| Canvas động (biển can chi, bài vị, bia) | 256 × 128 … 1152 × 960 | | | vẽ bằng `CanvasTexture` như `interior.js` |
| **Tổng texture mới khi đứng trong 1 công trình A** | ≤ 24 MB | ≤ 48 MB | ≤ 96 MB | đo `renderer.info.memory.textures` × kích thước |

Hướng tương lai: KTX2 / Basis (nén trên GPU) giảm 4–6 lần bộ nhớ — cần thêm `KTX2Loader` vào `assets.js` và bước `--texture-compress ktx2` khi đóng gói; ghi vào danh sách việc (08-13 §3, bước tùy chọn).

### 8.2 Đa giác mảnh mô-đun

| Loại mảnh | Tam giác (mid) | Ví dụ |
|---|---|---|
| Kết cấu lớn (cột, xà, tường 3,2 m) | 60–400 | cột tròn 16 cạnh: 128 |
| Trang trí (đấu củng, cốn chạm, khám) | 400–2.500 | đấu củng một cụm: 1.200 |
| Đồ đạc (bàn, ghế, kệ, giường) | 150–1.200 | án thư: 600 |
| Đạo cụ anh hùng (tượng, chuông, trống) | 3.000–25.000 | tượng thần Meshy hiện có ~25k |
| Vải / phướn (lưới uốn) | 50–300 | phướn: 64 |

Chạm thủng (cốn chạm, bức bàn lưới) **không làm bằng hình học** — dùng texture alpha-test (`alphaTest: 0.5`, `side: DoubleSide`) trên tấm phẳng; chỉ khung ngoài là hình học.

---

## 9. Bộ mô-đun — quy trình làm

1. **Một tệp Blender mỗi bộ**: `assets-bld/_kits/<bộ>/<bộ>.blend`, mỗi mảnh là một đối tượng tên đúng mã `MOD-<BỘ>-xx`.
2. **Gốc (pivot)**: mảnh sàn / tường / cột: gốc ở **góc dưới trái phía trong** theo lưới gian; đồ đạc: gốc ở **tâm đáy**; vật treo: gốc ở **điểm treo**.
3. **Ổ khớp (socket)**: empty con tên `SK__<loại>__<n>` — loại theo bảng khớp ở 08-05 §1.3.
4. **Va chạm**: mỗi mảnh khai báo loại va chạm (08-05 §1.4) trong `extras.col`; mảnh có hình va chạm riêng thì kèm lưới con `COL__`.
5. **Hook**: mảnh tương tác khai `extras.hook` và trạng thái động (cánh cửa, nắp hòm, trang sách).
6. Xuất **một GLB mỗi bộ**, mọi mảnh ở gốc tọa độ (không dàn ra), texture atlas nhúng.
7. `bld-pack --kit <bộ>`: 3 mức texture; hình học không giản lược ở `.hd` / `mid` (mảnh đã ở ngân sách); `.lod` giản lược 40 % chỉ cho mảnh có cờ `ext` (lộ ngoài).
8. Runtime `kit.js` (chưa có — cần làm): `loadKit(bộ)` → bảng `Map<modId, { geometry, material, col, sockets, hook }>`; `assemble(cellGroup, pieces)` → gom mảnh trùng mã thành `InstancedMesh`, mảnh duy nhất thành `Mesh`, rồi `mergeStatic` theo khoang.

---

## 10. Đạo cụ anh hùng làm bằng Meshy — kế hoạch credit

Tài khoản hiện còn **7 credit** (tài liệu tổng §13.3). Đạo cụ anh hùng cho các công trình **đang có** (thật hóa giai đoạn M1):

| Mã tài sản (`manifest.json`) | Dùng ở | Preview + refine (credit) | Ghi chú prompt |
|---|---|---|---|
| `prop_bell_bronze` | Lầu chuông Sơn Môn, Bắc Đẩu Lâu | 30 | «bronze temple bell, Daoist trigram band, hanging loop, 1.6 m tall» |
| `prop_drum_great` | Lầu trống | 30 | «large barrel drum on red lacquer stand, cowhide heads, brass nails» |
| `prop_qing_stone` | Chính Đường, Tĩnh Thất | 30 | «L-shaped stone chime (qing) hanging on wooden frame» |
| `prop_muyu` | Tổ Sư đường, Giảng Đường | 25 | «wooden fish block, red lacquer, cushion» (không cần 4K) |
| `deity_tosu` | Tổ Sư đường | 30 | **tượng hư cấu** «Huyền Quán tổ sư», «no real deity likeness» — duyệt nội dung §14 tổng |
| `prop_scripture_chest` | Tàng Kinh, Tàng Thư Các | 25 | «camphor scripture chest with brass corners» |
| `prop_incense_great` | Chính Điện Tam Thanh | 30 | «three-legged bronze censer, lid with lion, 1.4 m» |
| `prop_lantern_hall` | mọi điện | 25 | «hexagonal palace lantern, silk panels» |
| `prop_bookcase_tall` | Tàng Kinh, Thư Lâu | 25 | thay dần `lib_bookshelf` (đang dùng ở sảnh Thư Viện) |
| `prop_armillary` | Quan Tinh Đài | 30 | «bronze armillary sphere on dragon stand» |
| `prop_loom_small` | nhà dân nghề dệt | 25 | |
| `prop_cooking_stove` | nhà dân, quán | 25 | «brick kitchen stove with two woks, chimney» |
| **Cộng** | | **330** | |

Phần còn lại của nội thất (bàn, ghế, kệ, cột, vách, trần, bàn thờ…) **làm thủ công hoặc thủ tục** như `interior.js` đang làm — không tốn credit.

---

## 11. Kiểm tra tự động trong pipeline

Chạy trong `bld-pack` (thất bại → không xuất):

| # | Kiểm | Ngưỡng |
|---|---|---|
| P1 | Tên nút đúng mẫu §3.2 | 100 % |
| P2 | Mọi `PR__` có `extras.hook`; mọi `SP__` có `extras.station` khớp `STATIONS` | 100 % |
| P3 | Tam giác từng lớp ≤ ngân sách hạng (08-01 §12) | |
| P4 | Texture ≤ ngân sách §8.1 | |
| P5 | Mọi `CE__` nằm trong lòng kín đo được (≥ 92 % ô của khoang là ô lòng) | sai → khoang lấn tường |
| P6 | Mọi `PT__` cửa đi: ô cửa rộng hình học ≥ 1,8 m (C) / 2,4 m (A, B) và 9 tia xuyên (§5.3 bước 5) | |
| P7 | Pháp tuyến lớp lót hướng vào trong (dot với vector từ tâm khoang > 0 cho ≥ 98 % tam giác) | |
| P8 | Không có mảnh mô-đun nào lơ lửng: đáy mảnh đặt sàn cách `floorY` ≤ 0,02 m (trừ vật treo) | |
| P9 | `col.json` có `hash` khớp | |
| P10 | Ảnh lát cắt 0,4–2,0 m sau khoét: không còn ô lòng kín nào **không nối** với ô cửa (lòng cô lập = phòng không lối vào) trừ khoang khóa khai báo | |
