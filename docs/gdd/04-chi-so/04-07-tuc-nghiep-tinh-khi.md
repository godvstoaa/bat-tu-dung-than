# 04-07 · Túc Nghiệp, tâm ma, Tính Khí, nạp âm, cờ tổ hợp

## 1. Phạm vi và lời miễn trừ

Phần này gồm các chỉ số **kể chuyện**: chúng đổi giọng thoại, mở cảnh, gắn cờ cốt truyện; chỉ ba thanh tâm ma có số tác động lối chơi.

Lời miễn trừ của engine (`liudao.js › computeLiuDao().disclaimer`) là bắt buộc, hiện **nguyên văn** ở «Vì sao?» của Túc Nghiệp:

> «Đồng bộ dân gian — chỉ suy ra KHUYNH HƯỚNG tu học từ tính cách lá số, KHÔ đoán nẻo tái sinh (Phật giáo: nẻo do nghiệp thân-khẩu-ý).»

(Chữ «KHÔ» là lỗi gõ của engine cho «KHÔNG»; game hiển thị «KHÔNG» và báo lỗi về engine.)

## 2. `STAT-TUCNGHIEP` — Túc Nghiệp (Lục Đạo)

### 2.1 Công thức engine

`computePoisons(R)` đếm thập thần (can lộ 1, tàng can 0,5) và ngũ hành (can 1, tàng 0,5) trực tiếp từ trụ, rồi:

| Thành phần | Công thức thô | Ghi chú |
|---|---|---|
| Tham 贪 | 2,4 × (正財 + 偏財) · +4 nếu thân nhược và Tài ≥ 2 · +2 nếu Kim + Hỏa ≥ 4 | |
| Sân 嗔 | 3 × 七殺 + 2 × 傷官 · +3 nếu Hỏa ≥ 2,5 · +2 nếu thân vượng có Sát · +2 × số sao hung (`yangRen`, `zaiSha`, `xueRen`…) · +2 × số hình | |
| Si 痴 | +4 nếu Thổ ≥ 1,5 · +4 nếu không có Ấn · +3 nếu không có Thực/Thương · +1 nếu Thủy ≥ 3 | |
| Thiện | 3 × 正官 + 2,5 × 正印 + 1,2 × 正財 · +4 nếu `effRatio` ∈ [0,35; 0,65] | |
| Định | 3 × 正印 + 2 × 偏印 | |
| Bố | 3 × 食神 + 1,5 × 傷官 | |
| Chuẩn hóa | `clamp(round(thô × 100 / 15), 0, 100)` | |

Điểm sáu cõi:

| Cõi | Công thức | Độc chủ |
|---|---|---|
| 天道 Thiên | 0,5 thiện + 0,5 định | mạn |
| 人道 Nhân | 0,5 thiện + 0,2 bố + 0,3 × (100 − trung bình tam độc) | — |
| 阿修罗道 A Tu La | 0,5 bố + 0,5 sân | đố kỵ / sân |
| 畜生道 Súc Sinh | 0,8 si | si |
| 饿鬼道 Ngạ Quỷ | 0,9 tham | tham |
| 地狱道 Địa Ngục | 0,7 sân + 0,2 si + 0,1 tham | sân |

`primary` = cõi điểm cao nhất (hòa → cõi đứng trước theo thứ tự trên).

### 2.2 Sáu cõi trong game — khung «hồi quang»

Phân bố thật (5.000 lá): Nhân 38,0% · **Địa Ngục 32,0%** · Ngạ Quỷ 19,2% · Thiên 6,6% · A Tu La 4,1% · Súc Sinh 0,2%.

Vì một phần ba người chơi rơi vào Địa Ngục Đạo, mọi cõi được kể theo hướng **đi lên**: Túc Nghiệp là **nơi linh hồn xuất phát**, không phải tội. Đây là hư cấu tham khảo cho phần mở đầu (canon §5), không phải giáo lý.

