# 12 · Trình bày — Phần 17: Sản xuất, lộ trình và nghiệm thu

> Gom khối lượng tài sản trình bày, chia theo các mốc M0–M6 của bản tổng (§13.4), vai trò, quy trình duyệt, ma trận thiết bị kiểm thử, chỉ số theo dõi và rủi ro trình bày (đề xuất cho tài liệu 14).

---

## 1. Khối lượng tài sản

| Hạng mục | Số lượng | Nguồn đặc tả |
|---|---|---|
| Màn / thành phần giao diện | 94 mục UI (UI-01 → UI-99, có khoảng trống để chèn) + UI-40b | phần 02–06 |
| Biểu tượng Huyền Ấn (SVG) | ≈ 64 lõi + ≈ 40 vật phẩm Tàng Y Các | phần 07 §4 |
| Phông | 4 họ (Be Vietnam Pro, Noto Serif, Noto Serif TC / SC, LXGW WenKai TC) | phần 07 §1 |
| Token thiết kế | ≈ 70 (màu, cỡ chữ, khoảng cách, bo, độ nổi, thời lượng, đường cong) | phần 07 |
| Bảng màu ngũ hành | 4 bộ × 3 tầng (vải, giao diện, phát sáng) | phần 07 §2.5, phần 14 §2 |
| Màu đạo thống | 14 | phần 07 §2.4 |
| Preset camera | 12 `cam.*` + 7 bối cảnh ngoài trời + luật trong nhà | phần 08 |
| Chủ đề nhạc | 21 vùng + 6 chủ đề màn hình | phần 09 |
| Bản phối nhạc | 105 vùng × khung + 2 biến thể + 9 điện + 13 màn + 9 mini-game + 1 bầu trời + 7 lễ + 9 stinger ≈ **155 bản** | phần 09 §6.1 |
| Phút nhạc | ≈ 480 phút (gồm stem) | — |
| SFX | ≈ 466 mã, ≈ 1.320 tệp | phần 10 §15 |
| VO | ≈ 3.490 câu (ngân sách thu 4.200), ≈ 220 phút | phần 11 §1.4 |
| IR vang | 9 vùng vang | phần 11 §2.6 |
| Hiệu ứng hình | ≈ 75 khóa `fx.*` | phần 12 |
| LUT màu vùng | 21 | phần 12 §6.3, phần 16 |
| Chuỗi giao diện | ước ≈ 2.500 khóa `ui.*` (chưa kể thoại) | phần 13 |
| Mục từ điển thuật ngữ | ≈ 300 (lõi 70 ở phần 13 §5) | phần 13 |
| Ảnh màn tải / nền cổng | 21 vùng + 7 lễ | phần 16 |

---

## 2. Lộ trình theo mốc

Khớp các mốc của bản tổng §13.4. «Phải có» = chặn mốc; «Nên có» = làm nếu kịp.

### M0 (2 tuần) — Mệnh Bàn, persona AI, mở đầu mới

| Phải có | Nên có |
|---|---|
| UI-05 Lộ căn cốt; UI-07 Chấp thuận dữ liệu | UI-17 La bàn hướng |
| UI-21 Mệnh Bàn (bản SVG tĩnh + bảng thay thế); UI-22 «Vì sao?» | phông Be Vietnam Pro |
| UI-41 persona trong giao diện (tiêu đề, câu chờ, viền màu đạo thống); hạn mức lượt hỏi; UI-42 | UI-40b lịch sử thoại |
| UI-40 hội thoại kịch bản (khung, lựa chọn, ⚠ nghiệp) | chữ gõ dần + âm gõ chữ |
| sửa nhãn «Hỷ thần» ở UI-04 (lỗi `secondary` / `xi`) | dòng Hán Việt dưới chữ trụ |
| UI-15 hộp xác nhận z 80 thay `confirm()`; nút «‹ quay lại» | ngăn phải máy tính |
| token màu sửa tương phản (`--hq-note`, `-text`); vùng chạm 44 px | tách `.hq-tabs--line` / `--pill` |
| UI-75 nút ⚙ + trang Âm thanh / Đồ họa / Trợ năng cơ bản (cỡ chữ, giảm chuyển động, rung) | — |
| checklist trợ năng mức CB (phần 14 §10) | — |

### M1 (4 tuần) — Sổ Công Quá, Mệnh Đồ, máy nhiệm vụ, Hồi I, nội thất Sơn Môn

