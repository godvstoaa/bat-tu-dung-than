# 12 · Trình bày — Phần 07: Hệ thống thiết kế (kiểu chữ, màu, biểu tượng, thành phần, chuyển động, âm phản hồi, rung)

> Chuẩn hóa những gì `game.css` đang làm rải rác thành **mã thiết kế (token)** dùng chung cho giao diện HTML và cho cảnh 3D. Mọi giá trị ghi «(đã có)» là con số đang chạy trong code; «★» là đề xuất mới.

---

## 1. Kiểu chữ

### 1.1 Yêu cầu

1. Tiếng Việt **đầy đủ dấu**, kể cả chồng dấu trên chữ có móc (Ử, Ợ, Ẫ, Ỡ) không bị cắt ở dòng cao 1,5.
2. Chữ Hán **phồn thể** (engine ghi phồn thể: `劫財`, `七殺`, `華蓋`) và có cả giản thể (chuỗi engine có lẫn: `败`, `盖`, `补`, `做功` — xem UI-22).
3. Chữ trang trí kiểu bút lông cho khoảnh khắc nghi thức (UI-04, UI-33).
4. Dung lượng tải ban đầu ≤ 600 KB phông trên mạng di động.
5. Giấy phép mở (SIL OFL) để đóng gói trong app iOS / Android.

### 1.2 Bộ phông

| Vai | Phông | Dự phòng | Giấy phép | Ghi chú |
|---|---|---|---|---|
| Giao diện (nút, nhãn, HUD, bảng) | ★ **Be Vietnam Pro** 400 / 500 / 600 | `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` (đã có) | OFL | thiết kế cho tiếng Việt; dấu cân, rõ ở 11–13 px |
| Tiêu đề, thoại, kinh, câu trích | **Noto Serif** 400 / 600 / 400 nghiêng (đã có ở `h1, h2, h4`) | `"Times New Roman", serif` (đã có) | OFL | có đủ dấu tiếng Việt |
| Chữ Hán thường (trụ, nhãn, quẻ) | ★ **Noto Serif TC** 600 / 700 | `"Noto Serif SC", "Songti SC", "PMingLiU", serif` | OFL | hiện CSS ghi `Noto Serif SC` trước — đổi TC lên trước vì engine dùng phồn thể (TC có dáng chữ phồn chuẩn Đài; SC cho chữ giản lẫn trong chuỗi engine) |
| Chữ Hán trang trí (bút lông) | ★ **LXGW WenKai TC** (霞鶩文楷) | Noto Serif TC | OFL | cho chữ lớn ở UI-01, UI-04, UI-33, biển trong cảnh 3D |
| Số liệu, phím | `ui-monospace, monospace` (đã có ở `kbd`) | — | — | dùng `font-variant-numeric: tabular-nums` cho cột số |

### 1.3 Thang cỡ chữ (token)

Thang gom từ các cỡ đang dùng trong `game.css`. Tất cả nhân với `--hq-fs` (cài đặt cỡ chữ UI-76: 0,85 / 1 / 1,15 / 1,3 / 1,5).

| Token | px (100%) | Dùng ở (đã có) |
|---|---|---|
| `--fs-2xs` | 11 | nhãn ô điểm danh, chữ phụ bàn chữ giải án |
| `--fs-xs` | 12 | chip HUD, nhãn dock, nhãn trụ, `.hq-label.hq-name` |
| `--fs-sm` | 13 | nhãn gian 3D, thẻ Tàng Y Các, hào quẻ |
| `--fs-md` | 14 | `.hq-sub`, toast, `.hq-who` |
| `--fs-base` | 15 | thân bảng (`.hq-root` 15 px / 1,55) |
| `--fs-lg` | 17 | `.hq-big`, `.hq-calm`, thoại ★ |
| `--fs-xl` | 18 | `.hq-welcome`, `.hq-poem`, màn tải |
| `--fs-2xl` | 20 | tiêu đề bảng `h2`, `.hq-travel b` |
| `--fs-3xl` | 24 | chữ trụ nhỏ `.hq-pillars.sm` |
| `--fs-4xl` | 30 | `h1` cổng |
| `--fs-han-lg` | 34 | chữ trụ lớn `.hq-pl-char`, Vận Mệnh `.hq-van-head .hq-han` |
| `--fs-han-xl` | 40 | `.hq-gate-han` |
| `--fs-num-xl` | 44 | ngày lớn `.hq-date b` |

**Luật:** cỡ nhỏ nhất ở 100% là 11 px (chỉ chữ phụ); văn bản đọc chính ≥ 15 px; thoại ≥ 17 px. Ở cỡ 150%, bố cục dọc 390 px phải còn đọc được không cuộn ngang — các lưới 6 cột (`.hq-tiles`) tự xuống 4 cột, lưới 4 cột (trụ) giữ 4 nhưng chữ Hán trần 30 px.

