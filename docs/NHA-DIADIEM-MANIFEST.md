# NHÀ Ở · CỬU TRỌNG THIÊN · MENU ĐỊA ĐIỂM — MANIFEST (2026-11-12)

Yêu cầu người dùng: «Hệ thống nhà ở các khu biệt phủ, biệt thự, nhà có thể mua đâu rồi, biệt phủ trên Cửu Trọng Thiên
đâu rồi, phần menu địa điểm không làm lại cho khoa học hơn, đầy đủ địa điểm, chọn nơi làm việc, ăn uống, ngủ nghỉ».

## 0. Hiện trạng (khảo sát mã)

| Hạng mục | Có trong mã? | Người chơi thấy ở đâu |
|---|---|---|
| 16 biệt phủ, h 0–15 (`mansions.js`, `mansion3d.js`) | Có, dựng 3D, đi bộ vào được | Bản đồ chỉ có viền xanh, không tên, không icon. Menu không có. |
| 240 biệt thự (8 khu × 30), h 16–255 | Có | **Không có trên bản đồ.** Menu không có. |
| 27 nhà phố rao bán, h 256–282 | Có | Icon 🏠 trên bản đồ. Danh sách dài 283 dòng ở Nha Môn, chỉ xếp theo hợp mệnh. |
| Biệt phủ Cửu Trọng Thiên | **Chưa từng có** | — |
| Menu «Các gian & sảnh nghề» (`main.js › hq-menu`) | Có, 3 nhóm: Trong quán, Sảnh nghề, Điện thờ | Không có chỗ ăn, chỗ ngủ, chỗ làm, nhà, cổng, bến |

Kết luận: phần nhà đã có, chỉ **không lộ ra**. Cửu Trọng Thiên phải dựng mới. Menu phải làm lại.

## 1. Nghiên cứu (nguồn đã xem)

