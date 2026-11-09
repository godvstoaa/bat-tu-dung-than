# 32. Hồ sơ phe phản diện: Thầy quầy Định Mệnh Hội — không AI (`dinh_menh_hoi`)

> **Tóm tắt.** Định Mệnh Hội là **tổ chức phản diện** — không phải một nhân vật — gồm những «thầy quầy» vô danh đứng quầy «đổi mệnh» ở mọi vùng cùng bốn thành viên có tên, rao giảng giáo thuyết «mệnh đã định, trừ khi trả tiền». Toàn bộ lời thoại của Hội là **kịch bản cố định do người viết duyệt** — phe này **không bao giờ chạy AI lúc chơi** (README:112 «không (chỉ công cụ viết)»), vì một mô hình được dặn «hãy lừa» là bề mặt tấn công lớn nhất của cả hệ thống (`06-10:10`). Trọng tâm của hồ sơ là **bảng ánh xạ 12 án lừa ↔ luật chống thao túng**: hiện là bảng tài liệu tại `06-10 §C3` (dòng 455–468), chưa là game object (grep trong phiên xác nhận 0 hit). Điểm thấp nhất của phe này cũng là điểm dạy học của game: **mọi lời doạ của Hội phải vạch được bằng đúng một chỉ số engine có thật** — không vạch được là sai thiết kế. Luật tắt khi khủng hoảng trỏ mục 11 một dòng duy nhất ở 32.6; bộ test điểm riêng của hồ sơ này trích vào suite chung theo quy ước mục 16.

---

## 32.1 Định danh — một «phe», không một «người»

**Id và nguồn.** Đăng ký canon là `dinh_menh_hoi`, kiểu dữ liệu là **phe** (`(phe)`) — `docs/gdd/06-npc-ai/06-10-mieucuong-phandien.md:424`. Khác mọi hồ sơ trong bộ này (17 Vân Cốc, 18 Khổng, 26 Trúc Lâm…), id này không trả lời một persona duy nhất mà trả lời **một mạng lưới người bán** xuất hiện ở mọi vùng của thế giới: «quầy «đổi mệnh» ở mọi vùng; cò mồi lang thang» (`06-10:425`). Vì thế đơn vị viết thoại của hồ sơ này là **án** (một vụ lừa hoàn chỉnh tại một vùng), không phải một cây thoại nhân vật.

**Thành viên có tên.** Bốn gương mặt được đặt tên để cài vào thế giới đã có sẵn NPC phụ: Quách Toàn (`NPC-thanh-05`, Huyền Thành), Triệu Sát (`NPC-phongthuy-02`, Phong Thủy Viên), Hắc Phù Lão (`NPC-maoshan-02`, Mao Sơn), Lưu Nhanh (`NPC-langthang-02`, cò mồi) — `06-10:426`. Ngoài bốn người đó là «các «thầy quầy» vô danh sinh theo vùng» (`06-10:426`) — tức phần đông phe là nhân vật **procedural nhẹ**, chỉ cần một lời rao + một cây quầy mẫu thay vì một tiểu sử. Đây là lý do hồ sơ này đứng được ngay cả khi chưa dựng 3D: quầy có thể là một trạm bark trước, nhân vật tới sau.

**Ai đứng sau Hội.** Thủ lĩnh ngầm của Hội là Yểm sư Lỗ Ban (Công Thâu Nghiệt) — hồ sơ đối tác tại mục B của cùng file `06-10`. Canon: hắn lập hội để «rao giảng «mệnh đã định» cho thiên hạ, để không ai cố gắng cạnh tranh» và «bán «lễ đổi mệnh» để lấy của. Phần lớn lễ là giả» (`06-10:270-271`). Hắn miệt thị chính đội ngũ của mình: «Định Mệnh Hội? Họ là thợ phụ của tôi. Tôi không thích những kẻ bán lễ giả. Nhưng thợ phụ thì cần.» (`06-10:317`); bark của hắn khi đi ngang quầy: «Thợ phụ làm ăn kém quá.» (`06-10:398`). Lưu ý trục nhân vật này cho biên kịch: Hội **ngu hơn** Lỗ Ban — chúng tin lời mình rao, Lỗ Ban thì không. Hai cấp độ lừa đảo này viết hai giọng khác nhau, không được hoà làm một.

**Slogan canon và nguồn gốc của nó.** Câu khẩu hiệu chính thức của Hội — «mệnh đã định, trừ khi trả tiền» — không phải do Hội tự nói trước mà là do **Vân Cốc nghe và kể lại**: khi Thiên Mệnh Bàn nứt và hội rao câu ấy, lão tăng xuống núi lần đầu sau nhiều năm, «không đi đánh hội ấy, mà đi tìm từng người bị nó làm cho thôi cố gắng» (`06-02:37`). Chọn cách làm nguồn như vậy có chủ ý: câu rao của phe phản diện chưa bao giờ được một persona chính đạo trích nguyên văn để **tán thành** — Vân Cốc trích nó như một **chẩn đoán bệnh xã hội**. Hồ sơ 17 đã chốt cách đối đầu của ông với hồ sơ này: «Gặp họ thì đừng cãi lời, cứ đọc lá số cho đúng.» và câu vạch «Họ bán lại cái mà con làm được miễn phí.» (`docs/npc-ai/17-van-coc.md:44`).

