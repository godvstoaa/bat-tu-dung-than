# HUYỀN GIỚI · MỆNH DO TA TẠO

## Tài liệu thiết kế game (Game Design Document) — bản AAA

| | |
|---|---|
| Phiên bản tài liệu | 1.0 (2026-11-05) |
| Thể loại | Nhập vai thế giới mở 3D · «văn tu» (tu tâm, không giết chóc) · MMO nhẹ |
| Nền tảng | Web (Three.js, bản hiện có) → PC / di động bản đầy đủ. iOS có nhánh tính năng riêng (4.3b) |
| Nguồn nội dung | Engine của app Bát Tự gốc (`src/engine/*`): mọi chỉ số, luận giải, phương pháp cải mệnh **lấy từ dữ liệu thật của app** |
| Hiện trạng code | `src/game/*`, xem `GAME-V2-THIET-KE.md`, `GAME-NOI-DUNG-THEO-APP.md` |

> **Đây là bản sơ đồ tổng.** Bộ tài liệu chi tiết gồm 14 tập (≈127.700 dòng) nằm ở [`docs/gdd/`](gdd/README.md): mỗi mục 1–14 dưới đây có một tập riêng (`gdd/01-tam-nhin/` … `gdd/14-rui-ro/`). Khi bản này và các tập mâu thuẫn nhau, **các tập và canon `gdd/00-KINH-DIEN-CHUNG.md` (kèm đính chính §12) là chuẩn**.

### Mục lục

1. Tầm nhìn và trụ cột thiết kế
2. Thế giới quan
3. Cốt truyện chính (bốn hồi và vĩ thanh)
4. Nhân vật từ bát tự: hệ chỉ số
5. Nghịch Thiên Cải Mệnh: hệ thống cải mệnh
6. NPC dẫn đạo và Thầy AI
7. Mười hai thánh địa: khu truyền đạo và kiến trúc
8. Quy chuẩn công trình: «không có công trình làm màu»
9. Tu luyện, cảnh giới và vòng chơi
10. Xã hội, môn phái và lễ hội
11. Kinh tế và kiếm tiền có đạo đức
12. Trình bày: âm thanh, giao diện, camera
13. Kỹ thuật và sản xuất
14. Rủi ro, tuân thủ và tôn trọng tín ngưỡng
- Phụ lục A: bảng ánh xạ engine → game
- Phụ lục B: lỗi engine phát hiện khi rà soát
- Phụ lục C: bảng thuật ngữ

---

## 1. Tầm nhìn và trụ cột thiết kế

**Một câu:** người chơi nhập ngày giờ sinh thật. Lá số của họ trở thành nhân vật, với điểm mạnh, điểm yếu và «căn cốt» đúng như cổ pháp. Rồi họ đi khắp các thánh địa Đạo, Phật, Nho, cả bàng môn, để học cách **tự cải mệnh**.

**Cảm xúc đích:** lúc đầu «game hiểu mình quá». Giữa game là «mình đang thật sự tu». Lúc kết thúc là «mệnh do ta tạo».

### 1.1 Sáu trụ cột (mọi quyết định thiết kế phải qua cả sáu)

| # | Trụ cột | Nghĩa là | Không được |
|---|---|---|---|
| T1 | **Lá số là nhân vật** | Chỉ số, đặc tính, cốt truyện mở đầu đều sinh từ `analyze()` của app | Không bịa công thức bói riêng của game; không cho chọn chỉ số tự do |
| T2 | **Mệnh do ta tạo** | Lá số thấp có lộ riêng, và có **lợi thế tu luyện** (hệ số Nghịch Thiên, §4.7) | Không nói «mệnh đã định», không làm người chơi xấu hổ vì lá số |
| T3 | **Văn tu, không sát phạt** | Thử thách là tâm, trí, đức, nghề: giải án, thiền, học, cứu người, kết phù, xây đạo tràng | Không có quái để chém lấy kinh nghiệm |
| T4 | **Thế giới thật** | Mọi công trình đi vào được và có công năng (§8); kiến trúc đúng phong cách từng truyền thống (§7) | Không dựng mặt tiền giả, không trộn phong cách |
| T5 | **Đúng cổ pháp** | Game nói đúng như trang chính; luận giải sâu đi qua Thầy AI với cùng dữ liệu lá số | Không mâu thuẫn trang chính; AI không bịa sao (đã có `checkNeo`) |
| T6 | **Tôn trọng và an toàn** | Tín ngưỡng thật được trình bày nghiêm túc; nội dung âm tà là truyện, có cảnh báo, có lối quay về | Không hướng dẫn nghi thức có hại, không bán «đổi mệnh», không chẩn bệnh |

### 1.2 Đối tượng người chơi

- **Người dùng app Bát Tự hiện có** (lõi): đã quen thuật ngữ, muốn trải nghiệm lá số của mình «sống» trong thế giới 3D.
- **Người mê tu tiên / võ hiệp** (mở rộng): đến vì thế giới đẹp, ở lại vì nhân vật mang lá số thật của mình.
- **Người tìm sự an tâm**: thiền, trà, lễ, nhật ký thiện. Game là một nơi tĩnh.

---

## 2. Thế giới quan

### 2.1 Huyền Giới

- **Đại lục:** Huyền Giới là đại lục nổi giữa biển mây (bản đồ 2048 m hiện có, mở rộng thành 12 thánh địa ở §7).
- **Trung tâm:** **Huyền Thành** và **Huyền Quán Sơn Môn**, nơi các thầy Tử Bình đọc mệnh cho thiên hạ.
- **Thiên Mệnh Bàn:** treo lơ lửng trên Sơn Môn (đã có trong game: `thienBan`), là chiếc la bàn khổng lồ «ghi» vận hành của trời đất: can chi năm, tháng, ngày, giờ.

### 2.2 Biến cố khởi đầu — «Định Mệnh Hội»

- **Thiên Mệnh Bàn nứt.** Từ ngày đó, trong dân gian lan truyền một giáo thuyết: **«mệnh đã định, không đổi được — trừ khi trả tiền»**.
- **Kẻ gieo giáo thuyết:** **Định Mệnh Hội**, hội của những thầy bói lừa đảo.
  - Họ đọc lá số rất chuẩn, rồi phán chắc nịch và dọa người.
  - Sau đó họ bán «lễ đổi mệnh» giá cắt cổ.
  - Thủ lĩnh ngầm là một **yểm sư Lỗ Ban**, kẻ dùng 厭勝 yểm thuật (`bitruyen-data`, app ghi «cấm thực hành»).
- **Phe phản diện là thói «định mệnh luận» và nạn lừa đảo tâm linh**, chứ không phải quái vật. Điều này khớp các ranh giới an toàn của app (`anti-manipulation-data › refusalBoundaries`):
  - **RB2:** không phán «mệnh đã định»;
  - **RB5:** không bán nghi lễ / lừa đảo.

### 2.3 Hai nhân vật biểu tượng

Cả hai lấy từ chuyện **Liễu Phàm** (`remedy-fate › LIAOFAN_STORY`):

- **Khổng tiên sinh** (người đoán mệnh). Ông đoán **đúng tới từng chi tiết** đời người chơi, bằng chính engine của app: đại vận, năm hạn, Thái Tuế.
  - Ông không ác; ông tin mệnh đã định.
  - Ông là **gương** cho người chơi: «Ta đoán đúng hết. Vậy con định sống đúng như lời ta sao?»
- **Vân Cốc thiền sư** (người chỉ đường cải mệnh). Ông dạy rằng điều đoán được chỉ là **mệnh của người chưa tự làm chủ**, và chỉ ra con đường: lập mệnh, cải quá, tích thiện, khiêm đức.

### 2.4 Quy luật của thế giới (cũng là cơ chế)

1. **Can chi là thời tiết.** Năm / tháng / ngày / giờ trong game là **can chi thật** (`lunar-javascript`). Hành của ngày tăng giảm hiệu quả hoạt động theo Dụng / Kỵ của người chơi (đã có lịch ngày).
2. **Vận đổi theo đời thực.** Đại vận và lưu niên của nhân vật là của **chính người chơi ngoài đời** (Vận Mệnh Các). Năm Thái Tuế phạm thì có chuỗi «năm hạn»: thử thách, không phải phạt.
3. **Công đức là năng lượng.** Mọi việc thiện ghi vào **Sổ Công Quá** (`remedy-fate › CONG_QUA`, `meritLedger`) và thành Đạo Hạnh (Hậu Thiên).
4. **Nghiệp có thật nhưng trả được.** Mười ác nghiệp (`YEGUO`) sinh «nghiệp chướng»; sám hối (`CHAN_HUI`) và việc thiện chuyển hóa nghiệp.

---

## 3. Cốt truyện chính

Cấu trúc: **Mở đầu → Hồi I → Hồi II → Hồi III → Hồi IV → Vĩ thanh**, khoảng 40–60 giờ chơi cho tuyến chính. Mỗi hồi có **một nhánh rẽ theo Mệnh Cách** của người chơi (§4.5), để mỗi người đi một câu chuyện khác nhau dù cùng thế giới.

### Mở đầu — «Nhập Môn» (0,5–1 giờ) — đã có phần lớn

| Cảnh | Diễn biến | Hệ thống | Engine |
|---|---|---|---|
| 0.1 Cổng Sơn Môn | Người gác cổng hỏi «ngày giờ con sinh?» | Form bát tự (đã có) | `analyze()` |
| 0.2 Lễ lật trụ | Bốn trụ lật lần lượt; thanh ngũ hành; Dụng / Hỷ / Kỵ | Lễ nghi (đã có) → **Mệnh Bàn** (§4) | `wx`, `yong`, `synthesis` |
| 0.3 Phẩm phục | Áo theo Dụng thần | Tàng Y Các (đã có) | `yong.primary` |
| 0.4 Lời phán | **Khổng tiên sinh** ngồi ở bậc Sơn Môn, phán ba câu đúng về đời người chơi | Thoại AI theo persona «đoán mệnh» (§6) | `synthesis.paragraphs`, `dayun`, `liunian` |
| 0.5 Rẽ nhánh | Theo Mệnh Cách: Thuận Thiên / Đắc Cứu / Nghịch Thiên / Dị Cách | Đặt cờ cốt truyện | `patternQuality.quality` |

**Kịch bản lời phán (0.4).** Mẫu cho lá số thật 1990-05-15 08:30 nam, điểm 41, Thân quá vượng, Dụng Thủy:

> Khổng tiên sinh (vuốt râu, không ngẩng lên): «Canh Kim sinh tháng Ngọ, lửa luyện mà kim cứng. Năm nay Bính Ngọ, Thất Sát lâm năm. Từ giờ tới cuối năm, việc công khó ngóc đầu. Ba mươi tám tuổi đổi vận Ất Dậu, bình hòa mười năm.» (ngẩng lên) «Ta nói sai câu nào chưa? … Không sai. Thì con định sống đúng như vậy à?»

*(Mọi dữ kiện lấy từ engine. AI chỉ đổi giọng, không thêm dữ kiện; `checkNeo` kiểm.)*

### Hồi I — «Bản Mệnh» (6–10 giờ): hiểu mình

**Mục tiêu:** hiểu lá số của chính mình qua việc làm, không phải đọc chữ.

| Nhiệm vụ | Nội dung | Nơi | Engine |
|---|---|---|---|
| I.1 «Ba bậc thang» | Giải 3 án khách (đã có) để học 6 bước luận | Sơn Môn | `cases.js` |
| I.2 «Hành thiếu» | Tìm vật phẩm của hành yếu nhất (vd thiếu Thủy → lấy nước suối Cùng Thông Hồ) | Bản đồ | `wx.pct`, `yong` |
| I.3 «Mười năm này» | Vào Vận Mệnh Các, đọc cổng đại vận đang đi | Vận Mệnh Các (đã có) | `vanmenh.js` |
| I.4 «Năm tuổi» | Thái Tuế Điện: tuổi mình phạm gì; thắp đèn | Thái Tuế Điện (đã có) | `thaitue.js` |
| I.5 «Gương Liễu Phàm» | Gặp **Vân Cốc thiền sư** lần đầu; nghe chuyện Liễu Phàm; nhận **Sổ Công Quá** | Am Vân Cốc (mới, trên núi sau Hậu Sơn) | `LIAOFAN_STORY`, `CONG_QUA` |
| I.6 «Mệnh Đồ» | Vân Cốc vẽ **Mệnh Đồ 6 tầng** riêng cho người chơi | Am Vân Cốc | `gaimenh.js › gaimenhPlan(R)` |

**Nhánh theo Mệnh Cách:**

- **Thuận Thiên (成格):** Tổ Sư nhận làm đệ tử chính thức. Thử thách: một khách quý muốn mua lá số «đẹp» của người chơi để ghép danh tính (bài học đạo đức).
- **Đắc Cứu (有救):** Vân Cốc nói «Con có bệnh, nhưng trời cũng gửi thuốc». Danh sách «vị thuốc» = `patternQuality.rescues[].drug` → mỗi vị là một thánh địa phải tới ở Hồi II.
- **Nghịch Thiên (败格):** Sơn Môn **chưa nhận** (thầy bảo «chưa đủ duyên»). Người chơi nghỉ tạm ở nhà trọ Huyền Thành. Đêm đó Vân Cốc tìm tới (persona «Nghịch Thiên Cải Mệnh»: trang chính đã tự đổi sang persona này khi điểm < 46). Lời mở: **«Mệnh do ta tạo.»**
- **Dị Cách (特殊):** một đạo sĩ Phương Sĩ (`schools-data › fangshi`) nhận ra «cách lạ». Dạy thuận thế thay vì phù ức.

### Hồi II — «Vạn Đạo» (15–20 giờ): đi tìm đạo

**Mục tiêu:** đi ít nhất **3 thánh địa** theo **Mệnh Đồ** cá nhân. Mỗi tầng của Mệnh Đồ chỉ về một nơi:

| Tầng Mệnh Đồ (`gaimenhPlan.layers`) | Thánh địa gợi ý | Việc làm |
|---|---|---|
| KHÔNG GIAN (huyền không, bát trạch) | Phong Thủy Viên (sảnh Dương Trạch) + Long Hổ Sơn | sửa nhà cho chính mình trong game (nhà ở Huyền Thành): hướng, phòng ngủ, sát |
| TÊN (ngũ cách) | Văn Miếu (bàn đặt tên) | đặt **đạo hiệu** hợp Dụng thần (`naming.js`) |
| THỜI (trạch nhật) | Lịch Đường (sảnh Trạch Nhật) | chọn ngày lành cho lễ nhập đạo của mình |
| THÁI TUẾ | Thái Tuế Điện | an Thái Tuế; chuỗi «năm hạn» nếu phạm |
| LÀM CÔNG (Manh phái 做功) | Manh Phái Cốc + Ngũ Duy | nghề hợp **trục mạnh** (§4.4): thương / trị / học / nghệ / đồng đạo |
| TÍCH ÂM ĐỨC (cốt lõi) | Bút Tháp Tịnh Độ / Văn Miếu / Yên Tử | Sổ Công Quá: chuỗi cứu người, phóng sinh, bố thí |

