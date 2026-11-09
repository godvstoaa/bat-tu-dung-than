# 12 · Trình bày — Phần 03: Sổ Mệnh và tiến trình tu (UI-20 → UI-37)

> Sổ Mệnh là màn mở nhiều nhất (nút phải cùng dock). Bản hiện có (`stations.js › openBook`) có 6 thẻ: Tu học · Hồ sơ · Xăm · Đèn · Thành tựu · Cài đặt. Bản AAA (§12 bản tổng) đổi thành: **Mệnh Bàn · Mệnh Đồ · Sổ Công Quá · Cảnh giới · Tủ đồ**, các thẻ cũ chuyển vào chỗ hợp lý (bảng §UI-20).
>
> Mọi ví dụ số liệu dùng lá số **`MAU-A`** (1990-05-15 08:30, nam) — đã chạy engine thật khi viết phần này: Tiềm Lực 41, «TRUNG ĐẲNG · Cân bằng, cần nỗ lực», bách phân vị 31, Phúc phận «khá no», Mệnh Cấp 清貴 Thanh Quý, Nguyên Khí 23, Thân quá vượng (effRatio 0,77), Dụng 水 · Hỷ 金 · Kỵ 土 · Cừu 火, 七殺格 có cứu (有救 → Đắc Cứu), Ngũ Duy Tài 26 · Quan 45 · Ấn 54 · Thực 15 · Tỷ 100, Lục Đạo 人道 (Tham 29 · Sân 37 · Si 27), thần sát: 學堂 Học Đường, 將星 Tướng Tinh, 華蓋 Hoa Cái, 天醫 Thiên Y, 天德 Thiên Đức, 月德 Nguyệt Đức, 魁罡 Khôi Cương, 流霞 Lưu Hà.

---

## UI-20 · Sổ Mệnh — khung thẻ (mã ngắn: `book`)

| | |
|---|---|
| Mục đích | Một quyển sổ cho mọi thông tin về chính mình |
| Lối vào | dock 📜; chạm danh tính HUD; phím B (★) |
| Nguồn | `stations.js › openBook(api, tab)`; tab đổi bằng cách mở lại bảng (đã có) |
| Dạng | half / full trên điện thoại; **side** 520 px trên máy tính ≥ 1280 px |

**Sắp xếp thẻ (★ M1):**

| Thẻ mới | Nội dung | Thẻ cũ gộp vào |
|---|---|---|
| Mệnh Bàn | UI-21 + UI-23…UI-26 | (mới) |
| Mệnh Đồ | UI-27, UI-28 | (mới) |
| Công Quá | UI-29, UI-30, UI-31, UI-37 | (mới) |
| Cảnh giới | UI-32, UI-34 | «Tu học» (mức thông thạo giải án, Án Cổ) chuyển thành mục «Nghề» trong thẻ này |
| Tủ đồ | lối tắt sang Tàng Y Các (UI-71) + Hồ sơ lá số (UI-35) | «Hồ sơ» |
| Nhật ký | Xăm, Đèn, án gần đây, lịch sử lễ | «Xăm», «Đèn» (web) |
| Thành tựu | UI-36 | «Thành tựu» |
| (bỏ) | Cài đặt → nút ⚙ HUD (UI-75) | «Cài đặt» |

**Khung dọc**

```
┌──────────────────────────────────────┐
│               ━━━━                   │  thanh kéo
│ Sổ Mệnh                          ✕   │
├──────────────────────────────────────┤
│ Thanh Vân · Môn Sinh · ✦ 120 (còn   │
│ 130 tới Đệ Tử) · chuỗi 3 ngày        │
│ Phúc Khí chỉ là điểm ghi nhận tiến   │  .hq-note bắt buộc (đã có)
│ bộ trong trò chơi — không phải phúc  │
│ đức hay vận may thật.                │
│ ┌──────┬──────┬──────┬──────┬────▸  │  thẻ cuộn ngang
│ │Mệnh  │Mệnh  │Công  │Cảnh  │Tủ đồ  │
│ │Bàn ● │Đồ    │Quá   │giới  │       │
│ └──────┴──────┴──────┴──────┴────   │
│  (nội dung thẻ)                      │
└──────────────────────────────────────┘
```

**Thành phần:** đầu sổ (tên, danh xưng, Phúc Khí, mốc kế, chuỗi), chú thích Phúc Khí (bắt buộc, đã có), `tablist` cuộn ngang (`.hq-tabs`, đã có `overflow-x: auto`), thân thẻ.

**Trạng thái**

| Ô | Hành vi |
|---|---|
| S-LOAD | thẻ cần engine nặng (Mệnh Bàn gọi `fiveDimRadar`, `classifyChartLevel`, `analyzeVitality`, `computeLiuDao`) → «Thầy đang giở sổ…» tối đa 600 ms; kết quả nhớ đệm theo khóa bát tự (giống `vanmenh-ui.js › memo`) |
| S-EMPTY | chưa có bát tự (vào thẳng từ link): «Thầy chưa có bát tự của bạn. Ra cổng quán chọn «Sửa bát tự».» (dùng lại câu của `vanmenh-ui.js › noBirth`) |
| S-ERR | một thẻ lỗi không làm hỏng thẻ khác; thẻ lỗi hiện câu S-ERR chuẩn |
| S-IOS | thẻ «Nhật ký» bỏ Xăm / Đèn; Mệnh Bàn giữ (chỉ số, không đoán vận) nhưng bỏ dòng Thời Vận; tên sổ «Sổ Tu Học» |
| S-LOCK | Mệnh Đồ khóa đến khi gặp Vân Cốc (MQ Hồi I): «Mệnh Đồ mở khi bạn gặp Vân Cốc thiền sư ở Am Vân Cốc.» |
| S-RM | đổi thẻ không trượt |

**Tương tác:** chạm thẻ → đổi nội dung **tại chỗ** (★ hiện mở lại cả bảng, mất vị trí cuộn); vuốt ngang thân thẻ → thẻ kế (điện thoại); phím ← → khi focus ở `tablist`.

**Trợ năng:** `role="tablist"` + `role="tab"` + `aria-selected` (đã có) + ★ `aria-controls` / `role="tabpanel"`. Chấm «●» thẻ có mục mới đọc là «có mục mới».

**Đo lường:** `ui_book_view {tab, from}`; `ui_book_tab {tab}`.

---

## UI-21 · Mệnh Bàn — la bàn vòng (mã ngắn: `menhban`)

| | |
|---|---|
| Mục đích | Toàn bộ chỉ số Tiên Thiên trong **một hình**: bốn trụ ở tâm, ngũ hành, Ngũ Duy, đặc tính, Phẩm căn — đúng §12 bản tổng |
| Lối vào | thẻ Mệnh Bàn; chạm danh tính HUD |
| Nguồn | (chưa có — cần làm) `menhban.js` gom `synthesis`, `wx`, `strength`, `fiveDimRadar`, `classifyChartLevel`, `analyzeVitality`, `shensha`, `liudao` |

### 21.1 Hình học (SVG, `viewBox="0 0 360 360"`, tâm 180,180)

