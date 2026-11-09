# 01 · Phần 2 — Trụ cột T4, T5, T6 và luật phân xử xung đột

> Tiếp phần 1. Cùng cấu trúc: định nghĩa, câu hỏi kiểm (`KT-*`), ví dụ làm / không làm (`VD-*`), ca biên (`CB-*`), checklist. Cuối phần là **luật phân xử** khi hai trụ cột kéo về hai phía, kèm 16 án lệ.

---

## 5. T4 · Thế giới thật

### 5.1 Định nghĩa đầy đủ

Huyền Giới phải **đứng được như một nơi chốn**, không như một sân khấu. Trụ cột có bốn mặt:

1. **Không gian thật.** Mọi công trình trong tầm đi bộ **đi vào được**, có **nội thất đúng công năng**, có **ít nhất một tương tác** (bản sơ đồ §8, luật số 1 của level design). Ngoại lệ duy nhất: cảnh nền ngoài tầm đi bộ, không có đường dẫn tới.
2. **Thời gian thật.** Năm, tháng, ngày, giờ trong game là **can chi thật** (`lunar-javascript`). Ngày đêm theo giờ máy người chơi. Lễ tiết theo lịch âm thật. Đại vận và lưu niên của nhân vật trôi theo đời thật.
3. **Văn hóa thật.** Mỗi thánh địa dựng theo **một quần thể có thật làm nguyên mẫu** (canon §3), đúng 7 thứ: trục bố cục, kiểu cổng, kiểu mái và màu ngói, màu tường, vật liệu, linh vật, cảnh quan. Không trộn phong cách giữa các vùng.
4. **Đời sống thật.** NPC có lá số, có nhà, có giờ ăn ngủ, có việc. Công trình có lý do tồn tại (chuông đánh giờ Mão, cửa điện đóng sau giờ Tuất). Tiền và vật phẩm đi theo dòng chảy có lý (dược liệu từ Miêu Cương lên chợ Huyền Thành).

### 5.2 Phạm vi «tầm đi bộ»

| Vùng | Định nghĩa | Phải làm gì |
|---|---|---|
| **Vùng chạm** | ≤ 60 m quanh đường đi, hoặc bất kỳ đâu có đường mòn / bậc / cầu dẫn tới | đi vào được, nội thất, tương tác (hạng A–E bản sơ đồ §8.1) |
| **Vùng thấy** | 60–600 m, nhìn thấy rõ nhưng chưa có đường | được dựng ngoại thất; **phải có đường dẫn tới trong cùng mốc sản xuất** hoặc bị lùi ra vùng nền |
| **Vùng nền** | > 600 m hoặc tách rời bởi vực, biển mây | mô hình nền, LOD thấp; không đường dẫn; không được có cửa nhìn rõ |
| **Vùng hứa** | thấy được nhưng **cố ý chưa tới được** (Côn Lôn trên trời) | phải có lời giải thích trong truyện và điều kiện mở công khai (Quy nhất) |

### 5.3 Câu hỏi kiểm T4

| Mã | Câu hỏi | Bắt buộc | Cách kiểm |
|---|---|---|---|
| `KT-T4-01` | Công trình này thuộc hạng nào (A–E) và đã đạt tối thiểu nội thất / tương tác của hạng đó? | **[B]** | bảng hạng trong spec vùng |
| `KT-T4-02` | Đi bộ từ đường chính tới cửa, vào trong, ra lại có cần dịch chuyển không? (Phiên bản AAA: không.) | **[B]** | script A* + va chạm (`test-game-state`) |
| `KT-T4-03` | Có cửa nào **vẽ** lên tường mà không mở được trong vùng chạm không? | **[B]** | rà ảnh 4 góc |
| `KT-T4-04` | Bảng màu khóa 5 màu và bộ mái khóa của vùng có bị vi phạm không? | **[B]** | ảnh chụp nhanh so palette |
| `KT-T4-05` | Công trình có nguyên mẫu có thật ghi trong spec, và 7 thứ đã đối chiếu? | **[B]** | spec vùng |
| `KT-T4-06` | Ánh sáng trong nhà có nguồn thật (nến, đèn bơ, đèn lồng, cửa sổ) không? | **[B]** | ảnh đêm trong nhà |
| `KT-T4-07` | Công trình có hành vi theo giờ can chi (cửa, chuông, NPC) không? | | spec có lịch giờ |
| `KT-T4-08` | NPC trong công trình có lý do ở đó (nghề, nhà, lễ) và lịch sinh hoạt? | | spec NPC |
| `KT-T4-09` | Vật phẩm / tiền xuất hiện ở đâu và đi về đâu (dòng chảy kinh tế) có lý không? | | tài liệu 11 |
| `KT-T4-10` | Trong nhà có **dấu vết người ở** (chén trà dở, sách mở, áo phơi) không? | | ảnh trong nhà |
| `KT-T4-11` | Hiệu năng trong nhà ≥ 30 khung/giây trên máy tầm trung? | **[B]** | đo |
| `KT-T4-12` | Người chơi có thể đọc đẳng cấp nơi chốn chỉ bằng màu mái (thang lưu ly vàng → lục → xám → đỏ mũi hài)? | | thử nghiệm 5 người |

### 5.4 Ví dụ làm / không làm (T4)

