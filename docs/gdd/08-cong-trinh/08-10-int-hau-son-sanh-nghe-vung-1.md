# 08-10 · Thật hóa Hậu Sơn, tám sảnh nghề, và vùng (1): Tử Bình Phong · Manh Phái Cốc · Trích Thiên Đỉnh

> Công trình vùng hiện dựng bằng `landmarks.js › palaceComplex` và các `SPOTS`. Phần này: (1) Hậu Sơn — nơi chuyển `ROOMS › chinhdien` vào trong; (2) tám đình sảnh nghề; (3) ba vùng đầu, gồm chuyển `ROOMS › laoquan` và `ROOMS › daumau`. Phần vùng còn lại ở 08-11.

---

## 1. Hậu Sơn

### 1.1 Hiện trạng

```js
// landmarks.js › SPOTS[0]
await palaceComplex(g, { x: 0, z: -116, ry: 0, scale: 0.6, main: ['cliff_palace', 'palace_grand'], gate: false, stepD: 0.9 });
```

| Thành phần | Công thức trong `palaceComplex` | Giá trị (scale 0,6) |
|---|---|---|
| Nền | `terrace(w = 150·s, d = 120·s, levels 3, rise 3,2·s)` | 90 × 72 m; ba tầng thu 12 % mỗi tầng: L0 90 × 72 (mặt 1,92), L1 79,2 × 63,4 (3,84), L2 68,4 × 54,7 (**5,76**) |
| Va chạm nền | **một** `addPlatform(x, z, w·0,98, d·0,98, ry, top)` = 88,2 × 70,6 ở **5,76** | cả ba tầng đi ở 5,76 m |
| Bậc chính diện | mỗi bậc **cao 0,9 m**, sâu `stepD` 0,9, rộng 19,8 m — **chỉ là hình**, không có nền bậc | người chơi «nhảy» 5,76 m lên mép nền |
| Chính điện | `cliff_palace` `fit width 92·s = 55,2`, tại cục bộ (0, −D·0,12) → (0, 5,76, −124,64) | khung x ±27,6, z −132,14…−117,14 |
| Điện phụ | `hall_main` `fit width 34·s = 20,4`, (±W·0,36, +D·0,12) → (±32,4, −107,36), ry ∓π/2 | khung x ±(23,05…41,75) |
| Tháp | `tower_nine` `fit height 62·s = 37,2`, (±W·0,42, −D·0,38) → (±37,8, −143,36) | khung x ±(30,4…45,2), z −150,8…−135,9 |

### 1.2 Lỗi bố cục phát hiện (áp dụng cho mọi `palaceComplex`)

| Lỗi | Ở Hậu Sơn | Hệ quả |
|---|---|---|
| Nền ba tầng nhưng va chạm một mặt phẳng ở độ cao tầng trên | đứng trên L0 / L1 (thấp hơn 3,84 / 1,92 m) mà chân ở 5,76 | người chơi **lơ lửng** trên mép nền thấp |
| Bậc 0,9 m chỉ là hình | không có `addPlatform` từng bậc | lên nền bằng «dịch chuyển» khi chạm mép |
| Điện phụ và tháp chìa ra ngoài tầng trên | điện phụ chìa 7,5 m, tháp chìa 11 m ra ngoài mép L2 (±34,2) | đáy công trình **lơ lửng** 1,9–3,8 m trên tầng dưới |

**Sửa chung** (`palaceComplex` thêm tham số, chưa có — cần làm):

1. `tierShrink` (mặc định 0,12; Hậu Sơn dùng **0,04**) → L2 Hậu Sơn 82,8 × 66,2 (x ±41,4, z −149,1…−82,9).
2. Mỗi tầng nền một `addPlatform` ở **đúng** mặt của nó; mép tầng trên là vách (`addSolidRect` dải 0,5 m) trừ chỗ bậc.
3. Bậc chính dựng lại **0,4 × 0,6 m** (15 bậc cho 5,76 m, rộng 19,8), mỗi bậc một nền như `court.js › STAIRS`; bậc phụ hai bên đường lên L1 / L2.
4. Vị trí công trình phụ tính theo **tầng trên cùng** và kiểm `|x| + nửa bề rộng ≤ nửa bề rộng L2` (assert khi dựng, test 08-12).

Vị trí mới ở Hậu Sơn:

| Công trình | Cũ | Mới | Kiểm |
|---|---|---|---|
| Điện phụ Đông / Tây | (±32,4, −107,36) | **(±31,5, −106,36)** | khung x ±(22,15…40,85) trong ±41,4; z −116,56…−96,16 không chạm chính điện (z ≤ −117,14) |
| Tháp Đông / Tây | (±37,8, −143,36) | **(±33,5, −141,5)** | khung x ±(26,1…40,9); z −148,9…−134,1 trong mép −149,1; không chạm chính điện (z ≥ −132,14) |

### 1.3 INT-HS-CHINHDIEN — Chính Điện Tam Thanh (hạng A)

#### Vỏ

| Thông số | Giá trị |
|---|---|
| Mô hình · đặt | `cliff_palace` `fit width 55,2` tại (0, 5,76, −124,64), ry 0 |
| Lòng (suy từ đo ở 64 m × 0,8625) | sảnh liền **52,6 × 12,9 m** (x −26,3…26,7, z −131,74…−118,74); lòng còn cao ở dải giữa tới ~14 m trên đáy; lòng tầng trên phía sau x −22…15,5, z −131,74…−124,7 ở 10,4–13,8 m trên đáy |
| Cao độ | sàn trệt y **6,20**; điện thờ giữa **thông tầng** tới y 15,2; gác hai cánh y **11,0**; tầng trên y **16,4** → trần 19,6 |
| Thay cho | `ROOMS › chinhdien` (origin (1500, 0), 34 × 28 × 14, ba tượng cách 6,5 m, Thầy Giải Quẻ, trạm `que`) |
| **Cảnh báo đo ở đúng tỉ lệ 55,2** (08-18 §6) | dải 4,4–6,0 m trên đáy có **mặt vỏ cắt ngang lòng** ở đoạn giữa (x ≈ −9,6…2,4) → thông tầng 9 m chỉ đạt **sau** bước dọn lòng (`hollow.py`, 08-02 §5.4) xóa các mặt trong đó. Nếu xóa làm thủng mái nhìn từ ngoài: **phương án dự phòng** — trần điện y 10,4 (thông thủy 4,2 m), bệ hạ còn 0,6 m, tượng Tam Thanh `fit height 3,4`; gác hai cánh bỏ, Đạo Tạng Các lên bằng thang ở hai đầu |