| Vòng | Bán kính | Nội dung | Mã hóa |
|---|---|---|---|
| Tâm | 0–66 | bốn trụ dạng 2 × 4 chữ Hán (can trên, chi dưới), trụ ngày viền son | chữ 18 px Noto Serif SC; màu theo hành (bảng màu có thay thế mù màu, phần 14) |
| Vòng 1 — Ngũ Hành | 70–122 | 5 cánh hoa, mỗi cánh một hành, **chiều dài tỉ lệ `wx.pct`** (tối thiểu 4% để còn nhìn thấy, như `.hq-wxbar`) | cánh Dụng thần có viền vàng 2 px + chấm «用»; Kỵ thần viền đứt |
| Vòng 2 — Ngũ Duy | 126–156 | 5 cung tròn (72° mỗi cung), độ dày cung theo `dims[].score` (0–100) | trục mạnh nhất đậm + nhãn «主»; trục yếu nhất nhạt + nhãn «缺» |
| Vòng 3 — Đặc Tính | 160–172 | mỗi thần sát có mặt là một ngôi sao nhỏ đặt theo **địa chi nó đóng** (`shensha[k].at[]` → góc của chi) | sao cát vàng, sao «kiếp số» (血刃, 四廢) bạc |
| Vành — Phẩm căn | 176–180 | 10 đoạn cung (Phàm Căn → Thiên Linh Căn), đoạn của mình sáng | kim chỉ chạy vào đúng điểm (`score` trên thang 0–100 ánh xạ 0–360°) |
| Kim chỉ Thời Vận (web) | 66–180, mảnh | góc theo năm đang đi (`liunian[isNow]`) quanh 12 chi | chỉ hiện khi bật «Thời Vận» (mặc định bật trên web) |

**Bố cục cánh hoa:** năm cánh xếp theo **vòng tương sinh** Mộc → Hỏa → Thổ → Kim → Thủy theo chiều kim đồng hồ, đặt theo phương vị cổ với **Nam ở trên** như la bàn phong thủy: Hỏa (Nam) trên cùng, Thổ trên-phải, Kim (Tây) phải, Thủy (Bắc) dưới, Mộc (Đông) trái. Cách đặt này khớp đĩa la bàn và lưới 9 cung Dương Trạch đã có trong game (`compass`, `.hq-grid9`). Ghi chú nhỏ dưới đĩa: «Bàn vẽ theo lối cổ: Nam ở trên.»

### 21.2 Khung dọc

```
┌──────────────────────────────────────┐
│ Mệnh Bàn · Tiên Thiên         Vì sao?│
│                                      │
│            ╭─── 火 18% ───╮          │
│        ╭──╯   ·Quan 45·    ╰──╮      │
│      ╭╯  木6%   ┌──────┐  土18% ╰╮   │
│     │  ·Tài26·  │庚 庚 辛 庚│ ·Ấn54· │  │  tâm: tứ trụ
│     │           │辰 辰 巳 午│        │  │
│      ╰╮ 水2%用  └──────┘ 金55%  ╭╯   │
│        ╰──╮  ·Thực15 缺· ·Tỷ100 主·  │
│           ╰─────────────────╯        │
│   ★ ★ ☆ ★  (sao đặc tính theo chi)   │
│   ═══════[▲]══════════════════       │  vành Phẩm căn
│        Bàn vẽ theo lối cổ: Nam ở trên│
├──────────────────────────────────────┤
│ Tiềm Lực 41 · Tứ Linh Căn · hơn 31%  │  thẻ tóm tắt (cuộn xuống)
│ Thân Lực 77 · Thân quá vượng         │
│ Dụng 水 Thủy · Hỷ 金 · Kỵ 土 · Cừu 火 │
│ Mệnh Cách: Đắc Cứu (七殺格 · 有救)    │
│ Mệnh Cấp: Thanh Quý (清貴)            │
│ Nguyên Khí 23/100                    │
│ Phúc phận: khá no                    │
│ Đặc Tính: 8 sao  ›                   │
│ Túc Nghiệp: Nhân đạo · tâm ma ›      │
│ Thời Vận: đại vận 甲申 (28–37) ›      │  (web)
└──────────────────────────────────────┘
```

**Khung ngang (ngăn phải 520 px):** đĩa 360 px trên, thẻ tóm tắt dạng lưới 2 cột dưới.

### 21.3 Tương tác

| Cử chỉ | Kết quả | Âm | Rung |
|---|---|---|---|
| chạm một cánh ngũ hành | UI-23 (chi tiết hành) | `SFX-UI-030` (gõ chuông nhỏ, cao độ theo hành — xem phần 10 §1, mã `SFX-UI-030`) | light |
| chạm một cung Ngũ Duy | UI-24 | `SFX-UI-030` | light |
| chạm một sao | UI-25 lọc sẵn sao đó | `SFX-UI-032` (lấp lánh) | light |
| chạm vành Phẩm căn | UI-22 «Vì sao?» | — | — |
| chạm tâm (tứ trụ) | mở Bàn Thầy với hồ sơ «Bản thân» (UI-50) | `SFX-UI-012` | light |
| kéo xoay đĩa (một ngón) | đĩa quay tự do, buông thì về vị trí Nam-trên trong 0,5 s | `SFX-UI-033` (tiếng đĩa la bàn đồng xoay) | — |
| chạm «Vì sao?» | UI-22 | — | — |

### 21.4 Trạng thái

| Ô | Hành vi |
|---|---|
| S-LOAD | đĩa vẽ khung xám, các vòng «mọc» ra từ tâm trong 600 ms khi dữ liệu xong |
| S-EMPTY | chưa bát tự → câu `noBirth` |
| S-ERR | một module phụ lỗi (vd `computeLiuDao`) → vòng tương ứng ẩn, dòng tóm tắt ghi «chưa luận được» — đĩa vẫn hiện |
| S-OFF | — |
| S-IOS | bỏ kim Thời Vận và dòng Thời Vận; giữ phần còn lại |
| S-RM | không mọc, không xoay quán tính |
| S-LOCK | — |

### 21.5 Câu chữ

| Khóa | Tiếng Việt |
|---|---|
| `ui.mb.title` | Mệnh Bàn · Tiên Thiên |
| `ui.mb.south_up` | Bàn vẽ theo lối cổ: Nam ở trên. |
| `ui.mb.score` | Tiềm Lực {n} · {phẩmCăn} · hơn {p}% người |
| `ui.mb.strength` | Thân Lực {n} · {level} |
| `ui.mb.yong` | Dụng {hán} {việt} · Hỷ {hán} · Kỵ {hán} · Cừu {hán} |
| `ui.mb.pattern` | Mệnh Cách: {lớp} ({tênCách} · {quality}) |
| `ui.mb.level` | Mệnh Cấp: {việt} ({hán}) |
| `ui.mb.vital` | Nguyên Khí {n}/100 |
| `ui.mb.fortune` | Phúc phận: {fortune} |
| `ui.mb.perks` | Đặc Tính: {n} sao |
| `ui.mb.karma` | Túc Nghiệp: {đạo} · tâm ma |
| `ui.mb.luck` | Thời Vận: đại vận {canChi} ({từ}–{đến}) |

### 21.6 Trợ năng

