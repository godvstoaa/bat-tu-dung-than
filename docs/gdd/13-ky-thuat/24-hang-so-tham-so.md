# 13.24 · Phụ lục I — Bảng tra hằng số và tham số

> Mọi con số điều khiển hành vi hệ thống, gom một chỗ. Cột «Nguồn» là nơi giá trị sống trong code (hiện có) hoặc dữ liệu (đích). Cột «Ai đổi» là vai được quyết định đổi; đổi giá trị **cân bằng chơi** (Phúc Khí, Đạo Hạnh, công đức) phải qua tài liệu 04/05/09/11.

## I.1 Hiện có trong code (đo ngày 2026-11-05)

| Nhóm | Tham số | Giá trị | Nguồn | Ai đổi |
|---|---|---|---|---|
| Tọa độ | 1 ô | 1,6 m; ô (10, 7) ↔ mét (0, 0) | `court.js › U, toTile` | TD |
| Tọa độ | ô va chạm | 0,5 m | `obstacles.js › CELL` | TD |
| Tọa độ | ô A* | 0,5 ô = 0,8 m | `world.js › STEP` | CLI |
| A* | nút tối đa | 60.000 | `world.js › MAX_NODES` | CLI |
| A* | lề khung | 40 ô | `findPath › pad` | CLI |
| A* | đi thẳng khi xa | > 150 ô | `findPath` | CLI |
| Di chuyển | tốc độ đi | 3,5 ô/s (5,6 m/s) | `main.js › SPEED` | LVL |
| Di chuyển | bay | ×4 tốc độ; độ cao 3–420 m; leo 26 m/s | `main.js › step` | LVL |
| Va chạm | dải cắt lát | 0,4–2,0 m trên chân | `collide.js › addFootprint` | TD |
| Va chạm | thân người | 5 điểm, lệch 0,3 m | `obstacles.js › BODY` | CLI |
| Địa hình | thế giới | 2.048 m; `EDGE` 960; nước −6; biển mây −70 | `terrain.js` | TD (đổi ở TASK-126) |
| Địa hình | dốc đi được | 42° | `terrain.js › MAX_WALK_SLOPE` | LVL |
| Địa hình | chunk | 128 m, 16 × 16 | `world3d.js › CHUNK` | GFX |
| Địa hình | ngân sách dựng | 6 ms/khung | `world3d.js › buildSome` | GFX |
| Địa hình | skirt | 10 m | `buildChunkGeometry` | GFX |
| Cây | bán kính cây gần | 170 m; cập nhật khi đi 30 m | `world3d.js › updateTrees` | GFX |
| Kiến trúc | bán kính nạp quần thể | 900 m; kiểm mỗi 1,5 s | `landmarks.js › update` | GFX |
| LOD | ngưỡng `.lod` công trình trùm | `max(kích thước × 4, 80 m)` | `assets.js › placeLod` | GFX |
| LOD | nhân bản gần/xa | 90 m | `assets.js › instanceModelLod` | GFX |
| Đèn | nhóm đèn điểm | 6 / 10 / 16 (low/mid/high); 0,3 s; 140 m | `render3d.js › POOL_N` | GFX |
| Đèn | cường độ | trong điện × 14; ngoài trời × (1,2 + 16 × đêm) | `updateLightPool` | GFX |
| Camera | FOV | 45° (dọc 64°); near 0,3; far 9.000 | `render3d.js` | GFX |
| Camera | khoảng cách | 6–48 m, mặc định 15 | `cam.dist` | GFX |
| Camera | ngước | pitch −0,75 … 1,15 | `pointermove` | GFX |
| Làm mờ | opacity khi che | 0,22 | `render3d.js › fadeGroups` | GFX |
| Hiệu năng | tự hạ chất lượng | FPS < 35 trong 3 s (một chiều) | `render3d.js` | GFX (thay ở TASK-151) |
| Hiệu năng | tỉ lệ điểm ảnh | ≤ 1,5 cảm ứng, ≤ 2 bàn | `resize` | GFX |
| Nhãn | ẩn nhãn gian | > 220 m; tên người khác < 24 m | `render3d.js` | CLI |
| Nhân vật | cập nhật người khác | < 60 m | `render3d.js` | GFX |
| MMO | người/phòng | 60 | `protocol.ROOM_CAP` | SRV |
| MMO | số phòng | 50 | `protocol.MAX_ROOMS` | SRV |
| MMO | gửi vị trí | ≤ 8 Hz, đổi > 0,02 ô | `protocol.MOVE_HZ`, `net.tick` | SRV |
| MMO | giới hạn gói | 20/s → đóng 4002 | `protocol.MSG_PER_SEC` | SRV |
| MMO | kết nối lại | 1,5 s × 2^(n−1), trần 30 s, 6 nấc | `net.js › scheduleRetry` | SRV |
| MMO | nội suy | 3,5 × 1,35 ô/s; nhảy khi lệch > 4 ô | `net.tick`, `protocol.approach` | SRV |
| MMO | báo cáo | 500/phòng | `quan-room.js › MAX_REPORTS` | SRV |
| MMO | ẩn người | ≤ 200 mã | `net.js › block` | SRV |
| Trạng thái | Phúc Khí theo hành động | lá số 10, la bàn 5, xăm 3, nhang 5, lịch 2, đèn 3, 3 việc 5 | `state.js › REWARD` | tài liệu 11 |
| Trạng thái | trần | trà 15/ngày, xăm 3/ngày, hồ sơ 5, giữ 30 thẻ xăm, 50 đèn | `state.js › CAPS` | tài liệu 11 |
| Trạng thái | nhang cháy | 3 phút | `state.js › INCENSE_MS` | — |
| Trạng thái | danh xưng | 0 / 30 / 100 / 250 / 500 | `state.js › TITLES` | tài liệu 04 |
| Trạng thái | án | 3 khách/ngày, ≤ 15 × điểm; Án Cổ 25 khi ≥ 60%; sảnh 15 × điểm | `state.js › CASE_REWARD, DESK_REWARD` | tài liệu 09/11 |
| Trạng thái | đèn Thái Tuế | lần đầu 10, mỗi ngày 3 | `state.js › LAMP_REWARD` | tài liệu 09 |
| Tiến trình | xp cấp L | `20 × (L − 1)²` | `progress.js › xpFor` | tài liệu 11 |
| Tiến trình | gia trì | hào quang 2, linh khí 4, vệt 6, bay 8, pháp quang 10 | `progress.js › GIATRI` | tài liệu 09 |
| Tàng Y Các | Hợp mệnh | +10% Phúc Khí án/sảnh | `cosmetics.js › SET_BONUS` | tài liệu 11 |
| Tàng Y Các | điểm danh | 10, 15, 20, 25, 30, 40, 80 Ngọc | `cosmetics.js › CHECKIN` | tài liệu 11 |
| Tàng Y Các | VIP / quà cấp | 30 Ngọc/ngày; 20 Ngọc/cấp | `VIP_DAILY`, `LEVEL_GIFT` | tài liệu 11 |
| AI | giới hạn IP | 30 lần/phút | `worker/index.js` | SRV |
| AI | nhiệt độ | 0,55 | `ai.js › buildBody` | AI |
| AI | vòng tối đa | 6 vòng / 9 lần thử; lịch sử 8 lượt | `ai.js › askAI` | AI |
| AI | timeout tới header | 90 s | `worker/index.js › freeRoute` | SRV |
| Worker | giới hạn trang | 120 yêu cầu/phút/IP (KV) | `worker/index.js` | SRV (miễn tài sản game ở TASK-015) |
| Engine | Phẩm căn | 28 / 36 / 43 / 50 / 58 / 66 / 73 / 80 / 86 | `synthesis.js` | không đổi trong game (canon) |
| Engine | Phúc phận | ≥ 75 + tổ hợp cát; ≥ 60 + tổ hợp; ≥ 50; ≥ 41; ≥ 31; còn lại | `synthesis.js` | không đổi trong game |

