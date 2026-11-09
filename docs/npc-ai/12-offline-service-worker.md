# 12 · Offline mode & service worker — NPC-AI khi mất mạng

**Tóm tắt.** Huyền Quán là PWA thật: có `manifest.webmanifest`, đăng ký service worker `/sw.js` (index.html:2014-2016), và toàn bộ nền MMO đã cam kết «offline-first: mất mạng vẫn chơi đơn» (src/game/main.js:63, src/game/net.js:2). Mục này chốt NPC-AI ăn vào nền đó thế nào. Bốn quyết định: (1) bark + story generator phải là code thuần client trong bundle, nên chạy được cả khi không mạng; (2) «mất mạng» và «AI bị admin tắt» là hai trạng thái hiển thị khác nhau, hai câu chữ khác nhau — quy định cứng; (3) offline không tiêu quota, không ghi telemetry server-side, và hàng đợi telemetry KHÔNG được cache dồn để xả khi về mạng — quyết đợt này; (4) từng thành phần NPC-AI có phân vai rõ khi offline (bảng 12.5-12.6). Không sinh tính năng sync mới trong đợt này; chỉ chốt trạng thái và gate kiểm thử (mục 12.9, gate nằm ở G1/G2 của lộ trình — mục 15, bộ thử chung mục 16).

## 12.1 Hiện trạng PWA — thứ NPC-AI phải bám vào

Trước khi quyết định bất cứ điều gì về offline, cần nói đúng nền đã có. App không phải app web thuần: Chrome/Android cài được lên màn hình chính (manifest.webmanifest, `display: standalone`), và một service worker đang chạy cho mọi người truy cập web.

### 12.1.1 Service worker: network-first, POST luôn đi thẳng, proxy API không cache

`public/sw.js` là một SW ngắn, network-first, đọc như sau:

- **Dòng 1-3**: khai báo.Cache mặc định `'bazi-build'`, kèm chú thích «auto-versioned by Vite plugin (swAutoVersion) — replaced at build time with timestamp». Comment ở dòng 2 nêu nguyên tắc sống còn của SW này: «NETWORK-FIRST, không bao giờ block bằng cache cũ (tránh trắng trang)».
- **Dòng 10**: `if (req.method !== 'GET') return;` với chú thích đúng chữ «POST (AI API) luôn đi thẳng». Mọi request POST — gồm cả POST `/zai` của Thầy AI — **không bao giờ** chạm vào SW. Đây là hằng số của kiến trúc: SW không chặn, không cache, không replay AI.
- **Dòng 12**: cross-origin bỏ qua («không đụng cross-origin — font, v.v.»). Chỉ file cùng origin mới được xét cache.
- **Dòng 13**: các prefix `/zai`, `/nvidia`, `/groq`, `/openai`, `/deepseek`, `/bigmodel`, `/admin`, `/api/` trả về ngay không cache — comment «proxy API + admin + event log: KHÔNG cache (luôn network)». Nghĩa là: kể cả request GET tới proxy AI cũng không bao giờ được SW phục từ cache.
- **Dòng 14-23**: với phần còn lại (assets cùng origin, GET): `fetch(req)` trước; kết quả 200 `type === 'basic'` thì clone bỏ vào cache; mạng ném lỗi thì mới fallback `caches.match(req)`, cuối cùng fallback `/` (sw.js:22 — chú thích «[AUDIT v3] fallback '/'»).

Hệ quả thiết kế quan trọng nhất cho NPC-AI: **mọi thứ muốn chạy offline phải là GET cùng origin, thuộc build, và từng được mở khi có mạng ít nhất một lần** (network-first nghĩa là cache chỉ tồn tại sau lần truy cập đầu). SW không làm gì thêm — không precache danh sách, không background sync, không strategy thứ hai.

### 12.1.2 swAutoVersion: mỗi build một CACHE — version gắn với build, không gắn với module riêng

Plugin `swAutoVersion` ở vite.config.js:10-23 chạy ở `closeBundle()`: đọc `dist/sw.js`, thay dòng `const CACHE = '...'` bằng `'bazi-' + Date.now().toString(36)` và ghi lại. Plugin được đăng ký cho mọi build (vite.config.js:63), chỉ áp bản web (`dist/` — bản `dist-ios` không có SW, vite.config.js:14-16).