### 1.4 Dòng và khoảng chữ

| Loại | `line-height` | `letter-spacing` |
|---|---|---|
| thân tiếng Việt | 1,55 (đã có) | 0 |
| thoại, kinh | 1,7–1,75 | 0 |
| tiêu đề serif | 1,25 | 0 |
| chữ Hán trang trí | 1,0–1,15 | giãn: `.hq-gate-han` 12 px (đã có), `.hq-van-head .hq-han` 4 px (đã có) |
| chữ hoa nhỏ (tên người nói) | 1,2 | 0,06 em |

**Không** dùng `letter-spacing` âm với tiếng Việt (dấu dính nhau). **Không** in hoa toàn bộ câu dài (dấu thanh trên chữ hoa khó đọc) — chỉ nhãn ngắn ≤ 3 từ.

### 1.5 Chữ Hán kèm Hán Việt (ruby)

Ba kiểu, chọn theo chỗ:

| Kiểu | Khi dùng | Mẫu |
|---|---|---|
| **Dưới** | ô trụ, ô bàn chữ (đã có `.hq-tile small`) | 庚 / Canh |
| **Bên cạnh** | dòng chữ, nhãn | 七殺 Thất Sát |
| **Ruby trên** (`<ruby>`) | văn bản cổ dài (kinh, trích Trích Thiên Tủy) | 天<rt>thiên</rt>道<rt>đạo</rt> |

Cài đặt «Chữ Hán luôn kèm Hán Việt» (UI-76) tắt thì chỉ còn chữ Hán, chạm để hiện Hán Việt (popover UI-57).

### 1.6 Đóng gói phông

| Phông | Cách cắt | Dung lượng ước (woff2) |
|---|---|---|
| Be Vietnam Pro (3 độ đậm) | bộ Latin + Latin Extended + Vietnamese (`unicode-range` U+0000-00FF, U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB) | ≈ 3 × 28 KB |
| Noto Serif (3 kiểu) | như trên | ≈ 3 × 45 KB |
| Noto Serif TC 700 | **tập con tĩnh**: mọi chữ Hán trong `src/engine/constants.js`, dữ liệu game (thoại, nhãn, bia), 60 hoa giáp, 64 quẻ, tên thần sát (ước 2.500–3.500 chữ) + phần còn lại cắt thành lát 100 chữ tải lười theo `unicode-range` | lõi ≈ 450 KB; lát ≈ 15–25 KB |
| LXGW WenKai TC | tập con nhỏ chỉ các chữ trang trí cố định (≈ 300 chữ) | ≈ 120 KB |

**Dự phòng cho chữ hiếm** (AI trả lời có chữ Hán ngoài tập con): rơi về phông hệ thống (`PMingLiU` / `Songti` / `Noto Sans CJK` của Android). Không vẽ ô vuông «tofu»: kiểm tự động bằng `document.fonts.check()` trên chuỗi; thiếu thì tải lát tương ứng.

**Chuẩn hóa:** mọi chuỗi tiếng Việt nhập vào (tên, điều ước) chuẩn hóa NFC (đã làm trong `protocol.js › cleanName`); chuỗi hiển thị từ dữ liệu cũng NFC để tránh lệch dấu khi tổ hợp.

---

## 2. Màu

### 2.1 Token gốc (đã có trong `:root` của `game.css`)

| Token | Giá trị | Vai |
|---|---|---|
| `--hq-night` | `#14111c` | nền ngoài cùng |
| `--hq-ink` | `#1d1822` | nền phụ |
| `--hq-card` | `#221c27` | nền thẻ, bảng |
| `--hq-line` | `#3a3040` | viền |
| `--hq-paper` | `#f3e7cf` | chữ chính |
| `--hq-dim` | `#b8a98f` | chữ phụ |
| `--hq-son` | `#b3261e` | son — nút chính, nhấn |
| `--hq-gold` | `#d6a84a` | vàng — tiêu đề, focus, mốc |
| `--hq-wood` | `#6b3f26` | gỗ |
| `--wx-moc` | `#4fa463` | Mộc |
| `--wx-hoa` | `#e0533f` | Hỏa |
| `--wx-tho` | `#c99a4a` | Thổ |
| `--wx-kim` | `#cfc8b8` | Kim |
| `--wx-thuy` | `#4b7cc7` | Thủy |

### 2.2 Giá trị đang viết cứng → đề xuất token (★)

