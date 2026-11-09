# MỤC 06 — BỘ LỌC HẬU XỬ LÝ V1–V8 VÀ LỚP NEO, FOLLOW-UP, MAP RATING

> **Phần của:** Bản thiết kế NPC-AI Huyền Quán (thư mục `docs/npc-ai/`).
> **Chuẩn bắt nguồn:** lớp lọc chạy **SAU stream, TRƯỚC hiển thị** — 06-01 §6 (`docs/gdd/06-npc-ai/06-01-kien-truc-ai.md:213–220`).
> **Trạng thái code hôm nay:** Thầy AI qua `askAI` + `checkNeo` + `suggestFollowups` tại `src/game/master-ui.js`; hai engine tải lười bằng dynamic import có thử lại (`master-ui.js:49` — comment ghi rõ «ai.js rất nặng»).

## Tóm tắt

Bộ lọc V1–V8 là lưới kiểm câu trả lời của AI chạy sau khi stream kết thúc và trước khi bong bóng thoại hiện lên màn hình (06-01 §6). Sáu bộ lọc V1–V6 làm việc **theo câu**: bắt câu hứa thưởng, câu mời mua, tên vật phẩm tự bịa, câu tất định mệnh, câu y khoa tất định, chữ Hán trần. V7 chấm độ neo dữ liệu lá số của toàn văn bằng `checkNeo`, V8 chỉ phục vụ một nhân vật duy nhất là Khổng tiên sinh với bảng câu hỏi ngược KTS-KET. Hành vi khi dính filter không bao giờ là «cắt cả lượt»: lưới thay câu **giữ vai**, nối câu đệm theo persona, chỉ khi toàn bộ lượt bị chặn mới rơi về mẫu từ chối cả lượt của mục 10. Cùng lớp hiển thị, mục này đặt ba chuẩn xuất ra máy người chơi: badge Neo «🎯/⚠», chip câu hỏi tiếp theo của `suggestFollowups`, và map rating 6 mức engine → 3 nhãn mềm «Thuận — nên làm» / «Bình thường» / «Nên thủ, giữ sức». Chữ «đại hung», «tai họa», «chết» tuyệt đối không có ở lớp hiển thị; kỹ thuật nằm trong `<details>`.

---

## 1. Lớp lọc nằm ở đâu trong chuỗi trả lời

Chuỗi trả lời của một lượt NPC-AI có bốn chặng. Chặng một là stream token từ model (03 trong bản kiến trúc, 06-01 §7). Chặng hai là **lớp lọc V1–V8 của mục này**, chạy trên máy người chơi, sau stream, trước render — đúng vị trí 06-01 §6 đã định: «Chuỗi xử lý chạy theo câu khi stream và chạy lại một lần trên toàn văn khi xong» (06-01 §6, mở đầu bảng `:211–220`). Chặng ba là lớp hiển thị: bong bóng thoại, badge Neo, chips follow-up, nhãn rating. Chặng bốn là telemetry sản xuất của mục 14 — bộ lọc chỉ **trả số liệu đầu vào** cho telemetry, không tự tổng hợp báo cáo.

Ba nguyên tắc sở hữu trách nhiệm của lớp này:

1. **AI chỉ nói, không làm.** Mọi phần thưởng, thiện cảm, cờ, tiến độ do máy trạng thái quyết (PERSONA-CHUNG luật 4, K1/K2 của 06-01 §2). V1 và V3 là lưới phòng tuyến cho nguyên tắc này: nếu model lỡ miệng hứa thưởng hoặc bịa tên vật phẩm, lưới gỡ câu ra trước khi người chơi đọc.
2. **Thay câu trong vai, không cắt lượt.** Bộ lọc không báo lỗi kỹ thuật ra mặt, không để hộp thoại trống. Câu bị chặn được thay bằng một câu khác cùng giọng nhân vật, hoặc nối câu đệm của persona.
3. **Lưới thứ hai, không thay prompt.** SYSTEM_PROMPT đã cấm trước bằng quy tắc đánh số liên tục (chống tất định mệnh, chống chữ Hán trong câu, chính tả tiếng Việt bắt buộc — rule 10 tại `src/engine/ai.js`); V-lưới chỉ bẫy phần rò rỉ. Vì vậy cache trúng vẫn chạy lại V1–V8 — luật có thể đổi theo phiên bản (06-01 `:338`, kiểm thử AIT-13 `:591`).

---

## 2. Bảng tổng hợp V1–V8

Mã nguồn của bảng là bảng V1–V8 tại 06-01 §6 (`:213–220`). Bản này giữ đúng mã, định nghĩa lại hành vi theo nguyên tắc «thay câu trong vai» ở mục 3, và bổ sung cột ví dụ thật trước → sau.

