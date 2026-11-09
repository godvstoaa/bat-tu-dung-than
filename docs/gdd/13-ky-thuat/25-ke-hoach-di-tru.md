# 13.25 · Phụ lục J — Kế hoạch di trú từ hiện trạng sang kiến trúc đích

> Mục tiêu: mỗi bước di trú phát hành được độc lập, có công tắc quay về hành vi cũ, không làm mất tiến trình người chơi. Thứ tự dưới đây khớp bảng việc; cột «Công tắc» là cờ cho phép bật/tắt nhanh trong lúc chuyển (gỡ sau khi ổn định 2 bản phát hành).

## J.1 Nguyên tắc

1. **Mở rộng trước, thay sau:** thêm đường mới chạy song song đường cũ, so kết quả, rồi mới bỏ đường cũ.
2. **Dữ liệu chỉ tiến, không lùi:** lưu v2 giữ v1; migration DO chỉ thêm bảng/cột; nội dung có `migrate`.
3. **Mỗi bước có test chứng minh tương đương** (cùng kết quả trên dữ liệu thật trước khi đổi hành vi).
4. **Công tắc ở client** dùng tham số URL (thử nghiệm) và cấu hình từ xa (khẩn cấp), không bao giờ ở `localStorage` lâu dài.

## J.2 Bảng bước

| # | Bước | Từ | Sang | Song song / so sánh | Công tắc | Gỡ đường cũ khi | TASK |
|---|---|---|---|---|---|---|---|
| 1 | Chuẩn hóa thập thần | so chuỗi giản thể rải rác | `normGod` + `godsOf` | so 50 brief trước/sau | — (sửa lỗi) | ngay | 001–006 |
| 2 | Công thức tọa độ | 3 bản sao | `coords.js` | grep + test | — | ngay | 017 |
| 3 | Lưu | `huyenquan:v1` | `huyenquan:v2` (v1 giữ) | E10: v1 → v2 → so sâu | `?save=v1` (đọc/ghi v1, chỉ dev) | sau 2 bản ổn định; **không** xóa khóa v1 | 018, 019 |
| 4 | Chỉ số nhân vật | đọc thẳng `R` ở nhiều gian | Mệnh Bàn cho phần nhân vật; gian luận lá số vẫn đọc `R` | `test-menhban` với `MAU-*` | — | — | 007–011 |
| 5 | Thầy AI | `master-ui.js` gọi `askAI` không persona | `npc-chat-ui` + persona `thay_tubinh` (`briefMode` mặc định giống cũ) | `test-ai-compat` | `?persona=0` → `master-ui` cũ | sau M1 | 034–042 |
| 6 | 3 việc ngày | `state.tasks()` cứng | `DQ-01…03` trong dữ liệu | `test-game-state › Nhiệm vụ ngày` không sửa kỳ vọng | `?dq=legacy` | M2 | 139 |
| 7 | Va chạm | `Set` một lớp, cắt lát lúc chạy | lớp + chủ sở hữu + nướng sẵn | đếm ô Sơn Môn trước/sau bằng nhau | `?col=runtime` (bỏ qua tệp nướng) | khi mọi `BLD-thanh-*` có tệp nướng | 072–075 |
| 8 | Điện thờ | phòng túi x 1.500–2.000 | phòng túi x 2.600–3.600 → rồi nội thất trong vỏ | `test-game-state › Điện thờ` | `?rooms=pocket` (giữ dịch chuyển cũ cho điện đã chuyển) | từng điện khi DoD xong | 071, 105, 106, 112 |
| 9 | Nội thất | `interior.js › createInteriors` dựng hết lúc khởi động | `buildings.js` nạp theo 60 m | ảnh so sánh, `bench` S7 | `?rooms=pocket` | như bước 8 | 081, 082 |
| 10 | Đèn | `LIGHTS[].room` | `LIGHTS[].cell` (`room` bí danh) | ảnh đêm trong điện | — | khi không còn `room` trong code | 079 |
| 11 | Chất lượng | hạ một chiều | `quality-ctl` | `test-quality-ctl`, bench | `?qctl=0` | M3 | 151 |
| 12 | Nhân vật | `customProgramCacheKey` theo màu | màu uniform | ảnh so sánh 5 hành × 5 đai | `?tint=legacy` | M3 | 150 |
| 13 | Địa hình | 256 chunk, luồng chính | macro + worker, 1.296 chunk | lượt vẽ ≤ 30; ảnh vùng cũ | `?terrain=legacy` (thế giới cũ 2.048 m) | khi vùng mới phát hành (M2) | 126, 134, 135 |
| 14 | Kiến trúc vùng | `landmarks` nạp 900 m, không dỡ | streamer theo ô | ngâm bộ nhớ | `?stream=0` | M3 | 132 |
| 15 | Tìm đường xa | đi thẳng > 150 ô | đồ thị đường | `test-nav` | `?nav=0` | M3 | 140 |
| 16 | Tài sản | `public/models` trong git, URL cố định | tên băm + R2 | 404 = 0 trên bản thử | `?assets=local` | M3 | 016, 133 |
| 17 | MMO | v1 phát toàn phòng | v2 AOI + gộp | `load-quan` so mốc | máy chủ chấp nhận cả v1 trong 2 tuần (cờ `ALLOW_V1` ở Worker) | 2 tuần sau phát hành v2 | 197, 200 |
| 18 | Ngọc | chỉ client | máy chủ quản | đối soát số dư nhập | cấu hình từ xa `pay: false` | — (một chiều có trần nhập) | 267 |

