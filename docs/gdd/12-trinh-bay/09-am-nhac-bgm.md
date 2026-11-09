# 12 · Trình bày — Phần 09: Âm nhạc (BGM-*)

> Hiện game **chưa có nhạc**: `audio.js` chỉ tổng hợp tiếng gió (nhiễu nâu qua lọc thông thấp 500 Hz, gain 0,05), chuông (sine + bội 2,76 và 5,4) và mõ (nhiễu qua lọc dải). Phần này đặc tả toàn bộ nhạc nền: danh mục `BGM-*` theo vùng × khung giờ, nhạc cụ theo từng truyền thống, luật nhạc thích ứng theo giờ can chi, và cách sản xuất.

---

## 1. Ý đồ âm nhạc

1. **Tĩnh, thưa, có khoảng lặng.** Game văn tu, phiên 15–30 phút, nhiều người chơi buổi tối (đúng nhận xét trong `render3d.js`: «người chơi chủ yếu chơi buổi tối»). Nhạc không bao giờ dồn dập trừ lễ hội.
2. **Mỗi thánh địa một bản sắc nhạc cụ thật** của truyền thống đó (canon §12 bản tổng là gốc: Long Hổ trống / tù và / nhị; Võ Đang tiêu / cổ cầm; Yên Tử mõ / chuông / sáo trúc; Bút Tháp tụng niệm xa / đàn bầu; Tạng kèn dài / chuông bát / tụng trầm; Văn Miếu nhã nhạc; Phong Đô gió / giọt nước / tụng siêu độ; Miêu khèn / trống đồng).
3. **Thang ngũ cung là ngôn ngữ chung** — năm âm Cung 宮, Thương 商, Giốc 角, Chủy 徵, Vũ 羽 ứng ngũ hành Thổ, Kim, Mộc, Hỏa, Thủy (Lễ Ký · Nhạc Ký; Hoàng Đế Nội Kinh). Nhờ đó âm nhạc cũng «đúng cổ pháp» (T5) và gắn được với giờ can chi, Dụng thần.
4. **Không dùng nhạc tôn giáo thật làm nền lặp** (kinh, chú, nghi lễ có thật) khi chưa có cố vấn và giấy phép — dùng **âm hưởng** (nhạc cụ, điệu thức, giọng ngân không lời). Chi tiết §7 và phần 11 §6.

---

## 2. Khung giờ — năm khung ứng năm âm

Ngày chia 12 canh giờ (giờ địa phương của máy, như ánh sáng `render3d.js › timeLook`). Nhạc gom thành **5 khung**, mỗi khung ứng một âm ngũ cung và quyết định **điệu thức** (âm chủ) của bản phối:

| Khung | Mã | Canh giờ | Giờ đồng hồ | Hành chủ của khung | Điệu thức | Ánh sáng tương ứng (`KEYS`) | Mật độ |
|---|---|---|---|---|---|---|---|
| Khuya | `KHUYA` | Tý · Sửu · Dần | 23:00–05:00 | 水 (Tý thủy khởi) | **Vũ 羽** | đêm xanh thẫm có trăng | rất thưa; **giờ Tý yên tĩnh nhất** (canon) |
| Sớm | `SANG` | Mão · Thìn | 05:00–09:00 | 木 | **Giốc 角** | rạng đông 6,5 h, sáng 8 h | thưa → vừa |
| Ngày | `NGAY` | Tỵ · Ngọ · Mùi · Thân | 09:00–17:00 | 火 | **Chủy 徵** | trời trong 8–16 h | vừa |
| Chiều | `CHIEU` | Dậu | 17:00–19:00 | 金 | **Thương 商** | hoàng hôn 18 h | vừa, ấm |
| Tối | `TOI` | Tuất · Hợi | 19:00–23:00 | 土 (Tuất) | **Cung 宮** | đêm 19,5 h | thưa, ấm |

**Vì sao năm khung chứ không 12:** sản xuất 12 bản phối × 20 vùng = 240 bản là quá tải. Năm khung × 20 vùng = 100 bản phối từ **20 chủ đề** (mỗi vùng một chủ đề viết lại theo 5 điệu thức). 12 canh giờ vẫn được đánh dấu bằng **tiếng chuông canh** (§4.3).

**Ngũ cung trên một âm chủ** (ví dụ cung D): Cung D · Thương E · Giốc F♯ · Chủy A · Vũ B. Điệu Vũ = xoay thang bắt đầu từ B (B D E F♯ A), nghe trầm buồn; Chủy = bắt đầu từ A (A B D E F♯), sáng mở. Mỗi vùng giữ **một âm cung riêng** (bảng §3), nên đi từ vùng này sang vùng khác cùng khung giờ vẫn nghe khác giọng.

---

## 3. Danh mục nhạc vùng

### 3.0 Quy ước mã

`BGM-<VÙNG>-<KHUNG>` — vùng viết hoa không dấu theo region id canon (`THANH`, `SONMON`, `TUBINH`, `MANH`, `TRICHTHIEN`, `CUNGTHONG`, `THULAU`, `PHONGTHUY`, `LICHDUONG`, `LONGHO`, `VODANG`, `CHUNGNAM`, `MAOSHAN`, `YENTU`, `BUTTAP`, `TANGDIA`, `VANMIEU`, `PHONGDO`, `MIEUCUONG`, `CONLON`, `VANCOC`); khung `KHUYA / SANG / NGAY / CHIEU / TOI`. Mỗi bản là **vòng lặp 3–5 phút** gồm 3 lớp (stem) để trộn thích ứng (§4.1): `pad` (nền), `mel` (giai điệu), `perc` (nhịp / chuông).

> Ghi chú: Huyền Quán Sơn Môn nằm trong vùng `thanh` theo canon, nhưng có chủ đề riêng `SONMON` (sân quán) khác chủ đề phố `THANH`. Am Vân Cốc (`vancoc`) là vùng nhỏ có chủ đề riêng.

Cột «BPM» là nhịp gợi ý (nhạc tự do nhịp ghi «rubato»). Cột «Âm cung» là âm chủ của vùng.

### 3.1 Huyền Quán Sơn Môn — `SONMON` (âm cung D) — chủ đề «Chén trà đầu ngõ»

Nhạc cụ chủ: cổ cầm 古琴, sáo trúc, chuông đồng nhỏ, mõ gỗ thưa.

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-SONMON-KHUYA` | Vũ (B) | cổ cầm đơn, tiếng bội âm (泛音), gió | rubato | vài nốt mỗi 8–12 s; hơn nửa thời gian là lặng |
| `BGM-SONMON-SANG` | Giốc (F♯) | sáo trúc, cổ cầm, chim | 60 | giai điệu mở, sáo dẫn; chuông sớm (§4.3) |
| `BGM-SONMON-NGAY` | Chủy (A) | cổ cầm, đàn tranh, mõ nhẹ | 72 | chủ đề đầy đủ |
| `BGM-SONMON-CHIEU` | Thương (E) | đàn tranh, sáo trầm | 64 | ấm, chậm dần; chuông chiều |
| `BGM-SONMON-TOI` | Cung (D) | cổ cầm, ấm trà sôi (lớp môi trường) | 56 | êm, kết câu ở âm cung |

### 3.2 Huyền Thành — `THANH` (âm cung G) — chủ đề «Phố chợ Huyền Hà»

Nhạc cụ chủ: đàn nguyệt, phách, trống cơm, sáo, đàn bầu (dân gian Việt); tiếng chợ là lớp môi trường riêng.

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-THANH-KHUYA` | Vũ (E) | đàn bầu đơn, ngân luyến | rubato | phố ngủ; tiếng mõ cầm canh xa |
| `BGM-THANH-SANG` | Giốc (B) | sáo, đàn nguyệt | 76 | chợ sớm mở hàng |
| `BGM-THANH-NGAY` | Chủy (D) | đàn nguyệt, phách, trống cơm, sáo | 88 | vui nhất trong các vùng (đô thị) |
| `BGM-THANH-CHIEU` | Thương (A) | đàn nguyệt, đàn bầu | 72 | dọn hàng |
| `BGM-THANH-TOI` | Cung (G) | đàn bầu, phách thưa | 60 | đèn lồng phố đêm |

