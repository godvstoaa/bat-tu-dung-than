# 03 · Phần 09 — Nhánh Nghịch Thiên (`BR-NT-01…07`) và Dị Cách (`BR-DK-01…07`)

> Lá số minh họa: Nghịch Thiên — **NT-1** (1970-05-19 08:00 nam: 庚戌 辛巳 己亥 戊辰; điểm **19** «HẠ ĐẲNG» → Phàm Căn; percentile 2; Thương Quan cách **败格**; Thân nhược; Dụng Thủy, Hỷ Kim, Kỵ Thổ, Cừu Hỏa; Ngũ Duy: Thực 100, Tỷ 90, Tài 38, Ấn 34, Quan 31; Mệnh Cấp «Hạ Cách»; hệ số Nghịch Thiên `clamp(1 + (60 − 19)/100, 1,0, 1,5) = 1,41`; đại vận 丁亥 vừa vào năm 2026, «Đại cát»). Dị Cách — **DK-1** (1970-09-27 08:00 nam: 庚戌 乙酉 庚戌 庚辰; «Tòng Cách cách (Chuyên Vượng Kim)», `pattern.special.kind = 'zhuanwang'`, tên 從革格; `quality` 成格; Kim 61%, Thủy 1,1%; bệnh tiềm ẩn: «chuyên vượng kỵ Quan Sát — vận khắc thân phạm vượng thì phá cách (旺之极者不可损)»).
> Hai nhánh này mang trọng tâm an toàn cảm xúc của game: **lá số thấp và lá số lạ không bị đối xử như lỗi**. Mọi cảnh phải qua kiểm «không xấu hổ» (bản sơ đồ §14, dòng «Người chơi lá số thấp cảm thấy bị phán xét»).

## 0. Lịch nhánh

| Nhánh | Hồi I (Huyền Thành) | Hồi II | Hồi III | Trước Vĩ thanh |
|---|---|---|---|---|
| NT | BR-NT-01, 02, 03 | BR-NT-04, 05, 06, 07 | — | — |
| DK | BR-DK-01, 02 | BR-DK-03, 04, 05 | BR-DK-06 | BR-DK-07 |

Tổng thưởng: NT — Đạo Hạnh gốc 230 (× 1,41 với NT-1 ≈ 324) · Phúc Khí 190. DK — Đạo Hạnh gốc 200 · Phúc Khí 170.

---

# A. NGHỊCH THIÊN (败格)

**Câu hỏi của nhánh:** khi cách đã vỡ và người ta bảo «chưa đủ duyên», người ta dựng lại từ đâu? Đáp án theo `remedy-fate › BAZI_HUAJIE` mục «Cách cục bại (败格)»: **hình** — tìm cứu ứng (Dụng thần + mượn vận) và **tập trung một lĩnh vực**; **tâm** — khiêm đức («khiêm là thuốc nhanh nhất»); **nghiệp** — sám lớn và tích đức lớn («bại cần bổ lớn»).

## BR-NT-01 · Chưa đủ duyên

| Trường | Giá trị |
|---|---|
| Mã | BR-NT-01 |
| Tên | Chưa đủ duyên |
| Vùng | `thanh` — Bàn Thầy |
| Điều kiện | MQ-P-08 với `F_BRANCH = NT` |
| Người giao | `thay_tubinh` |
| Mục tiêu | 1. Sáng đầu tiên, nhận **thẻ khách học**. 2. Ngồi ghế khách học xem Thầy giải ba án (không giải). 3. Gặp Hứa Khang — khách học hai năm. 4. Trả lời Thầy một câu: «Con thấy gì?» |
| Móc engine | — (cảnh quan sát); dữ liệu án lấy từ `cases.js` (khách sinh hạt cố định) |
| Thưởng | Đạo Hạnh +15 · Phúc Khí +20 · thẻ khách học |
| Bỏ dở | Rời ghế: án tiếp theo chờ. |
| Cờ đặt | `F_NT_KHACH_HOC` |

```
[CẢNH BR-NT-01.1 · Bàn Thầy · giờ Thìn]
THẦY TỬ BÌNH: (đưa một thẻ tre có khắc chữ «Khách học») Ghế này. Ghế khách học thấp hơn ghế đệ tử nửa gang tay. Lệ cũ. Thầy không đổi được lệ, nhưng thầy cho con ngồi gần thầy nhất.
THẦY TỬ BÌNH: Hôm nay con không giải. Con xem. Ba án. Xem xong, thầy hỏi một câu.
(Ba án cố định: một cụ ông hỏi năm cưới cháu; một cô thợ dệt hỏi đổi nghề; một chú lái buôn hỏi năm mở tiệm. Thầy giải đủ 6 bước, nói to từng bước.)
HỨA KHANG: (ghế bên, nói nhỏ) Cậu / cô cũng đèn không sáng hả. Tôi hai năm rồi. Ngồi riết quen.
> Lựa chọn:
>   ① [Hỏi] «Hai năm cậu học được gì?» → HỨA KHANG: «Lập trụ nhanh nhất Quán. Còn lại thì… chưa ai cho tôi giải.» 
>   ② [Mềm] «Ngồi cạnh cậu là may cho tôi.» → HỨA KHANG: (ngạc nhiên, cười) «Lần đầu có người nói vậy.»
```

```
[CẢNH BR-NT-01.2 · Hết ba án]
THẦY TỬ BÌNH: Con thấy gì?
> Lựa chọn:
>   ① «Thầy giải án nào cũng hỏi khách muốn gì trước khi đọc số.» → THẦY: «Phải. Con thấy đúng cái không ai thấy.»
>   ② «Thầy chưa lần nào nói "số anh vậy rồi".» → THẦY: «Đó là điều thứ ba Quán dặn đệ tử. Con thuộc trước khi được dặn.»
>   ③ «Ba lá số ấy có lá số thấp hơn của con không?» → THẦY: «Có một. Cô thợ dệt. Con thấy cô ấy ra về thế nào?» → NGƯỜI CHƠI: «Nhẹ người.» → THẦY: «Vậy là đủ.»
THẦY TỬ BÌNH: Mai con giải án đầu tiên ở ghế khách học. Ghế thấp, án thì như nhau.
(Mở MQ-1-02 cho người chơi NT; trong MQ-1-02 … 04, Thầy gọi người chơi là «khách học {ten}».)
```

---

## BR-NT-02 · Nhà trọ Mái Rêu

| Trường | Giá trị |
|---|---|
| Mã | BR-NT-02 |
| Tên | Nhà trọ Mái Rêu |
| Vùng | `thanh` — nhà trọ Mái Rêu (dưới thành, POI đề xuất TBD-07) |
| Điều kiện | BR-NT-01 |
| Người giao | bà Năm Rêu |
| Mục tiêu | 1. Ba việc trả ơn bà Năm (không trả tiền): quét sân, vá mái dột, gánh nước. 2. Nghe bà kể về «người ở phòng này trước». 3. Tìm dòng chữ khắc dưới khung cửa sổ. |
| Móc engine | `CONG_QUA.thien[2]` Giúp người khó khăn |
| Thưởng | Đạo Hạnh +20 · Phúc Khí +20 · DEED-T03 (+2) · phòng ở Mái Rêu (điểm hồi sinh, hồi Nguyên Khí) |
| Bỏ dở | — |
| Cờ đặt | `F_NT_MAI_REU`, `F_NT_DONG_CHU` |

