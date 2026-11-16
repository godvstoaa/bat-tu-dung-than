# HUYỀN QUÁN ONLINE — Bộ thiết kế hợp nhất

Đây là **cổng vào duy nhất** của mọi tài liệu thiết kế game. Bộ này thay cho các tài liệu game rời rạc ở `docs/` gốc (xem [90-PHA-HE-TAI-LIEU](90-PHA-HE-TAI-LIEU.md)). Quy tắc soạn bộ này: [GAME-THIET-KE-MANIFEST](../GAME-THIET-KE-MANIFEST.md).

Game là gì, trong một câu: **một thành phố huyền học sống trên trình duyệt, nơi lá số Bát Tự thật của người chơi quyết định nhân vật, và người chơi đến để xem bói rồi ở lại để sống** — làm nghề hợp mệnh, dựng nhà, tu luyện, qua nhiều kiếp.

## 1. Đọc gì trước

| Bạn là | Đọc theo thứ tự |
|---|---|
| Người mới, bất kỳ vai nào | README này → [00-TONG-QUAN](00-TONG-QUAN.md) → sổ tay bộ phận của mình |
| Thiết kế game | [50](50-BO-PHAN-THIET-KE-GAME.md) → 01, 02 → chương hệ thống mình phụ trách |
| Lập trình client, 3D | [51](51-BO-PHAN-CLIENT-3D.md) → 30 → 10 → 22, 23 |
| Lập trình máy chủ | [52](52-BO-PHAN-BACKEND.md) → 31 → 13–17 phần «máy chủ quyết» |
| AI, NPC | [53](53-BO-PHAN-AI-NPC.md) → 21 → 40 → 12 |
| Mỹ thuật, tài sản 3D | [54](54-BO-PHAN-MY-THUAT.md) → 23 → 10 |
| Nội dung, biên kịch | [55](55-BO-PHAN-NOI-DUNG.md) → 01 → 40 → 12, 21 |
| Kiểm thử | [56](56-BO-PHAN-QA.md) → 32 → 03 |
| Vận hành, phát hành | [57](57-BO-PHAN-VAN-HANH.md) → 32 → 31 → 40 |
| Chủ dự án cần quyết | [02-QUYET-DINH](02-QUYET-DINH.md) mục «Chờ duyệt» → [04-LO-TRINH](04-LO-TRINH.md) |

## 2. Bản đồ tài liệu

### Nền chung

| Tệp | Trả lời câu hỏi |
|---|---|
| [00-TONG-QUAN](00-TONG-QUAN.md) | Game là gì, cho ai, các hệ nối với nhau thế nào, luật nền nào không được phá |
| [01-TU-DIEN](01-TU-DIEN.md) | Mỗi khái niệm gọi tên gì; tên cũ nào không dùng nữa |
| [02-QUYET-DINH](02-QUYET-DINH.md) | Đã chốt gì, vì sao; mâu thuẫn nào đã giải; việc gì chờ chủ dự án |
| [03-TRANG-THAI](03-TRANG-THAI.md) | Hệ nào đã có mã, có test, đã lên bản thật |
| [04-LO-TRINH](04-LO-TRINH.md) | Việc tiếp theo, ai làm, nghiệm thu bằng gì |

### Hệ thống (góc nhìn người chơi và luật)

