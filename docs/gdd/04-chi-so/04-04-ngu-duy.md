# 04-04 · Ngũ Duy — năm nhánh thiên phú và cây kỹ năng

## 1. `STAT-NGUDUY-*` — đặc tả

### 1.1 Nguồn và công thức engine

| Mục | Giá trị |
|---|---|
| Hàm | `five-dim-radar › fiveDimRadar(R.chart)` |
| Đếm sao | `combos › godCount(chart)`: can năm/tháng/giờ mỗi can **1,0**; tàng can 4 trụ theo `constants › HIDDEN_WEIGHT` (bản khí / trung khí / dư khí, phụ thuộc số tàng can của chi); bỏ «日主» |
| Gom trục | Tài = 正財 + 偏財 · Quan = 正官 + 七殺 · Ấn = 正印 + 偏印 · Thực = 食神 + 傷官 · Tỷ = 比肩 + 劫財 |
| Điểm | `score = raw ≤ 0 ? 0 : round(10 + raw / maxRaw × 90)` — trục lớn nhất luôn = **100**, trục có sao luôn ≥ 10, trục không sao = **0** |
| Trội / yếu | `dominant` = trục `raw` lớn nhất, `weakest` = nhỏ nhất (sắp xếp ổn định theo thứ tự Tài, Quan, Ấn, Thực, Tỷ) |
| Lớp game | không đổi điểm; thêm hệ số thiên phú (§2), nút khởi đầu (§3), chuỗi Bổ Khuyết (§4) |

Vì điểm chuẩn hóa theo trục lớn nhất, Ngũ Duy là **hình dạng**, không phải độ lớn: hai người cùng có Tài = 100 có thể có lượng sao Tài rất khác nhau. Game dùng nó đúng như vậy: để chọn **hướng**, không để so mạnh yếu giữa người chơi.

### 1.2 Năm trục

| Mã | Trục engine | Thập thần | Nhánh kỹ năng | Tính chất (`DIMS.trait`) | Người dẫn chính | Vùng gắn |
|---|---|---|---|---|---|---|
| `STAT-NGUDUY-TAI` | Tài 财 | 正財 / 偏財 | **Thương đạo** | kinh doanh, tích lũy, thực dụng | chủ chợ Huyền Thành (06 tạo NPC) | Huyền Thành, Lịch Đường |
| `STAT-NGUDUY-QUAN` | Quan 官 | 正官 / 七殺 | **Trị đạo** | lãnh đạo, kỷ luật, địa vị, trách nhiệm | Khâu đạo trưởng `khau_daotruong` | Chung Nam, Long Hổ |
| `STAT-NGUDUY-AN` | Ấn 印 | 正印 / 偏印 | **Học đạo** | học thuật, bằng cấp, bảo vệ, tĩnh | Tế tửu `te_tuu` | Văn Miếu, Thư Lâu Lâm |
| `STAT-NGUDUY-THUC` | Thực Thương 食伤 | 食神 / 傷官 | **Nghệ đạo** | sáng tạo, diễn đạt, nghệ thuật, kỹ năng | Đan Đỉnh chân nhân `dan_dinh` | Võ Đang, Mao Sơn |
| `STAT-NGUDUY-TY` | Tỷ Kiếp 比劫 | 比肩 / 劫財 | **Đồng đạo** | ý chí, bạn bè, cạnh tranh, độc lập | Thiền sư Trúc Lâm `truclam_thiensu` | Yên Tử, Bút Tháp |

### 1.3 Phân bố thật (5.000 lá)

| | Tài | Quan | Ấn | Thực | Tỷ |
|---|---|---|---|---|---|
| Là trục trội | 20,9% | 19,9% | 20,4% | 18,9% | 19,9% |
| Là trục yếu | 19,0% | 18,8% | 19,8% | 21,3% | 21,1% |

Gần đều — mỗi cây kỹ năng là cây khởi đầu của khoảng 1/5 người chơi. **23,7%** lá số có ít nhất một trục = 0 (khuyết hẳn).

