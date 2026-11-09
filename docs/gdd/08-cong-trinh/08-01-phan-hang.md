# 08-01 · Phân hạng công trình A–E

> Phần này là **luật**. Mọi phần sau (pipeline, runtime, bộ mô-đun, spec từng công trình, nghiệm thu) đều quy về bảng hạng ở đây. Một công trình chỉ có **một hạng**; đổi hạng phải ghi vào §10 (bảng đăng ký) kèm lý do.

---

## 1. Luật số 1 và phạm vi áp dụng

**Luật số 1** (bản sơ đồ tổng §8, trụ cột T4 trong `00-KINH-DIEN-CHUNG.md`): mọi công trình người chơi nhìn thấy **trong tầm đi bộ** đều

1. **đi vào được** (hoặc đi qua / đi quanh / đứng dưới được, tùy hạng);
2. có **nội thất đúng công năng**;
3. có **ít nhất một tương tác** nối với một engine của app hoặc một nhiệm vụ.

Không có mặt dựng giả, không có cửa vẽ, không có cửa sổ sáng đèn mà sau đó là khối đặc.

### 1.1 «Tầm đi bộ» — định nghĩa đo được

Một công trình thuộc tầm đi bộ khi **thỏa ít nhất một** điều kiện:

| Mã | Điều kiện | Cách kiểm (máy) |
|---|---|---|
| TĐ-1 | Khung bao chân công trình có điểm cách **một điểm đi được** ≤ 40 m | lấy mẫu lưới 4 m quanh khung bao; `world.js › blockedAt` = false và `findPath(START, điểm)` khác rỗng |
| TĐ-2 | Công trình nằm cách **đường đá** (`landmarks.js › roadPath`) ≤ 150 m | khoảng cách điểm–polyline |
| TĐ-3 | Công trình nằm trên **nền bậc cấp** có `addPlatform` (người chơi đứng được trên nền) | `obstacles.js › platformTop` tại tâm công trình khác `null` |
| TĐ-4 | Công trình nằm trong vùng có **trạm đi nhanh** (xe kiệu, đò, hạc) ≤ 300 m | danh sách trạm (`HALLS` + trạm mới tài liệu 07) |

Không thỏa điều kiện nào → **cảnh nền xa** (§11). Ngoại lệ chỉ tồn tại đến khi có đường dẫn tới; có đường tới thì phải thật hóa trước khi mở đường.

### 1.2 «Nhìn thấy là hứa» — 10 lời hứa thị giác

Mỗi chi tiết dưới đây, nếu **nhìn thấy được từ chỗ người chơi đứng**, là một lời hứa và phải giữ:

| # | Chi tiết nhìn thấy | Lời hứa | Cách giữ hợp lệ |
|---|---|---|---|
| H1 | Ô cửa đi (có khung, có cánh, có bậc dẫn) | đi vào được | cửa thật (`doors.js`, 08-03 §6) hoặc cửa **khóa có lý do** (§1.3) |
| H2 | Cửa sổ có song / giấy dán | phía sau là một **khoang** có thật | khoang có nội thất; ban đêm có đèn nếu có người |
| H3 | Cửa sổ sáng đèn ban đêm | có người / có nguồn sáng thật bên trong | nguồn sáng đăng ký `lights.js › addLight` trong khoang đó |
| H4 | Bậc thang dẫn lên một tầng | lên được | chuỗi nền bậc (`addPlatform`) nối tầng (08-04 §2) |
| H5 | Ban công / hành lang có lan can | đứng được trên đó | nền tầng + lan can chặn mép |
| H6 | Tầng trên có cửa sổ / ô thoáng | tầng đó tồn tại và tới được | cầu thang trong; hoặc mô hình lại thành tầng đặc (§1.4) |
| H7 | Biển hiệu, câu đối | đọc được (chạm/bấm) | nhãn + bản dịch Hán Việt (08-03 §9) |
| H8 | Khói bếp, hương khói | có bếp / lư hương thật | đạo cụ có hook, NPC nấu ăn theo giờ |
| H9 | Người đứng trong nhà (nhìn qua cửa) | NPC thật, nói chuyện được | NPC có lịch sinh hoạt |
| H10 | Đường mòn / bậc đá dẫn tới công trình | công trình thuộc tầm đi bộ | toàn bộ hạng phải đạt |

### 1.3 Khoang khóa — khi nào được phép

Một khoang được **khóa** (cửa trạng thái `KHOA`, 08-03 §6) chỉ khi thỏa đủ bốn điều:

1. **Có lý do trong thế giới**: buồng riêng của trụ trì, kho kinh quý, phòng sản phụ, phòng có tang… Lý do hiện thành một câu NPC nói hoặc một tấm biển («Tĩnh thất — xin giữ yên lặng»).
2. **Nhìn được vào trong**: qua song cửa, rèm hở, hoặc cửa hé (`HE`). Nội thất bên trong **được dựng đủ**, chỉ không đi vào.
3. **Có điều kiện mở**: nhiệm vụ, quan hệ với NPC, giờ, Cảnh giới. Ghi điều kiện trong spec INT.
4. **Không quá 20 % số khoang** của một công trình (tính theo diện tích sàn) và **không phải khoang chứa trạm bắt buộc** của chuỗi chính.

### 1.4 Tháp đặc và khám mù — ngoại lệ có nguyên mẫu

Kiến trúc thật có **tháp đặc** (thực tâm tháp 實心塔): thân xây gạch / đá đặc, chỉ có **khám** (niche) đặt tượng ở mặt ngoài, không có tầng bên trong. Game được dùng hình thức này khi:

- khám là **hốc thật** có chiều sâu ≥ 0,4 m, có tượng / bài vị / đèn trong hốc (không vẽ trên texture);
- không có ô cửa đi, không có bậc dẫn lên tầng đó, không có lan can ban công;
- thân tháp chặn va chạm đặc như khối;
- tầng trệt (nếu có cửa) vẫn phải vào được.

Áp dụng cho các tháp mà tầng trên quá hẹp để đi (bề ngang lòng < 3,2 m sau khi đo, 08-02 §5.2), ví dụ hai tháp đỏ phía Nam Sơn Môn (08-08 §2).

---

## 2. Bảng tóm tắt năm hạng