#### Khoang

| Khoang | Tên | Hộp thế giới (x · y · z) | Camera | Âm |
|---|---|---|---|---|
| `hs.l0.tamthanh` | Điện Tam Thanh (thông tầng) | −11,2…11,2 · 6,2…15,2 · −131,74…−118,74 | TRONG, `maxDist` 6,5 | `dai_dien` · `tung_xa_mo` |
| `hs.l0.tay` | Quẻ Đường | −26,3…−11,2 · 6,2…10,6 · cùng z | TRONG | `dien_vua` |
| `hs.l0.dong` | Công Quá Đường | 11,2…26,7 · 6,2…10,6 · cùng z | TRONG | `dien_vua` · `trang_sach` |
| `hs.l1.tay` | Gác Bát Quái | −26,3…−11,2 · 11,0…15,2 · cùng z | TRONG | `lau_go` |
| `hs.l1.dong` | Gác Công Quá | 11,2…26,7 · 11,0…15,2 · cùng z | TRONG | `lau_go` |
| `hs.l2.daotang` | Đạo Tạng Các | −22…15,5 · 16,4…19,6 · −131,74…−124,7 | TRONG, `maxDist` 3,5 | `dien_vua` · `trang_sach` |

Hai gác nhìn xuống điện thờ qua **lan can** (cửa nhìn `open` x ±11,2): đứng gác thấy tượng Tam Thanh ngang tầm vai tượng.

#### Mặt bằng trệt (thế giới)

```
 x: −26,3          −11,2              0              11,2           26,7
 z −131,7 ┌──────────────┬──────────────────────────────┬──────────────┐
          │ ▲ thang lên  │ [靈寶] [元始] [道德] trên     │ thang lên ▲  │
          │ █ gác Tây    │ BAC-29 bệ 3 cấp (rộng 20 m)  │ █ gác Đông   │
          │ █            │ hào quang × 3, BAC-15 tảo tỉnh│ █           │
          │ QUẺ ĐƯỜNG    │                              │ CÔNG QUÁ     │
          │ [án Thầy     │  [BAC-30 bàn lễ · lư · nến]  │ ĐƯỜNG        │
          │  Giải Quẻ +  │   ○ ○ ○ ○ ○ bồ đoàn          │ [bia Thái    │
          │  scholar_desk│                              │  Thượng Cảm  │
          │  + master]   │  ║cột║        ║cột║          │  Ứng]        │
          │ [kệ quẻ 64]  │                              │ [Sổ Công Quá │
          │              │  [BAC-37 khánh]  [BAC-39 mõ] │  công khai]  │
 z −118,7 └──[ngách]─────┴──────[ cửa giữa 3,2 × 4,2 ]──┴─────[ngách]──┘
                          hiên trước 1,6 m · sân L2 · bậc xuống
```

| Hạng mục | Vị trí | Mảnh / tài sản |
|---|---|---|
| Ba tượng Tam Thanh | x −6,0 / 0 / 6,0, đứng trên bệ y 6,2 + 1,35, lùi sát tường sau | `deity_lingbao`, `deity_yuanshi`, `deity_daode` (đang có), `fit height 5,4` như hiện nay; khoảng cách giảm 6,5 → 6,0 để bệ 20 m vừa gian giữa 22,4 m |
| Bệ ba cấp | tâm (0, 6,2, −128,1) | BAC-29 co ngang 20 m |
| Hào quang | sau mỗi tượng | vòng `RingGeometry(1.5, 1.75)` vàng như `interior.js` |
| Tảo tỉnh | trần trên tượng giữa, y 15,2 | BAC-15 |
| Bàn lễ | (0, 6,2, −123,9) | BAC-30 + BAC-31 + `prop_incense_great` (08-02 §10) + BAC-33 × 2 |
| Bồ đoàn | z −122,1, x −3,2…3,2 | BAC-35 × 5 |
| Hàng cột | x ±7,0, z −127 / −122,5 | BAC-08 Ø 0,7 cao 9 m |
| Phướn | trước 4 cột | BAC-45 × 4 |
| Quẻ Đường | x −26,3…−11,2 | `scholar_desk` (đang có, như phòng cũ) + `master` ngồi (như phòng cũ) + MOD-GNA-35 kệ «64 quẻ» + MOD-BAC-35 × 2 cho khách |
| Công Quá Đường | x 11,2…26,7 | MOD-BAC-53 bia «Thái Thượng Cảm Ứng Thiên» + MOD-BAC-42 án đặt Sổ Công Quá + MOD-BAC-40 kệ |
| Gác Tây / Đông | y 11,0 | MOD-BAC-02 sàn, MOD-BAC-50 lan can mép nhìn điện, thang KT-15 × 2 nối (4,8 m) dọc tường hồi |
| Đạo Tạng Các | y 16,4 | MOD-BAC-40 kệ kinh × 10 dọc tường sau, MOD-BAC-42 án đọc × 3, MOD-BAC-41 rương × 2; thang từ gác Đông lên (KT-15, 5,4 m) |

#### Trạm