1. **Hoài Nam Tử, Thiên Văn Huấn** ([Wikisource](https://zh.wikisource.org/zh-hans/%E6%B7%AE%E5%8D%97%E5%AD%90/%E5%A4%A9%E6%96%87%E8%A8%93), [Baidu: 九重天](https://baike.baidu.com/item/%E4%B9%9D%E9%87%8D%E5%A4%A9/5195)).
   - 天有九野: trời có chín cõi. Trung ương là **Quân Thiên** (钧天). Đông **Thương Thiên** (苍, xanh, Mộc). Đông Bắc **Biến Thiên** (变). Bắc **Huyền Thiên** (玄, đen, Thủy). Tây Bắc **U Thiên** (幽). Tây **Hạo Thiên** (颢, trắng, Kim). Tây Nam **Chu Thiên** (朱, đỏ son). Nam **Viêm Thiên** (炎, Hỏa). Đông Nam **Dương Thiên** (阳).
   - Học được: «Cửu Trọng Thiên» = **8 phương + trung ương**, khớp đúng bát quái của thành. Bố cục **8 đảo quanh 1 đảo giữa**. Đặt tên và tô màu mái theo phương và hành.
2. **Jade Chamber (Genshin Impact)** ([fandom](https://genshin-impact.fandom.com/wiki/Jade_Chamber), [Wikipedia: Liyue](https://en.wikipedia.org/wiki/Liyue_(Genshin_Impact))).
   - Cung điện nổi trên **biển mây**, nền đá nổi, lối đi đá và gỗ, ao sen, vườn quanh một tháp lớn.
   - Đá theo kiểu karst Quế Lâm / Trương Gia Giới, nối các đỉnh bằng cầu treo.
   - Học được: đảo có **đáy đá nhọn treo** (hình nón ngược, gồ ghề), mặt đảo lát đá, ao sen, **cầu** nối đảo, biển mây phủ kín bên dưới, vài khối đá nổi nhỏ quanh.
3. **Tây Du Ký: Nam Thiên Môn** (tri thức chung).
   - Cổng vào thiên đình ở phía Nam, mây trắng, cột ngọc, mái vàng.
   - Học được: điểm đến là **Nam Thiên Môn** ở mép Nam đảo giữa. Màu chủ đạo ngọc trắng, mái vàng, son đỏ.
4. **Black Desert Online: Find NPC** ([diễn đàn Pearl Abyss](https://blackdesert.pearlabyss.com/ASIA/en-US/Forum/ForumTopic/Detail?_topicNo=63900&_categoryNo=13&_searchType=0&_sortType=6&_orderType=0&_pageNo=19&_pageSize=20&_searchDay=0&_subForumType=1&_processStatusType=0&_forumListType=1&_useForumType=False), [Wiki Storage](https://www.naeu.playblackdesert.com/en-US/Wiki?wikiNo=43)).
   - Tìm NPC **theo chức năng** (kho, chuồng ngựa, chợ, thợ rèn…), chọn là có đường tới **nơi gần nhất**. Tìm theo tên. Lọc theo vùng.
   - Học được: menu địa điểm chia **theo nhu cầu**, mỗi nhóm xếp **gần nhất trước**, có ô tìm, mỗi dòng có nút đi.

## 2. Quy tắc: Cửu Trọng Thiên (số đo)

- **Vị trí.**
  - Dải không gian phía Đông, tâm `(ROOM_X0 + 1300, 1300)`, tức `(5646, 1300)`.
  - Cách Thiên Lao và mỏ (z ≈ 330) ≥ 550 m (đo được 589 m tới mép mỏ; manifest đã sửa từ 600 vì mỏ sâu 74 m), cách lưới phòng (z ≤ −230) ≥ 1.100 m, trong biên máy chủ (x ≤ ROOM_X1 + 40).
- **Bố cục 9 đảo.**
  - Đảo giữa **Quân Thiên**: phủ 100 × 100 m, quảng trường ngọc rộng 30 m bao quanh, nền 160 × 160 m.
  - 8 đảo ngoài cách tâm **R = 280 m**, mỗi đảo một phương theo Hoài Nam Tử (Bắc = −z, Đông = +x). Mỗi đảo một phủ 80–90 m, **cổng quay vào tâm**. Nền đảo = phủ + 12 m mỗi bên, thêm 10 m sân trước cổng.
  - **Cầu** rộng 6 m nối mép quảng trường giữa tới sân trước cổng mỗi đảo (8 cầu).
- **Nam Thiên Môn.** Cổng ở mép Nam quảng trường giữa. Điểm đến cách cổng 8 m về phía trong. Có điểm tương tác «Hạ phàm» (về Sơn Môn).
- **Phong cách.**
  - Nền chung «Thiên Cung»: tường ngọc trắng `#f3eee2`, viền son `#b8322a`, mái cong, ao sen, tường trắng, có chái, chính điện 2 tầng.
  - Mái theo phương và hành: Quân `#e2b444` (Thổ, vàng hoàng gia) · Thương `#3f8a64` (Mộc) · Biến `#6a9a7a` · Huyền `#2e3a58` (Thủy) · U `#4a3f6a` · Hạo `#d8d6cc` (Kim) · Chu `#c23a2a` · Viêm `#d0522a` (Hỏa) · Dương `#e08a3a`.
- **Cảnh.**
  - Đáy đảo hình nón đá ngược sâu 0,35–0,5 lần bề rộng.
  - Mặt đảo lát đá trắng. Lan can ngọc dọc mép nền (trụ mỗi 3 m), chừa lối cầu.
  - Biển mây ở y = −28, phủ 3 × 3 km. 40 cụm mây lơ lửng. 12 khối đá nổi nhỏ.
- **Hiệu năng.**
  - Cảnh trời (không tính phủ và cổng Nam Thiên Môn) ≤ 25 lệnh vẽ và ≤ 120k tam giác. Chỉ hiện khi người chơi ở trong vùng trời (`inHeaven`).
  - Cổng Nam Thiên Môn dùng mẫu `sect_gate_grand` như cổng Sơn Môn: bậc gần là bản gốc khoảng 130k tam giác. Giữ hình theo quyết định «Giữ hình» của người dùng.
  - Đá nổi là đá thủ tục, khoảng 450 tam giác mỗi khối. Đã bỏ model `rock_island` (17k mỗi khối, 12 khối là 207k).
  - Thiên Lao và mỏ ẩn khi ở trên trời.
  - Phủ dùng hệ dựng lười sẵn có (tối đa 3 phủ chi tiết, còn lại bản xa).
- **Mua bán.**
  - 9 căn hạng **Tiên Phủ** nối vào **cuối** sổ nhà rao bán (h 283–291), nên không đổi chỉ số 283 căn cũ.
  - Giá: phủ ngoài **1.000 lượng bạc** hoặc **6.000 Ngọc**; Quân Thiên **2.000 lượng** hoặc **12.000 Ngọc**.
  - Bài trí theo vùng như biệt phủ, tối đa 240 món. Ngủ ở đó là hạng `villa` (Tỉnh +16/giờ).
- **Va chạm.** Nền đảo và cầu là nền đi được (dải phía Đông: ra khỏi nền là không đi được). Tường phủ và nhà dùng va chạm biệt phủ sẵn có.

## 3. Quy tắc: menu «Địa điểm» (thay «Các gian & sảnh nghề»)

- **8 thẻ theo nhu cầu**, mỗi thẻ ≤ 40 dòng, xếp gần nhất trước:

  | Thẻ | Nội dung |
  |---|---|
  | 🏠 **Nhà tôi** | Nhà hoặc phủ đang sở hữu: về nhà miễn phí, bài trí. Chưa có thì gợi ý thẻ Nhà đất. |
  | 🛏 **Ngủ nghỉ** | Nhà riêng · Liêu xá Sơn Môn (giường chung 30 đồng, phòng đơn 80 đồng) · ghi chú ngủ bờ bụi. Mỗi dòng ghi mức hồi Tỉnh. |
  | 🍚 **Ăn uống** | Quầy cơm Sơn Môn · Hỏa Vân Tửu Lâu · 4 tửu lâu, 4 trà lâu, 4 trà trang gần nhất trong thành. |
  | 💼 **Làm việc** | Chỗ làm đang giữ (nếu có) · Giếng Đông (gánh nước, không cần máy chủ) · Mỏ Khoáng Sơn · mỗi nghề tiệm gần nhất kèm tên nghề. |
  | 🏡 **Nhà đất** | Cửu Trọng Thiên (9 tiên phủ) · 16 biệt phủ · 8 khu biệt thự (số căn còn trống) · nhà phố · Nha Môn Địa Ốc gần nhất. Mỗi dòng ghi giá, kích thước, tình trạng. |
  | ☯ **Xem bói · tâm linh** | Các gian trong quán · sảnh nghề · điện thờ (giữ nguyên 3 nhóm cũ) · miếu gần nhất. |
  | 🛒 **Mua sắm** | Mỗi loại tiệm (16 loại) gần nhất. |
  | 🐎 **Đi lại** | Trạm xe gần nhất · bến thuyền gần nhất · 8 cổng thành · Cửu Trọng Thiên. |

- **Mỗi dòng:** biểu tượng · tên · dòng phụ (khu, cách bao xa, giá hoặc trạng thái) · nút «Đi».
- **Cước:**
  - < 260 m: đi bộ (tự tìm đường).
  - Xa hơn: xe ngựa 5 đồng như bản đồ (miễn phí dưới cấp 5).
  - Về nhà riêng và lên hoặc xuống Cửu Trọng Thiên: miễn phí.
  - Các gian, sảnh, điện: giữ cách đi cũ (`teleportTo`).
- **Ô tìm:** lọc mọi dòng của mọi thẻ theo tên, không dấu.
- **Bản đồ:** thêm lớp 🏯 Biệt phủ (icon + tên phủ) và 🏡 Biệt thự (icon mỗi khu + tên khu ở tâm khu).

## 4. Checklist kiểm (kết quả 2026-11-12)

- [x] Script `scripts/test-game-heaven.mjs`: đạt 4/4.
  - 9 tiên phủ ở h 283–291, mỗi phủ một phương, một tên, một phong cách.
  - Đảo không chồng nhau, cách mỏ 589 m, trong biên máy chủ.
  - Từ Nam Thiên Môn đi tới cổng cả 9 phủ, mỗi bước 1 m đều có nền.
  - Menu đủ 8 thẻ: 9 tiên phủ, 16 biệt phủ, 8 khu biệt thự, ≥ 10 chỗ ăn, ≥ 20 nghề.
- [x] Bài test cũ: `test-game-*` 35/35 xanh; `test-quan-protocol` 15, `test-quan-mmo` 22, `test-quan-auth` 10.
  - Sửa test cho tiên phủ: mansion và water bỏ qua tiên phủ trên trời; estate lấy nhà phố cuối ở `TIEN_H0 − 1`.
  - Nhà phố h 256–282 không đổi.
- [x] Ảnh trong `shots/heaven/`:
  - toàn cảnh 9 đảo (`02-aerial`), đảo treo và đá nổi nhìn ngang (`02-side`);
  - Nam Thiên Môn với Quân Thiên mái vàng (`c/01-quan`), Thương Thiên mái xanh Mộc (`01-thuong2`), Viêm Thiên mái đỏ Hỏa (`c/01-viem2`);
  - menu thẻ Nhà đất, Ăn uống, Làm việc; bản đồ có lớp biệt phủ và biệt thự (`c/01-map-phu`).
- [x] Ngân sách:
  - Cảnh trời 13 lệnh vẽ, 106k tam giác (cộng cổng Nam Thiên Môn là 16 lệnh vẽ, 254k).
  - fps trên máy dev, cùng đợt chạy: Cửu Trọng Thiên 29–39, khung 1,27–1,72 triệu tam giác. Sơn Môn 19–21, khung 3,75 triệu.
- [x] Build web xanh.
- [x] Deploy CI xanh (8033a15f, 7438dbdd). Kiểm trên bản live: menu 🧭 Địa điểm → Nhà đất → Thăng thiên tới đúng quảng trường trước Quân Thiên Phủ.
  - Lỗi đã sửa: lần đầu điểm đến sát cổng nên camera lọt vào thân cổng. Cổng đã dời ra thềm riêng.

## 5. Goal phát triển (tự đặt) — kết quả

- [x] **G-6.1 Thiên Thê:** thang mây ngoài tường Đông Sơn Môn ở (78, −50).
  - Chỗ được chọn bằng cách dò lưới va chạm tìm khoảng trống 16 × 24 m. Chỗ dự tính đầu (56, −163) kẹt giữa tường và nhà dân.
  - Gồm cổng đá, 18 bậc ngọc xoắn lên, cột sáng. Bấm «Bước lên thang mây» là lên Nam Thiên Môn.
  - Ảnh: `shots/heaven/g/01-thienthe2.png`, `02-thienthe3.png`.
- [x] **G-6.2 Tiên đồng, tiên nữ:**
  - 8 người trên lối quảng trường Quân Thiên, có lời chỉ đường và gợi ý phủ hợp mệnh. Chỉ thêm vào khi người chơi ở trên trời.
  - 6 hạc trắng bay vòng, gộp 1 lệnh vẽ.
  - Ảnh: `shots/heaven/g/04-tien.png`.
- [x] **G-6.3 Sổ nhà rõ ràng:**
  - Nha Môn lọc theo hạng (tiên phủ, biệt phủ, biệt thự, nhà phố), theo khu biệt thự, chỉ căn còn trống, hợp mệnh ≥ 4★.
  - Mỗi lần hiện 30 căn, có nút «Xem thêm».
  - Ảnh: `shots/heaven/g/03-nhamon.png`.

### Goal kế tiếp

- **G-6.4 Đo trên máy người chơi.** fps ở Cửu Trọng Thiên phải ≥ fps ở Sơn Môn trên cùng máy. Cần người dùng thử và gửi số.
