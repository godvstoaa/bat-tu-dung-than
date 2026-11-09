# 05-11 · Nho / Tịnh Minh (Văn Miếu) · Bàng môn Vu Y (Miêu Cương) · Pháp Môn Liễu Phàm

> Theo luật chung 05-06. Mã nhiệm vụ: `CQ-NH-xx`, `CQ-BM-xx`, `CQ-LP-xx`.
> Nho · Tịnh Minh là đạo thứ hai (cùng Tịnh Độ) **lấy việc thiện làm pháp tu**: Đạo Hạnh từ DEED nhóm T-HT (hiếu), T-GL (giữ lời), T-KT (khuyên thiện) của người tu Nho được gán vào ĐH-đạo Nho (05-06 §3.2).
> Bàng môn Vu Y là **đạo phụ** (không chiếm suất, 3 hạng). Nội dung y dược chỉ ở mức **văn hóa** (`tcm`): không chẩn bệnh, không kê thuốc, không công thức (câu cấm của Vu y bà A Mậu).

---

# PHẦN A — NHO 儒 · TỊNH MINH 净明

## A.1 Tổng quan

| Hạng mục | Nội dung |
|---|---|
| Phái (app) | `jingming` — Tịnh Minh: «"Nho – đạo hợp nhất" — trung hiếu làm gốc; "净明" = tâm tịnh sáng (đạo đức tu hành)»; tổ 許逊 (Hứa Tốn, Tấn) + 刘玉 (Nguyên); kinh 《净明忠孝全书》; «cư sĩ nặng — tu tại gia, trọng đạo đức» |
| Nho (không có trong `SCHOOLS`) | nguồn: `LIAOFAN` (立命之学 → 改过之法 → 积善之方 → 谦德之效), `LIAOFAN_STORY`, `REMEDY_QUOTES`, `TEN_THIEN`, `spiritual-fs` (đức theo hành: nhân 仁 Mộc, lễ 礼 Hỏa, tín 信 Thổ, nghĩa 义 Kim, trí 智 Thủy), `library-data`, `cases.js`, `naming` |
| Thánh địa | `vanmieu` — Văn Miếu Quốc Tử Giám (0, 1900); nguyên mẫu Văn Miếu – Quốc Tử Giám Hà Nội (Khuê Văn Các, giếng Thiên Quang, bia tiến sĩ) |
| NPC dẫn | Tế tửu Chu Văn Trinh (`te_tuu`) — «lão phu – trò», mạch lạc; công cụ AI `analyze_name` |
| Hành của đạo | chính **Mộc** (nhân), phụ **Hỏa** (lễ) |
| Tu Bổ | Học đạo · Trị đạo |
| Đặc điểm | đạo **khoa cử**: thang hạng = học vị; thi định kỳ; bia Đạo Hạnh (Đại Nguyện 2, 05-01 §4.4) đặt ở đây |

## A.2 Thang hạng — học vị

| Hạng | Tên hạng | Đạt bằng | Lịch thi trong game |
|---|---|---|---|
| I | **Sinh Đồ** | `CQ-NH-01` | — |
| II | **Tú Tài** | qua **thi Hương** (vòng 1) | mỗi Chủ nhật, giờ Thìn (giờ máy chủ) |
| III | **Cử Nhân** | qua thi Hương trọn 3 vòng | như trên (3 vòng trong 3 tuần) |
| IV | **Tiến Sĩ** | qua **thi Hội** rồi **thi Đình** | thi Hội: Rằm mỗi tháng âm; thi Đình: Rằm tháng cuối mỗi quý |
| V | **Hàn Lâm** | viên mãn | — |