| Phải có | Nên có |
|---|---|
| UI-20 Sổ Mệnh thẻ mới; UI-27/28 Mệnh Đồ; UI-29 Sổ Công Quá; UI-31 | UI-30 Sổ đời thực |
| UI-16 theo dõi nhiệm vụ; UI-43/44 Sổ Nhiệm Vụ; dock mới (📋 🗺 💬 👘 📜) | UI-46 bản đồ nhỏ |
| UI-32 Cảnh giới; UI-33 đột phá (bản đơn giản) | `cam.ascend` đầy đủ |
| âm thanh: cây bus, `SFX-UI-*`, `SFX-FOOT-01x/02x/03x`, `SFX-BELL-*` lõi, `SFX-RITE-*` lõi, chuông canh | phụ đề âm thanh |
| nhạc: `BGM-SONMON-*`, `BGM-THANH-*`, `BGM-GATE-01`, `BGM-RITE-01`, `BGM-VANCOC-*` | `BGM-MENHDO-01` |
| VO hạng A: Thầy Tử Bình, Vân Cốc, Lão Tùng (cảnh Hồi I) | VO Khổng tiên sinh |
| camera trong nhà (phần 08 §3) cho nội thất Sơn Môn; va chạm camera (§2.2) | mái mờ công trình tại chỗ |
| Huyền Ấn thay emoji ở dock, HUD, nút hành động | — |
| UI-72 phòng thử Tàng Y Các | — |

### M2 (6 tuần) — Long Hổ, Võ Đang, Bút Tháp + Hồi II

| Phải có | Nên có |
|---|---|
| UI-45 bản đồ Huyền Giới; UI-47 trạm (xe, đò, hạc) | lớp «Người» trên bản đồ |
| UI-81 tĩnh tọa; UI-82 kết phù; UI-92 sám hối; UI-94 phóng sinh | UI-93 bái Đẩu |
| UI-65 môn phái (sảnh, thứ bậc) | UI-66 đạo tràng |
| nhạc 3 vùng × 5 khung; `BGM-INT-CHUA`; `BGM-MG-TINHTOA/KETPHU/SAMHOI` | — |
| SFX vùng: `SFX-AMB-019…022`, `-029/-030`; bước chân đá đỏ, bậc rêu, gạch vồ, tre | — |
| VO hạng B: Trương Thiên Sư, Huyền Hư, Đan Đỉnh, Diệu Âm | — |
| thẻ trình bày 3 vùng (phần 16 §10, §11, §15) + `cam.reveal` | god rays |
| bảng mù màu Đỏ – lục và Lam – vàng | Đơn sắc |

### M3 (6 tuần) — Yên Tử, Văn Miếu, Mao Sơn, Chung Nam + cảnh giới + Định Mệnh Hội

| Phải có | Nên có |
|---|---|
| UI-83 khoa cử; UI-84 đặt tên; UI-87 công án; UI-89 đối chiếu; UI-90 cứu người; UI-96 hành hương | — |
| UI-34 Thiên Bảng; UI-36 thành tựu nhóm mới | — |
| nhạc 4 vùng; `BGM-EV-*` lễ thuộc 4 vùng | — |
| VO hạng B còn lại của 4 vùng; `SFX-VOX-*` | — |
| phụ đề âm thanh; chỉ báo âm thanh hướng | — |
| thử trợ năng vòng 2 (người thật) | — |

### M4 (6 tuần) — Hồi III, IV: Tà Lộ, Phong Đô, Miêu Cương

| Phải có | Nên có |
|---|---|
| UI-79 cổng âm tà; UI-37 Nợ Âm; chip HUD Nợ Âm; luồng 7 (phần 15) | — |
| UI-91 y dược | — |
| nhạc Phong Đô (+ lớp hy vọng), Miêu Cương (+ hang); thu âm nghệ sĩ người Miêu | — |
| VO Lỗ Ban (hạng A), Phán quan, Vu y bà, Địa Tạng sứ giả | — |
| thẻ cảnh báo nội dung vùng nặng; duyệt nội dung nhạy cảm (tài liệu 14) | — |

### M5 (4 tuần) — Tạng Địa (sau tham vấn), Côn Lôn, Vĩ thanh, sự kiện máy chủ

