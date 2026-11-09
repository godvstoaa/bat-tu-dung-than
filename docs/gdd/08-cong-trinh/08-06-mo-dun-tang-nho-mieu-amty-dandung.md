# 08-06 · Bộ mô-đun nội thất (2): Tạng truyền · Nho môn · Miêu Cương · Âm ty · Dân dụng Huyền Thành

> Tiếp 08-05 (quy ước cột, khe vật liệu, mã khớp, mã va chạm ở 08-05 §1). Bốn bộ phong cách còn lại và bộ **MOD-DAN** dân dụng cho 36 nhà vườn, tiệm, quán của Huyền Thành.

**Lưu ý nội dung nhạy cảm** (trụ cột T6, tài liệu tổng §14): bộ **TAN** chỉ được dựng sau khi tham vấn người trong truyền thống (Tạng truyền **chờ tham vấn** theo kinh điển chung); tượng, thangka dùng **hình hư cấu / hoa văn**, không sao chép tượng thờ có thật. Bộ **MIE** là nội dung hư cấu: đồ vật gợi văn hóa vật chất (dệt, bạc, trống đồng) — **không** mô tả cách làm cổ thuật. Bộ **AMT** không có hình tra tấn, máu me; Âm ty là nơi đối diện sổ nghiệp và sám hối.

---

## 1. MOD-TAN — Tạng truyền (chờ tham vấn)

**Nguyên mẫu:** tu viện Tây Tạng (Potala, Jokhang, Samye): tường hình thang dày quét vôi trắng / đỏ, cửa sổ khung đen hình thang, rèm vải sọc trên khung cửa, cột vuông bọc vải, trần treo phướn lụa ống, tranh thangka, hàng đèn bơ, ghế lạt-ma cao, bánh xe kinh.

**Dùng ở:** dự kiến Tạng Địa Tuyết Vực (mốc M5, sau tham vấn).

### 1.1 Bảng màu (bảng khóa Tạng Địa)

trắng vôi `#F1EEE6` · đỏ Hồng cung `#7B1E1E` · vàng kim đỉnh `#D8A928` · đen khung `#1E1A18` · lam hồ `#3FA7C9`.

### 1.2 Bảng mảnh

| Mã | Tên | Kích thước | Vật liệu · màu | Tam giác | Va chạm | Khớp | Móc | Dùng ở |
|---|---|---|---|---|---|---|---|---|
| MOD-TAN-01 | Sàn «a-ga» đất nện đánh bóng | 3,2 × 0,1 × 3,2 | `stone` nâu bóng | 12 | N | S-SAN | `floor:dat` | điện, sân thượng |
| MOD-TAN-02 | Sàn ván tu viện | 3,2 × 0,12 × 3,2 | `wood` | 12 | N | S-SAN | `floor:go` | tăng xá |
| MOD-TAN-03 | Tường lót vôi trắng nghiêng 3° | 3,2 × C biến × 0,6 → 0,45 | `stone` trắng | 24 | Đ | S-TUONG | — | Bạch cung |
| MOD-TAN-04 | Tường lót đỏ sẫm | 3,2 × C biến × 0,5 | `stone` đỏ | 24 | Đ | S-TUONG | — | Hồng cung |
| MOD-TAN-05 | Cửa sổ khung đen hình thang + rèm sọc | 1,2 × 1,6 × 0,5 | `wood` đen + `fabric` sọc | 160 | — (`window`) | S-CUA | — | mọi khoang |
| MOD-TAN-06 | Khung cửa hình thang có diềm | 2,4 × 3,0 × (tường + 0,2) | `wood` đen + `trim` | 260 | C | S-CUA | — | che vết cắt |
| MOD-TAN-07 | Cửa gỗ đỏ vòng đồng hai cánh | 1,8 × 2,6 × 0,1 | `wood` đỏ + `metal` | 120 | — | S-CUA | `door:canh2` | |
| MOD-TAN-08 | Rèm cửa chính vải sọc dày | 2,0 × 2,8 | `fabric` | 80 | — | S-CUA | `door:rem` | lối vào điện |
| MOD-TAN-09 | Cột vuông bọc vải | 0,4 × C biến × 0,4 | `fabric` hoa văn | 40 | T 0,35 | S-COT | `fadeable` | |
| MOD-TAN-10 | Đầu cột nhiều tầng chạm (đầu cung) | 1,6 × 0,8 × 0,5 | `wood` vẽ màu | 400 | — | đỉnh cột | — | |
| MOD-TAN-11 | Xà vẽ hoa văn liên hoa | 3,2 × 0,4 × 0,3 | `trim` | 24 | X | S-TRAN | — | |
| MOD-TAN-12 | Trần ván màu dầm lộ | 3,2 × 0,3 × 3,2 | `wood` + `trim` | 60 | X | S-TRAN | — | |
| MOD-TAN-13 | Phướn lụa ống treo trần | Ø 0,6 × 2,4 | `fabric` 5 màu | 96 | — | S-TREO | `sway` | điện tụng |
| MOD-TAN-14 | Thangka treo (hoa văn mạn-đà-la hư cấu) | 0,8 × 1,4 | `fabric` lụa + canvas | 8 | — | S-VACH | `label` | |
| MOD-TAN-15 | Thangka lớn cuộn (ngày lễ) | 3,2 × 6,0 | `fabric` | 16 | — | S-VACH (vách lớn) | `event` | lễ hội (tài liệu 10) |
| MOD-TAN-16 | Kệ đèn bơ ba tầng (60 chén) | 2,4 × 1,4 × 0,6 | `metal` + `emissive` | 900 | H | S-PHU | `light:denbo` + `lamp` | thắp đèn bơ (thắp từng chén) |
| MOD-TAN-17 | Chén đèn bơ đơn | Ø 0,12 | `metal` + `emissive` | 60 | — | S-BAN | `lamp` | |
| MOD-TAN-18 | Bàn mạn-đà-la cát | 2,4 × 0,6 × 2,4 (mặt gỗ phẳng có khung) | `wood` | 200 | H | S-SAN → S-BAN | `mandala` | hoạt động «vẽ rồi xóa» (tài liệu tổng §7.7; MG do tài liệu 09) |
| MOD-TAN-19 | Bộ ống rót cát và bát cát màu | 0,6 × 0,1 × 0,4 | `metal` + 5 màu | 300 | — | S-BAN | `mandala` | |
| MOD-TAN-20 | Pháp tòa (ghế lạt-ma cao) | 1,4 × 1,6 × 1,4 | `wood` + `fabric` gấm | 700 | H | S-SAN | `seat:lama` | ghế NPC `lama_dakiet` |
| MOD-TAN-21 | Hàng đệm thấp tăng chúng | 3,2 × 0,3 × 0,8 | `fabric` | 48 | — | S-PHU | `seat` | |
| MOD-TAN-22 | Bàn nhỏ chạm sơn trước đệm | 0,8 × 0,5 × 0,5 | `wood` vẽ | 200 | H | S-PHU → S-BAN | `tea` | |
| MOD-TAN-23 | Bánh xe kinh lớn trong nhà | Ø 1,6 × 2,4 | `metal` + `trim` | 1.200 | T 0,85 | S-SAN | `spin:cw` (chỉ quay chiều kim đồng hồ) | |
| MOD-TAN-24 | Dãy bánh xe kinh hành lang | 3,2 × 1,2 × 0,6 (8 bánh) | `metal` | 1.600 | Đ | S-TUONG | `spin:cw` | hành lang quanh điện (đi bộ chiều kim đồng hồ) |
| MOD-TAN-25 | Chày kim cương và chuông trên bàn | 0,3 × 0,2 × 0,2 | `metal` | 300 | — | S-BAN | `view` | |
| MOD-TAN-26 | Kèn dài trên giá | 3,2 × 0,8 × 0,4 | `metal` | 300 | H | S-PHU | `sound:ken` | |
| MOD-TAN-27 | Trống lớn treo khung | Ø 1,0 × 1,8 | `wood` + da | 600 | H | S-PHU | `drum` | |
| MOD-TAN-28 | Chũm chọe | Ø 0,3 | `metal` | 100 | — | S-BAN | `sound` | |
| MOD-TAN-29 | Bàn thờ nhiều tầng khám kính | 4,8 × 3,2 × 1,2 | `wood` vẽ + kính | 1.200 | H | S-TUONG → S-KHAM | `shrine` | tượng hư cấu, duyệt |
| MOD-TAN-30 | Tủ kinh ô vuông | 3,2 × 2,8 × 0,6 | `wood` | 600 | H | S-TUONG | `book` | |
| MOD-TAN-31 | Bó kinh lá rời bọc vải | 0,6 × 0,15 × 0,2 | `fabric` | 60 | — | trong TAN-30 / S-BAN | `book` → `remedy-fate › ZHUNTI` | |
| MOD-TAN-32 | Hàng bảy bát nước cúng | 0,9 × 0,1 × 0,15 | `metal` | 200 | — | S-BAN | `offer` | |
| MOD-TAN-33 | Bánh cúng (torma) | 0,25 × 0,4 | sơn màu | 200 | — | S-BAN | `offer` | |
| MOD-TAN-34 | Khăn khata treo | 0,3 × 1,2 | `fabric` trắng | 16 | — | S-TREO / tượng | — | |
| MOD-TAN-35 | Thảm Tạng hoa văn | 1,6 × 0,02 × 3,2 | `fabric` | 2 | — | S-SAN | `floor:tham` | |
| MOD-TAN-36 | Bếp đất tăng xá | 1,0 × 0,8 × 0,8 | `stone` + `emissive` | 200 | H | S-PHU | `light:bep` + `khoi` | |
| MOD-TAN-37 | Ống khuấy trà bơ | 0,2 × 0,9 | `wood` + đai `metal` | 120 | — | S-PHU | `tea` | |
| MOD-TAN-38 | Bàn gỗ sơn vẽ | 1,2 × 0,6 × 0,6 | `wood` | 200 | H | S-PHU | — | |
| MOD-TAN-39 | Giường gỗ thấp | 1,0 × 0,4 × 2,0 | `wood` + `fabric` | 120 | H | S-PHU | `seat` | |
| MOD-TAN-40 | Dây cờ gió năm màu | 6,4 dài | `fabric` 5 màu | 160 | — | ngoài (cột – cột) | `sway` | đèo, sân thượng |
| MOD-TAN-41 | Mani thạch (đá khắc chú — ký tự hư cấu) | 0,4 × 0,2 × 0,3 | `stone` | 60 | — | đống đá | `place:mani` | đặt đá trên đèo |
| MOD-TAN-42 | Bảo tháp nhỏ trong điện | 1,0 × 2,4 × 1,0 | `stone` trắng + `metal` | 900 | T 0,5 | S-PHU | `shrine` | |
| MOD-TAN-43 | Đèn treo đồng lục giác | 0,5 × 0,8 | `metal` + `emissive` | 200 | — | S-TREO | `light:denbo` | |
| MOD-TAN-44 | Cờ chiến thắng mạ vàng (trên mái) | 0,8 × 2,0 | `metal` | 300 | — | mái bằng | — | |
| MOD-TAN-45 | Pháp luân và đôi nai | 2,4 × 1,6 × 0,5 | `metal` vàng | 1.400 | — | trên cửa / mái | — | |
| MOD-TAN-46 | Thang gỗ khối dốc có tay vịn | 1,2 × 3,2 × 3,2 (0,25 / 0,25) | `wood` | 200 | B | S-THANG | — | lên sân thượng |
| MOD-TAN-47 | Lan can mái bằng | 3,2 × 1,0 × 0,4 | `stone` trắng | 24 | Đ | mép sân thượng | — | |
| MOD-TAN-48 | Mành vải đen viền che hiên | 3,2 × 0,6 | `fabric` | 32 | — | trên cửa sổ ngoài | `sway` | |

