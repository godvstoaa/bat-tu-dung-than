# 04-03 · Ngũ Hành Lực, Thân Lực, Thiên Mệnh

## 1. `STAT-NHL-*` — Ngũ Hành Lực

### 1.1 Đặc tả

| Mục | Giá trị |
|---|---|
| Nguồn | `R.wx.pct.{木,火,土,金,水}` — phần trăm từ `scoreWuXing` (can 1,0 mỗi trụ; tàng can × trọng số vị trí: năm 1,0 · **tháng 1,8** · ngày 1,1 · giờ 1,0; can 司令 nâng lên 0,75; tam hợp/tam hội +8% hoặc +4%), **sau** điều chỉnh không vong (tàng can trụ không vong −50%, `analyze()` tính lại `pct`) |
| Công thức lớp game (canon) | `Lực[w] = round(pct[w] × k[w])`, `k = 1,3` nếu `w = yong.primary` (Dụng), `k = 0,8` nếu `w = yong.ji` (Kỵ), còn lại `k = 1,0` |
| Làm tròn | `Math.round` sau khi nhân (pct đã 1 chữ số thập phân). `MAU-A` Thủy: 2,2 × 1,3 = 2,86 → **3** |
| Thang | 0–130 (lý thuyết: `pct` 100 × 1,3). Thực tế lớn nhất quan sát: 57 (`MAU-M` Hỏa 43,8 × 1,3) |
| Tổng 5 hành | **không** còn là 100 sau khi nhân; UI không hiện tổng |
| Hiển thị | 5 cung trên vòng thứ hai của Mệnh Bàn; độ dài cung = Lực; chữ «Linh Tuệ 3 · Khuyết» |
| Tooltip | «Từ tỉ lệ ngũ hành của lá số (Thủy 2,2%). Thủy là Dụng thần nên nhân 1,3.» |

Ghi chú về hệ số: canon chỉ quy định Dụng ×1,3 và Kỵ ×0,8. **Hỷ, Cừu, Nhàn, Dụng phụ không nhân.** Hệ số 0,8 của Kỵ không phải hình phạt về lối chơi: Kỵ là cửa thử thách ×1,3 Đạo Hạnh (§5); việc tầng Kỵ thấp hơn một chút giữ cho «sở trường» không trùng hẳn «thử thách».

### 1.2 Năm thuộc tính

| Hành | Thuộc tính | Hình ảnh trong game | Hạt linh khí (`progress.js › WX_GIATRI`) |
|---|---|---|---|
| 木 Mộc | **Sinh Cơ** | sức sống, mọc, hồi phục | lá non, `#58c46a` |
| 火 Hỏa | **Nhiệt Tâm** | lửa đan, lễ hội, sức hút | đốm lửa, `#ff6a3c` |
| 土 Thổ | **Định Lực** | vững, chịu, dựng | bụi vàng, `#d9a64a` |
| 金 Kim | **Tuệ Kiếm** | cắt, phá, xét | ánh kim, `#f2e6b8` |
| 水 Thủy | **Linh Tuệ** | chảy, học, đi xa | giọt nước, `#4f9cff` |

## 2. `STAT-NHL-TANG` — tầng hành

| Tầng | Lực | Tên | Tỉ lệ (mọi ô hành, 5.000 lá) | Tỉ lệ ô Dụng |
|---|---|---|---|---|
| 0 | 0–4 | **Khuyết** | 11,4% | 12,0% |
| 1 | 5–11 | Nhược | 15,4% | 12,7% |
| 2 | 12–19 | Bình | 26,1% | 23,0% |
| 3 | 20–29 | Vượng | 24,8% | 21,3% |
| 4 | 30–44 | Thịnh | 16,8% | 17,9% |
| 5 | ≥ 45 | Cực | 5,5% | 13,0% |

`tangOf(v) = v >= 45 ? 5 : v >= 30 ? 4 : v >= 20 ? 3 : v >= 12 ? 2 : v >= 5 ? 1 : 0`

Tầng hiệu dụng (dùng cho mọi tác động ở §2.1) = `tangOf(Lực + Bổ Hành)` (§3). Tầng **Tiên Thiên** hiển thị riêng, không đổi.

### 2.1 Bảng tác động theo tầng