## 2. Hệ số thiên phú

```
TM[trục] = 1 + score / 500          // 0 → ×1,00 ; 50 → ×1,10 ; 100 → ×1,20
TM[trục yếu] += 0,25 sau khi xong chuỗi Bổ Khuyết   // trục yếu có thể thành ×1,25–1,27
```

| Điểm trục | 0 | 10 | 26 | 45 | 54 | 79 | 100 |
|---|---|---|---|---|---|---|---|
| TM | ×1,00 | ×1,02 | ×1,05 | ×1,09 | ×1,11 | ×1,16 | ×1,20 |
| TM sau Bổ Khuyết (nếu là trục yếu) | ×1,25 | ×1,27 | ×1,30 | — | — | — | — |

TM nhân **điểm kinh nghiệm cây** (Ngộ), không nhân Đạo Hạnh và không vào rổ R1. Trục mạnh nhất học nhanh hơn trục yếu nhất tối đa 20%; sau Bổ Khuyết, trục yếu học nhanh nhất. Đây là bản cơ chế của câu «chỗ thiếu là chỗ đáng tu».

### 2.1 Ngộ — điểm kỹ năng

| Mục | Giá trị |
|---|---|
| Kinh nghiệm cây | mỗi hoạt động gắn thẻ trục (09 gắn) cho `XP_cây = công tu thô × TM[trục]` |
| Đổi Ngộ | **60 XP = 1 Ngộ** của cây đó; Ngộ không chuyển giữa các cây |
| Lưu | `state.player.hauThien.ngo[trục] = { xp, spent, nodes: [] }` |
| Tham chiếu | 40 công tu/ngày dồn một cây, TM ×1,10 → 0,73 Ngộ/ngày → đủ 31 Ngộ (cả cây) sau ~42 ngày; bậc cảnh giới 5 (điều kiện nút cuối) đến sau ~44–50 ngày (04-08 §4) — hai đồng hồ gặp nhau |

## 3. Cấu trúc cây

Mỗi cây 12 nút, 5 tầng. Tổng giá 31 Ngộ.

| Tầng | Nút | Giá mỗi nút | Điều kiện mở tầng | Ghi chú |
|---|---|---|---|---|
| I | 01–03 | 1 Ngộ | không | nút 01 của **trục trội** tặng sẵn lúc tạo nhân vật |
| II | 04–06 | 2 | đã tiêu ≥ 3 Ngộ trong cây + cảnh giới ≥ 2 | |
| III | 07–09 | 3 | đã tiêu ≥ 9 + cảnh giới ≥ 3 | |
| IV | 10–11 | 4 | đã tiêu ≥ 18 + cảnh giới ≥ 4 | |
| V | 12 | 5 | đã tiêu ≥ 26 + cảnh giới ≥ 5 + **nhiệm vụ truyền thừa** của người dẫn | nút «đại thành» |

Quy tắc chung:

- Nút chỉ **thêm** khả năng / hoạt động / % thưởng, không có nút «đánh đổi» (không có −).
- Các % của nút thuộc rổ R1 (trần +40%).
- Gỡ nút: miễn phí ở Bàn Thầy, 1 lần/tuần; hoàn đủ Ngộ.
- Một số Đặc Tính (`PERK-*`) **mở sớm** một nút (bỏ điều kiện cảnh giới, vẫn tốn Ngộ) — ghi ở cột «Mở sớm».

## 4. `STAT-BOKHUYET` — chuỗi Bổ Khuyết

Trang chính của app đã có mục *Khuyết/Thiếu Thập Thần*; game biến nó thành chuỗi 4 chương cho **trục yếu nhất** (`weakest`).