**Liên hệ Liễu Phàm:** Khổng tiên sinh đoán Liễu Phàm «đỗ tú tài hạng 14»; sau 6.000 công ông đỗ tiến sĩ (`LIAOFAN_STORY.story`). Trong game, Tế tửu kể chuyện này ở `CQ-NH-06` — học vị Tiến Sĩ của người chơi và Đại Nguyện 2 (bia Đạo Hạnh, 600 công) là **hai đường khác nhau** cùng gặp ở Văn Miếu: một đường thi, một đường đức. Ai đi đủ cả hai được thêm danh xưng «Liễu Phàm Hậu Học» (thẩm mỹ).

### A.2.1 Đề thi

| Kỳ | Vòng | Dạng đề | Nguồn |
|---|---|---|---|
| Hương | 1 · Kinh nghĩa | 10 câu nghĩa câu cổ thư (chọn nghĩa đúng) | `library-data`, `DITIANSUI_MAXIMS`, `REMEDY_QUOTES` |
| Hương | 2 · Luận lá số | giải một án khách (6 bước như `cases.js`) | `cases.js`, `chart`, `kb` |
| Hương | 3 · Văn | ghép một bài «văn sách» ngắn từ các mảnh câu (chọn thứ tự lập luận) về một vấn đề Huyền Thành (vd quầy Định Mệnh Hội) | nội dung game + `anti-manipulation-data` |
| Hội | 1 vòng | 20 câu tổng hợp + 1 án khách khó (lá số có tổ hợp hung) | như trên; `combos`, `SPECIFIC_REMEDY` |
| Đình | 1 vòng | Tế tửu hỏi trực tiếp 3 câu «đối sách» (hội thoại có lựa chọn; chấm theo lập luận nhất quán và đức — có câu đúng về kiến thức nhưng kiêu thì bị trừ) | nội dung game |

**Điểm và bảng vàng:** qua mỗi kỳ ≥ 70%. Bảng vàng niêm yết **bút danh** (`CQ-MD-24`) — không lộ tên tài khoản nếu người chơi không muốn. Không có xếp hạng «trạng nguyên» công khai trong bảng chính (tránh tranh); danh hiệu «Đình Nguyên» trao cho người đạt tuyệt đối kỳ Đình, hiện như dấu nhỏ.

## A.3 Giới

| Loại | Giới | Mở | Thẻ giới hiện khi | Phạm khi |
|---|---|---|---|---|
| Thường trực 1 | **Không gian lận khoa cử** | I | vật phẩm «sách lận» ở chợ đen; lời rủ chép bài | mua / dùng / chép (đồng thời DEED-214 / DEED-219) |
| Thường trực 2 | **Hiếu** — không chọn việc bất hiếu (DEED A-BH) | III | thẻ hậu quả DEED-235…237 | chọn |
| Thường trực 3 | **Tín** — không dối có hại (DEED A-DT) | IV | thẻ hậu quả DEED-222…229 | chọn |
| Đạo tràng | không chạm, không ngồi lên bia đá, rùa đá (va chạm chặn; thẻ khi cố) | I | | |
| Đạo tràng | ăn mặc chỉnh tề trong Đại Thành Điện (phục lễ tự đổi khi vào) | I | | |

## A.4 Hoạt động lõi

### A.4.1 Học và thi (`B = 12` / buổi học; thi: theo kỳ)

- **Buổi học** ở giảng đường Quốc Tử Giám: Tế tửu giảng một đề (5 phút, thoại + thẻ), sau đó 5 câu ôn. Không AFK: ôn bắt buộc.
- **Thi:** Hương vòng `B = 20`, Hội `B = 50`, Đình `B = 80` (khi qua; trượt: `B = 5` cho công đi thi — «trượt không mất gì ngoài thời gian»).
- **Gian lận:** game không kiểm được tra cứu ngoài đời; chỉ cấm vật phẩm gian lận **trong game**. Đề Hương vòng 2 (giải án) dùng lá số NPC ngẫu nhiên → khó chép.

### A.4.2 Công quá cách — tự tỉnh (`B = 8` / ngày)

