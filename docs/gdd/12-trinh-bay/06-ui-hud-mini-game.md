# 12 · Trình bày — Phần 06: HUD mini-game và chế độ đặc biệt (UI-80 → UI-99)

> Mỗi hoạt động tu (canon §9.3) có một HUD riêng. **Luật chơi, điểm, thưởng** do tài liệu 09 định (mã `MG-xx`, `ACT-xx`); phần này chỉ định **màn hình**: bố cục, điều khiển, phản hồi, âm, rung, trợ năng. Cột «MG» ghi «tài liệu 09» vì số hiệu do tài liệu đó cấp — khi 09 xong, điền số vào bảng §0.
>
> Nguyên tắc chung cho mọi mini-game văn tu: **không có thua** theo nghĩa phạt. Kết thúc kém thì «chưa thấu», được làm lại ngay, không mất tài nguyên (P3, T3).

## 0. Bảng ánh xạ hoạt động → HUD

| HUD | Hoạt động (canon §9.3 / đã có) | Engine | Nơi | MG |
|---|---|---|---|---|
| UI-81 | Tĩnh tọa | `cultivation-data` (giảng) | Võ Đang, Trà Thất | tài liệu 09 |
| UI-82 | Kết phù | `talisman-data › fu` | Long Hổ | tài liệu 09 |
| UI-83 | Khoa cử | `library-data`, `DITIANSUI_MAXIMS`, `cases.js` | Văn Miếu | tài liệu 09 |
| UI-84 | Đặt tên / đạo hiệu | `naming › analyzeName` | Văn Miếu | tài liệu 09 |
| UI-85 | Sửa nhà | `zhai`, `xuankong`, `fs-cure › SHA_LIST` | nhà riêng Huyền Thành | tài liệu 09 |
| UI-86 | Chọn ngày lễ | `zheri`, `huangdao` | Lịch Đường, đạo tràng | tài liệu 09 |
| UI-87 | Thiền công án | AI persona Thiền sư | Yên Tử | tài liệu 09 |
| UI-88 | Mạn-đà-la cát | (mới) | Tạng Địa | tài liệu 09 |
| UI-89 | Vạch mặt Định Mệnh Hội | `chart`, `taisui`, `anti-manipulation-data` | chợ các vùng | tài liệu 09 |
| UI-90 | Cứu người trúng yểm | `tcm`, `fs-cure`, `amta-data` (opt-in) | Mao Sơn | tài liệu 09 |
| UI-91 | Y dược | `tcm` | Miêu Cương, Võ Đang | tài liệu 09 |
| UI-92 | Tụng / lạy theo nhịp (sám hối) | `CHAN_HUI` | Bút Tháp, Phong Đô | tài liệu 09 |
| UI-93 | Bái Đẩu | `talisman-data › ritual` | Đẩu Mẫu Điện, Long Hổ | tài liệu 09 |
| UI-94 | Phóng sinh, thả đèn hoa đăng | `CONG_QUA` (放生) | Hồ Sen, Bút Tháp | tài liệu 09 (thả đèn đã có) |
| UI-95 | Xăm, nhang, trà, la bàn, lịch | `qiuqian`, `state.js` | Sơn Môn | đã có |
| UI-96 | Hành hương, bánh xe kinh | (mới) | Yên Tử, Tạng Địa | tài liệu 09 |
| UI-97 | Ngự kiếm | `progress.js › fly` | mọi nơi | — |
| UI-98 | Chụp ảnh | — | mọi nơi | — |
| UI-99 | Cutscene | `CUT-xxx` (tài liệu 03) | — | — |

---

## UI-80 · Khung HUD mini-game chung (mã ngắn: `mg`)

**Bố cục chuẩn (dọc)**

```
┌──────────────────────────────────────┐
│ [✕ Dừng]   Kết phù · Long Hổ   [?]   │  thanh trên 44 px: dừng · tên · luật
│ ▓▓▓▓▓▓░░░░  bước 3/5                 │  tiến độ (nếu có bước)
│                                      │
│                                      │
│          (vùng chơi chính)           │  cảnh 3D hoặc canvas 2D riêng
│                                      │
│                                      │
│ ┃ Trương Thiên Sư: «Đầu phù là chữ   │  dòng hướng dẫn của NPC (1–2 dòng)
│ ┃ "sắc", phải đứng trên cùng.»       │
│ ┌──────────────────────────────────┐ │
│ │  (khay điều khiển riêng)         │ │  vùng ngón cái, ≥ 120 px cao
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

**Luật chung:**

| # | Luật |
|---|---|
| 1 | HUD thường (UI-08, UI-09, UI-16) **ẩn** khi vào mini-game; toast vẫn hiện (dời lên trên nếu khay điều khiển ở đáy). |
| 2 | Nút ✕ Dừng luôn ở góc trái trên; dừng giữa chừng hỏi «Dừng lại? Tiến độ bước này sẽ không lưu.» chỉ khi đã làm > 30 giây. |
| 3 | Nút [?] mở luật chơi 3–5 dòng + một hình minh họa; lần đầu chơi tự mở. |
| 4 | Không đồng hồ đếm ngược màu đỏ. Mini-game có giới hạn thời gian dùng **nén hương cháy** (thanh dọc nâu, tàn rơi) — hình ảnh văn hóa, không gây áp lực màu. |
| 5 | Kết quả: thẻ cuối có ba mức chữ — «Thấu» / «Gần thấu» / «Chưa thấu» — kèm một câu của NPC và nút «Làm lại» / «Xong». Không chữ «Thất bại». |
| 6 | Trợ năng: mọi mini-game nhịp có «Hỗ trợ nhịp» (UI-76); mọi mini-game kéo thả có cách chọn – chạm thay thế (chạm mảnh rồi chạm ô); mọi mini-game nhìn có bản mô tả bằng chữ. |
| 7 | Âm: vào mini-game nhạc vùng hạ −8 dB và chuyển sang lớp «tĩnh» của BGM vùng (mức M1, phần 09 §4.1); một số mini-game có nhạc riêng (`BGM-MG-*`). |
| 8 | Camera: mỗi mini-game khai báo một preset camera (phần 08 §5). |

**Đo lường chung:** `ui_mg_start {mg}`, `ui_mg_step {mg, i, n}`, `ui_mg_end {mg, result: thau|gan|chua, ms, assist: bool}`, `ui_mg_quit {mg, i}`, `ui_mg_rules_open {mg}`.

---

## UI-81 · Tĩnh tọa — nhịp thở (mã ngắn: `tinhtoa`)

| | |
|---|---|
| Cơ chế (canon §9.3) | nhịp thở giữ – thả theo vòng; «tạp niệm» bay qua phải để yên |
| Nền có sẵn | Trà Thất: vòng thở `.hq-breath` 150 px, chu kỳ 14 s (`hq-breath`: phồng 0 → 28,6% = 4 s hít, giữ tới 57,1% = 4 s, xẹp tới 100% = 6 s thở); bảng `peek` để thấy cảnh; ghế bồ đoàn MMO (`requestSeat`) |

**Khung dọc**

```
┌──────────────────────────────────────┐
│ [✕]   Tĩnh tọa · Võ Đang      [?]    │
│ nén hương ▮▮▮▮▮▯▯▯ 7 phút còn lại    │
│                                      │
│    (cảnh: nhân vật ngồi bồ đoàn,     │
│     camera hạ thấp phía trước)       │
│                                      │
│    ~ «mai phải nộp báo cáo» ~  →     │  tạp niệm trôi ngang (chữ mờ)
│                                      │
│            ╭───────╮                 │
│           │  Hít   │                 │  vòng thở (phồng – giữ – xẹp)
│            ╰───────╯                 │
│   Định Lực ▓▓▓▓▓▓▓░  ổn định         │
│ ┌──────────────────────────────────┐ │
│ │   (giữ ngón cái khi hít,         │ │  vùng chạm cả khay
│ │    buông khi thở ra)             │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

