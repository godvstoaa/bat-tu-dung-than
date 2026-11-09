# 01 · Phần 13 — Kinh thánh mỹ thuật (2/2): nhân vật, trang phục theo truyền thống, hiệu ứng, giao diện

> Tiếp phần 12. Gốc code: `characters.js` (tô màu áo bằng shader thay sắc độ vùng vải bão hòa, giữ da và tóc; `hold`, `seat`), `accessories.js` (phụ kiện thủ công bám xương Head / Spine02 / RightHand), `effects.js` (gia trì, skin), `cosmetics.js`, `game.css` (biến `--hq-*`, `--wx-*`).

## 1. Nhân vật người chơi

### 1.1 Nguyên tắc

| # | Nguyên tắc | Nghĩa |
|---|---|---|
| N1 | **Lá số là màu, không là mặt** | ngoại hình khuôn mặt, dáng, tóc do người chơi chọn tự do; **màu khởi đầu** (Bản Mệnh Y) do lá số quyết định (T1) |
| N2 | **Dáng người thật** | tỷ lệ 7–7,5 đầu; không cơ bắp phóng đại, không mắt to kiểu hoạt hình |
| N3 | **Đa dạng không định kiến** | nhiều kiểu mặt, màu da, vóc dáng Á Đông; không biếm họa dân tộc nào |
| N4 | **Bóng dáng đọc được** | ở 30 m nhận ra người chơi (khác NPC) nhờ viền đai màu Hỷ thần và gia trì |
| N5 | **Khiêm nhường trong nơi thờ** | trong điện chính: tự cất cánh, vệt bước, đồ cầm tay quá khổ (phần 3 §2) |

### 1.2 Bản Mệnh Y — chuẩn thiết kế

| Phần | Chuẩn |
|---|---|
| Kiểu áo | áo giao lĩnh (cổ chéo) dài qua gối, tay rộng vừa, đai vải; đủ trung tính để ai cũng hợp (không phải đạo bào, không phải ca-sa) |
| Màu áo | sắc tướng (hue) theo hành Dụng thần, độ bão hòa 0,45–0,6, độ sáng 0,55–0,75 — không neon |
| Màu đai, viền | theo Hỷ thần |
| Họa tiết | không có ở bản gốc; người chơi mở **hoa văn hành** theo cảnh giới (mây cho Thổ, sóng cho Thủy…) |
| Cảnh giới cao | áo dài thêm, đai có tua — **không** thêm kim tuyến, không vàng (vàng là của thờ) |

### 1.3 Bảng màu Bản Mệnh Y theo hành

| Hành Dụng | Áo (HSV đề xuất) | Gợi tả | Đai theo Hỷ (ví dụ) |
|---|---|---|---|
| Mộc | 0,36 · 0,5 · 0,6 | lục tùng | Thủy → lam đậm |
| Hỏa | 0,99 · 0,6 · 0,7 | son | Mộc → lục |
| Thổ | 0,10 · 0,55 · 0,72 | vàng đất | Hỏa → son |
| Kim | 0,12 · 0,08 · 0,92 | trắng ngà | Thổ → vàng đất |
| Thủy | 0,62 · 0,55 · 0,45 | lam huyền | Kim → bạc |

*(Giá trị HSV theo quy ước `cosmetics.js › P(h, s, v)`.)*

## 2. NPC và trang phục theo truyền thống

### 2.1 Đạo giáo

| Vai | Áo | Mũ / tóc | Màu | Phụ kiện | Ghi chú thiêng |
|---|---|---|---|---|---|
| Đạo sĩ thường (Toàn Chân, Võ Đang, Chung Nam) | đạo bào thường phục cổ chéo, tay rộng | búi tóc đạo kế + hỗn nguyên cân hoặc trâm | lam xanh (青 / 藍) | tất trắng ống cao, giày vải | thường phục — người chơi được mặc kiểu tương tự |
| Đạo sĩ chủ lễ (khoa nghi) | **pháp y / giáng y** thêu (hạc, mây, bát quái) | **ngũ nhạc quan** / liên hoa quan | đỏ, vàng, tím theo cấp lễ | hốt, đế chung, lệnh bài | **thiêng — chỉ NPC** |
| Trương Thiên Sư | đạo bào phủ đệ, khi lễ mặc pháp y | quan | lam đậm thường ngày; đỏ khi lễ | ấn (truyện), kiếm bảy sao | hư cấu, không trùng đời Thiên Sư thật |
| Huyền Hư chân nhân | đạo bào cũ, vá vai | búi, trâm gỗ | xám tro | phất trần | — |
| Mao Sơn đạo nhân | áo vải lam xám, tay áo xắn khi chẩn bệnh | khăn | lam xám | túi thuốc, la bàn | — |
| Đạo đồng | áo ngắn | hai búi | lam nhạt | chổi, ấm | — |
| Phương sĩ Vô Danh | áo bạc màu, nón lá rộng | tóc buông | nâu đất | gậy trúc, bầu rượu (không uống trong cảnh) | — |

