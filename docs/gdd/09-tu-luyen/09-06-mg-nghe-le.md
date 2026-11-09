# 09-06 · Mini-game III — Thiên nhiên, Nghề và Lễ (MG-13 … MG-18)

> Sáu mini-game gắn với đất trời và đôi tay: hái thuốc theo mùa, pha trà, luyện đan, thả đèn, đánh chuông giờ, vẽ mạn-đà-la. Mỗi game theo **đúng mẫu 14 mục** ở `09-03` §13.1; con số B / NK / `s_min` / bậc mở / iOS lấy từ bảng chủ `09-03` §6; công thức Đạo Hạnh ở `09-03` §2.2. Điều khiển chung (§13.2), trợ năng chung (§13.3), chống gian chung (§12) và bộ sự kiện đo lường chung (§13.5) **không nhắc lại**.
>
> Ví dụ số dùng `MAU-A` (Tiềm Lực 41 → NT 1,19; Dụng Thủy, Hỷ Kim). Mức tinh thông Sơ / Trung / Thâm / Viên Thông là Tu độ đạo thống của nơi chơi (`09-03` §11.2); nơi trung lập dùng **Tu độ chung** = tổng thô của mọi lượt MG đó (Sơ < 100 · Trung ≥ 100 · Thâm ≥ 400 · Viên Thông ≥ 1.200).

**Mục lục**

| Mã | Tên | Nhóm | Mở | Mục |
|---|---|---|---|---|
| `MG-13` | Hái Thuốc Tứ Thời | Thân | bậc 1 | §1 |
| `MG-14` | Pha Trà Thất Bộ | Tĩnh | bậc 1 | §2 |
| `MG-15` | Luyện Đan Cửu Chuyển (hư cấu) | Nghệ | bậc 3 | §3 |
| `MG-16` | Thả Đèn Hoa Đăng | Lễ | bậc 1 (web) | §4 |
| `MG-17` | Thần Chung Mộ Cổ | Lễ | bậc 1 | §5 |
| `MG-18` | Họa Luân Mạn-đà-la | Nghệ | bậc 1 | §6 |

---

## 1. `MG-13` · Hái Thuốc Tứ Thời

### 1.1 Mục đích

Đưa người chơi **ra khỏi sân quán**, đi khắp thế giới theo nhịp mùa thật và giờ thật. Hái thuốc là lý do để leo núi Võ Đang lúc giờ Mão, xuống bờ Cùng Thông Hồ lúc hè, vào rừng ẩm Miêu Cương mùa mưa. Đồng thời dạy một điều cổ pháp nói rõ: **mỗi hành có mùa của nó** (Mộc–Xuân, Hỏa–Hạ, Thổ–Trường hạ, Kim–Thu, Thủy–Đông). Trụ cột: T4 (thế giới thật, đi bộ), T5 (đúng mùa theo Nội Kinh), T6 (hái bền vững, không tận diệt).

### 1.2 Engine dạy

| Nội dung | Nguồn | Dùng thế nào |
|---|---|---|
| Ngũ hành ↔ tạng ↔ vị ↔ sắc ↔ mùa | `tcm › WUX_ZANG[wx].season, .wei, .se` | gán mỗi vị thuốc một hành, mùa vượng |
| Thực phẩm dưỡng tạng | `tcm › WUX_ZANG[wx].nourish`, `tcm › DIET[wx]` | **danh sách vị** trong game lấy từ đúng các món app đã nêu |
| Lời khuyên theo mùa của người chơi | `tcm › seasonalHealth(monthZhi, R)` | thẻ «Mùa này nên hái gì cho mình» trong Dược Lâu |
| 12 canh giờ ↔ tạng | `tcm › MERIDIAN_CLOCK`, `meridianClock(hourZhi)` | quy ước giờ hái (§1.3) và câu giảng khi hái |
| Tiết khí thật | `lunar-javascript` (đã dùng trong `zheri-case.js`) | xác định mùa của ngày thật |

Phần hư cấu: vị trí cây trên bản đồ, quy ước «giờ hái» theo bộ phận cây (là quy ước game, ghi rõ trong sổ), hệ số bền vững.

### 1.3 Luật chơi

1. Mỗi vùng có **điểm thuốc** (cụm cây) theo sinh cảnh. Một điểm có **3 phần** (3 cây / 3 khóm).
2. Đi tới điểm, tương tác → màn hái: chọn **bộ phận** (lá / hoa / quả hạt / rễ củ) và **số phần** muốn hái (1–3).
3. Quy tắc «**hái một phần ba**»: hái 1 phần = bền vững; 2 phần = chấp nhận được; 3 phần = tận thu → điểm thuốc khô 3 ngày thật.
4. **Đúng mùa:** vị thuộc hành đang vượng theo tiết khí thật mọc dày (3 phần) và cho chất lượng cao; trái mùa chỉ mọc thưa (1 phần), chất lượng thấp.
5. **Đúng giờ (quy ước game):** hoa hái giờ Mão–Thìn (khi hoa vừa nở); lá hái giờ Tỵ–Ngọ (sương đã tan); quả hạt hái giờ Mùi–Thân; rễ củ hái giờ Dậu–Tuất. Ngoài giờ vẫn hái được, chỉ mất điểm «đúng giờ».
6. Mỗi ngày tính thưởng cho **6 cây** đầu tiên (thô 1 / cây); hái thêm vẫn vào kho, không thêm thô.
7. Vị hái được vào **Dược Lâu** (kho, tối đa 40 phần), dùng cho `MG-07` (bốc thuốc) và `MG-15` (luyện đan). Phần quá hạn 30 ngày thật thì khô thành «dược trà» (chỉ pha `MG-14`).

**Danh mục vị (24 vị bản đầu — mỗi vị đều có trong `WUX_ZANG[].nourish` hoặc `DIET`):**

| Hành / mùa vượng | Vị | Bộ phận | Sinh cảnh / vùng mọc nhiều | Ghi chú trong sổ |
|---|---|---|---|---|
| Mộc / Xuân | Rau ngót | lá | vườn ngoại ô Huyền Thành | «bổ can huyết» (theo `WUX_ZANG.木.nourish`) |
| Mộc / Xuân | Rau má | lá | bờ ruộng Lịch Đường, Cùng Thông Hồ | |
| Mộc / Xuân | Atiso | hoa | sườn đồi Trích Thiên Đỉnh | |
| Mộc / Xuân | Chanh | quả | vườn Am Vân Cốc | vị chua → can (`DIET.木`) |
| Mộc / Xuân | Sấu | quả | Huyền Thành | |
| Hỏa / Hạ | Tim sen (liên tử tâm) | hạt | hồ sen Bút Tháp, Cùng Thông Hồ | «dưỡng tâm an thần» |
| Hỏa / Hạ | Long nhãn | quả | vườn Miêu Cương | |
| Hỏa / Hạ | Hạt sen | hạt | Cùng Thông Hồ | |
| Hỏa / Hạ | Đậu đỏ | hạt | ruộng Huyền Thành | sắc đỏ → tâm (`DIET.火`) |
| Thổ / Trường hạ | Khoai lang | củ | ruộng Lịch Đường | «kiện tỳ vị» |
| Thổ / Trường hạ | Ý dĩ | hạt | ruộng Miêu Cương | |
| Thổ / Trường hạ | Táo đỏ | quả | Tử Bình Phong | |
| Thổ / Trường hạ | Gừng | củ | Võ Đang chân núi | |
| Kim / Thu | Lê | quả | vườn Văn Miếu | «nhuận phổi» |
| Kim / Thu | Bách hợp | củ | sườn Chung Nam | |
| Kim / Thu | Mộc nhĩ trắng | thể nấm | rừng ẩm Mao Sơn | |
| Kim / Thu | Hạnh nhân | hạt | Manh Phái Cốc | |
| Kim / Thu | Củ cải trắng | củ | Huyền Thành | vị cay → phế (`DIET.金`) |
| Thủy / Đông | Đậu đen | hạt | ruộng Phong Thủy Viên | «bổ thận tinh» |
| Thủy / Đông | Vừng đen | hạt | Thư Lâu Lâm | |
| Thủy / Đông | Hạt óc chó | hạt | Võ Đang | |
| Thủy / Đông | Củ mài (sơn dược) | củ | Võ Đang, Yên Tử | |
| Thủy / Đông | Dâu tằm | quả | Bút Tháp | |
| Thủy / Đông | Kỷ tử | quả | Tạng Địa (sườn thấp) | xuất hiện ở cả `.木.nourish` và `.水.nourish` → gắn Thủy, ghi chú «cũng dưỡng can» |

