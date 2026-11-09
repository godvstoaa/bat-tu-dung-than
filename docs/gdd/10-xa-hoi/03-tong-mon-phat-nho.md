# 10 · Phần 03 — Ba tông Phật giáo, tông Nho và Y Lư Miêu Cương

> Tiếp Phần 02 (cùng quy ước §2.0: hành lễ, mã công trình `GUILD-DT-*-01…11`, mã việc tuần). Ba tông Phật giáo là **cư sĩ tông** (Phần 01 §1.6.3): người chơi không «xuất gia» trong game, không mang danh hiệu tăng ni có thật.

## 3.0 Nguyên tắc riêng cho ba tông Phật giáo

| # | Nguyên tắc | Cách làm trong game |
|---|---|---|
| 1 | Tượng Phật, Bồ Tát là **vật thờ cố định** | đặt sẵn trong Chánh Điện của đạo tràng theo tông; không có trong cửa hàng, không đổi vị trí tùy ý, không đặt ở Trai Đường hay Liêu Xá |
| 2 | Không in toàn văn kinh, chú | dải tụng chỉ hiện **tên đoạn** và lời giảng nghĩa do biên tập viên viết mới; trích chỉ trong phạm vi app đã có và được phép (bản sơ đồ §5.4) |
| 3 | Pháp danh trong game **không thay** quy y thật | màn hình nhận pháp danh ghi: «Pháp danh cư sĩ trong trò chơi. Quy y thật là nghi thức do chư tăng ni truyền trao ở chùa.» |
| 4 | Không «bấm để buff» bằng tụng kinh | tụng trong lễ là mini-game nhịp, thưởng theo **tham gia**, không theo «kinh mạnh yếu» |
| 5 | Nơi có thật (Yên Tử, Bút Tháp) dựng theo **nguyên mẫu kiến trúc** | không dựng lại bảo vật quốc gia (vd tượng Quán Âm nghìn mắt nghìn tay chùa Bút Tháp) thành vật trang trí của người chơi |
| 6 | Cố vấn nội dung từ truyền thống tương ứng trước khi phát hành vùng (bản sơ đồ §14) | ghi trong lịch M2–M5 |

---

## 3.1 `GUILD-TH` — Trúc Lâm Thiền Tông (Yên Tử)

### 3.1.1 Thẻ tông

| Mục | Nội dung |
|---|---|
| Thánh địa | `yentu` — Yên Tử Trúc Lâm (−400, 1500) |
| Chưởng giáo | `truclam_thiensu` — Thiền sư Trúc Lâm (Pháp Không) |
| Dữ liệu app | `remedy-fate › GAI_XIN` (5 bước 觉 → 停 → 转 → 净 → 化); `spiritual-fs`; Trúc Lâm **cần bổ sung** (canon §5.6) |
| Tu gì | thiền định, công án, hành hương |
| Hành lễ | Thổ |
| Loại chi đường | **Thiền Am** |
| Giới riêng | «Không tranh hơn thua trong im lặng.» |
| Màu cờ | nâu đất, viền vàng nhạt |

### 3.1.2 Danh xưng chức sự

Lấy tên **chức việc** trong thiền lâm (là tên công việc, không phải giáo phẩm):

| Chức chung | Ở Thiền Am |
|---|---|
| Chủ Trì | Am Chủ |
| Phó Trì | Phó Am |
| Trưởng Lão | Lão Cư Sĩ |
| Tri Khách | Tri Khách |
| Tri Khố | Thủ Khố |
| Chủ Lễ | Duy Na |
| Giám Viện | Giám Tác *(trông việc xây)* |
| Thư Ký | Thư Ký |
| Giáo Tập | Hướng Dẫn Thiền |

### 3.1.3 Pháp danh cư sĩ

- Chữ đầu (chọn 1 trong 3): **Tâm**, **Như**, **Minh**.
- Chữ sau (40): An, Bình, Hòa, Tịnh, Thiện, Đức, Huệ, Trí, Giác, Ngộ, Không, Như, Chân, Thành, Nhẫn, Hạnh, Nguyện, Từ, Bi, Hỷ, Xả, Quang, Chiếu, Minh, Tuệ, Định, Tùng, Trúc, Sơn, Vân, Nguyệt, Thủy, Liên, Hương, Đăng, Đạo, Pháp, Duyên, Viên, Tường.

### 3.1.4 Chuỗi nhập tông `GUILD-Q-TH-00` «Lên Chùa Đồng»

| Bước | Việc | Cơ chế | Engine |
|---|---|---|---|
| 00.1 | **Hành hương bộ** từ chân núi lên Chùa Đồng qua các điểm Giải Oan → Hoa Yên → Huệ Quang → Chùa Đồng (nguyên mẫu Yên Tử, canon §3) | không bay, không ngự kiếm; mỗi điểm dừng có **một câu tự hỏi** hiện trên đá (chữ khắc hư cấu) và một chỗ ngồi; ngồi 30 giây thì câu tan | `world.js` (đếm quãng), tài liệu 07 (điểm) |
| 00.2 | **Sổ tức** — đếm hơi thở từ 1 đến 10 | mỗi lần thở ra tự đếm (chạm); khi chữ «tạp niệm» chen vào và người chơi chạm nhầm vào nó, đếm **quay lại 1** — không trừ điểm, chỉ quay lại | tài liệu 09 (tĩnh tọa) |
| 00.3 | **Một công án** với Thiền sư Pháp Không | hội thoại mở; trên web: AI persona Thiền sư dẫn (không có đáp án đúng; chấm bằng số lần quay lại hỏi tiếp); trên iOS (`FEATURES.ai = false`): hội thoại soạn sẵn 3 vòng | `ai.js` persona (web), kịch bản tĩnh (iOS) |

**Cảnh 00.3 (bản soạn sẵn, dùng cho iOS và làm mẫu cho AI):**

```
[CẢNH GUILD-Q-TH-00.3 · am Hoa Yên · chiều muộn, giờ Dậu · mây ngang sườn núi]
PHÁP KHÔNG: (rót nước, không nhìn lên) Leo mệt không?
> Lựa chọn: ① «Mệt ạ.»  ② «Không mệt.»
PHÁP KHÔNG: (nếu ①) Mệt thì nói mệt. Thế là thật. (nếu ②) Chân con run kìa.
PHÁP KHÔNG: Thầy hỏi con một câu. Không cần trả lời ngay.
PHÁP KHÔNG: Lúc con đếm hơi thở mà quên mất số — lúc ấy ai quên?
> Lựa chọn:
  ① «Con quên.» → [a]
  ② «Tâm con quên.» → [b]
  ③ «Con không biết.» → [c]
  ④ (im lặng — không chọn gì trong 20 giây) → [d]

[a] PHÁP KHÔNG: «Con» là cái gì mà quên được? Mai lên kể thầy nghe.
[b] PHÁP KHÔNG: Tâm và con là hai à? Mai lên kể thầy nghe.
[c] PHÁP KHÔNG: Không biết là chỗ bắt đầu tốt. Mai lên kể thầy nghe.
[d] PHÁP KHÔNG: (mỉm cười, rót thêm nước) Ừ. Uống nước đi.

→ mọi nhánh đều qua bước. Công án được ghi vào Sổ Mệnh mục «Câu hỏi mang theo».
→ Quay lại am trong 7 ngày và hỏi tiếp ≥ 2 lần: dấu «kiên trì» (tài liệu 09 chấm).
```

