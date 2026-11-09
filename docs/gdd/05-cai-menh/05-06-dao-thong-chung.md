# 05-06 · Đạo thống — luật chung của chín con đường

> Phần này là **luật chung** cho mọi đạo thống: suất tu, hạng, Đạo Hạnh theo đạo, ái lực Dụng thần, giới, điểm Tu Bổ, thi thăng hạng, viên mãn, quy tắc đa đạo, sư đồ trong đạo, lịch lễ. Chi tiết từng đạo (thang hạng riêng, ≥ 15 nhiệm vụ `CQ-<đạo>-xx`, giới, dữ liệu app mỗi nút dạy, kịch bản nhập môn và viên mãn) ở các phần:
>
> | Phần | Đạo |
> |---|---|
> | 05-07 | Chính Nhất · Thanh Vi / Đan Đỉnh |
> | 05-08 | Toàn Chân / Linh Bảo · Thượng Thanh / Lư Sơn |
> | 05-09 | Bắc Đế / Động Uyên · Thiền (Trúc Lâm) |
> | 05-10 | Tịnh Độ / sám hối · Mật (Chuẩn Đề) |
> | 05-11 | Nho / Tịnh Minh · Bàng môn (Miêu Cương) · Pháp Môn Liễu Phàm |
>
> Engine: `` `schools-data › SCHOOLS` `` (12 phái), `COMPARE_DIMS` (9 chiều), `compareMatrix`, `` `daozang-data › suggestDaozangChartAware` `` / `_YONG2CULT` / `_PATTERN2CULT` / `_AMTA2CULT`, `` `spiritual-fs › WX_PRACTICES` ``, `` `cultivation-data › CULTIVATION` ``, `` `remedy-fate` `` (`DAO_JIA`, `GAI_XIN`, `CHAN_HUI`, `ZHUNTI`, `TEN_THIEN`).

---

## 1. Danh sách đạo thống

### 1.1 Mười con đường và một pháp môn

| Mã | Đạo thống | Phái trong `schools-data` | Thánh địa (canon) | NPC dẫn | Tu gì (canon §5.6) | Tu Bổ (canon «tăng chỉ số») |
|---|---|---|---|---|---|---|
| CN | **Chính Nhất** (+ Thần Tiêu) | `zhengyi`, `shenxiao` | `longho` | `truong_thiensu` | kết phù 5 phần, thụ lục, bái Đẩu, trai tiếu | Định Lực · Nghệ đạo |
| TV | **Thanh Vi · Đan Đỉnh** | `qingwei`, `danding` | `vodang` | `huyen_hu`, `dan_dinh` | tĩnh tọa theo hơi thở, nội đan 4 bậc (tên), Thái Cực | Nguyên Khí · Sinh Cơ |
| TC | **Toàn Chân · Linh Bảo** | `quanzhen`, `lingbao` | `chungnam` | `khau_daotruong` | giới luật, vân du, khoa nghi, Đạo Tạng | Định Lực · Học đạo |
| TT | **Thượng Thanh · Lư Sơn** | `maoshan`, `lushan` | `maoshan` | `maoshan_daonhan` | tồn tư, trừ tà chính tông, thu kinh cứu người | Tuệ Kiếm · công đức |
| BD | **Bắc Đế · Động Uyên** (+ Địa Tạng) | `beidi`, `dongyuan` | `phongdo` | `phan_quan`, `diatang_su` | siêu độ, giải oan, đọc sổ nghiệp | giảm nghiệp |
| TH | **Thiền** (Trúc Lâm) | — (`GAI_XIN`, `spiritual-fs`; cần bổ sung Trúc Lâm) | `yentu` | `truclam_thiensu` | thiền định, công án, hành hương | Định Lực · tâm ma |
| TD | **Tịnh Độ · sám hối** | — (`CHAN_HUI`, `JING_ZHOU`, `TEN_THIEN`, `liudao`) | `buttap` | `dieu_am` | niệm Phật, phóng sinh, bố thí, sám hối, Cửu phẩm | công đức · Phúc phận |
| MT | **Mật · Chuẩn Đề** | — (`ZHUNTI`, `CHAN_HUI[1]`; Tạng truyền **chờ tham vấn**) | `tangdia` | `lama_dakiet` | quán tưởng, mạn-đà-la cát, bánh xe kinh | Linh Tuệ · vô thường |
| NH | **Nho · Tịnh Minh** | `jingming` | `vanmieu` | `te_tuu` | khoa cử, công quá cách, đạo hiệu, hiếu đạo | Học đạo · Trị đạo |
| BM | **Bàng môn · Vu Y** (đạo phụ) | — (`tcm`; hư cấu mới) | `mieucuong` | `vu_y_amau` | y dược theo ngũ hành (giảng), chuyện xưa | — |
| LP | **Pháp Môn Liễu Phàm** (không phải đạo thống) | — (`ZHUNTI.how`, `CONG_QUA`) | `vancoc` | `van_coc` | Chuẩn Đề + công quá cách + tích thiện + hồi hướng | — |

**Phái của `schools-data` không có đạo riêng:** `fangshi` (Phương Sĩ / Ẩn Sĩ) — «không phải phái tổ chức» (`distinctive`). Trong game là NPC Phương Sĩ Vô Danh dẫn lộ Dị Cách (tài liệu 03), không có thang hạng.