### 1.3 Công thức lắp chuẩn

**TAN-R1 · Điện tụng (4 × 3 gian):** TAN-09 cột bọc vải lưới 3,2 + TAN-13 phướn ống treo giữa các cột + hai dãy TAN-21 đệm chạy dọc + TAN-20 pháp tòa đầu điện + TAN-29 bàn thờ sau pháp tòa + TAN-16 kệ đèn bơ hai bên + TAN-14 thangka mọi tường + TAN-27 trống ở góc. Ánh sáng: đèn bơ là nguồn chính (bảng 08-04 §1.2).

**TAN-R2 · Hành lang bánh xe kinh (vòng quanh điện):** TAN-24 dãy bánh xe dọc tường ngoài, lối đi 1,6 m có mái; hướng đi bắt buộc chiều kim đồng hồ — mũi tên chỉ dẫn trên sàn; đi ngược không bị chặn nhưng bánh xe không quay và NPC nhắc nhẹ.

---

## 2. MOD-NHO — Nho môn

**Nguyên mẫu:** Văn Miếu – Quốc Tử Giám Hà Nội (gạch Bát Tràng, cột sơn son, mái chồng diêm cung đình Lê – Nguyễn), giảng đường Thái Học, Khuê Văn Các, nhà bia; trường lớp nho học (án thư, chiếu, kệ sách tre).

**Dùng ở (đang có):** Thư Lâu Cửu Tầng và hai Tàng Thư Các (INT-TL-*, đồ đạc thư viện đặt trong vỏ BAC), Văn Xương Các (tầng trệt Thư Lâu), Án Lục Lâu (INT-HS-THAPTAY), sảnh Thư Viện (INT-SN-THUVIEN). **Dự kiến:** Văn Miếu Quốc Tử Giám.

Luật pha bộ: **kết cấu** theo bộ của vùng (BAC ở Thư Lâu), **đồ đạc chức năng** theo bộ đúng công năng (NHO cho thư viện). Không pha **kết cấu** của hai bộ trong một khoang.

### 2.1 Bảng màu (bảng khóa Văn Miếu)

đỏ gạch `#8A3B2A` · son `#9C2A1E` · xám bia `#7F7B72` · lục cổ thụ `#3E5C38` · vàng hoàng `#C6A044`.

### 2.2 Bảng mảnh