```
[CẢNH BR-NT-02.1 · Sân nhà trọ · giờ Mão · lá rụng]
BÀ NĂM RÊU: Ông Tử Bình gửi thẻ tre thì bà không lấy tiền. Nhưng bà không nuôi người ngồi không. Sân này, mái đó, chum nước kia.
(Ba việc nhỏ: quét sân (mini-game 40 giây), vá mái (leo thang, đặt ngói), gánh nước (giếng xóm).)
BÀ NĂM RÊU: (khi xong) Siêng. Người trước ở phòng này cũng siêng. Hồi đó nó cũng đèn không sáng.
> Lựa chọn:
>   ① [Hỏi] «Người đó giờ ở đâu ạ?» → BÀ NĂM RÊU: «Ở trên kia.» (hất cằm về Sơn Môn) «Làm thầy. Mà nó dặn bà đừng nói tên.»
>   ② [Im] → BÀ NĂM RÊU: «Không hỏi à? Người trước cũng không hỏi. Hai đứa giống nhau.»
```

```
[CẢNH BR-NT-02.2 · Phòng trọ · đêm · dòng chữ khắc]
(Dưới khung cửa sổ nhìn lên Sơn Môn, một dòng chữ khắc nhỏ bằng mũi dao, đã mòn: «Đèn không sáng thì mình sáng. — K.»)
(Codex: «Dòng chữ dưới cửa sổ Mái Rêu». Chữ «K.» là manh mối cho BR-NT-07.)
```

---

## BR-NT-03 · Đêm gõ cửa

| Trường | Giá trị |
|---|---|
| Mã | BR-NT-03 |
| Tên | Đêm gõ cửa |
| Vùng | `thanh` — nhà trọ Mái Rêu |
| Điều kiện | BR-NT-02; đêm thứ ba ở Mái Rêu, giờ Hợi, trời mưa (nếu không mưa, cảnh chờ đêm mưa kế tiếp — tối đa 3 ngày game rồi chạy không cần mưa) |
| Người giao | `van_coc` |
| Mục tiêu | 1. Mở cửa. 2. Ngồi với Vân Cốc. 3. Nghe ông đọc từng dòng trừ điểm của lá số như «việc phải làm». 4. Hiểu hệ số Nghịch Thiên. 5. Nhận lời mời lên am. |
| Móc engine | `synthesis.factors[]` (các dòng âm); `synthesis.score`; hệ số Nghịch Thiên (canon §5); `REMEDY_QUOTES[0]` «命由我作，福自己求»; persona «Nghịch Thiên Cải Mệnh» (`score < 46`) |
| Thưởng | Đạo Hạnh +30 · Phúc Khí +25 · CUT-048 |
| Bỏ dở | Không mở cửa: Vân Cốc để lại một bọc trà và mảnh giấy «Mệnh do ta tạo», cảnh coi như xong nhưng thiếu đoạn 03.3–03.4 (người chơi có thể lên am nghe lại). |
| Cờ đặt | `F_NT_GO_CUA` |

```
[CẢNH BR-NT-03.1 · Phòng trọ · giờ Hợi · mưa · CUT-048]
(Tiếng gõ cửa ba tiếng, thong thả. Ngoài cửa: lão tăng áo nâu ướt vai, cầm đèn lồng giấy và một bọc trà.)
VÂN CỐC: Lão tăng ở trên núi sau Hậu Sơn. Thầy Tử Bình chưa nhận con phải không?
VÂN CỐC: Cho lão tăng vào. Mưa.
(Người chơi mở cửa. Vân Cốc ngồi xuống chiếu, đặt đèn lồng, pha trà bằng nước sôi của bà Năm Rêu đưa lên.)
VÂN CỐC: Mệnh do ta tạo, phúc tự mình cầu. Lão tăng nói câu đó trước, kẻo lát nữa nói chuyện con quên mất.
> Lựa chọn: ① «Lá số con xấu.» → [03.2]  ② «Con không biết vì sao đèn không sáng.» → [03.2b]  ③ (im lặng) → VÂN CỐC: «Im cũng là một câu trả lời. Lão tăng nghe được.» → [03.2]
```

```
[CẢNH BR-NT-03.2 · «Xấu là chữ của người xem»]
VÂN CỐC: Xấu là chữ của người xem, không phải chữ của trời. Đưa lão tăng xem cái nút «Vì sao?» của con.
VÂN CỐC: (NT-1 — đọc các dòng âm của `factors`) Cách Thương Quan đã vỡ: Thương Quan gặp Quan, sinh Tài mà mang Sát; cách thần rơi Không vong — cách bị treo, đợi vận. Dụng Thủy yếu. Tổ hợp hung làm trọc cục.
VÂN CỐC: Con nghe giống một bản án. Lão tăng nghe giống một danh sách việc. Mỗi dòng trừ điểm là một chỗ có thể làm. Người lá số tốt không có danh sách dài như vậy, nên họ hay không biết làm gì.
→ [03.3]
```

```
[CẢNH BR-NT-03.2b]
VÂN CỐC: Đèn ở Tổ Sư Đường à. (cười) Đèn ấy lão tăng biết. Nó không đọc lá số đâu. Nó đọc cái gì thì lão tăng cũng không chắc. Người ta bảo nó đọc «duyên». Lão tăng bảo: duyên là cái chưa tới, không phải cái không có.
→ [03.2]
```

```
[CẢNH BR-NT-03.3 · Hệ số Nghịch Thiên]
VÂN CỐC: Con mở Sổ Mệnh trang cuối. Có một con số nhỏ cạnh chữ «Đạo Hạnh» không?
(Sổ Mệnh hiện: «Hệ số Nghịch Thiên × 1,41».)
VÂN CỐC: Ở Quán này người ta tính thế này: lá số càng thấp, mỗi việc con làm càng nặng. Con làm một việc, sổ ghi một phẩy bốn mươi mốt việc. Người lá số tám mươi tám điểm làm một việc, sổ ghi một việc.
VÂN CỐC: Không phải trời thương con hơn. Là đường con dốc hơn, mỗi bước con nhấc chân cao hơn. Sổ chỉ ghi cho đúng.
> Lựa chọn:
>   ① [Hỏi] «Vậy lá số thấp lại có lợi?» → VÂN CỐC: «Không lợi. Công bằng. Lợi là chữ của chợ.»
>   ② [Thẳng] «Con sẽ đi nhanh hơn họ.» → VÂN CỐC: «Đừng đua. Đi đều. Người đua thì hay ngã ở dốc.»
```

