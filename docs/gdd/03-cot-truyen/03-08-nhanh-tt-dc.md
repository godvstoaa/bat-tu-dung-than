# 03 · Phần 08 — Nhánh Thuận Thiên (`BR-TT-01…07`) và Đắc Cứu (`BR-DC-01…07`)

> Nhánh theo Mệnh Cách mở ở `MQ-P-08` (luật xếp nhánh: README §2.2). Mỗi nhánh có **mở đầu riêng** (Hồi I, trong Huyền Thành), **thân** chạy song song Hồi II–III, và **kết riêng** (cảnh cắt CUT-041 / CUT-042) trước Vĩ thanh.
> Lá số minh họa: Thuận Thiên — **TT-1** (1976-12-05 10:00 nam: 丙辰 己亥 辛卯 癸巳; Thương Quan cách **成格**; điểm 71 «THƯỢNG ĐẲNG · Hiếm» → Song Linh Căn; Thân quá nhược; Dụng Thủy (điều hậu), Hỷ Kim, Kỵ Thổ; Mệnh Cấp Thanh Quý; Ngũ Duy: Thực 100, Ấn 95, Tài 90, Quan 90, Tỷ 25). Đắc Cứu — **MAU-A** (Thất Sát cách **有救**; bệnh: Tài đảng Sát không chế, Kiêu đoạt thực; thuốc: Thực Thần `shi`, Tài `cai`).

## 0. Lịch nhánh so với tuyến chính

| Nhánh | Hồi I (Huyền Thành) | Hồi II | Hồi III | Trước Vĩ thanh |
|---|---|---|---|---|
| TT | BR-TT-01, 02 | BR-TT-03, 04, 05 | BR-TT-06 | BR-TT-07 |
| DC | BR-DC-01 | BR-DC-02 … 06 (chỉ các vị có trong `rescues[].drug` của lá số) | — | BR-DC-07 |

Tổng thưởng nhánh: TT — Đạo Hạnh gốc 225 · Phúc Khí 190; DC — Đạo Hạnh gốc 60 + 30 × số vị + 60 (MAU-A hai vị: 180) · Phúc Khí 50 + 25 × số vị + 50.

---

# A. THUẬN THIÊN (成格)

**Câu hỏi của nhánh:** khi trời cho sẵn một cái khung tốt, người ta mất nó bằng cách nào? Đáp án nhánh: bằng **kiêu** (tâm ma «mạn», §4.2 bản sơ đồ — Thiên Linh Căn «thử thách chính: kiêu ngạo») và bằng **không biết khung có lúc bị vận phá** (`adjustDayunByGeju`).

## BR-TT-01 · Tổ Sư điểm danh

| Trường | Giá trị |
|---|---|
| Mã | BR-TT-01 |
| Tên | Tổ Sư điểm danh |
| Vùng | `thanh` — Tổ Sư Đường, Bàn Thầy |
| Điều kiện | MQ-P-08 với `F_BRANCH = TT` |
| Người giao | `thay_tubinh` |
| Mục tiêu | 1. Nhận việc đầu tiên của đệ tử chính thức: châm đèn Tổ Sư Đường mỗi tối (7 tối). 2. Nghe Thầy đọc «khung» của lá số: cách, cái cách ưa, cái cách kỵ. 3. Ghi ba điều Quán dặn đệ tử. 4. Dẫn một **khách học** (người chơi khác nhánh NT trong cùng máy chủ, hoặc NPC «Hứa Khang» khi chơi đơn) ngồi Bàn Thầy một buổi. |
| Móc engine | `patternQuality.{quality, keyStar, patternYong.{yong, xi, ji}, note}` (TT-1: cách thần 壬 Thương Quan, có gốc ở 亥; «Thương Quan nghịch dụng — dùng Ấn chế thương hoặc Tài hóa thương; tối kỵ thương quan kiến quan»; Hỷ: Tài (Mộc), Ấn (Thổ); Kỵ: Quan Sát (Hỏa)); `chart-level › classifyChartLevel` |
| Thưởng | Đạo Hạnh +20 · Phúc Khí +20 · chìa khóa Tổ Sư Đường |
| Bỏ dở | Quên châm đèn một tối: Lão Tùng châm thay, nói «Lão châm một lần. Lần sau cháu châm.» Không trừ gì; đếm 7 tối không cần liên tục. |
| Cờ đặt | `F_TT_DEN`, `F_TT_DAN_KHACH` |

```
[CẢNH BR-TT-01.1 · Tổ Sư Đường · giờ Dậu]
THẦY TỬ BÌNH: Đệ tử chính thức thì có việc. Việc đầu tiên: mỗi tối giờ Dậu, châm đèn trước khám Tổ Sư. Bảy tối.
THẦY TỬ BÌNH: Đèn này hôm con tới tự sáng thêm một nấc. Từ giờ nó không tự sáng nữa. Con châm.
THẦY TỬ BÌNH: Lá số con thầy đọc lại cho con một lần nữa, chậm hơn hôm lật trụ.
THẦY TỬ BÌNH: Cách con là {Thương Quan cách}. Cách thần là chữ {Nhâm} — Thương Quan — giấu trong chi {Hợi}, có gốc. Cách thành, khung nguyên vẹn.
THẦY TỬ BÌNH: Thương Quan là cái tài bật ra khỏi khuôn. Sách dặn: nuôi nó bằng Ấn — chữ nghĩa, kiên nhẫn — hoặc cho nó đi ra thành Tài — làm ra cái có ích. Sách cấm: Thương Quan gặp Quan. Cái tài đi húc vào phép tắc.
> Lựa chọn:
>   ① [Hỏi] «Gặp Quan là sao, thưa thầy?» → THẦY: «Là lúc con giỏi hơn người đứng trên con, và con để họ biết điều đó theo cách họ không chịu nổi.»
>   ② [Thẳng] «Con sẽ tránh.» → THẦY: «Tránh không được. Đời nào cũng có người đứng trên. Học cách đứng dưới mà không cúi đầu, không húc.»
```

```
[CẢNH BR-TT-01.2 · Bàn Thầy · ba điều dặn đệ tử]
THẦY TỬ BÌNH: Quán dặn đệ tử ba điều, đời nào cũng vậy.
THẦY TỬ BÌNH: Một: đọc lá số người khác như đọc lá số của mẹ mình. Không cười, không chê.
THẦY TỬ BÌNH: Hai: lá số tốt không phải công của mình. Lá số xấu không phải lỗi của người ta.
THẦY TỬ BÌNH: Ba: không bao giờ nói «số anh vậy rồi».
(Ba điều hiện trong Sổ Mệnh, mục «Lời dặn».)
```

```
[CẢNH BR-TT-01.3 · Bàn Thầy · dẫn khách học]
(Chơi đơn: Hứa Khang, 17 tuổi, khách học hai năm, đèn Tổ Sư Đường chưa sáng với cậu.)
HỨA KHANG: (không nhìn) Người mới vào là được nhận liền hả. Đèn sáng liền. Hay ghê.
> Lựa chọn:
>   ① [Thẳng] «Đèn sáng với tôi không có nghĩa tôi giỏi hơn cậu.» → HỨA KHANG: «Ai cũng nói vậy.» → [01.4]
>   ② [Mềm] «Cậu ngồi bàn này hai năm. Cậu chỉ tôi cách lập trụ nhanh đi.» → HỨA KHANG: (ngạc nhiên) «…Ừ. Ngồi đây.» → [01.4] (+ cờ phụ `F_TT_HOI_KHANG`)
>   ③ [Kiêu] «Lá số tôi bảy mươi mốt điểm. Đèn sáng là phải.» → (lựa chọn gắn nhãn [Mạn]; tâm ma «mạn» trong Sổ tăng nhẹ — số liệu tập 05) → HỨA KHANG: (đứng dậy bỏ đi) → làm lại hôm sau
```

```
[CẢNH BR-TT-01.4 · Một buổi án đôi]
(Hai người cùng giải một án khách — cơ chế án hợp tác đã có (`COOP_STEP_POINTS`). Hứa Khang làm nhanh bước Lập trụ; người chơi làm bước Dụng thần.)
HỨA KHANG: (khi xong) Cậu / cô Dụng thần giỏi. Tôi lập trụ giỏi. (cười lần đầu) Thầy nói bàn này hai người ngồi thì nhanh hơn.
THẦY TỬ BÌNH: (từ xa, nói với người chơi) Đèn sáng với con thì con châm đèn. Đèn chưa sáng với người khác thì con ngồi cạnh người đó. Đệ tử là vậy.
```

