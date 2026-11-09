# 02 · Phần 03 — Địa lý: tám vùng lõi của Huyền Giới

> Tám vùng đã có trong code (`terrain.js › REGIONS`). Phần này bổ sung **khí hậu, cảnh vật, dân cư, phong tục, ẩm thực, nghề, truyền thuyết, đường nối** — để tài liệu 07 (công trình), 06 (NPC), 12 (âm thanh) dựng đúng.
> Hành và cung của vùng lấy theo 01 › 1.2.5. Khoảng cách tính thẳng giữa tâm vùng (mét, theo tọa độ chuẩn).

## 3.0 Mẫu thẻ vùng (dùng cho cả phần 04, 05)

| Mục | Nội dung |
|---|---|
| **Thẻ vùng** | id, tâm, kiểu địa hình (`kind`), độ cao (`h`), bán kính (`r`), cung – hành, dân số lore, phe chính, công trình đã có |
| **Khí hậu** | đặc điểm + **hệ số thời tiết** so với Huyền Thành (01 › 1.3.8) |
| **Địa hình** | mô tả để đội level-art dựng |
| **Thực vật · động vật** | không có sinh vật thù địch (T3) |
| **Tài nguyên · dược thảo** | gắn hành theo `tcm › WUX_ZANG` |
| **Khu dân cư** | tên, dân số lore, chức năng |
| **Phong tục · lễ hội** | việc dân làm thường ngày và lễ riêng |
| **Giọng nói** | phương ngữ và câu mẫu cho NPC |
| **Ẩm thực · nghề** | món đặc sản, nghề thủ công |
| **Truyền thuyết** | 2–3 chuyện kể (mở mục codex) |
| **Đường nối** | đường bộ, đò, hạc; khoảng cách |
| **Móc nối gameplay** | hoạt động, nhiệm vụ phụ `SQ-<region>`, mục codex |

Quy tắc chung về dân số: **dân số lore** là con số người kể trong thế giới (cho cảm giác quy mô). Số NPC thật hiện trên bản đồ do tài liệu 06/13 quyết theo hiệu năng, thường **1 NPC đại diện ~ 100–200 dân lore**.

---

## 3.1 Huyền Thành `thanh` — trung cung

### Thẻ vùng

| Mục | Giá trị |
|---|---|
| Tâm · kiểu | (0, 0) · `city` (cao nguyên phẳng) · cao 0 m · bán kính 180 m |
| Cung · hành | Trung cung · **Thổ** |
| Dân số lore | ~12.000 (đông nhất Huyền Giới) |
| Phe chính | FAC-001 Sơn Môn & Hội Đồng Tam Tài; FAC-020 Thương Hội; FAC-022 Hội Chiêm Gia; FAC-026 Mộc Tượng Đường; FAC-032 Tiên Y Phường |
| Đã có trong code | Sơn Môn (`court.js`, `sect.js`), Bàn Thầy, Bàn Hợp Hôn (−48, 8), Chính Điện Tam Thanh, Vận Mệnh Các, Thái Tuế Điện, Tàng Y Các, Hồ Sen, Trà Thất, Thiên Bàn trên trời |

### Khí hậu

- Ôn hòa, bốn mùa rõ nhưng dịu; ít biến thiên nhất đại lục (Thổ ở giữa «hòa» các hành).
- **Hệ số thời tiết:** dùng nguyên ma trận 01 › 1.3.8 (đây là vùng chuẩn).
- Gió: mùa đông gió bấc từ Thư Lâu Lâm xuống; mùa hạ gió nồm từ Cùng Thông Hồ lên, mang hơi nước và mùi sen.

### Địa hình

- Cao nguyên phẳng hình tròn, đồi trung tâm có Sơn Môn và Bàn Đài ở phía Bắc thành (Bàn treo ở 0, 78, −80).
- Sông **Huyền Hà** ôm phía Tây và Nam thành (`RIVER` đi qua −230, 60 → −160, 220 → 40, 300) — thành có hai bến đò: bến Tây và bến Nam.
- Phía Nam, trên không: **Thiên Bàn Đảo** (0, 300, cao 520 m) — bóng của đảo đổ xuống phố Nam vào buổi trưa hè.
- Phía Bắc sau Sơn Môn: núi **Hậu Sơn**, lối mòn lên **Am Vân Cốc** (0, −260).

### Thực vật · động vật

- Cây: đa cổ thụ ở quảng trường (cây hẹn hò của dân thành), hòe hai bên đường lớn, sen ở Hồ Sen, mai trắng trước Thái Tuế Điện.
- Động vật: chim sẻ, bồ câu ở mái Sơn Môn, **hạc** đậu trên nóc (mở khóa Tri Âm), mèo chợ, chó đá gác cổng (LORE-464), cá chép trong Hồ Sen.
- Không có thú hoang trong thành.

### Tài nguyên · dược thảo

| Tài nguyên | Hành | Nguồn | Dùng |
|---|---|---|---|
| Đất sét vàng bờ sông | Thổ | bến Tây | gạch, gốm thô, tượng đất |
| Củ mài (sơn dược) mọc ven Hậu Sơn | Thổ / Thủy | Hậu Sơn | món cháo bổ tỳ (`WUX_ZANG.土.nourish`) |
| Sen (hạt, tâm sen, lá) | Hỏa / Thổ | Hồ Sen | chè hạt sen, trà tâm sen (`WUX_ZANG.火.nourish`) |
| Táo đỏ (cây trồng trong sân nhà) | Thổ | các ngõ | nấu chè, bổ tỳ |
| Muối mây | Thủy | thương nhân mang từ rìa biển mây | hàng trao đổi với Miêu Cương (HIS-066) |

### Khu dân cư

| Tên | Dân số lore | Mô tả |
|---|---|---|
| **Phố Sơn Môn** (bắc thành) | ~1.500 | Nhà đệ tử, thầy, quán trà, hiệu sách. Yên tĩnh, có chuông giờ. |
| **Chợ Trung Tâm** (quảng trường) | ~3.000 (cả buôn bán) | Chợ lớn nhất đại lục; sạp thầy bói, quầy Thương Hội, đình Truyền Đạo |
| **Phố Thợ** (đông thành) | ~2.500 | Mộc Tượng Đường, lò gốm, xưởng đồng, Tiên Y Phường |
| **Xóm Bến** (tây và nam thành, ven Huyền Hà) | ~2.000 | Người lái đò, người đánh cá, kho hàng |
| **Phường Khách** (nam thành) | ~1.000 + khách | Nhà trọ Du Phương, nhà tắm công, chuồng ngựa, trạm hạc |
| **Làng Ngoại Ô** (rìa cao nguyên) | ~2.000 | Ruộng rau, vườn táo, trại nuôi ong |

### Phong tục

- **Ngẩng đầu buổi sớm:** người Huyền Thành ra khỏi nhà là ngẩng nhìn Thiên Bàn một lần — thói quen như chào hỏi. Từ khi Bàn nứt, nhiều người **tránh nhìn**, coi là điềm xấu; NPC dạng này nói «đừng ngẩng lên, xui».
- **Chiếu chung:** việc lớn của phường thì trải chiếu ở sân đình bàn chung (theo hương ước HIS-018). Không có quan; có **trưởng phường** do dân cử, nhiệm kỳ một Hoa Giáp nhỏ (12 năm).
- **Ghi sổ công quá ở chợ:** ai làm việc tốt (nhặt được của rơi trả lại, giúp người ngã) thì tự ghi vào Sổ Công Quá ở chợ — không ai kiểm tra, cuối năm đọc tổng (HIS-046).
- **Không mặc cả với người bán thuốc:** tục lệ «thuốc không trả giá», ai mặc cả thuốc bị chê là «mặc cả với mạng người».