| Tệp | Nội dung |
|---|---|
| [10-THE-GIOI](10-THE-GIOI.md) | Huyền Thành (phường, cửa hàng, quầy thầy bói, miếu), Sơn Môn, sông hồ, Cửu Trọng Thiên, quận Thiên Bàn, phòng trong nhà; cách thêm một công trình hay loại tiệm |
| [11-MENH-VA-NHAN-VAT](11-MENH-VA-NHAN-VAT.md) | Nhập môn, lá số → Dụng / Hỷ / Kỵ thần, phẩm phục, cấp, gia trì |
| [12-BOI-TOAN-VA-NOI-DUNG](12-BOI-TOAN-VA-NOI-DUNG.md) | Thầy bói, miếu, các gian Sơn Môn, sảnh nghề, giải quẻ, thầy mệnh lý người chơi |
| [13-DOI-SONG](13-DOI-SONG.md) | Tiền kim loại, No / Tỉnh / Khí huyết, bệnh, ăn, ngủ, thuế, nợ |
| [14-VIEC-LAM](14-VIEC-LAM.md) | Nghề theo mệnh, chỗ làm có hạn, ca, lương, nhiệm vụ mệnh |
| [15-NHA-O-VA-PHUONG-TIEN](15-NHA-O-VA-PHUONG-TIEN.md) | Chỗ ngủ, nhà riêng, bài trí, phong thủy nhà, vật phẩm và tiệm NPC, xe ngựa |
| [16-DI-CHUYEN](16-DI-CHUYEN.md) | Chạy, nhảy, lượn, bơi, leo, thuyền, đạp nước, phi hành |
| [17-SAN-XUAT-AM-THUC-KINH-DOANH](17-SAN-XUAT-AM-THUC-KINH-DOANH.md) | Kho và độ tươi, ruộng chuồng, chợ, ẩm thực, nhà hàng, chống khai thác |
| [18-HUYEN-HOC-TU-LUYEN-LUAN-HOI](18-HUYEN-HOC-TU-LUYEN-LUAN-HOI.md) | Phúc Khí, Âm Đức, Nghiệp Lực, cảnh giới, pháp môn, Âm phủ, lục đạo |
| [19-LUAT-VA-HINH-PHAT](19-LUAT-VA-HINH-PHAT.md) | Phá công trình, Huyền Thành Luật, Thiên Lao, Khoáng Sơn |
| [20-XA-HOI](20-XA-HOI.md) | Thấy nhau, cử chỉ, lư hương chung, thăm nhà, hôn nhân |
| [21-NPC-VA-AI](21-NPC-VA-AI.md) | Các loại NPC, persona, trò chuyện bằng LLM có kiểm soát, trọng tài AI |
| [22-GIAO-DIEN-DIEU-KHIEN](22-GIAO-DIEN-DIEU-KHIEN.md) | HUD, menu, bản đồ, phím, điện thoại, thông báo, trợ năng |
| [23-MY-THUAT-TAI-SAN](23-MY-THUAT-TAI-SAN.md) | Phong cách, tỉ lệ chuẩn, model, bậc chi tiết, giấy phép |

### Kỹ thuật và luật xuyên suốt

| Tệp | Nội dung |
|---|---|
| [30-KY-THUAT-CLIENT](30-KY-THUAT-CLIENT.md) | Kiến trúc client, dựng hình, va chạm, ngân sách hiệu năng |
| [31-MAY-CHU-MANG-DU-LIEU](31-MAY-CHU-MANG-DU-LIEU.md) | Worker, Durable Object, giao thức, tài khoản, lưu mây, sổ tiền |
| [32-KIEM-THU-TRIEN-KHAI](32-KIEM-THU-TRIEN-KHAI.md) | Test, build, deploy, bản iOS, vận hành |
| [40-AN-TOAN-PHAP-LY](40-AN-TOAN-PHAP-LY.md) | Riêng tư, ngôn từ, tôn giáo, khủng hoảng, nền tảng, kiếm tiền có đạo đức |

### Tra cứu sinh từ mã (không sửa tay)

| Tệp | Nội dung |
|---|---|
| [A1](phu-luc/A1-ban-do-ma.md) | 158 mô-đun → chương → bộ phận → test |
| [A2](phu-luc/A2-kiem-thu.md) | 47 bộ test, lệnh npm |
| [A3](phu-luc/A3-so-lieu.md) | Mọi bảng số liệu: nghề, món, vật phẩm, hạng nhà, cảnh giới… |
| [A4](phu-luc/A4-giao-thuc.md) | Gói mạng, route HTTP, Durable Object |
| [A5](phu-luc/A5-dia-diem.md) | Hằng số bố cục, vùng, trạm, số nhà và tiệm đếm thật |
| [A6](phu-luc/A6-tai-san-3d.md) | 648 tệp model theo bậc và tiền tố |
| [A7](phu-luc/A7-dieu-khien-luu-tru.md) | Phím, phần tử HUD, khoá lưu trên máy |

