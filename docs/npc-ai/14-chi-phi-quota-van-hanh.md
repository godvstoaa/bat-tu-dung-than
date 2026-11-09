# Mục 14 — Chi phí, quota, vận hành và chỉ số sản xuất theo persona

> **Tóm tắt:** Mục này trả lời bốn câu hỏi của bản thiết kế NPC-AI Huyền Quán: ai trả tiền cho AI (14.1), mỗi persona được tốn bao nhiêu lượt gọi (14.3), vận hành tắt/bật thế nào khi server sập hay admin bấm kill-switch (14.5, 14.9), và đo sản lượng bằng chỉ số nào để biết persona nào đang hỏng (14.6). Toàn bộ con số budget và ngưỡng cảnh báo trong mục này là **SỐ ĐỀ XUẤT** — dữ liệu nền chưa đo lần nào, phải đo một tuần thực rồi mới chốt. Mục không cam kết bất kỳ số tiền nào vì kho dữ liệu không có bảng giá đơn vị.

## 14.0 Ranh giới của mục này — đọc trước khi dùng số

Ba ranh giới cần chốt ngay ở đầu để không ai đọc nhầm:

1. **Không có ₫/tháng.** Dữ liệu nền của bản thiết kế không chứa bảng giá đơn vị nào (không giá per-token, không giá gói Coding Plan, không hạn mức tháng của z.ai). Vì vậy mục này chỉ nói **cấu trúc chi phí** (tầng nào trả, key nằm đâu) và **số lượt gọi** (đếm được bằng code), tuyệt đối không viết câu kiểu «khoảng X đồng mỗi tháng». Ai cần số tiền phải tự lấy từ trang giá của nhà cung cấp — ngoài phạm vi tài liệu này.
2. **Không lặp mục 03 và mục 02.** Bảng KV, bảng rate-limit, cache brief và ba cơ chế tiết kiệm là tài sản của mục 03; phân tích comment stale glm là tài sản của mục 02. Mục này chỉ trỏ tới và dùng số rate làm ràng buộc của bảng budget.
3. **Phân biệt «đã code» và «đề xuất».** Mọi thứ đã có trong repo được dẫn `file:line`; mọi thứ mới (circuit client, trường log mới, ngưỡng cảnh báo, bảng budget per-persona) được đánh dấu «đề xuất» và ghi rõ chèn vào đâu. Cuối mục có bảng tổng hợp ranh giới (14.10).

## 14.1 Cấu trúc chi phí: ai trả tiền, ai không cần key, key nằm đâu

### 14.1.1 Ba tầng thanh toán hiện có (đã code)

Chuỗi AI có ba tầng người chơi chi phí khác nhau, và điểm quan trọng nhất cho người chơi là: **người chơi cuối không cần mua hay dán key nào**.

| Tầng | Ai trả | Điểm code | Ý nghĩa vận hành |
|---|---|---|---|
| PRIMARY | **Chủ app** — key `zaiKey` (z.ai Coding Plan) của admin, nằm trong KV `ai:config` | `worker/index.js:63-64` — backend `z.ai-paid`, endpoint `https://api.z.ai/api/coding/paas/v4`, model `glm-5.3`, `stripTools: false` (giữ đủ tool-use) | Chi phí thật duy nhất trong hệ thống; hết quota gói này thì cả hệ đi đường freePool |
| FALLBACK | **Admin** cấu hình sẵn (nếu dán) — freePool: Groq free / NVIDIA NIM free, mỗi backend `{name, endpoint, model, apiKey}` | `worker/index.js:62` — mọi entry pool bị `stripTools: true`; `worker/index.js:79` xóa `tools`/`tool_choice` khỏi body để tránh HTTP 413 | Miễn phí nhưng **mất 38 tool** (14.4); gọi lần lượt tới khi hết (`worker/index.js:89,92`) |
| NGƯỜI CHƠI | **Không trả gì, không cần key** | `ai.js:245-247` — endpoint bắt đầu bằng «/» được coi là proxy có key nhúng server-side (`isProxyNoKey`), `isAIReady` trả true mà không cần `cfg.apiKey` | Mọi preset đều ép qua proxy; CORS block gọi thẳng `api.z.ai` từ trình duyệt nên không có đường tắt (`ai.js:181-197` PRESETS + migrate `ai.js:208-210`) |

Ba ghi chú kèm theo để tránh hiểu sai:

- **Config người chơi chỉ chọn hình dạng, không chọn chi phí.** `getConfig()` đọc `localStorage 'bazi_ai_config_v1'` (`ai.js:176`); người chơi có thể tự bật/tắt AI trên máy mình (`ai.js:243-249`) nhưng không thể đi vòng qua worker — trên build native Capacitor, đường dẫn «/...» được resolve thành `https://battu.god8.shop` (`ai.js:2851-2854`), tức vẫn dừng ở worker của chủ app. Chi phí luôn đếm về một chỗ.
- **iOS không tiêu một call nào.** `FEATURES.ai = !IOS` (`features.js:20`) tắt trọn khối nút «Hỏi Thầy» ở mọi cửa vào (`stations.js:119`, `case-ui.js:239/373/460/509`, `que-ui.js:191`, `vanmenh-ui.js:46`). Về mặt chi phí, nền iOS chiếm ngân sách bằng 0 — đây là lý do bảng budget ở 14.3 không có dòng iOS.
- **«Chi phí» của một call không chỉ là số call.** Mỗi call mang brief nhiều tầng đã dựng từ lá số ĐÃ TÍNH đúng (`ai.js:254-1079`); comment tại `worker/index.js:72-75` ghi rõ thinking của gói coding plan tốn ~6 giây mỗi call nhưng được chấp nhận vì chất lượng luận giải tốt hơn. Thời gian là một dạng chi phí vận hành — budget ở 14.3 quản cả hai: số call (trần server) và số lượt hỏi (trần client).

