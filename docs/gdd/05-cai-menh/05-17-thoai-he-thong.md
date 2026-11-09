# 05-17 · Thoại hệ thống của hệ cải mệnh

> Thoại **kịch bản** (không qua AI) mà máy nhiệm vụ phát khi một sự kiện của hệ cải mệnh xảy ra. Đây là lớp chạy cả khi AI tắt và trên iOS (bản sơ đồ §6.1 mục 5). Tài liệu 06 gắn mã `BARK-*` / `PERSONA-*` khi đưa vào hệ thoại; ở đây chỉ khóa theo **sự kiện**.
> Quy tắc chung: mỗi ô có 2–3 biến thể xoay vòng; không câu nào phán định mệnh (RB2), không dọa nghiệp, không nhắc Ngọc / VIP / cửa hàng (bản sơ đồ §6.4 quy tắc 1); câu đoán luôn kèm «con có thể…».

---

## 1. Tầng Cải Vận

### 1.1 Khi nhận Vận Phù lần đầu trong ngày (người nói: NPC gần nhất có vai dẫn đạo; mặc định Vân Cốc qua thư ngắn)

| Vận Phù | Câu |
|---|---|
| Phương Vị | «Ngồi quay về phía nước của con, thấy dễ thở hơn không?» · «Hướng đúng thì việc nhẹ tay một chút. Một chút thôi.» |
| Hợp Mệnh | «Áo hợp mệnh. Đẹp, nhưng đừng tưởng áo làm thay con.» · «Màu ấy hợp con. Giờ đi làm việc cho hợp nữa.» |
| Hỷ Sắc | «Màu phụ cũng tốt. Thiếu một bộ thì mặc nửa bộ, có sao.» |
| Chính Nghiệp | «Sảnh này hợp hành của con. Làm ở chỗ hợp thì đỡ mỏi.» |
| Gia Trạch | «Đêm qua con ngủ ở nhà. Nhà yên thì người yên.» · «Giường quay đúng phương rồi. Giờ ngủ cho đủ.» |
| Số | «Con số đẹp. Người xưa thích thế. Đừng đánh đổi gì vì nó.» |
| Dưỡng | «Ăn đúng mùa là chuyện của người biết sống, không phải chuyện bùa.» |
| Tùy Thân | «Món đeo hợp hành. Nhớ: vật đeo để nhắc mình, không để che chở mình.» |
| Cát Nhật | «Ngày tốt cho lễ. Lễ thành thì lòng người dự cũng thành.» |
| Đồng Hành | «Đi với người hợp mình thì đường ngắn lại. Đi với người không hợp thì mình lớn lên.» |

### 1.2 Theo rating lưu niên (đầu năm, và khi người chơi hỏi «năm nay thế nào»)

| Rating | Thầy Tử Bình | Vân Cốc | Khổng tiên sinh (phản đề) |
|---|---|---|---|
| Đại cát | «Năm thuận lớn. Con có thể làm việc lớn — làm cả phần cho năm sau giữ.» | «Gió thuận thì nhớ người đang đi ngược gió.» | «Năm này ngươi thắng. Rồi sẽ thua. Mệnh vốn thế.» |
| Cát | «Năm thuận. Con có thể tiến, tiến vừa đủ.» | «Được thì cho bớt đi một ít.» | «Năm tốt. Hưởng đi, đừng hỏi vì sao.» |
| Bình | «Năm bình. Con có thể giữ nhịp đều.» | «Năm bình là năm người ta quên tu. Đừng quên.» | «Không gì xảy ra cả. Đời ngươi phần lớn là thế.» |
| Hơi kỵ | «Năm hơi trở. Con có thể chậm lại mà không thua ai.» | «Gai nhỏ thì đi giày.» | «Bắt đầu xuống rồi đấy.» |
| Hung | «Năm khó. Con có thể giữ tiền, giữ lời, giữ sức.» | «Năm khó là năm tu tâm được nhiều nhất. Thầy nói thật.» | «Năm hung. Ta đã nói rồi.» |
| Đại hung | «Năm rất khó. Con có thể hoãn việc lớn; hoãn không phải thua.» | «Năm này con có Nghịch Duyên. Người xưa gọi là thầy.» | «Ngồi yên mà chịu. Hay là ngươi định làm gì khác?» |

