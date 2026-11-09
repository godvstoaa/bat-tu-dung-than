# 04-16 · Đặc Tính — móc nhiệm vụ `PERK-*/Q*` và ải kiếp số

## 0. Quy ước

- Mỗi Đặc Tính có **một móc** `PERK-<sao>/Q1` (một số sao có thêm `/Q2`). Móc là nhiệm vụ phụ ngắn (15–40 phút), mở khi điều kiện đạt; 03 cấp mã `SQ-<region>-xx` tương ứng.
- Thưởng chuẩn của móc: 40 công tu × NT + một vật phẩm trang trí + thoại riêng mở với NPC liên quan. Không móc nào cộng chỉ số Tiên Thiên.
- Bậc II của sao: móc có thêm một bước «sâu» (ghi ở cột «Bậc II»).
- Thoại theo quy ước 04-14 §0.

## 1. Nhóm quý nhân và đức

### `PERK-tianYi/Q1` — «Người lạ trên bậc đá»

| Mục | Nội dung |
|---|---|
| Mở | ngày thứ 3 sau nhập môn |
| Nơi | bậc đá Sơn Môn → Thư Lâu Lâm |
| Bước | 1) một ông lão ngồi nghỉ trên bậc thứ 99, nhờ dìu lên · 2) ông lão hỏi đường tới Thư Lâu Lâm, người chơi dẫn · 3) tới nơi, ông lão là cựu giữ sách của Sơn Môn, trao chìa khóa một ngăn sách |
| Bậc II | bước 4: ông lão quay lại sau 7 ngày, mời đi xem một kệ sách cấm (mở sớm `STAT-ND-AN-09`) |
| Thưởng | chìa khóa đồng (trang trí), thoại «quý nhân» với ông lão vĩnh viễn |

```
[CẢNH PERK-tianYi/Q1 · bậc đá Sơn Môn, bậc 99 · giờ Thân · nắng xiên]
ÔNG LÃO: Cậu… cô… cho lão vịn một tay. Già rồi, bậc cứ dài ra.
> ① (đưa tay) → [a]  ② «Cụ đi đâu ạ?» → [a]
[a]
ÔNG LÃO: Lên Thư Lâu. Bốn mươi năm trước lão giữ sách ở đó. Giờ chẳng ai nhớ mặt.
(Đi cùng; ông lão kể một chuyện mỗi đoạn đường.)
ÔNG LÃO: (tới cửa Thư Lâu, rút chìa khóa) Ngăn thứ bảy, hàng dưới. Lão giữ chìa bốn mươi năm, đợi người dìu lão lên.
ÔNG LÃO: Người ta tưởng quý nhân là người đi trước dắt mình. Quý nhân thường là người mình dắt.
```

### `PERK-tianDe/Q1` — «Ngọn đèn không tắt»

| Mục | Nội dung |
|---|---|
| Mở | cảnh giới 2 |
| Nơi | miếu Thổ Địa ven đường Huyền Thành → Manh Phái Cốc |
| Bước | giữ đèn miếu 7 đêm (một lượt ngắn mỗi đêm); đêm thứ 4 có người tới xin dầu — cho hay không cho đều được, nhưng nếu cho thì đêm 5 có người mang dầu tới trả gấp đôi |
| Bậc II | — (Thiên Đức không có bậc II theo chi; tra can/chi tháng) |
| Thưởng | đèn miếu nhỏ cho nhà riêng; mở sớm `STAT-ND-TY-06` |

```
[CẢNH PERK-tianDe/Q1 · miếu Thổ Địa · đêm thứ tư · mưa]
NGƯỜI ĐÀN BÀ: Cho tôi xin chút dầu. Nhà có người ốm, tối quá.
> ① (chia nửa bình dầu) → [b]  ② «Dầu này của miếu.» → [c]
[b]
NGƯỜI ĐÀN BÀ: (cúi đầu, đi vội)
(Đêm thứ năm: bình dầu đầy đặt sẵn trước miếu, kèm một nắm hoa dại.)
[c]
NGƯỜI ĐÀN BÀ: Phải. Của miếu. (đi)
(Đêm thứ năm: không có gì. Đêm thứ bảy đèn vẫn sáng — nhiệm vụ vẫn xong.)
THỔ ĐỊA (giọng từ tượng, chỉ đêm thứ bảy): Đèn của ta không tắt. Còn đèn của ngươi?
```

### `PERK-yueDe/Q1` — «Rằm của người khác»

