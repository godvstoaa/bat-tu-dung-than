# 13 · Kỹ thuật và sản xuất — Huyền Giới · Mệnh Do Ta Tạo

> Tập 13 của bộ tài liệu thiết kế `docs/gdd/`. Nở rộng §13 của bản sơ đồ tổng `docs/GAME-AAA-THIET-KE.md` (cùng Phụ lục A, B) theo canon `docs/gdd/00-KINH-DIEN-CHUNG.md`. Không gian tên mã của tập: **`TASK-xxx`**, **`SCHEMA-*`** (canon §9).
>
> Phiên bản 1.0 · 2026-11-05 · Căn cứ code nhánh `main` (gồm thay đổi chưa commit trong cây làm việc) tại thời điểm viết.

## 1. Phạm vi

Tập này trả lời: **game đang được xây thế nào (đúng code), sẽ được xây thế nào (đặc tả module, dữ liệu, thuật toán), ai làm gì trong bao lâu, đo và kiểm ra sao, vận hành và tốn bao nhiêu.**

Không thuộc phạm vi (thuộc tập khác): nội dung cốt truyện và thoại (03), ý nghĩa lối chơi của chỉ số (04), bảng việc thiện/nghiệp (05), giọng NPC (06), bố cục vùng và công trình (07, 08), mini-game (09), môn phái/lễ (10), giá và SKU (11), giao diện/âm thanh (12), rủi ro và cố vấn (14). Tập này định **định dạng dữ liệu** mà các tập đó đổ nội dung vào.

## 2. Mục lục