### 2.2 Phật giáo Việt

| Vai | Áo | Đầu | Màu | Phụ kiện | Ghi chú thiêng |
|---|---|---|---|---|---|
| Tăng (thường) | áo nhật bình / áo vạt hò | cạo tóc | nâu, lam | tràng hạt | thường phục tăng — **không** là trang phục người chơi |
| Tăng (lễ) | **ca-sa** ngoài áo tràng | cạo tóc | vàng / nâu | — | **thiêng — không bao giờ cho người chơi** |
| Ni sư Diệu Âm | áo tràng lam / nâu | mũ ni (khi lạnh) | nâu | tràng hạt, khánh tay | — |
| Thiền sư Trúc Lâm | áo nâu sờn | cạo tóc | nâu đất | gậy trúc, nón | — |
| Phật tử (NPC, người chơi) | **áo tràng** (hải thanh) khi lễ | — | lam (phổ biến), nâu | tràng hạt | áo tràng được **trao miễn phí** ở Bút Tháp cho người chơi dự lễ (đề xuất), không bán |
| Sa di | áo ngắn | cạo tóc, chỏm | nâu | — | — |

### 2.3 Tạng truyền (chờ tham vấn)

| Vai | Trạng thái |
|---|---|
| Lạt-ma, tăng | dựng NPC sau tham vấn; y đỏ sẫm – vàng là **thiêng**, không bao giờ cho người chơi |
| Người hành hương | trang phục cao nguyên chung, không dùng đồ lễ |
| Mạn-đà-la, chày, chuông | đạo cụ cảnh, mẫu hình hư cấu tới khi duyệt |

### 2.4 Nho

| Vai | Áo | Mũ | Màu | Ghi chú |
|---|---|---|---|---|
| Sĩ tử | áo the dài | khăn xếp | đen, lam đậm | người chơi mặc được (mua bằng Phúc Khí) |
| Tú tài / cử nhân | như trên + đai | — | — | danh vị khoa cử, trang phục mở theo đỗ |
| Tiến sĩ | áo mũ vinh quy (mũ cánh chuồn) | mũ cánh chuồn | lam, đỏ | **trao** khi đỗ đình thí — không bán |
| Tế tửu Văn Miếu | áo thụng | mũ quan văn | lam thẫm | NPC |

### 2.5 Miêu Cương (hư cấu lấy cảm hứng)

| Vai | Nguyên tắc |
|---|---|
| Cư dân trại | lấy **cảm hứng** từ trang phục vùng núi Tây Nam (vải sáp ong lam, đồ bạc), không sao chép nguyên mẫu một dân tộc cụ thể; cố vấn duyệt |
| Vu y bà A Mậu | áo chàm, khăn đội, vòng bạc mảnh — không trang sức lễ nặng |
| Người chơi | **không bán** trang phục dân tộc; một bộ «áo chàm» được bà A Mậu **tặng** khi hoàn tất chuỗi y dược (quà kết nghĩa) |

### 2.6 Âm ty

| Vai | Thiết kế |
|---|---|
| Phán quan | quan phục đen viền đỏ sẫm, mũ cánh dài, sổ lớn; mặt người nghiêm, **không** mặt quỷ |
| Địa Tạng sứ giả | áo xám nhạt, đèn lồng trắng; dịu |
| Hắc Bạch Vô Thường, Đầu Trâu Mặt Ngựa | dáng cao, mặt nạ cách điệu kiểu tranh dân gian, không máu me |
| Mạnh Bà | bà cụ hiền, bát canh |

### 2.7 Phản diện

