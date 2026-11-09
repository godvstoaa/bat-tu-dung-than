# 08-05 · Bộ mô-đun nội thất (1): Kỹ thuật chung · Đạo quán phương Bắc · Đạo quán Giang Nam · Chùa Việt

> Bộ mô-đun là «gạch Lego» của nội thất: mỗi mảnh có mã `MOD-<BỘ>-xx`, kích thước theo lưới gian 3,2 m (lưới phụ 0,4 m), vật liệu tham chiếu atlas chung của bộ, loại va chạm, quy tắc khớp, móc tương tác. Phần này gồm bộ **KT** (dùng mọi nơi) và ba bộ phong cách **BAC**, **GNA**, **VIE**. Bốn bộ phong cách còn lại và bộ dân dụng ở 08-06.

---

## 1. Quy ước chung của mọi bộ

### 1.1 Cột trong bảng mảnh

| Cột | Nghĩa |
|---|---|
| Mã | `MOD-<BỘ>-xx` — số không tái sử dụng; mảnh bỏ đi giữ số, đánh dấu «bỏ» |
| Kích thước | R × C × S (rộng X × cao Y × sâu Z, mét) tại tỉ lệ 1; mảnh co giãn được ghi «C biến» |
| Vật liệu · màu | khe vật liệu của bộ (§1.2) và mã màu khóa; màu khóa là giá trị nhân vào atlas xám |
| Tam giác | ngân sách bản `mid` |
| Va chạm | mã loại §1.4 |
| Khớp | mã khớp §1.3 |
| Móc | `hook` gắn vào `extras` (08-02 §3.3); «—» = mảnh tĩnh |
| Dùng ở | INT đang có hoặc công trình dự kiến (thánh địa tài liệu 07) |

### 1.2 Khe vật liệu (mỗi bộ ≤ 6, một atlas)

| Khe | Nội dung atlas | Thuộc tính PBR |
|---|---|---|
| `trim` | dải viền, hoa văn vẽ, chạm nổi (vẽ trên trim sheet 2048 × 2048, mỗi dải cao 128 px) | nhám 0,55 |
| `wood` | gỗ sơn / gỗ mộc, vân dọc | nhám 0,5–0,7 |
| `stone` | đá, gạch, vữa | nhám 0,85–0,95 |
| `fabric` | vải, giấy dán cửa, chiếu, lụa (có alpha cho chạm thủng / giấy mờ) | nhám 0,9, `side: DoubleSide` |
| `metal` | đồng, vàng thếp, sắt | kim loại 0,85, nhám 0,32 (như `M.gold` trong `interior.js`) |
| `emissive` | nến, lửa, giấy đèn lồng | phát sáng, đăng ký `addGlow` |

### 1.3 Mã khớp (socket)

| Mã | Vị trí | Mảnh nhận |
|---|---|---|
| `S-COT` | giao điểm lưới gian (góc gian) | cột, chân tảng, trụ |
| `S-TUONG` | cạnh gian, mặt trong | tường lót, vách, khung cửa |
| `S-CUA` | ô cửa trong một mảnh tường | khung cửa, cánh cửa, cửa sổ |
| `S-SAN` | ô sàn 3,2 × 3,2 | sàn, chiếu, bệ |
| `S-TRAN` | ô trần ở `ceilY` | trần, tảo tỉnh, vì kèo |
| `S-PHU` | lưới phụ 0,4 m trên sàn | đồ đạc |
| `S-BAN` | mặt trên đồ đạc (bàn, bệ) | vật nhỏ: lư, nến, sách |
| `S-TREO` | điểm treo dưới xà / trần, mỗi 1,6 m | đèn lồng, phướn, chuông |
| `S-VACH` | điểm treo trên tường, mỗi 0,8 m, cao 1,6 / 2,4 m | tranh, biển, giá |
| `S-KHAM` | hốc trong khám / tường | tượng nhỏ, bài vị |
| `S-THANG` | đầu / chân đợt thang | đợt thang, chiếu nghỉ |

Khớp ghi «→» là mảnh **cung cấp** khớp cho mảnh khác (ví dụ bệ cung cấp `S-BAN`).

### 1.4 Mã va chạm

| Mã | Cách tạo | Ghi chú |
|---|---|---|
| `—` | không | vật treo cao > 2,1 m, thảm, phướn |
| `Đ` | cắt lát hình khối (`collide.js`) lúc nướng | tường, vách, lan can, đồ phức tạp |
| `H` | hộp `addSolidRect` theo khung bao chân | bàn, kệ, bệ |
| `T` | tròn `addBlock` bán kính ghi kèm | cột, chum, lư lớn |
| `N` | nền đi được `addPlatform` | sàn, bệ đứng lên được, chiếu nghỉ |
| `B` | bậc thang (`addStair`, 08-04 §2.3) | |
| `C` | ô cửa: khoét `keep` + cửa nhìn | khung cửa |
| `X` | chỉ chặn camera (không chặn người) | trần thấp, xà to |

### 1.5 Ngân sách mảnh

Một khoang A điển hình (20 × 10,5 m, 21 gian² ≈ 6 × 3 gian): ~220 bản sao mảnh, ~38 mã khác nhau → ~38 `InstancedMesh` trước gộp → sau `mergeStatic` theo vật liệu còn ~14 draw call kết cấu + ~20 đạo cụ riêng = trong ngân sách 110 (08-01 §12).

---

## 2. MOD-KT — Kỹ thuật chung (dùng ở mọi công trình)

Phong cách trung tính; màu nhận theo bảng màu công trình. Một phần là **nút dữ liệu** (không vẽ) cho runtime.

