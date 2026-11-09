# 13.11 · Chiến lược kiểm thử

## 1. Nguyên tắc

1. **Thuần logic thì test bằng Node, không cần trình duyệt.** Đây là lý do mọi module mới (Mệnh Bàn, máy nhiệm vụ, Sổ Công Quá, persona assembly, kế hoạch streaming, va chạm nướng) phải thuần (phần 01 §16).
2. **Đáp án do engine tính, test không viết tay đáp án** — giống `test-game-halls`, `test-game-dz`, `test-game-zheri` hiện có (đáp án lấy từ engine, test chỉ kiểm game dùng đúng engine và đáp án có trong lựa chọn).
3. **Số tất định chặn CI; số phụ thuộc máy chỉ cảnh báo** (phần 09 §6).
4. **Dữ liệu nội dung được kiểm như code** (validator chạy trong CI, phần 03 §13, phần 04 §2, phần 06 §11, phần 10 §5).
5. **Không có test nào gọi mạng thật** (AI, Meshy, thanh toán) trong CI; dùng fetch giả hoặc khóa thử của nhà cung cấp.

## 2. Hiện trạng và mục tiêu

| Bộ test | Loại | Hiện có? | Lệnh (đích) | Chạy ở |
|---|---|---|---|---|
| `selftest.mjs` (10.248 dòng) | engine app | có | `npm test` | CI mọi PR |
| `classical-accuracy.mjs` | độ chính xác cổ pháp | có | `npm run accuracy` | CI hằng đêm |
| `test-game-state/-zheri/-dz/-halls/-progress/-vanmenh/-cosmetics` | đơn vị game | có | `npm run test:game` | CI mọi PR |
| `test-game-cases`, `test-terrain` | đơn vị game | có, **chưa gắn** | thêm vào `test:game` (TASK-012) | CI mọi PR |
| `test-quan-protocol` | đơn vị MMO | có | `npm run test:mmo` (phần đơn vị) | CI |
| `test-quan-mmo` | tích hợp MMO (WebSocket thật) | có, cần `dev:mmo` | `npm run test:mmo:int` | CI (job có `wrangler dev`) |
| `smoke-browser.mjs` | Playwright trang chính | có | `npm run smoke` | sau triển khai |
| `verify-ios-build`, `verify-ios-review-path` | tạo tác iOS | có | `npm run verify:ios`, `verify:ios-path` | trước khi gửi duyệt |
| `test-engine-fixes`, `lint-tengod` | engine (D1–D3) | **mới** | `npm run test:engine-fixes` | CI |
| `test-menhban`, `test-realm`, `test-save-v2` | đơn vị | **mới** | `test:game` | CI |
| `test-quest-*`, `test-dialogue-md`, `sim-quests` | đơn vị + mô phỏng | **mới** | `test:game`, `sim` (đêm) | CI |
| `test-ledger*`, `test-deeds-table` | đơn vị | **mới** | `test:game` | CI |
| `test-ai-compat`, `test-persona-*`, `test-postfilter`, `test-crisis` | đơn vị (fetch giả) | **mới** | `test:ai` | CI |
| `test-cells`, `test-obstacles-layers`, `test-astar-layers`, `test-bake`, `test-building-dod` | đơn vị + dữ liệu | **mới** | `test:world` | CI |
| `test-stream-plan`, `test-nav`, `test-colgrid` | đơn vị | **mới** | `test:world` | CI |
| `test-hq-*`, `test-pay-*`, `test-quan-v2`, `test-sect`, `test-ev`, `test-quota`, `test-receipt`, `test-thienbang` | Worker tích hợp | **mới** | `test:worker` | CI (job `wrangler dev`) |
| `load-quan.mjs` | tải MMO | **mới** | `npm run load:mmo` | thủ công trước mốc |
| `validate-content`, `validate-ids`, `validate-assets`, `validate-buildings` | dữ liệu | **mới** | `test:content` | CI mọi PR |
| `bench-scenes`, `check-bundle` | hiệu năng | **mới** | `bench`, `check:bundle` | CI (tất định) + phòng thí nghiệm |
| `e2e-game.mjs` | Playwright game | **mới** | `test:e2e` | CI (Chrome headless) |
| `verify-ios-game.mjs` | Playwright bản iOS (game trong overlay) | **mới** | `verify:ios-game` | trước khi gửi duyệt |
| `fuzz-protocol.mjs` | fuzz | **mới** | `fuzz` | CI hằng đêm |

