# Mục 03 · Hợp đồng dữ liệu: bảng tra cứu endpoint, stream, rate limit, cache, kill-switch

**Tóm tắt mục (3–5 dòng).** Mục này là bảng tra cứu hợp đồng dữ liệu của chuỗi AI Huyền Quán: endpoint & preset; body request; stream contract; rate limit; KV keys; cache brief; khuôn tiết kiệm token. Mỗi số liệu sống đúng một chỗ — ở các bảng dưới đây. Mục khác cần số nào thì trỏ về số bảng, không chép số. Luồng kiến trúc (ai gọi ai, fallback thế nào, key đi đường nào) là chuyện của mục 02; mục này không kể lại luồng.

## Phân vai của mục này

> **Phân vai:** «Bảng tra cứu hợp đồng — luồng kiến trúc ở mục 02, mục này KHÔNG kể lại luồng; mỗi bảng có cột dẫn chiếu để mục khác trỏ về đây».

| Vai | Ý nghĩa |
|---|---|
| Bảng tra cứu hợp đồng | Bảy bảng dưới đây là nơi duy nhất chứa số liệu hợp đồng của chuỗi AI. |
| Không kể lại luồng | Không có chuyện kể, không có sơ đồ gọi. Chỉ có hợp đồng từng mặt hàng. |
| Cột dẫn chiếu | Mỗi dòng bảng ghi `file:line` thật. Mục khác kiểm chứng lại được mà không cần đoán. |
| Quy tắc trỏ | Dạng trỏ chuẩn: «mục 03 · bảng 3.x · dòng 3.x.y». Khách chính của mục này là mục 02 và mục 14. |

### Ranh giới với mục 02

| Thuộc mục này | Thuộc mục 02 |
|---|---|
| Giá trị hợp đồng từng trường: temperature, TTL, ngưỡng, timeout | Thứ tự gọi, ai gọi ai, vòng fallback |
| Shape KV, shape body, shape SSE | Bối cảnh người dùng, bối cảnh màn hình game |
| Kết luận an toàn key | Cách key đi từ KV tới backend thật |
| Cache key + khuôn tiết kiệm token | Chuyện gì xảy ra khi cache trượt |

### Quy ước chung của mọi bảng

| Quy ước | Ý nghĩa |
|---|---|
| Không viết key | Tài liệu chỉ xuất hiện tên trường: `apiKey`, `zaiKey`, `freePool[].apiKey`. Không có, và không được phép có, giá trị key nào. |
| Số nguyên giá trị | Mọi con số giữ đúng như đo từ code. Không làm tròn, không suy rộng. |
| «Phát hiện của bản thiết kế» | Đánh dấu rõ ở chỗ đề xuất mới chưa có trong code hôm nay (xem bảng 3.6). |
| Chốt mỗi bảng | Mỗi bảng kết bằng 1 dòng «ai được phép dùng số này» + dòng «mục nào trỏ về đây: 02, 14». |

---

## 3.1 · Bảng endpoint & preset (bảng 3.1)

Bảng này sở hữu: preset mặc định, luật migrate, luật `isAIReady`, luật Capacitor, và kết luận an toàn key.

