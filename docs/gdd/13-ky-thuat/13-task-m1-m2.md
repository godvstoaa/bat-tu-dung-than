# 13.13 · Bảng việc M1 và M2 (TASK-071 … TASK-175)

> Quy ước mã, vai, cách ước lượng: xem đầu phần 12.

## M1 — «Sổ Công Quá, Mệnh Đồ, máy nhiệm vụ, Hồi I, thật hóa nội thất Sơn Môn» (4 tuần)

**Tiêu chí đóng mốc:**
1. Mọi công trình Sơn Môn trong bảng §8.4 bản sơ đồ tổng đạt Định nghĩa Done (`test-building-dod` xanh + ảnh duyệt);
2. Hồi I chơi hết được với 4 lớp (`sim-quests` + chơi thử);
3. Sổ Công Quá và Mệnh Đồ hoạt động, mốc 300 phát sự kiện;
4. Tài khoản thiết bị + hạn mức AI máy chủ + lưu đám mây hoạt động;
5. Không phòng túi nào còn ở dải x 1.500–2.000.

---

### TASK-071 · Dời phòng túi khỏi dải Long Hổ
- **Mô tả:** Đổi `origin` của `ROOMS` sang dải x 2.600–3.600 m; cập nhật `WORLD_TILES.maxX = 10 + 2250`; máy chủ kiểm biên mới (D4, phần 06 §1).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** — · **Vai:** CLI
- **Nghiệm thu:** `test-game-state › Điện thờ` xanh; MMO chấp nhận vị trí trong điện mới; không còn điện nào trong bán kính 400 m quanh (1.500, −200).

### TASK-072 · Va chạm nhiều lớp
- **Mô tả:** Khóa ô có lớp, `blockedByBuilding(x, z, layer)`, `surfaceAt`, `addRamp`, `player.layer`, `groundY(x, z, nearY)` (phần 06 §5.1–5.2).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** — · **Vai:** CLI
- **Nghiệm thu:** `test-obstacles-layers` xanh; Sơn Môn hiện tại không đổi hành vi (test cũ xanh).

### TASK-073 · Chủ sở hữu ô và `removeOwner`
- **Mô tả:** `withOwner`, chỉ mục ngược, gỡ theo chủ (phần 06 §5.1).
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** TASK-072 · **Vai:** CLI
- **Nghiệm thu:** hai chủ chung một ô, gỡ một chủ ô vẫn đặc; gỡ cả hai ô trống.

### TASK-074 · `placeTransform` thuần và `collide-core.js`
- **Mô tả:** Tách công thức đặt model (tỉ lệ, dời đáy) và phần cắt lát/raster khỏi THREE để dùng chung trình duyệt và Node.
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** — · **Vai:** CLI
- **Nghiệm thu:** `collide.js` gọi `collide-core.js`; kết quả va chạm Sơn Môn trong trình duyệt khớp trước khi tách (đếm ô bằng nhau).

### TASK-075 · `bake-collision.mjs` và nạp va chạm nướng sẵn
- **Mô tả:** Script phần 06 §7.3 (NodeIO + meshoptimizer), định dạng SCHEMA-COLLISION-BAKE, `--check` theo `srcHash`; client nạp trước GLB (D6).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-073, TASK-074 · **Vai:** TA (CLI hỗ trợ)
- **Nghiệm thu:** `test-bake` xanh; vào game mạng chậm 3G giả lập không đi xuyên Chính Đường trước khi GLB nạp.

### TASK-076 · A* nhiều lớp
- **Mô tả:** Nút `(layer, i, j)`, cạnh đổi lớp ở cầu thang, heuristic có |Δlayer| (phần 06 §5.3).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-072 · **Vai:** CLI
- **Nghiệm thu:** `test-astar-layers` xanh; đường lên tầng 2 đi qua cầu thang.

### TASK-077 · `cells.js`: `cellAt`, hiển thị qua cổng
- **Mô tả:** Phần 06 §4.1–4.3; `screenRect` cắt mặt near; độ sâu 4; `stats()`.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-081 · **Vai:** GFX
- **Nghiệm thu:** `test-cells` xanh; ≤ 0,15 ms/khung với 6 công trình (đo HUD).

### TASK-078 · Chế độ trong nhà
- **Mô tả:** Ẩn mái/tầng trên, camera kẹp đa giác ô, sương, ánh sáng nền, tắt thế giới ngoài khi không thấy cổng (phần 06 §4.4).
- **Ước lượng:** 2,5 ngày · **Phụ thuộc:** TASK-077 · **Vai:** GFX
- **Nghiệm thu:** vào/ra không giật (khung tối đa < 50 ms); camera không xuyên tường trong 10 lần thử xoay.

### TASK-079 · Đèn theo ô cổng
- **Mô tả:** `addLight({ cell })`, bí danh `room`; chọn đèn ưu tiên ô thấy được (phần 06 §6).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-077 · **Vai:** GFX
- **Nghiệm thu:** trong Chính Đường đèn nến sáng, đèn ngoài sân không chiếm chỗ nhóm.

### TASK-080 · Cửa là vật thật
- **Mô tả:** SCHEMA-DOOR, xoay bản lề, lịch giờ can chi (Mão mở, Tuất đóng), cửa ngách, va chạm cửa theo chủ, hoãn đóng khi có người.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-073, TASK-077 · **Vai:** CLI
- **Nghiệm thu:** `__hq.clock.set(giờ Tuất)` → cửa chính đóng, cửa ngách mở; hai người chơi MMO cùng giờ thấy cùng trạng thái.

