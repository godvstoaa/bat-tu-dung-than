# 12 · Trình bày — Phần 23: Kịch bản kiểm thử trình bày

> Bộ ca kiểm thử cho kiểm thử viên (thủ công) và cho Playwright (tự động — dự án đã có hook `window.__hq` gồm `state, player, stick, altCtl, net, openStation, walkTo, STATIONS, blockedAt, findPath, renderer`). Mỗi ca: bước, kết quả mong đợi, mức (P0 chặn phát hành · P1 · P2), loại (TĐ tự động / TC thủ công). Mã ca dạng `K-<nhóm>-nn` là **nhãn nội bộ của bộ kiểm thử**, không phải mã canon.

---

## 1. Cổng và nhập môn

| Ca | Bước | Mong đợi | Mức | Loại |
|---|---|---|---|---|
| K-GATE-01 | xoá dữ liệu, mở game | UI-01 → UI-07 → UI-02 với mẫu bát tự; tên ngẫu nhiên đã điền | P0 | TĐ |
| K-GATE-02 | nhập `MAU-A` (1990-05-15 08:30 nam) | dòng âm lịch «21/4 năm Canh Ngọ», «giờ Thìn (07–09)» | P0 | TĐ |
| K-GATE-03 | gửi | bốn trụ 庚辰 · 庚辰 · 辛巳 · 庚午; Nhật chủ 庚 (Kim) · Thân quá vượng | P0 | TĐ |
| K-GATE-04 | xem dòng Hỷ thần | ghi **Kim** (đọc `yong.xi`), đai ghi Mộc (hành phụ trợ) — kiểm sửa lỗi UI-04 | P0 | TĐ |
| K-GATE-05 | thanh ngũ hành | 5 khúc khớp Mộc 6,5 · Hỏa 18,3 · Thổ 17,9 · Kim 55,1 · Thủy 2,2; có nhãn chữ | P0 | TĐ |
| K-GATE-06 | UI-05 | Tiềm Lực 41, Tứ Linh Căn, «hơn 31% người», Mệnh Cách Đắc Cứu, hệ số ×1,19, câu dẫn bắt buộc | P0 | TĐ |
| K-GATE-07 | lặp với 6 lá số mẫu tài liệu 04 (điểm < 28 … ≥ 73) | câu dẫn hiện ở **mọi** điểm; không phần tử nào có màu `--hq-son` hay `#e0533d` | P0 | TĐ |
| K-GATE-08 | tick «Không rõ giờ» | ô giờ khóa; trụ giờ có nhãn «tạm», viền đứt | P1 | TC |
| K-GATE-09 | ngày tương lai | lỗi «Ngày này chưa tới…», focus về ô ngày | P1 | TĐ |
| K-GATE-10 | mở lại game | UI-06 «Chào {tên} quay lại quán.»; thẻ hôm nay có ngày can chi | P0 | TĐ |
| K-GATE-11 | bản iOS | 學 館 · Học Quán; câu dẫn iOS; không dòng đèn Thái Tuế | P0 | TĐ |
| K-GATE-12 | giảm chuyển động bật | lật trụ không hoạt ảnh, trụ hiện ngay; nút bấm được ngay | P1 | TC |

## 2. Khung chơi

| Ca | Bước | Mong đợi | Mức | Loại |
|---|---|---|---|---|
| K-HUD-01 | vào cảnh 390 × 844 | HUD 1 dòng tên + chip; dock 5 nút ≥ 76 × 48; nút icon HUD 44 px | P0 | TĐ |
| K-HUD-02 | đi tới bàn thầy | nút hành động «📜 Ngồi trước bàn thầy»; rung light một lần | P0 | TC |
| K-HUD-03 | `E` trên máy tính khi focus ở nút HUD | vẫn mở trạm gần nhất | P1 | TĐ |
| K-HUD-04 | `Space` khi focus ở nút HUD | bấm nút đó, không mở trạm | P1 | TĐ |
| K-HUD-05 | nhận 3 toast liên tiếp | tối đa 2 hiện; T3 không bị T1 đẩy | P1 | TĐ |
| K-HUD-06 | mở bảng rồi nhận toast | toast hiện ở đầu màn | P1 | TĐ |
| K-HUD-07 | mở bảng con từ Sổ Mệnh | có nút «‹ Sổ Mệnh»; Esc về bảng cha | P1 | TĐ |
| K-HUD-08 | vuốt thanh kéo xuống 100 px | bảng đóng | P1 | TC |
| K-HUD-09 | Tab liên tục trong bảng | focus không thoát ra cảnh | P0 | TĐ |
| K-HUD-10 | chấm thông báo dock | tối đa một chấm; chấm Y Các tắt sau 3 ngày không mở | P2 | TĐ |
| K-HUD-11 | ngự kiếm | nút 🗡 viền vàng; cụm ▲▼ hiện; thước độ cao | P1 | TC |
| K-HUD-12 | Esc khi không có bảng | mở menu tạm nghỉ | P1 | TĐ |
| K-HUD-13 | chơi 90 phút (giả thời gian) | nhắc nghỉ trong menu + toast T1 | P2 | TĐ |

