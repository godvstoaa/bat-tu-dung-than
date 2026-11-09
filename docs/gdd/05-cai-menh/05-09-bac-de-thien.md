# 05-09 · Bắc Đế / Động Uyên (Phong Đô) · Thiền Trúc Lâm (Yên Tử)

> Theo luật chung 05-06. Mã nhiệm vụ: `CQ-BD-xx`, `CQ-TH-xx`.
> Phong Đô chạm chủ đề **cái chết, tang, oan khuất**. Mọi cảnh phải trang nghiêm, không dọa (`ETHICS.toneRules`: «KHÔNG dùng để dọa nạt»; câu cấm của Phán quan: «dọa xuống địa ngục»). Nội dung loại hồn chỉ trong nhánh âm tà (opt-in) như Mao Sơn (05-08 §B.2).
> Thiền Trúc Lâm: app chưa có dữ liệu riêng (canon §5.6: «cần bổ sung Trúc Lâm»). Các câu Trúc Lâm trích ở đây là văn bản cổ đã thuộc phạm vi công cộng (*Cư trần lạc đạo phú*, thế kỷ XIII–XIV), mỗi trích ≤ 15 chữ; đề xuất bổ sung module `truclam-data` **(chưa có — cần làm)**.

---

# PHẦN A — BẮC ĐẾ 北帝 · ĐỘNG UYÊN 洞淵 (+ Địa Tạng)

## A.1 Tổng quan

| Hạng mục | Nội dung |
|---|---|
| Phái (app) | `beidi` — «Trừ quỷ phái — thiên bồng chú nguyên lõi; phong đô = "âm ty"», đạo tràng Phong Đô, kinh 《北帝伏魔神咒妙經》(DZ1412). `dongyuan` — «"Chuyển kinh" cứu đạo dân», kinh 《太上洞淵神咒經》(DZ0335, 20 quyển); app ghi cờ: «Không "đơn nhất thần chú" mà là các "品" — cờ textual uncertainty» |
| Phật giáo đi kèm | Địa Tạng (`JING_ZHOU[1]`, `CHAN_HUI[3]`) — canon: Phong Đô có Địa Tạng sứ giả |
| Thánh địa | `phongdo` — Phong Đô Quỷ Thành (−1500, 0); nguyên mẫu Phong Đô (Trùng Khánh) |
| NPC dẫn | Phán quan Thôi (`phan_quan`) — «bổn quan – ngươi», trang nghiêm; đọc sổ nghiệp (**Sổ Công Quá của chính người chơi**). Địa Tạng sứ giả (`diatang_su`) — dẫn người ra |
| Hành của đạo | chính **Thủy**, phụ **Kim** |
| Tu Bổ | giảm nghiệp (nghi lễ BD giảm thêm 5% / sự vụ / hạng, trần 25% — 05-06 §6.1) |
| Mở | cảnh giới 4 (phần học); phần «cứu người» ở Phong Đô theo canon mở ở cảnh giới 5 |

**Cách hiểu «âm ty» trong game:** Phong Đô là thành của **những việc chưa xong** — người còn sống mang tang, người bị oan, lời chưa kịp nói, món nợ chưa kịp trả. Đạo Bắc Đế trong game là **đạo của việc khép lại**: an ủi tang gia, giải oan bằng sự thật, đọc sổ của chính mình, dẫn người Tà Lộ về.

## A.2 Thang hạng

| Hạng | Tên hạng | Ý nghĩa | Điều kiện riêng |
|---|---|---|---|
| I | **Đăng Đồng** | người giữ đèn dẫn đường trên phố Phong Đô | `CQ-BD-01` |
| II | **Chuyển Kinh** (Động Uyên) | dự chuyển kinh cứu tế | 10 lượt thắp đèn |
| III | **Thiên Bồng** (Bắc Đế) | hiểu thiên bồng pháp (ý nghĩa), giữ cổng đêm Vu Lan | 1 lễ Vu Lan |
| IV | **Giải Oan Sư** | điều tra, giải oan bằng chứng cứ | 3 án giải oan |
| V | **Dẫn Độ** | dẫn người ra khỏi Phong Đô (người Tà Lộ, người tang) | viên mãn |

