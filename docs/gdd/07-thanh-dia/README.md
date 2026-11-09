# 07 · MƯỜI HAI THÁNH ĐỊA — THIẾT KẾ VÙNG VÀ KIẾN TRÚC

> Tài liệu 07 của bộ GDD «Huyền Giới · Mệnh Do Ta Tạo». Nở từ `docs/GAME-AAA-THIET-KE.md` §7 (thánh địa) và §8 (quy chuẩn «không có công trình làm màu»). Bám tuyệt đối `docs/gdd/00-KINH-DIEN-CHUNG.md` (mã vùng, tâm vùng, mã NPC).
>
> Không gian tên của tài liệu này: **`BLD-<region>-xx`** (công trình) và **`POI-<region>-xx`** (điểm đáng chú ý). Mọi mã khác (`NPC-*`, `CQ-*`, `MG-*`, `ACT-*`, `SQ-*`, `MQ-*`, `INT-*`, `MOD-*`, `TASK-*`) chỉ **đề xuất** và ghi «TBD-<số tập>» để tập sở hữu cấp chính thức.

---

## 1. Phạm vi và cách đọc

Tài liệu này trả lời ba câu hỏi cho từng vùng:

1. **Nguyên mẫu thật trông thế nào** (trục, cổng, mái, ngói, tường, kết cấu gỗ, đấu củng, hoa văn, vật liệu, cảnh quan) — để họa sĩ concept và Meshy prompt không «bịa phong cách».
2. **Vùng trong game bố trí ra sao** — bản đồ ASCII có tọa độ mét, phân khu, đường, cao độ, lối vào từ đường đá Huyền Thành.
3. **Mỗi công trình là gì bên trong** — hạng A–E, kích thước nền, số tầng, kiểu mái, công năng, nội thất từng phòng, trạm tương tác, NPC cư trú, giờ mở cửa theo giờ can chi, ghi chú va chạm, ngân sách đa giác, prompt Meshy cho ngoại thất.

Không thuộc phạm vi (tập khác sở hữu):

| Nội dung | Tập |
|---|---|
| Thoại, persona, lịch sinh hoạt chi tiết của NPC | 06 |
| Mô-đun nội thất (kích thước từng mảnh), `INT-<bld>` | 08 |
| Luật mini-game, số liệu thưởng | 09 |
| Chuỗi tu đạo thống, việc thiện/ác | 05 |
| Nhiệm vụ chính / phụ, cảnh cắt | 03 |
| Nhạc, SFX, giao diện | 12 |
| Việc kỹ thuật, schema | 13 |

---

## 2. Mục lục phần

| Tệp | Vùng (`id`) | Tâm (x, z) | Đạo thống | Mốc |
|---|---|---|---|---|
| `07-01-long-ho.md` | Long Hổ Sơn · Tự Hán Thiên Sư Phủ (`longho`) | 1500, −200 | Chính Nhất + Thần Tiêu | M2 |
| `07-02-vo-dang.md` | Võ Đang Huyền Nhạc (`vodang`) | 0, −1500 | Thanh Vi + Đan Đỉnh | M2 |
| `07-03-chung-nam.md` | Chung Nam Toàn Chân (`chungnam`) | 1400, −1300 | Toàn Chân + Linh Bảo | M3 |
| `07-04-mao-son.md` | Mao Sơn Thượng Thanh (`maoshan`) | 1500, 1300 | Thượng Thanh + Lư Sơn | M3 |
| `07-05-yen-tu.md` | Yên Tử Trúc Lâm (`yentu`) | −400, 1500 | Thiền Trúc Lâm | M3 |
| `07-06-but-thap.md` | Bút Tháp Tịnh Độ (`buttap`) | 500, 1500 | Tịnh Độ + sám hối | M2 |
| `07-07-tang-dia.md` | Tạng Địa Tuyết Vực (`tangdia`) | −1500, −1300 | Mật (Chuẩn Đề), Tạng truyền chờ tham vấn | M5 |
| `07-08-van-mieu.md` | Văn Miếu Quốc Tử Giám (`vanmieu`) | 0, 1900 | Nho + Tịnh Minh | M3 |
| `07-09-phong-do.md` | Phong Đô Quỷ Thành (`phongdo`) | −1500, 0 | Bắc Đế + Động Uyên + Địa Tạng | M4 |
| `07-10-mieu-cuong.md` | Miêu Cương Cổ Trại (`mieucuong`) | −1400, 1300 | bàng môn (hư cấu) | M4 |
| `07-11-con-lon.md` | Côn Lôn Thiên Trì (`conlon`) | 0, −900, đảo trời cao 260 m | quy nhất | M5 |
| `07-12-van-coc.md` | Am Vân Cốc (`vancoc`) | 0, −260 | Liễu Phàm (cải mệnh) | M1 |
| `07-13-huyen-thanh.md` | Huyền Thành + Huyền Quán Sơn Môn (`thanh`), chương mở rộng | 0, 0 | trung tâm | M1 |

Số công trình, số POI và số dòng từng phần: xem §10 (cập nhật khi chốt tập).

Mỗi phần theo cùng một khung 10 mục:

1. Nghiên cứu nguyên mẫu (lịch sử, kiến trúc).
2. Thông số khóa: bảng màu 5 mã hex, bộ mái khóa, chuỗi phong cách Meshy của vùng, đề xuất địa hình.
3. Bản đồ vùng (ASCII), phân khu, đường, cao độ, lối vào.
4. Bảng tổng công trình.
5. Chi tiết từng công trình `BLD-<region>-xx`.
6. Điểm đáng chú ý `POI-<region>-xx`.
7. Đời sống, âm thanh, thời tiết – mùa.
8. Hoạt động của vùng và liên kết tập 03 / 05 / 09.
9. Lưu ý tôn trọng văn hóa (điều không được dựng).
10. Mã mới và câu hỏi mở của vùng.

---

## 3. Quy ước chung

### 3.1 Tọa độ và cao độ