*(Khổng tiên sinh luôn kết bằng câu hỏi ngược khi người chơi đã có ≥ 1 nút Mệnh Đồ xong — persona canon §6.2: «luôn kết bằng câu hỏi ngược».)*

---

## 2. Tầng Cải Tâm · Cải Hành

### 2.1 Nhật hạn

| Sự kiện | Câu (Vân Cốc, hiện như dòng chữ viết tay góc màn hình) |
|---|---|
| chạm hạn mềm | «Hôm nay con đã gieo đủ. Phần còn lại cứ làm vì việc đáng làm.» · «Đủ rồi, thầy không đếm nữa đâu.» |
| chạm hạn cứng | «Mai lại tu. Đêm nay ngủ sớm.» · «Ruộng cày quá tay thì đất bạc.» |
| có Tĩnh Khí dồn | «Mấy hôm con bận. Không sao, phần ấy vẫn để dành.» |
| nhật hạn công | «Mười lăm việc. Việc thứ mười sáu là việc trời ghi, sổ không ghi.» |

### 2.2 Ngũ Bộ Chuyển Niệm — câu bước 1 theo thẻ nghiệp

| Thẻ | Câu «Giác» (chữ mờ) |
|---|---|
| `san` | «Niệm giận đang khởi.» |
| `ac_khau` | «Lời gai đang lên tới miệng.» |
| `luong` | «Muốn đem lời người này sang người kia.» |
| `vong` | «Định nói điều không thật.» |
| `y` | «Định nói cho vui mà không cần nói.» |
| `tham` | «Muốn thêm.» |
| `si` | «Định nói "số cả rồi".» |
| `nghich_thuong` | «Định cãi người dạy mình.» |
| `doa` | «Định làm người khác sợ.» |
| `khoe_phap` | «Muốn người ta biết mình hơn.» |

### 2.3 Thẻ chìa khóa — 24 mẫu cho đội viết

| # | Tình huống | Chìa khóa | Câu trên thẻ |
|---|---|---|---|
| 1 | người buôn tính sai tiền | Thuận thụ | «Chuyện nhỏ, mình nhận, rồi nói nhẹ.» |
| 2 | bị NPC chen hàng ở sảnh | Thuận thụ | «Người ấy vội. Mình không vội.» |
| 3 | mưa làm hỏng buổi lễ | Thuận thụ | «Trời mưa không phải để phạt mình.» |
| 4 | khách mắng vì giải lá số «xấu» | Thuận thụ | «Người đang sợ thì hay mắng. Nghe hết đã.» |
| 5 | thi Hương trượt, bị chế | Nghịch tăng thượng duyên | «Người này đang chỉ cho mình chỗ yếu.» |
| 6 | sư huynh trong quán bắt bẻ | Nghịch tăng thượng duyên | «Có người soi thì mình sáng hơn.» |
| 7 | công án mãi không hiểu | Nghịch tăng thượng duyên | «Chỗ bí là chỗ đang mở.» |
| 8 | thua người chơi khác ở Thiên Bảng | Nghịch tăng thượng duyên | «Người đi trước để mình biết đường có thật.» |
| 9 | đồ vừa mua bị vỡ, năm hung | Tiêu nghiệp tưởng | «Vỡ cái bát, nhẹ đi một món nợ.» |
| 10 | bị đổ oan ở chợ | Tiêu nghiệp tưởng | «Oan thì gỡ. Gỡ được thì nhẹ hơn trước.» |
| 11 | lễ Hồng Danh mỏi gối | Tiêu nghiệp tưởng | «Mỏi gối là đang trả.» |
| 12 | NPC bạn bỏ đi sau Tà Lộ của mình | Tiêu nghiệp tưởng | «Mình làm thì mình gánh. Gánh rồi thì đặt xuống được.» |
| 13 | mẹ nuôi (bà chủ trọ) cằn nhằn | Hoàn trái tưởng | «Ngày xưa mẹ cũng chịu mình như thế.» |
| 14 | thầy giao việc nặng | Hoàn trái tưởng | «Thầy cho mình nhiều rồi. Giờ mình gánh giúp.» |
| 15 | dân làng nhờ việc không công | Hoàn trái tưởng | «Mình ăn cơm của làng bao lâu rồi.» |
| 16 | đệ tử chậm hiểu | Hoàn trái tưởng | «Ngày xưa mình cũng chậm thế.» |
| 17 | NPC say gây sự | Thuận thụ | «Người say không nhớ gì. Mình nhớ là đủ.» |
| 18 | bị lừa mất Phúc Khí | Tiêu nghiệp tưởng | «Mất ít, học nhiều.» |
| 19 | đồng môn được khen, mình không | Nghịch tăng thượng duyên | «Vui cùng người ta là một việc khó. Thử làm.» |
| 20 | người chơi khác nói xấu đạo mình | Thuận thụ | «Đạo không cần mình bênh bằng giận.» |
| 21 | NPC trẻ hỗn với mình | Hoàn trái tưởng | «Mình cũng từng hỗn với người lớn.» |
| 22 | mất đèn Thái Tuế do Nợ Âm | Tiêu nghiệp tưởng | «Đèn tắt vì mình. Mình thắp lại được.» |
| 23 | phải hoãn việc lớn vì năm giữ | Nghịch tăng thượng duyên | «Năm giữ dạy mình chờ.» |
| 24 | bị từ chối giúp | Thuận thụ | «Người ta có lý của người ta.» |

