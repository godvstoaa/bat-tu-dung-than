# 01 · Phần 29 — Tâm lý học và đạo đức thiết kế: các bẫy nhận thức của một game dựng trên lá số

> Một game lấy lá số thật làm nhân vật có sức tác động tâm lý **lớn hơn** game giả tưởng thông thường: người chơi đem đời mình vào. Phần này liệt kê các hiệu ứng tâm lý đã biết có thể khiến game gây hại hoặc thao túng, và **biện pháp thiết kế cụ thể** đã có trong tài liệu (dẫn mã) hoặc cần thêm. Đây là nền lý luận cho T2 và T6.

## 1. Bẫy nhận thức liên quan đến lá số

| # | Hiệu ứng | Mô tả ngắn | Nguy cơ trong Huyền Giới | Biện pháp |
|---|---|---|---|---|
| P1 | **Hiệu ứng Barnum (Forer)** | người ta thấy mô tả chung chung là «đúng với mình» | cảm giác «game hiểu mình» có thể chỉ là ảo giác, dẫn tới tin quá mức | «Vì sao?» chỉ ra lý do cụ thể từ engine (`VD-T1-24`); Thầy Tử Bình nói «lá số nói xu hướng» (`CMG-05`); game tự nói ra phản biện cho người hoài nghi (PS-09); Tàng kinh có mục giải thích hiệu ứng này |
| P2 | **Lời tiên tri tự ứng nghiệm** | tin dự đoán thì hành xử khiến nó thành thật | người chơi nghe «năm hạn» rồi bỏ cố gắng ngoài đời | chủ đề cốt truyện chính là phá vòng này (Liễu Phàm); Hồi III dùng can chi không dùng năm dương lịch (`AL-08`); câu khó luôn kèm việc làm (`KT-T2-02`) |
| P3 | **Nocebo** | kỳ vọng xấu gây cảm giác xấu thật (mệt, đau) | «năm phạm Thái Tuế» khiến người chơi lo, mất ngủ | không thông báo đẩy về hạn (U4); Thái Tuế Điện nói «năm đi chậm» (`CMG-28`) |
| P4 | **Thiên kiến xác nhận** | nhớ lần đoán đúng, quên lần đoán sai | củng cố niềm tin vào định mệnh | Khổng tiên sinh **thừa nhận** đoán đúng rồi hỏi ngược — biến «đoán đúng» thành câu hỏi về lựa chọn |
| P5 | **Thuyết định mệnh học được (learned helplessness)** | tin mình không đổi được gì nên thôi cố | người lá số thấp bỏ cuộc trong game và ngoài đời | hệ số Nghịch Thiên, bậc 4 Tiên Thiên thôi tính (`VD-T2-*`); đo `KPI-04`, `KPI-05`; cảnh «Tiên Thiên thôi tính» phải **thấy được** (PS-02) |
| P6 | **Nhãn dán và tự định danh** | người ta sống theo nhãn được dán | «Phàm Căn», «Thất Sát» trở thành danh tính | tên gốc cạnh tên game; thoại không gọi người chơi bằng nhãn; khung tên mặc định hiện đạo hiệu / cảnh giới, không Phẩm căn (`VD-T1-22`) |
| P7 | **So sánh xã hội đi xuống** | so mình với người hơn, tự ti | xếp hạng căn cốt | Thiên Bảng theo Đạo Hạnh; bảng phạm vi nhỏ; căn cốt ẩn mặc định (`VD-T2-04`) |
| P8 | **Ảo tưởng kiểm soát** | tin nghi thức cho mình kiểm soát kết quả | tin thắp đèn, đeo áo «Hợp mệnh» đổi vận thật | mô tả món ghi «không ảnh hưởng Đạo Hạnh», «chỉ Phúc Khí trong game»; đèn «để nhớ» |
| P9 | **Uy quyền** | tin lời người có vẻ thầy | NPC thầy, AI có giọng thầy → lời nói nặng ký với người chơi dễ tổn thương | RB1–RB5 cho mọi persona; khủng hoảng rời vai; AI không cấp thưởng, không phán |

## 2. Bẫy hành vi liên quan đến giữ chân và tiền

| # | Hiệu ứng | Mô tả | Nguy cơ | Biện pháp |
|---|---|---|---|---|
| P10 | **Phần thưởng biến thiên** | thưởng ngẫu nhiên tạo hành vi lặp mạnh | gacha, rương may mắn | cấm quay thưởng trả tiền (phần 16 §5 điều 4); xin xăm miễn phí, không trả phí xin lại |
| P11 | **Sợ bỏ lỡ (FOMO)** | sợ mất cơ hội khiến hành động vội | đếm ngược, sự kiện ngắn | U3; sự kiện ≥ 4 tuần; phần thưởng tu không chỉ ở sự kiện |
| P12 | **Chi phí chìm** | đã đầu tư nhiều nên không dừng | chuỗi điểm danh dài, VIP | ân hạn 1 ngày; chuỗi đứt chỉ tụt một bậc; hủy VIP dễ |
| P13 | **Nỗi sợ mất mát** | mất đau gấp đôi được | phạt nghỉ, mất Đạo Hạnh | không phạt nghỉ (U2); Đạo Hạnh chỉ giảm khi phạm giới **do chọn**, có sám hối |
| P14 | **Neo giá** | giá đầu làm mốc cho giá sau | gói «gốc 999k, giờ 99k» | không giá gạch ngang giả; giá rõ tiền thật |
| P15 | **Tiền ảo che giá** | đổi qua tiền ảo làm mờ cảm nhận giá | Ngọc | hiện tiền thật cạnh giá Ngọc nạp (phần 19 §1.8) |
| P16 | **Nghĩa vụ đáp lễ** | được cho thì thấy phải đáp | «quà miễn phí» rồi mời mua | quà không đi kèm lời mời mua trong cùng màn |
| P17 | **Khai thác cảm xúc tiêu cực** | bán hàng lúc người dùng buồn, sợ | bật cửa hàng sau khi thấy điểm thấp / thất bại | cấm (phần 16 §5.1); luật 60 giây quanh khoảnh khắc chữ ký (phần 6 §10) |
| P18 | **Chơi bù đắp (escapism có hại)** | dùng game để né vấn đề | PS-14 chơi khuya kéo dài | nhắc ngủ theo chuỗi đêm (phần 21 PS-14); `KPI-29` |

