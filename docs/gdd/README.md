# HUYỀN GIỚI · MỆNH DO TA TẠO — Bộ tài liệu thiết kế game (GDD) đầy đủ

Bản sơ đồ tổng `../GAME-AAA-THIET-KE.md` (≈1.000 dòng) chỉ là khung. Thư mục này là **bộ GDD chi tiết**: 14 tập, mỗi tập triển khai một mục của sơ đồ, tổng **127.713 dòng** (đếm `wc -l` ngày 2026-11-05).

Mọi số liệu lá số, tần suất, điểm số trong bộ tài liệu đều lấy từ **chạy engine thật** của app (`src/engine/*`), không bịa. Chỗ nào chưa chắc (luật, tín ngưỡng, ngày lễ) đều đánh dấu «cần xác minh / chờ tham vấn».

## 1. Đọc theo thứ tự nào

| Vai trò | Đọc trước | Đọc sau |
|---|---|---|
| Mọi người | `00-KINH-DIEN-CHUNG.md` (canon, 12 mục, có bảng đính chính §12) | `01-tam-nhin/README.md` |
| Thiết kế nội dung, biên kịch | 02 → 03 → 06 | 05, 10 |
| Thiết kế hệ thống | 04 → 05 → 09 | 11 |
| Thiết kế màn chơi, mỹ thuật | 07 → 08 | 12, 01 (phần mỹ thuật) |
| Lập trình | 13 | 04, 05, 08 (phần runtime), 10 (giao thức) |
| Sản xuất, pháp lý, vận hành | 14 → 11 | 13 (phần 12–15: TASK, chi phí) |

## 2. Mục lục 14 tập

| Tập | Thư mục | Dòng | Tệp | Nội dung chính |
|---|---|---:|---:|---|
| 00 | `00-KINH-DIEN-CHUNG.md` | 209 | 1 | Canon chung: trụ cột, mã vùng, NPC, công thức chỉ số, không gian tên mã, lá số mẫu, **đính chính** |
| 01 | `01-tam-nhin/` | 8.373 | 37 | Tầm nhìn, 6 trụ cột (69 câu kiểm, 169 ví dụ nên/không nên), 16 persona, bản đồ cảm xúc, kinh thánh văn phong từng đạo, ≈950 thuật ngữ, mỹ thuật 24 khóa ánh sáng giờ can chi, thị trường, chỉ số thành công |
| 02 | `02-the-gioi/` | 9.077 | 20 | Vũ trụ quan, lịch sử `HIS-001…100` qua 3 kỷ, địa lý 20 vùng, 32 phe `FAC-*`, 477 mục codex `LORE-*`, 22 văn bản trong game, 55 hỏi–đáp chuẩn cho AI |
| 03 | `03-cot-truyen/` | 8.976 | 14 | Kịch bản đầy đủ: mở đầu, 4 hồi, vĩ thanh (77 nhiệm vụ `MQ-*`), 4 nhánh mệnh cách `BR-*`, Tà Lộ `TL-*`, 48 cảnh cắt `CUT-*`, 9 vụ lừa của Định Mệnh Hội gắn mẫu phát hiện thật |
| 04 | `04-chi-so/` | 9.273 | 34 | Đặc tả chỉ số từ bát tự: Tiềm Lực, Phẩm căn, ngũ hành, perk sao `PERK-*`, «Vì sao?» (khớp 4.000/4.000 lá số), 15 lá số mẫu `MAU-A…O`, phân bố trên 5.000 lá số |
| 05 | `05-cai-menh/` | 8.972 | 31 | Nghịch Thiên Cải Mệnh: 3 tầng, Mệnh Đồ từ `gaimenhPlan`, Sổ Công Quá 245 `DEED-*`, 10 nghiệp `KARMA-*`, 9 con đường tu + bàng môn + lộ Liễu Phàm (≥15 `CQ-*` mỗi đường), Tà Lộ và chính lộ đối trị, cân bằng |
| 06 | `06-npc-ai/` | 9.607 | 20 | Đặc tả tầng AI (`askAI` + persona + gameContext + 8 bộ lọc + Neo), 20 NPC canon (bible, lịch, cây thoại, 417 bark), 44 NPC phụ có lá số thật, bộ thử đỏ 200 câu, kế hoạch đánh giá |
| 07 | `07-thanh-dia/` | 9.963 | 14 | 12 thánh địa + mở rộng Huyền Thành: 324 công trình `BLD-*`, 185 điểm `POI-*`, 244 prompt Meshy, đúng phong cách kiến trúc từng đạo thống |
| 08 | `08-cong-trinh/` | 8.575 | 26 | Quy chuẩn «không có công trình làm màu»: lớp A–E, đăng ký 124 công trình hiện có, pipeline vỏ/nội thất, cửa theo giờ can chi, 7 bộ kit kiến trúc (≈456 `MOD-*`), 30 kiểm thử tự động, lộ trình di trú P0–P7 |
| 09 | `09-tu-luyen/` | 9.149 | 17 | Cảnh giới, 24 mini-game `MG-01…24`, 125 hoạt động `ACT-*`, 40 khảo nghiệm, nhịp lên cấp đã mô phỏng (TL 60 → tầng 6 ngày 91) |
| 10 | `10-xa-hoi/` | 9.181 | 21 | Tông/chi đường `GUILD-*`, sư đồ, đồng tu, kim lan, hợp hôn (`computeHehun`), 276 câu có sẵn, 46 emote, 12 Thiên Bảng, 51 lễ hội `EV-*` (ngày 2027–2028 tính bằng lịch thật), giao thức MMO + Durable Object mới |
| 11 | `11-kinh-te/` | 8.284 | 25 | Hiến chương đạo đức (không bán mệnh), Phúc Khí/Ngọc nguồn–hút, mô phỏng 4 kiểu người chơi, ≈530 `SKU-*`, VIP, 12 mùa `SEASON-*`, thanh toán VN/quốc tế/IAP, phân tích, chống gian lận |
| 12 | `12-trinh-bay/` | 9.158 | 25 | 95 màn hình `UI-*` (wireframe dọc + desktop, 8 trạng thái), design system, camera, 105 `BGM-*`, ≈466 `SFX-*`, VFX, bản địa hóa, trợ năng |
| 13 | `13-ky-thuat/` | 9.475 | 28 | Kiến trúc hiện tại (23 nợ kỹ thuật) và đích (menhban, quest engine, merit ledger, persona AI, portal-cell, streaming 4,6 km, tài khoản), 41 `SCHEMA-*`, ngân sách hiệu năng, 290 `TASK-*` cho M0–M6 (≈732 ngày công) |
| 14 | `14-rui-ro/` | 9.650 | 29 | 175 `RISK-*`, quy tắc duyệt nội dung từng đạo thống, giới hạn Tà Lộ, sức khỏe tinh thần, an toàn AI (225 câu thử đỏ), pháp lý VN/Apple/Google, quyền riêng tư, danh mục kiểm M0–M6 |
| | **Tổng** | **127.713** | **342** | |