| Mã | Tính năng | ✔ Làm | ✘ Không làm | Vì sao |
|---|---|---|---|---|
| `VD-T4-01` | Chính Đường (`palace_grand`) | Khoét cửa giữa; tầng 1 Tổ Sư đường, tầng 2 tàng kinh (bản sơ đồ §8.4) | Giữ khối Meshy liền, có biển «Chính Đường» mà không vào được | công trình to nhất sân không vào được là lời nói dối lớn nhất |
| `VD-T4-02` | Vận Mệnh Các, Thái Tuế Điện | Thật hóa nội thất ngay trong vỏ điện phụ Đông / Tây | Giữ phòng ngoài bản đồ (x 1.500–1.800) mãi | phòng ngoài bản đồ chỉ là giải pháp tạm của bản web |
| `VD-T4-03` | Lầu chuông / lầu trống | Tầng 2 có chuông thật; giờ Mão chuông sớm, giờ Dậu trống chiều; cả máy chủ nghe | Lầu chuông chỉ là khối trang trí | chuông là đồng hồ của Sơn Môn |
| `VD-T4-04` | 4 bảo tháp góc | Tầng trệt bia tháp, cầu thang lên, tầng đỉnh có chuông gió theo hành người chơi | Tháp đặc | tháp là chỗ ngắm cảnh tự nhiên nhất |
| `VD-T4-05` | 30 nhà vườn Huyền Thành | Mỗi nhà một gia đình NPC có lá số, án phong thủy tại chính nhà họ | Nhà nhân bản không cửa | phố là nơi người sống |
| `VD-T4-06` | Cửa điện chính | Đóng sau giờ Tuất, mở giờ Mão; cửa ngách mở ban đêm, NPC không tiếp | Cửa luôn mở, NPC đứng suốt đêm | thế giới có nhịp |
| `VD-T4-07` | Côn Lôn | Thấy trên trời từ Sơn Môn (vùng hứa), có thoại giải thích, mở khi Quy nhất | Đảo trời không có lời giải thích, hoặc có đường mây dẫn tới rồi chặn bằng tường vô hình | lời hứa phải công khai điều kiện |
| `VD-T4-08` | Võ Đang | Ngói lưu ly xanh lục viền vàng (cung quán sắc dựng); Kim Điện đồng | Ngói đỏ mũi hài kiểu chùa Việt | trộn phong cách là vi phạm khóa vùng |
| `VD-T4-09` | Yên Tử | Mái chồng diêm, ngói mũi hài đỏ nâu, rồng thời Trần thân tròn | Mái lưu ly xanh, đấu củng phương Bắc | Thiền Việt có kiến trúc Việt |
| `VD-T4-10` | Bút Tháp | Bố cục nội công ngoại quốc; Cửu phẩm liên hoa **quay được** | Tháp Cửu phẩm là khối tĩnh | tháp quay là công năng có thật của nguyên mẫu |
| `VD-T4-11` | Văn Miếu | 82 bia Tiến sĩ trên lưng rùa; bia trống cho tên người chơi đỗ đình thí (bia mới đặt ở **dãy riêng**, không chen vào dãy bia lịch sử) | Khắc tên người chơi lên bia lịch sử có sẵn | tôn trọng di sản thật (T6) và vẫn có công năng |
| `VD-T4-12` | Tạng Địa | Tường thu hẹp lên trên, cửa sổ khung đen hình thang | Tường thẳng đứng kiểu Hán | hình khối là bản sắc |
| `VD-T4-13` | Ánh sáng đêm | Đèn lồng emissive + 12 đèn điểm động gán đèn gần nhất (đã có, V2-1); trong điện có nến | Toàn cảnh sáng đều như ban ngày | đêm là đêm; đèn là vật thật |
| `VD-T4-14` | Can chi ngày | Lịch ngày (đã có) hiện can chi thật; ngày Thủy thì sương nặng hơn một bậc (phần 12) | Can chi ngẫu nhiên mỗi lần vào | thời gian thật là cầu nối với đời |
| `VD-T4-15` | Lễ tiết | Thượng Nguyên, Trung Nguyên, Hạ Nguyên, Trùng Cửu theo âm lịch thật | Sự kiện «Lễ hội mùa hè» theo lịch tiếp thị | game sống theo lịch của người tu |
| `VD-T4-16` | Trạm đi nhanh (xe, đò, hạc) | Mở sau khi tới tận nơi lần đầu | Mở sẵn toàn bản đồ | đi bằng chân là cách quen đất |
| `VD-T4-17` | Ngự kiếm | Bay bỏ qua vật cản ở trên cao; hạ cánh phải ở chỗ đất trống | Hạ cánh xuyên mái, đứng trong tường | không phá ảo giác không gian |
| `VD-T4-18` | Nội thất Đạo quán phương Bắc | Cột đỏ, chân tảng, đấu củng, xà toàn tỉ lam lục, thần khám có màn, bồ đoàn | Dùng bộ nội thất chùa Việt cho Chung Nam | bộ mô-đun theo đạo thống (bản sơ đồ §8.3) |
| `VD-T4-19` | Trai đường Toàn Chân | Giờ ăn có mõ báo, đạo sĩ ngồi hàng, người chơi vào ngồi được, nhận buff Nguyên Khí | Phòng ăn trống, không ai ăn | công năng phải **chạy** |
| `VD-T4-20` | Hồ sen Bút Tháp | Sen nở theo mùa (hè), hoa đăng rằm tháng 7 | Sen nở quanh năm | mùa là thật |
| `VD-T4-21` | Chợ Huyền Thành | Hàng quán theo vùng gốc của hàng (bạc Miêu, chè Mao Sơn, thuốc Võ Đang) | Một kiểu sạp lặp lại | kinh tế kể chuyện địa lý |
| `VD-T4-22` | Nhà người chơi | Sửa nhà bằng bát trạch / huyền không thật; đồ đạc có va chạm | Nhà là menu trang trí 2D | sửa nhà là Mệnh Đồ tầng KHÔNG GIAN |
| `VD-T4-23` | Đường đá giữa các vùng | Có trạm nghỉ, quán trà ven đường, cầu có mái | Đường trống 1 km | đường là nội dung |
| `VD-T4-24` | Bậc thang Võ Đang | Ngàn bậc đi bộ được, có điểm dừng ngắm cảnh, Nguyên Khí giảm khi leo | Bậc là dốc trơn | leo núi là hành hương |
| `VD-T4-25` | Phong Đô | Đường một chiều xuống, lối ra duy nhất là đi lên (điện Địa Tạng) | Dịch chuyển ra từ bất kỳ đâu | không gian là ẩn dụ của hành trình nghiệp |
| `VD-T4-26` | Thời tiết | Theo tiết khí + vùng (tuyết Chung Nam mùa đông, sương Mao Sơn) | Mưa ngẫu nhiên mọi nơi như nhau | khí hậu là bản sắc vùng |
| `VD-T4-27` | NPC ngủ | Đêm NPC về nhà, đèn nhà họ sáng rồi tắt | NPC biến mất lúc giờ Hợi | đời sống thật có chuyển tiếp |
| `VD-T4-28` | Biển Hán trên cổng | Chữ đúng của nguyên mẫu hoặc chữ hư cấu nhất quán, viết đúng chiều (phải → trái với biển ngang cổ) | Chữ Hán sinh ngẫu nhiên, sai nét | người đọc chữ Hán sẽ thấy ngay |

### 5.5 Ca biên T4

| Mã | Tình huống | Xử lý |
|---|---|---|
| `CB-T4-01` | Hết ngân sách nội thất cho một vùng | Lùi công trình chưa làm nội thất ra **vùng nền** (dời vị trí, bỏ đường dẫn) thay vì giữ cửa giả. Không bao giờ ra mắt cửa giả. |
| `CB-T4-02` | Model Meshy không có lòng trong | Pipeline bản sơ đồ §8.2: Meshy dựng vỏ, nội thất dựng bằng bộ mô-đun khớp lòng nhà đo từ footprint. |
| `CB-T4-03` | Người chơi chơi lúc nửa đêm thật, mọi điện đóng | Cửa ngách mở; trong Sơn Môn luôn có Trà Thất và Bàn Thầy (thầy viết chữ) hoạt động; nhiệm vụ đêm. Không để người chơi đêm (nhóm đông, phần 04) bị bỏ rơi. |
| `CB-T4-04` | Múi giờ người chơi khác máy chủ MMO | Giờ ánh sáng theo **máy người chơi**; sự kiện máy chủ theo giờ máy chủ, hiển thị quy đổi. Chuông giờ Mão là chuông theo giờ máy chủ (sự kiện chung) — đây là điểm cần chốt (câu hỏi mở). |
| `CB-T4-05` | Nguyên mẫu có thật có công trình hiện đại (cáp treo Yên Tử, khách du lịch) | Không dựng. Game dựng **thời điểm truyền thống** của nguyên mẫu, ghi trong spec. |
| `CB-T4-06` | Nguyên mẫu có công trình người chơi không nên vào (nội cung, mật thất) | Vẫn vào được nếu dựng; nhưng phải có công năng (vd mật thất là nơi cất kinh, chỉ xem, có NPC giữ). Không dựng thì đặt ngoài tầm. |