**Tuyến phản diện xen kẽ:** Định Mệnh Hội mở «quầy đổi mệnh» ở từng vùng.
- Mỗi vùng có một **án lừa đảo**: người chơi phải dùng kiến thức thật để vạch mặt. Ví dụ: thầy bói nói NPC «phạm Thái Tuế, phải cúng 10 lượng vàng», nhưng engine cho thấy tuổi đó không phạm.
- Dữ liệu chống lừa của app (`anti-manipulation-data › detectionPatterns`) là «sách giáo khoa» của nhiệm vụ này.

### Hồi III — «Năm Hạn» (8–12 giờ): thử lửa

- **Bối cảnh:** Thiên Mệnh Bàn nứt thêm. Năm can chi của thế giới trùng **năm hung nhất** trong lưu niên của người chơi (`liunian` có điểm thấp nhất trong 10 năm tới, game «tua» thế giới tới năm đó trong một chuỗi mộng).
- **Thử thách:** giữ những gì đã cải trong khi mọi việc khó hơn (Kỵ thần vượng).
- **Bài học:** **thuận vận thì làm, nghịch vận thì giữ** (đúng `GAI_LEVELS`: cải vận ngắn hạn, cải tâm trung hạn).
- **Cám dỗ chính — Tà Lộ (§5.5).** Yểm sư Lỗ Ban đề nghị: «Ta yểm cho con qua năm hạn này, nhanh, chắc. Chỉ cần con chôn tấm bùa này dưới nền nhà người khác.»
  - **Nhận:** người chơi vào Tà Lộ.
  - **Từ chối:** chuỗi «tự lực qua hạn».

### Hồi IV — «Âm Dương» (6–10 giờ)

- **Tà Lộ:** sức mạnh lớn dần nhưng NPC thân quen lần lượt gặp nạn vì «yểm». Kết hồi: **xuống Phong Đô** đối diện **sổ nghiệp**. Chọn sám hối → chuỗi trả nghiệp (cứu đúng những người đã hại), quay về chính lộ với danh hiệu **«Hồi Đầu»**.
- **Chính lộ:** xuống Phong Đô **để cứu** một người bạn (NPC hoặc người chơi khác đang ở Tà Lộ). Học trừ tà chính tông (Bắc Đế, Mao Sơn, Lư Sơn) và lòng từ của Địa Tạng.
- **Hai lộ gặp nhau ở cầu Nại Hà.** Đây là cảnh MMO: người chơi chính lộ có thể **kéo** người chơi Tà Lộ lên.

### Vĩ thanh — «Côn Lôn Thiên Trì»

- **Điều kiện:** «Quy nhất», tức đã đi ≥ 3 đạo thống, giữ Sổ Công Quá dương.
- **Cảnh cuối:** đứng trước **Thiên Mệnh Bàn**. Bàn không sửa bằng sức mạnh mà bằng **đạo hạnh của cả máy chủ** (sự kiện chung: tổng công đức của mọi người chơi trong mùa).
- **Lời kết của Vân Cốc:** «Mệnh con vẫn vậy: tám chữ ấy không đổi một nét. Nhưng người mang tám chữ ấy đã khác.»
- **Thiên Bảng:** tên người chơi khắc theo **Đạo Hạnh**, không theo căn cốt.
- **Sau vĩ thanh:** mùa mới (§10) theo năm can chi thật. Mỗi Tết Nguyên Đán đổi «niên chủ» Thái Tuế, kéo theo sự kiện mới.

---

## 4. Nhân vật từ bát tự — hệ chỉ số

Khi nhập bát tự ở cổng, `chart.js › analyze()` chạy **một lần** và sinh **Mệnh Bàn** của nhân vật. Mọi chỉ số dưới đây **lấy thẳng từ trường dữ liệu engine đang có**, không bịa thêm công thức bói mới. Nhờ vậy, người chơi xem lá số trên trang chính và trong game thấy **cùng một con số**.

### 4.1 Mệnh Bàn — bảng chỉ số gốc (Tiên Thiên)

| Chỉ số trong game | Nguồn engine (trường thật) | Thang | Ý nghĩa trong lối chơi |
|---|---|---|---|
| **Tiềm Lực** (căn cốt) | `R.synthesis.score` | 0–100 | Điểm tiềm lực tiên thiên. Quyết định **trần tu vi khởi đầu** và tốc độ ở 3 cảnh giới đầu. Hiện kèm **bách phân vị** `R.synthesis.percentile` («hơn 31% người»). |
| **Phẩm căn** | `R.synthesis.gradeVi` (10 bậc) | — | Tên bậc căn cốt (bảng 4.2). |
| **Phúc phận** | `R.synthesis.fortune` (6 bậc: đại phú quý … tiềm năng ẩn) | — | Hệ số rơi vật phẩm / Phúc Khí cơ bản. Bậc «tiềm năng ẩn» mở **chuỗi nhiệm vụ ẩn** riêng. |
| **Ngũ Hành Lực** (5 chỉ số) | `R.wx.pct.{木,火,土,金,水}` (tổng 100) | % | 5 thuộc tính (bảng 4.3). |
| **Thân Lực** | `R.strength.effRatio` (0–1) + `R.strength.level` (5 mức) | 0–100 | Vượng thì **tự lực** (đi một mình mạnh). Nhược thì **cần trợ** (nhận buff ×1,5 từ sư phụ, bạn đồng hành, quý nhân). |
| **Thiên Mệnh Hành** (Dụng) | `R.yong.primary` | hành | Hành «hợp mệnh»: trang phục / hào quang / vùng đất hợp hành cho thưởng (đã có: Hợp mệnh trong Tàng Y Các). |
| **Hỷ Hành / Kỵ Hành / Cừu Hành** | `R.yong.xi`, `R.yong.ji`, `R.yong.chou` | hành | Hỷ thì thưởng phụ. Kỵ thì **thử thách**: vùng / giờ / mùa của hành kỵ khó hơn nhưng thưởng tu vi lớn hơn (×1,3). |
| **Ngũ Duy** (5 thiên phú) | `fiveDimRadar(R.chart).dims` (Tài · Quan · Ấn · Thực · Tỷ, 0–100) | 0–100 | 5 nhánh kỹ năng (bảng 4.4). |
| **Mệnh Cách** | `R.pattern.name/vi` + `R.patternQuality.quality` (成格 / 有救 / 败格 / 特殊) | — | **Lớp nhân vật về mặt cốt truyện** (bảng 4.5). Quyết định mở màn của tuyến chính. |
| **Mệnh Cấp** | `chart-level.js › classifyChartLevel(R).level` (极品 / 贵格 / 富格 / 清贵 / 常格 / 下格) | — | Danh hiệu khởi đầu hiện trên khung tên (vd «Thanh Quý»). |
| **Nguyên Khí** | `vitality.js › analyzeVitality.baseVitality` (0–100) | 0–100 | **Thể lực hằng ngày**: số lượt hoạt động tốn sức (leo thần đạo, tĩnh tọa dài) trước khi cần nghỉ. Hồi bằng trà, ngủ, đan dược. |
| **Đặc Tính** (perk) | `R.shensha` (~31 thần sát có mặt) + `noble-stars.analyzeNobleStars` | danh sách | Mỗi sao có mặt là một đặc tính bị động (bảng 4.6). |
| **Túc Nghiệp** | `liudao.js › computeLiuDao.primary` + `poisons{tham, sân, si}` | — | Xuất thân tiền kiếp (hư cấu, tham khảo) cho phần mở đầu; tam độc là **3 thanh tâm ma** phải tu giảm. |
| **Tính Khí** | `personality-profile` (nhật chủ) + `nayin-personality` (nạp âm nhật trụ) | — | Giọng thoại của nhân vật trong lựa chọn hội thoại; NPC phản ứng theo tính khí. |
| **Thời Vận** | `R.dayun[current]` + `R.liunian[isNow]` (score 0–100) | — | **Thời tiết vận** cá nhân theo năm thật (đã có ở Vận Mệnh Các): ảnh hưởng nhỏ (±10%) tới thưởng theo năm / tháng / ngày, đúng đời thực của người chơi. |

**Nguyên tắc minh bạch:** mỗi chỉ số trong Sổ Mệnh có nút «Vì sao?». Bấm vào thì hiện `R.synthesis.factors[]` (các dòng «+4 …», «−6 …»), đúng lý do engine cộng / trừ điểm. Không có con số nào là «hộp đen».

### 4.2 Phẩm căn — 10 bậc (`synthesis.gradeVi`)

| Điểm | gradeVi (engine) | Phẩm căn trong game | Mô tả hiện cho người chơi |
|---|---|---|---|
| ≥86 | ĐỈNH CAO HUYỀN THOẠI · CỰC PHẨM | **Thiên Linh Căn** | Trời ban sẵn — con đường là giữ, không phải cải. Thử thách chính: kiêu ngạo (tâm ma «mạn»). |
| ≥80 | THƯỢNG ĐẲNG XUẤT CHÚNG | **Dị Linh Căn** | Hiếm có. |
| ≥73 | THƯỢNG ĐẲNG · Rất hiếm | **Song Linh Căn thượng** | |
| ≥66 | THƯỢNG ĐẲNG · Hiếm | **Song Linh Căn** | |
| ≥58 | TRUNG THƯỢNG CAO | **Tam Linh Căn thượng** | |
| ≥50 | TRUNG THƯỢNG | **Tam Linh Căn** | |
| ≥43 | TRUNG ĐẲNG THUẬN | **Tứ Linh Căn thuận** | |
| ≥36 | TRUNG ĐẲNG · Cân bằng | **Tứ Linh Căn** | |
| ≥28 | TRUNG HẠ | **Ngũ Linh Căn** («tạp căn») | Mở **Nghịch Thiên Lộ** (§5). |
| <28 | HẠ ĐẲNG | **Phàm Căn** | Mở **Nghịch Thiên Lộ** + chuỗi «Khổ tận cam lai». Nhân vật có hệ số tu vi cao nhất game (§4.7). |

Tên «linh căn» mượn từ tiểu thuyết tu tiên cho dễ hiểu. Bên dưới luôn ghi tên gốc của app (gradeVi, gradeZh) để **không tách khỏi cổ pháp**.

### 4.3 Ngũ Hành Lực — 5 thuộc tính

| Hành | Thuộc tính | Ảnh hưởng lối chơi (không chiến đấu — game «văn tu») |
|---|---|---|
| 木 Mộc | **Sinh Cơ** | hồi Nguyên Khí nhanh; trồng dược thảo, chăm vườn đào; tĩnh tọa ở rừng |
| 火 Hỏa | **Nhiệt Tâm** | luyện đan, thắp đèn / nhang lâu cháy; lễ hội; giao lưu MMO (thu hút NPC) |
| 土 Thổ | **Định Lực** | chịu tâm ma tốt (giảm dao động ở thiền định); phong thủy, xây đạo tràng |
| 金 Kim | **Tuệ Kiếm** | phá chướng: ải công án, giải án khó (cách cục), khoa cử |
| 水 Thủy | **Linh Tuệ** | học cổ thư nhanh, đọc tượng (Manh phái), du phương xa |

- **Công thức:** chỉ số = `wx.pct[hành]`. **Dụng thần nhân 1,3**, **Kỵ thần nhân 0,8**. Phần bù cho hành kỵ là thưởng tu vi khi vượt thử thách hành đó (§4.1).
- **Mất cân bằng là đặc trưng, không phải lỗi:** lá số 55% Kim / 2% Thủy (ví dụ thật từ engine: 1990-05-15 08:30 nam) là nhân vật «Tuệ Kiếm cực mạnh, Linh Tuệ gần như không». Hành trình là **bổ Thủy**: đúng Dụng Thủy của lá số. Game nói đúng lời trang chính.

### 4.4 Ngũ Duy — 5 nhánh thiên phú (`five-dim-radar`)

| Trục | Thập thần | Nhánh kỹ năng | Ví dụ mở khóa |
|---|---|---|---|
| Tài | Chính / Thiên Tài | **Thương đạo** | buôn dược liệu giữa các vùng, mở quầy ở chợ Huyền Thành |
| Quan | Chính Quan / Thất Sát | **Trị đạo** | làm chấp sự môn phái, lập bang hội, xử án tranh chấp NPC |
| Ấn | Chính / Thiên Ấn | **Học đạo** | đọc Đạo Tạng, khoa cử, thụ lục nhanh |
| Thực | Thực Thần / Thương Quan | **Nghệ đạo** | vẽ phù, thư pháp, đan dược, cầm nhạc |
| Tỷ | Tỷ Kiên / Kiếp Tài | **Đồng đạo** | ghép đội, đồng tu, sư đồ |

Trục mạnh nhất (`dominant`) cho **kỹ năng khởi đầu**. Trục yếu nhất (`weakest`) là **«khuyết thập thần»**: trang chính đã có mục *Khuyết/Thiếu Thập Thần*, game biến nó thành chuỗi nhiệm vụ học bù.

### 4.5 Mệnh Cách — lớp cốt truyện (`patternQuality.quality`)

| Chất lượng | Lớp | Mở màn |
|---|---|---|
| **成格** (thành cách) | **Thuận Thiên** | Được Tổ Sư nhận làm đệ tử ngay. Thử thách: giữ cách không bị phá trong các đại vận kỵ (đọc từ `adjustDayunByGeju`). |
| **有救** (có cứu) | **Đắc Cứu** | Có «bệnh» (`diseases[]`) nhưng có «thuốc» (`rescues[].drug`). NPC chỉ đường đi tìm «vị thuốc» đó: mỗi thuốc là một vùng / đạo thống. **Đây là chuỗi nhiệm vụ cá nhân hóa mạnh nhất.** |
| **败格** (bại cách) | **Nghịch Thiên** | Bị Sơn Môn từ chối nhận vào lúc đầu (tình tiết, không phạt). Gặp **người dẫn đạo nghịch thiên** (§5.2). Mở thẳng Nghịch Thiên Lộ. |
| **特殊** (cách đặc biệt: tòng, hóa khí…) | **Dị Cách** | Lộ riêng: «thuận theo thế» thay vì «phù ức». Dụng thần ngược thường lệ (engine đã xử lý `pattern.special`). |