Mỗi tập có `README.md` riêng: mục lục, tóm tắt, danh sách mã mới, câu hỏi mở của tập đó.

Về độ dài: 14 tập đạt 83–100 % mục tiêu ≈10.000 dòng/tập. Phần lớn là bảng rộng, nhiều nội dung trên một dòng. Các tác giả dừng khi đủ mọi mục bắt buộc, thay vì độn chữ.

## 3. Sổ đăng ký mã (đếm mã khác nhau xuất hiện trong bộ tài liệu)

| Không gian tên | Tập sở hữu | Số mã | | Không gian tên | Tập sở hữu | Số mã |
|---|---|---:|---|---|---|---:|
| `LORE-*` | 02 | 478 | | `MOD-*` | 08 | 456 |
| `FAC-*` | 02 | 33 | | `INT-*` | 08 | 142 |
| `HIS-*` | 02 | 102 | | `MG-01…24` | 09 | 24 |
| `MQ-*` | 03 | 92 | | `ACT-*` | 09 | 174 |
| `BR-*` · `TL-*` · `CUT-*` | 03 | 37 · 32 · 49 | | `GUILD-*` · `EV-*` | 10 | 258 · 96 |
| `PERK-*` | 04 | 31 | | `SKU-*` · `SEASON-*` | 11 | 817 · 16 |
| `DEED-*` · `KARMA-*` · `CQ-*` | 05 | 274 · 17 · 345 | | `UI-*` · `SFX-*` · `BGM-*` | 12 | 149 · 404 · 179 |
| `NPC-*` · `PERSONA-*` · `BARK-*` | 06 | 272 · 21 · 106 | | `TASK-*` · `SCHEMA-*` | 13 | 293 · 41 |
| `BLD-*` · `POI-*` | 07 | 374 · 193 | | `RISK-*` | 14 | 1.281 lượt tham chiếu (175 rủi ro) |

