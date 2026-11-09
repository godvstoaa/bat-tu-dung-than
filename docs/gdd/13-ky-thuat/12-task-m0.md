# 13.12 · Bảng việc M0 (TASK-001 … TASK-070)

## Quy ước chung cho ba tệp bảng việc (12, 13, 14)

- **Mã:** `TASK-xxx`, đánh số liên tục theo mốc: M0 001–070 · M1 071–125 · M2 126–175 · M3 176–215 · M4 216–245 · M5 246–265 · M6 266–290.
- **Ước lượng:** ngày công lý tưởng của một người đúng vai (không gồm duyệt và chờ). Tổng theo mốc ở phần 15 §8.
- **Phụ thuộc:** TASK phải xong trước; «—» = không có.
- **Vai** (chi tiết phần 15 §1):

| Mã vai | Vai |
|---|---|
| TD | Giám đốc kỹ thuật |
| CLI | Kỹ sư client / gameplay (Three.js, DOM) |
| GFX | Kỹ sư đồ họa / hiệu năng |
| SRV | Kỹ sư máy chủ (Worker, Durable Object) |
| ENG | Kỹ sư engine bát tự (`src/engine/`) |
| AI | Kỹ sư AI / prompt |
| TA | Tech artist (đường ống tài sản) |
| ART | Họa sĩ 3D |
| LVL | Thiết kế màn chơi / dựng vùng |
| CNT | Biên tập dữ liệu nội dung |
| QA | Kiểm thử |
| OPS | Vận hành, CI/CD |
| PRD | Sản xuất |
| OWN | Chủ dự án (phê duyệt, mua, ký hợp đồng) |

## M0 — «Bản Mệnh» (2 tuần)

**Mục tiêu** (bản sơ đồ tổng §13.4): Mệnh Bàn + màn Mệnh Bàn + persona AI + Vân Cốc, Khổng tiên sinh + Mở đầu mới; sửa lỗi engine Phụ lục B trước khi dùng engine cho chỉ số.

**Tiêu chí đóng mốc:**
1. `test-menhban` xanh với `MAU-A…H` (5 dải điểm, 4 loại cách + `'未知'`);
2. Mở đầu `MQ-P-*` chơi hết được với 4 lớp Mệnh Cách (chơi thử + `e2e` E4);
3. Ba persona (Thầy Tử Bình, Vân Cốc, Khổng tiên sinh) chạy qua lớp persona, iOS dùng thoại thay thế;
4. Không còn ba lỗi engine D1–D3; `npm test` và `npm run accuracy` không tụt;
5. Có mốc hiệu năng thiết bị thật cho S1, S3, S7.

---

### TASK-001 · `normGod` và `godsOf` dùng chung trong engine
- **Mô tả:** Thêm `normGod(s)` (giản thể → phồn thể cho 劫财/伤官/七杀/正财/偏财) và `godsOf(R)` (thập thần can + tàng can, bỏ 日主) vào `src/engine/core.js`, xuất cho module khác (phần 02 §10.1).
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** — · **Vai:** ENG
- **Nghiệm thu:** `godsOf(R_MAU_A)` trả tập phồn thể gồm cả thập thần tàng can; test đơn vị cho 5 cặp giản/phồn.

### TASK-002 · Sửa `getRemedyForChart` và `getYeguoForChart`
- **Mô tả:** Dùng `godsOf` + so phồn thể trong `remedy-fate.js`; nhánh Kiếp Tài và Thất Sát/Thương Quan tàng can hoạt động (D1).
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** TASK-001 · **Vai:** ENG
- **Nghiệm thu:** 4 ca bảng phần 02 §10.1 xanh; `remedySummary` không ném lỗi với 20 lá số có hạt giống.

### TASK-003 · Sửa `suggestDaozangChartAware` đọc `yong.primary`
- **Mô tả:** Đổi `R.yong.god` → `R.yong.primary`; rà khóa `_PATTERN2CULT` so với tên cách thật (D2).
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** TASK-004 (danh sách tên cách) · **Vai:** ENG
- **Nghiệm thu:** với `MAU-A`, `yongAdvice` chứa «Dụng Thần 水», có ≥ 1 kinh `fromChart`; mọi khóa `_PATTERN2CULT` khớp một tên cách engine trả được hoặc được ghi lý do.

