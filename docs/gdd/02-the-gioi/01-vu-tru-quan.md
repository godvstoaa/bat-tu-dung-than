# 02 · Phần 01 — Vũ trụ quan: Thiên · Địa · Nhân, Ngũ Hành, Can Chi, Thiên Mệnh Bàn

> Thuộc tài liệu «02 · Thế giới quan — kinh thánh thế giới». Chuẩn mã: `00-KINH-DIEN-CHUNG.md`.
> Phần này định nghĩa **luật vật lý** của Huyền Giới. Mọi tài liệu khác (cốt truyện, cơ chế, môi trường) phải tuân theo. Chỗ nào cần code mà chưa có, ghi «**(chưa có — cần làm)**».

---

## 1.0 Quy tắc Gương Kính — Huyền Giới và Nhân Gian

Đây là quy tắc nền để game nói về tôn giáo thật mà không bóp méo lịch sử thật.

### 1.0.1 Hai cõi

| Cõi | Là gì | Ai sống | Lịch sử |
|---|---|---|---|
| **Nhân Gian** 人間 | Thế giới thật của người chơi | Người thật, các bậc tổ sư lịch sử | Lịch sử thật. Game **không** viết lại. |
| **Huyền Giới** 玄界 | Đại lục hư cấu nổi giữa biển mây | Cư dân hư cấu, đạo sĩ, tăng ni, nho sinh hư cấu | Lịch sử hư cấu (phần 02), **song song** với Nhân Gian |

- Huyền Giới là «cõi gương» (鏡界 Kính giới): mọi giáo pháp chân chính ở Nhân Gian, khi đã thành hình, thì **ánh sáng của nó chiếu sang Huyền Giới** qua một con đường gọi là **Đăng Lộ** 燈路 (đường đèn).
- Người Huyền Giới **không gặp** các bậc tổ sư lịch sử. Họ nhận giáo pháp qua kinh văn trôi theo Đăng Lộ, qua giấc mộng truyền đăng, và qua những «khách lạc» từ Nhân Gian.
- Vì vậy, khi tài liệu này viết «Chính Nhất phái lập ở Long Hổ Sơn của Huyền Giới năm X», nghĩa là **một chi phái hư cấu** dựng đạo tràng ở Huyền Giới **sau khi** giáo pháp của Trương Đạo Lăng (nhân vật lịch sử) đã thành hình ở Nhân Gian. Người đứng đầu chi phái Huyền Giới là nhân vật hư cấu.

### 1.0.2 Bốn luật viết

1. **Người thật giữ đúng sử.** Tổ sư lịch sử (Lão Tử, Trương Đạo Lăng, Vương Trùng Dương, Trần Nhân Tông, Khổng Tử…) chỉ xuất hiện như **người của Nhân Gian**, được nhắc với niên đại và sự tích theo nguồn (`schools-data`, `daozang-data`). Không cho họ nói thoại mới, không gán việc họ chưa làm.
2. **Thần, Phật, Bồ Tát được thờ kính, không «đóng vai».** Không có cảnh thần Phật hiện ra ra lệnh hay chiến đấu. Họ hiện diện qua tượng, kinh, lễ, và qua lòng người. Ngoại lệ duy nhất: thần chức hư cấu của Âm ty game (Phán quan Thôi, sứ giả) — ghi rõ là vai hư cấu.
3. **Mọi vật, người, sự kiện hư cấu đều gắn nhãn** «[HƯ CẤU]» ở lần đầu xuất hiện trong codex (phần 07–10), để người chơi phân biệt được.
4. **Không có giáo phái nào «đúng nhất».** Đúng tinh thần `schools-data › ETHICS`: các đạo thống ngang hàng, khác pháp, cùng hướng thiện.

### 1.0.3 Vì sao chọn Gương Kính (lý do thiết kế)

- Giữ trụ cột **T6 · Tôn trọng**: lịch sử thật không bị game hóa.
- Cho phép **thế giới mở có lịch sử riêng** (phe phái, chiến tranh tư tưởng, Định Mệnh Hội) mà không đặt lời vào miệng người thật.
- Khớp tiền đề cốt truyện: lá số của người chơi là lá số **thật** ở Nhân Gian, «chiếu» sang Huyền Giới thành nhân vật (trụ cột **T1**). Người chơi chính là một «khách lạc» theo Đăng Lộ.

---

## 1.1 Tam Tài — Thiên, Địa, Nhân

Trong Huyền Giới, ba tầng 三才 Tam Tài (trời – đất – người) không phải ẩn dụ, mà là **ba tầng vật lý** của thế giới.

### 1.1.1 Bảng tổng

| Tầng | Trong Huyền Giới là | Thấy được ở đâu | Quy luật | Ánh xạ cơ chế / engine |
|---|---|---|---|---|
| **Thiên** 天 | Bầu trời sao, Bắc Đẩu, các luồng khí năm–tháng–ngày–giờ | Thiên Mệnh Bàn trên Sơn Môn; Đẩu Mẫu Điện (Trích Thiên Đỉnh); bầu trời đêm | Thiên **vận hành theo can chi thật** (năm, tháng, ngày, giờ) | `lunar-javascript`; `thaitue.js`; Thái Tuế Điện |
| **Địa** 地 | Đại lục nổi, long mạch, sông Huyền Hà, biển mây | Địa hình (`terrain.js › heightAt`); Phong Thủy Viên | Địa có **hình** (núi, nước) và **khí** (hướng, cung) | `terrain.js › REGIONS`, `RIVER`; `fs-cure` |
| **Nhân** 人 | Con người và sinh linh có tâm | Mọi NPC, người chơi | Nhân **có mệnh (quỹ đạo) nhưng tự tạo vận** | `chart.js › analyze()`; Sổ Công Quá |

Câu thường nghe trong Huyền Giới (lời dân gian [HƯ CẤU], tóm ý *Liễu Phàm tứ huấn*):

> «Trời cho cái khung, đất cho cái chỗ, người tự viết chữ vào khung.»

### 1.1.2 Thiên — bầu trời của Huyền Giới

- **Bắc Thần** 北辰: sao Bắc Cực đứng yên ở thiên đỉnh phía Bắc (−Z). Mọi la bàn trong game lấy nó làm chuẩn. Người Huyền Giới gọi đây là «chỗ Tử Vi Đại Đế ngự» (theo tín ngưỡng Tử Vi Bắc Cực, xem LORE-005).
- **Bắc Đẩu Thất Tinh** quay quanh Bắc Thần, **chuôi Đẩu** chỉ mùa: chỉ Đông là xuân, chỉ Nam là hạ, chỉ Tây là thu, chỉ Bắc là đông (quan niệm cổ «斗柄指東，天下皆春»). Trong game, chuôi Đẩu trên bầu trời đêm **xoay theo tháng thật** — người chơi nhìn trời biết mùa. **(chưa có — cần làm: skybox xoay theo tháng tiết khí)**.
- **Hai mươi tám tú** chia trời thành bốn cung: Thanh Long (Đông), Chu Tước (Nam), Bạch Hổ (Tây), Huyền Vũ (Bắc). Bốn thánh địa ở bốn hướng mang dấu ấn bốn cung (xem 1.2.5).
- **Thiên Mệnh Bàn** (1.4) là «tấm gương» phản chiếu vận hành của tầng Thiên xuống tầng Địa để người đọc được.

### 1.1.3 Địa — đại lục nổi

- **Hình thể.** Huyền Giới là một khối đất tròn đường kính khoảng 2 km lõi (`WORLD = 2048`), từ bán kính 960 m (`EDGE`) đất đổ dốc xuống **biển mây** (`CLOUD_SEA = −70`). Bản đồ mở rộng tới ±2.000 m cho 12 thánh địa (canon §3) — đất ở đó là **các «vai» của đại lục** nhô ra biển mây, nối bằng đèo, cầu và bến đò mây.
- **Ba tầng độ cao**:
  - *Vân hải* (dưới −70 m): biển mây, không đi bộ được; đò mây và hạc bay qua.
  - *Bình địa* (−24 m đến 120 m): Huyền Thành (0 m), hồ Cùng Thông (−24 m), Thư Lâu Lâm (110 m), hai cao nguyên Phong Thủy Viên và Lịch Đường (55 m).
  - *Sơn đỉnh* (≥ 300 m): Tử Bình Phong (420 m), Trích Thiên Đỉnh (380 m), Manh Phái Cốc (thung lũng giữa vách 300 m), và các thánh địa núi.
  - *Thiên tầng*: Thiên Bàn Đảo (`SKY_ISLAND`, cao 520 m) và Côn Lôn Thiên Trì (đảo trời, canon: cao 260 m trên vùng 0, −900).