### TASK-081 · Nạp SCHEMA-BUILDING và `validate-buildings`
- **Mô tả:** Loader, đổi tọa độ cục bộ, kiểm ô lồi, cổng trên ranh giới, ngân sách (phần 06 §3, §10, §12).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** — · **Vai:** CLI
- **Nghiệm thu:** bắt 8 lỗi dữ liệu mẫu (ô lõm, cổng lệch, thiếu tầng…).

### TASK-082 · Dựng nội thất mô-đun
- **Mô tả:** Loader SCHEMA-INTERIOR-KIT/LAYOUT; gom mô-đun thành InstancedMesh theo ô; va chạm mô-đun.
- **Ước lượng:** 2,5 ngày · **Phụ thuộc:** TASK-081 · **Vai:** GFX
- **Nghiệm thu:** lượt vẽ nội thất một ô ≈ số loại mô-đun khác nhau (± 2).

### TASK-083 · `interior-fit.mjs`
- **Mô tả:** Lấy lòng nhà từ va chạm nướng, khớp lưới gian 3,2 m, đặt cột và mô-đun bắt buộc theo hạng (phần 06 §8.3).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-075, TASK-082 · **Vai:** TA
- **Nghiệm thu:** bản nháp cho `palace_grand` đặt cột không đè cửa; LVL sửa được trực tiếp.

### TASK-084 · Bộ mô-đun «Đạo quán phương Bắc» bản đầu
- **Mô tả:** 20 mô-đun thủ công cho Sơn Môn (cột, đấu củng, xà, thần khám, bồ đoàn, hương án, kệ kinh, chuông khánh…) theo `MOD-*` của tài liệu 08; atlas một texture.
- **Ước lượng:** 8 ngày · **Phụ thuộc:** — · **Vai:** ART
- **Nghiệm thu:** `validate-assets` xanh; mỗi mô-đun ≤ 6k tam giác; duyệt phong cách.

### TASK-085 · Khoét cửa các vỏ Sơn Môn
- **Mô tả:** `palace_grand`, `hall_main`, `lib_pavilion2`, `gate_sect`, bảo tháp: khoét cửa (Blender boolean), đặt tên mesh `__roof`, `__floorN`, `__door_*`; đóng gói với `--join false --flatten false`.
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-145 (cờ đóng gói, làm sớm trong M1) · **Vai:** ART
- **Nghiệm thu:** A5 xanh; ảnh lát cắt thấy lòng trong.

### TASK-086 · `test-building-dod.mjs`
- **Mô tả:** Kiểm tự động Định nghĩa Done (phần 06 §11) trên dữ liệu nướng.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-075, TASK-076, TASK-081 · **Vai:** QA
- **Nghiệm thu:** chạy cho mọi `BLD-thanh-*`; báo đúng công trình còn thiếu tương tác.

### TASK-087 · Các loại nút còn lại
- **Mô tả:** `station`, `case`, `deed`, `minigame`, `parallel`, `cutscene`, `aiTalk` (phần 03 §5.1).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-027 · **Vai:** CLI
- **Nghiệm thu:** nhiệm vụ mẫu dùng đủ 13 loại nút chạy trong `test-quest-runtime`.

### TASK-088 · Cửa sổ thời gian, lặp, iOS, nhạy cảm, di trú
- **Mô tả:** `window`, `repeat`, `ios`/`iosNodes`, `sensitive`, `migrate`, `checkpoints` (phần 03 §4, §11, §12).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-087 · **Vai:** CLI
- **Nghiệm thu:** `test-quest-ios`; nút bị xóa có `migrate` chuyển đúng; không có thì lùi checkpoint.

### TASK-089 · Validator nội dung đủ V1–V20
- **Mô tả:** Hoàn thiện luật phần 03 §13 (V6 chứng minh phủ cạnh, V14 so phiên bản trước, V16 lớp không kẹt).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-030, TASK-088 · **Vai:** CLI
- **Nghiệm thu:** 20 lỗi mẫu bị bắt; chạy toàn bộ dữ liệu < 5 s.

### TASK-090 · `sim-quests.mjs`
- **Mô tả:** Bot 4 lớp + `lop = null`, tua đồng hồ cho `wait`, chạy hằng đêm (phần 11 §9).
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** TASK-088 · **Vai:** QA
- **Nghiệm thu:** chạy hết Hồi I với 5 lá số; báo nút kẹt kèm trace.

### TASK-091 · `ledger.js` và bảng việc
- **Mô tả:** Client sổ (phần 04 §4), `deeds.json` + luật L1–L4, mốc, gộp tháng.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-018 · **Vai:** CLI
- **Nghiệm thu:** `test-ledger`, `test-deeds-table` xanh.

### TASK-092 · Màn Sổ Công Quá
- **Mô tả:** Danh sách theo ngày, «Vì sao?» trích `CONG_QUA`/`LIAOFAN_STORY`, thanh mốc 300/600/1.000, ô Nợ Âm riêng.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-091 · **Vai:** CLI
- **Nghiệm thu:** chạy 390 × 844; mục bị trần ngày hiện ghi chú.

