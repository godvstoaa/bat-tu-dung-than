# Ánh xạ BaZi ↔ Western Astrology — Nghiên cứu so sánh có trích dẫn

> Tài liệu nghiên cứu (read-only) cho sơ đồ tổng hợp BaZi + Western của app.
> Mục tiêu: xác minh + mở rộng `BAZI_WESTERN_MAP` hiện tại (8 khóa) trong
> `src/engine/western-kb.js` thành một ánh xạ đầy đủ theo **chiều đời (life dimension)**.
>
> **Tuyên bố trung thực (bắt buộc):** Cả BaZi và Western astrology đều **KHÔNG**
> được kiểm chứng khoa học. Mọi tương ứng dưới đây là **song hành biểu tượng
> (thematic parallel)** giữa hai hệ thống cổ truyền có nền tảng triết lý khác
> nhau — **không phải tương đương 1-1**. Cảm giác "đúng quá" phần lớn là hiệu ứng
> Barnum (nhận định chung áp vào ai cũng thấy hợp). Dùng như gương phản tỉnh đa
> góc, KHÔNG dùng để quyết định chuyện hệ trọng.

---

## 0. Tổng quan: hai hệ thống, hai nền tảng

| Khía cạnh | BaZi (八字 / Tứ Trụ) | Western Astrology |
|---|---|---|
| **Nền tảng** | Chu kỳ thời gian (tiết khí), Thiên Can + Địa Chi | Vị trí hành tinh thực tế lúc sinh (ephemeris) |
| **Cấu trúc lá số** | 4 Trụ (Năm/Tháng/Ngày/Giờ) = 8 chữ | 12 nhà + hành tinh + cung + aspects |
| **Động cơ dự báo** | **Tất định**: Đại vận 10 năm + lưu niên tính sẵn từ trụ tháng | **Phản ứng**: transit hành tinh theo thời gian thực |
| **Đơn vị "cốt lõi"** | Nhật Chủ (Day Master) + ngũ hành | Mặt Trời (Sun) + 10 hành tinh |
| **Nguồn gốc** | Trung Hoa cổ (phát triển phần lớn độc lập) | Babylon → Hy Lạp/Hy Lạp hóa (Horoscopic) |
| **Mạnh ở** | Định thời (timing), vận trình, chiến lược thực tế | Tâm lý, cảm xúc, self-discovery |