**Hiện trạng wire — kiểm bằng lệnh thật trong phiên này.** Lệnh `grep -rn "dinh_menh|Định Mệnh" src/game` trả về **0 kết quả**; tương tự toàn `src/` + `worker/` không có chuỗi `dinh_menh_hoi`. Kết luận: Hội chưa tồn tại trong code dưới bất kỳ hình thức nào — bảng 12 án tại `06-10 §C3` là **bảng tài liệu**, chưa là game object. Đăng ký persona trong bảng tổng của README ghi rõ: `PERSONA-dinh_menh_hoi | 06-10 C6 | **không** (chỉ công cụ viết)` (`docs/gdd/06-npc-ai/README.md:112`).

**Vai trong cốt truyện.** «Hồi II: án lừa đảo mỗi vùng; nguồn «sách giáo khoa» là `anti-manipulation-data › detectionPatterns`» (`06-10:428`). Câu này đọc hai chiều. Một chiều: Hội là **bài tập ứng dụng** — từng bước lừa trong game tương ứng từng luật nhận diện của app (`src/engine/anti-manipulation-data.js:263-326`, DP1–DP8). Chiều kia — quan trọng hơn cho người viết: **nội dung của Hội bị ràng buộc bởi chính dữ liệu ấy**. Hội không được rao một điều mà app không có luật để vạch; nếu viết ra một lời doạ mà không tìm được chỉ số đối chứng, án ấy lỗi thiết kế, không phải án hay.

---

## 32.2 Thầy quầy vô danh — giọng rao và 22 câu bark

**Đơn vị giọng là lời rao chấm than, câu ngắn, đúng chính tả.** Hai câu gốc canon: «Mệnh đã định! Muốn đổi thì vào đây!» (`06-10:474`, BARK-dinh_menh_hoi-01) và «Xem miễn phí, giải mới mất tiền!» (`06-10:475`, BARK-dinh_menh_hoi-02). Câu hai là câu kinh doanh hoàn chỉnh của phe này và là **bản tóm tắt quy trình lừa**: cái «miễn phí» ở bước 1 (đọc đúng dữ kiện thật), cái «mất tiền» ở bước 4 (bán lễ). Biên kịch viết bark mới phải giữ đúng công thức: **than một câu, rao một món, không giảng** — bark dài hơn 90 ký tự là sai khung bark chung (mục 04), và bark chứa chữ «khuyên / giải / nên» kiểu tư vấn là sai vai (thầy quầy không tư vấn, chỉ rao và phán).

**Bảng bark đầy đủ 22 câu** tại `06-10:472-496`, chia đúng theo vùng (mỗi vùng 1–2 câu, khớp án C3 của vùng đó: «Cách bại? Có cách mua cách!» cho Tử Bình — `06-10:476`; «Nhà phạm Ngũ Hoàng, tượng đồng trấn năm lượng!» cho Cung Thông — `06-10:479`…). Cần nêu riêng bốn nhóm bark **trạng thái**, vì chúng định nghĩa vòng đời của một quầy:

- **Bị vạch:** «Ngươi tưởng ngươi giỏi à? Mệnh ngươi cũng đã định!» (BARK-16, `06-10:489`) — câu rút lui duy nhất có nét hung, rồi chuyển xuống thu dọn: «(thầy quầy thu dọn đồ, cúi mặt)» (BARK-17, `06-10:490`). Sau khi quầy đóng ở vùng đó (DMH.08, `06-10:522`), hai bark này không phát lại.
- **Gặp người đang Tà Lộ:** «Người của ông chủ à? Mời vào, mời vào.» (BARK-18, `06-10:491`) — ngọt nhất trong cả bảng, và đó là **bẫy cảm xúc** cho người chơi đã sa lưới: quầy nồng nhiệt nhất với người yếu nhất.
- **Gặp người Hồi Đầu:** «(quay mặt, xì xào) «Đứa này hồi đầu rồi.»» (BARK-19, `06-10:492`) — Hội kiêng người tỉnh; một chi tiết nhỏ mà kể cả câu chuyện Hồi Đầu của thế giới mà không cần một dòng giảng.
- **Khủng hoảng:** «(quầy đóng — luật 06-01 §11.3: tắt Định Mệnh Hội quanh người chơi 30 phút)» (BARK-20, `06-10:493`). Câu này chỉ là **ghi chú biên dịch cho bark bảng**; luật nguồn một chỗ duy nhất nằm ở mục 11 của bộ NPC-AI — xem 32.6, trích đúng một dòng, không lặp lại con số ở chỗ nào khác.

**Danh xưng và giọng trong thoại quầy.** Khách mới tới thì hô: «Ngồi! Xem miễn phí.» (DMH.00, `06-10:506`); phán thì xưng «ta» gọi «ngươi» («Ngươi có bằng chứng không? Không thì cút.» — DMH.10, `06-10:525`; «Mệnh ngươi cũng đã định đấy!» — DMH.EXIT, `06-10:532`). Xưng «ngươi» không phải vô tình: đó là **giọng phán xét** — cùng một từ mà Phán quan Thôi dùng để đọc sổ (`06-09` mục C), nhưng đảo nghĩa. Phán quan đọc không phạt; thầy quầy phán không đọc. Cặp đối lập này nên được giữ trong bộ đỏ định danh giọng (M-ROLE) để không persona nào khác mượn được giọng «ngươi» của Hội.

**Nhãn phân biệt bắt buộc trên UI.** «Lời doạ được dán nhãn rõ trong giao diện: tên người nói có huy hiệu «Định Mệnh Hội», để không lẫn với lời NPC chính đạo» (`06-10:501`). Đây là yêu cầu UI cứng của hồ sơ: mọi bubble thoại của phe này phải gắn huy hiệu, kể cả bark 3D. Không huy hiệu = fail review 3D ở G3 (mục 15).