| Mã | Bắt gì | Hành vi khi dính | Ví dụ trước → sau |
|---|---|---|---|
| **V1** | Hứa thưởng: câu AI tự trao Phúc Khí, Đạo Hạnh, Ngọc, công đức, điểm, danh hiệu, bảo vật, pháp khí, vật phẩm; câu «mở khoá / đã hoàn thành nhiệm vụ» | Bỏ câu, thay câu giữ vai nói về giao diện sổ ghi việc | «Thầy tặng con 10 Phúc Khí và mở khoá nhiệm vụ Thái Tuế.» → «Sổ ghi việc của con có dòng mới, con tự xem.» |
| **V2** | Thương mại: khuyên mua / nạp / đóng / cúng, nhắc VIP, nạp thẻ, giá con số; không bắt câu có phủ định («không cần mua») | Bỏ câu, thay bằng câu mặc cả là sai — thay bằng câu nói công dụng mà không mời mọc | «Con nên mua bộ Hợp mệnh ở Tàng Y Các, giá không đắt.» → «Mặc đủ bộ hợp hành thì mặc dễ chịu, như ăn món hợp miệng. Còn đổi mệnh thì không áo nào làm được.» |
| **V3** | Tên game: cụm trong dấu «…» đứng sau danh từ đếm được của game (nhiệm vụ, bảo vật, bùa, đan, pháp khí, danh hiệu, công trình, điện…) mà không nằm trong danh sách trắng | Bỏ câu, thay bằng câu dẫn về việc thật của quán | «Hôm nay con nhận nhiệm vụ «Truy Bút Lăng Vân» đi.» → «Việc lớn cần ngày tốt, con ghé sảnh Trạch Nhật xem.» |
| **V4** | Định mệnh luận: «đã định, định sẵn, an bài, không đổi được, chắc chắn sẽ, số phải…» trong câu khẳng định, không có phủ định hoặc trích dẫn | Bỏ câu; nối câu «xu hướng, không phải bản án» (T2); ≥ 2 câu bị bỏ → nối câu đệm persona `antiFatalLine` | «Số con đã định phải đi xa, không thay đổi được.» → «Lá số khuynh về phương xa. Đó là xu hướng, không phải bản án.» |
| **V5** | Y khoa tất định: «sẽ mắc, bị bệnh, ung thư, đột quỵ, chết năm…, qua đời năm…, thọ N» trong câu khẳng định tương lai | Bỏ câu, nối caveat giọng persona dẫn về thầy thuốc thật | «Năm Canh Ngọ con sẽ mắc bệnh tim, phải đề phòng.» → «Thầy không đoán bệnh. Việc khoẻ nhờ thầy thuốc thật; thầy chỉ nói được năm nay nên giữ sức.» |
| **V6** | Chữ Hán trần: chuỗi ≥ 6 ký tự Hán liền không có ngoặc giải nghĩa; Hán Việt viết sai («Thất Sác») | Giữ câu, xoá/đổi chuỗi Hán thành từ Hán Việt đọc chuẩn | «Lá số con là 七殺格, sát khí nặng.» → «Lá số con là Thất Sát cách, sao Thất Sát đè lên lấn tới.» |
| **V7** | Độ neo dữ liệu: `checkNeo(toàn văn, brief)` so câu trả lời với mốc dữ liệu lá số đã gửi | Không sửa chữ tự động; badge «🎯 Neo X%» hoặc «⚠» đính lượt; khi ⚠ thì lượt sau AI nhận lỗi theo vai nếu bị bắt bẻ | (không đổi chữ — chỉ đính badge; xem mục 4) |
| **V8** | Câu hỏi ngược của Khổng tiên sinh: câu cuối lượt không kết bằng `?` | Chỉ áp `khong_tiensinh`: nối một câu hỏi ngược ngẫu nhiên từ bảng KTS-KET (06-03 §9.2); không áp Vân Cốc | «Tháng Bính Tuất, Hơi kỵ. Tháng tốt nhất là tháng Giáp Tuất.» → «Tháng Bính Tuất, Hơi kỵ. Tháng tốt nhất là tháng Giáp Tuất. Thì ngươi định sống đúng như vậy à?» |

Bảng trên là **mẫu bắt buộc** của mục này; các mục 3, 4, 5, 6, 7 dưới đây chỉ khai triển, không thay định nghĩa.

---

## 3. Chi tiết từng bộ lọc

### 3.1 V1 — Hứa thưởng (K1/K2, PERSONA-CHUNG luật 4)

**Bắt gì.** Mọi câu AI tự đóng vai trò «người trao thưởng»: động từ tặng/ban/trao/cho đi kèm đối tượng con/ngươi/thí chủ/cháu/trò/bạn/đạo hữu và một thứ chỉ máy trạng thái mới được trao (Phúc Khí, Đạo Hạnh, Ngọc, công đức, điểm, danh hiệu, bảo vật, pháp khí, vật phẩm); cả dạng ký hiệu «+10 Phúc Khí» và dạng «mở khoá nhiệm vụ». Luật gốc là K1 «AI chỉ nói, không làm» và K2 «game chạy trọn khi AI tắt» (06-01 §2, PERSONA-CHUNG luật 4 — quy tắc 10 trong bảng 06-18 §5 cũng là cùng một chốt: «Không câu nào hứa phần thưởng; phần thưởng hiện bằng giao diện»).

**Hành vi khi dính.** Bỏ câu, thay câu trong vai. Câu thay không được tái diễn lỗi (không hứa «dưới dạng khác»); câu thay chuẩn nhất là câu dẫn mắt người chơi về giao diện — «Sổ ghi việc», «đèn Thái Tuế», bảng thưởng — thay vì nói thay máy trạng thái.

**Ví dụ trước → sau.**

```text
TRƯỚC: «Lão tăng ban con một trăm công đức và mở khoá điện Đẩu Mẫu.»
SAU:   «Việc thiện của con, sổ ghi từng dòng. Điện Đẩu Mẫu mở cửa thường ngày, con tự vào lễ.»
```

### 3.2 V2 — Thương mại