| Cõi | Tên Túc Nghiệp (game) | Cảnh mở đầu (03 viết chi tiết) | Đối trị (`SIX_REALMS.remedy`) | NPC đón | Danh hiệu khi «chuyển» |
|---|---|---|---|---|---|
| 天道 | **Thiên Nhân Hạ Phàm** | một vị trời hết phúc, chọn xuống làm người để tu tiếp | tu khiêm nhường, xả mạn | Thầy Tử Bình | «Hạ Mình» |
| 人道 | **Nhân Gian Tái Thế** | một người tu dở dang kiếp trước, trở lại đúng chỗ | trì ngũ giới, tu thập thiện | Lão Tùng | «Kiếp Này Trọn» |
| 阿修罗道 | **Tu La Buông Kiếm** | một chiến binh mệt mỏi vì tranh đấu, đặt kiếm ở cổng | tu hỷ xả, buông đố kỵ | Thiền sư Trúc Lâm | «Buông Kiếm» |
| 畜生道 | **Linh Thú Khai Trí** | một con hạc ở Côn Lôn nghe kinh trăm năm, được thân người | khai trí, học pháp, tin nhân quả | Tế tửu Văn Miếu | «Khai Trí» |
| 饿鬼道 | **Ngạ Quỷ Được Cơm** | một linh hồn đói được người cúng một bát cơm, nhớ ơn mà sinh lại | tu bố thí, buông tham | Ni sư Diệu Âm | «Biết Đủ» |
| 地狱道 | **Địa Ngục Hồi Quang** | một linh hồn được Địa Tạng dắt ra khỏi bóng tối, mang theo ánh đèn | tu từ bi, nhẫn nhục, buông sân | Địa Tạng sứ giả (gặp lại ở Phong Đô, Hồi IV) | «Hồi Quang» |

Quy tắc trình bày:

- Không dùng chữ «tội», «đọa», «báo ứng» ở mặt chính. «Vì sao?» hiện tên cõi gốc + `realm.desc` + lời miễn trừ.
- Người chơi có thể **ẩn** Túc Nghiệp (Cài đặt › Riêng tư); khi ẩn, cảnh mở đầu dùng bản «Nhân Gian Tái Thế».
- Cõi 畜生道 chỉ 0,2%: game không dùng chữ «súc sinh» ở mặt chính (dùng «Linh Thú»).

### 2.3 Kiểm chứng

| Mẫu | Cõi | Tham | Sân | Si | Thiện | Định | Bố |
|---|---|---|---|---|---|---|---|
| `MAU-A` | Nhân | 29 | 37 | 27 | 26 | 30 | 10 |
| `MAU-C` | Địa Ngục | 29 | 57 | 27 | 45 | 43 | 20 |
| `MAU-D` | Địa Ngục | 0 | 80 | 27 | 45 | 37 | 40 |
| `MAU-E` | Ngạ Quỷ | 56 | 23 | 27 | 51 | 27 | 10 |
| `MAU-I` | Nhân | 24 | 33 | 27 | 100 | 30 | 5 |
| `MAU-N` | Địa Ngục | 37 | 90 | 27 | 20 | 17 | 35 |

## 3. `STAT-TAMMA-*` — ba thanh tâm ma

### 3.1 Đặc tả

| Mục | Giá trị |
|---|---|
| Nguồn | `computeLiuDao(R).poisons.{tham, san, si}` |
| Giá trị khởi đầu | bằng điểm engine (0–100) |
| Lớp | Tiên Thiên làm **điểm xuất phát**; Hậu Thiên làm **giảm** (và 05 có thể làm tăng qua `KARMA-*`) |
| Lưu | `hauThien.tamMa = { tham: Δ, san: Δ, si: Δ }` — lưu **độ lệch** so với gốc, không lưu số tuyệt đối (để Sửa bát tự xử lý đúng, 04-11 §9) |
| Hiển thị | ba ngọn lửa nhỏ quanh hình nhân vật trong Sổ Mệnh: Tham (vàng đục), Sân (đỏ sẫm), Si (xám khói); độ cao ngọn = giá trị |
| Phân bố gốc | Tham trung vị 29 · Sân trung vị 53 · Si trung vị 27 (5.000 lá) |

Không có thanh nào là «máu». Thanh cao **không** làm người chơi yếu đi; nó làm **ải tâm ma của người đó dài hơn và thưởng nhiều hơn**.

### 3.2 Ải tâm ma

```
số tầng ải[độc] = 1 + floor(giá trị / 25)        // 0–24 → 1 tầng … 100 → 5 tầng
công tu mỗi tầng = 20 (× NT, × R3 nếu là ải Kỵ)
```