### 1.2 Đối chiếu chín chiều (`COMPARE_DIMS`) — dùng để viết thoại và dựng thánh địa

Mỗi đạo thống Đạo giáo kế thừa đúng 9 chiều của phái gốc. Tài liệu 07 (kiến trúc) và 06 (persona) đọc bảng này; 05 dùng cột «Thụ lục / truyền độ» và «Xuất gia / cư sĩ» để dựng thang hạng.

| Chiều (`key`) | Chính Nhất (`zhengyi`) | Thanh Vi (`qingwei`) | Toàn Chân (`quanzhen`) | Mao Sơn (`maoshan`) | Lư Sơn (`lushan`) | Bắc Đế (`beidi`) | Động Uyên (`dongyuan`) | Linh Bảo (`lingbao`) | Tịnh Minh (`jingming`) | Đan Đỉnh (`danding`) | Thần Tiêu (`shenxiao`) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `ordination` (thụ lục / truyền độ) | 受箓 hệ (đô công / minh uy / tam động / ngũ nhạc) | 受箓 thanh vi, nặng nội đan | truyền độ + tam đàn đại giới | 受箓 thượng thanh | truyền pháp hồng đầu | truyền bắc đế / phong đô pháp | truyền thần chú | 受箓 linh bảo, nặng khoa nghi | truyền «trung hiếu» | sư–đệ khẩu quyết | truyền lôi pháp |
| `monastic` | cư sĩ / hỏa cư | cả hai | **xuất gia** nghiêm | cả hai | cư sĩ pháp sư | đạo sĩ trừ tà | đạo sĩ chuyển kinh | cả hai | **cư sĩ** nặng | cả hai | cả hai |
| `coreMethod` (rút) | phù lục, bái Đẩu, giải ách | lôi pháp «nội đan thể, phù chú dụng» | nội đan, công khóa, tĩnh tọa | trừ tà, phù 5 đoạn, tồn tư, bộ cương | cứu sản hộ thai, thu kinh | trừ quỷ, thiên bồng | chuyển kinh cứu tế | khoa nghi trai tiếu | trung hiếu, tịnh minh tâm | nội đan, dưỡng sinh | ngũ lôi chính pháp |

**Cách game dùng chiều `ordination` / `monastic`:**
- Đạo có thụ lục (Chính Nhất, Thanh Vi, Mao Sơn, Linh Bảo) → thang hạng là **lục** (bằng cấp phép).
- Đạo xuất gia nghiêm (Toàn Chân) → thang hạng là **giới đàn**.
- Đạo cư sĩ (Tịnh Minh, Lư Sơn) → thang hạng là **đức / pháp sự**, không đòi giới xuất gia.
- **Game không cho người chơi «xuất gia»** thật sự theo nghĩa rời bỏ đời sống: hạng Toàn Chân là giới **trong game**, đi kèm luật chơi; người chơi vẫn đi mọi nơi, làm mọi việc khác.

---

## 2. Suất tu và nhập môn

### 2.1 Ba suất

| Luật | Nội dung |
|---|---|
| ST-1 | Mỗi người chơi có **3 suất đạo thống chính** đang tu cùng lúc (canon §5.6). |
| ST-2 | **Bàng môn Vu Y** và **Pháp Môn Liễu Phàm** không chiếm suất. |
| ST-3 | Đạo **viên mãn** (hạng V) trả lại suất: đạo chuyển trạng thái «đã thành», giữ danh hiệu, giữ khả năng nhận đệ tử trong đạo, không còn giới thường trực bắt buộc (vẫn được tự giữ). |
| ST-4 | **Hoàn đạo** (rời đạo khi chưa viên mãn): hạng và Đạo Hạnh của đạo **đóng băng** (không mất); suất trống ngay; muốn tu lại cùng đạo phải chờ **14 ngày** và làm lễ trở lại (không phải nhập môn lại). |
| ST-5 | Đổi suất tối đa **1 lần / 14 ngày** (chống nhảy đạo để lấy thưởng nhập môn). Thưởng nhập môn (`CQ-<đạo>-01`) chỉ nhận **một lần đời** mỗi đạo. |
| ST-6 | Đạo **chính** (dùng để gọi tên cảnh giới, 05-01 §4.1) là đạo đầu tiên đạt hạng II; người chơi đổi được đạo chính bất cứ lúc nào trong số đạo đã đạt hạng II. |

### 2.2 Điều kiện nhập môn

| Đạo | Cảnh giới tối thiểu | Điều kiện khác | Lý do |
|---|---|---|---|
| CN, TV, TC, TH, TD, NH | 1 | đã tới thánh địa | đạo «cửa mở» |
| TT (Mao Sơn) | 2 | đã xong `CQ-MD-70` (ba việc thiện đầu) | trừ tà chính tông cần nền đức trước |
| BD (Phong Đô) | 4 (thánh địa xa; canon §9.1 mở Phong Đô «lộ cứu người» ở bậc 5 — đạo BD mở sớm hơn một bậc cho phần học, phần cứu người vẫn bậc 5) | không có Nợ Âm > 0 khi nhập (người đang ở Tà Lộ vào Phong Đô theo chuỗi Hồi Đầu, không theo đạo BD) | |
| MT | 5 (canon: Tạng Địa mở ở bậc 5); **bản trước tham vấn**: nhập ở gian Chuẩn Đề Bút Tháp từ bậc 2, chỉ có phần Chuẩn Đề | | |
| BM | 1 | — | đạo phụ |