```
[CẢNH BR-NT-03.4 · Liễu Phàm bản ngắn và lời mời]
VÂN CỐC: Ngày xưa có người bị đoán đúng từng chữ: không con, chết năm năm mươi ba. Ông ấy ghi một cuốn sổ. Sống tới bảy mươi tư. Mai con lên núi, lão tăng kể đủ. (gieo MQ-1-10)
VÂN CỐC: (đứng dậy, cầm đèn lồng) Thầy Tử Bình là người tốt. Ông ấy giữ lệ của đèn vì ông ấy từng ngồi đúng chỗ con đang ngồi. Con hỏi bà Năm thì biết.
VÂN CỐC: (ở cửa) Đóng cửa lại. Mai mở.
```

---

## BR-NT-04 · Lập chí

| Trường | Giá trị |
|---|---|
| Mã | BR-NT-04 |
| Tên | Lập chí |
| Vùng | `vanmieu` — Văn Miếu, Đại bái đường |
| Điều kiện | BR-NT-03; MQ-1-14; đã tới `vanmieu` |
| Người giao | `te_tuu` (theo §5.2 bản sơ đồ: «Cách bại thì dựng lại từ nền: lập chí trước.») |
| Mục tiêu | 1. Nghe Tế tửu giảng ba lớp thuốc cho cách bại. 2. Chọn **một lĩnh vực** để tập trung (theo trục Ngũ Duy mạnh nhất). 3. Viết lời lập chí và đọc trước Đại Thành điện. 4. Nhận một «bài tập 49 ngày» cho lĩnh vực đã chọn. |
| Móc engine | `remedy-fate › BAZI_HUAJIE` mục «Cách cục bại»: 形 «tìm cứu ứng (Dụng thần + mượn vận) + tập trung 1 lĩnh vực»; 心 «谦德 (满招损谦受益) — khiêm là thuốc nhanh nhất»; 业 «đại sám (Bát Thập Bát Phật) + đại tích đức — bại cần bổ lớn»; `five-dim-radar` (NT-1: Thực 100, Tỷ 90 → gợi ý Nghệ đạo hoặc Đồng đạo); `patternQuality.rescues` (NT-1 `drug ['yin']` — Ấn) |
| Thưởng | Đạo Hạnh +40 · Phúc Khí +30 |
| Bỏ dở | Bài tập 49 ngày đứt quãng: đếm tiếp, không đếm lại (khác BR-TT-06: người lá số bại không bị phạt đứt). |
| Cờ đặt | `F_NT_LAP_CHI`, `F_NT_LINH_VUC` |

```
[CẢNH BR-NT-04.1 · Đại bái đường · giờ Tỵ]
TẾ TỬU: Trò là người đèn không sáng. Lão phu biết. Lão phu cũng không quan tâm đèn.
TẾ TỬU: Sách thuốc cho cách bại có ba lớp. Lớp ngoài: tìm chỗ cứu, mượn vận, và dồn sức vào một việc. Lớp giữa: khiêm. Lớp trong: sám lớn, tích đức lớn. Bại thì phải bổ lớn.
TẾ TỬU: Trò nghe chữ «khiêm» thì nghĩ là cúi đầu. Không phải. Khiêm là biết mình còn trống. Cái bát úp thì không hứng nước, cái bát ngửa mới hứng.
TẾ TỬU: Lá số trò có một chỗ cứu: {Ấn}. Sách, thầy, sự kiên nhẫn. Văn Miếu này là nhà của chữ Ấn.
TẾ TỬU: Còn một việc để dồn sức: tay dài nhất của trò là {Thực} — tay nghề. Rồi {Tỷ} — bạn đồng hành.
> Lựa chọn lĩnh vực (tất cả mở; gợi ý sáng theo trục mạnh):
>   ① Nghệ đạo (Thực) — bài tập: 49 ngày, mỗi ngày làm ra một thứ bằng tay (thư pháp / rèn / kết phù / nấu)
>   ② Đồng đạo (Tỷ) — bài tập: 49 ngày, mỗi ngày giúp một người cùng cảnh
>   ③ Học đạo (Ấn — vị cứu) — bài tập: 49 ngày, mỗi ngày đọc một trang ở Thư Lâu / Văn Miếu
```

```
[CẢNH BR-NT-04.2 · Đại Thành điện · đọc lời lập chí]
TẾ TỬU: Viết. Một câu. Không viết điều trò muốn có. Viết điều trò sẽ làm.
(Ô nhập ≤ 40 chữ; lọc nội dung. Nếu người chơi đã viết lập chí ở MQ-2-05, Tế tửu nói: «Trò viết một câu rồi. Đây là câu thứ hai. Câu thứ hai khó hơn, vì trò đã biết câu thứ nhất khó giữ.»)
(Người chơi đọc to trước điện; NPC thư sinh dừng lại nghe.)
TẾ TỬU: Lão phu từng thấy một người đèn không sáng đọc lời lập chí ở đúng chỗ này. Ba mươi năm trước. Giờ người đó ngồi Bàn Thầy.
```

---

## BR-NT-05 · Con đường đá

| Trường | Giá trị |
|---|---|
| Mã | BR-NT-05 |
| Tên | Con đường đá |
| Vùng | đường đá giữa `thanh` và `thulau` (đoạn dốc Lò Gạch, ~300 m) |
| Điều kiện | BR-NT-04 |
| Người giao | trưởng phu đường Lão Bộ; anh Đạt (nếu đã gặp ở MQ-1-02) |
| Mục tiêu | 1. Góp công 5 buổi lát lại 300 m đường đá sụt (mỗi buổi 3–5 phút mini-game xếp đá). 2. Rủ thêm ít nhất một người (người chơi khác hoặc NPC) cùng làm một buổi. 3. Dự buổi khánh thành đoạn đường. |
| Móc engine | `TEN_THIEN` «兴建大利 — kiến dựng lợi lớn (cầu / đường)»; `CONG_QUA` (Giúp người khó khăn); sự kiện máy chủ «sửa cầu đường» (§5.3 bản sơ đồ) — buổi làm chung với người chơi khác cộng vào thanh tiến độ chung của đoạn đường |
| Thưởng | Đạo Hạnh +40 · Phúc Khí +30 · DEED-T03 (+2) mỗi buổi (tối đa 5 buổi) · tên khắc trên cột mốc đường |
| Bỏ dở | Buổi bỏ dở không tính; đá đã xếp vẫn ở đó. |
| Cờ đặt | `F_NT_DUONG` |

```
[CẢNH BR-NT-05.1 · Dốc Lò Gạch · giờ Thìn]
LÃO BỘ: Mùa mưa năm ngoái đường sụt. Người đi Thư Lâu phải lội bùn. Quán không có tiền, Hội Đồng không có tiền. Dân phu làm không công, ai rảnh thì tới.
ANH ĐẠT: (vác đá) Người giải số cho tui! Lại đây, xếp đá kiểu này nè, nghiêng vô núi.
(Mini-game xếp đá: chọn đá vừa khe, nghiêng mặt vào sườn.)
ANH ĐẠT: Tui khuân hàng mười lăm năm, giờ khuân đá cho đường. Cũng vác. Mà vác cái này người ta cảm ơn.
```