| Chương | Điều kiện | Nội dung | Kết quả |
|---|---|---|---|
| 1 · Thấy | cảnh giới 2 | Thầy Tử Bình mở Sổ Mệnh ở mục Ngũ Duy, giảng trục yếu bằng `fiveDimRadar.summary` (câu engine: «Thiếu nhất: … — đây là khía cạnh cần bồi bổ (qua 大运/流 năm mang nhóm … sẽ kích hoạt)») | mở chương 2 |
| 2 · Học người | — | tìm 1 NPC có lá số **trội** đúng trục mình yếu (NPC khách ở giải án / sảnh nghề có lá số thật; `stations.js › chartCache`) | NPC đó thành «thầy phụ»; mở nút 01 của cây yếu miễn phí |
| 3 · Làm | — | làm 5 hoạt động thuộc trục yếu | +10 Ngộ cây yếu |
| 4 · Đón thời | năm can chi có **can** thuộc hành của trục yếu (với nhật chủ người chơi), hoặc chọn ngày ở Lịch Đường (`zheri`) có can ngày thuộc hành đó | lễ nhỏ ở vùng hợp hành đó (04-03 §6.1) | **TM trục yếu +0,25** vĩnh viễn |

Hành của trục (theo nhật chủ, `yong.relations`): Tài = `wealthWx`, Quan = `officerWx`, Ấn = `resourceWx`, Thực = `outputWx`, Tỷ = `sameWx`.

Trục yếu có điểm **0** (khuyết hẳn): chương 1 thêm câu «Lá số của con không có sao này. Không có nghĩa con không làm được việc này — nghĩa là con phải học nó như người lạ học một thứ tiếng. Người học tiếng lạ thường nói chuẩn hơn người bản xứ.»

`star-power › starPower(R)` cho thêm sắc thái: nếu sao của trục yếu là `藏而不透` (có căn mà ẩn), chương 4 đổi chữ thành «sao của con có rễ mà chưa lộ — năm … sẽ làm nó lộ ra»; nếu là `虚` / `虚浮`, giữ chữ mặc định.

## 5. Cây Thương đạo (Tài)

| Mã | Tầng | Tên nút | Tác dụng | Mở sớm |
|---|---|---|---|---|
| `STAT-ND-TAI-01` | I | **Biết Giá** | xem giá 3 chợ gần nhất trên bản đồ; nhận nhiệm vụ buôn cấp 1 | — |
| `STAT-ND-TAI-02` | I | **Gánh Hàng** | túi đồ +4 ô | — |
| `STAT-ND-TAI-03` | I | **Lời Thật** | trả giá thành công với NPC +10% (nếu không nói dối trong 7 ngày qua — 05 ghi nhận nói dối là `DEED`) | — |
| `STAT-ND-TAI-04` | II | **Tuyến Dược Liệu** | mở tuyến buôn dược liệu giữa 2 vùng khác hành; lãi +10% [R1] | `PERK-jinYu` |
| `STAT-ND-TAI-05` | II | **Sổ Sách** | thống kê lãi lỗ; Phúc Khí từ buôn +5% [R1] | — |
| `STAT-ND-TAI-06` | II | **Quầy Chợ** | mở quầy riêng ở chợ Huyền Thành (bán vật phẩm chế tác cho người chơi khác, MMO) | `PERK-luShen` |
| `STAT-ND-TAI-07` | III | **Thương Đoàn** | thuê 1 phu gánh tự chạy tuyến (1 chuyến/ngày, lãi 50% chuyến thường) | — |
| `STAT-ND-TAI-08` | III | **Đơn Lớn** | nhận đơn hàng của đạo quán (cung cấp nhang, giấy, dầu) — mỗi đơn +Phúc Khí lớn | `PERK-tianChu` |
| `STAT-ND-TAI-09` | III | **Bố Thí Đúng Chỗ** | bố thí từ lợi nhuận buôn được ghi vào Sổ Công Quá với hệ số ×1,2 (05 định nghĩa công) | — |
| `STAT-ND-TAI-10` | IV | **Thông Thương Ngũ Phương** | tuyến 5 vùng, mỗi vùng một hành; hoàn thành vòng → +15% Phúc Khí buôn trong 3 ngày [R1] | — |
| `STAT-ND-TAI-11` | IV | **Nghĩa Thương** | bán rẻ cho NPC nghèo (chỉ số «nghèo» do 06) → công đức thay cho lãi | — |
| `STAT-ND-TAI-12` | V | **Đào Chu Công** | lập Thương Hội (MMO, ≤ 30 người); mở sự kiện chợ phiên mùng 1 / rằm ở Huyền Thành | nhiệm vụ truyền thừa: giúp một người chơi khác lập quầy đầu tiên |

