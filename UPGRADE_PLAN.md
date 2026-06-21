# Kế hoạch nâng cấp toàn diện — tích hợp nội dung kinh điển sâu

## Vấn đề gốc (theo phản hồi)
Luận giải theo lĩnh vực đang **công thức, chung chung** ("ở đâu chả có"). Nguyên nhân:
KB chỉ có mô tả ngắn 1 dòng; không tích hợp nội dung thật từ tài liệu kinh điển.

## Mục tiêu
App luận giải **cá biệt hoá theo từng lá số** — dựa trên (1) Bản chất Nhật Chủ theo
**滴天髓 十干赋**, (2) Hướng dẫn **窮通寶鑑** chi tiết từng ngày × tháng, (3) Tổ hợp Thập thần
sâu, (4) Cách cục sâu — thay vì text cố định.

## Phase 1 — Nghiên cứu & encode 滴天髓 十干赋
- [ ] Research text gốc 10 thiên can (甲木参天… 癸水至弱…)
- [ ] Encode `DITIANSUI_GAN` vào kb.js: mỗi can → { verse (Hán), vi, nature (luận sâu) }
- [ ] selftest: đủ 10 can

## Phase 2 — Encode 窮通寶鑑 hướng dẫn sâu
- [ ] Research guidance chi tiết per 日干 × nguyệt chi (không chỉ 2-3 can, mà luận sâu)
- [ ] Encode `QIONGTONG_DEEP` (120 entry) vào constants.js/kb.js: text cổ + diễn giải
- [ ] selftest: tra đúng entry

## Phase 3 — Mở rộng tổ hợp Thập thần & Cách cục sâu
- [ ] Mở rộng COMBO meaning (combos.js) — thêm tổ hợp, luận sâu hơn
- [ ] Mở rộng PATTERN_GUIDE (kb.js) — mỗi cách cục luận sâu, lấy ý 子平真詮

## Phase 4 — Viết lại tầng luận giải (cá biệt hoá)
- [ ] interpret.js: mỗi lĩnh vực dệt theo 滴天髓 của Nhật Chủ + cách cục + tổ hợp + 用喜忌仇
- [ ] nlg.js composeAnswer: câu trả lời tự do dùng cùng nguồn sâu
- [ ] Thêm field "Bản mệnh kinh điển" (滴天髓 verse + 调候 guidance riêng)

## Phase 5 — UI
- [ ] Card "Bản mệnh kinh điển" (滴天髓 + 窮通寶鑑 cá biệt)
- [ ] Ai.js brief + system prompt cập nhật theo dữ liệu sâu

## Phase 6 — Kiểm chứng
- [ ] selftest: 0 fail
- [ ] npm run build OK
- [ ] Playwright headless: render + chat, 0 console error