### Lễ hội địa phương

| Lễ | Thời | Nội dung |
|---|---|---|
| **Lễ Ngẩng Đầu** | giờ Lập Xuân | Cả thành ra quảng trường cùng ngẩng nhìn Bàn khi tượng Thái Tuế trị niên được rước lên bệ (LORE-402) |
| **Chợ Xuân** | 15 ngày sau Lập Xuân | Chợ phiên lớn nhất năm; các vùng mang đặc sản tới |
| **Đọc Sổ Trừ Tịch** | đêm 30 Tết | Trưởng phường đọc to tổng công – quá cả năm; không nêu tên ai |
| **Hội Đèn Huyền Hà** | rằm tháng Giêng | Thả đèn trên sông Huyền Hà từ bến Tây (LORE-439) |

### Giọng nói

- Giọng **chuẩn mực, mềm**, nhiều từ Hán Việt vì gần Sơn Môn. Hay dùng «thưa», «dạ», gọi người lạ là «quý khách» hoặc «đạo hữu» (nếu mặc áo tu).
- Câu mẫu:
  - Bán hàng: «Quý khách xem thong thả, giá ghi trên thẻ, không nói thách.»
  - Dân phố: «Ngày Mậu Kỷ chợ đông, đi sớm kẻo hết bánh đa.»
  - Người già: «Hồi Bàn chưa nứt, sáng nào cũng ngẩng lên chào. Giờ thì… thôi.»

### Ẩm thực

- **Cháo sơn dược hạt sen** (Thổ – Hỏa): món sáng của người Huyền Thành.
- **Bánh đa Bàn** — bánh tròn ba vòng, giữa có lỗ, mô phỏng Thiên Bàn; từ khi Bàn nứt, lò bánh cố ý **bẻ đôi rồi gắn mật** («bánh nứt dán vàng»), thành món mới được trẻ con thích.
- **Trà Sơn Môn**: trà xanh ướp hoa sen Hồ Sen (đã có Trà Thất).
- **Đậu phụ chợ Trung Tâm** chiên vàng chấm tương — món chay rẻ nhất cho khách hành hương.

### Nghề thủ công

- **Gốm vàng bến Tây** (đất sét Thổ, men vàng đục).
- **Đồ gỗ Mộc Tượng Đường**: bàn thầy, bồ đoàn, la bàn gỗ (phần kim do Phong Thủy Viên lắp).
- **Áo tu ngũ hành** (Tiên Y Phường, Tàng Y Các — 5 bộ, `cosmetics.js`).
- **Khắc bia**: thợ khắc chữ cho bia hương ước, bia Cảm Ứng, bia khoa cử.

### Truyền thuyết địa phương

1. **Hòn đá Sơ Tổ** (HIS-014): ai ngồi lên hòn đá dưới Bàn ba hơi thở mà không nghĩ gì sẽ «nghe thấy Bàn quay». Trẻ con thử mãi không được. → mở LORE-342 (Sơn Môn).
2. **Ông lái đò không lấy tiền ngày rằm:** một ông lái đò ở bến Tây cả đời không lấy tiền đò ngày rằm. Khi ông mất, ngày rằm nào sông cũng lặng hơn thường. → mở LORE-348 (Huyền Hà).
3. **Bánh nứt dán vàng:** chuyện bà bán bánh nghĩ ra món bánh nứt sau Đêm Giao Vận, câu cửa miệng «nứt rồi thì dán, có sao đâu» — câu thoại nền cho chủ đề hàn Bàn. → mở LORE-340.

### Đường nối

| Tới | Khoảng cách | Đường |
|---|---|---|
| Am Vân Cốc | 260 m | lối mòn Hậu Sơn, bậc đá dốc |
| Thư Lâu Lâm | 700 m | **Bắc Lộ** — đường đá thẳng qua rừng thông |
| Phong Thủy Viên | 820 m | **Tây Lộ** — qua bến Tây, vượt Huyền Hà bằng cầu đá |
| Lịch Đường | 820 m | **Đông Lộ** — đường cái bằng phẳng, nhiều quán |
| Tử Bình Phong | 835 m | Tây Bắc lộ — dốc dần, đoạn cuối bậc đá |
| Manh Phái Cốc | 825 m | Đông Bắc lộ — xuống thung lũng |
| Trích Thiên Đỉnh | 849 m | Tây Nam lộ, hoặc **đò ngược Huyền Hà** từ bến Tây |
| Cùng Thông Hồ | 877 m | Đông Nam lộ, hoặc **đò xuôi Huyền Hà** từ bến Nam |
| Văn Miếu | 1.900 m | **Nam Lộ** (đường đá chính từ cổng Nam, `landmarks.js › roadPath`) |

### Móc nối gameplay

- Hub của mọi tuyến; mở đầu `MQ-P-xx`; quầy Định Mệnh Hội đầu tiên người chơi gặp nằm ở góc chợ phía Đông.
- Nhiệm vụ phụ gợi ý `SQ-thanh-xx`: chuộc lại bánh xe gỗ Bàn Thầy bị mối; minh oan cho sạp thầy bói treo bảng thật; giúp bà bán bánh nứt mở thêm lò.
- Codex: LORE-341 → 347.

---

## 3.2 Tử Bình Phong `tubinh` — Càn, Kim

### Thẻ vùng

| Mục | Giá trị |
|---|---|
| Tâm · kiểu | (−620, −560) · `peak` · đỉnh cao 420 m · bán kính 230 m |
| Cung · hành | Càn ☰ · **Kim** |
| Dân số lore | ~900 (thầy, đệ tử, người phục vụ, xóm chân núi) |
| Phe chính | FAC-001 (chi Tử Bình), FAC-013 (ẩn sĩ) |
| Đã có trong code | Sảnh Cách Cục (−521, −538); Lão Quân Điện (cửa −564, −510) |

### Khí hậu

- Khô, gió mạnh, trời trong. Mùa thu đẹp nhất: trời xanh thẫm, nhìn rõ tới Phong Thủy Viên.
- Mùa đông có **sương kiếm** (sương muối gai bạc trên cỏ đỉnh núi).
- **Hệ số thời tiết** (so với Huyền Thành): quang +20%, mưa −30%, gió +40%; đông có tuyết mỏng trên đỉnh (10% ngày Thủy).

### Địa hình

- Núi đá granit xám trắng, sống núi sắc như lưỡi kiếm chạy Tây Bắc – Đông Nam. Bình đài trên đỉnh (`PEAK_PAD = 125`) đặt quần thể sảnh.
- Sườn Đông thoải có bậc đá «**Thập Can Đạo**» — mười đoạn bậc, mỗi đoạn khắc một thiên can, lên tới đỉnh.
- Sườn Tây dựng đứng, nhìn xuống Phong Thủy Viên; có hang nhỏ «**Am Tam Nguyên**» đổ nát (HIS-038).

### Thực vật · động vật

- Thông lùn, bách xù mọc kẽ đá; cỏ tranh bạc; hoa cúc dại vàng mùa thu.
- Đại bàng làm tổ vách Tây; dê núi hiền (đứng nhìn người chơi, không chạy); sóc đá.

### Tài nguyên · dược thảo