### 5.6 Checklist nghiệm thu T4

- [ ] Definition of Done §8.5 bản sơ đồ: đủ 6 điều cho mọi công trình vùng chạm.
- [ ] Ảnh chụp 4 góc + 1 trong nhà lưu `docs/art/<vùng>/`.
- [ ] Palette checker (phần 12 §6) không báo lệch.
- [ ] Lịch giờ can chi của công trình (cửa, chuông, NPC) có trong spec.

---

## 6. T5 · Đúng cổ pháp

### 6.1 Định nghĩa đầy đủ

Game là **một người thầy nói lần thứ hai** điều trang chính đã nói. Ba yêu cầu:

1. **Nhất quán với app.** Cùng lá số, game và trang chính hiện **cùng con số, cùng kết luận**. Game không có nhánh luận riêng. Lỗi của engine được sửa ở engine (Phụ lục B bản sơ đồ), không vá ở game.
2. **AI không bịa.** Thoại AI đi qua brief lá số thật (`buildChartBrief`, `extendBrief`) và được `checkNeo` đối chiếu. Câu nhắc tới trạng thái game phải khớp `gameContext` (quy tắc 4, bản sơ đồ §6.4).
3. **Đúng truyền thống.** Thuật ngữ, nghi lễ, kiến trúc, trang phục, cách xưng hô của từng đạo thống đúng với nguồn (dữ liệu app: `schools-data`, `daozang-data`, `library-data`, `remedy-fate`…; và cố vấn nội dung). Chỗ app **chưa có** thì ghi rõ «(chưa có — cần biên soạn)» và **không bịa cho đầy**.

### 6.2 Thang tin cậy của nguồn

| Bậc | Nguồn | Được dùng làm |
|---|---|---|
| A | Engine app (`src/engine/*`) đã chạy và test | chỉ số, kết luận luận giải, dữ liệu nghi lễ đã có |
| B | Kinh điển gốc (Tử Bình Chân Thuyên, Trích Thiên Tủy, Cùng Thông Bảo Giám, Liễu Phàm tứ huấn, Đạo Đức Kinh…) qua `library-data` / `daozang-data` | trích dẫn, khoa cử, Tàng kinh |
| C | Tài liệu học thuật, bảo tàng, hồ sơ di sản về nguyên mẫu kiến trúc | kiến trúc, trang phục |
| D | Cố vấn từ truyền thống (tu sĩ, đạo sĩ, nhà nghiên cứu) | duyệt cuối, đặc biệt Tạng, Miêu, Phong Đô |
| E | Văn hóa đại chúng (tiểu thuyết tu tiên, phim) | **chỉ** để đặt tên dễ hiểu (vd «linh căn»), luôn kèm tên gốc |

Không có bậc nào cho «AI tự nghĩ ra».

### 6.3 Câu hỏi kiểm T5

| Mã | Câu hỏi | Bắt buộc | Cách kiểm |
|---|---|---|---|
| `KT-T5-01` | Cùng lá số, game và trang chính có hiện cùng số và cùng kết luận không? | **[B]** | test đối chiếu tự động trên bộ lá số mẫu |
| `KT-T5-02` | Mọi dữ kiện luận giải trong thoại (kịch bản hoặc AI) có trong brief / engine không? | **[B]** | `checkNeo` ≥ 90 (phần 16 `KPI-12`) |
| `KT-T5-03` | Thuật ngữ có đúng nghĩa trong từ điển (phần 09–11) không? | **[B]** | rà thuật ngữ |
| `KT-T5-04` | Nghi lễ / pháp tu mô tả có nguồn bậc A–D không? | **[B]** | cột «nguồn» trong spec |
| `KT-T5-05` | Chỗ app chưa có dữ liệu đã được ghi rõ «(chưa có — cần biên soạn)»? | **[B]** | rà |
| `KT-T5-06` | Khi các phái bất đồng (Tử Bình vs Manh phái; Bát trạch vs Huyền Không), game có nêu rõ là quan điểm của phái nào? | **[B]** | rà thoại sảnh nghề |
| `KT-T5-07` | Kiến trúc có đối chiếu 7 thứ với nguyên mẫu? | **[B]** | spec vùng (tài liệu 07) |
| `KT-T5-08` | Câu hỏi khoa cử có đáp án truy được về `library-data` / engine? | **[B]** | ngân hàng câu hỏi có cột nguồn |
| `KT-T5-09` | Chữ Hán đúng (phồn / giản nhất quán; không sai nét; không dùng chữ máy dịch)? | **[B]** | người đọc Hán duyệt |
| `KT-T5-10` | AI được phép đổi **giọng**, không được đổi **dữ kiện** — tính năng có phân biệt hai lớp này? | **[B]** | prompt có tách persona / brief |

### 6.4 Ví dụ làm / không làm (T5)

