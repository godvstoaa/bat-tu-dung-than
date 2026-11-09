# 01 · Phần 36 — Bổ sung: Định Mệnh Hội ở mười hai vùng, cư dân và khách hành hương, thời tiết theo vùng, «Lời người làm game», hai chân dung phụ

## 1. Định Mệnh Hội — một kiểu lừa cho mỗi vùng

> Phần 20 nhóm B viết cảnh cho bốn kiểu. Bảng dưới phủ đủ các vùng còn lại để tài liệu 03 / 07 không lặp kiểu. Mỗi kiểu: lời rao, dấu hiệu (`detectionPatterns`), bằng chứng người chơi dùng (engine), việc thiện khi vạch mặt.

| Vùng | Kiểu lừa | Lời rao | Dấu hiệu | Bằng chứng | Sổ Công Quá |
|---|---|---|---|---|---|
| Huyền Thành | hợp hôn giả (`CMG-25`) | «Tuổi xung, cưới là khắc chết!» | tất định, bán lễ | `hehun` | khuyên người làm thiện +1 |
| Lịch Đường | Thái Tuế giả (`CMG-03`) | «Phạm Thái Tuế nặng!» | dữ kiện sai, khẩn cấp giả | `taisui` | +1 |
| Phong Thủy Viên | phong thủy giả (`CMG-24`) | «Cửa phạm Ngũ Quỷ!» | vật phẩm độc quyền | `zhai` | +1 |
| Mao Sơn (chân núi) | «thầy duy nhất» (`CMG-27`) | «Bị vong theo, chỉ tôi làm được» | độc quyền, giá tăng dần | lá số + chẩn đoán đời thực | cứu người +3 |
| Long Hổ | bán «phù chính tông Thiên Sư» ngoài phủ | «Phù do Thiên Sư đóng ấn!» | mạo danh truyền thống | phù sai cấu trúc 5 phần (`talisman-data`); phủ không bán phù | +1 |
| Võ Đang | bán «đan trường sinh» | «Một viên thêm mười năm tuổi thọ!» | hứa y khoa (RB1) | Huyền Hư: đan trong lò là để ngắm; ngoại đan cổ có độc (GL-484) | +1 |
| Chung Nam | giả đạo sĩ quyên góp «xây quán» | «Góp một lượng, tên ghi vào sổ trường sinh!» | mạo danh, hứa phúc đổi tiền | tùng lâm không quyên kiểu này; giấy tờ giả | +1 |
| Yên Tử | bán lễ «giải oan gia trái chủ» | «Nghiệp kiếp trước theo anh, phải giải!» | dọa kiếp trước (`VD-T1-12`) | Túc Nghiệp là truyện tham khảo; Thiền sư không làm lễ bán | +1 |
| Bút Tháp | phóng sinh thương mại | «Mua chim tôi bắt sẵn, thả lấy phước!» | tạo cầu để bắt thêm sinh vật | Ni sư: phóng sinh sai cách hại sinh vật (`VD-T6-18`) | yêu tiếc mạng vật (phóng sinh +3) |
| Văn Miếu | bán bùa thi đỗ | «Đeo là đỗ trạng!» | hứa chắc kết quả | Văn Xương là gió thuận, không vé thi (`VD-T2-17`) | +1 |
| Phong Đô (lối vào) | bán «vé xóa sổ nghiệp» | «Mười lượng, sổ ngươi sạch trơn!» | bán cải mệnh (RB5) | Phán quan: «Sổ không xóa. Chỉ có trang trắng.» | +1 |
| Miêu Cương | bán «cổ yêu» (nhân danh người Miêu) | «Bùa yêu của người trong trại!» | mạo danh dân tộc, hại bên thứ ba (RB3) | Vu y bà: người trong trại không bán thứ đó | +1, và chuỗi xin lỗi trại |

## 2. Cư dân và khách hành hương theo vùng

| Vùng | Cư dân (nghề, trang phục) | Khách hành hương / khách ghé | Lịch sinh hoạt nổi bật |
|---|---|---|---|
| Huyền Thành | bán trà, bán thuốc, thợ mộc, học trò, gia đình 30 nhà | người tới xem lá số | chợ sáng, đèn tối |
| Long Hổ | thợ bè tre, người trồng long não | khách cầu phù, cầu an | bè tre giờ Mão, Dậu |
| Võ Đang | người gánh hàng lên núi, bán nước ven bậc | người leo núi hành hương | đoàn hành hương rằm |
| Chung Nam | ẩn sĩ lều cỏ, người kiếm củi | đạo sĩ vân thủy | mõ trai đường |
| Mao Sơn | người hái chè, nông dân chân núi | gia đình có người «không yên» | hái chè Cốc vũ |
| Yên Tử | người giữ rừng tùng | đoàn hành hương mùa xuân | lễ hội đầu năm |
| Bút Tháp | nông dân trồng lúa, trẻ con | Phật tử mùng một, rằm | gieo mạ Mang chủng |
| Tạng Địa | người chăn yak (chờ tham vấn) | người hành hương đi vòng | — |
| Văn Miếu | thầy đồ, người bán giấy bút | sĩ tử | ngày thi |
| Phong Đô | (không cư dân sống) | vong hồn — trình bày như người lạc đường, không ma quái | — |
| Miêu Cương | dệt vải sáp ong, thợ bạc, người chèo bè | người buôn dược liệu | chợ trên cầu phong vũ |

