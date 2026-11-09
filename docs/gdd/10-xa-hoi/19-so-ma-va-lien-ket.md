# 10 · Phần 19 — Sổ mã định danh và liên kết với các tài liệu khác

> Tài liệu 10 chỉ được cấp mã `GUILD-*` và `EV-*` (canon §9). Phần này là **sổ duy nhất** của mọi mã đã mở trong `docs/gdd/10-xa-hoi/`, kèm nơi định nghĩa; và **ma trận phụ thuộc** sang các tài liệu 02–14.

## 19.1 Quy tắc mã

| Mẫu | Nghĩa | Ví dụ |
|---|---|---|
| `GUILD-<tông>` | một trong 9 tông (+ `BM` dành sẵn) | `GUILD-CN` |
| `GUILD-Q-<tông>-00` | chuỗi nhập tông (chạy một lần / người) | `GUILD-Q-TH-00` |
| `GUILD-Q-<tông>-01…10` | kho việc tuần của chi đường | `GUILD-Q-TD-01` |
| `GUILD-RITE-<tông>-01` | tông lễ tuần (NPC chủ trì) | `GUILD-RITE-NH-01` |
| `GUILD-RITE-<tông>-02…04` | đường lễ (người chơi chủ trì) | `GUILD-RITE-CN-02` |
| `GUILD-DT-<tông>-01…11` | công trình đạo tràng chi đường | `GUILD-DT-TT-11` |
| `GUILD-LB-01…12` | bảng Thiên Bảng | `GUILD-LB-03` |
| `GUILD-REL-*` | loại quan hệ người – người | `GUILD-REL-SD` |
| `EV-<lễ>-xx` | lễ tiết (canon §8) | `EV-TET-01` |
| `EV-TMB-xx` | sự kiện Thiên Mệnh Bàn của mùa thứ xx | `EV-TMB-01` (mùa đầu tiên) |
| `EV-CAU-01…19` | đường sửa chữa (mỗi đường một mã; đoạn: `EV-CAU-13/04`) | `EV-CAU-13` |
| `EV-DL-01…05` | đại lễ máy chủ | `EV-DL-04` |

Mã **không** do tài liệu 10 cấp nhưng được dẫn: `MQ-*`, `TL-*` (03), `CQ-*` (05/09), `MG-*`, `ACT-*` (09), `BLD-*`, `POI-*` (07), `MOD-*` (08), `NPC-*`, `BARK-*` (06), `LORE-*` (02), `SKU-*`, `SEASON-*` (11), `UI-*` (12), `TASK-*`, `SCHEMA-*` (13), `RISK-*` (14).

Khóa kỹ thuật **không phải mã canon** (chỉ là khóa dữ liệu): khóa cụm từ (`chao.1`), khóa cử chỉ (`bow`), mẫu nghị sự (`NS-01…13`), mã test (`T-U-*`, `T-I-*`, `T-AB-*`, `T-L-*`, `T-C-*`, `T-P-*`, `T-N-*`), nhân vật thử nghiệm (`PS-1…5`), ca biên (`E-01…30`), khóa chuỗi giao diện (`toast.*`, `dlg.*`).

---

## 19.2 Tông môn (10)

| Mã | Tên | Định nghĩa |
|---|---|---|
| `GUILD-CN` | Chính Nhất Tông | Phần 01 §1.2; Phần 02 §2.1 |
| `GUILD-TV` | Thanh Vi Đan Đỉnh Tông | Phần 02 §2.2 |
| `GUILD-TC` | Toàn Chân Linh Bảo Tông | Phần 02 §2.3 |
| `GUILD-TT` | Thượng Thanh Lư Sơn Tông | Phần 02 §2.4 |
| `GUILD-BD` | Bắc Đế Độ Nhân Tông | Phần 02 §2.5 |
| `GUILD-TH` | Trúc Lâm Thiền Tông | Phần 03 §3.1 |
| `GUILD-TD` | Tịnh Độ Liên Tông | Phần 03 §3.2 |
| `GUILD-MT` | Chuẩn Đề Mật Tông ⚠ (tắt) | Phần 03 §3.3 |
| `GUILD-NH` | Tịnh Minh Nho Tông | Phần 03 §3.4 |
| `GUILD-BM` | dành sẵn — không mở (Y Lư là hội nghề) | Phần 01 §1.2; Phần 03 §3.5 |