### 2.3 Lễ nhập môn

- Mỗi đạo có một nhiệm vụ nhập môn `CQ-<đạo>-01` gồm: gặp NPC dẫn, nghe giảng 9 chiều của phái (rút từ `SCHOOLS`), nhận **một giới thường trực đầu tiên**, làm lễ.
- **Ngày lễ:** người chơi được (không bắt buộc) chọn ngày bằng sảnh Trạch Nhật (`CQ-MD-32`, 05-02) → Phù Cát Nhật cho lễ.
- Lễ nhập môn không tốn Phúc Khí; một số đạo có **lễ vật tượng trưng** mua bằng Phúc Khí giá thấp (≤ 30) — không bao giờ bằng Ngọc.

---

## 3. Hạng trong đạo

### 3.1 Thang chung năm hạng

Mỗi đạo có tên hạng riêng (ở phần của đạo), nhưng **ngưỡng và cấu trúc chung**:

| Hạng | Đạo Hạnh **trong đạo** (ĐH-đạo) | Nhiệm vụ đạo cần xong | Giới đã giữ | Thi | Ý nghĩa |
|---|---|---|---|---|---|
| 0 · Khách | 0 | — | — | — | chưa nhập môn; xem được thánh địa, nghe giảng |
| I | 0 | `CQ-<đạo>-01` | giới thường trực 1 | — | nhập môn |
| II | 150 | `-01 … -05` | giữ trọn 7 ngày ≥ 1 lần | kiểm tri (10 câu) | **đắc môn** — tính cho điều kiện cảnh giới 3 / 4 |
| III | 450 | `-01 … -10` | giới thường trực 2; không án giới chưa sửa | kiểm hành + lễ | **đắc pháp** — tính cho **Quy nhất** |
| IV | 1.000 | `-01 … -14` | giới thường trực 3 | kiểm tâm + lễ | **thành sư** — nhận đệ tử trong đạo; điều kiện cảnh giới 5 |
| V | 1.800 | `-01 … -15` + nhiệm vụ viên mãn | — | lễ viên mãn | **viên mãn** — trả suất (ST-3) |

### 3.2 Đạo Hạnh trong đạo (ĐH-đạo)

- **ĐH-đạo** là phần Đạo Hạnh **sinh ra từ hoạt động của đạo đó** (tu, học, nghi lễ, nhiệm vụ `CQ` của đạo, sau khi nhân k, a, n — 05-01 §3.1). Nó **không** là tiền riêng: mỗi điểm ĐH-đạo cũng là một điểm của tổng Đạo Hạnh.
- **Quy về đạo nào:** hoạt động tại thánh địa của đạo, do NPC của đạo dẫn, hoặc gắn nhãn đạo (vd tụng Thanh Tĩnh Kinh tính cho TC hoặc TV tùy người chơi đang tu đạo nào; nếu tu cả hai thì tính cho đạo có hạng thấp hơn — giúp đạo chậm đuổi kịp).
- **Việc thiện (Sổ Công Quá):** Đạo Hạnh từ DEED tính vào tổng, **không** vào ĐH-đạo — trừ hai đạo coi việc thiện là pháp tu chính: **Tịnh Độ** (phóng sinh, bố thí, chay) và **Nho · Tịnh Minh** (hiếu, giữ lời, khuyên thiện). Với hai đạo này, ĐH từ DEED thuộc nhóm tương ứng tính **cả** vào ĐH-đạo (gán, không nhân đôi).
- Phạm giới của đạo trừ Đạo Hạnh ở tổng **và** ở ĐH-đạo của đạo đó với cùng lượng.

### 3.3 Bốn loại thi

| Loại | Hình thức | Nguồn đề | Qua khi |
|---|---|---|---|
| **Kiểm tri** | 10 câu trắc nghiệm / ghép | dữ liệu app của đạo (bảng «dạy» ở mỗi nhiệm vụ) | ≥ 7 / 10; thi lại sau 24 giờ, đề xáo |
| **Kiểm hành** | đếm việc đã làm trong 30 ngày qua | nhật ký hoạt động | đủ số theo đạo |
| **Kiểm tâm** | mini-game tâm của đạo ở độ khó cao | tài liệu 09 | đạt «viên» (không có thất bại; chưa đạt thì thử lại hôm sau) |
| **Lễ** | nghi lễ thăng hạng ở điện chính của đạo | — | luôn qua (lễ là khoảnh khắc, không phải thử thách) |

### 3.4 Viên mãn

- Điều kiện: ĐH-đạo ≥ 1.800, đủ 15 nhiệm vụ chuỗi, nhiệm vụ viên mãn riêng (thường là một việc **cho người khác** — dạy, cứu, xây).
- Phần thưởng: danh hiệu đạo («{đạo hiệu} · {danh hiệu viên mãn}»), một món thẩm mỹ của đạo (không bán ở Tàng Y Các), dòng tên khắc ở điện chính của đạo, quyền nhận đệ tử dù cảnh giới < 4.
- **Không** thưởng Đạo Hạnh cục lớn (tránh «viên mãn để nhảy cảnh giới»): viên mãn cho `B = 100` như một nhiệm vụ lớn.

