# 03 · Phần 07 — Vĩ thanh «Côn Lôn Thiên Trì» (`MQ-E-01…07`)

> Cảm xúc đích: **«mệnh do ta tạo»**. Tám chữ của người chơi không đổi một nét; người mang tám chữ đã khác.
> Lore theo tập 02 §1.4.2: Thiên Mệnh Bàn được các Trì Thủ đúc từ ánh trăng trên hồ Thiên Trì, rồi thỉnh xuống Huyền Thành. Kết của lore: «khi đủ người đứng ở lõi, Bàn được thỉnh trở lại Thiên Trì và lành — vết nứt để lại một đường sáng, như vết vàng trên chén men hàn». Vĩ thanh là nơi điều đó xảy ra, bằng **đạo hạnh của cả máy chủ**, không bằng sức một người.
> Bia Côn Lôn (tập 02 §1.4.4-f) chỉ đọc được ở đây: «Bàn này không ghi ai sẽ thành gì. Bàn này ghi trời đang ở đâu. Người đang ở đâu thì người tự biết.»

## 0. Cấu trúc

```
MQ-E-01 Quy nhất ─▶ E-02 Hạc về Côn Lôn ─▶ E-03 Dao Trì soi bóng ─▶ E-04 Lần đoán cuối
        ─▶ E-05 Hợp Luân (sự kiện máy chủ, theo mùa) ─▶ E-06 Thiên Bảng ─▶ E-07 Lập Xuân (lặp mỗi mùa)
```

| Tổng | Đạo Hạnh gốc | Phúc Khí |
|---|---|---|
| 7 nhiệm vụ | 380 (+ thưởng sự kiện mùa) | 320 |

**Điều kiện mở MQ-E-01** (bản sơ đồ §3 vĩ thanh + §7.11 + §9.1):

| Điều kiện | Cách tính | Ghi chú |
|---|---|---|
| Quy nhất: ≥ 3 lộ cải mệnh | số đạo thống đã nhập môn (`F_DAOTHONG`) + 1 nếu `F_TALO = hoi_dau` | §7.11: «kể cả lộ đã quay về từ âm tà» |
| Sổ Công Quá dương | `meritLedger(logged).net > 0` | — |
| Hồi IV xong | `F_ACT4_DONE` | — |
| Cảnh giới ≥ 5 | Đạo Hạnh ≥ 2.200 (bậc ≥ 4 chỉ tính Đạo Hạnh) | §9.1 ghi bậc 6 mở Côn Lôn; tập 03 đề xuất bậc 5 cho tuyến chính (xem README, Câu hỏi mở 4) |

---

## MQ-E-01 · Quy nhất

| Trường | Giá trị |
|---|---|
| Mã | MQ-E-01 |
| Tên | Quy nhất |
| Vùng | `thanh` — Đình Truyền Đạo |
| Điều kiện | bảng trên |
| Người giao | `van_coc` (lần đầu tiên rời am trong cốt truyện); sứ giả ba đạo thống người chơi đã tu |
| Mục tiêu | 1. Nhận thư mời của Vân Cốc. 2. Tới Đình Truyền Đạo lúc giờ Tý đêm Rằm. 3. Nghe ba sứ giả nói lời tiễn. 4. Đặt Sổ Công Quá lên bàn đá giữa Đình. 5. Nhận lông hạc. |
| Móc engine | `F_DAOTHONG`, `F_TALO`, `meritLedger`; tên cảnh giới theo đạo (canon §5: bậc 5 — Luyện Thần Hoàn Hư / Tuệ / Đại Nho) |
| Thưởng | Đạo Hạnh +50 · Phúc Khí +40 · danh hiệu «Quy Nhất» |
| Bỏ dở | Không tới đêm Rằm: thư mời lặp lại vào Rằm kế tiếp (lịch âm thật). |
| Cờ đặt | `F_QUY_NHAT` |

```
[CẢNH MQ-E-01.1 · Nhà riêng · sáng · thư mời]
(Một lá thư gấp hình con hạc đặt trên bàn ngồi, cạnh vật hành Dụng.)
THƯ VÂN CỐC: «Lão tăng xuống núi một lần. Đêm Rằm, giờ Tý, Đình Truyền Đạo. Mang sổ. — Vân Cốc.»
THANH PHONG: (đọc qua vai) Ông sư xuống núi?! Bốn mươi năm ông chưa xuống! Mình đi với bạn!
```

```
[CẢNH MQ-E-01.2 · Đình Truyền Đạo · đêm Rằm, giờ Tý · trăng tròn]
(Bảy cổng mở; cổng Tạng Địa vẫn khép, nhưng dải cờ gió đã được buộc gọn — dấu hiệu đường đang dọn. Ba sứ giả của ba đạo thống người chơi đã tu đứng ở ba cổng; các cổng khác tối. Vân Cốc ngồi trên bậc đá giữa Đình, áo nâu, gậy trúc.)
VÂN CỐC: Con tới rồi. Lão tăng xuống chậm, ngồi đây từ giờ Dậu.
VÂN CỐC: Ba con đường. Lão tăng không hỏi con thích đường nào nhất. Lão tăng hỏi: ba đường ấy dạy con cùng một điều gì?
> Lựa chọn:
>   ① «Đều dạy con tự làm.» → VÂN CỐC: «Phải.»
>   ② «Đều dạy con ngồi yên trước khi đi.» → VÂN CỐC: «Cũng phải.»
>   ③ «Con chưa biết.» → VÂN CỐC: «Phải nhất.»
(Ba sứ giả nói lời tiễn — mỗi đạo thống một câu, theo bảng dưới.)
```

| Đạo thống | Lời tiễn |
|---|---|
| Chính Nhất | «Người viết chữ cho trời đọc giờ lên chỗ trời ở. Viết cho rõ.» |
| Thanh Vi – Đan Đỉnh | «Lò đã đỏ. Lên trên cao gió lạnh, giữ lửa trong lò.» |
| Toàn Chân | «Đai lưng thắt chặt. Đường lên Côn Lôn dài hơn đường Chung Nam.» |
| Thượng Thanh | «Tối nay ngủ đủ chưa? Chưa thì ngủ đã, mai hạc vẫn còn.» |
| Trúc Lâm | «Lên núi cao nhất rồi thì xuống chợ.» |
| Tịnh Độ | «Mỗi tầng sen con đã quay, sư hồi hướng cho người con đã giúp.» |
| Nho | «Thánh hiền không ở trên Côn Lôn. Lên đó để biết điều đó.» |
| Hồi Đầu (nếu `F_TALO = hoi_dau`) — lời của Ni sư Diệu Âm hoặc Phán quan, tùy ai dẫn sám hối | «Con đi lối kia rồi quay về. Lối về là một con đường. Sư tính nó là một.» |

