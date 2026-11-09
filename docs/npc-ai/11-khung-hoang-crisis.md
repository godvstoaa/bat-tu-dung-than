# 11 · Khủng hoảng (crisis), biên bản tham vấn tôn giáo và chính sách bark khi crisis

> **Tóm tắt.** Khủng hoảng chạy **trước AI, trên máy người chơi**, kể cả iOS: mức **A** (tự hại hoặc bạo hành đang xảy ra) và mức **C** (y tế cấp) **không gọi mạng, không gọi AI**; NPC rời vai đúng **một câu** rồi hiện khối hỗ trợ cố định chỉ gồm **115** và **111/115**. Cờ crisis tắt mọi bark trêu chọc và tắt Định Mệnh Hội quanh người chơi **30 phút** — luật 30 phút được định nghĩa một chỗ duy nhất ở §11.8, mọi mục khác chỉ trỏ về đó. Nếu AI đang stream mà cờ bật: **huỷ lượt** bằng AbortController (`master-ui.js:64` / `master-ui.js:105`), thay bằng câu rời vai và khối hỗ trợ. Trước khi bật AI/runtime hoặc dựng 3D cho 6 persona tín ngưỡng phải có **biên bản tham vấn** theo checklist 6 mục ở §11.9.2. Mức trung gian giữa A và C: **«chưa chốt»** — mục này không sáng chế.

## 11.0 Luật sở hữu và phạm vi mục này

Luật khủng hoảng của toàn bộ tài liệu NPC-AI có **một chỗ định nghĩa duy nhất: mục 11 này**. Nguồn gốc đề xuất nằm ở GDD `docs/gdd/06-npc-ai/06-01-kien-truc-ai.md` §11 (đường dẫn dòng 419–457) với luật nền K5 «An toàn chạy trước AI» ở dòng 62: «Bộ phân loại khủng hoảng chạy **trên máy người chơi, trước khi gọi mạng**. Khối hỗ trợ hiện ra kể cả khi AI tắt, kể cả trên iOS». Mục này chốt lại nội dung đó thành luật cuối cùng; `06-01 §11` giữ nguyên văn bản đề xuất và chỉ trỏ về đây khi cần nhắc lại.

Kiểm tra đảo luật đã chạy trong phiên làm việc này: grep các từ «khủng hoảng / crisis / 115 / tự tử / tham vấn» trên toàn bộ `docs/GAME-THIET-KE-CHOT.md` (146 dòng) trả về **0 kết quả** — nghĩa là bản thiết kế chốt của app (chỉ chứa P0-1 «Đường Thầy» và mục Tàng Y Các) **không đụng và không đảo** bất kỳ dòng nào của luật khủng hoảng. Tương tự, mọi mục khác của bộ tài liệu NPC-AI (01…10, 12…) khi cần nhắc tới quy 30 phút, khối hỗ trợ hay mức khủng hoảng phải dẫn về mục 11 này; không mục nào định nghĩa lại.

Bốn bẫy mà mục này tự ràng buộc khi viết (để người đọc sau không phá): số điện thoại trong khối hỗ trợ **chỉ là 115 và 111/115**, không thêm hotline nào khác; mức A/C **không có bất kỳ dạng AI nào chạy**, kể cả «AI an ủi cục bộ»; câu rời vai **đúng một câu**; phần từ chối tối ưu **không tái bày** — chỉ dẫn mục 10.

## 11.1 Nguyên tắc nền: khủng hoảng chạy trước AI, trên máy, kể cả iOS

Bảy mệnh đề nền, mỗi mệnh đề có nguồn dẫn thật:

1. **Trước AI.** Bộ phân loại chạy trước mọi nhánh gọi AI, trên máy người chơi (K5 — `06-01:62`). Trình lượt chuẩn của app đã có chỗ đứng cho việc này: bước `precheck` «không hiện gì (≤ 5 ms): chạy §11 khủng hoảng, §8 hạn mức», và nhánh `crisis` của bảng trình lượt ghi rõ «khối hỗ trợ thay khung; NPC rời vai; không gọi mạng nếu mức A» (`06-01:250-251`).

2. **Kể cả iOS.** Gate AI của game là `FEATURES.ai = !IOS` (`src/game/features.js:20`) — iOS tắt nút «Hỏi Thầy» ở mọi cửa vào. Nhưng gate đó chỉ quyết định «AI có được gọi hay không», **không** quyết định «có phải hiện khối hỗ trợ hay không». GDD đã ghi sẵn: «Khối khủng hoảng (§11) **có** trên iOS» (`06-01:359`) và checklist nghiệm thu đòi hỏi «crisisCheck chạy trước mọi nhánh; có trên web và iOS» (`06-01:599`). Vì khối khủng hoảng là lớp chạy **trước** engine AI, nó không đụng tới dịch vụ AI từ xa, nên cũng không mở thêm diện 4.3b cho bản iOS.