| Mã | Tính năng | ✔ Làm | ✘ Không làm | Vì sao |
|---|---|---|---|---|
| `VD-T5-01` | Lời phán Khổng tiên sinh (`MAU-A`) | «Canh Kim sinh tháng Ngọ… năm nay Bính Ngọ, Thất Sát lâm năm» — đúng engine | Thêm «tháng Ba con sẽ đổi việc» không có trong brief | `checkNeo` phải bắt |
| `VD-T5-02` | Thái Tuế | Tuổi Ngọ 2026 phạm Trị + Hình theo `thaitue.js` | Phán mọi tuổi đều «phạm» để bán đèn | đó là chiêu của Định Mệnh Hội |
| `VD-T5-03` | Mệnh Đồ | Thứ tự cố định Không gian → Tên → Thời → Thái Tuế → Làm công → Tích âm đức | Sắp lại cho «hợp nhịp game» | thứ tự là của `gaimenhPlan` |
| `VD-T5-04` | Liễu Phàm | Mốc 3.000 / 6.000 / 10.000 việc (game chia 10 → 300 / 600 / 1.000) và nói rõ là đã chia | Nói «Liễu Phàm làm 300 việc thiện» | đổi thang phải nói ra |
| `VD-T5-05` | Phù | Cấu trúc 5 phần đầu – thân – bụng – đảm – chân (`talisman-data › fu`), **ký tự hư cấu** | Vẽ lại phù thật từ ảnh | T5 về cấu trúc, T6 về nội dung |
| `VD-T5-06` | Nội đan | 4 bậc 煉精化氣 → 煉氣化神 → 煉神還虛 → 煉虛合道 | Đặt thêm bậc «Độ Kiếp», «Nguyên Anh» từ tiểu thuyết | tiểu thuyết là bậc E: chỉ để đặt tên dễ hiểu, không thay khung |
| `VD-T5-07` | Thiền Trúc Lâm | Ghi «cần biên soạn mới: Khóa hư lục, Cư trần lạc đạo phú» và chờ | Viết thoại thiền sư bằng câu thiền «nghe hay» tự chế gắn tên Trần Nhân Tông | không đặt lời vào miệng người thật |
| `VD-T5-08` | Tạng Địa | Chờ tham vấn; trước đó chỉ dùng phần Mật đã có (`ZHUNTI`, `CHAN_HUI › 金剛薩埵`) | Dựng nghi quán đảnh từ phim tài liệu | Tạng truyền cần người trong truyền thống duyệt |
| `VD-T5-09` | Sảnh Tượng Pháp (Manh phái) | Nói rõ «theo Manh phái: 做功 làm công» khi kết luận khác Tử Bình | Trộn hai phái thành một kết luận | hai phái bất đồng là kiến thức, không là lỗi |
| `VD-T5-10` | Huyền Không | Vận 9 (2024–2043) | Dùng vận 8 vì dữ liệu cũ | sai vận là sai toàn bộ bàn sao |
| `VD-T5-11` | Kiểu mái | Dùng đúng tên: vũ điện, yết sơn, ngạnh sơn, huyền sơn, toản tiêm, trùng diêm | Gọi mọi mái cong là «mái chùa» | thuật ngữ thống nhất (bản sơ đồ §7) |
| `VD-T5-12` | Thập điện Diêm La | Theo truyền thuyết phổ biến, ghi «truyền thuyết» | Trình bày như giáo lý chính thống Phật giáo | Thập điện là tín ngưỡng dân gian pha Đạo – Phật |
| `VD-T5-13` | Khoa cử Văn Miếu | Hương thí → hội thí → đình thí; danh xưng tú tài / cử nhân / tiến sĩ đúng thời | Gọi người đỗ hương thí là «tiến sĩ» | |
| `VD-T5-14` | Thầy AI | Giọng persona khác nhau; dữ kiện cùng brief | NPC Thiền sư «đoán vận» vì người chơi hỏi | persona Thiền sư có câu cấm «đoán vận» (bản sơ đồ §6.2) |
| `VD-T5-15` | Đạo hiệu | Chấm theo `analyzeName` (ngũ cách, tổng nét) | Chấm theo «nghe hay» | |
| `VD-T5-16` | Bát trạch | Quái mệnh tính theo năm sinh và giới tính (như engine) | Một quái mệnh cho mọi người | |
| `VD-T5-17` | Lịch ngày | Trực, Hoàng đạo / Hắc đạo, nhị thập bát tú từ `zheri`, `huangdao` | Ngày tốt xấu ngẫu nhiên cho vui | |
| `VD-T5-18` | Kinh theo việc | `JING_ZHOU`: Dược Sư cho bệnh, Địa Tạng cho nghiệp nặng… chỉ giới thiệu, ý nghĩa | In toàn văn chú; biến tụng kinh thành nút buff | (bản sơ đồ §5.4) |
| `VD-T5-19` | Xưng hô | Đạo sĩ: bần đạo; tăng: bần tăng / thầy; ni: sư cô / ni sư; Nho: lão phu | Đạo sĩ xưng «bần tăng» | xem phần 08 §1 |
| `VD-T5-20` | Chữ Hán trong UI | Phồn thể thống nhất ở UI game (theo chữ trên biển cổ); nếu engine trả giản thể thì quy đổi khi hiện | Trộn 劫财 và 劫財 trên cùng màn | (chính lỗi này đã làm hỏng một nhánh engine) |
| `VD-T5-21` | Linh vật Võ Đang | Huyền Vũ (rùa quấn rắn), Chân Vũ | Đặt tượng Phật ở Kim Điện | |
| `VD-T5-22` | Nhân vật lịch sử | Trần Nhân Tông hiện qua tượng, bia, sách | NPC Trần Nhân Tông nói chuyện tự do bằng AI | T5 + T6: không đặt lời mới vào miệng bậc thánh có thật |
| `VD-T5-23` | Thiên Sư | «Trương Thiên Sư (hư cấu, không gắn đời Thiên Sư có thật)» | Đặt tên trùng một đời Thiên Sư thật | tránh nói thay người thật |
| `VD-T5-24` | Thần sát | ~31 sao có trong engine | Thêm sao từ app khác cho đủ | ngoài engine = ngoài T1 |
| `VD-T5-25` | Điều hậu (Cùng Thông) | Dụng thần điều hậu theo `han-nuan` | Tự suy Dụng điều hậu bằng bảng của biên kịch | |

### 6.5 Ca biên T5

| Mã | Tình huống | Xử lý |
|---|---|---|
| `CB-T5-01` | Engine và một kinh điển bất đồng | Game theo engine (T1) và ghi chú trong Tàng kinh: «Sách X nói khác: …». Báo đội engine để xem xét. |
| `CB-T5-02` | Cố vấn truyền thống phản đối một chi tiết đã làm | Cố vấn thắng ở phạm vi truyền thống của họ (T5 bậc D, T6). Sửa trước khi ra mắt vùng. |
| `CB-T5-03` | Người chơi (chuyên gia, `PS-06`) báo sai trong cộng đồng | Kênh báo lỗi cổ pháp riêng; mỗi báo cáo có phản hồi trong 7 ngày; sửa được thì ghi công người báo trong Tàng kinh («hiệu đính»). |
| `CB-T5-04` | `checkNeo` báo điểm thấp nhưng câu trả lời có vẻ đúng | Giữ câu trả lời trong log, ẩn với người chơi, dùng thoại kịch bản thay. Đội AI xem lại. |
| `CB-T5-05` | Truyền thống có nhiều dị bản (Thập điện, Bát Tiên) | Chọn một dị bản, ghi tên dị bản trong spec, nhất quán toàn game. |

### 6.6 Checklist nghiệm thu T5

- [ ] Test đối chiếu trang chính ↔ game xanh.
- [ ] `checkNeo` trung bình ≥ 90 trên bộ 200 câu hỏi chuẩn của persona.
- [ ] Mọi mục Tàng kinh có cột nguồn.
- [ ] Người đọc Hán đã duyệt mọi chuỗi chữ Hán của tính năng.
- [ ] Mục «chưa có — cần biên soạn» được liệt kê và có người nhận.

---

## 7. T6 · Tôn trọng và an toàn

### 7.1 Định nghĩa đầy đủ

