# 12 · Trình bày — Phần 22: Ma trận bối cảnh trình bày

> Một bảng duy nhất trả lời: «ở bối cảnh X, thành phần Y hiện hay ẩn; nhạc mức nào; camera nào; gia trì sáng bao nhiêu; rung / âm gì được phép». Bộ điều phối trình bày (★ `presenter.js`, tài liệu 13) giữ **một** bối cảnh hiện hành, chuyển bối cảnh theo bảng §3, và áp ma trận §2. Các phần 02–21 vẫn là chuẩn chi tiết; ma trận này là chỗ gom để không mâu thuẫn.

---

## 1. Danh sách bối cảnh

| Mã | Bối cảnh | Vào khi | Ra khi |
|---|---|---|---|
| C0 | Cổng | mở game, `exit` | «Bước qua cổng» |
| C1 | Đi lại ngoài trời | mặc định trong thế giới | — |
| C2 | Trong điện | vào điện (`enterRoom` kind door) | ra điện |
| C3 | Ngồi (trà, bồ đoàn, bàn) | `setSitting(true)` | đứng dậy |
| C4 | Ngự kiếm | `setFlying(true)` | hạ kiếm |
| C5 | Bảng half / side | `panel.open` | `panel.close` |
| C6 | Bảng full | chạm thanh kéo / bàn phím ảo bật | về half / đóng |
| C7 | Bảng peek | `api.peek(true)` | `peek(false)` |
| C8 | Hội thoại kịch bản | UI-40 | kết thoại |
| C9 | Hội thoại AI | UI-41 | đóng bảng |
| C10 | Mini-game | `mg.start` | `mg.end` / dừng |
| C11 | Nghi thức | UI-04 / UI-05 / UI-33 / phần 20 | kết thúc / bỏ qua |
| C12 | Cảnh cắt | UI-99 | kết thúc / bỏ qua |
| C13 | Màn chuyển | UI-14 | hết màn |
| C14 | Chụp ảnh | UI-98 | thoát |
| C15 | Tạm nghỉ | UI-18 / tab ẩn | tiếp tục |
| C16 | Xác nhận hệ thống | hộp z 80 | chọn nút |
| C17 | Khủng hoảng | UI-42 | «Quay lại quán» |

Các **cờ phủ** không phải bối cảnh mà áp lên mọi bối cảnh: `reduced` (giảm chuyển động), `ios`, `offline`, `lowQuality`, `mode2d`, `cb-*` (mù màu), `hc` (tương phản cao).

---

## 2. Ma trận hiển thị

Ký hiệu: ● hiện · ◐ thu gọn / mờ · ○ ẩn · — không áp dụng.

### 2.1 Thành phần giao diện

| Thành phần | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 | C10 | C11 | C12 | C13 | C14 | C15 | C16 | C17 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| HUD (UI-08) | ● | ● | ● | ● | ● | ◐ | ● | ○ | ● | ○ | ○ | ○ | ○ | ○ | ● | ● | ○ |
| Dock (UI-09) | ● | ● | ● | ◐ | ● | ○ | ● | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ● | ○ |
| Nút hành động (UI-10) | ● | ● | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| Cần ảo (UI-11) | ● | ● | ○ | ● | ○ | ○ | ○ | ○ | ○ | tùy MG | ○ | ○ | ○ | ● (bay camera) | ○ | ○ | ○ |
| Cụm độ cao | ○ | ○ | ○ | ● | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| Theo dõi nhiệm vụ (UI-16) | ● (◐ khi đang đi) | ● | ● | ◐ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| La bàn (UI-17) | ● | ● | ● | ● | ○ | ○ | ● | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| Bản đồ nhỏ (≥ 1280) | ● | ● (mặt bằng điện) | ● | ● | ● | ○ | ● | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| Nhãn gian 3D | ● (≤ 8) | ● dọc | ● | ◐ (thánh địa) | ○ | ○ | ● | ○ | ○ | ○ | ○ | ○ | ○ | tùy chọn | ○ | ○ | ○ |
| Tên mình | ● | ● | ● | ● | ● | ○ | ● | ○ | ○ | ○ | ○ | ○ | ○ | tùy chọn | ○ | ○ | ○ |
| Tên người khác | < 24 m | < 24 m | < 24 m | < 40 m | ○ | ○ | < 24 m | ○ | ○ | ○ | ○ | ○ | ○ | ○ (riêng tư) | ○ | ○ | ○ |
| Bong bóng | ● | ● | ● | ● | ● | ○ | ● | ○ | ● (thầy) | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| Toast | ● | ● | ● | ● | ● (trên) | ● (trên) | ● | hàng đợi | ● (trên) | ● (trên) | hàng đợi | hàng đợi | hàng đợi | hàng đợi | hàng đợi | hàng đợi | ○ (hủy hàng đợi T1, giữ T3) |
| Dòng trợ giúp phím | ● (máy tính) | ● | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| Lời mời (UI-64) | ● | ● | ● | ● | ● | ● | ● | hàng đợi | ● | hàng đợi | hàng đợi | hàng đợi | hàng đợi | hàng đợi | ○ | hàng đợi | ○ |