Mọi giá trị là **cộng thêm vào mức nền** của hoạt động (mức nền do 09 định). Không tầng nào dưới mức nền. Ô có nhãn [R1] tính vào rổ Năng khiếu (trần +40%, 04-01 §9).

#### Sinh Cơ (Mộc)

| Mã | Tác động | T0 | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|---|---|
| M1 | Hồi Nguyên Khí mỗi giờ thật (nền 8) | +0 | +1 | +2 | +3 | +4 | +5 |
| M2 | Hái dược thảo: xác suất được thêm 1 cây | 0% | 8% | 16% | 24% | 32% | 40% |
| M3 | Vườn đào / ruộng thuốc của nhà riêng lớn nhanh | 0% | +6% | +12% | +18% | +24% | +30% |
| M4 | Tĩnh tọa ở vùng hoặc điểm rừng: công tu [R1] | 0% | +4% | +8% | +12% | +16% | +20% |
| M5 | Sắc thuốc cho NPC (`tcm`): thời gian | 0% | −5% | −10% | −15% | −20% | −25% |

#### Nhiệt Tâm (Hỏa)

| Mã | Tác động | T0 | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|---|---|
| H1 | Luyện đan: tỉ lệ thành đan (nền 60%) | +0 | +4 | +8 | +12 | +16 | +20 điểm % |
| H2 | Đèn / nhang: thời gian cháy | 0% | +10% | +20% | +30% | +40% | +50% |
| H3 | Lễ hội, sự kiện `EV-*`: Phúc Khí [R1] | 0% | +5% | +10% | +15% | +20% | +25% |
| H4 | Thiện cảm NPC mỗi lần trò chuyện (nền 5) | +0 | +1 | +2 | +3 | +4 | +5 |
| H5 | MMO: được ưu tiên trong danh sách «tìm đồng tu» | — | — | — | có | có | có + biểu tượng lửa |

#### Định Lực (Thổ)

| Mã | Tác động | T0 | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|---|---|
| T1 | Tĩnh tọa: biên độ dao động tâm (tạp niệm) | 0% | −6% | −12% | −18% | −24% | −30% |
| T2 | Chấm phong thủy (sảnh Dương Trạch, sửa nhà) [R1] | 0% | +4% | +8% | +12% | +16% | +20% |
| T3 | Xây đạo tràng / nhà riêng: vật liệu | 0% | −5% | −10% | −15% | −20% | −25% |
| T4 | Ải tâm ma: «nhịp thở dự phòng» | 0 | 0 | 1 | 1 | 2 | 2 |
| T5 | Nguyên Khí tiêu cho việc nặng | 0% | −2% | −4% | −6% | −8% | −10% |

#### Tuệ Kiếm (Kim)

| Mã | Tác động | T0 | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|---|---|
| K1 | Giải án khách (`cases.js`, 6 bước): điểm [R1] | 0% | +4% | +8% | +12% | +16% | +20% |
| K2 | Công án Yên Tử: «hỏi lại» thêm | 0 | 0 | 0 | 1 | 1 | 2 |
| K3 | Khoa cử: thời gian mỗi câu | +0 s | +5 s | +10 s | +15 s | +20 s | +25 s |
| K4 | Ải trí (câu đố, phá chướng): lần thử thêm | 0 | 0 | 1 | 1 | 2 | 2 |
| K5 | Kết phù: dung sai ghép 5 phần | 0 | +3% | +6% | +9% | +12% | +15% |

#### Linh Tuệ (Thủy)

| Mã | Tác động | T0 | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|---|---|
| S1 | Đọc cổ thư (Tàng kinh các, `library-data`): tốc độ | 0% | +8% | +16% | +24% | +32% | +40% |
| S2 | Tượng pháp (sảnh Manh phái): gợi ý thêm | 0 | 0 | 1 | 1 | 2 | 2 |
| S3 | Du phương: phí trạm đi nhanh | 0% | −5% | −10% | −15% | −20% | −25% |
| S4 | Lần đầu làm một loại hoạt động: công tu [R1] | 0% | +6% | +12% | +18% | +24% | +30% |
| S5 | Khoa cử, câu hỏi Đạo Tạng: «nhớ lại» (gợi ý chữ đầu) | 0 | 0 | 0 | 1 | 1 | 2 |

### 2.2 Tầng 0 «Khuyết» không phải thiếu sót

Khuyết = mức nền, không trừ gì. Khi một hành ở tầng 0:

1. Ô hành hiện **viền chấm** (không màu xám, không dấu «−»).
2. Chữ: «Linh Tuệ: còn để ngỏ — chỗ để bạn tự bồi».
3. Mở **chuỗi Bổ Hành** của hành đó ngay (§3).
4. Nếu hành Khuyết là **Dụng thần** (12% lá số, như `MAU-A` Thủy 3, `MAU-D` Kim 0, `MAU-K` …) → chuỗi trở thành **mạch chính Hồi I «Bản Mệnh»** của người đó; Thầy Tử Bình mở đầu bằng câu: «Con thiếu đúng thứ con cần. Vậy đường của con đã rõ.»

## 3. `STAT-BOHANH` — Bổ Hành (Hậu Thiên)

### 3.1 Đặc tả

| Mục | Giá trị |
|---|---|
| Lớp | Hậu Thiên, lưu ở `state.player.hauThien.boHanh[w]` |
| Thang | 0–20 mỗi hành, số nguyên |
| Tác dụng | `tầng hiệu dụng = tangOf(Lực + Bổ)` |
| Hiển thị | đoạn cung **sáng nét đứt** nối tiếp cung Tiên Thiên, nhãn «+5 Bổ» |
| Không tác dụng | không đổi `wx.pct`, không đổi Dụng thần, không đổi Tiềm Lực |

### 3.2 Nguồn điểm Bổ Hành

| Nguồn | Điểm | Giới hạn |
|---|---|---|
| Hoàn thành một «việc bổ hành» (09 gắn thẻ `wx` cho hoạt động; vd Thủy: đọc ở Thư Lâu Lâm, tĩnh tọa bên Cùng Thông Hồ, du phương phía Bắc) | +1 | 3 điểm/hành/tuần |
| Chuỗi **Bổ Dụng** (Hồi I, mạch chính) | +5 vào hành Dụng | một lần |
| Chuỗi **Bổ Hỷ** (nhánh phụ) | +3 vào hành Hỷ | một lần |
| Chuỗi «Khổ tận cam lai» chặng 2 (04-02 §4.4) | +1 vào Dụng | một lần |
| Vận Mệnh Các: ở trong đại vận mang hành Dụng (`dayun.zhiWx` = Dụng) và hoàn thành «lễ đón vận» | +2 vào Dụng | mỗi đại vận |
| Mặc đủ bộ ngũ hành Hợp mệnh (Tàng Y Các) | **0** — trang phục không được cộng Bổ Hành (canon §7: không bán) | — |

Trần 20 nghĩa là: hành Khuyết nặng nhất (Lực 0) bổ đủ lên 20 → tầng 3 «Vượng». Tu không làm một hành Khuyết thành «Cực» — Tiên Thiên vẫn có tiếng nói, Hậu Thiên đủ sức đổi cuộc chơi.

### 3.3 Ví dụ `MAU-A`

| Hành | Lực Tiên Thiên | Tầng TT | Sau Bổ Dụng (+5) | Sau 5 tuần đọc sách (+15, trần 20) |
|---|---|---|---|---|
| Thủy (Dụng) | 3 | 0 Khuyết | 8 → 1 Nhược | 3 + 20 = 23 → **3 Vượng** |

## 4. `STAT-THANLUC` — Thân Lực

### 4.1 Đặc tả

| Mục | Giá trị |
|---|---|
| Nguồn | `R.strength.effRatio`, `R.strength.level`, `R.strength.strong` |
| Công thức engine | `ratio = (score[nhật chủ] + score[Ấn]) / total`; `effRatio = ratio + sanFaBonus`; `sanFaBonus` = đắc lệnh (+0,05 进气 / +0,04 旺气 / +0,03 退气, theo can 司令) + đắc địa (+0,03 khi thông căn ≥ 1,0) |
| Lớp game | `TL = clamp(round(effRatio × 100), 0, 100)` |
| Mức | lấy **nguyên** `strength.level` của engine, không tính lại từ số đã làm tròn |
| Hiển thị | «Thân Lực 77 · Thân quá vượng» |
| Tooltip | «Lực của chính bạn và nguồn sinh bạn (Ấn) trong lá số: 69% + đắc lệnh 4% + đắc địa 3% + … = 77%.» |

### 4.2 Năm mức

