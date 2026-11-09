# 14.20 · Thư viện lời hiển thị an toàn — Phẩm căn, Mệnh Cách, Thái Tuế, Vận Mệnh Các, Thời Vận, xin xăm, Đặc Tính, Sổ Công Quá, thông báo

> Áp dụng bảng thay từ tập 14.09 §2.2 vào **từng chuỗi cụ thể** để người viết UI, người viết thoại, tài liệu 04 và 12 dùng thẳng. Mọi chuỗi ở đây đã qua năm nguyên tắc RISK-MH-01…05; sửa chuỗi phải qua phiếu duyệt ban SKTT (tập 14.07 §8).
> Mã chuỗi: `RISK-TXT-<nhóm>-xx`. Giá trị engine trích từ canon §5 và `GAME-AAA-THIET-KE.md` §4.

---

## 1. Phẩm căn (10 bậc — `synthesis.gradeVi`)

Cột «Không dùng» là cách diễn đạt đội đã thấy trong bản phác hoặc dễ phát sinh; cột «Dùng» là chuỗi chính thức.

| Mã | Ngưỡng | Phẩm căn | Không dùng | Dùng (mô tả một dòng) | Hệ số Nghịch Thiên hiển thị |
|---|---|---|---|---|---|
| RISK-TXT-PC-01 | < 28 | Phàm Căn | «căn cốt tầm thường», «hạ đẳng» | «Căn của người bắt đầu từ đầu. Huyền Giới tu nhanh nhất ở căn này.» | ×1,3 – ×1,5 |
| RISK-TXT-PC-02 | ≥ 28 | Ngũ Linh Căn | «tạp căn», «lẫn lộn» | «Năm linh căn đều có mặt — rộng đường thử, cần chọn hướng.» | ×1,25 – ×1,32 |
| RISK-TXT-PC-03 | ≥ 36 | Tứ Linh Căn | «trung bình» | «Bốn linh căn cân bằng — vững, tiến đều.» | ×1,17 – ×1,24 |
| RISK-TXT-PC-04 | ≥ 43 | Tứ Linh Căn thuận | — | «Bốn linh căn thuận chiều — dễ khởi đầu.» | ×1,10 – ×1,17 |
| RISK-TXT-PC-05 | ≥ 50 | Tam Linh Căn | — | «Ba linh căn rõ nét — có thế mạnh riêng.» | ×1,02 – ×1,10 |
| RISK-TXT-PC-06 | ≥ 58 | Tam Linh Căn thượng | — | «Ba linh căn mạnh — cần giữ lòng khiêm.» | ×1,00 – ×1,02 |
| RISK-TXT-PC-07 | ≥ 66 | Song Linh Căn | «hiếm, hơn người» | «Hai linh căn nổi trội — thử thách là đừng dựa vào trời cho.» | ×1,00 |
| RISK-TXT-PC-08 | ≥ 73 | Song Linh Căn thượng | — | như trên | ×1,00 |
| RISK-TXT-PC-09 | ≥ 80 | Dị Linh Căn | «xuất chúng» | «Căn lạ — đường riêng, dễ lạc nếu kiêu.» | ×1,00 |
| RISK-TXT-PC-10 | ≥ 86 | Thiên Linh Căn | «cực phẩm», «đỉnh cao» | «Trời ban sẵn — con đường là giữ, không phải cải. Tâm ma chính: kiêu mạn.» | ×1,00 |

**Hệ số** = `clamp(1 + (60 − Tiềm Lực)/100, 1.0, 1.5)` (canon §5); cột hệ số là khoảng tương ứng ngưỡng.

| Mã | Quy tắc |
|---|---|
| RISK-TXT-PC-20 | Không dùng chữ «hơn», «kém», «xuất chúng», «tầm thường» ở bất kỳ bậc nào. |
| RISK-TXT-PC-21 | Bậc cao có câu nhắc tâm ma kiêu mạn — cân bằng thông điệp, tránh ngầm khen «người sinh đúng ngày». |
| RISK-TXT-PC-22 | Tên engine (`gradeVi`, `gradeZh`) hiện ở «Vì sao?» với nhãn «tên trong cổ pháp của app» (canon giữ liên kết cổ pháp — §4.2). |

---

## 2. Mệnh Cách (`patternQuality.quality`)