> Câu hỏi cốt lõi khác nhau: Western hỏi *"các hành tinh ở đâu?"*; BaZi hỏi
> *"phẩm chất năng lượng của khoảnh khắc đó là gì?"* — chưng cất thành ngũ hành.
> ([Eastern Fate](https://www.easternfate.com/blog/bazi-vs-western-astrology),
> [BaziFortune](https://bazifortune.app/blog/bazi-vs-western-astrology-key-differences),
> [Wikipedia – Four Pillars of Destiny](https://en.wikipedia.org/wiki/Four_Pillars_of_Destiny))

---

## 1. BẢNG TÓM TẮT — Ánh xạ theo chiều đời (life dimension)

Cường độ tương ứng: **STRONG** (song hành rõ) · **APPROXIMATE** (gần đúng, có lưu ý) · **WEAK** (chỉ tương đồng mờ) · **NONE** (không có tương đương sạch).

| # | Chiều đời | Khái niệm BaZi | Khái niệm Western | Cường độ | Ghi chú tiếng Việt (1 câu) |
|---|---|---|---|---|---|
| 1 | Bản ngã / cái tôi (core identity) | **Nhật Chủ** (Day Master 日主) + can năm | **Mặt Trời** (Sun) + chart ruler | **STRONG→APPROXIMATE** | Nhật Chủ là "bạn là ai" cốt lõi — gần nhất với cung Mặt Trời; nhưng BaZi lấy "bạn" từ ngày sinh (nguyên tố), Western từ vị trí thật của Mặt Trời. |
| 2 | Cảm xúc / nội tâm (inner world) | **Chính Ấn / Thiên Ấn** (Resource) + chi tháng | **Mặt Trăng** (Moon) + nhà 4 | **APPROXIMATE** | Ấn = mẹ/sự nuôi dưỡng ≈ Mặt Trăng; nhưng Ấn còn mang nghĩa quyền lực/khác, không hoàn toàn trùng. |
| 3 | Ngoại hình / bề ngoài (persona) | **Trụ Giờ / giờ sinh** (Hour Pillar) | **Ascendant** (Rising) + nhà 1 | **WEAK→NONE** | BaZi KHÔNG có "mặt nạ bề ngoài" chuẩn; Trụ Giờ là tương đương mờ nhất (đồng thời là cung con cái + tuổi già). |
| 4 | Giao tiếp / trí tuệ (mind) | **Thương Quan** (伤官, chính) + **Thực Thần** (食神) — Output stars | **Sao Thủy** (Mercury) + nhà 3 (+ **Uranus** cho Thương Quan phản kháng) | **APPROXIMATE** | Thương Quan = ngôn từ/trí tuệ sắc ≈ Mercury + Uranus; "Output" BaZi rộng hơn giao tiếp (bao gồm sáng tạo → cũng dính nhà 5). |
| 5 | Tình cảm / hôn nhân (love, partnership) | **Cung Phu Thê = Chi Ngày** (Day Branch) + Sao Vợ/Chồng (Tài cho nam, Quan cho nữ) | **Nhà 7** (Descendant) + **Sao Kim** (Venus) | **STRONG→APPROXIMATE** | Cả hai đều dùng "vị trí đối diện cái tôi" để xem bạn đời; cơ chế khác (ngũ hành vs phân nhà). |
| 6 | Hành động / nghị lực / drive | **Thất Sát** (Qi Sha 七杀) + **Kiếp Tài** (Rob Wealth) | **Sao Hỏa** (Mars) + (Sao Diêm Vương Pluto) | **APPROXIMATE→STRONG** | Thất Sát = năng lượng chiến binh/quyết liệt gần Mars/Pluto rất hợp lý. |
| 7 | Mở rộng / may mắn / triết lý | **Thiên Ấn / Thiên Tài** (Indirect Wealth/Resource) | **Sao Mộc** (Jupiter) + nhà 9 | **APPROXIMATE** | Sao Mộc = mở rộng/lạc quan/triết lý; BaZi không có hành tinh "may mắn" riêng, gần nhất là Tài/Ấn phù hợp. |
| 8 | Kỷ luật / giới hạn / cấu trúc | **Chính Quan + Thất Sát** (Officer stars) | **Sao Thổ** (Saturn) | **STRONG→APPROXIMATE** | Chính Quan = kỷ luật/quyền uy ≈ Saturn — đây là một trong những song hành rõ nhất. |
| 9 | Sự nghiệp / danh vọng | **Chính Quan** (Direct Officer) + chi tháng | **Sao Thổ** (Saturn) + **nhà 10 / MC** | **STRONG→APPROXIMATE** | Cả hai đều gắn sự nghiệp với "nguyên tắc/quyền uy cấu trúc" (Quan / Saturn / MC). |
| 10 | Tài chính / giá trị | **Chính Tài + Thiên Tài** (Wealth stars 正财/偏财) | **Nhà 2** (và nhà 8) + **Sao Kim** (Venus) + (Sao Mộc Jupiter) | **STRONG→APPROXIMATE** | Sao Vợ=Tiền trong BaZi (nam) — Tài ≈ Venus/2nd house; nhưng BaZi không có "nhà tiền" cố định. |
| 11 | Sức khỏe / thể chất | **Sức mạnh Nhật Chủ + xung hình/hại** (clashes) | **Nhà 6** + **nhà 1** + Ascendant ruler | **WEAK→APPROXIMATE** | Western có nhà 6 chuyên biệt cho sức khỏe; BaZi đọc bệnh qua ngũ hành vượng suy + xung đột — song hành mờ. |
| 12 | Gia đình / cha mẹ / con cái | **Trụ Năm** (tổ tiên) + **Ấn** (mẹ) + **Thiên Tài** (cha) + **Trụ Giờ** (con) | **Nhà 4 & 10** (cha mẹ) + **nhà 5** (con) | **APPROXIMATE** | Cả hai đều tách cha/mẹ/con ra các vị trí khác, nhưng gán vị trí không giống nhau. |
| 13 | Thời điểm / tương lai / vận trình | **Đại Vận** (Da Yun 大运, 10 năm) + **Lưu Niên** (năm) | **Transit** (đặc biệt Saturn return) + **Secondary progressions** | **APPROXIMATE** | Đại vận = "mùa" 10 năm tất định; Western = transit phản ứng theo thời gian thực. Saturn Return (~28-30) không có tương đương BaZi chính xác. |
| 14 | Bản chất ngũ hành / nguyên tố | **Ngũ hành** (Kim-Mộc-Thủy-Hỏa-Thổ, 5 PHA) | **4 nguyên tố** (Hỏa-Thổ-Khí-Thủy, 4 CHẤT) | **WEAK (hệ khác)** | Trùng tên Hỏa/Thủy nhưng nền khác: BaZi có Mộc+Kim (không có Khí); Western có Khí (không tách Kim/Mộc). |
| 15 | Cách cục / toàn lá số (overall pattern) | **Cách cục (格局/geju)**: Chính Quan Cách, Thực Thần Cách, Thất Sát Cách... | **Chart shape** (stellium, bowl, bucket, splay) + **element balance** + chart ruler | **APPROXIMATE** | Cả hai đều nắm "kiểu cấu trúc tổng thể" nhưng công cụ khác: BaZi = "cách" do sao hữu dụng định; Western = hình học + cân bằng nguyên tố. |

---

## 2. BẢNG PHỤ — Thập Thần (Ten Gods 十神) ↔ hành tinh/nhà Western

Thập Thần là 10 "kiểu nhân cách quan hệ" của BaZi, suy từ quan hệ ngũ hành với Nhật Chủ. Đây là **công cụ chính** để dịch BaZi sang ngôn ngữ "hành tinh" của Western.

> ⚠️ **CAVEAT QUAN TRỌNG (báo cho user):** KHÔNG có tương ứng 1-1 chính thống học thuật giữa
> Thập Thần và hành tinh Western. Mọi ghép dưới đây là **lớp phủ diễn giải của các thực hành
> giả tổng hợp hiện đại (syncretic overlay)**, không phải phương trình cổ điển. Lý do: Thập Thần
> là **nguyên lý trừu tượng** (suy từ ngũ hành + âm dương với Nhật Chủ), còn hành tinh Western
> là **thiên thể thật**. Ngoài ra **Uranus/Neptune/Pluto KHÔNG có tương đương BaZi** (BaZi ra đời
> trước khi 3 hành tinh này được phát hiện, và chỉ dùng ngũ hành). Khung thành thật: gọi đây là
> "tương đồng biểu tượng (archetypal resonance)", KHÔNG nói "Chính Quan LÀ Saturn".

| Thập Thần (VN / Hán) | Ý nghĩa BaZi | Tương ứng Western tốt nhất | Cường độ | Ghi chú |
|---|---|---|---|---|
| **Chính Quan** (正官 Direct Officer) | Quyền uy chính danh, kỷ luật, danh tiếng, chồng (nữ) | **Saturn** (Sao Thổ) + nhà 10 | **STRONG** | Song hành rõ nhất: cả hai đều = cấu trúc/nghĩa vụ/quyền uy. |
| **Thất Sát** (七杀 Seven Killings) | Quyết liệt, áp lực, tham vọng, chiến binh, bạn tình phi truyền thống | **Mars + Pluto** (Sao Hỏa + Diêm Vương) | **APPROXIMATE→STRONG** | Năng lượng chiến binh/biến đổi — rất gần Mars/Pluto. |
| **Chính Tài** (正财 Direct Wealth) | Tiền lương ổn định, của cải tích lũy, vợ (nam) | **Venus** (Sao Kim) + nhà 2 | **APPROXIMATE→STRONG** | Tiền/giá trị/vợ — gần Venus + 2nd house. |
| **Thiên Tài** (偏财 Indirect Wealth) | Tiền bất ngờ, đầu cơ, cha (nam) | **Jupiter** (Sao Mộc, phần mở rộng/may mắn) + nhà 2/8 | **APPROXIMATE (WEAK ở phần "cha")** | "May mắn/đầu cơ" ≈ Jupiter hợp lý; NHƯNG phần "cha" không khớp — Western thường gán cha = Saturn/Sun, không phải Jupiter. |
| **Chính Ấn** (正印 Direct Resource) | Mẹ, nuôi dưỡng, học vấn, bảo vệ | **Moon** (Mặt Trăng) + nhà 4 | **STRONG→APPROXIMATE** | Kiểu nhân cách "mẹ" gần Mặt Trăng nhất (nhưng Ấn còn mang nghĩa quyền). |
| **Thiên Ấn** (偏印 Indirect Resource) | Trực giác, huyền bí, tri thức phi truyền thống, đơn độc | **Neptune** (Sao Hải Vương) | **APPROXIMATE** | Huyền bí/mơ mộng/trực giác ≈ Neptune khá hợp. |
| **Tỷ Kiên** (比肩 Friend) | Bạn bè, anh chị, đồng cấp, độc lập | (không có hành tinh sạch) — nhẹ **Sun** ("chiếc gương của bản ngã") + **nhà 11** | **WEAK→APPROXIMATE** | "Đồng cấp/mạng lưới" — Western thể hiện qua nhà 11; Tỷ Kiên là "gương của self" nên dính nhẹ Sun, nhưng Nhật Chủ mới là tương đương Sun thật sự. |
| **Kiếp Tài** (劫财 Rob Wealth) | Cạnh tranh, đối thủ, tiêu xài bốc đồng | **Mars** (phần xung đột) + **Uranus** (phá vỡ) | **WEAK→APPROXIMATE** | Cạnh tranh/phá rối — gần phần "nhiễu" của Mars/Uranus. |
| **Thực Thần** (食神 Eating God) | Sáng tạo dịu dàng, thưởng thức/khoái cảm, ẩm thực, con cái (nữ), phúc thọ | **Venus** (Sao Kim, phần thưởng thức/khoái cảm) + **nhà 5** (sáng tạo/vui thú); một phần Mercury (biểu đạt) | **APPROXIMATE** | Thực Thần = "thưởng thức + sáng tạo" rất hợp Venus + nhà 5 (đúng hơn Sun). |
| **Thương Quan** (伤官 Hurting Officer) | Trí tuệ sắc, "thiên tài nổi loạn", phô diễn, chống quyền uy | **Uranus** (Sao Thiên Vương, phản kháng/khai sáng) + **Mercury** (Sao Thủy, trí tuệ sắc bén/ngôn từ) | **APPROXIMATE→STRONG** | "Rebel genius" ≈ Uranus + Mercury; đặc biệt "Thương Quan thấy Quan" = trí tuệ đụng quyền uy. |

> Nguồn tổng hợp: [AstroBazi – Ten Gods](https://www.astrobazi.com/articles/ten-gods),
> [Imperial Harvest – 10 Gods](https://imperialharvest.com/blog/10-gods/),
> [ba-zi.ai – Seven Killings](https://www.ba-zi.ai/en/blog/seven-killings-bazi),
> [ba-zi.ai / fatemaster – Zheng Guan](https://www.ba-zi.ai/en/blog/zheng-guan-bazi),
> [Scribd – Zheng Yin (Direct Resource)](https://www.scribd.com/doc/269164345/Direct-Resource),
> [Chinese Fortune Calendar – Mother star](https://www.chinesefortunecalendar.com/ChineseZodiac/10Gods-Mother.htm),
> [bazi-web – Direct vs Indirect Wealth](https://bazi-web.com/direct-wealth-zheng-cai-vs-indirect-wealth-pian-cai/),
> [Nova Masters – Wealth star meaning](https://novamastersconsulting.com/the-real-meaning-of-the-wealth-star-in-bazi/).

---

## 3. Các điểm KHÔNG có tương đương sạch (phải báo trung thực cho user)

### 3.1. Dụng Thần (用神 / Useful God) — KHÔNG có tương đương Western
Đây là **khái niệm duy nhất của BaZi** mà Western thực sự thiếu: nguyên tố "chữa lệch" —
một chẩn đoán + đơn thuốc. Western chỉ mô tả cân bằng nguyên tố (thiếu/dư) chứ không có cơ chế
"một hành duy nhất để bồi bổ". Đây là điểm app **phải trình bày khác biệt**, không được nói "≈".
([Master Sean Chan – Useful God](https://www.masterseanchan.com/blog/weak-useful-god-analysis/),
[BaziFortune – Yong Shen guide](https://bazifortune.app/blog/bazi-favorable-elements-yong-shen-guide),
[Bazi-web – Useful God](https://bazi-web.com))

### 3.2. Ascendant (Rising) — KHÔNG có tương đương BaZi sạch
Western dùng **giờ sinh + tọa độ** để tính Ascendant (mặt nạ bề ngoài). BaZi cũng dùng giờ sinh
nhưng ra **Trụ Giờ** = cung con cái + tuổi già + suy nghĩ ẩn — **không phải "ấn tượng đầu tiên"**.
Một số trang đại chúng gọi giờ-sinh (chi giờ) là "Chinese rising/companion sign", nhưng đó là
**phỏng theo Western**, không phải khái niệm truyền thống BaZi. App nên ghi rõ: "BaZi không có
Ascendant; Trụ Giờ là gần nhất nhưng mang nghĩa khác."
([DeepOracle – BaZi vs Western](https://www.deeporacle.ai/en/bazi/blog/bazi-vs-western-astrology-comparison),
[DeepOracle – BaZi children / Hour Pillar](https://www.deeporacle.ai/en/bazi/blog/bazi-children-analysis),
[Eastrolog – Chinese Ascendant](https://www.eastrolog.com/chinese-zodiac/chinese-ascendant.php))

### 3.3. Ngũ hành ≠ 4 nguyên tố — KHÔNG dịch máy móc "Hỏa=Hỏa, Thủy=Thủy"
- **Wuxing** = 5 **pha/process** (Mộc-Kim có; KHÔNG có Khí), có chu trình **sinh/khắc**.
- **Western 4 elements** = 4 **chất/substance** (có Khí; KHÔNG tách Kim/Mộc), phẩm chất nóng/khô/ẩm.
Trùng tên Hỏa & Thủy nhưng nền triết lý khác. **Mộc và Kim không có nguyên tố Western tương ứng;
Khí không có hành BaZi tương ứng.**
([Wikipedia – Wuxing](https://en.wikipedia.org/wiki/Wuxing_(Chinese_philosophy)),
[IEP – Wuxing](https://iep.utm.edu/wuxing/),
[Reddit r/taoism – 4 vs 5 elements](https://www.reddit.com/r/taoism/comments/1jb96rb/4_elements_vs_5_elements/))

### 3.4. Saturn Return / transit hành tinh ngoài — KHÔNG có tương đương BaZi chính xác
Western có các mốc tuổi "thế hệ" (Saturn return ~28-30/57-59, Uranus half-return ~42,
Pluto chậm). BaZi dùng Đại vận 10 năm + lưu niên; một trụ Đại vận xung Nhật Chủ có thể
"hoạt động như" Saturn return (khủng hoảng tái cấu trúc) nhưng **không khớp thời điểm cố định**.
([Eastern Fate](https://www.easternfate.com/blog/bazi-vs-western-astrology),
[DeepOracle](https://www.deeporacle.ai/en/bazi/blog/bazi-vs-western-astrology-comparison),
[bazi-web – Luck Pillars](https://bazi-web.com/luck-pillars-da-yun-10-year-cycles-guide/))

---

## 4. Hiệu chỉnh / bổ sung cho `BAZI_WESTERN_MAP` hiện tại (8 khóa)

`src/engine/western-kb.js` hiện có 8 khóa `BAZI_WESTERN_MAP` + 8 bullet `COMPARISON_NOTES`.
Đánh giá:

| Khóa hiện tại | Đánh giá | Đề xuất |
|---|---|---|
| `dayMaster` | ✅ Đúng (Nhật Chủ ≈ Mặt Trời) | Giữ. Có thể thêm "cũng gần chart ruler / 1st house ruler". |
| `yong` | ✅ Đúng & quan trọng (Dụng Thần không có tương đương) | Giữ, làm nổi bật — đây là khác biệt cốt lõi. |
| `shishen_sun` | ⚠️ Hơi lộn xộn (trộn Mặt Trời với Thập Thần) | Tách thành bảng Thập Thần riêng (xem mục 2 trên). |
| `moon` | ✅ Đúng (Mặt Trăng ≈ Ấn, có lưu ý) | Giữ; nhấn Ấn ≠ hoàn toàn Mặt Trăng (còn mang nghĩa quyền). |
| `rising` | ✅ Đúng (BaZi không có Ascendant) | Bổ sung: Trụ Giờ là tương đương mờ + đồng thời cung con cái/tuổi già. |
| `elements` | ✅ Đúng (5 hành ≠ 4 nguyên tố) | Bổ sung: Mộc/Kim không có tương đương Western; Khí không có tương đương BaZi. Wuxing = "pha" vs elements = "chất". |
| `timing` | ✅ Đúng (Đại vận ≠ transit) | Bổ sung: tương đương gần nhất = **secondary progressions + outer-planet transits**; Saturn Return không có tương đương cố định. |
| `strengths` | ✅ Đúng (vượng suy ≈ dignity + element balance) | Giữ. Bổ sung: sức mạnh theo mùa (đắc lệnh) ≈ domicile/exaltation. |

**Đề xuất mở rộng** (thêm khóa mới để app vẽ đủ 15 chiều đời):
`spouseMarriage` (Chi Ngày + sao Vợ/Chồng ↔ nhà 7 + Venus, STRONG/APPROXIMATE) ·
`career` (Chính Quan ↔ Saturn/MC, STRONG/APPROXIMATE) ·
`money` (Tài ↔ Venus/2nd house/Jupiter, STRONG/APPROXIMATE) ·
`communication` (Thương Quan/Thực Thần ↔ Mercury/3rd house, APPROXIMATE) ·
`drive` (Thất Sát/Kiếp Tài ↔ Mars/Pluto, APPROXIMATE/STRONG) ·
`family` (Trụ Năm/Ấn/Thiên Tài/Trụ Giờ ↔ nhà 4/10/5, APPROXIMATE) ·
`health` (vượng suy + xung hình ↔ nhà 6/1, WEAK/APPROXIMATE) ·
`chartPattern` (cách cục ↔ chart shape + element balance, APPROXIMATE).

> **Lưu ý quan trọng cho codebase:** Tài liệu này KHÔNG sửa `western-kb.js`.
> Việc thêm khóa là quyết định của team — đây chỉ là nghiên cứu nền. Khi triển khai,
> giữ nguyên t disclaimer "không 1-1" ở mọi khóa mới.

---

## 5. Key insights / caveats (trình bày cho user)

1. **Hai hệ thống, hai câu hỏi khác nhau.** Western: "các hành tinh ở đâu?" → tâm lý.
   BaZi: "phẩm chất năng lượng khoảnh khắc đó là gì?" → vận trình. Cả hai đều từ dữ kiện
   ngày/giờ sinh nhưng ra kết quả khác gốc. ([Eastern Fate](https://www.easternfate.com/blog/bazi-vs-western-astrology))

2. **Không phải khoa học.** Cả hai đều không vượt qua kiểm chứng thực nghiệm.
   "Đúng quá" chủ yếu là **hiệu ứng Barnum** + xác nhận chủ quan. App phải nói rõ.
   (Đã có sẵn trong `COMPARISON_NOTES` — giữ.)

3. **Không bao giờ dịch 1-1.** "Hỏa=Hỏa", "Nhật Chủ=Mặt Trời", "Ấn=Mặt Trăng" là
   **song hành biểu tượng**, không phải đồng nhất. Mỗi phép dịch đều mất thông tin.

4. **Điểm mạnh riêng của BaZi:** định thời (Đại vận/lưu niên) + Dụng Thần (đơn thuốc
   nguyên tố). Điểm mạnh riêng của Western: đa lớp tâm lý (Sun/Moon/Rising/Venus/Mars…)
   + aspects nội tại. Hai hệ **bổ sung** nhau hơn là thay thế.
   ([Nova Masters](https://novamastersconsulting.com/bazi-vs-western-astrology-what-sets-them-apart/),
   [Shen-Shu](https://www.shen-shu.com/en/blog/western-birth-chart-calculatorvs-chinese-bazi-calculator-key-differences-explained))

5. **Cùng giờ sinh, ra thứ khác nhau.** BaZi dùng giờ sinh → Trụ Giờ (tuổi già/con cái);
   Western dùng giờ sinh → Ascendant (mặt nạ bề ngoài). Phải báo cho user để không kỳ vọng sai.

6. **Gốc gác lịch sử:** cả hai đều có rễ Babylon ở một số yếu tố (zodiac 12, tượng hành tinh),
   nhưng lõi BaZi (12 chi năm, 28 tú) phát triển phần lớn độc lập; horoscope Western đến Trung
   Hoa muộn qua Phật giáo/Iran nhà Đường (TK 7-9). ([History of astrology – Wikipedia](https://en.wikipedia.org/wiki/History_of_astrology),
   [Buddhistdoor – Kotyk interview](https://www.buddhistdoor.net/features/understanding-buddhist-astrology-an-interview-with-dr-jeffrey-kotyk/))

7. **Khuyến nghị thành thật:** dùng như **gương phản tỉnh đa góc**, không dùng quyết định
   hôn nhân/đầu tư lớn/y tế. (Đã có sẵn — giữ.)

---

## 6. Sources (markdown links)

### Tổng quan so sánh BaZi ↔ Western
- [Wikipedia – Four Pillars of Destiny](https://en.wikipedia.org/wiki/Four_Pillars_of_Destiny)
- [Eastern Fate – BaZi vs Western Astrology](https://www.easternfate.com/blog/bazi-vs-western-astrology)
- [DeepOracle – BaZi vs Western: methodology-level comparison](https://www.deeporacle.ai/en/bazi/blog/bazi-vs-western-astrology-comparison)
- [BaziFortune – BaZi vs Western: key differences](https://bazifortune.app/blog/bazi-vs-western-astrology-key-differences)
- [Shen-Shu – BaZi vs Western birth chart](https://www.shen-shu.com/en/blog/western-birth-chart-calculatorvs-chinese-bazi-calculator-key-differences-explained)
- [Nova Masters – What sets them apart](https://novamastersconsulting.com/bazi-vs-western-astrology-what-sets-them-apart/)
- [Tori Seeks Wisdom – Why I switched after 9 years](https://toriseekswisdom.com/bazi-vs-astrology-comparison/)

### Ngũ hành & nguyên tố
- [Wikipedia – Wuxing (Chinese philosophy)](https://en.wikipedia.org/wiki/Wuxing_(Chinese_philosophy))
- [Internet Encyclopedia of Philosophy – Wuxing](https://iep.utm.edu/wuxing/)
- [Reddit r/taoism – 4 vs 5 elements](https://www.reddit.com/r/taoism/comments/1jb96rb/4_elements_vs_5_elements/)

### Ascendant & Trụ Giờ
- [DeepOracle – BaZi children analysis / Hour Pillar](https://www.deeporacle.ai/en/bazi/blog/bazi-children-analysis)
- [Eastrolog – The Ascendant in Chinese astrology](https://www.eastrolog.com/chinese-zodiac/chinese-ascendant.php)
- [Astrosofa – The Chinese Ascendant / Rising Sign](https://www.astrosofa.com/astrology/chinese-horoscope/The-Chinese-Ascendant-Chinese-Rising-Sign)

### Đại vận / timing
- [Medium – BaZi Luck Pillars: 10-year cycles](https://medium.com/soultouch/some-decades-carry-you-others-break-you-open-theres-a-reason-for-both-06e226ada1ad)
- [Bazi-web – Luck Pillars (Da Yun) guide](https://bazi-web.com/luck-pillars-da-yun-10-year-cycles-guide/)
- [Master Sean Chan – How to read a BaZi chart](https://www.masterseanchan.com/blog/how-to-read-a-bazi-chart/)

### Nhật Chủ / sức mạnh / vượng suy
- [Bazi-web – Seasonal birth affects day master strength](https://bazi-web.com/how-seasonal-birth-affects-your-day-master-strength/)
- [AstroBazi – Your Day Master explained](https://www.astrobazi.com/articles/day-master-guide)
- [Reddit r/astrology – 1st rule: read the strength of your Day Master](https://www.reddit.com/r/astrology/comments/evkgwu/1st_rule_in_chinese_astrology_read_the_strength/)

### Dụng Thần (Useful God)
- [Master Sean Chan – What is a "Useful God"](https://www.masterseanchan.com/blog/weak-useful-god-analysis/)
- [BaziFortune – Favorable elements (Yong Shen) by Day Master](https://bazifortune.app/blog/bazi-favorable-elements-yong-shen-guide)

### Thập Thần (Ten Gods)
- [AstroBazi – Ten Gods personality archetypes](https://www.astrobazi.com/articles/ten-gods)
- [Imperial Harvest – The Ten Gods](https://imperialharvest.com/blog/10-gods/)
- [ba-zi.ai – Seven Killings (Qi Sha)](https://www.ba-zi.ai/en/blog/seven-killings-bazi)
- [ba-zi.ai – Zheng Guan (Direct Officer)](https://www.ba-zi.ai/en/blog/zheng-guan-bazi)
- [Scribd – Understanding Zheng Yin (Direct Resource)](https://www.scribd.com/doc/269164345/Direct-Resource)
- [Chinese Fortune Calendar – Mother star (Zheng Yin)](https://www.chinesefortunecalendar.com/ChineseZodiac/10Gods-Mother.htm)
- [bazi-web – Direct Wealth vs Indirect Wealth](https://bazi-web.com/direct-wealth-zheng-cai-vs-indirect-wealth-pian-cai/)
- [Nova Masters – Real meaning of the Wealth star](https://novamastersconsulting.com/the-real-meaning-of-the-wealth-star-in-bazi/)
- [FateMaster – Ten Gods guide](https://www.fatemaster.ai/en/guides/shishen)
- [HeartCosmos – Qi Sha: the dynamic force](https://www.heartcosmos.com/wiki/en/bazi/ten-gods/qi-sha.html)
- [Eastern Fate – Zheng Guan (Authority Star)](https://easternfate.com/blog/zheng-guan-ten-god)
- [Eastern Fate – Pian Yin (Mystic Star)](https://www.easternfate.com/blog/pian-yin-ten-god)
- [Eastern Fate – Jie Cai (Bold Rival)](https://easternfate.com/blog/jie-cai-ten-god)
- [Eastern Fate – Shang Guan (Rebel Genius)](https://easternfate.com/blog/shang-guan-ten-god)
- [Eastern Fate – Zheng Cai (Steady Fortune)](https://easternfate.com/blog/zheng-cai-ten-god)
- [Eastern Fate – Pian Cai (Windfall)](https://easternfate.com/blog/pian-cai-ten-god)
- [Shen-Shu – Ten Gods (Zheng Guan / Qi Sha / Jie Cai / Shang Guan / Shi Shen)](https://www.shen-shu.com/en/shishen/zheng-guan)
- [FateMaster – Zheng Yin / Qi Sha / Jie Cai / Pian Cai / Shi Shen / Bi Jian](https://www.fatemaster.ai/en/blog/zheng-yin)
- [XuanSeal – Seven Killings](https://xuanseal.com/glossary/what-is-seven-killings)
- [IChing-BaZi-FengShui – Friend (Bi Jian)](https://iching-bazi-fengshui.com/en/bazi/ten-gods/friend/)
- [Nova Masters – Day Master more accurate than zodiac sign](https://novamastersconsulting.com/why-the-day-master-is-more-accurate-than-your-zodiac-sign/)
- [Jerry King — Four Pillars of Destiny (practitioner-academic, Google Books)](https://books.google.com/books/about/Four_Pillars_of_Destiny.html?id=QGhclAEACAAJ)

### Hôn nhân / tiền bạc (so sánh chéo)
- [Eastern Fate – Spouse Palace in BaZi](https://www.easternfate.com/blog/bazi-spouse-palace)
- [DeepOracle – Day Pillar marriage/spouse](https://www.deeporacle.ai/en/bazi/blog/day-pillar-marriage-spouse)
- [DeepOracle – How to read wealth in BaZi](https://www.deeporacle.ai/en/bazi/blog/how-to-read-wealth-in-bazi)
- [Master Sean Chan – Direct vs Indirect Wealth](https://www.masterseanchan.com/blog/difference-between-direct-wealth-indirect-wealth/)

### Lịch sử / nguồn gốc chung
- [Wikipedia – History of astrology](https://en.wikipedia.org/wiki/History_of_astrology)
- [Wikipedia – Astrological sign (Babylonian origin)](https://en.wikipedia.org/wiki/Astrological_sign)
- [Buddhistdoor – Understanding Buddhist Astrology: interview with Dr. Jeffrey Kotyk](https://www.buddhistdoor.net/features/understanding-buddhist-astrology-an-interview-with-dr-jeffrey-kotyk/)

---

*Tài liệu nghiên cứu — không sửa code. Khi triển khai vào sơ đồ tổng hợp, giữ nhãn
cường độ tương ứng (STRONG/APPROXIMATE/WEAK/NONE) và disclaimer "không 1-1" ở mọi hàng.*
