# 02 · Kiến trúc chuỗi AI dùng nguyên trạng — bản đồ luồng 3 tầng (số hợp đồng ở mục 03)

> **Tóm tắt.** Chuỗi AI của Huyền Quán dùng NGUYÊN TRẠNG, không dựng lại: (1) engine `src/engine/ai.js` tự dựng chart-brief chống hallucinate, chạy Section-RAG, tool loop 38 tools và stream có chính sách «no-cut»; (2) gateway Cloudflare Worker đứng sau proxy `/zai`, chọn nhánh key custom hoặc freeRoute nhiều backend; (3) game gọi qua `master-ui.js` lazy-load, gộp token theo khung hình, tự chấm Neo và gợi follow-up. Mục này chỉ vẽ **bản đồ luồng** — mọi số hợp đồng (preset/endpoint, body, stream format, TTFT/idle, rate limit, KV) là tài sản của **mục 03**. Điểm cắm PERSONA duy nhất nằm trong mảng messages ở `ai.js:2747-2753`.

## 0. Phân vai chốt của mục này (chống trùng mục 03)

Mục này là **bản đồ luồng**: nó trả lời «dữ liệu và lệnh chảy theo đường nào, qua mấy cửa, sai thì đi đường nào», không trả lời «cửa đó mở bao nhiêu lần một phút». Quy tắc đọc bắt buộc:

- Chỗ nào xuất hiện **số hợp đồng** — preset/endpoint, trường body, định dạng stream, mốc TTFT/idle, rate limit, tên KV — bản đồ chỉ ghi «(bảng ở mục 03)» và **không nhắc lại file:line của số đó**. Đọc số thì qua mục 03, đọc luồng thì ở đây.
- Những số **tính chất luồng** vẫn giữ nguyên ở đây vì chúng định hình kiến trúc: brief ~33 section ~20K token, cache «212ms→0ms», 38 tools, vòng tool loop 6 step / 9 attempts, câu trivial ≤3 từ, `history.slice(-8)`, trạng thái 503/413.
- Traps đã ghi nhận và tôn trọng xuyên suốt: **không** đề xuất AI server riêng, không thay worker, không thêm endpoint; **thinking chỉ bật trên host native Z.ai/BigModel và loại trừ nvidia**; comment stale glm chỉ được nêu **một lần duy nhất ở mục này** (xem §3.4); không lặp số TTFT/limit đã ghi ở mục 03.

## 1. Sơ đồ tổng thể ba tầng

Số tầng theo hợp đồng tài liệu: **tầng 1 = engine ai.js, tầng 2 = gateway worker, tầng 3 = game master-ui**. Chiều gọi thật sự chạy ngược số thứ tự: người chơi → game → engine → worker → nhà cung cấp model. Hộp nét đứt là lớp có bảng hợp đồng ở mục 03, bản đồ chỉ vẽ trình tự:

```
   NGƯỜI CHƠI (bấm 🎙 Hỏi Thầy / Nghe Thầy luận án)
        │
┌───────▼──────────────────────────────────────────────────────────┐
│ TẦNG 3 — GAME (src/game)                                          │
│  gate FEATURES.ai = !IOS  (features.js:20)                        │
│   · stations.js:119 · case-ui.js:239/373/460/509                  │
│   · que-ui.js:191 · vanmenh-ui.js:46                              │
│  case-ui.js:252 lazy-import './master-ui.js'                      │
│  master-ui.js:48-51 lazy load ai.js + neo-checker (có retry)      │
│  master-ui.js:65 askAI(...) · 69-72 rAF gộp token                 │
│  64 AbortController · 105-106 MutationObserver huỷ khi đóng panel │
│  77 history.push · 80-87 checkNeo 🎯/⚠ · 90-93 suggestFollowups   │
└───────┬──────────────────────────────────────────────────────────┘
        │ gọi hàm trong cùng bundle (không qua mạng)
┌───────▼──────────────────────────────────────────────────────────┐
│ TẦNG 1 — ENGINE (src/engine/ai.js — chunk 'engine-ai' riêng,      │
│           vite.config.js:94-96; dev proxy /zai vite.config.js:73) │
│  getConfig/migrate (176, 199-238) → isAIReady (243-249)           │
│  buildChartBrief ~33 section ~20K token (254-1079)                │
│  brief cache «212ms→0ms» (169-170, 2721-2724)                     │
│  Section-RAG (2318-2332, 2334-2384) · bypass tổng hợp (2389-2411) │
│  brainThink (2740-2741) · chuỗi messages 3 system (2747-2753)     │
│  tool loop 6 step/9 attempts (2790) · 38 tools (1409-1639,        │
│  1660-2231+) · streamRound no-cut (2892-2983)                     │
│  leo thang lỗi → localFallback nlg.js (2705-2720)                 │
└───────┬──────────────────────────────────────────────────────────┘
        │ fetch POST '/zai/…/chat/completions'  (preset + body: bảng ở mục 03)
┌───────▼──────────────────────────────────────────────────────────┐
│ TẦNG 2 — GATEWAY (worker/index.js)                                │
│  ▓▓ lớp chặn: blacklist IP → UA → rate toàn site → rate AI →      │
│     kill-switch   (trình tự như trên; BẢNG NGƯỠNG + TÊN KV ở      │
│     mục 03 — bản đồ chỉ vẽ luồng)                                 │
│  route /zai (170-183):                                            │
│   có apiKey custom → inject Authorization → makeProxy (179-182)   │
│   không key  → isFreeAiEnabled → freeRoute (175-176)              │
│  freeRoute (52-96): z.ai-paid primary stripTools:false (63-64)    │
│      → freePool stripTools:true tránh 413 (62, 79)                │
│      → fail thử backend kế (89-92) → hết → 503 (95)               │
└───────┬──────────────────────────────────────────────────────────┘
        │ HTTPS tới backend thật (endpoint/model/key: bảng ở mục 03)
        ▼
   NHÀ CUNG CẤP MODEL (stream SSE trả về, passthrough không tee — 82-87)
```