```
[CẢNH MQ-E-01.3 · Bàn đá giữa Đình]
(Người chơi đặt Sổ Công Quá lên bàn. Sổ tự mở trang cuối: câu «Năm ấy tôi sẽ giữ cái gì» từ MQ-2-22 và thẻ «Giữ» từ MQ-3-12.)
VÂN CỐC: Con viết câu này trước năm hạn trong mộng. Giờ con đọc lại. Con còn giữ không?
> Lựa chọn: ① «Còn.» ② «Con giữ được một nửa.» ③ «Con đổi rồi. Giờ con giữ thứ khác.» → (ô nhập ≤ 30 chữ, ghi thêm dòng mới, không xóa dòng cũ)
VÂN CỐC: (với ①) Được. (với ②) Một nửa là thật hơn cả. (với ③) Người đổi câu giữ là người còn đang sống.
VÂN CỐC: (đưa một chiếc lông hạc trắng) Trên Côn Lôn có hồ. Bàn từng nằm trên hồ ấy. Đủ người đứng ở lõi thì Bàn về. Con là một người. Đi đi. Lão tăng già, lão tăng đi sau.
```

---

## MQ-E-02 · Hạc về Côn Lôn

| Trường | Giá trị |
|---|---|
| Mã | MQ-E-02 |
| Tên | Hạc về Côn Lôn |
| Vùng | `thanh` (Thiên Bàn Đảo — bệ tạm) → `conlon` (đảo trời, cao 260 m) |
| Điều kiện | MQ-E-01 |
| Người giao | — |
| Mục tiêu | 1. Lên Thiên Bàn Đảo bằng ngự kiếm / đường mây. 2. Thổi lông hạc. 3. Bay theo đàn hạc lên Côn Lôn. 4. Qua ba cầu mây, mỗi cầu một câu hỏi của Trì Thủ (giọng không người). |
| Móc engine | Ngự kiếm (đã có, cấp gia trì `fly`); hành Dụng → màu vệt bay |
| Thưởng | Đạo Hạnh +40 · Phúc Khí +30 · mở trạm hạc Côn Lôn |
| Bỏ dở | Rơi khỏi cầu mây: hạc đỡ lại, đặt về đầu cầu (không hình phạt). |
| Cờ đặt | `F_CONLON_IN` |

```
[CẢNH MQ-E-02.1 · Thiên Bàn Đảo · bình minh · CUT-033]
(Bệ đá nổi, trống, có vết lõm tròn đúng kích cỡ Thiên Mệnh Bàn. Người chơi thổi lông hạc. Từ biển mây phía Bắc, một đàn hạc bay tới, lượn quanh bệ ba vòng — khớp lore «người ta thả hạc bay vòng quanh bệ vào những đêm trăng».)
(Đàn hạc dẫn đường; người chơi ngự kiếm (hoặc cưỡi hạc nếu chưa có gia trì bay). Vệt bay màu hành Dụng. Camera lùi xa: Huyền Thành, Sơn Môn, Thiên Mệnh Bàn đang quay với vết rạn vàng, mười hai thánh địa trải dưới mây.)
```

```
[CẢNH MQ-E-02.2 · Ba cầu mây]
(Mỗi đầu cầu có một bia ngọc trắng. Khi người chơi chạm bia, một giọng không phân biệt nam nữ, rất nhẹ — Trì Thủ — hỏi một câu. Không có đáp án sai; câu trả lời được khắc vào bia và ở lại cho người chơi sau đọc (lọc nội dung).)
TRÌ THỦ (cầu một): Ngươi xuống từ đâu?
> Lựa chọn: ① «Từ Huyền Thành.» ② «Từ bậc đá thứ một trăm lẻ tám.» ③ (ô nhập tự do ≤ 20 chữ)
TRÌ THỦ (cầu hai): Ngươi mang gì lên?
> ① «Một cuốn sổ.» ② «Tám chữ.» ③ (ô nhập)
TRÌ THỦ (cầu ba): Ngươi để lại gì ở dưới?
> ① «Người tôi đã giúp.» ② «Người đã giúp tôi.» ③ (ô nhập)
(Bia ở mỗi cầu hiển thị ngẫu nhiên 3 câu trả lời của người chơi khác trên cùng máy chủ — dạng «lời người đi trước», ẩn danh.)
```

---

## MQ-E-03 · Dao Trì soi bóng

| Trường | Giá trị |
|---|---|
| Mã | MQ-E-03 |
| Tên | Dao Trì soi bóng |
| Vùng | `conlon` — điện Dao Trì, mép hồ ngọc |
| Điều kiện | MQ-E-02 |
| Người giao | — ; Vân Cốc tới sau |
| Mục tiêu | 1. Đứng mép hồ. 2. Nhìn bóng mình: bốn trụ hiện lại như lễ lật trụ. 3. Thấy ánh sáng Đạo Hạnh. 4. Đọc Bia Côn Lôn. 5. Nghe Vân Cốc nói câu cuối. |
| Móc engine | `R.chart.pillars` (không đổi từ MQ-P-02); `synthesis.score` (không đổi); Đạo Hạnh hiện tại; `F_BRANCH`; `F_TALO` |
| Thưởng | Đạo Hạnh +60 · Phúc Khí +50 |
| Bỏ dở | — |
| Cờ đặt | `F_DAOTRI` |

```
[CẢNH MQ-E-03.1 · Mép Dao Trì · CUT-034]
(Hồ ngọc phẳng như gương. Không có Thiên Mệnh Bàn trên hồ — chỉ có chỗ trống ở giữa, mặt nước hơi lõm. Người chơi nhìn xuống: bóng mình. Rồi bốn tấm bài gỗ hiện trong nước, lật lần lượt — đúng bốn trụ của MQ-P-02, đúng thứ tự, đúng thanh âm chuông.)
(MAU-A: 庚午 · 辛巳 · 庚辰 · 庚辰. Dưới bốn trụ: «Tiềm Lực 41 — Tứ Linh Căn». Không đổi.)
(Rồi quanh bóng người chơi, ánh sáng dâng lên từ đáy hồ — độ cao tỉ lệ Đạo Hạnh / 4.500, màu hành Dụng.)
(Người chơi Tà Lộ đã Hồi Đầu: trong ánh sáng có một vệt đỏ sẫm mảnh — dấu Nợ Âm đã trả — không xóa, nhưng đã thành sợi chỉ, như đường khâu.)
```