### 14.1.2 Key chỉ sống ở KV, trả về admin luôn bị mask (đã code)

Quy tắc bất di bất dịch cho mọi key trong mục này: **không một giá trị key nào được viết vào tài liệu, vào log, hay vào response chưa mask.**

- Key sống duy nhất ở KV `ai:config` — admin ghi qua lệnh `AiConfigSet`, đồng bộ kèm `ai:enabled` (`worker/admin.js:278-283`).
- Khi lưu xong, response trả về admin UI đã mask: `apiKey` và `zaiKey` thành `'***' + 4 số cuối` (`admin.js:285`).
- Đọc ngược config cũng mask y hệt, kể cả từng backend trong `freePool` (`admin.js:291-293`).
- Trong mã nguồn repo không thấy key nào hardcode — mọi chuỗi key trong code là placeholder hoặc đọc từ KV (audit tĩnh; chưa xác minh đầy đủ).

Hệ quả vận hành theo persona: bất kỳ tính năng NPC-AI mới nào (circuit client 14.8, trường log 14.6) đều **không được đụng tới key, không được gửi key qua logEvent, không được in key vào bark hay thoại**. Persona nói chuyện với người chơi bằng dữ liệu lá số, không bao giờ nói chuyện về key.

## 14.2 Khuôn tiết kiệm và comment stale — KHÔNG LẶP

Khuôn tiết kiệm (bảng KV/rate/cache và 3 cơ chế tiết kiệm) là tài sản của mục 03 — **xem mục 03 §7**, mục này chỉ dùng các trần rate làm ràng buộc của bảng budget ở 14.3. Comment stale glm tại `worker/index.js:63` không phải hợp đồng — phân tích đầy đủ thuộc chủ sở hữu duy nhất của bộ: **xem mục 02 §3.4**; mục này không kể lại nội dung comment.

## 14.3 Budget đề xuất theo persona

### 14.3.1 Bảng budget per-persona (tất cả số là ĐỀ XUẤT)

Trần cứng phía server là **30 call AI/phút/IP** (key `airl:` — `worker/index.js:159-163`) áp cho mọi prefix proxy; tổng site 120 req/phút/IP (`worker/index.js:132-139`). Budget dưới đây là khuôn phía client để gameplay không chạm trần, không phải trần kỹ thuật:

| # | Khu vực / persona | Kiểu trả lời | Đề xuất call AI/IP/ngày | Cơ sở (file:line / docs) |
|---|---|---|---|---|
| 1 | **Bàn Thầy — Thầy Tử Bình** (`thay_tubinh`; hôm nay là «Thầy» vô danh trong code) | Lượt hỏi thủ công: mỗi lần người chơi gõ câu trong khung «Thầy luận» | **≤ 5 lượt/ngày/IP** (đề xuất) | Mỗi lượt = 1 lần gọi `askAI` (`master-ui.js:65`); PERSONA + giới hạn công cụ 27/38 theo thẻ `toolsAllow` của bible (06-04 §9; cơ chế lọc — mục 04 §4.4.4, chưa code) + kết bằng gợi sảnh; nhân vật đang có: `stations.js:146`, `master-ui.js:32` |
| 2 | **Khách procedural AI-light** — Sảnh Điều Hậu, Sảnh Cách Cục, bước «Năm nay» | 1–2 khách/ngày được trả lời AI có nghiệm sâu | **1–2 khách/ngày** (đề xuất) | Câu hỏi điều hậu cố định có sẵn (`halls.js:87-88`); lọc cách thường + cách thần tối đa 20 hạt (`halls.js:244-247`); luận «Năm nay» trên lưu niên thật (`npc-deep.js:41`) |
| 3 | **Khách procedural còn lại** — Tử Vi, Tượng Pháp, Trạch Nhật, Dương Trạch, Hợp Hôn, 3 khe chờ sân | Bark + kịch bản + cảm ơn có sẵn; **0 call mặc định** — AI chỉ mở khi người chơi chủ động mở khung hỏi | 0 (đề xuất) | Cảm ơn 3 mức / theo điểm đã code, không cần AI: `case-ui.js:236/370/457/472`; câu hỏi chỉ 1–7 mẫu (`npc.js:23-31`); hạt giống khách theo ngày+pid (`main.js:56`) |
| 4 | **Bark-only** — Lão Tùng gác cổng, Bà Tư thợ may, Lư Hương, Trà Thất, Hồ Sen, tượng thần 4 điện, người bán Tàng Y Các, 44 NPC phụ | Bark ngắn ≤ 90 ký tự, không AI | **0** | Bark 2 câu/NPC = 88 câu (README:149); Lư Hương 14 câu có sẵn (`names.js:10-25`); Trà Thất dẫn thở (`stations.js:548`); Hồ Sen (`stations.js:568`); quầy Tàng Y Các cúi chào (`render3d.js:234-236`); quy tắc bark ≤ 90 ký tự (docs 06-18 §6) |
| 5 | **Không-AI cố ý** — Lạt-ma Đa Kiệt (bản nháp chờ tham vấn), Yểm sư Lỗ Ban, Định Mệnh Hội | Kịch bản có người duyệt, không runtime | 0 (quyết định, không phải tiết kiệm) | README:107 («không chạy khi chơi — nháp, chờ tham vấn»), README:111, README:112; an toàn tín ngưỡng: cần biên bản tham vấn trước khi bật AI (lore 06-09 B4, 06-14 §4.1) |
| 6 | **iOS — mọi persona** | Tắt trọn | 0 | `features.js:20` + các gate nút (`stations.js:119`, `case-ui.js:239/373/460/509`, `que-ui.js:191`, `vanmenh-ui.js:46`) |
| 7 | **Các NPC dẫn đạo canon còn lại** (Vân Cốc, Khổng tiên sinh, Trương Thiên Sư, Diệu Âm, Tế tửu, Huyền Hư…) | Docs-only, **chưa wire** trong `src/` lẫn `worker/` | **Chưa chốt — không cấp ngân sách trong bảng này** | Grep `PERSONA|van_coc|khong_tiensinh` trong src/ + worker/ = 0 kết quả; bản thiết kế hiện hành không cam kết 20 persona/runtime (lore Q3/Q4, GAME-THIET-KE-CHOT Q3/Q4) |