---

## BR-TT-02 · Người mua lá số

| Trường | Giá trị |
|---|---|
| Mã | BR-TT-02 |
| Tên | Người mua lá số |
| Vùng | `thanh` — dinh Viên ngoại Đỗ Kỳ (phố Bàn Đài), sảnh Hợp Hôn (−48, 8) |
| Điều kiện | BR-TT-01 |
| Người giao | Viên ngoại Đỗ Kỳ; con trai Đỗ Minh |
| Mục tiêu | 1. Nghe đề nghị mua ngày giờ sinh và lá số của người chơi. 2. Từ chối (hoặc chọn «nghe tiếp»). 3. Gặp Đỗ Minh. 4. Ngồi sảnh Hợp Hôn với **lá số thật** của Đỗ Minh và cô gái được mai mối (cả hai tự đưa ngày sinh). 5. Nói thật với Viên ngoại. |
| Móc engine | Quyền riêng tư ngày sinh (§14 bản sơ đồ: «ngày sinh chỉ lưu trên máy»); `anti-manipulation-data` RB3; `hehun › computeHehun` (sảnh Hợp Hôn đã có: `halls › buildHopHon`) cho đôi Đỗ Minh – Thu Hà |
| Thưởng | Đạo Hạnh +25 · Phúc Khí +20 · DEED-T08 Giữ lời, không dối (+1) · DEED-T09 (+1) |
| Bỏ dở | — |
| Cờ đặt | `F_TT_BAN_SO ∈ {tu_choi, nghe_tiep}` |

```
[CẢNH BR-TT-02.1 · Dinh Đỗ Kỳ · giờ Mùi · sập gụ, bình cổ]
VIÊN NGOẠI ĐỖ KỲ: Nghe nói đệ tử mới của Quán có lá số song linh căn. Thương Quan cách thành. Ta muốn mua.
VIÊN NGOẠI ĐỖ KỲ: Không mua người. Mua tám chữ. Ngày giờ sinh của cậu / cô, ta ghi vào thiếp mai mối cho thằng con ta. Nhà gái xem thiếp thấy lá số tốt thì gả. Năm mươi lượng.
VIÊN NGOẠI ĐỖ KỲ: Lá số là chữ. Chữ thì ai chép cũng được.
> Lựa chọn:
>   ① [Thẳng] «Lá số không phải chữ để chép. Không bán.» → [02.2a] tu_choi
>   ② [Hỏi] «Con trai ông có biết chuyện này không?» → [02.2b] nghe_tiep
>   ③ [Kiêu] «Lá số tôi đáng hơn năm mươi lượng.» → (nhãn [Mạn]) VIÊN NGOẠI: «Vậy một trăm.» → buộc chọn lại ① hoặc ②
```

```
[CẢNH BR-TT-02.2a · Từ chối]
VIÊN NGOẠI ĐỖ KỲ: Không bán thì thôi. Thiên hạ thiếu gì lá số tốt.
NGƯỜI CHƠI: (tự động) Thiên hạ thiếu gì lá số tốt. Nhưng nhà gái lấy con ông, không lấy lá số của tôi.
VIÊN NGOẠI ĐỖ KỲ: (nhíu mày, phẩy tay) Tiễn khách.
(Đỗ Minh — chàng trai gầy, đứng sau rèm — chạy theo người chơi ra cổng → [02.3])
```

```
[CẢNH BR-TT-02.2b · Nghe tiếp]
VIÊN NGOẠI ĐỖ KỲ: Biết làm gì. Nó lá số trung bình. Nhà gái chê. Ta mượn lá số tốt, cưới xong ai mà xem lại.
(Đỗ Minh bước ra từ sau rèm.)
ĐỖ MINH: Con biết. Con không muốn. Con với cô Thu Hà… tụi con muốn tự đưa lá số thật.
→ [02.3]
```

```
[CẢNH BR-TT-02.3 · Sảnh Hợp Hôn · giờ Thân]
(Đỗ Minh và Thu Hà mỗi người tự đọc ngày sinh — đồng thuận trong truyện. Sảnh Hợp Hôn chạy `computeHehun` thật trên hai lá số do máy nhiệm vụ cấp hạt cố định. Kết quả chỉ hiện các mục của sảnh đã có: hợp / xung theo nạp âm, nhật chủ, cung phu thê. Không có câu «chắc hạnh phúc» / «chắc tan vỡ» — RB2.)
THẦY SẢNH HỢP HÔN: (đọc) Hai lá số {điểm hợp …}. Có chỗ hợp, có chỗ phải nhường. Lá số không cưới thay ai.
THU HÀ: Vậy nhà tôi xem lá số thật của anh Minh, thấy chỗ phải nhường, thì sao?
NGƯỜI CHƠI: (lựa chọn)
>   ① «Thì nhà cô biết trước phải nhường ở đâu. Còn hơn cưới lá số của người khác rồi tới lúc nhường thì không biết nhường gì.» → THU HÀ: (cười) «Nghe có lý.»
>   ② «Thì hai người tự quyết. Lá số chỉ là chỗ để bàn.» → ĐỖ MINH: «Tụi con quyết rồi.»
```

```
[CẢNH BR-TT-02.4 · Dinh Đỗ Kỳ · nói thật]
(Đỗ Minh, Thu Hà, người chơi đứng trước Viên ngoại.)
ĐỖ MINH: Cha. Nhà Thu Hà đã xem lá số thật của con. Họ đồng ý.
VIÊN NGOẠI ĐỖ KỲ: (im lâu, nhìn người chơi) Lá số trung bình mà cũng gả.
NGƯỜI CHƠI: (tự động) Nhà gái gả cho anh Minh, không gả cho con số.
VIÊN NGOẠI ĐỖ KỲ: (thở ra) …Năm mươi lượng ta định mua lá số, ta làm lễ cưới cho to.
(DEED-T08 +1 — giữ lời không đưa ngày sinh; DEED-T09 +1 — khuyên người làm điều thật.)
THẦY TỬ BÌNH: (khi người chơi kể lại) Lá số tốt người ta muốn mua. Lá số xấu người ta muốn bán. Cả hai đều không bán được. Con nhớ cảm giác lúc ông ấy nói «năm mươi lượng». Mai mốt còn có người trả cao hơn.
```

---

## BR-TT-03 · Cách và vận

| Trường | Giá trị |
|---|---|
| Mã | BR-TT-03 |
| Tên | Cách và vận |
| Vùng | `thanh` — Vận Mệnh Các |
| Điều kiện | BR-TT-02; MQ-1-14 |
| Người giao | `thay_tubinh` |
| Mục tiêu | 1. Tìm trong Vận Mệnh Các hai loại cổng: **vận cách-thuận** và **vận cách-nghịch**. 2. Đứng ở cổng cách-nghịch đầu tiên. 3. Viết một lá thư cho chính mình ở tuổi bắt đầu cổng ấy. 4. Gửi thư vào hộp gỗ của Vận Mệnh Các. |
| Móc engine | `synthesis.paragraphs` (dòng «Theo 格局 (子平真詮 ch.10-11): vận cách-thuận = …; vận cách-nghịch = …» — kết quả của `pattern-quality › adjustDayunByGeju`). TT-1: **cách-thuận** 甲辰 (42), 乙巳 (52), 戊申 (82), 己酉 (92); **cách-nghịch** 丙午 (62, năm 2037, Hung), 丁未 (72, năm 2047, Hung). `vanmenh › vanMenh` (cổng hiện tại 甲辰, Bình hòa) |
| iOS | Thay bằng «thư cho mình mười năm sau» không gắn đại vận |
| Thưởng | Đạo Hạnh +25 · Phúc Khí +20 |
| Bỏ dở | — |
| Cờ đặt | `F_TT_THU_TUONG_LAI` (nội dung thư, lưu cục bộ) |