- Tọa độ **thế giới**, đơn vị mét, gốc (0, 0) = tâm Huyền Thành (`terrain.js`). **Bắc = −Z**, Nam = +Z, Đông = +X, Tây = −X.
- Mỗi công trình ghi tọa độ thế giới của **tâm nền** và **hướng mặt tiền** (Nam = quay về +Z). Bản đồ ASCII vẽ theo tọa độ **cục bộ** `L(dx, dz)` so với tâm vùng; công thức: thế giới = tâm + L.
- Cao độ ghi theo **mặt nền** của công trình (mét, cùng hệ `heightAt`). Ký hiệu «sàn» = độ cao mặt nền đi được (`addPlatform`), «+n» = cao hơn sàn khu vực n mét.
- Mỗi vùng mới cần một mục trong `terrain.js › REGIONS` (chưa có — cần làm). Phần 2.4 của mỗi vùng đề xuất `{ id, kind, r, h }`. Các `kind` mới (chưa có trong `heightAt`) được đánh dấu và gom lại ở §5 để tập 13 cấp `TASK-*`.

### 3.2 Giờ can chi (giờ trong game = giờ địa phương thật của người chơi)

| Giờ | Khoảng | Giờ | Khoảng |
|---|---|---|---|
| Tý | 23:00–01:00 | Ngọ | 11:00–13:00 |
| Sửu | 01:00–03:00 | Mùi | 13:00–15:00 |
| Dần | 03:00–05:00 | Thân | 15:00–17:00 |
| Mão | 05:00–07:00 | Dậu | 17:00–19:00 |
| Thìn | 07:00–09:00 | Tuất | 19:00–21:00 |
| Tỵ | 09:00–11:00 | Hợi | 21:00–23:00 |

### 3.3 Lịch cửa (dùng chung; công trình ghi mã lịch + ngoại lệ)

| Mã lịch | Cửa chính | Cửa ngách / lối phụ | NPC tiếp | Ghi chú |
|---|---|---|---|---|
| **S1 · Điện chính** | mở đầu giờ Mão, đóng đầu giờ Tuất | mở cả đêm | giờ Thìn → hết giờ Thân | khóa lễ sáng giờ Mão, khóa lễ chiều giờ Dậu; ban đêm vào được nhưng NPC không tiếp, trừ nhiệm vụ đêm (§8.2 bản sơ đồ tổng) |
| **S2 · Lầu, kinh các, xưởng** | giờ Thìn → hết giờ Dậu | không có | trong giờ mở | ngoài giờ: cửa khép, «gõ cửa» chỉ có tác dụng khi đang làm nhiệm vụ liên quan; nội thất vẫn nhìn được qua song cửa |
| **S3 · Nhà dân, quán, phố** | giờ Mão → hết giờ Hợi | — | trong giờ mở | giờ Tý – Dần đóng; gõ cửa → chủ nhà đáp một câu qua cửa (BARK, tập 06) |
| **S4 · Lộ thiên, hạ tầng** | luôn mở | — | — | đình, cầu, bia, bậc, bến |
| **S5 · Trai đường, bếp** | theo bữa (ghi ở công trình) | cửa bếp mở từ giờ Dần | trong bữa | ngoài bữa vẫn vào ngồi được, không nhận buff ăn |
| **S6 · Đặc thù vùng** | ghi riêng tại công trình | | | ví dụ Phong Đô mở theo âm giờ, Côn Lôn không đóng |

Quy tắc trợ năng: **không công trình nào khóa nội dung chính theo giờ** mà không có lối thay thế. Người chơi chỉ chơi được ban đêm vẫn hoàn thành chuỗi đạo thống (NPC có «ca đêm» ở tĩnh thất hoặc người thay thế; ghi trong từng vùng).

### 3.4 Hạng công trình (nhắc lại §8.1 bản sơ đồ tổng, kèm yêu cầu đo được)

| Hạng | Nội thất tối thiểu | Tương tác tối thiểu | Cửa thông thủy tối thiểu | Ghi chú |
|---|---|---|---|---|
| **A · Điện chính** | toàn bộ lòng nhà; tượng / bàn thờ đúng tín ngưỡng; 2 tầng nếu ngoại thất 2 tầng mái | NPC dẫn đạo + chuỗi nhiệm vụ + ≥ 3 trạm | 3,2 m (2 ô lưới) | 1–2 công trình / vùng |
| **B · Điện phụ, lầu** | lòng nhà đúng công năng | ≥ 1 trạm | 2,4 m | 4–8 / vùng |
| **C · Nhà dân, phố, liêu** | phòng khách + ≥ 1 phòng phụ | NPC cư dân có lá số (`npc.js › makeNpc`) hoặc án tại nhà | 1,6 m | 6–20 / vùng (có thể nhân bản biến thể) |
| **D · Kiến trúc nhỏ** | đi qua / đi quanh / đứng dưới được | bia đọc được, chỗ ngồi, điểm ngắm, chuông gió | — | đình, bài phường, tháp mộ, cầu có mái |
| **E · Hạ tầng** | va chạm theo hình khối (`collide.js`) | cổng mở / đóng theo giờ, mặt cầu đi được | theo lối | tường, cổng, bậc, bến, trạm đi nhanh |

### 3.5 Ngân sách đa giác và khoảng hiển thị

Tam giác (k = nghìn). «Shell» là vỏ ngoại thất do Meshy dựng, «nội thất» dựng bằng mô-đun (tập 08).

| Hạng | Shell `.hd` (web, máy mạnh) | Shell mặc định | Shell `.lod` | Nội thất khi ở trong | Draw call nội thất |
|---|---|---|---|---|---|
| A | 150k | 60k | 10k | ≤ 150k | ≤ 200 |
| B | — | 30k | 5k | ≤ 70k | ≤ 120 |
| C | — | 15k | 2,5k (nhân bản) | ≤ 35k | ≤ 60 |
| D | — | 8k | 1,5k | — | — |
| E | dựng thủ tục (procedural) hoặc ≤ 4k | | | — | — |

Khoảng: `.hd` ≤ 60 m · mặc định ≤ 300 m · `.lod` ≤ 900 m (bằng ngưỡng nạp `SPOTS` trong `landmarks.js`) · nội thất nạp ≤ 60 m và chỉ vẽ khi camera trong ô cổng (portal cell) của công trình hoặc nhìn qua cửa (§8.2 bản sơ đồ tổng).