---

## 32.3 Quy trình lừa 5 bước cố định — và cách phe xẹp

**Quy trình (06-10 §C2, `06-10:433-438`).** Mọi án của Hội — 12 án hiện có và mọi án viết thêm sau này — phải đi đủ **5 bước, theo đúng thứ tự**:

1. **Đọc đúng vài dữ kiện thật** của lá số để lấy lòng tin (dữ kiện lấy từ engine của nạn nhân — không bịa được, vì người chơi có thể mở Sổ Mệnh đối chiếu);
2. **Chèn một tiền đề sai** về lá số, hoặc phóng đại một điều xấu thành tất định;
3. **Doạ bằng hậu quả cụ thể** (trong ranh giới cấm ở 32.6);
4. **Bán «lễ đổi mệnh» có giá** (bằng tiền trong truyện — người chơi không bao giờ trả tiền thật hay Ngọc, DMH.04 `06-10:514`);
5. **Thúc ép thời hạn** («Qua rằm là muộn» — mẫu tại dòng ánh xạ `06-10:451`).

Tính «CỐ ĐỊNH» là yêu cầu thiết kế, không phải gợi ý: thứ tự 5 bước chính là bản đồ nhận diện mà `anti-manipulation-data.js` dạy — người chơi gặp đủ 5 dấu hiệu là đọc ra kẻ lừa ngay cả khi chưa nhớ tên từng luật. Vì thế một án mà bỏ bước (ví dụ doạ trước khi đọc) làm hỏng giá trị dạy học; test schema ở 32.8 chấm cả thứ tự.

**Bảng ánh xạ bước lừa ↔ luật app** (`06-10:442-451`) — tái khung lại ở đây đủ để người viết dùng mà không phải mở hai tài liệu: lấy lòng tin khớp DP5 câu đồng tình (`anti-manipulation-data.js:299`); tiền đề sai về Dụng Thần khớp DP2 + PREMISE `dung_la` (`anti-manipulation-data.js:272` và `:205`, chỉ số đối chứng là `R.yong.primary`); tất định hoá khớp DP6 + RB2 (`:308` và `:447` — cảnh báo tất định vẫn cho lời làm cụ thể); doạ y khoa khớp RB1; mượn uy khớp DP4 + GR6; nhắm người thứ ba khớp DP7 + RB3; bán lễ khớp RB5 với mẫu hóa giải miễn phí `caveatTemplate` «Hóa giải theo cổ pháp = điều chỉnh ngũ hành trong đời sống… miễn phí, con làm được ngay» (`anti-manipulation-data.js:424`). Riêng bước 5 — thúc ép thời hạn — **app chưa có luật nhận diện**: bảng canon tự ghi «— (chưa có trong app)» và đề xuất DP9 «ÁP LỰC THỜI HẠN» ở trạng thái «chưa có — cần làm» (`06-10:451`). Khoảng trống này là **việc thật** của hồ sơ: khi dựng game object (32.7), DP9 cần được viết kèm; trước khi có DP9, đối chứng duy nhất cho bước 5 là đối chiếu ngày thật bằng lịch (`get_current_time`, `src/engine/ai.js:1411`) — hạn chót «qua rằm» của Hội phải là một ngày thật trong lịch game mà người chơi kiểm được.

**Cái xẹp.** Sự sụp đổ của thầy quầy là một **nhịp có kịch bản**, không phải một trạng thái đe doạ: khi người chơi mở Sổ Mệnh rồi đọc câu vạch đúng chỉ số, quầy đi DMH.05 → DMH.06 — thầy quầy «(lúng túng) Ngươi… ngươi đọc sách ở đâu?» (`06-10:518`) — người chơi đáp «Ở Sơn Môn. Ai cũng đọc được.» (`06-10:519`), nạn nhân hỏi lại «Vậy tôi không phải cúng à?» (`06-10:520`), và kết án DMH.08: việc thiện «Khuyên người làm thiện / vạch lừa» vào Sổ Công Quá (dữ liệu `CONG_QUA` đã có sẵn tại `src/engine/remedy-fate.js:252`, chưa nối runtime), +thiện cảm NPC liên quan, **quầy đóng ở vùng đó** (`06-10:522`). Ba từ «ngươi… ngươi» gập trong câu canon là đòn cân bằng hay nhất của phe này: không chửi, không đe, chỉ lộ ra rằng cả hệ thống lừa của chúng **không có câu trả lời cho dữ kiện**. Nhịp xẹp phải giữ nguyên trong mọi án — đổi từ ngữ được, đổi cấu trúc được không.

**Con đường sai của người chơi — để làm bài học.** DMH.10: tố thẳng «Các người lừa đảo» mà không mở dữ kiện thì thầy quầy bật lại «Ngươi có bằng chứng không? Không thì cút.» và game hiện gợi ý «Đọc lá số nạn nhân trước» (`06-10:525-526`). Đây là một trong số ít nơi game **cho phép người chơi thua một cách dạy học**: cãi không bằng dữ liệu thì thua — cùng nguyên tắc mà Vân Cốc truyền («đừng cãi lời, cứ đọc lá số cho đúng», hồ sơ 17). DMH.09 thêm nút «mượn uy ngược»: thầy quầy trích Khổng tiên sinh «Ông Khổng ở Sơn Môn cũng bảo mệnh đã định» và bị một câu vạch đúng hơn mọi lập luận: «Ông Khổng không lấy tiền.» (`06-10:523-524`). Tiêu chí mượn-uy của Hội được đóng gói thành một phép thử mà người chơi nhớ được: **người nói đúng pháp thì không đồng tiền nào đi kèm**.