```
[CẢNH BR-TT-03.1 · Vận Mệnh Các · giờ Thìn]
THẦY TỬ BÌNH: Lá số thành cách thì người ta hay quên một điều: cách thành là thành trong tám chữ. Vận đi qua thì có vận giữ cách, có vận phá cách.
THẦY TỬ BÌNH: Sách Tử Bình Chân Thuyên chia vận theo cách. Lá số con: vận thuận cách là {Giáp Thìn — 42 tuổi}, {Ất Tỵ — 52}, {Mậu Thân — 82}, {Kỷ Dậu — 92}. Vận nghịch cách là {Bính Ngọ — 62} và {Đinh Mùi — 72}.
THẦY TỬ BÌNH: Bính, Đinh là Hỏa. Hỏa với lá số con là Quan Sát. Thương Quan gặp Quan. Cái sách cấm, vận sẽ mang tới cửa.
(Cổng 丙午 — 62–71 tuổi, từ 2037 — được đánh dấu viền đỏ trong Các.)
> Lựa chọn:
>   ① [Hỏi] «Tới vận đó con làm gì?» → THẦY: «Thầy không biết con năm sáu mươi hai tuổi. Con năm sáu mươi hai biết. Viết thư hỏi người đó.» → [03.2]
>   ② [Thẳng] «Còn mười một năm nữa.» → THẦY: «Mười một năm là đủ để quên. Viết xuống.» → [03.2]
```

```
[CẢNH BR-TT-03.2 · Bàn viết trong Các]
(Ô nhập tự do ≤ 120 chữ. Gợi ý mờ: «Gửi tôi năm 62 tuổi. Năm nay tôi …». Lọc nội dung chung.)
THẦY TỬ BÌNH: Thư này nằm trong hộp gỗ. Khi nào trong game tới năm con bước vào cổng đó, hộp tự mở. (nếu năm thật còn xa:) Nếu con chơi tới Vĩ thanh trước, lão Vân Cốc sẽ đọc lại cho con ở Dao Trì.
(Ghi chú hệ thống: thư lưu **chỉ trên máy** cùng lá số; không gửi máy chủ.)
```

---

## BR-TT-04 · Tâm ma Mạn

| Trường | Giá trị |
|---|---|
| Mã | BR-TT-04 |
| Tên | Tâm ma Mạn |
| Vùng | `yentu` — đường hành hương Yên Tử: suối Giải Oan → chùa Hoa Yên |
| Điều kiện | BR-TT-03; đã tới `yentu` |
| Người giao | `truclam_thiensu` Thiền sư Pháp Không |
| Mục tiêu | 1. Gánh nước cho chùa Hoa Yên từ suối Giải Oan (3 chuyến). 2. Trên đường, nghe khách hành hương khen «đệ tử song linh căn». 3. Gặp một lão tăng áo vá ngồi bên đường xin nước. 4. Ngồi một công án. |
| Móc engine | `remedy-fate › REMEDY_QUOTES[3]` «満招損，謙受益 — Kiêu đầy thì tổn; khiêm nhường thì được lợi» (Thượng Thư · Khiêm Đức); `BAZI_HUAJIE` mục «Thương Quan kiến Quan» — tâm pháp «忍辱谦下 nhẫn nhường khiêm hạ», nghiệp «消傲慢业 tiêu nghiệp ngạo mạn» |
| Thưởng | Đạo Hạnh +30 · Phúc Khí +25 · tâm ma «mạn» giảm (tập 05) |
| Bỏ dở | Đổ nước: gánh lại, không trừ. |
| Cờ đặt | `F_TT_MAN` (số lựa chọn [Mạn] trong nhiệm vụ: 0–3) |

```
[CẢNH BR-TT-04.1 · Suối Giải Oan · giờ Mão · sương tùng]
CHÚ TIỂU MINH TÂM: Sư phụ bảo người mới lên thì gánh nước trước. Ba chuyến. Đừng hỏi vì sao.
(Gánh nước: mini-game giữ thăng bằng trên bậc đá rêu.)
KHÁCH HÀNH HƯƠNG 1: (nhìn khung tên người chơi) Song Linh Căn! Thanh Quý! Người cỡ này mà gánh nước à?
KHÁCH HÀNH HƯƠNG 2: Lá số đẹp thế thì lên đây làm gì nữa, tu cũng thành.
> Lựa chọn:
>   ① [Mạn] «Ừ, lá số tôi tốt thật.» → (nhãn [Mạn], F_TT_MAN +1)
>   ② «Nước thì ai gánh cũng nặng như nhau.» → KHÁCH 1: (cười) «Nói hay.»
>   ③ (im, gánh tiếp)
```

```
[CẢNH BR-TT-04.2 · Gốc tùng ven đường · lão tăng áo vá]
(Một ông sư già, áo vá chằng chịt, ngồi gốc tùng, chìa bát gỗ.)
LÃO TĂNG ÁO VÁ: Cho ta xin ngụm nước.
> Lựa chọn:
>   ① Rót nước từ gánh (gánh vơi, phải quay lại suối thêm một chuyến) → [04.3a]
>   ② [Mạn] «Nước này của chùa, cụ lên chùa xin.» → (F_TT_MAN +1) → [04.3b]
```

```
[CẢNH BR-TT-04.3a]
LÃO TĂNG ÁO VÁ: (uống) Nước suối Giải Oan ngọt. Người gánh nước có lá số đẹp, nghe nói. Nước có biết lá số người gánh không?
> ① «Không.» → LÃO TĂNG: «Vậy nước ngọt vì nước.» ② «Lá số không làm nước ngọt hơn.» → LÃO TĂNG: «Thế lá số làm gì?» (không chờ trả lời)
(Lão tăng đứng dậy, đi trước lên chùa. → [04.4])
```

```
[CẢNH BR-TT-04.3b]
LÃO TĂNG ÁO VÁ: Ừ. (đứng dậy, đi trước lên chùa)
(→ [04.4]; tại chùa người chơi nhận ra đó là Thiền sư Pháp Không.)
```

```
[CẢNH BR-TT-04.4 · Sân chùa Hoa Yên · thiền sư hiện ra]
(Lão tăng áo vá ngồi trên bồ đoàn giữa sân. Chú tiểu Minh Tâm cúi chào ông: «Bạch sư phụ.»)
PHÁP KHÔNG: (với ③ / ①) Con gánh vơi một chuyến vì ta. Thêm một chuyến. Không ai trả công chuyến đó.
PHÁP KHÔNG: (với ②) Con giữ nước cho chùa. Đúng. Ta là chùa.
PHÁP KHÔNG: Ngồi. Ta hỏi một câu. Không có đáp án.
PHÁP KHÔNG: Cái đầy thì không rót thêm được. Con đầy chưa?
⟨AI tự do: persona Thiền sư Trúc Lâm · ít lời, công án · forbid: đoán vận · chấm bằng số lần người chơi quay lại câu hỏi⟩
(AI tắt: ba lựa chọn — «Con chưa đầy.» / «Con không biết.» / im lặng 60 giây. PHÁP KHÔNG đáp chung: «Người nói chưa đầy hay đầy nhất. Người im thì còn chỗ.» — với lựa chọn im: «Ừ.»)
PHÁP KHÔNG: Sách đời xưa có câu: đầy thì tổn, khiêm thì được. Ở trên núi này thì đơn giản hơn: bát úp thì không hứng được nước.
(Nếu F_TT_MAN ≥ 2: PHÁP KHÔNG thêm: «Hôm nay con nói "tôi tốt" hai lần. Đếm được thì bớt được.»)
```

---

## BR-TT-05 · Học trò lá số thấp

| Trường | Giá trị |
|---|---|
| Mã | BR-TT-05 |
| Tên | Học trò lá số thấp |
| Vùng | `thanh` — Trà Thất |
| Điều kiện | BR-TT-04 |
| Người giao | Dì Hạnh; học trò: bé Lúa (2015-09-01 08:00 nữ) |
| Mục tiêu | 1. Nghe Dì Hạnh kể câu phán năm xưa làm bé Lúa ít nói. 2. Dạy bé Lúa đếm can chi bằng «Trì Thủ Ca» (3 buổi). 3. Cùng bé Lúa đọc lá số của em (em tự đưa ngày sinh, có bà đồng ý). 4. Gỡ câu phán cũ bằng dữ liệu thật. |
| Móc engine | Lá số bé Lúa: 乙未 甲申 庚辰 庚辰; điểm **25** — HẠ ĐẲNG → Phàm Căn; Thân vượng; Dụng Hỏa, Kỵ Thủy; `decadeForecast(R, 2026, 3)`: **2026 Cát 59** (cờ Dụng, Quan, Duyên), **2027 Cát 64**, 2028 Hơi kỵ 34; `taisui › personalTaSui('未','午')` → không phạm năm 2026; `personalTaSui('未','未')` → năm 2027 là **năm tuổi (phạm Trị)** — phải nói thật, không giấu (PR2). Câu phán cũ («số khắc bà») **không có** trong bất kỳ trường engine nào → RB2, DP6. Hệ số Nghịch Thiên của bé Lúa nếu là nhân vật chơi: `clamp(1 + (60 − 25)/100) = 1,35` |
| Thưởng | Đạo Hạnh +30 · Phúc Khí +25 · DEED-T03 (+2) · DEED-T09 (+1) |
| Bỏ dở | — |
| Cờ đặt | `F_LUA_DAY` (BR-TT-05 xong — dùng ở MQ-3-12, MQ-E-07, TL-07) |

