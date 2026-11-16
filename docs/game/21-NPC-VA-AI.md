# 21 · NPC và AI

> **Trạng thái:** `[ĐÃ CÓ]` cho bark, chuyện khách, thầy bói, NPC trò chuyện, trọng tài; `[MỘT PHẦN]` cho persona của Thầy trang chính (cờ tắt) và NPC tín ngưỡng
> **Bộ phận chủ trì:** AI/NPC · Nội dung
> **Nguồn sự thật trong mã:** `src/game/persona-data.js`, `src/game/npc-personas.js`, `src/game/bark-pool.js`, `src/game/story-gen.js`, `src/game/npc.js`, `src/game/citizens.js`, `src/game/fortune-npc.js`, `src/game/npc-chat-core.js`, `src/game/npc-chat-ui.js`, `src/game/features.js`, `worker/npc-chat.js`, `worker/llm.js`; số liệu ở [A3](phu-luc/A3-so-lieu.md) mục 21
> **Test:** `scripts/test-crisis.mjs`, `scripts/test-persona-schema.mjs`, `scripts/test-bark-pool.mjs`, `scripts/test-story-gen.mjs`, `scripts/test-game-ai-persona.mjs`, `scripts/test-game-fortune.mjs`, `scripts/test-game-econ.mjs` (chống thao túng)
> **Thay thế:** `GAME-SINH-TON-KINH-TE-DAC-TA` §8, §19.5; `docs/npc-ai/` vẫn là tài liệu chi tiết lớp L2
> **Kiểm với mã ngày:** 2026-11-16

## 21.0 Mục đích, phạm vi, tóm tắt

NPC làm cho thành có người; AI làm cho người chơi hỏi được và mặc cả được. Chương này nêu các loại NPC, cái gì do AI nói, cái gì do máy chủ quyết, và giới hạn an toàn. Không gồm: nội dung luận lá số (§12), luật ngôn từ chung (§40).

| Loại NPC | Nói bằng gì | Có AI | Mục |
|---|---|---|---|
| Thầy bói (13 thầy) | AI của app, theo lá số người chơi; tám thầy có giọng persona riêng | có | §12.1, §21.2 |
| NPC có tên trong tiệm, miếu, phủ | bark; trò chuyện bằng LLM kèm lệnh nghiệp vụ | có, cần đăng nhập | §21.3 |
| NPC canon (Thầy Tử Bình, Vân Cốc, Khổng tiên sinh, Lão Tùng, Bà Tư…) | bark theo persona; kịch bản | tuỳ persona | §21.1, §21.2 |
| Khách hỏi việc | chuyện khách sinh theo hạt giống | không | §21.1 |
| Dân thành, người đi đường | câu theo vai, theo cung | không | §21.1 |
| Trọng tài | không phải NPC; bộ chấm ba lớp | lớp 1 | §21.4 |

Luật chi phối: **LN-06** (AI đề xuất, máy chủ quyết), **LN-08** (AI tắt game vẫn chơi đủ), **LN-11** (NPC tín ngưỡng), **LN-01** (không ngày sinh).

## 21.1 NPC không dùng AI

`[ĐÃ CÓ]`

- **Bark** (`bark-pool.js`, một nguồn duy nhất): mỗi persona và mỗi gian có một bể câu; chọn câu theo ngày và hạt giống, nên cùng ngày nghe cùng câu. Tối đa 90 ký tự, không doạ, không chữ Hán trần.
- **Chuyện khách** (`story-gen.js`): mỗi khách hỏi việc có một câu chuyện sinh tất định từ hạt giống ngày và lá số của khách; nhớ khách qua ngày trên máy. Không gửi qua mạng.
- **Dân thành** (`citizens.js`): mỗi cung có nhóm NPC theo vai (vệ binh cổng nói Bát Môn của cổng mình, chủ quán, nông gia, kiếm tôn…), áo nhuộm theo hành cung. Người đứng thì quay nhìn và chào; người đi dừng lại khi bị chắn. Chỉ dựng nhân vật gần người chơi và có **trần số nhân vật hoạt động**; máy yếu trần thấp hơn. Người đi đường ở xa tính hoạt ảnh thưa hơn.
- **Tân thủ:** Lão Tùng nói ba câu cứng lần đầu qua cổng.