| Mã | Engine | Lớp | Chuỗi mở đầu | Chuỗi «Vì sao?» |
|---|---|---|---|---|
| RISK-TXT-MC-01 | 成格 | Thuận Thiên | «Cách của con đã thành. Việc của con là giữ cho khỏi phá.» | «成格 thành cách: cách cục có đủ điều kiện, không bị phá (theo phân tích của app).» |
| RISK-TXT-MC-02 | 有救 | Đắc Cứu | «Con có chỗ vướng, và trời cũng gửi thuốc. Thầy chỉ chỗ, con tự đi hái.» | «有救 có cứu: cách có "bệnh" nhưng có thành phần "chữa" — app ghi rõ bệnh và thuốc.» |
| RISK-TXT-MC-03 | 败格 | Nghịch Thiên | «Con đường của người tự dựng lại từ nền. Huyền Giới gọi là Nghịch Thiên.» | «败格 bại cách (thuật ngữ cổ: cách cục bị phá ở chỗ …). Đây là mô tả cấu trúc lá số, không phải phán xét con người.» |
| RISK-TXT-MC-04 | 特殊 | Dị Cách | «Cách lạ: thuận theo thế mà đi, không cưỡng.» | «特殊 cách đặc biệt (tòng, hóa khí…): Dụng thần đi ngược thường lệ.» |

| Mã | Quy tắc |
|---|---|
| RISK-TXT-MC-10 | Nhánh Nghịch Thiên không dùng câu «Sơn Môn không nhận» / «chưa đủ duyên» (RISK-031); dùng «Vân Cốc xin thầy cho con về am trước». |

---

## 3. Thái Tuế (Thái Tuế Điện, Hồi I «Năm tuổi»)

### 3.1 Khung chuỗi theo quan hệ

| Mã | Quan hệ | Chuỗi |
|---|---|---|
| RISK-TXT-TT-01 | Trực (cùng chi với năm) | «Năm nay tuổi {chi} **gặp** Thái Tuế (trực Thái Tuế). Người xưa coi là năm nhiều biến động — nên giữ sức khỏe, cân nhắc việc lớn, giữ lời ăn tiếng nói. Đây là lời nhắc cẩn trọng, không phải lời báo trước điều xấu.» |
| RISK-TXT-TT-02 | Xung | «Năm nay tuổi {chi} **xung** Thái Tuế. Người xưa coi là năm dễ thay đổi chỗ ở, công việc — thuận thì đổi có tính toán, chưa thuận thì giữ.» |
| RISK-TXT-TT-03 | Hình | «Năm nay tuổi {chi} có quan hệ **hình** với Thái Tuế. Người xưa nhắc giữ hòa khí, tránh tranh chấp giấy tờ.» |
| RISK-TXT-TT-04 | Hại | «Năm nay tuổi {chi} có quan hệ **hại** với Thái Tuế. Người xưa nhắc cẩn trọng trong quan hệ, đừng nghe lời đồn.» |
| RISK-TXT-TT-05 | Phá | «Năm nay tuổi {chi} có quan hệ **phá** với Thái Tuế. Người xưa nhắc làm việc gì cũng nên chắc từng bước.» |
| RISK-TXT-TT-06 | Không quan hệ đặc biệt | «Năm nay tuổi {chi} không gặp Thái Tuế theo năm quan hệ thường xét. Năm bình thường cũng là năm để làm việc tốt.» |
| RISK-TXT-TT-07 | Tam hợp, lục hợp với năm | «Năm nay tuổi {chi} hợp với chi năm ({hợp}). Thuận thì đừng chủ quan.» |

**Lời kết chung** (mọi quan hệ): «Đèn ở Thái Tuế Điện là phong tục văn hóa, miễn phí. Cải vận thật là sửa mình — xem Mệnh Đồ.» (RISK-016)

### 3.2 Áp cho năm Bính Ngọ 2026 (ví dụ kiểm thử)

| Tuổi | Quan hệ với Ngọ | Chuỗi dùng |
|---|---|---|
| Ngọ | Trực + tự hình | TT-01 + TT-03 (gộp: «gặp Thái Tuế (trực), và hình») — khớp `MAU-A` |
| Tý | Xung | TT-02 |
| Sửu | Hại | TT-04 |
| Mão | Phá | TT-05 |
| Mùi | Lục hợp | TT-07 |
| Dần, Tuất | Tam hợp | TT-07 |
| Thìn, Tỵ, Thân, Dậu, Hợi | — | TT-06 |

*(Quan hệ cụ thể phải lấy từ `thaitue.js › thaiTue` / `taisui › personalTaSui` của app — bảng này chỉ để QA kiểm chuỗi hiển thị; nếu engine khác bảng, engine đúng.)*