**Điều khiển:** giữ (chạm giữ khay / phím Space) trong pha hít + giữ, buông trong pha thở. **Tạp niệm**: câu ngắn trôi ngang qua (tài liệu 09 viết danh sách, có câu theo Tính Khí người chơi) — **không chạm vào** là đúng; chạm vào thì nó dừng lại, thanh Định Lực rung nhẹ (bài học «để yên»).

**Phản hồi:**

| Sự kiện | Hình | Âm | Rung |
|---|---|---|---|
| bắt đầu hít | vòng phồng, viền vàng | lớp đệm nhạc «thở vào» (tiếng tiêu kéo dài, phần 09) | — |
| giữ đúng pha | vòng sáng đều | — | — |
| lệch pha > 0,8 s | vòng nhạt đi | — | light |
| chạm tạp niệm | câu dừng, mờ dần | `SFX-MG-001` (gió nhẹ thổi qua) | light |
| hết nén hương | vòng tan thành khói | `SFX-BELL-002` khánh nhỏ | medium |

**Trợ năng:** «Giữ thay vì nhấn liên tục» không cần ở đây (đã là giữ); với người khó giữ lâu: chế độ **chạm chuyển pha** (chạm một lần khi hít, một lần khi thở). Mô tả bằng chữ dưới vòng («Hít… 3, 2, 1 · Giữ… · Thở ra…»). Giảm chuyển động: vòng không phồng, đổi chữ và độ sáng.

**Cảnh báo sức khỏe (bắt buộc, theo `cultivation-data` và canon §14):** lần đầu: «Đây là bài thở thư giãn trong trò chơi, không phải phương pháp chữa bệnh. Thấy chóng mặt thì thở bình thường và dừng lại.» Không có bài nín thở dài > 6 s.

---

## UI-82 · Kết phù — ghép năm phần (mã ngắn: `ketphu`)

| | |
|---|---|
| Cơ chế | ghép 5 phần phù theo cấu trúc `talisman-data › fu {head, body, belly, core, foot}` (đầu, thân, bụng, đảm, chân), đúng thứ tự, đúng hành của việc cần trấn |
| Ràng buộc nội dung | **ký tự hư cấu của game**, không vẽ lại phù thật (canon §2 T6, §7.1) |

**Khung dọc**

```
┌──────────────────────────────────────┐
│ [✕]  Kết phù · trấn trạch      [?]   │
│ Việc: «Nhà phương Tây Nam không yên» │
│ (đã xem phong thủy trước ✓)          │  luật: phong thủy trước, phù sau
│        ┌─────────────┐               │
│        │   (đầu) ◌   │               │  dải giấy vàng dọc, 5 ô
│        │   (thân) ⟡  │               │  ô đã đặt: ký tự hư cấu đỏ son
│        │   (bụng) ◌  │               │
│        │   (đảm) ◌   │               │
│        │   (chân) ◌  │               │
│        └─────────────┘               │
│ ┌──────────────────────────────────┐ │
│ │ ⟡ ⟢ ⟣ ⟤ ⟥ ⟦ ⟧ ⟨   (khay ký tự) │ │  ký tự hư cấu, mỗi cái gắn hành
│ │ 木 火 土 金 水  (lọc theo hành)  │ │
│ └──────────────────────────────────┘ │
│ [ Đóng ấn ]                          │
└──────────────────────────────────────┘
```

**Điều khiển:** kéo ký tự vào ô; hoặc chạm ký tự rồi chạm ô (trợ năng). Chạm ô đã đặt để gỡ. «Đóng ấn» kiểm cả năm ô.

**Phản hồi:** đặt ký tự → nét son loang `SFX-MG-010` (bút lông chấm mực son); đóng ấn → `SFX-MG-011` (ấn gỗ đóng xuống giấy) + rung heavy; đúng hết → giấy phát sáng nhẹ màu hành, Trương Thiên Sư gật đầu; sai → ô sai viền đứt + câu giải thích cấu trúc («Đảm là chỗ thần cư — đặt chữ hộ thần ở đây»).

**Câu chú bắt buộc trên khay:** «Ký tự trong game là chữ bịa để học cấu trúc phù, không phải phù thật.»

**Mù màu:** lọc theo hành dùng chữ Hán 木火土金水, không chỉ màu.

---

## UI-83 · Khoa cử — hương thí, hội thí, đình thí (mã ngắn: `khoacu`)

| | |
|---|---|
| Cơ chế | ba vòng thi; câu hỏi từ cổ thư và lá số khách (`library-data`, `DITIANSUI_MAXIMS`, `cases.js`) |

**Khung dọc (một câu)**

```
┌──────────────────────────────────────┐
│ [✕]  Hội thí · Văn Miếu       [?]    │
│ Câu 4/10      nén hương ▮▮▮▮▯▯        │
│ ┌──────────────────────────────────┐ │
│ │ 《滴天髓》 Trích Thiên Tủy:        │ │  văn bản đề trên giấy
│ │ «…» (trích ngắn đã được phép)    │ │
│ │ Câu hỏi: Câu này nói về điều gì? │ │
│ └──────────────────────────────────┘ │
│ ( A ) Thân vượng nên tiết            │  .hq-choice.wide
│ ( B ) Thân nhược nên phù             │
│ ( C ) Điều hậu theo mùa              │
│ ( D ) Cách cục thành bại             │
│ Văn Xương Chiếu: +20% điểm           │  đặc tính wenChang nếu có
│ [ Nộp bài ]                          │
└──────────────────────────────────────┘
```