| Giá trị cứng trong CSS | Dùng ở | Token mới |
|---|---|---|
| `#2d2533` | nền nút `.hq-btn` | `--hq-btn` |
| `#2b2430` | chip, tab, thanh trống | `--hq-chip` |
| `#17121b` | dock, dòng trợ giúp | `--hq-dock` |
| `#17131b` | ô nhập | `--hq-input` |
| `#1b161f` | khung tin nhắn, phản hồi, trích | `--hq-well` |
| `#8e8170` | `.hq-note`, `.hq-fine` | `--hq-note` (đổi giá trị, xem §2.3) |
| `#ff8f86` | lỗi, nút nguy hiểm | `--hq-err` |
| `#f1b05c` | cảnh báo | `--hq-warn` |
| `#fff8ea` | chữ trên nút son | `--hq-on-son` |
| `#d2463c` / `#c7302a` | viền / hover nút son | `--hq-son-edge` / `--hq-son-hover` |
| `#e0533d` | Neo đỏ | `--hq-flag` |
| `#ffcf7a` | khóa 🔒 | `--hq-lock` |
| `#ff4a3a` | chấm thông báo | `--hq-badge` |

### 2.3 Kiểm tra tương phản (đã tính, WCAG 2.x)

| Chữ / nền | `--hq-card` #221c27 | `--hq-btn` #2d2533 | `--hq-night` #14111c | Đạt AA (4,5) chữ thường? |
|---|---|---|---|---|
| `--hq-paper` | 13,57 | 12,04 | 15,21 | đạt |
| `--hq-dim` | 7,21 | 6,40 | 8,09 | đạt |
| `--hq-gold` | 7,57 | 6,71 | 8,48 | đạt |
| `#8e8170` (note) | **4,37** | **3,88** | 4,90 | **không** trên thẻ và nút |
| `--wx-thuy` #4b7cc7 | **3,96** | **3,52** | **4,44** | **không** |
| `--wx-hoa` #e0533f | **4,34** | **3,85** | 4,86 | **không** trên thẻ |
| `--wx-moc` #4fa463 | 5,40 | 4,79 | 6,06 | đạt |
| `--wx-tho` #c99a4a | 6,49 | 5,76 | 7,28 | đạt |
| `--wx-kim` #cfc8b8 | 9,98 | 8,85 | 11,19 | đạt |
| `--hq-son` #b3261e (làm chữ) | 2,54 | 2,26 | 2,85 | không — **son chỉ làm nền / viền, không làm chữ trên nền tối** |
| `#fff8ea` trên `--hq-son` | — | — | — | 6,18 — đạt |
| `#2a1d10` trên `--hq-paper` (thẻ xăm) | — | — | — | 13,37 — đạt |

**Sửa (★):**

| Token | Cũ | Mới | Tương phản mới (thẻ / nút) |
|---|---|---|---|
| `--hq-note` | `#8e8170` | `#a09381` | 5,53 / 4,91 |
| `--wx-thuy-text` (chữ) | dùng `#4b7cc7` | `#7aa3e6` | 6,50 / 5,76 |
| `--wx-hoa-text` (chữ) | dùng `#e0533f` | `#ee7461` | 5,78 / 5,13 |

Giữ `--wx-thuy` và `--wx-hoa` gốc cho **mảng màu** (thanh, cánh hoa, chấm) vì đồ họa không chữ chỉ cần 3:1 (cả hai > 3,5). Lớp `.wx-thuy`, `.wx-hoa` khi tô **chữ** (vd chữ trụ `.hq-pl-char`) đổi sang token `-text` — chữ trụ 34 px đậm là «chữ lớn» (ngưỡng 3:1) nên vẫn đạt, nhưng chữ trụ nhỏ 24 px ở `.hq-pillars.sm` cũng là chữ lớn (≥ 18,66 px đậm) — đạt; còn chữ Hán 13–15 px trong câu thì phải dùng `-text`.

### 2.4 Màu đạo thống (huy hiệu NPC, viền bong bóng AI, môn phái)

Lấy **một màu chủ** từ bảng màu khóa của mỗi thánh địa (bản tổng §7), chỉnh độ sáng cho nền tối:

| Đạo thống | Thánh địa | Màu khóa gốc | Token giao diện | Chữ Hán huy hiệu |
|---|---|---|---|---|
| Chính Nhất | Long Hổ | đỏ trầm `#7A2A1E` | `--dt-zhengyi: #a8452f` | 正 |
| Thanh Vi · Đan Đỉnh | Võ Đang | lục lưu ly `#2F7A55` | `--dt-wudang: #3f9a6c` | 武 |
| Toàn Chân · Linh Bảo | Chung Nam | lam toàn tỉ `#2E5C8A` | `--dt-quanzhen: #4a7fb5` | 全 |
| Thượng Thanh · Lư Sơn | Mao Sơn | lục trúc `#6D9B57` | `--dt-maoshan: #7fb066` | 茅 |
| Thiền Trúc Lâm | Yên Tử | lục tùng `#2F4F3A` | `--dt-truclam: #4f7d5f` | 禪 |
| Tịnh Độ | Bút Tháp | hồng sen `#E8A1B4` | `--dt-tinhdo: #e8a1b4` | 淨 |
| Mật (Chuẩn Đề) | Tạng Địa | lam hồ `#3FA7C9` | `--dt-mat: #3fa7c9` | 密 |
| Nho · Tịnh Minh | Văn Miếu | vàng hoàng `#C6A044` | `--dt-nho: #c6a044` | 儒 |
| Bắc Đế · Động Uyên | Phong Đô | lam ma `#3E7FA8` | `--dt-phongdo: #5a95bd` | 酆 |
| Bàng môn (vu y) | Miêu Cương | lục sông `#3D8A78` | `--dt-mieu: #4fa08c` | 苗 |
| Quy nhất | Côn Lôn | lam trời `#7FB7E6` | `--dt-conlon: #7fb7e6` | 崑 |
| Tử Bình (thầy chính) | Sơn Môn | son | `--hq-son` | 子 |
| Liễu Phàm (Vân Cốc) | Am Vân Cốc | giấy cũ | `--dt-vancoc: #c9b98f` | 雲 |
| Định Mệnh Hội (phản diện) | quầy «đổi mệnh» | tím than | `--dt-dmh: #6d5a86` | 定 |

Huy hiệu luôn có **chữ Hán** (không phân biệt bằng màu đơn thuần). Màu đạo thống không bao giờ dùng cho nút hành động chính.

### 2.5 Màu ngũ hành — bốn bộ đang song song (cần thống nhất)

| Hành | CSS `--wx-*` (chữ / UI) | `render.js › ROBE` (áo, chấm màu áo) | `progress.js › WX_GIATRI` (gia trì) | `render3d.js › WX_COLOR` (ăn mừng) |
|---|---|---|---|---|
| 木 | `#4fa463` | `#3f8a4f` | `#58c46a` | `#5fd27a` |
| 火 | `#e0533f` | `#b3261e` | `#ff6a3c` | `#ff5a3c` |
| 土 | `#c99a4a` | `#b0843a` | `#d9a64a` | `#f0b54a` |
| 金 | `#cfc8b8` | `#d9d4c7` | `#f2e6b8` | `#f4efe0` |
| 水 | `#4b7cc7` | `#2c4f8a` | `#4f9cff` | `#4f9bff` |

**Quy định (★):** giữ **ba tầng có chủ đích**, đặt tên rõ, gom về một tệp `wx-palette.js`:

| Tầng | Tên | Dùng | Lấy từ |
|---|---|---|---|
| vải | `WX.cloth` | áo, đai, chấm màu áo (vật liệu PBR, tối hơn) | `ROBE` |
| giao diện | `WX.ui` / `WX.uiText` | thanh, cánh hoa, chữ | `--wx-*` + `-text` |
| phát sáng | `WX.glow` | hào quang, linh khí, ăn mừng (cộng sáng, bloom) | gộp `WX_GIATRI` và `WX_COLOR` thành một (lấy `WX_GIATRI`) |

Bộ mù màu (phần 14 §2) thay **cả ba tầng** đồng loạt.

### 2.6 Màu trạng thái và bậc hiếm

| Nghĩa | Màu | Kèm (không chỉ màu) |
|---|---|---|
| tốt / cát / đúng | `--wx-moc` (lớp `.good`) | ✓, chữ «Cát / Tốt» |
| vừa | `--hq-gold` (`.mid`) | △, chữ «Bình / Vừa» |
| chưa tốt / hung | `#8a3a32` viền, `#ff9a86` chữ (`.bad`) | ⚠, chữ «Hung / Chưa khớp» |
| khóa | `--hq-lock` | 🔒 + điều kiện |
| tâm ma, nghiệp | ★ `#7a5f8f` | chữ Hán 貪瞋癡 |
| Tà Lộ, Nợ Âm | ★ `#5b3f6e` nền | chữ 陰 |
| bậc Phàm / Linh / Huyền / Tiên / Thần | `#b9b2a4` / `#6fd48a` / `#5aa8ff` / `#c58bff` / `#ffc44a` (đã có) | ★ ○ ◇ △ ☆ ✺ |

**Luật P2:** đỏ thật (`--hq-son`, `#e0533d`) chỉ dùng cho: nút chính (nền), cảnh báo Neo, nút xoá dữ liệu. **Không** dùng cho điểm thấp, phạm Thái Tuế, cột 過, tâm ma.

---

## 3. Kích thước, khoảng cách, bo góc, độ nổi

### 3.1 Vùng chạm

| Thành phần | Hiện có | Chuẩn ★ |
|---|---|---|
| nút icon HUD `.hq-hbtn.icon` | 40 × 40 | **44 × 44** |
| nút dock | ≥ 76 × 48 | giữ |
| lựa chọn `.hq-choice` | cao ≥ 42 | **44** |
| ô bàn chữ `.hq-tile` | cao ≥ 52 | giữ |
| nút hành động cảm ứng | 92 | giữ |
| cụm độ cao | 58 | giữ |
| khoảng cách tối thiểu giữa hai vùng chạm | — | 8 px |