### 3.3 Tử Bình Phong — `TUBINH` (âm cung E) — chủ đề «Đỉnh cách cục»

Núi cao (`kind: peak`, cao 420 m), Lão Quân Điện. Nhạc cụ: tiêu 簫, cổ cầm, khánh đá.

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-TUBINH-KHUYA` | Vũ (C♯) | tiêu đơn, gió đỉnh | rubato | — |
| `BGM-TUBINH-SANG` | Giốc (G♯) | tiêu, cổ cầm | 58 | mây tan |
| `BGM-TUBINH-NGAY` | Chủy (B) | cổ cầm, tiêu, khánh | 66 | chủ đề nghiêm, có cấu trúc (cách cục là khung) |
| `BGM-TUBINH-CHIEU` | Thương (F♯) | cổ cầm | 60 | — |
| `BGM-TUBINH-TOI` | Cung (E) | tiêu, khánh thưa | 52 | — |

### 3.4 Manh Phái Cốc — `MANH` (âm cung A) — chủ đề «Người đọc tượng»

Thung lũng; Manh phái là dòng thầy mù đọc tượng — nhạc cụ của người hát rong mù: **tam huyền 三弦**, trống con của lối hát kể (鼓詞), giọng ngâm không lời.

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-MANH-KHUYA` | Vũ (F♯) | tam huyền gảy thưa, suối | rubato | — |
| `BGM-MANH-SANG` | Giốc (C♯) | tam huyền, chim cốc | 70 | — |
| `BGM-MANH-NGAY` | Chủy (E) | tam huyền, trống con, giọng ngâm | 84 | nhịp kể chuyện |
| `BGM-MANH-CHIEU` | Thương (B) | tam huyền, giọng ngâm | 68 | — |
| `BGM-MANH-TOI` | Cung (A) | tam huyền đơn | 56 | — |

### 3.5 Trích Thiên Đỉnh — `TRICHTHIEN` (âm cung F) — chủ đề «Bầu trời Tử Vi»

Đỉnh núi, Đẩu Mẫu Điện, Sảnh Tử Vi. Nhạc cụ: sênh 笙, biên chung nhỏ (chuông đồng xếp bộ), đàn tranh lướt (gợi sao).

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-TRICHTHIEN-KHUYA` | Vũ (D) | sênh ngân, chuông sao | rubato | đẹp nhất về đêm (sao) — ngoại lệ: khuya ở đây đầy hơn nơi khác một lớp |
| `BGM-TRICHTHIEN-SANG` | Giốc (A) | sênh, tranh | 62 | — |
| `BGM-TRICHTHIEN-NGAY` | Chủy (C) | tranh, biên chung | 70 | — |
| `BGM-TRICHTHIEN-CHIEU` | Thương (G) | sênh | 60 | — |
| `BGM-TRICHTHIEN-TOI` | Cung (F) | sênh, chuông sao | 54 | — |

### 3.6 Cùng Thông Hồ — `CUNGTHONG` (âm cung D♭) — chủ đề «Nước điều hậu»

Hồ (`kind: lake`), Sảnh Điều Hậu, bến đò. Nhạc cụ: đàn tranh (tiếng nước), sáo, mái chèo làm nhịp.

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-CUNGTHONG-KHUYA` | Vũ (B♭) | tranh lướt, nước vỗ | rubato | — |
| `BGM-CUNGTHONG-SANG` | Giốc (F) | sáo, tranh, sương | 60 | — |
| `BGM-CUNGTHONG-NGAY` | Chủy (A♭) | tranh, sáo, nhịp chèo | 72 | — |
| `BGM-CUNGTHONG-CHIEU` | Thương (E♭) | tranh | 62 | — |
| `BGM-CUNGTHONG-TOI` | Cung (D♭) | sáo đơn | 54 | — |

### 3.7 Thư Lâu Lâm — `THULAU` (âm cung C) — chủ đề «Rừng sách»

Cao nguyên rừng, Thư Lâu, Văn Xương Các. Nhạc cụ: cổ cầm độc tấu (khúc ý «thư hương»), tiếng giở trang làm nhịp nhẹ.

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-THULAU-KHUYA` | Vũ (A) | cổ cầm bội âm | rubato | — |
| `BGM-THULAU-SANG` | Giốc (E) | cổ cầm, chim rừng | 58 | — |
| `BGM-THULAU-NGAY` | Chủy (G) | cổ cầm, tiêu | 64 | — |
| `BGM-THULAU-CHIEU` | Thương (D) | cổ cầm | 58 | — |
| `BGM-THULAU-TOI` | Cung (C) | cổ cầm thưa | 50 | — |

### 3.8 Phong Thủy Viên — `PHONGTHUY` (âm cung B♭) — chủ đề «Vườn la bàn»

Vườn trên cao nguyên, Sảnh Dương Trạch. Nhạc cụ: tỳ bà 琵琶, chuông gió, nước suối vườn.

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-PHONGTHUY-KHUYA` | Vũ (G) | chuông gió, tỳ bà vê thưa | rubato | — |
| `BGM-PHONGTHUY-SANG` | Giốc (D) | tỳ bà, sáo | 66 | — |
| `BGM-PHONGTHUY-NGAY` | Chủy (F) | tỳ bà, tranh | 76 | — |
| `BGM-PHONGTHUY-CHIEU` | Thương (C) | tỳ bà | 64 | — |
| `BGM-PHONGTHUY-TOI` | Cung (B♭) | chuông gió, tỳ bà | 54 | — |

### 3.9 Lịch Đường — `LICHDUONG` (âm cung G♭) — chủ đề «Giờ khắc»