### 2.2 Âm thanh, nhạc, camera, hiệu ứng

| Bối cảnh | Mức nhạc (phần 09 §4.1) | Nén nhường (phần 11 §2.3) | Camera (phần 08) | Gia trì (phần 12 §3.3) | Vệt bước | Rung cho phép |
|---|---|---|---|---|---|---|
| C0 Cổng | `BGM-GATE-01` | — | — | — | — | light, medium |
| C1 Đi lại | theo giờ (M0–M2) | — | rig ngoài trời theo vùng (§2.1) | ngày 0,7 / đêm 1,0 | ● | mọi loại |
| C2 Trong điện | `BGM-INT-*` M1 | — | trong nhà §3.1, §3.5 | 0,5 | ○ | light, medium |
| C3 Ngồi | M1 | — | `dist × 0,75`, lượn chậm sau 4 s | 0,6 | ○ | light |
| C4 Ngự kiếm | M2 / `BGM-SKY` > 200 m | — | §2.1 hàng ngự kiếm | 1,0 | ● | medium |
| C5 Bảng half | giảm một mức (≥ M1) | — | giữ, khóa xoay khi chạm trong bảng | giữ | giữ | light |
| C6 Bảng full | M1 | AMB.POINT −4 dB | dừng cập nhật nặng (★) | giữ | giữ | light |
| C7 Peek | M1 | — | giữ | giữ | giữ | light |
| C8 Thoại kịch bản | M1, `mel` tắt khi có VO | VO: MUS −8, AMB −4 | `cam.talk` | 0,4 | ○ | light, medium (⚠ nghiệp) |
| C9 Thoại AI | M1 | MUS −3 khi đang hiện chữ | giữ rig | giữ | giữ | light |
| C10 Mini-game | lớp tĩnh M1 hoặc `BGM-MG-*` | theo MG | preset MG (phần 08 §5) | theo MG (thiền 0,6) | ○ | theo MG |
| C11 Nghi thức | nhạc nghi thức | AMB, FOOT, COS −12 | `cam.ascend` / preset nghi thức | hiệu ứng nghi thức | ○ | mẫu nhịp (phần 07 §8.3) |
| C12 Cảnh cắt | nhạc cảnh | VO ưu tiên | preset cảnh | 0,4 | ○ | ○ |
| C13 Màn chuyển | tắt dần 0,5 s | mọi bus trừ SFX.WORLD −18 | nhảy thẳng | — | — | light |
| C14 Chụp ảnh | giữ mức trước đó | — | camera tự do §6 | theo người chơi | theo người chơi | ○ |
| C15 Tạm nghỉ | tắt (pause) / hạ −12 (menu web) | — | dừng | — | — | ○ |
| C16 Xác nhận | giữ | — | giữ | giữ | giữ | light |
| C17 Khủng hoảng | −30 dB | — | dừng | ○ | ○ | ○ |

### 2.3 Cờ phủ