```
[CẢNH BR-TT-05.1 · Trà Thất · giờ Thân · vắng khách]
DÌ HẠNH: (rửa chén, nói nhỏ) Hồi con bé lên mười, ra chợ chơi. Có ông thầy ngồi quầy đỏ cổng Tây — cái ông nhẫn đồng — gọi nó lại xem số cho vui. Ổng nói: «Con bé này số khắc bà. Bà nó sống không qua năm nó mười hai tuổi, trừ khi làm lễ.»
DÌ HẠNH: Dì không làm lễ. Dì không có tiền, mà dì cũng không tin. Nhưng con bé tin. Từ đó nó không cười. Năm nay nó mười một.
DÌ HẠNH: Con là đệ tử chính của Quán. Lá số con tốt. Con nói thì nó nghe.
> Lựa chọn:
>   ① «Để con dạy em đọc can chi trước. Rồi em tự đọc lá số của em.» → [05.2]
>   ② «Con nói với em ngay là câu đó sai.» → DÌ HẠNH: «Nó nghe người ta nói sai một lần rồi. Giờ nó không tin ai nói nữa. Nó chỉ tin cái nó tự thấy.» → [05.2]
```

```
[CẢNH BR-TT-05.2 · Ba buổi học · bàn góc Trà Thất]
(Buổi 1: Trì Thủ Ca — mười hai chi theo câu hát. Buổi 2: mười can — đếm bằng ngón tay. Buổi 3: lập một trụ năm. Mỗi buổi 2–3 phút mini-game ghép quân.)
BÉ LÚA: (buổi 1, không nhìn) Tý, Sửu, Dần, Mão…
BÉ LÚA: (buổi 2) Giáp Ất là cây. Bính Đinh là lửa. Con là Canh, Canh là sắt. Sắt thì cứng.
BÉ LÚA: (buổi 3, lần đầu nhìn người chơi) Anh / chị cũng có lá số hả? Lá số anh / chị tốt hông?
> Lựa chọn:
>   ① [Thật] «Người ta chấm lá số anh / chị bảy mươi mốt điểm.» → BÉ LÚA: «Còn con?» → [05.3]
>   ② [Mạn] «Tốt lắm, hiếm người được như vậy.» → (nhãn [Mạn]) BÉ LÚA: (cúi xuống) «…Con biết con không tốt.» → [05.3] (đoạn sau thêm một lựa chọn sửa lời)
```

```
[CẢNH BR-TT-05.3 · Đọc lá số của bé Lúa]
(Dì Hạnh gật đầu cho phép. Bé Lúa tự đọc ngày sinh: «Mồng một tháng chín, năm hai không một lăm, tám giờ sáng. Bà nói vậy.»)
(Sổ Mệnh mở lá số khách: điểm 25 — «HẠ ĐẲNG · Nhiều thử thách, "có bệnh mới quý" — có cơ hội đổi vận nếu nắm đúng Dụng».)
BÉ LÚA: (đọc chậm) Hai mươi lăm. (im) …Thấp.
> Lựa chọn (bắt buộc dẫn câu §4.7 — phải chọn ① trước khi tiếp):
>   ① «Lá số là hạt giống, không phải cái cây. Hạt nhỏ thì chăm nhiều hơn. Anh / chị chưa thấy ai chăm mà cây không lớn.» → [05.4]
```

```
[CẢNH BR-TT-05.4 · Gỡ câu phán]
NGƯỜI CHƠI: (tự động) Giờ mình tìm câu «khắc bà» trong lá số em. Em tìm cùng.
(Mini-game: bé Lúa và người chơi bấm từng mục của Sổ Mệnh khách — Tứ trụ, Ngũ hành, Dụng, Đại vận, Lưu niên, Thái Tuế, Thần sát. Mỗi mục bấm xong hiện «Không có chữ "khắc bà"».)
BÉ LÚA: (sau mục cuối) Không có.
NGƯỜI CHƠI: (tự động) Không có. Còn đây là năm nay của em: Cát. Năm sau — năm em mười hai tuổi — lá số cũng chấm Cát. Năm đó là năm tuổi của em, sách gọi là phạm Trị Thái Tuế: năm nhiều đổi thay, cần vững tay. Không phải năm khắc ai. Thắp một ngọn đèn ở Thái Tuế Điện, không mất tiền.
BÉ LÚA: (nhìn lên bà) Năm con mười hai… Cát?
DÌ HẠNH: (quay đi, lau tay vào tạp dề rất lâu)
(Nếu đã chọn [Mạn] ở 05.2 — thêm lựa chọn:)
>   ① «Hồi nãy anh / chị nói lá số anh / chị hiếm người được. Nói vậy là không đúng. Lá số anh / chị cũng chỉ là hạt giống.» → BÉ LÚA: (gật) → F_TT_MAN −1
BÉ LÚA: (lần đầu cười) Vậy ông thầy nhẫn đồng nói sai.
NGƯỜI CHƠI: (lựa chọn)
>   ① «Ông ấy không đọc lá số. Ông ấy đọc tiền.»
>   ② «Ông ấy nói một câu không có trong lá số. Em nhớ: câu nào không có trong lá số thì không phải của trời.»
(DEED-T03 +2, DEED-T09 +1. `F_LUA_DAY`.)
```

---

## BR-TT-06 · Tốt thì giữ

| Trường | Giá trị |
|---|---|
| Mã | BR-TT-06 |
| Tên | Tốt thì giữ |
| Vùng | `vancoc` → `thanh` (Bàn Thầy) |
| Điều kiện | BR-TT-05; MQ-3-09 (sau mộng năm hạn) |
| Người giao | `van_coc`; `thay_tubinh` |
| Mục tiêu | 1. Nghe Vân Cốc đọc chẩn đoán Mệnh Đồ của lá số «tốt». 2. Nhận một lời nguyện nhỏ giữ 30 ngày. 3. Mắc một sai lầm ở Bàn Thầy (cảnh cố định) và chịu bị tạm đình quyền đệ tử 7 ngày. 4. Trong 7 ngày đó, ngồi Bàn Thầy với tư cách khách học. 5. Được phục quyền. |
| Móc engine | `gaimenhPlan(R, {year}).diagnosis` (TT-1: «Tổ hợp hung — Thương Quan Kiến Quan, Kiêu Đoạt Thực làm trọc cục» (sev cao); «Làm công thấp — tài quan phân tán» (sev trung)); `layers[5]` (tích âm đức, luôn mở); `currentStreak` (đếm 30 ngày nguyện) |
| Thưởng | Đạo Hạnh +35 · Phúc Khí +30 |
| Bỏ dở | Đứt nguyện: đếm lại, Vân Cốc nói «Đứt thì nối. Dây nối có nút, mà vẫn là dây.» |
| Cờ đặt | `F_TT_GIU` |

```
[CẢNH BR-TT-06.1 · Am Vân Cốc · giờ Thìn]
VÂN CỐC: Lá số bảy mươi mốt. Người ta tưởng lá số ấy không bệnh. (mở Mệnh Đồ) Đây: {Tổ hợp hung — Thương Quan Kiến Quan, Kiêu Đoạt Thực}. Sev cao. {Làm công thấp}. Sev trung.
VÂN CỐC: Tốt thì giữ. Không ai được miễn tu. Người có nhiều thì mất nhiều cách hơn người có ít.
VÂN CỐC: Con nguyện một việc nhỏ, ba mươi ngày. Việc gì cũng được, miễn là ngày nào cũng làm và không ai bắt.
(Ô chọn nguyện từ 6 mẫu: «Ngồi Bàn Thầy mỗi sáng», «Châm đèn Tổ Sư», «Tĩnh tọa 10 phút», «Một việc giúp người», «Không nói lời khoe», «Đọc một trang kinh sách ở Thư Lâu».)
```