Game trình bày tín ngưỡng thật **nghiêm túc**, bảo vệ người chơi khỏi **hại thật** (sức khỏe, tiền, tâm lý, dữ liệu), và không biến điều thiêng thành hàng hóa. Năm vùng:

| Vùng | Cam kết | Nguồn ràng buộc |
|---|---|---|
| **Tín ngưỡng** | không chế giễu, không phá nơi thờ, không bán vật thiêng, không đặt lời vào miệng bậc thánh có thật; cố vấn từng truyền thống | bản sơ đồ §14 |
| **Thực hành có hại** | không hướng dẫn nghi thức thật có hại; phù dùng ký tự hư cấu; yểm thuật chỉ là truyện; không công thức thuốc / cổ thật | `amta-data › ETHICS`, `bitruyen-data` («cấm thực hành») |
| **Sức khỏe** | không chẩn bệnh, không «khí công chữa bệnh», cảnh báo 辟穀; chuyển hướng khủng hoảng | RB1, `cultivation-data` |
| **Tiền** | không bán cải mệnh, không gacha, không bán bói; minh bạch giá | RB5, canon §7 |
| **Dữ liệu và người dễ tổn thương** | ngày sinh chỉ ở máy; chế độ vị thành niên; âm tà tự nguyện bật | bản sơ đồ §14, `ETHICS` opt-in |

### 7.2 Danh mục «thiêng — không làm hàng»

Những thứ dưới đây **không bao giờ** là món bán, phần thưởng gacha, hay trang phục mặc tự do. Một số được **trao** qua tu (ghi rõ):

| Thứ | Truyền thống | Trạng thái trong game |
|---|---|---|
| Ca-sa (袈裟), y hậu, y năm điều / bảy điều / chín điều | Phật giáo | **không bao giờ** là trang phục người chơi |
| Pháp y chủ lễ thêu (法衣, 絳衣) của Đạo sĩ | Đạo giáo | chỉ NPC trong khoa nghi; người chơi không mặc |
| Y phục tăng Tạng (đỏ sẫm, vàng) | Tạng truyền | không bao giờ là trang phục người chơi |
| Liên hoa quan (蓮花冠) | Toàn Chân (đạo sĩ đã thụ giới) | **không bán**; nếu có, chỉ trao khi hoàn tất chuỗi giới luật Toàn Chân (tài liệu 05), và đổi tên món hiện có (xem phần 03 §2) |
| Hình tượng Phật, Bồ-tát, Tam Thanh, Thiên Sư đời thật, Trần Nhân Tông | mọi truyền thống | không là ngự vật, khung tên, hào quang, biểu tượng cảm xúc |
| Đài sen làm **chỗ đứng / ngồi** của nhân vật | Phật giáo (tòa của Phật, Bồ-tát) | không làm ngự vật bán (xem phần 03 §2) |
| Pháp luân (法輪) | Phật giáo | không làm hào quang sau lưng để bán |
| Ấn Dương Bình Trị Đô Công, lục chức | Chính Nhất | chỉ trong truyện; thụ lục trong game là cấp đạo chức **hư cấu**, không mô phỏng lục thật |
| Chày kim cương, chuông Tạng, mạn-đà-la thật | Mật / Tạng | đạo cụ cảnh; mạn-đà-la trong game là mẫu hình học hư cấu |
| Bài vị tổ tiên, bàn thờ gia tiên NPC | dân gian Việt / Hoa | không tương tác phá, không lấy đồ |
| Chữ Phạn / Tạng của chân ngôn thật | Mật | không in làm họa tiết trang trí đồ bán |

### 7.3 Câu hỏi kiểm T6

| Mã | Câu hỏi | Bắt buộc | Cách kiểm |
|---|---|---|---|
| `KT-T6-01` | Có chỉ dẫn nào người chơi làm theo ngoài đời có thể gây hại (nhịn ăn, nghi thức, thuốc, chú) không? | **[B]** | rà; duyệt nội dung |
| `KT-T6-02` | Có món nào trong danh mục §7.2 bị bán / trao sai cách? | **[B]** | rà SKU, phần thưởng |
| `KT-T6-03` | Nội dung âm tà có cổng tự nguyện bật + xác nhận + tắt được? | **[B]** | luồng UI |
| `KT-T6-04` | Có lời nào chẩn đoán bệnh, hứa chữa bệnh, hứa giàu? | **[B]** | quét từ (phần 08 §2) |
| `KT-T6-05` | Người chơi nói về khủng hoảng thì NPC có rời vai đúng quy tắc? | **[B]** | bộ test câu khủng hoảng |
| `KT-T6-06` | Dữ liệu ngày sinh / điểm Tiên Thiên có rời máy khi cờ tắt? | **[B]** | rà gói tin |
| `KT-T6-07` | Có miêu tả một dân tộc / tôn giáo có thật theo hướng tà ác, mê tín, lạc hậu? | **[B]** | cố vấn duyệt |
| `KT-T6-08` | Người chơi có thể phá hoại, xúc phạm nơi thờ (leo lên tượng, đá lư hương) không? | **[B]** | thử chơi phá |
| `KT-T6-09` | Chế độ vị thành niên có áp lên tính năng (giới hạn chi tiêu, tắt Tà Lộ mặc định)? | **[B]** | luồng tuổi |
| `KT-T6-10` | Có thúc ép (đếm ngược, sợ mất, khan hiếm giả) để người chơi trả tiền? | **[B]** | rà UI cửa hàng |
| `KT-T6-11` | Cố vấn của truyền thống liên quan đã duyệt chưa? | **[B]** cho M2–M5 | biên bản duyệt |

### 7.4 Ví dụ làm / không làm (T6)

