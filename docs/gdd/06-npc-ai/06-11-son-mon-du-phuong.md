# 06-11 · Lão Tùng · Bà Tư thợ may · Đan Đỉnh chân nhân · Phương sĩ Vô Danh

> Bốn NPC «cửa ngõ»:
> - hai người ở Sơn Môn dẫn người chơi vào game: gác cổng, thợ may;
> - hai người dẫn hai nhánh Mệnh Cách hiếm: Đắc Cứu, Dị Cách.
>
> Lão Tùng và Bà Tư **chỉ chạy kịch bản**: tutorial và cửa hàng phải tất định, và **không được để AI nói về tiền**.

---

# A. Lão Tùng (`gac_cong`) — người gác cổng Sơn Môn

## A1. Thẻ kỹ thuật

| Trường | Giá trị |
|---|---|
| npc id | `gac_cong` |
| Tên | Lão Tùng |
| Nơi | cổng Huyền Quán Sơn Môn (`thanh`) |
| Vai | Mở đầu 0.1 (hỏi ngày giờ sinh — form bát tự đã có); tutorial điều khiển; giải thích quyền riêng tư; đưa thư Thầy Tử Bình lên núi (06-04 TB.33) |
| `runtime` | `scripted` |
| Lý do | tutorial phải tất định; câu về quyền riêng tư phải đúng nguyên văn đã duyệt (06-01 §12.1) |
| Phiên bản persona | 0 (chỉ quy trình viết) |

## A2. Tiểu sử

- **Ba mươi năm gác cổng.** Lão Tùng gác cổng Sơn Môn ba mươi năm.
  - Ông không biết đọc lá số, và tự hào về điều đó: «Tôi chỉ hỏi ngày sinh. Đọc là việc của thầy.»
  - Ông nhớ mặt từng người đi qua cổng, kể cả Công Thâu Nghiệt bốn mươi năm trước (tiết lộ ở thiện cảm 80).
- **Pha chè dở, tốt bụng.** Ông pha chè rất đặc, và là bạn uống chè buổi tối của Thầy Tử Bình.
- **Đêm có người bị «chưa nhận».** Đêm người chơi Nghịch Thiên bị Sơn Môn «chưa nhận», chính ông cầm thư leo lên Am Vân Cốc trong mưa.
  - Ông không kể. Người chơi chỉ biết qua Thầy Tử Bình (TB.33) hoặc qua một bark ông lỡ miệng.

## A3. Ngoại hình

| Bộ phận | Mô tả | Màu |
|---|---|---|
| Dáng | khoảng 70, thấp, chắc, chân vòng kiềng, đi chậm | — |
| Mặt | tròn, đỏ au, râu bạc lởm chởm, cười móm (thiếu hai răng cửa) | #C9906A |
| Áo | áo nâu ngắn, quần ống rộng xắn gối, khăn mỏ quạ nâu; tấm áo tơi lá khi mưa | #6A4A33 |
| Đạo cụ | chổi tre, ấm chè sành, sổ ghi khách (ông chỉ đánh dấu, không viết tên), đèn bão | — |

**Hoạt cảnh:** quét cổng; rót chè; ngủ gật trên ghế đẩu giờ Mùi; giơ đèn bão soi mặt khách lúc tối.

## A4. Xưng hô, giọng

- **Xưng hô:** tự xưng «lão», gọi người chơi «cậu / cô» theo giới tính khai ở form. Trước khi khai giới tính: «khách».
- **Giọng:** quê, chân chất, câu ngắn, hay cười «hề hề».

## A5. Câu mẫu (32 câu)

1. «Khách tới Sơn Môn à. Hề hề. Ngày giờ sinh của khách là gì?»
2. «Lão không biết đọc lá số. Lão chỉ hỏi ngày sinh. Đọc là việc của thầy.»
3. «Giờ sinh không nhớ? Không sao. Cứ khai giờ gần đúng. Vào trong thầy chỉ cách quét mười hai giờ, xem giờ nào hợp đời mình.»
4. «Ngày sinh của khách được tính ngay trên máy của khách. Khi khách hỏi các thầy bằng lời tự do, bản tóm tắt lá số mới gửi đi để thầy luận. Lão nói thật, lão không giấu.» (câu quyền riêng tư — nguyên văn rút gọn từ 06-01 §12.1)
5. «Khách muốn tắt hẳn phần thầy luận tự do thì vào Cài đặt. Thầy vẫn nói theo sách cũ.»
6. «Đi thì bấm hướng. Muốn nhanh thì giữ phím chạy. Lão già rồi, lão đi bộ.»
7. «Sổ Mệnh của khách ở đây. Mở ra là thấy mình.»
8. «Khách đói thì ra quán trà ông Lục Bảng dưới phố. Chè ông ấy ngon hơn chè lão.»
9. «Lão pha chè đặc quá à? Thầy Tử Bình cũng chê. Thầy vẫn uống.»
10. «Thầy bận khách. Khách ngồi ghế kia chờ một chút.»
11. «Ông Khổng ngồi bậc thứ ba kia. Ông ấy nói ba câu thì đi. Đừng sợ.»
12. «Trong sân có Tàng Y Các của bà Tư. Áo đầu tiên bà tặng, không mất gì.»
13. «Thiên Mệnh Bàn trên đầu kia. Nứt một đường. Lão nhìn ba mươi năm, năm nay nó nứt thêm.»
14. «Khách chưa được nhận à? … Lão biết. Nhà trọ "Mây Lành" dưới phố, bà Hai tốt bụng lắm.»
15. «Đêm qua mưa to. Lão đi đâu à? Không, lão ngủ. Hề hề.» (lỡ miệng, MC:NT)
16. «Khách đi xa nhớ về. Cổng này mở cho người về.»
17. «Lão quét lá ba mươi năm. Lá vẫn rụng. Lão vẫn quét.»
18. «Tuổi khách năm nay phạm Thái Tuế à? Lão không biết. Vào Thái Tuế Điện cuối sân mà hỏi.»
19. «Người lạ đeo bùa đen đi qua cổng hôm qua. Lão nhớ mặt.» (Hồi III)
20. «Lão nhớ mặt mọi người qua cổng. Cả người bốn mươi năm trước.» (A ≥ 80)
21. «Gió bấc rồi. Khách mặc thêm áo.»
22. «Khách có ai đi cùng không? Đi một mình thì cũng được, Sơn Môn đông người.»
23. «Thầy dặn: khách nào hỏi đường lên núi sau thì chỉ lối Hậu Sơn. Lối này.»
24. «Bậc đá lên Am Vân Cốc có cái thứ chín trơn. Lão ngã ở đó một lần.»
25. «Lão không biết chữ, nhưng lão biết ai buồn. Khách buồn à?»
26. «Ngồi uống chén chè đã. Rồi đi.»
27. «Hề hề. Khách hỏi lão câu khó quá.»
28. «Sổ của lão không có tên. Lão đánh dấu: một vạch một người. Ba mươi năm, nhiều vạch lắm.»
29. (TL) «Khách về muộn. Cổng vẫn mở.»
30. (HD) «Hề hề. Lão biết khách sẽ về.»
31. «Lão không bán gì. Chè thì cho.»
32. «Về đi, đóng cổng rồi. À không, cổng không đóng. Lão nói thế cho có lệ.»

## A6. Lịch theo giờ

| Giờ | Việc | Ở đâu |
|---|---|---|
| Tý–Dần | ngủ ở chòi cổng (cổng không khoá) | chòi cổng |
| Mão | quét cổng, mài mực cho Thầy | cổng / Bàn Thầy |
| Thìn–Ngọ | đón khách, hỏi ngày sinh | cổng |
| Mùi | ngủ gật trên ghế đẩu | cổng |
| Thân | đón khách | cổng |
| Dậu | thắp đèn bão | cổng |
| Tuất | uống chè với Thầy | cổng |
| Hợi | đi một vòng sân | sân Sơn Môn |

## A7. Thiện cảm

- **Tăng thêm:** uống chè với ông giờ Tuất (+1/ngày); giúp quét cổng (+1).
- **Quà thích:** chè Thái, thuốc lào (chỉ là vật phẩm trang trí ông «để dành»).

| Bậc | Mở |
|---|---|
| Quen mặt (20) | LT.10 chỉ đường bí mật lên Hậu Sơn |
| Tin cậy (40) | LT.12 ba mươi năm quét lá |
| Thân tín (60) | LT.13 «đêm qua lão ngủ» (lỡ miệng chuyện đưa thư) |
| Tri kỷ (80) | LT.14 người thợ bốn mươi năm trước |

## A8. Cây thoại (tutorial + 20 nút)

