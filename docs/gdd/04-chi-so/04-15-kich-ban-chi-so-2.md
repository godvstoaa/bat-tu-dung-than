# 04-15 · Kịch bản các khoảnh khắc chỉ số (2/2): vị thuốc, tâm ma, ải Mạn, Khổ tận cam lai, móc Tính Khí

Quy ước như 04-14 §0. Biến thêm: `{vi_thuoc}` tên vị (04-05 §2.6), `{vung_thuoc}`, `{benh}` tên bệnh game (04-05 §2.7), `{so_lan}` số lần hái, `{doc}` Tham / Sân / Si, `{tang}` tầng ải hiện tại.

## 1. Lộ Đắc Cứu — phương thuốc của Đan Đỉnh chân nhân

### 1.1 Cảnh đọc phương

```
[CẢNH STAT-CANH-DC-01 · Võ Đang, lò đan Thái Hòa · giờ Ngọ · khói lò]
(Đan Đỉnh chân nhân đang quạt lò, không quay lại.)
ĐAN ĐỈNH: Tờ giấy của lão Tử Bình phải không. Đặt lên bàn. Đừng đứng sau lưng người đang canh lửa.
(Người chơi đặt «Tờ phương mệnh». Đan Đỉnh đọc, lẩm nhẩm.)
ĐAN ĐỈNH: Có bệnh mới quý. Lão nói câu này với ai cũng bị lườm. Con thì sao?
> Lựa chọn: ① «Con không lườm.» → [DC-01a]  ② «Bệnh mà quý là sao?» → [DC-01b]

[DC-01a]
ĐAN ĐỈNH: (cười khàn) Tốt. Người lườm thường không chịu đi hái thuốc. → [DC-01c]

[DC-01b]
ĐAN ĐỈNH: Cây không bị sâu thì không bao giờ mọc nhựa. Nhựa là thứ người ta quý. Bệnh của cách con làm nó phải sinh ra thuốc — mà thuốc ấy, người không bệnh không có. → [DC-01c]

[DC-01c]
ĐAN ĐỈNH: Phương của con: {so_vi} vị, hái {so_lan} lần.
{lặp theo từng rescue}
ĐAN ĐỈNH: Bệnh «{benh}» — vị «{vi_thuoc}», mọc ở {vung_thuoc}.
{hết lặp}
ĐAN ĐỈNH: Đừng hái hết một lúc. Thuốc hái vội thì dược tính lạt. Hái một vị, mang về đây, lão sắc. Rồi đi vị sau.
(Nhiệm vụ «Phương thuốc của {ten}»; mỗi vị là một nhánh `BR-DC-*` do 03 cấp mã.)
```

### 1.2 Năm cảnh hái thuốc

Mỗi cảnh: người canh vị thuốc (NPC phụ ở vùng) + một việc thuộc nhóm thập thần đó (04-05 §2.6) + câu kết gắn với «bệnh». Màu quả/cây theo hành thật của nhóm với nhật chủ người chơi.

#### `STAT-VITHUOC-ti` — Đồng Tâm Thảo (Yên Tử)

```
[CẢNH STAT-CANH-DC-TI · Yên Tử, rừng trúc dưới chùa Hoa Yên · giờ Dần · sương dày]
SƯ CHÚ GIỮ RỪNG: Đồng Tâm Thảo mọc ở chỗ hai gốc trúc chạm rễ nhau. Một người tìm không ra. Phải hai người, đứng hai bên, cùng gạt lá.
> Lựa chọn: ① «Con đi một mình.» → [DC-TI-a]  ② «Sư chú đi cùng con được không?» → [DC-TI-b]

[DC-TI-a]
SƯ CHÚ GIỮ RỪNG: Thì đi tìm người. Trên núi có khách hành hương, có bạn tu của con. Đồng Tâm Thảo không mọc cho người một mình. → (nhiệm vụ: đồng tu 3 buổi với người chơi khác hoặc NPC đồng hành) → [DC-TI-c]

[DC-TI-b]
SƯ CHÚ GIỮ RỪNG: Được. Nhưng sư chú đi chậm. → [DC-TI-c]

[DC-TI-c]
(Cảnh hái: hai người gạt lá cùng lúc; nhịp bấm của hai người lệch nhau ≤ 1 giây là được — dung sai rộng, làm lại vô hạn.)
SƯ CHÚ GIỮ RỪNG: Đó. Bệnh của con là thiếu người đứng cùng. Thuốc của con là có người đứng cùng.
```