### 3.6 Va chạm

- Ngoại thất: `addFootprint(obj, { keep })` cắt lát theo hình khối, lưới 0,5 m. **Mọi cửa đi vào được phải có `keep`** (hàm `corridor(x, z, ry, hw)` như cổng hiện có) với nửa bề rộng hw ≥ ½ cửa thông thủy ở §3.4.
- Bậc thềm: mỗi bậc ≤ 0,4 m (`STEP` trong `court.js`); nền cao hơn phải có dãy `addPlatform` như bậc Sơn Môn. Ngưỡng cửa gỗ (bậc cửa Việt) cao 0,25–0,35 m: coi là một bậc.
- Nội thất: lối đi giữa đồ đạc rộng ≥ 1,6 m (A* nửa ô 0,8 m không cắt góc → lối 1,6 m mới chắc chắn qua được).
- Cầu thang lên tầng 2: bậc nền `addPlatform`, chiều dài cầu thang cho phép tối đa dốc 38°.
- Gờ vực, ban công: lan can đặc cao ≥ 1,1 m (`balustrade` của `sect.js`).

### 3.7 Quy tắc prompt Meshy

1. **Tiếng Anh, ≤ 400 ký tự**, chỉ tả **ngoại thất** (pipeline §8.2: Meshy dựng vỏ, nội thất dựng mô-đun).
2. Luôn có cụm **«open front doorway»** (hoặc «open archway») để có lỗ cửa thật, và **«no text»**; không tả tượng thờ, chữ, biểu tượng tôn giáo cụ thể trên mặt ngoài (tượng làm riêng, `style: false`, như `deity_*`).
3. Chuỗi phong cách chung trong `manifest.json › style` thiên về sơn son – sơn mài; **không hợp** với nhiều vùng (tường trắng Long Hổ, gỗ mộc Miêu, vôi trắng Tạng). Mỗi vùng có **chuỗi phong cách vùng** ở mục 2.3; công trình của vùng đặt `style: false` và nối chuỗi vùng vào cuối prompt khi gửi Meshy. Trường `styles.<region>` trong manifest là **(chưa có — cần làm)**.
4. Mã model đề xuất: `<region>_<tên>` chữ thường không dấu (ví dụ `longho_daiduong`). Mã cũ tái dùng ghi rõ (`hall_main`, `gate_sect`, `lib_*`…).
5. Có số tầng, số gian, kiểu mái, vật liệu, màu (dùng từ của bảng màu khóa) — để ảnh chụp nghiệm thu so được với bảng màu.

### 3.8 Thang màu ngói và bộ mái — ma trận chống trộn phong cách

| Vùng | Ngói chủ đạo | Kiểu mái được phép | Cấm |
|---|---|---|---|
| `thanh` | xám đen + son (giữ hiện trạng) | theo model đã có | — |
| `longho` | xám đen | ngạnh sơn + mã đầu tường, huyền sơn, yết sơn đơn diêm (2 điện), toản tiêm (đình) | lưu ly mọi màu |
| `vodang` | lục lưu ly viền vàng; Kim Điện đồng mạ vàng | yết sơn, trùng diêm yết sơn, vũ điện (Kim Điện), ngạnh sơn (liêu xá) | ngói mũi hài, ngói xám cho điện chính |
| `chungnam` | xám | ngạnh sơn, yết sơn, trùng diêm (Tam Thanh các), toản tiêm (đình bia) | lưu ly, mã đầu tường |
| `maoshan` | đen | yết sơn đầu đao Giang Nam, huyền sơn, toản tiêm | đầu đao dày phương Bắc, lưu ly |
| `yentu` | đỏ nâu mũi hài; Chùa Đồng đồng | chồng diêm 8 mái, mái Việt 4 mái đầu đao lá mác, mái một tầng nép vách | đầu đao Giang Nam vút nhọn, lưu ly |
| `buttap` | đỏ mũi hài | chồng diêm 2 tầng 8 mái, mái thấp xòe | lưu ly |
| `tangdia` | mái bằng; kim đỉnh mạ vàng | mái bằng + biên tường; kim đỉnh yết sơn trên điện chính | mái ngói Hán trên nhà thường |
| `vanmieu` | mũi hài + ngói ống men (gác chính) | chồng diêm, mái 4 mái đầu đao vừa | lưu ly vàng (dành Côn Lôn) |
| `phongdo` | đen | yết sơn đầu đao nhọn, trùng diêm (Thiên Tử điện) | ngói đỏ, lưu ly |
| `mieucuong` | xám âm dương lợp mỏng | huyền sơn, mái nhiều tầng toản tiêm (trống lâu, cầu) | lưu ly, mã đầu tường |
| `conlon` | vàng lưu ly + trắng ngọc | trùng diêm toản tiêm, vũ điện | ngói xám, ngói mũi hài |
| `vancoc` | tranh (cỏ gianh) + phiến đá | mái tranh hai mái, mái lá | mọi loại ngói nung |

Kiểm nghiệm thu art: chụp nhanh 4 hướng ở rìa vùng, lấy 5 màu chiếm diện tích lớn nhất của mái + tường; khoảng cách màu (ΔE 2000) tới bảng khóa ≤ 12 cho cả 5 màu.

---

## 4. Bản đồ tổng (±2.000 m, mỗi ký tự ≈ 100 m ngang, mỗi dòng ≈ 200 m dọc)