- Cuối ngày (sau 19h giờ máy chủ), ở thư phòng Văn Miếu hoặc nhà riêng có bàn sách: người chơi mở Sổ Công Quá trang hôm nay, trả lời **ba câu tự tỉnh** (theo «吾日三省吾身» của Tăng Tử — văn cổ, phạm vi công cộng):
  1. «Hôm nay làm việc cho người, có hết lòng không?»
  2. «Hôm nay với bạn bè, có giữ chữ tín không?»
  3. «Điều thầy dạy, hôm nay có ôn không?»
- Mỗi câu: «có / chưa / không rõ». **Không có câu trả lời đúng**; mọi lựa chọn cho thưởng như nhau. Hệ thống không đối chiếu với dữ liệu (để người chơi không «trả lời cho điểm»).
- Ghi một dòng vào sổ đời thực **nếu** người chơi bật (05-03 §6).

### A.4.3 Hiếu đạo, giữ lời, khuyên thiện (DEED)

- ĐH từ DEED nhóm T-HT, T-GL, T-KT của người tu Nho được gán thêm vào ĐH-đạo Nho.
- Ngũ thường theo Dụng: `spiritual-fs › WX_PRACTICES[yong.primary].virtue` cho «đức cần rèn» theo hành Dụng (Mộc: nhân; Hỏa: lễ; Thổ: tín; Kim: nghĩa; Thủy: trí). DEED gắn hạnh `TEN_THIEN` tương ứng đức đó được `B +1` (nhỏ, khuyến khích đúng hướng).

| Dụng | Đức (app `virtue`) | Hạnh `TEN_THIEN` khuyến khích |
|---|---|---|
| Mộc | 仁 nhân từ — yêu thương vạn vật, tha thứ | 爱惜物命, 与人为善 |
| Hỏa | 礼 lễ nghĩa — tôn trọng, khiêm cung | 敬重尊长, 爱敬存心 |
| Thổ | 信 tín thực — giữ lời, thành thật | (giữ lời — T-GL) |
| Kim | 义 nghĩa khí — công bằng, liêm khiết | 救人危急, 护持正法 |
| Thủy | 智 trí tuệ — thấu nhân quả | 劝人为善 |

MAU-A (Dụng Thủy) → đức **trí**; hạnh khuyến khích: khuyên thiện (vạch mặt Định Mệnh Hội) — khớp với Tâm Đề Canh «Ôn» (05-01 §3.5): người chơi được dẫn tới **khuyên bằng lời mềm**.

## A.5 Chuỗi nhiệm vụ Nho · Tịnh Minh

