# 09-13 · Kịch bản thoại của hệ tu luyện

> Thoại **thuộc hệ tu** (không phải cốt truyện chính): cảnh thầy mở từng mini-game, 15 cảnh tâm ma chuẩn cho pha Tâm của độ kiếp, hai kịch bản độ kiếp trọn vẹn thêm (bổ sung `09-02` §8), lời thầy khi người chơi lên bậc, và lời hệ thống của Sổ Tu. Định dạng theo canon §1. Tài liệu 06 (NPC · AI) có quyền chỉnh giọng từng NPC (`PERSONA-*`), **giữ cấu trúc lựa chọn và điểm**.
>
> Quy ước điểm trong ngoặc vuông: `[1]` lựa chọn tốt nhất · `[0,5]` chấp nhận · `[0]` chưa đạt. Điểm **không bao giờ** hiện trên màn hình.

---

## 1. Giọng nói của người dẫn (tóm tắt để viết nhất quán)

| NPC | Giọng | Tránh |
|---|---|---|
| Lão Tùng (`gac_cong`) | ngắn, mộc, hay ví von bằng việc nhà (trà, lá, cổng) | giảng đạo dài |
| Thầy Tử Bình (`thay_tubinh`) | chính xác, hay dẫn sách, ấm | phán xét người khác |
| Vân Cốc (`van_coc`) | chậm, hỏi lại nhiều hơn trả lời | hứa hẹn kết quả |
| Huyền Hư (`huyen_hu`) | ít lời, nói bằng hình ảnh núi, nước | giải thích kỹ thuật khí công |
| Đan Đỉnh (`dan_dinh`) | thực tế, có chút hài, nói thật về đan độc | thần thánh hóa đan |
| Trương Thiên Sư (`truong_thiensu`) | trang nghiêm, chuẩn mực lễ | hứa «giải hạn» |
| Khâu đạo trưởng (`khau_daotruong`) | nghiêm, giới luật, công bằng | khắc nghiệt vô lý |
| Mao Sơn đạo nhân (`maoshan_daonhan`) | dân dã, tỉnh táo, «chín phần mười là bệnh» | dọa ma |
| Pháp Không (`truclam_thiensu`) | hỏi ngắn, hay im | đưa đáp án |
| Diệu Âm (`dieu_am`) | dịu, thương người, có trí | trách móc |
| Đa Kiệt (`lama_dakiet`) | (chờ tham vấn) | mọi chi tiết nghi lễ Tạng cụ thể |
| Tế tửu (`te_tuu`) | trang trọng, dí dỏm kiểu nhà nho | khoe chữ |
| Phán quan Thôi (`phan_quan`) | công bằng, không lạnh | dọa phạt |
| Khổng tiên sinh (`khong_tiensinh`) | tự tin, đúng một nửa, không ác | bị biếm họa thành kẻ xấu đơn thuần |

---

## 2. Cảnh mở từng mini-game (lần đầu)

Mỗi MG có một cảnh ngắn ≤ 8 dòng khi người chơi chạm lần đầu; xong cảnh, MG chạy ở mức Sơ. Cảnh có thể bỏ qua (nút «Đã biết»), xem lại trong Sổ Tu.

```
[CẢNH MG-01.0 · Trà Thất Sơn Môn · bất kỳ giờ · lần đầu tĩnh tọa]
LÃO TÙNG: Ngồi xuống. Lưng thẳng như cây cột, vai thả như áo phơi.
LÃO TÙNG: Hít vào khi vòng nở, giữ khi vòng đứng, thở ra khi vòng co. Thế thôi.
LÃO TÙNG: Có chữ bay qua thì để nó bay. Con đuổi theo chữ là con đứng dậy rồi đấy, dù người vẫn ngồi.
> Lựa chọn: ① «Con thử.» → [MG-01 mức Sơ]  ② «Thở thế này có phải luyện khí công không ạ?» → [MG-01.0b]
[MG-01.0b] LÃO TÙNG: Không. Đây là thở cho đều, như người ta ngồi uống trà. Khí công thật cần thầy cầm tay chỉ — sách cũng dặn vậy (cultivation-data › ETHICS).
```

```
[CẢNH MG-02.0 · Thiên Sư Phủ, Long Hổ · giờ Tỵ · lần đầu kết phù]
TRƯƠNG THIÊN SƯ: Phù có năm phần: đầu, thân, bụng, mật, chân. Đầu là nơi nó từ đâu tới. Chân là nơi nó dừng.
TRƯƠNG THIÊN SƯ: Chữ trên phù này là chữ của núi ta, không ai ngoài núi đọc được. Thế là đúng — phù thật cũng không phải để đọc.
TRƯƠNG THIÊN SƯ: Một điều nhớ cho kỹ: phù con viết là để người nhận yên lòng. Ai nói phù thay được thuốc, thay được đèn ngủ, thay được người mẹ ngồi bên — người đó bán phù, không phải viết phù.
> Lựa chọn: ① «Con xin học.» → [MG-02 mức Sơ]
```

```
[CẢNH MG-03.0 · Thư Lâu Lâm · giờ Thìn · lần đầu Hương thí]
THẦY TỬ BÌNH: Mười câu. Bốn câu sách, ba câu lá số, ba câu làm người.
THẦY TỬ BÌNH: Câu làm người không có trong sách nào, mà khó nhất.
```

```
[CẢNH MG-04.0 · sân Sơn Môn · giờ Mão · lần đầu Thái Cực]
HUYỀN HƯ CHÂN NHÂN (khách ghé Sơn Môn): Đừng đánh. Vẽ. Tay đi như mây qua núi — mây không vội, núi không cản.
HUYỀN HƯ CHÂN NHÂN: Nhanh mà gãy không bằng chậm mà tròn.
```

```
[CẢNH MG-05.0 · Am Vân Cốc · giờ Thân · lần đầu khay cát]
VÂN CỐC: Đổ cát theo vòng. Đẹp rồi thì quét đi.
> Lựa chọn: ① «Quét đi thì vẽ làm gì ạ?» → [MG-05.0b]  ② «Vâng.» → [MG-05]
[MG-05.0b] VÂN CỐC: Thế con ăn cơm làm gì, rồi cũng đói lại.
```

```
[CẢNH MG-06.0 · chính điện Sơn Môn · giờ Mão · lần đầu tụng]
LÃO TÙNG: Gõ mõ không phải để cho Phật nghe. Phật không điếc. Gõ để mình nghe chính mình.
LÃO TÙNG: Chậm thôi. Ai tụng nhanh là người đang muốn tụng cho xong.
```

```
[CẢNH MG-07.0 · hiệu thuốc Huyền Thành · giờ Tỵ · lần đầu bốc thuốc]
ÔNG LANG (NPC phụ): Người ta kể mệt, chán ăn, bụng đầy. Cậu đoán tạng nào?
ÔNG LANG: Đoán đúng rồi thì bốc mấy món ăn cho dễ chịu. Nhưng câu cuối bao giờ cũng là: «Đi khám đi.» Câu đó không bao giờ sai.
```

