# 13.27 · Phụ lục L — Tham chiếu script mới (dòng lệnh)

> Quy ước chung cho mọi script mới trong `scripts/`: chạy bằng `node scripts/<tên>.mjs`; không dùng shell (đường dẫn repo có khoảng trắng và dấu «app bói toán» — học từ `dev-mmo.mjs`); đọc đường dẫn bằng `path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')`; in kết quả tiếng Việt; **mã thoát**: 0 đạt, 1 lỗi kiểm (CI fail), 2 lỗi dùng sai tham số / thiếu tệp, 3 lỗi môi trường (mạng, khóa API). Cờ chung: `--json` (in kết quả máy đọc), `--quiet`.

## L.1 Engine và dữ liệu lá số

### `lint-tengod.mjs` (TASK-004)

```
node scripts/lint-tengod.mjs [--fix-report] [--allow scripts/lint-tengod.allow.json]
```

| Vào | `src/engine/*.js` |
|---|---|
| Ra | danh sách `tệp:dòng · chuỗi · ngữ cảnh`; `--fix-report` thêm gợi ý `normGod(...)` |
| Luật | literal `劫财`, `伤官`, `七杀`, `正财`, `偏财` nằm trong `includes(`, `has(`, `===`, `!==`, khóa object dùng để tra, `case '…'` |
| Thoát 1 | có mục ngoài tệp ngoại lệ |

### `gen-mau-charts.mjs` (TASK-033)

```
node scripts/gen-mau-charts.mjs [--check] [--seed 2026] [--max 50000]
```

| Vào | engine (`chart.js` + 7 engine phụ của Mệnh Bàn) |
|---|---|
| Ra | `src/game/data/mau-charts.json` (SCHEMA-MAU-CHART) |
| `--check` | không ghi; so `expect` hiện có với engine; thoát 1 nếu khác, in bảng khác biệt |

## L.2 Nội dung

### `dialogue-from-md.mjs` (TASK-029)

```
node scripts/dialogue-from-md.mjs <tệp.md|thư mục> [--out src/game/data/dialogue] [--text src/game/data/text/vi.json] [--dry]
```

| Vào | Markdown theo định dạng canon §1 (khối `[CẢNH …]`) |
|---|---|
| Ra | `dialogue/<id>.json` (SCHEMA-DIALOGUE) + khóa mới trong `text/vi.json` (không ghi đè khóa đã có nếu nội dung trùng; khác nội dung → thoát 1 trừ khi `--overwrite`) |
| Báo cáo | số cảnh, dòng, lựa chọn; lỗi tên nhân vật lạ, cảnh trỏ sai; cảnh mồ côi (cảnh báo) |

Bảng tên nhân vật → npc id lấy từ canon §4 (sinh tự động bằng cách đọc bảng trong `docs/gdd/00-KINH-DIEN-CHUNG.md`) + `src/game/data/npc-names.json` (NPC phụ của tài liệu 06).

### `validate-content.mjs` (TASK-030, TASK-089)

```
node scripts/validate-content.mjs [--only quests|dialogue|personas|deeds|perks|buildings|regions] [--prev <git-ref>] [--ios]
```

| Kiểm | V1–V20 (phần 03 §13), L1–L4 (phần 04 §2), schema phụ lục A/B |
|---|---|
| `--prev` | so với nội dung ở commit khác cho V14 (nút bị xóa cần `migrate`/checkpoint) |
| `--ios` | đánh giá với `IOS = true` (V9, V10) |
| Thời gian mục tiêu | < 5 s cho toàn bộ dữ liệu |

### `validate-ids.mjs` (phần 11 §7)

```
node scripts/validate-ids.mjs [--full] [--milestone M2] [--out test-results/content-index.json]
```

| Vào | `docs/gdd/**/*.md`, `src/game/data/**` |
|---|---|
| Ra | SCHEMA-CONTENT-INDEX |
| Thoát 1 | `UNDEFINED`, `DUP_DEF`, `WRONG_NS`; `NO_DATA_AT_MILESTONE` chỉ thoát 1 khi `--milestone` bằng mốc đang đóng |

### `sim-quests.mjs` (TASK-090)

```
node scripts/sim-quests.mjs [--all | --quest MQ-1-03 | --act 1] [--charts MAU-A,MAU-C,…] [--ios] [--tl] [--trace]
```