- **Long mạch** 龍脈. Theo lối nói phong thủy hình thế (*Thanh Nang Kinh*, *Tuyết Tâm Phú* — LORE-171, LORE-172), khí đất chạy theo sống núi như rồng. Huyền Giới có:
  - **Tổ sơn**: Côn Lôn (phương Bắc, trên trời) — khí từ trời rót xuống đất ở đây.
  - **Ba đại cán long**: *Tây cán* (Côn Lôn → Tạng Địa → Tử Bình Phong → Phong Thủy Viên → Phong Đô), *Trung cán* (Côn Lôn → Võ Đang → Thư Lâu Lâm → Huyền Thành → Văn Miếu), *Đông cán* (Côn Lôn → Chung Nam → Manh Phái Cốc → Lịch Đường → Long Hổ → Mao Sơn).
  - **Thủy khẩu**: sông **Huyền Hà** (`terrain.js › RIVER`) chảy từ Trích Thiên Đỉnh vòng phía Tây Huyền Thành rồi đổ vào **Cùng Thông Hồ** ở Đông Nam. Phong thủy gia Huyền Giới gọi thế này là «thủy nhiễu Huyền Thành» (nước ôm thành) — lý do Huyền Thành giàu khí.
- **Đất có trí nhớ.** Quan niệm Huyền Giới [HƯ CẤU]: nơi có nhiều việc thiện thì đất «ấm», cây tốt; nơi lừa lọc nhiều thì đất «lạnh», cỏ héo. Đây là cơ sở cơ chế **khí đất vùng** (Địa Khí, 0–100) tăng giảm theo tổng công đức người chơi làm ở vùng đó. **(chưa có — cần làm; tài liệu 05/11 định số)**.

### 1.1.4 Nhân — mệnh là quỹ đạo

- Mỗi người sinh ra mang **tám chữ** (bát tự) — vị trí của tầng Thiên lúc người ấy chào đời. Bát tự là **khung**, không phải bản án.
- Huyền Giới dạy theo `remedy-fate › LIAOFAN_STORY`: «Mệnh = **quỹ đạo** (đường lối hiện tại), **không phải kết cục**», và chuỗi gốc **tâm → niệm → hành → nghiệp → mệnh** (`rootChain`).
- Ba trường phái quan niệm về «Nhân» cùng tồn tại trong thế giới, tạo xung đột tư tưởng của cốt truyện:

| Quan niệm | Ai giữ | Phát biểu | Vai trong game |
|---|---|---|---|
| **Định mệnh luận** | Khổng tiên sinh (thành thật), Định Mệnh Hội (lợi dụng) | «Mệnh đã an, đoán đúng thì sống đúng.» | Phản đề (canon T2) |
| **Tri mệnh – lập mệnh** | Thầy Tử Bình, Sơn Môn | «Biết khung để biết chỗ cần sửa.» | Lập trường chính của Sơn Môn |
| **Tạo mệnh** | Vân Cốc thiền sư, các đạo thống | «Mệnh do tâm tạo, phúc do mình cầu.» | Đích đến của người chơi |

### 1.1.5 Ba cõi theo chiều dọc

| Cõi | Vị trí trên bản đồ | Ai cai quản | Đi vào bằng |
|---|---|---|---|
| **Thượng** (Thiên Trì) | Côn Lôn Thiên Trì (đảo trời) | Không ai «cai quản»; nơi Thiên Mệnh Bàn được hoàn nguyên | Cầu mây, mở khi «Quy nhất» (canon §6) |
| **Trung** (Huyền Giới) | Toàn bộ đại lục | Không có vua. Các đạo thống, hương ước, hội đồng Huyền Thành | Đi bộ |
| **Hạ** (Âm ty) | Phong Đô Quỷ Thành (−1500, 0), **đi xuống dốc** | Thập Điện (vai hư cấu theo truyền thuyết), Địa Tạng sứ giả | Quỷ Môn Quan; đường một chiều, lối ra duy nhất là **đi lên** |

- **Huyền Giới không có vua.** Đây là chọn lựa thiết kế: không có triều đình để tránh trục «quyền lực – chiến tranh». Trật tự xã hội dựa trên **hương ước** của từng vùng, **Hội Đồng Tam Tài** ở Huyền Thành (FAC-001 làm chủ trì), và uy tín đạo thống.
- **Âm ty trong game là «cõi soi xét», không phải «cõi trừng phạt».** Theo `liudao › SIX_REALMS`, các cõi là **khuynh hướng của tâm** và đều có đường chuyển hóa (`remedy`). Phong Đô là nơi người ta đối diện việc mình đã làm (canon §6: Tà Lộ → Phong Đô → Hồi Đầu).

---

## 1.2 Ngũ Hành vận hành — luật vật lý của Huyền Giới

### 1.2.1 Nguyên lý

Ở Huyền Giới, 五行 Ngũ Hành (năm pha vận động: Mộc, Hỏa, Thổ, Kim, Thủy) là **năm trạng thái của khí**. Mọi vật đều mang tỉ lệ năm hành; vật đổi thì tỉ lệ đổi.

- **Tương sinh** 相生: Mộc → Hỏa → Thổ → Kim → Thủy → Mộc.
- **Tương khắc** 相剋: Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc.
- **Thừa** 乘 (khắc quá mức) và **Vũ** 侮 (khắc ngược): khi một hành quá vượng, nó khắc ngược hành vốn khắc nó (vd Mộc quá vượng thì «vũ» Kim — gỗ quá cứng làm mẻ rìu).
- **Vượng – Tướng – Hưu – Tù – Tử** theo mùa (nguyệt lệnh): hành của mùa vượng, hành mùa sinh ra thì tướng… Đây là lý do cùng một hoạt động có hiệu quả khác nhau theo tháng.

### 1.2.2 Bảng thuộc tính chuẩn (dùng cho mọi tài liệu)

| Hành | Phương | Mùa | Màu | Tạng / phủ (`tcm › WUX_ZANG`) | Vị | Chí | Số Hà Đồ | Quẻ hậu thiên | Chỉ số người chơi (canon §5) |
|---|---|---|---|---|---|---|---|---|---|
| **Mộc** 木 | Đông | Xuân | xanh lục | Gan / Mật | chua | giận | 3, 8 | Chấn, Tốn | **Sinh Cơ** |
| **Hỏa** 火 | Nam | Hạ | đỏ | Tim / Tiểu trường | đắng | vui | 2, 7 | Ly | **Nhiệt Tâm** |
| **Thổ** 土 | Trung ương | Trường hạ (tháng Tứ quý) | vàng | Tỳ / Vị | ngọt | lo nghĩ | 5, 10 | Khôn, Cấn | **Định Lực** |
| **Kim** 金 | Tây | Thu | trắng | Phổi / Đại trường | cay | buồn | 4, 9 | Càn, Đoài | **Tuệ Kiếm** |
| **Thủy** 水 | Bắc | Đông | đen / lam thẫm | Thận / Bàng quang | mặn | sợ | 1, 6 | Khảm | **Linh Tuệ** |

> Ghi chú an toàn: bảng tạng phủ chỉ dùng làm **màu sắc thế giới** (thức ăn vùng, dược thảo, lời NPC vu y). Không chẩn bệnh (canon T6; `anti-manipulation-data › RB1`).

### 1.2.3 Ngũ Hành biểu hiện thành vật lý thế giới

Mỗi hành có **dấu hiệu nhìn – nghe – chạm** để đội môi trường và âm thanh làm thống nhất.

#### Mộc — sinh trưởng, gió, vươn

- *Nhìn:* cây đâm chồi rõ theo mùa; dây leo bò lên tường cũ; ánh sáng xanh lục pha trong sương sớm.
- *Nghe:* tiếng gió qua rừng trúc, tiếng lá; nhạc cụ tre (sáo, đàn tre).
- *Chạm (vật liệu):* gỗ, tre, giấy, dây mây.
- *Luật thế giới:* vùng Mộc vượng cây mọc nhanh — điểm hái thảo dược Mộc (kỷ tử, rau má — `WUX_ZANG.木.nourish`) **làm mới nhanh hơn**. Lửa lan nhanh hơn ở vùng Mộc vượng (Mộc sinh Hỏa) → vùng rừng cấm đốt hương ngoài trời mùa xuân.
- *Hiện tượng đặc trưng:* **Phong Ngâm** (gió xuân kéo dài, mang phấn hoa); **Tân Lục** (sáng sớm, cả rừng đổi sắc trong vài phút).

