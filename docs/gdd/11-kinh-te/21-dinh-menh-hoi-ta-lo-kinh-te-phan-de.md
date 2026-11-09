# 11 · Phần 21 — Kinh tế phản đề: quầy «đổi mệnh» của Định Mệnh Hội và Tà Lộ

> Game có một phe phản diện bán chính thứ mà hiến chương (phần 01) cấm: Định Mệnh Hội mở **quầy «đổi mệnh» ở mọi vùng** (`00-KINH-DIEN-CHUNG.md` §4, `dinh_menh_hoi`), và Tà Lộ cho **Âm Bài ×2 Hậu Thiên 7 ngày** kèm Nợ Âm công khai (§6 kinh điển). Phần này đặt luật kinh tế cho hai thứ đó, để chúng **dạy** người chơi nhận ra lừa đảo tâm linh — mà không bao giờ trở thành đường tắt thật hay cái bẫy làm người chơi mất của.
>
> Cốt truyện, thoại chính và chuỗi nhiệm vụ của Định Mệnh Hội thuộc tài liệu 03 (`MQ-*`, `TL-*`) và 05; phần này chỉ đặt **giá, tiền, hoàn trả, giới hạn**.

---

## 1. Nguyên tắc

| # | Nguyên tắc |
|---|---|
| Đ1 | Quầy đổi mệnh **chỉ** nhận Phúc Khí. Không bao giờ nhận Ngọc, không bao giờ có nút tiền thật — để không một đồng tiền thật nào đi vào «bùa đổi mệnh», dù là giả |
| Đ2 | Mọi thứ quầy bán là **giả trong thế giới game**: không món nào có hiệu ứng gameplay (đúng như ngoài đời: bùa đổi mệnh không có tác dụng) |
| Đ3 | Người chơi bị «lừa» được **trả lại đủ** Phúc Khí khi làm chuỗi vạch mặt — bài học, không phải hình phạt |
| Đ4 | Quầy có trần mua để người chơi không mất quá nhiều trước khi nhận ra |
| Đ5 | Lời chào hàng của quầy là **mẫu lừa đảo thật** (tạo sợ hãi, khan hiếm giả, hứa chắc chắn) — để người chơi học nhận dạng; nhưng **không** dùng tên người, tên chùa, tên thầy có thật |
| Đ6 | Quầy đổi mệnh **không bao giờ** xuất hiện trong Y Các, không dùng giao diện cửa hàng thật — để người chơi không lẫn «cửa hàng của quán» với «quầy của phản diện» |
| Đ7 | Trên iOS (Học Quán) quầy là «quầy thầy bói rởm» được trình bày như bài học nhận diện lừa đảo, không dùng chữ «mệnh», «vận» trong tên món; nội dung giữ ý nghĩa giáo dục |

---

## 2. Quầy «Đổi Mệnh» — vận hành

### 2.1 Vị trí và lúc mở

| Mục | Luật |
|---|---|
| Có ở | mọi vùng (kinh điển §4); tài liệu 07 đặt `POI-*` cho từng quầy |
| Lúc mở | sau khi người chơi gặp Khổng tiên sinh (`khong_tiensinh`, «định mệnh luận») trong Hồi I; trước đó quầy đóng cửa, treo bảng «Sắp khai trương» |
| Ai đứng quầy | tay chân Định Mệnh Hội (NPC phụ do tài liệu 06 cấp `NPC-*`) |
| Đóng hẳn | khi người chơi xong chuỗi vạch mặt chính (tài liệu 03); quầy ở các vùng đổi thành biển «Đã bị dẹp» |

### 2.2 Hàng của quầy

Mọi món là **vật phẩm cốt truyện** (không vào tủ đồ, không mặc được), nằm trong túi «Đồ của Định Mệnh Hội». Tên dùng chữ «mệnh», «vận» có chủ đích — vì đây là hàng giả của phản diện, không phải món của quán.