## 6. Cây Trị đạo (Quan)

| Mã | Tầng | Tên nút | Tác dụng | Mở sớm |
|---|---|---|---|---|
| `STAT-ND-QUAN-01` | I | **Lễ Nghi** | mở lựa chọn thoại «theo lễ» với quan chức, chưởng môn (NPC phản ứng +1 bậc tôn trọng) | — |
| `STAT-ND-QUAN-02` | I | **Phân Xử Nhỏ** | nhận vụ tranh chấp NPC cấp 1 (hàng xóm, tiền nợ nhỏ) | — |
| `STAT-ND-QUAN-03` | I | **Kỷ Luật** | việc lặp lại lần thứ 3 trở đi trong ngày tốn Nguyên Khí −10% | — |
| `STAT-ND-QUAN-04` | II | **Chấp Sự** | nhận chức chấp sự Sơn Môn: giao 3 việc/ngày cho NPC đệ tử, nhận Phúc Khí theo kết quả | `PERK-jiangXing` |
| `STAT-ND-QUAN-05` | II | **Lập Hội** | lập bang hội ≤ 10 người (10 định nghĩa `GUILD-*`) | — |
| `STAT-ND-QUAN-06` | II | **Án Văn** | giải án khách: thêm 1 gợi ý «điều luật cổ pháp» (trích `DITIANSUI_MAXIMS`) | `PERK-kuiGang` |
| `STAT-ND-QUAN-07` | III | **Thủ Tọa** | giao việc cho 3 NPC cùng lúc; điểm giải án +8% [R1] | — |
| `STAT-ND-QUAN-08` | III | **Công Đường** | xử tranh chấp cấp 3 (đất đai, thừa kế giữa NPC) — mỗi vụ là một chuỗi thoại nhiều nhánh | `PERK-guoYin` |
| `STAT-ND-QUAN-09` | III | **Uy Nghi** | trong đối chất với quầy Định Mệnh Hội, thêm lựa chọn «vạch luật» (bắt NPC lừa đảo chứng minh lời phán bằng lá số thật — `anti-manipulation-data`) | — |
| `STAT-ND-QUAN-10` | IV | **Pháp Độ** | soạn quy ước bang (3 điều); thành viên giữ quy ước được +5% công tu khi tu chung [R1] | — |
| `STAT-ND-QUAN-11` | IV | **Chưởng Môn Dự Khuyết** | được mời họp hội đồng đạo thống (cảnh cốt truyện Hồi II, 03 viết) | — |
| `STAT-ND-QUAN-12` | V | **Thanh Thiên** | xử «đại án» Hồi III (một vụ oan do Định Mệnh Hội gây ra); danh hiệu «Thanh Thiên» | nhiệm vụ truyền thừa: xử 10 vụ cấp 3 không vụ nào bị NPC kháng án |

## 7. Cây Học đạo (Ấn)

