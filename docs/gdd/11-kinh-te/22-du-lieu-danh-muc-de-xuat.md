# 11 · Phần 22 — Dữ liệu danh mục đề xuất (sẵn để nạp vào `cosmetics.js`)

> Biến danh mục của phần 04 §6, phần 05 và phần 06 §2 thành **dữ liệu theo đúng khuôn `cosmetics.js › ITEMS`**: `id`, `slot`, `rarity`, `price`, `unlock`, `look`. Mục đích: tài liệu 13 / người lập trình nạp danh mục mà không phải đoán. Tên hiển thị và mô tả lấy ở bảng của phần 05, 06 (cột «Tên», «Ghi chú»), qua quy tắc lời văn phần 01 §7.2.
>
> Bảng §3, §4 được sinh bằng script đọc chính các bảng trong phần 05, 06 (để giá không lệch); `look` của phẩm phục là đề xuất màu, họa sĩ có thể chỉnh trong dải ±0,05 mỗi kênh.

---

## 1. Quy ước

| Trường | Quy ước |
|---|---|
| `id` | `r_<vùng>_<nn>` cho món vùng, `f_<lễ>_<nn>` cho món lễ, tên ngắn cho thân bộ mới (`hoa_quan` …); không trùng `id` hiện có (`ITEM` của `cosmetics.js`) |
| `sku` | trường mới chứa mã `SKU-*` (lint L2 phần 04 đã cho phép) |
| `price` | `{ ngoc }`, `{ phuc }` hoặc giá kép `{ ngoc, phuc }`; `canBuy` / `buy` hiện chỉ xử lý **một** tiền — cần mở rộng để người chơi chọn tiền khi món có giá kép (tài liệu 13) |
| `unlock` | ngoài `level`, `vip`, `streak` đã có: thêm `conlon` (đã vào Côn Lôn — máy chủ kiểm), `region` (đã ghé vùng — phần 05 V1, áp cho **mọi** món `r_*` nên không ghi lặp trong bảng), `consultPending` (khóa tới khi cố vấn đồng ý — món không hiện) |
| `festival` | món lễ có `festival: '<mã lễ>'`; máy chủ chỉ bán trong cửa sổ lễ (phần 06 §1) |
| `look` | mảng HSV như `P(h, s, v)` trong `cosmetics.js`, chỉ cho `slot: 'robe'` |
| `iosName` | theo phần 14 §4 khi tên có chữ cấm trên iOS |

---

## 2. Thân bộ mới (`SKU-K`)

```js
{ id: 'hoa_quan', sku: 'SKU-K-01', slot: 'head', set: 'hoa', name: 'Xích Đồng Quan',    rarity: 3, price: { ngoc: 120, phuc: 600 } },
{ id: 'aura_hoa', sku: 'SKU-K-02', slot: 'aura', set: 'hoa', name: 'Đăng Hỏa Vi Quang', rarity: 3, price: { ngoc: 150, phuc: 600 } },
{ id: 'aura_tho', sku: 'SKU-K-03', slot: 'aura', set: 'tho', name: 'Hoàng Sa Toàn',     rarity: 3, price: { ngoc: 150, phuc: 600 } },
{ id: 'kim_kiem', sku: 'SKU-K-04', slot: 'back', set: 'kim', name: 'Bạch Ngân Kiếm',    rarity: 3, price: { ngoc: 140, phuc: 600 } },
{ id: 'aura_kim', sku: 'SKU-K-05', slot: 'aura', set: 'kim', name: 'Kim Phong Ảnh',     rarity: 3, price: { ngoc: 150, phuc: 600 } },
{ id: 'hoa_dai',  sku: 'SKU-K-06', slot: 'back', set: 'hoa', name: 'Chu Sa Hồ Lô',      rarity: 3, price: { ngoc: 140, phuc: 600 } },
```

`SETS` dạng nhóm (phần 04 §6.1):

