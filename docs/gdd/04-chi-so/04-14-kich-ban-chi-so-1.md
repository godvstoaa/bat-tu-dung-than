# 04-14 · Kịch bản các khoảnh khắc chỉ số (1/2): Mệnh Bàn, «Vì sao?», Bổ Dụng, Bổ Khuyết

## 0. Phạm vi và quy ước

Phần này viết **thoại cho những khoảnh khắc do chỉ số kích hoạt** — nơi hệ thống 04 phải «nói thành lời». Cốt truyện chính (`MQ-*`, `BR-*`) vẫn do 03 viết; các cảnh dưới đây là **mô-đun chèn** mà 03 gọi tới, hoặc cảnh nhỏ tự kích hoạt theo điều kiện chỉ số.

- Mã cảnh: `STAT-CANH-<nhóm>-<số>`. Nhánh lựa chọn trỏ tới mã cảnh khác hoặc `[về luồng chính]`.
- `{…}` là biến điền từ Mệnh Bàn: `{ten}` tên người chơi, `{dung}` hành Dụng (Mộc / Hỏa …), `{thuoc_tinh_dung}` (Sinh Cơ / Nhiệt Tâm …), `{nhat_chu}` chữ Hán can ngày, `{pham_can}`, `{cach}` tên cách Việt, `{ky}` hành Kỵ, `{vung_dung}` một vùng hợp Dụng gần nhất (04-03 §6.1).
- Mọi câu đã qua danh sách chữ 04-13 §4. Không câu nào đọc to con số Tiềm Lực (04-13 §2.2).
- Thoại thầy dùng «con», người chơi xưng «con» với thầy, «tôi» với người lạ.

## 1. Cảnh nhận Mệnh Bàn — Chính Đường

Kích hoạt: lần đầu người chơi đến Bàn Thầy sau nghi lễ phẩm phục (thầy «đang ngồi ở Chính Đường», `main.js`). Một cảnh gốc + một đoạn rẽ theo Mệnh Cách + đoạn phụ theo điều kiện.

### 1.1 Cảnh gốc

```
[CẢNH STAT-CANH-MB-01 · Chính Đường, Huyền Quán Sơn Môn · giờ Thìn · nắng sớm qua song cửa]
(Bàn gỗ, một tờ giấy dó trải sẵn, nghiên mực còn ướt. Thầy Tử Bình không ngẩng lên.)
THẦY TỬ BÌNH: Ngồi đi. Thầy đã đặt bút rồi, chỉ chờ con tới mới viết nốt.
THẦY TỬ BÌNH: (viết bốn cột chữ) Năm, tháng, ngày, giờ. Bốn trụ. Con biết vì sao gọi là trụ không?
> Lựa chọn: ① «Vì nó chống đời mình lên?» → [MB-01a]  ② «Con không biết.» → [MB-01b]  ③ (im lặng nhìn tờ giấy) → [MB-01b]

[MB-01a]
THẦY TỬ BÌNH: (gật) Chống được thì cũng đè được. Nhớ cả hai nghĩa. → [MB-01c]

[MB-01b]
THẦY TỬ BÌNH: Trụ là cột nhà. Nhà ai cũng bốn cột. Cột to cột nhỏ khác nhau, nhưng nhà dựng lên cao bao nhiêu là việc của người ở. → [MB-01c]

[MB-01c]
(Thầy khoanh một chữ ở cột ngày: {nhat_chu}.)
THẦY TỬ BÌNH: Đây là con. Chữ {nhat_chu}. Ba cột kia là trời đất người quanh con.
THẦY TỬ BÌNH: (chấm mực vẽ năm vòng nhỏ quanh chữ) Năm hành. Có hành dày, có hành mỏng. Con cần nhất là {dung}.
(Mệnh Bàn mở trên màn hình theo thứ tự 04-12 §2.6.)
THẦY TỬ BÌNH: Thầy gọi lá số này là {pham_can}. Cái tên chỉ để gọi. Bấm vào chữ nào, thầy giảng chữ ấy.
→ [rẽ theo Mệnh Cách: MB-TT / MB-DC / MB-NT / MB-DK]
```