### TASK-004 · Script `lint-tengod.mjs` và danh sách tên cách
- **Mô tả:** Quét `src/engine/*.js` tìm chuỗi thập thần giản thể trong ngữ cảnh so sánh; xuất danh sách tên cách `pattern.js` có thể trả; tệp ngoại lệ `lint-tengod.allow.json` (phần 02 §10.3).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** — · **Vai:** ENG
- **Nghiệm thu:** chạy ra danh sách tệp:dòng (gồm `ai.js:377`, `remedy-fate.js`); CI fail khi thêm mục mới ngoài danh sách ngoại lệ.

### TASK-005 · Sửa khối «TỔ HỢP KINH ĐIỂN» của `ai.js` và các chỗ lint báo
- **Mô tả:** Áp `normGod` tại mọi phép so thập thần mà lint phát hiện (D3); không đổi chuỗi hiển thị.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-001, TASK-004 · **Vai:** ENG
- **Nghiệm thu:** brief của lá số có 伤官 + 印 hiện «伤官配印»; so 50 brief trước/sau chỉ khác ở khối tổ hợp; `npm test` và `accuracy` không giảm.

### TASK-006 · Test hồi quy và nhật ký thay đổi engine
- **Mô tả:** `scripts/tests/test-engine-fixes.mjs`; bổ sung ca vào `selftest.mjs`; ghi nhật ký thay đổi app (người dùng trang chính thấy mục Cải Mệnh đổi).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-002, TASK-003, TASK-005 · **Vai:** QA
- **Nghiệm thu:** test đỏ trên commit trước sửa, xanh sau sửa; nhật ký có mục «chuẩn hóa thập thần phồn thể».

### TASK-007 · Khung `menhban.js` và `validateMenhBan`
- **Mô tả:** Tạo module thuần, hằng số (`GRADE_CUTS`, `PHAM_CAN`, `LOP`), tiêm phụ thuộc engine, `validateMenhBan` theo bảng phần 02 §3.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** — · **Vai:** CLI
- **Nghiệm thu:** chạy được bằng Node; `validateMenhBan` bắt được 10 lỗi cấu trúc mẫu.

### TASK-008 · Tiềm Lực, Phẩm căn, Phúc phận
- **Mô tả:** `phamCanOf`, khối `tiemLuc`, `phamCan`, `phucPhan` từ `synthesis`.
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** TASK-007 · **Vai:** CLI
- **Nghiệm thu:** biên 27/28 … 85/86 đúng 10 bậc; `MAU-A` → Tứ Linh Căn (41, 31%).

### TASK-009 · Ngũ Hành Lực, Thân Lực, Thiên Mệnh Hành
- **Mô tả:** `pct`, `eff` (Dụng ×1,3, Kỵ ×0,8), `thanLuc` từ `effRatio`, `thienMenh` từ `yong`; dự phòng `avoid[0]` khi thiếu `ji`.
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** TASK-007 · **Vai:** CLI
- **Nghiệm thu:** `MAU-A` (pct 木 6,5 · 火 18,3 · 土 17,9 · 金 55,1 · 水 2,2): eff 土 = 14,3 (Kỵ ×0,8), 水 = 2,9 (Dụng ×1,3), 金 = 55,1 (Hỷ ×1); tổng pct 100 ± 0,5.

### TASK-010 · Ngũ Duy, Mệnh Cách (gồm `'未知'`), Mệnh Cấp, Nguyên Khí
- **Mô tả:** Gọi `fiveDimRadar`, ánh xạ `LOP`, `lop = null` cho `'未知'` + cảnh báo; `classifyChartLevel`; `analyzeVitality.baseVitality` (D23).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-007 · **Vai:** CLI
- **Nghiệm thu:** `MAU-A` → Ngũ Duy `ti` trội, `shi` yếu, lớp DC, 清贵, Nguyên Khí 23; lá số giả `'未知'` → `lop = null`, `warnings` có `menhCach:unknown`.