```
[CẢNH BR-NT-05.2 · Buổi thứ năm · khánh thành]
(Đoạn đường xong. Một cột mốc đá nhỏ đầu dốc, khắc tên những người góp công. Tên người chơi khắc cuối danh sách, chữ nhỏ như mọi tên khác.)
LÃO BỘ: Đường này không ai nhớ ai làm. Mười năm nữa người ta đi qua, chỉ biết là đi không ướt chân.
NGƯỜI CHƠI: (lựa chọn) ① «Vậy là đủ.» ② «Tên khắc ở đây cũng đủ.» ③ «Không cần khắc tên tôi.» (→ tên không khắc; ghi DEED-T06 âm chất +2 thay cho buổi cuối)
VÂN CỐC: (thư gửi xuống) «Sách xưa liệt kê mười điều thiện. Một điều là dựng lợi lớn: cầu, đường. Người lá số bại cần bổ lớn. Đường này dài ba trăm thước. Lớn đấy.»
```

---

## BR-NT-06 · Người cùng cảnh

| Trường | Giá trị |
|---|---|
| Mã | BR-NT-06 |
| Tên | Người cùng cảnh |
| Vùng | `thanh` — Bàn Thầy, bến hàng, xưởng Ông Kha |
| Điều kiện | BR-NT-05 |
| Người giao | anh Đạt (1988-03-08 06:00 nam) |
| Mục tiêu | 1. Nghe anh Đạt kể chủ bến nói «số mày là số khuân vác». 2. Giải nốt bốn bước còn lại của án anh Đạt (MQ-1-02 dừng ở bước 2). 3. Tìm việc hợp Dụng cho anh. 4. Giới thiệu anh với Ông Kha. |
| Móc engine | `cases › buildCase` (khách anh Đạt): **Thân quá nhược** (thất lệnh, không gốc, không thế; lực trợ 2,4 / khắc-tiết 6,5); cách đặc biệt «Tòng Nhi cách (Tòng Thực Thương)» — `yong.method` «Cách cục đặc biệt», Dụng **Mộc**, phụ **Hỏa**; tránh **Kim, Thổ**; lưu niên 2026–2031: **2026 丙午 Bình 55 (cao nhất)** · 2027 42 · 2028 27 · 2029 30 · **2030 庚戌 Đại hung 2** · 2031 43; `yong.reasons[0]` «Tòng Nhi — theo Thực Thương — lấy Thực Thương / Tài; kỵ Ấn đoạt thực, Tỷ Kiếp, Quan» |
| Thưởng | Đạo Hạnh +40 · Phúc Khí +35 · DEED-T02 Cứu người nguy cấp (+3) — nếu anh Đạt nhận việc · DEED-T09 (+1) |
| Bỏ dở | — |
| Cờ đặt | `F_DAT_HOC_MOC` |

```
[CẢNH BR-NT-06.1 · Bến hàng · giờ Thân]
ANH ĐẠT: (ngồi trên bao hàng, không vác) Chủ bến nói số tui là số khuân vác. Tui hỏi sao ổng biết. Ổng nói ổng có ông anh làm thầy ở quầy đỏ, coi giùm rồi. Khuân vác tới già.
ANH ĐẠT: Người giải số cho tui bữa trước nói số tui «lạ». Lạ là sao? Lạ có phải là xấu không?
NGƯỜI CHƠI: (tự động) Bữa đó mới làm hai bước. Hôm nay làm nốt.
```

```
[CẢNH BR-NT-06.2 · Bàn Thầy · án anh Đạt bước 3–6]
(Ghế khách học. Thầy Tử Bình ngồi cạnh.)
(Bước Vượng nhược:) THẦY TỬ BÌNH: Nhâm Thủy tháng Mão. Thất lệnh, không gốc, không thế. Thân quá nhược.
(Bước Dụng thần — bẫy dạy học: người chơi đã quen khuôn «thân nhược thì lấy Ấn, Tỷ trợ thân» sẽ chọn Kim hoặc Thủy.)
THẦY TỬ BÌNH: (nếu chọn Kim / Thủy) Khuôn thường thì đúng. Nhưng lá số này không theo khuôn thường. Mộc bốn mươi sáu phần, Thủy nhỏ đến mức không đứng nổi. Sách gọi là tòng: theo cái thế mạnh nhất. Theo Mộc — Thực Thương.
THẦY TỬ BÌNH: (nếu chọn Mộc) Con thấy chữ «tòng». Ai dạy con? (nếu F_BRANCH = NT) …Tự thấy. Tốt.
(Bước Chọn năm: 2026 cao nhất trong sáu năm.)
THẦY TỬ BÌNH: Năm nay. Bính Ngọ, Bình, năm mươi lăm. Không đẹp, nhưng là năm tốt nhất trong sáu năm tới. Và năm Canh Tuất — năm thứ năm — rất xấu. Việc gì đổi thì đổi năm nay.
(Bước Lời khuyên: Mộc, Hỏa nên theo; Kim, Thổ nên tránh.)
```

```
[CẢNH BR-NT-06.3 · Nói với anh Đạt]
> Lựa chọn:
>   ① «Lá số anh không phải số khuân vác. Lá số anh là số làm ra thứ gì đó bằng tay, với cây gỗ. Năm nay là năm nên đổi.» → [06.4]
>   ② «Lạ không phải xấu. Lạ là người ta đọc theo khuôn thì đọc sai.» → ANH ĐẠT: «Vậy đọc đúng thì sao?» → ①
>   ③ «Chủ bến nói sai. Anh nghỉ đi.» → ANH ĐẠT: «Nghỉ rồi ăn gì?» → ① (dạy: chỉ bác bỏ thì chưa đủ, phải chỉ đường)
```

```
[CẢNH BR-NT-06.4 · Xưởng Ông Kha]
ÔNG KHA: (nhìn tay anh Đạt) Tay chai kiểu khuân vác. Nắm chặt quá. Làm mộc thì phải nắm vừa.
ÔNG KHA: Tôi không có học trò từ hồi thầy tôi đi. (im) Ba mươi tám tuổi mới học mộc thì muộn. Mà Mộc là Dụng của anh à? (cười khan) Vậy để tôi xem anh bào thử.
(Anh Đạt bào một tấm ván; nét bào lệch nhưng đều.)
ÔNG KHA: Mai tới. Giờ Mão. Mang theo cái nắm tay vừa.
(DEED-T02 +3 khi anh Đạt đi học buổi đầu — sự kiện ngày sau. Gieo: ở MQ-2-16 nhánh NT, anh Đạt xuất hiện với túi đồ nghề mộc thay vì đòn gánh.)
NGƯỜI CHƠI: (độc thoại, chữ nổi) Người ta nói số anh vậy rồi. Người ta cũng nói số mình vậy rồi.
```

---

## BR-NT-07 · Cổng mở

