# 06-15 · Phản ứng thế giới, hội thoại chéo và dữ liệu triển khai

> Phần này gom những gì **dùng chung** cho cả 20 NPC chính:
> - §1 · NPC phản ứng thế nào với các trạng thái lớn của thế giới;
> - §2 · các cảnh NPC nói với nhau (không AI);
> - §3 · sổ persona dạng dữ liệu cho kỹ thuật;
> - §4 · ma trận lịch 20 × 12 giờ;
> - §5 · bảng ánh xạ mọi chỗ chèn `{…}` trong cây thoại sang trường engine / game;
> - §6 · danh sách việc kỹ thuật cho tài liệu 13.

---

## 1. Phản ứng thế giới

Mỗi trạng thái dưới đây là **cờ toàn cục** do máy trạng thái bật. NPC đổi:

- câu chào đầu (`*.00`);
- một bark ưu tiên;
- một dòng thêm vào ④ BỐI CẢNH GAME (để AI biết, nếu NPC chạy AI).

Câu là kịch bản, không qua AI.

### 1.1 W-NUT · Thiên Mệnh Bàn nứt thêm (mở Hồi III)

Dòng ④ thêm: «Thế giới: Thiên Mệnh Bàn vừa nứt thêm; năm hạn của người chơi đang được mô phỏng.»

| NPC | Câu chào thay thế | Hành vi |
|---|---|---|
| thay_tubinh | «Con thấy chưa? Nứt thêm một sợi tóc. Thầy thắp nhang từ giờ Dậu tới giờ Hợi.» | đứng dưới Bàn lâu hơn ở giờ Dậu |
| khong_tiensinh | «Bàn nứt đúng năm ta đoán. Ta không vui vì đoán đúng.» | ngồi lệch khỏi bậc thứ ba (lần đầu) |
| van_coc | «Bàn nứt vì có thêm người thôi cố. Mình cố thêm một chút.» | xuống núi giờ Mùi mỗi ngày |
| gac_cong | «Lão nhìn ba mươi năm, chưa thấy nó nứt nhanh thế.» | thắp đèn sớm |
| tho_may | «Khách ít hẳn. Người ta sợ thì không ai may áo mới.» | — |
| truong_thiensu | «Phủ mở đàn cầu an cho cả vùng. Không thu lễ.» | sự kiện trai tiếu (10) |
| huyen_hu | «Gió trên Kim Đỉnh đổi hướng. Ngồi thêm mười phút.» | — |
| khau_daotruong | «Đạo sĩ du phương về đông. Vân thủy đường hết giường.» | mở thêm chiếu |
| maoshan_daonhan | «Tuần này tôi khám gấp đôi. Toàn mất ngủ.» | phòng khám mở thêm giờ Thân |
| truclam_thiensu | «…» | không đổi (đúng tính cách) |
| dieu_am | «Bàn trả lời ngày rằm đông người lắm. Con ngồi với sư.» | bàn trả lời mở cả giờ Mùi |
| lama_dakiet | «Bàn nứt. Mọi thứ đều đổi. Cả cái nứt cũng đổi.» | — |
| te_tuu | «Học trò bỏ thi vì sợ năm hạn. Lão phu mở lớp đêm.» | lớp giờ Tuất |
| phan_quan | «Người xuống đây nhiều hơn. Phần lớn vì sợ.» | — |
| diatang_su | «Tôi cần thêm người cầm đèn.» | mở hoạt động dẫn người lạc |
| vu_y_amau | «Có nhà dưới xuôi bị yểm nữa rồi. Mùi bùa ấy bà nhận ra.» | gợi ý Hồi IV |
| lo_ban_su | (xuất hiện lần đầu ở chợ) «Năm hạn còn dài, bạn trẻ.» | cảnh mời (06-10 B5) |
| dinh_menh_hoi | «Bàn nứt rồi! Mệnh sắp đổi xấu! Giải ngay kẻo muộn!» | mọi quầy mở thêm; giá tăng (trong truyện) |
| dan_dinh | «Lò nấu cháo gấp đôi.» | — |
| phuong_si | «Nước lũ lên. Đừng chèo ngược.» | xuất hiện cả ngày Quý (ngoại lệ duy nhất) |

### 1.2 W-TL · Người chơi đang ở Tà Lộ

Dòng ④: «Tà Lộ: có · Nợ Âm {noAm}». Đã có trong mọi persona; đây là bảng hệ quả hình ảnh.

| NPC | Hệ quả hiển thị (canon §5.5: thấy cái giá trả bằng người khác) |
|---|---|
| thay_tubinh | không tiếp (TB.28); quay mặt vào giá sách |
| khong_tiensinh | ghi thêm một thẻ tre, không nói vì sao |
| van_coc | vẫn rót trà; không nhắc lá bùa (VC.33) |
| gac_cong | «Khách về muộn. Cổng vẫn mở.» |
| tho_may | đòi giặt áo «mùi chu sa giả» |
| truong_thiensu | không cho đứng đàn lễ |
| huyen_hu | «Thở nông quá.» |
| khau_daotruong | đưa chổi, không nói |
| maoshan_daonhan | «Ngủ có ngon không?» |
| truclam_thiensu | «Nặng không?» |
| dieu_am | «Đặt xuống một lát» |
| lama_dakiet | «Rồi cũng đổi» |
| te_tuu | không giảng nhưng không đóng cửa lớp |
| phan_quan | Nợ Âm hiện trên án thư |
| diatang_su | đi theo người chơi ở khoảng cách xa hơn bình thường, đèn hướng về phía người chơi |
| vu_y_amau | mời ăn cháo |
| lo_ban_su | «Mạnh lên rồi đấy» |
| dinh_menh_hoi | mời vào như «người nhà» |
| dan_dinh | «Cái ấy là nợ, không phải thuốc» |
| phuong_si | «Thác ở phía trước» |