#### Hỏa — nhiệt, ánh sáng, bốc lên

- *Nhìn:* nắng gắt, bóng đổ ngắn, ánh chiều đỏ; đèn lồng, hương khói bốc thẳng.
- *Nghe:* tiếng ve, tiếng lửa lò, trống lễ.
- *Chạm:* lửa, sáp, gạch nung, gốm.
- *Luật thế giới:* lò đan (Võ Đang), lò gốm, lò rèn hoạt động hiệu quả nhất giờ Ngọ và tháng Hỏa. Hỏa vượng thì nước bốc hơi nhanh: hồ Cùng Thông **hạ mực nước** nhẹ cuối hạ **(chưa có — cần làm: mực nước động)**.
- *Hiện tượng đặc trưng:* **Hỏa Vân** (mây ráng đỏ kéo dài sau hoàng hôn); **Đăng Hà** (những ngày lễ Hỏa, đèn lồng trôi trên sông Huyền Hà).

#### Thổ — ổn định, chứa đựng, hóa

- *Nhìn:* đồng ruộng vàng, tường đất nện, bụi vàng trong nắng; sương mù đọng thung lũng.
- *Nghe:* tiếng chày giã, tiếng bước chân trên đất nện, chuông đồng trầm.
- *Chạm:* đất, đá, gạch mộc, gốm thô.
- *Luật thế giới:* Thổ là **«chỗ chuyển giao»** giữa các mùa (mười tám ngày cuối mỗi mùa thuộc Thổ). Các ngày này trong game là **ngày chuyển mùa**: thời tiết dịu, NPC chợ phiên họp. Huyền Thành ở trung tâm mang tính Thổ: an toàn, trung hòa, ít biến thiên thời tiết.
- *Hiện tượng đặc trưng:* **Hoàng Vụ** (sương vàng ở các ngày chuyển mùa); **Địa Minh** (đất rung khẽ — chỉ ở Phong Đô, báo giờ mở cửa Quỷ Môn).

#### Kim — thu lại, sắc, vang

- *Nhìn:* trời thu trong vắt, đường nét sắc, ánh trăng bạc; kim loại lấp lánh.
- *Nghe:* chuông, khánh, tiếng kiếm, tiếng chim nhạn.
- *Chạm:* đồng, sắt, bạc, đá ngọc.
- *Luật thế giới:* Kim vượng thì âm thanh truyền xa: **chuông các chùa nghe được từ xa hơn** vào mùa thu **(chưa có — cần làm: bán kính âm thanh theo mùa)**. Kim khắc Mộc: mùa thu lá rụng, điểm hái dược Mộc thưa đi, điểm hái Kim (bách hợp, lê — `WUX_ZANG.金.nourish`) dày lên.
- *Hiện tượng đặc trưng:* **Sương Kiếm** (sương muối đọng thành gai bạc trên cỏ ở Tạng Địa và Tử Bình Phong); **Nguyệt Hoa** (đêm trăng thu, mặt hồ sáng như gương).

#### Thủy — chảy xuống, lạnh, ẩn

- *Nhìn:* mưa, sương, tuyết; mặt nước phẳng phản chiếu; trời xám lam.
- *Nghe:* tiếng mưa, suối, sóng hồ, tiếng mõ gõ đêm.
- *Chạm:* nước, băng, mực, muối.
- *Luật thế giới:* sông Huyền Hà dâng mùa mưa, hạ mùa khô; **bến đò** mở thêm chuyến khi nước lên. Thủy khắc Hỏa: ngày mưa lớn, lò đan và lò gốm ngoài trời tạm nghỉ; nghề trong nhà (chép kinh, đọc sách) được lợi.
- *Hiện tượng đặc trưng:* **Vân Hải Triều** (biển mây dâng lên che vai các thánh địa thấp vào đông); **Mặc Vũ** (mưa phùn đen nhạt ở Thư Lâu Lâm — dân gian bảo «mực trời rơi», thực ra là tro thông).

### 1.2.4 Ngũ Hành giữa người và thế giới

Đây là chỗ thế giới «chạm» vào lá số người chơi.

| Quan hệ | Ví dụ | Hiệu ứng trong game | Engine |
|---|---|---|---|
| Hành của **ngày** là **Dụng thần / Hỷ thần** của người chơi | Ngày Nhâm Quý (Thủy) với `MAU-A` (Dụng Thủy) | Hoạt động tu hợp hành ngày được thêm hiệu quả (tài liệu 09 định số) | `yong.primary`, `yong.xi`; lịch ngày (đã có) |
| Hành của **ngày** là **Kỵ thần** | Ngày Bính Đinh (Hỏa) với `MAU-A` | Không phạt. Hiện gợi ý «ngày nên tĩnh» + nhiệm vụ nhỏ «dưỡng tâm» | `yong.ji` |
| **Vùng** cùng hành với Dụng thần | `MAU-A` đến Thư Lâu Lâm (Khảm – Thủy) | Vùng «hợp mệnh»: NPC thân thiện hơn một bậc, hồi Nguyên Khí nhanh hơn khi nghỉ ở quán trọ | `yong`, bảng 1.2.5 |
| **Mùa** khắc Dụng thần | Mùa hạ với người Dụng Thủy | Chuỗi nhiệm vụ «điều hậu» ở Cùng Thông Hồ được gợi ý | Sảnh Điều Hậu (đã có) |

Nguyên tắc: **thế giới chỉ thưởng, không phạt** theo lá số (trụ cột T2). Kỵ thần làm ngày «khó hơn» chứ không làm người chơi yếu đi.

### 1.2.5 Cửu Cung Huyền Giới — vùng theo hướng và hành

Lấy Huyền Thành làm trung cung, trục Bắc = −Z, Đông = +X (`terrain.js`). Các vùng xếp gần đúng theo **hậu thiên bát quái**. Đây là lý do lore cho mỗi vùng mang khí riêng.

| Cung (quẻ) | Hướng | Hành | Vùng cũ (8) | Thánh địa (12) | Ý nghĩa trong lore |
|---|---|---|---|---|---|
| **Trung cung** | tâm | Thổ | Huyền Thành `thanh` | Am Vân Cốc `vancoc` (núi sau, 0, −260) | Nơi hội tụ, trung hòa; mọi đường về đây |
| **Khảm** ☵ | Bắc | Thủy | Thư Lâu Lâm `thulau` | Võ Đang `vodang`; Côn Lôn `conlon` (đảo trời) | Trí, tàng, Huyền Vũ (thần phương Bắc) trấn Võ Đang |
| **Cấn** ☶ | Đông Bắc | Thổ | Manh Phái Cốc `manh` | Chung Nam `chungnam` | «Dừng» — giới luật, ẩn tu, im lặng của thầy mù |
| **Chấn** ☳ | Đông | Mộc | Lịch Đường `lichduong` | Long Hổ `longho` | Sấm, khởi đầu — lôi pháp Thần Tiêu, lịch pháp mở năm |
| **Tốn** ☴ | Đông Nam | Mộc | Cùng Thông Hồ `cungthong` | Mao Sơn `maoshan` | Gió, thấm vào — rừng trúc, sương, điều hậu |
| **Ly** ☲ | Nam | Hỏa | — | Văn Miếu `vanmieu`; Yên Tử `yentu` (Nam lệch Tây); Bút Tháp `buttap` (Nam lệch Đông) | Văn minh, sáng — khoa cử, đèn hoa đăng, tâm sáng |
| **Khôn** ☷ | Tây Nam | Thổ | Trích Thiên Đỉnh `trichthien` | Miêu Cương `mieucuong` | Mẹ đất, nuôi dưỡng — Đẩu Mẫu, vu y, dược thảo |
| **Đoài** ☱ | Tây | Kim | Phong Thủy Viên `phongthuy` | Phong Đô `phongdo` | Thu lại, kết thúc — phong thủy âm trạch, Âm ty |
| **Càn** ☰ | Tây Bắc | Kim | Tử Bình Phong `tubinh` | Tạng Địa `tangdia` | Trời, cao, cương — thầy Tử Bình định cách; cao nguyên tuyết |

Quy tắc dùng: khi một tài liệu cần «khí» của một vùng (màu ánh sáng, nhạc nền, thức ăn, dược thảo), lấy hành của cung ở bảng này làm gốc rồi pha thêm khí hậu thực tế của vùng (phần 03–05).

### 1.2.6 Ca biên của luật Ngũ Hành