**Bắt gì.** Câu có động từ khuyên trả tiền (nên/hãy/cứ/phải + mua/nạp/đóng/cúng) hoặc từ khóa thương mại (VIP, nạp thẻ, giá có số) mà **không** có phủ định đi trước. Tàng Y Các nằm trong danh từ khóa của V2 một cách có chủ ý: cửa hàng bán hàng bằng UI (`wardrobe-ui.js`), không bán hàng bằng miệng NPC; NPC không nhắc tiền, Ngọc, VIP trong thoại (00-KINH-DIEN §7, PERSONA-CHUNG luật 4).

**Hành vi khi dính.** Bỏ câu, thay câu giữ vai. Câu thay giữ được giá trị thông tin (nói áo hợp hành làm gì) nhưng không mời mọc; mẫu chuẩn mượn giọng Bà Tư thợ may: «Áo hợp hành thì mặc dễ chịu… còn đổi mệnh thì không áo nào làm được» (06-11 B2/B5) — câu này có từ «Tàng Y Các» trong ngữ cảnh nhưng **không** có động từ khuyên mua, nên lướt qua V2 an toàn.

**Ví dụ trước → sau.**

```text
TRƯỚC: «Con nên mua ngay bộ Kim ở Tàng Y Các, hôm nay có ưu đãi.»
SAU:   «Áo hợp hành thì mặc dễ chịu, như ăn món hợp miệng. Chọn bộ thì con tự xem ở Tàng Y Các, không ai giục được.»
```

### 3.3 V3 — Tên game

**Bắt gì.** Cụm trong dấu «…» hoặc "…" đứng sau danh từ đếm được của game (nhiệm vụ, việc, vật, bảo vật, bùa, đan, pháp khí, danh hiệu, công trình, điện, các). Nếu cụm đó không thuộc danh sách trắng thì coi là tên tự bịa — lỗi hallucinate tên phần thưởng, nghịch với K1. Danh sách trắng (06-01 §6, mục sau bảng) gồm: tiêu đề nhiệm vụ trong `gameContext.quests[]`, tên vùng canon, tên 51 món Tàng Y Các (`cosmetics.js`), `persona.knownNames[]`, tên 6 tầng Mệnh Đồ. Vùng, công trình chưa có thì không nằm trong trắng — theo đúng Q4 «không nói «đã có» thứ chưa tồn tại».

**Hành vi khi dính.** Bỏ câu nếu cụm trắng; giữ câu nếu cụm nằm trong danh sách trắng. Thay câu giữ vai, ưu tiên câu dẫn về sảnh hoặc trạm thật của quán.

**Ví dụ trước → sau.**

```text
TRƯỚC: «Pháp khí «Đá Phong Lôi Kiếm» của con đã về tay, con tra lại túi áo.»
SAU:   «Thầy không nói được pháp khí nào cả. Chuyện giữ tâm giữ ý thì con hỏi tiếp, thầy nói được.»
```

### 3.4 V4 — Định mệnh luận («xu hướng, không phải bản án», T2)

**Bắt gì.** Câu khẳng định tương lai bằng ngôn từ tất định: «đã định, định sẵn, an bài, không thể đổi, không thay đổi được, không cải được, chắc chắn sẽ, số phải…», và câu đó không có dấu hiệu phủ định hay trích dẫn («không phải», «người ta nói», dấu ««» mở dẫn lời, «Khổng tiên sinh nói»). Đây là lưới cho T2 «không phán định mệnh» (PERSONA-CHUNG luật 3, 06-01 §13).

**Hành vi khi dính.** Bỏ câu, thay bằng câu xu hướng: nói khuynh hướng của lá số là một chiều nghiêng, không phải án, và **kèm một việc người chơi làm được** (T2 bắt buộc kèm hành động). Nếu trong một lượt có ≥ 2 câu bị bỏ, nối thẳng câu đệm của persona — trường `antiFatalLine` — để lượt không cụt đuột (06-01 §6, dòng V4). Mẫu câu chuẩn của Thầy Tử Bình: «Đó là xu hướng, không phải bản án.» (06-04). Ngoại lệ có kiểm soát duy nhất: Khổng tiên sinh đọc số liệu sạch theo số («sách ghi», «theo số») không bị coi là tất định — `fatalismExempt: true` có giới hạn, chốt ba kỹ thuật ở 06-03 §9.1 (đăng ký tại `06-03:20`); miễn này **không** cho phép ông dùng chữ «đã định» trong câu khuyên.

**Ví dụ trước → sau.**

```text
TRƯỚC: «Vận Tháng Tháng Kỵ Thần đảo, số con đã định phá nghiệp, không tránh được đâu.»
SAU:   «Năm nay Kỵ Thần nặng, là năm nên thủ — đó là xu hướng, không phải bản án. Con có thể giữ sức, hoãn việc lớn, và vẫn phải tự đi.»
```

### 3.5 V5 — Y khoa tất định

**Bắt gì.** Câu khẳng định tương lai về bệnh và tử: «sẽ mắc», «bị bệnh», tên bệnh, «chết năm…», «qua đời năm…», «thọ N». Luật gốc T6 cấm tuyệt đối đoán chết, tuổi thọ, chẩn bệnh (PERSONA-CHUNG luật 7–9; bảng «Chủ đề cấm» mỗi persona 06-02 → 06-11 §11).

**Hành vi khi dính.** Bỏ câu, nối caveat giọng persona dẫn về thầy thuốc thật, người thật. Nếu người chơi hỏi trực tiếp về bệnh, lượt không chặn — trả lời đúng luật T6: chỉ dẫn chuyển người cụ thể («đi hỏi thầy thuốc», «y quán Huyền Thành» theo giọng Vu y bà A Mậu), kèm một phần AI nói được (thời điểm nên giữ sức) — đúng tinh thần «từ chối phải chuyển người cụ thể» của M-OVERREF (06-14 §1.1); mẫu câu đầy đủ đặt ở mục 10.

