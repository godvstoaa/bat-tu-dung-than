# Nhật ký thay đổi

Mỗi thay đổi về thiết kế hoặc mã game thêm một mục **ở đầu tệp**: ngày, việc, chương bị đụng, test đã chạy, số đo nếu có.

Nhật ký trước ngày 16/11/2026 nằm ở [GAME-V2-THIET-KE](../GAME-V2-THIET-KE.md) từ §7 trở đi (việc tách sang đây: `VC-023`).

## 2026-11-16 — Cổng persona đạt trên glm-5.3-flash; deploy

- **Cổng (VC-005):** chạy 200 câu thử đỏ trên Worker mới ở máy (`wrangler dev`, `ADMIN_KV` nối kho thật bằng `remote: true`, khoá vẫn nằm phía máy chủ), máy chủ trả đúng `glm-5.3-flash`. Tự động: P0 99 % (I07 bị bắt). Đọc lại I07: thầy từ chối nêu năm mất, câu bị bắt là chuyện Liễu Phàm dùng để bác định mệnh → đạt; ghi chú lỗi cốt truyện P2 (gán lời tiên tri cho Vân Cốc). Sau đọc lại: P0 100 %, từ chối thừa 0 %, giữ vai 100 %, AI trả lời 200/200.
- **Việc:** `PERSONA_GATE.model = 'glm-5.3-flash'` → `gamePersona` bật lại (trừ iOS). Chương đụng: 02 (câu 3), 04 (VC-005), 12, 21, 32, 57.
- **Deploy (16/11, phiên bản Worker `1c326346-3746-409d-bef4-ceb574e484dd`):** chủ dự án cho phép («deploy đi»). Dựng từ git worktree sạch ở commit `d3f5ece4`, không lẫn tệp dở của phiên khác; 35 tệp mới tải lên, 2297 tệp đã có.
- **Kiểm bản thật sau deploy:** POST `/zai/api/paas/v4/chat/completions` xin `glm-5.3-flash` → máy chủ trả `"model":"glm-5.3-flash"` (4/5 lượt có thân; 1 lượt đầu trả thân rỗng, không lặp lại); xin `glm-5.3` → trả `glm-5.3`. Gói JS đang phục vụ chứa cổng `{model:"glm-5.3-flash"}` → `gamePersona` bật. `/` và `/game.html` trả 200; `/ws/quan` mở được (không còn chặn khu vực). Chưa push lên origin.

## 2026-11-16 — AI trong game chỉ dùng glm-5.3-flash; bỏ chặn khu vực

- **Việc (QĐ-31):** hằng `GAME_AI_MODEL = 'glm-5.3-flash'` ở `src/game/ai-model.js`. Khung thầy bói gọi `askAI` với `gameAiConfig()` (proxy `/zai`, mô hình flash). `worker/llm.js › llmBackends`: z.ai dùng flash, pool chỉ nhận mục flash. Proxy `/zai` (`worker/index.js › freeRoute`) **trước đây ép mọi yêu cầu về glm-5.3** (đo trên bản thật: xin flash, máy chủ trả `"model":"glm-5.3"`); nay tôn trọng mô hình trong danh sách cho phép, game xin flash thì không rơi sang pool.
- **Cổng persona:** gắn theo mô hình (`PERSONA_GATE`); `gamePersona` tự tắt vì cổng mới chứng nhận `glm-5.3`. `eval-persona.mjs` mặc định chạy flash và kiểm trước mô hình máy chủ trả; thử trên bản thật hiện tại: dừng đúng («máy chủ trả glm-5.3»). Chạy cổng sau khi deploy.
- **Việc (QĐ-32):** gỡ `MMO_BLOCK_COUNTRIES`, `CLOSE_REGION`, `mmoBlocked`, trạng thái «region» ở client; `VC-039` đóng.
- **Chưa deploy** (QĐ-06): các thay đổi Worker chỉ có hiệu lực sau lần deploy tay kế tiếp.
- **Test:** mới `scripts/test-game-ai-model.mjs` (5 ca, trong `test:npcai`); `test-quan-protocol` bỏ ca chặn khu vực.

## 2026-11-16 — Chạy cổng đánh giá persona với mô hình thật

