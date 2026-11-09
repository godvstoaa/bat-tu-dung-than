# 13.21 · Phụ lục F — Quy trình sản xuất từng bước (SOP)

> Mỗi quy trình: ai làm, lệnh chạy, đầu ra, điều kiện qua cổng. Dùng khi đội đã có các công cụ của bảng việc; trước khi có công cụ, bước tương ứng làm tay và ghi chú.

## F.1 Một công trình từ ý tưởng tới Định nghĩa Done

| Bước | Ai | Việc | Lệnh / công cụ | Đầu ra | Cổng |
|---|---|---|---|---|---|
| 1 | LVL | Lấy mục `BLD-<region>-nn` từ tài liệu 07 (hạng, công năng, tương tác, kích thước) | — | phiếu công trình | hạng và công năng rõ |
| 2 | TA | Thêm mục SCHEMA-ASSET vào manifest (`layer: shell`, `bld`, `sizeTarget`, `hd` nếu hạng A) | sửa `assets-meshy/manifest.json` | mục manifest | `prompt` ≤ 800 ký tự kể cả phong cách chung |
| 3 | TA | Tạo preview | `node scripts/meshy-gen.mjs preview bld_<region>_<nn>_shell` | task id trong `state.json` | số dư credit đủ (`balance`) |
| 4 | TA | Kiểm trạng thái, tải thumbnail | `node scripts/meshy-gen.mjs status` | `assets-meshy/thumbs/*.preview.png` | — |
| 5 | ART + LVL | Duyệt tờ tổng hợp | `node scripts/asset-sheet.mjs --region <region> --stage preview` | quyết định duyệt / `reject` | hình bóng đúng nguyên mẫu, không chữ, cửa có thể khoét |
| 6 | TA | Refine + tải | `meshy-gen.mjs refine …`, `meshy-gen.mjs download …` | `assets-meshy/raw/<id>.glb` | — |
| 7 | ART | Khoét cửa, cửa sổ; tách mesh `__roof`, `__floorN`, `__door_*`, `__win`, `__nocol`; kiểm lát cắt | Blender | GLB đã sửa trong `raw/` | ảnh lát cắt thấy lòng trong |
| 8 | TA | Đóng gói chế độ shell (giữ tên mesh), sinh `.hd`/`.lod` | `node scripts/meshy-pack.mjs <id>` (cờ shell) | `public/models/<id>{.hd,,.lod}.glb` + tên băm | A1–A10 (`validate-assets`) |
| 9 | LVL | Viết SCHEMA-BUILDING: `shell.at/fit`, `floors`, ô, cổng, cửa, cầu thang, đèn, trạm, NPC | sửa `src/game/data/buildings/<region>.json` | dữ liệu công trình | `validate-buildings` xanh |
| 10 | TA | Nướng va chạm | `node scripts/bake-collision.mjs BLD-<region>-nn` | `public/col/BLD-….json` | ô cửa trống, `test-bake` |
| 11 | TA | Bản nháp nội thất | `node scripts/interior-fit.mjs BLD-<region>-nn --kit <bộ>` | `INT-….draft.json` | — |
| 12 | LVL | Hoàn thiện bố trí nội thất theo tài liệu 08 (`INT-<bld>`) | sửa JSON | `INT-BLD-….json` | mô-đun bắt buộc của hạng có đủ |
| 13 | CNT | Nối tương tác: trạm, NPC, nhiệm vụ (tài liệu 03/09) | dữ liệu nhiệm vụ | — | hạng A ≥ 3 tương tác |
| 14 | QA | Định nghĩa Done tự động | `node scripts/test-building-dod.mjs BLD-<region>-nn` | báo cáo | xanh |
| 15 | QA | Ảnh 4 góc + trong nhà; đo hiệu năng trong nhà | `bench-scenes` cảnh S2-kiểu cho công trình | ảnh `docs/art/<region>/BLD-…/`, SCHEMA-PERF-REPORT | ≥ 30 khung/giây mid; ngân sách §10 phần 06 |
| 16 | LVL | Đặt `dod.status: 'done'` | — | — | PR được duyệt |

Thời gian điển hình (ước): hạng A 6–9 ngày công tổng (ART 3, LVL 3, TA 1, QA 1); hạng C 1,5–2 ngày.

## F.2 Một nhiệm vụ từ kịch bản tới phát hành