```
[CẢNH MQ-E-03.2 · Bia Côn Lôn]
(Bia ngọc ở mép hồ, chữ khắc mờ, sáng dần khi người chơi đọc.)
BIA: «Bàn này không ghi ai sẽ thành gì. Bàn này ghi trời đang ở đâu. Người đang ở đâu thì người tự biết.»
```

```
[CẢNH MQ-E-03.3 · Vân Cốc tới]
(Vân Cốc bước lên mép hồ, hơi thở dốc — ông leo cầu mây chứ không cưỡi hạc.)
VÂN CỐC: Lão tăng đi chậm. (nhìn xuống hồ) Con thấy gì?
> Lựa chọn: ① «Tám chữ của con. Y nguyên.» ② «Con thấy con.» ③ (im)
VÂN CỐC: Mệnh con vẫn vậy: tám chữ ấy không đổi một nét. Nhưng người mang tám chữ ấy đã khác.
(Một câu thêm theo nhánh:)
VÂN CỐC: (TT) Con được nhận ngay ngày đầu. Con giữ được cách. Người giữ được cái tốt là người khó nhất.
VÂN CỐC: (DC) Bệnh vẫn là bệnh ấy. Thuốc con hái đủ rồi. Người ta không khỏi bệnh — người ta biết sống cùng bệnh và uống thuốc đúng giờ.
VÂN CỐC: (NT) Đêm ở nhà trọ Mái Rêu, lão tăng gõ cửa. Con mở. Từ hôm đó tới đây, con chưa đóng cửa lần nào.
VÂN CỐC: (DK) Cách lạ thì đường lạ. Con không cố đi đường của người khác. Dòng sông của con chảy tới hồ này.
VÂN CỐC: (F_TALO = hoi_dau) Con từng cầm tấm bài đen. Con đặt nó xuống. Lão tăng không biết ai giỏi hơn: người chưa bao giờ cầm, hay người đã cầm rồi đặt xuống. Lão tăng chỉ biết người thứ hai ít hơn.
(Nếu F_LOW_SCORE — Vân Cốc nói thêm, bắt buộc:)
VÂN CỐC: Ngày đầu thầy Tử Bình nói với con: lá số là hạt giống, không phải cái cây. Con nhìn ánh sáng kia đi. Đó là cái cây.
```

---

## MQ-E-04 · Lần đoán cuối

| Trường | Giá trị |
|---|---|
| Mã | MQ-E-04 |
| Tên | Lần đoán cuối |
| Vùng | `conlon` — đình đá bên Dao Trì |
| Điều kiện | MQ-E-03 |
| Người giao | `khong_tiensinh` |
| Mục tiêu | 1. Gặp Khổng tiên sinh trên Côn Lôn. 2. Nghe ông đoán lần cuối (khuôn MQ-P-06 chạy lại với năm hiện tại). 3. Đọc cột «Người nghe đã làm gì» trong sổ ông. 4. Xem ông gấp sổ. 5. Chứng kiến ông và Vân Cốc nói chuyện. |
| Móc engine | Khuôn lời phán `MQ-P-06` §6.1, chạy với `nowYear` hiện tại; `F_KHONG_REPLY`; `F_KHONG_COT_MOI` |
| Thưởng | Đạo Hạnh +60 · Phúc Khí +50 |
| Bỏ dở | — |
| Cờ đặt | `F_KHONG_GAP_SO` |

```
[CẢNH MQ-E-04.1 · Đình đá bên Dao Trì]
(Khổng tiên sinh ngồi trên chiếu cói — cùng chiếc chiếu ở bậc thứ 108 — sổ bìa gỗ trước mặt. Ông già hơn, áo xám vẫn vậy.)
KHỔNG TIÊN SINH: Ta lên bằng hạc. Ta già, không leo. (không ngẩng lên) Ngồi.
KHỔNG TIÊN SINH: (khuôn §6.1, năm hiện tại — MAU-A năm 2026)
KHỔNG TIÊN SINH: Canh Kim sinh tháng Tỵ, lửa hạ luyện mà kim còn cứng. Kim chiếm năm mươi lăm phần cục, dày mà khó uốn. Thất Sát cách vỡ một góc, có chỗ vá.
KHỔNG TIÊN SINH: Năm nay Bính Ngọ, Thất Sát lâm năm, lại đúng tuổi Ngọ: phạm Trị, phạm Hình. Từ giờ tới hết năm, việc công khó ngóc đầu.
KHỔNG TIÊN SINH: Vận Giáp Thân sắp hết. Ba mươi tám tuổi đổi vận Ất Dậu, bình hòa mười năm.
KHỔNG TIÊN SINH: (ngẩng lên) Ta nói sai câu nào chưa?
(Nếu người chơi tới vĩ thanh vào năm khác, khuôn tự sinh lời mới — vd năm 2027 Đinh Mùi với MAU-A: «Năm nay Đinh Mùi, Chính Quan lâm năm. Trong năm này việc công dễ thở.» và «Vận Ất Dậu vừa vào. Bình hòa mười năm.»)
> Lựa chọn:
>   ① «Không sai.» → [04.2]
>   ② «Không sai. Lần đầu ông nói những câu này, tôi đã trả lời ông.» → [04.2]
```