| # | Mặt hàng | Hợp đồng | Dẫn chiếu |
|---|---|---|---|
| 3.1.1 | Preset mặc định | endpoint `/zai/api/paas/v4` + model `glm-5.3` (id `zai-proxy`, nhãn «khuyên dùng») | src/engine/ai.js:176, 181-197 |
| 3.1.2 | Lưu cấu hình client | localStorage `bazi_ai_config_v1` | src/engine/ai.js:176 |
| 3.1.3 | Migrate ép proxy | endpoint dạng `https://api.z.ai/...` bị ép thành `/zai/...` — gọi thẳng api.z.ai bị CORS-block trên trình duyệt | src/engine/ai.js:208-210 |
| 3.1.4 | `isAIReady` | endpoint bắt đầu bằng `/` = proxy có key server-side → coi là sẵn sàng, không cần `apiKey` phía client | src/engine/ai.js:243-249 |
| 3.1.5 | Capacitor native | đường `/...` resolve thành `https://battu.god8.shop/...` | src/engine/ai.js:2851-2854 |
| 3.1.6 | Route `/zai` production | có `aiCfg.apiKey` → forward thẳng api.z.ai kèm `Authorization: Bearer`; không có key → kiểm tra `ai:free_enabled` rồi freeRoute | worker/index.js:170-183 |
| 3.1.7 | Vòng lặp prefix | mọi prefix đi qua map `PROXIES` (prefix → host); danh sách prefix là hợp đồng của mục 02 | worker/index.js:155-156, 184 |
| 3.1.8 | Log lỗi từ tool | tool `log_error` POST `/api/log-error` | src/engine/ai.js:1937-1941 |
| 3.1.9 | Dev proxy Vite | `/zai` → api.z.ai; `/bigmodel` → open.bigmodel.cn; kèm `/deepseek`, `/openai`, `/nvidia`, `/groq`; `/ws` → WebSocket MMO | vite.config.js:72-78 |
| 3.1.10 | Chunk bundle | `ai.js` / `nlg.js` / brief-extender tách chunk riêng `engine-ai`; entry `game.html` chỉ ở build web | vite.config.js:88, 94-96 |

### An toàn key — kết luận của bảng 3.1

| # | Mặt hàng | Hợp đồng | Dẫn chiếu |
|---|---|---|---|
| 3.1.11 | Client không thấy key | key không bao giờ tới client; endpoint `/` được coi là proxy key-server-side | src/engine/ai.js:243-249 |
| 3.1.12 | Key sống duy nhất ở KV | key nằm trong KV `ai:config`: `apiKey`, `zaiKey`, `freePool[].apiKey` | worker/admin.js:266-286 |
| 3.1.13 | Mask khi trả admin UI | `'***'` + 4 số cuối (`slice(-4)`) cho cả `apiKey`, `zaiKey`, `freePool[].apiKey` | worker/admin.js:285, 291-293 |
| 3.1.14 | Audit tĩnh key hardcode | chưa thấy key hardcode trong repo; mọi chuỗi key là placeholder hoặc đọc từ KV. Giới hạn: audit tĩnh — chưa xác minh runtime | dữ liệu nền của bản thiết kế (mục AI · limits) |

Tên trường được phép nhắc khi viết code (chỉ tên, không giá trị):

| Tên | Vai | Dẫn chiếu |
|---|---|---|
| `aiCfg.mode` | `'off' \| 'free' \| 'custom'` | worker/admin.js:269 |
| `aiCfg.endpoint` | endpoint ghi đè | worker/admin.js:270 |
| `aiCfg.apiKey` | key backend custom | worker/admin.js:271 |
| `aiCfg.model` | model ghi đè | worker/admin.js:273 |
| `aiCfg.zaiKey` | key z.ai-paid (freeRoute primary) | worker/admin.js:274 |
| `aiCfg.freePool[i]` | `{name, endpoint, model, apiKey}` mỗi backend pool | worker/index.js:58, 62 |
| cfg client: `enabled`, `endpoint`, `model`, `apiKey`, `preset` | trường đọc/migrate phía client | src/engine/ai.js:208, 213, 248 |

> **Ai được phép dùng số này:** mục 02 và mục 14 TRỎ về bảng 3.1 bằng số dòng; mọi mục khác cần số nào cũng TRỎ, không chép. — mục nào trỏ về đây: 02, 14

---

## 3.2 · Bảng body request `/chat/completions` (bảng 3.2)

Bảng này sở hữu: shape body, giá trị từng trường, điều kiện bật/tắt từng trường, và một body mẫu dán được.