## 21.2 Persona

`[ĐÃ CÓ]` dữ liệu; `[MỘT PHẦN]` việc bật. Bảng: [A3](phu-luc/A3-so-lieu.md) › `persona-data.js`. Hồ sơ từng người: `docs/npc-ai/17`–`36`.

- **Hai mươi persona canon**, mỗi persona có: danh xưng (tự xưng, gọi người chơi), câu chuyện, sáu khoá giọng, khuôn lời nhắc, bể bark, mức `aiEnabled`.
- **Ba mức `aiEnabled`:** `co` (được gọi AI), `kichban` (chỉ kịch bản, chờ biên bản tham vấn), `khong` (không bao giờ gọi AI: phản diện, người đứng cạnh giá tiền, người gác cổng). Một persona có thêm `runtime: false` thì bị khoá hẳn.
- **Mười luật chung** (`PERSONA_CHUNG_LUAT`) thắng mọi biến thể. Tóm tắt:
  1. An toàn trước giọng: không đoán chết, tuổi thọ, bệnh; không khuyên đầu tư; không giúp hại người thứ ba.
  2. Dữ liệu trước giọng.
  3. Không định mệnh: mọi nhận định là xu hướng kèm một việc làm được.
  4. AI chỉ nói; thưởng và cờ nhiệm vụ do máy trạng thái quyết (đề xuất sửa lời theo MT-4).
  5. Khủng hoảng chạy trước AI: NPC rời vai một câu rồi chuyển sang khối hỗ trợ cố định.
  6. Từ chối thừa rất ít; phải từ chối thì chỉ sang người cụ thể.
  7. Bị ép ba lần vẫn giữ giới hạn, bằng giọng nhân vật, kèm một việc làm.
  8. NPC tín ngưỡng phải có biên bản tham vấn trước khi bật AI.
  9. Giọng vùng bằng từ vựng và nhịp, không nhại phát âm.
  10. Hán Việt chuẩn.
- **Hai cờ** (`features.js`): `personaAi` (giọng persona cho Thầy trên trang chính) **tắt**; `gamePersona` (giọng riêng cho thầy bói trong game): `gamePersona` **bật** (trừ iOS): cổng chạy lại trên `glm-5.3-flash` ngày 16/11 và đạt (P0 100 %, từ chối thừa 0 %, giữ vai 100 %, 200/200 câu AI trả lời; đọc lại I07). Cổng gắn theo mô hình (`src/game/ai-model.js › PERSONA_GATE`): đổi mô hình là giọng persona tự tắt tới khi cổng chạy lại. iOS luôn tắt. Đổi lời nhắc, mô hình hay persona → chạy lại `scripts/eval-persona.mjs --live --origin <tên miền app>`.
- **Lệch đã biết giữa sách và mã** (kiểm lại 16/11; MT-9, MT-12):
  - Dữ liệu khớp bảng của sách: 10 persona mức `co`, 6 mức `kichban`, 4 mức `khong`. **Từ 16/11 mã thi hành mức này** (`npc-personas.js › personaAiAllowed`): chỉ mức `co` được chèn vào lời gọi mô hình, ở chuỗi `askAI` lẫn `/api/npc/chat`. Trương Thiên Sư và Ni sư Diệu Âm (mức `kichban`) nay trả lời bằng giọng chung của thầy bói.
  - Vài persona mang màu tín ngưỡng (Huyền Hư chân nhân, Mao Sơn đạo nhân, Địa Tạng sứ giả, Phán quan Thôi) ở mức `co` theo chính bảng của sách; rà theo LN-11 ở `VC-007`.
  - Ba thầy đã ngồi trong ba điện; Khổng tiên sinh ở Am Vân Cốc thay vì bậc Sơn Môn; vài tên viết hai kiểu.

## 21.3 NPC hội thoại bằng LLM

> **Trạng thái:** `[ĐÃ CÓ]` (P6). Mô hình đang dùng và các bộ lọc thêm: xem §21.5.

### 21.3.1 Phạm vi