---

## 4. Ái lực Dụng thần

### 4.1 Nguồn

`daozang › _YONG2CULT` cho mỗi hành Dụng một hướng tu và từ khóa:

| Dụng | `practice` (app, rút) | `kw` (app) |
|---|---|---|
| Mộc | dẫn khí sinh phát, thiền hành tẩu, nhân từ (仁) | 导引, 养生, 青, 木, 肝, 仁, 东方 |
| Hỏa | tồn thần, niệm chú, quang minh thiền, lễ độ (礼) | 神咒, 金光, 心, 礼, 南方, 火, 存神, 光明 |
| Thổ | nội đan trung cung, tĩnh tọa, tín thực (信) | 黄庭, 中, 脾, 信, 土, 胎息, 中丹 |
| Kim | điều tức thu khí, nội quán, nghĩa khí (义) | 调息, 肺, 义, 西方, 金, 收气, 内观 |
| Thủy | tĩnh tọa, thai tức, tàng tinh, trí tuệ (智) | 胎息, 肾, 智, 北方, 水, 藏, 静坐 |

`spiritual-fs › WX_PRACTICES[x].chanting` thêm phần Phật: Mộc — A Di Đà, Địa Tạng; Hỏa — Quán Âm, Đại Bi, Pháp Hoa; Thổ — Địa Tạng, Lăng Nghiêm; Kim — Dược Sư, Kim Cang; Thủy — **Chuẩn Đề**, Lăng Già.

### 4.2 Hành của từng đạo (game gán theo hai nguồn trên)

| Đạo | Hành chính (+10% khi = Dụng) | Hành phụ (+5% khi = Hỷ, hoặc khi hành chính = Hỷ) | Căn cứ |
|---|---|---|---|
| Chính Nhất | Hỏa | Kim | thần chú, Kim Quang chú, lễ độ (`_YONG2CULT.火`); pháp ấn, kiếm (Kim) |
| Thanh Vi · Đan Đỉnh | Mộc | Thổ | 导引 养生 (Mộc); 黄庭 胎息 trung đan (Thổ) |
| Toàn Chân · Linh Bảo | Thổ | Kim | 黄庭, tĩnh tọa, tín thực = giới luật (Thổ); 内观, nghĩa (Kim) |
| Thượng Thanh · Lư Sơn | Hỏa | Thủy | 存神, 光明 (Hỏa); tồn tư sâu (Thủy) |
| Bắc Đế · Động Uyên | Thủy | Kim | 北方, 藏 (Thủy); thu, nghĩa (Kim) |
| Thiền | Kim | Thủy | 内观, 调息 (Kim); 静坐 (Thủy); Kim Cang kinh (`WX_PRACTICES.金`) |
| Tịnh Độ | Mộc | Thổ | A Di Đà (`WX_PRACTICES.木`); Địa Tạng (Thổ) |
| Mật · Chuẩn Đề | Thủy | Hỏa | Chuẩn Đề (`WX_PRACTICES.水`); Đại Bi (Hỏa) |
| Nho · Tịnh Minh | Mộc | Hỏa | 仁 (Mộc), 礼 (Hỏa) — đức gốc Nho |
| Bàng môn Vu Y | Mộc | Thủy | thảo dược (Mộc), nước suối (Thủy) |

**Mỗi hành có ít nhất một đạo chính:** Mộc (TV, TD, NH), Hỏa (CN, TT), Thổ (TC), Kim (TH), Thủy (BD, MT).

### 4.3 Tính `a`

```
a(đạo) = 0,10 nếu hành_chính(đạo) = yong.primary
       = 0,05 nếu hành_chính(đạo) = yong.xi  hoặc  hành_phụ(đạo) = yong.primary
       = 0    nếu khác
```

- Chỉ áp cho ĐH sinh từ hoạt động của đạo đó (05-01 §3.1).
- **Lỗi engine cần sửa trước:** `suggestDaozangChartAware` đọc `R?.yong?.god` nhưng engine dùng `R.yong.primary` (bản sơ đồ, Phụ lục B.2). Game **không** gọi qua hàm đó để lấy hành; đọc thẳng `R.yong.primary` / `R.yong.xi`. Phần gợi ý kinh theo Dụng (`out.yongAdvice`, `extraKinh`) chỉ dùng sau khi engine sửa.
- **Không bắt buộc:** Sổ Mệnh gợi ý «đạo hợp Dụng» bằng một dấu sao nhỏ; không khóa đạo nào. Lời Vân Cốc: «Hợp thì đi nhẹ chân hơn. Không hợp thì đi lâu hơn. Đường nào cũng tới.»

*(Luật rõ: hành chính tính khi bằng Dụng (10%) hoặc Hỷ (5%); hành phụ chỉ tính khi bằng **Dụng** (5%); hai điều kiện cùng đúng thì lấy mức cao hơn, không cộng.)*

**MAU-A** (Dụng Thủy, Hỷ Kim):