Ba tầng có ranh giới rõ: tầng 3 **không biết** gì về model hay key; tầng 1 **không giữ** key nào (endpoint bắt đầu bằng `/` được coi là proxy có key server-side — `ai.js:243-249`); tầng 2 là nơi duy nhất chạm key (đọc từ KV cấu hình AI — tên KV ở bảng mục 03; `worker/index.js:173`). Trong build Capacitor native, đường `/...` được resolve sang host production thật (`ai.js:2851-2854`) — cơ chế resolve là luồng, giá trị host là hợp đồng của mục 03.

## 2. Tầng 1 — engine ai.js: bộ não dựng brief và chạy tool loop

### 2.1 Cổng vào: cấu hình client và isAIReady

Mỗi lượt hỏi bắt đầu bằng config: `getConfig()` đọc kho cấu hình cục bộ của trình duyệt (tên kho ở mục 03), tự migrate/heal về preset mặc định zai-proxy + model phù hợp (`ai.js:176`, `199-238` — chi tiết preset ở mục 03). Quyết định sống chết của chuỗi là `isAIReady` (`ai.js:243-249`): endpoint bắt đầu bằng `/` được hiểu là proxy có key nhúng server-side nên **không đòi apiKey**; config nào chỉ vào host ngoài mà thiếu key thì rớt cổng này. Rớt cổng → rẽ nhánh **fallback cục bộ ngay lập tức**: `localFallback` ghép `composeAnswer` từ `nlg.js` thành khối lead + bullet, kèm dòng nhắc mở Cài đặt (`ai.js:2711-2719`). Đây là lý do «game chạy trọn khi AI tắt» thành luật thiết kế (K1/K2 của 06-01 §2): dòng `source:'local'` là nhánh bình thường, không phải lỗi.

### 2.2 buildChartBrief: nền dữ liệu chống hallucinate

Trái tim của tầng 1 là `buildChartBrief(R)` (`ai.js:254-1079`) — một văn bản tiếng Việt ~33 section, ~20K token, dựng **từ lá số ĐÃ TÍNH ĐÚNG** của `chart.js › analyze()`, tuyệt đối không sinh công thức bói mới. Các mỏ neo chống hallucinate nằm ngay đầu hàm và mở suốt chiều dài brief:

- **THỜI GIAN HIỆN TẠI** neo năm/tháng hôm nay (`ai.js:258-265`): brief ghi rõ năm dương/âm, can-chi năm và tháng hiện tại — để model không mặc định vẽ nên năm cũ. Đây là lớp chống hallucinate năm đầu tiên và cứng nhất.
- **DAILY BRIEFING**: trạng thái hôm nay được tính trước, model chỉ đọc.
- **Tứ trụ · vượng suy · ngũ hành · cách cục · 格局成败救应 · Dụng-Hỷ-KỴ-Thù**: toàn bộ «bệnh và thuốc» của lá số đã có trong brief; model bị cấm suy luận ngoài dữ kiện này (rule 13-14 trong SYSTEM_PROMPT — nội dung bảng ở mục 03).
- **Đại vận · lưu niên · ứng kỳ**: mọi nhận định thời điểm phải dẫn được về mốc trong brief.
- **Kiến thức cổ pháp crawl + hành vi học anti-Barnum**: brief mang theo lớp đối chiếu cổ thư và lớp «cấm câu chung chung đúng với mọi người» — chống Barnum không phải bằng lời dặn suông mà bằng dữ kiện cụ thể kèm sẵn.

Ý nghĩa kiến trúc: tầng 1 **hoá rắn** phần tư duy rủi ro nhất (tính lá số, đối chiếu cổ pháp) thành dữ liệu text có thể cache, có thể RAG, có thể audit; model chỉ còn việc diễn giải. Mọi cải tiến chất lượng NPC-AI về sau đều phải đi qua brief, không đi qua prompt «dặn model cẩn thận hơn».

### 2.3 Brief cache: «212ms→0ms»

Dựng brief tốn công thật nên có cache theo khoá lá số + ngày hôm nay + gia đình (`ai.js:2721-2724`): khoá gồm năm/tháng/ngày/giờ/phút sinh, giới tính, năm-tháng-ngày hiện tại và chuỗi `_family` — người chơi đổi bất kỳ thứ nào (kể cả qua một ngày) là khoá đổi, brief dựng lại. Hiệu ứng được ghi ngay tại nguồn: «212ms → 0ms sau lần đầu» (`ai.js:169-170`). Chi tiết hợp đồng cache (khoá, TTL, phạm vi) là bảng ở mục 03; bản đồ chỉ chốt: **cache nằm trước RAG**, mọi tầng sau (RAG, brainThink, messages) ăn bản brief đã cache.

### 2.4 Section-RAG: chỉ gửi phần liên quan

Brief nguyên bản ~20K token không gửi dàn trải cho mọi câu. `_splitBrief` cắt văn bản theo header section thành mảnh (`ai.js:2318-2332`); `_selectRelevantSections` map keyword câu hỏi → section tương ứng (`ai.js:2334-2384`). Nếu tổng chiều dài các section chọn được **nhỏ hơn 60%** brief gốc thì chỉ subset được gửi; nếu lọc ra vẫn gần bằng cả brief thì gửi nguyên bản (`ai.js:2729-2736`). Con số 60% là ngưỡng luồng (chọn khối nhỏ hơn mới lọc) — không phải ngưỡng hợp đồng network; giữ ở đây vì nó quyết định hình dạng dữ liệu đi vào messages.

### 2.5 Phân loại câu hỏi: tổng hợp · hẹp · trivial

Trước khi ghép messages, câu hỏi được định tuyến theo ba nhánh (`ai.js:2729`, `2776`):

1. **Câu tổng hợp** (`_isSynthesisQuestion`, `ai.js:2389-2411`): câu kiểu «tổng quan lá số tôi ra sao». Nhánh này **bypass RAG** — gửi FULL brief, vì RAG lọc sẽ xé mất bức tranh toàn cảnh (`ai.js:2727-2728`, `2732-2733`) — và ghép `MASTER_SYNTHESIS_GUIDE`, khung trả lời 体→用→应期 cấm gọi tool (`ai.js:2430-2455`). Tools cũng bị tắt cứng để bảo đảm tuân thủ (`ai.js:2773-2776`).
2. **Câu hẹp**: nhận Section-RAG; guide chuyển sang bản «trả lời trực tiếp từ context, CHỈ gọi tool khi…» với sáu tình huống được phép gọi (ngày cụ thể, năm cụ thể, quẻ, người thân, hướng, giờ tốt — `ai.js:2743-2745`).
3. **Câu trivial ≤3 từ** (`_isTrivial`, `ai.js:2417-2426`): «ok», «cảm ơn», «chào thầy» — tool-free một round, không đốt token gọi tool vô nghĩa.