| Mục | Nội dung |
|---|---|
| Mở | rằm âm lịch đầu tiên sau cảnh giới 2 (theo lịch thật) |
| Nơi | xóm chài Cùng Thông Hồ |
| Bước | gom bánh từ 3 nhà, thắp đèn lồng, kể một chuyện cho trẻ con (chọn 1 trong 3 chuyện) |
| Thưởng | đèn lồng cá chép; NPC xóm chài thiện cảm +10 |

### `PERK-tianDeHe/Q1` — «Lời xin lỗi gửi muộn»

| Mục | Nội dung |
|---|---|
| Mở | sau lần đầu người chơi nhận nghiệp do lỡ chọn sai (05) |
| Nơi | nơi xảy ra lựa chọn sai |
| Bước | quay lại gặp NPC bị ảnh hưởng; chọn cách sửa (3 cách, mỗi cách một kết) |
| Thưởng | thoại «hòa giải» với NPC đó; lần sám hối đầu tuần ×1,3 (đã là hiệu ứng sao) |

```
[CẢNH PERK-tianDeHe/Q1 · tùy nơi · bất kỳ]
NPC: Lại là ngươi.
> ① «Tôi tới xin lỗi.»  ② «Tôi tới sửa.»  ③ «Tôi tới nghe.»
NPC (theo lựa chọn): ① Xin lỗi thì ai cũng nói được. ② Sửa gì? Để xem. ③ … (im lâu) Ngồi xuống.
(Mỗi nhánh một việc nhỏ; mọi nhánh đều kết thúc hòa giải — khác nhau ở câu cuối của NPC.)
```

### `PERK-yueDeHe/Q1` — «Chén trà ba người»

| Mục | Nội dung |
|---|---|
| Mở | khi người chơi có 2 NPC đang thiện cảm thấp với nhau (06 theo dõi) |
| Nơi | quán trà Huyền Thành |
| Bước | mời cả hai tới cùng một bàn; ngồi giữa, rót trà đúng thứ tự (tuổi), không nói gì về chuyện cũ |
| Thưởng | hai NPC thôi giận nhau; bộ chén trà |

### `PERK-dexiu/Q1` — «Bia không chữ»

| Mục | Nội dung |
|---|---|
| Mở | cảnh giới 3 |
| Nơi | bãi mộ vô danh dưới chân Phong Đô (lối vào an toàn, không phải Âm ty) |
| Bước | hỏi 3 NPC già ở các vùng về người đã nằm đó; viết một bài văn bia ngắn từ những gì nghe được |
| Thưởng | bia khắc tên người chơi là «người soạn»; thư pháp +15% (hiệu ứng sao) có thêm thoại ở Văn Miếu |

```
[CẢNH PERK-dexiu/Q1 · bãi mộ vô danh · giờ Thân · gió heo may]
PHU MỘ: Không ai biết họ là ai. Chiến loạn, dịch, lũ… Người ta chôn rồi quên.
PHU MỘ: Ngươi muốn viết bia? Viết gì khi không biết tên?
> ① «Viết điều mọi người còn nhớ.» → (đi hỏi 3 NPC)  ② «Viết cho người sau đọc.» → (đi hỏi 3 NPC)
(Sau khi hỏi: người chơi ghép 3 câu nghe được thành văn bia; hệ thống chấp nhận mọi tổ hợp.)
PHU MỘ: (đọc) Không tên. Mà đọc lên thấy có người.
```

### `PERK-tianShe/Q1` — «Ngày trời mở»

| Mục | Nội dung |
|---|---|
| Mở | ngày can chi Thiên Xá của mùa hiện tại (Xuân 戊寅, Hạ 甲午, Thu 戊申, Đông 甲子) — Thái Tuế Điện báo trước 3 ngày |
| Nơi | Thái Tuế Điện (`thaitue.js`) |
| Bước | dâng một ngọn đèn cho **người khác** (người chơi chọn tên một NPC hoặc bạn) |
| Thưởng | «Đại Xá» mùa này (hiệu ứng sao); danh hiệu «Người Được Xá» lần đầu |

### `PERK-guoYin/Q1` — «Con dấu thất lạc»

| Mục | Nội dung |
|---|---|
| Mở | khi người chơi thuê/mua nhà riêng |
| Nơi | Huyền Thành, nha môn cũ |
| Bước | tìm con dấu của nha môn rơi ở 3 nơi (manh mối từ sổ sách); trả lại cho viên thư lại |
| Bậc II | viên thư lại nhờ giữ dấu hộ 7 ngày; người chơi đóng dấu cho 3 giấy tờ đúng luật (1 giấy sai — nhận ra thì được thêm thoại) |
| Thưởng | mở sớm `STAT-ND-QUAN-08`; con dấu gỗ (trang trí bàn) |