| Tình huống | Xử lý |
|---|---|
| Người chơi lá số **Tòng cách / Dị cách** (Dụng thần là hành vượng nhất) | Bảng 1.2.4 lấy theo `yong` của engine, **không tự suy** «hành yếu là Dụng». Không bịa công thức (T1, T5). |
| Ngày **Mậu Kỷ** (Thổ) ở vùng Thổ (Huyền Thành) | Không cộng dồn vô hạn: mỗi lớp thưởng có trần (tài liệu 09). |
| Vùng không có trong bảng (đường liên vùng) | Lấy hành của cung gần nhất theo khoảng cách tới tâm vùng. |
| iOS tắt tính năng bói (`features.js`) | Luật vật lý thế giới (thời tiết, mùa) **vẫn chạy**; chỉ ẩn phần gợi ý theo Dụng thần. |

---

## 1.3 Can Chi là thời gian và thời tiết

### 1.3.1 Đồng hồ Huyền Giới = đồng hồ thật

- **Năm** đổi ở **Lập Xuân** (không phải mùng 1 Tết). Cách tính đã có ở `src/game/thaitue.js` («trước Lập Xuân vẫn là năm can chi cũ»).
- **Tháng** đổi ở **tiết** (12 tiết đầu tháng), theo lịch tiết khí (`chart.jieqi`, `cases.js` ghi: «tháng theo tiết khí»).
- **Ngày** theo lịch vạn niên (`lunar-javascript`).
- **Giờ** theo **12 canh**, mỗi canh hai tiếng (giờ Tý 23:00–00:59…). Giờ trong ngày lấy theo **giờ máy người chơi** cho phần trải nghiệm cá nhân; phần thế giới chung (MMO) lấy theo **«giờ Huyền Thành»** = UTC+7 để mọi người cùng thấy một bầu trời **(chưa có — cần làm: đồng hồ thế giới, chu kỳ ngày đêm)**.

> Hiện game chưa có chu kỳ ngày đêm theo giờ thật (`lights.js` không đọc giờ). Mục này là đặc tả mới.

### 1.3.2 Huyền Lịch — cách người Huyền Giới đếm năm

- Người Huyền Giới đếm năm theo **Hoa Giáp** (vòng 60 năm can chi). **Hoa Giáp thứ 1 bắt đầu năm Giáp Tý = năm 4 Công nguyên** (năm 4 CN đúng là năm Giáp Tý). Vậy:
  - Hoa Giáp thứ *n* bắt đầu năm **4 + 60 × (n − 1)**.
  - Năm Giáp Tý 1984 mở **Hoa Giáp thứ 34**; năm 2026 là **năm Bính Ngọ, thứ 43 của Hoa Giáp 34**.
- Cách ghi chuẩn trong văn bản game: «**Giáp 34 · Bính Ngọ**» (đọc: Hoa Giáp ba mươi tư, năm Bính Ngọ).
- Thời trước Hoa Giáp 1 là **Kỷ Hồng Mông**, không đếm năm (phần 02).

| Hoa Giáp | Năm dương lịch | Ghi chú lore |
|---|---|---|
| 1 | 4 – 63 | Năm khởi đếm; Huyền Thành dựng Bàn Đài (HIS-031) |
| 3 | 124 – 183 | Đăng Lộ đưa giáo pháp Chính Nhất sang (sau năm 142 ở Nhân Gian) |
| 7 – 9 | 364 – 543 | Thượng Thanh, Linh Bảo, Đào Hoằng Cảnh — «Tam Kinh nhập giới» |
| 19 – 20 | 1084 – 1203 | Thần Tiêu, Toàn Chân, Công Quá Cách |
| 22 | 1204 – 1263 | Đạo tràng Toàn Chân Huyền Giới mở rộng |
| 22 – 23 | 1264 – 1323 | Đăng Lộ Trúc Lâm (sau năm 1299 ở Nhân Gian) |
| 27 | 1504 – 1563 | Tam Mệnh Thông Hội nhập Thư Lâu |
| 27 – 28 | 1564 – 1623 | Liễu Phàm tứ huấn nhập giới — mầm của cuộc tranh luận «định mệnh» |
| 34 | 1984 – 2043 | Kỷ Bàn Nứt; Vận 9 từ 2024 |

### 1.3.3 Tam Nguyên Cửu Vận — «mùa lớn» của thế giới

Phong thủy huyền không chia thời gian thành 3 nguyên × 3 vận × 20 năm = 180 năm. Chu kỳ hiện tại bắt đầu năm 1864.

| Nguyên | Vận | Năm | Quẻ | Hành | Lore Huyền Giới |
|---|---|---|---|---|---|
| Thượng | 1 · 2 · 3 | 1864 – 1923 | Khảm · Khôn · Chấn | Thủy · Thổ · Mộc | Thời yên bình, Thư Lâu chép lại cổ thư |
| Trung | 4 · 5 · 6 | 1924 – 1983 | Tốn · (Trung) · Càn | Mộc · Thổ · Kim | Thời các sảnh nghề lập quy chế |
| Hạ | 7 | 1984 – 2003 | Đoài | Kim | «Vận miệng lưỡi» (Đoài là miệng): thầy bói chợ mọc khắp nơi |
| Hạ | 8 | 2004 – 2023 | Cấn | Thổ | «Vận dừng»: hội kín họp trong núi — Định Mệnh Hội thành hình |
| Hạ | **9** | **2024 – 2043** | **Ly** | **Hỏa** | **Vận hiện tại.** Ly là ánh sáng, là mắt: Thiên Mệnh Bàn nứt **đúng đêm giao vận** (Lập Xuân 2024), «ánh sáng lọt qua kẽ nứt» |

- Ý nghĩa thiết kế: **Vận 9 là vận «soi sáng»**. Toàn bộ cốt truyện là quá trình người chơi «soi» ra sự lừa dối của Định Mệnh Hội — khớp chủ đề Ly Hỏa (sáng, nhìn rõ).
- Phong Thủy Viên dùng Cửu Vận thật để luận dương trạch; lore và cơ chế cùng một con số.

### 1.3.4 Năm — Thái Tuế trị niên

- Mỗi năm có một vị **Trị niên Thái Tuế** trong 60 vị (`taisui-general › TAISUI_60`; năm 2026 Bính Ngọ là **Văn Triết** đại tướng quân). Tượng vị trị niên **đổi chỗ trên bệ chính** của Thái Tuế Điện vào giờ Lập Xuân.
- Trong thế giới: dân các vùng treo **cờ năm** màu theo hành nạp âm của năm (2026 Bính Ngọ — nạp âm 天河水 Thiên Hà Thủy → cờ lam). Codex 60 vị: LORE-201 đến LORE-260.
- Năm người chơi phạm Thái Tuế (trị, xung, phá, hại, hình — `taisui.js`) mở chuỗi «Năm Hạn» (canon: Hồi III). Thế giới không «phạt»: các NPC gợi ý an Thái Tuế, đi đường tránh hướng Thái Tuế khi khởi công.

### 1.3.5 Tháng — 24 tiết khí và khí hậu Huyền Giới

Bảng dưới là **lịch khí hậu chung**. Mỗi vùng còn hệ số riêng (phần 03–05). Ngày dương lịch là gần đúng (±1 ngày, engine tính chính xác).

