# 13.15 · Đội ngũ, công cụ, CI/CD, phát hành, giám sát, sự cố, chi phí

## 1. Đội ngũ và vai trò

### 1.1 Vai trò

| Mã | Vai | Trách nhiệm chính | Quyền quyết định |
|---|---|---|---|
| OWN | Chủ dự án | duyệt triển khai production, mua credit/gói, ký merchant, duyệt nội dung nhạy cảm cuối cùng, chính sách quyền riêng tư | mọi thứ chạm tiền, pháp lý, production |
| TD | Giám đốc kỹ thuật | kiến trúc, ADR, duyệt PR rủi ro cao (engine, lưu, máy chủ), ngân sách hiệu năng, trực sự cố cấp 1 | kỹ thuật; quay lui khẩn cấp (§6.4) |
| PRD | Sản xuất | lịch mốc, phân việc, tổ chức duyệt cố vấn, ghi chú phát hành | phạm vi trong mốc |
| CLI | Kỹ sư client | gameplay, máy nhiệm vụ, UI, lưu, tích hợp engine | thiết kế module client |
| GFX | Kỹ sư đồ họa | renderer, ô cổng, streaming địa hình, hiệu năng | ngân sách đồ họa theo bảng phần 09 |
| SRV | Kỹ sư máy chủ | Worker, Durable Object, giao thức, thanh toán, phân tích | API máy chủ |
| ENG | Kỹ sư engine | `src/engine/` (sửa lỗi, công cụ AI mới) — chung với app chính | thay đổi engine (phải tách PR) |
| AI | Kỹ sư AI | `ai.js` persona, bộ lọc, đánh giá chất lượng, đo token | cấu hình prompt |
| TA | Tech artist | đường ống Meshy/gltf-transform, nướng va chạm, kiểm tài sản, sổ credit | quy ước tài sản |
| ART | Họa sĩ 3D | vỏ công trình, mô-đun, đạo cụ, tượng | thẩm mỹ trong bảng màu khóa |
| LVL | Thiết kế màn chơi | dữ liệu vùng, công trình, nội thất, Định nghĩa Done | bố cục |
| CNT | Biên tập dữ liệu | nhập kịch bản, persona, thoại, chạy validator | chuỗi văn bản |
| QA | Kiểm thử | test tự động, chơi thử, bài tải, iOS | chặn phát hành khi có lỗi S0/S1 |
| OPS | Vận hành | CI/CD, bảng giám sát, chi phí, runbook | cấu hình CI |

Cố vấn tôn giáo/văn hóa (tài liệu 14) không thuộc biên chế kỹ thuật nhưng là **cổng duyệt** trong bảng việc (TASK-170, TASK-207, TASK-235, TASK-246, TASK-263).

### 1.2 Tải việc theo mốc (ngày công lý tưởng, từ bảng TASK)

| Mốc | TD | CLI | GFX | SRV | ENG | AI | TA | ART | LVL | CNT | QA | OPS | PRD | OWN | Cộng |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M0 | 1 | 40 | 3,5 | 0,75 | 4,5 | 13 | 3 | 0 | 4 | 8,5 | 9 | 2,5 | 0,5 | 0 | 90,25 |
| M1 | 0 | 29 | 10 | 18 | 0 | 0 | 5 | 12 | 31 | 16 | 8 | 2 | 1 | 0,5 | 132,5 |
| M2 | 0 | 32 | 11 | 2,5 | 0 | 0 | 13,5 | 36 | 22 | 19 | 8 | 4 | 3 | 0 | 151 |
| M3 | 0 | 21 | 0 | 20,5 | 0 | 3 | 0 | 27 | 29 | 17 | 5,5 | 2 | 3 | 0,5 | 128,5 |
| M4 | 0 | 23 | 0 | 0 | 0 | 0 | 0 | 22 | 24 | 29,5 | 4,5 | 0 | 2 | 3 | 108 |
| M5 | 0 | 10 | 4 | 3 | 0 | 0 | 0 | 11 | 14 | 13 | 3,5 | 0 | 1 | 3 | 62,5 |
| M6 | 0 | 11 | 0 | 30,5 | 0 | 0 | 0 | 0 | 4 | 0 | 4,5 | 4 | 4 | 1 | 59 |
| **Tổng** | 1 | 166 | 28,5 | 75,25 | 4,5 | 16 | 21,5 | 108 | 128 | 103 | 43 | 14,5 | 14,5 | 8 | **731,75** |

