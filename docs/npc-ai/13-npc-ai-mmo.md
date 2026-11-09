# 13 · NPC-AI trong phòng MMO (/ws/quan): đồng bộ gì, không đồng bộ gì

> **Tóm tắt mục.** Phòng MMO của Huyền Quán chỉ đồng bộ hình bóng và hành vi nhỏ của người chơi: đi lại, đổi trang phục, cảm xúc, cụm từ whitelisted, ghế ngồi — các gói `mv / cos / emo / say / seat / join / leave / count` của TownShard (`worker/quan-room.js:98-180`). Mục này chốt ranh giới đồng bộ cho NPC-AI theo bốn quyết: **Quyết 1** hội thoại Thầy (panel AI) là của riêng người mở panel, không bao giờ đi qua /ws; **Quyết 2** nhãn ✓/❓ của khách giữ nguyên trạng render client, không đồng bộ trong đợt này; **Quyết 3** khách procedural theo pid — người khác thấy nhân vật 3D đứng chờ nhưng story riêng chỉ thuộc về chủ nhân của nó, bark chung tối đa là tên + dấu; **Quyết 4** quota 30 call/phút/IP dùng nguyên trạng, rủi ro nhiều người chung một IP (NAT quán cà phê / trường học) là rủi ro **đã chấp nhận** và được ghi rõ ở đây. Thiếu ranh giới này, mọi mục hồ sơ phía sau dễ viết thoại «chung phòng» sai — chữ của một người hiện lên đầu người khác, hoặc người viết hứa «mỗi người một quota» điều worker chưa từng có.

---

## 1. Hiện trạng: phòng MMO đang đồng bộ cái gì

### 1.1 Kênh /ws/quan → TownShard

Người chơi vào phòng chung qua WebSocket `/ws/quan?room=N`. Worker chỉ làm hai việc: kiểm tra `Upgrade: websocket`, kiểm Origin trong allowlist, rồi dẫn socket về Durable Object TownShard có tên cố định `town-N` (`worker/index.js:114-122` — pathname :115, origin :118, giới hạn phòng `MAX_ROOMS - 1` :120, `idFromName('town-' + room)` :121). Mỗi phòng là một «thị trấn» độc lập: người ở phòng 0 không bao giờ thấy người ở phòng 1, và trình tự sinh khách bên dưới cũng tính theo từng phòng như thế.

TownShard là máy chủ relay tối giản, dùng WebSocket Hibernation API để phòng vắng thì ngủ không tốn CPU (`worker/quan-room.js:1-6`). Toàn bộ những gì nó relay qua lại, tôi liệt kê nguyên văn để làm căn cứ ranh giới:

| Gói | Nơi phát trong TownShard | Ý nghĩa |
|---|---|---|
| `welcome / join / count` | `quan-room.js:98-105` | chào người mới, phát danh sách người đang ở phòng |
| `mv` | `quan-room.js:110-119` | toạ độ đi lại (qua sanity `P.sanityMv`) |
| `cos` | `quan-room.js:129-132` | đổi trang phục / phụ kiện |
| `emo` | `quan-room.js:133-135` | cảm xúc (vẫy tay, cúi chào…) |
| `say` | `quan-room.js:136-138` | cụm từ bong bóng — **chỉ key whitelisted** `P.PHRASES` (`protocol.js:130`) |
| `seat / seats` | `quan-room.js:139-151` | ngồi / đứng ở ghế trà |
| `leave` | `quan-room.js:173-181` | người rời phòng |

Nhìn bảng này thấy ngay điều mấu chốt: **không có bất kỳ gói nào mang chữ hội thoại tự do, gói nào mang dữ liệu NPC, hay gói nào mang kết quả AI.** Gói `say` duy nhất có chữ trong phòng là bong bóng cụm từ cố định («Chờ mình chút.» — `protocol.js:59`) — client gửi key, server relay key, người nhận giải key về cùng một câu tiếng Việt trong `PHRASES` (`net.js:121-126`). Đây là thiết kế chống lộ dữ liệu có chủ ý: văn bản tự do không được relay, chỉ key trong danh sách trắng được relay. Tương tự, client có thể gửi gói `solve` (slot, ngày, án đã giải — `protocol.js:139`) nhưng TownShard **không có case nào bắt `solve`** — nó rơi vào `default` của switch (`quan-room.js:166-167`) và chết ngay tại máy chủ. Nghĩa là: giải án xong, dấu ✓ của khách chỉ đổi trên máy của người giải, không ai khác biết.

### 1.2 Nhãn khách hiện tại là render thuần client