| Trường | Giá trị |
|---|---|
| Mã | BR-NT-07 |
| Tên | Cổng mở |
| Vùng | `thanh` — Tổ Sư Đường, nhà trọ Mái Rêu |
| Điều kiện | BR-NT-06; bài tập 49 ngày (BR-NT-04) đạt ≥ 49 ngày đếm; MQ-2-16 |
| Người giao | `thay_tubinh`; bà Năm Rêu |
| Mục tiêu | 1. Bà Năm Rêu nhắn: Thầy Tử Bình gọi lên Tổ Sư Đường. 2. Đứng trước khám. 3. Đèn sáng. 4. Nghe Thầy kể chuyện ba mươi năm trước. 5. Ghi tên vào trang đệ tử. |
| Móc engine | — |
| Thưởng | Đạo Hạnh +45 · Phúc Khí +30 · danh hiệu «Nghịch Thiên» + «Đệ Tử Huyền Quán» · CUT-043 |
| Bỏ dở | — |
| Cờ đặt | `F_BR_DONE = NT`, `F_NT_DE_TU` |

```
[CẢNH BR-NT-07.1 · Tổ Sư Đường · giờ Dậu · CUT-043]
(Người chơi bước vào. Ngọn đèn trước khám sáng thêm một nấc — rồi một nấc nữa.)
THẦY TỬ BÌNH: (đứng sau, không ngạc nhiên) Đèn sáng.
THẦY TỬ BÌNH: Con có hỏi bà Năm người ở phòng con trước kia là ai không? (người chơi chọn ① «Có, bà không nói tên.» ② «Con đọc dòng chữ dưới cửa sổ.»)
THẦY TỬ BÌNH: Chữ «K.» là chữ Khải. Tử Bình Khải. Tên thầy trước khi Quán đặt tên cho thầy.
THẦY TỬ BÌNH: Ba mươi năm trước thầy đứng chỗ con. Đèn đứng yên. Thầy ngủ ở Mái Rêu ba năm. Đêm thứ ba có lão sư gõ cửa. Thầy lên Văn Miếu đọc lập chí. Thầy lát đường đá.
THẦY TỬ BÌNH: Thầy không biết đèn đọc cái gì. Thầy chỉ biết: lệ của đèn không làm ai thành thầy. Việc người ta làm trong lúc chờ đèn mới làm người ta thành thầy.
> Lựa chọn:
>   ① «Sao thầy không bỏ cái lệ đó?» → THẦY: «Vì nếu bỏ, người đèn không sáng sẽ không có ba năm ở Mái Rêu. Thầy không muốn ai mất ba năm đó.»
>   ② (cúi lạy một lạy) → THẦY: «Một lạy. Giờ con có cái để xin rồi. Xin gì?» → (ô nhập ≤ 20 chữ)
```

```
[CẢNH BR-NT-07.2 · Bàn Thầy · trang đệ tử]
THẦY TỬ BÌNH: (lật sổ Quán từ trang khách học sang trang đệ tử, chép lại dòng của người chơi) {ten}. Tới ngày {…}. Việc đầu tiên: {…}. Ngày đèn sáng: {hôm nay}. Khoảng giữa: {số ngày} ngày.
HỨA KHANG: (nếu chưa thành đệ tử) Cậu / cô lên trang kia rồi. (cười) Tôi còn ghế cứng. Mà ghế cứng có người ngồi cạnh quen rồi.
NGƯỜI CHƠI: (lựa chọn) ① «Mai tôi vẫn ngồi cạnh cậu.» → (DEED-T09 +1; gieo hậu truyện Hứa Khang ở BR-TT-07 / sư đồ) ② «Cậu sẽ lên.» → HỨA KHANG: «Ừ.»
BÀ NĂM RÊU: (tối hôm đó, ở Mái Rêu) Phòng đó bà để trống. Đứa sau tới thì có chỗ.
```

---

# B. DỊ CÁCH (`pattern.type === 'special'`)

**Câu hỏi của nhánh:** khi lá số không vừa khuôn «phù ức» của số đông, người ta sống thế nào cho đúng mình? Đáp án nhánh: **thuận thế thay vì phù ức** (`remedy-fate › DAO_JIA` «道法自然 — không kháng mệnh mà thuận hóa, đổi trong thuận»), và **biết vận nào phá cách** (bệnh tiềm ẩn của cách đặc biệt).

**Các loại cách đặc biệt engine nhận diện** (`pattern-quality › specialVerdict`): `cong` (tòng — theo thế), `zhuanwang` (chuyên vượng — một hành chiếm cục), `huaqi` (hóa khí — engine chuẩn bị, `pattern.js` chưa sinh). Kịch bản có câu riêng cho từng loại; DK-1 là `zhuanwang`.

| `special.kind` | Hình ảnh Phương sĩ dùng | Bệnh tiềm ẩn engine ghi | Thử thách nhánh |
|---|---|---|---|
| `zhuanwang` | dòng sông một chiều | vận khắc hành chuyên vượng (Quan Sát) phá cách | BR-DK-05 «gió ngược» với hành khắc |
| `cong` | cánh diều theo gió | vận Ấn / Tỷ (trợ thân) đưa thân «nổi dậy» làm tòng giả biến động | BR-DK-05 với hành trợ thân |
| `huaqi` | hai dòng nước nhập một | can khắc hóa thần thấu can | (chưa có — chờ engine) |

## BR-DK-01 · Người lạ trên mái

| Trường | Giá trị |
|---|---|
| Mã | BR-DK-01 |
| Tên | Người lạ trên mái |
| Vùng | `thanh` — mái Trà Thất, Bàn Thầy |
| Điều kiện | MQ-P-08 với `F_BRANCH = DK` |
| Người giao | `phuong_si` Phương sĩ Vô Danh |
| Mục tiêu | 1. Leo lên mái Trà Thất ngồi với Phương sĩ. 2. Nghe ông giải «cách lạ». 3. Xuống Bàn Thầy hỏi Thầy Tử Bình cùng câu hỏi. 4. So hai câu trả lời. |
| Móc engine | `pattern.{type, vi, special.kind, special.name}` (DK-1: special, «Tòng Cách cách (Chuyên Vượng Kim)», `zhuanwang`, 從革格); `yong.reasons` (DK-1: «Cách cục đặc biệt — Chuyên Vượng Kim — thuận thế tiết tú; kỵ Quan Sát (Hỏa) phạm vượng»; «Theo thế cục, Dụng lấy nhóm Thực Thương / Tỷ Kiếp → Thủy, Kim; kỵ nhóm Quan Sát → Hỏa»); `yong.method` |
| Thưởng | Đạo Hạnh +20 · Phúc Khí +20 |
| Bỏ dở | — |
| Cờ đặt | `F_DK_MAI` |