Cột vai là **vai chính** của task; vai hỗ trợ (ghi trong ngoặc ở từng task) không cộng. Con số chỉ gồm việc kỹ thuật và sản xuất trong tài liệu này; khối lượng viết kịch bản (tài liệu 03), thiết kế vùng chi tiết (07, 08) và thiết kế giao diện (12) tính riêng.

### 1.3 Biên chế đề xuất và độ vừa

Năng lực mỗi người = số ngày làm việc của mốc × 0,8 (họp, duyệt, hỗ trợ).

| Vai | Biên chế | M0 (10 ngày → 8/người) | M1 (20 → 16) | M2 (30 → 24) | M3 (30 → 24) | M4 (30 → 24) | M5 (20 → 16) | M6 (30 → 24) |
|---|---|---|---|---|---|---|---|---|
| CLI | 3 | 40 / 24 ⚠ | 29 / 48 | 32 / 72 | 21 / 72 | 23 / 72 | 10 / 48 | 11 / 72 |
| GFX | 1 | 3,5 / 8 | 10 / 16 | 11 / 24 | 0 / 24 | 0 / 24 | 4 / 16 | 0 / 24 |
| SRV | 1 (2 ở M6) | 0,75 / 8 | 18 / 16 ⚠ | 2,5 / 24 | 20,5 / 24 | 0 / 24 | 3 / 16 | 30,5 / 48 |
| AI + ENG | 1 | 17,5 / 8 ⚠ | 0 / 16 | 0 / 24 | 3 / 24 | 0 / 24 | 0 / 16 | 0 / 24 |
| TA | 1 | 3 / 8 | 5 / 16 | 13,5 / 24 | 0 / 24 | 0 / 24 | 0 / 16 | 0 / 24 |
| ART | 2 | 0 / 16 | 12 / 32 | 36 / 48 | 27 / 48 | 22 / 48 | 11 / 32 | 0 / 48 |
| LVL | 2 | 4 / 16 | 31 / 32 | 22 / 48 | 29 / 48 | 24 / 48 | 14 / 32 | 4 / 48 |
| CNT | 2 | 8,5 / 16 | 16 / 32 | 19 / 48 | 17 / 48 | 29,5 / 48 | 13 / 32 | 0 / 48 |
| QA | 1 | 9 / 8 ⚠ | 8 / 16 | 8 / 24 | 5,5 / 24 | 4,5 / 24 | 3,5 / 16 | 4,5 / 24 |
| OPS | 0,5 | 2,5 / 4 | 2 / 8 | 4 / 12 | 2 / 12 | 0 / 12 | 0 / 8 | 4 / 12 |
| TD, PRD | 1 + 1 | — | — | — | — | — | — | — |

**Kết luận về lịch:**

1. **M0 quá tải** ở CLI (40 ngày công / 24 năng lực), AI + ENG (17,5 / 8), QA (9 / 8). Mốc 2 tuần của bản sơ đồ tổng §13.4 không đủ với phạm vi «Mệnh Bàn + màn Mệnh Bàn + persona AI + 2 NPC + mở đầu mới + sửa engine». Hai phương án:
   - (a) **kéo M0 thành 3 tuần** (CLI 36 năng lực, AI + ENG 12 — vẫn thiếu, cần thêm 1 người AI hoặc chuyển TASK-041, TASK-070 sang tuần đầu M1);
   - (b) giữ 2 tuần, chuyển TASK-031, TASK-065, TASK-066, TASK-068 (CLI, 4,5 ngày), TASK-041, TASK-070 (AI, 2,5 ngày) sang đầu M1 và thuê thêm 1 CLI hợp đồng cho M0.
   Khuyến nghị (a) — câu hỏi mở Q1 cho chủ dự án.
2. **M1:** SRV quá tải nhẹ (18 / 16) → CLI nhận phần client của TASK-099, TASK-100 (đã ghi «CLI phần client»).
3. **M2–M5:** CLI, GFX dư năng lực → dùng cho đánh bóng (polish), sửa lỗi chơi thử, tối ưu (TASK-261 kéo sớm). Ngược lại, ART và LVL ước lượng ở đây là **cận dưới** (chỉ phần kỹ thuật của dựng vùng); tài liệu 07/08 có thể đẩy cao hơn — nếu vượt, thuê họa sĩ hợp đồng theo vùng.
4. **M6:** cần SRV thứ hai (thanh toán + môn phái cùng lúc).