- **Mọi NPC có tên** (chủ tiệm, thầy thuốc, cai ngục, giám mỏ, gia nhân phủ, dân phố có persona) đều chat tự do 1–1 được.
- Dân đi đường không tên vẫn dùng bark (G2) để tiết kiệm.
- Kênh chat chỉ giữa **người chơi và NPC**. Chat người chơi với người chơi vẫn là cụm từ soạn sẵn như hiện nay (Guideline 1.2).

### 21.3.2 Kiến trúc

```
[Người chơi gõ / nói] → client: lọc độ dài ≤ 300 ký tự, lọc từ thô tục (cleanName mở rộng)
   → Worker /api/npc/chat (cần đăng nhập, giới hạn lượt / ngày)
      ├─ Context Engine: persona NPC (G0) + lý lịch người chơi với NPC này (§21.3.3) + nghề, cấp, bậc giàu, chỉ số
      │                   + địa điểm, cung, giờ, can chi ngày, thời tiết + hành Dụng / Hỷ / Kỵ (KHÔNG ngày sinh)
      ├─ Bộ định tuyến: câu xã giao → mô hình nhỏ, prompt ngắn, cache theo (NPC, ý định)
      │                 câu chạm nghiệp vụ (xin việc, lương, giá, nợ, thuốc) → prompt đầy đủ + TOOLS
      ├─ LLM (mô hình nhỏ, ví dụ claude-haiku-5-5; khó thì leo thang) → văn bản + tool_calls
      └─ Bộ kiểm nghiệp vụ (thuần, máy chủ): mọi tool_call phải qua luật kinh tế mới có hiệu lực
   → trả { text, actions[] } → client hiện bong bóng + thẻ hành động (Nhận việc? Mua giá X?)
```

**Tools nghiệp vụ** (LLM chỉ đề xuất, máy chủ quyết định):

| Tool | Ràng buộc máy chủ |
|---|---|
| `offer_job(shop, rank, rate)` | còn chỗ, `rate` trong khung ±20% chuẩn, đủ cấp |
| `adjust_wage(u, pct)` | ±10% mỗi tuần, theo uy tín |
| `fire(u, reason)` | uy tín < 20 hoặc vi phạm có ghi sổ |
| `quote_price(item, price)` | trong [80%, 110%] giá niêm yết; mức giảm phụ thuộc thiện cảm |
| `extend_credit(u, amt)` | chủ tiệm cho nợ: trần theo uy tín |
| `give_hint(quest)` | chỉ gợi ý nhiệm vụ mệnh của **chính người đó** |

Nhờ vậy người chơi **không thể «nói khéo»** để phá kinh tế (prompt injection). LLM chỉ ảnh hưởng tới mức trong khung.

### 21.3.3 Trí nhớ dài hạn

- **Bản ghi `npcmem {npc, u}`:** thiện cảm (−100..100), uy tín nghề tại tiệm, 5 sự kiện gần nhất (đã tóm tắt), lần gặp cuối.
- Sau mỗi hội thoại có nghiệp vụ: mô hình nhỏ tóm tắt thành 1 câu (tối đa 120 ký tự) rồi thêm vào bản ghi, giữ 5 câu.
- Sự kiện game (làm tốt, bỏ ca, trộm, trả nợ) **ghi trực tiếp** không qua LLM, nên đáng tin.

### 21.3.4 Quyền riêng tư và an toàn nội dung

- **Không gửi** ngày giờ sinh, email, số điện thoại hay tên thật lên LLM. Chỉ gửi tên nhân vật và hành Dụng / Hỷ / Kỵ.
- **Lọc đầu ra:** chặn lời khuyên y tế, tài chính, pháp lý ngoài đời thực (nhắc «trong Huyền Thành…»), chặn nội dung người lớn, chặn đổi vai. Có câu mặc định khi bị chặn.
- **Tắt mạng / hết lượt:** quay về G2 (bark + câu mẫu theo persona), nghiệp vụ qua nút bấm. Game vẫn chơi đủ, không phụ thuộc AI.
- **Tuyên bố:** «Lá số trong game là yếu tố trò chơi, không phải lời khuyên đời thực». Đặt ở cổng và bảng việc làm.