## A.3 Giới

| Loại | Giới | Mở | Thẻ giới hiện khi | Phạm khi |
|---|---|---|---|---|
| Thường trực 1 | **Không dọa người bằng địa ngục, quả báo** | I | phương án thẻ `doa` / `doa_nghiep` | chọn |
| Thường trực 2 | **Không đọc sổ của người khác** khi người đó không cho | III | NPC / người chơi nhờ «xem sổ nghiệp của kẻ thù tôi» | nhận |
| Thường trực 3 | **Không thiên vị khi giải oan** — không nhận quà của bên nào trong án | IV | NPC trong án biếu quà | nhận |
| Đạo tràng | không đùa, không biểu cảm vui trong phố Phong Đô (lệnh biểu cảm tắt) | I | | |
| Đạo tràng | thắp đèn thì giữ đèn đến hết phiên (rời giữa phiên → đèn tắt, không phạt; chỉ mất phiên) | I | | |

## A.4 Hoạt động lõi

### A.4.1 Thắp đèn dẫn đường (`B = 8` / phiên)

- Phố Phong Đô có 108 cột đèn (một phần do người chơi dựng — DEED-194). Đêm (giờ máy chủ), đèn tắt dần theo gió.
- **Mini-game:** đi dọc phố, thắp lại đèn tắt theo thứ tự gió thổi (đèn cuối gió tắt trước), giữ ≥ 80% đèn sáng trong 8 phút.
- Người chơi khác đi qua phố khi đèn sáng: không có thưởng — chỉ có phố sáng. (Đạo này là đạo «làm cho người khác đi được».)

### A.4.2 Chuyển kinh (`B = 10` / phiên)

- **Nguồn:** `dongyuan.coreMethod` «"Chuyển kinh" cứu đạo dân + các phẩm thần chú + 斋 pháp»; `ZHOU_DONG_YUAN` (tên, ý nghĩa); app nhắc kinh có **nhiều phẩm**, không phải một chú.
- **Mini-game tổ đội:** mỗi người giữ một phẩm (chương) — lật trang theo nhịp chung; một trang lật sai nhịp thì người bên cạnh «đỡ» (chạm cùng lúc) được. Phiên 6 phút.
- Mục đích luôn cụ thể: chuyển kinh cho **một tang gia** đang ở Phong Đô (sự kiện ngày).

### A.4.3 Giải oan (`B = 16` / án)

- **Nhánh đời thực (mặc định):** án điều tra như `cases.js` nhưng là **án người**: một người (sống hoặc đã mất) bị đổ oan (trộm, gây cháy, phản bội). Người chơi thu thập lời khai, vật chứng, đối chiếu thời gian; trình Phán quan Thôi. Kết quả: danh dự được trả, gia đình được yên.
- **Nhánh âm tà (opt-in):** cùng án, thêm lớp tín ngưỡng: gia đình tin người mất «chưa siêu» vì oan; khi án sáng, làm lễ chuyển kinh. `spiritTypes.hengwang-yuanling` («因含冤而死，怨氣未消») chỉ hiện ở thẻ Tàng Kinh.
- Án không bao giờ kết thúc bằng «phạt kẻ có tội» kiểu trả thù; kết thúc bằng **sự thật được nói ra** và **người có lỗi được mời sửa** (nối 05-05).

## A.5 Chuỗi nhiệm vụ Bắc Đế · Động Uyên

