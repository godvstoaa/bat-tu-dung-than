# 04-06 · Đặc Tính — 30 thần sát thành `PERK-*`, Quý Khí

## 1. Nguồn và phạm vi

| Nguồn | Khóa | Ghi chú |
|---|---|---|
| `shensha.js › computeShensha(chart)` → `R.shensha` | 29 khóa (danh sách đầy đủ §3) | mỗi khóa `{ at: [...] }`; có thêm `name` với `dexiu`, `sanQi` |
| `noble-stars.js › analyzeNobleStars(R)` | thêm **`guoYin`** (Quốc Ấn) | `taiji` của noble-stars **không** dùng làm Đặc Tính (E7: trùng `shensha.taiJi`, phạm vi hẹp hơn) |
| `SHENSHA_INFO` | `zh`, `vi`, `desc`, `tone` | `tone` ∈ cat / neutral / volatile / hung |
| `SHENSHA_KOUJUE` | khẩu quyết cổ | hiện trong «Vì sao?» của từng Đặc Tính |

Đặc Tính là **bị động**: có trong lá số thì có trong game, không trang bị / tháo được, không mua được.

## 2. Quy tắc chung

### 2.1 Bậc I / II

| Bậc | Điều kiện | Hiệu lực |
|---|---|---|
| I | sao có mặt (`at.length ≥ 1`) | giá trị cột «I» |
| II | `at.length ≥ 2` **và** sao tra theo **chi** (gặp ở ≥ 2 trụ) | giá trị cột «II» (≈ ×1,5 bậc I, làm tròn) |

Sao tra theo nhật trụ / giờ trụ / bộ ba can (`kuiGang`, `shiLing`, `tianShe`, `siFei`, `jinShen`, `sanQi`, `dexiu`) luôn bậc I.

Ví dụ `MAU-A`: `huaGai.at = ['辰','辰']` (ngày và giờ đều 辰) → Hoa Cái bậc II.

### 2.2 Cộng dồn

- Mọi % của Đặc Tính vào rổ **R1 · Năng khiếu**, trần +40% chung với Ngũ Hành Lực và nút Ngũ Duy (04-01 §9).
- Hai Đặc Tính cùng tác động một chỉ (vd Văn Xương + Học Đường cùng cộng việc học) **cộng** trong rổ.
- Tác động không phải % (lượt, gợi ý, mở nút) không có trần; mỗi loại ghi giới hạn riêng.

### 2.3 Bốn nhóm giọng

| `tone` engine | Số sao | Cách game xử lý | Nhãn trên Mệnh Bàn |
|---|---|---|---|
| `cat` | 18 (+ `guoYin`) | thưởng thẳng | hạt ngọc màu vàng |
| `neutral` | 4 | thưởng thẳng, mô tả trung tính | hạt ngọc màu ngà |
| `volatile` | 3 | **Song Nhận**: thưởng + một thử thách riêng có thưởng riêng | hạt ngọc hai màu |
| `hung` | 4 | **Kiếp số**: **không trừ gì**; thêm một **ải kiếp** vào chuỗi chính, vượt được thưởng lớn | hạt ngọc màu son có vân mây |

Nguyên tắc kiếp số (canon bản sơ đồ tổng §4.6): «Không phạt chỉ số. Thêm một ải kiếp trong chuỗi chính, vượt được thì thưởng lớn.» Thêm của tài liệu này (đúng `SHENSHA_INFO`: «có Đức / quý nhân thì giải»): nếu lá số có **Thiên Đức / Nguyệt Đức / Thiên Đức Hợp / Nguyệt Đức Hợp**, ải kiếp **bớt 1 chặng**, thưởng giữ nguyên. Đây là cách game kể câu «gặp dữ hóa lành» bằng cơ chế.

### 2.4 Quy tắc an toàn riêng cho Đặc Tính (T6)

| Sao | Mô tả engine có | Game **không** được nói | Game nói thay |
|---|---|---|---|
| `xueRen`, `liuXia` | «huyết quang, thương tích, phẫu thuật, sản khoa» | bất kỳ dự đoán thương tích, bệnh, thai sản | ải kiếp mang tính **dấn thân cứu người**, không máu, không bệnh |
| `zaiSha` | «tai họa/bệnh tật bất ngờ» | dự đoán tai nạn đời thực | thiên tai **trong thế giới game** để người chơi đi cứu |
| `kuiGang` | «nữ mạng bất lợi hôn nhân» | mọi câu phân biệt giới, mọi câu về hôn nhân đời thực | thử thách «cương nhu» như nhau cho mọi giới |
| `hongYan`, `taoHua` | «đào hoa sắc vóc», «hấp dẫn người khác giới» | gợi dục, phán chuyện tình đời thực | thiện cảm NPC, thẩm mỹ, giao tế |
| `tianYiMed` | «duyên y/dược» | chẩn bệnh, khuyên thuốc đời thực | y dược **hư cấu** trong game (`tcm` chỉ dùng giảng ngũ hành) |
| `siFei` | «ngày vô dụng», «sự khó thành, thể yếu» | chữ «vô dụng», «phế», «thể yếu» ở mặt chính | «Tứ Phế» chỉ là tên sao trong «Xem lời gốc»; mặt chính là «Hồi Sinh» |