```
[CẢNH MQ-E-04.2 · Cột mới]
KHỔNG TIÊN SINH: Không sai. Ba câu y như ngày ở bậc đá. Ta đoán đúng hai lần một người. (giở sổ tới trang có cột «Người nghe đã làm gì»)
(Trang sổ: cột trái — các lời phán; cột phải — chữ Khổng tiên sinh ghi lại những gì người chơi đã làm, đúng theo cờ: «Giải án anh Đạt, anh Lý Thuận, ông Hai Cương. Đọc bảng đồng cho xóm cá. Không đào phía Bắc trong mộng. Kéo người ở Nại Hà. …»)
KHỔNG TIÊN SINH: Cột trái ta viết trước khi ngươi sống. Cột phải ta viết sau. Cột trái đúng. Cột phải cũng đúng. Hai cột không cãi nhau. Chỉ là ta bốn mươi năm chỉ đọc cột trái.
KHỔNG TIÊN SINH: (nhắc F_KHONG_REPLY) Ngày ở bậc đá ngươi {đáp "không sống theo lời ai" / hỏi "phải làm gì" / im}. Ta ghi chữ «{phản / nhận / im}». Hôm nay ta không gạch chữ đó.
(Ông gấp sổ. CUT-046: bìa gỗ khép lại, tay ông đặt lên bìa, ngón tay gõ ba lần rồi dừng.)
KHỔNG TIÊN SINH: Ta đoán đúng. Người ta đoán không còn là người ấy.
KHỔNG TIÊN SINH: Ta vẫn tin trời viết cái khung. Ta chỉ không còn tin cái khung là cả trang giấy.
```

```
[CẢNH MQ-E-04.3 · Hai ông già]
(Vân Cốc ngồi xuống chiếu, đối diện Khổng tiên sinh. Người chơi đứng giữa, hơi lùi ra.)
VÂN CỐC: Bốn mươi năm.
KHỔNG TIÊN SINH: Bốn mươi mốt.
VÂN CỐC: Ông đếm kỹ.
KHỔNG TIÊN SINH: Ta làm nghề đếm.
VÂN CỐC: Vậy ai thắng?
KHỔNG TIÊN SINH: (nhìn người chơi) Không ai. Người thắng là người không ngồi ở đây cãi.
VÂN CỐC: (cười) Lão tăng có ấm trà. Lên đây mà không có trà thì phí hồ.
(Hai ông già uống trà. Không thoại nữa. Gió trên hồ. Người chơi có thể ngồi cùng — thao tác «ngồi» — hoặc rời đi.)
```

---

## MQ-E-05 · Hợp Luân — sự kiện máy chủ

| Trường | Giá trị |
|---|---|
| Mã | MQ-E-05 |
| Tên | Hợp Luân |
| Vùng | `conlon` (lễ chính) + mọi vùng (đóng góp) |
| Điều kiện | MQ-E-04; sự kiện chạy theo **mùa** (một năm can chi, §9.2 bản sơ đồ) |
| Người giao | toàn máy chủ; Trì Thủ (giọng), Vân Cốc, Thầy Tử Bình |
| Mục tiêu cá nhân | Đóng góp ≥ 30 công trong **cửa sổ lễ** của mùa hiện tại → xem cảnh cắt cá nhân «Bàn về hồ» (CUT-035) và nhận phần thưởng mùa. |
| Mục tiêu máy chủ | Đủ ba ngưỡng ba vòng trong cửa sổ lễ → Thiên Mệnh Bàn được thỉnh về Thiên Trì làm «lễ hàn», rồi trở lại Sơn Môn vào giờ Lập Xuân với đường hàn vàng. |
| Móc engine | Biến máy chủ `S_CONG_MUA` **(chưa có — cần làm, TBD-13)**; nguồn công: `meritLedger` của từng người (chỉ việc do máy nhiệm vụ ghi); `NO_AM` đã trả; lịch tiết khí thật (`lunar-javascript`) để định Lập Xuân |
| Thưởng cá nhân | Đạo Hạnh +100 (một lần mỗi mùa) · Phúc Khí +80 · bộ phục mùa «Hợp Luân» (thẩm mỹ, không chỉ số — §11) · khắc tên trên vành đá Dao Trì (danh sách người góp của mùa) |
| Bỏ dở / thất bại | Không có thất bại cá nhân. Máy chủ không đạt ngưỡng: xem 5.4. |
| Cờ đặt | `F_HOP_LUAN_PERSONAL` (mùa), biến máy chủ `S_HOP_LUAN_<mùa>` |

### 5.1 Thông số

| Tham số | Giá trị đề xuất | Lý do |
|---|---|---|
| Cửa sổ lễ | **30 ngày trước giờ Lập Xuân** của năm can chi kế tiếp | lễ kết mùa; khớp «một năm can chi = một mùa» |
| `N` | số người chơi **hoạt động** = đăng nhập ≥ 3 ngày khác nhau trong 30 ngày trước khi mở cửa sổ; chốt lúc mở cửa sổ; sàn `N ≥ 200` | tránh máy chủ nhỏ đạt quá dễ, máy chủ lớn quá khó |
| Ngưỡng vòng Địa | 15 × N công | — |
| Ngưỡng vòng Thời | 30 × N công (cộng dồn) | vòng có vết rạn |
| Ngưỡng vòng Biến | 45 × N công (cộng dồn) | vòng từng bị đóng đinh |
| Trần đóng góp / người / ngày | **15 công** tính vào sự kiện (công vượt trần vẫn ghi Sổ, chỉ không tính sự kiện) | chống cày, chống bot |
| Nguồn hợp lệ | mọi `DEED-T*` do máy nhiệm vụ ghi (án khách, việc thiện, Nại Hà, sửa đường…) | AI không ghi công (§6.1 quy tắc 4) |
| Nợ Âm đã trả | mỗi **5 Nợ Âm** trả trong cửa sổ = **1 công** sự kiện (cùng trần 15/ngày) | «trả nợ cũng là hàn Bàn» — người Hồi Đầu góp được như mọi người |
| Việc ác | **không trừ** `S_CONG_MUA` | sự kiện chung không bị một người phá |
| Ngưỡng cá nhân | ≥ 30 công sự kiện trong cửa sổ, **hoặc** hoàn thành MQ-E-04 lần đầu trong cửa sổ | người mới tới vĩ thanh muộn vẫn được xem cảnh |

### 5.2 Trạng thái hiển thị (Thiên Mệnh Bàn ở Sơn Môn và hình chiếu trên Dao Trì)

| `S_CONG_MUA / ngưỡng` | Hiển thị |
|---|---|
| < 15N | Bàn như cũ; vết rạn vòng Thời sáng vàng chập chờn |
| ≥ 15N | Vòng Địa phát ánh bạc; 24 sơn khắc sáng |
| ≥ 30N | Vết rạn vòng Thời ngừng chập chờn, sáng đều |
| ≥ 45N | Vòng Biến tỏa sáng; lễ «Hợp Luân» được kích hoạt vào **đêm trước Lập Xuân** |