**Mục tiêu tổng:** ≤ 5 call AI/IP/ngày, nằm thoải mái trong trần server 30 call/phút/IP — **SỐ ĐỀ XUẤT**, chưa có số đo thực nào để đối chứng.

### 14.3.2 Vì sao hàng 2 chỉ là 1–2 khách/ngày (cơ sở)

Hàng 2 là hàng duy nhất nhân thêm chi phí theo ngày, nên cần giải thích rõ: mỗi khách AI-light tốn **một** call chính (brief + RAG + model) và tối đa **một** follow-up. Chọn đúng hai sảnh này vì chúng là hai sảnh có «nghiệm sâu» sẵn trong dữ liệu: Điều Hậu kéo 75% khách lệch khí hậu để bài học rõ (`halls.js:53-60`), Cách Cục lọc khách có cả cách thường lẫn cách thần trong `GE_GODS` (`halls.js:244-247`) — hai bài này đáng một call AI nhất. Số 1–2 là **đề xuất** để giữ trần 5 call: 5 lượt chia cho Thầy (dành phần lớn cho người chơi hỏi thật) và tối đa 2 khách; nếu ngày sau đo thấy người chơi ít hỏi, có thể nới khách lên 3 — quyết theo chỉ số Neo và log_error của 14.6, không chốt vĩnh viễn hôm nay.

### 14.3.3 Số học «lượt» và «call» — đếm đúng cái nào

Đây là điểm dễ tính sai nhất của mục: **server đếm request, bảng budget đếm lượt hỏi, và một lượt có thể sinh nhiều request.** Vòng tool-loop chạy trên máy người chơi: model xin tool → `execTool` chạy cục bộ → kết quả được nhét vào `messages` role `'tool'` rồi gọi model luận tiếp (`ai.js:2814-2821`); mỗi vòng như vậy là một request mới đi qua worker và đếm vào `airl`. Trần của vòng là 6 step / 9 totalAttempts (`ai.js:2790`).

Suy ra: 5 lượt/ngày × tối đa 6 request/lượt = tối đa 30 request/ngày/IP lý thuyết — nhỏ hơn trần **ngày** nhưng có thể chạm trần **phút** nếu người chơi hỏi dồn trong một phút. Hai van an toàn đã có sẵn: câu trivial ≤ 3 từ và câu tổng hợp đi tool-free (khuôn chi tiết xem mục 03 §7), và circuit client ở 14.8 đóng phiên khi gặp 429. Khi giám sát ở 14.6, cần ghi nhớ: chỉ số «call AI/ngày» của logFreeUsage đếm request, chỉ số budget của bảng trên đếm lượt — so hai chỉ số trực tiếp với nhau là sai.

## 14.4 «Hôm nay không tool» — rủi ro stripTools của freePool

### 14.4.1 Cơ chế lỗi xảy ra thế nào (đã code)

`freeRoute` xếp backend theo thứ tự: `z.ai-paid` (có `zaiKey`) đứng đầu với `stripTools: false` — giữ đủ 38 tool (`AI_TOOLS`, `ai.js:1409-1639`), sau đó là pool Groq/NVIDIA với `stripTools: true` (`worker/index.js:62,64,79` — strip để tránh HTTP 413 vì payload tools lớn). Nếu `zaiKey` fail (401/429/500/timeout), request rơi xuống pool → **toàn bộ 38 tool biến mất với lượt trả lời đó**: model không còn cách nào lấy ngày thật, quẻ thật, lưu niên thật. Mỗi backend có cửa 90 giây tới headers rồi abort (`worker/index.js:69`); hết toàn bộ backend → 503 «Tất cả free backend đều thất bại» (`worker/index.js:95`) — và 503 thì client fallback NGAY (14.5). Lưu ý ranh giới: đúng lúc backend là pool thì request **vẫn thành công** (200), người chơi vẫn nhận câu trả lời dài — chỉ là câu trả lời thiếu công cụ.

