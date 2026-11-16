# 51 · Sổ tay bộ phận Client và 3D

## Sứ mệnh
Biến luật và dữ liệu thành một thế giới đi lại được, chạy mượt trên máy tầm trung và điện thoại, không bao giờ để người chơi đi xuyên tường hay kẹt cửa.

## Đọc gì theo thứ tự
1. [00-TONG-QUAN](00-TONG-QUAN.md) §0.8.
2. [30-KY-THUAT-CLIENT](30-KY-THUAT-CLIENT.md): §30.1 (ba lớp mô-đun), §30.5 (va chạm), §30.6 (ngân sách).
3. [10-THE-GIOI](10-THE-GIOI.md), [23-MY-THUAT-TAI-SAN](23-MY-THUAT-TAI-SAN.md), [22-GIAO-DIEN-DIEU-KHIEN](22-GIAO-DIEN-DIEU-KHIEN.md).
4. Manifest chuyên đề của vùng bạn sửa (bảng ở README mục 2).
5. [A1](phu-luc/A1-ban-do-ma.md) để biết mô-đun nào thuộc chương nào, có test nào.

## Phạm vi sở hữu
- Hạ tầng dựng hình: `main.js`, `render3d.js`, `world3d.js`, `assets.js`, `collide.js`, `obstacles.js`, `gen.js`, `gen.worker.js`, `perf.js`.
- Mọi mô-đun `*3d.js`, `archkit*.js`, `interior*.js`, `characters.js`, `accessories.js`, `effects.js`.
- Mọi mô-đun `*-ui.js`, `markup.js`, `game.css`.
- Chương 22, 30; đồng giữ 10, 23.

## Giao diện với bộ phận khác
| Với | Hợp đồng |
|---|---|
| Thiết kế game | toạ độ và luật nằm ở mô-đun thuần; bạn **đọc**, không tự đặt (LN-14) |
| Backend | mọi gói mạng đi qua `protocol.js`; lõi `*-core.js` dùng chung, không nhân bản luật ở client |
| Mỹ thuật | bậc model theo §23.4; model mới phải đúng mét (§23.2) |
| QA | mỗi thay đổi hình có ảnh trước và sau; mỗi lời về tốc độ có số đo |

## Quy trình một việc
1. Xác định mô-đun thuần là nguồn dữ liệu; thiếu thì thêm ở đó trước.
2. Viết phần dựng hình; đăng ký va chạm ngay khi đặt (năm luật ở §30.5).
3. Chạy test bố cục của vùng và `test-game-collide`.
4. Đo ở điểm cố định, cùng mức đồ hoạ, trước và sau (§30.6).
5. Chụp bộ ảnh; sinh lại phụ lục; ghi nhật ký, kèm số đo.

## Định nghĩa «xong»
- Không phá bất biến của thành (§10.3.4): chỉ số nhà giữ nguyên; đổi khoá tiệm thì nâng phiên bản bố cục.
- Mọi cửa và trạm tới được; không công trình nào đứng giữa dòng nước.
- Trong ngân sách §30.6; không model nào được nạp bằng yêu cầu thăm dò.
- Bảng mới thử ở màn dọc 390 × 844, vùng chạm ≥ 44 px, không dùng hộp thoại của trình duyệt (§22.5).
- Mục §32.2 đạt.

## Lệnh hay dùng
```bash
npm run dev
```
```bash
node scripts/test-game-collide.mjs
```
```bash
node scripts/test-game-city-v4.mjs
```
```bash
node scripts/city-metrics.mjs
```
```bash
node scripts/shot-city.mjs
```

## Hàng việc hiện tại
`VC-009` (nối nốt model phố, đo khung hình) · `VC-024` (bốn lỗi giao diện) · `VC-003` (chú thích mã trỏ tài liệu cũ) · `VC-012`. Goal đồ hoạ còn mở nằm trong từng manifest. Chi tiết: [04-LO-TRINH](04-LO-TRINH.md).