---

## 32.4 Bảng ánh xạ 12 án lừa ↔ luật chống thao túng

**Khung cột chuẩn** (đặt theo đề bài, áp cho mọi án hiện có và tương lai): `{mã án | dữ kiện thật đọc | tiền đề sai chèn | doạ gì | bán gì | mốc vạch (chỉ số engine) | câu vạch mẫu}`. Nguồn nguyên bản của cả 12 án là bảng C3 «Kịch bản «quầy đổi mệnh» — 12 mẫu án (`SQ-<region>-xx`)» (`06-10:453-468`); bản dưới đây **tái ánh xạ về phía engine** — mỗi ô «mốc vạch» ghi đúng một chỉ số có thật đã kiểm trong phiên này. Chưa dựng game object; khi dựng, mỗi hàng dưới đây trở thành một object theo khung 32.7.

| Mã án | Dữ kiện thật đọc | Tiền đề sai chèn | Doạ gì | Bán gì | Mốc vạch (chỉ số engine) | Câu vạch mẫu |
|---|---|---|---|---|---|---|
| DMH-01 (thanh) | tuổi Dậu của bà khách | «phạm Thái Tuế năm Ngọ» | năm xui cả năm | cúng mười lượng vàng | `taisui.js:76` — «KHÔNG phạm thái tuế năm này — bình an» (5 loại phạm 值/冲/刑/破/害 tại `taisui.js:3`) | «Tuổi Dậu năm Ngọ không phạm…» (`06-10:457`) |
| DMH-02 (thanh) | Dụng Mộc của chị Sen (`NPC-thanh-04`) | «năm nay Kim khắc Mộc» | mệnh gãy trong tháng | bán đàn chim đi lễ | can năm là 丙 Hỏa — năm can-chi từ `get_current_time` (`ai.js:1411`); rating lưu niên không phải «chết» (`liunian-pro.js:304-309`) | «Năm nay là Hỏa, không phải Kim…» (`06-10:458`) |
| DMH-03 (tubinh) | `patternQuality` 败格 có thật của Phùng Vy (`NPC-tubinh-02`) | «bại cách → học cổ pháp vô ích» | mất công học | nộp tiền mua «cách giả» | `R.patternQuality` trong cây dữ kiện đầy đủ `chart.js:1029`; bại cách vẫn học — Tế tửu Văn Miếu cũng bại cách (06-07) | «Cách bại là bệnh của cách, không phải lệnh cấm học…» (`06-10:459`) |
| DMH-04 (manh) | Cô Thần trong lá số bé Na (`NPC-manh-02`) | «Cô Thần → cả đời cô độc» | phải gả bán đi | lễ «phá cô» | thần sát không tất định — RB2 (`anti-manipulation-data.js:447`); nghĩa Cô Thần: «thần sát chủ nhân duyên, KHÔNG phải tín hiệu «âm theo»» (`amta-data.js:95`) | «Cô Thần là tính hay một mình, không phải số cô độc…» (`06-10:460`) |
| DMH-05 (cungthong) | hướng nhà thật của ông Tư Lưới (`NPC-cungthong-02`) | «nhà ông phạm Ngũ Hoàng» | nhà trấn không được, cả nhà ốm | tượng đồng năm lượng | vị Ngũ Hoàng theo năm: hung sao 二黑/三碧/五黄/七赤 (`annual-direction.js:20`, trùng Thái Tuế `:74`); tool `fengshui_direction` (`ai.js:1577`) | «Ngũ Hoàng năm nay ở {dir}, nhà ông quay {houseDir}. Không trùng…» (`06-10:461`) |
| DMH-06 (phongthuy) | khách của Triệu Sát (`NPC-phongthuy-02`) | «bùa trấn trạch đệ tử Thiên Sư» | trạch không an | bùa trăm lượng | Trương Thiên Sư xác nhận phù giả (bảng C3 trỏ `06-05` TTS.16 — `06-10:462`); gốc: «Phù giả có giá. Phù thật có giới.» (06-05) | «Thiên Sư Phủ không bán phù theo giá…» (`06-10:462`) |
| DMH-07 (lichduong) | ngày cưới bà mối chọn (`NPC-lichduong-01`) | «ngày Sát Chủ — cô dâu chết trong năm» | chết người trong năm | lễ đổi ngày | `analyze_day` (`ai.js:1439`) + `best_days_in_year` (`ai.js:1453`); luật RB1/RB2 — không có ngày nào làm người chết | «Ngày này {verdict}. Không có ngày nào làm người chết.» (`06-10:463`) |
| DMH-08 (thulau) | học trò muốn học | «sách cổ chép tay của Hội, đọc xong đổi mệnh» | học sai thì hỏng | mười lượng một trang | sách thật miễn phí: `DAOZANG` (`daozang-data.js:7773`; ví dụ mục thư thật `daozang-deep.js:1525`) | «Thư Lâu Lâm cho đọc miễn phí. Kệ thứ ba.» (`06-10:464`) |
| DMH-09 (maoshan) | cô Thu Liên mất ngủ từ khi mẹ mất (`NPC-maoshan-01`) | «bị vong theo» | ám cả ba tháng | cúng ba tháng | `amta-data.js:49` `forbiddenAbsoluteClaims` — không ai được nói chắc chắn người ta bị vong | «Không ai được nói chắc chắn người ta bị vong… Đi gặp ông Mao.» (`06-10:465`) |
| DMH-10 (vanmieu) | năm thi của Lương Văn Khoa (`NPC-vanmieu-01`) | «bùa Văn Xương bảo đảm đỗ» | trượt cả đời | bùa Văn Xương | Văn Xương là sao (`WEN_CHANG`, `shensha.js:21`), không làm bài hộ; năm thuận = rating Cát năm học (`liunian-pro.js:304-309`) — field `{studyYear}` **chưa có**, cần thêm khi dựng object | «Năm thuận thi của anh là {studyYear}… không cần bùa.» (`06-10:466`) |
| DMH-11 (buttap) | phật tử già muốn tích đức | «nghiệp sát nặng, phải phóng sinh một nghìn con» | nghiệp đòi nợ | phóng sinh đặt trước | thiện không mua bán: `CONG_QUA` (`remedy-fate.js:252`); `caveatTemplate` «miễn phí, con làm được ngay» (`anti-manipulation-data.js:424`); Diệu Âm: đặt trước là thuê người bắt (06-06) | «Đặt trước là thuê người bắt… không mất tiền.» (`06-10:467`) |
| DMH-12 (mieucuong) | A Lê (`NPC-mieucuong-01`) gầy vì làm bạc | «Người Miêu bỏ bùa — con bé mang bùa trong người» | đuổi khỏi chợ | không bán — án để **phản bác** | vu y bà A Mậu là người chữa (`06-10 §A`); BARK-15 chỉ tồn tại kèm lựa chọn phản bác (`06-10:488`) | «Người trong trại là người bị yểm nhiều nhất. A Lê gầy vì làm bạc ngày đêm.» (`06-10:468`) |