### TASK-093 · Màn Mệnh Đồ
- **Mô tả:** 6 nút từ `gaimenhPlan(R)` (thứ tự cố định), chẩn đoán nguyên văn `diagnosis[].d`, việc làm nối nhiệm vụ (`acts[]` → id nhiệm vụ do tài liệu 05 ánh xạ), độ ưu tiên `pri` (bản sơ đồ tổng §5.1).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-087, TASK-091 · **Vai:** CLI
- **Nghiệm thu:** lá số tốt vẫn có nút «Tích âm đức»; phát sự kiện phân tích `menhdo_layer`.

### TASK-094 · Sổ đời thực (tùy chọn)
- **Mô tả:** Tắt mặc định; ghi theo `CONG_QUA`; tính bằng `meritLedger`; không thưởng, không đồng bộ, không phân tích (phần 04 §1).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-091 · **Vai:** CLI
- **Nghiệm thu:** bật/tắt được; test chặn mạng: không yêu cầu nào chứa dữ liệu sổ đời thực.

### TASK-095 · Xác thực thiết bị, token, mã khôi phục
- **Mô tả:** `/api/hq/auth/device|refresh|recover|rotate|forget`, SCHEMA-TOKEN, PBKDF2 cho mã (phần 08 §2).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-096 · **Vai:** SRV
- **Nghiệm thu:** `test-hq-auth` xanh; giới hạn khôi phục 5/giờ/IP.

### TASK-096 · `PlayerVault` Durable Object
- **Mô tả:** Bảng SQLite phần 08 §3.1, `summary`, `setConsent`, migration `hq-v2` trong `wrangler.jsonc` (OWN duyệt).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** — · **Vai:** SRV
- **Nghiệm thu:** chạy `wrangler dev`; tạo/đọc/xóa vault; dung lượng một vault mẫu < 300 KB.

### TASK-097 · Hạn mức AI phía máy chủ và cấu hình từ xa
- **Mô tả:** `/api/hq/ai/chat` → `consumeAiTurn` → backend hiện có; hoàn lượt khi lỗi; fail-open có ghi (phần 05 §7). Thêm `GET /api/hq/config` (SCHEMA-REMOTE-CONFIG, phần 15 §6.3): công tắc tính năng, danh sách nhiệm vụ/persona tạm tắt, `minClient`; đọc từ KV, đệm 60 s.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-095 · **Vai:** SRV
- **Nghiệm thu:** `test-quota` xanh; stream không đổi độ trễ (± 50 ms); tắt một nhiệm vụ qua KV → client ẩn nó trong ≤ 2 phút, không cần triển khai.

### TASK-098 · Bộ đệm AI cho câu mở đầu
- **Mô tả:** KV 24 giờ cho câu trong `cacheableQuestions`; không lưu câu tự do (phần 05 §8).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-097 · **Vai:** SRV
- **Nghiệm thu:** lần thứ hai cùng câu trả về ≤ 200 ms, không trừ lượt.

### TASK-099 · Lưu đám mây
- **Mô tả:** `PUT/GET /api/hq/vault/save`, `mergeSaves`, 409, lọc ngày sinh theo `consent.cloudBirth` (phần 08 §4).
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-096, TASK-018 · **Vai:** SRV (CLI phần client)
- **Nghiệm thu:** `test-hq-save`, `test-merge-saves` xanh; hai trình duyệt cùng tài khoản gộp đúng.

### TASK-100 · Đồng bộ Sổ Công Quá
- **Mô tả:** `/api/hq/ledger/sync`, hợp tập, trần ngày tính lại, từ chối đồng hồ lệch (phần 04 §5).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-091, TASK-096 · **Vai:** SRV
- **Nghiệm thu:** `test-ledger-merge` xanh; `sendBeacon` khi `pagehide` gửi được lô cuối.

### TASK-101 · Chính Đường: dữ liệu công trình
- **Mô tả:** `BLD-thanh-*` cho Chính Đường: ô, cổng, 2 tầng, cầu thang, cửa, đèn.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-081, TASK-085 · **Vai:** LVL
- **Nghiệm thu:** `validate-buildings` xanh; đi vào/ra không dịch chuyển.

### TASK-102 · Chính Đường tầng 1: Tổ Sư đường
- **Mô tả:** Bài vị tổ, sổ môn phái, hương án; nội thất theo bộ mô-đun; ≥ 3 tương tác (hạng A).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-101, TASK-084 · **Vai:** LVL (ART hỗ trợ)
- **Nghiệm thu:** Định nghĩa Done ý 1–4.

### TASK-103 · Chính Đường tầng 2: tàng kinh
- **Mô tả:** Kệ kinh, trạm tra cổ thư (`library-data`), cầu thang lên.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-101, TASK-076 · **Vai:** LVL
- **Nghiệm thu:** tới được tầng 2 bằng A*; trạm mở được.

### TASK-104 · Dời Bàn Thầy vào trong
- **Mô tả:** Trạm `thay` vào Chính Đường; bệ ngoài giữ làm chỗ tiếp ban ngày; cập nhật `court.js`, nhãn, test.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-102 · **Vai:** CLI
- **Nghiệm thu:** E2 xanh với vị trí mới; MMO ghế/START không lệch.

### TASK-105 · Vận Mệnh Các trong vỏ điện phụ Tây
- **Mô tả:** Dựng hành lang 9 cổng + bia trong `hall_main` Tây (thay phòng túi); giữ `roomData`; iOS vẫn tắt.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-101 (mẫu), TASK-085 · **Vai:** LVL (CLI hỗ trợ)
- **Nghiệm thu:** `test-game-vanmenh` xanh; cổng đại vận đúng số; không còn `door_vanmenh` dịch chuyển.