Nhãn của khách hỏi việc trong sân được render mỗi khung hình trên máy mỗi người: `const txt = \`${info.npc.call} ${info.done ? '✓' : '❓'}\`` (`render3d.js:816`), gán vào phần tử nhãn chỉ khi chữ đổi. `info.done` đến từ `S.cases` — trạng thái án giải cục bộ của chính máy đó; khi `done` thì dấu ❓ biến thành ✓ và marker vàng ngừng quay (`render3d.js:813-814`). Khách còn quay nhìn người chơi lại gần trong bán kính 6 và wave/bow một lần (`render3d.js:805-807`) — hành vi cục bộ theo vị trí người xem, mỗi người nhìn một góc riêng, không ai cần biết ai đang nhìn ai.

Vì thế nhãn ✓/❓ mà mỗi người thấy là **nhãn của thế giới riêng của mình**: người A đã giải khe 0 thì A thấy «Nguyễn Minh ✓», người B đứng cạnh chưa giải thì B thấy «Nguyễn Minh ❓». Hai người cùng phòng, cùng khách tên Nguyễn Minh đứng cùng chỗ, nhưng dấu khác nhau — và điều này là đúng, không phải lỗi (lý do ở mục 3).

### 1.3 Khách procedural theo pid — mỗi người một bộ khách riêng

Khách hỏi việc hôm nay sinh bằng hạt giống `ngày · khe · pid`: `npcs = [0, 1, 2].map((i) => makeNpc(\`${d}:${i}:${pid}\`))` (`main.js:56`), trong đó `pid` đọc từ `localStorage 'huyenquan:pid'` của từng thiết bị (`main.js:55`); comment tại `main.js:49` viết thẳng: «mỗi người một bộ khách riêng». Cùng một máy quay lại ngày mai sẽ gặp đúng bộ khách cũ (hạt giống lặp được), nhưng hai người khác pid trong cùng phòng sẽ gặp hai bộ khác nhau: A có «Nguyễn Minh» ở khe 0 thì B có thể là «Trần Lan» ở khe 0.

Đây là nguyên nhân gốc của mọi ranh giới phía sau: **nhân vật khách A thấy không trùng nhân vật khách B thấy**. Không có cách nào — và không nên có — để máy B vẽ đúng cây khách của máy A, vì cây đó sinh từ pid của A (dữ liệu thiết bị, không relay) và kể chuyện bằng lá số riêng của A.

### 1.4 Hội thoại Thầy hiện đang sống ở đâu

Panel AI «Thầy luận» mở từ các cửa vào (`masterChatBody` — `master-ui.js:32`); thư viện `ai.js` + `neo-checker.js` tải lười bằng dynamic import có retry (`master-ui.js:48-51`). Mỗi lượt hỏi gọi `L.askAI(q, R, L.getConfig(), …)` (`master-ui.js:65`) — chữ stream về rơi vào DOM của panel chỉ mình người đó thấy, token gộp theo khung hình (`master-ui.js:69-72`). Điểm quan trọng nhất cho mục này: API mà game nhận lại có `masterSay` — và `masterSay` **chỉ gán bong bóng cục bộ**: `masterSay(text) { masterBubble = { … } }` (`main.js:197`, biến khai báo tại `main.js:46`). Không gọi `net.send`, không phát bất kỳ gói gì qua /ws. Nghĩa là khi Thầy «nói» trên đầu nhân vật Thầy 3D, chỉ người mở panel thấy câu đầu của luận án; người đứng cạnh trong phòng MMO thấy Thầy im lặng. Panel đóng thì luồng bị huỷ qua AbortController + MutationObserver (`master-ui.js:104-106`) — vòng đời hội thoại gắn chặt với panel của một người, đúng như ranh giới bên dưới.

---

## 2. Quyết 1 — Hội thoại Thầy (panel AI) là của riêng người mở panel

### 2.1 Chốt

**Hội thoại Thầy không đồng bộ qua /ws. Đúng chữ, không ngoại lệ.** Người mở panel thấy toàn bộ câu hỏi, câu trả lời stream, badge Neo, chip gợi ý; chín người còn lại trong phòng thấy… không gì cả. Không có gói `ai_text`, không có gói `ai_summary`, không có «bản tóm tắt luận án» broadcast cho phòng.

### 2.2 Vì sao không broadcast — ba lý do, xếp theo trọng lượng

**(a) Riêng tư của thân chủ.** Câu hỏi người chơi gửi cho Thầy là chuyện đời của chính họ: «tôi có nên đổi việc», «con tôi khắc tôi không», «năm sau có nên cưới». Đây là lớp nội dung nhạy cảm nhất của app — bật broadcast là biến quán bói thành nơi nghe lén: người khác đọc được mình đang lo gì. Bản thân câu hỏi nhập vào input `maxlength=300` trong panel riêng (`master-ui.js:37`), toàn bộ vòng đời gắn với panel (`master-ui.js:104-106`) — mọi thiết kế xung quanh nó đều đã chọn một người một khung thoại. Broadcast sẽ đảo ngược quyết định gốc ấy bằng một dòng code relay, mà cái giá phải trả là niềm tin của người chơi: không ai muốn hỏi Thầy giữa đông người nghe được. Lớp PERSONA-CHUNG của bộ 06 cũng đã chốt hướng riêng tư này — lời Thầy chỉ dành cho thân chủ đang ngồi.