| # | Trường | Hợp đồng | Điều kiện | Dẫn chiếu |
|---|---|---|---|---|
| 3.2.1 | URL | endpoint + `/chat/completions` nếu chưa có đuôi | mọi lượt | src/engine/ai.js:2755-2756 |
| 3.2.2 | Header Authorization | `Bearer <cfg.apiKey>` CHỈ khi có apiKey client | proxy `/` không cần | src/engine/ai.js:2757 |
| 3.2.3 | `model` | lấy từ config client; mặc định `glm-5.3` | preset `zai-proxy` | src/engine/ai.js:181-197 |
| 3.2.4 | `temperature` | `0.55` | mọi lượt; hạ từ 0.7 vì nhiệt độ cao tăng lỗi xáo chữ token tiếng Việt | src/engine/ai.js:2764-2765 |
| 3.2.5 | `stream` | `true` | mọi lượt | src/engine/ai.js:2765 |
| 3.2.6 | `thinking` | `{ type: 'enabled' }` | CHỈ host Z.ai/BigModel native (`isZaiNative` xét host + model); trừ nvidia; không gửi cho host Cloudflare | src/engine/ai.js:2758-2763, 2766 |
| 3.2.7 | `tools` | `AI_TOOLS` — 38 tool deterministic | ẩn khi câu trivial hoặc synthesis | src/engine/ai.js:1409, 2776 |
| 3.2.8 | `tool_choice` | `'auto'` | ẩn cùng `tools` khi trivial/synthesis | src/engine/ai.js:2776 |
| 3.2.9 | `messages` | 3 system + history ≤ 8 lượt + câu hỏi user | history = `slice(-8)` | src/engine/ai.js:2747-2753 |
| 3.2.10 | `messages[0]` system | SYSTEM_PROMPT; iOS dùng RESEARCH_SYSTEM_PROMPT qua `import.meta.env.MODE` | — | src/engine/ai.js:2748 |
| 3.2.11 | `messages[1]` system | brief + guide (synthesis → MASTER_SYNTHESIS_GUIDE; hẹp → luật tool) + `_ANTI_MANIP_GUIDE` (build static 1 lần) | guide đổi theo loại câu | src/engine/ai.js:146-167, 2743-2745, 2749 |
| 3.2.12 | `messages[2]` system | `STYLE_DIRECTIVES[style]`; game không truyền style → mặc định `gan-guoi` | — | src/engine/ai.js:2750, 1182-1204 |
| 3.2.13 | Variant ở freePool | backend pool bị strip `tools` + `tool_choice` (tránh HTTP 413); backend z.ai-paid giữ nguyên (`stripTools:false`) | chỉ khi worker chạy freeRoute | worker/index.js:62-64, 78-79 |

### Body mẫu — 1 lượt «hỏi Thầy» (câu hẹp, có tool)

Dán được vào code thật. Thay `{{ten_bien}}` bằng giá trị thật. Cấu trúc theo src/engine/ai.js:2747-2776.

```js
// Body mẫu — lượt «hỏi Thầy». Nguồn: src/engine/ai.js:2747-2776.
const body = {
  model: '{{MODEL}}',                    // mặc định 'glm-5.3' theo preset zai-proxy
  temperature: 0.55,
  stream: true,
  thinking: { type: 'enabled' },         // XÓA dòng này khi host không phải Z.ai/BigModel native (ví dụ nvidia)
  messages: [
    { role: 'system',    content: '{{SYSTEM_PROMPT}}' },     // ai.js:2748 — iOS thay RESEARCH_SYSTEM_PROMPT
    { role: 'system',    content: '{{BRIEF_VA_GUIDE}}' },    // brief + guide + _ANTI_MANIP_GUIDE (ai.js:2749)
    { role: 'system',    content: '{{STYLE_DIRECTIVES}}' },  // mặc định style 'gan-guoi' (ai.js:2750)
    { role: 'user',      content: '{{LICH_SU_U}}' },         // history.slice(-8) — tối đa 8 cặp lượt cũ
    { role: 'assistant', content: '{{LICH_SU_A}}' },
    { role: 'user',      content: '{{CAU_HOI}}' }            // câu người chơi gõ trong khung «Thầy luận»
  ],
  tools: AI_TOOLS,                       // 38 tool — AI_TOOLS khai sẵn trong src/engine/ai.js:1409
  tool_choice: 'auto'                    // câu trivial/synthesis: BỎ cả tools + tool_choice (ai.js:2776)
};
// Hợp đồng biến thể: khi lượt đi qua backend freePool, worker tự xoá tools/tool_choice
// trước khi forward (worker/index.js:78-79) — client vẫn gửi như trên, không cần tự strip.
```