### TASK-106 · Thái Tuế Điện trong vỏ điện phụ Đông
- **Mô tả:** Như TASK-105 cho Thái Tuế Điện, đèn an Thái Tuế.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-105 · **Vai:** LVL
- **Nghiệm thu:** thắp đèn, thêm dầu hoạt động; iOS tắt.

### TASK-107 · Lầu chuông, lầu trống
- **Mô tả:** Tầng 2, cầu thang, chuông/trống tương tác; chuông sớm giờ Mão, trống chiều giờ Dậu thưởng Phúc Khí (sự kiện MMO làm ở M3).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-076, TASK-085 · **Vai:** LVL
- **Nghiệm thu:** đánh chuông đúng giờ nhận thưởng một lần/ngày.

### TASK-108 · Bốn bảo tháp góc
- **Mô tả:** Tầng trệt (bia tháp), cầu thang lên tầng ngắm cảnh, chuông gió theo hành người chơi.
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-076, TASK-085 · **Vai:** LVL
- **Nghiệm thu:** lên đỉnh được; chuông gió đổi theo `robe`.

### TASK-109 · Phòng gác Sơn Môn và Hậu Môn
- **Mô tả:** Hai phòng gác mỗi cổng; Lão Tùng ở cổng trước.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-085, TASK-052 · **Vai:** LVL
- **Nghiệm thu:** Định nghĩa Done hạng B.

### TASK-110 · 30 nhà vườn đi vào được
- **Mô tả:** Mỗi nhà một `BLD-thanh-xx`; vỏ vẫn nhân bản; nội thất + cửa riêng nạp ≤ 60 m, dỡ > 90 m.
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-082, TASK-077 · **Vai:** LVL (CLI hỗ trợ)
- **Nghiệm thu:** đi dọc phố không giật > 50 ms khi nạp/dỡ; mỗi nhà ≥ 1 tương tác.

### TASK-111 · Gia đình NPC trong nhà vườn
- **Mô tả:** Mỗi nhà một gia đình sinh từ `makeNpc`; án phong thủy tại nhà theo hướng nhà thật (`zhai`, `xuankong`).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-110 · **Vai:** CNT (CLI hỗ trợ)
- **Nghiệm thu:** hướng nhà lấy từ `ry` của bản sao; đáp án án do engine tính.

### TASK-112 · Chính Điện Tam Thanh trong Hậu Sơn
- **Mô tả:** Dựng trong `cliff_palace`, bỏ phòng túi tương ứng; dời Thầy Giải Quẻ (web).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-085, TASK-082 · **Vai:** LVL
- **Nghiệm thu:** vào thẳng từ cửa Hậu Sơn; tượng thần tải khi ≤ 60 m.

### TASK-113 · Nhập liệu Hồi I
- **Mô tả:** `MQ-1-*` từ tài liệu 03 (nhiệm vụ + thoại + cảnh cắt cơ bản).
- **Ước lượng:** 6 ngày · **Phụ thuộc:** TASK-087, TASK-029 · **Vai:** CNT
- **Nghiệm thu:** validator xanh; `sim-quests` hết Hồi I.

### TASK-114 · Nhập liệu nhánh mở đầu theo Mệnh Cách
- **Mô tả:** `BR-TT/DC/NT/DK-01…` của Hồi I (tài liệu 03).
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-113 · **Vai:** CNT
- **Nghiệm thu:** mỗi lớp có nhánh riêng; V16 xanh.

### TASK-115 · Persona Hồi I bổ sung
- **Mô tả:** Mở rộng `PERSONA-van_coc` (Mệnh Đồ, Sổ Công Quá) và persona NPC Hồi I theo tài liệu 06; thoại thay thế.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-048 · **Vai:** CNT
- **Nghiệm thu:** đánh giá 30 câu mỗi persona đạt như TASK-070.

### TASK-116 · Ảnh chuẩn Định nghĩa Done
- **Mô tả:** Playwright chụp 4 góc + trong nhà theo `dod.photos` cho công trình Sơn Môn.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-102 … TASK-112 · **Vai:** QA
- **Nghiệm thu:** đủ ảnh trong `docs/art/thanh/`.

### TASK-117 · Đo hiệu năng nội thất
- **Mô tả:** Cảnh S2, S7 vào `bench-scenes`; kiểm ngân sách hạng A/B.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-046, TASK-102 · **Vai:** GFX
- **Nghiệm thu:** ≥ 30 khung/giây trong nhà ở máy mid (bản sơ đồ tổng §8.5 ý 5).

### TASK-118 · Đường phân tích của game
- **Mô tả:** Client lô sự kiện, `/api/hq/ev`, binding `HQ_EVENTS`, mã định danh HMAC phía máy chủ, tôn trọng đồng ý (phần 08 §8).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-095, TASK-059 · **Vai:** SRV (CLI phần client)
- **Nghiệm thu:** `test-ev` xanh; không đồng ý → không có định danh, không có `band/lop`.

### TASK-119 · Bảng chỉ số cơ bản
- **Mô tả:** DAU, phễu cổng, tỉ lệ mở Mệnh Đồ, lượt AI theo chế độ brief.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-118 · **Vai:** OPS
- **Nghiệm thu:** bảng đọc được từ dữ liệu thử.