Bản đồ ghi nhớ trật tự phán đoán: trivial → tổng hợp → hẹp; trật tự này là hành vi của code (`ai.js:2776`), không phải cấu hình.

### 2.6 brainThink: suy luận deterministic bổ sung

Sau RAG, `brainThink(question, chart, R, gender)` chạy đồ thị suy luận question-aware **trên máy người chơi**, toàn bộ trong try/catch để hỏng cũng không cản luồng (`ai.js:2739-2741`). Kết quả được **nối thêm** vào brief dưới dòng phân cách `--- NÃO (QUESTION-AWARE GRAPH) ---` — tính additive, không ghi đè dữ liệu gốc. Cùng một nguyên tắc với toàn chuỗi: cái máy tính chắc chắn thì máy tính trước, model diễn giải sau.

### 2.7 Chuỗi messages: THỨ TỰ là hợp đồng kiến trúc

Mảng messages tại `ai.js:2747-2753` — **đây là chỗ cắm PERSONA, xem §5**:

```js
// ai.js:2747-2753 — thứ tự system message KHÔNG được đảo
const messages = [
  { role: 'system', content: (MODE === 'ios' ? RESEARCH_SYSTEM_PROMPT : SYSTEM_PROMPT) }, // 2748
  { role: 'system', content: brief + '\n\n' + _guide + '\n\n' + _ANTI_MANIP_GUIDE },      // 2749
  // ← ĐIỂM CẮM PERSONA: chèn 1 system message TẠI ĐÂY (giữa 2749 và 2750)
  { role: 'system', content: (STYLE_DIRECTIVES[style] || STYLE_DIRECTIVES['gan-guoi']) + reminder }, // 2750
  ...((history || []).slice(-8)),   // 2751 — chỉ giữ 8 cặp lượt gần nhất
  { role: 'user',   content: question },                                                  // 2752
];
```

Thứ tự ba system, cùng ý nghĩa kiến trúc của từng lớp:

1. **SYSTEM_PROMPT** (`ai.js:2748`): persona «ông thầy phong thuỷ thực chiến» + 25 rule đánh số liên tục, trong đó rule-10 khoá chính tả tiếng Việt (ba loại lỗi cấm lấy từ lỗi người dùng thật — «CỤ THỈL», «tinh bốt», «refinery») và rule 8-10 neo thời gian hiện tại. Bản iOS dùng `RESEARCH_SYSTEM_PROMPT` qua cờ `import.meta.env.MODE` **trên cùng một dòng** `ai.js:2748` — tức iOS không tắt AI bằng prompt mà bằng gate ở tầng 3; prompt research chỉ là lớp phòng hờ. **Nội dung từng bảng prompt là tài sản mục 03.**
2. **System 2 — dữ liệu + chống thao túng** (`ai.js:2749`): brief (đã RAG/brainThink) + guide phân nhánh (§2.5) + `_ANTI_MANIP_GUIDE`. Guide chống thao túng được **build static đúng một lần** lúc nạp module bằng IIFE ghép từ `anti-manipulation-data.js` (`ai.js:146-167`): các nhóm grounding (mọi kết luận phải neo 1 indicator có tên), persona «thầy» độc lập không nịnh, premise→indicator (tiền đề user nhúng vào phải được restate bằng indicator thật trước khi luận), detection, escalation ladder, refusal boundary hẹp, và mục «không over-refuse». Chi tiết từng nhóm là bảng ở mục 03; kiến trúc chốt: đây là **một system message hợp nhất**, không phải nhiều message rời.
3. **System 3 — STYLE** (`ai.js:2750`): `STYLE_DIRECTIVES[style]` với mặc định `'gan-guoi'` — game master-ui không truyền style nên luôn rơi vào mặc định. Bốn kiểu style và nội dung bảng ở mục 07 §7.4.2.
4. **history.slice(-8)** (`ai.js:2751`): bộ nhớ hội thoại chỉ giữ 8 cặp gần nhất — trần trí nhớ của NPC-AI, quyết định bởi mảng cắt này.
5. **User question** (`ai.js:2752`).

Đọc thứ tự trên theo trục ưu tiên: **an toàn (system 1 + anti-manip) đứng trước, persona chèn giữa, style đứng cuối** — thứ tự này chính là cơ chế bảo đảm «an toàn > persona > style» ở §5.3, không cần thêm cơ chế nào khác.

### 2.8 Vòng tool loop với 38 tools

Body request do `buildBody` ghép (`ai.js:2764-2768`): các trường body (model, temperature, stream, thinking, tools) là **bảng ở mục 03**. Hai quyết định kiến trúc trong hàm này giữ nguyên vẹn ở bản đồ:

- **thinking chỉ bật trên host native Z.ai/BigModel** (`ai.js:2761-2766`): cờ `isZaiNative` nhận diện theo **host endpoint + tên model** (pattern `glm|z.ai|bigmodel`), loại trừ proxy CF và **loại trừ nvidia**. Bài học ghi trong comment nguồn (`ai.js:2758-2760`): param `thinking` là bản địa Z.ai/BigModel, gửi nhầm cho host khác là 400 — vì vậy nhận diện theo host, không theo chữ «glm» trong tên model. Mọi thiết kế NPC-AI không được tự bật thinking ngoài nhánh này.
- **tools đi kèm `tool_choice:'auto'`** và bị tắt cứng cho câu trivial/tổng hợp (`ai.js:2776`) — mục 2.5 đã nêu.

Vòng lặp tại `ai.js:2790`: **tối đa 6 step, tổng 9 attempts, không reset** — hard cap sinh ra từ bài học latency (comment `ai.js:2778-2782`: không có total cap thì loop chạy tới vài phút). Cơ chế một vòng:

1. Gọi `streamRound` (`ai.js:2797`).
2. Nếu round trả về `toolCalls` và tools còn bật (`ai.js:2808`): push assistant message kèm `tool_calls`; với mỗi call, parse args JSON (hỏng thì dùng `{}` — `ai.js:2815`), gọi `execTool(tc.name, args, R)` (`ai.js:2818`), push result với `role:'tool'` kèm `tool_call_id` (`ai.js:2819`), rồi `continue` — model luận tiếp với kết quả tool, interleaved thinking (`ai.js:2821`).
3. Nếu content rỗng (`ai.js:2824-2828`): leo thang — tắt tools thử lại → tắt thinking thử lại → ném lỗi.
4. Có content → trả `{source:'ai', text, meta}` với telemetry rounds/totalMs/detail (`ai.js:2830-2831`).

**execTool và 38 tools**: định nghĩa tool nằm trong `AI_TOOLS` (`ai.js:1409-1639`), dispatch bằng case-switch khổng lồ `ai.js:1660-2231+` (số 38 đã kiểm phiên duyệt). Lớp da của dispatch là validate required args trả **error tiếng Việt sạch** (`ai.js:1651-1657`) — model không bao giờ nhận stack trace thô; kết quả được trim bằng `_s()` chống phình context. Tool đặc biệt `log_error` POST `/api/log-error` để ghi nhận cấu trúc khi AI nhận ra mình luận sai sau khi người dùng sửa (`ai.js:1937-1941`) — kênh phản hồi tới admin, không phải kênh tới người chơi.

### 2.9 streamRound: no-cut, leo thang lỗi, 503

`streamRound` (`ai.js:2892-2983`) là hàm duy nhất chạm mạng trong tầng 1. Hợp đồng stream (SSE, delta.content → onToken, delta.tool_calls tích luỹ theo index, `reasoning_content` bị bỏ qua và chỉ thay bằng stage-label tiếng Việt — không lộ chữ Hán raw) là **bảng ở mục 03**; bản đồ chốt ba hành vi:

- **«No-cut» — chỉ cắt khi stream chết thật** (`ai.js:2892-2899`): bộ đếm thời gian gồm một mốc đợi token đầu và một mốc idle adaptive tự reset mỗi chunk; câu đang chảy đều **không bao giờ** bị cắt bởi tổng thời gian (comment nguồn ghi rõ yêu cầu «KHÔNG BAO GIỜ cắt câu trả lời» — `ai.js:2791-2794`). Giá trị các mốc (TTFT/idle) là bảng ở mục 03.
- **Retry mạng đúng một lần, trước khi stream bắt đầu** (`ai.js:2901-2910`): lỗi kiểu fetch fail trong lần thử đầu → đợi ngắn rồi thử lại; từ lần thứ hai trở đi ném lỗi cho leo thang.
- **503 từ worker = AI bị admin tắt → fallback NGAY, không retry** (`ai.js:2912-2916` đặt cờ `aiDisabled`, `ai.js:2801` chặn retry ngay đầu vòng): đây là tín hiệu hạt trạng thái từ tầng 2, retry chỉ phí. Lỗi HTTP khác → ném kèm đoạn text 140 ký tự đầu (`ai.js:2917-2920`). Một lỗi nền từng bị vá: `toolCalls` phải khởi tạo `[]` — từng có bản seed nhầm bằng định nghĩa tool `log_error` khiến mọi text-answer bị đọc là tool-call, loop chạy tới cap (`ai.js:2924-2928`).

**Leo thang lỗi tổng** quanh `askAI` (`ai.js:2705-2720` + vòng try `ai.js:2789-2833`): lỗi trong round → tắt tools thử lại (`ai.js:2802`); vẫn lỗi → ném ra ngoài; `aiDisabled` thì không leo thang, fallback ngay. Khi cháy cap 9 attempts, `_bail` (`ai.js:2783-2788`, `2833`) **giữ phần assistant cuối cùng đã stream được** thay vì trả trắng, kèm ghi chú lý do. Abort do **user** (signal đã aborted) được propagate nguyên vẹn; abort do hệ thống thì hạ xuống `localFallback` (`ai.js:2834-2839`). Đường cuối cùng của tầng 1 luôn là một câu trả lời: AI hoặc local, không bao giờ màn hình trắng.

## 3. Tầng 2 — gateway worker: route /zai và freeRoute

### 3.1 Bốn lớp chặn trước — chỉ vẽ trình tự

Trước khi request chạm route LLM, worker rà theo thứ tự: blacklist IP → chặn UA scraper trừ GOOD_BOT → rate-limit toàn site → rate-limit riêng nhóm prefix AI → kill-switch bật/tắt AI toàn hệ thống (`worker/index.js` khối fetch, thứ tự như sơ đồ §1). **Mọi ngưỡng số, tên KV, hành vi 403/429 của bốn lớp này là bảng ở mục 03** — bản đồ không lặp lại số, chỉ khẳng định: bốn lớp chạy **trước** route `/zai`, tức cả nhánh key custom lẫn nhánh free đều chịu cùng hàng rào; kill-switch là chốt cuối — tắt ở đây thì mọi preset client đều nhận 503.

### 3.2 Route /zai: hai nhánh (`worker/index.js:170-183`)

```js
// worker/index.js:170-183 — rút gọn giữ nguyên luồng
if (prefix === '/zai') {
  let adminKey = null, aiCfg = {};
  try { aiCfg = JSON.parse((await env.ADMIN_KV.get(KV_AI_CONFIG)) || '{}'); adminKey = aiCfg.apiKey || null; } catch (e) {} // tên KV: bảng ở mục 03
  if (!adminKey) {
    if (!(await isFreeAiEnabled(env))) return 503 'Model free đang bị TẮT.';  // kill-switch thứ hai (175)
    return await freeRoute(request, env, ctx, ip, aiCfg);                     // (176)
  }
  // nhánh key custom: forward thẳng kèm Authorization Bearer (179-182)
  const headers = new Headers(request.headers);
  if (!headers.get('Authorization') && adminKey) headers.set('Authorization', `Bearer ${adminKey}`);
  return makeProxy(host)({ request, params, env });
}
```

- **Nhánh key custom**: admin đặt key riêng → worker **inject Authorization server-side** rồi forward thẳng bằng `makeProxy` (`worker/index.js:179-182`). Key không bao giờ xuống client; client chỉ thấy endpoint `/zai/...`.
- **Nhánh free**: không có key custom → hỏi kill-switch free (`worker/index.js:175`) → rẽ `freeRoute` (`176`).

### 3.3 freeRoute: thứ tự backend là hợp đồng kiến trúc (`worker/index.js:52-96`)