### 2.4 Tâm Đề tuần — mở tuần và đóng tuần

| Nhật can · Tâm Đề | Mở tuần (sáng thứ Hai) | Đóng tuần đủ 7/7 |
|---|---|---|
| Giáp · Nhu | «Cây thẳng hay gãy trong bão. Tuần này tập cúi.» | «Tuần này con cúi được bảy lần. Không ai thấy con thấp đi.» |
| Ất · Lập | «Dây leo cũng có ngày tự đứng. Tuần này tự đứng.» | «Con tự làm hết. Thầy không giúp gì, thầy vui.» |
| Bính · Tĩnh | «Lửa giữ được mới sưởi được. Tuần này giữ lửa.» | «Bảy ngày con ngồi yên được. Lửa vẫn còn, ấm hơn.» |
| Đinh · Khai | «Ngọn đèn đóng cửa thì chỉ sáng một phòng. Tuần này mở cửa.» | «Con nói chuyện với người nhiều hơn. Đèn sáng ra sân rồi.» |
| Mậu · Thông | «Núi không đi được, nhưng đường qua núi thì đổi được.» | «Con đã đổi cách. Núi vẫn là núi, con thì khác.» |
| Kỷ · Xả | «Ruộng ôm nước nhiều quá thì úng. Tuần này buông bớt.» | «Con nói "không" được mấy lần. Không ai giận con cả.» |
| Canh · Ôn | «Kiếm tốt không phải kiếm sắc nhất. Tuần này mềm lời.» | «Bảy ngày không lời gai. Người ta bắt đầu kể chuyện với con.» |
| Tân · Khoan | «Ngọc đẹp vì người ta mài nó. Tuần này để người khác sai.» | «Con tha được. Tha người là tháo dây cho mình.» |
| Nhâm · Thủ | «Sông lớn cần bờ. Tuần này giữ nề nếp.» | «Bảy ngày đều. Sông vẫn rộng, giờ có bờ.» |
| Quý · Minh | «Mưa phùn cũng cần nắng. Tuần này ra chỗ sáng.» | «Con ra ngoài nhiều hơn. Thầy thấy mặt con sáng ra.» |

### 2.5 Phạm giới và lấy lại (người nói: NPC dẫn của đạo)