| # | Tiết khí | ~Ngày | Tháng can chi | Hiện tượng chung ở Huyền Giới | Sự kiện thế giới gắn kèm |
|---|---|---|---|---|---|
| 1 | Lập Xuân 立春 | 4/2 | Dần (đầu) | Băng sông Huyền Hà vỡ thành mảng; chim én đầu tiên | Đổi Trị niên Thái Tuế; chợ Xuân Huyền Thành |
| 2 | Vũ Thủy 雨水 | 19/2 | Dần | Mưa phùn, sương mù sáng | Vu y Miêu Cương đi hái chồi non |
| 3 | Kinh Trập 驚蟄 | 6/3 | Mão (đầu) | Sấm đầu năm, côn trùng tỉnh | Thần Tiêu viện (Long Hổ) mở «lễ nghe sấm» |
| 4 | Xuân Phân 春分 | 21/3 | Mão | Ngày đêm bằng nhau; hoa đào nở rộ | Lịch Đường đo bóng nắng (Khuê biểu) |
| 5 | Thanh Minh 清明 | 5/4 | Thìn (đầu) | Trời trong, gió nhẹ | Tảo mộ; đèn trên sông nhớ người khuất |
| 6 | Cốc Vũ 穀雨 | 20/4 | Thìn | Mưa xuân lớn; chè Mao Sơn hái lứa ngon | Lễ chè Mao Sơn |
| 7 | Lập Hạ 立夏 | 6/5 | Tỵ (đầu) | Nắng ấm lên; sen nhú lá | Bút Tháp chuẩn bị Phật đản |
| 8 | Tiểu Mãn 小滿 | 21/5 | Tỵ | Hạt lúa căng sữa | Chợ lúa Bút Tháp |
| 9 | Mang Chủng 芒種 | 6/6 | Ngọ (đầu) | Mưa dầm, gieo mạ | Ferrymen thêm chuyến (nước lên) |
| 10 | Hạ Chí 夏至 | 21/6 | Ngọ | Ngày dài nhất, nắng gắt | Lò đan Võ Đang khai hỏa lớn |
| 11 | Tiểu Thử 小暑 | 7/7 | Mùi (đầu) | Nóng ẩm, ve kêu | Phơi kinh ở Thư Lâu (lễ «sái thư») |
| 12 | Đại Thử 大暑 | 23/7 | Mùi | Nóng nhất; giông chiều | Cùng Thông Hồ mở lễ «điều hậu» |
| 13 | Lập Thu 立秋 | 7/8 | Thân (đầu) | Gió đổi hướng, chiều mát | Chuẩn bị Trung Nguyên |
| 14 | Xử Thử 處暑 | 23/8 | Thân | Hết nóng, trời cao | Phong Đô mở Quỷ Môn (tháng 7 âm lịch thường rơi quanh đây) |
| 15 | Bạch Lộ 白露 | 8/9 | Dậu (đầu) | Sương trắng đọng cỏ | Chim nhạn bay về Nam qua Tạng Địa |
| 16 | Thu Phân 秋分 | 23/9 | Dậu | Ngày đêm bằng nhau; trăng sáng | Trung thu (rằm tháng 8 âm) gần đây |
| 17 | Hàn Lộ 寒露 | 8/10 | Tuất (đầu) | Sương lạnh; lá phong Miêu Cương đỏ | Trùng Cửu — bái Đẩu ở Đẩu Mẫu Điện (9/9 âm) |
| 18 | Sương Giáng 霜降 | 23/10 | Tuất | Sương muối đầu mùa | Thu hoạch dược thảo Kim, Thủy |
| 19 | Lập Đông 立冬 | 7/11 | Hợi (đầu) | Gió bấc đầu mùa | Hạ Nguyên (rằm tháng 10 âm) ở Cùng Thông Hồ |
| 20 | Tiểu Tuyết 小雪 | 22/11 | Hợi | Tuyết đầu ở Tạng Địa, Chung Nam | Toàn Chân «vân thủy đường» đóng bớt |
| 21 | Đại Tuyết 大雪 | 7/12 | Tý (đầu) | Tuyết dày trên đỉnh | Mạn-đà-la cát mùa đông ở Tạng Địa |
| 22 | Đông Chí 冬至 | 22/12 | Tý | Đêm dài nhất | «Nhất dương sinh»: Võ Đang tĩnh tọa suốt đêm |
| 23 | Tiểu Hàn 小寒 | 6/1 | Sửu (đầu) | Rét đậm | Bố thí áo ấm (sự kiện công đức) |
| 24 | Đại Hàn 大寒 | 20/1 | Sửu | Rét nhất; hoa mai nở | Chuẩn bị Tết, tiễn Táo Quân (23 tháng Chạp âm) |

Lưu ý: các lễ theo **âm lịch** (Tết, rằm, Vu Lan…) trôi so với tiết khí. Lịch lễ đầy đủ ở phần 11.

### 1.3.6 Ngày — «khí ngày» theo thiên can

Mỗi ngày mang một thiên can; hành của can tô màu cho cả ngày trên toàn thế giới.

| Can ngày | Hành (âm/dương) | Sắc trời & ánh sáng | Âm thanh nền | Hành vi NPC | Hoạt động được gợi ý |
|---|---|---|---|---|---|
| Giáp 甲 | Mộc dương | Trời trong, nắng xiên xanh | Gió rừng mạnh | Thợ mộc mở xưởng; người dân trồng cây | Khởi đầu việc mới, nhận đệ tử |
| Ất 乙 | Mộc âm | Sương mỏng, nắng dịu | Lá xào xạc | Vu y đi hái thuốc | Học, chép kinh, cắm hoa |
| Bính 丙 | Hỏa dương | Nắng gắt, bóng sắc | Ve, trống | Chợ đông nhất; lò đan đỏ lửa | Lễ hội, gặp gỡ, giảng đạo |
| Đinh 丁 | Hỏa âm | Chiều ráng đỏ, đêm nhiều đèn | Tiếng nến, mõ nhẹ | Đốt đèn cầu an | Thắp đèn, tụng kinh tối |
| Mậu 戊 | Thổ dương | Trời cao, bụi vàng | Chày giã, bước chân | Sửa đường, đắp đê | Xây dựng đạo tràng (môn phái) |
| Kỷ 己 | Thổ âm | Mây thấp, ấm | Tiếng gà, bếp | Gia đình quây quần | Nấu chay, chăm vườn, thăm người ốm |
| Canh 庚 | Kim dương | Trong vắt, gió khô | Chuông, tiếng rèn | Thợ rèn, thợ bạc làm việc | Luyện kiếm gỗ, Thái Cực |
| Tân 辛 | Kim âm | Mây trắng mỏng, ánh bạc | Khánh đá, nhạn | Thợ kim hoàn, người giữ giới | Giữ giới, sám hối, sửa lỗi |
| Nhâm 壬 | Thủy dương | Mưa rào hoặc sông dâng | Sóng, mưa | Ferrymen bận rộn | Hành hương bằng đò, phóng sinh |
| Quý 癸 | Thủy âm | Mưa phùn, sương đêm | Giọt nước, suối | Thư sinh ở trong nhà | Đọc sách, tĩnh tọa, thiền |

Địa chi của ngày thêm một lớp nhỏ: ngày **xung** chi năm của người chơi hiện gợi ý «tránh khởi sự lớn» (đã có trong lịch ngày). Ngày **Thiên Xá** (天赦日, theo lịch truyền thống) được làm **ngày đại xá** của thế giới: Phong Đô giảm thời gian sám hối, chợ Huyền Thành miễn thuế **(chưa có — cần làm; dùng hàm lịch có sẵn nếu engine hỗ trợ)**.

### 1.3.7 Giờ — mười hai canh và nhịp sống

| Canh | Giờ thật | Ánh sáng thế giới | Nhịp sống NPC | Sự kiện cố định |
|---|---|---|---|---|
| Tý 子 | 23–01 | Đêm sâu, sao rõ nhất | Phần lớn ngủ; đạo sĩ tĩnh tọa «tý thời» | Thiên Mệnh Bàn sáng mạnh nhất (vòng địa chi đi qua chữ Tý) |
| Sửu 丑 | 01–03 | Tối, sương bắt đầu | Thợ làm bánh dậy | — |
| Dần 寅 | 03–05 | Trời hửng xám | Tăng ni Yên Tử, Bút Tháp thức dậy | Chuông sớm chùa (tiếng «hô chuông» 108) |
| Mão 卯 | 05–07 | Bình minh | Chợ mở; đò đầu tiên | Tảo khóa (công khóa sớm) ở Chung Nam |
| Thìn 辰 | 07–09 | Nắng sớm | Học đường vào lớp | Thầy Tử Bình mở bàn ở Sơn Môn |
| Tỵ 巳 | 09–11 | Sáng rõ | Sảnh nghề đông khách | Văn Miếu khảo bài |
| Ngọ 午 | 11–13 | Nắng đỉnh | Nghỉ trưa, quán ăn đông | Lò đan khai hỏa |
| Mùi 未 | 13–15 | Nắng nghiêng | Làm nghề | Phiên chợ phiên (ngày Thổ) |
| Thân 申 | 15–17 | Chiều | Người hành hương về quán trọ | Khổng tiên sinh đứng bậc Sơn Môn |
| Dậu 酉 | 17–19 | Hoàng hôn | Đóng chợ, thắp đèn | Chuông chiều; vãn khóa ở Chung Nam |
| Tuất 戌 | 19–21 | Chạng vạng → đêm | Quán trà, kể chuyện | Kể chuyện cổ ở quán (nhặt mục codex) |
| Hợi 亥 | 21–23 | Đêm | Đóng cửa | Am Vân Cốc thắp đèn tranh (cảnh mẫu canon §1: «đêm, giờ Hợi») |