## 19.3 Chuỗi nhập tông và việc tuần (99)

| Tông | `-00` nhập tông | `-01` | `-02` | `-03` | `-04` | `-05` | `-06` | `-07` | `-08` | `-09` | `-10` |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CN | Ba nét phù đầu | Phù cho khách | Đèn Đẩu sáng | Quầy đổi mệnh | Chọn ngày cho đàn | Tuần sơn | Đọc Đạo Tạng bộ Chính Nhất | Hộ tống khách hành hương | Đường lên Thiên Sư Phủ | Lặng trước khi kết | Giữ lời hứa sớ |
| TV | Ba hơi thở | Ba trăm hơi thở | Đồng tu | Hái thuốc đúng mùa | Khuyên đi thầy thuốc | Lên Kim Đỉnh | Đọc nội đan | Điều Hậu cho khách | Thái Cực đều bước | Giữ lửa lò | Bậc đá Võ Đang |
| TC | Vân thủy ba chặng | Giữ giới bảy ngày | Khóa sớm tối | Vân thủy | Đón khách | Đạo Tạng khoa nghi | Cách Cục cho khách | Quét núi | Khóa Độ Nhân | Ngồi am | Bình giải án cổ |
| TT | Đèn trong động | Hỏi ăn ngủ trước | Chuyển người tới thầy thuốc | Nhà sáng đèn | Xếp nhà cho khách | Tồn tư | Dỗ trẻ | Đường lên Mao Sơn | Đọc Thượng Thanh | Cứu người trúng yểm (Âm tà) | Đèn đêm làng |
| BD | Một trang sổ | Đọc hai mặt sổ | Dàn hòa | Dẫn người lạc | Cầu đèn | Sám hối có việc sửa | Gánh cùng | Cầu Phong Đô | Kinh theo việc | Ngồi bên sông | Dọn miếu hoang |
| TH | Lên Chùa Đồng | Mười hơi thở | Lên núi bằng chân | Kinh hành | Mang câu hỏi | Năm bước chuyển tâm | Quét lá đường núi | Trà không nói | Đường lên Yên Tử | Tâm ma | Đọc Thiền |
| TD | Một tràng hạt, một con cá, một lời xin lỗi | Phóng sinh đúng cách | Một nghìn danh hiệu | Gánh gạo | Xin lỗi có việc sửa | Mười điều thiện | Đọc kinh theo việc | Dọn hồ | Đường đến Bút Tháp | Hợp Hôn cho khách | Ngồi trước hồ |
| MT ⚠ | Cát và nước | Cát rồi buông | Ánh sáng xanh | Đèn cho người đi núi | Sám hối có việc sửa | Đường tuyết | Tử Vi trên núi tuyết | Đọc vô thường | Gom cát | Ngồi trước tuyết | Vòng quanh đền ⚠ |
| NH | Ba ngày công quá | Thi cùng nhau | Văn hội đọc sách | Ghi sổ công quá | Hiếu đạo | Đặt tên cho khách | Đối câu | Thư Lâu | Đường đến Văn Miếu | Kèm người mới | Vạch thầy bói rởm |

Mã đầy đủ: `GUILD-Q-<tông>-<cột>`. Định nghĩa: Phần 02 §2.x.4 + §2.x.7, Phần 03 §3.x.4 + §3.x.7; dữ liệu Phần 16 §16.7.

## 19.4 Lễ chi đường và tông (36)

