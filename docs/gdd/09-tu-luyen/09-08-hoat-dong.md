# 09-08 · Danh mục hoạt động `ACT-xxx` (125 hoạt động · 20 vùng)

> Mọi việc người chơi **làm được hằng ngày, hằng tuần, theo tháng âm, theo mùa** trong thế giới. Mỗi hoạt động gắn một engine của app (hoặc ghi «mới»), một nhịp, một phần thưởng và điều kiện. Độ kiếp có mã riêng `ACT-K*` ở `09-02`.
> Đơn vị thưởng như `09-03`: **thô** (trước hệ số), PK = Phúc Khí, công = Sổ Công Quá, NK = Nguyên Khí. «Trong trần» = tính vào `TRẦN_NGÀY`; «ngoài trần» = không.

---

## 1. Quy ước

### 1.1 Nhịp

| Ký hiệu | Nghĩa | Đặt lại |
|---|---|---|
| **N** | ngày | 00:00 giờ tài khoản (`rollDay`) |
| **T** | tuần | thứ Hai 00:00 |
| **Â** | tháng âm | mùng 1 âm lịch (Sóc) |
| **M** | mùa (năm can chi) | Lập Xuân (`thaitue.js › suiYear`) |
| **L** | lễ tiết theo lịch âm | ngày lễ (tài liệu 10 `EV-*`) |
| **1** | một lần (đời nhân vật) | — |
| **TD** | tự do (không giới hạn lượt, thưởng theo `K_lặp` và trần) | — |
| **K** | khi có điều kiện (sự kiện kích hoạt) | — |

### 1.2 Cột «Nhóm»

Nhóm pháp môn để tính Nhật Khóa (`09-09` §3): Tĩnh · Thân · Học · Nghệ · Lễ · Hạnh. «—» = không tính Nhật Khóa.

### 1.3 iOS

✓ có · ✎ có, đổi nội dung · ✗ tắt (theo `features.js › IOS_OFF` hoặc nguyên tắc «không vận hạn bản thân»).

---

## 2. Huyền Thành và Huyền Quán Sơn Môn (`thanh`)

| Mã | Hoạt động | Nhịp | Engine | Thưởng | Điều kiện | Nhóm | iOS |
|---|---|---|---|---|---|---|---|
| `ACT-001` | Giải án khách (3 khách / ngày, 6 bước luận) | N | `cases.js › buildCase, gradeAnswers`; `chart`, `kb` | PK `15 × total`; thô `5 × f(total)` trong trần | bậc 1 | Hạnh | ✓ |
| `ACT-002` | Án Cổ (38 lá số kinh điển) | 1 / án | `cases.js › buildClassical`; `classical-cases` | PK 25 + 5 thô ngoài trần khi lần đầu ≥ 60% | bậc 1 | Học | ✓ |
| `ACT-003` | Thắp nhang Lư Hương (iOS: Lò Trầm) | N | `state.js › lightIncense` | PK 5 · 1 thô trong trần | — | Lễ | ✎ tên |
| `ACT-004` | Đèn an Thái Tuế | N (thêm dầu) · M (thắp mới) | `thaitue.js › thaiTue`; `state.js › lightLamp` | PK 10 / 3 · 1 thô | — | Lễ | ✗ |
| `ACT-005` | Xem Bảng Lịch ngày | N | `stations.js › todayInfo`; `daily` | PK 2 · 0 thô | — | — | ✓ |
| `ACT-006` | La Bàn Đài | N | `fengshui-compass` | PK 5 · 0 thô | — | — | ✓ |
| `ACT-007` | Xin xăm (Ống Xăm) | ≤ 3 / N | `qiuqian` | PK 3 · **0 thô** (`09-03` E3) | — | — | ✗ |
| `ACT-008` | Gieo quẻ (5 phép) | TD | `que-ui.js` (`meihua`, `liuyao`, `xiaoliuren`, `jinkoujue`, `qiuqian`) | 0 thô | — | — | ✗ |
| `ACT-009` | Vận Mệnh Các (9 cổng đại vận) | TD | `vanmenh.js › vanMenh` | 0 thô | — | — | ✗ |
| `ACT-010` | Ngồi trà Trà Thất | N | `state.js › addTeaMinutes` | PK ≤ 15 / ngày · NK hồi · 0 thô (ngồi thụ động) | — | — | ✓ |
| `ACT-011` | **Nhật Khóa** (3 việc thuộc 3 nhóm khác nhau) | N | mới (`09-09` §3) | 6 thô + `min(4, ⌊chuỗi/7⌋)` ngoài trần | bậc 1 | — | ✓ |
| `ACT-012` | Tam Sự (3 việc cũ: lịch, hương, án) | N | `state.js › tasks, settleTasks` | PK 5, giữ chuỗi cũ | — | — | ✓ |
| `ACT-013` | Điểm danh Tàng Y Các | N | `cosmetics.js` (điểm danh Ngọc 10…80) | Ngọc | — | — | ✓ |
| `ACT-014` | Bố trí nhà riêng (`MG-08` nhà mình) | T (1 lần chấm / tuần) | `zhai`, `xuankong`, `fs-cure` | thô `MG-08` trong trần; nhà đạt `s ≥ 0,8` → «Nhà yên» +5 NK tối đa khi nghỉ đêm | có nhà riêng (tài liệu 08) | Nghệ | ✓ |
| `ACT-015` | Nghỉ đêm ở tĩnh thất nhà riêng | N | mới | hồi đầy NK một lần / ngày (`09-09` §5) | có nhà riêng | — | ✓ |
| `ACT-016` | Một bữa chay ở trai đường Sơn Môn | N | `remedy-fate › CONG_QUA.thien` «Ăn chay 1 ngày» (p 1) | +15 NK · 1 công | — | Hạnh | ✓ |
| `ACT-017` | Khách gõ cửa nhà riêng (xin chọn ngày / đặt tên con) | N (ngẫu nhiên 50%) | `MG-09`, `MG-10` | thô MG; 1 công nếu `s ≥ 0,7` | có nhà riêng; bậc 2 | Học | ✓ |
| `ACT-018` | Hiệu thuốc Huyền Thành (`MG-07`, một bệnh nhân) | N | `tcm` | thô `MG-07` | — | Học | ✓ |
| `ACT-019` | Họa đường Huyền Thành (`MG-18`) | TD | `WX_GIATRI` | thô `MG-18` | — | Nghệ | ✓ |
| `ACT-020` | Quầy «đổi mệnh» chợ Huyền Thành (`MG-22`) | N | `chart`, `thaitue.js`, `anti-manipulation-data` | thô `MG-22` + ≤ 2 công | bậc 2 | Hạnh | ✓ |

---

## 3. Bảy vùng sảnh nghề (đã có trong game)