| Mã | Tên | Mục tiêu | Mở | Dạy | Thưởng |
|---|---|---|---|---|---|
| CQ-BD-01 | Cổng Quỷ Môn | qua cổng Phong Đô; Địa Tạng sứ giả dẫn đi một vòng; nghe Phán quan giảng 9 chiều của `beidi` và `dongyuan`; nhận giới 1 | cảnh giới 4; Nợ Âm = 0 | `SCHOOLS.beidi`, `dongyuan` | B 30; hạng I |
| CQ-BD-02 | Ngọn đèn đầu | phiên thắp đèn đầu tiên; nghe sứ giả nói vì sao phố cần đèn | I | — | B 20 |
| CQ-BD-03 | Sổ của chính mình | Phán quan đọc Sổ Công Quá **của người chơi** (đời): công ghi sổ, quá ghi sổ, quá đã cải, `meritLedger(đời).verdict`; người chơi được hỏi một câu tự xét | I | `meritLedger`; canon «đọc sổ nghiệp = Sổ Công Quá của chính người chơi» | B 30 |
| CQ-BD-04 | Thiên Bồng nguyên soái | đọc thẻ về Bắc Đế (Tử Vi), Thiên Bồng nguyên soái, Bắc cực tứ thánh; thẻ Thiên Bồng chú (tên, ý nghĩa — không văn) | I | `beidi.deity`, `ZHOU_BEI_DI_TIAN_PENG.meaning` | B 25 |
| CQ-BD-05 | Tang gia | giúp một nhà có tang làm cỗ (DEED-071), ngồi với người vợ góa nghe kể về chồng | I | — | B 35; thi lên **II · Chuyển Kinh** |
| CQ-BD-06 | Kinh nhiều phẩm | đọc thẻ Động Uyên Thần Chú Kinh: 20 quyển, nhiều phẩm (sát quỷ, phược quỷ, cấm quỷ…); vì sao app ghi «textual uncertainty» | II | `dongyuan.canon`, `distinctive` | B 25 |
| CQ-BD-07 | Chuyển kinh cứu tế | phiên chuyển kinh tổ đội đầu tiên cho tang gia | II | `dongyuan.coreMethod` | B 30 |
| CQ-BD-08 | Người bị oan trộm | án giải oan đầu (đời thực): người làm thuê bị nghi trộm; tìm ra đồ bị chuột tha | II | khung án; giới thường trực 3 (mở trước để chuẩn bị) | B 40 |
| CQ-BD-09 | Mộ không người | thắp đèn 5 mộ không người thăm (DEED-122); đọc thẻ Địa Tạng kinh (`JING_ZHOU[1]`) | II | `JING_ZHOU[1]` | B 30 |
| CQ-BD-10 | Đêm Vu Lan | 15/7 âm: giữ cổng Phong Đô, thả đèn, dẫn người lạc; tham dự lễ xá tội Trung Nguyên | II | lễ Trung Nguyên (canon §10) | B 50; lễ **III · Thiên Bồng** |
| CQ-BD-11 | Mười điện | đọc thẻ «Thập Vương» (văn hóa — kệ Đạo Tạng có từ khóa 十王, 救度, 冥王 trong `suggestDaozangByAmTa`); khung thẻ: «hình dung của người xưa về công lý sau khi chết» | III | `DAOZANG` (topic `ritual`) | B 30 |
| CQ-BD-12 | Người mất bị đổ oan | án giải oan người đã khuất: một người thợ bị đồn gây cháy chợ năm xưa; tìm sổ sách, lời khai, chứng minh cháy do sét; trả danh dự cho con cháu. (Opt-in: thêm lễ chuyển kinh, thẻ `hengwang-yuanling`) | III | khung án; `spiritTypes` (opt-in) | B 45 |
| CQ-BD-13 | Cầu Nại Hà | cảnh MMO Hồi IV: đứng ở cầu, kéo một người chơi Tà Lộ lên (DEED-037 / DEED-161) — cần người kia đồng ý | III; cảnh giới 5 | canon Hồi IV | B 45 |
| CQ-BD-14 | Dạy giữ đèn | kèm một Đăng Đồng mới 5 phiên | III | — | B 40; lễ **IV · Giải Oan Sư** (đủ 3 án) |
| CQ-BD-15 | Thư lại của Phán quan | ngồi bàn bên Phán quan khi một người chơi Tà Lộ tự đến đọc sổ (chuỗi Hồi Đầu, 05-12 §6); **chỉ đọc phần người đó cho phép**; ghi lại các tên người bị hại để chuỗi cứu bắt đầu | IV | giới thường trực 2 | B 60 |
| CQ-BD-V | Dẫn Độ | đồng hành trọn với 3 người (người chơi Tà Lộ đi tới danh hiệu Hồi Đầu, **hoặc** 3 tang gia NPC đi hết chuỗi khép tang); lễ ở cầu Nại Hà | IV, ĐH-đạo ≥ 1.800 | — | B 100; hạng **V**; danh hiệu «Phong Đô Dẫn Độ» |