```js
{ id: 'moc',  wx: '木', name: 'Thanh Mộc Tiên Tông',  pieces: [['y_moc'], ['quan_la'], ['kiem_moc'], ['aura_dao']] },
{ id: 'hoa',  wx: '火', name: 'Ly Hỏa Chân Tông',     pieces: [['y_hoa'], ['hoa_quan', 'kim_quan'], ['hoa_dai', 'canh_phuong'], ['aura_hoa', 'aura_lua']] },
{ id: 'tho',  wx: '土', name: 'Hậu Thổ Đạo Tông',     pieces: [['y_tho'], ['dau_lap'], ['ho_lo'], ['aura_tho', 'aura_batquai']] },
{ id: 'kim',  wx: '金', name: 'Canh Kim Kiếm Tông',   pieces: [['y_kim'], ['dao_quan'], ['kim_kiem', 'kiem_bao'], ['aura_kim', 'aura_set']] },
{ id: 'thuy', wx: '水', name: 'Huyền Thủy Long Tông', pieces: [['y_thuy'], ['tram_ngoc'], ['o_giay'], ['aura_tuyet']] },
```

`setBonus` đổi điều kiện thành: mỗi nhóm có ít nhất một món đang mặc. Hàm đếm `count(st)` trong `wardrobe-ui.js › setsView` đổi thành đếm nhóm đã đủ. 14 thân bộ hiện có (`y_moc` … `aura_tuyet`) thêm `phuc: 600` vào `price`.

---

## 3. Món vùng (`SKU-R`, 120 món)


### `thanh` (10 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-thanh-01` | `r_thanh_01` | robe | 3 | `{ ngoc: 160 }` | — | [0.6, 0.55, 0.45] / [0.1, 0.15, 0.85] |
| `SKU-R-thanh-02` | `r_thanh_02` | robe | 2 | `{ phuc: 260 }` | — | [0.07, 0.45, 0.55] / [0.98, 0.45, 0.85] |
| `SKU-R-thanh-03` | `r_thanh_03` | head | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-R-thanh-04` | `r_thanh_04` | head | 2 | `{ phuc: 200 }` | — | — |
| `SKU-R-thanh-05` | `r_thanh_05` | back | 1 | `{ phuc: 90 }` | — | — |
| `SKU-R-thanh-06` | `r_thanh_06` | hand | 1 | `{ phuc: 90 }` | — | — |
| `SKU-R-thanh-07` | `r_thanh_07` | hand | 3 | `{ ngoc: 130 }` | — | — |
| `SKU-R-thanh-08` | `r_thanh_08` | trail | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-R-thanh-09` | `r_thanh_09` | mount | 3 | `{ ngoc: 200 }` | — | — |
| `SKU-R-thanh-10` | `r_thanh_10` | frame | 2 | `{ phuc: 150 }` | — | — |

### `tubinh` (5 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-tubinh-01` | `r_tubinh_01` | robe | 3 | `{ ngoc: 160 }` | — | [0.57, 0.35, 0.55] / [0.1, 0.1, 0.9] |
| `SKU-R-tubinh-02` | `r_tubinh_02` | hand | 3 | `{ ngoc: 130 }` | — | — |
| `SKU-R-tubinh-03` | `r_tubinh_03` | back | 2 | `{ phuc: 230 }` | — | — |
| `SKU-R-tubinh-04` | `r_tubinh_04` | trail | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-R-tubinh-05` | `r_tubinh_05` | frame | 3 | `{ ngoc: 90, phuc: 700 }` | — | — |

### `manh` (5 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-manh-01` | `r_manh_01` | robe | 2 | `{ phuc: 260 }` | — | [0.1, 0.2, 0.7] / [0.08, 0.35, 0.45] |
| `SKU-R-manh-02` | `r_manh_02` | head | 1 | `{ phuc: 80 }` | — | — |
| `SKU-R-manh-03` | `r_manh_03` | back | 3 | `{ ngoc: 140 }` | — | — |
| `SKU-R-manh-04` | `r_manh_04` | trail | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-R-manh-05` | `r_manh_05` | frame | 3 | `{ ngoc: 90 }` | — | — |

### `trichthien` (5 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-trichthien-01` | `r_trichthien_01` | robe | 4 | `{ ngoc: 270 }` | — | [0.64, 0.6, 0.25] / [0.12, 0.08, 0.92] |
| `SKU-R-trichthien-02` | `r_trichthien_02` | head | 3 | `{ ngoc: 120, phuc: 900 }` | — | — |
| `SKU-R-trichthien-03` | `r_trichthien_03` | aura | 4 | `{ ngoc: 260 }` | — | — |
| `SKU-R-trichthien-04` | `r_trichthien_04` | mount | 4 | `{ ngoc: 340 }` | — | — |
| `SKU-R-trichthien-05` | `r_trichthien_05` | frame | 3 | `{ ngoc: 90, phuc: 700 }` | — | — |