| Đạo | Chính / phụ | Khớp | `a` |
|---|---|---|---|
| Bắc Đế | Thủy / Kim | chính = Dụng | 0,10 |
| Mật | Thủy / Hỏa | chính = Dụng | 0,10 |
| Thiền | Kim / Thủy | chính = Hỷ (5%), phụ = Dụng (5%) → lấy 5% | 0,05 |
| Thượng Thanh | Hỏa / Thủy | phụ = Dụng | 0,05 |
| Bàng môn | Mộc / Thủy | phụ = Dụng | 0,05 |
| Chính Nhất | Hỏa / Kim | phụ = Hỷ — không tính | 0 |
| Toàn Chân | Thổ / Kim | phụ = Hỷ — không tính; chính = Kỵ | 0 |
| Thanh Vi, Tịnh Độ, Nho | Mộc / … | không khớp | 0 |

### 4.4 Gợi ý theo cách cục (`_PATTERN2CULT`)

`_PATTERN2CULT` có lời khuyên tu theo 10 cách (正官格…劫财格). Game dùng làm **câu dẫn** của NPC khi người chơi nhập môn bất kỳ đạo nào — không đổi cơ chế. Lưu ý engine đọc `R.pattern.name` (MAU-A: `七殺格` — khóa trong bảng là `七杀格` giản thể, **không khớp**; cần chuẩn hóa chữ trước khi tra — thêm vào danh sách sửa engine).

| Cách | Câu dẫn khi nhập môn (rút từ `_PATTERN2CULT`) |
|---|---|
| Chính Quan | «Con tu cần khiêm cần. Đạo nào cũng vậy, đạo này càng vậy.» |
| Thất Sát | «Khí con mạnh. Tu là để chế ngự, không phải để mạnh thêm.» |
| Chính Ấn | «Con có duyên đọc. Đừng chỉ đọc.» |
| Thiên Ấn | «Con thích chỗ vắng. Vắng thì được, u uất thì không.» |
| Thực Thần | «Con vốn an nhiên. Giữ cho nó tự nhiên.» |
| Thương Quan | «Tài con nhiều. Bớt cái "ta" một chút.» |
| Chính Tài | «Con thực tế. Đem cái thực tế ấy đi bố thí.» |
| Thiên Tài | «Con hào phóng nhưng dễ tán. Giữ sổ cho đều.» |
| Tỷ Kiên | «Con tự lực. Học thêm cúi đầu.» |
| Kiếp Tài | «Đừng tu để hơn người.» |

---

## 5. Giới

### 5.1 Hai loại giới

| Loại | Hiệu lực | Ví dụ |
|---|---|---|
| **Giới thường trực** | mọi lúc, mọi nơi, khi đạo đang trong suất | Toàn Chân: không uống rượu |
| **Giới đạo tràng** | chỉ trong vùng thánh địa của đạo hoặc trong lúc làm nghi lễ của đạo | Tịnh Độ: trong Bút Tháp chỉ ăn chay |

Mỗi đạo có 3 giới thường trực (mở dần theo hạng I, III, IV) và 2–4 giới đạo tràng. Danh mục ở phần từng đạo.

### 5.2 Giới chung cho mọi đạo (thường trực từ hạng I của **bất kỳ** đạo nào)

| Giới chung | Thẻ giới hiện khi | Phạm khi |
|---|---|---|
| Không bán phù, kinh, lễ cho NPC / người chơi lấy lời | mở quầy bán vật phẩm có thẻ «pháp khí» | bán với giá > giá gốc |
| Không dọa người bằng nghiệp, ma, hạn | phương án hội thoại có thẻ `doa` | chọn phương án đó |
| Không nhận tiền để «đổi mệnh» cho ai | lời mời của Định Mệnh Hội | nhận |

Đây là phiên bản trong game của quy tắc an toàn §6.4 bản sơ đồ («không bán cải mệnh»): người chơi có đạo cũng phải theo đúng luật NPC phải theo.

### 5.3 Giới chay (giới có nhiều đạo dùng)

| Đạo | Chay thường trực | Chay đạo tràng | Ghi chú |
|---|---|---|---|
| Toàn Chân | **có** (hạng I) | — | đạo xuất gia |
| Tịnh Độ | từ hạng III | có (Bút Tháp) | |
| Thiền | — | có (Yên Tử) | |
| Mật | — | có (Tạng Địa) | |
| Chính Nhất | — | chỉ ngày trai tiếu và mùng 1 / Rằm | đạo sĩ hỏa cư |
| Thanh Vi · Đan Đỉnh | — | trong lò đan Võ Đang | |
| Nho, Bắc Đế, Thượng Thanh, Bàng môn | không | không | |

**Kiểm chay:** chỉ kiểm món người chơi **chủ động gọi** ở quán / trai đường. Không có món mặn tự rơi vào người chơi. Đang giữ chay mà gọi món mặn → thẻ giới hiện trước khi chọn.

### 5.4 Nhiều đạo, nhiều giới

- Giới của mọi đạo đang trong suất cộng lại (hợp tập). Không có xung đột vì giới chỉ **cấm**, không bắt làm điều trái nhau.
- Phạm một hành động vi phạm giới của **hai** đạo: trừ theo giới của **từng** đạo (05-01 §3.7), nhưng tổng một hành động ≤ 2 lần trừ.
- Thẻ giới gộp: «Giới Toàn Chân + Tịnh Độ: không ăn mặn. Vẫn gọi?»

---

## 6. Tu Bổ — điểm Hậu Thiên chồng lên chỉ số