### 1.2 Rẽ Thuận Thiên

```
[CẢNH STAT-CANH-MB-TT · Chính Đường · tiếp]
THẦY TỬ BÌNH: (đặt bút xuống, lần đầu ngẩng lên) Cách của con là {cach}. Thành cách. Không có bệnh.
THẦY TỬ BÌNH: Thầy nói thật: một trăm người vào đây, chưa được hai người như con.
> Lựa chọn: ① «Vậy con không cần tu nhiều?» → [MB-TT-a]  ② «Thế thì con phải làm gì?» → [MB-TT-b]

[MB-TT-a]
THẦY TỬ BÌNH: (cười) Nhà xây sẵn thì không cần tu bổ à? Mười năm không quét, mái dột như thường.
THẦY TỬ BÌNH: Cách thành thì sợ nhất một thứ: vận phá cách. Thầy sẽ chỉ con mấy cổng vận ấy ở Vận Mệnh Các. → [MB-TT-c]

[MB-TT-b]
THẦY TỬ BÌNH: Giữ. Giữ khó hơn được. → [MB-TT-c]

[MB-TT-c]
THẦY TỬ BÌNH: Tổ Sư có lời dặn: người thành cách vào thẳng nội môn. Từ hôm nay con là đệ tử Sơn Môn.
(Âm thanh chuông nhỏ. Danh hiệu «Đệ tử nội môn».)
THẦY TỬ BÌNH: Đi đi. Đừng đi nhanh quá.
[về luồng chính: BR-TT]
```

### 1.3 Rẽ Đắc Cứu

```
[CẢNH STAT-CANH-MB-DC · Chính Đường · tiếp]
THẦY TỬ BÌNH: Cách của con là {cach}. Có bệnh. (ngừng) Và có thuốc.
THẦY TỬ BÌNH: (chỉ hai chỗ trên tờ giấy) Chỗ này là bệnh. Chỗ này là thuốc. Thuốc nằm ngay trong lá số của con.
> Lựa chọn: ① «Bệnh gì ạ?» → [MB-DC-a]  ② «Thuốc ở đâu?» → [MB-DC-b]

[MB-DC-a]
THẦY TỬ BÌNH: Bệnh của cách, không phải bệnh của người. Cách giống bàn cờ: có quân bị kẹp. Quân bị kẹp không chết — chỉ cần quân khác tới gỡ.
→ [MB-DC-b]

[MB-DC-b]
THẦY TỬ BÌNH: Thầy biết bệnh, không biết hái thuốc. Người biết là Đan Đỉnh chân nhân trên Võ Đang.
THẦY TỬ BÌNH: Ông ấy sẽ đọc phương thuốc của con. Có {so_vi} vị. Mỗi vị mọc một nơi.
THẦY TỬ BÌNH: (gấp tờ giấy, đưa cho người chơi) Đưa ông ấy cái này. Đừng đọc trước — đọc trước thì sốt ruột.
(Vật phẩm «Tờ phương mệnh» vào túi.)
[về luồng chính: BR-DC]
```

### 1.4 Rẽ Nghịch Thiên

```
[CẢNH STAT-CANH-MB-NT · Chính Đường · tiếp]
THẦY TỬ BÌNH: (im lâu) Cách của con là {cach}. Bại cách.
THẦY TỬ BÌNH: Thầy không giấu: theo lệ, người bại cách chưa vào nội môn được ngay.
> Lựa chọn: ① «Vậy con phải đi?» → [MB-NT-a]  ② «Bại thì sao? Con vẫn ở đây.» → [MB-NT-b]  ③ «Lệ ấy ai đặt?» → [MB-NT-c]

[MB-NT-a]
THẦY TỬ BÌNH: Đi một đoạn, rồi về. Không phải đuổi. Là đưa đường. → [MB-NT-d]

[MB-NT-b]
THẦY TỬ BÌNH: (lần đầu cười) Câu ấy thầy nghe nhiều người nói. Người nói câu ấy thường quay lại. → [MB-NT-d]

[MB-NT-c]
THẦY TỬ BÌNH: Người xưa. Người xưa cũng có lúc sai. Có một người từng bị đoán trước cả đời, sống đúng từng năm như lời đoán — rồi một ngày ông ấy làm cho lời đoán sai hết.
THẦY TỬ BÌNH: Ông ấy tên Liễu Phàm. Người dạy ông ấy ngồi trong một cái am sau núi. → [MB-NT-d]

[MB-NT-d]
THẦY TỬ BÌNH: Sau Hậu Sơn có Am Vân Cốc. Đi đường đá, qua ba cây tùng. Vân Cốc thiền sư không nhận ai — trừ người bại cách.
(Bản đồ đánh dấu Am Vân Cốc. Nhiệm vụ «Đường sau núi».)
THẦY TỬ BÌNH: À. Lá số là hạt giống, không phải cái cây. Đi đi.
[về luồng chính: BR-NT]
```

