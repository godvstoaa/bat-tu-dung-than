# 01 · Phần 33 — Duyệt mẫu: áp sáu trụ cột vào mười hai hệ thống sắp làm

> Cách học luật nhanh nhất là xem luật được áp. Mỗi mục dưới đây là một **bản nháp spec giả định** (viết như một nhà thiết kế mới sẽ viết), rồi **phiếu duyệt** theo câu kiểm phần 1–2, rồi **bản sửa**. Những bản nháp này cố ý chứa lỗi thường gặp.

## 1. Mệnh Bàn — bản nháp «Sức mạnh tổng»

| Bản nháp | Duyệt | Bản sửa |
|---|---|---|
| «Mệnh Bàn hiện một con số **Sức mạnh tổng** = Tiềm Lực + tổng Ngũ Hành Lực × 2 + Thân Lực, để người chơi dễ so sánh.» | ✗ `KT-T1-02` (công thức mới, tính lại mệnh); ✗ `KT-T2-08` (so sánh theo căn cốt); ✗ `VD-T1-21` | Bỏ con số gộp. Mệnh Bàn hiện từng chỉ số đúng engine; so sánh xã hội chỉ qua Đạo Hạnh. |

## 2. Mệnh Đồ — bản nháp «Mở khóa bằng Ngọc»

| Bản nháp | Duyệt | Bản sửa |
|---|---|---|
| «Tầng THỜI và THÁI TUẾ khóa tới cảnh giới 3; người chơi có thể mở sớm bằng 200 Ngọc.» | ✗ `KT-T2-11`; ✗ phần 16 §5 điều 1 | Tầng mở theo thứ tự `gaimenhPlan`; tầng cuối luôn mở; không mở bằng tiền. Có thể **gợi ý** thứ tự theo `pri`, không khóa. |

## 3. Sổ Công Quá — bản nháp «Tụng kinh nhận công đức»

| Bản nháp | Duyệt | Bản sửa |
|---|---|---|
| «Nút "Tụng kinh" ở Bút Tháp: mỗi lần bấm +1 công đức, không giới hạn.» | △ đúng engine (`CONG_QUA`: «đọc / sao kinh +1»); ✗ `VD-T5-18` (biến tụng kinh thành nút buff); ✗ T3 (không kỹ năng) | Giữ mục engine; **trần 1 lần / ngày**; hoạt động là đọc giới thiệu + ngồi nghe ≥ 60 s; không nút lặp. |

## 4. Cảnh giới — bản nháp «Đột phá thất bại»

| Bản nháp | Duyệt | Bản sửa |
|---|---|---|
| «Khi đủ Đạo Hạnh, người chơi "đột phá" cảnh giới; tỷ lệ thành công 60 % + 0,3 × Tiềm Lực; thất bại mất 20 % Đạo Hạnh và bị "tẩu hỏa nhập ma" 24 giờ.» | ✗ `KT-T1-02` (công thức mới); ✗ `KT-T2-04` (lợi thế tích lũy cho căn cốt cao); ✗ `KT-T3-05` (mất Đạo Hạnh khi thua); ✗ `VD-T3-15` (tẩu hỏa nhập ma); ✗ P10 phần 29 (ngẫu nhiên) | Lên cảnh giới **chắc chắn** khi đủ điểm (canon §5); có cảnh lên bậc (khoảnh khắc chữ ký). Muốn có thử thách: ải tĩnh tọa không mất gì khi thua. |

## 5. Khoa cử — bản nháp «Ba người đỗ mỗi kỳ»

| Bản nháp | Duyệt | Bản sửa |
|---|---|---|
| «Đình thí mỗi tuần chỉ 3 người điểm cao nhất máy chủ được khắc bia; người có Văn Xương được cộng 20 % điểm.» | ✗ `VD-T3-16` (thi đè nhau); △ Văn Xương +20 % hợp bản sơ đồ §4.6 nhưng kết hợp với suất giới hạn thành **vé vào** (`VD-T2-17`) | Đỗ theo ngưỡng tuyệt đối; ai đạt cũng khắc bia (dãy riêng `AL-06`); Văn Xương +20 % điểm giữ, ngưỡng đỗ đặt sao cho người không có Văn Xương vẫn đỗ được bằng ôn. Bảng hạng là phụ. |

## 6. Kết phù — bản nháp «Phù thật từ tư liệu»

| Bản nháp | Duyệt | Bản sửa |
|---|---|---|
| «Dùng 20 mẫu phù Mao Sơn thật (ảnh từ sách) làm texture để người chơi tô theo; phù hoàn thành có thể "dán" lên nhà NPC để đuổi tà.» | ✗ `VD-T6-01`; ✗ `KT-T6-01` (người chơi có thể làm theo ngoài đời); ✗ `CMG-02` tinh thần «nhà trước, phù sau» | Ký tự hư cấu (phần 13 §5.4); phù hoàn thành là **bài học cấu trúc**, có thể treo trong nhà riêng để trang trí, không có công năng đuổi tà; án nhà NPC giải bằng chẩn đoán đời thực và bố trí nhà trước. |

## 7. Thái Cực — bản nháp «Đấu Thái Cực»