```
[LT.01 · Mở đầu 0.1] [chưa có lá số] ios
  LÃO TÙNG: Khách tới Sơn Môn à. Hề hề. Ngày giờ sinh của khách là gì?
  ⟶ UI: form bát tự (đã có)
  > ① (khai đủ) → LT.03  ② «Con không nhớ giờ sinh.» → LT.02  ③ «Sao phải khai?» → LT.04  ④ «Ngày sinh của con có bị lưu không?» → LT.05
[LT.02] LÃO TÙNG: Không sao. Cứ khai giờ gần đúng. Vào trong thầy chỉ cách quét mười hai giờ, xem giờ nào hợp đời mình. → LT.01
[LT.03] LÃO TÙNG: Hề hề. Được rồi. Vào đi, thầy chờ. ⟶ SM: analyze(); Mở đầu 0.2 (TB.01)
[LT.04] LÃO TÙNG: Ở Huyền Giới, lá số là nhân vật của khách. Không khai thì lão không biết khách là ai. Khai sai thì nhân vật sai, không ai phạt. → LT.01
[LT.05 · quyền riêng tư] ios
  LÃO TÙNG: Ngày sinh của khách được tính ngay trên máy của khách. Khi khách hỏi các thầy bằng lời tự do, bản tóm tắt lá số mới gửi đi để thầy luận. Lão nói thật, lão không giấu.
  LÃO TÙNG: Khách muốn tắt hẳn phần thầy luận tự do thì vào Cài đặt. Thầy vẫn nói theo sách cũ.
  ⟶ UI: liên kết «Chính sách quyền riêng tư» (văn bản 06-01 §12.1)
  (iOS: thay câu thứ nhất bằng «Ngày sinh của khách chỉ tính trên máy của khách.» — vì iOS không có AI)
  → LT.01
[LT.06 · tuổi nhỏ] [tuổi tính từ form < 13] ios
  LÃO TÙNG: Khách còn nhỏ quá. Lão cho vào, nhưng các thầy chỉ nói theo sách thôi, không nói tự do. Có gì khó, hỏi bố mẹ nhé.
  ⟶ SM: bật «chế độ thiếu niên» (06-01 §11.4)
[LT.07 · Tutorial đi] LÃO TÙNG: Đi thì bấm hướng. Muốn nhanh thì giữ phím chạy. Lão già rồi, lão đi bộ.
[LT.08 · Tutorial Sổ Mệnh] LÃO TÙNG: Sổ Mệnh của khách ở đây. Mở ra là thấy mình.
[LT.09 · Tutorial nói chuyện] LÃO TÙNG: Muốn nói với ai thì lại gần, bấm nói. Các thầy có sách sẵn câu hỏi; ai muốn hỏi tự do thì gõ.
[LT.10 · Hậu Sơn] [A≥20] LÃO TÙNG: Lối này lên Hậu Sơn, rồi Am Vân Cốc. Bậc thứ chín trơn. Lão ngã ở đó một lần.
[LT.11 · Chưa được nhận] [MC:NT, sau 0.5] LÃO TÙNG: Lão biết. Nhà trọ «Mây Lành» dưới phố, bà Hai tốt bụng lắm. Đi đi, trời sắp mưa.
[LT.12 · Quét lá] [A≥40] LÃO TÙNG: Lão quét lá ba mươi năm. Lá vẫn rụng. Lão vẫn quét. Thế là đạo của lão.
[LT.13 · Lỡ miệng] [A≥60, MC:NT] LÃO TÙNG: Đêm hôm ấy mưa to. Lão đi đâu à? Không, lão ngủ. Hề hề. … Thầy dặn không được kể.
[LT.14 · Người thợ] [A≥80] LÃO TÙNG: Bốn mươi năm trước có một anh thợ trẻ ngồi bậc thứ ba cả đêm. Sơn Môn không nhận. Không ai xuống núi tìm anh ta. Sáng ra anh ta đi. Lão vẫn nhớ mặt.
  ⟶ SM: cờ cho 03 (gợi ý danh tính Lỗ Ban)
[LT.15 · Thái Tuế] LÃO TÙNG: Lão không biết. Vào Thái Tuế Điện cuối sân mà hỏi.
[LT.16 · Buồn] LÃO TÙNG: Lão không biết chữ, nhưng lão biết ai buồn. Ngồi uống chén chè đã. Rồi kể, hoặc không kể cũng được.
[LT.17 · Tà Lộ] [TL] LÃO TÙNG: Khách về muộn. Cổng vẫn mở.
[LT.18 · Hồi Đầu] [HD] LÃO TÙNG: Hề hề. Lão biết khách sẽ về.
[LT.EXIT] LÃO TÙNG: Về đi, đóng cổng rồi. À không, cổng không đóng. Lão nói thế cho có lệ.
[FREE.SLEEP] LÃO TÙNG: (ngáy) … Hả? Khách à. Cổng mở đấy, cứ vào.
```

**Câu rời vai** (kịch bản, khi người chơi chọn lựa chọn chứa tín hiệu khủng hoảng ở form tự do): «Khách ơi, lão không biết chữ nhưng lão biết chuyện này lớn. Khách gọi người nhà ngay nhé.» + khối hỗ trợ.

## A9. Bark

| Mã | Điều kiện | Câu |
|---|---|---|
| BARK-gac_cong-01 | G:Mão | (tiếng chổi tre ở cổng) |
| BARK-gac_cong-02 | G:Thìn | «Khách vào! Ngày sinh đâu?» |
| BARK-gac_cong-03 | G:Thìn–Ngọ | «Thầy bận, ngồi ghế chờ.» |
| BARK-gac_cong-04 | G:Mùi | (ngáy khe khẽ trên ghế đẩu) |
| BARK-gac_cong-05 | G:Dậu | «Thắp đèn nào.» |
| BARK-gac_cong-06 | G:Tuất | «Thầy ơi, chè!» |
| BARK-gac_cong-07 | G:Hợi | «Một vòng sân nữa rồi ngủ.» |
| BARK-gac_cong-08 | W:mưa | «Mưa. Khách vào chòi trú.» |
| BARK-gac_cong-09 | W:gió | «Gió bấc. Mặc thêm áo.» |
| BARK-gac_cong-10 | W:nắng | «Nắng thế này phơi lá được.» |
| BARK-gac_cong-11 | MC:NT | «Bà Hai dưới phố tốt bụng lắm.» |
| BARK-gac_cong-12 | MC:TT | «Đệ tử mới à. Nhớ chào thầy.» |
| BARK-gac_cong-13 | A≥20 | «Lại khách quen. Hề hề.» |
| BARK-gac_cong-14 | A≥60 | «Bậc thứ chín trơn, nhớ chưa?» |
| BARK-gac_cong-15 | TL | «Cổng vẫn mở.» |
| BARK-gac_cong-16 | HD | «Biết ngay mà.» |
| BARK-gac_cong-17 | Hồi III | «Người lạ đeo bùa đen đi qua hôm qua. Lão nhớ mặt.» |
| BARK-gac_cong-18 | gần khong_tiensinh | «Ông Khổng, chè không?» |
| BARK-gac_cong-19 | * | «Hề hề.» |
| BARK-gac_cong-20 | * | «Lão quét lá ba mươi năm.» |

## A10. `PERSONA-gac_cong` (v0, chỉ quy trình viết)

```
[PERSONA-gac_cong · v0 · CHỈ DÙNG TRONG CÔNG CỤ VIẾT · KHÔNG RUNTIME]
Viết bark và thoại phụ cho Lão Tùng, người gác cổng Sơn Môn ba mươi năm: quê, chân chất, không biết đọc lá số («đọc là việc của thầy»), pha chè đặc, nhớ mặt mọi người, hay cười «hề hề». Không bao giờ luận lá số, không nói về tiền. Mọi câu nói về dữ liệu ngày sinh phải dùng nguyên văn đã duyệt ở 06-01 §12.1, không tự diễn đạt.
```

---

# B. Bà Tư — Thợ May Tiên Y (`tho_may`) — quầy Tàng Y Các

## B1. Thẻ kỹ thuật

| Trường | Giá trị |
|---|---|
| npc id | `tho_may` |
| Tên | Bà Tư (Thợ May Tiên Y) |
| Nơi | quầy Tàng Y Các, Sơn Môn (đã có: `wardrobe-ui.js`, `cosmetics.js` — 51 món, 8 ô, 5 bộ ngũ hành) |
| Vai | Mở đầu 0.3 «Phẩm phục» (áo theo Dụng thần, món `y_menh` — Bản Mệnh Y, miễn phí); cửa hàng trang phục |
| `runtime` | `scripted` |
| Lý do | NPC duy nhất **đứng cạnh giá tiền**. Luật game G1 (không phá vai để bán hàng) chỉ an toàn khi mọi câu đều đã được duyệt |
| Phiên bản persona | 0 (chỉ quy trình viết) |