Lưu ý cho 03: cảnh này là **cảnh từ chối** canon nhắc («bị Sơn Môn từ chối nhận vào lúc đầu — tình tiết, không phạt»). Không có màn hình, âm thanh hay biểu tượng nào mang nghĩa thất bại.

### 1.5 Rẽ Dị Cách

```
[CẢNH STAT-CANH-MB-DK · Chính Đường · tiếp]
THẦY TỬ BÌNH: (nhìn tờ giấy rất lâu, rồi lật ngược nó lại) Lạ.
THẦY TỬ BÌNH: Lá số người ta, thầy đọc từ thân ra. Lá số con phải đọc từ thế vào. Cách của con là {cach}.
> Lựa chọn: ① «Thế là gì ạ?» → [MB-DK-a]  ② «Lạ là xấu hay tốt?» → [MB-DK-b]

[MB-DK-a]
THẦY TỬ BÌNH: Nước chảy xuống, lửa bốc lên, đó là thế. Người thường thì giữ mình cho vững. Người như con thì phải theo dòng — mà theo cho đúng. → [MB-DK-c]

[MB-DK-b]
THẦY TỬ BÌNH: Lạ là lạ. Hai chữ «tốt», «xấu» thầy để cho người bán bùa ngoài chợ. → [MB-DK-c]

[MB-DK-c]
THẦY TỬ BÌNH: Thầy dạy phù ức, dạy cách giữ thân. Con không cần cái đó. Có một người lang thang biết dạy thuận thế — không ai biết tên ông ấy.
THẦY TỬ BÌNH: Ông ấy hay ngồi ở quán trà dưới chân Sơn Môn, khi trời sắp đổi gió.
{nếu sub = 败格}
THẦY TỬ BÌNH: Thế của con đang bị cưỡng. Ông ấy sẽ cho con chọn: giữ thế, hay quay về đường thường. Đường nào cũng tới.
{hết}
[về luồng chính: BR-DK]
```

### 1.6 Đoạn phụ theo điều kiện

Chèn **sau** đoạn rẽ, trước `[về luồng chính]`, tối đa hai đoạn (ưu tiên theo thứ tự bảng).

| Điều kiện | Đoạn chèn |
|---|---|
| `hourUnknown` | THẦY TỬ BÌNH: Con không biết giờ sinh. Thầy tạm lấy giờ Ngọ — giữa trưa, giờ của người chưa biết. Mấy chỗ có chấm hỏi trên Mệnh Bàn là chỗ thầy đoán. Biết giờ rồi thì quay lại, không mất gì. |
| Dụng ở tầng Khuyết | THẦY TỬ BÌNH: (chỉ ô {dung} viền chấm) Con thiếu đúng thứ con cần. Vậy đường của con đã rõ. Mai đi {vung_dung}. |
| Phẩm căn PC1–PC3 (lần đầu xem) | THẦY TỬ BÌNH: Lá số là hạt giống, không phải cái cây. Hạt nhỏ thì phải chăm nhiều hơn. Thầy chưa từng thấy ai chăm mà cây không lớn. |
| Phẩm căn PC8–PC10 | THẦY TỬ BÌNH: Trời cho sẵn thì phải giữ. Giữ khó hơn được. Nhớ câu này lúc con thấy người khác tu nhanh hơn con. |
| Có ít nhất một kiếp số | THẦY TỬ BÌNH: (chỉ hạt ngọc màu son) Hạt này là kiếp. Kiếp là ải, không phải án. Tới lúc, thầy dắt con qua. |
| Túc Nghiệp đã ẩn | (không chèn gì về Túc Nghiệp) |