3. **Bộ phân loại chưa có dòng code nào.** `crisisCheck(text)` được GDD đánh dấu «chưa có — cần làm» (`06-01:421`). Mọi hành vi trong mục này là **bản thiết kế chốt để wire sau**, không phải thứ đã chạy trong game hôm nay. Người đọc không được hiểu nhầm rằng đã có hệ thống đang bảo vệ người chơi ở bản build hiện tại.

4. **Không fetch ở mức A/C.** Bài thử chuẩn AIT-10 của GDD nêu rõ kết quả bắt buộc: người chơi gõ «tôi muốn chết» → «không có `fetch`; khối §11.3 hiện; `ai_npc.crisisLevel = 'A'`» (`06-01:588`). Không gọi mạng nghĩa là cả không gọi `L.askAI` lẫn không gọi `composeAnswer` (luận cục bộ). «AI an ủi cục bộ» vẫn là để AI xử lý tình huống khủng hoảng — trò chơi không có vai trò đó ở mức A/C; khối hỗ trợ là văn bản viết tay cố định.

5. **Sai dương tính được chấp nhận** (`06-01:429`) — nghiêng về hiện khối hỗ trợ hơn là bỏ sót. **Ngoại lệ ngữ cảnh truyện**: chuỗi tín hiệu nằm trong ngoặc «…» ngay sau tên NPC trong story (vd người chơi kể «hồn ma ở cầu Nại Hà than muốn chết») thì hạ một mức (`06-01:430`), trừ mức A không bao giờ hạ (`06-01:431`).

6. **Cờ chỉ nằm trên máy.** `ai_npc.crisisLevel` là cờ phiên ghi trên máy người chơi (AIT-10 — `06-01:588`); không đồng bộ server, không nằm trong telemetry của lượt (bảng telemetry có cột `crisisLevel` nhưng đó là nhãn lượt của client — `06-01:500`). Kill-switch AI phía worker (`ai:enabled`, `worker/index.js:165-167`) tắt được AI nhưng không thay được guard khủng hoảng: guard phải chạy khi AI còn bật lẫn đã tắt.

7. **Mức trung gian «chưa chốt».** GDD có một hàng đề xuất «B — đáng lo» (tuyệt vọng không ý định cụ thể → gọi AI kèm cờ hướng giọng «lắng nghe») tại `06-01:426`. Hàng đó nằm trong bảng được đánh dấu tổng thể «chưa có — cần làm» (`06-01:421`) và **chưa có biên quyết của đội an toàn/vận hành**. Đặc tả của mục này yêu cầu ghi rõ tình trạng: mức trung gian giữa A và C là **«chưa chốt»**. Mục này không thiết kế mức B, không chèn hành vi trung gian nào; đoạn nhắc hàng đề xuất ở đây là lần duy nhất mức B được nhắc tới — và chỉ để nói rằng nó chưa chốt. Khi đội an toàn có biên quyết, sửa đúng bảng §11.2 một chỗ.

## 11.2 Bảng mức khủng hoảng và hành vi

Bảng từ khoá regex đầy đủ nằm ở `06-01 §11.1` (hàng A ở dòng 425, hàng C ở dòng 427). Mục này **không sao chép lại danh sách từ khoá** — hai bảng từ khoá sống song song là nguồn lệch nhau; bảng dưới đây chốt **mức + hành vi**, tín hiệu chỉ tóm tắt để tra nhanh.

| Mức | Tín hiệu (tóm tắt — bảng regex đầy đủ tại `06-01:425`/`06-01:427`) | AI | Mạng | Hành vi trên máy |
|---|---|---|---|---|
| **A — khẩn** | ý định tự hại / tự tử hiện tại («muốn chết», «tự tử», «không muốn sống», «cắt tay»…); bị bạo hành đang xảy ra | **TẮT** (không `askAI`, không `composeAnswer`) | **KHÔNG gọi** | Khung thoại giữ nguyên khung, chân dung NPC mờ đi, chữ chuyển phông giao diện (`06-01:435`) → **1 câu rời vai** riêng của NPC (§11.3) → khối hỗ trợ đầy đủ §11.4 → cờ phiên `crisis=A`, hiệu lực 30 phút (§11.8) |
| **mức trung gian** | tuyệt vọng không ý định cụ thể (đề xuất «B — đáng lo» tại `06-01:426`) | **«chưa chốt»** | **«chưa chốt»** | **«chưa chốt»** — không sáng chế; chờ biên quyết đội an toàn, khi chốt thì sửa đúng hàng này |
| **C — y tế cấp** | «đau ngực», «khó thở», «co giật», «chảy máu nhiều», «ngất» | **TẮT** | **KHÔNG gọi** | **1 câu rời vai** + khối rút gọn một dòng «Gọi 115 hoặc tới cơ sở y tế gần nhất ngay» (đúng nguyên văn đề xuất `06-01:427`) → cờ phiên `crisis=C`, hiệu lực 30 phút (§11.8) |

Ba ghi chú vận hành của bảng:

- Mức C dùng khối rút gọn vì tình huống là y tế cấp, không phải buồn phiền: câu duy nhất cần nói là đường tới y tế. Cả hai khối đều chỉ chứa số 115 (và 111 trong khối đầy đủ) — §11.4.
- Cả hai mức chấm dứt lượt người chơi ngay: khung nhập khoá cho tới khi người chơi bấm một trong hai nút của khối hỗ trợ. Không auto-resume, không hẹn giờ tự đóng khối.
- Nhánh `crisis` trong trình lượt chuẩn của app (bảng `06-01:251`) đã ghi sẵn nhạc nền hạ 50% — giữ nguyên hành vi này, không thêm hiệu ứng khác.

## 11.3 Câu rời vai — đúng một câu

Trình tự hiển thị chuẩn (theo `06-01 §11.2`, dòng 433–437): khung thoại vẫn khung đó, chân dung NPC mờ đi, chữ chuyển sang phông giao diện (không phải phông thoại cổ); **dòng đầu là câu rời vai riêng của NPC, tối đa 1 câu**; sau đó là khối hỗ trợ. Mục này chốt chuẩn chặt hơn một nấc: **đúng một câu**, không phải «tối đa».

Vì sao một câu là đủ và bắt buộc: câu thứ hai trở đi gần như luôn là giảng giải, và giảng giải chính là quay lại vai tư vấn — đúng khoảnh khắc NPC không được tư vấn. Một câu rời vai chỉ được làm ba việc: (1) rời vai (NPC nói bằng giọng người thật phía sau vai), (2) xác nhận mức độ («chuyện này lớn»), (3) mời một hành động cụ thể («nói với người ở bên»). Câu hỏi thứ hai, số liệu lá số, chữ «mệnh», lời hứa, chẩn đoán, cụm xin lỗi thay mặt trò chơi và thuật ngữ huyền học đều cấm trong câu rời vai.

Bible từng persona đã có mục «Câu rời vai (khủng hoảng)»: Vân Cốc `06-02:259-261`; Thầy Tử Bình `06-04:236-238`; Lão Tùng `06-11:146`; Bà Tư thợ may `06-11:307`; Đan Đỉnh `06-11:495`; Phương sĩ `06-11:692` — hai mẫu cuối trong bible còn kèm sẵn chữ «+ khối hỗ trợ» ngay sau câu. Ghi nhận một chỗ lệch cần sửa khi wire: bản nháp bible nhiều mẫu viết **2–4 câu trong một ngoặc kép** (vd mẫu Đan Đỉnh tại `06-11:495` gồm ba câu, mẫu Phương sĩ tại `06-11:692` gồm bốn câu). Chuẩn của mục này thắng chuẩn nháp: khi nối code, lấy đúng **câu đầu** hoặc rút về một câu theo bảng §11.6.1; bản rút một câu dưới đây là bản chuẩn, không phải bản nháp.

## 11.4 Khối hỗ trợ cố định — chỉ 115 và 111/115

Nguyên tắc gốc của GDD: khối hỗ trợ là «văn bản cố định, không qua AI» (`06-01:439`, tiêu đề §11.3). Về số điện thoại, README §6 câu 2 đã chốt ranh giới: «Danh sách theo quốc gia trong khối khủng hoảng cần được đội vận hành xác minh. **Chỉ số 111 (trẻ em) và 115 (cấp cứu) đã chắc**» (`README.md:185`), và GDD cấm «không in số máy chưa kiểm chứng» (`06-01:456`). Vì vậy khối chốt của mục này **chỉ gồm 115 và 111/115 — không thêm hotline nào khác**. Các dòng còn lại của khối đề xuất trong GDD (placeholder danh sách theo quốc gia tại `06-01:447`, dòng thư mục quốc tế tại `06-01:449`) đứng sau cổng xác minh của vận hành; khi vận hành chốt được số nào thì sửa **đúng khối dưới đây một chỗ duy nhất**, không sửa ở từng NPC, không nhân bản khối.

Bản chốt mức A (khối đầy đủ):

```text
[CRISIS_BLOCK_A · văn bản cố định — không qua AI, không đổi theo persona, không sinh máy]
Trò chơi dừng ở đây một chút, vì điều bạn vừa viết quan trọng hơn trò chơi.

• Gọi 115 nếu có nguy hiểm đến tính mạng ngay lúc này.
• Đường dây hỗ trợ tâm lý tại Việt Nam: 111 và 115.
  – 115: cấp cứu y tế — gọi cả khi chưa chắc.
  – 111: bảo vệ trẻ em — người chơi dưới 18 tuổi gọi 111 trước.
• Nói với một người thật ở gần — người thân, bạn bè, thầy cô — ngay hôm nay.
• Bạn không phải một mình. Khi nào sẵn sàng, trò chơi vẫn ở đây.

[ Nói với người bên cạnh trước ]   [ Quay lại trò chơi ]
```

Bản chốt mức C (khối rút gọn):

```text
[CRISIS_BLOCK_C · một dòng cố định — nguyên văn đề xuất 06-01 §11.1:427]
Gọi 115 hoặc tới cơ sở y tế gần nhất ngay.
```

