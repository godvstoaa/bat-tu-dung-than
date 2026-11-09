# 15. Lộ trình tích hợp theo giai đoạn — 22 file khóa, ai.js không khóa

> **Tóm tắt.** Bản trước của mục này trích sai §0.3 thành «4 file khóa» — bản này sửa lại theo nguyên văn `docs/GAME-THIET-KE-CHOT.md:42`: danh sách khóa đợt này là **22 file** (từ `net.js` đến `thaitue.js`), trong đó có `state.js, stations.js, master-ui.js, render3d.js, main.js, case-ui.js, world.js, vanmenh-ui.js, thaitue.js, cases.js`; **`ai.js` KHÔNG nằm trong danh sách**. Hệ quả điều phối: mọi việc chỉ đụng `ai.js` đi được ngay (G1) nhưng vẫn bị gate eval chặn trước khi bật; mọi việc đụng một trong 22 file phải chờ mở khóa và mang nhãn **«chờ mở khóa (22 file — mục 15)»** ở mọi chỗ nó được nêu trong cả bộ thiết kế. Lộ trình chia 5 giai đoạn G0–G4: G0 dựng module thuần có test (đợt này), G1 inject persona vào `ai.js`, G2 mở khóa 22 file để wire bark + chuyện riêng, G3 dựng 3D canon + vị trí, G4 bật runtime tôn giáo theo biên bản tham vấn.

---

## 15.1 Ràng buộc nền sửa đúng — danh sách khóa là 22 file

Nguyên văn chốt ở `docs/GAME-THIET-KE-CHOT.md:42` (§0.3 «Cấu trúc game đang khóa/phân bổ»):

> **Danh sách file khóa đợt này** (đợt vá bug): `net.js, protocol.js, worker/quan-room.js, render3d.js, landmarks.js, obstacles.js, accessories.js, effects.js, world.js, characters.js, main.js, state.js, stations.js, interior.js, game.css, cosmetics.js, cases.js, case-ui.js, master-ui.js, vanmenh.js, vanmenh-ui.js, thaitue.js`.

Số đếm: 1 `net.js` — 2 `protocol.js` — 3 `worker/quan-room.js` — 4 `render3d.js` — 5 `landmarks.js` — 6 `obstacles.js` — 7 `accessories.js` — 8 `effects.js` — 9 `world.js` — 10 `characters.js` — 11 `main.js` — 12 `state.js` — 13 `stations.js` — 14 `interior.js` — 15 `game.css` — 16 `cosmetics.js` — 17 `cases.js` — 18 `case-ui.js` — 19 `master-ui.js` — 20 `vanmenh.js` — 21 `vanmenh-ui.js` — 22 `thaitue.js`. **Đúng 22.**

**Bảng 15-1 — 22 file khóa (chép đủ từ §0.3 — yêu cầu bắt buộc của mục này, không viết tắt).** Cột «vai trò thật» lấy từ dữ liệu đã đọc trong repo; cột «NPC-AI đụng khi» là giai đoạn sớm nhất lộ trình này chạm file.

| # | File khóa | Vai trò thật trong game | NPC-AI đụng khi | Nhãn |
|---|---|---|---|---|
| 1 | `net.js` | Lớp mạng MMO client | G2 (bark không đưa vào payload room) | chờ mở khóa (22 file — mục 15) |
| 2 | `protocol.js` | Giao thức room MMO; `protocol.js:107` «Khách» là tên dự phòng **người chơi MMO**, không phải NPC | G2 (kiểm không lộ chuyện riêng qua room) | chờ mở khóa (22 file — mục 15) |
| 3 | `worker/quan-room.js` | Room server MMO (Cloudflare) | G2 (không thêm field broadcast) | chờ mở khóa (22 file — mục 15) |
| 4 | `render3d.js` | Renderer 3D: Thầy `render3d.js:205-210` + cúi chào `render3d.js:683-685`; người bán Tàng Y Các `render3d.js:234-236`; khách ❓/✓ `render3d.js:239-248`, `render3d.js:787-816`; đèn hồ `render3d.js:728` | G2 (bark trạm), G3 (3D canon) | chờ mở khóa (22 file — mục 15) |
| 5 | `landmarks.js` | Cắm mốc cảnh quan | G3 | chờ mở khóa (22 file — mục 15) |
| 6 | `obstacles.js` | Va chạm vật cản (hết đi xuyên công trình) | G3 (vị trí NPC đi được tới) | chờ mở khóa (22 file — mục 15) |
| 7 | `accessories.js` | Phụ kiện nhân vật | G3 | chờ mở khóa (22 file — mục 15) |
| 8 | `effects.js` | Hiệu ứng | G3 | chờ mở khóa (22 file — mục 15) |
| 9 | `world.js` | `world.js:42` `HALLS` (8 sảnh), `world.js:62` `ROOMS` (6 điện), `world.js:76-92` sinh trạm door/exit/van; nhãn trạm `world.js:19-31`; `world.js:85` ROOMS chinhdien npc `'que'` | G2 (bark trạm), G3 (vị trí) | chờ mở khóa (22 file — mục 15) |
| 10 | `characters.js` | Định nghĩa nhân vật game | G3 | chờ mở khóa (22 file — mục 15) |
| 11 | `main.js` | Vòng game chính; `main.js:51-60` `todayNpc` hạt giống `${d}:${i}:${pid}` (tại `main.js:56`) | G2 (nối story vào khách) | chờ mở khóa (22 file — mục 15) |
| 12 | `state.js` | Máy trạng thái (`state.phucKhi`, `deskLog`) — NPC-AI không ghi `deskLog` | Không đụng (chỉ đọc quy ước) | chờ mở khóa (22 file — mục 15) |
| 13 | `stations.js` | Bản đồ mở trạm `stations.js:729` `STATION_OPEN`, `stations.js:693` `HALL_OPEN`; `stations.js:146` `openThay`, nút 🎙 `stations.js:127-130`; `stations.js:295-394` `openXam` (ghi chú «Thơ xăm Hoàng Đại Tiên.» tại `stations.js:291`); `stations.js:399-434` `openHuong` (bốc 1 trong 14 câu tại `stations.js:408`); `stations.js:501-558` `openTra`; `stations.js:563-584` `openSen`; `stations.js:655-665` `openCaseSlot`; `stations.js:717-725` `openQue`; `stations.js:728-737` `VAN_OPEN` | G2 | chờ mở khóa (22 file — mục 15) |
| 14 | `interior.js` | Nội thất điện — bàn thờ ba cấp `interior.js:79` | G3 | chờ mở khóa (22 file — mục 15) |
| 15 | `game.css` | Toàn bộ style game | G2 (bong bóng bark nếu cần style mới) | chờ mở khóa (22 file — mục 15) |
| 16 | `cosmetics.js` | Trang điểm nhân vật | G3 | chờ mở khóa (22 file — mục 15) |
| 17 | `cases.js` | Dữ liệu án | Không đụng trong G0–G4 | chờ mở khóa (22 file — mục 15) |
| 18 | `case-ui.js` | Panel án; nút «Hỏi Thầy» sau án tại `case-ui.js:239/373/460/509`; lazy `master-ui` tại `case-ui.js:252`; cảm ơn chung `case-ui.js:236`, cảm ơn sảnh `case-ui.js:472`; hop-hon `case-ui.js:474-515`; dz `case-ui.js:410`, `case-ui.js:457`; zheri `case-ui.js:319`, `case-ui.js:370` | G2 (story consumer) | chờ mở khóa (22 file — mục 15) |
| 19 | `master-ui.js` | Khung «Thầy luận»: `masterChatBody()` `master-ui.js:32`; hỏi `master-ui.js:65`; rAF gộp token `master-ui.js:69-72`; badge Neo `master-ui.js:81-87`; chip follow-up `master-ui.js:90-93`; hỏng «Thầy đang bận…» `master-ui.js:95`; AbortController `master-ui.js:105-106` | G1 chỉ đụng `ai.js`, **không** đụng `master-ui.js`; đụng file này chỉ khi đổi UI (hoãn) | chờ mở khóa (22 file — mục 15) |
| 20 | `vanmenh.js` | Module vận mệnh (`vanmenh.js:14`) | G2 (bark cổng) | chờ mở khóa (22 file — mục 15) |
| 21 | `vanmenh-ui.js` | Panel Vận Mệnh Các `vanmenh-ui.js:55-90` (chưa nhập bát tự `vanmenh-ui.js:44`); Thái Tuế `vanmenh-ui.js:96-127` (phương kiêng `vanmenh-ui.js:105`, đèn `vanmenh-ui.js:116`, câu hỏi Thầy `vanmenh-ui.js:127`); gate AI `vanmenh-ui.js:46` | G2 | chờ mở khóa (22 file — mục 15) |
| 22 | `thaitue.js` | `TAISUI_60` tên tướng quân theo hoa giáp `thaitue.js:9-10` | G2 (bark tuyên vị) | chờ mở khóa (22 file — mục 15) |