## 2. Cảnh dạy đọc «Vì sao?»

Kích hoạt: lần đầu người chơi bấm «Vì sao?» ở bất kỳ chỉ số nào.

```
[CẢNH STAT-CANH-VS-01 · Chính Đường (hoặc tại chỗ, Thầy hiện qua giấy truyền âm) · bất kỳ]
THẦY TỬ BÌNH: Con muốn biết vì sao à? Tốt. Người không hỏi vì sao thì chỉ còn tin.
THẦY TỬ BÌNH: Mỗi dòng ở đây là một lý do thầy cộng hay trừ. Dòng có mũi tên lên là thứ nâng con. Dòng mũi tên xuống là chỗ con có thể bồi.
> Lựa chọn: ① «Sao lại trừ điểm con?» → [VS-01a]  ② «Dòng chữ Hán kia là gì?» → [VS-01b]  ③ «Con hiểu rồi.» → [VS-01c]

[VS-01a]
THẦY TỬ BÌNH: Không phải trừ con. Trừ lá số. Lá số là bản đồ lúc con mới sinh. Bản đồ cũ có chỗ đường đứt — con đi rồi thì đường nối lại.
THẦY TỬ BÌNH: Dòng nào có chữ «đi tới», bấm vào, thầy chỉ đường. → [VS-01c]

[VS-01b]
THẦY TỬ BÌNH: Lời gốc của sách. Thầy giữ nguyên để con đối chiếu, không ai bịa được. Sách xưa có chỗ nói nặng lời — con đọc để biết, đừng để nó nói thay con. → [VS-01c]

[VS-01c]
THẦY TỬ BÌNH: Còn một điều. Con số trên cùng là chỗ con bắt đầu. Không phải chỗ con dừng.
[đóng]
```

## 3. Mở chuỗi Bổ Dụng — 5 biến thể theo hành Dụng

Kích hoạt: Hồi I, sau cảnh nhận Mệnh Bàn, nếu Dụng ở tầng hiệu dụng ≤ 2 (mạch chính) hoặc khi người chơi tự hỏi Thầy «Con nên tu gì trước?» (mọi người chơi). Thưởng khi xong: Bổ Hành +5 vào Dụng (04-03 §3.2).

### 3.1 Dụng Mộc — «Gieo một cây»

```
[CẢNH STAT-CANH-BD-MOC · Lịch Đường, vườn ươm · giờ Mão · sương]
NGƯỜI TRÔNG VƯỜN (NPC phụ, 06 tạo): Thầy Tử Bình gửi người tới à? Lại một người cần Mộc.
NGƯỜI TRÔNG VƯỜN: Mộc không học được trong sách. Mộc là chờ. Con gieo ba hạt, mỗi sáng tưới, bảy ngày sau quay lại.
> Lựa chọn: ① «Bảy ngày lâu quá.» → [BD-MOC-a]  ② «Con gieo ở đâu?» → [BD-MOC-b]

[BD-MOC-a]
NGƯỜI TRÔNG VƯỜN: Cây trăm năm còn chờ được, con bảy ngày không chờ được à? Trong lúc chờ, đi giúp ta tỉa hàng rào. → [BD-MOC-b]

[BD-MOC-b]
NGƯỜI TRÔNG VƯỜN: Ở luống phía Đông. Phương Đông là phương của Mộc. Mỗi sáng tưới trước giờ Thìn — giờ Mão, giờ Dần là giờ của Mộc, cây nghe con rõ nhất.
(Nhiệm vụ: tưới 7 sáng; mỗi sáng tại vườn trong giờ Dần–Mão được tính là «việc bổ hành Mộc».)
[sau 7 sáng]
NGƯỜI TRÔNG VƯỜN: Mầm lên rồi. Mầm không cần con nữa — nhưng con vẫn sẽ quay lại xem nó. Đó là Mộc.
```