| Tài nguyên | Hành | Dùng |
|---|---|---|
| Đá granit trắng | Kim | bia, bậc, tượng |
| Bách hợp núi | Kim | dược thảo nhuận phế (`WUX_ZANG.金.nourish`) |
| Hạnh nhân dại | Kim | ăn vặt, dược nhuận |
| Cúc vàng | Kim / Mộc | trà cúc, thanh can |
| Quặng thiếc nghèo | Kim | thợ chuông dùng (pha đồng) |

### Khu dân cư

| Tên | Dân số lore | Mô tả |
|---|---|---|
| **Đỉnh Cách Cục** | ~300 | Sảnh, Lão Quân Điện, thư phòng thầy, tăng xá đệ tử |
| **Xóm Thập Can** (chân bậc) | ~400 | Quán trà, người khuân vác, thợ đá |
| **Làng Bạch Thạch** (chân núi Tây Nam) | ~200 | Thợ khắc đá, nuôi dê |

### Phong tục

- **Mười bậc mười lời**: đệ tử lên Thập Can Đạo phải đọc một câu ứng với mỗi can (Giáp: «khởi đầu», Ất: «mềm mà dai»…). Đọc sai không bị phạt; quy ước để luyện trí nhớ.
- **Khảo cách**: muốn thành thầy Tử Bình phải qua khảo «định cách cục» ba lá số khó trước hội đồng sảnh (gắn Sảnh Cách Cục).
- **Ăn ít, nói ít**: người trên đỉnh ăn hai bữa, tối ăn nhẹ — giữ đầu óc «như kim» (sắc, gọn).

### Lễ hội

- **Lễ Định Cách** (tiết Thu Phân): đệ tử mới được trao bảng gỗ khắc cách cục của chính mình. Trong game: người chơi nhận **Mệnh Cách** của mình được khắc gỗ (`patternQuality.quality`).
- **Vía Lão Quân** (rằm tháng Hai âm lịch): lễ ở Lão Quân Điện, đọc *Đạo Đức Kinh* chương một.

### Giọng nói

- Gọn, chính xác, hay dùng từ chuyên môn. Người núi gọi nhau bằng **can sinh**: «này anh Canh», «chị Ất ơi» (theo can ngày sinh).
- Câu mẫu:
  - Thầy: «Đừng vội phán. Định cách trước, rồi mới bàn hỷ kỵ.»
  - Thợ đá: «Đá trắng dễ khắc, khó giữ. Như lời nói vậy.»
  - Đệ tử: «Hôm nay bậc thứ bảy — Canh — nhớ là "cứng mà biết sửa".»

### Ẩm thực

- **Canh bách hợp hạnh nhân** (Kim): ngọt thanh, ăn sau buổi khảo.
- **Bánh kiều mạch nướng đá**: bánh mỏng nướng trên phiến đá nóng.
- **Trà cúc núi**.

### Nghề

- Khắc đá (bia, bảng cách cục bằng đá cho người giàu, bằng gỗ cho người thường — **cùng chữ**).
- Đúc chuông nhỏ (pha thiếc núi): chuông gió treo hiên các sảnh khắp Huyền Giới.

### Truyền thuyết

1. **Bảy lá số không ai định được**: tương truyền có bảy lá số «lạ» đến mức các thầy không định được cách; họ khắc lên vách Tây và để đó. Lore cho `Dị Cách` (`BR-DK-xx`): người chơi Dị Cách được mời lên xem vách. → LORE-349.
2. **Chuông không đánh mà kêu**: đêm Bàn nứt, mọi chuông gió ở Tử Bình Phong kêu cùng lúc dù không có gió. Thợ chuông nói do «kim gặp kim» (Bàn là vật Kim chiếu xuống vùng Kim).
3. **Dê núi biết đường**: người lạc ở Tử Bình Phong cứ đi theo dê, dê luôn xuống đúng Xóm Thập Can — lời khuyên dân gian «đi theo cái hiền».

### Đường nối

| Tới | Khoảng cách | Đường |
|---|---|---|
| Huyền Thành | 835 m | Tây Bắc lộ |
| Phong Thủy Viên | 595 m | đèo Bạch Thạch (Nam) |
| Thư Lâu Lâm | 636 m | đường mòn rừng thông (Đông) |
| Tạng Địa | 1.150 m | **Đèo Cờ Gió** — đường hành hương lên Tây Bắc, mở sau Hồi II |

### Móc nối gameplay

- Sảnh Cách Cục: định cách cục cho khách (đã có). Lão Quân Điện: tụng kinh, giải quẻ.
- `SQ-tubinh-xx`: tìm lại bảng gỗ cách cục của một đệ tử bỏ núi vì tưởng «cách mình xấu»; khảo Thập Can Đạo; chép lại vách bảy lá số.
- Codex: LORE-349, 350.

---

## 3.3 Manh Phái Cốc `manh` — Cấn, Thổ

### Thẻ vùng

| Mục | Giá trị |
|---|---|
| Tâm · kiểu | (640, −520) · `valley` · thung lũng giữa vách cao 300 m · bán kính 230 m |
| Cung · hành | Cấn ☶ · **Thổ** |
| Dân số lore | ~600 (thầy mù, gia đình, người dẫn đường, nông dân) |
| Phe chính | FAC-027 Manh Phái |
| Đã có trong code | Sảnh Tượng Pháp (654, −441) |

### Khí hậu

- Kín gió, ẩm, nhiều sương sớm; mặt trời vào thung lũng muộn (giờ Tỵ mới có nắng), tắt sớm (giờ Thân).
- **Hệ số thời tiết:** sương +50%, gió −50%, mưa phùn +20%. Ánh sáng ngày ngắn hơn hai canh.

### Địa hình

- Thung lũng hình lòng chảo kéo dài Bắc – Nam, hai vách đá vôi xám phủ rêu. Suối **Thính Âm** chảy giữa lũng, nhiều thác nhỏ — mỗi thác **một cao độ tiếng nước khác nhau**.
- Lối vào duy nhất từ phía Nam, có cổng đá **«Nhĩ Môn»** (Cửa Tai).
- Toàn bộ lối đi trong cốc có **lan can dây thừng và đá lát có rãnh** để người mù đi theo — đội level-art phải dựng chi tiết này (nghiệm thu: đi hết cốc bằng cách bám lan can).

### Thực vật · động vật

- Dương xỉ, rêu, cây ngải cứu, hoa mộc (thơm — người mù định hướng bằng mùi).
- Chim họa mi (tiếng hót được thầy mù dùng làm «đồng hồ»), ếch suối, đom đóm mùa hè.

### Tài nguyên · dược thảo

| Tài nguyên | Hành | Dùng |
|---|---|---|
| Ý dĩ trồng ruộng bậc | Thổ | cháo kiện tỳ (`WUX_ZANG.土.nourish`) |
| Gừng núi | Thổ / Hỏa | ấm bụng, nấu trà |
| Ngải cứu | Mộc / Hỏa | xông nhà, gối thơm |
| Hoa mộc | Mộc | ướp trà, định hướng mùi |
| Đất sét xám | Thổ | đồ gốm có gờ nổi (người mù đọc bằng tay) |

### Khu dân cư

| Tên | Dân số lore | Mô tả |
|---|---|---|
| **Làng Thính** (giữa cốc) | ~350 | Nhà thầy mù và gia đình; nhà nào cũng treo chuông gió khác tiếng để nhận biết |
| **Xóm Dẫn** (gần Nhĩ Môn) | ~150 | Người dẫn đường (sáng mắt), quán cho khách |
| **Ruộng Bậc Cấn** (sườn Bắc) | ~100 | Nông dân trồng ý dĩ, gừng |