| Hành vi | bot chọn phương án hợp lệ đầu tiên (hoặc theo `--policy random --seed n`), phát sự kiện giả cho mỗi loại nút, tua đồng hồ cho `wait`/`window` |
|---|---|
| Ra | mỗi lá số: nhiệm vụ đã xong, nút kẹt (kèm `trace`), tổng Đạo Hạnh/Phúc Khí/công đức thu được |
| Thoát 1 | có nút kẹt ở `kind: 'main'` |

### `sim-economy.mjs`

```
node scripts/sim-economy.mjs [--days 90] [--profiles all] [--with-skus]
```

Ra bảng theo kiểu người chơi × ngày: Phúc Khí, Ngọc, Đạo Hạnh, công đức; kiểm trần ngày và khoảng cách Đạo Hạnh giữa Tiềm Lực 20 và 88 (ngưỡng do tài liệu 04/11 chốt). `--with-skus`: thêm người mua, khẳng định chênh lệch Đạo Hạnh = 0.

## L.3 Thế giới và công trình

### `validate-buildings.mjs` (TASK-081)

```
node scripts/validate-buildings.mjs [--region thanh] [--id BLD-thanh-01]
```

Kiểm schema B.1 + luật ngoài schema (ô lồi, cổng trên ranh giới, đèn ≤ ngân sách, trạm có thật, hạng A ≥ 3 tương tác).

### `bake-collision.mjs` (TASK-075)

```
node scripts/bake-collision.mjs [BLD-id…] [--region thanh] [--all] [--check] [--lo 0.4 --hi 2.0]
```

| Vào | SCHEMA-BUILDING + GLB `.lod` (hoặc bản thường nếu không có `.lod`) |
|---|---|
| Ra | `public/col/<BLD-id>.json` (SCHEMA-COLLISION-BAKE) |
| `--check` | không ghi; liệt kê công trình có `srcHash` lệch; thoát 1 nếu có |
| Hiệu năng | in số tam giác đã cắt, số ô đặc mỗi lớp, thời gian |

### `interior-fit.mjs` (TASK-083)

```
node scripts/interior-fit.mjs <BLD-id> [--kit dao-bac] [--out draft]
```

Ra `src/game/data/interiors/INT-<BLD-id>.draft.json`; không ghi đè tệp đã duyệt (không hậu tố `.draft`).

### `build-stream.mjs` (TASK-136), `build-nav.mjs` (TASK-140), `build-skyline.mjs` (TASK-142)

```
node scripts/build-stream.mjs [--check]          # → public/stream/<cx>_<cz>.json (324 tệp, chỉ ghi tệp đổi)
node scripts/build-nav.mjs [--region longho]     # → public/nav/<cx>_<cz>.json; kiểm từng cạnh bằng clearLine + va chạm nướng
node scripts/build-skyline.mjs <region> [--tris 3000]   # gộp .lod các công trình vùng → public/models/far/<region>.glb
```

`build-stream --check` thoát 1 nếu kê khai trong repo khác kết quả sinh (quên chạy lại sau khi sửa dữ liệu).

## L.4 Tài sản

### `validate-assets.mjs` (TASK-146)

```
node scripts/validate-assets.mjs [--id <asset>] [--changed-since <git-ref>]
```

Luật A1–A10 (phần 10 §5). `--changed-since` chỉ kiểm tệp đổi (nhanh cho PR).

### `credits-report.mjs` (TASK-160)

```
node scripts/credits-report.mjs [--by region|step|month] [--since 2026-11-01]
```

Đọc `assets-meshy/credits.jsonl` (+ `state.json` cho dữ liệu cũ); in tổng và số dư (gọi `meshy-gen.mjs balance` nếu có khóa; không có khóa thì bỏ qua cột số dư, thoát 0).

### `asset-sheet.mjs`

```
node scripts/asset-sheet.mjs [--region longho] [--stage preview|refine|packed] [--out assets-meshy/sheets/<tên>.jpg]
```

Ghép thumbnail bằng `sharp` (lưới 4 cột), chú thích id · tam giác · credit.

## L.5 Hiệu năng và tải

### `bench-scenes.mjs` (TASK-046)

```
node scripts/bench-scenes.mjs --url <game.html> [--scenes S1,S3] [--quality mid] [--seconds 20] [--ci] [--baseline perf/baselines/<máy>] [--out test-results/perf]
```

| `--ci` | chỉ so số tất định (lượt vẽ, tam giác, texture, chương trình, GPU MB ước) với mốc + 5% |
|---|---|
| Không `--ci` | so thêm FPS p50/p95 (−10% → cảnh báo, thoát 0; vượt ngân sách §2.1 phần 09 → thoát 1) |
| Ra | SCHEMA-PERF-REPORT cho mỗi cảnh + ảnh chụp khung cuối |