### 21.3.5 Chi phí

- Mỗi người chơi có hạn mức lượt chat theo ngày (ví dụ 30 câu thường, 10 câu nghiệp vụ). VIP được thêm.
- **Cache theo ý định:** câu chào, hỏi giờ mở cửa, hỏi giá… lấy câu đã sinh theo khóa (NPC, ý định, bậc thiện cảm), không gọi lại.
- **Prompt caching:** phần persona và luật cố định để trong khối cache. Context động để cuối.
- Cần dựng bảng tính chi phí theo bảng giá hiện hành của nhà cung cấp mô hình trước khi bật cho mọi người. Đặt **ngân sách tháng** và có công tắc tắt ở admin.

## 21.4 Đường ống trọng tài AI (tóm tắt cho đội AI)

> **Trạng thái:** `[ĐÃ CÓ]` (P13). Luật nghiệp vụ của thầy mệnh lý ở §12.6.

```
consultation (AWAIT_VERDICT hoặc khách im lặng 24 giờ)
 → L0 thuần (Divination DO): độ dài · MinHash vs 3 kho · khớp Dụng/Kỵ với engine · tần suất · Risk.blockPair
     ├─ trượt cứng (COPY, block) → REJECTED_FRAUD / REFUNDED theo ma trận §12.6.4, không gọi LLM
     └─ qua → L1
 → L1 gateway /zai: system (luật chấm, cache) + data block {hồ sơ, engine, bối cảnh, câu hỏi, lời luận} → JSON schema
     ├─ JSON hỏng / timeout ×2 → REVIEW
     ├─ logic 4–6 → gọi lại mô hình lớn hơn một lần
     └─ quyết định → ma trận §12.6.4
 → giải ngân khi đã đủ 24 giờ két: ledger escrow → u:thầy (fee − thuế) + sink:bazi_tax
```

- **Ngân sách** (đã chốt, Quyết định 10): dùng chung ngân sách LLM tháng với NPC chat (Quyết định 5). Tối đa 1 lượt L1 cho mỗi lượt xem (cộng 1 lượt leo thang).
  - Thứ tự ưu tiên khi ngân sách còn dưới 20%: trọng tài trước, NPC chat lùi về G2 (bark + câu mẫu) trước, vì trọng tài đang giữ tiền khách.
  - **Chế độ chỉ lớp 0** khi hết hẳn ngân sách: L0 trượt cứng → xử như cũ; L0 qua → khách hài lòng thì trả thầy; im lặng 24 giờ cũng tính là hài lòng như §12.6.2; khách không hài lòng thì chia 70/30 như ô «Không hài lòng · Đạt». Không lượt nào phải chờ người duyệt chỉ vì hết ngân sách.
  - Bảng admin hiện chi phí từng tính năng (§17.6) và cảnh báo ở 80% ngân sách.
- **Bộ test cố định** cho trọng tài: 40 lời luận mẫu (tốt, copy, sai Dụng thần, nhồi lệnh, khuyên y tế ngoài đời) với kết quả mong đợi. Chạy mỗi lần đổi prompt.

## 21.5 Phần đang chạy thêm hoặc khác đặc tả

`[ĐÃ CÓ]` (nhật ký 11/11; hằng số ở [A3](phu-luc/A3-so-lieu.md) › `npc-chat-core.js`)