| | **A · Điện chính** | **B · Điện phụ / lầu / tháp / cổng có phòng** | **C · Nhà dân / quán / tiệm** | **D · Kiến trúc nhỏ** | **E · Hạ tầng** |
|---|---|---|---|---|---|
| Nội thất tối thiểu | Toàn bộ không gian trong; **mọi tầng** nhìn thấy từ ngoài; đồ thờ đúng tín ngưỡng; ≥ 3 khoang | Không gian trong đúng công năng; mọi tầng có cửa sổ; ≥ 1 khoang | Phòng khách + ≥ 1 phòng phụ; đồ theo nghề chủ nhà | Đi qua / quanh / đứng dưới, không chặn vô lý | Va chạm chuẩn theo hình khối |
| Tương tác tối thiểu | NPC dẫn đạo + chuỗi nhiệm vụ + ≥ 3 trạm | ≥ 1 trạm | NPC cư dân có lá số + ≥ 1 án tại nhà + ≥ 2 vật tương tác nhỏ | ≥ 1 (bia, ghế, điểm ngắm, chuông gió) | Cổng mở đóng / mặt cầu đi được |
| NPC | 1 dẫn đạo (canon) + ≥ 2 phụ có lịch | ≥ 1 người coi (có thể vắng ngoài giờ) | Gia đình 2–5 người | Tùy (sạp: người bán) | Tùy (lính tuần) |
| Ánh sáng | ≥ 1 nguồn thật / khoang; nến bàn thờ; cửa sổ sáng đêm | ≥ 1 nguồn / khoang | Đèn dầu + bếp lửa; tắt giờ ngủ | ≤ 1 đèn lồng / đèn đá | Không |
| Âm thanh | Nền khoang + vang «đại điện» + tụng / mõ theo giờ | Nền + vang vừa | Nền sinh hoạt | Phát âm tại chỗ | Không |
| Cửa | Cửa chính 2 cánh theo lịch `dien_chinh` + ≥ 1 ngách `luon_mo` | `dien_phu` hoặc `luon_mo` | `nha_dan` | — | `son_mon` / `thanh_mon` |
| Camera trong | TRONG (khoang < 5 m: BỔ DỌC) | TRONG / BỔ DỌC | BỔ DỌC | Ngoài trời, hạ trần khi dưới mái | Ngoài trời |
| Bán kính tải nội thất | 80 m | 60 m | 40 m (≤ 3 nhà cùng lúc) | cùng vỏ | — |
| Ảnh nghiệm thu | 4 ngoài + 4 trong + 1 đêm + 1 bổ dọc | 4 + 2 + 1 | mỗi kiểu nhà: 2 + 2 | 2 | 1 |

Chi tiết từng hạng ở §4–§8; ngân sách hiệu năng ở §12.

---

## 3. Cây quyết định xếp hạng

```
                      Công trình có thuộc tầm đi bộ (§1.1)?
                         │ không → CẢNH NỀN XA (§11)
                         │ có
                         ▼
            Có không gian kín (tường + mái) người đứng vừa?
              │ không                              │ có
              ▼                                    ▼
   Là tường / nền / bậc / cầu /         Là nơi thờ chính của một quần thể,
   cổng không phòng?                    có NPC dẫn đạo hoặc chuỗi nhiệm vụ?
     │ có → E                              │ có → A
     │ không                               │ không
     ▼                                     ▼
   D (đình, bài phường, sạp,         Là nơi ở / buôn bán của dân thường?
      bệ, tháp đặc, đỉnh, bia)          │ có → C
                                        │ không → B (điện phụ, lầu chuông,
                                        │          tháp có tầng, cổng có phòng,
                                        │          tàng kinh, trai đường)
```

**Quy tắc kéo hạng lên** (bắt buộc):

- Một kiến trúc D mà mô hình có **ô cửa đi kín** (tường bao + cửa) → lên **B** (hoặc C nếu là nhà ở).
- Một cổng E mà thân cổng có **phòng nhìn thấy được** (cửa sổ, cửa đi ở thân) → lên **B**. Đo bằng lát cắt (08-02 §5.2): `gate_sect` có hai phòng kín 9,5 × 5 m hai bên lối giữa → Sơn Môn là B.
- Một công trình B chứa **trạm thuộc chuỗi chính** và có NPC canon thường trực → lên **A**.

**Quy tắc hạ hạng** (chỉ khi có lý do kỹ thuật, ghi vào §10): một tháp có tầng trên rộng lòng < 3,2 m → phần trên làm **tháp đặc** (§1.4), hạng giữ theo tầng trệt.

---

## 4. Hạng A — Điện chính

### 4.1 Định nghĩa

Điện thờ chính hoặc công trình trung tâm của một quần thể; nơi NPC dẫn đạo tiếp người chơi; nơi diễn ra các cảnh then chốt của chuỗi nhiệm vụ.

### 4.2 Yêu cầu

| Hạng mục | Yêu cầu bắt buộc | Kiểm |
|---|---|---|
| Không gian | Mọi thể tích kín đo được bằng lát cắt (08-02 §5.2) có diện tích ≥ 9 m² đều là khoang đi được hoặc khoang khóa hợp lệ (§1.3) | test `bld-void` so với danh sách khoang |
| Tầng | Mọi tầng có cửa sổ / lan can nhìn thấy từ ngoài đều tới được bằng cầu thang | test đường đi lên từng tầng |
| Khoang | ≥ 3 khoang (ví dụ: chính điện, hậu điện / tàng kinh, phòng phụ) | registry |
| Đồ thờ | Bàn thờ, tượng / bài vị **đúng tín ngưỡng của đạo thống** (bảng 7 của tài liệu tổng), không trộn biểu tượng giữa đạo | duyệt art + duyệt nội dung |
| NPC | 1 NPC dẫn đạo (canon §4) có mặt theo lịch; ≥ 2 NPC phụ (đạo đồng, hương đăng, khách hành hương) có lịch sinh hoạt theo giờ can chi | test lịch |
| Trạm | ≥ 3 trạm, mỗi trạm nối **một engine app** (`src/engine/…`) hoặc một nhiệm vụ (`MQ-*`, `CQ-*`, `SQ-*`) | test `stationById` + map engine |
| Nhiệm vụ | Có ít nhất một cảnh của chuỗi chính / chuỗi đạo thống diễn ra bên trong | tài liệu 03 / 05 tham chiếu INT id |
| Ánh sáng | Mỗi khoang ≥ 1 nguồn sáng thật (nến, đèn dầu, đèn bơ, đèn lồng); bàn thờ ≥ 2 nến; ban đêm cửa sổ sáng khi có người trực | test `lights` theo khoang |
| Âm thanh | Âm nền theo khoang; vang «đại điện» RT60 2,2–3,0 s; tụng / mõ / chuông theo giờ | nghe duyệt |
| Cửa | Cửa chính hai cánh theo lịch `dien_chinh` (mở đầu giờ Mão, đóng cuối giờ Tuất) + ≥ 1 cửa ngách `luon_mo` | test lịch cửa |
| Camera | Chế độ TRONG (08-03 §8); khoang có cạnh ngắn < 5 m dùng BỔ DỌC | thử tay |
| Hiệu năng | §12 hạng A | đo |
| Ảnh | 4 góc ngoài + 4 ảnh trong (mỗi khoang chính) + 1 đêm + 1 ảnh bổ dọc | `docs/art/<vùng>/` |