### TASK-011 · Đặc Tính, Túc Nghiệp, Tính Khí, Thời Vận, `explain()`
- **Mô tả:** Khử trùng thần sát + quý nhân; `computeLiuDao`; tính khí; `thoiVanOf`; `explain(stat)` theo bảng phần 02 §5; `refreshThoiVan`.
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** TASK-007 · **Vai:** CLI
- **Nghiệm thu:** mỗi `StatKey` trả ≥ 1 dòng nguyên văn engine; trẻ chưa vào đại vận → `dayun = null`; engine phụ ném lỗi → trường `null`, không chặn.

### TASK-012 · Gắn test còn sót, thư mục `scripts/tests/`
- **Mô tả:** Thêm `test-game-cases`, `test-terrain` vào `test:game`; tạo `scripts/tests/` dùng `node:test`; script `test:ai`, `test:world`, `test:content` rỗng sẵn (D16).
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** — · **Vai:** QA
- **Nghiệm thu:** `npm run test:game` chạy 9 bộ; CI gọi đủ.

### TASK-013 · `test-menhban.mjs`
- **Mô tả:** Ca phần 02 §12 dòng 1; 500 lá số có hạt giống qua `validateMenhBan`.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-008 … TASK-011, TASK-033 · **Vai:** QA
- **Nghiệm thu:** xanh; thời gian < 10 s.

### TASK-014 · Triển khai Cloudflare cần chủ dự án duyệt, thêm môi trường staging
- **Mô tả:** Sửa `.github/workflows/cloudflare.yml`: job triển khai dùng GitHub Environment `production` có người duyệt bắt buộc (chủ dự án); push `main` chỉ build + test rồi triển khai tự động lên **staging** (`wrangler.jsonc › env.staging`: Worker riêng, DO/KV/Analytics riêng, tên miền con thử); thêm `workflow_dispatch` (D15).
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** — · **Vai:** OPS (OWN cấu hình người duyệt)
- **Nghiệm thu:** push thử lên `main` chỉ cập nhật staging; production chỉ chạy `wrangler deploy` sau khi OWN duyệt; staging không chạm DO/KV production.

### TASK-015 · Miễn giới hạn tốc độ KV cho tài sản tĩnh game
- **Mô tả:** Trong `worker/index.js`, bỏ bước `grl:` cho `/models/`, `/col/`, `/stream/`, `/nav/`, `game.html` tài sản (D8).
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** — · **Vai:** SRV
- **Nghiệm thu:** 300 yêu cầu GLB/phút từ một IP không bị 429; trang chính vẫn bị giới hạn như cũ (test `wrangler dev`).

### TASK-016 · Tên GLB có băm, `models/index.json`, bộ đệm bất biến
- **Mô tả:** Bước đóng gói sinh `<id>.<hash8>.glb` + bảng ánh xạ; `assets.modelUrl(id)` tra bảng; Worker đặt `Cache-Control: public, max-age=31536000, immutable` cho tên có băm (D9).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** — · **Vai:** TA (SRV hỗ trợ)
- **Nghiệm thu:** lần vào thứ hai không có yêu cầu xác thực lại GLB (DevTools: «from disk cache»); đổi model → tên mới.

### TASK-017 · Hợp nhất công thức ô ↔ mét (`coords.js`)
- **Mô tả:** Một module `coords.js` thay ba bản sao trong `court.js`, `models.js`, `world.js` (D21).
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** — · **Vai:** CLI
- **Nghiệm thu:** `grep` không còn định nghĩa `toTile` thứ hai; `test-game-state` xanh.

### TASK-018 · Lưu v2: khung, di trú, hydrate theo lược đồ
- **Mô tả:** `createState2`, `migrate1to2`, `hydrate2` (giữ khóa lạ trong `_extra`), khóa `huyenquan:v2`, không ghi `v1` (phần 02 §8).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** — · **Vai:** CLI
- **Nghiệm thu:** `test-save-v2`: di trú giữ mọi trường v1 (so sâu); v1 không đổi byte nào.

### TASK-019 · Lưu v2: ghi điều tiết, quota, bất biến, bản hỏng
- **Mô tả:** `saveSoon` 800 ms + ghi ở `pagehide`/`pause`; xử lý đầy quota; `checkInvariants`; giữ tối đa 3 bản `:corrupt`.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-018 · **Vai:** CLI
- **Nghiệm thu:** mô phỏng `setItem` ném `QuotaExceededError` → gộp sổ, thử lại; không mất dữ liệu.