| Giá trị | Tầng | Công tu tối đa (trước NT) |
|---|---|---|
| 0–24 | 1 | 20 |
| 25–49 | 2 | 40 |
| 50–74 | 3 | 60 |
| 75–99 | 4 | 80 |
| 100 | 5 | 100 |

Dương Nhận cộng thêm 1 tầng cho ải Sân (04-06 §3.6). Định Lực (Thổ) T4 cho «nhịp thở dự phòng» trong mỗi tầng.

### 3.3 Giảm tâm ma (đối trị)

| Độc | Việc đối trị (05 cấp `DEED-*`) | Giảm mỗi lần | Hệ số «hạt giống lành» |
|---|---|---|---|
| Tham | bố thí, phóng sinh, nhường phần | −2 | × (1 + **bố** / 200) |
| Sân | nhẫn nhục khi bị NPC khiêu khích, sám hối, công án | −2 | × (1 + **định** / 200) |
| Si | học kinh, giải án đúng, khoa cử | −2 | × (1 + **thiện** / 200) |

Vượt một tầng ải tâm ma: −5 vào độc đó. Không giảm dưới 0. Ba độc đều ≤ 10 → danh hiệu **«Tam Độc Tiêu»**.

Thiền định: loại tạp niệm bay qua (hình ảnh của minigame tĩnh tọa, 09) chọn ngẫu nhiên **theo tỉ trọng** ba thanh hiện tại — người Sân cao thấy nhiều tạp niệm «giận», người Tham cao thấy «muốn». Tần suất tạp niệm **không** phụ thuộc thanh (để không thành phạt).

### 3.4 Ải «Mạn» (độc thứ tư, chỉ là ải)

Mạn (ngã mạn) là độc chủ của Thiên Đạo (`SIX_REALMS['天道'].poison`). Không có thanh; có **một ải** ở Côn Lôn cho:

- người chơi Túc Nghiệp Thiên Đạo; hoặc
- Phẩm căn Dị Linh Căn / Thiên Linh Căn (04-02 §4.3).

Ải Mạn là ải duy nhất **không** cho công tu; thưởng là được vào bậc 6 và danh hiệu «Thiên Tứ» / «Hạ Mình». Ải là chuỗi lựa chọn nhường người khác (nhường lượt, nhường vinh danh).

## 4. `STAT-TINHKHI` — Tính Khí theo nhật chủ

### 4.1 Đặc tả

| Mục | Giá trị |
|---|---|
| Nguồn | `personality-profile › getPersonalityProfile(R)` → `profile.{temperament, strengths, weaknesses, social, love, career, health, finance}` theo `R.chart.dayGan` |
| Dùng trong game | `temperament`, `strengths`, `weaknesses`, `social` |
| **Không** dùng | `health`, `finance`, `love`, `career` — tránh phán sức khỏe, tiền bạc, tình cảm, nghề nghiệp đời thực (T6). Thầy AI có thể dẫn khi người chơi **tự hỏi**, theo quy tắc của 06. |
| Tác động | cờ giọng thoại `tone`; phản ứng NPC; một móc nhiệm vụ cá nhân từ `weaknesses` |

### 4.2 Mười Tính Khí

