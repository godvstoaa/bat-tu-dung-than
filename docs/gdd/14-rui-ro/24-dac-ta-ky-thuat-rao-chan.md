# 14.24 · Đặc tả kỹ thuật các rào chắn an toàn — giao diện mô-đun, dữ liệu, điểm gắn vào mã hiện có

> Biến các quy tắc tập 14.08–14.12 thành đặc tả để tập 13 cấp `TASK-*`. Mọi mô-đun mới đặt dưới `src/game/safety/` (thuần JS, không DOM, test được bằng node — cùng phong cách `protocol.js`, `cosmetics.js`).
> Mã: `RISK-SPEC-xx`. Chủ: `TMC` (máy chủ), `TAI` (AI), `QA`.

---

## 1. Tổng quan mô-đun

| Mô-đun | Tệp đề xuất | Dùng ở | Rủi ro |
|---|---|---|---|
| Chuẩn hóa tiếng Việt | `safety/normalize.js` | L0, bộ lọc tên, bộ lọc âm tà | RISK-037, RISK-122 |
| Bộ phát hiện khủng hoảng L0 | `safety/crisis.js` | `master-ui.js` (trước `askAI`), ô văn bản tự do | RISK-037, RISK-163 |
| Bộ lọc đầu ra | `safety/output-filters.js` | `master-ui.js` (stream + sau khi xong) | RISK-052–056, RISK-068 |
| Bộ phân loại chủ đề persona | `safety/persona-topics.js` | trước `askAI` | RISK-054, RISK-035 |
| Thẻ persona | `safety/personas/*.json` | `ai.js` (tham số `persona`) | 14.14 |
| Cổng tuổi tại chỗ | `safety/age-gate.js` | `main.js`, `net.js`, `master-ui.js`, nội dung | RISK-040, RISK-080 |
| Cấu hình an toàn từ xa | `safety/remote-config.js` | mọi nơi đọc công tắc | 14.21 §0.2 |
| Đồng ý | `safety/consent.js` | thẻ đồng ý AI, MMO, âm tà | RISK-059, RISK-LG-51 |
| Vùng thiêng | dữ liệu trong `world.js` / tập 08 + `safety/sacred-zones.js` | điều khiển nhân vật, emote, ngự vật | RISK-003 |
| Bất biến kinh tế | `scripts/test-game-cosmetics.mjs` | CI | 14.03 §4.3 |
| Lọc tên máy chủ | mở rộng `protocol.js › cleanName` | `worker/quan-room.js` | RISK-122 |
| Hàng đợi báo cáo | `worker/reports.js` (mới) | `quan-room.js`, `admin.js` | RISK-109, RISK-123 |
| Đánh giá AI | `scripts/eval-ai-safety.mjs` | CI, thủ công | RISK-072 |

---

## 2. `safety/normalize.js`

```js
/**
 * @param {string} raw
 * @param {{ leet?: boolean }} [opt]
 * @returns {{ original: string, lower: string, plain: string, compact: string }}
 *  - lower:   NFC + chữ thường + bỏ zero-width
 *  - plain:   lower + bỏ dấu (đ→d) + teencode → chuẩn
 *  - compact: plain + bỏ ký tự chen giữa chữ + gộp lặp ≥3 (+ leet nếu opt.leet)
 */
export function normalizeVi(raw, opt = {}) { /* … */ }
```

| Mã | Yêu cầu |
|---|---|
| RISK-SPEC-01 | Thuần, không phụ thuộc; dùng chung client và Worker. |
| RISK-SPEC-02 | Bảng teencode lấy từ `safety/data/teencode.json` (14.15 §5.2); không hard-code. |
| RISK-SPEC-03 | Hiệu năng: câu 300 ký tự (giới hạn `maxlength` của ô hỏi trong `master-ui.js`) xử lý < 2 ms. |
| RISK-SPEC-04 | Test: 100 cặp (đầu vào → `plain`, `compact`) trong `scripts/test-safety-normalize.mjs`. |

---

## 3. `safety/crisis.js` (L0)

```js
/**
 * @param {string} text            câu người chơi gõ
 * @param {{ history?: string[],   // ≤ 3 câu gần nhất của người chơi
 *           minor?: boolean,
 *           lexicon: object }} ctx // safety/crisis-lexicon.json
 * @returns {{ level: 'none'|'low'|'medium'|'high',
 *             groups: string[],     // vd ['C1'] — KHÔNG trả nội dung khớp
 *             minorCard: boolean,
 *             rb3: boolean }}
 */
export function assessCrisis(text, ctx) { /* … */ }
```