freeRoute dựng danh sách backend theo **thứ tự cố định** (`worker/index.js:64`): **z.ai-paid đứng trước, freePool đứng sau** — pool chỉ là fallback khi z.ai fail; thứ tự này là bài học được ghi trong comment nguồn (`worker/index.js:59-61`: từng có bản Groq đứng đầu pool, key chết làm mọi request fail trước khi tới z.ai).

| Backend | Nguồn cấu hình | stripTools | Vì sao |
|---|---|---|---|
| z.ai-paid (primary) | zaiKey của admin trong KV cấu hình AI (tên KV ở mục 03) | `false` (`worker/index.js:63-64`) | giữ nguyên tool-use đầy đủ |
| freePool (Groq/NVIDIA…) | mảng freePool trong cùng KV, lọc còn entry đủ endpoint/model/key (`worker/index.js:58`) | `true` (`worker/index.js:62`, xóa `tools`+`tool_choice` tại `79`) | payload tools lớn → HTTP **413** trên các host free |

Chiều chạy mỗi backend (`worker/index.js:65-93`): AbortController **riêng cho từng backend** với mốc thời hạn tới headers (số ở bảng mục 03 — `worker/index.js:68-69`); đè `model` của backend vào body (`71`); status 200 + có body → **trả response TRỰC TIẾP passthrough SSE, không tee** (`worker/index.js:82-87` — bản tee server-side từng gây backpressure làm đứt stream, đã bỏ theo `84-86`); ngược lại → log usage và **thử backend kế** (`89-92`). Hết danh sách → 503 với thông điệp tiếng Việt gợi admin thêm key (`worker/index.js:95`). Mỗi attempt đều ghi telemetry usage qua `logFreeUsage` (bộ đếm/log của admin — chi tiết KV telemetry ở mục 03).

Hệ quả kiến trúc phải ghi vào mọi thiết kế NPC-AI: **khi z.ai fail và rơi xuống pool, 38 tools mất sạch** (stripTools:true) — tool loop của tầng 1 sẽ không nhận tool-call nào, model chỉ luận từ brief. Tức là câu hẹp đòi ngày cụ thể sẽ yếu đi trên nhánh pool; chấp nhận đánh đổi này, không «vá» bằng cách thêm endpoint hay server trung gian.

### 3.4 Comment stale glm — chủ sở hữu duy nhất của mục này

`worker/index.js:63-64` chứa một **comment stale duy nhất trong chuỗi**: comment inline ghi `[SPEED] glm-5.2→glm-5.3-flash`, nhưng code thật sự chạy là `model: 'glm-5.3'` — ai đọc comment sẽ hiểu nhầm model flash; code là nguồn sự thật. Bản đồ này là **chủ sở hữu duy nhất** của ghi chú này trong toàn bộ tài liệu; các mục khác khi cần chỉ trỏ «xem §3.4 của mục 02», không nêu lại. Hành động kế tiếp (sửa comment, không sửa code) thuộc việc dọn dẹp bên ngoài phạm vi bản đồ.

### 3.5 Khi worker trả 503 về tầng 1

503 có hai nguồn: kill-switch AI (`worker/index.js:165-167`) và kill-switch free (`175`) — cùng một hành vi phía client: tầng 1 nhận 503 → `aiDisabled` → **fallback `localFallback` NGAY, không retry** (§2.9). Nhờ đó «admin tắt AI» không phá màn hình: người chơi vẫn nhận khối luận cục bộ với dòng trạng thái «Luận cục bộ (chưa kết nối máy chủ AI)» từ tầng 3 (`master-ui.js:86`).

## 4. Tầng 3 — game master-ui: cổng người chơi nhìn thấy

### 4.1 Gate FEATURES.ai — một cờ, mọi cửa vào

`FEATURES.ai = !IOS` (`src/game/features.js:20`) là cổng duy nhất của tầng 3; iOS (vi phạm 4.3b App Store) tắt AI hoàn toàn. Sáu cửa vào đều đọc cùng cờ, không có cửa nào tự quyết:

| Cửa vào | Vị trí | Hình thức gate |
|---|---|---|
| Bàn Thầy (station) | `stations.js:119` | nút 🎙 «Hỏi Thầy về lá số này» chỉ render khi bật |
| Kết án (case) | `case-ui.js:239` | nút 🎙 «Nghe Thầy luận án này» |
| Trạch Nhật | `case-ui.js:373` | nút 🎙 «Hỏi Thầy về ngày này» |
| Dương Trạch | `case-ui.js:460` | nút 🎙 «Hỏi Thầy về căn nhà này» |
| Án sảnh (có `cs.ask`) | `case-ui.js:509` | gate kép `FEATURES.ai && cs.ask` |
| Đường Thầy (quẻ) | `que-ui.js:191` | khối mở khi `FEATURES.ai && R` |
| Vận Mệnh Các | `vanmenh-ui.js:46` | `if (!FEATURES.ai || !R) return null` |

Điểm dùng chung: mọi gate đều đòi **có lá số R** ngoài cờ AI — không có lá số thì không có brief, không có brief thì tầng 1 vô nghĩa. Gate ở tầng **render** (nút không xuất hiện), không ở tầng logic — game vẫn chạy trọn kịch bản khi AI tắt.

### 4.2 Lazy-import và lazy load có retry

Mở khung hỏi-thầy không nạp ai.js ngay từ đầu bundle: `case-ui.js:252` lazy-import `'./master-ui.js'` rồi thay node giữ chỗ bằng `masterChatBody(api, opts)` (`master-ui.js:32`). Bên trong, thư viện nặng tải lười bằng dynamic import **có retry**: promise được cache, nhưng nếu reject thì xoá cache để lần sau thử lại — comment nguồn ghi lý do thẳng: «ai.js rất nặng» (`master-ui.js:48-51`). Ở mức build, `ai.js`/`nlg.js`/`brief-extender.js` được tách chunk riêng `'engine-ai'` khỏi bundle chính (`vite.config.js:94-96`); dev server map `/zai` tới backend tương ứng (bảng ở mục 03) (`vite.config.js:72-78`, dòng `/zai` tại `73`). Kết hợp lại: người chơi không mở khung Thầy thì không trả giá một byte nào của engine AI.