| Mã | Hoạt động | Vùng | Nhịp | Engine | Thưởng | Điều kiện | Nhóm | iOS |
|---|---|---|---|---|---|---|---|---|
| `ACT-021` | Sảnh Trạch Nhật — chọn ngày cho khách | `lichduong` | N | `zheri-case.js › buildZheriCase`; `zheri` | PK `15 × total` · thô `4 × f` trong trần | — | Học | ✓ |
| `ACT-022` | Sảnh Dương Trạch — xem nhà cho khách | `phongthuy` | N | `dz-case.js › buildDzCase`; `zhai`, `xuankong` | như trên | — | Học | ✓ |
| `ACT-023` | Sảnh Điều Hậu | `cungthong` | N | `halls.js › buildDieuHau`; `han-nuan` | như trên | — | Học | ✓ |
| `ACT-024` | Sảnh Thư Viện (5 câu nguyên văn ↔ nghĩa) | `thulau` | N | `halls.js › buildThuVien`; `kb` | như trên | — | Học | ✓ |
| `ACT-025` | Sảnh Hợp Hôn (án chung cả máy chủ trong ngày) | `thanh` | N | `halls.js › buildHopHon`; `hehun` | như trên | — | Học | ✓ |
| `ACT-026` | Sảnh Tử Vi | `trichthien` | N | `halls.js › buildTuVi`; `ziwei` | như trên | — | Học | ✓ |
| `ACT-027` | Sảnh Tượng Pháp (Manh phái) | `manh` | N | `halls.js › buildTuongPhap`; `mangpai` | như trên | — | Học | ✓ |
| `ACT-028` | Sảnh Cách Cục | `tubinh` | N | `halls.js › buildCachCuc` | như trên | — | Học | ✓ |
| `ACT-029` | Hương thí (`MG-03`) | `thulau` | N | `library-data`, `kb`, `cases.js` | thô ≤ 8 trong trần | — | Học | ✓ |
| `ACT-030` | Chọn ngày cho lễ môn phái (`MG-09`) | `lichduong` | T | `zheri › findGoodDates` | thô `MG-09`; ngày được chọn thành ngày lễ thật của môn phái tuần sau (tài liệu 10) | bậc 2, trong môn phái | Học | ✓ |

**Ghi chú cân bằng:** 8 sảnh × 4 thô = 32 thô > trần bậc 1–2 → người chơi chọn sảnh mình thích; Phúc Khí của sảnh không bị trần (giữ như code hiện có).

---

## 4. Am Vân Cốc và các phân đàn ở vùng cũ

| Mã | Hoạt động | Vùng | Nhịp | Engine | Thưởng | Điều kiện | Nhóm | iOS |
|---|---|---|---|---|---|---|---|---|
| `ACT-031` | Hầu trà Vân Cốc, nghe một đoạn điển cố Liễu Phàm | `vancoc` | N | `remedy-fate › LIAOFAN_STORY`, `GAI_PRINCIPLE`; `MG-14` | thô `MG-14`; thẻ điển cố mới mỗi ngày (14 thẻ rồi lặp) | Hồi I (tài liệu 03) | Tĩnh | ✓ |
| `ACT-032` | Khay cát nhỏ (`MG-05`) | `vancoc` | TD | (mới) | thô `MG-05` | bậc 3 | Lễ | ✓ |
| `ACT-033` | Trì Chuẩn Đề 21 biến (`MG-06` chế độ trì chú) | `vancoc` | N | `remedy-fate › ZHUNTI` | thô `MG-06` | bậc 2 | Lễ | ✓ |
| `ACT-034` | Quan sao đêm trên Trích Thiên Đỉnh (tìm Bắc Đẩu, chuôi chỉ mùa) | `trichthien` | N (đêm, giờ Tuất – Dần) | `MG-19` phần trời sao | thô 2 trong trần | bậc 2 | Lễ | ✓ |
| `ACT-035` | Phóng sinh ở Cùng Thông Hồ (`MG-21`) | `cungthong` | N | `remedy-fate › CONG_QUA` | thô `MG-21` + ≤ 3 công | bậc 2 | Hạnh | ✓ |
| `ACT-036` | Thả đèn ở Cùng Thông Hồ (`MG-16`) | `cungthong` | N | `state.js › addLantern` | thô 2 · PK 3 | — | Lễ | ✗ |
| `ACT-037` | Đạo Tạng các: đọc và chép một mục (`MG-12`) | `thulau` | N | `library-data` lớp `daozang` | thô `MG-12` | — | Nghệ | ✓ (phân đàn BD trên iOS) |
| `ACT-038` | Hái thuốc ven hồ (`MG-13`) | `cungthong` | N | `tcm` | ≤ 6 thô / ngày chung mọi vùng | — | Thân | ✓ |
| `ACT-039` | Lễ Hạ Nguyên — thả đèn nhóm môn phái | `cungthong` | L (15/10 âm) | `MG-16` bản lễ | ≈ 30 thô (tài liệu 10 chốt) | — | Lễ | ✗ (iOS: dâng hương tập thể) |
| `ACT-040` | Tham vấn Vân Cốc (hỏi về công quá cách, Liễu Phàm) | `vancoc` | T | Thầy AI (`master-ui.js`) với persona `van_coc`; `checkNeo` | 0 thô (học); mở câu hỏi cho `ACT-071` | Hồi I | — | ✎ (bộ câu hỏi soạn sẵn, không AI) |

---

## 5. Hoạt động định kỳ chung (mọi thánh địa / phân đàn)

| Mã | Hoạt động | Nhịp | Thưởng (ngoài trần) | Điều kiện | iOS |
|---|---|---|---|---|---|
| `ACT-041` | **Lễ tuần đạo tràng** của đạo thống chính | T | 15 thô (`09-03` §5.4) · vai trong lễ: +1 công | bậc 2, đã nhập môn | ✓ |
| `ACT-042` | Đồng tu tuần (5 người cùng tĩnh tọa ≥ 10 phút) | T | 5 thô | MMO | ✓ |
| `ACT-043` | Hội thí (`MG-03`) | T | ≤ 20 thô | bậc 3 | ✓ |
| `ACT-044` | Chương Mệnh Đồ tuần | T | 20 thô (tài liệu 05 chốt) | sau Hồi I | ✓ |
| `ACT-045` | Sóc — dâng hương mùng 1 âm | Â | 15 thô | — | ✓ |
| `ACT-046` | Vọng — lễ rằm (thắp đèn, tụng chung) | Â | 15 thô | — | ✓ |
| `ACT-047` | Đình thí (`MG-03`) | Â | ≤ 40 thô; thủ khoa lần đầu +30 | bậc 4 | ✓ |
| `ACT-048` | Xem Thiên Bảng chốt kỳ (ảnh chụp mỗi Sóc) | Â | 0 | — | ✓ |
| `ACT-049` | Đổi niên chủ Thái Tuế (Lập Xuân) | M | PK theo `LAMP_REWARD`; 0 thô thêm | — | ✗ |
| `ACT-050` | Lễ tiết lớn (`EV-*`: Thượng Nguyên, Phật đản, Trung Nguyên, Trùng Cửu, Hạ Nguyên, Tết thầy…) | L | ≈ 30 thô / lễ, ≈ 240 / năm (tài liệu 10 chốt) | — | ✎ bỏ phần vận hạn |

### 5.1 `ACT-041` — lịch lễ tuần theo can chi ngày

Canon: «lễ cuối tuần ở thánh địa (giờ cố định theo can chi ngày)». Cách chọn ngày trong tuần lịch:

1. Ngày đầu tiên (thứ Hai → Chủ nhật) có **thiên can** cùng hành với đạo thống (`09-03` §4): Mộc = Giáp / Ất · Hỏa = Bính / Đinh · Thổ = Mậu / Kỷ · Kim = Canh / Tân · Thủy = Nhâm / Quý.
2. Bảy can liên tiếp luôn phủ ít nhất 4 hành; nếu tuần không có can của hành ấy → ngày có **địa chi** cùng hành; vẫn không có → **Chủ nhật**.
3. **Giờ lễ:** buổi chính giờ Dậu (17–19 giờ) theo giờ phòng máy chủ; buổi lặp sáng hôm sau giờ Thìn (7–9 giờ) cho người bận tối. Người chơi chỉ nhận thưởng **một** buổi / tuần.

Ví dụ tuần 2026-11-02 → 2026-11-08: ngày can chi lấy từ `lunar-javascript` (như `zheri-case.js`). Đội nội dung **không** viết tay lịch — module chọn ngày (chưa có — cần làm) tính và hiện trước 7 ngày trên bảng tin đạo tràng.

**Diễn tiến một lễ tuần (≈ 15 phút):** tập trung ở sân → đánh chuông (`MG-17`, người giữ vai «Chung đầu») → tụng (`MG-06` chế độ tập thể: mọi người cùng gõ một nhịp, điểm nhóm = trung bình) → MG đặc trưng của đạo (vd Võ Đang: Thái Cực tập thể `MG-04`; Văn Miếu: bình giảng một câu `MG-03` chế độ hỏi chung) → hồi hướng. Vai trong lễ: Chung đầu, Hương đăng (thắp hương), Duy na (giữ nhịp) — người giữ vai +1 công.

### 5.2 `ACT-045` / `ACT-046` — Sóc và Vọng

| Mục | Sóc (mùng 1) | Vọng (Rằm) |
|---|---|---|
| Nơi | thánh địa / phân đàn của đạo chính, hoặc chính điện Sơn Môn | như Sóc |
| Việc | dâng hương (`ACT-003` dạng lễ), tụng ngắn `MG-06`, ghi một điều nguyện cho tháng (lưu máy, không gửi) | thắp đèn, tụng chung, xem lại điều nguyện đầu tháng |
| MMO | tập trung cả máy chủ ở Sơn Môn lúc giờ Tuất; người bậc 6 làm chủ lễ (`ACT-112`) | thả đèn tập thể ở Hồ Sen (web) |
| Thưởng | 15 thô ngoài trần | 15 thô ngoài trần |
| Cửa sổ | cả ngày âm lịch đó (không bắt buộc dự giờ tập trung) | như Sóc |

---

## 6. Long Hổ Sơn (`longho` · Chính Nhất)

| Mã | Hoạt động | Nhịp | Engine | Thưởng | Điều kiện | Nhóm | iOS |
|---|---|---|---|---|---|---|---|
| `ACT-051` | Kết phù cho người làng (`MG-02`) | N | `talisman-data` (cấu trúc), ký tự hư cấu | thô `MG-02` | bậc 2 | Nghệ | ✎ Họa Văn |
| `ACT-052` | Bái Đẩu ở Đẩu Mẫu Điện (`MG-19`) | N | `talisman-data › FU_ZHENGYI_BEIDOU` | thô `MG-19` | bậc 2 | Lễ | ✎ |
| `ACT-053` | Bảng phiếu kết phù (người chơi đặt, người chơi làm) | N | `MG-02` mức Thâm; MMO | thô `MG-02`; người làm không nhận quà (`ACT-K5-CN`) | bậc 4 | Nghệ | ✎ |
| `ACT-054` | Trực đàn Thiên Sư Phủ (thay nến, quét lá, xếp kinh) | N | mới | 2 thô trong trần · 1 công | bậc 2 | Hạnh | ✓ |
| `ACT-055` | Lễ Trùng Cửu bái Đẩu tập thể (9/9 âm) | L | `MG-19` chế độ dẫn lễ | ≈ 30 thô (tài liệu 10) | — | Lễ | ✎ |
| `ACT-056` | Dạo Thượng Thanh cung, mở mục codex (`LORE-*` tài liệu 02) | 1 | — | 0 thô; mục codex | — | — | ✓ |

## 7. Võ Đang Huyền Nhạc (`vodang` · Thanh Vi · Đan Đỉnh)

| Mã | Hoạt động | Nhịp | Engine | Thưởng | Điều kiện | Nhóm | iOS |
|---|---|---|---|---|---|---|---|
| `ACT-057` | Tĩnh tọa ở Tử Tiêu cung (`MG-01`) | TD | `cultivation-data`, `DAO_JIA` | thô `MG-01` (hợp Dụng Thủy) | bậc 2 | Tĩnh | ✓ |
| `ACT-058` | Thái Cực ở quảng trường Thái Hòa (`MG-04`) | TD | `GONG_DAOYIN` | thô `MG-04` | bậc 2 | Thân | ✓ |
| `ACT-059` | Luyện đan (`MG-15`) | TD | `DAN_CANTONG_QI` | thô `MG-15`; đan | bậc 3 | Nghệ | ✓ |
| `ACT-060` | Dược phòng bốc thuốc (`MG-07`) | N | `tcm` | thô `MG-07` | bậc 2 | Học | ✓ |
| `ACT-061` | Hái thuốc trên núi (`MG-13`) | N | `tcm` | ≤ 6 thô / ngày chung | bậc 2 | Thân | ✓ |
| `ACT-062` | Thôi thủ đôi (`MG-04` chế độ đôi, MMO) | TD | `MG-04` | thô `MG-04` cho cả hai | bậc 3 | Thân | ✓ |
| `ACT-063` | Leo Kim Đỉnh (đi bộ từ chân núi tới đỉnh, không bay) | M | đường đi `world.js` | 20 thô ngoài trần (một lần / mùa) | bậc 2 | Thân | ✓ |
| `ACT-064` | Dạy Thái Cực cho đệ tử (sư đồ) | T | `MG-04` chế độ dẫn tập | 1 công / đệ tử / tuần | bậc 4, có đệ tử | Hạnh | ✓ |

## 8. Yên Tử Trúc Lâm (`yentu` · Thiền)

| Mã | Hoạt động | Nhịp | Engine | Thưởng | Điều kiện | Nhóm | iOS |
|---|---|---|---|---|---|---|---|
| `ACT-065` | Kinh hành một chặng (`MG-20`) | TD | `GAI_XIN` | thô `MG-20` | — (đường công cộng) | Thân | ✓ |
| `ACT-066` | Hành hương trọn tuyến Giải Oan → Huệ Quang → Hoa Yên → Chùa Đồng | Â | `MG-20` nhiều buổi | 20 thô ngoài trần / tháng âm | bậc 2 | Thân | ✓ |
| `ACT-067` | Công án với Thiền sư Pháp Không (`MG-11`) | N | AI persona, `checkNeo` | thô `MG-11` | bậc 2 | Tĩnh | ✎ |
| `ACT-068` | Đánh chuông Chùa Đồng (`MG-17`) | N | `MERIDIAN_CLOCK` | thô `MG-17` | bậc 2 | Lễ | ✓ |
| `ACT-069` | Trà thiền ở trà thất Yên Tử (`MG-14`) | N | `TEAS` | thô `MG-14`; NK +10 | bậc 2 | Tĩnh | ✓ |
| `ACT-070` | Lễ tưởng niệm Phật hoàng Trần Nhân Tông (ngày do cố vấn xác nhận) | L | `MG-06`, `MG-20` | ≈ 30 thô (tài liệu 10) | — | Lễ | ✓ |