### 3.2 Thang khoảng cách (★ token, gom từ CSS)

`--sp-1: 4px` · `--sp-2: 6px` · `--sp-3: 8px` · `--sp-4: 10px` · `--sp-5: 12px` · `--sp-6: 14px` · `--sp-7: 18px` · `--sp-8: 22px` · `--sp-9: 26px`. Đệm bảng: 12 × 18 (đã có). Khe lưới: 6–8 (đã có).

### 3.3 Bo góc

| Token | px | Dùng |
|---|---|---|
| `--r-xs` | 4 | `kbd`, thanh mảnh |
| `--r-sm` | 8 | ô nhập, chip vuông, nút HUD |
| `--r-md` | 10 | nút, ô trụ, ô chữ |
| `--r-lg` | 12 | thẻ, tin nhắn |
| `--r-xl` | 16 | bảng |
| `--r-2xl` | 18 | thẻ cổng |
| `--r-pill` | 99 | toast, chip, nhãn 3D, nút hành động |

### 3.4 Độ nổi (bóng)

| Mức | Giá trị (đã có) | Dùng |
|---|---|---|
| e1 | `0 3px 10px rgba(0,0,0,.5)` | núm cần |
| e2 | `0 6px 20px rgba(0,0,0,.45)` | nút hành động |
| e3 | `0 20px 60px rgba(0,0,0,.5)` | thẻ cổng |
| e4 | `0 24px 70px rgba(0,0,0,.6)` | bảng |

---

## 4. Biểu tượng

### 4.1 Vấn đề của emoji hiện tại

Giao diện hiện dùng emoji làm biểu tượng (`main.js › ICON`, `wardrobe-ui.js › ICON`, dock, toast). Bốn vấn đề:

1. **Khác nhau theo hệ điều hành** — cùng 🧭 trên iOS, Android, Windows là ba hình, ba màu, phá bảng màu trầm.
2. **Thiếu trên máy cũ** — 🪷 (sen), 🪭 (quạt), 🪔 (đèn dầu), 🪽 (cánh) thuộc Unicode 13–15, Android < 12 và Windows 10 hiện ô trống.
3. **Sai văn hóa** — ⛩ là cổng torii Thần đạo Nhật, đang dùng cho cổng đại vận và màn «Bước vào» điện thờ Đạo giáo / Việt. 🙇 là cúi chào kiểu Nhật.
4. **Không tô màu theo token**, không chỉnh nét, không nhìn rõ ở 12 px.

### 4.2 Bộ «Huyền Ấn» (★ SVG riêng)

- Lưới 24 × 24, vùng an toàn 20 × 20, nét 1,75 px, đầu nét tròn, góc nối tròn; kiểu **nét bút lông khô** (đầu nét hơi vát) để hợp văn tu.
- Tô `currentColor` — nhận màu token.
- Biến thể: viền (mặc định), đặc (trạng thái đang chọn), ấn son (vuông bo, nền son, chữ / hình trắng — cho dấu hành hương, đóng ấn).

### 4.3 Bảng thay thế emoji → Huyền Ấn (lõi ≈ 64 biểu tượng)