| Mức (`level` engine) | `effRatio` | `strong` | Tỉ lệ | Tên lối chơi | Tự lực (đi một mình) | Nhận trợ (sư phụ, đồng hành, quý nhân) | Đặc điểm thêm |
|---|---|---|---|---|---|---|---|
| Thân quá vượng | ≥ 0,62 | true | 23,6% | **Độc Hành** | +20% tiến độ việc tự làm | ×1,0 | **Tiết Tú**: khi hướng dẫn người khác (sư đồ, trợ thủ), cả hai +20% công tu |
| Thân vượng | 0,51–0,62 | true | 23,6% | **Tự Lập** | +10% | ×1,0 | — |
| Thân trung hòa | (0,49; 0,51) | theo 0,50 | 4,4% | **Trung Dung** | +5% | ×1,25 | **Trung Hòa**: thiền định +5% công tu [R1] |
| Thân nhược | 0,38–0,49 | false | 23,0% | **Cầu Trợ** | +0% | **×1,5** (canon) | quý nhân xuất hiện thêm 1 lần/tuần |
| Thân quá nhược | < 0,38 | false | 25,4% | **Thuận Thế** | +0% | **×1,5** | hiệu lực buff nhận được kéo dài ×1,5; nếu là Dị Cách tòng → «thế» của vùng hợp Dụng cũng tính như một người trợ |

«Tiến độ việc tự làm» = tốc độ hoàn thành các hoạt động chỉ có một người (tĩnh tọa, đọc, kết phù). «Nhận trợ» = hệ số nhân lên **lượng buff người khác trao** (vd sư phụ trao +10% công tu → thân nhược nhận +15%).

Cặp thiết kế: vượng không có ×trợ nhưng có tự lực; nhược không có tự lực nhưng có ×1,5 trợ. Trong MMO, một người thân nhược đi cùng một người thân quá vượng nhận cộng hưởng tốt nhất (Tiết Tú + ×1,5) — thân yếu không phải gánh nặng của đội, mà là **lý do** để có đội.

### 4.3 Ca biên làm tròn (có thật)

| Mẫu | `effRatio` | Thân Lực hiển thị | `level` engine |
|---|---|---|---|
| `MAU-B` 1995-06-15 08:30 nam | 0,616 | **62** | Thân **vượng** |
| `MAU-C` 1986-09-01 13:15 nữ | 0,622 | **62** | Thân **quá vượng** |
| `MAU-H` 2003-08-10 06:45 nữ | 0,501 | 50 | Thân trung hòa (`strong: true`) |

Cùng con số 62, khác mức. Quy tắc: mức luôn theo engine; tooltip hiện `effRatio` 3 chữ số («61,6%» / «62,2%») để người chơi tự thấy lý do.

### 4.4 Tương tác

- **Dụng thần đi theo Thân Lực** (Phù Ức): vượng → Dụng thường là Quan/Tài/Thực; nhược → Ấn/Tỷ. Game không cần xử lý — đọc `yong.primary`.
- **Dị Cách tòng** (`從財/從殺/從兒`) luôn là thân rất nhược theo thế (vd `MAU-M` `effRatio` 0,231): mức «Thuận Thế» khớp tinh thần «thuận theo thế» của lộ Dị Cách (04-05).
- **Chuyên Vượng / Tòng Vượng** (`MAU-J` 0,71, `MAU-K` 0,805) là thân cực vượng: «Độc Hành» + Tiết Tú.
- **Quý Khí** cộng số lần gặp quý nhân; Thân nhược nhân hiệu lực quà quý nhân ×1,5 → hai chỉ số cộng hưởng (04-06 §4).

## 5. Thiên Mệnh — Dụng, Hỷ, Kỵ, Cừu, Nhàn

### 5.1 Đặc tả nguồn

| Mã | Tên game | Trường | Định nghĩa trong engine |
|---|---|---|---|
| `STAT-THIENMENH` | **Thiên Mệnh Hành** (Dụng) | `yong.primary` | hành cần nhất, sau Phù Ức / Thông Quan / Bệnh Dược / Điều Hậu / Cách cục; với `有救` có thể là **thuốc cứu** (`★ Bệnh Dược LÀM CHỦ`) |
| — | Dụng phụ | `yong.secondary` | có thể rỗng `''` (engine xóa khi trùng Kỵ/Cừu) |
| `STAT-HYHANH` | **Hỷ Hành** | `yong.xi` | hành sinh Dụng |
| `STAT-KYHANH` | **Kỵ Hành** | `yong.ji` | hành khắc Dụng |
| `STAT-CUUHANH` | **Cừu Hành** | `yong.chou` | hành sinh Kỵ |
| `STAT-NHANHANH` | **Nhàn Hành** | `yong.xian` | hành do Dụng sinh ra |

