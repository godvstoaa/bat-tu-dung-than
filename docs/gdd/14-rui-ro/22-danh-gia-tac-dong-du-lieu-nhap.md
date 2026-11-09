# 14.22 · Đánh giá tác động xử lý dữ liệu cá nhân — bản nháp (game Huyền Giới)

> Bản nháp hồ sơ theo yêu cầu RISK-LG-54 (đánh giá tác động xử lý) và RISK-LG-55 (chuyển dữ liệu ra nước ngoài). **Mẫu biểu chính thức, nội dung bắt buộc theo Luật Bảo vệ dữ liệu cá nhân 2025 và văn bản hướng dẫn: cần luật sư xác minh.** Tài liệu này tổ chức thông tin để PC điền vào mẫu chính thức.
> Mã: `RISK-DPIA-xx`. Chủ: `PC`. Dữ liệu nguồn: tập 14.12 §1–§3.

---

## 1. Thông tin chung

| Mục | Nội dung |
|---|---|
| Bên kiểm soát / xử lý | [chủ dự án] |
| Người phụ trách bảo vệ dữ liệu | [PC] |
| Hệ thống | Trò chơi Huyền Giới (web, iOS tab Học Quán, Android, PC); máy chủ Cloudflare Worker + Durable Object `TownShard`; proxy AI `/zai` |
| Phiên bản đánh giá | 0.1 (bản nháp theo mã ngày 2026-11-05) |
| Lần rà kế | Mỗi mốc M0–M6 hoặc khi thêm luồng dữ liệu mới |

---

## 2. Mô tả hoạt động xử lý

| Mã | Hoạt động | Dữ liệu | Chủ thể | Nơi xử lý | Mục đích | Căn cứ dự kiến *(cần luật sư xác minh)* |
|---|---|---|---|---|---|---|
| RISK-DPIA-01 | Lập nhân vật từ ngày sinh | Ngày giờ sinh, giới tính, tên | Người chơi | **Thiết bị** | Chơi game | Không chuyển cho bên kiểm soát — xác minh có thuộc phạm vi «xử lý» của bên kiểm soát không |
| RISK-DPIA-02 | Lưu hồ sơ người thân | Ngày giờ sinh người khác | Bên thứ ba | Thiết bị | Tính năng Sổ Mệnh | Như trên; nhắc người chơi hỏi ý |
| RISK-DPIA-03 | Chơi trực tuyến | Tên, màu áo (suy từ ngày sinh), trang phục, danh hiệu, vị trí, `pid`, `u`, IP | Người chơi | Cloudflare (nhiều quốc gia) | Hiển thị nhân vật cho người khác; chống lạm dụng | Đồng ý (thẻ trước MMO) |
| RISK-DPIA-04 | Báo cáo, kiểm duyệt | `pid` người báo và người bị báo, tên, lý do, thời điểm | Người chơi | Cloudflare | An toàn cộng đồng | Lợi ích hợp pháp / nghĩa vụ pháp luật *(xác minh có căn cứ «lợi ích hợp pháp» trong luật Việt Nam không)* |
| RISK-DPIA-05 | Thầy AI | Câu hỏi tự do (có thể chứa dữ liệu nhạy cảm), brief lá số | Người chơi; bên thứ ba (nếu hỏi hồ sơ người khác) | Proxy Cloudflare → nhà cung cấp AI [quốc gia] | Trả lời câu hỏi | Đồng ý (thẻ đồng ý AI) |
| RISK-DPIA-06 | Số liệu an toàn | Bộ đếm không định danh | — | Cloudflare | Cải thiện an toàn | Không phải dữ liệu cá nhân nếu đúng thiết kế — xác minh |
| RISK-DPIA-07 | Tài khoản (P1–P2) | Định danh đăng nhập, email, năm sinh tuân thủ, trạng thái xác thực | Người chơi | [D1 — vùng lưu trữ] | Đồng bộ; tuân thủ G1 | Hợp đồng; nghĩa vụ pháp luật |
| RISK-DPIA-08 | Thanh toán (M6) | Giao dịch, biên nhận cửa hàng | Người chơi | Cửa hàng, cổng thanh toán, D1 | Bán Ngọc, VIP | Hợp đồng; kế toán |
| RISK-DPIA-09 | Hộp thư hỗ trợ | Email, nội dung thư (có thể nhạy cảm) | Người gửi | Nhà cung cấp email [..] | Hỗ trợ | Đồng ý / yêu cầu của chủ thể |