> **Ai được phép dùng số này:** mục 02 và mục 14 TRỎ bảng 3.2; muốn nói «temperature bao nhiêu, tools bao nhiêu» phải trỏ dòng 3.2.x, không chép số. — mục nào trỏ về đây: 02, 14

---

## 3.3 · Bảng stream contract (bảng 3.3)

Bảng này sở hữu: hợp đồng SSE, timeout, retry. Khi nào fallback về đâu là chuyện mục 02 — không ở đây.

| # | Mặt hàng | Hợp đồng | Dẫn chiếu |
|---|---|---|---|
| 3.3.1 | Định dạng | SSE — đọc qua `res.body.getReader()`, gom buffer, tách event | src/engine/ai.js:2892-2923 |
| 3.3.2 | `delta.content` | gom chuỗi và đẩy `onToken` mỗi mảnh — UI dồn token theo rAF | src/engine/ai.js:2892-2983 |
| 3.3.3 | `delta.tool_calls` | tích luỹ theo `index`; round đủ mới exec tool | src/engine/ai.js:2892-2983 |
| 3.3.4 | `reasoning_content` | chỉ hiện stage-label tiếng Việt («💭 đang luận Dụng Thần…»); KHÔNG lộ chữ raw | src/engine/ai.js:2880-2888, 2892-2983 |
| 3.3.5 | TTFT | 75s chờ mảnh đầu | src/engine/ai.js:2897 |
| 3.3.6 | Idle thích ứng | 45s khi đầu ra ngắn (≤ 200 ký tự), 90s khi dài; reset mỗi mảnh; «no-cut»: câu đang chảy không bao giờ bị cắt theo thời gian — chỉ cắt khi stream chết thật | src/engine/ai.js:2893-2898 |
| 3.3.7 | Retry mạng | 1 lần, trước khi stream bắt đầu; lỗi khớp «Failed to fetch / NetworkError / Load failed»; nghỉ 800ms rồi thử lại | src/engine/ai.js:2901-2910 |
| 3.3.8 | HTTP 503 | fallback NGAY, không retry | src/engine/ai.js:2912-2916 |
| 3.3.9 | HTTP khác 200 | ném lỗi `HTTP <status>` + body cắt 140 ký tự | src/engine/ai.js:2917-2920 |
| 3.3.10 | Huỷ từ UI | AbortController khi đóng panel; tín hiệu người dùng gộp vào timer bằng `AbortSignal.any` | src/game/master-ui.js:105-106; src/engine/ai.js:2899 |

Ghi chú 1 dòng: comment tại src/engine/ai.js:2894 chốt nguyên tắc «NO-CUT — KHÔNG BAO GIỜ cắt câu trả lời» — đây là hợp đồng do người dùng yêu cầu; giữ nguyên khi có chỉnh timeout sau này.

> **Ai được phép dùng số này:** mục 02 và mục 14 TRỎ bảng 3.3; timeout và luật retry chỉ sống ở đây. — mục nào trỏ về đây: 02, 14

---

## 3.4 · Bảng rate limit (bảng 3.4)

Bảng này sở hữu mọi con số giới hạn tần suất của chuỗi AI và của site.

| # | Bề mặt | Giới hạn | Key/đếm | Dẫn chiếu |
|---|---|---|---|---|
| 3.4.1 | Mọi prefix proxy LLM (`/zai`, `/groq`, `/nvidia`, `/openai`, `/deepseek`, `/bigmodel`) | 30 call/phút/IP; quá → 429 + `Retry-After: 60` | KV `airl:<ip>:<phút>`, TTL 120s | worker/index.js:159-163 |
| 3.4.2 | Toàn site (trừ `/api/`, admin, `/assets/`, favicon) | 120 req/phút/IP; quá → 429 | KV `grl:<ip>:<phút>`, TTL 120s | worker/index.js:132-139 |
| 3.4.3 | `logEvent` (telemetry admin) | 30 event/phút/IP; quá hạn mức → drop âm thầm | KV `rl:<ip>:<phút>`, TTL 120s | worker/admin.js:168-172 |
| 3.4.4 | Mỗi backend của freeRoute | AbortController 90s tới headers rồi abort; stream sau headers không bị timer này | trong bộ nhớ worker | worker/index.js:69 |
| 3.4.5 | Tool-loop phía client | tối đa 6 step / 9 totalAttempts; cap không reset khi retry | bộ nhớ phiên | src/engine/ai.js:2790, 2778-2782 |

