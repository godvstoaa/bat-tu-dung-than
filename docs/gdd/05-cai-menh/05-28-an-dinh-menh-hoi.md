# 05-28 · Chín án Định Mệnh Hội — kịch bản vạch mặt (DEED-146 … 154)

> Bản sơ đồ, Hồi II: Định Mệnh Hội mở «quầy đổi mệnh» ở từng vùng; mỗi vùng một án lừa đảo; người chơi dùng **kiến thức thật** để vạch mặt; dữ liệu chống lừa của app (`anti-manipulation-data › detectionPatterns`) là «sách giáo khoa». Phần này viết đủ chín án gắn chín DEED khuyên thiện ×3 (05-04 §11).
> Khung chung mỗi án — 4 bước: **Nghe** lời phán → **Tra** engine thật (một màn tra cứu trong game, dùng đúng hàm app) → **Đối chất** (chọn bằng chứng) → **Chăm nạn nhân** (giải thích, dẫn tới đúng thầy). Không có bước đánh, đuổi, phạt kẻ lừa: kẻ lừa dọn quầy khi đám đông đã hiểu.
> Mẫu thao túng (để người viết lời lừa): dọa (tai họa, chết), khẩn cấp («phải làm ngay hôm nay»), khẳng định tuyệt đối («chắc chắn»), đòi tiền giải, hạ thấp người khác («thầy khác không biết»), độc quyền bí mật («sách cấm»). Lời lừa luôn chứa ít nhất hai mẫu.

---

## 1. Thái Tuế 10 lượng (DEED-146 · `thanh`)

```
[CẢNH DEED-146.1 · Huyền Thành, chợ · sáng]
THẦY GIẢ: (gõ quạt lên bàn) Ông tuổi Thân, năm nay phạm Thái Tuế nặng nhất trong mười hai con! Không cúng mười lượng vàng trước Rằm thì tai họa đổ máu!
ÔNG LÃO (tuổi Thân): (run) Mười lượng… tôi bán con trâu cũng không đủ.
> Bước Tra: mở «Bảng Thái Tuế năm nay» (`taSuiTable('午')`) — dòng Thân: không có kiểu phạm nào.
> Bước Đối chất — chọn bằng chứng: ① bảng Thái Tuế năm Ngọ ② lá số của ông lão ③ «tôi thấy ông ta gian»
(③ không phải bằng chứng — đám đông không tin. ② dùng được nhưng chậm. ① là bằng chứng gọn nhất.)
NGƯỜI CHƠI: Năm nay là năm Ngọ. Bảng treo ngay trong Thái Tuế Điện: tuổi Thân không phạm gì — không trị, không xung, không hình, không phá, không hại.
THẦY GIẢ: Bảng ấy sai! Thầy ở điện không biết!
NGƯỜI CHƠI: Thế mời ông vào điện, đứng trước bảng mà nói.
(Đám đông quay sang thầy giả. Hắn dọn quầy.)
> Bước Chăm: dẫn ông lão vào Thái Tuế Điện, người giữ đèn nói: «Năm nay ông bình an. Thắp đèn thì thắp vì muốn, không phải vì sợ.»
ÔNG LÃO: Thế là… con trâu nhà tôi còn.
```

## 2. Bùa đổi cách cục (DEED-147 · `tubinh`)

```
[CẢNH DEED-147.1 · Tử Bình Phong, cổng sảnh Cách Cục · trưa]
NGƯỜI BÁN BÙA: Cách cục cô bại! Bại thì cả đời lận đận! Lá bùa này đổi bại thành thành, chỉ có ở đây, ba lượng.
CÔ GÁI: Thầy bên trong bảo cách tôi «có cứu»…
NGƯỜI BÁN BÙA: Thầy bên trong không biết bí pháp!
> Bước Tra: xem lá số cô gái ở sảnh (`patternQuality`): «有救» — có bệnh, có thuốc; `rescues` chỉ vị Ấn.
> Bước Đối chất: ① «Cách cục là tám chữ lúc sinh» ② lá bùa không có đảm, không có chân (so cấu trúc 5 đoạn) ③ «bùa này in hàng loạt»
NGƯỜI CHƠI: (với ①) Cách cục đọc từ giờ sinh. Không ai đổi được giờ cô sinh ra. (với ②) Mà lá bùa này thiếu cả đảm lẫn chân — phù thật cũng không ai bán kiểu ấy.
> Bước Chăm: dẫn cô vào sảnh; chủ sảnh giảng vị Ấn: «học, có người che chở». Gợi ý cô tới Văn Miếu.
CÔ GÁI: Học thì tôi học được. Không cần ba lượng.
```

## 3. Thầy mù giả (DEED-148 · `manh`)