| Tông | `-01` (tông lễ) | `-02` | `-03` | `-04` |
|---|---|---|---|---|
| CN | Tiểu Tiếu Đàn | Bái Đẩu | Kết phù cùng nhau | Tạ Thổ |
| TV | Thái Cực Hội | Tọa Đan | Dưỡng Sinh Bát Thế | Thu Thảo |
| TC | Vãn Khóa (/Độ Nhân) | Tảo Khóa | Thuyết Giới | Đón Khách Vân Thủy |
| TT | Tồn Tư Đàn | Tồn Tư Nhỏ | An Trạch Cho Đồng Môn | Thu Kinh Cho Trẻ |
| BD | Đăng Kiều | Giải Oan Đàn | Gánh Cùng | Thả Đèn Sông |
| TH | Thiền Thất Tuần | Tọa Sáng | Kinh Hành Vườn Trúc | Vấn Đáp |
| TD | Liên Đăng Niệm | Phóng Sinh Hồ Sen | Bố Thí Gánh Gạo | Sám Hối Đầu Tháng |
| MT ⚠ | Mạn-đà-la Chung | Quán Tưởng Ánh Sáng | Sám Hối Kim Cương Tát Đỏa | Đi Vòng Kinh Luân ⚠ |
| NH | Thích Điện Tiểu Lễ | Hội Văn | Giảng Sách | Tạ Thầy |

Mã đầy đủ: `GUILD-RITE-<tông>-<cột>`. Dữ liệu: Phần 16 §16.2; lời mở/khép: Phần 17.

## 19.5 Công trình đạo tràng (99)

| Tông | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 | 11 (đặc trưng) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CN | Đàn Môn | Tam Thanh Đường | Tàng Lục Các | Liêu Xá | Trai Đường | Đàn Khố | Pháp Đàn | Chung Cổ Lâu | Hậu Viên Đào | Khách Đường | Thiên Sư Lầu |
| TV | Viện Môn | Huyền Vũ Đường | Đan Kinh Các | Tĩnh Thất | Dược Thiện Đường | Quản Khố | Đan Đường | Chung Lâu | Dược Phố | Khách Đường | Kim Đỉnh Đình |
| TC | Am Môn | Thất Chân Đường | Tàng Kinh Am | Vân Thủy Liêu | Trai Đường | Khố Đầu Phòng | Luật Đường | Khánh Lâu | Ruộng Rau | Khách Đường Thập Phương | Đạo Tạng Lâu |
| TT | Thất Môn | Tam Mao Đường | Thượng Thanh Kinh Các | Tĩnh Liêu | Trai Đường | Thủ Khố | Tồn Tư Đàn | Chung Lâu | Vườn Hương Thảo | Khách Đường | Hoa Dương Động |
| BD | Độ Môn | Huyền Thiên Đường | Sám Hối Các | Liêu Xá | Trai Đường | Thủ Khố | Độ Nhân Đàn | Chung Lâu | Vườn Sen Trắng | Khách Đường | Độ Nhân Kiều |
| TH | Tam Quan | Chánh Điện | Tàng Kinh | Thiền Xá | Trai Đường | Khố Phòng | Thiền Đường | Lầu Chuông | Vườn Trúc | Khách Đường | Thiền Đường Vạn Tùng |
| TD | Tam Quan | Niệm Phật Đường | Tàng Kinh | Liêu Xá | Trai Đường | Khố Phòng | Giảng Đường | Lầu Chuông Mõ | Ao Phóng Sinh | Khách Đường | Cửu Phẩm Liên Đài |
| MT ⚠ | Tam Quan | Chánh Điện | Tàng Kinh | Liêu Xá | Trai Đường | Khố Phòng | Giảng Đường | Lầu Chuông | Hậu Viên | Khách Đường | Chuẩn Đề Các (tạm) |
| NH | Nghi Môn | Văn Từ | Thư Các | Học Xá | Thiện Đường | Thủ Quỹ Phòng | Giảng Đường | Lầu Trống | Vườn Văn | Khách Đường | Tụ Văn Lầu |

Mã đầy đủ: `GUILD-DT-<tông>-<cột>`. Bậc mở: Phần 02 §2.0.2. Mọi công trình qua DoD Phần 01 §1.8.5.

## 19.6 Thiên Bảng (12)

