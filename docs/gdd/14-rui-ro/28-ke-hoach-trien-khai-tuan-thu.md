# 14.28 · Kế hoạch triển khai tuân thủ — việc theo tuần cho M0–M1, theo mốc cho M2–M6

> Biến checklist 14.13 thành lịch việc có phụ thuộc. Tập 13 chuyển từng dòng thành `TASK-*`. Mã việc ở đây: `RISK-WP-xx`.
> Giả định: M0 = 2 tuần, M1 = 4 tuần (canon §13.4); đội nhỏ, một người có thể giữ nhiều vai — **trừ** các việc cần người ngoài (cố vấn, luật sư, người duyệt khác người viết — RISK-159).

---

## 1. M0 — tuần 1

| Mã | Việc | Chủ | Phụ thuộc | Đầu ra | Liên quan |
|---|---|---|---|---|---|
| RISK-WP-01 | Sửa danh mục Tàng Y Các (gỡ 2, đổi 5, sửa mô tả 4, thôi bán 2) + di trú đồ đã sở hữu | AD + TMC | — | PR `cosmetics.js`, test di trú | RISK-001, 002 |
| RISK-WP-02 | Thêm `tags`, `garment` cho 51 món; viết bất biến E1–E6 | TMC + TKT | WP-01 | `test-game-cosmetics.mjs` | 14.03 §4.3 |
| RISK-WP-03 | Bỏ dòng VIP «Ngự kiếm ngay»; `unlocked()` không đọc VIP cho quyền lợi cảnh giới | TMC | — | PR `wardrobe-ui.js`, `progress.js` | RISK-134 |
| RISK-WP-04 | `title` theo id; mở rộng `cleanName` (chuẩn hóa + nhóm F1–F9) | TMC + TCĐ | WP-07 | PR `protocol.js`; ca kiểm 200 + 200 | RISK-122 |
| RISK-WP-05 | Bỏ `?server=` khỏi bản phát hành; xóa `huyenquan:server` khi khởi động | TMC | — | PR `net.js` | RISK-129 |
| RISK-WP-06 | Token admin ra khỏi URL; CORS admin hẹp; khóa AI sang Secret; xoay token | TBM | — | PR `admin.js`, cấu hình | RISK-124, 125 |
| RISK-WP-07 | `safety/normalize.js` + bảng teencode | TMC | — | Mô-đun + test | 14.24 §2 |
| RISK-WP-08 | Gửi thư mời cố vấn (21 ứng viên, 7 ban) + gói giới thiệu | GĐSX + TND | — | Thư đã gửi | RISK-153 |
| RISK-WP-09 | Gửi câu hỏi luật sư (14.11 §13) | PC | — | Email | RISK-073, 074 |
| RISK-WP-10 | TAT gọi xác minh 115, 113, 111 và tìm 2 đường dây lắng nghe uy tín | TAT | — | `helplines.json` có `verifiedAt` | RISK-039 |
| RISK-WP-11 | Sửa hai lỗi engine Phụ lục B + test lá số Kiếp Tài | TMC | — | PR engine | RISK-161 |
| RISK-WP-12 | Thư ngỏ G0 hội đồng Tạng truyền; khóa thư mục `tangdia/` trong CI | GĐSX + TMC | — | Thư; quy tắc CI | RISK-014 |

## 2. M0 — tuần 2