```
[CẢNH DEED-148.1 · Manh Phái Cốc, ven đường · chiều]
THẦY MÙ GIẢ: (đeo kính đen, liếc trộm) Tài của bà bị chôn dưới đất tổ! Phải làm lễ đào lên, năm lượng!
BÀ BÁN VẢI: Thảo nào buôn mãi không lên.
> Bước Tra: sảnh Tượng Pháp đọc `analyzeMangpai` của bà: «✓ Tài tinh tọa chủ vị → tài về tay mình».
> Bước Đối chất: ① đọc ghi chú Manh phái thật ② nhờ thầy bói mù lớn tuổi thật của Cốc xác nhận ③ giật kính hắn
(③ không có trong lựa chọn — chỉ ① ②.)
THẦY MÙ THẬT: (chống gậy tới) Manh phái nói tài tọa chủ vị là tài về tay. Không có chuyện chôn. Mà anh kia… mắt anh nhìn rõ hơn tôi đấy.
(Đám đông cười. Kẻ giả bỏ đi.)
> Bước Chăm: chủ sảnh Tượng Pháp gợi ý cho bà: «Manh phái nói hợp là công lớn — bà rủ người cùng làng góp hàng mà bán.»
```

## 4. Đá Tử Vi (DEED-149 · `trichthien`)

```
[CẢNH DEED-149.1 · Trích Thiên Đỉnh, bậc đá · sáng]
NGƯỜI BÁN ĐÁ: Cung Mệnh anh có sao xấu chiếu! Viên đá này đè sao, bảy lượng. Mua ngay hôm nay kẻo sao vào hạn!
CHÀNG TRAI: Bảy lượng là cả tháng lương.
> Bước Tra: sảnh Tử Vi lập lá số chàng trai (`ziwei`): cung Mệnh có sao gì, ý nghĩa thật (có mặt tốt, mặt cần để ý).
> Bước Đối chất: ① sao trong cung không dời được bằng vật ② lời «mua ngay hôm nay» là mẫu thúc ép ③ cả hai
NGƯỜI CHƠI: Sao trong cung là vị trí lúc anh sinh. Viên đá không dời được nó. Còn ai bắt anh quyết trong hôm nay là đang sợ anh nghĩ kỹ.
> Bước Chăm: dẫn chàng trai vào sảnh; thầy đọc cung Mệnh: «Sao này cứng, làm việc gì cũng dốc hết. Biết nghỉ thì tốt.»
```

## 5. Nhà phạm sát phải đập (DEED-150 · `phongthuy`)

```
[CẢNH DEED-150.1 · Phong Thủy Viên, nhà dân · trưa]
THẦY GIẢ: Bức tường này chém thẳng vào cửa sổ — sát! Phải đập, xây lại, tôi lo trọn gói hai mươi lượng!
CHỦ NHÀ: Đập tường thì nhà tôi sập mất một góc.
> Bước Tra: sảnh Dương Trạch nhận diện sát: góc nhọn nhà đối diện chiếu cửa sổ — 尖角煞; `cures`: rèm dày, cây xanh cao, gương bát quái, thạch anh.
> Bước Đối chất: ① cách hóa nhẹ trong sách ② giá «trọn gói» ③ hỏi hắn sát tên gì
THẦY GIẢ: (với ③) Sát… sát… sát tường!
NGƯỜI CHƠI: Đây là sát góc nhọn. Sách dạy treo rèm, đặt cây. Không sách nào dạy đập nhà.
> Bước Chăm: người chơi cùng chủ nhà đặt chậu cây cao ở bệ cửa sổ (DEED-062 kiểu).
CHỦ NHÀ: Cây này đẹp. Mà đỡ chói thật.
```

## 6. Ngày cưới đại hung (DEED-151 · `lichduong`)

```
[CẢNH DEED-151.1 · Lịch Đường · sáng]
THẦY GIẢ: Ngày mồng sáu là ngày đại hung với tuổi hai đứa! Cưới là ly tán! Cúng giải ba lượng thì cưới được.
ĐÔI TRẺ: (nắm tay nhau, lo)
> Bước Tra: sảnh Trạch Nhật chạy `evaluateDate` cho hoạt động cưới, với chi năm của cả hai.
(Kết quả: ngày đạt mức tốt cho cưới, không xung tuổi ai.)
> Bước Đối chất: ① bảng chấm ngày ② «nếu hung thật, cúng thì hết hung sao?»
NGƯỜI CHƠI: (với ②) Nếu ngày hung thật thì ông bảo đổi ngày, chứ sao lại bảo cúng tiền?
> Bước Chăm: chủ sảnh đưa đôi trẻ tờ lịch ba ngày tốt khác để chọn nếu vẫn muốn yên tâm.
CÔ DÂU: Chúng em vẫn chọn mồng sáu. Ngày ấy hai đứa gặp nhau.
```

## 7. Lá số lạnh uống thuốc nóng (DEED-152 · `cungthong`)