**Mùa theo tiết khí thật:** Xuân = Lập Xuân → trước Lập Hạ; Hạ = Lập Hạ → trước Đại Thử; **Trường hạ** = Đại Thử → trước Lập Thu (tháng Mùi cuối hạ, khớp «Trường hạ (cuối hạ)» của `WUX_ZANG.土.season`); Thu = Lập Thu → trước Lập Đông; Đông = Lập Đông → trước Lập Xuân. Ghi chú thiết kế: cổ pháp còn có thuyết «Thổ vượng 18 ngày cuối mỗi mùa»; bản này chọn thuyết Trường hạ để khớp engine, ghi nguồn trong sổ.

### 1.4 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Tương tác điểm thuốc (trong 2 m) | chạm biểu tượng lá trên đầu cụm cây | `E` | nhấp cụm cây |
| Chọn bộ phận | chạm 1 trong 4 thẻ | `1`–`4` | nhấp |
| Chọn số phần | kéo thanh 1–3 hoặc chạm số | `←` `→` | kéo / nhấp |
| Hái | giữ nút «Hái» 1 giây (tránh chạm nhầm) | giữ `Space` 1 s | giữ nút trái |
| Bỏ đi | nút «Để lại» | `Esc` | nút |
| Mở Dược Lâu | biểu tượng giỏ ở góc | `I` | nhấp |

### 1.5 Bố cục giao diện

```
┌───────────────────────────────────────────────┐
│ Võ Đang · chân núi Tử Tiêu · giờ Dậu · tiết Sương Giáng │
│                                               │
│   [ Lá ]  [ Hoa ]  [ Quả/hạt ]  [ Rễ/củ ✓ ]      │
│                                               │
│   Củ mài (山藥) · Thủy · vị ngọt · sắc trắng      │
│   ●●○  còn 3 phần · hái:  [1]  2   3            │
│   «Hái một, để hai — mùa sau còn có mà hái.»     │
│                                               │
│   Đúng mùa ✓ (Đông sắp tới — Thủy đang lên)     │
│   Đúng giờ ✓ (rễ củ: Dậu–Tuất)                  │
│                                               │
│            [ Giữ để hái ]      [ Để lại ]        │
│ Hôm nay: 4/6 cây tính thưởng · Dược Lâu 22/40    │
└───────────────────────────────────────────────┘
```

Bản đồ: bậc 2 trở lên có «Thần thức sơ khai» (`09-01` §6.1) — cụm cây trong bán kính 15 m có ánh sáng nhẹ màu hành của vị.

### 1.6 Đường cong độ khó

| Mức | Gợi ý trên màn hái | Điểm thuốc | Đặc biệt |
|---|---|---|---|
| Sơ | hiện sẵn ✓ / ✗ «đúng mùa / đúng giờ», tên vị đầy đủ | gần đường đi | — |
| Trung | chỉ hiện tên vị và hành; người chơi tự nhớ mùa, giờ | thêm điểm trên sườn núi | có **vị giống nhau** (vd củ mài và một củ dại không ăn được) — phải đọc kỹ mô tả để không nhầm |
| Thâm | chỉ hiện hình cây; tên hiện sau khi hái | điểm ẩn sâu (hang Võ Đang, đảo nhỏ Cùng Thông Hồ) | thời tiết (mưa ⇒ giờ hái lá lùi 1 canh) |
| Viên Thông | không gợi ý | điểm theo **tiết khí** cụ thể (vd Kỷ tử chỉ chín đẹp từ Hàn Lộ đến Lập Đông) | ghi chép Dược Chí: viết 1 dòng nhận xét về vị, được hiện trong sổ của người khác (kiểm duyệt) |

Theo bậc: bậc 1 chỉ vùng cũ (Huyền Thành và 7 vùng sảnh nghề); bậc 2 thêm 3 thánh địa gần; vùng mở theo `09-01` §6.2.

### 1.7 Chấm điểm (mỗi cây)

```
m = 1 nếu hành của vị vượng theo tiết khí hôm nay, 0,4 nếu trái mùa
g = 1 nếu đúng giờ của bộ phận, 0,5 nếu lệch 1 canh, 0 nếu lệch xa hơn
b = 1 (hái 1 phần) · 0,6 (2 phần) · 0 (3 phần, tận thu)
n = 1 nếu chọn đúng bộ phận làm thuốc của vị, 0 nếu sai (vd hái lá của cây củ mài)
s = n × (0,40·m + 0,20·g + 0,40·b)
thô (mỗi cây trong 6 cây đầu) = 1 × f(s) × K_hư         (không có K_lặp: đã giới hạn 6 cây)
```

`s_min` = — (không có ngưỡng; `f(s)` dùng nhánh `0,3 + 0,7·s` với mọi `s > 0`; `n = 0` → `s = 0` → `f = 0,15`).

**Ví dụ (`MAU-A`, Võ Đang, tháng 11 dương — tiết Lập Đông, giờ Dậu):** hái củ mài (Thủy, đúng mùa), bộ phận rễ củ (đúng), 1 phần → `s = 1 × (0,4 + 0,2 + 0,4) = 1` → `f = 1` → thô 1. Võ Đang hành Thủy = Dụng `MAU-A` → ĐH `1 × 1,19 × 1,10 = 1,31`. Sáu cây như vậy: ĐH 7,9. Nếu tham hái 3 phần mỗi lần: `s = 0,6` → `f = 0,72` → ĐH 5,7, kèm 6 điểm thuốc khô 3 ngày.

### 1.8 Phần thưởng

| Hạng mục | Giá trị |
|---|---|
| Thô | ≤ 1 / cây × 6 cây / ngày |
| Phúc Khí | `round(thô × 0,5)` — tối đa 3 / ngày |
| Nguyên Khí | −1 / cây (đi đường dài; xem `09-09` §5) |
| Vật phẩm | vị thuốc vào Dược Lâu, chất lượng ★–★★★ theo `m × g` |
| Nhật Khóa | 3 cây tính thưởng trong ngày = 1 việc nhóm **Thân** |
| Thành tựu | «Năm mùa năm hành» (hái ít nhất 1 vị mỗi hành, mỗi vị đúng mùa) · «Người giữ rừng» (100 lần hái 1 phần) |
| Công | không cho công (hái thuốc cho mình); dùng vị bốc thuốc cho NPC ở `MG-07` mới sinh công |

### 1.9 Trạng thái thất bại

| Trạng thái | Điều kiện | Xử lý |
|---|---|---|
| Hái nhầm bộ phận | `n = 0` | vật phẩm «lá củ mài» vô dụng, vẫn vào kho, sau 1 ngày tự hủy |
| Tận thu | hái 3 phần | điểm khô 3 ngày thật; trên bản đồ điểm hiện màu xám; NPC gần đó nói câu nhắc |
| Kho đầy | Dược Lâu 40/40 | không cho hái, nhắc pha dược trà hoặc tặng |

```
[CẢNH MG-13.F1 · chân núi Tử Tiêu, Võ Đang · giờ Thân · sau khi người chơi hái sạch một cụm]
ĐAN ĐỈNH CHÂN NHÂN (dan_dinh): (cúi xuống nhìn gốc cây trơ đất) Củ mài mọc chậm lắm. Ba năm mới được một củ bằng cổ tay.
ĐAN ĐỈNH CHÂN NHÂN: Con lấy cả ba, năm sau con lên đây sẽ chẳng còn gì. Người hái sau con cũng vậy.
> Lựa chọn: ① «Con xin lỗi, con sẽ để lại.» → [MG-13.F1a: điểm mọc lại sớm 1 ngày]  ② «Con cần nhiều cho lò đan.» → [MG-13.F1b]
[MG-13.F1b] ĐAN ĐỈNH CHÂN NHÂN: Lò đan đợi được. Rừng thì không đợi ai. Mai con hái ở chỗ khác, chia đều ra.
```

### 1.10 Trợ năng (riêng)

- Giữ nút «Hái» 1 giây có thể đổi thành chạm hai lần (cài đặt).
- Chế độ «không đi bộ xa»: người có thiết lập giảm vận động được bật «Dẫn đường hái thuốc» — nhân vật tự đi tới điểm gần nhất theo A* (`world.js` đã có tìm đường).
- Biểu tượng hành luôn kèm chữ Hán và hình (`09-03` §13.3); chất lượng ★ có cả số.

### 1.11 Chống gian (riêng)

- Tọa độ người chơi do máy chủ kiểm: phải ở trong 3 m của điểm thuốc khi gửi lệnh hái; dịch chuyển > 30 m/s (ngoài ngự kiếm / súc địa) → cờ.
- Giờ và tiết khí lấy theo **giờ máy chủ quy về múi giờ tài khoản**, không theo đồng hồ máy khách.
- Điểm thuốc là tài nguyên **riêng mỗi người** (bản sao cá nhân) để không tranh giành trong MMO; nhưng «tận thu» làm khô bản sao của chính người đó.