Không có Đặc Tính nào có hiệu ứng khác nhau theo giới tính.

## 3. Ba mươi Đặc Tính

Tần suất: 5.000 lá (seed 777). Móc nhiệm vụ: tài liệu 03 cấp mã `SQ-*`/`BR-*` cho từng móc.

### 3.1 Nhóm quý nhân và đức (cát)

#### `PERK-tianYi` — Quý Nhân Phù (天乙贵人)

| Mục | Nội dung |
|---|---|
| Tra | can ngày → chi (甲戊庚 牛羊 · 乙己 鼠猴 · 丙丁 猪鸡 · 壬癸 兔蛇 · 辛 马虎), gặp ở bất kỳ trụ |
| Tần suất | 45,4% |
| Hiệu ứng I | mỗi ngày 1 NPC ngẫu nhiên tặng quà nhỏ hoặc chỉ đường; khi kẹt nhiệm vụ: 1 gợi ý miễn phí/ngày |
| Hiệu ứng II | như I + 1 «quý nhân lớn»/tuần (NPC cảnh giới cao dẫn đi một đoạn); 2 gợi ý/ngày |
| UI | «Quý Nhân Phù — người lạ hay giúp bạn đúng lúc.» |
| Móc | `PERK-tianYi/Q1` «Người lạ trên bậc đá»: quý nhân đầu tiên hóa ra là một người cũ của Sơn Môn; mở sớm `STAT-ND-AN-09` |
| Tính trong Tiềm Lực | là 1 trong 7 cát tinh của F13 |

#### `PERK-tianDe` — Thiên Đức (天德贵人)

| Mục | Nội dung |
|---|---|
| Tra | nguyệt chi → can/chi (正丁 二申 三壬 四辛 五亥 六甲 七癸 八寅 九丙 十乙 子巳 丑庚), gặp ở can hoặc chi |
| Tần suất | 30,8% |
| Hiệu ứng I | nghiệp phát sinh do **lỡ chọn sai** (không phải Tà Lộ chủ động) −25% (canon: «giảm nghiệp khi lỡ chọn sai», 05 định nghĩa nghiệp) |
| Hiệu ứng II | −35% |
| Thêm | ải kiếp của sao hung bớt 1 chặng (§2.3) |
| UI | «Thiên Đức — trời che chở người có lòng.» |
| Móc | `PERK-tianDe/Q1` «Ngọn đèn không tắt»: giữ đèn cho một ngôi miếu nhỏ suốt 7 đêm; mở sớm `STAT-ND-TY-06` |

#### `PERK-yueDe` — Nguyệt Đức (月德贵人)

| Mục | Nội dung |
|---|---|
| Tra | nhóm tam hợp **nguyệt chi** → can (寅午戌 丙 · 申子辰 壬 · 巳酉丑 庚 · 亥卯未 甲), gặp ở can |
| Tần suất | 34,7% |
| Hiệu ứng I | nghiệp do lỡ chọn sai −20%; tranh chấp ở Công Đường có thêm lựa chọn «hòa giải» |
| Hiệu ứng II | nghiệp −30% |
| UI | «Nguyệt Đức — phúc đức tự nhiên, ít điều tiếng.» |
| Móc | `PERK-yueDe/Q1` «Rằm của người khác»: tổ chức rằm cho một xóm nghèo |

#### `PERK-tianDeHe` — Thiên Đức Hợp (天德合)

| Mục | Nội dung |
|---|---|
| Tra | `TIAN_DE_HE[nguyệt chi]`, gặp ở can hoặc chi |
| Tần suất | 30,6% |
| Hiệu ứng I | lần sám hối đầu mỗi tuần (`CHAN_HUI`, 05) hoàn nghiệp ×1,2 |
| Hiệu ứng II | ×1,3 |
| UI | «Thiên Đức Hợp — lỗi biết sửa thì nhẹ.» |

#### `PERK-yueDeHe` — Nguyệt Đức Hợp (月德合)