### 1.3.8 Ma trận thời tiết (mùa × hành ngày)

Xác suất thời tiết cơ sở cho **Huyền Thành** (vùng Thổ, trung hòa). Vùng khác nhân hệ số ở phần 03–05. Mỗi ô: loại thời tiết chính (xác suất gợi ý). **(chưa có — cần làm: hệ thời tiết)**

| Mùa \ Hành ngày | Mộc (Giáp Ất) | Hỏa (Bính Đinh) | Thổ (Mậu Kỷ) | Kim (Canh Tân) | Thủy (Nhâm Quý) |
|---|---|---|---|---|---|
| **Xuân** | gió xuân (50%), mưa phùn (30%), quang (20%) | nắng ấm (60%), quang (30%), giông nhỏ (10%) | sương vàng sáng (40%), quang (60%) | quang lạnh (60%), gió (40%) | mưa phùn (60%), mưa vừa (30%), sương (10%) |
| **Hạ** | gió nồm (40%), quang (40%), giông (20%) | nắng gắt (70%), giông chiều (30%) | oi (50%), quang (30%), giông (20%) | quang khô (60%), gió nóng (40%) | mưa rào (50%), giông lớn (30%), mưa dầm (20%) |
| **Thu** | gió heo may (60%), quang (40%) | quang ấm (70%), ráng đỏ (30%) | sương vàng (40%), quang (60%) | quang trong (70%), sương trắng (30%) | mưa thu (40%), sương (40%), quang (20%) |
| **Đông** | gió bấc (60%), quang lạnh (40%) | nắng hanh (60%), quang (40%) | âm u (60%), quang (40%) | sương muối (50%), quang lạnh (50%) | mưa rét (40%), tuyết (vùng cao) (30%), sương (30%) |

Ràng buộc: thời tiết **không phá cuộc chơi** — không có thời tiết gây sát thương, không khóa nhiệm vụ chính. Thời tiết chỉ đổi hiệu quả hoạt động phụ và cảnh sắc.

### 1.3.9 Ca biên thời gian

| Tình huống | Xử lý |
|---|---|
| Ngày sinh trước Lập Xuân | Năm can chi lùi một năm (đã có trong `thaitue.js`). |
| Giờ Tý (23:00–00:59) — ngày đổi ở đâu? | Theo cấu hình engine (lá số); đồng hồ thế giới coi 23:00 là bắt đầu canh Tý **nhưng ngày can chi đổi lúc 00:00** để khớp lịch vạn niên hiển thị. Ghi rõ trong UI. |
| Tháng nhuận âm lịch | Không ảnh hưởng can chi tháng (tính theo tiết). Lễ âm lịch tháng nhuận **không lặp** (chỉ tổ chức tháng chính). |
| Người chơi ở múi giờ khác | Trải nghiệm cá nhân theo giờ máy; sự kiện chung theo giờ Huyền Thành (UTC+7) và hiện giờ quy đổi. |
| Máy chủ MMO | Thời tiết chung tính ở máy chủ từ can chi ngày giờ Huyền Thành + hạt giống ngày, để mọi người cùng thấy một trời. |

---

## 1.4 Thiên Mệnh Bàn — huyền thoại và văn bản trong thế giới

> Toàn bộ mục 1.4 là **[HƯ CẤU]** của game. Thiên Mệnh Bàn không phải pháp khí có thật của bất kỳ truyền thống nào.

### 1.4.1 Hình dạng (khớp model đã có)

Model `models.js › thienBan()` treo trên Sơn Môn (`render3d.js`: vị trí 0, 78, −80; nghiêng −0,32 rad; tỉ lệ 2,6).

| Phần | Trong code | Ý nghĩa trong lore |
|---|---|---|
| **Vòng ngoài** | 24 sơn (`SKY_RINGS.shan`) | **Vòng Địa** — 24 hướng của đất; ghi «chỗ» của vạn vật |
| **Vòng giữa** | 12 địa chi (`SKY_RINGS.zhi`) | **Vòng Thời** — 12 canh, 12 tháng, 12 năm; ghi «lúc» |
| **Vòng trong** | bát quái (`SKY_RINGS.bagua`) | **Vòng Biến** — tám quẻ; ghi «cách đổi» |
| **Lõi** | la bàn (`luopanTex`) | **Thiên Tâm** — điểm tĩnh ở giữa; truyền thuyết nói là «chỗ của người đọc» |
| **Ba vòng xoay ngược chiều nhau** | `userData.rings` | Đất, thời, biến không bao giờ trùng nhau hoàn toàn — vì vậy «không ai giống ai» |

Ý nghĩa thiết kế quan trọng: **lõi là chỗ của người đọc**. Bàn chỉ ghi khung (đất, thời, biến); **người đứng ở lõi** quyết định đọc ra sao và sống ra sao. Toàn bộ chủ đề «Mệnh do ta tạo» nằm ở chi tiết này.

### 1.4.2 Truyền thuyết gốc (bản kể chuẩn để mọi NPC kể khớp nhau)

1. **Hồng Mông.** Trước khi có Huyền Giới, chỉ có biển mây. Khí trong nổi lên thành trời, khí đục lắng xuống thành đất nổi.
2. **Côn Lôn đúc Bàn.** Trên đỉnh Côn Lôn có hồ Thiên Trì. Mặt hồ phản chiếu toàn bộ vận hành của trời. Những người giữ hồ (gọi chung là **Trì Thủ** 池守, hư cấu, không tên) lấy ánh trăng trên mặt hồ, gõ thành ba vòng và một lõi: đó là **Thiên Mệnh Bàn**. Bàn đặt giữa hồ, quay theo trời.
3. **Hạ Bàn.** Người ở dưới đất khổ vì không hiểu trời: gieo lúa sai mùa, dựng nhà sai hướng, sợ hãi những năm hạn. Các Trì Thủ quyết định **thỉnh Bàn xuống** treo trên một ngọn đồi giữa đại lục, để ai cũng ngẩng lên nhìn được. Quanh đồi ấy mọc lên **Huyền Thành**; những người đầu tiên học đọc Bàn lập ra **Huyền Quán** (sau gọi là Sơn Môn).
4. **Bàn Tọa.** Chỗ Bàn từng đặt trên hồ Côn Lôn để lại một bệ đá nổi — **Thiên Bàn Đảo** (`SKY_ISLAND`, cao 520 m, ở phía Nam Huyền Thành theo tọa độ code) là **bệ tạm** khi Bàn được hạ xuống, nay trống. Người ta thả hạc bay vòng quanh bệ vào những đêm trăng.
5. **Lời dặn.** Khi trao Bàn, các Trì Thủ để lại một câu khắc trên vành Bàn (Bàn Minh, 1.4.3). Câu ấy bị đọc sai suốt mấy nghìn năm.
6. **Nứt.** Đêm Lập Xuân năm Giáp Thìn (Giáp 34, đầu Vận 9), một vết nứt chạy từ chữ **Ngọ** qua lõi sang chữ **Tý** trên vòng Thời. Từ đó, Bàn vẫn quay nhưng **vòng Thời rung**, ánh vàng chập chờn. Định Mệnh Hội tuyên bố: «Trời đã khóa. Mệnh ai nấy chịu, trừ khi mua lễ đổi.»
7. **Kết (chưa xảy ra — đích của game).** Khi đủ người «đứng ở lõi» (người chơi đạt Quy nhất), Bàn được thỉnh trở lại Thiên Trì Côn Lôn và **lành** — nhưng vết nứt để lại một đường sáng, như vết vàng trên chén men hàn (lore: «chỗ nứt là chỗ ánh sáng vào»).

### 1.4.3 Bàn Minh 盤銘 — câu khắc trên vành Bàn

Câu khắc gồm 16 chữ [HƯ CẤU], viết vòng tròn, **không có dấu chấm câu**. Vì vòng tròn không có chỗ bắt đầu, người ta đọc theo hai cách:

```
天 定 其 框 　 人 書 其 字 　 框 不 可 移 　 字 不 可 代
```

- **Cách đọc của Sơn Môn và Vân Cốc** (bắt đầu từ chữ 天):
  > «Thiên định kỳ khuông, nhân thư kỳ tự; khuông bất khả di, tự bất khả đại.»
  > Trời định cái khung, người viết chữ; khung không dời được, **chữ không ai viết thay được**.
- **Cách đọc của Định Mệnh Hội** (bắt đầu từ chữ 框 thứ ba, bỏ bốn chữ cuối là «chú thích của đời sau»):
  > «Khuông bất khả di… thiên định kỳ khuông.»
  > Khung không dời được… trời đã định khung. → «Mệnh đã định.»