Chặn kèm — cùng lớp bảo vệ quota, không phải rate limit:

| # | Bề mặt | Hợp đồng | Dẫn chiếu |
|---|---|---|---|
| 3.4.6 | IP blacklist | KV `block:<ip>` = `'1'` → 403 | worker/index.js:107-112 |
| 3.4.7 | UA scraper | 403 trừ GOOD_BOT; chỉ áp main site, không áp `/api/` + admin | worker/index.js:124-129 |
| 3.4.8 | CORS allowlist | chỉ origin khớp `ALLOWED_ORIGINS` được qua; lệch → ghi đè về origin chuẩn | worker/index.js:29-32 |

> **Ai được phép dùng số này:** mục 02 và mục 14 TRỎ bảng 3.4 khi nói giới hạn; không mục nào chép lại 30/120/90/6/9. — mục nào trỏ về đây: 02, 14

---

## 3.5 · Bảng KV keys (bảng 3.5)

Bảng này sở hữu shape của mọi key KV mà chuỗi AI đụng tới. Store: `ADMIN_KV` của Cloudflare Worker.

| # | Key | Kiểu giá trị | Vai trò | Dẫn chiếu |
|---|---|---|---|---|
| 3.5.1 | `ai:config` | JSON `{ mode: 'off' \| 'free' \| 'custom', endpoint, apiKey, model, zaiKey, freePool[] }` | cấu hình AI; key server-side sống duy nhất ở đây | worker/admin.js:266-286 |
| 3.5.2 | Luật ghi `ai:config` | merge với config cũ; `body.disable` → xoá key, trả `{ mode: 'free' }` | admin AiConfigSet | worker/admin.js:275-280 |
| 3.5.3 | `ai:enabled` | null / `'1'` / `'true'` → bật; còn lại → tắt | kill-switch toàn cục AI (`isAiEnabled`); thiếu KV = bật | worker/admin.js:112-116; worker/index.js:165-167 |
| 3.5.4 | `ai:free_enabled` | cùng kiểu đọc | kill-switch riêng freeRoute (`isFreeAiEnabled`) | worker/admin.js:120-124; worker/index.js:175 |
| 3.5.5 | Đồng bộ mode `off` | đặt mode `off` trong `ai:config` ghi kèm `ai:enabled = '0'`; mode khác ghi `'1'` | tương thích kill-switch cũ | worker/admin.js:282-283 |
| 3.5.6 | `cnt:free_calls` / `cnt:free_ok` / `cnt:free_err` | số đếm cộng dồn | `logFreeUsage` ghi mỗi attempt backend | worker/admin.js:145-163 |
| 3.5.7 | `dayagg:<date>` | JSON tổng hợp theo ngày: `free_calls`, `free_err`; TTL theo `TTL_EVENT` | quota freeRoute theo ngày | worker/admin.js:145-163 |
| 3.5.8 | `free:log` | JSON log gần nhất, tối đa 200 dòng, mới nhất lên đầu | soi lỗi backend freeRoute | worker/admin.js:145-163 |
| 3.5.9 | `block:<ip>` | `'1'` = chặn | blacklist IP → 403 ngay đầu fetch | worker/index.js:107-112 |
| 3.5.10 | `grl:*` / `airl:*` / `rl:*` | đếm theo phút | rate limit — giá trị giới hạn ở bảng 3.4 | worker/index.js:132-139, 159-163; worker/admin.js:169-172 |
| 3.5.11 | Ngoài hợp đồng AI | `audit:log`, `cnt:feedback*`, `feedback:log` | telemetry khác — không thuộc sở hữu mục này | worker/admin.js:108-109, 132-139 |