### 14.4.2 Luật giữ an toàn khi mất tool (rule 13-14 + rule 5)

Lớp giữ an toàn không nằm ở worker mà nằm ở SYSTEM_PROMPT, vốn luôn đi kèm mọi call: rule 5 cấm bịa ngày — ngày thật chỉ lấy từ tool; rule 13-14 cấm bịa dữ liệu ngoài brief (không bịa Tử Vi cung, không thêm chi tiết đời người chơi, verify trước khi trích) (`ai.js:1215-1400`). Khi tools bị strip, model tự thấy request không có `tools` — nó không thể «ngày thật từ tool», nên theo rule 5-14 nó phải dừng ở dữ liệu brief thuần và **không hứa ngày cụ thể nào**.

### 14.4.3 Khuôn trả lời theo persona (đề xuất viết vào PERSONA của từng nhân vật)

Persona phải **nói rõ là hôm nay không mở được công cụ**, trả phần có trong brief thuần (lá số, cách cục, đại vận — dữ liệu đã tính sẵn), từ chối phần cần ngày thật một cách có nhân cách, mời hỏi lại — không né chung chung. Khuôn mẫu để dán vào PERSONA:

```
// Nhét vào PERSONA-<id> (khuôn docs 06-xx) — pseudo-code JS hợp lệ chạy ở tầng caller dựng prompt,
// KHÔNG dùng cú pháp template engine (khối if/endif của Jinja không chạy được trong JS của repo).
// bienGioiHanHomNay là biến định danh ASCII; khe điền '{{gioi_han_hom_nay}}' do điểm gọi cấp
// (quy ước {{ten_bien}} chỉ dùng cho chỗ điền giá trị — khe này thuộc thẻ kỹ thuật docs 06-xx,
// không nằm trong bảng biến đóng của personaSystemPrompt, mục 04 §4.4.1).
// TÍN HIỆU client «lượt này đi pool, không tool» hiện CHƯA có trong code (ghi chú cuối 14.4.3) —
// Caller chỉ điền được 'khong_tool' sau khi tín hiệu đó được bổ sung; trước đó luôn 'binh_thuong'.
const bienGioiHanHomNay = '{{gioi_han_hom_nay}}';   // 'khong_tool' | 'binh_thuong' — do điểm gọi cấp
if (bienGioiHanHomNay === 'khong_tool') {
  promptLines.push(
    '- Hôm nay ngươi không có sổ ngày, sổ quẻ trong tay. KHÔNG bịa ngày, năm, quẻ, hướng',
    '  (luật 5 và luật 13-14 vẫn áp dụng trọn vẹn).',
    '- Trả phần lá số thuần: tứ trụ, Dụng Thần, cách cục, đại vận — mọi mốc lấy đúng từ brief.',
    '- Phần cần ngày cụ thể: nói thẳng thiếu công cụ theo đúng giọng nhân vật, MỜI hỏi lại,',
    '  KHÔNG hứa mốc ngày nào, KHÔNG né chung chung.',
  );
}
```

Ba mẫu câu theo giọng (bark ≤ 90 ký tự — docs 06-18 §6):

```
thay_tubinh:  «Hôm nay sổ ngày của thầy chưa mở ra được. Con hỏi phần lá số — cách cục,
               đại vận — thầy vẫn đọc từ tờ giấy đỏ. Phần chốt ngày, mai quay lại nhé.»
khong_tiensinh: «Hôm nay không lật được sổ ngày. Số trong tay ngươi còn nguyên — hỏi theo số.
               Ngày cụ thể: mai.»
van_coc:      «Hạt giống trong tay con, lão tăng vẫn nhìn ra. Ngày gieo thì mai mới đếm
               được. Mai quay lại.»
```

Ghi chú trung thực: cơ chế **truyền tín hiệu** «lượt này đi pool, không tool» từ worker về client hiện chưa có trong code — thậm chí header backend đã bị cố ý bỏ để không lộ tên backend cho client (`worker/index.js:86`). Khuôn trên dựa vào chỗ model tự nhận request không kèm `tools` (thật, vì body đã bị strip tại `worker/index.js:79`). Nếu sau này muốn client biết chắc chắn, phải mở lại một tín hiệu trung lập qua mục 03 — việc đó thuộc mục 03, không thuộc mục này.

## 14.5 Vận hành kill-switch — chỉ bảng hành động

Bảng KV định nghĩa kill-switch (`ai:enabled`, `ai:free_enabled`, `ai:config.mode`) là tài sản của mục 03. Ở đây chỉ có **hành động NPC-AI phải làm** khi từng sự kiện xảy ra. Hành vi nền đã code: 503 từ worker → client fallback NGAY, không retry (`ai.js:2912-2916` ném `aiDisabled`, bắt tại `ai.js:2801`); leo thang nội bộ là tắt tools → tắt thinking → bỏ cuộc sang local (`ai.js:2799-2802`); fallback local dùng `composeAnswer` từ `nlg.js` (`ai.js:2711-2719`). Trò chơi chạy trọn khi AI tắt (kịch bản + composeAnswer) — K1/K2 của docs 06-01 §2.