Bộ năm (Dụng, Hỷ, Kỵ, Cừu, Nhàn) luôn phủ đủ 5 hành, không trùng (ví dụ `MAU-A`: Thủy, Kim, Thổ, Hỏa, Mộc).

### 5.2 Tác động

| Hành | Ngoại hình | Phúc Khí | Đạo Hạnh | Nội dung |
|---|---|---|---|---|
| **Dụng** | màu phẩm phục (đã có: `robe = yong.primary`); gia trì hào quang (`progress.js › WX_GIATRI`) | **Hợp mệnh +10%** khi mặc đủ bộ ngũ hành đúng Dụng (`cosmetics.js › setBonus`, đã có) | thiên thời R2 (§6): vùng +5%, giờ +3%, mùa +2% | chuỗi Bổ Dụng (mạch Hồi I); Thầy giảng «vì sao con cần hành này» bằng `yong.reasons[]` |
| **Dụng phụ** | **màu đai** (đã có: `accent = yong.secondary \|\| yong.xi`) | — | — | — |
| **Hỷ** | — | ×1,05 cho hoạt động gắn hành Hỷ | thiên thời R2 bằng nửa Dụng: vùng +2%, giờ +1%, mùa +1% | chuỗi Bổ Hỷ (+3 Bổ Hành) |
| **Kỵ** | — | — | hoạt động Kỵ: **×1,3** (canon) và độ khó +1 bậc (R3) | «cửa thử thách» trên bản đồ: vùng Kỵ có biểu tượng cửa son |
| **Cừu** | — | — | hoạt động Cừu: ×1,15, độ khó giữ nguyên (R3) | — |
| **Nhàn** | — | — | — | quán trà mang hành Nhàn có thoại «nghỉ chân» (hương vị) |

Quy tắc gắn thẻ hoạt động (để biết «hoạt động Kỵ»):

```
thẻ = { A: hành của loại việc (09 gắn), V: hành của vùng (§6.1), G: hành giờ (§6.2), S: hành mùa (§6.3) }
R3 = (A == Kỵ || V == Kỵ) ? 1,3 : (A == Cừu || V == Cừu) ? 1,15 : 1,0
R2_thienthoi = (V==Dụng?5:V==Hỷ?2:0) + (G==Dụng?3:G==Hỷ?1:0) + (S==Dụng?2:S==Hỷ?1:0)   // %, cộng với Thời Vận, trần 15
```

Một hoạt động có thể **vừa** hưởng thiên thời Dụng **vừa** là thử thách Kỵ (vd `MAU-A` Dụng Thủy, Kỵ Thổ: đọc sách Thủy (A = Thủy) ở Tử Bình Phong (V = Kim, Hỷ) lúc giờ Hợi (G = Thủy) mùa đông (S = Thủy): R2 = 2 + 3 + 2 = 7%, R3 = 1,0). Không có tổ hợp nào làm phần thưởng **thấp hơn** nền.

### 5.3 Lời trong nghi lễ phẩm phục (sửa lời hiện có)

`main.js › ceremony` hiện in «Kỵ thần: … → nên tránh». Theo T2, đề nghị sửa thành:

> «Kỵ thần: **Thổ** → cửa thử thách (vượt được thì tu vi ×1,3)»

và thêm dòng Cừu, Nhàn vào Sổ Mệnh (không cần ở nghi lễ). Việc sửa chữ thuộc 12 (`UI-xx`), tài liệu này chỉ định nội dung.

## 6. `STAT-THIENTHOI` — hành của vùng, giờ, mùa

### 6.1 Hành của vùng