```
[CẢNH BR-DK-01.1 · Mái Trà Thất · giờ Thìn · gió]
PHƯƠNG SĨ VÔ DANH: Lên đây. Ngói chắc. Dì Hạnh lợp kỹ.
PHƯƠNG SĨ VÔ DANH: Lá số bạn, Kim sáu mươi mốt phần. Thầy dưới kia học khuôn «thân vượng thì khắc, thân nhược thì sinh». Khuôn đó đúng cho chín phần mười người đời.
PHƯƠNG SĨ VÔ DANH: Phần mười còn lại, một hành nuốt cả cục. Như con sông lớn. Bạn đắp đê chặn sông lớn thì đê vỡ. Sách Trích Thiên Tủy có câu: cái vượng tới cực thì không thể làm tổn. Phải cho nó chảy.
PHƯƠNG SĨ VÔ DANH: Cho chảy ra đâu? Ra Thủy — cái Kim sinh ra. Tài năng, lời nói, việc làm ra. Gọi là tiết tú.
> Lựa chọn:
>   ① [Hỏi] «Còn Hỏa?» → PHƯƠNG SĨ: «Hỏa khắc Kim. Với người thường, Hỏa là thầy nghiêm. Với bạn, Hỏa là người chặn sông. Năm nào gặp Hỏa lớn, bạn nhớ tại hạ.»
>   ② [Thẳng] «Thầy Tử Bình có biết không?» → PHƯƠNG SĨ: «Biết chứ. Xuống hỏi thử.»
```

```
[CẢNH BR-DK-01.2 · Bàn Thầy]
THẦY TỬ BÌNH: (đọc `yong.method`) Lá số con engine ghi «cách cục đặc biệt». Thầy đọc theo phép tòng, chuyên vượng — Dụng là {Thủy}, lấy tiết. Đúng như ông ấy nói.
THẦY TỬ BÌNH: Thầy không biết ông ấy là ai. Quán không có phép nào cấm người không phái dạy người. Con học ông ấy được. Ông ấy biết cái thầy biết ít.
THẦY TỬ BÌNH: Chỉ dặn: cách lạ thì đừng tự cho mình là lạ hơn người. Lạ là cách đọc, không phải giá trị.
```

---

## BR-DK-02 · Thuận thế

| Trường | Giá trị |
|---|---|
| Mã | BR-DK-02 |
| Tên | Thuận thế |
| Vùng | `vancoc` — đỉnh Hậu Sơn (trên am Vân Cốc, ngọn có cây tùng cụt) |
| Điều kiện | BR-DK-01 |
| Người giao | `phuong_si` |
| Mục tiêu | 1. Leo đỉnh Hậu Sơn. 2. Thả ba chiếc thuyền lá xuống khe suối: lần một chắn đường thuyền bằng đá; lần hai đẩy ngược dòng; lần ba thả theo dòng. 3. Quan sát. 4. Áp vào lá số: viết ra «dòng chảy» của mình (một việc tiết tú). |
| Móc engine | `remedy-fate › DAO_JIA[3]` «道法自然 — không kháng mệnh mà thuận hóa, đổi trong thuận; nhận → thuận → hóa (không cưỡng)»; `yong.primary` (DK-1 Thủy: tiết) |
| Thưởng | Đạo Hạnh +25 · Phúc Khí +20 |
| Bỏ dở | — |
| Cờ đặt | `F_DK_THUAN` |

```
[CẢNH BR-DK-02.1 · Khe suối đỉnh Hậu Sơn · giờ Tỵ]
PHƯƠNG SĨ VÔ DANH: Gấp ba cái thuyền lá. Cái thứ nhất, đặt hòn đá chặn trước nó.
(Thuyền một kẹt sau đá, nước dồn, thuyền lật.)
PHƯƠNG SĨ VÔ DANH: Cái thứ hai, đẩy ngược dòng.
(Người chơi giữ thao tác đẩy; buông tay là thuyền trôi ngược lại, mắc vào bờ.)
PHƯƠNG SĨ VÔ DANH: Cái thứ ba, thả.
(Thuyền ba trôi theo khe, qua ghềnh nhỏ, xuống tận am Vân Cốc — Vân Cốc nhặt lên ở dưới, giơ tay vẫy.)
PHƯƠNG SĨ VÔ DANH: Đạo gia nói: nhận, thuận, rồi hóa. Không kháng. Đổi ở trong cái thuận. Thuyền ba không mạnh hơn hai cái kia. Nó chỉ không bị ai giữ.
> Lựa chọn:
>   ① [Hỏi] «Vậy con cứ để mặc?» → PHƯƠNG SĨ: «Để mặc là thuyền không có người lái. Thuận là có người lái mà lái theo dòng.»
>   ② [Thẳng] «Dòng của con là gì?» → PHƯƠNG SĨ: «Kim sinh Thủy. Cái gì từ trong bạn chảy ra được — lời, nghề, ý — mà không làm khô bạn. Viết ra một việc.»
(Ô nhập ≤ 30 chữ «Dòng chảy của tôi: …», lưu `F_DK_DONG`.)
```

---

## BR-DK-03 · Vận phá cách

| Trường | Giá trị |
|---|---|
| Mã | BR-DK-03 |
| Tên | Vận phá cách |
| Vùng | `thanh` — Vận Mệnh Các |
| Điều kiện | BR-DK-02; MQ-1-14 |
| Người giao | `phuong_si` (lần đầu ông bước vào một công trình của Quán) |
| Mục tiêu | 1. Đọc bệnh tiềm ẩn của cách. 2. Tìm các cổng đại vận mang hành phá cách. 3. Tìm năm `Y*` và soi: năm ấy có mang hành phá cách không. 4. Lập «ba điều nhường» cho những năm ấy. |
| Móc engine | `patternQuality.diseases[]` với `latent: true` (DK-1: «Bệnh tiềm ẩn (chỉ phát khi gặp vận): chuyên vượng kỵ Quan Sát — vận khắc thân phạm vượng thì phá cách»); `dayun[]` (DK-1: 辛卯 55t 2024 Hơi thuận · **壬辰 65t 2034 Hung** · **癸巳 75t 2044 Hung** · **甲午 85t 2054 Hung**); `decadeForecast(R, 2027, 10).worst` (DK-1: **2036 丙辰 Đại hung 6** — can Bính là Hỏa, Thất Sát với Canh) |
| Thưởng | Đạo Hạnh +30 · Phúc Khí +25 |
| Bỏ dở | — |
| Cờ đặt | `F_DK_BA_NHUONG` |

```
[CẢNH BR-DK-03.1 · Vận Mệnh Các · giờ Mùi]
PHƯƠNG SĨ VÔ DANH: (đứng giữa hành lang chín cổng, nhìn quanh) Quán làm cái này đẹp. Tại hạ không có Các, tại hạ có trí nhớ. (cười)
PHƯƠNG SĨ VÔ DANH: Cách bạn thành. Nhưng engine của Quán ghi một dòng chữ nhỏ: «bệnh tiềm ẩn — chỉ phát khi gặp vận». Sông lớn không sợ trời nắng, chỉ sợ núi lở chắn dòng.
PHƯƠNG SĨ VÔ DANH: Cổng nào mang Hỏa? (người chơi chạm các cổng: 壬辰 Hung, 癸巳 Hung — chi Tỵ là Hỏa, 甲午 Hung — chi Ngọ là Hỏa)
PHƯƠNG SĨ VÔ DANH: Còn năm thấp nhất mười năm tới của bạn — năm Bính Thìn. Can Bính là Hỏa. Thất Sát đứng ngay trên đầu năm.
PHƯƠNG SĨ VÔ DANH: Người cách thường gặp năm Thất Sát thì chống. Người cách bạn mà chống thì vỡ. Phải nhường.
```