### 4.3 Ví dụ hạng A

**Đang có trong game (thật hóa trước):**

| INT | Công trình | Mô hình | Ghi chú |
|---|---|---|---|
| INT-SM-CHINHDUONG | Chính Đường Sơn Môn | `palace_grand` rộng 44 m | 2 tầng: Tổ Sư đường + Tàng Kinh (08-07 §2) |
| INT-HS-CHINHDIEN | Chính Điện Tam Thanh, Hậu Sơn | `cliff_palace` rộng 55,2 m | Chuyển điện ngoài bản đồ `ROOMS › chinhdien` vào trong (08-10 §1) |
| INT-TB-CHINHDIEN | Chính Điện Tử Bình Phong | `cliff_palace` rộng 170 m | Cách Cục Đường + Lão Quân Điện (chuyển `ROOMS › laoquan`) |
| INT-TT-QUANTINH | Quan Tinh Đài Trích Thiên | `observatory` rộng 90 m | Tử Vi Đường + Đẩu Mẫu Điện (chuyển `ROOMS › daumau`) |
| INT-TL-THULAU | Thư Lâu Cửu Tầng | `tower_nine` cao 112 m | 9 tầng thư + Văn Xương Các ở tầng trệt (chuyển `ROOMS › vanxuong`) |
| INT-MP-DAIDIEN | Đại Điện Manh Phái Cốc | `palace_grand` rộng 69 m | Tượng Pháp Đường |
| INT-PT-DAIDIEN | Đại Điện Phong Thủy Viên | `palace_grand` rộng 55,2 m | Dương Trạch Đường |
| INT-LD-DAIDIEN | Đại Điện Lịch Đường | `palace_grand` rộng 55,2 m | Trạch Nhật Đường |

**Dự kiến ở thánh địa mới (mã `BLD-*` do tài liệu 07 cấp):** Kim Điện Võ Đang (đồng mạ vàng, một gian, chật — khoang < 5 m nên camera BỔ DỌC), Tử Tiêu cung (trùng diêm, ba tầng nền), Đại đường Thiên Sư Phủ (nơi thụ lục), Ngọc Hoàng điện Chung Nam, Cửu Tiêu Vạn Phúc cung Mao Sơn, chùa Hoa Yên và Chùa Đồng Yên Tử, thượng điện Bút Tháp, điện mạn-đà-la trung tâm Tạng Địa, Đại Thành điện Văn Miếu, Thiên Tử điện Phong Đô, điện Dao Trì Côn Lôn.

---

## 5. Hạng B — Điện phụ, lầu, tháp có tầng, cổng có phòng

### 5.1 Định nghĩa

Công trình có không gian kín phục vụ **một công năng chuyên biệt** của quần thể: điện phụ, lầu chuông / lầu trống, tàng kinh các, trai đường, tháp nhiều tầng có lòng, cổng có phòng gác.

### 5.2 Yêu cầu

| Hạng mục | Yêu cầu bắt buộc | Kiểm |
|---|---|---|
| Không gian | Không gian trong đúng công năng: chuông thật trong lầu chuông, trống thật trong lầu trống, kệ kinh trong tàng kinh, bàn ăn trong trai đường | duyệt art |
| Tầng | Mọi tầng có cửa sổ tới được; tầng không đủ rộng → tháp đặc (§1.4) | test đường lên |
| Khoang | ≥ 1 khoang | registry |
| NPC | ≥ 1 người coi (thủ từ, đạo đồng, lính gác); có thể vắng ngoài giờ trực, nhưng vật dụng vẫn tương tác được | test lịch |
| Trạm | ≥ 1 trạm nối engine hoặc nhiệm vụ; trạm «thường ngày» được Phúc Khí qua `state.js › grantDaily` | test |
| Ánh sáng | ≥ 1 nguồn thật / khoang | test |
| Âm thanh | Âm nền; vang vừa RT60 1,2–2,0 s; vật phát âm có đồng bộ MMO nếu là chuông / trống (08-04 §5) | nghe |
| Cửa | `dien_phu` (mở giờ Mão → hết giờ Tuất) hoặc `luon_mo`; cổng: `son_mon` | test |
| Camera | TRONG nếu khoang có cạnh ngắn ≥ 5 m, ngược lại BỔ DỌC | thử |
| Ảnh | 4 ngoài + 2 trong + 1 đêm | |

### 5.3 Ví dụ hạng B

**Đang có:**

| INT | Công trình | Mô hình | Công năng thật hóa |
|---|---|---|---|
| INT-SM-DIENTAY | Điện Tây Sơn Môn | `hall_main` 22 m | **Vận Mệnh Các** (chuyển từ `ROOMS › vanmenh`) |
| INT-SM-DIENDONG | Điện Đông Sơn Môn | `hall_main` 22 m | **Thái Tuế Điện** (chuyển từ `ROOMS › thaitue`) |
| INT-SM-LAUCHUONG | Lầu chuông (Đông) | `lib_pavilion2` 12 m | đánh chuông sớm giờ Mão, đồng bộ máy chủ |
| INT-SM-LAUTRONG | Lầu trống (Tây) | `lib_pavilion2` 12 m | đánh trống chiều giờ Dậu |
| INT-SM-THAP-TB, -DB | Bảo tháp Bắc | `lib_pagoda5` 26 m | tầng trệt bia tháp, cầu thang lên tầng ngắm, chuông gió theo hành |
| INT-SM-THAP-TN, -DN | Bảo tháp Nam | `lib_pagoda_red` 20 m | tầng trệt + bệ tầng 1; phần trên tháp đặc có khám |
| INT-SM-SONMON | Sơn Môn | `gate_sect` 30 m | phòng gác Tây (Lão Tùng nhập môn), phòng gác Đông, lầu cổng |
| INT-SM-HAUMON | Hậu Môn | `gate_sect` 20 m | hai phòng gác nhỏ |
| INT-HT-THANHMON | Thành môn Huyền Thành | `city_gate` 64 m | vòm cổng, tàng binh động, mã đạo, thành lâu 2 tầng |
| INT-HT-VANPHONG | Văn Phong Tháp (góc Đông Bắc thành) | `lib_pagoda_red` 46 m | tháp phong thủy, bài học hướng Cấn |
| INT-HT-DUPHUONG | Du Phương Lâu (góc Tây Bắc thành) | `lib_pavilion2` 24 m | nhà trọ du phương, ghép đội (§7.12 tổng) |
| INT-HS-DIENDONG, -DIENTAY | Điện phụ Hậu Sơn | `hall_main` 20,4 m | Tĩnh Thất / Giảng Đường |
| INT-HS-THAPDONG, -THAPTAY | Tháp chín tầng Hậu Sơn | `tower_nine` 37,2 m | Bắc Đẩu Lâu / Án Lục Lâu |
| INT-CONG-* (4) | Cổng tông môn trên đường | `sect_gate_grand` 70 m | phòng gác + nhà đón khách tông môn |