**`ai.js` không có trong bảng trên — và đây là điều kiện thay đổi mọi mốc của lộ trình.** Kèm theo đó, các file **không khóa** mà lộ trình này được phép sửa: `src/engine/ai.js`, `src/game/features.js` (nơi `FEATURES.ai = !IOS` tại `features.js:20`), `src/game/halls.js` (renderer sảnh dùng `HALL_BUILD` tại `halls.js:258` — thêm BƯỚC vào sảnh hiện có chỉ cần sửa `halls.js`, đối chiếu `docs/GAME-THIET-KE-CHOT.md:40`), `src/game/npc.js` (`makeNpc` tại `npc.js:41`), `src/game/names.js` (`CALM_LINES` tại `names.js:10-25`), `src/game/que-ui.js` (panel Đường Thầy — `que-ui.js:181`, `que-ui.js:270`, gate AI `que-ui.js:191`), `src/game/wardrobe-ui.js` (`wardrobe-ui.js:22`, nhãn Hợp mệnh render sẵn `wardrobe-ui.js:84`), `src/game/npc-deep.js` (bước «Năm nay» tại `npc-deep.js:41`), `zheri-case.js` (`zheri-case.js:39-44`), `dz-case.js` (`dz-case.js:55-59`), `gu-gongan.js` / `namhan.js` / `kinh-tu.js` (khuôn module thuần đã code P0-1 «Đường Thầy»), `court.js` (3 spot khách tại `court.js:47-49`), `vite.config.js` (chunk `engine-ai` tại `vite.config.js:95-97`, entry `game.html` tại `vite.config.js:88`), `worker/index.js` + `worker/admin.js` (không nằm trong 22), và toàn bộ file **mới** trong `src/game/` (`npc-personas.js`, `story-gen.js`, `bark-pool.js`, `map-rating.js`).

Lưu ý vận hành cho gate «git diff không đụng 22 file»: working tree hiện tại đã dính thay đổi chưa commit của các đợt trước (git status đầu session liệt kê 19 file trong 22 ở trạng thái `M`). Vì vậy lệnh gate phải chạy trên **diff của riêng đợt NPC-AI** (nhánh/mốc riêng cho đợt, ví dụ so với commit bắt đầu đợt), **không** chạy trên working tree chung — nếu không gate sẽ báo đỏ oan vì thay đổi cũ không phải của đợt này.

## 15.2 Quy tắc xuyên suốt: nhãn «chờ mở khóa (22 file — mục 15)»

Mọi chỗ trong cả bộ thiết kế NPC-AI (mục 01–36, kể cả hồ sơ 17–36) mà nêu một **điểm cắm nằm trong file khóa** phải mang nhãn chữ «chờ mở khóa (22 file — mục 15)». Quy tắc này áp dụng **kể cả bark** — điểm cắm bark Bà Tư ở `render3d.js:234-236` là file khóa nên bark đó không thể wire ở đợt module thuần, phải chờ G2. Cách viết nhãn trong hồ sơ:

```
// ví dụ dòng phải xuất hiện trong hồ sơ khi hẹn wire vào file khóa:
Bark chào khách của Bà Tư — cắm tại render3d.js:234-236
«chờ mở khóa (22 file — mục 15)»
```

Lý do quy tắc tồn tại: kinh nghiệm §0.3 cho thấy thêm sảnh/trạm mới bắt buộc đụng `world.js` + `stations.js` (hai file khóa), và panel án dz/zheri render per-key trong `case-ui.js` nên không thể thêm bước mà không đụng file khóa (`docs/GAME-THIET-KE-CHOT.md:39-40`). Nếu một hồ sơ hẹn wire vào `render3d/world/main/case-ui/vanmenh-ui/thaitue/stations/master-ui` mà **không** có nhãn — hồ sơ đó sai theo đặc tả và phải sửa. Kiểm tra nhanh khi duyệt hồ sơ: grep nhãn trong từng file hồ sơ phải khớp đúng số điểm cắm khóa được liệt kê.

## 15.3 ai.js không khóa ≠ «sửa thoải mái»