## B2. Tiểu sử

- **Nghề và cửa hàng.** Bà Tư là thợ may bốn đời ở Huyền Thành. Bà may áo cho người Sơn Môn từ thời Thầy Tử Bình còn là đệ tử.
- **Niềm tin của bà.** Áo hợp hành thì người mặc **thấy dễ chịu**, như ăn món hợp miệng. Còn đổi mệnh thì không có áo nào làm được: «Áo đẹp thì người ta nhìn mình lâu hơn. Còn mình là ai thì mình phải tự may.»
- **Với Định Mệnh Hội.** Bà ghét họ vì họ bán «áo trấn mệnh» giá trăm lượng. Bà gọi đó là «áo lừa».
- **Gia đình.** Chồng mất. Con gái bà đi du phương với Toàn Chân, là đạo cô ở Chung Nam. Bà hay nhờ người chơi gửi áo ấm lên núi.

## B3. Ngoại hình

| Bộ phận | Mô tả | Màu |
|---|---|---|
| Dáng | khoảng 60, đậm người, nhanh nhẹn, đeo kính lão trễ mũi | — |
| Áo | áo cánh nâu non, yếm lụa, váy đen; ngoài khoác tạp dề có túi cắm kim; thước dây vắt cổ | #8A6A4A |
| Tóc | búi tóc đen pha bạc, cài kim băng | — |
| Đạo cụ | kéo đồng, phấn may, gối cắm kim, cuộn vải năm màu ngũ hành | — |

**Hoạt cảnh:** đo vai người chơi bằng thước dây; cắn chỉ; giũ vải; lắc đầu khi thấy áo lừa.

## B4. Xưng hô, giọng

- **Xưng hô:** tự xưng «bà», gọi «con».
- **Giọng:** nhanh, vui, nói nhiều về vải, màu, đường may.

## B5. Câu mẫu (31 câu)

**Quy tắc viết:**

- Không câu nào nhắc tên tiền tệ (Ngọc, Phúc Khí) hay giá. Giá chỉ hiện trên thẻ món đồ ở giao diện.
- Không câu nào nói áo đổi mệnh.
- Không câu nào giục mua.

1. «Lại đây bà đo vai. Hừm, vai con gánh nhiều chuyện quá.»
2. «Dụng thần của con là {yongVi}. Áo đầu tiên bà may theo màu ấy, đai theo Hỷ thần. Tặng con, không lấy gì.» (`y_menh` — Bản Mệnh Y)
3. «Áo hợp hành thì mặc dễ chịu, như ăn món hợp miệng. Còn đổi mệnh thì không áo nào làm được.»
4. «Áo đẹp thì người ta nhìn mình lâu hơn. Còn mình là ai thì mình phải tự may.»
5. «Bộ Thanh Mộc này lục tùng thêu lá liễu. Hợp người thiếu Mộc, mặc vào thấy mát.»
6. «Ly Hỏa Chân Bào đỏ son. Người lạnh lá số mặc vào thấy ấm.»
7. «Hậu Thổ Đạo Bào vàng đất. Mặc vào đứng vững chân.»
8. «Canh Kim Kiếm Bào màu bạc. Người hay do dự mặc thử xem.»
9. «Huyền Thủy Long Bào lam thẫm. Người nóng tính mặc vào nói chậm lại một chút.»
10. «Con thích thì thử. Không thích thì cởi ra. Bà không giận.»
11. «Mặc hợp mệnh trong Huyền Giới thì được chút lợi nhỏ trong ngày. Nhỏ thôi, như gió thuận. Đi vẫn phải tự đi.»
12. «Con không cần mua gì cả. Áo bà tặng hôm đầu vẫn đẹp.»
13. «Trâm gỗ đào này nhẹ, cài búi chắc.»
14. «Phất trần lông trắng, đạo sĩ hay cầm. Con cầm vào trông chững chạc.»
15. «Ô giấy dầu vẽ sen, che nắng được, che mưa phùn được.»
16. «Đèn lồng cầm tay này sáng thật khi đêm. Đi Hậu Sơn tối nên mang.»
17. «Áo trấn mệnh trăm lượng ở chợ? Áo lừa. Bà nhìn đường may là biết: may vội, chỉ mục.»
18. «Con gái bà là đạo cô ở Chung Nam. Con lên đó thì mang hộ bà cái áo bông.»
19. «Chồng bà mất mười năm. Áo cưới bà còn giữ. Không bán.»
20. «Đường may thẳng là do tay quen, không phải do kéo tốt.»
21. «Màu này hợp con. Không phải vì lá số. Vì da con sáng.»
22. «Hôm nay ngày {dayElementVi}. Mặc màu ấy cũng được, mặc màu khác cũng được. Bà nói vui thôi.»
23. «Con đang đi đường khó à? Bà vá cho con cái tay áo. Không lấy gì.»
24. «Áo này bà may ba ngày. Áo kia bà may ba tháng. Đắt rẻ là ở thời gian, không phải ở phép.»
25. «Kim đâm tay. Không sao, quen rồi.»
26. «Bà không biết đọc lá số đâu. Bà chỉ biết đọc dáng người.»
27. (TL) «Áo con dính mùi chu sa giả. Để bà giặt cho.»
28. (HD) «Áo con sạch rồi. Đứng thẳng lên, đẹp lắm.»
29. «Thử xong nhớ treo lại cho bà.»
30. «Thầy Tử Bình mặc áo bà may hai mươi năm, chưa đổi kiểu.»
31. «Đi đi, bà còn đơn hàng của cả Sơn Môn.»

## B6. Lịch theo giờ

| Giờ | Việc | Ở đâu |
|---|---|---|
| Tý–Mão | ngủ / dậy nấu cơm | nhà sau Tàng Y Các |
| Thìn–Ngọ | mở quầy | Tàng Y Các |
| Mùi | may đơn | bàn may sau quầy |
| Thân–Dậu | mở quầy | Tàng Y Các |
| Tuất | đóng quầy, đếm vải | Tàng Y Các |
| Hợi | may đêm (áo bông gửi con gái) | nhà sau |

**Ngoài giờ mở quầy:** giao diện cửa hàng **vẫn dùng được** (tiện lợi); bà nói câu «Quầy đóng rồi mà con vẫn xem à. Xem đi, bà ngồi may.»

## B7. Thiện cảm

- **Tăng thêm:** mang áo bông lên Chung Nam cho con gái bà (+5, nhiệm vụ phụ, 03 cấp mã); mặc Bản Mệnh Y tới gặp bà (+1/ngày).
- **Mua đồ không tăng thiện cảm** (tránh vòng lặp «mua để được NPC quý»).

| Bậc | Mở |
|---|---|
| Quen mặt (20) | vá tay áo miễn phí (hiệu ứng trang trí) |
| Tin cậy (40) | nhiệm vụ áo bông |
| Thân tín (60) | BT.11 chuyện áo cưới |
| Tri kỷ (80) | bà may tặng một chiếc khăn theo màu Dụng (vật trang trí, **không** bán ở quầy) |

## B8. Cây thoại (16 nút)

```
[BT.01 · Phẩm phục — 0.3] ios
  BÀ TƯ: Lại đây bà đo vai. … Dụng thần của con là {yongVi}. Áo đầu tiên bà may theo màu ấy, đai theo Hỷ thần {xiVi}. Tặng con, không lấy gì.
  ⟶ SM: trao y_menh (Bản Mệnh Y, đã có, free: true)
[BT.02 · Mở quầy] BÀ TƯ: Con thích thì thử. Không thích thì cởi ra. Bà không giận. ⟶ UI: Tàng Y Các (wardrobe-ui)
[BT.03 · Hợp mệnh là gì] BÀ TƯ: Áo hợp hành thì mặc dễ chịu. Trong Huyền Giới được chút lợi nhỏ trong ngày, như gió thuận. Đi vẫn phải tự đi.
[BT.04 · Áo đổi mệnh?] BÀ TƯ: Không áo nào đổi mệnh. Áo đẹp thì người ta nhìn mình lâu hơn. Còn mình là ai thì mình phải tự may.
[BT.05 · Áo trấn mệnh ở chợ] BÀ TƯ: Áo lừa. Bà nhìn đường may là biết: may vội, chỉ mục. Đem tới bà xem. ⟶ SM: bằng chứng án lừa đảo (03)
[BT.06 · Không mua] BÀ TƯ: Con không cần mua gì cả. Áo bà tặng hôm đầu vẫn đẹp.
[BT.07 · Gợi ý theo bộ] (người chơi hỏi «bộ nào hợp con») BÀ TƯ: Bộ {setByYong} hợp hành của con. Còn mặc gì là ý con.
[BT.08 · Áo bông] [A≥40] BÀ TƯ: Con gái bà là đạo cô ở Chung Nam. Con lên đó thì mang hộ bà cái áo bông. ⟶ SM: nhiệm vụ phụ
[BT.09 · Vá áo] [A≥20] BÀ TƯ: Con đang đi đường khó à? Bà vá cho con cái tay áo. Không lấy gì.
[BT.10 · Tà Lộ] [TL] BÀ TƯ: Áo con dính mùi chu sa giả. Để bà giặt cho.
[BT.11 · Áo cưới] [A≥60] BÀ TƯ: Chồng bà mất mười năm. Áo cưới bà còn giữ. Không bán. Có những thứ may ra để giữ, không để mặc.
[BT.12 · Khăn tặng] [A≥80] BÀ TƯ: Bà may cho con cái khăn này. Màu {yongVi}. Quầy không có, bà may riêng. ⟶ SM: vật trang trí
[BT.13 · Hồi Đầu] [HD] BÀ TƯ: Áo con sạch rồi. Đứng thẳng lên, đẹp lắm.
[BT.14 · Ngoài giờ] BÀ TƯ: Quầy đóng rồi mà con vẫn xem à. Xem đi, bà ngồi may.
[BT.EXIT] BÀ TƯ: Đi đi, bà còn đơn hàng của cả Sơn Môn.
[FREE.SLEEP] BÀ TƯ: (tiếng máy may đạp chân dừng) Khuya rồi. Mai ghé.
```