**Tổng `B` chuỗi:** 30+20+30+25+35+25+30+40+30+50+30+45+45+40+60+100 = **635**.

## A.6 Thi thăng hạng

**Kiểm tri lên II (mẫu):**

1. Phong Đô trong app được gọi là gì? (Đ: «âm ty» — trung tâm tượng trưng)
2. Bắc Đế phái thờ ai làm nguyên soái? (Đ: Thiên Bồng)
3. Động Uyên nổi tiếng với pháp gì? (Đ: chuyển kinh cứu tế)
4. Phán quan đọc sổ gì? (Đ: Sổ Công Quá của chính người đến)
5. Có được nói với tang gia «người mất chưa siêu vì nghiệp» không? (Đ: không — giới không dọa)

**Kiểm hành lên III:** 10 phiên thắp đèn, 3 phiên chuyển kinh, 1 án giải oan.
**Kiểm tâm lên IV:** thắp đèn mức gió mạnh, giữ ≥ 90% đèn 3 lần.

## A.7 Kịch bản cảnh

```
[CẢNH CQ-BD-03.1 · Phong Đô, điện Phán Quan · giờ Tý · đèn xanh]
(Bàn gỗ đen. Phán quan Thôi mở một cuốn sổ — chính là Sổ Công Quá của người chơi, bìa của người chơi.)
PHÁN QUAN: Ngươi tới đọc sổ. Bổn quan không có sổ nào khác. Sổ này do chính ngươi viết.
(Phán quan đọc: số công, số quá, số quá đã cải; rồi verdict đời nguyên văn.)
PHÁN QUAN: «Tích tiểu thiện — tiếp tục.»
> Lựa chọn: ① «Thế là tốt hay xấu?» → [.2a]  ② «Ngài phạt con không?» → [.2b]  ③ (im lặng) → [.2c]

[CẢNH CQ-BD-03.2a]
PHÁN QUAN: Bổn quan không chấm tốt xấu. Bổn quan chỉ đọc. Ngươi nghe xong thì tự biết.
→ [.3]

[CẢNH CQ-BD-03.2b]
PHÁN QUAN: Ở đây không có roi. Người ta tưởng Phong Đô là chỗ phạt. Phong Đô là chỗ đọc. Ai đọc rồi thì phần lớn tự đi sửa.
→ [.3]

[CẢNH CQ-BD-03.2c]
PHÁN QUAN: Im lặng cũng là một cách nghe.
→ [.3]

[CẢNH CQ-BD-03.3]
PHÁN QUAN: Một câu thôi: trong sổ này, dòng nào ngươi muốn viết lại nhất?
(Người chơi chọn một dòng — hoặc «không có». Nếu chọn dòng quá chưa cải: mở chuỗi sửa tương ứng 05-05.)
PHÁN QUAN: Đi đi. Đèn ngoài phố còn tắt mấy ngọn.
```

```
[CẢNH CQ-BD-12.4 · Phong Đô, sân chợ cũ · giờ Dậu · mưa]
(Con cháu người thợ đứng đợi. Người chơi trình chứng cứ: sổ trực canh năm xưa ghi «sét đánh mái chợ giờ Tuất».)
CON TRAI NGƯỜI THỢ: Ba mươi năm… cả làng gọi nhà tôi là nhà đốt chợ.
> Lựa chọn: ① «Từ hôm nay thì không nữa.» ② «Tôi chỉ tìm ra sự thật thôi.» ③ (đưa tờ sổ cho anh)
(Phán quan đọc to tờ sổ trước dân làng. Một bà cụ trong đám đông cúi đầu xin lỗi.)
(Opt-in âm tà: chuyển kinh cho người thợ. Không có hình hồn hiện ra.)
PHÁN QUAN: Oan không phải chỉ của người chết. Người sống mang oan ba mươi năm cũng là người ở Phong Đô.
(B 45.)
```

## A.8 Giới hạn nội dung riêng