### Phong tục

- **Hỏi lâu, phán ít:** thầy Manh phái hỏi chuyện khách rất lâu, nghe tiếng, nghe nhịp thở, rồi mới nói — đối lập lối «phán nhanh» (HIS-058). Trong game, thầy Manh phái là **mẫu chuẩn** của «nghe trước khi luận».
- **Khẩu quyết truyền miệng:** không ghi chép. Đệ tử học thuộc theo nhịp gõ mõ. Khẩu quyết lưu trong app ở `bitruyen-data › 盲派口诀` — lore: Thư Lâu chỉ ghi được **phần đã được phép công bố**.
- **Gõ cửa ba tiếng, xưng tên:** vì chủ nhà không thấy, khách luôn xưng tên khi tới.

### Lễ hội

- **Lễ Nghe Suối** (tiết Kinh Trập): cả làng ngồi dọc suối Thính Âm nghe nước lũ đầu mùa, đoán mùa màng theo tiếng — tập tục «xem tượng bằng tai».
- **Ngày Tạ Người Dẫn** (Thanh Minh): thầy mù tặng quà cho người dẫn đường của mình.

### Giọng nói

- Chậm, rõ, nhiều hình ảnh («nghe như tiếng mõ gỗ mục», «lá số con có mùi mưa»). Hay dùng **tượng** của can chi: Giáp là «cây lớn», Quý là «mưa nhỏ».
- Câu mẫu:
  - Thầy mù: «Con nói tiếp đi. Thầy còn chưa nghe thấy con muốn hỏi gì thật.»
  - Người dẫn: «Bám dây bên phải, đến thác thứ ba thì rẽ — nghe tiếng "tách tách" là đúng.»

### Ẩm thực

- **Cháo ý dĩ gừng** — ấm, mềm, ăn sáng trong sương.
- **Bánh mộc hương** — bánh nếp nhân đậu, thơm hoa mộc.

### Nghề

- **Gốm gờ nổi**: bát đĩa có hoa văn nổi để người mù nhận bằng tay; khách mua làm quà.
- **Chuông gió định âm**: mỗi chuông một cao độ, đặt làm theo «tiếng của nhà».

### Truyền thuyết

1. **Thầy mù và Khổng tiên sinh:** tương truyền một thầy mù từng ngồi cùng Khổng tiên sinh đoán một lá số; Khổng tiên sinh phán trong ba hơi thở, thầy mù hỏi suốt một buổi chiều. Kết luận giống nhau, nhưng người được xem chỉ nhớ lời thầy mù — «vì ông ấy hỏi tôi muốn sống thế nào». → LORE-351.
2. **Suối Thính Âm biết khóc:** năm có nhiều người bị Định Mệnh Hội lừa, suối chảy «nghe như tiếng nức nở». Người sáng mắt không nghe thấy gì khác lạ.

### Đường nối

| Tới | Khoảng cách | Đường |
|---|---|---|
| Huyền Thành | 825 m | Đông Bắc lộ |
| Lịch Đường | 550 m | đường dốc xuống Nam |
| Thư Lâu Lâm | 665 m | đường rừng Tây |
| Chung Nam | 1.089 m | **Đèo Tuyết Bắc** (mở sau Hồi II) |

### Móc nối gameplay

- Sảnh Tượng Pháp (đã có): đọc tượng Manh phái. Mini-game «nghe» (định hướng bằng âm thanh) — tài liệu 09.
- `SQ-manh-xx`: dẫn một thầy mù sang Huyền Thành giảng; sửa chuông gió lệch tiếng; tìm người dẫn đường mất tích.

---

## 3.4 Trích Thiên Đỉnh `trichthien` — Khôn, Thổ

### Thẻ vùng

| Mục | Giá trị |
|---|---|
| Tâm · kiểu | (−600, 600) · `peak` · cao 380 m · bán kính 210 m |
| Cung · hành | Khôn ☷ · **Thổ** (mẹ đất); đỉnh gần sao nên lore gắn thêm Thủy (sương, sao) |
| Dân số lore | ~700 |
| Phe chính | FAC-001 (chi Tử Vi), người thờ Đẩu Mẫu |
| Đã có trong code | Sảnh Tử Vi (−567, 503); Đẩu Mẫu Điện (cửa −566, 566) |

### Khí hậu

- Ban ngày ấm, ban đêm lạnh và **trời rất trong** — nơi xem sao tốt nhất đại lục.
- Đầu nguồn sông Huyền Hà: tuyết tan mùa xuân thành nhiều suối.
- **Hệ số thời tiết:** quang ban đêm +40%, sương sớm +20%, mưa −10%; đông có tuyết trên đỉnh (20% ngày Thủy).

### Địa hình

- Núi hình mái vòm tròn (Khôn — đất mẹ), sườn thoải phủ cỏ, đỉnh có **Đài Quan Tinh** bằng đá.
- Nguồn **Huyền Hà**: ba con suối hợp lại ở sườn Đông tạo hồ nhỏ «**Mẫu Trì**», rồi chảy thành sông.

### Thực vật · động vật

- Cỏ thảo nguyên, hoa đỗ quyên mùa xuân, cây dâu tằm ở làng chân núi.
- Hươu trắng (hiếm, chỉ xuất hiện đêm trăng — LORE-445), cú mèo, đom đóm, ong mật.

### Tài nguyên · dược thảo

| Tài nguyên | Hành | Dùng |
|---|---|---|
| Kỷ tử trồng sườn nắng | Mộc / Thủy | bổ can thận (`WUX_ZANG.木/水.nourish`) |
| Dâu tằm | Mộc / Thủy | nuôi tằm, quả bổ |
| Mật ong đỗ quyên | Thổ | ngọt, quà lễ |
| Đá thạch anh tím (nhỏ) | Thủy | làm hạt chuỗi bái Đẩu |

### Khu dân cư

| Tên | Dân số lore | Mô tả |
|---|---|---|
| **Đỉnh Quan Tinh** | ~200 | Sảnh Tử Vi, Đẩu Mẫu Điện, Đài Quan Tinh, nhà thầy |
| **Làng Tằm Mẫu Trì** | ~400 | Nuôi tằm, dệt lụa, nuôi ong |
| **Trạm Đầu Nguồn** | ~100 | Bến đò ngược Huyền Hà xa nhất, nhà người giữ nguồn |

### Phong tục

- **Thức đêm xem sao:** người đỉnh núi ngủ ngày một giấc trưa dài, đêm lên Đài Quan Tinh. Trẻ con biết tên Bắc Đẩu Thất Tinh trước khi biết chữ.
- **Bái Đẩu bằng lụa:** tục dâng bảy dải lụa tằm làng (bảy màu) cho Đẩu Mẫu ngày Trùng Cửu.
- **Không làm đục nước Mẫu Trì:** ai rửa đồ ở hồ đầu nguồn là bị cả làng nhắc — «đục ở đây thì cả Huyền Thành uống đục».

### Lễ hội

- **Trùng Cửu bái Đẩu** (9/9 âm lịch, tục Cửu Hoàng — LORE-415): lễ lớn nhất vùng, đèn thất tinh xếp trên sân Đẩu Mẫu Điện.
- **Đêm Thất Tịch** (7/7 âm): nam nữ lên Đài Quan Tinh xem Ngưu – Nữ; Sảnh Tử Vi mở xem duyên (nối với Bàn Hợp Hôn ở Huyền Thành).

### Giọng nói