| Mã | Tên | Kích thước | Vật liệu · màu | Tam giác | Va chạm | Khớp | Móc | Dùng ở |
|---|---|---|---|---|---|---|---|---|
| MOD-KT-01 | Sàn trơn gian | 3,2 × 0,1 × 3,2 | `stone` theo bảng | 12 | N | S-SAN → S-PHU | — | mọi khoang chưa có sàn bộ |
| MOD-KT-02 | Sàn trơn nửa gian | 1,6 × 0,1 × 1,6 | `stone` | 12 | N | S-SAN | — | góc lẻ |
| MOD-KT-03 | Tường lót trơn 3,2 | 3,2 × C biến × 0,12 | `stone` vữa + gờ chân `trim` | 24 | Đ | S-TUONG → S-VACH | — | lớp lót tự động (08-02 §5.6) |
| MOD-KT-04 | Tường lót trơn 1,6 | 1,6 × C biến × 0,12 | như trên | 24 | Đ | S-TUONG | — | |
| MOD-KT-05 | Tường lót đoạn lẻ 0,4 | 0,4 × C biến × 0,12 | như trên | 24 | Đ | S-TUONG | — | khớp biên lệch lưới |
| MOD-KT-06 | Khung cửa trơn nhỏ | 2,1 × 2,8 × (tường + 0,1) — ô 1,8 × 2,6 | `wood` gỗ thẫm `#3B2418` | 96 | C | S-CUA | — | nhà dân, phòng phụ (che vết boolean) |
| MOD-KT-07 | Khung cửa trơn lớn | 2,7 × 3,4 × (tường + 0,1) — ô 2,4 × 3,2 | `wood` | 96 | C | S-CUA | — | cửa phụ điện |
| MOD-KT-08 | Khung cửa sổ trơn | 1,5 × 1,5 × (tường + 0,1) — ô 1,2 × 1,2 | `wood` | 72 | — (cửa nhìn `window`) | S-CUA | — | |
| MOD-KT-09 | Ngưỡng cửa gỗ | 2,4 × 0,12 × 0,3 | `wood` | 12 | — (bước qua) | S-CUA | — | mọi cửa (đúng lệ ngưỡng cao) |
| MOD-KT-10 | Trần phẳng gian | 3,2 × 0,08 × 3,2 | `wood` ván | 12 | X | S-TRAN | — | |
| MOD-KT-11 | Dầm trơn | 3,2 × 0,4 × 0,3 | `wood` | 12 | X | S-TRAN | — | |
| MOD-KT-12 | Nắp đầu tường (bổ dọc) | 3,2 × 0,04 × độ dày tường | đen nhám `#141210` | 4 | — | S-TUONG (đỉnh) | `cutaway` | bật khi mái mờ (08-03 §7.6) |
| MOD-KT-13 | Bậc thang thường | 1,4 × 0,2 × 0,3 (rộng biến 1,2–1,6) | `wood` / `stone` | 12 | B | S-THANG | — | nhân bản thành đợt |
| MOD-KT-14 | Đợt thang thẳng 18 bậc | 1,4 × 3,6 × 5,4 | `wood` + tay vịn | 260 | B | S-THANG → S-THANG | — | thang gác |
| MOD-KT-15 | Đợt thang lầu dốc 16 bậc | 1,4 × 4,0 × 4,0 | `wood` sơn | 240 | B | S-THANG | — | Chính Đường, lầu chuông |
| MOD-KT-16 | Chiếu nghỉ | 1,6 × 0,2 × 3,2 | `wood` | 12 | N | S-THANG | — | |
| MOD-KT-17 | Bậc xoắn 22,5° | rẻ quạt r 0,6–2,6, cao 0,22 | `stone` / `wood` | 20 | B (`seg`) | S-THANG | — | tháp (08-04 §2.4) |
| MOD-KT-18 | Trụ tâm thang xoắn | Ø 1,2 × 3,6 | `stone` | 64 | T 0,65 | S-COT | — | tháp |
| MOD-KT-19 | Lan can trơn | 1,6 × 0,95 × 0,12 | `wood` | 40 | Đ | S-TUONG (mép sàn) | — | mép sàn tầng trên |
| MOD-KT-20 | Lan can miệng thang | khung U 1,6 × 0,95 × 3,4 | `wood` | 90 | Đ | quanh lỗ sàn | — | mọi miệng cầu thang (08-04 §2.3) |
| MOD-KT-21 | Hộp va chạm ẩn | 0,5 × 2,0 × 0,5 (co giãn) | ẩn | 12 | H | — | — | `COL__` thay vỏ |
| MOD-KT-22 | Tứ giác cửa nhìn | theo ô | ẩn | 2 | — | S-CUA | `portal` | `PT__` |
| MOD-KT-23 | Hộp khoang | theo khoang | ẩn | 12 | — | — | `cell` | `CE__` |
| MOD-KT-24 | Thẻ cửa sổ đêm | 1,2 × 1,2 | `emissive` ấm `#FFB35C` | 2 | — | sau `PT__` cửa sổ | `nightwin` | nhìn từ xa ban đêm (08-02 §7) |
| MOD-KT-25 | Thẻ bụi nắng | 2 × 6 (xiên) | cộng màu, opacity 0,1 | 2 | — | sau cửa ra `out` | `sunshaft` | `high` |
| MOD-KT-26 | Thẻ tối sau cửa | 3,2 × 4 | đen ấm `#1A120C` | 2 | — | sau cửa ra `out` | `placeholder` | khi nội thất chưa nạp |
| MOD-KT-27 | Mốc đèn | điểm | — | 0 | — | S-TREO / S-BAN | `light` | `LT__` |
| MOD-KT-28 | Gờ chân tường | 3,2 × 1,1 × 0,15 | `stone` sẫm `#2B1410` | 12 | Đ | S-TUONG | — | đi kèm KT-03 |
| MOD-KT-29 | Ống khói gạch | 0,8 × 3,0 × 0,8 | `stone` gạch | 60 | H | mái | `khoi` | nhà có bếp (lời hứa H8) |
| MOD-KT-30 | Bộ phát khói | điểm | sprite xám 128² | 2 / hạt | — | đỉnh KT-29, lư hương | `khoi` | khói bếp, hương khói |
| MOD-KT-31 | Ô thoáng gió | 0,6 × 0,6 | `wood` song | 24 | — (cửa nhìn `window`) | S-CUA | — | nhà dân, kho |
| MOD-KT-32 | Rèm cửa vải | 1,8 × 2,6 | `fabric` theo bảng | 80 (lưới 4 × 8 biến dạng) | — | S-CUA | `door:rem` | cửa phòng trong |

---

## 3. MOD-BAC — Đạo quán phương Bắc (quan thức)

**Nguyên mẫu:** cung quán đời Minh – Thanh phương Bắc (Bạch Vân Quán, Võ Đang); kết cấu đấu củng, xà vẽ toàn tỉ hoa văn lam lục, cột sơn son, nền gạch vuông «kim chuyên».

**Dùng ở (đang có):** toàn bộ Sơn Môn, Hậu Sơn, đại điện / điện phụ / tháp của Tử Bình, Manh Cốc, Trích Thiên, Phong Thủy Viên, Lịch Đường; thành môn, Văn Phong Tháp, cổng tông môn. **Dự kiến:** Võ Đang, Chung Nam.

### 3.1 Bảng màu theo nơi (nhân vào atlas)

| Bảng | Đỏ son (cột, tường) | Kim | Lục xà | Đá / gạch | Trần | Nguồn |
|---|---|---|---|---|---|---|
| `huyenquan` (Sơn Môn, Hậu Sơn, Huyền Thành) | `#9C2318` | `#D4A63C` | `#1F5A55` | `#8F877A` | `#2A1712` | màu đang dùng trong `sect.js`, `interior.js` |
| `vodang` | `#A3271B` | `#C9A23A` | `#2F7A55` | `#8D8A84` | `#2A1712` | bảng khóa Võ Đang (tài liệu tổng §7.2) |
| `chungnam` | `#8E2F24` | `#B8923A` | `#2E5C8A` (lam toàn tỉ) | `#6E6A66` | `#2A1E1A` | bảng khóa Chung Nam |
| `tubinh` | `#7E2A20` | `#C0A050` | `#3A5C6A` | `#7A746C` | `#241612` | vùng đá xám núi cao (đề xuất) |
| `manhcoc` | `#8A3A26` | `#B89040` | `#4E6A3A` | `#857A6E` | `#2A1A12` | thung lũng (đề xuất) |
| `trichthien` | `#6E2A3A` (đỏ tím) | `#C8B060` | `#2A3E6A` (lam đêm) | `#8A8A94` | `#14182A` | quan tinh (đề xuất) |