| # | Giới hạn |
|---|---|
| BD-G1 | Không hình ảnh hình phạt địa ngục, tra tấn, «mười tám tầng» trong game. Thập Vương chỉ có thẻ văn hóa. |
| BD-G2 | Không cảnh tự vẫn; án oan không dùng cái chết do tự hại làm nguyên nhân. |
| BD-G3 | Tang gia: mọi thoại an ủi được duyệt bởi người có chuyên môn hỗ trợ tang (cố vấn). Có thẻ hỗ trợ đời thực ở cuối các cảnh tang. |
| BD-G4 | Phán quan không bao giờ nói người chơi «sẽ xuống địa ngục». |
| BD-G5 | Sổ người khác: không có giao diện nào cho xem sổ người chơi khác, kể cả khi đạt hạng V. |

---

# PHẦN B — THIỀN · TRÚC LÂM 竹林 (Yên Tử)

## B.1 Tổng quan

| Hạng mục | Nội dung |
|---|---|
| Nguồn app | `GAI_XIN` (5 bước, 4 chìa — cốt lõi «cải tâm»), `JING_ZHOU[2]` (Kim Cang), `spiritual-fs › WX_PRACTICES` (thiền theo hành), `SIX_REALMS` (khuynh hướng), `DAO_JIA[3]` («đạo pháp tự nhiên», để đối chiếu). **Trúc Lâm: cần bổ sung dữ liệu.** |
| Thánh địa | `yentu` — Yên Tử Trúc Lâm (−400, 1500): suối Giải Oan, chùa Hoa Yên, tháp Huệ Quang, Chùa Đồng |
| NPC dẫn | Thiền sư Trúc Lâm Pháp Không (`truclam_thiensu`) — «ta – con», ít lời, công án; câu cấm: đoán vận (từ chối nhẹ nhàng) |
| Hành của đạo | chính **Kim**, phụ **Thủy** |
| Tu Bổ | Định Lực · tâm ma (giảm 10% tạp niệm / hạng, trần 50%) |
| Tinh thần Trúc Lâm (để viết thoại) | thiền giữa đời thường, «cư trần lạc đạo» — sống giữa bụi đời mà vui với đạo; không trốn đời |

## B.2 Thang hạng — Lục Diệu Pháp Môn

Sáu cửa thiền định cổ điển: 數 Sổ (đếm hơi thở), 隨 Tùy (theo hơi thở), 止 Chỉ (dừng), 觀 Quán (nhìn), 還 Hoàn (quay về), 淨 Tịnh (lặng sạch). Game gộp hai cửa cuối làm hạng V.

| Hạng | Tên hạng | Mini-game thiền mở | Chặng hành hương | Điều kiện riêng |
|---|---|---|---|---|
| I | **Sổ Tức** 數息 | đếm hơi thở 1 → 10 | suối Giải Oan | `CQ-TH-01` |
| II | **Tùy Tức** 隨息 | theo hơi thở (không đếm) | chùa Hoa Yên | 10 phiên Sổ Tức «viên» |
| III | **Chỉ** 止 | dừng (một điểm, không theo) | tháp Huệ Quang | công án thứ nhất |
| IV | **Quán** 觀 | quán (gọi tên tạp niệm rồi để đi) | Chùa Đồng | 30 lần Ngũ Bộ Chuyển Niệm thành công |
| V | **Hoàn Tịnh** 還淨 | — | — | viên mãn |

## B.3 Giới

| Loại | Giới | Mở | Thẻ giới hiện khi | Phạm khi |
|---|---|---|---|---|
| Thường trực 1 | **Không nói quá về sự tu của mình** (không xưng đắc đạo, ngộ, chứng) | I | phương án `xung_dac` («Ta đã ngộ rồi») | chọn |
| Thường trực 2 | **Không sát** — không chọn bất kỳ DEED A-SS | III | thẻ hậu quả DEED sát | chọn (đồng thời là việc ác) |
| Thường trực 3 | **Không tranh luận để thắng** về đạo | IV | phương án `tranh_luan` trong hội thoại với người chơi / NPC đạo khác | chọn |
| Đạo tràng | trong Yên Tử không xem lá số cho ai (Bàn giải án tắt; khách hỏi thì từ chối nhẹ) | I | | |
| Đạo tràng | đi bộ trên đường hành hương (ngự vật tắt từ suối Giải Oan lên Chùa Đồng) | I | | |
| Đạo tràng | im lặng trong thiền đường; chay trong trai đường | I | | |