```
[CẢNH BR-DK-03.2 · Ba điều nhường]
PHƯƠNG SĨ VÔ DANH: Viết ba điều. Năm Hỏa tới, bạn nhường cái gì.
(Ba ô ≤ 20 chữ; gợi ý mờ: «nhường người trên nói trước», «nhường việc lớn sang năm sau», «nhường phần thắng trong tranh cãi».)
PHƯƠNG SĨ VÔ DANH: Nhường không phải thua. Sông gặp núi thì vòng. Vòng xong vẫn là sông.
(Ba điều lưu vào Sổ; Hồi III ở MQ-3-07, MQ-3-08 có một câu nhắc riêng nếu Y* mang hành phá cách.)
```

---

## BR-DK-04 · Kẻ không vừa khuôn

| Trường | Giá trị |
|---|---|
| Mã | BR-DK-04 |
| Tên | Kẻ không vừa khuôn |
| Vùng | `thanh` — Bàn Thầy |
| Điều kiện | BR-DK-03 |
| Người giao | Thanh Phong |
| Mục tiêu | 1. Thanh Phong nhờ xem án của một khách «lạ» trước kỳ khảo đệ tử. 2. Thấy Thanh Phong chọn Dụng theo khuôn phù ức. 3. Chỉ cho Thanh Phong chỗ engine ghi «cách cục đặc biệt» mà không làm cậu xấu hổ. 4. Cùng nhau giải lại. |
| Móc engine | `cases › buildCase` khách anh Đạt (Tòng Nhi; `explain.method` = «Cách cục đặc biệt»; khóa Dụng Mộc, phụ Hỏa) — dùng lại án MQ-1-02 dưới góc nhìn người dạy; `gradeYong` |
| Thưởng | Đạo Hạnh +25 · Phúc Khí +20 · DEED-T09 (+1) |
| Bỏ dở | — |
| Cờ đặt | `F_DK_TP` |

```
[CẢNH BR-DK-04.1 · Bàn Thầy · giờ Thân · vắng]
THANH PHONG: (nhăn mặt nhìn tờ án) Mai khảo đệ tử. Thầy cho án này luyện. Thân quá nhược, mình chọn Kim sinh Thủy, đúng sách mà! Máy chấm không điểm!
THANH PHONG: Bạn cách lạ, bạn xem giùm. Có khi máy sai.
> Lựa chọn:
>   ① [Hỏi trước] «Phần "Phương pháp" của án ghi gì?» → THANH PHONG: (đọc) «Cách cục… đặc biệt.» (im) «…À.» → [04.2]
>   ② [Thẳng] «Lá số này tòng. Không lấy Kim.» → THANH PHONG: (đỏ mặt) «Sao bạn biết? Vì bạn lạ hả?» → [04.2] (kèm câu sửa của người chơi)
```

```
[CẢNH BR-DK-04.2 · Giải lại]
NGƯỜI CHƠI: (tự động) Mình biết vì ông Phương sĩ dạy mình con sông. Lá số này là cánh diều. Gió Mộc mạnh, diều theo gió. Mình mà buộc nó xuống đất thì đứt dây.
THANH PHONG: (chọn lại Mộc; máy chấm hiện «Dụng thần: Mộc (phụ Hỏa)».) …Đúng.
THANH PHONG: Mai khảo mà gặp án này thì chết. (cười) Không chết, ý mình là trượt.
NGƯỜI CHƠI: (lựa chọn) ① «Cậu thấy chữ "đặc biệt" thì dừng lại một giây. Vậy là đủ.» ② «Khuôn đúng chín phần mười. Cậu chỉ cần nhớ phần mười.»
THANH PHONG: (gấp tờ án) Mình tưởng người cách lạ thì khó nói chuyện. Bạn dễ nói chuyện hơn mình nghĩ.
(Ngày hôm sau: Thanh Phong đỗ khảo — một dòng thoại ở Trà Thất. DEED-T09 +1.)
```

---

## BR-DK-05 · Gió ngược

| Trường | Giá trị |
|---|---|
| Mã | BR-DK-05 |
| Tên | Gió ngược |
| Vùng | `trichthien` — Trích Thiên Đỉnh, đường đuốc lên Đẩu Mẫu Điện |
| Điều kiện | BR-DK-04; đã tới `trichthien` |
| Người giao | `phuong_si` |
| Mục tiêu | 1. Đêm lễ đuốc ở Trích Thiên Đỉnh: hàng người cầm đuốc lên đỉnh. 2. Người chơi được trao cây đuốc lớn nhất và vị trí đi đầu (thử thách: hành khắc cách — Hỏa). 3. Chọn: giữ vị trí đầu và đi nhanh / nhường đuốc cho người phía sau và đi giữa hàng. 4. Ngồi ngắm sao với Phương sĩ. |
| Móc engine | hành khắc cách (DK-1: Hỏa = Quan Sát); `yong.reasons` «旺之极者不可损» |
| Thưởng | Đạo Hạnh +30 · Phúc Khí +25 |
| Bỏ dở | — |
| Cờ đặt | `F_DK_GIO ∈ {nhuong, giu}` |

```
[CẢNH BR-DK-05.1 · Chân Trích Thiên Đỉnh · giờ Tuất · đuốc]
ÔNG GIỮ ĐÈN ĐẨU MẪU ĐIỆN: Người của Quán đi đầu, cầm đuốc lớn. Lệ của lễ.
(Đuốc lớn nặng, lửa táp gần mặt. Đi đầu: gió ngược từ đỉnh thổi xuống, Nguyên Khí tụt nhanh — đúng biểu tượng «Hỏa khắc Kim».)
PHƯƠNG SĨ VÔ DANH: (đi bên cạnh, tay không) Đuốc nặng không?
> Lựa chọn:
>   ① [Nhường] Trao đuốc lớn cho chàng trai phía sau (người khỏe, Hỏa là Dụng của cậu ta — Sổ Mệnh hiện gợi ý nếu người chơi mở), đi giữa hàng → [05.2a]
>   ② [Giữ] Đi đầu đến đỉnh → [05.2b]
```

```
[CẢNH BR-DK-05.2a · Nhường]
(Hàng đuốc đi đều; người chơi tới đỉnh không mất nhiều Nguyên Khí.)
PHƯƠNG SĨ VÔ DANH: Đuốc ấy với cậu kia là Dụng. Với bạn là Quan Sát. Cùng một ngọn lửa. Người khôn đưa lửa cho người cần lửa.
```

```
[CẢNH BR-DK-05.2b · Giữ]
(Tới đỉnh, Nguyên Khí gần cạn; người chơi ngồi phịch xuống bậc đá. Không có hình phạt khác.)
PHƯƠNG SĨ VÔ DANH: Tới được. Mệt không? Đó là vị của năm Hỏa. Lần sau bạn nhớ vị đó, rồi quyết.
```