**Thuật toán:**
1. `normalizeVi(text)`.
2. Với mỗi nhóm C1–C9: so mẫu trên `compact`; nếu mẫu yêu cầu ngôi thứ nhất thì kiểm `lower` có đại từ ngôi thứ nhất trong cửa sổ 6 từ.
3. Áp ngoại lệ thuật ngữ (14.15 §6) — chỉ khi **không** có ngôi thứ nhất + động từ ý định.
4. Mức = max mức nhóm khớp.
5. Luật ngữ cảnh: lặp (RISK-MH-20), phủ định (MH-21), `minor` (MH-22), RB3 (C7 có đối tượng cụ thể → `rb3: true`).
6. Trả kết quả; **không ghi nhật ký nội dung**.

**Gắn vào `master-ui.js › ask(q)`** (trước dòng `const L = await load();`):

```js
const risk = assessCrisis(q, { history: lastUserTurns(3), minor: api.isMinor?.(), lexicon });
api.safetyCount?.('crisis.' + risk.level);            // bộ đếm ẩn danh
if (risk.level === 'high') { showCrisisCard(risk); return; }   // không gọi askAI
if (risk.rb3)            { showRb3Card(); return; }
const safety = risk.level === 'medium' ? 'elevated' : risk.level === 'low' ? 'watch' : 'normal';
// … askAI(q, R, cfg, { …, safety })  → ai.js chèn chỉ dẫn S0 tương ứng
```

| Mã | Yêu cầu |
|---|---|
| RISK-SPEC-10 | Chạy được khi `import('../engine/ai.js')` chưa tải (không phụ thuộc mô-đun nặng). |
| RISK-SPEC-11 | Từ điển nạp từ build (dự phòng) + `remote-config` (nếu `version` cao hơn). |
| RISK-SPEC-12 | Test: bộ CR (14.16 §3) chạy offline trong CI với ngưỡng 14.09 §3.4. |

---

## 4. `safety/output-filters.js`

```js
/**
 * @returns {{ text: string,            // văn bản sau lọc
 *             dropped: number,          // số câu bị bỏ
 *             replacedWhole: boolean,   // thay toàn bộ bằng câu kịch bản
 *             flags: string[] }}        // vd ['amta','gamestate'] — đếm, không nội dung
 */
export function filterOutput(text, { persona, gameContext, catalogs, brief, phase }) { /* … */ }
```

Chuỗi bộ lọc theo thứ tự:

| # | Bộ lọc | Đầu vào | Hành động | Ở pha stream? |
|---|---|---|---|---|
| 1 | Khủng hoảng L2 | văn bản | Bỏ toàn bộ, thay mẫu 14.09 §4.2 | Có |
| 2 | Âm tà N1–N8 | văn bản + `amta-blocklist.json` | Bỏ câu (≥ 2 nhóm) / bỏ toàn bộ (N8) | Có |
| 3 | Tất định | văn bản | Bỏ câu có (tử vong / bệnh nặng / ly hôn / tai nạn) + mốc thời gian; thêm caveat RB1/RB2 | Có |
| 4 | Trạng thái game | `gameContext`, `catalogs` | Bỏ câu hứa / tên bịa (14.10 §3.3) | Không (sau khi xong) |
| 5 | Kinh tế | từ khóa | Bỏ câu | Không |
| 6 | Danh xưng thiêng | `safety/data/sacred-names.json` (14.15 §2–§4) | Sửa chính tả gần đúng (khoảng cách ≤ 2) hoặc bỏ câu | Không |
| 7 | Trích dẫn | văn bản | Rút trích nguyên văn > 1 câu thành tên kinh + gợi ý Tàng kinh các; bỏ chú | Không |
| 8 | `checkNeo` mở rộng | brief | Huy hiệu / thu gọn (14.10 §3.4) | Không |

| Mã | Yêu cầu |
|---|---|
| RISK-SPEC-20 | Pha stream: chạy bộ 1–3 trên **đoạn tích lũy** mỗi 200 ký tự; vi phạm → `abort` luồng (`AbortController` đã có trong `master-ui.js`), ẩn phần đã hiện, hiển thị mẫu. |
| RISK-SPEC-21 | `history.push` dùng **văn bản sau lọc**, không dùng bản gốc (tránh mô hình «nhớ» câu vi phạm ở lượt sau). |
| RISK-SPEC-22 | Bộ lọc không gửi văn bản đi đâu; chỉ trả `flags` cho bộ đếm. |
| RISK-SPEC-23 | Test: 14.16 §2.18 (RT-216…225) dạng tiêm văn bản. |