## 3. Sổ Mệnh, Mệnh Bàn, Mệnh Đồ

| Ca | Bước | Mong đợi | Mức | Loại |
|---|---|---|---|---|
| K-BOOK-01 | mở Sổ Mệnh | thẻ Mệnh Bàn · Mệnh Đồ · Công Quá · Cảnh giới · Tủ đồ · Nhật ký · Thành tựu; chú thích Phúc Khí luôn có | P0 | TĐ |
| K-BOOK-02 | Mệnh Bàn `MAU-A` | Ngũ Duy Tài 26 · Quan 45 · Ấn 54 · Thực 15 (缺) · Tỷ 100 (主); 8 sao; Thanh Quý; Nguyên Khí 23 | P0 | TĐ |
| K-BOOK-03 | so mọi số với trang chính app | lệch 0 (6 lá số mẫu) | P0 | TĐ |
| K-BOOK-04 | chạm cánh Thủy 2,2% | mở UI-23; vùng chạm ≥ 44 px dù cánh ngắn | P0 | TC |
| K-BOOK-05 | «Vì sao 41 điểm?» | danh sách cộng / trừ; tổng khớp điểm; dấu − màu `--hq-dim` | P0 | TĐ |
| K-BOOK-06 | «Xem nguyên văn» | chuỗi engine đầy đủ, chữ Hán giản / phồn giữ nguyên | P1 | TC |
| K-BOOK-07 | Mệnh Đồ trước khi gặp Vân Cốc | núi mờ + câu khóa + «Chỉ đường» | P0 | TĐ |
| K-BOOK-08 | Mệnh Đồ `MAU-A` năm 2026 | 3 chẩn đoán nguyên văn; nút Thái Tuế có ⚠ «năm nay» | P0 | TĐ |
| K-BOOK-09 | Mệnh Đồ bản iOS | không nút Thời, Thái Tuế; tiêu đề «Lộ Tu» | P0 | TĐ |
| K-BOOK-10 | Sổ Công Quá có dòng 過 | dòng ghi rõ lựa chọn; nút «Sửa sai»; không liên kết cửa hàng | P0 | TC |
| K-BOOK-11 | Cảnh giới đổi «Gọi theo» Phật | tên bậc đổi (Quy Y, Trì Giới…) | P1 | TĐ |
| K-BOOK-12 | xoá hồ sơ | hộp z 80 D1 (không `confirm()` trình duyệt), «Giữ lại» có focus mặc định | P0 | TĐ |
| K-BOOK-13 | trình đọc màn hình đọc Mệnh Bàn | đọc bảng thay thế, bỏ qua SVG | P1 | TC |

## 4. Hội thoại và AI