**Dự kiến:** Khuê Văn Các (Văn Miếu), gác chuông và tòa Cửu phẩm liên hoa (Bút Tháp), Lão Luật đường và trai đường (Chung Nam), tam tỉnh đường (Long Hổ), trống lâu (Miêu Cương), Vọng Hương đài có phòng (Phong Đô), tàng kinh các (Tạng Địa).

---

## 6. Hạng C — Nhà dân, quán, tiệm

### 6.1 Định nghĩa

Nơi ở hoặc buôn bán của dân thường; mỗi nhà là **một gia đình có lá số** (NPC sinh bằng `npc.js › makeNpc` với hạt giống theo INT id).

### 6.2 Yêu cầu

| Hạng mục | Yêu cầu bắt buộc | Kiểm |
|---|---|---|
| Không gian | Phòng khách (gian giữa, có bàn thờ gia tiên) + ≥ 1 phòng phụ (buồng ngủ hoặc bếp); nhà phố có thêm gian hàng | registry |
| Đồ đạc | Theo **nghề** của chủ nhà (bảng nghề 08-09 §3.4), theo **Hỷ thần** (màu nhấn) và theo **cỡ nhà** | sinh tất định, test hạt giống |
| NPC | Gia đình 2–5 người, có lá số thật (chạy `chart.js › analyze`), lịch sinh hoạt theo giờ | test |
| Tương tác | ≥ 1 án tại chính nhà họ (án mệnh `cases.js › buildCase` hoặc án phong thủy theo **hướng thật của nhà**: `zhai › computeZhai`, `xuankong › xuankongPan`, `fengshui-compass › shanFromDegree`) + ≥ 2 vật tương tác nhỏ (trà, đọc câu đối, ngồi ghế, cho mèo ăn) | test |
| Ánh sáng | Đèn dầu bàn + bếp lửa; tắt từ giờ Tý tới hết giờ Dần (nhà ngủ) | test lịch |
| Âm thanh | Nền sinh hoạt (bếp, nồi, trẻ con, gà) | nghe |
| Cửa | `nha_dan`: mở giờ Thìn → hết giờ Dậu; ngoài giờ gõ cửa (08-03 §6.6) | test |
| Camera | BỔ DỌC (mái + tường mặt trước mờ, 08-03 §7) | thử |
| Ảnh | Mỗi kiểu nhà (08-09 §3): 2 ngoài + 2 trong | |

### 6.3 Ví dụ hạng C

**Đang có:** 36 nhà vườn Huyền Thành (`lib_courtyard`, INT-HT-NHA-01 … 36: 30 nhà dọc phố + 6 nhà vành thành); Tàng Y Các (INT-SM-TANGY, tiệm may của Bà Tư, cần thêm buồng sau); ba trà lâu Cùng Thông Hồ (`tea_pavilion` 34 m: INT-CT-TRALAU-HAN, -NOAN, -TAOTHAP); thủy tạ Điều Hậu (`lib_garden_pav`, INT-CT-THUYTA); Lưng Chừng Quán trên đường núi Tử Bình (`lib_mtn_house` 34 m, INT-NUI-LUNGCHUNG).

**Dự kiến:** nhà sàn treo Miêu Cương, am tranh Vân Cốc (C nhưng là nơi diễn cảnh chính — thỏa thêm yêu cầu cảnh của hạng A về ánh sáng / âm thanh), tăng xá Tạng Địa, quán trọ trạm đò, nhà người giữ cầu Nại Hà.

---

## 7. Hạng D — Kiến trúc nhỏ

### 7.1 Định nghĩa

Đình mở, bài phường, sạp chợ, bệ có mái, đỉnh, bia, tháp đặc, cầu có mái ngắn — không có không gian kín cho người ở.

### 7.2 Yêu cầu

| Hạng mục | Yêu cầu | Kiểm |
|---|---|---|
| Đi lại | Đi qua / đi quanh / đứng dưới mái được. Nền cao (bệ, plinth) phải có bậc và `addPlatform`, không được là khối đặc người chơi dội vào | test va chạm |
| Tương tác | ≥ 1: bia đọc được, chỗ ngồi, điểm ngắm cảnh, chuông gió, sạp bán | test |
| Ánh sáng | ≤ 1 đèn lồng / đèn đá (dùng chung pool ngoài trời) | |
| Âm thanh | Phát âm tại chỗ (chuông gió, nước, người rao) | |
| Camera | Ngoài trời; dưới mái thì giới hạn độ cao camera dưới mái (08-03 §8.5) | |

### 7.3 Ví dụ hạng D

**Đang có:** Trà Thất, La Bàn Đài, Ống Xăm, Lư Hương, Bảng Lịch, Đại Đỉnh, ba bàn «Khách hỏi việc», Bệ Thầy Tử Bình, hồ sen đôi (Sơn Môn); 8 đình sảnh nghề (`lib_wood_pavilion`, INT-SN-*); 6 sạp chợ (`lib_stall_timber`, INT-HT-SAP-01 … 06); bài phường đại lộ Nam (`lib_paifang`, INT-HT-PAIFANG); trạm xe kiệu (INT-HT-TRAMXE); Đại Đỉnh Manh Cốc (`cauldron` cao 22 m, INT-MP-DAIDINH); La Bàn Lớn Phong Thủy Viên (`luopan_stand` cao 18 m, INT-PT-LABAN).

**Dự kiến:** Huyền Nhạc môn (bài phường đá Võ Đang), vườn tháp Huệ Quang (tháp mộ đặc), nhà bia Tiến sĩ Văn Miếu, cầu phong vũ Miêu Cương, bảo tháp chorten Tạng Địa, mani thạch trên đèo, tượng Lão Tử đồng Mao Sơn (đi quanh bệ).

---

## 8. Hạng E — Hạ tầng

### 8.1 Định nghĩa

Tường, nền bậc cấp, bậc, cầu không mái, cổng không phòng, lan can, mặt nước.

### 8.2 Yêu cầu

| Hạng mục | Yêu cầu | Kiểm |
|---|---|---|
| Va chạm | Theo hình khối (`collide.js › addFootprint`) hoặc khối tay (`addSolidRect`); mặt đi được bằng `addPlatform` khớp **đúng** mặt nhìn thấy (sai số ≤ 0,15 m) | test lát cắt + test độ cao |
| Cổng | Lịch `son_mon` / `thanh_mon`; luôn có lối ngách cho người chơi (không bao giờ nhốt người ngoài hub) | test đêm |
| Cầu | Đi trên mặt cầu, lan can chặn mép, không đi xuyên dưới gầm nếu gầm là nước | test |
| Nền bậc | Mỗi tầng nền có `addPlatform` riêng ở **đúng độ cao tầng đó**; không lấy độ cao tầng trên phủ cả nền (lỗi hiện có, 08-10 §1.7) | test độ cao |