### 3.1.5 Tông lễ `GUILD-RITE-TH-01` «Thiền Thất Tuần»

- **Nơi:** Thiền đường chùa Hoa Yên (nguyên mẫu).
- **Vùng im lặng:** trong 15 phút của lễ, cụm từ và cử chỉ (Phần 06) **bị tắt** trong phòng, trừ cử chỉ `palm` (chắp tay). Biển báo nhỏ ở cửa: «Thiền đường — giữ im lặng».
- **Pha Hành (10 phút):**
  1. **Tọa thiền thời 1** (3 phút): sổ tức chung; không ai thấy số đếm của người khác; vòng sáng mờ quanh mỗi người dày lên khi người đó giữ được.
  2. **Kinh hành** (4 phút): đi chậm theo vòng quanh thiền đường. Máy chủ đo tốc độ di chuyển (gói `mv`): **≤ 0,6 m/giây** và giữ khoảng cách ≥ 1,2 m với người trước. Đi nhanh không bị phạt, chỉ không tính điểm đoạn đó.
  3. **Tọa thiền thời 2** (3 phút).
- **Kết:** Thiền sư gõ khánh ba tiếng; một câu của Thiền sư (bộ 52 câu viết mới, mỗi tuần một câu). Ví dụ:
  - «Ngồi được mười lăm phút là mười lăm phút. Đừng cộng nó vào đâu cả.»
  - «Hôm nay ai thấy mình ngồi tệ, người đó đã thấy một điều thật.»
- Lễ có nhắc tác phẩm **«Cư trần lạc đạo phú»** của Trần Nhân Tông **bằng tên**, giới thiệu ngắn do biên tập viên viết; không chép bản dịch hiện đại (có bản quyền).

### 3.1.6 Đường lễ của Thiền Am

| Mã | Tên | Pha Hành |
|---|---|---|
| `GUILD-RITE-TH-02` | Tọa Sáng | giờ Mão; tọa thiền hai thời, không kinh hành; vùng im lặng |
| `GUILD-RITE-TH-03` | Kinh Hành Vườn Trúc | đi chậm trong Hậu Viên; cuối buổi mỗi người đặt một hòn sỏi lên tháp sỏi chung |
| `GUILD-RITE-TH-04` | Vấn Đáp | Duy Na rút một câu hỏi mở từ kho (40 câu viết mới, không chép công án cổ có bản dịch có bản quyền); mỗi người chọn một **thẻ phản hồi** hoặc **im lặng**; Duy Na đọc tất cả thẻ không tên; không có đúng sai |

### 3.1.7 Kho việc tuần

| Mã | Tên | Hành động đếm | Mục tiêu | Engine / nơi |
|---|---|---|---|---|
| `GUILD-Q-TH-01` | Mười hơi thở | số lần đếm trọn 1→10 | 300 | §3.1.4 |
| `GUILD-Q-TH-02` | Lên núi bằng chân | số lượt đi bộ chân núi → Chùa Đồng | 10 | §3.1.4 |
| `GUILD-Q-TH-03` | Kinh hành | tổng phút kinh hành đạt tốc độ chậm | 200 | §3.1.5 |
| `GUILD-Q-TH-04` | Mang câu hỏi | số lần quay lại hỏi tiếp công án | 20 | §3.1.4 |
| `GUILD-Q-TH-05` | Năm bước chuyển tâm | số lần đi đủ 5 bước `GAI_XIN` trong tình huống có lựa chọn | 15 | `GAI_XIN` |
| `GUILD-Q-TH-06` | Quét lá đường núi | lượt quét đường hành hương | 120 | — |
| `GUILD-Q-TH-07` | Trà không nói | tổng phút ngồi Trà Thất (bồ đoàn MMO hiện có) không dùng cụm từ | 150 | `protocol.js › SEATS` |
| `GUILD-Q-TH-08` | Đường lên Yên Tử | công sức `EV-CAU` đoạn Yên Tử | 300 công | Phần 08 |
| `GUILD-Q-TH-09` | Tâm ma | số lần chọn «dừng lại» (停) ở tình huống dễ khởi Tham/Sân/Si (`liudao`) | 20 | `liudao` |
| `GUILD-Q-TH-10` | Đọc Thiền | số mục Thiền ở Tàng Thư (nội dung bổ sung) | 25 | (chưa có — cần làm: dữ liệu Trúc Lâm) |

### 3.1.8 Đạo tràng Thiền Am

| Mã | Tên | Nét riêng |
|---|---|---|
| `GUILD-DT-TH-01` | Tam Quan | cổng gỗ, mái ngói mũi hài |
| `GUILD-DT-TH-02` | Chánh Điện | tượng Phật cố định, bồ đoàn, khánh |
| `GUILD-DT-TH-03` | Tàng Kinh | — |
| `GUILD-DT-TH-04` | Tăng Xá → **Thiền Xá** | phòng nghỉ, chiếu cói |
| `GUILD-DT-TH-05` | Trai Đường | cơm chay, canh rau rừng |
| `GUILD-DT-TH-06` | Khố Phòng | — |
| `GUILD-DT-TH-07` | Thiền Đường | 24 bồ đoàn quay mặt vào tường (thiền diện bích) hoặc vào nhau (chọn) |
| `GUILD-DT-TH-08` | Lầu Chuông | đại hồng chung nhỏ; tiếng chuông sáng/tối tự động |
| `GUILD-DT-TH-09` | Vườn Trúc | lối kinh hành lát đá |
| `GUILD-DT-TH-10` | Khách Đường | — |
| `GUILD-DT-TH-11` | **Thiền Đường Vạn Tùng** | nhà gỗ dài giữa rừng tùng, 30 chỗ ngồi; **vùng im lặng thường trực** (không chỉ trong lễ); đồng tu ở đây được hệ số đồng tu cao nhất của mọi đạo tràng (Phần 04 §4.2) nhưng **không** có bảng giờ ngồi — người ta ngồi rồi về, không ai đếm |

### 3.1.9 Lưu ý tôn trọng

- Thiền phái Trúc Lâm là truyền thống Phật giáo Việt Nam đang sống. Game ghi rõ chi đường Thiền Am do người chơi lập, không đại diện tổ chức nào.
- Không dựng tháp mộ có thật (như tháp Huệ Quang) thành công trình người chơi.
- Công án trong game là câu hỏi mở viết mới; không «chấm đúng sai» giác ngộ.