### 3.2 Bảng mảnh

| Mã | Tên | Kích thước | Vật liệu · màu | Tam giác | Va chạm | Khớp | Móc | Dùng ở |
|---|---|---|---|---|---|---|---|---|
| MOD-BAC-01 | Sàn gạch vuông «kim chuyên» | 3,2 × 0,1 × 3,2 (ô 0,8) | `stone` `#6D665C` | 12 | N | S-SAN → S-PHU | `floor:da` | mọi điện |
| MOD-BAC-02 | Sàn ván lầu | 3,2 × 0,12 × 3,2 | `wood` `#5A3A26` | 12 | N | S-SAN | `floor:go` | tầng 2 Chính Đường, lầu chuông, tháp |
| MOD-BAC-03 | Tường lót sơn son 3,2 | 3,2 × C biến × 0,14, gờ chân 1,1 m sẫm | `wood` đỏ son + `trim` | 40 | Đ | S-TUONG → S-VACH | — | lót mọi điện |
| MOD-BAC-04 | Tường lót sơn son 1,6 | 1,6 × C biến × 0,14 | như trên | 40 | Đ | S-TUONG | — | |
| MOD-BAC-05 | Tường lót có song chữ Vạn | 3,2 × C biến × 0,14, ô 2,6 × 3,2 cao 3,6 | `wood` + `fabric` giấy | 180 | Đ + cửa nhìn `window` | S-TUONG | — | tường hồi điện (như ô lưới gỗ `interior.js`) |
| MOD-BAC-06 | Vách ngăn gỗ cách phiến | 3,2 × 3,6 × 0,1 | `wood` + `trim` chạm | 220 | Đ | S-TUONG | — | chia Tổ Sư đường / hậu đường |
| MOD-BAC-07 | Cột tròn sơn son Ø 0,5 | 0,5 × C biến (3,6–7,2) | `wood` đỏ son | 128 | T 0,45 | S-COT | `fadeable` | mọi điện (như hàng cột `interior.js`) |
| MOD-BAC-08 | Cột lớn Ø 0,7 | 0,7 × C biến (6–10) | `wood` đỏ son + đai `metal` | 160 | T 0,6 | S-COT | `fadeable` | sảnh A |
| MOD-BAC-09 | Chân tảng trống đá | Ø 1,0 × 0,45 | `stone` `#CBC3B2` | 96 | (gộp T của cột) | S-COT | — | dưới BAC-07 / 08 |
| MOD-BAC-10 | Đầu cột + lô đấu | 0,9 × 0,5 × 0,9 | `wood` + `trim` | 140 | — | đỉnh cột | — | |
| MOD-BAC-11 | Cụm đấu củng một gian | 3,2 × 0,9 × 0,8 | `wood` + `trim` lam lục | 1.200 | — | S-TRAN (dưới xà) | — | điện A, cổng |
| MOD-BAC-12 | Xà ngang vẽ toàn tỉ | 3,2 × 0,55 × 0,45 | `trim` lam lục viền vàng | 40 | X | S-TRAN | — | mọi điện (như `M.beam` + gờ vàng) |
| MOD-BAC-13 | Xà dọc | 3,2 × 0,4 × 0,35 | `trim` | 32 | X | S-TRAN | — | |
| MOD-BAC-14 | Trần ô cờ «thiên hoa» | 3,2 × 0,25 × 3,2 (9 ô) | `trim` lam lục, hoa tròn vàng | 120 | X | S-TRAN | — | điện A, B có trần |
| MOD-BAC-15 | Tảo tỉnh rồng cuộn | 6,4 × 2,0 × 6,4 (lõm lên) | `trim` + `metal` | 3.200 | — | S-TRAN (giữa gian thờ) | — | trên tượng chính (Chính Đường, Tam Thanh) |
| MOD-BAC-16 | Vì kèo hở «lương giá» nhịp 9,6 | 9,6 × 3,2 × 0,5 | `wood` sẫm | 300 | X | S-TRAN | — | khoang không trần (gác, tháp) |
| MOD-BAC-17 | Diềm treo «lạc quải» | 3,2 × 0,6 × 0,08 | `wood` chạm alpha | 8 | — | S-TREO (giữa hai cột) | — | cửa võng giữa gian |
| MOD-BAC-18 | Khung bức bàn 6 tấm | 3,2 × 3,6 × 0,25 | `wood` đỏ son + `fabric` | 160 | C | S-CUA | `door:bucban` | mặt tiền trong của điện |
| MOD-BAC-19 | Tấm bức bàn đơn | 0,53 × 3,6 × 0,06 | `wood` lưới chữ «Tam giao lục uyển» alpha + giấy | 24 | — | trong BAC-18 | `door:leaf` | |
| MOD-BAC-20 | Cửa chính hai cánh đinh đồng | 3,2 × 3,75 × 0,12 (2 cánh) | `wood` son + 81 đinh `metal` (atlas) | 120 | — | S-CUA | `door:canh2` | Chính Đường, Chính Điện, điện phụ |
| MOD-BAC-21 | Khung cửa chính (che vết cắt) | 3,6 × 4,2 × (tường + 0,2) | `wood` + `trim` + bậc đá | 260 | C | S-CUA | — | cửa giữa mọi điện |
| MOD-BAC-22 | Cửa ngách một cánh | 1,2 × 2,4 × 0,08 | `wood` son | 24 | — | S-CUA | `door:canh1` | ngách `luon_mo` (08-03 §6.3) |
| MOD-BAC-23 | Khung cửa ngách | 1,5 × 2,7 × (tường + 0,1) | `wood` | 90 | C | S-CUA | — | |
| MOD-BAC-24 | Cửa sổ tròn «viên song» | Ø 1,6 × 0,2 | `wood` + song tròn alpha | 180 | — (`window`) | S-CUA | — | tầng 2, lầu |
| MOD-BAC-25 | Cửa sổ vuông lưới | 1,6 × 1,6 × 0,2 | `wood` + `fabric` | 60 | — (`window`) | S-CUA | `window:open` | |
| MOD-BAC-26 | Bậc cửa đá | 3,6 × 0,2 × 0,6 | `stone` trắng | 12 | N | S-CUA (chân) | — | |
| MOD-BAC-27 | Thần khám có màn | 3,2 × 4,8 × 2,4 | `wood` son thếp + `fabric` màn vàng | 1.800 | H | S-SAN → S-KHAM | `shrine` | Tổ Sư đường, Tam Thanh |
| MOD-BAC-28 | Thần khám nhỏ (bài vị) | 1,6 × 2,4 × 1,0 | như trên | 600 | H | S-SAN / S-BAN → S-KHAM | `shrine` | điện phụ, nhà Tổ |
| MOD-BAC-29 | Bệ thờ ba cấp | 6,4 × 1,35 × 4,6 (co ngang theo số tượng) | `wood` sơn sẫm thếp `#4A1610` | 72 | H | S-SAN → S-BAN | `altar` | như bàn thờ ba cấp `interior.js` |
| MOD-BAC-30 | Bàn lễ (cung trác) | 3,6 × 0,9 × 1,4 | như trên | 40 | H | S-PHU → S-BAN | `offer` | trước bệ thờ |
| MOD-BAC-31 | Hương án thếp vàng | 2,4 × 1,0 × 1,0 | `wood` + `metal` | 300 | H | S-PHU → S-BAN | `incense` | |
| MOD-BAC-32 | Lư hương đồng ba chân nhỏ | 0,5 × 0,45 × 0,5 | `metal` đồng `#8A6A3A` | 400 | — | S-BAN | `incense` + `khoi` | trên hương án |
| MOD-BAC-33 | Đôi nến sáp đỏ chân đồng | 0,3 × 0,9 × 0,3 (mỗi cây) | `emissive` sáp `#C8231A` + `metal` | 120 | — | S-BAN | `light:nen` | bàn lễ (như `M.wax`) |
| MOD-BAC-34 | Cung phẩm (bình hoa, mâm quả) | 0,4 × 0,5 × 0,4 | `metal` + `fabric` | 300 | — | S-BAN | `offer` | |
| MOD-BAC-35 | Bồ đoàn cói | Ø 0,9 × 0,18 | `fabric` cói `#A3681F` | 48 | — | S-PHU | `seat` | trước bàn lễ (như `M.cushion`) |
| MOD-BAC-36 | Bái điếm (đệm quỳ dài) | 1,6 × 0,15 × 0,6 | `fabric` đỏ | 24 | — | S-PHU | `seat:kneel` | |
| MOD-BAC-37 | Khánh đá trên khung | 1,2 × 1,8 × 0,5 | `stone` + `wood` | 260 | H | S-PHU | `qing` | Tổ Sư đường, Tĩnh Thất |
| MOD-BAC-38 | Chuông dẫn khánh trên giá | 0,5 × 0,9 × 0,5 | `metal` | 200 | — | S-PHU | `bell_small` | |
| MOD-BAC-39 | Mõ gỗ trên đệm | 0,5 × 0,35 × 0,4 | `wood` son | 180 | — | S-BAN / S-PHU | `muyu` | Giảng Đường |
| MOD-BAC-40 | Kệ kinh (kinh giá) | 3,2 × 2,4 × 0,6 | `wood` + gáy kinh `trim` | 420 | H | S-TUONG (sát tường) | `book` | Tàng Kinh, Tàng Thư |
| MOD-BAC-41 | Rương kinh long não | 1,2 × 0,8 × 0,7 | `wood` + góc `metal` | 220 | H | S-PHU | `chest` | |
| MOD-BAC-42 | Án thư đọc kinh | 1,8 × 0,8 × 0,9 | `wood` sẫm | 300 | H | S-PHU → S-BAN | `read` + `seat` | |
| MOD-BAC-43 | Ghế thái sư | 0,8 × 1,2 × 0,7 | `wood` son | 400 | H | S-PHU | `seat` | chỗ ngồi đạo trưởng, thầy |
| MOD-BAC-44 | Đoạn thân tháp bát giác (một tầng, thang xoắn trong) | Ø 6,4 × 3,6 | `stone` + `wood` | 900 | Đ + B | S-COT (tâm tháp) | — | thân tháp dựng lại (08-02 §5.7) |
| MOD-BAC-45 | Phướn vàng viền đỏ | 0,9 × 4,2 | `fabric` `#D9B04A` | 64 | — | S-TREO | `sway` | trước cột (như `M.banner`) |
| MOD-BAC-46 | Hoành phi | 3,2 × 1,0 × 0,1 | `wood` đen + chữ vàng (canvas) | 12 | — | S-VACH / trên cửa | `label` | mọi điện |
| MOD-BAC-47 | Câu đối cột | 0,4 × 3,2 × 0,05 | `wood` + chữ (canvas) | 12 | — | ôm cột | `label` | cặp cột giữa |
| MOD-BAC-48 | Đèn lồng cung lục giác | 0,7 × 1,2 × 0,7 | `wood` + `fabric` lụa + `emissive` | 300 | — | S-TREO | `light:denlong` | thay `lib_lantern.lod` treo trong điện |
| MOD-BAC-49 | Giá đèn dầu chân cao | 0,35 × 1,6 × 0,35 | `metal` + `emissive` | 160 | T 0,25 | S-PHU | `light:dendau` | |
| MOD-BAC-50 | Lan can gỗ hiên «tầm trượng» | 3,2 × 0,95 × 0,12 | `wood` son | 120 | Đ | S-TUONG (mép sàn lầu) | — | lầu chuông, tầng 2 |
| MOD-BAC-51 | Lan can đá hoa | 2,0 × 1,1 × 0,32 | `stone` `#CBC3B2` + núm `metal` | 60 | Đ | mép nền | — | như `sect.js › balustrade` |
| MOD-BAC-52 | Bình phong gỗ chạm | 3,2 × 2,4 × 0,3 | `wood` + `trim` | 350 | Đ | S-PHU | — | sau cửa chính (chắn «sát khí») |
| MOD-BAC-53 | Bia đá trên rùa (trong điện) | 1,3 × 2,6 × 0,9 | `stone` sẫm + chữ canvas | 600 | H | S-PHU | `stele` | Vận Mệnh Các (như bia `interior.js`), Án Lục Lâu |
| MOD-BAC-54 | Môn hải (chum đồng cứu hỏa) | Ø 1,4 × 1,0 | `metal` đồng | 240 | T 0,75 | S-PHU (sân, hiên) | `view` | hiên điện A |
| MOD-BAC-55 | Trần vòm cuốn gạch | 3,2 × 1,6 (cung) × 3,2 | `stone` gạch xám thành `#6E6A66` | 120 | X | S-TRAN | — | tàng binh động thành môn, vòm cổng, cổng tông môn |

