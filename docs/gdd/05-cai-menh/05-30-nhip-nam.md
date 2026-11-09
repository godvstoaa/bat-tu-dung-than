# 05-30 · Nhịp năm của hệ cải mệnh

> Mọi thứ trong hệ 05 có nhịp: ngày (nhật hạn), tuần (Tâm Đề, thư), tháng âm (Thiên Bảng), năm can chi (Mệnh Đồ, Thái Tuế, Huyền Không). Phần này gom **lịch hệ thống**: cái gì đặt lại khi nào, cái gì không bao giờ đặt lại, và lễ tiết (canon §10; tài liệu 10 cấp mã `EV-*`) chạm vào cơ chế nào của hệ 05.
> Giờ: mọi mốc ngày / tuần / tháng tính theo **giờ máy chủ của khu vực** (05-14 X-23). Lịch âm theo thư viện lịch app đã dùng (`lunar-javascript`).

---

## 1. Bảng đặt lại

| Nhịp | Mốc | Đặt lại | Không đặt lại |
|---|---|---|---|
| **Ngày** | 0h máy chủ | nhật hạn Đạo Hạnh (dồn phần dư vào Tĩnh Khí, tối đa 3 ngày), nhật hạn công 15, trần nhóm DEED, phiên có thưởng của hoạt động lõi, lượt Ngũ Bộ (6), lượt Âm Ấn (30), Phù Chính Nghiệp, lượt «Đưa tay» nhận (3) | mọi tổng (Đạo Hạnh, công, nghiệp, Nợ Âm) |
| **Tuần** | thứ Hai 0h | Tâm Đề mới; cảnh «thử giới» tối đa 1 / đạo; | chuỗi ngày giữ giới (đếm theo ngày, không theo tuần) |
| **Tuần** | Chủ nhật tối | thư tuần Vân Cốc (verdict 7 ngày); sự kiện sửa cầu đá (DEED-191) | |
| **Tháng âm** | mùng 1 | Thiên Bảng chốt tháng (khung tên tháng cho người đứng đầu bảng chính), sổ môn phái chốt tháng, thập trai đếm lại | Thiên Bảng không xóa Đạo Hạnh |
| **Tháng âm** | mùng 1 / Rằm | DEED-101 (hương gia tiên), DEED-127 (chay), DEED-009 (phóng sinh tập thể), chay đạo tràng Chính Nhất | |
| **Năm can chi** | **Lập Xuân** (theo tiết khí, giờ khắc thật) | Mệnh Đồ năm mới (Không Gian · Thời · Thái Tuế); Đèn Niên mới; Vận Khí Bàn đọc lưu niên mới (trần vận, Nghịch Duyên); Thái Tuế phù năm cũ «hóa»; sự kiện Đỗ Xuân (CQ-MD-49); mùa Thiên Bảng; Sổ Thiên Mệnh máy chủ chốt | cảnh giới, Đại Nguyện, hạng đạo, danh hiệu, Nợ Âm, nghiệp |
| **Không bao giờ** | — | — | Đạo Hạnh, công hữu hiệu, cảnh giới, Đại Nguyện, Hồi Đầu, hạng đạo (trừ đóng băng do hoàn đạo) |

**Vì sao Mệnh Đồ đổi ở Lập Xuân chứ không ở Tết Nguyên Đán:** năm can chi trong Tử Bình tính từ Lập Xuân (app tính trụ năm như vậy); `xuankongPan(year)` và Thái Tuế đổi theo năm can chi. Tết Nguyên Đán vẫn có lễ (canon §10) nhưng **không** đổi cơ chế.

---

## 2. Trình tự Lập Xuân (máy chủ)

| Bước | Thời điểm | Việc |
|---|---|---|
| 1 | Lập Xuân − 7 ngày | thư «thay đèn năm mới» (Đèn Niên); CQ-MD-35 «Năm sau» mở (xem trước rating năm sau) |
| 2 | Lập Xuân − 1 giờ | Đỗ Xuân bắt đầu (người chơi trong nhà / điện ≥ 30 phút quanh giờ khắc) |
| 3 | giờ khắc Lập Xuân | máy chủ đổi năm can chi; chốt Sổ Thiên Mệnh mùa cũ; chốt Thiên Bảng mùa |
| 4 | + 1 phút | mỗi máy khách khi đăng nhập kế: tính lại `gaimenhPlan(R, nămMới)` (05-19 §6), lưu Mệnh Đồ năm cũ vào `archive`, sinh nhiệm vụ năm |
| 5 | + 1 phút | Vận Khí Bàn đọc `liunian[isNow]` mới → trần vận, Nghịch Duyên |
| 6 | trong ngày | sự kiện «an Thái Tuế toàn máy chủ» (canon §10); tượng niên chủ mới ở Thái Tuế Điện |
| 7 | trong tuần | Vân Cốc vẽ lại phần trên của cuộn (cảnh ngắn, một lần mỗi năm) |

**Người chơi offline qua Lập Xuân:** bước 4–5 chạy ở lần đăng nhập kế; Đỗ Xuân bỏ lỡ không có hình phạt (pháp ④ chỉ là một trong sáu).