## J.3 Chi tiết bước rủi ro cao

### J.3.1 Bước 3 — lưu v2

1. Bản N: thêm `save2.js`, **chỉ đọc** v1, ghi cả v1 (như cũ) và v2. Đo lỗi di trú qua sự kiện `err { code: 'migrate' }`.
2. Bản N+1: ghi v2, thôi ghi v1. v1 là bản chụp cuối trước khi đổi.
3. Bản N+2 trở đi: v1 chỉ còn để khôi phục bằng tay (Cài đặt › «Khôi phục bản cũ» dẫn `huyenquan:v1` qua `migrate1to2` lại).

Rủi ro: hai tab cùng mở ghi đè nhau (đã có trước nay). Giảm: sự kiện `storage` của trình duyệt → tab cũ hiện «Đã mở ở tab khác» và dừng ghi.

### J.3.2 Bước 8 — điện thờ

1. TASK-071 dời phòng túi (không đổi trải nghiệm: vẫn dịch chuyển).
2. Mỗi điện được thật hóa (TASK-105, 106, 112): trạm `door_*`/`exit_*` của điện đó bị gỡ khỏi `ROOMS`; cửa thật trong `BLD`.
3. Người chơi đang đứng trong phòng túi lúc cập nhật (vị trí lưu `world.last`): khi nạp, nếu vị trí thuộc phòng túi đã gỡ → đặt lại ở cửa thật của điện tương ứng.
4. MMO: người chơi cũ còn ở phòng túi gửi `mv` tọa độ dải cũ → máy chủ vẫn chấp nhận (biên `WORLD_TILES` mới bao cả dải cũ và dải mới trong 2 bản).

### J.3.3 Bước 13 — địa hình

1. Đổi `heightAt` làm đổi độ cao ở mọi điểm bán kính > 960 m. Mọi đối tượng đặt theo `H()` tự đúng; dữ liệu **chép tay độ cao** (nếu có trong nội dung vùng) phải tính lại.
2. Va chạm nướng của công trình rìa phải nướng lại (TASK-127) **cùng bản** đổi địa hình.
3. Người chơi lưu vị trí ở rìa cũ (vùng biển mây cũ nay thành đồi) → hợp lệ, không cần xử lý; vị trí nằm trong vách mới (dốc > 42°) → đặt lại về nút đường gần nhất.

### J.3.4 Bước 17 — MMO v2

1. Worker bản v2 hiểu cả `hello` v1 (không `cv`) khi `ALLOW_V1 = true`: người v1 nhận gói v1 (phát toàn phòng) **chỉ từ** những người trong AOI để giữ tải thấp; người v2 nhận `mvb`.
2. Sau 2 tuần (đa số client đã tải bản mới nhờ SW đổi tên cache), tắt `ALLOW_V1` → client v1 nhận `err upgrade`.

## J.4 Kiểm tra trước mỗi bước

| Kiểm | Lệnh |
|---|---|
| Không mất tiến trình | E10 với 5 bản lưu thật (ẩn danh hóa: bỏ `birth`, `profiles`) do QA thu từ máy thử |
| Tương đương hành vi | test so sánh của bước (cột «Song song / so sánh») |
| Hiệu năng không tụt | `bench-scenes` S1, S3 |
| iOS | `verify-ios-game` |
| Có đường lùi | công tắc của bước hoạt động trên staging |