Sảnh Trạch Nhật. Nhạc cụ: biên khánh (khánh đá xếp bộ), **lậu khắc** (đồng hồ nước) làm nhịp — tiếng giọt rơi đều theo nhịp nhạc.

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-LICHDUONG-KHUYA` | Vũ (E♭) | giọt lậu khắc 60 BPM, khánh | 60 | — |
| `BGM-LICHDUONG-SANG` | Giốc (B♭) | khánh, sáo | 60 | — |
| `BGM-LICHDUONG-NGAY` | Chủy (D♭) | khánh, sênh, giọt nước | 72 | — |
| `BGM-LICHDUONG-CHIEU` | Thương (A♭) | khánh | 60 | — |
| `BGM-LICHDUONG-TOI` | Cung (G♭) | giọt nước, khánh thưa | 52 | — |

### 3.10 Long Hổ Sơn — `LONGHO` (âm cung C) — chủ đề «Thiên Sư phủ»

Chính Nhất; vách đan hà đỏ, sông Lô Khê, bè tre. Nhạc cụ theo canon: **trống, tù và, đàn nhị**; thêm **kèn bầu (sona 嗩吶)** và **thanh la, chũm chọe** của đạo nhạc khoa nghi Chính Nhất — chỉ ở lớp `perc` ban ngày và lễ.

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-LONGHO-KHUYA` | Vũ (A) | đàn nhị đơn, nước sông | rubato | — |
| `BGM-LONGHO-SANG` | Giốc (E) | tù và xa (một hồi mở ngày), nhị, trống con | 64 | — |
| `BGM-LONGHO-NGAY` | Chủy (G) | nhị, trống, sona thưa, thanh la | 84 | uy nghi nhất các vùng Đạo |
| `BGM-LONGHO-CHIEU` | Thương (D) | nhị, trống trầm | 66 | — |
| `BGM-LONGHO-TOI` | Cung (C) | nhị, mõ | 56 | — |

### 3.11 Võ Đang Huyền Nhạc — `VODANG` (âm cung F) — chủ đề «Thần đạo ngàn bậc»

Thanh Vi, Đan Đỉnh; 72 đỉnh đá vôi, biển mây. Nhạc cụ theo canon: **tiêu, cổ cầm**; thêm sênh nhẹ cho biển mây. Nhịp tự do như Thái Cực (chậm, liền, không đứt).

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-VODANG-KHUYA` | Vũ (D) | tiêu, gió vách | rubato | — |
| `BGM-VODANG-SANG` | Giốc (A) | cổ cầm, tiêu, chim | 56 | — |
| `BGM-VODANG-NGAY` | Chủy (C) | cổ cầm, tiêu, sênh | 62 | chủ đề «leo bậc»: mỗi câu cao lên một bậc |
| `BGM-VODANG-CHIEU` | Thương (G) | tiêu | 58 | — |
| `BGM-VODANG-TOI` | Cung (F) | cổ cầm | 50 | — |

### 3.12 Chung Nam Toàn Chân — `CHUNGNAM` (âm cung E♭) — chủ đề «Tùng lâm thập phương»

Toàn Chân, Linh Bảo; thung lũng, động tu, tuyết mùa đông. Nhạc cụ: **đạo nhạc Toàn Chân** — sênh, quản 管, khánh, mõ, tiếng ngân không lời của đạo chúng (giọng nam trầm); tuyết rơi là lớp môi trường.

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-CHUNGNAM-KHUYA` | Vũ (C) | quản đơn, gió tuyết | rubato | — |
| `BGM-CHUNGNAM-SANG` | Giốc (G) | khánh sớm, sênh | 60 | giờ công phu sáng (早課) gợi bằng khánh + mõ, không lời tụng |
| `BGM-CHUNGNAM-NGAY` | Chủy (B♭) | sênh, quản, mõ | 68 | — |
| `BGM-CHUNGNAM-CHIEU` | Thương (F) | khánh, ngân trầm không lời | 60 | công phu chiều (晚課) |
| `BGM-CHUNGNAM-TOI` | Cung (E♭) | sênh thưa | 52 | — |

### 3.13 Mao Sơn Thượng Thanh — `MAOSHAN` (âm cung A) — chủ đề «Rừng trúc tồn tư»

Thượng Thanh, Lư Sơn; rừng trúc, sương, đồi chè, đầm sen. Nhạc cụ: sáo trúc, đàn tranh, mõ trúc (竹梆), tiếng trúc va (lớp môi trường).

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-MAOSHAN-KHUYA` | Vũ (F♯) | sáo trầm, trúc kẽo kẹt | rubato | không làm «ma mị» — Mao Sơn là trừ tà chính tông, nhạc trong sáng |
| `BGM-MAOSHAN-SANG` | Giốc (C♯) | sáo, tranh | 64 | — |
| `BGM-MAOSHAN-NGAY` | Chủy (E) | tranh, sáo, mõ trúc | 74 | — |
| `BGM-MAOSHAN-CHIEU` | Thương (B) | tranh | 62 | — |
| `BGM-MAOSHAN-TOI` | Cung (A) | sáo | 54 | — |

### 3.14 Yên Tử Trúc Lâm — `YENTU` (âm cung D) — chủ đề «Đường tùng lên Chùa Đồng»

Thiền Việt; rừng tùng 700 năm, mây vờn, bậc đá rêu. Nhạc cụ theo canon: **mõ, chuông, sáo trúc**; thêm đàn bầu ngân (bản sắc Việt) và tiêu Việt.

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-YENTU-KHUYA` | Vũ (B) | chuông đại thưa (mỗi ~40 s), gió tùng | rubato | thiền — gần như im lặng |
| `BGM-YENTU-SANG` | Giốc (F♯) | sáo trúc, chuông sớm (108 tiếng thu gọn), chim | 58 | — |
| `BGM-YENTU-NGAY` | Chủy (A) | sáo, đàn bầu, mõ chậm | 60 | — |
| `BGM-YENTU-CHIEU` | Thương (E) | đàn bầu, chuông chiều | 56 | — |
| `BGM-YENTU-TOI` | Cung (D) | sáo đơn, mõ | 48 | — |

### 3.15 Bút Tháp Tịnh Độ — `BUTTAP` (âm cung G) — chủ đề «Cửu phẩm liên hoa»

Tịnh Độ, sám hối; đồng lúa, hồ sen, cây đa, giếng làng, lễ hội thả đèn. Nhạc cụ theo canon: **tụng niệm xa, đàn bầu**; thêm đàn nhị Việt, mõ, chuông gia trì, sáo; «tụng niệm xa» làm bằng **ngân không lời** nhiều giọng (nữ trầm + nam) đặt rất xa trong không gian (§7).

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-BUTTAP-KHUYA` | Vũ (E) | đàn bầu ngân, ếch đồng | rubato | — |
| `BGM-BUTTAP-SANG` | Giốc (B) | mõ, chuông gia trì, ngân xa | 60 | — |
| `BGM-BUTTAP-NGAY` | Chủy (D) | đàn bầu, nhị, sáo | 66 | đồng quê Bắc Bộ |
| `BGM-BUTTAP-CHIEU` | Thương (A) | đàn bầu, ngân xa | 58 | — |
| `BGM-BUTTAP-TOI` | Cung (G) | đàn bầu, mõ | 50 | — |

### 3.16 Tạng Địa Tuyết Vực — `TANGDIA` (âm cung A♭) — chủ đề «Đèo cờ gió» (**chờ tham vấn**)

Mật (Chuẩn Đề; Tạng truyền chờ tham vấn — canon §3). Nhạc cụ theo canon: **kèn dài (dungchen), chuông bát, tụng trầm**. Đến khi có cố vấn: chỉ dùng **chuông bát (singing bowl), gió đèo, cờ lungta phần phật, kèn dài từ rất xa** — **không** dùng tụng trầm (giọng hát họng) để tránh mô phỏng nghi lễ khi chưa được phép.

| Mã | Điệu | Nhạc cụ (bản tạm) | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-TANGDIA-KHUYA` | Vũ (F) | chuông bát ngân, gió | rubato | — |
| `BGM-TANGDIA-SANG` | Giốc (C) | kèn dài xa (một hồi), chuông bát | rubato | — |
| `BGM-TANGDIA-NGAY` | Chủy (E♭) | chuông bát, cờ gió, đàn dây gảy | 58 | — |
| `BGM-TANGDIA-CHIEU` | Thương (B♭) | kèn dài xa, chuông bát | rubato | — |
| `BGM-TANGDIA-TOI` | Cung (A♭) | chuông bát thưa | rubato | — |