## 2. Nhóm học vấn và trí

### `PERK-wenChang/Q1` — «Ngọn bút của Tế tửu»

| Mục | Nội dung |
|---|---|
| Mở | trước Hương Thí |
| Nơi | Văn Miếu, nhà bia |
| Bước | Tế tửu đánh rơi bút; tìm thấy kèm một tờ đề thi cũ; người chơi chọn trả bút **và** tờ đề, hay chỉ trả bút |
| Bậc II | nếu trả cả hai: Tế tửu cho ngồi chấm thử 3 bài thi của NPC |
| Thưởng | bút lông Văn Miếu (trang trí); thoại riêng với Tế tửu |

```
[CẢNH PERK-wenChang/Q1 · Văn Miếu, nhà bia · giờ Thìn · nắng]
(Người chơi nhặt được cây bút và một tờ giấy gấp tư: đề Hương Thí năm nay.)
> ① (trả cả hai, nói rõ đã thấy tờ đề) → [a]  ② (trả bút, giữ tờ đề) → [b]  ③ (trả cả hai, không nói gì) → [a2]
[a]
TẾ TỬU: (nhìn tờ đề, nhìn người chơi) Đọc chưa? — Chưa à. Vậy năm nay ta đổi đề. Ngồi đây, chấm với ta ba bài.
[a2]
TẾ TỬU: Ngươi không đọc. Ta biết vì nếp gấp còn nguyên. Ngồi đây.
[b]
TẾ TỬU: Cảm ơn. (Khi người chơi dự Hương Thí: đề đã đổi. Tờ đề cũ trong túi hóa thành giấy nháp. Không phạt, không nhắc.)
```

### `PERK-xueTang/Q1` — «Lớp học dưới gốc đa»

| Mục | Nội dung |
|---|---|
| Mở | cảnh giới 2 |
| Nơi | làng ven Lịch Đường |
| Bước | dạy 3 đứa trẻ đọc 3 chữ (người chơi chọn chữ trong danh sách: 人, 心, 道, 水, 山…); mỗi đứa trẻ hỏi một câu khó |
| Thưởng | bảng gỗ có chữ trẻ con viết (trang trí); Học đạo +8% (hiệu ứng sao) mở thêm thoại với thầy đồ |

### `PERK-ciGuan/Q1` — «Bài phú đề tường»

| Mục | Nội dung |
|---|---|
| Mở | sau Hương Thí |
| Nơi | quán rượu Huyền Thành, bức tường đề thơ |
| Bước | đọc 5 bài thơ khách cũ đề trên tường; viết một câu họa bài mình thích nhất |
| Thưởng | câu thơ của người chơi lưu trên tường (MMO: người khác đọc được, ký tên tùy chọn) |

### `PERK-taiJi/Q1` — «Bàn cờ không quân»

| Mục | Nội dung |
|---|---|
| Mở | cảnh giới 2 |
| Nơi | Võ Đang, Thái Cực điện |
| Bước | một đạo sĩ ngồi trước bàn cờ trống, hỏi «cờ này ai thắng?» — ba câu trả lời đều đúng, mỗi câu mở một đoạn giảng (âm dương, vô cực, động tĩnh) |
| Thưởng | quân cờ trắng/đen (trang trí); mở sớm `STAT-ND-AN-08` |
| Ghi chú | 80,4% người chơi có Thái Cực → móc này gần như ai cũng gặp; giữ ngắn |

```
[CẢNH PERK-taiJi/Q1 · Thái Cực điện · giờ Tý · tĩnh]
ĐẠO SĨ GIÀ: Bàn cờ này chưa có quân. Ai thắng?
> ① «Chưa ai.» → [a]  ② «Cả hai.» → [b]  ③ «Bàn cờ.» → [c]
[a] ĐẠO SĨ GIÀ: Chưa có gì thì chưa có thắng thua. Vô cực. Ngồi xuống.
[b] ĐẠO SĨ GIÀ: Đen sinh trắng, trắng sinh đen. Thái cực. Ngồi xuống.
[c] ĐẠO SĨ GIÀ: (cười lớn) Lâu lắm mới có người nói vậy. Ngồi xuống.
(Cả ba nhánh dẫn tới cùng một buổi giảng ngắn; câu mở đầu khác nhau.)
```