Canon §5.6 ghi mỗi đạo «tăng chỉ số». Nhưng chỉ số Tiên Thiên là lá số, **không đổi** (trụ cột T1). Game giải quyết bằng **Tu Bổ**: một lớp điểm Hậu Thiên hiển thị **chồng** lên thanh chỉ số, màu khác, không sửa số gốc. Tài liệu 04 là chuẩn về việc chỉ số dùng để làm gì; phần này chỉ quy định **nguồn** từ đạo thống.

| Luật | Nội dung |
|---|---|
| TB-1 | Mỗi hạng của đạo cho **+3 Tu Bổ** vào mỗi chỉ số của đạo (cột cuối bảng 1.1). Hạng V = +15. |
| TB-2 | Trần **+15 / chỉ số** cộng từ mọi đạo. Tu hai đạo cùng tăng Định Lực không vượt +15. |
| TB-3 | Tu Bổ **không** ảnh hưởng Đạo Hạnh, công, cảnh giới, Phúc Khí. |
| TB-4 | Tu Bổ dùng cho: tham số mini-game liên quan (vd Định Lực rộng khung tĩnh tọa ≤ 5%), mở lựa chọn hội thoại có điều kiện (vd Tuệ Kiếm ≥ x mới nhận ra lời lừa tinh vi) — danh mục do tài liệu 04 / 09 lập. |
| TB-5 | Chỉ số «không phải thanh» (công đức, tâm ma, nghiệp, vô thường, Phúc phận) đổi thành hiệu ứng riêng (bảng 6.1). |

### 6.1 Tu Bổ cho «chỉ số» đặc biệt

| Đạo | Canon ghi | Cách hiện thực |
|---|---|---|
| Thượng Thanh · Lư Sơn | công đức | mỗi hạng: +1 trần nhóm T-CN / ngày (05-03 CC-2) — cứu người được nhiều hơn |
| Bắc Đế · Động Uyên | giảm nghiệp chướng | mỗi hạng: nghi lễ của BD giảm thêm 5% / sự vụ (trần +25%) |
| Thiền | tâm ma | mỗi hạng: tạp niệm tâm ma giảm 10% tần suất (trần −50%) |
| Tịnh Độ | công đức · Phúc phận | mỗi hạng: +1 trần nhóm T-PS / T-BT; Phúc phận không đổi (Tiên Thiên) — thay bằng huy hiệu «Phúc Điền» |
| Mật | vô thường | mỗi hạng: mở một tầng mạn-đà-la cát (thẩm mỹ, không chỉ số) |

---

## 7. Hoạt động lõi và nhịp

Mỗi đạo có **3 hoạt động lõi** lặp lại (để có việc mỗi ngày) và **chuỗi 15 nhiệm vụ** (để có chuyện). Bảng tổng `B` mỗi phiên (chi tiết ở phần đạo; cân bằng ở 05-14 §2):

| Đạo | Hoạt động lõi 1 | `B` | Hoạt động lõi 2 | `B` | Hoạt động lõi 3 | `B` |
|---|---|---|---|---|---|---|
| CN | kết phù (ghép 5 phần) | 10 | bái Đẩu (lễ sao) | 12 | trực đàn Thiên Sư Phủ | 8 |
| TV | tĩnh tọa hơi thở | 12 | Thái Cực (nhịp động) | 10 | canh lò đan | 8 |
| TC | công khóa sớm tối | 10 | đọc Đạo Tạng | 10 | khoa nghi Linh Bảo | 14 |
| TT | tồn tư (ánh sáng) | 12 | trực «hỏi việc lạ» | 10 | thu kinh cho trẻ (Lư Sơn, chuỗi cứu) | 14 |
| BD | thắp đèn dẫn đường | 8 | chuyển kinh | 10 | giải oan (án âm) | 16 |
| TH | thiền | 12 | công án | 10 | hành hương bậc đá | 10 |
| TD | niệm Phật | 10 | sám hối (05-05) | 20–30 | phóng sinh / bố thí (DEED) | theo DEED |
| MT | trì Chuẩn Đề | 10 | mạn-đà-la cát | 14 | quay bánh xe kinh | 6 |
| NH | học / thi | 12 | công quá cách (đọc sổ, tự xét) | 8 | hiếu đạo (DEED) | theo DEED |
| BM | hái thuốc theo hành | 8 | nghe chuyện xưa | 6 | sắc thuốc (canh lửa) | 10 |

Mọi phiên chịu nhật hạn 120 / 200 gốc (05-01 §3.3).

---

## 8. Sư đồ trong đạo

| Luật | Nội dung |
|---|---|
| SĐ-1 | Người chơi **hạng IV** (thành sư) của một đạo nhận tối đa **3 đệ tử** trong đạo đó (khác với sư đồ chung của canon §10 theo cảnh giới ≥ 4; hai hệ cùng tồn tại). |
| SĐ-2 | Đệ tử thăng hạng II / III / IV → sư phụ +3 / +5 / +8 công hữu hiệu (vào T-GN «Giúp người khó khăn»), chịu nhật hạn công. |
| SĐ-3 | Sư phụ **không** thi hộ, không làm nhiệm vụ hộ; mọi điều kiện đệ tử phải tự đạt. Sư phụ có thể **cùng làm** nhiệm vụ có bước tổ đội. |
| SĐ-4 | Sư phụ viên mãn (hạng V) mà đệ tử cũng viên mãn → danh hiệu «Truyền Đăng» cho sư phụ. |
| SĐ-5 | Một người không được làm sư phụ của tài khoản liên kết với mình (chống tự nuôi; máy chủ kiểm thiết bị / thanh toán — tài liệu 13). |

