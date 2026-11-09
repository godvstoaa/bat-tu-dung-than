# 13.26 · Phụ lục K — Câu hỏi mở và quyết định cần chốt

> Mỗi câu hỏi: bối cảnh, phương án, khuyến nghị kỹ thuật, ai quyết, hạn (TASK bị chặn). Khi chốt, ghi quyết định vào ADR (`docs/adr/`, TASK-062) và sửa phần liên quan của tập này.

| Mã | Câu hỏi | Ai quyết | Hạn (TASK bị chặn) |
|---|---|---|---|
| Q1 | M0 kéo 3 tuần hay giữ 2 tuần + thuê thêm | OWN | trước TASK-001 |
| Q2 | Thế giới 4.608 m, rìa siêu elip | TD + tài liệu 07 | TASK-126 |
| Q3 | Cảnh giới không tụt khi Đạo Hạnh giảm | tài liệu 05, 09 | TASK-023 |
| Q4 | Điểm việc thiện khác bảng `CONG_QUA` của engine | tài liệu 05 | TASK-091 |
| Q5 | Gửi dải Tiềm Lực/lớp Mệnh Cách cho phân tích (cần đồng ý) | OWN | TASK-118 |
| Q6 | Nợ Âm «công khai» với ai | tài liệu 05, 10 | TASK-217 |
| Q7 | Tà Lộ trên iOS | OWN | TASK-244 |
| Q8 | Giữ renderer 2D dự phòng | TD | TASK-150 (hoặc bất kỳ lúc nào) |
| Q9 | Liên kết Sign in with Apple | OWN | TASK-282 |
| Q10 | Hoàn tiền VNPay | OWN + SRV | TASK-271 |
| Q11 | Quyền đầu ra Meshy theo gói | OWN | TASK-147 |
| Q12 | Đơn giá hiện hành (Cloudflare, AI, Meshy) | OPS + OWN | phần 15 §7 |
| Q13 | Điều khoản gói AI phục vụ người dùng cuối | OWN | trước khi mở AI rộng (M0) |
| Q14 | Trao đổi bát tự giữa hai người chơi (Hợp hôn) | TD + OWN | TASK-289 |

## Q1 — Lịch M0

- **Bối cảnh:** bảng việc M0 cần 40 ngày công CLI, 17,5 AI + ENG trong khi 2 tuần × 3 CLI chỉ có 24 (phần 15 §1.3).
- **Phương án:** (a) 3 tuần; (b) 2 tuần, dời 7 ngày công sang M1, thuê 1 CLI hợp đồng; (c) cắt phạm vi M0 (bỏ persona Khổng tiên sinh, Vân Cốc chỉ thoại kịch bản).
- **Khuyến nghị:** (a). (c) làm mất mục tiêu M0 về persona AI; (b) tốn thời gian làm quen của người mới cho 2 tuần.

## Q2 — Kích thước thế giới

- **Bối cảnh:** tâm Mao Sơn, Tạng Địa cách gốc ≈ 1.985 m; rìa tròn 2.000 m không đủ chỗ (phần 07 §1.1).
- **Phương án:** (a) 4.608 m + siêu elip bậc 4 `EDGE 2.080`; (b) 4.608 m + rìa tròn `EDGE 2.200` (vùng trống lớn ở bốn hướng chính); (c) dời tâm các thánh địa góc vào trong (sửa canon).
- **Khuyến nghị:** (a) — không sửa canon, ít diện tích thừa.

## Q3 — Cảnh giới khi Đạo Hạnh giảm

- **Bối cảnh:** canon cho Đạo Hạnh có thể giảm (phạm giới) nhưng Cải Mệnh tầng sâu «không mất».
- **Phương án:** (a) giữ bậc cao nhất đã đạt (`realmMax`), hiện «đạo hạnh hụt»; (b) tụt bậc theo công thức; (c) tụt nhưng giữ mở khóa.
- **Khuyến nghị:** (a) — tránh cảm giác bị phạt (T2), dễ cài, không phá mở khóa.

## Q4 — Điểm việc thiện

- **Bối cảnh:** bản sơ đồ tổng §5.3 cho phóng sinh +1, khuyên thiện +2, kính lão +1; engine `CONG_QUA`: 3, 1, 2; «sửa cầu đường» không có trong engine (phụ lục G.5).
- **Phương án:** (a) theo engine (T1 «không bịa công thức»); (b) theo bản sơ đồ tổng với `override` có lý do; (c) bổ sung `CONG_QUA` trong engine (ảnh hưởng app chính).
- **Khuyến nghị:** (a) mặc định; (b) cho từng trường hợp có lý do lối chơi; (c) chỉ với «sửa cầu đường» nếu tài liệu 05 thấy cần.