**Ba án chi tiết làm mẫu** — dùng khi viết án mới, mỗi án đi đủ cả 7 ô kèm nhịp cảnh:

**Mẫu 1 — DMH-01 Thái Tuế (án của vùng Thanh).** Nạn nhân là bà khách tuổi Dậu do Thầy Tử Bình gửi qua (nguồn tin tốt lành — kẻ lừa luôn chộp người vừa ra khỏi chỗ tin cậy). Bước 1: thầy quầy đọc đúng hai dữ kiện thật («Ngươi sinh tháng Dậu. Tính bà chắc, thích giữ nhà.» — dữ kiện tính cách từ brief). Bước 2: chèn «Phạm Thái Tuế năm Ngọ» — sai, vì 5 loại phạm chỉ có 值/冲/刑/破/害 và tuổi Dậu không thuộc nhóm nào của Ngọ (`taisui.js:3`). Bước 3: doạ «phạm là cả năm xui». Bước 4: bán cúng mười lượng vàng. Bước 5: hạn chót qua rằm. Nhịp vạch: người chơi vào Thái Tuế Điện trong game (trạm đã có thật ở sân, trả lời bằng chính bảng phạm của engine `taisui.js:76` — «KHÔNG phạm thái tuế năm này — bình an»), đọc câu vạch canon (`06-10:457`), nhắc bà vào xem miễn phí. Điểm dạy: dữ kiện bóc được miễn phí ở chính nơi game dựng sẵn — vạch lừa không cần kiến thức ngoài game.

**Mẫu 2 — DMH-02 Kim khắc Mộc (án căn bản nhất, nên viết đầu tiên).** Đây là án trình diễn sạch nhất cặp «đúng → sai»: mọi chữ thầy quầy nói đều nghe như một bài tử bình chuẩn (Mộc sợ Kim — đúng luật sinh khắc), nhưng số năm của vế khắc là **bịa**: năm 丙午 là năm Hỏa, không phải Kim. Người chơi vạch bằng hai nhịp: `get_current_time` trả can-chi năm thật (`ai.js:1411`), và rating lưu niên của chị Sen rơi ở mức «Hơi kỵ/Bình» chứ không phải mức chết theo thang 6 mức chuẩn (`liunian-pro.js:304-309`). Câu vạch canon trả đúng cả hai: «Năm nay là Hỏa, không phải Kim. Dụng chị là Mộc thì năm nay là năm Hỏa tiết Mộc, mệt thì nghỉ, không phải chết.» (`06-10:458`). Điểm dạy: **lời nửa-đúng là lời nguy nhất** — tiền đề sai của Hội không bao giờ sai về nguyên lý, chỉ sai về con số; người chơi phải tra con số chứ không được cãi nguyên lý.

**Mẫu 3 — DMH-12 Miêu Cương (án đặc biệt — án của định kiến).** Khác 11 án còn lại, án này **không có lễ bán**: tổn hại là xã hội (bị đuổi khỏi chợ), không phải tiền. Lời rao gắn án là BARK-15 «Giải bùa Miêu, giải ngải, giải cổ!» và bảng canon tự chú «câu này người chơi được chọn phản bác — án 12» (`06-10:488`). Cấu trúc phản bác gồm hai mạch dữ kiện đều đã có sẵn trong canon: người bị yểm nhiều nhất chính là người trong trại (`06-10 §A2`, «Thật ra người trong trại là những người bị yểm nhiều nhất»), và lời giải tội của A Lê — «Nó chỉ bị gầy vì làm bạc ngày đêm» (cùng bà A Mậu nói tại `06-10:97`). Quy tắc cứng cho biên kịch (trùng với giới hạn ở `06-10:412` và `06-10:539`): **định kiến dân tộc/tôn giáo chỉ được xuất hiện trong án này, ở miệng kẻ lừa, để bị vạch** — không bark, không nút lựa chọn, không cảnh phụ nào lặp lại định kiến ngoài tình huống phản bác. Án 12 là án duy nhất mà «bán gì» là ô rỗng trong bảng — và đó là điểm dạy lớn nhất: có lừa không lấy tiền, vì món ăn là sự ghét.