**NPC phụ chịu hệ quả** (03/05 chốt thứ tự):

1. ông Lục Bảng (vợ ốm);
2. khách Sơn Môn bỏ về: tiểu đạo Minh Khê báo «hôm nay ba khách bỏ về»;
3. chị Sen mất lồng chim;
4. Cu Tí bị đuổi việc ở quán.

Mỗi lần dùng Âm Bài: một hệ quả, theo thứ tự.

### 1.3 W-HD · Người chơi đạt «Hồi Đầu»

| NPC | Câu (lần đầu gặp sau danh hiệu) |
|---|---|
| thay_tubinh | «Ngồi đi. Bàn này để trống chỗ cho con lâu rồi.» |
| khong_tiensinh | «Sách không ghi chuyện này. Ta ghi thêm.» |
| van_coc | «Người quay đầu được kính hơn người chưa từng lạc.» |
| gac_cong | «Hề hề. Lão biết khách sẽ về.» |
| tho_may | «Áo con sạch rồi. Đứng thẳng lên, đẹp lắm.» |
| truong_thiensu | «Đứng vào đàn đi. Sao Bắc Đẩu chưa bao giờ tắt với ai.» |
| huyen_hu | «Hơi thở tiểu hữu dài ra rồi.» |
| khau_daotruong | «Bờ đê đắp lại rồi. Cao hơn trước.» |
| maoshan_daonhan | «Anh ngủ ngon rồi đấy.» |
| truclam_thiensu | «Nhẹ chưa?» |
| dieu_am | «Đèn trong chánh điện sư thắp thêm một ngọn cho con.» |
| lama_dakiet | «Bạn đổi rồi. Tôi thấy.» |
| te_tuu | «Biết sai mà sửa, quý hơn chưa từng sai.» |
| phan_quan | «Bổn quan đóng sổ trang này.» |
| diatang_su | «Đèn này tôi để lại cho người sau.» |
| vu_y_amau | «Cháu về rồi. Ăn cơm chưa?» |
| lo_ban_su | «Tôi không giận người đi. Tôi chỉ đếm.» |
| dinh_menh_hoi | (xì xào) «Đứa này hồi đầu rồi.» |
| dan_dinh | «Bệnh lui rồi.» |
| phuong_si | «Bạn đường về rồi. Đi tiếp nào.» |

**Thêm cho người chơi Hồi Đầu:** NPC phụ từng chịu hệ quả (§1.2) có câu cảm ơn riêng, sau khi người chơi trả xong mục của họ.

### 1.4 W-TET · Tết Nguyên Đán (đổi niên chủ Thái Tuế, canon §3 Vĩ thanh)

Dòng ④: «Thế giới: đầu năm {yearGanZhi}; niên chủ Thái Tuế mới.»

| NPC | Câu |
|---|---|
| thay_tubinh | «Năm mới {yearGanZhi}. Con vào Thái Tuế Điện xem tuổi mình năm nay thế nào.» |
| khong_tiensinh | «Năm mới, ba câu mới. Ngồi.» (lời phán năm mới — kịch bản dựng từ `analyze_year` năm mới) |
| van_coc | «Sổ năm cũ khép lại. Mở trang mới, ghi một lời nguyện.» |
| gac_cong | «Chúc khách năm mới. Hề hề. Lão già thêm một tuổi.» |
| tho_may | «Áo mới ngày Tết thì bà tặng: một dải đai đỏ.» (vật trang trí miễn phí; không phải hàng bán) |
| truong_thiensu | «Đêm giao thừa phủ mở đàn bái Đẩu. Ai cũng đứng được.» |
| huyen_hu | «Sáng mùng một, lên Kim Đỉnh xem mặt trời đầu năm.» |
| khau_daotruong | «Đầu năm giữ một giới mới.» |
| maoshan_daonhan | «Tết đừng thức khuya quá. Mùng ba tôi lại khám mất ngủ.» |
| truclam_thiensu | «Mùa hành hương. Leo.» (lễ hội Yên Tử) |
| dieu_am | «Đầu năm thả cá, đừng đặt trước.» |
| lama_dakiet | «Năm mới. Cát mới.» |
| te_tuu | «Khai bút. Viết một câu lập chí.» |
| phan_quan | «Năm mới. Sổ không xoá năm cũ, nhưng có trang mới.» |
| diatang_su | «Đêm giao thừa tôi đứng giữa cầu. Ai muốn lên thì lên.» |
| vu_y_amau | «Tết trại có bánh. Lên ăn.» |
| lo_ban_su | — (không xuất hiện ngày Tết — chủ ý) |
| dinh_menh_hoi | «Đầu năm cúng sao giải hạn! Giá ưu đãi!» (án lừa mùa Tết, 03) |
| dan_dinh | «Cháo gừng đầu năm.» |
| phuong_si | «Năm mới, chợ mới.» |

### 1.5 W-HAN · Người chơi đang trong năm hạn mô phỏng (Hồi III)

Persona AI nhận thêm dòng ④: «Người chơi đang trong năm hạn mô phỏng: {worstYear.year} {worstYear.ganZhi}.» Hướng dẫn giọng: **«thuận vận thì làm, nghịch vận thì giữ»** (`GAI_LEVELS`).