### `cungthong` (5 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-cungthong-01` | `r_cungthong_01` | robe | 2 | `{ phuc: 260 }` | — | [0.15, 0.45, 0.5] / [0.3, 0.35, 0.55] |
| `SKU-R-cungthong-02` | `r_cungthong_02` | head | 1 | `{ phuc: 80 }` | — | — |
| `SKU-R-cungthong-03` | `r_cungthong_03` | hand | 2 | `{ phuc: 210 }` | — | — |
| `SKU-R-cungthong-04` | `r_cungthong_04` | trail | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-R-cungthong-05` | `r_cungthong_05` | mount | 3 | `{ ngoc: 200 }` | — | — |

### `thulau` (6 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-thulau-01` | `r_thulau_01` | robe | 3 | `{ ngoc: 160 }` | — | [0.08, 0.2, 0.5] / [0.6, 0.15, 0.3] |
| `SKU-R-thulau-02` | `r_thulau_02` | head | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-R-thulau-03` | `r_thulau_03` | back | 3 | `{ ngoc: 140 }` | — | — |
| `SKU-R-thulau-04` | `r_thulau_04` | hand | 1 | `{ phuc: 90 }` | — | — |
| `SKU-R-thulau-05` | `r_thulau_05` | trail | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-R-thulau-06` | `r_thulau_06` | frame | 2 | `{ phuc: 150 }` | — | — |

### `phongthuy` (5 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-phongthuy-01` | `r_phongthuy_01` | robe | 3 | `{ ngoc: 160 }` | — | [0.25, 0.3, 0.5] / [0.08, 0.5, 0.55] |
| `SKU-R-phongthuy-02` | `r_phongthuy_02` | back | 2 | `{ phuc: 230 }` | — | — |
| `SKU-R-phongthuy-03` | `r_phongthuy_03` | hand | 3 | `{ ngoc: 130 }` | — | — |
| `SKU-R-phongthuy-04` | `r_phongthuy_04` | aura | 4 | `{ ngoc: 260 }` | — | — |
| `SKU-R-phongthuy-05` | `r_phongthuy_05` | frame | 3 | `{ ngoc: 90, phuc: 700 }` | — | — |