### 3.1.10 Câu thoại sinh hoạt (Pháp Không)

| Dịp | Câu |
|---|---|
| Thiền Am mới lập | «Am có mái rồi. Giờ ngồi.» |
| Khánh thành Vạn Tùng | «Rừng này không cần ai khen. Các con cũng vậy.» |
| Bầu Am Chủ | «Người quét sân sớm nhất làm Am Chủ là tốt. Ai quét sớm nhất?» |
| Có tranh cãi trong đường (khi có `NS-08`) | «Hai người giận nhau thì ngồi hai đầu thiền đường. Ngồi xong rồi nói.» |
| Hưu đường | «Am tan. Núi vẫn đây. Lên lúc nào cũng được.» |

---

## 3.2 `GUILD-TD` — Tịnh Độ Liên Tông (Bút Tháp)

### 3.2.1 Thẻ tông

| Mục | Nội dung |
|---|---|
| Thánh địa | `buttap` — Bút Tháp Tịnh Độ (500, 1500) |
| Chưởng giáo | `dieu_am` — Ni sư Diệu Âm |
| Dữ liệu app | `remedy-fate › CHAN_HUI` (5 pháp), `JING_ZHOU` (7), `TEN_THIEN`, `YEGUO`; `liudao` |
| Tu gì | niệm Phật, phóng sinh, bố thí, sám hối, Cửu phẩm liên hoa |
| Hành lễ | Hỏa |
| Loại chi đường | **Liên Xã** (蓮社 — theo truyền thống Bạch Liên Xã thời Huệ Viễn, nhóm cư sĩ cùng niệm Phật) |
| Giới riêng | «Phóng sinh đúng cách: cứu con vật đang gặp nạn, không đặt người bắt thêm để thả.» |
| Màu cờ | hồng sen, viền trắng |

### 3.2.2 Danh xưng chức sự

| Chức chung | Ở Liên Xã |
|---|---|
| Chủ Trì | Xã Trưởng |
| Phó Trì | Phó Xã |
| Trưởng Lão | Lão Cư Sĩ |
| Tri Khách | Tri Khách |
| Tri Khố | Thủ Quỹ |
| Chủ Lễ | Duy Na |
| Giám Viện | Giám Tác |
| Thư Ký | Thư Ký |
| Giáo Tập | Hướng Dẫn Niệm |

### 3.2.3 Pháp danh cư sĩ

- Chữ đầu (1 trong 3): **Diệu**, **Thiện**, **Quảng**.
- Chữ sau (40): Âm, Hòa, Liên, Hương, Từ, Bi, Hỷ, Xả, Tâm, Thành, Tín, Nguyện, Hạnh, Đức, Phúc, Huệ, Quang, Minh, Tịnh, An, Bình, Thanh, Viên, Mãn, Duyên, Hiền, Lành, Nhã, Thuận, Nhẫn, Khiêm, Cung, Kính, Hiếu, Nghĩa, Trung, Chân, Thật, Sen, Ngọc.

Không phân pháp danh theo giới tính (dù ở Việt Nam chữ «Diệu» hay dùng cho nữ, game không ép).

### 3.2.4 Chuỗi nhập tông `GUILD-Q-TD-00` «Một tràng hạt, một con cá, một lời xin lỗi»

| Bước | Việc | Cơ chế | Engine |
|---|---|---|---|
| 00.1 | **Niệm danh 108** theo tràng hạt | mỗi hạt một chạm theo nhịp mõ; lệch nhịp thì hạt sáng nhạt hơn, không phải làm lại | tài liệu 09 (mini-game nhịp) |
| 00.2 | **Phóng sinh đúng cách** | sau trận mưa lớn, cá mắc trong vũng cạn ở bãi ven sông; chọn cá còn khỏe, bê bằng chậu nước (không cầm tay khô), thả ở chỗ nước sâu, chảy chậm; Ni sư giảng vì sao **không mua cá bắt sẵn chỉ để thả** | `CONG_QUA › «Phóng sinh» +3`; `YEGUO › Sát sinh` (cure, chỉ phần nguyên tắc) |
| 00.3 | **Sám hối có việc sửa** | chọn một việc trong Sổ Mệnh mà mình từng chọn lựa chọn không tốt với một NPC (nếu chưa có thì chọn tình huống mẫu); đi gặp NPC đó, xin lỗi bằng câu soạn sẵn, **làm một việc bù** (trả lại, giúp một việc) | `CHAN_HUI`, `CHANHUI_PRINCIPLE` |

**Cảnh 00.2 (đầy đủ):**

```
[CẢNH GUILD-Q-TD-00.2 · bãi sông dưới chùa Bút Tháp · sáng sau mưa · nước đục]
DIỆU ÂM: (vén áo, lội xuống) Đêm qua nước lên rồi rút. Cá mắc lại trong vũng.
DIỆU ÂM: Con lấy chậu. Đừng cầm cá bằng tay khô, nó đau.
(mini-game: 8 vũng, mỗi vũng 1–3 cá; cá lật bụng là đã chết — để lại; cá còn quẫy thì bê)
NGƯỜI BÁN CÁ (đi ngang, gánh lồng): Cô ơi, mua cá tôi mà thả, công đức gấp đôi!
> Lựa chọn:
  ① «Cho tôi mua hết.» → [a]
  ② «Thôi bác ạ, cháu thả cá đang mắc cạn.» → [b]
  ③ (hỏi Ni sư) «Sư cô ơi, mua thả có được không?» → [c]

[a] DIỆU ÂM: (nhẹ giọng) Con mua hết hôm nay, mai bác ấy bắt gấp đôi. Thương con cá thì đừng làm nó thành hàng.
    → không mua được; quay về lựa chọn (không phạt)
[b] NGƯỜI BÁN CÁ: (gãi đầu) Ừ, thì thôi.
[c] DIỆU ÂM: Cứu con vật đang gặp nạn là phóng sinh. Đặt người bắt để mình thả là buôn bán. Con thấy khác nhau chưa?
    → tiếp [b]

DIỆU ÂM: (khi thả xong) Con cá không biết cảm ơn ai. Thế mới sạch.
→ ghi «Phóng sinh (cứu mạng)» +3 cho người chơi
```

**Ghi chú thiết kế về canon §5.3.** Bản sơ đồ ghi «thả chim ở chợ (mua lại từ lồng)». Tài liệu này giữ việc đó nhưng ràng buộc: chim mua lại phải là **chim đã bị bắt trước đó** (trong cốt truyện, nhóm buôn chim bị phát hiện), mỗi người tối đa 1 lần/tuần, và luôn kèm lời Ni sư về việc không tạo cầu cho việc bắt. Tránh dạy người chơi một tập tục đang bị chính giới Phật giáo khuyến cáo khi làm sai cách.

### 3.2.5 Tông lễ `GUILD-RITE-TD-01` «Liên Đăng Niệm»