`ai.js` không nằm trong 22 file khóa nên **inject persona không bị khóa chặn**: thêm một system message persona vào mảng `messages` tại `ai.js:2747-2753`, và đưa persona vào khóa cache brief tại `ai.js:169-170` (hiện là `let _briefCache = null;` với comment «212ms → 0ms sau lần đầu»). Nhưng điều này **không** đồng nghĩa sửa thoải mái, vì ba ràng buộc vẫn treo trên đầu:

1. **Gate eval vẫn bắt buộc trước khi bật.** Persona chỉ được bật cho người chơi thật sau khi bộ thử đỏ 200 câu đạt M-ROLE ≥ 98% (giọng đúng nhân vật) và P0 = 100% (không vi phạm an toàn). Trước khi eval đạt, personainject nằm sau feature-flag **tắt mặc định** — người dùng vẫn thấy giọng «Thầy vô danh» hiện tại không đổi.
2. **K1/K2 — game chạy trọn khi AI tắt.** `FEATURES.ai = !IOS` tại `features.js:20` đã tắt AI trên iOS ở mọi cửa vào (`stations.js:119`, `case-ui.js:239/373/460/509`, `que-ui.js:191`, `vanmenh-ui.js:46`); fallback cục bộ `composeAnswer()` từ `nlg.js` chạy khi không sẵn sàng mạng (`ai.js:2711-2719`, `ai.js:2842-2847`). Inject persona không được phá nhánh này: khi AI tắt, mọi kịch bản + composeAnswer phải chạy như cũ, không crash, không ô trống.
3. **Điểm cắm persona phải nằm đúng chỗ, không đụng phần cứng AI khác.** Vị trí duy nhất được phép thêm là một phần tử `role:'system'` mới trong `ai.js:2747-2753`, chèn GIỮA dòng anti-manip (`ai.js:2749`) và dòng STYLE (`ai.js:2750`) — chốt duy nhất mục 04 §4.4.2 (đảo vị trí là đảo cơ chế ưu tiên an toàn > persona > style), và một trường trong khóa cache tại `ai.js:169-170`. Không đụng `SYSTEM_PROMPT` (`ai.js:2748`), không đụng `_ANTI_MANIP_GUIDE` (`ai.js:2749`), không đụng temperature/thinking (`ai.js:2763-2766`), không đụng cap tool-loop (`ai.js:2790`), không đụng timeout stream (`ai.js:2897-2911`), không đụng nhánh 503-fallback (`ai.js:2912-2916`).

Việc đưa persona vào khóa cache là bắt buộc chứ không phải tùy chọn: nếu để chung cache mà đổi persona, người dùng có thể nhận brief giọng cũ từ cache. Kích thước brief lớn (~20K token mỗi call) nên cache là điểm tiết kiệm cốt lõi (`ai.js:169-170`, `ai.js:2721-2724`) — thêm `personaId` vào key không làm mất lợi ích đó, chỉ phân nhánh cache theo giọng.

## 15.4 Bảng tổng quan giai đoạn G0–G4 (mẫu bắt buộc)

Cột «khóa?» trả lời: giai đoạn có cần mở khóa file nào trong 22 hay không. Mọi gate đều gồm ba thành phần nền (quy tắc (d) của bản thiết kế): **K1/K2** (game chạy trọn khi AI tắt), **offline smoke** (mục 12), **MMO không-lộ-chuyện** (mục 13) — bảng ghi thành phần đặc thù thêm vào.

| Giai đoạn | File đụng | Khóa? | Việc | Test | Gate |
|---|---|---|---|---|---|
| **G0** (đợt này) | File mới: `src/game/npc-personas.js`, `src/game/story-gen.js` (mục 08), `src/game/bark-pool.js`, `src/game/map-rating.js`; sửa `vite.config.js` (chunk + SW versioning mục 12) | **Không** — toàn file mới + file cấu hình không khóa | `PERSONA` + `PERSONA-CHUNG` + 20 persona data; bark pools; story generator; map rating helper (6 mức `liunian-pro.js:304-309` → từ mềm); nội dung đi qua build pipeline để SW versioning | `test-persona-schema.mjs`, `test-bark-pool.mjs`, `test-story-gen.mjs` (same-seed), `test-map-rating.mjs` | 4 test đạt + không import DOM + `git diff` đợt không đụng 22 file (+ K1/K2 + offline smoke + MMO không-lộ-chuyện) |
| **G1** | `src/engine/ai.js` (điểm cắm `ai.js:2747-2753`, `ai.js:169-170`); feature-flag trong `features.js` hoặc trong `npc-personas.js` | **Không** — `ai.js` không khóa | Thêm system message persona + persona vào cache key; flag **tắt mặc định** nếu không muốn đổi hành vi Thầy hiện tại trong đợt | eval M-ROLE ≥ 98% + P0 100% (bộ đỏ 200 câu) | eval đạt + game chạy trọn khi AI tắt (K1/K2) + offline smoke (mục 12) + MMO không-lộ-chuyện |
| **G2** | `render3d.js`, `world.js`, `main.js`, `case-ui.js`, `vanmenh-ui.js`, `thaitue.js`, `stations.js`, `master-ui.js`, `game.css`, `vanmenh.js` | **CÓ — mở khóa 22 file** | Wire bark trạm: Bà Tư `render3d.js:234-236`; tutorial Lão Tùng (hồ sơ 33); bark Thầy Giải Quẻ / Ống Xăm / Lư Hương / Thái Tuế / Vận Mệnh Các / La Bàn Đài / Bảng Lịch (mục 05); story generator consumer qua `makeStory` | demo chạy tay + replay same-seed + kiểm MMO | demo + same-seed + MMO không lộ chuyện riêng (mục 13) + K1/K2 + offline smoke |
| **G3** | `render3d.js`, `world.js`, `landmarks.js`, `characters.js`, `interior.js`, `obstacles.js`, `accessories.js`, `effects.js`, `cosmetics.js` | **CÓ** | Model 3D canon: Am Vân Cốc, chiếu cói Khổng, cổng Lão Tùng…; vị trí NPC; va chạm theo hình khối | duyệt 3D + đo bark | duyệt 3D đạt + bark ≤ 90 ký tự + không bark doạ + K1/K2 + offline smoke + MMO |
| **G4** | `src/engine/ai.js` (inject — không khóa); 3D của nhóm tôn giáo **chờ riêng**, không thuộc G4 | `ai.js` không khóa; phần 3D chờ mở khóa theo đợt riêng | Runtime tôn giáo theo biên bản: Trương Thiên Sư → Diệu Âm → Trúc Lâm → Khâu đạo trưởng → Vu y bà; Lạt-ma Đa Kiệt **cuối cùng** | eval riêng từng persona | biên bản tham vấn tôn giáo có + eval riêng đạt + red team 200 câu chạy lại + K1/K2 + offline smoke + MMO |