### `lichduong` (5 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-lichduong-01` | `r_lichduong_01` | robe | 4 | `{ ngoc: 270 }` | — | [0.58, 0.5, 0.4] / [0.12, 0.6, 0.85] |
| `SKU-R-lichduong-02` | `r_lichduong_02` | hand | 1 | `{ phuc: 90 }` | — | — |
| `SKU-R-lichduong-03` | `r_lichduong_03` | back | 4 | `{ ngoc: 240 }` | — | — |
| `SKU-R-lichduong-04` | `r_lichduong_04` | trail | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-R-lichduong-05` | `r_lichduong_05` | frame | 3 | `{ ngoc: 90, phuc: 700 }` | — | — |

### `longho` (8 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-longho-01` | `r_longho_01` | robe | 3 | `{ ngoc: 160 }` | — | [0.6, 0.45, 0.6] / [0.03, 0.6, 0.6] |
| `SKU-R-longho-02` | `r_longho_02` | head | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-R-longho-03` | `r_longho_03` | back | 2 | `{ phuc: 230 }` | — | — |
| `SKU-R-longho-04` | `r_longho_04` | hand | 3 | `{ ngoc: 130 }` | — | — |
| `SKU-R-longho-05` | `r_longho_05` | aura | 4 | `{ ngoc: 260 }` | — | — |
| `SKU-R-longho-06` | `r_longho_06` | trail | 3 | `{ ngoc: 120, phuc: 900 }` | — | — |
| `SKU-R-longho-07` | `r_longho_07` | mount | 3 | `{ ngoc: 200 }` | — | — |
| `SKU-R-longho-08` | `r_longho_08` | frame | 3 | `{ ngoc: 90, phuc: 700 }` | — | — |

### `vodang` (8 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-vodang-01` | `r_vodang_01` | robe | 3 | `{ ngoc: 160 }` | — | [0.6, 0.05, 0.88] / [0.6, 0.08, 0.55] |
| `SKU-R-vodang-02` | `r_vodang_02` | head | 2 | `{ phuc: 200 }` | — | — |
| `SKU-R-vodang-03` | `r_vodang_03` | back | 4 | `{ ngoc: 240 }` | — | — |
| `SKU-R-vodang-04` | `r_vodang_04` | hand | 3 | `{ ngoc: 130 }` | — | — |
| `SKU-R-vodang-05` | `r_vodang_05` | aura | 4 | `{ ngoc: 260 }` | — | — |
| `SKU-R-vodang-06` | `r_vodang_06` | trail | 3 | `{ ngoc: 120, phuc: 900 }` | — | — |
| `SKU-R-vodang-07` | `r_vodang_07` | mount | 4 | `{ ngoc: 340 }` | — | — |
| `SKU-R-vodang-08` | `r_vodang_08` | frame | 3 | `{ ngoc: 90, phuc: 700 }` | — | — |