- Thơ thẩn, nhiều tên sao. Gọi khách là «người dưới núi».
- Câu mẫu:
  - Thầy Tử Vi: «Sao chiếu thì có, nhưng ngồi đâu trong nhà là việc của con.»
  - Người làng tằm: «Tằm ăn dâu đêm nghe như mưa — nghe quen rồi thì không ngủ được nếu im.»

### Ẩm thực

- **Chè kỷ tử mật ong**.
- **Cơm lam ống tre nướng đêm** — món ăn khi thức xem sao.

### Nghề

- **Lụa Mẫu Trì** (tằm làng): lụa mỏng, nhuộm bảy màu thất tinh.
- **Hạt chuỗi thạch anh**.

### Truyền thuyết

1. **Bảy chiếc đèn không tắt:** đêm Bàn nứt, bảy đèn thất tinh trên sân Đẩu Mẫu Điện vẫn sáng dù gió lớn. Người làng tin Đẩu Mẫu «vẫn soi». → LORE-353.
2. **Hươu trắng uống nước Mẫu Trì:** ai thấy hươu trắng uống nước ở hồ đầu nguồn thì năm ấy nhà có người được chữa lành — người làng nói vậy để dặn nhau **giữ hồ sạch cho hươu**.

### Đường nối

| Tới | Khoảng cách | Đường |
|---|---|---|
| Huyền Thành | 849 m | Tây Nam lộ / **đò xuôi Huyền Hà** |
| Phong Thủy Viên | 639 m | đường cỏ Bắc |
| Yên Tử | 922 m | **Đường Tùng Nam** (mở sau Hồi I) |
| Miêu Cương | 1.063 m | **Đèo Muối** (đường Hiệp ước Muối – Thuốc, HIS-066) |
| Cùng Thông Hồ | 1.220 m | theo sông Huyền Hà (đò, nhanh nhất) |

### Móc nối gameplay

- Sảnh Tử Vi (an sao), Đẩu Mẫu Điện (bái Đẩu, đã có).
- `SQ-trichthien-xx`: làm sạch Mẫu Trì; thắp lại đèn thất tinh; giúp làng tằm bán lụa không qua trung gian của Định Mệnh Hội.

---

## 3.5 Cùng Thông Hồ `cungthong` — Tốn, Mộc (thủy vực)

### Thẻ vùng

| Mục | Giá trị |
|---|---|
| Tâm · kiểu | (620, 620) · `lake` · mặt hồ −24 m · bán kính 250 m (vùng lớn nhất) |
| Cung · hành | Tốn ☴ · **Mộc** theo cung; **Thủy** theo cảnh (hồ). Lore: «gió trên mặt nước» — quẻ Phong Thủy Hoán (tan, lưu thông) |
| Dân số lore | ~2.500 (làng chài, làng sen, nhà sàn) |
| Phe chính | FAC-001 (chi Điều Hậu), FAC-023 Hội Đò, FAC-021 Dược Bang |
| Đã có trong code | Sảnh Điều Hậu (480, 420) |

### Khí hậu

- Ẩm, mát mùa hạ, sương dày mùa thu; gió hồ đổi chiều sáng – chiều.
- **Hệ số thời tiết:** sương +60%, mưa +20%, giông mùa hạ +20%, gió +20%. Mùa đông mặt hồ có lớp hơi nước bốc như khói.

### Địa hình

- Hồ trũng lớn, bờ Tây có kênh đá cổ (HIS-019), bờ Bắc là bãi bồi trồng sen, bờ Đông có **rừng tràm ngập**, bờ Nam là làng chài nhà sàn.
- Giữa hồ có đảo nhỏ **Hàn Noãn** (lạnh – ấm): một nửa đảo có suối nước ấm, một nửa có suối lạnh — biểu tượng điều hậu.

### Thực vật · động vật

- Sen, súng, lau sậy, tràm, liễu rủ ven bờ.
- Cá chép (LORE-450), rùa hồ (không bắt), cò trắng, bói cá, vịt trời. Ếch đêm hè kêu như tiếng tụng.

### Tài nguyên · dược thảo

| Tài nguyên | Hành | Dùng |
|---|---|---|
| Ngó sen, hạt sen | Hỏa / Thổ | chè, cháo (`WUX_ZANG.火.nourish`) |
| Củ ấu | Thủy | luộc ăn, bổ |
| Lá tràm, tinh dầu | Mộc | xông, chữa cảm theo dân gian |
| Cá hồ | Thủy | thức ăn (vùng này có nghề cá — game không cho người chơi câu cá giết; NPC làm nghề) |
| Muối khoáng suối Hàn Noãn | Thủy | tắm, ngâm chân |

> Ghi chú T6: nghề cá của NPC là cảnh sống thực; người chơi có thể **phóng sinh** (Bút Tháp) nhưng không bị ép ăn chay; nhiệm vụ tôn trọng lựa chọn.

### Khu dân cư

| Tên | Dân số lore | Mô tả |
|---|---|---|
| **Làng Chài Nam Hồ** | ~1.200 | Nhà sàn, chợ cá sáng sớm, bến đò lớn nhất |
| **Làng Sen Bắc Hồ** | ~700 | Trồng sen, ướp trà sen, làm chè |
| **Đảo Hàn Noãn** | ~100 | Sảnh Điều Hậu, nhà tắm suối, nhà thầy |
| **Xóm Tràm** (Đông) | ~500 | Lấy tinh dầu, làm thuyền, đan lưới |

### Phong tục

- **Hỏi nóng lạnh trước khi hỏi khỏe:** người hồ chào nhau «hôm nay trong người nóng hay lạnh?» — ảnh hưởng của Sảnh Điều Hậu.
- **Nhà sàn hướng gió:** nhà nào cũng có một cửa sổ đón gió Tốn (Đông Nam) — tục do thầy Điều Hậu dạy.
- **Đò không chở người say vào đêm giông** — luật Hội Đò.

### Lễ hội

- **Hạ Nguyên — Thủy quan giải ách** (rằm tháng Mười âm lịch; canon §10): thả thuyền giấy giữa hồ, mỗi thuyền viết một nỗi lo muốn buông (LORE-416).
- **Lễ Điều Hậu** (Đại Thử): ngày nóng nhất, cả làng xuống suối lạnh đảo Hàn Noãn, thầy giảng về cân nóng lạnh trong lá số.
- **Đua thuyền tràm** (Đoan Ngọ).

### Giọng nói

- Nhanh, vui, hay dùng hình ảnh nước. Gọi khách là «người cạn» (người trên cạn).
- Câu mẫu:
  - Ngư phủ: «Hồ cạn thì đào kênh, người cùng thì đổi cách — "cùng tắc biến" đó con.»
  - Thầy Điều Hậu: «Lá số con sinh tháng Ngọ mà ít Thủy, như ruộng hạ thiếu mưa. Không phải số khổ — là cần tưới.»

### Ẩm thực

- **Chè sen long nhãn**; **trà ướp sen** (bông sen ướp qua đêm).
- **Cá kho lá tràm** (món của làng chài).
- **Cháo ấu** mùa thu.

### Nghề

- Ướp trà sen; đan lưới; đóng thuyền tràm; làm đèn hoa đăng bằng bẹ chuối và giấy (bán cho lễ Vu Lan khắp đại lục).

### Truyền thuyết