- Đĩa là `figure` có `figcaption` dài (bản văn đầy đủ mọi số). Trình đọc màn hình **bỏ qua SVG** (`aria-hidden`) và đọc bảng tóm tắt bên dưới — đó là đường thay thế chính.
- Mỗi vùng chạm của đĩa là `button` vô hình đặt chồng, có nhãn («Hành Thủy 2 phần trăm, Dụng thần»).
- Chế độ mù màu (phần 14): cánh hoa có **hoa văn** riêng (Mộc vạch dọc, Hỏa chấm tam giác, Thổ ô vuông, Kim vòng tròn, Thủy sóng) + chữ Hán in trên cánh.

### 21.7 Đo lường

`ui_menhban_view`; `ui_menhban_tap {zone: wx|dim|perk|grade|center|why}`; `ui_menhban_spin`.

### 21.8 Nghiệm thu

1. So từng số với trang chính của app cho 6 lá số mẫu tài liệu 04: lệch 0.
2. Cánh 2% (Thủy `MAU-A`) vẫn chạm được (vùng chạm tối thiểu 44 × 44 px bất kể độ dài cánh).
3. Đĩa vẽ ≤ 16 ms trên máy tầm trung (SVG tĩnh, không bóng đổ).

---

## UI-22 · «Vì sao?» — bảng nhân tố (mã ngắn: `why`)

| | |
|---|---|
| Mục đích | Trụ cột P1: mỗi con số truy về lý do engine. Tiềm Lực đọc `synthesis.factors[]` nguyên văn |
| Lối vào | nút «Vì sao?» ở UI-05, UI-21, mọi chỉ số trong UI-23…UI-26 |
| Nguồn | (chưa có — cần làm); dữ liệu `R.synthesis.factors` (chuỗi có «+n» / «−n» ở cuối) |
| Dạng | bảng con (ngăn xếp có «‹ Mệnh Bàn») |

**Khung dọc (dữ liệu thật `MAU-A`, rút gọn chữ)**

```
┌──────────────────────────────────────┐
│ ‹ Mệnh Bàn   Vì sao 41 điểm?      ✕  │
├──────────────────────────────────────┤
│ Nền 40 điểm, cộng trừ theo cổ pháp:  │
│ ┌──────────────────────────────────┐ │
│ │ +6  Tổ hợp cát: Sát Ấn Tương     │ │  xanh lá + dấu +
│ │     Sinh, Quan Ấn Tương Sinh     │ │
│ │ +5  Hỷ Thần Kim (55%) sinh trợ   │ │
│ │     Dụng — hữu tình              │ │
│ │ +4  Thành chính cách (Thất Sát)  │ │
│ │ +3  Nhiều cát tinh phù trợ       │ │
│ │ +2  Cách cục có cứu ứng          │ │
│ │ −4  Nguồn lưu khí trệ (1/5)      │ │  xám ấm + dấu −
│ │ −4  Cái đầu tiệt cước trúng Dụng │ │
│ │ −6  Dụng Thần Thủy yếu (2%)      │ │
│ │ −10 Tổ hợp hung: Thương Quan     │ │
│ │     Kiến Quan, Quan Sát Hỗn Tạp  │ │
│ └──────────────────────────────────┘ │
│ ▸ Xem nguyên văn của thầy            │  details: chuỗi gốc đầy đủ
│ ┃ Điểm này là Tiên Thiên — không đổi │
│ ┃ được. Thứ bạn đổi được là Đạo Hạnh.│
│ [ Mở Mệnh Đồ: chữa chỗ −6, −10 ]     │  → UI-27
└──────────────────────────────────────┘
```

**Luật trình bày:**

1. Sắp: cộng giảm dần, rồi trừ tăng dần độ lớn (âm lớn nhất cuối).
2. Màu: dấu + dùng `--wx-moc`; dấu − dùng `--hq-dim` (không đỏ — P2). Luôn có ký hiệu «+» / «−» (không chỉ màu).
3. Dòng tóm tắt là bản rút gọn của chuỗi engine (lấy phần trước dấu «:» hoặc «—» đầu tiên); `details` «Xem nguyên văn» hiện chuỗi gốc đầy đủ — **không biên tập lại nghĩa**.
4. Chữ Hán trong chuỗi gốc (vd «格局成败», «盖头截脚») giữ nguyên + chèn chú Hán Việt bằng bảng từ điển hiển thị (★ hook glossary phần 13 §4). Chú ý: chuỗi engine có lẫn giản thể («败», «盖», «补») — hiển thị nguyên văn, **không** tự đổi phồn thể (nguyên văn là bằng chứng), nhưng từ điển chú phải tra được cả hai dạng.
5. Nút cuối dẫn sang tầng Mệnh Đồ tương ứng với các dòng âm lớn nhất (khớp `gaimenhPlan.diagnosis`).

**Cho các chỉ số khác:**

| Chỉ số | «Vì sao?» đọc từ |
|---|---|
| Tiềm Lực | `synthesis.factors[]` |
| Thân Lực | `strength` (lý do vượng / nhược — chuỗi giải thích của engine) |
| Dụng / Hỷ / Kỵ | `yong.reasons[]` (MAU-A: «Thân vượng do Tỷ Kiếp (金) trùng điệp → lấy Quan Sát (火) chế thân, Thực Thương (水) tiết tú làm phụ.») |
| Mệnh Cấp | `classifyChartLevel(R).criteria[]` (tên, đạt / không, chi tiết) |
| Nguyên Khí | `analyzeVitality` (`constitution`, đỉnh / đáy theo tuổi) |
| Ngũ Duy | `dims[].gods[]` (thập thần và trọng số) |
| Đặc Tính | `shensha[k].at[]` (đóng ở chi / trụ nào) |
| Mệnh Cách | `patternQuality` (bệnh `diseases[]`, thuốc `rescues[].drug`) |

**Trạng thái:** S-EMPTY không xảy ra (engine luôn trả ít nhất một nhân tố); S-ERR: «Thầy chưa tách được lý do cho con số này.» + chuỗi gốc nếu có.

**Đo lường:** `ui_why_view {stat}`; `ui_why_raw_open`; `ui_why_to_menhdo`.

**Nghiệm thu:** tổng (nền + các dòng) = điểm hiển thị (kiểm tự động cho 6 lá số mẫu; nếu engine kẹp điểm 0–100 thì hiện thêm dòng «kẹp trong khoảng 0–100»).

---

## UI-23 · Chi tiết Ngũ Hành Lực (mã ngắn: `wx`)

| | |
|---|---|
| Nguồn | `R.wx.pct`; tên thuộc tính theo canon §5: Sinh Cơ (Mộc), Nhiệt Tâm (Hỏa), Định Lực (Thổ), Tuệ Kiếm (Kim), Linh Tuệ (Thủy) |

**Khung (một hành, ví dụ Thủy của MAU-A)**

```
┌──────────────────────────────────────┐
│ ‹ Mệnh Bàn   水 Thủy · Linh Tuệ    ✕ │
├──────────────────────────────────────┤
│ ▁▁ 2,2%                   Dụng thần 用│
│ Chỉ số trong game: 2,2 × 1,3 = 2,9   │  công thức canon: Dụng ×1,3, Kỵ ×0,8
│ Linh Tuệ: học cổ thư nhanh, đọc tượng│
│ (Manh phái), du phương xa.           │
│ ┃ Thủy là Dụng thần mà gần như không │
│ ┃ có: hành trình của bạn là bổ Thủy. │
│ Việc bổ Thủy trong game:             │
│  · phẩm phục / bộ Huyền Thủy (Hợp    │
│    mệnh) → Tàng Y Các ›              │
│  · tĩnh tọa bên Cùng Thông Hồ ›      │
│  · đọc tượng ở Manh Phái Cốc ›       │
│ ─ Cả năm hành ─────────────────────  │
│ 木 Sinh Cơ    ▓░░░░░░░░░  6,5%       │
│ 火 Nhiệt Tâm  ▓▓░░░░░░░░ 18,3%  仇   │
│ 土 Định Lực   ▓▓░░░░░░░░ 17,9%  忌   │
│ 金 Tuệ Kiếm   ▓▓▓▓▓▓░░░░ 55,1%  喜   │
│ 水 Linh Tuệ   ░░░░░░░░░░  2,2%  用   │
└──────────────────────────────────────┘
```