| Phần | Tệp | Nội dung |
|---|---|---|
| 01 | `01-kien-truc-hien-tai.md` | Kiến trúc hiện có: bản đồ 44 module, vòng lặp, hệ tọa độ, đường ống dựng hình (chunk, LOD, nhân bản, nhóm đèn, làm mờ), va chạm `collide.js` + `obstacles.js`, A*, lưu trữ và luật hydrate, MMO và Durable Object, proxy AI, bản build web/iOS, test, **23 phát hiện nợ kỹ thuật (D1–D23)** |
| 02 | `02-menhban-luu-tru.md` | `menhban.js` (SCHEMA-MENHBAN), «Vì sao?», thẻ công khai, cảnh giới và Đạo Hạnh, đặc tính, lưu v2 + di trú, bộ đệm lá số, **sửa hai lỗi engine Phụ lục B và một lớp lỗi cùng loại trong `ai.js`**, lá số mẫu dùng chung |
| 03 | `03-may-nhiem-vu.md` | Máy nhiệm vụ khai báo: SCHEMA-QUEST/NODE/COND/EFFECT/WINDOW/DIALOGUE, 13 loại nút, `dispatch` giao dịch + khóa `aid`, di trú nội dung, iOS, 20 luật kiểm, chuyển kịch bản Markdown → JSON, vết chạy mẫu |
| 04 | `04-so-cong-qua-thien-bang.md` | Sổ Công Quá (ba sổ tách bạch), mục sổ, đồng bộ hợp tập, mô hình tin cậy (local/receipt/server), biên nhận, Durable Object `ThienBang`, Nợ Âm |
| 05 | `05-persona-ai.md` | Lớp persona: thay đổi `askAI` (tương thích ngược từng byte), chế độ brief, `gameContext`, lọc công cụ, bộ lọc đầu ra 9 bước, cổng khủng hoảng, hạn mức máy chủ, bộ đệm, chi phí token, mẫu thông điệp |
| 06 | `06-noi-that-portal-cell.md` | Công trình đi vào được: 3 lớp model, SCHEMA-BUILDING/CELL/PORTAL/DOOR, thuật toán hiển thị qua cổng, chế độ trong nhà, **va chạm nhiều lớp + chủ sở hữu**, va chạm nướng sẵn, nội thất mô-đun, lộ trình Sơn Môn, Định nghĩa Done tự động |
| 07 | `07-streaming-vung.md` | Thế giới 4.608 m rìa siêu elip, địa hình 12 vùng mới, lưới streaming 256 m ba vòng, địa hình macro + Web Worker, đếm tham chiếu + LRU, ngân sách bộ nhớ, đồ thị đường, truyền tống, lưới bit va chạm, bảng vùng trên lưới |
| 08 | `08-may-chu-tai-khoan-mmo.md` | Tài khoản thiết bị + mã khôi phục, `PlayerVault`, lưu đám mây + gộp, quyền lợi và thanh toán (Apple/Stripe/VNPay), Ngọc do máy chủ quản, **MMO v2 (AOI + gói gộp)**, `SectHall`, phân tích tôn trọng quyền riêng tư, bảng API, staging |
| 09 | `09-hieu-nang.md` | Hạng thiết bị, ngân sách low/mid/high, số đo mốc, cảnh đo chuẩn, HUD và đo tự động, chống hồi quy (tất định vs phụ thuộc máy), 14 đòn bẩy tối ưu, bộ điều chỉnh chất lượng, phân bổ lượt vẽ theo cảnh, phòng thí nghiệm |
| 10 | `10-pipeline-tai-san.md` | Đường ống Meshy + CC0 + gltf-transform (tham chiếu từng script và tham số thật), quy ước tên, ngân sách theo lớp, kiểm tài sản, giấy phép, credit (lịch sử + dự báo), kho R2, kiểm kê 48 mô hình hiện có |
| 11 | `11-kiem-thu.md` | Chiến lược kiểm thử: đơn vị Node, tích hợp MMO/Worker, Playwright E2E, kiểm bản iOS, **kiểm chéo mã giữa 14 tập tài liệu**, mô phỏng, bảo mật, trợ năng, phân loại lỗi, phác thảo workflow CI |
| 12 | `12-task-m0.md` | Quy ước bảng việc + **M0: TASK-001 … TASK-070** |
| 13 | `13-task-m1-m2.md` | **M1: TASK-071 … 125 · M2: TASK-126 … 175** |
| 14 | `14-task-m3-m6.md` | **M3: 176 … 215 · M4: 216 … 245 · M5: 246 … 265 · M6: 266 … 290** |
| 15 | `15-van-hanh-chi-phi.md` | Đội ngũ và tải việc theo mốc, công cụ, CI/CD (triển khai production cần chủ dự án duyệt), nhánh, phiên bản, phát hành, giám sát, ứng phó sự cố + cấu hình từ xa, **mô hình chi phí** (AI, Cloudflare, Meshy), lộ trình 35 tuần, đường găng, danh sách kiểm phát hành |
| 16 | `16-json-schema-noi-dung.md` | Phụ lục A — JSON Schema chuẩn: chung, Mệnh Bàn, thẻ công khai, lưu v2, nhiệm vụ, điều kiện, hiệu ứng, trạng thái nhiệm vụ, thoại, bảng việc, mục sổ, biên nhận, Thiên Bảng, persona, đặc tính, lá số mẫu |
| 17 | `17-json-schema-the-gioi-may-chu.md` | Phụ lục B — JSON Schema: công trình, nội thất, va chạm nướng, vùng, ô streaming, đồ thị đường, token, lưu đám mây, quyền lợi, SKU, giao thức MMO v2, sự kiện, cấu hình từ xa, báo cáo hiệu năng, tài sản, giấy phép, chỉ mục nội dung |
| 18 | `18-giao-dien-module.md` | Phụ lục C — cây thư mục đích, luật phụ thuộc, chữ ký module, thay đổi module cũ, chia chunk, trình tự khởi động |
| 19 | `19-thuat-toan-chi-tiet.md` | Phụ lục D — mã giả: giờ can chi/âm lịch, ULID, băm, giao dịch, gộp sổ, `screenRect`, RLE, kế hoạch vòng, LRU, tìm đường hai tầng, AOI, ký token, gộp lưu, điều chỉnh chất lượng, tách câu, tìm lá số mẫu |
| 20 | `20-truy-vet-va-ca-kiem-thu.md` | Phụ lục E — truy vết yêu cầu → đặc tả → TASK; danh mục ca kiểm thử cụ thể; ma trận nền tảng × tính năng |
| 21 | `21-quy-trinh-san-xuat.md` | Phụ lục F — SOP: công trình, nhiệm vụ, persona, vùng, sửa engine, SKU, xoay khóa, bản iOS, cảnh đo, báo cáo MMO |
| 22 | `22-vi-du-du-lieu.md` | Phụ lục G — ví dụ dữ liệu đầy đủ (Chính Đường, nội thất, Long Hổ, Vân Cốc, ánh xạ `CONG_QUA`, hợp đồng kết quả gian, lô đồng bộ sổ, lịch tuần M0) |
| 23 | `23-trinh-tu-luong.md` | Phụ lục H — 11 sơ đồ trình tự các luồng chính và điểm lỗi |
| 24 | `24-hang-so-tham-so.md` | Phụ lục I — bảng tra mọi hằng số (hiện có và mới) + thuật ngữ kỹ thuật |
| 25 | `25-ke-hoach-di-tru.md` | Phụ lục J — 18 bước di trú từ hiện trạng sang đích, công tắc quay lui |
| 26 | `26-cau-hoi-mo.md` | Phụ lục K — 14 câu hỏi mở, phương án, khuyến nghị |
| 27 | `27-tham-chieu-script.md` | Phụ lục L — tham chiếu dòng lệnh của ~25 script mới, mã thoát, script npm cần thêm |