### `chungnam` (7 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-chungnam-01` | `r_chungnam_01` | robe | 2 | `{ phuc: 260 }` | — | [0.1, 0.15, 0.55] / [0.33, 0.3, 0.35] |
| `SKU-R-chungnam-02` | `r_chungnam_02` | head | 1 | `{ phuc: 80 }` | — | — |
| `SKU-R-chungnam-03` | `r_chungnam_03` | back | 2 | `{ phuc: 230 }` | — | — |
| `SKU-R-chungnam-04` | `r_chungnam_04` | hand | 3 | `{ ngoc: 130 }` | — | — |
| `SKU-R-chungnam-05` | `r_chungnam_05` | aura | 3 | `{ ngoc: 150 }` | — | — |
| `SKU-R-chungnam-06` | `r_chungnam_06` | trail | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-R-chungnam-07` | `r_chungnam_07` | frame | 3 | `{ ngoc: 90 }` | — | — |

### `maoshan` (7 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-maoshan-01` | `r_maoshan_01` | robe | 3 | `{ ngoc: 160 }` | — | [0.3, 0.3, 0.75] / [0.33, 0.45, 0.45] |
| `SKU-R-maoshan-02` | `r_maoshan_02` | back | 3 | `{ ngoc: 140 }` | — | — |
| `SKU-R-maoshan-03` | `r_maoshan_03` | hand | 2 | `{ phuc: 210 }` | — | — |
| `SKU-R-maoshan-04` | `r_maoshan_04` | aura | 3 | `{ ngoc: 150 }` | — | — |
| `SKU-R-maoshan-05` | `r_maoshan_05` | trail | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-R-maoshan-06` | `r_maoshan_06` | frame | 3 | `{ ngoc: 90 }` | — | — |
| `SKU-R-maoshan-07` | `r_maoshan_07` | head | 1 | `{ phuc: 80 }` | — | — |

### `yentu` (7 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-yentu-01` | `r_yentu_01` | robe | 2 | `{ phuc: 260 }` | — | [0.08, 0.35, 0.45] / [0.12, 0.6, 0.8] |
| `SKU-R-yentu-02` | `r_yentu_02` | head | 1 | `{ phuc: 80 }` | — | — |
| `SKU-R-yentu-03` | `r_yentu_03` | back | 2 | `{ phuc: 230 }` | — | — |
| `SKU-R-yentu-04` | `r_yentu_04` | hand | 1 | `{ phuc: 90 }` | — | — |
| `SKU-R-yentu-05` | `r_yentu_05` | aura | 3 | `{ ngoc: 150 }` | — | — |
| `SKU-R-yentu-06` | `r_yentu_06` | trail | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-R-yentu-07` | `r_yentu_07` | frame | 3 | `{ ngoc: 90 }` | — | — |

### `buttap` (7 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-buttap-01` | `r_buttap_01` | robe | 3 | `{ ngoc: 160 }` | — | [0.1, 0.12, 0.85] / [0.95, 0.25, 0.75] |
| `SKU-R-buttap-02` | `r_buttap_02` | head | 2 | `{ phuc: 200 }` | — | — |
| `SKU-R-buttap-03` | `r_buttap_03` | hand | 1 | `{ phuc: 90 }` | — | — |
| `SKU-R-buttap-04` | `r_buttap_04` | aura | 3 | `{ ngoc: 150 }` | — | — |
| `SKU-R-buttap-05` | `r_buttap_05` | trail | 3 | `{ ngoc: 120, phuc: 900 }` | — | — |
| `SKU-R-buttap-06` | `r_buttap_06` | frame | 3 | `{ ngoc: 90 }` | — | — |
| `SKU-R-buttap-07` | `r_buttap_07` | mount | 4 | `{ ngoc: 340 }` | — | — |

### `tangdia` (4 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-tangdia-01` | `r_tangdia_01` | robe | 3 | `{ ngoc: 160 }` | `{ consultPending: true }` | [0.05, 0.35, 0.45] / [0.08, 0.2, 0.8] |
| `SKU-R-tangdia-02` | `r_tangdia_02` | head | 2 | `{ phuc: 200 }` | `{ consultPending: true }` | — |
| `SKU-R-tangdia-03` | `r_tangdia_03` | aura | 3 | `{ ngoc: 150 }` | `{ consultPending: true }` | — |
| `SKU-R-tangdia-04` | `r_tangdia_04` | trail | 1 | `{ phuc: 80 }` | `{ consultPending: true }` | — |

### `vanmieu` (7 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-vanmieu-01` | `r_vanmieu_01` | robe | 2 | `{ phuc: 260 }` | — | [0.6, 0.45, 0.6] / [0.6, 0.1, 0.2] |
| `SKU-R-vanmieu-02` | `r_vanmieu_02` | head | 2 | `{ phuc: 200 }` | — | — |
| `SKU-R-vanmieu-03` | `r_vanmieu_03` | back | 3 | `{ ngoc: 140 }` | — | — |
| `SKU-R-vanmieu-04` | `r_vanmieu_04` | hand | 3 | `{ ngoc: 130 }` | — | — |
| `SKU-R-vanmieu-05` | `r_vanmieu_05` | aura | 4 | `{ ngoc: 260 }` | — | — |
| `SKU-R-vanmieu-06` | `r_vanmieu_06` | trail | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-R-vanmieu-07` | `r_vanmieu_07` | mount | 4 | `{ ngoc: 340 }` | — | — |

### `phongdo` (4 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-phongdo-01` | `r_phongdo_01` | robe | 3 | `{ ngoc: 160 }` | — | [0.62, 0.15, 0.4] / [0.6, 0.1, 0.6] |
| `SKU-R-phongdo-02` | `r_phongdo_02` | back | 3 | `{ ngoc: 140 }` | — | — |
| `SKU-R-phongdo-03` | `r_phongdo_03` | aura | 3 | `{ ngoc: 150, phuc: 1100 }` | — | — |
| `SKU-R-phongdo-04` | `r_phongdo_04` | trail | 3 | `{ ngoc: 120, phuc: 900 }` | — | — |