Ba luật của khối: (1) hằng chuỗi một chỗ duy nhất trong code, mọi persona dùng đúng một bản; (2) số điện thoại phải được xác minh lại định kỳ (yêu cầu của `06-01:455`) và mỗi lần xác minh ghi ngày vào mục này; (3) tuyến thiếu niên khi bật (đề xuất «chưa có — cần làm» tại `06-01:459`) chỉ đổi **thứ tự** — đưa 111 lên đầu (`06-01:467`) — không thêm số.

## 11.5 Flow bắt buộc: `guardCrisis(context)` đứng TRƯỚC `askAI`

Mọi lượt người chơi gõ tự do đi qua precheck trước nhánh AI (`06-01:250-251`). Guard phải là **lệnh đầu tiên** của hàm xử lý lượt — không đặt sau khi load engine AI, không đặt sau khi dựng brief. Chỗ nối code thật đã kiểm chứng trong phiên này: `AbortController` tạo mỗi lượt tại `master-ui.js:64` (`abort = new AbortController();`), signal đưa vào `L.askAI` tại `master-ui.js:65-66`, abort khi panel đóng đã có sẵn tại `master-ui.js:105`, và khối catch hiện tại **im lặng với AbortError** (`if (e?.name !== 'AbortError')` — `master-ui.js:94-95`) nên lượt bị huỷ vì khủng hoảng sẽ không hiện chữ «Thầy đang bận, lát hỏi lại nhé». Khung hỏi-thầy được mở qua lazy import `import('./master-ui.js')` (`case-ui.js:252-253`), tức mọi cửa vào AI đều chảy về một hàm `ask()` duy nhất — guard cắm một chỗ là phủ hết.

```js
// crisis-check.js — module thuần, không import engine AI; web + iOS dùng chung một bộ
// Luật: mục 11 này (§11.2 bảng mức, §11.4 khối hỗ trợ, §11.8 cờ 30 phút)
// Nguồn gốc đề xuất: docs/gdd/06-npc-ai/06-01-kien-truc-ai.md §11 (K5 :62, bảng mức :425-427)

const {{GENERIC_ONE_LINER}} = 'Trò chơi dừng ở đây một chút; chuyện bạn vừa nói cần một người thật ở bên bạn ngay.';
const {{LEAVE_ROLE_ONE_LINER}} = {
  thay_tubinh: 'Con ơi, thầy gác bút; điều con vừa viết quan trọng hơn mọi lá số trên bàn này.',
  dan_dinh:    'Con ơi, thầy tắt lò; chuyện con nói phải có người thật ở bên con ngay.',
  phuong_si:   'Người lạ ơi, kẻ này dừng đùa; chuyện này cần một người thật ở bên người lạ ngay.',
  // NPC kịch bản: lấy đúng câu đã duyệt trong bible (Lão Tùng 06-11:146, Bà Tư 06-11:307…), rút về 1 câu
};
const {{CRISIS_BLOCK_A}} = '…khối §11.4 mức A…';   // hằng một chỗ duy nhất
const {{CRISIS_BLOCK_C}} = 'Gọi 115 hoặc tới cơ sở y tế gần nhất ngay.';

export function guardCrisis({{context}}) {
  const {{level}} = crisisCheck({{context}}.text);          // chưa có — cần làm (06-01 §11.1:421); chạy trên máy, KHÔNG fetch
  const {{hit}} = ({{level}} === 'A' || {{level}} === 'C'); // chỉ A và C đã chốt; mức khác «chưa chốt» → đi tiếp

  if (!{{hit}}) return {{context}};                          // luồng thường — kể cả khi AI tắt vì lý do khác

  if ({{context}}.aiBusy) {{context}}.onAbortAiTurn();       // abort.abort() — cùng AbortController master-ui.js:64/:105
  if ({{context}}.panelOpen) {
    const {{line}} = {{LEAVE_ROLE_ONE_LINER}}[{{context}}.npcId] || {{GENERIC_ONE_LINER}}; // không mượn giọng persona khác
    {{context}}.renderCrisisTurn({{line}}, {{level}} === 'C' ? {{CRISIS_BLOCK_C}} : {{CRISIS_BLOCK_A}});
  } else {
    {{context}}.renderCrisisBanner({{level}} === 'C' ? {{CRISIS_BLOCK_C}} : {{CRISIS_BLOCK_A}});
  }
  {{context}}.setCrisisFlag({{level}});                      // cờ phiên — hiệu lực 30 phút, luật ở §11.8
  return null;                                               // CHẶN lượt: không L.askAI, không composeAnswer, không retry mạng
}
```

Và nhánh bark-only (NPC không AI) — guard đứng trước việc chọn bark:

```js
const {{guard}} = guardCrisis({{context}});
if ({{context}}.crisisFlagActive()) {      // trong 30 phút sau cờ — luật §11.8
  bark = pickCalmBark({{npcId}});          // pool thu còn «chào dịu»; tắt bark trêu, tắt bark Định Mệnh Hội
}
```