### 2.1 Quy ước viết test mới

- Test cũ dùng hàm `test(name, fn)` tự viết + `node:assert`. Test mới dùng **`node:test`** có sẵn trong Node 20 (không thêm phụ thuộc): `import { test } from 'node:test'; import assert from 'node:assert/strict';`, chạy `node --test scripts/tests/`.
- Thư mục mới `scripts/tests/` cho test mới; test cũ giữ chỗ cũ (không di chuyển để không phá lịch sử), `package.json` gom cả hai.
- Đồng hồ: mọi module thời gian nhận `clock`/`now` tiêm vào; test dùng ngày cố định (vd `new Date(2026, 1, 3, 23, 30)` để kiểm giờ Tý, trước/sau Lập Xuân).
- Ngẫu nhiên: `npc.js › rng(seed)` hoặc `textures.js › rng`, không dùng `Math.random` trong logic được test.

## 3. Đơn vị (Node)

Các bộ đơn vị và ca chính đã liệt kê ở cuối từng phần (02 §12, 03 §16, 04 §11, 05 §12, 06 §13, 07 §10, 08 §11, 09 §10, 10 §12). Ở đây là quy tắc chung:

| Quy tắc | Chi tiết |
|---|---|
| Phủ nhánh lỗi | mỗi engine phụ có ca «ném lỗi» (tiêm phụ thuộc) |
| Ca biên số | ngưỡng Phẩm căn (27/28 … 85/86), mốc công đức (299/300), ngưỡng cảnh giới, AOI 120/140 m |
| Thuộc tính (property) | gộp lưu (giao hoán, lũy đẳng), hợp nhất sổ (mọi hoán vị), `realmOf` đơn điệu — dùng vòng lặp sinh dữ liệu có hạt giống (200–500 mẫu), không thêm thư viện |
| Ảnh chụp kỳ vọng | `messages` của persona (phần 05), JSON thoại sinh từ Markdown (phần 03 §9.2) — lưu `scripts/tests/__snap__/`; đổi ảnh chụp phải có lý do trong PR |
| Lá số mẫu | luôn dùng `src/game/data/mau-charts.json` (phần 02 §11), không chép tay số |

## 4. Tích hợp MMO và Worker

### 4.1 Cục bộ

```
npm run build            # wrangler dev phục vụ dist/ (assets) — cần một lần
npm run dev:mmo          # cổng 8788; trên Windows tự tạo junction ASCII (đường dẫn «app bói toán»)
npm run test:mmo:int     # = node scripts/test-quan-mmo.mjs ws://127.0.0.1:8788
npm run test:worker      # các bộ test-hq-*, test-pay-*… gọi http://127.0.0.1:8788
```

- Mỗi lần chạy dùng dải phòng/tài khoản riêng (như `test-quan-mmo` đang làm) để không đụng dữ liệu lần trước trong SQLite cục bộ của `wrangler dev`.
- Secret thử: `.dev.vars` (git bỏ qua) với `HQ_TOKEN_KEY=test…`, khóa thử Stripe, chứng chỉ thử Apple, secret thử VNPay.

### 4.2 CI