**Luật:** thanh dùng `.hq-bar` sẵn có (46 px nhãn · thanh · 40 px số). Nhãn vai trò bằng chữ Hán một chữ (用喜忌仇) + Hán Việt khi chạm. Gợi ý hành động là **liên kết thật** tới địa điểm / màn (không phải chữ chết). Câu chú thích Dụng thần lấy theo bảng mẫu tài liệu 04 (một câu cho mỗi tổ hợp «vai trò × mức»: < 10%, 10–30%, > 30%).

**Đo lường:** `ui_wx_view {wx}`; `ui_wx_tap_action {kind}`.

---

## UI-24 · Ngũ Duy — năm nhánh thiên phú (mã ngắn: `dims`)

| | |
|---|---|
| Nguồn | `five-dim-radar › fiveDimRadar(R.chart)` → `dims[{key, vi, zh, gods[], trait, score}]`, `dominant`, `weakest` |

**Khung dọc**

```
┌──────────────────────────────────────┐
│ ‹ Mệnh Bàn   Ngũ Duy               ✕ │
├──────────────────────────────────────┤
│            Quan 45                   │
│          ╱‾‾‾‾‾‾‾╲                   │  radar ngũ giác (SVG)
│   Tài 26 ·         · Ấn 54           │
│          ╲   ●    ╱                  │
│  Thực 15 缺 ·───· Tỷ 100 主           │
│                                      │
│ 主 Đồng đạo (Tỷ Kiếp) 100            │
│    kỹ năng khởi đầu: ghép đội, đồng  │
│    tu, sư đồ ›                       │
│ 缺 Nghệ đạo (Thực Thương) 15         │
│    «Khuyết thập thần» → chuỗi học bù │
│    «Nét bút đầu tiên» (vẽ phù, thư   │
│    pháp) ›                           │
│ Thương đạo · Tài   26  ▓▓▓░░░░░░░    │
│ Trị đạo    · Quan  45  ▓▓▓▓▓░░░░░    │
│ Học đạo    · Ấn    54  ▓▓▓▓▓░░░░░    │
│ Nghệ đạo   · Thực  15  ▓▓░░░░░░░░    │
│ Đồng đạo   · Tỷ   100  ▓▓▓▓▓▓▓▓▓▓    │
└──────────────────────────────────────┘
```

**Luật:** tên nhánh theo canon (Thương / Trị / Học / Nghệ / Đồng đạo); tên thập thần trong ngoặc. Radar có bản văn thay thế. Trục yếu nhất **không** tô xám buồn — tô viền vàng đứt «chưa khai», kèm lối vào chuỗi học bù (tên chuỗi do tài liệu 05 / 09 cấp; ở đây giữ chỗ).

**Đo lường:** `ui_dims_view`; `ui_dims_tap {key}`.

---

## UI-25 · Đặc Tính — thần sát (mã ngắn: `perks`)

| | |
|---|---|
| Nguồn | `R.shensha` (~31 sao), `noble-stars › analyzeNobleStars`; hiệu ứng `PERK-<sao>` do tài liệu 04 định |

**Khung dọc (MAU-A có 8 sao)**

```
┌──────────────────────────────────────┐
│ ‹ Mệnh Bàn   Đặc Tính · 8 sao      ✕ │
├──────────────────────────────────────┤
│ [Tất cả] [Cát] [Kiếp số] [Đang kích] │  lọc
│ ┌──────────────────────────────────┐ │
│ │ ★ 華蓋 Hoa Cái Nhập Mệnh         │ │
│ │   đóng: 辰 (trụ giờ, trụ ngày)   │ │
│ │   Tu vi mọi đạo thống +15%,      │ │
│ │   giao lưu −10% (cô độc)         │ │
│ │   Vì sao? ›                      │ │
│ ├──────────────────────────────────┤ │
│ │ ★ 魁罡 Khôi Cương                │ │
│ │   đóng: 庚辰 (trụ ngày)          │ │
│ │   Mở nhánh đối thoại cứng rắn    │ │
│ │   với NPC quyền lực              │ │
│ ├──────────────────────────────────┤ │
│ │ ★ 天德 · 月德 Thiên Đức / Nguyệt │ │
│ │   Đức — giảm nghiệp khi lỡ chọn  │ │
│ │   sai                            │ │
│ ├──────────────────────────────────┤ │
│ │ ★ 學堂 Học Đường · 將星 Tướng    │ │
│ │   Tinh · 天醫 Thiên Y · 流霞 Lưu │ │
│ │   Hà  (hiệu ứng: tài liệu 04)    │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

**Luật:** mỗi thẻ: chữ Hán + Hán Việt + tên đặc tính game + chỗ đóng (chi / trụ) + hiệu ứng một dòng + «Vì sao?». Sao «kiếp số» (血刃, 四廢) ghi rõ «không phạt chỉ số — thêm một ải kiếp, vượt được thưởng lớn» (canon §4.6). Bộ lọc «Đang kích» hiện sao đang có hiệu lực ở vùng / giờ / nhiệm vụ hiện tại.

**Đo lường:** `ui_perks_view {count}`; `ui_perks_filter {f}`.

---

## UI-26 · Tính Khí và Túc Nghiệp — ba tâm ma (mã ngắn: `karma`)

| | |
|---|---|
| Nguồn | `personality-profile › getPersonalityProfile`, `nayin-personality`; `liudao › computeLiuDao` → `primary`, `poisons{tham, san, si, …}` |

**Khung dọc**

```
┌──────────────────────────────────────┐
│ ‹ Mệnh Bàn  Tính Khí · Túc Nghiệp  ✕ │
├──────────────────────────────────────┤
│ Tính Khí                             │
│ Nhật chủ Canh Kim · nạp âm Bạch Lạp  │
│ Kim — (đoạn mô tả của engine)        │
│ Giọng thoại của bạn: thẳng, cứng ›   │  ảnh hưởng lựa chọn thoại UI-40
│ ─────────────────────────────────────│
│ Túc Nghiệp (truyện tham khảo)        │
│ 人道 Nhân đạo                        │
│ ┃ Đây là truyện tiền kiếp hư cấu của │  câu bắt buộc
│ ┃ trò chơi, không phải lời phán.     │
│ Ba tâm ma — đếm được thì bớt được    │
│ 貪 Tham  ▓▓▓░░░░░░░ 29               │
│ 瞋 Sân   ▓▓▓▓░░░░░░ 37  ← cao nhất   │
│ 癡 Si    ▓▓▓░░░░░░░ 27               │
│ Gặp Ni sư Diệu Âm để học cách giảm › │  (khi một thanh ≥ 40)
└──────────────────────────────────────┘
```

**Luật:** thanh tâm ma màu **tím trầm `#7a5f8f`** (không đỏ); thanh cao nhất có mũi tên chữ, không nhấp nháy. Lời giới thiệu Diệu Âm chỉ hiện khi khớp điều kiện §5.2 (`liudao.primary` thuộc ba đường dữ) hoặc thanh ≥ 40 — **không** hiện cho mọi người để tránh ám chỉ.