Ba điểm nối code cần nói thẳng: (1) gate `FEATURES.ai` (`features.js:20`) và kill-switch worker (`worker/index.js:165-167`) **không thay được** guard — chúng chỉ tắt AI, còn guard quyết định hiện khối hỗ trợ; iOS chạy guard như web, chỉ là nhánh `askAI` không bao giờ tới. (2) Ràng buộc đợt hiện tại: `state.js`, `stations.js`, `ai.js`, `master-ui.js` đang khóa — vì vậy đợt này chỉ đặt module thuần `crisis-check.js` có test node theo khuôn `gu-gongan.js` / `namhan.js` / `kinh-tu.js` (bộ test khuôn đã đạt: `test-game-thay-mo-rong.mjs` 13 đạt); dây guard vào `master-ui.js` làm ngay đợt mở khoá file. (3) Giá trị trả về `null` của guard nghĩa là lượt đã **kết thúc an toàn** — không có lượt thay thế nào khác ngoài khối hỗ trợ.

## 11.6 AI đang stream mà cờ crisis bật: huỷ lượt, thay lượt an toàn

Tình huống: người chơi gửi câu bình thường, AI đang stream token (mỗi khung hình vẽ một lần qua rAF — `master-ui.js:69-72`), rồi người chơi gõ thêm câu chạm ngưỡng A/C. Luật xử lý, theo đúng thứ tự:

1. **Huỷ ngay, không chờ trọn câu.** Gọi `abort.abort()` trên đúng `AbortController` của lượt (`master-ui.js:64` tạo, `master-ui.js:105` là mẫu gọi sẵn khi panel đóng). Thời gian là thứ đắt nhất trong khủng hoảng; không có lý do nào để chờ stream xong để «trọn câu». Khối catch hiện tại đã im lặng với AbortError (`master-ui.js:94-95`) nên không hiện thông báo lỗi.
2. **Không gửi thêm request nào lên mạng trong cùng lượt** — không retry, không gọi lại engine, không gọi `composeAnswer` thay thế.
3. **Lượt huỷ không vào lịch sử.** Cặp user/assistant chỉ được push sau khi lượt hoàn tất thành công (`master-ui.js:77` nằm sau dòng gán kết quả) — lượt bị huỷ vì khủng hoảng không push, nên lịch sử không chứa một câu trả lời sai lượt.
4. **Thay lượt bằng lượt an toàn**: một câu rời vai của NPC đang mở (đúng giọng hồ sơ, §11.6.1) + khối hỗ trợ cố định §11.4. Cả hai cùng nằm trong khung đã mở; không mở khung mới.
5. **Đặt cờ phiên** `crisis=A` (hoặc C) — hiệu lực 30 phút theo §11.8.

### 11.6.1 Ba mẫu lượt an toàn (persona AI-enabled)

Ba persona được bật AI khi nối runtime là Thầy Tử Bình (`README.md:97`), Đan Đỉnh chân nhân (`README.md:115`) và Phương sĩ Vô Danh (`README.md:116`) — mỗi persona một mẫu, giọng bám đúng hồ sơ (Thầy Tử Bình hồ sơ 19, Đan Đỉnh hồ sơ 35, Phương sĩ hồ sơ 36 theo danh mục hồ sơ của bộ tài liệu; giọng đối chiếu GDD `06-04 §4–§9`, `06-11 C2–C9`, `06-11 D2–D8` và cẩm nang giọng `06-18 §2`). Khối hỗ trợ **giống hệt nhau** ở cả ba mẫu — chỉ câu rời vai đổi theo persona.

| Persona | Bản nháp bible (nguồn) | Bản chốt 1 câu của mục này | Giọng hồ sơ được giữ / bị cắt ở lượt này |
|---|---|---|---|
| Thầy Tử Bình (hồ sơ 19) | 3 câu tại `06-04:238` | «Con ơi, thầy gác bút; điều con vừa viết quan trọng hơn mọi lá số trên bàn này.» | Giữ ấm, chậm, xưng «thầy» gọi «con»; cắt câu «nhưng mà» của lượt luận số |
| Đan Đỉnh chân nhân (hồ sơ 35) | 3 câu tại `06-11:495` | «Con ơi, thầy tắt lò; chuyện con nói phải có người thật ở bên con ngay.» | Giữ hành động cụ thể («tắt lò»); tắt tiếng cười to, tắt ví von nấu nướng |
| Phương sĩ Vô Danh (hồ sơ 36) | 4 câu tại `06-11:692` | «Người lạ ơi, kẻ này dừng đùa; chuyện này cần một người thật ở bên người lạ ngay.» | Giữ xưng «kẻ này» gọi «người lạ»; cắt nhịp hát, cắt ví von sông nước — chính bible đã chọn «dừng đùa» |

Mẫu lượt hoàn chỉnh (Thầy Tử Bình — hai mẫu còn lại chỉ đổi câu đầu):

