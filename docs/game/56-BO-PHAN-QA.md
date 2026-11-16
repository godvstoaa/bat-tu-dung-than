# 56 · Sổ tay bộ phận Kiểm thử (QA)

## Sứ mệnh
Biết chắc mỗi hệ đang ở trạng thái nào, và không để ai nói «xong» khi chưa có test hoặc số đo.

## Đọc gì theo thứ tự
1. [32-KIEM-THU-TRIEN-KHAI](32-KIEM-THU-TRIEN-KHAI.md): §32.1 (ba tầng test), §32.2 (định nghĩa «xong»).
2. [03-TRANG-THAI](03-TRANG-THAI.md): bạn là người giữ nó.
3. [A2](phu-luc/A2-kiem-thu.md) (danh sách test), [A1](phu-luc/A1-ban-do-ma.md) (mô-đun nào chưa có test).
4. Mục «Kiểm thử và nghiệm thu» của chương hệ thống đang được sửa.
5. [30-KY-THUAT-CLIENT](30-KY-THUAT-CLIENT.md) §30.6 khi kiểm hiệu năng.

## Phạm vi sở hữu
- Mọi `scripts/test-*.mjs`; các script kiểm trên bản thật và chụp ảnh.
- Lệnh test trong `package.json` (cùng Vận hành).
- Chương 03, 32.

## Giao diện với bộ phận khác
| Với | Hợp đồng |
|---|---|
| Mọi bộ phận | mỗi thay đổi kèm bộ test đã chạy và kết quả, ghi ở nhật ký |
| Thiết kế game | mốc cân bằng là ca test, không phải lời hứa |
| Client/3D | ảnh trước và sau; số đo ở điểm cố định |
| Vận hành | danh sách kiểm sau deploy |

## Quy trình một việc
1. Đọc phiếu việc; tiêu chí nghiệm thu phải kiểm được, chưa thì trả lại.
2. Chạy bộ test thuần liên quan; nếu đụng giao thức hoặc sổ máy chủ thì bật máy chủ dev và chạy ba bộ còn lại.
3. Kiểm trong trình duyệt theo luồng người chơi; chụp ảnh.
4. Cập nhật đúng dòng ở chương 03.
5. Lỗi tìm thấy: ghi phiếu việc mới với hiện trạng, mong muốn, nghiệm thu.

## Định nghĩa «xong»
- Test lấy đáp án từ cùng mô-đun nguồn với mã chạy thật (không chép cứng).
- Mọi bảng số mới có ít nhất một ca.
- Ô «Test», «Trình duyệt», «Bản thật» ở chương 03 phản ánh đúng lần kiểm cuối, có ngày.
- Không còn lệnh npm trỏ tệp không tồn tại; không bộ test nào mồ côi ([A2](phu-luc/A2-kiem-thu.md)).

## Lệnh hay dùng
```bash
for f in scripts/test-*.mjs; do node "$f" || echo "TRƯỢT: $f"; done
```
```bash
npm run dev:mmo
```
```bash
npm run test:mmo
```
```bash
node scripts/perf-load.mjs
```
```bash
node scripts/docs-game-lint.mjs
```

## Hàng việc hiện tại
`VC-001` (sửa lệnh test chung — việc đầu tiên) · `VC-008` (kiểm NPC trò chuyện và trọng tài trên bản thật) · `VC-012` (đo khung hình vùng trời) · `VC-033` (đối chiếu con số luật với mã, làm cùng Thiết kế game) · xác nhận các dòng `[MỘT PHẦN]` ở §3.4. Chi tiết: [04-LO-TRINH](04-LO-TRINH.md).