**(b) Token và băng thông.** Mỗi lượt hỏi đeo theo brief lá số dựng từ `buildChartBrief(R)` (~33 section, kích thước chục nghìn token — dữ liệu nền `src/engine/ai.js:254-1079`, cache `ai.js:169-170`). Broadcast nguyên văn là xả chục nghìn token mỗi lượt vào chín socket; broadcast tóm tắt nghĩa là một lớp kết xuất thêm (một module mới, một đề tài mới, một bộ lọc mới) — tất cả chỉ để người không cần đọc đọc được thứ họ không cần đọc. Quota server đã chặt sẵn: 30 call/phút/IP và tổng site 120 req/phút/IP (`worker/index.js:159-163`, `:132-139`) — băng thông broadcast chỉ làm tình hình tệ đi, không làm tốt lên thứ nào.

**(c) Kỹ thuật lệch trạng thái.** Hội thoại gắn với `R` — lá số **đã tính trên máy đó** (`master-ui.js:65` truyền `R` vào `askAI`). Máy khác trong phòng không có cùng `R` (pid khác → khách khác → lá số khác), nên chữ broadcast sang sẽ không khớp bất kỳ ngữ cảnh nào của người nhận — dấu Neo của Thầy (`checkNeo`, `master-ui.js:82-83`) sẽ cháy đỏ ở phía bên kia vì dữ liệu neo không tồn tại ở đó. Relay một câu trả lời neo vào lá số của người A sang máy của người B là tự tạo hallucinate: câu đúng mà đọc sai cảnh.

### 2.3 Biên cứng: những chữ nào không bao giờ rời máy

Vì quyết này là «không bao giờ», tôi viết biên cứng để các mục sau không tự mở:

1. **Không gói tin mới** trong `protocol.js` mang nội dung hội thoại Thầy (không `ai`, không `master`, không `say_custom`). Thêm key vào `PHRASES` là lớp duy nhất được phép nới cụm từ chung phòng, và key đó phải là câu **tổng quát, không đụng lá số**.
2. **Không relay qua proxy khác** (REST poll, SSE phụ, kênh song song). Chỉ có một kênh realtime `/ws/quan`, và quyết 1 khoá nó.
3. **Bong bóng Thầy 3D chỉ local.** `masterSay` giữ nguyên dạng gán biến cục bộ (`main.js:197`). Người khác thấy Thầy ngồi viết, thấy ngẩng lên nhìn người đứng gần (`render3d.js:683-685` — hành vi đã có), nhưng không thấy chữ của người khác.

Ngoại lệ duy nhất trong tương lai, và cũng chỉ là **gợi ý viết**, không phải cam kết: nếu một ngày muốn phòng «sống» hơn (người khác thấy «Thầy đang luận cho một khách»), dòng chữ đó phải là câu chung vô danh kiểu `say`-key («Thầy đang luận cho một khách.»), không kèm tên, không kèm chủ đề, không kèm bất kỳ dữ kiện lá số. Đặt nó vào `PHRASES` (whitelisted, `protocol.js:130`) là đủ — không cần gói mới. Nhưng đợt này **không làm**.

---

## 3. Quyết 2 — Nhãn ✓/❓ của khách: chốt không đồng bộ trong đợt này

### 3.1 Hiện trạng và bản chất của dấu

Nhãn khách render client theo `info.done` cục bộ (`render3d.js:816`, marker ẩn khi done — `render3d.js:813`). Gói `solve` không được relay (`protocol.js:139` gửi, TownShard không bắt — `quan-room.js:166-167`). Vậy dấu ✓/❓ hiện là **tình trạng công việc của mỗi người với chính bộ khách của mình**.

Có nên xem đó là lỗi «hai người thấy khác nhau»? Không. Vì khách procedural theo pid (mục 1.3), bộ khách A thấy khác bộ khách B thấy — B không có «Nguyễn Minh» của A để đọc dấu ✓/❓. Đồng bộ dấu mà không đồng bộ khách thì dấu gắn vào nhân vật nào? Đồng bộ cả khách thì phải relay pid — tức bày dữ liệu thiết bị của A cho cả phòng, phá đúng lớp riêng tư mục 2 vừa chốt. Nhãn hiện tại là nhãn của thế giới riêng của mỗi người; hai người đứng cạnh nhau nhìn «cùng» nhân vật nhưng mỗi người nhìn một phiên bản của thị trấn riêng — đây là mô hình mỗi-một-phiên-bản, đúng bản chất của thế giới sinh theo hạt giống cá nhân.