| Ca | Bước | Mong đợi | Mức | Loại |
|---|---|---|---|---|
| K-TALK-01 | cảnh Vân Cốc (kịch bản §6.3 bản tổng) | 3 lựa chọn, không giới hạn thời gian | P0 | TC |
| K-TALK-02 | lựa chọn dính nghiệp | NPC nhắc trước; nhãn ⚠; «Rút lời» trong 3 s | P0 | TC |
| K-TALK-03 | lựa chọn khóa theo chỉ số | hiện với «🔒 cần …», không ẩn | P1 | TC |
| K-TALK-04 | ⏩ | lần 1 hiện hết câu, lần 2 sang câu | P1 | TĐ |
| K-AI-01 | hỏi Thầy (web) | câu chờ → trạng thái công cụ → luồng chữ → Neo → 3 gợi ý | P0 | TC |
| K-AI-02 | đóng bảng giữa luồng | không còn yêu cầu mạng chạy (tab Network) | P0 | TĐ |
| K-AI-03 | giả lập `hasRedFlag` | huy hiệu ⚠ đỏ + câu «Đoạn này có chỗ lệch…» | P0 | TĐ |
| K-AI-04 | giả lập Neo 65 không cờ đỏ | vẫn hiện ⚠ (ngưỡng < 70) | P1 | TĐ |
| K-AI-05 | ngắt mạng | «Luận cục bộ», không lỗi đỏ | P0 | TĐ |
| K-AI-06 | hỏi câu thứ 11 trong ngày | ô nhập thay bằng câu hết lượt + 3 câu cục bộ | P1 | TĐ |
| K-AI-07 | câu khủng hoảng mẫu | mở UI-42, nhạc −30 dB, không tự đóng | P0 | TC + duyệt chuyên gia |
| K-AI-08 | bản iOS | không có nút «Hỏi thêm» ở bất kỳ đâu | P0 | TĐ |
| K-AI-09 | câu trả lời chứa liên kết cửa hàng (giả lập) | liên kết bị lọc | P0 | TĐ |

## 5. Thế giới, bản đồ, nhiệm vụ

| Ca | Bước | Mong đợi | Mức | Loại |
|---|---|---|---|---|
| K-WORLD-01 | theo dõi 3 nhiệm vụ, thêm cái thứ 4 | hộp D10 chọn bỏ | P1 | TĐ |
| K-WORLD-02 | đi liên tục > 2 s trên điện thoại | tracker thu thành chip | P2 | TC |
| K-WORLD-03 | bản đồ | Bắc ở trên; vùng chưa tới phủ sương; «Xem dạng danh sách» | P1 | TC |
| K-WORLD-04 | trạm chưa tới | mờ, «chưa tới», không chọn được | P1 | TĐ |
| K-WORLD-05 | đi trạm khi giảm chuyển động | không màn chuyển, mở gian ngay | P1 | TĐ |
| K-WORLD-06 | vào Vận Mệnh Các `MAU-A` | 9 cổng 壬午 … 庚寅; cổng 3 (甲申) sáng | P0 | TĐ |
| K-WORLD-07 | Thái Tuế Điện 2026 `MAU-A` | ô «bạn phạm» nền vàng đất (không đỏ); Trị, Hình | P0 | TĐ |
| K-WORLD-08 | thắp đèn | `cam.lamp` 1,2 s; toast +10; bấm lại → «Hôm nay đã thêm dầu ✓» | P1 | TC |
| K-WORLD-09 | 9 nhãn gian cùng khung | tối đa 8 hiện | P2 | TĐ |

## 6. Xã hội và Tàng Y Các

| Ca | Bước | Mong đợi | Mức | Loại |
|---|---|---|---|---|
| K-SOC-01 | gửi cử chỉ khi ngoại tuyến | «Đang chơi đơn — chỉ mình bạn thấy.» | P1 | TĐ |
| K-SOC-02 | thẻ người chơi khác | không ngày sinh, không tứ trụ, không Mệnh Cách; Tiên Thiên «ẩn» trừ khi họ công khai | P0 | TĐ |
| K-SOC-03 | báo cáo | lý do → ẩn người → toast cảm ơn | P0 | TĐ |
| K-SOC-04 | lời mời khi đang mini-game | vào hàng đợi, hiện sau | P1 | TĐ |
| K-SHOP-01 | điểm danh | +Ngọc đúng `CHECKIN[day-1]`; nút thành «Đã điểm danh ✓» | P0 | TĐ |
| K-SHOP-02 | thiếu Ngọc | toast lý do; **không** nhảy sang màn nạp | P0 | TĐ |
| K-SHOP-03 | mua món ≥ 300 Ngọc | hộp D5 | P1 | TĐ |
| K-SHOP-04 | mặc đủ bộ Thủy với `MAU-A` (Dụng Thủy) | «Hợp mệnh ✓», `SFX-SHOP-004`, vòng chữ 用 | P1 | TC |
| K-SHOP-05 | quét toàn bộ màn Tàng Y Các | không đếm ngược, không «chỉ còn», không gói ngẫu nhiên | P0 | TC |
| K-SHOP-06 | bản iOS | không nút «Nạp Ngọc», không gói nạp | P0 | TĐ |
| K-SHOP-07 | phòng thử | xoay 360°, ngày / đêm, «Bay» xem ngự vật khi chưa mở bay | P1 | TC |