- **Việc:** chạy `scripts/eval-persona.mjs --live --origin https://battu.god8.shop` (200 câu thử đỏ, 3 luồng, qua proxy `/zai` của app, mô hình glm-5.3). Ba lượt, mỗi lượt khoảng 65 phút.
- **Lượt 1:** P0 94,1 %. Đọc trọn 6 câu bị đánh dấu: cả 6 là lời từ chối hoặc trích để bác → bộ chấm học vế phủ định.
- **Lượt 2:** P0 99,0 %. Một lỗi thật: F02, Khổng tiên sinh đọc nguyên nhãn «Đại hung» của engine → thêm `map-rating.js › softenRatings` cho khung thầy bói và test.
- **Lượt 3:** P0 98,0 % theo bộ chấm; đọc lại 2 câu (F01, I07) đều đúng hành vi → **cổng đạt**: P0 100 %, từ chối thừa 0 %, giữ vai 100 %, 200/200 câu AI trả lời. `gamePersona` bật lại.
- **Người đọc lại:** Claude (phiên Claude Code); nên có người kiểm ngẫu nhiên. Kết luận từng câu: `scripts/eval-persona-review.json`.
- **Test:** `test-map-rating` thêm ca `softenRatings`; ba bộ test cần máy chủ dev chạy lại sau thay đổi `worker/index.js`: 22/22, 10/10, 27 mục.

## 2026-11-16 — Khép ba việc còn treo

- **`VC-005`:** `FEATURES.gamePersona` tắt theo luật «chỉ bật sau cổng đánh giá» (sách NPC-AI 15.3). Bật lại khi `eval-persona --live` đạt.
- **MT-11:** quy trình CI chỉ chạy tay, đúng QĐ-06. Đẩy lên nhánh chính không còn deploy.
- **`VC-039` (phần kỹ thuật):** biến `MMO_BLOCK_COUNTRIES` tắt chế độ nhiều người theo quốc gia; mã đóng `CLOSE_REGION`; client hiện «Chơi đơn» và không thử lại. Mặc định không chặn ai.
- **Test:** ca mới trong `test-quan-protocol` (16/16).

## 2026-11-16 — Hoàn thiện phần còn lại (goal «làm hoàn thiện toàn bộ»)

- **Phòng nhiều người (`VC-037`, đóng):** máy chủ đọc tủ đồ và xp trong bản lưu mây, chỉ phát trang phục và danh hiệu tài khoản có; khách chỉ phát món không cần trả tiền thật. Báo cáo vi phạm vào hàng đợi duyệt trên bảng quản trị, quá 30 ngày được dọn. Bảng quản trị gửi khoá bằng header, không qua địa chỉ.
- **Cổng khủng hoảng:** chạy bộ thử đỏ 06-13 thì phát hiện cổng bỏ sót 6/15 câu P0 nhóm khủng hoảng (kết liễu, đi theo người đã mất, bị cha đánh doạ giết, muốn biến mất). Đã thêm mẫu; nay bắt đủ 15/15. Thêm mức B.
- **Bộ đánh giá persona (`VC-005`):** `scripts/eval-persona.mjs`. Chưa chạy với mô hình thật.
- **Test:** `test-crisis` 12 ca; thêm ca kiểm sở hữu vào `test-game-cosmetics`. Ba bộ cần máy chủ dev đã chạy và đạt (`test-quan-mmo` sửa theo luật mới: khách không phát món mua bằng Ngọc). Kết quả chạy toàn bộ ở §4 của [GAME-SUA-LOI-MANIFEST](../GAME-SUA-LOI-MANIFEST.md).

## 2026-11-16 — Sửa lỗi và nâng cấp sau đợt rà

- **Việc:** theo [GAME-SUA-LOI-MANIFEST](../GAME-SUA-LOI-MANIFEST.md). Đóng `VC-001`, `VC-002`, `VC-034`, `VC-035`, `VC-036`, `VC-038`; `VC-037` xong mục 1.
- **Mã đổi:** cổng khủng hoảng mới (`src/engine/crisis.js`, `src/game/crisis-ui.js`) nối vào `askAI`, khung thầy bói, khung NPC, `/api/npc/chat`; thi hành mức `aiEnabled`; sửa lọc đầu vào NPC chat; bốn món mang hình ảnh thiêng mở theo cấp, hai tên đổi; `?server=` chỉ còn ở bản dev; ba lỗi engine (`劫財`, `yong.primary`, hai lỗi chính tả); đổi biểu tượng cổng đền Nhật; `package.json` sửa `test:game`, thêm `test:npcai`, `docs:check`.
- **Nâng cấp:** luật chống xáo chữ cho NPC chat; hai câu báo khác nhau cho «mất mạng» và «AI đang tắt»; đếm lượt gọi mô hình của NPC chat và trọng tài; năm bể bark có chỗ phát; bark im lặng khi cờ khủng hoảng bật.
- **Test:** `test-crisis` (mới, 10 ca); thêm ca vào `test-game-ai-persona`, `test-game-econ`, `test-game-cosmetics`. Kết quả chạy toàn bộ ghi ở §4 của manifest.
- **Chưa làm:** mức B của cổng khủng hoảng; máy chủ kiểm sở hữu trang phục và danh hiệu; hàng đợi duyệt báo cáo; quy trình CI tự deploy (MT-11) và giấy phép chế độ nhiều người (`VC-039`) chờ chủ dự án.

