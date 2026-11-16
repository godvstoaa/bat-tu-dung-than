# 03 · Trạng thái: hệ nào đã có gì

> **Trạng thái:** `[ĐÃ CÓ]`
> **Bộ phận chủ trì:** QA (đồng giữ: Vận hành)
> **Nguồn sự thật trong mã:** [A1](phu-luc/A1-ban-do-ma.md) (mô-đun), [A2](phu-luc/A2-kiem-thu.md) (test)
> **Test:** toàn bộ `scripts/test-*.mjs`
> **Thay thế:** các dòng «Trạng thái» ở đầu `GAME-SINH-TON-KINH-TE-DAC-TA`, `GAME-V2-THIET-KE` §6, `GAME-THIET-KE-CHOT` §5
> **Kiểm với mã ngày:** 2026-11-16

## 3.1 Mục đích và cách đọc

Một bảng cho biết mỗi hệ đang ở đâu trên bốn nấc: **có mã → có test thuần đạt → đã kiểm trong trình duyệt → đã lên bản thật**. Cột «Bản iOS» ghi hệ có bật trong bản iOS không.

- «Test» ghi tên bộ test và số ca đạt khi chạy lẻ ngày 2026-11-16.
- «Trình duyệt» và «Bản thật» lấy theo nhật ký thi công; ô «?» nghĩa là nhật ký không ghi.
- Ai đổi trạng thái của một hệ thì sửa đúng dòng của hệ đó và ghi vào [NHAT-KY](NHAT-KY.md).

## 3.2 Tóm tắt

- **Mọi giai đoạn P0–P21 đã có mã.** Dòng «P3–P21 chưa code» ở đầu đặc tả cũ là sai (MT-6).
- **43/43 bộ test thuần đạt** khi chạy lẻ (kiểm 16/11, sau đợt sửa lỗi). Ba bộ cần máy chủ dev cũng đạt: `test-quan-mmo` 22/22, `test-quan-auth` 10/10, `test-econ-accounts` (máy chủ dev cộng mô hình giả).
- **`npm run test:game` đang gãy** ở bộ thứ 9; 17 bộ test không nằm trong lệnh npm nào ([A2](phu-luc/A2-kiem-thu.md) §A2.1) → `VC-001`.
- Hai nhánh **chưa kiểm trên bản thật**: NPC trò chuyện và trọng tài bằng tài khoản thật → `VC-008`.
- NPC-AI dừng ở G2 cộng G3 rút gọn; cờ `personaAi` tắt → `VC-005`, `VC-006`, `VC-007`.

## 3.3 Ma trận theo hệ