UI chung (tập 12 vẽ, TBD-12): thanh ba nấc trên bảng Thiên Bảng trước Chính Đường; số đếm làm tròn tới trăm; dòng chữ «Cả Huyền Giới đã viết {n} dòng thiện trong mùa này». Không có bảng xếp hạng người đóng góp nhiều nhất (tránh biến việc thiện thành cuộc đua).

### 5.3 Lễ «Hợp Luân» (khi đạt 45N)

| Thời điểm | Diễn biến | Ai thấy |
|---|---|---|
| Đêm trước Lập Xuân, giờ Tuất | Đàn hạc bay từ Côn Lôn xuống Sơn Môn, nâng Thiên Mệnh Bàn khỏi giá đỡ (giá đỡ đã được Ông Kha gia cố) | toàn máy chủ (trực tiếp trong game) |
| Giờ Hợi | Bàn bay qua mười hai thánh địa, mỗi nơi chuông / trống / khánh vang theo nghi riêng | toàn máy chủ |
| Giờ Tý | Bàn đặt xuống Thiên Trì; mặt hồ phản chiếu ba vòng; Trì Thủ đọc đủ mười sáu chữ Bàn Minh | người ở `conlon` + phát lại cho ai đủ ngưỡng cá nhân (CUT-035) |
| Giờ Sửu – Dần | «Lễ hàn»: vết rạn vòng Thời được lấp bằng ánh vàng — để lại **đường hàn vàng** vĩnh viễn | — |
| Giờ Lập Xuân (phút chính xác theo lịch tiết khí) | Bàn trở về Sơn Môn, treo lại trên giá đỡ, ba vòng quay; Thái Tuế trị niên mới đổi chỗ trên bệ ở Thái Tuế Điện cùng lúc | toàn máy chủ |

Ghi chú lore: tập 02 §1.4.2 viết «Bàn được thỉnh trở lại Thiên Trì và lành». Tập 03 đề xuất Bàn **về hồ để hàn rồi trở lại Sơn Môn** mỗi mùa, để giữ trung tâm Huyền Thành và để mỗi mùa có một lễ. Cần tập 02 xác nhận (Câu hỏi mở ở `03-11`).

### 5.4 Không đạt ngưỡng

| Trường hợp | Kết quả |
|---|---|
| Đạt 30N nhưng chưa 45N | Bàn không về hồ; vết rạn được hàn **một nửa** (đường vàng mảnh). Mùa sau bắt đầu từ 50% của `S_CONG_MUA` mùa này (giữ phần đã làm) |
| Dưới 30N | Bàn không đổi; mùa sau bắt đầu từ 50% |
| Cá nhân đạt ngưỡng nhưng máy chủ không | Người chơi vẫn xem một cảnh cắt rút gọn: Bàn ở Sơn Môn, đàn hạc bay vòng quanh, Vân Cốc nói: «Năm nay chưa đủ. Năm sau. Người ta còn đang đi.» Vẫn nhận thưởng cá nhân |

```
[CẢNH MQ-E-05.1 · Trước lễ · Sân Thiên Bàn · Thầy Tử Bình]
THẦY TỬ BÌNH: Bàn không lành vì một người. Bàn lành vì nhiều người, mỗi người một dòng. Thầy không giao con việc gì đặc biệt cho mùa này. Con làm việc của con mỗi ngày. Bàn Thầy mở. Trà Thất mở. Người cần thì giúp.
THẦY TỬ BÌNH: (chỉ thanh ba nấc trên Thiên Bảng) Con nhìn kia làm gì? Nhìn người trước mặt.
```

```
[CẢNH MQ-E-05.2 · Đêm Hợp Luân · Dao Trì · CUT-035 (khi đạt 45N)]
(Bàn hạ xuống hồ. Mặt hồ in ba vòng. Một giọng — Trì Thủ — đọc mười sáu chữ, chậm, từng chữ một, bắt đầu từ chữ 天. Khi tới chữ cuối 代, vòng đọc khép lại.)
TRÌ THỦ: Thiên định kỳ khuông. Nhân thư kỳ tự. Khuông bất khả di. Tự bất khả đại.
(Vết rạn vòng Thời — từ chữ 午 sang chữ 子 — sáng lên rồi đông lại thành một đường vàng, như men hàn trên chén sứ.)
VÂN CỐC: (đứng mép hồ với người chơi) Chỗ nứt là chỗ ánh sáng vào. Giờ nó không nứt nữa. Nhưng nó vẫn là chỗ ánh sáng vào.
(Biến thể F_LOBAN:)
  · `o_lai`: dưới đáy hồ, rất mờ, một bóng người ngồi cạnh một ngọn đèn — Công Thâu Nghiệt ở Điện Địa Tạng, ngẩng lên khi vòng Biến sáng.
  · `quay_ve`: trên Côn Lôn, ở rìa đám đông, một ông già áo nâu thợ đứng cùng Ông Kha. Không nói gì.
  · `bo_di`: không có bóng nào. Vân Cốc thêm: «Ông thợ đâu đó cũng đang nhìn lên. Lão tăng tin vậy.»
```

---

## MQ-E-06 · Thiên Bảng

| Trường | Giá trị |
|---|---|
| Mã | MQ-E-06 |
| Tên | Thiên Bảng |
| Vùng | `conlon` → `thanh` — bảng Thiên Bảng trước Chính Đường |
| Điều kiện | MQ-E-05 (cá nhân đạt ngưỡng của mùa hiện tại, **hoặc** đã xem cảnh rút gọn) |
| Người giao | `thay_tubinh` |
| Mục tiêu | 1. Trở về Sơn Môn. 2. Dự lễ khắc tên lên Thiên Bảng. 3. Nghe Thầy Tử Bình. |
| Móc engine | Đạo Hạnh (cột chính); `synthesis.score` (cột Tiên Thiên — **chỉ hiện nếu người chơi bật "công khai căn cốt"**, §14); danh hiệu đặc biệt: Hồi Đầu, Quy Nhất, Người Đọc Đủ Câu… |
| Thưởng | Đạo Hạnh +40 · Phúc Khí +50 · tên trên Thiên Bảng |
| Bỏ dở | — |
| Cờ đặt | `F_THIEN_BANG` |

**Thiên Bảng** (spec hiển thị):