## 9. Văn Miếu Quốc Tử Giám (`vanmieu` · Nho) và Thư Lâu Lâm

| Mã | Hoạt động | Nhịp | Engine | Thưởng | Điều kiện | Nhóm | iOS |
|---|---|---|---|---|---|---|---|
| `ACT-071` | **Công Quá Cách** — nhật ký tự tỉnh (ghi công, ghi quá trong ngày) | N | `remedy-fate › CONG_QUA, meritLedger`; `ZHUNTI.how` | 2 thô trong trần; giữ chuỗi; sám hối kiểu Nho (`09-03` §10.4: khôi phục 30%) | — (mở ở Văn Miếu hoặc qua Vân Cốc) | Tĩnh | ✓ |
| `ACT-072` | Lâm thiếp ở nhà bia (`MG-12`) | TD | `REMEDY_QUOTES`, `DITIANSUI_MAXIMS` | thô `MG-12` | bậc 3 | Nghệ | ✓ |
| `ACT-073` | Đặt tên cho trẻ làng (`MG-10`) | N | `naming` | thô `MG-10` · 1 công nếu `s ≥ 0,7` | bậc 3 | Học | ✓ |
| `ACT-074` | Đọc bia Tiến sĩ (mỗi bia một mục codex) | 1 / bia | tài liệu 02 (`LORE-*`) | 0 thô; bộ sưu tập | bậc 3 | — | ✓ |
| `ACT-075` | Hiếu đạo: viết thư về nhà cho cha mẹ NPC / thăm người già trong làng | T | `CONG_QUA.thien` «Hiếu thuận cha mẹ» (p 2) | 2 công | bậc 2 | Hạnh | ✓ |
| `ACT-076` | Lớp dạy chữ cho người mới | T | `MG-12` chế độ dạy | 1 công / học trò (≤ 3) | bậc 5 | Hạnh | ✓ |
| `ACT-077` | Đối chất ở cổng Văn Miếu (`MG-22`) | N | như `ACT-020` | thô `MG-22` + công | bậc 3 | Hạnh | ✓ |
| `ACT-078` | Ra đề Hương thí cho máy chủ | Â | `MG-03` chế độ ra đề | 5 thô ngoài trần | bậc 6 | Học | ✓ |

## 10. Bút Tháp (`buttap` · Tịnh Độ)

| Mã | Hoạt động | Nhịp | Engine | Thưởng | Điều kiện | Nhóm | iOS |
|---|---|---|---|---|---|---|---|
| `ACT-079` | Niệm Phật (`MG-06`) | TD | `JING_ZHOU` | thô `MG-06` | bậc 3 | Lễ | ✓ |
| `ACT-080` | Lạy sám hối (`MG-06` chế độ sám) | K (có lỗi chưa sám) | `CHAN_HUI` | khôi phục ĐH theo `09-03` §10.4; 0 thô | — | Lễ | ✓ |
| `ACT-081` | Phóng sinh ở ao chùa (`MG-21`) | N | `CONG_QUA` | thô + ≤ 3 công | bậc 3 | Hạnh | ✓ |
| `ACT-082` | Bố thí gạo cho trai đường | N | `CONG_QUA.thien` «Bố thí tiền/của» (p 2) | tiêu 30 PK → 2 công; **tối đa 1 / ngày** | bậc 3 | Hạnh | ✓ |
| `ACT-083` | Lễ Phật đản — tắm Phật | L | `MG-06` | ≈ 30 thô (tài liệu 10) | — | Lễ | ✓ |
| `ACT-084` | Vu Lan — đèn tưởng niệm (15/7) | L | `MG-16` bản tưởng niệm | ≈ 30 thô | — | Lễ | ✎ (dâng hương tưởng niệm, không đèn) |

**Ghi chú `ACT-082`:** đây là đường duy nhất đổi Phúc Khí sang công (và gián tiếp sang 2 thô ngoài trần). Phúc Khí có thể đến từ bói (E3), nên trần **1 lần / ngày** giữ lượng đổi ≤ 2 thô / ngày — không đủ để «bói lấy cảnh giới». Thiết kế giữ lại vì «xả của làm phúc» (`TEN_THIEN[6]`) là pháp tu có thật.

## 11. Chung Nam Toàn Chân (`chungnam` · Toàn Chân · Linh Bảo)

| Mã | Hoạt động | Nhịp | Engine | Thưởng | Điều kiện | Nhóm | iOS |
|---|---|---|---|---|---|---|---|
| `ACT-085` | Tảo khóa / Vãn khóa (`MG-06`) | N (hai buổi) | `DAO_JIA[0]` (Thanh Tĩnh Kinh) | thô `MG-06` mỗi buổi | bậc 4 | Lễ | ✓ |
| `ACT-086` | Quải đơn — ở nhờ đạo quán vùng khác, làm việc vặt | T | mới | 5 thô ngoài trần · 1 công | bậc 4 | Hạnh | ✓ |
| `ACT-087` | Chép Đạo Tạng (`MG-12`, câu từ `library-data` lớp `daozang`) | N | `library-data` | thô `MG-12` | bậc 4 | Nghệ | ✓ |
| `ACT-088` | Khoa nghi tập thể (lễ lớn hằng tuần của tùng lâm, ≤ 20 người) | T | `MG-06`, `MG-17` | thay `ACT-041` nếu đạo chính là TC | bậc 4 | Lễ | ✓ |
| `ACT-089` | Bảy ngày giữ giới (thử thách cá nhân: không phạm giới nào trong 7 ngày tu) | T | `09-03` §10.2 | 10 thô ngoài trần khi xong | bậc 3 | — | ✓ |

## 12. Mao Sơn Thượng Thanh (`maoshan` · Thượng Thanh · Lư Sơn)

| Mã | Hoạt động | Nhịp | Engine | Thưởng | Điều kiện | Nhóm | iOS |
|---|---|---|---|---|---|---|---|
| `ACT-090` | Tam chẩn cứu người (`MG-24`) | N | `tcm`, `fs-cure`, `amta-data` | thô + ≤ 3 công | bậc 4 (TT: 3) | Hạnh | ✎ |
| `ACT-091` | Kết phù trừ tà chính tông (`MG-02` ở Mao Sơn) | N | `talisman-data` (cấu trúc Mao Sơn 5 đoạn) | thô `MG-02` | bậc 4 | Nghệ | ✎ |
| `ACT-092` | Tuần làng: đi 4 làng quanh núi, tìm người cần giúp và vật «yểm» do Định Mệnh Hội cài | N | mới; móc `DEED-*` | 3 thô trong trần · 1 công / vật cài tìm được | bậc 4 | Thân | ✓ |
| `ACT-093` | Tồn tư đêm (`MG-01` chế độ tồn tưởng) | N | `GONG_CUNXIANG` | thô `MG-01` | bậc 4 | Tĩnh | ✓ |
| `ACT-094` | Mùa đông: dạy làng phòng ngộ độc khí than (đi từng nhà, kiểm bếp than, mở thông gió) | M (Lập Đông → Lập Xuân) | `MG-24` phần nhà | 2 thô / nhà · 1 công / nhà, ≤ 5 nhà / ngày | bậc 4 | Hạnh | ✓ |

## 13. Phong Đô Quỷ Thành (`phongdo` · Bắc Đế · Động Uyên · Địa Tạng)