### 4.3 Một lượt hỏi trong master-ui

Luồng `ask()` (`master-ui.js:53-100`) là mẫu tham chiếu cho mọi caller NPC-AI sau này:

1. Chống nhấn kép (`busy`, `54`), in câu hỏi người chơi, hiện khối «Thầy đang xem lá số…» (`57`).
2. Load lib lười (`63`), tạo `AbortController` cho lượt này (`64`).
3. Gọi `L.askAI(q, R, L.getConfig(), {history, signal, onStatus, onToken})` (`65-66`) — **không truyền style** → engine dùng mặc định `'gan-guoi'` (`ai.js:2750`).
4. **rAF gộp token** (`69-72`): token dồn vào biến, mỗi khung hình chỉ vẽ một lần — stream 20K-token brief không repaint từng token.
5. Kết stream: huỷ rAF treo, render markdown cuối, **`history.push`** cặp user/assistant cho vòng sau (`74-77`).
6. **checkNeo** chỉ khi `source === 'ai'` (`80-87`): chấm `%` khớp mốc dữ liệu lá số trên tối đa 8000 ký tự đầu, gắn badge «🎯 Neo X% · n mốc dữ liệu» hoặc «⚠» khi có red-flag/mâu thuẫn; nhánh local gắn nhãn «Luận cục bộ» (`86`).
7. **suggestFollowups** (`90-93`): sinh từ ngữ cảnh câu hỏi + trả lời + history + Dụng Thần/đại vận (`ai.js:2635-2697`), dedup fuzzy theo tỉ lệ trùng từ, cắt còn 3 chip (`master-ui.js:92`) — chip bấm lại là một lượt `ask()` mới, tự nhiên tạo vòng hỏi-đáp nhiều lượt mà không thêm API nào.
8. Lỗi khác AbortError → «Thầy đang bận, lát hỏi lại nhé.» (`95`).
9. **Huỷ khi đóng panel**: `MutationObserver` dõi subtree panel; node gốc mất khỏi DOM → `abort.abort()` (`master-ui.js:104-106`). Kết hợp AbortController truyền vào `askAI` (`64`) → stream chết ngay khi người chơi đóng khung, không rò request.

Bộ ba `history` (77) · `checkNeo` (80-87) · `suggestFollowups` (90-93) chính là ba mỏ neo mà thiết kế NPC-AI bám vào khi gắn persona: ký ức ngắn hạn, tự kiểm dữ liệu, và dẫn đường tiếp theo — cả ba **đã có sẵn**, không phải dựng mới.

## 5. Điểm cắm PERSONA cho NPC-AI

### 5.1 Vị trí chính xác: một dòng trong mảng messages

Chỗ cắm duy nhất của bản đồ là **chèn một system message vào mảng `ai.js:2747-2753`, NGAY SAU dòng anti-manip (`2749`) và TRƯỚC dòng style (`2750`)**:

```js
// ai.js:2747-2753 — sau khi thêm điểm cắm (hình dạng, số dòng thực tế có thể lệch 1-2 dòng)
const messages = [
  { role: 'system', content: (MODE === 'ios' ? RESEARCH_SYSTEM_PROMPT : SYSTEM_PROMPT) },
  { role: 'system', content: brief + '\n\n' + _guide + '\n\n' + _ANTI_MANIP_GUIDE },
  ...(persona ? [{ role: 'system', content: personaSystemPrompt(persona, ctx) }] : []),  // ← DÒNG CẮM MỚI — duy nhất, GIỮA ② anti-manip và ③ style (chốt mục 04 §4.4.2)
  { role: 'system', content: (STYLE_DIRECTIVES[style] || STYLE_DIRECTIVES['gan-guoi']) + '\n\n⚠ REMEMBER THIS STYLE…' },
  ...((history || []).slice(-8)),
  { role: 'user', content: question },
];
```

`personaSystemPrompt(persona, ctx)` là hàm thuần DUY NHẤT của module persona mới `src/game/npc-personas.js` (khuôn `gu-gongan.js`/`namhan.js`/`kinh-tu.js` — module thuần có test node theo GAME-THIET-KE-CHOT §0.3); caller gọi `getPersona(personaId)` trước, `null` thì dòng bị lọc bỏ → **chuỗi hiện hành không đổi một bit**. Tên hàm, kiến trúc dữ liệu và vị trí chèn chốt MỘT chỗ ở mục 04 §4.4.1–§4.4.2 — mục này và mục 15 chỉ trỏ về đó. Kênh truyền vào: `askAI` đã nhận options `{onToken, onStatus, history, signal, style}` (`ai.js:2705`) — thêm một option `persona` là mở rộng tương thích ngược (option cũ không truyền thì hành vi y như trước).

### 5.2 Vì sao điểm cắm khả thi

`ai.js` **không nằm trong danh sách 22 file khóa của mục 15** — điểm cắm không đụng file khóa. Ngược lại, `master-ui.js`/`stations.js` đang trong vùng khóa theo GAME-THIET-KE-CHOT §0.3/Q6/Q7 nên bản đồ **không** đề xuất sửa hai file đó để gắn persona; mọi giá trị persona đi qua option của `askAI`, không qua UI layer. Kèm điều kiện vận hành: brief và anti-manip phải luôn được gửi kèm persona (không bao giờ thay thế); persona không được tự thêm rule mới vào SYSTEM_PROMPT.

### 5.3 Thứ tự ưu tiên an toàn > persona > style — nhờ vị trí, không nhờ dặn dò

Trong chuỗi prompt, message đứng trước có quyền lực khung, message đứng sau có quyền lực giọng: PERSONA nằm **sau** an toàn (system 1 + anti-manip ở `2748-2749`) nên không thể thắng anti-manip khi xung đột; nằm **trước** style (`2750`) nên persona định hình giọng trước, style chỉ tinh chỉnh lớp văn phong cuối. Trật tự mảng tự thực thi ưu tiên **an toàn > persona > style** — không cần cơ chế xử lý xung đột riêng, không cần đo đếm lúc runtime.

### 5.4 Khung PERSONA mẫu (đặt trong module thuần, biến `{{ten_bien}}`)