| Đạo | Khi phạm | Khi sám + sửa xong |
|---|---|---|
| Chính Nhất | «Thí chủ quên lời hứa ở cửa phủ rồi.» | «Nhớ lại là được. Lục vẫn của thí chủ.» |
| Thanh Vi | «Tiểu hữu, chạy nhanh quá thì vấp.» | «Đứng dậy rồi. Đi tiếp, đi chậm.» |
| Toàn Chân | «Giới quán, đạo hữu nhớ không?» | «Sám rồi thì nhớ. Ai cũng thế cả.» |
| Thượng Thanh | «Anh vừa nói điều Mao Sơn không nói.» | «Sửa rồi. Lần sau hỏi người trước.» |
| Bắc Đế | «Bổn quan ghi.» | «Bổn quan gạch.» |
| Thiền | (im lặng; một chiếc lá rơi) | «Ừ.» |
| Tịnh Độ | «Con ơi, chậm lại một chút.» | «Thấy chưa, lòng nhẹ hơn.» |
| Mật | «Số biến không quan trọng bằng lòng lúc trì.» | «Hồi hướng cho người ấy đi.» |
| Nho | «Trò biết điều ấy sai mà.» | «Biết sai mà sửa, lão phu quý hơn trò không bao giờ sai.» |

### 2.6 Khiêm và khoe (05-01 §3.6)

| Sự kiện | Câu |
|---|---|
| người chơi khoe việc thiện lần đầu | Vân Cốc: «Được khen rồi thì phần trời trả đã nhận. Không sao, lần sau để trời trả.» |
| khoe lần thứ năm | Vân Cốc: «Con kể nhiều quá thì việc thiện thành chuyện kể.» |
| âm thiện thứ 10 | (không ai nói gì — chỉ dòng sổ) |
| khiêm khi được khen | NPC khen: «Người này khiêm quá.» · «Lạ, giỏi mà không nhận.» |
| gỡ danh hiệu ẩn «Mãn» | Vân Cốc: «Mười lần cúi. Con tháo được cái mũ nặng rồi.» |

---

## 3. Tầng Cải Mệnh

### 3.1 Đột phá (người nói theo đạo chính)

| Bậc | Đạo (Huyền Hư / Trương Thiên Sư / Khâu đạo trưởng) | Phật (Pháp Không / Diệu Âm) | Nho (Tế tửu) | Chưa có đạo (Vân Cốc) |
|---|---|---|---|---|
| 2 | «Đã vào cửa. Cửa rộng, đường hẹp.» | «Quy y là về nhà.» | «Từ nay trò là Sĩ. Sĩ thì phải có chí.» | «Bước đầu. Bước đầu khó nhất, con qua rồi.» |
| 3 | «Tinh đã hóa khí. Giữ cho nó đừng tán.» | «Giữ giới là giữ cái bình. Bình lành mới đựng nước.» | «Quân tử ăn không cầu no, ở không cầu yên.» | «Con bắt đầu thấy mình khác chưa?» |
| 4 | «Từ đây căn cốt không còn tính. Chỉ còn tiểu hữu.» | «Định. Tâm như mặt hồ không gió.» | «Hiền nhân không ở chỗ đông người khen.» | «Từ nay không ai hỏi con sinh giờ nào nữa.» |
| 5 | «Thần hoàn hư. Càng có càng ít.» | «Tuệ là thấy mọi thứ như nó là.» | «Đại Nho là người dạy được người khác thành người.» | «Con đi xa rồi. Nhìn lại đi — đường con tự vẽ.» |
| 6 | «Hợp đạo. Không còn ta tu, chỉ còn tu.» | «Giải thoát không phải đi đâu xa.» | «Thánh hiền chưa từng nghĩ mình là thánh hiền.» | «Tám chữ không đổi. Người mang tám chữ đã khác.» |

### 3.2 Hoàn thành nút Mệnh Đồ