## 2. Công cụ

| Nhóm | Công cụ | Phiên bản / ghi chú |
|---|---|---|
| Runtime | Node | CI dùng 20 (`actions/setup-node`); máy phát triển hiện chạy 24 → thống nhất `engines.node: ">=20 <25"` trong `package.json`, CI thêm ma trận 20 và 24 |
| Build | Vite 7, Rollup chunk thủ công (`vite.config.js`) | |
| 3D | three 0.170 (r170), `GLTFLoader`, `MeshoptDecoder`, `SkeletonUtils`, `EffectComposer` | thêm `KTX2Loader` ở M2 |
| Máy chủ | wrangler 4.118, Workers, Durable Objects (SQLite), KV, Analytics Engine, R2 | `npm run dev:mmo` cho Windows |
| Di động | Capacitor 8 (iOS), Xcode | app id `shop.god8.lvdang` |
| Tài sản | Meshy API (`meshy-*.mjs`), `@gltf-transform/cli` 4.5, `meshoptimizer`, `sharp`, Blender LTS | |
| Kiểm thử | `node:test`, Playwright 1.61, Spector.js, Safari Web Inspector, Instruments | |
| Lá số | `lunar-javascript` 1.7, `astronomy-engine` 2.1 | dùng chung engine app |
| Quản lý | GitHub (issue theo `TASK-xxx`, PR, Actions, Environments) | |

## 3. CI/CD

### 3.1 Luồng

```
nhánh feat/TASK-xxx-… ──PR──▶ CI (phần 11 §14) ──xanh + duyệt──▶ main
main ──tự động──▶ build ──▶ triển khai STAGING (Worker battu-staging, DO/KV/AE riêng)
staging ──OWN duyệt trong GitHub Environment «production»──▶ wrangler deploy (production)
tag ios-v* ──▶ workflow ios-build.yml (build không ký) ──▶ ký + nộp thủ công (OWN)
```

- **Không có đường nào tự triển khai production** (TASK-014 sửa `cloudflare.yml` hiện tự triển khai mỗi push `main` nếu có secret).
- Thay đổi `wrangler.jsonc` (binding, migration DO) và secret: PR riêng, nhãn `infra`, TD duyệt kỹ thuật, OWN duyệt khi triển khai.
- Migration Durable Object (`hq-v2`…) không đảo ngược được: chạy trên staging ≥ 3 ngày trước production.
- GitHub Pages (`pages.yml`) giữ cho app chính; game không phụ thuộc Pages.

### 3.2 Nhánh và commit

| Loại | Mẫu nhánh | Ghi chú |
|---|---|---|
| Tính năng | `feat/TASK-xxx-<slug>` | sống ≤ 3 ngày; squash merge |
| Sửa engine | `engine/TASK-xxx-<slug>` | PR riêng, không trộn code game (phần 02 §10.4) |
| Nội dung | `content/<mã>` (vd `content/MQ-1-03`) | CNT tạo; CI chạy validator |
| Hạ tầng | `infra/<slug>` | nhãn `infra` |
| Ổn định mốc | `release/m<N>` | cắt khi bắt đầu tuần cuối mốc; chỉ nhận sửa lỗi |
| Sửa nóng | `hotfix/<slug>` | từ tag production gần nhất, gộp ngược vào `main` |

Thông điệp commit theo kiểu đang dùng trong repo (`feat(game): …`, `fix(engine): …`), thêm mã task: `feat(game): TASK-026 lõi dispatch máy nhiệm vụ`.

### 3.3 Phiên bản

| Thành phần | Định dạng | Nơi |
|---|---|---|
| App | `package.json › version` (hiện 3.1.0) | |
| Game | `+hq.<số build>` nối vào phiên bản app (`3.1.0+hq.42`) | sự kiện phân tích `av` |
| Nội dung | `q:<năm>.<tháng>.<số>` | băm dữ liệu lúc build (`contentV`) |
| Engine cho game | `ENGINE_V` (phần 02) | Mệnh Bàn |
| Giao thức MMO | `protocol.VERSION` | bắt tải lại khi lệch (phần 08 §6.1) |
| Lưu | `SCHEMA-SAVE.v` (2) | di trú |