## B.4 Hoạt động lõi

### B.4.1 Thiền (`B = 12` / phiên)

- **Yêu cầu mini-game (09)** khác tĩnh tọa Thanh Vi: **không có vòng thở dẫn nhịp**. Màn hình tĩnh (cảnh núi, mây). Tạp niệm xuất hiện dưới dạng **chữ mờ** trôi vào (một ý nghĩ: «mai làm gì», «người kia nói gì»…). Người chơi có ba việc:
  - mức Sổ Tức: đếm — mỗi hơi thở tự nhiên (nhịp nhạc nền) chạm một lần, từ 1 đến 10 rồi lại 1; lạc đếm (chạm lệch nhịp) thì về 1, không phạt;
  - mức Tùy / Chỉ: không chạm gì; tạp niệm trôi qua là đúng; **chạm vào tạp niệm** = «theo niệm»;
  - mức Quán: khi tạp niệm xuất hiện, chọn **tên** của nó (lo, nhớ, muốn, giận, sợ) rồi nó tan — tập «biết niệm đang khởi» đúng bước 觉 của `GAI_XIN`.
- Phiên 5 / 10 / 20 phút. Không có điểm số hiển thị, chỉ có một vòng tròn mực đậm dần (thiền Trúc Lâm vẽ vòng tròn).
- Tâm ma (05-05 §2.4) và giảm tâm ma theo hạng (Tu Bổ) áp ở đây.

### B.4.2 Công án (`B = 10` / lần ngồi)

- **AI persona** (bản sơ đồ §9.3): thiền sư đưa câu hỏi mở; người chơi trả lời tự do; AI **không** có đáp án đúng, chỉ hỏi ngược, im lặng, hoặc nói một câu ngắn. Chấm bằng **kiên trì**: số lần quay lại ngồi với cùng một công án (≥ 3 ngày khác nhau) — không chấm nội dung.
- **Khi AI tắt / iOS:** thoại kịch bản gồm 6 «phản hồi» xoay vòng cho mỗi công án, chọn theo độ dài câu người chơi (ngắn / dài) và số lần đã quay lại.
- **Công án dùng trong game** (văn bản thiền cổ, phạm vi công cộng):

| Mã nội bộ | Công án | Ghi chú |
|---|---|---|
| CA-1 | «Vạn pháp quy về một, một quy về đâu?» | kinh điển Thiền tông |
| CA-2 | «Trước khi cha mẹ sinh ra, mặt mũi xưa của con là gì?» | kinh điển |
| CA-3 | «Đối cảnh vô tâm mạc vấn thiền» — đối cảnh không động tâm thì còn hỏi thiền làm gì? | *Cư trần lạc đạo phú*, Trần Nhân Tông |
| CA-4 | «Con đọc lá số mình mỗi ngày. Ai đang đọc?» | công án riêng của game (nối chủ đề lá số) |

### B.4.3 Hành hương bậc đá (`B = 10` / chặng)

- Bốn chặng: suối Giải Oan → chùa Hoa Yên → tháp Huệ Quang → Chùa Đồng (đỉnh). Đi bộ, có chòi nghỉ; leo một chặng ≈ 8–12 phút thật.
- Ở mỗi chặng: một việc nhỏ (nhặt mảnh sành — DEED-123; đỡ người già — DEED-030), một phút ngồi.
- Chặng mở theo hạng (bảng B.2); đi lại chặng đã mở được thưởng tối đa 1 lần / ngày.

## B.5 Chuỗi nhiệm vụ Thiền Trúc Lâm

