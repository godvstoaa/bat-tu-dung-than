# KNOWLEDGE-BEHAVIORAL — Corpus hành vi học trong AI luận mệnh

> Tích hợp 167 điểm tri thức hành vi/tâm lý học từ 6 sách vào tầng AI trả lời
> (`src/engine/ai.js`). Mục tiêu: neo nhận định tính cách/hành vi vào nguyên lý
> CÓ CƠ CHẾ thay vì câu sáo Barnum («bạn bề ngoài mạnh mẽ nhưng bên trong nhạy cảm»).

## 1. Nguồn sách (6 cuốn)

| Sách | Tác giả | Điểm | Trục chính |
|---|---|---|---|
| Behave: The Biology of Humans at Our Best and Worst | Robert M. Sapolsky | 42 | Sinh học hành vi: não → hormon → tuổi thơ → gene → tiến hóa → nhóm; nói rõ điều kiện & giới hạn mọi phán đoán |
| Thinking, Fast and Slow | Daniel Kahneman | 25 | Hệ 1/Hệ 2, thiên lệch phán đoán (thả neo, sẵn có, mẫu đại diện, nghiền thiệt, tròng khung), hai cái tôi |
| Atomic Habits | James Clear | 25 | Cơ chế thói quen: lãi kép, bản dạng, vòng gợi ý–khao khát–hành động–thưởng, 4 định luật can thiệp |
| Me, Myself, and Us | Brian R. Little | 25 | Ba tầng bản chất (sinh học–xã hội–tự chọn), dự án cá nhân, tính cách tự do, khớp người–môi trường |
| Attached | Amir Levine & Rachel Heller | 25 | Gắn bó người trưởng thành: an toàn/lo âu/né tránh, hệ thống gắn bó, chiến lược kích hoạt/tắt |
| The Social Animal | Elliot Aronson (tái bản 12) | 25 | Tâm lý xã hội: mâu thuẫn nhận thức, tuân thủ nhóm/thẩm quyền, hai tuyến thuyết phục, quy luật tình cảm |

Corpus gốc: `docs/knowledge/*.json` — mỗi file `{id, title, author, why, points[]}`,
mỗi điểm `{title, source, principle, appHook, tag}`.

## 2. Phương pháp trích

- **Trích ý tưởng, viết lại tiếng Việt** — KHÔNG sao nguyên văn bản quyền. Mỗi điểm
  giữ 1 nguyên lý + 1 cách áp vào luận mệnh (`appHook`), viết hoàn toàn bằng tiếng Việt.
- Kiểm soát bản quyền bằng máy: `node scripts/check-corpus-verbatim.mjs` — exit 1 khi
  có chuỗi tiếng Anh nguyên văn ≥ 8 từ liên tiếp (exempt tên riêng/tiêu đề sách/chương
  dạng Title-Case trong trường `source`/metadata), hoặc điểm thiếu field/rỗng, hoặc KB
  lệch corpus gốc (đếm điểm/meta). Đã chạy pass (exit 0) và chạy nghiệm case xấu (exit 1).
- **Giới hạn nguồn đã kê khai** trong `why` của từng file corpus (web summaries theo
  chương; một số chương trích khái quát cao — chi tiết trong từng file).

## 3. Thống kê theo tag (mapping chủ đề ↔ tag)

| Chủ đề luận mệnh | Tag | Điểm |
|---|---|---|
| Tính cách | `personality` | 27 |
| Tình duyên / cảm xúc | `emotion` | 21 |
| Sự nghiệp / quyết định | `decision` | 36 |
| Sức khỏe / áp lực | `stress` | 16 |
| Quan hệ / xã hội | `social` | 24 |
| Lời khuyên chung / cải vận | `advice` | 23 |
| Thói quen / hành vi cải vận | `habits` | 20 |
| **Tổng** | | **167** |

## 4. Vị trí tích hợp

### `src/engine/behavior-kb.js` (mới)
- `BEHAVIOR_BOOKS` (:8) — meta 6 sách; `BEHAVIOR_KB` (:47) — mảng 167 điểm
  `{book, title, source, principle, appHook, tag}`; `pickBehaviorPoints(chart, max=8)`
  (:225) — chọn tối đa 8 điểm theo ưu tiên chủ đề từ tín hiệu lá số (cách cục→personality,
  chi ngày→emotion, thập thần chủ đạo→decision, ngũ hành lệch→stress, đa thập thần→social,
  habits/advice luôn có), xoay vòng theo hash nhật chủ để 2 lá khác nhau không lặp 8 điểm
  y hệt (cá nhân hoá theo rule 11 SYSTEM_PROMPT).

### `src/engine/ai.js`
- Import (:35) — named import `BEHAVIOR_KB, pickBehaviorPoints`.
- Brief block (:691-704) — trong `buildChartBrief`, sau block «KIẾN THỨC CỔ PHÁP MỞ RỘNG»:
  section `NGUYÊN LÝ HÀNH VI HỌC` — tối đa 8 điểm/lượt (token budget: principle cắt 110,
  appHook cắt 100 ký tự), tiêu đề ALL-CAPS để `_splitBrief` (ai.js:2318) cắt thành section
  riêng cho RAG.
- KW_MAP (:2356-2359) — 4 dòng keyword (tính cách / lời khuyên–thói quen / áp lực–cảm xúc /
  quan hệ) route câu hỏi → section này trong `_selectRelevantSections` (ai.js:2334).
  Câu tổng hợp bypass RAG và nhận full brief như các section khác (ai.js:2727-2736).
- SYSTEM_PROMPT rule **25** (:1396-1399) — «HÀNH VI HỌC — NEO NHẬN ĐỊNH + CHỐNG SÁO
  BARNUM»: (a) neo nhận định vào nguyên lý khi mục trong brief khớp chủ đề; (b) cấm câu
  sáo Barnum — nhận định phải đủ dấu hiệu lá số + cơ chế + điều kiện; (c) khuyên cải vận
  bằng cơ chế hành vi, nói rõ điều kiện + giới hạn. Số 25 là số TIẾP TỤC đầu tiên còn
  trống (23/24 đã chiếm, cấm renumber theo comment ai.js:1209-1213).

### `src/ios/research-prompt.js`
- Rule 7 (:10) — mirror hành vi học cho mode iOS (neo vào brief khi có điểm khớp + cấm
  Barnum). Dữ liệu tri thức KHÔNG mirror — iOS dùng chung brief (system message #2,
  ai.js:2749) bất kể mode, nên corpus đã chảy vào iOS qua mục NGUYÊN LÝ HÀNH VI HỌC.

## 5. Kiểm chứng đã chạy trong session

- `node --check` pass cho `src/engine/ai.js`, `src/engine/behavior-kb.js`, `src/ios/research-prompt.js`.
- `pickBehaviorPoints`: cap ≤8, mỗi tag ≤3, determinstic theo nhật chủ, 2 lá khác nhau
  cho 7/8 điểm khác nhau, mọi field không rỗng + tag hợp lệ (167/167).
- End-to-end `buildChartBrief(analyze(...))` với 2 lá số thật: brief có block hành vi học
  đúng 8 bullet (~2.5k chars trong brief ~95k chars); câu «Tính cách của tôi thế nào ạ?»
  pull đúng section qua RAG; câu tổng hợp nhận full brief; câu vô quan hệ không nhả section này.
- `node scripts/check-corpus-verbatim.mjs` → exit 0; case xấu (tiêm điểm nguyên văn +
  field rỗng) → exit 1 với đủ 4 loại vi phạm, khôi phục file → exit 0 lại.