## 4. Quy trình phát hành mốc

| Bước | Ai | Kiểm |
|---|---|---|
| 1. Cắt `release/m<N>` | PRD | mọi TASK mốc đóng hoặc được dời có ghi lý do |
| 2. Chạy bộ «Mốc» (phần 11 §14) | QA | `load:mmo`, bench phòng thí nghiệm, `verify:ios*`, chơi thử |
| 3. Duyệt cố vấn (nếu mốc có nội dung tôn giáo/nhạy cảm) | PRD, OWN | biên bản |
| 4. Ghi chú phát hành + nhật ký engine | PRD | |
| 5. Triển khai staging, chơi thử 48 giờ | QA | không lỗi S0/S1 mới |
| 6. OWN duyệt production | OWN | |
| 7. Theo dõi 72 giờ sau phát hành | OPS, TD | bảng §5 |
| 8. Gộp `release/m<N>` về `main`, gắn tag `game-m<N>` | PRD | |

Bản iOS: sau bước 6, chạy `npm run build:ios && verify:ios && verify:ios-path && verify:ios-game`, `cap:ios`, ký trong Xcode, OWN nộp.

## 5. Giám sát

| Tín hiệu | Nguồn | Ngưỡng báo động |
|---|---|---|
| Lỗi Worker, độ trễ, CPU | Workers observability (đã bật trong `wrangler.jsonc`), `wrangler tail` | tỉ lệ lỗi 5xx > 1% trong 5 phút |
| DO `TownShard` | số phòng hoạt động, đóng 4002/4003 bất thường | 4002 > 50/giờ (spam hoặc lỗi client) |
| `PlayerVault`, `ThienBang`, `SectHall` | độ trễ RPC, lỗi | p95 > 300 ms |
| AI | tỉ lệ `fallback`, `quota_bypass`, `bailed`, TTFT (sự kiện `ai_turn`) | fallback > 20% trong 15 phút |
| Client | sự kiện `err` theo `code`, `perf` p95 khung | `err` mới vượt 0,5% phiên |
| Thanh toán | webhook lỗi chữ ký, cấp trùng | bất kỳ |
| Chi phí | Cloudflare usage, token AI/ngày, credit Meshy | vượt 120% dự toán tháng |
| Kiểm tra sống | dịch vụ ngoài gọi `GET /api/hq/health` (mới, trả phiên bản + trạng thái DO) mỗi 1 phút | 3 lần lỗi liên tiếp |

Kênh báo: dùng lại cơ chế Telegram của `admin.js` (`notifyTelegram`) với kênh riêng cho game; không gửi dữ liệu cá nhân trong tin báo.

## 6. Ứng phó sự cố

### 6.1 Mức độ

| Mức | Ví dụ | Phản hồi |
|---|---|---|
| P1 | lộ dữ liệu cá nhân, cấp quyền lợi sai hàng loạt, game không vào được trên mọi nền tảng, nội dung vi phạm T6 xuất hiện | TD trong 30 phút; OWN được báo ngay |
| P2 | MMO sập (chơi đơn vẫn được), AI sập, một vùng kẹt | TD/SRV trong 2 giờ làm việc |
| P3 | lỗi phụ, hiệu năng tụt một hạng | lịch thường |

### 6.2 Runbook

| Sự cố | Bước |
|---|---|
| **AI backend lỗi / đắt bất thường** | (1) Bảng quản trị app: tắt AI (`isAiEnabled`) — game tự chuyển thoại kịch bản (phần 05 §9); (2) kiểm `ai:config.freePool`; (3) bật lại từng phần |
| **MMO quá tải hoặc lỗi** | (1) cấu hình từ xa `mmo: false` → client ở chế độ chơi đơn; (2) giảm `ROOM_CAP` qua cấu hình (cần triển khai nếu là hằng số — chuyển thành giá trị cấu hình ở M3); (3) xem `wrangler tail` |
| **Nội dung sai lọt production** (nhiệm vụ kẹt, câu thoại vi phạm) | (1) cấu hình từ xa tắt nhiệm vụ/persona theo id (không cần triển khai); (2) sửa trên `hotfix/`, OWN duyệt triển khai |
| **Lộ khóa** (`HQ_TOKEN_KEY`, `HQ_RECEIPT_KEY`, khóa thanh toán, khóa AI) | (1) xoay secret (`wrangler secret put`), tăng `kv`; (2) với token: chấp nhận khóa cũ 0 ngày → người chơi refresh qua `/auth/device` lại; (3) rà nhật ký kiểm toán; (4) báo OWN, đánh giá nghĩa vụ thông báo |
| **Cấp quyền lợi trùng / sai** | (1) tạm dừng webhook (trả 503 để nhà cung cấp thử lại sau); (2) đối soát `ent` với nhà cung cấp; (3) sửa, phát lại |
| **Lưu đám mây hỏng** | `PlayerVault.save` giữ 5 bản; khôi phục bản trước theo yêu cầu người chơi; client còn bản cục bộ và `huyenquan:v1` |
| **Triển khai làm hỏng production** | §6.4 |