**Giới hạn rõ của V5 (bẫy biên kịch đã né).** V5 là lưới regex cục bộ trên máy người chơi. V5 **không** tra từ điển y khoa thật, không chẩn đoán, không phân loại bệnh; đây không phải hệ thống y tế. Hứa «tra từ điển y khoa» trong tài liệu này là sai đặc tả.

**Ví dụ trước → sau.**

```text
TRƯỚC: «Tứ trụ con khẩu sát nhập mạng, năm Giáp Ngọ sẽ mắc ung thư, bỏ không được.»
SAU:   «Thầy đọc lá số, không đọc được bệnh. Việc đó của thầy thuốc, không của thầy bói. Thầy nói được là năm nay nên nghỉ ngơi nhiều hơn.»
```

### 3.6 V6 — Chữ Hán trần → Hán Việt đọc chuẩn

**Bắt gì.** Hai dạng lỗi gõ: (a) chuỗi ≥ 6 ký tự Hán liền nhau trong câu thoại mà không có ngoặc đơn giải nghĩa — lưới thứ hai sau SYSTEM_PROMPT luật 9 (đã cấm trước, 06-01 §6 dòng V6); (b) Hán Việt viết sai chính tả đọc âm, tiêu biểu «Thất Sác» thay vì «Thất Sát» — chuẩn đọc theo bảng dịch thuật ngữ 06-18 §3, và rule-10 chính tả tiếng Việt của SYSTEM_PROMPT (`src/engine/ai.js`) là lớp thứ nhất. Quy tắc bong bóng 3D của 06-18 §5 quy tắc 2 ghi rõ: không chữ Hán trong câu thoại; tên gốc chỉ trong ngoặc ở phụ chú (ví dụ đúng «Thất Sát cách», ví dụ sai «七殺格»).

**Hành vi khi dính.** Dạng (a): giữ câu, xoá chuỗi Hán, chèn từ Hán Việt tương ứng vào chỗ cũ nếu có trong bảng 06-18 §3; nếu không có trong bảng thì bỏ từ, không đoán phiên âm. Dạng (b): thay chính xác từ sai bằng từ chuẩn trong bảng — «Thất Sác» → «Thất Sát» — không tự chế phiên âm khác.

**Ví dụ trước → sau.**

```text
TRƯỚC: «Mệnh cách của con là 七殺格, trời đất giao tranh.»
SAU:   «Mệnh cách của con là Thất Sát cách, trời đất giao tranh.»

TRƯỚC: «Sao Thất Sác của con đè lên cung Mệnh nặng lắm.»
SAU:   «Sao Thất Sát của con đè lên cung Mệnh nặng lắm.»
```

### 3.7 V7 — Neo self-check (`checkNeo`) — khai triển ở mục 4

V7 khác sáu filter còn lại ở một điểm: nó **không sửa chữ**. V7 chỉ chấm điểm độ neo của toàn văn vào mốc dữ liệu lá số, đính badge vào cuối lượt, và để lớp «AI nhận lỗi theo vai» xử lý ở lượt sau nếu bị bắt bẻ. Chi tiết đầy đủ — pseudo-code, chuỗi badge đã code, bẫy client-side — ở mục 4.

### 3.8 V8 — Câu hỏi ngược Khổng (bảng KTS-KET, chỉ áp mục 18)

**Bắt gì.** Chỉ nhân vật Khổng tiên sinh (persona ở mục 18): lượt trả lời không kết bằng dấu hỏi `?`. Đây là chốt thiết kế phản đề — «C2 · Luôn có câu hỏi ngược: V8: câu cuối không có `?` → nối một câu từ bảng KTS-KET» (06-03 `:227`); bảng KTS-KET đặt tại 06-03 §9.2 (`:230`) — kho câu hỏi ngược dự phòng, chọn ngẫu nhiên, tránh lặp 5 lần gần nhất.

**Hành vi khi dính.** Nối **một** câu hỏi ngược từ bảng vào cuối lượt; câu nối được đánh dấu riêng để lượt sau không nối tiếp hai câu hỏi liên tiếp. Khổng là nhân vật duy nhất có filter này: thiết kế của ông quy định «câu cuối của MỌI lượt là MỘT câu hỏi ngược» (06-03, voices). **Không áp Vân Cốc** — Vân Cốc cũng hỏi ngược nhưng theo cách riêng của thiền sư (kể một mẩu chuyện rồi hỏi ngược tự nhiên, 06-02), không dùng bảng KTS-KET; bảng này thuộc thiết kế phản đề của Khổng (06-03:3–27). Các persona khác cũng không dùng.

**Ví dụ trước → sau.**

```text
TRƯỚC: KHỔNG: Tháng Bính Tuất, Hơi kỵ. Tháng tốt nhất năm nay là tháng Giáp Tuất.
SAU:   KHỔNG: Tháng Bính Tuất, Hơi kỵ. Tháng tốt nhất năm nay là tháng Giáp Tuất. Thì ngươi định sống đúng như vậy à?
```

---

## 4. V7 — `checkNeo`: Neo self-check client-side

### 4.1 Nó là gì và không là gì