| NPC | Lời khuyên năm hạn |
|---|---|
| thay_tubinh | «Năm này giữ, đừng mở. Giữ không phải thua.» |
| van_coc | «Năm khó thì làm việc thiện nhỏ, đều. Đừng làm việc lớn để chứng minh.» |
| huyen_hu | «Ngủ đủ. Thở dài. Năm nào cũng qua.» |
| te_tuu | «Năm hạn thì học. Học không bao giờ là việc sai năm.» |
| dieu_am | «Đếm cơn giận. Năm hạn người ta hay giận.» |
| khong_tiensinh | «Năm này là năm ta đã nói. Ta mong ta sai.» |
| các NPC khác | câu chào bình thường + bark động viên một lần / ngày |

### 1.6 W-1000 · Sổ Công Quá đạt 1.000 công

| NPC | Câu |
|---|---|
| van_coc | VC.42 |
| khong_tiensinh | KTS.30 → KTS.35 |
| thay_tubinh | «Thầy viết tên con lên bảng đệ tử. Không phải vì lệ.» |
| dieu_am | «Một nghìn. Sư không đếm, nhưng sổ đếm.» |
| te_tuu | «Lão phu thua ông sư rồi. Tích đức trước cũng được.» (nối TT.28) |
| phan_quan | «Cột bên phải dài hơn cột bên trái một nghìn. Bổn quan đọc to cho cả điện nghe.» |
| conlon (NPC-conlon-01) | mở «Soi Thiên Trì» |

### 1.7 W-CANH4 · Người chơi lên cảnh giới 4 (từ đây Tiên Thiên không còn tính — canon §5)

| NPC | Câu |
|---|---|
| thay_tubinh | «Từ bậc này, điểm lá số không còn được cộng. Chỉ còn việc con làm.» |
| van_coc | «Hạt giống thành cây rồi. Giờ không ai hỏi hạt to hay nhỏ.» |
| khong_tiensinh | «Bậc này sách ta không có chương.» |
| huyen_hu / dieu_am / te_tuu | lời chúc theo tên cảnh giới của đạo (Luyện Khí Hoá Thần / Định / Hiền Nhân) |

### 1.8 W-CRISIS · Cờ khủng hoảng 30 phút (06-01 §11.3)

| Nhóm | Hành vi |
|---|---|
| mọi NPC chính | câu chào thay bằng câu dịu, không câu hỏi ngược (kể cả Khổng tiên sinh), không nhắc lá số |
| Định Mệnh Hội, Lỗ Ban | không xuất hiện trong bán kính 60 m; bark tắt |
| bark trêu / doạ (vd BARK-khong_tiensinh-13 «Cách bại. Đúng sách.») | tắt |
| nhạc nền | hạ 50%, chuyển dải «tĩnh» (12 cấp `BGM-*`) |

---

## 2. Hội thoại chéo (NPC với NPC, kịch bản)

**Kích hoạt:** hai NPC đứng gần (≤ 6 m) theo lịch §4, người chơi trong bán kính 12 m, mỗi cảnh tối đa 1 lần / ngày thật.

- Người chơi **nghe**, không chen được.
- Riêng cảnh có dấu ⑦ có lựa chọn ở cuối.

```
[XN-01 · Bàn Thầy Tử Bình × Khổng tiên sinh · cổng Sơn Môn · giờ Tuất]
THẦY: Hôm nay ông đoán mấy người?
KHỔNG: Mười một. Trúng mười một.
THẦY: Tôi luận ba án. Trúng hai. Án thứ ba khách bảo: «Thầy nói đúng, nhưng tôi sẽ làm khác.»
KHỔNG: Thế là ông sai.
THẦY: Thế là tôi vui.
LÃO TÙNG: Chè đây, hai ông. Đặc.
```

```
[XN-02 · Vân Cốc × Tế tửu · thư (Lão Tùng / người chơi mang) · bất kỳ]
(Thư Vân Cốc, đọc to khi người chơi trao)
VÂN CỐC: «Ông Trinh, hôm qua có đứa trẻ làm ba việc thiện trước khi biết mình muốn gì. Lập chí trước à? Hừm.»
(Thư trả lời của Tế tửu)
TẾ TỬU: «Ông sư, đứa trẻ ấy làm việc thiện vì ông bảo nó làm. Ông lập chí hộ nó rồi. Hòa.»
⑦ > ① (mang thư tiếp) → +thiện cảm cả hai  ② (giữ thư) → không gì
```

```
[XN-03 · Trương Thiên Sư × Mao Sơn đạo nhân · vườn lan Long Hổ · giờ Mùi, ngày Mậu]
MAO: Trà ông pha ngọt quá.
TRƯƠNG: Nước Thượng Thanh ngọt hậu. Ông uống trà đắng quen rồi nên không biết.
MAO: Tôi uống đắng cho tỉnh. Cả tuần khám mất ngủ.
TRƯƠNG: Con gái tôi bảo ông gửi nhiều người xuống y quán quá.
MAO: Thế là tốt hay xấu?
TRƯƠNG: Tốt. Nó bảo ông là đạo sĩ duy nhất biết đếm mạch.
```

```
[XN-04 · Huyền Hư × Đan Đỉnh · lò đan · giờ Ngọ]
HUYỀN HƯ: Khét.
ĐAN ĐỈNH: Chưa nếm đã chê.
HUYỀN HƯ: Mũi lão đạo nếm thay.
ĐAN ĐỈNH: Ba mươi năm rồi lão vẫn ăn.
HUYỀN HƯ: Ba mươi năm rồi vẫn khét.
(cả hai cười)
```