| Nút | Câu (NPC dẫn của nút) |
|---|---|
| Không Gian | chủ sảnh Dương Trạch: «Nhà đã đúng phương. Giờ cái nhà cần người hiền.» |
| Danh | Tế tửu: «Đạo hiệu đẹp. Sống cho tên đẹp thêm.» |
| Thời | Thầy Tử Bình: «Con biết năm nào tiến, năm nào giữ. Thế là biết thời.» |
| Thái Tuế | người giữ đèn: «Đèn sáng cả năm. Người thắp đèn cũng sáng theo.» |
| Làm Công | chủ sảnh Tượng Pháp: «Manh phái nói hợp là công lớn. Con hợp được người rồi.» |
| Tích Âm Đức | Vân Cốc: «Tầng này không bao giờ xong. Thầy chỉ đóng dấu cho con một lần thôi.» |

### 3.3 Giảng tổ hợp hung (chủ sảnh Cách Cục — bước «Hiểu» của CQ-MD-53…58)

| Tổ hợp | Câu giảng (dựa `SPECIFIC_REMEDY`) |
|---|---|
| Thương Quan Kiến Quan | «Thương Quan là cái miệng giỏi, Quan là cái khuôn. Miệng giỏi gặp khuôn thì cãi. Có Ấn ở giữa — sách vở, sự kiên nhẫn — thì miệng biết lúc nào nên im.» |
| Kiêu Đoạt Thực | «Kiêu là cái lo xa, Thực là cái hưởng. Lo xa quá thì ăn không ngon. Có Tài chế Kiêu — một nguồn thu đều đặn — thì lo bớt.» |
| Quan Sát Hỗn Tạp | «Hai ông chủ một lúc. Chọn một nghề, làm cho tinh.» |
| Tài Đa Thân Nhược | «Tiền đến nhiều mà tay yếu. Tìm người cùng gánh. Đừng ôm nợ.» |
| Sát Công Thân | «Áp lực lớn hơn sức. Có Ấn hóa — người che chở, việc học — hoặc Thực chế — một tay nghề — thì áp lực thành lực.» |
| Quần Kiếp Tranh Tài | «Nhiều người tranh một miếng. Giữ tiền chặt, tìm người có kỷ luật mà hợp tác.» |

*(Kết mỗi câu, chủ sảnh luôn thêm: «Tổ hợp là gai trong cách, không phải bản án. Đi giày thì không đau.»)*

### 3.4 Thái Tuế theo kiểu phạm (người giữ đèn)

| Kiểu | Câu |
|---|---|
| Trị | «Năm tuổi. Biến động nhiều. Con có thể giữ mình yên giữa biến động.» |
| Xung | «Đứng đối diện Thái Tuế. Năm nhiều thay đổi. Con có thể đừng dời nhà, dời việc lúc vội.» |
| Hình | «Năm dễ thị phi. Con có thể giữ miệng.» |
| Phá | «Năm dễ vỡ hợp tác. Con có thể giữ lời hứa cho chắc.» |
| Hại | «Năm dễ gặp tiểu nhân. Con có thể nhìn kỹ người cười nhiều.» |
| Không phạm | «Năm nay con không phạm. Thắp đèn giúp ai đó đang phạm đi.» |

---

## 4. Nghiệp

### 4.1 Thanh nghiệp lên mức (Diệu Âm, qua thư; mức Chướng: gặp trực tiếp nếu người chơi ở Bút Tháp)