### 3.3 Công thức lắp chuẩn

**BAC-R1 · Một gian chính điện (3,2 × chiều sâu khoang):**

```
 S-COT ●──────── BAC-12 xà ──────────● S-COT
       │  BAC-14 trần ô cờ (hoặc 16)  │
  BAC-07│                              │BAC-07       BAC-45 phướn treo S-TREO
  +BAC-09                               +BAC-09      BAC-48 đèn lồng treo mỗi 2 gian
       │  BAC-01 sàn × (sâu / 3,2)     │
       ●──────── BAC-03 tường lót ────● (gian hồi) / BAC-18 bức bàn (gian mặt tiền)
```

**BAC-R2 · Gian thờ ba tượng (rộng 3 gian = 9,6 m):** BAC-29 bệ (co ngang 9,0 m) + 3 tượng Meshy trên `S-BAN` cách nhau 3,0 m (hoặc 6,5 m như `interior.js` khi rộng 21 m) + vầng hào quang (vòng `RingGeometry` như hiện có) + BAC-15 tảo tỉnh ở gian giữa + BAC-30 bàn lễ cách bệ 4,2 m + BAC-31 hương án + BAC-33 × 2 + BAC-35 × 3 + 2 đèn `nen`.

**BAC-R3 · Tàng kinh một gian:** BAC-40 kệ × 2 sát hai tường + BAC-42 án thư giữa + BAC-41 rương × 1 + BAC-49 giá đèn + lối giữa 1,2 m.

