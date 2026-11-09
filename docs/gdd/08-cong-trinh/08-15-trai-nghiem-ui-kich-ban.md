# 08-15 · Trải nghiệm vào nhà: yêu cầu giao diện và kịch bản mẫu tại công trình

> Phần trước định nghĩa **cái gì** có trong nhà; phần này định nghĩa **người chơi cảm thấy thế nào** khi bước vào, và những màn hướng dẫn / cảnh mẫu gắn với công trình. Mã giao diện `UI-xx` do tài liệu 12 cấp; lời thoại chính thức và persona do tài liệu 06 / 03 chốt — lời dưới đây là **bản mẫu** để dựng cảnh, đo nhịp, test. NPC phụ chưa có mã ghi theo vai.

---

## 1. Nhịp ba bước khi vào một công trình

| Bước | Thời gian | Điều xảy ra | Hệ phụ trách |
|---|---|---|---|
| **Ngưỡng** | 0–0,6 s | cửa mở (nếu đóng); bước qua ngưỡng: camera chuyển chế độ (08-03 §8.3), âm vang đổi, gió ngoài nhỏ lại | `doors.js`, `render3d`, `audio.js` |
| **Thích nghi** | 0,6–2 s | phơi sáng tăng («mắt quen tối», 08-04 §1.4); **băng tên công trình** hiện 2,5 s; NPC trong khoang quay đầu nhìn (nếu thức) | `render3d`, UI |
| **Khám phá** | sau 2 s | dấu trạm hiện mờ (không nhấp nháy); trạm chính là vùng sáng nhất | UI, ánh sáng |

Không có màn chờ, không cắt cảnh, không khóa điều khiển ở bất kỳ bước nào. Lần **đầu tiên** vào một công trình A / B: băng tên lâu hơn (4 s) và kèm một dòng giới thiệu công năng.

---

## 2. Yêu cầu giao diện (tài liệu 12 vẽ, cấp mã)

| # | Thành phần | Hành vi | Ghi chú |
|---|---|---|---|
| U1 | **Băng tên công trình** | khi vào khoang đầu của công trình: chữ Hán lớn · Hán Việt · nghĩa / công năng; ví dụ «祖師堂 · Tổ Sư Đường · nơi thờ tổ sư Huyền Quán» | đổi khoang trong cùng công trình: băng nhỏ chỉ tên khoang |
| U2 | **Chỉ báo tầng** | góc trên: «Tầng 2 / 3» khi công trình có > 1 tầng; ở chân / đỉnh thang hiện mũi tên ▲ ▼ | ẩn ngoài trời |
| U3 | **Nút camera ⌂** | đổi TRONG ↔ BỔ DỌC; phím V; nhớ theo hạng | ẩn ngoài trời |
| U4 | **Biểu tượng cửa** | nhìn vào cửa đóng: ổ khóa / chữ «Mở giờ Mão» (giờ can chi + giờ dương lịch); cửa ngách có dấu «ngách» | không che màn |
| U5 | **Mặt bằng trong nhà** | trong bản đồ nhỏ, khi ở trong: thay bằng mặt bằng **sinh từ công thức** (hộp khoang, cửa, thang, trạm) của tầng hiện tại; khoang đã vào tô đậm | tự sinh, không vẽ tay |
| U6 | **Danh mục trạm công trình** | nhấn tên công trình trên băng → danh sách trạm (đã dùng hôm nay / chưa), bấm để đi tới | dùng `findPath3` |
| U7 | **Nhắc giờ đóng** | đầu giờ Tuất trong điện chính: «Điện sẽ đóng cửa sau giờ Tuất — ngách phía Tây vẫn mở» | một lần mỗi đêm |
| U8 | **Gõ cửa** | bấm cửa khóa → nút «Gõ cửa» (08-03 §6.6); sau 3 lần không ai mở: «Nhà đã ngủ» | |
| U9 | **Thông báo trùng tu** | công trình ở trạng thái trùng tu (08-13 §1.1): biển gỗ + dòng chữ khi tới gần | không dùng hộp thoại |
| U10 | **Trợ năng** | giảm chuyển động: cắt thẳng camera, tắt rung cổng, tắt nhấp nháy nến; cỡ chữ; **phụ đề âm thanh** cho âm định hướng (Manh Phái Cốc, chuông xa: «[Chuông Sơn Môn — phía Đông Bắc]») | bắt buộc ở Tượng Pháp Đường |
| U11 | **Cảm ứng** | chạm sàn tầng khác (đang thấy ở BỔ DỌC) → đi tới (có thang); giữ ngón 0,5 s trên cửa → mở / gõ | |
| U12 | **Thông báo vật dùng chung** | khi ai đó đánh chuông / trống: dòng nhỏ «Tiếng chuông sớm — 14 người đã đánh hôm nay» | không thông báo tên người khác nếu họ tắt hiện tên |