| Mã | Việc | Chủ | Phụ thuộc | Đầu ra | Liên quan |
|---|---|---|---|---|---|
| RISK-WP-13 | `safety/crisis.js` (L0) + từ điển khởi đầu + gắn vào `master-ui.js` | TAI + TAT | WP-07 | Mô-đun; bộ CR offline đạt | RISK-037, 163 |
| RISK-WP-14 | Thẻ khủng hoảng, thẻ nhẹ, thẻ RB3, thẻ trẻ em (UI) | TMC + TAT | WP-10, WP-13 | UI + ảnh chụp | 14.09 §4 |
| RISK-WP-15 | `safety/output-filters.js` (bộ 1–3 ở pha stream; 4–8 sau) | TAI | WP-13 | Mô-đun; RT-216…225 đạt | 14.24 §4 |
| RISK-WP-16 | Thẻ persona Vân Cốc, Khổng tiên sinh, Thầy Tử Bình (JSON) + `persona-topics.js` | TAI | — | Tệp; PS-T01…07 | 14.14 |
| RISK-WP-17 | S0 có phiên bản; `ai.js` nhận `persona`, `gameContext` (mã + số), `toolsAllow`, `safety` | TAI | WP-16 | PR `ai.js` | 14.10 §1 |
| RISK-WP-18 | `safety/consent.js` + thẻ đồng ý AI + «hỏi bằng lá số mẫu» | TMC + PC | — | UI + test | RISK-059, 096 |
| RISK-WP-19 | Nhãn «AI», nút «Báo câu trả lời này» (hộp thoại đồng ý gửi) | TMC | — | UI | RISK-070, 100 |
| RISK-WP-20 | checkNeo NEO-6…10 + quy tắc hiển thị huy hiệu | TAI | — | PR `neo-checker.js` | RISK-051, 164 |
| RISK-WP-21 | `scripts/eval-ai-safety.mjs` + bộ đề RT tối thiểu 600, MA 80 | TAI + QA | WP-13…17 | Báo cáo lần 1 | RISK-072 |
| RISK-WP-22 | Mệnh Bàn dùng chuỗi 14.20 §1–§2; câu dẫn §4.7; bách phân vị trong «Vì sao?» | TND + TMC | — | UI + ảnh 3 lá số | RISK-031 |
| RISK-WP-23 | Viết lại cảnh «chưa nhận» (SC-04), khối 0.4 + thẻ phản đề (SC-03) | TND | — | Kịch bản | RISK-031, 035 |
| RISK-WP-24 | Cổng tuổi `age-gate.js` cho chat AI | TMC | — | Test năm sinh | RISK-040, 069 |
| RISK-WP-25 | Red-team con người lần 1 (5–10 người, 2 giờ) | TAI | WP-21 | Biểu mẫu phát hiện → đề mới | RISK-053 |
| RISK-WP-26 | Bảng nhà cung cấp AI + hồ sơ chuyển dữ liệu bản nháp | PC | — | Bảng; hồ sơ 14.22 | RISK-059, 078 |
| RISK-WP-27 | Chính sách quyền riêng tư bản nháp (14.17) gửi luật sư | PC | WP-26 | Bản nháp | RISK-077 |
| RISK-WP-28 | Ký M0 (14.13 §1.7) | GĐSX | tất cả | Biên bản | — |

## 3. M1 — tuần 3–6

| Tuần | Mã | Việc | Chủ | Liên quan |
|---|---|---|---|---|
| 3 | RISK-WP-30 | Dữ liệu `SACRED_ZONES` cho Sơn Môn; hành vi vùng thiêng (client + DO) | GĐSX + TMC | RISK-003 |
| 3 | RISK-WP-31 | Va chạm chống đứng lên tượng, hương án; test A* | QA + TMC | RISK-003 |
| 3 | RISK-WP-32 | Hàng đợi báo cáo trung tâm (`worker/reports.js`), TTL, hạn mức, lý do mới | TMC | RISK-109, 123 |
| 3 | RISK-WP-33 | Màn admin xử lý báo cáo + nhật ký thao tác | TMC + TCĐ | RISK-093 |
| 4 | RISK-WP-34 | Giới hạn kết nối WebSocket (IP, `pid`), hạn `hello` | TMC | RISK-121 |
| 4 | RISK-WP-35 | Màn «Dữ liệu của tôi» (xem, xuất, nhập, xóa, rút đồng ý) | TMC + PC | RISK-115, 132 |
| 4 | RISK-WP-36 | Điều khoản sử dụng + nội quy cộng đồng trong game; thẻ trước MMO | PC + TMC | RISK-093, LG-51 |
| 4 | RISK-WP-37 | Thái Tuế Điện, Vận Mệnh Các dùng chuỗi 14.20 §3–§4 | TND | RISK-016, 034 |
| 5 | RISK-WP-38 | Sổ Công Quá: bố thí tính theo lần; chuỗi nhận xét 14.20 §8; mô phỏng 30 ngày | TKT + TND | RISK-133 |
| 5 | RISK-WP-39 | Điểm danh không reset, ngày nghỉ; nhắc 90 phút | TKT + TMC | RISK-041 |
| 5 | RISK-WP-40 | Đặc Tính theo 14.20 §7 (bảng `shensha-perks.json` với tập 04) | TND | RISK-050 |
| 5 | RISK-WP-41 | `remote-config.js` + công tắc `personaKill`, `gameContext`, `amtaEnabled`, `taLoEnabled`, `catalogHidden` + diễn tập | TMC | 14.21 §0.2 |
| 6 | RISK-WP-42 | Ký thỏa thuận 4 ban cần cho M2 | GĐSX | RISK-153 |
| 6 | RISK-WP-43 | Bộ chữ phù hư cấu ≥ 120 nét | AD | RISK-008 |
| 6 | RISK-WP-44 | Hồ sơ đánh giá tác động xử lý dữ liệu hoàn thành | PC | RISK-LG-54 |
| 6 | RISK-WP-45 | Ký M1 (14.13 §2.7) | GĐSX | — |