| Điểm | Đang chạy |
|---|---|
| **Đường gọi** | `/api/npc/chat`, cần đăng nhập. Khách và người hết lượt nhận câu mẫu theo vai |
| **Hạn mức** | số câu thường và số câu nghiệp vụ mỗi ngày mỗi tài khoản (`QUOTA`); câu vào tối đa `MAX_IN` ký tự |
| **Mô hình** | mọi lượt AI của game chạy `glm-5.3-flash` (QĐ-31, hằng `GAME_AI_MODEL` ở `src/game/ai-model.js`, client và Worker cùng đọc). Khung thầy bói gọi proxy `/zai` với mô hình này, không theo mô hình người dùng chọn cho app; NPC chat và trọng tài gọi qua `worker/llm.js`, pool miễn phí chỉ nhận mục chạy đúng mô hình. Khoá vẫn lấy từ cấu hình AI của app (`ai:config`); tắt chế độ suy luận để trả lời nhanh và đúng JSON (QĐ-22) |
| **Bộ đệm** | câu xã giao lưu theo (NPC, ý định, bậc thiện cảm) |
| **Chống thao túng** | lời người chơi nằm trong khối rào; mô hình chỉ **đề xuất** lệnh |
| **Bộ kiểm nghiệp vụ** | kẹp báo giá trong khung quanh giá sổ (giảm theo thiện cảm); mời làm chỉ khi tiệm tuyển; cho chịu theo uy tín; gợi ý chỉ nhiệm vụ của chính người đó; bác đuổi việc, chỉnh lương, lệnh lạ |
| **Nói lại cho khớp** | nếu lời NPC hứa giá khác giá sổ thì lời bị sửa lại theo giá sổ (`reconcile`); lời nhắc gửi mô hình đã kèm giá thấp nhất theo thiện cảm để ít phải sửa |
| **Lọc đầu ra** | lộ là máy, lời khuyên đời thực, nội dung người lớn, lời thô tục kể cả viết tắt; **bỏ nguyên vế câu có chữ Hán** |
| **Trí nhớ** | thiện cảm và năm sự kiện gần nhất cho mỗi cặp NPC và người chơi, lưu ở `Economy` |
| **Không gửi** | ngày sinh, email, tên thật |
| **Thầy bói** | đi đường khác: AI của app (cùng bộ công cụ tra cứu), không qua `/api/npc/chat` |
| **Hạn mức ba lớp** | proxy AI của app: 30 lượt mỗi phút mỗi địa chỉ mạng; `/api/npc/chat`: 30 lượt mỗi phút mỗi địa chỉ mạng, cộng 30 câu thường và 10 câu nghiệp vụ mỗi ngày mỗi tài khoản; toàn trang: 120 yêu cầu mỗi phút mỗi địa chỉ mạng |
| **Công tắc hai tầng** | một công tắc tắt mọi AI (proxy, NPC chat, trọng tài); một công tắc chỉ tắt nhóm mô hình miễn phí. Lưu cấu hình AI với chế độ khác «tắt» sẽ **bật lại** công tắc thứ nhất |
| **Nhiệt độ** | Thầy và thầy bói (chuỗi `askAI`): 0,55. NPC chat và trọng tài (`worker/llm.js`): 0,8, hoặc 0,2 khi trả JSON. Cả hai đường đều có luật chống xáo chữ trong lời nhắc (NPC chat thêm ngày 16/11) |
| **Trọng tài** | gọi thẳng mô hình qua `worker/llm.js` ở chế độ JSON, không đi qua proxy `/zai` như lời đặc tả §21.4 |
| **Đo lượt gọi** | NPC chat và trọng tài ghi số lượt gọi và số lỗi mỗi ngày vào bản ghi đo của quản trị (`llm_npc_*`, `llm_judge_*`); chưa quy ra tiền (`VC-021`) |
| **Cổng khủng hoảng** | chạy trước mọi lời gọi mô hình ở bốn chỗ: đầu `askAI`, khung hỏi thầy bói, khung trò chuyện NPC, đầu `/api/npc/chat`. Mức A và C chặn lượt; mức B cho AI trả lời kèm lời dặn lắng nghe và hiện dải hỗ trợ (§40.4) |
| **Bộ đánh giá persona** | `scripts/eval-persona.mjs`: bộ thử đỏ 200 câu, chạy qua proxy của app (`--origin`) hoặc một nhà cung cấp (`--endpoint`), chấm lớp 1 có hiểu vế phủ định, kèm tệp đọc lại (`--review`). Lượt 16/11: **cổng đạt** |
| **Bark ở các gian** | bảy bể đều có chỗ phát: trà, sen, ống xăm, bàn quẻ, lư hương, la bàn, lịch (năm bể sau nối ngày 16/11). Khi cờ khủng hoảng bật, mọi bark im lặng 30 phút |
| **Chuyện khách** | chỉ ba khách ở sân có chuyện; trí nhớ qua ngày bật mặc định trên web, tắt trên iOS; chỉ lưu tên, mã chuyện và nhãn |
| **Mất mạng** | service worker của app không lưu câu trả lời AI và không lưu `/api/`; trang game không đăng ký service worker. Khung thầy bói và khung NPC báo hai câu khác nhau cho «mất mạng» và «AI đang tắt» |
| **Phòng nhiều người** | hội thoại AI không đi qua WebSocket; kênh nói chỉ nhận khoá của cụm từ soạn sẵn |