---

## 3. Kịch bản mẫu tại công trình

### 3.1 Lần đầu qua Sơn Môn — học cửa (INT-SM-SONMON)

Lần đầu người chơi tới Sơn Môn sau màn tạo nhân vật (chuỗi `MQ-P-*`). Mục đích: dạy ba điều — **cửa mở khi tới gần**, **gõ cửa khi khóa**, **ngách luôn mở**.

```
[CẢNH INT-SM-SONMON · lối giữa Sơn Môn · giờ Thìn · nắng]
(Người chơi đi tới, hai cánh cổng đang mở. Cửa phòng Nhập Môn bên trái đóng.)
LÃO TÙNG: (gọi vọng ra từ sau cửa) Khách lạ đấy à? Cửa không cài, cứ đẩy vào.
> Gợi ý nhẹ (chữ mờ trên cửa): «Đi tới để mở»
(Người chơi tới gần — cửa tự mở.)
LÃO TÙNG: (đặt bút) Ở quán này, cửa nào mở thì ai cũng vào được. Cửa nào cài then,
          gõ ba tiếng, có người thức thì người ta ra.
LÃO TÙNG: Còn đêm khuya, cổng lớn khóa, nhưng cái ngách trên cánh Tây chẳng bao giờ cài.
          Quán không đóng cửa với ai lỡ đường.
> Lựa chọn: ① «Cháu muốn nhập môn.» → [3.1b]  ② «Cháu chỉ xem qua.» → [3.1c]
```

```
[3.1b]
LÃO TÙNG: Thế thì trình lá số. Năm, tháng, ngày, giờ — giờ sinh càng đúng càng tốt.
(Mở giao diện «nhập bát tự ở cổng» đang có.)
LÃO TÙNG: (đọc, gật gù) Lá số này… có chỗ mạnh, có chỗ yếu, như mọi lá số.
          Đừng vội hỏi tốt hay xấu. Lên điện mà hỏi Thầy.
(Đánh dấu nhiệm vụ: tới Bệ Thầy Tử Bình.)
```

```
[3.1c]
LÃO TÙNG: Xem qua cũng được. Trong quán có mười mấy gian, gian nào cũng có người
          hoặc có việc. Muốn biết ở đâu có gì, nhìn bảng việc ngày ở phòng bên kia.
```

**Kiểm**: người chơi phải tự đi tới cửa (không có nút «vào»); nếu đứng yên 20 s ở lối giữa, Lão Tùng lặp câu đầu một lần.

### 3.2 Gõ cửa nhà dân — ba biến thể (INT-HT-NHA-*)

```
[CẢNH INT-HT-NHA-xx · cửa trước · giờ Tuất]
(Cửa khóa theo lịch `nha_dan`. Người chơi bấm cửa → gõ ba tiếng.)
CHỦ NHÀ: (sau 2 s, từ trong) Ai đấy?
> ① «Khách của quán, muốn hỏi chuyện.»   ② «Xin lỗi, gõ nhầm.»
(①) CHỦ NHÀ: (mở hé) À, người của Huyền Quán. Vào ngồi uống chén trà, nhà còn đèn.
    (cửa → HE 30 s)
(②) CHỦ NHÀ: Ừ. (im)
```

```
[CẢNH INT-HT-NHA-xx · cửa trước · giờ Sửu]
(Gõ ba tiếng — không ai trả lời. Gõ lần ba trong 60 s:)
CHỦ NHÀ: (ngái ngủ, vọng ra) Khuya rồi… mai hẵng đến.
(Quan hệ với nhà giảm nhẹ — tài liệu 06 định mức.)
```