**Đo lường:** `ui_karma_view`; `ui_karma_tap_dieuam`.

---

## UI-27 · Mệnh Đồ — bản đồ sáu tầng (mã ngắn: `menhdo`)

| | |
|---|---|
| Mục đích | Kế hoạch cải mệnh riêng: 6 tầng cố định (Không gian → Tên → Thời → Thái Tuế → Làm công → Tích âm đức), mỗi tầng có chẩn đoán, việc làm, ưu tiên |
| Lối vào | thẻ Mệnh Đồ; Vân Cốc mở lần đầu (UI-40, kịch bản §6.3 bản tổng); UI-22 nút cuối |
| Nguồn | `gaimenh › gaimenhPlan(R)` → `{ diagnosis[{sev, t, d}], layers[{pri, name, kind, acts[]}], verdict }` |
| Khóa | đến khi gặp Vân Cốc (S-LOCK) |

### 27.1 Hình dạng

Bản đồ dạng **sườn núi sáu bậc** đi từ chân lên (Tích âm đức ở chân núi — «tầng dưới cùng ai cũng đi được, ngay hôm nay» — đúng lời Vân Cốc). Mỗi bậc là một nút tròn có chữ Hán tượng trưng:

| Bậc (dưới → trên) | `kind` | Nút | Chữ | Màu |
|---|---|---|---|---|
| 1 | (âm đức) | Tích âm đức | 德 | vàng — **luôn mở**, luôn sáng |
| 2 | (làm công) | Làm công | 工 | — |
| 3 | `taisui` | Thái Tuế | 歲 | — |
| 4 | `timing` | Thời | 時 | — |
| 5 | `name` | Tên | 名 | — |
| 6 | `space` | Không gian | 宅 | — |

> Ghi chú thứ tự: engine sắp `layers` theo `pri` 1 → 6 với Không gian `pri 1`. Canon §6 viết thứ tự «Không gian → Tên → Thời → Thái Tuế → Làm công → Tích âm đức» và gọi Tích âm đức là «cốt lõi, luôn mở». Màn này **vẽ ngược** (âm đức ở chân) vì đó là nền; số thứ tự hiện trên nút vẫn theo engine (`pri`) để khớp trang chính. Cần tài liệu 05 xác nhận (câu hỏi mở).

### 27.2 Khung dọc

```
┌──────────────────────────────────────┐
│ Mệnh Đồ                          ✕   │
├──────────────────────────────────────┤
│ Chẩn đoán (3)                    ▾   │
│ ● cao   Mệnh cục thiên lệch          │  diagnosis[] nguyên văn
│         Tổng luận 41/100 — Dụng Thủy │
│         thiếu lực.                   │
│ ● cao   Tổ hợp hung                  │
│ ● trung 盲派 做功 thấp               │
│ ─────────────────────────────────────│
│              ⑥ 宅 Không gian  ◌      │  ◌ chưa làm · ◐ đang · ● xong
│             ╱                        │
│          ⑤ 名 Tên  ◌                 │
│           ╲                          │
│            ④ 時 Thời  ◐  1/3         │
│           ╱                          │
│        ③ 歲 Thái Tuế  ◌  ⚠ năm nay   │  MAU-A phạm Thái Tuế 2026
│          ╲                           │
│           ② 工 Làm công  ◌           │
│          ╱                           │
│   ① 德 Tích âm đức  ● 12 công  ★     │  luôn sáng
│ ─────────────────────────────────────│
│ Lời thầy: (verdict)                  │
└──────────────────────────────────────┘
```

**Khung ngang:** núi bên trái (360 px), chi tiết nút đang chọn bên phải — không cần mở bảng con.

### 27.3 Mã hóa trạng thái nút

| Trạng thái | Hình | Chữ |
|---|---|---|
| chưa làm | vòng rỗng mảnh | «chưa bắt đầu» |
| đang làm | nửa vòng vàng | «{x}/{n} việc» |
| xong | vòng đặc vàng + vệt mây | «đã xong» |
| ưu tiên cao (theo `diagnosis` `sev = cao` liên quan) | chấm son nhỏ cạnh nút | «nên làm trước» |
| cần chú ý năm nay (Thái Tuế phạm) | ⚠ + chữ | «năm nay» |
| khóa (iOS: Thái Tuế, Thời) | — | (ẩn nút — S-IOS) |

### 27.4 Trạng thái

| Ô | Hành vi |
|---|---|
| S-LOAD | «Vân Cốc đang vẽ đường…» ≤ 400 ms |
| S-EMPTY | lá số tốt, `diagnosis` rỗng: núi chỉ sáng nút Tích âm đức + câu «Tốt thì giữ. Không ai được miễn tu.» (canon §5.1) |
| S-ERR | «Mệnh Đồ chưa vẽ được. Hỏi Vân Cốc thiền sư ở Am Vân Cốc.» |
| S-OFF | — |
| S-IOS | ẩn nút Thời và Thái Tuế (đoán vận); giữ Không gian (học phong thủy), Tên (học đặt tên), Làm công, Tích âm đức. Tiêu đề «Lộ Tu» |
| S-LOCK | trước Vân Cốc: núi mờ sương, chữ «Mệnh Đồ mở khi bạn gặp Vân Cốc thiền sư ở Am Vân Cốc.» + lối «Chỉ đường» → đặt mốc bản đồ |
| S-RM | không có hiệu ứng mây |

### 27.5 Câu chữ

| Khóa | Tiếng Việt |
|---|---|
| `ui.md.title` | Mệnh Đồ |
| `ui.md.diag` | Chẩn đoán ({n}) |
| `ui.md.sev.cao` / `.trung` / `.thap` | cao / trung / thấp |
| `ui.md.node.todo` | chưa bắt đầu |
| `ui.md.node.doing` | {x}/{n} việc |
| `ui.md.node.done` | đã xong |
| `ui.md.node.first` | nên làm trước |
| `ui.md.node.thisyear` | năm nay |
| `ui.md.verdict` | Lời thầy |
| `ui.md.good` | Tốt thì giữ. Không ai được miễn tu. |
| `ui.md.locked` | Mệnh Đồ mở khi bạn gặp Vân Cốc thiền sư ở Am Vân Cốc. |
| `ui.md.guide` | Chỉ đường |

### 27.6 Tương tác

| Cử chỉ | Kết quả | Âm |
|---|---|---|
| chạm nút | UI-28 chi tiết tầng | `SFX-UI-030` (cao độ theo bậc, đi lên một cung mỗi bậc) |
| một tầng chuyển sang «đã xong» | nút đổi vàng, vệt mây bay lên bậc kế, toast T3 «Mệnh Đồ · xong tầng {tên}» | `SFX-PROG-005` (khánh đá) |
| xong cả 6 tầng | UI-33 (khoảnh khắc nghi thức) | — |