```
[XN-05 · Diệu Âm × Địa Tạng sứ giả · cổng Bút Tháp (sứ giả đưa người từ Phong Đô lên) · giờ Dần]
SỨ GIẢ: Người này vừa lên. Còn run.
DIỆU ÂM: Để sư nấu nước vối. Người cầm đèn có muốn uống không?
SỨ GIẢ: Tôi phải xuống. Còn người lạc.
DIỆU ÂM: Lúc nào cũng còn người lạc.
SỨ GIẢ: Thì lúc nào tôi cũng xuống.
```

```
[XN-06 · Bà Tư × Tiểu đạo Minh Khê · Tàng Y Các · giờ Thìn]
BÀ TƯ: Lại rách tay áo. Con quỳ luận án hay đi đánh nhau?
MINH KHÊ: Đệ viết tứ trụ nhanh quá, tay áo quệt nghiên.
BÀ TƯ: Viết chậm thôi. Lá số không chạy đi đâu. Thầy con nói thế, bà nghe hai mươi năm rồi.
```

```
[XN-07 · Khổng tiên sinh × Thầy quầy Định Mệnh Hội · chợ Huyền Thành · giờ Tỵ, Hồi II]
QUÁCH TOÀN: Ông Khổng, ông đoán giỏi thế sao không ngồi quầy với chúng tôi? Mỗi lời một lượng.
KHỔNG: Lời đoán mà có giá thì là lời rao hàng.
QUÁCH TOÀN: Ông cũng tin mệnh đã định mà.
KHỔNG: Ta tin. Ta không bán.
QUÁCH TOÀN: Khác gì nhau?
KHỔNG: Khác ở chỗ ngươi phải hỏi câu đó.
```

```
[XN-08 · Vu y bà A Mậu × Trưởng trại Cổ Sơn · bếp nhà sàn · giờ Tuất]
CỔ SƠN: Người dưới xuôi lại lên. Lần này bà bảo lãnh à?
A MẬU: Nó ăn hết hai bát cháo. Người ăn được cháo bà thì bà tin.
CỔ SƠN: Cầu kia bao giờ dỡ?
A MẬU: Bao giờ cả trại cùng muốn. Bà muốn rồi.
CỔ SƠN: Tôi cũng muốn. Chưa đủ người.
⑦ > ① «Con giúp gom người.» → mở nhiệm vụ «Cây cầu mới» sớm (nếu cờ Hồi IV)
```

```
[XN-09 · Phán quan × Địa Tạng sứ giả · Thiên Tử điện · bất kỳ]
PHÁN QUAN: Hôm nay bao nhiêu người lên?
SỨ GIẢ: Mười bốn. Một người quay lại.
PHÁN QUAN: Quay lại vì sợ hay vì nhớ?
SỨ GIẢ: Vì nhớ. Họ quên chưa xin lỗi một người.
PHÁN QUAN: Thế thì sổ sẽ gạch.
```

```
[XN-10 · Phương sĩ × Khổng tiên sinh · bất kỳ chợ (can trùng lịch hai người)]
PHƯƠNG SĨ: Ông Khổng! Đoán thử kẻ này mai ở đâu.
KHỔNG: Ngươi không có ngày sinh.
PHƯƠNG SĨ: Có. Quên rồi. Như quên tên.
KHỔNG: Kẻ quên ngày sinh thì ta không đoán được.
PHƯƠNG SĨ: Thế thì kẻ này tự do nhất Huyền Giới!
KHỔNG: (gẩy bàn tính ba hạt, không đáp)
```

```
[XN-11 · Lão Tùng × Lỗ Ban · cổng Sơn Môn · Hồi III, giờ Hợi, một lần]
(Lỗ Ban đứng ngoài cổng, không bước vào.)
LÃO TÙNG: (giơ đèn bão) Lão nhớ mặt anh.
LỖ BAN: Bốn mươi năm rồi, ông vẫn gác cổng.
LÃO TÙNG: Cổng không đóng. Anh vào thì vào.
LỖ BAN: Đêm ấy cũng không đóng. Mà không ai ra.
(Lỗ Ban quay đi.)
LÃO TÙNG: (một mình) … Lão xin lỗi.
```

```
[XN-12 · Trúc Lâm thiền sư × Chú tiểu Tâm Nhiên · đường lên Hoa Yên · giờ Mão]
TÂM NHIÊN: Thầy ơi, người ta bảo lá số con đẹp nhất chùa.
THIỀN SƯ: Quét.
TÂM NHIÊN: Đẹp thì sao ạ?
THIỀN SƯ: Quét đẹp.
```

```
[XN-13 · Tế tửu × Ông đồ Vũ (NPC-thanh-07) · chợ Huyền Thành, mùa Tết]
ÔNG ĐỒ: Ông Trinh xuống chợ à. Xin chữ không? Chữ tôi đẹp hơn chữ ông.
TẾ TỬU: Đẹp hơn. Nhưng ông viết chữ Phúc cho người ta treo, lão phu viết chữ Học cho người ta làm.
ÔNG ĐỒ: Ai treo chữ Học bao giờ?
TẾ TỬU: Thế mới phải dạy.
```

```
[XN-14 · Đan Đỉnh × Phương sĩ · cổng Võ Đang (hiếm — chỉ khi người chơi có cả BR-DC và đã gặp Phương sĩ)]
ĐAN ĐỈNH: Ông lại lên ăn chực cháo.
PHƯƠNG SĨ: Cháo ông là thuốc. Kẻ này bệnh đói.
ĐAN ĐỈNH: Bệnh ấy dễ chữa.
PHƯƠNG SĨ: Không. Ngày nào cũng tái phát.
```