| Vai | Ngôn ngữ thị giác |
|---|---|
| Thầy bói Định Mệnh Hội | **phô trương giả**: áo lụa màu chói, vàng mạ bong, nhiều bùa đeo lủng lẳng (ký tự hư cấu sai cấu trúc — người chơi tinh ý thấy sai), bàn trải vải đỏ, chuông nhỏ; **không** giống trang phục tu sĩ thật nào |
| Yểm sư Lỗ Ban | thợ mộc tài hoa: áo nâu thợ sạch sẽ, tay đẹp, thước Lỗ Ban (đạo cụ hư cấu khắc ký hiệu), túi đồ nghề; ánh mắt bình thản. **Không** mặt quỷ, không áo đen kiểu phù thủy: cái ác của hắn là cái ác lịch sự |
| Khổng tiên sinh | nhà nho già sạch sẽ, áo xám lam, quạt; không phải phản diện |

## 3. Ma trận vật thiêng — ai được mặc / cầm

| Thứ | Người chơi mua | Người chơi được trao qua tu | Chỉ NPC | Không dựng |
|---|---|---|---|---|
| Đạo bào thường phục | ✓ | ✓ | | |
| Pháp y / giáng y chủ lễ | | | ✓ | |
| Liên hoa quan | | ✓ (giới luật Toàn Chân) | ✓ | |
| Ngũ nhạc quan | | | ✓ | |
| Ca-sa | | | ✓ | |
| Áo tràng | | ✓ (dự lễ Bút Tháp) | ✓ | |
| Y Tạng | | | ✓ (sau tham vấn) | |
| Áo mũ tiến sĩ | | ✓ (đỗ đình thí) | ✓ | |
| Trang phục dân tộc (Miêu cảm hứng) | | ✓ (quà kết nghĩa) | ✓ | |
| Kiếm gỗ đào, phất trần, quạt | ✓ | | ✓ | |
| Lệnh bài, pháp ấn, kiếm bảy sao | | | ✓ | |
| Tràng hạt | | ✓ | ✓ | |
| Hình Phật, Bồ-tát, Tam Thanh trên đồ | | | | ✓ |
| Đài sen làm chỗ đứng | | | | ✓ (thay bằng «Hà Diệp Chu») |
| Vầng hào quang sau đầu | | | | ✓ |

## 4. Luật thiết kế trang phục bán (Tàng Y Các)

| # | Luật |
|---|---|
| 4.1 | **Không mang tên, hình vật thiêng** (ma trận §3). |
| 4.2 | **Không chữ thật trên đồ** trừ chữ được biên tập Hán duyệt (vd «道» trên quạt). |
| 4.3 | **Kích thước:** vật sau lưng ≤ 1,6 × chiều rộng vai; lông trĩ ≤ 1,2 m; không chắn tầm nhìn camera người khác. |
| 4.4 | **Âm thanh:** đồ phát tiếng (chuông, lục lạc) tắt trong điện chính. |
| 4.5 | **Thời đại:** không đồ hiện đại (kính râm, tai nghe…), không logo thương hiệu thật. |
| 4.6 | **Cánh (Phượng Hỏa Dực, Tiên Hạc Dực):** vẽ như lông vũ thủy mặc / lụa mỏng, mép mờ, vỗ chậm (≤ 0,5 lần / giây khi đứng); **không** cánh thiên thần phương Tây (lông trắng dày, hình học đối xứng cứng); tự thu khi vào điện chính. |
| 4.7 | **Hào quang, vệt bước:** tuân ngân sách VFX §5.3; tắt trong Phong Đô. |
| 4.8 | **Bộ ngũ hành** dùng đúng 5 màu ngũ hành chuẩn §6.2, không neon. |
| 4.9 | **Mô tả món** không hứa công năng thật (phần 8 §2.4). |
| 4.10 | **Thử đồ** («Thử 20s» đã có) được dùng cho mọi món bán. |

## 5. Ngôn ngữ hiệu ứng (VFX)

### 5.1 Nguyên tắc

| # | Nguyên tắc | Nghĩa |
|---|---|---|
| V1 | **Hiệu ứng là khí, không là phép** | khói, lá, giọt nước, ánh kim, bụi — vật tự nhiên chuyển động có chủ đích; không cầu lửa, tia laze |
| V2 | **Không hướng vào người khác** | không hiệu ứng nào bắn ra phía người / NPC khác (T3, `VD-T3-21`) |
| V3 | **Thưởng là mực và ánh vàng mảnh** | nét mực, con dấu son, chữ hiện ra như viết (phần 6 §7.3) |
| V4 | **Phạt không có hiệu ứng ồn** | thất bại: gió nhẹ, mực loang nhỏ |
| V5 | **Chậm hơn ta nghĩ** | tốc độ hạt 30–60 % tốc độ của game hành động |
| V6 | **An toàn thị giác** | không nhấp nháy > 3 lần / giây; không chớp toàn màn; chế độ giảm chuyển động tắt hạt bay |