### 8.3 Ví dụ hạng E

**Đang có:** tường bao Sơn Môn (INT-SM-TUONG), hai tầng nền đá + 3 dãy bậc + ngự đạo (INT-SM-NEN), tường thành tròn bán kính 158 m (INT-HT-TUONGTHANH), nền bậc cấp Hậu Sơn (INT-HS-NEN) và các vùng, cầu đá Huyền Hà (`lib_stone_bridge` 46 m, INT-CAU-HUYENHA — hiện đặt `solid: false`, người chơi đi xuyên lan can và không có mặt cầu), đường đá.

**Dự kiến:** bậc ngàn bậc Võ Đang, tường đỏ «tử thành» theo sườn núi, cầu Nại Hà ba nhịp, cầu Oa Phong (có đồng tiền treo — tương tác ném xu đưa cầu lên D), hành lang bánh xe kinh (D, vì có tương tác).

---

## 9. Quy định chung cho mọi hạng

### 9.1 Đơn vị, lưới và hệ tọa độ

- Mét thế giới, Bắc = −Z, Đông = +X (`terrain.js`).
- **Lưới gian 3,2 m** (một gian) cho bố cục nội thất; **lưới phụ 0,4 m** (1/8 gian) cho đồ đạc; **lưới va chạm 0,5 m** (`obstacles.js › CELL`) là lưới riêng, không cần khớp lưới gian — va chạm luôn sinh từ hình khối.
- Mỗi công trình có **khung cục bộ**: gốc = tâm khung bao chân mô hình sau khi đặt, trục +Z cục bộ = mặt tiền (cửa chính), xoay `ry` theo cùng quy ước `landmarks.js › local()`.
- Người chơi cao 1,75–1,85 m (`createCharacter('master', { height: 1.85 })`). Thang đo kiến trúc game phóng **× 1,25** so với kích thước thật để camera ngôi thứ ba thoáng.

### 9.2 Kích thước tối thiểu để đi được

| Hạng mục | Tối thiểu | Lý do |
|---|---|---|
| Ô cửa đi (hình học) | 1,8 m rộng × 2,6 m cao (C); 2,4 × 3,2 m (A/B cửa chính) | thân người chặn 5 điểm lệch 0,3 m (`blockedByBuilding`); ô 0,5 m lệch pha mất tới 0,5 m mỗi mép → còn ≥ 0,8 m tự do cho bước A* 0,4 m trong nhà (08-04 §3) |
| Lối đi trong nhà | 1,2 m | như trên |
| Chiều cao thông thủy | 2,8 m (C), 3,6 m (B), 4,8 m (A sảnh) | camera BỔ DỌC / TRONG có chỗ đặt |
| Cầu thang | rộng ≥ 1,2 m; bậc cao 0,2 m, sâu 0,3 m (dốc thường) hoặc 0,25 / 0,25 (thang lầu dốc kiểu lầu các) | test bậc ≤ 0,41 m như `test-game-state › Sơn Môn` |
| Chiếu nghỉ | mỗi ≤ 3,6 m chiều cao | thị giác + camera |
| Khoảng trước cửa | ≥ 2,4 m trống trước mỗi cửa đi (không sạp, cột đèn, cây) | hiện có xung đột: sạp chợ chắn cửa nhà (08-09 §5.2) |

### 9.3 Trạm (station) trong nhà

- Trạm trong nhà mang thêm `bld` (INT id), `cell`, `lv` (tầng) — 08-03 §2.
- `world.js › nearestStation` phải lọc theo `lv` (không bắt trạm ở tầng khác ngay trên đầu).
- Mỗi trạm ghi rõ **engine** hoặc **nhiệm vụ** nó nối tới; trạm không nối gì là trạm làm màu và bị loại ở nghiệm thu.
- **Tương tác nhỏ** (ngồi, đọc biển / bia, ngắm cảnh, gõ chuông gió, cho cá ăn) **không phải trạm**: không vào `STATIONS`, không cần engine, không thưởng Phúc Khí. Hạng D được dùng một tương tác nhỏ làm tương tác tối thiểu; hạng A–C thì tương tác nhỏ chỉ là phần thêm, không tính vào số trạm bắt buộc.

### 9.4 Bản iOS

`features.js › IOS_OFF` tắt gian bói (xăm, sen, quẻ, Vận Mệnh Các, Thái Tuế Điện). Luật số 1 vẫn áp dụng trên iOS: **công trình không được biến thành vỏ rỗng khi tính năng tắt**. Mỗi spec INT có mục «Công năng thay thế iOS» (ví dụ Điện Tây trên iOS là Tàng Thư Các đọc cổ thư `library-data › LIBRARY`).

---

## 10. Bảng đăng ký hạng — toàn bộ công trình đang có

Tọa độ là tâm đặt hiện tại (mét). «Kích thước đặt» = rộng (X cục bộ) × cao × sâu (Z cục bộ) sau khi co giãn, đo từ khung bao GLB thật trong `public/models` (08-02 §5.2). Cột «Lòng đo được» là kết quả lát cắt dải 0,4–2,0 m trên đáy model.

### 10.1 Huyền Quán Sơn Môn (`sect.js`, `court.js`)