### TASK-020 · Bộ đệm lá số LRU theo năm
- **Mô tả:** `chartOf` LRU 24 mục, khóa có `refYear` (phần 02 §9, D7).
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** — · **Vai:** CLI
- **Nghiệm thu:** giả lập qua 1/1 → `liunian.isNow` năm mới; bộ đệm không quá 24 mục.

### TASK-021 · Màn Mệnh Bàn (la bàn 4 vòng)
- **Mô tả:** Dựng màn theo thiết kế tài liệu 12 (mã `UI-xx` của tài liệu 12): tâm 4 trụ, vòng ngũ hành (cánh hoa theo `pct`), vòng Ngũ Duy, vòng đặc tính, vòng Phẩm căn; SVG + DOM, chạm được.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-011 · **Vai:** CLI
- **Nghiệm thu:** hiện đúng số `MAU-A`; chạy 390 × 844 không tràn; trợ năng: mỗi vòng có nhãn đọc màn hình.

### TASK-022 · «Vì sao?» và câu dẫn bắt buộc
- **Mô tả:** Popover từ `explain()`; khi Tiềm Lực < 46 luôn kèm câu dẫn «Lá số là hạt giống…» (canon §4.7 bản sơ đồ tổng, RB2).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-021 · **Vai:** CLI
- **Nghiệm thu:** mọi chỉ số có nút «Vì sao?»; lá số 24 điểm thấy câu dẫn; nội dung là nguyên văn engine.

### TASK-023 · `realmOf`, `nghichThien`, `daoHanhGain`
- **Mô tả:** Công thức phần 02 §6; trần ngày từ dữ liệu; `realmMax`.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-018 · **Vai:** CLI
- **Nghiệm thu:** `test-realm` bảng §6.1 xanh; đơn điệu theo Đạo Hạnh (200 mẫu).

### TASK-024 · Thông báo «sách tính đã chỉnh»
- **Mô tả:** So `mbHash`/`ENGINE_V` với `state.menh`; hiện khác biệt một lần (`diffMenhBan`).
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** TASK-011, TASK-018 · **Vai:** CLI
- **Nghiệm thu:** đổi giả `ENGINE_V` → thông báo hiện một lần, liệt kê trường đổi.

### TASK-025 · Bộ đánh giá điều kiện (SCHEMA-COND)
- **Mô tả:** `evalCond` đủ ngữ pháp phần 03 §6, danh sách trắng `StatPath`, `rand` tất định, `time` âm lịch/tiết khí/giờ can chi qua `lunar-javascript`.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-011 · **Vai:** CLI
- **Nghiệm thu:** `test-quest-cond` xanh (giờ Tý 23 h, trước/sau Lập Xuân, tháng nhuận).

### TASK-026 · Lõi `dispatch`, giao dịch, `aid`
- **Mô tả:** `createQuestRuntime`, chỉ mục lắng nghe, giao dịch sao chép nông + bất biến, khóa áp dụng chống áp hai lần, chặn vòng lặp 32 bước.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-025, TASK-018 · **Vai:** CLI
- **Nghiệm thu:** mô phỏng tải lại giữa `onDone` không nhân đôi Phúc Khí; vòng lặp branch ném `LoopError`.

### TASK-027 · Nút `talk`, `goto`, `choice`, `branch`, `wait`, `end`
- **Mô tả:** Sáu loại nút đủ cho mở đầu.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-026 · **Vai:** CLI
- **Nghiệm thu:** nhiệm vụ mẫu dùng đủ 6 loại chạy tới `end` trong test.

### TASK-028 · Trình chạy thoại và hộp thoại
- **Mô tả:** Chạy SCHEMA-DIALOGUE: dòng, `stage`, `bind` (chèn nguyên văn Mệnh Bàn), `choice` có `guard`, `effects`; UI hộp thoại dưới đáy (dùng bảng hiện có).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-026 · **Vai:** CLI
- **Nghiệm thu:** cảnh mẫu canon §1 chạy; phương án có `guard` ẩn đúng; `bind` hiện `synthesis.factors`.