Người nghe SW ở sw.js:5-7, khi activate, xoá mọi cache có tên khác cache hiện tại rồi `clients.claim()`. Ghép lại, chu kỳ phiên bản là:

```
build lần N  →  CACHE = 'bazi-<tsN>'  →  người chơi mở app có mạng
             →  SW nhận sw.js mới → activate → xoá 'bazi-<tsN-1>'
             →  lần truy cập tiếp theo mỗi asset GET được lưu lại vào cache build mới
```

Điều này quyết định mô hình versioning của NPC-AI: **«phiên bản module» = «phiên bản build người chơi đang mở»**. SW không có khái niệm cache theo từng module riêng lẻ (tên asset có hash Vite — ví dụ chunk `engine-ai` do manualChunks tách ở vite.config.js:94-96 — nhưng SW cache theo URL, không theo hash logic). Muốn bark/NPC offline đúng bản mới, cả cụm phải nằm trong cùng một build; không có cơ chế «cập nhật riêng module NPC mà không bump build». Pseudo-code ở mục 12.7 chốt quy ước này bằng chữ.

### 12.1.3 Offline-first MMO: mất mạng vẫn chơi đơn — nền chung, không phải chỉ dành cho NPC-AI

Trạm MMO đã tự xử offline từ trước: main.js:63 comment «Mạng (MMO) — offline-first: mất mạng vẫn chơi đơn bình thường»; net.js:2 lặp lại nguyên tắc «Offline-first: không kết nối được thì game vẫn chơi đơn». Cụ thể:

- `net.js:66-68`: WebSocket đóng → set trạng thái `'off'` + retry lui dần (scheduleRetry, net.js:73-77).
- `net.js:180`: khi ngoại tuyến, xin ghế ngồi Trà Thất trả ghế cục bộ (`if (!me) return Promise.resolve(1);`) — «offline-first (mất mạng vẫn chơi đơn) → cấp ghế cục bộ để ngồi trà vẫn chạy».

NPC-AI phải giữ đúng tinh thần này: mất mạng không được biến thành màn hình lỗi chặn chơi, mà là **một trạng thái chạy khác** với hành vi và câu chữ riêng. Hai trạm thuần engine — «La Bàn Đài» (world.js:22) và «Bảng Lịch Ngày» (world.js:25) — vốn không gọi mạng nên giữ nguyên chạy offline; đây là chuẩn mà bark/story gen phải đạt được.

---

## 12.2 Quyết 1 — bark và story generator thuần client: phải chạy được offline

**Quyết.** Bark của NPC (BARK-*, ≤ 90 ký tự theo quy ước 06-18 §6) và story generator của khách NPC (khối chuyện hoàn cảnh, mở rộng của npc-deep) là code **thuần client**: hàm của hạt giống ngày+khe+pid (main.js:56 — `makeNpc(`${d}:${i}:${pid}`)`) và dữ liệu lá số đã tính sẵn. Không mạng, hai thành phần này phải chạy y như có mạng. Đây là điều kiện để cam kết «offline-first» không sập ngay khi NPC-AI lên tàu.

### 12.2.1 Điều kiện để điều đó đúng — ba ràng buộc kỹ thuật

1. **Module nằm trong bundle client.** Nhóm persona/bark/story (tên làm việc `npc-personas`, tách theo 06) phải là module thuần theo khuôn `gu-gongan.js` / `namhan.js` / `kinh-tu.js` — dữ liệu + hàm thuần có test node, import tĩnh hoặc dynamic import mà Vite bundle được. Vite xuất ra file `assets/<tên>-<hash>.js`; SW sẽ cache file đó như mọi asset cùng origin khác (network-first, sw.js:14-23).
2. **SW cache đúng phiên bản qua swAutoVersion.** Vì version gắn build (mục 12.1.2), quy ước là: người chơi đã vào app khi có mạng ⇒ toàn bộ bundle của build đó — gồm npc-personas — đã được cache. Khi NPC-AI đổi nội dung, cứ build lại là `CACHE` bump timestamp (vite.config.js:18-19), SW activate xoá cache cũ (sw.js:5-7), lần vào sau người chơi nhận bản mới. **Không thêm cơ chế version riêng cho module** — không manifest riêng, không `fetch` kiểm tra version khi runtime; SW đã tự lo toàn bộ theo tên cache.
3. **Cấm nạp code runtime ngoài bundle.** Cấm mọi hình thức nạp code sau build: `import('https://…')`, `eval(await fetch(url).text())`, chèn `<script>` từ CDN, nạp persona từ API. Lý do kỹ thuật nằm ngay sw.js:12 — cross-origin không được cache, nên một dòng nạp ngoài bundle là hỏng offline ngay lập tức, và còn mở đường nạp code không kiểm soát được phiên bản. Nội dung NPC chỉ tồn tại dưới dạng dữ liệu trong module bundle; không có endpoint «lấy persona từ server».