```
[CẢNH BR-TT-06.2 · Bàn Thầy · sai lầm cố định]
(Một khách: ông lão Mộc, hỏi năm nào nên về quê. Người chơi giải nhanh, tự tin. Ở bước «Chọn năm», hệ thống **cố định** đưa một bẫy: năm có điểm cao nhất nhưng lại là năm ông lão phạm Xung Thái Tuế — hiện trong một mục người chơi chưa mở.)
ÔNG LÃO MỘC: Vậy năm Tân Hợi tôi về.
THẦY TỬ BÌNH: (từ sau lưng) Con mở mục Thái Tuế của khách chưa?
(Người chơi mở: năm ấy ông lão phạm Xung.)
THẦY TỬ BÌNH: Năm đó điểm cao thật. Nhưng năm đó ông ấy phạm Xung. Về quê là động lớn. Con không mở mục đó vì con chắc.
THẦY TỬ BÌNH: Đệ tử chính thức thì chịu lệ. Bảy ngày con ngồi bàn này như khách học. Không phải phạt. Là để con nhớ cảm giác ngồi bàn mà không có đèn sáng.
```

```
[CẢNH BR-TT-06.3 · Bảy ngày khách học]
(Khung tên đổi từ «Đệ Tử Huyền Quán» thành «Khách Học Huyền Quán» trong 7 ngày game. Không mất Đạo Hạnh, không mất quyền nào khác. Hứa Khang — nếu còn là khách học — ngồi cạnh.)
HỨA KHANG: Lần đầu thấy đệ tử chính bị cho ngồi ghế khách. (cười, không ác) Ghế này cứng hơn ghế kia một chút. Quen rồi thì thôi.
(Ngày 7:)
THẦY TỬ BÌNH: Ghế nào cứng hơn?
> ① «Ghế khách.» → THẦY: «Đúng. Đèn sáng làm ghế êm hơn. Con nhớ người ngồi ghế cứng.» ② «Như nhau.» → THẦY: «Vậy con ngồi được ở đâu cũng được. Tốt.»
(Phục quyền; `F_TT_GIU`.)
```

---

## BR-TT-07 · Thủ Cách

| Trường | Giá trị |
|---|---|
| Mã | BR-TT-07 |
| Tên | Thủ Cách |
| Vùng | `thanh` — Tổ Sư Đường |
| Điều kiện | BR-TT-06 xong; nguyện 30 ngày xong; MQ-4-13 |
| Người giao | `thay_tubinh` |
| Mục tiêu | 1. Châm đèn Tổ Sư Đường lần thứ một trăm (đếm từ BR-TT-01). 2. Nhận danh hiệu «Thủ Cách». 3. Nhận quyền nhận đệ tử khi cảnh giới ≥ 4 (hệ sư đồ, §10 bản sơ đồ). |
| Móc engine | — |
| Thưởng | Đạo Hạnh +60 · Phúc Khí +50 · danh hiệu «Thủ Cách» · CUT-041 |
| Bỏ dở | — |
| Cờ đặt | `F_BR_DONE = TT` |

```
[CẢNH BR-TT-07.1 · Tổ Sư Đường · giờ Dậu · CUT-041]
(Người chơi châm đèn. Đèn sáng thêm một nấc — lần đầu kể từ ngày người chơi tới.)
THẦY TỬ BÌNH: Đèn sáng với con lần thứ hai. Lần đầu là trời cho. Lần này là con châm đủ một trăm tối.
THẦY TỬ BÌNH: Thầy đặt cho con chữ «Thủ Cách». Giữ cái khung. Người giữ khung thì phải biết khung có lúc lung lay: khi vận nghịch tới, khi người ta khen, khi người ta trả giá.
THẦY TỬ BÌNH: Lên tới bậc Hiền Nhân thì con nhận đệ tử. Nhận ai trước?
> Lựa chọn: ① «Người lá số thấp.» → THẦY: «Vì sao?» → NGƯỜI CHƠI: «Vì hệ số của họ cao hơn con. Họ đi nhanh hơn con, con chỉ cần đi cạnh.» ② «Người đầu tiên tới hỏi.» → THẦY: «Đúng lệ Quán.» ③ «Hứa Khang.» (nếu F_TT_HOI_KHANG) → THẦY: (cười) «Thằng đó đèn sáng tháng trước rồi. Nó sẽ mừng.»
```

---

# B. ĐẮC CỨU (有救)

**Câu hỏi của nhánh:** cách vỡ một góc nhưng có chỗ vá — người ta đi tìm thuốc thế nào? Đáp án nhánh: **mỗi vị thuốc là một nơi và một việc**, không phải một món mua. Đây là chuỗi cá nhân hóa mạnh nhất (§4.5 bản sơ đồ): người chơi chỉ làm các nhiệm vụ vị thuốc có trong `patternQuality.rescues[].drug` của chính mình.

**Bảng vị thuốc** (nhóm thập thần trong `pattern-quality › scanGroups`: `ti` Tỷ Kiếp, `yin` Ấn, `shi` Thực Thương, `cai` Tài, `guan` Quan Sát):

| `drug` | Vị | Nghĩa đời sống (cách game dạy) | Nhiệm vụ | Nơi | NPC |
|---|---|---|---|---|---|
| `shi` | Thực Thương | làm ra bằng tay nghề; nói ra điều mình nghĩ cho đúng chỗ | BR-DC-02 | `longho` (kết phù) | `truong_thiensu` |
| `yin` | Ấn | học, chữ nghĩa, người che chở, kiên nhẫn | BR-DC-03 | `vanmieu` (chép sách) hoặc `chungnam` (tàng kinh) | `te_tuu` / `khau_daotruong` |
| `cai` | Tài | làm việc có ích ra của; dám chạm vào đời thực | BR-DC-04 | chợ Huyền Thành + `manh` | trưởng sảnh Tượng Pháp |
| `ti` | Tỷ Kiếp | bạn đồng hành, chia sức, chia phần | BR-DC-05 | Trà Thất + `yentu` (hành hương nhóm) | `truclam_thiensu` |
| `guan` | Quan Sát | kỷ luật, giới, người nghiêm | BR-DC-06 | `chungnam` (giới đàn) hoặc `maoshan` | `khau_daotruong` |

Một lá số có thể có cùng một vị ở hai mục cứu (vd hai bệnh đều cần `shi`): làm một nhiệm vụ, tính cho cả hai.

## BR-DC-01 · Bệnh ở đâu thuốc ở đó

| Trường | Giá trị |
|---|---|
| Mã | BR-DC-01 |
| Tên | Bệnh ở đâu thuốc ở đó |
| Vùng | `thanh` — chợ thuốc Huyền Thành, Trà Thất |
| Điều kiện | MQ-P-08 với `F_BRANCH = DC` |
| Người giao | `dan_dinh` Cát Huyền (lưu lại Huyền Thành bảy ngày mua dược liệu) |
| Mục tiêu | 1. Theo Cát Huyền đi chợ thuốc. 2. Nghe ông nói về «bệnh» và «thuốc» của lá số, từng mục. 3. Phân biệt «thuốc» của lá số với thuốc ngoài chợ. 4. Nhận **Bản đồ dược** (chỉ hiện các vị của mình). 5. Làm một việc «vị đầu tiên» ngay trong Huyền Thành (bản nhỏ của vị đầu trong danh sách). |
| Móc engine | `patternQuality.diseases[].note`, `rescues[].{diseaseVia, drug, note}`; MAU-A: bệnh 1 «Tài đảng Sát (Tài sinh Sát) mà không có Thực / Ấn chế → Sát vô chế, bại» — cứu: `drug ['shi']` «Tài đảng Sát nhưng có Thực Thần chế Sát sinh Tài → cứu»; bệnh 2 «Thực thần chế Sát nhưng bị Kiêu (Thiên Ấn) đoạt thực → mất chế» — cứu: `drug ['cai']` «Kiêu đoạt thực nhưng có Tài phá Kiêu → khôi phục thực» |
| Thưởng | Đạo Hạnh +30 · Phúc Khí +25 · Bản đồ dược |
| Bỏ dở | Cát Huyền ở lại 7 ngày game; quá hạn thì ông để lại thư và Bản đồ dược ở Trà Thất. |
| Cờ đặt | `F_DC_DRUGS = [...]` |