```
[XN-15 · Diệu Âm × Anh Khải (NPC-buttap-02) · sân chùa · giờ Tuất]
KHẢI: Còn mười hai nhà, sư ạ. Nhà hôm nay đóng cửa.
DIỆU ÂM: Mai con lại tới. Đóng cửa không phải là không tha. Đóng cửa là chưa.
KHẢI: Nếu họ không bao giờ mở?
DIỆU ÂM: Thì con vẫn giúp họ, từ ngoài cửa.
```

**Ràng buộc chung cho hội thoại chéo:**

- Không cảnh nào nói xấu tín ngưỡng thật.
- Không cảnh nào tiết lộ bí mật của bậc thiện cảm mà người chơi chưa đạt. Ví dụ XN-11 chỉ chạy sau khi người chơi đã có LT.14 hoặc đang ở Hồi III — mô tả bí mật **gián tiếp**.

---

## 3. Sổ persona — dữ liệu cho kỹ thuật

**Tệp đề xuất:** `src/game/npc-personas.js` **(chưa có — cần làm)**.

- Xuất `PERSONAS` (đối tượng theo npc id).
- `prompt` đọc từ các khối `PERSONA-<id>` của 06-02 … 06-11.
- Bảng dưới là nguồn sự thật cho các trường còn lại.

| id | ver | runtime | briefMode | toolsAllow (không kể `get_current_time`) | fallback | style | lengthHint | maxTokens | fatalismExempt |
|---|---|---|---|---|---|---|---|---|---|
| thay_tubinh | 1 | ai | rag (tổng hợp: full) | 26 công cụ — 06-04 §10 | compose | gan-guoi | 220 (450) | 1100 (2000) | false |
| khong_tiensinh | 1 | ai | rag | analyze_year, analyze_month, life_trajectory | compose | can-bang | 120 | 600 | **true** |
| van_coc | 1 | ai | rag | analyze_remedy_fate, analyze_year | compose | gan-guoi | 180 | 800 | false |
| truong_thiensu | 1 | ai | core | fengshui_direction, find_good_days, analyze_best_hour, analyze_day | intent | can-bang | 170 | 750 | false |
| huyen_hu | 1 | ai | core | health_hour | intent | gan-guoi | 150 | 650 | false |
| khau_daotruong | 1 | ai | core | — (`daozang_lookup` khi có) | intent | can-bang | 160 | 650 | false |
| maoshan_daonhan | 1 | ai | rag | health_hour | intent | gan-guoi | 170 | 750 | false |
| truclam_thiensu | 1 | ai | none | — | intent | gan-guoi | 70 | 300 | false |
| dieu_am | 1 | ai | rag | analyze_remedy_fate | intent | gan-guoi | 160 | 700 | false |
| lama_dakiet | 0 | scripted | — | — | scripted | — | — | — | — |
| te_tuu | 1 | ai | rag | analyze_name, find_good_days, analyze_year | compose | can-bang | 190 | 800 | false |
| phan_quan | 1 | ai | none | — | intent | can-bang | 140 | 600 | false |
| diatang_su | 1 | ai | none | — | intent | gan-guoi | 130 | 550 | false |
| vu_y_amau | 1 | ai | core | health_profile, health_today | intent | gan-guoi | 150 | 650 | false |
| lo_ban_su | 0 | scripted | — | — | scripted | — | — | — | — |
| dinh_menh_hoi | 0 | scripted | — | — | scripted | — | — | — | — |
| gac_cong | 0 | scripted | — | — | scripted | — | — | — | — |
| tho_may | 0 | scripted | — | — | scripted | — | — | — | — |
| dan_dinh | 1 | ai | rag | life_trajectory | compose | can-bang | 170 | 750 | false |
| phuong_si | 1 | ai | rag | life_trajectory | compose | can-bang | 160 | 700 | false |

**Ghi chú:**

- **Đếm công cụ của Thầy Tử Bình:** bảng 06-04 §10 liệt kê 27 tên, kể cả `get_current_time`. Bảng này ghi 26 vì `get_current_time` được tự thêm.
- **Ghép prompt khi chạy:**
  ```
  promptFull = PERSONA_CHUNG.replace('{name}', name).replace('{lengthHint}', lengthHint) + '\n' + PERSONAS[id].prompt
  ```
- **Kiểm độ dài khi build:** `promptFull ≤ 6.300 ký tự`. Riêng `thay_tubinh` ≤ 7.000.

**Mẫu cấu trúc một mục:**

```js
export const PERSONAS = {
  van_coc: {
    id: 'van_coc', version: 1, name: 'Vân Cốc thiền sư',
    runtime: 'ai', briefMode: 'rag', fallback: 'compose',
    toolsAllow: ['analyze_remedy_fate', 'analyze_year'],
    style: 'gan-guoi', lengthHint: 180, maxTokens: 800, fatalismExempt: false,
    knownNames: ['Liễu Phàm', 'Khổng tiên sinh', 'Sổ Công Quá', 'Mệnh Đồ', 'Am Vân Cốc', 'Hậu Sơn', 'Bút Tháp', 'Văn Miếu', 'Bàn Thầy', 'Sơn Môn'],
    statusLabels: {
      thinking: ['Thầy rót thêm trà…', 'Thầy nhìn biển mây…', 'Thầy gõ gậy hai cái…'],
      tool: { analyze_remedy_fate: 'Thầy lật Sổ Công Quá…', analyze_year: 'Thầy nhìn trời năm nay…', get_current_time: 'Thầy xem bóng nắng…' },
    },
    followupPool: ['Con nên bắt đầu từ tầng nào của Mệnh Đồ?', /* … */],
    antiFatalLine: 'Lá số là hạt giống, không phải cái cây — chăm thì lớn.',
    crisisLead: 'Con ơi, thầy đặt chén trà xuống. Chuyện con vừa nói lớn hơn mọi lá số. Thầy muốn con nói ngay với một người thật ở bên con.',
    prompt: `[PERSONA-van_coc · v1] …`,   // nguyên văn 06-02 §9
  },
  // …
};
```

