# 52 · Sổ tay bộ phận Backend

## Sứ mệnh
Giữ những sổ người chơi không được tự sửa, cho người chơi thấy nhau, và giữ tài khoản an toàn — bằng ít thành phần nhất.

## Đọc gì theo thứ tự
1. [00-TONG-QUAN](00-TONG-QUAN.md) §0.8: LN-01, LN-02, LN-05, LN-06, LN-12.
2. [31-MAY-CHU-MANG-DU-LIEU](31-MAY-CHU-MANG-DU-LIEU.md) trọn chương.
3. [A4](phu-luc/A4-giao-thuc.md): gói mạng, route, Durable Object.
4. Phần «máy chủ quyết» của chương 14, 15, 17, 20, 12 (mục thầy mệnh lý).
5. [32-KIEM-THU-TRIEN-KHAI](32-KIEM-THU-TRIEN-KHAI.md) §32.3, §32.4.

## Phạm vi sở hữu
- `worker/` trừ `admin.js` (đồng giữ với Vận hành).
- Lõi dùng chung: `protocol.js`, `auth-core.js`, `guild-core.js`, `estate-core.js`, `econ-core.js`, `roomgrid.js`, `jobzones.js`.
- Client mạng: `net.js`, `account.js`, `econ-client.js`.
- Chương 31.

## Giao diện với bộ phận khác
| Với | Hợp đồng |
|---|---|
| Thiết kế game | luật viết trong lõi thuần; máy chủ không có luật riêng ngoài lõi |
| Client | mỗi gói có bộ lọc trong `protocol.js`; client không tin dữ liệu của người khác |
| AI/NPC | mô hình chỉ đề xuất; bộ kiểm nghiệp vụ nằm phía máy chủ |
| Vận hành | migration mới = thẻ mới; bí mật không nằm trong mã; `AUTH_DEV` chỉ ở máy dev |

## Quy trình một việc
1. Viết luật vào lõi thuần, kèm test thuần.
2. Thêm gói hoặc thao tác: bộ lọc trong `protocol.js`, ca trong `test-quan-protocol`.
3. Nối vào Durable Object; chạy `dev:mmo` và các bộ test cần máy chủ.
4. Nếu thêm lớp lưu trữ: thẻ migration mới trong `wrangler.jsonc`.
5. Sinh lại phụ lục (gói và route tự vào A4); ghi nhật ký.

## Định nghĩa «xong»
- Không trường ngày sinh nào đi qua máy chủ; kiểm bằng test lưu mây (LN-01).
- Thứ gì chạm tiền chung có khoá chống gửi trùng và có dòng trong sổ.
- Gói sai dạng bị bỏ, không làm sập phòng; có trần tần suất.
- Chỉ số định danh đã phát hành không đổi (LN-12).
- Khách chưa đăng nhập không giao dịch với người khác.
- Mục §32.2 đạt; deploy chỉ khi chủ dự án cho phép (QĐ-06).

## Lệnh hay dùng
```bash
npm run dev:mmo
```
```bash
npm run test:mmo
```
```bash
node scripts/test-quan-auth.mjs
```
```bash
node scripts/test-econ-accounts.mjs
```

## Hàng việc hiện tại
`VC-037` (lỗ hổng phòng nhiều người: kiểm sở hữu trang phục và danh hiệu, hàng đợi báo cáo) · `VC-013` (ví lên máy chủ) · `VC-014` (hệ số giờ trong lương) · `VC-027`, `VC-028`, `VC-029`, `VC-031` (cùng Thiết kế game) · `VC-021` (trần chi phí AI) · `VC-015`, `VC-016` (chờ chủ dự án). Chi tiết: [04-LO-TRINH](04-LO-TRINH.md).