- Runner Linux, đường dẫn ASCII → chạy `wrangler dev` trực tiếp hoặc qua `dev:mmo` (script vẫn đúng khi đường dẫn không dấu).
- Job: `npm ci` → `npm run build` → khởi `dev:mmo` nền → đợi cổng 8788 → `test:mmo:int` + `test:worker` → tắt.
- Thời gian mục tiêu ≤ 6 phút.

## 5. Tự động hóa trình duyệt (Playwright)

### 5.1 Bề mặt điều khiển

`window.__hq` (đã có) mở rộng ở chế độ `?debug=1`:

```js
window.__hq = {
  state, player, stick, altCtl, net, openStation, walkTo, STATIONS, blockedAt, findPath, renderer,   // đã có
  quests,                // runtime máy nhiệm vụ (phần 03 §10.1) — journal(), debug.force()
  mb,                    // Mệnh Bàn hiện tại
  cells,                 // hệ ô cổng (phần 06)
  streamer,              // phần 07
  clock: { set(d), unset() },   // giả lập giờ cho cửa đóng/mở, lễ tiết, giờ can chi
  bench(scene)           // phần 09 §5.3
};
```

### 5.2 Kịch bản E2E (`scripts/e2e-game.mjs`)

| Mã | Kịch bản | Khẳng định |
|---|---|---|
| E1 | Mở `game.html`, nhập `MAU-A`, xem lễ lật trụ, mặc phẩm phục | `state.player.yong.primary === '水'`; HUD hiện tên; không lỗi console |
| E2 | Đi tới Bàn Thầy bằng `walkTo` | tới nơi ≤ 30 s; `nearestStation().id === 'thay'` |
| E3 | Mở từng gian trong `STATIONS` (trừ cửa) | mỗi bảng mở và đóng không lỗi; `stationsVisited` tăng |
| E4 | Mở đầu `MQ-P-*` bằng chọn phương án đầu tiên hợp lệ | nhiệm vụ đi tới `end` hoặc nút chờ người thật; không `stuck` |
| E5 | Vào/ra Chính Đường qua cửa (sau khi có ô cổng) | `cells.update().playerCell` đổi; mái ẩn; ra lại mái hiện |
| E6 | Hai trình duyệt cùng phòng MMO (`dev:mmo`) | thấy nhau; cử chỉ hiện bong bóng; AOI: một người đi xa 200 m thì người kia nhận `leave` |
| E7 | Chặn mạng (`context.setOffline(true)`) | game chơi đơn; HUD «Ngoại tuyến»; bật lại thì tự kết nối |
| E8 | `?2d` | renderer 2D chạy, không lỗi |
| E9 | `prefers-reduced-motion` | hạt, khói, mây không chuyển động (`reduced`) |
| E10 | Lưu v1 cũ đặt sẵn vào `localStorage` rồi mở | di trú v2; v1 còn nguyên; tiến trình hiện đủ |
| E11 | Hết lượt AI (máy chủ giả trả 429) | NPC dùng thoại kịch bản; không hiện lỗi đỏ |
| E12 | Nhập câu khủng hoảng mẫu | thẻ hỗ trợ hiện; không có yêu cầu mạng tới `/api/hq/ai/chat` |

- Không so ảnh chụp cảnh 3D trong CI (kết xuất phụ thuộc GPU/driver). Chỉ so ảnh **bảng DOM** (Sổ Mệnh, Mệnh Bàn) với dung sai 0,2% điểm ảnh.
- Ảnh chụp chuẩn công trình (Định nghĩa Done, phần 06 §11) chụp ở máy phòng thí nghiệm, duyệt bằng mắt.

## 6. Kiểm bản iOS

Hiện có hai script cho app chính. Thêm `scripts/verify-ios-game.mjs` (Playwright với `npm run preview:ios`, cổng 5174, cửa sổ 390 × 844):