Thứ tự đọc gợi ý: kỹ sư mới đọc 01 → 18 → phần theo vai; sản xuất đọc README → 15 → 12–14 → 26; biên tập nội dung đọc 03 §9, 16, 21 F.2–F.3.

## 3. Tóm tắt

### 3.1 Hiện trạng (phần 01)

- Game là Three.js r170 chạy trong trang web (`game.html`) và trong lớp phủ của app iOS «Lữ Đăng» (`src/ios/shell.js`), dùng **trực tiếp engine Bát Tự của app** (`analyze()` 1,5 ms khi ấm). MMO là Durable Object `TownShard` (WebSocket Hibernation, 60 người/phòng). Thầy AI dùng `ai.js` của app qua proxy `/zai`.
- Nền tảng đã tốt để giữ: hợp đồng renderer, module thuần test được bằng Node, offline-first, cờ tính năng iOS, va chạm theo hình khối, nhóm đèn cố định.
- **Phát hiện chính khi rà code:**
  1. Lỗi chữ giản/phồn thể không chỉ ở `remedy-fate` (Phụ lục B) mà cả khối «tổ hợp kinh điển» trong brief của `ai.js`; lỗi `daozang` `R.yong.god` xác nhận có thật (D1–D3);
  2. Các điện «ngoài bản đồ» đặt đúng chỗ Long Hổ Sơn của canon (D4);
  3. Thế giới 2.048 m không chứa được thánh địa canon (D5);
  4. Va chạm một lớp, không gỡ được, chỉ có sau khi GLB nạp (D6);
  5. Giới hạn tốc độ KV của Worker đếm cả tệp GLB của game (D8);
  6. CI tự triển khai production mỗi lần push (D15);
  7. Không có bài tải 60 người dù canon ghi «đã có test» (D20);
  8. `admin.js` lưu ngày sinh vào KV khi app chính ghi sự kiện — game không được dùng đường này (D19).

### 3.2 Đích

- **Dữ liệu là trung tâm:** nhiệm vụ, thoại, persona, công trình, nội thất, vùng, bảng việc, SKU đều là JSON có schema chuẩn (phụ lục A, B), kiểm trong CI và kiểm chéo mã giữa 14 tập tài liệu.
- **Tất định và minh bạch:** Mệnh Bàn chỉ dẫn xuất từ engine; máy nhiệm vụ quyết mọi phần thưởng; AI chỉ nói (bộ lọc gỡ câu hứa thưởng, bán hàng, phán định mệnh).
- **Thế giới thật:** ô cổng + va chạm nhiều lớp nướng sẵn cho phép vào mọi công trình không dịch chuyển; streaming theo ô cho thế giới 4,6 km trong ngân sách 180 MB texture (mid).
- **Máy chủ tối thiểu nhưng đủ:** tài khoản thiết bị không cần thông tin định danh; điểm Thiên Bảng tách «đáng tin» và «khai báo»; Ngọc và đồ mua do máy chủ quản; phân tích không chứa ngày sinh.
- **Quy trình:** production chỉ triển khai khi chủ dự án duyệt; staging tự động; mọi bước di trú có công tắc lùi.

### 3.3 Con số

| Hạng mục | Giá trị |
|---|---|
| Bảng việc | **290 TASK**, **731,75 ngày công** lý tưởng, 7 mốc, **35 tuần** đề xuất (M0 3 tuần thay vì 2) |
| Biên chế đề xuất | 15–16 người (3 CLI, 1 GFX, 1–2 SRV, 1 AI/ENG, 1 TA, 2 ART, 2 LVL, 2 CNT, 1 QA, 0,5 OPS, TD, PRD) |
| Chi phí vận hành ước | ≈ 714 USD/tháng cho 1.000 DAU (AI chiếm > 90%), kịch bản đơn giá «vừa» (phải kiểm giá hiện hành) |
| Credit Meshy | ≈ 5.400 cho 10 thánh địa + dự phòng (số dư hiện 7) |
| Ngân sách mid | 250 lượt vẽ, 600k tam giác, 180 MB texture, 20 ms khung, tải đầu ≤ 8 MB |