1. **Kênh của trăm người:** chuyện đào kênh thời Hồng Mông (HIS-019) — mỗi người đào một bước, không ai đào hết; câu dân gian «một người không thông được hồ». → LORE-354.
2. **Đảo Hàn Noãn:** tương truyền đảo có hai suối vì một đôi vợ chồng — người nóng tính, người lạnh lùng — cãi nhau bỏ đi hai đầu đảo, rồi già đi cùng nhau ở giữa. Thầy Điều Hậu kể chuyện này khi giảng hợp hôn.
3. **Cá chép mang thư:** dân chài tin cá chép lớn bơi về phía Bắc hồ là điềm có thư vui từ xa.

### Đường nối

| Tới | Khoảng cách | Đường |
|---|---|---|
| Huyền Thành | 877 m | Đông Nam lộ / **đò ngược Huyền Hà** |
| Lịch Đường | 651 m | đường bờ hồ Bắc |
| Bút Tháp | 888 m | **Đường Đồng Lúa** (Nam) |
| Mao Sơn | 1.112 m | **Đò Tràm** xuyên rừng ngập + đường trúc |
| Trích Thiên Đỉnh | 1.220 m | đò ngược sông |

### Móc nối gameplay

- Sảnh Điều Hậu (đã có); lễ Hạ Nguyên; thả đèn.
- `SQ-cungthong-xx`: chuyến đò đêm giông (giữ an toàn khách — thử thách đạo đức: từ chối chở người say); trả lại lưới cho làng chài bị Định Mệnh Hội «phán» là «nhà phạm thủy sát».

---

## 3.6 Thư Lâu Lâm `thulau` — Khảm, Thủy

### Thẻ vùng

| Mục | Giá trị |
|---|---|
| Tâm · kiểu | (0, −700) · `plateau` · cao 110 m · bán kính 160 m |
| Cung · hành | Khảm ☵ · **Thủy** (tàng, trí) |
| Dân số lore | ~800 (thủ thư, thư sinh, người chép kinh, thợ giấy) |
| Phe chính | FAC-029 Thư Lâu; FAC-017 (nho sinh tạm trú) |
| Đã có trong code | Thư Lâu (0, −630); Văn Xương Các (cửa 0, −652) |

### Khí hậu

- Mát, ẩm vừa, nhiều mưa phùn; mùa đông có tuyết mỏng trên ngọn thông.
- «**Mặc Vũ**» — mưa phùn lẫn tro thông, nước đọng hơi xám (01 › 1.2.3).
- **Hệ số thời tiết:** mưa phùn +40%, sương +30%, nắng gắt −50%.

### Địa hình

- Cao nguyên thấp phủ **rừng thông** cổ, đường đá lát giữa rừng; Thư Lâu đứng trên gò cao nhất.
- Phía Bắc, nhìn lên thấy đảo trời **Côn Lôn** (0, −900) gần nhất — chỉ cách 200 m theo phương ngang, nhưng ở độ cao 260 m. Ngày trời trong thấy được thác mây đổ từ đảo.

### Thực vật · động vật

- Thông, tùng, cỏ lá kim, nấm thông (mùa thu), hoa lan rừng.
- Đom đóm (LORE-457 — thư sinh nghèo đọc sách bên đom đóm), quạ, sóc thông, **mèo Thư Lâu** bắt chuột giữ kinh (LORE-463).

### Tài nguyên · dược thảo

| Tài nguyên | Hành | Dùng |
|---|---|---|
| Nhựa thông, muội thông | Mộc / Thủy | làm **mực** (muội thông) |
| Vỏ dó / cây giấy | Mộc | làm giấy |
| Vừng đen, hà thủ ô (vườn) | Thủy | bổ thận tinh (`WUX_ZANG.水.nourish`) — món ăn của người thức đêm đọc sách |
| Nấm thông | Thổ | món ăn mùa thu |

### Khu dân cư

| Tên | Dân số lore | Mô tả |
|---|---|---|
| **Gò Thư Lâu** | ~250 | Thư Lâu nhiều tầng, Văn Xương Các, nhà thủ thư |
| **Xóm Giấy Mực** | ~350 | Làm giấy dó, đốt muội làm mực, đóng sách |
| **Lều Thư Sinh** (rìa rừng) | ~200 | Thư sinh nghèo ở trọ ôn thi khoa cử Văn Miếu |

### Phong tục

- **Im lặng trong rừng:** nói to trong rừng Thư Lâu là bất lịch sự; người ta nói thầm, cười khẽ.
- **Không đốt lửa trần:** chỉ dùng đèn lồng có kính — vì thông và giấy.
- **Chép một trang trả một trang:** ai đọc sách ở Thư Lâu thì chép tay lại một trang kinh cho tủ sách các làng — «đọc nhờ thì chép trả». Trong game: nhiệm vụ hằng ngày «chép kinh» (`DQ-xx`, tài liệu 09).

### Lễ hội

- **Lễ Sái Thư** (Tiểu Thử / 6 tháng Sáu âm lịch — tục phơi sách): mang kinh ra phơi nắng chống ẩm mốc; khách được xem những cuốn hiếm (LORE-411).
- **Vía Văn Xương** (mùng 3 tháng Hai âm lịch, theo tín ngưỡng Văn Xương): thư sinh lên Văn Xương Các cầu học (LORE-009).

### Giọng nói

- Văn hoa, dẫn sách, hay dùng câu dài; người làng giấy nói giản dị hơn.
- Câu mẫu:
  - Thủ thư: «Sách không có lỗi. Người đọc thiếu một nửa thì sách thành sai.»
  - Thư sinh: «Đom đóm năm nay ít quá, đọc sách phải xin dầu của nhà chùa.»
  - Thợ mực: «Mực tốt là mực thông già. Người tốt cũng thế — phải có tuổi mới đen nhánh.»

### Ẩm thực

- **Chè vừng đen**; **cháo hà thủ ô** (món người thức khuya).
- **Nấm thông xào**.

### Nghề

- **Giấy dó Thư Lâu**, **mực muội thông**, **đóng sách khâu chỉ**, **dập bia** (dập chữ trên bia đá ra giấy — nghề dùng để dập lại Bàn Minh).

### Truyền thuyết

1. **Đệ Nhất Đăng:** cuộn thẻ tre *Đạo Đức Kinh* trôi tới đầu tiên (HIS-022) — người ta nói cuộn ấy không bao giờ ẩm mốc dù tủ khác mục. → LORE-355.
2. **Tầng không có cầu thang:** Thư Lâu có một tầng không có cầu thang dẫn lên; thủ thư bảo «tầng của sách chưa tới». Lore: chỗ dành cho kinh văn tương lai theo Đăng Lộ (mở rộng nội dung sau phát hành).
3. **Bốn chữ bị mối ăn:** chuyện các bản chép Bàn Minh bị mối ăn đúng bốn chữ cuối (HIS-093) — thủ thư già nói «mối không chọn chữ, người chọn bản chép».

### Đường nối

| Tới | Khoảng cách | Đường |
|---|---|---|
| Huyền Thành | 700 m | Bắc Lộ (thẳng) |
| Tử Bình Phong | 636 m | đường rừng Tây |
| Manh Phái Cốc | 665 m | đường rừng Đông |
| Võ Đang | 800 m | **Thần Đạo Bắc** — bậc đá lên núi (mở sau Hồi I) |
| Côn Lôn | 200 m ngang / 150 m cao | **Cầu Mây** — chỉ mở khi Quy nhất (canon §6) |

### Móc nối gameplay

- Thư Lâu (đọc tầng thư hôm nay — đã có), Văn Xương Các.
- `SQ-thulau-xx`: tìm bản dập Bàn Minh thật; bắt «con mối» (thực ra là người của Định Mệnh Hội đổi bản chép); giúp thư sinh nghèo có dầu đèn.