| Kiểm | Cách |
|---|---|
| Game mở được trong lớp phủ từ tab «Quán» | bấm `#ios-tab-quan`, đợi `#hq-overlay` hiện, canvas có kích thước |
| Không gian bói nào tới được | duyệt `__hq.STATIONS` → không có id trong `IOS_OFF` của `features.js` (`xam`, `sen`, `que`, `vanbia`, `van0…8`, `thaitue`, cửa Vận Mệnh/Thái Tuế) |
| Không có Thầy AI | `FEATURES.ai === false`; không có yêu cầu mạng tới `/zai`, `/api/hq/ai/chat` trong cả phiên |
| Nhiệm vụ | `quests.available()` không chứa nhiệm vụ `ios: 'off'`; nút `divination` đều đã được thay |
| Văn bản | chuỗi hiển thị dùng `TEXT` của iOS («Học Quán», «Sổ Tu Học», «Điểm Tu Học», «Lò Trầm») |
| Không có `.hd.glb` | danh sách tải mạng trong phiên không có `.hd.glb` |
| Thoát | nút thoát gọi `onExit`, lớp phủ ẩn, focus về tab |

`verify-ios-build.mjs` thêm: `dist-ios` không có `game.html` (đúng thiết kế), có chunk `mount`; tổng `dist-ios` ≤ ngân sách (đề xuất 120 MB khi thêm Huyền Thành đầy đủ).

## 7. Kiểm nội dung xuyên tài liệu — `scripts/validate-ids.mjs`

### 7.1 Mục đích

Bộ tài liệu `docs/gdd/` (14 tập) tạo hàng nghìn mã trong các không gian tên của canon §9. Dữ liệu game (`src/game/data/**`) tham chiếu các mã đó. Script bảo đảm:

1. Mỗi mã được **định nghĩa** đúng một lần, trong tài liệu sở hữu không gian tên;
2. Mỗi mã dữ liệu dùng đều có định nghĩa;
3. Mỗi mã tài liệu đánh dấu cho một mốc đều có dữ liệu khi tới mốc đó.

### 7.2 Không gian tên (canon §9) và mẫu nhận diện

| Không gian | Mẫu regex | Tài liệu sở hữu |
|---|---|---|
| `LORE-xxx`, `FAC-xxx`, `HIS-xxx` | `\b(LORE\|FAC\|HIS)-\d{3}\b` | 02 |
| `MQ-*`, `BR-*`, `TL-*`, `CUT-xxx` | `\bMQ-(P\|[1-4]\|E)-\d{2}\b`, `\bBR-(TT\|DC\|NT\|DK)-\d{2}\b`, `\bTL-\d{2}\b`, `\bCUT-\d{3}\b` | 03 |
| `PERK-<sao>`, `STAT-*` | `\bPERK-[A-Za-z]+\b`, `\bSTAT-[A-Z0-9-]+\b` | 04 |
| `CQ-<đạo>-xx`, `DEED-xxx`, `KARMA-*` | `\bCQ-[a-z]+-\d{2}\b`, `\bDEED-\d{3}\b`, `\bKARMA-[A-Z0-9-]+\b` | 05 |
| `NPC-*`, `PERSONA-<npc>`, `BARK-*` | `\bNPC-[A-Za-z0-9_-]+\b`, `\bPERSONA-[a-z_]+\b`, `\bBARK-[A-Za-z0-9-]+\b` | 06 |
| `BLD-<region>-xx`, `POI-<region>-xx` | `\b(BLD\|POI)-[a-z]+-\d{2}\b` | 07 |
| `MOD-<bộ>-xx`, `INT-<bld>` | `\bMOD-[a-z]+-\d{2}\b`, `\bINT-BLD-[a-z]+-\d{2}\b` | 08 |
| `MG-xx`, `ACT-xx` | `\b(MG\|ACT)-\d{2}\b` | 09 |
| `GUILD-*`, `EV-*` | `\bGUILD-[A-Za-z0-9-]+\b`, `\bEV-[a-z]+-\d{2}\b` | 10 |
| `SKU-*`, `SEASON-xx` | `\bSKU-[A-Za-z0-9-]+\b`, `\bSEASON-\d{2}\b` | 11 |
| `UI-xx`, `SFX-*`, `BGM-*` | `\bUI-\d{2}\b`, `\bSFX-[A-Za-z0-9-]+\b`, `\bBGM-[a-z]+\b` | 12 |
| `TASK-xxx`, `SCHEMA-*` | `\bTASK-\d{3}\b`, `\bSCHEMA-[A-Z0-9-]+\b` | 13 |
| `RISK-xx` | `\bRISK-\d{2}\b` | 14 |
| `SQ-<region>-xx`, `DQ-xx` | `\bSQ-[a-z]+-\d{2}\b`, `\bDQ-\d{2}\b` | canon §8 (tài liệu 03/09 cấp số) |