### 3.17 Văn Miếu Quốc Tử Giám — `VANMIEU` (âm cung C) — chủ đề «Khuê Văn»

Nho; cây đa, muỗm, hồ Văn, sĩ tử áo the. Nhạc cụ theo canon: **nhã nhạc cung đình** — kèn bầu, sáo, đàn nguyệt, đàn tỳ bà, đàn nhị, trống, phách, biên khánh. Ngày thường dùng **bản thu gọn thính phòng** (tiểu nhạc 細樂: dây + sáo); đại nhạc (kèn trống) chỉ ở lễ khoa cử, Tết thầy.

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-VANMIEU-KHUYA` | Vũ (A) | đàn nguyệt đơn | rubato | — |
| `BGM-VANMIEU-SANG` | Giốc (E) | sáo, đàn nguyệt, tiếng đọc bài xa (không lời rõ) | 66 | — |
| `BGM-VANMIEU-NGAY` | Chủy (G) | tiểu nhạc: tỳ bà, nguyệt, nhị, sáo, phách | 72 | trang trọng, mạch lạc |
| `BGM-VANMIEU-CHIEU` | Thương (D) | nguyệt, tỳ bà | 64 | — |
| `BGM-VANMIEU-TOI` | Cung (C) | đàn nguyệt, phách thưa | 56 | — |

### 3.18 Phong Đô Quỷ Thành — `PHONGDO` (âm cung B) — chủ đề «Cầu Nại Hà»

Bắc Đế, Động Uyên, Địa Tạng; hang núi bên sông, sương lạnh, hoa bỉ ngạn. Nhạc cụ theo canon: **gió, giọt nước, tụng siêu độ** — «tụng» làm bằng ngân trầm không lời (§7); thêm đàn nhị trầm, khánh. Luật: **buồn nhưng không kinh dị** — Phong Đô là nơi trả nghiệp và cứu người, không phải vùng quái vật (canon §7.9). Không dùng tiếng hét, cười ma, âm chói.

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-PHONGDO-KHUYA` | Vũ (G♯) | giọt nước hang, gió | rubato | — |
| `BGM-PHONGDO-SANG` | Giốc (D♯) | khánh, nước sông | rubato | sương sớm — một ít ánh sáng |
| `BGM-PHONGDO-NGAY` | Chủy (F♯) | nhị trầm, ngân không lời | 52 | — |
| `BGM-PHONGDO-CHIEU` | Thương (C♯) | ngân trầm, khánh | 48 | — |
| `BGM-PHONGDO-TOI` | Cung (B) | gió, giọt nước, nhị | rubato | — |

Biến thể khi người chơi **đang hồi đầu** (có Nợ Âm, đang làm chuỗi trả nghiệp): thêm lớp `mel` hy vọng (đàn tranh, điệu Giốc) — tiến độ trả nghiệp càng cao lớp này càng to (0 → −6 dB).

### 3.19 Miêu Cương Cổ Trại — `MIEUCUONG` (âm cung E) — chủ đề «Sông xanh trại cổ»