### 3.2 Chốt đợt này

**Không đồng bộ.** Không thêm gói, không thêm trường trong `pub()` (danh sách trường phát cho phòng — `quan-room.js:20` giữ nguyên: `id, u, name, robe, acc, cos, look, title, x, y, h, s, a` — không có gì về NPC). Nhãn, marker, wave/bow tiếp tục là render client trên dữ liệu cục bộ.

### 3.3 Nếu một ngày đồng bộ — con đường duy nhất được phép (đề xuất, không cam kết lịch)

Phương án duy nhất không phá ranh giới mục 2 là để **TownShard phát tín hiệu lớp, không phát dữ liệu**: một người giải án khe *s* của *chính mình* thì phòng nhận gói `case_done { slot }` — chỉ một số khe, không tên, không hoàn cảnh, không chữ AI. Người nhận dùng nó chỉ để **phát sáng môi trường**: đếm «hôm nay quán đã giải được n án», bật hiệu ứng đèn pháo khi n vượt ngưỡng. Không đổi nhãn của ai, không đổi story của ai — khách của B vẫn là khách của B. Pseudo-code đầy đủ ở mục 8. Việc này **khoanh vùng trước, không hẹn ngày**: cần (i) chốt tin `case_done` vào protocol với cùng chuẩn `rateGate` (`quan-room.js:78-83`), (ii) test chống spam (một người phát lặp), (iii) chốt ngưỡng hiệu ứng — ba điều nằm ngoài phạm vi đợt này.

---

## 4. Quyết 3 — Khách procedural trong phòng: hình chung, story riêng

### 4.1 Ai thấy gì trong phòng MMO

Bảng chân trị, trích dẫn nguyên dòng:

- **Người khác THẤY** nhân vật 3D khách của mình: avatar `npc_merchant`/`npc_villager` đổi theo khe chẵn/lẻ (`render3d.js:798-800`), đứng đúng chỗ khe chờ, marker ❓ vàng xoay (`render3d.js:813-814`), wave/bow khi người chơi lại gần (`render3d.js:805-807`). Nhưng đó là **khách của chính họ** — mọi người trong phòng «thấy khách» theo phiên bản pid của mình, tại cùng toạ độ khe.
- Người khác **KHÔNG THẤY** story của khách đó: câu hỏi của khách («Tôi đang tính đổi việc…» — `npc.js:23-31`), nghiệm lá số trong R của khách, bước «Năm nay» (`npc-deep.js:41`), hoàn cảnh makeStory — tất cả sống trong panel và trạng thái cục bộ của chủ nhân.
- Người khác **KHÔNG THẤY** panel Thầy mở, không thấy chữ Thầy (mục 2), không thấy badge Neo, không thấy chip gợi ý.

Tức là khi 10 người đứng trong sân quanh ba khe chờ, thị trấn có 30 thân ảnh khách trông chung chung giống nhau, nhưng mỗi người thấy 3 trong 30 là «khách thật của mình» — còn 27 thân ảnh kia chỉ là phông nền của người khác (máy B thậm chí không vẽ khách của A nếu bộ của B không có ai ở khe đó; mọi máy chỉ vẽ `caseNpcs` của mình — `render3d.js:788-816`). Điều này không tạo mâu thuẫn hiển thị vì khách đứng ở toạ độ khe cố định trong sân (`court.js:47-49`) — ai nhìn chỗ khe cũng thấy *một* khách đứng đó: hình khối chung, danh tính riêng.

### 4.2 Ranh giới bark chung vs story riêng — quy định viết rõ

**Bark chung của khách trong phòng chỉ được chứa: tên khách + dấu trạng thái (`✓` / `❓`). Hai thành phần, hết.** Mọi bark khác — nghề, tuổi, danh xưng theo tuổi (`npc.js:33-38`), câu hỏi 7 mẫu (`npc.js:23-31`), cảm ơn 3 mức (`case-ui.js:236`), nghiệm R, hoàn cảnh makeStory, bước «Năm nay» — đều là **story riêng**, chỉ hiện khi chính chủ mở án, không bao giờ xuất hiện dưới bất kỳ hình thức «chung phòng» nào: không bong bóng trên đầu khách cho người khác đọc, không dòng chữ toast cho cả phòng, không key `PHRASES` chứa nó, không overlay trên máy người khác.

Cấm tuyệt đối — viết thành luật để mục sau soi được:

- **Cấm bark lộ hoàn cảnh riêng của người khác.** Bark không được chứa 「nghiệm R」, dấu hiệu lá số của bất kỳ người chơi nào khác trong phòng (hành ngọ, Dụng Kim, thiếu Mộc…). Người A không được thấy bark nào trên đầu nhân vật khe 0 của máy A mà nội dung của nó nói về lá số hay hoàn cảnh của B.
- **Cấm bark kể hoàn cảnh makeStory cho người không mở.** Hoàn cảnh («mới mua nhà», «đang tính đổi việc», «sắp cưới») là chính đề của án — chỉ tồn tại trong panel của chủ. Đưa lên bong bóng chung là spoil chính mình: người khác đọc được đề án trước khi chủ giải — và tệ hơn, nếu máy B không có cùng khách thì dòng chữ ấy còn không có nhân vật để gắn, thành thoại trôi lơ lửng không chủ.
- **Bark chung không mời gọi, không châm chọc dấu của người khác.** Không có bark kiểu «người đó còn ❓ kìa» — dấu là trạng thái riêng, chế nhạo dấu của người khác vi phạm luật không bark chê của bộ 06 (§6: «không bark chê lá số xấu của người chơi»).

Vì sao ranh giới này là cốt lõi của mục? Vì mọi mục hồ sơ phía sau (bark của từng NPC, thoại mở màn án) đều phải hỏi một câu: *câu này là bark chung phòng hay story riêng chủ?* Trả lời sai là sinh thoại «chung phòng» sai — chữ của một người hiện lên trên máy người khác, hoặc ngược lại, chữ đáng chung lại bị khóa cục bộ. Mục này là bản quy chiếu duy nhất cho câu hỏi đó.

---

## 5. Quyết 4 — Quota 30 call/phút/IP khi cả phòng NAT chung

### 5.1 Worker dùng nguyên trạng, KHÔNG đổi

Mọi prefix LLM dính budget riêng `airl:<ip>:<phút>` — 30 call/phút/IP, vượt trả 429 kèm `Retry-After: 60` (`worker/index.js:159-163`); phía trước còn có tổng 120 req/phút/IP (`worker/index.js:132-139`). **Đợt này worker giữ nguyên mọi dòng này.** Không thêm khấu trừ theo session, không thêm bảng đếm theo phòng, không thêm «phần thưởng quota cho phòng». Cơ chế xử dụng được thông qua mục 14 của bản thiết kế — circuit phía client — không sửa worker (`/ws/quan` cũng không phải prefix LLM: đường WebSocket đứng riêng ở `worker/index.js:114-122`, không dính rate-limit AI).

### 5.2 Hành vi khi 429 — hạ xuống bark / kịch bản + thông báo đúng giọng

Client đã có vòng lặp leo thang: lỗi 503 từ worker → fallback NGAY không retry (`ai.js:2912-2916, 2801` theo dữ liệu nền), hết tools → tắt thinking → composeAnswer local (`ai.js:2802, 2826-2827`, `master-ui.js:85-86` hiện «Luận cục bộ»). 429 được xếp vào cùng họ «AI không phục vụ được»: một khi circuit phía client (mục 14) gãy vì 429, panel và các cửa vào AI chuyển về **bark + kịch bản** — game vẫn chạy trọn khi AI tắt là luật nền của bộ 06 (K1/K2, §2 PERSONA-CHUNG). Thông báo cho người chơi phải đúng giọng, không doạ, không đổ lỗi:

```text
{{thong_bao_429}}
Mình: «Thầy đang nghỉ tay một lát. Ít phút nữa hỏi lại thầy nhé.»
```

Quy tắc giọng: không dùng chữ «lỗi», «quota», «bị chặn» trước mặt người chơi; giữ nguyên thái độ của Thầy; luân chuyển người chơi về nội dung không-AI (giải án kịch bản, đi xem sảnh, thả đèn hoa đăng) trong lúc chờ `Retry-After: 60`.

### 5.3 Rủi ro nhiều người một IP — CHẤP NHẬN, ghi rõ

Quán cà phê, trường học, ký túc xá: cả phòng dùng chung một IP ra ngoài (NAT). 30 call/phút/IP là **cả phòng** chia 30, không phải mỗi người 30. Người 1–6 hỏi liên tục trong một phút là người thứ 7 trở đi gặp 429 dù mình chưa hỏi gì. **Đây là rủi ro đã chấp nhận.** Ghi rõ để không ai về sau «phát hiện» nó như lỗi rồi sửa lung tung:

1. **Không hứa «mỗi người một quota».** Không có identity per-user ở tầng worker để chia — `hello` chỉ nhận `pid` từ client tự khai (`protocol.js:107`, `quan-room.js:96`); con số đếm của `airl` là IP (`worker/index.js:160`). Chia theo pid nghĩa là tin pid tự khai — chống được chừng đó thôi, và đòi thêm một bảng trạng thái per-user trong KV mỗi lượt call: chi phí viết/đọc KV trong đường nóng của proxy LLM, một mặt biến hình khác của cùng rủi ro (throttle máy chủ trước khi throttle người dùng), chưa kể pid đặt bằng localStorage là con số tự đổi được. Rủi ro chấp nhận, không xây cơ chế mới đợt này.
2. **Giảm thiểu bằng client, không bằng server:** circuit phía client (mục 14) gộp lượt, cấm bấm đúp, gộp token rAF (`master-ui.js:69-72` đã có); người chơi gặp 429 được dẫn về nội dung kịch bản (mục 5.2) — tức công bằng hơn là giảm số call *thừa* chứ không cấp quota thêm.
3. **Điều chỉnh số nếu một ngày phải điều chỉnh:** chỉ đụng hằng 30 tại `worker/index.js:162` — một dòng, một quyết riêng, có test riêng; không đan vào đợt NPC-AI này.