| Mã | Tên | Kích thước | Vật liệu · màu | Tam giác | Va chạm | Khớp | Móc | Dùng ở |
|---|---|---|---|---|---|---|---|---|
| MOD-NHO-01 | Sàn gạch Bát Tràng | 3,2 × 0,08 × 3,2 | `stone` đỏ | 12 | N | S-SAN | `floor:da` | Văn Miếu |
| MOD-NHO-02 | Sàn gỗ giảng đường | 3,2 × 0,12 × 3,2 | `wood` | 12 | N | S-SAN | `floor:go` | Thư Lâu các tầng |
| MOD-NHO-03 | Tường lót gạch đỏ nâu | 3,2 × C biến × 0,25 | `stone` | 24 | Đ | S-TUONG | — | |
| MOD-NHO-04 | Tường lót ván gỗ | 3,2 × C biến × 0,1 | `wood` | 24 | Đ | S-TUONG | — | |
| MOD-NHO-05 | Cột son cung đình Ø 0,45 | 0,45 × C biến | `wood` son | 112 | T 0,4 | S-COT | `fadeable` | |
| MOD-NHO-06 | Chân tảng vuông | 0,8 × 0,3 × 0,8 | `stone` | 24 | (gộp) | S-COT | — | |
| MOD-NHO-07 | Vì kèo cung đình | 6,4 × 3,0 × 0,4 | `wood` son + thếp | 1.400 | X | S-TRAN | — | |
| MOD-NHO-08 | Trần ván | 3,2 × 0,08 × 3,2 | `wood` | 12 | X | S-TRAN | — | |
| MOD-NHO-09 | Khung bức bàn gỗ | 3,2 × 3,0 × 0,2 | `wood` son | 140 | C | S-CUA | `door:bucban` | |
| MOD-NHO-10 | Tấm bức bàn | 0,8 × 3,0 × 0,05 | `wood` | 24 | — | trong NHO-09 | `door:leaf` | |
| MOD-NHO-11 | Cửa sổ tròn Khuê Văn (nan tỏa) | Ø 1,6 × 0,2 | `wood` alpha | 160 | — (`window`) | S-CUA | — | Khuê Văn Các, tầng trên Thư Lâu |
| MOD-NHO-12 | Khung cửa chính sơn son | 3,4 × 3,8 × (tường + 0,2) | `wood` + `trim` | 240 | C | S-CUA | — | |
| MOD-NHO-13 | Án thư thấp (ngồi chiếu) | 1,2 × 0,35 × 0,6 | `wood` | 120 | H | S-PHU → S-BAN | `read` + `seat` | lớp học, Văn Xương Các |
| MOD-NHO-14 | Án thư cao (thầy giảng) | 1,8 × 0,85 × 0,8 | `wood` sơn | 300 | H | S-PHU → S-BAN | `read` | |
| MOD-NHO-15 | Ghế thầy | 0,8 × 1,1 × 0,7 | `wood` | 300 | H | S-PHU | `seat` | |
| MOD-NHO-16 | Chiếu ngồi học | 1,6 × 0,02 × 0,8 | `fabric` cói | 2 | — | S-PHU | `seat` | |
| MOD-NHO-17 | Kệ sách tre | 1,6 × 2,0 × 0,5 | `wood` tre + gáy sách `trim` | 360 | H | S-TUONG | `book` → `library-data › LIBRARY` | Thư Lâu, Tàng Thư Các |
| MOD-NHO-18 | Giá thư trục (cuộn) | 1,2 × 1,6 × 0,4 | `wood` + cuộn | 400 | H | S-TUONG | `book` | |
| MOD-NHO-19 | Tủ sách cửa lưới | 1,6 × 2,2 × 0,6 | `wood` | 300 | H | S-TUONG | `book` | |
| MOD-NHO-20 | Văn phòng tứ bảo | 0,6 × 0,1 × 0,4 | `wood` + `stone` nghiên | 300 | — | S-BAN | `write` (chép sách — việc ngày `DQ-*`) | |
| MOD-NHO-21 | Bảng vàng | 3,2 × 2,4 × 0,15 | `wood` + giấy vàng (canvas danh sách) | 24 | Đ | S-VACH / chân đứng | `board` | khoa cử (tài liệu tổng §7.8) |
| MOD-NHO-22 | Bia Tiến sĩ trên rùa | 1,0 × 2,0 × 1,8 | `stone` + canvas tên | 900 | H | S-PHU | `stele:server` (khắc tên người chơi đỗ — tài liệu 10) | nhà bia |
| MOD-NHO-23 | Khung nhà bia mái nhỏ | 3,2 × 3,4 × 3,2 | `wood` + ngói | 600 | T × 4 | S-SAN | — | |
| MOD-NHO-24 | Bàn thờ tiên sư (bài vị hư cấu) | 3,2 × 1,4 × 1,2 | `wood` son thếp | 500 | H | S-SAN → S-KHAM | `shrine` | |
| MOD-NHO-25 | Khám dài bài vị tiên hiền | 3,2 × 2,0 × 0,8 | `wood` | 400 | H | S-TUONG → S-KHAM | `shrine` | |
| MOD-NHO-26 | Hương án Văn Miếu | 2,4 × 1,0 × 0,9 | `wood` son | 300 | H | S-PHU → S-BAN | `incense` | |
| MOD-NHO-27 | Bộ biên khánh (16 khánh treo khung) | 2,8 × 2,2 × 0,6 | `stone` + `wood` | 1.200 | H | S-PHU | `music` → `music-therapy › musicTherapy` | nhã nhạc |
| MOD-NHO-28 | Bộ biên chung (chuông nhỏ treo khung) | 2,8 × 2,4 × 0,6 | `metal` + `wood` | 1.400 | H | S-PHU | `music` | |
| MOD-NHO-29 | Trống nhã nhạc | Ø 0,9 × 1,4 | `wood` son + da | 500 | H | S-PHU | `drum` | |
| MOD-NHO-30 | Đèn lồng giấy chữ | Ø 0,5 × 0,7 | `fabric` + `emissive` | 120 | — | S-TREO | `light:denlong` | |
| MOD-NHO-31 | Đèn dầu bàn học | 0,15 × 0,35 | `metal` + `emissive` | 100 | — | S-BAN | `light:dendau` | |
| MOD-NHO-32 | Tráp đựng quyển thi | 0,5 × 0,25 × 0,35 | `wood` sơn | 120 | — | S-BAN | `exam` | |
| MOD-NHO-33 | Lều chõng thi | 2,0 × 2,0 × 2,0 | `fabric` + tre | 400 | H | S-SAN | `exam` + `seat` | trường thi hương (khoa cử) |
| MOD-NHO-34 | Bảng gỗ yết thị | 1,6 × 1,2 × 0,1 (chân 2,0) | `wood` + canvas | 40 | H | S-PHU | `board` (nhiệm vụ) | |
| MOD-NHO-35 | Hoành phi chữ Hán | 3,2 × 1,0 × 0,1 | `wood` son + canvas | 12 | — | S-VACH | `label` | |
| MOD-NHO-36 | Câu đối | 0,4 × 3,0 × 0,05 | `wood` | 12 | — | S-VACH / cột | `label` | |
| MOD-NHO-37 | Bình phong chữ Thọ | 2,4 × 2,2 × 0,2 | `wood` | 300 | Đ | S-PHU | — | |
| MOD-NHO-38 | Giá áo mũ (áo the, khăn xếp) | 0,8 × 1,8 × 0,4 | `wood` + `fabric` | 300 | T 0,3 | S-PHU | `view` (nối Tàng Y Các) | |
| MOD-NHO-39 | Ống thẻ tre | 0,15 × 0,4 | tre | 100 | — | S-BAN | `exam` (rút đề) | |
| MOD-NHO-40 | Chặn giấy (trấn chỉ) và thước | 0,4 × 0,05 × 0,05 | `stone` | 24 | — | S-BAN | — | |
| MOD-NHO-41 | Trụ biểu cổng | 0,8 × 6,0 × 0,8 | `stone` + `trim` | 400 | T 0,45 | S-COT (ngoài) | — | |
| MOD-NHO-42 | Lan can giếng vuông Thiên Quang | 3,2 × 0,8 × 0,2 | `stone` | 60 | Đ | mép giếng | `view` | |
| MOD-NHO-43 | Rùa đá (không bia) | 1,0 × 0,6 × 1,6 | `stone` | 600 | H | S-PHU | `view` | |
| MOD-NHO-44 | Bậc đá Văn Miếu | 3,2 × 0,2 × 0,4 | `stone` | 12 | B | S-THANG | — | |
| MOD-NHO-45 | Kệ sách xoay tám mặt («chuyển luân tàng») | Ø 2,4 × 3,2 | `wood` son | 1.800 | T 1,3 | S-SAN | `spin` + `book` | Thư Lâu tầng trệt |
| MOD-NHO-46 | Bàn đọc đứng («tầng thư hôm nay») | 1,0 × 1,2 × 0,6 | `wood` | 200 | H | S-PHU | `read` → `halls.js › buildThuVien` | Thư Lâu |
| MOD-NHO-47 | Đèn chân đồng thư lâu | 0,4 × 1,4 × 0,4 | `metal` + `emissive` | 200 | T 0,2 | S-PHU | `light:dendau` | |
| MOD-NHO-48 | Thang gỗ tầng thư (kiểu lầu) | 1,6 × 4,0 × 4,0 | `wood` son | 260 | B | S-THANG | — | Thư Lâu, Tàng Thư Các |
| MOD-NHO-49 | Khung phù điêu «tượng» sờ được | 1,6 × 2,0 × 0,2 | `stone` + mặt nổi (normal map vẽ từ dữ liệu `mangpai`) | 60 | — | S-VACH | `touch` (chạm → mô tả âm + chữ) | Tượng Pháp Đường (08-22 §4.1) |