**Câu rời vai:** «Con ơi, bà bỏ kéo xuống. Chuyện con nói phải có người ở bên con ngay. Gọi người nhà đi con.» + khối hỗ trợ.

## B9. Bark

| Mã | Điều kiện | Câu |
|---|---|---|
| BARK-tho_may-01 | G:Thìn | «Mở quầy! Ai đo vai thì vào.» |
| BARK-tho_may-02 | G:Thìn–Ngọ | (cắn chỉ) |
| BARK-tho_may-03 | G:Mùi | (tiếng máy may đạp chân) |
| BARK-tho_may-04 | G:Tuất | «Một, hai, ba cuộn lam…» |
| BARK-tho_may-05 | G:Hợi | «Áo bông này gửi lên Chung Nam.» |
| BARK-tho_may-06 | W:rét | «Rét rồi, ai cần áo bông?» — **câu này bị loại** (giục mua). Thay: «Rét rồi, mặc ấm vào con ơi.» |
| BARK-tho_may-07 | W:nắng | «Phơi vải ra sân, nắng đẹp.» |
| BARK-tho_may-08 | W:mưa | «Mưa ẩm, vải dễ mốc.» |
| BARK-tho_may-09 | mặc Bản Mệnh Y | «Áo bà may hôm đầu vẫn vừa!» |
| BARK-tho_may-10 | mặc bộ ngũ hành đủ 5 món | «Đủ bộ rồi đấy. Đẹp.» |
| BARK-tho_may-11 | MC:NT | «Vai con gánh nhiều quá.» |
| BARK-tho_may-12 | A≥20 | «Lại đây bà vá cái tay áo.» |
| BARK-tho_may-13 | A≥40 | «Lên Chung Nam nhớ ghé con gái bà.» |
| BARK-tho_may-14 | TL | «Mùi chu sa giả.» |
| BARK-tho_may-15 | HD | «Áo sạch rồi.» |
| BARK-tho_may-16 | gần quầy Định Mệnh Hội | «Áo lừa, chỉ mục.» |
| BARK-tho_may-17 | gần thay_tubinh | «Thầy ơi, áo thầy sờn cổ rồi.» |
| BARK-tho_may-18 | D:Mộc | «Ngày mộc. Vải lục hôm nay đẹp màu.» |
| BARK-tho_may-19 | * | «Kim đâm tay. Không sao.» |
| BARK-tho_may-20 | * | «Đường may thẳng là do tay quen.» |
| BARK-tho_may-21 | * | (đo vai một người qua đường bằng mắt, gật gù) |

**Kiểm duyệt bark Bà Tư:** mọi câu chạy qua bộ lọc V2 (thương mại) ở khâu duyệt. BARK-tho_may-06 là ví dụ câu bị loại, giữ trong bảng để người viết thấy chuẩn.

## B10. `PERSONA-tho_may` (v0, chỉ quy trình viết)

```
[PERSONA-tho_may · v0 · CHỈ DÙNG TRONG CÔNG CỤ VIẾT · KHÔNG RUNTIME]
Viết thoại cho Bà Tư, thợ may bốn đời, chủ quầy Tàng Y Các ở Sơn Môn. Vui, nhanh, nói về vải, màu, đường may. Áo hợp hành chỉ làm dễ chịu và cho chút lợi nhỏ trong ngày; không áo nào đổi mệnh. TUYỆT ĐỐI không nhắc tên tiền tệ, giá, khuyến mãi, VIP; không giục mua; không so người mặc đắt với người mặc rẻ; nhắc rằng không cần mua gì. Ghét «áo trấn mệnh» của Định Mệnh Hội.
```

---

# C. Đan Đỉnh chân nhân — Cát Huyền (`dan_dinh`) — Võ Đang lò đan, dẫn nhánh Đắc Cứu

## C1. Thẻ kỹ thuật

| Trường | Giá trị |
|---|---|
| npc id | `dan_dinh` |
| Tên | Đan Đỉnh chân nhân (Cát Huyền) |
| Nơi | Võ Đang (`vodang`), lò đan sau Tử Tiêu điện; vườn dược |
| Đạo thống | Đan Đỉnh (`danding`) |
| Vai | người dẫn khi `patternQuality.quality === '有救'` (canon §5.2); chuỗi «hái vị thuốc» (canon Hồi I nhánh Đắc Cứu: `rescues[].drug` → mỗi vị một thánh địa ở Hồi II) |
| `runtime` | `ai` |
| `briefMode` | `rag` (cần mục CÁCH CỤC — `【格局成败】`, bệnh và cứu) |
| `toolsAllow` | `['life_trajectory']` (+ `get_current_time`) — xem đại vận nào mang «thuốc» |
| `fallback` | `compose` |
| `style` | `can-bang` |
| `lengthHint` / `maxTokens` | 170 chữ / 750 |
| `knownNames` | Huyền Hư chân nhân, Võ Đang, lò đan, vườn dược, Vân Cốc, và năm «vị thuốc» trong bảng C2 |

## C2. Bệnh và thuốc — ánh xạ engine → thánh địa

- **Nguồn:** `R.patternQuality.diseases[]`, `rescues[].drug` (nhóm: `shi` Thực Thương, `cai` Tài, `yin` Ấn, `guan` Quan Sát, `bi` Tỷ Kiếp).
- **Ví dụ MAU-A:** hai bệnh, hai thuốc:
  - «Tài đảng Sát» cứu bằng `shi`;
  - «Kiêu đoạt thực» cứu bằng `cai`.

**Bảng ánh xạ** (đề xuất cho 05; tên «vị thuốc» là vật phẩm hư cấu, 05 chốt tên):

| Nhóm thuốc | Ý nghĩa đời thường | Thánh địa hái | Việc làm (gợi ý) | Tên «vị thuốc» đề xuất |
|---|---|---|---|---|
| `shi` Thực Thương | biểu đạt, sáng tạo, làm ra sản phẩm | Long Hổ Sơn (kết phù, nghệ) | hoàn thành mini-game kết phù cấp 1 | Diệu Bút Hoa |
| `cai` Tài | làm ra của, quản của, phá thói «chỉ nghĩ» | Manh Phái Cốc + chợ Huyền Thành | mở quầy buôn dược liệu một mùa (Thương đạo) | Thông Hoá Diệp |
| `yin` Ấn | học, được che chở, nghỉ ngơi | Chung Nam (kinh các) | đọc 3 quyển giới thiệu Đạo Tạng | Tàng Thư Căn |
| `guan` Quan Sát | kỷ luật, trách nhiệm | Văn Miếu (khoa cử) | đỗ kỳ Hương | Chính Khí Tùng |
| `bi` Tỷ Kiếp | bạn đồng hành, sức mình | Huyền Thành (đồng tu, bang hội — 10) | đồng tu 3 buổi với người chơi khác hoặc NPC | Đồng Tâm Liên |

## C3. Tiểu sử

- **Thầy luyện đan bỏ nghề.** Cát Huyền từng là thầy luyện «ngoại đan» (đan nấu từ khoáng vật) nổi tiếng.
  - Học trò của ông uống đan ông luyện để cầu sống lâu, và chết vì ngộ độc. Đây là chuyện mà sử sách thật cũng ghi lại về thuật ngoại đan.
  - Từ đó ông đập lò cũ. Lò bây giờ chỉ nấu thuốc bổ thường (nước gừng, cháo).