- **Nơi:** sân trước chùa Bút Tháp (nguyên mẫu), có hồ sen.
- **Pha Hành (10 phút):**
  1. **Niệm theo nhịp** (6 phút): mõ giữ 60 nhịp/phút; mỗi người chạm theo nhịp; cả sân đồng đều thì tiếng niệm (âm thanh thu sẵn, xa, không rõ lời) dày lên.
  2. **Thắp liên đăng** (4 phút): trên mặt hồ có **Cửu Phẩm Liên Đăng** — chín tầng đèn sen. Mỗi tầng sáng khi tổng số nhịp đúng của cả sân đạt ngưỡng (`ngưỡng_tầng = 40 × n_người × tầng / 9`). Không ai biết đèn nào của ai: đây là đèn **chung**.
- **Hồi hướng** (bắt buộc ở tông này, có 3 lựa chọn như Phần 01 §1.11.2).
- **Lời Ni sư Diệu Âm:**
  - Mở: «Tham, sân, si ai cũng có. Đếm được thì bớt được.» (lời mở canon của nhân vật)
  - Khép: «Đèn sáng là của mọi người. Ai thấy đèn mình sáng nhất thì là chưa hiểu.»

### 3.2.6 Đường lễ của Liên Xã

| Mã | Tên | Pha Hành |
|---|---|---|
| `GUILD-RITE-TD-02` | Phóng Sinh Hồ Sen | trong Hậu Viên (ao): cứu cá/ếch mắc lưới rác; dọn rác ao; không có cá «mua sẵn» |
| `GUILD-RITE-TD-03` | Bố Thí Gánh Gạo | đường mang gạo (vật phẩm sự kiện, không mua bằng Ngọc) xuống làng nghèo dưới chân Bút Tháp; mỗi gánh đi bộ ~300 m; NPC nhận rồi kể một chuyện nhỏ |
| `GUILD-RITE-TD-04` | Sám Hối Đầu Tháng | mùng 1 âm lịch; mỗi người tự chọn một lỗi của tháng (danh sách tình huống trong game) và một việc sửa; không ai thấy lỗi của người khác |

### 3.2.7 Kho việc tuần

| Mã | Tên | Hành động đếm | Mục tiêu | Engine / nơi |
|---|---|---|---|---|
| `GUILD-Q-TD-01` | Phóng sinh đúng cách | số lần cứu cá/chim theo quy trình | 50 | §3.2.4 |
| `GUILD-Q-TD-02` | Một nghìn danh hiệu | tổng hạt niệm đúng nhịp | 10.000 | §3.2.5 |
| `GUILD-Q-TD-03` | Gánh gạo | số gánh tới làng | 40 | §3.2.6 |
| `GUILD-Q-TD-04` | Xin lỗi có việc sửa | số bước `CHAN_HUI` có hành động sửa | 20 | `CHAN_HUI` |
| `GUILD-Q-TD-05` | Mười điều thiện | số việc thuộc `TEN_THIEN` ghi được trong tuần | 60 | `TEN_THIEN` |
| `GUILD-Q-TD-06` | Đọc kinh theo việc | số mục `JING_ZHOU` đọc phần giới thiệu | 14 | `JING_ZHOU` |
| `GUILD-Q-TD-07` | Dọn hồ | lượt vớt rác hồ sen Bút Tháp và Hồ Sen Sơn Môn (`sen` station có sẵn) | 100 | — |
| `GUILD-Q-TD-08` | Đường đến Bút Tháp | công sức `EV-CAU` đoạn Bút Tháp | 300 công | Phần 08 |
| `GUILD-Q-TD-09` | Hợp Hôn cho khách | khách ở Bàn Hợp Hôn ≥ 70% (giảng hòa thuận) | 12 | `hehun`, `halls.js` |
| `GUILD-Q-TD-10` | Ngồi trước hồ | tổng phút tĩnh tọa ở hồ sen | 300 | — |

### 3.2.8 Đạo tràng Liên Xã

| Mã | Tên | Nét riêng |
|---|---|---|
| `GUILD-DT-TD-01` | Tam Quan | cổng nhỏ có hai cột sen |
| `GUILD-DT-TD-02` | Niệm Phật Đường | tượng A Di Đà cố định; tràng hạt treo tường (dùng được) |
| `GUILD-DT-TD-03` | Tàng Kinh | giới thiệu 7 kinh theo việc (`JING_ZHOU`) |
| `GUILD-DT-TD-04` | Liêu Xá | — |
| `GUILD-DT-TD-05` | Trai Đường | nấu cháo chay, chè sen |
| `GUILD-DT-TD-06` | Khố Phòng | kho gạo bố thí (vật phẩm lễ) |
| `GUILD-DT-TD-07` | Giảng Đường | — |
| `GUILD-DT-TD-08` | Lầu Chuông Mõ | mõ lớn bằng gỗ mít |
| `GUILD-DT-TD-09` | Ao Phóng Sinh | ao rộng, cá tự sinh sôi theo mùa (không «mua cá thả») |
| `GUILD-DT-TD-10` | Khách Đường | — |
| `GUILD-DT-TD-11` | **Cửu Phẩm Liên Đài** | đài sen chín tầng giữa ao, đi lên được bằng cầu đá; mỗi tầng một gian nhỏ có mô tả một phẩm (theo giáo lý Tịnh Độ — giới thiệu); đèn từng tầng sáng theo **việc thiện tập thể của tuần** (không theo cá nhân). Công năng: «Đài Hồi Hướng» — nơi chọn dự án hồi hướng cho cả Liên Xã |

### 3.2.9 Lưu ý tôn trọng

- Cửu phẩm liên hoa là giáo lý về vãng sinh; game không dùng nó làm **thang xếp hạng** người chơi (không ai «phẩm cao» hơn ai).
- Không có tình huống niệm Phật «đổi» được kết quả vận hạn.
- Phóng sinh như §3.2.4.

### 3.2.10 Câu thoại sinh hoạt (Diệu Âm)

| Dịp | Câu |
|---|---|
| Liên Xã mới lập | «Mười người niệm thì mười người nghe nhau. Thế đã là đông.» |
| Khánh thành Liên Đài | «Đài cao rồi. Đứng trên đó nhìn xuống làng, thấy ai thiếu gì thì xuống giúp.» |
| Thành viên sám hối xong một việc | «Nói xin lỗi xong rồi làm. Làm xong thì thôi tự trách.» |
| Bố thí xong | «Gạo hết rồi, nhưng người ta nhớ mặt con. Lần sau đi đừng để người ta phải cảm ơn.» |
| Hưu đường | «Ao còn, cá còn. Chị ra cho cá ăn hộ các em.» |

---

## 3.3 `GUILD-MT` — Chuẩn Đề Mật Tông (Tạng Địa) ⚠ chờ tham vấn