```
[CẢNH MG-08.0 · nhà riêng, Huyền Thành · giờ Mùi · lần đầu bố trí]
THẦY TỬ BÌNH: Nhà con hướng gì? Con tuổi gì? Hai cái ấy cho con bốn hướng tốt, bốn hướng xấu.
THẦY TỬ BÌNH: Giường kê vào hướng tốt. Gương đừng soi giường. Còn chỗ nào khó chịu thì dời đồ trước, mua đồ sau.
```

```
[CẢNH MG-09.0 · Lịch Đường · giờ Thìn · lần đầu chọn ngày]
THẦY TỬ BÌNH: Ngày nào xung tuổi người chủ lễ thì bỏ trước. Rồi xem trực. Rồi mới chọn.
THẦY TỬ BÌNH: Ngày tốt giúp việc thuận chút ít. Người chuẩn bị kỹ giúp việc thuận nhiều hơn.
```

```
[CẢNH MG-10.0 · Thư Lâu Lâm · sau độ kiếp bậc 2 · lễ đặt danh]
THẦY TỬ BÌNH: Tên là cái áo người khác gọi mình. Đạo hiệu là cái áo mình tự chọn để nhớ mình muốn thành ai.
THẦY TỬ BÌNH: Chọn hai chữ. Nét đẹp, nghĩa lành, và nhớ là con sẽ phải sống cho xứng với nó.
```

```
[CẢNH MG-11.0 · Hoa Yên, Yên Tử · giờ Thân · lần đầu công án]
THIỀN SƯ PHÁP KHÔNG: Ta hỏi, con không cần đáp đúng. Con chỉ cần đừng đáp cho xong.
THIỀN SƯ PHÁP KHÔNG: Mai quay lại. Kia mới là câu trả lời.
```

```
[CẢNH MG-12.0 · nhà bia Văn Miếu (hoặc thư phòng Sơn Môn) · giờ Tỵ · lần đầu thư pháp]
TẾ TỬU (te_tuu): Nét ngang trước, nét sổ sau. Chữ cũng có lễ như người.
TẾ TỬU: Viết chữ «命由我作» trước đã. Bốn chữ ấy viết cho thẳng thì đời cũng dễ thẳng.
```

```
[CẢNH MG-13.0 · đường lên Võ Đang · giờ Mão · lần đầu hái thuốc]
ĐAN ĐỈNH CHÂN NHÂN: Hái một, để hai. Núi không phải kho của riêng con.
ĐAN ĐỈNH CHÂN NHÂN: Lá hái sau khi sương tan, hoa hái lúc vừa nở, củ hái lúc chiều. Đấy là lệ của núi ta — sách không ghi, rừng ghi.
```

```
[CẢNH MG-14.0 · Trà Thất · giờ Thân · lần đầu pha trà]
LÃO TÙNG: Tráng ấm cho ấm. Đánh thức trà cho trà tỉnh. Rót vòng cho chén nào cũng như chén nào.
LÃO TÙNG: Người pha trà vội thì trà chát. Người pha trà giận thì trà… vẫn chát.
```

```
[CẢNH MG-15.0 · lò đan Võ Đang · giờ Tuất · lần đầu luyện đan]
ĐAN ĐỈNH CHÂN NHÂN: Ngày xưa người ta nung chu sa, thủy ngân, rồi uống. Nhiều người chết vì thế, có cả vua.
ĐAN ĐỈNH CHÂN NHÂN: Lò này luyện đan của trò chơi thôi. Cái thật con học được ở đây là giữ lửa: lửa to quá thì cháy, nhỏ quá thì nguội. Lòng người cũng thế.
```

```
[CẢNH MG-16.0 · Hồ Sen · giờ Tuất · lần đầu thả đèn (web)]
LÃO TÙNG: Điều ước con viết chỉ nằm trong máy của con. Ta không đọc. Hồ cũng không đọc.
LÃO TÙNG: Đèn chỉ mang ánh sáng đi. Điều ước thì con mang về nhà mà làm.
```

```
[CẢNH MG-17.0 · lầu chuông Sơn Môn · giờ Mão · lần đầu đánh chuông]
LÃO TÙNG: Mười tám tiếng nhanh, mười tám tiếng chậm, mười tám tiếng vừa. Hai lượt là một trăm lẻ tám.
LÃO TÙNG: Cả quán đang ngủ. Con đánh cho họ dậy, đừng đánh cho họ giật mình.
```

```
[CẢNH MG-18.0 · họa đường Huyền Thành · giờ Mùi · lần đầu họa luân]
BÀ TƯ (tho_may, ghé họa đường lấy mẫu thêu): Vẽ đi cháu. Ở đây không ai chấm đẹp xấu.
BÀ TƯ: Bà chỉ xin một vòng tương sinh — xanh trong cùng, rồi đỏ, vàng, trắng, đen ra ngoài. Bà thêu lên áo.
```

```
[CẢNH MG-19.0 · Đẩu Mẫu Điện, Long Hổ · giờ Hợi · lần đầu bái Đẩu]
TRƯƠNG THIÊN SƯ: Bảy ngôi, gáo trước chuôi sau. Bày đấu gạo: kiếm, gương, thước, cân, kéo, đèn.
TRƯƠNG THIÊN SƯ: Lễ là để lòng ngay. Hạn thì phải tự đi qua.
```

```
[CẢNH MG-20.0 · chân núi Yên Tử, chùa Giải Oan · giờ Thìn · lần đầu kinh hành]
THIỀN SƯ PHÁP KHÔNG: Mỗi bước một hơi thở. Có gì làm con lơ đãng thì biết nó, dừng lại, đổi cách nhìn, đi tiếp mười bước im lặng.
THIỀN SƯ PHÁP KHÔNG: Lên tới Chùa Đồng không phải là xong. Mỗi bậc là xong một lần.
```

```
[CẢNH MG-21.0 · bờ hồ Bút Tháp · giờ Thìn · lần đầu phóng sinh]
NI SƯ DIỆU ÂM: Phóng sinh là cứu mạng đang gặp nạn. Mua con chim đang yên trên cành về thả thì người ta lại đi bắt con khác.
NI SƯ DIỆU ÂM: Cứu đúng con, thả đúng chỗ, đúng lúc. Thương mà có trí.
```

```
[CẢNH MG-22.0 · chợ Huyền Thành, trước quầy «Đổi Mệnh» · giờ Mùi · lần đầu đối chất]
THẦY TỬ BÌNH: Ông ta nói gì, con ghi lại. Rồi mở lá số người kia ra mà so.
THẦY TỬ BÌNH: Cái sai thì sửa. Cái không ai biết được thì nói là không ai biết được. Còn người đang sợ thì đừng làm họ sợ thêm — kể cả sợ ông thầy bói.
```