---

## 4. Ma trận lịch 20 × 12 giờ

Ký hiệu:

- **●** nói đầy đủ (có thể AI);
- **○** câu ngắn / hoạt cảnh;
- **z** ngủ (`FREE.SLEEP`);
- **—** vắng mặt;
- **∗** sự kiện theo ngày (xem bible).

| NPC | Tý | Sửu | Dần | Mão | Thìn | Tỵ | Ngọ | Mùi | Thân | Dậu | Tuất | Hợi |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| thay_tubinh | z | z | ○ | ○ | ● | ● | ○ | ●∗ | ● | ○ | ● | ● |
| khong_tiensinh | z | z | z | ○ | ●∗ | ●∗ | ●∗ | ○ | ●∗ | ○ | ● | z |
| van_coc | ○ | z | ○ | ● | ● | ● | ○ | ○ | ● | ○ | ● | ●∗ |
| truong_thiensu | ○ | z | — | ○ | ● | ● | ○ | ● | ● | ○ | ●∗ | ● |
| huyen_hu | z | z | ○ | ● | ● | ○ | ○ | ○ | ● | ○ | ○ | z |
| khau_daotruong | z | z | ○ | ○ | ● | ● | ○ | ● | ● | ○ | ● | ● |
| maoshan_daonhan | ○∗ | z | z | ○ | ● | ● | ○ | ● | ● | ○ | ● | ● |
| truclam_thiensu | ○ | ○ | ○ | ○ | ● | ○ | ○ | ●∗ | ● | ○ | ● | ● |
| dieu_am | z | z | ○ | ●∗ | ● | ● | ○ | ● | ●∗ | ○ | ● | ● |
| lama_dakiet | ○ | ○ | ○ | ○ | ● | ● | ● | ● | ○ | ○ | ● | ● |
| te_tuu | ● | z | z | ○ | ● | ● | ○ | ● | ● | ○∗ | ● | ● |
| phan_quan | ● | ● | ● | ● | ● | ● | ○ | ● | ● | ● | ● | ●∗ |
| diatang_su | ● | ● | ●∗ | ● | ● | ● | ● | ● | ● | ● | ● | ●∗ |
| vu_y_amau | z | z | ○ | ○ | ● | ● | ○ | z | ○ | ○ | ●∗ | z |
| lo_ban_su | ∗ | ∗ | ∗ | ∗ | ∗ | ∗ | ∗ | ∗ | ∗ | ∗ | ∗ | ∗ |
| dinh_menh_hoi (quầy) | — | — | — | — | ● | ● | ● | ● | ● | ● | ○ | — |
| gac_cong | z | z | z | ○ | ● | ● | ● | ○ | ● | ○ | ● | ○ |
| tho_may | z | z | z | z | ● | ● | ● | ○ | ● | ● | ○ | ○ |
| dan_dinh | z | z | ○ | ○ | ● | ● | ○ | ○ | ● | ○ | ○ | ○ |
| phuong_si | ∗ | ∗ | ∗ | ∗ | ∗ | ∗ | ∗ | ∗ | ∗ | ∗ | ∗ | ∗ |

**Kiểm tra phủ:**

- **Mọi khung giờ có ít nhất 3 NPC chính nói đầy đủ (●).** Giờ Sửu thấp nhất: phan_quan, diatang_su, và thoại trà đêm của Tế tửu kéo sang đầu Sửu (Tý ●).
- **Người chơi đêm khuya không bị bỏ rơi:**
  - Phong Đô luôn mở;
  - «Bùa Gọi Thầy» (06-01 §15) gọi được NPC chính ở mọi giờ.

---

## 5. Ánh xạ chỗ chèn `{…}` → nguồn dữ liệu

> Mọi trường dưới đây đều **có thật** trong engine / game, hoặc được đánh dấu **(chưa có — cần làm)**.
> Hàm định dạng (`*Vi`) là hàm nhỏ trong game: tra `WX_VI`, `GAN[...].vi`, `ZHI[...].vi`, `TEN_GOD_VI` của `constants.js`.

### 5.1 Lá số