### 4.6 Đặc Tính từ Thần Sát (ví dụ chọn lọc)

| Sao (key engine) | Đặc tính | Hiệu ứng |
|---|---|---|
| tianYi 天乙貴人 | **Quý Nhân Phù** | Mỗi ngày một NPC ngẫu nhiên tặng quà / chỉ đường; khi kẹt nhiệm vụ có gợi ý miễn phí |
| wenChang 文昌 | **Văn Xương Chiếu** | +20% điểm khoa cử, đọc cổ thư nhanh |
| huaGai 華蓋 | **Hoa Cái Nhập Mệnh** | Thiên hướng tôn giáo, triết học: tu vi ở mọi đạo thống +15%, nhưng giao lưu −10% (cô độc) |
| yiMa 驛馬 | **Dịch Mã** | Đi nhanh +20%, trạm đi nhanh rẻ hơn, nhiệm vụ du phương thưởng thêm |
| taoHua 桃花 | **Đào Hoa** | NPC thiện cảm nhanh; MMO: mời ghép đội dễ được nhận |
| yangRen 羊刃 | **Dương Nhận** | Ý chí mạnh: ải tâm ma «sân» khó hơn, vượt được thì nhận đặc tính «Kiên Nhẫn» |
| kuiGang 魁罡 | **Khôi Cương** | Mở nhánh đối thoại cứng rắn với NPC quyền lực |
| tianDe / yueDe 天德 月德 | **Thiên Đức / Nguyệt Đức** | Giảm «nghiệp» phát sinh khi lỡ chọn sai (§5.5) |
| xueRen / siFei 血刃 四廢 | **Kiếp số** | Không phạt chỉ số. Thêm **một ải kiếp** trong chuỗi chính, vượt được thì thưởng lớn |

Các sao còn lại có hiệu ứng tương tự, viết thành bảng đầy đủ trong `docs/game-data/shensha-perks.json` (giai đoạn sản xuất).

### 4.7 Tiên Thiên và Hậu Thiên — vì sao lá số thấp vẫn có thể đứng đầu

- **Tiềm Lực Tiên Thiên** = `synthesis.score`, cố định. Luôn hiện, không đổi được, đúng như lá số thật.
- **Tu Vi Hậu Thiên** = điểm tích lũy từ cải mệnh (§5): công đức, giới luật, học, tu, cứu người.
- **Cảnh giới** (bảng 6.1) tính theo `Tiên Thiên × 0,4 + Hậu Thiên`. Từ cảnh giới 4 trở lên, Tiên Thiên **không còn tính**.
- **Hệ số Nghịch Thiên** cho Hậu Thiên: `1 + (60 − Tiên Thiên)/100`, giới hạn trong khoảng 1,0–1,5.
  - Phàm Căn (20 điểm) nhận ×1,4 mỗi điểm công đức;
  - Thiên Linh Căn (88 điểm) nhận ×1,0.
  - Câu chuyện «khổ tận cam lai» thành **cơ chế** chứ không chỉ là lời.
- **Thiên Bảng (bảng xếp hạng) có 2 cột:** «Tiên Thiên» (không ai đổi được) và «Đạo Hạnh» (Hậu Thiên). Bảng chính xếp theo **Đạo Hạnh**.

**Câu dẫn khi người chơi thấy điểm thấp** (bắt buộc, chống cảm giác bị phán xét; khớp `anti-manipulation-data › refusalBoundaries` RB2 «không phán mệnh đã định»):

> «Lá số là hạt giống, không phải cái cây. Hạt nhỏ thì phải chăm nhiều hơn. Thầy chưa từng thấy ai chăm mà cây không lớn.»

---

## 5. Nghịch Thiên Cải Mệnh — hệ thống cải mệnh

App gốc đã có **toàn bộ khung lý thuyết**. Game biến từng khung thành cơ chế, theo đúng thứ tự sâu cạn của app:

| Tầng (`remedy-fate › GAI_LEVELS`) | App nói | Trong game | Thời gian | Có thể mất? |
|---|---|---|---|---|
| **改運 Cải Vận** (nông) | phương vị, màu, nghề, nhà, số, ăn, vật, ngày (`remedy › twelveLaws` ①–⑨) | **Bùa vận ngắn hạn**: trang phục hợp hành, hướng nhà, ngày lành. Thưởng +5–15% trong ngày / tuần | phút → tuần | Có: hết hạn |
| **改心 + 改行 Cải Tâm · Cải Hành** (giữa) | tự tu theo nhật chủ, tích âm đức, khiêm đức (⑩–⑫); `GAI_XIN` 5 bước 觉 → 停 → 转 → 净 → 化 | **Đạo Hạnh (Hậu Thiên)** tích lũy: giới luật, thiền, học, Sổ Công Quá | tuần → tháng | Giảm nếu phạm giới (có cách sám hối) |
| **改命 Cải Mệnh** (sâu) | «chỉ tích âm đức mới thật nghịch thiên»; Liễu Phàm 3000 / 6000 / 10000 công | **Cảnh giới** (§9) và **Thiên Bảng Đạo Hạnh**; mở Côn Lôn | mùa → nhiều mùa | Không (chỉ tăng) |

### 5.1 Mệnh Đồ — kế hoạch cải mệnh riêng từng người

- **Nguồn:** `gaimenh.js › gaimenhPlan(R)` trả `{ diagnosis[{sev, t, d}], layers[{pri, name, kind, acts[]}], verdict }`.
- **Hiển thị:** một **bản đồ 6 nút** trong Sổ Mệnh. Mỗi nút là một tầng, kèm:
  - **Chẩn đoán** (vì sao cần), lấy nguyên văn `diagnosis[].d`;
  - **Việc làm** (`acts[]`), mỗi việc là một **nhiệm vụ cụ thể** gắn NPC và địa điểm (bảng ở Hồi II, §3);
  - **Độ ưu tiên** `pri`: nút ưu tiên cao sáng hơn, NPC dẫn đạo nhắc tới trước.
- **Thứ tự cố định** như app: Không gian → Tên → Thời → Thái Tuế → Làm công → **Tích âm đức (cốt lõi, luôn mở)**.
- **Lá số tốt** (không có `diagnosis` nặng): Mệnh Đồ vẫn có nút cuối «Tích âm đức». Thông điệp: tốt thì giữ, không ai được miễn tu.

### 5.2 Người dẫn đạo nghịch thiên

| Điều kiện (engine) | NPC đến tìm | Persona AI | Lời mở |
|---|---|---|---|
| `synthesis.score < 46` (đúng ngưỡng trang chính đang dùng để đổi persona) | **Vân Cốc thiền sư** | «Nghịch Thiên Cải Mệnh» | «Mệnh do ta tạo, phúc tự mình cầu.» |
| `patternQuality.quality === '败格'` | Vân Cốc + **Tế tửu Văn Miếu** | Nghịch Thiên + Nho môn | «Cách bại thì dựng lại từ nền: lập chí trước.» |
| `patternQuality.quality === '有救'` | **Đan Đỉnh chân nhân** (người hái «thuốc») | Đắc Cứu | «Bệnh ở đâu thì thuốc ở đó. Thầy chỉ chỗ, con tự đi hái.» |
| `liudao.primary` thuộc ba đường dữ | **Ni sư Diệu Âm** | Sám hối – từ bi | «Tham, sân, si ai cũng có. Đếm được thì bớt được.» |
| `amta-analyze` mức ≥ trung (chỉ khi người chơi **tự bật** mục Âm tà, như app) | **Mao Sơn đạo nhân** | Trừ tà chính tông | «Đa phần cái gọi là tà là người mình mệt. Ngủ đủ đã, rồi thầy xem.» |

### 5.3 Sổ Công Quá — công đức là năng lượng

- **Nguồn:** `remedy-fate › CONG_QUA` (10 việc thiện +1…+3, 9 việc ác −1…−3) và `meritLedger(logged)` → điểm ròng và lời nhận xét.
- **Việc thiện trong game** (tự động ghi khi làm nhiệm vụ):

| Việc (app) | Cách làm trong game | Điểm |
|---|---|---|
| 救人 cứu người | giải án cho khách (đã có), cứu NPC gặp nạn ở Hồi III / IV | +3 |
| 放生 phóng sinh | thả cá ở hồ sen Bút Tháp, thả chim ở chợ (mua lại từ lồng) | +1 |
| 布施 bố thí | bố thí Phúc Khí cho NPC nghèo / quỹ chùa | +1…+2 |
| 勸善 khuyên thiện | vạch mặt Định Mệnh Hội (§3, Hồi II) | +2 |
| 敬老 kính lão / 孝 hiếu | chuỗi gia đình NPC ở Huyền Thành | +1 |
| 修橋補路 sửa cầu đường | góp công sửa đường đá giữa các vùng (sự kiện máy chủ) | +2 |

- **Việc ác:** chỉ phát sinh **khi người chơi chọn** (lừa NPC, nhận yểm thuật, nói dối trong hội thoại có lựa chọn). Game không bao giờ tự trừ điểm khi người chơi không có lựa chọn.
- **Mốc Liễu Phàm:** 3000 / 6000 / 10000 công (thang trong game chia 10) mở 3 **đại nguyện** (danh hiệu, cảnh giới, đoạn kết riêng).
- **Sổ đời thực (tùy chọn, mặc định tắt):**
  - người chơi tự ghi việc thiện ngoài đời (nhật ký, như cách Liễu Phàm ghi sổ), **không thưởng chỉ số**;
  - chỉ cho một biểu đồ cá nhân và câu nhắc từ Vân Cốc;
  - tránh biến việc thiện thật thành «cày điểm».

### 5.4 Nghiệp và sám hối

- **Mười ác nghiệp** (`YEGUO`: sát sinh, trộm cắp, tà dâm, nói dối, nói hai lưỡi, ác khẩu, nói thêu dệt, tham, sân, si). Mỗi nghiệp trong game là một **thanh nghiệp chướng** có tên riêng.
- **Gợi ý theo lá số:** `getYeguoForChart(R)` cho biết lá số dễ vướng nghiệp gì (vd Thất Sát → «sát», Thương Quan → «khẩu»). Game dùng để **nhắc trước**: NPC dẫn đạo cảnh báo khi người chơi sắp chọn lựa chọn dính đúng nghiệp đó. Không dùng để phạt.
- **Sám hối** (`CHAN_HUI`, 5 pháp) là chuỗi nhiệm vụ ở Bút Tháp / Phong Đô. Mỗi pháp:
  - một nghi thức trong game (tụng theo nhịp, lạy theo nhịp: mini-game nhịp điệu);
  - **bắt buộc kèm hành động sửa sai** (trả lại, xin lỗi, cứu giúp). Không có sám hối «chỉ bằng nút».
- **Kinh theo việc** (`JING_ZHOU`: Dược Sư cho bệnh, Địa Tạng cho nghiệp nặng, Kim Cang cho trí tuệ, Phổ Môn cho tai nạn, Lăng Nghiêm cho chướng ngại, Chuẩn Đề cho nghèo, Tống Tử Quan Âm cho con cái).
  - Trong game là **«Tàng kinh các»**: đọc giới thiệu, ý nghĩa, ngữ cảnh.
  - **Không in toàn văn chú** ngoài những gì app đã có và được phép trích. Không biến tụng kinh thành vật phẩm «bấm để buff».

### 5.5 Tà Lộ — con đường âm tà (lộ cám dỗ)

> Người chơi yêu cầu có «tu luyện âm tà». App gốc định nghĩa âm tà là **trừ tà / hộ thân / thu hồn**, có cổng tự nguyện bật và luật đạo đức (`amta-data › ETHICS`), còn yểm thuật **厭勝** thì ghi **«cấm thực hành»**. Vì vậy Tà Lộ trong game là **một tuyến truyện về cám dỗ và hồi đầu**, không phải một hệ «phép đen» có hướng dẫn.

**Cấu trúc Tà Lộ:**

1. **Lời mời.** Yểm sư Lỗ Ban (Hồi III) hoặc Vu y bà ở Miêu Cương (nếu người chơi hỏi «đường tắt»).
2. **Giao kèo.** Nhận **«Âm Bài»**: nhân hai Hậu Thiên trong 7 ngày (game), nhưng mỗi lần dùng sinh **«Nợ Âm»**, một con số **hiện công khai** trong Sổ Mệnh. Không có chi phí ẩn.
3. **Hệ quả lan ra thế giới (không phạt chỉ số trực tiếp).** NPC thân quen gặp chuyện lạ:
   - nhà Trà Thất có người ốm;
   - khách ở Sơn Môn bỏ về;
   - Thầy Tử Bình không tiếp.
   Người chơi **thấy** cái giá trả bằng người khác.
4. **Điểm không quay lại được?** Không có. Mọi lúc đều có thể **hồi đầu** (đến Bút Tháp / Phong Đô). Nợ Âm càng lớn thì chuỗi trả nghiệp càng dài.
5. **Kết thúc.** Phong Đô (§7.9): đọc sổ nghiệp → sám hối → **cứu từng người đã hại** → danh hiệu **«Hồi Đầu»**. Đây là danh hiệu hiếm và được kính trọng, vì app và game cùng tin rằng quay đầu là đạo.

**Giới hạn nội dung Tà Lộ (bắt buộc):**
- không mô tả nguyên liệu, câu chú, cách làm của bất kỳ yểm thuật / cổ thuật thật nào;
- vật phẩm và nghi thức là **ký hiệu hư cấu** của game;
- không gắn Tà Lộ với một dân tộc / tôn giáo có thật theo hướng miệt thị: người Miêu trong game là **nạn nhân và người chữa**, kẻ ác là yểm sư (người ngoài);
- nội dung chỉ mở sau **xác nhận tự nguyện** (như app).

**Đối trọng: trừ tà chính tông.**
- **Nguồn:** Mao Sơn, Lư Sơn (thu kinh), Bắc Đế / Động Uyên (thần chú), lấy từ `talisman-data`, `amta-data › rituals` (8 nghi theo phái).
- **Trong game:** chuỗi **cứu người bị trúng yểm**. Bước đầu luôn là **chẩn đoán đời thực**: ngủ, ăn, bệnh, áp lực. Có lời nhắc chuyển tới bác sĩ / chuyên gia tâm lý khi NPC mô tả triệu chứng thật (đúng `ETHICS › mental-health redirect` của app).