### 2.3 Công thức lắp chuẩn

**NHO-R1 · Tầng thư (một tầng Thư Lâu):** NHO-02 sàn + NHO-17 kệ tre kín 4 vách (chừa cửa sổ) + NHO-46 bàn đọc đứng giữa + NHO-13 × 4 án thư thấp + NHO-16 chiếu + NHO-47 đèn mỗi góc + NHO-48 thang lên tầng trên ở góc Tây Bắc.

**NHO-R2 · Lớp học:** NHO-14 án thầy ở đầu + NHO-15 ghế + 2 hàng × 4 NHO-13 + NHO-16 + NHO-20 trên mỗi án + NHO-35 hoành phi sau lưng thầy.

---

## 3. MOD-MIE — Miêu Cương (nội dung hư cấu)

**Nguyên mẫu:** nhà sàn treo (điếu cước lâu) Tương Tây, trại Miêu Tây Giang: gỗ sam để mộc màu mật, ván thưng, kèo xuyên đấu, **hỏa đường** (bếp lửa giữa nhà), giàn hun trên bếp, khung dệt vải sáp ong, đồ bạc, trống đồng, khèn.

**Dùng ở:** dự kiến Miêu Cương Cổ Trại (mốc M4). Chưa có công trình.

### 3.1 Bảng màu (bảng khóa Miêu Cương)

nâu gỗ sam `#6B4A2E` · xám ngói `#4A4A4C` · lam sáp `#2B4E7A` · bạc `#D7DADF` · lục sông `#3D8A78`.

### 3.2 Bảng mảnh