| Mã | Tên | Mục tiêu | Mở | Dạy | Thưởng |
|---|---|---|---|---|---|
| CQ-NH-01 | Khuê Văn Các | vào cổng Văn Miếu, qua Khuê Văn Các; nghe Tế tửu nói về Văn Miếu (văn hóa) và 9 chiều của `jingming`; nhận giới 1; ghi danh sinh đồ | đến `vanmieu` | `SCHOOLS.jingming`; thẻ Văn Miếu | B 30; hạng I |
| CQ-NH-02 | Lập chí | làm `CQ-MD-72` (chọn chí) nếu chưa; Tế tửu đọc câu «人之有志，如樹之有根» | I | `LIAOFAN.quote` | B 25 |
| CQ-NH-03 | Tên gọi | đặt đạo hiệu (`CQ-MD-22`) hoặc bút danh (`CQ-MD-24`) nếu chưa | I | `naming` | B 20 |
| CQ-NH-04 | Năm đức theo hành | đọc thẻ năm đức; tìm đức của Dụng mình; làm 3 việc thuộc đức ấy | I | `WX_PRACTICES[*].virtue` | B 25 |
| CQ-NH-05 | Thi Hương vòng 1 | qua kinh nghĩa | I | kỳ thi | B 20 (thi) + B 15 (nhiệm vụ); hạng **II · Tú Tài** |
| CQ-NH-06 | Bốn thiên Liễu Phàm | đọc 4 thẻ: lập mệnh, cải quá, tích thiện, khiêm đức; nghe chuyện «tú tài hạng 14» | II | `LIAOFAN.principle`, `LIAOFAN_STORY` | B 30 |
| CQ-NH-07 | Công quá cách | 7 ngày tự tỉnh liền; đọc thẻ *Thái Thượng Cảm Ứng Thiên* («祸福无门，惟人自召») | II | `REMEDY_QUOTES[1]`, `CONG_QUA` | B 35 |
| CQ-NH-08 | Trung hiếu | đọc thẻ Tịnh Minh: Hứa Tốn và «trung hiếu làm gốc»; làm 2 DEED hiếu (T-HT) | II | `jingming.coreMethod`, `canon` | B 30 |
| CQ-NH-09 | Luận lá số | thi Hương vòng 2 (giải án) | II | `cases.js` | B 20 + 15 |
| CQ-NH-10 | Văn sách | thi Hương vòng 3 (văn sách về Định Mệnh Hội) | II | `anti-manipulation-data` | B 20 + 30; hạng **III · Cử Nhân** |
| CQ-NH-11 | Lớp học trại | dạy chữ cho trẻ Miêu Cương 3 buổi (DEED-051) | III | — | B 35 |
| CQ-NH-12 | Người hòa giải | xử 3 tranh chấp ở Huyền Thành (DEED-056) — trị đạo của Nho | III | Trị đạo (Ngũ Duy) | B 35 |
| CQ-NH-13 | Đề câu đối | ghép câu đối treo Khuê Văn Các từ `REMEDY_QUOTES` (vd «满招损，谦受益») — mini-game thư pháp | III | `REMEDY_QUOTES` | B 30 |
| CQ-NH-14 | Thi Hội · thi Đình | qua thi Hội (Rằm) rồi thi Đình (Rằm cuối quý) | III | kỳ thi | B 50 + 80 (thi) + 20; hạng **IV · Tiến Sĩ** |
| CQ-NH-15 | Kèm sĩ tử nghèo | kèm 3 sĩ tử (NPC hoặc người chơi bậc thấp) qua thi Hương vòng 1 (DEED-061) | IV | — | B 60 |
| CQ-NH-V | Hàn Lâm | mở **lớp dạy** ở giảng đường: 10 buổi giảng (người chơi chọn đề từ ngân hàng 05-16), mỗi buổi ≥ 2 người nghe | IV, ĐH-đạo ≥ 1.800 | — | B 100; hạng **V**; danh hiệu «Hàn Lâm» |

**Tổng `B` chuỗi (phần nhiệm vụ, không tính thưởng thi):** 30+25+20+25+15+30+35+30+15+30+35+35+30+20+60+100 = **535**; cộng thưởng thi tối thiểu (20 × 3 vòng Hương + 50 + 80) = **725**.

## A.6 Kịch bản cảnh

```
[CẢNH CQ-NH-01.1 · Văn Miếu, sân giếng Thiên Quang · giờ Thìn · nắng xiên qua Khuê Văn Các]
(Dãy bia trên lưng rùa đá hai bên giếng. Tế tửu Chu Văn Trinh chắp tay sau lưng.)
TẾ TỬU: Trò đứng xa bia một chút. Chữ trên đó là của người đã đi trước sáu trăm năm.
> Lựa chọn: ① «Con muốn thi đỗ như họ.» → [.2a]  ② «Họ là ai ạ?» → [.2b]

[CẢNH CQ-NH-01.2a]
TẾ TỬU: Đỗ thì nhiều người đỗ. Người được khắc bia là người đỗ rồi vẫn còn học.
→ [.3]

[CẢNH CQ-NH-01.2b]
TẾ TỬU: Là những người đọc sách để làm người. Có người làm quan tốt, có người về làng dạy trẻ. Bia không ghi chuyện ấy, nhưng lão phu nhớ.
→ [.3]

[CẢNH CQ-NH-01.3]
TẾ TỬU: Vào cửa Nho có ba điều. Không gian lận. Giữ hiếu. Giữ tín. Điều đầu, giữ ngay từ hôm nay.
(Giới thường trực 1. Ghi danh sinh đồ. Hạng I.)
```