### 5.6 Đạo thống — 9 con đường, ánh xạ dữ liệu app

| Đạo thống | Phái / nguồn app | Thánh địa | Tu gì (cơ chế) | Tăng chỉ số |
|---|---|---|---|---|
| **Chính Nhất** | `zhengyi`, `shenxiao` | Long Hổ Sơn | kết phù (5 phần), thụ lục, bái Đẩu, trai tiếu | Định Lực, Thực (nghệ) |
| **Thanh Vi · Đan Đỉnh** | `qingwei`, `danding`, `cultivation-data`, `DAO_JIA` | Võ Đang | tĩnh tọa theo hơi thở, nội đan 4 bậc, Thái Cực | Nguyên Khí, Sinh Cơ |
| **Toàn Chân · Linh Bảo** | `quanzhen`, `lingbao`, `daozang (戒律, 科儀)` | Chung Nam | giới luật, vân thủy du phương, khoa nghi | Định Lực, Ấn (học) |
| **Thượng Thanh · Lư Sơn** | `maoshan`, `lushan`, `amta-data` | Mao Sơn | tồn tư, trừ tà chính tông, thu kinh cứu người | Tuệ Kiếm, công đức |
| **Bắc Đế · Động Uyên** | `beidi`, `dongyuan`, `talisman-data (咒)` | Phong Đô | siêu độ, giải oan, đọc sổ nghiệp | Giảm nghiệp chướng |
| **Thiền** | `GAI_XIN`, `spiritual-fs` (cần bổ sung Trúc Lâm) | Yên Tử | thiền định, công án, hành hương | Định Lực, tâm ma |
| **Tịnh Độ · sám hối** | `CHAN_HUI`, `JING_ZHOU`, `TEN_THIEN`, `liudao` | Bút Tháp | niệm Phật, phóng sinh, bố thí, sám hối, Cửu phẩm liên hoa | Công đức, Phúc phận |
| **Mật (Chuẩn Đề)** | `ZHUNTI`, `CHAN_HUI › 金剛薩埵` (cần bổ sung Tạng truyền) | Tạng Địa | quán tưởng, mạn-đà-la cát, bánh xe kinh | Linh Tuệ, vô thường |
| **Nho · Tịnh Minh** | `jingming`, `LIAOFAN`, `TEN_THIEN`, `spiritual-fs (仁義禮智信)`, `library-data` | Văn Miếu | khoa cử, công quá cách, đặt đạo hiệu, hiếu đạo | Ấn, Quan (trị) |
| **Bàng môn** (Tà Lộ / Vu y) | `amta-data` (đối trọng), `tcm`, hư cấu mới | Miêu Cương | y dược theo ngũ hành; cám dỗ – hồi đầu | — |

**Quy tắc đa đạo:** được tu song song tối đa **3 đạo thống chính** (giữ chiều sâu). Đạo thống **hợp Dụng thần** (theo `daozang › _YONG2CULT`) có hệ số +10%, nhưng không bắt buộc: người chơi tự chọn.

---

## 6. NPC dẫn đạo và Thầy AI

### 6.1 Kiến trúc hội thoại

```
Người chơi ─▶ NPC (persona) ─▶ askAI(question, R, cfg, { persona, gameContext, tools, style })
                                   │  SYSTEM_PROMPT gốc (thầy phong thủy thực chiến)
                                   │  + PERSONA của NPC (giọng, đạo thống, phạm vi, câu cấm)      ← MỚI
                                   │  + brief lá số (buildChartBrief + extendBrief)
                                   │  + GAME CONTEXT: cảnh giới, Mệnh Đồ, nhiệm vụ đang làm      ← MỚI
                                   │  + _ANTI_MANIP_GUIDE (giữ nguyên)
                                   ▼
                          trả lời (stream) ─▶ checkNeo (đối chiếu brief) ─▶ hiển thị + 3 gợi ý (suggestFollowups)
```

**Việc phải làm trong `ai.js`** (hiện chưa có):

1. Thêm tham số `persona: { id, name, school, voice, scope, forbid, opening }`. Chèn thành một system message **sau** SYSTEM_PROMPT và **trước** brief.
2. Thêm `gameContext` (chuỗi ngắn, < 600 ký tự): cảnh giới, các nút Mệnh Đồ đã / chưa xong, nhiệm vụ đang làm, vùng đang đứng.
3. Thêm `toolsAllow: string[]` để NPC chỉ dùng **tập công cụ** hợp vai trong `AI_TOOLS` (~40 công cụ). Ví dụ:
   - Thái Tuế NPC: `analyze_year`;
   - thầy địa lý: `fengshui_direction`;
   - Vân Cốc: `analyze_remedy_fate`.
4. **AI không cấp thưởng, không đổi trạng thái game.** Phần thưởng, mở khóa, tiến độ nhiệm vụ đều do **máy nhiệm vụ** (deterministic) quyết định. AI chỉ **giải thích, khuyên, dẫn dắt**. Tránh AI «hứa» điều game không làm.
5. **iOS và khi AI tắt** (`FEATURES.ai === false`, hoặc lỗi mạng): dùng `composeAnswer` (trả lời cục bộ của app) + **thoại kịch bản** của NPC. Game không phụ thuộc AI để tiến triển.

### 6.2 Danh sách NPC dẫn đạo (thẻ persona)

| NPC | Ở đâu | Đạo thống | Xưng hô / giọng | Phạm vi được nói | Công cụ AI | Câu cấm |
|---|---|---|---|---|---|---|
| **Thầy Tử Bình** | Bàn Thầy, Sơn Môn | Tử Bình (app gốc) | thầy – con, ấm, chậm | toàn bộ lá số, đại vận, lưu niên | toàn bộ (như hiện nay) | phán chết, phán bệnh |
| **Khổng tiên sinh** | bậc Sơn Môn, rồi các chợ | «định mệnh luận» (phản đề) | ta – ngươi, chắc nịch, lạnh | **chỉ nói điều engine đoán**; luôn kết bằng câu hỏi ngược | `analyze_year` | lời khuyên cải mệnh (để dành cho Vân Cốc) |
| **Vân Cốc thiền sư** | Am Vân Cốc | Liễu Phàm, cải mệnh | lão tăng – con, kể chuyện, hỏi ngược | `gaimenhPlan`, `remedy-fate`, Sổ Công Quá | `analyze_remedy_fate` | bán nghi lễ, hứa đổi mệnh chắc chắn |
| **Trương Thiên Sư** | Long Hổ Sơn | Chính Nhất | bần đạo – thí chủ, nghi lễ, uy | phù lục (cấu trúc, ý nghĩa), bái Đẩu, thụ lục | `fengshui_direction` | dạy vẽ phù thật, hứa phù trị bệnh |
| **Huyền Hư chân nhân** | Võ Đang | Thanh Vi, Đan Đỉnh | lão đạo – tiểu hữu, thong thả | nội đan, tĩnh tọa, Thái Cực | — | hướng dẫn nhịn ăn (辟穀), khí công trị bệnh |
| **Khâu đạo trưởng** | Chung Nam | Toàn Chân | bần đạo – đạo hữu, nghiêm | giới luật, khoa nghi, Đạo Tạng | tra `daozang` | — |
| **Mao Sơn đạo nhân** | Mao Sơn | Thượng Thanh, Lư Sơn | tôi – anh / chị, thực tế | trừ tà chính tông, chẩn đoán đời thực trước | `analyze_amta` (opt-in) | «bạn bị ma», chẩn bệnh |
| **Thiền sư Trúc Lâm** | Yên Tử | Thiền | ta – con, ít lời, công án | quán tâm, buông xả | — | đoán vận (từ chối nhẹ nhàng) |
| **Ni sư Diệu Âm** | Bút Tháp | Tịnh Độ, sám hối | sư – con, dịu | sám hối, phóng sinh, bố thí, Lục Đạo | — | đe dọa nghiệp báo |
| **Lạt-ma Đa Kiệt** | Tạng Địa | Mật (Chuẩn Đề) | — (giọng chờ tham vấn) | vô thường, quán tưởng | — | (chờ tham vấn §14) |
| **Tế tửu Văn Miếu** | Văn Miếu | Nho, Tịnh Minh | lão phu – trò, mạch lạc | lập chí, công quá cách, khoa cử, đặt tên | `analyze_name` | — |
| **Phán quan** | Phong Đô | Bắc Đế | bổn quan – ngươi, trang nghiêm | đọc sổ nghiệp (**Sổ Công Quá của chính người chơi**), trả nghiệp | — | dọa xuống địa ngục |
| **Vu y bà A Mậu** | Miêu Cương | bàng môn (hư cấu) | bà – cháu, thổ âm | y dược theo ngũ hành (`tcm`), chuyện xưa | — | công thức cổ / thuốc thật, chẩn bệnh |

### 6.3 Kịch bản mẫu — Vân Cốc gặp người chơi lá số thấp

*(Lá số mẫu: điểm 24, HẠ ĐẲNG, 败格. Dữ kiện lấy từ engine, giọng theo persona.)*

> **Vân Cốc:** Con ngồi đi. Thầy Tử Bình chưa nhận con phải không?
>
> **[Người chơi chọn]** ① «Lá số con xấu.» ② «Con không biết vì sao.» ③ (im lặng)
>
> **Vân Cốc** (với ①): Xấu là chữ của người xem, không phải chữ của trời. Lá số con… (đọc `synthesis.factors`) … Thất Sát không có gì chế, Tài lại sinh thêm Sát. Như người đi giữa hai hổ. Con thấy đúng không?
>
> **Vân Cốc:** Ba trăm năm trước có người tên Liễu Phàm. Một ông thầy đoán đời ông đúng từng chữ: đỗ thứ mấy, ăn bao nhiêu lương, không con, chết năm năm mươi ba. Mọi chuyện xảy ra đúng như thế, nên ông thôi không cầu gì nữa. Rồi ông gặp thầy.
>
> **Vân Cốc** (mở **Mệnh Đồ**): Con nhìn đây. Sáu tầng. Tầng dưới cùng ai cũng đi được, ngay hôm nay: tích âm đức. Mỗi việc thiện là một nét con tự viết lại.
>
> *(Tặng **Sổ Công Quá**. Mở nhiệm vụ «Ba việc thiện đầu tiên». Mở thoại AI tự do, persona Vân Cốc.)*

### 6.4 Quy tắc an toàn hội thoại (bắt buộc với mọi NPC)

Giữ nguyên toàn bộ `anti-manipulation-data` của app. Thêm 4 quy tắc riêng cho game:

1. **Không phá vai để bán hàng.** NPC không bao giờ nhắc Tàng Y Các, VIP, Ngọc. Cải mệnh **không bán bằng tiền** (RB5).
2. **Không phán định mệnh** (RB2). Mọi câu đoán phải kèm «con có thể…».
3. **Chuyển hướng khủng hoảng.** Người chơi nói về tự hại, bệnh nặng, khủng hoảng thật thì NPC rời vai, đưa thông tin hỗ trợ thật (như app đang làm), rồi mới quay lại vai.
4. **Không bịa trạng thái game.** Câu nào nhắc tới game (nhiệm vụ, phần thưởng) phải khớp `gameContext`. Có kiểm tự động: regex tên nhiệm vụ / vật phẩm trong câu trả lời phải có trong danh sách hợp lệ, không thì bỏ câu đó.

### 6.5 Chi phí và giới hạn

- Mỗi người chơi: **10 lượt hỏi AI miễn phí / ngày** (VIP 30). Thoại kịch bản và trả lời cục bộ không giới hạn.
- Cache theo (persona, câu hỏi chuẩn hóa, hash lá số) 24 giờ cho các câu mở đầu hay gặp.
- Máy chủ đã có công tắc tắt AI (`isAiEnabled`). Khi tắt, NPC chuyển sang thoại kịch bản, không báo lỗi.

---

## 7. Mười hai thánh địa — khu truyền đạo và kiến trúc

Mỗi thánh địa là một vùng 600 × 600 m đến 1 × 1 km. Thánh địa nào cũng dựng theo **một quần thể có thật làm nguyên mẫu**, đúng 7 thứ:
- trục bố cục;
- kiểu cổng;
- kiểu mái và màu ngói;
- màu tường;
- vật liệu;
- linh vật trang trí;
- cảnh quan.

Họa sĩ concept và Meshy prompt phải bám bảng «Thông số kiến trúc» của từng vùng. Ba quy tắc chung:

- **Không trộn phong cách giữa các vùng.** Mỗi vùng có một **bảng màu khóa** (5 màu) và một **bộ mái khóa**. Kiểm tra bằng ảnh chụp nhanh ở bước nghiệm thu art.
- **Kiểu mái** (thuật ngữ dùng thống nhất trong tài liệu):
  - *vũ điện* 庑殿 (bốn mái dốc, cấp cao nhất);
  - *yết sơn* 歇山 (mái chồng có đầu hồi tam giác);
  - *ngạnh sơn* 硬山 (hai mái, đầu hồi phẳng xây kín);
  - *huyền sơn* 悬山 (hai mái, đầu hồi vươn ra);
  - *toản tiêm* 攒尖 (chóp nhọn: đình, tháp);
  - *trùng diêm* 重檐 (hai tầng mái);
  - *mái chồng diêm* (kiểu Việt);
  - *đầu đao* (góc mái cong vút).
- **Thang đẳng cấp màu ngói:**
  - vàng lưu ly: hoàng gia, Kim Điện;
  - xanh lục lưu ly: cung quán Đạo giáo do triều đình sắc dựng (Võ Đang);
  - xám đen: Đạo quán dân gian, Giang Nam;
  - đỏ mũi hài: chùa / đình Việt.

Người chơi «đọc» được đẳng cấp một nơi chỉ bằng màu mái.

### 7.0 Bản đồ tổng

```
                        Côn Lôn Thiên Trì (end-game, đảo trời)
                                   │
   Tạng Địa Tuyết Vực ── Võ Đang Huyền Nhạc ── Chung Nam Toàn Chân
          │                        │                     │
   Phong Đô Quỷ Thành ── HUYỀN THÀNH + Sơn Môn (hub) ── Long Hổ Thiên Sư Phủ
          │                        │                     │
   Miêu Cương Cổ Trại ── Yên Tử Trúc Lâm ── Bút Tháp Tịnh Độ ── Mao Sơn Thượng Thanh
                                   │
                        Văn Miếu Quốc Tử Giám (Nho)
```
Đường đi: đường đá từ cổng Nam Huyền Thành (đã có `landmarks.js › roadPath`) toả ra. Mỗi thánh địa có một **trạm xe / đò / hạc** để đi nhanh, mở sau khi tới tận nơi lần đầu.