| Chỗ chèn | Nguồn |
|---|---|
| `{score}` | `R.synthesis.score` |
| `{gradeVi}` | `R.synthesis.gradeVi` |
| `{percentile}` | `R.synthesis.percentile` |
| `{phamCan}` | ánh xạ ngưỡng canon §5 (28/36/43/50/58/66/73/80/86) |
| `{nghichThien}` | `clamp(1 + (60 − score)/100, 1.0, 1.5)` (canon §5), làm tròn 2 số |
| `{synthesis.factors[i]}` | `R.synthesis.factors[i]` |
| `{dayMaster.vi}` | `GAN[R.chart.pillars.day.gan].vi` |
| `{monthZhi.vi}` | `ZHI[R.chart.monthZhi].vi` |
| `{imageLine}` | rút gọn câu đầu `R.synthesis.paragraphs[0]` (≤ 12 chữ) **(chưa có — cần làm: hàm rút gọn)** |
| `{year.ganZhi}` … `{time.ganZhi}` | `R.chart.pillars.{year,month,day,time}.gan + zhi` |
| `{yearZhi.vi}` | `ZHI[R.chart.pillars.year.zhi].vi` |
| `{wxLine}` | `R.wx.pct` sắp giảm dần, dạng «Kim 55% · Hỏa …» |
| `{wx.maxVi}` / `{wx.minVi}` | hành lớn nhất / nhỏ nhất trong `R.wx.pct` |
| `{strength.levelVi}` | `R.strength.level` |
| `{yongVi}` / `{xiVi}` / `{jiVi}` | `WX_VI[R.yong.primary / xi / ji]` |
| `{pattern.vi}` | `R.pattern.vi` |
| `{dominantVi}` | hành chiếm `wx.pct` cao nhất (cho Dị Cách) |
| `{diagnosis[0].t}` | `gaimenhPlan(R).diagnosis[0].t` |
| `{menhDo.firstPri}` | tên tầng `pri` nhỏ nhất chưa xong trong `gaimenhPlan(R).layers` (ghép trạng thái game) |
| `{diseases[n].noteShort}` | `R.patternQuality.diseases[n].note` cắt tới dấu «→» |
| `{plainDisease}` | bảng dịch đời thường theo `via` (`dang`, `duo`, …) **(chưa có — cần làm: 10–15 dòng)** |
| `{rescues[0].drug}` / `{drugVi}` / `{drugPlain}` | `R.patternQuality.rescues[0].drug[0]` → bảng 06-11 C2 |
| `{region1}` / `{region2}` | bảng 06-11 C2 theo `drug` |
| `{yeguo[0].karma}` | `getYeguoForChart(R)[0].karma` |
| `{topPoison}` / `{topPoisonPct}` | `computeLiuDao(R).poisons` — lớn nhất trong `tham`, `san`, `si` |
| `{liudao.primaryVi}` | `computeLiuDao(R).primary` → tên Việt |
| `{fiveDim.dominantVi}` | `fiveDimRadar(R.chart).dominant` → Thương / Trị / Học / Nghệ / Đồng đạo |
| `{shensha.listVi}` | `Object.keys(R.shensha)` → `SHENSHA_INFO[k].vi` (tối đa 4) |
| `{amtaSignals}` | mục ÂM TÀ của brief (chỉ khi `amtaOptIn`) — chỉ lấy tên tín hiệu |
| `{wealthStar.lineVi}` | `extendBrief` mục tài tinh (`analyzeWealthStar`) — câu đầu |
| `{spousePalace.elementVi}` / `{spouse.zhiVi}` | nhật chi `R.chart.pillars.day.zhi` + hành |
| `{marriageWindow[0]}` | `scanMarriageTiming` (ai.js import) — năm đầu |
| `{benmingStar}` | bảng 06-05 §6 theo chi năm **(chưa có — cần làm: hàm tra)** |

### 5.2 Vận hạn

| Chỗ chèn | Nguồn |
|---|---|
| `{liunianNow.ganZhi}` / `{score}` / `{godVi}` / `{oneLine}` / `{advice[0]}` | `R.liunian.find(isNow)` + `analyzeLiunianDeep` (đã import trong ai.js) |
| `{dayunNow.*}` / `{dayunNext.*}` / `{nextDayun.age}` | `R.dayun[current]`, `R.dayun[current+1]` (startAge, endAge, ganZhi, rating) |
| `{dayunWithDrug}` / `{dayunShun}` | đại vận có `gejuDelta > 0` (tag ★RESCUES / ★格局喜 trong brief) |
| `{dayunWorsen}` / `{dayunNi}` | đại vận có `gejuDelta < 0` |
| `{worstYear.*}` | lưu niên điểm thấp nhất **10 năm tới** (canon Hồi III). **Cảnh báo đo thật:** `R.liunian` là cửa sổ 10 năm quanh tuổi, **không** luôn hướng tới tương lai — MAU-A trả 2017–2026, kết thúc đúng năm nay. Phải tính riêng bằng `analyzeLiunianDeep` cho từng năm `now+1 … now+10` (hoặc `forecast5` / `decadeForecast` đã import trong `ai.js`) **(chưa có — cần làm: hàm `worstYearAhead(R, 10)`)** |
| `{liuyue.ganZhi}` / `{rating}` / `{best[0]}` / `{worst[0]}` | `computeLiuyue(R, year, R.patternQuality)` |
| `{taisui.relationsVi}` | `personalTaSui` (brief-extender import) / `taiSuiOverview` |
| `{studyYear}` | năm gần nhất có Ấn tinh tới theo `liunian` (lọc thập thần năm ∈ Chính / Thiên Ấn) |
| `{goodDay}` / `{bestHour.*}` | công cụ `find_good_days` / `analyze_best_hour` qua `execTool` (kịch bản gọi trực tiếp, không qua AI) |
| `{goodDirs}` / `{satDirs}` / `{satDir}` / `{compass.verdict}` / `{house.dir}` | `execTool('fengshui_direction', …)`; hướng nhà từ trạng thái game nhà ở (07/08) |
| `{chiNow}` / `{meridian}` / `{advice}` | `execTool('health_hour', {})` |
| `{dayElementVi}` | hành can ngày hiện tại (`lunar-javascript`) |
| `{jieqi}` | tiết khí hiện tại (`lunar-javascript`) |

### 5.3 Game