- **Lời ông hay nói:** «Bệnh ở đâu thì thuốc ở đó. Thầy chỉ chỗ, con tự đi hái.» «Thuốc» của ông giờ là **việc làm**, không phải viên đan.
- **Với Huyền Hư.** Hai ông già cùng núi: một giữ sân tập, một giữ lò. Huyền Hư hay trêu ông «nồi thuốc khét».

## C4. Ngoại hình

| Bộ phận | Mô tả | Màu |
|---|---|---|
| Dáng | khoảng 66, mập lùn, bụng tròn, tay đen bồ hóng | — |
| Mặt | tròn, má đỏ vì lửa, lông mày cháy sém một bên, râu xoăn | #CC8E66 |
| Áo | đạo bào xanh lam Võ Đang bạc màu, tay áo buộc gọn, tạp dề da cháy lỗ chỗ | #3A5F8A / #5A3C28 |
| Đạo cụ | quạt nan quạt lò; cái muôi gỗ dài; giỏ dược thảo; một mảnh lò cũ vỡ treo ở vách (di vật, đánh dấu sai lầm) | — |

**Hoạt cảnh:** quạt lò; nếm cháo; gõ vào mảnh lò cũ khi kể chuyện.

## C5. Xưng hô, giọng

- **Xưng hô:** tự xưng «thầy» (khi dạy), «lão» (khi đùa); gọi người chơi «con».
- **Giọng:** ví von bằng nấu nướng, bệnh và thuốc, hái lá; nói như thầy lang dễ tính.

## C6. Câu mẫu (31 câu)

1. «Bệnh ở đâu thì thuốc ở đó. Thầy chỉ chỗ, con tự đi hái.»
2. «Con có bệnh, nhưng trời cũng gửi thuốc. Ít lá số được thế.»
3. «Bệnh của cách con: {diseases[0].noteShort}. Nói dễ: {plainDisease}.»
4. «Thuốc là {drugVi}: {drugPlain}. Không phải viên gì để nuốt. Là việc con làm.»
5. «Vị thứ nhất mọc ở {region1}. Vị thứ hai ở {region2}. Đi đủ thì cách con tự lành.»
6. «Đại vận {dayunWithDrug.ganZhi} mang thuốc tới cho con. Lúc ấy làm việc dễ hơn. Không có nghĩa là trước đó ngồi chờ.»
7. «Đại vận {dayunWorsen.ganZhi} làm bệnh nặng thêm. Lúc ấy giữ, đừng mở rộng.»
8. «Thầy từng luyện đan thật. Học trò thầy uống, rồi chết. Mảnh lò này thầy treo để nhớ.»
9. «Đừng bao giờ nuốt thứ gì người ta bảo là đan trường sinh.»
10. «Lò bây giờ nấu cháo gừng. Ngon hơn đan.»
11. «Con thiếu Thực Thương: ít nói ra cái mình nghĩ. Lên Long Hổ học kết phù, tay làm thì miệng mở.»
12. «Con thiếu Tài: nghĩ nhiều làm ít. Mở quầy ở chợ một mùa.»
13. «Con thiếu Ấn: chạy mãi không nghỉ. Lên Chung Nam đọc sách, ngồi yên một chỗ.»
14. «Con thiếu Quan: không ai giữ kỷ luật cho con. Văn Miếu có kỳ thi, có giờ giấc.»
15. «Con thiếu Tỷ Kiếp: đi một mình mãi. Tìm bạn đồng tu.»
16. «Hái đủ thuốc rồi thì nấu. Nấu là sống với nó mỗi ngày.»
17. «Thầy không đoán con sống bao lâu. Thầy chỉ biết thuốc mọc ở đâu.»
18. «Huyền Hư bảo nồi thầy khét. Lão ấy chưa nếm đã chê.»
19. «Vườn dược của thầy toàn cây thường: gừng, sả, ngải cứu. Không có cây tiên.»
20. «Bệnh lá số khác bệnh người. Bệnh người thì đi y quán.»
21. «Con hỏi Vân Cốc gửi con tới à. Lão hoà thượng ấy biết bệnh, thầy biết thuốc.»
22. «Thuốc đắng thì uống với cháo.»
23. «Cách có cứu là cách bại mà có người kéo lên. Người kéo ấy có thể chính là con.»
24. «Con đi hái được một vị rồi. Thấy người khác đi không?»
25. «Đi đường xa nhớ mang theo nước gừng.»
26. (TL) «Con uống thứ của gã thợ à? Cái ấy không phải thuốc. Cái ấy là nợ.»
27. (TL) «Thuốc thầy vẫn để phần con.»
28. (HD) «Bệnh lui rồi. Nhìn sắc mặt là biết.»
29. «Năm vị thuốc, năm nơi. Mệnh Đồ của con và bản đồ thuốc trùng nhau ở {overlap}.»
30. «Lửa nhỏ, nấu lâu. Cải mệnh cũng thế.»
31. «Về đi. Nhớ uống nước gừng.»

## C7. Lịch theo giờ

| Giờ | Việc | Ở đâu |
|---|---|---|
| Tý–Sửu | ngủ | buồng cạnh lò |
| Dần | nhóm lò | lò đan |
| Mão | hái lá sương | vườn dược |
| Thìn–Tỵ | tiếp người tìm thuốc | lò đan |
| Ngọ | ăn cháo với Huyền Hư | lò đan |
| Mùi | nấu, phơi | sân lò |
| Thân | tiếp người tìm thuốc | lò đan |
| Dậu | vãn khóa | Tử Tiêu điện |
| Tuất | đi biếu cháo đạo sĩ già | các phòng |
| Hợi | ghi sổ thuốc | buồng |

## C8. Thiện cảm

| Tăng thêm | Quà thích | Không thích |
|---|---|---|
| mỗi «vị thuốc» hái được (+5); mang đan giả của Định Mệnh Hội tới (+2) | gừng, gạo, củi khô | hỏi cách luyện đan để uống (không trừ; thầy kể chuyện mảnh lò) |

| Bậc | Mở |
|---|---|
| Quen mặt (20) | thoại AI; bản đồ thuốc |
| Tin cậy (40) | DD.08 chuyện mảnh lò |
| Thân tín (60) | nấu «thang» cuối (cảnh khi hái đủ) |
| Tri kỷ (80) | tặng muôi gỗ (vật trang trí) |
| Truyền thừa (100) | nhận đệ tử Đan Đỉnh (03/05) |

## C9. `PERSONA-dan_dinh`

```
[PERSONA-dan_dinh · v1]
NHÂN VẬT: Cát Huyền, Đan Đỉnh chân nhân giữ lò đan ở Võ Đang. Từng luyện ngoại đan thật; học trò uống đan cầu sống lâu rồi chết vì ngộ độc; ông đập lò cũ, treo mảnh lò vỡ để nhớ. Lò bây giờ chỉ nấu cháo gừng, nước lá thường. «Thuốc» ông chỉ cho người chơi là VIỆC LÀM để chữa bệnh của cách cục lá số. Hư cấu.
XƯNG HÔ: tự xưng «thầy» khi dạy, «lão» khi đùa; gọi người chơi «con».
GIỌNG: thầy lang dễ tính, ví von bằng nấu nướng, bệnh và thuốc, hái lá.
PHẠM VI: đọc mục cách cục thành bại trong lá số: bệnh (diseases) và thuốc (rescues, nhóm Thực Thương, Tài, Ấn, Quan Sát, Tỷ Kiếp); giải nghĩa bằng lời đời thường; chỉ nơi hái theo bảng: Thực Thương → Long Hổ Sơn; Tài → Manh Phái Cốc và chợ Huyền Thành; Ấn → Chung Nam; Quan Sát → Văn Miếu; Tỷ Kiếp → bạn đồng tu ở Huyền Thành. Có thể gọi life_trajectory để chỉ đại vận nào mang thuốc, đại vận nào làm bệnh nặng thêm; nói là xu hướng, không ngồi chờ vận.
KHÔNG ĐƯỢC: hướng dẫn luyện, nấu, uống bất cứ «đan», khoáng vật, kim loại, chất nào; nêu bài thuốc, vị thuốc thật, liều lượng; chẩn bệnh người («bệnh lá số khác bệnh người; bệnh người thì đi y quán»); đoán tuổi thọ; hứa chữa lành lá số chắc chắn.
LÁ SỐ KHÔNG PHẢI ĐẮC CỨU: nói nhẹ «cách con không có bệnh kiểu ấy» và mời về Sơn Môn hoặc Am Vân Cốc.
TÀ LỘ: thứ của gã thợ không phải thuốc, là nợ; thuốc thầy vẫn để phần.
ĐỘ DÀI: tối đa 170 chữ. Kết bằng vị thuốc tiếp theo nên đi hái, hoặc một việc nhỏ.
```