---

### 7.1 Long Hổ Sơn — Tự Hán Thiên Sư Phủ (Chính Nhất phái, phù lục)

**Nguyên mẫu:** Thiên Sư Phủ ở Thượng Thanh trấn (Giang Tây); cung Thượng Thanh; vách núi đan hà đỏ bên sông Lô Khê.

| Hạng mục | Thông số |
|---|---|
| Bố cục | **Phủ đệ** (dinh thự quan lại), không phải cung điện. Trục Bắc–Nam: phủ môn (biển «嗣漢天師府») → nghi môn ba gian → sân đá → ngọc môn → đại đường (nơi Thiên Sư thụ lục) → tam tỉnh đường → tư đệ của Thiên Sư (hậu viện, vườn). Hai bên là lang vũ và các tĩnh thất. |
| Mái | Ngạnh sơn và huyền sơn lợp **ngói xám đen**. Riêng đại đường làm yết sơn đơn diêm. Không dùng ngói lưu ly. |
| Tường | **Tường trắng vôi, đầu tường hình đầu ngựa (mã đầu tường 馬頭牆)** bậc thang, viền gạch xám đen (phong cách Huy – Cám). |
| Cột · cửa | Gỗ sơn đỏ trầm (không phải son tươi); cửa bức bàn chạm hoa văn vân lôi. |
| Linh vật | Rồng – hổ (Long Hổ); ấn **Dương Bình Trị Đô Công Ấn**; kiếm bảy sao; bát quái trên xà. |
| Cảnh quan | Núi đá đỏ đan hà dựng đứng, **quan tài treo trên vách (huyền quan)**; sông xanh có bè tre; hàng long não cổ thụ. |
| Bảng màu khóa | trắng vôi #EDEBE4 · xám ngói #3B3D40 · đỏ trầm #7A2A1E · lục rêu #4E6B45 · đỏ đá đan hà #B5523B |
| Đạo thống (app) | `schools-data › zhengyi` 正一派 (Thiên Sư Đạo, trụ sở Long Hổ Sơn); thêm `shenxiao` Thần Tiêu (lôi pháp) làm phân viện. |
| NPC dẫn đạo | **Trương Thiên Sư** (hư cấu, không gắn đời Thiên Sư có thật). Truyền **phù lục**, **thụ lục** (cấp bậc đạo chức), **trai tiếu**, **拜斗 bái Đẩu** (`talisman-data › ritual`). |
| Hoạt động | **Kết phù** (mini-game ghép 5 phần phù: đầu, thân, bụng, đảm, chân, đúng cấu trúc `talisman-data › fu {head, body, belly, core, foot}`). Dùng **ký tự hư cấu của game**, không vẽ lại phù thật: app cố ý để phù «không vẽ được». Thụ lục từng cấp; giải án «nhà không yên» bằng phong thủy (`fs-cure › SHA_LIST`) **trước**, phù sau. |

### 7.2 Võ Đang Huyền Nhạc — Cung quán Huyền Vũ (nội đan, Thái Cực)

**Nguyên mẫu:** quần thể cung quán Võ Đang Sơn đời Minh (Hồ Bắc): Kim Điện trên Thiên Trụ phong, Tử Tiêu cung, Nam Nham cung, cổng Huyền Nhạc môn.

| Hạng mục | Thông số |
|---|---|
| Bố cục | **Thần đạo leo núi**: các cung quán nối nhau dọc sống núi, mỗi cung là một bậc tu. Huyền Nhạc môn (bài phường đá 4 cột 3 gian) → Ngộ Chân cung → Tử Tiêu cung (trên ba tầng nền đá, sân rộng) → Nam Nham cung (**treo trên vách đá**, hành lang bám núi, «Long đầu hương» chìa ra vực) → Thái Hòa cung → **Kim Điện** trên đỉnh. |
| Mái | **Ngói lưu ly xanh lục** viền vàng: cung quán Đạo giáo do hoàng đế sắc dựng. Tử Tiêu cung làm trùng diêm yết sơn. **Kim Điện bằng đồng mạ vàng toàn khối** (mái, cột, cửa đều là đồng). |
| Tường | **Tường đỏ son cao** chạy theo địa hình kiểu «tử thành»; mái tường lợp lưu ly xanh. |
| Linh vật | **Huyền Vũ (rùa quấn rắn)**; Chân Vũ đại đế; thất tinh; Thái Cực đồ khắc trên sân đá. |
| Cảnh quan | 72 đỉnh núi đá vôi xám nhọn, biển mây; tùng bách bám vách; bậc đá ngàn bậc. |
| Bảng màu khóa | đỏ son #A3271B · lục lưu ly #2F7A55 · vàng đồng #C9A23A · xám đá #8D8A84 · mây #E9EEF2 |
| Đạo thống (app) | `schools-data › qingwei` 清微派 Thanh Vi (trụ sở Võ Đang) + `danding` Đan Đỉnh (nội đan). Pháp: `cultivation-data` (導引, 吐納/行氣, 存想/內觀) và `remedy-fate › DAO_JIA` (清靜經, 內丹, 守一). |
| NPC dẫn đạo | **Huyền Hư chân nhân** (hư cấu). Truyền **nội đan** 4 bậc 炼精化气 → 炼气化神 → 炼神还虚 → 炼虚合道, **Thái Cực**, **tĩnh tọa**. Mọi pháp mang cảnh báo «không tự luyện ngoài đời» như app (辟穀 có rủi ro y khoa). |
| Hoạt động | Tĩnh tọa theo nhịp thở (mở rộng từ bảng thở ở Trà Thất); luyện Thái Cực (rhythm game theo chiêu); leo thần đạo, mỗi cung là một ải tu tâm. |

### 7.3 Chung Nam Toàn Chân — Trùng Dương Cung / Bạch Vân Quán (tùng lâm thập phương)

**Nguyên mẫu:** Bạch Vân Quán (Bắc Kinh), Trùng Dương Cung (Hộ huyện, Thiểm Tây), núi Chung Nam.

| Hạng mục | Thông số |
|---|---|
| Bố cục | **Tùng lâm** chuẩn phương Bắc, trục giữa nhiều lớp sân: sơn môn (ba cổng vòm) → cầu **Oa Phong** (dưới treo đồng tiền lớn, khách ném xu «đả kim tiền nhãn») → Linh Quan điện → Ngọc Hoàng điện → Lão Luật đường (giới luật) → Khâu Tổ điện → Tam Thanh các (hai tầng, tàng kinh). Hai bên: trai đường (nhà ăn chay), vân thủy đường (cho đạo sĩ du phương), giới đàn. |
| Mái | Ngạnh sơn / yết sơn **ngói xám**; bờ nóc có tiểu thú; Tam Thanh các trùng diêm. |
| Tường | Tường gạch xám, tường bao đỏ. **Phong cách quan thức phương Bắc**: đấu củng rõ, xà vẽ **toàn tỉ hoa văn lam lục** (旋子彩畫). |
| Linh vật | Thất Chân (Bảy vị Chân nhân Toàn Chân); hồ lô; tùng hạc. |
| Cảnh quan | Núi Chung Nam: thung lũng, động tu, lều cỏ ẩn sĩ, tuyết mùa đông. |
| Bảng màu khóa | xám gạch #6E6A66 · đỏ tường #8E2F24 · lam toàn tỉ #2E5C8A · lục #3F7F5A · trắng tuyết #F2F2EE |
| Đạo thống (app) | `schools-data › quanzhen` 全真道; giới luật `daozang` mục 戒律 (20 bản); `lingbao` Linh Bảo (khoa nghi trai tiếu) làm đạo đàn phụ. |
| NPC dẫn đạo | **Khâu đạo trưởng** (hư cấu theo hình mẫu Khâu Xứ Cơ). Toàn Chân xuất gia, giữ giới, **tính mệnh song tu**, ăn chay. |
| Hoạt động | Thử thách **giới luật** (ăn chay, giữ khẩu); **vân thủy** du phương nhận nhiệm vụ khắp bản đồ; tàng kinh các mở dần (`daozang-data`). |

### 7.4 Mao Sơn Thượng Thanh — Cửu Tiêu Vạn Phúc Cung (tồn tư, phù chú, trừ tà)

**Nguyên mẫu:** Mao Sơn (Cú Dung, Giang Tô): Cửu Tiêu Vạn Phúc cung trên đỉnh; Nguyên Phù Vạn Ninh cung với tượng Lão Tử đồng lộ thiên khổng lồ.

| Hạng mục | Thông số |
|---|---|
| Bố cục | Cung trên đỉnh theo **thế núi Giang Nam**: nhiều sân nhỏ lệch tầng, hành lang có mái nối điện, giếng trời. Tượng Lão Tử đồng cao làm điểm nhấn nhìn từ xa. |
| Mái | **Ngói xám đen, đầu đao vút cao, mảnh và nhọn** (phi diêm kiểu Giang Nam, khác đầu đao dày phương Bắc). |
| Tường | Tường trắng, chân tường đá xanh; cửa sổ lưới hoa (lậu song) trên tường trắng. |
| Linh vật | **Tam Mao chân quân**; kiếm gỗ đào; chuông đồng; gương bát quái; lệnh bài. |
| Cảnh quan | Rừng trúc, sương mù, đồi chè, đầm sen. |
| Bảng màu khóa | trắng #F0EEE8 · đen ngói #2A2B2E · lục trúc #6D9B57 · xám đá xanh #5B6670 · vàng đồng #B8923A |
| Đạo thống (app) | `schools-data › maoshan` 茅山派 (Thượng Thanh); `talisman-data › 茅山驅邪符` (cấu trúc), `amta-data › rituals` (Mao Sơn); phân viện `lushan` Lư Sơn (Tam Nãi, 收驚 thu kinh). |
| NPC dẫn đạo | **Mao Sơn đạo nhân** (hư cấu): tồn tư (quán tưởng thần), phù trừ tà, thu phục yêu (hư cấu, trong game). |
| Hoạt động | Hệ **trừ tà – cứu người**: án NPC bị «trúng tà». Giải bằng chẩn đoán (lá số + phong thủy nhà + giờ sinh) **trước**, rồi mới phù; dạy rằng phần lớn «tà» là bệnh và tâm lý (`anti-manipulation-data` nhắc tránh lừa đảo). |

### 7.5 Yên Tử Trúc Lâm — Thiền Việt (Trần Nhân Tông)

**Nguyên mẫu:** Yên Tử (Quảng Ninh): chùa Giải Oan, chùa Hoa Yên, vườn tháp Huệ Quang, Chùa Đồng trên đỉnh, đường tùng cổ thụ.

| Hạng mục | Thông số |
|---|---|
| Bố cục | **Đường hành hương leo núi** qua các chùa: suối Giải Oan → chùa Giải Oan → **vườn tháp Huệ Quang** (mộ tháp đá ong / gạch nhiều tầng) → chùa Hoa Yên (sân rộng, cây đại) → chùa Một Mái (nép vào vách đá) → **Chùa Đồng** trên đỉnh trong biển mây. |
| Mái | **Mái chồng diêm, ngói mũi hài đỏ nâu**, đầu đao cong lá mác, bờ nóc đắp **lưỡng long chầu nguyệt**. Chùa Đồng bằng đồng toàn khối, nhỏ. |
| Kết cấu | Gỗ lim, cột kê chân tảng đá; **vì kèo chồng rường – giá chiêng** chạm hoa lá; nền lát gạch bát. |
| Linh vật | Phật hoàng Trần Nhân Tông; tháp Huệ Quang; cây tùng; rồng thời Trần (thân tròn, uốn lượn). |
| Cảnh quan | Rừng tùng 700 năm, rừng trúc, mây vờn đỉnh, bậc đá rêu. |
| Bảng màu khóa | đỏ ngói #8B3A2B · nâu gỗ lim #5A3826 · lục tùng #2F4F3A · xám đá #9A968C · đồng #A87B3D |
| Đạo thống (app) | App **chưa có** phân loại tông phái Phật giáo. Dùng phần pháp tu đã có: `remedy-fate › GAI_XIN` (觉 → 停 → 转 → 净 → 化), `JING_ZHOU › 金刚` (trí tuệ), `spiritual-fs` (thiền theo hành Dụng). **Cần biên soạn mới:** Thiền Trúc Lâm (Khóa hư lục, Cư trần lạc đạo phú). |
| NPC dẫn đạo | **Thiền sư Trúc Lâm** (hư cấu): tọa thiền, quán tâm, «cư trần lạc đạo». Không nói số mệnh, chỉ chuyển tâm. |
| Hoạt động | **Thiền định** (giữ hơi thở, giảm tạp niệm, mini-game tập trung); công án (câu hỏi mở cho AI dẫn dắt); hành hương leo núi nhận phúc. |

### 7.6 Bút Tháp Tịnh Độ — chùa «nội công ngoại quốc» (A Di Đà, Cửu phẩm liên hoa)

**Nguyên mẫu:** chùa Bút Tháp và chùa Tây Phương (Bắc Ninh, Hà Nội): tam quan, gác chuông, tháp Báo Nghiêm, **Cửu phẩm liên hoa** (tòa tháp gỗ 9 tầng quay được trong chùa Bút Tháp), cầu đá Bút Tháp có lan can chạm.

| Hạng mục | Thông số |
|---|---|
| Bố cục | **Nội công ngoại quốc**: các điện chính xếp hình chữ Công 工 (tiền đường – thiêu hương – thượng điện), bao ngoài là **hành lang (dải vũ) khép kín** thành chữ Quốc 國. Trục: tam quan → gác chuông → tiền đường → thiêu hương → thượng điện → cầu đá → tòa Cửu phẩm → tháp tổ. |
| Mái | Mái chồng diêm hai tầng tám mái, **ngói mũi hài**, đầu đao cong. Mái thấp, xòe rộng, nặng: phong cách chùa Bắc Bộ. |
| Kết cấu | Gỗ lim, **chạm thủng** cực tinh xảo trên cốn, bẩy; tượng La Hán gỗ sơn son thếp vàng nét mặt sống động (kiểu Tây Phương). |
| Linh vật | A Di Đà tam tôn; Quán Âm nghìn mắt nghìn tay; **tháp Cửu phẩm liên hoa quay**. |
| Cảnh quan | Đồng lúa, hồ sen lớn, cây đa, giếng làng; lễ hội chùa có thả đèn. |
| Bảng màu khóa | đỏ ngói #9A4130 · son thếp vàng #B8862B · nâu lim #4F3020 · lục sen #4F7A3E · hồng sen #E8A1B4 |
| Đạo thống (app) | `remedy-fate`: `CHAN_HUI` (5 pháp sám: 八十八佛, 金剛薩埵百字明, 三十五佛, 地藏占察, 法華/大悲懺), `JING_ZHOU` (藥師, 地藏, 普門品, 送子觀音…), `TEN_THIEN` (10 việc thiện), `CONG_QUA`; `liudao › SIX_REALMS`. |
| NPC dẫn đạo | **Ni sư Diệu Âm** (hư cấu): niệm Phật, phóng sinh, bố thí, sám hối, hồi hướng công đức. |
| Hoạt động | **Sổ công đức** (thay đổi trực tiếp «Phúc Đức» của nhân vật); quay **Cửu phẩm liên hoa**: mỗi tầng mở khi đủ công đức; lễ Vu Lan, thả đèn hoa đăng (gian Hồ Sen đã có). |