Thứ tự nhân vật tổng xuyên suốt cả lộ trình: **Thầy Tử Bình (G1) → khách procedural AI-light (G2) → Vân Cốc / Khổng khi 3D xong (G3) → nhóm tôn giáo cuối (G4)**.

## 15.5 G0 — đợt này: module thuần, bark pool, story generator, map rating

G0 là đợt **đang làm**, không đụng một file nào trong bảng 15-1. Nội dung:

**a) `src/game/npc-personas.js` (hàm) + `src/game/persona-data.js` (dữ liệu)** — dữ liệu gồm `PERSONA-CHUNG` (10 luật chung: AI chỉ nói không làm; dữ liệu trước giọng sau T5; không phán định mệnh T2; an toàn T6; từ chối thừa ≤ 2% với chuyển người cụ thể; không nhắc tiền/Ngọc/VIP…) và `PERSONA-<id>` cho đủ 20 persona canon của bộ gdd 06 (`van_coc, khong_tiensinh, thay_tubinh, truong_thiensu, dieu_am, te_tuu, huyen_hu, khau_daotruong, maoshan_daonhan, truclam_thiensu, lama_dakiet, phan_quan, diatang_su, vu_y_amau, lo_ban_su, dinh_menh_hoi, gac_cong, tho_may, dan_dinh, phuong_si`); module chỉ export ba hàm thuần `getPersona` / `personaSystemPrompt` / `personaBark` (mục 04 §4.4.1). Khuôn tham chiếu là các module thuần đã code `gu-gongan.js` / `namhan.js` / `kinh-tu.js` với test `test-game-thay-mo-rong.mjs` 13 đạt. Lạt-ma Đa Kiệt nạp vào module nhưng đánh dấu `runtime: false` (bản nháp chờ tham vấn — không bao giờ được consumer nào đọc nếu flag tôn giáo chưa bật).

**b) `bark-pool.js`** — pool bark theo nhân vật, mỗi bark ≤ 90 ký tự, không bark doạ, không bark chê lá số xấu của người chơi, không chữ Hán trong bong bóng. Bark chỉ là dữ liệu + hàm `pickBark(id, seed, ctx)` không state — không tự hiển thị, không tự cắm vào game. Điểm cắm hiển thị của bark nằm ở file khóa (`render3d.js:234-236` cho Bà Tư…) nên tất cả consumer bark phải mang nhãn «chờ mở khóa (22 file — mục 15)».

**c) `story-gen.js`** — story generator theo mục 08: sinh chuyện riêng của khách procedural từ hạt giống ngày + khe + pid (`main.js:56`, `stations.js:673`, `stations.js:693`), same-seed ra cùng chuyện, dùng dữ liệu lá số thật của khách qua `makeNpc` (`npc.js:41`) và `npcDeep(R, year)` (`npc-deep.js:41`). Không import DOM, không đụng mạng.

**d) `map-rating.js`** — helper bản đồ ngôn ngữ rating: 6 mức lưu niên tại `liunian-pro.js:304-309` → từ mềm «Thuận — nên làm» / «Bình thường» / «Nên thủ, giữ sức»; cấm chữ «đại hung/tai họa/chết» ở lớp hiển thị; chữ kỹ thuật chỉ hiện trong `<details>` (GAME-HUYEN-QUAN-SPEC §11 mục 3 qua GAME-THIET-KE-CHOT P0-1).

**e) Build pipeline + SW versioning (mục 12).** Bốn module mới phải đi qua `vite.config.js` để bundle + hash: thêm 4 module vào chunk nhóm `engine-ai` bên cạnh `ai.js` / `brief-extender.js` / `nlg.js` (các dòng `vite.config.js:95-97`) — hoặc một chunk riêng `engine-npc` nếu muốn tải lười độc lập; service worker tự bust cache theo hash nên nội dung persona đổi không cần đụng SW thủ công.

**f) Bốn test bắt buộc** (đặt `scripts/`):

| Test | Kiểm gì | Pass khi |
|---|---|---|
| `test-persona-schema.mjs` | Schema từng `PERSONA-<id>`: đủ trường bắt buộc, 20 id khớp bộ gdd, Lạt-ma có `runtime: false` | 20/20 schema đạt, không trường thiếu |
| `test-bark-pool.mjs` | Mỗi bark ≤ 90 ký tự, không từ cấm (doạ/chê lá số/chữ Hán), pool không rỗng, `pickBark` same-seed ổn định | toàn pool đạt |
| `test-story-gen.mjs` | `makeStory` same-seed cùng kết quả, khác-seed khác kết quả, không đọc DOM/network | same-seed ổn định |
| `test-map-rating.mjs` | 6 mức → 3 nhóm từ mềm đúng, không có chữ cấm ở lớp hiển thị | 6/6 mức đúng |

**Gate G0** — cả bốn điều kiện: (1) bốn test đạt khi chạy `node scripts/test-persona-schema.mjs && node scripts/test-bark-pool.mjs && node scripts/test-story-gen.mjs && node scripts/test-map-rating.mjs`; (2) không import DOM — grep `document|window` trong 4 module mới trả rỗng; (3) `git diff` **của đợt** không đụng 22 file, lệnh kiểm:

```
git diff --name-only <MỐC_BẮT_ĐẦU_ĐỢT> -- \
  src/game/net.js src/game/protocol.js worker/quan-room.js src/game/render3d.js \
  src/game/landmarks.js src/game/obstacles.js src/game/accessories.js src/game/effects.js \
  src/game/world.js src/game/characters.js src/game/main.js src/game/state.js \
  src/game/stations.js src/game/interior.js src/game/game.css src/game/cosmetics.js \
  src/game/cases.js src/game/case-ui.js src/game/master-ui.js src/game/vanmenh.js \
  src/game/vanmenh-ui.js src/game/thaitue.js
# output PHẢI rỗng
```

Cộng thêm ba thành phần nền: game chạy trọn khi AI tắt (K1/K2) — G0 chưa đụng code game nên chỉ cần build sạch vẫn tải được game.html (`vite.config.js:88`); offline smoke mục 12 (build offline chạy được); MMO không-lộ-chuyện — G0 chưa có gì đưa lên room, chỉ xác nhận module mới không import `net.js`/`protocol.js`.

## 15.6 G1 — inject ai.js, KHÔNG cần mở khóa