```
[CẢNH INT-HT-NHA-xx · cửa trước · giờ Sửu · có nhiệm vụ đêm]
CHỦ NHÀ: (mở ngay, giọng gấp) May quá, quán cử người tới thật. Thằng bé nhà tôi…
(Cửa mở; cảnh nhiệm vụ do tài liệu 03 viết.)
```

### 3.3 Khóa chuông sớm — sự kiện chung (INT-SM-LAUCHUONG)

```
[CẢNH INT-SM-LAUCHUONG · phòng chuông · đầu giờ Mão · sương]
(Chung đầu đã đứng ở chày. Người chơi lên tới lầu.)
CHUNG ĐẦU: (không quay lại) Một trăm lẻ tám tiếng. Mười tám nhanh, mười tám chậm,
           mười tám vừa — hai lượt.
CHUNG ĐẦU: Muốn đánh cùng thì đứng bên kia. Đánh khi tiếng trước vừa tắt.
> Gợi ý: chạm chuông khi vòng sáng quanh chuông mờ hẳn (nhịp — mini-game tài liệu 09)
(Mỗi tiếng của người chơi: gói `ix` `sm.chuong`; mọi người trong phòng nghe.)
U12: «Tiếng chuông sớm — người thứ 14 hôm nay.»
CHUNG ĐẦU: (hết khóa) Chuông không để gọi ai dậy. Chuông để mình biết mình đã dậy.
```

### 3.4 Một vòng đời — Vận Mệnh Các (INT-SM-DIENTAY)

```
[CẢNH INT-SM-DIENTAY · hiên trước · giờ Tỵ]
THỦ CÁC: Khách đọc bia trước đã. Bia khắc cái gốc của lá số — Nhật chủ, vượng nhược,
         dụng thần. Cái gốc không đổi, nhưng đường đi thì do người đi.
(Người chơi đọc bia — trạm `vanbia`.)
THỦ CÁC: Vào trong, rẽ tay trái. Mỗi cổng là mười năm. Cổng nào sáng nhất là
         mười năm khách đang đi.
(Người chơi đi qua ①…⑨. Ở cổng thập kỷ hiện tại: chuông nhỏ.)
(Tới bàn 命, đúng chỗ đã bước vào.)
THỦ CÁC: (đứng ở cửa, nhìn vào) Đi một vòng thì lại về chỗ cũ. Người xưa gọi là
         «biết mệnh». Biết rồi thì sửa được — chứ không phải biết rồi thì thôi.
> Lựa chọn: ① «Sửa thế nào?» → mở trạm `vm_menh` (Mệnh Đồ)  ② «Cháu tự xem tiếp.»
```

Luật lời: không câu nào nói «mệnh đã định» (trụ cột T2); thập kỷ xấu luôn kèm một việc làm được (Mệnh Đồ).

### 3.5 Thầy Tử Bình trong Tĩnh thất (INT-SM-CHINHDUONG, giờ Tuất)

```
[CẢNH INT-SM-CHINHDUONG · Tĩnh thất Thầy · giờ Tuất · đèn dầu]
(Người chơi vào qua ngách Tây. Thầy ngồi án, đọc sách.)
THẦY TỬ BÌNH: Ban ngày khách đông, ta chỉ nói được cái sườn. Đêm thì nói được cái lý.
THẦY TỬ BÌNH: Ngồi. Hôm nay con muốn hỏi phần nào của lá số?
> Web: mở Thầy AI (`master-ui.js`) với ngữ cảnh «tĩnh thất, đêm» (persona tài liệu 06)
> iOS: Thầy giảng một bài theo lá số mẫu (không luận lá số riêng)
(Hết giờ Tuất:)
THẦY TỬ BÌNH: Đèn sắp cạn. Mai con lại ra bệ. Ra bằng ngách, đừng đánh thức đạo đồng.
```

### 3.6 Mượn cổ thư — Tàng Kinh (INT-SM-CHINHDUONG, tầng 2)