---

## 9. Lịch lễ theo đạo

Lễ chung theo lịch âm thật (canon §10) cộng với lễ riêng. Tài liệu 10 cấp mã sự kiện `EV-*`; ở đây chỉ ghi để chuỗi đạo tham chiếu.

| Ngày (âm lịch, trừ ghi chú) | Lễ | Đạo | Việc trong lễ (đạo) |
|---|---|---|---|
| Rằm tháng Giêng | Thượng Nguyên — Thiên quan tứ phúc | CN, TC | dâng đèn; tụng Tam Quan Kinh (DEED-182) |
| 15/2 | vía Thái Thượng Lão Quân | mọi đạo Đạo giáo | tụng Thanh Tĩnh Kinh tập thể |
| 3/3 | vía Huyền Thiên Thượng Đế (Chân Vũ) | TV (Võ Đang) | lễ ở Kim Đỉnh |
| 8/4 (hoặc Rằm tháng Tư theo truyền thống Việt) | Phật đản | TH, TD, MT | tắm Phật; tuần chay (DEED-130) |
| 15/7 | Trung Nguyên — Vu Lan — Địa quan xá tội | BD, TD | Phong Đô mở lối cứu người; thả đèn |
| 30/7 | vía Địa Tạng | BD, TD | Lễ Soi Sổ tập thể |
| 9/9 | Trùng Cửu — Đẩu Mẫu | CN | bái Đẩu ở Đẩu Mẫu Điện (đã có) |
| 15/10 | Hạ Nguyên — Thủy quan giải ách | CN, BD | lễ ở Cùng Thông Hồ |
| 1/11 (tượng trưng) | ngày giỗ Trần Nhân Tông (Trúc Lâm) | TH | hành hương đêm lên Chùa Đồng *(ngày thật: 1/11 âm — tài liệu 07 xác minh với cố vấn)* |
| Ngày Nhà giáo / giỗ Khổng Tử (27/8 âm) | Tết thầy | NH | khoa thi đặc biệt |
| 16/3 | vía Chuẩn Đề (theo truyền thống Hán truyền phổ biến) | MT | trì 1.000 biến tập thể *(cần cố vấn xác nhận ngày dùng trong game)* |
| Lập Xuân | đổi niên chủ | mọi | an Thái Tuế (05-02) |

---

## 10. Đạo Lộ — trang giao diện

- Sổ Mệnh › **Đạo Lộ**: ba cột suất (đạo đang tu), mỗi cột: biểu tượng đạo, tên hạng, thanh ĐH-đạo tới hạng kế, danh sách điều kiện thăng hạng, giới đang giữ (đếm ngày giữ trọn), nhiệm vụ chuỗi kế tiếp.
- Hàng dưới: đạo «đã thành» (viên mãn), đạo «đóng băng», đạo phụ (Bàng môn, Liễu Phàm).
- Dấu sao «hợp Dụng» cạnh tên đạo (§4).
- Nút «So các đạo»: mở **ma trận đối chiếu** `compareMatrix(ids)` (9 chiều) cho các đạo người chơi chọn — đúng tính năng app, không bình luận hơn kém (TT-8).

---

## 11. Dữ liệu app mỗi đạo dạy (bản đồ tổng)

| Đạo | Engine / dữ liệu dạy qua nhiệm vụ |
|---|---|
| CN | `SCHOOLS.zhengyi`, `shenxiao`; `talisman-data` (`FU_ZHENGYI_BEIDOU`, `FA_BAIDOU`, `FA_SHUFU`, `FA_FAYIN`, `FA_FAQI` — chỉ cấu trúc); `amta-data › ritualsZhengYi` (bái Đẩu, giải ách, phù lục); `remedy-songjing` (Bắc Đẩu Kinh); `taisui` (an Thái Tuế) |
| TV | `SCHOOLS.qingwei`, `danding`; `DAO_JIA[1..2]`; `CULTIVATION` (`DAN_CANTONG_QI`, `DAN_WUZHENPIAN`, `GONG_DAOYIN`, `GONG_TUNA`, `DAN_BAOPUZI`, `GONG_BIGU` — **cảnh báo**); `FA_LEIFA` (tên, ý nghĩa) |
| TC | `SCHOOLS.quanzhen`, `lingbao`; `DAO_JIA[0]` Thanh Tĩnh Kinh; `CULTIVATION.DAN_QINGJING_JING`, `DAN_NEIGUAN_JING`, `DAN_YUNJI_QIQIAN`; `DAOZANG` (topic `philosophy`, `classic`, `ritual`; bộ 洞真 / 洞玄 / 洞神 / 太玄…); `_DZ_FIX` (giới văn: 三洞众戒文, 三坛圆满天仙大戒) |
| TT | `SCHOOLS.maoshan`, `lushan`; `FU_MAOSHAN_XIE` (5 đoạn, cấu trúc), `FU_LUSHAN_SHOUJING`, `FA_SHOUJING_TW`; `amta-data` (`ritualsMaoShan`, `ritualsLuShan`, `spiritTypes`, `indicators` — opt-in, `ETHICS`); `CULTIVATION.GONG_CUNXIANG`; `FA_GANGBU` |
| BD | `SCHOOLS.beidi`, `dongyuan`; `ZHOU_BEI_DI_TIAN_PENG`, `ZHOU_DONG_YUAN` (tên, ý nghĩa); `JING_ZHOU[1]` Địa Tạng; `CHAN_HUI[3]`; `meritLedger` (đọc sổ); `suggestDaozangByAmTa` (từ khóa 救度/超度/解冤) |
| TH | `GAI_XIN` (5 bước, 4 chìa); `DAO_JIA[3]`; `JING_ZHOU[2]` Kim Cang; `spiritual-fs` (thiền theo hành); `SIX_REALMS` (khuynh hướng); **Trúc Lâm: cần bổ sung dữ liệu** |
| TD | `CHAN_HUI` (cả 5), `CHANHUI_PRINCIPLE`, `JING_ZHOU` (7), `TEN_THIEN`, `CONG_QUA`, `liudao`, `remedy-fangsheng` |
| MT | `ZHUNTI` (principle, how, fit — `mantra` chỉ hiện thẻ), `CHAN_HUI[1]`, `REMEDY_METHODS[0]`; **Tạng truyền: chờ tham vấn** |
| NH | `SCHOOLS.jingming`; `LIAOFAN` (4 thiên), `LIAOFAN_STORY`, `REMEDY_QUOTES`; `TEN_THIEN`; `CONG_QUA`, `meritLedger`; `naming` (đạo hiệu); `library-data`, `cases.js` (khoa cử); `spiritual-fs` (nhân, lễ, tín, nghĩa, trí theo hành) |
| BM | `tcm` (`WUX_ZANG`, `DIET`, `seasonalHealth`, `MERIDIAN_CLOCK` — **chỉ giảng văn hóa**, không chẩn bệnh); `amta-data` (đối trọng); hư cấu mới |