| Can | `temperament` (rút gọn engine) | Cờ giọng | Lựa chọn thoại mẫu khi Thầy hỏi «Con đến đây làm gì?» | Lựa chọn khi từ chối một NPC | NPC hợp giọng | Móc từ điểm yếu |
|---|---|---|---|---|---|---|
| 甲 | đại thụ — chính trực, có chí, lãnh đạo | `truc` | «Con muốn đứng vững như một cái cây.» | «Không được. Việc này không đúng.» | Khâu đạo trưởng | «Cành mềm»: một việc phải đổi kế hoạch giữa chừng |
| 乙 | dây leo — mềm dẻo, khéo, trực giác | `nhu` | «Con đi theo duyên, thầy chỉ chỗ nào con theo chỗ đó.» | «Để con nghĩ thêm, rồi con báo.» | Ni sư Diệu Âm | «Tự đứng»: một quyết định không hỏi ai |
| 丙 | mặt trời — nhiệt thành, hào sảng | `nhiet` | «Con muốn làm cho chỗ này sáng lên!» | «Thôi, không đâu — nhưng mai con giúp việc khác!» | Trương Thiên Sư | «Lửa nhỏ»: một việc phải giữ bí mật đến cuối |
| 丁 | ngọn đèn — ấm, tinh tế, nội tâm sâu | `te` | «Con… muốn hiểu mình hơn.» | «Con xin lỗi, con không làm được.» | Thiền sư Trúc Lâm | «Nói ra»: nói thật một nỗi lo với một NPC |
| 戊 | núi cao — vững, bao dung, đáng tin | `tram` | «Con đến để học. Học lâu cũng được.» | «Không.» (rồi im) | Huyền Hư chân nhân | «Núi dời»: chấp nhận đổi một thói quen |
| 己 | ruộng — ôn hòa, cần mẫn, nuôi dưỡng | `hoa` | «Con muốn có ích cho ai đó.» | «Con sợ làm người ta buồn, nhưng lần này con không làm.» | Vu y bà A Mậu | «Từ chối được»: từ chối một lời nhờ quá sức |
| 庚 | sắt thép — cương nghị, quả cảm | `cuong` | «Con muốn biết cái gì là thật.» | «Không. Hết.» | Mao Sơn đạo nhân | «Vỏ kiếm»: thắng một cuộc tranh luận mà không làm ai đau |
| 辛 | châu ngọc — thanh tú, cầu toàn | `thanh` | «Con muốn làm một việc cho thật đẹp.» | «Việc đó chưa đủ tốt để con nhận.» | Tế tửu Văn Miếu | «Ngọc thô»: hoàn thành một việc «chưa hoàn hảo» và để nó yên |
| 壬 | sông biển — thông tuệ, phóng khoáng | `phong` | «Con đi khắp nơi rồi, nghe nói ở đây có cái hay.» | «Lần khác nhé, con còn đi nhiều chỗ.» | Phương sĩ Vô Danh | «Đập nước»: ở yên một vùng trọn một tuần |
| 癸 | mưa móc — kín, nhu thuận, tưởng tượng | `tinh` | «…Con chỉ muốn ngồi đây một lúc.» | «(cúi đầu, không nói)» | Lạt-ma Đa Kiệt | «Lên tiếng»: chủ động nói trước ở một buổi nhóm |

Quy tắc dùng cờ giọng:

1. Mỗi lựa chọn thoại có thể mang thẻ giọng; lựa chọn đúng giọng của người chơi hiện **ở trên cùng**, các giọng khác vẫn chọn được (không khóa lựa chọn).
2. NPC «hợp giọng» thêm +2 thiện cảm khi người chơi chọn đúng giọng mình — đây là phần thưởng cho việc **sống thật với tính**, không phải phạt việc khác.
3. Móc «điểm yếu» là nhiệm vụ cá nhân tùy chọn; hoàn thành → danh hiệu nhỏ + 30 công tu. Không bắt buộc, không nhắc quá một lần mỗi tuần.

## 5. `STAT-NAPAM` — danh xưng nạp âm nhật trụ

### 5.1 Đặc tả

| Mục | Giá trị |
|---|---|
| Nguồn | `nayin-personality › dayNayinPersonality(R)` → `nayin`, `vi`, `nature`, `traits`, `strength`, `weakness`, `compat`, `avoid` |
| Khóa | `R.chart.pillars.day.nayin` (do `lunar-javascript` tính, chữ giản thể); đã kiểm cả 30 nạp âm của 60 Giáp Tý đều có trong bảng engine |
| Tác động | danh xưng dưới tên (tùy bật), một câu giới thiệu khi gặp NPC lần đầu, **«Đồng tu duyên»** |
| Đồng tu duyên | khi hai người chơi tĩnh tọa / làm việc chung mà nạp âm của người này nằm trong `compat` của người kia: cả hai +5% công tu [R1]. `avoid` **không** có tác dụng nào (không phạt «khắc»); chỉ mở một câu thoại vui «hai người khắc khí mà lại hợp việc» |

### 5.2 Ba mươi nạp âm

