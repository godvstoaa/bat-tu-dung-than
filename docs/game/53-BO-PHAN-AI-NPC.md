# 53 · Sổ tay bộ phận AI và NPC

## Sứ mệnh
Cho NPC có giọng và cho người chơi hỏi được, mặc cả được — mà AI không bao giờ quyết thay máy chủ, không bao giờ doạ, không bao giờ biết ngày sinh của ai.

## Đọc gì theo thứ tự
1. [00-TONG-QUAN](00-TONG-QUAN.md) §0.8: LN-01, LN-06, LN-07, LN-08, LN-11.
2. [21-NPC-VA-AI](21-NPC-VA-AI.md) trọn chương.
3. [40-AN-TOAN-PHAP-LY](40-AN-TOAN-PHAP-LY.md): §40.2 đến §40.5.
4. [12-BOI-TOAN-VA-NOI-DUNG](12-BOI-TOAN-VA-NOI-DUNG.md): §12.1 (thầy bói), mục thầy mệnh lý và trọng tài.
5. Sách `docs/npc-ai/`: hồ sơ persona liên quan (mục 17–36); thiết kế chi tiết của chuỗi AI, bộ lọc, khủng hoảng, test (mục 01–16) tra theo bảng ở §21.7.1.

## Phạm vi sở hữu
- `persona-data.js`, `npc-personas.js`, `bark-pool.js`, `story-gen.js`, `npc-chat-core.js`, `npc-chat-ui.js`, `fortune-npc.js`, `divination.js` (phần trọng tài).
- `worker/npc-chat.js`, `worker/llm.js`.
- Bộ câu đánh giá và bộ lời luận mẫu.
- Chương 21; đồng giữ 40.

## Giao diện với bộ phận khác
| Với | Hợp đồng |
|---|---|
| Nội dung | giọng, bark, câu mẫu do Nội dung viết; bạn giữ lược đồ và bộ lọc |
| Backend | hạn mức, trí nhớ, bộ kiểm nghiệp vụ nằm phía máy chủ |
| Thiết kế game | khung giá, điều kiện mời làm, ma trận quyết định của trọng tài |
| Vận hành | công tắc tắt, chi phí theo tính năng |

## Quy trình một việc
1. Đổi persona hoặc lời nhắc: sửa dữ liệu, chạy test lược đồ.
2. Chạy lại bộ câu cố định (đánh giá persona, lời luận mẫu cho trọng tài).
3. Thử lời dụ phá vai và lời nhồi lệnh; xác nhận bộ kiểm bác đúng.
4. Kiểm AI tắt: câu mẫu vẫn dùng được, nghiệp vụ vẫn làm được bằng nút.
5. Ghi nhật ký kèm kết quả bộ câu.

## Định nghĩa «xong»
- Lời gọi mô hình không chứa ngày sinh, email, tên thật.
- Lệnh ngoài danh sách bị bác; báo giá luôn nằm trong khung; lời NPC khớp giá sổ.
- Lời ra không có lời khuyên đời thực, không lộ là máy, không chữ Hán trần.
- Persona tín ngưỡng chưa có biên bản tham vấn thì chỉ nói kịch bản.
- Cờ tắt thì bản dựng không chứa dữ liệu persona của cờ đó.
- Mục §32.2 đạt.

## Lệnh hay dùng
```bash
node scripts/test-persona-schema.mjs
```
```bash
node scripts/test-game-ai-persona.mjs
```
```bash
node scripts/test-game-fortune.mjs
```
```bash
node scripts/mock-llm.mjs
```

## Hàng việc hiện tại
`VC-007` (rà persona tín ngưỡng) · chạy lại `eval-persona --live --origin <tên miền app>` mỗi khi đổi lời nhắc, mô hình hay persona · `VC-021` (trần chi phí và công tắc) · `VC-008` (kiểm trên bản thật, cùng QA) · duyệt lại hành vi mức B của cổng khủng hoảng cùng đội an toàn. Chi tiết: [04-LO-TRINH](04-LO-TRINH.md).