#### `STAT-VITHUOC-yin` — Văn Xương Chi (Thư Lâu Lâm / Văn Miếu)

```
[CẢNH STAT-CANH-DC-YIN · Thư Lâu Lâm, mái gác tàng thư · giờ Hợi · mưa]
NGƯỜI GIỮ SÁCH: Văn Xương Chi mọc trên mái gác, chỗ mưa thấm qua sách cũ. Nấm này ăn chữ.
NGƯỜI GIỮ SÁCH: Muốn hái thì phải đọc ba quyển mà nấm đang ăn — đọc xong, chữ vào con, nấm nhả ra.
> Lựa chọn: ① «Nấm ăn chữ thật ạ?» → [DC-YIN-a]  ② «Ba quyển nào?» → [DC-YIN-b]

[DC-YIN-a]
NGƯỜI GIỮ SÁCH: Thật hay không thì con đọc xong rồi trèo lên mái mà xem. → [DC-YIN-b]

[DC-YIN-b]
(Ba quyển từ `library-data`, mỗi quyển một buổi; chép một đoạn bằng tay ở cuối.)
NGƯỜI GIỮ SÁCH: Bệnh của con là thứ đáng giữ thì bị phá. Thuốc là một thứ che chở — sách che chở người đọc nó.
```

#### `STAT-VITHUOC-shi` — Tú Linh Quả (Võ Đang)

```
[CẢNH STAT-CANH-DC-SHI · Võ Đang, vườn sau lò đan · giờ Tỵ · nắng]
ĐAN ĐỈNH: Vị này lão trồng sẵn. Nhưng quả chỉ chín khi người hái làm ra một thứ bằng tay mình.
ĐAN ĐỈNH: Nhóm một lò đan. Viết một câu đối. Quả nghe thấy.
> Lựa chọn: ① «Con không biết viết câu đối.» → [DC-SHI-a]  ② (nhóm lò) → [DC-SHI-b]

[DC-SHI-a]
ĐAN ĐỈNH: Thì viết dở. Quả không chấm điểm văn. Quả chỉ cần biết con dám làm ra. → [DC-SHI-b]

[DC-SHI-b]
(Một lò đan + một câu đối do người chơi chọn ghép từ 3 vế có sẵn hoặc tự gõ.)
ĐAN ĐỈNH: (hái quả, màu {mau_hanh_thuc}) Bệnh của con là thứ con giỏi bị chặn lại. Thuốc là cho nó chảy ra ngoài.
```

#### `STAT-VITHUOC-cai` — Kim Tiền Thảo (Huyền Thành / Lịch Đường)

```
[CẢNH STAT-CANH-DC-CAI · chợ Huyền Thành, bờ mương sau chợ · giờ Thân · gió]
BÀ HÀNG RAU: Kim Tiền Thảo mọc đầy bờ mương, ai cũng giẫm. Hái thì dễ. Dùng được mới khó.
BÀ HÀNG RAU: Nó chỉ thành thuốc nếu người hái đem đổi lấy thứ khác — rồi cho đi một nửa.
> Lựa chọn: ① «Đổi lấy gì?» → [DC-CAI-a]  ② «Cho ai?» → [DC-CAI-b]

[DC-CAI-a]
BÀ HÀNG RAU: Lấy gì cũng được. Đi một chuyến buôn nhỏ, mua chỗ này bán chỗ kia. → [DC-CAI-b]

[DC-CAI-b]
BÀ HÀNG RAU: Cho người cần. Không phải người con thích.
(Một tuyến buôn ngắn; bố thí một nửa lãi — ghi Sổ Công Quá theo 05.)
BÀ HÀNG RAU: Bệnh của con là thứ quý bị kẹp giữa. Của cải đi qua tay con thì gỡ được nó — miễn là nó đi qua, đừng đọng lại.
```