Đây là mốc được phép hoạt động nhờ «ai.js không khóa» — nhưng vẫn bị eval chặn trước khi bật người dùng thật. Việc:

**a) Thêm system message persona vào `ai.js:2747-2753`.** Pseudo-code dán được (đánh dấu dòng chèn; các dòng khác giữ nguyên):

```js
  // import { getPersona, personaSystemPrompt } from '../game/npc-personas.js'; — mục 04 §4.4.1
  const messages = [
    { role: 'system', content: (import.meta.env?.MODE === 'ios' ? RESEARCH_SYSTEM_PROMPT : SYSTEM_PROMPT) },
    { role: 'system', content: brief + '\n\n' + _guide + '\n\n' + _ANTI_MANIP_GUIDE },
    // [G1 — NPC-AI] persona nhân vật, chỉ khi flag bật và lá số được gán persona
    // — chèn GIỮA dòng anti-manip và dòng STYLE (chốt duy nhất mục 04 §4.4.2):
    ...(NPC_PERSONA_ENABLED && R?.npcPersona && getPersona(R.npcPersona)
      ? [{ role: 'system', content: personaSystemPrompt(getPersona(R.npcPersona), R) }]
      : []),
    { role: 'system', content: (STYLE_DIRECTIVES[style] || STYLE_DIRECTIVES['gan-guoi']) + '\n\n⚠ REMEMBER THIS STYLE WHEN ANSWERING — áp dụng cho Câu trả lời này.' },
    ...((history || []).slice(-8)),
    { role: 'user', content: question },
  ];
```

`NPC_PERSONA_ENABLED` đọc từ feature-flag — đặt trong `features.js` (không khóa) hoặc trong `npc-personas.js`; **tắt mặc định** nếu đợt này không muốn đổi hành vi Thầy hiện tại. iOS vẫn tắt hoàn toàn qua `FEATURES.ai` (`features.js:20`) nên nhánh inject không bao giờ chạy trên iOS — không cần đụng `RESEARCH_SYSTEM_PROMPT` tại `ai.js:2748`.

**b) Persona vào cache key `ai.js:169-170`.** Khóa hiện là `let _briefCache = null;` (cache đơn biến). G1 đổi thành cache theo key gồm lá số + ngày + gia đình + `personaId`:

```js
  // [G1 — NPC-AI] cache key thêm persona để không dính brief giọng cũ
  const _briefKey = [chartKey(R), dayKey(), familyKey(R), R?.npcPersona || 'thay-vodanh'].join('|');
```

**c) Thứ tự nhân vật trong G1: Thầy Tử Bình trước, sau đó khách procedural AI-light.** Thầy Tử Bình (`thay_tubinh`) là persona duy nhất có consumer ngay từ G1 vì «Thầy» đã có sẵn trong `master-ui.js` (khung hỏi-thầy `master-ui.js:32`, nút 🎙 tại `stations.js:127-130` — nhưng **không đổi UI**, chỉ đổi giọng qua `ai.js`). Khách procedural AI-light (an0-an2, 4 sảnh 1-người, hợp hôn, trach, duongtrach) dùng story generator nhưng hiển thị của khách nằm ở `case-ui.js` / `render3d.js` — file khóa — nên phần chuyện của khách chỉ **bật được nội dung sau eval khi consumer chưa wire** ở mức: story sẵn trong module, consumer wire ở G2.

**Gate G1** (bốn điều kiện, thiếu một là không bật): (1) eval M-ROLE ≥ 98% + P0 100% trên bộ đỏ 200 câu chạy với persona Thầy Tử Bình; (2) K1/K2 — game chạy trọn khi AI tắt: tắt flag + `FEATURES.ai=false` mô phỏng iOS, mọi cửa vào tắt nút, composeAnswer vẫn trả lời; (3) offline smoke mục 12: build offline + chạy game không mạng, AI rơi nhánh fallback không crash; (4) MMO không-lộ-chuyện: persona Thầy chạy client-side, không field mới lên room.

## 15.7 G2 — mở khóa 22 file: wire bark + story consumer

G2 là đợt đầu tiên chạm bảng 15-1. Danh sách wire bark trạm (mỗi dòng mang nhãn «chờ mở khóa (22 file — mục 15)»):

- **Bà Tư thợ may** — bark chào/mời hàng cắm tại `render3d.js:234-236` (hiện nhân vật câm, chỉ cúi chào). «chờ mở khóa (22 file — mục 15)»
- **Tutorial Lão Tùng** — hồ sơ 33; bark dẫn tutorial tại cổng. «chờ mở khóa (22 file — mục 15)»
- **Thầy Giải Quẻ** — bark dẫn vào 5 phép gieo; hiện trạm chỉ có giọng người dẫn tab «Án cổ / Năm hạn của bạn / Chọn kinh» (`que-ui.js:181`, `que-ui.js:270`), trạm mở qua `stations.js:717-725`, ROOMS `world.js:85`. «chờ mở khóa (22 file — mục 15)»
- **Ống Xăm (Hoàng Đại Tiên)** — lời chào/mở thẻ nhân vật; hiện chỉ nói qua trạng thái keo (`stations.js:295-394`, ghi chú «Thơ xăm Hoàng Đại Tiên.» tại `stations.js:291`). «chờ mở khóa (22 file — mục 15)»
- **Lư Hương** — giọng tĩnh tâm; pool chung `names.js:10-25` hiện không theo ngày/người, wire nối pool bark theo ngữ cảnh; trạm `stations.js:399-434`. «chờ mở khóa (22 file — mục 15)»
- **Thái Tuế** — bark tuyên vị tướng + luật dân gian; dữ liệu `thaitue.js:9-10`, panel `vanmenh-ui.js:96-127`. «chờ mở khóa (22 file — mục 15)»
- **Vận Mệnh Các** — bark «người dẫn qua các cổng»; hiện cổng là cánh cửa không người (`world.js:76-77`, `world.js:86-93`, `vanmenh-ui.js:55-90`, `VAN_OPEN` `stations.js:728-737`). «chờ mở khóa (22 file — mục 15)»
- **La Bàn Đài** — bark chào tại trạm; nhãn trạm nằm trong `world.js:19-31`. «chờ mở khóa (22 file — mục 15)»
- **Bảng Lịch (Ngày)** — bark giới thiệu trạm chọn ngày; nhãn trong `world.js:19-31`. «chờ mở khóa (22 file — mục 15)»