### 7.3 «Định nghĩa» được nhận diện thế nào

Một mã được coi là **định nghĩa** ở dòng tài liệu nếu xuất hiện: (a) ở đầu ô đầu tiên của một hàng bảng (`| MÃ |`), (b) trong tiêu đề (`#… MÃ`), hoặc (c) ở mục «Mã định danh mới» của `README.md`. Mọi lần xuất hiện khác là **tham chiếu**. Chỗ giữ dạng `xxx`/`yy` (`DEED-xxx`) bị bỏ qua.

### 7.4 SCHEMA-CONTENT-INDEX

Đầu ra `test-results/content-index.json` (và bản tóm tắt in ra màn hình):

```jsonc
{
  "generatedAt": "2026-11-05T10:00:00Z",
  "ids": {
    "MQ-1-03": {
      "ns": "MQ", "owner": "03",
      "defined": [ "docs/gdd/03-cot-truyen/04-hoi-1.md:212" ],
      "referenced": [ "docs/gdd/05-cai-menh/02-menh-do.md:88" ],
      "data": [ "src/game/data/quests/mq-1.json" ],
      "milestone": "M1"
    }
  },
  "errors": [
    { "code": "UNDEFINED", "id": "DEED-041", "where": "src/game/data/quests/mq-1.json" },
    { "code": "DUP_DEF", "id": "BLD-longho-03", "where": ["docs/gdd/07-…:40", "docs/gdd/08-…:12"] },
    { "code": "WRONG_NS", "id": "TASK-500", "where": "docs/gdd/09-…:77", "owner": "13" }
  ],
  "warnings": [ { "code": "NO_DATA_AT_MILESTONE", "id": "SQ-longho-04", "milestone": "M2" } ]
}
```

| Mã lỗi | Ý nghĩa | Mức |
|---|---|---|
| `UNDEFINED` | dữ liệu dùng mã chưa định nghĩa ở tài liệu nào | lỗi |
| `DUP_DEF` | một mã định nghĩa ở hai nơi | lỗi |
| `WRONG_NS` | tài liệu định nghĩa mã ngoài không gian tên của mình (canon §9) | lỗi |
| `NO_DATA_AT_MILESTONE` | mã có `milestone ≤` mốc hiện tại (đọc từ `MILESTONE` trong `package.json › config`) nhưng chưa có dữ liệu | lỗi khi đóng mốc, cảnh báo trước đó |
| `ORPHAN_DEF` | định nghĩa nhưng không ai tham chiếu, không có dữ liệu | cảnh báo |

Mốc của một mã đọc từ cột «Mốc» nếu bảng định nghĩa có cột đó; không có thì để trống (không kiểm `NO_DATA_AT_MILESTONE`).

## 8. Engine

| Bộ | Vai trò |
|---|---|
| `npm test` (selftest) | hồi quy engine toàn app — **bắt buộc xanh** trước mọi PR chạm `src/engine/` |
| `npm run accuracy` | độ chính xác cổ pháp so các ca kinh điển |
| `test-engine-fixes` | D1–D3 (phần 02 §10) |
| `lint-tengod` | chặn chuỗi thập thần giản thể trong ngữ cảnh so sánh |
| `gen-mau-charts --check` | engine đổi số → báo; người duyệt cập nhật `mau-charts.json` |