| Mục | Nội dung |
|---|---|
| Tra | `YUE_DE_HE[nhóm nguyệt chi]` (丁 / 辛 / 乙 / 己), gặp ở can |
| Tần suất | 34,9% |
| Hiệu ứng I | nghiệp do lỡ chọn sai −10%; sám hối +10% |
| Hiệu ứng II | −15%; +15% |
| UI | «Nguyệt Đức Hợp — êm thấm, giải ách nhẹ nhàng.» |

#### `PERK-dexiu` — Đức Tú (德秀贵人)

| Mục | Nội dung |
|---|---|
| Tra | nhóm tam hợp nguyệt chi → cần **cả** can «đức» và can «tú» (bảng `DEXIU`) |
| Tần suất | 12,3% |
| Hiệu ứng | thư pháp, câu đối, đề biển +15% [R1]; mọi lần giảm tâm ma +10% |
| UI | «Đức Tú — tính thuần hòa, chữ đẹp như người.» |
| Móc | `PERK-dexiu/Q1` «Bia không chữ»: viết văn bia cho một nghĩa trang không tên |

#### `PERK-tianShe` — Thiên Xá (天赦日)

| Mục | Nội dung |
|---|---|
| Tra | nhật trụ theo mùa nguyệt chi: Xuân 戊寅 · Hạ 甲午 · Thu 戊申 · Đông 甲子 |
| Tần suất | 1,4% (hiếm) |
| Hiệu ứng | một lần mỗi mùa: «Đại Xá» — xóa toàn bộ nghiệp phát sinh do lỡ chọn sai trong mùa (không áp Nợ Âm của Tà Lộ, canon §6) |
| UI | «Thiên Xá — sinh ngày trời xá tội.» |
| Móc | `PERK-tianShe/Q1` «Ngày trời mở»: lễ ở Thái Tuế Điện vào đúng ngày can chi Thiên Xá của mùa |

#### `PERK-guoYin` — Quốc Ấn (国印贵人, từ `noble-stars`)

| Mục | Nội dung |
|---|---|
| Tra | can ngày → chi (甲戌 乙亥 丙丑 丁寅 戊丑 己寅 庚辰 辛巳 壬未 癸申) |
| Tần suất | 27,8% |
| Hiệu ứng I | nhà riêng ở Huyền Thành: giá thuê / mua −20%; được giữ ấn tín bang (Trị đạo) |
| Hiệu ứng II | −30% |
| UI | «Quốc Ấn — người giữ chữ tín được giao việc lớn.» |
| Móc | mở sớm `STAT-ND-QUAN-08` (Công Đường) |

### 3.2 Nhóm học vấn và trí

#### `PERK-wenChang` — Văn Xương Chiếu (文昌)

| Mục | Nội dung |
|---|---|
| Tra | can ngày → chi (甲巳 乙午 丙戊申 丁己酉 庚亥 辛子 壬寅 癸卯) |
| Tần suất | 30,1% |
| Hiệu ứng I | khoa cử điểm **+20%** (canon) [R1]; đọc cổ thư +10% |
| Hiệu ứng II | khoa cử +25%; đọc +15% |
| UI | «Văn Xương Chiếu — đầu óc sáng, thi cử thuận.» |
| Móc | mở sớm `STAT-ND-AN-04`, `STAT-ND-THUC-06`; `PERK-wenChang/Q1` «Ngọn bút của Tế tửu» ở Văn Miếu |

#### `PERK-xueTang` — Học Đường Tâm (学堂)

| Mục | Nội dung |
|---|---|
| Tra | can ngày → chi Trường Sinh (甲亥 乙午 丙戊寅 丁己酉 庚巳 辛子 壬申 癸卯) |
| Tần suất | 30,8% |
| Hiệu ứng I | mọi hoạt động thuộc Học đạo +8% công tu [R1] |
| Hiệu ứng II | +12% |
| UI | «Học Đường — ham học, nhớ lâu.» |
| Móc | mở sớm `STAT-ND-AN-05` (Hương Thí) |

#### `PERK-ciGuan` — Từ Quán (词馆)

| Mục | Nội dung |
|---|---|
| Tra | **can năm** → chi Lâm Quan (= Lộc của can năm) |
| Tần suất | 28,3% |
| Hiệu ứng | khoa cử: thêm 1 «đề tự chọn» mỗi vòng; Học đạo +5% [R1] |
| UI | «Từ Quán — ghế hàn lâm, văn chương tinh chuyên.» |
| Móc | mở sớm `STAT-ND-AN-07` (Hội Thí) |

#### `PERK-taiJi` — Thái Cực (太极贵人)