**Đình thí** (vòng cuối): một án lá số khách đầy đủ, dùng lại khung UI-51 (6 bước), chấm cao hơn.

**Phản hồi:** nộp → `SFX-MG-030` (bút gác lên giá); kết quả vòng → bảng vàng dán tường trong cảnh (P4) với tên người chơi, `SFX-MG-031` (trống báo, một tiếng). Không xếp hạng công khai tên người trượt.

**Trợ năng:** trích văn Hán luôn có bản Hán Việt + nghĩa (chạm để mở). Phím A–D.

---

## UI-84 · Đặt tên và đạo hiệu (mã ngắn: `datten`)

| | |
|---|---|
| Cơ chế | chọn chữ cho tổng nét và ngũ cách hợp Dụng thần (`naming.js › analyzeName`) |

```
┌──────────────────────────────────────┐
│ [✕]  Đặt đạo hiệu · Văn Miếu   [?]   │
│ Dụng thần của bạn: 水 Thủy           │
│ ┌────┐┌────┐                         │
│ │ 清 ││ ?  │   Thanh …               │  2–3 ô chữ
│ │Thanh││    │                        │
│ └────┘└────┘                         │
│ Gợi ý chữ hành Thủy: 澄 泉 涵 淵 …    │
│ ─ Ngũ cách ─────────────────────────│
│ Thiên 12 · Nhân 23 · Địa 18 ·        │
│ Ngoại 7 · Tổng 29                    │
│ Hành của tên: Thủy ✓ hợp Dụng        │
│ [ Xin Tế tửu duyệt ]                 │
└──────────────────────────────────────┘
```

**Luật:** đạo hiệu chỉ để dùng trong game (khung tên); có câu «Tên khai sinh thật không cần đổi. Đây là bài học về cách đặt tên.» (khớp tinh thần `gaimenh` tầng Tên: «tên khai sinh khó đổi thì dùng tên gọi / bút danh»). Lọc chữ qua `cleanName` khi dùng trong phòng chung.

---

## UI-85 · Sửa nhà — Bát Trạch, Huyền Không, hóa sát (mã ngắn: `suanha`)

| | |
|---|---|
| Cơ chế | đặt giường, bàn, cửa theo bát trạch / huyền không; hóa sát (`zhai`, `xuankong`, `fs-cure › SHA_LIST`) |
| Nền | lưới 9 cung `.hq-grid9` đã có ở Sảnh Dương Trạch |

**Khung dọc**

```
┌──────────────────────────────────────┐
│ [✕]  Nhà riêng · Huyền Thành  [?]    │
│ Mệnh quái: 坎 Khảm (Đông tứ mệnh)    │
│        南                            │
│  ┌────┬────┬────┐                    │  mặt bằng nhìn từ trên
│  │ 巽 │ 離 │ 坤 │  ⚠ Ngũ Hoàng 2026 │  camera top-down (phần 08)
│  ├────┼────┼────┤                    │
│  │ 震 │ 中 │ 兌 │                    │
│  ├────┼────┼────┤                    │
│  │ 艮 │ 坎 │ 乾 │                    │
│  └────┴────┴────┘                    │
│        北   [⟲ xoay góc nhìn]        │
│ Khay đồ: 🛏 giường · 🪑 bàn · 🚪 cửa  │
│ · 🪴 cây · 🔔 chuông gió (hóa sát)    │
│ Cung đang chọn: 坎 Bắc — Sinh Khí ✓  │
└──────────────────────────────────────┘
```

**Hai chế độ xem:** mặt bằng 2D (mặc định, rõ cung) và 3D trong nhà (nhân vật đi lại, đồ đặt thật — P4). Chuyển bằng nút. Cung cát / hung theo engine; ghi chữ + biểu tượng (✓ cát, ⚠ cần hóa), không chỉ màu xanh / đỏ.

**Âm:** đặt đồ `SFX-MG-040` (gỗ đặt xuống sàn gạch); treo chuông gió `SFX-MG-041` (chuông gió reo — dùng lại `SFX-AMB-031`).

---

## UI-86 · Chọn ngày lễ — trạch nhật (mã ngắn: `trachnhat`)

| | |
|---|---|
| Cơ chế | chọn ngày cho lễ nhập đạo, khánh thành đạo tràng (`zheri`, `huangdao`); khung giải án Trạch Nhật đã có (`zheri-case.js`, `ZHERI_STEPS`) |

**Bố cục:** lịch tháng (giống UI-69) mỗi ô ngày ghi 建除十二神 (Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thu, Khai, Bế) dạng một chữ Hán + màu nền nhạt theo cát / hung + ký hiệu (○ cát, △ bình, × kỵ). Chạm ngày → thẻ lý do: Hoàng đạo / Hắc đạo, xung tuổi người làm lễ, việc nên / kỵ. Nút «Chọn ngày này».

**Luật:** ngày đã qua mờ, không chọn được. Hiện song song ngày dương / âm.

---

## UI-87 · Thiền công án (mã ngắn: `congan`)

| | |
|---|---|
| Cơ chế | câu hỏi mở; AI Thiền sư dẫn; **không có đáp án đúng**; chấm bằng sự kiên trì (số lần quay lại) |
| Nền | UI-41 (AI) với persona Thiền sư Trúc Lâm, nhưng bố cục tối giản |

```
┌──────────────────────────────────────┐
│ [✕]  Công án · Yên Tử                │
│                                      │
│                                      │
│        «Trước khi cha mẹ sinh ra,    │  chữ lớn, giữa màn, nhiều khoảng trắng
│         mặt mũi con thế nào?»        │
│                                      │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ (viết điều con thấy, hoặc để     │ │
│ │  trống và ngồi thêm)             │ │
│ └──────────────────────────────────┘ │
│ [ Trình thầy ]   [ Ngồi thêm ]       │
│ Lần quay lại công án này: 3          │
└──────────────────────────────────────┘
```

**Luật:** không huy hiệu Neo (không phải luận lá số); không gợi ý câu hỏi tiếp. «Ngồi thêm» chuyển sang UI-81 năm phút rồi quay lại. Bản iOS / AI tắt: thiền sư trả lời bằng tập câu kịch bản (một câu ngắn, thường là một câu hỏi ngược). Công án dùng kho công án công cộng (Vô Môn Quan, Bích Nham Lục — tài liệu 09 / 14 xác nhận bản quyền bản dịch).