### 3.2 Dụng Hỏa — «Giữ một ngọn đèn»

```
[CẢNH STAT-CANH-BD-HOA · Văn Miếu, nhà đèn · giờ Dậu · gió nhẹ]
NGƯỜI GIỮ ĐÈN: Hỏa à. Người cần Hỏa thường nghĩ Hỏa là bùng lên. Không. Hỏa là giữ cho khỏi tắt.
NGƯỜI GIỮ ĐÈN: Ba đêm. Con giữ ngọn đèn ở bàn thờ Khổng Tử, gió vào thì che, dầu cạn thì châm.
> Lựa chọn: ① «Chỉ thế thôi ạ?» → [BD-HOA-a]  ② «Nếu đèn tắt?» → [BD-HOA-b]

[BD-HOA-a]
NGƯỜI GIỮ ĐÈN: Chỉ thế. Con thử ba đêm rồi nói «chỉ thế» lần nữa xem. → [BD-HOA-c]

[BD-HOA-b]
NGƯỜI GIỮ ĐÈN: Thì thắp lại. Đèn tắt không phải lỗi. Bỏ đi mới là lỗi. → [BD-HOA-c]

[BD-HOA-c]
(Ba đêm, mỗi đêm một lượt giữ đèn 3 phút thật; gió đến theo nhịp, chạm để che. Đèn tắt thì thắp lại, không mất tiến độ.)
NGƯỜI GIỮ ĐÈN: (đêm thứ ba) Con thấy chưa? Lửa của con không to. Nhưng nó không tắt.
```

### 3.3 Dụng Thổ — «Đắp một đoạn đường»

```
[CẢNH STAT-CANH-BD-THO · Manh Phái Cốc, đường lên cốc · giờ Mùi · nắng khô]
ĐỐC CÔNG ĐÁ (NPC phụ): Thổ là chịu. Đường này mưa nào cũng lở. Con đắp lại ba đoạn, mỗi đoạn mười viên đá.
> Lựa chọn: ① «Sao không làm một lần cho chắc?» → [BD-THO-a]  ② (xắn tay áo) → [BD-THO-b]

[BD-THO-a]
ĐỐC CÔNG ĐÁ: Làm một lần cho chắc thì đá không biết con. Làm ba lần, đá biết con, con biết đá. → [BD-THO-b]

[BD-THO-b]
(Ba đoạn, ba ngày khác nhau. Mỗi viên đá đặt đúng chỗ khi vạch rung dừng giữa — dung sai rộng, không có thất bại.)
ĐỐC CÔNG ĐÁ: (ngày thứ ba) Đường còn lở nữa. Nhưng giờ con biết đắp. Người biết đắp thì không sợ lở.
```

### 3.4 Dụng Kim — «Mài một con dao»

```
[CẢNH STAT-CANH-BD-KIM · Tử Bình Phong, lò rèn cũ · giờ Thân · trời trong]
THỢ RÈN GIÀ: Kim là cắt. Mà muốn cắt thì phải mài. Con dao này cùn mười năm rồi.
THỢ RÈN GIÀ: Mài ba buổi. Đừng mài nhanh — mài nhanh thì nóng, nóng thì lưỡi mềm.
> Lựa chọn: ① «Mài để làm gì?» → [BD-KIM-a]  ② (cầm đá mài) → [BD-KIM-b]

[BD-KIM-a]
THỢ RÈN GIÀ: Để cắt đúng chỗ. Người có Kim mà không mài thì cắt bừa. Người cần Kim như con thì phải học cắt đúng chỗ trước khi cắt mạnh. → [BD-KIM-b]

[BD-KIM-b]
(Ba buổi; nhịp mài theo nhịp thở. Không có thanh «quá nhiệt» trừng phạt — chỉ có tiếng thợ nhắc «chậm lại».)
THỢ RÈN GIÀ: (buổi thứ ba, thử lưỡi trên tờ giấy) Đứt gọn. Con cầm về. Không phải để dùng — để nhớ.
(Vật phẩm trang trí «Dao giấy mài tay».)
```

### 3.5 Dụng Thủy — «Đọc một quyển sách cũ»

