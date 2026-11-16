# 50 · Sổ tay bộ phận Thiết kế game

## Sứ mệnh
Giữ cho mọi hệ nối với nhau qua lá số và cân bằng với nhau qua tiền, điểm Huyền học và thời gian. Bạn là người viết luật; mã chỉ thi hành.

## Đọc gì theo thứ tự
1. [00-TONG-QUAN](00-TONG-QUAN.md): §0.5 (bản đồ liên kết), §0.8 (luật nền).
2. [01-TU-DIEN](01-TU-DIEN.md), [02-QUYET-DINH](02-QUYET-DINH.md).
3. Chương hệ thống bạn phụ trách (10–20) và [A3](phu-luc/A3-so-lieu.md) mục tương ứng.
4. [40-AN-TOAN-PHAP-LY](40-AN-TOAN-PHAP-LY.md) trước khi đề xuất bất cứ thứ gì chạm tiền thật, tín ngưỡng, ngày sinh.

## Phạm vi sở hữu
- **Luật và bảng số** trong các mô-đun thuần: `jobs.js`, `life.js`, `illness.js`, `items.js`, `estate-core.js`, `vehicles.js`, `econ-data.js`, `market.js`, `cuisine.js`, `venue.js`, `huyenhoc.js`, `amduc.js`, `realm.js`, `luanhoi.js`, `law.js`, `fatequest.js`, `civil.js`, `progress.js`, `cosmetics.js`.
- **Bố cục thế giới** ở mức luật: `citylayout.js`, `batquai.js`, `court.js` (cùng Client/3D).
- Các chương 00, 02, 04, 10–20.

## Giao diện với bộ phận khác
| Với | Bạn đưa | Bạn nhận |
|---|---|---|
| Client/3D | luật, bảng số, mốc cân bằng | giới hạn kỹ thuật, số đo hiệu năng |
| Backend | luật nào máy chủ phải quyết (LN-02), trần, két giữ | sổ nào đã có, lỗ gian lận còn mở |
| AI/NPC | NPC được đề xuất gì, khung giá | hạn mức, chi phí |
| Nội dung | tên gọi mới, lời cần viết | rà ngôn từ |
| QA | mốc cân bằng cần bảo vệ bằng test | kết quả mô phỏng |

## Quy trình một việc
1. Viết thay đổi vào chương L1 trước (luật, lý do, liên kết với hệ khác, tiêu chí nghiệm thu). Chạm luật nền thì thêm quyết định ở chương 02.
2. Sửa bảng số trong mô-đun thuần; thêm hoặc sửa ca test cân bằng.
3. Chạy bộ test của hệ đó và của các hệ ở cột «Liên kết».
4. Sinh lại phụ lục, kiểm tài liệu.
5. Ghi nhật ký.

## Định nghĩa «xong»
- Luật mới có trong đúng **một** chương; chương khác chỉ dẫn `§`.
- Mốc cân bằng của §13.0 không vỡ: một ngày sống tối thiểu ≈ hai ca làm trung bình.
- Không mũi tên nào đi vào tiền từ Phúc Khí, Âm Đức, Ngọc (§0.5.2).
- Mọi phần thưởng mới có trần ngày (LN-15).
- Dòng tương ứng ở §0.5.1 đã cập nhật nếu hệ mới dùng dữ liệu mệnh.
- Mục §32.2 đạt.

## Lệnh hay dùng
```bash
node scripts/test-game-life.mjs
```
```bash
node scripts/test-game-econ.mjs
```
```bash
node scripts/docs-game-gen.mjs
```

## Hàng việc hiện tại
`VC-030` (duyệt trụ cột, mâu thuẫn) · `VC-027`, `VC-028`, `VC-029`, `VC-031` (khép đặc tả) · `VC-018`, `VC-019` (chờ chủ dự án). Chi tiết: [04-LO-TRINH](04-LO-TRINH.md).