```
[CẢNH CQ-NH-14.3 · Văn Miếu, Đại Thành Điện · thi Đình · giờ Ngọ]
TẾ TỬU: Câu thứ ba. Một người đến xin trò lá số, nói «tôi chỉ cần biết tôi có giàu không». Trò trả lời thế nào?
> Lựa chọn: ① «Con đọc đúng lá số, rồi nói: giàu hay không còn tùy việc người làm.» ② «Con nói người đó sẽ giàu để họ vui.» ③ «Con từ chối vì câu hỏi tầm thường.»
TẾ TỬU: (với ①) Được. Trung thực mà không lạnh.
TẾ TỬU: (với ②) Vui một hôm, rồi hỏng một đời. Trò biết câu trả lời này sai — lão phu chấm điểm kiến thức, nhưng trừ chữ tín.
TẾ TỬU: (với ③) Câu hỏi nào của người đang lo cũng không tầm thường. Trò giỏi chữ, kém lòng.
```

## A.7 Giới hạn nội dung riêng

| # | Giới hạn |
|---|---|
| NH-G1 | Bia tiến sĩ lịch sử không bao giờ bị khắc thêm, đổi tên, hay làm vật tương tác. Bia Đạo Hạnh của máy chủ đặt **tách riêng**, kiến trúc khác (cố vấn di sản duyệt). |
| NH-G2 | Không xếp hạng khoa cử công khai theo tên tài khoản; dùng bút danh. |
| NH-G3 | Đề thi không chứa nội dung chính trị đương đại. |
| NH-G4 | Câu cổ thư trích ≤ 15 chữ / thẻ, ghi nguồn. |

---

# PHẦN B — BÀNG MÔN · VU Y (Miêu Cương Cổ Trại) — đạo phụ

## B.1 Tổng quan và nguyên tắc văn hóa

| Hạng mục | Nội dung |
|---|---|
| Nguồn app | `tcm` (`WUX_ZANG`, `DIET`, `seasonalHealth`, `MERIDIAN_CLOCK`, `bodyConstitution`) — chỉ dùng phần **văn hóa ngũ hành**; `amta-data` làm đối trọng (người trại là người chữa, không phải người yểm); `WX_REMEDY[*].food` |
| Thánh địa | `mieucuong` — Miêu Cương Cổ Trại (−1400, 1300); nguyên mẫu kiến trúc Phượng Hoàng cổ thành, trại Tây Giang |
| NPC dẫn | Vu y bà A Mậu (`vu_y_amau`) — «bà – cháu», thổ âm; câu cấm: công thức cổ / thuốc thật, chẩn bệnh |
| Loại | **đạo phụ** — không chiếm suất, 3 hạng, không có Tu Bổ, không tính Quy nhất |
| Vai trong cốt truyện (canon) | người trại là **nạn nhân và người chữa**; kẻ ác là Yểm sư Lỗ Ban (người ngoài), hang của hắn ở dưới trại |

**Nguyên tắc văn hóa (bắt buộc):**

| # | Nguyên tắc |
|---|---|
| BM-V1 | Không gán «cổ độc», «yểm», «bùa ngải» cho người trại. Mọi «cổ» trong game là **vật giả của Lỗ Ban**, và trong mọi án đều có nguyên nhân thật (ngộ độc thức ăn hỏng, bột giả, sợ hãi bị kích động). |
| BM-V2 | Người trại có tên riêng, nghề riêng, ý kiến riêng (tài liệu 06), không làm nền «bí ẩn». |
| BM-V3 | Trang phục, nhà sàn, lễ hội: **hư cấu lấy cảm hứng**, có cố vấn văn hóa; không đặt tên lễ thật cho lễ hư cấu. |
| BM-V4 | Y dược chỉ ở tầng «người xưa nghĩ thế này»: vị, mùa, giờ, tạng theo ngũ hành. Không liều lượng, không công thức, không «chữa bệnh X». Mọi cảnh có người ốm thật → **gọi thầy thuốc**. |
| BM-V5 | Câu hỏi mở: tên vùng «Miêu Cương» gắn với một dân tộc có thật; đề xuất cân nhắc đổi tên hư cấu (README · câu hỏi mở). |