| Hệ | Chương | Giai đoạn cũ | Mã | Test (số ca đạt) | Trình duyệt | Bản thật | Bản iOS |
|---|---|---|---|---|---|---|---|
| Địa hình, thế giới 8.192 m | §10 | v4 | có | `terrain` 7 | có | có | bật |
| Sơn Môn | §10 | V2 | có | `state` 19, `collide` 256 | có | có | bật |
| Huyền Thành v5 (phường, phố, tiệm) | §10 | v4, v5 | có | `city-v4` 21, `batquai` 69, `homes` 10, `map` 4 | có | có | bật |
| Thủy hệ, cầu | §10 | v3, v4 | có | `water` 9 | có | có | bật |
| Cửu Trọng Thiên | §10 | v6 | có | `heaven` 4 | có | có | bật |
| Quận Thiên Bàn | §10 | 14/11 | có | `sky` 44 | ? | có | bật |
| Nhập môn, lá số, phẩm phục | §11 | V2-2 | có | `state` 19 | có | có | bật |
| Cấp, gia trì, VIP | §11 | V2-5 | có | `progress` 5 | có | có | bật |
| Tàng Y Các | §11 | V2 | có | `cosmetics` 8 | có | có | bật, ẩn nạp Ngọc |
| Nơi xuất hiện, tân thủ | §11 | v4 | có | `spawn` 9 | ? | có | bật |
| Thầy bói AI, miếu | §12 | v4 | có | `fortune` 6 | có | có | **tắt** |
| Các gian Sơn Môn | §12 | V1, V2 | có | `state` 19 | có | có | tắt xăm, hoa đăng |
| Sảnh nghề, giải án | §12 | V1, P0-2 | có | `halls` 8, `cases` 10, `dz` 7, `zheri` 8, `npc-deep` 7 | có | có | bật (dạng học) |
| Thầy Giải Quẻ, Đường Thầy | §12 | V2-3, P0-1 | có | `thay-mo-rong` 13 | có | có | **tắt** |
| Vận Mệnh Các, Thái Tuế Điện | §12 | V2 | có | `vanmenh` 9 | có | có | **tắt** |
| Thầy mệnh lý người chơi | §12.6 | P13 | có | `econ` 32 (một phần), `econ-accounts` (máy chủ) | máy dev | có mã; **chưa kiểm bằng tài khoản thật** | tắt |
| Tiền kim loại, Tiền Trang | §13.1 | P18 | có | `life` 15 | có | có | bật |
| Sinh tồn, ăn, ngủ, thuế | §13.2 | P1 | có | `life` 15 | có | có | bật |
| Bệnh, Y Quán, nợ | §13.2.3 | P3 | có | `illness` 8 | ? | có | bật |
| Việc làm, chỗ làm, ca | §14 | P2, P7 | có | `jobs` 18; `quan-mmo` (máy chủ) | có | có | bật |
| Nhiệm vụ mệnh | §14.1.6 | P5 | có | `fate` 6 | ? | có | bật |
| Nhà riêng, bài trí, phong thủy | §15 | 10/11 | có | `estate` 10, `mansion` 8, `homes` 10 | có | có | bật |
| Vật phẩm, tiệm NPC | §15 | 10/11 | có | `items` 8 | có | có | bật |
| Phương tiện, bảo trì nhà | §15.3 | P4 | có | `vehicles` 7 | ? | có | bật |
| Chạy, nhảy, lượn, bơi, leo | §16 | 10/11 | có | `motion` 10 | có | có | bật |
| Thuyền | §16 | 10/11 | có | `water` 9 | có | có | bật |
| Đạp nước | §16.3 | P14 | có | `motion` 10 | ? | có | bật |
| Phi hành độc bản | §16.4 | P15 | có | `flight` 3 | ? | có | bật |
| Kho, độ tươi | §17 | P8 | có | `econ` 32 | máy dev | có | bật |
| Sản xuất, chợ, Thương hội | §17.1 | P9 | có | `econ` 32 | máy dev | có | bật |
| Ẩm thực, đầu bếp | §17.2–§17.3 | P10 | có | `econ` 32 | máy dev | có | bật |
| Nhà hàng | §17.4 | P11 | có | `econ` 32 | máy dev | có | bật |
| Phúc Khí, Âm Đức, Nghiệp Lực | §18.1–§18.3 | P17, P19 | có | `amduc` 6, `huyenhoc` 10 | có | có | bật |
| Cảnh giới, pháp môn | §18.4 | P20 | có | `huyenhoc` 10 | ? | có | bật |
| Luân hồi | §18.5 | P21 | có | `huyenhoc` 10 | có | có | bật |
| Phá công trình, luật, ngục | §19 | 10/11 | có | `law` 12 | có | có | bật |
| Thấy nhau, cử chỉ, lư hương chung | §20 | V1, 11/11 | có | `quan-protocol` 15; `quan-mmo` (máy chủ) | có | có | bật |
| Hôn nhân | §20.2 | P12 | có | `econ` 32; `econ-accounts` (máy chủ) | máy dev | có | bật |
| Persona, bark, chuyện khách | §21 | G0–G2 | có | `persona-schema` 14, `bark-pool` 8, `story-gen` 8, `map-rating` 6, `ai-persona` 10 | có | có; `personaAi` **tắt** | tắt AI |
| NPC trò chuyện bằng LLM | §21.3 | P6 | có | `econ` 32 (kiểm injection) | máy dev, LLM giả | có mã; **chưa kiểm bằng tài khoản thật** | tắt |
| Giao diện di động, bản đồ, menu Địa điểm | §22 | P16, v4, v6 | có | `map` 4, `heaven` 4 | có | có | bật |
| Tài khoản, lưu mây | §31.2 | P0 | có | `auth` 8; `quan-auth` (máy chủ) | có | có; cần cấu hình bí mật | chưa (thiếu Apple) |
| Sổ kinh tế `Economy` | §31.4 | P8–P13 | có | `econ` 32 | máy dev | có | bật |