| Mã | Tên | Định nghĩa |
|---|---|---|
| `GUILD-LB-01` | Thiên Bảng Đạo Hạnh | Phần 07 §7.1.2 |
| `GUILD-LB-02` | Tinh Tiến Bảng | §7.1.3 |
| `GUILD-LB-03` | Giải Tiết Khí | §7.1.4 |
| `GUILD-LB-04` | Án Cổ Bảng | §7.1.5 |
| `GUILD-LB-05` | Khoa Bảng | §7.1.6 |
| `GUILD-LB-06` | Đạo Vọng Bảng | §7.1.7 |
| `GUILD-LB-07` | Hội Thiện Bảng | §7.1.8 |
| `GUILD-LB-08` | Hành Hương Ký | §7.1.1, §7.6 |
| `GUILD-LB-09` | Công Đức Bia | §7.1.9 |
| `GUILD-LB-10` | Tông Môn Đồ | §7.1.10 |
| `GUILD-LB-11` | Bia Sự Kiện | §7.1.1; Phần 08 §8.1.7 |
| `GUILD-LB-12` | Học Phái Bảng | §7.1.4 |

## 19.7 Quan hệ (6)

| Mã | Quan hệ | Định nghĩa |
|---|---|---|
| `GUILD-REL-SD` | Sư đồ | Phần 04 §4.1 |
| `GUILD-REL-DT` | Đồng tu | §4.2 |
| `GUILD-REL-KL` | Kim lan | §4.3 |
| `GUILD-REL-DL` | Đạo lữ (hợp hôn) | §4.4 |
| `GUILD-REL-DH2` | Đồng hành (nhóm, đoàn) | §4.5 |
| `GUILD-REL-DH` | Đạo hữu | §4.6 |

## 19.8 Lễ tiết (52 mã: 51 lễ + 1 mã phụ)

| Mã | Lễ | Định nghĩa |
|---|---|---|
| `EV-TAOQUAN-01` | Ông Công ông Táo | Phần 09 §9.1 |
| `EV-TATAITUE-01` | Tạ Thái Tuế | §9.1 |
| `EV-TRUTICH-01` | Trừ tịch – Giao thừa | §9.1 |
| `EV-TET-01` | Tết Nguyên Đán | §9.2 |
| `EV-LAPXUAN-01` | Lập Xuân — đổi niên chủ | §9.2 |
| `EV-NGOCHOANG-01` | Vía Ngọc Hoàng | §9.2 |
| `EV-YENTU-01` | Khai hội Yên Tử | §9.2 |
| `EV-THUONGNGUYEN-01` | Thượng Nguyên – Nguyên Tiêu | §9.2 |
| `EV-YENCUU-01` | Yến Cửu tiết | §9.2 |
| `EV-THODIA-01` | Vía Thổ Địa | §9.2 |
| `EV-VANXUONG-01` | Vía Văn Xương | §9.2 |
| `EV-LAOQUAN-01` | Vía Thái Thượng Lão Quân | §9.2 |
| `EV-NIETBAN-01` | (phụ) Tưởng niệm Phật nhập Niết Bàn | §9.2 |
| `EV-QUANAM-01` | Vía Quán Thế Âm — đản sinh | §9.2 |
| `EV-XUANPHAN-01` | Xuân Phân | §9.3 |
| `EV-HUYENVU-01` | Vía Huyền Thiên Thượng Đế | §9.3 |
| `EV-HANTHUC-01` | Tết Hàn Thực | §9.3 |
| `EV-BANDAO-01` | Hội Bàn Đào | §9.3 |
| `EV-THANHMINH-01` | Thanh Minh | §9.3 |
| `EV-HUNGVUONG-01` | Ngày Nhớ Cội | §9.3 |
| `EV-CHUANDE-01` | Vía Chuẩn Đề | §9.3 |
| `EV-MAOSON-01` | Hội Mao Sơn ⚠ | §9.3 |
| `EV-COCVU-01` | Cốc Vũ — Lễ tạ chữ | §9.3 |
| `EV-PHATDAN-01` | Tuần Phật Đản | §9.4 |
| `EV-TTP-01` | Vía Trương Tam Phong ⚠ | §9.4 |
| `EV-LUTO-01` | Vía Lữ Tổ | §9.4 |
| `EV-DOANNGO-01` | Tết Đoan Ngọ | Phần 10 §10.1 |
| `EV-THIENSU-01` | Vía Trương Thiên Sư ⚠ | §10.1 |
| `EV-HACHI-01` | Hạ Chí — Linh Bảo | §10.1 |
| `EV-QUANAM-02` | Vía Quán Thế Âm — thành đạo | §10.1 |
| `EV-NGHIA-01` | Tiết Nghĩa | §10.1 |
| `EV-THATTICH-01` | Thất Tịch | §10.1 |
| `EV-VULAN-01` | Vu Lan — Trung Nguyên | §10.1 |
| `EV-DIATANG-01` | Vía Địa Tạng | §10.1 |
| `EV-TRUNGTHU-01` | Tết Trung Thu | §10.2 |
| `EV-THUPHAN-01` | Thu Phân — Đình thí | §10.2 |
| `EV-KHONGTU-01` | Khổng Tử đản | §10.2 |
| `EV-CUUHOANG-01` | Cửu Hoàng hội | §10.2 |
| `EV-TRUNGCUU-01` | Trùng Cửu | §10.2 |
| `EV-QUANAM-03` | Vía Quán Thế Âm — xuất gia | §10.2 |
| `EV-TRUNGTHAP-01` | Tết Trùng Thập — Cơm mới | §10.3 |
| `EV-HANGUYEN-01` | Hạ Nguyên | §10.3 |
| `EV-KHENTRANG-01` | Hội Khèn Trăng (hư cấu) | §10.3 |
| `EV-TONGKHACHBA-01` | Hội đèn tháng Mười ⚠ (tắt) | §10.3 |
| `EV-NHAGIAO-01` | Ngày Nhà giáo Việt Nam | §10.3 |
| `EV-TRUCLAM-01` | Giỗ Tổ Trúc Lâm | §10.3 |
| `EV-DIDA-01` | Vía A Di Đà | §10.3 |
| `EV-DONGCHI-01` | Đông Chí — Cửu Cửu Tiêu Hàn | §10.3 |
| `EV-CHUVANAN-01` | Giỗ Chu Văn An ⚠ | §10.3 |
| `EV-LAPBAT-01` | Phật thành đạo — Lạp Bát | §10.3 |
| `EV-TRUNGDUONG-01` | Vía Vương Trùng Dương ⚠ | §10.3 |
| `EV-SOCVONG-01` | Sóc – Vọng hằng tháng | §10.3 |