### `PERK-shiLing/Q1` — «Câu đố của con quạ»

| Mục | Nội dung |
|---|---|
| Mở | ngẫu nhiên khi người chơi đi qua rừng (một lần) |
| Nơi | bất kỳ vùng có rừng |
| Bước | một con quạ biết nói đố 3 câu (câu đố chữ Hán chiết tự, có gợi ý hình); trả lời sai thì quạ đố câu khác |
| Thưởng | lông quạ (trang trí); «linh cảm» đầu tiên của ngày được tặng kèm |

### `PERK-sanQi/Q1` — «Ba chiếc chìa»

| Mục | Nội dung |
|---|---|
| Mở | khi người chơi đã gặp 3 người dẫn của 3 đạo thống khác nhau |
| Nơi | Côn Lôn (chỉ nhìn từ xa) → 3 thánh địa |
| Bước | mỗi người dẫn đưa một chiếc chìa (Đạo, Phật, Nho); ba chìa mở một hộp ở Thư Lâu Lâm — trong hộp là tờ giấy «Một» |
| Thưởng | hộp gỗ ba ổ khóa (trang trí); nếu lá số có Thiên Ất / Thiên Đức / Nguyệt Đức: hộp có thêm một lá thư của người dẫn thứ tư (gợi ý «Quy nhất») |

## 3. Nhóm lộc và của

### `PERK-luShen/Q1` — «Bát cơm đầu mùa»

| Mục | Nội dung |
|---|---|
| Mở | đầu mỗi mùa (tiết Lập Xuân, Lập Hạ, Lập Thu, Lập Đông theo lịch thật) |
| Nơi | bếp Sơn Môn |
| Bước | nấu nồi cơm mới đầu mùa, chia cho 5 người (NPC hoặc người chơi) |
| Bậc II | chia cho 8 người; người thứ 8 là một khách lạ để lại một «lộc» |
| Thưởng | «lộc» tuần (hiệu ứng sao); mở sớm `STAT-ND-TAI-06` sau lần đầu |

### `PERK-tianChu/Q1` — «Cỗ chay cho làng»

| Mục | Nội dung |
|---|---|
| Mở | trước một sự kiện lễ (`EV-*`) |
| Nơi | làng gần nhất với sự kiện |
| Bước | hái 3 loại rau theo mùa (hành theo mùa — 04-03 §6.3); nấu 3 món; bày cỗ |
| Bậc II | cỗ có thêm một món «trời cho»: mở công thức đặc biệt |
| Thưởng | công thức nấu (hồi Nguyên Khí); mở sớm `STAT-ND-TAI-08` |

### `PERK-jinYu/Q1` — «Chiếc xe bỏ quên»

| Mục | Nội dung |
|---|---|
| Mở | cảnh giới 2 |
| Nơi | trạm ngựa Lịch Đường |
| Bước | sửa một cỗ xe gỗ cũ (3 bộ phận, mỗi bộ phận lấy ở một vùng khác hành) |
| Bậc II | đánh xe chở một đoàn hành hương tới Bút Tháp |
| Thưởng | xe kéo trang trí ở nhà riêng; trạm đi nhanh miễn phí (hiệu ứng sao) |

## 4. Nhóm quyền và đi

### `PERK-jiangXing/Q1` — «Đội tuần đêm»

| Mục | Nội dung |
|---|---|
| Mở | cảnh giới 2 |
| Nơi | Huyền Thành, đêm hội |
| Bước | dẫn 3 NPC (hoặc người chơi) đi tuần, phân công ba hướng; xử một vụ lạc trẻ |
| Bậc II | dẫn đội 5 người, xử thêm một vụ cãi nhau |
| Thưởng | đèn tuần (trang trí); mở sớm `STAT-ND-QUAN-04` |

### `PERK-yiMa/Q1` — «Mười hai trạm»

| Mục | Nội dung |
|---|---|
| Mở | khi đã mở ≥ 6 thánh địa |
| Bước | đóng dấu ở trạm của 12 thánh địa trong **một mùa** (năm can chi) |
| Bậc II | đóng dấu 12 trạm trong một tháng âm |
| Thưởng | sổ hành hương 12 dấu; danh hiệu «Dịch Mã» |

### `PERK-yiMa/Q2` — «Lá thư không người nhận»