```
z \ x  -2000      -1500      -1000       -500         0         500       1000       1500       2000
-2000  +---------------------------------------------------------------------------------------+
-1800  |                                                  Kim Dien ^                            |
-1600  |                                                  #VODANG                                |
-1400  |       #TANGDIA                                  (Huyen Nhac mon)          #CHUNGNAM     |
-1200  |                                                     |                                  |
-1000  |                                               ~~#CONLON~~ (dao troi, y 260)            |
 -800  |                                                  oThu Lau                              |
 -600  |                      oTu Binh                       |            oManh Phai            |
 -400  |                                                     |                                  |
 -200  |                                                  #VANCOC                    #LONGHO     |
    0  |       #PHONGDO ------- oPhong Thuy ----------- @HUYEN THANH ---- oLich Duong ----+      |
  200  |                                                  (cong Nam)                            |
  400  |                                                                                        |
  600  |                      oTrich Thien                              oCung Thong             |
  800  |                                                                                        |
 1000  |                                                                                        |
 1200  |        #MIEUCUONG                                                                      |
 1400  |                                     #YENTU               #BUTTAP          #MAOSHAN     |
 1600  |                                                                                        |
 1800  |                                                  #VANMIEU                               |
 2000  +---------------------------------------------------------------------------------------+
         # thánh địa mới   o vùng đã có   @ Huyền Thành   ~ đảo trời
```

### 4.1 Bảng vùng, cổng vùng và đường tới

`roadPath(tx, tz)` (`landmarks.js`) đi từ cổng Nam Huyền Thành (0, 166), vòng cung bán kính 205 m tới góc hướng đích rồi chạy thẳng, dừng khi dốc > ~38°. Mỗi vùng mới gọi `roadPath` tới **cổng vùng** (không phải tâm) — cổng vùng đặt ở rìa vùng phía Huyền Thành.

| Vùng | Cổng vùng (x, z) | Đường qua | Trạm đi nhanh (mở khi tới tận nơi lần đầu) | Ghi chú địa hình (đề xuất `REGIONS`) |
|---|---|---|---|---|
| `longho` | 1130, −130 | cắt nửa Bắc Lịch Đường (qua cạnh Sảnh Trạch Nhật 735, −36) | trạm xe ngựa + bến bè tre | `danxia` (mới): đáy thung h 4, khối đan hà tới h 164, r 360 |
| `vodang` | 0, −1130 (Huyền Nhạc môn) | qua Thư Lâu Lâm (0, −700), chui dưới bóng đảo Côn Lôn | trạm xe chân núi + «trạm hạc» Thái Hòa | `ridge` (mới): dốc lên từ h 120 ở cổng tới h 640 ở Kim Điện |
| `chungnam` | 1150, −1080 | qua rìa Đông Manh Phái Cốc | trạm xe | `valley` h 120, núi bao h 380 |
| `maoshan` | 1210, 1070 | qua rìa Đông Nam Cùng Thông Hồ | trạm thuyền trên đầm sen + trạm xe | `peak` h 260 (đồi Giang Nam), đồi chè |
| `yentu` | −380, 1150 | qua rìa Đông Trích Thiên Đỉnh | trạm xe chân núi + «cáp treo mây» tới Hoa Yên (mở muộn) | `ridge` (mới): h 40 ở suối Giải Oan → h 560 ở Chùa Đồng (phía Nam) |
| `buttap` | 480, 1140 | qua rìa Tây Nam Cùng Thông Hồ | bến đò sông + trạm xe | `plateau` h 8 (đồng bằng), hồ sen lớn |
| `tangdia` | −1220, −1040 | qua rìa Tây Bắc Tử Bình Phong | trạm ngựa thồ + đèo cờ gió | `plateau` h 480 có đồi Mã Bố h 560 |
| `vanmieu` | 90, 1600 (vòng tường Đông xuống cổng Nam ở z 1945) | qua giữa Yên Tử và Bút Tháp | trạm xe trước Hồ Văn | `city` h 12 |
| `phongdo` | −1150, 0 (bài phường Danh Sơn; Quỷ Môn Quan ở −1330, −10) | qua Phong Thủy Viên (−820, 0) | bến đò sông Âm (chỉ chiều về) | `abyss` (mới): vành h 120, đáy thiên khanh h 10 |
| `mieucuong` | −1160, 1080 | qua rìa Nam Trích Thiên Đỉnh | bè gỗ trên sông | `valley` h 40, sườn tới h 180 |
| `conlon` | không có đường bộ — «Thiên Thê» (thang mây) từ sân Thư Lâu (0, −760) | — | hạc từ Kim Điện Võ Đang sau khi mở | đảo trời: đáy y 230, mặt y 260, đỉnh Dao Trì y 300 |
| `vancoc` | 30, −155 (Bắc Ngách Môn, `BLD-thanh-24`) | Hậu Môn Sơn Môn → men cạnh Đông nền Hậu Sơn (x ≈ 52) → Bắc Ngách Môn → Thạch Kính Tứ Huấn | không (đi bộ 3 phút là tới) | `notch` (mới): khe núi nhỏ r 80, h 70 |
| `thanh` | — | — | dịch trạm cửa Nam (đã có xe + ngựa ở 10, 180) | giữ nguyên |

### 4.2 Đường liên vùng (vành ngoài)

Ngoài các tia `roadPath`, bản đồ tổng §7.0 nối các thánh địa kề nhau. Đề xuất 9 đoạn «đường hành hương» (đá xám rộng 4 m, khác đường chính rộng 5 m):

| Đoạn | Từ → tới | Dài (m, ước) | Đặc điểm |
|---|---|---|---|
| H1 | Tạng Địa → Võ Đang | 1.500 | đèo cờ gió, tuyết tan dần thành rừng tùng |
| H2 | Võ Đang → Chung Nam | 1.400 | đường sống núi, động tu dọc đường |
| H3 | Chung Nam → Long Hổ | 1.100 | xuống từ núi Bắc vào thung đá đỏ |
| H4 | Long Hổ → Mao Sơn | 1.500 | đồi chè, rừng trúc |
| H5 | Mao Sơn → Bút Tháp | 1.000 | đồng lúa, đê, cây đa đầu làng |
| H6 | Bút Tháp → Yên Tử | 900 | qua bến đò, chùa làng nhỏ (không thuộc vùng nào: tập 02) |
| H7 | Yên Tử → Miêu Cương | 1.000 | rừng già, suối, ruộng bậc thang |
| H8 | Miêu Cương → Phong Đô | 1.300 | sông xanh chuyển dần sang sương lạnh |
| H9 | Phong Đô → Tạng Địa | 1.300 | đá đen lên cao nguyên |