### 6.3 SCHEMA-REMOTE-CONFIG

`GET /api/hq/config` (TASK-097), đọc từ KV `hq:config`, đệm 60 s ở Worker và 2 phút ở client:

```jsonc
{
  "v": 7,
  "minClient": "3.1.0+hq.40",              // client cũ hơn → yêu cầu tải lại
  "features": { "mmo": true, "ai": true, "cloudSave": true, "tb": true, "sect": false, "pay": false },
  "quests": { "off": ["SQ-longho-03"] },   // ẩn khỏi available(), nhiệm vụ đang làm hiện «tạm đóng»
  "personas": { "off": ["PERSONA-lama_dakiet"] },
  "aiQuota": { "free": 10, "vip": 30 },
  "notice": { "key": "t:notice.maintenance", "until": 1762390800000 }
}
```

Cấu hình từ xa **chỉ tắt/giảm**, không bật tính năng chưa phát hành và không thay nội dung (tránh trở thành kênh triển khai ngoài quy trình duyệt).

### 6.4 Quay lui triển khai

- `wrangler rollback` về phiên bản Worker trước được phép cho **TD** khi sự cố P1/P2 do bản mới gây ra, báo OWN ngay sau đó (ngoại lệ duy nhất của luật «triển khai cần OWN duyệt», vì quay lui đưa hệ thống về trạng thái đã được duyệt).
- Migration DO không quay lui được → bản quay lui phải tương thích ngược với dữ liệu mới (luật thiết kế: migration chỉ thêm bảng/cột).

### 6.5 Sau sự cố

Biên bản trong 3 ngày: dòng thời gian, nguyên nhân gốc, tác động (số người chơi), việc phòng ngừa (thành TASK mới), cập nhật runbook.

## 7. Mô hình chi phí

> Đơn giá dưới đây là **tham khảo theo bảng giá công khai đã biết (đến 2025)**; Cloudflare, nhà cung cấp mô hình và Meshy có thể đã đổi giá. OPS kiểm lại trước khi chốt ngân sách (câu hỏi mở Q12).

### 7.1 AI (token)

Tham số:

| Ký hiệu | Ý nghĩa | Giá trị dùng để tính |
|---|---|---|
| `U` | người chơi hoạt động/ngày (DAU) | 1.000 (nhân tuyến tính) |
| `t` | lượt AI trung bình/DAU/ngày (trần 10) | 4 |
| `mix` | tỉ lệ chế độ brief `rag` / `lite` / `none` | 30% / 40% / 30% (mục tiêu ≥ 70% lite + none, phần 05 §10) |
| `in` | token vào/lượt theo chế độ | 16.000 / 5.000 / 1.300 (phần 05 §10.1, chờ TASK-041 đo thật) |
| `out` | token ra/lượt (gồm token «thinking» của GLM) | 1.000 |
| `h` | tỉ lệ trúng bộ đệm | 10% |
| `P_in`, `P_out` | USD/triệu token | theo hợp đồng |

Token vào bình quân/lượt = 0,3 × 16.000 + 0,4 × 5.000 + 0,3 × 1.300 = **7.190**.
Mỗi tháng (30 ngày) với `U = 1.000`: lượt = 1.000 × 4 × 30 × (1 − 0,1) = 108.000 → token vào ≈ **776 triệu**, token ra ≈ **108 triệu**.

| Kịch bản đơn giá (giả định minh họa) | `P_in` | `P_out` | Chi phí/tháng cho 1.000 DAU |
|---|---|---|---|
| Rẻ | 0,2 | 1 | ≈ 155 + 108 = **≈ 263 USD** |
| Vừa | 0,6 | 2 | ≈ 466 + 216 = **≈ 682 USD** |
| Đắt | 1,0 | 4 | ≈ 776 + 432 = **≈ 1.208 USD** |