```
[CẢNH INT-SM-CHINHDUONG · Tàng Kinh · giờ Mùi]
THỦ KINH: Sách ở đây không mang ra khỏi gác. Đọc ở đây, chép thì chép ở bàn kia.
THỦ KINH: Tầng nào khách chưa đọc thì ta để dấu đỏ trên gáy.
(Trạm `cd_kinh` — tầng sách `library-data › LAYERS`; tầng Phù / Chú chỉ có văn bản.)
(Ngoài giờ Thìn – Thân thủ kinh không ở, trạm vẫn dùng được; biển trên án:)
BIỂN: «Thủ kinh nghỉ. Khách tự đọc, đọc xong để sách lại chỗ cũ.»
```

### 3.7 Quầy «đổi mệnh» — vạch mánh (INT-HT-SAP-06)

Mục đích: người chơi **nhận diện dấu hiệu thao túng tâm linh** (dữ liệu `anti-manipulation-data`), không có chuyện «mua mệnh» thật.

```
[CẢNH INT-HT-SAP-06 · quầy Định Mệnh Hội · giờ Dậu · đèn lồng đỏ]
NGƯỜI CHÀO MỜI: Tướng khách có quầng đen giữa trán. Năm nay hạn lớn đấy.
NGƯỜI CHÀO MỜI: May cho khách, hội có lá «đổi mệnh» — ba hôm là hết hạn.
                Chỉ còn hai lá, sáng mai là hết.
> Lựa chọn (người chơi chọn câu hỏi để vạch):
  ① «Ông xem tướng tôi trong ba giây mà biết hạn?»        → dấu hiệu: phán nhanh không căn cứ
  ② «Sao chỉ còn hai lá, sáng mai hết?»                   → dấu hiệu: tạo khan hiếm, thúc ép
  ③ «Hạn của tôi là hạn gì, theo trụ nào?»                → dấu hiệu: nói chung chung, né căn cứ
  ④ «Ừ, bán cho tôi một lá.»                               → [3.7d]
(Mỗi câu ①–③ đúng: người chào mời lúng túng; đủ 3 dấu hiệu: hắn dọn quầy bỏ đi, để lại tờ giấy
 có biểu tượng Định Mệnh Hội — manh mối tuyến phản diện, tài liệu 03.)
```

```
[3.7d]
NGƯỜI CHÀO MỜI: (đưa lá giấy, không lấy gì — game không bán) Khách giữ lấy.
(Lá «đổi mệnh» trong túi là **giấy trắng**; khi mở: dòng chữ của Vân Cốc (lore):
 «Mệnh do ta tạo, phúc tự mình cầu.»  — gợi ý tìm Am Vân Cốc.)
```

### 3.8 Kê lại nhà — án dương trạch tại nhà (INT-HT-NHA-*)

```
[CẢNH INT-HT-NHA-14 · gian giữa · giờ Tỵ]
(Nhà tọa Ngọ hướng Tý — hướng thật của mô hình.)
CHỦ NHÀ: Từ ngày kê cái bàn làm việc vào góc này, tôi ngủ không yên, việc thì rối.
(Người chơi mở la bàn: lưới 9 cung phủ lên sảnh thật; sao Huyền Không năm nay hiện trên từng cung.)
> Bước 1: chỉ ra cung đặt bàn hiện tại (sao gì) — chấm `grid9`
> Bước 2: chọn cung nên dời bàn tới — chấm theo Bát trạch của chủ nhà + phi tinh năm
> Bước 3: lý do (chọn 1 trong 3)
(Đúng: bàn **dời thật** trong nhà — lần sau vào vẫn thấy ở chỗ mới.)
CHỦ NHÀ: Thế mà nhẹ người hẳn. Mà… chắc cũng tại tôi hết lo cái bàn.
(Câu cuối cố ý: phong thủy giúp sắp xếp, tâm mới là chính — đúng tinh thần app.)
```

### 3.9 Đường Không Đèn — Tượng Pháp Đường (INT-MP-DAIDIEN)

```
[CẢNH INT-MP-DAIDIEN · Đường Không Đèn · giờ Thân · ánh sáng chân tường]
(Cửa mở; trong gần như tối. U10: phụ đề âm thanh bật sẵn trong khoang này.)
THẦY MANH PHÁI: (giọng ở cuối điện) Khách đứng đó. Đừng tìm đèn.
THẦY MANH PHÁI: Mười hai tấm đá trên tường, mỗi tấm một tượng. Lấy tay mà đọc.
(Người chơi chạm phù điêu: âm mô tả + chữ. Phù điêu nào khớp «tượng» trong lá số người chơi
 (`mangpai › analyzeMangpai`) thì ấm tay — rung nhẹ trên máy có rung, `haptics.js`.)
THẦY MANH PHÁI: Ta đọc lá số không bằng mắt bao giờ. Mắt hay tin cái hiện ra.
               Tay thì chỉ tin cái có thật.
```