| Phải có | Nên có |
|---|---|
| UI-88 mạn-đà-la; UI-96 bánh xe kinh (sau tham vấn) | — |
| nhạc Côn Lôn (lớp theo đạo thống đã tu); `BGM-CREDITS`; Tạng (bản thật nếu tham vấn xong) | — |
| UI-99 trình phát cảnh cắt hoàn chỉnh; UI-98 chụp ảnh | bộ lọc thủy mặc |
| bản địa hóa: tách chuỗi 100%, giả bản địa hóa đạt | bản tiếng Anh thử nghiệm (an toàn đã duyệt) |
| checklist trợ năng NC | — |

### M6 — Môn phái, sư đồ, mùa đầu tiên

| Phải có |
|---|
| UI-66 đạo tràng; UI-67 sư đồ; UI-68 hợp hôn / kết nghĩa; UI-69 lịch; UI-70 hộp thư; UI-74 Đạo Lộ mùa |
| kiểm tải 60 người / phòng với hiệu ứng và âm (phần 11 §5, phần 12 §8) |

---

## 3. Vai trò

| Vai trò | Phụ trách trong tài liệu này |
|---|---|
| Thiết kế UX | phần 01–06, 15; câu chữ cùng biên tập |
| Họa sĩ giao diện | phần 07 (Huyền Ấn, thành phần), màn tải, phần 16 hình |
| Nghệ sĩ kỹ thuật (tech art) | phần 08 camera, phần 12 VFX, LUT, ngân sách hiệu năng |
| Nhà soạn nhạc + điều phối nhạc công | phần 09 |
| Thiết kế âm thanh | phần 10, 11 §2–§5 |
| Đạo diễn lồng tiếng | phần 11 §1 |
| Phụ trách trợ năng | phần 14, tham gia duyệt mọi màn |
| Bản địa hóa | phần 13 |
| Pháp lý / bản quyền | phần 11 §6, UI-07, UI-73, UI-78 |
| Cố vấn truyền thống (Đạo, Phật Việt, Tịnh Độ, Nho, Tạng, Miêu) | duyệt chủ đề nhạc, biển chữ Hán, nghi thức trình bày, câu tụng |

---

## 4. Quy trình duyệt một màn / một tài sản

```
Bản phác (wireframe ASCII / Figma)
   └─▶ Duyệt UX (đủ 8 ô trạng thái, câu chữ, luồng)
         └─▶ Duyệt trợ năng (phần 14 checklist mức của mốc)
               └─▶ Duyệt văn hóa (nếu có yếu tố tôn giáo / dân tộc)
                     └─▶ Dựng
                           └─▶ Kiểm thử thiết bị (§5) + đo lường đã phát đúng (phần 01 §7)
                                 └─▶ Nghiệm thu (tiêu chí trong mục UI-xx)
```

Tài sản âm thanh: thêm bước «ghi sổ bản quyền» (phần 11 §6.5) trước khi dựng.

---

## 5. Ma trận thiết bị kiểm thử

| Nhóm | Thiết bị / trình duyệt | Kích thước | Ưu tiên |
|---|---|---|---|
| iPhone tầm trung | iPhone 12 / 13, Safari iOS 17–18 | 390 × 844 | P0 (chuẩn thiết kế) |
| iPhone nhỏ | iPhone SE (2022) | 375 × 667 | P0 (kiểm chật) |
| iPhone lớn | iPhone 15 Pro Max | 430 × 932 | P1 |
| Android tầm trung | Snapdragon 7-series, Chrome | 393 × 873 | P0 |
| Android yếu | Helio G-series 4 GB RAM, Chrome | 360 × 800 | P0 (hiệu năng, 2D) |
| Máy tính bảng | iPad 10, Safari | 820 × 1180 | P1 |
| Máy tính | Windows 11 Chrome / Edge / Firefox; macOS Safari | 1440 × 900, 1920 × 1080 | P0 |
| Máy tính yếu | Intel Iris Xe | 1366 × 768 | P1 |
| Vỏ native | bản iOS (Capacitor), bản Android | — | P0 (rung native, khóa dọc, công tắc im lặng) |
| Trình đọc màn hình | VoiceOver (iOS, macOS), TalkBack, NVDA | — | P0 từ M0 |

---

## 6. Chỉ số theo dõi (trình bày)