**Âm:** chỉ gió núi + chuông xa thưa; mõ một tiếng khi «Trình thầy».

---

## UI-88 · Mạn-đà-la cát (mã ngắn: `mandala`)

| | |
|---|---|
| Cơ chế | đặt cát theo mẫu đối xứng, rồi **xóa** (vô thường) |
| Ràng buộc | Tạng Địa chờ tham vấn (canon §3) — mẫu hình học trung tính, không chép mạn-đà-la nghi lễ thật cho tới khi có cố vấn |

**Khung:** đĩa tròn nhìn thẳng từ trên (camera top-down). Phễu cát (chak-pur) điều khiển bằng kéo một ngón; chạm khay chọn màu cát (5 màu + trắng). Chế độ đối xứng tự động 4 / 8 phần. Khi xong: nút «Hoàn tất» → chiêm ngắm 10 s → nút **«Xóa đi»** (bắt buộc để nhận kết quả) → hoạt ảnh quét cát vào giữa, rót xuống suối.

**Âm:** cát rơi `SFX-MG-050` (liên tục, cao độ theo tốc độ kéo); xóa `SFX-MG-051` (chổi quét) + kèn dài xa `SFX-BELL-020`.

**Ảnh chụp:** cho chụp ảnh trước khi xóa (UI-98) — ảnh là thứ duy nhất còn lại, ghi chú «Mạn-đà-la đã trở về dòng suối.»

---

## UI-89 · Vạch mặt Định Mệnh Hội — đối chiếu lời phán (mã ngắn: `doichieu`)

| | |
|---|---|
| Cơ chế | đối chiếu lời phán của thầy bói Định Mệnh Hội với lá số thật (`chart`, `taisui`, `anti-manipulation-data`) |

```
┌──────────────────────────────────────┐
│ [✕]  Quầy «Đổi Mệnh» · chợ    [?]    │
├──────────────────┬───────────────────┤
│ Thầy bói phán:   │ Lá số khách ghi:  │  hai cột song song
│ «Năm nay cô phạm │ Tuổi Thân, năm    │
│ Thái Tuế nặng,   │ 丙午: không phạm  │
│ phải mua bùa     │ Trị/Xung/Hình/Phá/│
│ 9 triệu.»        │ Hại.              │
│  [Gạch chân chỗ  │  [Mở lá số đầy đủ]│
│   sai]           │                   │
├──────────────────┴───────────────────┤
│ Bằng chứng đã nhặt: 2/3              │
│ ① «phạm Thái Tuế» ↔ bảng Thái Tuế ✓  │
│ ② «phải mua bùa» ↔ RB5: không bán    │
│    cải mệnh ✓                        │
│ [ Nói với khách ]                    │
└──────────────────────────────────────┘
```

**Điều khiển:** chạm giữ một cụm chữ ở cột trái để «gạch chân», rồi chạm dòng dữ liệu ở cột phải làm bằng chứng. Đủ bằng chứng → «Nói với khách» mở UI-40 (thoại kịch bản với 3 cách nói: thẳng / mềm / dẫn khách tự xem).

**Luật nội dung:** lời phán mẫu do tài liệu 03 / 06 viết, dựa trên các mẫu thao túng trong `anti-manipulation-data`; khi xong luôn có thẻ «Mẹo nhận biết lời phán thao túng ngoài đời» (3 dấu hiệu). Thưởng công đức «勸善 khuyên thiện +2» (canon §5.3).

---

## UI-90 · Cứu người trúng yểm — chẩn đoán đời thực trước (mã ngắn: `cuunguoi`)

| | |
|---|---|
| Cơ chế | chẩn đoán đời thực → phong thủy → trừ tà chính tông (`tcm`, `fs-cure`, `amta-data` opt-in) |
| Bắt buộc | bước đầu **luôn** là đời thực: ngủ, ăn, bệnh, áp lực; có lời nhắc tìm bác sĩ / chuyên gia tâm lý (`ETHICS › mental-health redirect`) |

**Thanh ba bước (cố định thứ tự, không bỏ qua):**

```
 ① Hỏi chuyện đời thường  →  ② Xem nhà  →  ③ Trừ tà chính tông
    ● đang                    ◌              ◌ (chỉ khi đã bật âm tà)
```

**Bước ① — bảng hỏi:** NPC (người nhà nạn nhân) trả lời theo kịch bản; người chơi chọn câu hỏi từ danh sách (Ngủ mấy tiếng? Ăn uống thế nào? Gần đây có chuyện gì buồn? Đã đi khám chưa?). Thẻ «Ghi nhận» điền dần. Nhiều án **kết thúc ở bước ①** (đúng tinh thần Mao Sơn đạo nhân: «Đa phần cái gọi là tà là người mình mệt»): kết quả «Khuyên đi khám / nghỉ ngơi» là kết quả **Thấu**.

**Bước ②:** dùng lại UI-85 thu gọn.

**Bước ③:** chỉ có khi đã bật UI-79; nghi thức là chuỗi động tác hư cấu (thắp đèn, đọc lời an ủi, rắc nước sạch) — không câu chú thật.

**Thẻ cuối luôn có:** «Ngoài đời, nếu bạn hoặc người thân có những dấu hiệu này kéo dài, hãy gặp bác sĩ.»

---

## UI-91 · Y dược — hái thảo và sắc thuốc (mã ngắn: `yduoc`)

| | |
|---|---|
| Cơ chế | hái thảo theo mùa / hành; sắc thuốc cho NPC theo tạng phủ (`tcm`) |
| Ràng buộc | không công thức cổ thật, không chẩn bệnh (canon §6.2 câu cấm của Vu y bà A Mậu) |

**Hai phần:**

1. **Hái** (trong thế giới): cây thuốc phát ánh nhẹ màu hành khi lại gần; nút hành động «Hái {tên}»; túi thảo dược (8 ô) ở góc phải dưới thay nút hành động khi đang trong vùng hái.
2. **Sắc** (bảng): lò đất + 3 ô vị; chọn vị theo «hành bổ cho tạng» của NPC (vd tạng Phế thuộc Kim). Lửa: thanh trượt văn hỏa / vũ hỏa. Nồi sôi lục bục `SFX-MG-060`; mùi thuốc biểu diễn bằng khói nhạt.

**Câu chú:** «Đây là trò chơi về ngũ hành, không phải bài thuốc. Đừng tự sắc thuốc theo game.»

---

## UI-92 · Tụng và lạy theo nhịp — sám hối (mã ngắn: `samhoi`)