### TASK-120 · Test Worker (xác thực, quyền)
- **Mô tả:** `test-hq-auth`, `test-hq-save`, `test-worker-authz` trong CI job `wrangler dev`.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-095, TASK-099 · **Vai:** QA
- **Nghiệm thu:** chạy CI < 6 phút; token của A không truy cập vault B.

### TASK-121 · Truy vấn chỉ số thành công
- **Mô tả:** SQL giữ chân D7 theo dải Tiềm Lực, tỉ lệ Mệnh Đồ, Neo trung bình; kiểm cú pháp SQL API thực tế (phần 08 §8.4).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-118 · **Vai:** OPS
- **Nghiệm thu:** ba truy vấn chạy trên dữ liệu thử, kết quả khớp đếm tay.

### TASK-122 · `verify-ios-game` cho nội thất mới
- **Mô tả:** Vận Mệnh Các/Thái Tuế Điện vẫn không vào được trên iOS khi đã nằm trong vỏ thật (cửa khóa hoặc nội thất thay bằng điện thờ không bói).
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** TASK-105, TASK-106 · **Vai:** QA
- **Nghiệm thu:** script xanh.

### TASK-123 · Hồ sơ hiệu năng iPhone thật trong nhà
- **Mô tả:** Safari Web Inspector + Instruments khi vào Chính Đường, Vận Mệnh Các trên iPhone mid.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-117 · **Vai:** QA
- **Nghiệm thu:** báo cáo bộ nhớ, khung/giây; không bị hệ điều hành đóng WebContent.

### TASK-124 · Mua gói credit Meshy cho M2
- **Mô tả:** Theo dự báo phần 10 §9.3 (≈ 450 credit/vùng × 3 vùng M2 + dự phòng).
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** — · **Vai:** OWN
- **Nghiệm thu:** `meshy-gen balance` ≥ 1.600 credit trước tuần 1 của M2.

### TASK-125 · Đóng mốc M1
- **Mô tả:** `validate-ids`, tổng hợp kiểm, ghi chú phát hành, xin duyệt triển khai.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** mọi TASK M1 · **Vai:** PRD
- **Nghiệm thu:** tiêu chí đóng mốc M1 đạt; OWN duyệt triển khai.

---

## M2 — «Thế giới mở rộng, Long Hổ, Võ Đang, Bút Tháp, Hồi II» (6 tuần)

**Tiêu chí đóng mốc:**
1. Thế giới 4,6 km, siêu elip, 12 vùng mới có địa hình (chưa cần công trình hết);
2. Streaming theo ô: ngâm bộ nhớ 3 vòng không rò rỉ; tải lần đầu ≤ 8 MB (mid);
3. Ba thánh địa Long Hổ, Võ Đang, Bút Tháp đi hết không kẹt, mỗi công trình đạt Định nghĩa Done;
4. Ba chuỗi đạo thống (Chính Nhất, Thanh Vi · Đan Đỉnh, Tịnh Độ) chơi xong; Hồi II chơi được;
5. Cố vấn ba truyền thống duyệt nội dung.

---

### TASK-126 · Địa hình 4.608 m, rìa siêu elip
- **Mô tả:** `WORLD`, `HALF`, `EDGE`, hàm `r₄`, biển mây mới (phần 07 §1.2) (D5).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** — · **Vai:** CLI
- **Nghiệm thu:** `test-terrain` cũ xanh trong vùng cũ (|Δh| ≤ 0,5 m tại tâm 8 vùng cũ); tâm 12 vùng mới đi được.

### TASK-127 · Nướng lại va chạm và ảnh rìa
- **Mô tả:** Chạy `bake-collision --check --all`, nướng lại công trình bị ảnh hưởng; chụp lại ảnh chuẩn vùng rìa cũ.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-126, TASK-075 · **Vai:** TA
- **Nghiệm thu:** `--check` không còn tệp cũ.

### TASK-128 · 12 vùng mới trong `REGIONS`
- **Mô tả:** Tham số bảng phần 07 §1.3; kiểu mới `danxia`, `hills`, `hill`; thứ tự áp; `SKY_ISLANDS`.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-126 · **Vai:** CLI
- **Nghiệm thu:** bình đài phẳng; `vancoc` thành núi nhỏ sau Hậu Sơn mà sân Sơn Môn không đổi độ cao.

### TASK-129 · Biên MMO mới
- **Mô tả:** `WORLD_TILES` theo phần 07 §1.2; máy chủ và client cùng hằng số.
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** TASK-126 · **Vai:** SRV
- **Nghiệm thu:** `test-quan-protocol` thêm ca biên; vị trí ở Văn Miếu được chấp nhận.

### TASK-130 · Mở rộng `test-terrain`
- **Mô tả:** Ca phần 07 §10 dòng 1; hiệu năng `heightAt` với 20 vùng.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-128 · **Vai:** QA
- **Nghiệm thu:** 50.000 lần < 400 ms (nếu vượt, làm lưới băm vùng trong cùng task).

### TASK-131 · Sông, sân trống, rừng vùng mới
- **Mô tả:** Kéo dài Huyền Hà tới Phong Đô; `CLEARINGS`, `treeDensity` cho quảng trường, sân chùa.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-128 · **Vai:** CLI
- **Nghiệm thu:** không cây mọc trên sân, đường.