| Emoji hiện có | Dùng ở | Id Huyền Ấn | Hình |
|---|---|---|---|
| 📜 | Bàn Thầy, Sổ Mệnh | `hy-scroll` | cuộn giấy nửa mở |
| 🧭 | La Bàn, Dương Trạch | `hy-luopan` | đĩa la bàn có kim |
| 🎋 | Ống Xăm | `hy-qian` | ống tre có que |
| 🕯 | Lư Hương | `hy-incense` | lư ba chân, ba nén |
| 📅 / 🗓 | Lịch, Trạch Nhật | `hy-almanac` | lịch treo chữ 日 |
| 🍵 | Trà Thất, mời trà | `hy-tea` | chén trà có hơi |
| 🪷 | Hồ Sen, sen | `hy-lotus` | sen nở |
| ❓ | án khách | `hy-case` | thẻ gỗ có dấu hỏi kiểu chữ |
| 🌡 | Điều Hậu | `hy-hannuan` | nửa băng nửa lửa |
| 📚 | Thư Lâu | `hy-books` | chồng sách đóng chỉ |
| 💞 | Hợp Hôn | `hy-knot` | nút thắt đồng tâm |
| ✨ | Tử Vi, gia trì | `hy-stars` | ba sao |
| 👁 | Tượng Pháp | `hy-xiang` | mắt trong tượng |
| 🏯 | Cách Cục | `hy-pagoda` | lầu hai mái |
| 🪨 | Bia Vận Mệnh | `hy-stele` | bia đá đế rùa |
| ⛩ | cổng đại vận, vào điện | `hy-gate` | **cổng tam quan / bài phường** (thay torii) |
| 🪔 | Thái Tuế | `hy-oillamp` | đèn dầu đĩa |
| 👘 | Y Các, phẩm phục | `hy-robe` | đạo bào cổ chéo |
| 📋 | nhiệm vụ | `hy-tasks` | thẻ tre ghi việc |
| 💬 | Giao lưu | `hy-talk` | hai bong bóng mây |
| ☰ | Các gian | `hy-halls` | ba mái chồng |
| 🗺 ★ | bản đồ | `hy-map` | họa đồ cuộn |
| 🗡️ | ngự kiếm, kiếm gỗ | `hy-sword` | kiếm thẳng |
| 🔈 / 🔇 | âm thanh | `hy-bell` / `hy-bell-off` | chuông / chuông gạch chéo |
| ✦ | Phúc Khí | `hy-phuc` | chữ 福 tròn nhỏ |
| 💎 | Ngọc | `hy-jade` | ngọc bích vòng |
| 🔥 | chuỗi ngày | `hy-streak` | ngọn nến |
| 👥 | trong phòng | `hy-people` | hai người |
| 👑 | VIP, mũ | `hy-crown` / `hy-guan` | đạo quan (không vương miện Tây) |
| 🎁 | quà | `hy-gift` | hộp gói lụa |
| 🏮 | thành tựu | `hy-lantern` | đèn lồng |
| 🙇 | cúi chào | `hy-bow` | người cúi (kiểu Việt / Hoa: chắp tay) |
| 🙏 | chắp tay | `hy-palms` | hai tay chắp |
| 👏 | vỗ tay | `hy-clap` | — |
| 👋 | vẫy tay | `hy-wave` | — |
| 🤔 | suy ngẫm | `hy-think` | người ngồi tay chống cằm |
| 🙈 | ẩn người | `hy-hide` | quạt che |
| ⚑ | báo cáo | `hy-flag` | cờ đuôi nheo |
| 🎙 | hỏi Thầy AI | `hy-ask` | bút lông trên bong bóng |
| 🎯 | Neo khớp | `hy-anchor` | mỏ neo trong vòng |
| ⚠ | Neo đỏ, cảnh báo | `hy-caution` | tam giác nét mảnh |
| 🔒 | khóa | `hy-lock` | khóa đồng cổ |
| 🎲 | tên ngẫu nhiên | `hy-dice` | xúc xắc tre |
| 🐎 / ⛵ / 🕊 | trạm | `hy-horse` / `hy-boat` / `hy-crane` | — |
| 🌸 🔥 ☯️ ⚡ ❄️ (hào quang) | Tàng Y Các | `hy-aura-*` | theo món |
| ☁️ 🏺 🕊️ (ngự vật) | Tàng Y Các | `hy-mount-*` | theo món |
| ★ mới | — | `hy-menhban` (la bàn vòng), `hy-menhdo` (núi sáu bậc), `hy-congqua` (sổ 功過), `hy-realm` (☯ biến thể), `hy-codex` (sách chữ 典), `hy-settings` (bánh xe pháp đơn giản — tránh bánh răng công nghiệp), `hy-photo` (khung tranh), `hy-calendar-lunar` (trăng + lịch), `hy-sect` (lá cờ môn phái), `hy-master` (thầy – trò), `hy-bond` (dây đồng tâm), `hy-inbox` (phong thư), `hy-season` (lá + năm) | |

**Emoji vẫn được dùng** ở: cử chỉ trong bong bóng 3D (người chơi quen), nội dung do người chơi chọn (câu soạn sẵn). Nhưng cả ở đó cũng hiển thị bằng ảnh Huyền Ấn khi máy thiếu emoji (phát hiện bằng đo độ rộng glyph).

### 4.4 Ký hiệu chữ (không phải hình)

| Ký hiệu | Nghĩa | Ở |
|---|---|---|
| 用 喜 忌 仇 | Dụng / Hỷ / Kỵ / Cừu | Mệnh Bàn, Ngũ Hành |
| 主 缺 | trục mạnh / khuyết | Ngũ Duy |
| ◆ ◈ ◇ ✧ ☯ ✺ ☾ | loại nhiệm vụ | UI-16, UI-43, bản đồ |
| ○ ◐ ● | chưa / đang / xong | Mệnh Đồ, nhiệm vụ |
| ○ △ × | cát / bình / kỵ | Trạch Nhật, la bàn |
| ① ② ③ ④ | lựa chọn thoại | UI-40 |

---

## 5. Thành phần (component)