### 12.2.2 Story generator là hàm của seed — mọi fetch trong makeStory là sai (quy định cứng)

`makeStory(seed, R, slot, pid)` — chữ ký chủ sở hữu đặt tại mục 08 §8.4 (`slot` là slot/khe sinh khách của sảnh, `pid` là định danh tách người chơi; hai tham số này tách khỏi seed để đổi hạt khi cần, §8.7) — và mọi hàm sinh chuyện khách NPC — phải là **hàm thuần**: cùng seed + cùng lá số ⇒ cùng câu chuyện, chạy được trên máy không mạng, test được bằng node không cần server. Khuôn đúng:

```js
// npc-story.js — khuôn thuần, chạy offline, test node không cần mạng
import { makeNpc } from './npc.js';

export function makeStory(seed, R, slot, pid) {  // đủ 4 tham số theo mục 08 §8.4 — slot khách + pid người chơi
  const npc = makeNpc(seed);                    // tên + nghề + câu gốc (npc.js:41)
  const ban = R && R.chart ? R.chart.input : null;
  if (!ban) return null;                        // không có lá số → không kể chuyện
  // chọn khung chuyện theo khí hậu/cách cục của R — chỉ đọc dữ liệu R và bảng nội dung local
  const khung = chonKhung(seed, R);             // hàm thuần cùng file
  return {
    intro: khung.intro(npc, ban),               // 1 câu mở, ≤ 90 ký tự nếu dùng làm bark
    ask:   khung.ask(npc, ban),                 // câu hỏi khách — thay mẫu câu gốc npc.js:23-31
    close: khung.close(npc),                    // cảm ơn theo điểm — mở rộng case-ui.js:236
  };
}
```

Bất kỳ lệnh `fetch` nào xuất hiện trong `makeStory` là **sai theo định nghĩa** — không phải «chưa tối ưu», mà là vi phạm điều kiện offline của mục này. Nguồn dữ liệu cho chuyện chỉ có thể là: lá số `R`, seed, và bảng nội dung trong bundle. Câu chuyện giàu đi bằng cách **giữ lá số thật** (khuôn dieuhau kéo 75% lệch khí hậu ở halls.js:53-60, cachcuc lọc cách thường ở halls.js:244-247) — không bằng cách gọi mạng.

### 12.2.3 Test chấp nhận của Quyết 1

Điều kiện pass, chạy được tay và chạy được trong smoke (khung ở mục 12.9):

- Mở app đã từng vào khi có mạng → tắt mạng (DevTools Offline / ngắt wifi) → reload: app vẫn vào được (SW phục shell), quét quanh quán, **bark của NPC vẫn hiện**.
- Bấm trạm La Bàn Đài và Bảng Lịch Ngày khi offline: chạy bình thường (đã thuần engine, world.js:22, world.js:25).
- Khách NPC trong sân có câu chuyện riêng (makeStory) khi offline; không thấy lỗi mạng nào bật lên.
- Không có request nào đi tới prefix proxy trong lúc offline (nếu có tức là đã lỡ thêm đường gọi mạng vào thành phần thuần).

---

## 12.3 Quyết 2 — «mất mạng» và «AI bị admin tắt» là hai trạng thái hiển thị khác nhau (quy định cứng)