```
[CẢNH MG-23.0 · Điện Phán Quan, Phong Đô · giờ Tý · lần đầu đọc sổ]
PHÁN QUAN THÔI: Sổ ghi việc làm khổ người. Không ghi nỗi buồn, không ghi tình thương.
ĐỊA TẠNG SỨ GIẢ: Đọc sổ để dẫn người ra. Nhớ thế.
```

```
[CẢNH MG-24.0 · làng chân núi Mao Sơn · giờ Dậu · lần đầu tam chẩn]
MAO SƠN ĐẠO NHÂN: Người ta bảo trúng yểm. Ta hỏi trước: ngủ ra sao, ăn ra sao, nhà ra sao.
MAO SƠN ĐẠO NHÂN: Chín phần mười cái gọi là yểm là bệnh, là nhà, là sợ. Một phần còn lại, ta cũng chưa chắc. Thứ tự là thế.
```

---

## 3. Mười lăm cảnh tâm ma chuẩn (pha Tâm của độ kiếp)

Mỗi độ kiếp dùng **khung** cảnh tâm ma của bậc mình (dưới đây), thay bối cảnh và người khích bằng nhân vật của đạo thống (bảng `09-02` §3–§6). Cảnh chuẩn dùng khi kịch bản đạo chưa viết xong.

### 3.1 Bậc 2 — Giác (biết)

```
[CẢNH TAM-2-THAM · nơi độ kiếp · bất kỳ giờ]
NGƯỜI LẠ (sứ giả Định Mệnh Hội, áo gấm): (đặt một tấm thẻ đen lên bàn) Thẻ Âm Bài. Bảy ngày, tu gấp đôi. Ai cũng nhận cả.
> Lựa chọn:
  ① (cầm thẻ) «Gấp đôi thì tốt quá.» → [0 · mở TL-xx]
  ② «Tôi thấy mình muốn cầm. Cái muốn ấy làm tôi sợ. Ông cất đi.» → [1]
  ③ «Đồ lừa đảo!» → [0,5]
[TAM-2-THAM.②] NGƯỜI LẠ: (cười, cất thẻ) Biết mình muốn — hiếm đấy. Lần sau ta sẽ đến lúc ngươi mệt hơn.
```

```
[CẢNH TAM-2-SAN · nơi độ kiếp]
KHỔNG TIÊN SINH: (lật quạt) Lá số ngươi, ta xem rồi. Tu đến Nhập Môn là kịch trần.
> Lựa chọn:
  ① «Ông nói sai!» (cao giọng) → [0,5]
  ② (im lặng một lúc) «Nghe ông nói, tôi thấy nhói. Tôi ghi nhận cái nhói ấy.» → [1]
  ③ «Ông là ai mà phán?» → [0]
```

```
[CẢNH TAM-2-SI · nơi độ kiếp]
(Một cuộn giấy tự mở trên bàn, chữ hiện dần: «Người này năm ba mươi lăm tuổi sẽ…» — rồi nhòe.)
> Lựa chọn:
  ① (cố đọc tiếp, lau mực) → [0]
  ② «Mình đang muốn biết tương lai đến mức tin một cuộn giấy tự mở. Biết thế là đủ.» (cuộn lại) → [1]
  ③ (mở Sổ Mệnh so với lá số thật) → [0,5]
```

### 3.2 Bậc 3 — Đình (dừng)

```
[CẢNH TAM-3-THAM]
PHÚ HỘ (NPC phụ): Một túi bạc. Chỉ cần thầy viết cho con trai tôi tấm phù đỗ đạt.
> Lựa chọn:
  ① (nhận bạc, viết) → [0]
  ② (tay dừng giữa chừng) «Tôi suýt nhận. Tôi dừng. Phù không làm con ông đỗ; con ông học thì đỗ. Tôi viết cho cậu ấy một câu chép lên bàn học, không lấy tiền.» → [1]
  ③ «Ông đi đi.» → [0,5]
```

```
[CẢNH TAM-3-SAN]
ĐẠO SĨ TRẺ PHÁI KHÁC (NPC phụ): Lễ của các người toàn hình thức. Đốt hương, gõ mõ, rồi tưởng mình tu.
> Lựa chọn:
  ① «Còn hơn phái của anh!» → [0]
  ② (thở ra) «Có khi anh đúng một phần. Tôi sẽ xem lại cái hình thức của tôi. Anh ngồi uống trà không?» → [1]
  ③ (quay đi, không nói) → [0,5]
```

```
[CẢNH TAM-3-SI]
(Đèn bản mệnh trên bàn lễ chập chờn ba lần.)
TIẾNG THÌ THẦM (trong đầu, chữ mờ): Điềm xấu. Năm nay mình gặp hạn rồi.
> Lựa chọn:
  ① (bỏ dở lễ, chạy đi hỏi thầy bói) → [0]
  ② (nhìn quanh) «Cửa sổ mở. Gió.» (đóng cửa, thắp lại) → [1]
  ③ (cầu khấn xin «đừng có hạn») → [0,5]
```

### 3.3 Bậc 4 — Chuyển (đổi niệm)

Ở bậc 4, sau lựa chọn hành động có bước chọn **chìa khóa** (`GAI_XIN.keys4`).

```
[CẢNH TAM-4-THAM]
THƯƠNG NHÂN (NPC phụ): Thứ thầy làm ra đẹp quá. Bán cho tôi, giá gấp mười. Giữ làm gì cho phí.
> Hành động: ① bán → [0]  ② «Không bán.» → tiếp  ③ «Tặng không, nếu ông mang về cho làng ông.» → tiếp (thưởng thêm 0,25)
> Chìa khóa (sau ② hoặc ③): 顺受 [0,5] · 逆增上缘 [0,5] · 消业想 [1: «coi như trả bớt cái tham của mình»] · 还债想 [0,5]
```

```
[CẢNH TAM-4-SAN]
KHỔNG TIÊN SINH: Ngươi làm lễ có nhận tiền không? Không nhận? Vậy ngươi lấy gì sống? Rồi sẽ nhận thôi. Ai cũng thế.
> Hành động: ① cãi lại → [0]  ② «Ông hỏi đúng chỗ tôi chưa nghĩ kỹ.» → tiếp  ③ im → [0,5]
> Chìa khóa (sau ②): 逆增上缘 [1: «ông là thầy của tôi hôm nay»] · 顺受 [0,5] · 消业想 [0,5] · 还债想 [0,5]
```

```
[CẢNH TAM-4-SI]
(Người chơi được cho xem «nếu ngươi sinh giờ khác»: một lá số Thiên Linh Căn với cuộc đời rực rỡ.)
> Hành động: ① ngắm mãi, tiếc → [0]  ② «Đó không phải tôi.» (đóng lại) → tiếp  ③ «Giá mà…» rồi đóng → [0,5]
> Chìa khóa (sau ②): 顺受 [1: «hạt của tôi là hạt này»] · 逆增上缘 [0,5] · 消业想 [0,5] · 还债想 [0,5]
```

### 3.4 Bậc 5 — Tịnh (im lặng)