**Story generator consumer qua `makeStory`:** khách procedural (an0-an2 `main.js:51-60` + `court.js:47-49` + `render3d.js:239-248`; hợp hôn `halls.js:144-176`; dieuhau `halls.js:51-90`; tuvi `halls.js:182-205`; tuongphap `halls.js:210-233`; cachcuc `halls.js:241-265`; trach `zheri-case.js:39-44`; duongtrach `dz-case.js:55-59`) gọi `makeStory(seed, R, slot, pid)` — đủ 4 tham số theo mục 08 §8.4: `slot` là slot khách của sảnh đó, `pid` tách người chơi — để có hoàn cảnh riêng + câu hỏi biến thể + cảm ơn theo nghiệm, thay chỗ câu hỏi 7 mẫu gốc của `npc.js:23-31` và cảm ơn 3 mức chung `case-ui.js:236`. Sửa chỗ gọi nằm trong `main.js` / `halls.js` / `case-ui.js` — `main.js` + `case-ui.js` khóa (nhãn bắt buộc), `halls.js` không khóa.

**Gate G2:** demo chạy tay qua đủ trạm bark; replay same-seed (cùng ngày + cùng pid ra cùng chuyện); MMO không lộ chuyện riêng (mục 13) — bark + story của khách chạy client-side từ seed, không field mới trong `protocol.js` / `worker/quan-room.js` (nếu cần field mới thì đợt G2 phải nêu rõ và duyệt riêng vì cả hai file khóa); K1/K2 + offline smoke vẫn chạy lại.

## 15.8 G3 — 3D canon + vị trí

G3 dựng hình thể: model 3D canon theo kế hoạch tài sản (Am Vân Cốc, chiếu cói Khổng, cổng Lão Tùng…) cắm vào `render3d.js` / `world.js` / `landmarks.js` / `interior.js` — toàn file khóa, nhãn bắt buộc. Va chạm theo hình khối đã có sẵn (`obstacles.js`) nên vị trí NPC mới phải đi qua kiểm «đi tới được, không xuyên». Đây cũng là mốc kích hoạt Vân Cốc + Khổng tiên sinh cho người chơi («Vân Cốc/Khổng khi 3D»): persona data của hai người này đã có từ G0, inject `ai.js` đã có khuôn từ G1, điều thiếu duy nhất là nơi đứng + bàn thoại — nên kích hoạt chỉ sau duyệt 3D. Tế tửu Văn Miếu chờ mapping `patternQuality` (engine đã có `patternQuality.quality`) trước khi vào vị trí dẫn bại cách.

**Gate G3:** duyệt 3D đạt (đúng canon, không tài sản người khác — giữ luật tượng không chữ của SPEC); đo bark ≤ 90 ký tự trên chính bản render; **không bark doạ** — quét pool bark của mọi nhân vật đứng trong cảnh qua từ-cấm (doạ/chê lá số xấu); cộng K1/K2 + offline smoke + MMO.

## 15.9 G4 — runtime tôn giáo theo biên bản

Nhóm tín ngưỡng bật runtime theo thứ tự chốt: **Trương Thiên Sư → Diệu Âm → Trúc Lâm → Khâu đạo trưởng → Vu y bà**, **Lạt-ma Đa Kiệt cuối cùng** (và chỉ khi biên bản tham vấn riêng của Lạt-ma có — hiện bản nháp `runtime: false`). Tiền điều kiện từng nhân vật: biên bản tham vấn tôn giáo/văn hóa có hiệu lực → eval riêng của persona đó đạt (M-ROLE ≥ 98%, P0 100%, từ chối thừa ≤ 2%) → red team 200 câu chạy lại toàn bộ trước khi mở nhân vật kế. «Nhiều persona này chỉ cần inject `ai.js` + eval, 3D chờ riêng» — tức phần lời nói đi trước, hình thể nằm đợt 3D riêng sau biên bản; trong lúc chờ 3D, nếu muốn nghe trước thì nghe ở khung hỏi-thầy qua inject `ai.js` (không khóa) chứ không dựng tượng. Vu y bà A Mậu còn tranh chấp canon về vai («mời» Tà Lộ vs «chỉ cửa, cảnh báo» — câu hỏi mở số 8 của README) nên hồ sơ 30 phải chốt vai trước khi eval, không phải sau.

**Gate G4:** biên bản có + eval riêng từng persona đạt + red team 200 lại đạt + K1/K2 + offline smoke + MMO không-lộ-chuyện.

## 15.10 Thứ tự nhân vật tổng + phân bổ hồ sơ 17–36

Quy tắc: **mỗi hồ sơ (17–36) tự ghi giai đoạn + nhãn file khóa** — bảng dưới là phân bổ chuẩn để mọi hồ sơ copy đúng dòng của mình; hồ sơ nào ghi lệch bảng này phải sửa theo bảng (hoặc nêu lý do thay đổi và cập nhật mục 15 trước).