> **Trạng thái:** thiết kế khung, **cờ `enabled: false`** cho đến khi có cố vấn nội dung (canon §3: «Tạng truyền **chờ tham vấn**»). Mọi mục có dấu ⚠ cần duyệt lại. Phần chắc chắn được dùng ngay là phần dựa trên **Chuẩn Đề** đã có trong app (`remedy-fate › ZHUNTI`, `CHAN_HUI › 金剛薩埵`) — vốn có mặt trong Phật giáo Hán – Việt, không phụ thuộc Tạng truyền.

### 3.3.1 Thẻ tông

| Mục | Nội dung |
|---|---|
| Thánh địa | `tangdia` — Tạng Địa Tuyết Vực (−1500, −1300) |
| Chưởng giáo | `lama_dakiet` — Lạt-ma Đa Kiệt ⚠ |
| Dữ liệu app | `remedy-fate › ZHUNTI`, `CHAN_HUI` |
| Tu gì | quán tưởng, mạn-đà-la cát, vô thường (bánh xe kinh ⚠) |
| Hành lễ | Thủy |
| Loại chi đường | **Chuẩn Đề Đàn** |
| Điều kiện nhập | cảnh giới 5 |
| Giới riêng | «Làm đẹp rồi buông. Giữ lại là chưa xong.» |
| Màu cờ | lam thẫm, viền vàng |

### 3.3.2 Danh xưng chức sự

| Chức chung | Ở Chuẩn Đề Đàn |
|---|---|
| Chủ Trì | Đàn Trưởng |
| Phó Trì | Phó Đàn |
| Trưởng Lão | Lão Cư Sĩ |
| Tri Khách | Tri Khách |
| Tri Khố | Thủ Khố |
| Chủ Lễ | Duy Na |
| Giám Viện | Giám Tác |
| Thư Ký | Thư Ký |
| Giáo Tập | Hướng Dẫn Quán |

### 3.3.3 Pháp danh cư sĩ

- Chữ đầu (1 trong 3): **Chánh**, **Tịnh**, **Kim**.
- Chữ sau (40): Minh, Quang, Chiếu, Tâm, Tuệ, Trí, Giác, Định, An, Hòa, Thanh, Như, Chân, Nguyện, Hạnh, Đức, Liên, Châu, Ngọc, Cương, Luân, Vân, Tuyết, Sơn, Hải, Nguyệt, Tinh, Đăng, Hương, Hoa, Tín, Thành, Kính, Khiêm, Nhẫn, Từ, Bi, Hỷ, Xả, Viên.

### 3.3.4 Chuỗi nhập tông `GUILD-Q-MT-00` «Cát và nước»

| Bước | Việc | Cơ chế | Engine |
|---|---|---|---|
| 00.1 | **Mạn-đà-la cát** một mình | rắc cát màu theo một mẫu hình học **hư cấu của game** (đối xứng 8 hướng, không chép mẫu mạn-đà-la thật); xong thì **tự tay xóa**, đổ cát xuống suối | tài liệu 09 (mini-game mới) |
| 00.2 | **Đọc giới thiệu Chuẩn Đề** | đọc phần giới thiệu `ZHUNTI` (ý nghĩa, lịch sử, cách người xưa trì) — không hiển thị toàn văn chú | `ZHUNTI` |
| 00.3 | **Trao đi một thứ mình làm** | làm một ngọn đèn bơ ⚠ (hoặc đèn dầu thường nếu chưa tham vấn) rồi tặng cho một NPC hành hương đang cần ánh sáng; vật không quay lại với người chơi | — |

### 3.3.5 Tông lễ `GUILD-RITE-MT-01` «Mạn-đà-la Chung»

- **Pha Hành (10 phút):** sân có một vòng tròn lớn chia 8 cánh × 3 vòng = 24 ô. Mỗi người nhận một ô và một mẫu nhỏ; rắc cát theo mẫu. Ô đúng mẫu thì phát sáng nhẹ. Khi đủ 24 ô (hoặc hết giờ), Duy Na/NPC gõ chuông: **mọi người cùng quét** cát vào giữa, gom vào bình, đổ xuống suối.
- Chất lượng `q` = tỷ lệ ô đúng mẫu × (1 nếu cả đàn cùng quét trong 30 giây).
- **Không có ảnh chụp lưu lại** mạn-đà-la trong game (tính năng chụp ảnh tắt trong pha này): điều đó là một phần của bài học vô thường.
- **Lời Lạt-ma Đa Kiệt** ⚠: «Đẹp không? Đẹp. Giờ quét.» / «Cát ra suối, suối ra sông. Không mất đâu cả.»

### 3.3.6 Đường lễ, việc tuần, đạo tràng (khung)

| Mã | Tên | Ghi chú |
|---|---|---|
| `GUILD-RITE-MT-02` | Quán Tưởng Ánh Sáng | tĩnh tọa với điểm sáng xanh lam (như Tồn tư nhưng nội dung giảng theo Chuẩn Đề) |
| `GUILD-RITE-MT-03` | Sám Hối Kim Cương Tát Đỏa | giới thiệu `CHAN_HUI › 金剛薩埵` bằng lời giảng; hành động sửa như Liên Xã |
| `GUILD-RITE-MT-04` ⚠ | Đi Vòng Kinh Luân | chỉ sau tham vấn |

| Mã việc | Tên | Đếm | Mục tiêu |
|---|---|---|---|
| `GUILD-Q-MT-01` | Cát rồi buông | số mạn-đà-la nhỏ hoàn thành và tự xóa | 40 |
| `GUILD-Q-MT-02` | Ánh sáng xanh | phút quán tưởng | 300 |
| `GUILD-Q-MT-03` | Đèn cho người đi núi | số đèn tặng NPC hành hương | 30 |
| `GUILD-Q-MT-04` | Sám hối có việc sửa | bước `CHAN_HUI` có sửa | 15 |
| `GUILD-Q-MT-05` | Đường tuyết | công sức `EV-CAU` đoạn Tạng Địa | 300 công |
| `GUILD-Q-MT-06` | Tử Vi trên núi tuyết | khách Sảnh Tử Vi ≥ 70% | 12 |
| `GUILD-Q-MT-07` | Đọc vô thường | mục giới thiệu (cần bổ sung dữ liệu) | 20 |
| `GUILD-Q-MT-08` | Gom cát | lượt mang cát màu từ suối về (vật liệu cho mạn-đà-la) | 120 |
| `GUILD-Q-MT-09` | Ngồi trước tuyết | phút tĩnh tọa ở điểm ngắm tuyết | 300 |
| `GUILD-Q-MT-10` ⚠ | Vòng quanh đền | chỉ sau tham vấn | — |

Đạo tràng: `GUILD-DT-MT-01…10` theo khung chung với kiến trúc nguyên mẫu Tạng Địa (tài liệu 07/08) ⚠; `GUILD-DT-MT-11` tạm thời là **Chuẩn Đề Các** (gác hai tầng, sân cát cho mạn-đà-la, phòng quán tưởng); phương án **Kinh Luân Lầu** chỉ làm sau tham vấn.