| Thanh | Vướng (20) | Nặng (50) | Chướng (80) |
|---|---|---|---|
| Huyết Ấn (SAT) | «Con có làm đau gì không? Đi thả con cá đi.» | «Sư thấy tay con đỏ. Lên chùa ngồi với sư.» | «Con chưa lên được bậc mới đâu. Lên đây đã.» |
| Hư Nang (DAO) | «Cái gì không phải của mình thì nặng túi lắm.» | «Trả đi con, trả rồi túi nhẹ.» | «Sư đợi con mang túi lên đây.» |
| Đoạn Tơ (DAM) | «Tơ người ta đứt thì mình cũng vướng.» | «Đi nối lại cho người ta.» | «Ngồi xuống, kể sư nghe.» |
| Hư Ngôn (VONG) | «Một lời không thật cần mười lời để giữ.» | «Đi nói lại cho đúng.» | «Người ta không tin con nữa đâu. Lấy lại từ một lời thật.» |
| Song Thiệt (LUONG) | «Đem lời qua lại thì cầu gãy.» | «Đi hòa hai bên.» | «Lên đây, sư dạy con nói lời làm cầu.» |
| Gai Lời (AC) | «Lời gai đâm người rồi đâm lại mình.» | «Xin lỗi người ta đi.» | «Lời con nặng lắm. Lên lạy Đại Bi với sư.» |
| Lời Rỗng (Y) | «Nói ít thì lời nặng.» | «Thay chuyện phiếm bằng một câu kinh.» | «Ngồi im với sư một buổi.» |
| Hũ Đáy Thủng (THAM) | «Đổ mãi không đầy thì xem đáy.» | «Cho đi một ít, thấy đầy hơn.» | «Lên đây, sư với con đếm xem con đã có gì.» |
| Lửa Than (SAN) | «Lửa trong lòng đốt mình trước.» | «Thở ba hơi trước khi nói.» | «Lên đây. Sư không mắng đâu.» |
| Sương Mù (SI) | «Sương thì đợi nắng. Đọc một thẻ kinh đi.» | «Hỏi ba người thầy, nghe ba cách nói.» | «Ngồi với sư. Sương tan dần.» |

### 4.2 Sự vụ đóng

| Sự kiện | Câu |
|---|---|
| sự vụ đầu tiên đóng | Diệu Âm: «Mực đen gạch son. Trang đẹp nhất trong sổ.» |
| 10 sự vụ đóng | Vân Cốc: «Con sửa giỏi hơn con làm sai. Thế là tu.» |
| sự vụ cũ hơn 30 ngày chưa sửa (một lần) | Diệu Âm: «Dòng này vẫn đợi con. Không vội, nhưng đừng quên.» |

---

## 5. Tà Lộ

### 5.1 Lời cám dỗ của Lỗ Ban (không có chỉ dẫn; giọng kẻ thao túng — `anti-manipulation-data`)

| Lúc | Câu Lỗ Ban | Phương án từ chối của người chơi |
|---|---|---|
| mời lần 1 | «Mệnh đã định rồi, con tu làm gì cho mệt. Ta yểm cho, qua năm hạn này nhanh, chắc.» | «Mệnh do ta tạo.» |
| mời lần 2 | «Người khác đã lấy phần của con từ khi con sinh ra. Lấy lại một ít có sao.» | «Không ai lấy gì của tôi.» |
| mời lần 3 | «Vân Cốc dạy con đếm từng việc thiện. Đếm tới bao giờ? Ta cho con gấp đôi, ngay hôm nay.» | «Chậm mà của mình.» |
| khi người chơi nhận | «Khôn. Chỉ cần chôn tấm thẻ này dưới nền nhà kia. Không ai biết.» | — |
| gia hạn | «Bảy ngày nữa nhé. Thêm một nhà.» | «Thôi.» |
| khi người chơi đập thẻ | «Đập thì đập. Ngươi sẽ quay lại thôi. Ai cũng quay lại.» | (không đáp) |
| Nợ Âm bậc 10 | «Con giống ta rồi.» | «Chưa.» |

### 5.2 NPC với người có Nợ Âm (05-12 §5.3)

| Nợ Âm | Người | Câu |
|---|---|---|
| 1–149 | Vân Cốc (một lần / ngày) | «Hôm nay con nặng hơn hôm qua.» |
| 150–399 | Thầy Tử Bình | «Con đang mang gì trong người?» |
| 150–399 | người buôn | «Dạo này giá lên, thông cảm.» |
| ≥ 400 | trẻ con | (chạy đi, không nói) |
| ≥ 400 | Diệu Âm (thư) | «Sư đợi con ở Phong Đô. Không ai trách con ở đó.» |
| ≥ 1.200 | Vân Cốc (gặp trên đường) | «Thầy xuống núi tìm con. Đi với thầy một đoạn không?» |

### 5.3 Với người có danh hiệu Hồi Đầu