---

## 3.7 Phong Thủy Viên `phongthuy` — Đoài, Kim

### Thẻ vùng

| Mục | Giá trị |
|---|---|
| Tâm · kiểu | (−820, 0) · `plateau` · cao 55 m · bán kính 150 m |
| Cung · hành | Đoài ☱ · **Kim** |
| Dân số lore | ~1.100 |
| Phe chính | FAC-030 Phong Thủy Viên (địa sư) |
| Đã có trong code | Sảnh Dương Trạch (−806, 62) |

### Khí hậu

- Hanh khô, gió Tây thổi đều; hoàng hôn rất đẹp (Đoài — Tây, ráng chiều).
- **Hệ số thời tiết:** gió +30%, quang +20%, mưa −20%; thu có sương trắng.

### Địa hình

- Cao nguyên phẳng có **vườn thực nghiệm**: hàng trăm **la bàn đá** đặt trên bệ theo lưới, mương nước dẫn đo thế thủy, hàng cây đo gió, các mô hình nhà thu nhỏ quay nhiều hướng.
- Phía Tây cao nguyên dốc xuống thung lũng hẹp dẫn sang Phong Đô (khí lạnh dần).
- Giữa vườn: **La Bàn Tổ** (LORE-305) — la bàn đá lớn đường kính 9 m, kim bằng sắt tự nhiên treo dây.

### Thực vật · động vật

- Cây đo gió: liễu (mềm, chỉ gió nhẹ), trúc (chỉ gió vừa), bách (chỉ gió mạnh); cỏ lau trắng mùa thu.
- Chim nhạn (mùa thu bay qua), chim sáo đậu trên la bàn, cáo đỏ (hiền, sống ở bìa vườn — dân gọi «hồ ly giữ vườn», LORE-443).

### Tài nguyên · dược thảo

| Tài nguyên | Hành | Dùng |
|---|---|---|
| Sắt từ (đá nam châm) | Kim | kim la bàn |
| Lê trắng vườn | Kim | nhuận phế (`WUX_ZANG.金.nourish`) |
| Mộc nhĩ trắng | Kim | món chè |
| Đá thử nước (đá xốp) | Thổ | đo độ ẩm đất |

### Khu dân cư

| Tên | Dân số lore | Mô tả |
|---|---|---|
| **Viên Trung** | ~400 | Sảnh Dương Trạch, phòng vẽ bản đồ, nhà địa sư |
| **Làng Lê** | ~500 | Vườn lê, làm chè mộc nhĩ |
| **Xóm La Kinh** | ~200 | Thợ làm la bàn (vỏ gỗ của Mộc Tượng Đường, kim của xóm) |

### Phong tục

- **Thử nhà ba mùa:** người Phong Thủy Viên dọn vào nhà mới thì ở thử ba mùa mới treo bảng tên — xem gió, xem nước, xem nắng thật, không chỉ xem la bàn.
- **La bàn không bán cho người đang sợ:** quy tắc xóm La Kinh — ai đến mua la bàn với vẻ hoảng hốt thì được mời ngồi uống trà, nghe giảng trước (chống lại vụ La Bàn Giả, HIS-084).
- **Hình trước, khí sau:** địa sư Huyền Giới dạy xem thế đất (núi, nước, gió, ánh sáng) trước rồi mới tính phương vị — lối dạy thực tế.

### Lễ hội

- **Lễ So Kim** (Thu Phân): mọi la bàn trong vùng mang ra so với La Bàn Tổ; la bàn lệch được sửa miễn phí.
- **Lễ Cửu Vận**: mỗi 20 năm khi đổi vận (gần nhất Lập Xuân 2024 — trùng Đêm Giao Vận), địa sư vẽ lại bản đồ phi tinh cho cả đại lục.

### Giọng nói

- Thực tế, hay đo đếm, hay chỉ tay theo hướng. Thích nói câu «nhìn kìa».
- Câu mẫu:
  - Địa sư: «Đừng hỏi nhà con hướng gì trước. Hỏi xem buổi chiều nắng có rọi vào giường không.»
  - Thợ la bàn: «Kim lệch nửa độ là nhà lệch cả đời — mà kim lệch thường do tay người, không do trời.»

### Ẩm thực

- **Lê hấp đường phèn**; **chè mộc nhĩ trắng**.
- **Bánh gió Tây** — bánh phồng nhẹ nướng than, ăn khi ngồi xem hoàng hôn.

### Nghề

- **La bàn** (la kinh) đủ cỡ; **bản đồ địa thế vẽ tay**; **mô hình nhà thu nhỏ** (dùng trong giải án Dương Trạch).

### Truyền thuyết

1. **La Bàn Tổ không bao giờ lệch:** trừ đêm Bàn nứt, kim La Bàn Tổ quay ba vòng rồi đứng lại đúng Bắc. Địa sư coi đó là bằng chứng «trời không sai» (cùng ý HIS-088). → LORE-305.
2. **Hồ ly giữ vườn:** con cáo đỏ sống ở bìa vườn được tin là «gác» la bàn đá khỏi người xấu; dân để thức ăn ở gốc liễu. Không có phép thuật nào — đó là cách dân Huyền Giới kể về một con cáo hiền.

### Đường nối

| Tới | Khoảng cách | Đường |
|---|---|---|
| Huyền Thành | 820 m | Tây Lộ (qua cầu đá Huyền Hà) |
| Tử Bình Phong | 595 m | đèo Bạch Thạch |
| Trích Thiên Đỉnh | 639 m | đường cỏ Nam |
| Phong Đô | 680 m | **Hẻm Âm Phong** — thung lũng hẹp, lạnh dần (mở ở Hồi IV hoặc Tà Lộ) |

### Móc nối gameplay

- Sảnh Dương Trạch: xem nhà cho khách (đã có); giải án «nhà không yên» bằng phong thủy (`fs-cure › SHA_LIST`) trước khi đến Mao Sơn.
- `SQ-phongthuy-xx`: so kim la bàn của một gia đình bị bán La Bàn Giả; ở thử nhà ba mùa cho một cặp vợ chồng trẻ.

---

## 3.8 Lịch Đường `lichduong` — Chấn, Mộc

### Thẻ vùng

| Mục | Giá trị |
|---|---|
| Tâm · kiểu | (820, 0) · `plateau` · cao 55 m · bán kính 150 m |
| Cung · hành | Chấn ☳ · **Mộc** (sấm, khởi đầu — nơi mở năm, chọn ngày khởi sự) |
| Dân số lore | ~1.600 |
| Phe chính | FAC-028 Lịch Đường; FAC-020 Thương Hội (chợ phía Đông) |
| Đã có trong code | Sảnh Trạch Nhật (735, −36) |

### Khí hậu

- Đón nắng sớm nhất đại lục (phía Đông); xuân nhiều sấm; hạ nóng ẩm.
- **Hệ số thời tiết:** giông xuân +40%, nắng sáng +20%, sương −10%.

### Địa hình

- Cao nguyên Đông thoải, nhìn ra biển mây phía Đông lúc bình minh. Giữa vùng có **Đài Khuê Biểu**: cột đá cao 8 thước và «khuê» (thước đá nằm) dài để đo bóng Mặt Trời (LORE-304).
- Bãi bồi bờ sông phía Bắc — nơi cuộn thẻ tre đầu tiên trôi vào (HIS-022).
- Chợ lớn thứ hai đại lục ở cửa Tây vùng.

### Thực vật · động vật