Cảnh bậc 5 chấm chủ yếu bằng **không thao tác** trong khoảng thời gian (đo ở máy chủ).

```
[CẢNH TAM-5-THAM]
(Trong lúc ngồi, khung trao đổi hiện: một người chơi khác tặng 500 Ngọc «cảm ơn thầy đã kết phù».)
HỆ THỐNG: (nút «Nhận» sáng)
> Chấm: không chạm «Nhận» trong 45 giây [1] · chạm «Từ chối» [0,5] · chạm «Nhận» [0]
(Sau cảnh, món quà tự hoàn lại; người tặng nhận thư cảm ơn.)
```

```
[CẢNH TAM-5-SAN]
NGƯỜI NHÀ VONG (NPC phụ): (đập bàn, nói liên tục 60 giây, kể tội ông tổ, đòi trừng phạt)
> Chấm: im lặng đủ 60 giây [1] · ngắt lời trước 30 giây [0] · ngắt lời sau 30 giây [0,5]
> Sau khi họ nói xong: ① «Tôi nghe hết rồi. Anh mệt lắm.» [cộng 0,25 nếu tổng ≤ 1]  ② «Anh bình tĩnh.» [0]
```

```
[CẢNH TAM-5-SI]
(Ba lần có tiếng gọi «Thầy ơi có khách!» ngoài cửa trong lúc tĩnh tọa.)
> Chấm: thở tiếp, không đứng dậy cả ba lần [1] · đứng dậy lần ba [0,5] · đứng dậy lần một [0]
HUYỀN HƯ CHÂN NHÂN (bước vào, sau cùng): Khách là ta. Con không đứng dậy — con nghe thấy, nhưng không bị kéo đi. Thế là tịnh.
```

### 3.5 Bậc 6 — Hóa

Pha Tâm bậc 6 đã viết riêng cho từng đạo (`09-02` §6) và cảnh Khổng tiên sinh ở `ACT-K6-QN` (`09-02` §7.3). Không có khung chung: bậc 6 là việc của từng thầy.

---

## 4. Hai kịch bản độ kiếp trọn vẹn

### 4.1 `ACT-K2-NHO` · Khai Bút (người chơi mẫu `MAU-A`, `poisonTop` = Si)

```
[CẢNH ACT-K2-NHO.0 · Bàn Thầy, Sơn Môn · giờ Thìn · nắng xiên qua mái]
THẦY TỬ BÌNH: (đặt nghiên mực, cây bút) Con chọn cửa Nho. Cửa Nho mở bằng ba việc: viết, hiểu, giúp.
THẦY TỬ BÌNH: Viết trước. Bốn chữ «命由我作». Mệnh do ta làm ra.
> Lựa chọn: ① «Con viết.» → [K2-NHO.1]  ② «Câu này của ai ạ?» → [K2-NHO.0b]
[K2-NHO.0b] THẦY TỬ BÌNH: Của Liễu Phàm, chép trong sách dạy con. Ông ấy được một thầy bói đoán đúng mọi điều suốt hai mươi năm. Rồi ông ấy làm cho thầy bói sai. Đấy, câu chuyện có thế.

[CẢNH ACT-K2-NHO.1 · Bàn Thầy]
→ MG-12 · mức Sơ · bốn chữ 命 由 我 作 · s ≥ 0,5.
THẦY TỬ BÌNH: (nhìn tờ giấy) Chữ «命» con viết nét phẩy dài quá, như người muốn chạy trước số mình. Không sao. Chữ «作» thì đứng vững.

[CẢNH ACT-K2-NHO.2 · Thư Lâu Lâm · giờ Tỵ]
THẦY TỬ BÌNH: Hiểu. Năm câu về lá số của chính con. Mở Sổ Mệnh ra mà xem, không cấm.
→ MG-03 · Hương thí rút gọn 5 câu về lá số người chơi (tứ trụ, hành mạnh nhất, hành yếu nhất, Dụng thần, Mệnh Cách).
   Đáp án MAU-A: trụ ngày 庚 (Canh Kim) · mạnh nhất Kim 55% · yếu nhất Thủy 2% · Dụng Thủy · cách 七殺.
(Giữa chừng, gió lật trang sách. Một tờ giấy lạ rơi ra: «Đáp án kỳ Hương thí ngày mai — chép ngay kẻo mất».)
> Lựa chọn (biến thể Si):
  ① (nhặt lên, đọc) → [0 · K2-NHO.2a]
  ② (đặt tờ giấy úp xuống, làm tiếp câu của mình) → [1 · K2-NHO.2b]
  ③ (mang tờ giấy đưa cho thầy) → [0,5 · K2-NHO.2c]
[K2-NHO.2a] (Tờ giấy chỉ có một dòng: «Người tìm đáp án ngoài mình thì không bao giờ có đáp án.») THẦY TỬ BÌNH: (không ngẩng đầu) Đọc rồi à? Thì đấy.
[K2-NHO.2b] THẦY TỬ BÌNH: Con không lật nó lên. Biết rằng mình tò mò mà vẫn không lật — đó là cái biết của người học.
[K2-NHO.2c] THẦY TỬ BÌNH: Đưa ta làm gì? Con đã biết nó là gì đâu. À — con sợ mình lật. Cũng được. Biết sợ là biết một nửa.

[CẢNH ACT-K2-NHO.3 · Sơn Môn, Án thứ nhất · giờ Mùi]
THẦY TỬ BÌNH: Giúp. Có một bà cụ đang chờ. Bà hỏi năm nào nên sửa nhà.
→ Giải án khách (cases.js, 6 bước) · total ≥ 0,55.
BÀ CỤ (NPC khách): (cầm tờ giấy người chơi viết) Năm sau à? Ừ, năm sau thằng út nó cũng về. Cảm ơn cậu.
THẦY TỬ BÌNH: Học mà giúp được một bà cụ biết năm nào gọi con về sửa nhà — thế là học có ích.

[CẢNH ACT-K2-NHO.4 · Bàn Thầy · giờ Thân · gió lật sách]
THẦY TỬ BÌNH: Viết được, hiểu được, giúp được. Từ hôm nay con là Sĩ.
THẦY TỬ BÌNH: Mai ta làm lễ đặt tự cho con. Nghĩ trước đi: con muốn người ta gọi con bằng hai chữ gì.
(Gió lật trang. Sổ Tu: «Sĩ».)
```

### 4.2 `ACT-K3-TD` · Thập Niệm (người chơi mẫu có `poisonTop` = Tham)