| Người | Câu (lần đầu gặp sau khi đạt) |
|---|---|
| Thầy Tử Bình | «Con về rồi. Ngồi đi, đọc lá số lại cho thầy nghe.» |
| Lão Tùng | «Đèn cổng tôi để cho cậu đấy.» |
| Diệu Âm | «Sư biết mà.» |
| Phán quan | «Sổ của ngươi bổn quan cất rồi.» |
| chủ Trà Thất | «Trà hôm nay tôi mời. Một lần thôi đấy.» |

---

## 6. Định Mệnh Hội — lời lừa và lời vạch mặt (DEED-146 … 154)

Lời lừa của «thầy» Định Mệnh Hội dùng đúng các mẫu thao túng mà app dạy nhận diện; lời vạch mặt của người chơi luôn dẫn **dữ liệu thật** (`checkNeo`-tinh thần: không bịa).

| Án | Lời lừa | Lời vạch mặt (người chơi chọn sau khi tra engine) |
|---|---|---|
| Thái Tuế 10 lượng | «Năm nay ông phạm Thái Tuế nặng, không cúng 10 lượng thì mất mạng.» | «Ông ấy tuổi Thân. Năm Ngọ, Thân không phạm gì cả — bảng Thái Tuế treo ngay trong điện.» |
| bùa đổi cách cục | «Bùa này đổi cách cục cho cô, từ bại thành thành.» | «Cách cục là tám chữ lúc sinh. Không lá bùa nào đổi được giờ sinh của cô.» |
| thầy mù giả | «Ta thấy Tài của ngươi bị chôn, phải đào lên bằng lễ.» | «Lộc của bà ấy tọa ở trụ ngày — tài về tay mình, Manh phái nói thế. Không có gì bị chôn.» |
| đá Tử Vi | «Cung Mệnh ngươi có sao xấu, mua viên đá này để đè.» | «Sao trong cung không dời được bằng đá. Thầy Trích Thiên Đỉnh sẽ đọc cho bà nghe đúng.» |
| nhà phạm sát phải đập | «Nhà này phạm sát, đập bức tường kia đi.» | «Đó là góc nhọn chiếu cửa sổ. Treo rèm dày, đặt cây là đủ — không ai cần đập nhà.» |
| ngày cưới đại hung | «Ngày này đại hung, phải cúng mới cưới được.» | «Lịch Đường chấm ngày này tốt cho cưới và không xung tuổi hai người.» |
| lá số lạnh uống thuốc nóng | «Lá số lạnh, uống thang thuốc nóng này ba tháng.» | «Điều hậu là nói về khí hậu lá số, không phải bài thuốc. Bệnh thì hỏi thầy thuốc.» |
| sách cấm đổi mệnh | «Sách cấm trong Đạo Tạng, đọc là đổi mệnh.» | «Quyển này không có trong Đạo Tạng. Thư khố Chung Nam có danh mục.» |
| hợp hôn khắc, chia tay | «Hai đứa khắc nhau, chia tay đi kẻo chết.» | «Bàn Hợp Hôn chấm hai người ở mức vừa, có chỗ bù nhau. Không ai phải chia tay vì tám chữ.» |

**Câu kết chung khi vạch mặt xong** (người bị lừa nói, xoay vòng): «Vậy mà tôi suýt…» · «Cảm ơn cậu. Tôi sợ quá nên tin.» · «Lần sau tôi hỏi thầy thật trước.»

---

## 7. Ràng buộc kỹ thuật cho thoại hệ thống

| # | Ràng buộc |
|---|---|
| T-1 | Mọi câu có biến `{…}` (tên, năm, rating) phải lấy từ dữ liệu engine / trạng thái thật; không có biến nào AI điền. |
| T-2 | Danh sách cụm cấm (định mệnh, dọa nghiệp, khẳng định ma, nhắc cửa hàng) quét tự động trên toàn bộ bảng này mỗi lần build. |
| T-3 | Bản iOS dùng bảng này trừ các dòng gắn lá số (§1.2, §3.4 bản mệnh / Thái Tuế, §2.4 theo nhật can → thay bằng Tâm Đề tự chọn). |
| T-4 | Tài liệu 06 có thể viết thêm biến thể theo persona, nhưng không được bỏ câu kèm «con có thể…» ở các dòng đoán. |