Ghi chú hợp đồng 1 dòng: comment tại worker/index.js:63 là comment stale, KHÔNG phải hợp đồng — giá trị model đọc theo code (bảng 3.1); phân tích đầy đủ về comment stale này thuộc chủ sở hữu duy nhất của bộ: **xem mục 02 §3.4** (mục này không kể lại nội dung comment).

> **Ai được phép dùng số này:** mục 02 và mục 14 TRỎ bảng 3.5 khi nhắc key KV; shape key không được dựng lại chỗ khác. — mục nào trỏ về đây: 02, 14

---

## 3.6 · Bảng cache brief (bảng 3.6)

Bảng này sở hữu cache key của brief và mọi số liệu liên quan cache.

| # | Mặt hàng | Hợp đồng | Dẫn chiếu |
|---|---|---|---|
| 3.6.1 | Cache key hiện hành | lá số + ngày + gia đình: `year-month-day-hour-minute-gender` của lá số + năm/tháng/ngày hiện tại + chuỗi `_family` (mỗi người `role:date:time`) | src/engine/ai.js:169-170, 2721-2724 |
| 3.6.2 | Cấp cache | biến module `let _briefCache` — một bản cho cả phiên chạy | src/engine/ai.js:170 |
| 3.6.3 | Hiệu quả đo được | «212ms → 0ms sau lần đầu» | src/engine/ai.js:169-170, 2721-2724 |
| 3.6.4 | Comment stale về cỡ brief | comment tại src/engine/ai.js:169 ghi «16k brief», còn src/engine/ai.js:2897 ghi «brief 20K tokens» — hợp đồng của mục này dùng ~20K | src/engine/ai.js:169, 2897 |

### Phát hiện của bản thiết kế — persona ngoài cache key

Toàn đoạn dưới đây là **phát hiện của bản thiết kế**, KHÔNG có trong code hôm nay. Đừng đọc như thể code đã làm sẵn.

| # | Nội dung | Trạng thái |
|---|---|---|
| 3.6.5 (phát hiện) | `persona` hiện KHÔNG nằm trong cache key — ai.js:169-170 chỉ có lá số + ngày + gia đình. Hôm nay mọi persona dùng chung một bản brief cache. | Đo từ code |
| 3.6.6 (quy định mới) | Khi bật multi-persona: thêm `persona.id` vào key → công thức mới `lá số + ngày + gia đình + persona.id`. | Quy định — chưa có code |
| 3.6.7 (chỗ đứng) | Việc này đụng `src/engine/ai.js` — file đang nằm trong danh sách khóa của đợt này, không sửa code hôm nay; xếp vào G1 ở mục 15. | Điều phối |
| 3.6.8 (lý do chưa gấp) | Brief là dữ liệu lá số — không mang giọng persona; giọng persona nằm ở system messages (bảng 3.2). Dùng chung cache hiện tại chưa làm sai dữ liệu; chỉ là nợ kỹ thuật trước khi persona có dữ liệu riêng. | Lập luận thiết kế |

> **Ai được phép dùng số này:** mục 02 và mục 14 TRỎ bảng 3.6 khi nói cache; phát hiện 3.6.5-3.6.7 không được kể lại như code. — mục nào trỏ về đây: 02, 14 (+ mục 15 giữ G1 của dòng 3.6.7)

---

## 3.7 · Bảng khuôn tiết kiệm token (bảng 3.7 — mục này CHỦ SỞ HỮU các con số tiết kiệm)

Mục 14 khi nói tiết kiệm chỉ TRỎ bảng này; không chép số, không dựng lại khuôn.