## 19.9 Sự kiện máy chủ (25)

| Mã | Tên | Định nghĩa |
|---|---|---|
| `EV-TMB-xx` | Thiên Mệnh Bàn mùa thứ xx (`EV-TMB-01` = mùa đầu tiên) | Phần 08 §8.1 |
| `EV-CAU-01…19` | 19 đường (bảng Phần 08 §8.2.1; dữ liệu Phần 16 §16.9) | Phần 08 §8.2 |
| `EV-DL-01` | Đại lễ Khánh thành Thiên Mệnh Bàn | §8.3.2 |
| `EV-DL-02` | Vạn Đăng Thượng Nguyên | §8.3.3 |
| `EV-DL-03` | Vạn Đăng Vu Lan (iOS: Thắp Đèn Báo Hiếu) | §8.3.4 |
| `EV-DL-04` | Vạn Nhân Đồng Tu Đông Chí | §8.3.5 |
| `EV-DL-05` | Đại Hội Quy Nhất | §8.3.6 |

**Tổng mã mới của tài liệu 10:** 10 tông + 99 chuỗi/việc tuần + 36 lễ + 99 công trình + 12 bảng + 6 quan hệ + 52 lễ tiết + 1 Thiên Mệnh Bàn (theo mùa) + 19 đường + 5 đại lễ = **339 mã**.

---

## 19.10 Ma trận phụ thuộc với các tài liệu khác

### 19.10.1 Tài liệu 10 cần từ tài liệu khác