| Hồ sơ | Persona | Giai đoạn kích hoạt | Ghi chú file khóa |
|---|---|---|---|
| 17 | `van_coc` — Vân Cốc | data G0, inject+eval G1, **kích hoạt G3 khi 3D** | vị trí am + bàn thoại: chờ mở khóa (22 file — mục 15) |
| 18 | `khong_tiensinh` — Khổng tiên sinh | data G0, inject+eval G1, **G3 khi 3D** | chiếu cói + biển «Đoán — không lấy tiền.»: chờ mở khóa (22 file — mục 15) |
| 19 | `thay_tubinh` — Thầy Tử Bình | **G1** (inject `ai.js` sau eval) | UI Thầy luận `master-ui.js` không đổi ở G1; bark ngoài giờ: chờ mở khóa (22 file — mục 15) |
| 20 | `truong_thiensu` — Trương Thiên Sư | **G4** (đầu hàng tôn giáo) | inject `ai.js` không khóa; 3D chờ đợt riêng |
| 21 | `dieu_am` — Ni sư Diệu Âm | **G4** | pháp sám cần `CHAN_HUI/JING_ZHOU` của engine — chỉ đọc, không sửa engine |
| 22 | `te_tuu` — Tế tửu Văn Miếu | data G0, **G3** (sau mapping `patternQuality`) | nút patternQuality chưa có — mapping qua story-gen trước |
| 23 | `huyen_hu` — Huyền Hư chân nhân | data G0, **G3** | sảnh Võ Đăng: vị trí chờ mở khóa (22 file — mục 15) |
| 24 | `khau_daotruong` — Khâu đạo trưởng | **G4** | inject `ai.js` không khóa |
| 25 | `maoshan_daonhan` — Mao Sơn đạo nhân | data G0, **G3** (thứ tự trừ tà đã phi-siêu-nhiên hóa trong persona) | nếu duyệt coi là pháp môn tín ngưỡng thật → đẩy G4 theo biên bản |
| 26 | `truclam_thiensu` — Thiền sư Trúc Lâm | **G4** | persona cực ngắn, `briefMode none` |
| 27 | `lama_dakiet` — Lạt-ma Đa Kiệt | data G0 (nháp), **G4 — cuối cùng**, chờ biên bản riêng | `runtime: false` cứng cho tới khi biên bản có |
| 28 | `phan_quan` — Phán quan Thôi | data G0, **G3** | thần thoại hư cấu (Phán Đồ), không nghi lễ thật |
| 29 | `diatang_su` — Địa Tạng sứ giả | data G0, **G3** | như trên |
| 30 | `vu_y_amau` — Vu y bà A Mậu | **G4** — chốt vai canon trước eval | tranh chấp «mời Tà Lộ vs chỉ cửa» phải giải trước |
| 31 | `lo_ban_su` — Yểm sư Lỗ Ban | **Không xếp giai đoạn** — không bao giờ chạy AI (cố ý) | chỉ kịch bản có người duyệt; không wire runtime |
| 32 | `dinh_menh_hoi` — Định Mệnh Hội | bark phe ở **G2**, kịch bản án ở G2+ | bark tắt khi người chơi crisis (30 phút); lời doạ phải vạch được bằng chỉ số engine |
| 33 | `gac_cong` — Lão Tùng | bark tutorial **G2** | bắt buộc tất định — không AI; cổng: chờ mở khóa (22 file — mục 15) |
| 34 | `tho_may` — Bà Tư | bark **G2** tại `render3d.js:234-236` | chờ mở khóa (22 file — mục 15) |
| 35 | `dan_dinh` — Đan Đỉnh chân nhân | bark + AI-light **G2**, 3D G3 | bảng thuốc → thánh địa qua story-gen |
| 36 | `phuong_si` — Phương sĩ Vô Danh | bark + AI-light **G2**, 3D G3 | xuất hiện theo can ngày — seed sẵn |

Nhóm thực thể code (ngoài 20 persona — Thầy vô danh hiện tại, Thầy Giải Quẻ, hàng chờ, hợp hôn, 4 sảnh 1-người, trach, duongtrach, Ống Xăm, Lư Hương, Trà Thất, Hồ Sen, người bán Tàng Y Các, Thái Tuế, Vận Mệnh Các, tượng thần) nhận giọng bark mới từ G2, không có persona AI riêng trừ nơi bảng trên ghi rõ.

## 15.11 Pseudo-code thứ tự import (mẫu bắt buộc)

Thứ tự nạp một cách **cứng**, không đảo — dữ liệu trước, chuyện trước, bark trước, consumer sau:

```js
// [NPC-AI — mục 15] thứ tự import chuẩn cho mọi consumer
// 1) dữ liệu giọng + luật chung (thuần, không DOM, không mạng)
import { getPersona, personaSystemPrompt } from './npc-personas.js';  // dữ liệu ở persona-data.js — mục 04 §4.4.1
// 2) chuyện riêng same-seed (mục 08)
import { makeStory, storySeed } from './story-gen.js';
// 3) bark ≤90 ký tự có gate từ-cấm
import { pickBark, BARK_POOLS } from './bark-pool.js';
// 4) consumers — chỉ nối đúng khi giai đoạn của nó đến:
//    G1: src/engine/ai.js (KHÔNG khóa) — persona system message ai.js:2747-2753 + cache key ai.js:169-170
//    G2+: render3d/world/main/case-ui/vanmenh-ui/thaitue/stations/master-ui
//         «chờ mở khóa (22 file — mục 15)»
//    G3: 3D canon (render3d/landmarks/interior/characters) — chờ mở khóa (22 file — mục 15)
```

Consumer nào import sai thứ tự (bark đụng PERSONA trước khi `npc-personas.js` nạp, hoặc story-gen đọc DOM) fail ngay ở test G0.

## 15.12 Bảng điểm cắm mục 05 với cột «chờ mở khóa» (mẫu bắt buộc)

Bảng điểm cắm rút từ mục 05 (bảng điểm danh 37 mục). Cột nhãn bắt buộc trên **mọi dòng file khóa**; dòng file không khóa ghi «không khóa — sửa được».