| Chỗ chèn | Nguồn |
|---|---|
| `{merit.net}` / `{merit.thienN}` / `{merit.acN}` | `meritLedger(state.meritLog)` **(trường `state.meritLog` chưa có — cần làm, 05)** |
| `{merit.thienDuringTaLo}` | lọc log theo cờ Tà Lộ |
| `{taLo.noAm}` / `{victims[]}` / `{remaining}` | trạng thái Tà Lộ (05) |
| `{daoHieu}` | `state.daoHieu` đã làm sạch (06-01 §5.3) **(chưa có)** |
| `{npc.call}` / `{npc.age}` / `{npc.job}` / `{npc.question}` | `makeNpc` (đã có) |
| `{weakest}` | bước điểm thấp nhất từ `gradeStep` (`cases.js`) |
| `{userClaim}` | cụm khớp `PREMISE_TO_INDICATOR[*].premiseHint` |
| `{lessonByCan}` / `{hallSuggest}` / `{nextPlace}` / `{setByYong}` | bảng tĩnh trong bible (06-04 TB.20, 06-04 TB.21, 06-11 D6, `cosmetics.js` set theo Dụng) |
| `{cultHint}` | `daozang › _YONG2CULT[R.yong.primary]` |
| `{topic}` / `{shelf}` / `{title}` | `suggestDaozangByQuestion` (khi có `daozang_lookup`) |
| `{koan[n]}` | bảng 06-09 A6 |
| `{claim}` / `{fact}` / `{trueFact1}` / `{falsePremise}` / `{threat}` / `{price}` / `{deadline}` / `{indicator}` / `{debunkLine}` / `{freeRemedy}` / `{thirdParty}` | tham số án (06-10 C3, 03 cấp) |
| `{foodHint}` / `{organHint}` | `execTool('health_profile' / 'health_today')` → câu đầu phần ăn uống / tạng |
| `{yongPlace}` | bảng 06-08 A8 (Mộc: rừng; Hỏa: nắng sớm; Thổ: sân đất; Kim: đỉnh đá; Thủy: bên suối) |
| `{overlap}` | giao giữa tầng Mệnh Đồ «đang» và vùng thuốc 06-11 C2 |
| `{yearGanZhi}` | can chi năm mới |

---

## 6. Việc kỹ thuật (đề xuất cho tài liệu 13 cấp `TASK-*`)

| # | Việc | Tệp | Phụ thuộc | Ước lượng |
|---|---|---|---|---|
| 1 | `askAI` nhận `persona`, `gameContext`, `toolsAllow`; thứ tự message §4; `max_tokens` khi có persona; `meta.toolDenied`, `meta.briefSent` (test) | `src/engine/ai.js` | — | 2 ngày |
| 2 | Lọc brief: bỏ mục ÂM TÀ khi chưa opt-in; `briefMode` | `src/engine/ai.js` | 1 | 0,5 ngày |
| 3 | Tuần tự hoá + làm sạch `gameContext` | `src/game/npc-context.js` (mới) | 1 | 1 ngày |
| 4 | Bộ lọc V1–V8 theo câu khi stream | `src/game/npc-filter.js` (mới) | 3 | 2 ngày |
| 5 | `crisisCheck` + khối hỗ trợ + cờ 30 phút | `src/game/crisis.js` (mới) | — | 1,5 ngày |
| 6 | Sổ persona + PERSONA-CHUNG | `src/game/npc-personas.js` (mới) | 1 | 1 ngày (mã) + nhập văn |
| 7 | Khung thoại NPC tổng quát (mở rộng `master-ui.js` → `npc-chat-ui.js`): trạng thái §7, nhãn trong vai, gợi ý | `src/game/` | 4, 5, 6 | 3 ngày |
| 8 | Bộ chạy cây thoại kịch bản + chèn `{…}` | `src/game/dialogue.js` (mới) | §5 | 3 ngày |
| 9 | Hạn mức ngày (client + KV `aiq:`) + 429 `quota` | `src/game/state.js`, `worker/index.js` | — | 1 ngày |
| 10 | Cache câu mở đầu (IndexedDB) | `src/game/npc-cache.js` (mới) | 6 | 1 ngày |
| 11 | Sự kiện `ai_npc` (không câu chữ) + nút 👎 gửi tự nguyện | `src/game/`, `worker/admin.js` | 7 | 1 ngày |
| 12 | Công tắc `npcAiOff:<id>`, `personaVersion:<id>` | `worker/admin.js` | 11 | 1 ngày |
| 13 | Bark: hệ chọn theo điều kiện, cooldown | `src/game/bark.js` (mới) | — | 1,5 ngày |
| 14 | Lịch NPC theo giờ can chi + «Bùa Gọi Thầy» | `src/game/schedule.js` (mới) | 07 (vị trí) | 2 ngày |
| 15 | `NPC_EPOCH = 2026` cho `makeNpc` của NPC phụ | `src/game/npc.js` | — | 0,1 ngày |
| 16 | Chế độ thiếu niên | `src/game/` | 5 | 1 ngày |
| 17 | `neo-checker`: sửa phép 4 (sao bái Đẩu), phép 5 (kể đủ lục đạo) | `src/engine/neo-checker.js` | — | 0,5 ngày |
| 18 | Công cụ `daozang_lookup` (bọc `suggestDaozangByQuestion`) | `src/engine/ai.js` | — | 0,5 ngày |
| 19 | Công cụ `analyze_amta` (bọc `amta-analyze`, chỉ khi opt-in) — **cân nhắc**: chỉ làm nếu brief không đủ | `src/engine/ai.js` | 2 | 1 ngày |
| 20 | Bộ đánh giá `scripts/test-npc-ai.mjs` + JSONL | `scripts/`, `tests/npc-ai/` | 1–6 | 3 ngày |
| 21 | Thêm DP9 «áp lực thời hạn» vào `anti-manipulation-data` | `src/engine/anti-manipulation-data.js` | — | 0,5 ngày |

**Tổng ước lượng:** khoảng 30 ngày công cho một lập trình viên, chưa tính nhập liệu văn bản và vòng duyệt.