| Mã | Tính năng | ✔ Làm | ✘ Không làm | Vì sao |
|---|---|---|---|---|
| `VD-T6-01` | Kết phù | Ký tự hư cấu của game, cấu trúc 5 phần | Ảnh phù thật làm texture | app cố ý để phù «không vẽ được» |
| `VD-T6-02` | Tĩnh tọa Võ Đang | Cơ chế nhịp thở; câu «không tự luyện nội đan ngoài đời khi chưa có thầy» | Hướng dẫn tịch cốc 7 ngày «thanh lọc cơ thể» | 辟穀 có rủi ro y khoa |
| `VD-T6-03` | Y dược Miêu Cương | Sắc thuốc **trong truyện** theo ngũ hành tạng phủ (`tcm`) | Công thức dược liệu thật kèm liều | người chơi có thể làm theo |
| `VD-T6-04` | Tà Lộ | Mở sau xác nhận tự nguyện; không mô tả nguyên liệu, câu chú, cách làm yểm | «Bùa yêu» có hướng dẫn | (bản sơ đồ §5.5) |
| `VD-T6-05` | Người Miêu | Nạn nhân và người chữa; kẻ ác là yểm sư người ngoài | Người Miêu là «tộc nuôi cổ» | định kiến dân tộc có thật ngoài đời |
| `VD-T6-06` | Mao Sơn đạo nhân | «Đa phần cái gọi là tà là người mình mệt. Ngủ đủ đã, rồi thầy xem.» | «Con bị ma theo» | `ETHICS`: không ngôn ngữ tuyệt đối «bị ma» |
| `VD-T6-07` | Ca-sa | Chỉ NPC tăng mặc | Bộ «Cà Sa Kim Lan» ở Tàng Y Các | §7.2 |
| `VD-T6-08` | Thầy AI | Câu về bệnh: nói xu hướng ngũ hành theo cổ pháp + «không thay thế y khoa» + gợi ý đi khám | «Năm sau con mắc bệnh gan» | RB1 |
| `VD-T6-09` | Cửa hàng | Không bán cải mệnh, Đạo Hạnh, công đức | «Gói Giải Hạn 99.000đ» | RB5; đây là chính tội của Định Mệnh Hội |
| `VD-T6-10` | Bố thí trong game | Bố thí bằng **Phúc Khí** (tiền cày) cho NPC | Bố thí bằng Ngọc nạp tiền thật để nhận công đức | mua công đức bằng tiền thật |
| `VD-T6-11` | Sổ đời thực | Mặc định tắt; ghi việc thiện ngoài đời, **không thưởng chỉ số** | Thưởng Ngọc khi chụp ảnh từ thiện | biến việc thiện thật thành cày điểm |
| `VD-T6-12` | Tượng thờ | Đứng gần tượng: camera hạ, không cho leo, không cho ngồi lên bàn thờ | Va chạm cho phép đứng lên tượng | thử chơi phá |
| `VD-T6-13` | Lư hương | Thắp nhang (web) / đốt trầm (iOS) là lễ, có hoạt cảnh cúi | Đá đổ lư hương có vật lý vui | |
| `VD-T6-14` | MMO | Gửi màu áo, đồ, Đạo Hạnh tổng | Gửi ngày sinh | (đã làm) |
| `VD-T6-15` | Người dưới 18 tuổi | Từ ngày sinh tính tuổi; dưới 18: Tà Lộ tắt mặc định (bật cần xác nhận người lớn — câu hỏi mở), chi tiêu có trần, AI giới hạn chủ đề tình cảm | Không làm gì vì «ngày sinh chỉ ở máy» | ngày sinh ở máy vẫn dùng được để bảo vệ trên máy |
| `VD-T6-16` | Thông báo đẩy | Không có thông báo về hạn, xung, phạm | «Ngày mai đại hung, mở app xem cách hóa giải» | dọa để giữ chân |
| `VD-T6-17` | Hồi IV «xuống âm phủ» | Âm ty là truyện về nghiệp và hồi đầu; không cảnh tra tấn đồ họa | Mô tả cực hình chi tiết 18 tầng địa ngục | không cần gây sợ để dạy |
| `VD-T6-18` | Phóng sinh | Thả cá / chim trong game; Ni sư nói thêm «ngoài đời, phóng sinh sai chỗ có thể hại sinh vật — hỏi người hiểu biết» | Khuyến khích mua chim thật để thả | phóng sinh sai cách là vấn đề thật |
| `VD-T6-19` | Lạt-ma Đa Kiệt | Giọng **để trống** chờ tham vấn | Viết thoại Lạt-ma theo khuôn phim | tôn trọng truyền thống chưa có người duyệt |
| `VD-T6-20` | Định Mệnh Hội | Hội lừa đảo hư cấu, không gắn với dòng phái hay nghề có thật | Đặt Định Mệnh Hội trong trang phục của một tông phái có thật | không bôi nhọ người hành nghề chân chính |
| `VD-T6-21` | Tàng Y Các — món «thiêng nhẹ» (quạt chữ «道», trâm gỗ đào) | Cho phép: đồ dân dụng / thư sinh | — | không phải món nào có chữ Đạo cũng là thiêng; xem phần 03 §2 |
| `VD-T6-22` | Hào quang sau lưng | Vòng sáng ngũ hành, mây, sao | Vầng hào quang kiểu tượng Phật sau đầu | mô phỏng thánh tướng |
| `VD-T6-23` | Lời Phán quan | Đọc **Sổ Công Quá thật của người chơi**, nói về sửa | «Ngươi sẽ đọa địa ngục» | Phán quan có câu cấm «dọa xuống địa ngục» (bản sơ đồ §6.2) |
| `VD-T6-24` | Âm thanh tụng | Tụng hòa âm không lời rõ hoặc đã được phép | Thu âm nghi lễ thật không xin phép | phần 14 |
| `VD-T6-25` | Xin xăm (web) | Có, như app; iOS tắt | Xăm «trả phí xin lại lần hai» | bán bói |
| `VD-T6-26` | Chuyển hướng khủng hoảng | NPC rời vai, đưa đường dây hỗ trợ của quốc gia người chơi (theo cấu hình), rồi quay lại | NPC trả lời trong vai «con hãy niệm Phật cho qua» | |

### 7.5 Ca biên T6

| Mã | Tình huống | Xử lý |
|---|---|---|
| `CB-T6-01` | Người chơi hỏi Thầy AI cách yểm người yêu cũ | RB3: từ chối nhẹ, chuyển về tự dưỡng; câu mẫu ở phần 08 §3. Không phạt người chơi bằng nghiệp vì câu hỏi. |
| `CB-T6-02` | Người chơi tự nhận là tu sĩ và yêu cầu game dạy nghi lễ thật | Game không dạy; gợi ý tìm thầy thụ chức ngoài đời. |
| `CB-T6-03` | Người chơi dùng tên đạo hiệu xúc phạm (tên thánh, tên Phật) | Bộ lọc tên có danh sách tên thánh / danh xưng thiêng. |
| `CB-T6-04` | Người chơi làm hành động không đứng đắn trong điện (MMO) | Trong điện chính: cử chỉ giới hạn (chắp tay, cúi, quỳ lạy, ngồi bồ đoàn). |
| `CB-T6-05` | Cố vấn Tạng không duyệt được trước M5 | Lùi vùng Tạng; không ra mắt bản tạm. |
| `CB-T6-06` | Người chơi phàn nàn game «truyền bá mê tín» | Phản hồi chuẩn: game là văn hóa và tu tâm; mọi luận giải đi kèm khung «xu hướng, tự tu»; không bán giải hạn. |

### 7.6 Checklist nghiệm thu T6

- [ ] Biên bản duyệt cố vấn (M2–M5).
- [ ] Danh mục §7.2 đối chiếu với toàn bộ SKU và phần thưởng.
- [ ] Bộ test 50 câu khủng hoảng / y khoa / hại người: 100% đi đúng nhánh.
- [ ] Chế độ vị thành niên chạy được với ngày sinh < 18 tuổi.
- [ ] Không gói tin nào chứa ngày sinh.

---

## 8. Luật phân xử khi các trụ cột xung đột