Luật quy trình: PR chạm `src/engine/` phải tách riêng khỏi PR game (phần 02 §10.4) và ghi nhật ký thay đổi của app.

## 9. Mô phỏng

| Mô phỏng | Cách | Ngưỡng |
|---|---|---|
| `sim-quests.mjs` | bot chơi tuyến chính với 4 lá số đại diện 4 lớp + 1 lá số `lop = null` (`'未知'`), chọn phương án đầu tiên hợp lệ, tua đồng hồ cho nút `wait` | tới `MQ-E` không kẹt; không lớp nào bị khóa tuyến chính |
| `sim-economy.mjs` | 5 kiểu người chơi (chăm hằng ngày, cuối tuần, chỉ MMO, chỉ cốt truyện, cày tối đa) × 90 ngày giả lập; cộng Phúc Khí, Đạo Hạnh, công đức theo bảng dữ liệu | trần ngày giữ; người lá số thấp không tụt sau quá xa (khoảng cách Đạo Hạnh ngày 90 giữa Tiềm Lực 20 và 88 ≤ 25% nhờ hệ số Nghịch Thiên — ngưỡng do tài liệu 04/11 chốt) |

## 10. Bảo mật

| Bộ | Ca |
|---|---|
| `fuzz-protocol.mjs` | 100.000 chuỗi ngẫu nhiên/biến dị từ gói hợp lệ → `parseClient` không ném, không trả gói ngoài biên |
| `test-worker-authz.mjs` | mọi `/api/hq/*` ghi dữ liệu: thiếu token → 401; token của tài khoản A không đọc/ghi được vault B; webhook thiếu chữ ký → 400 |
| Rà bí mật | CI quét `dist/`, `dist-ios/` tìm mẫu khóa (`MESHY_API_KEY`, `sk_live_`, `-----BEGIN PRIVATE KEY-----`, khóa z.ai) → fail |
| Kiểm quyền riêng tư | `test-ev` (không ngày sinh trong sự kiện), `test-hq-save` (`cloudBirth = false`) |

## 11. Trợ năng

- Kiểm bằng Playwright: bảng DOM có `aria-label` cho nút biểu tượng (HUD hiện có dùng `aria-label` cho âm thanh, đổi tên); thứ tự Tab hợp lý trong cổng nhập môn; chữ Hán luôn có phiên âm Hán Việt (quét chuỗi `text/vi.json`: ký tự CJK đứng một mình không có ngoặc phiên âm → cảnh báo).
- Tùy chọn: thêm `@axe-core/playwright` (phụ thuộc phát triển mới — cần TD duyệt) cho bảng DOM.

## 12. Kiểm thủ công theo mốc

| Kiểm | Thiết bị | Khi |
|---|---|---|
| Chơi thử kịch bản mốc (tài liệu 03) | 1 máy mỗi hạng + 1 iPhone | cuối mỗi sprint |
| Định nghĩa Done công trình (ảnh, cảm giác đi) | máy mid | mỗi công trình |
| Nội dung nhạy cảm (tôn giáo, âm tà, Tà Lộ) | cố vấn tài liệu 14 | trước mốc M2–M5 tương ứng |
| Bài tải MMO 60 người | `load-quan` trên môi trường thử | trước M2 và M6 |
| Thanh toán thật (giao dịch nhỏ, hoàn tiền) | tài khoản sandbox Apple/Stripe/VNPay | M6 |

## 13. Phân loại lỗi