### 1.12 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `herb_pick` | `herb_id, wx, part, part_ok, qty, in_season, hour_ok, region, quality` |
| `herb_overharvest` | `herb_id, region` |
| `herb_inventory_full` | `count` |

Câu hỏi đo: tỉ lệ hái 1 phần có tăng sau lần nghe lời nhắc đầu tiên không (mục tiêu ≥ 70% sau 7 ngày).

### 1.13 iOS

Giữ nguyên (không có yếu tố bói).

### 1.14 Nghiệm thu

- [ ] 24 vị, mỗi vị có hành, bộ phận, mùa, vùng; tên vị đều tra được trong `WUX_ZANG[].nourish` hoặc `DIET`.
- [ ] Mùa tính đúng theo tiết khí thật (test 12 ngày ranh giới, gồm Đại Thử và Lập Thu).
- [ ] Hái 3 phần làm điểm khô đúng 3 ngày; điểm của người khác không đổi.
- [ ] Thô dừng sau cây thứ 6 trong ngày; Nhật Khóa tính khi đủ 3 cây.
- [ ] «Thần thức sơ khai» chỉ bật từ bậc 2.

---

## 2. `MG-14` · Pha Trà Thất Bộ

### 2.1 Mục đích

Trà Thất là nơi đầu tiên người chơi «ngồi yên» trong game (đã có: `stations.js › openTra`). `MG-14` thêm **phần pha** trước phần ngồi: bảy bước chậm rãi để tay bận mà lòng lắng. Đây là hoạt động **hồi Nguyên Khí** chính (NK −10, tức +10), là chỗ nghỉ giữa hai việc nặng. Trụ cột: T3 (thử thách là sự chậm), T4 (Trà Thất có công năng thật).

### 2.2 Engine dạy

| Nội dung | Nguồn | Dùng thế nào |
|---|---|---|
| Bốn loại trà và ngưỡng mở | `state.js › TEAS` (sen 0, lài 30, ô long 100, shan tuyết 250) | thẻ chọn trà |
| Ngồi trà tính phút, trần 15 Phúc Khí / ngày | `state.js › addTeaMinutes`, `CAPS.teaPerDay` | phần ngồi sau khi pha (giữ nguyên) |
| Màu nước trà trên chén | `api.setTeaColor(tea.color)` trong `openTra` | màu chén sau bước 5 |
| Bồ đoàn MMO, mỗi chỗ một người | `net.js` (xin chỗ), `protocol.js` (tọa độ chỗ ngồi), `main.js › setSitting` | mời khách cùng ngồi |
| Nhịp thở khi ngồi | `openTra` (chu kỳ 14 s) | nối sang `MG-01` nếu người chơi muốn tĩnh tọa |

Phần hư cấu / quy ước: nhiệt độ và thời gian hãm là **quy ước thưởng trà phổ biến**, không phải engine; ghi nguồn tham khảo trà đạo Việt trong sổ.

**Ghi chú code hiện có:** `openTra` đang mở trà theo `state.phucKhi` (số dư hiện tại) — tiêu Phúc Khí ở Tàng Y Các có thể làm **khóa lại** trà đã mở. Đề xuất đổi sang `state.xp` (tích lũy đời) cho nhất quán với cấp (`progress.js` cũng dùng `xp`). Ghi ở câu hỏi mở của README.

### 2.3 Luật chơi — bảy bước

| Bước | Tên | Thao tác | Mục tiêu |
|---|---|---|---|
| 1 | Tráng ấm | nghiêng ấm rót nước sôi vào chén, đổ đi | làm nóng đủ 3 chén (vòng tròn quét qua 3 chén) |
| 2 | Thưởng trà | xoay hộp trà, ngửi | giữ yên 3 giây (không thao tác) — chậm là đúng |
| 3 | Cho trà | kéo thìa | lượng đúng theo cỡ ấm: ấm 150 ml → 5–7 g |
| 4 | Đánh thức trà | rót nước, đổ ngay | đổ trong ≤ 10 giây (để lâu → chát) |
| 5 | Hãm | chọn nhiệt độ nước, chờ | đúng khoảng nhiệt độ và thời gian của loại trà |
| 6 | Rót đều | rót vòng qua các chén («Quan Công tuần thành»), giọt cuối chia lần lượt («Hàn Tín điểm binh») | ba chén đều màu (sai lệch ≤ 10%) |
| 7 | Mời | chọn lời mời, hai tay dâng chén | lời mời phù hợp khách (chính mình / NPC / người chơi) |

**Bảng nhiệt độ và thời gian (quy ước game):**

| Trà (`TEAS.id`) | Nhiệt độ nước | Thời gian hãm lần 1 | Ghi chú |
|---|---|---|---|
| `sen` — Trà Sen | 80–85 °C | 30–45 s | trà xanh ướp sen, nước quá sôi làm mất hương sen |
| `lai` — Trà Lài | 80 °C | 30–40 s | |
| `olong` — Trà Ô Long | 90–95 °C | 45–60 s | lá cuộn cần nước nóng để mở |
| `shan` — Trà Shan Tuyết | 85–90 °C | 40–50 s | |

Sau bước 7: hỏi «Ngồi lại uống?» → vào phần ngồi hiện có (`openTra`: 1 / 3 / 5 / 10 phút, Phúc Khí theo phút, trần 15 / ngày). Phần ngồi **không** cho thô (ngồi có thở theo vòng là `MG-01`, chọn được ngay tại chỗ).

### 2.4 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Nghiêng ấm / rót | kéo ấm theo cung | giữ `Space`, `←` `→` đổi chén | kéo |
| Thìa trà | kéo thìa vào ấm, mỗi lần kéo = 1 g | `↑` thêm, `↓` bớt | bánh xe |
| Chọn nhiệt độ | kéo nhiệt kế | `←` `→` (bước 5 °C) | kéo |
| Đổ trà / dừng hãm | chạm nút «Rót ra» | `Enter` | nhấp |
| Mời | chọn thẻ lời mời | `1`–`3` | nhấp |

### 2.5 Bố cục giao diện

```
┌──────────────────────────────────────────────┐
│ Trà Thất · Trà Ô Long · bước 5/7 · Hãm          │
│                                              │
│        ╭──╮   ← ấm      ⌒⌒ hơi nước              │
│   ( )  ( )  ( )   ← 3 chén (đã tráng: ✓✓✓)     │
│                                              │
│   Nhiệt độ  [80 ── 85 ── 90 ─●─ 95 ── 100] °C   │
│   Đã hãm 00:38   (Ô Long: 45–60 s)              │
│                                              │
│                    [ Rót ra ]                 │
│ Nguyên Khí 38 → +10 khi mời xong                │
└──────────────────────────────────────────────┘
```

### 2.6 Đường cong độ khó

| Mức | Gợi ý | Sai số cho phép | Khác biệt |
|---|---|---|---|
| Sơ | hiện khoảng nhiệt độ và thời gian của trà | ± 5 °C, ± 10 s | chỉ Trà Sen, Trà Lài |
| Trung | chỉ hiện tên trà | ± 5 °C, ± 8 s | mở Ô Long (cần đủ Phúc Khí như `TEAS`) |
| Thâm | không gợi ý; đồng hồ hãm ẩn, chỉ có màu nước đậm dần | ± 3 °C, ± 5 s | lần hãm 2, 3 (mỗi lần +10 s) |
| Viên Thông | như Thâm; thêm khách khó tính (NPC nói khẩu vị) | ± 3 °C, ± 5 s | pha theo khẩu vị khách (đậm / nhạt) |

### 2.7 Chấm điểm

```
b1 = số chén đã tráng / 3
b2 = 1 nếu giữ yên ≥ 3 s, 0,5 nếu 1–3 s, 0 nếu thao tác ngay
b3 = 1 nếu lượng trong khoảng, 0,5 nếu lệch 1 g, 0 nếu lệch hơn
b4 = 1 nếu đổ ≤ 10 s, giảm tuyến tính về 0 ở 25 s
b5 = 0,5·(nhiệt trong sai số ? 1 : max(0, 1 − lệch/10)) + 0,5·(thời gian trong sai số ? 1 : max(0, 1 − lệch/20))
b6 = max(0, 1 − độLệchMàu/0,3)          (độ lệch màu tương đối giữa 3 chén)
b7 = 1 nếu lời mời hợp khách, 0,5 nếu trung tính
s  = 0,10·b1 + 0,10·b2 + 0,15·b3 + 0,10·b4 + 0,30·b5 + 0,15·b6 + 0,10·b7
thô = 4 × f(s) × K_lặp × K_hư           s_min = 0,3
```