## 21.6 Ngân sách và công tắc

`[MỘT PHẦN]` Có hạn mức theo người và công tắc tắt AI của app ở bảng quản trị. **Chưa có** trần tiền theo tháng và thứ tự ưu tiên trọng tài trước NPC bằng mã (QĐ-05, QĐ-10) → `VC-021`.

## 21.7 Lộ trình NPC-AI

| Giai đoạn | Nội dung | Trạng thái |
|---|---|---|
| G0 | dữ liệu persona, bark, chuyện khách, nhãn mềm | xong |
| G1 | chèn persona vào chuỗi AI của Thầy, sau cờ | xong; `personaAi` tắt; `gamePersona` chờ cổng trên mô hình mới (`VC-005`) |
| G2 | bark các gian, chuyện khách, tân thủ Lão Tùng | xong |
| G3 | model và chỗ đứng cho NPC canon | rút gọn: Lão Tùng, Am Vân Cốc, bàn Khổng; còn `VC-006` |
| G4 | chạy NPC tín ngưỡng | chưa; chờ biên bản tham vấn, `VC-007` |

### 21.7.1 Bản đồ sách NPC-AI (lớp L2, mục 01–16)

Sách `docs/npc-ai/` là thiết kế chi tiết của mảng này. Bảng dưới là **mục lục dẫn đường**. Mười sáu mục này đã được đối chiếu với mã ngày 16/11/2026; kết quả ở §21.7.2. Khi sách khác mã thì mã thắng. Mọi số dòng mã mà sách trích đều đã trôi, đừng dùng. Ràng buộc «22 tệp khoá» của sách thuộc đợt vá lỗi ngày 05/11 và đã hết hiệu lực trên thực tế: 17 trong 22 tệp đã được sửa sau 09/11. Mục 17–36 là hồ sơ 20 persona (§21.2).