## B.2 Thang hạng (3)

| Hạng | Tên | Điều kiện |
|---|---|---|
| I | **Hái Thuốc** | `CQ-BM-01` |
| II | **Biết Hành** | `CQ-BM-01…05`; ĐH-đạo 150 |
| III | **Người Giữ Vườn** | `CQ-BM-01…15`; ĐH-đạo 450 |

Không có hạng IV–V. Viên mãn của bàng môn là **danh hiệu «Bạn Của Trại»** khi xong hạng III, kèm một căn nhà sàn khách mời trong trại (người chơi ghé nghỉ được).

## B.3 Giới (đạo phụ: một giới)

| Giới | Thẻ giới hiện khi | Phạm khi |
|---|---|---|
| **Không đem thuốc trại ra bán** | chợ đen mua «thuốc Miêu» | bán |

## B.4 Hoạt động lõi

| Hoạt động | `B` | Cơ chế | Nguồn |
|---|---|---|---|
| Hái thuốc theo hành | 8 | vườn và rừng có cây gắn **thẻ hành** (vị chua – Mộc, đắng – Hỏa, ngọt – Thổ, cay – Kim, mặn – Thủy); bà A Mậu giao đơn «cần ba vị Mộc, một vị Thổ»; người chơi tìm theo hình, mùi (mô tả), mùa | `WX_REMEDY[*].food` (vị), `DIET` |
| Nghe chuyện xưa | 6 | ngồi bếp lửa nghe bà kể (lore do tài liệu 02 viết, mã `LORE-*`), 3–5 phút | — |
| Nấu canh | 10 | canh lửa, cho vị theo mùa (`seasonalHealth` — chỉ «mùa nào người xưa ăn vị gì»); canh dọn cho lễ trại | `tcm › seasonalHealth` |

## B.5 Chuỗi nhiệm vụ Bàng môn