| Cột | Nội dung | Xếp |
|---|---|---|
| Đạo Hạnh | đạo hiệu · cảnh giới (tên theo đạo người chơi chọn) · Đạo Hạnh | **bảng chính xếp theo cột này** (§4.7) |
| Tiên Thiên | Phẩm căn · Tiềm Lực | chỉ hiện cho người bật «công khai căn cốt»; không xếp hạng theo cột này trên bảng chính |
| Dấu | biểu tượng danh hiệu (Hồi Đầu, Quy Nhất, …) | — |

Quy tắc: không hiện ngày sinh; không hiện Nợ Âm cũ của người đã Hồi Đầu (chỉ dấu «Hồi Đầu»).

```
[CẢNH MQ-E-06.1 · Trước Chính Đường · giờ Thìn · CUT-036]
(Bảng đá lớn. Thợ đá khắc tên. Đệ tử đứng hai hàng như lễ nhập sổ ở MQ-1-14. Thanh Phong mài mực.)
THẦY TỬ BÌNH: Ngày con tới, thầy nói bảng này không xếp theo con số trời cho. (chỉ cột Đạo Hạnh) Thầy giữ lời.
THẦY TỬ BÌNH: (đọc) {daohieu}. Tới ngày {ngày MQ-P-01}. Việc đầu tiên: {việc thiện đầu tiên}. Việc gần nhất: {việc thiện gần nhất}. Cảnh giới: {tên cảnh giới}.
THẦY TỬ BÌNH: Tên con khắc ở đây. Mùa sau có người mới tới, đứng trước bảng này đọc tên con. Họ sẽ không biết lá số con. Họ chỉ biết con đã làm gì.
(Nếu F_TALO = hoi_dau:) THẦY TỬ BÌNH: Bên cạnh tên con có dấu «Hồi Đầu». Có người sẽ hỏi dấu đó là gì. Thầy sẽ trả lời: là dấu của người đã quay về. Ở Quán này dấu đó hiếm.
(Nếu F_KHIEM = cuu:) (Lê Khiêm đứng trong hàng thư sinh Văn Miếu tới dự; gật đầu với người chơi.)
```

---

## MQ-E-07 · Lập Xuân

| Trường | Giá trị |
|---|---|
| Mã | MQ-E-07 |
| Tên | Lập Xuân (lặp mỗi mùa; tên hiển thị kèm năm: «Lập Xuân · Giáp 34 · Đinh Mùi») |
| Vùng | `thanh` — cổng Nam, Thái Tuế Điện, Trà Thất |
| Điều kiện | MQ-E-06 lần đầu; các mùa sau tự mở vào ngày Lập Xuân |
| Người giao | `gac_cong` Lão Tùng |
| Mục tiêu | 1. Giờ Lập Xuân: «đỗ xuân» — ở yên một nơi trong 5 phút thật (tùy chọn). 2. Xem tượng Thái Tuế trị niên mới đổi chỗ. 3. Thắp đèn năm mới (cho mình hoặc người khác). 4. Uống chén trà đầu năm ở Trà Thất. |
| Móc engine | `taisui-general › taiSuiGeneral(năm + 1)` (vd 2027: **丁未, 缪丙 Mâu Bính đại tướng quân**, nạp âm Thiên Hà Thủy, «chính trực, hay đọc sách — năm tĩnh tại, trọng đạo lý»); `taisui › taSuiTable(chi năm mới)` (2027 Mùi: phạm = Mùi (trị), Sửu (xung), Sửu + Tuất (hình), Tuất (phá), Tý (hại)); `TAISUI_REMEDY` ④ đỗ xuân; `state › lightLamp` |
| Thưởng | Đạo Hạnh +30 · Phúc Khí +30 (mỗi mùa) · bộ phục Đạo Lộ mùa mới mở (thẩm mỹ; §11) |
| Bỏ dở | Bỏ lỡ giờ Lập Xuân: các bước 2–4 vẫn làm được trong 15 ngày đầu năm can chi. |
| Cờ đặt | `F_LAP_XUAN_<năm>` |

```
[CẢNH MQ-E-07.1 · Cổng Nam Huyền Thành · giờ Lập Xuân · CUT-037]
(Sáng sớm. Trẻ con chơi chuyền dưới cổng như cảnh đầu game. Lão Tùng quét bậc.)
TRẺ CON: (hát) Trăng rơi xuống hồ, ai vớt lên? Ba vòng một lõi, xoay không ngừng…
TRẺ CON: (hát) …Ai ngồi giữa lõi? Là con đấy thôi!
LÃO TÙNG: (không ngẩng lên) Khách sớm. Năm mới rồi.
LÃO TÙNG: Lão hỏi một câu, ai lão cũng hỏi câu đó: năm nay cháu định làm gì?
> Lựa chọn: (ô nhập tự do ≤ 30 chữ — lưu vào Sổ Công Quá trang đầu năm; không chấm)
LÃO TÙNG: Được. Lão không nhớ đâu. Cháu nhớ là được.
(Đỗ xuân — tùy chọn: người chơi ngồi yên ở bậc cổng 5 phút thật trong khung giờ Lập Xuân. Không thưởng chỉ số; có dòng Sổ «Đỗ xuân năm {GZ}». Ghi chú: đây là tập tục dân gian «ở yên giờ giao năm» (`TAISUI_REMEDY` ④), trình bày như tập tục, không hứa hiệu quả.)
```

```
[CẢNH MQ-E-07.2 · Thái Tuế Điện]
THANH PHONG: (năm nay mặc áo đạo sĩ chính thức) Ông năm nay là {Mâu Bính đại tướng quân}. Thầy bảo ông chính trực, hay đọc sách. Năm của ông thì tĩnh. (nhìn bảng đồng) Năm nay mình hết phạm rồi! Tuổi Mão năm Mùi — tam hợp!
THANH PHONG: Bạn tuổi gì nhỉ… (đọc bảng cho người chơi theo `taSuiTable`) Năm nay người phạm là tuổi Mùi, Sửu, Tuất, Tý. Mình đi thắp đèn cho người ta nha.
```