| Mục | Nội dung |
|---|---|
| Tra | can ngày **và** can năm → chi (甲乙 子午 · 丙丁 卯酉 · 戊己 辰戌丑未 · 庚辛 寅亥 · 壬癸 巳申) |
| Tần suất | **80,4%** (phổ biến nhất) |
| Hiệu ứng I | hoạt động tôn giáo / huyền học (tĩnh tọa, kinh, kết phù, công án) +8% [R1] |
| Hiệu ứng II | +12% |
| UI | «Thái Cực — có duyên với đạo và huyền học.» |
| Móc | mở sớm `STAT-ND-AN-08`, `STAT-ND-THUC-04` |
| Ghi chú cân bằng | vì 80% người chơi có, coi như «mặc định có»: không gắn nội dung độc quyền nào cho Thái Cực, chỉ thêm %. |

#### `PERK-shiLing` — Thập Linh (十灵日)

| Mục | Nội dung |
|---|---|
| Tra | 10 nhật trụ: 甲辰 乙亥 丙辰 丁酉 戊午 庚戌 庚寅 辛亥 壬寅 癸未 |
| Tần suất | 16,3% |
| Hiệu ứng | 1 «linh cảm»/ngày: ở ải trí hoặc công án, hiện một gợi ý hình ảnh; giải quẻ (`que-ui.js`, web) +1 lượt/ngày |
| UI | «Thập Linh — linh lợi, gặp việc hay có lối xoay.» |

#### `PERK-sanQi` — Tam Kỳ (三奇贵人)

| Mục | Nội dung |
|---|---|
| Tra | 4 thiên can chứa đủ một bộ: thiên kỳ 甲戊庚 · địa kỳ 乙丙丁 · nhân kỳ 辛壬癸 |
| Tần suất | 6,3% |
| Hiệu ứng | XP **mọi** cây Ngũ Duy +5%; nếu lá số có thêm Thiên Ất / Thiên Đức / Nguyệt Đức → +10% (engine: «cần thêm quý nhân khác mới phát») |
| UI | «Tam Kỳ — bác học đa năng; có người nâng thì phát lớn.» |
| Móc | `PERK-sanQi/Q1` «Ba chiếc chìa»: tìm 3 người dẫn ở 3 đạo khác nhau |

### 3.3 Nhóm lộc và của

#### `PERK-luShen` — Lộc Thần Hộ (禄神)

| Mục | Nội dung |
|---|---|
| Tra | can ngày → chi Lâm Quan (甲寅 乙卯 丙戊巳 丁己午 庚申 辛酉 壬亥 癸子) |
| Tần suất | 28,4% |
| Hiệu ứng I | Phúc Khí từ việc hằng ngày (`DQ-*`) +8% [R1]; mỗi tuần 1 «lộc» (vật phẩm tiêu dùng) |
| Hiệu ứng II | +12%; 2 lộc/tuần |
| UI | «Lộc Thần — cơm áo không lo.» |
| Móc | mở sớm `STAT-ND-TAI-06` |

#### `PERK-tianChu` — Thiên Trù (天厨贵人)

| Mục | Nội dung |
|---|---|
| Tra | can ngày và can năm → chi Lộc của Thực Thần |
| Tần suất | 47,4% |
| Hiệu ứng I | trà và đan hồi Nguyên Khí +20%; nấu cỗ lễ hội được thêm 1 món |
| Hiệu ứng II | +30% |
| UI | «Thiên Trù — bếp trời, ăn uống có phúc.» (engine viết «Thiên Xư» — E5) |
| Móc | mở sớm `STAT-ND-TAI-08` |

#### `PERK-jinYu` — Kim Dư (金舆)

| Mục | Nội dung |
|---|---|
| Tra | can ngày → chi (甲辰 乙巳 丙戊未 丁己申 庚戌 辛亥 壬丑 癸寅) |
| Tần suất | 27,6% |
| Hiệu ứng I | trạm đi nhanh miễn phí 1 lần/ngày; buôn tuyến +5% [R1] |
| Hiệu ứng II | 2 lần/ngày; +8% |
| UI | «Kim Dư — xe của quý nhân.» |
| Móc | mở sớm `STAT-ND-TAI-04` |

### 3.4 Nhóm quyền và đi

#### `PERK-jiangXing` — Tướng Tinh (将星)