Nguyên Khí: **+10** khi xong bước 7 (bất kể điểm), cộng thêm phần ngồi theo `09-09` §5.

**Ví dụ (`MAU-A`, Trà Thất Sơn Môn — TC, Thổ, không hợp Dụng):** Ô Long, tráng 3/3, giữ yên 3 s, 6 g, đổ 8 s, nước 90 °C (lệch 0) hãm 52 s, màu lệch 6%, mời đúng. `b6 = 0,8`. `s = 0,1+0,1+0,15+0,1+0,3+0,12+0,1 = 0,97` → `f = 0,979` → thô 3,9 → ĐH `3,9 × 1,19 = 4,7`. NK +10.

### 2.8 Phần thưởng

| Hạng mục | Giá trị |
|---|---|
| Thô | ≤ 4 / lượt |
| Phúc Khí | `round(thô × 0,5)` + phần ngồi theo `addTeaMinutes` (không đổi) |
| Nguyên Khí | +10 / lượt pha (lượt 1–3 trong ngày; lượt 4+ chỉ +3) |
| Mời người chơi khác (MMO) | chủ trà nhận **1 công** / ngày (ghi Sổ Công Quá, DEED do tài liệu 05 chốt); khách nhận +5 NK |
| Nhật Khóa | 1 việc nhóm **Tĩnh** |
| Thành tựu | đã có `tea60` (60 phút ngồi); mới: «Bảy bước không vội» (10 lượt `s ≥ 0,9`) |

### 2.9 Trạng thái thất bại

| Trạng thái | Điều kiện | Xử lý |
|---|---|---|
| Trà chát | hãm quá 2× thời gian | chén màu đậm, `b5 ≈ 0`; vẫn mời được |
| Trà nhạt | nước dưới 70 °C | như trên |
| Đổ vỡ | không có | game không có chén vỡ (tránh cảm giác phạt) |

```
[CẢNH MG-14.F1 · Trà Thất Sơn Môn · giờ Thân · sau khi người chơi hãm Ô Long quá lâu]
LÃO TÙNG (gac_cong): (nhấp một ngụm, nhăn mặt rồi cười) Chát. Nhưng chát cũng là một vị.
LÃO TÙNG: Ấm sau con đổ sớm hơn một chút. Trà không cần con canh nó — chỉ cần con đừng quên nó.
> Lựa chọn: ① «Con pha lại.» → [MG-14 lượt mới]  ② «Con ngồi uống chén này.» → [phần ngồi openTra]
```

### 2.10 Trợ năng (riêng)

- Bước 2 (giữ yên 3 giây) với người khó giữ tay: chấp nhận «không chạm trong 3 giây» thay vì «giữ».
- Nhiệt kế có số đọc to bằng giọng (bật «chế độ đọc»).
- Rót đều (bước 6) có chế độ tự rót, người chơi chỉ chọn thứ tự chén (vẫn tính `b6` theo thứ tự).

### 2.11 Chống gian (riêng)

- Thời gian giữ yên và hãm đo bằng đồng hồ máy chủ theo nhật ký thao tác; client không được tự báo «đã đủ 3 giây».
- Thưởng mời khách (công) chỉ tính khi khách là tài khoản khác, đã ngồi cùng ≥ 3 phút (dùng khóa bồ đoàn của máy chủ).

### 2.12 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `tea_step` | `tea_id, step, value, ok` |
| `tea_serve` | `tea_id, guest_type (self/npc/player), s` |
| `tea_sit_after` | `minutes` (nối với `addTeaMinutes`) |

### 2.13 iOS

Giữ nguyên. Trên iOS điểm tên «Điểm Tu Học» (`features.js › TEXT.point`) thay cho «Phúc Khí» trong mọi câu.

### 2.14 Nghiệm thu

- [ ] Bảy bước chạy được bằng chạm, phím, chuột; không bước nào bắt buộc thao tác nhanh dưới 1 giây.
- [ ] Phần ngồi sau pha gọi đúng `addTeaMinutes`, trần 15 Phúc Khí / ngày không đổi.
- [ ] NK +10 cho lượt 1–3, +3 từ lượt 4.
- [ ] Công mời khách chỉ một lần / ngày, chỉ với tài khoản khác.

---

## 3. `MG-15` · Luyện Đan Cửu Chuyển (hư cấu)

### 3.1 Mục đích

Võ Đang có lò đan và Đan Đỉnh chân nhân (`dan_dinh`) — người dẫn lộ Đắc Cứu (canon). `MG-15` là trò **điều hòa lửa và nước** chín lượt («cửu chuyển»), lấy ý từ cương lĩnh Tham Đồng Khế «lấy Càn Khôn làm đỉnh lò, Khảm Ly làm dược vật». Quan trọng hơn: game **nói thật** rằng ngoại đan lịch sử dùng thủy ngân, chì và đã đầu độc nhiều người — đan trong game là **vật hư cấu**, chỉ có tác dụng trong game. Trụ cột: T5 (đúng sử), T6 (không dạy làm đan, không hứa sức khỏe).

### 3.2 Engine dạy

| Nội dung | Nguồn | Dùng thế nào |
|---|---|---|
| «以乾坤為鼎爐，以坎離為藥物» | `cultivation-data › CULTIVATION` mục `DAN_CANTONG_QI` (`han_text`, `meaning`) | câu khắc trên lò; giải nghĩa: Càn Khôn (trời đất) là lò, Khảm (nước) Ly (lửa) là thuốc — **ý tưởng cân bằng**, không phải công thức |
| Cát Hồng, ngoại đan và dưỡng sinh | `cultivation-data › CULTIVATION` mục `DAN_BAOPUZI` | thẻ sử «Bão Phác Tử» |
| Cảnh báo không tự luyện | `cultivation-data › ETHICS` | dòng chân trang cố định |
| Nội đan bốn bậc | `remedy-fate › DAO_JIA[1]` (炼精化气 → 炼气化神 → 炼神还虚 → 炼虚合道) | tên bốn «phẩm» đan trong game ứng bốn bậc |
| Nguyên liệu | `MG-13` Dược Lâu (vị theo hành) | mỗi chuyển bỏ một vị theo đan phương |

Phần hư cấu (ghi rõ trong game): đan phương, tên đan, tác dụng.

**Câu sử thật hiện ở lần chơi đầu (chờ biên tập sử kiểm từng chi tiết trước khi phát hành):** «Ngoại đan xưa nung chu sa, thủy ngân, chì. Sử chép không ít người — kể cả vua chúa — chết vì uống đan. Vì thế đạo sĩ đời sau chuyển sang **nội đan**: luyện tinh, khí, thần trong chính mình, không nuốt kim thạch. Đan ở lò này là đan của trò chơi.»

### 3.3 Luật chơi

1. Chọn **đan phương** (bảng dưới), nạp đủ nguyên liệu từ Dược Lâu.
2. Lò có hai thanh: **Hỏa** (Ly) và **Thủy** (Khảm). Thanh cân bằng «Khảm Ly» là hiệu số giữa hai bên.
3. Chín **chuyển**, mỗi chuyển 50–70 giây thực:
   - đầu chuyển: bỏ vị theo đan phương (đúng hành, đúng thứ tự);
   - trong chuyển: giữ thanh Khảm Ly trong **vùng điều hòa** bằng cách chọn **văn hỏa** (lửa nhỏ, tăng chậm) hoặc **vũ hỏa** (lửa lớn, tăng nhanh) và **thêm nước**;
   - vùng điều hòa trôi theo nhịp đan phương (vd chuyển 1–3 cần thiên Ly, 4–6 cân, 7–9 thiên Khảm).
4. Giữa các chuyển có quãng «ôn dưỡng» 20 giây: không thao tác — ai thao tác bị trừ điểm (dạy chờ đợi).
5. Sau chuyển 9: «khai lò» — đan thành phẩm theo điểm.

**Đan phương bản đầu (hư cấu):**