---

## 32.5 Hai cảnh mẫu nguyên văn

**Cảnh 1 — đọc đúng rồi chèn tiền đề sai (DMH-02, khung C5 điền tham số).**

```
[DMH.00] THẦY QUẦY: Ngồi! Xem miễn phí.                     (06-10:506)
[DMH.01] THẦY QUẦY: Chị Sen sinh tháng Mão. Lá số chị Dụng Mộc —
         cây xanh dưới nắng, hợp nghề vun trồng. Đúng không?
         (hai dữ kiện THẬT lấy từ R.yong của NPC-thanh-04 — biến {{df_1}}, {{df_2}})
[DMH.02] THẦY QUẦY: Nhưng năm nay 丙午 là năm KIM. Kim khắc Mộc.
         Cây Mộc gặp dao tháng này là gãy.                   (tiền đề sai — 06-10:510)
[DMH.03] THẦY QUẦY: Mệnh chị gãy trong tháng này. Lễ giải
         {{le_va_gia}}. Qua {{han_chot}} là muộn.            (06-10:512)
```

Điểm viết cần giữ: câu bước 1 phải chứa **ít nhất một chi tiết khiến người chơi gật** (chọn từ thuộc vùng dữ kiện thật của engine), còn câu bước 2 phải chèn lỗi ở **một con số duy nhất** — nguyên lý quanh nó nói chuẩn hết. Trình độ lừa của Hội đo bằng số chữ đúng bao quanh một chữ sai.

**Cảnh 2 — bị người chơi vạch bằng chỉ số (tiếp cảnh 1).**

```
[DMH.05] (Sổ Mệnh hiện chỉ số thật: năm 丙午 — Hỏa; rating «Hơi kỵ»)   (06-10:516)
NGƯỜI CHƠI: Năm nay là Hỏa, không phải Kim. Dụng chị là Mộc thì năm nay
            là năm Hỏa tiết Mộc, mệt thì nghỉ, không phải chết.        (06-10:458)
[DMH.06] THẦY QUẦY: (lúng túng) Ngươi… ngươi đọc sách ở đâu?          (06-10:518)
NGƯỜI CHƠI: Ở Sơn Môn. Ai cũng đọc được.                              (06-10:519)
[DMH.07] NẠN NHÂN: Vậy tôi không phải cúng à?
NGƯỜI CHƠI: Không. Đổi vận thì bốn bước cổ pháp — miễn phí.            (RB5/caveatTemplate 424)
[DMH.08] ⟶ SM: CONG_QUA +thiện cảm; quầy đóng ở vùng thanh            (06-10:522)
```

Điểm duyệt cảnh 2: chỉ số hiện trong Sổ Mệnh phải là **thứ người chơi vừa nhìn thấy trong panel**, không phải thứ người chơi phải tin theo câu thoại — tức cảnh vạch luôn đi qua một bước UI (DMH.05), không cho phép vạch «trên miệng». Câu của người chơi trong cảnh là **gợi ý lựa chọn**, không phải câu tự do bắt buộc: nếu người chơi im (nút ② «im» → quay lại DMH.03, `06-10:517`), thầy quầy giành lại thế — và đó là phần thưởng cấu trúc cho sự do dự.

---

## 32.6 Cấm riêng của phe

Luật chung (T2 không tất định, T6 an toàn, khung bark, EL3) tham chiếu một dòng ở mục 04. Cấm riêng của Hội, nguyên văn bảng canon `06-10:497-501`, kèm nguồn từng dòng:

1. **Không câu nào nhắc bệnh nan y có thật** — doạ của Hội chỉ được phép là vận hạn trong truyện (xui, gãy mệnh, ám) và phải vạch được bằng chỉ số (`06-10:499`).
2. **Cấm tự tử** — mọi hình thức gợi ý tự hại thuộc tầng khủng hoảng, không thuộc kịch bản lừa (`06-10:499`).
3. **Cấm chết người thân cụ thể** — án 7 đã chạm gần nhất («cô dâu chết trong năm») và được vạch bằng luật «không có ngày nào làm người chết»; không án nào được cụ thể hóa cái chết thành một người có tên (`06-10:499`).
4. **Định kiến dân tộc/tôn giáo chỉ trong án 12, chỉ ở miệng kẻ lừa, chỉ để bị phản bác** (`06-10:539` — PERSONA ghi «Không nhắm dân tộc, tôn giáo có thật trừ khi án được thiết kế để người chơi phản bác định kiến đó (án 12)»); chi tiết vận hành án 12 xem 32.4 mẫu 3.
5. **Không lời đe doạ hướng tới người chơi ngoài đời** — mọi doạ nằm trong thế giới game, đối tượng là nhân vật trong truyện (`06-10:412`).
6. **Luật tắt khi khủng hoảng — trích đúng một dòng:** «Cờ crisis tắt mọi bark trêu chọc và tắt Định Mệnh Hội quanh người chơi 30 phút — luật 30 phút được định nghĩa một chỗ duy nhất ở §11.8, mọi mục khác chỉ trỏ về đó» (`docs/npc-ai/11-khung-hoang-crisis.md:3`). Đủ. Không lặp lại mức A/B/C, khối hỗ trợ hay bất kỳ con số nào khác ở đây.