```
[CẢNH STAT-CANH-BD-THUY · Thư Lâu Lâm, gác thứ ba · giờ Hợi · mưa nhỏ]
NGƯỜI GIỮ SÁCH: Thủy là chảy. Chữ trong sách cũng chảy, nếu con để yên cho nó chảy.
NGƯỜI GIỮ SÁCH: Quyển này mất mấy trang. Con đọc ba đêm, đêm thứ tư con kể cho ta phần mất là gì.
> Lựa chọn: ① «Làm sao con biết phần mất?» → [BD-THUY-a]  ② «Con đọc chậm lắm.» → [BD-THUY-b]

[BD-THUY-a]
NGƯỜI GIỮ SÁCH: Nước chảy qua chỗ trống vẫn biết chỗ trống hình gì. → [BD-THUY-c]

[BD-THUY-b]
NGƯỜI GIỮ SÁCH: Chậm thì nhớ lâu. Người cần Thủy thường chậm lúc đầu. Rồi một ngày nước tràn. → [BD-THUY-c]

[BD-THUY-c]
(Ba đêm đọc; đêm thứ tư chọn 1 trong 3 đoạn kết — mọi đoạn đều được nhận, mỗi đoạn mở một lời bình khác của người giữ sách.)
NGƯỜI GIỮ SÁCH: Con đoán khác người trước. Người trước cũng đoán khác người trước nữa. Sách này chưa bao giờ thiếu trang — nó chờ người đọc viết nốt.
```

## 4. Chuỗi Bổ Khuyết — 4 chương

### 4.1 Chương 1 «Thấy» — Thầy giảng trục yếu

```
[CẢNH STAT-CANH-BK-01 · Chính Đường · giờ Tỵ · trong]
THẦY TỬ BÌNH: (mở Sổ Mệnh ở trang Ngũ Duy) Năm cánh hoa. Cánh dài là việc con làm tự nhiên. Cánh ngắn — (chỉ cánh {truc_yeu})
{nếu điểm trục yếu = 0}
THẦY TỬ BÌNH: Cánh này không có. Lá số của con không mang sao này. Không có nghĩa con không làm được việc này — nghĩa là con phải học nó như người lạ học một thứ tiếng. Người học tiếng lạ thường nói chuẩn hơn người bản xứ.
{ngược lại}
THẦY TỬ BÌNH: Cánh này ngắn. Sách gọi là khuyết. Khuyết là chỗ trăng chưa tròn — chứ không phải chỗ trăng mất.
{hết}
> Lựa chọn: ① «Con có cần bổ không? Con thích cánh dài hơn.» → [BK-01a]  ② «Bổ thế nào ạ?» → [BK-01b]

[BK-01a]
THẦY TỬ BÌNH: Không cần. Thầy chỉ cho con biết. Người chỉ đi bằng chân khỏe thì đi được — nhưng đi lệch. → [BK-01b]

[BK-01b]
THẦY TỬ BÌNH: Đi tìm một người có cánh này dài nhất. Học người trước, học sách sau.
(Mở chương 2. Bản đồ hiện 3 NPC khách có trục trội đúng trục yếu của người chơi.)
```

### 4.2 Chương 2 «Học người» — 5 biến thể

Nội dung chung: người chơi gặp một NPC khách (lá số thật, `chartCache`) có trục trội đúng trục mình yếu, giúp NPC một việc nhỏ đúng sở trường của NPC; NPC thành «thầy phụ», mở nút 01 cây yếu miễn phí.

| Trục yếu | NPC mẫu (06 tạo) | Việc giúp | Câu then chốt của NPC |
|---|---|---|---|
| Tài (Thương đạo) | bà bán dầu ở chợ Huyền Thành | đứng quầy một buổi, đếm hàng | «Buôn không phải lừa. Buôn là biết thứ gì ở đâu thì quý.» |
| Quan (Trị đạo) | trưởng thôn ven Cùng Thông Hồ | ngồi nghe hai nhà tranh nhau bờ ruộng | «Xử không phải phán ai đúng. Xử là làm cho hai bên còn chào nhau được.» |
| Ấn (Học đạo) | thầy đồ già ở Văn Miếu | chép giúp mười trang sách mờ | «Học là để chữ đi qua mình mà không rơi mất.» |
| Thực (Nghệ đạo) | người làm đèn lồng ở Lịch Đường | dán giấy cho một chiếc đèn | «Đẹp không phải khéo tay. Đẹp là biết dừng đúng lúc.» |
| Tỷ (Đồng đạo) | nhóm khuân vác ở bến Tử Bình Phong | khiêng một kiệu hàng cùng ba người | «Một mình thì nhanh. Bốn người thì tới.» |