| Mục | Nội dung |
|---|---|
| Mở | sau Q1 |
| Bước | mang một lá thư cũ từ trạm Lịch Đường đi tìm người nhận qua 4 vùng; người nhận đã mất, gia đình nhận thay |
| Thưởng | thoại với gia đình đó; không vật phẩm |

## 5. Nhóm giao tế và thẩm mỹ

### `PERK-taoHua/Q1` — «Cây đào giữa chợ»

| Mục | Nội dung |
|---|---|
| Mở | mùa xuân (tiết Lập Xuân → Lập Hạ) |
| Nơi | chợ Huyền Thành |
| Bước | cây đào cổ giữa chợ sắp bị chặt làm đường; người chơi thuyết phục 5 NPC ký tên giữ cây (mỗi NPC một cách thuyết phục; Đào Hoa mở lựa chọn «mời trà») |
| Thưởng | cây được giữ; mở sớm `STAT-ND-TY-02` |

### `PERK-hongYan/Q1` — «Bức tranh dang dở»

| Mục | Nội dung |
|---|---|
| Mở | cảnh giới 2 |
| Nơi | xưởng họa Bút Tháp |
| Bước | hoàn thành nửa bức tranh của một họa sĩ đã đi xa (chọn màu cho 3 mảng, chọn chi tiết cuối) |
| Thưởng | bức tranh treo ở Bút Tháp với tên hai người; mở sớm `STAT-ND-THUC-09` |

### `PERK-huaGai/Q1` — «Ba đỉnh Cô Phong»

| Mục | Nội dung |
|---|---|
| Mở | ngay khi có sao |
| Bước | tìm 3 chỗ tĩnh tọa trên đỉnh núi chỉ người có Hoa Cái thấy (04-06 §3.5); ngồi đủ ở cả 3 |
| Bậc II | chỗ thứ 4 xuất hiện trên Côn Lôn sau Quy nhất |
| Thưởng | đệm cói (trang trí); mở sớm `STAT-ND-AN-11` |

```
[CẢNH PERK-huaGai/Q1 · đỉnh Cô Phong thứ nhất · giờ Tý · sao]
(Không ai. Một tảng đá phẳng có vết mòn của người ngồi trước.)
(Không thoại. Khi người chơi ngồi đủ một phút thật, chữ hiện trên đá: «Ở đây không có ai thì có mình.»)
```

### `PERK-tianYiMed/Q1` — «Vườn thuốc của bà A Mậu»

| Mục | Nội dung |
|---|---|
| Mở | cảnh giới 3 (khi mở Miêu Cương) |
| Nơi | Miêu Cương Cổ Trại |
| Bước | chăm vườn thuốc 5 ngày: mỗi ngày một vị theo ngũ hành của ngày (`tcm` chỉ dùng để giảng); bà A Mậu kể chuyện xưa mỗi ngày |
| Thưởng | túi thuốc thơm (trang trí); mở sớm `STAT-ND-THUC-05` |
| An toàn | bà A Mậu luôn nói câu: «Thuốc của bà là thuốc trong chuyện. Người thật ốm thì đi thầy thuốc thật.» (04-13 RB1) |

## 6. Ải kiếp số — thiết kế đầy đủ

Chung: 3 chặng (có sao Đức → 2 chặng, bỏ chặng 2), mỗi chặng 10–15 phút; không thất bại vĩnh viễn; thưởng 120 công tu × NT + danh hiệu + trang trí (04-06 §3.7). Đặt ở Hồi III «Năm Hạn» (đề xuất cho 03); nếu năm hiện tại là «Năm Hạn» của người chơi (lưu niên Hung / Đại hung), ải mở sớm hơn và nhận R3 thử thách.

### 6.1 `PERK-xueRen` — kiếp «Thân Chắn»

| Chặng | Nơi | Việc | Ghi chú an toàn |
|---|---|---|---|
| 1 · Khói | Thư Lâu Lâm | phát hiện khói ở kho sách; báo động, dẫn 4 người đọc ra | không ai bị thương; khói là màn che tầm nhìn |
| 2 · Sách | Thư Lâu Lâm | chọn cứu 4 trong 6 kệ sách (mỗi kệ một loại sách) — mọi lựa chọn đều được; 2 kệ còn lại cháy, chặng 3 chép lại một quyển | |
| 3 · Dựng lại | Thư Lâu Lâm | chép lại 1 quyển đã cháy từ trí nhớ của 3 NPC | |