#### `STAT-VITHUOC-guan` — Thiết Bì Lan (Chung Nam / Long Hổ)

```
[CẢNH STAT-CANH-DC-GUAN · Chung Nam, vách đá sau Trùng Dương Cung · giờ Mão · lạnh]
KHÂU ĐẠO TRƯỞNG: Thiết Bì Lan mọc trên vách. Muốn lên vách thì phải giữ giới bảy ngày — không phải giới của đạo sĩ, giới của con tự chọn.
> Lựa chọn (chọn một giới): ① không nói dối  ② không bỏ dở việc đã nhận  ③ không ăn sau giờ Dậu
KHÂU ĐẠO TRƯỞNG: Bảy ngày. Phạm một lần thì đếm lại từ ngày phạm, không phải từ đầu.
(Bảy ngày thật; game ghi nhận theo hành vi trong game — vd «không bỏ dở» = không hủy nhiệm vụ đã nhận. Ngày thứ tám mở leo vách.)
KHÂU ĐẠO TRƯỞNG: (đưa dây) Bệnh của con là thiếu cái khung. Lan này mọc được trên đá vì có khung. Con có khung rồi.
```

### 1.3 Cảnh thuốc thành

```
[CẢNH STAT-CANH-DC-99 · Võ Đang, lò đan · giờ Dậu · hoàng hôn]
ĐAN ĐỈNH: (mở nắp lò) Đủ vị. Thuốc thành.
ĐAN ĐỈNH: Đem về cho lão Tử Bình xem. Lão sẽ nói bốn chữ — lão nói câu ấy với ai thuốc thành cũng vậy.
[về Chính Đường]
THẦY TỬ BÌNH: (đọc lại tờ phương) Bại mà có thành.
(Danh hiệu «Đắc Cứu». Trên Mệnh Bàn, thẻ Mệnh Cách: «Đắc Cứu · thuốc thành». Không đổi `quality` của engine — chỉ đổi trạng thái lộ.)
```

## 2. Ải tâm ma — Tham, Sân, Si

### 2.1 Cấu trúc chung

| Mục | Quy định |
|---|---|
| Nơi vào | bất kỳ chỗ tĩnh tọa (tháp, am, đỉnh núi); ải mở khi người chơi chọn «Đối diện {doc}» |
| Số tầng | `1 + floor(giá trị / 25)` (04-07 §3.2); Dương Nhận +1 tầng ải Sân |
| Một tầng | một **cảnh tâm tưởng** (không gian mờ, màu theo độc) gồm 3 lượt lựa chọn; chọn «buông» ở lượt cuối = qua tầng |
| Thất bại | không có. Chọn «nắm giữ» thì cảnh lặp lại với biến tấu; người chơi thoát ra lúc nào cũng được, tầng đã qua giữ nguyên |
| Thưởng mỗi tầng | 20 công tu (× NT, R3 nếu là ải Kỵ) và −5 vào thanh độc đó |
| Định Lực (Thổ) | T4: «nhịp thở dự phòng» = được tua lại một lượt lựa chọn |

### 2.2 Ải Tham — «Cái bát»

Hình tượng: cái bát luôn còn chỗ trống.