### 5.2 Gia trì nguyên tố (đã có — chuẩn hóa)

| Hành | Tên | Màu linh khí (`WX_GIATRI`) | Chuyển động (`effects.js › MOTE`) | Hào quang dưới chân | Vệt bước | Không được |
|---|---|---|---|---|---|---|
| Mộc | Thanh Mộc | `#58c46a` | lá non xoắn lên chậm quanh thân | vòng lá nhạt | lá rơi theo bước | thành cánh hoa (lẫn `aura_dao`) |
| Hỏa | Ly Hỏa | `#ff6a3c` | đốm lửa bốc lên, thu nhỏ dần | vòng than đỏ hồng | đốm tàn | lửa liếm thân (gợi thiêu) |
| Thổ | Hậu Thổ | `#d9a64a` | bụi vàng xoáy thấp sát đất | vòng cát mịn | dấu chân vàng mờ | bão cát |
| Kim | Canh Kim | `#f2e6b8` | lóe sáng ngắn, sắc | vòng ánh kim mảnh | vệt sáng ngắn | hình lưỡi kiếm |
| Thủy | Huyền Thủy | `#4f9cff` | giọt rơi và loang | vòng gợn nước | vệt nước bay hơi | sóng lớn; ban đêm chói (giảm 30 %) |

**Mốc cấp gia trì** (V2 §3.1): 2 hào quang · 4 linh khí · 6 vệt bước · 8 ngự kiếm · 10 pháp quang — khi chuyển sang cảnh giới, mốc ánh xạ theo tài liệu 09.

### 5.3 Ngân sách hiệu ứng

| Ngữ cảnh | Số hạt tối đa / nhân vật | Độ sáng phát xạ tối đa | Ghi chú |
|---|---|---|---|
| Ngoài trời, đi | 40 | 1,0 | |
| Ngoài trời, đứng yên | 60 | 1,2 | gia trì «thở» |
| Trong điện chính | 15 | 0,6 | hào quang thu nhỏ 50 %, vệt bước tắt |
| Phong Đô | 0 (gia trì tắt) | — | nơi tôn nghiêm |
| Đông người (> 20 người trong 30 m) | 20 | 0,8 | tự hạ để giữ khung hình |
| Chế độ giảm chuyển động | 0 hạt bay; giữ vòng tĩnh | 0,8 | |

### 5.4 Ký tự phù hư cấu (cho kết phù, cảnh, Định Mệnh Hội)

| Luật | Chi tiết |
|---|---|
| Nguồn | bộ ký tự do tài liệu 12 thiết kế riêng; **không** dựa trên phù thật, chữ Hán thật, chữ Phạn / Tạng |
| Cấu trúc | 5 phần đầu – thân – bụng – đảm – chân (`talisman-data › fu`) được biểu diễn bằng 5 nhóm nét hư cấu |
| Màu | chu sa `#b3261e` trên giấy vàng `#e6c35a` |
| Phù Định Mệnh Hội | cố ý **sai cấu trúc** (thiếu phần, đảo thứ tự) để người chơi đã học kết phù nhận ra |
| Âm Bài (Tà Lộ) | ký hiệu tím xám, nét gãy, không đối xứng — đối lập thị giác với phù chính |

### 5.5 Hiệu ứng theo truyền thống

| Truyền thống | Mô-típ VFX | Màu | Dùng khi | Không dùng |
|---|---|---|---|---|
| Đạo | mây cuộn, sao Bắc Đẩu nối nét, khói hương thẳng | lam, vàng nhạt, chu sa | lễ bái Đẩu, thụ lục, kết phù thành công | lôi điện đánh xuống |
| Thiền | một vòng tròn mực (viên tướng) vẽ chậm, lá tùng rơi | mực, lục tùng | kết thúc tọa thiền, công án | hào quang |
| Tịnh Độ | cánh sen mở, ánh vàng ấm từ dưới lên | vàng ấm, hồng sen | Cửu phẩm mở tầng, hồi hướng | tòa sen dưới chân người chơi |
| Mật (chờ) | cát màu tự xếp, rồi tan | 5 màu cát | mạn-đà-la | biểu tượng Mật thật |
| Nho | chữ mực hiện như viết, giấy cuộn | mực, đỏ dấu | đỗ khoa cử, đặt đạo hiệu | — |
| Âm ty | sương lam bò sát đất, đèn ma lam | lam ma, đỏ sẫm | Phong Đô | máu, xương |
| Tà Lộ | ánh tím xám rò rỉ từ Âm Bài; gia trì đậm hơn nhưng **méo** (nhịp thở lệch) | tím xám | đang dùng Âm Bài | đẹp lộng lẫy hơn chính lộ (phải hấp dẫn nhưng có «vết») |
| Hồi Đầu | gia trì trở lại nhịp đều, vệt tím tan thành giọt nước sạch | màu hành của người chơi | nhận danh hiệu | — |