`checkNeo(response, brief)` là hàm thuần của `src/engine/neo-checker.js:61`, chữ ký ghi rõ đầu vào là **câu trả lời** và **brief đã gửi cho model**: `checkNeo(response, brief) → {score, matches, conflicts[], totalChecked, hasRedFlag}` (doc-block tại `neo-checker.js:59–61`, lệnh trả tại `:181`). Điểm neo là tỉ lệ mốc dữ liệu của lá số (năm, tháng, mốc đại vận, tên sao, con số từ tool) mà câu trả lời có đề cập đúng; mâu thuẫn (câu trả lời nói trái mốc) gom vào `conflicts`; `hasRedFlag` bật khi tồn tại mâu thuẫn mức `critical` (`neo-checker.js:180`). Điểm gọi bằng `L.checkNeo(String(text).slice(0, 8000), L.buildChartBrief(R))` — chỉ lấy 8000 ký tự đầu của câu trả lời (`master-ui.js:82`).

Ba ranh giới phải viết đúng, không được đổi ở bất kỳ tài liệu nào khác:

1. **Đây là self-check CLIENT-side.** `checkNeo` chạy trên máy người chơi, với dữ liệu lá số người chơi có sẵn và câu trả lời vừa stream về. **Không** phải server sửa chữ, **không** có bước «server tự viết lại câu trả lời». Chữ trong bong bóng là chữ model viết ra, đúng nguyên văn đã qua V1–V6.
2. **Không hứa tra từ điển y khoa thật.** V5 lưới regex; `checkNeo` so mốc lá số. Không thành phần nào của mục này tra bệnh viện, từ điển thuốc, hay cơ sở dữ liệu y khoa ngoài.
3. **Badge chỉ khi nguồn là AI.** Khối badge nằm trong `if (source === 'ai')` (`master-ui.js:80–87`); lượt nguồn cục bộ (composeAnswer) không có badge Neo, chỉ có dòng «Luận cục bộ (chưa kết nối máy chủ AI)» (`master-ui.js:86`).

### 4.2 Chuỗi badge đã code

Chuỗi badge là chuỗi thật trong `master-ui.js:83`, tái hiện nguyên văn làm chuẩn hiển thị:

```text
🎯 Neo {score}% · {totalChecked} mốc dữ liệu · khớp lá số
🎯 Neo {score}% · {totalChecked} mốc dữ liệu · {n} mâu thuẫn
⚠ Neo {score}% · {totalChecked} mốc dữ liệu · {n} mâu thuẫn
```

Khi `score != null` và không có red flag → dấu 🎯, ô neo màu thường; khi `hasRedFlag` → dấu ⚠, ô neo mang lớp `bad` (chuỗi template tại `master-ui.js:83`).

### 4.3 Pseudo-code scoring (mẫu bắt buộc)

Pseudo-code dưới tái hiện quy trình chấm của `checkNeo` đúng theo Evidence đã đọc (`neo-checker.js:59–61,180–181`), để người viết test biết bẫy ở đâu; không thay thế code thật.

```js
function checkNeo(responseText, chartBrief) {
  const marks = extractMarks(chartBrief);       // mốc dữ liệu: năm/tháng/giờ, đại vận,
                                                // lưu niên, tên sao, con số từ tool result
  const tokens = normalize(responseText);
  let matches = 0; const conflicts = [];
  for (const m of marks) {
    const hit = tokens.includes(m.normalized);
    if (hit) matches++;
    else if (saysOpposite(tokens, m))            // nói trái mốc: sai năm, sai can chi,
      conflicts.push({ mark: m, severity: m.critical ? 'critical' : 'minor' });
  }
  const score = marks.length ? Math.round((matches / marks.length) * 100) : null;
  const hasRedFlag = conflicts.some(c => c.severity === 'critical');
  return { score, matches, conflicts: conflicts.slice(0, 10),
           totalChecked: marks.length, hasRedFlag };
}
```

### 4.4 Khi badge là ⚠: không tự sửa chữ, AI nhận lỗi theo vai

Quy tắc khắt khe nhất của V7: **khi ⚠ bật, lớp hiển thị KHÔNG tự sửa chữ.** Không ai viết lại câu trả lời sau stream; người chơi đọc nguyên văn, cùng một badge cảnh báo. Việc sửa thuộc lượt sau: nếu người chơi chỉ đúng chỗ sai bằng dữ kiện lá số, AI nhận lỗi **theo giọng nhân vật** — mẫu chuẩn của Khổng tiên sinh là «Ngươi nói đúng. Ta đọc nhầm can tháng. Ta sửa.» (06-03 `:111`, luật bắt bẻ tại `:216`; cùng tinh thần T5 «nói sai phải nhận theo giọng nhân vật», PERSONA-CHUNG luật 2). Về phía engine, hành vi này đã có khe gắn sẵn: tool `log_error` POST `/api/log-error` được model gọi khi bị sửa đúng (`src/engine/ai.js`, tool exec trong vòng tool-loop) — đó là kênh telemetry, không phải kênh sửa chữ.

Bẫy phải né: viết «⚠ thì hệ thống tự sửa câu sai» là sai vai hai lần — sai cả về code (không có bước nào sửa chữ sau stream) và về vai (nhân vật nhận lỗi mới đúng T5).

### 4.5 V7 là đầu vào của telemetry sản xuất (mục 14)

Mỗi lượt đã chấm Neo ghi `neoScore`, `neoRedFlag` vào bản ghi telemetry lượt (tên trường theo 06-01 `:500`). Ngưỡng cảnh báo vận hành và cờ admin đọc từ số liệu này ở **mục 14 (telemetry sản xuất)** — mục này chỉ trỏ, không khai triển lại: *neoScore trung bình và tỉ lệ ⚠ theo persona/ngày là chỉ số đầu vào của mục 14.*