| Mục | Nội dung |
|---|---|
| Tra | nhóm tam hợp chi năm **hoặc** chi ngày → chi đế vượng (申子辰 子 · 寅午戌 午 · 巳酉丑 酉 · 亥卯未 卯) |
| Tần suất | 68,0% |
| Hiệu ứng I | khi làm trưởng đội: mỗi thành viên +5% công tu [R1] |
| Hiệu ứng II | +8% |
| UI | «Tướng Tinh — người khác dễ theo bạn.» |
| Móc | mở sớm `STAT-ND-QUAN-04`, `STAT-ND-TY-08` |

#### `PERK-yiMa` — Dịch Mã (驿马)

| Mục | Nội dung |
|---|---|
| Tra | nhóm tam hợp chi năm / ngày → chi xung sinh (申子辰 寅 · 寅午戌 申 · 巳酉丑 亥 · 亥卯未 巳) |
| Tần suất | 36,5% |
| Hiệu ứng I | tốc độ đi bộ **+20%** (canon); trạm đi nhanh −20%; nhiệm vụ du phương +10% |
| Hiệu ứng II | +25%; −25%; +15% |
| UI | «Dịch Mã — chân không ngừng, đi xa gặp cơ hội.» |
| Móc | `PERK-yiMa/Q1` «Mười hai trạm»: đến đủ 12 thánh địa trong một mùa |

### 3.5 Nhóm giao tế và thẩm mỹ (trung tính)

#### `PERK-taoHua` — Đào Hoa Duyên (桃花)

| Mục | Nội dung |
|---|---|
| Tra | nhóm tam hợp chi năm / ngày → chi (申子辰 酉 · 寅午戌 卯 · 巳酉丑 午 · 亥卯未 子) |
| Tần suất | 39,5% |
| Hiệu ứng I | thiện cảm NPC +2 mỗi lần trò chuyện; MMO: lời mời ghép đội hiện biểu tượng hoa đào (dễ được nhận) |
| Hiệu ứng II | +3 |
| UI | «Đào Hoa — dễ mến, dễ kết giao.» |
| Móc | mở sớm `STAT-ND-TY-02` |

#### `PERK-hongYan` — Hồng Diễm (红艳煞)

| Mục | Nội dung |
|---|---|
| Tra | can ngày → chi (甲乙午 丙寅 丁未 戊己辰 庚戌 辛酉 壬子 癸申) |
| Tần suất | 31,3% |
| Hiệu ứng I | hội họa, trang trí, thiết kế trang phục +10% [R1]; NPC nghệ nhân thiện cảm +2 |
| Hiệu ứng II | +15% |
| UI | «Hồng Diễm — mắt thẩm mỹ, đời nhiều cảm xúc.» |
| Móc | mở sớm `STAT-ND-THUC-09` |

#### `PERK-huaGai` — Hoa Cái Nhập Mệnh (华盖)

| Mục | Nội dung |
|---|---|
| Tra | nhóm tam hợp chi năm / ngày → chi mộ (申子辰 辰 · 寅午戌 戌 · 巳酉丑 丑 · 亥卯未 未) |
| Tần suất | 68,4% |
| Hiệu ứng I | công tu ở **mọi đạo thống** +15% (canon) [R1] |
| Hiệu ứng II | +20% |
| Thêm | «Cô Phong»: thấy 3 chỗ tĩnh tọa trên đỉnh núi mà người khác không thấy (đi chung đội thì đồng đội cũng thấy) |
| UI | «Hoa Cái — tâm hướng đạo, thích chỗ yên.» |
| Móc | mở sớm `STAT-ND-AN-11` |
| Khác bản sơ đồ tổng | bản sơ đồ tổng §4.6 có «giao lưu −10%». **Bỏ** theo N2 (chỉ cộng). «Cô độc» thể hiện bằng nội dung (Cô Phong), không bằng trừ điểm. |

#### `PERK-tianYiMed` — Thiên Y Thủ (天医)

| Mục | Nội dung |
|---|---|
| Tra | nguyệt chi → chi đứng trước một vị (寅→丑, 午→巳, 子→亥 …) |
| Tần suất | 23,4% |
| Hiệu ứng I | sắc thuốc cho NPC (hư cấu) +15% [R1]; cứu người trúng yểm: bước «chẩn đoán đời thực» có thêm 1 gợi ý (bước này luôn khuyên **đi khám thật**, `amta-data › ETHICS`) |
| Hiệu ứng II | +20% |
| UI | «Thiên Y — bàn tay biết chăm người.» |
| Móc | mở sớm `STAT-ND-THUC-05`; `PERK-tianYiMed/Q1` «Vườn thuốc của bà A Mậu» (Miêu Cương) |

### 3.6 Nhóm song nhận (volatile)

#### `PERK-yangRen` — Dương Nhận (羊刃)