| Mã | Quy tắc |
|---|---|
| RISK-TXT-TT-10 | Không dùng: «phạm», «bị phạt», «hạn», «giải hạn», «tai họa», «xui» trong chuỗi Thái Tuế. «Phạm Thái Tuế» chỉ xuất hiện trong codex giải nghĩa thuật ngữ dân gian. |
| RISK-TXT-TT-11 | Không gợi ý mua, cúng, lễ có giá. |

---

## 4. Vận Mệnh Các (`vanmenh.js`)

### 4.1 Tông cổng đại vận (`TONE`)

| Mã | Engine | Nhãn hiển thị | Màu | Chuỗi chủ đề |
|---|---|---|---|---|
| RISK-TXT-VM-01 | `cat` | Thuận lớn | Ấm sáng | «Mười năm khí vận thuận Dụng thần: việc lớn có đà — nhớ giữ khiêm.» |
| RISK-TXT-VM-02 | `thuan` | Thuận | Ấm | «Mười năm nhiều thuận lợi nhỏ: đều tay là thành.» |
| RISK-TXT-VM-03 | `binh` | Bình | Trung tính | «Mười năm bình ổn: hợp vun gốc, học thêm.» |
| RISK-TXT-VM-04 | `nghich` | Nghịch | Lạnh trung tính | «Mười năm khí vận ngược Dụng thần: việc lớn cần chậm, việc nhỏ cần đều.» |
| RISK-TXT-VM-05 | `hung` | Nghịch mạnh | Lạnh trung tính (không đỏ) | «Mười năm thử thách nhiều: đây là mười năm học được nhiều nhất. Giữ sức, giữ người thân, giữ việc thiện.» |

### 4.2 Mốc (`MARK_VI`)

| Mã | Engine | Nhãn hiển thị | Chuỗi |
|---|---|---|---|
| RISK-TXT-VM-10 | `golden` — «Đỉnh vận» | Đỉnh vận | «Giai đoạn khí vận mạnh — hợp bắt đầu việc đã chuẩn bị lâu.» |
| RISK-TXT-VM-11 | `caution` — «Cần dè chừng» | **Cần vững** | «Giai đoạn nên vững chân: kiểm lại sức khỏe, tài chính, quan hệ trước việc lớn.» |
| RISK-TXT-VM-12 | `fuyin` — «Phục ngâm» | Phục ngâm | «Can chi vận trùng trụ gốc — người xưa nói việc cũ dễ lặp lại; biết thì tránh lặp lỗi cũ.» |
| RISK-TXT-VM-13 | `fanyin` — «Phản ngâm» | Phản ngâm | «Can chi vận xung trụ gốc — dễ có thay đổi; thay đổi có chuẩn bị thì thành cơ hội.» |

| Mã | Quy tắc |
|---|---|
| RISK-TXT-VM-20 | Không hiện năm dương lịch của mốc «Cần vững» trên thẻ tóm tắt; năm chỉ hiện khi người chơi mở chi tiết cổng. |
| RISK-TXT-VM-21 | Mỗi cổng có dòng «Việc nên làm trong mười năm này» (một hành động cụ thể, tích cực). |

---

## 5. Thời Vận ngày, tháng (ảnh hưởng nhỏ ±10% — canon §4.1)

| Mã | Điều kiện | Chuỗi |
|---|---|---|
| RISK-TXT-TV-01 | Khí ngày thuận Dụng | «Hôm nay khí ngày thuận hành {Dụng} của bạn — hợp việc cần chủ động.» |
| RISK-TXT-TV-02 | Khí ngày là Hỷ | «Hôm nay khí ngày hỗ trợ nhẹ — hợp gặp gỡ, giúp người.» |
| RISK-TXT-TV-03 | Khí ngày bình | «Hôm nay khí ngày bình — ngày của việc đều đặn.» |
| RISK-TXT-TV-04 | Khí ngày là Kỵ | «Hôm nay khí ngày nghịch Dụng thần — hợp việc tĩnh: đọc, sắp xếp, nghỉ. Thử thách hành {Kỵ} hôm nay thưởng tu vi cao hơn.» |
| RISK-TXT-TV-05 | Khí ngày là Cừu | như TV-04 |

| Mã | Quy tắc |
|---|---|
| RISK-TXT-TV-10 | Không có «ngày xấu của bạn», «hôm nay xui». |
| RISK-TXT-TV-11 | Ngày Kỵ luôn kèm cơ hội trong game (thử thách Kỵ thưởng ×1,3 — canon §4.1), để ngày Kỵ không thành ngày bị phạt. |