### 3.3.7 Câu thoại sinh hoạt ⚠

| Dịp | Câu |
|---|---|
| Đàn mới lập | «Đàn mới thì cát mới. Cứ rắc.» |
| Khánh thành | «Nhà này cũng sẽ cũ. Thế nên ở cho vui.» |
| Hưu đường | «Đàn tan như cát. Các con thì không tan.» |

---

## 3.4 `GUILD-NH` — Tịnh Minh Nho Tông (Văn Miếu Quốc Tử Giám)

### 3.4.1 Thẻ tông

| Mục | Nội dung |
|---|---|
| Thánh địa | `vanmieu` — Văn Miếu Quốc Tử Giám (0, 1900) |
| Chưởng giáo | `te_tuu` — Tế tửu Văn Miếu (Chu Văn Trinh) |
| Dữ liệu app | `schools-data › jingming`; `remedy-fate › LIAOFAN_STORY`, `TEN_THIEN`; `spiritual-fs (仁義禮智信)`; `library-data`; `naming` |
| Tu gì | khoa cử, công quá cách, đặt đạo hiệu, hiếu đạo |
| Hành lễ | Mộc |
| Loại chi đường | **Văn Hội** |
| Giới riêng | «Học để làm người, không học để hơn người.» |
| Màu cờ | đỏ thẫm, viền xanh ngọc |

**Tịnh Minh** (淨明道, gắn với Hứa Tốn) đề cao trung – hiếu. Trong game, phần Tịnh Minh của tông là **chuỗi hiếu đạo** với các gia đình NPC ở Huyền Thành (canon §5.3 «kính lão / hiếu: chuỗi gia đình NPC ở Huyền Thành»).

### 3.4.2 Danh xưng chức sự

| Chức chung | Ở Văn Hội |
|---|---|
| Chủ Trì | Hội Trưởng |
| Phó Trì | Phó Hội Trưởng |
| Trưởng Lão | Lão Sinh |
| Tri Khách | Tri Khách |
| Tri Khố | Thủ Quỹ |
| Chủ Lễ | Tế Chủ |
| Giám Viện | Giám Tạo |
| Thư Ký | Thư Biện |
| Giáo Tập | Giảng Tập |

Danh hiệu khoa cử (Cử nhân, Tiến sĩ…) **không** dùng làm cấp chi đường; chúng là danh hiệu hoạt động Khoa cử (tài liệu 09), luôn ghi kèm «danh hiệu trò chơi».

### 3.4.3 Tên hiệu

Tên hiệu (號) gồm 2 chữ; người chơi chọn tự do giữa hai danh sách (không cần chữ đầu cố định):

- Danh sách 1 (40): Mặc, Tĩnh, Thanh, Ức, Nam, Bắc, Đông, Tây, Cúc, Trúc, Mai, Lan, Tùng, Liễu, Khê, Sơn, Hồ, Giang, Thôn, Viên, Am, Hiên, Đình, Trai, Phố, Ẩn, Nhàn, Lạc, Thuần, Phác, Chuyết, Khiêm, Trung, Hòa, Kính, Thành, Minh, Văn, Học, Độc.
- Danh sách 2 (40): Trai, Hiên, Am, Phố, Khê, Sơn, Đình, Viên, Ông, Sinh, Tử, Cư, Ẩn, Nhân, Sĩ, Phu, Tẩu, Hạc, Vân, Nguyệt, Tuyết, Phong, Thạch, Trúc, Mai, Tùng, Lâm, Châu, Đảo, Tuyền, Đường, Các, Lâu, Song, Hiên, Thư, Bút, Mặc, Nghiên, Chỉ.

Tên hiệu được chấm bằng `naming.js › analyzeName` như tên tu các tông khác (Phần 01 §1.4). Ví dụ «Mặc Khê», «Tĩnh Phố», «Cúc Hiên», «Chuyết Am».

Không cho tổ hợp trùng tên hiệu của danh nhân có thật quá nổi tiếng (Ức Trai, Bạch Vân, Tố Như, Thanh Hiên, Nam Hoa…) — danh sách đen biên tập.

### 3.4.4 Chuỗi nhập tông `GUILD-Q-NH-00` «Ba ngày công quá»

| Bước | Việc | Cơ chế | Engine |
|---|---|---|---|
| 00.1 | **Tiểu khảo** 10 câu | câu hỏi rút từ `library-data`, `DITIANSUI_MAXIMS` và một lá số khách (`cases.js`); đạt ≥ 6/10 qua; trượt thì Tế tửu chỉ trang sách cần đọc, thi lại sau 1 giờ | `library-data`, `cases.js` |
| 00.2 | **Công quá cách 3 ngày** | 3 ngày liền, mỗi ngày mở Sổ Công Quá ghi việc thiện/lỗi **trong game** (tự động gợi ý từ nhật ký) và đọc lời nhận xét `meritLedger`; ngày thứ 3 gặp Tế tửu | `remedy-fate › CONG_QUA`, `meritLedger`, `LIAOFAN_STORY` |
| 00.3 | **Đặt tên hiệu** | §3.4.3 | `naming` |

**Cảnh 00.2-end (đầy đủ):**

```
[CẢNH GUILD-Q-NH-00.2c · Giảng đường Quốc Tử Giám · sáng, giờ Thìn · tiếng đọc sách xa]
TẾ TỬU: (lật sổ của người chơi) Ba ngày. Ngày thứ hai con ghi một lỗi: «nói dối bà hàng nước». Sao con ghi?
> Lựa chọn:
  ① «Vì con nói dối thật.» → [a]
  ② «Vì con sợ thầy biết mà không ghi thì bị trừ điểm.» → [b]
  ③ «Con ghi nhầm, xóa được không ạ?» → [c]

[a] TẾ TỬU: Liễu Phàm ngày xưa cũng ghi lỗi trước. Ghi được lỗi là học được nửa sách.
[b] TẾ TỬU: Thầy không trừ điểm ai vì ghi lỗi. Người ghi lỗi thật thà thì thầy quý hơn người ghi toàn việc thiện.
[c] TẾ TỬU: Sổ của con, con muốn xóa thì xóa. Nhưng con nhớ thì vẫn nhớ. Thôi, để đó, mai làm việc tốt bù.

TẾ TỬU: (gấp sổ) Học để làm người, không học để hơn người. Ra chọn tên hiệu đi.
→ (mọi nhánh) qua bước; nhánh [a] ghi thêm «Giữ lời, không dối» +1 cho chính việc thật thà
```

**Quy tắc:** Sổ Công Quá trong chuỗi này là sổ **trong game** (canon §5.3). Sổ đời thực tùy chọn của người chơi **không** liên quan và **không** gửi lên máy chủ.

### 3.4.5 Tông lễ `GUILD-RITE-NH-01` «Thích Điện Tiểu Lễ»