| Mã | Tên | Mục tiêu | Mở | Dạy | Thưởng |
|---|---|---|---|---|---|
| CQ-BM-01 | Cổng trại | tới trại; trại chủ mời rượu cần (từ chối được, không thành việc ác nếu không say); gặp bà A Mậu; nhận giới | đến `mieucuong` | — | B 25; hạng I |
| CQ-BM-02 | Năm vị | ghép 5 vị với 5 hành; nếm canh 5 vị (hoạt ảnh) | I | `WX_REMEDY[*].food`, `DIET` | B 20 |
| CQ-BM-03 | Vườn theo mùa | đọc tấm bảng gỗ «mùa nào trồng gì» của bà; trồng 3 cây đúng mùa | I | `seasonalHealth` (văn hóa) | B 20 |
| CQ-BM-04 | Mười hai canh | nghe bà kể người xưa chia ngày thành 12 canh, mỗi canh «một tạng làm việc»; câu bà luôn thêm: «Bà kể chuyện xưa. Đau thì đi thầy thuốc.» | I | `MERIDIAN_CLOCK` (văn hóa, không giải phẫu) | B 20 |
| CQ-BM-05 | Đơn đầu tiên | hoàn tất một đơn hái thuốc trọn | I | — | B 25; hạng **II** |
| CQ-BM-06 | Chuyện ông thợ lạ | nghe chuyện xưa: ông thợ mộc từ phương xa đến trại năm nào (Lỗ Ban, lore tài liệu 02) | II | lore | B 20 |
| CQ-BM-07 | Cả nhà nôn mửa | một nhà trong trại ngộ độc; dân xì xào «trúng cổ»; người chơi tìm ra nồi canh nấm hỏng, gọi thầy thuốc ở Huyền Thành, bà A Mậu ở lại chăm | II | BM-V1; DEED-043 | B 40 |
| CQ-BM-08 | Lớp chữ | dạy chữ trẻ trại 3 buổi (DEED-051) | II | — | B 30 |
| CQ-BM-09 | Giếng khô | đào giếng mùa hạn (DEED-193, tổ đội) | II | — | B 30 |
| CQ-BM-10 | Tay buôn thú | khuyên tay buôn bỏ nghề (DEED-158); tháo bẫy (DEED-005) | II | — | B 30 |
| CQ-BM-11 | Canh lễ hội | nấu canh cho lễ trại (3 nồi, đúng vị mùa) | II | `seasonalHealth` | B 30 |
| CQ-BM-12 | Gói bột trước cửa | một gói «bột cổ» đặt trước cửa nhà trưởng trại; người chơi mang bột lên Mao Sơn (nếu đã tu TT) hoặc Y quán: bột là bột gạo nhuộm màu — đồ giả để gây sợ | II | BM-V1; quy trình 5 bước (05-08 §B.5.2) | B 35 |
| CQ-BM-13 | Hang dưới trại | theo vết người đặt bột, tìm ra cửa hang dưới trại (Hồi III–IV, tài liệu 03 nối tiếp) | II | — | B 40 |
| CQ-BM-14 | Trả lại tên cho trại | ở chợ Huyền Thành, người ta đồn «người Miêu bỏ bùa»; người chơi kể chuyện gói bột giả trước đám đông, mời trưởng trại xuống chợ bán hàng | II | BM-V1, BM-V2; DEED khuyên thiện | B 40 |
| CQ-BM-15 | Đêm lễ trại | dự lễ trại (hư cấu): múa quanh lửa (tham gia hoặc ngồi xem), nhận vòng cổ bạc khách mời (thẩm mỹ) | II | — | B 50; hạng **III**; danh hiệu «Bạn Của Trại» |

**Tổng `B` chuỗi:** 25+20+20+20+25+20+40+30+30+30+30+35+40+40+50 = **455**.

## B.6 Kịch bản cảnh

```
[CẢNH CQ-BM-07.2 · Miêu Cương, nhà sàn · giờ Thân · mưa rừng]
(Người lớn trong nhà nằm mệt; hàng xóm đứng ngoài cầu thang thì thầm.)
HÀNG XÓM: Trúng cổ rồi. Nhà này hôm trước cãi nhau với…
> Lựa chọn: ① «Đừng nói thế.» → [.3a]  ② (vào bếp xem trước) → [.3b]

[CẢNH CQ-BM-07.3a]
NGƯỜI CHƠI: Chưa biết gì thì đừng nói thế.
HÀNG XÓM: (lùi lại) …
→ [.3b]

[CẢNH CQ-BM-07.3b · bếp]
(Mini-game tìm vật: nồi canh nấm để từ hôm qua, mùi chua.)
VU Y BÀ A MẬU: (lên tới, thở dốc) Nấm hái chỗ khe đá phải không? Năm nào cũng có nhà bị. Cháu chạy xuống Huyền Thành gọi thầy thuốc. Bà ở đây.
> Lựa chọn: ① (chạy đi — ngự kiếm được) ② «Bà có thuốc không ạ?»
VU Y BÀ A MẬU: (với ②) Bà có nước ấm với cái chăn. Thuốc thì thầy thuốc. Chạy đi cháu.
(Thầy thuốc tới. Cả nhà qua khỏi — cảnh hôm sau.)
VU Y BÀ A MẬU: Người ta thích nói «trúng cổ» vì nói thế thì không ai phải nhận mình nấu ẩu. Cháu nhớ nhé.
(B 40. DEED-043.)
```

