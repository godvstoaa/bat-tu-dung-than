# 04-12 · Giao diện Mệnh Bàn, lược đồ `STAT-MENHBAN`, kế hoạch kiểm thử

## 1. Mệnh Bàn ở đâu trong game

| Nơi | Nội dung | Ghi chú |
|---|---|---|
| Nghi lễ phẩm phục ở cổng (`main.js › ceremony`, đã có) | tứ trụ lật thẻ, thanh ngũ hành, Dụng / Hỷ / Kỵ | thêm một khung «Mệnh Bàn mở ra» 3 giây sau khi mặc phẩm phục |
| **Sổ Mệnh › Mệnh Bàn** (mới) | toàn bộ chỉ số (§2) | tab đầu tiên của Sổ Mệnh |
| HUD | bình Nguyên Khí; ba chấm thiên thời; biểu tượng cửa son khi đang ở hoạt động thử thách | không hiện Tiềm Lực trên HUD |
| Khung tên (MMO) | tên + cảnh giới + (tùy bật) Mệnh Cấp / danh xưng nạp âm | §6 |
| Bàn Thầy / Thầy AI | brief đọc `R` như hiện tại | 06 quyết |

Bản iOS (`features.js`): Vận Mệnh Các và Thầy AI tắt. Mệnh Bàn vẫn hiện vòng Thời Vận; nút «Mở Vận Mệnh Các» ẩn trên iOS.

## 2. Bố cục vòng tròn

### 2.1 Khung tổng (máy tính, ≥ 1024 px)