| Tầng | Cảnh | Lượt 1 | Lượt 2 | Lượt 3 (buông) |
|---|---|---|---|---|
| 1 | Bàn tiệc đầy món, bát của mình chưa đầy | lấy thêm | lấy thêm nữa | đặt đũa, mời người bên cạnh |
| 2 | Kho thóc của mình, người làng xin một bao | đưa nửa bao | đưa một bao | mở cửa kho |
| 3 | Viên ngọc quý, người lạ khen | giấu đi | khoe | tặng |
| 4 | Thiên Bảng: tên mình ở hạng 2 | xem người hạng 1 | so điểm | tắt bảng, đi tu |
| 5 | Chính mình ở cảnh giới 6, vẫn thấy thiếu | tìm thêm | đếm lại | ngồi xuống, thấy đủ |

Thoại mẫu tầng 1:

```
[CẢNH STAT-CANH-TM-THAM-1 · cảnh tâm tưởng · vàng đục]
TIẾNG TRONG ĐẦU: Bát còn vơi. Món ngon thế, lấy thêm đi.
> ① «Lấy thêm.» → (bát đầy rồi vơi, lặp)  ② «Đủ rồi.» → [THAM-1b]
[THAM-1b]
TIẾNG TRONG ĐẦU: Người bên cạnh chưa có gì.
> ① «Kệ họ.» → (lặp)  ② (đặt đũa, đẩy đĩa sang) → [qua tầng]
(Bát của mình tự đầy. Không ai nói gì.)
```

### 2.3 Ải Sân — «Ngọn lửa»

Hình tượng: lửa trong lòng bàn tay, càng nắm càng bỏng.

| Tầng | Cảnh | Buông khi |
|---|---|---|
| 1 | Người lạ va vào mình, không xin lỗi | để họ đi |
| 2 | Bạn đồng tu nói xấu mình sau lưng | hỏi thẳng, nghe họ nói |
| 3 | Thầy chê bài mình trước đông người | cúi chào, sửa bài |
| 4 | Khổng tiên sinh phán «ngươi không bao giờ tu thành» | cười, đi tiếp |
| 5 | Chính mình của kiếp trước (Túc Nghiệp) giận mình | ôm lấy |
| 6 (chỉ Dương Nhận) | Lưỡi đao của chính mình | tra đao vào vỏ — mở Đặc Tính phái sinh «Kiên Nhẫn» |

Thoại mẫu tầng 4 (nối 04-13 §5):

```
[CẢNH STAT-CANH-TM-SAN-4 · cảnh tâm tưởng · đỏ sẫm]
KHỔNG TIÊN SINH (ảo ảnh): Lá số ngươi ta đọc rồi. Ngươi không bao giờ tu thành.
> ① «Ông biết gì về tôi!» → (lửa bùng, lặp)  ② «Ông nói phần nào đúng?» → [SAN-4b]
[SAN-4b]
KHỔNG TIÊN SINH (ảo ảnh): (ngập ngừng) …Phần lá số.
> ① «Phần còn lại là của tôi.» → [qua tầng]  ② «Vậy ông đúng.» → (lặp, giọng nhỏ dần)
(Ảo ảnh tan thành khói. Lửa trong tay nguội thành than ấm.)
```

### 2.4 Ải Si — «Màn sương»

Hình tượng: sương dày, đường chỉ hiện khi đứng yên.

| Tầng | Cảnh | Buông khi |
|---|---|---|
| 1 | Lạc trong sương, ai cũng chỉ một hướng | đứng yên, nghe tiếng suối |
| 2 | Một cuốn sách mở mãi không hết trang | gấp sách, hỏi người đọc |
| 3 | Lời thầy bói chợ «năm nay con gặp hạn» | đối chiếu với lá số thật (mở «Vì sao?» Thời Vận) |
| 4 | Gương soi ra người khác | nhận ra đó là mình lúc nhỏ |
| 5 | Câu hỏi «ta là ai» | trả lời bằng một việc đã làm hôm nay |

### 2.5 Ải Mạn (Côn Lôn) — chỉ Thiên Đạo hoặc PC9–PC10