## I.2 Mới (đích) — do tài liệu này đặt

| Nhóm | Tham số | Giá trị đề xuất | Nguồn đích | Ai đổi |
|---|---|---|---|---|
| Mệnh Bàn | hệ số Dụng / Kỵ | ×1,3 / ×0,8 | `menhban.js` (canon bản sơ đồ tổng §4.3) | tài liệu 04 |
| Cảnh giới | ngưỡng | 0 / 100 / 400 / 1.000 / 2.200 / 4.500 | `realm.js › REALM_CUTS` (canon §5) | canon |
| Cảnh giới | công thức | bậc ≤ 3: `T × 0,4 + D`; ≥ 4: `D` | `realm.js` | canon |
| Đạo Hạnh | hệ số Nghịch Thiên | `clamp(1 + (60 − T)/100, 1, 1,5)` | `menhban.js › nghichThien` | canon |
| Đạo Hạnh | đạo hợp Dụng / thử thách Kỵ / Thời Vận | ×1,1 / ×1,3 / ±10% | `realm.js › daoHanhGain` | tài liệu 04, 09 |
| Đạo Hạnh | trần ngày | 120 (đề xuất) | `data/realm.json › dailyCap` | tài liệu 09 |
| Đạo thống | tối đa | 3 | `realm.js › maxSchools` | canon |
| Sổ | mốc | 300 / 600 / 1.000 | `data/deeds.json › milestones` | canon |
| Sổ | trần mục cục bộ | 2.000; giữ 60 ngày gần nhất không gộp | `ledger.js` | CLI |
| Sổ | trần khai báo vào Thiên Bảng | 12 công/ngày; Đạo Hạnh khai báo ≤ 0,5 × trần ngày | `worker/hq/vault.js` | tài liệu 11 + SRV |
| Sổ | đồng hồ lệch tối đa | 48 giờ | `vault.syncLedger` | SRV |
| Lưu | khóa | `huyenquan:v2`; giữ `v1` | `save2.js` | TD |
| Lưu | ghi trễ | 800 ms | `save2.createSaver` | CLI |
| Lưu | ngân sách | ≤ 256 KB; `:corrupt` ≤ 3 bản | `save2.js` | CLI |
| Lưu đám mây | thân tối đa | 300 KB; giữ 5 bản; nhịp 5 phút | `vault.js`, `cloud.js` | SRV |
| Máy nhiệm vụ | bước tự động tối đa | 32 | `quests/runtime.js` | CLI |
| Máy nhiệm vụ | hàng đợi sự kiện chờ nạp | 64 | `runtime.js` | CLI |
| Máy nhiệm vụ | nhịp `tick` | 60 s | `main.js › refreshDay` | CLI |
| Máy nhiệm vụ | `hist` | 32 mục | `runtime.js` | CLI |
| Persona | `gameContext` | ≤ 600 ký tự | `persona.js` (canon bản sơ đồ tổng §6.1) | AI |
| Persona | brief `lite` / `none` | ≤ 12.000 / ≤ 1.500 ký tự | `ai.js` | AI |
| Persona | Mệnh Bàn rút gọn | ≤ 800 ký tự | `menhban.shortCard` | AI |
| Persona | nhiệt độ tối đa | 0,7 | SCHEMA-PERSONA | AI |
| Persona | ghi nhớ | 5 ghi chú × 120 ký tự / NPC | `persona.js` | AI |
| Persona | bỏ cả câu trả lời khi | ≥ 50% câu bị gỡ | `postFilter` | AI |
| AI | lượt/ngày | 10 thường / 30 VIP (cấu hình từ xa chỉ giảm) | `vault.consumeAiTurn` | tài liệu 11 |
| AI | bộ đệm KV | 24 giờ | `worker/hq/ai.js` | SRV |
| Ô cổng | nạp / dỡ nội thất | 60 m / 90 m | SCHEMA-BUILDING | LVL |
| Ô cổng | độ sâu duyệt cổng | 4 | `cells.js` | GFX |
| Ô cổng | cổng thấy từ ngoài | ≤ 40 m | `cells.js` | GFX |
| Ô cổng | chuyển mờ mái | 0,4 s | `cells.js` | GFX |
| Nội thất | lưới gian | 3,2 m | SCHEMA-INTERIOR-KIT | canon bản sơ đồ tổng §8.3 |
| Cửa | bán kính mở | 3 m (cửa chính) | SCHEMA-DOOR | LVL |
| Cửa | giờ | mở 卯, đóng 戌 | SCHEMA-DOOR | canon bản sơ đồ tổng §8.2 |
| Thế giới | kích thước | 4.608 m (±2.304); `EDGE` 2.080 (siêu elip bậc 4) | `terrain.js` | TD + tài liệu 07 |
| Streaming | ô | 256 m (18 × 18) | `stream.js` | GFX |
| Streaming | vòng N / M (mid) | 300 / 900 m; trễ × 1,3; bay > 60 m → 200 / 1.200 | `stream.planRings` | GFX |
| Streaming | yêu cầu GLB đồng thời | 4 | `stream.js` | GFX |
| Streaming | chờ truyền tống | ≤ 8 s | `stream.preload` | CLI |
| Địa hình | ô macro | 512 m, 16 đoạn, gộp 4 mesh | `world3d.js` | GFX |
| Va chạm | lưới bit | 32 KB/lớp/ô 256 m | `colgrid.js` | CLI |
| MMO v2 | AOI vào / ra | 120 / 140 m; ô băm 32 m | `quan-room.js` | SRV |
| MMO v2 | nhịp gộp | 125 ms (8 Hz); 5 Hz khi < 10 người (tùy chọn chi phí) | `quan-room.js` | SRV |
| MMO v2 | giới hạn theo gói | `mv` 10/s; `emo/say` 1/2 s; `cos` 1/5 s; `report` 5/phút; tổng 30/s | `protocol.js` | SRV |
| MMO v2 | đổi phòng vùng | sau 3 s ở vùng mới | `net.js` | CLI |
| Lễ tập thể | thời gian có mặt tối thiểu | 60 s | `quan-room.js` | tài liệu 10 |
| Môn phái | đệ tử tối đa / sư phụ | 5; sư phụ cảnh giới ≥ 4 | `sect.js` | canon bản sơ đồ tổng §10 |
| Tài khoản | token | 30 ngày; khóa cũ chấp nhận 7 ngày khi xoay | `auth.js` | SRV |
| Tài khoản | mã khôi phục | 16 ký tự base32 (80 bit); PBKDF2 100.000 vòng | `auth.js` | SRV |
| Tài khoản | xóa | trong 30 ngày | `auth.forget` | OWN |
| Ngọc | nhập số dư cũ | trần 2.000 (đề xuất) | `vault.js › NGOC_IMPORT_CAP` | tài liệu 11 |
| Phân tích | lô | ≤ 50 sự kiện, ≤ 1 lần/30 s, ≤ 64 KB | `analytics.js` | OPS |
| Phân tích | dải Tiềm Lực | < 28, 28–35, 36–45, 46–57, ≥ 58 | `analytics.js` | OPS + tài liệu 04 |
| Hiệu năng | ngân sách mid | 250 lượt vẽ, 600k tam giác, 180 MB texture, 20 ms khung | phần 09 §2.1 | TD |
| Hiệu năng | bộ điều chỉnh | hạ khi p90 > 1,15 × ngân sách 2 lần; nâng khi < 0,7 × trong 10 s; khóa 4 s | `quality-ctl.js` | GFX |
| Hiệu năng | ngưỡng hồi quy | tất định + 5%; FPS − 10% | `bench-scenes` | TD |
| Gói JS | `render3d` / `game` | ≤ 900 KB / ≤ 250 KB | `check-bundle` | OPS |
| Tải đầu | mid | ≤ 8 MB, ≤ 8 s | `check-bundle` | TD |
| Tài sản | texture | `.hd` ≤ 2.048, thường ≤ 1.024 (tượng 2.048), `.lod` ≤ 512, xa 256 | `validate-assets` | TA |
| Tài sản | bắt buộc `.lod` | > 20k tam giác | `validate-assets` | TA |
| Tài sản | credit mục tiêu/vùng | ≤ 450 | phần 10 §9.3 | PRD |
| Kiểm thử | thời gian job PR | ≤ 12 phút; job Worker ≤ 6 phút | CI | OPS |
| Kiểm thử | cách ly test chập chờn | 48 giờ | quy trình | QA |
| Vận hành | báo động lỗi Worker | 5xx > 1% trong 5 phút | phần 15 §5 | OPS |
| Vận hành | báo động AI | fallback > 20% trong 15 phút | phần 15 §5 | OPS |
| Vận hành | cấu hình từ xa | đệm 60 s (Worker), 2 phút (client) | `config.js` | SRV |