| INT | Công trình | Mô hình · fit | Tâm (x, y, z) · ry | Kích thước đặt (m) | Hạng | Lòng đo được | Ghi chú thật hóa |
|---|---|---|---|---|---|---|---|
| INT-SM-CHINHDUONG | Chính Đường | `palace_grand` · width 44 | (0, 4, −31) · 0 | 44 × 31,2 × 26,2 | A | sảnh lõi 20 × 10,5; tầng trên 19 × 13 | 08-07 §2 |
| INT-SM-DIENTAY | Điện Tây → Vận Mệnh Các | `hall_main` · width 22 | (−47, 0, −36) · +π/2 | 22 × 17,1 × 20,2 | B | sảnh 18 × 7,5; gác 15 × 8 | 08-07 §3 |
| INT-SM-DIENDONG | Điện Đông → Thái Tuế Điện | `hall_main` · width 22 | (47, 0, −36) · −π/2 | như trên | B | như trên | 08-07 §4 |
| INT-SM-LAUCHUONG | Lầu chuông | `lib_pavilion2` · width 12 | (47, 0, −9) · −π/2 | 12 × 13,4 × 13,3 | B | trệt 6 × 6; lầu 5 × 5 | 08-07 §5 |
| INT-SM-LAUTRONG | Lầu trống | `lib_pavilion2` · width 12 | (−47, 0, −9) · +π/2 | như trên | B | như trên | 08-07 §6 |
| INT-SM-THAP-TB | Bảo tháp Tây Bắc | `lib_pagoda5` · height 26 | (−53, 0, −58) → **(−51, 0, −56)** | 17,2 × 26 × 17,3 | B | trệt 9 × 9; tầng 7 × 7 | dời 2 m: hiện lấn tường Bắc và tường Tây (08-08 §1) |
| INT-SM-THAP-DB | Bảo tháp Đông Bắc | như trên | (53, 0, −58) → **(51, 0, −56)** | như trên | B | như trên | như trên |
| INT-SM-THAP-TN | Bảo tháp Tây Nam | `lib_pagoda_red` · height 20 | (−53, 0, 58) → **(−49, 0, 56)** | 20,1 × 20 × 17,3 | B | trệt 4 × 4 (đế đặc); tầng 1 7 × 9 | phần trên tháp đặc; hiện lấn tường Nam + Tây (08-08 §2) |
| INT-SM-THAP-DN | Bảo tháp Đông Nam | như trên | (53, 0, 58) → **(49, 0, 56)** | như trên | B | như trên | như trên |
| INT-SM-SONMON | Sơn Môn | `gate_sect` · width 30 | (0, 0, 67,2) · 0 | 30 × 17,4 × 10,9 | B | 2 phòng gác 9,5 × 5; lầu cổng 12 × 3,5 | 08-08 §3 |
| INT-SM-HAUMON | Hậu Môn | `gate_sect` · width 20 | (0, 0, −67,2) · π | 20 × 11,6 × 7,2 | B | 2 phòng 6,3 × 3,3 | 08-08 §4 |
| INT-SM-TANGY | Tàng Y Các | `lib_wood_pavilion` · width 6,2 | (−22, 0, 35,6) · 0 | 6,2 × 6,0 × 4,7 | C | bệ đặc 5 × 3; khám 2,6 × 1,3 | thêm buồng may phía sau (08-08 §5) |
| INT-SM-BANTHAY | Bệ Thầy Tử Bình | `models.js › masterDais` | (0, 4, −11) | 10,4 × — × 6,8 | D | — | giữ tiếp khách ban ngày (08-08 §6) |
| INT-SM-TRATHAT | Trà Thất | `models.js › teaPavilion` | gian `tra` (−40, 0, 24) | ~8 × 3,2 | D | — | 08-08 §7 |
| INT-SM-LABAN | La Bàn Đài | `compassTerrace` | (40, 0, 22) | ~4,8 × 3,2 | D | — | 08-08 §8 |
| INT-SM-XAM | Ống Xăm | `xamAltar` | (−40, 0, 40) | 3,2 × 3,2 | D | — | iOS tắt → Lò Trầm |
| INT-SM-HUONG | Lư Hương | `incenseBurner` | (0, 0, 34) | 3,2 × 1,6 | D | — | |
| INT-SM-LICH | Bảng Lịch Ngày | `calendarBoard` | (40, 0, 40) | 3,2 × 3,2 | D | — | |
| INT-SM-KHACH | Ba bàn Khách hỏi việc | thủ công | (−16, 22), (16, 22), (26, 30) | 1,6 × 1,6 mỗi bàn | D | — | |
| INT-SM-DAIDINH | Đại Đỉnh | `cauldron` · height 5,5 | (0, 0, 27,5) | 5,6 × 5,5 × 3,9 | D | — | |
| INT-SM-HOSEN | Hồ sen Đông (gian `sen`) + Tây | thủ công | (±21, 0, 50) | 24 × 8 mỗi hồ | D | — | |
| INT-SN-HOPHON | Bàn Hợp Hôn | `lib_wood_pavilion` 7 + `scholar_desk` | (−48, 0, 8) | 7 × 6,8 × 5,3 | D | bệ đặc | nằm trong sân Sơn Môn, cánh Tây (08-10 §6) |
| INT-SM-NEN | Hai tầng nền + 3 dãy bậc + ngự đạo | thủ công | L1 (−36…36, −56…8) cao 2; L2 (−28…28, −50…−6) cao 4 | | E | — | |
| INT-SM-TUONG | Tường bao 120 × 132 m | thủ công | | dày 1,4, cao 6,5 | E | — | |

### 10.2 Huyền Thành (`landmarks.js › SPOTS[0]`, `SPOTS` phố chợ)

| INT | Công trình | Mô hình · fit | Tâm · ry | Kích thước đặt (m) | Hạng | Lòng đo được | Ghi chú |
|---|---|---|---|---|---|---|---|
| INT-HT-THANHMON | Thành môn Nam | `city_gate` · width 64 | (0, 0,4, 158) · 0 | 64 × 49,2 × 30,1 | B | thân thành đài **rỗng** 62 × 23 (vỏ Meshy không có lõi); lối giữa 7 m | 08-09 §2 |
| INT-HT-NHA-01 … 30 | Nhà vườn dọc phố | `lib_courtyard` · fit max = s | bảng 08-09 §3.2 | s = 10,0–13,1 rộng; sâu 0,671 s; cao 0,493 s | C | bệ đặc ~1,5 m; sảnh 8,6 × 4,5 (ở s = 11,5) | 08-09 §3 |
| INT-HT-NHA-31 … 36 | Nhà vườn vành thành | `lib_courtyard` | bảng 08-09 §3.2 | s = 9,1–10,9 | C | như trên | |
| INT-HT-SAP-01 … 06 | Sạp chợ đại lộ Nam | `lib_stall_timber` · width 5,5 | x ±10,5; z 80, 102, 124 (Tây) / 91, 113, 135 (Đông) | 5,5 × 7,5 × 4,7 | D | thân sạp **đặc** 5 × 4,5 | phải khoét chỗ người bán + mái hiên đứng dưới được (08-09 §5) |
| INT-HT-PAIFANG | Bài phường đại lộ Nam | `lib_paifang` · width 26 | (0, 0, 104) · 0 | 26 × 11,4 × 17,2 | D | đế đặc 20 × 17 (chừa lối 8 m) | 08-09 §6 |
| INT-HT-VANPHONG | Tháp đỏ góc Đông Bắc → Văn Phong Tháp | `lib_pagoda_red` · height 46 | (112, 0, −96) · 0 | 46,2 × 46 × 39,7 | B | lòng đế 14 × 11; sân thượng 33 × 28; tầng 25 × 22 | 08-09 §7 |
| INT-HT-DUPHUONG | Lầu hai tầng góc Tây Bắc → Du Phương Lâu | `lib_pavilion2` · width 24 | (−112, 0, −96) · 0 | 24 × 26,8 × 26,6 | B | trệt 21 × 21 (gồm hiên); sảnh 13 × 12,5; lầu 17 × 17,5 | 08-09 §8 |
| INT-HT-TUONGTHANH | Tường thành tròn R 158 | thủ công (64 đoạn) | tâm (0, 0) | cao 14, dày 5 | E | — | 08-09 §9 |
| INT-HT-TRAMXE | Trạm xe kiệu ngoài cửa thành | `lib_cart` + `lib_horse` | (10, —, 180) | | D | — | |