| Id | Khoang | Tên | Nối | Ghi chú |
|---|---|---|---|---|
| `que` | `hs.l0.tay` | Thầy Giải Quẻ · «Xin thầy gieo quẻ» | `que-ui.js` (5 phép giải quẻ, web) | **giữ id**; iOS tắt (như hiện nay) → iOS: Quẻ Đường thành **Phòng Học Dịch** đọc `iching64-kb.js` (học nghĩa quẻ, không gieo cho bản thân) |
| `hs_tamthanh` | `hs.l0.tamthanh` | Bàn Lễ Tam Thanh · «Dâng hương Tam Thanh» | Sổ Công Quá `remedy-fate › CONG_QUA`; tụng `DAO_JIA` giờ Mão / Dậu | **mới** |
| `hs_congqua` | `hs.l0.dong` | Sổ Công Quá · «Mở sổ công quá của mình» | `remedy-fate › meritLedger`, mốc Liễu Phàm 300 / 600 / 1.000 công (canon §6) | **mới**; nơi chuẩn của Sổ Công Quá trong thế giới |
| `hs_camung` | `hs.l0.dong` | Bia Cảm Ứng · «Đọc Thái Thượng Cảm Ứng Thiên» | `daozang-data › DAOZANG` (mục 太上感應篇) | |
| `hs_batquai` | `hs.l1.tay` | Gác Bát Quái · «Học một quẻ» | `iching64-kb.js` | |
| `hs_daotang` | `hs.l2.daotang` | Đạo Tạng Các · «Tra Đạo Tạng» | `daozang-data › daozangByBu`, `suggestDaozangChartAware` | |

#### Người, cửa, đèn, âm

- **Thầy Giải Quẻ** (NPC hiện có ở phòng cũ, hình `master`): Thìn → Thân ngồi án Quẻ Đường; Mão / Dậu chủ trì tụng ở bàn lễ.
- **Đạo sĩ trực điện** (NPC phụ): thay nến giờ Mão / Dậu; Hợi → Dần một người trực (đèn trực).
- Cửa giữa `canh2` 3,2 × 4,2 lịch `dien_chinh`; hai ngách `luon_mo` ở chân hai cánh (x ±20, mặt Nam).
- Đèn: như `interior.js` cũ dời vào: 2 nến bàn lễ, 1 đèn chiếu tượng (`troi` giả trên cao, công suất 1,6), 6 đèn lồng lối giữa (MOD-BAC-48), mỗi phòng cánh 2 `dendau`, Đạo Tạng 3 `dendau`.
- Âm: `dai_dien` RT60 2,6; khánh và mõ giờ Mão / Dậu.

#### Chuyển từ phòng ngoài bản đồ

| Thứ trong `ROOMS › chinhdien` | Đi đâu |
|---|---|
| Cửa `door_chinhdien` tại (0, −84) | **bỏ** — người chơi lên nền Hậu Sơn, đi vào cửa giữa thật; trạm «Điện thờ» trong menu đi nhanh trỏ tới `door:out` cửa giữa |
| Lối ra `exit_chinhdien` | **bỏ** |
| Ba tượng, bàn thờ, bàn lễ, đèn lồng, bồ đoàn, Thầy Giải Quẻ | vào khoang `hs.l0.tamthanh` / `hs.l0.tay` như bảng trên |
| Lưu cũ ở (1500 ± 17, 0 ± 14) | `migrateLegacyPos` → `door:in` cửa giữa (08-04 §5.2) |

**Ước lượng**: khoét (2) · lót sảnh 52 m + thông tầng + gác (3) · công thức + 6 khoang (3) · chuyển phòng cũ + Thầy Giải Quẻ (1,5) · trạm mới × 5 (4) · đạo sĩ trực / lịch (1) · nền Hậu Sơn sửa chung (§1.2) (2,5) · test (1). **≈ 18 ngày.**

### 1.4 INT-HS-DIENDONG — Tĩnh Thất (hạng B) và INT-HS-DIENTAY — Giảng Đường (hạng B)

Vỏ `hall_main` khoét chung (08-07 §3.9), `fit width 20,4` (= 0,927 × bản 22 m): sảnh 16,7 × 7,0; gác 13,9 × 7,4. Đổi cục bộ như Điện Tây / Đông Sơn Môn (ry ±π/2) với tâm mới (±31,5, 5,76, −106,36).

| | **Tĩnh Thất** (Đông) | **Giảng Đường** (Tây) |
|---|---|---|
| Công năng | ngồi tĩnh tọa theo nhịp thở (mở rộng bảng thở của Trà Thất); nơi luyện **Nguyên Khí** | lớp giảng của Thầy Tử Bình (cảnh chuỗi chính), lớp «Tử Bình nhập môn» |
| Sảnh | 9 bồ đoàn (MOD-BAC-35) xếp 3 × 3 quay vào bàn khánh; MOD-BAC-37 khánh; màn tre MOD-GNA-41 che cửa sổ (ánh sáng dịu); hương trầm | NHO-14 án thầy + NHO-15 ghế + 2 hàng × 5 NHO-13 án thấp + NHO-16 chiếu; NHO-21 «bảng vàng» thành **bảng giảng** (canvas bài học) |
| Gác | «Gác Tịnh» — 3 phòng thiền đơn 4,4 × 7,4 (khoang khóa hợp lệ: 1 phòng của đạo trưởng, nhìn qua song) | «Gác Sách Giảng» — kệ bài giảng theo chương (NHO-17 × 4) |
| Trạm | `hs_tinhtoa` · «Ngồi tĩnh tọa» → `cultivation-data › CULTIVATION` (導引, 吐納 / 行氣, 存想 / 內觀) + Nguyên Khí (`vitality › analyzeVitality`) — có cảnh báo «không tự luyện ngoài đời» như app | `hs_giang` · «Nghe giảng» → bài học cổ pháp theo lá số mẫu (`MAU-A`…) — cảnh `MQ-1-*`; ngoài giờ giảng là bảng tự học |
| Lịch | mở Mão → Hợi (người tĩnh tọa đêm được) | Thầy giảng giờ Mùi (khi có cảnh); mở Mão → Tuất |
| Âm | `phong_nho`, gần như im; chuông dẫn khánh mỗi 3 phút trong lúc ngồi | `dien_vua`; tiếng đọc bài khe khẽ |
| Ước lượng | 5 ngày | 5 ngày |