| Mã | Tên | Kích thước | Vật liệu · màu | Tam giác | Va chạm | Khớp | Móc | Dùng ở |
|---|---|---|---|---|---|---|---|---|
| MOD-MIE-01 | Sàn ván sam (khe hở) | 3,2 × 0,08 × 3,2 | `wood` sam | 16 | N | S-SAN | `floor:go` | nhà sàn |
| MOD-MIE-02 | Sàn ván hiên ngoài | 3,2 × 0,08 × 1,6 | `wood` phong hóa | 12 | N | S-SAN | `floor:go` | |
| MOD-MIE-03 | Vách ván sam | 3,2 × C biến × 0,05 | `wood` | 24 | Đ | S-TUONG | — | |
| MOD-MIE-04 | Vách phên tre | 3,2 × C biến × 0,05 | `wood` tre alpha | 12 | Đ | S-TUONG | — | bếp, kho |
| MOD-MIE-05 | Cột sam chống Ø 0,3 | 0,3 × C biến (dài tới mặt nước) | `wood` | 64 | T 0,25 | S-COT | — | chân nhà treo |
| MOD-MIE-06 | Xà ngang sam | 3,2 × 0,25 × 0,15 | `wood` | 12 | X | S-TRAN | — | |
| MOD-MIE-07 | Kèo xuyên đấu | 6,4 × 3,0 × 0,2 | `wood` | 300 | X | S-TRAN | — | |
| MOD-MIE-08 | Mặt dưới mái ngói âm dương | 3,2 × 0,4 × 3,2 | `stone` ngói + rui | 80 | X | S-TRAN | — | |
| MOD-MIE-09 | Cửa ván then gỗ | 1,2 × 2,2 × 0,05 | `wood` | 24 | — | S-CUA | `door:canh1` | |
| MOD-MIE-10 | Khung cửa sam | 1,5 × 2,5 × (vách + 0,1) | `wood` | 60 | C | S-CUA | — | |
| MOD-MIE-11 | Cửa sổ song chống | 1,2 × 0,9 × 0,08 | `wood` | 40 | — (`window`) | S-CUA | `window:open` | |
| MOD-MIE-12 | Hỏa đường (bếp lửa giữa nhà, khung đá) | 1,6 × 0,3 × 1,6 | `stone` + `emissive` | 300 | H | S-SAN (giữa) | `light:bep` + `fire` + `khoi` | nơi kể chuyện, NPC `vu_y_amau` |
| MOD-MIE-13 | Giàn hun treo trên bếp | 1,6 × 0,8 × 1,6 | `wood` | 120 | — | S-TREO | — | |
| MOD-MIE-14 | Xâu thịt hun, bắp ngô treo | 0,3 × 0,8 | `fabric` | 60 | — | S-TREO (giàn) | — | |
| MOD-MIE-15 | Kiềng ba chân và nồi gang | 0,6 × 0,6 × 0,6 | `metal` | 300 | — | trên MIE-12 | `cook` | |
| MOD-MIE-16 | Ghế đẩu gỗ thấp | 0,35 × 0,3 × 0,35 | `wood` | 60 | — | S-PHU | `seat` | quanh bếp |
| MOD-MIE-17 | Bàn gỗ tròn thấp | Ø 0,9 × 0,4 | `wood` | 120 | T 0,45 | S-PHU → S-BAN | `tea` | |
| MOD-MIE-18 | Kệ bình gốm nắp dán giấy | 2,4 × 1,6 × 0,5 | `wood` + gốm | 600 | H | S-TUONG | `view` (truyện cổ, không hướng dẫn) | nhà vu y |
| MOD-MIE-19 | Vại gốm lớn | Ø 0,7 × 0,9 | gốm | 96 | T 0,4 | S-PHU | — | |
| MOD-MIE-20 | Khung dệt | 1,6 × 1,4 × 1,2 | `wood` + `fabric` | 700 | H | S-PHU | `weave` | |
| MOD-MIE-21 | Bàn vẽ sáp ong | 1,4 × 0,8 × 0,7 | `wood` + `fabric` | 300 | H | S-PHU → S-BAN | `batik` | |
| MOD-MIE-22 | Vạc nhuộm chàm | Ø 1,0 × 0,9 | gốm + nước lam | 120 | T 0,55 | S-PHU (sân) | `dye` | |
| MOD-MIE-23 | Vải sáp lam phơi | 2,4 × 1,6 | `fabric` lam | 32 | — | dây phơi | `sway` | |
| MOD-MIE-24 | Bàn thờ tổ tiên (giá gỗ, sừng trâu) | 1,6 × 1,8 × 0,5 | `wood` + sừng | 600 | H | S-TUONG → S-BAN | `shrine` | |
| MOD-MIE-25 | Sừng trâu treo | 0,8 × 0,4 | sừng | 200 | — | S-VACH | — | |
| MOD-MIE-26 | Trống đồng trên giá | Ø 0,8 × 0,6 | `metal` đồng | 1.200 | T 0,45 | S-PHU | `drum` | trống lâu |
| MOD-MIE-27 | Khèn dựng | 0,4 × 2,0 | tre | 200 | — | S-VACH | `music` | |
| MOD-MIE-28 | Giá trang sức bạc (mũ, vòng) | 0,6 × 1,4 × 0,4 | `metal` bạc | 1.400 | T 0,3 | S-PHU | `view` (nối `cosmetics.js`) | nhà thợ bạc |
| MOD-MIE-29 | Rương gỗ hồi môn | 1,0 × 0,6 × 0,5 | `wood` + bạc | 200 | H | S-PHU | `chest` | |
| MOD-MIE-30 | Giường gỗ có màn | 1,6 × 2,2 × 2,0 | `wood` + `fabric` | 300 | H | S-PHU | `seat` | |
| MOD-MIE-31 | Giá thuốc bó treo | 2,0 × 1,6 × 0,4 | `wood` + cỏ khô | 600 | H | S-TUONG | `herb` → `tcm › WUX_ZANG` | nhà vu y chính đạo |
| MOD-MIE-32 | Cối đá giã thuốc | 0,5 × 0,5 × 0,5 | `stone` | 120 | — | S-PHU | `herb` | |
| MOD-MIE-33 | Tủ thuốc ngăn kéo | 1,6 × 1,8 × 0,5 | `wood` | 400 | H | S-TUONG | `herb` | |
| MOD-MIE-34 | Chuông dẫn hồn treo (truyền thuyết) | 0,2 × 0,4 | `metal` | 80 | — | S-TREO | `view` | |
| MOD-MIE-35 | Đèn dầu sừng | 0,15 × 0,3 | sừng + `emissive` | 80 | — | S-VACH | `light:dendau` | |
| MOD-MIE-36 | Đuốc tường | 0,15 × 0,6 | `wood` + `emissive` | 60 | — | S-VACH | `light:bep` | hang, lối dốc |
| MOD-MIE-37 | Thang gỗ dốc nhà sàn | 1,2 × 2,4 × 2,4 (0,25 / 0,25) | `wood` | 160 | B | S-THANG | — | lên sàn |
| MOD-MIE-38 | Lan can mỹ nhân kháo Miêu | 3,2 × 0,9 × 0,5 | `wood` | 220 | Đ | mép hiên | `seat` | |
| MOD-MIE-39 | Bậc đá cuội ngoài | 1,6 × 0,2 × 0,4 | `stone` cuội | 24 | B | S-THANG | — | |
| MOD-MIE-40 | Bậc gỗ ngoài | 1,6 × 0,2 × 0,3 | `wood` | 12 | B | S-THANG | — | |
| MOD-MIE-41 | Phên che bếp | 1,6 × 1,4 × 0,05 | tre | 12 | Đ | S-PHU | — | |
| MOD-MIE-42 | Chuồng gà gầm sàn | 1,6 × 1,0 × 1,0 | tre | 120 | H | gầm | `pet` | |
| MOD-MIE-43 | Cối giã gạo chân | 2,4 × 0,8 × 0,6 | `wood` + `stone` | 300 | H | S-PHU (gầm / sân) | `chore` | |
| MOD-MIE-44 | Gùi tre | 0,5 × 0,7 × 0,4 | tre | 120 | — | S-PHU / S-VACH | — | |
| MOD-MIE-45 | Ống bương nước | 0,12 × 1,2 | tre | 40 | — | S-VACH | — | |
| MOD-MIE-46 | Bàn đá trong hang (hang phản diện) | 2,4 × 1,0 × 1,2 | `stone` | 200 | H | S-SAN | `story` (cảnh cốt truyện, tài liệu 03) | hang dưới Miêu Cương |
| MOD-MIE-47 | Đèn lồng giấy đỏ Miêu | Ø 0,4 × 0,6 | `fabric` + `emissive` | 120 | — | S-TREO | `light:denlong` | |
| MOD-MIE-48 | Vòng tre treo cửa | Ø 0,5 | tre | 60 | — | S-VACH (trên cửa) | `view` | |

---

## 4. MOD-AMT — Âm ty (Phong Đô)

**Nguyên mẫu:** Phong Đô (Trùng Khánh), truyền thuyết Thập điện Diêm La: tường xám đen, cột đỏ sẫm gần đen, đèn lồng đỏ và đèn ma lam, đá ẩm rêu, nước đen; án phán quan, gương nghiệt kính, sổ Sinh Tử; điện Địa Tạng ở đáy.

**Dùng ở:** dự kiến Phong Đô Quỷ Thành (mốc M4). Chưa có công trình.

### 4.1 Bảng màu (bảng khóa Phong Đô)

đen đá `#1C1B1F` · đỏ sẫm `#5A1414` · lam ma `#3E7FA8` · đỏ bỉ ngạn `#C21F2B` · xám sương `#6A6A70`.

### 4.2 Bảng mảnh