### 5.6 Hiệu ứng hệ thống

| Sự kiện | Hiệu ứng | Thời lượng |
|---|---|---|
| Nhận Đạo Hạnh | nét mực vàng từ nhân vật lên góc Sổ | 0,6 s |
| Ghi việc thiện | con dấu son đóng lên trang Sổ (UI) | 0,35 s |
| Ghi việc ác | giọt mực đen loang nhỏ (UI) | 0,5 s |
| Lên cảnh giới | la bàn Mệnh Bàn xoay một vòng, vòng mới sáng; quanh nhân vật: hành Dụng thần nở một lần | 2,5 s |
| Tiên Thiên thôi tính (bậc 4) | cảnh cắt: vòng Tiên Thiên mờ, vòng Đạo Hạnh sáng (PS-02) | 6 s |
| Mở trạm đi nhanh | nét mực vẽ đường trên bản đồ | 1,2 s |
| Thiên Mệnh Bàn (sự kiện máy chủ) | vết nứt được lấp dần bằng ánh vàng theo tổng công đức | theo tiến độ |

## 6. Ngôn ngữ giao diện

### 6.1 Chất liệu giao diện

| Thành phần | Chất liệu gợi | Biến CSS hiện có |
|---|---|---|
| Nền bảng | sơn then | `--hq-night #14111c`, `--hq-ink #1d1822`, `--hq-card #221c27` |
| Đường kẻ | chỉ vàng mờ | `--hq-line #3a3040` |
| Giấy (Sổ, cuộn) | giấy dó | `--hq-paper #f3e7cf` |
| Chữ phụ | mực nhạt | `--hq-dim #b8a98f` |
| Nhấn | son, vàng, gỗ | `--hq-son #b3261e`, `--hq-gold #d6a84a`, `--hq-wood #6b3f26` |
| Phông | serif cho tiêu đề (Noto Serif), Noto Serif SC cho chữ Hán (`.hq-han`) | đã có |

### 6.2 Một bảng màu ngũ hành chuẩn (sửa lệch UI ↔ VFX, phần 3 §5)

Mỗi hành có **hai sắc độ** sinh từ cùng sắc tướng: **UI** (đặc, tương phản đủ với nền sơn then và giấy) và **khí** (sáng, cho phát sáng).

| Hành | UI (đề xuất thay `--wx-*`) | Khí (giữ `WX_GIATRI`) | Tương phản UI trên `--hq-card` | Biểu tượng kèm (không chỉ dựa vào màu) |
|---|---|---|---|---|
| Mộc | `#4fa463` | `#58c46a` | ≥ 4,5 : 1 (kiểm) | chữ 木 + hình lá |
| Hỏa | `#e0533f` | `#ff6a3c` | ≥ 4,5 : 1 | 火 + ngọn lửa |
| Thổ | `#c99a4a` | `#d9a64a` | ≥ 4,5 : 1 | 土 + hình núi |
| Kim | `#cfc8b8` | `#f2e6b8` | ≥ 4,5 : 1 | 金 + hình tròn |
| Thủy | `#6b9be0` (sáng hơn `#4b7cc7` hiện có để đạt tương phản trên nền tối) | `#4f9cff` | ≥ 4,5 : 1 | 水 + giọt |

Giá trị UI giữ gần `game.css` hiện có, chỉ đổi Thủy; đội UI đo lại tương phản thật (phần 14 §6).

### 6.3 Thành phần chữ ký