Đây là **câu đố trung tâm** của cốt truyện: cùng một văn bản, đọc thiếu một nửa thì thành giáo điều định mệnh. Người chơi tìm lại bản dập đủ 16 chữ ở Thư Lâu (giao tài liệu 03 cấp `MQ-*`).

### 1.4.4 Văn bản trong thế giới về Thiên Mệnh Bàn

Các văn bản dưới đây là **[HƯ CẤU]**, đọc được trong game (mở khóa ghi ở codex phần 10). Mỗi văn bản là một giọng khác nhau về cùng một vật.

#### (a) «Bàn Ký» 盤記 — sử ký của Huyền Quán, bản Thư Lâu

> Thuở đầu, người giữ hồ thỉnh Bàn xuống đồi. Dân bốn phương kéo về ngẩng đầu. Thầy đầu tiên của Quán ngồi dưới Bàn ba năm, không nói. Năm thứ tư, thầy dựng một cái bàn gỗ bên dưới, viết lên mặt gỗ: «Bàn trên trời để biết trời. Bàn dưới đất để biết người.» Từ đó có hai cái bàn: Thiên Bàn và Bàn Thầy.

(Ghi chú thiết kế: «Bàn Thầy» là trạm Thầy Tử Bình đã có ở Sơn Môn. Lore giải thích tên gọi.)

#### (b) «Trì Thủ Ca» 池守歌 — đồng dao trẻ con Huyền Thành

```
Trăng rơi xuống hồ, ai vớt lên?
Ba vòng một lõi, xoay không ngừng.
Vòng ngoài chỉ đất, vòng giữa chỉ giờ,
Vòng trong chỉ biến — lõi chờ người ngồi.
Ai ngồi giữa lõi? Là con đấy thôi!
```

Dùng cho: cảnh mở đầu `MQ-P-xx` (trẻ con hát ở cổng Huyền Thành), nhạc nền chợ.

#### (c) «Định Bàn Kinh» 定盤經 — văn bản của Định Mệnh Hội (ngụy kinh, trong game gắn nhãn «văn bản lừa đảo»)

> Bàn đã nứt, trời đã khóa. Khung không dời, mệnh không đổi. Kẻ chưa biết mệnh mình, như đi đêm không đèn. Kẻ đã biết mà không lễ, như có đèn không dầu. Lễ đổi mệnh: một lễ một hạn, chín lễ chín hạn, lễ đủ thì hạn qua.

Phân tích trong game (khi người chơi soi bằng «Kính Chiếu Gian», xem FAC-018):
- Câu 1–2: **phán tất định** — vi phạm `RB2` (DP6 DETERMINISM_CLAIM).
- Câu 3: **gieo sợ** để dẫn tới câu 4.
- Câu 4–5: **bán lễ** — vi phạm `RB5` (upsell giải mệnh).
- Kết luận người chơi rút ra: văn bản chỉ dùng **nửa câu Bàn Minh**.

#### (d) «Vân Cốc vấn đáp» 雲谷問答 — lời Vân Cốc thiền sư (bản game, phỏng tinh thần *Liễu Phàm tứ huấn*, không trích nguyên văn)

> Người hỏi: «Bàn nứt rồi, mệnh con còn không?»
> Vân Cốc: «Bàn nứt thì vòng Thời rung. Lõi có nứt đâu. Con ngồi ở lõi, con còn.»
> Người hỏi: «Khổng tiên sinh đoán đúng hết, con làm sao khác được?»
> Vân Cốc: «Ông ấy đoán đúng người **chưa đổi**. Con đổi rồi thì lời đoán thành lời kể chuyện cũ.»

#### (e) «Lịch Quan bút ký» 曆官筆記 — ghi chép của một lịch quan Lịch Đường đêm Bàn nứt

> Giờ Dần, khắc thứ hai. Bóng Khuê biểu dừng ba hơi thở rồi chạy tiếp. Bàn trên Sơn Môn phát tiếng như ly sứ rạn. Vòng giờ rung. Ta đo lại: tiết Lập Xuân vẫn đến đúng phút. **Trời không sai. Chỉ cái gương soi trời bị rạn.**

Ý nghĩa: lịch thật (can chi, tiết khí) **vẫn chạy đúng** sau khi Bàn nứt. Đây là lý do cơ chế can chi trong game không thay đổi theo cốt truyện — «trời không sai», chỉ lòng người hoang mang.

#### (f) «Bia Côn Lôn» — chữ khắc ở Thiên Trì, chỉ đọc được ở vĩ thanh `MQ-E-xx`

> Bàn này không ghi ai sẽ thành gì. Bàn này ghi trời đang ở đâu. Người đang ở đâu thì người tự biết.

### 1.4.5 Bàn nứt tác động gì lên thế giới (luật)

| Tác động | Có / không | Giải thích lore | Cơ chế |
|---|---|---|---|
| Can chi, tiết khí sai lệch | **Không** | «Trời không sai» (1.4.4-e) | Lịch thật giữ nguyên |
| Vòng Thời của Bàn rung, sáng chập chờn | Có | Gương soi trời bị rạn | Hiệu ứng nhấp nháy trên `rings[1]` **(chưa có — cần làm)** |
| Người dân hoang mang, tìm thầy bói nhiều hơn | Có | Gốc của nạn Định Mệnh Hội | Quầy «đổi mệnh» ở mọi vùng (canon §4) |
| Thời tiết dị thường | **Không** | Giữ T3: không thảm họa | — |
| Một số vùng «Địa Khí» giảm | Có | Lừa lọc làm đất lạnh (1.1.3) | Địa Khí vùng giảm theo số quầy Định Mệnh Hội đang hoạt động; người chơi dẹp quầy (bằng cách vạch trần, không bạo lực) thì Địa Khí hồi |
| Vết nứt lan rộng theo thời gian | Không | Nứt là một sự kiện, không phải đồng hồ đếm ngược | Không gây áp lực thời gian giả |

### 1.4.6 Câu hỏi người chơi hay hỏi NPC về Bàn — câu trả lời chuẩn

| Câu hỏi | NPC | Trả lời chuẩn (ý) |
|---|---|---|
| «Bàn là ai làm?» | Lão Tùng (gác cổng) | «Người giữ hồ trên Côn Lôn. Tên họ? Không ai ghi. Người làm việc lớn thường không để tên.» |
| «Bàn nứt có phải trời phạt?» | Thầy Tử Bình | «Trời không phạt ai bằng cái bàn. Lịch vẫn đúng từng khắc. Rạn là cái gương, không phải trời.» |
| «Đọc Bàn có biết tương lai?» | Khổng tiên sinh | «Biết chứ. Ta đọc chưa sai lần nào.» (phản đề, cố ý để người chơi nghi ngờ) |
| «Đọc Bàn có biết tương lai?» | Vân Cốc | «Biết quỹ đạo của người đứng yên. Người bước đi thì Bàn chỉ biết họ đang ở đâu.» |
| «Mua lễ đổi mệnh có được không?» | Bất kỳ NPC chính đạo | «Không có lễ nào mua được. Việc đổi được là việc con làm.» (khớp `RB5`) |
| «Sao Bàn có ba vòng?» | Lịch quan (Lịch Đường) | «Đất, giờ, biến. Ba thứ không bao giờ trùng nhau hai lần, nên không ai giống ai.» |

---

## 1.5 Ba nguyên lý đạo đức của thế giới (cũng là luật)

| Nguyên lý | Phát biểu trong thế giới | Nguồn app | Hệ quả cơ chế |
|---|---|---|---|
| **Cảm ứng** 感應 | «Họa phúc không có cửa, người tự gọi đến» (ý *Thái Thượng Cảm Ứng Thiên*, LORE-114) | `daozang › 太上感应篇`; `CONG_QUA` | Việc thiện ghi Sổ Công Quá → Đạo Hạnh |
| **Âm chất** 陰騭 | Thiện làm không ai thấy thì càng sâu (ý *Văn Xương Âm Chất Văn*, LORE-115) | `daozang › 文昌帝君阴骘文` | Việc thiện **không công bố** được tính hệ số cao hơn (tài liệu 05 định) |
| **Sám hối chuyển nghiệp** | «Tâm chuyển thì nghiệp tiêu» | `remedy-fate › CHANHUI_PRINCIPLE` | Nghiệp không vĩnh viễn; mọi lộ đều có đường Hồi Đầu |