| Đan | Phẩm (theo bậc nội đan) | Mở | Nguyên liệu (hành theo thứ tự chuyển) | Tác dụng **trong game** |
|---|---|---|---|---|
| Thanh Tâm Đan | Luyện Tinh | bậc 3 | Hỏa, Thủy, Hỏa, Thủy, Thổ, … (9 vị) | +20 Nguyên Khí khi dùng (1 / ngày) |
| Dưỡng Nguyên Đan | Luyện Tinh | bậc 3 | Thổ ×3, Kim ×3, Thủy ×3 | +2 NK / giờ trong 6 giờ thực |
| Ngũ Khí Triều Nguyên Đan | Luyện Khí | bậc 4 | đủ 5 hành, tương sinh Mộc→Hỏa→Thổ→Kim→Thủy, lặp | hiệu ứng «ngũ khí» quanh thân 24 giờ (thuần thẩm mỹ) |
| Tam Hoa Tụ Đỉnh Đan | Luyện Thần | bậc 5 | 3 vị hoa + 6 vị theo Dụng của người luyện | hiệu ứng «tam hoa» trên đỉnh đầu 24 giờ (thẩm mỹ) |
| Quy Nhất Đan | Luyện Hư | bậc 6 | 9 vị, mỗi vị từ một vùng khác nhau | tặng sư phụ / đệ tử: mở trang phục «Đan Đỉnh truyền nhân» (một lần) |

Không đan nào tăng Đạo Hạnh, không đan nào bán được lấy Ngọc (E1).

### 3.4 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Văn hỏa (quạt nhẹ) | chạm nhịp chậm vào cửa lò | `A` | nhấp chậm |
| Vũ hỏa (quạt mạnh) | giữ cửa lò | giữ `D` | giữ nút trái |
| Thêm nước | kéo gáo vào nồi trên lò | `W` | kéo gáo |
| Bỏ vị (đầu chuyển) | kéo vị từ khay | `1`–`9` | kéo thả |
| Khai lò | giữ nút 2 giây | giữ `Enter` | giữ |

### 3.5 Bố cục giao diện

```
┌────────────────────────────────────────────────┐
│ Lò Đan · Võ Đang · Ngũ Khí Triều Nguyên Đan · chuyển 4/9 │
│                                                │
│  Ly 火 ▮▮▮▮▮▮▯▯▯▯     ┌── vùng điều hòa ──┐       │
│  Khảm 水 ▮▮▮▮▯▯▯▯▯▯   │■■■■●■■■│  ← kim cân bằng │
│                       └──────────────────┘     │
│        ╔═══╗  «以乾坤為鼎爐，以坎離為藥物»         │
│        ║ ☲ ║  lò bát quái                        │
│        ╚═══╝                                   │
│  Khay: [Gừng 土] [Lê 金] [Đậu đen 水] …           │
│  Chuyển này cần: 金 Kim   ✓ đã bỏ                 │
│  ôn dưỡng: —            còn 0:41                │
└────────────────────────────────────────────────┘
```

### 3.6 Đường cong độ khó

| Mức | Độ rộng vùng điều hòa | Tốc độ trôi của vùng | Sự cố ngẫu nhiên |
|---|---|---|---|
| Sơ | 30% thanh | chậm, báo trước 5 s | không |
| Trung | 22% | vừa | gió lùa (lửa tự tăng 3 s) |
| Thâm | 16% | nhanh, báo trước 2 s | gió lùa, nước cạn |
| Viên Thông | 12% | theo nhịp hơi thở của người chơi (tùy chọn nối `MG-01`) | như Thâm |

Bậc 3 chỉ có Sơ, Trung; bậc 4 mở Thâm; Viên Thông cần Tu độ TV ≥ 2.000.

### 3.7 Chấm điểm

```
v_k = tỉ lệ thời gian của chuyển k mà kim nằm trong vùng điều hòa          (k = 1..9)
d_k = 1 nếu bỏ đúng vị (đúng hành, đúng thứ tự), 0,5 nếu đúng hành sai thứ tự, 0 nếu sai hành
o_k = 1 nếu không thao tác trong quãng ôn dưỡng sau chuyển k, 0,5 nếu 1 lần, 0 nếu ≥ 2 lần
s   = (1/9)·Σ_k (0,60·v_k + 0,25·d_k + 0,15·o_k)
thô = 9 × f(s) × K_lặp × K_hư           s_min = 0,5
Phẩm đan: s ≥ 0,9 Thượng phẩm (tác dụng ×1,5) · 0,7–0,9 Trung phẩm · 0,5–0,7 Hạ phẩm · < 0,5 «Tro đan» (không tác dụng)
```

**Ví dụ (`MAU-A`, lò đan Võ Đang — TV, Thủy = Dụng):** Dưỡng Nguyên Đan, trung bình `v = 0,74`, bỏ đúng cả 9 vị, ôn dưỡng chạm sai 2 lần ở 2 chuyển (o = 0,5 ở 2 chuyển) → `s = 0,60·0,74 + 0,25·1 + 0,15·(7+1)/9 = 0,444 + 0,25 + 0,133 = 0,827` → `f = 0,879` → thô 7,9 → ĐH `7,9 × 1,19 × 1,10 = 10,3`. Phúc Khí +4. Đan: Trung phẩm.

### 3.8 Phần thưởng

| Hạng mục | Giá trị |
|---|---|
| Thô | ≤ 9 / lượt |
| Nguyên Khí | −12 / lượt |
| Vật phẩm | 1 viên đan (phẩm theo `s`); kho đan tối đa 10 |
| Nhật Khóa | 1 việc nhóm **Nghệ** |
| Quan hệ NPC | tặng đan cho `dan_dinh`, `huyen_hu`: thiện cảm (tài liệu 06 dùng) |
| Thành tựu | «Cửu chuyển viên thành» (Thượng phẩm lần đầu) · «Lửa không vội» (9 chuyển không chạm ôn dưỡng) |

### 3.9 Trạng thái thất bại

| Trạng thái | Điều kiện | Xử lý |
|---|---|---|
| Tro đan | `s < 0,5` | không có đan; nguyên liệu mất; thô `9 × 0,15` |
| Lò nứt | không có | không có cháy nổ (T3: không bạo lực, không «nổ lò» kịch tính) |
| Thiếu vị | Dược Lâu thiếu | không cho bắt đầu, chỉ vùng có vị đó trên bản đồ |

```
[CẢNH MG-15.F1 · lò đan Võ Đang · giờ Tuất · khai lò ra tro]
ĐAN ĐỈNH CHÂN NHÂN (dan_dinh): (gạt tro ra đĩa đồng) Tro. Tốt.
NGƯỜI CHƠI: Tốt ạ?
ĐAN ĐỈNH CHÂN NHÂN: Người xưa không ra tro, họ ra thủy ngân rồi uống vào. Con ra tro thì còn sống mà luyện lại.
ĐAN ĐỈNH CHÂN NHÂN: Lửa của con nóng quá ở chuyển thứ năm. Lần sau đến đó thì thở ra một hơi rồi hãy quạt.
> Lựa chọn: ① «Con luyện lại.» → [MG-15 lượt mới]  ② «Nội đan khác ngoại đan ở đâu ạ?» → [thẻ DAO_JIA[1]]
```

### 3.10 Trợ năng (riêng)

- Chế độ «lửa tự giữ»: kim tự trôi về giữa vùng chậm 30% — người chơi chỉ cần chọn văn / vũ hỏa đúng lúc.
- Màu hai thanh Ly / Khảm kèm chữ 火 / 水 và hình ◆ / 〰 (`09-03` §13.3).
- Mỗi chuyển có thể tạm dừng (lò «ủ tro») tối đa 10 phút.

### 3.11 Chống gian (riêng)

- Tiến trình lò do máy chủ mô phỏng từ nhật ký thao tác (thời điểm quạt, thêm nước), không nhận `v_k` từ client.
- Đan là vật phẩm gắn tài khoản, không giao dịch được (chống buôn đan lấy Ngọc); chỉ tặng thầy / trò / đồng môn và mỗi người nhận ≤ 1 viên / ngày.

### 3.12 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `alchemy_turn` | `recipe, turn, v, d, o, incident` |
| `alchemy_result` | `recipe, grade, s` |
| `alchemy_history_card_view` | `card (DAN_CANTONG_QI / DAN_BAOPUZI / DAO_JIA)` |

Câu hỏi đo: ≥ 60% người luyện lần đầu có mở thẻ sử (mục tiêu học, không chỉ chơi).

### 3.13 iOS

Giữ nguyên.

### 3.14 Nghiệm thu

- [ ] Câu cảnh báo ngoại đan và `cultivation-data › ETHICS` hiện ở lượt đầu, không tắt được ở lượt đầu.
- [ ] Không đan nào tăng Đạo Hạnh, không đan nào bán / giao dịch.
- [ ] Chín chuyển có ôn dưỡng; chấm `o_k` đúng.
- [ ] Đan phương đọc từ dữ liệu, không viết cứng trong UI.

---

## 4. `MG-16` · Thả Đèn Hoa Đăng (chỉ bản web)

### 4.1 Mục đích