```
[CẢNH ACT-K3-TD.0 · bờ Cùng Thông Hồ, phân đàn Tịnh Độ · giờ Thìn · mưa hoa nhỏ]
NI SƯ DIỆU ÂM: Mười niệm. Mỗi niệm một tiếng mõ. Đừng đếm — mõ đếm hộ con.
→ MG-06 · chế độ niệm Phật · mức Trung · s ≥ 0,55.
NI SƯ DIỆU ÂM: Niệm thứ bảy con vội. Thôi, người đời ai mà không có lúc vội.

[CẢNH ACT-K3-TD.1 · cổng phân đàn · giờ Tỵ]
NGƯỜI BÁN CHIM (NPC phụ): (giơ lồng chim sẻ) Thầy ơi, mua lồng này thả cho tích phúc. Giảm cho thầy một nửa, thầy tu mà.
> Lựa chọn (biến thể Tham):
  ① (mua, mở lồng thả) → [0 · K3-TD.1a]
  ② «Tôi suýt mua, vì rẻ, vì muốn có phúc. Tôi dừng. Anh bắt chúng ở đâu?» → [1 · K3-TD.1b]
  ③ «Không mua.» (đi thẳng) → [0,5]
[K3-TD.1a] (Đàn chim bay lên, đậu ngay trên mái chợ. Người bán đã bày lồng mới.) NI SƯ DIỆU ÂM: (khẽ) Mai anh ấy lại bắt chúng.
[K3-TD.1b] NGƯỜI BÁN CHIM: (ngượng) Ở bãi lau ngoài đê… NI SƯ DIỆU ÂM: Anh để chúng ở đó, chùa mua của anh mấy bao gạo bán cho trai đường. Được không?
NGƯỜI BÁN CHIM: … Được ạ.

[CẢNH ACT-K3-TD.2 · bờ hồ · giờ Ngọ]
→ MG-21 · một tình huống phóng sinh · s ≥ 0,6.
(web) → MG-16 · thả một đèn tưởng niệm cùng bà góa ở bờ hồ.
BÀ GÓA (NPC phụ): Ông nhà tôi đi mùa nước nổi năm ngoái. Tôi chẳng biết chữ, cô viết giúp tên ông lên đèn.
> Lựa chọn: ① viết tên ông, thả cùng bà → [hoàn thành]
(iOS) → quét lá bờ hồ cùng bà, nghe bà kể chuyện → [hoàn thành]

[CẢNH ACT-K3-TD.3 · bờ hồ · giờ Mùi · mưa hoa]
NI SƯ DIỆU ÂM: Mười niệm, một lần dừng, một lần cứu, một ngọn đèn. Trì giới không phải là cấm mình — là để mình không làm khổ ai.
(Sổ Tu: «Trì Giới · Trì Danh (Tịnh Độ)».)
```

---

### 4.3 `ACT-K2-PHAT` · Tam Quy (`poisonTop` = Sân)

```
[CẢNH ACT-K2-PHAT.0 · chân đường mòn lên Am Vân Cốc · giờ Mão · sương núi]
VÂN CỐC: (đứng chờ ở bậc đá thứ nhất, tay cầm hai cái thùng gỗ) Con muốn quy y. Quy là về, y là nương. Về đâu, nương gì?
> Lựa chọn: ① «Về Phật, nương Pháp, nương Tăng.» → [K2-PHAT.0a]  ② «Con chưa biết.» → [K2-PHAT.0b]
[K2-PHAT.0a] VÂN CỐC: Thuộc bài. Đi lên am đã, vừa đi vừa nghĩ xem câu ấy có nghĩa gì với con.
[K2-PHAT.0b] VÂN CỐC: Chưa biết là chỗ bắt đầu tốt. Đi lên am đã.
→ MG-20 · 5 phút · mức Sơ · đường mòn Hậu Sơn → am · s ≥ 0,5.

[CẢNH ACT-K2-PHAT.1 · hiên am · giờ Thìn]
VÂN CỐC: Nghe chuyện này. Một người nông dân mất mùa. Ông trách trời. Rồi thấy lúa nhà bên tốt, ông ghét nhà bên. Rồi đêm nằm lo: năm sau chắc cũng mất.
VÂN CỐC: Chỗ nào là tham, chỗ nào là sân, chỗ nào là si?
→ Chọn ba đoạn: «trách trời» · «ghét nhà bên» · «lo năm sau» ↔ Tham / Sân / Si.
   Đáp án chuẩn: ghét nhà bên → Sân · lo năm sau mất → Si · trách trời → Sân hoặc Si (cả hai chấp nhận) · không có đoạn Tham → chọn «không có» được 1.
VÂN CỐC: Không có tham? Phải. Ông ấy không tham. Ông ấy chỉ khổ. Đừng gán độc cho người khổ.

[CẢNH ACT-K2-PHAT.2 · hiên am · giờ Thìn · biến thể Sân]
(Một người đàn ông leo lên am, thở dốc, đặt mạnh gói lễ lên bàn.)
KHÁCH (NPC phụ): Sư cho tôi một lá số giải hạn! Mẹ tôi ốm mãi, lũ thầy dưới chợ chỉ biết lấy tiền!
VÂN CỐC: (không trả lời, quay sang người chơi) Con tiếp anh ấy.
> Lựa chọn:
  ① «Ở đây không giải hạn. Anh về đi.» → [0 · K2-PHAT.2a]
  ② «Anh giận lắm. Tôi cũng sẽ giận nếu là anh. Anh ngồi đây thở một chút đã, rồi kể tôi nghe mẹ anh ốm thế nào.» → [1 · K2-PHAT.2b]
  ③ «Sư phụ tôi không làm việc ấy đâu.» → [0,5]
[K2-PHAT.2b] KHÁCH: (ngồi xuống, im một lúc) … Ba tháng rồi. Bà không ăn được.
NGƯỜI CHƠI: (theo gợi ý mở) Bà đã được đưa đi khám chưa anh?
KHÁCH: Chưa… tôi sợ tốn tiền.
VÂN CỐC: (rót trà cho khách) Tiền lễ giải hạn anh mang lên đây, đem đưa bà đi khám. Ta xin anh thế.

[CẢNH ACT-K2-PHAT.3 · suối sau am · giờ Tỵ]
VÂN CỐC: Gánh nước. Hai thùng. Đừng làm đổ.
→ Đi bộ 180 m mang hai thùng nước (tốc độ chậm; chạy làm đổ — đi lại từ suối).
→ Về Sơn Môn giải một án khách · total ≥ 0,5.

[CẢNH ACT-K2-PHAT.4 · hiên am · giờ Mùi · tiếng chuông xa]
VÂN CỐC: Nương Phật là nương cái biết của mình. Nương Pháp là nương cái đúng. Nương Tăng là nương những người cùng đi — kể cả anh khách hồi sáng.
VÂN CỐC: Ba chỗ dựa. Đừng dựa vào ta.
(Sổ Tu: «Quy Y».)
```

### 4.4 `ACT-K3-CN` · Thủ Đàn Nhất Dạ (`poisonTop` = Tham)