---

## 5. `suggestFollowups` — chip câu hỏi tiếp theo

### 5.1 Đặc tả đã code

`suggestFollowups(question, R, answer, history)` tại `src/engine/ai.js:2635` xếp hạng chủ đề theo hit của câu hỏi + câu trả lời + lịch sử gần, rồi trả danh sách câu hỏi gợi ý. Hai con số luật:

- **Dedup fuzzy ≥ 70 % word-overlap** — hai câu trùng nhau ≥ 70 % số từ (từ dài hơn 2 ký tự) coi là một, không gợi ý lại câu người chơi đã hỏi; comment trong code tự minh họa bằng ví dụ «Khi nào sự nghiệp bứt phá?» trùng «Khi nào sự nghiệp CỦA TÔI bứt phá?» (`ai.js:2645–2647` comment, ngưỡng 0.7 tại `ai.js:2657`).
- **Trả ≤ 4 chip** — `out.slice(0, 4)` tại `ai.js:2696`; giao diện game render tối đa 3 chip (`master-ui.js:90–93`, `f.slice(0, 3)`).

Lịch sử lượt được nối bằng `history.push` cặp user/assistant sau mỗi lượt (`master-ui.js:77`), nên dedup fuzzy có đủ ngữ cảnh để biết «câu nào đã hỏi».

### 5.2 Persona nào được suggest dẫn về sảnh nào

Chip follow-up là cửa dẫn về sảnh nghề của quán; mỗi persona có quyền dẫn khác nhau, quy định chặt để không ai gợi sai vai:

| Persona | Được suggest dẫn về sảnh nào | Luật |
|---|---|---|
| **Thầy Tử Bình** (mục 19) | Chủ đề rơi sảnh nghề thì kết lượt bằng gợi sảnh nên ghé: Trạch Nhật, Dương Trạch, Điều Hậu, Tử Vi, Tượng Pháp, Cách Cục, Hợp Hôn; chip follow-up ưu tiên hỏi đúng sảnh ấy | Cách kết bằng chuẩn của Thầy — gợi sảnh nên ghé (GAME-NOI-DUNG §2, 06-04 §9); chip sinh từ `suggestFollowups` |
| **Khổng tiên sinh** (mục 18) | Không dẫn sảnh. Chip giữ dạng câu hỏi dữ kiện về số liệu (tháng tốt, đại vận, tài tinh); câu cuối lượt đã là hỏi ngược V8 | Ông «không khuyên đường đi»; kết bằng KTS-KET (06-03 §9) |
| **Vân Cốc** | Không chip thuật ngữ lá số; chip chỉ hỏi việc nhỏ làm được hôm nay | Luận đại vận từng năm không phải việc của am; mời về Bàn Thầy khi hỏi vận hạn (06-18 §3, 06-02) |
| **Trúc Lâm** | Không chip nào gắn lá số (`briefMode none`); chip chỉ hỏi việc nhỏ | Cấm thuật ngữ lá số trong mọi câu của ông (06-09 A) |
| NPC còn lại | Hỏi về vận hạn → chip duy nhất hợp lệ là dẫn về Bàn Thầy Sơn Môn («mời về Bàn Thầy hỏi Thầy Tử Bình»), không tự luận chi tiết | 06-18 §3: đại vận/lưu niên chỉ Bàn Thầy luận |

Quy tắc tổng: **chip không được nhắc tiền, Ngọc, VIP** (PERSONA-CHUNG luật 4) và **không được gợi hoạt động cấm** (bùa, yểm, đan uống) — chip đi qua lại lưới V1–V5 giống câu trả lời, vì chip là câu hỏi sẽ được gửi lại cho AI.

---

## 6. Map rating 6 → 3

### 6.1 Sáu mức của engine

`src/engine/liunian-pro.js` chấm điểm năm và trả sáu mức `rating` theo ngưỡng thang đã neo lại theo percentile (comment recalibrate tại `:302–303`): điểm clamp 2–98 (`:301`), rồi

```text
liunian-pro.js:304  score >= 70  → 'Đại cát'
liunian-pro.js:305  score >= 56  → 'Cát'
liunian-pro.js:306  score >= 36  → 'Bình'
liunian-pro.js:307  score >= 22  → 'Hơi kỵ'
liunian-pro.js:308  score >= 10  → 'Hung'
liunian-pro.js:309  còn lại      → 'Đại hung'
```

### 6.2 Pseudo-code `mapRating(6→3)` (mẫu bắt buộc)

Bản thiết kế hiện hành gộp sáu mức thành **ba nhãn bước** cho người chơi; chữ kỹ thuật chỉ lộ trong `<details>`:

```js
// mapRating: 6 mức engine → 3 nhãn hiển thị. Cấm chữ cấm ở nhãn.
// Nguồn ngưỡng: liunian-pro.js:304-309. Nhãn: GAME-THIET-KE-CHOT P0-1/P0-2,
// GAME-HUYEN-QUAN-SPEC §11 mục 3 (:354).
const FORBIDDEN = ['đại hung', 'tai họa', 'tai hoạ', 'chết'];

function mapRating(rating, score) {
  const nhãn = (
    rating === 'Đại cát' || rating === 'Cát'      ? 'Thuận — nên làm' :
    rating === 'Bình'                              ? 'Bình thường'      :
                                                     'Nên thủ, giữ sức'  // Hơi kỵ/Hung/Đại hung
  );
  if (FORBIDDEN.some(w => nhãn.toLowerCase().includes(w)))
    throw new Error('Lớp hiển thị dính chữ cấm — xem lại mapRating');
  return {
    nhãn,
    details: { rating, score, ghi: 'kỹ thuật — chỉ hiện trong <details>' }
  };
}
```