```
[CẢNH BR-DC-01.1 · Chợ thuốc Huyền Thành · giờ Thìn · mùi thuốc bắc]
CÁT HUYỀN: (cầm một nhánh cam thảo khô, đưa lên mũi) Ở chợ này thuốc nào cũng có giá. Thuốc của lá số thì không có giá. Con nhớ chỗ khác nhau đó trước.
CÁT HUYỀN: Lá số con có hai bệnh. Bần đạo đọc từng bệnh, rồi từng thuốc.
CÁT HUYỀN: Bệnh một: {Tài đảng Sát mà không có Thực, Ấn chế}. Nói nôm: cái sức ép trong đời con — việc khó, người nghiêm — có thêm tiền bạc, của cải đổ dầu vào. Mà không có gì đứng ra đỡ.
CÁT HUYỀN: Thuốc một: {Thực Thần}. {Có Thực Thần chế Sát sinh Tài}. Nói nôm: cái tay nghề của con, cái con làm ra được, đứng ra đỡ sức ép, biến sức ép thành của.
CÁT HUYỀN: Bệnh hai: {Kiêu đoạt thực}. Cái tay nghề vừa bật lên, bị cái học lạ, cái nghĩ một mình nuốt mất. Người ta nghĩ nhiều quá, làm không ra.
CÁT HUYỀN: Thuốc hai: {Tài}. {Tài phá Kiêu, khôi phục thực}. Nói nôm: chạm tay vào đời thực, làm việc ra của có ích, thì cái nghĩ một mình tan bớt.
> Lựa chọn:
>   ① [Hỏi] «Thuốc đó mua ở đâu ạ?» → CÁT HUYỀN: (cười, đặt nhánh cam thảo xuống) «Đã nói rồi. Không mua.» → [01.2]
>   ② [Thẳng] «Vậy con phải làm hai việc.» → CÁT HUYỀN: «Hai việc, hai nơi. Bần đạo vẽ đường.» → [01.2]
```

```
[CẢNH BR-DC-01.2 · Trà Thất · bản đồ dược]
(Cát Huyền trải tờ giấy dó, vẽ bằng than: Huyền Thành ở giữa, các vị thuốc của lá số người chơi hiện thành nút; các vị không có trong lá số không hiện.)
CÁT HUYỀN: Vị Thực Thương: Long Hổ Sơn. Ở đó người ta học kết phù — chữ của game, không phải chữ thật. Kết một tấm phù cho người khác là làm ra một thứ bằng tay. Đó là vị Thực.
CÁT HUYỀN: Vị Tài: ngay chợ này và Manh Phái Cốc. Làm một việc buôn bán thật thà, có lời, chia lời. Đó là vị Tài.
CÁT HUYỀN: Mỗi vị con hái xong, mang lên lò đan Võ Đang. Đủ vị thì bần đạo sắc cho con một thang. Thang đó không uống được. (cười) Con sẽ hiểu khi tới.
```

```
[CẢNH BR-DC-01.3 · Vị đầu tiên — bản nhỏ trong Huyền Thành]
CÁT HUYỀN: Con đi xa thì còn lâu. Bần đạo cho con thử một vị ngay ở đây. (MAU-A — vị đầu `shi`) Sang phố Thợ, giúp anh Lý Thuận rèn một con dao cắt thuốc cho bần đạo. Làm bằng tay con.
(Mini-game rèn ngắn với anh Lý Thuận, 90 giây.)
CÁT HUYỀN: (cầm dao, thử cắt nhánh cam thảo) Sắc. Con làm ra một thứ dùng được. Hôm nay con không thấy sức ép nhẹ bớt đâu. Nhưng con biết tay mình làm được.
(Bảng «bản nhỏ» theo vị đầu: `yin` — chép một trang sách cho thủ thư Thư Lâu Lâm (đưa xuống Huyền Thành); `cai` — mua giúp Cát Huyền mười vị thuốc đúng giá, trả giá thật thà; `ti` — rủ hai người ngồi uống trà cùng ở Trà Thất; `guan` — giữ một lời hứa với Cát Huyền: sáng mai giờ Mão có mặt ở chợ thuốc.)
```

---

## BR-DC-02 · Vị Thực Thương

| Trường | Giá trị |
|---|---|
| Mã | BR-DC-02 |
| Tên | Vị Thực Thương |
| Vùng | `longho` — Thiên Sư Phủ, tĩnh thất kết phù |
| Điều kiện | `'shi' ∈ F_DC_DRUGS`; MQ-1-14; đã tới `longho` |
| Người giao | `truong_thiensu` |
| Mục tiêu | 1. Học cấu trúc năm phần của phù (đầu, thân, bụng, đảm, chân). 2. Kết một tấm phù bằng **chữ Huyền Văn của game** cho một người cụ thể (chọn người cần). 3. Trao tận tay. |
| Móc engine | `talisman-data › TALISMANS[].structure.{head, body, belly, core, foot}` (chỉ dùng **tên và vai trò** của năm phần — «đầu: nguồn thần chỉ; thân: chủ ý; bụng: kết khí bố trận; đảm: chỗ lực tụ; chân: niêm phong» — không dùng hình phù thật); `talisman-data › ETHICS` |
| Thưởng | Đạo Hạnh +30 · Phúc Khí +25 · vị «Thực Thương» trong Bản đồ dược · DEED-T03 (+2) |
| Bỏ dở | Kết sai thứ tự: phù tan thành giấy trắng, kết lại. |
| Cờ đặt | `F_DC_SHI` |

```
[CẢNH BR-DC-02.1 · Tĩnh thất kết phù · giờ Tỵ · bàn phù: bút lông, chu sa, giấy vàng]
TRƯƠNG THIÊN SƯ: Thí chủ tới hái vị Thực Thương. Cát Huyền gửi thư rồi.
TRƯƠNG THIÊN SƯ: Phù có năm phần. Đầu là chỗ nói phù này nhân danh ai. Thân là điều phù muốn. Bụng là cách khí đi. Đảm là chỗ lực tụ lại. Chân là chỗ niêm lại cho khỏi tản.
TRƯƠNG THIÊN SƯ: Ở Thiên Sư Phủ, bần đạo không dạy vẽ phù thật cho người chưa thụ lục. Thí chủ kết bằng chữ Huyền Văn — chữ của cõi này. Chữ không có phép. Phép ở chỗ thí chủ kết cho ai và vì sao.
TRƯƠNG THIÊN SƯ: Kết cho ai?
> Lựa chọn người nhận (NPC đã gặp, có hoàn cảnh cần): ① Ông Kha (ho) — «chữ an giấc» ② bé Lúa — «chữ dạn dĩ» ③ bà Lựu — «chữ yên lòng» ④ người chơi tự chọn một người chơi khác trong danh sách bạn (gửi qua thư trong game)
```

```
[CẢNH BR-DC-02.2 · Kết phù (mini-game)]
(Năm ô theo thứ tự đầu → chân. Mỗi ô chọn một chữ Huyền Văn từ 3 lựa chọn; lựa chọn đúng là chữ khớp vai trò của phần đó và khớp ý «chữ an giấc / dạn dĩ / yên lòng» đã chọn. Khi xong, chu sa khô, tấm phù phát ánh màu hành Dụng của **người nhận**.)
TRƯƠNG THIÊN SƯ: (xem) Kết đúng. Thí chủ nhớ: tấm phù này không chữa ho, không chữa sợ. Nó là một thứ thí chủ làm ra bằng tay cho người khác. Người nhận cầm nó, biết có người nghĩ tới mình. Vậy thôi.
TRƯƠNG THIÊN SƯ: Thực Thần chế Sát. Cái tay nghề đứng ra đỡ cái sức ép. Hôm nay thí chủ thấy tay mình ấm hơn không?
```