Engine hôm nay đã có đủ hai nhánh lỗi, nhưng UI chưa phân. Quyết này buộc UI phân, bằng câu chữ khác hẳn nhau, vì hai trạng thái cần người dùng hiểu khác nhau: một cái là mạng của *người dùng* có vấn đề, một cái là *quán chủ động tắt*.

### 12.3.1 Hai nhánh đã có trong engine

- **Nhánh cục bộ (local).** `localFallback` định nghĩa tại ai.js:2711-2715: gọi `composeAnswer(question, R)` (nlg.js:1064), ghép lead + bullet, trả `{ source: 'local', text }`. Nhánh này chạy khi `!isAIReady(cfg)` (ai.js:2717-2719) hoặc khi fetch ném lỗi mạng — sau một lần retry (ai.js:2904-2911, status «Mạng giật — đang thử lại…» ở ai.js:2908). Chạy hoàn toàn trên máy người chơi, **không tiêu quota**.
- **Nhánh kill-switch admin.** streamRound bắt `res.status === 503` tại ai.js:2912-2916: ném lỗi có cờ `err.aiDisabled = true`, message «Luận giải trực tuyến bị tắt bởi quản trị viên», **fallback NGAY không retry** (comment gốc: «[admin loop 1351] AI bị admin tắt → fallback local NGAY (không retry)»). 503 này do worker trả khi `isAiEnabled` chặn (worker KV `ai:enabled`) hoặc hết backend free (worker/index.js:95).

### 12.3.2 Hiện trạng UI hôm nay: hai trạng thái đang bị gộp chung một nhãn

master-ui.js:85-86 hiện vẽ một nhãn duy nhất cho `source !== 'ai'`: «Luận cục bộ (chưa kết nối máy chủ AI)». Câu này gộp cả hai trường hợp — mất mạng và admin tắt — thành một ý «chưa kết nối», khiến người chơi bị admin tắt AI sẽ tưởng mạng mình lỗi. Đó chính là lỗi UX mục này phải xóa. Ngoài ra nhánh ném lỗi tới catch hiện hiện chung chung «Thầy đang bận, lát hỏi lại nhé.» (master-ui.js:95) — cũng không phân biệt.

### 12.3.3 Hai câu hiển thị mẫu — mỗi trạng thái một câu, khác nhau bắt buộc

Quy định cứng: hai trạng thái dưới đây **phải** hiển thị hai câu khác nhau, không được dùng chung một nhãn, không được để admin-tắt trông giống lỗi mạng. Vị trí gắn: khối chú thích cạnh câu trả lời fallback trong AI panel (thay vùng nhãn master-ui.js:85-86).

**Trạng thái «MẤT MẠNG»** (fetch ném lỗi mạng → localFallback, ai.js:2711-2719):

> **Mất kết nối — Thầy tạm luận bằng bộ dữ liệu trong máy bạn.** Đủ nét chính, chưa sâu bằng khi có mạng; vào lại mạng rồi hỏi lại, Thầy luận sâu hơn.

**Trạng thái «ADMIN KILL-SWITCH»** (503 + `aiDisabled`, ai.js:2912-2916):

> **Tính năng Hỏi Thầy đang tạm tắt bởi quản trị quán — không phải mạng của bạn có lỗi.** Thầy vẫn trả lời bằng bộ cục bộ; phần còn lại của quán hoạt động bình thường.

Vì sao hai câu phải khác nhau về chữ (không chỉ khác icon): người chơi gặp kill-switch thường tự trách mạng nhà mình hoặc wifi quán — câu phải **gỡ trách nhiệm khỏi người dùng** («không phải mạng của bạn»); người chơi mất mạng cần **hướng đi hành động** («vào lại mạng rồi hỏi lại»). Một câu không thể làm được cả hai việc mà không gây hiểu nhầm một bên. `err.aiDisabled` là cờ sẵn có (ai.js:2914) — UI chỉ cần đọc cờ này để chọn câu, không cần thêm trạng thái mới từ server.

---

## 12.4 Quyết 3 — offline không tiêu quota, không ghi telemetry, KHÔNG dồn lũ khi về mạng

Ba mệnh đề, thứ tự để tránh hiểu lầm:

1. **Offline không tiêu quota.** Quota của chuỗi AI nằm ở server: rate-limit 30 call/phút/IP (`airl:` — worker/index.js:159-163) và chi phí backend trong `logFreeUsage` (worker/admin.js:145-163). Mọi đường offline của mục này là chạy client — `composeAnswer` (nlg.js:1064), bark, makeStory — nên về định nghĩa không chạm quota. Không cần cơ chế gì thêm; chỉ cần không lỡ thêm đường gọi mạng nào vào các thành phần thuần (mục 12.2, 12.3).
2. **Không log telemetry server-side khi offline.** `logFreeUsage(env, ip, status, backend)` là **hàm của worker** (worker/admin.js:145) — không mạng thì worker không được gọi, nên tự nhiên không có gì ghi. Telemetry phía client trong `askAI` (`_roundsDone`, `_tStart` — ai.js:2709-2710) chỉ có ý nghĩa khi có stream; khi offline stream không tồn tại, các biến này không thoát ra máy chủ theo bất kỳ đường nào. Không xây «log offline lưu localStorage» để gửi sau.
3. **Hàng đợi telemetry KHÔNG cache dồn sau khi về mạng — quyết đợt này.** Ghi rõ để ai làm sau không tự chế «sync-later»: đợt này **không** có hàng đợi telemetry offline, **không** flush lũ khi mạng trở lại, **không** bơm số liệu cũ vào `logFreeUsage` hay admin log khi người chơi quay lại online. Lý do: (a) telemetry AI là số liệu theo thời điểm gọi thật, số offline là «không có call» — đếm 0 là đúng sự thật, dồn lũ là bịa số; (b) flush-lũ làm méo rate-limit và biểu đồ admin ngay sau một đợt mất mạng chung; (c) mỗi cơ chế sync-later là một cơ chế state mới phải test — trái phạm vi «chốt trạng thái, không sinh sync» của đợt này. Nếu sau này cần số liệu offline, phải mở quyết mới, không sửa ngầm mục này.

---

## 12.5 Quyết 4 — từng thành phần NPC-AI dùng gì khi offline

Bảng phân vai nguồn khi không có mạng. Cột «trỏ tới» ghi nơi quy định chi tiết hơn.

| Thành phần | Khi offline | Nền kỹ thuật | Trỏ tới |
|---|---|---|---|
| **Bark NPC** (BARK-* ≤ 90 ký tự) | OK offline — chạy như online | module thuần trong bundle, SW cache theo build (12.2.1) | 12.2 |
| **Story generator** khách NPC | OK offline — hàm của seed | `makeStory` thuần, cấm fetch (12.2.2) | 12.2 |
| **AI panel «Hỏi Thầy»** | fallback local — `composeAnswer` | nhánh cục bộ ai.js:2711-2719; câu hiển thị theo 12.3.3 | 12.3 |
| **MMO `/ws`** | rơi về chơi đơn | net.js:2 + main.js:63 đã cam kết offline-first | mục 13 |
| **La Bàn Đài** | OK — engine cục bộ | world.js:22, không gọi mạng | — |
| **Bảng Lịch Ngày** | OK — engine cục bộ | world.js:25, không gọi mạng | — |

Ghi chú thêm: AI panel khi offline **vẫn trả nội dung** (`composeAnswer`) — không hiện trang trắng, không vô hiệu nút «Hỏi»; khác biệt chỉ nằm ở nhãn trạng thái (12.3.3) và badge «Neo» không hiện vì `source !== 'ai'` (master-ui.js:80-87 giữ nguyên điều kiện đó — không tự chấm Neo cho câu local). MMO rơi về chơi đơn đã là hành vi hiện hữu của net (ghế cục bộ net.js:180); chi tiết chuyển trạng thái UI của MMO thuộc mục 13, mục này không nhắc lại.

---

## 12.6 Bảng 3 trạng thái × 4 thành phần (mẫu bắt buộc)

Bảng chuẩn để mọi mục sau dẫn chiếu: hàng = trạng thái, cột = thành phần; mỗi ô gồm **hành vi** + **câu hiển thị** (nếu thành phần đó có chữ hiển thị).