**BAC-R4 · Lầu chuông tầng 2:** BAC-02 sàn + BAC-50 lan can 4 mặt (chừa miệng thang KT-20) + khung treo chuông (BAC-16 rút gọn) + chuông `prop_bell_bronze` (08-02 §10) + chày gỗ treo xích.

---

## 4. MOD-GNA — Đạo quán Giang Nam

**Nguyên mẫu:** Mao Sơn Cửu Tiêu Vạn Phúc cung, Thiên Sư Phủ Long Hổ (phủ đệ Huy – Cám), nhà vườn thủy hương Giang Nam: tường trắng, chân đá xanh, cột gỗ trầm, xà cong «nguyệt lương», cửa bức bàn chạm hoa mảnh, giếng trời, cửa động tròn.

**Dùng ở (đang có):** ba trà lâu và thủy tạ Cùng Thông Hồ (INT-CT-*), Lưng Chừng Quán (INT-NUI-LUNGCHUNG, phối với MOD-DAN). **Dự kiến:** Mao Sơn, Long Hổ.

### 4.1 Bảng màu

| Bảng | Tường | Gỗ | Ngói / sẫm | Đá xanh | Nhấn | Nguồn |
|---|---|---|---|---|---|---|
| `maoshan` | `#F0EEE8` | `#4A3426` | `#2A2B2E` | `#5B6670` | đồng `#B8923A`, lục trúc `#6D9B57` | bảng khóa Mao Sơn |
| `longho` | `#EDEBE4` | đỏ trầm `#7A2A1E` | `#3B3D40` | `#5E6A60` | lục rêu `#4E6B45`, đan hà `#B5523B` | bảng khóa Long Hổ |
| `cungthong` | `#ECE8DE` | `#5C4030` | `#3A3C40` | `#55606A` | lam hồ `#3D6A8A`, sen `#E8A1B4` | đề xuất (hồ Điều Hậu) |

### 4.2 Bảng mảnh