### `mieucuong` (5 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-mieucuong-01` | `r_mieucuong_01` | back | 3 | `{ ngoc: 140 }` | — | — |
| `SKU-R-mieucuong-02` | `r_mieucuong_02` | aura | 3 | `{ ngoc: 150 }` | — | — |
| `SKU-R-mieucuong-03` | `r_mieucuong_03` | trail | 3 | `{ ngoc: 120, phuc: 900 }` | — | — |
| `SKU-R-mieucuong-04` | `r_mieucuong_04` | frame | 3 | `{ ngoc: 90, phuc: 700 }` | — | — |
| `SKU-R-mieucuong-05` | `r_mieucuong_05` | mount | 4 | `{ ngoc: 340 }` | — | — |

### `conlon` (6 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-conlon-01` | `r_conlon_01` | robe | 5 | `{ ngoc: 670 }` | `{ conlon: true }` | [0.55, 0.12, 0.96] / [0.55, 0.35, 0.8] |
| `SKU-R-conlon-02` | `r_conlon_02` | head | 4 | `{ ngoc: 210 }` | `{ conlon: true }` | — |
| `SKU-R-conlon-03` | `r_conlon_03` | aura | 5 | `{ ngoc: 640 }` | `{ conlon: true }` | — |
| `SKU-R-conlon-04` | `r_conlon_04` | mount | 5 | `{ ngoc: 830 }` | `{ conlon: true }` | — |
| `SKU-R-conlon-05` | `r_conlon_05` | trail | 4 | `{ ngoc: 210 }` | `{ conlon: true }` | — |
| `SKU-R-conlon-06` | `r_conlon_06` | frame | 4 | `{ ngoc: 160 }` | `{ conlon: true }` | — |