---

## 6. Ghi với Thầy Tử Bình: chỉ người mở panel mới gọi AI

Nguyên tắc «một panel — một luồng»: chỉ người đang mở panel Thầy mới phát call AI. Phòng 10 người **không phải** 10 call đồng thời — là 0 call cho tới khi có người mở panel, và tăng theo số người *đang mở*, không theo số người đang ở phòng. Điều này đến từ chính kiến trúc hiện tại: `askAI` chỉ nằm trong vòng đời panel (`master-ui.js:53-100`), panel đóng là `abort` (`master-ui.js:104-106`) — không có chỗ nào trong code phát call khi panel không mở, và thiết kế không cho phép thêm chỗ phát ngoài vòng đời đó (luật «AI chỉ nói, không làm» và vòng đời panel gắn chặt của bộ 06).

Nhưng ghi tiếp cho đủ hình: **khi 10 người cùng mở panel** (cùng xem Thầy, cùng hỏi) thì đúng là 10 luồng độc lập cùng đếm về một IP chung nếu phòng NAT (mục 5.3) — hiện tượng vẫn rơi vào quota chung IP, đã nêu quyết 4, không có ngoại lệ «phòng đông thì nới». Điều luật đi kèm cho thiết kế thoại của Thầy: thư thoại **không được khuyến khích nhiều người cùng mở panel trong cùng phút** — không bark kiểu «vào hỏi Thầy đi, cả phòng hỏi luôn», không chip gợi ý nhắc cả phòng hỏi cùng lúc. Ngược lại, thoại dẫn người hết AI-cần hỏi về kịch bản là hợp lệ.

---

## 7. Bảng đồng bộ tổng hợp

Câu hỏi của bảng: mỗi thành phần NPC-AI, qua /ws không? người khác trong phòng thấy gì? gắn nhãn gì? Cột «nhãn gì» dùng ngôn ngữ người chơi thấy, không phải tên kỹ thuật.

| Thành phần | Qua /ws? | Người khác thấy gì | Nhãn gì |
|---|---|---|---|
| Hội thoại Thầy (panel AI) | **Không** (Quyết 1) | Không thấy gì — Thầy im lặng, không panel, không chữ | Không có nhãn |
| Bong bóng Thầy trên đầu nhân vật 3D | **Không** (`masterSay` gán local — `main.js:197`) | Không thấy | Không có nhãn |
| Nhãn ✓/❓ của khách | **Không** (Quyết 2) | Nhìn thấy nhân vật khách của chính mình, dấu là của mình | «\{{ten_khach}} ❓/✓» trên máy chính mình (`render3d.js:816`) |
| Khách procedural (3D, marker, wave/bow) | **Không** (Quyết 3) | Mỗi người thấy bộ khách pid của mình đứng ở cùng toạ độ khe (`court.js:47-49`) | Nhãn của máy chính mình, không phải của người khác |
| Bark chung | **Không relay nội dung** — chỉ key `PHRASES` whitelisted (`protocol.js:130`, `quan-room.js:136-138`) | Câu tổng quát gắn người phát: «\{{ten_nguoi_choi}} \{{icon}}» | Tên + icon, không nội dung lá số |
| Story riêng (câu hỏi khách, nghiệm R, hoàn cảnh makeStory, «Năm nay») | **Không** (Quyết 3) | Không thấy — chỉ chủ mở án mới đọc được | Chỉ trong panel của chủ |
| Đi lại / trang phục / cảm xúc / ghế | **Có** (`mv/cos/emo/seat` — `quan-room.js:110-151`) | Thấy hình bóng người chơi khác di chuyển, mặc, hành động | Tên người chơi (`pub()` — `quan-room.js:20`) |
| Gói `solve` (giải án xong) | **Không relay** (`protocol.js:139` gửi, TownShard không bắt — `quan-room.js:166-167`) | Không biết ai vừa giải xong | Dấu ✓ chỉ đổi trên máy người giải |
| Gói `case_done { slot }` (phương án tương lai, mục 8) | **Đề xuất, chưa làm** | Chỉ thấy hiệu ứng môi trường (đếm, đèn), không đổi nhãn/story của ai | Không có nhãn trên người |