| Tài liệu | Cần gì | Dùng ở |
|---|---|---|
| 02 Thế giới | `LORE-*` cho Codex lễ tiết (dàn ý Phần 18 §18.5); nguồn gốc Thiên Mệnh Bàn; phe Định Mệnh Hội (`FAC-*`) | Phần 08 §8.1.1; Phần 09–10 |
| 03 Cốt truyện | mốc «cứu người» đầu tiên ở Phong Đô (điều kiện `GUILD-BD`); cốt truyện Miêu Cương thoát yểm thuật (Hội Khèn Trăng); biến cố đường sá (`biến_cố` của `EV-CAU`) | Phần 02 §2.5.1; Phần 10 `EV-KHENTRANG-01`; Phần 08 §8.2.2 |
| 04 Chỉ số | mốc Đạo Hạnh, cảnh giới, hệ số Nghịch Thiên (đã có trong canon); các lá số `MAU-C…` cho test hợp hôn | Phần 04 §4.4; Phần 13 T-U-24 |
| 05 Cải mệnh | `CQ-<đạo>-*` (chuỗi tu đạo thống), điều kiện «Quy nhất», chuỗi trả nghiệp có «bước làm cùng» (Gánh Cùng), `DEED-*` cho việc thiện trong lễ | Phần 01 §1.3; Phần 02 §2.5.7 |
| 06 NPC · AI | NPC phụ: Tri Khách Lầu Danh Bộ, chủ Bàn Hợp Hôn, 30 NPC «có chuyện muốn kể», cặp NPC Giải Oan, gia đình NPC Huyền Thành; persona AI Thiền sư (công án trên web) | Phần 14 §14.2; Phần 17 |
| 07 Thánh địa | `BLD-*`: Phường Đạo Tràng, Lầu Danh Bộ, Đình Nghỉ Chân, đình đồng tu, Thiên Mệnh Bàn, Thiên Bảng Đài, Đình Kim Lan, trạm nghỉ, Tổ Sư Tháp, khuê biểu, lò tích tự | Phần 01 §1.8; Phần 04; Phần 08 |
| 08 Công trình | `MOD-*` bộ mô-đun cho 9 bộ đạo tràng × 11 công trình; khuôn khung 6 bậc | Phần 01 §1.8.2–1.8.5; Phần 12 §12.6 |
| 09 Tu luyện | `MG-*`: tĩnh tọa, kết phù, niệm nhịp, Thái Cực, mạn-đà-la, khoa cử, đối câu…; `ACT-*` nguồn vật liệu; con số Đạo Hạnh gốc của mỗi hoạt động | Phần 01 §1.11; Phần 16 §16.2 |
| 11 Kinh tế | `SEASON-xx` (mã mùa); xác nhận giá Phúc Khí của lệ phí lập đường (2.000) và trần góp kho; đồ Tàng Y Các thưởng lễ (không bán) | Phần 01 §1.5.1; Phần 07 §7.6 |
| 12 Trình bày | `UI-*` cho bánh xe giao lưu, Bảng Nghị Sự, Lầu Danh Bộ; `SFX-*` mõ, khánh, chuông; `BGM-*` lễ | Phần 06 §6.23; Phần 14 |
| 13 Kỹ thuật | `TASK-*` cho: `guild-data.js`, `festivals.js`, `lich-viet.js`, `phrases.js`, `emotes.js`, `zones.js`, `SectHall`, `EventHub`, D1; `SCHEMA-*` cho lược đồ Phần 12 | Phần 11–12, 16 |
| 14 Rủi ro | `RISK-*` cho: dữ liệu tín ngưỡng (Nghị định 13/2023), thời gian chơi của trẻ, lì xì có yếu tố ngẫu nhiên, nội dung Tạng truyền, lễ quốc gia | Phần 05; Phần 09–10 |

### 19.10.2 Tài liệu khác cần từ tài liệu 10