Văn Miếu nối Yên Tử và Bút Tháp bằng hai nhánh ngắn (500 m, 560 m). Côn Lôn và Vân Cốc không nối vành ngoài.

---

## 5. Xung đột với code hiện có và đề xuất xử lý

| # | Hiện trạng (code thật) | Xung đột | Đề xuất (TBD-13) |
|---|---|---|---|
| 1 | `terrain.js`: `WORLD = 2048`, `EDGE = 960`, rìa tính theo **bán kính** | các tâm vùng mới ở bán kính tới 1.985 m (Mao Sơn, Tạng Địa) và Văn Miếu tới z 1.990 rơi xuống biển mây | `WORLD = 4400`, `HALF = 2200`; rìa tính theo **khoảng cách Chebyshev** `max(|x|, |z|)` với `EDGE = 2100` để bốn góc bản đồ dùng được |
| 2 | `world.js › ROOMS`: phòng «ngoài bản đồ» đặt ở x 1500–2000, z 0 | trùng Long Hổ (tâm 1500, −200) | chuyển `origin` các phòng ra dải z = −2150 (ngoài rìa mới) hoặc thật hóa nội thất tại chỗ (§8.2, ưu tiên) |
| 3 | Thiên Bàn = `models.js › thienBan()`, đặt ở (0, y 78, −80) trên Sơn Môn (`render3d.js`); riêng `terrain.js › SKY_ISLAND` «Thiên Bàn Đảo» (0, 300, y 520) là đảo `sky_palace` khác | canon: Thiên Mệnh Bàn đặt giữa hồ Dao Trì Côn Lôn (0, −900) | giữ Thiên Bàn trên Sơn Môn tới Vĩ thanh; cảnh cắt Vĩ thanh «dời» mesh `thienBan()` về Dao Trì (`BLD-conlon-10`, TBD-03), trạng thái theo cờ từng người chơi; Thiên Bàn Đảo giữ làm cảnh nền xa (không đường tới) |
| 4 | `landmarks.js`: Hậu Sơn `palaceComplex` ở (0, −116), tường thành bán kính 158 kín phía Bắc | Vân Cốc (0, −260) nằm ngoài tường, không có lối | mở **Bắc Ngách Môn** ở (30, −155) — `BLD-thanh-24`, xem `07-13` và `07-12` |
| 5 | `treeDensity`: không trồng cây khi h > 330 | Võ Đang (tới 640), Tạng Địa (480–560), Yên Tử (560) cần tùng / bách trên cao | thêm luật cây theo vùng (`kind`), Tạng Địa trên 520 chỉ cỏ, đá |
| 6 | `roadPath` dừng khi dốc > 0,78 | thần đạo Võ Đang, Yên Tử là bậc đá dốc | thêm kiểu đường «bậc» (chuỗi `addPlatform` bậc 0,4 m) cho đoạn dốc; `roadPath` chỉ dẫn tới chân núi |
| 7 | `heightAt` chỉ có `peak`, `valley`, `lake`, `city`, `plateau` | cần `danxia`, `ridge`, `abyss`, `notch` | thêm 4 nhánh hàm; tham số ở mục 2.4 từng vùng |
| 8 | `findPath`: đích > 150 ô thì đi thẳng | vùng rộng ±400 m | giữ; trong vùng dùng A* cục bộ, ngoài vùng dùng trạm đi nhanh |

---

## 6. Liên kết sang tập khác (gom)

Mỗi vùng ghi chi tiết ở mục 8 của phần vùng. Ở đây chỉ gom loại liên kết:

| Loại | Định dạng ghi trong tập 07 | Ai cấp số |
|---|---|---|
| NPC phụ mới | `NPC-<region>-<tên> (TBD-06)` | 06 |
| Chuỗi tu đạo thống | `CQ-<đạo>-?? «tên chuỗi» (TBD-05)` | 05 |
| Mini-game | `MG-?? «tên» (TBD-09)` | 09 |
| Hoạt động lặp | `ACT-?? «tên» (TBD-09)` | 09 |
| Nhiệm vụ chính / phụ | `MQ-2-?? / SQ-<region>-?? «tên» (TBD-03)` | 03 |
| Nội thất chi tiết | `INT-BLD-<region>-xx (TBD-08)`, bộ mô-đun `MOD-<bộ>` | 08 |
| Âm thanh | `SFX-* / BGM-* (TBD-12)` | 12 |
| Việc kỹ thuật | `TASK-??? (TBD-13)` | 13 |

Engine của app chỉ dẫn những gì **có thật** (đã kiểm tên export trong `src/engine/`): `talisman-data › TALISMANS` (trường `structure { head, body, belly, core, foot }`; các mục `FU_ZHENGYI_BEIDOU`, `FU_MAOSHAN_XIE`, `FU_LUSHAN_SHOUJING`, `FA_BAIDOU`, `FA_ANTAISUI`, `ZHOU_BEI_DI_TIAN_PENG`, `ZHOU_DONG_YUAN`…), `schools-data › SCHOOLS` (12 phái: `zhengyi`, `quanzhen`, `maoshan`, `lushan`, `qingwei`, `shenxiao`, `beidi`, `dongyuan`, `lingbao`, `jingming`, `danding`, `fangshi`), `cultivation-data › CULTIVATION` (`GONG_DAOYIN`, `GONG_TUNA`, `GONG_CUNXIANG`, `GONG_BIGU`, `DAN_QINGJING_JING`, `DAN_NEIGUAN_JING`…), `amta-data` (`ETHICS`, `ritualsMaoShan`, `ritualsZhengYi`, `ritualsLuShan`), `remedy-fate` (`LIAOFAN_STORY`, `YEGUO`, `CHAN_HUI`, `ZHUNTI`, `JING_ZHOU`, `GAI_XIN`, `GAI_LEVELS`, `DAO_JIA`, `TEN_THIEN`, `CONG_QUA`, `meritLedger`), `library-data › LAYERS / LIBRARY`, `daozang-data › DAOZANG`, `tcm` (`WUX_ZANG`, `MERIDIAN_CLOCK`, `seasonalHealth`), `tea-therapy › teaTherapy`, `music-therapy › musicTherapy`, `spiritual-fs › spiritualPractice`, `liudao › SIX_REALMS`, `huangdao › huangdao12`, `zheri › evaluateDate / findGoodDates`, `fs-cure › findCure`, `naming › analyzeName`, `taisui › personalTaSui`, `yinzhai › yinzhaiOverview`, `anti-manipulation-data`, `bitruyen-data › BITRUYEN`, `neo-checker › checkNeo`.