| Cờ | Ảnh hưởng chung |
|---|---|
| `reduced` | bỏ màn chuyển đi trạm; nghi thức → thẻ tĩnh; camera không bay; hạt trang trí tắt; chữ thoại hiện cả câu |
| `ios` | không lối vào màn bói / AI; `TEXT` iOS; Mệnh Đồ «Lộ Tu»; phiên âm `ambient` |
| `offline` | ẩn tên / bong bóng người khác; chip «Ngoại tuyến»; Thiên Bảng chỉ số liệu bản thân; AI → luận cục bộ |
| `lowQuality` | tắt bóng, `pixelRatio 1`, tắt bloom, giảm hạt (đã có một phần) |
| `mode2d` | không nhãn 3D, không camera, không hiệu ứng 3D; giao diện HTML giữ nguyên |
| `cb-*` / `hc` | đổi token màu (phần 18 §1); 3D đổi bảng màu qua `setPalette` |

---

## 3. Chuyển bối cảnh

### 3.1 Bảng chuyển được phép

| Từ \ Sang | C5/C6/C7 bảng | C8 thoại | C9 AI | C10 MG | C11 nghi thức | C12 cảnh cắt | C14 chụp | C15 tạm nghỉ | C16 xác nhận |
|---|---|---|---|---|---|---|---|---|---|
| C1 đi lại | ✓ | ✓ | ✓ (qua bảng) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (khi do người chơi) |
| C2 trong điện | ✓ | ✓ | ✓ | ✓ | ✓ (biến thể điện) | ✓ | ✓ | ✓ | ✓ |
| C3 ngồi | ✓ (peek) | ✓ | ✓ | ✓ (tĩnh tọa) | hoãn tới khi đứng | ✓ | ✓ | ✓ | ✓ |
| C4 ngự kiếm | ✓ | hạ kiếm trước | ✓ | hạ kiếm trước | hạ kiếm trước | hạ kiếm trước | ✓ | ✓ | ✓ |
| C5–C7 bảng | ✓ (ngăn xếp) | đóng bảng trước | ✓ | đóng bảng trước | hoãn | hoãn | ✗ | ✓ | ✓ |
| C8 thoại | ✗ | — | ✓ («Hỏi thêm») | ✓ (do kịch bản) | ✓ (do kịch bản) | ✓ | ✗ | ✓ | ✗ |
| C10 MG | ✗ | ✗ | ✗ | — | hoãn | ✗ | ✓ (một số MG) | ✓ | ✓ (D4) |
| C11 nghi thức | ✗ | ✗ | ✗ | ✗ | — | ✗ | ✗ | ✓ (tab ẩn) | ✗ |
| C12 cảnh cắt | ✗ | ✓ (lựa chọn) | ✗ | ✗ | ✗ | — | ✗ | ✓ | ✗ |

✗ = sự kiện đến sẽ **vào hàng đợi**, không cắt ngang. «Hoãn» = chờ bối cảnh hiện tại kết thúc (tối đa 10 phút; quá thì hiện khi người chơi mở Sổ Mệnh).

### 3.2 Hàng đợi sự kiện trình bày

| Loại | Ưu tiên | Hết hạn |
|---|---|---|
| khủng hoảng (C17) | 0 — cắt ngang mọi thứ trừ C16 | — |
| nghi thức (C11) | 1 | 10 phút |
| cảnh cắt cốt truyện | 2 | không hết hạn (gắn nhiệm vụ) |
| lời mời MMO | 3 | 30 s |
| toast T3 | 4 | 60 s |
| toast T1 / T2 | 5 | 10 s (bỏ nếu quá) |
| chuông canh | 6 | 5 phút |

### 3.3 Khôi phục sau bối cảnh

Khi rời một bối cảnh có đổi camera / nhạc, khôi phục **giá trị người chơi trước đó** (yaw, pitch, dist, mức nhạc), không đặt lại mặc định (phần 08 §4.4). Ngoại lệ: rời C2 (ra điện) — camera dùng thông số ngoài trời của vùng.

---

## 4. Kiểm thử ma trận

1. Công cụ gỡ lỗi (phím ẩn) hiện bối cảnh hiện hành và cờ phủ.
2. Test tự động: với mỗi cặp (bối cảnh, thành phần) ở §2.1, đặt bối cảnh bằng `window.__hq` (hook kiểm thử đã có) và kiểm DOM / renderer khớp ma trận.
3. Test sự kiện chồng: phát đồng thời lời mời + lên cấp + chuông canh trong C8 → thứ tự xả đúng §3.2 sau khi thoại kết thúc.