### TASK-029 · `dialogue-from-md.mjs`
- **Mô tả:** Chuyển kịch bản dạng canon sang JSON + khóa chuỗi (phần 03 §9.2); báo lỗi tên nhân vật lạ, cảnh trỏ sai.
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** TASK-028 · **Vai:** CLI
- **Nghiệm thu:** `test-dialogue-md` với các khối kịch bản mẫu; ảnh chụp JSON kỳ vọng khớp.

### TASK-030 · `validate-content.mjs` bản đầu
- **Mô tả:** Luật V1–V5, V7 (npc, region, station), V11, V12, V20.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-027 · **Vai:** CLI
- **Nghiệm thu:** chạy trong CI; bắt được 12 lỗi mẫu cài sẵn.

### TASK-031 · Sổ nhiệm vụ và dấu bản đồ cơ bản
- **Mô tả:** Thẻ «Nhiệm vụ» trong Sổ Mệnh từ `journal()`; dấu trên la bàn/nhãn HTML từ `markers()`.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-026 · **Vai:** CLI
- **Nghiệm thu:** nhiệm vụ đang làm hiện tên, bước; dấu NPC đích hiện khi ≤ 220 m.

### TASK-032 · Phát sự kiện game cho máy nhiệm vụ
- **Mô tả:** `arrive` (theo `regionAt`, chỉ khi đổi), `stationDone` (hợp đồng `api.result`), `caseGraded`, `dayStart`, `tick` (phần 03 §14).
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** TASK-026 · **Vai:** CLI
- **Nghiệm thu:** nhật ký debug thấy đủ loại sự kiện khi chơi một vòng sân; không phát `arrive` mỗi khung.

### TASK-033 · `gen-mau-charts.mjs` và `mau-charts.json`
- **Mô tả:** Chạy engine thật, tìm lá số phủ 5 dải điểm + 有救 + 特殊 + `'未知'` (nếu có); ghi `expect` (phần 02 §11, D22).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-006 · **Vai:** ENG
- **Nghiệm thu:** tệp có `MAU-A…H` với ngày giờ; `--check` báo khi engine đổi số; gửi bảng cho tài liệu 04 dùng.

### TASK-034 · `askAI` nhận persona, gameContext, toolsAllow, briefMode
- **Mô tả:** Chữ ký phần 05 §3.1; lắp thông điệp §3.2; lọc công cụ hai lớp §3.3.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** — · **Vai:** AI
- **Nghiệm thu:** `test-ai-compat` (persona null giống từng byte); `test-persona-assembly`, `test-persona-tools` xanh.

### TASK-035 · `GAME_GUIDE_PROMPT` và `voiceReminder`
- **Mô tả:** Prompt nền cho NPC không luận lá số; bỏ `STYLE_DIRECTIVES` khi có persona.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-034 · **Vai:** AI
- **Nghiệm thu:** 10 câu thử với Thiền sư giả lập không có câu đoán vận (đánh giá thủ công + regex).

### TASK-036 · Chế độ brief `lite`/`none` và Mệnh Bàn rút gọn
- **Mô tả:** Chọn mục brief theo `briefSections`; Mệnh Bàn rút gọn ≤ 800 ký tự; `checkNeo` theo brief đã gửi (phần 05 §3.4, §5.2).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-034, TASK-040, TASK-011 · **Vai:** AI
- **Nghiệm thu:** `lite` ≤ 12.000 ký tự, `none` ≤ 1.500 ký tự với `MAU-A`.

### TASK-037 · `buildGameContext` và danh sách tên được phép
- **Mô tả:** 7 dòng ưu tiên, cắt 600 ký tự, không có ngày sinh/tên người thân (phần 05 §5.1).
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** TASK-026, TASK-011 · **Vai:** AI
- **Nghiệm thu:** test quét chuỗi không có mẫu ngày sinh; `allow` gồm nhiệm vụ đang làm/đã xong.

### TASK-038 · `postFilter`
- **Mô tả:** Chín bước phần 05 §6.1; `gameClaimFilter` §6.2 với từ điển thuật ngữ sinh từ engine.
- **Ước lượng:** 2,5 ngày · **Phụ thuộc:** TASK-037 · **Vai:** AI
- **Nghiệm thu:** `test-postfilter` 120 câu (tài liệu 06 cấp bộ câu): đúng ≥ 95%, không gỡ nhầm thuật ngữ cổ pháp.