## 4. Mã định danh mới

### 4.1 `TASK-xxx` (290 mã)

| Dải | Mốc | Tệp |
|---|---|---|
| TASK-001 … TASK-070 | M0 — Bản Mệnh (Mệnh Bàn, sửa engine, persona, mở đầu) | phần 12 |
| TASK-071 … TASK-125 | M1 — máy nhiệm vụ đầy đủ, Sổ Công Quá, Mệnh Đồ, nội thất Sơn Môn, tài khoản | phần 13 |
| TASK-126 … TASK-175 | M2 — thế giới 4,6 km, streaming, Long Hổ, Võ Đang, Bút Tháp | phần 13 |
| TASK-176 … TASK-215 | M3 — Yên Tử, Văn Miếu, Mao Sơn, Chung Nam, cảnh giới, MMO v2, Thiên Bảng | phần 14 |
| TASK-216 … TASK-245 | M4 — Tà Lộ, Phong Đô, Miêu Cương | phần 14 |
| TASK-246 … TASK-265 | M5 — Tạng Địa (có điều kiện), Côn Lôn, Vĩ thanh | phần 14 |
| TASK-266 … TASK-290 | M6 — môn phái, sư đồ, mùa, thanh toán | phần 14 |

Sửa lỗi engine Phụ lục B: **TASK-001** (`normGod`, `godsOf`), **TASK-002** (`remedy-fate` 劫財 + tàng can), **TASK-003** (`daozang` `yong.primary`), **TASK-004/005** (lint và sửa cùng lớp lỗi trong `ai.js` và tệp khác), **TASK-006** (test hồi quy).

### 4.2 `SCHEMA-*` (41 mã)

| Mã | Định nghĩa ở | Schema chuẩn |
|---|---|---|
| SCHEMA-MENHBAN | 02 §3 | A.2 |
| SCHEMA-EXPLAIN | 02 §5 | B.12 |
| SCHEMA-PUBLIC-CARD | 02 §5b | A.3 |
| SCHEMA-PERK-TABLE | 02 §7 | A.13 |
| SCHEMA-SAVE | 02 §8.2 | A.4 |
| SCHEMA-MAU-CHART | 02 §11 | A.13 |
| SCHEMA-QUEST | 03 §4 | A.5 |
| SCHEMA-WINDOW | 03 §4.1 | A.5 |
| SCHEMA-QUEST-NODE | 03 §5 | A.5 |
| SCHEMA-COND | 03 §6 | A.6 |
| SCHEMA-EFFECT | 03 §7 | A.7 |
| SCHEMA-QUEST-STATE | 03 §8 | A.8 |
| SCHEMA-DIALOGUE | 03 §9 | A.9 |
| SCHEMA-GAME-EVENT | 03 §10.2 | (bảng 03 §10.2) |
| SCHEMA-DEED-TABLE | 04 §2 | A.10 |
| SCHEMA-LEDGER-ENTRY | 04 §3 | A.10 |
| SCHEMA-RECEIPT | 04 §6.3 | A.11 |
| SCHEMA-TB-ROW | 04 §7.2 | A.11 |
| SCHEMA-PERSONA | 05 §4 | A.12 |
| SCHEMA-GAMECTX | 05 §5 | B.12 (đối tượng `allow`) |
| SCHEMA-BUILDING | 06 §3 | B.1 |
| SCHEMA-CELL | 06 §3.1 | B.1 |
| SCHEMA-PORTAL | 06 §3.2 | B.1 |
| SCHEMA-DOOR | 06 §3.3 | B.1 |
| SCHEMA-COLLISION-BAKE | 06 §7.2 | B.3 |
| SCHEMA-INTERIOR-KIT | 06 §8.1 | B.2 |
| SCHEMA-INTERIOR-LAYOUT | 06 §8.2 | B.2 |
| SCHEMA-REGION-MANIFEST | 07 §2.2 | B.4 |
| SCHEMA-STREAM-CELL | 07 §2.3 | B.4 |
| SCHEMA-NAVGRAPH | 07 §6.1 | B.4 |
| SCHEMA-TOKEN | 08 §2.3 | B.5 |
| SCHEMA-CLOUDSAVE | 08 §4.1 | B.5 |
| SCHEMA-ENTITLEMENT | 08 §5.2 | B.6 |
| SCHEMA-SKU-SERVER | 08 §5.2 | B.6 |
| SCHEMA-MSG-V2 | 08 §6 | B.7 |
| SCHEMA-EVENT | 08 §8.2 | B.8 |
| SCHEMA-PERF-REPORT | 09 §5.4 | B.10 |
| SCHEMA-ASSET | 10 §6 | B.11 |
| SCHEMA-LICENSE | 10 §8 | B.11 |
| SCHEMA-CONTENT-INDEX | 11 §7.4 | B.12 |
| SCHEMA-REMOTE-CONFIG | 15 §6.3 | B.9 |