| Mức | Định nghĩa | Thời hạn sửa |
|---|---|---|
| S0 | mất dữ liệu người chơi, lộ dữ liệu cá nhân, sập trên mọi thiết bị, vi phạm trụ cột T6 (bán cải mệnh, nội dung nghi lễ có hại) | dừng phát hành, sửa ngay |
| S1 | kẹt tuyến chính, không vào được game trên một nền tảng, sai số engine hiển thị | trước bản phát hành kế |
| S2 | tính năng phụ hỏng, hiệu năng dưới ngân sách một hạng | trong mốc |
| S3 | thẩm mỹ, chữ | xếp lịch |

## 14. Thứ tự chạy trong CI

```
PR:      lint-tengod → test (selftest) → test:game → test:ai → test:world → test:content → build → check:bundle
         → e2e (Chrome headless) → bench (tất định) → [job riêng] dev:mmo + test:mmo:int + test:worker
Đêm:     accuracy → sim-quests → sim-economy → fuzz → gen-mau-charts --check → validate-ids (đầy đủ)
Mốc:     load:mmo → bench phòng thí nghiệm → verify:ios + verify:ios-path + verify:ios-game → kiểm thủ công §12
```

Mục tiêu thời gian job PR chính ≤ 12 phút. Test chập chờn (flaky) bị cách ly vào nhãn `@flaky` trong 48 giờ và phải có chủ sửa; không cho phép bỏ qua vô thời hạn.

## 15. Phác thảo workflow CI

Tệp mới `.github/workflows/game-ci.yml` (không đụng `pages.yml`; `cloudflare.yml` sửa riêng ở TASK-014). Phác thảo để OPS hoàn thiện:

```yaml
name: Game CI
on:
  pull_request:
  push: { branches: [main] }
  schedule: [ { cron: '0 19 * * *' } ]      # 02:00 giờ Việt Nam — bộ «Đêm»
jobs:
  unit:
    runs-on: ubuntu-latest
    strategy: { matrix: { node: [20, 24] } }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '${{ matrix.node }}', cache: npm }
      - run: npm ci
      - run: node scripts/lint-tengod.mjs
      - run: node scripts/lint-pure.mjs
      - run: npm test
      - run: npm run test:game
      - run: npm run test:ai
      - run: npm run test:world
      - run: npm run test:content
  build-e2e:
    runs-on: ubuntu-latest
    needs: unit
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci && npx playwright install --with-deps chromium
      - run: npm run build
      - run: node scripts/check-bundle.mjs
      - run: npx vite preview --port 4173 &
      - run: npx wait-on http://127.0.0.1:4173/game.html
      - run: node scripts/e2e-game.mjs http://127.0.0.1:4173
      - run: node scripts/bench-scenes.mjs --url http://127.0.0.1:4173/game.html --scenes S1,S3,S6,S7 --ci
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: perf-and-shots, path: test-results/ }
  worker:
    runs-on: ubuntu-latest
    needs: unit
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci && npm run build
      - run: cp .dev.vars.example .dev.vars
      - run: node scripts/dev-mmo.mjs 8788 &
      - run: npx wait-on tcp:127.0.0.1:8788
      - run: npm run test:mmo:int
      - run: npm run test:worker
  nightly:
    if: github.event_name == 'schedule'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run accuracy
      - run: node scripts/sim-quests.mjs --all
      - run: node scripts/sim-economy.mjs
      - run: node scripts/fuzz-protocol.mjs --n 100000
      - run: node scripts/gen-mau-charts.mjs --check
      - run: node scripts/validate-ids.mjs --full
```

Ghi chú:

- `wait-on` là tiện ích dòng lệnh chạy qua `npx` (không thêm vào `package.json`); có thể thay bằng vòng `curl` nếu TD không muốn phụ thuộc tải lúc chạy.
- Job `worker` không cần secret thật: `.dev.vars.example` chứa khóa thử (TASK-069).
- `bench-scenes --ci` chỉ so số tất định (phần 09 §6.1).
- Job nào cần secret (triển khai) chỉ nằm ở `cloudflare.yml` và gắn GitHub Environment có người duyệt.