```js
// src/game/persona-data.js (dữ liệu) + src/game/npc-personas.js (hàm ghép) — module thuần, test node (khuôn gu-gongan.js)
// Kiến trúc dữ liệu chốt DUY NHẤT ở mục 04 §4.4.1: export theo persona + REGISTRY + PERSONA-CHUNG ghép TRƯỚC biến thể.
// Biến {{ten_bien}} dùng đúng bảng biến ĐÓNG của mục 04 §4.4.1 — {{name}}, {{story}}, {{soCauDo}}, {{hinhAnh}}, {{moDau}},
// {{ketCau}}, {{cam}}, {{mau}}, {{tuXung}}, {{goi}}, {{ctx}} (+ các khe ctx con). Biến ngoài bảng KHÔNG bị bỏ qua:
// String.replace không khớp thì literal '{{...}}' được gửi thẳng vào prompt — không tự đặt tên biến khác bảng.
export const PERSONA_thay_tubinh = {
  id: 'thay_tubinh',
  name: 'Thầy Tử Bình',
  promptTemplate: [
      '== PERSONA {{name}} (đè lên GIỌNG, KHÔNG đè lên DỮ LIỆU) ==',
      '- Xưng «{{tuXung}}», gọi người chơi là «{{goi}}». Giọng: mỗi câu {{soCauDo}}; hình ảnh {{hinhAnh}} (từ vựng + nhịp, KHÔNG nhại phát âm, KHÔNG viết sai chính tả).',
      '- Chỉ nói điều có trong brief; thiếu data thì nói thiếu, KHÔNG bịa sao/năm/con số.',
      '- Nhận định tương lai là «xu hướng, không phải bản án» + kèm 1 việc người chơi làm được.',
      '- Sai dữ kiện thì nhận lỗi bằng giọng nhân vật (luật 2 của PERSONA-CHUNG — mục 04 §4.2).',
      '- Cấm tuyệt đối: đoán chết/tuổi thọ, chẩn bệnh, khuyên đầu tư–cờ bạc, «định mệnh đã an bài».',
      '- Riêng bạn tuyệt đối không: {{cam}}. Nhịp giọng mẫu: {{mau}}.',
      '- Kết lượt bằng {{ketCau}} (1 việc làm cụ thể hoặc gợi 1 sảnh nên ghé).',
  ].join('\n'),
};
// ai.js gọi: getPersona('thay_tubinh') → PERSONA_thay_tubinh | null; ghép bằng personaSystemPrompt(persona, ctx)
```

Nội dung chi tiết từng persona (Vân Cốc, Khổng tiên sinh, Thầy Tử Bình…) thuộc các mục bible NPC của tài liệu; bản đồ chỉ chốt **vị trí chèn, kênh truyền option, và luật an toàn chèn kèm** — kiến trúc module và tên hàm là tài sản của mục 04 §4.4.1.

## 6. Offline / MMO (một dòng trỏ)

Toàn bộ luồng ba tầng trên nằm trong PWA; trạng thái mất mạng và phòng MMO có cơ chế riêng — xử lý ở **mục 12/13**, bản đồ này không mở rộng.

## 7. Bảng «điểm chạm NPC-AI» — chỗ cắm không sửa file khóa

| # | Điểm chạm | Vị trí | Hành động | Ghi chú giới hạn |
|---|---|---|---|---|
| P1 | PERSONA system message | `ai.js:2747-2753` (giữa `2749` và `2750`) | chèn 1 dòng + thêm option `persona` vào chữ ký `askAI` (`ai.js:2705`) | `ai.js` không khóa (mục 15); thiếu persona → lọc dòng, nguyên trạng |
| P2 | Module PERSONA thuần | file mới `src/game/npc-personas.js` (hàm) + `persona-data.js` (dữ liệu) | export `getPersona` / `personaSystemPrompt` / `personaBark` (mục 04 §4.4.1) | khuôn module thuần có test node (`gu-gongan.js`/`namhan.js`/`kinh-tu.js`) |
| P3 | Bộ lọc sau stream V1–V8 | lớp wrap quanh kết quả `askAI`, trước bước render | can thiệp text sau stream, trước hiển thị (06-01 §6) | không sửa `master-ui.js` (vùng khóa §0.3); vị trí cụ thể do mục bộ lọc chốt |
| P4 | Cửa vào hỏi thầy | `stations.js:119`, `case-ui.js:239/373/460/509`, `que-ui.js:191`, `vanmenh-ui.js:46` | **không sửa** — gate đã sẵn, đọc `FEATURES.ai` | chỉ tái dùng; file phần lớn trong vùng khóa |
| P5 | Danh xưng + starters của khung Thầy | tham số `{who, first, starters}` của `masterChatBody` (`master-ui.js:32`) | truyền giá trị khi mở khung cho NPC | qua API có sẵn, không sửa file |
| P6 | Kiểu giọng | option `style` của `askAI` (`ai.js:2705`) | giữ mặc định `'gan-guoi'` hoặc truyền 1 trong 4 kiểu | nội dung 4 style là bảng ở mục 07 §7.4.2 |
| P7 | Bộ nhớ hội thoại | mảng `history` do caller giữ (`master-ui.js:45`, `77`; cắt ở `ai.js:2751`) | tự quản số lượt truyền vào | trần cứng 8 cặp do engine cắt |
| P8 | Self-check dữ liệu | `checkNeo` + `buildChartBrief` (`master-ui.js:80-87`) | tái dùng cho badge Neo của NPC | chỉ meaningful khi `source === 'ai'` |
| P9 | Follow-up | `suggestFollowups` (`ai.js:2635-2697`, cắt 3 chip `master-ui.js:92`) | tái dùng nguyên hàm | dedup fuzzy nội bộ, không cấu hình |

Quy tắc đọc bảng: P1-P3 là chỗ **được cắm**, P4-P9 là chỗ **chỉ được tái dùng**. Không có hàng nào đòi thêm endpoint, server, hay sửa worker.

## 8. Pseudo-code — một lượt hỏi NPC trọn vòng (persona → askAI → stream → filter → Neo → followup)