| Nạp âm | Giáp Tý | `vi` (engine) | `nature` (engine) | Danh xưng (game) | Câu giới thiệu | `compat` (engine) |
|---|---|---|---|---|---|---|
| 海中金 | 甲子 乙丑 | Kim Trong Biển | ẩn mình, kiên nhẫn, tích lũy | **Hải Để Kim** | «Vàng nằm dưới biển — ai tìm thì thấy.» | 泉水/天河/大溪 |
| 炉中火 | 丙寅 丁卯 | Lửa Trong Lò | nhiệt huyết, quyết tâm, rèn luyện | **Lô Trung Hỏa** | «Lửa trong lò — cần củi, cho ra thép.» | 大林木/松柏木 |
| 大林木 | 戊辰 己巳 | Gỗ Cây Lớn | che chở, phát triển, uy tín | **Đại Lâm Mộc** | «Cây lớn — chim đậu thì che.» | 覆灯火/山头火 |
| 路旁土 | 庚午 辛未 | Đất Ven Đường | phục vụ, kiên nhẫn, thực tế | **Lộ Bàng Thổ** | «Đất ven đường — người đi qua, đường còn đó.» | 涧下水/泉中水 |
| 剑锋金 | 壬申 癸酉 | Kim Mũi Kiếm | sắc bén, quyết đoán, trực diện | **Kiếm Phong Kim** | «Mũi kiếm — cần vỏ, cần đá mài.» | 天河/大海 |
| 山头火 | 甲戌 乙亥 | Lửa Trên Núi | rực rỡ, bùng phát, ngắn hạn | **Sơn Đầu Hỏa** | «Lửa trên núi — xa mấy cũng thấy.» | 大林木/松柏木 |
| 涧下水 | 丙子 丁丑 | Nước Khe Suối | nhẹ nhàng, liên tục, tinh tế | **Giản Hạ Thủy** | «Nước khe — chảy mãi không ồn.» | 路旁土/城头土 |
| 城头土 | 戊寅 己卯 | Đất Thành Lũy | bảo vệ, vững chắc, cố chấp | **Thành Đầu Thổ** | «Đất tường thành — giữ cho người trong.» | 涧下水/泉中水 |
| 白蜡金 | 庚辰 辛巳 | Kim Sáp Trắng | tinh xảo, quý giá, mong manh | **Bạch Lạp Kim** | «Kim như sáp trắng — đẹp, cần giữ gìn.» | 泉中水/涧下水 |
| 杨柳木 | 壬午 癸未 | Gỗ Liễu Yếu | linh hoạt, duyên dáng, thích nghi | **Dương Liễu Mộc** | «Cành liễu — gió nào cũng không gãy.» | 涧下水/泉中水 |
| 泉中水 | 甲申 乙酉 | Nước Suối Trong | trong vắt, nuôi dưỡng, tri thức | **Tuyền Trung Thủy** | «Nước suối — ai khát cũng được uống.» | 路旁土/屋上土 |
| 屋上土 | 丙戌 丁亥 | Đất Trên Mái | che chở, gia đình, trách nhiệm | **Ốc Thượng Thổ** | «Đất trên mái — che mưa cho cả nhà.» | 泉中水/涧下水 |
| 霹雳火 | 戊子 己丑 | Lửa Sấm Sét | bùng nổ, bất ngờ, đột phá | **Tích Lịch Hỏa** | «Sấm sét — một lần là trời đổi.» | 大林木/松柏木 |
| 松柏木 | 庚寅 辛卯 | Gỗ Tùng Bách | kiên cường, trường tồn, trầm mặc | **Tùng Bách Mộc** | «Tùng bách — tuyết càng dày càng xanh.» | 覆灯火/山头火 |
| 长流水 | 壬辰 癸巳 | Nước Sông Dài | kiên nhẫn, liên tục, kết nối | **Trường Lưu Thủy** | «Sông dài — nối những nơi xa nhau.» | 路旁土/壁上土 |
| 沙中金 | 甲午 乙未 | Kim Trong Cát | rải rác, cần thu thập, đáng giá | **Sa Trung Kim** | «Vàng trong cát — đãi lâu mới thấy.» | 泉中水/涧下水 |
| 山下火 | 丙申 丁酉 | Lửa Chân Núi | ấm áp, ổn định, nuôi dưỡng | **Sơn Hạ Hỏa** | «Lửa chân núi — đêm nào cũng ấm.» | 大林木/平地木 |
| 平地木 | 戊戌 己亥 | Gỗ Đồng Bằng | phổ thông, đa năng, thực tế | **Bình Địa Mộc** | «Cây đồng bằng — đâu cũng sống được.» | 山下火/覆灯火 |
| 壁上土 | 庚子 辛丑 | Đất Tường Vách | ranh giới, bảo vệ | **Bích Thượng Thổ** | «Đất vách — biết đâu là trong, đâu là ngoài.» | 涧下水/泉中水 |
| 金箔金 | 壬寅 癸卯 | Kim Lá Mỏng | đẹp, trang trí, hào nhoáng | **Kim Bạc Kim** | «Vàng lá — dát lên thì cả điện sáng.» | 泉中水/涧下水 |
| 覆灯火 | 甲辰 乙巳 | Lửa Đèn Phủ | soi sáng, dẫn đường, tâm linh | **Phúc Đăng Hỏa** | «Đèn có chụp — gió không tắt được.» | 大林木/松柏木 |
| 天河水 | 丙午 丁未 | Nước Sông Trời | rộng lớn, tinh thần, bao dung | **Thiên Hà Thủy** | «Sông trời — mưa xuống khắp nơi.» | 路旁土/壁上土 |
| 大驿土 | 戊申 己酉 | Đất Trạm Đường | giao thiệp rộng, năng động | **Đại Dịch Thổ** | «Đất trạm — ai qua cũng nghỉ chân.» | 涧下水/泉中水 |
| 钗钏金 | 庚戌 辛亥 | Kim Trâm Cài | tinh xảo, khéo léo | **Thoa Xuyến Kim** | «Trâm cài — nhỏ mà ai cũng nhìn.» | 泉中水/涧下水 |
| 桑柘木 | 壬子 癸丑 | Gỗ Dâu Tằm | thực dụng, nuôi dưỡng, nền tảng | **Tang Chá Mộc** | «Cây dâu — nuôi tằm, tằm nhả tơ.» | 山下火/覆灯火 |
| 大溪水 | 甲寅 乙卯 | Nước Khe Lớn | năng động, mạnh mẽ, hướng đi rõ | **Đại Khê Thủy** | «Khe lớn — biết mình chảy về đâu.» | 路旁土/城头土 |
| 沙中土 | 丙辰 丁巳 | Đất Trong Cát | rời rạc, cần gom, xây dựng | **Sa Trung Thổ** | «Đất trong cát — gom lại thì thành nền.» | 涧下水/泉中水 |
| 天上火 | 戊午 己未 | Lửa Trên Trời | rực rỡ, uy quyền, lãnh đạo | **Thiên Thượng Hỏa** | «Mặt trời — soi mà không đốt.» | 大林木/松柏木 |
| 石榴木 | 庚申 辛酉 | Gỗ Lựu | nhiều quả, phong phú, sáng tạo | **Thạch Lựu Mộc** | «Cây lựu — một quả trăm hạt.» | 山下火/覆灯火 |
| 大海水 | 壬戌 癸亥 | Nước Biển Lớn | bao dung, sâu thẳm, bí ẩn | **Đại Hải Thủy** | «Biển lớn — trăm sông về.» | 路旁土/城头土 |