```
[CẢNH PERK-xueRen/K3 · Thư Lâu Lâm, sáng hôm sau · tro]
NGƯỜI GIỮ SÁCH: Mất hai kệ. Còn bốn. Người không ai sao.
NGƯỜI GIỮ SÁCH: Sách cháy rồi chép lại được. Người thì không. Ngươi chọn đúng thứ để cứu trước.
(Danh hiệu «Thân Chắn». Trang trí «Bìa sách cháy sém».)
```

### 6.2 `PERK-liuXia` — kiếp «Ráng Chiều»

| Chặng | Nơi | Việc |
|---|---|---|
| 1 · Đoàn người | chân đèo Tạng Địa | nhận dẫn 6 người hành hương (mỗi người một tốc độ, một nỗi lo) |
| 2 · Đèo | đèo lúc hoàng hôn | giữ đoàn không tách quá xa; ai mệt thì dừng — dừng không bị trừ, chỉ chậm |
| 3 · Lửa trại | đỉnh đèo | mỗi người kể vì sao đi hành hương; người chơi kể lý do của mình (chọn 1 trong 3 hoặc gõ tự do) |

### 6.3 `PERK-zaiSha` — kiếp «Bạch Hổ»

| Chặng | Nơi | Việc |
|---|---|---|
| 1 · Mưa | Cùng Thông Hồ | mực nước dâng; đi báo 3 làng |
| 2 · Đê | bờ hồ | đắp 3 đoạn đê (dùng lại cơ chế đắp đá của Bổ Dụng Thổ — 04-14 §3.3) |
| 3 · Sau lũ | làng | dựng lại nhà tạm cho 2 gia đình; trẻ con tặng một con hổ đất nặn |

```
[CẢNH PERK-zaiSha/K3 · làng ven hồ · trời quang]
ĐỨA TRẺ: (đưa con hổ đất méo mó) Mẹ con bảo hổ trắng mang lũ tới. Con nặn hổ để nó đi chỗ khác.
> ① «Nó đi rồi.» → [a]  ② «Hổ không mang lũ tới đâu.» → [b]
[a] ĐỨA TRẺ: Thế con giữ hổ hay chú/cô giữ? → (người chơi nhận hổ)
[b] ĐỨA TRẺ: Thế ai mang? — (người chơi chọn: «Mưa.» / «Không ai cả.») ĐỨA TRẺ: Vậy chú/cô giữ hổ đi, con không sợ nữa.
(Danh hiệu «Trấn Bạch Hổ». Trang trí «Hổ đất».)
```

### 6.4 `PERK-siFei` — kiếp «Hồi Sinh» (4 mùa)

| Mùa (lịch thật) | Việc | Nếu Dụng tầng hiệu dụng ≥ 3 |
|---|---|---|
| Xuân | dọn cỏ, tìm lại bản vẽ miếu | gộp với Hạ |
| Hạ | dựng khung gỗ (gỗ lấy ở vùng Mộc) | |
| Thu | lợp ngói, đắp tường (vùng Thổ) | |
| Đông | thắp đèn đầu tiên, mời người làng tới | |

Có sao Đức: mỗi mùa bớt một bước nhỏ (2 bước thay vì 3). Người chơi nghỉ cả một mùa không làm: miếu không hỏng thêm, mùa sau làm tiếp.

```
[CẢNH PERK-siFei/K-Đông · miếu bỏ hoang (nay đã dựng lại) · tuyết đầu mùa]
ÔNG TRƯỞNG LÀNG: Miếu này bỏ từ đời ông tôi. Ai cũng bảo đất này «phế», làm gì cũng hỏng.
ÔNG TRƯỞNG LÀNG: Bốn mùa. Không hỏng.
(Người chơi thắp đèn. Miếu thành điểm tĩnh tọa riêng mang tên người chơi. Danh hiệu «Hồi Sinh».)
```

## 7. Kiểm thử nội dung

| Mã | Kiểm |
|---|---|
| Q-01 | Mỗi `PERK-*` trong 04-06 có ít nhất một móc ở phần này (trừ `yangRen`, `kuiGang`, `jinShen` — móc nằm ở 04-15 §5) |
| Q-02 | Móc của sao phổ biến (`taiJi`, `huaGai`, `jiangXing`) ≤ 15 phút |
| Q-03 | Không móc nào có kết cục xấu vĩnh viễn |
| Q-04 | Ải kiếp số: không thương tích, không bệnh, không chết NPC trên màn hình |
| Q-05 | Móc dùng lịch thật (rằm, tiết khí, ngày Thiên Xá) báo trước ≥ 3 ngày |