| Thành phần | Lớp CSS hiện có | Biến thể | Trạng thái bắt buộc | Ghi chú ★ |
|---|---|---|---|---|
| Nút | `.hq-btn` | chính `.hq-primary` (son), to `.hq-big`, nguy hiểm `.danger`, liên kết `.hq-link` | thường / hover viền vàng / focus viền vàng 2 px / bấm / tắt (mờ 45%) / đang xử lý (chữ đổi) | thêm `aria-busy` khi đang xử lý |
| Nút HUD | `.hq-hbtn`, `.icon`, `.on` | — | bật viền vàng + quầng | 44 px |
| Nút dock | `.hq-dbtn`, `.dot` | — | `:active` nền chip | `aria-current` |
| Chip | `.hq-chip` | `.hq-online.off` | — | chip chạm được → `button` |
| Thẻ chọn | `.hq-choice`, `.wide`, `[aria-pressed=true]` | — | chọn: nền `#4a2a20` viền vàng | — |
| Thẻ (tab) | `.hq-tabs .hq-tab .on` | **hai định nghĩa trùng** trong `game.css`: kiểu gạch chân (Sổ Mệnh) và kiểu viên thuốc (Giải Quẻ) — quy tắc sau đè quy tắc trước, nên Sổ Mệnh đang hiện kiểu viên thuốc | — | ★ tách hai lớp: `.hq-tabs--line` và `.hq-tabs--pill` |
| Ô nhập | `.hq-input` | `select.hq-input` | focus viền vàng; tắt mờ 45% | — |
| Thanh số | `.hq-bar` (nhãn · thanh · số), `.hq-meter`, `.hq-wxbar`, `.hq-steps` | — | — | thêm `role="meter"` + `aria-valuenow` |
| Vòng điểm | `.hq-score .good/.mid/.low` | — | — | thêm chữ đánh giá |
| Trích dẫn | `.hq-quote`, `.hq-cite` | — | — | — |
| Thẻ giấy | `.hq-stick-card` | — | — | dùng lại cho kinh (UI-56) |
| Bảng | `.hq-panel`, `.peek`, `.full` | ★ `.side` | — | — |
| Toast | `.hq-toast` | ★ T1–T3 | `.out` | — |
| Nhãn 3D | `.hq-label`, `.near`, `.hq-name`, `.gold`, `.hq-frame-*` | — | — | — |
| Bong bóng | `.hq-bubble`, `.master` | ★ `.npc` (viền màu đạo thống) | — | — |
| Tin nhắn AI | `.hq-msg .q/.a .streaming`, `.hq-neo .bad` | — | — | — |
| Ấn son ★ | (mới) `.hq-seal` | vuông / tròn | — | đóng dấu hành hương, đóng ấn kết phù |

---

## 6. Chuyển động

### 6.1 Thời lượng (đã có → chuẩn)

| Token ★ | Giá trị | Đang dùng ở |
|---|---|---|
| `--t-instant` | 100 ms | thanh `.hq-meter` (`width .1s`) |
| `--t-fast` | 180 ms | bảng nổi lên `hq-rise .18s` |
| `--t-base` | 250 ms | sheet đổi nấc (`max-height .25s`), nhãn đổi màu (`.2s`) |
| `--t-slow` | 450–500 ms | lật trụ `hq-flip .45s / .5s`, hiện luận `opacity .5s` |
| `--t-scene` | 550 ms | màn chuyển `.hq-travel` |
| `--t-coin` | 600 ms | xu gieo `hq-coin .6s` |
| `--t-ritual` | 4–9 s | lễ nhập môn, đột phá |
| `--t-breath` | 14 s chu kỳ | vòng thở |

### 6.2 Đường cong

| Token | Giá trị | Dùng |
|---|---|---|
| `--ease-out` | `cubic-bezier(.2,.7,.2,1)` | hiện ra, nổi lên |
| `--ease-in` | `cubic-bezier(.5,0,.8,.3)` | biến mất |
| `--ease-ink` | `cubic-bezier(.3,0,.2,1)` | nét mực, vòng điểm — chậm đầu nhanh giữa chậm cuối như bút lông |
| `--ease-breath` | `ease-in-out` | thở, đèn chập chờn |

### 6.3 Luật chuyển động

1. **Không rung lắc màn hình** trừ khoảnh khắc nghi thức (UI-33) và chỉ khi bật «Rung lắc camera».
2. Không nhấp nháy > 3 lần / giây (chuẩn chống động kinh).
3. Mọi hoạt ảnh trang trí dừng khi `reduced` (đã có quy tắc CSS toàn cục `animation: none !important; transition: none !important`). Hoạt ảnh **mang thông tin** (vòng thở, tiến độ) đổi sang dạng không chuyển động (chữ, độ sáng), không biến mất.
4. Không hoạt ảnh vào–ra cho danh sách dài (> 12 dòng).
5. Chữ thoại gõ dần 28 ký tự / giây; dừng khi `reduced`.
6. 3D: kim la bàn run, khói nhang, cánh đào, hạt gia trì — đã tắt khi `reduced` (`render3d.js`); xem phần 12 §7.

---