| Mã | Hoạt động | Nhịp | Engine | Thưởng | Điều kiện | Nhóm | iOS |
|---|---|---|---|---|---|---|---|
| `ACT-095` | Đọc sổ nghiệp một vong (`MG-23`) | N | `YEGUO`, `CHAN_HUI`, `JING_ZHOU` | thô + trả 10 Nợ Âm nếu có | bậc 5 (BD: 4) | Hạnh | ✓ (văn khố) |
| `ACT-096` | Tự sám sổ mình (`MG-23` chế độ tự sám) | K | `09-03` §10.4 | khôi phục ĐH | bậc 5 (BD: 4) | — | ✓ |
| `ACT-097` | Trả Nợ Âm (chuỗi `TL-xx` — tài liệu 05) | K | `09-03` §10.3 | xóa Nợ Âm → danh hiệu Hồi Đầu | có Nợ Âm | Hạnh | ✓ |
| `ACT-098` | Trung Nguyên mở lối cứu người (15/7) | L | `MG-23` tập thể | ≈ 30 thô | bậc 5 | Hạnh | ✓ (văn khố) |
| `ACT-099` | Dẫn lộ: đưa một vong đã khép sổ ra cửa thành cùng Địa Tạng sứ giả | T | cảnh + `MG-20` đường hầm chậm | 5 thô ngoài trần | bậc 5 | Thân | ✓ |

## 14. Tạng Địa Tuyết Vực (`tangdia` · Mật — **chờ tham vấn**)

| Mã | Hoạt động | Nhịp | Engine | Thưởng | Điều kiện | Nhóm | iOS |
|---|---|---|---|---|---|---|---|
| `ACT-100` | Đàn cát lớn (`MG-05`) | TD | (mới) | thô `MG-05` | bậc 5 (MT: 4) | Lễ | ✓ |
| `ACT-101` | Đi nhiễu quanh tháp theo chiều kim đồng hồ (biến thể `MG-20`) | N | `GAI_XIN` | thô `MG-20` | bậc 5 | Thân | ✓ |
| `ACT-102` | Họa luân dưới mái chùa (`MG-18`) | TD | `WX_GIATRI` | thô `MG-18` | bậc 5 | Nghệ | ✓ |
| `ACT-103` | Quán tưởng (`MG-01`, lời dẫn vô thường) | TD | `MG-01` | thô `MG-01` | bậc 5 | Tĩnh | ✓ |
| `ACT-104` | Lễ hội mùa của bản (tài liệu 10) | L | — | ≈ 30 thô | bậc 5 | Lễ | ✓ |

Toàn bộ mục 14 dùng nội dung trung tính (hoa văn hình học, sen, vô thường) cho tới khi có kết quả tham vấn Tạng truyền (canon §3).

## 15. Miêu Cương Cổ Trại (`mieucuong` · Bàng môn)

| Mã | Hoạt động | Nhịp | Engine | Thưởng | Điều kiện | Nhóm | iOS |
|---|---|---|---|---|---|---|---|
| `ACT-105` | Phụ bà A Mậu bốc thuốc (`MG-07`) | N | `tcm` | thô `MG-07` (trung lập, không Tu độ) | bậc 4 | Học | ✓ |
| `ACT-106` | Hái thuốc rừng ẩm (`MG-13`) | N | `tcm` | ≤ 6 thô / ngày chung | bậc 4 | Thân | ✓ |
| `ACT-107` | Nghe chuyện xưa bên bếp lửa (một chuyện / tuần, mở codex) | T | tài liệu 02 | 0 thô | bậc 4 | — | ✓ |
| `ACT-108` | Vạch trò «cổ thuật» giả (biến thể `MG-22`: kẻ bán «bùa cổ» ở chợ phiên) | N | `anti-manipulation-data` | thô `MG-22` + công | bậc 4 | Hạnh | ✓ |
| `ACT-109` | Hang dưới cổ trại (chuỗi cốt truyện với `lo_ban_su`) | 1 | tài liệu 03 | theo `MQ-*` | Hồi III–IV | — | ✓ |

## 16. Côn Lôn Thiên Trì (`conlon` · quy nhất, bậc 6)

| Mã | Hoạt động | Nhịp | Engine | Thưởng | Điều kiện | Nhóm | iOS |
|---|---|---|---|---|---|---|---|
| `ACT-110` | Tĩnh tọa bên Thiên Trì (`MG-01` mức Viên Thông) | N | `MG-01` | thô `MG-01`; NK +3 / phút (gấp rưỡi) | bậc 6 | Tĩnh | ✓ |
| `ACT-111` | Soi Mệnh Đồ ở gương Thiên Trì | T | `gaimenh › gaimenhPlan(R)` | 0 thô; trang Mệnh Đồ cập nhật | bậc 6 | — | ✓ |
| `ACT-112` | Chủ đại lễ máy chủ (Sóc, Vọng, lễ tiết) | Â | `MG-06`, `MG-17`, `MG-19` chế độ chủ lễ | 5 công / lễ | bậc 6 | Lễ | ✓ |
| `ACT-113` | Hộ pháp kiếp Quy Nhất cho người khác (đứng bên Vân Kiều) | K | `09-02` §1.5 | 1 công | bậc 6 | Hạnh | ✓ |
| `ACT-114` | Vườn đào Dao Trì: trồng và chăm một cây đào (lớn theo mùa thật, ra hoa sau một năm can chi) | M | mới | 0 thô; cành đào tặng được | bậc 6 | Thân | ✓ |

## 17. Xã hội, MMO và hoạt động xuyên vùng

| Mã | Hoạt động | Nhịp | Engine | Thưởng | Điều kiện | Nhóm | iOS |
|---|---|---|---|---|---|---|---|
| `ACT-115` | Hộ pháp độ kiếp cho bạn | K (≤ 2 / ngày) | `09-02` §1.5 | 1 công | bậc 2 | Hạnh | ✓ |
| `ACT-116` | Mời trà người chơi khác (`MG-14`) | N | `net.js` (bồ đoàn) | 1 công / ngày cho chủ trà | — | Tĩnh | ✓ |
| `ACT-117` | Kết nghĩa kim lan (hai người chơi so lá số thật) | 1 / cặp | `hehun`, `nayin-relation` (tài liệu 10) | 0 thô | bậc 2 | — | ✓ |
| `ACT-118` | Sư phụ xem Mệnh Đồ đệ tử, giao một việc tuần | T | `gaimenh` | 2 công khi đệ tử làm xong | bậc 4, có đệ tử | Hạnh | ✓ |
| `ACT-119` | Nghe chuông chung (đứng trong 400 m khi có người đánh `MG-17`) | N | `MG-17` | +1 NK | — | — | ✓ |
| `ACT-120` | Vân du năm vùng (đi bộ / bay, ghé 5 vùng khác nhau trong một tuần, mỗi nơi một việc) | T | mới | 10 thô ngoài trần | bậc 3 | Thân | ✓ |
| `ACT-121` | Xem nhà cho khách ở Phong Thủy Viên bằng `MG-08` (khách NPC) | N | `zhai`, `xuankong`, `fs-cure` | thô `MG-08` · 1 công nếu `s ≥ 0,8` | bậc 2 | Nghệ | ✓ |
| `ACT-122` | Trạm cứu hộ động vật Huyền Thành (nhận con vật người chơi mang tới từ `MG-21`) | K | `MG-21` | xác nhận công cứu hộ | bậc 2 | Hạnh | ✓ |
| `ACT-123` | Bảy ngày chỉ tu (thử thách: 7 ngày tu không dùng hoạt động bói nào) | T | E3 | 10 thô ngoài trần · thành tựu «Mệnh do ta tạo» | bậc 2 | — | ✗ (iOS vốn không có bói) |
| `ACT-124` | Thư gửi chính mình năm sau (viết lúc Lập Xuân, mở lúc Lập Xuân năm sau) | M | mới (lưu máy) | 0 thô; khi mở thư: 5 thô ngoài trần | bậc 1 | — | ✓ |
| `ACT-125` | Đọc mục Thư Viện Huyền Học (bộ sưu tập thẻ) | TD | `library-data › LIBRARY`, `LAYERS`, `countByLayer` | 0 thô; mỗi 10 thẻ mới +1 thô ngoài trần (≤ 3 / ngày) | — | Học | ✎ (ẩn lớp `fu`, `mantra` nếu App Review yêu cầu) |