| Mã | Tên | Kích thước | Vật liệu · màu | Tam giác | Va chạm | Khớp | Móc | Dùng ở |
|---|---|---|---|---|---|---|---|---|
| MOD-AMT-01 | Sàn đá đen ẩm | 3,2 × 0,1 × 3,2 | `stone` đen, nhám 0,35 (ướt) | 12 | N | S-SAN | `floor:da` | mọi điện |
| MOD-AMT-02 | Sàn đá lối Hoàng Tuyền (khe hoa) | 3,2 × 0,1 × 3,2 | `stone` + khe đỏ | 40 | N | S-SAN | `floor:da` | đường xuống dốc |
| MOD-AMT-03 | Tường lót đá xám đen | 3,2 × C biến × 0,3 | `stone` | 24 | Đ | S-TUONG | — | |
| MOD-AMT-04 | Tường lót gạch đen rêu | 3,2 × C biến × 0,25 | `stone` + rêu | 24 | Đ | S-TUONG | — | |
| MOD-AMT-05 | Cột đỏ sẫm Ø 0,55 | 0,55 × C biến | `wood` `#3A0E0E` | 128 | T 0,5 | S-COT | `fadeable` | |
| MOD-AMT-06 | Cột đá quấn xích | Ø 0,7 × C biến | `stone` + `metal` | 400 | T 0,6 | S-COT | — | điện phán |
| MOD-AMT-07 | Xích sắt treo | 3,2 dài | `metal` | 200 | — | S-TREO | `sway` | |
| MOD-AMT-08 | Xà đen chạm mây u minh | 3,2 × 0,5 × 0,4 | `wood` + `trim` | 60 | X | S-TRAN | — | |
| MOD-AMT-09 | Trần vòm đá thấp | 3,2 × 0,6 × 3,2 | `stone` | 60 | X | S-TRAN | — | hang, hành lang |
| MOD-AMT-10 | Cửa song sắt nâng | 3,2 × 3,6 × 0,15 | `metal` | 160 | — | S-CUA | `door:luoi` | cửa các điện (lịch `dem`) |
| MOD-AMT-11 | Khung cửa đá Quỷ Môn | 3,6 × 4,4 × (tường + 0,4) | `stone` chạm | 600 | C | S-CUA | — | |
| MOD-AMT-12 | Cửa gỗ đen đinh sắt hai cánh | 3,0 × 3,6 × 0,12 | `wood` + `metal` | 120 | — | S-CUA | `door:canh2` | |
| MOD-AMT-13 | Án phán quan (bàn xử cao) | 3,6 × 1,4 × 1,6 | `wood` đen + `trim` đỏ | 600 | H | S-SAN → S-BAN | `judge` → `remedy-fate › YEGUO` | điện phán, NPC `phan_quan` |
| MOD-AMT-14 | Ghế phán quan cao | 1,0 × 2,0 × 0,9 | `wood` | 400 | H | sau AMT-13 | `seat:npc` | |
| MOD-AMT-15 | Bục đứng trước án | 2,0 × 0,3 × 1,6 | `stone` | 24 | N | S-SAN | `spot` | chỗ người chơi đứng đọc sổ |
| MOD-AMT-16 | Gương nghiệt kính | Ø 2,4 trên khung đứng 3,0 | `metal` + mặt gương (canvas động) | 800 | H | S-PHU | `mirror` (hiện việc đã làm khi đi Tà Lộ — `TL-*`) | |
| MOD-AMT-17 | Sổ Sinh Tử trên giá | 1,0 × 1,3 × 0,6 | `fabric` + giá `wood` | 300 | H | S-PHU | `book` → `remedy-fate › meritLedger` | |
| MOD-AMT-18 | Bút son phán quan | 0,4 × 0,05 | `wood` + đỏ | 40 | — | S-BAN | `view` | |
| MOD-AMT-19 | Ống thẻ lệnh và lệnh bài | 0,3 × 0,5 | `wood` | 200 | — | S-BAN | `view` | |
| MOD-AMT-20 | Khám điện chủ (hư cấu) | 3,2 × 4,0 × 1,6 | `wood` đen + đỏ | 1.200 | H | S-SAN → S-KHAM | `shrine` | |
| MOD-AMT-21 | Tượng quỷ sai đứng (biến thể, không máu me) | 0,8 × 2,4 × 0,8 | đá sơn | 6.000 | T 0,45 | S-PHU | `view` | |
| MOD-AMT-22 | Đèn ma lồng lam | Ø 0,4 × 0,6 | `fabric` + `emissive` lam | 120 | — | S-TREO | `light:ma` | |
| MOD-AMT-23 | Đèn lồng đỏ âm ty | Ø 0,5 × 0,7 | `fabric` + `emissive` | 120 | — | S-TREO | `light:denlong` | |
| MOD-AMT-24 | Đèn đá u minh | 0,6 × 1,4 × 0,6 | `stone` + `emissive` lam | 200 | T 0,35 | S-PHU | `light:ma` | |
| MOD-AMT-25 | Lư hương đá đen | 0,8 × 0,9 × 0,8 | `stone` | 300 | T 0,45 | S-PHU | `incense` + `khoi` | |
| MOD-AMT-26 | Chậu than lửa lam | Ø 0,7 × 0,8 | `metal` + `emissive` | 200 | T 0,4 | S-PHU | `light:ma` | |
| MOD-AMT-27 | Vạc canh Mạnh Bà | Ø 1,6 × 1,2 | `metal` + mặt canh | 600 | T 0,85 | S-SAN | `story` (cảnh, không uống bắt buộc) | |
| MOD-AMT-28 | Bàn bát canh | 2,4 × 0,9 × 0,8 | `wood` + bát gốm | 400 | H | S-PHU → S-BAN | `story` | |
| MOD-AMT-29 | Nhịp cầu đá (lan can Nại Hà) | 3,2 × 1,0 × 2,4 | `stone` | 300 | N + Đ | S-SAN (nối nhịp) | — | ba cầu thiện / bình / ác |
| MOD-AMT-30 | Bậc đá xuống dốc | 3,2 × 0,2 × 0,6 | `stone` | 12 | B | S-THANG | — | đường một chiều |
| MOD-AMT-31 | Cụm hoa bỉ ngạn | 0,8 × 0,5 × 0,8 | `fabric` đỏ alpha | 120 | — | S-PHU | `view` | |
| MOD-AMT-32 | Bia đá Quỷ Môn Quan | 1,2 × 3,0 × 0,6 | `stone` + chữ | 300 | H | S-PHU | `stele` | |
| MOD-AMT-33 | Biển đen chữ trắng | 3,2 × 1,0 × 0,1 | `wood` + canvas | 12 | — | S-VACH | `label` | |
| MOD-AMT-34 | Câu đối đá | 0,5 × 3,2 × 0,15 | `stone` | 24 | — | S-VACH | `label` | |
| MOD-AMT-35 | Phướn trắng siêu độ | 0,8 × 3,6 | `fabric` trắng | 64 | — | S-TREO | `sway` | điện Địa Tạng |
| MOD-AMT-36 | Chuông đồng siêu độ | Ø 0,9 × 1,2 | `metal` | 1.200 | — | S-TREO | `bell` | điện Địa Tạng |
| MOD-AMT-37 | Mõ và khánh tụng | 0,8 × 0,8 × 0,6 | `wood` + `metal` | 400 | H | S-PHU | `muyu` | |
| MOD-AMT-38 | Đài sen đá Địa Tạng | 3,2 × 1,2 × 3,2 | `stone` | 1.400 | H | S-SAN → S-BAN | `shrine` | đáy Phong Đô |
| MOD-AMT-39 | Đèn hoa sen thả nước | Ø 0,3 | `fabric` + `emissive` | 60 | — | mặt nước | `float` (dẫn lối ra) | |
| MOD-AMT-40 | Tấm mặt nước đen | 3,2 × 0 × 3,2 | nước đen phản chiếu môi trường | 2 | H (không lội) | S-SAN | — | |
| MOD-AMT-41 | Khối thạch nhũ / đá hang | 1,6 × 3,2 × 1,6 | `stone` | 400 | Đ | S-PHU / S-TRAN | — | |
| MOD-AMT-42 | Gông treo tường (trang trí) | 0,9 × 0,5 | `wood` | 60 | — | S-VACH | — | |
| MOD-AMT-43 | Bàn sám hối (bàn thấp + đệm quỳ) | 1,6 × 0,5 × 0,8 | `wood` + `fabric` | 200 | H | S-PHU | `repent` → `remedy-fate › CHAN_HUI` | |
| MOD-AMT-44 | Kệ thẻ nghiệp (10 ô) | 3,2 × 2,0 × 0,4 | `wood` | 600 | H | S-TUONG | `karma` (10 ác nghiệp `YEGUO`) | |
| MOD-AMT-45 | Song cửa sổ điện | 1,6 × 1,6 × 0,2 | `metal` | 100 | — (`lattice`) | S-CUA | — | |
| MOD-AMT-46 | Thẻ sương lạnh | 3,2 × 1,0 | sprite xám | 2 | — | S-SAN | `fog` | |
| MOD-AMT-47 | Ghế đá chờ | 2,4 × 0,5 × 0,6 | `stone` | 24 | H | S-PHU | `seat` | |