Một số mã ở trên là tham chiếu chéo hoặc đề xuất «TBD» của tập khác, nên con số cao hơn số mã thực sự được định nghĩa. Một xung đột đã sửa khi rà soát: tập 01 từng dùng `MG-GIONG-xx` cho cảnh mẫu giọng, trùng không gian tên mini-game. Đã đổi thành `CMG-xx`.

## 4. Lỗi và vấn đề trong code hiện tại (phát hiện khi viết GDD)

Đây là việc thật cần làm, gom từ cả 14 tập. Mức độ: **C** = cần sửa trước khi thu tiền thật hoặc mở MMO rộng; **B** = sửa sớm; **A** = nên sửa.

| # | Mức | Vấn đề | Tệp | Tập phát hiện |
|---|---|---|---|---|
| L1 | C | Đồ thiêng đang bán làm trang phục, vài món khóa VIP: `quan_sen`, `aura_sen`, `dai_sen`, `y_tu`, và **«Bát Quái Pháp Luân» (`phap_luan`)** trùng tên phong trào bị cấm ở VN/TQ | `src/game/cosmetics.js` | 01, 11, 14 |
| L2 | C | MMO: trường `title` trong `hello` không được lọc → client sửa đổi hiện chữ tùy ý cho cả phòng | `src/game/protocol.js`, `worker/quan-room.js` | 10, 14 |
| L3 | C | `?server=` trên URL được lưu vĩnh viễn → link độc trỏ game sang server giả | `src/game/net.js` | 14 |
| L4 | C | CI tự triển khai Cloudflare (`wrangler deploy`) mỗi lần push `main` khi đã đặt secret `CLOUDFLARE_API_KEY`, trái quy tắc «triển khai cần chủ dự án duyệt» | `.github/workflows/cloudflare.yml` | 13 |
| L5 | B | MMO không kiểm sở hữu: ai cũng mặc được mọi món trong catalog | `cleanCos`, `quan-room.js` | 11 |
| L6 | B | Phòng Thái Tuế Điện ở x ≈ 2.000 m vượt `maxX` 1.920 m → server bỏ gói di chuyển, người khác không thấy ai đi lại | `world.js ROOMS`, `protocol.js` | 08, 10 |
| L7 | B | Màu áo/đai đồng bộ MMO để lộ Dụng thần/Hỷ thần của người chơi | `net.js`, `characters.js` | 10 |
| L8 | B | Báo cáo vi phạm không có người duyệt, lưu ID không hạn, quá 500/phòng thì âm thầm bỏ | `worker/quan-room.js` | 14 |
| L9 | B | Token admin truyền qua URL; `admin.js` lưu họ tên, ngày sinh, IP 90 ngày | `admin.js`, worker | 13, 14 |
| L10 | B | `TownShard` phát lại mọi gói di chuyển cho cả phòng (≈28.000 lượt gửi/giây khi đủ 60 người) | `worker/quan-room.js` | 10 |
| L11 | B | Danh hiệu và mở trà đọc **số dư** Phúc Khí → tiêu tiền làm tụt danh hiệu; nên đọc `xp` trọn đời | `state.js`, `stations.js` | 09, 11 |
| L12 | B | Xóa rồi thêm lại cùng lá số được +10 Phúc Khí không giới hạn; quà ngày và điểm danh theo đồng hồ máy | `state.js`, `cosmetics.js` | 11 |
| L13 | B | Engine: `'劫财'` (giản thể) và `'劫財'` (phồn thể) lệch nhau → bỏ sót Kiếp Tài | `remedy-fate.js` 180/198, khối tổ hợp kinh điển trong `ai.js`, `_PATTERN2CULT` | 05, 13 |
| L14 | B | Engine: `R?.yong?.god` phải là `.primary` | `daozang-data.js` 7962 | 05, 13 |
| L15 | B | Engine: `gaimenhPlan` không truyền năm thì tính Vận 8 thay vì Vận 9 | `gaimenh*.js` | 03 |
| L16 | B | Engine: `TAISUI_REMEDY` cách ③ khuyên trích máu; cảnh báo «nghiệp trộm» khớp 86,5 % lá số; nhánh «tà dâm» không bao giờ khớp | `taisui-*.js`, `remedy-fate.js` | 05 |
| L17 | A | Nhãn Hỷ thần lễ lật trụ đọc `yong.secondary` (MAU-A ra Mộc, engine nói Kim) | `src/game/main.js` | 12 |
| L18 | A | `.hq-tabs` khai báo 2 lần; một số màu chữ thiếu tương phản; Hỏa/Thổ gần như trùng với người mù màu đỏ–lục; emoji ⛩ (cổng Thần đạo Nhật) dùng cho cổng đại vận | `game.css`, `main.js` | 12 |
| L19 | A | Bố cục Sơn Môn: 4 tháp cắt vào tường, sạp chợ chắn cửa nhà, hai tháp thư lâu chồng nhau, trà quán Cùng Thông và cầu Huyền Hà chưa có va chạm, cửa hai điện bên nhìn vào tường đá 4 m | `sect.js`, `landmarks.js` | 08 |
| L20 | A | Rate-limit KV 120/phút/IP của Worker đếm cả tệp GLB của game | `worker/index.js` | 13 |
| L21 | A | Lỗi chính tả trong chữ engine («Quù Cương», «Thiên Xư», «KHÔ đoán»); nhãn 下格 có «bần tiện», game không được hiển thị | `src/engine/*` | 01, 04 |