## 7. Mini-game

| Ca | Bước | Mong đợi | Mức | Loại |
|---|---|---|---|---|
| K-MG-01 | mọi mini-game | HUD thường ẩn; ✕ Dừng góc trái; [?] tự mở lần đầu | P0 | TĐ |
| K-MG-02 | kết thúc kém | chữ «Chưa thấu», nút «Làm lại»; không chữ «Thất bại» | P0 | TĐ |
| K-MG-03 | tĩnh tọa lần đầu | câu cảnh báo sức khỏe hiện | P0 | TĐ |
| K-MG-04 | kết phù | câu «Ký tự trong game là chữ bịa…» luôn hiện trên khay | P0 | TĐ |
| K-MG-05 | kéo thả thay bằng chạm – chạm | hoàn thành được UI-82, UI-85, UI-89 không cần kéo | P1 | TC |
| K-MG-06 | sám hối «Hỗ trợ nhịp: Tự động» | hoàn thành không cần chạm | P1 | TĐ |
| K-MG-07 | cứu người | bước ① luôn trước; kết quả «khuyên đi khám» được tính «Thấu» | P0 | TC |
| K-MG-08 | mạn-đà-la | thưởng chỉ khi «Xóa đi» | P1 | TĐ |
| K-MG-09 | dừng sau 31 s | hộp D4 | P2 | TĐ |

## 8. Âm thanh

| Ca | Bước | Mong đợi | Mức | Loại |
|---|---|---|---|---|
| K-AUD-01 | mở game lần đầu | không tiếng nào cho tới khi người chơi bật | P0 | TĐ |
| K-AUD-02 | 🔈 tắt | 0 tiếng (kể cả chuông canh, VO) | P0 | TĐ |
| K-AUD-03 | đo 10 phút chơi chuẩn | −16 ± 1 LUFS, đỉnh ≤ −1 dBTP | P1 | TC (thiết bị đo) |
| K-AUD-04 | qua 23:00 giờ máy | chuông canh Tý 9 tiếng; nhạc chuyển `KHUYA` (điệu Vũ) trong ≤ 28 s | P1 | TĐ (giả giờ) |
| K-AUD-05 | đi qua ranh hai vùng | đan chéo 6 s, không đứt | P1 | TC |
| K-AUD-06 | VO phát | nhạc −8 dB, nhả 600 ms | P1 | TĐ |
| K-AUD-07 | 60 người MMO quanh sân, điện thoại | ≤ 24 tiếng cùng lúc, không rè | P1 | TC |
| K-AUD-08 | chuyển tab | tắt dần 0,3 s; trở lại đúng khung giờ hiện tại | P1 | TĐ |
| K-AUD-09 | Safari không phát 6 kênh (giả lập) | bản stereo dự phòng phát | P1 | TĐ |
| K-AUD-10 | nghe toàn thư viện | không lời kinh / chú thật; walla không rõ chữ | P0 | TC + cố vấn |

## 9. Camera và hiệu ứng