Nhận xét:
- So với dùng `full` cho mọi lượt (≈ 33.000 token vào), chế độ trộn trên rẻ hơn ≈ 4,6 lần.
- Backend hiện tại ưu tiên «z.ai Coding Plan» (gói thuê bao, `worker/index.js › freeRoute`). Chi phí biên có thể bằng 0 tới khi chạm hạn mức gói, **nhưng** phải xác nhận điều khoản gói cho phép phục vụ người dùng cuối của một ứng dụng (rủi ro pháp lý/khóa tài khoản — câu hỏi mở Q13). Ngân sách nên dựa trên giá API thường.

### 7.2 Cloudflare

| Hạng mục | Cách tính (1.000 DAU) | Ước lượng/tháng |
|---|---|---|
| Workers Paid (gói nền) | cố định | 5 USD |
| Yêu cầu Worker (`/api/hq/*`, proxy AI) | ~60 yêu cầu/DAU/ngày → 1,8 triệu/tháng (trong 10 triệu kèm gói) | 0 |
| DO — thông điệp WebSocket vào | `mv` ~4/s khi di chuyển × 20 phút × 1,5 phiên ≈ 7.200/DAU/ngày → 216 triệu/tháng; tính phí theo tỉ lệ 20 thông điệp = 1 yêu cầu → 10,8 triệu yêu cầu; trừ 1 triệu kèm gói, ≈ 0,15 USD/triệu | ≈ 1,5 USD |
| DO — thời lượng | phòng có người không ngủ được (nhịp 8 Hz); giả định 10 phòng thức 12 giờ/ngày × 128 MB → 10 × 43.200 s × 0,125 GB × 30 ≈ 1,6 triệu GB-s/tháng; trừ 400.000 kèm gói, ≈ 12,5 USD/triệu GB-s | ≈ 15 USD |
| DO — `PlayerVault`, `ThienBang`, `SectHall` | yêu cầu nhỏ, ngủ phần lớn thời gian | < 5 USD |
| Lưu trữ SQLite DO | ~300 KB/tài khoản → 0,3 GB | < 1 USD |
| KV | giới hạn tốc độ của app chính (ghi mỗi yêu cầu trang) — game miễn (TASK-015); cấu hình từ xa đọc có đệm | < 2 USD |
| Analytics Engine | ~50 sự kiện/DAU/ngày → 1,5 triệu điểm/tháng (trong mức kèm gói, theo bảng giá đã biết) | 0 |
| R2 (sau TASK-133) | 2–3 GB tài sản × ~0,015 USD/GB; đọc qua cache CDN; phí ra 0 | < 2 USD |
| **Cộng (1.000 DAU)** | | **≈ 32 USD** |

Phần lớn chi phí Cloudflare đến từ **thời lượng DO khi phòng MMO thức**; gói gộp AOI (phần 08 §6) giảm số thông điệp chứ không giảm thời lượng. Nếu cần giảm: hạ nhịp gộp xuống 5 Hz khi phòng < 10 người.

### 7.3 Meshy (credit)

| Hạng mục | Credit | Nguồn |
|---|---|---|
| Đã dùng (preview + refine, 31 tài sản) | 885 (+ ≈ 88 rig/động tác không ghi) | `state.json`, phần 10 §9.2 |
| Mỗi thánh địa (mục tiêu sau tối ưu) | ≤ 450 | phần 10 §9.3 |
| 10 thánh địa + Sơn Môn bổ sung + dự phòng 20% | ≈ 5.400 | |
| Số dư hiện tại | 7 | bản sơ đồ tổng §13.3 |

Giá tiền của gói credit do OWN tra khi mua (TASK-124, TASK-212).

### 7.4 Phí nền tảng và thanh toán (tham khảo)

| Mục | Ghi chú |
|---|---|
| Apple Developer Program | phí năm; hoa hồng App Store theo chương trình áp dụng cho tài khoản (15% hoặc 30%) |
| Stripe | phí giao dịch theo quốc gia, thẻ |
| VNPay | theo hợp đồng merchant |
| Tên miền con cho R2 | không phát sinh nếu dùng miền hiện có |