| Mục | Quy định |
|---|---|
| Nơi | Côn Lôn Thiên Trì, cầu đá trên mây |
| Điều kiện vào | Đạo Hạnh ≥ 4.500 + Quy nhất (như mọi người); ải Mạn là bước cuối **thay** cho ải thường của người khác |
| Cấu trúc | 5 «nhường»: nhường đường, nhường chỗ ngồi, nhường lời cuối, nhường vinh danh, nhường thầy |
| Thưởng | không công tu; danh hiệu «Thiên Tứ» (PC9–10) hoặc «Hạ Mình» (Thiên Đạo); vào bậc 6 |

```
[CẢNH STAT-CANH-MAN-04 · Côn Lôn, cầu mây · tuyết]
(Một người chơi khác — hoặc NPC nếu không có ai — cùng tới cầu. Trên cầu chỉ một người được rung chuông.)
GIỌNG CHUÔNG: Một người. Ai rung?
> ① (bước lên)  → (cầu dài ra, lặp)  ② «Bạn rung đi.» → [MAN-04b]
[MAN-04b]
(Người kia rung chuông. Tiếng chuông vang cho cả hai. Tên người chơi khắc lên bia mây — bên dưới tên người kia.)
GIỌNG CHUÔNG: Người rung trước nghe một lần. Người nhường nghe hai lần.
```

## 3. Chuỗi «Khổ tận cam lai» (Phàm Căn) — 5 chặng

### 3.1 Chặng 1 · Hạt

```
[CẢNH STAT-CANH-KT-1 · sau Sơn Môn, khoảnh đất bỏ hoang · giờ Mão · đất ẩm]
LÃO TÙNG: (đưa một túi vải) Hạt đào. Lão giữ hai mươi năm, chưa gặp ai đáng gieo.
> ① «Sao lại là con?» → [KT-1a]  ② (nhận túi) → [KT-1b]
[KT-1a]
LÃO TÙNG: Vì hạt nhỏ thì phải chăm nhiều. Lão già rồi, chăm không nổi. → [KT-1b]
[KT-1b]
(Gieo hạt. Cây đào riêng xuất hiện, lớn theo Đạo Hạnh của người chơi — 5 giai đoạn hình ảnh.)
LÃO TÙNG: Đừng ngày nào cũng ra nhìn. Cây bị nhìn nhiều thì ngượng.
```

### 3.2 Chặng 2 · Mầm (cảnh giới 2)

```
[CẢNH STAT-CANH-KT-2 · Am Vân Cốc · giờ Dậu · gió núi]
VÂN CỐC: Con biết chuyện Liễu Phàm chưa? Có một ông họ Khổng đoán trước cả đời ông ấy: đỗ tú tài hạng mười bốn, làm một chức quan, không có con, mất năm năm mươi ba.
VÂN CỐC: Tới năm ba mươi lăm, lời nào cũng đúng. Ông ấy tin mệnh đã an bài, ngồi trong am này ba ngày ba đêm không khởi một niệm.
> ① «Sao ông ấy làm được?» → [KT-2a]  ② «Rồi sao nữa?» → [KT-2b]
[KT-2a]
VÂN CỐC: Vì ông ấy tin hết lời đoán. Người tin hết thì không còn gì để lo. Người trong am cười ông ấy: «Ta tưởng ông là hào kiệt, hóa ra cũng là phàm phu.» → [KT-2b]
[KT-2b]
VÂN CỐC: Từ hôm ấy ông ấy ghi sổ. Việc thiện một dòng, việc ác một dòng. Ba nghìn công thì có con. Sáu nghìn công thì đỗ tiến sĩ. Ông ấy sống tới bảy mươi tư.
VÂN CỐC: (đưa một cuốn sổ trắng) Sổ của con.
(Sổ Công Quá mở — 05. Bổ Hành +1 vào Dụng.)
```

### 3.3 Chặng 3 · Cây (cảnh giới 3)