### 1.5 INT-HS-THAPDONG — Bắc Đẩu Lâu và INT-HS-THAPTAY — Án Lục Lâu (hạng B)

| Thông số | Giá trị |
|---|---|
| Vỏ | `tower_nine` `fit height 37,2` (14,8 × 37,2 × 14,9) tại (±33,5, 5,76, −141,5) |
| Lòng đo được | phòng trệt 6 × 6,5 (tường dày ~4 m); các tầng 7,5–8 × 8 ở 8,4–10, 14–16; đỉnh 5 × 5,5 ở 20–24 m trên đáy |
| Tầng | 9 tầng, mỗi tầng ~3,7 m; sàn tầng k: y = 5,76 + 0,4 + 3,7·k (k = 0…8); tầng 8 (đỉnh) sàn y 35,8 |
| Thang | thang xoắn quanh trụ tâm (08-04 §2.4) 17 bậc / tầng (0,22 m), bán kính 0,6–2,4 m (vừa phòng 6 × 6,5); mỗi tầng một ô cửa ra ban công (cửa nhìn `open`) |

| Tầng | **Bắc Đẩu Lâu** (Đông) | **Án Lục Lâu** (Tây) |
|---|---|---|
| Chủ đề | chín sao Bắc Đẩu (Tham Lang, Cự Môn, Lộc Tồn, Văn Khúc, Liêm Trinh, Vũ Khúc, Phá Quân + Tả Phụ, Hữu Bật) — mỗi tầng một sao | kho án người chơi đã giải — mỗi tầng một bước của án (6 bước `cases.js › STEP_ORDER`) + 3 tầng án sảnh nghề |
| Mỗi tầng | khám nhỏ (BAC-28) + biển tên sao + cửa sổ nhìn đúng phương sao (theo giờ thật) | kệ hồ sơ (BAC-40) + bàn đọc: hồ sơ án của chính người chơi ở bước đó (điểm, sai ở đâu) |
| Đỉnh | **chuông Bắc Đẩu** (đạo cụ chuông nhỏ, `ix` `hs.bacdau.chuong`) + điểm ngắm sao ban đêm (`ershibaxiu.js`) | «Án Lục» — bảng tổng thành tích giải án (`state.js` lưu `recordCase`) |
| Trạm | `hs_bacdau` (đỉnh) | `hs_anluc` (tầng trệt: mục lục) + `hs_anluc_dinh` |
| Ước lượng | 6 ngày (thang xoắn dùng lại 08-08 §1) | 6 ngày |

### 1.6 INT-HS-NEN — Nền Hậu Sơn (hạng E)

Sửa theo §1.2: ba nền tầng đúng độ cao, 15 bậc 0,4 m chính diện, vách mép, bậc phụ. Thêm lối từ Hậu Môn (z −71,5) tới chân bậc (z −82,9 sau khi đổi `tierShrink`): đường đá thẳng 11 m. **≈ 3 ngày** (gồm sửa hàm `terrace` dùng chung cho mọi vùng).

---

## 2. Tám đình sảnh nghề (hạng D)

### 2.1 Hiện trạng chung

Mỗi sảnh (`world.js › HALLS`, dựng ở `landmarks.js`): `scholar_desk` rộng 3,2 (va chạm cắt lát) tại cục bộ (0, −1,5), đình `lib_wood_pavilion` rộng 7 tại (0, −3,4) (va chạm cắt lát), `lib_bonsai` cao 2,4 tại (3,6, −1,2), hai cột đèn tại (±2,6, 2,6); sảnh ngoài thành có `lib_cart` (−9, 6) + `lib_horse` (−9, 10,5); Thư Viện thêm 2 `lib_bookshelf` (±4,5, −3,5). Hướng quay về Huyền Thành (`faceTo(x, z, 0, 0)`).

Đo `lib_wood_pavilion` ở 7 m: **bệ đặc** 5 × 3 m, khám kín 3 × 1,5 trên bệ → đình **không đứng dưới được**.

### 2.2 Việc chung (mọi sảnh)

| # | Việc |
|---|---|
| 1 | Bệ đình thành nền: `addPlatform` mặt bệ (đo, dự kiến 1,2–1,4 m) + 3–4 bậc 0,35 m phía trước; cột đình chặn tròn; khám mở thành **khám thờ tổ nghề** (đọc được) |
| 2 | Án thư giữ va chạm; thêm **ghế khách** (MOD-GNA-29) trước án — người chơi ngồi khi giải án |
| 3 | Bảng chỉ đường tới công trình A của vùng (MOD-NHO-34 + mũi tên) |
| 4 | `roofZone` cho camera dưới mái đình |
| 5 | Trạm xe + ngựa (sảnh ngoài thành): tương tác «Lên xe về thành» (mở đi nhanh) |

### 2.3 Từng sảnh