- **Nơi:** sân Đại Thành (nguyên mẫu Văn Miếu).
- **Pha Hành (9 phút) — hai đoạn:**
  1. **Dâng lễ theo thứ tự** (4 phút): sáu người đứng hai hàng mang 6 khay (hương, hoa, trà, quả, sách, bút) **theo đúng trình tự** Tế tửu hô; người khác đứng chầu, cúi chào theo nhịp. Lễ vật là **trà và hoa quả** (không dùng rượu, phù hợp mọi lứa tuổi).
  2. **Hội Văn — đối câu** (5 phút): Tế tửu ra vế trên; mọi người chọn vế dưới trong 4 lựa chọn (chỉ một vế đối chỉnh về thanh, từ loại, ý). Vế đối đều **viết mới** cho game. Ví dụ (6 cặp mẫu, mỗi mùa thêm 30):

| Vế ra | Vế đối đúng | Hai vế nhiễu tiêu biểu |
|---|---|---|
| Sân thềm rêu biếc chờ người đọc | Giá sách đèn khuya đợi kẻ chăm | «Trời cao mây trắng bay về núi» (sai từ loại) · «Bàn học sáng trưng có kẻ ngồi» (sai thanh) |
| Trước cửa trúc xanh nghiêng bóng gió | Bên thềm mai trắng thắm màu sương | — |
| Một nét bút ngay lòng chẳng lệch | Trăm trang sách mở mắt thêm tinh | — |
| Nước chảy đá mòn công chẳng uổng | Gió đưa hương lặng đức nào phai | — |
| Hiếu kính mẹ cha nền nếp cũ | Thương yêu làng xóm nghĩa tình xưa | — |
| Gieo chữ nơi đây chờ lúa chín | Dựng người từ đó đợi cây cao | — |

- **Không đọc văn tế thật**; lời chúc văn là bài viết mới (1 bài/mùa).
- **Lời Tế tửu:**
  - Mở: «Hôm nay mỗi người mang một khay. Khay nặng hay nhẹ, đi cho thẳng là được.»
  - Khép: «Chữ để người đọc, không để treo. Về nhà đọc cho cha mẹ một trang.»

### 3.4.6 Đường lễ của Văn Hội

| Mã | Tên | Pha Hành |
|---|---|---|
| `GUILD-RITE-NH-02` | Hội Văn | đối câu theo nhóm 3 người; Tế Chủ (người chơi) ra vế từ kho |
| `GUILD-RITE-NH-03` | Giảng Sách | Giảng Tập chọn một mục `library-data`; mỗi người đọc và chọn một câu tâm đắc (từ trích đoạn app đã có) đặt lên bảng chung |
| `GUILD-RITE-NH-04` | Tạ Thầy | dịp Ngày Nhà giáo (Phần 10 `EV-NHAGIAO-01`) hoặc khi một đệ tử xuất sư (Phần 04 §4.1); đệ tử dâng trà sư phụ ở Giảng Đường |

### 3.4.7 Kho việc tuần

| Mã | Tên | Hành động đếm | Mục tiêu | Engine / nơi |
|---|---|---|---|---|
| `GUILD-Q-NH-01` | Thi cùng nhau | số lượt dự khoa cử (hương/hội/đình thí — tài liệu 09) | 30 | tài liệu 09 |
| `GUILD-Q-NH-02` | Văn hội đọc sách | số «trang đọc» ở Tàng Thư Các | 80 | `library-data` |
| `GUILD-Q-NH-03` | Ghi sổ công quá | số ngày-người có ghi Sổ Công Quá | 70 | `CONG_QUA` |
| `GUILD-Q-NH-04` | Hiếu đạo | số bước chuỗi gia đình NPC Huyền Thành | 20 | tài liệu 05/06 |
| `GUILD-Q-NH-05` | Đặt tên cho khách | số khách NPC được đặt tên/đổi tên hợp Dụng ≥ 70% | 12 | `naming` |
| `GUILD-Q-NH-06` | Đối câu | số vế đối đúng | 100 | §3.4.5 |
| `GUILD-Q-NH-07` | Thư Lâu | số tầng thư đọc ở Thư Lâu (station `thuvien` có sẵn) | 30 | `halls.js › thuvien` |
| `GUILD-Q-NH-08` | Đường đến Văn Miếu | công sức `EV-CAU` đoạn Văn Miếu | 300 công | Phần 08 |
| `GUILD-Q-NH-09` | Kèm người mới | số giờ Giảng Tập dạy người cảnh giới 1–2 (lớp ở Giảng Đường) | 15 | Phần 04 §4.1 |
| `GUILD-Q-NH-10` | Vạch thầy bói rởm | số lần đối chiếu lời phán Định Mệnh Hội với lá số thật | 8 | `anti-manipulation-data` |

### 3.4.8 Đạo tràng Văn Hội

| Mã | Tên | Nét riêng |
|---|---|---|
| `GUILD-DT-NH-01` | Nghi Môn | cổng tam quan kiểu văn chỉ làng |
| `GUILD-DT-NH-02` | Văn Từ | bàn thờ chữ «Văn» và bài vị **chung** «Tiên hiền», không bài vị danh nhân có thật |
| `GUILD-DT-NH-03` | Thư Các | — |
| `GUILD-DT-NH-04` | Học Xá | phòng nghỉ kiểu trường xưa, án thư |
| `GUILD-DT-NH-05` | Thiện Đường | nấu chè, bánh trôi (ăn mừng thi đỗ) |
| `GUILD-DT-NH-06` | Thủ Quỹ Phòng | — |
| `GUILD-DT-NH-07` | Giảng Đường | 24 án thư; lớp học của Giảng Tập; nơi Hội Văn |
| `GUILD-DT-NH-08` | Lầu Trống | trống báo giờ học |
| `GUILD-DT-NH-09` | Vườn Văn | ao vuông giữa vườn cây (cảm hứng Thiên Quang Tỉnh nhưng nhỏ, không chép) |
| `GUILD-DT-NH-10` | Khách Đường | — |
| `GUILD-DT-NH-11` | **Tụ Văn Lầu** | lầu hai tầng, mái bốn mái, **thiết kế khác Khuê Văn Các** (biểu tượng của Hà Nội không dùng làm nhà người chơi); tầng dưới là **Trường Thi Nội Hội** — thi thử trong đường (đề rút như khoa cử); tầng trên là **Bảng Vàng Giấy** — cuộn giấy treo tường ghi tên tu của thành viên đỗ khoa cử trong mùa (giấy, không phải bia đá; bia Tiến sĩ thật là di sản, không mô phỏng việc khắc tên người chơi) |

### 3.4.9 Lưu ý tôn trọng

