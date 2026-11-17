# TIÊN PHỦ CỬU TRỌNG THIÊN — MANIFEST LÀM LẠI (2026-11-17)

Yêu cầu chủ dự án (2026-11-17), nguyên ý:
- Các phủ trên không quá bé, toàn đi xuyên vật thể, nước hồ trong phủ cũng đi qua được.
- Mỗi phủ rộng gấp 4–5 lần phủ Hoà Thân.
- Mọi chi tiết trong phủ phải chỉn chu, và chủ phủ đổi được mọi chi tiết.
- Mỗi phủ có ít nhất một công trình 10 tầng. Mỗi tầng đủ chi tiết, có cầu thang và thang máy bằng phép để lên từng tầng.
- Không chi tiết nào đi xuyên qua được.
- 9 biệt phủ theo 9 phong cách khác nhau.

## 0. Hiện trạng đo được (trước khi làm)

| Đo | Giá trị | Cách đo |
|---|---|---|
| Diện tích tiên phủ | 84–100 m × 84–100 m (7.056–10.000 m²) | `estate-layout.js › TIEN_PLAN` |
| Phong cách | 1 (Thiên Cung), chỉ khác màu mái | `THIEN_BASE` |
| Đi xuyên ở Quân Thiên Phủ | **530 / 944 điểm có hình ở tầm thân người vẫn đi qua được (56 %)** | `scripts/_probe-tienphu.mjs` (bắn tia lên từ 0,15 m so với nền, so với `world.blockedAt`) |
| Cách di chuyển trong vùng trời | lối «phòng nội thất» 2D (x > ROOM_X0 − 40), không có độ cao, không nhảy | `main.js › stepMove` |
| Mặt hồ | đăng ký `addTall(…, 0.3)` nên đứng / đi trên mặt nước được | `mansion3d.js:40` |
| Nhà nhiều tầng | không làm được: lưới va chạm chỉ 2D (x, z) | `obstacles.js` |

Ảnh trước: `output/tienphu-before/01-thuong-gate.png`, `02-quan.png`.

## 1. Nguồn tham chiếu và điều học được

Nguồn do agent nghiên cứu ngày 2026-11-17 thu thập. Mã màu (hex) là ước lượng bằng mắt, không lấy từ nguồn.