| Bước | Ai | Việc | Lệnh | Cổng |
|---|---|---|---|---|
| 1 | Biên kịch (tài liệu 03) | Kịch bản Markdown đúng định dạng canon §1, có `> Hiệu ứng:` nếu cần | — | dùng đúng tên NPC canon |
| 2 | CNT | Chuyển thoại | `node scripts/dialogue-from-md.mjs docs/…/<tệp>.md` | không lỗi tên nhân vật, cảnh trỏ sai |
| 3 | CNT | Viết JSON nhiệm vụ (nút, cạnh, điều kiện, hiệu ứng, `ios`, `sensitive`, `checkpoints`) | sửa `src/game/data/quests/<tệp>.json` | — |
| 4 | CNT | Kiểm | `node scripts/validate-content.mjs` | V1–V20 xanh |
| 5 | CNT | Chơi thử bằng `?debug=1` (`__hq.quests.debug.force(id, node)`, `__hq.clock.set(...)`) | trình duyệt | đi hết các nhánh |
| 6 | QA | Bot | `node scripts/sim-quests.mjs --quest <id>` | 5 lá số không kẹt |
| 7 | QA | iOS (nếu `ios ≠ 'off'`) | `verify-ios-game` | nút đoán vận đã thay |
| 8 | PRD | Duyệt cố vấn (nhiệm vụ có nội dung tôn giáo/nhạy cảm) | — | biên bản |
| 9 | CNT | PR `content/<id>` | CI | xanh + 1 người duyệt |
| 10 | CNT | Kiểm chéo mã | `node scripts/validate-ids.mjs` | không `UNDEFINED` |

Sửa nhiệm vụ đã phát hành: tăng `v`; nút bị xóa phải có `migrate` hoặc checkpoint trước nó (V14); hiệu ứng đã qua không đổi thì đặt `stableAid: true` cho nút đó (phần 03 §11).

## F.3 Một persona NPC

| Bước | Ai | Việc | Cổng |
|---|---|---|---|
| 1 | Tài liệu 06 | Thẻ persona: giọng, phạm vi, câu cấm, câu mở đầu | — |
| 2 | CNT | `src/game/data/personas/<npc>.json` theo phụ lục A.12, `status: 'draft'` | schema xanh |
| 3 | AI | Chọn `baseline`, `briefMode`, `briefSections`, `toolsAllow` (đối chiếu `AI_TOOLS` thật) | validator persona |
| 4 | CNT | `fallbackDialogue` phủ mọi mục `scope` | iOS/AI tắt vẫn trò chuyện được |
| 5 | AI + QA | Đánh giá 30 câu (bộ câu từ tài liệu 06) | Neo trung bình ≥ 90 với `master`; 0 vi phạm `forbid` hiển thị |
| 6 | PRD | Cố vấn duyệt (persona tôn giáo) → `status: 'approved'`, `reviewer` | chữ ký |
| 7 | AI | Bật trong cấu hình từ xa (nếu đang tắt) | — |

Persona `lama_dakiet` giữ `draft` cho tới khi có tham vấn (TASK-246).

## F.4 Một vùng mới (thánh địa)

| Bước | Ai | Việc | Lệnh | Cổng |
|---|---|---|---|---|
| 1 | CLI | Tham số địa hình trong `terrain.REGIONS` (phần 07 §1.3), `CLEARINGS` | `test-terrain` | tâm đi được, bình đài phẳng |
| 2 | LVL | SCHEMA-REGION-MANIFEST: tâm, bán kính, `unlock`, đường, âm thanh, ngân sách | `validate-content` | schema xanh |
| 3 | ART/TA | Vỏ công trình theo F.1 (song song) | — | — |
| 4 | ART | Bộ mô-đun (nếu phong cách mới) + atlas | `validate-assets` | ≥ 15 mô-đun |
| 5 | LVL | Công trình, POI, đạo cụ | — | F.1 cho từng công trình |
| 6 | TA | Bóng vùng xa | `node scripts/build-skyline.mjs <region>` | ≤ 3.000 tam giác |
| 7 | CLI | Kê khai streaming + đồ thị đường | `node scripts/build-stream.mjs && node scripts/build-nav.mjs` | `test-nav`: tới được từ Huyền Thành |
| 8 | CNT | NPC, persona (F.3), nhiệm vụ phụ `SQ-<region>-*` (F.2) | — | — |
| 9 | QA | S5 vùng + ngâm bộ nhớ | `bench-scenes --scenes S5-<region>` | ngân sách mid |
| 10 | PRD | Cố vấn truyền thống của vùng | — | biên bản |

## F.5 Sửa engine (ảnh hưởng app chính)