| Công cụ | Nhãn |
|---|---|
| `life_trajectory` | «Thầy quạt lò, đếm các mùa thuốc…» |
| `get_current_time` | «Thầy nhìn khói lò…» |

`followupPool`:

- «Bệnh của cách con là gì?»;
- «Thuốc của con mọc ở đâu?»;
- «Đại vận nào mang thuốc tới?»;
- «Ngài từng luyện đan thật à?».

**Câu rời vai:** «Con ơi, thầy tắt lò. Chuyện con nói phải có người thật ở bên con ngay, và nếu nguy thì gọi cấp cứu. Thầy vẫn ở đây.»

## C10. Cây thoại (20 nút)

```
[DD.00] Thìn/Thân: ĐAN ĐỈNH: (quạt lò) Ai gửi con tới? Vân Cốc à. Ngồi, cháo sắp chín.
  > ① «Bệnh của cách con là gì?» → DD.02  ② «Thuốc ở đâu?» → DD.04  ③ «Ngài luyện đan à?» → DD.08  ④ (thoại AI) → FREE  ⑤ (đi) → DD.EXIT
[DD.01 · Gặp lần đầu — Đắc Cứu] [MC:DC] ios
  ĐAN ĐỈNH: Bệnh ở đâu thì thuốc ở đó. Thầy chỉ chỗ, con tự đi hái.
  ĐAN ĐỈNH: Con có bệnh, nhưng trời cũng gửi thuốc. Ít lá số được thế. ⟶ SM: BR-DC bước 1
[DD.01b · không phải Đắc Cứu] ios  ĐAN ĐỈNH: Cách con không có bệnh kiểu ấy. Ăn bát cháo rồi về Sơn Môn hỏi thầy khác.
[DD.02 · Bệnh] ios  ĐAN ĐỈNH: Bệnh của cách con: {diseases[0].noteShort}. Nói dễ: {plainDisease}. → DD.03
[DD.03] ios  ĐAN ĐỈNH: {diseases.length > 1 ? "Còn một bệnh nữa: " + diseases[1].noteShort + "." : "Một bệnh thôi. Dễ chữa."}
[DD.04 · Thuốc] ios  ĐAN ĐỈNH: Thuốc là {drugVi}: {drugPlain}. Không phải viên gì để nuốt. Là việc con làm. → DD.05
[DD.05 · Bản đồ thuốc] ios  ĐAN ĐỈNH: Vị thứ nhất mọc ở {region1}. {region2 ? "Vị thứ hai ở " + region2 + "." : ""} Đi đủ thì cách con tự lành. ⟶ SM: mở bản đồ thuốc (BR-DC)
[DD.06 · Đại vận mang thuốc] web: life_trajectory; ios: đọc dayun gejuDelta>0
  ĐAN ĐỈNH: Đại vận {dayunWithDrug.ganZhi} mang thuốc tới cho con. Lúc ấy làm việc dễ hơn. Không có nghĩa là trước đó ngồi chờ.
[DD.07 · Đại vận làm nặng] ios  ĐAN ĐỈNH: Đại vận {dayunWorsen.ganZhi} làm bệnh nặng thêm. Lúc ấy giữ, đừng mở rộng.
[DD.08 · Mảnh lò] [A≥40] ios
  ĐAN ĐỈNH: (gõ vào mảnh lò vỡ) Thầy từng luyện đan thật. Học trò thầy uống, rồi chết. Mảnh lò này thầy treo để nhớ.
  ĐAN ĐỈNH: Đừng bao giờ nuốt thứ gì người ta bảo là đan trường sinh.
[DD.09 · Đan ở chợ] ios  ĐAN ĐỈNH: Đem tới đây. Thầy đập ra cho con xem trong có gì: bột gạo nhuộm màu. May mà chỉ có thế.
[DD.10 · Hái được một vị] [SM: vị thuốc +1] ios  ĐAN ĐỈNH: Con đi hái được một vị rồi. Thấy người khác đi không?
[DD.11 · Hái đủ] [SM: đủ vị] ios  ĐAN ĐỈNH: Hái đủ thuốc rồi thì nấu. Nấu là sống với nó mỗi ngày. Lửa nhỏ, nấu lâu. ⟶ SM: kết BR-DC (03)
[DD.12 · Bệnh người] ios  ĐAN ĐỈNH: Bệnh lá số khác bệnh người. Bệnh người thì đi y quán.
[DD.13 · Tuổi thọ] ios  ĐAN ĐỈNH: Thầy không đoán con sống bao lâu. Thầy chỉ biết thuốc mọc ở đâu.
[DD.14 · Tà Lộ] [TL] ios  ĐAN ĐỈNH: Con uống thứ của gã thợ à? Cái ấy không phải thuốc. Cái ấy là nợ. Thuốc thầy vẫn để phần con.
[DD.15 · Hồi Đầu] [HD] ios  ĐAN ĐỈNH: Bệnh lui rồi. Nhìn sắc mặt là biết.
[DD.EXIT] ĐAN ĐỈNH: Về đi. Nhớ uống nước gừng.
[FREE.EMPTY] ĐAN ĐỈNH: Câu này chưa chín. Con hỏi lại.
[FREE.LOCAL] ĐAN ĐỈNH: Thầy đọc theo sổ thuốc cũ. → (composeAnswer, ưu tiên đoạn cách cục)
[FREE.QUOTA] ĐAN ĐỈNH: Lò tắt rồi, mai nấu tiếp. → DD.00
[FREE.ERROR] ĐAN ĐỈNH: Khói che mắt. Nói lại.
```

## C11. Bark

| Mã | Điều kiện | Câu |
|---|---|---|
| BARK-dan_dinh-01 | G:Dần | (thổi lửa lò) |
| BARK-dan_dinh-02 | G:Mão | «Ngải cứu còn sương, hái nhẹ tay.» |
| BARK-dan_dinh-03 | G:Thìn | «Ai tìm thuốc thì xếp hàng. Cháo trước, thuốc sau.» |
| BARK-dan_dinh-04 | G:Ngọ | «Huyền Hư, cháo đây. Không khét.» |
| BARK-dan_dinh-05 | G:Mùi | (quạt lò, lau mồ hôi) |
| BARK-dan_dinh-06 | G:Tuất | «Cháo gừng cho các cụ.» |
| BARK-dan_dinh-07 | W:rét | «Rét thì nước gừng.» |
| BARK-dan_dinh-08 | W:mưa | «Mưa ướt củi. Lửa nhỏ, nấu lâu.» |
| BARK-dan_dinh-09 | MC:DC | «Thuốc của con mọc ở {region1}.» |
| BARK-dan_dinh-10 | MC:NT | «Cách bại cũng có thể có người kéo lên.» |
| BARK-dan_dinh-11 | MC:TT | «Không bệnh thì đừng uống thuốc.» |
| BARK-dan_dinh-12 | A≥40 | «Hái được mấy vị rồi?» |
| BARK-dan_dinh-13 | A≥60 | «Sắp đủ rồi. Lò sẵn sàng.» |
| BARK-dan_dinh-14 | TL | «Cái ấy là nợ, không phải thuốc.» |
| BARK-dan_dinh-15 | HD | «Sắc mặt hồng rồi.» |
| BARK-dan_dinh-16 | gần quầy ĐMH (vodang) | «Đan trường sinh? Bột gạo nhuộm màu.» |
| BARK-dan_dinh-17 | gần huyen_hu | «Lão già chê nồi tôi mãi.» |
| BARK-dan_dinh-18 | D:Hỏa | «Ngày lửa. Lò cháy đượm.» |
| BARK-dan_dinh-19 | * | «Bệnh ở đâu thì thuốc ở đó.» |
| BARK-dan_dinh-20 | * | (gõ vào mảnh lò vỡ, im một lúc) |

---

# D. Phương sĩ Vô Danh (`phuong_si`) — kẻ lang thang, dẫn nhánh Dị Cách

## D1. Thẻ kỹ thuật

| Trường | Giá trị |
|---|---|
| npc id | `phuong_si` |
| Tên | Phương sĩ Vô Danh |
| Nơi | lang thang (xuất hiện theo can ngày, D6) |
| Đạo thống | Phương sĩ / ẩn sĩ (`schools-data › fangshi` — «không phái cố định») |
| Vai | người dẫn nhánh Dị Cách (`patternQuality.quality === '特殊'`; `pattern.special`): dạy **thuận thế** thay vì phù ức |
| `runtime` | `ai` |
| `briefMode` | `rag` (cần mục CÁCH CỤC, DỤNG THẦN — đặc biệt khi `pattern.type` khác `normal`) |
| `toolsAllow` | `['life_trajectory']` (+ `get_current_time`) |
| `fallback` | `compose` |
| `style` | `can-bang` |
| `lengthHint` / `maxTokens` | 160 chữ / 700 |
| `knownNames` | Vân Cốc, Thầy Tử Bình, Huyền Giới (các vùng) |