| Mã | Tên | Mục tiêu | Mở | Dạy | Thưởng |
|---|---|---|---|---|---|
| CQ-TH-01 | Suối Giải Oan | tới chân núi; rửa tay ở suối (nơi tương truyền gắn với chuyện giải oan thời Trần — thẻ văn hóa); gặp thiền sư; nhận giới 1 | đến `yentu` | thẻ Trúc Lâm: Trần Nhân Tông (1258–1308), xuất gia ở Yên Tử, khai Thiền phái Trúc Lâm | B 30; hạng I |
| CQ-TH-02 | Đếm hơi thở | 3 phiên Sổ Tức | I | Lục Diệu Pháp Môn (cửa Sổ) | B 25 |
| CQ-TH-03 | Cư trần lạc đạo | đọc thẻ *Cư trần lạc đạo phú* (trích ≤ 15 chữ, giải ý); làm một việc thường ngày (gánh nước, quét sân) với «tâm thiền» (không chạm UI 3 phút khi làm) | I | tinh thần Trúc Lâm | B 25 |
| CQ-TH-04 | Ăn cơm | bữa ở trai đường: ăn chậm (hoạt ảnh), không chat, không bỏ thừa | I | — | B 20 |
| CQ-TH-05 | Chùa Hoa Yên | hành hương chặng 2; ngồi thiền 10 phút ở sân chùa | I | — | B 35; thi lên **II · Tùy Tức** |
| CQ-TH-06 | Theo hơi thở | 5 phiên Tùy Tức | II | cửa Tùy | B 25 |
| CQ-TH-07 | Công án thứ nhất | ngồi với CA-1 ba ngày khác nhau | II | công án; bước 觉 | B 40 |
| CQ-TH-08 | Kim Cang | đọc thẻ Kim Cang kinh; câu kệ «一切有为法，如梦幻泡影» (≤ 15 chữ); thiền một phiên với câu đó làm đề | II | `JING_ZHOU[2]` («思维「凡所有相皆是虚妄」破 chấp») | B 30 |
| CQ-TH-09 | Năm bước | 10 lần Ngũ Bộ Chuyển Niệm thành công (05-01 §3.4); thiền sư nói về 4 chìa khóa | II | `GAI_XIN` toàn bộ | B 35 |
| CQ-TH-10 | Tháp Huệ Quang | hành hương chặng 3; thắp hương ở tháp Tổ (tượng trưng, không leo lên tháp) | II | — | B 50; lễ **III · Chỉ** |
| CQ-TH-11 | Công án thứ hai | ngồi với CA-3 ba ngày khác nhau | III | *Cư trần lạc đạo* | B 40 |
| CQ-TH-12 | Thiền không phải trốn | thiền sư bảo xuống núi: ngồi với một người đang buồn ở Huyền Thành (DEED-065), không khuyên gì, chỉ nghe | III | «cư trần» — đạo ở giữa đời | B 40 |
| CQ-TH-13 | Từ tâm | 3 buổi thiền từ tâm: người thân → người lạ → người từng làm mình giận (cùng bước của `CQ-SH-SAN`) | III | `YEGUO[8].cure` «日修慈心观 (亲→中→怨次第)» | B 40 |
| CQ-TH-14 | Dạy đếm hơi thở | kèm 1 người chơi hạng I đủ 10 phiên Sổ Tức | III | — | B 40; thi lên **IV · Quán** (đủ 30 lần chuyển niệm) |
| CQ-TH-15 | Đêm Chùa Đồng | đêm 1/11 âm (ngày Tổ Trần Nhân Tông viên tịch): leo đêm lên Chùa Đồng, ngồi tới sáng (sự kiện; phiên 30 phút thật có thể chia) | IV | thẻ Trúc Lâm | B 60 |
| CQ-TH-V | Hoàn Tịnh | dẫn 3 người chơi lên đủ bốn chặng, ngồi cùng trên đỉnh; ngồi với CA-4 lần cuối | IV, ĐH-đạo ≥ 1.800 | — | B 100; hạng **V**; danh hiệu «Trúc Lâm Cư Sĩ» |

**Tổng `B` chuỗi:** 30+25+25+20+35+25+40+30+35+50+40+40+40+40+60+100 = **635**.

## B.6 Thi thăng hạng

Thiền **không có kiểm tri trắc nghiệm** (đúng tinh thần thiền). Thay bằng:

| Lên hạng | Thay kiểm tri bằng |
|---|---|
| II | thiền sư hỏi một câu: «Hơi thở thứ mười của con đâu rồi?» — mọi câu trả lời đều qua; chỉ cần trả lời (hoặc im lặng 30 giây) |
| III | ngồi với công án thứ nhất ở 3 ngày khác nhau |
| IV | 30 lần chuyển niệm thành công |