`traits`, `strength`, `weakness` của engine dùng nguyên trong Sổ Mệnh (mục «Bản chất nạp âm»), sau khi lọc chữ theo 04-13 §4 (vd «dễ tổn thương» được giữ, «tự hạ thấp bản thân» được giữ vì là lời khuyên, không phán xét).

Lưu ý: `compat` của engine viết tắt `泉水` (= 泉中水), `天河` (= 天河水), `大溪` (= 大溪水), `大海` (= 大海水). Bộ so khớp «Đồng tu duyên» chuẩn hóa: so 2 chữ đầu của tên nạp âm.

## 6. `STAT-FLAG-*` — 17 cờ tổ hợp thập thần

### 6.1 Đặc tả

| Mục | Giá trị |
|---|---|
| Nguồn | `R.synthesis.combos[]` (do `combos › detectCombos(chart, strength)`): `{ id, name, vi, tone, desc, genuine, starCounts, mitigation }` |
| Cờ | `STAT-FLAG-<id>` bật khi tổ hợp có mặt; thêm biến thể `:che` khi `mitigation ≠ null` (tổ hợp hung đã được chế), `:hinh` khi `genuine = false` (tổ hợp chỉ «hình thức», sao yếu) |
| Ai đọc | 03 (điều kiện cảnh), 06 (Thầy AI brief, thoại), Sổ Mệnh |
| Tác động số | **không**. Cờ chỉ mở cảnh / thoại. Tổ hợp đã tác động qua Tiềm Lực (F08/F09). |