```text
[thay_tubinh · crisis=A · lượt an toàn]
Con ơi, thầy gác bút; điều con vừa viết quan trọng hơn mọi lá số trên bàn này.

(chân dung mờ, phông giao diện)
{{CRISIS_BLOCK_A}}

[ Nói với người bên cạnh trước ]   [ Quay lại trò chơi ]
```

Với NPC bark-only / kịch bản (không có AI): lượt an toàn dùng đúng câu rời vai đã duyệt trong bible kèm khối hỗ trợ — mẫu có sẵn: Lão Tùng (`06-11:146`), Bà Tư (`06-11:307`). Bark thường của NPC trong 30 phút sau cờ bị thay bằng pool «chào dịu» (§11.8); **không sinh bark mới lúc runtime**, chỉ lọc pool có sẵn.

## 11.7 Từ chối tối ưu trong tình huống cảm xúc — chỉ dẫn mục 10

Bộ luật từ chối tối ưu — M-OVERREF, DNO1-5, EL3, PR2-PR4 — đã trình bày đầy đủ ở **mục 10**; mục này **không tái bày** và không được tái bày (hai bản luật sống song song là nguồn lệch nhau). Chỉ một đoạn áp vào tình huống cảm xúc: người chơi đau nhưng chưa chạm ngưỡng A/C và ép hỏi câu tất định («thầy nói đi, tôi có sống nổi không», hỏi ba lần) → vẫn chạy nguyên vẹn trình tự mục 10: từ chối phần tất định bằng giọng vai đúng nhân vật, không cụm xin lỗi thay mặt trò chơi khi không có lỗi để nhận, giữ lại **một việc làm cụ thể**, và chuyển người bằng mẫu có sẵn của mục 10 («về Bàn Thầy ở Sơn Môn hỏi Thầy Tử Bình», «đi hỏi thầy thuốc») — chuyển người ở đây khác với câu rời vai §11.3: chuyển người là một lượt luận bình thường, câu rời vai là kết thúc lượt bằng khối hỗ trợ. Ngưỡng phân hai hành vi: có tín hiệu mức A/C → §11.3; không có → mục 10.

## 11.8 UI an toàn và chính sách bark khi crisis — luật 30 phút (một chỗ duy nhất)

**Đoán chết cấm mọi lớp.** Không lớp nào của game được đoán tuổi thọ, cách chết, tai nạn: lớp brief engine, lớp AI (SYSTEM_PROMPT đã có anti-hallucination và các rule an toàn), lớp kịch bản, lớp bark, và cả lớp phản diện. Cụ thể đối với Định Mệnh Hội: lời doạ không được nhắc bệnh nan y có thật, tự tử, hay chết người thân cụ thể — đã là mục kiểm duyệt kịch bản (`06-14:285`), và bark không được đùa về tôn giáo (`06-18:200`), câu về cái chết/bệnh/tang thương chỉ được xuất hiện ở cảnh có nút bỏ qua và có duyệt nhạy cảm (`06-18:199`), bark không chê lá số xấu của người chơi (`06-18:197`). Quy tắc này đứng **trên** mọi ngoại lệ nghệ thuật: không án nào, không bark nào, không câu thoại nào được đổi nó.

**Quy 30 phút — luật gốc nằm ở đây.** Từ lúc cờ phiên `crisis` được đặt (mức A hoặc C), trong **30 phút** tính trên máy người chơi: (1) mọi NPC quanh người chơi chỉ bark **câu chào dịu**; (2) **tắt mọi bark trêu chọc**; (3) **tắt hoàn toàn Định Mệnh Hội quanh người chơi** — bark rao im, quầy ẩn tương tác, án có lời doạ không kích hoạt. Nguồn gốc đề xuất là dòng cuối §11.3 của GDD («Cờ phiên `crisis` làm mọi NPC trong 30 phút chỉ dùng câu chào dịu, tắt bark trêu chọc, tắt Định Mệnh Hội quanh người chơi» — `06-01:457`); mục này là chỗ định nghĩa duy nhất, mọi mục khác của bộ tài liệu (kể cả `06-01`) chỉ trỏ về §11.8. Con số 30 phút: một phiên quét sân bình thường dài vài phút, 30 phút đủ bao phủ hết phiên hiện tại cộng lần mở kế tiếp mà không cần bộ đếm hiển thị cho người chơi. Bộ đếm chạy client, không đồng bộ server, không lưu vĩnh viễn, hết hạn thì mọi thứ trở lại bình thường.

Bark trong 30 phút đó không viết mới: pool bark của từng persona vẫn là pool đã duyệt (đủ quy tắc chung: bark ≤ 90 ký tự, không cần ngữ cảnh mới hiểu — `06-18:196`), bộ lọc chỉ thu pool còn nhóm «chào dịu». Không bark doạ, không bark châm chọc vận hạn — đã cấm từ trước, nay thu hẹp thêm.

## 11.9 Biên bản tham vấn tôn giáo bắt buộc trước AI/runtime và trước dựng 3D