Luật: không có câu đùa / chi tiết hạ thấp người khiếm thị; thầy là bậc thầy, không phải đối tượng thương hại.

### 3.10 Đi trong lá số — Quan Tinh Đài (INT-TT-QUANTINH)

```
[CẢNH INT-TT-QUANTINH · ô Tý (cửa chính) · đêm]
NGƯỜI GIỮ ĐÀI: Đài này xây theo hình lá số Tử Vi. Mười hai gian quanh, một sân giữa.
NGƯỜI GIỮ ĐÀI: Khách đã an sao thì mỗi gian sẽ mang tên cung của khách.
(Biển cửa 12 ô đổi theo lá số người chơi; ô cung Mệnh sáng nhất.)
NGƯỜI GIỮ ĐÀI: Muốn hiểu một cung, đứng trong gian đó — ba gian chiếu về nó sẽ sáng theo.
(Tam phương tứ chính: 4 ô cùng sáng — `ziwei-sanfang.js`.)
(Người chơi đi hết vòng 12 ô → vào Thiên Bàn → Đẩu Mẫu Điện.)
```

### 3.11 Công trường trùng tu (chính sách 08-13 §1.1)

```
[CẢNH <INT đang trùng tu> · trong điện · ban ngày]
THỢ CẢ: Khách cẩn thận dưới giàn giáo. Điện đang thay xà, đồ thờ phủ vải cả.
THỢ CẢ: Tháng sau khánh thành. Hôm ấy có lễ, khách nhớ ghé.
(Khi công trình đủ DoD: ngày bật cờ có sự kiện khánh thành nhỏ — tài liệu 10 `EV-*`.)
```

### 3.12 Du Phương Lâu — đổi phòng trọ = đổi phòng máy chủ (INT-HT-DUPHUONG)

```
[CẢNH INT-HT-DUPHUONG · quầy chưởng quỹ · giờ Dậu]
CHƯỞNG QUỸ: Khách trọ phòng nào? Lâu ta có năm mươi phòng, mỗi phòng tối đa sáu mươi người.
CHƯỞNG QUỸ: Phòng đông thì vui, phòng vắng thì yên — tùy khách.
(Giao diện chọn phòng: số người mỗi phòng — `net.room`, `ROOM_CAP`, `MAX_ROOMS`.)
> Chọn phòng 7 → màn mờ ngắn → người chơi đứng ở **cùng quầy**, phòng máy chủ mới.
CHƯỞNG QUỸ: (như chưa có gì) Phòng bảy trên lầu. Bạn đồng hành thì tìm ở bảng ghép đội.
```

Đây là lần duy nhất có màn mờ trong công trình (đổi shard cần nối lại mạng) — lý do trong thế giới: «lên phòng».

---

## 4. Âm thanh cảnh theo giờ — bảng tra nhanh cho người dựng cảnh

| Giờ | Sơn Môn | Huyền Thành | Điện chính vùng | Nhà dân |
|---|---|---|---|---|
| Tý – Sửu | gió, côn trùng, chuông gió tháp | trống canh mỗi giờ | đèn trực, im | im, mèo |
| Dần | chổi quét sân | gà gáy | | gà gáy |
| Mão | **chuông sớm 108**, tụng sáng | khói bếp, mở cổng thành | tụng sáng | nồi niêu |
| Thìn – Thân | khách, Thầy giảng khẽ | chợ (`cho_xa`), rao hàng | khách hành hương | làm nghề (đục, khung dệt) |
| Dậu | **trống chiều**, tụng chiều | đóng cửa lùa, trống thu không giờ Tuất | tụng chiều | bếp chiều |
| Tuất – Hợi | tiếng đọc sách tầng 2 | trà lâu, người chuyện | đóng điện | chuyện trò, trẻ con ngủ |