---

# PHẦN C — PHÁP MÔN LIỄU PHÀM (không phải đạo thống)

## C.1 Định nghĩa

Con đường cho người chơi **không muốn** theo tôn giáo nào, chỉ muốn đi như Liễu Phàm: đếm việc mình làm, giữ một thói quen nhỏ mỗi ngày, hồi hướng. Dựa trên `ZHUNTI.how` (4 việc) và `CONG_QUA`. Chi tiết 4 việc ở 05-05 §8. Pháp môn **không chiếm suất**, không có Tu Bổ, **không tính** Quy nhất.

**Người chơi không muốn trì chú:** việc 1 (`持准提咒`) được thay bằng **một thói quen cố định tự chọn** (ngồi yên 3 phút — Ngũ Bộ tự gọi; đọc một thẻ Tàng Kinh; tự tỉnh ba câu của Nho). Vân Cốc: «Liễu Phàm trì chú vì thầy ông dạy thế. Con không quen thì giữ một việc khác, miễn là giữ đều.»

## C.2 Ba bậc

| Bậc | Tên | Điều kiện | Thưởng |
|---|---|---|---|
| 1 | **Phát Nguyện** | `CQ-LP-01`; chọn 4 việc cố định | danh xưng «người giữ sổ» |
| 2 | **Thường Hành** | 30 ngày có đủ 4 việc (không cần liền) | khung sổ đồng |
| 3 | **Viên Mãn** | 100 ngày đủ 4 việc **và** Đại Nguyện 1 (300 công) | khung sổ bạc; Vân Cốc tặng một bức thư pháp «命由我作，福自己求» treo nhà riêng |

## C.3 Chuỗi nhiệm vụ

| Mã | Tên | Mục tiêu | Thưởng |
|---|---|---|---|
| CQ-LP-01 | Bốn việc của Liễu Phàm | nghe Vân Cốc kể 4 việc; chọn thói quen 1, loại việc thiện cố định 3 | B 20 |
| CQ-LP-02 | Bảy ngày đầu | 7 ngày đủ 4 việc | B 50 (tu tâm) |
| CQ-LP-03 | Một trang đen | khi sổ có dòng quá đầu tiên: làm việc sửa (05-05 §5) — Vân Cốc kể Liễu Phàm cũng ghi lỗi | B 30 |
| CQ-LP-04 | Ba mươi ngày | bậc 2 | B 60 |
| CQ-LP-05 | Hồi hướng cho người chưa gặp | hồi hướng cho «người sẽ đọc cái sổ này sau con» 7 lần | B 30 |
| CQ-LP-06 | Kể cho người khác | kể chuyện Liễu Phàm cho 3 NPC đang chán nản (DEED-166) | B 30 |
| CQ-LP-07 | Một trăm ngày | bậc 3 | B 100 |

## C.4 Kịch bản cảnh

```
[CẢNH CQ-LP-01.1 · Am Vân Cốc · sáng · chim hót]
VÂN CỐC: Con không muốn vào chùa, vào quán?
> Lựa chọn: ① «Con chưa tin.» ② «Con bận.» ③ «Con thích tự đi.»
VÂN CỐC: (với ①) Liễu Phàm cũng chưa tin. Ông chỉ thử đếm.
VÂN CỐC: (với ②) Liễu Phàm làm quan, bận hơn con. Bốn việc này mỗi ngày mất ít hơn một chén trà.
VÂN CỐC: (với ③) Thì tự đi. Thầy chỉ đưa con cái sổ với cái đèn.
VÂN CỐC: Một: giữ một việc nhỏ mỗi ngày, đúng một việc, không đổi. Hai: ghi sổ. Ba: một việc thiện cố định. Bốn: tối đến, nghĩ xem việc hôm nay để cho ai.
(Chọn thói quen và loại việc thiện. Bậc 1 · Phát Nguyện.)
```