## 3.4 Những gì có trong đặc tả nhưng chưa thấy trong mã `[MỘT PHẦN]`

Danh sách này lấy bằng cách so tên thao tác kinh tế ở [A4](phu-luc/A4-giao-thuc.md) §A4.1 với đặc tả. Mỗi dòng cần người phụ trách mở mã xác nhận trước khi coi là thiếu.

| Mục đặc tả | Dấu hiệu | Việc |
|---|---|---|
| Hợp đồng sỉ giữa người chơi (§17.1.4) | không có thao tác `b2b_*` | VC-027 |
| Đấu giá mặt bằng phá sản (§17.4.5) | không có thao tác đấu giá; nhật ký ghi «niêm phong, phần âm thành nợ chủ» | VC-027 |
| Bếp trưởng điều hành ăn chia (§17.3.4) | không có thao tác hợp đồng bếp trưởng | VC-028 |
| Đồng sở hữu nhà, thừa kế (§20.2.3) | chỉ thấy quỹ chung `cv_fund`, `cv_take` | VC-029 |
| Hệ số giờ hoàng đạo và ngày can chi trong lương trên máy chủ (§14.2.4) | đặc tả ghi «chưa có»; mã có `jobs.HOUR_LUCK` | VC-014 |
| Chỉ số giá theo phòng (§13.3.4) | không thấy hằng số tương ứng | VC-031 |
| Ví tiền trên máy chủ hoàn toàn (§31.3) | đang là ví máy cộng ví chợ có trần | VC-013 |

## 3.5 Hiện trạng kho mã (2026-11-16)

- Nhánh `main`, 55 commit từ 10/11. Cây làm việc: 5 tệp đang sửa (`assets.js`, `cityblocks3d.js`, `landmarks.js`, `scripts/shot-city.mjs`, một ảnh), 55 tệp chưa theo dõi, phần lớn là ảnh chụp trong `shots/` và vài tệp tên lạ ở gốc repo → `VC-025`.
- Deploy chỉ chạy tay từ 16/11 (§32.4).

## 3.6 Vấn đề đã biết trong mã (kiểm 2026-11-16)

Nguồn: danh sách 21 lỗi mà bản tầm nhìn ghi ngày 05/11 (mục 4 của `docs/gdd/README.md`), cộng phát hiện khi rà sách NPC-AI. Mỗi dòng đã được mở mã kiểm lại ngày 16/11; «chưa kiểm» nghĩa là chưa mở mã. Dòng ghi «Đã sửa 16/11» được sửa trong đợt theo [GAME-SUA-LOI-MANIFEST](../GAME-SUA-LOI-MANIFEST.md).