### 8.1 Nguyên tắc chung

1. **Không có trụ cột nào bị bỏ.** Xung đột được giải bằng **tách lớp**: trụ cột này quản lớp này, trụ cột kia quản lớp kia. Chỉ khi không tách được mới dùng thứ tự ưu tiên.
2. **Thứ tự ưu tiên khi không tách được:**

   **T6 > T2 > T1 = T5 > T3 > T4**

   - **T6 đứng đầu** vì hại thật ngoài đời không đảo ngược được.
   - **T2 trước T1** chỉ ở **lớp lời** (cách nói), không ở **lớp số** (T1 vẫn giữ số đúng).
   - **T1 = T5**: hai mặt của một sự thật; xung đột giữa chúng là **lỗi engine**, sửa engine.
   - **T3 trước T4**: nếu truyền thống thật có yếu tố bạo lực, game mô tả (T5) nhưng không cho người chơi làm (T3); không gian (T4) không được dựng để mời bạo lực.
   - **T4 đứng cuối** vì là trụ cột tốn kém nhất; khi thiếu nguồn lực, T4 được **thu hẹp phạm vi** (lùi công trình ra vùng nền) chứ không được **làm giả**.
3. **Lớp quản lý của từng trụ cột** (dùng để tách):

| Trụ cột | Quản lớp |
|---|---|
| T1 | con số, nguồn dữ liệu, điều kiện cơ chế |
| T2 | cách nói, khung trình bày, cân bằng dài hạn |
| T3 | hành động người chơi được phép làm |
| T4 | không gian, thời gian, đời sống thế giới |
| T5 | nội dung tri thức, thuật ngữ, hình thức truyền thống |
| T6 | giới hạn với hại thật, hàng hóa, dữ liệu, vật thiêng |

### 8.2 Ma trận xung đột 6 × 6

Ô ghi **loại xung đột điển hình** và **cách tách**.

| | T2 | T3 | T4 | T5 | T6 |
|---|---|---|---|---|---|
| **T1** | Số thật nhưng khó nghe → T1 giữ số, T2 viết lời | Thập thần mang tên «Sát», «Kiếp» → T1 giữ tên, T3 đổi cơ chế sang trị đạo / đồng đạo | Lá số NPC đòi nhiều nhà → T4 lùi nhà ra nền, T1 giữ NPC ở nhà gần | Engine sai so với kinh điển → sửa engine | `vitality`, `tcm` chạm sức khỏe → T1 giữ số, T6 đổi tên «Nguyên Khí» và cấm diễn giải y khoa |
| **T2** | — | Thử thách khó dễ làm người lá số thấp nản → T3 giữ độ khó, T2 bỏ chữ gán vào lá số | Năm hạn thật làm thế giới tối → T4 dựng chuỗi mộng, T2 giữ lời «giữ» | Kinh điển có lời định mệnh («yểu», «bần») → T5 trích trong Tàng kinh có chú, T2 cấm dùng trong thoại | Hệ số Nghịch Thiên khuyến khích ngày sinh giả → T6 không xác minh danh tính, T2 trần 1,5 |
| **T3** | | — | Không gian võ đài, đấu trường đẹp → không dựng (T3) | Khoa nghi có múa kiếm trảm tà → NPC diễn, người chơi xem | Hồi IV âm phủ dễ thành kinh dị bạo lực → T6 cấm cực hình đồ họa, T3 thử thách đạo đức |
| **T4** | | | — | Nguyên mẫu có cáp treo, du khách → dựng thời điểm truyền thống | Nguyên mẫu là nơi thờ thật, dựng chính xác có thể xúc phạm (vd điện thờ chính Potala) → cố vấn quyết; có thể hư cấu hóa nội thất |
| **T5** | | | | — | Truyền thống có thực hành nguy hiểm (tịch cốc, nghi chú) → T5 mô tả lịch sử, T6 cấm hướng dẫn |

### 8.3 Quy trình phân xử (khi đội không tự tách được)

1. Người phát hiện ghi **phiếu xung đột** gồm: tính năng, hai trụ cột, đề xuất A (nghiêng trụ cột 1), đề xuất B (nghiêng trụ cột 2), đề xuất tách lớp nếu có.
2. **Người giữ trụ cột** (mỗi trụ cột có một người giữ, xem §8.5) của hai bên họp ≤ 30 phút.
3. Nếu chưa xong: áp thứ tự ưu tiên §8.1, **trừ khi** đề xuất tách lớp tồn tại (luôn ưu tiên tách lớp).
4. Ghi quyết định vào **sổ án lệ** (§8.4) để lần sau không hỏi lại.
5. Quyết định chạm T6 luôn có thêm người phụ trách nội dung nhạy cảm ký.

### 8.4 Án lệ (16 vụ mẫu)