```
[CẢNH MQ-E-07.3 · Trà Thất · chén trà đầu năm]
(Dì Hạnh, bé Lúa, Thanh Phong; nếu có: Khổng tiên sinh và Vân Cốc ngồi cùng một bàn — hai ông già không cãi, chỉ uống trà.)
DÌ HẠNH: Chén đầu năm. Trà năm nay ngon, mưa đủ.
BÉ LÚA: (nếu BR-TT-05 hoặc MQ-3-12 có bé Lúa) Năm nay con mười hai tuổi. (nhìn người chơi) Năm nay con viết sổ. Bà mua cho con một cuốn.
BÉ LÚA: Con viết dòng đầu rồi. Anh / chị đọc không?
> ① «Đọc.» → (cuốn sổ nhỏ: «Năm Đinh Mùi. Hạt giống không phải cái cây.») ② «Đó là sổ của em.» → BÉ LÚA: (gật, cất sổ, cười)
KHỔNG TIÊN SINH: (từ bàn bên, không quay lại) Con bé đó ta đoán năm nó mười một tuổi. Ta đoán đúng. (uống trà) Năm nay ta không đoán nó nữa.
VÂN CỐC: (cười) Ông đoán thì ông cứ đoán.
KHỔNG TIÊN SINH: Ta đoán. Ta chỉ không nói ra.
(Mùa mới bắt đầu. Các mùa sau, MQ-E-07 lặp lại với năm can chi mới; thoại Thanh Phong, Dì Hạnh, bé Lúa đổi theo năm (bé Lúa lớn thêm một tuổi mỗi mùa, tới 18 tuổi thì thành người giữ Trà Thất cùng Dì Hạnh).)
```

---

## Phụ lục — Lời kết theo tổ hợp cờ (cảnh cuối MQ-E-06, giọng Thầy Tử Bình, chọn **một** câu theo thứ tự ưu tiên)

| Ưu tiên | Điều kiện | Câu |
|---|---|---|
| 1 | `F_TALO = hoi_dau` và `F_LOBAN = quay_ve` | «Con với ông thợ cùng đi lối kia rồi cùng quay về. Thầy không dạy được cái đó. Con dạy thầy.» |
| 2 | `F_TALO = hoi_dau` | «Có người hỏi thầy: người từng hại người có được khắc tên không? Thầy nói: người đã cứu đúng những người mình hại thì được.» |
| 3 | `F_LOW_SCORE` và `F_BRANCH = NT` | «Đèn Tổ Sư Đường ngày con tới không sáng. Hôm nay con nhìn lại đèn đi.» (đèn sáng — Tổ Sư Đường đổi đèn từ BR-NT-07) |
| 4 | `F_BRANCH = TT` | «Con được nhận dễ. Thầy từng sợ con giữ không lâu. Thầy sai. Thầy ghi lại chỗ thầy sai.» |
| 5 | `F_BRANCH = DC` | «Người có bệnh mà biết thuốc thì sống lâu hơn người không biết mình bệnh.» |
| 6 | `F_BRANCH = DK` | «Cách lạ. Đường lạ. Bảng này vẫn có chỗ cho tên lạ.» |
| 7 | mặc định | «Bàn trên trời để biết trời. Bàn dưới đất để biết người. Con biết người rồi. Từ mai con ngồi Bàn Thầy, thầy lên Hậu Sơn uống trà với lão sư.» |

## Kiểm thử nghiệm thu Vĩ thanh

| # | Kiểm | Đạt khi |
|---|---|---|
| 1 | Tám chữ ở Dao Trì đúng tám chữ ở lễ lật trụ | so `R.chart.pillars` lúc MQ-P-02 và MQ-E-03 |
| 2 | Khuôn lời phán chạy lại đúng năm hiện tại | đổi `nowYear` → lời 2, 3 đổi theo engine |
| 3 | Thiên Bảng xếp theo Đạo Hạnh, Tiên Thiên ẩn mặc định | kiểm cài đặt riêng tư |
| 4 | Sự kiện Hợp Luân không thể «thua» với cá nhân | người đạt ngưỡng cá nhân luôn có cảnh + thưởng |
| 5 | Trần 15 công / người / ngày cho sự kiện | thử bot ghi 100 công / ngày → chỉ 15 tính |
| 6 | Không bảng xếp hạng đóng góp | UI không có danh sách top người góp |
| 7 | Lập Xuân theo phút tiết khí thật | đối chiếu `lunar-javascript` năm 2027 |

---

## Phụ lục Vĩ thanh A — Thẻ hậu truyện nhân vật

Sau CUT-036 (lần đầu), người chơi xem một chuỗi **thẻ hậu truyện**: mỗi thẻ một khung tranh tĩnh + hai câu. Thẻ chọn theo cờ; tối đa 8 thẻ; thứ tự cố định như bảng. Thẻ không có cờ phù hợp thì bỏ. Không thẻ nào phán vận của NPC — thẻ chỉ kể việc họ đang làm.