| # | Khuôn | Cơ chế | Tiết kiệm cái gì | Dẫn chiếu |
|---|---|---|---|---|
| 3.7.1 | Brief cache | cache theo key bảng 3.6 — hợp đồng key và hiệu quả đo được thuộc trọn bảng 3.6 (3.6.1/3.6.3), không lặp số ở đây | không rebuild brief mỗi tin nhắn | bảng 3.6 (mục này chỉ trỏ) |
| 3.7.2 | Section-RAG | chỉ gửi section khớp keyword của câu hỏi; chỉ nhận subset khi subset < 60% brief đầy đủ, ngược lại gửi full | câu hẹp không kéo cả brief | src/engine/ai.js:2318-2384, 2726-2736 |
| 3.7.3 | Synthesis dùng FULL brief | câu tổng hợp bypass RAG → gửi FULL brief + MASTER_SYNTHESIS_GUIDE, KHÔNG gọi tool | đổi token lấy đúng 1 round | src/engine/ai.js:2389-2411, 2732-2736 |
| 3.7.4 | Trivial tool-free | câu ≤ 3 từ không có topic keyword → 1 round không tool | bỏ cả tool-loop | src/engine/ai.js:2417-2426, 2776 |
| 3.7.5 | Tools ẩn khi synthesis | `toolsOn = !_isTrivial && !_isSynthesis` | payload nhỏ hơn + tuân luật guide | src/engine/ai.js:2776 |
| 3.7.6 | Chưa tính riêng trong ước lượng | brainThink append vào brief làm tăng token; chưa có dòng riêng trong bảng 3.7b | ghi nhận, chưa đo | src/engine/ai.js:2740-2741 |

### Ước lượng token 1 lượt (bảng 3.7b)

Số đo sẵn duy nhất: brief ~20K token. Mọi dòng còn lại là **ước lượng của bản thiết kế** — chưa đo thực tế.

| Thành phần | Ước lượng | Tính chất |
|---|---|---|
| Brief đầy đủ (lượt synthesis) | ~20.000 token | đo sẵn |
| Brief sau RAG (câu hẹp/trivial) | ~6.000 token | ước lượng của bản thiết kế (~30% brief) |
| 3 system messages (SYSTEM_PROMPT + brief-guide + style) | ~1.500 token | ước lượng của bản thiết kế |
| Persona (khi multi-persona — G1 mục 15) | + ~500 token | ước lượng của bản thiết kế |
| History ≤ 8 lượt | ~3.000 token | ước lượng của bản thiết kế |
| Câu trả lời (stream ra) | ~800 token | ước lượng của bản thiết kế |
| **Tổng lượt hẹp/trivial (chưa tính persona)** | **~11.300 token** | cộng hàng |
| **Tổng lượt synthesis (chưa tính persona)** | **~25.300 token** | cộng hàng |

### Pseudo-code `estimateTokens(q, persona)`

```js
// estimateTokens(q, persona) — pseudo-code ước lượng của bản thiết kế.
// Mục 03 là chủ sở hữu con số này. Số đo sẵn duy nhất: BRIEF_FULL ~20K token
// (src/engine/ai.js:169-170, 2897). Các hệ số còn lại là ƯỚC LƯỢNG — chưa đo thực tế.
function estimateTokens(q, persona) {
  const BRIEF_FULL = 20000;               // đo sẵn — lượt synthesis gửi FULL brief
  const BRIEF_RAG  = 6000;                // ước lượng: ~30% brief qua Section-RAG
  const SYSTEMS    = 1500;                // ước lượng: 3 system messages (bảng 3.2)
  const PERSONA    = persona ? 500 : 0;   // ước lượng: chỉ khi multi-persona (G1 mục 15)
  const HISTORY    = 3000;                // ước lượng: history.slice(-8) (ai.js:2751)
  const ANSWER     = 800;                 // ước lượng: một câu trả lời stream
  const base  = SYSTEMS + PERSONA + HISTORY + ANSWER;
  const brief = isSynthesis(q) ? BRIEF_FULL : BRIEF_RAG; // trivial vẫn đi RAG; chỉ bỏ tools (ai.js:2776)
  return base + brief;
}
// Lượt hẹp/trivial: ~11.300 token · Lượt synthesis: ~25.300 token · Persona: + ~500
```

> **Ai được phép dùng số này:** mục 14 khi nói tiết kiệm chỉ TRỎ bảng 3.7 + 3.7b; mục 02 TRỎ khi cần hợp đồng số. Không mục nào chép lại ước lượng. — mục nào trỏ về đây: 02, 14

---

## 3.8 · Bảng tra cứu nhanh 1 dòng (bảng 3.8)