### 7.7 Tạng Địa Tuyết Vực — Mật tông (Kim Cương thừa)

**Nguyên mẫu:** cung Potala (Lhasa); chùa Jokhang; tu viện Samye (bố cục mạn-đà-la); bảo tháp chorten trắng; cờ gió lungta.

| Hạng mục | Thông số |
|---|---|
| Bố cục | **Tu viện bám sườn núi**: các khối nhà nối tầng theo vách. Riêng điện chính dựng theo **mạn-đà-la Samye**: điện trung tâm (núi Tu Di) + 4 điện châu lục + 8 tiểu châu + tường tròn, bốn góc có 4 bảo tháp 4 màu. |
| Hình khối | **Tường thu hẹp dần lên trên** (hình thang), dày, quét vôi **trắng** (Bạch cung) và **đỏ sẫm** (Hồng cung). **Cửa sổ khung đen hình thang**, rèm vải sọc trên khung cửa. Mái bằng; trên điện chính có **mái kim đỉnh (mạ vàng) kiểu yết sơn** cùng cờ chiến thắng, bánh xe pháp với đôi nai. |
| Linh vật | Pháp luân + hai nai; chày kim cương; mạn-đà-la cát; **hành lang bánh xe kinh**; tượng hộ pháp phẫn nộ. |
| Cảnh quan | Cao nguyên tuyết, hồ ngọc lam, cờ lungta năm màu căng qua đèo, bò yak, mani thạch (đá khắc chú). |
| Bảng màu khóa | trắng vôi #F1EEE6 · đỏ Hồng cung #7B1E1E · vàng kim đỉnh #D8A928 · đen khung #1E1A18 · lam hồ #3FA7C9 |
| Đạo thống (app) | App **không có** nội dung Tạng truyền (`tang-data` là bảng thần sát tang tóc, không liên quan). Dùng phần Mật pháp đã có trong `remedy-fate`: `ZHUNTI` 准提 (Chuẩn Đề), `CHAN_HUI › 金剛薩埵百字明`, `JING_ZHOU › 楞嚴咒`. **Cần biên soạn mới và tham vấn người trong truyền thống** trước khi làm vùng này (§14). |
| NPC dẫn đạo | **Lạt-ma Đa Kiệt** (hư cấu): quán tưởng, trì chú, bố thí Ba-la-mật. |
| Hoạt động | **Vẽ mạn-đà-la cát** rồi tự tay xóa (bài học vô thường: phần thưởng trao khi xóa, không trao khi hoàn thành); quay bánh xe kinh vòng quanh điện (đi bộ chiều kim đồng hồ); đặt mani thạch trên đèo. |

### 7.8 Văn Miếu Quốc Tử Giám — Nho môn (đạo làm người, khoa cử)

**Nguyên mẫu:** Văn Miếu – Quốc Tử Giám (Hà Nội), đối chiếu Khổng Miếu Khúc Phụ.

| Hạng mục | Thông số |
|---|---|
| Bố cục | **Năm lớp sân** nối nhau theo trục: Văn Miếu môn → Đại Trung môn → **Khuê Văn Các** (gác bốn cửa sổ tròn, tượng trưng sao Khuê) → **Thiên Quang Tỉnh** (giếng vuông) với **82 bia Tiến sĩ trên lưng rùa đá** hai bên → Đại Thành môn → Đại bái đường và Đại Thành điện → Quốc Tử Giám (Thái Học). |
| Mái | Mái chồng diêm, **ngói mũi hài / ngói ống**, bờ nóc đắp rồng, góc mái cong vừa phải. Phong cách cung đình Lê – Nguyễn. |
| Tường | Tường gạch Bát Tràng đỏ nâu; cổng trụ biểu đắp hoa văn. |
| Linh vật | Rùa đội bia; hạc đứng trên lưng rùa; Khuê tinh. |
| Cảnh quan | Cây đa, cây muỗm, hồ Văn trước cổng, sĩ tử áo the khăn xếp. |
| Bảng màu khóa | đỏ gạch #8A3B2A · son #9C2A1E · xám bia đá #7F7B72 · lục cổ thụ #3E5C38 · vàng hoàng #C6A044 |
| Đạo thống (app) | `schools-data › jingming` 淨明道 Tịnh Minh (Nho – Đạo, «trung hiếu»); `remedy › LIAOFAN`, `remedy-fate › LIAOFAN_STORY`, `TEN_THIEN`; `spiritual-fs` (nhân, nghĩa, lễ, trí, tín theo hành Dụng); `daozang` 太上感應篇, 文昌帝君陰騭文, 太微仙君功過格. |
| NPC dẫn đạo | **Tế tửu Văn Miếu** (hư cấu): tu thân, «cải mệnh do mình» (theo tinh thần *Liễu Phàm tứ huấn*: lập mệnh, cải quá, tích thiện, khiêm đức). |
| Hoạt động | **Khoa cử** (thi trắc nghiệm kiến thức Tứ Trụ / cổ thư từ `library-data`: hương thí → hội thí → đình thí, đỗ thì khắc tên lên **bia Tiến sĩ** cho cả máy chủ thấy); sổ **công quá cách** kiểu Liễu Phàm. |

### 7.9 Phong Đô Quỷ Thành — Âm ty (Đạo giáo âm phủ, Địa Tạng)

**Nguyên mẫu:** Phong Đô (Trùng Khánh): Quỷ Môn Quan, cầu Nại Hà, đường Hoàng Tuyền, Thiên Tử điện; truyền thuyết **Thập điện Diêm La**.

| Hạng mục | Thông số |
|---|---|
| Bố cục | **Đường một chiều xuống dốc** qua các «quan»: Quỷ Môn Quan → đường Hoàng Tuyền (hoa bỉ ngạn) → **cầu Nại Hà** (ba cầu vòm đá song song: thiện / bình / ác) → Vọng Hương đài → **Thập điện** (mười điện xếp vòng xoáy xuống) → điện Địa Tạng ở đáy (lối ra duy nhất là đi lên). |
| Mái | Yết sơn **ngói đen**, đầu đao nhọn; điện Diêm La trùng diêm. |
| Tường · màu | Tường xám đen, cột **đỏ sẫm gần đen**, đèn lồng đỏ và đèn ma xanh lam. Đá ẩm rêu, nước đen. |
| Linh vật | Đầu Trâu – Mặt Ngựa, Hắc Bạch Vô Thường, Mạnh Bà (canh quên); gương nghiệt kính; sổ Sinh Tử. |
| Cảnh quan | Hang núi bên sông, sương lạnh, hoa bỉ ngạn đỏ. |
| Bảng màu khóa | đen đá #1C1B1F · đỏ sẫm #5A1414 · lam ma #3E7FA8 · đỏ bỉ ngạn #C21F2B · xám sương #6A6A70 |
| Đạo thống (app) | `schools-data › beidi` 北帝派 Bắc Đế (Phong Đô) + `dongyuan` Động Uyên (thần chú trừ ôn); `talisman-data › 北帝天蓬咒, 洞淵神咒` (chú văn, chỉ đọc); `JING_ZHOU › 地藏` (nghiệp nặng, siêu độ); `remedy-fate › YEGUO` (10 ác nghiệp) cho sổ nghiệp. |
| NPC dẫn đạo | **Địa Tạng sứ giả** (người dẫn ra) và **Phán quan** (đọc sổ, tương tác AI). |
| Hoạt động | Nơi kết thúc của **lộ âm tà** (xem §5.5). Người chơi đối diện «sổ nghiệp» của chính mình: mọi ân oán gây ra khi đi lộ âm tà được liệt kê, rồi chọn **sám hối – trả nghiệp** (chuỗi nhiệm vụ cứu người). Vùng không có quái vật để giết; thử thách là đạo đức. |

### 7.10 Miêu Cương Cổ Trại — bàng môn (cổ thuật, cản thi, vu y)

**Nguyên mẫu:** Tương Tây: Phượng Hoàng cổ thành; nhà sàn treo (điếu cước lâu); cầu phong vũ của người Đồng; trại Miêu Tây Giang.

| Hạng mục | Thông số |
|---|---|
| Bố cục | **Trại dốc ven sông**: hàng **nhà sàn treo** chân cột cắm xuống nước, mái chồng lên nhau theo sườn; **cầu phong vũ** (cầu có mái nhiều tầng tháp) làm trung tâm trại; **trống lâu** (tháp trống nhiều tầng mái kiểu người Đồng); lò cổ trong hang. |
| Mái | **Mái ngói âm dương xám** lợp mỏng, nhiều lớp so le; trống lâu có mái toản tiêm nhiều tầng. |
| Vật liệu | **Gỗ sam để mộc** (màu nâu mật), ván thưng, lan can «mỹ nhân kháo»; đá cuội. |
| Linh vật | Đồ bạc Miêu (mũ bạc, vòng cổ); trống đồng; sừng trâu; vải sáp ong (batik lam); chuông dẫn hồn. |
| Cảnh quan | Sông xanh lục giữa núi đá vôi, ruộng bậc thang, sương, bè gỗ, cây phong cổ thụ trước trại. |
| Bảng màu khóa | nâu gỗ sam #6B4A2E · xám ngói #4A4A4C · lam sáp #2B4E7A · bạc #D7DADF · lục sông #3D8A78 |
| Đạo thống (app) | App **không có** cổ thuật Miêu. «Âm tà» trong app là **trừ tà, hộ thân, thu hồn** (`amta-data`: 11 dấu hiệu, 5 loại vong, 7 pháp hóa giải, có quy tắc `ETHICS` và cổng tự nguyện bật); yểm thuật duy nhất được nhắc là **厭勝 (Lỗ Ban kinh, `bitruyen-data`) ghi «cấm thực hành»**. Vùng này là **nội dung hư cấu mới** của game; y dược dùng `tcm` (tạng phủ theo ngũ hành). |
| NPC dẫn đạo | **Vu y bà A Mậu** (hư cấu): lộ **bàng môn**. Y dược dân gian, chuyện cổ thuật (truyền thuyết, không hướng dẫn), **cản thi** dẫn hồn về quê (truyền thuyết). |
| Hoạt động | Cửa vào **lộ âm tà** (§5.5): sức mạnh nhanh, giá đắt. Hoặc chọn **vu y chính đạo**: chữa bệnh bằng thảo dược theo ngũ hành (`tcm`). |

### 7.11 Côn Lôn Thiên Trì — đảo trời (end-game, quy nhất)

**Nguyên mẫu:** truyền thuyết Côn Lôn – Dao Trì Tây Vương Mẫu. Hình hiện có: `sky_palace` trong `landmarks.js`.

| Hạng mục | Thông số |
|---|---|
| Bố cục | Quần đảo lơ lửng nối bằng cầu mây; điện trung tâm **Dao Trì**, một hồ ngọc ở đỉnh; **Thiên Mệnh Bàn** (la bàn khổng lồ, chính là Thiên Bàn trên Sơn Môn hiện nay) đặt giữa hồ. |
| Mái | **Lưu ly vàng và trắng ngọc**, trùng diêm toản tiêm; là nơi duy nhất trong game được dùng vàng lưu ly cho cả quần thể. |
| Cảnh quan | Thác đổ xuống biển mây; hạc, cây đào tiên. |
| Bảng màu khóa | trắng ngọc #F4F1EA · vàng lưu ly #E3B341 · lam trời #7FB7E6 · hồng đào #F2A9BC · bạc mây #DDE3EA |
| Vai trò | Hồi cuối cốt truyện (§3). Mở khi người chơi đạt **«Quy nhất»**: đi xong ít nhất 3 lộ cải mệnh, kể cả lộ đã quay về từ âm tà. |

### 7.12 Huyền Thành + Huyền Quán Sơn Môn — trung tâm (đã có)

Giữ nguyên bố cục hiện tại (`court.js`, `sect.js`). Bổ sung:
- **Bảng Thiên Bảng** trước Chính Đường: xếp hạng tiềm lực ban đầu và tiềm lực đã cải.
- **Đình Truyền Đạo**: 8 cổng dẫn đường, có sứ giả mỗi đạo thống đứng mời.
- **Nhà trọ du phương** để ghép đội.

---

## 8. Quy chuẩn công trình: «không có công trình làm màu»

> **Luật số 1 của level design:** mọi công trình người chơi nhìn thấy trong tầm đi bộ đều **đi vào được**, **có nội thất đúng công năng** và **có ít nhất một tương tác** (NPC, trạm, vật dụng, nhiệm vụ). Không có mặt dựng giả, không có cửa vẽ.

Ngoại lệ duy nhất là **cảnh nền xa** (núi, thành trì ở chân trời, đảo trời khi chưa mở). Chúng nằm **ngoài tầm đi bộ** và không có đường dẫn tới. Đã có đường tới thì phải vào được.

### 8.1 Phân hạng công trình

| Hạng | Ví dụ | Nội thất tối thiểu | Tương tác tối thiểu |
|---|---|---|---|
| **A · Điện chính** | Chính Đường, Kim Điện Võ Đang, Đại Thành điện, Hồng cung | Toàn bộ không gian trong, tượng / bàn thờ đúng tín ngưỡng, 2 tầng nếu ngoại thất 2 tầng mái | NPC dẫn đạo + chuỗi nhiệm vụ + ≥ 3 trạm |
| **B · Điện phụ / lầu** | Lầu chuông, lầu trống, tàng kinh các, trai đường | Không gian trong đúng công năng (chuông thật, kệ kinh, bàn ăn) | ≥ 1 trạm (đánh chuông giờ, tra kinh, ăn chay nhận buff) |
| **C · Nhà dân / phố** | Nhà vườn Huyền Thành, nhà sàn Miêu, quán trà | Phòng khách + 1 phòng phụ, đồ đạc theo nghề chủ nhà | NPC cư dân có lá số riêng (án phong thủy / án mệnh tại nhà họ) |
| **D · Kiến trúc nhỏ** | Đình, bài phường, tháp mộ, cầu có mái | Đi qua / đi quanh / đứng dưới được, không bị chặn vô lý | Bia đọc được, chỗ ngồi, điểm ngắm cảnh, chuông gió |
| **E · Hạ tầng** | Tường, cổng, cầu, bậc | Va chạm chuẩn theo hình khối (`collide.js`) | Cổng mở / đóng theo giờ, cầu đi trên mặt cầu |