| Mã | Tầng | Tên nút | Tác dụng | Mở sớm |
|---|---|---|---|---|
| `STAT-ND-AN-01` | I | **Đọc Nhanh** | tốc độ đọc cổ thư +15% (cộng với Linh Tuệ S1) | — |
| `STAT-ND-AN-02` | I | **Chú Giải** | ghi chú vào sổ tay; ghi chú hiện lại khi gặp câu hỏi liên quan | — |
| `STAT-ND-AN-03` | I | **Tĩnh Tâm Đọc** | đọc ở nơi yên tĩnh (thư phòng, am) +10% công tu [R1] | — |
| `STAT-ND-AN-04` | II | **Kệ Thứ Hai** | mở kệ sách thứ 2 của Tàng kinh các (`daozang-data` bản phổ thông) | `PERK-wenChang` |
| `STAT-ND-AN-05` | II | **Hương Thí** | dự khoa cử vòng 1 | `PERK-xueTang` |
| `STAT-ND-AN-06` | II | **Thụ Lục Sơ Cấp** | nhận lục cấp đầu ở Long Hổ (chuỗi đạo thống `CQ-*` của 05) | — |
| `STAT-ND-AN-07` | III | **Hội Thí** | khoa cử vòng 2 | `PERK-ciGuan` |
| `STAT-ND-AN-08` | III | **Bản Hiếm** | đọc bản hiếm của Đạo Tạng (1.527 bản, `daozang-data`), mỗi bản đọc xong +công tu lớn | `PERK-taiJi` |
| `STAT-ND-AN-09` | III | **Bái Sư** | nhận thêm 1 sư phụ ở đạo thống khác (tính cho điều kiện «Quy nhất») | `PERK-tianYi` |
| `STAT-ND-AN-10` | IV | **Đình Thí** | khoa cử vòng cuối, mở danh hiệu theo hạng | — |
| `STAT-ND-AN-11` | IV | **Bác Lãm** | đọc chéo đạo thống: sách của đạo khác cho +10% công tu [R1] | `PERK-huaGai` |
| `STAT-ND-AN-12` | V | **Môn Sinh Văn Miếu** | giảng một buổi ở Văn Miếu cho người chơi khác (MMO); danh hiệu «Tế Tửu Môn Sinh» | nhiệm vụ truyền thừa: đỗ Đình Thí + chú giải 30 câu `DITIANSUI_MAXIMS` |

## 8. Cây Nghệ đạo (Thực)

| Mã | Tầng | Tên nút | Tác dụng | Mở sớm |
|---|---|---|---|---|
| `STAT-ND-THUC-01` | I | **Mài Mực** | thư pháp sơ cấp: viết câu đối (trang trí nhà riêng) | — |
| `STAT-ND-THUC-02` | I | **Pha Trà** | pha trà hồi Nguyên Khí +5 so với trà mua sẵn | — |
| `STAT-ND-THUC-03` | I | **Cầm Sơ Học** | chơi đàn ở đình: NPC xung quanh +1 thiện cảm | — |
| `STAT-ND-THUC-04` | II | **Vẽ Phù** | kết phù với **ký tự hư cấu của game** (canon T6); dung sai +5% | `PERK-taiJi` |
| `STAT-ND-THUC-05` | II | **Luyện Đan Sơ Cấp** | lò đan riêng ở nhà; tỉ lệ thành đan +5 điểm % | `PERK-tianYiMed` |
| `STAT-ND-THUC-06` | II | **Đề Biển** | viết biển hiệu cho công trình NPC → Phúc Khí + tên mình hiện trên biển | `PERK-wenChang` |
| `STAT-ND-THUC-07` | III | **Cầm Tâm** | đàn trước khi tĩnh tọa: dao động tâm −10% trong lần tĩnh tọa kế tiếp | — |
| `STAT-ND-THUC-08` | III | **Đan Phẩm** | đan có phẩm (thường / lương / thượng); thượng phẩm hồi Nguyên Khí ×1,5 | — |
| `STAT-ND-THUC-09` | III | **Họa Sơn Thủy** | vẽ tranh vùng đang đứng; tranh treo nhà riêng cho «thiên thời vùng đó» khi ngồi thiền ở nhà (1 tranh có hiệu lực) | `PERK-hongYan` |
| `STAT-ND-THUC-10` | IV | **Khai Quang Vật Trang Trí** | tạo vật trang trí nội thất có hành (đặt đúng phương → nhà riêng +5% công tu thiền [R1]) | — |
| `STAT-ND-THUC-11` | IV | **Tạo Tác Đạo Tràng** | thiết kế một gian đạo tràng (mô-đun nội thất `MOD-*` của 08) | — |
| `STAT-ND-THUC-12` | V | **Nhất Nghệ Thông Thần** | tác phẩm của mình được NPC sưu tầm, trưng ở một thánh địa; danh hiệu «Thông Thần» | nhiệm vụ truyền thừa: đan thượng phẩm + tranh + câu đối dâng Đan Đỉnh chân nhân |