---

## 5. Persona và chủ đề

### 5.1 Dữ liệu thẻ persona (`safety/personas/<id>.json`)

```json
{
  "id": "van_coc",
  "version": 1,
  "ai": true,
  "platforms": ["web", "android", "pc"],
  "temperature": 0.55,
  "toolsAllow": ["analyze_remedy_fate"],
  "scope": ["menh_do", "remedy_fate", "cong_qua", "lieu_pham"],
  "forbidTopics": ["R1","R2","R3","R4","R5","R6","R7","R8","R9","R10","R11","R12","sell_ritual","promise_certain"],
  "refusals": { "R1": "…", "R2": "…", "R13": "…" },
  "minorMode": { "dropTopics": ["marriage","finance","amta"], "style": "ngắn, khích lệ học" },
  "opening": "Mệnh do ta tạo, phúc tự mình cầu.",
  "review": "RV-PG-2026-xxx"
}
```

### 5.2 `safety/persona-topics.js`

```js
/** Phân loại câu hỏi vào hạng mục R1–R12 bằng luật (từ khóa + mẫu), chạy trên máy.
 *  @returns {{ category: 'R1'|…|'R12'|null, confidence: 'rule' }} */
export function classifyTopic(text, { lexicon }) { /* … */ }
```

| Mã | Yêu cầu |
|---|---|
| RISK-SPEC-30 | Câu thuộc `forbidTopics` của persona → trả `refusals[cat]` (kịch bản), không gọi mô hình. |
| RISK-SPEC-31 | Phân loại **không chắc** → vẫn gọi mô hình, dựa vào S0 + bộ lọc đầu ra (tránh chặn quá mức — RISK-061). |
| RISK-SPEC-32 | `refusals.R13` luôn được trả khi câu hỏi «bạn là người hay máy» (mẫu nhận diện riêng). |

---

## 6. `safety/age-gate.js`

```js
/** Tuổi tính từ năm sinh trên máy (state.player.birth.y) hoặc năm sinh tuân thủ (tài khoản).
 *  @returns {{ band: 'u13'|'u16'|'u18'|'adult'|'unknown', source: 'chart'|'account'|'none' }} */
export function ageBand(state, now = new Date()) { /* … */ }

export const GATES = {
  mmo:        { u13: false, u16: 'parental', u18: true, adult: true },
  aiFreeChat: { u13: false, u16: false, u18: 'minorMode', adult: true },
  amta:       { u13: false, u16: false, u18: false, adult: 'optin' },
  taLo:       { u13: false, u16: false, u18: 'optin', adult: 'optin' },
  phongdoFull:{ u13: false, u16: false, u18: true, adult: true },
  hophon:     { u13: false, u16: false, u18: false, adult: true },
  purchase:   { u13: false, u16: false, u18: false, adult: true },
};
```

| Mã | Yêu cầu |
|---|---|
| RISK-SPEC-40 | `unknown` (chưa nhập ngày sinh) xử lý như `u16` cho tới khi nhập. |
| RISK-SPEC-41 | Khi người chơi sửa bát tự (`hq-rebirth`) làm đổi nhóm tuổi: áp ngay; không xóa tiến độ. |
| RISK-SPEC-42 | Lá số khách NPC, hồ sơ người khác **không** ảnh hưởng tuổi của người chơi. |
| RISK-SPEC-43 | Bảng `GATES` khớp 14.12 §5.6 và 14.08 §2.2; test đơn vị với năm sinh 2016, 2012, 2009, 2007, 1990. |
| RISK-SPEC-44 | Tham số tuổi chính xác chờ luật sư (14.11 §13 câu 5); để trong cấu hình, không hard-code rải rác. |

---

## 7. `safety/remote-config.js`

```js
/** Đọc /api/game-config (Worker). Cache 60 giây. Lỗi mạng → SAFE_DEFAULTS. */
export const SAFE_DEFAULTS = {
  amtaEnabled: false, taLoEnabled: false, personaKill: ['*'], gameContext: false,
  regionClosed: [], catalogHidden: [], storeFrozen: true, minorChat: false,
};
export async function getConfig() { /* … */ }
```