---

## 7. Checklist nghiệm thu một vùng (bổ sung cho §8.5 bản sơ đồ tổng)

1. Đi bộ từ cổng vùng tới **mọi** công trình hạng A–C, vào trong, ra lại không kẹt (script A* + va chạm, như `test-game-state › Sơn Môn`).
2. Không có công trình nào trong tầm đi bộ thiếu cửa vào (trừ cảnh nền xa ghi rõ «cảnh nền» trong bản đồ vùng).
3. Ảnh chụp 4 hướng ở rìa vùng đạt ΔE ≤ 12 với bảng màu khóa (§3.8).
4. Mỗi công trình hạng A có ≥ 3 trạm nối engine hoặc nhiệm vụ; mỗi B có ≥ 1.
5. Bia đọc được: chữ Hán phồn thể + phiên âm Hán Việt + nghĩa (trợ năng §12 bản sơ đồ tổng).
6. Lịch cửa đúng giờ can chi; có lối thay thế cho người chơi đêm.
7. Hiệu năng: ở giữa vùng, máy tầm trung ≥ 30 khung/giây; trong công trình A ≥ 30.
8. Cố vấn văn hóa của truyền thống đó ký duyệt mục 9 của phần vùng (bắt buộc với Tạng Địa, Miêu Cương, Phong Đô, Yên Tử, Bút Tháp, Văn Miếu).

---

## 8. Nguyên tắc tôn trọng chung (áp cho mọi vùng)

- Không cho người chơi phá, ngồi lên, trèo lên, giẫm lên tượng, bàn thờ, bia, tháp mộ, mộ huyệt. Va chạm của các vật này đặt **cao hơn** chiều cao nhảy.
- Không có vật phẩm bán là tượng thánh, phù thật, bài vị, xá lợi.
- Không dựng người thật còn sống (Thiên Sư đương nhiệm, trụ trì, lạt-ma có danh tính). NPC dẫn đạo đều hư cấu (canon §4).
- Văn bia, câu đối: chỉ dùng **văn tự sáng tác mới** hoặc **trích cổ văn đã thuộc phạm vi công cộng ≤ 2 dòng**, có ghi nguồn.
- Phù, chú hiển thị bằng **ký tự hư cấu của game** (canon §2 T6). Chú văn trích (nếu có) chỉ để **đọc**, không gắn hiệu ứng «có tác dụng».
- Nơi có tín ngưỡng sống (chùa Việt, Văn Miếu, Tạng): hành vi người chơi tuân theo lễ của nơi đó (đi theo chiều kim đồng hồ quanh tháp ở Tạng; không đội mũ trong chính điện chùa Việt — game tự tháo mũ phụ kiện khi vào).

---

## 9. Mã mới của tập 07 (tóm tắt)

- `BLD-<region>-01 … NN`: công trình, đánh số theo **thứ tự người chơi gặp trên trục chính**, rồi tới cánh phụ, rồi tới công trình ngoài trục. Không tái dùng số đã bỏ.
- `POI-<region>-01 … NN`: điểm đáng chú ý (ngắm cảnh, bia, suối, cây, hang).
- Danh sách đầy đủ ở mục 4 và 6 của từng phần vùng.

---

## 10. Thống kê tập (chốt khi hoàn thành)

| Phần | Số `BLD` | Hạng A | Số `POI` | Prompt Meshy ngoại thất | Số dòng |
|---|---|---|---|---|---|
| `07-01-long-ho.md` | 26 | 2 | 14 | 22 | 803 |
| `07-02-vo-dang.md` | 27 | 2 | 16 | 26 | 795 |
| `07-03-chung-nam.md` | 25 | 2 | 15 | 24 | 762 |
| `07-04-mao-son.md` | 24 | 2 | 14 | 20 | 747 |
| `07-05-yen-tu.md` | 23 | 3 | 14 | 19 | 706 |
| `07-06-but-thap.md` | 24 | 2 | 14 | 21 | 734 |
| `07-07-tang-dia.md` | 25 | 2 | 14 | 21 | 761 |
| `07-08-van-mieu.md` | 24 | 2 | 15 | 23 | 704 |
| `07-09-phong-do.md` | 30 | 2 | 14 | 17 | 740 |
| `07-10-mieu-cuong.md` | 24 | 1 | 14 | 22 | 722 |
| `07-11-con-lon.md` | 22 (BLD-08 gồm 12 lầu) | 2 | 14 | 16 | 710 |
| `07-12-van-coc.md` | 19 | 1 | 13 | 8 | 626 |
| `07-13-huyen-thanh.md` | 31 | 2 | 14 | 5 (phần lớn tái dùng model có sẵn) | 755 |
| **Tổng** | **324** | **25** | **185** | **244** | **9.565** + README |

### 10.1 Ước lượng tài sản 3D (gom từ mục 10.1 của từng vùng)

| Loại | Số lượng | Ghi chú |
|---|---|---|
| Prompt ngoại thất Meshy | 244 | nhiều prompt là **biến thể** (phố nhà a/b/c, Thập điện dùng một vỏ ×10, Ngọc Lâu một vỏ ×12) → số model thực cần sinh ≈ 190 |
| Model tái dùng có sẵn | `palace_grand`, `hall_main`, `gate_sect`, `city_gate`, `cliff_palace`, `tree_pine`, `tree_peach`, `boat`, `bridge_arch`, `lib_*`, `deity_*` | Huyền Thành gần như chỉ cần nội thất |
| Tượng thờ (`style: false`) | ≈ 120 (Phong Đô 23, Bút Tháp ~30, Mao Sơn 9, các vùng khác 3–12) | **mọi tượng cần cố vấn duyệt trước khi sinh**; đề xuất tượng gốc + biến thể (mũ, râu, vật cầm) để giảm số model |
| Bộ mô-đun nội thất | 7 bộ §8.3 + 3 bộ mới: «am tranh» (Vân Cốc), «trời ngọc» (Côn Lôn), «âm ty sâu» (tách khỏi bộ Âm ty cho đáy Phong Đô) | tập 08 |
| Credit Meshy ước tính | ≈ 190 × 20 (ngoại thất) + 120 × 20 (tượng) ≈ **6.200 credit** | gấp ~1,6 lần §13.3 — xem câu hỏi mở 6 |