| Món giả | Giá (PK) | Lời rao (mẫu lừa đảo) | Sự thật khi soi (vạch mặt) |
|---|---|---|---|
| Bùa Đổi Mệnh | 300 | «Mệnh con mỏng lắm. Đeo bùa này 49 ngày là đổi!» (tạo sợ hãi + hứa chắc) | giấy in hàng loạt, chữ vô nghĩa; Thầy Tử Bình đối chiếu lá số: không gì thay đổi |
| Đèn Giải Hạn Thượng Hạng | 200 | «Đèn thường không ăn thua. Đèn này thầy đã khai quang riêng.» (chê đồ miễn phí) | đèn an Thái Tuế ở Thái Tuế Điện là miễn phí (`lightLamp`); hai đèn y hệt |
| Lá Số Cải Tạo | 250 | «Thầy sửa giờ sinh cho con thành giờ đẹp.» (sửa dữ kiện) | giờ sinh không sửa được; `checkNeo` của Thầy AI bắt lời bịa |
| Tượng Hóa Sát Bỏ Túi | 150 | «Chỉ còn 3 cái cuối!» (khan hiếm giả) | kho sau quầy còn cả thùng |
| Sớ Giải Nghiệp | 400 | «Nộp sớ là nghiệp xóa, khỏi sám hối.» (bán bỏ qua) | sám hối 5 pháp (`CHAN_HUI`) là việc làm, không mua được |
| Ngày Đẹp Độc Quyền | 100 | «Ngày này chỉ thầy biết.» (độc quyền tri thức) | `zheri` / `huangdao` công khai cho mọi người |

### 2.3 Trần mua

| Trần | Giá trị | Lý do |
|---|---|---|
| Mua / ngày | 2 món | Đ4 |
| Tổng chưa được hoàn | 800 PK | người chơi mới (A) không mất quá ~3 tuần Phúc Khí |
| Cấp tối thiểu để mua | 3 | người vừa vào game chưa có gì để mất, và chưa đủ bối cảnh để học bài học |
| Tài khoản < 16 | quầy không bán, chỉ rao (người chơi nhỏ vẫn thấy mẫu lừa, không mất Phúc Khí) |

### 2.4 Hoàn trả

| Khi | Hoàn |
|---|---|
| Người chơi đưa món giả cho Thầy Tử Bình soi (mỗi món một lần) | +50% giá ngay — Thầy: «Của đi thay người. Một nửa này ta đòi lại được.» |
| Xong chuỗi vạch mặt chính | phần còn lại (100%) + **khung «Kẻ Vạch Mặt»** (`SKU-A-24`, vòng giữa) |
| Người chơi chưa bao giờ mua mà vẫn vạch mặt | cùng khung, không có Phúc Khí (không thưởng thêm cho người đã bị lừa — để không ai cố «mua để được hoàn lời») |

Hoàn trả không vượt số đã trả (không có lời). Phúc Khí hoàn trả **không** tính ngân sách ngày (phần 02 §5.1) và **không** cộng `xp` (vì `xp` đã cộng khi kiếm lần đầu; tiêu không trừ `xp`, hoàn không cộng).

---

## 3. Tà Lộ và Âm Bài

### 3.1 Âm Bài theo kinh điển

Kinh điển §6: «Âm Bài (×2 Hậu Thiên 7 ngày) + Nợ Âm (công khai) → Phong Đô → danh hiệu Hồi Đầu». Tài liệu 05 là chuẩn chi tiết. Luật kinh tế:

| # | Luật |
|---|---|
| T-1 | Âm Bài **không bao giờ** bán, ở bất kỳ tiền nào (kể cả Phúc Khí). Nhận chỉ qua chuỗi Tà Lộ của tài liệu 05 (`TL-*`) |
| T-2 | ×2 của Âm Bài áp **chỉ** lên Đạo Hạnh (Hậu Thiên); **không** nhân Phúc Khí, Lộ Điểm, Ngọc — để Tà Lộ không thành «cách cày tiền» |
| T-3 | Trong 7 ngày Âm Bài: Y Các vẫn mở bình thường nhưng **không** có món nào gắn Tà Lộ để «khoe»; không có hào quang, khung tên Tà Lộ để bán |
| T-4 | Nợ Âm công khai (theo kinh điển) — hiện trên thẻ người chơi; **không** có món thẩm mỹ nào che được dấu Nợ Âm (không bán «che nợ») |
| T-5 | Trả Nợ Âm bằng việc thiện (tài liệu 05). Không có đường trả bằng Phúc Khí, Ngọc, tiền (phần 01 M4) |
| T-6 | Danh hiệu và khung Hồi Đầu (`SKU-A-15`) là vòng giữa; không có phiên bản bán |
| T-7 | Thiên Bảng: Đạo Hạnh kiếm trong Âm Bài vẫn tính (tài liệu 05 quyết định có gắn dấu hay không); kinh tế chỉ yêu cầu không có thưởng Ngọc / món cho thứ hạng (phần 20 §2.5) |

### 3.2 Vì sao Tà Lộ không «cạnh tranh» với cửa hàng

Câu hỏi người duyệt hay đặt: «Nếu VIP không được mua tu vi, sao Tà Lộ lại cho ×2 Đạo Hạnh?» Trả lời: Tà Lộ **trả giá bằng Nợ Âm công khai và một chuỗi chuộc lỗi dài**, không bằng tiền. Đây là lựa chọn đạo đức trong cốt truyện — cám dỗ có hậu quả — chứ không phải sản phẩm. Kinh tế giữ nó tách hẳn khỏi tiền để thông điệp còn nguyên: **đường tắt có giá, và giá đó không mua được bằng ví**.