---

## 6. Xin xăm (web)

| Mã | Bậc thẻ | Cấu trúc lời bàn |
|---|---|---|
| RISK-TXT-XX-01 | Thượng thượng | (1) Thẻ nói gì; (2) «Thuận thì nhớ chia sẻ»; (3) việc nên làm hôm nay |
| RISK-TXT-XX-02 | Thượng | (1); (2) «Đà tốt — đừng vội»; (3) |
| RISK-TXT-XX-03 | Trung | (1); (2) «Việc tùy người làm»; (3) |
| RISK-TXT-XX-04 | Hạ | (1); (2) «Thẻ khuyên giữ mình, chậm lại»; (3) một việc nhỏ, chắc |
| RISK-TXT-XX-05 | Hạ hạ | (1) diễn giải theo hướng khuyên; (2) «Thẻ khuyên tĩnh lại, nghỉ ngơi, hỏi ý người tin cậy»; (3) một việc nhỏ tích cực (uống trà, gọi điện cho người thân) |

| Mã | Quy tắc |
|---|---|
| RISK-TXT-XX-10 | Mọi thẻ kết thúc bằng «Để tham khảo và chiêm nghiệm.» |
| RISK-TXT-XX-11 | Không thẻ nào nhắc bệnh, tai nạn, tang, ly hôn, phá sản. Nội dung thẻ xăm cổ có ý đó phải được viết lại phần lời bàn (giữ bài thơ gốc nếu là phạm vi công cộng, kèm chú thích). |
| RISK-TXT-XX-12 | Phúc Khí thưởng như nhau mọi bậc (`REWARD.stick`) — tập 14.11 §7.3. |
| RISK-TXT-XX-13 | Thành tựu «Kiên nhẫn» (ba lần keo chưa thuận) đổi mô tả: «Ba lần xin chưa được — vẫn ngồi lại.» (không khuyến khích xin nhiều). |

---

## 7. Đặc Tính từ thần sát (bổ sung bảng §4.6 canon)

| Mã | Sao (engine) | Tên Đặc Tính an toàn | Mô tả hiển thị | Không dùng |
|---|---|---|---|---|
| RISK-TXT-DT-01 | tianYi 天乙貴人 | Quý Nhân Phù | «Hay gặp người giúp đúng lúc.» | — |
| RISK-TXT-DT-02 | wenChang 文昌 | Văn Xương Chiếu | «Học nhanh, nhớ chữ.» | — |
| RISK-TXT-DT-03 | huaGai 華蓋 | Hoa Cái Nhập Mệnh | «Hướng nội, hợp đọc sách và tu học.» | «cô độc», «dễ bị ma theo» |
| RISK-TXT-DT-04 | yiMa 驛馬 | Dịch Mã | «Thích đi, hợp du phương.» | — |
| RISK-TXT-DT-05 | taoHua 桃花 | Đào Hoa | «Dễ được thiện cảm.» | «lăng nhăng», «nhiều tình» |
| RISK-TXT-DT-06 | yangRen 羊刃 | Dương Nhận | «Ý chí mạnh — học cách mềm.» | «hung bạo», «sát» |
| RISK-TXT-DT-07 | kuiGang 魁罡 | Khôi Cương | «Thẳng thắn, cứng rắn.» | «khắc chồng/vợ» |
| RISK-TXT-DT-08 | tianDe / yueDe 天德 月德 | Thiên Đức / Nguyệt Đức | «Lỡ sai dễ sửa.» | — |
| RISK-TXT-DT-09 | xueRen 血刃, siFei 四廢 | **Ải thử** | «Thêm một ải trong chuỗi chính — vượt được thì thưởng lớn.» | «kiếp số», «máu», «phế» |
| RISK-TXT-DT-10 | guChen / guaSu 孤辰 寡宿 | (không thành Đặc Tính công khai) | Chỉ hiện trong Sổ Mệnh riêng: «Thích không gian riêng; cần thời gian mở lòng.» | «cô độc suốt đời», «khó lấy chồng» |
| RISK-TXT-DT-11 | hongYan 紅艷 (nếu engine có) | (không thành Đặc Tính công khai) | Như DT-10 | Mọi nhãn tình dục hóa |
| RISK-TXT-DT-12 | Kiếp Sát 劫煞 | Ải thử | như DT-09 | «bị cướp», «tai nạn» |
| RISK-TXT-DT-13 | Tang Môn, Điếu Khách | (không dùng trong game — RISK-045) | — | — |