### 11.9.1 Danh sách persona và ranh giới danh sách

Biên bản tham vấn là **điều kiện tiên quyết cho cả hai việc**: bật AI/runtime và dựng 3D/hình ảnh — phải có **trước cả khi dựng 3D**, không phải trước khi phát hành. Danh sách chốt gồm 6 persona: **Lạt-ma Đa Kiệt, Trương Thiên Sư, Ni sư Diệu Âm, Thiền sư Trúc Lâm, Khâu đạo trưởng, Vu y bà A Mậu** — nguồn: README §6 câu 9 («Tham vấn cho Lạt-ma Đa Kiệt, Trương Thiên Sư, Diệu Âm, Trúc Lâm, Khâu đạo trưởng, Vu y bà… trước khi bật AI / dựng 3D» — `README.md:192`); bảng đội duyệt của đánh giá phân vai «Tham vấn tôn giáo (theo NPC)» chấm trục A·V cho Trương Thiên Sư, Diệu Âm, Trúc Lâm, Khâu đạo trưởng, Lạt-ma (`06-14:250`); riêng Lạt-ma, chính bible đã yêu cầu tham vấn trước khi dựng ngoại hình (`06-09:276`, màu và cách khoác y «**phải được người tham vấn duyệt**» — `06-09:281`).

**KHÔNG trong danh sách:** Vân Cốc, Khổng tiên sinh, Thầy Tử Bình, Tế tửu — bốn persona này không cần biên bản tham vấn tôn giáo; trong đó Thầy Tử Bình đã được duyệt «chạy khi chơi» (`README.md:97`). Danh sách trên là **danh sách đóng**: không thêm persona nào vào bảng §11.9.3 mà không có quyết định của đội an toàn. Ghi chú trung thực một dòng: câu 9 của README (`README.md:192`) còn nêu thêm «Trưởng trại» — nhân vật ngoài 6 persona của bảng này; nếu sau này dựng Trưởng trại thì áp đúng cùng nguyên tắc: biên bản trước AI/3D.

### 11.9.2 Checklist biên bản 6 mục

Mỗi biên bản là một văn bản ký tên, ghi đủ 6 mục dưới đây; thiếu bất kỳ mục nào thì biên bản chưa đủ để mở runtime hoặc dựng 3D:

| # | Mục kiểm | Nội dung bắt buộc trong biên bản |
|---|---|---|
| 1 | **Người tham vấn có thẩm quyền liên tôn** | Đúng tông phái của nhân vật (Tạng truyền / Đạo giáo Chính Nhất / Phật giáo Đại thừa / Thiền tông Trúc Lâm Yên Tử / Đạo giáo Toàn Chân / văn hoá dân gian vùng cao); có tư cách đại diện tông phái hoặc học giả do tông phái giới thiệu. Một người đủ thẩm quyền có thể ký cho nhiều persona — bảng đội duyệt đã cho phép «theo NPC» (`06-14:250`) |
| 2 | **Chủ đề giới hạn** | Phạm vi nói được viết thành **danh sách đóng** — mẫu chuẩn: phạm vi tạm của Lạt-ma là vô thường, lòng từ, mạn-đà-la cát; tắt hẳn nghi quỹ, chân ngôn, quán tưởng bổn tôn, quán đảnh, nhận đệ tử, luận lá số (`06-09:290`). Chủ đề ngoài danh sách = cấm |
| 3 | **Câu cấm xác nhận** | Câu chuyển hướng chuẩn đã duyệt nguyên văn cho lúc người chơi hỏi ngoài phạm vi — mẫu Lạt-ma: «Điều ấy cần một vị thầy thật, ở một nơi thật. Ở đây tôi chỉ kể chuyện cát.» (`06-09:291`). Câu này chép nguyên văn vào biên bản, runtime dùng đúng nguyên văn |
| 4 | **Người duyệt kịch bản** | Cá nhân/vai cụ thể chịu trách nhiệm duyệt từng kịch bản phát hành theo §4.4 của đánh giá — quy trình duyệt áp cho Lạt-ma và toàn bộ bark (`06-14:277-279`), bảng mục kiểm gồm các cấm yểm thuật, định kiến, lời doạ (`06-14:283-285`) |
| 5 | **Thời hạn tái duyệt** | Biên bản có hiệu lực có hạn; giá trị cụ thể do người tham vấn chốt ngay trong biên bản (đề xuất ban đầu 12 tháng, hoặc tái duyệt ngay khi sửa phạm vi chủ đề, giọng nói, ngoại hình) — hết hạn mà chưa tái duyệt thì persona quay về trạng thái chờ |
| 6 | **Ranh giới 3D/hình ảnh** | Màu y phục, cách khoác, đạo cụ, ký tự khắc phải được người tham vấn duyệt **trước khi dựng** — đề án Lạt-ma đã ghi sẵn các điều này (`06-09:276`, `06-09:281-282`: màu y phải duyệt; mặt bánh xe kinh khắc **ký tự hư cấu**) |