```
[CẢNH ACT-K3-CN.0 · Đẩu Mẫu Điện, Long Hổ · giờ Dậu · trời quang]
TRƯƠNG THIÊN SƯ: Đêm nay con giữ đàn. Bảy đèn không tắt tới giờ Dần. Gió núi Long Hổ không biết thương ai.
→ MG-19 · mức Sơ · bày đấu, thắp bảy đèn.
(Đêm nén lại ≈ 12 phút thực. Bốn lần gió lùa: mỗi lần một đèn chao, người chơi che trong 3 giây.)

[CẢNH ACT-K3-CN.1 · Đẩu Mẫu Điện · giờ Tý · gió]
(Tiếng gõ cửa. Một phú hộ áo lụa bước vào, đặt túi bạc lên bậc đàn.)
PHÚ HỘ: Thầy đạo, con trai tôi sắp thi. Một tấm phù đỗ đạt thôi. Túi này… coi như dầu đèn.
> Lựa chọn (biến thể Tham):
  ① (cầm túi bạc, viết phù) → [0 · K3-CN.1a]
  ② (tay đặt lên túi bạc rồi dừng) «Tôi suýt nhận. Tôi không nhận. Phù không làm con ông đỗ được.» → [1 · K3-CN.1b]
  ③ «Đêm nay tôi giữ đàn, không viết phù.» → [0,5]
[K3-CN.1a] (Một đèn tắt phụt dù không có gió.) TRƯƠNG THIÊN SƯ (từ sau bình phong, khẽ): Đèn không giận con. Đèn chỉ tắt.
[K3-CN.1b] PHÚ HỘ: Thế thì tôi lên đây làm gì?
> Lựa chọn tiếp: ① «Ông lên để con ông biết cha nó thương nó. Ông về bảo nó: học thêm một canh, ngủ đủ một canh.» → [+cảnh K3-CN.1c]  ② «Tôi không biết.» → [giữ điểm]
[K3-CN.1c] PHÚ HỘ: (cầm lại túi bạc, nhìn bảy ngọn đèn rất lâu) Cha tôi ngày trước cũng chỉ bảo tôi có thế.

[CẢNH ACT-K3-CN.2 · làng dưới núi · sáng hôm sau, giờ Thìn]
MẸ EM BÉ (NPC phụ): Đêm nào nó cũng khóc, sợ tối. Thầy cho nó tấm phù.
→ MG-02 · mức Sơ · phiếu loại «an» (bình an) cho em bé NPC: hành cần = Dụng thần lá số em (`makeNpc` → `analyze` → `yong.primary`), luật ghép năm ô theo bảng `09-04` MG-02 §2.3.
> Lựa chọn khi trao phù:
  ① «Dán đầu giường là hết sợ.» → [0]
  ② «Phù này để em biết có người thương em. Chị để cho em một ngọn đèn nhỏ và ngồi với em đến khi em ngủ — phần ấy phù không làm thay được.» → [1]
EM BÉ: (cầm tấm phù, ngắm những nét lạ) Chữ này đọc là gì ạ?
NGƯỜI CHƠI: Không ai đọc được. Nó chỉ để em cầm cho ấm tay thôi.

[CẢNH ACT-K3-CN.3 · Thiên Sư Phủ · giờ Tỵ · mưa phùn ấm]
TRƯƠNG THIÊN SƯ: Đèn còn đủ bảy. Túi bạc còn nguyên chỗ cũ. Đứa bé ngủ được.
TRƯƠNG THIÊN SƯ: Thị Đàn. Giữ đàn cả đời mới là khó.
```

### 4.5 `ACT-K4-TT` · Hộ Thôn (`poisonTop` = Si) — cảnh làng thứ ba

```
[CẢNH ACT-K4-TT.3 · làng thứ ba dưới Mao Sơn · giờ Thân · tro còn ấm]
(Một gian bếp cháy rụi. Một bà cụ ngồi trên bậc, ôm cái nồi đồng.)
MAO SƠN ĐẠO NHÂN: (đứng xa, để người chơi tự đi tới) Người ta đồn bà nuôi bùa. Đêm qua có kẻ châm lửa.
BÀ CỤ: (không ngẩng lên) Tôi nuôi con mèo. Có thế.
> Lựa chọn (biến thể Si — người chơi được cho xem «bằng chứng» làng đưa: một hình nhân rơm dưới thềm nhà bà):
  ① «Có hình nhân thật. Có khi bà…» → [0]
  ② «Hình nhân rơm này còn mới, rơm khô, buộc bằng dây nilon. Nhà bà toàn dây đay cũ. Ai đó vừa đặt nó.» → [1]
  ③ «Tôi không biết thật giả, nhưng đốt nhà người là sai.» → [0,5]
> Chìa khóa (bậc 4): 逆增上缘 [1: «vụ này dạy tôi nhìn kỹ trước khi tin»] · 顺受 [0,5] · 消业想 [0,5] · 还债想 [0]
[K4-TT.3 sau ②] MAO SƠN ĐẠO NHÂN: Dây nilon. Định Mệnh Hội bán bùa «giải yểm» ở chợ phiên tuần trước, phải không? (người chơi mở thẻ ACT-092) Phải. Hôm nay ta có việc với chúng.
→ Hạnh: dựng lại gian bếp (4 mô-đun tài liệu 08) · vận động 3 nhà góp công (3 cảnh thoại ngắn; mỗi nhà một lý do từ chối khác nhau — sợ, bận, ngại — người chơi chọn lời mời phù hợp).
BÀ CỤ: (vuốt con mèo trong lòng) Thầy về cho tôi gửi lời cảm ơn mấy nhà. Cả nhà đã châm lửa — họ cũng sợ thôi.
MAO SƠN ĐẠO NHÂN: Nghe chưa. Bà ấy chuyển được rồi. Ta với con còn đang tập.
```

### 4.6 `ACT-K5-NH` · Đình Thí — phần ứng đối (thử im lặng)

```
[CẢNH ACT-K5-NH.2 · Đại Thành điện, Văn Miếu · giờ Tỵ · nắng chiếu xiên qua cửa]
TẾ TỬU: (đặt bài thi của người chơi xuống) Bài luận lá số khá. Ta hỏi một câu ngoài sách.
TẾ TỬU: Có một người học trò thi ba lần không đỗ. Lá số của cậu ta, theo đúng sách, «Ấn nhược, Quan vô khí». Cậu ta đến hỏi con: «Có phải số tôi không đỗ được?» Con trả lời thế nào?
(Tế tửu ngồi im. Không có đồng hồ trên màn hình. Máy chủ đo thời gian từ lúc câu hỏi kết thúc.)
> Chấm thử im lặng: trả lời trong 10 giây đầu [0,5] · đợi ≥ 30 giây rồi trả lời [1] (nút trả lời luôn sẵn — người chơi tự chọn lúc)
> Lựa chọn trả lời:
  ① «Đúng, số anh khó đỗ, nên chọn nghề khác.» → [0 · vi phạm RB2]
  ② «Sách nói Ấn nhược là việc học cần thầy, cần bạn, cần thời gian. Ba lần chưa đỗ là ba lần biết mình thiếu gì. Anh muốn tôi cùng xem lại bài không?» → [1]
  ③ «Không ai biết được.» → [0,5]
TẾ TỬU: (sau lựa chọn ②, mỉm cười) Người xưa có Liễu Phàm, bị đoán chỉ đỗ tú tài hạng mười bốn. Rồi ông ấy đỗ tiến sĩ. Sách không sai. Sách chỉ không biết người ta sẽ làm gì.
(Sổ Tu: kết quả Đình thí công bố ngày Vọng — 09-08 §5.)
```