| INT | Sảnh (id trạm) | Tâm | Án hằng ngày (đang có) | Khám tổ nghề | Gắn công trình A |
|---|---|---|---|---|---|
| INT-SN-TRACH | Sảnh Trạch Nhật (`trach`) | (735, −36) | `zheri-case.js` (chọn ngày) | bài vị «tổ nghề lịch pháp» | INT-LD-DAIDIEN |
| INT-SN-DUONGTRACH | Sảnh Dương Trạch (`duongtrach`) | (−806, 62) | `dz-case.js` (xem nhà) | la bàn đồng nhỏ | INT-PT-DAIDIEN |
| INT-SN-DIEUHAU | Sảnh Điều Hậu (`dieuhau`) | (480, 420) | `halls.js › buildDieuHau` (`han-nuan`, Cùng Thông Bảo Giám) | chậu nước – lò than (hàn / noãn) | INT-CT-THUYTA |
| INT-SN-THUVIEN | Thư Lâu (`thuvien`) | (0, −630) | `halls.js › buildThuVien` (Trích Thiên Tủy, Ngũ Ngôn Độc Bộ, Tích Thiện Thiên) | sách gối đầu | INT-TL-THULAU |
| INT-SN-HOPHON | Bàn Hợp Hôn (`hophon`) | (−48, 8) **trong sân Sơn Môn** | `halls.js › buildHopHon` (`hehun`) | đôi đèn đỏ | — (D đứng riêng; cạnh Trà Thất) |
| INT-SN-TUVI | Sảnh Tử Vi (`tuvi`) | (−567, 503) | `halls.js › buildTuVi` (`ziwei`) | bàn sao 12 cung nhỏ | INT-TT-QUANTINH |
| INT-SN-TUONGPHAP | Sảnh Tượng Pháp (`tuongphap`) | (654, −441) | `halls.js › buildTuongPhap` (`mangpai`) | phù điêu sờ được | INT-MP-DAIDIEN |
| INT-SN-CACHCUC | Sảnh Cách Cục (`cachcuc`) | (−521, −538) | `halls.js › buildCachCuc` (`pattern`, `GE_GODS`) | tám thẻ cách | INT-TB-CHINHDIEN |

Bàn Hợp Hôn nằm trong sân Sơn Môn (x −48, z 8) — đình 7 m sát lầu trống (x −47, z −9 cách 17 m) và Trà Thất (khối x −44,4…−36,4, z 21,25…24,45): khoảng trống quanh đình ≥ 4 m, đạt. Không có xe ngựa (trong sân quán).

**Ước lượng**: việc chung một lần 3 ngày + mỗi sảnh 0,5 ngày → **7 ngày**.

---

## 3. Tử Bình Phong (`tubinh`)

### 3.1 Hiện trạng

```js
const p = R('tubinh'); const ry = faceTo(p.x, p.z, 0, 0);            // (−620, −560), ry ≈ 0,836 rad
const top = terrace(g, { x: p.x, z: p.z, ry, w: 190, d: 160, levels: 3, rise: 5 });   // mặt ≈ 401 + 15
await place(g, ['cliff_palace', 'palace_grand', 'hall_main'], { fit: { width: 170 }, at: { x: p.x, y: top, z: p.z, ry } });
// tháp chín tầng cao 80 tại cục bộ (±88, 40)
```

| Công trình | Kích thước đặt | Lòng (suy theo tỉ lệ 2,656 từ đo ở 64 m) |
|---|---|---|
| `cliff_palace` 170 m | 170 × 66 × 46 | sảnh liền **163 × 40 m** cao ~13 m; tầng trên còn lòng tới ~40 m |
| `tower_nine` 80 m | 31,7 × 80 × 31,9 | phòng trệt ~13 × 14; tầng ~8 m mỗi tầng |

Lỗi bố cục: tháp tại cục bộ x ±88 trên nền rộng 190 (tầng trên 144,4 → ±72,2) → tháp (rộng 31,7) **chìa ra ngoài** tầng trên tới 31,6 m. Sửa: đưa tháp vào **±56**, z cục bộ 40 → kiểm không chạm chính điện (chính điện chiếm cục bộ z −23…23, tháp ở z 24…56 → cách 1 m; đổi tháp về z 44).

### 3.2 INT-TB-CHINHDIEN — Chính Điện Tử Bình Phong (hạng A)

Sảnh 163 × 40 m quá lớn cho một khoang → chia **mười khoang** dọc chiều dài, ở giữa là **Bát Cách Lang**: tám điện nhỏ liền nhau, mỗi điện một **cách cục chính** (tám cách trong `halls.js › GE_GODS`: 正官 Chính Quan, 七殺 Thất Sát, 正財 Chính Tài, 偏財 Thiên Tài, 正印 Chính Ấn, 偏印 Thiên Ấn, 食神 Thực Thần, 傷官 Thương Quan).

```
 cục bộ x: −81,5    −61,5     −41,5 ··· (8 gian × 12,5 m = 100 m) ··· 41,5     61,5      81,5
           ┌─────────┬────────┬───┬───┬───┬───┬───┬───┬───┬───┬────────┬─────────┐
           │ LÃO QUÂN│ THƯ    │正官│七殺│正財│偏財│正印│偏印│食神│傷官│ CÁCH    │ TĨNH     │
           │ ĐIỆN    │ KHỐ    │   │   │   │   │   │   │   │   │ CỤC     │ THẤT     │
           │(chuyển  │ cổ án  │ ← BÁT CÁCH LANG: lối dọc 4 m phía trước, │ ĐƯỜNG   │ ĐẠO     │
           │ ROOMS › │ CLASSI-│   mỗi gian một điện cách cục            │ (sảnh   │ TRƯỞNG  │
           │ laoquan)│ CAL_   │                                        │  trong) │ (khóa)  │
           │         │ CASES  │                                        │         │         │
           └──[cửa]──┴─[cửa]──┴──────────[ cửa giữa lớn ]─────────────┴─[cửa]───┴─────────┘
                                     mặt tiền quay về Huyền Thành
```