### 6.2 Bảng 17 cờ

Tần suất: 5.000 lá.

| Cờ | Tổ hợp | Giọng | Tần suất | Điều kiện engine (rút gọn) | Cảnh / thoại được mở (03, 06 viết) | Biến thể `:che` |
|---|---|---|---|---|---|---|
| `STAT-FLAG-caiGuan` | 財官雙美 Tài Quan Song Mỹ | cát | 90,0% | có Tài và có Quan/Sát | Thầy: «Có của thì phải có kỷ cương giữ của» — mở thoại cấp 1 ở chợ | — |
| `STAT-FLAG-shaYin` | 殺印相生 Sát Ấn Tương Sinh | cát | 70,7% | Thất Sát + Ấn | Khâu đạo trưởng giao một việc «áp lực lớn có người đỡ» | — |
| `STAT-FLAG-shiCai` | 食神生財 Thực Sinh Tài | cát | 69,5% | Thực Thần + Tài | chủ chợ đặt hàng thủ công | — |
| `STAT-FLAG-shangCai` | 傷官生財 Thương Sinh Tài | cát | 68,2% | Thương Quan + Tài | quầy chợ cho bán «tác phẩm phá cách» | — |
| `STAT-FLAG-shangYin` | 傷官佩印 Thương Phối Ấn | cát | 68,1% | Thương Quan + Ấn | Tế tửu: «tài mà có khuôn» — mở đề thi tự luận | — |
| `STAT-FLAG-guanYin` | 官印相生 Quan Ấn Tương Sinh | cát | 55,4% | Chính Quan + Chính Ấn | được mời làm thư ký buổi họp đạo thống | — |
| `STAT-FLAG-shiSha` | 食神制殺 Thực Chế Sát | cát | 54,1% | Thực Thần + Thất Sát | ải trí «dùng mưu thay sức» | — |
| `STAT-FLAG-xiaoShi` | 梟神奪食 Kiêu Đoạt Thực | hung | 54,2% | Thiên Ấn + Thực Thần | cảnh «ý hay bị chặn»: một tác phẩm bị NPC chê — người chơi chọn sửa hay giữ | `:che` (Tài chế Kiêu): NPC thứ hai bênh tác phẩm |
| `STAT-FLAG-guanZha` | 官殺混雜 Quan Sát Hỗn Tạp | hung | 52,5% | Chính Quan + Thất Sát | hai NPC quyền lực ra lệnh trái nhau — chọn nghe ai | `:che` (Thực/Thương chế Sát): có lựa chọn thứ ba «làm cả hai bằng cách khác» |
| `STAT-FLAG-shangGuan` | 傷官見官 Thương Quan Kiến Quan | hung | 52,2% | Thương Quan + Chính Quan | lựa chọn «cãi lại người trên» luôn có; cảnh hậu quả nhẹ, sửa được | `:che` (Ấn chế): Tế tửu dạy «nói thật mà không làm ai mất mặt» |
| `STAT-FLAG-shiXie` | 食神洩秀 Thực Tiết Tú | cát | 16,0% | thân vượng + Thực Thần | Đan Đỉnh mời triển lãm đan | — |
| `STAT-FLAG-caiDuo` | 財多身弱 Tài Đa Thân Nhược | hung | 10,1% | thân nhược + Tài ≥ 2,5 | cảnh «của nhiều quá cầm không hết» — một rương bạc phải chọn giao ai giữ | `:che` (Tỷ/Ấn trợ thân): bạn đồng tu đến giúp |
| `STAT-FLAG-qunJie` | 群劫爭財 Quần Kiếp Tranh Tài | hung | 7,1% | Kiếp Tài ≥ 1,5 + Tài | cảnh chia của trong đội — chọn chia đều | `:che` (Quan/Sát chế Kiếp): có người phân xử |
| `STAT-FLAG-shenRenCai` | 身旺任財 Thân Vượng Nhậm Tài | cát | 7,0% | thân vượng + Tài ≥ 2 | được giao giữ kho Sơn Môn | — |
| `STAT-FLAG-shaGong` | 殺攻身 Sát Công Thân | hung | 6,3% | thân nhược + Thất Sát ≥ 2 | cảnh «áp lực đè» ở Hồi III — luôn có lối thoát nhờ quý nhân | `:che` (Ấn hóa / Thực chế): quý nhân đến sớm hơn |
| `STAT-FLAG-yinHuy` | 印綬護身 Ấn Thụ Hộ Thân | cát | 5,5% | thân nhược + Ấn ≥ 2 | một sư phụ nhận làm con nuôi trong Sơn Môn | — |
| `STAT-FLAG-shangJin` | 傷官傷盡 Thương Quan Thương Tận | cát | 1,1% | Thương Quan ≥ 1,5 và không Quan Sát | Phương sĩ: «con không cần ai cho phép» — mở thoại «tự lập môn» | — |