Kế hoạch sửa các lỗi trên nằm trong `13-ky-thuat/` (TASK-001…006 cho lỗi engine; các mục còn lại ánh xạ vào M0). Tôi **chưa sửa code** nào trong danh sách này.

## 5. Quyết định chủ dự án cần đưa ra (gom và bỏ trùng từ 14 tập)

**Nội dung và tín ngưỡng**
1. **Tạng truyền:** ai tham vấn và hạn chót? Nếu không lập được hội đồng trước cuối M3 thì chuyển sang vùng dự phòng (tập 14 đã có phương án). (07, 08, 10, 12, 14)
2. Tên «Miêu Cương» (ngoại danh) và trang phục H'Mông/Tạng: chỉ dùng khi có thỏa thuận cộng đồng? (05, 07, 11, 14)
3. Vân Cốc là vị thiền sư lịch sử trong *Liễu Phàm tứ huấn* hay người kế thừa danh hiệu? Đề xuất: người kế thừa, để không đặt lời mới vào miệng người thật. Tương tự với «Trương Thiên Sư», Cát Huyền. (01, 03, 14)
4. Đổi tên VIP «Chân Nhân» (danh hiệu đạo sĩ) thành «Thượng Khách»; đổi tên các món ở L1. (11, 14)

**Hệ thống**

5. Mở đầu «Sơn Môn từ chối» áp lên ≈51 % người chơi: giữ hay làm mềm? (04)
6. Cảnh giới có được tụt không (khi Đạo Hạnh giảm, hoặc khi sửa giờ sinh)? Canon nói «chỉ lên». (04, 13)
7. Cổng cốt truyện: Phong Đô mở ở cảnh giới 4 hay 5; Côn Lôn ở 5 hay 6; có ra tầng 1–3 ngay M2 không? (03, 09)
8. Mốc reset ngày: 0 giờ hay giờ Tý (23:00)? Giờ MMO cố định UTC+7 hay theo máy? (09, 10, 12)

**Thế giới và kỹ thuật**

9. Mở rộng thế giới lên ≈4,4–4,6 km rìa vuông/siêu elip trước M2. (07, 13)
10. M0 kéo thành 3 tuần; M1 chỉ gồm nền móng + 4 công trình mẫu, phần còn lại của Sơn Môn sang M2. (08, 13)

**Pháp lý và vận hành**

11. MMO tại VN là game G1: tắt MMO ở VN (mặc định), đi qua nhà phát hành có phép, hay tự xin giấy phép? (14)
12. Stripe không nhận doanh nghiệp VN: lập pháp nhân nước ngoài hay dùng cổng thẻ VN? (11)
13. Gói z.ai «Coding Plan» có được phục vụ người dùng cuối không? Giá token thật của `glm-5.3`? Nơi xử lý và thời gian lưu dữ liệu của các nhà cung cấp AI dự phòng? (06, 13, 14)
14. Xác minh danh sách đường dây hỗ trợ tâm lý VN (hiện chỉ 111, 113, 115 là chắc); ngưỡng tuổi cho chế độ thiếu niên, cách xác nhận người lớn. (06, 14)
15. Bản iOS: game tách thành app riêng trước M4? Hồi III «Năm Thử» có qua được 4.3(b)? Có ẩn Tiềm Lực/Phẩm căn trên iOS không? (01, 05, 14)

## 6. Đính chính canon

Xem `00-KINH-DIEN-CHUNG.md §12`. Tóm tắt: `MAU-A` sinh tháng Tỵ (辛巳); điểm công/quá theo engine `CONG_QUA`; Dị Cách kích hoạt bằng `pattern.type === 'special'`; luôn truyền năm cho `gaimenhPlan`; lịch âm đối chiếu UTC+7; các phòng ngoài bản đồ phải chuyển vào công trình thật.