## 7. Âm phản hồi giao diện (tóm tắt — danh mục đầy đủ phần 10)

| Hành động | Âm | Âm lượng tương đối | Ghi chú |
|---|---|---|---|
| bấm nút thường | `SFX-UI-001` gõ gỗ nhẹ | −18 dB | không phát cho nút dock (quá thường) |
| hiện nút hành động | `SFX-UI-002` | −22 dB | chỉ khi đổi trạm |
| bật / tắt công tắc | `SFX-UI-004` | −18 dB | — |
| tiếp câu thoại | `SFX-UI-005` | −20 dB | — |
| chọn lựa chọn | `SFX-UI-006` | −16 dB | — |
| mở bảng | `SFX-UI-010` giở giấy dó | −16 dB | — |
| đóng bảng | `SFX-UI-011` gấp giấy | −18 dB | — |
| lỗi nhập | `SFX-UI-020` gỗ trầm | −16 dB | không chói, không «bíp» |
| thưởng Phúc Khí / Ngọc | `SFX-UI-040` | −14 dB | — |
| lên cấp / danh xưng / thành tựu | `SFX-PROG-001…004` | −10 dB | — |
| bật âm (đã có) | `bell(440, 0.1)` | — | thay bằng `SFX-BELL-003` |
| xong 3 việc (đã có) | `bell(660, 0.1)` | — | thay bằng `SFX-PROG-004` |

**Luật:** âm giao diện **không** dồn quá 3 âm / giây (gộp). Âm giao diện đi bus «Giao diện» riêng (UI-77) để người chơi tắt riêng mà vẫn nghe môi trường.

---

## 8. Bản đồ rung (haptics)

### 8.1 Hạ tầng hiện có (`haptics.js › buzz(kind)`)

| Kiểu | Native (Capacitor `Haptics.impact`) | Web (`navigator.vibrate`, chỉ màn cảm ứng, sau thao tác đầu) |
|---|---|---|
| `light` | `ImpactStyle.LIGHT` | 8 ms |
| `medium` | `ImpactStyle.MEDIUM` | 16 ms |
| `heavy` | `ImpactStyle.HEAVY` | 30 ms |

iOS Safari không hỗ trợ `navigator.vibrate` — trên web iOS không có rung (chỉ bản native có).

### 8.2 Sự kiện đang rung (đã có)

| Sự kiện | Kiểu | Nơi |
|---|---|---|
| mở một gian | light | `openStation` |
| đổi trạm gần (nút hành động đổi) | light | `updatePrompt` |
| vào / ra điện | light | `enterRoom` |
| bật / tắt bay | medium | `setFlying` |
| gửi cử chỉ / câu | light | Giao lưu |
| nhận cử chỉ gửi riêng | light | `onEvent emo` |
| lễ nhập môn hiện | medium | `showBirth` sau `chartOf` |
| xong 3 việc | medium | `after` |
| lên cấp mở gia trì | heavy | `after` |
| danh xưng mới | heavy | `after` |
| Thầy AI trả lời xong | light | `master-ui.js` |

### 8.3 Bổ sung (★) — mẫu rung có nhịp (chỉ native: dùng `Haptics.vibrate` / chuỗi impact)

| Sự kiện | Mẫu | Ý |
|---|---|---|
| lật trụ (UI-04) | 4 × light cách 350 ms | bốn tiếng thẻ tre |
| đóng ấn (UI-82) | heavy | ấn gỗ |
| gieo xu (UI-55) | 3 × light cách 60 ms | ba xu chạm bát |
| lắc ống xăm | light lặp 120 ms khi lắc | — |
| keo âm dương rơi | medium | — |
| lệch nhịp thở (UI-81) | light | nhắc nhẹ |
| lựa chọn dính nghiệp (UI-40) | medium | dừng lại suy nghĩ |
| xong tầng Mệnh Đồ | medium + light (cách 200 ms) | — |
| đột phá cảnh giới (UI-33) | light → medium → heavy (cách 300 ms) | dâng lên |
| tiếng chuông lớn trong cảnh khi đứng gần (< 6 m) | light | cảm nhận chuông |
| va vật cản khi chạy | — | **không rung** (tránh khó chịu khi đi lại) |
| lỗi nhập | light | — |
| nhận lời mời | medium | — |
| đang ngồi thiền | — | **không rung** trừ nhắc lệch nhịp |

### 8.4 Luật

1. Tôn trọng cài đặt «Rung: tắt» và chế độ im lặng / Không làm phiền của hệ điều hành.
2. Không quá 2 rung `heavy` trong 3 giây.
3. Rung **không** là kênh duy nhất của thông tin nào (luôn có hình hoặc âm đi kèm).
4. Cường độ toàn cục (UI-75): Nhẹ (mọi `heavy` → `medium`, `medium` → `light`) · Vừa (mặc định) · Tắt.