Bảng này là bản quy chiếu duy nhất cho mọi mục hồ sơ phía sau: trước khi viết bất kỳ thoại nào cho một nhân vật trong phòng MMO, tra bảng này trước — thoại thuộc dòng nào thì sống ở máy ai.

---

## 8. Pseudo-code nhãn khách trong TownShard context (phương án tương lai — KHÔNG thi hành đợt này)

Đánh dấu rõ: đây là **đề xuất được phép** (Quyết 2 mục 3.3), không cam kết lịch, không nằm trong đợt này. Nó phát **tín hiệu lớp** — không phát tên, không phát hoàn cảnh, không phát chữ AI. Đặt trong worker `quan-room.js` phía TownShard, dùng đúng phụ trợ sẵn có:

```js
// PHƯƠNG ÁN TƯƠNG LAI (Quyết 2, mục 3.3) — KHÔNG nằm trong đợt này.
// Client gửi { t: 'case_done', slot: <0..2> } khi chính nó giải xong khe đó.
// TownShard chỉ relay một số khe — không relay tên, pid, hoàn cảnh, chữ AI.
// Người nhận chỉ dùng nó để HIỆU ỨNG MÔI TRƯỜNG (đếm «quán đã giải n án»),
// KHÔNG đổi nhãn ✓/❓ của ai, KHÔNG đổi story của ai.

// --- protocol.js: thêm 1 key vào PHRASES-map mới (không đụng PHRASES cũ) ---
export const CASE_SLOTS = 3; // số khe hỏi việc trong sân (court.js:47-49)

export function parseCaseDone(m) {
  if (m?.t !== 'case_done') return null;
  const slot = Number(m.slot);
  if (!Number.isInteger(slot) || slot < 0 || slot >= CASE_SLOTS) return null;
  return { t: 'case_done', slot }; // CHỈ số khe. Không tên. Không hoàn cảnh. Không chữ.
}

// --- quan-room.js: trong switch (m.t) của webSocketMessage ---
case 'case_done': {
  // dùng cùng cửa gate chống spam như mọi gói khác (quan-room.js:78-83)
  const n = (await this.ctx.storage.get('case_done:cnt')) || 0;
  await this.ctx.storage.put('case_done:cnt', n + 1);
  this.broadcast({ t: 'case_done', slot: m.slot, n: n + 1 }, ws);
  break;
}

// --- client (main.js › onEvent): xử lý ở phía nhận ---
else if (ev.t === 'case_done') {
  // HIỆU ỨNG MÔI TRƯỜNG: «Quán đã giải được {{n}} án hôm nay.» trên đèn sân.
  // KHÔNG đụng S.cases, KHÔNG đổi nhãn khách của máy mình, KHÔNG đổi story.
  fxSolveRing(ev.slot);              // vòng sáng nhẹ tại khe, 2 giây rồi tắt
  setQuanSolveCount(ev.n);           // bộ đếm chung, hiển thị trên tấm bảng sân
}
```

Điều kiện đóng gói phương án (điều kiện để nó được thực thi một ngày nào đó, không phải lịch): (i) `parseCaseDone` vào `protocol.js` với test riêng trong `scripts/test-quan-protocol.mjs`; (ii) test chống spam — một socket phát lặp `case_done` bị `rateGate` chặn như mọi gói; (iii) ngưỡng hiệu ứng chốt trong một mục hồ sơ riêng; (iv) không có bất kỳ đường nào từ `case_done` tới nhãn khách hay story — dùng `grep case_done` trên `src/game/render3d.js` phải trả 0 kết quả.

---

## 9. Flow 429 phòng NAT (cả phòng chung một IP)

Bước theo trình tự, mỗi bước ghi nơi xảy ra:

1. **10 người trong phòng NAT chung** — một IP ra ngoài. Mọi call AI của cả phòng dồn về một ô đếm `airl:<ip>:<phút>` (`worker/index.js:160-161`).
2. **Người A mở panel Thầy, hỏi** → call thứ 1 đi qua prefix LLM, ô đếm +1, stream trả về bình thường. Chỉ panel của A hiện chữ; chín người khác không thấy gì (Quyết 1).
3. **Người B–J cũng mở panel trong cùng phút** → mỗi lượt hỏi của họ cộng vào cùng ô. Ô vượt 30 → mọi call kế nhận 429 kèm `Retry-After: 60` (`worker/index.js:162`) — kể cả call của người chưa từng hỏi (đây chính là rủi ro chấp nhận, mục 5.3).
4. **Client nhận 429** → circuit phía client (mục 14) gãy: tắt gọi lại trong 60 giây, không retry spam.
5. **UI hạ xuống bark/kịch bản**: panel hiện «Luận cục bộ» hoặc thông báo đúng giọng mục 5.2 (`{{thong_bao_429}}`); các cửa vào AI (`stations.js:119`, `case-ui.js:239/373/460/509`, `que-ui.js:191`, `vanmenh-ui.js:46` — đều qua gate `if (!FEATURES.ai || !R) return null` theo dữ liệu nền) chuyển sang nhánh kịch bản composeAnswer local (`master-ui.js:85-86`), game chạy trọn.
6. **Hết 60 giây** → ô đếm mới, panel bật lại bình thường cho người còn muốn hỏi; nếu vẫn 429, lặp bước 4–5 — không treo, không toast đỏ toàn phòng, không broadcast trạng thái lỗi cho người khác (Quyết 1 mở rộng: kể cả lỗi cũng là của riêng người gặp lỗi).