| Bản nháp | Duyệt | Bản sửa |
|---|---|---|
| «Hai người chơi đối kháng đẩy tay; ai bị đẩy ra khỏi vòng thua, mất 10 Phúc Khí.» | ✗ `VD-T3-09`; ✗ `KT-T3-06` (hại người chơi khác); ✗ `KT-T3-05` | Thái Cực là nhịp điệu dưỡng sinh, chấm độ tròn đều; chế độ đôi là **cùng múa đồng bộ** (giống đồng tu), điểm chung. |

## 8. Sửa nhà — bản nháp «Vật phẩm hóa sát»

| Bản nháp | Duyệt | Bản sửa |
|---|---|---|
| «Tàng Y Các bán "Bát quái kính hóa sát" (50 Ngọc): đặt vào nhà là triệt mọi sát khí, +5 % Phúc Khí.» | ✗ `VD-T6-09` (bán vật hóa giải); ✗ RB5; ✗ GL-329 / GL-332 | Hóa sát bằng **bố trí lại** (dời giường, mở cửa sổ…); gương bát quái là đạo cụ cảnh mua bằng Phúc Khí như đồ nội thất, mô tả «theo tục xưa treo để hóa sát», **không** cộng chỉ số. |

## 9. Tà Lộ — bản nháp «Phe Hắc Đạo»

| Bản nháp | Duyệt | Bản sửa |
|---|---|---|
| «Người chơi Tà Lộ vào phe Hắc Đạo có kỹ năng riêng: yểm người chơi chính lộ để giảm 10 % Đạo Hạnh của họ trong 1 giờ; có bảng xếp hạng Hắc Đạo.» | ✗ `CB-T3-06` (không yểm người chơi); ✗ `KT-T3-06`; ✗ T2 (Tà Lộ là truyện cám dỗ – hồi đầu, không phải phe chơi lâu dài); ✗ GL-726 (không «phe tà») | Không phe; Âm Bài chỉ tác động Hậu Thiên của chính mình; cái giá rơi vào NPC trong truyện; không bảng xếp hạng Tà Lộ; luôn có đường về. |

## 10. Lễ máy chủ — bản nháp «Dâng hương VIP»

| Bản nháp | Duyệt | Bản sửa |
|---|---|---|
| «Rằm tháng Giêng: dâng đèn chung; người VIP được dâng đèn vàng lớn, tên hiện trên bảng "Thí chủ hảo tâm".» | ✗ phần 16 §5 điều 1, 10; ✗ P17 (khoe chi tiêu); ✗ phần 16 §5.1 «xếp hạng người chi tiêu» | Một loại đèn cho mọi người, miễn phí; bảng chỉ hiện **số người cùng dâng**; VIP không có khác biệt trong lễ. |

## 11. Sư đồ — bản nháp «Sư phụ xem lá số đệ tử»

| Bản nháp | Duyệt | Bản sửa |
|---|---|---|
| «Khi nhận đệ tử, sư phụ thấy toàn bộ Mệnh Bàn và ngày sinh đệ tử để hướng dẫn.» | ✗ `KT-T1-11`, `KT-T6-06` (dữ liệu rời máy) | Sư phụ thấy **Mệnh Đồ** khi đệ tử cho phép; Mệnh Bàn chỉ khi đệ tử công khai căn cốt; ngày sinh không bao giờ (`CMG-38`). |

## 12. Thiên Bảng — bản nháp «Bảng Căn Cốt mặc định»

| Bản nháp | Duyệt | Bản sửa |
|---|---|---|
| «Màn Thiên Bảng mở mặc định ở thẻ "Căn Cốt" vì người chơi thích khoe điểm lá số; thẻ Đạo Hạnh ở bên cạnh.» | ✗ `VD-T2-04`; ✗ `KT-T2-08`; ✗ P7 | Mặc định thẻ Đạo Hạnh, phạm vi «đạo hữu của bạn»; cột Tiên Thiên nhạt và chỉ gồm người công khai căn cốt. |

## 13. Bài học rút ra từ mười hai bản nháp

| Lỗi lặp lại | Số lần | Câu kiểm bắt được | Nhắc trong đào tạo |
|---|---|---|---|
| Thêm công thức mới quanh căn cốt | 3 (1, 4, 5) | `KT-T1-02`, `KT-T2-04` | «Ánh xạ, đừng tính lại» |
| Gắn tiền vào tu / lễ / hóa giải | 4 (2, 8, 10, 3) | `KT-T2-11`, RB5 | «Tiền chỉ mua cái để nhìn và để tiện» |
| Đối kháng hoặc tác động lên người chơi khác | 3 (5, 7, 9) | `KT-T3-06` | «Không ai thua vì người khác thắng» |
| Dữ liệu cá nhân rời máy | 1 (11) | `KT-T6-06` | «Ngày sinh không bao giờ rời máy» |
| Biến nghi lễ thành nút / phép | 2 (3, 6) | `VD-T5-18`, `VD-T6-01` | «Nghi lễ là việc của tâm; phù là ký tự hư cấu» |
| Ngẫu nhiên và hình phạt | 1 (4) | `KT-T3-05`, P10 | «Thua chỉ mất thời gian» |