---

## 3. Lễ tiết chạm cơ chế nào

| Lễ (âm lịch) | Hệ 05 trong lễ | Cơ chế thay đổi trong ngày lễ | Đạo liên quan |
|---|---|---|---|
| Lập Xuân / Tết | an Thái Tuế, Mệnh Đồ năm mới, Đỗ Xuân | §2 | mọi đạo |
| Rằm tháng Giêng · Thượng Nguyên | dâng đèn, tụng Tam Quan Kinh (DEED-182), chủ đàn (CQ-CN-15) | khoa nghi Linh Bảo: `B` ×1,5 (một khoa) | CN, TC |
| 15/2 · vía Lão Quân | tụng Thanh Tĩnh Kinh tập thể | DEED-171 có thêm bản tập thể (vẫn 1 lần / ngày) | các đạo Đạo giáo |
| 3/3 · vía Huyền Thiên Thượng Đế | lễ Kim Đỉnh | tĩnh tọa Võ Đang: phiên thứ 4 trong ngày có thưởng | TV |
| 16/3 · vía Chuẩn Đề (chờ cố vấn) | trì 1.000 biến tập thể | Y-08 tập thể; tính 1 ngày «Thiên Biến» | MT |
| Phật đản (8/4 hoặc Rằm tháng Tư) | tắm Phật (CQ-TD-13), tuần chay (DEED-130) | — | TH, TD, MT |
| 15/7 · Trung Nguyên · Vu Lan | Phong Đô mở lối cứu người; thả đèn; CQ-BD-10, CQ-TD-15; DEED-115 | án «việc lạ» +30% số lượng (05-13 §5.1, phân bố giữ); Lễ Soi Sổ tập thể (30/7) | BD, TD, TT |
| 27/8 · giỗ Khổng Tử / Tết thầy | khoa thi đặc biệt | thi Hội ngoài lịch | NH |
| 9/9 · Trùng Cửu · Đẩu Mẫu | bái Đẩu lớn (`B = 30`) | | CN |
| 15/10 · Hạ Nguyên | lễ ở Cùng Thông Hồ | khoa nghi cứu tế | CN, BD |
| 1/11 · giỗ Tổ Trúc Lâm (chờ cố vấn) | đêm Chùa Đồng (CQ-TH-15) | hành hương đêm mở | TH |
| tháng Chạp | phát cháo (DEED-085) | — | mọi |

**Luật chung lễ tiết:** lễ **không** nhân Đạo Hạnh chung, không nới nhật hạn (tránh «cày ngày lễ»); lễ chỉ mở nội dung riêng và đôi khi thêm một phiên có thưởng cho đúng đạo của lễ.

---

## 4. Mùa (năm can chi) và hệ 05

| Hạng mục | Theo mùa | Ghi chú |
|---|---|---|
| Thiên Bảng | bảng mùa (xếp theo Đạo Hạnh **tăng thêm trong mùa**) bên cạnh bảng tổng | người mới có cơ hội đứng đầu bảng mùa |
| Sổ Thiên Mệnh | tổng công hữu hiệu cả máy chủ trong mùa → cảnh Thiên Mệnh Bàn cuối mùa | 05-03 §7.2 |
| Đạo Lộ mùa (tài liệu 11) | bộ phục niên chủ — **thẩm mỹ**, không có Vận Phù riêng ngoài luật bộ ngũ hành hiện có | L-2 |
| Mệnh Đồ | phần năm làm mới | 05-02 §5.2 |
| Nội dung mới | mỗi mùa có thể thêm DEED (theo mã dự trữ), án Định Mệnh Hội mới, chuỗi `CQ` mới cho đạo đã viên mãn | dùng khoảng mã chưa dùng |

---

## 5. Lịch một tuần mẫu (người chơi đều đặn, MAU-A, tuần thứ 6)

| Ngày | 45 phút gồm |
|---|---|
| Thứ Hai | đọc Tâm Đề mới (Canh · Ôn); thiền Yên Tử 10 phút; DEED gánh nước am; một bước CQ-MD-62Q |
| Thứ Ba | trực đàn Long Hổ; kết phù 3 đơn; DEED-081 hòm công đức |
| Thứ Tư | thắp đèn Phong Đô; chuyển kinh tổ đội; một ngày chay (DEED-126) |
| Thứ Năm | án «việc lạ» ở Sơn Môn (CQ-TR-04); Ngũ Bộ 2 lần trong hội thoại chợ |
| Thứ Sáu | thiền + công án; DEED dạy chữ trẻ trại |
| Thứ Bảy | sự kiện Lễ Hồng Danh (nếu có sự vụ nghiệp) hoặc hành hương Yên Tử chặng 3 |
| Chủ nhật | sửa cầu đá (sự kiện máy chủ); đọc thư tuần Vân Cốc |

Tuần này: ≈ 35 công hữu hiệu, ≈ 500 Đạo Hạnh — khớp mô phỏng 05-14 §2.4 (73 ĐH / ngày).