**Đo lường:** `ui_menhdo_view {done_count}`; `ui_menhdo_tap {kind}`; `ui_menhdo_layer_done {kind}`.

**Nghiệm thu:** với `MAU-A`, 3 chẩn đoán hiện đúng nguyên văn; nút Thái Tuế có ⚠ trong năm 2026 (tuổi Ngọ phạm Trị + Hình, canon §11).

---

## UI-28 · Chi tiết một tầng Mệnh Đồ (mã ngắn: `mdnode`)

| | |
|---|---|
| Nguồn | `layers[i].acts[]` (chuỗi việc của engine) → mỗi việc ánh xạ thành một nhiệm vụ cụ thể gắn NPC + địa điểm (bảng ở tài liệu 03 / 05) |

**Khung dọc (tầng Không gian, MAU-A)**

```
┌──────────────────────────────────────┐
│ ‹ Mệnh Đồ   宅 Không gian  ⑥       ✕ │
├──────────────────────────────────────┤
│ Vì sao cần: (diagnosis liên quan)    │
│ ─ Việc làm ─────────────────────────│
│ ◌ Kích hoạt vượng phương Trung cung /│  acts[0] — nguyên văn rút gọn
│   Tây Bắc (Bát Bạch đương lệnh)      │
│   → Nhiệm vụ: «Đặt bàn ở nhà riêng»  │  liên kết nhiệm vụ
│     tại Huyền Thành · Phong Thủy Viên│
│     [ Theo dõi ]  [ Chỉ đường ]      │
│ ◌ Tránh phương Đông Bắc (Nhị Hắc),   │
│   Chính Nam (Tam Bích), Tây Nam (Ngũ │
│   Hoàng) — không động thổ            │
│   → Nhiệm vụ: «Hóa sát ba phương»    │
│ ◌ Chọn hướng cửa, giường theo mệnh   │
│   quái Bát Trạch                     │
│   → Mini-game «Sửa nhà» (UI-85)      │
│ ▸ Nguyên văn của engine              │
│ 🎙 Hỏi Vân Cốc về tầng này (web)     │  → UI-41 persona Vân Cốc
└──────────────────────────────────────┘
```

**Luật:** mỗi việc có (a) câu engine rút gọn, (b) nhiệm vụ game cụ thể, (c) nút Theo dõi / Chỉ đường. Câu engine có lẫn ký hiệu «🅰️», «🅱️» — **bỏ** ký hiệu emoji chữ cái khi hiển thị trong game (đã có số thứ tự trên nút). Nút hỏi AI chỉ web, persona Vân Cốc, `gameContext` = tầng này.

**Đo lường:** `ui_mdnode_view {kind}`; `ui_mdnode_track`; `ui_mdnode_guide`; `ui_mdnode_ask`.

---

## UI-29 · Sổ Công Quá (mã ngắn: `congqua`)

| | |
|---|---|
| Mục đích | Sổ việc thiện / ác (Liễu Phàm); hiện điểm ròng, mốc 300 / 600 / 1.000 công |
| Nguồn | `remedy-fate › CONG_QUA` (10 thiện +1…+3, 9 ác −1…−3), `meritLedger(logged)` → điểm ròng + nhận xét |
| Lối vào | thẻ Công Quá; Vân Cốc tặng sổ (canon §6.3) |

**Khung dọc**

```
┌──────────────────────────────────────┐
│ Sổ Công Quá                      ✕   │
├──────────────────────────────────────┤
│        功  ┃  過                     │  hai cột kiểu sổ tay cổ
│      + 34  ┃  − 4                    │
│   Ròng: 30 công                      │
│ ──●───────────○────────○─────────    │  thanh mốc 300 / 600 / 1.000
│   30         300      600     1.000  │
│ Đại nguyện kế: «Lập Mệnh» ở 300 công │  (tên đại nguyện: tài liệu 05)
│ ┃ (nhận xét của meritLedger)         │
│ ─ Hôm nay ──────────────────────────│
│ +3 救人 Cứu người · giải án cho chị  │
│    Lan (Sơn Môn)            14:20    │
│ +1 放生 Phóng sinh · hồ sen Bút Tháp │
│ ─ Hôm qua ──────────────────────────│
│ −2 妄語 Nói dối · chọn lời ① với    │
│    khách ở Trà Thất                  │
│    [ Sửa sai ] → UI-31               │
│ ─────────────────────────────────────│
│ [ Sổ đời thực (tùy chọn) ] → UI-30   │
└──────────────────────────────────────┘
```

**Luật (khớp canon §5.3):**

1. Việc ác chỉ ghi khi người chơi **đã chọn** (dòng ghi rõ lựa chọn nào). Mỗi dòng ác có nút «Sửa sai».
2. Cột 過 màu `--hq-dim`, không đỏ.
3. Đơn vị: «công» (thang /10 của Liễu Phàm — 300 công trong game = 3.000 công trong truyện). Có dòng chú khi chạm thanh mốc: «Liễu Phàm ghi 3.000 việc thiện. Trong game, mỗi "công" là mười việc nhỏ gộp lại.»
4. Không có nút mua, không có liên kết cửa hàng (P6).
5. Dòng ghi tự động khi làm nhiệm vụ (máy nhiệm vụ). Chạm dòng → nhiệm vụ / địa điểm gốc.

**Trạng thái:** S-EMPTY: «Sổ còn trắng. Việc thiện đầu tiên có thể làm ngay: giải án cho một vị khách ở Sơn Môn.» + Chỉ đường. S-LOCK: trước khi nhận sổ từ Vân Cốc — thẻ hiện bìa sổ đóng: «Vân Cốc thiền sư sẽ trao sổ này cho bạn.» S-IOS: giữ nguyên (việc thiện là tu tâm).

**Âm:** mở sổ `SFX-UI-013` (giở sổ đóng chỉ); dòng mới thêm khi đang mở `SFX-RITE-010` (bút lông chấm).

**Đo lường:** `ui_congqua_view {net_bucket}`; `ui_congqua_fix_tap`; `ui_congqua_milestone {m: 300|600|1000}`.

---

## UI-30 · Sổ đời thực (mã ngắn: `reallog`) — tùy chọn, mặc định tắt

| | |
|---|---|
| Mục đích | Người chơi tự ghi việc thiện ngoài đời (như Liễu Phàm ghi sổ). **Không thưởng chỉ số** (canon §5.3) |
| Nguồn | (chưa có — cần làm); chỉ lưu cục bộ, không đồng bộ, không gửi đo lường nội dung |

```
┌──────────────────────────────────────┐
│ ‹ Sổ Công Quá   Sổ đời thực      ✕   │
├──────────────────────────────────────┤
│ Sổ này chỉ của bạn. Không cộng điểm, │
│ không ai thấy, không gửi đi đâu.     │
│ ┌──────────────────────────────────┐ │
│ │ Hôm nay mình đã…                 │ │  ô nhập 280 ký tự
│ └──────────────────────────────────┘ │
│ [ Ghi ]                              │
│ ▁▂▃▂▅▃▆  7 ngày qua: 5 dòng          │  biểu đồ cá nhân
│ ┃ Vân Cốc: «Ghi được là đã thấy.     │  câu nhắc (xoay 10 câu)
│ ┃ Thấy được là đã bớt.»              │
│ [ Xuất ra tệp ] [ Xoá sổ ]           │
└──────────────────────────────────────┘
```