| Mã | Yêu cầu |
|---|---|
| RISK-SPEC-50 | `SAFE_DEFAULTS` là trạng thái **an toàn nhất** (tắt nội dung nhạy cảm, tắt AI persona, đóng băng cửa hàng). Người chơi vẫn chơi được tuyến chính bằng kịch bản. |
| RISK-SPEC-51 | Endpoint cấu hình chỉ đọc công khai; ghi qua admin có xác thực, ghi `audit:log`. |
| RISK-SPEC-52 | Bản iOS: cấu hình từ xa **chỉ được tắt**, không được bật tính năng đã tắt lúc build (RISK-092). Kiểm bằng: giá trị từ xa AND hằng số build. |

---

## 8. `safety/consent.js`

```js
export const CONSENTS = {
  ai:   { version: 1, text: '14.12 §2.3' },
  mmo:  { version: 1, text: '14.17 §6' },
  amta: { version: 1, text: '14.08 §2.3', twoStep: true, delayMs: 5000 },
  taLo: { version: 1, text: '14.08 §2.3 (thẻ ngoài truyện)' },
};
/** state.settings.consents = { ai: { v, at, choice }, … } — lưu trên máy */
export function hasConsent(state, key) { /* v === CONSENTS[key].version && choice === 'yes' */ }
export function recordConsent(state, key, choice, now = Date.now()) { /* … */ }
export function withdraw(state, key) { /* … */ }
```

| Mã | Yêu cầu |
|---|---|
| RISK-SPEC-60 | Tăng `version` → hỏi lại (RISK-PV-10). |
| RISK-SPEC-61 | `hydrate()` của `state.js` phải giữ `settings.consents` (khung `createState` thêm trường). |
| RISK-SPEC-62 | Rút đồng ý MMO → `net.js` không kết nối (`stopped = true`). |

---

## 9. Vùng thiêng

### 9.1 Dữ liệu

```js
// world.js hoặc dữ liệu vùng (tập 08 cấp mã INT-*)
export const SACRED_ZONES = [
  { id: 'chinh_duong_t1', region: 'thanh', polygon: [[x,z], …], yMin: 0, yMax: 12,
    allowEmotes: ['bow','palm'], mounts: false, jump: false, aura: 'quiet', music: 'temple' },
];
```

### 9.2 Hành vi

| Mã | Hành vi |
|---|---|
| RISK-SPEC-70 | Vào vùng: ngự vật tự cất (hoạt hình hạ xuống), hào quang ồn tắt, nhảy tắt, emote ngoài danh sách bị ẩn khỏi bảng. |
| RISK-SPEC-71 | Máy chủ MMO: gói `emo` với emote ngoài danh sách khi người gửi đang ở trong vùng (theo tọa độ `mv` cuối) → bỏ qua. |
| RISK-SPEC-72 | Hộp va chạm tượng, hương án cao hơn chiều cao nhảy tối đa; mái điện thờ là bề mặt «trượt» (không đứng được). |
| RISK-SPEC-73 | Test A* + va chạm: thử đáp lên từng tượng, mái trong vùng — không đứng được (tương tự `test-game-state › Sơn Môn`). |

---

## 10. Máy chủ: lọc tên, danh hiệu, báo cáo

### 10.1 `protocol.js`

| Thay đổi | Chi tiết |
|---|---|
| `title` | `parseClient('hello')`: `title` → `TITLE_IDS.includes(m.title) ? m.title : ''`; danh sách id từ `state.js › TITLES` (dùng chung) |
| `cleanName` | Gọi `normalizeVi` + `name-filter.json` (14.15 §7); trả `null` khi vi phạm (đã có cơ chế đổi «Khách», `renamed`) |
| `REPORT_REASONS` | Thêm `groom`, `scam`, `impersonate` |
| `VERSION` | Tăng khi đổi giao thức; client cũ nhận `err` hướng dẫn cập nhật |

### 10.2 `worker/reports.js` (hàng đợi trung tâm)