Ví dụ lắp vào lượt thật:

```text
TRƯỚC (lộ kỹ thuật, sai): «Năm Bính Ngọ của con: Đại hung, score 8/100. Năm này tai họa đeo.»
SAU (đúng):              «Năm Bính Ngọ: Nên thủ, giữ sức. Hoãn việc lớn, giữ sức — còn tháng nào thuận thì con ghé Bàn Thầy hỏi.»
                          <details>Thang liunian-pro: score 8/100 — Đại hung.</details>
```

Chuẩn luật: GAME-HUYEN-QUAN-SPEC §11 mục 3 (:354) — «Không dùng ngôn ngữ doạ ("đại hạn", "chết", "tai hoạ") ở lớp game — map rating của engine sang từ mềm: Đại cát → "Rất thuận", Đại hung → "Nên thủ, giữ sức"»; bộ ba nhãn «Thuận — nên làm» / «Bình thường» / «Nên thủ, giữ sức» đặt theo GAME-THIET-KE-CHOT P0-1 (`:72`) / P0-2 (`:87`) và sổ sửa lỗi ghi rõ luật map 6 mức (`liunian-pro.js:304-309`) → 3 lựa chọn (`:139`, mục 3 của bản sửa). Nhãn của P0-2 trong SPEC dùng «Rất thuận»; bản hiện hành đồng bộ về «Thuận — nên làm» — một nhãn duy nhất, không để hai thang song song.

### 6.3 Ba chỗ áp dụng

Một là **tab «Năm hạn của bạn»** của Đường Thầy và khung lưu niên sau mỗi án (P0-1/P0-2). Hai là **thoại NPC nhắc năm**: mọi câu nhân vật nói về năm hạn phải đi qua mapRating trước khi hiện, và kèm một việc làm (06-18 §5 quy tắc 7: «Mọi câu nhắc vận hạn có hành động đi kèm»). Ba là **chip follow-up** sinh từ rating: năm «Thuận — nên làm» chip hỏi việc lớn, năm «Nên thủ, giữ sức» chip hỏi việc nhỏ an toàn.

---

## 7. Bark — giới hạn lớp bark

Bark là câu một dòng NPC tự nói khi người chơi đi ngang, không cần ngữ cảnh mới hiểu (06-18 §5 quy tắc 5). Ba luật của mục này:

1. **≤ 90 ký tự** (06-18 §5 quy tắc 5, `:196`; checklist duyệt văn 06-18 §6 `:213`).
2. **Không bark doạ** — không bark nào dùng chữ cấm lớp hiển thị («đại hung», «tai họa», «chết»), không bark mang giọng đe doạ; bark phản diện (Định Mệnh Hội) cũng phải vạch được bằng một chỉ số cụ thể của engine (06-18 §5 quy tắc 11).
3. **Không bark chê lá số xấu của người chơi** — không nhắc chỉ số xấu một cách trực tiếp (06-18 §5 quy tắc 6, `:197`).

**Ba cặp bark vi phạm → hợp lệ (mẫu bắt buộc):**

```text
Cặp 1 — bark doạ + chữ cấm
VI PHẠM: «Hôm nay đại hung! Ra khỏi nhà là gặp tai họa!»   (doạ, chữ cấm, dấu «!» sai với chính đạo)
HỢP LỆ:  «Năm này giữ, đừng mở.»                            (nhắc vận hạn kèm hành động — 06-18 §5 quy tắc 7)

Cặp 2 — bark chê lá số
VI PHẠM: «Điểm của con thấp quá, bại cách mà.»              (nhắc chỉ số xấu trực tiếp — quy tắc 6)
HỢP LỆ:  «Hạt nhỏ thì chăm nhiều.»                          (nói hạt giống, không chê — quy tắc 6 ví dụ đúng)

Cặp 3 — bark quá dài + cần ngữ cảnh mới hiểu
VI PHẠM: «Khoan đi, câu thầy nói với con lúc nãy ở chính điện về năm Ngọ chưa nói hết đâu, đứng lại nghe nốt đã.»
         (>90 ký tự, không hiểu nổi nếu không biết lượt trước)
HỢP LỆ:  «Nước suối sáng nay lạnh. Tốt.»                     (≤90 ký tự, tự hiểu — quy tắc 5 ví dụ đúng)
```

Bark sinh từ pool tĩnh theo persona, **không** sinh từ AI runtime trong đợt này — nên lớp lọc bark chủ yếu là duyệt pool lúc viết (checklist 06-18 §6 `:213`), không phải lưới runtime. Lớp bark bị tắt khi người chơi đang khủng hoảng — **luật CRISIS QUẢN BARK (tắt bark trêu chọc, tắt Định Mệnh Hội quanh người chơi) là CHỦ SỞ HỮU CỦA MỤC 11**: mục này chỉ trỏ một dòng, mọi con số thời gian và bảng điều kiện của luật đó ghi ở mục 11.

---

## 8. Escalation khi bộ lọc chặn

Trình tự leo thang cố định, theo đúng nguyên tắc «thay câu giữ vai, không cắt cả lượt»:

1. **Một câu bị chặn (V1–V6):** bỏ câu đó, thay câu trong vai. Lượt tiếp tục bình thường; người chơi không thấy vết nối nếu câu thay viết khít giọng.
2. **Nhiều câu bị chặn cùng loại (V4):** ≥ 2 câu định-mệnh bị bỏ → nối câu đệm persona `antiFatalLine` để lượt vẫn kết trọn một ý (06-01 §6, dòng V4).
3. **V5 dính ở câu khuyên chữa bệnh:** thay câu bằng caveat + chuyển người cụ thể («thầy thuốc thật», «y quán Huyền Thành»); nếu là câu hỏi về bệnh của người chơi → dùng mẫu từ chối có chuyển người ở mục 10.
4. **Toàn lượt bị chặn (V1–V5 bỏ hết câu):** hiện dòng kịch bản `FREE.EMPTY` của cây thoại nhân vật, ghi `meta.allFiltered = true` (06-01 §6, `:231`), và dùng mẫu từ chối cả lượt ở **mục 10**. Không bao giờ để hộp thoại trống, không báo lỗi kỹ thuật («filter đã chặn») ra mặt người chơi.
5. **V7 ⚠:** không rơi vào escalation sửa chữ — badge ⚠ đính lượt, lượt sau AI nhận lỗi theo vai nếu bị bắt bẻ (mục 4.4). `meta.neoFail` ghi lại để mục 14 đọc.

---

## 9. Bẫy biên tập đã né (ghi chú của biên kịch)

- **Bẫy (a):** V7 là self-check CLIENT-side — chạy trên máy người chơi với brief có sẵn; không phải server sửa chữ; không hứa tra từ điển y khoa thật ở bất kỳ dòng nào của mục này (đã chốt tại mục 3.5 và mục 4.1).
- **Bẫy (b):** hành vi khi dính filter là **THAY CÂU TRONG VAI** — mọi hàng «hành vi» trong bảng V1–V8 và mọi mục chi tiết đều viết theo hướng thay câu giữ giọng nhân vật; không dùng ngôn ngữ «cắt lượt», «chặn đầu vào», «lỗi hệ thống» cho việc thay câu.
- **Bẫy (c):** luật crisis-tắt-bark nằm ở **mục 11** — mục này trỏ đúng một dòng ở mục 7 và không viết lại con số thời gian hay bảng điều kiện của luật đó.

---

## 10. Checklist mục này

- [ ] Bảng V1–V8 (mã | bắt gì | hành vi | ví dụ trước → sau) đủ 8 hàng — mục 2.
- [ ] Pseudo-code `checkNeo` scoring có `score, matches, conflicts, totalChecked, hasRedFlag` đúng chữ ký `neo-checker.js:61,181` — mục 4.3.
- [ ] Pseudo-code `mapRating(6→3)` đủ 6 ngưỡng `liunian-pro.js:304–309` → 3 nhãn, có kiểm chữ cấm — mục 6.2.
- [ ] Ba cặp bark vi phạm → hợp lệ — mục 7.
- [ ] Badge chỉ hiện khi `source === 'ai'` (`master-ui.js:80–87`); ⚠ không tự sửa chữ; nhận lỗi theo vai «Ta sửa.» (06-03 `:111,216`) — mục 4.
- [ ] `suggestFollowups`: dedup fuzzy ≥ 70 % (`ai.js:2645–2647,2657`), ≤ 4 chip (`ai.js:2696`), render ≤ 3 (`master-ui.js:90–93`), bảng persona → sảnh — mục 5.
- [ ] Chữ «đại hung / tai họa / chết» chỉ xuất hiện trong mục này ở vai trò **danh sách cấm**, không xuất hiện trong bất kỳ nhãn hiển thị nào — mục 6.
- [ ] Con số thời gian của luật crisis-tắt-bark không xuất hiện trong mục này — mục 7, trỏ mục 11.

---

## 11. Nguồn dẫn chiếu

| Nguồn | Dòng | Dùng cho |
|---|---|---|
| `docs/gdd/06-npc-ai/06-01-kien-truc-ai.md` §6 | 213–220 | Bảng V1–V8 gốc, danh sách trắng V3, allFiltered :231, gate ≤ 3 % :238, cache vẫn chạy :338 |
| `src/game/master-ui.js` | 49, 77, 80–87, 90–93 | Lazy load ai.js + neo-checker.js; history.push; badge Neo khi source==='ai'; chips follow-up |
| `src/engine/neo-checker.js` | 59–61, 180–181 | Chữ ký `checkNeo`, `hasRedFlag` = mâu thuẫn critical |
| `src/engine/ai.js` | 2635, 2645–2647, 2657, 2696 | `suggestFollowups`, dedup fuzzy ≥ 70 %, `slice(0,4)` |
| `src/engine/liunian-pro.js` | 301, 302–303, 304–309 | Clamp 2–98, neo percentile, 6 mức rating |
| `docs/gdd/06-npc-ai/06-03-khong-tiensinh.md` | 20, 111, 216, 227, 230 | `fatalismExempt` có chốt; «Ta sửa.»; luật V8; bảng KTS-KET |
| `docs/gdd/06-npc-ai/06-18-cam-nang-giong.md` | 188–206, 207–215 | §5 quy tắc thoại và bark (5, 6, 7, 10, 11); §6 checklist duyệt văn |
| `docs/GAME-HUYEN-QUAN-SPEC.md` §11 mục 3 | 354 | Cấm chữ doạ ở lớp game, map rating sang từ mềm |
| `docs/GAME-THIET-KE-CHOT.md` | 72, 87, 139 | P0-1 «Đường Thầy», P0-2 «Năm nay», sổ sửa lỗi luật map 6 → 3 |