## 9. Cây Đồng đạo (Tỷ)

| Mã | Tầng | Tên nút | Tác dụng | Mở sớm |
|---|---|---|---|---|
| `STAT-ND-TY-01` | I | **Kết Bạn** | mời ghép đội từ xa (không cần đứng gần) | — |
| `STAT-ND-TY-02` | I | **Đồng Hành** | một NPC đồng hành đi theo ở vùng đã mở (trò chuyện, chỉ đường) | `PERK-taoHua` |
| `STAT-ND-TY-03` | I | **Chia Phần** | khi đi cùng đội, Phúc Khí chia đều và mỗi người +5% [R1] | — |
| `STAT-ND-TY-04` | II | **Đồng Tu** | tĩnh tọa đôi: cả hai +10% công tu [R1] | — |
| `STAT-ND-TY-05` | II | **Sư Đồ** | nhận đồ đệ (người chơi cảnh giới thấp hơn) — kích hoạt Tiết Tú nếu thân quá vượng | — |
| `STAT-ND-TY-06` | II | **Trợ Thủ** | vào ải của người khác làm trợ thủ (không lấy thưởng của họ; mình nhận công tu «giúp người») | `PERK-tianDe` |
| `STAT-ND-TY-07` | III | **Kết Nghĩa** | kết nghĩa với 1 người chơi: khi một người lên cảnh giới, người kia nhận quà | — |
| `STAT-ND-TY-08` | III | **Hộ Pháp** | đứng canh người khác tĩnh tọa ở nơi công cộng: người được canh không bị gián đoạn, mình +công tu | `PERK-jiangXing` |
| `STAT-ND-TY-09` | III | **Đại Hội** | tổ chức lễ nhóm (dâng hương tập thể, phóng sinh mùng 1 / rằm) | — |
| `STAT-ND-TY-10` | IV | **Đạo Hữu Thiên Hạ** | bạn bè cùng vùng hiện trên bản đồ; gặp bạn ở thánh địa khác đạo → +5% công tu hôm đó [R1] | — |
| `STAT-ND-TY-11` | IV | **Truyền Đăng** | truyền một nút tầng I của mình cho đồ đệ (đồ đệ mở nút đó không tốn Ngộ) | — |
| `STAT-ND-TY-12` | V | **Đồng Tâm Hiệp Lực** | khi ≥ 5 người cùng bang tĩnh tọa cùng lúc, cả nhóm +15% công tu [R1] (một lần/ngày) | nhiệm vụ truyền thừa: dẫn 3 đồ đệ lên cảnh giới 3 |

## 10. Tương tác Ngũ Duy với chỉ số khác

| Với | Tương tác |
|---|---|
| Thân Lực | Đồng đạo (Tỷ) + thân quá vượng = Tiết Tú (`STAT-ND-TY-05`); Đồng đạo + thân nhược = nhận trợ ×1,5 trong đội — hai kiểu lá số đều hưởng cây này, theo hai hướng. |
| Mệnh Cách | Vị thuốc của lộ Đắc Cứu là **nhóm thập thần** (`rescues[].drug`: ti/yin/shi/cai/guan) — chính là 5 trục Ngũ Duy. Đi tìm thuốc = làm việc của trục đó → nhận XP cây đó (04-05 §2.3). |
| Đặc Tính | 16 Đặc Tính mở sớm 19 nút (cột «Mở sớm»); `PERK-taiJi`, `PERK-wenChang`, `PERK-jiangXing` mỗi sao mở 2 nút ở 2 cây. |
| Thời Vận | Chương 4 Bổ Khuyết đợi năm có can thuộc hành trục yếu → dùng `R.liunian` để báo trước năm nào gần nhất. |
| Tính Khí | Không ảnh hưởng số; thoại của người dẫn cây đổi giọng theo Tính Khí (04-07 §3). |

