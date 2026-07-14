# Western Astrology & Same-Sex Relationships — Nghiên cứu phương pháp (có trích dẫn)

> Tài liệu nghiên cứu (read-only) cho app Bát Tự + Western. Trả lời câu hỏi:
> chiêm tinh phương Tây xử lý quan hệ đồng giới thế nào, liệu nó **vốn đã
> gender-neutral** hay không, và module Western / synastry / synthesis của app
> cần thay đổi gì (nếu cần).
>
> **Tuyên bố trung thực (bắt buộc):** Chiêm tinh phương Tây **KHÔNG** được kiểm
> chứng khoa học — giống BaZi. Tài liệu này mô tả **quy ước thực hành** của giới
> chiêm tinh học hiện đại, không phải sự thật khách quan. Xác định xu hướng tính
> dục (orientation) **KHÔNG** thể được "đọc" từ lá số sinh (xem §4 — debunk).

---

## 0. VERDICT (TL;DR)

| Câu hỏi | Trả lời |
|---|---|
| Western natal (Sun/Moon/Venus/Mars/houses/Asc) có phụ thuộc giới không? | **KHÔNG.** Toàn bộ phép tính chỉ dùng `ngày/giờ/vĩ độ/kinh độ sinh`. Giới tính không bao giờ là input. |
| Module Western của app (`western-astro.js`) có cần đổi code cho đồng giới? | **KHÔNG — zero change.** Hàm `computeWesternChart(date, lat, lng)` đã hoàn toàn gender-neutral. |
| Synastry (so sánh 2 lá số) có quy tắc nào phụ thuộc giới không? | **Phép tính thì không; lớp diễn giải truyền thống thì CÓ (archaic).** Modern practice đã bỏ. |
| Có "chỉ số đồng tính" (gay indicators) hợp lệ không? | **KHÔNG.** Mọi claim kiểu "Uranus đỉnh Ascendant = gay" đều **vô căn cứ**, bắt nguồn từ đầu thế kỷ 20 (Heimsoth). Xem §4. |
| Nếu app thêm synastry sau này thì làm gì cho đồng giới? | Dùng **cùng phép tính**; chỉ cần (a) văn bản diễn giải gender-neutral, (b) phân tích **cả 2 chiều** Venus↔Mars thay vì ưu tiên 1 chiều, (c) thêm Venus-Venus + Mars-Mars. Xem §3. |

**Kết luận một câu:** Western astrology vốn dã **gender-neutral về mặt kỹ thuật**
cho tình yêu/synastry; module Western hiện tại của app **đã đúng cho đồng giới
mà không cần sửa gì**. Khác biệt duy nhất nằm ở **diễn giải** — và đó là vấn đề
của văn bản/lời khuyên (copy + AI prompt), không phải của code tính toán.

---

## 1. Western natal LẪN TÌNH YÊU vốn gender-neutral

### 1.1. Phép tính không cần giới

Lá số phương Tây được tính từ:
- **Ngày/giờ sinh (UT)**
- **Vĩ độ / kinh độ nơi sinh**

Từ đó suy ra vị trí 10 hành tinh (Sun→Pluto), Ascendant, MC, 12 nhà, aspects,
cân bằng nguyên tố. **Không một công thức nào** hỏi "nam hay nữ". Sao Kim (Venus)
của một người sinh 14/07/1990 lúc 20:00 ở Hà Nội có cùng kinh độ hoàng đạo
dù họ là nam, nữ, hay non-binary.

Kiểm chứng trong code app — `src/engine/western-astro.js`:
- `planetLongitude(name, date)` — chỉ nhận tên hành tinh + ngày.
- `ascendant(date, lat, lng)` — chỉ nhận ngày + tọa độ.
- `computeWesternChart(date, lat=21.03, lng=105.85)` — **không có tham số gender**.
- `computeAspects(positions)` — so sánh cặp hành tinh theo góc, không biết giới.

→ **Kết luận kỹ thuật:** toàn bộ pipeline natal của app **vốn đã universal**.

### 1.2. Ý nghĩa hành tinh tình yêu — phổ quát cho mọi người