Ba nguyên lý này là **trục chung** của mọi đạo thống trong Huyền Giới, dù mỗi phái diễn đạt khác nhau: Đạo nói cảm ứng, Phật nói nhân quả, Nho nói «tích thiện chi gia tất hữu dư khánh». Các phe phái (phần 06) khác nhau ở **pháp**, không khác ở **đích**.

---

## 1.6 Hệ số khí hậu của 20 vùng (bổ sung cho ma trận 1.3.8)

Mỗi vùng nhân xác suất cơ sở của Huyền Thành với hệ số dưới đây rồi chuẩn hóa lại cho tổng = 100%. «—» = giữ nguyên. Nhiệt độ cảm nhận chỉ để chọn trang phục NPC, hiệu ứng hơi thở, âm thanh. **(chưa có — cần làm)**

| Vùng | Cung · hành | Mưa | Sương / mây | Gió | Quang | Tuyết (đông) | Nhiệt cảm nhận | Hiện tượng riêng |
|---|---|---|---|---|---|---|---|---|
| Huyền Thành | Trung · Thổ | — | — | — | — | 0% | ôn hòa | Hoàng Vụ ngày chuyển mùa |
| Am Vân Cốc | Trung · Thổ | ×1,2 (đêm) | ×1,3 | — | — | 5% | mát | mưa nhỏ giờ Hợi |
| Tử Bình Phong | Càn · Kim | ×0,7 | — | ×1,4 | ×1,2 | 10% | lạnh khô | Sương Kiếm |
| Manh Phái Cốc | Cấn · Thổ | ×1,2 (phùn) | ×1,5 | ×0,5 | ×0,8 | 5% | ẩm mát | nắng vào muộn, tắt sớm |
| Trích Thiên Đỉnh | Khôn · Thổ | ×0,9 | ×1,2 (sớm) | — | ×1,4 (đêm) | 20% | ngày ấm, đêm lạnh | trời sao rõ nhất |
| Cùng Thông Hồ | Tốn · Mộc/Thủy | ×1,2 | ×1,6 | ×1,2 | — | 0% | ẩm | khói hơi nước mùa đông |
| Thư Lâu Lâm | Khảm · Thủy | ×1,4 (phùn) | ×1,3 | — | ×0,5 (nắng gắt) | 15% | mát | Mặc Vũ |
| Phong Thủy Viên | Đoài · Kim | ×0,8 | — | ×1,3 | ×1,2 | 5% | hanh | hoàng hôn rực |
| Lịch Đường | Chấn · Mộc | — | ×0,9 | — | ×1,2 (sáng) | 0% | ấm | giông xuân ×1,4 |
| Long Hổ | Chấn · Mộc | ×1,3 | ×1,4 (thu) | — | — | 0% | nóng ẩm | giông hạ ×1,6 |
| Võ Đang | Khảm · Thủy | ×1,1 | ×1,7 | — | — | 30% | lạnh | biển mây dưới chân Kim Điện |
| Chung Nam | Cấn · Thổ | — | — | — | ×1,3 (đông) ×1,4 (thu) | 50% | lục địa | tuyết dày nhiều tuần |
| Mao Sơn | Tốn · Mộc | ×1,4 (phùn) | ×1,7 | ×1,2 | — | 0% | ẩm | sương mọi sáng |
| Yên Tử | Ly · Hỏa | ×1,5 (xuân) | ×1,6 (đỉnh) | — | ×1,2 (chân núi, hạ) | 2% | chân nóng, đỉnh lạnh | Chùa Đồng trong mây |
| Bút Tháp | Ly · Hỏa | ×1,4 (hạ) | ×1,3 (sáng) | — | — | 0% | nồm ẩm | nồm xuân ×1,5 |
| Tạng Địa | Càn · Kim | ×0,4 | — | ×1,6 | ×1,5 | 60% | rất lạnh | hồ đổi màu (chờ tham vấn) |
| Văn Miếu | Ly · Hỏa | ×1,2 (hạ) | ×1,1 | — | ×1,3 | 0% | ấm | trời thu trong mùa thi |
| Phong Đô | Đoài · Kim | ×1,3 (phùn) | ×1,8 | — | ×0,5 | 0% | lạnh ẩm | trong hang không có thời tiết |
| Miêu Cương | Khôn · Thổ | ×1,3 | ×1,6 | — | ×1,2 (thu) | 3% | mát ẩm | lá phong đỏ mùa thu |
| Côn Lôn | — | ×0 | ×0 | ×0,3 | ×∞ (luôn quang) | 0% | trong lành | trời đêm đúng ngày giờ thật |

## 1.7 Sắc trời theo canh giờ và mùa (bảng cho đội ánh sáng)

> Màu gợi ý (hex) cho bầu trời ở chân trời / thiên đỉnh. Mỗi vùng pha thêm 10–20% màu khóa của vùng (§7 bản sơ đồ tổng). **(chưa có — cần làm: `lights.js` đọc giờ thật)**

| Canh | Xuân (chân trời / thiên đỉnh) | Hạ | Thu | Đông |
|---|---|---|---|---|
| Tý (23–01) | #1B2233 / #0B0F1A | #1A2030 / #0A0E18 | #182033 / #090D19 | #151B2B / #070A14 |
| Sửu (01–03) | #1C2436 / #0C101C | #1C2332 / #0B0F1A | #1A2235 / #0A0E1A | #161C2C / #080B15 |
| Dần (03–05) | #3B3F55 / #161B2C | #4A4258 / #1A1E30 | #3A3E52 / #151A2A | #2A2E42 / #10142A |
| Mão (05–07) | #E9B48A / #7FA3C8 | #F2B07C / #86AED2 | #E3A27C / #7A9CC2 | #D9A58C / #6E8DB2 |
| Thìn (07–09) | #CFE3EE / #8FBFE0 | #D8E8F0 / #8CC3E8 | #D2E0EA / #86B6DA | #C8D6E0 / #7FA8CC |
| Tỵ (09–11) | #D6E9F2 / #7FB7E6 | #E2EEF4 / #78B6EA | #DCEAF2 / #74AEE0 | #CFDDE6 / #7AA6D2 |
| Ngọ (11–13) | #E0EEF5 / #73B1E6 | #EEF3F5 / #6DB0EC | #E4EFF5 / #6AA9E2 | #D8E3EA / #74A2D0 |
| Mùi (13–15) | #DCEBF2 / #77B3E4 | #EAF0F2 / #72B2E8 | #E0ECF2 / #70ACE0 | #D4E0E8 / #78A4CE |
| Thân (15–17) | #E8DCC4 / #86B4DA | #F0DCC0 / #8AB8DE | #E8D2B4 / #83ACD4 | #DCCFBE / #7C9FC6 |
| Dậu (17–19) | #E79A6B / #6F7FA8 | #EE8E5C / #73829E | #DE7E52 / #66789E | #C9826A / #5A6A92 |
| Tuất (19–21) | #5A4E68 / #222A44 | #6A4E62 / #262C46 | #574860 / #20283F | #463E56 / #1A2038 |
| Hợi (21–23) | #2A2E44 / #12172A | #2C2F44 / #12162A | #282C42 / #101528 | #22263A / #0D1222 |

Ghi chú: ngày **Hỏa Vân** (01 › 1.2.3) tăng độ bão hòa canh Dậu thêm 20%; ngày Thủy giảm độ sáng toàn ngày 15%; Phong Đô luôn giảm 40% độ bão hòa; Côn Lôn dùng màu thiên văn thật (skybox sao theo giờ).

## 1.8 Checklist nghiệm thu phần Vũ trụ quan

- [ ] Mọi bảng hành – hướng – vùng dùng đúng bảng 1.2.2 và 1.2.5 (không tài liệu nào tự đặt hành khác cho một vùng).
- [ ] Đồng hồ thế giới dùng can chi thật; năm đổi ở Lập Xuân; tháng đổi ở tiết.
- [ ] Không có thời tiết gây hại, không có đồng hồ đếm ngược giả do Bàn nứt.
- [ ] NPC kể truyền thuyết Bàn khớp 7 bước ở 1.4.2.
- [ ] Bàn Minh hiển thị đúng 16 chữ, hai cách đọc.
- [ ] Văn bản «Định Bàn Kinh» luôn gắn nhãn «văn bản lừa đảo» khi hiển thị cho người chơi.
- [ ] Người thật (tổ sư lịch sử) không có thoại mới; thần Phật không «đóng vai» chiến đấu hay ra lệnh.
- [ ] iOS tắt bói: luật thời tiết, mùa vẫn chạy; phần gợi ý Dụng thần ẩn.
