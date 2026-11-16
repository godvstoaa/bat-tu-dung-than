# 57 · Sổ tay bộ phận Vận hành và phát hành

## Sứ mệnh
Đưa bản đúng lên bản thật, biết nó đang khoẻ hay không, và giữ game đứng trong luật của nền tảng.

## Đọc gì theo thứ tự
1. [32-KIEM-THU-TRIEN-KHAI](32-KIEM-THU-TRIEN-KHAI.md): §32.4 (triển khai), §32.5 (bản iOS), §32.6 (vận hành).
2. [31-MAY-CHU-MANG-DU-LIEU](31-MAY-CHU-MANG-DU-LIEU.md): §31.1, §31.8.
3. [40-AN-TOAN-PHAP-LY](40-AN-TOAN-PHAP-LY.md): §40.1, §40.6, §40.7.
4. [TAI-KHOAN-CAI-DAT](../TAI-KHOAN-CAI-DAT.md): cấu hình đăng nhập trên bản thật.
5. [02-QUYET-DINH](02-QUYET-DINH.md) §2.5: những việc chờ chủ dự án.

## Phạm vi sở hữu
- `wrangler.jsonc`, quy trình CI, bí mật của bản thật, `worker/admin.js` và bảng quản trị.
- Văn bản pháp lý: chính sách quyền riêng tư, nhãn kho ứng dụng.
- Sổ giấy phép tài sản (cùng Mỹ thuật).
- [NHAT-KY](NHAT-KY.md); đồng giữ chương 32, 40.

## Giao diện với bộ phận khác
| Với | Hợp đồng |
|---|---|
| Backend | migration mới báo trước; không đặt biến dành cho máy dev lên bản thật |
| QA | chỉ deploy bản đã qua định nghĩa «xong» |
| AI/NPC | trần chi phí, công tắc tắt |
| Chủ dự án | deploy phần máy chủ cần được cho phép (QĐ-06) |

## Quy trình một việc
1. Kiểm cây làm việc sạch và đã commit; không deploy bản chưa commit.
2. Chạy test, dựng bản, kiểm tài liệu.
3. Deploy bằng cách đẩy lên nhánh chính; deploy tay chỉ khi cần và phải commit trước.
4. Sau deploy: vào được game, chạy một script kiểm trên bản thật, xem nhật ký lỗi.
5. Ghi nhật ký: mã phiên bản, migration đã áp, kết quả kiểm.

## Định nghĩa «xong»
- Bản thật khớp một commit trên nhánh chính.
- Không bí mật nào trong mã hay trong bản dựng.
- Bản iOS (khi có) tắt đúng danh sách ở §32.5 và ẩn nạp.
- Chính sách quyền riêng tư khớp §40.1.
- Bảng quản trị xem được: tiền bơm và hút, cờ nghi vấn, chi phí AI.

## Lệnh hay dùng
```bash
npm run build
```
```bash
npm run deploy
```
```bash
node scripts/live-travel.mjs
```
```bash
node scripts/docs-game-gen.mjs --check
```

## Hàng việc hiện tại
`VC-025` (dọn cây làm việc) · `VC-020` (văn bản quyền riêng tư cho tứ trụ) · `VC-021` (trần chi phí AI) · `VC-023` (tách nhật ký) · `VC-016`, `VC-017` (chờ chủ dự án). Deploy giờ chạy tay (§32.4); sau lần deploy kế tiếp chạy lại cổng persona trên `glm-5.3-flash` (`VC-005`). Chi tiết: [04-LO-TRINH](04-LO-TRINH.md).