Hồ Sen là một trong bảy gian gốc của Huyền Quán (`stations.js › openSen`). Thả đèn là phút **lặng và gửi gắm** cuối ngày. `MG-16` thêm phần **làm đèn** (gấp, viết, chọn màu, thả theo hơi thở) để khoảnh khắc ấy có nghi thức. Trụ cột: T6 (điều ước chỉ ở máy người chơi).

### 4.2 Engine dạy

| Nội dung | Nguồn | Dùng thế nào |
|---|---|---|
| Thả đèn 1 lần / ngày, điều ước ≤ 80 ký tự, lưu 50 đèn | `state.js › addLantern`, `CAPS.keepLanterns`, `REWARD.lantern` (3 Phúc Khí) | giữ nguyên luật |
| «Điều ước chỉ lưu trên máy của bạn» | câu trong `openSen` | giữ nguyên câu |
| Màu ngũ hành | `progress.js › WX_GIATRI[wx].color` | màu giấy đèn |
| Hơi thở | nhịp 4 – 4 – 6 của `openTra` | thả đèn sau một hơi thở |
| Tắt trên iOS | `features.js › IOS_OFF` có `'sen'` | `MG-16` không có trên iOS |

### 4.3 Luật chơi

1. **Gấp đèn:** ba nếp gấp theo đường chấm (gấp đôi → gấp góc → dựng cánh sen).
2. **Viết:** ô điều ước (không bắt buộc ở lễ tưởng niệm — xem dưới). Giới hạn 80 ký tự như hiện có.
3. **Chọn màu:** 5 màu ngũ hành + trắng. Sổ gợi ý màu theo Dụng thần nhưng **không ép** («Màu nào con thấy yên thì chọn»).
4. **Thả:** đặt đèn lên mặt nước, giữ một hơi thở (hít – giữ – thở); thở ra là đèn trôi.
5. Mỗi ngày một đèn (luật cũ).

**Phiên bản lễ:**

| Lễ (âm lịch) | Nơi | Khác biệt |
|---|---|---|
| Trung Nguyên 15/7 (Vu Lan) | Hồ Sen Sơn Môn và Cùng Thông Hồ | đèn **tưởng niệm**: ô viết đổi thành «Tên người muốn tưởng nhớ (không bắt buộc)», không có điều ước; thêm 1 đèn ngoài lượt ngày |
| Hạ Nguyên 15/10 (Thủy quan giải ách) | Cùng Thông Hồ | đèn thả theo nhóm môn phái, xếp hình trên mặt hồ (tài liệu 10 tổ chức `EV-*`) |

### 4.4 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Gấp | kéo góc giấy theo đường chấm | `Space` (tự gấp nếp kế tiếp sau khi giữ 1 s) | kéo |
| Viết | bàn phím ảo | gõ | gõ |
| Chọn màu | chạm ô màu | `1`–`6` | nhấp |
| Thả theo hơi thở | giữ – thả như `MG-01` | `Space` | giữ nút |

### 4.5 Bố cục giao diện

```
┌──────────────────────────────────────────────┐
│ Hồ Sen · giờ Tuất · trăng mười hai              │
│                                              │
│     ✿  (đèn đã gấp, màu 水 Huyền Thủy)           │
│                                              │
│  Điều ước gửi theo đèn                         │
│  ┌──────────────────────────────────────┐    │
│  │ mong mẹ khỏe                           │    │
│  └──────────────────────────────────────┘ 14/80│
│  Chỉ lưu trên máy của bạn, không gửi đi đâu.    │
│                                              │
│  Màu: [木][火][土][金][水✓][trắng]               │
│                                              │
│        ( giữ để hít vào … thả để thả đèn )       │
└──────────────────────────────────────────────┘
```

Mặt hồ trong MMO hiện đèn của người khác (chỉ ánh sáng và màu, **không bao giờ** có chữ).

### 4.6 Đường cong độ khó

Không có độ khó tăng dần — thả đèn không phải thử thách. Mức tinh thông chỉ mở **kiểu đèn** (sen 8 cánh ở Sơ, sen 16 cánh ở Trung, thuyền giấy ở Thâm, đèn lồng tròn ở Viên Thông — thuần thẩm mỹ).

### 4.7 Chấm điểm

```
s = 1 nếu hoàn thành đủ 4 bước (gấp, [viết hoặc bỏ trống], màu, thả theo hơi thở); không có điểm từng phần
thô = 2 × f(s) × K_hư            (1 lượt / ngày nên không cần K_lặp)
```

**Ví dụ:** `MAU-A` thả đèn ở Hồ Sen (trung lập): thô 2 → ĐH `2 × 1,19 = 2,4`. Ở Cùng Thông Hồ (phân đàn TD, Kim = Hỷ của `MAU-A`): ĐH `2 × 1,19 × 1,05 = 2,5`.

### 4.8 Phần thưởng

| Hạng mục | Giá trị |
|---|---|
| Thô | 2 / ngày |
| Phúc Khí | 3 (giữ `REWARD.lantern`) + `round(2 × 0,5) = 1` |
| Nguyên Khí | 0 |
| Nhật Khóa | 1 việc nhóm **Lễ** |
| Thành tựu | đã có `lantern5`; mới: «Đèn đủ năm màu» |

### 4.9 Trạng thái thất bại

Không có thất bại. Rời màn giữa chừng: đèn chưa thả được giữ nguyên trạng thái (đã gấp, đã viết) tới cuối ngày.

```
[CẢNH MG-16.1 · Hồ Sen · giờ Tuất · lần đầu thả đèn]
NI SƯ DIỆU ÂM (dieu_am, nếu người chơi đã gặp; nếu chưa: LÃO TÙNG): Đèn trôi đi đâu, ai biết. Nhưng lúc con viết, con đã biết mình thương ai.
NI SƯ DIỆU ÂM: Điều đó ở lại với con. Đèn chỉ mang ánh sáng đi thôi.
```

### 4.10 Trợ năng (riêng)

- Gấp đèn có nút «Gấp giúp».
- Bước thả theo hơi thở có thể thay bằng một lần chạm (cài đặt «không giữ»).
- Ô viết hỗ trợ đọc chính tả của hệ điều hành.

### 4.11 Chống gian (riêng)

Không cần chống gian ngoài trần 1 / ngày (máy chủ giữ cờ `daily.got.lantern` theo ngày tài khoản). Điều ước **không gửi lên máy chủ** — máy chủ chỉ nhận sự kiện «đã thả, màu».

### 4.12 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `lantern_release` | `color_wx, has_wish (bool), event (none / trung_nguyen / ha_nguyen)` |

Tuyệt đối không có trường chứa nội dung điều ước hay tên người tưởng niệm.

### 4.13 iOS

**Tắt** (`IOS_OFF` có `'sen'`, đúng bài học 4.3(b) của app). Đề xuất phương án thay thế **«Đèn tri ân»** (không có điều ước, chỉ ghi một điều biết ơn trong ngày) — **cần thử App Review riêng** trước khi đưa vào bản iOS; mặc định chưa bật. Nhật Khóa iOS không thiếu nhóm Lễ vì còn `MG-06`, `MG-17`.

### 4.14 Nghiệm thu

- [ ] Gọi đúng `addLantern`; 1 đèn / ngày; lễ Trung Nguyên cho thêm 1 đèn tưởng niệm.
- [ ] Điều ước không xuất hiện trong mạng (kiểm bằng bắt gói), không trong đo lường.
- [ ] MMO hiện đèn người khác không kèm chữ.
- [ ] Bản iOS không có lối vào `MG-16`.

---

## 5. `MG-17` · Thần Chung Mộ Cổ (đánh chuông giờ)

### 5.1 Mục đích

«Sớm chuông chiều trống» (晨鐘暮鼓) là nhịp sống của chùa quán: chuông báo thức chúng lúc rạng sáng, trống báo nghỉ lúc chiều tà. Sơn Môn đã có **lầu chuông / lầu trống** (`sect.js`, `court.js`). `MG-17` cho người chơi làm người giữ chuông: kéo chày gỗ, buông đúng lúc, theo nhịp cổ truyền. Trong MMO, **cả máy chủ nghe tiếng chuông** của một người — một khoảnh khắc chung. Trụ cột: T4 (lầu chuông có công năng), T5 (đúng canh giờ thật).

### 5.2 Engine dạy

| Nội dung | Nguồn | Dùng thế nào |
|---|---|---|
| 12 canh giờ và tạng vượng | `tcm › MERIDIAN_CLOCK`, `meridianClock(hourZhi)` | sau khi đánh xong hiện lời khuyên của canh giờ (vd giờ Mão: «đại trường đỉnh…», giờ Dậu: «thận đỉnh…») |
| Lầu chuông, lầu trống Sơn Môn | `sect.js` («lầu chuông / lầu trống»), `court.js` | địa điểm |
| Chi giờ hiện tại | `constants.js › ZHI` + giờ địa phương | khung giờ hợp lệ |