| Nguồn | Học được | Áp dụng |
|---|---|---|
| [Phủ Cung Vương (phủ Hoà Thân)](https://www.travelchinaguide.com/attraction/beijing/prince_gong.htm), [Wikipedia](https://en.wikipedia.org/wiki/Prince_Gong_Mansion) | Rộng **61.120 m²** (330 × 180 m). Khu ở 32.260 m² phía Nam, hoa viên 28.860 m² phía Bắc. 3 trục song song (giữa, Đông, Tây), mỗi trục khoảng 3 sân. Lầu 2 tầng «99 gian rưỡi» ở hậu. Hoa viên có 20 cảnh, núi đá Thái Hồ, giả sơn bốn phía, ao hồ. | Phủ mới **520 × 520 = 270.400 m² = 4,42 lần**. Chia 3 dải: tiền viện, khu ở 3 trục, hậu hoa viên (≈ 47 % diện tích như phủ Cung Vương). |
| [Thái Hoà Điện](https://en.wikipedia.org/wiki/Hall_of_Supreme_Harmony) | 64,24 × 37 m. Cao 26,92 m, 35,05 m tính cả thềm cẩm thạch 3 tầng. Mái trùng thiềm vũ điện, ngói vàng, cột son. | Chính điện Quân Thiên 58 × 32 m, thềm 3 bậc 4,5 m, mái hai tầng hiên. |
| [Hoàng Hạc Lâu](https://en.wikipedia.org/wiki/Yellow_Crane_Tower), [Phật Hương Các](https://english.visitbeijing.com.cn/article/47ONfzSS1Sr) | Lầu nhiều tầng hiên, mỗi tầng có hành lang vòng. Phật Hương Các bát giác trên đài vuông 20 m. | Lầu kiểu Trung Hoa: tầng nào cũng có hiên và hành lang ngoài. |
| [Thành Himeji](https://en.wikipedia.org/wiki/Himeji_Castle) | Tường đá chân (ishigaki) 14,85 m. Thân gỗ 31,5 m. Diện tích sàn giảm từ 554 xuống 115 m² (21 %). Tường vữa trắng, mái xám, đầu hồi chidori, cá shachi. | Lầu Nhật: chân đá dốc cao 8 m, mỗi tầng một lớp mái, có đầu hồi xen kẽ. Tầng 10 giữ ≥ 38 % diện tích tầng 1 để đặt đồ được. |
| [Potala](https://en.wikipedia.org/wiki/Potala_Palace), [kiến trúc Tây Tạng](https://en.wikipedia.org/wiki/Tibetan_Buddhist_architecture) | 13 tầng, 119 m. Tường nghiêng vào trong khoảng 10°. Bạch Cung trắng, Hồng Cung đỏ. Khung cửa sổ hình thang đen, dải pema đỏ thẫm dưới mái. Mái bằng, mái vàng nhỏ. | Lầu Tây Tạng: mỗi tầng lùi vào **FH·tan 10° = 0,88 m** mỗi bên. 3 tầng trên đỏ, có dải pema. |
| [Neuschwanstein](https://en.wikipedia.org/wiki/Neuschwanstein_Castle), [Nhà thờ Cologne](https://en.wikipedia.org/wiki/Cologne_Cathedral) | Đá vôi trắng ngà, mái đá phiến. Cửa sổ vòm nhọn, tháp tròn góc. Tháp Palas 65 m. | Lầu Gothic: khối vuông thẳng đứng, 4 tháp tròn góc mái nón, chóp nhọn, hành lang có lỗ châu mai ở tầng 4, 7, 10. |
| [Chrysler](https://en.wikipedia.org/wiki/Chrysler_Building), [Empire State](https://en.wikipedia.org/wiki/Empire_State_Building) | Thân lùi bậc (setback) nhiều lần. Vương miện 7 vòm toả tia thép không gỉ. Gạch trắng xen dải spandrel. | Lầu Art Deco: lùi bậc ở tầng 4, 7, 9 thành sân thượng. Vương miện vòm toả tia và chóp kim. |
| [Pantheon](https://en.wikipedia.org/wiki/Pantheon,_Rome), [Villa Rotonda](https://en.wikipedia.org/wiki/Villa_La_Rotonda), [Vitruvius](https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Vitruvius/3*.html) | Cột Corinth cao gấp 8 đường kính. Trán tường dốc 12,5–14°. Vòm bán cầu có lỗ oculus 0,21 Ø. Có 4 portico. | Lầu tân cổ điển: thân tròn, hàng cột vòng mỗi 2 tầng, vòm bán cầu có oculus, portico 6 cột ở cửa. |
| [Hoàng thành Huế](https://en.wikipedia.org/wiki/Imperial_City_of_Hu%E1%BA%BF), [Ngọ Môn](https://vi.wikipedia.org/wiki/Ng%E1%BB%8D_M%C3%B4n_(Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF)), [Hiển Lâm Các](https://vi.wikipedia.org/wiki/Hi%E1%BB%83n_L%C3%A2m_c%C3%A1c), [Phước Duyên](https://en.wikipedia.org/wiki/Thi%C3%AAn_M%E1%BB%A5_Pagoda) | Ngọ Môn có 5 cửa, lầu Ngũ Phụng 9 mái (giữa vàng, 8 xanh). Hiển Lâm Các ≈ 5,7 m/tầng, gian giảm 5 → 3 → 1. Phước Duyên bát giác 7 tầng. | Lầu Huế: bát giác, mỗi tầng một lớp mái ngói xanh, mái đỉnh vàng, cột sơn son. Cổng phủ kiểu Ngọ Môn 5 cửa. |
| [Wat Arun](https://en.wikipedia.org/wiki/Wat_Arun), [Angkor Wat](https://en.wikipedia.org/wiki/Angkor_Wat), [mỹ thuật chùa Thái](https://en.wikipedia.org/wiki/Thai_temple_art_and_architecture) | Prang trung tâm, 4 prang góc. Angkor có các hành lang đồng tâm và hào nước. Mái Thái 2–4 lớp xếp chồng, viền xanh, có chofa. | Lầu Thái: tầng vuông (chữ thập khó đặt thang 8,4 m — lệch manifest gốc), mỗi tầng 2 lớp mái đỏ cam viền xanh có chofa, đỉnh prang vàng. Hồ trong phủ là hào chữ nhật. |
| [Taj Mahal](https://en.wikipedia.org/wiki/Taj_Mahal), [Qutb Minar](https://en.wikipedia.org/wiki/Qutb_Minar), [vườn charbagh](https://en.wikipedia.org/wiki/Mughal_garden) | Nền cao 6 m, iwan, vòm củ hành, 4 minaret. Qutb Minar 5 tầng có ban công trên công-xôn muqarnas, thân có rãnh khía. Charbagh chia 4 phần bởi 2 kênh chéo, giữa là bể nước. | Lầu Mughal: bát giác có rãnh khía, ban công mỗi 2 tầng, dưới đá đỏ trên cẩm thạch, đỉnh chhatri. Hồ là charbagh. |
| Quy chuẩn [IBC 1011](https://codes.iccsafe.org/content/IBC2021V2.0/chapter-10-means-of-egress), [Blondel](https://blog.structuralia.com/en/such-as-stair-treads-and-risers), [EN 81-70](https://www.ikoniclifts.co.uk/blog/en-81-70-lift-car-dimensions-requirements/) | Bậc cao 102–178 mm, mặt bậc ≥ 279 mm, 2R + T ≈ 63 cm. Thang rộng ≥ 1,118 m, khoảng thông đầu ≥ 2,03 m. Lan can ≥ 1,067 m, tay vịn 0,86–0,97 m. Cabin thang máy ≥ 1,1 × 1,4 m. | Mục §3. |

## 2. Bố cục Cửu Trọng Thiên (`heaven.js`)

- **Giới hạn máy chủ:** `protocol.WORLD_TILES` cho phép x tối đa ROOM_X1 + 40 = ROOM_X0 + 2360. Vùng trời nằm ở x ∈ [ROOM_X0, ROOM_X0 + 2360] và z ∈ [570, 2930]. Nhờ vậy không chồng lên Thiên Lao / mỏ (z ≤ 400) hay lưới phòng (z ≤ −230).
- **Tâm:** cx = ROOM_X0 + 1180, cz = 1750, nửa cạnh 1180.
- **Phủ:** 520 × 520 m. Đảo = phủ cộng lề 10 m mỗi bên, cộng sân trước cổng 14 m.
- **Đảo giữa (Quân Thiên):** cổng quay Nam. Quảng trường 70 m phía Nam có Nam Thiên Môn và điểm đến.
- **4 đảo chính hướng:** cách tâm 900 m theo trục, cổng quay về tâm.
- **4 đảo góc:** đặt ở (±795, ±795), xoay 45°, cổng quay về tâm. Đã kiểm khe giữa đảo góc và đảo chính hướng ≥ 130 m.
- **Cầu ngọc rộng 10 m:**
  - đảo giữa nối 4 đảo chính hướng (dài ≈ 330 m);
  - mỗi góc của đảo giữa nối một đảo góc theo đường chéo (dài ≈ 450 m).
- **Lan can mép đảo và hai bên cầu là vật cản thật**, chỉ chừa miệng cầu. Ai bay rồi rơi khỏi đảo (y < −25) thì về lại Nam Thiên Môn.

## 3. Lầu chính 10 tầng — quy tắc có số đo (`tienphu/tower.js`)

| Thông số | Giá trị | Lý do |
|---|---|---|
| Chiều cao một tầng (sàn tới sàn) FH | 5,0 m | Himeji ≈ 5,2 m, Hiển Lâm Các ≈ 5,7 m |
| Sàn | dày 0,4 m | |
| Số bậc mỗi tầng | 29 bậc × 0,1724 m | ≤ 0,178 m (IBC) |
| Mặt bậc | 0,30 m, nên 2R + T = 0,645 m | Blondel 0,63–0,65 |
| Cầu thang | thẳng, rộng 1,6 m, dài 8,4 m, chạy dọc vách bên | Tầng chẵn ở vách trái, tầng lẻ ở vách phải (so le, không đụng đầu) |
| Lỗ thang trên sàn tầng trên | chừa đúng dải thang | Lan can 1,1 m ở cạnh trong và đầu xa |
| Lan can hành lang / ban công / sân thượng | 1,1 m | ≥ 1,067 m |
| Tay vịn thang | 0,9 m | |
| Thang phép | đĩa ngọc Ø 2,6 m ở giữa phía sau mỗi tầng, cột sáng xuyên suốt | Cabin EN 81-70 ≥ 1,1 × 1,4 m |

- **Thang phép:** bấm E, chọn tầng 1–10 hoặc Vọng Đài, rồi bay lên / xuống trong cột sáng khoảng 1,2 s.
- **Cửa:** mỗi tầng có cửa giữa mặt trước và mặt sau, rộng 2,4 m, ra hành lang vòng (nếu phong cách có hành lang ở tầng đó). Tầng 1 có cửa chính ra thềm lầu.
- **Tầng 11 là Vọng Đài:** sàn mở dưới mái đỉnh, lan can bốn phía, lên bằng thang từ tầng 10 hoặc bằng thang phép.
- **Kích thước tối thiểu:** tầng nhỏ nhất vẫn rộng ≥ 20 × 20 m bên trong. Lý do: thang 8,4 m, đĩa thang phép và đủ chỗ đặt đồ.

**Chủ đề mặc định của 10 tầng** (chủ phủ đổi được, §7):
1. Đại Sảnh
2. Trà Thất
3. Thư Lâu
4. Yến Sảnh
5. Tẩm Cung
6. Thiền Phòng
7. Đan Phòng
8. Bảo Khố
9. Nhạc Các
10. Vọng Nguyệt Đường

**Hình dáng lầu theo phong cách:**

| # | Phủ (vị trí) | Phong cách | Mặt bằng | Nửa cạnh tầng 1 → 10 | Thềm | Mái / đỉnh | Hành lang ngoài |
|---|---|---|---|---|---|---|---|
| 0 | Quân Thiên (giữa) | Cung đình Trung Hoa | vuông | 16 → 12,4 (−0,4 m/tầng) | 3 bậc cẩm thạch, 4,5 m | mỗi tầng một lớp hiên ngói vàng, đỉnh mái trùng thiềm vũ điện | mọi tầng |
| 1 | Thương Thiên (Đông) | Thành Nhật Bản | vuông | 17 → 11 (−0,67 m/tầng) | chân đá dốc 8 m | mỗi tầng một lớp mái xám, đầu hồi chidori ở tầng lẻ, đỉnh irimoya có shachi | tầng 10 |
| 2 | Biến Thiên (Đông Bắc) | Tây Tạng | vuông | 19 → 11,1 (−0,88 m/tầng) | đá 3 m | mái bằng, viền pema đỏ thẫm, 3 tầng trên màu Hồng Cung, mái vàng nhỏ trên đỉnh | sân thượng |
| 3 | Huyền Thiên (Bắc) | Gothic | vuông + 4 tháp góc | 14 không đổi | 2 m | mái đá phiến dốc, chóp nhọn 22 m, tháp góc mái nón | tầng 4, 7, 10 (có lỗ châu mai) |
| 4 | U Thiên (Tây Bắc) | Art Deco | vuông | 17 / 14 / 12 / 10,5 (lùi ở tầng 4, 7, 9) | 1,5 m | vương miện vòm toả tia và chóp kim thép | sân thượng ở mỗi bậc lùi |
| 5 | Hạo Thiên (Tây) | Tân cổ điển | tròn 16 cạnh | 15 → 12 (lùi ở tầng 3, 5, 7, 9) | 2,4 m | vòm bán cầu có oculus, portico 6 cột | hàng cột vòng ở tầng 2, 4, 6, 8, 10 |
| 6 | Chu Thiên (Tây Nam) | Cung đình Huế | bát giác | 15 → 11,4 | 2,4 m | mỗi tầng một lớp mái ngói xanh, mái đỉnh vàng, có hồ lô | mọi tầng |
| 7 | Viêm Thiên (Nam) | Thái – Khmer | vuông | 17 → 12,5 | 4 m, lùi bậc như Angkor | mỗi tầng 2 lớp mái đỏ cam viền xanh có chofa, đỉnh prang vàng | tầng lẻ |
| 8 | Dương Thiên (Đông Nam) | Mughal – Ba Tư | bát giác có rãnh khía | 15 → 12 | 6 m (như nền Taj) | đỉnh chhatri vòm củ hành | ban công công-xôn ở tầng 2, 4, 6, 8, 10 |

## 4. Va chạm — không đi xuyên chi tiết nào (`obstacles.js`, `motion.js`)

- **Vật lý thật trong vùng trời:** dùng `motion.moveFree` (có y3, trọng lực, nhảy, bậc, bơi) thay cho lối đi «phòng nội thất».
- **Vật cản theo tầng (`addSolid3` / `setRoomSolids3`):**
  - ô 0,5 m mang khoảng cao [y0, y1];
  - chặn người khi khoảng đó giao (y + 0,3, y + 1,75);
  - áp cho vách tầng, cột, lan can, gầm thang (chỗ khoảng thông dưới 2,1 m) và đồ bài trí trong lầu.
- **Vật cản 2D:** áp cho mọi thứ chỉ có một tầng (tường phủ, vách sảnh, cột hiên, gốc cây, đá, đèn, tượng, đình, cầu, lan can bờ hồ).
- **Sàn tầng:**
  - mỗi sàn là một nền `addPlatform(…, top, bot = top − 0,4, base)`;
  - lỗ thang là hố `addPit` có khoảng cao, chỉ khoét đúng sàn tầng đó;
  - bậc thang: mỗi bậc là một nền mỏng (bot = top − 0,25).
- **Nguyên tắc nhất quán:** mọi vật cản sinh **từ cùng một bản đặc tả** dùng để dựng hình. Không có vật cản «vẽ tay» lệch khỏi hình.

## 5. Nước hồ (`water.js › addPool`, `obstacles.js › addPit`)

- **Hình học:** lòng hồ khoét qua nền đảo (hố), đáy ở −1,9 m, mặt nước ở −0,3 m, nên sâu 1,6 m (> 1,3 m là phải bơi).
- **Bờ:** gờ đá cao 0,35 m, có bậc lên bờ ≤ 1,4 m.
- **Không còn đứng trên mặt nước** (bỏ `addTall` mặt nước). Ai có phép Thủy Thượng Phiêu vẫn đạp nước được, đúng luật cũ.
- **Cầu và đảo giữa hồ:** là nền không phải `base`, nên vẫn đi trên được.

## 6. Bố cục trong phủ (khung cục bộ, +z = cổng chính) (`tienphu/plan.js`)

| Dải | Phạm vi z | Nội dung |
|---|---|---|
| Tiền viện | +250 → +150 | Cổng chính theo phong cách (rộng 24–40 m), 2 nhà gác, sân lát 120 × 70 m, 2 hàng đèn, 2 tượng hoặc kỳ lân |
| Khu ở | +150 → −40 | **Trục giữa:** chính điện (≈ 58 × 32 m), sân, rồi **lầu chính 10 tầng** trên thềm. **Trục Đông:** khách sảnh, nội viện. **Trục Tây:** thư các, luyện võ trường |
| Hậu hoa viên | −40 → −250 | Hồ lớn có đảo và đình giữa hồ, 2 cầu. Giả sơn có đình trên đỉnh. Thủy tạ, hí lâu (sân khấu như phủ Cung Vương), ≥ 6 đình, rừng trúc, bồn hoa. Gò tọa sơn dọc tường sau |

- **Tường bao:** cao 7 m, dày 1,6 m. Có 4 cổng: chính, hậu, Đông, Tây (cổng phụ rộng 6 m).
- **Mật độ tối thiểu mỗi phủ:**
  - ≥ 6 nhà / sảnh;
  - ≥ 6 đình;
  - ≥ 500 cây (vẽ hàng loạt bằng instancing);
  - ≥ 80 đèn;
  - ≥ 2 cầu;
  - ≥ 40 đá / ghế / tượng.
- **Hồ theo phong cách:**

  | Phong cách | Hồ |
  |---|---|
  | Trung Hoa, Huế, Tây Tạng | hồ elip tự nhiên |
  | Nhật | hồ dạo lượn khúc, có vườn sỏi |
  | Gothic, Tân cổ điển, Art Deco | hồ gương chữ nhật, có vườn hoa kỷ hà và đài phun |
  | Thái | hào chữ nhật quanh đảo vườn ở hậu hoa viên, giữa đảo có sala và chedi (lệch manifest gốc 2026-11-17: hào quanh lầu chắn lối thềm và lối thang, nên dời vào hậu hoa viên) |
  | Mughal | charbagh: 2 kênh chéo và bể giữa |

## 7. Chủ phủ đổi mọi chi tiết (`tienphu/custom.js`, `tienphu/custom-ui.js`)

**Tuỳ chọn** (mã hoá thành chuỗi ≤ 64 ký tự, lưu `own.opts` trên máy và trường `o` trên máy chủ):

| Tuỳ chọn | Số lựa chọn |
|---|---|
| Màu mái | 8 |
| Màu tường | 8 |
| Màu cột / viền | 6 |
| Sàn trong lầu | 6: gỗ, cẩm thạch, ngọc, gạch men, thảm đỏ, tre |
| Kiểu đèn | 4 |
| Hồ | 4: sen, cá chép, trong vắt, suối ngọc |
| Mùa cây | 4: xuân đào, hạ lục, thu phong, đông tùng tuyết |
| Màu cờ / phướn | 6 |
| Đỉnh lầu | 3 biến thể theo phong cách |
| Lan can | 3 |
| Chủ đề từng tầng (tầng 1–10) | 10 chủ đề mỗi tầng |

- **Bài trí đồ:** mọi tầng lầu, mọi sảnh, mọi sân đều là «vùng» bài trí (`zones`). Số vùng tăng lên 2 chữ số (k ≤ 99).
- **Ai đổi được:** chỉ chủ phủ. Khách chỉ xem.

## 8. Ngân sách hiệu năng

- **Mỗi tiên phủ ở bản chi tiết:**
  - ≤ 90 lệnh vẽ (gộp theo vật liệu, cây và đèn dùng instancing);
  - ≤ 800 nghìn tam giác.
- **Đồ trong lầu:** chỉ dựng khi người chơi cách lầu ≤ 90 m.
- **Toàn Cửu Trọng Thiên:**
  - bản xa: 1 lưới gộp;
  - bản chi tiết: tối đa 2 phủ cùng lúc.
- **Khung hình** (máy bàn tầm trung, chất lượng mid): đứng trong tiên phủ ≥ 45 fps (`frameStats`).
- **Va chạm:**
  - ô `solid3` của 9 phủ ≤ 400 nghìn;
  - dựng va chạm lúc nạp ≤ 250 ms (đo bằng `span`).

## 9. Kiểm tra

**Bằng script** (`scripts/test-tienphu.mjs`, chạy Node, và `scripts/probe-tienphu.mjs`, chạy trên trình duyệt):
- [ ] Diện tích mỗi phủ ∈ [244.480, 305.600] m² (4–5 × 61.120).
- [ ] Không đảo nào chồng nhau. Toàn vùng trời nằm trong `WORLD_TILES`.
- [ ] 9 phong cách khác nhau: khác mặt bằng / mái / đỉnh / hồ. Kiểm bằng khoá chữ ký.
- [ ] Lầu mỗi phủ có ≥ 10 tầng kín cộng Vọng Đài. Tầng nhỏ nhất rộng ≥ 20 × 20 m.
- [ ] Thang: bậc cao ≤ 0,178 m, mặt bậc ≥ 0,279 m.
- [ ] **Người máy đi bộ bằng `motion.moveFree` leo được từ đất lên tầng 10 chỉ bằng cầu thang**, không xuyên vách.
- [ ] Thang phép đưa tới đủ 11 tầng.
- [ ] Đứng tầng k không bị đồ hay vách của tầng k ± 1 chặn. Đi vào vách tầng k thì bị chặn.
- [ ] Điểm giữa hồ có nước sâu ≥ 1,3 m, đi bộ vào thì phải bơi.
- [ ] Probe đi xuyên trên trình duyệt: lọt ≤ 2 % điểm có hình ở tầm thân người (trước làm: 56 %).

**Bằng mắt** (ảnh `output/tienphu-after/`):
- [ ] Từ cổng, mỗi phủ một ảnh.
- [ ] Bên trong tầng 1, tầng 5, tầng 10.
- [ ] Từ Vọng Đài.
- [ ] Hồ.
- [ ] Toàn cảnh từ trên cao.

## 9b. Kết quả kiểm (2026-11-17)

**Test Node** (`node scripts/test-tienphu.mjs`): **18/18 đạt**.
- Diện tích 270.400 m², gấp 4,42 lần phủ Cung Vương.
- 9 đảo không chồng nhau, nằm trong biên máy chủ.
- 9 phong cách có chữ ký khác nhau. 9 kiểu đỉnh lầu, 9 kiểu cổng.
- Bậc thang 0,172 m, mặt bậc 0,30 m.
- Người máy leo từ mặt đảo lên Vọng Đài bằng cầu thang, đạt ở cả 9 lầu.
- Thang phép đứng được ở đủ 11 tầng.
- Vách tầng nào chỉ chặn tầng đó.
- Hồ sâu ≥ 1,3 m: đi vào là phải bơi.

**Probe đi xuyên** (`node scripts/probe-tienphu.mjs`), kiểm độc lập với `voxel.js`, tính cả mặt đất lẫn từng tầng lầu:

| Phủ | Lọt |
|---|---|
| Quân Thiên | 0,65 % |
| Thương Thiên | 1,1 % |
| Biến Thiên | 0,88 % |
| Huyền Thiên | 0,13 % |
| U Thiên | 0,87 % |
| Hạo Thiên | 0,24 % |
| Chu Thiên | 1,54 % |
| Viêm Thiên | 0,84 % |
| Dương Thiên | 0,73 % |

- **Lớn nhất 1,54 %, đạt mục tiêu ≤ 2 %** (trước khi làm: 56 %).
- Phần còn lọt: cành cây thấp và chân cột góc hành lang. Vùng chặn cột đã nới tới Ø 0,9 m.
- Lỗi đã gặp trong lúc làm:
  - Voxel giữ tối đa 12 khoảng cao mỗi ô, nên các tầng trên của lầu bị mất. Đã nâng lên 80.
  - Script probe `import` lại `obstacles.js` thì nhận một bản module rỗng. Đã đổi sang dùng `__hq.blockedAt` của game đang chạy.

**Ảnh** (`node scripts/shot-tienphu.mjs`, thư mục `output/tienphu-after/`):
- mỗi phủ một bộ: trước lầu, toàn cảnh, cận lầu, tầng 1 / 5 / 11, cổng;
- luồng chủ phủ (`node scripts/ui-tienphu.mjs`): `ui-lift-floor6.png`, `ui-custom-after.png` (mái son đỏ, cây mùa thu).

**Hiệu năng:**
- Mỗi phủ dựng trong 3–6 s, chia nhỏ qua nhiều khung hình nên không khựng.
- Sinh 110–180 nghìn ô voxel.
- Lúc đầu 3.319 lệnh vẽ, chỉ 24 fps. Sau khi gộp lưới theo vật liệu và thêm bản gộp cả lầu / cả sảnh khi đứng ngoài, còn khoảng 100 lệnh vẽ đang hiện, đạt **56 fps** (Quân Thiên, Chromium headless, d3d11).
- **Lệch §8:** con số 250–420 lưới mà script đếm có cả bản từng tầng / từng sảnh đang ẩn. Ngân sách 90 lệnh vẽ áp cho lưới đang hiện.

## 10. Goal phát triển (tự theo đuổi)

- **G-TP1 · Va chạm đúng — ĐẠT 2026-11-17** (probe lớn nhất 1,54 %, test leo thang đạt ở 9 lầu). Bước kế: chạy probe cho cả 9 phủ sau mỗi thay đổi hình; hạ phần lọt do cành cây thấp.
- **G-TP2 · Nhận diện 9 phong cách** (xong khi ảnh cổng của 9 phủ đặt cạnh nhau phân biệt được ngay). Bước kế: bổ sung chi tiết đặc trưng còn thiếu theo ảnh, ví dụ cá shachi, dải pema, rãnh khía Qutb.
- **G-TP3 · Hiệu năng** (xong khi ≥ 45 fps ở mid trong phủ). Bước kế: đo `frameStats`, gộp thêm hoặc instancing chỗ nào vượt ngân sách §8.
- **G-TP4 · Lưu tuỳ biến lên máy chủ** (xong khi trường `o` lưu và đọc lại được qua `est_save` / `est_get`). Cần deploy worker, việc này phải hỏi chủ dự án.
- **G-TP5 · Sau khi đạt G-TP1 – G-TP3:** NPC theo tầng (quản gia ở Đại Sảnh, thị nữ ở Trà Thất), và nhạc hoặc âm thanh nền riêng cho từng phong cách.