### TASK-039 · Cổng khủng hoảng
- **Mô tả:** `crisisGate` trước khi gửi; dữ liệu `crisis-patterns.json`, `crisis-resources.json`; câu rời vai cố định; không trừ lượt.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-034 · **Vai:** AI (OWN và cố vấn xác nhận nội dung tài nguyên hỗ trợ)
- **Nghiệm thu:** `test-crisis`: ca dương tính có/không dấu khớp; 200 ca âm tính cổ pháp không khớp; tệp tài nguyên có chữ ký duyệt.

### TASK-040 · Kiểm kê tiêu đề mục brief
- **Mô tả:** Liệt kê mọi tiêu đề `_splitBrief` tách từ `buildChartBrief` trên 50 lá số → `brief-sections.json`.
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** — · **Vai:** AI
- **Nghiệm thu:** tệp có danh sách; validator persona báo khi `briefSections` trỏ mục không có.

### TASK-041 · Đo token thật theo chế độ brief
- **Mô tả:** 30 câu × 4 chế độ qua backend thật (môi trường dev), ghi `usage` (vào/ra), thời gian tới token đầu; cập nhật bảng phần 05 §10.1 và mô hình chi phí phần 15.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-036 · **Vai:** AI
- **Nghiệm thu:** báo cáo số đo; tỉ lệ ký tự/token thật thay ước lượng 3.

### TASK-042 · Giao diện trò chuyện NPC
- **Mô tả:** `npc-chat-ui.js` dựa `master-ui.js`: câu mở đầu cố định, «đang viết» mờ tới khi lọc xong, 3 gợi ý, nút «Con hiểu rồi»/«Bỏ qua» phát `aiTalkEnd`.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-038 · **Vai:** CLI
- **Nghiệm thu:** chạy với 3 persona; ngắt mạng → thoại thay thế; không hiện câu bị gỡ dù chỉ thoáng qua.

### TASK-043 · Hạn mức AI tạm ở client
- **Mô tả:** Đếm lượt/ngày trong `state.ai` (10/30) chờ máy chủ ở M1; hết lượt → thoại thay thế.
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** TASK-042 · **Vai:** CLI
- **Nghiệm thu:** lượt 11 dùng thoại thay thế; qua 0 giờ đặt lại.

### TASK-044 · Mốc hiệu năng trên thiết bị thật
- **Mô tả:** Đo S1, S3, S7 trên một máy mỗi hạng (phần 09 §1) bằng HUD + `bench-scenes`; ghi `perf/baselines/`.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-045, TASK-046 · **Vai:** QA (GFX hỗ trợ)
- **Nghiệm thu:** 9 báo cáo SCHEMA-PERF-REPORT trong repo; ghi chênh lệch so số «45 khung/giây khung xem trước».

### TASK-045 · HUD hiệu năng `?perf=1`
- **Mô tả:** Phần 09 §5.1.
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** — · **Vai:** GFX
- **Nghiệm thu:** hiện p50/p95, lượt vẽ, tam giác, chương trình, tác vụ dài; nút chụp số liệu ra JSON đúng schema.

### TASK-046 · `bench-scenes.mjs` bản đầu
- **Mô tả:** `?bench=` đặt camera/giờ/chất lượng; Playwright đo; so mốc (phần 09 §5.3).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-045 · **Vai:** GFX
- **Nghiệm thu:** chạy S1, S3 trong CI (SwiftShader) ra lượt vẽ ổn định giữa hai lần chạy (sai khác 0).

### TASK-047 · `check-bundle.mjs`
- **Mô tả:** Ngưỡng phần 09 §6.2.
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** — · **Vai:** OPS
- **Nghiệm thu:** fail khi chunk `render3d` > 900 KB (thử bằng cách import thừa).

### TASK-048 · Dữ liệu persona: Thầy Tử Bình, Vân Cốc, Khổng tiên sinh
- **Mô tả:** Nhập `PERSONA-thay_tubinh`, `PERSONA-van_coc`, `PERSONA-khong_tiensinh` từ tài liệu 06; validator SCHEMA-PERSONA.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-034 · **Vai:** CNT
- **Nghiệm thu:** 3 tệp `status: 'approved'`; validator xanh; `toolsAllow` chỉ chứa công cụ có thật.