```
[CẢNH DEED-152.1 · Cùng Thông Hồ, bến đò · chiều]
NGƯỜI BÁN THUỐC: Lá số cậu hàn lạnh, Thủy vượng! Phải uống thang thuốc nóng này ba tháng, không thì sinh bệnh!
NGƯỜI LÁI ĐÒ: Tôi có thấy ốm đâu.
> Bước Tra: sảnh Điều Hậu đọc điều hậu lá số (`han-nuan`): khí hậu lá số «lạnh» — ý nghĩa mệnh lý (cần hành Hỏa điều hòa trong vận, việc, môi trường).
> Bước Đối chất: ① điều hậu nói về khí hậu lá số, không phải bài thuốc ② ai bán thuốc theo lá số là đang chẩn bệnh không có quyền ③ cả hai
NGƯỜI CHƠI: Lá số lạnh nghĩa là anh hợp những việc, những năm có Hỏa. Không có sách nào bảo uống thuốc theo tám chữ. Ốm thì đi thầy thuốc.
> Bước Chăm: Vu y bà A Mậu (nếu đã gặp) gửi lời: «Thuốc phải do người khám mới cho. Bà còn không dám bán thuốc theo lá số.»
```

## 8. Sách cấm đổi mệnh (DEED-153 · `thulau`)

```
[CẢNH DEED-153.1 · Thư Lâu Lâm, gốc cây · trưa]
NGƯỜI BÁN SÁCH: «Đạo Tạng bí bản» — quyển cấm, ai đọc là đổi mệnh! Mười lượng, chỉ còn một quyển!
SĨ TỬ: Quyển gì mà ghê vậy?
> Bước Tra: thủ thư mở danh mục Đạo Tạng của thư khố (dữ liệu `DAOZANG`, 1.500+ mục): không có quyển nào tên ấy; nội dung trang đầu chép lẫn Đạo Đức Kinh với lời quảng cáo.
> Bước Đối chất: ① danh mục ② trang đầu chép Đạo Đức Kinh («道可道，非常道») ③ «chỉ còn một quyển» là thúc ép
NGƯỜI CHƠI: Trang đầu là Đạo Đức Kinh — ai cũng đọc được miễn phí ở Thư Lâu. Không có kinh nào «đọc là đổi mệnh».
> Bước Chăm: thủ thư cho sĩ tử mượn Đạo Đức Kinh thật; Tế tửu nhắn: «Sách không đổi mệnh. Người đọc sách thì đổi.»
```

## 9. Hợp hôn khắc, phải chia tay (DEED-154 · `thanh`)

```
[CẢNH DEED-154.1 · Huyền Thành, Bàn Hợp Hôn · tối]
BÀ MAI GIẢ: Hai đứa này tuổi khắc nhau như nước với lửa! Lấy nhau thì một đứa chết sớm! Chia tay đi, hoặc làm lễ hóa giải năm lượng.
ĐÔI TRẺ: …
> Bước Tra: Bàn Hợp Hôn chạy `computeHehun` cho hai lá số: mức vừa, có điểm bù nhau, có điểm cần nhường.
> Bước Đối chất: ① kết quả hợp hôn thật ② «một đứa chết sớm» là lời dọa — không sách nào nói chắc thế ③ cả hai
NGƯỜI CHƠI: Bàn chấm hai người ở mức vừa — có chỗ khác nhau thì học nhường nhau. Không ai phải chia tay vì tám chữ. Còn câu «chết sớm» — không thầy thật nào nói câu ấy.
> Bước Chăm: thầy Hợp Hôn đọc cho đôi trẻ phần «cách hòa hợp».
CHÀNG TRAI: Vậy em vẫn cưới cô ấy nhé.
CÔ GÁI: Hỏi em à? (cười)
```

---

## 10. Luật chung của chín án

| # | Luật |
|---|---|
| ĐMH-1 | Bước Tra luôn dùng **đúng hàm engine** của sảnh (`taSuiTable`, `patternQuality`, `analyzeMangpai`, `ziwei`, `fs-cure`, `zheri`, `han-nuan`, `DAOZANG`, `computeHehun`) — chống «game bịa». |
| ĐMH-2 | Nạn nhân là NPC có lá số sinh (như `halls.js › makeNpc`); kết quả tra là thật cho lá số đó. Nếu lá số sinh ra **trùng** với lời lừa (vd tuổi đó phạm thật), máy sinh án đổi NPC — án luôn là lừa. |
| ĐMH-3 | Lựa chọn «bằng chứng» yếu (cảm tính) không thắng; game dạy dùng dữ liệu. |
| ĐMH-4 | Không có bạo lực, không đuổi đánh kẻ lừa; kẻ lừa rời đi khi đám đông hiểu. Tài liệu 03 có thể cho kẻ lừa xuất hiện lại ở vùng khác (cùng tổ chức). |
| ĐMH-5 | Mỗi án một lần đời; DEED +1 × 3 công. Sau án, quầy vùng đó đóng; NPC nạn nhân có thoại mới cảm ơn. |
| ĐMH-6 | Bản iOS: ẩn án 1 (Thái Tuế Điện tắt trên iOS — `features.js › IOS_OFF`). Tám án còn lại giữ vì các sảnh nghề tương ứng có mặt trên iOS như nơi **học** cổ pháp; lời thoại iOS bỏ mọi câu đoán vận năm của nạn nhân. |