| Mã | Tên | Kích thước | Vật liệu · màu | Tam giác | Va chạm | Khớp | Móc | Dùng ở |
|---|---|---|---|---|---|---|---|---|
| MOD-GNA-01 | Sàn đá xanh «thanh thạch» | 3,2 × 0,1 × 3,2 (tấm 0,8 × 1,6) | `stone` đá xanh | 12 | N | S-SAN | `floor:da` | sảnh dưới, giếng trời |
| MOD-GNA-02 | Sàn gạch lục giác | 3,2 × 0,1 × 3,2 | `stone` gạch xám | 12 | N | S-SAN | `floor:da` | hành lang |
| MOD-GNA-03 | Sàn ván thông | 3,2 × 0,12 × 3,2 | `wood` mộc | 12 | N | S-SAN | `floor:go` | lầu trà, gác |
| MOD-GNA-04 | Tường lót trắng vôi chân đá xanh | 3,2 × C biến × 0,14 | `stone` vôi + chân 0,6 m đá xanh | 32 | Đ | S-TUONG → S-VACH | — | mọi khoang |
| MOD-GNA-05 | Tường trắng có lậu song hoa | 3,2 × C biến × 0,14, ô 1,2 × 1,2 cao 1,4 | `stone` + `trim` ngói xếp hoa alpha | 140 | Đ + `window` | S-TUONG | — | tường vườn, hành lang |
| MOD-GNA-06 | Cửa động tròn | tường 3,2 có ô Ø 2,4 | `stone` + viền gạch | 200 | C (`open`) | S-TUONG | — | nối sân – vườn – sảnh |
| MOD-GNA-07 | Cửa động hình bình | tường 3,2 có ô 1,4 × 2,6 | như trên | 180 | C (`open`) | S-TUONG | — | |
| MOD-GNA-08 | Cột gỗ trầm Ø 0,36 | 0,36 × C biến (3,2–5,6) | `wood` nâu sẫm | 96 | T 0,32 | S-COT | — | |
| MOD-GNA-09 | Chân tảng bầu đá xanh | Ø 0,6 × 0,4 | `stone` | 80 | (gộp cột) | S-COT | — | |
| MOD-GNA-10 | Xà cong «nguyệt lương» | 3,2 × 0,5 × 0,3 | `wood` chạm mây | 160 | X | S-TRAN | — | sảnh, trà lâu |
| MOD-GNA-11 | Ngưu thoái (thanh chống chạm) | 0,9 × 1,2 × 0,15 | `wood` chạm alpha | 16 | — | đầu cột hiên | — | hiên |
| MOD-GNA-12 | Trần ván lộ rui | 3,2 × 0,3 × 3,2 | `wood` | 60 | X | S-TRAN | — | gác |
| MOD-GNA-13 | Giếng trời (thiên tỉnh) | 3,2 × 0 × 3,2 — ô trần mở + bể đá dưới | `stone` | 120 | N (viền) + T (bể) | S-TRAN + S-SAN | `portal:sky` | phủ đệ, Lưng Chừng Quán |
| MOD-GNA-14 | Khung bức bàn hoa 6 tấm | 3,2 × 3,2 × 0,2 | `wood` trầm + `fabric` giấy | 150 | C | S-CUA | `door:bucban` | mặt tiền sảnh |
| MOD-GNA-15 | Tấm bức bàn hoa đơn | 0,53 × 3,2 × 0,05 | `wood` lưới «băng liệt» alpha | 24 | — | trong GNA-14 | `door:leaf` | |
| MOD-GNA-16 | Cửa hai cánh gỗ trầm (phủ đệ) | 2,8 × 3,4 × 0,1 | `wood` + vòng gõ `metal` | 80 | — | S-CUA | `door:canh2` | nghi môn, đại đường |
| MOD-GNA-17 | Khung cửa gạch xám đầu vòm | 3,2 × 3,6 × (tường + 0,2) | `stone` gạch + `trim` | 220 | C | S-CUA | — | che vết cắt |
| MOD-GNA-18 | Cửa sổ chống (trích song) | 1,6 × 1,2 × 0,1 | `wood` + giấy | 40 | — (`window`) | S-CUA | `window:open` | lầu trà (mở ra nhìn hồ) |
| MOD-GNA-19 | Lan can «mỹ nhân kháo» | 3,2 × 0,9 × 0,5 (lưng cong) | `wood` | 220 | Đ | mép sàn | `seat` | trà lâu, hành lang nước |
| MOD-GNA-20 | Bàn phù (thư án vẽ phù) | 2,0 × 0,8 × 0,8 | `wood` sẫm | 300 | H | S-PHU → S-BAN | `talisman` | phòng phù (Mao Sơn, Long Hổ) |
| MOD-GNA-21 | Bộ bàn phù (bút lông, nghiên chu sa, giấy vàng) | 0,8 × 0,15 × 0,5 | `wood` + `fabric` + đỏ chu sa `#B5231A` | 400 | — | S-BAN | `talisman` | ký tự hư cấu (trụ cột T6) |
| MOD-GNA-22 | Tủ lệnh bài | 1,6 × 2,2 × 0,5 | `wood` đỏ trầm + `metal` | 380 | H | S-TUONG | `token` | Thiên Sư Phủ |
| MOD-GNA-23 | Giá kiếm gỗ đào thất tinh | 1,2 × 1,0 × 0,4 | `wood` đào + `metal` | 260 | H | S-PHU | `view` | |
| MOD-GNA-24 | Gương bát quái treo | Ø 0,5 | `metal` + `trim` | 120 | — | S-VACH (trên cửa) | `view` | |
| MOD-GNA-25 | Chuông tam thanh cầm tay (đế chung) | 0,15 × 0,3 | `metal` | 200 | — | S-BAN | `bell_hand` | |
| MOD-GNA-26 | Thần khám Giang Nam | 2,4 × 3,6 × 1,4 | `wood` trầm chạm mỏng + màn | 1.100 | H | S-SAN → S-KHAM | `shrine` | |
| MOD-GNA-27 | Điều án (bàn thờ dài hẹp) | 3,6 × 1,0 × 0,6 | `wood` | 80 | H | S-TUONG → S-BAN | `altar` | gian giữa phủ đệ, Lưng Chừng Quán |
| MOD-GNA-28 | Bát tiên trác | 1,0 × 0,85 × 1,0 | `wood` | 120 | H | S-PHU → S-BAN | `tea` | trà lâu |
| MOD-GNA-29 | Ghế quan mạo | 0,6 × 1,1 × 0,5 | `wood` | 200 | — (người xuyên ghế khi ngồi) | S-PHU | `seat` | |
| MOD-GNA-30 | Trà cụ (ấm, chén, khay) | 0,5 × 0,15 × 0,35 | gốm `trim` | 300 | — | S-BAN | `tea` → `tea-therapy › teaTherapy` | trà lâu, Trà Thất |
| MOD-GNA-31 | Lò than đun trà | 0,4 × 0,5 × 0,4 | `stone` + `emissive` than | 150 | T 0,3 | S-PHU | `light:bep` + `khoi` | trà lâu |
| MOD-GNA-32 | Bình phong thủy mặc | 2,4 × 2,0 × 0,1 | `wood` + `fabric` tranh | 60 | Đ | S-PHU | `label` (đề thơ) | |
| MOD-GNA-33 | Bồn cảnh đá | 0,8 × 0,9 × 0,6 | `stone` + cây | 700 | T 0,4 | S-PHU / S-BAN | `view` → `plant-fs › plantFengShui` | thủy tạ, sảnh |
| MOD-GNA-34 | Đôn sứ | Ø 0,4 × 0,45 | gốm lam trắng | 120 | — | S-PHU | `seat` | |
| MOD-GNA-35 | Đa bảo các (kệ trưng) | 1,6 × 2,0 × 0,4 | `wood` | 300 | H | S-TUONG | `book` / `view` | |
| MOD-GNA-36 | Đèn lồng giấy tròn | Ø 0,6 | `fabric` + `emissive` | 120 | — | S-TREO | `light:denlong` | |
| MOD-GNA-37 | Đèn đứng chụp lụa | 0,4 × 1,5 × 0,4 | `wood` + `fabric` | 160 | T 0,2 | S-PHU | `light:dendau` | |
| MOD-GNA-38 | Tranh trục sơn thủy | 0,8 × 2,0 | `fabric` | 4 | — | S-VACH | `label` | |
| MOD-GNA-39 | Câu đối gỗ khắc | 0,35 × 2,6 × 0,04 | `wood` + chữ canvas | 12 | — | S-VACH (hai bên cửa) | `label` | |
| MOD-GNA-40 | Biển ngang gỗ đen chữ vàng | 2,4 × 0,8 × 0,08 | `wood` + `metal` | 12 | — | S-VACH | `label` | |
| MOD-GNA-41 | Mành trúc | 1,6 × 2,0 | `fabric` trúc alpha | 40 | — | S-CUA | `door:rem` | trà lâu |
| MOD-GNA-42 | Chum / vại sân | Ø 0,7 × 0,8 | gốm nâu | 96 | T 0,4 | S-PHU | — | |
| MOD-GNA-43 | Bể sen đá giếng trời | 1,6 × 0,6 × 1,6 | `stone` + mặt nước | 200 | H | dưới GNA-13 | `view` | |
| MOD-GNA-44 | Thang gỗ hẹp lên gác | 1,2 × 3,2 × 3,2 (0,25 / 0,25) | `wood` | 220 | B | S-THANG | — | trà lâu, Lưng Chừng Quán |
| MOD-GNA-45 | Hành lang mái «du lang» một gian | 3,2 × 3,4 × 3,2 (sàn, 2 cột, mái nhỏ) | `wood` + `stone` + ngói | 600 | N + T | S-SAN | `seat` (lan can) | nối các khoang trong vườn |
| MOD-GNA-46 | Bậc đá xanh | 3,2 × 0,2 × 0,4 | `stone` | 12 | B | S-THANG | — | |
| MOD-GNA-47 | Phướn trừ tà vàng chữ đỏ (ký tự hư cấu) | 0,6 × 2,4 | `fabric` | 32 | — | S-TREO | `sway` | Mao Sơn |
| MOD-GNA-48 | Kệ tre phơi dược / giấy phù | 2,4 × 1,8 × 0,6 | `wood` tre | 260 | H | S-TUONG | `view` | sân sau |

### 4.3 Công thức lắp chuẩn

**GNA-R1 · Sảnh trà lâu (một gian 3,2 × 6,4):** GNA-03 sàn + GNA-19 lan can mỹ nhân kháo mặt nước + GNA-28 bát tiên trác + GNA-29 × 4 + GNA-30 trên bàn + GNA-31 lò than ở góc + GNA-36 đèn treo + GNA-41 mành trúc ở cửa ra ban công.