## I.3 Thuật ngữ kỹ thuật dùng trong tập

| Thuật ngữ | Nghĩa trong tập này |
|---|---|
| **Thuần (pure)** | module không đụng DOM, WebGL, mạng; chạy được bằng Node; test đơn vị được |
| **Ô cổng (portal cell)** | vùng không gian lồi trong công trình; nội thất chỉ vẽ khi camera ở trong hoặc nhìn qua cổng |
| **Phòng túi** | không gian dựng ngoài biên thế giới (x 2.600–3.600 m), vào bằng dịch chuyển; chỉ dùng cho cảnh đặc biệt |
| **Vòng N / M / F** | ba mức nạp theo khoảng cách của streaming (gần, vừa, xa) |
| **Nướng va chạm** | tính trước lưới ô đặc của công trình bằng script, nạp như dữ liệu |
| **`aid`** | khóa áp dụng của một hiệu ứng nhiệm vụ, chống áp hai lần |
| **Biên nhận** | chữ ký máy chủ xác nhận một việc tái hiện được (án, mini-game, có mặt, sư đồ) |
| **Đáng tin / khai báo** | điểm có biên nhận hoặc máy chủ ghi / điểm client tự ghi (có trần) |
| **AOI** | vùng quan tâm: chỉ gửi trạng thái người chơi trong bán kính |
| **Gói gộp `mvb`** | một thông điệp chứa vị trí nhiều người, gửi theo nhịp |
| **Cấu hình từ xa** | công tắc chỉ tắt/giảm, đọc từ KV, không thay nội dung |
| **Mốc (baseline)** | báo cáo hiệu năng đã duyệt để so hồi quy |
| **`ENGINE_V`** | phiên bản số liệu engine mà game đang dùng cho Mệnh Bàn |
| **`contentV`** | phiên bản dữ liệu nội dung (nhiệm vụ, thoại) của bản build |