### Tài liệu chuyên đề đang hiệu lực (lớp L2)

Chi tiết sâu của một mảng hẹp. Chương L1 tương ứng tóm tắt và dẫn tới.

| Tệp | Mảng | Chương dẫn tới |
|---|---|---|
| [THANH-MANIFEST](../THANH-MANIFEST.md), [TUONG-THANH-MANIFEST](../TUONG-THANH-MANIFEST.md) | quy hoạch phố phường, tường thành | 10 |
| [NHA-DIADIEM-MANIFEST](../NHA-DIADIEM-MANIFEST.md) | Cửu Trọng Thiên, menu «Địa điểm» | 10, 22 |
| [GAME-TROI-THIET-KE](../GAME-TROI-THIET-KE.md) | quận đảo bay Thiên Bàn | 10 |
| [CAY-QUAN-MANIFEST](../CAY-QUAN-MANIFEST.md) | cây, quán, mùa | 23 |
| [DOHOA-MANIFEST](../DOHOA-MANIFEST.md) | đồ hoạ, ngân sách hiệu năng | 30, 23 |
| [GAME-AAA-MODEL-THANH-PHO](../GAME-AAA-MODEL-THANH-PHO.md) | chuẩn tỉ lệ, model nhà phố, nhân vật | 23 |
| [TAI-KHOAN-CAI-DAT](../TAI-KHOAN-CAI-DAT.md) | cấu hình đăng nhập trên bản thật | 31, 57 |
| [docs/npc-ai/](../npc-ai/) | 36 mục: kiến trúc chuỗi AI và hồ sơ 20 persona | 21 |

## 3. Bốn quy ước phải nhớ

1. **Mã thắng về con số.** Bảng số liệu chỉ nằm trong phụ lục sinh từ mã. Chương chỉ nêu con số khi nó là luật thiết kế.
2. **Một hệ một chương.** Cần nhắc hệ khác thì dẫn bằng `§`, ví dụ `§14.1.1` là mục 2.1 của chương 14.
3. **Năm nhãn trạng thái:** `[ĐÃ CÓ]` · `[MỘT PHẦN]` · `[ĐẶC TẢ]` · `[ĐỀ XUẤT]` (chờ chủ dự án duyệt) · `[TẦM NHÌN]`.
4. **Chỉ dùng tên ở từ điển.** Tiền là xu / hào / đồng / lượng. Phúc Khí không phải tiền. Thành tên là Huyền Thành.

## 4. Giữ bộ tài liệu sống

Mỗi lần đổi mã có đụng số liệu, luật hay giao thức:

```bash
node scripts/docs-game-gen.mjs
```

```bash
node scripts/docs-game-lint.mjs
```

Rồi:
- sửa chương L1 nếu **luật** đổi (không chỉ con số);
- thêm một mục vào [NHAT-KY](NHAT-KY.md);
- quyết định mới thì thêm vào [02-QUYET-DINH](02-QUYET-DINH.md), không sửa quyết định cũ;
- cập nhật ô trạng thái ở [03-TRANG-THAI](03-TRANG-THAI.md).

## 5. Con số nhanh (đo 2026-11-16)

| | |
|---|---|
| Mã game | 158 mô-đun client; máy chủ 10 tệp, 5 Durable Object (số dòng từng tệp ở A1) |
| Thế giới | 8.192 × 8.192 m; Huyền Thành bát giác, trung đoạn tường ngoài 2.125 m |
| Trong thành | 18.152 nhà; 8.560 cửa hàng thuộc 15 loại; 289 quầy thầy bói; 21 miếu và điện; 292 căn rao bán |
| Nội dung mệnh | 13 thầy bói (8 thầy có persona riêng), 8 vị thần miếu, 8 sảnh nghề, 5 phép gieo quẻ |
| Đời sống | 31 nghề theo ngũ hành, 6 bệnh, 5 bậc phương tiện, 7 cảnh giới, 11 pháp môn, 6 cõi luân hồi |
| Kiểm thử | 47 bộ test; 44 bộ thuần đều đạt khi chạy lẻ |