Bảng này là bản bấm nhanh của cả mục. Mỗi dòng dẫn về bảng gốc — bảng gốc vẫn là nơi duy nhất chứa hợp đồng đầy đủ.

| Số liệu | Giá trị | Trỏ về |
|---|---|---|
| Preset mặc định | `/zai/api/paas/v4` + `glm-5.3` | bảng 3.1 · 3.1.1 |
| CORS-block gọi thẳng | migrate ép về `/zai` | bảng 3.1 · 3.1.3 |
| `isAIReady` proxy | `/` = key server-side | bảng 3.1 · 3.1.4 |
| Capacitor native | `https://battu.god8.shop` | bảng 3.1 · 3.1.5 |
| Key mask admin | `'***'` + 4 số cuối | bảng 3.1 · 3.1.13 |
| `temperature` / `stream` | `0.55` / `true` | bảng 3.2 · 3.2.4-5 |
| `thinking` | chỉ Z.ai/BigModel native, trừ nvidia | bảng 3.2 · 3.2.6 |
| `tools` / `tool_choice` | 38 tool / `'auto'`; ẩn khi trivial + synthesis | bảng 3.2 · 3.2.7-8 |
| history | ≤ 8 lượt | bảng 3.2 · 3.2.9 |
| SSE mapping | `delta.content` → onToken; `tool_calls` theo index; reasoning = stage-label Việt | bảng 3.3 · 3.3.2-4 |
| TTFT / idle | 75s / 45-90s «no-cut» | bảng 3.3 · 3.3.5-6 |
| Retry mạng | 1 lần | bảng 3.3 · 3.3.7 |
| HTTP 503 | fallback ngay, không retry | bảng 3.3 · 3.3.8 |
| Rate limit AI | 30 call/phút/IP, key `airl:` | bảng 3.4 · 3.4.1 |
| Rate limit site | 120 req/phút/IP, key `grl:` | bảng 3.4 · 3.4.2 |
| logEvent | 30/phút/IP | bảng 3.4 · 3.4.3 |
| freeRoute backend | 90s tới headers | bảng 3.4 · 3.4.4 |
| Tool-loop | 6 step / 9 attempts | bảng 3.4 · 3.4.5 |
| `ai:config` | mode off/free/custom + endpoint + apiKey + model + zaiKey + freePool[] | bảng 3.5 · 3.5.1 |
| Kill-switch | `ai:enabled`, `ai:free_enabled`; mode `off` đồng bộ | bảng 3.5 · 3.5.3-5 |
| Telemetry free | `cnt:free_calls/ok/err`; `dayagg:<date>`; `free:log` 200 dòng | bảng 3.5 · 3.5.6-8 |
| `block:<ip>` | `'1'` → 403 | bảng 3.5 · 3.5.9 |
| Cache key | lá số + ngày + gia đình; persona chưa trong key (phát hiện → G1 mục 15) | bảng 3.6 · 3.6.1, 3.6.5-7 |
| Token 1 lượt | hẹp ~11.300 · synthesis ~25.300 (ước lượng; brief ~20K là số đo) | bảng 3.7b |

> **Ai được phép dùng số này:** mục 02 và mục 14 TRỎ bảng 3.8 khi cần tra 1 dòng; muốn hợp đồng đầy đủ thì trỏ bảng gốc. — mục nào trỏ về đây: 02, 14

---

## Chốt mục

Hợp đồng đã đóng: 8 bảng, mỗi bảng một nhóm số liệu, mỗi số một chỗ sống. Mục khác cần số → trỏ bảng; cần luồng → mục 02; cần tiết kiệm → bảng 3.7; cần G1 cache-persona → mục 15.

| Đi từ đâu | Đến đâu |
|---|---|
| Mục 02 kể luồng | cần số nào → trỏ bảng tương ứng ở mục 03 |
| Mục 14 nói tiết kiệm | chỉ trỏ bảng 3.7 + 3.7b |
| Mục 15 mở khóa ai.js | nhận G1 «thêm persona.id vào cache key» (bảng 3.6 · 3.6.6-3.6.7) |

— mục nào trỏ về đây: 02, 14