| Mục | Nội dung |
|---|---|
| Tra | can ngày → chi Đế Vượng (甲卯 乙辰 丙戊午 丁己未 庚酉 辛戌 壬子 癸丑) |
| Tần suất | 31,3% |
| Mặt thưởng | ải trí (K4): +1 lần thử; thoại có lựa chọn «nói thẳng» |
| Mặt thử thách | ải tâm ma **Sân** (04-07 §3) thêm 1 tầng (canon: «ải tâm ma “sân” khó hơn») — mỗi tầng vẫn cho công tu như mọi tầng |
| Thưởng riêng | vượt hết ải Sân → Đặc Tính phái sinh **«Kiên Nhẫn»**: Định Lực tầng hiệu dụng +1 vĩnh viễn |
| UI | «Dương Nhận — ý chí như lưỡi đao; mài được thì thành kiên nhẫn.» |

#### `PERK-kuiGang` — Khôi Cương (魁罡)

| Mục | Nội dung |
|---|---|
| Tra | nhật trụ ∈ {庚辰, 庚戌, 壬辰, 戊戌} |
| Tần suất | 6,5% |
| Mặt thưởng | nhánh thoại **cứng rắn** với NPC quyền lực (canon); mở sớm `STAT-ND-QUAN-06` |
| Mặt thử thách | chuỗi «Cương Nhu» 3 cảnh: thuyết phục một NPC chỉ chịu nghe lời mềm |
| Thưởng riêng | danh hiệu «Cương Nhu Tương Tế»; thoại mềm và cứng đều mở với mọi NPC |
| UI | «Khôi Cương — cương nghị, quyết đoán.» (engine viết «Quù Cương» — E5) |

#### `PERK-jinShen` — Kim Thần (金神)

| Mục | Nội dung |
|---|---|
| Tra | **giờ trụ** ∈ {乙丑, 己巳, 癸酉} |
| Tần suất | 4,4% |
| Mặt thưởng | khi Nhiệt Tâm (Hỏa) tầng hiệu dụng ≥ 3 → «Kim Thần Nhập Hỏa» (engine: «金神入火乡 thì đại quý»): rèn, luyện đan +15% [R1] |
| Mặt thử thách | khi Hỏa < 3: chuỗi «Lò Luyện» ở Võ Đang — đưa Hỏa tầng hiệu dụng lên 3 bằng Bổ Hành |
| UI | «Kim Thần — khí kim oai liệt, vào lửa thì thành.» |

### 3.7 Nhóm kiếp số (hung)

Mỗi sao hung = một **ải kiếp** chèn vào chuỗi chính (03 đặt vị trí; đề xuất Hồi III «Năm Hạn»). Ải kiếp có 3 chặng; có sao Đức → 2 chặng. Thưởng: công tu 120 (nhân NT), một danh hiệu, một vật phẩm trang trí. Không có thất bại vĩnh viễn: bỏ dở thì quay lại được.

#### `PERK-xueRen` — Huyết Nhận · kiếp «Thân Chắn»

| Mục | Nội dung |
|---|---|
| Tra | nguyệt chi → chi (正丑 二未 三寅 四申 五卯 六酉 七辰 八戌 九巳 十亥 子午 丑申) |
| Tần suất | 29,2% |
| Ải kiếp | cháy kho sách ở Thư Lâu Lâm: dẫn NPC ra, cứu sách (không máu, không thương tích) |
| Thưởng | danh hiệu «Thân Chắn» · trang trí «Bìa sách cháy sém» |
| UI | «Huyết Nhận — kiếp dấn thân. Ải này dành cho người dám đứng ra.» |

#### `PERK-liuXia` — Lưu Hà · kiếp «Ráng Chiều»

| Mục | Nội dung |
|---|---|
| Tra | can ngày → chi (甲酉 乙戌 丙未 丁申 戊巳 己午 庚辰 辛卯 壬亥 癸寅) |
| Tần suất | 25,2% |
| Ải kiếp | dẫn một đoàn hành hương qua đèo Tạng Địa lúc hoàng hôn, giữ đoàn không lạc |
| Thưởng | danh hiệu «Người Giữ Ráng Chiều» · đèn lồng đỏ |
| UI | «Lưu Hà — kiếp đường xa. Đi qua rồi, bạn là người dẫn đường.» |

#### `PERK-zaiSha` — Tai Sát · kiếp «Bạch Hổ»