---

## 5. MOD-DAN — Dân dụng Huyền Thành

**Nguyên mẫu:** nhà vườn tứ hợp nhỏ phương Bắc (mô hình `lib_courtyard`) — một gian giữa thờ gia tiên, hai buồng; nhà phố có gian hàng mặt đường; đồ đạc theo nghề.

**Dùng ở (đang có):** 36 nhà vườn (INT-HT-NHA-01 … 36), Tàng Y Các (buồng may, INT-SM-TANGY), Du Phương Lâu (phòng trọ, INT-HT-DUPHUONG), Lưng Chừng Quán (INT-NUI-LUNGCHUNG), phòng gác Sơn Môn / Hậu Môn / thành môn, sạp chợ (INT-HT-SAP-*).

### 5.1 Bảng màu

`huyenthanh`: vữa vàng nhạt `#D9C9A0` · gỗ nâu `#6A4A30` · ngói xám `#4A4A4C` · gạch `#8F877A` · nhấn theo **Hỷ thần của chủ nhà** (Mộc `#2F8F4A`, Hỏa `#C6301F`, Thổ `#D29A2A`, Kim `#E8E2CF`, Thủy `#2C5FB0` — cùng bảng `WX_FLAG` của `sect.js`).

### 5.2 Bảng mảnh