```
[CẢNH BR-DK-05.3 · Ngắm sao · Đẩu Mẫu Điện]
PHƯƠNG SĨ VÔ DANH: Bắc Đẩu bảy sao. Sao nào cũng sáng, mà sao nào cũng nằm đúng chỗ của nó. Không sao nào cố thành sao khác.
PHƯƠNG SĨ VÔ DANH: Tại hạ cũng cách lạ. Tòng Tài. Người ta bảo tại hạ là kẻ chạy theo của. Tại hạ đi theo của người khác — làm thuê, làm thuốc, làm đường — rồi không giữ cái gì. Ba mươi năm, tại hạ không có nhà.
PHƯƠNG SĨ VÔ DANH: Bạn đừng học tại hạ chỗ không có nhà. Học chỗ biết mình là ai.
```

---

## BR-DK-06 · Lá cờ đổi hướng

| Trường | Giá trị |
|---|---|
| Mã | BR-DK-06 |
| Tên | Lá cờ đổi hướng |
| Vùng | `thanh` — đồi gió phía Bắc Huyền Thành |
| Điều kiện | BR-DK-05; MQ-3-09 |
| Người giao | `phuong_si` |
| Mục tiêu | 1. Nhận lá cờ vải trơn trên cán tre của Phương sĩ (ông sắp đi). 2. Tìm một chỗ cắm cờ để người đi đường nhìn thấy hướng gió (cho thuyền bè Cùng Thông Hồ, cho người phơi thuốc). 3. Cắm. 4. Tiễn Phương sĩ. |
| Móc engine | — |
| Thưởng | Đạo Hạnh +25 · Phúc Khí +20 · DEED-T06 (+2) nếu chọn chỗ ít người biết ai cắm |
| Bỏ dở | — |
| Cờ đặt | `F_DK_CO` |

```
[CẢNH BR-DK-06.1 · Đồi gió · giờ Thân]
PHƯƠNG SĨ VÔ DANH: (đưa lá cờ) Cờ không chọn hướng. Cờ cho người ta thấy gió đi hướng nào. Tại hạ mang cờ này ba mươi năm, cắm ở đâu thì đi khỏi đó.
PHƯƠNG SĨ VÔ DANH: Lần này tại hạ đi mà không mang. Bạn cắm giùm.
> Chọn chỗ: ① đỉnh đồi gió — ai cũng thấy, bến thuyền dùng được ② sau xóm phơi thuốc — chỉ người phơi thuốc thấy (DEED-T06 +2) ③ cạnh nhà riêng của người chơi — gió cho nhà mình
PHƯƠNG SĨ VÔ DANH: (với ③) Cắm cho mình cũng được. Mình cũng là một người cần biết gió. (không có thưởng thêm, không bị chê)
```

```
[CẢNH BR-DK-06.2 · Tiễn]
PHƯƠNG SĨ VÔ DANH: Tại hạ đi Tạng Địa. Nghe nói đường đang dọn. Tại hạ không đợi dọn xong. (cười) Người tòng thì đi trước đường.
PHƯƠNG SĨ VÔ DANH: Lúc bạn lên Côn Lôn, nếu thấy có người thả thuyền lá xuống thác, đó là tại hạ.
(Phương sĩ đi về phía Tây Bắc. Cờ phấp phới đổi hướng theo gió chiều.)
```

---

## BR-DK-07 · Dị Nhân

| Trường | Giá trị |
|---|---|
| Mã | BR-DK-07 |
| Tên | Dị Nhân |
| Vùng | `thanh` — Bàn Thầy, Thư Lâu (kệ giáo trình của Quán) |
| Điều kiện | BR-DK-06; MQ-4-13 |
| Người giao | `thay_tubinh` |
| Mục tiêu | 1. Thầy nhờ viết một trang giáo trình «Khi lá số không vừa khuôn» cho đệ tử mới. 2. Viết ba đoạn (chọn câu trong các câu Phương sĩ đã dạy, ghép theo thứ tự). 3. Trao trang cho Thanh Phong (giờ là người dạy khách học). |
| Móc engine | — (dùng lại cờ `F_DK_DONG`, `F_DK_BA_NHUONG`, `F_DK_GIO`) |
| Thưởng | Đạo Hạnh +45 · Phúc Khí +45 · danh hiệu «Dị Nhân» · CUT-044 |
| Bỏ dở | — |
| Cờ đặt | `F_BR_DONE = DK` |

```
[CẢNH BR-DK-07.1 · Bàn Thầy · giờ Thìn · CUT-044]
THẦY TỬ BÌNH: Giáo trình của Quán dạy phù ức chín phần mười. Phần mười kia thầy chỉ dạy bằng một dòng: «gặp cách đặc biệt thì đọc theo thế». Một dòng thì không đủ. Con viết giúp thầy một trang.
(Mini-game ghép đoạn: ba khung trống; mỗi khung chọn một trong bốn câu đã nghe từ Phương sĩ / từ chính người chơi — «Chặn sông thì vỡ đê», «Nhận, thuận, rồi hóa», «Sông gặp núi thì vòng», «Cờ không chọn hướng», «Dòng chảy của tôi: {F_DK_DONG}». Mọi tổ hợp đều chấp nhận.)
THẦY TỬ BÌNH: (đọc trang) Được. Thầy để tên con dưới trang.
NGƯỜI CHƠI: (lựa chọn) ① «Để tên Phương sĩ.» → THẦY: «Ông ấy không có tên.» → NGƯỜI CHƠI: «Vậy để "Vô Danh".» → THẦY: (cười) «Được. Trang đầu tiên trong giáo trình Quán có tác giả là "Vô Danh".» ② «Để tên con.» → THẦY: «Được.»
THANH PHONG: (nhận trang) Mai mình dạy khách học trang này đầu tiên. (nhìn người chơi) Bạn biết không, bạn là người lạ dễ hiểu nhất mình từng gặp.
```

---

## Kiểm thử nghiệm thu hai nhánh

| # | Kiểm | Đạt khi |
|---|---|---|
| 1 | NT-1 vào NT; DK-1 vào DK (dù `quality` = 成格) | luật README §2.2, ưu tiên `pattern.type === 'special'` |
| 2 | Không câu nào gán «đèn không sáng» với điểm số | quét thoại BR-NT: mọi câu Thầy Tử Bình đều tách đèn khỏi lá số |
| 3 | Câu dẫn §4.7 hoặc tương đương xuất hiện ở BR-NT-03 | Vân Cốc nói «xấu là chữ của người xem» trước khi đọc dòng âm |
| 4 | Hệ số Nghịch Thiên hiện đúng | NT-1 → × 1,41; DK-1 (điểm 43) → × 1,17 |
| 5 | Bài tập 49 ngày của NT không phạt đứt quãng | đếm tiếp sau ngày nghỉ |
| 6 | Án anh Đạt (Tòng Nhi) chấm theo khóa engine | `gradeYong('木')` = 1 |
| 7 | Bệnh tiềm ẩn DK lấy từ `diseases[].latent` | DK-1 hiện đúng câu «chuyên vượng kỵ Quan Sát» |
| 8 | Biến thể `cong` / `zhuanwang` có thoại riêng | lá số tòng thử nghiệm (vd anh Đạt nếu là người chơi) vào hình ảnh «cánh diều» |