Mã của tập khác được nhắc ở đây (`MQ-*`, `DEED-*`, `BLD-*`, `MOD-*`, `PERSONA-*`, `UI-xx`, `MG-xx`, `CUT-xxx`, `SKU-*`, `SEASON-xx`…) chỉ là **tham chiếu hoặc chỗ giữ minh họa**, không phải định nghĩa.

## 5. Phụ thuộc vào các tập khác

| Tập | Cần cung cấp cho tập 13 | Dùng ở |
|---|---|---|
| 03 | kịch bản đúng định dạng canon; số hiệu `MQ-*`, `BR-*`, `TL-*`, `CUT-xxx` | TASK-054, 113, 114, 162, 192, 229–231, 241, 255 |
| 04 | `PERK-*`, bảng Thời Vận (±10%), dải Tiềm Lực cho phân tích | 02 §7, 08 §8 |
| 05 | `DEED-*` + điểm (luật L1–L4), `CQ-*`, ngưỡng tiến độ đạo thống, trần ngày Đạo Hạnh | 04, 02 §6 |
| 06 | thẻ persona, 120 câu thử bộ lọc, 30 câu đánh giá mỗi persona | 05, TASK-048, 070 |
| 07 | `BLD-*`, `POI-*`, bố cục vùng, xác nhận Q2 | 06, 07 |
| 08 | `MOD-*`, `INT-*` | 06 §8 |
| 09 | `MG-xx`, `ACT-xx`, trần cày | TASK-164, 165, 188, 189, 232, 233, 250 |
| 10 | `GUILD-*`, `EV-*`, lịch lễ | 08 §7, TASK-203, 236, 257, 258 |
| 11 | `SKU-*`, `SEASON-xx`, giá, trần nhập Ngọc | 08 §5, TASK-266, 279 |
| 12 | `UI-xx`, `BGM-*`, `SFX-*`, thiết kế màn Mệnh Bàn | TASK-021, 172 |
| 14 | danh sách cố vấn, mẫu khủng hoảng, tài nguyên hỗ trợ, nội dung cấm Tà Lộ | 05 §6.3, §13.4, TASK-039, 234 |

## 6. Câu hỏi mở (chi tiết: phần 26)

Q1 kéo M0 thành 3 tuần (CLI và AI quá tải) · Q2 thế giới 4.608 m rìa siêu elip · Q3 cảnh giới không tụt khi Đạo Hạnh giảm · Q4 điểm việc thiện lệch `CONG_QUA` của engine (phóng sinh, khuyên thiện, «sửa cầu đường») · Q5 gửi dải Tiềm Lực cho phân tích khi có đồng ý · Q6 phạm vi «công khai» của Nợ Âm · Q7 Tà Lộ trên iOS · Q8 giữ renderer 2D · Q9 Sign in with Apple · Q10 hoàn tiền VNPay · Q11 quyền đầu ra Meshy theo gói · Q12 đơn giá hiện hành · Q13 gói AI «Coding Plan» có cho phục vụ người dùng cuối · Q14 trao đổi bát tự giữa hai người chơi.

## 7. Nhật ký

- 2026-11-05: phiên bản 1.0 — 27 phần + README; rà toàn bộ `src/game/*.js`, `worker/*.js`, `wrangler.jsonc`, `vite.config.js`, `package.json`, các script `test-*`, `meshy-*`, `ios-*`, `verify-ios-*`; chạy `npm run test:game`, `test-quan-protocol`, `test-terrain`, `test-game-cases`, `perf-timing.mjs` và engine trên lá số `MAU-A` để lấy số thật.