| Mục | Trả lời câu hỏi | Bộ phận hay dùng |
|---|---|---|
| [01](../npc-ai/01-tong-quan-hien-trang.md) | Bản thiết kế NPC-AI nhằm gì; 39 thực thể NPC gồm những ai (20 persona canon, 19 thực thể đã có trong mã); khoảng cách giữa sách và mã | người mới vào mảng |
| [02](../npc-ai/02-kien-truc-chuoi-ai-3-tang.md) | Một câu hỏi đi qua ba tầng nào (engine dựng brief và vòng công cụ → cổng máy chủ → cổng người chơi); persona cắm vào đâu | AI/NPC, Backend |
| [03](../npc-ai/03-hop-dong-du-lieu-endpoint-rate-limit-cache.md) | Bảng tra: đường gọi, thân yêu cầu, hợp đồng stream, hạn mức gọi, khoá lưu trữ, bộ đệm brief, công tắc tắt | Backend, Vận hành |
| [04](../npc-ai/04-kien-truc-persona-object.md) | Cấu trúc đối tượng persona, mười luật chung, ba mức `aiEnabled`, cách chèn vào chuỗi AI, quy ước viết hồ sơ | AI/NPC, Nội dung |
| [05](../npc-ai/05-npc-da-co-trong-code.md) | 19 thực thể NPC có sẵn trong mã được nâng cấp thế nào; khuôn bể bark | AI/NPC, Nội dung |
| [06](../npc-ai/06-bo-loc-hau-xu-ly-v1-v8.md) | Tám bộ lọc sau khi mô hình trả lời (V1–V8), kiểm «neo», gợi ý câu hỏi tiếp, đổi sáu mức thành ba cụm mềm, xử lý khi bị chặn | AI/NPC, QA |
| [07](../npc-ai/07-chat-luong-chu.md) | Luật chất lượng chữ: nhiệt độ 0,55, ba loại lỗi cấm, bước đọc lại trước khi gửi, giọng vùng, vòng phản hồi lỗi | Nội dung, AI/NPC |
| [08](../npc-ai/08-npc-procedural-story-generator.md) | Chuyện khách sinh từ hạt giống: đặc tả hàm sinh chuyện, trí nhớ qua ngày, luật bất di, test cùng hạt giống | AI/NPC, Nội dung |
| [09](../npc-ai/09-npc-phu-44.md) | 44 NPC phụ có lá số thật và 9 mẫu sinh; luật giọng cho các bại cách | Nội dung |
| [10](../npc-ai/10-red-team-an-toan.md) | Bảng cấm sáu vùng đỏ, bộ thử đỏ 200 câu trong 13 nhóm, từ chối đúng vai, leo thang ba lượt | QA, AI/NPC |
| [11](../npc-ai/11-khung-hoang-crisis.md) | Khủng hoảng chạy trước AI: bảng mức, câu rời vai, khối hỗ trợ cố định, bộ chặn đứng trước lời gọi AI, huỷ lượt đang stream | AI/NPC, Client, Vận hành |
| [12](../npc-ai/12-offline-service-worker.md) | NPC-AI khi mất mạng: bark và chuyện khách chạy không cần mạng; «mất mạng» khác «AI bị tắt» | Client, Vận hành |
| [13](../npc-ai/13-npc-ai-mmo.md) | Trong phòng nhiều người: cái gì đồng bộ, cái gì riêng từng người; hạn mức khi cả phòng chung một địa chỉ mạng | Backend, AI/NPC |
| [14](../npc-ai/14-chi-phi-quota-van-hanh.md) | Ai trả tiền gọi mô hình, ngân sách đề xuất theo persona, thao tác công tắc tắt, chỉ số theo persona | Vận hành |
| [15](../npc-ai/15-lo-trinh-tich-hop.md) | Lộ trình G0–G4 chi tiết và danh sách 22 tệp khoá | AI/NPC, Client |
| [16](../npc-ai/16-chien-luoc-test.md) | Bốn lớp test: unit, đánh giá lời nhắc, thử đỏ, chạy thật sau khi nối; script cổng chung | QA |

### 21.7.2 Kết quả đối chiếu sách NPC-AI với mã (16/11/2026)

Bốn lượt rà độc lập đọc trọn 16 mục và mở mã để kiểm; các phát hiện nặng đã được kiểm lại lần hai bằng tay. «Chưa có mã» nghĩa là đã tìm tên hàm, tên tệp mà sách nêu và không thấy.