Tập tục (ghi nguồn văn hóa trong sổ, không phải engine): 108 tiếng chia hai lượt, mỗi lượt «緊十八、慢十八、不緊不慢又十八» — mười tám tiếng nhanh, mười tám tiếng chậm, mười tám tiếng vừa.

### 5.3 Luật chơi

1. Một **lượt** = 54 tiếng: 18 nhanh (cách nhau ≈ 1,5 s) → 18 chậm (≈ 5 s) → 18 vừa (≈ 3 s). Thời lượng ≈ 2 phút 51 giây.
2. Mỗi tiếng: **giữ** để kéo chày ra sau (biên độ tăng), **buông** khi kim biên độ vào vùng sáng → chày chạm chuông. Buông sớm → tiếng nhỏ; buông muộn → lỡ nhịp.
3. Giữa hai đoạn (nhanh → chậm → vừa) có một nhịp nghỉ dài 6 s — đừng đánh.
4. **Khung giờ lễ:** chuông sáng **giờ Mão (5–7 giờ), mở rộng tới hết giờ Thìn (9 giờ)** cho người không dậy sớm được; trống chiều **giờ Dậu (17–19 giờ), mở rộng tới hết giờ Tuất (21 giờ)**. Ngoài khung: chế độ «luyện tay» (B = 1).
5. Đầy đủ 108 tiếng = 2 lượt liền (thành tựu «Trọn một trăm lẻ tám»), thưởng tính như 2 lượt, `K_lặp` bình thường.
6. **Trống chiều:** cùng cơ chế nhưng hai dùi trái / phải luân phiên (thêm điều kiện đúng tay).

**MMO:** mỗi phòng máy chủ có **một** chuông, một trống. Người muốn đánh xếp hàng; người đang đánh được mọi người trong bán kính 400 m nghe tiếng (âm thanh không gian). Trong lễ tuần (`ACT-041`), chuông do người được giao vai «Chung đầu» đánh.

### 5.4 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Kéo chày | giữ vùng lớn giữa màn hình | giữ `Space` | giữ nút trái |
| Buông | nhấc ngón | nhả `Space` | nhả |
| Dùi trái / phải (trống) | nửa trái / nửa phải màn hình | `F` / `J` | nút trái / nút phải |
| Xếp hàng / rời hàng | nút | `Q` | nút |

### 5.5 Bố cục giao diện

```
┌──────────────────────────────────────────────┐
│ Lầu chuông Sơn Môn · giờ Mão · đoạn CHẬM 7/18   │
│                                              │
│              ┌─────┐                          │
│        ═══►  │  鐘  │   ← chày gỗ               │
│              └─────┘                          │
│   biên độ  ▁▂▃▅▇[███]▇▅▃▂▁  ← vùng sáng          │
│                                              │
│   nhịp:  ●  ·  ·  ·  ●  ·  ·  ·  ○             │
│   (chấm = mốc thời gian; nghỉ dài sau tiếng 18)  │
│                                              │
│ Hàng chờ: 2 người  ·  41 người đang nghe         │
└──────────────────────────────────────────────┘
```

### 5.6 Đường cong độ khó

| Mức | Vùng sáng biên độ | Dung sai nhịp | Hiển thị nhịp |
|---|---|---|---|
| Sơ | 30% | ± 400 ms | chấm nhịp và đếm số |
| Trung | 22% | ± 300 ms | chấm nhịp, không đếm |
| Thâm | 16% | ± 250 ms | chỉ âm (tiếng mõ nhỏ giữ nhịp) |
| Viên Thông | 12% | ± 250 ms | không có tín hiệu — tự giữ nhịp; thêm bài «Bách bát» liền 108 tiếng |

### 5.7 Chấm điểm

```
a_i = 1 nếu buông trong vùng sáng, giảm tuyến tính về 0 khi lệch một nửa vùng
t_i = max(0, 1 − |Δthời điểm| / dungSai)              (so với mốc nhịp của đoạn)
r   = 1 nếu không đánh trong 2 nhịp nghỉ dài, 0,5 nếu đánh 1 lần, 0 nếu 2 lần
s   = 0,45·mean(t) + 0,40·mean(a) + 0,15·r
B   = 3 trong khung giờ lễ, 1 ngoài khung
thô = B × f(s) × K_lặp × K_hư           s_min = 0,4
```

**Ví dụ (`MAU-A`, lầu chuông Sơn Môn — TC, Thổ; 6 giờ sáng):** `mean(t) = 0,81`, `mean(a) = 0,77`, `r = 1` → `s = 0,365 + 0,308 + 0,15 = 0,823` → `f = 0,876` → thô 2,6 → ĐH 3,1. Sau đó hiện thẻ giờ Mão từ `MERIDIAN_CLOCK.卯` (đại trường).

### 5.8 Phần thưởng

| Hạng mục | Giá trị |
|---|---|
| Thô | ≤ 3 / lượt (khung lễ), ≤ 1 (luyện tay) |
| Nguyên Khí | −3 |
| Phúc Khí | `round(thô × 0,5)` |
| Nhật Khóa | 1 việc nhóm **Lễ** (chỉ lượt trong khung lễ) |
| MMO | người nghe trong bán kính ≥ 30 giây nhận +1 NK (không thô) — «tiếng chuông làm người ta tỉnh» |
| Thành tựu | «Trọn một trăm lẻ tám» · «Ba mươi buổi sớm» (30 ngày đánh chuông giờ Mão) |

### 5.9 Trạng thái thất bại

| Trạng thái | Điều kiện | Xử lý |
|---|---|---|
| Chuông lạc nhịp | `s < 0,4` | `f = 0,15`; tiếng chuông vẫn vang (không ai bị phạt vì nghe chuông dở) |
| Đánh trong nhịp nghỉ | | âm tắt nhanh, `r` giảm |
| Rời hàng / mất mạng | | lượt kết thúc ở tiếng hiện tại, chấm phần đã đánh |

```
[CẢNH MG-17.F1 · lầu chuông Sơn Môn · giờ Mão · sau lượt lạc nhịp]
LÃO TÙNG (gac_cong): (đứng dưới chân lầu, tay chắp sau lưng) Đoạn chậm con đánh như người chạy trốn.
LÃO TÙNG: Mười tám tiếng chậm là cho người còn ngủ kịp tỉnh. Con vội thì họ giật mình.
> Lựa chọn: ① «Con đánh lại.» → [MG-17 lượt mới]  ② «Sao lại là một trăm lẻ tám ạ?» → [thẻ tập tục]
```

### 5.10 Trợ năng (riêng)

- Âm chuông có phụ đề sóng và rung nhẹ mỗi mốc nhịp.
- Người không nghe được: chế độ thị giác — vòng tròn co dần tới mốc.
- Khung giờ lễ: người đánh dấu «làm ca đêm» trong Cài đặt được dời khung theo giờ thức của mình (khai một lần / 30 ngày) — không phải lách luật, mà là tôn trọng người lao động đêm.

### 5.11 Chống gian (riêng)

- Giờ lễ theo giờ máy chủ quy về múi giờ tài khoản (`09-03` §5.1).
- Nhịp 108 tiếng là chuỗi thời điểm cố định → kiểm «nghi máy» (`09-03` §12) đặc biệt chặt: độ lệch chuẩn thời điểm < 5 ms trên 18 tiếng → cờ.

### 5.12 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `bell_section` | `section (nhanh/chậm/vừa), mean_t, mean_a` |
| `bell_rest_violation` | `section` |
| `bell_listeners` | `count, server_room` |
| `bell_window` | `in_window (bool), hour_zhi, night_shift (bool)` |

### 5.13 iOS

Giữ nguyên.

### 5.14 Nghiệm thu

- [ ] Một lượt đúng 54 tiếng, ba đoạn 18 với nhịp 1,5 / 5 / 3 giây, nghỉ dài 6 giây giữa đoạn.
- [ ] Khung giờ lễ đúng Mão–Thìn (chuông) và Dậu–Tuất (trống) theo giờ tài khoản; ca đêm dời được.
- [ ] MMO: một chuông / phòng, hàng chờ, tiếng không gian 400 m.
- [ ] Hiện thẻ `MERIDIAN_CLOCK` của canh giờ sau lượt.

---

## 6. `MG-18` · Họa Luân Mạn-đà-la (vẽ đối xứng)

### 6.1 Mục đích