### `vancoc` (4 món)

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-R-vancoc-01` | `r_vancoc_01` | robe | 1 | `{ phuc: 110 }` | — | [0.1, 0.18, 0.6] / [0.09, 0.25, 0.4] |
| `SKU-R-vancoc-02` | `r_vancoc_02` | head | 1 | `{ phuc: 80 }` | — | — |
| `SKU-R-vancoc-03` | `r_vancoc_03` | hand | 1 | `{ phuc: 90 }` | — | — |
| `SKU-R-vancoc-04` | `r_vancoc_04` | trail | 2 | `{ phuc: 200 }` | — | — |

---

## 4. Món lễ (`SKU-F`, 30 món)

Mọi dòng thêm `festival: '<mã lễ>'` (mã lễ = phần giữa của SKU).

| SKU | `id` đề xuất | `slot` | `rarity` | `price` | `unlock` / cờ | `look` (HSV `pri` / `acc`, chỉ phẩm phục) |
|---|---|---|---|---|---|---|
| `SKU-F-tet-01` | `f_tet_01` | robe | 3 | `{ ngoc: 160 }` | — | [0.99, 0.75, 0.7] / [0.12, 0.7, 0.9] |
| `SKU-F-tet-02` | `f_tet_02` | head | 2 | `{ phuc: 200 }` | — | — |
| `SKU-F-tet-03` | `f_tet_03` | hand | 3 | `{ ngoc: 130 }` | — | — |
| `SKU-F-tet-04` | `f_tet_04` | hand | 3 | `{ ngoc: 130 }` | — | — |
| `SKU-F-tet-05` | `f_tet_05` | trail | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-F-tet-06` | `f_tet_06` | frame | 2 | `{ phuc: 150 }` | — | — |
| `SKU-F-thuongnguyen-01` | `f_thuongnguyen_01` | hand | 3 | `{ ngoc: 130 }` | — | — |
| `SKU-F-thuongnguyen-02` | `f_thuongnguyen_02` | aura | 3 | `{ ngoc: 150 }` | — | — |
| `SKU-F-hanthuc-01` | `f_hanthuc_01` | hand | 1 | `{ phuc: 90 }` | — | — |
| `SKU-F-hanthuc-02` | `f_hanthuc_02` | frame | 2 | `{ phuc: 150 }` | — | — |
| `SKU-F-doanngo-01` | `f_doanngo_01` | head | 2 | `{ phuc: 200 }` | — | — |
| `SKU-F-doanngo-02` | `f_doanngo_02` | mount | 4 | `{ ngoc: 340 }` | — | — |
| `SKU-F-doanngo-03` | `f_doanngo_03` | trail | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-F-thattich-01` | `f_thattich_01` | mount | 4 | `{ ngoc: 340 }` | — | — |
| `SKU-F-thattich-02` | `f_thattich_02` | aura | 3 | `{ ngoc: 150 }` | — | — |
| `SKU-F-thattich-03` | `f_thattich_03` | frame | 3 | `{ ngoc: 90 }` | — | — |
| `SKU-F-thattich-04` | `f_thattich_04` | trail | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-F-trungthu-01` | `f_trungthu_01` | hand | 2 | `{ phuc: 210 }` | — | — |
| `SKU-F-trungthu-02` | `f_trungthu_02` | back | 4 | `{ ngoc: 240 }` | — | — |
| `SKU-F-trungthu-03` | `f_trungthu_03` | head | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-F-trungthu-04` | `f_trungthu_04` | trail | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-F-trungthu-05` | `f_trungthu_05` | frame | 2 | `{ phuc: 150 }` | — | — |
| `SKU-F-trungcuu-01` | `f_trungcuu_01` | head | 2 | `{ phuc: 200 }` | — | — |
| `SKU-F-trungcuu-02` | `f_trungcuu_02` | trail | 3 | `{ ngoc: 120 }` | — | — |
| `SKU-F-dongchi-01` | `f_dongchi_01` | robe | 2 | `{ phuc: 260 }` | — | [0.6, 0.35, 0.45] / [0.1, 0.15, 0.85] |
| `SKU-F-dongchi-02` | `f_dongchi_02` | hand | 3 | `{ ngoc: 130 }` | — | — |
| `SKU-F-ongtao-01` | `f_ongtao_01` | hand | 3 | `{ ngoc: 130 }` | — | — |
| `SKU-F-sinhnhat-01` | `f_sinhnhat_01` | frame | 2 | `free` | — | — |
| `SKU-F-sinhnhat-02` | `f_sinhnhat_02` | hand | 3 | `{ ngoc: 130 }` | — | — |
| `SKU-F-vulan-01` | `f_vulan_01` | head | 2 | `free` | `{ chooseColor: ["do", "trang"] }` | — |

---

## 5. Kiểm sau khi nạp

| # | Kiểm |
|---|---|
| D1 | 120 + 30 + 6 dòng mới; không `id` trùng với 51 món cũ (lint L1) |
| D2 | giá khớp bảng phần 05, 06 (script so sánh — bảng này sinh từ chính các bảng đó) |
| D3 | món giá kép: `canBuy` nhận tham số tiền người chơi chọn; thiếu một tiền vẫn mua được bằng tiền kia |
| D4 | `conlon`, `region`, `consultPending` do máy chủ kiểm (client chỉ hiển thị khóa) |
| D5 | `encodeCos` / `decodeCos` nhận `id` mới; trần 240 ký tự của `decodeCos` vẫn đủ (8 ô × ≤ 18 ký tự `k:r_trichthien_01`) |
| D6 | món lễ ngoài cửa sổ: `canBuy` trả «Món lễ — mở bán vào <lễ> năm sau» |
| D7 | `f_vulan_01`, `f_sinhnhat_01` không có nút mua; cấp miễn phí theo sự kiện |