- Đào (hoa xuân), tre, rau xanh trồng theo lịch, cây hoa hòe.
- Én (báo xuân), chim cu gáy, trâu cày, gà trống gáy giờ Mão.

### Tài nguyên · dược thảo

| Tài nguyên | Hành | Dùng |
|---|---|---|
| Rau ngót, rau má | Mộc | bổ can (`WUX_ZANG.木.nourish`) |
| Tre gai | Mộc | đồ dùng, ống thẻ xăm |
| Hoa đào | Mộc | trà, mứt, cắm Tết |
| Đá phiến đen | Thủy | bảng lịch khắc |

### Khu dân cư

| Tên | Dân số lore | Mô tả |
|---|---|---|
| **Đường Lịch** | ~300 | Sảnh Trạch Nhật, Đài Khuê Biểu, kho lịch, nhà lịch quan |
| **Chợ Đông** | ~800 | Chợ đông thứ hai; **quầy Đổi Mệnh đầu tiên** (HIS-078) ở góc chợ |
| **Làng Đào** | ~500 | Trồng đào, rau, làm lịch giấy treo tường |

### Phong tục

- **Hỏi ngày trước khi hỏi giá:** người Lịch Đường mua bán việc lớn thì xem ngày trước. Sảnh Trạch Nhật đông nhất mùa cưới (cuối thu, đầu xuân).
- **Lịch phát không:** mỗi năm Lịch Đường in **Lịch Huyền Giới** phát miễn phí — quy định từ HIS-060. Định Mệnh Hội từng in «lịch giả» đánh dấu thêm ngày hung để bán lễ.
- **Gà gáy là đồng hồ chung:** làng nuôi một con gà trống «gáy giờ» cho cả làng, chăm như người.

### Lễ hội

- **Lễ Nghe Sấm** (Kinh Trập) cùng Thần Tiêu Lôi Viện Long Hổ — người hai vùng đốt pháo tre khi sấm đầu tiên vang.
- **Lễ Phát Lịch** (Đông Chí): lịch năm sau được phát; trẻ con chạy khắp chợ phát lịch.
- **Lễ Đo Bóng** (Hạ Chí và Đông Chí): lịch quan đo bóng dài nhất – ngắn nhất ở Khuê Biểu; dân xem như hội.

### Giọng nói

- Nhanh, buôn bán, nhiều số đếm và tên ngày. Hay dùng «ngày lành», «giờ đẹp».
- Câu mẫu:
  - Lịch quan: «Ngày không có ngày xấu cho mọi người. Có ngày không hợp với việc con định làm.»
  - Người chợ: «Mua đào chưng Tết thì chọn cành nụ, nở trước Tết là phí.»

### Ẩm thực

- **Canh rau ngót thịt băm**, **rau má trộn**; **mứt đào**.
- **Bánh Lịch** — bánh vuông in 12 ô chi, mỗi tháng một loại nhân.

### Nghề

- **In lịch khắc gỗ**, **khắc bảng lịch đá**, **làm ống xăm tre** (cho chùa, đền — xin xăm là tính năng có sẵn, iOS tắt).
- Thủ công tre: rổ, quạt, đèn.

### Truyền thuyết

1. **Bóng Khuê dừng ba hơi thở:** đêm Bàn nứt (thực ra là giờ Dần), lịch quan thấy bóng trên Khuê dừng lại ba hơi thở (01 › 1.4.4-e). → LORE-304, LORE-358.
2. **Con gà gáy sai giờ:** năm Định Mệnh Hội in lịch giả, con gà gáy giờ của làng gáy sai suốt một tuần; dân bảo «gà cũng không chịu lịch giả». Câu chuyện vui để NPC kể khi người chơi hỏi về lịch giả.

### Đường nối

| Tới | Khoảng cách | Đường |
|---|---|---|
| Huyền Thành | 820 m | Đông Lộ |
| Manh Phái Cốc | 550 m | đường dốc Bắc |
| Cùng Thông Hồ | 651 m | đường bờ hồ |
| Long Hổ | 709 m | **Đường Đá Đỏ** — dẫn tới vách đan hà (mở sau Hồi I) |

### Móc nối gameplay

- Sảnh Trạch Nhật (chọn ngày, đã có); quầy Định Mệnh Hội đầu tiên — nơi Hồi I đối chất lần đầu.
- `SQ-lichduong-xx`: thu hồi lịch giả; giúp một đôi trẻ chọn ngày cưới mà không bị dọa; tìm con gà gáy giờ bị mất.

---

## 3.9 Ma trận đường nối tám vùng (khoảng cách thẳng, mét)

| | thanh | tubinh | manh | trichthien | cungthong | thulau | phongthuy | lichduong |
|---|---|---|---|---|---|---|---|---|
| **thanh** | — | 835 | 825 | 849 | 877 | 700 | 820 | 820 |
| **tubinh** | 835 | — | | | | 636 | 595 | |
| **manh** | 825 | | — | | | 665 | | 550 |
| **trichthien** | 849 | | | — | 1.220 (đò) | | 639 | |
| **cungthong** | 877 | | | 1.220 (đò) | — | | | 651 |
| **thulau** | 700 | 636 | 665 | | | — | | |
| **phongthuy** | 820 | 595 | | 639 | | | — | |
| **lichduong** | 820 | | 550 | | 651 | | | — |

Ô trống: không có đường trực tiếp, phải qua Huyền Thành hoặc vùng kề. Đây là vòng đường **hai lớp**: lớp trong (8 nan từ Huyền Thành) và lớp ngoài (vòng tròn nối các vùng kề).

## 3.10 Bảng tổng tám vùng (tra nhanh)

| Vùng | Hành | Khí hậu một chữ | Đặc sản | Nghề | Tiếng nền |
|---|---|---|---|---|---|
| Huyền Thành | Thổ | hòa | cháo sơn dược, bánh nứt dán vàng | gốm vàng, áo tu | chợ, chuông giờ |
| Tử Bình Phong | Kim | khô | canh bách hợp | khắc đá, chuông gió | gió đá, chuông |
| Manh Phái Cốc | Thổ | ẩm | cháo ý dĩ gừng | gốm gờ nổi | suối, chuông nhà |
| Trích Thiên Đỉnh | Thổ | trong | chè kỷ tử | lụa Mẫu Trì | côn trùng đêm, tằm ăn dâu |
| Cùng Thông Hồ | Mộc / Thủy | ướt | chè sen, cá kho tràm | trà sen, đèn hoa đăng | nước, ếch, mái chèo |
| Thư Lâu Lâm | Thủy | mù | chè vừng đen | giấy, mực, dập bia | gió thông, lật trang |
| Phong Thủy Viên | Kim | hanh | lê đường phèn | la bàn | gió Tây, kim sắt |
| Lịch Đường | Mộc | sấm | bánh Lịch, mứt đào | in lịch, ống xăm | gà gáy, chợ, sấm xuân |

## 3.11 Checklist nghiệm thu tám vùng

- [ ] Mỗi vùng có đủ 13 mục của mẫu thẻ (3.0).
- [ ] Không vùng nào có sinh vật thù địch.
- [ ] Mọi dược thảo có hành và ghi chú «không chẩn bệnh».
- [ ] Manh Phái Cốc có lan can dây thừng và đá lát rãnh đi được hết cốc.
- [ ] Mỗi vùng có ít nhất 2 truyền thuyết mở mục codex.
- [ ] Quầy Định Mệnh Hội: ít nhất 1 vị trí trong mỗi vùng, đặt ở chỗ đông người lo âu (chợ, cửa sảnh chọn ngày, bến đò).