### TASK-132 · Streamer và dỡ kiến trúc
- **Mô tả:** `stream.js` (phần 07 §4.1), vòng N/M/F, trễ 1,3; `landmarks` chuyển sang trạng thái theo ô, có dỡ (D7).
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-136, TASK-137 · **Vai:** CLI
- **Nghiệm thu:** `test-stream-plan` xanh; ngâm bộ nhớ quay về ± 10%.

### TASK-133 · Kho R2 cho tài sản phát hành
- **Mô tả:** Bucket R2 + tên miền con, tải lên theo `models/index.json`, `modelUrl` đổi gốc; gỡ `public/models` khỏi git ở commit riêng (D10).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-016 · **Vai:** OPS (SRV hỗ trợ, OWN duyệt chi phí)
- **Nghiệm thu:** game tải mọi GLB từ R2; repo nhỏ hơn ≥ 160 MB ở lần clone mới (sau khi lịch sử được xử lý theo quyết định của OWN).

### TASK-134 · Sinh địa hình trong Web Worker
- **Mô tả:** `terrain-worker.js`, chuyển `ArrayBuffer`, `epoch` hủy yêu cầu cũ, dự phòng luồng chính (phần 07 §3.4).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-126 · **Vai:** GFX
- **Nghiệm thu:** không còn tác vụ dài > 50 ms do dựng chunk khi bay.

### TASK-135 · Địa hình macro 512 m
- **Mô tả:** 81 ô macro gộp thành 4 mesh; bỏ dựng toàn bộ chunk lúc khởi động (phần 07 §3.2).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-134 · **Vai:** GFX
- **Nghiệm thu:** lượt vẽ địa hình ≤ 30 ở S4.

### TASK-136 · `build-stream.mjs` và SCHEMA-STREAM-CELL
- **Mô tả:** Sinh kê khai 324 ô từ dữ liệu vùng/công trình/đạo cụ.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-081 · **Vai:** CLI
- **Nghiệm thu:** mọi công trình có trong đúng một ô; `bytes` ước lệch < 15% so tải thật.

### TASK-137 · Đếm tham chiếu và LRU tài sản
- **Mô tả:** `acquire/release`, dispose hình học/vật liệu/texture, bộ đếm GPU MB (phần 07 §4.2–4.3).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** — · **Vai:** CLI
- **Nghiệm thu:** `renderer.info.memory` giảm sau khi dỡ ô.

### TASK-138 · Lưới bit va chạm theo ô
- **Mô tả:** `Uint8Array` 32 KB/lớp/ô, OR rastơ, dựng lại khi thêm/bớt (phần 07 §7.1).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-073 · **Vai:** CLI
- **Nghiệm thu:** `test-colgrid`: kết quả `solidAt` khớp bản `Map` trên Sơn Môn.

### TASK-139 · Chuyển 3 việc hằng ngày sang dữ liệu
- **Mô tả:** `tasks()` của `state.js` → `DQ-01…03` trong `dq.json`; giữ thưởng và chuỗi ngày như cũ.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-088 · **Vai:** CNT (CLI hỗ trợ)
- **Nghiệm thu:** `test-game-state › Nhiệm vụ ngày` xanh không sửa kỳ vọng.

### TASK-140 · Đồ thị đường và tìm đường dài
- **Mô tả:** `build-nav.mjs`, SCHEMA-NAVGRAPH, `findPathLong` (phần 07 §6).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-136 · **Vai:** CLI
- **Nghiệm thu:** `test-nav` xanh; bấm vào Long Hổ từ Huyền Thành đi tới nơi không dừng giữa núi.

### TASK-141 · Trận truyền tống và tải trước
- **Mô tả:** Mỗi vùng một trận (mở khi đã tới), `streamer.preload`, màn chờ ≤ 8 s.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-132 · **Vai:** CLI
- **Nghiệm thu:** tới nơi luôn có va chạm; không rơi xuống đất chưa dựng.

### TASK-142 · Bóng quần thể xa (impostor)
- **Mô tả:** `build-skyline.mjs` cho mỗi vùng (phần 07 §3.3).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-148 · **Vai:** TA
- **Nghiệm thu:** mỗi tệp ≤ 3.000 tam giác; nhìn từ Huyền Thành thấy bóng Long Hổ.

### TASK-143 · Biến thể texture KTX2
- **Mô tả:** `gltf-transform` UASTC/ETC1S; `KTX2Loader` + transcoder; chọn biến thể theo mức (phần 09 §7 đòn bẩy 3).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-016 · **Vai:** TA (GFX hỗ trợ)
- **Nghiệm thu:** GPU texture ở S3 mức mid giảm ≥ 50%; chất lượng duyệt bằng mắt.

### TASK-144 · Atlas bộ mô-đun
- **Mô tả:** Mỗi bộ một atlas 2.048; công cụ đóng atlas.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-084 · **Vai:** TA
- **Nghiệm thu:** bộ «Đạo quán phương Bắc» dùng 1 texture.

### TASK-145 · Đóng gói giữ tên mesh cho vỏ
- **Mô tả:** `meshy-pack` thêm chế độ `shell` với `--join false --flatten false`; `test-pack` (phần 10 §2.6, §12). Làm sớm đầu M1 vì TASK-085 cần.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** — · **Vai:** TA
- **Nghiệm thu:** tên `__roof` còn sau đóng gói.