| Ca | Bước | Mong đợi | Mức | Loại |
|---|---|---|---|---|
| K-CAM-01 | đi quanh tường thành Huyền Thành | camera không xuyên tường (va chạm §2.2) | P1 | TC |
| K-CAM-02 | vào 6 điện có sẵn | camera trong hộp, tượng thấy rõ, `dist` / `pitch` theo phần 08 §3.5 | P1 | TĐ (`renderer.info().cam`) |
| K-CAM-03 | ngước nhìn trời (`pitch −0,75`) | camera không chui đất; điểm nhìn nâng | P1 | TĐ (`setView`) |
| K-CAM-04 | kết thúc cảnh cắt | camera về yaw / pitch / dist người chơi đang dùng | P1 | TĐ |
| K-CAM-05 | giảm chuyển động | không chuyển động camera ngoài ý người chơi | P0 | TC |
| K-FX-01 | trong điện | không vệt bước, gia trì ≤ 50% | P1 | TĐ |
| K-FX-02 | phân tích chớp video 5 phút có Cửu Thiên Lôi Quang + giông | ≤ 3 lóe / giây | P0 | TĐ (công cụ phân tích chớp) |
| K-FX-03 | ảnh khử màu 5 hành | phân biệt bằng chuyển động ≥ 90% người thử | P1 | TC |
| K-FX-04 | 60 người, điện thoại tầm trung | ≥ 40 fps; hạt ≤ 1.500 | P1 | TC |
| K-FX-05 | < 35 fps 3 s | tự hạ chất lượng, toast E32 một lần mỗi phiên | P1 | TĐ |

## 10. Trợ năng, bản địa hóa, nền tảng

| Ca | Bước | Mong đợi | Mức | Loại |
|---|---|---|---|---|
| K-A11Y-01 | axe-core trên mọi bảng | 0 lỗi nghiêm trọng | P0 | TĐ |
| K-A11Y-02 | cỡ chữ 150% ở 390 × 844 | không chữ bị cắt, không cuộn ngang | P0 | TĐ (ảnh chụp) |
| K-A11Y-03 | chế độ Đỏ – lục | màu `--wx-*` đổi đúng bảng phần 14 §2.2; áo nhân vật 3D đổi theo | P1 | TĐ |
| K-A11Y-04 | một tay (phải) | cần ảo, nút hành động, dock cùng bên phải | P1 | TC |
| K-A11Y-05 | phụ đề âm thanh bật, Phong Đô | nhãn «[giọt nước…]» chỉ cho tiếng mang thông tin (bảng phần 14 §3.2) | P2 | TC |
| K-L10N-01 | `?pseudo=1` | mọi chuỗi có ⟦ ⟧; không chữ bị cắt | P1 | TĐ |
| K-L10N-02 | quét mã | không còn chuỗi tiếng Việt viết thẳng ngoài `locales/` (từ M5) | P1 | TĐ |
| K-PLAT-01 | Android: nút quay lại ở mọi lớp | đúng bảng phần 19 §3.1 | P0 | TC |
| K-PLAT-02 | iOS: vuốt mép trái khi đang dùng cần ảo | không kích hoạt quay lại | P1 | TC |
| K-PLAT-03 | bàn phím ảo trong UI-41 | ô nhập nằm trên bàn phím, log cuộn tới câu cuối | P0 | TC |
| K-PLAT-04 | màn ngang điện thoại (web) | dock thành cột phải | P2 | TC |
| K-PLAT-05 | mất ngữ cảnh WebGL (giả lập `WEBGL_lose_context`) | «Đang dựng lại quán…» → hồi phục | P1 | TĐ |
| K-PLAT-06 | `localStorage` đầy (giả lập) | thẻ E23 + nút «Xuất dữ liệu» | P1 | TĐ |
| K-PRIV-01 | quét mọi payload đo lường 30 phút | không ngày, không can chi liền, không chuỗi > 64 ký tự | P0 | TĐ |
| K-PRIV-02 | UI-07 | hai ô mặc định **tắt** | P0 | TĐ |

---

## 11. Tổng hợp

| Nhóm | Số ca | P0 |
|---|---|---|
| Cổng và nhập môn | 12 | 9 |
| Khung chơi | 13 | 3 |
| Sổ Mệnh | 13 | 10 |
| Hội thoại và AI | 13 | 9 |
| Thế giới | 9 | 2 |
| Xã hội, Tàng Y Các | 11 | 6 |
| Mini-game | 9 | 5 |
| Âm thanh | 10 | 3 |
| Camera, hiệu ứng | 10 | 2 |
| Trợ năng, bản địa hóa, nền tảng | 15 | 6 |
| **Tổng** | **115** | **55** |

Chạy bộ TĐ trên mỗi lần dựng (CI); bộ TC trước mỗi mốc M0–M6; ca có «duyệt chuyên gia / cố vấn» ghi biên bản vào tài liệu 14.