---

## 3. Đánh giá cần thiết và tương xứng

| Câu hỏi | Trả lời |
|---|---|
| Có thể đạt mục đích với ít dữ liệu hơn không? | Đã làm: ngày sinh không rời máy; MMO chỉ gửi màu, không gửi ngày sinh (`protocol.js` ghi chú «chỉ gửi màu, không gửi ngày sinh»). Còn làm: rút gọn brief theo persona (RISK-PV-20…23), băm IP trong `free:log`, báo cáo có TTL (RISK-109) |
| Có lựa chọn không chia sẻ không? | Có: chơi đơn; «hỏi bằng lá số mẫu»; tắt Thầy AI |
| Thời hạn lưu tương xứng? | Phiên cho MMO; 90 ngày cho báo cáo (đề xuất); số liệu tổng 90 ngày |
| Dữ liệu trẻ em? | Cổng tuổi tại chỗ; < 13 không gửi gì lên máy chủ |
| Dữ liệu nhạy cảm? | Không lưu ở máy chủ; câu hỏi AI có thể chứa — thông báo rõ, khuyên không gõ thông tin nhạy cảm, mức Cao của bộ khủng hoảng không gửi đi (RISK-MH-11) |

---

## 4. Rủi ro đối với chủ thể dữ liệu

| Mã | Rủi ro | Khả năng | Mức độ | Biện pháp | Rủi ro còn lại |
|---|---|---|---|---|---|
| RISK-DPIA-20 | Ngày sinh suy ra từ brief bị nhà cung cấp AI lưu, lộ | Trung bình | Trung bình | Thẻ đồng ý; hợp đồng không lưu / không huấn luyện; lá số mẫu | Thấp – trung bình |
| RISK-DPIA-21 | Câu hỏi AI chứa sức khỏe, tôn giáo bị lưu ngoài nước | Trung bình | Cao | Không lưu phía dự án; nhà cung cấp không lưu; L0 mức Cao không gửi | Trung bình |
| RISK-DPIA-22 | Người chơi khác suy ra Dụng thần qua màu áo | Cao | Thấp | Công bố; cho đổi áo | Thấp |
| RISK-DPIA-23 | Theo dõi qua mã `u` | Thấp | Thấp | Chỉ gửi khi cần; xoay theo mùa | Thấp |
| RISK-DPIA-24 | Báo cáo lưu `pid` quá lâu | Cao (hiện tại) | Thấp | TTL 90 ngày | Thấp |
| RISK-DPIA-25 | Lộ dữ liệu app chính (`vprof`) qua admin chung hạ tầng | Thấp | Cao | RISK-124, RISK-125, đề xuất thu hẹp `vprof` | Trung bình (ngoài phạm vi game) |
| RISK-DPIA-26 | Trẻ em bị thu thập dữ liệu khi khai năm sinh sai | Trung bình | Trung bình | Không thu thập gì đặc biệt ở MMO; tài khoản có luồng phụ huynh | Trung bình |
| RISK-DPIA-27 | Máy dùng chung lộ lá số | Trung bình | Thấp | Nút xóa trên máy | Thấp |
| RISK-DPIA-28 | Máy chủ giả thu `pid` (`?server=`) | Thấp | Thấp | Gỡ tham số (RISK-129) | Rất thấp |
| RISK-DPIA-29 | Tài khoản bị chiếm (P1–P2) | Thấp | Trung bình | Đăng nhập không mật khẩu; phiên an toàn | Thấp |
| RISK-DPIA-30 | Lựa chọn môn phái bị diễn giải là niềm tin tôn giáo | Thấp | Trung bình | Mã trung tính; không phân tích; chính sách | Thấp |