---

## 18. Tổng hợp theo nhịp

| Nhịp | Số hoạt động | Mã tiêu biểu |
|---|---|---|
| Ngày (N) | 60 | `ACT-001`, `011`, `016`, `029`, `051`, `060`, `067`, `071`, `090`, `095` |
| Tuần (T) | 19 | `ACT-014`, `030`, `041`–`044`, `064`, `075`, `086`, `088`, `120` |
| Tháng âm (Â) | 7 | `ACT-045`–`048`, `066`, `078`, `112` |
| Mùa (M) | 5 | `ACT-049`, `063`, `094`, `114`, `124` |
| Lễ (L) | 8 | `ACT-039`, `050`, `055`, `070`, `083`, `084`, `098`, `104` |
| Một lần (1) | 5 | `ACT-002`, `056`, `074`, `109`, `117` |
| Tự do (TD) | 15 | `ACT-008`, `009`, `019`, `032`, `057`… |
| Khi có (K) | 6 | `ACT-080`, `096`, `097`, `113`, `115`, `122` |
| **Tổng** | **125** | |

(Một số hoạt động thuộc hai nhịp, vd `ACT-004` thêm dầu theo ngày và thắp mới theo mùa; bảng đếm theo nhịp ghi đầu tiên.)

## 19. Tổng hợp theo vùng

| Vùng | Số `ACT` | Bậc mở hoạt động đầu tiên |
|---|---|---|
| `thanh` (gồm `ACT-025` Hợp Hôn) | 21 | 1 |
| 6 vùng sảnh nghề còn lại (`ACT-021`–`030` trừ `025`) | 9 | 1 |
| phân đàn ở vùng cũ (`trichthien`, `cungthong`, `thulau`) | 6 | 1–2 |
| `vancoc` | 4 | 1 (theo Hồi I) |
| định kỳ chung (mọi thánh địa / phân đàn) | 10 | 1–4 |
| `longho` | 6 | 2 |
| `vodang` | 8 | 2 |
| `yentu` | 6 | 1 (đường công cộng) |
| `vanmieu` | 8 | 2–3 |
| `buttap` | 6 | 3 |
| `chungnam` | 5 | 3–4 |
| `maoshan` | 5 | 4 |
| `phongdo` | 5 | 4–5 |
| `tangdia` | 5 | 5 |
| `mieucuong` | 5 | 4 |
| `conlon` | 5 | 6 |
| xuyên vùng | 11 | 1–4 |
| **Tổng** | **125** | |

## 20. Spec chi tiết các hoạt động mới (không phải MG)

Các hoạt động có cơ chế riêng ngoài MG cần spec ngắn. Hoạt động đã đặc tả ở nơi khác: `ACT-011` (`09-09` §3), `ACT-041`, `ACT-045`, `ACT-046` (§5 trên), độ kiếp (`09-02`).

### 20.1 `ACT-014` · Bố trí nhà riêng

| Mục | Nội dung |
|---|---|
| Mục đích | nhà riêng (tài liệu 08) là chỗ áp dụng thật bài học Dương trạch; chấm lại mỗi tuần vì sao bay năm (`xuankong › yearFlyingStar`) và đồ đạc đổi |
| Luật | mở `MG-08` ở chế độ «nhà mình»: chủ nhà = nhân vật (`zhai › computeZhai(năm sinh, giới)`), đồ đạc = mô-đun người chơi đã đặt (tài liệu 08 `MOD-*`). Lần chấm đầu trong tuần lịch tính thô; các lần sau chỉ xem gợi ý |
| Thưởng | thô `MG-08` trong trần; `s ≥ 0,8` → nhà đạt «Nhà yên» tới khi đồ đạc đổi hoặc sang năm: mỗi sáng sau nghỉ đêm (`ACT-015`) nhận thêm một chén trà miễn phí (+5 NK, không tính vào trần hồi chủ động 150) |
| Chống lạm dụng | không chấm lại nhà để lấy thô nhiều lần trong tuần |
| iOS | ✓ (mệnh quái của nhân vật là kiến thức không gian, không dự đoán vận) |
| Đo lường | `home_score` (`s, stars_ok, sha_found, sha_fixed_by (layout/item)`) |

### 20.2 `ACT-015` · Nghỉ đêm ở tĩnh thất

| Mục | Nội dung |
|---|---|
| Luật | tương tác giường trong nhà riêng sau 18:00 giờ tài khoản → màn tối 5 giây, NK đặt về 100; một lần / ngày; cách lần trước ≥ 6 giờ thực |
| Người chưa có nhà | dùng phòng khách tăng ở Sơn Môn (cùng hiệu quả) — tránh khóa hồi phục sau tính năng nhà |
| Cảnh | lần đầu: LÃO TÙNG «Ngủ đi. Mai quán vẫn mở.» |
| iOS | ✓ |
| Đo lường | `rest_night` (`nk_before, hour`) |

### 20.3 `ACT-016` · Một bữa chay ở trai đường

| Mục | Nội dung |
|---|---|
| Nguồn | `remedy-fate › CONG_QUA.thien` «Ăn chay 1 ngày» (p 1); `REMEDY_METHODS[2]` «giảm sát» |
| Luật | ngồi vào bàn trai đường Sơn Môn (hoặc Bút Tháp, Chung Nam, Yên Tử), chọn một mâm (không có món thịt cá). Cảnh ăn 30 giây; có thể ngồi cùng người chơi khác (MMO: bàn 8 chỗ) |
| Thưởng | +15 NK (× hệ số dưỡng sinh `09-09` §5.2), 1 công / ngày |
| Lưu ý văn hóa | lời giới thiệu không chê người ăn mặn ngoài đời; chỉ nói «một bữa chay là một lần bớt sát» |
| iOS | ✓ |

### 20.4 `ACT-017` · Khách gõ cửa nhà riêng

| Mục | Nội dung |
|---|---|
| Luật | 50% số ngày (hạt giống theo ngày), một NPC khách đến nhà: xin chọn ngày (`MG-09`) hoặc đặt tên con (`MG-10`). Khách đợi tới hết ngày |
| Thưởng | thô của MG; 1 công nếu `s ≥ 0,7` («Giúp người khó khăn» thuộc `CONG_QUA.thien` — tài liệu 05 chốt điểm) |
| Ý nghĩa | nhà riêng thành nơi người khác tìm đến — cảm giác «đã thành thầy» từ bậc 2 |
| iOS | ✓ |