Quy tắc cho cờ hung: cảnh được mở luôn có **ít nhất một lựa chọn tốt** và không có kết cục xấu vĩnh viễn. Cờ hung là «nút thắt của nhân vật», không phải lời nguyền.

### 6.3 Cờ thập thần lộ can (cho thoại)

Ngoài tổ hợp, Thầy AI và NPC đọc một số cờ đơn giản từ `godCount` (can lộ = 1):

| Cờ | Điều kiện | Dùng |
|---|---|---|
| `STAT-FLAG-thau-七殺` | 七殺 lộ can | Khâu đạo trưởng và Mao Sơn đạo nhân nói chuyện «kỷ luật» với người chơi |
| `STAT-FLAG-thau-傷官` | 傷官 lộ can | Tế tửu có thoại «tài mà ngang» |
| `STAT-FLAG-thau-偏印` | 偏印 lộ can | Phương sĩ nhận người chơi là «người có ý lạ» |
| `STAT-FLAG-thau-正官` | 正官 lộ can | Lão Tùng chào trang trọng hơn |
| `STAT-FLAG-thau-劫財` | 劫財 lộ can | thoại cạnh tranh ở chợ |
| `STAT-FLAG-khuyet-<trục>` | trục Ngũ Duy = 0 | Thầy dùng câu «khuyết sao» ở 04-04 §4 |

## 7. Ca biên

| Ca | Xử lý |
|---|---|
| `computeLiuDao` trả `ok: false` | ẩn Túc Nghiệp; ba thanh = 0; ải tâm ma 1 tầng mỗi độc |
| Hai cõi bằng điểm | engine chọn cõi đứng trước trong thứ tự Thiên, Nhân, A Tu La, Súc Sinh, Ngạ Quỷ, Địa Ngục — giữ nguyên |
| `dayNayinPersonality` không tìm thấy nạp âm | engine trả `{ nayin, vi: nayin }` không có `nature`; game hiện tên Hán, không danh xưng |
| Giờ không rõ | Tính Khí (can ngày) và nạp âm (trụ ngày) **không** phụ thuộc giờ — trừ ca giờ Tý đổi ngày (04-11 §3); tâm ma và tổ hợp có phụ thuộc giờ → đánh dấu «?» |
| Sửa bát tự | thanh tâm ma = gốc mới + Δ đã tích (Δ âm giữ nguyên); danh hiệu đã nhận giữ |

## 8. Checklist nghiệm thu phần 04-07

- [ ] Lời miễn trừ Lục Đạo hiện nguyên văn (đã sửa chữ «KHÔ»).
- [ ] Không chữ «tội», «đọa», «súc sinh» ở mặt chính; Túc Nghiệp ẩn được.
- [ ] Tâm ma lưu Δ, không lưu tuyệt đối; tầng ải = 1 + floor(v/25).
- [ ] Tần suất tạp niệm không phụ thuộc thanh tâm ma.
- [ ] Không dùng `health`, `finance`, `love`, `career` của hồ sơ tính cách.
- [ ] 30 nạp âm có danh xưng; «Đồng tu duyên» chuẩn hóa tên viết tắt; `avoid` không có tác dụng.
- [ ] 17 cờ tổ hợp + biến thể `:che`, `:hinh`; cờ hung luôn có lựa chọn tốt.