**GNA-R2 · Giếng trời phủ đệ:** GNA-13 (ô trần mở 3,2 × 3,2) + GNA-43 bể sen dưới + 4 cột GNA-08 quanh + hiên GNA-45 bốn phía. Giếng trời là cửa nhìn `sky` ra ngoài: ánh trời rọi thẳng (`troi`), mưa (khi có hệ thời tiết) rơi vào bể.

**GNA-R3 · Phòng phù:** GNA-20 bàn + GNA-21 bộ bàn phù + GNA-22 tủ lệnh bài sau lưng + GNA-24 gương trên cửa + GNA-47 phướn + đèn `dendau`. Hoạt động «Kết phù» do tài liệu 09 cấp mã MG.

---

## 5. MOD-VIE — Chùa Việt

**Nguyên mẫu:** chùa Bắc Bộ (Bút Tháp, Tây Phương, chùa Yên Tử): kết cấu gỗ lim, **vì kèo chồng rường – giá chiêng**, cột kê chân tảng (không chôn), cốn và bẩy **chạm thủng**, nền gạch bát, mái thấp xòe; hệ tượng tam bảo nhiều lớp, La Hán sơn son thếp vàng nét mặt sống động; gác chuông, đại hồng chung.

**Dùng ở:** dự kiến Yên Tử Trúc Lâm, Bút Tháp Tịnh Độ (mã `BLD-*` tài liệu 07). Chưa có công trình chùa Việt trong game.

### 5.1 Bảng màu

| Bảng | Gỗ lim | Ngói / đỏ | Son thếp | Nền | Nhấn | Nguồn |
|---|---|---|---|---|---|---|
| `yentu` | `#5A3826` | `#8B3A2B` | `#A87B3D` (đồng) | `#9A968C` | lục tùng `#2F4F3A` | bảng khóa Yên Tử |
| `buttap` | `#4F3020` | `#9A4130` | `#B8862B` | gạch bát `#A0563A` | sen `#E8A1B4`, lục `#4F7A3E` | bảng khóa Bút Tháp |

### 5.2 Bảng mảnh