---

## 4. Thoại mẫu ở quầy

```
[CẢNH Quầy Đổi Mệnh · chợ Huyền Thành · lần đầu ghé sau khi gặp Khổng tiên sinh]
TAY CHÂN ĐỊNH MỆNH HỘI: (nhìn người chơi từ đầu tới chân) Ấy chết! Ấn đường con tối quá. Năm nay không giải là gặp hạn lớn.
TAY CHÂN ĐỊNH MỆNH HỘI: Thầy bên Hội thương con nên để lại đúng một lá Bùa Đổi Mệnh. Ba trăm Phúc Khí. Đeo bốn mươi chín ngày là đổi.
> Lựa chọn: ① «Bùa này đổi được thật à?» → [4.1]  ② «Con mua.» → [4.2]  ③ «Thôi, con đi.» → [4.3]

[4.1]
TAY CHÂN ĐỊNH MỆNH HỘI: Thật một trăm phần trăm! Người ta còn xếp hàng không mua được. Chỉ còn ba lá thôi.
> (Gợi ý trên màn hình, chỉ lần đầu, tắt được: «Nhận ra không: hù dọa · hứa chắc chắn · khan hiếm giả.»)
> Lựa chọn: ② «Con mua.» → [4.2]  ③ «Thôi, con đi.» → [4.3]

[4.2]
TAY CHÂN ĐỊNH MỆNH HỘI: (nhét lá bùa vào tay) Nhớ đừng cho ai xem, mất linh.
> Hệ thống: −300 Phúc Khí · nhận «Bùa Đổi Mệnh» (đồ của Định Mệnh Hội — không mặc được)
> Gợi ý nhỏ: «Mang lá bùa tới Bàn Thầy để hỏi.»

[4.3]
TAY CHÂN ĐỊNH MỆNH HỘI: (gọi với theo) Hạn tới rồi đừng trách Hội không nói trước!
```

```
[CẢNH Bàn Thầy · Sơn Môn · người chơi đưa món giả]
THẦY TỬ BÌNH: (lật lá bùa) Giấy in máy, chữ không thành nghĩa. Lá số của con ta vừa xem lại — không có gì «tối» cả.
THẦY TỬ BÌNH: Cổ pháp không bán bùa đổi mệnh. Muốn đổi thì làm: sửa tính, làm việc tốt, học cho thấu. Những việc đó không mất đồng nào.
THẦY TỬ BÌNH: Của đi thay người. Một nửa này ta đòi lại được cho con. Phần kia — con muốn lấy lại thì theo ta lần ra cái Hội ấy.
> Hệ thống: +150 Phúc Khí (hoàn 50%) · mở chuỗi vạch mặt (tài liệu 03)
```

(Lời Thầy theo `RB5` và `checkNeo`: không bịa dữ kiện lá số, khẳng định hóa giải là hành động miễn phí.)

---

## 5. Analytics riêng

| Sự kiện | Trường | Mục đích |
|---|---|---|
| `foe_shop_view` | `region`, `cấp` | bao nhiêu người thấy quầy |
| `foe_shop_buy` | `item`, `price`, `lanDau` | tỷ lệ «bị lừa» lần đầu |
| `foe_shop_refuse` | `item`, `chonGoiY` (đã xem gợi ý nhận dạng?) | người chơi tự nhận ra |
| `foe_refund` | `stage` (`thay_soi` · `vach_mat`), `amount` | hoàn trả đúng |

Chỉ số học tập (không phải doanh thu): tỷ lệ người chơi **từ chối** món giả lần thứ hai trở đi ≥ 80% → bài học hiệu quả. Nếu < 50%, tài liệu 03 xem lại thoại vạch mặt.

---

## 6. Checklist nghiệm thu phần 21

- [ ] Quầy đổi mệnh chỉ nhận Phúc Khí; không có đường Ngọc / tiền thật (test).
- [ ] Món giả không vào tủ đồ, không có hiệu ứng (test).
- [ ] Trần 2 món / ngày, 800 PK chưa hoàn, cấp ≥ 3, < 16 không mua (test).
- [ ] Hoàn 50% khi Thầy soi, 100% khi vạch mặt; không bao giờ hoàn quá số đã trả (test).
- [ ] Âm Bài không nhân Phúc Khí, Lộ Điểm, Ngọc (test).
- [ ] Không món bán nào che dấu Nợ Âm.
- [ ] Bản iOS đổi tên quầy và món theo phần 14 §4.