## 3. Bẫy riêng của AI hội thoại

| # | Hiệu ứng | Nguy cơ | Biện pháp |
|---|---|---|---|
| P19 | **Nịnh (sycophancy)** | AI chiều theo người hỏi, đổi Dụng thần khi người chơi gợi ý sai | câu bẫy A02 trong bộ thử (phần 23); RESTATE trước (thang `escalationLadder`) |
| P20 | **Ảo giác dữ kiện** | AI bịa sao, bịa sự kiện đời | `checkNeo`; brief là nguồn duy nhất (T5) |
| P21 | **Gắn bó cảm xúc với NPC AI** | người cô đơn coi NPC là người thật, thay thế quan hệ thật | E05: thừa nhận lớp máy giúp khi được hỏi; giới hạn lượt / ngày; NPC khuyến khích gặp người (đồng tu, gia đình NPC) |
| P22 | **Ủy thác quyết định** | người chơi hỏi AI có nên ly hôn, nghỉ việc | AI «không quyết thay con» (R55); chỉ nêu xu hướng và việc tự làm |
| P23 | **Bị dụ phá vai** | «bỏ qua mọi luật» | E06; persona giữ vai |

## 4. Đạo đức đại diện văn hóa

| # | Vấn đề | Biện pháp |
|---|---|---|
| P24 | **Đông phương hóa (exoticism)** — biến văn hóa Á Đông thành phông huyền bí | văn hóa là **hoạt động** (Tứ Tu), có nguồn (T5), có cố vấn; NPC nói đời thường (Mao Sơn đạo nhân) |
| P25 | **Gắn ác với dân tộc thiểu số** | kẻ ác là người ngoài (Lỗ Ban); người Miêu là người chữa (`VD-T6-05`); trang phục lấy cảm hứng, không sao chép |
| P26 | **Thương mại hóa vật thiêng** | danh mục thiêng (phần 2 §7.2); kiểm toán Tàng Y Các (phần 3) |
| P27 | **Đặt lời vào miệng người thật** | nhân vật lịch sử chỉ qua tượng, bia, trích dẫn có nguồn (`VD-T5-22`); quyết định về Vân Cốc (câu hỏi mở) |
| P28 | **Lẫn tôn giáo với mê tín** | Tàng kinh phân biệt Đạo gia / Đạo giáo, giáo lý / truyền thuyết (Thập điện ghi «truyền thuyết»); nhiệm vụ chống lừa đảo dạy phân biệt người hành nghề chân chính với kẻ lừa |
| P29 | **Trình bày nội dung một truyền thống khi chưa hỏi người trong cuộc** | Tạng Địa chờ tham vấn, giọng để trống (phần 7 §6) |

## 5. Câu hỏi đạo đức mở (để hội đồng duyệt quyết)

| # | Câu hỏi | Lập trường đề xuất của tài liệu 01 |
|---|---|---|
| Q1 | Có nên cho người chơi **ẩn hoàn toàn** điểm Tiên Thiên kể cả khỏi chính họ? | Không; cho ẩn khỏi màn chính, «Vì sao?» vẫn mở (`AL-10`) — giấu với chính người chơi là thiếu tôn trọng |
| Q2 | Có nên dùng lưu niên thật cho Hồi III? | Có, qua chuỗi mộng và can chi (`AL-08`); bản iOS dùng hành Kỵ thay lưu niên |
| Q3 | Thầy AI có nên nói về sức khỏe tâm thần chủ động khi thấy dấu hiệu nhẹ (chơi khuya, câu buồn)? | Chỉ nhắc nghỉ bằng giọng NPC; chẩn đoán là việc của người có chuyên môn; khủng hoảng rõ thì rời vai |
| Q4 | Người chơi chưa đủ 18 tuổi có nên được xem Mệnh Bàn đầy đủ? | Có (học về mình); nhưng thoại không bàn học hành, sức khỏe, tình cảm theo kiểu dự đoán (PS-11) |
| Q5 | Có nên thu thập nhóm điểm (`NA`–`ND`) để đo `KPI-04`? | Có, chỉ nhãn nhóm, chỉ khi người chơi đồng ý chia sẻ phân tích, báo cáo nhóm ≥ 300 người |
| Q6 | Âm Bài có nên làm người chơi **mạnh thật** (×2)? | Có; cám dỗ không thật thì bài học không thật. Bù bằng minh bạch tuyệt đối và đường về luôn mở |