### 10.2 Thứ tự sản xuất đề xuất theo mốc

| Mốc | Vùng | Lý do |
|---|---|---|
| M1 | `thanh` (thật hóa ~15 nội thất), `vancoc` (8 vỏ, rẻ nhất) | trái tim Hồi I; không cần mở rộng bản đồ |
| M2 | `longho`, `vodang`, `buttap` | ba đạo lớn (Đạo phù lục, Đạo nội đan, Phật Tịnh Độ) — khớp §13.4; **cần quyết định §5 #1 (kích thước thế giới) trước M2** |
| M3 | `yentu`, `vanmieu`, `maoshan`, `chungnam` | |
| M4 | `phongdo`, `mieucuong` | nội dung nhạy cảm: duyệt §14 |
| M5 | `tangdia` (sau tham vấn), `conlon` | end-game |

---

## 11. Câu hỏi mở của cả tập

1. **Kích thước thế giới**: chấp nhận đề xuất `WORLD = 4400` + rìa Chebyshev (§5 #1)? Ảnh hưởng máy chủ MMO (`worker/quan-room.js` kiểm vị trí) và bản đồ mini.
2. **Thật hóa nội thất hay phòng ngoài bản đồ**: bản web hiện tại dùng `ROOMS`. Tập này viết theo chuẩn AAA (nội thất trong vỏ). Cần quyết định vùng nào (M2) làm thật ngay, vùng nào tạm dùng `ROOMS`.
3. **Tạng Địa**: toàn bộ nội dung tôn giáo trong `07-07` là **phác thảo chờ tham vấn**; có thể phải đổi bố cục điện chính.
4. **Phong Đô**: mức độ hiển thị «Thập điện» (tranh tường tượng trưng hay tượng đầy đủ) cần cố vấn và xếp hạng tuổi (PEGI / ESRB) quyết định.
5. **Văn Miếu**: có được mô phỏng sát Văn Miếu Hà Nội (di tích quốc gia đặc biệt) hay phải «biến thể hư cấu» rõ rệt (đổi tên công trình, số bia)? Tập này chọn biến thể: giữ bố cục 5 lớp sân, đổi tên bia và số bia.
6. **Ngân sách Meshy**: tập này cần ≈ 190 model ngoại thất + ≈ 120 tượng (≈ 6.200 credit, §10.1), nhiều hơn ước lượng ở §13.3 bản sơ đồ tổng; cần chọn công trình nào dựng thủ tục (procedural) thay Meshy.
7. **Mặt nước cục bộ**: hồ ngọc lam Tạng Địa (h ≈ 472), ao / ruộng Miêu Cương, khe Nại Hà và đáy hố Phong Đô, Dao Trì và Nhược Thủy Côn Lôn đều cao hơn mực nước chung (−6). Tập 13 có làm mặt nước theo vùng không? Nếu không, các phần vùng đã ghi phương án decal.
8. **Đường cắt qua vùng cũ**: `roadPath` tới Mao Sơn chạy xuyên Cùng Thông Hồ (đề xuất điểm qua (900, 790)); tới Võ Đang đâm vào nền Thư Lâu (0, −700); vành cung R 205 có thể xuyên Bát Đạo Đình (0, 196). Cần thêm điểm qua (waypoint) cho `roadPath` (TASK, TBD-13).
9. **Địa hình `valley` có đáy cao**: Chung Nam cần đáy thung h 120 nhưng nhánh `valley` hiện kéo đáy về ~8 m — cần tham số `floor` (TBD-13).
10. **Độ cao Côn Lôn**: canon y 260 thấp hơn Kim Điện Võ Đang (640): từ đỉnh Võ Đang người chơi nhìn **xuống** đảo trời. Tập này giữ canon và coi đó là điểm nhấn của Võ Đang; tập 02 / 03 xác nhận.
11. **Thang bậc đạo thống**: bậc lục Long Hổ (5), bậc giới Chung Nam (3), 9 tầng Cửu phẩm liên hoa Bút Tháp (đề xuất ngưỡng 50 / 100 / 150 / 225 / 300 / 450 / 600 / 800 / 1.000 công) — tập 05 thống nhất một thang chung.
12. **Tên gọi**: «Tự Hán Thiên Sư Phủ», «Văn Miếu», «Bút Tháp» trùng địa danh thật; «Miêu Cương» là ngoại danh mang sắc biên cương. Cần ý kiến pháp lý – văn hóa trước M2 (Tạng Địa đã dùng tên hư cấu cho công trình).
13. **Cố vấn**: tối thiểu cần cố vấn Chính Nhất / Toàn Chân (Đạo), Phật giáo Việt (Yên Tử, Bút Tháp), Tạng truyền, người Miêu và người Đồng; nếu chưa có cố vấn Tạng trước M5 — có phát hành Tạng Địa ở chế độ «chỉ phần thế tục»?
14. **Nhắc khẩu nghiệp trong chat** (Hanh Cáp từ, Phong Đô) và **«nhập thất» ngoại tuyến** (Chung Nam, Vân Cốc) — tập 10 / 14 duyệt để không thành giám sát hay treo máy kiếm điểm.

---

## 12. Bảng tra: NPC canon ở công trình nào (cho tập 06)

Lịch ghi theo giờ can chi (§3.2); chi tiết thoại, persona thuộc tập 06.

| NPC (canon §4) | Công trình chính | Lịch trong ngày (tóm tắt) | Ca đêm / lối thay thế |
|---|---|---|---|
| `thay_tubinh` | `BLD-thanh-13` Bàn Thầy; `BLD-thanh-14` Chính Đường (bàn trong điện) | ngày ở bệ ngoài; từ giờ Dậu hoặc khi mưa vào trong điện | bàn trong điện |
| `gac_cong` (Lão Tùng) | `BLD-thanh-01` Sơn Môn, phòng gác Tây | giờ Mão → Tuất | `NPC-thanh-trucdem` |
| `tho_may` (Bà Tư) | `BLD-thanh-07` Tàng Y Các | S3 | — |
| `khong_tiensinh` | bậc ngoài Sơn Môn (POI-thanh-04), quầy chợ các vùng; `BLD-conlon-10` (Vĩ thanh), POI-conlon-14 | theo cốt truyện | — |
| `van_coc` | `BLD-vancoc-06` Thê Hà Am; `BLD-vancoc-04` Đối Tọa Thất (đêm); `BLD-thanh-21` (cảnh Nghịch Thiên); `BLD-conlon-09` (Vĩ thanh) | Mão → Dậu ở am; Tuất kinh hành; Hợi → Dần Đối Tọa Thất | luôn tìm được |
| `truong_thiensu` | `BLD-longho-09` Đại Đường; `BLD-longho-13` Vạn Pháp Tông Đàn; `BLD-longho-11` Tư Đệ | Thìn → Thân Đại Đường; Dậu tông đàn; đêm thư phòng | thư phạm trực gian Khảo Lục (Tuất – Hợi) |
| `huyen_hu` | `BLD-vodang-12` Tử Tiêu Điện; `BLD-vodang-05` Ngọc Hư Cung (sân tập sáng); `BLD-vodang-27` Kim Điện (theo chuỗi) | Mão – Thìn sân tập; Thìn → Thân Tử Tiêu | đạo sĩ khóa lễ giờ Dậu |
| `dan_dinh` | `BLD-vodang-16` Đan Phòng + Dược Viên | Thìn → Dậu | đêm canh lửa, nói chuyện tới giờ Tý |
| `khau_daotruong` | `BLD-chungnam-08` Lão Luật Đường; `BLD-chungnam-10` Tam Thanh Các | Thìn → Thân Giới đường; Mão, Dậu chủ lễ; Mùi giảng Đạo Tạng | kinh sư dẫn tụng |
| `maoshan_daonhan` | `BLD-maoshan-05` Cứu Nhân Đường; `BLD-maoshan-18` Thái Nguyên Bảo Điện; `BLD-maoshan-15` Tồn Tư thất | Thìn – Tỵ bảo điện → Cứu Nhân Đường tới hết Thân; Dậu – Tuất dạy tồn tư | tồn tư buổi tối |
| `truclam_thiensu` | `BLD-yentu-13` chính điện Hoa Yên; `BLD-yentu-04` Thiền đường; `BLD-yentu-22` Chùa Đồng (rằm, Phật đản) | Thìn → Thân Hoa Yên; giờ Dần thiền đường | thiền đường giờ Dần |
| `dieu_am` | `BLD-buttap-12` Thượng điện; `BLD-buttap-15` Tích Thiện Am; `BLD-buttap-16` Sám Đường; `BLD-buttap-18` Nhà Tổ | Thìn → Thân thượng điện; Ngọ – Mùi Nhà Tổ; Dậu → Tuất Tích Thiện Am | Tích Thiện Am tới hết Tuất |
| `lama_dakiet` (chờ tham vấn) | `BLD-tangdia-12` Mạn-đà-la Viện; `BLD-tangdia-07` Kim Đăng Tự; `BLD-tangdia-10` Hồng Cung; `BLD-tangdia-25` Labrang | Thìn mạn-đà-la; Tỵ – Mùi Kim Đăng; Tuất – Hợi Labrang | Labrang buổi tối |
| `te_tuu` | `BLD-vanmieu-16` Tiền Đường Quốc Tử Giám; `BLD-vanmieu-11` Đại Bái Đường (lễ); `BLD-vanmieu-22` Chính Danh Trai | Thìn → Thân Tiền Đường; Mùi – Thân Chính Danh Trai (tầng TÊN) | thầy chữ trẻ ngoài giờ |
| `phan_quan` | `BLD-phongdo-11` Thiên Tử Điện | Dậu → hết Dần ngồi án | thư lại giữ án ban ngày |
| `diatang_su` | `BLD-phongdo-27` Địa Tạng Điện; đi cùng qua `BLD-phongdo-16…25` | luôn có mặt | — |
| `vu_y_amau` | `BLD-mieucuong-11` Vu Y Đường | Thìn → Thân; Dậu ngồi hiên | — |
| `lo_ban_su` | `BLD-mieucuong-24` Hắc Lô Động | chỉ theo cốt truyện | — |
| `dinh_menh_hoi` | `BLD-thanh-30` (quầy đầu tiên) rồi quầy ở mọi vùng (ví dụ `BLD-longho-04`, `BLD-phongdo-05`) | Thìn → Thân, dời vùng sau khi bị vạch mặt | — |
| `phuong_si` | lang thang — **chưa gắn công trình** trong tập này (đề xuất: ghé Vân Thủy Khách Xá `BLD-vancoc-12` và nhà trọ `BLD-thanh-21` theo tuần) | TBD-06 | — |

## 13. Khoảng mã đã cấp

| Vùng | `BLD` | `POI` |
|---|---|---|
| `longho` | 01–26 | 01–14 |
| `vodang` | 01–27 | 01–16 |
| `chungnam` | 01–25 | 01–15 |
| `maoshan` | 01–24 | 01–14 |
| `yentu` | 01–23 | 01–14 |
| `buttap` | 01–24 | 01–14 |
| `tangdia` | 01–25 | 01–14 |
| `vanmieu` | 01–24 | 01–15 |
| `phongdo` | 01–30 | 01–14 |
| `mieucuong` | 01–24 | 01–14 |
| `conlon` | 01–22 | 01–14 |
| `vancoc` | 01–19 | 01–13 |
| `thanh` | 01–31 | 01–14 |