### 10.3 Hậu Sơn (`palaceComplex` scale 0,6 tại (0, −116))

| INT | Công trình | Mô hình · fit | Tâm · ry | Kích thước đặt (m) | Hạng | Lòng đo được | Ghi chú |
|---|---|---|---|---|---|---|---|
| INT-HS-CHINHDIEN | Chính Điện Tam Thanh | `cliff_palace` · width 55,2 | (0, 5,76, −124,64) · 0 | 55,2 × 21,5 × 15 | A | sảnh trệt 52,6 × 12,9 | 08-10 §1 |
| INT-HS-DIENDONG | Điện phụ Đông → Tĩnh Thất | `hall_main` · width 20,4 | (32,4, 5,76, −107,36) · −π/2 | 20,4 × 15,8 × 18,7 | B | sảnh 16,7 × 7 | chìa ra ngoài tầng nền trên (08-10 §1.7) |
| INT-HS-DIENTAY | Điện phụ Tây → Giảng Đường | như trên | (−32,4, …) · +π/2 | như trên | B | như trên | |
| INT-HS-THAPDONG | Tháp Đông → Bắc Đẩu Lâu | `tower_nine` · height 37,2 | (37,8, 5,76, −143,36) | 14,8 × 37,2 × 14,9 | B | phòng trệt 6 × 6,5; các tầng 8 × 8 | chìa ra ngoài tầng nền trên |
| INT-HS-THAPTAY | Tháp Tây → Án Lục Lâu | như trên | (−37,8, …) | như trên | B | như trên | |
| INT-HS-NEN | Nền bậc cấp 90 × 72, 3 tầng | thủ công | (0, —, −116) | mặt trên 5,76 | E | — | sửa nền một mặt phẳng phủ cả 3 tầng |

### 10.4 Sảnh nghề (`landmarks.js › HALLS`)

| INT | Sảnh | Tâm (x, z) | Thành phần | Hạng | Gắn công trình A của vùng |
|---|---|---|---|---|---|
| INT-SN-TRACH | Sảnh Trạch Nhật | (735, −36) | đình `lib_wood_pavilion` 7 m + án thư + bonsai + xe + ngựa + 2 cột đèn | D | INT-LD-DAIDIEN |
| INT-SN-DUONGTRACH | Sảnh Dương Trạch | (−806, 62) | như trên | D | INT-PT-DAIDIEN |
| INT-SN-DIEUHAU | Sảnh Điều Hậu | (480, 420) | như trên | D | INT-CT-THUYTA |
| INT-SN-THUVIEN | Thư Lâu (bàn đọc) | (0, −630) | như trên + 2 kệ sách | D | INT-TL-THULAU |
| INT-SN-HOPHON | Bàn Hợp Hôn | (−48, 8) | đình + án thư + bonsai (không xe) | D | — (trong sân Sơn Môn) |
| INT-SN-TUVI | Sảnh Tử Vi | (−567, 503) | như sảnh thường | D | INT-TT-QUANTINH |
| INT-SN-TUONGPHAP | Sảnh Tượng Pháp | (654, −441) | như trên | D | INT-MP-DAIDIEN |
| INT-SN-CACHCUC | Sảnh Cách Cục | (−521, −538) | như trên | D | INT-TB-CHINHDIEN |

### 10.5 Công trình vùng (`landmarks.js › SPOTS`)

| INT | Công trình | Mô hình · fit | Vị trí | Kích thước đặt (m) | Hạng |
|---|---|---|---|---|---|
| INT-TB-CHINHDIEN | Chính Điện Tử Bình Phong | `cliff_palace` · width 170 | tâm vùng `tubinh`, nền 190 × 160 | 170 × 66 × 46 | A |
| INT-TB-THAPDONG, -THAPTAY | Tháp chín tầng Tử Bình | `tower_nine` · height 80 | cục bộ (±88, 40) | 31,7 × 80 × 31,9 | B |
| INT-MP-DAIDIEN | Đại Điện Manh Cốc | `palace_grand` · width 69 | `palaceComplex` 0,75 | 69 × 48,9 × 41,1 | A |
| INT-MP-DIENDONG, -DIENTAY | Điện phụ Manh Cốc | `hall_main` · width 25,5 | | 25,5 × 19,8 × 23,4 | B |
| INT-MP-THAPDONG, -THAPTAY | Tháp Manh Cốc | `tower_nine` · height 46,5 | | 18,5 × 46,5 × 18,6 | B |
| INT-MP-SONMON | Cổng Manh Cốc | `sect_gate_grand` · width 34,5 | | 34,5 × 22 × 20 | B |
| INT-MP-DAIDINH | Đại Đỉnh Manh Cốc | `cauldron` · height 22 | (710, —, −460) | 22,5 × 22 × 15,8 | D |
| INT-TT-QUANTINH | Quan Tinh Đài | `observatory` · width 90 | tâm `trichthien`, nền 120 × 120 | 90 × 36,7 × 82,7 | A |
| INT-TT-CUUTANG | Tháp chín tầng Trích Thiên | `tower_nine` · height 110 | cục bộ (0, −70) | 43,6 × 110 × 43,9 | B |
| INT-TT-NGUTANG | Tháp năm tầng Trích Thiên | `lib_pagoda5` · height 52 | cục bộ (75, 20) | 34,4 × 52 × 34,6 | B |
| INT-CT-TRALAU-HAN, -NOAN, -TAOTHAP | Ba trà lâu ven hồ | `tea_pavilion` · width 34 | bờ hồ hướng (−1,−1), (−1, 0,2), (0,2, −1) | 34 × 20,6 × 31,5 | C |
| INT-CT-THUYTA | Thủy tạ Điều Hậu | `lib_garden_pav` · width 16 | (462, —, 402) | 16 × 9,2 × 15,7 | C |
| INT-TL-THULAU | Thư Lâu Cửu Tầng | `tower_nine` · height 112 | tâm `thulau`, nền 110 × 110 | 44,4 × 112 × 44,7 | A |
| INT-TL-TANGTHU-DONG, -TAY | Tàng Thư Các | `library_tower` · height 48 | cục bộ (±42, 30) | 51,2 × 48 × 48,9 | B |
| INT-PT-DAIDIEN | Đại Điện Phong Thủy Viên | `palace_grand` · width 55,2 | `palaceComplex` 0,6 | 55,2 × 39,1 × 32,9 | A |
| INT-PT-DIENDONG, -DIENTAY | Điện phụ | `hall_main` · width 20,4 | | | B |
| INT-PT-THAPDONG, -THAPTAY | Tháp | `tower_nine` · height 37,2 | | | B |
| INT-PT-SONMON | Cổng | `sect_gate_grand` · width 27,6 | | 27,6 × 17,6 × 16 | B |
| INT-PT-LABAN | La Bàn Lớn | `luopan_stand` · height 18 | (−820, —, 50) | 16,5 × 18 × 9 | D |
| INT-LD-DAIDIEN, -DIENDONG, -DIENTAY, -THAPDONG, -THAPTAY, -SONMON | Quần thể Lịch Đường | như Phong Thủy Viên | `palaceComplex` 0,6 | | A / B |
| INT-NUI-LUNGCHUNG | Lưng Chừng Quán | `lib_mtn_house` · width 34 | (−430, —, −330) | 34 × 26,8 × 33,9 | C |
| INT-CONG-TUBINH, -MANH, -TRICHTHIEN, -CUNGTHONG | Cổng tông môn trên đường | `sect_gate_grand` · width 70 | trên đường tới 4 vùng | 70 × 44,6 × 40,7 | B |
| INT-CAU-HUYENHA | Cầu đá Huyền Hà | `lib_stone_bridge` · width 46 | giữa `RIVER[2]` và `RIVER[3]` | 46 × 8,3 × 8,7 | E |