| # | Nhân vật | Điều kiện | Câu 1 | Câu 2 |
|---|---|---|---|---|
| 1 | Thanh Phong | luôn | Thanh Phong được Quán cho ngồi ghế dạy khách học. | Câu đầu tiên cậu dạy là câu Lão Tùng hỏi ở cổng: «Cháu sinh ngày nào, giờ nào?» |
| 2 | Dì Hạnh và bé Lúa | `F_LUA_DAY` hoặc `F_TL07 = that` hoặc `F_TALO = hoi_dau` | Trà Thất có thêm một bàn nhỏ ở góc, bé Lúa ngồi viết sổ. | Ai hỏi sổ viết gì, em chỉ đọc dòng đầu: «Hạt giống không phải cái cây.» |
| 2' | Dì Hạnh | các trường hợp còn lại | Dì Hạnh vẫn bán trà, giá không đổi từ ngày Bàn nứt. | Dì nói trà ngon hay không là do nước, không do năm. |
| 3 | chị Mận | `F_CASE_DP6` | Sạp cá cổng Đông có thêm một tấm bảng gỗ nhỏ: «Bảng Thái Tuế năm nay — xem miễn phí». | Chị Mận tự chép bảng mỗi Lập Xuân, chữ xấu mà đúng. |
| 4 | anh Lý Thuận, ông Hai Cương | `F_GIAO_LO` | Lò rèn phố Thợ rèn chuông gió cho cả ba xóm. | Ông Hai Cương uống trà ngoài hiên, mỗi tiếng búa lệch ông lại hắng giọng. |
| 5 | anh Đạt | `F_DAT_HOC_MOC` | Anh Đạt bào gỗ ở xưởng Ông Kha, nắm tay vừa. | Bộ bàn ghế đầu tiên anh làm đặt ở nhà trọ Mái Rêu, phòng nhìn lên Sơn Môn. |
| 5' | anh Đạt | `F_DAT_HOC_MOC` không có | Anh Đạt làm phu sửa đường hành hương. | Đoạn dốc Lò Gạch là đoạn anh lát. |
| 6 | Lê Khiêm | `F_KHIEM = cuu` | Lê Khiêm đỗ khoa sau, tên khắc dòng cuối bia Văn Miếu. | (`F_KHIEM_HOA`) Phạm Nhuận giữ cây bút gãy làm chặn giấy trên bàn hai người. / (không) Lê Khiêm dạy chữ ở lớp của cậu Bờm. |
| 7 | A Sính, A Mậu | `F_ASINH_CUU` | Trại bên sông mở lại suối trên sau một mùa. Bè gỗ xuống Huyền Thành mỗi tháng. | A Sính đi học thuốc ở dưới xuôi; A Mậu buộc chỉ màu cho từng bó thuốc gửi theo. |
| 8 | Ông Kha và thầy | `F_LOBAN = quay_ve` | Hai thầy trò đi từng nhà trong sổ khách của Hội, đào lên, gói lại, xin lỗi. | Có nhà đóng cửa. Ông thợ già ngồi trước cửa đến khi người ta mở. |
| 8' | Ông Kha | `F_LOBAN = o_lai` | Ông Kha dạy học trò làm mộng không đinh. | Mỗi Rằm ông thả một chiếc thuyền lá xuống suối Hậu Sơn, nói là gửi thầy. |
| 8'' | Ông Kha | `F_LOBAN = bo_di` | Ông Kha giữ lại cây vồ gỗ trên giá đỡ Bàn Đài. | Ai hỏi, ông nói: «Để thầy tôi về có cái mà cầm.» |
| 9 | Khổng tiên sinh | luôn | Khổng tiên sinh vẫn ngồi bậc thứ một trăm lẻ tám. Sổ của ông giờ có hai cột. | Ông vẫn đoán đúng. Ông hỏi thêm một câu sau mỗi lần đoán: «Năm sau ngươi quay lại kể ta nghe ngươi đã làm gì.» |
| 10 | Hứa Khang | `F_TT_HOI_KHANG` hoặc `F_NT_DE_TU` | Đèn Tổ Sư Đường sáng với Hứa Khang vào một tối không ai để ý. | Cậu không kể với ai. Cậu chỉ đổi ghế. |

## Phụ lục Vĩ thanh B — Mùa thứ hai trở đi

Sau lần đầu đi hết Vĩ thanh, người chơi ở lại thế giới. Mỗi mùa (một năm can chi) có các nhịp cố định dưới đây; không có hồi mới trong tập 03 (cốt truyện mùa sau thuộc tập 10 `EV-*` và tập 11 `SEASON-*`).

| Nhịp | Khi | Nội dung | Móc |
|---|---|---|---|
| Lời phán đầu năm | 15 ngày đầu năm can chi | Khổng tiên sinh ở bậc 108 phán lại cho người chơi theo khuôn §6.1 với năm mới; ông ghi tiếp cột «người nghe đã làm gì» từ dữ liệu mùa trước | khuôn MQ-P-06 |
| Mệnh Đồ năm mới | sau Lập Xuân | tầng Thời và tầng Thái Tuế của Mệnh Đồ tự cập nhật (`gaimenhPlan(R, {year: năm mới})`); Vân Cốc gửi thư một câu cho tầng thay đổi nhiều nhất | `gaimenh` |
| Năm hạn kế tiếp | khi năm hiện tại vượt qua `Y*` | `Y*` mới = `decadeForecast(R, năm + 1, 10).worst`; Vân Cốc mời mộng lại (tùy chọn) — mộng lần hai **ngắn** (chỉ MQ-3-08 Kỵ thần), thoại khác: «Lần này con biết là mộng.» | `decade-forecast` |
| Bàn Thầy | hằng ngày | người chơi đã qua Vĩ thanh ngồi ghế giữa Bàn Thầy; khách khó (án cách đặc biệt, án Tòng) ưu tiên chia cho người chơi có danh hiệu «Dị Nhân» hoặc «Thủ Cách» | `cases.js` |
| Hợp Luân | 30 ngày trước Lập Xuân | sự kiện máy chủ MQ-E-05 lặp lại | `S_CONG_MUA` |
| Thư đã gửi tương lai | khi năm thật tới năm ghi trong thư (BR-TT-03) | hộp gỗ Vận Mệnh Các mở; Thầy Tử Bình đọc thư cho người chơi | `F_TT_THU_TUONG_LAI` |
| Năm vàng | đúng năm `findGoldenYear` hạng 1 | Thanh Phong nhắc ở MQ-E-07: «Năm vàng của bạn. Nhớ: vàng thì làm.» | `golden-year` |

```
[CẢNH MÙA 2 · Bậc thứ 108 · 15 ngày đầu năm Đinh Mùi]
KHỔNG TIÊN SINH: Ngồi. Năm mới.
KHỔNG TIÊN SINH: (khuôn §6.1, MAU-A, 2027) Canh Kim sinh tháng Tỵ, lửa hạ luyện mà kim còn cứng. Kim chiếm năm mươi lăm phần cục, dày mà khó uốn. Thất Sát cách vỡ một góc, có chỗ vá.
KHỔNG TIÊN SINH: Năm nay Đinh Mùi, Chính Quan lâm năm. Trong năm này việc công, người trên dễ thở.
KHỔNG TIÊN SINH: Vận Ất Dậu vừa vào. Bình hòa mười năm.
KHỔNG TIÊN SINH: (ngẩng lên) Ta nói sai câu nào chưa? (không chờ) Không sai. (giở trang cột phải) Năm ngoái ngươi làm những việc này. Năm nay ngươi định làm gì? Nói đi, ta ghi trước.
(Ô nhập ≤ 40 chữ; Khổng tiên sinh ghi vào cột phải của năm mới. Mùa sau ông đọc lại: «Năm ngoái ngươi nói sẽ … Ngươi đã làm … .» — so với dữ liệu Sổ Công Quá, chỉ nêu việc đã làm, không chấm.)
```

*(Dữ liệu ví dụ: lưu niên 2027 của MAU-A theo `decadeForecast(R, 2027, 1)` là «Cát 57», can Đinh so Canh là Chính Quan; đại vận 乙酉 bắt đầu 2027.)*