Bàng môn hư cấu; sông xanh lục giữa núi đá vôi, ruộng bậc thang, nhà sàn treo, cầu phong vũ. Nhạc cụ theo canon: **khèn (lô sênh 蘆笙), trống đồng**; thêm đàn môi, sáo dọc, hát ngân không lời kiểu «phi ca» (飛歌) **do ca sĩ người Miêu thể hiện có hợp đồng** (§7). Luật: người Miêu trong game là **nạn nhân và người chữa** (canon §5.5) — nhạc ấm, sống động, không gán màu «tà».

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-MIEUCUONG-KHUYA` | Vũ (C♯) | đàn môi đơn, suối | rubato | — |
| `BGM-MIEUCUONG-SANG` | Giốc (G♯) | sáo dọc, chim, ngân xa | 68 | — |
| `BGM-MIEUCUONG-NGAY` | Chủy (B) | khèn, trống đồng nhẹ, đàn môi | 92 | vùng nhịp nhất (đời sống trại) |
| `BGM-MIEUCUONG-CHIEU` | Thương (F♯) | khèn, sáo | 72 | — |
| `BGM-MIEUCUONG-TOI` | Cung (E) | khèn thưa, lửa bếp | 58 | — |

Biến thể **hang dưới Miêu Cương** (sào huyệt Lỗ Ban — phản diện): `BGM-MIEUCUONG-HANG` — không điệu ngũ cung đầy đủ (bỏ âm Cung, thang khuyết, nghe «mất gốc»), trống đồng vỗ tắt tiếng, gió hang. Tượng trưng cho thứ lệch khỏi đạo.

### 3.20 Côn Lôn Thiên Trì — `CONLON` (âm cung D) — chủ đề «Quy nhất»

End-game, đảo trời cao 260 m; thác đổ xuống biển mây, hạc, đào tiên. Nhạc cụ: **mọi bản sắc hợp lại** — cổ cầm (Đạo), đàn bầu (Việt / Phật Việt), chuông bát (Mật), nhã nhạc (Nho), khèn (bàng môn), trên nền dàn dây và hợp xướng ngân không lời. Chủ đề Côn Lôn là **đối âm** của 4 chủ đề lớn (Sơn Môn, Võ Đang, Yên Tử, Văn Miếu) — người chơi nhận ra giai điệu từng nơi đã qua.

| Mã | Điệu | Nhạc cụ | BPM | Mô tả |
|---|---|---|---|---|
| `BGM-CONLON-KHUYA` | Vũ (B) | chuông bát, cổ cầm bội âm, hợp xướng rất xa | rubato | — |
| `BGM-CONLON-SANG` | Giốc (F♯) | sáo, đàn bầu, hạc | 60 | — |
| `BGM-CONLON-NGAY` | Chủy (A) | đầy đủ | 66 | — |
| `BGM-CONLON-CHIEU` | Thương (E) | dây, cổ cầm, khèn | 60 | — |
| `BGM-CONLON-TOI` | Cung (D) | hợp xướng, chuông | 52 | — |

Lớp **«đạo thống đã tu»**: mỗi đạo thống người chơi đã tu (≥ 1) bật thêm một lớp nhạc cụ của đạo đó trong chủ đề Côn Lôn — quy nhất bằng âm thanh. Đủ 3 đạo (điều kiện vào) là đủ 3 lớp; tu nhiều hơn thì nhạc đầy hơn.

### 3.21 Am Vân Cốc — `VANCOC` (âm cung G) — chủ đề «Liễu Phàm»

Am tranh trên vách đá sau Hậu Sơn. Một nhạc cụ duy nhất: **tiêu** (người kể chuyện), cộng tiếng mưa trên mái tranh, ấm trà. Đây cũng là **chủ đề của Mệnh Đồ** (§5.2).

| Mã | Điệu | BPM | Mô tả |
|---|---|---|---|
| `BGM-VANCOC-KHUYA` | Vũ (E) | rubato | chỉ mưa và tiêu 3 câu |
| `BGM-VANCOC-SANG` | Giốc (B) | 54 | — |
| `BGM-VANCOC-NGAY` | Chủy (D) | 58 | — |
| `BGM-VANCOC-CHIEU` | Thương (A) | 54 | — |
| `BGM-VANCOC-TOI` | Cung (G) | 50 | — |

---

## 4. Luật nhạc thích ứng

### 4.1 Ba lớp và bốn mức cường độ

Mỗi bản vùng có 3 stem: `pad` (nền ngân), `mel` (giai điệu), `perc` (nhịp, chuông, mõ). Trộn theo **mức cường độ**:

| Mức | `pad` | `mel` | `perc` | Khi |
|---|---|---|---|---|
| M0 Lặng | −∞ (tắt) | tắt | tắt | chỉ môi trường — giờ Tý; đang ngồi thiền; trong UI-42 |
| M1 Thưa | 0 dB | −12 dB, mỗi câu cách ≥ 20 s | tắt | khuya, trong điện thờ, đang đọc bảng dài |
| M2 Thường | 0 | 0 | −6 dB | đi lại bình thường |
| M3 Đầy | 0 | 0 | 0 | lễ hội, vừa tới vùng mới (60 s đầu), cảnh mở `cam.reveal` |

### 4.2 Bảng chọn mức

| Tình huống | Mức |
|---|---|
| giờ Tý (23–01) | M0 trong 70% thời gian; M1 một câu mỗi 3–5 phút |
| giờ Sửu, Dần | M1 |
| Mão, Thìn, Dậu, Tuất, Hợi | M2 |
| Tỵ, Ngọ, Mùi, Thân | M2 |
| mở bảng (half) | giảm một mức (không dưới M1) |
| mở bảng full / đọc kinh | M1 |
| mini-game (UI-80) | lớp «tĩnh» = M1 của vùng, hoặc nhạc mini-game riêng §5.3 |
| hội thoại kịch bản | M1, `mel` tắt khi có VO |
| hội thoại AI | M1 |
| ngự kiếm | M2 + lớp gió; trên 200 m: chuyển sang `BGM-SKY` (§5.4) |
| đông người (≥ 15 người trong 30 m — MMO) | M2 → `perc` +3 dB (cảm giác hội) |
| đứng yên > 90 s (không bảng) | giảm dần về M1 trong 20 s |

### 4.3 Chuông canh — đánh dấu 12 giờ can chi

Đầu mỗi canh giờ (23, 1, 3, …, 21 giờ) phát **chuông canh** theo vùng: chùa / quán đánh chuông, phố đánh mõ cầm canh. Số tiếng và nhạc cụ:

| Canh | Giờ | Số tiếng | Chuông canh mặc định | Biến thể vùng |
|---|---|---|---|---|
| Tý | 23:00 | 9 | `SFX-BELL-030` chuông đại trầm | Phố: mõ cầm canh `SFX-BELL-040` |
| Sửu | 01:00 | 8 | như trên, nhỏ | — |
| Dần | 03:00 | 7 | như trên | Chung Nam: khánh công phu sớm |
| Mão | 05:00 | 6 | **chuông sớm** (hồi chuông dài, 18 tiếng thu gọn từ nghi 108) | Yên Tử, Bút Tháp: chuông chùa Việt `SFX-BELL-031` |
| Thìn | 07:00 | 5 | chuông nhỏ | — |
| Tỵ | 09:00 | 4 | khánh | — |
| Ngọ | 11:00 | 9 | trống ngọ `SFX-BELL-041` (tiếng trống) | Văn Miếu: trống báo |
| Mùi | 13:00 | 8 | khánh | — |
| Thân | 15:00 | 7 | khánh | — |
| Dậu | 17:00 | 6 | **chuông chiều** (hồi dài) | — |
| Tuất | 19:00 | 5 | chuông | — |
| Hợi | 21:00 | 4 | mõ | — |

Số tiếng theo một lối đếm chuông giờ cổ ở Đông Á (Tý–Ngọ 9, Sửu–Mùi 8, Dần–Thân 7, Mão–Dậu 6, Thìn–Tuất 5, Tỵ–Hợi 4) — chọn vì dễ nhận ra giờ bằng tai; đây là quy ước thiết kế, không khẳng định là tập quán của riêng chùa / quán nào. Cố vấn có thể đổi cho từng vùng (vd chùa Việt đánh chuông theo khóa lễ, không theo giờ). Chuông canh đi bus Môi trường, có thể tắt riêng (UI-77). Trong mini-game và hội thoại: hoãn tới khi xong (tối đa 5 phút, quá thì bỏ).

### 4.4 Chuyển khung giờ và chuyển vùng

| Chuyển | Cách |
|---|---|
| sang khung giờ mới | chờ hết câu `mel` hiện tại (≤ 20 s), đan chéo 8 s sang bản khung mới; chuông canh lấp chỗ nối |
| sang vùng mới (đi bộ qua ranh) | đan chéo 6 s, bắt đầu ở ranh vùng ±40 m (theo `REGIONS.r`); giữa hai vùng: chỉ `pad` của cả hai (−6 dB mỗi bên) |
| trạm đi nhanh / màn chuyển | nhạc cũ tắt dần 0,5 s trong màn đen, nhạc mới bắt đầu ở M3 (vùng mới) |
| vào điện thờ | §5.1, đan chéo 1 s |

### 4.5 Nhạc hợp mệnh (★ tùy chọn, mặc định tắt)

Bật «Nhạc theo Dụng thần» (UI-77): khi người chơi đứng trong vùng có hành trùng **Dụng thần** của họ, hoặc trong giờ của hành Dụng thần (vd Dụng Thủy → giờ Hợi, Tý), lớp `mel` chơi thêm **motif cá nhân** — 5 nốt trên âm của hành Dụng thần (Thủy → âm Vũ). Không thưởng chỉ số; chỉ là «tiếng của mệnh mình». Với `MAU-A` (Dụng Thủy): motif Vũ nổi lên ở Cùng Thông Hồ, Võ Đang (Huyền Vũ) và các giờ Hợi, Tý.

### 4.6 Thời tiết

| Thời tiết | Nhạc |
|---|---|
| mưa | `pad` lọc thông thấp 1,2 kHz, `perc` tắt; lớp mưa môi trường (phần 10) lên |
| tuyết (Chung Nam, Tạng) | `mel` chậm 10% (kéo dài nốt), chuông bát lên |
| sương | `pad` +2 dB, độ vang (reverb) dài thêm 1 s |
| sấm | không thay nhạc; sấm là SFX |

---

## 5. Nhạc ngoài vùng

### 5.1 Trong điện thờ — `BGM-INT-*`

| Mã | Dùng ở | Nhạc cụ | Ghi chú |
|---|---|---|---|
| `BGM-INT-TAMTHANH` | Chính Điện Tam Thanh | sênh, khánh, ngân trầm | Đạo, uy nghi |
| `BGM-INT-VANXUONG` | Văn Xương Các | cổ cầm, khánh | học |
| `BGM-INT-DAUMAU` | Đẩu Mẫu Điện | chuông sao (biên chung nhỏ), sênh | dùng lại motif Trích Thiên |
| `BGM-INT-LAOQUAN` | Lão Quân Điện | tiêu, khánh | — |
| `BGM-INT-VANMENH` | Vận Mệnh Các | **chủ đề Mệnh Đồ** (tiêu) + 9 biến tấu nhỏ, mỗi cổng đại vận một biến tấu theo điệu của hành can vận | đứng trước cổng 甲申 (Giáp – Mộc) → biến tấu điệu Giốc |
| `BGM-INT-THAITUE` | Thái Tuế Điện | trống trầm thưa, khánh, đèn dầu | nghiêm trang, không đáng sợ |
| `BGM-INT-CHUA` | điện Phật (Yên Tử, Bút Tháp) | mõ, chuông gia trì, ngân không lời | — |
| `BGM-INT-NHA` | nhà riêng người chơi | đàn tranh nhẹ theo khung giờ | — |
| `BGM-INT-TANGKINH` | Tàng kinh các | gần im lặng, giở trang | — |

### 5.2 Màn hình và chủ đề chính

| Mã | Dùng ở | Mô tả |
|---|---|---|
| `BGM-GATE-01` | cổng UI-02 / UI-06 | chủ đề chính «Mệnh Do Ta Tạo» bản cổ cầm + sáo, 2 phút lặp |
| `BGM-RITE-01` | lễ nhập môn UI-04 / UI-05 | 12 s, khởi từ mài mực tới chuông; viết khớp trình tự thời gian UI-04 |
| `BGM-MENHDO-01` | Mệnh Đồ UI-27 (bảng mở lâu > 10 s) | chủ đề Vân Cốc, tiêu đơn |
| `BGM-ASCEND-01…06` | đột phá cảnh giới UI-33 (6 bậc) | 9 s; mỗi bậc thêm một nhạc cụ, bậc 6 là toàn bộ chủ đề Côn Lôn |
| `BGM-VOW-01…03` | đại nguyện 300 / 600 / 1.000 công | 9 s; chủ đề Vân Cốc nâng dần |
| `BGM-CREDITS` | đoạn kết | chủ đề chính đầy đủ |

### 5.3 Mini-game — `BGM-MG-*`

| Mã | Mini-game | Mô tả |
|---|---|---|
| `BGM-MG-TINHTOA` | UI-81 | nền ngân theo **chu kỳ thở 14 s** (4 hít – 4 giữ – 6 thở): pad phồng / lặng / xẹp khớp vòng thở |
| `BGM-MG-KETPHU` | UI-82 | trống con + mõ, nhịp chậm 66; mỗi ô đặt đúng thêm một lớp |
| `BGM-MG-KHOACU` | UI-83 | tiểu nhạc Văn Miếu, nhịp đếm của nén hương |
| `BGM-MG-SAMHOI` | UI-92 | **chỉ mõ** 60 BPM + chuông mỗi lạy (nhịp là nhạc) |
| `BGM-MG-BAIDAU` | UI-93 | chuông sao, mỗi đèn thắp thêm một nốt |
| `BGM-MG-MANDALA` | UI-88 | chuông bát ngân dài, đổi cao độ theo màu cát đang rắc |
| `BGM-MG-CONGAN` | UI-87 | gần như M0: gió núi, một chuông xa mỗi 60 s |
| `BGM-MG-SUANHA` | UI-85 | đàn tranh theo khung giờ |
| `BGM-MG-DOICHIEU` | UI-89 | đàn nguyệt nhịp lửng lơ (dò xét), chuyển điệu sáng khi đủ bằng chứng |

### 5.4 Bầu trời — `BGM-SKY`

Ngự kiếm trên 200 m: chủ đề bay (sáo, dây, nhịp nhẹ theo tốc độ — tốc độ càng cao lớp `perc` càng to). Gần Côn Lôn (< 400 m): đan dần vào `BGM-CONLON-*`.

### 5.5 Lễ tiết — `BGM-EV-*`

| Mã | Lễ (canon §10) | Thay nhạc ở | Nhạc |
|---|---|---|---|
| `BGM-EV-TET` | Lập Xuân / Tết | toàn máy chủ | chủ đề Huyền Thành bản lễ: trống, kèn, pháo (SFX), đàn nguyệt |
| `BGM-EV-THUONGNGUYEN` | Rằm tháng Giêng | Huyền Thành, Thái Tuế Điện | sáo, đèn lồng, chuông |
| `BGM-EV-VULAN` | 15/7 Trung Nguyên – Vu Lan | Bút Tháp, Phong Đô, Hồ Sen | đàn bầu + ngân không lời; giai điệu hiếu (dân ca «Lòng mẹ» **không** dùng vì bản quyền — sáng tác mới) |
| `BGM-EV-HANGUYEN` | 15/10 Hạ Nguyên | Cùng Thông Hồ | đàn tranh, nước |
| `BGM-EV-TRUNGCUU` | 9/9 Trùng Cửu (Đẩu Mẫu) | Đẩu Mẫu Điện, Trích Thiên | chuông sao đầy đủ |
| `BGM-EV-PHATDAN` | Phật đản | Yên Tử, Bút Tháp | chuông, mõ, sáo; tắm Phật |
| `BGM-EV-TETTHAY` | giỗ Khổng Tử / Tết thầy | Văn Miếu | đại nhạc nhã nhạc (kèn, trống) |

### 5.6 Câu nhạc ngắn (stinger) — `BGM-STING-*`

| Mã | Khi | Dài |
|---|---|---|
| `BGM-STING-REGION` | lần đầu vào vùng (kèm `cam.reveal`) | 6 s, motif vùng |
| `BGM-STING-QUEST` | nhận nhiệm vụ chính | 3 s |
| `BGM-STING-QUESTDONE` | xong nhiệm vụ chính | 4 s |
| `BGM-STING-MENHDO` | xong một tầng Mệnh Đồ | 4 s, chủ đề Vân Cốc |
| `BGM-STING-TALOAN` | nhận Âm Bài (Tà Lộ) | 4 s, thang khuyết (như hang Miêu Cương) |
| `BGM-STING-HOIDAU` | danh hiệu Hồi Đầu | 8 s, chủ đề Vân Cốc chuyển điệu Vũ → Cung (từ tối về trung) |
| `BGM-STING-THAU` / `-GAN` / `-CHUA` | kết quả mini-game | 2–3 s; «Chưa thấu» là câu nhạc **dở dang mở** (hẹn làm lại), không phải nhạc thua |

---

## 6. Sản xuất nhạc

### 6.1 Khối lượng

| Hạng mục | Số bản | Thời lượng | Ghi chú |
|---|---|---|---|
| chủ đề vùng | 21 | — | viết trước, duyệt với cố vấn từng truyền thống |
| bản phối vùng × khung | 21 × 5 = 105 | 3–5 phút, 3 stem | ≈ 420 phút nhạc, ≈ 1.260 stem |
| biến thể (hang Miêu, Phong Đô hồi đầu) | 2 | 3 phút | — |
| điện thờ | 9 | 3 phút | — |
| màn hình, nghi thức | 13 | 9 s – 2 phút | — |
| mini-game | 9 | 2–3 phút | — |
| bầu trời | 1 | 4 phút | — |
| lễ tiết | 7 | 4 phút | — |
| stinger | 9 | 2–8 s | — |

### 6.2 Thu âm

- Nhạc cụ dân tộc **thu thật** với nhạc công (đàn bầu, đàn nguyệt, đàn tranh, sáo trúc, nhị, tỳ bà, cổ cầm, tiêu, sênh, khèn Miêu, tam huyền, kèn bầu); bộ gõ (mõ, khánh, chuông) thu từng tiếng làm thư viện mẫu dùng chung cho SFX (phần 10).
- Ngân không lời (tụng xa): hợp xướng nhỏ 8–12 giọng, hát nguyên âm («a», «u», «m») trên điệu ngũ cung; **không** hát lời kinh / chú.
- Nhã nhạc: mời nhóm nhạc cung đình Huế hoặc nghệ nhân được truyền dạy; ký hợp đồng ghi rõ quyền dùng trong game.
- Cổ cầm: thu ở phòng khô, micro gần + phòng (tiếng gảy và tiếng trượt ngón là một phần nhạc).

### 6.3 Định dạng giao cho game

| Mục | Giá trị |
|---|---|
| Mẫu | 48 kHz, 24 bit (bản gốc); xuất 44,1 kHz |
| Định dạng | Opus 96 kbps mỗi cặp kênh (web / Android); AAC (Safari / iOS) — chi tiết phần 11 §4.4 |
| Vòng lặp | điểm lặp chính xác theo mẫu, ghi trong tệp siêu dữ liệu JSON (`loopStart`, `loopEnd` tính bằng mẫu) |
| Stem | 3 stem stereo đóng chung **một tệp 6 kênh** (kênh 1–2 `pad`, 3–4 `mel`, 5–6 `perc`), cùng điểm lặp; kèm bản trộn sẵn stereo làm dự phòng |
| Siêu dữ liệu | vùng, khung, điệu, âm cung, BPM, các điểm «hết câu» (để §4.4 chờ đúng chỗ) |
| Dung lượng ước | tệp 6 kênh 4 phút ≈ 8,6 MB (Opus ≈ 288 kbps tổng) + bản stereo dự phòng ≈ 2,9 MB → 105 bản ≈ 1,2 GB: **tải theo vùng** (chỉ vùng đang ở + liền kề), xoá bản cũ khỏi bộ nhớ đệm khi > 120 MB |

### 6.4 Phát nhạc (kỹ thuật, tham chiếu tài liệu 13)

- Phát nhạc: một tệp 6 kênh (3 stem stereo) phát luồng qua một phần tử `<audio>` → `ChannelSplitterNode` → 3 `GainNode` mức (§4.1) → bus MUS; không giải mã cả bản vào bộ nhớ (lý do và phương án dự phòng: phần 11 §4.3).
- Tải trước: tệp của khung giờ hiện tại + khung kế tiếp (bộ đệm HTTP), không giải mã.
- Mất tiêu điểm tab (`visibilitychange`): tắt dần 0,3 s (đã có hành vi dừng vòng lặp game).
- Bản iOS native: dùng cùng tệp, phát qua WebAudio trong WKWebView; xử lý ngắt âm (cuộc gọi đến) — dừng và tiếp tục.

---

## 7. Luật nội dung và tôn trọng (âm nhạc)

| # | Luật | Áp dụng |
|---|---|---|
| 1 | Không dùng bản ghi nghi lễ tôn giáo **thật** (lễ cầu siêu, khóa lễ, tụng kinh) làm nhạc nền nếu không có sự đồng ý bằng văn bản của nơi thờ / người thực hiện | mọi vùng |
| 2 | Không hát lời kinh, chú, thần chú thật; «tụng» là ngân không lời | Bút Tháp, Phong Đô, Chung Nam, Tạng |
| 3 | Tạng Địa: chỉ bản tạm (chuông bát, gió, kèn xa) cho tới khi có cố vấn (canon §3, §14) | Tạng |
| 4 | Âm nhạc dân tộc Miêu: thu với nghệ sĩ người Miêu, ghi công, chia sẻ quyền lợi; không dùng làm nhạc cho cảnh phản diện | Miêu Cương |
| 5 | Nhạc phản diện (Định Mệnh Hội, Lỗ Ban) dùng **thang khuyết** — không gán nhạc cụ của một dân tộc / tôn giáo cụ thể cho phe ác | hang Miêu, quầy Định Mệnh Hội |
| 6 | Không nhạc kinh dị ở Phong Đô / Mao Sơn; buồn và nghiêm, không dọa | Phong Đô, Mao Sơn |
| 7 | Dân ca, bài hát có bản quyền (vd các ca khúc Vu Lan nổi tiếng) không dùng — sáng tác mới | lễ tiết |
| 8 | Nhã nhạc cung đình Huế là di sản UNESCO (2003): ghi rõ «âm hưởng nhã nhạc», mời nghệ nhân, ghi công | Văn Miếu |

---

## 8. Nghiệm thu âm nhạc

1. Đi một vòng 20 vùng trong một khung giờ: người nghe thử (n ≥ 10, mù tên vùng) nhận đúng vùng ≥ 70% chỉ bằng nhạc.
2. Giờ Tý: ≥ 70% thời gian không có giai điệu (đo bằng công cụ phân tích mức).
3. Chuyển vùng, chuyển khung giờ: không có điểm đứt nghe được (kiểm 50 lần chuyển ngẫu nhiên).
4. Cố vấn từng truyền thống duyệt chủ đề vùng mình (biên bản lưu kèm tài liệu 14).
5. Tổng dung lượng nhạc tải lần đầu (Sơn Môn + Huyền Thành) ≤ 25 MB.

---

## 9. Bản đặt hàng sáng tác (brief cho nhà soạn nhạc)

### 9.1 Ký hiệu

Giai điệu phác bằng **số giản phổ** trên ngũ cung: `1` Cung · `2` Thương · `3` Giốc · `5` Chủy · `6` Vũ; chấm dưới (`6̣`) là quãng tám thấp, chấm trên (`1̇`) quãng tám cao; `–` kéo dài một phách; `|` vạch nhịp. Âm cung cụ thể theo vùng (bảng §3). «Tham khảo» là để nói **cảm giác** — **không** trích giai điệu của tác phẩm tham khảo.

### 9.2 Chủ đề chính «Mệnh Do Ta Tạo» (`BGM-GATE-01`, `BGM-CREDITS`, lõi của `BGM-CONLON-*`)

| Mục | Nội dung |
|---|---|
| Ý | đi từ thấp lên cao như tự viết lại đời mình — **bắt đầu ở Vũ (Thủy, tối), kết ở Cung (Thổ, vững)** |
| Motif lõi (5 nốt) | `6̣ 1 2 3 5 –` (đi lên) · trả lời `5 3 2 1 –` (về chủ âm) |
| Cấu trúc | A (cổ cầm đơn, motif đi lên) → B (sáo vào, motif đảo ngược) → A' (dàn đầy, kết Cung) |
| Nhạc cụ | cổ cầm, sáo trúc, đàn bầu (một câu luyến ở B — bản sắc Việt), dây nền, chuông nhỏ |
| Nhịp | 66 BPM, tự do ở A |
| Tham khảo cảm giác | sự thong thả của cổ cầm 《流水》; câu luyến đàn bầu trong ca Huế |
| Tránh | kèn đồng phương Tây, trống trận, hợp xướng kiểu sử thi Hollywood |

### 9.3 Chủ đề Vân Cốc / Mệnh Đồ (`BGM-VANCOC-*`, `BGM-MENHDO-01`, `BGM-STING-MENHDO`, `BGM-VOW-*`, `BGM-STING-HOIDAU`)

| Mục | Nội dung |
|---|---|
| Ý | người thầy già kể chuyện Liễu Phàm: buồn nhẹ rồi hé hy vọng |
| Motif | `3 2 6̣ – | 1 2 3 5 –` (đi xuống rồi dựng dậy) |
| Biến thể đại nguyện 300 / 600 / 1.000 công | cùng motif, mỗi mốc thêm một nhạc cụ (tiêu → + cổ cầm → + đàn bầu + chuông) |
| Biến thể Hồi Đầu | motif chuyển từ điệu Vũ sang điệu Cung giữa chừng (từ tối về trung) |
| Nhạc cụ | tiêu là chính; mưa trên mái tranh là một phần của bản thu |
| Tham khảo cảm giác | khúc tiêu độc tấu buổi tối; khoảng lặng dài |

### 9.4 Chủ đề nhập môn (`BGM-RITE-01`)

| Mục | Nội dung |
|---|---|
| Ý | khoảnh khắc «game hiểu mình» — trang trọng, ấm |
| Khớp hình | 12 s, khớp trình tự UI-04: 0–0,4 s mài mực (không nhạc) · 0,4–1,45 s bốn tiếng thẻ lật làm **nhịp** · 1,9 s khánh · 2,4–3 s nền dâng · 3–4 s ba nốt Dụng / Hỷ / Kỵ · 4–12 s motif chính hạ dần |
| Ba nốt Dụng / Hỷ / Kỵ | phát **đúng âm ngũ cung của hành** tương ứng (vd `MAU-A`: Dụng Thủy → Vũ, Hỷ Kim → Thương, Kỵ Thổ → Cung) — nhạc «đọc» lá số |

### 9.5 Brief từng vùng

| Vùng | Ý (một câu) | Motif gợi ý | Tham khảo cảm giác | Tránh |
|---|---|---|---|---|
| `SONMON` | chén trà đầu ngõ, không ai giục | `5 6 1̇ 6 5 –` | cổ cầm trà thất | nhịp gõ đều liên tục |
| `THANH` | phố chợ hiền, có tiếng cười | `1 2 3 5 3 2 1 –` | đàn nguyệt chèo, phách | nhạc «chợ Tàu» rập khuôn |
| `TUBINH` | khung nhà vững chãi | `1 5 1̇ – 5 3 2 1` (bước quãng năm — «cách cục») | cổ cầm 《平沙落雁》 | trầm buồn |
| `MANH` | người thầy mù kể chuyện bằng đàn | `6̣ 1 6̣ 5̣ 6̣ –` (lặp như kể) | tam huyền hát kể | biến người khiếm thị thành bi kịch |
| `TRICHTHIEN` | bầu trời sao đếm được | arpeggio `1 3 5 1̇ 3̇` (chuông sao) | sênh và chuông nhỏ | âm điện tử «vũ trụ» |
| `CUNGTHONG` | nước điều hòa nóng lạnh | `3 5 6 5 3 2 –` (sóng) | đàn tranh lướt | — |
| `THULAU` | rừng sách lặng | `2 3 2 1 6̣ –` | cổ cầm độc tấu | — |
| `PHONGTHUY` | vườn đặt đúng chỗ | `5 3 5 6 1̇ –` | tỳ bà vê nhẹ | tỳ bà «sát phạt» (lối 十面埋伏) |
| `LICHDUONG` | giọt nước đếm thời gian | ostinato giọt nước + `1 2 1 6̣` | khánh đá, lậu khắc | — |
| `LONGHO` | phủ đệ uy nghi bên sông đỏ | `1 – 5 – 6 5 3 –` (nhị dẫn) | đạo nhạc khoa nghi Chính Nhất (âm hưởng) | ghi âm khoa nghi thật |
| `VODANG` | leo bậc, chậm mà không đứt | mỗi câu cao hơn câu trước một bậc ngũ cung | nhịp Thái Cực | nhạc võ hiệp đánh nhau |
| `CHUNGNAM` | tùng lâm giữa tuyết | ngân dài `1 – – 2 – – 6̣ – –` | công phu sớm chiều (âm hưởng) | tụng thật |
| `MAOSHAN` | rừng trúc trong sáng | `3 5 3 2 3 –` (sáo) | sáo trúc Giang Nam | màu «ma mị» |
| `YENTU` | đường tùng lên đỉnh mây | `6̣ 1 2 – 1 6̣ –` (đàn bầu ngân) | Thiền Việt, chuông chùa | chuông dồn dập |
| `BUTTAP` | đồng quê có tiếng chuông | `5 6 5 3 2 3 –` (dân ca Bắc Bộ) | đàn bầu, ngân xa | tụng kinh thật |
| `TANGDIA` | đèo gió và chuông bát (bản tạm) | không giai điệu rõ — tầng ngân | chuông bát | hát họng, kèn nghi lễ thật (chờ tham vấn) |
| `VANMIEU` | trang nghiêm của chữ | `1 2 3 5 6 5 3 2 1 –` (đều, cân) | tiểu nhạc nhã nhạc | nhạc lễ quá ồn ở ngày thường |
| `PHONGDO` | buồn, tĩnh, có lối ra | `6̣ – 1 6̣ 5̣ –` + lớp hy vọng `3 5 6 1̇` | nhị trầm, khánh | kinh dị |
| `MIEUCUONG` | trại sống động bên sông | `5 5 6 1̇ 6 5 –` (khèn đối đáp) | khèn Miêu, phi ca (người Miêu thể hiện) | gán âm hưởng Miêu cho cảnh ác |
| `CONLON` | mọi con đường gặp nhau | chồng 4 motif vùng lớn lên chủ đề chính | — | hợp xướng sử thi |
| `VANCOC` | §9.3 | — | — | — |

### 9.6 Quy trình duyệt nhạc

1. Bản phác 60 s cho mỗi chủ đề (một nhạc cụ + nền) → duyệt ý với thiết kế.
2. Bản phối 5 khung giờ cho một vùng mẫu (Sơn Môn) → kiểm chuyển khung, chuông canh, mức M0–M3 trong game thật.
3. Duyệt văn hóa với cố vấn vùng (Long Hổ, Võ Đang, Chung Nam: cố vấn Đạo giáo; Yên Tử, Bút Tháp: cố vấn Phật giáo Việt; Văn Miếu: nghệ nhân nhã nhạc; Miêu Cương: nghệ sĩ người Miêu; Tạng: chờ).
4. Thu âm chính thức; giao stem 6 kênh + bản stereo + siêu dữ liệu (§6.3).