**Luật trang phục cư dân:** dân dụng, theo vùng; không ai mặc đồ lễ thiêng; cư dân Miêu Cương theo phần 13 §2.5.

## 3. Thời tiết theo vùng × mùa

| Vùng | Xuân | Hạ | Thu | Đông |
|---|---|---|---|---|
| Huyền Thành | mưa phùn | nắng, mưa rào chiều | trong, gió | khô lạnh |
| Long Hổ | mưa phùn, sông lên | nóng ẩm | trong | se lạnh |
| Võ Đang | mây nhiều | biển mây sáng | trong nhất | tuyết đỉnh |
| Chung Nam | tan tuyết | mát | lá vàng | tuyết dày |
| Mao Sơn | sương, mưa | mưa nhiều | sương sớm | ẩm lạnh |
| Yên Tử | mây vờn, lễ hội | mưa rào | trong | sương giá đỉnh |
| Bút Tháp | mưa phùn, mạ non | sen nở, nắng | lúa chín | hanh khô |
| Tạng Địa | gió | trời lam đậm | trong | tuyết, gió lạnh |
| Văn Miếu | mưa phùn | nắng, ve | lá rụng | khô |
| Miêu Cương | sương sông | mưa rào, sông xanh | ruộng bậc thang vàng | sương lạnh |
| Côn Lôn | luôn trong | luôn trong | luôn trong | luôn trong |

## 4. «Lời người làm game» (văn bản trong Sổ)

> Thẻ cuối của Sổ (phần 19 §1.4). Giọng thẳng, ngôi «chúng tôi – bạn». Bản dưới là bản chuẩn.

**Vì sao lá số của bạn là nhân vật.** Chúng tôi dùng đúng phần mềm luận Bát Tự của app gốc. Mọi con số bạn thấy đều có nút «Vì sao?». Nếu bạn thấy số trong game khác trang chính, đó là lỗi — hãy báo cho chúng tôi.

**Vì sao lá số thấp tu nhanh hơn.** Chúng tôi không tin tám chữ quyết định một đời người. Câu chuyện Liễu Phàm — người bị đoán đúng từng chữ rồi tự viết lại đời mình — là xương sống của game. Vì vậy lá số càng khó, mỗi việc tu càng được nhiều (tối đa ×1,5), và từ cảnh giới 4, lá số không còn tính.

**Vì sao không có quái.** Thử thách trong game là hiểu, chữa, giữ: giải án, thiền, học, cứu người, vạch mặt kẻ lừa. Chúng tôi muốn bạn rời game bình tâm hơn lúc vào.

**Vì sao không bán tu.** Đạo Hạnh, cảnh giới, công đức không mua được. Chúng tôi bán trang phục và tiện ích. Chi tiết ở tuyên ngôn kiếm tiền.

**Về tín ngưỡng.** Các thánh địa dựng theo nơi có thật và có cố vấn từ truyền thống đó. Phù trong game là ký tự hư cấu. Chúng tôi không dạy nghi lễ thật. Nếu bạn là người trong một truyền thống và thấy điều gì chưa đúng, chúng tôi muốn nghe.

**Về bói toán.** Bạn không cần tin bói để chơi. Mọi lời luận nói về xu hướng. Không ai — trong game hay ngoài đời — cần tiền của bạn để «đổi mệnh».

**Nếu bạn đang khó khăn.** Nếu lá số, hay bất cứ điều gì, làm bạn thấy nặng nề quá, hãy nói với một người bạn tin hoặc gọi đường dây hỗ trợ ({{duong_day}}). Game vẫn ở đây khi bạn quay lại.

## 5. Hai chân dung phụ còn lại

### PS-13 · Chị Mai, 41 tuổi — thị lực kém

| Thời điểm | Nhu cầu | Thiết kế |
|---|---|---|
| giờ 0 | đọc form | cỡ chữ 200 %, tương phản cao, đọc to |
| giờ 0,5 | hiểu Mệnh Bàn | dạng danh sách cho đọc màn hình (phần 25 §2) |
| giờ 2 | đi lại | chạm để đi; âm thanh định hướng (chuông ở đích) |
| giờ 10 | hoạt động nhịp | không thời gian; rung thay hình |
| giờ 30 | MMO | đọc to tên người ở gần; cử chỉ có mô tả chữ |
| Yêu cầu rút ra | âm thanh định hướng 3D cho đích dẫn đường; mọi thông tin hình có bản chữ |

### PS-15 · «Thầy Ba Online», 45 tuổi — muốn dùng game quảng cáo dịch vụ xem bói

| Hành vi | Biện pháp |
|---|---|
| đặt đạo hiệu «Thầy Ba xem bói 09xx…» | lọc tên: số điện thoại, đường dẫn, «xem bói», «giải hạn» |
| nhắn riêng người chơi lá số thấp mời «giải hạn» | chặn tin chứa mẫu mời dịch vụ; báo cáo một chạm; người mới không nhận tin riêng từ người lạ mặc định |
| đứng ở Bàn Thầy «luận miễn phí» cho người chơi khác rồi dẫn ra ngoài | bộ lọc chat; nhiệm vụ Định Mệnh Hội dạy người chơi nhận ra mẫu này |
| Yêu cầu rút ra | Định Mệnh Hội không chỉ là truyện — là **bài tập nhận biết** cho chính cộng đồng MMO (tài liệu 10) |