Quy tắc: Hậu Thiên Bát Quái theo **phương vị từ tâm Huyền Thành**. Tọa độ game: `terrain.js` ghi «Bắc = −Z», Đông = +X. Góc `θ = atan2(x, −z)` (0° = Bắc, tăng theo chiều kim đồng hồ), chia 8 cung 45°: Khảm (Bắc, Thủy) · Cấn (Đông Bắc, Thổ) · Chấn (Đông, Mộc) · Tốn (Đông Nam, Mộc) · Ly (Nam, Hỏa) · Khôn (Tây Nam, Thổ) · Đoài (Tây, Kim) · Càn (Tây Bắc, Kim). Trong bán kính 200 m của tâm = Trung cung, Thổ.

| Vùng (canon §3) | Tâm (x, z) | θ | Cung | Hành vùng |
|---|---|---|---|---|
| `thanh` Huyền Thành + Sơn Môn | 0, 0 | — | Trung | **Thổ** |
| `vancoc` Am Vân Cốc | 0, −260 | 0° | Khảm | **Thủy** |
| `thulau` Thư Lâu Lâm | 0, −700 | 0° | Khảm | **Thủy** |
| `vodang` Võ Đang Huyền Nhạc | 0, −1500 | 0° | Khảm | **Thủy** |
| `conlon` Côn Lôn Thiên Trì | 0, −900 | 0° | Khảm | **Thủy** · ngoại lệ: Côn Lôn là «quy nhất», coi như hợp mọi Dụng |
| `manh` Manh Phái Cốc | 640, −520 | 51° | Cấn | **Thổ** |
| `chungnam` Chung Nam Toàn Chân | 1400, −1300 | 47° | Cấn | **Thổ** |
| `longho` Long Hổ Sơn | 1500, −200 | 82° | Chấn | **Mộc** |
| `lichduong` Lịch Đường | 820, 0 | 90° | Chấn | **Mộc** |
| `cungthong` Cùng Thông Hồ | 620, 620 | 135° | Tốn | **Mộc** |
| `maoshan` Mao Sơn Thượng Thanh | 1500, 1300 | 131° | Tốn | **Mộc** |
| `buttap` Bút Tháp Tịnh Độ | 500, 1500 | 162° | Ly | **Hỏa** |
| `vanmieu` Văn Miếu Quốc Tử Giám | 0, 1900 | 180° | Ly | **Hỏa** |
| `yentu` Yên Tử Trúc Lâm | −400, 1500 | 195° | Ly | **Hỏa** |
| `trichthien` Trích Thiên Đỉnh | −600, 600 | 225° | Khôn | **Thổ** |
| `mieucuong` Miêu Cương Cổ Trại | −1400, 1300 | 227° | Khôn | **Thổ** |
| `phongthuy` Phong Thủy Viên | −820, 0 | 270° | Đoài | **Kim** |
| `phongdo` Phong Đô Quỷ Thành | −1500, 0 | 270° | Đoài | **Kim** |
| `tubinh` Tử Bình Phong | −620, −560 | 312° | Càn | **Kim** |
| `tangdia` Tạng Địa Tuyết Vực | −1500, −1300 | 311° | Càn | **Kim** |

Cân đối: Thủy 4 (gồm Côn Lôn), Mộc 4, Hỏa 3, Thổ 5, Kim 4. Mỗi Dụng thần đều có ít nhất 3 vùng hợp. Bảng này là **đề xuất của 04**; tài liệu 07 có quyền thay hành riêng một vùng nếu kiến trúc đòi (vd Phong Đô theo âm khí), khi đó cập nhật bảng này.

### 6.2 Hành của giờ

Giờ trong game theo **chi giờ** (2 giờ một chi) của đồng hồ thế giới (12 quyết nhịp ngày đêm):

| Chi giờ | Giờ | Hành |
|---|---|---|
| Dần, Mão | 03:00–07:00 | Mộc |
| Tỵ, Ngọ | 09:00–13:00 | Hỏa |
| Thân, Dậu | 15:00–19:00 | Kim |
| Hợi, Tý | 21:00–01:00 | Thủy |
| Thìn, Mùi, Tuất, Sửu | 07–09, 13–15, 19–21, 01–03 | Thổ |

### 6.3 Hành của mùa

Theo **tiết khí thật** của ngày chơi (nguyệt chi của hôm nay, tính bằng `lunar-javascript` như `chart.js`): tháng Dần, Mão → Mộc; Tỵ, Ngọ → Hỏa; Thân, Dậu → Kim; Hợi, Tý → Thủy; Thìn, Mùi, Tuất, Sửu → Thổ. Đổi ở giờ giao tiết (vd Lập Xuân), không đổi ở mùng 1 âm lịch.