### TASK-146 · `validate-assets.mjs`
- **Mô tả:** Luật A1–A10 (phần 10 §5).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-147 · **Vai:** TA
- **Nghiệm thu:** chạy trong CI; bắt tệp vượt tam giác, thiếu giấy phép.

### TASK-147 · `licenses.json` và bằng chứng CC0
- **Mô tả:** Chuyển `LICENSES.md` sang dữ liệu; ảnh chụp trang giấy phép; mục cho mọi tệp Meshy (gói, ngày tạo).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** — · **Vai:** TA (OWN xác nhận điều khoản gói Meshy)
- **Nghiệm thu:** A1 xanh cho 94 tệp hiện có.

### TASK-148 · Long Hổ: vỏ công trình
- **Mô tả:** 2 vỏ hạng A (4K) + 6 vỏ B/C theo tài liệu 07; khoét cửa; đóng gói.
- **Ước lượng:** 6 ngày · **Phụ thuộc:** TASK-124, TASK-145 · **Vai:** ART
- **Nghiệm thu:** `validate-assets` xanh; credit thực tế ghi sổ.

### TASK-149 · Võ Đang: vỏ công trình
- **Mô tả:** Như TASK-148 cho Võ Đang (Kim Điện, cung quán dọc thần đạo).
- **Ước lượng:** 6 ngày · **Phụ thuộc:** TASK-124, TASK-145 · **Vai:** ART
- **Nghiệm thu:** như TASK-148.

### TASK-150 · Nhân vật: cắt khung nhìn, màu bằng uniform, mức xa
- **Mô tả:** Bật culling với khung cầu mở rộng; shader đổi màu dùng uniform một chương trình; > 40 m dùng mẫu tĩnh; 20–40 m hoạt cảnh ½ nhịp (D17).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** — · **Vai:** GFX
- **Nghiệm thu:** S6 (60 người) mid: chương trình shader nhân vật = 1; khung/giây tăng ≥ 20% so mốc.

### TASK-151 · Bộ điều chỉnh chất lượng thích ứng
- **Mô tả:** Phần 09 §8, thay hạ chất lượng một chiều (D18).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-045 · **Vai:** GFX
- **Nghiệm thu:** `test-quality-ctl` xanh; không khung giật > 100 ms khi đổi nấc.

### TASK-152 · Bộ đệm Service Worker cho tài sản game
- **Mô tả:** SW riêng phạm vi game, ngân sách 300 MB, LRU, chỉ tên có băm.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-016 · **Vai:** CLI
- **Nghiệm thu:** lần vào thứ hai offline vẫn tải được Sơn Môn.

### TASK-153 · Bút Tháp: vỏ công trình
- **Mô tả:** Theo tài liệu 07 (chùa Việt, cầu đá, tháp).
- **Ước lượng:** 5 ngày · **Phụ thuộc:** TASK-124, TASK-145 · **Vai:** ART
- **Nghiệm thu:** như TASK-148.

### TASK-154 · Bộ mô-đun «Đạo quán Giang Nam»
- **Mô tả:** Cho Long Hổ (cột gỗ trầm, cửa bức bàn, giếng trời, bàn phù, tủ lệnh bài).
- **Ước lượng:** 8 ngày · **Phụ thuộc:** TASK-144 · **Vai:** ART
- **Nghiệm thu:** ≥ 25 mô-đun; atlas; duyệt phong cách.

### TASK-155 · Bộ mô-đun «Chùa Việt»
- **Mô tả:** Cho Bút Tháp (vì kèo giá chiêng, cốn chạm, tượng tam thế, mõ, chuông).
- **Ước lượng:** 8 ngày · **Phụ thuộc:** TASK-144 · **Vai:** ART
- **Nghiệm thu:** như TASK-154; tượng qua cố vấn (A9).

### TASK-156 · Dựng vùng Long Hổ
- **Mô tả:** Dữ liệu `regions/longho.json`, BLD, POI, đường, đạo cụ, nội thất, NPC đặt chỗ.
- **Ước lượng:** 8 ngày · **Phụ thuộc:** TASK-148, TASK-154, TASK-132 · **Vai:** LVL
- **Nghiệm thu:** Định nghĩa Done mọi công trình; ngân sách vùng mid đạt.

### TASK-157 · Dựng vùng Võ Đang
- **Mô tả:** Như TASK-156; thần đạo dài từ chân lên Kim Điện.
- **Ước lượng:** 8 ngày · **Phụ thuộc:** TASK-149, TASK-084, TASK-132 · **Vai:** LVL
- **Nghiệm thu:** như TASK-156.

### TASK-158 · Dựng vùng Bút Tháp
- **Mô tả:** Như TASK-156.
- **Ước lượng:** 6 ngày · **Phụ thuộc:** TASK-153, TASK-155, TASK-132 · **Vai:** LVL
- **Nghiệm thu:** như TASK-156.

### TASK-159 · Persona và thoại NPC ba vùng
- **Mô tả:** `truong_thiensu`, `huyen_hu`, `dan_dinh`, `dieu_am`: dữ liệu persona + thoại thay thế (tài liệu 06).
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-048 · **Vai:** CNT
- **Nghiệm thu:** đánh giá 30 câu mỗi persona; `forbid` riêng (辟穀, «phù trị bệnh», «quả báo» đe dọa) hoạt động.