| Mã | Tên | Kích thước | Vật liệu · màu | Tam giác | Va chạm | Khớp | Móc | Dùng ở |
|---|---|---|---|---|---|---|---|---|
| MOD-VIE-01 | Sàn gạch bát | 3,2 × 0,08 × 3,2 (viên 0,3) | `stone` gạch đỏ | 12 | N | S-SAN | `floor:da` | mọi điện chùa |
| MOD-VIE-02 | Nền lát đá sân chùa | 3,2 × 0,1 × 3,2 | `stone` xám | 12 | N | S-SAN | `floor:da` | sân trong «nội công» |
| MOD-VIE-03 | Cột lim Ø 0,45 | 0,45 × C biến (3,2–5,6) | `wood` lim | 112 | T 0,4 | S-COT | `fadeable` | |
| MOD-VIE-04 | Cột cái Ø 0,55 | 0,55 × C biến (5,6–7,2) | `wood` lim | 128 | T 0,5 | S-COT | `fadeable` | thượng điện |
| MOD-VIE-05 | Chân tảng hoa sen | Ø 0,9 × 0,3 | `stone` | 140 | (gộp cột) | S-COT | — | |
| MOD-VIE-06 | Vì kèo chồng rường – giá chiêng | 6,4 × 3,4 × 0,4 (một vì) | `wood` lim chạm | 2.400 | X | S-TRAN (trên hai cột cái) | — | gian giữa |
| MOD-VIE-07 | Vì kèo kẻ chuyền | 6,4 × 3,0 × 0,35 | `wood` lim | 1.200 | X | S-TRAN | — | gian bên, hồi |
| MOD-VIE-08 | Cốn chạm thủng | 2,0 × 1,2 × 0,08 | `wood` alpha (rồng, mây, lá) | 8 | — | giữa cột | — | |
| MOD-VIE-09 | Bẩy hiên chạm | 1,6 × 1,0 × 0,15 | `wood` alpha | 16 | — | đầu cột hiên | — | |
| MOD-VIE-10 | Xà nách / xà thượng | 3,2 × 0,35 × 0,25 | `wood` | 24 | X | S-TRAN | — | |
| MOD-VIE-11 | Rui mè lộ (trần hở mái) | 3,2 × 0,6 × 3,2 (dốc) | `wood` + mặt dưới ngói | 120 | X | S-TRAN | — | mọi điện (chùa Việt không trần ô cờ) |
| MOD-VIE-12 | Tường hồi gạch quét vôi vàng | 3,2 × C biến × 0,3 | `stone` vôi `#D8C27A` | 24 | Đ | S-TUONG | — | |
| MOD-VIE-13 | Bức bàn ván lim «thượng song hạ bản» | 3,2 × 2,8 × 0,15 | `wood` lim (nửa trên song, nửa dưới ván) | 140 | C | S-CUA | `door:bucban` | mặt tiền điện |
| MOD-VIE-14 | Tấm bức bàn đơn | 0,8 × 2,8 × 0,05 | `wood` | 24 | — | trong VIE-13 | `door:leaf` | |
| MOD-VIE-15 | Cửa võng sơn son thếp vàng | 3,2 × 2,4 × 0,15 (khung võng chạm) | `wood` son + `metal` thếp | 900 | — (`open`) | S-TREO (giữa cột cái) | — | trước tam bảo |
| MOD-VIE-16 | Khung cửa tam quan nhỏ | 2,4 × 3,0 × (tường + 0,2) | `wood` + `stone` | 220 | C | S-CUA | — | |
| MOD-VIE-17 | Cửa sổ song tiện | 1,2 × 0,8 × 0,15 | `wood` song tròn | 90 | — (`window`) | S-CUA | — | |
| MOD-VIE-18 | Cửa sổ tròn chữ Thọ | Ø 1,0 | `wood` alpha | 60 | — (`window`) | S-CUA | — | gác chuông |
| MOD-VIE-19 | Tượng Tam Thế (bộ ba) | 4,8 × 2,4 × 1,2 trên bệ | `wood` son thếp — **Meshy, duyệt nội dung** | 3 × 15.000 | H | S-BAN (bệ cao) | `shrine` | thượng điện |
| MOD-VIE-20 | Tượng A Di Đà tam tôn | 4,8 × 3,0 × 1,4 | như trên | 3 × 15.000 | H | S-BAN | `shrine` | Bút Tháp |
| MOD-VIE-21 | Tòa Cửu Long (Thích Ca sơ sinh) | 2,0 × 2,6 × 1,4 | như trên | 18.000 | H | S-BAN | `shrine` | |
| MOD-VIE-22 | Khám La Hán | 1,0 × 1,8 × 0,8 | `wood` | 400 | H | S-TUONG (dọc hành lang) | `shrine` | dải vũ |
| MOD-VIE-23 | Tượng La Hán gỗ (18 biến thể đầu / tay) | 0,8 × 1,4 × 0,8 | `wood` son thếp | 6.000 | (trong khám) | S-KHAM | `view` | dải vũ, hành lang |
| MOD-VIE-24 | Bệ tam bảo nhiều cấp | 6,4 × 2,4 × 4,8 | `wood` son thếp | 300 | H | S-SAN → S-BAN | `altar` | |
| MOD-VIE-25 | Hương án lim chạm | 2,4 × 1,1 × 0,9 | `wood` lim | 600 | H | S-PHU → S-BAN | `incense` | |
| MOD-VIE-26 | Đỉnh đồng chùa | 0,7 × 0,9 × 0,7 | `metal` đồng `#A87B3D` | 900 | — | S-BAN | `incense` + `khoi` | |
| MOD-VIE-27 | Hạc đứng lưng rùa | 0,6 × 1,8 × 0,8 (một con) | `metal` đồng | 1.400 | T 0,35 | S-PHU (hai bên hương án) | `view` | |
| MOD-VIE-28 | Mõ lớn trên giá | 0,9 × 0,9 × 0,8 | `wood` son | 400 | H | S-PHU | `muyu` | |
| MOD-VIE-29 | Chuông gia trì (chuông bát) | Ø 0,5 trên đệm | `metal` | 300 | — | S-PHU / S-BAN | `bell_bat` | |
| MOD-VIE-30 | Đại hồng chung | Ø 1,4 × 2,2 | `metal` đồng (Meshy) | 6.000 | (treo cao) | S-TREO (khung gác chuông) | `bell` (đồng bộ MMO) | gác chuông |
| MOD-VIE-31 | Khánh đồng treo | 1,0 × 0,6 | `metal` | 300 | — | S-TREO | `qing` | |
| MOD-VIE-32 | Trống bát nhã trên giá | Ø 1,2 × 1,6 | `wood` + da | 900 | H | S-PHU | `drum` | |
| MOD-VIE-33 | Bàn thờ Mẫu (điện Mẫu, khu phụ) | 2,4 × 1,6 × 1,2 | `wood` son + `fabric` đỏ | 700 | H | S-SAN → S-BAN | `shrine` | khu phụ (tài liệu tổng §8.3) |
| MOD-VIE-34 | Ban thờ Tổ (bài vị) | 2,4 × 2,0 × 1,0 | `wood` | 500 | H | S-TUONG → S-BAN | `shrine` | nhà Tổ |
| MOD-VIE-35 | Chiếu cói trải sàn | 1,6 × 0,02 × 3,2 | `fabric` cói | 2 | — | S-SAN | `floor:chieu` + `seat` | điện, tăng phòng |
| MOD-VIE-36 | Tọa cụ thiền | Ø 0,6 × 0,12 | `fabric` | 48 | — | S-PHU | `seat:thien` | thiền đường |
| MOD-VIE-37 | Kinh án thấp với kinh mở | 1,0 × 0,35 × 0,5 | `wood` + giấy | 300 | — | S-PHU | `book` → `remedy-fate › JING_ZHOU` | |
| MOD-VIE-38 | Dàn nến cầu an | 1,6 × 1,2 × 0,5 | `metal` + `emissive` | 400 | H | S-PHU | `light:nen` + `lamp` | |
| MOD-VIE-39 | Hoành phi sơn son thếp vàng | 2,4 × 0,8 × 0,1 | `wood` + chữ canvas | 12 | — | S-VACH | `label` | |
| MOD-VIE-40 | Cuốn thư | 1,6 × 0,8 × 0,1 (cong) | `wood` | 60 | — | S-VACH | `label` | |
| MOD-VIE-41 | Tòa Cửu phẩm liên hoa (bát giác 9 tầng quay) | Ø 3,2 × 8,0 | `wood` son thếp — hero | 18.000 | T 1,7 | S-SAN (giữa điện) | `spin` (quay theo công đức) | Bút Tháp (tài liệu tổng §7.6) |
| MOD-VIE-42 | Lan can đá cầu chạm | 2,0 × 0,9 × 0,25 | `stone` chạm | 300 | Đ | mép cầu | — | cầu đá Bút Tháp |
| MOD-VIE-43 | Bậc đá hiên | 3,2 × 0,2 × 0,6 | `stone` | 12 | B | S-THANG | — | |
| MOD-VIE-44 | Cờ giới ngũ sắc | 0,6 × 2,2 | `fabric` | 32 | — | S-TREO | `sway` | |
| MOD-VIE-45 | Đèn lồng vải đỏ | Ø 0,5 × 0,7 | `fabric` + `emissive` | 120 | — | S-TREO | `light:denlong` | |
| MOD-VIE-46 | Bình hoa sen gốm | 0,35 × 0,6 | gốm | 300 | — | S-BAN | `offer` | |
| MOD-VIE-47 | Chum nước mưa | Ø 0,9 × 1,0 | gốm nâu | 120 | T 0,5 | S-PHU (hiên) | — | |
| MOD-VIE-48 | Bia đá chùa trên rùa | 1,0 × 2,2 × 1,6 | `stone` + chữ canvas | 900 | H | S-PHU | `stele` | |
| MOD-VIE-49 | Giường thiền gỗ | 1,0 × 0,5 × 2,0 | `wood` + chiếu | 120 | H | S-PHU | `seat` | tăng phòng |

### 5.3 Công thức lắp chuẩn

**VIE-R1 · Thượng điện (3 gian × 2 vì):** VIE-04 cột cái × 4 + VIE-03 cột quân × 8 + VIE-06 vì giữa × 2 + VIE-07 vì hồi × 2 + VIE-11 rui lộ toàn trần + VIE-24 bệ tam bảo + VIE-19 Tam Thế trên cùng, VIE-20 A Di Đà tam tôn lớp giữa, VIE-21 Cửu Long lớp dưới + VIE-15 cửa võng trước bệ + VIE-25 hương án + VIE-26 đỉnh + VIE-27 đôi hạc + VIE-35 chiếu + VIE-28 mõ + VIE-29 chuông gia trì bên phải bệ (đúng vị trí người chủ lễ).

**VIE-R2 · Dải vũ (hành lang La Hán, mỗi gian 3,2):** VIE-03 cột × 2 + VIE-11 rui + VIE-22 khám × 2 + VIE-23 La Hán × 2 (biến thể theo chỉ số gian) + đèn `nen` mỗi 3 gian.

**VIE-R3 · Gác chuông hai tầng:** tầng 1 thờ (VIE-34 rút gọn) + thang gỗ (KT-15) + tầng 2: khung treo + VIE-30 đại hồng chung + chày gỗ treo + VIE-18 cửa sổ tròn bốn mặt.