### 4.7 `ACT-K6-TH` · Cư Trần

```
[CẢNH ACT-K6-TH.1 · đỉnh Chùa Đồng, Yên Tử · giờ Mão · biển mây dưới chân]
THIỀN SƯ PHÁP KHÔNG: (ngồi trên phiến đá, không quay lại) Lên tới đây rồi. Xuống làm gì nữa?
> Lựa chọn:
  ① «Con ở lại tu trên núi.» → [0,5 · K6-TH.1a]
  ② «Con xuống chợ.» → [1 · K6-TH.1b]
  ③ «Thầy muốn con làm gì ạ?» → [0 · K6-TH.1c]
[K6-TH.1a] THIỀN SƯ PHÁP KHÔNG: Núi đẹp. Ở lại cũng được. Nhưng người dưới chợ không leo lên đây được hết đâu con.
[K6-TH.1b] THIỀN SƯ PHÁP KHÔNG: (lần đầu quay lại, cười) Ta không bảo con. Con tự chọn. Thế là xong một nửa.
[K6-TH.1c] THIỀN SƯ PHÁP KHÔNG: Tới đây rồi mà còn hỏi ta? Thôi, ngồi thêm một lúc.

[CẢNH ACT-K6-TH.2 · chợ Huyền Thành · cả ngày · đông người]
→ Năm việc trong ngày thuộc nhóm Hạnh / Tĩnh: giải án khách, bốc thuốc ở hiệu thuốc, đối chất một quầy Định Mệnh Hội, mời trà một người lạ (người chơi bậc 1 nếu có trực tuyến, NPC nếu không), ngồi im 5 phút giữa chợ (MG-01 không giao diện, giữa tiếng ồn).
(Cuối ngày, Pháp Không đi ngang qua chợ, tay xách một bó rau.)
THIỀN SƯ PHÁP KHÔNG: Ta xuống mua rau. Con bận thế, ta không gọi.
(Ông đi khuất. Sổ Tu: «Giải Thoát · Cư Trần Lạc Đạo».)
```

### 4.8 `ACT-K6-NH` · Biết Dừng

```
[CẢNH ACT-K6-NH.2 · nhà bia Tiến sĩ, Văn Miếu · giờ Thìn · nắng sớm]
TẾ TỬU: Hội đồng muốn khắc tên con lên một tấm bia mới. Người ra đề Hương thí, người mở lớp dạy chữ, người đỗ Đình thí. Con xứng.
> Lựa chọn:
  ① «Con xin nhận.» → [0,5 · K6-NH.2a]
  ② «Con xin khắc tên thầy con — Thầy Tử Bình — thay vào. Thầy dạy con nét chữ đầu tiên.» → [1 · K6-NH.2b]
  ③ «Con không xứng.» → [0,5 · K6-NH.2c]
[K6-NH.2a] TẾ TỬU: Được. (gật đầu) Nhưng ta hơi tiếc — ta đã mong con nói khác.
[K6-NH.2b] TẾ TỬU: (đứng lặng một lúc) Đại Học nói: biết chỗ dừng rồi mới định được. Con biết dừng ở chỗ khó dừng nhất — ở cái tên của mình.
[K6-NH.2c] TẾ TỬU: Khiêm tốn quá cũng là một cách nhìn mình nhiều quá. Thôi được.
(Ngày khắc bia — sự kiện tài liệu 10 — Thầy Tử Bình được mời lên Văn Miếu. Ông đứng trước tấm bia, đọc tên mình, rồi quay sang người chơi.)
THẦY TỬ BÌNH: Con viết chữ «命» bây giờ đã thẳng chưa?
```

---

## 5. Lời thầy khi người chơi lên bậc (theo đạo × bậc)

| Đạo | Lên bậc 3 | Lên bậc 4 | Lên bậc 5 | Lên bậc 6 |
|---|---|---|---|---|
| `CN` Trương Thiên Sư | «Đàn đã giữ được một đêm. Giữ cả đời mới khó.» | «Lễ mà không nhận lễ vật — người làng sẽ nhớ con lâu hơn nhớ phù.» | «Sấm ở ngoài, con ở trong. Tốt.» | «Ấn ở tay con rồi. Đừng để nó nặng hơn tay.» |
| `TV` Huyền Hư | «Lò còn đỏ, người còn tỉnh.» | «Khí thành thần rồi. Đừng khoe. Thần thích im.» | «Có người gọi mà con không đứng dậy. Hiếm lắm.» | «Lên núi rồi thì xuống. Đạo ở dưới chân.» |
| `TC` Khâu đạo trưởng | «Bảy ngày không phạm. Ngày thứ tám mới là thật.» | «Đi năm vùng, ở nhờ năm nhà, không làm phiền ai. Đó là giới.» | «Người gõ lệch, con vẫn đều. Không sửa người — giữ mình.» | «Không nhận trụ trì. Ta biết con sẽ không nhận.» |
| `TT` Mao Sơn đạo nhân | «Con không tin ngay. Thế là con có thể cứu người.» | «Ba làng. Không đốt một tấm phù nào. Hay.» | «Tiếng động ngoài sân là mèo. Con ngồi đợi rồi mới ra xem. Đúng.» | «Họ muốn lập miếu con. Con bảo lập trạm y tế. Ta nhẹ lòng rồi.» |
| `BD` Phán quan Thôi | «Con không kết tội oan một trang nào.» | «Con tự đọc sổ mình mà không giấu trang nào.» | «Con để người ta nói hết. Không phải ai cũng làm được.» | «Ghi cả công lẫn quá. Sổ con sạch vì nó thật.» |
| `TH` Pháp Không | «Hai ngày, một câu. Còn quay lại là còn tu.» | «Không cầm đáp án của người khác. Đáp án ấy không có thật.» | «Im lặng sáu mươi hơi thở. Ta nghe thấy.» | «Con chọn xuống núi. Ta biết con chọn đúng — vì con không hỏi ta.» |
| `TD` Diệu Âm | «Mười niệm, một lần dừng.» | «Bảy ngày niệm, một lần an ủi người. Cái sau nặng hơn.» | «Một trăm lẻ tám lạy, không quay đầu lại khi người ta chụp ảnh.» | «Hồi hướng cả cho người làm mình khổ. Liên đài là thế.» |
| `MT` (Vân Cốc / Đa Kiệt) | «Bảy ngày chú, bảy dòng công quá. Như Liễu Phàm.» | «Không bán đàn cát. Gió sẽ mang nó đi đâu nó cần.» | «Góc đàn mất, con không vẽ lại. Vô thường đấy.» | «Đàn đẹp nhất là đàn chưa vẽ.» |
| `NH` Tế tửu | «Ba ngày thi, một ngày dạy chữ cho em bé. Ngày ấy ta chấm cao nhất.» | «Không oán người đánh tụt bài. Hiền nhân đấy.» | «Ta im lặng, con đợi. Bài ứng đối hay nhất là bài biết đợi.» | «Khắc tên thầy con lên bia thay tên con. Thánh hiền là người biết dừng.» |