---

## 12. Mẫu đặc tả chuỗi 15 nhiệm vụ (dùng ở 05-07 … 05-11)

Mỗi đạo có bảng chuỗi với cột:

| Cột | Ý nghĩa |
|---|---|
| Mã | `CQ-<mã đạo>-01 … -15`, thêm `-V` cho nhiệm vụ viên mãn |
| Tên | |
| Mục tiêu | việc máy nhiệm vụ kiểm |
| Mở | hạng / điều kiện để nhận |
| Dạy | dữ liệu app |
| Thưởng | `B` (ĐH gốc), vật phẩm thẩm mỹ, mở khóa |

**Phân bố chuẩn trong chuỗi:** 01 nhập môn · 02–05 nền (hạng I → II) · 06–10 pháp (II → III) · 11–14 thực hành cho người (III → IV) · 15 + V viên mãn. Tổng `B` của chuỗi ≈ 600–700 (≈ 35% ĐH-đạo tới hạng V; phần còn lại từ hoạt động lõi).

---

## 13. Ca biên

| Ca | Xử lý |
|---|---|
| Người chơi muốn tu đạo thứ 4 khi 3 suất đầy | phải hoàn đạo một suất (ST-4) hoặc viên mãn một đạo (ST-3) |
| Hoàn đạo trong lúc có án giới của đạo đó | án giới vẫn còn, vẫn sám hối lấy lại được (ở đạo khác: dùng Lễ Tịnh Kim Cang hoặc Lễ Sám Tinh Thần) |
| Hai đạo cùng có nhiệm vụ ở một điện | nhiệm vụ của mỗi đạo độc lập; một hành động có thể thỏa hai nhiệm vụ nếu cả hai ghi rõ |
| Đạo MT trước tham vấn | thang chỉ tới hạng III (Chuẩn Đề); hạng IV–V mở sau tham vấn. **Quy nhất không cần MT** |
| iOS | các đạo giữ; mọi nút có bói (bái Đẩu bản mệnh, an Thái Tuế, chiêm) thay bằng nút học (05-14 §6) |
| Người chơi không muốn đạo nào | vẫn chơi trọn: Pháp Môn Liễu Phàm + Mệnh Đồ + Sổ Công Quá đưa tới bậc 5; bậc 6 cần Quy nhất (≥ 3 đạo hạng III) — đây là lựa chọn thiết kế có chủ đích (Côn Lôn là «quy nhất») |

---

## 14. Checklist nghiệm thu 05-06

- [ ] 3 suất; Bàng môn và Liễu Phàm không chiếm suất; đổi suất ≤ 1 lần / 14 ngày; thưởng nhập môn 1 lần đời mỗi đạo.
- [ ] Ngưỡng ĐH-đạo 0 / 150 / 450 / 1.000 / 1.800; quy ĐH về đạo đúng luật §3.2.
- [ ] `a` đọc `yong.primary` / `yong.xi` trực tiếp; bảng hành của đạo như §4.2; MAU-A cho BD 10%, MT 10%, TH / TT / BM 5%.
- [ ] Giới chung §5.2 áp cho mọi người có đạo; chay chỉ kiểm món người chơi gọi.
- [ ] Tu Bổ không chạm Đạo Hạnh; trần +15 / chỉ số.
- [ ] Sư đồ trong đạo: hạng IV, tối đa 3 đệ tử, không làm hộ.
- [ ] Ma trận so đạo dùng `compareMatrix`, không có bình luận hơn kém.