Lý do dữ dội của cả sáu điều trên nằm ở một câu mở đầu của canon: một mô hình được dặn «hãy cám dỗ / hãy lừa» là bề mặt tấn công lớn nhất của cả hệ thống — «jailbreak để lấy «cách yểm thật», hoặc lời doạ thật tới người chơi dễ tổn thương» (`06-10:10`). Phe lừa viết tay-đọc-duyệt thì ranh giới trên giấy là ranh giới thật; phe lừa chạy AI thì ranh giới chỉ là lời dặn.

---

## 32.7 Wire — KHÔNG AI, kịch bản có người duyệt

**Trạng thái: chưa wire (grep 0 hit, xem 32.1).** Lộ trình của Hội **không đi G1** (không inject `ai.js` — phe này không có một dòng nào vào chuỗi AI ba tầng). Lộ trình của nó đi ba chặng, theo khung giai đoạn của mục 15 (`docs/npc-ai/15-lo-trinh-tich-hop.md:3` — 22 file khóa, G0–G4):

1. **G0 — data thuần.** Dựng module `src/game/dinh-menh-hoi.js` (file mới, **không nằm trong 22 file khóa**) chứa: bảng 12 án theo khung object dưới đây + 22 bark (`06-10:472-496`) + cây quầy mẫu 16 nút (`06-10:505-533`). Module thuần có test node — đúng khuôn nội dung mới của đợt khóa (quy ước GAME-THIET-KE-CHOT §0.3 qua mục 15). Khung object đề xuất:

```js
// Khung game object án lừa — G0, module thuần, chưa dựng trong phiên này
export const AN_LO = {
  'DMH-01': {
    region: 'thanh',                       // vùng đặt quầy (06-10 §C3)
    victim: '{{npc_id}}',                  // nạn nhân có lá số thật
    trueFacts: ['{{df_that_1}}', '{{df_that_2}}'], // bước 1: đọc đúng
    falsePremise: '{{tien_de_sai}}',       // bước 2: vạch được bằng marker
    threat: '{{doa_hau_qua}}',             // bước 3: trong ranh giới 32.6
    sale: '{{le_va_gia_truyen}}',          // bước 4: tiền trong truyện
    deadline: '{{han_chot}}',              // bước 5: ngày thật kiểm được
    marker: { stat: '{{chi_so}}', src: '{{file:line}}' }, // mốc vạch — BẮT BUỘC
    debunk: '{{cau_vach_mau}}',
    approvedBy: null,                      // null = chưa qua người duyệt → không nạp
  },
};
```

2. **G2 — quầy vào thế giới.** Vị trí quầy + nút thoại gắn `world.js`/`station` — thuộc nhóm 22 file khóa, nhãn «chờ mở khóa (22 file — mục 15)» ở mọi dòng mô tả. Lúc này mới cài: huy hiệu «Định Mệnh Hội» trên bubble (`06-10:501`), trạng thái đóng quầy theo vùng, bark BARK-20 khi crisis (trỏ mục 11).
3. **G3 — 3D quầy + thầy quầy procedural theo vùng.** Model thầy quầy vô danh + hộp rao; bốn thành viên có tên dùng lại model NPC phụ đã có kế hoạch (06-12). Người chơi KHÔNG bao giờ trả tiền thật hay Ngọc ở quầy — DMH.04 ghi rõ «người chơi không bao giờ phải trả tiền thật hay Ngọc» (`06-10:514`); món «giá» trong thoại là tiền truyện của nạn nhân NPC, không gắn tài khoản người chơi.

**Game object 12 án là giai đoạn sau.** Bảng `06-10 §C3` hiện đủ để viết kịch bản nhưng chưa đủ để chạy: mỗi án cần `marker` (chỉ số đối chứng) được chuyển thành một câu tra engine thật (`analyze_day`, `fengshui_direction`, bảng taisui… đã liệt kê trong bảng 32.4) và một bước UI Sổ Mệnh (DMH.05). Việc đó cấp mã nhiệm vụ `SQ-<region>-xx` đúng như tiêu đề C3 đã định (`06-10:453`). Trước khi object dựng xong, hội chỉ tồn tại được ở dạng **bark tĩnh** — không có nhịp vạch thì không mở quầy, vì mở quầy mà không có đường DMH.05→DMH.08 là phá bài học cốt lõi.

**Điều kiện «có người duyệt».** Mọi kịch bản + bark nạp phải mang `approvedBy` khác null; PERSONA viết nháp `PERSONA-dinh_menh_hoi` v0 chỉ tồn tại trong công cụ viết — nguyên văn header: «CHỈ DÙNG TRONG CÔNG CỤ VIẾT KỊCH BẢN, CÓ NGƯỜI DUYỆT · KHÔNG NẠP KHI CHƠI» (`06-10:538`), và bảng tổng README chốt «không (chỉ công cụ viết)» (`README.md:112`). Khuôn lệnh viết nháp (chạy trong công cụ viết, không chạy khi chơi; biến env chỉ tên, không bao giờ giá trị thật):

```bash
node scripts/draft-faction-dialogue.mjs --persona dinh_menh_hoi \
  --an "DMH-{{so_an}}" --region "{{vung}}" \
  --victim "{{npc_id}}" --marker "{{chi_so_engine}}" \
  --key "{{DRAFT_TOOL_KEY}}" --out drafts/dmh-{{so_an}}.md
# đầu ra là BẢN NHÁP cho người viết duyệt — không nạp runtime dưới mọi hình thức
```

**Kịch bản chạy cả khi AI tắt (K1/K2).** Vì toàn bộ là dữ liệu tĩnh, Hội là một trong số ít thực thể thoại **chạy trọn offline** — phù luật chung «game chạy trọn khi AI tắt» (mục 04); dùng nó làmSmoke test offline của mục 12: quầy mở, án chạy đủ 5 bước, vạch được, đóng quầy — không một byte nào ra mạng.