| | |
|---|---|
| Cơ chế | mỗi pháp sám hối (`CHAN_HUI`, 5 pháp) có một nghi thức nhịp (tụng theo nhịp mõ, lạy theo nhịp chuông); **bắt buộc kèm hành động sửa sai** (UI-31) |

**Khung dọc**

```
┌──────────────────────────────────────┐
│ [✕]  Sám hối · Bút Tháp       [?]    │
│ Pháp: 作法懺 Tác pháp sám            │
│ Việc sửa sai đi kèm: Nói lại sự thật │
│ với khách ✓                          │
│                                      │
│   (cảnh: chánh điện, camera thấp sau │
│    lưng, tượng A Di Đà mờ phía trước)│
│                                      │
│  ○  ○  ●  ○  ○  ○  ○  ○              │  vòng nhịp: chấm sáng chạy theo mõ
│        ▲                              │
│   lạy 3/9                            │
│ ┌──────────────────────────────────┐ │
│ │      chạm theo tiếng mõ          │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

**Nhịp:** mõ 60 BPM (tụng) — chấm nhịp cửa sổ ±180 ms (Rộng ±300, Rất rộng ±450, Tự động: game tự chạm). Lạy: một lạy = 3 nhịp (cúi – chạm đất – đứng), nhân vật làm động tác theo.

**Phản hồi:** đúng nhịp: chấm sáng vàng, không âm thêm (tiếng mõ đã là phản hồi); lệch: chấm mờ, **không** âm báo sai. Không tính combo, không điểm số hiện trên màn (P3) — kết quả chỉ ở thẻ cuối.

**Luật nội dung:** lời tụng hiện dạng **phiên âm Hán Việt của câu Phật hiệu công cộng** (vd «Nam mô A Di Đà Phật») hoặc câu sám hối tóm ý tiếng Việt; không in toàn văn chú (canon §5.4). Cố vấn Tịnh Độ duyệt (tài liệu 14).

**Âm:** `SFX-RITE-040` mõ (đã có mẫu tổng hợp `audio.js › knock(900)` — thay bằng mẫu thu âm), `SFX-BELL-010` chuông gia trì mỗi lạy.

---

## UI-93 · Bái Đẩu — thắp bảy đèn Bắc Đẩu (mã ngắn: `baidau`)

| | |
|---|---|
| Cơ chế | `talisman-data › ritual` (拜斗); trong game: thắp 7 đèn theo thứ tự Bắc Đẩu (Tham Lang → Phá Quân) rồi lễ bái; lễ chung Trùng Cửu (9/9) ở Đẩu Mẫu Điện (đã có điện `daumau`) |

**Khung:** cảnh trong điện, camera nhìn lên trần vẽ sao (phần 08, preset `cam.skyward`); 7 đèn xếp hình gàu Bắc Đẩu trên bàn lễ. Chạm đèn theo thứ tự → đèn sáng, ngôi sao tương ứng trên trần sáng theo. Thứ tự sai: đèn chỉ lóe rồi tắt, NPC nhắc tên sao kế tiếp (không phạt).

**Bản MMO (lễ chung):** mỗi người thắp một đèn trong 49 đèn (7 × 7) của đàn lễ; đèn của bạn có viền màu áo.

**Âm:** châm đèn `SFX-RITE-030`; mỗi sao sáng một nốt khánh theo thang ngũ âm (7 nốt, lặp lên quãng tám) `SFX-BELL-011a…g`.

---

## UI-94 · Phóng sinh và thả đèn hoa đăng (mã ngắn: `phongsinh`)

| | |
|---|---|
| Nền | Hồ Sen (`sen`): thả đèn kèm điều ước (`state.lanterns`, `S.addLantern`, `CAPS.keepLanterns 50`, đèn hôm nay trôi trong cảnh `todayLanterns`); web |

**Thả đèn (đã có, giữ):** ô nhập điều ước (lọc chữ), nút thả; đèn trôi ra giữa hồ trong cảnh (P4); thưởng `REWARD.lantern = 3`. iOS tắt (`wishes: false`).

**Phóng sinh (mới):** chọn sinh vật đã mua lại từ lồng ở chợ (canon §5.3 «thả chim ở chợ — mua lại từ lồng») → đi tới bờ hồ / gò đất → nút «Thả». Cá bơi đi, chim bay lên (camera ngước theo 2 s). Ghi công `放生 +1`.

**Luật:** không có sinh vật hiếm / đẹp để «sưu tập» (phóng sinh không phải bộ sưu tập). Không thả được cùng một nơi quá 3 lần / ngày (tránh cày công đức — chỉ ghi công 1 lần / ngày, các lần sau vẫn thả được, ghi «việc thiện không cần đếm»).

---

## UI-95 · Các gian nhỏ đã có ở Sơn Môn (mã ngắn: `minigian`)

| Gian | HUD hiện có (`stations.js`, `game.css`) | Giữ | Bổ sung |
|---|---|---|---|
| Ống Xăm (`xam`) | ống `.hq-tube` lắc (`hq-shake` 0,12 s), thanh `.hq-meter`, que xăm rơi `.hq-stick-out`, xin keo `.hq-jiao` (âm / dương), thẻ xăm `.hq-stick-card` nền giấy, thơ `.hq-poem`; 3 thẻ / ngày | bố cục | lắc điện thoại thật (DeviceMotion, xin quyền) thay vì giữ nút; âm `SFX-MG-021` (thẻ tre xóc — thay `audio.js › rattle`) |
| Lư Hương (`huong`) | 3 nén `.hq-incense-vis` cháy theo `--burn`, khói `hq-smoke`, câu tĩnh `.hq-calm`; 3 phút (`INCENSE_MS`); bảng `peek` | bố cục | tàn nhang rơi (VFX), âm cháy rất nhỏ `SFX-RITE-032` |
| Trà Thất (`tra`) | vòng thở `.hq-breath`, chọn trà theo danh xưng (`TEAS`: Trà Sen 0, Trà Lài 30, Ô Long 100, Shan Tuyết 250), màu nước trà `setTeaColor`, ghế MMO; 15 phút / ngày tính thưởng | bố cục | rót trà `SFX-MG-070`, chén chạm `SFX-MG-071`; người ngồi cạnh (MMO) hiện tên nhỏ |
| La Bàn Đài (`compass`) | canvas la bàn kéo xoay `.hq-compass`, danh sách hướng `.hq-dirs` (`good` vàng / `bad` xám) | bố cục | âm đĩa xoay `SFX-UI-033`; hướng tốt / xấu thêm ký hiệu ✓ / ⚠ |
| Bảng Lịch (`lich`) | ngày lớn `.hq-date b` 44 px son, điểm cá nhân `.hq-score` (good / mid / low) | bố cục | vòng điểm thêm chữ (Tốt / Vừa / Nên thận trọng) |
| Hồ Sen (`sen`) | xem UI-94 | — | — |

---

## UI-96 · Hành hương leo núi và bánh xe kinh (mã ngắn: `hanhhuong`)

**Hành hương (Yên Tử):** không phải mini-game bảng — là **HUD thế giới**: thanh Nguyên Khí mảnh dưới tên nhân vật (canon §4.1: Nguyên Khí là số lượt hoạt động tốn sức) giảm khi leo bậc đá; điểm nghỉ (am, chùa dọc đường: Giải Oan, Hoa Yên, Huệ Quang, Chùa Đồng) hồi Nguyên Khí bằng trà / ngồi. Mỗi điểm dừng: dấu son hành hương đóng vào **Sổ Hành Hương** (thẻ nhỏ trong Sổ Mệnh › Nhật ký). Camera: nhìn lên dốc (phần 08 §2.6).

**Bánh xe kinh (Tạng Địa, chờ tham vấn):** đi vòng quanh điện theo chiều kim đồng hồ, chạm vuốt từng bánh xe → bánh quay, âm `SFX-MG-080` (gỗ – đồng quay, chuông nhỏ đỉnh trục). Đi ngược chiều: bánh không quay, NPC nhắc nhẹ phép đi nhiễu (theo cố vấn).

---

## UI-97 · Ngự kiếm phi hành (mã ngắn: `fly`)

| | |
|---|---|
| Nguồn | `main.js › setFlying(on)`: mở cấp 8 hoặc VIP (`unlocked('fly')`), độ cao 3–420 m (vào bay ít nhất 18 m), nhanh ×4, vượt vật cản; phím F / Space / C; cụm ▲▼ (UI-11); ngự vật theo Tàng Y Các (`mount`: Ngự Kiếm, Cân Đẩu Vân, Hồ Lô Phi Hành, Liên Hoa Đài, Tiên Hạc) |

**HUD khi bay (★):**

```
┌──────────────────────────────────────┐
│ [🗡 ON]                     北 ▲      │  nút bay sáng viền vàng (đã có .on)
│                                      │
│                                      │
│            (cảnh, mây)               │
│                                      │
│                              ▲  126 m│  thước độ cao + cụm ▲▼
│  ◉ cần                       ▼       │
└──────────────────────────────────────┘
```

**Luật:** dock và tracker thu nhỏ khi bay; nhãn gian tắt bớt (chỉ thánh địa); tên người chơi khác chỉ hiện < 40 m. Không vào được điện khi đang bay (đã có: tự hạ kiếm). Hạ cánh: «Hạ kiếm, đáp đất.» + `SFX-FLY-003` (gió dừng, chân chạm đất).

**Âm:** gió theo tốc độ `SFX-FLY-001` (lặp, lọc thông thấp mở dần theo tốc độ), vút qua đám mây `SFX-FLY-002`; tiếng ngự vật riêng (kiếm ngân `SFX-FLY-010`, mây phù phù `-011`, hồ lô lắc `-012`, đài sen chuông `-013`, hạc vỗ cánh `-014`).

**Giảm chuyển động:** không nghiêng camera khi rẽ; FOV không giãn theo tốc độ.

---

## UI-98 · Chế độ chụp ảnh (mã ngắn: `photo`)

| | |
|---|---|
| Nguồn | `render3d.js › snapshot(type)` (JPEG 0,85 — đã có), `debugCam` (camera tự do — đã có cho gỡ lỗi), `setView({yaw, pitch, dist})` |
| Lối vào | phím P; menu tạm nghỉ › Ảnh chụp; nút 📷 trong UI-88, UI-33 |

**Khung dọc**

```
┌──────────────────────────────────────┐
│ [✕]                       [⟲] [👁]   │  👁 ẩn mọi giao diện
│                                      │
│          (cảnh, khung lưới 1/3)      │
│                                      │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ Camera: [Theo nhân vật|Tự do]    │ │
│ │ Ống kính ─────●────── 45°        │ │  FOV 20–90°
│ │ Giờ    ─────────●─── 18:30       │ │  ánh sáng theo khung giờ (debugHour)
│ │ Bộ lọc: [Không][Thủy mặc][Giấy dó]│ │
│ │ Ẩn: [người khác] [tên] [hiệu ứng]│ │
│ │ Tư thế: [đứng][ngồi][chắp tay][…]│ │
│ └──────────────────────────────────┘ │
│              ( ◉ Chụp )               │
└──────────────────────────────────────┘
```

**Luật:**

1. Camera tự do giới hạn trong bán kính 30 m quanh nhân vật, không chui qua tường điện (dùng lại luật kẹp camera trong điện), không xuyên đất.
2. «Giờ» đổi ánh sáng **chỉ trong ảnh** (dùng `debugHour` có sẵn), thoát chế độ thì trả về giờ thật.
3. Người chơi khác **mặc định ẩn** khi chụp (riêng tư); bật hiện thì tên của họ vẫn ẩn.
4. Ảnh lưu: tải xuống tệp (web) / Ảnh của máy (native, xin quyền). Khung ảnh có dấu nhỏ «Huyền Giới» góc phải dưới, tắt được.
5. Bộ lọc «Thủy mặc» và «Giấy dó» là hậu kỳ nhẹ (phần 12 §6).

**Âm:** màn trập `SFX-UI-050` (tiếng gõ phách gỗ thay tiếng máy ảnh). **Đo lường:** `ui_photo_open`; `ui_photo_shot {filter, free_cam: bool}`.

---

## UI-99 · Trình phát cảnh cắt (mã ngắn: `cutscene`)

| | |
|---|---|
| Nguồn | (chưa có — cần làm); cảnh `CUT-xxx` do tài liệu 03; camera điện ảnh phần 08 §4 |
| Lớp | z 70 |

**Giao diện:** khung chữ điện ảnh (hai dải đen 10% trên / dưới — chỉ trên màn ngang; màn dọc không dải đen để khỏi mất chỗ), phụ đề dưới cùng (UI-40 kiểu chữ, nền mờ 60%), tên người nói màu đạo thống. Chạm bất kỳ → hiện nút «⏩ Bỏ qua» và «⏸» trong 3 s.

**Luật:**

1. Cảnh lần đầu: «Bỏ qua» cần **giữ 1 s** (tránh lỡ tay). Cảnh đã xem: chạm là bỏ.
2. Bỏ qua cảnh có lựa chọn → dừng ở lựa chọn (không tự chọn hộ).
3. Phụ đề luôn bật cho cảnh cắt khi tắt âm hoặc khi bật «Phụ đề thoại» (mặc định bật).
4. Thời lượng một cảnh ≤ 90 s (màn dọc điện thoại, người chơi phiên ngắn 15–30 phút — canon §9.2).
5. Ẩn HUD, toast vào hàng đợi (phần 01 §2).

**Đo lường:** `ui_cut_view {id}`; `ui_cut_skip {id, t}`.

---

## Phụ lục A · Trạng thái và câu chữ theo từng mini-game

Bổ sung cho các mục UI-81 → UI-96: bảng 8 ô trạng thái (phần 01 §5) và chuỗi chính. Ô không ghi là theo khung chung UI-80.

### A.1 UI-81 Tĩnh tọa

| Ô | Hành vi |
|---|---|
| S-LOAD | «Đang trải bồ đoàn…» (tải nhạc `BGM-MG-TINHTOA`) |
| S-LOCK | Nguyên Khí cạn: «Nguyên Khí hôm nay đã cạn. Uống chén trà hoặc nghỉ, mai tĩnh tọa tiếp.» |
| S-OFF | tĩnh tọa đồng tu (ghế MMO) chuyển sang một mình, không báo lỗi |
| S-RM | vòng không phồng; chữ «Hít / Giữ / Thở» + độ sáng |

| Khóa | Tiếng Việt |
|---|---|
| `ui.mg.tinhtoa.title` | Tĩnh tọa · {nơi} |
| `ui.mg.tinhtoa.in` / `.hold` / `.out` | Hít… / Giữ… / Thở ra… |
| `ui.mg.tinhtoa.thought_hint` | Tạp niệm đến thì để nó đi. Đừng chạm. |
| `ui.mg.tinhtoa.health` | Đây là bài thở thư giãn trong trò chơi, không phải phương pháp chữa bệnh. Thấy chóng mặt thì thở bình thường và dừng lại. |
| `ui.mg.tinhtoa.end.thau` | Tâm lặng như mặt hồ. |
| `ui.mg.tinhtoa.end.gan` | Gió có lúc gợn, rồi lại yên. |
| `ui.mg.tinhtoa.end.chua` | Hôm nay tạp niệm nhiều. Ngồi được đến đây đã là tu. |

### A.2 UI-82 Kết phù

| Ô | Hành vi |
|---|---|
| S-LOCK | chưa thụ lục bậc cần: «Lá phù này cần thụ lục bậc {n}. Hỏi Trương Thiên Sư.» |
| S-ERR | ký tự trùng ô: rung light, ký tự bật về khay |

| Khóa | Tiếng Việt |
|---|---|
| `ui.mg.ketphu.parts` | Đầu · Thân · Bụng · Đảm · Chân |
| `ui.mg.ketphu.fs_first` | Đã xem phong thủy trước ✓ |
| `ui.mg.ketphu.fs_missing` | Thiên Sư dặn: xem phong thủy nhà trước, phù sau. |
| `ui.mg.ketphu.seal` | Đóng ấn |
| `ui.mg.ketphu.note` | Ký tự trong game là chữ bịa để học cấu trúc phù, không phải phù thật. |
| `ui.mg.ketphu.wrong.core` | Đảm là chỗ thần cư — đặt chữ hộ thần ở đây. |
| `ui.mg.ketphu.wrong.wx` | Việc này cần trấn bằng hành {hành}. |

### A.3 UI-83 Khoa cử

| Ô | Hành vi |
|---|---|
| S-LOCK | «Kỳ thi {vòng} mở vào {ngày âm}. Ôn ở Thư Lâu trước nhé.» |
| S-OFF | bảng vàng toàn máy chủ không cập nhật; điểm của bạn lưu và gửi sau |

| Khóa | Tiếng Việt |
|---|---|
| `ui.mg.khoacu.round` | Hương thí / Hội thí / Đình thí |
| `ui.mg.khoacu.q` | Câu {i}/{n} |
| `ui.mg.khoacu.submit` | Nộp bài |
| `ui.mg.khoacu.wenchang` | Văn Xương Chiếu: +20% điểm |
| `ui.mg.khoacu.pass` | Tên bạn đã lên bảng vàng. |
| `ui.mg.khoacu.fail` | Kỳ này chưa đỗ. Kỳ sau Văn Miếu vẫn mở cửa. |

### A.4 UI-84 Đặt tên / đạo hiệu

| Khóa | Tiếng Việt |
|---|---|
| `ui.mg.datten.yong` | Dụng thần của bạn: {hán} {việt} |
| `ui.mg.datten.suggest` | Gợi ý chữ hành {hành}: |
| `ui.mg.datten.grids` | Thiên {a} · Nhân {b} · Địa {c} · Ngoại {d} · Tổng {e} |
| `ui.mg.datten.match` | Hành của tên: {hành} ✓ hợp Dụng |
| `ui.mg.datten.note` | Tên khai sinh thật không cần đổi. Đây là bài học về cách đặt tên. |
| `ui.mg.datten.ask` | Xin Tế tửu duyệt |
| `ui.mg.datten.rejected` | Đạo hiệu này không dùng được trong phòng chung. Chọn chữ khác nhé. |

### A.5 UI-85 Sửa nhà

| Ô | Hành vi |
|---|---|
| S-EMPTY | nhà trống: «Nhà còn trống. Đặt giường trước — giường là chỗ người ở lâu nhất.» |
| S-LOCK | chưa có nhà riêng: «Nhà riêng ở Huyền Thành mở sau nhiệm vụ của tầng Không gian.» |

| Khóa | Tiếng Việt |
|---|---|
| `ui.mg.suanha.gua` | Mệnh quái: {hán} {việt} ({đông/tây} tứ mệnh) |
| `ui.mg.suanha.good` | {cung} — {sao} ✓ |
| `ui.mg.suanha.fix` | {cung} — {sao} ⚠ cần hóa |
| `ui.mg.suanha.year` | ⚠ {sao} năm {năm} |
| `ui.mg.suanha.rotate` | Xoay góc nhìn |
| `ui.mg.suanha.mode2d` / `.mode3d` | Mặt bằng / Trong nhà |

### A.6 UI-86 Chọn ngày lễ

| Khóa | Tiếng Việt |
|---|---|
| `ui.mg.trachnhat.task` | Chọn ngày cho: {việc} |
| `ui.mg.trachnhat.day` | {ngày dương} · {ngày âm} · trực {kiến trừ} · {hoàng/hắc đạo} |
| `ui.mg.trachnhat.clash` | Xung tuổi {tuổi} — người làm lễ nên tránh |
| `ui.mg.trachnhat.pick` | Chọn ngày này |
| `ui.mg.trachnhat.past` | Ngày đã qua |

### A.7 UI-87 Thiền công án

| Ô | Hành vi |
|---|---|
| S-AIOFF / S-IOS | thiền sư đáp bằng câu kịch bản (một câu, thường là câu hỏi ngược) |
| S-EMPTY | trình ô trống: thiền sư đáp «Im lặng cũng là một câu trả lời. Ngồi thêm đi.» |

| Khóa | Tiếng Việt |
|---|---|
| `ui.mg.congan.placeholder` | (viết điều con thấy, hoặc để trống và ngồi thêm) |
| `ui.mg.congan.submit` | Trình thầy |
| `ui.mg.congan.sit` | Ngồi thêm |
| `ui.mg.congan.count` | Lần quay lại công án này: {n} |

### A.8 UI-88 Mạn-đà-la cát

| Khóa | Tiếng Việt |
|---|---|
| `ui.mg.mandala.symmetry` | Đối xứng: 4 · 8 · tắt |
| `ui.mg.mandala.done` | Hoàn tất |
| `ui.mg.mandala.contemplate` | Ngắm thêm một chút. |
| `ui.mg.mandala.erase` | Xóa đi |
| `ui.mg.mandala.erase_hint` | Phần thưởng đến khi bạn buông, không phải khi bạn xong. |
| `ui.mg.mandala.after` | Mạn-đà-la đã trở về dòng suối. |

### A.9 UI-89 Vạch mặt Định Mệnh Hội

| Khóa | Tiếng Việt |
|---|---|
| `ui.mg.doichieu.left` | Thầy bói phán: |
| `ui.mg.doichieu.right` | Lá số khách ghi: |
| `ui.mg.doichieu.mark` | Gạch chân chỗ sai |
| `ui.mg.doichieu.evidence` | Bằng chứng đã nhặt: {x}/{n} |
| `ui.mg.doichieu.speak` | Nói với khách |
| `ui.mg.doichieu.tips_title` | Ba dấu hiệu lời phán thao túng |
| `ui.mg.doichieu.tip1` | Dọa một điều xấu chắc chắn sẽ xảy ra. |
| `ui.mg.doichieu.tip2` | Chỉ có một cách giải, và cách đó tốn tiền. |
| `ui.mg.doichieu.tip3` | Giục làm ngay, không cho hỏi người khác. |

### A.10 UI-90 Cứu người trúng yểm

| Khóa | Tiếng Việt |
|---|---|
| `ui.mg.cuunguoi.step1` / `.step2` / `.step3` | Hỏi chuyện đời thường / Xem nhà / Trừ tà chính tông |
| `ui.mg.cuunguoi.q.sleep` | Gần đây ngủ mấy tiếng? |
| `ui.mg.cuunguoi.q.eat` | Ăn uống thế nào? |
| `ui.mg.cuunguoi.q.event` | Gần đây có chuyện gì buồn, lo không? |
| `ui.mg.cuunguoi.q.doctor` | Đã đi khám chưa? |
| `ui.mg.cuunguoi.verdict.rest` | Người nhà mệt và lo nhiều. Khuyên nghỉ ngơi và đi khám. |
| `ui.mg.cuunguoi.real_note` | Ngoài đời, nếu bạn hoặc người thân có những dấu hiệu này kéo dài, hãy gặp bác sĩ. |
| `ui.mg.cuunguoi.step3_locked` | Bước này chỉ có khi bạn đã bật nội dung âm tà. |

### A.11 UI-91 Y dược

| Khóa | Tiếng Việt |
|---|---|
| `ui.mg.yduoc.pick` | Hái {tên} |
| `ui.mg.yduoc.bag` | Túi thảo dược {x}/8 |
| `ui.mg.yduoc.organ` | Tạng {tạng} thuộc {hành} |
| `ui.mg.yduoc.fire` | Văn hỏa ↔ Vũ hỏa |
| `ui.mg.yduoc.note` | Đây là trò chơi về ngũ hành, không phải bài thuốc. Đừng tự sắc thuốc theo game. |

### A.12 UI-92 Sám hối

| Ô | Hành vi |
|---|---|
| S-LOCK | chưa làm hành động sửa sai: «Sám hối đi cùng việc sửa sai. Hãy {việc} trước.» + Chỉ đường |

| Khóa | Tiếng Việt |
|---|---|
| `ui.mg.samhoi.method` | Pháp: {hán} {việt} |
| `ui.mg.samhoi.fix_done` | Việc sửa sai đi kèm: {việc} ✓ |
| `ui.mg.samhoi.tap` | chạm theo tiếng mõ |
| `ui.mg.samhoi.bows` | lạy {x}/{n} |
| `ui.mg.samhoi.end` | Lòng nhẹ hơn một chút. Nghiệp {tên} giảm {n}. |

### A.13 UI-93 Bái Đẩu

| Khóa | Tiếng Việt |
|---|---|
| `ui.mg.baidau.stars` | Tham Lang · Cự Môn · Lộc Tồn · Văn Khúc · Liêm Trinh · Vũ Khúc · Phá Quân |
| `ui.mg.baidau.next` | Sao kế tiếp: {sao} |
| `ui.mg.baidau.wrong` | Đèn này chưa tới lượt. Thắp {sao} trước. |
| `ui.mg.baidau.done` | Bảy đèn đã sáng. |

### A.14 UI-94 Phóng sinh, thả đèn

| Khóa | Tiếng Việt |
|---|---|
| `ui.mg.phongsinh.release` | Thả |
| `ui.mg.phongsinh.logged` | 放生 Phóng sinh +1 công |
| `ui.mg.phongsinh.more` | Việc thiện không cần đếm. (lần thứ hai trở đi trong ngày) |
| `ui.mg.den.wish` | Điều ước của bạn (web) / Lời tưởng nhớ (iOS — nếu bật lại) |
| `ui.mg.den.float` | Thả đèn |

### A.15 UI-96 Hành hương, bánh xe kinh

| Khóa | Tiếng Việt |
|---|---|
| `ui.mg.hanhhuong.stamp` | Đóng dấu hành hương: {nơi} |
| `ui.mg.hanhhuong.tired` | Nguyên Khí thấp. Nghỉ ở {nơi gần} một lát. |
| `ui.mg.banhxe.direction` | Đi theo chiều kim đồng hồ quanh điện. |