| Mã | Tên | Kích thước | Vật liệu · màu | Tam giác | Va chạm | Khớp | Móc | Dùng ở |
|---|---|---|---|---|---|---|---|---|
| MOD-DAN-01 | Sàn gạch vuông nhà dân | 3,2 × 0,08 × 3,2 | `stone` gạch | 12 | N | S-SAN | `floor:da` | gian giữa |
| MOD-DAN-02 | Sàn ván buồng | 3,2 × 0,1 × 3,2 | `wood` | 12 | N | S-SAN | `floor:go` | buồng |
| MOD-DAN-03 | Tường lót vữa vàng | 3,2 × C biến × 0,12 | `stone` vữa | 24 | Đ | S-TUONG → S-VACH | — | |
| MOD-DAN-04 | Tường lót gạch xám | 3,2 × C biến × 0,15 | `stone` | 24 | Đ | S-TUONG | — | bếp |
| MOD-DAN-05 | Vách ván ngăn buồng | 3,2 × 2,8 × 0,06 | `wood` | 24 | Đ | S-TUONG | — | |
| MOD-DAN-06 | Cột gỗ nhà dân Ø 0,28 | 0,28 × C biến | `wood` | 64 | T 0,22 | S-COT | — | |
| MOD-DAN-07 | Xà kèo nhà dân | 3,2 × 0,3 × 0,2 | `wood` | 24 | X | S-TRAN | — | |
| MOD-DAN-08 | Trần lộ kèo | 3,2 × 0,5 × 3,2 | `wood` + mặt dưới ngói | 80 | X | S-TRAN | — | |
| MOD-DAN-09 | Cửa ván một cánh (buồng) | 0,9 × 2,2 × 0,05 | `wood` | 24 | — | S-CUA | `door:canh1` | |
| MOD-DAN-10 | Cửa ván hai cánh (cửa chính) | 1,8 × 2,6 × 0,06 | `wood` + câu đối giấy | 48 | — | S-CUA | `door:canh2` (lịch `nha_dan`) | |
| MOD-DAN-11 | Cửa lùa mặt phố (ván tháo lắp) | 3,2 × 2,8 × 0,06 (6 ván) | `wood` | 72 | — | S-CUA | `door:truot` (lịch `cho`) | nhà phố đại lộ Nam |
| MOD-DAN-12 | Khung cửa sổ song gỗ | 1,2 × 1,0 × 0,12 | `wood` | 60 | — (`window`) | S-CUA | — | |
| MOD-DAN-13 | Bàn thờ gia tiên | 1,6 × 1,8 × 0,6 | `wood` sơn + khám nhỏ | 500 | H | S-TUONG (gian giữa, đối cửa) → S-BAN | `shrine:giatien` | mọi nhà |
| MOD-DAN-14 | Bát hương và đôi nến gia tiên | 0,6 × 0,3 × 0,2 | gốm + `emissive` | 200 | — | S-BAN | `incense` + `light:nen` | |
| MOD-DAN-15 | Bàn ăn tròn và 4 ghế đẩu | Ø 1,1 × 0,75 | `wood` | 400 | T 0,6 | S-PHU | `meal` | |
| MOD-DAN-16 | Phản gỗ (sập) | 1,8 × 0,5 × 1,2 | `wood` | 120 | H | S-PHU | `seat` | gian giữa |
| MOD-DAN-17 | Giường có màn | 1,6 × 2,0 × 2,0 | `wood` + `fabric` | 300 | H | S-PHU | `sleep` (NPC) | buồng |
| MOD-DAN-18 | Tủ áo gỗ | 1,2 × 1,8 × 0,5 | `wood` | 120 | H | S-TUONG | `chest` | |
| MOD-DAN-19 | Rương | 0,9 × 0,5 × 0,5 | `wood` + đồng | 120 | H | S-PHU | `chest` | |
| MOD-DAN-20 | Chạn bát | 1,0 × 1,6 × 0,4 | `wood` + gốm | 400 | H | S-TUONG | — | bếp |
| MOD-DAN-21 | Bếp lò gạch hai miệng | 1,6 × 0,8 × 0,8 + ống khói | `stone` + `emissive` (đạo cụ `prop_cooking_stove`) | 600 | H | S-TUONG | `light:bep` + `cook` + `khoi` | bếp mọi nhà |
| MOD-DAN-22 | Chum nước và gáo | Ø 0,6 × 0,7 | gốm | 120 | T 0,35 | S-PHU | `water` | |
| MOD-DAN-23 | Vại dưa | Ø 0,4 × 0,5 | gốm | 96 | T 0,25 | S-PHU | — | |
| MOD-DAN-24 | Nong mẹt phơi | Ø 1,2 × 0,05 | tre | 60 | — | S-PHU (sân) | — | |
| MOD-DAN-25 | Quang gánh, thúng | 1,6 × 0,6 × 0,4 | tre + `wood` | 200 | — | S-PHU | — | |
| MOD-DAN-26 | Ấm trà và khay chén nhà dân | 0,4 × 0,15 × 0,3 | gốm | 200 | — | S-BAN | `tea` | |
| MOD-DAN-27 | Đèn dầu bàn | 0,15 × 0,35 | `metal` + `emissive` | 100 | — | S-BAN | `light:dendau` | |
| MOD-DAN-28 | Đèn lồng hiên | Ø 0,4 × 0,6 | `fabric` + `emissive` | 120 | — | S-TREO (hiên) | `light:denlong` | |
| MOD-DAN-29 | Tranh dân gian / lịch treo | 0,6 × 0,9 | `fabric` canvas | 2 | — | S-VACH | `label` → lịch ngày (`month-calendar › monthCalendar`) | |
| MOD-DAN-30 | Câu đối Tết giấy đỏ | 0,35 × 1,6 | `fabric` | 2 | — | hai bên cửa | `label` (đổi theo tháng) | |
| MOD-DAN-31 | Bàn trang điểm và gương tròn | 0,9 × 1,4 × 0,45 | `wood` + gương | 300 | H | S-TUONG | `view` (nối Tàng Y Các) | |
| MOD-DAN-32 | Khung dệt nhỏ | 1,2 × 1,2 × 1,0 (`prop_loom_small`) | `wood` + `fabric` | 600 | H | S-PHU | `craft:det` | nghề dệt |
| MOD-DAN-33 | Bàn thợ mộc và dụng cụ | 2,0 × 0,9 × 0,7 | `wood` + `metal` | 500 | H | S-PHU | `craft:moc` | nghề mộc |
| MOD-DAN-34 | Lò rèn nhỏ và đe | 1,2 × 1,0 × 1,0 | `stone` + `metal` + `emissive` | 500 | H | S-TUONG | `craft:ren` + `light:bep` | nghề rèn |
| MOD-DAN-35 | Quầy tiệm | 2,4 × 1,0 × 0,6 | `wood` | 120 | H | S-PHU (sau cửa lùa) | `shop` | nhà phố, Tàng Y Các |
| MOD-DAN-36 | Kệ hàng tiệm | 2,4 × 2,0 × 0,5 | `wood` + hàng theo nghề | 600 | H | S-TUONG | `shop` | |
| MOD-DAN-37 | Bàn tính và sổ sách | 0,5 × 0,1 × 0,3 | `wood` | 200 | — | S-BAN | `ledger` (nghề buôn — Thương đạo) | |
| MOD-DAN-38 | Án thư thầy đồ nhỏ | 1,2 × 0,35 × 0,6 + sách | `wood` | 200 | H | S-PHU | `read` | nghề thầy đồ |
| MOD-DAN-39 | Giá thuốc bắc (tủ trăm ngăn) | 1,8 × 2,0 × 0,5 | `wood` | 500 | H | S-TUONG | `herb` → `tcm › meridianClock` | nghề thầy thuốc |
| MOD-DAN-40 | Lồng chim treo | Ø 0,35 × 0,5 | tre | 120 | — | S-TREO (hiên) | `pet:chim` | |
| MOD-DAN-41 | Chậu cây cảnh / bồn hoa | 0,6 × 0,8 | gốm + cây | 400 | T 0,3 | S-PHU | `plant` → `plant-fs › plantFengShui` | |
| MOD-DAN-42 | Mèo / chó nhà (NPC động vật) | 0,5 × 0,4 | thú nhỏ có xương | 1.500 | — | S-PHU | `pet` | |
| MOD-DAN-43 | Chuồng gà sân sau | 1,2 × 0,8 × 0,8 | tre | 120 | H | S-PHU | `pet` | |
| MOD-DAN-44 | Miệng giếng đá | Ø 1,0 × 0,7 | `stone` | 120 | T 0,55 | S-PHU (sân) | `water` | |
| MOD-DAN-45 | Dây phơi áo | 3,2 × 1,8 | tre + `fabric` | 60 | — | sân | `sway` | |
| MOD-DAN-46 | Bàn cờ tướng và ghế | 0,8 × 0,75 × 0,8 + 2 ghế | `stone` | 300 | T 0,45 | S-PHU (sân) | `chess` (xã hội, tài liệu 10) | |
| MOD-DAN-47 | Thang gỗ lên gác xép | 1,2 × 2,4 × 2,4 (0,25 / 0,25) | `wood` | 160 | B | S-THANG | — | kiểu nhà T3 |
| MOD-DAN-48 | Sàn gác xép | 3,2 × 0,1 × 3,2 | `wood` | 12 | N (lv 1) | S-SAN | `floor:go` | kiểu nhà T3 |
| MOD-DAN-49 | Bình phong tre sân | 1,6 × 1,8 × 0,1 | tre | 40 | Đ | S-PHU (sau cửa) | — | |
| MOD-DAN-50 | Biển hiệu tiệm (tên nghề) | 1,6 × 0,5 × 0,08 | `wood` + canvas | 12 | — | S-VACH (mặt phố) | `label` | nhà phố |

### 5.3 Bộ đồ theo nghề (dùng ở 08-09 §3.4)

| Nghề (theo Ngũ Duy mạnh nhất của chủ nhà) | Mảnh đặc trưng | Hook nối |
|---|---|---|
| Buôn bán (Thương đạo · Tài) | DAN-11, DAN-35, DAN-36, DAN-37, DAN-50 | `ledger` |
| Thư lại / làm quan (Trị đạo · Quan) | DAN-38 (thay sách bằng hồ sơ), tủ hồ sơ = DAN-18, con dấu trên DAN-14 | `read` |
| Thầy đồ / thầy thuốc (Học đạo · Ấn) | DAN-38 hoặc DAN-39, kệ sách NHO-17 | `read` / `herb` |
| Thợ thủ công / nấu ăn (Nghệ đạo · Thực) | DAN-32 / DAN-33 / DAN-34 hoặc bếp lớn DAN-21 × 2 | `craft:*` / `cook` |
| Võ quán / nghề nhóm (Đồng đạo · Tỷ) | giá binh khí gỗ (GNA-23 biến thể gỗ thường, bỏ kiếm thất tinh), sân tập, DAN-46 | `chess` / `train` |