```js
// pseudo-code hình dạng thật, dán được vào module caller NPC (không phải code chạy)
import { getPersona, personaSystemPrompt } from '../game/npc-personas.js';  // P2 — module thuần (mục 04 §4.4.1)

async function hoiNpc(npcId, cauHoi, R, lichSu, abortSignal) {
  // 0. Gate tầng 3 — không có gate thì dừng tại đây (đã có sẵn ở mọi cửa vào, P4)
  if (!FEATURES.ai || !R) return null;

  // 1. PERSONA — dòng cắm duy nhất vào chuỗi messages (P1)
  //    an toàn (SYSTEM_PROMPT + anti-manip) → PERSONA → style, tự thực thi theo vị trí
  const persona = getPersona(npcId);   // object persona; null → dòng system bị lọc, chuỗi nguyên trạng

  // 2. Gọi engine — askAI tự lo: brief cache «212ms→0ms», Section-RAG, brainThink,
  //    tool loop 6 step/9 attempts, stream no-cut, leo thang lỗi → localFallback.
  //    endpoint/preset · body (temp/thinking/tools) · stream format · TTFT/idle:
  //    SỐ HỢP ĐỒNG XEM MỤC 03.
  const { source, text } = await askAI(cauHoi, R, getConfig(), {
    persona,                                  // ← option mới, tương thích ngược
    history: lichSu,                          // engine tự slice(-8) (ai.js:2751)
    signal: abortSignal,                      // AbortController của khung (master-ui.js:64, 105-106)
    onStatus, onToken,                        // rAF gộp token ở caller (master-ui.js:69-72)
  });

  // 3. Bộ lọc sau stream V1–V8 — trước khi hiển thị (P3; 06-01 §6)
  const daLoc = filterV(text, { personaId: npcId });

  // 4. Neo self-check — chỉ khi AI thật, không chấm cho local (P8)
  const neo = source === 'ai' ? checkNeo(daLoc.slice(0, 8000), buildChartBrief(R)) : null;

  // 5. Follow-up ≤ 3 chip — chip bấm lại gọi hoiNpc lần nữa (P9)
  const chips = source === 'ai' ? suggestFollowups(cauHoi, R, daLoc, lichSu).slice(0, 3) : [];

  // 6. Ghi bộ nhớ hội thoại — cặp user/assistant cho vòng sau (P7)
  lichSu.push({ role: 'user', content: cauHoi }, { role: 'assistant', content: daLoc });

  return { text: daLoc, neo, chips, source };
}
```

Đọc pseudo-code theo đúng chiều mũi tên: persona **trước** askAI (đi vào messages, không đè brief), stream do engine toàn quyền, filter **sau** stream trước hiển thị, Neo **sau** filter (chấm text đã lọc), followup cuối cùng để mở vòng sau. Không bước nào tự gọi mạng — mạng chỉ tồn tại bên trong `streamRound` của tầng 1 và qua worker tầng 2.

## 9. Ranh giới thiết kế — những điều bản đồ KHÔNG cho phép

- **Không AI server riêng, không thay worker, không thêm endpoint.** Chuỗi ba tầng là nguyên trạng; mọi nhu cầu mới (persona, filter,Neo, followup) cắm vào các điểm P1-P9 ở trên. Đề xuất nào thêm một hop mạng là vi phạm ranh giới này.
- **Thinking chỉ bật trên nhánh native Z.ai/BigModel, loại trừ nvidia** (`ai.js:2761-2766`) — caller NPC không được tự bật `thinking` qua body; body do `buildBody` dựng và bảng tham số ở mục 03.
- **Comment stale glm** đã được ghi nhận đúng một lần ở §3.4 — mục khác chỉ trỏ, không nêu lại.
- **Không lặp số hợp đồng**: TTFT/idle, rate limit, KV, preset/endpoint, stream format thuộc mục 03; bản đồ này chỉ giữ số tính chất luồng đã liệt kê ở §0.
- **Không sửa file khóa** (`master-ui.js`, `stations.js`, `state.js` theo GAME-THIET-KE-CHOT §0.3; danh sách 22 file hiện hành ở mục 15): điểm cắm duy nhất nằm ở `ai.js` (ngoài danh sách khóa) và các module thuần mới.
- **Không đảo thứ tự system messages**: đảo là đảo cơ chế ưu tiên an toàn > persona > style.
- **Pool fallback mất tools là chấp nhận được**: không «vá» bằng thêm hop hay thêm backend đặc biệt; hành vi khi mất tools do tool loop của tầng 1 tự xử (thử không tool → luận từ brief).

## 10. Chỉ mục nguồn (vị trí code — không phải bảng số hợp đồng)

| Chủ đề | Nguồn |
|---|---|
| Gate AI / iOS | `src/game/features.js:20`; `stations.js:119`; `case-ui.js:239/373/460/509/252`; `que-ui.js:191`; `vanmenh-ui.js:46` |
| Khung hỏi-thầy | `src/game/master-ui.js:32, 45-51, 53-100, 64, 65-66, 69-72, 77, 80-87, 90-93, 95, 104-106` |
| Config / cổng vào | `src/engine/ai.js:176, 199-238, 243-249, 2705-2720, 2851-2854` |
| Brief + cache + RAG + phân loại | `src/engine/ai.js:254-1079 (258-265), 169-170, 2721-2724, 2318-2332, 2334-2384, 2389-2411, 2417-2426, 2729-2741, 2776` |
| Guide tổng hợp / anti-manip | `src/engine/ai.js:2430-2455, 2743-2745, 146-167` |
| Chuỗi messages / style | `src/engine/ai.js:2747-2753 (2748, 2749, 2750, 2751), 1182-1204 (STYLE_DIRECTIVES — nội dung ở mục 07 §7.4.2)` |
| Body / thinking | `src/engine/ai.js:2758-2768 (2761-2766 isZaiNative)` |
| Tool loop / tools | `src/engine/ai.js:2783-2788, 2790, 2808-2821 (2815, 2818, 2819), 2824-2828, 1409-1639, 1651-1657, 1660-2231+, 1937-1941` |
| Stream / leo thang / 503 | `src/engine/ai.js:2890-2920 (2892-2899 no-cut, 2901-2910 retry, 2912-2916 aiDisabled, 2924-2928 audit), 2801-2803, 2833-2839` |
| Gateway | `worker/index.js:52-96 (58, 59-61, 62, 63-64 stale, 64, 68-69, 71, 79, 82-87, 89-92, 95), 165-167, 170-183 (173, 175-176, 179-182)` |
| Build/dev | `vite.config.js:72-78 (73), 88, 94-96` |

*Bản đồ hết — số hợp đồng mở đầu ở mục 03.*