| Mục | Nội dung |
|---|---|
| Tra | nhóm tam hợp **chi năm** → chi (申子辰 午 · 寅午戌 子 · 巳酉丑 卯 · 亥卯未 酉) |
| Tần suất | 23,6% |
| Ải kiếp | lũ ở Cùng Thông Hồ (thiên tai trong game): dựng đê, sơ tán làng |
| Thưởng | danh hiệu «Trấn Bạch Hổ» · tượng hổ đá nhỏ cho nhà riêng |
| UI | «Tai Sát — kiếp gặp tai. Người qua kiếp này thường là người cứu tai.» |

#### `PERK-siFei` — Tứ Phế · kiếp «Hồi Sinh»

| Mục | Nội dung |
|---|---|
| Tra | nhật trụ theo mùa: Xuân 庚申 辛酉 · Hạ 壬子 癸亥 · Thu 甲寅 乙卯 · Đông 丙午 丁巳 |
| Tần suất | 3,2% |
| Ải kiếp | phục dựng một ngôi miếu bỏ hoang qua **4 mùa** (mỗi mùa một phần); engine: «Dụng Thần chế phục thì giảm» → nếu Dụng tầng hiệu dụng ≥ 3, ải còn 3 mùa |
| Thưởng | danh hiệu «Hồi Sinh» · ngôi miếu trở thành điểm tĩnh tọa riêng mang tên người chơi |
| UI mặt chính | «Hồi Sinh — kiếp dựng lại cái đã bỏ.» (chữ «Tứ Phế» chỉ ở «Xem lời gốc») |

`MAU-H` (2003-08-10 06:45 nữ, 乙卯 ngày, sinh mùa Thu) có Tứ Phế — Song Linh Căn, Thuận Thiên, vẫn có kiếp số. Kiếp số không gắn với điểm thấp.

## 4. `STAT-QUYKHI` — Quý Khí

### 4.1 Đặc tả

| Mục | Giá trị |
|---|---|
| Nguồn | `analyzeNobleStars(R).assessment` → `{ level, score, text }` |
| Công thức engine | cộng trọng số sao có mặt: Thiên Đức 3 · Nguyệt Đức 2,5 · Tam Kỳ 2,5 · Thái Cực 2 · Quốc Ấn 1,5 · Khôi Cương 0; Tam Kỳ đứng một mình (không có Thiên/Nguyệt Đức) −1 |
| Mức | `score ≥ 6` 贵气显赫 · `≥ 3,5` 贵气中上 · `≥ 1,5` 贵气平平 · còn lại 贵气微薄 |
| Lưu ý | `taiji` trong phép tính này là của `noble-stars` (chỉ theo can ngày) — giữ nguyên để Quý Khí khớp trang chính |

### 4.2 Bốn mức và tác động

| `level` | Tên game | Tỉ lệ | Quý nhân ngẫu nhiên | Cơ chế riêng |
|---|---|---|---|---|
| 贵气显赫 | **Quý Khí Hiển** | 18,4% | 1 lần / ngày | 1 lần / tuần «cứu nạn»: khi thất bại một ải, quý nhân cho làm lại ngay không tốn Nguyên Khí |
| 贵气中上 | **Quý Khí Thịnh** | 29,8% | 1 lần / 2 ngày | — |
| 贵气平平 | **Quý Khí Bình** | 37,2% | 1 lần / 3 ngày | — |
| 贵气微薄 | **Tự Tạo Quý Nhân** | 14,6% | 1 lần / 4 ngày | **mỗi NPC mình giúp trở thành quý nhân của mình** (quay lại tặng quà theo chu kỳ 7 ngày, tối đa 5 người) — đến ngày thứ 30 chơi đều, số lần gặp quý nhân thường vượt «Quý Khí Hiển» |

Câu engine cho mức vi bạc («đường đời tự lập nhiều hơn… chủ động kết duyên lành, giúp người để tự tạo quý nhân») chính là cơ chế của mức này — game làm đúng lời trang chính.

Tương tác: **Thân nhược / quá nhược** nhân hiệu lực quà quý nhân ×1,5 (04-03 §4.2). `PERK-tianYi` cộng thêm lượt (§3.1), độc lập với Quý Khí.

### 4.3 Kiểm chứng

| Mẫu | Sao nhóm cao cấp có mặt | Điểm | Mức |
|---|---|---|---|
| `MAU-A` | Thiên Đức, Nguyệt Đức, Quốc Ấn, Khôi Cương | 3 + 2,5 + 1,5 + 0 = 7 | Quý Khí Hiển |
| `MAU-D` | Nguyệt Đức, Thái Cực | 2,5 + 2 = 4,5 | Quý Khí Thịnh |
| `MAU-E` | — | 0 | Tự Tạo Quý Nhân |
| `MAU-N` | Thiên Đức, Nguyệt Đức, Quốc Ấn | 7 | Quý Khí Hiển |