### 20.5 `ACT-030` · Chọn ngày cho lễ môn phái

| Mục | Nội dung |
|---|---|
| Luật | đầu tuần, môn phái (tài liệu 10) cần ngày cho một lễ đặc biệt (khánh thành gian mới, lễ nhập môn tập thể). Mỗi thành viên bậc ≥ 2 đề cử một ngày bằng `MG-09`; ngày có điểm `evaluateDate` cao nhất được chọn |
| Thưởng | thô `MG-09`; người đề cử ngày được chọn nhận danh dự «Người chọn ngày» trong bảng tin môn phái |
| Chống lạm dụng | mỗi người một đề cử / tuần |
| iOS | ✓ |

### 20.6 `ACT-034` · Quan sao đêm trên Trích Thiên Đỉnh

| Mục | Nội dung |
|---|---|
| Luật | từ giờ Tuất tới giờ Dần, lên đỉnh, mở ống nhòm đồng: tìm Bắc Đẩu trên bầu trời thật của game, xác định mùa theo chuôi Đẩu (phần trời sao của `MG-19`) |
| Thưởng | 2 thô trong trần; nhóm Lễ |
| Liên kết | phân đàn Thượng Thanh; luyện cho `ACT-K3-TT` |
| iOS | ✓ (thiên văn, không bản mệnh) |

### 20.7 `ACT-054` · Trực đàn Thiên Sư Phủ

| Mục | Nội dung |
|---|---|
| Luật | danh sách 3 việc ngẫu nhiên trong 6: thay nến bảy đèn, quét lá sân, xếp lại giá kinh, lau bàn đàn, đổ nước bể, thắp hương cửa. Mỗi việc là một thao tác ngắn (≤ 30 giây) ở vị trí thật trong Phủ |
| Thưởng | 2 thô trong trần + 1 công |
| Ý nghĩa | việc phục vụ không cần giỏi — chỉ cần làm |
| iOS | ✓ |

### 20.8 `ACT-063` · Leo Kim Đỉnh

| Mục | Nội dung |
|---|---|
| Luật | từ cổng núi Võ Đang đi bộ lên Kim Đỉnh (bản đồ: đường đá ≈ 1,6 km, cao ≈ 220 m), không ngự vật (bay bị tắt trên tuyến khi đã bấm «Leo núi»). Trạm nghỉ 3 chỗ (uống nước, nhìn xa) |
| Thưởng | 20 thô ngoài trần, một lần / mùa; ảnh chụp ở đỉnh vào Sổ Tu |
| Trợ năng | chế độ «leo tự động» cho người giảm vận động — vẫn tính |
| iOS | ✓ |

### 20.9 `ACT-066` · Hành hương trọn tuyến Yên Tử

| Mục | Nội dung |
|---|---|
| Luật | đi đủ 4 chặng `MG-20` (Giải Oan → Huệ Quang → Hoa Yên → Chùa Đồng) trong một tháng âm; tiến độ giữ giữa các buổi (`09-07` MG-20 §2.3) |
| Thưởng | 20 thô ngoài trần / tháng âm; dấu triện từng chùa vào «Sổ hành hương» |
| Lễ | tháng Giêng âm (mùa hội Yên Tử ngoài đời) có thêm khách hành hương NPC đông đúc trên tuyến |
| iOS | ✓ |

### 20.10 `ACT-075` · Hiếu đạo

| Mục | Nội dung |
|---|---|
| Luật | mỗi tuần một trong hai: viết thư về nhà (ô chữ ngắn, lưu máy, gửi cho cha mẹ **NPC** của nhân vật — hồ sơ trong Sổ Mệnh có nhãn «Cha», «Mẹ» thì dùng tên đó) hoặc thăm một cụ già trong làng (cảnh ngồi trò chuyện 2 phút) |
| Thưởng | 2 công (`CONG_QUA.thien` «Hiếu thuận cha mẹ», p 2) |
| Riêng tư | thư không gửi lên máy chủ |
| Gợi ý ngoài đời | sau khi viết thư, Sổ Tu hỏi nhẹ: «Hôm nay con có gọi cho nhà không?» (một lần / tuần, tắt được) |
| iOS | ✓ |

### 20.11 `ACT-082` · Bố thí gạo

Đã ghi chú ở §10. Thêm: món bố thí đổi theo mùa (gạo, áo ấm mùa Đông, sách vở đầu năm học tháng 8 dương). Không có bảng xếp hạng người bố thí nhiều (tránh «khoe công»; `TEN_THIEN` đề cao «làm thiện ẩn»).

### 20.12 `ACT-086` · Quải đơn

| Mục | Nội dung |
|---|---|
| Luật | tới một đạo quán / chùa **không phải** của đạo chính, xin ở nhờ một đêm (cảnh), sáng làm một việc vặt (`ACT-054` dạng địa phương), rồi đi |
| Thưởng | 5 thô ngoài trần + 1 công / tuần |
| Ý nghĩa | Toàn Chân trọng vân du; người tu học đạo khác bằng cách sống cùng họ một đêm |
| iOS | ✓ |

### 20.13 `ACT-089` · Bảy ngày giữ giới

| Mục | Nội dung |
|---|---|
| Luật | người chơi bấm «Giữ giới bảy ngày». Trong 7 ngày tu kế tiếp, không phát sinh lỗi nào ở `09-03` §10.2; bảng nhỏ trong Sổ Tu đếm ngày |
| Thưởng | 10 thô ngoài trần khi xong; thất bại không bị trừ gì thêm ngoài lỗi đã phạm |
| iOS | ✓ |

### 20.14 `ACT-092` · Tuần làng (Mao Sơn)

| Mục | Nội dung |
|---|---|
| Luật | đi qua 4 làng quanh Mao Sơn (đường mòn có sẵn); mỗi làng có 0–2 «điểm cần giúp» (người ốm, nhà dột, trẻ lạc) và 0–1 «vật cài» của Định Mệnh Hội (bùa giấy giấu ở gốc cây, hình nhân dưới thềm). Thần thức sơ khai (bậc 2) làm điểm cần giúp sáng nhẹ trong 15 m; vật cài **không** sáng — phải nhìn |
| Thưởng | 3 thô trong trần; 1 công / vật cài tìm được (≤ 2 / ngày); điểm cần giúp mở `DEED-*` (tài liệu 05) |
| Câu chuyện | vật cài tìm được đếm vào chuỗi điều tra Lỗ Ban (tài liệu 03) |
| iOS | ✓ («vật cài» gọi là «đồ lừa đảo») |

### 20.15 `ACT-094` · Mùa đông phòng khí than

| Mục | Nội dung |
|---|---|
| Thời gian | Lập Đông → Lập Xuân (2027: 7/11/2027 → 4/2/2028) |
| Luật | đi từng nhà ở làng Mao Sơn và Huyền Thành, kiểm bếp than / lò sưởi trong phòng ngủ (phần «nhà» của `MG-24`), hướng dẫn mở thông gió, đưa nguồn đốt ra khỏi phòng ngủ |
| Thưởng | 2 thô + 1 công / nhà, ≤ 5 nhà / ngày |
| An toàn | nội dung do chuyên gia an toàn rà (`09-11` §11); thẻ cuối hiện thông tin chung về dấu hiệu ngộ độc khí CO và khuyên gọi cấp cứu |
| iOS | ✓ |