| Điểm cắm | Vị trí | Mục đích NPC-AI | Nhãn |
|---|---|---|---|
| Figure Thầy + cúi chào | `render3d.js:205-210`, `render3d.js:683-685` | gắn tên «Tử Bình», bark chào | chờ mở khóa (22 file — mục 15) |
| Bà Tư tại quầy Tàng Y Các | `render3d.js:234-236` | bark chào/mời hàng Bà Tư | chờ mở khóa (22 file — mục 15) |
| Khách ❓/✓ 3 khe | `render3d.js:239-248`, `render3d.js:787-816` | bubble chuyện riêng | chờ mở khóa (22 file — mục 15) |
| `openThay` + nút 🎙 | `stations.js:146`, `stations.js:127-130` | persona Thầy Tử Bình (giọng qua `ai.js`, UI giữ) | chờ mở khóa (22 file — mục 15) |
| `openXam` (Hoàng Đại Tiên) | `stations.js:295-394` (ghi chú `stations.js:291`) | bark chào/mở thẻ | chờ mở khóa (22 file — mục 15) |
| `openHuong` | `stations.js:399-434`, bốc câu `stations.js:408`, pool `names.js:10-25` | bark theo ngữ cảnh | chờ mở khóa (22 file — mục 15) — pool `names.js` không khóa, sửa được |
| `openTra` / `openSen` | `stations.js:501-558`, `stations.js:563-584` | bark người rót / hồ sen | chờ mở khóa (22 file — mục 15) |
| `openCaseSlot` | `stations.js:655-665` | khách có chuyện riêng | chờ mở khóa (22 file — mục 15) |
| `openQue` + Đường Thầy | `stations.js:717-725`, `que-ui.js:181/270/191`, `world.js:85` | bark dẫn vào 5 phép | chờ mở khóa (22 file — mục 15) cho `stations.js`/`world.js`; `que-ui.js` không khóa |
| `VAN_OPEN` + Vận Mệnh Các | `stations.js:728-737`, `world.js:76-77/86-93`, `vanmenh-ui.js:55-90`, `vanmenh.js:14` | bark người dẫn qua cổng | chờ mở khóa (22 file — mục 15) |
| Thái Tuế Điện | `thaitue.js:9-10`, `vanmenh-ui.js:96-127` (105/116/127), `world.js:73/94-97` | bark tuyên vị tướng | chờ mở khóa (22 file — mục 15) |
| Nhãn trạm sân | `world.js:19-31` (La Bàn Đài, Bảng Lịch Ngày…) | bark chào trạm | chờ mở khóa (22 file — mục 15) |
| `todayNpc` hạt giống | `main.js:51-60` (`main.js:56`) | seed story khách | chờ mở khóa (22 file — mục 15) |
| Cảm ơn án | `case-ui.js:236/370/457/472` | cảm ơn theo nghiệm story | chờ mở khóa (22 file — mục 15) |
| Nút «Hỏi Thầy» sau án | `case-ui.js:239/373/460/509`, lazy `case-ui.js:252` | persona theo án | chờ mở khóa (22 file — mục 15) |
| Hợp hôn | `halls.js:144-176` (không khóa), `case-ui.js:474-515` (khóa) | biến thể theo `hh.rating` | dòng `case-ui.js`: chờ mở khóa (22 file — mục 15) |
| Sảnh nghề build | `halls.js:51-90/182-205/210-233/241-265`, `HALL_BUILD` `halls.js:258` | thêm bước story | không khóa — sửa được |
| `makeNpc` | `npc.js:41` (tên `npc.js:18-20`, danh xưng `npc.js:33-38`) | hoàn cảnh + giọng riêng của khách | không khóa — sửa được |
| `npcDeep` «Năm nay» | `npc-deep.js:41` | luận lưu niên khách | không khóa — sửa được |
| Gate AI các cửa vào | `stations.js:119`, `case-ui.js:239/373/460/509`, `que-ui.js:191`, `vanmenh-ui.js:46`, `features.js:20` | giữ K1/K2 nguyên | `features.js` không khóa; 4 file còn lại: chờ mở khóa (22 file — mục 15) |
| Khung «Thầy luận» | `master-ui.js:32/57/65/69-72/77/81-87/90-93/95/105-106` | giữ nguyên ở G1 (giọng đổi qua `ai.js`) | chờ mở khóa (22 file — mục 15) nếu đụng |
| Trạm sảnh/điện | `stations.js:729` `STATION_OPEN`, `stations.js:693` `HALL_OPEN`, `world.js:42/62/76-92` | KHÔNG thêm trạm mới (khóa) | chờ mở khóa (22 file — mục 15) |
| MMO room | `protocol.js:107`, `worker/quan-room.js` | không field mới | chờ mở khóa (22 file — mục 15) |
| Cấp engine Thầy | `src/engine/ai.js:169-170/2747-2753` | inject persona + cache key | **không khóa — sửa được ở G1**, gate eval bắt buộc |

## 15.13 Checklist gate hợp nhất + bốn bẫy phải tránh

Gate đầy đủ của mỗi mốc phát hành (đánh dấu ✅ từng dòng khi chạy thật, ghi lệnh đã chạy):

1. `node scripts/test-persona-schema.mjs` — đạt (G0+).
2. `node scripts/test-bark-pool.mjs` — đạt (G0+).
3. `node scripts/test-story-gen.mjs` — same-seed đạt (G0+).
4. `node scripts/test-map-rating.mjs` — đạt (G0+).
5. `git diff --name-only <mốc đợt> -- <22 file>` — rỗng (G0); từ G2 biến thành «diff đợt khớp đúng danh sách file được phép của giai đoạn».
6. Eval M-ROLE ≥ 98% + P0 100% — trước **mọi** lần bật người dùng thật (G1, G4; G2/G3 chỉ cần khi bark kèm lời AI).
7. Red team 200 câu chạy lại — G4 mỗi nhân vật.
8. K1/K2 — game chạy trọn khi AI tắt: mỗi mốc, mô phỏng `FEATURES.ai=false` (mục tiêu `features.js:20`) + tắt flag persona.
9. Offline smoke (mục 12) — mỗi mốc.
10. MMO không-lộ-chuyện (mục 13) — mỗi mốc từ G2; G0/G1 xác nhận không field mới.

Bốn bẫy của bản này (mỗi bản sau phải tự đối chiếu):

- **Bẫy (a)** — KHÔNG viết lại «4 file khóa». Danh sách là **22 file**, chép đủ nguyên văn từ `docs/GAME-THIET-KE-CHOT.md:42` (bảng 15-1). Bản trước đã trích sai §0.3 — mọi bản dẫn lại phải đếm đủ 22.
- **Bẫy (b)** — «ai.js không khóa» ≠ «sửa thoải mái». Inject persona (`ai.js:2747-2753`) và cache key (`ai.js:169-170`) vẫn phải qua gate eval M-ROLE ≥ 98% + P0 100% trước khi bật; flag tắt mặc định nếu đợt không muốn đổi hành vi Thầy hiện tại.
- **Bẫy (c)** — mọi điểm cắm vào `render3d/world/main/case-ui/vanmenh-ui/thaitue/stations/master-ui` đều **chờ mở khóa**. Thấy hồ sơ nào hẹn wire vào các file này mà thiếu nhãn «chờ mở khóa (22 file — mục 15)» là sai — kể cả bark (`render3d.js:234-236` Bà Tư là file khóa).
- **Bẫy (d)** — gate không bao giờ chỉ một điều kiện. Mỗi gate luôn gồm K1/K2 + offline smoke + MMO không-lộ-chuyện, cộng các điều kiện riêng của giai đoạn ghi trong bảng 15-4.

## 15.14 Phạm vi không làm trong lộ trình này

Để lộ trình không phình: (1) **không thêm trạm/sảnh mới** — thêm trạm bắt buộc đụng `world.js` + `stations.js` và xếp vào đợt mở khóa riêng, không phải G2 bark; (2) **không ghi `deskLog`** hay đụng máy trạng thái thưởng — `state.js` khóa và đúng luật «AI chỉ nói, không làm»; (3) **không đảo quyết GAME-THIET-KE-CHOT** (Q1 cắt cảnh giới, Q3 cắt lộ trình 35 tuần…); (4) **Sổ Công Quá / Mệnh Đồ 6 tầng** (`remedy-fate.js` + `gaimenh.js`, `docs/GAME-THIET-KE-CHOT.md:32-33`) giữ nguyên trạng thái hoãn tới khi mở khóa `state.js`/`stations.js` theo §2 của bản chốt; (5) **không dựng 3D nhóm tôn giáo trong G4** — 3D của nhóm này là đợt riêng sau biên bản; (6) **không sửa worker MMO** (`worker/quan-room.js`) để phát chuyện riêng — nếu cần field mới thì làm đợt duyệt riêng vì file khóa.