Mẫu thoại (Tài):

```
[CẢNH STAT-CANH-BK-02-TAI · chợ Huyền Thành, quầy dầu · giờ Thìn · đông người]
BÀ BÁN DẦU: Thầy Tử Bình gửi tới hả? Đứng đây. Khách hỏi giá thì nói giá, khách hỏi dầu nào thơm thì nói thật dầu nào thơm.
> Lựa chọn: ① «Nói thật thì bán được không?» → [BK-02-TAI-a]  ② (đứng vào quầy) → [BK-02-TAI-b]

[BK-02-TAI-a]
BÀ BÁN DẦU: Nói dối bán được một lần. Nói thật bán được cả đời. Đứng vào. → [BK-02-TAI-b]

[BK-02-TAI-b]
(Năm khách; mỗi khách một câu hỏi; mọi câu trả lời thật đều được tính. Câu trả lời «khéo» quá mức → bà nhắc, không trừ.)
BÀ BÁN DẦU: (cuối buổi, đếm tiền) Không nhiều. Nhưng năm người này sẽ quay lại. Ngày mai tới nữa không?
(«Thầy phụ: Bà bán dầu». Mở `STAT-ND-TAI-01` miễn phí.)
```

### 4.3 Chương 3 «Làm»

Không có cảnh riêng: năm hoạt động thuộc trục yếu (09 gắn thẻ). Mỗi lần xong, thầy phụ gửi một câu ngắn qua giấy truyền âm (xoay vòng 5 câu / trục). Ví dụ Đồng đạo: «Hôm nay con đi với ai?» · «Đi chậm vì chờ người khác không phải là chậm.» · «Có người cảm ơn con chưa?» · «Con có cảm ơn ai chưa?» · «Năm lần rồi. Giờ con có bạn.»

### 4.4 Chương 4 «Đón thời»

```
[CẢNH STAT-CANH-BK-04 · vùng hợp hành của trục yếu (04-03 §6.1) · ngày có can thuộc hành trục yếu]
THẦY PHỤ: (đã đợi sẵn) Hôm nay trời mang khí của sao con thiếu. Không phải ngày nào cũng có.
THẦY PHỤ: Không cần làm gì lớn. Thắp một nén hương, nói một câu con muốn nói với cái phần con chưa có.
> Lựa chọn (nhập tự do hoặc chọn): ① «Tôi sẽ học bạn.»  ② «Tôi không sợ bạn nữa.»  ③ «Chào bạn.»
THẦY PHỤ: Thế là xong. Từ hôm nay, cánh ngắn của con mọc nhanh nhất trong năm cánh.
(TM trục yếu +0,25 — 04-04 §2. Giọt sương trên cánh hoa ở Mệnh Bàn.)
```

Nếu người chơi không muốn chờ năm hợp: Lịch Đường chọn ngày (`zheri`) cho **ngày** có can hợp hành — thường trong vòng 10 ngày.

## 5. Cảnh lên cảnh giới 4 — Tiên Thiên thôi tính