### 8.2 Cách làm kỹ thuật

1. **Ngoại thất ↔ nội thất cùng một hình khối.**
   - Không dùng «dịch chuyển sang phòng khác» cho hạng A–C ở phiên bản AAA.
   - Nội thất dựng **bên trong vỏ** ngoại thất, cùng tọa độ. Đi qua cửa là vào thẳng, không màn chờ.
   - Hệ «phòng ngoài bản đồ» hiện tại (`world.js › ROOMS`, `interior.js`) chỉ dùng tạm cho bản web hiện tại và cho cảnh đặc biệt (Âm ty, mạn-đà-la).
2. **Model chia lớp.** Mỗi công trình Meshy / thủ công phải xuất 3 lớp:
   - `shell`: tường, mái, nền, có độ dày thật, lỗ cửa và cửa sổ mở thật;
   - `interior`: cột, sàn, trần, đồ đạc;
   - `props`: vật tương tác, tách riêng để gắn script.
   Model Meshy hiện tại là khối liền, không có lòng trong. Pipeline mới:
   - Meshy chỉ dựng **ngoại thất**;
   - **nội thất dựng bằng bộ mô-đun** (§8.3) khớp với lòng nhà đo từ footprint (`collide.js` đã có lưới 0,5 m: lấy vùng rỗng bên trong làm sàn);
   - lỗ cửa khoét bằng boolean trên vỏ, hoặc chọn mẫu Meshy có cửa mở sẵn và kiểm bằng ảnh chụp lát cắt.
3. **Ẩn hiện khi vào trong.**
   - Đi qua ngưỡng cửa (trigger), mái và tầng trên mờ dần, giống cơ chế `fadeGroups` cho camera hiện có.
   - Camera tự hạ góc thấp và rút ngắn khoảng cách. Đèn trong nhà bật (`lights.js`, nhóm đèn điểm theo phòng).
4. **Che khuất và luồng tải.**
   - Mỗi công trình là một **ô cổng (portal cell)**: nội thất chỉ vẽ khi camera ở trong hoặc nhìn qua cửa.
   - Nội thất tải theo khoảng cách (≤ 60 m) như `SPOTS` của `landmarks.js`.
5. **Va chạm.**
   - Ngoại thất: lưới va chạm theo hình khối (`collide.js`, đã có), nhưng **khoét lối cửa** bằng `keep`.
   - Nội thất: va chạm từ đồ đạc (bàn, tượng, cột).
   - Cầu thang lên tầng: các nền bậc (`addPlatform`), như bậc thang Sơn Môn đã làm.
6. **Cửa là vật thật.**
   - Cánh cửa xoay khi người chơi tới gần.
   - Cửa điện chính đóng sau giờ Tuất và mở giờ Mão. Ban đêm vẫn vào được bằng cửa ngách, nhưng NPC không tiếp, trừ nhiệm vụ đêm.

### 8.3 Bộ mô-đun nội thất theo phong cách

Mỗi đạo thống có một bộ mô-đun riêng, cùng thang đo lưới **3,2 m × 3,2 m** (một gian):

| Bộ | Thành phần |
|---|---|
| **Đạo quán phương Bắc** (Toàn Chân, Võ Đang) | cột sơn đỏ + chân tảng · đấu củng · xà vẽ toàn tỉ · thần khám có màn · bồ đoàn · hương án · kệ kinh · chuông khánh |
| **Đạo quán Giang Nam** (Mao Sơn, Long Hổ) | cột gỗ trầm · cửa bức bàn chạm · giếng trời · bàn phù (bút lông, chu sa, giấy vàng) · tủ lệnh bài |
| **Chùa Việt** (Yên Tử, Bút Tháp) | vì kèo giá chiêng · cốn chạm thủng · hệ tượng tam thế / A Di Đà · khám La Hán · mõ, chuông gia trì · bàn thờ Mẫu (khu phụ) |
| **Tạng truyền** | cột vuông bọc vải · trần treo phướn lụa · tranh thangka · hàng đèn bơ · bàn mạn-đà-la · ghế lạt-ma cao |
| **Nho môn** | giảng đường bàn án thư thấp · kệ sách tre · bảng vàng · nhà bia |
| **Miêu Cương** | sàn gỗ treo · bếp lửa giữa nhà (hỏa đường) · treo thịt hun · kệ bình cổ · khung dệt sáp ong |
| **Âm ty** | án phán quan · gương nghiệt kính · sổ Sinh Tử · cột xích · đèn ma |

### 8.4 Danh sách nội thất cho công trình đang có trong game (làm lại trước)

| Công trình hiện có | Vị trí | Việc phải làm |
|---|---|---|
| Chính Đường (`palace_grand`) | Sơn Môn, tầng 2 | Khoét cửa giữa. Nội thất 2 tầng: tầng 1 **Tổ Sư đường** (bài vị tổ, sổ môn phái); tầng 2 **tàng kinh** (thư viện cổ thư `library-data`). Bàn Thầy Tử Bình chuyển vào trong điện, giữ bệ ngoài làm nơi tiếp khách ban ngày. |
| Điện phụ Đông / Tây (`hall_main`) | ±47, −36 | **Thật hóa** Vận Mệnh Các và Thái Tuế Điện: nội thất dựng ngay trong vỏ điện (thay cho phòng ngoài bản đồ). |
| Lầu chuông / lầu trống (`lib_pavilion2`) | ±47, −9 | Tầng 2 có chuông / trống thật. Đánh **chuông sớm (giờ Mão) / trống chiều (giờ Dậu)** được Phúc Khí. Đồng bộ MMO: cả máy chủ nghe tiếng. |
| 4 bảo tháp góc | ±53, ±58 | Đi vào tầng trệt (xá lợi / bia tháp), cầu thang lên tầng ngắm cảnh, tầng đỉnh có **chuông gió theo hành** của người chơi. |
| Sơn Môn, Hậu Môn (`gate_sect`) | z ±66 | Phòng gác hai bên cổng: **người gác cổng** đọc lá số khách lạ (nhập môn cho người mới). |
| 30 nhà vườn Huyền Thành (`lib_courtyard`) | phố | Mỗi nhà là **một gia đình NPC có lá số** (sinh bằng `npc.js › makeNpc`). Có án phong thủy tại chính nhà họ (dùng `zhai` / `xuankong` với hướng nhà thật của model). |
| Sảnh nghề 7 vùng | các vùng | Đình gỗ hiện có làm sảnh tiếp. Mỗi sảnh thêm **một công trình chính đi vào được** theo phong cách vùng (§7). |
| Hậu Sơn (`cliff_palace`) | z −116 | Chính Điện Tam Thanh **nằm thật trong** cliff_palace: phá phòng ngoài bản đồ, dựng nội thất tại chỗ. |

### 8.5 Tiêu chí nghiệm thu một công trình (Definition of Done)

1. Đi bộ từ đường chính tới cửa, vào trong, ra lại **không cần dịch chuyển**, không kẹt, không xuyên tường (kiểm bằng script A* + va chạm như `test-game-state › Sơn Môn`).
2. Nội thất khớp **phong cách vùng** (bảng màu khóa, bộ mô-đun §8.3) và **công năng** ghi trong §7.
3. Có ≥ 1 tương tác (hạng A: ≥ 3), mỗi tương tác nối với **một engine của app** hoặc một nhiệm vụ.
4. Ánh sáng ngày / đêm trong nhà đúng (đèn bật theo giờ, có nguồn sáng thật: nến, đèn bơ, đèn lồng).
5. Hiệu năng: vào trong không tụt dưới 30 khung/giây trên máy tầm trung. Nội thất ẩn khi ở ngoài xa (portal cell).
6. Có ảnh chụp chuẩn 4 góc + 1 ảnh trong nhà, lưu vào `docs/art/<vùng>/`.

---

## 9. Tu luyện, cảnh giới và vòng chơi

### 9.1 Thang cảnh giới (mới — app chưa có thang chính thức)

Dựng trên **nội đan 4 bậc** của app (`DAO_JIA`: 炼精化气 → 炼气化神 → 炼神还虚 → 炼虚合道) và 3 tầng `GAI_LEVELS`. Mỗi đạo thống có **tên gọi riêng** cho cùng một bậc, để người tu Phật không bị gọi bằng từ Đạo:

| Bậc | Đạo (chung) | Phật | Nho | Đạo Hạnh cần | Mở |
|---|---|---|---|---|---|
| 1 | Phàm Nhân | Tín Tâm | Học Trò | 0 | Sơn Môn, Huyền Thành |
| 2 | Nhập Môn | Quy Y | Sĩ | 100 | 3 thánh địa gần |
| 3 | Luyện Tinh Hóa Khí | Trì Giới | Quân Tử | 400 | ngự kiếm (đã có ở cấp 8 → gộp vào bậc này) |
| 4 | Luyện Khí Hóa Thần | Định | Hiền Nhân | 1000 | **Tiên Thiên thôi tính** (§4.7); thánh địa xa |
| 5 | Luyện Thần Hoàn Hư | Tuệ | Đại Nho | 2200 | Phong Đô (lộ cứu người), Tạng Địa |
| 6 | Luyện Hư Hợp Đạo | Giải Thoát | Thánh Hiền | 4500 | Côn Lôn (cần «Quy nhất») |

`progress.js` hiện có cấp theo Phúc Khí (`levelOf`, gia trì cấp 2–10). Phiên bản AAA giữ **Cấp** làm thang hoạt động hằng ngày, thêm **Cảnh giới** làm thang tu. Ánh xạ: cấp gia trì mở theo **cảnh giới** thay vì cấp.

### 9.2 Vòng chơi

| Vòng | Thời lượng | Nội dung |
|---|---|---|
| **Một phiên** | 15–30 phút | vào quán → điểm danh → 1 án khách → 1 việc ở thánh địa đang theo → trà / thiền → ra |
| **Một ngày** | — | 3 việc trong ngày (đã có) + sảnh nghề 1 khách/ngày (đã có) + đèn Thái Tuế + một bậc tu (thiền / học / kết phù) |
| **Một tuần** | — | 1 chương Mệnh Đồ; lễ cuối tuần ở thánh địa (giờ cố định theo can chi ngày) |
| **Một tháng âm** | — | Mùng 1 / Rằm: sự kiện chung (dâng hương, phóng sinh tập thể); Thiên Bảng chốt |
| **Một năm can chi** | — | **Mùa**: niên chủ Thái Tuế mới, Đạo Lộ mùa mới (§11), sự kiện Thiên Mệnh Bàn |

### 9.3 Danh mục hoạt động (mỗi hoạt động gắn một engine)

| Hoạt động | Cơ chế | Engine |
|---|---|---|
| Giải án khách (đã có) | 6 bước luận, chấm điểm | `cases.js`, `chart`, `kb` |
| Sảnh nghề 8 sảnh (đã có) | trạch nhật, dương trạch, điều hậu, thư lâu, hợp hôn, tử vi, tượng pháp, cách cục | `zheri`, `zhai`, `han-nuan`, `hehun`, `ziwei`, `mangpai`, `pattern` |
| Tĩnh tọa | nhịp thở (giữ – thả theo vòng), tạp niệm bay qua phải để yên | (cơ chế mới) + `cultivation-data` để giảng |
| Kết phù | ghép 5 phần phù đúng thứ tự, đúng hành của việc cần trấn | `talisman-data › fu` (cấu trúc), ký tự hư cấu |
| Khoa cử | hương thí → hội thí → đình thí; câu hỏi từ cổ thư và lá số khách | `library-data`, `DITIANSUI_MAXIMS`, `cases.js` |
| Đặt tên / đạo hiệu | chọn chữ cho tổng nét và ngũ cách hợp Dụng | `naming.js › analyzeName` |
| Sửa nhà (nhà riêng ở Huyền Thành) | đặt giường, bàn, cửa theo bát trạch / huyền không; hóa sát | `zhai`, `xuankong`, `fs-cure › SHA_LIST` |
| Chọn ngày lễ | chọn ngày cho lễ nhập đạo, lễ khánh thành đạo tràng | `zheri`, `huangdao` |
| Thiền công án | câu hỏi mở; AI Thiền sư dẫn, không có đáp án đúng; chấm bằng sự kiên trì (số lần quay lại) | AI persona |
| Mạn-đà-la cát | đặt cát theo mẫu đối xứng, rồi xóa | (mới) |
| Vạch mặt Định Mệnh Hội | đối chiếu lời phán của thầy bói với lá số thật | `chart`, `taisui`, `anti-manipulation-data` |
| Cứu người trúng yểm | chẩn đoán đời thực → phong thủy → trừ tà chính tông | `tcm`, `fs-cure`, `amta-data` (opt-in) |
| Y dược | hái thảo theo mùa / hành, sắc thuốc cho NPC theo tạng phủ | `tcm` |

---

## 10. Xã hội, môn phái và lễ hội

- **Môn phái = đạo thống.**
  - Người chơi vào môn phái ở thánh địa đạo thống chính. Môn phái có **đạo tràng chung** (xây và nâng cấp công trình theo §8, mọi công trình vẫn phải đi vào được).
  - Môn phái có **sổ công đức chung** và lễ riêng.
  - Đã có định hướng trong `GAME-MMO-PROMPT-PLAN.md` (môn phái gắn trường phái).
- **Sư đồ.** Người chơi cảnh giới ≥ 4 nhận đệ tử. Đệ tử hoàn thành Mệnh Đồ thì sư phụ nhận công đức.
- **Đồng tu.** Ngồi thiền cùng nhau (đã có bồ đoàn MMO ở Trà Thất) giúp tĩnh tọa ổn định hơn, tiến nhanh hơn.
- **Hợp hôn / kết nghĩa.** Bàn Hợp Hôn (đã có) mở rộng: hai người chơi so lá số thật, kết nghĩa kim lan (`hehun`, `nayin-relation`).
- **Lễ tiết theo lịch âm thật:**