### 20.16 `ACT-099` · Dẫn lộ

| Mục | Nội dung |
|---|---|
| Luật | sau khi một sổ vong được khép (`MG-23`), người chơi đi cùng Địa Tạng sứ giả và vong qua đường hầm đèn tới cửa thành (≈ 3 phút đi chậm, cơ chế bước của `MG-20` không có vọng niệm) |
| Thưởng | 5 thô ngoài trần / tuần |
| Không khí | đèn lồng sáng dần; ở cửa, vong cúi chào và tan thành ánh sáng (chế độ văn khố: di vật được trao lại cho con cháu) |
| iOS | văn khố |

### 20.17 `ACT-111` · Soi Mệnh Đồ ở gương Thiên Trì

| Mục | Nội dung |
|---|---|
| Nguồn | `gaimenh › gaimenhPlan(R)` — sáu tầng Không gian → Tên → Thời → Thái Tuế → Làm công → Tích âm đức (canon §6) |
| Luật | đứng bên Thiên Trì, mặt nước hiện sáu tầng: mỗi tầng có thanh tiến độ (do tài liệu 05 đo) và một câu gợi ý tuần |
| Thưởng | 0 thô; dùng để đặt mục tiêu tuần và theo dõi đệ tử (`ACT-118`) |
| iOS | ✓ (tầng Thái Tuế hiện dạng «nhịp năm» — `09-11` §5) |

### 20.18 `ACT-114` · Vườn đào Dao Trì

| Mục | Nội dung |
|---|---|
| Luật | người bậc 6 nhận một gốc đào non ở vườn Dao Trì; chăm (tưới, tỉa) tối đa một lần / ngày; cây lớn theo **mùa thật**: nụ từ Lập Xuân, hoa quanh Xuân Phân, lá xanh mùa Hạ, rụng lá mùa Đông. Sau một năm can chi trọn vẹn cây ra hoa lần đầu |
| Thưởng | 0 thô; cành đào tặng người khác được (một cành / tuần) — vật phẩm trang trí nhà riêng |
| Ý nghĩa | ở đỉnh cao nhất, việc còn lại là chờ một cái cây lớn |
| iOS | ✓ |

### 20.19 `ACT-118` · Sư phụ giao việc tuần

| Mục | Nội dung |
|---|---|
| Luật | sư phụ (bậc ≥ 4) xem Mệnh Đồ của đệ tử (`ACT-111` hoặc Sổ Tu) và chọn **một** việc tuần cho đệ tử từ danh sách gợi ý (theo tầng Mệnh Đồ chậm nhất). Đệ tử làm xong trong tuần |
| Thưởng | đệ tử: thưởng của hoạt động đó; sư phụ: 2 công khi đệ tử xong (canon §10: «đệ tử hoàn thành Mệnh Đồ thì sư phụ nhận công» — đây là bản nhỏ theo tuần) |
| Chống lạm dụng | sư phụ không nhận công nếu đệ tử là tài khoản < 14 ngày tu (chống tài khoản phụ) |
| iOS | ✓ |

### 20.20 `ACT-120` · Vân du năm vùng

| Mục | Nội dung |
|---|---|
| Luật | trong tuần lịch, có mặt ở 5 vùng khác nhau và làm ở mỗi vùng ít nhất một hoạt động có thưởng |
| Thưởng | 10 thô ngoài trần (tính vào trần tuần 60) |
| Ý nghĩa | kéo người chơi ra khỏi «một góc quen» |
| iOS | ✓ |

### 20.21 `ACT-122` · Trạm cứu hộ động vật

| Mục | Nội dung |
|---|---|
| Luật | nơi nhận con vật bị thương từ `MG-21` (chim, rùa); NPC nhân viên trạm cảm ơn, ghi sổ; sau 3 ngày thật, người chơi nhận thư «con chim đã bay đi» (hoặc «con rùa đã về trung tâm bảo tồn») |
| Thưởng | xác nhận công của `MG-21` (công chỉ chốt khi giao trạm) |
| iOS | ✓ |

### 20.22 `ACT-123` · Bảy ngày chỉ tu

| Mục | Nội dung |
|---|---|
| Luật | 7 ngày tu liên tiếp (theo chuỗi mềm) không mở `ACT-007`, `ACT-008`, `ACT-009` |
| Thưởng | 10 thô ngoài trần; thành tựu «Mệnh do ta tạo» (lần đầu) |
| Ý nghĩa | thử thách nhẹ nhàng đúng trụ cột T2; không phạt bói — chỉ thưởng người thử không bói |
| iOS | tự động đạt mỗi 7 ngày tu (`09-11` §3.2) |

### 20.23 `ACT-124` · Thư gửi chính mình năm sau

| Mục | Nội dung |
|---|---|
| Luật | từ Lập Xuân tới hết tiết Vũ Thủy, viết một thư (≤ 500 ký tự, lưu máy). Thư khóa tới Lập Xuân năm sau; khi mở, Sổ Tu hiện thư cùng ĐH năm qua, bậc khi viết và bậc hiện tại |
| Thưởng | 5 thô ngoài trần khi mở |
| Riêng tư | không gửi máy chủ; mất máy là mất thư (ghi rõ khi viết) |
| iOS | ✓ |

### 20.24 `ACT-125` · Thư Viện Huyền Học

| Mục | Nội dung |
|---|---|
| Nguồn | `library-data › LIBRARY` (lớp `daozang`, `fu`, `mantra`, `ritual`, `cultivation`, `phuongthuat`, `bitruyen`, `classic` — `LAYERS`), `countByLayer` |
| Luật | mỗi mục là một thẻ đọc được trong Thư Lâu; thẻ hiện `name_han`, `name_vi`, `meaning`, `sources`, `textual_certainty`. Bộ sưu tập theo lớp |
| Thưởng | mỗi 10 thẻ mới đọc (đọc ≥ 20 giây / thẻ) +1 thô ngoài trần, ≤ 3 / ngày |
| An toàn | lớp `fu` chỉ hiện **cấu trúc** (đúng chủ ý app: phù «không vẽ được»); lớp `mantra` hiện bối cảnh, không phiên âm dài |
| iOS | ✎ ẩn lớp `fu`, `mantra` nếu App Review yêu cầu |

---

## 21. Nghiệm thu danh mục

- [ ] Mỗi `ACT` có trong một tệp dữ liệu (`id, region, cadence, engine, reward, prereq, group, ios`), UI đọc từ dữ liệu.
- [ ] Không hoạt động bói nào (`ACT-007`, `008`, `009`) cho thô.
- [ ] `ACT-082` trần 1 / ngày; `ACT-116`, `ACT-115` không tự hộ / tự mời bằng tài khoản phụ (`09-03` §12).
- [ ] Lịch `ACT-041` tính tự động theo can chi; hiện trước 7 ngày.
- [ ] Mọi hoạt động ✗ trên iOS không có lối vào; mọi hoạt động ✎ có nội dung thay thế.
- [ ] Hoạt động có công đều đi qua Sổ Công Quá (tài liệu 05) — không cộng công ở chỗ khác.