## 5. Bảng tần suất và cân bằng

| Đặc Tính | Tần suất | Nhóm | Loại tác động chính |
|---|---|---|---|
| Thái Cực | 80,4% | cát | % tôn giáo |
| Hoa Cái | 68,4% | trung tính | % đạo thống |
| Tướng Tinh | 68,0% | cát | % đội |
| Thiên Trù | 47,4% | cát | hồi NK |
| Quý Nhân Phù | 45,4% | cát | lượt quý nhân |
| Đào Hoa | 39,5% | trung tính | thiện cảm |
| Dịch Mã | 36,5% | trung tính | di chuyển |
| Nguyệt Đức Hợp | 34,9% | cát | nghiệp |
| Nguyệt Đức | 34,7% | cát | nghiệp |
| Hồng Diễm | 31,3% | trung tính | % nghệ |
| Dương Nhận | 31,3% | song nhận | ải Sân |
| Thiên Đức | 30,8% | cát | nghiệp, kiếp −1 chặng |
| Học Đường | 30,8% | cát | % học |
| Thiên Đức Hợp | 30,6% | cát | sám hối |
| Văn Xương | 30,1% | cát | % khoa cử |
| Huyết Nhận | 29,2% | kiếp số | ải kiếp |
| Lộc Thần | 28,4% | cát | % việc ngày |
| Từ Quán | 28,3% | cát | khoa cử |
| Quốc Ấn | 27,8% | cát | nhà, Công Đường |
| Kim Dư | 27,6% | cát | đi nhanh |
| Lưu Hà | 25,2% | kiếp số | ải kiếp |
| Tai Sát | 23,6% | kiếp số | ải kiếp |
| Thiên Y | 23,4% | cát | % y dược |
| Thập Linh | 16,3% | cát | linh cảm |
| Đức Tú | 12,3% | cát | % chữ |
| Khôi Cương | 6,5% | song nhận | thoại cứng |
| Tam Kỳ | 6,3% | cát | XP mọi cây |
| Kim Thần | 4,4% | song nhận | % rèn/đan |
| Tứ Phế | 3,2% | kiếp số | ải 4 mùa |
| Thiên Xá | 1,4% | cát | Đại Xá |

Mỗi lá số trung bình có **~10 Đặc Tính** (mẫu: `MAU-G` 5 → `MAU-M` 13). Vì phần lớn tác động là % trong rổ R1 có trần 40%, lá số nhiều sao không vượt xa lá số ít sao về số; khác biệt nằm ở **nội dung mở ra** (móc nhiệm vụ, thoại, ải).

Xác suất có ít nhất một kiếp số: ≈ 1 − (1 − 0,292)(1 − 0,252)(1 − 0,236)(1 − 0,032) ≈ **61%** (ước lượng coi như độc lập). Ải kiếp là nội dung của đa số người chơi, không phải ngoại lệ.

## 6. Ca biên

| Ca | Xử lý |
|---|---|
| Sao có trong `SHENSHA_INFO` nhưng không có trong bảng này (engine thêm sao mới) | Đặc Tính «Sao lạ» tạm: chỉ hiện tên + `desc`, không hiệu ứng; log `perk.unknown_key`. |
| `at` chứa cùng chi 2 lần ở 2 trụ (vd `['辰','辰']`) | Tính 2 vị trí → bậc II. |
| `dexiu.at` luôn ≥ 2 phần tử (can đức + can tú) | Luôn bậc I (§2.1). |
| Giờ không rõ | Các sao tra theo **giờ trụ** (`jinShen`) hoặc gặp ở chi giờ có thể sai. Đánh dấu Đặc Tính phụ thuộc giờ bằng chấm «?» (04-11 §2). |
| Sửa bát tự làm mất một Đặc Tính đang có móc dở dang | Móc đóng; thưởng đã nhận giữ; danh hiệu đã nhận giữ. |

## 7. Checklist nghiệm thu phần 04-06

- [ ] 30 khóa có hiệu ứng; khóa lạ không làm hỏng Mệnh Bàn.
- [ ] Bậc II chỉ cho sao tra theo chi gặp ở ≥ 2 trụ.
- [ ] Kiếp số không trừ bất kỳ chỉ số nào; sao Đức bớt 1 chặng.
- [ ] Không câu nào về thương tích, bệnh, thai sản, hôn nhân đời thực, khác biệt giới.
- [ ] Hoa Cái không có phần trừ giao lưu.
- [ ] Quý Khí khớp `assessment.level` trên 15 mẫu; «Tự Tạo Quý Nhân» hoạt động đến 5 NPC.