**Luật:** bật trong Cài đặt › Quyền riêng tư (UI-78). Không có chuỗi ngày, không thành tựu, không thông báo nhắc — tránh biến việc thiện thật thành cày điểm. Xoá sổ dùng hộp xác nhận z 80.

**Đo lường:** chỉ `ui_reallog_enabled {on}`. Không đo nội dung, không đo số dòng.

---

## UI-31 · Nghiệp chướng và sám hối (mã ngắn: `yeguo`)

| | |
|---|---|
| Nguồn | `remedy-fate › YEGUO` (10 nghiệp), `getYeguoForChart(R)` (nghiệp dễ vướng theo lá số — chỉ để **nhắc trước**), `CHAN_HUI` (5 pháp), `JING_ZHOU` (7 kinh theo việc) |

**Khung dọc**

```
┌──────────────────────────────────────┐
│ ‹ Sổ Công Quá  Nghiệp · Sám hối  ✕   │
├──────────────────────────────────────┤
│ Thanh nghiệp chướng (chỉ khi đã chọn)│
│ 妄語 Nói dối     ▓▓░░░░░░░░  2       │
│ (9 nghiệp khác: 0 — ẩn, chạm để xem) │
│ ─ Lá số bạn dễ vướng (nhắc trước) ── │
│ 殺 · 口  → NPC dẫn đạo sẽ nhắc khi    │
│ bạn sắp chọn lời dính hai nghiệp này │
│ ─ Sửa sai ──────────────────────────│
│ Dòng: −2 Nói dối với khách Trà Thất  │
│ 1. Nói lại sự thật với khách  ◌      │  hành động sửa sai bắt buộc
│ 2. Sám hối ở Bút Tháp (pháp: 作法懺)  │
│    → mini-game tụng / lạy nhịp UI-92 │
│ Không có sám hối «chỉ bằng nút».     │
└──────────────────────────────────────┘
```

**Luật:** thanh nghiệp tím trầm (giống tâm ma). Nghiệp bằng 0 ẩn mặc định. Mục «dễ vướng» có câu đầu: «Đây là lời nhắc, không phải lời phán.» Kinh theo việc (`JING_ZHOU`) chỉ dẫn sang Tàng kinh các (UI-56), không in toàn văn chú.

**Đo lường:** `ui_yeguo_view`; `ui_yeguo_fix_start {karma}`.

---

## UI-32 · Cảnh giới — thang tu (mã ngắn: `realm`)

| | |
|---|---|
| Nguồn | canon §5: 6 bậc, ngưỡng 0 / 100 / 400 / 1.000 / 2.200 / 4.500; công thức `Tiềm Lực × 0,4 + Đạo Hạnh` cho bậc 1–3, bậc ≥ 4 chỉ Đạo Hạnh; tên theo đạo (Đạo / Phật / Nho). `progress.js` (Cấp theo Phúc Khí, gia trì) giữ làm thang hoạt động |

**Khung dọc (MAU-A, Đạo Hạnh giả định 120)**

```
┌──────────────────────────────────────┐
│ Cảnh giới                        ✕   │
├──────────────────────────────────────┤
│ Gọi theo: (•) Đạo ( ) Phật ( ) Nho   │  mặc định theo đạo thống chính
│                                      │
│  6 Luyện Hư Hợp Đạo        4.500  ◌  │
│  5 Luyện Thần Hoàn Hư      2.200  ◌  │
│  4 Luyện Khí Hóa Thần      1.000  ◌  │  «Tiên Thiên thôi tính»
│  3 Luyện Tinh Hóa Khí        400  ◌  │
│ ▶2 Nhập Môn                  100  ●  │  bậc hiện tại
│  1 Phàm Nhân                   0  ●  │
│ ───────────────────────────────────  │
│ Điểm cảnh giới = 41 × 0,4 + 120      │  công thức hiện rõ
│               = 136,4                │
│ ▓▓▓▓▓░░░░░░░░░░  136 / 400           │
│ Hệ số Nghịch Thiên ×1,19 trên mỗi    │
│ điểm Đạo Hạnh mới                    │
│ ─ Nghề (thang thông thạo) ──────────│  từ thẻ «Tu học» cũ
│ Giải án: 62% · Án Cổ: 4 đã qua       │
│ Sảnh nghề: Trạch Nhật 3 · Dương Trạch 1│
│ ─ Gia trì theo Cấp (hoạt động) ─────│
│ Cấp 4 · Hào quang ✓ · Linh khí ✓     │  progress.js › GIATRI
│ Vệt bước (cấp 6) · Ngự kiếm (cấp 8)  │
└──────────────────────────────────────┘
```

**Luật:**

1. Tên bậc theo lựa chọn «Gọi theo» (Đạo / Phật / Nho) — người tu Phật không bị gọi bằng từ Đạo (canon §9.1).
2. Công thức hiện đầy đủ (P1). Từ bậc 4 dòng công thức đổi thành «Từ cảnh giới Luyện Khí Hóa Thần, chỉ còn Đạo Hạnh được tính.»
3. Hai thang tách bạch: **Cảnh giới** (tu) và **Cấp** (hoạt động, Phúc Khí). Ghi một câu: «Cấp đo độ siêng ghé quán. Cảnh giới đo công tu.»
4. Ánh xạ gia trì theo cảnh giới (canon §9.1: «cấp gia trì mở theo cảnh giới thay vì cấp») là việc của tài liệu 04 / 09; màn này hiện **cái nào đang mở và vì sao**.

**Đo lường:** `ui_realm_view {realm}`; `ui_realm_naming {school}`.

---

## UI-33 · Khoảnh khắc nghi thức — đột phá cảnh giới và đại nguyện (mã ngắn: `ascend`)

| | |
|---|---|
| Mục đích | Đánh dấu ba loại mốc lớn: lên cảnh giới; mốc Liễu Phàm 300 / 600 / 1.000 công (đại nguyện); xong cả Mệnh Đồ |
| Lớp | z 50, toàn màn; camera điện ảnh (phần 08 §4, preset `cam.ascend`) |
| Nguồn | (chưa có — cần làm) |

**Trình tự (≈ 9 s, bỏ qua được từ giây 2):**

| t | Hình | Âm |
|---|---|---|
| 0 | cảnh mờ dần, HUD ẩn, camera rời vai người chơi kéo lên cao (phần 08) | nhạc vùng hạ −12 dB trong 1 s |
| 0,5 | quanh nhân vật mọc vòng gia trì theo hành Dụng thần (màu `WX_GIATRI`) | `SFX-RITE-020` tiếng ngân dài (khánh + chuông bát) |
| 2,5 | chữ Hán của bậc mới hiện giữa trời (vd 入門), nét bút viết dần | `SFX-RITE-005` bút lông |
| 4,0 | tên bậc tiếng Việt + câu của NPC dẫn đạo hiện tại (persona, tài liệu 06) | VO NPC (nếu có thu âm) |
| 6,0 | dòng «Mở: {thứ vừa mở}» | `SFX-PROG-003` |
| 7,5 | nút «Tiếp tục tu» | — |

**Biến thể:** đại nguyện Liễu Phàm dùng chữ 願 và màu vàng giấy; xong Mệnh Đồ dùng hình núi sáu bậc sáng dần từ chân lên.