| Trạng thái ↓ / Thành phần → | AI panel (Hỏi Thầy) | Bark NPC | Story generator | Telemetry |
|---|---|---|---|---|
| **Online** | Gọi POST `/zai`, stream Thầy AI; badge «🎯 Neo X%» (master-ui.js:83) | Bark từ bundle, hiển thị bình thường | makeStory chạy từ seed | Ghi như thường: server `logFreeUsage` khi có call; client `_roundsDone` theo stream |
| **Mất mạng** | fallback local qua ai.js:2711-2719, không tiêu quota · **Câu:** «Mất kết nối — Thầy tạm luận bằng bộ dữ liệu trong máy bạn. Đủ nét chính, chưa sâu bằng khi có mạng; vào lại mạng rồi hỏi lại, Thầy luận sâu hơn.» | Vẫn hiện — không đổi gì · **Câu:** bark y nguyên nội dung bundle | Chạy như online · **Câu:** chuyện khách y nguyên từ seed | Không ghi gì, không có hàng đợi; về mạng cũng **không** xả dồn (quyết 12.4.3) |
| **Kill-switch admin (503)** | fallback local ngay, không retry (ai.js:2912-2916) · **Câu:** «Tính năng Hỏi Thầy đang tạm tắt bởi quản trị quán — không phải mạng của bạn có lỗi. Thầy vẫn trả lời bằng bộ cục bộ; phần còn lại của quán hoạt động bình thường.» | Vẫn hiện — không đổi gì | Chạy như online | Không có call nào tới worker ⇒ `logFreeUsage` không ghi; tương tự không dồn lũ |

Bảng này là **quy định cứng** về 6 ô chữ hiển thị: 2 ô trạng thái mất mạng/kill-switch của AI panel phải đúng hai câu ở 12.3.3 (khác nhau bắt buộc); các ô bark/story/telemetry chỉ mô tả hành vi, không có câu mới cần đổi.

---

## 12.7 Pseudo-code phiên bản module trong SW (swAutoVersion + build id của npc-personas)

Mô hình đã chốt ở 12.1.2: version theo build, không theo module. Pseudo-code dưới đây phác lại `swAutoVersion` kèm build id, mục đích chỉ là **chốt quy ước chữ** cho ai đọc lại sau; đợt này không áp thêm logic mới vào plugin (giữ nguyên vite.config.js:10-23).

```js
// vite.config.js — pseudo-code quy ước versioning (nguyên tắc, không thêm cơ chế mới đợt này)
function swAutoVersion() {
  return {
    name: 'sw-auto-version',
    closeBundle() {
      const swPath = 'dist/sw.js';                 // giữ nguyên như vite.config.js:15-21
      if (!fs.existsSync(swPath)) return;
      const buildId = Date.now().toString(36);     // ví dụ 'm3xq2k' — một build = một buildId
      let sw = fs.readFileSync(swPath, 'utf8');
      sw = sw.replace(/const CACHE = '[^']+'/, `const CACHE = 'bazi-${buildId}'`);
      fs.writeFileSync(swPath, sw);
      // (tùy chọn sau này, KHÔNG bắt buộc đợt này) ghi dist/build-id.json để debug:
      // { buildId, cache: `bazi-${buildId}`,
      //   npcPersonas: <tên file hashed do Vite sinh, vd 'assets/npc-personas-Cj9x.js'> }
    },
  };
}
```

Quy ước đọc version của npc-personas khi cần tra:

```js
// cách đúng: hỏi URL thật của chunk trong bundle đã build (hash nội dung của Vite)
import { personas } from './npc-personas.js';   // import tĩnh → nằm trong bundle → SW cache được
// version tra tay khi debug = hash trong tên file assets do Vite xuất; KHÔNG tự sinh version riêng.
```

Và quy ước **cấm** đối xứng:

```js
// SAI — nạp runtime ngoài bundle: cross-origin không cache (sw.js:12) + không kiểm soát được phiên bản
const p = await (await fetch('https://cdn.example.com/npc-personas.js')).text();
eval(p);                                        // cấm tuyệt đối
```

Tóm lại một dòng: **SW chỉ biết `CACHE = 'bazi-<buildId>'`; npc-personas là một phần của build đó; version «đúng phiên bản» của SW = version của build người chơi đã tải; mọi đường ngoài bundle là sai.**

---

## 12.8 Flow AI mất mạng: detect → hai nhánh thông báo