```js
// Lưu trong D1 (hoặc KV khi chưa có D1)
// reports(id TEXT PK, room INT, reason TEXT, priority TEXT, target_u TEXT, target_name TEXT,
//         target_pid_hash TEXT, reporter_pid_hash TEXT, created_at INT, status TEXT,
//         handled_by TEXT, handled_at INT, note TEXT, expires_at INT)
export async function fileReport(env, r) { /* hạn mức theo reporter, gộp trùng, đặt expires_at */ }
export async function listReports(env, { status, priority, limit }) { /* admin */ }
export async function resolveReport(env, id, { action, note, by }) { /* ghi audit */ }
```

| Mã | Yêu cầu |
|---|---|
| RISK-SPEC-80 | Lưu **băm** `pid` (muối riêng của hàng đợi), không lưu `pid` thô. |
| RISK-SPEC-81 | `expires_at` = xử lý xong + 30 ngày, tối đa 90 ngày kể từ tạo (RISK-109). Dọn bằng cron / alarm. |
| RISK-SPEC-82 | Hạn mức: 10 báo cáo / người báo / ngày; 3 báo cáo / cặp (người báo, đối tượng) / 30 ngày. |
| RISK-SPEC-83 | `groom`: 2 người báo khác nhau trong 24 giờ → đặt cờ tạm ngắt MMO đối tượng (DO kiểm cờ khi `hello`). |
| RISK-SPEC-84 | `quan-room.js` bỏ `MAX_REPORTS` và khóa `report:*` cục bộ sau khi chuyển. |

### 10.3 Giới hạn kết nối

| Mã | Yêu cầu |
|---|---|
| RISK-SPEC-90 | Worker đếm kết nối WebSocket đồng thời theo IP (≤ 4) qua một DO đếm nhẹ hoặc KV ngắn hạn; vượt → 429. |
| RISK-SPEC-91 | DO: socket chưa `hello` sau 5 giây → đóng (`CLOSE_BAD`). |
| RISK-SPEC-92 | Một `pid` chỉ một socket sẵn sàng toàn hệ (DO đếm) — socket mới đẩy socket cũ ra. |

---

## 11. `scripts/eval-ai-safety.mjs`

| Tham số | Ý nghĩa |
|---|---|
| `--set rt,cr,ma` | Bộ đề chạy |
| `--persona <id>` | Lọc persona |
| `--inject` | Chế độ tiêm văn bản (chỉ kiểm bộ lọc) |
| `--offline` | Chỉ L0 + bộ lọc, không gọi mô hình |
| `--out test-results/ai-safety/<tên>.json` | Tệp kết quả |

| Mã | Yêu cầu |
|---|---|
| RISK-SPEC-100 | Dùng **cùng chuỗi xử lý** với game (import `crisis.js`, `persona-topics.js`, `output-filters.js`), không tái hiện riêng. |
| RISK-SPEC-101 | Gọi mô hình qua proxy thật với khóa thử nghiệm và hạn mức riêng; không chạy trên khóa sản phẩm giờ cao điểm. |
| RISK-SPEC-102 | Kết quả có phiên bản S0, persona, mô hình, nhà cung cấp, ngày; mã thoát ≠ 0 khi dưới ngưỡng (14.10 §4.5). |

---

## 12. Kiểm thử mới cần thêm vào `package.json`

| Lệnh | Gồm |
|---|---|
| `npm run test:safety` | `test-safety-normalize.mjs`, `test-safety-crisis.mjs` (offline CR), `test-safety-filters.mjs` (tiêm), `test-safety-agegate.mjs`, `test-safety-consent.mjs` |
| `npm run test:game` (mở rộng) | E1–E6 trong `test-game-cosmetics.mjs`; vùng thiêng trong `test-game-state.mjs` |
| `npm run test:mmo` (mở rộng) | `title` id; tên lọc mở rộng; báo cáo hạn mức; giới hạn kết nối |
| `npm run eval:ai` | `eval-ai-safety.mjs --set rt,cr,ma` |
| `npm run verify:ios-path` (mở rộng) | Regex từ cấm 14.11 §8.2; không có chuỗi `master-ui`, `que-ui`, `vanmenh-ui` |

| Mã | Yêu cầu |
|---|---|
| RISK-SPEC-110 | `test:safety` chạy trong CI mỗi commit; `eval:ai` chạy trước mốc và hằng tuần. |
| RISK-SPEC-111 | Bộ đề nguy hiểm (`test-data/ai-safety`, `safety/amta-blocklist.json`) không nằm trong gói build gửi người chơi (trừ phần bộ lọc cần chạy, ở dạng đã băm hoặc rút gọn nếu kho mã công khai — RISK-DICT-30). |