| Ngày | Lễ | Sự kiện |
|---|---|---|
| Lập Xuân / Tết | đổi niên chủ Thái Tuế | an Thái Tuế toàn máy chủ; tượng niên chủ mới ở Thái Tuế Điện |
| Rằm tháng Giêng (Thượng Nguyên) | Thiên quan tứ phúc | dâng đèn, cầu phúc chung |
| 15/7 (Trung Nguyên, Vu Lan) | Địa quan xá tội | Phong Đô mở lối cứu người; thả đèn hoa đăng (Hồ Sen đã có) |
| 15/10 (Hạ Nguyên) | Thủy quan giải ách | lễ ở Cùng Thông Hồ |
| 9/9 (Trùng Cửu) | Đẩu Mẫu | bái Đẩu ở Đẩu Mẫu Điện (đã có) |
| Ngày Phật đản | tắm Phật | Bút Tháp, Yên Tử |
| Ngày giỗ Khổng Tử / Tết thầy | khoa cử đặc biệt | Văn Miếu |

---

## 11. Kinh tế và kiếm tiền có đạo đức

**Nguyên tắc vàng:** **không bao giờ bán cải mệnh.** Đạo Hạnh, cảnh giới, công đức, Mệnh Đồ **không mua được**. Đây là trụ cột T6 và RB5 của app.

| Bán được | Không bán |
|---|---|
| Trang phục, phụ kiện, hiệu ứng, ngự vật, khung tên (Tàng Y Các, đã có) | Đạo Hạnh, cảnh giới, công đức |
| Tiện ích: thêm ô lưu lá số khách, thêm lượt AI / ngày, trang trí nhà riêng | Kết quả luận giải «tốt hơn» |
| **Đạo Lộ mùa** (battle pass thẩm mỹ): bộ phục mùa theo niên chủ Thái Tuế | Bùa / phù «đổi vận» có tác dụng |
| VIP Chân Nhân (đã có): Ngọc mỗi ngày, mở bay sớm, đồ độc quyền | Ưu tiên trên Thiên Bảng Đạo Hạnh |

Điều chỉnh với hệ đã làm: thưởng bộ «Hợp mệnh» +10% Phúc Khí (`cosmetics.js`) **chỉ tính vào Phúc Khí** (tiền tiêu trong game), **không** vào Đạo Hạnh. Giữ như hiện tại, ghi rõ trong mô tả món.

**Hai tiền tệ** (đã có): Phúc Khí (cày được), Ngọc (điểm danh, VIP, lên cấp, nạp). **Thanh toán thật** (VNPay / Stripe cho web, Apple IAP cho iOS) cần chủ dự án đăng ký merchant.

---

## 12. Trình bày: âm thanh, giao diện, camera

- **Nhạc theo vùng:**

  | Vùng | Nhạc |
  |---|---|
  | Long Hổ | trống, tù và, đàn nhị |
  | Võ Đang | tiêu, cổ cầm |
  | Yên Tử | mõ, chuông, sáo trúc |
  | Bút Tháp | tụng niệm xa, đàn bầu |
  | Tạng | kèn dài, chuông bát, tụng trầm |
  | Văn Miếu | nhã nhạc cung đình |
  | Phong Đô | gió, giọt nước, tụng siêu độ |
  | Miêu | khèn, trống đồng |

  Nhạc đổi theo giờ can chi (giờ Tý yên tĩnh nhất).
- **Mệnh Bàn (màn chỉ số):**
  - la bàn tròn, bốn trụ ở tâm;
  - vòng 1 là ngũ hành (5 cánh hoa theo `wx.pct`);
  - vòng 2 là Ngũ Duy;
  - vòng 3 là thần sát / đặc tính;
  - ngoài cùng là thang Phẩm căn.
  Bấm vào chỗ nào cũng có «Vì sao?» (§4.1).
- **Sổ Mệnh** (đã có) chia thẻ: Mệnh Bàn · Mệnh Đồ · Sổ Công Quá · Cảnh giới · Tủ đồ.
- **Camera trong nhà:** tự hạ góc, mái mờ (§8.2). Ngoài trời giữ hệ hiện có (ngước nhìn trời, xoay, phóng to).
- **Trợ năng:** chữ Hán luôn kèm phiên âm Hán Việt và nghĩa; chế độ giảm chuyển động (`reduced`, đã có); cỡ chữ.

---

## 13. Kỹ thuật và sản xuất

### 13.1 Kiến trúc hiện có giữ lại

Three.js, địa hình chunk, LOD, va chạm theo hình khối (`collide.js`), A* (`world.js`), Durable Object MMO (`TownShard`), engine app dùng trực tiếp ở client.

### 13.2 Việc kỹ thuật mới

| Hạng mục | Mô tả | Ưu tiên |
|---|---|---|
| `ai.js` persona + gameContext + toolsAllow | §6.1 | P0 |
| Mệnh Bàn (stats) | module `menhban.js`: gom `synthesis`, `wx`, `strength`, `fiveDimRadar`, `classifyChartLevel`, `analyzeVitality`, `shensha`, `liudao` → một đối tượng chỉ số; test bằng các lá số mẫu | P0 |
| Máy nhiệm vụ | đồ thị nhiệm vụ khai báo dữ liệu; điều kiện từ Mệnh Bàn / Mệnh Đồ / cờ cốt truyện | P0 |
| Sổ Công Quá | ghi việc (`CONG_QUA`), `meritLedger`, đồng bộ máy chủ cho Thiên Bảng | P0 |
| Công trình đi vào được | pipeline shell / interior / props, portal cell, bộ mô-đun nội thất (§8) | P0 |
| Thánh địa | 10 vùng mới (§7); mỗi vùng ≈ 25–40 công trình (A: 1–2, B: 4–6, C: 10–20, D / E còn lại) | P1 |
| Cảnh giới | §9.1, gộp với `progress.js` | P1 |
| Môn phái, sư đồ | máy chủ: Durable Object mới `SectHall` | P2 |

### 13.3 Ước lượng tài sản 3D (Meshy + thủ công)

| Vùng | Meshy ngoại thất (HD) | Mô-đun nội thất | Đạo cụ | Credit Meshy ước tính |
|---|---|---|---|---|
| Mỗi thánh địa | 6–10 | 1 bộ (§8.3) ~40 mảnh thủ công / Meshy nhẹ | 30–60 | 6–10 × 20 + 40 × 5 ≈ 320–400 |
| Tổng 10 vùng | 60–100 | 7 bộ | 300–600 | ≈ 3500–4000 credit |

Hiện tài khoản còn **7 credit**: cần mua gói trước giai đoạn M2.

### 13.4 Lộ trình

| Mốc | Nội dung | Kiểm |
|---|---|---|
| **M0** (2 tuần) | Mệnh Bàn + màn Mệnh Bàn + persona AI + Vân Cốc, Khổng tiên sinh + Mở đầu mới | test lá số mẫu (5 bậc điểm, 4 loại cách), chơi thử mở đầu |
| **M1** (4 tuần) | Sổ Công Quá, Mệnh Đồ, máy nhiệm vụ, Hồi I; **thật hóa nội thất** các công trình Sơn Môn (§8.4) | Definition of Done §8.5 cho từng công trình |
| **M2** (6 tuần) | 3 thánh địa đầu: Long Hổ, Võ Đang, Bút Tháp (đủ 3 đạo lớn) + Hồi II | đi bộ hết vùng không kẹt; 3 chuỗi đạo thống chơi xong |
| **M3** (6 tuần) | Yên Tử, Văn Miếu, Mao Sơn, Chung Nam + cảnh giới + Định Mệnh Hội | — |
| **M4** (6 tuần) | Hồi III, IV: Tà Lộ, Phong Đô, Miêu Cương | duyệt nội dung nhạy cảm (§14) |
| **M5** (4 tuần) | Tạng Địa (sau tham vấn), Côn Lôn, Vĩ thanh, sự kiện máy chủ | — |
| **M6** | Môn phái, sư đồ, mùa đầu tiên | tải 60 người / phòng (đã có test) |

### 13.5 Chỉ số thành công

- Tỷ lệ người chơi **lá số thấp** (< 36 điểm) ở lại sau 7 ngày **không thấp hơn** nhóm điểm cao. Đây là bằng chứng trụ cột T2 hoạt động.
- ≥ 60% người chơi mở Mệnh Đồ và làm xong ≥ 1 tầng trong tuần đầu.
- Điểm `checkNeo` trung bình của thoại AI ≥ 90 (AI không bịa dữ kiện).

---

## 14. Rủi ro, tuân thủ và tôn trọng tín ngưỡng

| Rủi ro | Cách xử lý |
|---|---|
| **Xúc phạm tín ngưỡng** (Phật, Đạo, Tạng, tín ngưỡng dân gian Việt) | Mỗi thánh địa có **cố vấn nội dung** từ truyền thống đó trước M2–M5. Không dùng tượng thánh làm vật phẩm bán. Không cho người chơi phá hoại nơi thờ. Tạng Địa **chỉ làm sau khi có tham vấn** |
| **Âm tà / yểm thuật** | Theo `amta-data › ETHICS`: opt-in, không khẳng định tuyệt đối, chuyển hướng sức khỏe tâm thần; không mô tả nghi thức thật (§5.5) |
| **Người chơi lá số thấp cảm thấy bị phán xét** | Câu dẫn bắt buộc (§4.7), hệ số Nghịch Thiên, Thiên Bảng xếp theo Đạo Hạnh; theo dõi chỉ số §13.5 |
| **Cờ bạc hóa / bán số** | Không gacha; không bán cải mệnh (§11) |
| **Y tế** | Không chẩn bệnh, không «khí công chữa bệnh», cảnh báo 辟穀 (theo `cultivation-data`) |
| **Apple 4.3(b)** | Nhánh iOS tắt: bói (xăm, quẻ), Vận Mệnh Các, Thái Tuế Điện, Thầy AI (đã làm bằng `features.js`). Cải mệnh trên iOS chỉ giữ phần **tu tâm, học, việc thiện**, không đoán vận |
| **Dữ liệu cá nhân** | Ngày sinh chỉ lưu trên máy (đã làm). MMO chỉ gửi màu áo, trang bị, Đạo Hạnh tổng; **không** gửi ngày sinh hay điểm Tiên Thiên nếu người chơi không bật «công khai căn cốt» |
| **AI sai lệch** | `checkNeo` + kiểm tên nhiệm vụ (§6.4 quy tắc 4) + fallback cục bộ |

---

## Phụ lục A — Bảng ánh xạ engine → game

| Engine / trường | Dùng ở |
|---|---|
| `analyze().synthesis` (score, gradeVi, percentile, fortune, factors, combos) | Tiềm Lực, Phẩm căn, Phúc phận, «Vì sao?» (§4.1–4.2) |
| `analyze().wx.pct` | Ngũ Hành Lực (§4.3) |
| `analyze().strength` (effRatio, level) | Thân Lực |
| `analyze().yong` (primary, xi, ji, chou) | Thiên Mệnh Hành, Hợp mệnh, thử thách Kỵ |
| `five-dim-radar › fiveDimRadar` | Ngũ Duy (§4.4) |
| `analyze().pattern`, `patternQuality` | Mệnh Cách, nhánh cốt truyện (§4.5), «vị thuốc» |
| `chart-level › classifyChartLevel` | Mệnh Cấp (danh hiệu) |
| `vitality › analyzeVitality` | Nguyên Khí |
| `analyze().shensha`, `noble-stars` | Đặc Tính (§4.6) |
| `liudao › computeLiuDao` | Túc Nghiệp, tâm ma, NPC Diệu Âm |
| `personality-profile`, `nayin-personality` | Tính Khí, giọng thoại |
| `analyze().dayun`, `liunian`, `vanmenh.js` | Thời Vận, Vận Mệnh Các, Hồi III |
| `gaimenh › gaimenhPlan` | Mệnh Đồ (§5.1) |
| `remedy-fate` (GAI_LEVELS, CONG_QUA, meritLedger, YEGUO, CHAN_HUI, JING_ZHOU, ZHUNTI, GAI_XIN, DAO_JIA, LIAOFAN_STORY, TEN_THIEN) | §5 toàn bộ |
| `remedy › buildRemedy` (twelveLaws, timing) | Cải Vận ngắn hạn |
| `taisui`, `taisui-general`, `thaitue.js` | Thái Tuế Điện, Tết, Hồi I |
| `schools-data` (12 phái) | §5.6, §7 |
| `cultivation-data`, `talisman-data`, `amta-data`, `amta-analyze` | tu luyện, kết phù, trừ tà, Tà Lộ (đối trọng) |
| `daozang-data` (1527 bản), `library-data`, `bitruyen-data` | Tàng kinh các, khoa cử, phản diện Lỗ Ban |
| `naming`, `zhai`, `xuankong`, `fs-cure`, `zheri`, `tcm` | hoạt động §9.3 |
| `anti-manipulation-data`, `checkNeo`, `suggestFollowups` | an toàn AI, Định Mệnh Hội (§6.4, §3) |

## Phụ lục B — Lỗi engine phát hiện khi rà soát (cần sửa trước M0)

1. `remedy-fate.js › getRemedyForChart` so sánh `'劫财'` (giản thể) trong khi engine ghi `'劫財'` (phồn thể). Nhánh «Kiếp Tài» không bao giờ khớp. Ngoài ra hàm chỉ xét thập thần **can**, bỏ qua tàng can.
2. `daozang-data.js › suggestDaozangChartAware` đọc `R?.yong?.god`, nhưng engine dùng `R.yong.primary`. Gợi ý tu theo hành Dụng thần có thể không bao giờ chạy (cần kiểm thêm).

## Phụ lục C — Thuật ngữ

| Thuật ngữ | Nghĩa |
|---|---|
| **Tiên Thiên** | Điểm lá số khi sinh (`synthesis.score`), không đổi |
| **Hậu Thiên / Đạo Hạnh** | Điểm tu tích lũy trong game |
| **Mệnh Đồ** | Kế hoạch cải mệnh 6 tầng riêng của người chơi (`gaimenhPlan`) |
| **Sổ Công Quá** | Sổ việc thiện / ác có điểm (`CONG_QUA`) |
| **Quy nhất** | Đã tu ≥ 3 đạo thống, Sổ Công Quá dương; điều kiện vào Côn Lôn |
| **Hồi Đầu** | Danh hiệu cho người đi Tà Lộ rồi sám hối trả nghiệp |
| **Nợ Âm** | Con số hệ quả của Tà Lộ, công khai, trả bằng việc thiện |