Sơ đồ chốt luồng trong `askAI` + panel. Hai nhánh phát hiện nằm ở hai chỗ khác nhau của engine — nhánh 1 phát hiện khi fetch ném lỗi (transport), nhánh 2 phát hiện khi response về 503 (phản hồi của worker).

```
Người chơi bấm «Hỏi» trong AI panel (master-ui.js:36-39)
        │
        ├── [Gate trước] FEATURES.ai === false (iOS, features.js:20)
        │        → không mở khung hỏi-thầy — ngoài phạm vi hai trạng thái này
        │
        └── askAI(q, R, cfg)  (ai.js:2705)
                 │
                 ├─ !isAIReady(cfg)  (ai.js:2717-2719)
                 │        → localFallback('Đang dùng bộ luân giải cục bộ…') — chạy local
                 │
                 └── POST /zai  (SW bỏ qua POST — sw.js:10, luôn network)
                          │
                          ├── NHÁNH 1 · fetch ném lỗi mạng (Failed to fetch / NetworkError / Load failed)
                          │      ├─ retry đúng 1 lần sau 800ms (ai.js:2904-2911; status «Mạng giật — đang thử lại…» ai.js:2908)
                          │      ├─ vẫn lỗi → localFallback → composeAnswer (nlg.js:1064)
                          │      └─ UI chọn câu «MẤT MẠNG» (12.3.3) — nhãn cạnh câu trả lời, không tiêu quota
                          │
                          └── NHÁNH 2 · res.status === 503 (ai.js:2912-2916)
                                 ├─ throw err.aiDisabled = true — KHÔNG retry (comment [admin loop 1351])
                                 ├─ panel bắt lỗi theo cờ aiDisabled → vẫn render câu trả lời fallback
                                 └─ UI chọn câu «ADMIN KILL-SWITCH» (12.3.3) — khác chữ nhánh 1 (quy định cứng)

Sau cùng (cả hai nhánh): badge «Neo» không hiện vì source === 'local' (master-ui.js:80-87 giữ nguyên);
lịch sử hội thoại vẫn push như thường (master-ui.js:77) để vòng sau nhất quán.
```

Điểm detect phải dựa trên **tín hiệu có sẵn**, không thêm ping mạng mới: nhánh 1 bằng loại lỗi fetch hiện có của ai.js:2907; nhánh 2 bằng cờ `aiDisabled` hiện có của ai.js:2914. Không viết `navigator.onLine` polling, không heartbeat — sai lệch hiện trạng và sinh việc phải test thêm.

---

## 12.9 Khung test offline smoke (suite chung mục 16)

Gate này nằm trong lộ trình ở G1/G2 (mục 12.10), chạy trong bộ thử chung quy ước ở mục 16. Khung script dưới đây là mẫu chương trình — tên file làm việc, tuần tự 6 bước, mỗi bước có tiêu chí pass riêng.

```js
// scripts/test-npc-offline-smoke.mjs — khung smoke offline (suite chung mục 16)
// 1. BUILD: chạy build chuẩn (dist/) — assert dist/sw.js có CACHE = 'bazi-<ts>' (vite.config.js:18-19)
//    và bundle chứa npc-personas + npc-story (tồn tại file assets hashed tương ứng).
// 2. PHỤC VỤ: serve dist/ tĩnh; chặn mọi request ra ngoài loopback (mọi fetch ngoài = fail).
// 3. WARM: mở trang có mạng cục bộ 1 lần — cho SW cache đủ shell + bundle (network-first, sw.js:16-19).
// 4. CẮT MẠNG: CDP Network.emulateNetworkConditions(offline = true).
// 5. ASSERT Offline (giữ máy chủ vẫn trả một 503 giả lập khi explicit gọi POST để test nhánh kill-switch riêng):
//    a. app reload offline vẫn vào được;
//    b. bark NPC vẫn hiện (đúng nội dung bundle — so chuỗi với dữ liệu module, không chỉ "có chữ");
//    c. makeStory(seed, R, slot, pid) chạy thuần: không phát sinh request nào (bắt bất kỳ fetch = fail);
//    d. La Bàn Đài + Bảng Lịch Ngày mở được (world.js:22, world.js:25);
//    e. POST /zai offline → nhận câu «MẤT MẠNG» đúng chuỗi ở 12.3.3; source trả về là 'local'.
// 6. ASSERT KILL-SWITCH (mạng bật lại, worker stub trả 503 cho /zai):
//    a. hỏi Thầy → nhận câu «ADMIN KILL-SWITCH» đúng chuỗi 12.3.3 (CHỖ NÀY PHẢI KHÁC chuỗi 5e);
//    b. KHÔNG có retry thứ hai đến /zai sau 503 (ai.js:2912-2916 — không retry);
//    c. về mạng sau offline: KHÔNG có đợt fetch dồn (telemetry/log/backfill) — không request bổ sung
//       nào xuất hiện sau khi mạng hồi (quyết 12.4.3 — không sync-later).
```