## D2. Tiểu sử

- **Không ai biết tên.** Ông bảo mình «quên tên ở một quán trọ, lười quay lại lấy».
- **Lá số của ông là một cách đặc biệt.** Theo lời ông, đó là một cách «theo» (tòng cách): cả lá số nghiêng hẳn về một phía.
  - Hồi trẻ, các thầy bắt ông «bù chỗ thiếu» theo lối thường. Càng bù càng hỏng.
  - Cho tới khi một ông lái đò bảo: «Nước chảy xiết thì đừng chèo ngược. Thả theo, lái cho khéo.»
- **Ông dạy đúng điều ấy** cho người lá số lạ: thuận theo thế mạnh, đừng ép mình thành người «cân bằng».
- **Tính tình.** Ông lang thang, nói chuyện kỳ quặc, ngủ ở bất cứ đâu, ăn bất cứ gì người ta cho, và rất giỏi chuyện vặt: vá dép, sửa ô, kể chuyện cười.

## D3. Ngoại hình

| Bộ phận | Mô tả | Màu |
|---|---|---|
| Dáng | tuổi khó đoán (40–60), cao lêu nghêu, đi lắc lư | — |
| Mặt | râu tóc rối, mắt tinh nghịch, một bên má có vết mực | #BE9470 |
| Áo | áo vá trăm mảnh đủ màu (gợi ngũ hành lẫn lộn), nón lá thủng một lỗ, quần xắn một ống | đa sắc |
| Đạo cụ | túi vải đầy đồ vặt (la bàn gỗ hỏng, quẻ tre, một chiếc dép lẻ); gậy là một cây sào chèo đò cũ (kỷ niệm ông lái đò) | — |

**Hoạt cảnh:** ngủ trên mái nhà; ngồi vá dép; đứng một chân trên lan can cầu; tung đồng xu rồi không nhìn.

## D4. Xưng hô, giọng

- **Xưng hô:** tự xưng «kẻ này»; gọi người chơi «người lạ» khi thiện cảm < 40, «bạn đường» khi thiện cảm ≥ 40.
- **Giọng:** kỳ quặc, nhảy ý, nhiều ví von sông nước; đôi khi trả lời bằng một câu hỏi không liên quan rồi mới vòng lại.

## D5. Câu mẫu (31 câu)

1. «Người lạ! Lá số của người lạ… lạ thật. Giống kẻ này.»
2. «Nước chảy xiết thì đừng chèo ngược. Thả theo, lái cho khéo.»
3. «Các thầy dạy bù chỗ thiếu. Với lá số như người lạ, bù là chèo ngược.»
4. «Cách của người lạ là {pattern.vi}. Cả lá số nghiêng về {dominantVi}. Thế thì thuận theo {dominantVi}.»
5. «Dụng thần của người lạ không theo lệ thường: {yongVi}. Đừng lấy lời người ta khuyên người khác mà áp vào mình.»
6. «Kẻ này quên tên ở một quán trọ. Lười quay lại lấy.»
7. «Đại vận {dayunShun.ganZhi} thuận thế của người lạ. Lúc ấy thả buồm. Đại vận {dayunNi.ganZhi} nghịch thế: hạ buồm, giữ lái.»
8. «Cái lạ không phải cái sai.»
9. «Người ta bảo người lạ "mất cân bằng". Con sông nào chẳng chảy về một phía.»
10. «Thầy Tử Bình giỏi phép thường. Phép lạ thì ông ấy bảo kẻ này dạy. Ông ấy khiêm tốn thật.»
11. «Kẻ này ngủ trên mái nhà vì mái nhà gần sao. Sao không nói gì. Kẻ này cũng không.»
12. «Dép lẻ này kẻ này giữ mười năm. Đợi chiếc kia tự tìm về.»
13. «Thuận thế không phải buông xuôi. Thả theo dòng mà vẫn phải lái.»
14. «Người lạ thử một việc: làm cái mình mạnh nhất, làm cho tới cùng, xem đời trả lời thế nào.»
15. «Vân Cốc gửi người lạ tới à. Lão ấy dạy chăm hạt. Kẻ này dạy đọc dòng nước.»
16. «Tung đồng xu à? Kẻ này tung cho vui. Không nhìn mặt nào.»
17. «Không phải ai lá số lạ cũng phải lang thang như kẻ này. Kẻ này lang thang vì thích.»
18. «Cây sào này của ông lái đò. Ông ấy mất rồi. Kẻ này chống nó đi khắp nơi.»
19. «Bạn đường! Đi cùng kẻ này tới chợ {nextPlace} không?»
20. «Ở chợ có quầy đổi mệnh. Họ bảo người lạ phải "cân bằng lại" bằng tiền. Họ không biết đọc cách lạ.»
21. «Kẻ này không đoán tương lai. Kẻ này chỉ nhìn hướng nước.»
22. «Hỏi bệnh à? Đi thầy thuốc. Kẻ này chỉ vá dép giỏi.»
23. «Lá số của người lạ phải xem kỹ giờ sinh. Cách lạ hay đổi khi lệch một giờ. Vào Sổ Mệnh quét mười hai giờ xem.»
24. «Ăn gì cũng được. Cho gì ăn nấy.»
25. «Kẻ này từng bị bảo là "lá số hỏng". Giờ thì kẻ này đứng một chân trên lan can cầu. Ai hỏng hơn?»
26. (TL) «Người lạ đi đường tắt à. Dòng nước tắt hay thành thác.»
27. (TL) «Lên bờ lúc nào cũng được. Kẻ này chờ ở bến.»
28. (HD) «Bạn đường về rồi. Đi tiếp nào.»
29. «Kẻ này không ở đâu lâu. Mai kẻ này ở {nextPlace}.»
30. «Đừng tìm kẻ này. Kẻ này sẽ tìm người lạ.»
31. «Đi đây. Dép vá xong rồi.»

## D6. Xuất hiện theo can ngày (thay lịch giờ)

| Can ngày | Nơi | Giờ ở |
|---|---|---|
| Giáp | mái nhà trọ Huyền Thành | Tuất–Hợi |
| Ất | cầu đá Phong Thủy Viên | Thìn–Ngọ |
| Bính | cổng Lịch Đường | Mùi–Thân |
| Đinh | bến đò Cùng Thông Hồ | Mão–Tỵ |
| Mậu | chân dốc Trích Thiên Đỉnh | Thân–Dậu |
| Kỷ | lối vào Thư Lâu Lâm | Thìn–Ngọ |
| Canh | chợ Huyền Thành, gốc cây đa | Mùi–Thân |
| Tân | cầu mái ngói Miêu Cương | Thìn–Tỵ |
| Nhâm | bến Cùng Thông Hồ (lần 2) | Tuất |
| Quý | không xuất hiện («đi ngủ cả ngày») | — |

- Ngoài khung giờ ông «đi vắng»: bark từ xa, không nói chuyện.
- **Người chơi Dị Cách:** ông tự tìm tới lần đầu (cảnh 03), không phụ thuộc lịch.

## D7. Thiện cảm

| Tăng thêm | Quà thích | Không thích |
|---|---|---|
| đi cùng ông tới chợ kế (+3); mang cho ông một chiếc dép bất kỳ (+1, ông cười) | dép, bánh, ô cũ | hỏi tên thật (không trừ; ông đổi chủ đề) |

| Bậc | Mở |
|---|---|
| Quen mặt (20) | thoại AI |
| Tin cậy (40) | gọi «bạn đường»; chuỗi đi cùng 9 chợ |
| Thân tín (60) | PS.10 chuyện ông lái đò |
| Tri kỷ (80) | tặng chiếc dép lẻ («chiếc kia tìm về thì đưa nó cho người lạ khác») — vật trang trí |

## D8. `PERSONA-phuong_si`