Lên bậc 2 dùng lời người dẫn của cửa nhập môn (`09-02` §2): Lão Tùng («Biết mình đang nhói — thế là qua cửa»), Vân Cốc («Ba chỗ dựa. Đừng dựa vào ta.»), Thầy Tử Bình («Viết được, hiểu được, giúp được.»).

---

## 6. Lời hệ thống của Sổ Tu

Sổ Tu nói như **một trang giấy có lời của thầy**, không như máy. Mỗi dòng có biến thể iOS khi cần (cột phải).

| Tình huống | Lời (web) | iOS |
|---|---|---|
| Đủ D1–D4 | «Thời khắc đã tới. Thầy đang đợi con ở <nơi>.» | «Kỳ khảo đã mở. Thầy đợi con ở <nơi>.» |
| Đủ ĐH, thiếu ngày củng cố | «Củng cố <x> / <y> ngày tu. Đi cho mềm giày đã.» | như web |
| Thiếu công | «Còn thiếu <n> việc thiện. Đường không ngắn đi vì thiếu, chỉ dài thêm.» | như web |
| Thiếu Quy nhất | «Hai đạo đã vào thất. Đạo thứ ba còn ngoài cửa.» | như web |
| Cảnh giới bất ổn | «Tâm đang lệch một chút. Sám hối được — con biết chỗ.» | như web |
| Có Nợ Âm | «Còn nợ <n>. Trả xong rồi hãy lên núi.» | «Còn nợ <n> điểm tu.» |
| Chạm trần ngày | «Hôm nay tu đủ rồi. Phần dư thầy cất vào lư hương, mai con nhận.» | «Hôm nay đủ rồi. Phần dư để dành cho mai.» |
| Dư Hương nhận buổi sáng | «Lư hương còn chút hương hôm qua: +<n>.» | «Phần để dành hôm qua: +<n>.» |
| Nhật Khóa đủ | «Nhật Khóa đủ. Một ngày không uổng.» | như web |
| Nhật Khóa thiếu một nhóm | «Còn thiếu một việc <nhóm>. Gần đây có <hoạt động>.» (tắt được) | như web |
| Chuỗi được cứu bằng ngày nghỉ | «Hôm qua con nghỉ. Thầy coi như con đi vắng một hôm — chuỗi vẫn còn.» | như web |
| Chuỗi giảm một nửa | «Con đi lâu. Chuỗi còn một nửa — một nửa vẫn là nhiều.» | như web |
| Quay lại sau ≥ 14 ngày | «Quán vẫn đây. Ba ngày tới con tu được nhiều hơn chút để bắt nhịp.» | như web |
| Sung Mãn | (không lời; thanh sáng) | — |
| Hư | «Khí đang mỏng. Một chén trà?» | như web |
| Kiệt (một lần / ngày) | LÃO TÙNG: «Ngồi đây. Trà vừa sôi.» | như web |
| Đêm (sau 23:00, một lần) | «Giờ Tý rồi. Ngủ cũng là tu.» | như web |
| Phiên dài 45 phút | LÃO TÙNG: «Đứng dậy vươn vai, rồi hãy làm tiếp.» | như web |
| Lần đầu thấy NT | câu canon §4.7 + câu theo khoảng NT (`09-03` §3.3) | như web |
| Lên bậc 4 (Tiên Thiên thôi tính) | «Từ đây, hạt giống không còn được tính. Chỉ còn cái cây.» | như web |
| Phạm giới bị trừ | «Việc vừa rồi làm khổ người. −<n> Đạo Hạnh. Sám hối được.» | như web |
| Sám hối xong | «Đã sám. +<n>. Đừng làm lại là đủ.» | như web |
| Độ kiếp chưa đạt | «Chưa đạt pha <pha>. Mai thử lại. Không mất gì.» | «Chưa đạt. Mai thử lại.» |
| Ba lần chưa đạt | THẦY: «Để ta dìu con một đoạn.» (bật / từ chối) | như web |
| Rẽ Tà Lộ | (không lời phán xét) «Con đã nhận Âm Bài. Bảy ngày tới, mọi việc tu được nhân đôi.» | (tài liệu 05 quyết định có Tà Lộ trên iOS không) |
| Lên bậc | «<đạo hiệu> · <tên bậc> · <danh xưng môn hạ>» + lời thầy §5 | như web |

---

## 7. Lời NPC từ chối dạy khi chưa đủ bậc (khách hành hương — `09-01` §6.2)

| Nơi | NPC | Lời |
|---|---|---|
| Long Hổ | Trương Thiên Sư | «Con cứ dâng hương. Lễ thì để khi con quen núi hơn.» |
| Võ Đang | Huyền Hư | «Ngồi đâu cũng được. Lò thì chưa.» |
| Chung Nam | Khâu đạo trưởng | «Quán mở cửa cho khách. Giới thì chưa trao cho người lạ.» |
| Mao Sơn | Mao Sơn đạo nhân | «Đi dạo làng đi. Thấy ai cần giúp thì về báo ta.» |
| Phong Đô | Phán quan Thôi | «Sổ không mở cho người chưa sẵn lòng đọc nó.» |
| Yên Tử | Pháp Không | «Bậc đá thì ai cũng leo được. Câu hỏi thì đợi đã.» |
| Bút Tháp | Diệu Âm | «Con ngồi nghe niệm Phật cũng là được rồi.» |
| Tạng Địa | Đa Kiệt (chờ tham vấn) | «Tuyết lạnh. Uống trà bơ đã.» |
| Văn Miếu | Tế tửu | «Đọc bia đi. Thi thì để khi con đã thuộc tên vài vị tiến sĩ.» |
| Miêu Cương | A Mậu | «Ngồi đây nghe bà kể chuyện. Thuốc thì để sau.» |
| Côn Lôn | (không có — chưa lên được) | — |

---

## 8. Nghiệm thu thoại

- [ ] Mọi cảnh có biến thể iOS khi chứa từ thuộc bảng thuật ngữ `09-11` §4.
- [ ] Không câu nào của phe thiện khẳng định tất định (RB2), hứa giải hạn (RB5), chẩn bệnh (RB1).
- [ ] Mọi lựa chọn trong cảnh tâm ma có điểm trong dữ liệu, điểm không hiện trên màn hình.
- [ ] Lời Khổng tiên sinh không biếm họa; ông được cho một kết đẹp ở `ACT-K6-QN`.
- [ ] Tài liệu 06 rà giọng từng NPC theo `PERSONA-*`.