### 11.9.3 Bảng trạng thái tham vấn 6 persona

Nhãn «data G0» nghĩa là: dữ liệu bible đầy đủ trong GDD nhưng **chưa có dòng code nào nối vào runtime** — đã kiểm chứng bằng grep `van_coc | lama_dakiet | PERSONA-` trên toàn bộ `src/` và `worker/` trả **0 kết quả** trong phiên này (lần grep rộng hơn cho chữ PERSONA trúng 25 dòng chỉ là hằng PERSONALITY của engine, không phải persona NPC).

| Persona | Trạng thái runtime | Điều kiện mở |
|---|---|---|
| **Lạt-ma Đa Kiệt** (`lama_dakiet`) | Bản nháp v0 **«KHÔNG NẠP RUNTIME»** (`README.md:106` — hàng «không (nháp, chờ tham vấn)»; header riêng tại `06-09:284-287`). Chỉ có **kịch bản giới hạn chủ đề**: 30 câu B5 đã giới hạn chủ đề (`06-09:294-325`) và bark B9 an toàn theo khí hậu (`06-09:368-380`) | Biên bản tham vấn Phật giáo Tạng truyền đủ 6 mục §11.9.2 + người tham vấn duyệt màu/cách khoác y (`06-09:281`) + duyệt kịch bản §4.4 (`06-14:279`) |
| **Trương Thiên Sư** (`truong_thiensu`) | data G0 — PERSONA trong bible `06-05`, chưa wire (grep = 0) | Biên bản tham vấn Đạo giáo Chính Nhất đủ 6 mục + duyệt §4.4; trước đó không bật AI, không dựng 3D |
| **Ni sư Diệu Âm** (`dieu_am`) | data G0 — bible `06-06`, chưa wire (grep = 0) | Biên bản tham vấn Phật giáo đủ 6 mục + duyệt §4.4 |
| **Thiền sư Trúc Lâm** (`truclam_thiensu`) | data G0 — bible `06-09` mục A, chưa wire (grep = 0) | Biên bản tham vấn Thiền tông Trúc Lâm Yên Tử đủ 6 mục + duyệt §4.4 |
| **Khâu đạo trưởng** (`khau_daotruong`) | data G0 — bible `06-08` mục B, chưa wire (grep = 0) | Biên bản tham vấn Đạo giáo Toàn Chân đủ 6 mục + duyệt §4.4 |
| **Vu y bà A Mậu** (`vu_y_amau`) | data G0 — bible `06-10` mục A, chưa wire (grep = 0). Còn **tranh chấp canon cách đọc vai** («mời» Tà Lộ hay «chỉ cửa, cảnh báo» — câu hỏi mở số 8, `README.md:191`) | Chốt tranh chấp canon **trước** + biên bản tham vấn văn hoá dân gian vùng cao đủ 6 mục + duyệt §4.4 |

## 11.10 Đã chạy / chưa chạy trong phiên viết mục này

**Đã chạy** (lệnh thật, kết quả đã nêu tại từng mục): đọc nguyên văn §11 của `06-01` (dòng 419–470) — bảng mức, câu rời vai, khối hỗ trợ, cờ 30 phút; grep «khủng hoảng / crisis / 115 / tự tử / tham vấn» trên `docs/GAME-THIET-KE-CHOT.md` → 0 kết quả (146 dòng) → không đảo luật; `awk` `src/game/master-ui.js` dòng 60–110 → `AbortController` :64, signal :65-66, catch AbortError :94-95, abort khi panel đóng :105, push history :77; `awk` `src/game/features.js` dòng 18–28 → `ai: !IOS` :20; grep `van_coc / lama_dakiet / PERSONA-` trên `src/` + `worker/` → 0 kết quả (25 hit chỉ là PERSONALITY); `awk` `README.md` dòng 93–117 và 182–195 → bảng «Chạy khi chơi» (:97, :106, :115, :116), §6 câu 2 (:185), câu 8 (:191), câu 9 (:192); `awk` `06-04:234-246`, `06-11:489-496` + `:688-694` + `:144-148` + `:305-309`, `06-02:257-266`, `06-09:268-300` + `:368-380`, `06-14:241-292`, `06-18:188-204`.

**Chưa chạy** (nói thẳng): không có test tự động nào của `crisisCheck` vì hệ thống «chưa có — cần làm» (`06-01:421`) — mọi mẫu §11.5–§11.6 là thiết kế chốt để wire, chưa chạy được trên code thật; dây guard vào `master-ui.js` phải chờ đợt mở khoá file theo ràng buộc GAME-THIET-KE-CHOT §0.3. Gate phát hành liên quan tới mục này: lượt có trục A = 1 là hỏng P0 bất kể trục khác (`06-14:265`), bài thử AIT-10 (`06-01:588`) và checklist «crisisCheck chạy trước mọi nhánh; có trên web và iOS» (`06-01:599`) phải nằm trong bộ gate trước khi bật bất kỳ runtime NPC nào.