| Khoang | Rộng (cục bộ x) | Công năng | Trạm | Nối |
|---|---|---|---|---|
| `tb.laoquan` | −81,5…−61,5 (20 m) | **Lão Quân Điện** chuyển vào: tượng `deity_daode` (fit 6,2 như phòng cũ), bàn thờ, bàn lễ, đèn lồng | `tb_laoquan` · «Dâng hương Lão Quân» | `remedy-fate › DAO_JIA` (道德經 trích) |
| `tb.thukho` | −61,5…−41,5 | **Thư Khố cổ án**: kệ án lá số danh nhân cổ | `tb_coan` · «Đọc một cổ án» | `classical-cases › CLASSICAL_CASES` |
| `tb.cach.1` … `.8` | 8 gian −41,5…58,5 mỗi gian 12,5 m | **Bát Cách Lang**: mỗi điện một cách — bia định nghĩa cách, ví dụ lá số, «thành cách / phá cách» | `tb_cach_1…8` · «Học cách …» | `pattern.js`, `pattern-quality.js` (thành / phá / cứu / đặc biệt — Mệnh Cách canon §5) |
| `tb.cachcuc` | 58,5…81,5 (phần trước) | **Cách Cục Đường** — sảnh trong của nghề: án khó (nhiều bước) do trưởng sảnh giao | `tb_ankho` · «Nhận án khó» | `halls.js › buildCachCuc` (bản nâng độ khó) |
| `tb.tinhthat` | 58,5…81,5 (phần sau) | tĩnh thất đạo trưởng — **khoang khóa** (mở theo chuỗi `CQ-*`) | — | nhìn qua song |

Tầng trên (y + 14): **hành lang ngắm núi** chạy suốt mặt tiền 163 m (lan can, 12 điểm dừng), lên bằng 2 cầu thang chữ U ở hai đầu Bát Cách Lang. Bát Cách Lang: mỗi điện cao 10 m có trần ô cờ, ánh sáng theo **nhóm thập thần** của cách — quy ước màu của game (Quan Sát: trắng bạc; Tài: vàng; Ấn: lam; Thực Thương: đỏ cam), **không** gán ngũ hành cố định vì thập thần tính tương đối theo Nhật chủ. Nội dung từng điện ở 08-17 §1.

**Lão Quân Điện** thay `ROOMS › laoquan` (cửa cũ (−564, −510), origin (1800, 0)): cửa mới là cửa riêng của khoang `tb.laoquan` ở mặt tiền; trạm menu đi nhanh «Lão Quân Điện» trỏ tới đó.

**Ước lượng**: khoét 6 cửa + cửa giữa (3) · lót sảnh 163 m + vách ngăn 10 khoang (5) · Bát Cách Lang (8 điện, nội dung + ánh sáng) (8) · chuyển Lão Quân (1,5) · Thư Khố + Cách Cục Đường (4) · hành lang trên (3) · test (2). **≈ 26,5 ngày.**

### 3.3 INT-TB-THAPDONG — Cửu Cung Lâu, INT-TB-THAPTAY — Cửu Vận Lâu (hạng B)

| Thông số | Giá trị |
|---|---|
| Vỏ | `tower_nine` cao 80 (31,7 × 80 × 31,9) tại cục bộ (±56, 44) sau khi sửa |
| Lòng | phòng trệt ~13 × 14; tầng ~8 m → mỗi tầng chia **sàn + gác lửng** (2 mức 4 m) |
| Cách làm | **dựng lại thân bằng mô-đun** (08-02 §5.7: ≥ 2 điều kiện — > 2 tầng đi được không có sàn trong lát cắt ở tỉ lệ này; công trình rất cao); giữ mái và chóp Meshy |
| Thang | chữ U quanh lõi, 2 đợt 4 m mỗi tầng |

| Tầng | **Cửu Cung Lâu** (Đông) | **Cửu Vận Lâu** (Tây) |
|---|---|---|
| Ý | 9 tầng = 9 cung Lạc Thư (1 Khảm … 9 Ly) | 9 tầng = 9 vận Tam Nguyên (vận 1 … vận 9), vận hiện hành ở tầng được thắp sáng |
| Mỗi tầng | bàn sao Huyền Không của cung đó năm nay | biên niên vận: năm bắt đầu / kết thúc, sao chủ vận, «nhà hợp vận» |
| Nối | `xuankong › STAR`, `yearFlyingStar` | `sanyuan-jiuyun › sanyuanJiuyun`, `currentYun` |
| Trạm | `tb_cuucung` (tầng trệt: mục lục; mỗi tầng đọc được) | `tb_cuuvan` |
| Ước lượng | 9 ngày (dựng lại thân dùng chung cả hai) | 4 ngày |

---

## 4. Manh Phái Cốc (`manh`)

### 4.1 Hiện trạng

`palaceComplex(g, { x: 640, z: −520, ry: faceTo(…) ≈ −0,888, scale: 0,75 })` + `cauldron` cao 22 m tại (710, —, −460).

| Công trình | Đặt (cục bộ, scale 0,75) | Kích thước | Lòng (suy) |
|---|---|---|---|
| Đại điện `palace_grand` | rộng 69, tại (0, −10,8) | 69 × 48,9 × 41,1 | sảnh lõi 31,4 × 16,5 (thông thủy ~9 m); tầng trên 29,8 × 20,4 ở ~15 m |
| Điện phụ `hall_main` | rộng 25,5, tại (±40,5, 10,8) | 25,5 × 19,8 × 23,4 | sảnh 20,9 × 8,7; gác 17,4 × 9,3 |
| Tháp `tower_nine` | cao 46,5, tại (±47,25, −34,2) | 18,5 × 46,5 × 18,6 | phòng trệt 7,5 × 8,1; tầng ~4,6 m |
| Cổng `sect_gate_grand` | rộng 34,5, tại (0, 69,3) | 34,5 × 22 × 20 | thân rỗng 34 × 19,7 (suy) |
| Đại Đỉnh `cauldron` | cao 22 | 22,5 × 22 × 15,8 | — |

Lỗi bố cục: tầng trên nền 112,5 × 0,76 = 85,5 (±42,75) → điện phụ (khung ±(28,8…52,2)) và tháp (±(38…56,5)) chìa ra — sửa theo §1.2 (`tierShrink` 0,04 → tầng trên ±51,75; điện phụ về ±38, tháp về ±41, z −38).