```
[CẢNH BR-DC-02.3 · Trao tận tay (ví dụ: Ông Kha)]
ÔNG KHA: (cầm tấm giấy vàng, xoay xoay) Chữ gì đây? Tôi đọc không ra.
NGƯỜI CHƠI: (tự động) Chữ của cõi này. Không có phép. Tôi kết cho ông, vì ông ho.
ÔNG KHA: (cất vào túi áo ngực) Thầy tôi ngày xưa cũng làm đồ cho người ta. Mà làm để hại. Cậu / cô làm để… (im) Thôi. Cảm ơn.
(DEED-T03 +2. Vị «Thực Thương» sáng trên Bản đồ dược.)
```

---

## BR-DC-03 · Vị Ấn

| Trường | Giá trị |
|---|---|
| Mã | BR-DC-03 |
| Tên | Vị Ấn |
| Vùng | `vanmieu` (Quốc Tử Giám) **hoặc** `chungnam` (Tam Thanh các — tàng kinh) |
| Điều kiện | `'yin' ∈ F_DC_DRUGS`; MQ-1-14 |
| Người giao | `te_tuu` (Văn Miếu) / `khau_daotruong` (Chung Nam) |
| Mục tiêu | 1. Chép tay một văn bản dài (10 phút thật, chia nhiều buổi được). 2. Không bỏ dở giữa buổi. 3. Tặng bản chép cho người cần đọc mà không có sách. |
| Móc engine | `library-data` / `daozang-data` (văn bản được phép trích ngắn: tên, ý nghĩa — không in toàn văn kinh chú, §5.4); `CONG_QUA.thien[9]` Đọc / sao kinh (+1) |
| Thưởng | Đạo Hạnh +30 · Phúc Khí +25 · vị «Ấn» · DEED-T10 (+1) · DEED-T03 (+2) khi tặng |
| Bỏ dở | Bỏ ngang buổi chép: phần đã chép giữ nguyên. |
| Cờ đặt | `F_DC_YIN` |

```
[CẢNH BR-DC-03.VM · Quốc Tử Giám · nhà học · giờ Mùi]
TẾ TỬU: Vị Ấn. Ấn là người che chở, là chữ, là kiên nhẫn. Trò chép một bài.
TẾ TỬU: Không chép kinh. Chép một bài giảng của lão phu về Liễu Phàm — bốn điều: lập mệnh, cải quá, tích thiện, khiêm đức. Bài lão phu tự viết, không phải nguyên văn sách cổ.
(Mini-game chép: chữ hiện mờ trên giấy, người chơi đồ theo nhịp — sai nét thì nét mờ lại, không phạt; 10 phút chia 3 buổi.)
TẾ TỬU: (buổi cuối) Chép xong. Bài này lão phu có mười bản. Bản của trò là bản thứ mười một. Mang cho ai?
> Lựa chọn: ① Lê Khiêm (trước MQ-2-06: thêm thoại «Cậu ấy đang cần bốn điều này hơn ai hết») ② cậu Bờm phố Thợ (đang học chữ) ③ Tú Nhi (nếu đã gặp)
```

```
[CẢNH BR-DC-03.CN · Tam Thanh các, Chung Nam · tuyết]
KHÂU ĐẠO TRƯỞNG: Toàn Chân có lệ: người mới chép giới luật trước khi đọc kinh. Đạo hữu chép hai mươi điều giới căn bản bằng lời Việt mà bần đạo soạn.
(Cùng cơ chế chép. Bản chép tặng một đạo sĩ vân thủy đi ngang không mang sách.)
KHÂU ĐẠO TRƯỞNG: Ấn chế Thương, Ấn hóa Sát. Người kiên nhẫn chép xong hai mươi điều thì không vội cãi người trên. Đạo hữu thử xem.
```

---

## BR-DC-04 · Vị Tài

| Trường | Giá trị |
|---|---|
| Mã | BR-DC-04 |
| Tên | Vị Tài |
| Vùng | chợ Huyền Thành → `manh` → chợ Huyền Thành |
| Điều kiện | `'cai' ∈ F_DC_DRUGS`; MQ-1-14 |
| Người giao | trưởng sảnh Tượng Pháp (Manh Phái Cốc); chị Mận (quầy) |
| Mục tiêu | 1. Mua một gánh nấm rừng ở Manh Phái Cốc **đúng giá** người hái đòi (không ép giá). 2. Mang về chợ Huyền Thành bán qua quầy chị Mận. 3. Ghi sổ thu chi thật thà. 4. Chia lời ba phần: người hái, chị Mận, mình. 5. Dùng phần mình làm một việc có ích. |
| Móc engine | `mangpai › analyzeMangpai` (MAU-A: «Tài tinh (Mộc) tọa chủ vị (Ngày) → tài về tay mình, có phúc»); `remedy-fate › BAZI_HUAJIE` «Tài đa thân nhược» — tâm pháp «知足不贪 biết đủ không tham»; `TEN_THIEN` «捨財作福 xả của làm phúc» |
| Thưởng | Đạo Hạnh +30 · Phúc Khí +25 + lời thật (40–60 Phúc Khí tùy giá bán) · vị «Tài» · DEED-T04 (+2) |
| Bỏ dở | Nấm để quá 2 ngày game thì héo: bán rẻ hơn, nhiệm vụ vẫn xong. |
| Cờ đặt | `F_DC_CAI`, `F_DC_CAI_EP_GIA` (nếu có ép giá) |

```
[CẢNH BR-DC-04.1 · Đường vào Manh Phái Cốc · người hái nấm]
NGƯỜI HÁI NẤM (bà cụ mù một mắt): Gánh nấm này hai mươi Phúc Khí. Người dưới xuôi lên hay trả mười hai.
> Lựa chọn:
>   ① Trả hai mươi → [04.2]
>   ② Trả giá xuống mười lăm → BÀ CỤ: «Ừ, mười lăm cũng được.» (F_DC_CAI_EP_GIA) → [04.2]
>   ③ Trả hai mươi lăm → BÀ CỤ: «Dư năm.» NGƯỜI CHƠI: «Bà giữ.» → [04.2] (thêm DEED-T04 +2)
TRƯỞNG SẢNH TƯỢNG PHÁP: (đi ngang, nghe) Tài là cái về tay. Về tay bằng cách nào thì về tay cái đó.
```

```
[CẢNH BR-DC-04.2 · Quầy chị Mận · chợ Huyền Thành]
CHỊ MẬN: Nấm rừng Manh Phái! Hiếm à nha. Để em bày.
(Mini-game bán hàng nhỏ: 5 khách; người chơi nói giá; khách nào hỏi «nấm này có trị bệnh không?» thì có lựa chọn: ① «Không. Là nấm ăn ngon.» ② «Có, trị được đủ thứ.» (nhãn [Dối] — DEED-A03 −2 nếu chọn).)
CHỊ MẬN: (cuối ngày, đếm tiền) Lời {n}. Chia sao?
> Lựa chọn: ① ba phần bằng nhau ② nhiều hơn cho bà cụ hái nấm ③ giữ phần lớn cho mình (không phạt; Cát Huyền nhận xét ở BR-DC-07)
```

```
[CẢNH BR-DC-04.3 · Dùng phần của mình]
(Gợi ý ba việc: mua giấy bút cho lớp học chữ của cậu Bờm; góp quỹ cơm chay Bút Tháp; mua lại chim lồng thả — giới hạn theo MQ-1-11.)
TRƯỞNG SẢNH (thư gửi): «Manh phái nói: tài về chủ vị là có phúc. Phúc là cái đi ra từ tài, không phải cái nằm lại trong túi.»
```

---

## BR-DC-05 · Vị Tỷ Kiếp

| Trường | Giá trị |
|---|---|
| Mã | BR-DC-05 |
| Tên | Vị Tỷ Kiếp |
| Vùng | `thanh` (Trà Thất) → `yentu` (đường hành hương lên Chùa Đồng) |
| Điều kiện | `'ti' ∈ F_DC_DRUGS`; đã tới `yentu` |
| Người giao | `truclam_thiensu` |
| Mục tiêu | 1. Lập một nhóm hành hương ≥ 3 người (người chơi thật hoặc NPC: Thanh Phong, A Tỏa, Hứa Khang…). 2. Leo từ suối Giải Oan lên Chùa Đồng **cùng nhau**: không ai bị bỏ lại quá 30 m. 3. Ở đỉnh, chia một nắm xôi làm ba. |
| Móc engine | `five-dim-radar` (trục Tỷ); MMO ghép đội (`net.js`); Nguyên Khí (người Nguyên Khí thấp đi chậm hơn — cả nhóm phải chờ) |
| Thưởng | Đạo Hạnh +30 · Phúc Khí +25 · vị «Tỷ Kiếp» · DEED-T03 (+2) mỗi lần dìu người trong nhóm (tối đa 2) |
| Bỏ dở | Nhóm tan: làm lại từ suối. |
| Cờ đặt | `F_DC_TI` |