Khác `MG-05` (dựng cát theo mẫu rồi xóa — bài học vô thường), `MG-18` là **sáng tác tự do**: vẽ một vòng hoa văn đối xứng tỏa tròn bằng năm màu ngũ hành. Không có đúng sai về thẩm mỹ. Nó dành cho người cần một việc tay yên lặng, và là cửa nhẹ nhất vào đạo thống Mật (mở từ bậc 1 ở Huyền Thành). Trụ cột: T3 (thử thách là sự tập trung), T6 (không chấm «đẹp / xấu»).

### 6.2 Engine dạy

| Nội dung | Nguồn | Dùng thế nào |
|---|---|---|
| Bảng màu ngũ hành | `progress.js › WX_GIATRI` (Thanh Mộc `#58c46a`, Ly Hỏa `#ff6a3c`, Hậu Thổ `#d9a64a`, Canh Kim `#f2e6b8`, Huyền Thủy `#4f9cff`) | 5 màu chính + vàng kim + mực |
| Tương sinh Mộc → Hỏa → Thổ → Kim → Thủy | quy luật sinh trong `tcm.js` (hằng `SHENG`, chưa export — chỉ dùng ý) | đề bài «Vòng tương sinh» |
| Vô thường (để đối chiếu) | `MG-05` | khi người chơi xóa tranh, một câu nhắc nối sang `MG-05` |

Phần hư cấu: toàn bộ hình mẫu; không dùng hình tượng thần linh cụ thể của Tạng truyền (đang **chờ tham vấn**, canon §3).

### 6.3 Luật chơi

1. Chọn **bậc đối xứng**: 4, 6, 8 hoặc 12 nhánh. Mỗi nét vẽ trong một nhánh được nhân ra mọi nhánh (và soi gương nếu bật).
2. Công cụ: bút nét, chấm, tem cánh sen, tô vùng, tẩy.
3. **Đề** (không bắt buộc): «Vòng tương sinh» (năm vòng đồng tâm theo thứ tự Mộc → Hỏa → Thổ → Kim → Thủy từ trong ra), «Một màu Dụng», «Tự do».
4. Hoàn thành khi người chơi bấm «Thành» sau ít nhất 3 phút và độ phủ ≥ 35% diện tích vòng.
5. Tranh lưu ở **Họa đường** (nhà riêng hoặc phòng trưng bày Huyền Thành). Người chơi chọn: giữ riêng / trưng bày công khai / **xóa** («buông»).

### 6.4 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Vẽ | kéo một ngón | `←→↑↓` di đầu bút, giữ `Space` để vẽ | kéo |
| Đổi công cụ | thanh công cụ | `B` bút · `D` chấm · `S` tem · `F` tô · `X` tẩy | nhấp |
| Đổi màu | ô màu | `1`–`7` | nhấp |
| Cỡ nét | thanh trượt | `[` `]` | bánh xe |
| Hoàn tác / làm lại | nút | `Ctrl+Z` / `Ctrl+Y` | nút |
| Xoay vòng xem | hai ngón (tùy chọn) | `Q` / `E` | bánh xe + `Shift` |

### 6.5 Bố cục giao diện

```
┌──────────────────────────────────────────────┐
│ Họa đường · 8 nhánh · gương: bật · đề: Tương sinh │
│ ┌──────────────────────────────┐ [B][D][S][F][X]│
│ │            . * .              │ 木 火 土 金 水 │
│ │        *  (  ✿  )  *          │ 金箔  墨       │
│ │      .  ✿   ◎   ✿  .         │ cỡ ▁▃▅        │
│ │        *  (  ✿  )  *          │               │
│ │            . * .              │ phủ 41%       │
│ └──────────────────────────────┘ 04:12         │
│        [ Hoàn tác ]    [ Thành ]                │
└──────────────────────────────────────────────┘
```

### 6.6 Đường cong độ khó

Không có độ khó. Mức tinh thông mở thêm **công cụ và đề**: Sơ (4/6 nhánh, bút, chấm), Trung (8 nhánh, tem sen, gương), Thâm (12 nhánh, tô vùng, đề «Một màu Dụng»), Viên Thông (đề «Chín vòng» và khung tranh lớn cho đạo tràng môn phái).

### 6.7 Chấm điểm (hoàn thành, không thẩm mỹ)

```
c = min(1, độPhủ / 0,6)                       (độ phủ tính trên diện tích vòng)
t = min(1, thờiGianVẽThật / 6 phút)           (thời gian có nét vẽ, không tính treo)
e = 1 nếu dùng ≥ 3 màu hoặc làm đúng đề đã chọn, 0,5 nếu không
s = 0,45·c + 0,35·t + 0,20·e                   (không có s_min; nhấn «Thành» khi c ≥ 0,35/0,6 và ≥ 3 phút)
thô = 5 × f(s) × K_lặp × K_hư
```

Đề «Vòng tương sinh» đúng thứ tự (kiểm bằng màu chiếm ưu thế ở từng vòng đồng tâm) → `e = 1` và hiện câu giảng tương sinh.

**Ví dụ (`MAU-A`, Am Vân Cốc — phân đàn MT, Thổ, không hợp Dụng/Hỷ):** độ phủ 52%, vẽ 7 phút, làm đúng đề → `c = 0,867`, `t = 1`, `e = 1` → `s = 0,39 + 0,35 + 0,2 = 0,94` → `f = 0,958` → thô 4,8 → ĐH 5,7.

### 6.8 Phần thưởng

| Hạng mục | Giá trị |
|---|---|
| Thô | ≤ 5 / lượt |
| Nguyên Khí | −4 |
| Phúc Khí | `round(thô × 0,5)` |
| Nhật Khóa | 1 việc nhóm **Nghệ** |
| Vật phẩm | tranh treo được trong nhà riêng (tài liệu 08 có mô-đun khung tranh) |
| Thưởng «buông» | nếu người chơi **xóa** tranh vừa vẽ (không lưu): +1 thô ngoài trần, một lần / ngày — nối ý vô thường với `MG-05` |

### 6.9 Trạng thái thất bại

Không có thất bại. Thoát trước 3 phút: tranh nháp được giữ, chưa tính lượt.

```
[CẢNH MG-18.1 · Am Vân Cốc · giờ Thân · người chơi chọn xóa tranh]
VÂN CỐC THIỀN SƯ (van_coc): (nhìn vòng hoa tan dần trên mặt giấy) Tiếc không?
> Lựa chọn: ① «Có chút tiếc.» → VÂN CỐC: «Tiếc là thật. Buông cũng là thật. Hai cái ở cùng nhau được.»  ② «Không ạ.» → VÂN CỐC: «Vậy mai vẽ cái khác. Cái này đã làm xong việc của nó rồi.»
```

### 6.10 Trợ năng (riêng)

- Chế độ «điểm chạm»: thay vì kéo, chạm từng điểm, game nối thành nét mượt.
- Bảng màu có chữ và ký hiệu hành (`09-03` §13.3).
- Không giới hạn thời gian; tự lưu nháp mỗi 30 giây.

### 6.11 Chống gian (riêng)

- `t` đo thời gian **có nét vẽ mới** (máy chủ nhận nhật ký nét nén), không tính lúc treo.
- Tranh công khai qua lọc nội dung: chỉ là nét, màu (không có ô chữ); có nút báo cáo; tranh bị báo cáo ≥ 3 lần ẩn chờ duyệt.
- Không có xếp hạng tranh theo lượt thích (tránh chấm thẩm mỹ gián tiếp); chỉ có mục «Người tu khác vừa vẽ».

### 6.12 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `mandala_draw_done` | `folds, mirror, theme, colors_used, coverage, draw_ms` |
| `mandala_release` | `kept / public / erased` |
| `mandala_report` | `target_id, reason` |

Câu hỏi đo: tỉ lệ «xóa» tăng sau khi người chơi đã chơi `MG-05` (giả thuyết: bài học vô thường lan sang).

### 6.13 iOS

Giữ nguyên (trưng bày công khai tuân thủ quy định nội dung do người dùng tạo của App Store: có báo cáo, chặn, lọc).

### 6.14 Nghiệm thu

- [ ] Đối xứng 4 / 6 / 8 / 12 nhánh, gương bật / tắt, hoàn tác 50 bước.
- [ ] Bảng màu đúng mã màu `WX_GIATRI`.
- [ ] Chấm chỉ theo hoàn thành (phủ, thời gian, đề) — không có thành phần thẩm mỹ.
- [ ] Thưởng «buông» chỉ khi xóa tranh **vừa vẽ** và chưa lưu, 1 lần / ngày.
- [ ] Báo cáo, ẩn tranh, không bảng xếp hạng lượt thích.