| Thành phần | Mô tả | Hành vi |
|---|---|---|
| **Mệnh Bàn** | la bàn tròn: tâm bốn trụ → vòng ngũ hành (5 cánh hoa theo `wx.pct`) → vòng Ngũ Duy → vòng Đặc Tính → vòng Phẩm căn ngoài cùng (bản sơ đồ §12) | chạm vòng nào cũng có «Vì sao?»; xoay bằng kéo |
| **Sổ** (Sổ Mệnh / Sổ Tu Học) | cuốn sổ giấy dó, thẻ chia: Mệnh Bàn · Mệnh Đồ · Sổ Công Quá · Cảnh giới · Tủ đồ | mở như lật trang, 0,35 s |
| **Mệnh Đồ** | tờ giấy lớn, 6 nút mực nối bằng nét bút; nút ưu tiên cao đậm hơn | nút đang làm có vòng chu sa |
| **Sổ Công Quá** | trang kẻ ô kiểu sổ công quá cách; việc thiện đóng dấu son, việc ác mực đen | không biểu đồ đỏ – xanh kiểu chứng khoán |
| **Thiên Bảng** | bảng gỗ hai cột (Tiên Thiên nhạt, Đạo Hạnh đậm) | cột Đạo Hạnh mặc định; «Vì sao?» công khai nếu người đó cho phép |
| **Hộp thoại** | dải giấy dưới màn, tên NPC trên ấn son nhỏ | 3 câu tối đa / lượt |
| **Lựa chọn** | thẻ giấy dọc, chữ serif | luôn có lựa chọn trung tính |
| **Thông báo** | một dòng mực trên mép giấy, tan sau 3 s | không âm thanh báo động |

### 6.4 Biểu tượng

- Bản hiện tại dùng **emoji** cho ô trang bị (`SLOTS`: 👘 👑 🗡️ …). Bản AAA thay bằng **biểu tượng nét mực** vẽ riêng, cùng độ dày nét, cùng ô 24 px; emoji hiển thị khác nhau trên từng hệ điều hành và có hình hiện đại lạc tông (vd 👑 vương miện kiểu phương Tây cho ô «mũ · trâm»).
- Biểu tượng không dùng hình thần, Phật, chữ Phạn.
- Mọi biểu tượng có nhãn chữ khi chạm giữ (trợ năng).

### 6.5 HUD ngoài trời

| Thành phần | Trạng thái mặc định | Ghi chú |
|---|---|---|
| Đồng hồ can chi (giờ, ngày) | góc trên, nhỏ | luôn hiện |
| Nhiệm vụ đang theo | một dòng | ẩn được |
| Bản đồ nhỏ | **tắt** | dẫn đường bằng cảnh (đèn, cờ, gió) như học từ phần 15 |
| Thanh Nguyên Khí | chỉ hiện khi đang tốn | — |
| Chế độ chụp ảnh | ẩn toàn bộ HUD | tư thế đôi (`YC-15`) |

### 6.6 Chuyển động giao diện

| Loại | Thời lượng | Đường cong |
|---|---|---|
| Mở / đóng bảng | 300–350 ms | ease-out nhẹ (giấy mở) |
| Chuyển thẻ Sổ | 250 ms | lật trang |
| Hiện chữ thoại | 38 ký tự / s | — |
| Con dấu son | 350 ms | rơi + dừng có nảy nhẹ 1 lần |
| Giảm chuyển động | mọi chuyển động → mờ dần 150 ms | — |

## 7. Tham chiếu bằng lời cho nhân vật và hiệu ứng

| Đối tượng | Tham chiếu | Lấy | Không lấy |
|---|---|---|---|
| Đạo sĩ | ảnh tư liệu đạo sĩ Toàn Chân ở quán lớn phương Bắc | màu lam, tất trắng, búi tóc gọn, dáng thẳng | trang phục sân khấu |
| Tăng ni Việt | ảnh tư liệu chùa Bắc Bộ | áo nâu, lam, tràng hạt, dáng khiêm | ca-sa dùng làm thời trang |
| Sĩ tử | tranh, ảnh cổ khoa cử Việt | áo the, khăn xếp | — |
| Gia trì | khói nhang trong nắng xiên, lá rơi trong gió núi, bụi vàng trong tia sáng cửa điện | vật tự nhiên | phép thuật màu neon |
| Âm ty | tranh Thập điện dân gian (tranh thờ) | dáng, màu đỏ đen | cảnh cực hình |
| Định Mệnh Hội | hình ảnh «thầy bói chợ» trong tranh châm biếm cổ | phô trương, rườm | nhại một nghề / tôn giáo thật |