| Mục sách | Đã có trong mã | Chưa có mã | Ghi chú |
|---|---|---|---|
| 01, 04 · persona | 20 persona, mười luật chung, ba hàm đọc persona, điểm chèn vào chuỗi AI; thi hành mức `aiEnabled` (16/11) | — | — |
| 02, 03 · chuỗi AI, hợp đồng | chuỗi `askAI`, proxy, hạn mức, hai công tắc | trần tiền theo tháng; đo theo persona | sách chưa có đường thứ tư: `/api/npc/chat` gọi thẳng mô hình |
| 05 · NPC có sẵn | bể bark gom một chỗ; thoại Lão Tùng, Vân Cốc, Khổng tiên sinh | bark ngoài giờ, lịch 12 giờ và thiện cảm của Thầy Tử Bình | nhiều bể chưa có chỗ phát (§21.5) |
| 06 · bộ lọc | kiểm «neo», gợi ý câu hỏi tiếp, nhãn mềm; lọc đầu ra của NPC chat trên máy chủ | tám bộ lọc V1–V8 chạy sau khi mô hình trả lời | §40.5 |
| 07 · chất lượng chữ | nhiệt độ 0,55 và luật chống xáo chữ trong chuỗi `askAI`; bốn phong cách | khối «đọc lại trước khi gửi» của persona; bảng ghép persona với phong cách | NPC chat dùng nhiệt độ khác (§21.5) |
| 08 · chuyện khách | hàm sinh chuyện, trí nhớ qua ngày, test | chuyện cho sảnh nghề, hợp hôn, trạch nhật, dương trạch | — |
| 09 · NPC phụ | hàm sinh khách theo ngày | 44 NPC phụ có lá số thật, 9 mẫu sinh | — |
| 10 · thử đỏ | hướng dẫn chống thao túng trong lời nhắc; khối rào và bộ kiểm lệnh của NPC chat; bộ thử đỏ 200 câu chạy được bằng `eval-persona` (16/11) | — | bảng cấm của NPC chat không gồm sáu vùng đỏ của sách |
| 11 · khủng hoảng | bộ nhận tín hiệu mức A, B, C; câu rời vai, khối hỗ trợ, cờ 30 phút ở mọi đường trò chuyện (16/11) | ngoại lệ «chuyện kể trong ngoặc» (cố ý không làm) | §40.4 |
| 12 · mất mạng | service worker của app; bark và chuyện khách là hàm thuần; hai câu báo khác nhau (16/11) | test khói | §21.5 |
| 13 · phòng nhiều người | kênh nói chỉ nhận cụm từ; vị trí phát theo vùng gần | — | sách thiếu nhiều loại gói mới, xem [A4](phu-luc/A4-giao-thuc.md) |
| 14 · chi phí | công tắc; hạn mức theo địa chỉ mạng và theo tài khoản | ngân sách theo persona, trần tháng, đo chi phí NPC chat | `VC-021` |
| 15 · lộ trình | G0, G1, G2; script cổng đánh giá (16/11) | — | cổng đạt trên `glm-5.3-flash`, `gamePersona` bật (16/11) |
| 16 · test | sáu bộ test đơn vị | lớp đánh giá lời nhắc, lớp thử đỏ, script cổng chung | năm bộ test NPC-AI không nằm trong lệnh npm nào (`VC-001`) |

Luật của sách mà mọi bộ phận phải giữ, đã có mã bảo vệ:
1. Persona chèn **sau** lớp an toàn và **trước** lớp phong cách; đổi thứ tự là đảo ưu tiên an toàn.
2. Không thêm đường gọi mô hình riêng cho từng persona; khoá của nhà cung cấp chỉ nằm ở máy chủ.
3. Chuyện khách là hàm thuần của hạt giống, khe và người chơi: không mạng, không AI; chỉ nói hoàn cảnh nhẹ, không chết, không bệnh thật, không ly hôn, không tiền.
4. Chuyện khách chỉ hiện với người mở án; không vào bark chung, không vào gói mạng.
5. Bark là chuỗi tĩnh, cùng ngày cùng câu; bể thiếu thì gian im lặng, không bịa giọng.

Luật của sách **chưa có mã bảo vệ**:
1. Chỉ bật persona cho người chơi sau khi qua bộ đánh giá (đúng vai từ 98%, nhóm câu nặng nhất đạt 100%).
2. Bark không được kêu cả phòng cùng hỏi Thầy, vì cả phòng chung một hạn mức theo địa chỉ mạng.

## 21.8 Liên kết với hệ khác

| Hệ | Trao đổi | Chương |
|---|---|---|
| Bói toán | thầy bói, bark gian, chuyện khách | §12 |
| Việc làm, tiệm | mời làm, báo giá, lý lịch nghề | §14, §15 |
| Ẩm thực | bếp trưởng có persona, thiện cảm | §17.3.2 |
| Thầy mệnh lý | trọng tài | §12.6.4 |
| Máy chủ | đường gọi, hạn mức, trí nhớ | §31 |
| An toàn | khủng hoảng, tôn giáo, ngôn từ | §40 |

## 21.9 Kiểm thử, nghiệm thu, việc mở

- Sáu bộ test ở đầu chương. Luật chung: cờ tắt thì bản dựng không chứa dữ liệu persona; cùng hạt giống cho cùng câu; lệnh ngoài khung bị bác.
- Thêm một NPC có tên: thêm persona hoặc vai câu mẫu; thêm bể bark; nếu bán hàng thì chỉ báo giá qua bộ kiểm.
- Việc mở: `VC-005`, `VC-006`, `VC-007`, `VC-008`, `VC-021`. Đã đóng ngày 16/11: `VC-034`, `VC-035`, `VC-038`.