## 4. M2–M6 — việc tuân thủ theo mốc

| Mốc | Mã | Việc chính | Chủ |
|---|---|---|---|
| M2 | RISK-WP-50 | Phiếu D1–D6 cho Long Hổ, Võ Đang, Bút Tháp; prototype nghi lễ cố vấn chơi thử | TND + HĐCV |
| M2 | RISK-WP-51 | Thông số thở được duyệt; đan, dược liệu hư cấu | TAT + TND |
| M2 | RISK-WP-52 | Ý kiến luật sư câu 1–5, 9, 10; quyết định phương án G1 | PC + GĐSX |
| M2 | RISK-WP-53 | Persona Long Hổ, Huyền Hư, Diệu Âm + bộ 40 câu giáo lý mỗi persona | TAI + HĐCV |
| M3 | RISK-WP-60 | Yên Tử, Văn Miếu, Mao Sơn, Chung Nam: phiếu duyệt; Bảng Vàng; đền Tổ sư Lỗ Ban | TND + AD |
| M3 | RISK-WP-61 | Tên cảnh giới hiển thị (quyết định HĐCV) | TND |
| M3 | RISK-WP-62 | Tài khoản P1; Thiên Bảng chỉ Đạo Hạnh, sự kiện máy chủ xác nhận | TMC |
| M3 | RISK-WP-63 | Huấn luyện điều hành viên; bài kiểm tra 14.19 §10 | TCĐ |
| M3 | RISK-WP-64 | Kết luận G1 hội đồng Tạng truyền hoặc chuyển dự phòng | GĐSX |
| M4 | RISK-WP-70 | Tà Lộ, Phong Đô, Miêu Cương: checklist 14.08 §4, 14.07 §4.4; ký ban SKTT, Tộc người | TND + HĐCV |
| M4 | RISK-WP-71 | Bộ lọc N1–N8 + red-team người lần 2 | TAI |
| M4 | RISK-WP-72 | Thử nghiệm kín nội dung nhạy cảm (14.18 §5) | TAT |
| M4 | RISK-WP-73 | Quyết định tách game khỏi app nghiên cứu | GĐSX + TPH |
| M5 | RISK-WP-80 | Tạng Địa theo G2–G5 hoặc Tuyết Vực dự phòng | GĐSX + HĐCV |
| M5 | RISK-WP-81 | Vĩ thanh duyệt liên ban | TND + HĐCV |
| M6 | RISK-WP-90 | Giấy phép G1 (nếu mở MMO ở VN); giờ chơi, xác thực | PC + TMC |
| M6 | RISK-WP-91 | Thanh toán: IAP, Play Billing, cổng web; sổ cái; điều kiện mua hàng | TKT + TMC + PC |
| M6 | RISK-WP-92 | Sư đồ, hợp hôn MMO theo 14.13 §7.2 | TMC + TAT |
| M6 | RISK-WP-93 | Diễn tập sự cố dữ liệu và AI SEV1 | TBM + TAI |

## 5. Đường găng

```
WP-07 normalize ─┬─▶ WP-04 lọc tên ──────────────────────────────▶ (M0 ký)
                 └─▶ WP-13 L0 ─▶ WP-14 thẻ ─┐
WP-16 persona ─▶ WP-17 ai.js ───────────────┼─▶ WP-21 eval ─▶ WP-25 red-team người ─▶ WP-28 ký M0
WP-13 ─▶ WP-15 bộ lọc đầu ra ────────────────┘
WP-08 thư mời cố vấn ─▶ (phỏng vấn tuần 3–5) ─▶ WP-42 ký thỏa thuận ─▶ M2 art (WP-50)
WP-09 câu hỏi luật sư ─▶ WP-52 quyết định G1 ─▶ (B/C) hồ sơ 14.25 ─▶ WP-90
WP-12 thư ngỏ Tạng ─▶ G1 (≤ cuối M2) ─▶ WP-64 ─▶ WP-80
```

| Mã | Quy tắc lịch |
|---|---|
| RISK-WP-R1 | Việc trên đường găng trễ → lùi mốc, không cắt cổng chặn (RISK-156). |
| RISK-WP-R2 | Việc cần người ngoài (cố vấn, luật sư) bắt đầu sớm nhất có thể vì thời gian phản hồi không kiểm soát được. |
| RISK-WP-R3 | Mỗi việc xong cập nhật trạng thái rủi ro liên quan trong sổ (14.01 §1.2) và bảng truy vết (14.23). |
