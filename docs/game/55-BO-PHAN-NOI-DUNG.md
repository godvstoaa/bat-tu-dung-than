# 55 · Sổ tay bộ phận Nội dung và biên kịch

## Sứ mệnh
Mọi chữ người chơi đọc được phải đúng cổ pháp, không doạ ai, không xúc phạm ai, và gọi mỗi thứ bằng đúng một tên.

## Đọc gì theo thứ tự
1. [01-TU-DIEN](01-TU-DIEN.md) trọn chương: bạn là người giữ nó.
2. [40-AN-TOAN-PHAP-LY](40-AN-TOAN-PHAP-LY.md): §40.2 (ngôn từ), §40.3 (tôn giáo), §40.4 (khủng hoảng).
3. [12-BOI-TOAN-VA-NOI-DUNG](12-BOI-TOAN-VA-NOI-DUNG.md), [21-NPC-VA-AI](21-NPC-VA-AI.md).
4. [18-HUYEN-HOC-TU-LUYEN-LUAN-HOI](18-HUYEN-HOC-TU-LUYEN-LUAN-HOI.md) §18.7 (vũ trụ quan cho lời văn).
5. Hồ sơ persona trong `docs/npc-ai/` khi viết cho NPC có tên.

## Phạm vi sở hữu
- Chuỗi hiển thị trong mọi mô-đun: lời thầy, bark, câu mẫu, lời bia, lời luật, lời Âm phủ, tên món, tên nghề, tên phường.
- Nội dung của `persona-data.js`, `bark-pool.js`, `names.js`, `law.js › ARTICLES`, câu đối trong `items.js`.
- Chương 01, 90; đồng giữ 12, 21, 40.

## Giao diện với bộ phận khác
| Với | Hợp đồng |
|---|---|
| Thiết kế game | mỗi khái niệm mới phải được đặt tên ở từ điển trước khi vào mã |
| AI/NPC | bạn viết giọng và câu mẫu; họ giữ lược đồ, bộ lọc |
| Client/UI | lời nút, lời trạng thái theo §22.5 |
| Vận hành | văn bản quyền riêng tư, tuyên bố cố định |

## Quy trình một việc
1. Tra từ điển; thiếu tên thì thêm tên chuẩn và cột «tránh».
2. Viết theo chín luật ngôn từ (§40.2); lời khó luôn kèm một việc làm được.
3. Bark tối đa 90 ký tự; không chữ Hán trần; không nhắc giá ở NPC bán hàng.
4. Chạy test lược đồ persona và test bể bark nếu đụng hai nơi đó.
5. Tìm trong chuỗi hiển thị các từ ở danh sách cấm; ghi nhật ký.

## Định nghĩa «xong»
- Không «đại hung», «tai hoạ», «đã định», «chắc chắn sẽ» ở lớp hiển thị.
- Không lời khuyên y khoa, tài chính, pháp lý ngoài đời.
- Không lời thiêng thật, không gán thuật hại người cho một dân tộc thật.
- Tên dùng đúng từ điển; kiểm tài liệu (mục từ bị cấm) đạt.
- NPC tín ngưỡng chỉ có lời kịch bản đã duyệt.

## Lệnh hay dùng
```bash
node scripts/test-persona-schema.mjs
```
```bash
node scripts/test-bark-pool.mjs
```
```bash
node scripts/test-map-rating.mjs
```
```bash
node scripts/docs-game-lint.mjs
```

## Hàng việc hiện tại
`VC-032` (rà chuỗi hiển thị của các hệ mới) · `VC-022` (đọc sâu một tập tầm nhìn khi cần khai thác) · `VC-007` (cùng AI/NPC) · `VC-020` (văn bản quyền riêng tư, cùng Vận hành). Chi tiết: [04-LO-TRINH](04-LO-TRINH.md).