### 4.2 Ý chung: «đọc tượng không cần mắt»

Manh phái (盲派) truyền nghề qua thầy mù đọc «tượng» của lá số. Toàn quần thể thiết kế cho **tai và tay**: ánh sáng thấp, nhiều **phù điêu sờ được** (bấm vào → nghe mô tả bằng giọng / chữ), âm thanh định hướng. Mục tiêu: người chơi cảm được cách học khác — tôn trọng, không biến người khiếm thị thành trò lạ.

### 4.3 INT-MP-DAIDIEN — Tượng Pháp Đường (hạng A)

| Khoang | Kích thước | Nội dung | Trạm | Nối |
|---|---|---|---|---|
| `mp.l0.duong` | 31,4 × 16,5 × 9 | **Đường Không Đèn**: chỉ đèn ở chân tường; vách phù điêu 12 «tượng» (hình tượng hóa can chi) chạy quanh; ghế thầy giữa | `mp_tuong` · «Sờ phù điêu đọc tượng» | `mangpai › analyzeMangpai` (tượng của lá số người chơi), `mangpai-view.js` |
| `mp.l1.thu` | 29,8 × 20,4 × 4 | thư phòng chép «khẩu quyết» (bản đọc to) | `mp_khauquyet` · «Nghe khẩu quyết» | nội dung tượng pháp đã có trong app (không bịa — trụ cột T5) |

Sảnh trong của sảnh nghề Tượng Pháp: án khó giao ở `mp.l0.duong`. Cửa `canh2` + ngách. Âm: `dai_dien` nhưng **khô hơn** (ướt 0,2) để nghe rõ lời. **≈ 14 ngày.**

### 4.4 INT-MP-DIENDONG — Thính Âm Đường, INT-MP-DIENTAY — Xúc Tượng Đường (hạng B)

| | Thính Âm Đường | Xúc Tượng Đường |
|---|---|---|
| Nội dung | 5 chuông / khánh ngũ âm (cung, thương, giốc, chủy, vũ) ứng ngũ hành; bài nghe phân biệt hành | bàn sa bàn nổi: 10 can, 12 chi bằng khối khắc nổi |
| Nối | `music-therapy › musicTherapy` (ngũ âm theo hành Dụng) | `constants.js` (`GAN`, `ZHI`) — trò ghép can chi |
| Trạm | `mp_nghe` | `mp_so` |
| Ước lượng | 5 ngày | 5 ngày |

### 4.5 Tháp, cổng, Đại Đỉnh

| INT | Hạng | Thiết kế | Ước lượng |
|---|---|---|---|
| INT-MP-THAPDONG / -THAPTAY | B | 9 tầng ~4,6 m (thang xoắn dùng chung, bán kính 2,6 vừa phòng 7,5 × 8,1); Đông: **Lầu Gió** (mỗi tầng một chuông gió chất liệu khác — nghe gió); Tây: **Lầu Tiếng Nước** (ống tre dẫn nước) — tương tác nhỏ + điểm ngắm thung lũng | 6 |
| INT-MP-SONMON | B | cổng có thân rỗng: hai phòng gác + lầu cổng (giống INT-CONG, 08-11 §6) | 4 |
| INT-MP-DAIDINH | D | Đại Đỉnh cao 22 m: **giàn gỗ bậc thang** (MOD-MIE-37 đổi bảng màu gỗ thường — không dùng biểu tượng Miêu) dựng sát một chân đỉnh lên **sàn ngắm miệng đỉnh** (y +20); trong miệng đỉnh tro hương và khói (MOD-KT-30). Tương tác nhỏ: «Nhìn vào lòng đỉnh» | 2 |

---

## 5. Trích Thiên Đỉnh (`trichthien`)

### 5.1 Hiện trạng

```js
const p = R('trichthien'); const ry = faceTo(p.x, p.z, 0, 0);                  // (−600, 600), ry ≈ 2,356
const top = terrace(g, { x: p.x, z: p.z, ry, w: 120, d: 120, levels: 3, rise: 4 });
await place(g, 'observatory', { fit: { width: 90 }, at: { x: p.x, y: top, z: p.z, ry } });
// tower_nine cao 110 tại cục bộ (0, −70), trên mặt đất (không trên nền)
// lib_pagoda5 cao 52 tại cục bộ (75, 20)
```

| Công trình | Kích thước | Lòng đo được |
|---|---|---|
| `observatory` 90 m | 90 × 36,7 × 82,7 | **thân đài rỗng** 82 × 77 cao ~5 m (vỏ không lõi); mặt đài đặc ở 5,2–6,8; lan can quanh mặt đài 81 × 70; trên mặt đài vài chòi nhỏ |
| `tower_nine` 110 m | 43,6 × 110 × 43,9 | phòng trệt ~18 × 19; tầng ~11 m |
| `lib_pagoda5` 52 m | 34,4 × 52 × 34,6 | trệt 18 × 18 có trụ tâm; tầng ~10,8 m |

### 5.2 INT-TT-QUANTINH — Quan Tinh Đài (hạng A): «đi trong lá số Tử Vi»

Lá số Tử Vi vẽ thành **hình vuông 12 cung bao quanh một ô giữa**. Thân đài rỗng 82 × 77 m chia lưới 4 × 4 ô (~20,5 × 19,25 m): **12 ô viền = 12 cung**, **4 ô giữa = Thiên Bàn** (ô thông tầng, chứa Đẩu Mẫu Điện). Người chơi đi trong chính bố cục lá số.