## 11. Kiểm chứng trên lá số mẫu

| Mẫu | Tài | Quan | Ấn | Thực | Tỷ | Cây khởi đầu | Bổ Khuyết |
|---|---|---|---|---|---|---|---|
| `MAU-A` | 26 | 45 | 54 | 15 | **100** | Đồng đạo | Nghệ đạo (15) |
| `MAU-B` | 13 | 83 | **100** | 62 | 34 | Học đạo | Thương đạo (13) |
| `MAU-C` | 31 | 34 | **100** | 52 | 76 | Học đạo | Thương đạo (31) |
| `MAU-D` | 0 | 57 | 96 | **100** | 61 | Nghệ đạo | Thương đạo (**0**, khuyết hẳn) |
| `MAU-E` | **100** | 18 | 35 | 26 | 62 | Thương đạo | Trị đạo (18) |
| `MAU-F` | 40 | **100** | 66 | 66 | 79 | Trị đạo | Thương đạo (40) |
| `MAU-G` | 88 | 0 | 73 | **100** | 53 | Nghệ đạo | Trị đạo (**0**) |
| `MAU-H` | 83 | 79 | 66 | 23 | **100** | Đồng đạo | Nghệ đạo (23) |
| `MAU-L` | 24 | **100** | 87 | 82 | 73 | Trị đạo | Thương đạo (24) |
| `MAU-M` | 36 | 52 | 36 | **100** | 0 | Nghệ đạo | Đồng đạo (**0**) |

`MAU-M` đáng chú ý: cách Tòng Nhi (`從兒格`), Tỷ = 0 → «không có bạn đồng loại» trong lá số, Bổ Khuyết rơi vào Đồng đạo. Câu chuyện tự nhiên: người theo thế tài hoa phải học cách có bạn.

## 12. Ca biên

| Ca | Xử lý |
|---|---|
| `fiveDimRadar` lỗi | 5 cây mở đều, không cây khởi đầu, không Bổ Khuyết; ghi log. |
| Hai trục bằng nhau ở đỉnh | Engine chọn trục đứng trước theo thứ tự Tài, Quan, Ấn, Thực, Tỷ. Game giữ nguyên (tất định). |
| Hai trục bằng nhau ở đáy | Engine chọn trục đứng **sau** (phần tử cuối của mảng đã sắp). Giữ nguyên. |
| Mọi trục 0 trừ một | Có thể (lá số rất thiên). Cây khởi đầu = trục đó, Bổ Khuyết = trục 0 cuối theo thứ tự. |
| Sửa bát tự đổi trục trội | Nút 01 tặng sẵn của trục cũ **giữ nguyên** (không thu lại); nút 01 của trục mới tặng thêm. Ngộ đã kiếm giữ nguyên. TM tính lại theo điểm mới cho XP **sau** thời điểm sửa. |

## 13. Checklist nghiệm thu phần 04-04

- [ ] Điểm Ngũ Duy lấy nguyên từ `fiveDimRadar`; khớp bảng mẫu.
- [ ] TM = 1 + score/500; Bổ Khuyết +0,25 chỉ cho trục yếu.
- [ ] 60 XP = 1 Ngộ; tổng giá cây 31; điều kiện tầng đúng bảng §3.
- [ ] Không nút nào có hiệu ứng trừ.
- [ ] Gỡ nút miễn phí 1 lần/tuần, hoàn đủ Ngộ.
- [ ] Nút «Mở sớm» chỉ bỏ điều kiện cảnh giới, không bỏ giá Ngộ.
- [ ] Kết phù chỉ dùng ký tự hư cấu (T6).