**Kiểm tâm lên IV:** Quán mức 3 (20 phút) — đạt khi gọi đúng tên ≥ 70% tạp niệm.

## B.7 Kịch bản cảnh

```
[CẢNH CQ-TH-01.1 · Yên Tử, suối Giải Oan · giờ Mão · sương]
(Thiền sư Pháp Không ngồi trên tảng đá, chân trần, chuỗi tràng trong tay.)
PHÁP KHÔNG: Con đến xem ta có biết số con không?
> Lựa chọn: ① «Dạ không. Con đến học thiền.» → [.2a]  ② «Thầy có biết không ạ?» → [.2b]

[CẢNH CQ-TH-01.2a]
PHÁP KHÔNG: Thiền thì không học được. Ngồi được.
→ [.3]

[CẢNH CQ-TH-01.2b]
PHÁP KHÔNG: (cười) Ta biết con đang thở. Thế là đủ biết cho hôm nay.
→ [.3]

[CẢNH CQ-TH-01.3]
PHÁP KHÔNG: Rửa tay đi. Nước lạnh lắm. Lạnh thì tỉnh.
(Người chơi rửa tay — hoạt ảnh, tiếng nước.)
PHÁP KHÔNG: Ở đây có một điều: đừng nói với ai là con đã ngộ. Kể cả khi con nghĩ con ngộ.
(Giới thường trực 1. Hạng I · Sổ Tức.)
```

```
[CẢNH CQ-TH-07 · công án CA-1, lần quay lại thứ ba · Hoa Yên · chiều]
PHÁP KHÔNG: Lại đến à.
(Ô trả lời tự do. Giả sử người chơi viết: «Một quy về chỗ con đang ngồi.»)
PHÁP KHÔNG (AI, persona): Chỗ con đang ngồi là chỗ nào?
(Người chơi viết tiếp hoặc im.)
PHÁP KHÔNG: (nếu im 30 giây) Ừ. Thế cũng được.
(Ghi nhận lần quay lại thứ ba. CQ-TH-07 xong. Không có đánh giá câu trả lời.)
```

```
[CẢNH CQ-TH-V.1 · Chùa Đồng, đỉnh Yên Tử · bình minh · biển mây]
(Ba người chơi ngồi cạnh. Không ai nói.)
PHÁP KHÔNG: (sau 3 phút) Con dẫn người lên tới đây. Lên tới đây rồi thì phải xuống.
PHÁP KHÔNG: Xuống núi mà vẫn ngồi được như trên núi, đó là Trúc Lâm.
(Danh hiệu «Trúc Lâm Cư Sĩ». Suất trả lại.)
```

## B.8 Giới hạn nội dung riêng

| # | Giới hạn |
|---|---|
| TH-G1 | Thiền sư không đoán vận, không giải lá số; câu cấm có sẵn trong persona. Hỏi về số mệnh → «Hỏi Thầy Tử Bình. Ở đây chỉ hỏi con là ai.» |
| TH-G2 | Không gắn thiền với chữa bệnh, giảm cân, «nâng cấp não». |
| TH-G3 | Trích *Cư trần lạc đạo* và công án ≤ 15 chữ / thẻ; trích nguồn. |
| TH-G4 | Không dựng tượng Trần Nhân Tông làm vật tương tác; tháp Tổ chỉ thắp hương từ xa. Cố vấn Phật giáo Việt Nam duyệt toàn bộ nội dung Yên Tử. |
| TH-G5 | Chế độ AI công án: bộ lọc an toàn (bản sơ đồ §6.4) — người chơi viết về khủng hoảng thật thì AI rời vai, đưa thông tin hỗ trợ. |

## B.9 Ca biên

| Ca | Xử lý |
|---|---|
| Người chơi viết công án bằng câu xúc phạm / spam | AI trả lời ngắn «Ừ.» và không tính lần quay lại (lọc nội dung) |
| Hành hương khi đang có sự kiện mưa | bậc trơn: thêm cơ hội DEED-035; thời gian leo +20% |
| iOS | giữ toàn bộ (tu tâm, học); công án dùng thoại kịch bản (AI tắt trên iOS theo `features.js`) |