| Sự kiện vận hành | NPC-AI phải làm | Tham chiếu |
|---|---|---|
| Admin đặt `mode: 'off'` | Worker chặn → 503 → client fallback NGAY, không retry; khung hiển thị câu rủi ro hiện có | `admin.js:282-283` (sync `ai:enabled`), `ai.js:2912-2916`, `ai.js:2801` |
| K1: `ai:enabled` = 0 | Như trên; mọi persona tắt đồng loạt, game vẫn chơi trọn bằng kịch bản | `worker/index.js:165-167`, `admin.js:112-116`, lore 06-01 §2 |
| K2: `ai:free_enabled` = 0 (khi mode = `free`) | Chỉ tắt đường free; nếu admin có key custom thì route vẫn chạy qua `makeProxy` | `worker/index.js:175`, `admin.js:120-124`, `worker/index.js:179-182` |
| 429 từ trần 30/phút/IP | Circuit client đóng phiên hôm nay, hạ bark — khuôn «Thầy viết mệt tay rồi, mai quay lại» (14.8) | `worker/index.js:159-163` |
| Mỗi deploy | Chạy lại hai bài thử kill-switch trong checklist 14.9 (bước 4-5) — bắt buộc, không tùy chọn | mục 14.9 |

Lưu ý giọng: câu lỗi hiện có là «Thầy đang bận, lát hỏi lại nhé.» (`master-ui.js:95`) — giữ nguyên làm câu rủi ro chung; khuôn «Thầy viết mệt tay rồi, mai quay lại» ở 14.8 dành riêng cho circuit chủ động, để người chơi phân biệt được «thầy bận» (lỗi hệ thống) với «thầy mỏi» (giới hạn ngày).

## 14.6 Chỉ số sản xuất theo persona (phần mới — kế hoạch đo, không phải «trong tương lai có thể»)

### 14.6.1 Đường ống đo đã có sẵn trong code (ba kênh)

Ba kênh ghi nhận đã chạy thật, chỉ số mới sẽ đi qua đúng ba kênh này chứ không dựng đường ống mới:

1. **`log_error` (từ AI):** tool `log_error` của model POST `/api/log-error` để admin biết lỗi luận — comment `[R46] AI tự log lỗi khi bị user sửa` (`ai.js:1937-1941`); rule 21 trong SYSTEM_PROMPT bắt model tự gọi khi bị người chơi sửa đúng (`ai.js:1215-1400`).
2. **`logEvent` (từ client):** ghi sự kiện vào ADMIN_KV, trần 30 sự kiện/phút/IP (key `rl:`), vượt thì silent-drop (`admin.js:165-172`). Đây là kênh client duy nhất sẵn có — mọi chỉ số đo từ máy người chơi phải đi qua đây.
3. **`logFreeUsage` (từ worker):** mỗi attempt của `freeRoute` ghi một dòng — đếm `cnt:free_calls` / `cnt:free_ok` / `cnt:free_err`, tổng hợp theo ngày `dayagg:<date>`, và `free:log` tối đa 200 dòng gần nhất (`admin.js:145-163`).

### 14.6.2 Đề xuất mở trường vào logEvent — và ranh giới đo được

Đề xuất thêm bốn trường vào payload logEvent: `{persona, neoScore, isLocalFallback, backend}`. Trước khi mở, chốt rõ từng trường **lấy dữ liệu ở đâu** — có trường đo được từ client, có trường không thể:

- `persona`: client biết chính xác persona đang mở khung (đó chính là tham số `mayAskAI` của circuit 14.8). Đo được từ client.
- `neoScore`: kết quả `checkNeo` đã chạy sẵn sau mỗi lượt trả lời — badge «🎯 Neo X%» hoặc «⚠» kèm số mốc dữ liệu và số mâu thuẫn (`master-ui.js:81-87`). Đo được từ client, chỉ cần gửi thêm số.
- `isLocalFallback`: client đã phân biệt sẵn qua `source` của `askAI` — `if (source === 'ai')` mới chạy checkNeo (`master-ui.js:80`), nhánh còn lại hiện nhãn «Luận cục bộ (chưa kết nối máy chủ AI)» (`master-ui.js:85-86`). Đo được từ client.
- `backend`: **không đo được từ client** — tên backend đã bị cố ý giấu (`worker/index.js:86`, comment AUDIT FIX bỏ header `X-Free-Backend`). Trường `backend` chỉ có nghĩa khi đo phía server trong `logFreeUsage` (`admin.js:145-163`). Bảng chỉ số dưới đây ghi rõ ranh giới này để không ai viết code gửi `backend` từ client (vô ích) hoặc định đoạt backend qua badge (sai).

### 14.6.3 Bảng chỉ số + ngưỡng cảnh báo + hành động

Ngưỡng ở đây là **đề xuất lấy từ đặc tả + suy luận kỹ thuật, chưa đo lần nào** — chạy một tuần thực với người chơi thật rồi chốt con số, trước đó không ai được coi ngưỡng này là chuẩn:

| # | Chỉ số | Nguồn đo (kênh — đã có/đề xuất) | Ngưỡng cảnh báo (đề xuất) | Hành động khi vượt |
|---|---|---|---|---|
| 1 | Neo trung bình % theo persona/ngày | `checkNeo` trả `score` (`master-ui.js:82-83`) → gửi trường `neoScore` qua logEvent (đề xuất 14.6.2) | Neo trung bình của một persona **< 60%/ngày** | Mở issue prompt: soi các section brief mà persona hay trích, rà lại rule 13-14; so sánh với persona liền kề để loại nguyên nhân dữ liệu chung |
| 2 | % lượt ⚠ (red-flag Neo) theo persona | cùng nguồn — `n.hasRedFlag` quyết định badge «⚠» (`master-ui.js:83`) | **> 20% lượt/ngày** cho một persona (đề xuất, chưa chốt) | Rà SYSTEM_PROMPT rule 13-14 và brief của đúng persona; nếu cả hai persona cùng cao → lỗi chung brief, không phải lỗi prompt |
| 3 | Tần suất `/api/log-error` theo persona | POST `/api/log-error` (`ai.js:1938`) + trường `persona` (đề xuất) | **> 3 lượt/ngày** cho một persona | Sửa prompt của persona đó; kiểm validate tham số tool trả lỗi tiếng Việt sạch (`ai.js:1651-1657`) nếu lỗi rơi vào nhóm tool |
| 4 | Tỷ lệ localFallback theo persona | `source !== 'ai'` (`master-ui.js:80,85-86`) → trường `isLocalFallback` (đề xuất) | **> 20% lượt/ngày** | Kiểm backend/quota (14.5, 14.7); trước tiên loại trừ nguyên nhân offline — xem 14.6.4 |
| 5 | Tỷ lệ fail backend (đặc biệt pool stripTools) | `logFreeUsage`: `cnt:free_err / cnt:free_calls`, `free:log` (`admin.js:145-163`) — đo **server-side** | > 50% trong một giờ (đề xuất, chưa chốt) | Rà pool (key chết 403/413 — biến chứng đã thấy trong comment `worker/index.js:59-61`); cân nhắc hạ chế độ bark tạm thời theo 14.8 |
| 6 | Số lượt chạm trần 30/phút/IP | Hiện logEvent silent-drop **không đếm được** lượt bị drop (`admin.js:171`) — đề xuất thêm một counter đếm attempt bị drop, cùng khuôn `cnt:` của `logFreeUsage` | Đo 1 tuần rồi chốt | Nếu cao: nhắc người chơi bằng khuôn circuit; tuyệt đối **không nới quota** — trần do mục 03 sở hữu |

### 14.6.4 localFallback ≠ mất mạng — hai trạng thái không được gộp

`isLocalFallback` trong bảng trên **chỉ đếm khi app đang online mà backend fail/tắt** (composeAnswer từ `nlg.js`, `ai.js:2711-2719`; nhãn «Luận cục bộ» tại `master-ui.js:85-86`). Khác hẳn với **trạng thái mất mạng hoàn toàn** của mục 12: app offline, mọi trạm chạy kịch bản local, mức A/C của khủng hoảng không gọi mạng chút nào. Khi phân tích chỉ số, một ngày mưa gió làm router chết sẽ bơm cả hai chỉ số cùng lúc — người đọc báo cáo phải tách bằng truy vấn «có request tới worker trong khung giờ không»: có request mà vẫn localFallback là lỗi backend; không có request nào là offline mục 12. Gộp hai trạng thái sẽ sửa sai chỗ.

### 14.6.5 Quy trình chốt ngưỡng (một tuần, sau đó đóng bảng)

Ngày 1-7: bật đủ chế độ free, để người chơi thật chơi bình thường, mỗi tối xuất `dayagg:<date>` + `free:log` + tổng hợp logEvent theo persona. Ngày 8: dựng phân phối của 6 chỉ số, so với ngưỡng đề xuất; chỉ số nào phân phối thực khác ngưỡng quá xa thì chỉnh ngưỡng theo phân phối (chọn ngưỡng ở khoảng phân vị mà hành động còn kịp), sau đó **đóng bảng — ngưỡng thành chuẩn vận hành**. Mọi lần chỉnh sau đó phải ghi lý do vào chính bảng này.

## 14.7 Quota chống drain — NPC-AI không thêm lối vào

Mọi lớp chống drain đã có ở worker và NPC-AI **không được thêm bất kỳ lối vào mới nào**:

- **CORS allowlist:** chỉ các origin của app được qua — comment ghi rõ lý do: «trước đây `*` → bất kỳ site nào cũng drain AI quota» (`worker/index.js:28-33`). Cấm thêm endpoint mới cho NPC-AI bên ngoài danh sách này.
- **IP blacklist:** key `block:<ip>` trong KV chặn trước mọi xử lý (`worker/index.js:107-112`).
- **UA scraper 403:** chặn User-Agent scraper trừ danh sách GOOD_BOT (`worker/index.js:127-129`).
- **Trần rate:** tổng site 120 req/phút/IP (`worker/index.js:132-139`), AI 30 call/phút/IP (`worker/index.js:159-163`), logEvent 30/phút/IP (`admin.js:168-172`).

Ba quy ước bắt buộc khi thêm persona mới: (1) bark và kịch bản chạy hoàn toàn local, không bao giờ tự gọi AI đằng sau lưng người chơi; (2) logEvent chỉ mang số liệu, không mang brief — brief ~20K token nhét vào log là drain KV tự làm; (3) không thêm route mới trong worker cho persona riêng — mọi call đi đúng proxy hiện có.