### 7.5 Tổng hợp theo quy mô (kịch bản đơn giá AI «vừa»)

| DAU | AI | Cloudflare | Cộng/tháng |
|---|---|---|---|
| 1.000 | ≈ 682 USD | ≈ 32 USD | ≈ 714 USD |
| 10.000 | ≈ 6.820 USD | ≈ 250 USD (DO thời lượng tăng theo số phòng) | ≈ 7.070 USD |
| 50.000 | ≈ 34.100 USD | ≈ 1.100 USD | ≈ 35.200 USD |

AI chiếm > 90% chi phí vận hành. Đòn bẩy theo thứ tự: (1) tỉ lệ `lite`/`none`; (2) bộ đệm câu mở đầu; (3) hạn mức lượt; (4) đàm phán giá theo khối; (5) thoại kịch bản tốt để người chơi ít cần hỏi tự do. Doanh thu cần thiết để hòa vốn và chính sách giá thuộc tài liệu 11.

## 8. Lộ trình tổng (theo bảng việc)

| Mốc | Tuần (đề xuất) | Ngày công | Nội dung chính | Cổng duyệt |
|---|---|---|---|---|
| M0 | 3 (thay vì 2, xem §1.3) | 90,25 | Mệnh Bàn, sửa engine, persona, mở đầu | OWN duyệt triển khai |
| M1 | 4 | 132,5 | máy nhiệm vụ đầy đủ, Sổ Công Quá, Mệnh Đồ, nội thất Sơn Môn, tài khoản, AI máy chủ | |
| M2 | 6 | 151 | thế giới 4,6 km, streaming, 3 thánh địa, Hồi II (phần đầu) | cố vấn 3 truyền thống |
| M3 | 6 | 128,5 | 4 thánh địa, cảnh giới, MMO v2, Thiên Bảng, Định Mệnh Hội | cố vấn 4 truyền thống |
| M4 | 6 | 108 | Hồi III–IV, Tà Lộ, Phong Đô, Miêu Cương | duyệt nội dung nhạy cảm |
| M5 | 4 | 62,5 | Tạng Địa (có điều kiện), Côn Lôn, Vĩ thanh | tham vấn Tạng truyền |
| M6 | 6 | 59 | môn phái, sư đồ, mùa, thanh toán | merchant, chính sách quyền riêng tư, App Store |
| **Cộng** | **35 tuần** | **731,75** | | |

### 8.1 Đường găng

```
TASK-001→002/005→006→033→013 (engine đúng trước khi đóng số Mệnh Bàn)
TASK-007…011→021→055 (Mệnh Bàn → màn → cổng mới)
TASK-018→026→027/028→054→055 (lưu v2 → máy nhiệm vụ → mở đầu)
TASK-072/073/074→075→076→101…112 (va chạm → nướng → nội thất Sơn Môn)   ← găng của M1
TASK-126→128→136→132→156…158 (địa hình → streaming → dựng 3 vùng)          ← găng của M2
TASK-124 (OWN mua credit) → TASK-148/149/153 (vỏ Meshy)                      ← phụ thuộc ngoài kỹ thuật
TASK-193→194/196→197→198 (biên nhận → Thiên Bảng/chấm án → MMO v2 → bài tải) ← găng của M3
TASK-246 (tham vấn Tạng) → 247…250                                          ← có thể dời, không chặn M5
OWN merchant → TASK-268…272                                                   ← có thể tách khỏi M6
```

Phụ thuộc ngoài đội kỹ thuật (mua credit, cố vấn, merchant, Apple) được đặt sớm nhất có thể trong mỗi mốc; trễ quá 1 tuần thì PRD dời TASK phụ thuộc sang mốc sau, không kéo dài mốc.

## 9. Danh sách kiểm phát hành (bản in cho PRD)