### 10.6 Điện ngoài bản đồ sẽ giải thể (`world.js › ROOMS`)

| `ROOMS` id | Tên | Cửa hiện tại | Origin ngoài bản đồ | Chuyển vào |
|---|---|---|---|---|
| `chinhdien` | Chính Điện Tam Thanh | (0, −84) | (1500, 0) | INT-HS-CHINHDIEN |
| `vanxuong` | Văn Xương Các | (0, −652) | (1600, 0) | INT-TL-THULAU tầng trệt |
| `daumau` | Đẩu Mẫu Điện | (−566, 566) | (1700, 0) | INT-TT-QUANTINH |
| `laoquan` | Lão Quân Điện | (−564, −510) | (1800, 0) | INT-TB-CHINHDIEN |
| `vanmenh` | Vận Mệnh Các | (−38,6, −40) | (1900, 0) | INT-SM-DIENTAY |
| `thaitue` | Thái Tuế Điện | (38,6, −40) | (2000, 0) | INT-SM-DIENDONG |

---

## 11. Ngoại lệ «cảnh nền xa»

| Đối tượng | Vị trí | Vì sao được miễn | Khi nào hết miễn |
|---|---|---|---|
| Thiên Bàn Đảo (`sky_palace`) | `terrain.js › SKY_ISLAND` (0, 300), cao 460 m | Không có đường, không trạm; chỉ ngự kiếm thấy từ xa | Khi mở Côn Lôn (tài liệu 07 cấp `BLD-conlon-*`); khi đó phải thật hóa trước khi cho hạ cánh |
| 4 đảo đá trôi (`rock_island`) | quanh thành, cao 170–270 m | Không có công trình, không đường | Không áp dụng |
| 22 khối núi chân trời (`render3d.js`, chóp nón cách 2.600–3.300 m) | rìa thế giới | Ngoài biển mây | Không áp dụng |
| Thuyền neo trên hồ Cùng Thông (`boat` × 5) | mặt hồ | Là phương tiện, không phải công trình; không có bến | Khi có bến đò: thuyền gần bến lên hạng D (đứng được trên boong) |

**Ngự kiếm** (`mount.js`): khi bay, người chơi nhìn thấy mái mọi công trình. Luật: **không hạ cánh lên mái** (va chạm mái chặn hạ cánh, 08-04 §2.7) và **không bay vào trong nhà** (tự xuống kiếm ở ngưỡng cửa — hiện `main.js` đã tắt bay khi vào điện có `st.room`).

---

## 12. Ngân sách hiệu năng theo hạng

«Máy tầm trung» = mức chất lượng `mid` của `world3d.js › QUALITY` trên iPhone 12 / Galaxy A54 / laptop Intel Iris Xe; mục tiêu ≥ 30 khung/giây khi đứng trong khoang lớn nhất của công trình.

### 12.1 Theo công trình

| Hạng | Tam giác vỏ (mid / hd / lod) | Tam giác nội thất trong tầm nhìn | Draw call nội thất | Texture nội thất (mid) | Đèn động / khoang | Bộ nhớ GPU thêm khi nạp |
|---|---|---|---|---|---|---|
| A | ≤ 140k / 300k / 15k | ≤ 120k | ≤ 110 | atlas bộ mô-đun 2 × 1024² + ≤ 3 hero 1024² (tượng: 2048² trên `high`) | ≤ 4 | ≤ 48 MB |
| B | ≤ 80k / 150k / 10k | ≤ 60k | ≤ 60 | atlas bộ + ≤ 1 hero | ≤ 3 | ≤ 24 MB |
| C | ≤ 80k (nhân bản tức thời) | ≤ 25k | ≤ 35 | atlas `MOD-DAN` 1024² dùng chung | ≤ 2 | ≤ 8 MB / nhà, ≤ 3 nhà |
| D | ≤ 30k | ≤ 10k | ≤ 12 | dùng chung | ≤ 1 (pool ngoài trời) | ≤ 4 MB |
| E | theo khối | — | — | — | 0 | — |

### 12.2 Theo cảnh (tổng khung hình)

| Mức | Tổng tam giác trên màn | Tổng draw call | `POOL_N` đèn điểm (`render3d.js`) | Bóng |
|---|---|---|---|---|
| `low` | ≤ 500k | ≤ 220 | 6 | mặt trời 1024², không bóng đèn điểm |
| `mid` | ≤ 900k | ≤ 350 | 10 | mặt trời 1536² |
| `high` | ≤ 1,6 triệu | ≤ 550 | 16 | mặt trời 2048² |

Đo bằng `render3d.js › info()` (`renderer.info.render`), kịch bản đo ở 08-12 §5.

### 12.3 Quy tắc tiết kiệm bắt buộc

1. Nội thất **gộp theo vật liệu** (`models.js › mergeStatic`) theo từng khoang, không gộp xuyên khoang (để ẩn được từng khoang).
2. Mảnh mô-đun lặp ≥ 4 lần trong một khoang → `InstancedMesh` (như `assets.js › instanceModel`).
3. Đạo cụ tương tác **không gộp** (cần xoay, sáng, ẩn riêng) — tính vào ngân sách draw call.
4. Khoang không thấy qua cửa nhìn → `visible = false` (08-03 §4); không chỉ dựa frustum culling.
5. Đèn điểm không đổ bóng; bóng trong nhà lấy từ mặt trời qua mái (mái mờ vẫn đổ bóng, 08-03 §7.4).