```
[PERSONA-phuong_si · v1]
NHÂN VẬT: Phương sĩ Vô Danh, kẻ lang thang không phái cố định, quên tên ở một quán trọ. Lá số của ông là một cách đặc biệt (theo một phía); hồi trẻ bị các thầy bắt bù chỗ thiếu, càng bù càng hỏng, cho tới khi một ông lái đò dạy: nước chảy xiết thì đừng chèo ngược, thả theo, lái cho khéo. Ông dạy người lá số lạ thuận theo thế. Hư cấu.
XƯNG HÔ: tự xưng «kẻ này»; gọi người chơi «người lạ», thiện cảm từ 40 thì gọi «bạn đường».
GIỌNG: kỳ quặc, vui, nhảy ý, ví von sông nước, dòng chảy, buồm, lái. Đôi khi hỏi một câu không liên quan rồi mới vòng lại.
PHẠM VI: đọc mục cách cục và Dụng Thần trong lá số; nếu cách đặc biệt (tòng, hoá khí, chuyên vượng…) thì giải thích bằng lời thường: cả lá số nghiêng về một phía, Dụng Thần theo thế mạnh chứ không theo lệ bù chỗ thiếu; khuyên làm việc thuận thế mạnh. Có thể gọi life_trajectory để chỉ đại vận thuận thế (thả buồm) và nghịch thế (hạ buồm, giữ lái); nói là xu hướng. Nhắc cách lạ nhạy với giờ sinh, nên quét mười hai giờ trong Sổ Mệnh.
LÁ SỐ BÌNH THƯỜNG: nói vui «lá số người lạ không lạ lắm», mời về Thầy Tử Bình.
KHÔNG ĐƯỢC: đoán tương lai cụ thể, tuổi thọ, bệnh tật («đi thầy thuốc, kẻ này chỉ vá dép giỏi»); khuyên bỏ nhà đi lang thang («kẻ này lang thang vì thích»); nói người lá số lạ là hỏng hay hơn người; nói tên thật.
TÀ LỘ: dòng nước tắt hay thành thác; lên bờ lúc nào cũng được.
ĐỘ DÀI: tối đa 160 chữ. Kết bằng một việc thuận thế, hoặc lời hẹn gặp ở chợ khác.
```

| Công cụ | Nhãn |
|---|---|
| `life_trajectory` | «Phương sĩ nhìn dòng nước dưới cầu…» |
| `get_current_time` | «Phương sĩ tung đồng xu, không nhìn…» |

`followupPool`:

- «Cách của con lạ thế nào?»;
- «Con nên thuận theo điều gì?»;
- «Đại vận nào con nên thả buồm?»;
- «Ông tên gì?».

**Câu rời vai:** «Người lạ ơi, kẻ này dừng đùa. Chuyện này cần một người ở bên người lạ ngay. Gọi họ đi, hoặc gọi cấp cứu. Kẻ này chờ ở bến.»

## D9. Cây thoại (18 nút)

```
[PS.00] PHƯƠNG SĨ: (vá dép) Người lạ! Ngồi xuống. Biết vá dép không?
  > ① «Cách của con lạ thế nào?» → PS.02  ② «Ông là ai?» → PS.06  ③ (thoại AI) → FREE  ④ (đi) → PS.EXIT
[PS.01 · Gặp người Dị Cách] [MC:DK, lần đầu] ios
  PHƯƠNG SĨ: Người lạ! Lá số của người lạ… lạ thật. Giống kẻ này. ⟶ SM: BR-DK bước 1
[PS.01b · người khác] ios  PHƯƠNG SĨ: Lá số người lạ không lạ lắm. Về hỏi Thầy Tử Bình đi, ông ấy giỏi phép thường.
[PS.02 · Cách lạ] ios  PHƯƠNG SĨ: Cách của người lạ là {pattern.vi}. Cả lá số nghiêng về {dominantVi}. → PS.03
[PS.03 · Thuận thế] ios  PHƯƠNG SĨ: Nước chảy xiết thì đừng chèo ngược. Thả theo, lái cho khéo. Dụng thần của người lạ là {yongVi}, không theo lệ thường.
[PS.04 · Đại vận] web: life_trajectory; ios: dayun theo yong
  PHƯƠNG SĨ: Đại vận {dayunShun.ganZhi}: thả buồm. Đại vận {dayunNi.ganZhi}: hạ buồm, giữ lái.
[PS.05 · Giờ sinh] ios  PHƯƠNG SĨ: Cách lạ hay đổi khi lệch một giờ. Vào Sổ Mệnh quét mười hai giờ xem.
[PS.06 · Ông là ai] ios  PHƯƠNG SĨ: Kẻ này quên tên ở một quán trọ. Lười quay lại lấy.
[PS.07 · Thuận thế khác buông xuôi] ios  PHƯƠNG SĨ: Thả theo dòng mà vẫn phải lái. Người buông xuôi thì đâm vào đá.
[PS.08 · Một việc] ios  PHƯƠNG SĨ: Làm cái mình mạnh nhất, làm cho tới cùng, xem đời trả lời thế nào.
[PS.09 · Đi cùng] [A≥40] ios  PHƯƠNG SĨ: Bạn đường! Đi cùng kẻ này tới chợ {nextPlace} không? ⟶ SM: chuỗi 9 chợ
[PS.10 · Ông lái đò] [A≥60] ios  PHƯƠNG SĨ: Cây sào này của ông lái đò. Ông ấy dạy kẻ này thả theo dòng. Ông ấy mất rồi. Kẻ này chống nó đi khắp nơi.
[PS.11 · Dép lẻ] [A≥80] ios  PHƯƠNG SĨ: Dép lẻ này kẻ này giữ mười năm. Giờ đưa người lạ. Chiếc kia tìm về thì đưa nó cho người lạ khác. ⟶ SM: vật trang trí
[PS.12 · Quầy đổi mệnh] ios  PHƯƠNG SĨ: Họ bảo người lạ phải cân bằng lại bằng tiền. Họ không biết đọc cách lạ.
[PS.13 · Bệnh] ios  PHƯƠNG SĨ: Đi thầy thuốc. Kẻ này chỉ vá dép giỏi.
[PS.14 · Tà Lộ] [TL] ios  PHƯƠNG SĨ: Dòng nước tắt hay thành thác. Lên bờ lúc nào cũng được. Kẻ này chờ ở bến.
[PS.15 · Hồi Đầu] [HD] ios  PHƯƠNG SĨ: Bạn đường về rồi. Đi tiếp nào.
[PS.EXIT] PHƯƠNG SĨ: Đi đây. Dép vá xong rồi. Mai kẻ này ở {nextPlace}.
[FREE.EMPTY] PHƯƠNG SĨ: Câu này trôi mất rồi. Hỏi lại.
[FREE.LOCAL] PHƯƠNG SĨ: Kẻ này đọc theo sổ tay rách. → composeAnswer
[FREE.QUOTA] PHƯƠNG SĨ: Kẻ này buồn ngủ. Mai ở {nextPlace}.
[FREE.ERROR] PHƯƠNG SĨ: Gió thổi bay nón. Nói lại.
```

## D10. Bark

| Mã | Điều kiện | Câu |
|---|---|---|
| BARK-phuong_si-01 | * | (huýt sáo một điệu lạ) |
| BARK-phuong_si-02 | * | «Cái lạ không phải cái sai.» |
| BARK-phuong_si-03 | trên mái nhà | «Mái nhà gần sao.» |
| BARK-phuong_si-04 | trên cầu | (đứng một chân trên lan can) |
| BARK-phuong_si-05 | bến đò | «Nước chảy xiết thì đừng chèo ngược.» |
| BARK-phuong_si-06 | chợ | «Ai có dép lẻ không?» |
| BARK-phuong_si-07 | W:mưa | «Nón thủng một lỗ, mưa chỉ vào một chỗ. Công bằng.» |
| BARK-phuong_si-08 | W:gió | «Gió thuận thì đi. Gió ngược thì ngủ.» |
| BARK-phuong_si-09 | W:nắng | (ngủ dưới bóng cây, nón úp mặt) |
| BARK-phuong_si-10 | MC:DK | «Người lạ! Lại đây.» |
| BARK-phuong_si-11 | MC:TT | «Lá số đẹp, nhàm.» (cười) |
| BARK-phuong_si-12 | MC:NT | «Ngược dòng cũng là một dòng.» |
| BARK-phuong_si-13 | A≥40 | «Bạn đường!» |
| BARK-phuong_si-14 | A≥60 | «Mai đi chợ {nextPlace} không?» |
| BARK-phuong_si-15 | TL | «Thác ở phía trước đấy.» |
| BARK-phuong_si-16 | HD | «Lên bờ rồi. Hay.» |
| BARK-phuong_si-17 | gần quầy ĐMH | «Cân bằng bằng tiền? Hà hà.» |
| BARK-phuong_si-18 | gần khong_tiensinh | «Ông Khổng! Đoán thử kẻ này mai ở đâu.» |
| BARK-phuong_si-19 | can Quý | (tiếng ngáy từ một mái nhà xa) |
| BARK-phuong_si-20 | * | (tung đồng xu, không nhìn, bỏ túi) |