### TASK-049 · Thoại thay thế cho 3 persona
- **Mô tả:** SCHEMA-DIALOGUE `fallbackDialogue` theo các chủ đề trong `scope`.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-048, TASK-028 · **Vai:** CNT
- **Nghiệm thu:** iOS/AI tắt vẫn trò chuyện được mọi chủ đề `scope`.

### TASK-050 · Vân Cốc thiền sư trong thế giới
- **Mô tả:** Đặt NPC; Am Vân Cốc tạm (điểm sau Hậu Sơn hoặc phòng túi tới khi vùng `vancoc` có ở M2); lịch có mặt.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-053 · **Vai:** LVL
- **Nghiệm thu:** đi tới được bằng A*; tương tác mở trò chuyện persona.

### TASK-051 · Khổng tiên sinh ở bậc Sơn Môn
- **Mô tả:** Đặt NPC trên bậc ngự đạo; tương tác persona.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-053 · **Vai:** LVL
- **Nghiệm thu:** không chặn đường lên Chính Đường (test A* `test-game-state`).

### TASK-052 · Lão Tùng người gác cổng (nhập môn)
- **Mô tả:** NPC ở Sơn Môn, nút nhập môn của `MQ-P`.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-053 · **Vai:** LVL
- **Nghiệm thu:** người chơi mới gặp ngay sau cổng.

### TASK-053 · Dùng lại nhân vật Meshy cho NPC mới
- **Mô tả:** Tô màu `master`, `npc_villager`, `npc_merchant` bằng `tintMaterial` cho 3 NPC (không tốn credit); phụ kiện thủ công phân biệt.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** — · **Vai:** TA
- **Nghiệm thu:** 3 NPC nhận ra được bằng mắt ở 10 m.

### TASK-054 · Nhập liệu mở đầu `MQ-P-*`
- **Mô tả:** Kịch bản tài liệu 03 → JSON nhiệm vụ + thoại (TASK-029); nhánh mở đầu theo 4 lớp.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-027, TASK-029 · **Vai:** CNT
- **Nghiệm thu:** validator xanh; `sim-quests` (bản rút gọn cho MQ-P) đi hết với 4 lớp + `lop = null`.

### TASK-055 · Cổng nhập môn mới
- **Mô tả:** Nối lễ lật trụ hiện có → hiển thị Mệnh Bàn → bắt đầu `MQ-P`; người chơi cũ (đã có `birth`) nhận nhiệm vụ mở đầu rút gọn.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-021, TASK-054 · **Vai:** CLI
- **Nghiệm thu:** E1 xanh; người chơi cũ không bị bắt nhập lại bát tự.

### TASK-056 · Cờ iOS cho tính năng mới
- **Mô tả:** `features.js`: Mệnh Bàn bật (không đoán vận), Thời Vận ẩn trên iOS, persona AI tắt, nhiệm vụ `ios` lọc (phần 03 §12).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-026 · **Vai:** CLI
- **Nghiệm thu:** `verify-ios-game` (TASK-058) xanh.

### TASK-057 · `e2e-game.mjs` đợt đầu
- **Mô tả:** E1–E4, E7, E10 (phần 11 §5.2).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-055 · **Vai:** QA
- **Nghiệm thu:** chạy trong CI < 4 phút, ổn định 10 lần liên tiếp.

### TASK-058 · `verify-ios-game.mjs`
- **Mô tả:** Kiểm bản iOS phần 11 §6.
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** TASK-056 · **Vai:** QA
- **Nghiệm thu:** chạy với `preview:ios`; liệt kê và khẳng định không gian bói không tới được.

### TASK-059 · Màn đồng ý (consent)
- **Mô tả:** Hỏi một lần sau cập nhật: phân tích, công khai căn cốt (mặc định tắt), gửi lá số cho AI (như app chính); lưu `state.consent`; đổi được trong Cài đặt.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-018 · **Vai:** CLI
- **Nghiệm thu:** từ chối phân tích → không có yêu cầu tới `/api/hq/ev`; văn bản do OWN duyệt.