| Tài liệu | Nhận gì |
|---|---|
| 03 Cốt truyện | lịch lễ tiết (đặt nhiệm vụ chính theo lễ); `EV-TMB` mở đầu mỗi mùa; Định Mệnh Hội xuất hiện ở chợ lễ (Hội Mao Sơn, Yên Tử) |
| 05 Cải mệnh | nguồn việc thiện xã hội (Sửa cầu đường +2, Giúp người +2 qua lắng nghe / giải oan, Phóng sinh đúng cách +3, Bố thí +2); công đức thầy (Phần 04 §4.1.6) |
| 06 NPC | lời thoại chưởng giáo (Phần 02–03, 17); quy tắc không nói xấu tông khác (Phần 01 §1.13.5) |
| 07 Thánh địa | danh sách công trình xã hội phải có ở mỗi thánh địa (§19.10.1 hàng 07) |
| 09 Tu luyện | hệ số đồng tu (Phần 04 §4.2.3), trần Đạo Hạnh từ lễ 40 / tuần (Phần 01 §1.11.4) |
| 11 Kinh tế | các vật phẩm lễ **không bán**; nguyên tắc «không gì mua bằng tiền thật chuyển được cho người khác» (Phần 05 §5.1) |
| 12 Trình bày | 276 cụm từ, 46 cử chỉ, chuỗi giao diện (Phần 06, 14) |
| 13 Kỹ thuật | giao thức (Phần 11), hạ tầng (Phần 12), lỗi `WORLD_TILES` (Phần 12 §12.4.4), gom `mvb` (§12.8.2), jitter kết nối lại (Phần 13 T-L-05) |
| 14 Rủi ro | bảng lạm dụng (Phần 01 §1.14, Phần 12 §12.9), an toàn trẻ em (Phần 05 §5.6), danh mục lễ ⚠ cần tham vấn (Phần 13 §13.7) |

---

## 19.11 Những phát hiện trên code thật khi viết tài liệu này

| # | Phát hiện | Ở đâu | Đề xuất | Phần |
|---|---|---|---|---|
| 1 | Thái Tuế Điện (`ROOMS.thaitue`, `origin.x = 2000`) nằm ngoài `WORLD_TILES.maxX = 1210` ô → gói `mv` trong điện bị `parseClient` bỏ; người khác không thấy ai đi trong điện | `protocol.js`, `world.js` | nâng `maxX` hoặc tính từ `ROOMS`; test mọi điểm trong mọi điện | 12 §12.4.4 |
| 2 | `TownShard` phát lại từng gói `mv` cho cả phòng ngay khi nhận (≈ 28.000 lần gửi/giây ở phòng đầy 60) — kế hoạch P1 ghi «tick 8 Hz gom gói» nhưng chưa gom | `worker/quan-room.js` | gói `mvb` 125 ms | 12 §12.8.2 |
| 3 | Gói P3 (`solve`, `lb`, `inv`, `coop_*`) đã khai báo trong `parseClient` nhưng `TownShard` chưa xử lý | `protocol.js` ↔ `quan-room.js` | cài đặt ở S2 | 11 §11.4.3; 13 §13.8 |
| 4 | `hello.title` nhận chuỗi tự do ≤ 24 ký tự (lỗ UGC nếu client bị sửa) | `protocol.js › parseClient` | đổi sang mã danh xưng `ti` | 05 §5.4.1; 11 §11.2.1 |
| 5 | Màu áo phát cho mọi người = hành Dụng thần (`robe = y.primary`), đai = Hỷ thần | `main.js`, `net.js` | giữ (bản sơ đồ §14 đã chấp nhận) + thêm «Ẩn màu bản mệnh» và giải thích | 05 §5.2.1–5.2.2 |
| 6 | `computeHehun` đọc thẳng năm sinh (`input.year`) để tính mệnh quái → so hợp hôn giữa hai người chơi buộc phải có adapter nhận mệnh quái đã tính | `src/engine/hehun.js` | tham số `opts.zhai` + `hehunFromCards` | 04 §4.4.4 |
| 7 | `pid` chỉ là UUID trong `localStorage`; danh tính bền (HMAC) của kế hoạch P1 chưa làm | `net.js` | `/api/quan/id` + `tok` | 11 §11.1; 12 §12.2 |
| 8 | Kết nối lại lùi dần không có jitter (`1500 × 2^(retry−1)`) → bầy kết nối lại đồng loạt khi máy chủ khởi động lại | `net.js › scheduleRetry` | thêm ±30% ngẫu nhiên | 13 T-L-05 |
| 9 | Báo cáo lưu rải trong storage từng phòng (trần 500 / phòng), không có hàng chờ chung | `quan-room.js` | chuyển D1 + bằng chứng | 05 §5.3 |
| 10 | `lunar-javascript` tính âm lịch theo UTC+8; lịch Việt (UTC+7) có năm lệch ngày đầu tháng (vd Tết 2007) | dùng trong `stations.js`, `thaitue.js`, `month-calendar.js` | `lich-viet.js` hoặc bảng ngoại lệ | 09 §9.0.3 |