**NAT chung** (quán net, ký túc xá — nhiều người chơi một IP): budget ≤ 5 lượt/ngày/IP có nghĩa những người chơi cùng NAT phải chia sẻ một hũ budget client. Đây là điểm đã tính đến ở mục 13 — mục này không thiết kế lại, chỉ ghi nhận hệ quả: circuit client của NAT chung sẽ «đóng phiên» sớm hơn dự kiến cho người chơi đứng sau, và đó là hành vi chấp nhận theo mục 13, không phải lỗi.

## 14.8 Circuit client — pseudo-code bắt buộc (đề xuất, module thuần)

Circuit là tầng client NGAY TRƯỚC khi gọi `askAI`: đếm lượt theo persona/ngày, đóng phiên khi hết, hạ về bark khi gặp 429. Đặt trong module thuần có test node (khuôn `gu-gongan.js`/`namhan.js` — GAME-THIET-KE-CHOT §0.3), không đụng `state.js`/`stations.js` đang khóa:

```js
// circuit-ai.mjs — đề xuất; chạy trước masterChatBody() gọi L.askAI (master-ui.js:65)
// Budget per-persona là SỐ ĐỀ XUẤT của mục 14.3 — chỉnh ở MỘT chỗ duy nhất.
const DAY_LIMITS = {
  thay_tubinh: {{MAX_LUOT_THAY}},     // đề xuất: 5
  khach_dieuhau: {{MAX_LUOT_KHACH}},  // đề xuất: 1 — nhóm khách AI-light Sảnh Điều Hậu
  khach_cachcuc: {{MAX_LUOT_KHACH}},  // đề xuất: 1 — nhóm khách AI-light Sảnh Cách Cục
};                                    // persona khác không có khóa → mặc định 0 call AI
// `khach_dieuhau` / `khach_cachcuc` là id NHÓM KHÁCH AI-light (định nghĩa một chỗ tại mục 04 §4.3,
// chú thích nhóm) — KHÔNG phải id sảnh `dieuhau`/`cachcuc` của halls.js:86/250 và không thuộc
// bảng 20 persona canon của mục 04 §4.3; tiền tố `khach_` tách hai không gian tên.
const HEAT_LINE = {                 // thông báo circuit — ĐÚNG GIỌNG persona, bark ≤ 90 ký tự
  thay_tubinh: 'Thầy viết mệt tay rồi, mai quay lại.',
  van_coc: 'Trà nguội rồi. Mai lão tăng rót chén mới.',
  khong_tiensinh: 'Sổ hôm nay khép. Ngày mai thì hỏi.',
  guest: 'Khách hỏi mai nhé — hôm nay thầy nghỉ ngòi bút.',
};
const key = (p, d) => p + ':' + d;  // dayKey = key ngày; seed kiểu ngày+pid đã có (main.js:56)

export function mayAskAI(persona, dayKey, counter) {
  const cap = DAY_LIMITS[persona] || 0;
  const used = counter.get(key(persona, dayKey)) || 0;
  if (used >= cap) return { mode: 'bark', line: HEAT_LINE[persona] || HEAT_LINE.guest };
  counter.set(key(persona, dayKey), used + 1);
  return { mode: 'ai' };
}

// 429 từ trần 30 call/phút/IP (worker/index.js:159-163): đóng phiên hôm nay, KHÔNG retry dồn —
// cùng luật với 503: AI bị tắt → fallback NGAY không retry (ai.js:2912-2916, ai.js:2801).
export function onRateLimited(persona, dayKey, counter) {
  counter.set(key(persona, dayKey), DAY_LIMITS[persona] || 0);
  return HEAT_LINE[persona] || HEAT_LINE.guest;  // «Thầy viết mệt tay rồi, mai quay lại» — khuôn
}
```

Ba nguyên tắc của circuit: (1) **hết lượt ≠ lỗi** — người chơi nhận bark đúng giọng, không nhận thông báo lỗi kỹ thuật; câu «Thầy đang bận, lát hỏi lại nhé.» (`master-ui.js:95`) giữ cho đường lỗi thật. (2) **hạ chế độ, không khoá cửa** — khi circuit đóng, người chơi vẫn đọc được kịch bản, bark và dữ liệu có sẵn của persona; chỉ phần luận AI tạm nghỉ đến ngày sau (dayKey mới). (3) **một lượt bị circuit chặn vẫn ghi qua logEvent** (khuôn trường `persona` của 14.6) — để chỉ số «lượt bị chặn/ngày» kiểm chứng budget 14.3 là chặt hay lỏng.

## 14.9 Checklist vận hành ngày đầu (bắt buộc, theo thứ tự)