### TASK-060 · Chặn game dùng `/api/event` của app chính
- **Mô tả:** Lint/grep CI: `src/game/**` không chứa `/api/event`; ghi chú trong `admin.js` rằng game có đường riêng (D19).
- **Ước lượng:** 0,25 ngày · **Phụ thuộc:** — · **Vai:** SRV
- **Nghiệm thu:** CI fail khi thêm chuỗi đó vào code game.

### TASK-061 · Chơi thử mở đầu với 4 lớp
- **Mô tả:** 4 người chơi thử, mỗi người một lá số mẫu một lớp; ghi phản hồi về cảm giác «bị phán xét».
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-055 · **Vai:** QA (PRD tổ chức)
- **Nghiệm thu:** biên bản; lỗi S0–S1 bằng 0.

### TASK-062 · Bản ghi quyết định kiến trúc (ADR)
- **Mô tả:** `docs/adr/` 6 quyết định: kích thước thế giới + siêu elip, lưu v2, máy nhiệm vụ dữ liệu, lớp persona, va chạm nhiều lớp + nướng sẵn, kho R2.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** — · **Vai:** TD
- **Nghiệm thu:** 6 tệp ADR có bối cảnh, lựa chọn, hệ quả; TD và PRD ký.

### TASK-063 · Ghi chú phát hành M0
- **Mô tả:** Thay đổi người chơi thấy (Mệnh Bàn, mở đầu, thầy), thay đổi engine, hướng dẫn quay lui.
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** — · **Vai:** PRD
- **Nghiệm thu:** có trong `docs/` và nhật ký app.

### TASK-064 · Hướng dẫn nhập liệu cho biên kịch
- **Mô tả:** Cách viết kịch bản dạng canon để `dialogue-from-md` đọc được; cách chạy validator; lỗi hay gặp.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-029, TASK-030 · **Vai:** CNT
- **Nghiệm thu:** một biên kịch mới nhập được một cảnh không cần lập trình viên.

### TASK-065 · Chế độ gỡ lỗi `?debug=1`
- **Mô tả:** `__hq.quests`, `__hq.mb`, `__hq.clock` (giả lập giờ), `debug.force/reset` (phần 11 §5.1).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-026 · **Vai:** CLI
- **Nghiệm thu:** bản phát hành không có `debug` khi thiếu tham số; Playwright dùng được.

### TASK-066 · Chuỗi văn bản `text/vi.json`
- **Mô tả:** Loader khóa `t:…`, dự phòng hiện khóa khi thiếu (chế độ dev báo đỏ).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** — · **Vai:** CLI
- **Nghiệm thu:** V11 dùng loader; không có chuỗi cứng mới trong code nhiệm vụ.

### TASK-067 · Bộ lọc chữ không dấu (V19)
- **Mô tả:** Danh sách từ phổ biến bị viết không dấu; chạy trên `text/vi.json`.
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** TASK-066 · **Vai:** CNT
- **Nghiệm thu:** bắt «khong», «duoc», «nguoi»… trong tệp thử.

### TASK-068 · Cờ «không rõ giờ» trong Mệnh Bàn
- **Mô tả:** `uncertain: ['hour']`; ghi chú trên màn Mệnh Bàn; ẩn cột Tiên Thiên trên bảng xếp hạng sau này.
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** TASK-021 · **Vai:** CLI
- **Nghiệm thu:** lá số «không rõ giờ» hiện ghi chú ở mọi chỉ số phụ thuộc giờ.

### TASK-069 · Môi trường phát triển máy chủ
- **Mô tả:** `.dev.vars.example`, hướng dẫn `dev:mmo` (cả Windows junction), script `test:mmo:int`.
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** — · **Vai:** OPS
- **Nghiệm thu:** máy mới chạy được `test:mmo:int` theo hướng dẫn trong 15 phút.

### TASK-070 · Đánh giá chất lượng persona đợt 1
- **Mô tả:** 30 câu × 3 persona; chấm giọng, phạm vi, `forbid`, xung đột `checkNeo`; điểm Neo trung bình.
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** TASK-042, TASK-048 · **Vai:** AI (QA hỗ trợ)
- **Nghiệm thu:** báo cáo; Neo trung bình ≥ 90 với persona `master`; vi phạm `forbid` hiển thị = 0.