---

## 5. Chuyển dữ liệu ra nước ngoài

| Bên nhận | Dữ liệu | Quốc gia xử lý | Cơ sở / hợp đồng | Biện pháp bảo vệ | Trạng thái |
|---|---|---|---|---|---|
| Cloudflare | Kết nối MMO, IP, proxy AI, KV | Toàn cầu *(cần xác minh vùng)* | Điều khoản dịch vụ / DPA của nhà cung cấp *(xác minh)* | Mã hóa đường truyền; tối thiểu hóa | Cần hồ sơ |
| z.ai (Zhipu) | Brief, câu hỏi | [cần xác minh] | [cần hợp đồng] | Không gửi tên; L0 | Cần hồ sơ + điều khoản |
| Groq, NVIDIA (pool) | Brief (không công cụ), câu hỏi | Hoa Kỳ *(cần xác minh)* | [cần] | Như trên | Cần hồ sơ |
| Apple, Google | Giao dịch, dữ liệu tài khoản cửa hàng | Hoa Kỳ / toàn cầu | Điều khoản cửa hàng | — | Khi bán hàng |

| Mã | Việc |
|---|---|
| RISK-DPIA-40 | Lập hồ sơ đánh giá tác động chuyển dữ liệu ra nước ngoài theo mẫu chính thức trước khi mở AI và MMO công khai *(cần luật sư xác minh thời điểm nộp và cơ quan nhận)*. |
| RISK-DPIA-41 | Chỉ giữ trong pool những nhà cung cấp có hồ sơ; gỡ bằng `ai:config`. |
| RISK-DPIA-42 | Khi đổi nhà cung cấp: cập nhật hồ sơ, thẻ đồng ý (tăng `version`). |

---

## 6. Biện pháp kỹ thuật và tổ chức

| Nhóm | Biện pháp | Trạng thái |
|---|---|---|
| Tối thiểu hóa | Ngày sinh trên máy; MMO chỉ gửi màu; brief rút gọn | Có / Đang làm |
| Kiểm soát truy cập | Admin có token; chuyển sang header / cookie; 2FA hạ tầng | Đang làm (RISK-124) |
| Bảo mật đường truyền | HTTPS, WSS, HSTS | Có |
| Lọc đầu vào | `parseClient`, `cleanName`, `cleanCos` | Có; mở rộng (RISK-122) |
| Thời hạn lưu | TTL KV; TTL báo cáo | Một phần |
| Quyền chủ thể | Màn «Dữ liệu của tôi» | Cần làm (M1) |
| Đào tạo | Điều hành viên (tập 14.12 §6.6), người trực hỗ trợ (tập 14.09 §7) | Cần làm |
| Sự cố | Quy trình 72 giờ (tập 14.12 §8) | Văn bản có; diễn tập cần làm |
| Nhà cung cấp | Bảng nhà cung cấp AI, hợp đồng | Cần làm (M0) |

---

## 7. Kết luận dự kiến

- Phần lớn rủi ro được giảm nhờ thiết kế **dữ liệu sinh ở trên máy**.
- Rủi ro còn lại cao nhất: **câu hỏi AI chứa dữ liệu nhạy cảm đi ra nước ngoài** (RISK-DPIA-21). Điều kiện chấp nhận: thẻ đồng ý rõ, hợp đồng không lưu với nhà cung cấp, L0 chặn mức Cao, không lưu phía dự án.
- Rủi ro ngoài phạm vi game nhưng ảnh hưởng game: dữ liệu `vprof` của app chính — khuyến nghị gửi chủ app.

| Ký | Họ tên | Ngày |
|---|---|---|
| Người phụ trách bảo vệ dữ liệu | | |
| Giám đốc sản xuất | | |
| Ý kiến luật sư | | |