1. **Bật chế độ free.** Admin `AiConfigSet` đặt `mode: 'free'` — lệnh tự đồng bộ kill-switch `ai:enabled` (`admin.js:278-283`). Xác nhận response trả về key đã mask `'***'` + 4 số cuối (`admin.js:285`) — nếu thấy key nguyên văn ở bất kỳ đâu thì dừng và rà lại; key không bao giờ được log.
2. **Xem `free:log`.** Đọc 200 dòng gần nhất (`admin.js:145-163` ghi, `free:log` giữ tối đa 200) — xác nhận mỗi attempt có `ts/ip/status/backend` đúng như `freeRoute` ghi (`worker/index.js:83,89,92`) và thứ tự backend là `z.ai-paid` trước, pool sau (`worker/index.js:64`).
3. **Đếm `cnt`.** Ghi mốc cơ sở `cnt:free_calls` / `cnt:free_ok` / `cnt:free_err` và `dayagg:<ngày>` (`admin.js:145-163`) — đây là số gốc để tính chỉ số 5 của bảng 14.6.3 trong tuần đầu.
4. **Thử 503.** Đặt `mode: 'off'` (`admin.js:282-283`), mở khung «Hỏi Thầy» trong game, xác nhận: worker trả 503 → client fallback NGAY không retry (`ai.js:2912-2916`, `ai.js:2801`), khung hiện «Thầy đang bận, lát hỏi lại nhé.» (`master-ui.js:95`) hoặc luận cục bộ. Bật lại `mode: 'free'`.
5. **Thử kill-switch K1/K2 riêng lẻ.** Đặt `ai:enabled` = 0 (K1 — `admin.js:112-116`) rồi `ai:free_enabled` = 0 (K2 — `admin.js:120-124`), xác nhận chặn xảy ra ở worker trước khi request tới backend (`worker/index.js:165-167`, `worker/index.js:175`); K1/K2 kiểm lại ở MỌI deploy (14.5).
6. **Xem chỉ số Neo theo persona.** Tại Bàn Thầy hỏi 5 câu đại diện (tổng hợp, hẹp, trivial, ứng kỳ, câu muốn tool ngày), ghi lại badge «🎯 Neo X%» / «⚠» sau mỗi lượt (`master-ui.js:81-87`); nếu trường `neoScore` đã mở trong logEvent (14.6.2) thì soát luôn dữ liệu server nhận được; trần 30 sự kiện/phút/IP của logEvent (`admin.js:168-172`) phải đủ cho 5 câu + follow-up.
7. **Kiểm chống drain ở đúng chỗ.** Từ trình duyệt lạ (không thuộc allowlist) gọi thẳng endpoint AI → bị CORS chặn (`worker/index.js:29`); gọi vượt 30 call/phút/IP từ một IP → nhận 429 ở `airl` (`worker/index.js:159-163`) và circuit 14.8 đóng phiên bằng khuôn «Thầy viết mệt tay rồi, mai quay lại.»; nếu phòng thử có nhiều máy chung một IP công cộng thì ghi nhận hành vi chia sẻ quota — xử lý chính thức thuộc mục 13.

## 14.10 Bảng ranh giới: đã code và đề xuất (để không ai đọc nhầm)

| Đã có trong code (dẫn được dòng) | Đề xuất của mục này (chưa có dòng nào) |
|---|---|
| 3 tầng key/proxy, user không cần key (`ai.js:245-247`), Capacitor resolve proxy (`ai.js:2851-2854`) | Bảng budget per-persona 14.3 và mục tiêu ≤ 5 call/ngày/IP |
| Mask key trả admin (`admin.js:285`, `admin.js:291-293`) | Circuit client `mayAskAI`/`onRateLimited` + `HEAT_LINE` theo giọng |
| stripTools pool — mất 38 tool khi rơi pool (`worker/index.js:62,79`), 503 khi hết backend (`worker/index.js:95`) | Khuôn PERSONA «hôm nay không tool» theo rule 13-14 (14.4.3) — tín hiệu truyền về client là việc của mục 03 |
| 503 → fallback NGAY không retry; leo thang tắt tools → tắt thinking → local (`ai.js:2912-2916`, `ai.js:2801`, `ai.js:2799-2802`, `ai.js:2711-2719`) | Mở trường logEvent `{persona, neoScore, isLocalFallback, backend}` — ranh giới đo ở 14.6.2 |
| `log_error` POST `/api/log-error` (`ai.js:1937-1941`); `logEvent` 30/phút/IP (`admin.js:165-172`); `logFreeUsage` + `cnt:` + `dayagg:` + `free:log` (`admin.js:145-163`) | Cả 6 ngưỡng cảnh báo của bảng 14.6.3 (60%, 3 lượt/ngày, 20%, 50%…) — đo 1 tuần rồi chốt |
| `checkNeo` badge 🎯/⚠ (`master-ui.js:81-87`); nhãn «Luận cục bộ» (`master-ui.js:85-86`); «Thầy đang bận…» (`master-ui.js:95`) | Counter đếm lượt bị silent-drop của logEvent (chỉ số 6) |
| CORS allowlist / blacklist / UA 403 / rate 120 + 30 (`worker/index.js:28-33, 107-112, 127-129, 132-139, 159-163`) | Quy ước persona mới: không thêm route, logEvent không mang brief (14.7) |

Chốt lời mục: con số duy nhất của mục này mà không phải đề xuất là các trần kỹ thuật server (30/phút/IP, 120/phút/IP, 90 giây/backend, 6 step / 9 attempts, 200 dòng log) — còn lại, bảng budget và cả sáu ngưỡng chỉ là kế hoạch đo có nguồn rõ ràng, chờ một tuần số liệu thật để đóng dấu.