Điểm cần test cho flow này (ghi để mục kiểm tra sau nhắc): một máy gửi liên tục >30 call trong một phút phải nhận đúng 429 với `Retry-After: 60`; UI ở bước 5 không hiện chữ kỹ thuật «429/airl/rate limit» cho người chơi.

---

## 10. Quy tắc bark chung vs story riêng — hai khối ví dụ

**Khối 1 — ĐÚNG: bark chung chỉ tên + dấu.** Đây là toàn bộ nội dung được phép của bark chung:

```text
{{bark_chung_hop_le}}
Nhãn: "{{ten_khach}} ❓"        // vd «Nguyễn Minh ❓» — render3d.js:816
Nhãn: "{{ten_khach}} ✓"        // vd «Nguyễn Minh ✓» — sau khi chính chủ giải xong
Bong bóng say-key: "{{ten_nguoi_choi}} 👋"  // icon + tên người chơi, câu trong PHRASES
```

Chỉ có tên khách (vốn là tên ảo của bộ khách — ai cũng có thể gặp «Nguyễn Minh» trong bộ của mình) và dấu trạng thái của chính máy đó. Không có hoàn cảnh, không có nghiệm, không có câu hỏi, không có cảm ơn.

**Khối 2 — SAI: bark chung lộ story riêng.** Đây là những dòng **cấm** — mỗi dòng vi phạm một luật, ghi lý do cạnh nó:

```text
{{bark_chung_bat_hop_le}}   // TẤT CẢ CÁC DÒNG DƯỚI ĐÂY CẤM
"Nguyễn Minh đang tính đổi việc."        // CẤM — hoàn cảnh makeStory lên chung: spoil đề án
"Nguyễn Minh nhờ xem mệnh thiếu Mộc."    // CẤM — nghiệm R (Dụng Thần của lá số) lên chung
"Trần Lan vừa hỏi Thầy về năm 2027."     // CẤM — lộ hành vi của người chơi khác
"Cả phòng cùng hỏi Thầy đi!"             // CẤM — thúc cả phòng mở panel cùng lúc (mục 6)
"Người ở khe 2 còn ❓ kìa."              // CẤM — châm chọc dấu trạng thái của người khác
"Cách cục của khách kia là bại cách."    // CẤM — chữ kỹ thuật lá số của người khác, vi phạm V6/V7
```

Ba luật gói lại khối SAI: (1) bark chung không chứa **nội dung có chủ** — chỉ chứa nội dung chung trống danh tính lá số; (2) bark chung không nhắc tới **hành động hỏi/giải của người khác**; (3) bark chung không **lôi kéo** cả phòng cùng đốt quota. Mọi mục bark phía sau (bark khách theo khe, bark Thầy ngoài giờ, bark phản diện) phải soi qua ba luật này trước khi ghi vào hồ sơ.

---

## 11. Kiểm tra ghi nhận của mục này

Bốn vật chứng để mọi mục sau đối chiếu: (i) bảng mục 7 là quy chiếu duy nhất về «thoại này sống ở máy ai»; (ii) mục 2.3 là danh sách biên cứng — thêm bất kỳ gói tin nào mang hội thoại là vi phạm Quyết 1; (iii) mục 8 là phương án tương lai duy nhất được phép về tín hiệu giải án, đóng gói bằng 4 điều kiện; (iv) mục 5.3 là lần duy nhất ghi rủi ro NAT — mọi mục khác không được hứa «mỗi người một quota». Điểm kiểm đã chạy lúc viết mục này (kết quả thật): `grep -cE "ai_text|ai_summary|master_" src/game/protocol.js` trả **0** (không có mẫu tự gói tin AI trong protocol); `grep -c "case_done" src/game/render3d.js` trả **0** (phương án mục 8 chưa lọt renderer — giữ 0 cho tới khi nó được phê duyệt và thi hành theo đúng 4 điều kiện của nó). Chú ý đừng dùng mẫu tự quá rộng: `grep -cE "ai|master"` trả 5 vì chữ «ai» trôi vào từ thường như `main` — chỉ báo đúng là mẫu tự gói tin, không phải chữ rời.