| # | Mục | Ai | Đạt khi |
|---|---|---|---|
| 1 | `npm test`, `npm run accuracy` | QA | không giảm so bản trước |
| 2 | `test:game`, `test:ai`, `test:world`, `test:content`, `test:worker`, `test:mmo:int` | QA | xanh |
| 3 | `validate-ids` | CNT | 0 lỗi; cảnh báo `NO_DATA_AT_MILESTONE` = 0 cho mốc hiện tại |
| 4 | `validate-assets`, `validate-buildings`, `bake-collision --check` | TA | xanh |
| 5 | `check-bundle` | OPS | trong ngưỡng |
| 6 | `bench-scenes` (CI + phòng thí nghiệm) | GFX | trong mốc + 5%; FPS đạt §2.1 phần 09 |
| 7 | `e2e-game`, `verify-ios-game`, `verify:ios`, `verify:ios-path` | QA | xanh |
| 8 | `sim-quests` 7 đêm liền | QA | xanh |
| 9 | Biên bản cố vấn (nếu có nội dung tôn giáo mới) | PRD | đã ký |
| 10 | Ghi chú phát hành + nhật ký engine (nếu `ENGINE_V` đổi) | PRD | có |
| 11 | Migration DO (nếu có) đã chạy staging ≥ 3 ngày | SRV | có nhật ký |
| 12 | Secret mới đã đặt ở production | OPS | `wrangler secret list` khớp danh sách |
| 13 | Cấu hình từ xa production: tính năng mới ở trạng thái mong muốn | OPS | đối chiếu |
| 14 | Kế hoạch quay lui (phiên bản Worker trước, tương thích dữ liệu) | TD | ghi trong ghi chú |
| 15 | OWN duyệt trong GitHub Environment | OWN | đã duyệt |

## 10. Trực vận hành

- Đội nhỏ: trực theo tuần luân phiên TD ↔ SRV (giờ hành chính) + cảnh báo P1 ngoài giờ qua Telegram cho cả hai.
- 72 giờ sau mỗi bản phát hành: OPS xem bảng giám sát hai lần/ngày.
- Mỗi tháng: OPS gửi báo cáo chi phí (AI, Cloudflare, Meshy) so dự toán §7 và đề xuất đòn bẩy nếu vượt.

## 11. Nhập môn cho kỹ sư mới (một ngày)

| Giờ | Việc | Kết quả |
|---|---|---|
| 1 | Đọc canon (`docs/gdd/00-KINH-DIEN-CHUNG.md`), phần 01 của tập này | nắm module, tọa độ, luật hydrate |
| 2 | `npm ci`, `npm run dev`, mở `game.html?debug=1&perf=1` | thấy HUD hiệu năng, `__hq` |
| 3 | `npm run test:game`, `npm test` | biết thời gian chạy |
| 4 | `npm run build`, `npm run dev:mmo` (Windows: script tự tạo junction ASCII), `test:mmo:int` | MMO cục bộ chạy |
| 5 | Sửa một ca test nhỏ trong `scripts/tests/`, mở PR nháp | quen quy trình CI |
| 6 | Đọc phần tương ứng vai (CLI: 02–03, 06; SRV: 04, 08; GFX: 06, 07, 09; TA: 10) | — |

## 12. Rủi ro kỹ thuật cần theo dõi (chuyển tài liệu 14 cấp mã `RISK-xx`)

| Rủi ro | Dấu hiệu sớm | Giảm thiểu trong tập này |
|---|---|---|
| Ô cổng + va chạm nhiều lớp phức tạp hơn dự kiến | TASK-077, TASK-072 vượt 50% ước lượng | giữ phòng túi làm phương án lùi cho điện khó (phần 06 §1) |
| Streaming trên iOS bị hệ điều hành đóng WebContent | `webglcontextlost`, mất phiên trên iPhone mid | ngân sách mid chặt, KTX2, dỡ LRU (phần 07 §5) |
| Chi phí AI vượt dự toán | sự kiện `ai_turn` cho thấy tỉ lệ `rag/full` > 40% | ép `lite/none`, hạ hạn mức qua cấu hình từ xa (phần 15 §7.1) |
| Điều khoản gói AI không cho phục vụ người dùng cuối | câu trả lời của nhà cung cấp (Q13) | chuyển sang API trả theo token; ngân sách đã tính theo giá API |
| Credit Meshy/chất lượng mô hình không đủ cho vỏ có lòng trong | tỉ lệ tạo lại > 30% | thư viện CC0 + chỉnh tay; dùng chung bộ mô-đun giữa vùng |
| Engine đổi số làm lệch nội dung đã viết | `gen-mau-charts --check` đỏ | `ENGINE_V`, thông báo khác biệt, nội dung dựa vào điều kiện chứ không vào số cố định |
| Apple từ chối bản có game mở rộng (4.3(b)) | phản hồi duyệt | ma trận nền tảng phụ lục E.3; `verify-ios-game` |