| Hành tinh | Lĩnh vực | Có phân biệt giới? |
|---|---|---|
| **Venus (Sao Kim)** | Tình yêu, sự trân trọng, cái đẹp, sự tiếp nhận, nhu cầu kết nối lãng mạn | **Không** — Venus = "bạn yêu/cần gì trong quan hệ" cho *mọi* người |
| **Mars (Sao Hỏa)** | Dục vọng, sự theo đuổi, nghị lực, cách bày tỏ khao khát | **Không** — Mars = "bạn theo đuổi/khao khát gì" cho *mọi* người |
| **Moon (Mặt Trăng)** | Nhu cầu cảm xúc, sự an toàn, bản năng chăm sóc | **Không** |
| **Nhà 7 + Descendant** | Đối tác, hôn nhân, "người khác" quan trọng | **Không** — nhà 7 = *mọi* kiểu đối tác cam kết |
| **Nhà 5** | Lãng mạn, sáng tạo, tình yêu trò chơi | **Không** |
| **Nhà 8** | Gắn kết sâu, intimatcy, sự dung hợp | **Không** |

Trong thực hành hiện đại, **mọi người đều có cả Venus lẫn Mars** — chúng mô tả
hai cực (tiếp nhận / theo đuổi) bên trong *mỗi cá nhân*, không gán cho "giới
này sở hữu hành tinh kia". Đây là quan điểm chuẩn của chiêm tinh học Hellenistic
và modern (xem The Astrology Podcast Ep. 165 — Synastry).

### 1.3. App đã ghi nhận điều này

`src/engine/western-synthesis.js` (dòng 71–76, chiều "Tình cảm / hôn nhân")
đã viết thẳng sự khác biệt cốt lõi:

> *"BaZi chi ngày = cung配偶 (gendered: Tài=vợ nam, Quan=chồng nữ);
> **Western Venus phổ quát**."*

Nghĩa là: **BaZi mới là bên có quy tắc phụ thuộc giới** (sao Tài = vợ cho nam,
sao Quan = chồng cho nữ), còn **Western Venus là phổ quát**. App đã đúng khi
ghi như vậy.

---

## 2. Module Western của app cần thay đổi gì cho đồng giới?

### 2.1. Natal (`computeWesternChart`) — KHÔNG cần đổi

Hàm đã gender-neutral. Chạy cùng code, cùng output cho mọi người.
**Không có việc gì phải làm.**

### 2.2. Synthesis (`western-synthesis.js`) — KHÔNG cần đổi về logic

Phần "Tình cảm / hôn nhân" dùng `W.venus.signVi` (Venus phổ quát) cho bên
Western — đã đúng cho đồng giới. Phần BaZi (chi ngày + sao Tài/Quan) thì có
vấn đề giới, nhưng đó là **bên BaZi**, ngoài scope tài liệu này (xem ghi chú
ở cuối).

### 2.3. Synastry (chưa tồn tại trong app) — nếu sau này thêm

Hiện app **chưa có** module synastry Western (không có file `western-synastry.js`,
không có hàm so 2 lá số Western). Module hợp hôn `src/engine/hehun.js` thuần BaZi.
Nếu sau này app thêm synastry Western, **áp dụng §3 bên dưới** — code tính
aspect giữ nguyên, chỉ chỉnh diễn giải.

### 2.4. Khuyến nghị thực tế (không đụng code)

| Việc | Cần làm? |
|---|---|
| Đổi `computeWesternChart` | ❌ Không |
| Thêm input "giới tính" vào lá số Western | ❌ Không — sẽ là sai về mặt phương pháp |
| Đổi KB diễn giải Venus/Mars theo giới | ❌ Không — nên giữ phổ quát |
| Nếu thêm synastry: viết prompt/KB gender-neutral, xét cả 2 chiều | ⚠ Chỉ khi build feature đó |
| UI: cho phép user nhập "đối tác" không hỏi giới | ✅ Nên làm (UX tốt hơn, đúng method) |

---