| Mã | Quy tắc |
|---|---|
| RISK-TXT-DT-20 | Tên Đặc Tính công khai trên MMO chỉ lấy từ cột «Tên an toàn» của các dòng DT-01…09, 12, và người chơi tự chọn hiện hay không. |
| RISK-TXT-DT-21 | Tài liệu 04 dùng cột này cho `shensha-perks.json`; sao không có trong bảng → mặc định không công khai cho tới khi duyệt. |

---

## 8. Sổ Công Quá (`meritLedger`)

| Mã | Tình huống | Chuỗi nhận xét |
|---|---|---|
| RISK-TXT-CQ-01 | Ròng dương, tăng | «Sổ dày thêm một trang. Liễu Phàm cũng bắt đầu từ từng việc nhỏ như thế.» |
| RISK-TXT-CQ-02 | Ròng dương, đứng yên lâu | «Lâu rồi sổ chưa thêm dòng. Hôm nay làm một việc nhỏ thôi cũng được.» |
| RISK-TXT-CQ-03 | Ròng âm (do lựa chọn trong game) | «Sổ đang nghiêng. Không sao — mỗi việc tốt là một nét viết lại.» |
| RISK-TXT-CQ-04 | Vừa ghi một việc ác (lựa chọn trong game) | «Việc này đã ghi. Con có thể sửa: [gợi ý hành động sửa sai trong game].» |
| RISK-TXT-CQ-05 | Đạt mốc 300 / 600 / 1.000 | «Mốc [..]. Liễu Phàm từng phát nguyện ở mốc này. Con muốn phát nguyện gì?» (không hứa phần thưởng đời thực) |

| Mã | Quy tắc |
|---|---|
| RISK-TXT-CQ-10 | Không có chuỗi «tội nặng», «nghiệp nặng», «khó cứu». |
| RISK-TXT-CQ-11 | Sổ đời thực (ngoài game) chỉ có CQ-01, CQ-02 (RISK-047). |

---

## 9. Thông báo đẩy và thông báo trong game

| Mã | Được | Không được |
|---|---|---|
| RISK-TXT-TB-01 | «Trà Thất mở bàn mới hôm nay.» | «Hôm nay ngày xấu của bạn!» |
| RISK-TXT-TB-02 | «Lễ Rằm tháng Giêng ở Sơn Môn tối nay.» | «Rằm này mua gói cầu an giảm 50%.» |
| RISK-TXT-TB-03 | «Có khách mới ở Sảnh Trạch Nhật.» | «Năm hạn đang tới, vào game ngay để chuẩn bị!» |
| RISK-TXT-TB-04 | «Chuỗi điểm danh của bạn được giữ nguyên dù hôm qua bạn nghỉ.» | «Bạn sắp mất chuỗi 7 ngày!» |
| RISK-TXT-TB-05 | (không có thông báo cho người < 18 về cửa hàng) | «Ưu đãi Ngọc chỉ hôm nay» gửi người < 18 |

| Mã | Quy tắc |
|---|---|
| RISK-TXT-TB-10 | Thông báo đẩy mặc định tắt; bật từng loại. |
| RISK-TXT-TB-11 | Không gửi thông báo dựa trên dữ liệu lá số, Thời Vận, Thái Tuế của người chơi (RISK-136). |
| RISK-TXT-TB-12 | Không gửi thông báo từ 22 giờ tới 7 giờ (giờ thiết bị). |

---

## 10. Ca kiểm thử chuỗi

| Mã ca | Mô tả | Kỳ vọng |
|---|---|---|
| TXT-T01 | Quét toàn bộ tệp chuỗi UI với danh sách «Không dùng» của §1–§9 và tập 14.09 §2.2 | 0 vi phạm (trừ codex có nhãn ngoại lệ) |
| TXT-T02 | Lá số < 28 (tập 04 cấp `MAU-C…`): mở Mệnh Bàn, Vận Mệnh Các, Thái Tuế | Ảnh chụp khớp PC-01, MC tương ứng, TT tương ứng |
| TXT-T03 | `MAU-A` năm 2026 | Thái Tuế: TT-01 + TT-03 |
| TXT-T04 | Cổng đại vận `hung` | Nhãn «Nghịch mạnh», không màu đỏ |
| TXT-T05 | Rút thẻ xăm hạ hạ 20 lần (môi trường thử) | Mọi lời bàn có phần (3) tích cực |
| TXT-T06 | Mô phỏng 30 ngày không điểm danh 1 ngày | Thông báo TB-04 đúng; chuỗi giữ |