1. Nhánh `engine/TASK-xxx-…`; không kèm code game.
2. Thêm ca test làm đỏ trước khi sửa (chứng minh lỗi có thật), sửa, ca xanh.
3. `npm test`, `npm run accuracy`, `node scripts/lint-tengod.mjs` — không giảm.
4. `node scripts/gen-mau-charts.mjs --check` — nếu số lá số mẫu đổi: cập nhật `mau-charts.json` có lý do; tăng `ENGINE_V` trong `menhban.js`.
5. Ghi nhật ký thay đổi engine (người dùng trang chính thấy khác).
6. TD duyệt; phát hành cùng chu kỳ app chính.

## F.6 Thêm một SKU (M6 trở đi)

1. Tài liệu 11 định nội dung, giá; OWN đồng ý.
2. SRV thêm vào `src/game/data/skus.json` (phụ lục B.6); `test-skus` xanh (không chạm chỉ số tu).
3. OWN tạo sản phẩm trên App Store Connect / Stripe; điền `store.apple`, `store.stripe`.
4. QA mua sandbox ba kênh; hoàn tiền sandbox.
5. Bật qua cấu hình từ xa `features.pay` (nếu lần đầu) sau khi OWN duyệt production.

## F.7 Xoay khóa bí mật

| Khóa | Bước | Ảnh hưởng người chơi |
|---|---|---|
| `HQ_TOKEN_KEY` | đặt khóa mới với `kv` mới (`wrangler secret put`), triển khai bản đọc cả hai `kv`; sau 7 ngày bỏ khóa cũ | không (token tự refresh) |
| `HQ_TOKEN_KEY` (lộ khóa) | như trên nhưng bỏ khóa cũ ngay | mọi client gọi lại `/auth/device` một lần (tự động) |
| `HQ_RECEIPT_KEY` | khóa mới cho biên nhận mới; giữ khóa cũ để kiểm biên nhận cũ tới khi hết hạn đồng bộ (30 ngày) | không |
| `HQ_ANALYTICS_PEPPER` | đổi → `aid` mới | mất liên tục số liệu giữ chân một kỳ (ghi chú trên bảng) |
| Khóa thanh toán | theo hướng dẫn nhà cung cấp; tạm dừng webhook trong lúc xoay | thanh toán gián đoạn vài phút |
| Khóa AI (`ai:config`) | qua bảng quản trị app | AI có thể gián đoạn; game chuyển thoại kịch bản |

Mọi lần xoay ghi vào nhật ký kiểm toán (OPS) và báo OWN.

## F.8 Chuẩn bị bản iOS

```
npm run build:ios          # build-corpus + ios-clean-outdir + vite build --mode ios + ios-postbuild (bỏ .hd.glb)
npm run verify:ios         # tạo tác: corpus, HTML research-first, không /api/inbox …
npm run verify:ios-path    # đường duyệt Thư viện của Apple
npm run preview:ios        # cổng 5174, rồi:
node scripts/verify-ios-game.mjs http://127.0.0.1:5174   # phụ lục E.2.10
npm run cap:ios            # cap sync ios → mở Xcode, ký, Archive
```

Ghi chú duyệt cho Apple (PRD soạn, OWN nộp): nhấn mạnh «Học Quán» là không gian học cổ pháp và tu tâm (đọc kinh điển, học cách tính lá số như môn học, việc thiện); không có chức năng đoán vận cho người dùng trên bản iOS (ma trận phụ lục E.3).

## F.9 Đo hiệu năng một cảnh mới

1. Thêm định nghĩa cảnh (vị trí, camera, giờ, chất lượng, số người giả) vào bảng `bench-scenes` (phần 09 §4).
2. Chạy CI (SwiftShader) 2 lần → số tất định phải trùng nhau; ghi mốc `perf/baselines/ci/<cảnh>.json`.
3. Chạy máy phòng thí nghiệm ba hạng → mốc `perf/baselines/<máy>/<cảnh>.json`.
4. PR mốc có dòng «Lý do» và TD duyệt.

## F.10 Xử lý báo cáo người chơi trong MMO

1. Báo cáo lưu ở `TownShard.ctx.storage` (`report:*`, trần 500/phòng — hiện có).
2. OPS đọc hằng tuần bằng script `scripts/reports-dump.mjs` (đọc qua route quản trị riêng có xác thực quản trị, không qua `/api/hq/*` công khai).
3. Tên vi phạm: thêm từ vào danh sách `BAD` của `protocol.cleanName` (bản phát hành kế); tài khoản tái phạm: chặn theo `acc` ở `PlayerVault` (cờ `mmoBan` hết hạn sau N ngày).
4. Không có chat tự do → không cần kiểm duyệt văn bản thời gian thực (giữ chính sách «cụm từ soạn sẵn», Guideline 1.2).