```
[CẢNH STAT-CANH-KT-3 · sau Sơn Môn · giờ Thìn · hoa đào nở]
LÃO TÙNG: Hoa nở rồi. Hoa đầu tiên của cây đầu tiên thì phải cho đi.
> Chọn ba NPC để tặng (danh sách NPC người chơi đã gặp; mỗi NPC đáp một câu riêng — 06 viết).
LÃO TÙNG: (khi đã tặng xong) Con có để cành nào cho mình không? — Không à. Tốt. Mai nó nở nữa.
(60 công tu × NT.)
```

### 3.4 Chặng 4 · Hoa (cảnh giới 4) — dùng cảnh `STAT-CANH-CG4-01` (04-14 §5) với đoạn phụ cây đào.

### 3.5 Chặng 5 · Quả (cảnh giới 5)

```
[CẢNH STAT-CANH-KT-5 · Am Vân Cốc · giờ Tý · trăng tròn]
(Người chơi mang quả đào đầu tiên.)
VÂN CỐC: (cầm quả, không ăn) Ba năm trước con là hạt. Giờ con có quả. Người ta sẽ hỏi con «làm sao?».
> ① «Con sẽ nói: chăm.» → [KT-5a]  ② «Con không biết làm sao.» → [KT-5b]
[KT-5a]
VÂN CỐC: Ừ. Đừng nói «tại lá số». → [KT-5c]
[KT-5b]
VÂN CỐC: Thật thà. Người biết «làm sao» thì đã thôi chăm rồi. → [KT-5c]
[KT-5c]
VÂN CỐC: (đặt quả lên bàn thờ) Cái này của người sau. Con mặc cái áo này đi.
(Trang phục «Áo vải bạc màu» — không cộng chỉ số. Danh hiệu «Khổ Tận Cam Lai» đã nhận ở chặng 4.)
```

## 4. Móc Tính Khí — 10 nhiệm vụ cá nhân từ điểm yếu

Mỗi móc tùy chọn, mở sau Hồi I, nhắc tối đa một lần / tuần (04-07 §4.2). Thưởng chung: 30 công tu × NT + danh hiệu nhỏ. Điều kiện hoàn thành là **hành vi trong game** đo được.

| Can | Móc | Người giao | Điều kiện hoàn thành (đo được) | Danh hiệu |
|---|---|---|---|---|
| 甲 | «Cành mềm» | Khâu đạo trưởng | đổi kế hoạch giữa chừng: hủy 1 nhiệm vụ đang làm để giúp 1 NPC gặp nạn ngẫu nhiên, rồi làm lại nhiệm vụ cũ | «Biết Uốn» |
| 乙 | «Tự đứng» | Ni sư Diệu Âm | hoàn thành 1 chuỗi 3 bước mà không dùng gợi ý, không hỏi Thầy AI | «Tự Đứng» |
| 丙 | «Lửa nhỏ» | Trương Thiên Sư | giữ bí mật 1 thông tin NPC nhờ (không chọn lựa chọn «kể cho người khác» trong 3 cảnh) | «Lửa Kín» |
| 丁 | «Nói ra» | Thiền sư Trúc Lâm | chọn lựa chọn «nói thật nỗi lo» với 1 NPC thân thiết | «Thắp Đèn» |
| 戊 | «Núi dời» | Huyền Hư chân nhân | đổi chỗ tĩnh tọa quen (nơi đã ngồi ≥ 5 lần) sang nơi mới 3 lần | «Núi Đi» |
| 己 | «Từ chối được» | Vu y bà A Mậu | từ chối 1 lời nhờ vượt quá Nguyên Khí hiện có (game tạo tình huống) | «Biết Đủ Sức» |
| 庚 | «Vỏ kiếm» | Mao Sơn đạo nhân | thắng 1 cuộc tranh luận ở Văn Miếu mà NPC đối diện vẫn giữ thiện cảm | «Kiếm Trong Vỏ» |
| 辛 | «Ngọc thô» | Tế tửu Văn Miếu | nộp 1 sản phẩm (câu đối, tranh, đan) phẩm «thường», không làm lại | «Ngọc Thô» |
| 壬 | «Đập nước» | Phương sĩ Vô Danh | ở yên một vùng 7 ngày liên tiếp (không dùng trạm đi nhanh ra ngoài vùng) | «Hồ Lặng» |
| 癸 | «Lên tiếng» | Lạt-ma Đa Kiệt | trong một buổi nhóm (MMO hoặc NPC), chọn nói trước | «Mưa Có Tiếng» |