| Vấn đề | Kiểm 16/11 | Việc |
|---|---|---|
| Lời người chơi tới NPC bị hỏng chữ: hàm làm sạch thay mọi chữ «s» bằng dấu cách | **Đã sửa 16/11**; test trong `test-game-econ` | `VC-038` |
| Mức `aiEnabled` của persona không được thi hành | **Đã sửa 16/11** ở cả client và máy chủ; test trong `test-game-ai-persona` | `VC-034` |
| Không có cổng khủng hoảng ở đường trò chuyện nào | **Đã sửa 16/11**: cổng chạy ở bốn chỗ; `scripts/test-crisis.mjs` | `VC-035` |
| Vật thiêng bán làm trang phục, vài món khoá VIP | **Đã sửa 16/11**: bốn món mở theo cấp, không Ngọc, không VIP; hai tên đổi; test bất biến E1 | `VC-036` |
| Tham số `?server=` đổi máy chủ mà client nối tới | **Đã sửa 16/11**: chỉ còn ở bản dev | `VC-037` |
| Trang phục gửi qua mạng không được kiểm sở hữu | **Đã sửa 16/11**: máy chủ đọc tủ đồ trong bản lưu mây; khách chỉ phát món không cần trả tiền thật | `VC-037` |
| Danh hiệu trong gói chào không được lọc | **Đã sửa 16/11**: chỉ tên trong danh sách; tài khoản không vượt bậc xp | `VC-037` |
| Báo cáo vi phạm không có người duyệt, quá 500 mục thì bỏ | **Đã sửa 16/11**: hàng đợi duyệt trên bảng quản trị; báo cáo quá 30 ngày được dọn | `VC-037` |
| Đẩy lên nhánh chính là tự deploy | **Đã sửa 16/11**: quy trình CI chỉ chạy tay | MT-11 |
| Engine: so chuỗi giản thể với phồn thể; đọc sai khoá Dụng thần; hai lỗi chính tả trong chữ hiển thị | **Đã sửa 16/11** | `VC-038` |
| Biểu tượng cổng đền của Nhật dùng cho cổng đại vận | **Đã sửa 16/11** (đổi sang đèn lồng, năm chỗ) | `VC-038` |
| Khoá quản trị truyền qua địa chỉ; bảng quản trị lưu dữ liệu 90 ngày | **Đã sửa 16/11**: các lời gọi API của bảng quản trị gửi khoá bằng header, không qua địa chỉ; lần mở đầu tiên vẫn nhận khoá trên địa chỉ rồi chuyển sang cookie. Thời hạn 90 ngày của dữ liệu đo giữ nguyên | `VC-037` |
| Màu áo đồng bộ qua mạng để lộ Dụng thần và Hỷ thần | đã kiểm: màu áo theo Dụng thần là thiết kế phẩm phục (§11.2), không lộ ngày sinh (LN-01) → **giữ**; ghi ở MT-13 | `VC-037` |
| Phòng ở dải phía Đông vượt biên của gói vị trí | đã sửa | — |
| Máy chủ phát lại mọi gói vị trí cho cả phòng | đã sửa: phát theo vùng gần | — |
| Xoá rồi thêm lại lá số được cộng Phúc Khí nhiều lần | đã sửa | — |
| Danh hiệu đọc số dư Phúc Khí thay vì số tích luỹ cả đời | đã có trường tích luỹ cả đời; chưa kiểm danh hiệu đọc trường nào | — |
| Engine: hàm lập kế hoạch cải mệnh không được truyền năm thì tính sai vận | chưa kiểm | — |
| Engine: lời khuyên giải Thái Tuế có câu khuyên trích máu | không còn thấy câu này; phần còn lại của mục chưa kiểm | — |
| Nhãn Hỷ thần ở lễ lật trụ đọc sai khoá | mã đã đổi; chưa kiểm hiển thị | — |
| Hạn mức toàn trang đếm cả tệp model của game | chưa kiểm | — |
| Âm lịch: thư viện tính theo múi giờ +8, lịch Việt Nam là +7 | chưa kiểm ảnh hưởng trong game | — |
| Bố cục Sơn Môn: tháp cắt tường, sạp chắn cửa | chưa kiểm (Sơn Môn đã dựng lại nhiều lần) | — |

## 3.7 Liên kết

- Việc phải làm cho từng ô còn trống: [04-LO-TRINH](04-LO-TRINH.md).
- Cách chạy lại toàn bộ test: §32.