**Giảm chuyển động:** không bay camera, không viết nét; hiện thẻ tĩnh 2 s rồi nút. **Âm thanh tắt:** thêm phụ đề mô tả âm «[tiếng khánh ngân]» nếu bật phụ đề âm thanh (phần 14).

**Đo lường:** `ui_ascend_view {kind, realm}`; `ui_ascend_skip {t}`.

---

## UI-34 · Thiên Bảng (mã ngắn: `ranks`)

| | |
|---|---|
| Nguồn | canon §4.7: hai cột «Tiên Thiên» và «Đạo Hạnh», **bảng chính xếp theo Đạo Hạnh**; `protocol.js` đã có `lb {season, top[], phai[], me}` (bảng giải án theo phái) |

**Khung dọc**

```
┌──────────────────────────────────────┐
│ Thiên Bảng · mùa 丙午            ✕   │
├──────────────────────────────────────┤
│ [Đạo Hạnh ●] [Môn phái] [Giải án]    │
│  #  Tên            Cảnh giới  Đạo Hạnh│
│  1  Mộc Lan        Hóa Thần   1.240  │
│  2  Vô Trần        Hóa Khí      890  │
│  3  …                                │
│ ───────────────────────────────────  │
│ 128 Thanh Vân      Nhập Môn     120  │  dòng của mình ghim đáy
│ Tiên Thiên của bạn: ẩn  [ Công khai ]│  theo UI-78
│ ┃ Bảng xếp theo công tu, không theo  │
│ ┃ căn cốt.                           │
└──────────────────────────────────────┘
```

**Luật:** cột Tiên Thiên chỉ hiện với người đã bật «công khai căn cốt»; người khác thấy «—». Không có huy hiệu «Thiên Linh Căn» trên bảng chính. Bảng Môn phái và Giải án dùng dữ liệu `lb` hiện có.

**Trạng thái:** S-OFF: «Thiên Bảng cần kết nối. Điểm của bạn vẫn được giữ.» + số liệu bản thân. S-IOS: giữ.

**Đo lường:** `ui_ranks_view {tab}`.

---

## UI-35 · Hồ sơ lá số (mã ngắn: `profiles`)

| | |
|---|---|
| Nguồn | `state.profiles` (tối đa `CAPS.maxProfiles = 5`), `S.addProfile`, `S.removeProfile`; thẻ «Hồ sơ» hiện có trong `openBook` |

**Khung dọc**

```
┌──────────────────────────────────────┐
│ Hồ sơ lá số · 3/5                ✕   │
├──────────────────────────────────────┤
│ 📜 Bản thân · 15/05/1990 · 08:30 · nam│
│    [Mở]                              │
│ 📜 Mẹ · 02/11/1962 · không rõ giờ · nữ│
│    [Mở] [Xoá]                        │
│ 📜 Bé Na · 20/07/2019 · 10:15 · nữ   │
│    [Mở] [Xoá]                        │
│ [ + Thêm hồ sơ ở Bàn Thầy ]          │
│ Thêm ô hồ sơ là tiện ích (Tàng Y Các)│  canon §11 «thêm ô lưu lá số khách»
└──────────────────────────────────────┘
```

**Luật:** «Bản thân» không xoá được ở đây (sửa qua cổng). Xoá dùng hộp xác nhận z 80 thay `confirm()` (hiện có): «Xoá hồ sơ «{nhãn}» khỏi Sổ Mệnh? Lá số này sẽ không còn trên máy.» Nút «Xoá» dùng `.danger` (`#ff8f86`, tương phản 7,5 trên nền thẻ).

**Đo lường:** `ui_profiles_view {n}`; `ui_profiles_open`; `ui_profiles_delete`.

---

## UI-36 · Thành tựu và danh hiệu (mã ngắn: `ach`)

| | |
|---|---|
| Nguồn | `state.js › ACHIEVEMENTS` (13 mục ở web: Lần đầu gặp thầy, Gia phả nhỏ, Biết đường về, Thẻ đầu tiên, Thượng thượng, Kiên nhẫn, Hương khói, Trà đạo, Đèn trôi, Ba ngày liền, Một tuần thong thả, Dạo quán, …), `TITLES` (Khách Vãng Lai 0 · Khách Quen 30 · Môn Sinh 100 · Đệ Tử 250 · Tri Âm Huyền Quán 500) |

**Khung:** lưới 2 cột `.hq-ach` (1 cột ≤ 480 px); mục đạt viền vàng + 🏮, chưa đạt mờ 55% + ◌ (đã có).

**★ Bổ sung:**

1. Nhóm: «Nhập môn», «Tu tâm», «Nghề», «Du phương», «Lễ tiết», «Hồi Đầu» (ẩn cho tới khi mở).
2. Danh hiệu cảnh giới, danh hiệu đặc biệt (**Hồi Đầu** — chữ vàng ánh tím, vì canon gọi là «hiếm và được kính trọng»), danh hiệu Mệnh Cấp khởi đầu (vd «Thanh Quý») — chọn một danh hiệu hiện trên khung tên.
3. Thành tựu bí mật hiện «◌ ???» với gợi ý một câu thơ.
4. **Không** có thành tựu cho việc nạp tiền hay số món Tàng Y Các (P6).

**Đo lường:** `ui_ach_view {got}`; `ui_ach_set_title`.

---

## UI-37 · Nợ Âm — bảng công khai của Tà Lộ (mã ngắn: `noam`)

| | |
|---|---|
| Mục đích | Canon §5.5: «Nợ Âm» là con số **hiện công khai** trong Sổ Mệnh, không có chi phí ẩn |
| Lối vào | thẻ Công Quá (chỉ khi đã nhận Âm Bài — `TL-*`) |
| Nguồn | (chưa có — cần làm) |

**Khung dọc**

```
┌──────────────────────────────────────┐
│ ‹ Sổ Công Quá   陰債 Nợ Âm        ✕  │
├──────────────────────────────────────┤
│ Âm Bài: còn 4 ngày (×2 Hậu Thiên)    │
│ Nợ Âm: 18                            │
│ ─ Những người đã chịu thay bạn ─────│  hệ quả lan ra thế giới
│ · Nhà Trà Thất có người ốm           │
│ · Khách ở Sơn Môn bỏ về              │
│ · Thầy Tử Bình không tiếp            │
│ ─ Đường về ─────────────────────────│
│ Không có điểm không quay lại được.   │
│ [ Hồi đầu ở Bút Tháp ]               │
│ [ Hồi đầu ở Phong Đô ]               │
│ Nợ càng lớn, đường trả càng dài.     │
└──────────────────────────────────────┘
```

**Luật:** màu tím trầm `#5b3f6e` nền, chữ giấy; **không** đỏ, không đầu lâu, không hoạt ảnh dọa. Mục «Những người đã chịu thay» liệt kê NPC thật (chạm → vị trí trên bản đồ). Nút hồi đầu luôn có, kể cả khi Âm Bài còn hạn.

**Trạng thái:** chỉ tồn tại khi đã bật nội dung âm tà (UI-79) và nhận Âm Bài. Không xuất hiện ở iOS (nội dung Tà Lộ gắn Phong Đô / Miêu Cương — tài liệu 14 quyết định; mặc định tắt trên iOS).

**Đo lường:** `ui_noam_view {debt_bucket}`; `ui_noam_return {where}`.