| Chỉ số | Mục tiêu | Liên quan |
|---|---|---|
| Thời gian từ mở game tới vào cảnh (p75, 4G) | ≤ 8 s | UI-01 |
| Tỉ lệ hoàn thành mẫu bát tự (người đã thấy UI-03) | ≥ 85% | UI-03 |
| Tỉ lệ bấm «Vì sao?» trong 7 ngày đầu | ≥ 40% | P1, UI-22 |
| Tỉ lệ mở Mệnh Đồ và xong ≥ 1 tầng trong tuần đầu | ≥ 60% (bản tổng §13.5) | UI-27 |
| Giữ chân 7 ngày nhóm lá số < 36 so với nhóm cao | không thấp hơn (bản tổng §13.5) | UI-05 câu dẫn, P2 |
| Neo trung bình thoại AI | ≥ 90 (bản tổng §13.5) | UI-41 |
| Tỉ lệ bật âm thanh | theo dõi (kỳ vọng ≥ 35% trên web) | phần 09–11 |
| Tỉ lệ dùng ít nhất một tùy chọn trợ năng | theo dõi | UI-76 |
| Tỉ lệ máy tự hạ chất lượng (`lowQuality`) | ≤ 15% phiên | phần 12 §8 |
| Tỉ lệ bỏ giữa mini-game (`ui_mg_quit` / `ui_mg_start`) | ≤ 25% | UI-80 |
| Tỉ lệ bỏ qua cảnh cắt lần đầu | theo dõi; > 50% → cảnh quá dài | UI-99 |

---

## 7. Rủi ro trình bày (đề xuất để tài liệu 14 cấp mã `RISK-xx`)

| Rủi ro | Ảnh hưởng | Giảm thiểu |
|---|---|---|
| Phông chữ Hán quá nặng trên mạng di động | tải chậm, chữ «tofu» | tập con + lát `unicode-range` (phần 07 §1.6), kiểm `document.fonts.check` |
| Nhạc 6 kênh không phát được trên một số Safari | mất thích ứng nhạc | bản trộn sẵn stereo dự phòng (phần 11 §4.3) |
| Tạng Địa chưa có cố vấn tới M5 | thiếu nhạc / VO / biển | bản tạm trung tính đã đặc tả (phần 09 §3.16, phần 16 §16) |
| Câu engine dài khó dịch | chậm mở tiếng Anh | hiện nguyên văn + dịch máy có nhãn; tách mẫu câu engine (phần 13 §6) |
| Hiệu ứng trang phục làm rối sân đông người | giảm fps, ồn | giới hạn số người có hiệu ứng đầy đủ (phần 12 §8.2), âm trang phục ≤ 3 nguồn (phần 10 §12) |
| Người chơi lá số thấp vẫn thấy bị phán xét | rời game, trái T2 | câu dẫn bắt buộc, không đỏ, đo giữ chân theo nhóm (§6) |
| Chữ Hán lẫn giản / phồn trong chuỗi engine | trông «lỗi», từ điển không nhận | hiển thị nguyên văn, từ điển hai dạng (UI-22) |
| Bốn bộ màu ngũ hành song song trong code | lệch màu giữa UI và 3D | gom `wx-palette.js` (phần 07 §2.5) |
| Emoji hiển thị khác nhau / thiếu | sai văn hóa (⛩), ô trống | Huyền Ấn (phần 07 §4) |
| Âm thanh WebAudio trên iOS bỏ qua công tắc im lặng | làm phiền người xung quanh | âm tắt mặc định trên web; phiên `ambient` ở native |

---

## 8. Định nghĩa hoàn thành (DoD) cho phần trình bày của một tính năng

1. Mọi màn của tính năng có mục UI-xx đầy đủ (mẫu phần 01 §8) và đã duyệt.
2. Đủ 8 ô trạng thái có câu chữ thật; bản iOS kiểm riêng.
3. Âm: mọi tương tác của màn có `SFX-*` (hoặc ghi rõ «cố ý im lặng»); nhạc / mức nhạc đúng phần 09 §4.
4. Rung theo phần 07 §8; tắt rung thì không rung.
5. Camera / hiệu ứng (nếu có) đúng preset, qua ngân sách hiệu năng.
6. Trợ năng đạt mức của mốc; giảm chuyển động kiểm tay.
7. Chuỗi đã tách khỏi code (từ M5 bắt buộc; trước M5 khuyến khích).
8. Đo lường phát đúng, không rò dữ liệu cấm (phần 01 §7.1).
9. Tài sản âm thanh / hình có dòng sổ bản quyền.