Tiêu chí tổng của gate: cả 8 mệnh đề assert trên pass trong cùng một lần chạy. Mệnh đề 5e và 6a là mệnh đề **so sánh chuỗi** — hai chuỗi phải khác nhau từng chữ, bất kỳ ai sửa một trong hai câu để trùng nhau đều fail gate. Chi tiết bộ thử đa lượt và ngưỡng duyệt chung để mục 16 quy định; mục này chỉ nắm khung offline.

---

## 12.10 Quan hệ lộ trình: G0 → G1/G2

- **G0 — module qua build pipeline là điều kiện tiên quyết.** Mọi module NPC-AI mới (npc-personas, npc-story, bark, mở rộng npc-deep) phải đi qua build pipeline theo nghĩa mục 12.2.1: import được từ code, Vite bundle, hash trong tên file, rơi vào `dist/` cùng build. Lý do bắt buộc ở G0 mà không phải G sau: SW versioning hoạt động trên **tên cache của build** (12.1.2) — một module đứng ngoài pipeline không thể được cache đúng phiên bản, và mọi cam kết offline phía sau từ đó vô nghĩa.
- **G1/G2 — gate offline smoke bật trong lộ trình (mục 15).** Khung 12.9 được xếp làm gate trong các đợt lộ trình tương ứng; nội dung cụ thể của từng đợt G do mục 15 quyết. Ở đây chỉ chốt thứ tự phụ thuộc: G0 xong thì gate mới có ý nghĩa; gate fail thì đợt tương ứng chưa kết thúc.
- **Ràng buộc xuyên suốt:** các quy định cứng 12.2.2 (makeStory thuần), 12.3.3 (hai câu), 12.4.3 (không dồn lũ) áp cho mọi module NPC-AI sinh ra từ G0 trở đi, không có ngoại lệ «tạm thời».

---

## 12.11 Bốn quy định cứng chốt đợt này

Tổng hợp lại để tra nhanh — bốn bẫy đã né và bốn điều không được đảo ngược:

1. **Hai câu hiển thị khác nhau là quy định cứng.** «Mất mạng» (12.3.3 câu 1) và «admin tắt» (12.3.3 câu 2) không được dùng chung nhãn, không được sửa cho trùng nhau; gate 12.9 soi trực tiếp điều này.
2. **Không cache response AI trong SW.** sw.js:10 giữ nguyên chú thích «POST (AI API) luôn đi thẳng»; sw.js:13 giữ nguyên danh sách prefix không cache. Không đề xuất, không thêm «cache câu trả lời AI để replay khi offline» — cả ở mục này lẫn mục sau. Câu trả lời offline duy nhất được phép là `composeAnswer` chạy client.
3. **makeStory là hàm của seed thuần client.** Mọi `fetch` bên trong makeStory là vi phạm (12.2.2). Câu chuyện giàu lên bằng lá số thật của khách, không bằng mạng.
4. **Telemetry không dồn lũ khi về mạng.** Không hàng đợi, không flush, không sync-later — quyết đợt này (12.4.3). Muốn mở lại phải là quyết mới ghi rõ lý do, không phải chỉnh sửa ngầm.

Câu chốt của mục: NPC-AI offline không phải «chế độ kém đi», mà là cùng một game với hai dòng chữ khác nhau ở đúng chỗ — và mọi thứ chạy offline đều là thứ đã nằm trong build từ G0.