| Mã | Vụ | Trụ cột | Quyết định | Lớp tách |
|---|---|---|---|---|
| `AL-01` | Khổng tiên sinh phán đúng năm hạn của người chơi; người chơi có thể sợ | T1 – T2 | Giữ ba câu phán đúng engine; câu thứ tư bắt buộc là câu hỏi ngược; cảnh tiếp theo không quá một màn sau là Vân Cốc hoặc Thầy Tử Bình | số (T1) / lời (T2) |
| `AL-02` | Đặc tính «Thất Sát» bị biên kịch muốn làm «sát khí» tấn công | T1 – T3 | Giữ tên Thất Sát, cơ chế là Trị đạo (quyết đoán, kỷ luật) | tên / cơ chế |
| `AL-03` | Lá số có `analyzeVitality` thấp; đội muốn hiện «Sức khỏe kém» | T1 – T6 | Hiện «Nguyên Khí 32» (thể lực trong game); không chữ «sức khỏe» | số / tên gọi |
| `AL-04` | Kinh điển Tam Mệnh Thông Hội có câu đoán «yểu» cho một cách | T5 – T2 | Tàng kinh trích nguyên văn có chú «quan niệm cổ; game không dùng để phán»; thoại cấm | trích dẫn / thoại |
| `AL-05` | Lôi pháp Thần Tiêu rất «ngầu», đội muốn làm phép đánh | T5 – T3 | Lôi pháp là nghi lễ cầu mưa / trừ ôn do NPC chủ trì; người chơi phụ lễ (giữ nhịp trống) | mô tả / hành động |
| `AL-06` | Văn Miếu thật có 82 bia; đội muốn cho người chơi khắc tên lên bia | T4 – T6 | Dãy bia mới riêng, phân biệt rõ; không chạm bia lịch sử | công năng / di sản |
| `AL-07` | Thiếu ngân sách nội thất Miêu Cương | T4 | Giảm số nhà sàn trong vùng chạm từ 20 xuống 12; 8 nhà lùi ra bờ bên kia sông (nền) | phạm vi |
| `AL-08` | Hồi III lấy năm hung nhất thật; người chơi có thể tra năm đó ngoài đời | T1 – T2 – T6 | Không hiện năm dương lịch trong lời thoại; hiện can chi; chuỗi mộng; có nút «Vì sao năm này?» dẫn tới giải thích «thuận làm, nghịch giữ» | dữ kiện / trình bày |
| `AL-09` | «Liên Hoa Quan» VIP đang bán (cosmetics.js) | T6 – kinh tế | Đổi thành món khác không mang danh vật thiêng; Liên hoa quan thật chỉ trao qua giới luật Toàn Chân (phần 03 §2) | hàng / vật thiêng |
| `AL-10` | Người chơi lá số thấp muốn tắt hẳn hiển thị điểm | T1 – T2 | Cho **ẩn số khỏi màn chính** (tùy chọn), không xóa; «Vì sao?» vẫn mở được | hiển thị / dữ liệu |
| `AL-11` | Tạng Địa trễ tham vấn, ảnh hưởng cấu trúc «9 đạo thống» | T5 – T6 – sản xuất | Mật (Chuẩn Đề) tạm đặt ở một điện phụ Bút Tháp; Tạng Địa ra sau | phạm vi |
| `AL-12` | Ngự kiếm nhanh làm người chơi bỏ qua đường đá (T4 muốn người chơi đi bộ) | T4 – chất lượng | Bay mở ở bậc 3; trạm đi nhanh mở khi tới tận nơi; vùng hành hương (Võ Đang, Yên Tử) có «đất thánh» cấm bay ở thần đạo | không gian / tiện ích |
| `AL-13` | Thầy AI được hỏi về thuốc; `tcm` có dữ liệu | T1 – T6 | AI nói tạng phủ theo ngũ hành **như văn hóa**, không kê thuốc, kèm câu «hỏi thầy thuốc» | tri thức / chỉ dẫn |
| `AL-14` | Đạo hiệu hợp Dụng thần nhưng trùng danh xưng thánh | T1 – T6 | Bộ lọc tên thắng; gợi ý tên khác cùng ngũ cách | dữ liệu / tôn trọng |
| `AL-15` | Khoa cử xếp hạng làm người chơi chậm nản | T2 – T3 | Đỗ theo ngưỡng tuyệt đối (ai đạt cũng đỗ); bảng xếp hạng chỉ là phụ, ẩn được | cơ chế / so sánh |
| `AL-16` | Bản iOS tắt Vận Mệnh Các nhưng Hồi I có nhiệm vụ «Mười năm này» | T1 – T6 (pháp lý) | iOS thay bằng «Mười năm đọc sách» ở Thư Lâu: học khái niệm đại vận bằng lá số khách, không đoán vận bản thân | nội dung / nền tảng |

### 8.5 Người giữ trụ cột

| Trụ cột | Người giữ (vai) | Quyền |
|---|---|---|
| T1 | trưởng kỹ thuật engine | phủ quyết mọi con số không có nguồn |
| T2 | trưởng biên kịch | phủ quyết mọi chuỗi văn bản vi phạm |
| T3 | trưởng thiết kế hệ thống | phủ quyết cơ chế sát phạt |
| T4 | trưởng mỹ thuật môi trường | phủ quyết cửa giả, trộn phong cách |
| T5 | trưởng nội dung cổ pháp + cố vấn | phủ quyết dữ kiện sai |
| T6 | người phụ trách nội dung nhạy cảm + pháp chế | phủ quyết tuyệt đối trong phạm vi §7 |

Mỗi người giữ có quyền **chặn ra mắt** tính năng vi phạm câu kiểm **[B]** của trụ cột mình.

### 8.6 Bảng «một tính năng mới phải qua»

Mọi spec mới dán bảng này ở đầu, điền đủ trước khi họp duyệt:

| Trụ cột | Câu kiểm [B] đã qua | Ví dụ gần nhất trong bảng VD | Xung đột đã biết | Án lệ áp dụng |
|---|---|---|---|---|
| T1 | | | | |
| T2 | | | | |
| T3 | | | | |
| T4 | | | | |
| T5 | | | | |
| T6 | | | | |

## 9. Ba trụ cột sau đặt cạnh từng hệ thống lớn

Nối tiếp bảng phần 1 §4 (T1–T3). Đọc hai bảng cùng nhau để thấy đủ sáu đòi hỏi trên mỗi hệ thống.

| Hệ thống | T4 đòi | T5 đòi | T6 đòi |
|---|---|---|---|
| Mở đầu «Nhập Môn» | đường lên cổng đi bộ được; sân có giờ can chi thật | lời phán Khổng tiên sinh khớp engine, `checkNeo` | dòng riêng tư ở form; câu dẫn điểm thấp; nhánh iOS không đoán vận |
| Mệnh Bàn | — | tên gốc (gradeVi, chữ Hán) cạnh tên game | không chữ «sức khỏe»; mô tả thần sát lọc bỏ câu y khoa của engine (GL-232, GL-233) |
| Mệnh Đồ | mỗi việc gắn **địa điểm thật đi tới được** | thứ tự cố định của `gaimenhPlan` | không việc nào là mua |
| Sổ Công Quá | việc thiện xảy ra ở nơi có thật (chợ, hồ sen, nhà dân) | `CONG_QUA`, mốc Liễu Phàm ghi rõ đã chia 10 | Sổ đời thực tắt mặc định, không thưởng |
| Cảnh giới | mở vùng theo bậc nhưng **không khóa chỗ** (`YC-08`) | tên bậc theo đạo thống (Đạo / Phật / Nho) | không bán bậc, không VIP mở sớm |
| Giải án / sảnh nghề | sảnh có công trình chính đi vào được | lá số khách sinh bằng engine; ghi phái khi bất đồng | không khách nào hỏi «ngày chết» được trả lời |
| Thánh địa | nguyên mẫu, 7 thứ đối chiếu, bảng màu khóa | cố vấn truyền thống duyệt | Tạng chờ tham vấn; không phá nơi thờ |
| MMO | va chạm người chơi tắt; điện chính có lễ nghi | — | không gửi ngày sinh; chat trong điện tắt mặc định |
| Tàng Y Các | quầy là đình gỗ thật trong sân | tên món đúng nghĩa (không «long bào» sai nghĩa) | danh mục thiêng §7.2; giá rõ; trần chi tiêu |
| Thầy AI | — | persona + brief + `checkNeo` | RB1–RB5; khủng hoảng rời vai |
| Hồi III · Năm Hạn | thời tiết, ánh sáng theo hành Kỵ | năm thấp nhất từ `liunian` | không năm dương lịch (`AL-08`) |
| Tà Lộ | hang yểm sư là nơi có thật, tách khỏi trại | — | tự nguyện; không cách yểm thật; không gắn dân tộc |
| Lễ tiết | theo âm lịch thật | đúng nghĩa lễ (Tam Nguyên, Vu Lan…) | lễ không bán; đèn Thái Tuế miễn phí |