### TASK-160 · Sổ credit và gỡ URL khỏi `state.json`
- **Mô tả:** `credits.jsonl`, `credits-report.mjs`; chuyển các trường URL ký sẵn sang tệp bị git bỏ qua (phần 10 §2.1, §9.4).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** — · **Vai:** TA
- **Nghiệm thu:** `state.json` trong git không còn `*Glb`; báo cáo credit theo vùng.

### TASK-161 · Danh sách công trình trùm một nguồn
- **Mô tả:** Gộp `HD_IDS` (`assets.js`) và `HD` (`meshy-pack.mjs`) vào manifest (`hd: true`).
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** — · **Vai:** TA
- **Nghiệm thu:** chỉ còn một danh sách; đóng gói và nạp cho cùng kết quả.

### TASK-162 · Nhập liệu Hồi II
- **Mô tả:** `MQ-2-*` phần ba vùng M2 (tài liệu 03).
- **Ước lượng:** 8 ngày · **Phụ thuộc:** TASK-113 · **Vai:** CNT
- **Nghiệm thu:** validator + `sim-quests` hết phần Hồi II có trong M2.

### TASK-163 · Nhập liệu chuỗi đạo thống ba đạo
- **Mô tả:** `CQ-*` Chính Nhất, Thanh Vi · Đan Đỉnh, Tịnh Độ (tài liệu 05/09).
- **Ước lượng:** 6 ngày · **Phụ thuộc:** TASK-087 · **Vai:** CNT
- **Nghiệm thu:** mỗi chuỗi chơi xong; Đạo Hạnh chịu trần ngày.

### TASK-164 · Mini-game kết phù
- **Mô tả:** Ghép 5 phần phù đúng thứ tự/hành (tài liệu 09, `MG-xx`); ký tự hư cấu (canon T6); kết quả `minigameEnd`.
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-087 · **Vai:** CLI
- **Nghiệm thu:** chấm điểm tất định; không có ký tự phù thật.

### TASK-165 · Mini-game tĩnh tọa
- **Mô tả:** Nhịp thở giữ–thả, tạp niệm bay qua (tài liệu 09); Định Lực ảnh hưởng độ khó.
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-087 · **Vai:** CLI
- **Nghiệm thu:** chạy 30 khung/giây trên low; chế độ giảm chuyển động.

### TASK-166 · Phòng MMO theo vùng
- **Mô tả:** `town-<region>-<n>`, đổi socket sau 3 s ở vùng mới (phần 07 §8).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-129 · **Vai:** SRV (CLI phần client)
- **Nghiệm thu:** hai người ở hai vùng không thấy nhau; về cùng vùng thì thấy.

### TASK-167 · Đo vùng mới và ngâm bộ nhớ
- **Mô tả:** S4, S5 (3 vùng), ngâm 3 vòng (phần 07 §10).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-156 … TASK-158 · **Vai:** QA
- **Nghiệm thu:** báo cáo đạt ngân sách mid; không rò rỉ.

### TASK-168 · Test thế giới
- **Mô tả:** `test-nav`, `test-stream-plan`, `test-colgrid` vào CI.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-132, TASK-138, TASK-140 · **Vai:** QA
- **Nghiệm thu:** xanh trong CI.

### TASK-169 · Kiểm tải lần đầu ≤ 8 MB
- **Mô tả:** `check-bundle` đo dữ liệu vào S1 mức mid sau streaming và R2.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-132, TASK-133 · **Vai:** OPS
- **Nghiệm thu:** ≤ 8 MB; báo cáo theo thành phần.

### TASK-170 · Duyệt cố vấn ba truyền thống
- **Mô tả:** Chính Nhất, Thanh Vi · Đan Đỉnh, Tịnh Độ: nội dung, tượng, nghi lễ trong game (tài liệu 14).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-156 … TASK-163 · **Vai:** PRD (OWN ký)
- **Nghiệm thu:** biên bản duyệt; mục sửa đóng hết.

### TASK-171 · Tượng thần mới (nếu tài liệu 07 yêu cầu)
- **Mô tả:** Meshy `style: false` + duyệt cố vấn A9.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-124 · **Vai:** ART
- **Nghiệm thu:** `review.advisor` có tên, ngày.

### TASK-172 · Âm thanh vùng
- **Mô tả:** Nối `BGM-*` của tài liệu 12 theo `audioZones`; đổi theo giờ can chi.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-136 · **Vai:** CLI
- **Nghiệm thu:** chuyển vùng đổi nhạc mượt (≥ 2 s).

### TASK-173 · `load-quan.mjs` và mốc tải trên v1
- **Mô tả:** Script bài tải (phần 08 §6.5), chạy trên giao thức v1 làm mốc so sánh.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** — · **Vai:** QA
- **Nghiệm thu:** báo cáo thông điệp/s, trễ p95 với 60 client v1.

### TASK-174 · Ảnh Định nghĩa Done ba vùng
- **Mô tả:** Playwright chụp theo `dod.photos`.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-156 … TASK-158 · **Vai:** QA
- **Nghiệm thu:** đủ ảnh; duyệt.

### TASK-175 · Đóng mốc M2
- **Mô tả:** Kiểm tiêu chí; `validate-ids`; ghi chú phát hành; xin duyệt triển khai.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** mọi TASK M2 · **Vai:** PRD
- **Nghiệm thu:** tiêu chí M2 đạt; OWN duyệt.