- Văn Miếu – Quốc Tử Giám là di tích quốc gia đặc biệt; 82 bia Tiến sĩ là Di sản tư liệu thế giới. Game dựng nguyên mẫu ở thánh địa (tài liệu 07) nhưng **không** cho người chơi khắc tên lên bia đá, không dùng bia làm vật phẩm.
- Không bán «may mắn thi cử» (không vật phẩm Ngọc nào tăng điểm khoa cử). Lễ ở Văn Xương Các (`vanxuong` room) là lễ chúc chăm học, không phải mua điểm.
- Thờ Khổng Tử và tiên hiền: chỉ thể hiện ở thánh địa theo nguyên mẫu; đạo tràng người chơi chỉ có bài vị chung.

### 3.4.10 Câu thoại sinh hoạt (Tế tửu)

| Dịp | Câu |
|---|---|
| Văn Hội mới lập | «Một hội đọc sách mà mười người đọc chung một quyển thì tốt hơn mười quyển một người.» |
| Thành viên thi trượt | «Trượt thì biết mình chưa biết gì. Biết thế là đã hơn hôm qua.» |
| Thành viên thi đỗ | «Đỗ rồi thì về dạy em. Không dạy được thì chưa đỗ.» |
| Bầu Hội Trưởng | «Hội Trưởng là người mài mực cho cả hội.» |
| Hưu đường | «Sách để lại Thư Các cho người sau. Thế là hội vẫn còn.» |

---

## 3.5 Y Lư Miêu Cương — hội nghề (không phải tông)

### 3.5.1 Vì sao là hội nghề

Như Phần 01 §1.2: Bàng môn không lập tông. **Y Lư** (醫廬 — lều thuốc) là nơi Vu y bà A Mậu (`vu_y_amau`) dạy y dược theo ngũ hành (`tcm`). Ai cũng vào được, không cần cảnh giới, không rời tông của mình.

| Có | Không có |
|---|---|
| Bảng việc hái thuốc chung (theo mùa, theo vùng) | cấp bậc, chức sự |
| Lớp học của bà A Mậu (thu sẵn, không AI) | kho, bỏ phiếu, đạo tràng riêng |
| Huy hiệu «Người hái thuốc» (3 bậc) | bất kỳ nội dung cổ thuật, yểm thuật |
| Một chỗ ngồi chung bên bếp lửa (đồng tu nhỏ, 8 chỗ) | |

### 3.5.2 Bảng việc Y Lư (luân phiên theo tiết khí)

| Mùa (tiết khí) | Việc | Đếm | Ghi chú |
|---|---|---|---|
| Lập Xuân → Cốc Vũ | hái lá non theo hành Mộc | 300 lượt (toàn máy chủ, theo tầng dân số Phần 08 §8.6) | — |
| Lập Hạ → Đại Thử | phơi thảo, che nắng cho người già trong trại | 200 | Đoan Ngọ có việc riêng (Phần 10) |
| Lập Thu → Sương Giáng | hái hạt, quả | 300 | — |
| Lập Đông → Đại Hàn | sắc nước ấm cho người đi đường (vật phẩm sự kiện) | 400 | — |

Mọi việc Y Lư mô tả cây thuốc theo **ngũ hành và mùa** (`tcm`), không nêu công dụng chữa bệnh cụ thể, và luôn có câu cố định của bà A Mậu khi người chơi hỏi về bệnh: «Cái đó phải để thầy thuốc xem. Bà chỉ biết cây.»

### 3.5.3 Lưu ý tôn trọng (Miêu Cương)

- Người Miêu trong game là **người chữa và nạn nhân**, kẻ ác là yểm sư từ bên ngoài (bản sơ đồ §5.5). Y Lư củng cố hình ảnh đó.
- Trang phục, nhà sàn, khèn, trống đồng ở Miêu Cương cần cố vấn văn hóa (tài liệu 07, 14). Lễ hội Miêu Cương trong lịch (Phần 10 `EV-KHENTRANG-01`) là **lễ hư cấu**, không mượn tên lễ thật của một dân tộc.

---

## 3.6 Bảng tổng hợp chín tông

| Mã | Tông | Hành lễ | Chi đường | Cảnh giới nhập | Cổng / trạng thái | Công trình T6 | Tông lễ |
|---|---|---|---|---|---|---|---|
| `GUILD-CN` | Chính Nhất | Hỏa | Pháp Đàn | 2 | — | Thiên Sư Lầu | Tiểu Tiếu Đàn |
| `GUILD-TV` | Thanh Vi Đan Đỉnh | Mộc | Đan Viện | 2 | — | Kim Đỉnh Đình | Thái Cực Hội |
| `GUILD-TC` | Toàn Chân Linh Bảo | Thổ | Đạo Am | 2 | lệ thập phương | Đạo Tạng Lâu | Vãn Khóa / Độ Nhân |
| `GUILD-TT` | Thượng Thanh Lư Sơn | Kim | Tĩnh Thất | 2 | Âm tà (một phần) | Hoa Dương Động | Tồn Tư Đàn |
| `GUILD-BD` | Bắc Đế | Thủy | Độ Đàn | 5 | — | Độ Nhân Kiều | Đăng Kiều |
| `GUILD-TH` | Trúc Lâm Thiền | Thổ | Thiền Am | 2 | vùng im lặng | Thiền Đường Vạn Tùng | Thiền Thất Tuần |
| `GUILD-TD` | Tịnh Độ | Hỏa | Liên Xã | 2 | — | Cửu Phẩm Liên Đài | Liên Đăng Niệm |
| `GUILD-MT` | Chuẩn Đề Mật | Thủy | Chuẩn Đề Đàn | 5 | ⚠ chờ tham vấn | Chuẩn Đề Các (tạm) | Mạn-đà-la Chung |
| `GUILD-NH` | Tịnh Minh Nho | Mộc | Văn Hội | 2 | — | Tụ Văn Lầu | Thích Điện Tiểu Lễ |
| *(Y Lư)* | hội nghề | — | — | 1 | — | — | — |

## 3.7 Checklist nghiệm thu Phần 03

- [ ] Pháp danh/tên hiệu chỉ ghép từ danh sách; danh sách đen tên hiệu danh nhân hoạt động.
- [ ] Trong pha lễ có «vùng im lặng», máy chủ từ chối `say`/`emo` (trừ `palm` (chắp tay)) — có test.
- [ ] Kinh hành: tốc độ đo từ gói `mv` phía máy chủ, không tin client.
- [ ] Không màn hình nào của ba tông Phật giáo hiển thị toàn văn kinh/chú.
- [ ] Phóng sinh: không tồn tại hành động «mua cá để thả» ngoài sự kiện chim bị bắt có trong cốt truyện, giới hạn 1/tuần.
- [ ] `GUILD-MT` ẩn hoàn toàn khi `enabled: false` (test giao diện + giao thức từ chối `mon: 'MT'`).
- [ ] Tụ Văn Lầu khác thiết kế Khuê Văn Các (duyệt mỹ thuật); không có bia đá khắc tên người chơi.
- [ ] Y Lư: không có cấp bậc/kho; câu chuyển hướng y tế xuất hiện mọi khi hỏi về bệnh.