```
[CẢNH STAT-CANH-CG4-01 · Chính Đường · giờ Tý · trăng]
(Tờ giấy dó năm xưa vẫn trên bàn. Mực đã khô.)
THẦY TỬ BÌNH: Con nhớ tờ này không? Bốn cột chữ ngày đầu.
THẦY TỬ BÌNH: (gấp tờ giấy làm tư, đặt vào hộp gỗ) Từ hôm nay, lá số không còn đứng trước con nữa. Nó đứng sau lưng con.
> Lựa chọn: ① «Nghĩa là sao ạ?» → [CG4-a]  ② «Con có còn cần nó không?» → [CG4-b]

[CG4-a]
THẦY TỬ BÌNH: Ba bậc đầu, thầy còn tính phần trời cho con. Từ bậc này, chỉ tính phần con tự làm. Người trời cho nhiều và người trời cho ít — tới đây đứng ngang nhau. → [CG4-c]

[CG4-b]
THẦY TỬ BÌNH: Cần. Như cần biết quê mình ở đâu. Nhưng không ai đi đường bằng cách nhìn quê. → [CG4-c]

[CG4-c]
{nếu Phẩm căn PC1 và đang ở chuỗi Khổ tận cam lai}
THẦY TỬ BÌNH: Cây đào sau núi của con ra hoa rồi đấy. Thầy đi ngang thấy.
{hết}
(Danh hiệu theo đạo: «Luyện Khí Hóa Thần» / «Định» / «Hiền Nhân». Trên Mệnh Bàn, vòng Căn Cơ quanh tâm mờ đi, vòng Đạo Hạnh sáng lên.)
```

## 6. Cảnh «đọc lại lá số» (engine nâng cấp ở ranh mùa)

```
[CẢNH STAT-CANH-DL-01 · Chính Đường · ngày đầu mùa mới · mưa xuân]
THẦY TỬ BÌNH: Mùa này thầy đọc lại sách. Có mấy chỗ năm ngoái thầy tính chưa kỹ.
THẦY TỬ BÌNH: (đặt hai tờ giấy cạnh nhau) Tờ cũ, tờ mới. Con xem chỗ khác.
(Ngăn «Vì sao?» mở ở chế độ hai cột trước / sau.)
> Lựa chọn: ① «Thầy tính sai à?» → [DL-a]  ② «Có ảnh hưởng gì không?» → [DL-b]

[DL-a]
THẦY TỬ BÌNH: Người đọc sách cả đời vẫn đọc sai. Ai bảo con mình không bao giờ sai thì con nên đi chỗ khác hỏi. → [DL-b]

[DL-b]
THẦY TỬ BÌNH: Những gì con đã tu, giữ nguyên. Chỉ cái bản đồ lúc con mới sinh là vẽ lại cho đúng hơn.
[đóng]
```

## 7. Cảnh Sửa bát tự

```
[CẢNH STAT-CANH-SB-01 · Cổng Sơn Môn · bất kỳ]
LÃO TÙNG: Sửa ngày giờ à? Được. Lão chỉ hỏi một câu.
LÃO TÙNG: Con sửa vì biết đúng hơn, hay vì muốn đẹp hơn?
> Lựa chọn: ① «Con mới hỏi được giờ sinh thật.» → [SB-a]  ② «Con nhập nhầm.» → [SB-a]  ③ «Con muốn thử giờ khác.» → [SB-b]

[SB-a]
LÃO TÙNG: Vậy thì sửa. (đưa bút) Những gì con đã làm không mất. Chỉ có cái áo có thể đổi màu.
(Hộp xác nhận liệt kê thay đổi — 04-11 §9.2.) [đóng]

[SB-b]
LÃO TÙNG: Lá số thật mới dùng được. Lá số đẹp mà không phải của con thì con tu cho ai?
LÃO TÙNG: Muốn xem lá số khác thì vào Bàn Thầy mà xem, thầy cho xem cả trăm lá. Còn cái này là của con.
> Lựa chọn: ① «Vâng, con giữ lá cũ.» → [đóng]  ② «Con vẫn muốn sửa.» → [SB-a]
```

## 8. Checklist nghiệm thu phần 04-14

- [ ] Mỗi cảnh có điều kiện kích hoạt rõ và điểm quay về luồng chính.
- [ ] Không câu nào đọc con số Tiềm Lực; không câu nào phán tương lai đời thật.
- [ ] Cảnh từ chối Nghịch Thiên không có tín hiệu thất bại.
- [ ] Mọi minigame trong cảnh không có thất bại vĩnh viễn (đèn tắt thì thắp lại, đá lệch thì đặt lại).
- [ ] Biến `{…}` có giá trị cho mọi lá số (kể cả `dungPhu` rỗng, Ngũ Duy lỗi).