## 5. Ải song nhận (volatile) — thiết kế đầy đủ

### 5.1 Khôi Cương — chuỗi «Cương Nhu» (3 cảnh)

| Cảnh | Nơi | NPC | Tình huống | Cách qua |
|---|---|---|---|---|
| 1 | Huyền Thành | cụ bà bán chè | cụ không chịu dời quầy khỏi lối đi dù quan bảo | lựa chọn cứng rắn bị cụ phớt lờ; phải ngồi ăn chè, nghe chuyện, đề nghị khiêng quầy giúp |
| 2 | Long Hổ | tiểu đạo sĩ bị phạt | tiểu đạo sĩ khóc, không chịu nói lỗi gì | không hỏi dồn; ngồi cạnh, kể một lỗi của mình |
| 3 | Phong Đô (Hồi IV) | một vong hồn nổi giận | vong hồn quát tháo | người chơi được dùng **cả hai** giọng: cứng để chặn, mềm để dẫn — chỉ qua khi dùng đủ cả hai |

Thưởng: «Cương Nhu Tương Tế»; thoại cứng và mềm mở với mọi NPC.

### 5.2 Kim Thần — chuỗi «Lò Luyện»

Điều kiện mở: có `PERK-jinShen` và Nhiệt Tâm (Hỏa) tầng hiệu dụng < 3. Ba bước: (1) Huyền Hư chân nhân giảng «kim vào lửa thì thành»; (2) người chơi làm 3 việc bổ hành Hỏa (giữ đèn, luyện đan, lễ hội); (3) rèn một thanh kiếm gỗ đào ở lò Võ Đang (trang trí). Khi Hỏa tầng hiệu dụng ≥ 3 → «Kim Thần Nhập Hỏa» bật (+15% rèn, luyện đan).

### 5.3 Dương Nhận — tầng 6 ải Sân

Đã mô tả §2.3. Thoại tầng 6:

```
[CẢNH STAT-CANH-TM-SAN-6 · cảnh tâm tưởng · lưỡi đao phát sáng]
LƯỠI ĐAO: Ta là ý chí của ngươi. Không có ta, ngươi không đi được tới đây.
> ① «Ta cần ngươi.» → [SAN-6b]  ② «Ta không cần ngươi nữa.» → (lưỡi đao rơi, rồi bay về tay, lặp)
[SAN-6b]
LƯỠI ĐAO: Vậy cầm ta cho đúng.
> ① (vung đao) → (lặp)  ② (tra đao vào vỏ) → [qua]
(Đặc Tính phái sinh «Kiên Nhẫn»: Định Lực tầng hiệu dụng +1 vĩnh viễn.)
```

## 6. Checklist nghiệm thu phần 04-15

- [ ] Mỗi vị thuốc có một việc thuộc đúng nhóm thập thần và nuôi đúng cây Ngũ Duy.
- [ ] Ải tâm ma không có thất bại; tầng đã qua giữ nguyên khi thoát.
- [ ] Ải Mạn không cho công tu; chỉ áp cho Thiên Đạo hoặc PC9–PC10.
- [ ] Móc Tính Khí đo bằng hành vi trong game, không hỏi chuyện đời thật.
- [ ] Không cảnh nào nhắc sức khỏe, tiền bạc, hôn nhân đời thật.