## Q5 — Thuộc tính lá số trong phân tích

- **Bối cảnh:** chỉ số thành công số 1 (giữ chân người lá số thấp) cần biết dải Tiềm Lực của người chơi; canon §14 hạn chế gửi Tiên Thiên.
- **Phương án:** (a) gửi dải thô chỉ khi đồng ý phân tích (đề xuất phần 08 §8.1); (b) không gửi, đo qua khảo sát; (c) tính tổng hợp ở client và gửi chỉ số tổng (vd tỉ lệ quay lại theo dải) — không khả thi vì cần nhiều người.
- **Khuyến nghị:** (a), có câu giải thích rõ ở màn đồng ý.

## Q6 — Phạm vi «công khai» của Nợ Âm

- **Phương án:** (a) chỉ trong Sổ Mệnh của chính người chơi (mặc định đề xuất); (b) trên thẻ công khai MMO; (c) người chơi tự chọn.
- **Khuyến nghị:** (a) — «công khai» hiểu là minh bạch với người chơi, không bêu trước người khác; nếu thiết kế muốn hệ quả xã hội, chọn (c).

## Q7 — Tà Lộ trên iOS

- **Bối cảnh:** Tà Lộ không phải bói nhưng chạm âm tà (app chính có cổng tự nguyện); rủi ro duyệt.
- **Phương án:** (a) tắt toàn bộ Tà Lộ trên iOS, giữ chuỗi sám hối/cứu người; (b) giữ có đồng ý.
- **Khuyến nghị:** (a) cho lần nộp đầu; xem lại sau khi có lịch sử duyệt.

## Q8 — Renderer 2D dự phòng

- **Bối cảnh:** `render.js` vẽ sân cũ 20 × 14 ô; Sơn Môn và thế giới mở không có trong 2D.
- **Phương án:** (a) giữ cho máy không có WebGL, hiển thị màn «chế độ giản lược» với danh sách gian (đi bằng menu); (b) bỏ, báo không hỗ trợ.
- **Khuyến nghị:** (a) chi phí thấp (đã có), giữ khả năng tiếp cận.

## Q9 — Sign in with Apple

- **Bối cảnh:** tài khoản thiết bị + mã khôi phục không cần đăng nhập bên thứ ba; Apple chỉ bắt buộc Sign in with Apple khi app có đăng nhập bên thứ ba khác.
- **Khuyến nghị:** không làm trừ khi thêm đăng nhập Google/Facebook hoặc người chơi đòi khôi phục dễ hơn.

## Q10 — Hoàn tiền VNPay

- **Bối cảnh:** không có webhook hoàn tiền chuẩn như Stripe/Apple.
- **Khuyến nghị:** đối soát hằng ngày bằng API truy vấn giao dịch của VNPay (nếu hợp đồng có) hoặc nhập tay qua route quản trị; thu hồi theo `tx`.

## Q11 — Quyền đầu ra Meshy

- **Bối cảnh:** điều khoản sở hữu tài sản do Meshy tạo có thể khác theo gói; 31 tài sản đã tạo chưa ghi gói.
- **Khuyến nghị:** OWN xác nhận gói của tài khoản lúc tạo; ghi `plan` vào `licenses.json`; nếu gói không cho thương mại, tạo lại hoặc thay trước khi bán.

## Q12 — Đơn giá

- **Khuyến nghị:** OPS cập nhật bảng phần 15 §7 bằng giá ngày ký hợp đồng; giữ công thức, chỉ thay tham số.

## Q13 — Gói AI cho người dùng cuối

- **Bối cảnh:** `freeRoute` ưu tiên «z.ai Coding Plan» (gói thuê bao). Gói lập trình thường dành cho người dùng cá nhân/IDE.
- **Khuyến nghị:** xác nhận bằng văn bản với nhà cung cấp; nếu không cho phép, chuyển sang API trả theo token trước khi game mở AI cho nhiều người.

## Q14 — Hợp hôn giữa hai người chơi

- **Bối cảnh:** so lá số hai người cần bát tự của cả hai; canon cấm gửi ngày sinh qua MMO.
- **Phương án:** (a) mỗi người tự nhập bát tự của người kia (người kia đọc cho) — không qua máy chủ; (b) mã hóa đầu-cuối bát tự gửi qua máy chủ (khóa trao đổi bằng ECDH trong trình duyệt); (c) chỉ so phần công khai (màu Dụng/Hỷ) — không đúng cổ pháp.
- **Khuyến nghị:** (a) cho M6 (đơn giản, không dữ liệu nhạy cảm trên máy chủ); (b) khi có nhu cầu thật.