```
 (cục bộ, nhìn từ trên; mặt tiền +Z quay về Huyền Thành; thứ tự cung theo địa chi)
 ┌──────────┬──────────┬──────────┬──────────┐
 │ Tỵ       │ Ngọ      │ Mùi      │ Thân     │
 │ cung ... │ cung ... │ cung ... │ cung ... │
 ├──────────┼──────────┴──────────┼──────────┤
 │ Thìn     │   THIÊN BÀN (thông  │ Dậu      │
 │          │   tầng): ĐẨU MẪU    │          │
 ├──────────┤   ĐIỆN + bàn an sao │──────────┤
 │ Mão      │   Tử Vi (sảnh trong)│ Tuất     │
 ├──────────┼──────────┬──────────┼──────────┤
 │ Dần      │ Sửu      │ Tý       │ Hợi      │
 └──────────┴──────[cửa chính ở ô Tý]─────────┘
```

| Khoang | Nội dung | Trạm | Nối |
|---|---|---|---|
| `qt.cung.<chi>` × 12 | mỗi ô một **địa chi cố định**; khi người chơi đã có lá số, biển cửa mỗi ô hiện **tên cung** của lá số họ đóng ở chi đó (Mệnh, Huynh Đệ, Phu Thê, Tử Tức, Tài Bạch, Tật Ách, Thiên Di, Nô Bộc, Quan Lộc, Điền Trạch, Phúc Đức, Phụ Mẫu) và **chính tinh** ở cung đó (`ZW_MAIN` của `halls.js`: Tử Vi, Thiên Cơ…) — đèn trần màu theo độ sáng sao | `qt_cung` (một trạm dùng chung, theo ô) · «Xem cung này» | `ziwei › computeZiwei`, `ziwei-brightness.js`, `ziwei-sanfang.js` (tam phương tứ chính — 4 ô liên quan sáng cùng lúc) |
| `qt.thienban` | **Đẩu Mẫu Điện** chuyển vào (tượng `deity_doumu`, bàn thờ, bàn lễ như phòng cũ); bàn an sao lớn giữa (sảnh trong của nghề Tử Vi: án khó) | `qt_daumau` · «Dâng hương Đẩu Mẫu»; `qt_ankho` · «Nhận án khó Tử Vi» | `remedy-fate`; `halls.js › buildTuVi` nâng cấp |
| `qt.mat` (ngoài trời, y + 6,8) | mặt đài: hỗn thiên nghi (`prop_armillary`), 28 cọc đá đánh dấu 28 tú quanh lan can, Bắc Đẩu vẽ trên sàn | `qt_tinh` · «Ngắm sao (đêm)» | `ershibaxiu.js`, `qizheng.js` |

Lối vào: cửa chính ở ô **Tý** (giữa mặt tiền), cửa nối giữa các ô theo vòng 12 chi (cửa nhìn `open`, đi vòng được cả hai chiều), từ mỗi ô góc có lối vào Thiên Bàn. Thang lên mặt đài ở hai ô góc sau (Tỵ, Thân). Ánh sáng: ban ngày ô cung chỉ có ánh trời qua giếng trời nhỏ (MOD-GNA-13 đổi sang bộ BAC — ô trần mở) — «sao» là các đèn trần.

**Đẩu Mẫu Điện** thay `ROOMS › daumau` (cửa cũ (−566, 566), origin (1700, 0)).

**Ước lượng**: lót thân đài rỗng + lưới 16 ô + cửa (8) · 12 cung động theo lá số (6) · Thiên Bàn + chuyển Đẩu Mẫu (3) · mặt đài (4) · test (2). **≈ 23 ngày.**

### 5.3 INT-TT-CUUTANG — Cửu Diệu Lâu (hạng B)

| Thông số | Giá trị |
|---|---|
| Vỏ | `tower_nine` cao 110, đặt **trên mặt đất** cục bộ (0, −70) — sau đài |
| Cách làm | dựng lại thân bằng mô-đun (như Tử Bình §3.3), tầng 11 m chia sàn + gác lửng |
| Chủ đề | 9 tầng = **Cửu Diệu** (Nhật, Nguyệt, Mộc, Hỏa, Thổ, Kim, Thủy, La Hầu, Kế Đô) — mỗi tầng vị trí hiện tại của diệu đó |
| Nối | `qizheng.js` (Thất Chính Tứ Dư) |
| Trạm | `tt_cuudieu` |
| Ước lượng | 8 ngày |

### 5.4 INT-TT-NGUTANG — Ngũ Tinh Tháp (hạng B)

| Thông số | Giá trị |
|---|---|
| Vỏ | `lib_pagoda5` cao 52 (34,4 × 52 × 34,6) tại cục bộ (75, 20), trên mặt đất |
| Lòng | trệt 18 × 18 trụ tâm; tầng 2: hành lang 22 × 22, phòng 14 × 15; tầng 3: phòng 14 × 13; tầng 4: phòng đỉnh 8 × 8 (gấp đôi số đo ở 26 m) |
| Chủ đề | 5 tầng mái = **Ngũ Tinh** (Thần tinh / Thủy, Thái Bạch / Kim, Huỳnh Hoặc / Hỏa, Tuế tinh / Mộc, Trấn tinh / Thổ); 4 tầng đi được + tầng mái thứ 5 đặc (khám) |
| Thang | thang xoắn quanh trụ (bán kính phóng 2 lần: 1,2–5,2 m, bậc 0,22 × 32 bậc / vòng) |
| Trạm | `tt_nguttinh` · «Hành tinh nào sáng đêm nay» → `qizheng.js` |
| Ước lượng | 6 ngày |

---

## 6. Tổng hợp phần này

| Nhóm | Ngày người |
|---|---|
| Hậu Sơn (chính điện 18 + điện phụ 10 + tháp 12 + nền 3) | 43 |
| 8 sảnh nghề | 7 |
| Tử Bình (chính điện 26,5 + tháp 13) | 39,5 |
| Manh Phái Cốc (14 + 10 + 6 + 4 + 2) | 36 |
| Trích Thiên (23 + 8 + 6) | 37 |
| **Cộng** | **≈ 162,5 ngày người** |