```
[CẢNH BR-DC-05.1 · Suối Giải Oan · sương]
PHÁP KHÔNG: Lên Chùa Đồng một mình thì nhanh. Lên ba người thì chậm. Hôm nay con lên chậm.
(Leo: ba người có Nguyên Khí khác nhau. NPC chậm nhất (Hứa Khang — hoặc người chơi khác có Nguyên Khí thấp) phải nghỉ ở các chiếu nghỉ.)
THANH PHONG: (khi người chơi đi trước 30 m) Ê! Đợi! Hứa Khang thở không nổi rồi!
> Lựa chọn: ① Quay lại dìu (DEED-T03 +2) ② Đứng chờ ③ Đi tiếp (nhóm «tan» — làm lại)
```

```
[CẢNH BR-DC-05.2 · Chùa Đồng · biển mây]
(Ba người ngồi trên bậc đá trước Chùa Đồng nhỏ bằng đồng. Pháp Không đưa một nắm xôi.)
PHÁP KHÔNG: Một nắm. Ba người.
(Người chơi chia: thao tác bẻ nắm xôi; chia đều hoặc không đều — không đúng sai.)
PHÁP KHÔNG: Tỷ là người ngang vai. Kiếp là người ngang vai mà tranh phần. Hôm nay không ai tranh. Đó là vị thuốc.
HỨA KHANG: (miệng đầy xôi) Lần đầu tôi lên tới đỉnh. Lần nào đi một mình cũng bỏ giữa đường.
```

---

## BR-DC-06 · Vị Quan Sát

| Trường | Giá trị |
|---|---|
| Mã | BR-DC-06 |
| Tên | Vị Quan Sát |
| Vùng | `chungnam` — Lão Luật đường, giới đàn |
| Điều kiện | `'guan' ∈ F_DC_DRUGS`; đã tới `chungnam` |
| Người giao | `khau_daotruong` |
| Mục tiêu | 1. Nhận ba giới tạm trong 7 ngày game: ăn chay, giữ khẩu (không chọn lựa chọn [Ác khẩu] / [Dối]), dậy giờ Mão. 2. Mỗi tối báo cáo ở Lão Luật đường. 3. Nếu phạm: tự báo, không giấu. |
| Móc engine | `daozang-data` mục 戒律 (giới luật); `CONG_QUA.thien[6]` Ăn chay 1 ngày (+1/ngày); hệ đếm lựa chọn có nhãn |
| Thưởng | Đạo Hạnh +30 · Phúc Khí +25 · vị «Quan Sát» · DEED-T07 ×7 (tối đa +7) |
| Bỏ dở | Phạm giới mà tự báo: ngày đó vẫn tính. Phạm mà giấu (không báo khi Khâu đạo trưởng hỏi): ngày đó không tính, làm thêm một ngày. |
| Cờ đặt | `F_DC_GUAN` |

```
[CẢNH BR-DC-06.1 · Lão Luật đường · giờ Dậu]
KHÂU ĐẠO TRƯỞNG: Quan Sát là người nghiêm, là phép tắc. Lá số đạo hữu thiếu cái đó ở chỗ cần, nên bệnh. Bảy ngày, ba giới.
KHÂU ĐẠO TRƯỞNG: Bần đạo không theo dõi. Tối nào đạo hữu cũng tự báo. Phạm thì nói phạm.
(Mỗi tối: hộp thoại báo cáo với 3 ô tích — hệ thống điền sẵn theo dữ liệu thật, người chơi bấm «Báo». Nếu có ô phạm, hai lựa chọn: «Báo đúng» / «Báo là không phạm».)
KHÂU ĐẠO TRƯỞNG: (khi báo đúng một lần phạm) Phạm mà báo, là giữ giới thứ tư: không dối. Hôm nay tính.
KHÂU ĐẠO TRƯỞNG: (khi báo sai) (im một lúc) Bần đạo không hỏi lại. Mai đạo hữu ở thêm một ngày.
```

---

## BR-DC-07 · Thang thuốc

| Trường | Giá trị |
|---|---|
| Mã | BR-DC-07 |
| Tên | Thang thuốc |
| Vùng | `vodang` — lò đan Võ Đang (Thái Hòa cung) |
| Điều kiện | đủ mọi vị trong `F_DC_DRUGS`; MQ-4-13 |
| Người giao | `dan_dinh` Cát Huyền |
| Mục tiêu | 1. Mang các vị lên lò. 2. Cùng Cát Huyền «sắc» thang thuốc (mini-game giữ lửa). 3. Nhận «thang thuốc» — một cuốn sổ nhỏ ghi lại từng việc đã làm để hái từng vị. 4. Nghe lời kết. |
| Móc engine | `patternQuality.rescues[]` (đọc lại `note` từng mục); cờ phụ `F_DC_CAI_EP_GIA`, F_DC_GUAN (ngày báo sai) |
| Thưởng | Đạo Hạnh +60 · Phúc Khí +50 · danh hiệu «Đắc Cứu» · CUT-042 |
| Bỏ dở | — |
| Cờ đặt | `F_BR_DONE = DC` |

```
[CẢNH BR-DC-07.1 · Lò đan Thái Hòa cung · giờ Ngọ · CUT-042]
(Lò đồng ba chân giữa sân, khói trắng. Cát Huyền quạt than.)
CÁT HUYỀN: Đưa các vị đây.
(Người chơi đặt từng vật kỷ niệm của mỗi vị vào lò: con dao cắt thuốc / tấm phù / bản chép / sổ thu chi / nắm xôi / sổ giới. Mỗi vật cháy thành một sợi khói màu.)
CÁT HUYỀN: (giữ lửa) Lửa đều tay. Đừng thổi. Giữ.
(Mini-game giữ lửa: thanh nhiệt độ ở vùng giữa trong 90 giây.)
(Khi khói tan, trong lò không có viên đan nào. Chỉ có một cuốn sổ nhỏ bìa gỗ đào, ấm.)
CÁT HUYỀN: Thang thuốc của con. (mở sổ) Trang một: «Rèn dao cắt thuốc cùng anh Lý Thuận.» Trang hai: «Kết chữ an giấc cho Ông Kha.» Trang ba: «Bán nấm của bà cụ Manh Phái, chia lời {ba phần}.»
CÁT HUYỀN: (nếu F_DC_CAI_EP_GIA) Trang này ghi «trả mười lăm thay vì hai mươi». Bần đạo không xé. Thuốc có vị đắng. Con nhớ vị đó.
CÁT HUYỀN: Bệnh của lá số con vẫn còn. Tám chữ không đổi. Nhưng con biết thuốc ở đâu, và con đã đi hái. Người có bệnh mà biết thuốc thì sống lâu hơn người không biết mình bệnh.
CÁT HUYỀN: Thang này không uống được. Mỗi khi con thấy sức ép không ai đỡ, con mở trang một. Mỗi khi con nghĩ một mình quá lâu, con mở trang ba.
```

---

## Kiểm thử nghiệm thu hai nhánh

| # | Kiểm | Đạt khi |
|---|---|---|
| 1 | TT-1 vào nhánh TT; MAU-A vào nhánh DC | luật README §2.2 |
| 2 | Vận cách-thuận / cách-nghịch của BR-TT-03 lấy từ `synthesis.paragraphs` | TT-1 ra 丙午 (62), 丁未 (72) |
| 3 | BR-TT-02 không có đường nào đưa ngày sinh người chơi cho NPC | không có trường dữ liệu chuyển ngày sinh |
| 4 | BR-TT-05 bắt buộc câu dẫn §4.7 trước khi đọc tiếp lá số điểm 25 | lựa chọn ① khóa luồng |
| 5 | Nhánh DC chỉ mở nhiệm vụ của vị có trong `rescues[].drug` | MAU-A chỉ mở BR-DC-02 và BR-DC-04 |
| 6 | Không có vị thuốc nào mua được | không giao dịch Ngọc / Phúc Khí đổi vị |
| 7 | Kết phù chỉ dùng chữ Huyền Văn | không tài sản hình phù thật trong `assets` |