## 3. Phương pháp Synastry cho quan hệ đồng giới

> **Nguyên tắc vàng:** Phép tính synastry **giống hệt** cho mọi cặp. Khác biệt
> chỉ ở **diễn giải** — và chỉ là điều chỉnh nhỏ (xét đều 2 chiều).

### 3.1. Synastry là gì

Synastry = so sánh vị trí hành tinh của **2 lá số** để xem chúng "nói chuyện"
với nhau ra sao. Mỗi cặp (ví dụ: Venus của A ↔ Mars của B) được kiểm tra xem
có tạo **aspect** (góc hợp: conjunction 0°, sextile 60°, square 90°, trine 120°,
opposition 180°) trong orb cho phép không. Đây là **phép tính hình học thuần túy**
— không cần giới.

### 3.2. Khác biệt duy nhất cho đồng giới: xét CẢ HAI chiều đều

Trong truyền thống dị tính, nhiều sách chỉ nhấn **một** chiều có sẵn do vai trò:
"Mars của nam → Venus của nữ". Cho cặp đồng giới (không có "giới này = Mars,
giới kia = Venus"), thực hành chuẩn là:

1. **Cross-aspect Venus↔Mars BẰNG NHAU 2 chiều:**
   - Venus của A → Mars của B
   - Mars của A → Venus của B
   - Cả hai đều được đọc với cùng trọng số. Nếu **cả hai chiều** đều có aspect
     tốt (vd A's Venus conjunct B's Mars **và** B's Venus trine A's Mars) →
     "double Venus-Mars" = chemistry lẫn nhau mạnh.

2. **Same-planet aspects (đặc trưng cho cặp đồng giới):**
   - **Venus ↔ Venus** (hai cách yêu tương tác — hài hòa trine/sextile = chung
     ngôn ngữ tình cảm; square/opposition = căng thẳng giá trị).
   - **Mars ↔ Mars** (hai cách theo đuổi — trine = năng lượng ăn khớp;
     square/opposition = xung đột ý chí/đụng chạm).
   - Các cặp này **hiếm khi được nhắc** trong sách dị tính truyền thống nhưng
     rất quan trọng khi cả hai có cùng "cực hành tinh".

3. **Sun↔Moon, Moon↔Moon, Ascendant contacts:** không đổi — vẫn là lõi của sự
   hiểu nhau & cảm thấy "được thấy".

4. **Nhà 7 / Descendant của A có hành tinh của B không?** — vẫn dùng như thường,
   ý nghĩa (đối tác quan trọng) phổ quát.

### 3.3. Bảng so sánh: dị tính (truyền thống) vs đồng giới

| Yếu tố | Cặp dị tính (sách cũ) | Cặp đồng giới (modern) |
|---|---|---|
| Ưu tiên chiều Venus-Mars | Thường 1 chiều (Mars nam → Venus nữ) | **Cả 2 chiều đều** |
| Venus-Venus | Ít nhắc | **Quan trọng** (chung ngôn ngữ yêu) |
| Mars-Mars | Ít nhắc | **Quan trọng** (ăn khớp năng lượng/dục) |
| Sun-Moon | Quan trọng | Quan trọng (không đổi) |
| Nhà 7 / Descendant | Cho "vợ/chồng" | Cho "đối tác cam kết" (không đổi về kỹ thuật) |
| Phép tính aspect | Geometry | **Giống hệt** |

### 3.4. Composite chart (lá số ghép)

Một số chiêm tinh gia dùng **composite chart** (lấy trung điểm — midpoint — các
hành tinh của 2 người để tạo "lá số của chính mối quan hệ"). Phép tính midpoint
cũng **hoàn toàn gender-neutral**. Nếu app implement sau này, không cần đổi gì.

---

## 4. DEBUNK: các "chỉ số đồng tính" (gay indicators) — VÔ CĂN CỨ

### 4.1. Các claim thường gặp (ĐỀU KHÔNG HỢP LỆ)

Trên mạng (TikTok, Tumblr, YouTube, Vedic Facebook) lan truyền các "chỉ số
đồng tính/lưỡng tính" kiểu:

- ❌ "Uranus đỉnh Ascendant / góc cứng với Sun/Moon = gay"
- ❌ "Venus + Mars đổi chữ (exchange signs) hoặc cùng chữ = đồng tính nam"
- ❌ "Mercury conjunct Venus = lưỡng tính"
- ❌ "Cung 5/7/8 có điểm móc là Aquarius/Gemini/Pisces = queer"
- ❌ "Vedic: 7th lord afflicted bởi Rahu/Ketu = quan hệ phi truyền thống"

### 4.2. Tại sao KHÔNG hợp lệ

1. **Không có bằng chứng khoa học / thống kê** — không một nghiên cứu
   peer-reviewed nào chứng minh tương quan có ý nghĩa thống kê giữa vị trí
   hành tinh lúc sinh và xu hướng tính dục. (Xem đánh giá chung về chiêm tinh
   như pseudoscience.)

2. **Nguồn gốc lịch sử đáng nghi:** các claim Uranus ↔ "quê', "deviance" bắt
   nguồn từ **Karl-Günter Heimsoth (đầu thế kỷ 20)** — bối cảnh y tế hóa
   đồng tính là "bệnh/lệch lạc". Đây là khuôn mẫu bệnh lý hóa, không phải quan
   sát thực nghiệm.

3. **Confirmation bias + Barnum effect:** "chỉ số" đủ chung chung để khớp sau
   khi biết đáp án (post-diction). Mọi người đồng tính có MỌI kiểu lá số —
   không có pattern thống kê.

4. **Vô lý về mặt phương pháp:** xu hướng tính dục là đặc tính phức tạp của con
   người, không thể "đo" bằng góc hành tinh. Hơn nữa, nếu "Uranus trên Ascendant
   = gay" thì ~1/12 dân số (ai có Ascendant trong cung Uranus đang đi qua) đều
   sẽ gay — vô lý về mặt số liệu.

5. **Modern LGBTQ-affirming astrologers bác bỏ:** các chiêm tinh gia queer hiện
   đại (xem §5) **từ chối** việc đoán orientation từ lá số. The Astrology Podcast
   Ep. 79 ("Sexual Orientation and Astrology") đưa góc nhìn lịch sử có nuance —
   và rõ ràng: **không có placement nào "chỉ ra" orientation**.

### 4.3. Khuyến nghị cho app

- **TUYỆT ĐỐI KHÔNG** đưa "chỉ số đồng tính" vào KB / prompt AI của app.
- Nếu AI brief hoặc nlg sinh câu kiểu "đặc trưng queer của lá số" → **phải gỡ**.
  Kiểm tra: `src/engine/western-kb.js`, `brief-extender.js`, `ai.js`.
- Venus/Mars/Uranus trong lá số nên được diễn giải theo **chức năng phổ quát**
  (cách yêu, cách theo đuổi, sự phi truyền thống trong *biểu đạt*) — không gán
  orientation.

---

## 5. Thực hành modern / LGBTQ-affirming

### 5.1. Chris Brennan & The Astrology Podcast

- **Ep. 165 — Synastry: The Astrology of Relationships** (với John Green):
  trình bày synastry theo khung kỹ thuật — Venus/Mars được đọc như cực
  năng lượng (attraction vs. drive), không gán cứng cho giới sinh học.
- **Ep. 79 — Sexual Orientation and Astrology** (với Christopher Renstrom):
  góc nhìn lịch sử — các "chart signature queer" trong văn bản cổ, và lý do
  modern practitioners **không** dùng chúng để đoán orientation.
- **Venus Retrograde in Aries and Queer History** (với Elly Marquis, host
  *Star Gays: The Queer Astrology Archives*): Venus như biểu tượng văn hóa
  queer — không phải "chỉ số phát hiện gay".

### 5.2. Queer astrology hiện đại — nguyên tắc

- **Giải kiến tạo giới khỏi planet:** Venus không phải "nữ", Mars không phải
  "nam". Mỗi người có cả hai. (Thách thức dignity scheme cổ — vd Venus "fall"
  ở Virgo được queer astrologers đọc lại.)
- **Đọc theo archetypal, không theo vai giới:** "người tiếp nhận/người theo đuổi"
  là cực năng lượng, ai cũng có cả hai, không map vào giới.
- **Không đoán orientation** — chỉ mô tả *cách* yêu, *cách* theo đuổi, *kiểu*
  đối tác được thu hút (về phẩm chất, không về giới).
- **Hôn nhân = nhà 7 cho mọi người**, bất kể dị/homo.

### 5.3. Vì sao cộng đồng LGBTQ dùng chiêm tinh nhiều

Khảo sát Mỹ (NBC News, 2023): người LGBTQ (đặc biệt nữ, 63%) là nhóm tiêu thụ
chiêm tinh mạnh nhất — một phần vì chiêm tinh/tarot là thực hành tâm linh **ngoài
tôn giáo có tổ chức** (thường bài trừ họ). Điều này củng cố: app nên **chào đón**
người dùng queer bằng diễn giải phổ quát, không phải gán nhãn.

---

## 6. So sánh nhanh: BaZi (có gender) vs Western (phổ quát) cho tình yêu

| Khía cạnh | BaZi | Western |
|---|---|---|
| Sao vợ/chồng | **Có giới:** Tài = vợ (cho nam), Quan = chồng (cho nữ) | **Không:** Venus phổ quát cho mọi người |
| Cung hôn nhân | Chi ngày (Phu Thê) — nhưng ngôi sao trong đó phụ thuộc giới | Nhà 7 + Descendant — phổ quát |
| 合婚 (hợp hôn) | `hehun.js` dùng Nhật Chi + ngũ hành + dụng thần → **phần lớn gender-neutral trong chấm điểm** (Nhật Chủ = "mình" cho cả hai) | Synastry: geometry thuần — gender-neutral |
| Cần input giới? | **Có** (để biết Tài hay Quan là sao bạn đời) | **Không** |

> **Lưu ý:** Tài liệu này là về **Western**. Vấn đề "BaZi xử lý đồng giới thế nào"
> (cách đọc sao Tài/Quan khi giới đối tác đổi) là một tài liệu riêng — ngoài scope.
> Module `hehun.js` hiện tại chấm điểm theo Nhật Chi + ngũ hành nên **phần lớn đã
> không phụ thuộc giới** ở tầng chấm điểm (chỉ phụ thuộc khi diễn giải sao Tài/Quan).

---

## 7. Kết luận & hành động cho app

1. **Verdict:** Western astrology **vốn gender-neutral** cho tình yêu/synastry
   về mặt kỹ thuật. Module Western của app (`western-astro.js`, `western-synthesis.js`)
   **đã đúng cho đồng giới, KHÔNG cần sửa code.**

2. **Không bao giờ** thêm input "giới tính" vào `computeWesternChart` — sẽ sai
   method.

3. **Không bao giờ** thêm "chỉ số đồng tính" (Uranus/Asc, Venus-Mars exchange...)
   vào KB/prompt — đó là pseudoscience đã bị bác bỏ (§4).

4. **Nếu build synastry sau này:** dùng cùng phép tính aspect; viết KB/prompt
   gender-neutral; cho đồng giới xét **cả 2 chiều** Venus↔Mars **cộng**
   Venus-Venus + Mars-Mars (§3).

5. **UX:** form nhập "đối tác" không cần hỏi giới — chỉ cần ngày/giờ/nơi sinh
   (đúng với method Western).

6. **BaZi side** (ngoài scope): sao Tài/Quan phụ thuộc giới — cần tài liệu riêng
   nếu app muốn đọc BaZi cho đồng giới chính xác.

---

## Sources

### Phương pháp synastry & gender (Western)
- [The Astrology Podcast — Ep. 165: Synastry: The Astrology of Relationships (Chris Brennan & John Green)](https://theastrologypodcast.com/transcripts/ep-165-transcript-synastry-the-astrology-of-relationships/)
- [The Astrology Podcast — Ep. 79: Sexual Orientation and Astrology (Christopher Renstrom)](https://theastrologypodcast.com/transcripts/ep-79-transcript-sexual-orientation-and-astrology/)
- [Mystic Medusa — Mars-Venus Synastry Is Always Hot](https://mysticmedusa.com/relationship-astrology/venus-mars-synastry/)
- [The Inner Wheel — Synastry Studies: More Sex — A Closer Look at Mars (Dawn Bodrogi)](https://theinnerwheel.com/synastry-studies-more-sex-a-closer-look-at-mars/)
- [My Zodiac AI — Venus-Mars Synastry Aspects: Sexual & Romantic Compatibility](https://my-zodiac-ai.com/blog/venus-mars-aspects-in-synastry-sexual-romantic-compatibility)
- [Look Up the Stars — Top 10 Best Synastry Aspects](https://www.lookupthestars.com/post/top-10-best-synastry-aspects)
- [Minka Guides — Astrological Compatibility: Synastry and Relationships](https://minkaguides.com/astrological-compatibility/)

### Quy tắc dị tính truyền thống (gendered) — bối cảnh lịch sử
- [r/Advancedastrology — Synastry: Most Romantic Aspects (câu trích "man's Venus = wife, woman's Mars = husband")](https://www.reddit.com/r/Advancedastrology/comments/1kdzar4/symastry_most_romantic_aspects/)
- [Quora — Mars (woman) conjunct Venus (man) in synastry](https://www.quora.com/How-does-it-feel-to-have-Mars-woman-conjunct-Venus-man-in-synastry)

### Same-sex synastry cụ thể
- [Autostraddle — Your Completely Queer Guide To Horoscope Hookups](https://www.autostraddle.com/your-completely-queer-guide-to-horoscope-hookups-156790/)
- [GO Magazine — The 10 Queerest Zodiac Placements, Ranked](https://gomag.com/article/the-10-queerest-zodiac-placements-ranked-by-queer-intuition/)
- [Scribd — Gay Love in Astrology: Comprehensive Study (same-sex Venus-Venus conjunction)](https://www.scribd.com/document/1000343182/Gay-Love-in-Astrology-Comprehensive-Study)
- [Tumblr (erosastro) — Synastry That Indicates Strong Sexual Attraction](https://www.tumblr.com/erosastro/746377592559566848/synastry-that-indicates-strong-sexual-attraction)

### Debunk "gay indicators" (KHÔNG hợp lệ — góc nhìn phê phán)
- [r/AskAstrologers — Do you think astrology can predict homosexuality? (thảo luận, không đồng thuận)](https://www.reddit.com/r/AskAstrologers/comments/upmnew/do_you_think_astrology_can_predict_homosexuality/)
- [Medium — Uranus is the Queerest Planet (ví dụ loại claim cần cảnh giác)](https://medium.com/@shokti_36711/uranus-is-the-queerest-planet-11830946dd27)
- [Scribd — Homosexuality in the Horoscope (Karl-Günter Heimsoth — nguồn gốc đầu thế kỷ 20, bệnh lý hóa)](https://www.scribd.com/document/734393970/Homosexuality-in-the-Horoscope-Karl-Guenter-Heimsoth)

### Queer astrology modern / LGBTQ-affirming
- [Remezcla — How To Queer Up Astrology & Tarot](https://remezcla.com/features/culture/how-to-queer-up-astrology-tarot-according-to-gender-queer-non-binary-brujxs/)
- [NBC News — LGBTQ People and Young Women Are Astrology's Biggest Fans](https://www.nbcnews.com/nbc-out/out-news/lgbtq-people-young-women-are-astrologys-biggest-fans-us-survey-finds-rcna208311)
- [r/astrology — Trans, Queer and Anticapitalist Astrology Resources](https://www.reddit.com/r/astrology/comments/1cp7daj/trans_queer_and_anticapitalist_astrology_resources/)

### Bối cảnh nhà 7 / Descendant (phổ quát)
- [Astro Praveen — Astrology & LGBTQ+ Partners](https://www.astropraveen.com/astrology-lgbtq-partners/)