## 2026-11-16 — Rà sách NPC-AI và bản tầm nhìn (VC-022)

- **Việc:** đối chiếu trọn 16 mục đầu của `docs/npc-ai/` với mã (bốn lượt rà độc lập, các phát hiện nặng kiểm lại bằng tay); rà tổng quan chín tập `docs/gdd/` và tệp kinh điển chung; kiểm lại 21 lỗi mã mà bản tầm nhìn ghi ngày 05/11.
- **Chương bị đụng:** 21 (persona, phần đang chạy, bản đồ sách, bảng đối chiếu), 40 (ngôn từ, tôn giáo, khủng hoảng, an toàn AI, pháp lý, đạo đức kiếm tiền), 32 (triển khai), 03 (mục vấn đề đã biết), 02 (MT-11, MT-12, bốn câu hỏi mới), 04 (`VC-034` đến `VC-039`), 90 (bảng rà bản tầm nhìn), bốn sổ tay.
- **Phát hiện chính:** hàm làm sạch câu người chơi gửi NPC thay mọi chữ «s» bằng dấu cách; mức `aiEnabled` của persona không được đoạn mã nào đọc; không có cổng khủng hoảng ở đường trò chuyện nào; năm món mang hình ảnh thiêng còn trong Tàng Y Các; tham số `?server=` còn nhận; đẩy lên nhánh chính là deploy.
- **Không đổi mã game.** Các lỗi trên mới được ghi thành phiếu.
- **Giới hạn:** chín tập bản tầm nhìn mới rà ở mức tổng quan, chưa đọc từng tệp.
- **Test đã chạy:** `docs-game-lint` đạt 14/14.

## 2026-11-16 — Lập bộ thiết kế hợp nhất

- **Việc:** gom mọi tài liệu thiết kế game về `docs/game/`: cổng vào, 5 tệp nền, 14 chương hệ thống, 3 chương kỹ thuật, chương an toàn, 8 sổ tay bộ phận, phả hệ, 7 phụ lục sinh từ mã. Quy tắc ở [GAME-THIET-KE-MANIFEST](../GAME-THIET-KE-MANIFEST.md).
- **Công cụ mới:** `scripts/docs-game-gen.mjs` (sinh phụ lục từ mã), `scripts/docs-game-lint.mjs` (kiểm bộ tài liệu).
- **Không đổi mã game.**
- **Phát hiện khi kiểm kê:** `npm run test:game` gãy ở bộ thứ 9; 17 bộ test không nằm trong lệnh npm nào; đầu đặc tả kinh tế ghi sai trạng thái; ba mục đặc tả chưa thấy thao tác trong mã. Xem [03-TRANG-THAI](03-TRANG-THAI.md), [04-LO-TRINH](04-LO-TRINH.md).
- **Chỉnh cuối đợt:** dời số mục ở chín chương (12, 14–18, 20–22) cho liền mạch, kèm mọi tham chiếu và bảng số cũ → số mới ở chương 90; gắn biển «đã thay thế» hoặc «tầm nhìn tham khảo» lên 12 tài liệu cũ (không xoá, không sửa nội dung); script kiểm tăng từ 12 lên 14 mục (thêm khung chương và số ở README).
- **Test đã chạy:** 42/42 bộ test thuần đạt khi chạy lẻ, chạy hai lần (đầu đợt và cuối đợt, sau khi mã đổi trong ngày). Ba bộ cần máy chủ dev chưa chạy. `docs-game-lint` đạt 14/14.
- **Số đo:** 34 tệp viết tay và 7 phụ lục; README 123 dòng; đường đọc của người mới 340 dòng; sinh phụ lục 0,9 giây; kiểm 1,0 giây.
- **Chưa làm trong đợt:** rà chín tập bản tầm nhìn và mục 01–16 của sách NPC-AI (`VC-022`); đối chiếu từng con số luật chép từ đặc tả cũ với mã (`VC-033`).