```
┌──────────────────────────────── Sổ Mệnh › Mệnh Bàn ────────────────────────────────┐
│ [Tiên Thiên] [Hậu Thiên chồng lên]  [Bảng chữ]           Theo lá số đọc ngày 05/11 │
│                                                                                     │
│         ┌─────────── vòng 5: Thời Vận (12 đại vận + chấm lưu niên) ───────┐         │
│         │   ┌──────── vòng 4: Đặc Tính (hạt ngọc) ─────────┐              │  ┌────────────┐
│         │   │   ┌──── vòng 3: Ngũ Duy (5 cánh) ─────┐      │              │  │ Mệnh Cách  │
│         │   │   │  ┌─ vòng 2: Ngũ Hành Lực (5 cung) ─┐│     │              │  │ Mệnh Cấp   │
│         │   │   │  │  ┌ vòng 1: Thiên Mệnh ┐        ││     │              │  │ Phúc phận  │
│         │   │   │  │  │   庚  ·  41        │        ││     │              │  │ Nguyên Khí │
│         │   │   │  │  │  Tứ Linh Căn       │        ││     │              │  │ Túc Nghiệp │
│         │   │   │  │  └ Thân Lực 77 (cung) ┘        ││     │              │  │ Tính Khí   │
│         │   │   │  └────────────────────────────────┘│     │              │  │ Hậu Thiên  │
│         │   │   └────────────────────────────────────┘     │              │  └────────────┘
│         │   └──────────────────────────────────────────────┘              │
│         └──────────────────────────────────────────────────────────────────┘         │
│ «Lá số là hạt giống, không phải cái cây.»                          [Vì sao?]        │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Đặc tả từng vòng

Bán kính tính theo đơn vị `u` = 1/520 chiều rộng khung vòng (SVG `viewBox="-260 -260 520 520"`).

| Vòng | Bán kính (u) | Nội dung | Mã hóa | Tương tác |
|---|---|---|---|---|
| Tâm | 0–58 | chữ Hán nhật chủ (cỡ 44u, màu hành) · Tiềm Lực (cỡ 28u) · tên Phẩm căn (12u) · nếu giờ không rõ: «khoảng 31–58» (9u) | màu chữ nhật chủ theo `WX_GIATRI.color` | chạm → «Vì sao?» Tiềm Lực |
| Cung Thân Lực | 58–64 | cung 0–360° tỉ lệ `TL/100`, bắt đầu 12 giờ | nét liền; mức engine ghi trên cung | chạm → «Vì sao?» Thân Lực |
| 1 · Thiên Mệnh | 64–90 | 5 hạt theo vòng tương sinh Mộc → Hỏa → Thổ → Kim → Thủy, mỗi hạt ghi nhãn Dụng / Hỷ / Kỵ / Cừu / Nhàn | Dụng: hạt lớn + viền vàng; Kỵ: hạt có hình **cửa son** nhỏ (không màu đỏ cảnh báo) | chạm → `yong.reasons` |
| 2 · Ngũ Hành Lực | 90–150 | 5 cung, mỗi cung 72°, độ dày tỉ lệ Lực (0–60 → 0–56u); vạch chia tầng 5/12/20/30/45 | Tiên Thiên: tô đặc màu hành; Bổ Hành: nét đứt sáng nối tiếp; Khuyết: **viền chấm** | chạm → bảng tác động tầng (04-03 §2.1) |
| 3 · Ngũ Duy | 150–200 | 5 cánh hoa (Tài, Quan, Ấn, Thực, Tỷ), độ dài = điểm | cánh trội có ngôi sao; cánh Bổ Khuyết có giọt sương | chạm → cây kỹ năng |
| 4 · Đặc Tính | 200–228 | hạt ngọc theo thứ tự §3 của 04-06; bậc II = hạt to hơn | màu theo nhóm: vàng (cát), ngà (trung tính), hai màu (song nhận), son vân mây (kiếp số) | chạm → thẻ Đặc Tính |
| 5 · Thời Vận | 228–258 | 12 đoạn đại vận (tuổi), đoạn hiện tại sáng; một chấm cho lưu niên; vạch «Đỉnh vận», «Vận Cứu Cách» | màu theo rating, **luôn kèm chữ** (Cát, Bình hòa…) | chạm → Vận Mệnh Các (web) |

### 2.3 Bảng bên (thẻ)

| Thẻ | Mặt trước | «Vì sao?» |
|---|---|---|
| Mệnh Cách | «Đắc Cứu · Thất Sát cách · 2 vị thuốc (0/2 đã hái)» | `patternQuality.summary`, bệnh/thuốc |
| Mệnh Cấp | «Thanh Quý» (hoặc ẩn nếu tắt) | 6 tiêu chí đạt/không |
| Phúc phận | «Khá no · Phúc +3% (bậc 1)» | bảng §5.3 của 04-02 |
| Nguyên Khí | «87 / 112 · Khí Bình» | công thức nền |
| Túc Nghiệp | «Nhân Gian Tái Thế» + 3 ngọn lửa tâm ma (hoặc «đã ẩn») | điểm 6 cõi + lời miễn trừ |
| Tính Khí | «庚 · Cương» + danh xưng «Bạch Lạp Kim» | `temperament`, `traits` |
| Hậu Thiên | «Đạo Hạnh 1.284 · Luyện Khí Hóa Thần · ×1,19 Nghịch Thiên» | 04-08 |

### 2.4 Hai chế độ hiển thị

| Chế độ | Khác biệt |
|---|---|
| **Tiên Thiên** (mặc định) | chỉ số gốc engine |
| **Hậu Thiên chồng lên** | thêm nét đứt Bổ Hành, giọt sương Bổ Khuyết đã xong, ngọn lửa tâm ma sau giảm (ngọn gốc mờ phía sau), cung cảnh giới quanh tâm |

Chuyển chế độ: hiệu ứng «nước thấm» 400 ms (tắt khi giảm chuyển động).

### 2.5 Điện thoại (< 768 px)

- Vòng tròn chiếm toàn chiều rộng; bỏ vòng 5 (Thời Vận) ra thành dải ngang bên dưới.
- Thẻ bên thành **accordion** dưới vòng tròn, thứ tự: Mệnh Cách → Hậu Thiên → Nguyên Khí → Phúc phận → Mệnh Cấp → Tính Khí → Túc Nghiệp.
- Chạm giữ (≥ 400 ms) một phần tử = «Vì sao?»; chạm thường = chọn và hiện nhãn.
- Vùng chạm tối thiểu 44 × 44 px: hạt Đặc Tính nhỏ được gom thành nhóm khi màn hẹp (chạm vào nhóm → danh sách).

### 2.6 Hiệu ứng lần đầu (nghi lễ)

Thứ tự vẽ (tổng 4,5 giây, bỏ qua được bằng một chạm):

1. Tâm: chữ nhật chủ hiện như mực loang (0,6 s).
2. Cung Thân Lực quét (0,4 s).
3. Vòng Thiên Mệnh: 5 hạt sáng theo vòng tương sinh (0,8 s).
4. Ngũ Hành Lực: 5 cung mọc theo vòng tương sinh, bắt đầu từ **hành Dụng** (1 s).
5. Ngũ Duy: cánh nở (0,6 s).
6. Đặc Tính: hạt rơi vào chỗ (0,6 s).
7. Thời Vận: đoạn hiện tại sáng (0,5 s).

Âm thanh do 12 cấp mã `SFX-*`. Không có âm «thất bại» cho bất kỳ chỉ số thấp nào.

### 2.7 Trạng thái đặc biệt

| Trạng thái | Hiển thị |
|---|---|
| Đang tính | vòng mờ quay chậm + «Thầy đang đặt bút…» |
| Lỗi engine (`synthesis` rỗng) | không vẽ vòng; «Thầy chưa đọc được lá số này. Con kiểm lại ngày giờ, hoặc thử lại sau.» + mã log |
| Giờ không rõ | chấm «?» ở chỉ số phụ thuộc giờ (04-11 §2.2), khoảng Tiềm Lực ở tâm |
| Mệnh Cấp bị chặn | thẻ Mệnh Cấp có dấu «ⓘ» |
| Tiên Thiên vừa đọc lại (đổi phiên bản engine) | dải thông báo trên cùng một lần + «Vì sao?» có cột «trước / sau» |
| Phần riêng tư đã ẩn | ô hiện «đã ẩn» + nút bật |

## 3. Khả năng tiếp cận

| Yêu cầu | Cách đáp ứng |
|---|---|
| Không dựa vào màu | mỗi hành có **chữ Hán** (木火土金水) trên cung; Dụng / Kỵ có hình (viền vàng / cửa son); rating Thời Vận luôn có chữ |
| Tương phản | chữ trên nền ≥ 4,5 : 1; cung màu hành có viền tối 1px để tách nền |
| Bàn phím | `Tab` đi qua: tâm → Thân Lực → vòng 1 → … → thẻ bên; trong một vòng dùng ← / →; `Enter` mở «Vì sao?»; `Esc` đóng; `T` đổi Tiên Thiên / Hậu Thiên |
| Trình đọc màn hình | SVG có `role="img"` + `aria-labelledby` trỏ tới **bảng chữ** ẩn đầy đủ (mọi chỉ số, mọi giá trị). Ví dụ nhãn cung: «Linh Tuệ, hành Thủy, lực 3, tầng Khuyết, là Dụng thần, hệ số 1,3.» |
| Nút «Bảng chữ» | hiện bảng chữ cho mọi người (không chỉ người dùng trình đọc) |
| Phóng chữ 200% | vòng tròn giữ tỉ lệ; nhãn chuyển sang bảng chữ khi không đủ chỗ |
| Giảm chuyển động | `prefers-reduced-motion`: bỏ hiệu ứng §2.6, §2.4 |
| Chữ Hán | luôn kèm Hán Việt cạnh lần đầu xuất hiện trong mỗi thẻ (canon §1) |
| Thời gian đọc | thông báo không tự tắt trước 8 giây; nghi lễ bỏ qua được |

## 4. Lược đồ `STAT-MENHBAN`

### 4.1 Đối tượng gốc

| Trường | Kiểu | Bắt buộc | Mô tả / nguồn |
|---|---|---|---|
| `v` | int | ✔ | `MENHBAN_VERSION` (lớp game) |
| `engine` | string | ✔ | `ENGINE_FINGERPRINT` (04-01 §7.2) |
| `birthHash` | string | ✔ | băm (SHA-256, cắt 16 ký tự hex) của `y-m-d-h-mi-gender-hourUnknown` + muối của máy; không đảo ngược được |
| `hourUnknown` | boolean | ✔ | |
| `refYear` | int | ✔ | năm tham chiếu đã tính theo Lập Xuân (04-08 §6.4) |
| `docNgay` | string `YYYY-MM-DD` | ✔ | ngày dựng Mệnh Bàn |
| `tienThien` | object | ✔ | §4.2 |
| `thoiVan` | object | ✔ | §4.3 |
| `sinhLucHienTai` | int 0–100 | ✔ | `analyzeVitality.currentVitality` |
| `khoangTiemLuc` | `{min, max, spread}` \| null | | chỉ khi `hourUnknown` |
| `canhBao` | string[] | | `['gio_ty', 'giao_tiet', 'gio_lich_su']` (04-11) |

### 4.2 `tienThien`

| Trường | Kiểu | Phạm vi | Nguồn |
|---|---|---|---|
| `tiemLuc` | int | 0–100 | `synthesis.score` |
| `bachPhan` | int | 1–99 | `synthesis.percentile` |
| `grade` | `'上'\|'中上'\|'中'\|'中下'\|'下'` | | `synthesis.grade` |
| `phamCan` | `'PC1'`…`'PC10'` | | ngưỡng 04-02 §4 |
| `phucPhan` | `'đại phú quý'\|'phú quý'\|'tiểu phú quý'\|'khá no'\|'bình'\|'tiềm năng ẩn'` | | `synthesis.fortune` |
| `viSao` | `{key: 'F01'…'F17', delta: int, text: string}[]` | | `synthesis.factors` + bộ tách |
| `nguHanhLuc` | `{[w in 木火土金水]: {pct: number, k: 1\|1.3\|0.8, v: int, tang: 0..5}}` | v 0–130 | `wx.pct`, `yong` |
| `thanLuc` | `{v: int, effRatio: number, level: string, strong: boolean}` | v 0–100 | `strength` |
| `thienMenh` | `{dung, dungPhu: string\|null, hy, ky, cuu, nhan}` (mỗi giá trị là một trong 木火土金水) | | `yong` |
| `nguDuy` | `{cai, guan, yin, shi, ti: int}` \| null | 0–100 | `fiveDimRadar` |
| `nguDuyTroi`, `nguDuyKhuyet` | `'cai'\|'guan'\|'yin'\|'shi'\|'ti'` \| null | | `dominant.key`, `weakest.key` |
| `menhCach` | `{cls: 'TT'\|'DC'\|'NT'\|'DK', sub: '成格'\|'有救'\|'败格'\|'特殊'\|'未知', kind: string\|null, name: string, nguon: 'engine'\|'fallback'}` | | 04-05 §2.1 |
| `benh` | `{via: string, latent: boolean, killers: string[]}[]` | | `patternQuality.diseases` |
| `thuoc` | `{drug: string[], via: string}[]` | | `patternQuality.rescues` |
| `menhCap` | `'极品'\|'贵格'\|'富格'\|'清贵'\|'常格'\|'下格'\|'unknown'` | | `classifyChartLevel.level` |
| `menhCapChan` | `{pass: int, raw: int, capped: boolean}` | 0–6 | |
| `nguyenKhiNen` | int | 0–100 | `baseVitality` |
| `nguyenKhiToiDa` | int | 100–150 | `100 + round(nền × 0,5)` |
| `dacTinh` | `{key: string, bac: 1\|2, tone: 'cat'\|'neutral'\|'volatile'\|'hung', at: string[]}[]` | | `shensha` + `guoYin` |
| `quyKhi` | `{level: string, score: number}` | | `noble.assessment` |
| `tucNghiep` | `{coi: string, diem: {[coi]: int}, tamDoc: {tham, san, si, thien, dinh, bo: int}}` \| null | 0–100 | `computeLiuDao` |
| `tinhKhi` | `'甲'`…`'癸'` | | `chart.dayGan` |
| `napAm` | string (30 giá trị) | | `pillars.day.nayin` |
| `flags` | `{id: string, tone: 'cat'\|'xiong', che: boolean, genuine: boolean}[]` | | `synthesis.combos` |
| `truCot` | **không lưu** | | tứ trụ dựng lại từ ngày sinh khi cần (N8) |

### 4.3 `thoiVan`

| Trường | Kiểu | Nguồn |
|---|---|---|
| `daiVan` | `{ganZhi, startAge, startYear, score, rating, clashType, clashMitigated, gejuDelta, gejuRescue, gejuWorsen}` \| null | phần tử `R.dayun` đang hành |
| `luuNien` | `{ganZhi, score, rating}` \| null | `R.liunian[isNow]` |
| `tieuVan` | boolean | chưa khởi vận |
| `r2` | number 0–0,10 | 04-08 §6.2 |
| `r3ThuThach` | number 0–0,30 | 04-08 §6.2 |

### 4.4 `hauThien` (lưu riêng, `state.player.hauThien`)

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `daoHanh` | number (1 chữ số thập phân) | |
| `daoHanhCaoNhat` | number | cảnh giới |
| `dhKhongNT` | number | quy đổi khi Sửa bát tự (04-11 §9.3) |
| `dhTru` | number | trừ do phạm giới (05) |
| `congTuNgay` | `{ngay: 'YYYY-MM-DD', tho: number}` | trần ngày |
| `boHanh` | `{[w]: int 0–20}` | |
| `ngo` | `{[truc]: {xp: number, spent: int, nodes: string[]}}` | 04-04 |
| `boKhuyet` | `{chuong: 0..4, xong: boolean}` | |
| `tamMa` | `{tham, san, si: int}` | **độ lệch** so với gốc (≤ 0 thường) |
| `quyNhat` | boolean | 05 |
| `danhHieu` | string[] | |

### 4.5 Ví dụ `MAU-A` (rút gọn)

```json
{
  "v": 1, "engine": "a3f9c2…", "birthHash": "4be1…", "hourUnknown": false,
  "refYear": 2026, "docNgay": "2026-11-05",
  "tienThien": {
    "tiemLuc": 41, "bachPhan": 31, "grade": "中", "phamCan": "PC3", "phucPhan": "khá no",
    "viSao": [{"key":"F01","delta":2,"text":"格局成败 (有救 …"}, {"key":"F02","delta":4,"text":"…"},
              {"key":"F03","delta":-6,"text":"…"}, {"key":"F05","delta":5,"text":"…"},
              {"key":"F08","delta":-10,"text":"…"}, {"key":"F09","delta":6,"text":"…"},
              {"key":"F13","delta":3,"text":"…"}, {"key":"F15","delta":-4,"text":"…"},
              {"key":"F16","delta":-4,"text":"…"}],
    "nguHanhLuc": {
      "木": {"pct": 6.5, "k": 1, "v": 7, "tang": 1},  "火": {"pct": 18.3, "k": 1, "v": 18, "tang": 2},
      "土": {"pct": 17.9, "k": 0.8, "v": 14, "tang": 2}, "金": {"pct": 55.1, "k": 1, "v": 55, "tang": 5},
      "水": {"pct": 2.2, "k": 1.3, "v": 3, "tang": 0}
    },
    "thanLuc": {"v": 77, "effRatio": 0.77, "level": "Thân quá vượng", "strong": true},
    "thienMenh": {"dung": "水", "dungPhu": "木", "hy": "金", "ky": "土", "cuu": "火", "nhan": "木"},
    "nguDuy": {"cai": 26, "guan": 45, "yin": 54, "shi": 15, "ti": 100},
    "nguDuyTroi": "ti", "nguDuyKhuyet": "shi",
    "menhCach": {"cls": "DC", "sub": "有救", "kind": "normal", "name": "七殺格", "nguon": "engine"},
    "benh": [{"via": "dang", "latent": false, "killers": ["cai"]}, {"via": "duo", "latent": false, "killers": ["yin"]}],
    "thuoc": [{"drug": ["shi"], "via": "dang"}, {"drug": ["cai"], "via": "duo"}],
    "menhCap": "清贵", "menhCapChan": {"pass": 3, "raw": 3, "capped": false},
    "nguyenKhiNen": 23, "nguyenKhiToiDa": 112,
    "dacTinh": [{"key": "xueTang", "bac": 1, "tone": "cat", "at": ["巳"]},
                {"key": "huaGai", "bac": 2, "tone": "neutral", "at": ["辰","辰"]},
                {"key": "liuXia", "bac": 2, "tone": "hung", "at": ["辰","辰"]},
                {"key": "guoYin", "bac": 2, "tone": "cat", "at": ["辰 @ Nhật trụ","辰 @ Thời trụ"]}],
    "quyKhi": {"level": "贵气显赫", "score": 7},
    "tucNghiep": {"coi": "人道", "tamDoc": {"tham": 29, "san": 37, "si": 27, "thien": 26, "dinh": 30, "bo": 10}},
    "tinhKhi": "庚", "napAm": "白蜡金",
    "flags": [{"id": "shaYin", "tone": "cat", "che": false, "genuine": true},
              {"id": "shangGuan", "tone": "xiong", "che": true, "genuine": true},
              {"id": "guanZha", "tone": "xiong", "che": false, "genuine": true}]
  },
  "thoiVan": {
    "daiVan": {"ganZhi": "甲申", "startAge": 28, "startYear": 2017, "score": 0, "rating": "Bình hòa"},
    "luuNien": {"ganZhi": "丙午", "score": 6, "rating": "Đại hung"},
    "tieuVan": false, "r2": 0, "r3ThuThach": 0.15
  },
  "sinhLucHienTai": 58
}
```

(`dacTinh` và `flags` rút gọn; bản đủ có 9 Đặc Tính và 7 cờ — 04-09.)

### 4.6 Lưu trữ và chuyển đổi

| Mục | Giá trị |
|---|---|
| Nơi lưu | cùng `state` hiện tại của game (lưu máy) |
| Kích thước | ~3–5 KB / người chơi (không lưu `factors` nguyên văn — `text` chỉ lưu 120 ký tự đầu; toàn văn dựng lại từ `analyze` khi mở «Vì sao?») |
| Chuyển đổi người chơi cũ | có `state.player.birth` nhưng chưa có `menhBan` → dựng ngay lần mở đầu tiên; `state.player.yong` cũ giữ nguyên để tương thích; nếu `yong.primary` cũ khác Dụng mới (engine đã đổi) → áp quy tắc 04-01 §7.3 (đổi ở ranh mùa) |
| Phiên bản | `v` tăng → hàm chuyển đổi thuần, có kiểm thử |

## 5. Hiệu năng

- `buildMenhBan` ~1,6 ms (04-01 §4.2); `chartSensitivity` (chỉ khi giờ không rõ) ~20 ms.
- Chạy trong Web Worker khi mở cổng để không giật khung hình 3D (`render3d.js` đang chạy).
- Vẽ vòng tròn: một SVG, < 300 phần tử; vẽ lại chỉ khi đổi chế độ hoặc dữ liệu.

## 6. Tập công khai (gửi lên MMO)

`net.js` / `worker/quan-room.js` chỉ nhận:

| Trường | Mặc định | Ghi chú |
|---|---|---|
| tên, dáng, trang phục (đã có, `encodeCos`) | gửi | |
| cảnh giới (bậc + tên theo đạo) | gửi | |
| Đạo Hạnh | gửi khi tham gia Thiên Bảng | |
| màu hành Dụng (đã có qua phẩm phục) | gửi | người khác suy ra được Dụng thần từ màu áo — chấp nhận (đã là hành vi hiện tại) |
| Mệnh Cấp (tên game) | **không**, trừ khi bật | |
| Phẩm căn, Tiềm Lực | **không**, trừ khi bật | |
| danh xưng nạp âm | **không**, trừ khi bật | cần cho «Đồng tu duyên»: chỉ gửi **hành nạp âm + tên nạp âm** khi hai người đã ghép đội và cả hai bật |
| ngày giờ sinh, tứ trụ, Túc Nghiệp, tâm ma, Đặc Tính | **không bao giờ** | |

## 7. Kế hoạch kiểm thử

Tệp đề xuất (theo kiểu `scripts/test-game-*.mjs` đã có, nối vào `npm run test:game`): `scripts/test-game-menhban.mjs` (**chưa có — cần làm**). Khung mã ở 04-23 §9.

### 7.1 Kiểm thử đơn vị theo chỉ số — giá trị kỳ vọng

Mọi ca dùng `refYear = 2026`. Giá trị lấy từ 04-09, 04-10 (engine thật, ngày 2026-11-05).

#### Tiềm Lực, Phẩm căn, Phúc phận, NT

| Mẫu | Đầu vào | `tiemLuc` | `bachPhan` | `phamCan` | `phucPhan` | NT |
|---|---|---|---|---|---|---|
| A | 1990,5,15,8,30,nam | 41 | 31 | PC3 | khá no | 1,19 |
| B | 1995,6,15,8,30,nam | 48 | 53 | PC4 | khá no | 1,12 |
| C | 1986,9,1,13,15,nữ | 23 | 4 | PC1 | tiềm năng ẩn | 1,37 |
| D | 1999,3,5,7,15,nữ | 29 | 6 | PC2 | tiềm năng ẩn | 1,31 |
| E | 1989,4,14,22,0,nữ | 45 | 43 | PC4 | khá no | 1,15 |
| F | 1957,2,22,17,30,nam | 53 | 68 | PC5 | tiểu phú quý | 1,07 |
| G | 1969,9,10,9,0,nam | 63 | 90 | PC6 | phú quý | 1,00 |
| H | 2003,8,10,6,45,nữ | 70 | 94 | PC7 | phú quý | 1,00 |
| I | 1997,3,17,5,0,nữ | 74 | 96 | PC8 | phú quý | 1,00 |
| J | 1972,5,12,22,15,nam | 76 | 97 | PC8 | đại phú quý | 1,00 |
| K | 1992,10,12,7,15,nữ | 83 | 99 | PC9 | đại phú quý | 1,00 |
| L | 1999,3,7,16,15,nữ | 86 | 99 | PC10 | đại phú quý | 1,00 |
| M | 1966,5,26,20,15,nam | 37 | 21 | PC3 | bình | 1,23 |
| N | 2000,2,29,null,null,nữ | 41 | 31 | PC3 | khá no | 1,19 |
| O | 1989,4,18,23,30,nữ | 55 | 73 | PC5 | tiểu phú quý | 1,05 |

#### Ngũ Hành Lực (v theo 木 火 土 金 水) và Thân Lực

| Mẫu | Lực | Tầng | Thân Lực | Mức (bắt đầu bằng) |
|---|---|---|---|---|
| A | 7 · 18 · 14 · 55 · 3 | 1·2·2·5·0 | 77 | Thân quá vượng |
| B | 29 · 25 · 16 · 1 · 31 | 3·3·2·0·4 | 62 | **Thân vượng** |
| C | 6 · 28 · 34 · 19 · 10 | 1·3·4·2·1 | 62 | **Thân quá vượng** |
| D | 38 · 20 · 25 · 0 · 12 | 4·3·3·0·2 | 66 | Thân quá vượng |
| E | 32 · 8 · 38 · 3 · 17 | 4·1·4·0·2 | 60 | Thân vượng |
| F | 37 · 13 · 9 · 30 · 15 | 4·2·1·4·2 | 59 | Thân vượng |
| G | 0 · 23 · 24 · 35 · 19 | 0·3·3·4·2 | 42 | Thân nhược |
| H | 32 · 2 · 29 · 27 · 15 | 4·0·3·3·2 | 50 | Thân trung hòa |
| I | 45 · 27 · 19 · 1 · 11 | 5·3·2·0·1 | 41 | Thân nhược |
| J | 37 · 6 · 1 · 6 · 56 | 4·1·0·1·5 | 71 | Thân quá vượng |
| K | 3 · 2 · 14 · 56 · 30 | 0·0·2·5·4 | 81 | Thân quá vượng |
| L | 32 · 26 · 27 · 18 · 3 | 4·3·3·2·0 | 47 | Thân nhược |
| M | 12 · 57 · 11 · 22 · 9 | 2·5·1·3·1 | 23 | Thân quá nhược |
| N | 18 · 43 · 19 · 15 · 1 | 2·4·2·2·0 | 68 | Thân quá vượng |
| O | 17 · 5 · 49 · 20 · 13 | 2·1·5·3·2 | 61 | Thân vượng |

#### Thiên Mệnh (Dụng / Hỷ / Kỵ / Cừu / Nhàn / Dụng phụ)

| Mẫu | Dụng | Hỷ | Kỵ | Cừu | Nhàn | Dụng phụ |
|---|---|---|---|---|---|---|
| A | 水 | 金 | 土 | 火 | 木 | 木 |
| B | 水 | 金 | 土 | 火 | 木 | 金 |
| C | 木 | 水 | 金 | 土 | 火 | 水 |
| D | 金 | 土 | 火 | 木 | 水 | 土 |
| E | 火 | 木 | 水 | 金 | 土 | — |
| F | 金 | 土 | 火 | 木 | 水 | — |
| G | 火 | 木 | 水 | 金 | 土 | 土 |
| H | 金 | 土 | 火 | 木 | 水 | — |
| I | 火 | 木 | 水 | 金 | 土 | 土 |
| J | 木 | 水 | 金 | 土 | 火 | — |
| K | 水 | 金 | 土 | 火 | 木 | 金 |
| L | 火 | 木 | 水 | 金 | 土 | 土 |
| M | 火 | 木 | 水 | 金 | 土 | 土 |
| N | 水 | 金 | 土 | 火 | 木 | — |
| O | 金 | 土 | 火 | 木 | 水 | — |

#### Ngũ Duy (Tài · Quan · Ấn · Thực · Tỷ), Mệnh Cách, Mệnh Cấp, Nguyên Khí

| Mẫu | Ngũ Duy | Trội / Yếu | Mệnh Cách (cls, sub) | Mệnh Cấp (pass/raw) | NK nền → tối đa |
|---|---|---|---|---|---|
| A | 26·45·54·15·100 | ti / shi | DC, 有救 | 清贵 (3/3) | 23 → 112 |
| B | 13·83·100·62·34 | yin / cai | NT, 败格 | 清贵 (3/3) | 25 → 113 |
| C | 31·34·100·52·76 | yin / cai | NT, 败格 | 常格 (2/3, chặn) | 16 → 108 |
| D | 0·57·96·100·61 | shi / cai | NT, 败格 | 常格 (2/2) | 10 → 105 |
| E | 100·18·35·26·62 | cai / guan | DC, 有救 | 常格 (2/2) | 16 → 108 |
| F | 40·100·66·66·79 | guan / cai | DC, 有救 | 富格 (4/4) | 28 → 114 |
| G | 88·0·73·100·53 | shi / guan | TT, 成格 | 清贵 (3/3) | 20 → 110 |
| H | 83·79·66·23·100 | ti / shi | TT, 成格 | 富格 (4/4) | 25 → 113 |
| I | 49·100·61·13·37 | guan / shi | DC, 有救 | 清贵 (3/3) | 20 → 110 |
| J | 25·12·17·66·100 | ti / guan | DK, 成格 | 清贵 (3/4, chặn) | 40 → 120 |
| K | 19·13·50·84·100 | ti / guan | DK, 成格 | 富格 (4/4) | 36 → 118 |
| L | 24·100·87·82·73 | guan / cai | TT, 成格 | 富格 (4/4) | 23 → 112 |
| M | 36·52·36·100·0 | shi / ti | DK, 败格 | 清贵 (3/4, chặn) | 31 → 116 |
| N | 55·13·41·83·100 | ti / guan | NT, 败格 | 常格 (2/2) | 18 → 109 |
| O | 47·53·30·53·100 | ti / yin | DC, 有救 | 贵格 (5/5) | 29 → 115 |

#### Đặc Tính, Quý Khí, Túc Nghiệp, nạp âm, Thời Vận 2026

| Mẫu | Số Đặc Tính | Quý Khí | Túc Nghiệp (Tham/Sân/Si) | Nạp âm ngày | Đại vận | Lưu niên |
|---|---|---|---|---|---|---|
| A | 9 | 显赫 (7) | 人道 (29/37/27) | 白蜡金 | 甲申 Bình hòa | 丙午 Đại hung |
| B | 8 | 平平 (3) | 人道 (8/40/27) | 涧下水 | 己卯 Đại hung | 丙午 Đại hung |
| C | 10 | 平平 (2) | 地狱道 (29/57/27) | 大驿土 | 壬辰 Cát | 丙午 Bình |
| D | 9 | 中上 (4,5) | 地狱道 (0/80/27) | 沙中土 | 己巳 Hung | 丙午 Đại hung |
| E | 8 | 微薄 (0) | 饿鬼道 (56/23/27) | 覆灯火 | 壬申 Hơi nghịch | 丙午 Bình |
| F | 7 | 平平 (3) | 地狱道 (16/77/0) | 海中金 | 乙未 Cát | 丙午 Đại hung |
| G | 5 | 微薄 (0) | 人道 (24/27/27) | 霹雳火 | 丁卯 Đại cát | 丙午 Hơi kỵ |
| H | 9 | 平平 (3) | 人道 (32/0/27) | 大溪水 | 壬戌 Cát | 丙午 Hơi kỵ |
| I | 11 | 中上 (3,5) | 人道 (24/33/27) | 天上火 | 丙午 Đại cát | 丙午 Bình |
| J | 11 | 平平 (2) | 人道 (8/20/7) | 金箔金 | 庚戌 Hơi nghịch | 丙午 Hơi kỵ |
| K | 10 | 微薄 (0) | 地狱道 (21/57/33) | 石榴木 | 丙午 Đại hung | 丙午 Hơi kỵ |
| L | 10 | 平平 (3) | 人道 (8/13/27) | 天上火 | 己巳 Hơi thuận | 丙午 Bình |
| M | 13 | 平平 (2) | 地狱道 (37/73/27) | 泉中水 | 己亥 Hơi nghịch | 丙午 Hơi kỵ |
| N | 11 | 显赫 (7) | 地狱道 (37/90/27) | 沙中土 | 丙子 Hơi thuận | 丙午 Đại hung |
| O | 7 | 平平 (2) | 人道 (16/17/27) | 大驿土 | 壬申 Bình hòa | 丙午 Hơi kỵ |

### 7.2 Kiểm thử bất biến (thuộc tính)

Chạy trên 2.000 lá số ngẫu nhiên (seed cố định):

| Mã | Bất biến |
|---|---|
| P1 | `45 + Σ factorDelta(factors) === score` (khi không kẹp) |
| P2 | `phamCan` khớp tiền tố chữ của `gradeVi` |
| P3 | `{dung, hy, ky, cuu, nhan}` là hoán vị của 5 hành |
| P4 | `nguHanhLuc[w].v === round(pct[w] × k)`, `k ∈ {1; 1,3; 0,8}`, đúng một hành ×1,3 và một hành ×0,8 |
| P5 | `thanLuc.level` bắt đầu bằng một trong 5 chuỗi mức của engine |
| P6 | `nguDuy` có ít nhất một trục = 100 (khi `fiveDimRadar` không lỗi) |
| P7 | `menhCach.cls === 'DK'` ⟺ `pattern.type === 'special'` |
| P8 | `nguyenKhiToiDa ∈ [100, 150]` |
| P9 | Tiên Thiên với `refYear` 2000 / 2026 / 2040 giống hệt (trừ `thoiVan`, `sinhLucHienTai`) |
| P10 | Không trường nào trong tập công khai (§6) chứa ngày sinh hoặc can chi tứ trụ |
| P11 | Mọi `dacTinh.key` có trong bảng 04-06 (hoặc được đánh dấu «Sao lạ») |
| P12 | `NT ∈ [1; 1,5]`; `TL ≥ 60 ⇒ NT = 1` |

### 7.3 Kiểm thử thống kê (cân bằng)

Seed 777, 5.000 lá (như 04-01 §11). Cảnh báo (không làm hỏng build) nếu lệch quá ±2 điểm phần trăm so với:

| Chỉ số | Kỳ vọng |
|---|---|
| Mệnh Cách NT / DC / DK / TT | 50,9 / 32,2 / 15,0 / 1,9 % |
| Phẩm căn PC1 / PC2 | 5,5 / 11,7 % |
| Thân trung hòa | 4,4 % |
| Đặc Tính phổ biến nhất | taiJi 80,4 % |

Lệch lớn = engine đã đổi thuật toán → kích hoạt quy trình 04-01 §7.3 và xem lại cân bằng.

### 7.4 Kiểm thử công thức Hậu Thiên

| Ca | Kỳ vọng |
|---|---|
| Trần ngày `eff(80)` | 70 |
| Trần ngày `eff(150)` | 93 |
| Ví dụ 1 (04-08 §1.3) | 23,6 |
| Ví dụ 2 | 37,4 |
| Ngày tới bậc 6, TL 20, 40/ngày | 81 |
| Ngày tới bậc 6, TL 85, 40/ngày | 113 |
| Sửa bát tự 20 → 70 với `dhKhongNT = 1000` | ĐH 1.000, bậc 4 |
| `canhGioi({tiemLuc: 86, daoHanhCaoNhat: 66})` | 2 (34,4 + 66 = 100,4) |
| `canhGioi({tiemLuc: 86, daoHanhCaoNhat: 999})` | 3 (bậc 4 cần 1.000 Đạo Hạnh thuần) |
| `canhGioi({tiemLuc: 20, daoHanhCaoNhat: 4600, quyNhat: false})` | 5 |

### 7.5 Kiểm thử giao diện (Playwright, qua `window.__hq` đã có)

| Ca | Bước | Kỳ vọng |
|---|---|---|
| UI1 | nhập `MAU-A` ở cổng → mở Sổ Mệnh | tâm hiện «庚 · 41 · Tứ Linh Căn»; cung Thủy có viền chấm |
| UI2 | nhập `MAU-N` tích «Không rõ giờ» | tâm có «khoảng 31–58»; chấm «?» trên Ngũ Hành Lực |
| UI3 | `MAU-O` nhập 23:30 | ghi chú giờ Tý ở cổng; Sổ Mệnh hiện ngày 18/4 |
| UI4 | bàn phím: Tab qua tất cả phần tử, Enter mở «Vì sao?» | không bẫy tiêu điểm; Esc đóng |
| UI5 | `prefers-reduced-motion` | không chạy hiệu ứng §2.6 |
| UI6 | màn 375 px | thẻ thành accordion; vùng chạm ≥ 44 px |
| UI7 | ẩn Túc Nghiệp | thẻ hiện «đã ẩn», cảnh mở đầu dùng bản Nhân Đạo |
| UI8 | `MAU-C` | không chữ «hạ», «kém», «xấu» ở mặt chính (quét DOM theo danh sách 04-13 §4) |

### 7.6 Kiểm thử hồi quy engine

Lưu 15 mẫu (tiemLuc, menhCach, menhCap, yong) làm «ảnh chụp». Mỗi lần nâng engine của app, chạy lại; lệch → không chặn phát hành nhưng bắt buộc ghi vào nhật ký thay đổi và cập nhật 04-09/04-10.

## 8. Checklist nghiệm thu phần 04-12

- [ ] Vòng tròn đủ 5 vòng + tâm; điện thoại chuyển accordion.
- [ ] Mọi phần tử có nhãn chữ; không dựa vào màu; bàn phím đi hết.
- [ ] Bảng chữ thay thế cho SVG, bật được cho mọi người.
- [ ] Lược đồ §4 không chứa ngày sinh / tứ trụ.
- [ ] Tập công khai §6 mặc định tối thiểu.
- [ ] `scripts/test-game-menhban.mjs` chạy đủ §7.1–7.4.