### 6.4 Tác động của thiên thời

R2 (trần 15% cùng Thời Vận) áp cho cả Phúc Khí và công tu. Hiển thị ở HUD góc trên: ba chấm nhỏ (vùng, giờ, mùa), chấm sáng màu hành khi trùng Dụng, mờ khi trùng Hỷ. Không có chấm «đỏ» cho Kỵ — thay bằng biểu tượng cửa son khi đang ở hoạt động thử thách.

## 7. Kiểm chứng trên lá số mẫu

| Mẫu | Dụng | Hỷ | Kỵ | Cừu | Nhàn | Dụng phụ | Lực Dụng (tầng) | Thân Lực / mức |
|---|---|---|---|---|---|---|---|---|
| `MAU-A` | Thủy | Kim | Thổ | Hỏa | Mộc | Mộc | 3 (Khuyết) | 77 quá vượng |
| `MAU-B` | Thủy | Kim | Thổ | Hỏa | Mộc | Kim | 31 (Thịnh) | 62 vượng |
| `MAU-C` | Mộc | Thủy | Kim | Thổ | Hỏa | Thủy | 6 (Nhược) | 62 quá vượng |
| `MAU-D` | Kim | Thổ | Hỏa | Mộc | Thủy | Thổ | 0 (Khuyết) | 66 quá vượng |
| `MAU-E` | Hỏa | Mộc | Thủy | Kim | Thổ | — | 8 (Nhược) | 60 vượng |
| `MAU-G` | Hỏa | Mộc | Thủy | Kim | Thổ | Thổ | 23 (Vượng) | 42 nhược |
| `MAU-H` | Kim | Thổ | Hỏa | Mộc | Thủy | — | 27 (Vượng) | 50 trung hòa |
| `MAU-J` | Mộc | Thủy | Kim | Thổ | Hỏa | — | 37 (Thịnh) | 71 quá vượng |
| `MAU-M` | Hỏa | Mộc | Thủy | Kim | Thổ | Thổ | 57 (Cực) | 23 quá nhược |

## 8. Ca biên

| Ca | Xử lý |
|---|---|
| Dụng = Kỵ | Không thể (engine dựng Kỵ = hành khắc Dụng). Kiểm thử khẳng định. |
| Dụng phụ trùng Hỷ | Hợp lệ (vd `MAU-B` Dụng phụ Kim = Hỷ Kim). Màu đai = màu Hỷ. |
| Dụng phụ rỗng | Màu đai lấy Hỷ (đã có trong `main.js`). |
| Cách đặc biệt (tòng) | Dụng «thuận thế», có thể là hành vốn mạnh nhất (`MAU-M` Hỏa 43,8% là Dụng) → tầng Dụng cao, Bổ Dụng gần như vô dụng → chuỗi Bổ Dụng của Dị Cách đổi thành **«Giữ thế»** (03 viết, 04-05 §2.4). |
| `wx.pct` một hành = 0 | Lực 0, tầng Khuyết; nếu là Dụng thì xem §2.2. |
| Không vong làm đổi `pct` | Engine đã tính sẵn; «Vì sao?» thêm dòng «trụ … rơi không vong, tàng can giảm 50%». |
| Thiên thời ở vùng không có tâm (đường đi giữa vùng) | Tính θ theo vị trí người chơi hiện tại, không theo vùng gần nhất. |

## 9. Checklist nghiệm thu phần 04-03

- [ ] Lực = `round(pct × k)`, k chỉ ×1,3 Dụng / ×0,8 Kỵ; khớp bảng mẫu.
- [ ] Tầng hiệu dụng dùng `Lực + Bổ`; tầng Tiên Thiên hiển thị riêng.
- [ ] Bổ Hành trần 20; trang phục không cộng Bổ Hành.
- [ ] Mức Thân Lực lấy từ engine; ca `MAU-B` / `MAU-C` hiển thị đúng.
- [ ] Nhận trợ ×1,5 cho nhược và quá nhược (canon).
- [ ] R3 Kỵ ×1,3 và Cừu ×1,15 chỉ áp hoạt động gắn thẻ; R2 trần 15%.
- [ ] Không có biểu tượng/màu «xấu» cho Kỵ; lời nghi lễ dùng «cửa thử thách».