### `check-bundle.mjs` (TASK-047)

```
node scripts/check-bundle.mjs [--dist dist] [--ios dist-ios]
```

Kiểm ngưỡng phần 09 §6.2; với `--ios`: không `.hd.glb`, tổng ≤ 120 MB.

### `load-quan.mjs` (TASK-173, TASK-198)

```
node scripts/load-quan.mjs [ws://127.0.0.1:8788] [--clients 60] [--rooms 1] [--duration 120] [--proto 1|2] [--region thanh]
```

Ra: thông điệp/s vào/ra, trễ p50/p95/p99 (từ dấu thời gian trong `emo`), số lần đóng theo mã, phần trăm `mvb` trễ > 250 ms. Thoát 1 nếu vượt ngưỡng phần 08 §6.5.

### `fuzz-protocol.mjs`

```
node scripts/fuzz-protocol.mjs [--n 100000] [--seed 1]
```

Sinh chuỗi ngẫu nhiên và biến dị từ gói hợp lệ; khẳng định `parseClient` không ném, không trả `mv` ngoài biên, không trả `say`/`emo` ngoài danh sách.

## L.6 Kiểm thử trình duyệt và iOS

### `e2e-game.mjs` (TASK-057)

```
node scripts/e2e-game.mjs <url gốc> [--only E1,E4] [--headed] [--mmo ws://127.0.0.1:8788]
```

Kịch bản E1–E12 (phần 11 §5.2). `--mmo` bật E6 (hai trình duyệt). Ảnh và vết (Playwright trace) lưu `test-results/e2e/`.

### `verify-ios-game.mjs` (TASK-058)

```
node scripts/verify-ios-game.mjs [http://127.0.0.1:5174]
```

Kiểm ios-01…ios-07 (phụ lục E.2.10) trên `npm run preview:ios`; viewport 390 × 844, `userAgent` Safari iOS.

## L.7 Kiến trúc và vận hành

### `lint-pure.mjs`

```
node scripts/lint-pure.mjs [--graph test-results/deps.json]
```

Phân tích import tĩnh `src/game/**`, `worker/**`; kiểm luật L1–L5 (phụ lục C.2); `--graph` xuất đồ thị phụ thuộc. Thoát 1 khi vi phạm.

### `reports-dump.mjs` (phụ lục F.10)

```
node scripts/reports-dump.mjs --env production|staging [--since 7d]
```

Gọi route quản trị có xác thực (token quản trị trong biến môi trường, không trong repo); in báo cáo MMO theo phòng, lý do, đối tượng (tên, mã `u`), không in `pid` thô.

## L.8 Thêm vào `package.json › scripts`

| Script npm | Lệnh |
|---|---|
| `test:game` | (hiện có) + `test-game-cases`, `test-terrain`, `node --test scripts/tests/game/` |
| `test:engine-fixes` | `node --test scripts/tests/engine/` |
| `test:ai` | `node --test scripts/tests/ai/` |
| `test:world` | `node --test scripts/tests/world/` |
| `test:content` | `node scripts/validate-content.mjs && node scripts/validate-ids.mjs && node scripts/validate-assets.mjs && node scripts/validate-buildings.mjs` |
| `test:mmo:int` | `node scripts/test-quan-mmo.mjs ws://127.0.0.1:8788` |
| `test:worker` | `node --test scripts/tests/worker/` |
| `test:e2e` | `node scripts/e2e-game.mjs http://127.0.0.1:4173` |
| `verify:ios-game` | `node scripts/verify-ios-game.mjs` |
| `bench` | `node scripts/bench-scenes.mjs --url http://127.0.0.1:4173/game.html --ci` |
| `check:bundle` | `node scripts/check-bundle.mjs` |
| `load:mmo` | `node scripts/load-quan.mjs` |
| `sim` | `node scripts/sim-quests.mjs --all && node scripts/sim-economy.mjs` |
| `bake` | `node scripts/bake-collision.mjs --all` |
| `build:world` | `node scripts/build-stream.mjs && node scripts/build-nav.mjs` |

`npm run test:mmo` hiện gộp đơn vị + tích hợp (bộ tích hợp cần `dev:mmo` đang chạy). Tách thành `test:mmo` (chỉ `test-quan-protocol`) và `test:mmo:int` để CI không fail khi chưa khởi máy chủ.