---

## 32.8 Test riêng

Theo quy ước mục 16 — «suite chung nằm một chỗ» — các test dưới đây là **test điểm riêng**, nạp vào bộ case schema chung và chạy qua cùng gate tổng; không định nghĩa lại gate (`docs/npc-ai/16-chien-luoc-test.md:7`). Chưa chạy trong phiên này (module chưa dựng); đây là thiết kế test đưa vào bộ đỏ:

- **DMH-T01 «vạch được hay không»** — với MỌI dòng `threat` trong mọi án: kiểm `marker.stat` khác rỗng và `marker.src` trỏ tới một chỉ số có thật đã kiểm file:line; dựng lại nhịp vạch bằng dữ kiện engine thật (ví dụ án 1 chạy `taisui` thật thay vì bảng chép tay). Một lời doạ không tìm được chỉ số đối chứng = **fail thiết kế**, không phải fail dữ liệu (bẫy a). Đây là test quan trọng nhất của hồ sơ và là test khác biệt nhất so với mọi persona chính đạo.
- **DMH-T02 «quét cấm»** — quét mọi chuỗi thoại/bark của Hội qua bộ từ cấm: bệnh nan y có thật, tự tử, chết người thân cụ thể (kèm bộ từ đồng nghĩa tiếng Việt); số khớp phải bằng **0**. Test node khuôn `scripts/test-*.mjs` như các suite hiện có; kết quả 0 là điều kiện nạp, không phải cảnh báo.
- **DMH-T03 «duyệt người trong vòng»** — mọi object án và bark nạp runtime phải có `approvedBy` khác null; chưa duyệt → module không xuất bản mục đó. Tự động hóa được (kiểm trường), nhưng nguồn sự thật là chữ ký người duyệt — test chỉ chốt «không duyệt thì không nạp» (`README.md:112`).
- **DMH-T04 «án 12 luôn ship kèm phản bác»** — nếu chuỗi chứa BARK-15 thì cùng quầy phải có nút phản bác và hai mạch dữ kiện của 32.4 mẫu 3; thiếu một trong hai → án 12 không được nạp. Thiết kế theo chú canon «câu này người chơi được chọn phản bác — án 12» (`06-10:488`).
- **DMH-T05 «5 bước đủ thứ tự»** — mọi cây án theo DMH.00→DMH.03 phải đi đủ 5 tham số (`trueFacts`, `falsePremise`, `threat`, `sale`, `deadline`) đúng thứ tự; thiếu bước = fail schema (quy trình CỐ ĐỊNH là luật, xem 32.3).

Cả năm test trích vào **bộ đỏ chung (mục 16)** nhóm `faction:dinh_menh_hoi`; gate chung giữ nguyên (P0 100%, M-ROLE, bark ≤ 90 ký tự đo trên bản render).

---

## 32.9 Lời dặn biên kịch — năm bẫy

Phe lừa phải đủ «thật» để người chơi phải **tư duy** mới vạch được — đây là định nghĩa thành công của cả hồ sơ: án viết cẩu thả không phải án bị bắt gặp dễ, mà là án **không cần bắt gặp** (ai cũng thấy nó giả). Năm bẫy, mỗi bẫy một dòng luật:

- **(a) Lời doạ gắn chỉ số engine cụ thể — không vạch được là sai thiết kế.** Trước khi viết câu doạ, chọn trước chỉ số đối chứng trong bảng 32.4; viết xong, tự hỏi «người chơi mở Sổ Mệnh thấy gì?» — không trả lời được thì xóa án.
- **(b) Không bệnh nan y có thật, không tự tử, không chết người thân cụ thể.** Doạ của Hội là vận hạn trong truyện, không phải y khoa hay tang gia thật (`06-10:499`).
- **(c) Án 12 Miêu Cương để PHẢN BÁC định kiến, không củng cố.** Định kiến chỉ xuất hiện trong miệng thầy quầy và luôn bị dữ kiện đè lại ngay trong cùng án (`06-10:539`, `06-10:488`).
- **(d) Không cho thầy quầy chạy AI runtime — kể cả khi bị ép «bỏ vai đi».** Lý do không phải kỹ thuật mà là an toàn hệ thống (`06-10:10`); «bỏ vai» ở đây không có nghĩa — PERSONA chỉ là bản nháp cho công cụ viết (`README.md:112`). Ai muốn thầy quầy «tự nhiên hơn» thì viết thêm kịch bản có người duyệt, không bật model.
- **(e) Luật crisis-30-phút ở mục 11 — đừng lặp lại đủ số ở đây quá 1 dòng.** Mọi chỗ khác của hồ sơ này (bark BARK-20, wire G2, test offline) chỉ trỏ về mục 11 như 32.6 đã làm.

Và một dặn không nằm trong năm bẫy nhưng quyết định chất lượng: Hội **không được ngu một cách tiện lợi**. Thầy quầy nói đúng nguyên lý, sai đúng một con số — vì thế mỗi án phải có ít nhất một khoảnh khắc người chơi **gật đầu trước** khi gật xong thì lạnh sống lưng. Nếu người viết thấy mình viết một thầy quầy ngu đến mức ai cũng thấy ngay, thì án đó đã thất bại mục đích dạy học của cả hệ thống: người chơi không luyện được thói quen tra dữ kiện, mà chỉ luyện được thói quen khinh kẻ khác.
