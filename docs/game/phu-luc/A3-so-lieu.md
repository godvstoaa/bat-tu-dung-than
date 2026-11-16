<!-- TỆP SINH TỰ ĐỘNG bởi scripts/docs-game-gen.mjs — KHÔNG SỬA TAY. Sinh lại: node scripts/docs-game-gen.mjs -->
# A3 · Số liệu hệ thống (hằng số và bảng dữ liệu của các mô-đun thuần)

> Sinh từ mã nguồn. Khi một con số ở chương khác lệch với tệp này thì **tệp này (tức là mã đang chạy) thắng** và chương kia phải sửa.

Mỗi mục là một mô-đun: bảng hai cột cho hằng số, rồi mỗi bảng dữ liệu một bảng. Ô dài bị cắt bằng «…»; cần đủ thì mở mã.

## 11 · Mệnh và nhân vật

### `progress.js`

**`GIATRI`** (5)

| id | lv | vip | name | desc |
|---|---|---|---|---|
| aura | 2 | true | Hào quang hộ thể | vòng sáng dưới chân theo màu hành |
| motes | 4 | true | Linh khí quanh thân | linh khí của hành bay quanh người |
| trail | 6 | true | Vệt sáng bộ pháp | để lại vệt sáng khi chạy |
| fly | 8 | true | Ngự kiếm phi hành | bay lượn trên kiếm, vượt núi sông |
| halo | 10 | false | Pháp quang sau lưng | vầng pháp quang lớn sau lưng |

**`WX_GIATRI`** (5)

| khoá | name | mote | color |
|---|---|---|---|
| 木 | Thanh Mộc | lá non | #58c46a |
| 火 | Ly Hỏa | đốm lửa | #ff6a3c |
| 土 | Hậu Thổ | bụi vàng | #d9a64a |
| 金 | Canh Kim | ánh kim | #f2e6b8 |
| 水 | Huyền Thủy | giọt nước | #4f9cff |

### `state.js`

| hằng số | giá trị |
|---|---|
| `CASES_PER_DAY` | 3 |
| `CASE_GAIN_CAP` | 60 |
| `CASE_REWARD` | {"npcMax":15,"classical":25} |
| `DESK_REWARD` | 15 |
| `HOME_DAILY_CAP` | 40 |
| `INCENSE_MS` | 180000 |
| `KEY` | huyenquan:v1 |
| `LAMP_REWARD` | {"first":10,"daily":3} |
| `STATION_IDS` | ["thay","compass","xam","huong","lich","tra","sen","trach","duongtrach","dieuhau","thuvien","hophon","tuvi","tuongphap","cachcuc","que","tangy","m_vanxuong","m_daumau","m_laoquan","vanbia","van0","van… |

**`ACHIEVEMENTS`** (12)

| id | name | desc |
|---|---|---|
| first_chart | Lần đầu gặp thầy | Lập lá số đầu tiên |
| family | Gia phả nhỏ | Có 3 hồ sơ trong Sổ Mệnh |
| compass | Biết đường về | Xem La Bàn Đài |
| first_stick | Thẻ đầu tiên | Nhận một thẻ xăm |
| top_stick | Thượng thượng | Nhận thẻ Thượng Thượng |
| patience | Kiên nhẫn | Ba lần keo chưa thuận trong một phiên |
| incense7 | Hương khói | Thắp nhang 7 ngày khác nhau |
| tea60 | Trà đạo | Tổng 60 phút ngồi trà |
| lantern5 | Đèn trôi | Thả 5 đèn hoa đăng |
| streak3 | Ba ngày liền | Chuỗi 3 ngày |
| streak7 | Một tuần thong thả | Chuỗi 7 ngày |
| walker | Dạo quán | Ghé đủ 34 gian |

**`CAPS`** (5)

| khoá | giá trị |
|---|---|
| teaPerDay | 15 |
| sticksPerDay | 3 |
| maxProfiles | 5 |
| keepSticks | 30 |
| keepLanterns | 50 |

**`REWARD`** (7)

| khoá | giá trị |
|---|---|
| chart | 10 |
| compass | 5 |
| stick | 3 |
| huong | 5 |
| lich | 2 |
| lantern | 3 |
| tasks | 5 |

**`TEAS`** (4)

| id | name | min | color |
|---|---|---|---|
| sen | Trà Sen | 0 | #c9b46a |
| lai | Trà Lài | 30 | #d8cf8c |
| olong | Trà Ô Long | 100 | #b0702c |
| shan | Trà Shan Tuyết | 250 | #8fa64a |

**`TITLES`** (5)

| min | name |
|---|---|
| 0 | Khách Vãng Lai |
| 30 | Khách Quen |
| 100 | Môn Sinh |
| 250 | Đệ Tử |
| 500 | Tri Âm Huyền Quán |

### `cosmetics.js`

| hằng số | giá trị |
|---|---|
| `CHECKIN` | [0,0,0,0,0,0,0] |
| `LEVEL_GIFT` | 0 |
| `RARITY` | [null,{"name":"Phàm","color":"#b9b2a4"},{"name":"Linh","color":"#6fd48a"},{"name":"Huyền","color":"#5aa8ff"},{"name":"Tiên","color":"#c58bff"},{"name":"Thần","color":"#ffc44a"}] |
| `SET_BONUS` | 0.1 |
| `VIP_DAILY` | 0 |

**`DEFAULT_EQUIP`** (5)

| khoá | giá trị |
|---|---|
| robe | y_menh |
| aura | aura_menh |
| trail | trail_menh |
| mount | kiem |
| frame | khung_tron |

**`ITEMS`** (64)

| id | slot | name | rarity | free | desc | price | look | unlock | set | sacred | waterWalk |
|---|---|---|---|---|---|---|---|---|---|---|---|
| y_menh | robe | Bản Mệnh Y | 1 | true | Áo theo Dụng thần, đai theo Hỷ thần — phẩm phục nhập môn. |  |  |  |  |  |  |
| y_bach | robe | Bạch Y Thư Sinh | 2 |  | Áo trắng đai lam, nhã như thư sinh lên kinh. | {"xu":144000} | {"pri":[0.12,0.06,0.96],"acc":[0.58,0.35,0.6]} |  |  |  |  |
| y_tu | robe | Tử Y Thượng Khách | 4 |  | Tử khí đông lai — áo tím của khách quý (VIP). | {"ngoc":380} | {"pri":[0.78,0.6,0.55],"acc":[0.12,0.7,0.9]} | {"vip":true} |  |  |  |
| y_moc | robe | Thanh Mộc Tiên Y | 3 |  | Lục tùng thêu lá liễu, đai vàng. | {"ngoc":160} | {"pri":[0.36,0.6,0.6],"acc":[0.12,0.7,0.85]} |  | moc |  |  |
| y_hoa | robe | Ly Hỏa Chân Bào | 3 |  | Đỏ son như lửa luyện đan. | {"ngoc":160} | {"pri":[0.99,0.82,0.8],"acc":[0.1,0.85,0.95]} |  | hoa |  |  |
| y_tho | robe | Hậu Thổ Đạo Bào | 3 |  | Hoàng bào đạo sĩ, vững như núi. | {"ngoc":160} | {"pri":[0.1,0.7,0.78],"acc":[0.06,0.6,0.45]} |  | tho |  |  |
| y_kim | robe | Canh Kim Kiếm Bào | 3 |  | Bạch kim ánh bạc của kiếm tu. | {"ngoc":160} | {"pri":[0.12,0.08,0.95],"acc":[0.12,0.25,0.75]} |  | kim |  |  |
| y_thuy | robe | Huyền Thủy Long Bào | 3 |  | Lam huyền thăm thẳm như vực rồng. | {"ngoc":160} | {"pri":[0.62,0.65,0.4],"acc":[0.52,0.55,0.8]} |  | thuy |  |  |
| y_tien_thanh | robe | Thanh Vân Tiên Y | 3 |  | Xanh mộc chuẩn thêu mây vàng thổ — áo tu hành thanh nhã. | {"ngoc":180} | {"pri":[0.36,0.72,0.58],"acc":[0.082,0.7,0.7]} |  |  |  |  |
| y_tien_lam | robe | Tích Thủy Tiên Y | 3 |  | Lam chuẩn thuỷ viền ánh bạc — sâu như nước thu. | {"ngoc":180} | {"pri":[0.616,0.68,0.62],"acc":[0.113,0.2,0.85]} |  |  |  |  |
| y_tu_tien | robe | Vân Du Tiên Bào | 4 |  | Bạch ngân bào (#cfc8b8) viền vàng thổ (#c99a4a) — phong thái tiên khách vân du. | {"ngoc":260} | {"pri":[0.113,0.2,0.92],"acc":[0.082,0.75,0.72]} |  | tucien |  |  |
| tram_go | head | Trâm Gỗ Đào | 1 |  | Trâm gỗ đào cài búi tóc — trừ tà, giữ tâm. | {"xu":36000} |  |  |  |  |  |
| dao_quan | head | Ngân Đạo Quan | 3 |  | Đạo quan bạc cài búi, đạo sĩ chính tông. | {"ngoc":120} |  |  | kim |  |  |
| quan_la | head | Liễu Diệp Quan | 3 |  | Vòng lá liễu xanh quanh búi tóc. | {"ngoc":120} |  |  | moc |  |  |
| kim_quan | head | Tử Kim Quan · Lông Trĩ | 4 |  | Kim quan cắm đôi lông trĩ dài — phong thái tướng quân. | {"ngoc":220} |  |  | hoa |  |  |
| dau_lap | head | Đấu Lạp Mạng Sa | 3 |  | Nón lá rộng vành buông mạng — giang hồ ẩn sĩ. | {"ngoc":120} |  |  | tho |  |  |
| tram_ngoc | head | Bích Ngọc Trâm | 3 |  | Trâm ngọc lam rủ tua châu. | {"ngoc":120} |  |  | thuy |  |  |
| quan_sen | head | Mũ Sen Vàng | 5 |  | Mũ sen vàng — nhận bằng tu tập: cấp 10. | {"xu":900000} |  | {"level":10} |  | true |  |
| khan_tran | head | Khăn Trán Tiểu Nhị | 1 |  | Khăn trán đỏ sẫm buộc sau gáy — tiểu nhị chạy bàn. | {"xu":30000} |  |  |  |  |  |
| non_la | head | Nón Lá Giang Hồ | 1 |  | Nón lá rộng vành vành tre quai cằm — che nắng đường xa. | {"xu":42000} |  |  |  |  |  |
| ngoc_quan | head | Ngân Ngọc Đạo Quan | 4 |  | Đạo quan bạc gắn ngọc bích — chính thống tiên môn. | {"ngoc":220} |  |  | tucien |  |  |
| kiem_go | back | Kiếm Gỗ Đào | 1 |  | Thanh kiếm gỗ đào đeo chéo lưng. | {"xu":72000} |  |  |  |  |  |
| kiem_moc | back | Thanh Trúc Kiếm | 3 |  | Kiếm bao trúc xanh. | {"ngoc":140} |  |  | moc |  |  |
| ho_lo | back | Tử Kim Hồ Lô | 3 |  | Hồ lô đựng đan dược, đeo bên hông lưng. | {"ngoc":140} |  |  | tho |  |  |
| kiem_bao | back | Song Kiếm Hàn Quang | 4 |  | Đôi kiếm bạc bắt chéo sau lưng. | {"ngoc":240} |  |  | kim |  |  |
| o_giay | back | Ô Giấy Dầu Vẽ Sen | 3 |  | Ô giấy dầu xếp gọn đeo lưng. | {"ngoc":140} |  |  | thuy |  |  |
| canh_phuong | back | Phượng Hỏa Dực | 4 |  | Đôi cánh lửa phượng hoàng khẽ đập. | {"ngoc":320} |  |  | hoa |  |  |
| canh_hac | back | Tiên Hạc Dực | 4 |  | Đôi cánh hạc trắng viền đen. | {"ngoc":320} |  |  |  |  |  |
| phap_luan | back | Bát Quái Kim Hoàn | 5 |  | Vòng bát quái vàng xoay sau lưng — nhận bằng tu tập: cấp 12. | {"xu":960000} |  | {"level":12} |  | true |  |
| tui_vai | back | Túi Vải Hành Trang | 1 |  | Túi vải thô lòi tói buộc miệng — đựng đồ đường dài. | {"xu":66000} |  |  |  |  |  |
| binh_ruou | back | Bình Rượu Hồ Lô | 2 |  | Hồ lô vàng hổ phách nút gỗ đeo hông — bạn đường khách giang hồ. | {"xu":144000} |  |  |  |  |  |
| ong_quyen | back | Ống Quyển Trúc Giản | 3 |  | Ống gỗ đựng thư quyến, dây đỏ rủ ngọc ấn. | {"ngoc":150} |  |  | tucien |  |  |
| quat_giay | hand | Quạt Giấy Thư Pháp | 1 |  | Quạt giấy viết chữ «道». | {"xu":54000} |  |  |  |  |  |
| phat_tran | hand | Phất Trần Bạch Vĩ | 2 |  | Phất trần lông trắng của đạo sĩ. | {"xu":156000} |  |  |  |  |  |
| den_long_tay | hand | Đăng Lung Dạ Hành | 2 |  | Đèn lồng cầm tay, sáng thật khi đêm. | {"xu":156000} |  |  |  |  |  |
| la_ban_tay | hand | La Bàn Tam Hợp | 3 |  | La bàn đồng cầm tay của thầy địa lý. | {"ngoc":130} |  |  |  |  |  |
| quat_long | hand | Vũ Phiến Gia Cát | 4 |  | Quạt lông trắng của quân sư. | {"ngoc":260} |  |  |  |  |  |
| trang_hat | hand | Tràng Hạt Ngọc | 3 |  | Chuỗi hạt ngọc xen vàng cầm tay — tĩnh tâm mỗi bước. | {"ngoc":160} |  |  | tucien |  |  |
| aura_menh | aura | Gia Trì Bản Mệnh | 1 | true | Hào quang theo hành Dụng thần (mở theo cấp). |  |  |  |  |  |  |
| aura_dao | aura | Đào Hoa Phi Vũ | 3 |  | Cánh đào bay quanh người. | {"ngoc":150} |  |  | moc |  |  |
| aura_lua | aura | Tam Muội Chân Hỏa | 4 |  | Lửa tam muội bốc dưới chân. | {"ngoc":260} |  |  | hoa |  |  |
| aura_batquai | aura | Bát Quái Trận | 4 |  | Trận bát quái vàng xoay dưới chân. | {"ngoc":260} |  |  | tho |  |  |
| aura_set | aura | Cửu Thiên Lôi Quang | 4 |  | Tia sét tím lách tách quanh thân. | {"ngoc":260} |  |  | kim |  |  |
| aura_tuyet | aura | Hàn Tuyết Phiêu | 3 |  | Tuyết bay lả tả quanh người. | {"ngoc":150} |  |  | thuy |  |  |
| aura_sen | aura | Vệt Sen Vàng | 5 |  | Sen vàng nở dưới chân — nhận bằng tu tập: cấp 8. | {"xu":840000} |  | {"level":8} |  | true |  |
| trail_menh | trail | Bộ Pháp Bản Mệnh | 1 | true | Vệt sáng theo hành (mở ở cấp 6). |  |  |  |  |  |  |
| hai_ho_than | trail | Hài Hộ Thân | 3 |  | Hài thêu phù thủy văn — bước trên mặt nước như trên đất, bọt nước bắn nhẹ theo chân. | {"ngoc":300} |  |  |  |  | true |
| dinh_thuy_chau | trail | Định Thủy Châu | 4 |  | Ngọc trấn thủy — mỗi bước trên nước nở một đài sen (Bộ Bộ Sinh Liên). | {"ngoc":600} |  |  |  |  | true |
| trail_may | trail | Đằng Vân Bộ | 2 |  | Mây trắng cuộn theo bước chân. | {"xu":180000} |  |  |  |  |  |
| trail_sen | trail | Liên Hoa Bộ | 3 |  | Cánh sen hồng rơi theo bước. | {"ngoc":120} |  |  |  |  |  |
| trail_lua | trail | Hỏa Vân Bộ | 3 |  | Đốm lửa bám gót. | {"ngoc":120} |  |  |  |  |  |
| trail_bang | trail | Băng Phách Bộ | 3 |  | Tinh thể băng lấp lánh. | {"ngoc":120} |  |  |  |  |  |
| trail_sao | trail | Tinh Hà Bộ | 4 |  | Bụi sao vàng lấp lánh như dải ngân hà. | {"ngoc":220} |  |  |  |  |  |
| kiem | mount | Ngự Kiếm | 1 | true | Thanh kiếm bay dưới chân. |  |  |  |  |  |  |
| may | mount | Cân Đẩu Vân | 3 |  | Cưỡi mây cân đẩu. | {"ngoc":200} |  |  |  |  |  |
| ho_lo_bay | mount | Hồ Lô Phi Hành | 3 |  | Cưỡi hồ lô tím vàng. | {"ngoc":200} |  |  |  |  |  |
| dai_sen | mount | Đài Sen Mây | 4 |  | Đứng trên đài sen vàng — nhận bằng tu tập: cấp 6. | {"xu":540000} |  | {"level":6} |  | true |  |
| duc | mount | Ngũ Hành Dực | 4 |  | Đôi cánh năng lượng theo hành Dụng thần — lơ lửng tự do, bụi sao lấp lánh. | {"ngoc":420} |  |  |  |  |  |
| hac | mount | Tiên Hạc | 5 |  | Cưỡi hạc trắng sải cánh — VIP. | {"ngoc":780} |  | {"vip":true} |  |  |  |
| khung_tron | frame | Khung Mộc | 1 | true | Khung tên mặc định. |  |  |  |  |  |  |
| khung_may | frame | Tường Vân | 2 |  | Viền mây lành. | {"xu":108000} |  |  |  |  |  |
| khung_sen | frame | Liên Đài | 3 |  | Viền sen hồng. | {"ngoc":90} |  |  |  |  |  |
| khung_ngoc | frame | Bích Ngọc | 3 |  | Viền ngọc bích. | {"ngoc":90} |  |  |  |  |  |
| khung_long | frame | Kim Long | 5 |  | Viền rồng vàng — điểm danh 7 ngày liền. | {"ngoc":480} |  | {"streak":7} |  |  |  |

**`SETS`** (6)

| id | wx | name | pieces |
|---|---|---|---|
| moc | 木 | Thanh Mộc Tiên Tông | ["y_moc","quan_la","kiem_moc","aura_dao"] |
| hoa | 火 | Ly Hỏa Chân Tông | ["y_hoa","kim_quan","canh_phuong","aura_lua"] |
| tho | 土 | Hậu Thổ Đạo Tông | ["y_tho","dau_lap","ho_lo","aura_batquai"] |
| kim | 金 | Canh Kim Kiếm Tông | ["y_kim","dao_quan","kiem_bao","aura_set"] |
| thuy | 水 | Huyền Thủy Long Tông | ["y_thuy","tram_ngoc","o_giay","aura_tuyet"] |
| tucien | 金 | Vân Du Tiên Môn | ["y_tu_tien","ngoc_quan","ong_quyen","trang_hat"] |

**`SLOTS`** (8)

| id | name | icon |
|---|---|---|
| robe | Phẩm phục | 👘 |
| head | Mũ · trâm | 👑 |
| back | Sau lưng | 🗡️ |
| hand | Cầm tay | 🪭 |
| aura | Hào quang | ✨ |
| trail | Vệt bước | 👣 |
| mount | Ngự vật | ☁️ |
| frame | Khung tên | 🏷️ |

### `tutorial.js`

**`STEPS`** (8)

| id | event | title | hint | reward | station |
|---|---|---|---|---|---|
| chart | chart | Lập lá số | Khắc bát tự của bạn ở cổng quán — mọi thầy bói trong thành sẽ xem theo lá số này. | 5 |  |
| ask | askMaster | Hỏi Thầy Tử Bình một câu | Tới Bàn Thầy Tử Bình ở Sơn Môn, gõ bất kỳ câu hỏi nào về đời mình — thầy trả lời theo lá s… | 10 | thay |
| que | que | Xem quẻ ngày | Mở Bảng Lịch xem hôm nay thuận hay nên thủ, giờ nào tốt. | 5 | lich |
| travel | travel | Đi xe ngựa | Thành rộng hơn 4 km — bấm bản đồ nhỏ góc trên bên phải, chọn một trạm xe ngựa (chấm đỏ) để… | 5 |  |
| buy | buy | Mua một món ở tiệm | Nhà mặt đường là cửa hàng — vào một tiệm, hỏi chủ tiệm và mua thử một món. | 5 |  |
| shift | shift | Nhận một ca việc | Mỗi tiệm treo bảng Chiêu công sát cửa — nhận một ca để kiếm tiền. | 5 |  |
| pray | pray | Thắp hương ở một miếu | Mỗi miếu thờ một vị thần, có thầy giữ miếu xem bói riêng (xin xăm, tài vận, hạn năm…). | 5 |  |
| estate | estate | Xem một căn nhà rao bán | Nhà treo biển BÁN — vào xem giá, mua về bày phong thủy để mỗi ngày nhận Phúc Khí. | 10 |  |

### `spawn.js`

**`WARD_OF_WX`** (5)

| khoá | giá trị |
|---|---|
| 水 | kan |
| 木 | zhen |
| 火 | li |
| 土 | gen |
| 金 | qian |

**`WX_VI`** (5)

| khoá | giá trị |
|---|---|
| 水 | Thủy |
| 木 | Mộc |
| 火 | Hỏa |
| 土 | Thổ |
| 金 | Kim |

### `features.js`

| hằng số | giá trị |
|---|---|
| `IOS` | false |

**`FEATURES`** (6)

| khoá | giá trị |
|---|---|
| stations | ["thay","compass","xam","huong","lich","tra","sen","an0","an1","an2","trach","duongtrach",… |
| divination | true |
| wishes | true |
| ai | true |
| personaAi | false |
| gamePersona | true |

**Phúc Khí tích lũy cần cho từng cấp** (`progress.xpFor`)

| cấp | Phúc Khí tích lũy |
|---|---|
| 1 | 0 |
| 2 | 20 |
| 3 | 80 |
| 4 | 180 |
| 5 | 320 |
| 6 | 500 |
| 7 | 720 |
| 8 | 980 |
| 9 | 1280 |
| 10 | 1620 |
| 12 | 2420 |
| 15 | 3920 |
| 20 | 7220 |
| 25 | 11520 |
| 30 | 16820 |
| 35 | 23120 |
| 40 | 30420 |
| 45 | 38720 |
| 50 | 48020 |

## 12 · Bói toán và nội dung

### `fortune-npc.js`

| hằng số | giá trị |
|---|---|
| `GUEST_DAILY` | 10 |

**`MASTERS`** (13)

| khoá | name | persona | focus | greet | starters |
|---|---|---|---|---|---|
| tubinh | Thầy Tử Bình | thay_tubinh | bát tự tứ trụ, dụng thần, đại vận, lưu niên | Ngồi đi. Lá số của khách thầy đã bày trên bàn. Muốn hỏi chuyện gì — công danh, tiền bạc, g… | ["Năm nay vận của tôi thế nào?","Tôi hợp làm nghề gì?","Tính cách thật của tôi ra sao?","Đ… |
| tuvi | Khổng tiên sinh | khong_tiensinh | lá số tử vi đẩu số, mệnh cung, các cung, sao chiếu | Khách ngồi. Ta xem tử vi không lấy tiền — chỉ lấy câu hỏi thật. Cung nào trong đời khách đ… | ["Cung mệnh của tôi có sao gì?","Cung tài bạch nói gì về tiền của tôi?","Cung phu thê của … |
| phongthuy | Thầy Phong Thủy |  | phong thủy nhà ở theo mệnh: bát trạch, hướng nhà, hướng cửa, kê giường, bàn làm việc, bếp | Mệnh quái của khách thầy đã tính. Khách đang ở nhà hướng nào, hay định mua, định sửa nhà? | ["Nhà tôi nên quay hướng nào?","Giường ngủ kê ở đâu là tốt?","Bàn làm việc nên đặt hướng n… |
| trachnhat | Trương Thiên Sư | truong_thiensu | chọn ngày giờ tốt theo lá số, giờ hoàng đạo, hạn năm, Thái Tuế, giải hạn | Việc lớn chọn ngày, việc nhỏ chọn giờ. Khách định làm việc gì, vào khoảng thời gian nào? | ["Tháng này ngày nào tốt để khai trương?","Năm nay tôi có phạm Thái Tuế không?","Hạn năm n… |
| nguyetlao | Bà Nguyệt Lão |  | tình duyên, hôn nhân, hợp tuổi, thời điểm gặp duyên theo lá số | Sợi chỉ hồng của cháu bà thấy rồi. Cháu hỏi về người đang thương, hay hỏi bao giờ mới gặp? | ["Bao giờ tôi gặp được duyên?","Tôi hợp với người tuổi gì?","Hôn nhân của tôi có bền không… |
| gieoque | Phương sĩ Vô Danh | phuong_si | gieo quẻ Mai Hoa, Lục Hào cho một việc cụ thể, đối chiếu với lá số | Có việc gì đang vướng thì nói ra, ta gieo cho một quẻ. Hỏi một việc cho rõ — đừng hỏi cả đ… | ["Gieo cho tôi một quẻ về công việc sắp tới.","Việc tôi đang tính có nên làm không?","Quẻ … |
| quanam | Ni sư Diệu Âm | dieu_am | giải xăm Quan Âm theo lá số, tâm an, gia đạo, việc đang lo | A Di Đà Phật. Thí chủ xin được quẻ xăm nào thì đọc cho bần ni nghe, hoặc cứ kể điều đang l… | ["Giải giúp tôi quẻ xăm vừa xin.","Gia đạo tôi năm nay có yên không?","Tôi nên buông bỏ đi… |
| thantai | Ông Từ miếu Thần Tài |  | tài vận theo lá số: sao tài, lưu niên tài lộc, cách giữ tiền, thời điểm làm ăn | Thắp nén nhang cho Thần Tài rồi ngồi đây. Khách muốn hỏi lộc buôn bán, lương bổng hay chuy… | ["Năm nay tài lộc của tôi thế nào?","Tôi hợp kiếm tiền bằng nghề gì?","Tháng nào nên làm ă… |
| thanhhoang | Phán quan Thôi | phan_quan | hạn năm, Thái Tuế, sao hạn, cách giải hạn theo lá số | Sổ hạn năm nay của khách ta đã mở. Hỏi đi — ta nói thẳng chỗ nào cần giữ. | ["Năm nay tôi có phạm Thái Tuế không?","Hạn năm nay của tôi nặng ở đâu?","Tôi nên làm gì đ… |
| vanxuong | Tế tửu Chu Văn Trinh | te_tuu | học hành, thi cử, văn chương, công danh theo lá số; dạy cách đọc bát tự / tử vi | Học trò đến hỏi việc thi, hay muốn học đọc lá số? Hỏi gì cũng được, miễn hỏi cho thật. | ["Tôi học ngành gì thì hợp?","Kỳ thi sắp tới của tôi thế nào?","Dạy tôi cách đọc dụng thần… |
| thodia | Ông Thổ Địa |  | phong thủy nhà ở, đất đai, mua bán nhà, hướng nhà hợp mệnh | Đất có Thổ Công, nhà có chủ. Khách định mua nhà, sửa nhà hay hỏi hướng nhà đang ở? | ["Nhà tôi hướng nào là hợp?","Năm nay có nên mua nhà không?","Sửa nhà tháng nào thì tốt?",… |
| duocvuong | Đan Đỉnh chân nhân | dan_dinh | sức khỏe theo ngũ hành lá số (thể tạng, mùa cần giữ), không khuyên y tế thật | Lò ta giờ chỉ nấu cháo gừng. Ngũ hành của khách lệch chỗ nào thì ta nói cách sống cho thuậ… | ["Ngũ hành của tôi thiếu gì?","Mùa nào tôi cần giữ sức khỏe?","Tôi nên ăn uống thế nào cho… |
| taoquan | Ông Táo |  | chọn ngày giờ cho việc lớn trong nhà: cưới hỏi, nhập trạch, khai trương, động thổ | Việc trong nhà ông Táo biết hết. Khách sắp làm việc lớn gì — cưới hỏi, dọn nhà, khai trươn… | ["Tháng tới ngày nào tốt để dọn nhà?","Năm nay có nên cưới không?","Ngày nào hợp khai trươ… |

**`MASTER_OF_STATION`** (11)

| khoá | giá trị |
|---|---|
| thay | tubinh |
| tuvi | tuvi |
| compass | phongthuy |
| duongtrach | phongthuy |
| trach | trachnhat |
| thaitue | trachnhat |
| hophon | nguyetlao |
| que | gieoque |
| cachcuc | tubinh |
| dieuhau | tubinh |
| tuongphap | gieoque |

### `temples.js`

| hằng số | giá trị |
|---|---|
| `GOD_OF_NB` | ["thanhhoang","thodia","vanxuong","quanam"] |

**`GODS`** (8)

| khoá | name | hall | master | ritual | ritualLabel | lines |
|---|---|---|---|---|---|---|
| quanam | Quan Âm | Quán Âm Các | quanam | xam | 🎋 Xin xăm Quan Âm | ["Xin xăm rồi nhờ ni sư giải theo lá số.","Lòng thành thì quẻ linh.","Mùng một, ngày rằm n… |
| thantai | Thần Tài | Miếu Thần Tài | thantai | lich | 📅 Xem ngày tốt làm ăn | ["Thắp nhang Thần Tài đầu ngày, buôn bán đắt hàng.","Lộc đến từ chữ tín.","Hỏi tài vận thì… |
| nguyetlao | Nguyệt Lão | Miếu Nguyệt Lão | nguyetlao | hophon | 💞 Xem hợp hôn | ["Sợi chỉ hồng đã buộc thì không ai cắt được.","Xin duyên thì phải thật lòng.","Hỏi tuổi n… |
| thanhhoang | Thành Hoàng | Miếu Thành Hoàng | thanhhoang | thaitue | 🏮 An Thái Tuế · xem hạn năm | ["Thành Hoàng giữ sổ cả thành.","Năm hạn thì làm việc thiện mà giải.","Đầu năm nhớ lên đây… |
| vanxuong | Văn Xương | Văn Xương Từ | vanxuong | ancổ | 📚 Học Án Cổ (lá số kinh điển) | ["Học trò đi thi hay ghé thắp hương.","Chữ nghĩa là của để dành.","Muốn học đọc lá số thì … |
| thodia | Thổ Địa | Miếu Thổ Địa | thodia | compass | 🧭 La bàn hướng nhà | ["Đất lành chim đậu.","Mua đất làm nhà thì lên khấn Thổ Công.","Hướng nhà hợp mệnh thì gia… |
| duocvuong | Dược Vương | Miếu Dược Vương | duocvuong | tra | 🍵 Ngồi uống trà dưỡng sinh | ["Thuận ngũ hành thì ít bệnh.","Bệnh thật thì đi thầy thuốc, ở đây chỉ dạy cách sống.","Sá… |
| taoquan | Táo Quân | Miếu Táo Quân | taoquan | lich | 📅 Lịch ngày giờ | ["Việc trong nhà ông Táo biết hết.","Hai mươi ba tháng Chạp tiễn ông Táo về trời.","Chọn n… |

**`GOD_OF_WARD`** (8)

| khoá | giá trị |
|---|---|
| kan | quanam |
| xun | thantai |
| kun | nguyetlao |
| qian | thanhhoang |
| dui | vanxuong |
| gen | thodia |
| zhen | duocvuong |
| li | taoquan |

### `homes.js`

| hằng số | giá trị |
|---|---|
| `FORTUNE_ROTA` | ["tubinh","tuvi","phongthuy","trachnhat","nguyetlao","gieoque"] |

### `map-rating.js`

| hằng số | giá trị |
|---|---|
| `FORBIDDEN` | ["đại hung","tai họa","tai hoạ","chết"] |
| `SOFT_LABELS` | {"thuan":"Thuận — nên làm","binh":"Bình thường","giu":"Nên thủ, giữ sức"} |
| `TONE_ORDER` | ["thuan","binh","giu"] |

**`RATING_LEVELS`** (6)

| min | rating |
|---|---|
| 70 | Đại cát |
| 56 | Cát |
| 36 | Bình |
| 22 | Hơi kỵ |
| 10 | Hung |
| -Infinity | Đại hung |

**`TONE_OF`** (6)

| khoá | giá trị |
|---|---|
| Đại cát | thuan |
| Cát | thuan |
| Bình | binh |
| Hơi kỵ | giu |
| Hung | giu |
| Đại hung | giu |

### `divination.js`

| hằng số | giá trị |
|---|---|
| `D` | 86400000 |
| `DEPOSIT` | 2000 |
| `DUE_MS` | 86400000 |
| `H` | 3600000 |
| `HOLD_MS` | 86400000 |
| `KEEP_PROFILE` | 2592000000 |
| `LEN` | [300,4000] |
| `MIN_FEE` | 50 |
| `PAIR_MS` | 604800000 |
| `PER_DAY` | 10 |
| `Q_MAX` | 500 |
| `REVIEW_MS` | 259200000 |

**`EXAM`** (3)

| id | pillars | dm | strong | yong | note |
|---|---|---|---|---|---|
| e1 | Giáp Tý · Bính Dần · Mậu Ngọ · Canh Thân | Mậu Thổ | thân vượng | 金 | Thổ dày, Hỏa sinh — cần tiết khí. |
| e2 | Nhâm Thìn · Quý Hợi · Đinh Sửu · Tân Hợi | Đinh Hỏa | thân nhược | 木 | Thủy vượng khắc Hỏa — cần ấn sinh thân. |
| e3 | Ất Mão · Kỷ Mão · Giáp Dần · Ất Hợi | Giáp Mộc | thân vượng | 火 | Mộc quá vượng — cần thực thương tiết tú. |

**`RANKS`** (3)

| id | name | rep | max | tax |
|---|---|---|---|---|
| so | Sơ cấp | 0 | 300 | 0.2 |
| trung | Trung cấp | 60 | 1000 | 0.17 |
| cao | Cao cấp | 85 | 3000 | 0.15 |

### `cases.js`

| hằng số | giá trị |
|---|---|
| `STEP_ORDER` | ["pillars","wx","strength","yong","timing","advice"] |
| `COOP_STEP_POINTS` | 20 |

**`STEP_TITLE`** (7)

| khoá | giá trị |
|---|---|
| pillars | Lập trụ |
| wx | Đếm ngũ hành |
| strength | Vượng hay nhược |
| yong | Tìm Dụng thần |
| timing | Chọn năm thuận |
| advice | Lời khuyên |
| ge | Định cách cục |

**`STEP_WEIGHTS`** (6)

| khoá | giá trị |
|---|---|
| pillars | 0.2 |
| wx | 0.1 |
| strength | 0.2 |
| yong | 0.25 |
| timing | 0.1 |
| advice | 0.15 |

**`SKILL_VI`** (7)

| khoá | giá trị |
|---|---|
| pillars | Lập trụ |
| wx | Ngũ hành |
| strength | Vượng nhược |
| yong | Dụng thần |
| timing | Ứng kỳ |
| advice | Lời khuyên |
| ge | Cách cục |

### `dz-case.js`

| hằng số | giá trị |
|---|---|
| `DZ_STEPS` | ["menh","cua","giuong","nien"] |

**`DZ_TITLE`** (4)

| khoá | giá trị |
|---|---|
| menh | Tính mệnh quái |
| cua | Đọc cửa chính |
| giuong | Chọn cung kê giường |
| nien | Tránh Ngũ Hoàng năm nay |

### `zheri-case.js`

| hằng số | giá trị |
|---|---|
| `ZHERI_STEPS` | ["xung","truc","pick"] |
| `ZHERI_TITLE` | {"xung":"Lọc ngày xung tuổi","truc":"Nhận trực Hoàng đạo","pick":"Chọn ngày"} |

**`JOB_VI`** (6)

| khoá | giá trị |
|---|---|
| marry | cưới hỏi |
| business | khai trương |
| move | nhập trạch |
| build | động thổ |
| sign | ký kết |
| travel | xuất hành |

### `vanmenh.js`

| hằng số | giá trị |
|---|---|
| `VAN_GATES` | 9 |

### `namhan.js`

**`SOFT_RATING`** (6)

| khoá | tone | text |
|---|---|---|
| Đại cát | thuan | thuận — nên làm |
| Cát | thuan | thuận — nên làm |
| Bình | binh | bình thường |
| Hơi kỵ | thu | nên thủ, giữ sức |
| Hung | thu | nên thủ, giữ sức |
| Đại hung | thu | nên thủ, giữ sức |

## 13 · Đời sống: tiền và sinh tồn

### `coins.js`

| hằng số | giá trị |
|---|---|
| `BAC` | 100000 |
| `DONG` | 100 |
| `HAO` | 10 |
| `VANG` | 1000000 |
| `XU` | 1 |

**`PHUC_RATE`** (5)

| khoá | giá trị |
|---|---|
| use | 400 |
| decor | 600 |
| cosmetic | 600 |
| service | 400 |
| fine | 400 |

**`UNITS`** (5)

| id | name | short | icon | v |
|---|---|---|---|---|
| vang | lượng vàng | V | 🟡 | 1000000 |
| bac | lượng bạc | B | ⚪ | 100000 |
| dong | đồng | Đ | 🟤 | 100 |
| hao | hào | h |  | 10 |
| xu | xu | x |  | 1 |

### `life.js`

| hằng số | giá trị |
|---|---|
| `BANK_FEE` | 0.005 |
| `BED_NIGHT_MS` | 43200000 |
| `FAINT_FEE` | 300 |
| `LUONG` | 1000 |
| `NIGHT_WAKE` | 2 |
| `START_VAN` | 300 |
| `TAX` | [[1000,0],[10000,5],[100000,30],[1000000,200]] |

**`ACT`** (6)

| khoá | giá trị |
|---|---|
| idle | 1 |
| walk | 1 |
| run | 1.5 |
| swim | 1.5 |
| carry | 1.3 |
| work | 1.3 |

**`FOOD`** (9)

| khoá | name | price | full | icon | wake | cap | hp |
|---|---|---|---|---|---|---|---|
| com | Cơm bình dân | 15 | 35 | 🍚 |  |  |  |
| banhbao | Bánh bao | 6 | 15 | 🥟 |  |  |  |
| mi | Mì nước | 10 | 25 | 🍜 |  |  |  |
| nuoc | Bát nước vối | 2 | 2 | 🥣 | 2 |  |  |
| tra | Trà nóng | 5 |  | 🍵 | 8 | 2 |  |
| tiec | Bữa tửu lâu | 60 | 60 | 🍲 |  |  | 5 |
| ruou | Bầu rượu ấm | 25 | 5 | 🍶 | -4 |  | 3 |
| lienhoa | Trà liên hoa thượng hạng | 40 |  | 🪷 | 15 | 2 | 4 |
| dimsum | Điểm tâm trà lâu | 22 | 22 | 🥮 | 3 |  |  |

**`LODGING`** (5)

| khoá | name | price | wake | ill | rob | hp |
|---|---|---|---|---|---|---|
| street | Ngủ bờ ngủ bụi | 0 | 6 | 0.15 | 0.05 |  |
| dorm | Giường chung liêu xá | 30 | 9 | 0.05 |  |  |
| room | Phòng đơn khách điếm | 80 | 12 |  |  | 5 |
| house | Nhà riêng | 0 | 14 |  |  |  |
| villa | Biệt thự · biệt phủ | 0 | 16 |  |  | 10 |

**`MENUS`** (4)

| khoá | giá trị |
|---|---|
| stall | ["com","banhbao","mi","nuoc"] |
| tuu | ["com","mi","tiec","ruou"] |
| tralau | ["tra","dimsum","lienhoa","banhbao"] |
| tratrang | ["tra","lienhoa"] |

**`OFFLINE`** (4)

| khoá | giá trị |
|---|---|
| factor | 0.25 |
| floorFull | 30 |
| floorHp | 40 |
| maxSleepH | 8 |

**`RATE`** (4)

| khoá | giá trị |
|---|---|
| full | 10 |
| wake | 7 |
| hpLow | 4 |
| hpRegen | 2 |

### `illness.js`

| hằng số | giá trị |
|---|---|
| `CURE_MS` | [900000,2700000] |
| `DEBT_CAP` | 3 |
| `DEBT_COURT` | 1000 |
| `DEBT_DAYS` | 7 |
| `DEBT_RATE` | 0.02 |
| `EXAM` | 80 |
| `ORE_DONG` | 15 |
| `SELF_HEAL_H` | 6 |

**`ILLS`** (6)

| khoá | name | note | organ | wx | mild | drug |
|---|---|---|---|---|---|---|
| phonghan | Phong hàn | cảm sốt | Phế | 金 | true | [150,420] |
| suynhuoc | Suy nhược | đói, mệt kéo dài | Tỳ | 土 |  | [320,320] |
| chanthuong | Chấn thương | ngã, tai nạn lao động |  |  |  | [900,1200] |
| ngodoc | Ngộ độc | ăn đồ ôi | Tỳ | 土 | true | [150,380] |
| tamhoa | Tâm hỏa | mất ngủ, thức trắng | Tâm | 火 |  | [450,450] |
| hanthap | Hàn thấp | đau xương, ẩm lạnh | Thận | 水 |  | [600,600] |

### `lifeplaces.js`

| hằng số | giá trị |
|---|---|
| `KEY` | life:sonmon |
| `TAVERN_DOOR` | {"x":16.8,"z":120} |
| `WATER_DIST` | 29.217118269945782 |
| `WELL` | {"x":74,"z":73,"r":1.3} |

**`DORM`** (5)

| khoá | giá trị |
|---|---|
| x | 44 |
| z | 89 |
| ry | -1.5707963267948966 |
| w | 15 |
| d | 11 |

**`SPOTS`** (4)

| id | kind | name | verb | x | z | r | menu |
|---|---|---|---|---|---|---|---|
| stall | life | Quầy cơm Sơn Môn | Ăn ở quầy cơm · giao nước | 42.4 | 74 | 2.6 | stall |
| dorm | life | Liêu xá Sơn Môn | Thuê chỗ ngủ · ngủ | 36.9 | 89 | 2.6 |  |
| well | life | Giếng Đông | Múc nước gánh về quầy cơm | 71.6 | 73 | 2.4 |  |
| tavern | life | Hỏa Vân Tửu Lâu | Gọi món ở tửu lâu | 16.8 | 120 | 2.8 | tuu |

**`STALL`** (5)

| khoá | giá trị |
|---|---|
| x | 38 |
| z | 74 |
| ry | 1.5707963267948966 |
| w | 6 |
| d | 4 |

## 14 · Việc làm

### `jobs.js`

| hằng số | giá trị |
|---|---|
| `HOUR_LUCK` | 1.15 |
| `MINE_SHOP` | loren |

**`JOBS`** (1)

| khoá | id | name | wx | base | wakeCost | xp | desc |
|---|---|---|---|---|---|---|---|
| ganhnuoc | ganhnuoc | Gánh nước | 水 | 0.36 | 0.17 | 1 | Múc nước ở giếng ngoài Sơn Môn, gánh về quầy cơm. Đi đều chân thì nước không sánh — chạy l… |

**`JOB_OF_SHOP`** (15)

| khoá | giá trị |
|---|---|
| tuu | bep |
| dichtram | phu |
| duoc | boc |
| gom | gom |
| den | den |
| huong | huong |
| tralau | tra |
| tratrang | cantra |
| may | may |
| hoavien | vuon |
| moc | moc |
| thuhoa | chep |
| loren | ren |
| namon | moigioi |
| phongthuy | phongthuy |

**`RANKS`** (4)

| id | name | skill | pay | rep |
|---|---|---|---|---|
| 0 | Học việc | 0 | 0.8 |  |
| 1 | Thợ | 100 | 1 |  |
| 2 | Thợ cả | 400 | 1.25 |  |
| 3 | Quản sự | 1200 | 1.5 | 60 |

**`REL`** (4)

| khoá | name | pay | wake | xp | risk | perfCap | note |
|---|---|---|---|---|---|---|---|
| dung | Dụng thần | 2 | 1 | 1 | 0 | 1.5 | Nghề hợp Dụng thần — thu nhập gấp đôi, hay gặp may. |
| hy | Hỷ thần | 1.3 | 0.7 | 1.6 | 0 | 1.5 | Nghề hợp Hỷ thần — ít mệt, lên tay nghề nhanh. |
| thuong | Bình thường | 1 | 1 | 1 | 0 | 1.5 | Nghề bình thường với mệnh của bạn. |
| ky | Kỵ thần | 0.5 | 2 | 0.5 | 0.07 | 0.6 | Nghề phạm Kỵ thần — mệt gấp đôi, dễ gặp rủi ro, khó khá lên. |

**`SEATS`** (15)

| khoá | giá trị |
|---|---|
| tuu | [3,3,1,1] |
| dichtram | [2,3,1,1] |
| duoc | [2,2,1,1] |
| gom | [2,2,1,0] |
| den | [2,2,1,0] |
| huong | [2,2,1,0] |
| tralau | [2,2,1,1] |
| tratrang | [2,2,1,0] |
| may | [2,2,1,1] |
| hoavien | [2,2,1,0] |
| moc | [2,2,1,1] |
| thuhoa | [2,2,1,0] |
| loren | [2,2,1,1] |
| namon | [1,2,1,1] |
| phongthuy | [1,1,1,1] |

**`SHIFT`** (12)

| khoá | giá trị |
|---|---|
| tasks | 8 |
| ms | 1800000 |
| minFull | 4 |
| quitPay | 0.5 |
| quitRep | -5 |
| doneRep | 1 |
| perDay | 3 |
| holdMs | 259200000 |
| idleMs | 86400000 |
| idleRep | -3 |
| maxTaskMs | 600000 |
| phuSpeed | 12 |

**`SINH`** (5)

| khoá | giá trị |
|---|---|
| 木 | 火 |
| 火 | 土 |
| 土 | 金 |
| 金 | 水 |
| 水 | 木 |

**`WORK`** (31)

| khoá | id | name | wx | shop | base | wake | full | minSec | game | icon | verb | desc |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| bep | bep | Đầu bếp tửu lâu | 火 | tuu | 6.5 | 2.5 | 2 | 20 | fire | 🍳 | Đứng bếp | Canh lửa lò theo phiếu món: quạt cho lửa lên, buông cho lửa hạ, giữ kim nhiệt trong vùng x… |
| phu | phu | Phu dịch trạm | 水 | dichtram | 7.5 | 3 | 3 | 0 | deliver | 📦 | Nhận hàng | Nhận kiện hàng, áp sang dịch trạm kế bên theo đường vành. Đang áp hàng thì không cưỡi ngựa… |
| boc | boc | Bốc thuốc | 木 | duoc | 6 | 2 | 1.5 | 14 | herbs | 🌿 | Bốc thang thuốc | Đọc toa của lang trung, nhớ vị thuốc rồi bốc đúng ngăn tủ. Bốc nhầm thì trừ điểm. |
| mo | mo | Thợ mỏ | 金 |  | 6.5 | 3.5 | 3 | 8 | ore | ⛏ | Đào quặng | Xuống Mỏ Dân Sự Khoáng Sơn bằng xe goòng ở Lò Rèn. Gõ búa đúng nhịp để tách quặng; mạch nà… |
| gom | gom | Thợ gốm | 土 | gom | 6.5 | 2.5 | 2 | 16 | wheel | 🏺 | Ngồi bàn xoay | Vuốt đất trên bàn xoay: chạm đúng lúc vạch chạy qua tâm, vòng sau tâm hẹp dần. |
| den | den | Thợ đèn lồng | 火 | den | 6.5 | 2 | 1.5 | 14 | herbs | 🏮 | Dán đèn | Nhớ mẫu hoa văn của đơn đặt rồi dán đúng ô giấy lụa. |
| huong | huong | Thợ hương | 火 | huong | 6.5 | 2 | 1.5 | 16 | fire | 🪔 | Trộn hương | Trộn bột trầm, quế, đàn theo tỉ lệ — giữ kim tỉ lệ trong vùng xanh của từng mẻ. |
| tra | tra | Pha trà trà lâu | 水 | tralau | 6 | 1.5 | 1 | 16 | fire | 🍵 | Pha trà | Canh nhiệt nước sôi cho từng loại trà — trà xanh nước nhẹ, trà ô long nước già. |
| cantra | cantra | Cân trà Trà Trang | 水 | tratrang | 6 | 2 | 1.5 | 10 | ore | ⚖ | Cân trà | Cân trà gói cho khách: dừng quả cân đúng vạch lạng, không thừa không thiếu. |
| may | may | Thợ may | 木 | may | 6.5 | 2 | 1.5 | 16 | wheel | 🧵 | Cắt may | Cắt vải theo đường phấn — kéo đi qua vạch thì chạm, đường cắt hẹp dần ở đường viền. |
| vuon | vuon | Người làm vườn | 木 | hoavien | 6 | 2 | 2 | 12 | herbs | 🌸 | Chăm vườn | Đọc lịch tỉa của chủ vườn, nhớ 4 cây cần tỉa hôm nay rồi tỉa đúng cây. |
| moc | moc | Thợ mộc | 木 | moc | 6.5 | 2.5 | 2 | 16 | wheel | 🪚 | Cưa bào | Cưa theo đường mực: lưỡi cưa qua vạch thì chạm, mộng càng khít càng được giá. |
| chep | chep | Chép sách Thư Họa Các | 木 | thuhoa | 6 | 2 | 1 | 14 | herbs | 🖌 | Chép sách | Nhìn bản mẫu, nhớ 4 chữ rồi viết đúng ô trên giấy dó. |
| ren | ren | Thợ rèn | 金 | loren | 7 | 3 | 2.5 | 10 | ore | 🔨 | Rèn sắt | Nện búa khi thanh sắt đỏ đúng độ — rèn cuốc, dao mổ, móng ngựa cho cả thành. |
| moigioi | moigioi | Môi giới nhà đất | 土 | namon | 6.5 | 2 | 1 | 14 | herbs | 📜 | Dẫn khách xem nhà | Nhớ yêu cầu của khách (4 điều) rồi chọn đúng 4 căn hợp ý trong sổ địa ốc. |
| phongthuy | phongthuy | Thầy phong thủy (phụ việc) | 土 | phongthuy | 7 | 2 | 1 | 12 | ore | 🧭 | Xem hướng | Cầm la bàn đo hướng cho nhà khách: dừng kim đúng cung cát. |
| kephat | kephat | Kép hát gánh hát | 火 |  | 7 | 2.5 | 2 | 16 | wheel | 🎭 | Lên sân khấu | Hát theo nhịp phách ở Ca Đài cung Đoài — gõ đúng nhịp trống, khán giả thưởng. |
| lodan | lodan | Giữ lò luyện đan | 火 |  | 7 | 3 | 2 | 18 | fire | ⚗ | Giữ lửa lò | Canh lửa văn / lửa võ cho Cửu Chuyển Đan Lô theo từng giai đoạn luyện đan. |
| phaohoa | phaohoa | Pháo hoa lễ hội | 火 |  | 7 | 2 | 1.5 | 10 | ore | 🎆 | Bắn pháo hoa | Chỉ có ca vào đêm rằm (18–23 giờ): châm ngòi đúng nhịp nhạc hội ở phố chợ Cảnh Môn. |
| laido | laido | Lái đò · thuyền hoa | 水 |  | 7 | 2.5 | 2 | 16 | fire | 🛶 | Chèo đò | Đón khách ở bến hào / bến kênh, chèo theo luồng nước — giữ mũi thuyền giữa luồng. |
| nguphu | nguphu | Ngư phủ | 水 |  | 6.5 | 2.5 | 2.5 | 12 | ore | 🎣 | Thả lưới | Thả lưới thuê cho các bến sông Huyền Hà và hồ Cùng Thông theo con nước. |
| buonmuoi | buonmuoi | Buôn muối · xuất nhập | 水 |  | 7 | 2 | 1 | 14 | herbs | 🧂 | Lên đơn hàng | Đọc bảng giá Diêm Thị cung Đoài, nhớ 4 mặt hàng đang rẻ rồi gom đúng hàng. |
| hamruou | hamruou | Ủ rượu hầm tửu lâu | 水 |  | 6.5 | 2 | 1.5 | 16 | fire | 🍶 | Ủ rượu | Giữ nhiệt hầm ủ cho từng mẻ rượu trong mọi Tửu Lâu (không cần giữ chỗ). |
| tieuphu | tieuphu | Tiều phu | 木 |  | 7 | 3.5 | 3 | 14 | wheel | 🪓 | Đốn củi | Vào rừng ngoài thành (Nam Hoang, Đông Lĩnh) đốn cây già được phép — vung rìu đúng vết. |
| kimhoan | kimhoan | Thợ kim hoàn | 金 |  | 7 | 2 | 1 | 16 | herbs | 💍 | Khảm ngọc | Nhớ mẫu khảm của đơn đặt rồi gắn đúng viên ngọc vào ổ ở Kim Hoàn Phố cung Càn. |
| thungan | thungan | Thu ngân Tiền Trang | 金 |  | 7 | 2 | 1 | 14 | herbs | 🪙 | Kiểm bạc | Ngồi quầy Tiền Trang (Dịch Trạm, Nha Môn Địa Ốc): nhớ 4 dấu triện thật rồi loại bạc giả. |
| baotieu | baotieu | Bảo tiêu · hộ vệ | 金 |  | 7 | 3.5 | 3 | 10 | ore | 🛡 | Áp tiêu | Hộ tống xe hàng ở 8 cổng Ngoại Thành — đỡ đòn cướp đường đúng lúc. |
| nhadich | nhadich | Nha dịch · cai ngục | 金 |  | 7 | 3 | 2 | 14 | herbs | 🏮 | Tuần phố | Nhận lệnh ở Nha Môn: nhớ mặt 4 kẻ bị truy nã rồi nhận diện đúng trong đám đông. |
| thoxay | thoxay | Thợ xây · tu bổ | 土 |  | 7 | 3.5 | 3 | 14 | wheel | 🧱 | Xây tường | Tu bổ cổng Trung Thành — đặt gạch theo dây dọi, mạch vữa đều. |
| nongphu | nongphu | Nông phu linh điền | 土 |  | 6.5 | 3 | 3 | 14 | wheel | 🌾 | Cày gieo | Làm thuê ở linh điền Khôn cung: cày luống, gieo hạt đúng hàng. |
| thoda | thoda | Thợ đá khắc bia | 土 |  | 7 | 3 | 2 | 16 | wheel | 🪨 | Khắc bia | Khắc chữ lên bia đá ở Trấn Sơn Bảo Tháp cung Cấn — đục theo nét mực. |

### `guild-core.js`

| hằng số | giá trị |
|---|---|
| `LAYOUT_VER` | 5 |
| `ORE` | {"charges":3,"regenMs":240000,"reach":3.4} |
| `YONG_LOCK_MS` | 2592000000 |

**`CMINE`** (6)

| khoá | giá trị |
|---|---|
| key | job:mine |
| name | Mỏ Dân Sự Khoáng Sơn |
| x | 4851 |
| z | 340 |
| w | 56 |
| d | 44 |

### `fatequest.js`

| hằng số | giá trị |
|---|---|
| `DAY_MIN` | 80 |

**`HOURS`** (5)

| khoá | giá trị |
|---|---|
| 水 | [[21,25]] |
| 火 | [[9,13]] |
| 木 | [[3,7]] |
| 金 | [[15,19]] |
| 土 | [[7,9],[19,21],[1,3],[13,15]] |

**`HOUR_TEXT`** (5)

| khoá | giá trị |
|---|---|
| 水 | Hợi – Tý (21–1 giờ) |
| 火 | Tỵ – Ngọ (9–13 giờ) |
| 木 | Dần – Mão (3–7 giờ) |
| 金 | Thân – Dậu (15–19 giờ) |
| 土 | Thìn · Tuất · Sửu · Mùi |

**`PERK`** (5)

| khoá | name | text | boat | food | med | bank | house |
|---|---|---|---|---|---|---|---|
| 水 | Thủy vận | thuê thuyền −50% | 0.5 |  |  |  |  |
| 火 | Hỏa vận | ăn uống −20% |  | 0.8 |  |  |  |
| 木 | Mộc vận | thuốc men −30% |  |  | 0.7 |  |  |
| 金 | Kim vận | Tiền Trang miễn phí |  |  |  | 0 |  |
| 土 | Thổ vận | bảo trì nhà −50% |  |  |  |  | 0.5 |

**`QUESTS`** (15)

| id | wx | gua | u | name | task | mul | gift |
|---|---|---|---|---|---|---|---|
| muoi | 水 | kan | [230,420] | Lô muối đêm ở bến hào Khảm | Áp lô muối lên thuyền buôn đêm | 4 |  |
| calon | 水 | kan | [440,640] | Cá lớn chợ cá ngoài thành | Mua lại mẻ cá lớn, bán gấp năm giá | 5 |  |
| thuyendem | 水 | xun | [300,560] | Thuyền buôn đêm ở kênh Tốn | Dẫn lối thuyền buôn qua thủy môn | 3 |  |
| tieclon | 火 | li | [220,420] | Tiệc lớn quảng trường Ly | Nhận đặt một cỗ tiệc trăm mâm | 4 |  |
| phaohoa | 火 | li | [430,640] | Đơn pháo hoa lễ hội | Giao pháo hoa cho ban lễ | 3 |  |
| luyendan | 火 | li | [300,520] | Canh lò luyện đan | Giữ lửa lò đan một tuần nhang | 6 | immune |
| linhduoc | 木 | xun | [420,640] | Linh dược rừng Tốn | Hái linh dược sương sớm | 6 | immune |
| duocvien | 木 | zhen | [250,450] | Dược viên Chấn cung | Ươm cây thuốc quý cho Y Quán | 4 |  |
| gotram | 木 | zhen | [460,640] | Gỗ trầm lâu năm | Tìm khúc trầm trong vườn cổ | 5 |  |
| kimtinh | 金 | qian | [300,600] | Mạch kim tinh Càn cung | Dò mạch kim tinh cho thợ rèn | 5 |  |
| hopdong | 金 | dui | [230,430] | Hợp đồng Tiền Trang Đoài | Làm chứng một khế ước lớn | 4 |  |
| kiemcu | 金 | dui | [440,640] | Kiếm cổ chôn dưới lầu | Thẩm định thanh kiếm cổ | 3 |  |
| thau | 土 | kun | [230,450] | Thầu dựng lại công trình Khôn | Đo đạc nền móng cho thợ xây | 5 |  |
| moigioi | 土 | gen | [230,430] | Môi giới biệt phủ Cấn | Dẫn khách xem phủ | 4 |  |
| dapde | 土 | kun | [460,640] | Đắp đê ruộng Khôn | Đắp lại bờ ruộng sau mưa | 3 |  |

### `work-games.js`

| hằng số | giá trị |
|---|---|
| `GAME_KINDS` | ["fire","herbs","wheel","ore"] |
| `HERBS` | [["Đương quy","火"],["Hoàng kỳ","土"],["Cam thảo","土"],["Bạch truật","土"],["Phục linh","水"],["Xuyên khung","木"],["Thục địa","水"],["Bạch thược","金"],["Đảng sâm","金"],["Kỷ tử","火"],["Trần bì","木"],["Liên … |

**Khu làm việc ngoài tiệm** (`jobzones.zones()`)

| khoá | spots | rooms |
|---|---|---|
| kephat | [{"x":-104,"z":-25,"r":12,"name":"Ca Đài · Đoài Trạch Lâu"}] |  |
| lodan | [{"x":-8,"z":136,"r":9,"name":"Cửu Chuyển Đan Lô"},{"x":-15,"z":120,"r":10,"name":"Đan Dượ… |  |
| phaohoa | [{"x":0,"z":150,"r":16,"name":"Phố chợ Cảnh Môn"}] |  |
| laido | [{"x":-168,"z":1297,"r":14,"name":"Bến Nam Môn"},{"x":-654.4,"z":1179.1,"r":14,"name":"Bến… |  |
| nguphu | [{"x":-168,"z":1297,"r":14,"name":"Bến Nam Môn"},{"x":-654.4,"z":1179.1,"r":14,"name":"Bến… |  |
| buonmuoi | [{"x":-200,"z":0,"r":14,"name":"Diêm Thị · đại lộ Đoài"}] |  |
| hamruou | [] | ["tuu"] |
| tieuphu | [{"x":0,"z":2400,"r":34,"name":"Rừng Nam Hoang (ngoài Cảnh Môn)"},{"x":2400,"z":0,"r":34,"… |  |
| kimhoan | [{"x":-84.9,"z":-84.9,"r":14,"name":"Kim Hoàn Phố · Càn Kiếm Các"}] |  |
| thungan | [] | ["dichtram","namon"] |
| baotieu | [{"x":0,"z":2155,"r":22,"name":"Cổng thành Cảnh Môn"},{"x":-1523.8,"z":1523.8,"r":22,"name… |  |
| nhadich | [] | ["namon"] |
| thoxay | [{"x":-20,"z":1062,"r":18,"name":"Công trường vành Trung Thành Cảnh Môn"},{"x":-765.1,"z":… |  |
| nongphu | [{"x":-54.4,"z":92.6,"r":12,"name":"Khôn Nguyên Thương"},{"x":-65.8,"z":65.8,"r":16,"name"… |  |
| thoda | [{"x":90.5,"z":-90.5,"r":18,"name":"Trấn Sơn Bảo Tháp"}] |  |

## 15 · Nhà ở, vật phẩm, phương tiện

### `estate-core.js`

| hằng số | giá trị |
|---|---|
| `LAYOUT_MAX_LEN` | 12000 |
| `LISTING_COUNT` | 292 |
| `MAX_ITEMS` | 60 |
| `MAX_ITEMS_PHU` | 240 |
| `PHU_COUNT` | 16 |
| `SELL_BACK` | 0.5 |
| `STREET_H0` | 256 |
| `TIEN_COUNT` | 9 |
| `TIEN_H0` | 283 |
| `VILLA_COUNT` | 240 |

**`TIERS`** (6)

| khoá | name | w | d | h | price | alt | mansion |
|---|---|---|---|---|---|---|---|
| tieuxa | Tiểu Xá | 10 | 8 | 4.5 | {"xu":200000} |  |  |
| nhapho | Nhà Phố | 13 | 10 | 5 | {"xu":500000} |  |  |
| tuhop | Tứ Hợp Viện | 18 | 14 | 5.5 | {"xu":1200000} | {"ngoc":300} |  |
| bietphu | Biệt Phủ | 100 | 100 | 8 | {"xu":30000000} | {"ngoc":2000} | true |
| bietthu | Biệt Thự | 19 | 22 | 6 | {"xu":5000000} | {"ngoc":480} | true |
| tienphu | Tiên Phủ | 88 | 84 | 9 | {"xu":100000000} | {"ngoc":6000} | true |

### `estate-layout.js`

| hằng số | giá trị |
|---|---|
| `VILLAS_PER_DISTRICT` | 30 |
| `VILLA_D` | 22 |
| `VILLA_DISTRICT_NAME` | ["Hải Vân Uyển","Hương Giang Viên","Anh Hoa Lý","Lục Hoa Trang","Bạch Thạch Khu","Tùng Vân Thôn","Lục Diệp Uyển","Thủy Hương Phường"] |
| `VILLA_STYLES` | ["diatrunghai","nhavuon","nhatban","phap","toigian","hanok","nhietdoi","giangnam"] |
| `VILLA_W` | 19 |

**`PHU_PLAN`** (16)

| style | W | D |
|---|---|---|
| cungdinh | 100 | 100 |
| moorish | 80 | 80 |
| hue | 90 | 90 |
| tuscan | 75 | 80 |
| nhatban | 90 | 95 |
| kinh | 70 | 70 |
| palladian | 100 | 95 |
| chateau | 85 | 95 |
| giangnam | 95 | 90 |
| toigian | 65 | 70 |
| hanok | 85 | 85 |
| tudor | 75 | 80 |
| thai | 85 | 90 |
| nhietdoi | 70 | 75 |
| mughal | 100 | 90 |
| bali | 80 | 80 |

**`STYLES`** (28)

| khoá | name | fam | roof | roofCol | wall | trim | water | fence | trees | sig | wings | floors |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| cungdinh | Cung Đình Trung Hoa | asian | curved | #6f9a64 | #9a3324 | #d9a441 | pond | redwall | ["pine","ginkgo","peach","willow","plum","osmanthus"] | pagoda9 | true | 1 |
| moorish | Tây Ban Nha – Moorish | western | flat | #b5562e | #f1e9da | #2f6b8a | canal | stucco | ["palm","cypress","olive","jacaranda","frangi"] | minaret |  | 2 |
| hue | Phủ Đệ Huế | asian | vn | #7a4a32 | #6b3e26 | #c9a24a | lotus | brick | ["palm","frangi","banyan","plum","bamboo"] | bell | true | 1 |
| tuscan | Biệt Thự Tuscan | western | hip | #b8613a | #e2c48e | #6b4a2a | parterre | stone | ["cypress","olive","magnolia","hedge","jacaranda"] | campanile |  | 2 |
| nhatban | Dinh Thự Nhật Bản | asian | irimoya | #3a3d42 | #ece6d6 | #3b2a1e | zen | bamboo | ["sakura","maple","pine","bamboo","wisteria"] | tenshu |  | 1 |
| kinh | Hiện Đại Kính | modern | flat | #e8e8e4 | #f2f2ef | #2a2d31 | pool | modern | ["birch","maple","olive","hedge","ginkgo"] | glass |  | 2 |
| palladian | Tân Cổ Điển Palladio | western | hip | #5c6168 | #ece3cf | #ffffff | parterre | iron | ["cypress","magnolia","hedge","olive","birch"] | rotunda |  | 2 |
| chateau | Lâu Đài Pháp | western | mansard | #3e4a5a | #ddd6c6 | #f5f2ea | parterre | iron | ["hedge","cypress","maple","magnolia","wisteria"] | donjon |  | 3 |
| giangnam | Viên Lâm Giang Nam | asian | curved | #3e434a | #ece8de | #3b2a1e | pond | whitewall | ["willow","bamboo","plum","osmanthus","ginkgo"] | pagoda7 | true | 2 |
| toigian | Tối Giản Hiện Đại | modern | flat | #ffffff | #fbfbf8 | #8a8f96 | pool | modern | ["olive","birch","hedge","jacaranda","maple"] | cube |  | 2 |
| hanok | Hanok Hàn Quốc | asian | curved | #4a4e55 | #efe9da | #6b4a2a | pond | stonewall | ["pine","maple","sakura","ginkgo","camellia"] | bellhanok | true | 1 |
| tudor | Trang Viên Tudor | western | gable | #4a3a34 | #efe6d2 | #3a2a20 | lawn | hedge | ["maple","birch","hedge","pine","magnolia"] | clock |  | 2 |
| thai | Cung Điện Thái Lan | asian | thai | #a8322a | #f3eee2 | #e0b040 | lotus | whitewall | ["palm","frangi","banyan","jacaranda","camellia"] | stupa |  | 1 |
| nhietdoi | Nhiệt Đới Hiện Đại | modern | flat | #6a5a46 | #e6dccb | #7a5a3a | pool | modern | ["palm","frangi","banyan","jacaranda","bamboo"] | wood |  | 2 |
| mughal | Cung Điện Mughal | mughal | onion | #f4f1ea | #f4f1ea | #b0503a | canal | redstone | ["cypress","palm","jacaranda","camellia","osmanthus"] | minaret2 |  | 2 |
| bali | Biệt Viện Bali | asian | thatch | #8a6a3a | #d8c8a8 | #5a4630 | pool | stone | ["palm","frangi","banyan","camellia","bamboo"] | meru |  | 1 |
| diatrunghai | Địa Trung Hải | western | hip | #c0653b | #f6f1e6 | #2f6b8a | pool | stucco | ["olive","cypress","palm"] |  |  | 2 |
| nhavuon | Nhà Vườn Huế | asian | vn | #7a4a32 | #7a4a2e | #c9a24a | lotus | brick | ["palm","frangi","peach"] |  |  | 1 |
| phap | Biệt Thự Pháp | western | mansard | #4a5566 | #f0e3c4 | #ffffff | parterre | iron | ["hedge","maple","cypress"] |  |  | 2 |
| thien_quan | Thiên Cung · Quân Thiên | asian | curved | #e2b444 | #f3eee2 | #b8322a | lotus | whitewall | ["pine","peach","plum","osmanthus","ginkgo","sakura"] | pagoda9 | true | 2 |
| thien_thuong | Thiên Cung · Thương Thiên | asian | curved | #3f8a64 | #f3eee2 | #b8322a | lotus | whitewall | ["pine","peach","plum","osmanthus","ginkgo","sakura"] | pagoda9 | true | 2 |
| thien_bien | Thiên Cung · Biến Thiên | asian | curved | #6a9a7a | #f3eee2 | #b8322a | lotus | whitewall | ["pine","peach","plum","osmanthus","ginkgo","sakura"] | pagoda9 | true | 2 |
| thien_huyen | Thiên Cung · Huyền Thiên | asian | curved | #2e3a58 | #f3eee2 | #b8322a | lotus | whitewall | ["pine","peach","plum","osmanthus","ginkgo","sakura"] | pagoda9 | true | 2 |
| thien_u | Thiên Cung · U Thiên | asian | curved | #4a3f6a | #f3eee2 | #b8322a | lotus | whitewall | ["pine","peach","plum","osmanthus","ginkgo","sakura"] | pagoda9 | true | 2 |
| thien_hao | Thiên Cung · Hạo Thiên | asian | curved | #d8d6cc | #f3eee2 | #b8322a | lotus | whitewall | ["pine","peach","plum","osmanthus","ginkgo","sakura"] | pagoda9 | true | 2 |
| thien_chu | Thiên Cung · Chu Thiên | asian | curved | #c23a2a | #f3eee2 | #b8322a | lotus | whitewall | ["pine","peach","plum","osmanthus","ginkgo","sakura"] | pagoda9 | true | 2 |
| thien_viem | Thiên Cung · Viêm Thiên | asian | curved | #d0522a | #f3eee2 | #b8322a | lotus | whitewall | ["pine","peach","plum","osmanthus","ginkgo","sakura"] | pagoda9 | true | 2 |
| thien_duong | Thiên Cung · Dương Thiên | asian | curved | #e08a3a | #f3eee2 | #b8322a | lotus | whitewall | ["pine","peach","plum","osmanthus","ginkgo","sakura"] | pagoda9 | true | 2 |

**`TIEN_PLAN`** (9)

| id | name | dir | g | roofCol | W | D | style |
|---|---|---|---|---|---|---|---|
| quan | Quân Thiên | [0,0] | kun | #e2b444 | 100 | 100 | thien_quan |
| thuong | Thương Thiên | [1,0] | zhen | #3f8a64 | 88 | 84 | thien_thuong |
| bien | Biến Thiên | [1,-1] | gen | #6a9a7a | 84 | 84 | thien_bien |
| huyen | Huyền Thiên | [0,-1] | kan | #2e3a58 | 88 | 84 | thien_huyen |
| u | U Thiên | [-1,-1] | qian | #4a3f6a | 84 | 84 | thien_u |
| hao | Hạo Thiên | [-1,0] | dui | #d8d6cc | 88 | 84 | thien_hao |
| chu | Chu Thiên | [-1,1] | kun | #c23a2a | 84 | 84 | thien_chu |
| viem | Viêm Thiên | [0,1] | li | #d0522a | 88 | 84 | thien_viem |
| duong | Dương Thiên | [1,1] | xun | #e08a3a | 84 | 84 | thien_duong |

### `items.js`

| hằng số | giá trị |
|---|---|
| `COUPLETS` | [["Phúc như Đông Hải","Thọ tỷ Nam Sơn"],["Thiên tăng tuế nguyệt","Nhân tăng thọ"],["Gia hòa vạn sự hưng","Nhân an bách phúc lai"],["Sơn thanh thủy tú","Nhân kiệt địa linh"],["Tích thiện chi gia","Tất … |

**`ITEMS`** (50)

| id | name | cat | wx | price | foot | kind | place | h | model | desc | use | rare |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ghe_tanh | Ghế Thái Sư | moc | 木 | {"xu":24000} | [0.8,0.8] | decor | floor | 1.15 | pr_chair | Ghế gỗ trắc tựa cao, chỗ ngồi của chủ nhà. |  |  |
| ghe_son | Ghế Sơn Son | moc | 火 | {"xu":33000} | [0.8,0.8] | decor | floor | 1.05 | pr_chair_red | Ghế bành sơn son thếp vàng. |  |  |
| ban_tron | Bàn Tròn Chạm Hoa | moc | 木 | {"xu":54000} | [1.8,1.8] | decor | floor | 0.85 | pr_table_round | Bàn tròn ăn cơm cả nhà, chạm hoa mẫu đơn. |  |  |
| ban_tra | Bàn Trà Thấp | moc | 木 | {"xu":42000} | [1.2,1.2] | decor | floor | 0.5 | pr_table_long | Pha trà ngay tại nhà (cần lá trà). | teatable |  |
| an_thu | Án Thư | moc | 木 | {"xu":51000} | [2.2,0.8] | decor | floor | 0.9 | scholar_desk | Bàn viết của người đọc sách. Đặt lưng tựa tường, nhìn ra cửa thì tốt. | desk |  |
| ban_tho | Bàn Thờ Gia Tiên | moc | 火 | {"xu":96000} | [2,0.7] | decor | floor | 1.1 | pr_table_ming | Thắp hương mỗi ngày (cần hương). Nên tựa vách sau. | altar |  |
| giuong | Giường Lục Trụ | moc | 木 | {"xu":132000} | [2.2,2.2] | decor | floor | 2.4 | pr_bed | Nghỉ ở đây thì lần sau vào game thức dậy tại nhà. | bed |  |
| tu_cham | Tủ Chạm Sơn Mài | moc | 金 | {"xu":78000} | [1.2,0.65] | decor | floor | 1.9 | pr_cabinet | Tủ sơn mài khảm hoa. |  |  |
| tu_hoa | Tủ Hoa Điểu | moc | 木 | {"xu":90000} | [1.2,0.9] | decor | floor | 1.9 | pr_cabinet2 | Tủ vẽ hoa điểu, hợp phòng khách. |  |  |
| ke_sach | Kệ Sách | moc | 木 | {"xu":72000} | [1.4,0.6] | decor | floor | 2.6 | lib_bookshelf | Mỗi ngày đọc một đoạn cổ văn. | books |  |
| binh_phong | Bình Phong Cổ | moc | 木 | {"xu":66000} | [2.4,0.35] | decor | floor | 1.9 | pr_screen_antique | Che chắn khí xung từ cửa thẳng vào nhà. |  |  |
| binh_phong_hoa | Bình Phong Xuân Hoa | moc | 木 | {"ngoc":30} | [2.4,0.75] | decor | floor | 1.9 | pr_screen_blossom | Bình phong vẽ hoa xuân — hàng quý. |  | true |
| binh_minh | Bình Hoa Lam Minh | gom | 土 | {"xu":27000} | [0.6,0.6] | decor | floor | 1.2 | pr_vase_ming | Bình men lam vẽ rồng mây. |  |  |
| chum_su | Chum Sứ Nhân Vật | gom | 土 | {"xu":36000} | [0.7,0.7] | decor | floor | 1 | pr_jar_porcelain | Chum sứ vẽ tích cổ. |  |  |
| binh_ngoc | Bình Men Ngọc | gom | 水 | {"xu":30000} | [0.5,0.5] | decor | floor | 0.9 | pr_vase_celadon | Men ngọc xanh như nước hồ thu. |  |  |
| am_chen | Bộ Ấm Chén Khay Tròn | gom | 土 | {"xu":21000} | [0.7,0.7] | decor | floor | 0.35 | pr_teaset | Đặt cạnh bàn trà cho đủ lễ. |  |  |
| chum_nuoc | Chum Nước Sân Nhà | gom | 水 | {"xu":24000} | [0.9,0.9] | decor | floor | 0.9 |  | Chum đựng nước mưa — tụ thủy. |  |  |
| den_long_do | Đèn Lồng Đỏ | den | 火 | {"xu":15000} | [0.6,0.6] | decor | floor | 1.8 |  | Đèn đứng thắp sáng một góc nhà. | light |  |
| den_long_vang | Đèn Lồng Vàng | den | 火 | {"xu":18000} | [0.6,0.6] | decor | floor | 1.8 |  | Ánh vàng ấm, hợp phương Nam. | light |  |
| den_da | Đèn Đá | den | 土 | {"xu":39000} | [0.7,0.6] | decor | floor | 1.4 | pr_stonelantern | Thạch đăng — đèn đá sân vườn. | light |  |
| den_cung | Cung Đăng Lục Giác | den | 火 | {"ngoc":25} | [0.6,0.6] | decor | floor | 2.1 |  | Đèn cung đình sáu cạnh — hàng quý. | light | true |
| tranh_son_thuy | Tranh Sơn Thủy | thuhoa | 水 | {"xu":36000} | [1.6,0.1] | decor | wall | 1.1 |  | Núi xa nước gần — treo vách sau tốt cho tựa sơn. |  |  |
| tranh_mai | Tranh Mai Lan | thuhoa | 木 | {"xu":33000} | [1,0.1] | decor | wall | 1.6 |  | Tranh thủy mặc cành mai. |  |  |
| hoanh_phi | Hoành Phi «Phúc Mãn Đường» | thuhoa | 金 | {"xu":48000} | [2,0.1] | decor | wall | 0.5 |  | Biển gỗ chữ vàng — treo trên bàn thờ. |  |  |
| cau_doi | Câu Đối Gỗ | thuhoa | 木 | {"xu":42000} | [1.6,0.1] | decor | wall | 2 |  | Cặp câu đối khắc gỗ (chọn câu khi treo). |  |  |
| chu_phuc | Chữ «Phúc» Thư Pháp | thuhoa | 火 | {"xu":21000} | [0.8,0.1] | decor | wall | 0.8 |  | Một chữ Phúc viết tay. |  |  |
| bonsai | Chậu Tùng Bonsai | hoavien | 木 | {"xu":30000} | [0.8,0.8] | decor | floor | 1 | lib_bonsai | Tưới mỗi ngày, cây lớn dần. | plant |  |
| chau_truc | Chậu Trúc Phú Quý | hoavien | 木 | {"xu":21000} | [0.6,0.6] | decor | floor | 1.6 |  | Trúc xanh — hợp phương Đông. | plant |  |
| chau_lan | Chậu Lan | hoavien | 木 | {"xu":18000} | [0.5,0.5] | decor | floor | 0.7 |  | Lan thanh nhã. | plant |  |
| be_ca | Bể Cá Cảnh | hoavien | 水 | {"xu":84000} | [1,1] | decor | floor | 0.9 | pr_fishbowl | Cho cá ăn mỗi ngày. Đặt phương Bắc / Đông / Đông Nam thì vượng. | fish |  |
| ty_huu | Tỳ Hưu Ngọc | phongthuy | 金 | {"xu":72000} | [0.5,0.85] | decor | floor | 0.8 | pr_pixiu | Giữ của — quay đầu ra cửa. |  |  |
| thiem_thu | Thiềm Thừ Ngậm Tiền | phongthuy | 金 | {"xu":60000} | [0.6,0.75] | decor | floor | 0.5 | pr_toad | Cóc ba chân chiêu tài. |  |  |
| la_ban | Giá La Bàn | phongthuy | 土 | {"xu":90000} | [1,1] | decor | floor | 1.2 | luopan_stand | Xem phong thủy căn nhà bất cứ lúc nào. | compass |  |
| chuong_gio | Chuông Gió Đồng | phongthuy | 金 | {"xu":27000} | [0.4,0.4] | decor | floor | 1.9 |  | Hóa giải khí xấu, nghe vui tai. |  |  |
| cau_thach_anh | Cầu Thạch Anh | phongthuy | 土 | {"xu":45000} | [0.5,0.5] | decor | floor | 0.7 |  | Tụ khí — đặt giữa nhà. |  |  |
| ky_lan | Sư Tử Đá Trấn Trạch | phongthuy | 土 | {"ngoc":40} | [1,1] | decor | floor | 1 | bq_lion | Trấn trạch — hàng quý. |  | true |
| tuong_lao_quan | Tượng Thái Thượng Lão Quân | huong | 土 | {"ngoc":60} | [1,0.8] | decor | floor | 1.6 | deity_daode | Đặt cạnh bàn thờ — hàng quý. |  | true |
| lu_dong | Lư Đồng Ba Chân | huong | 金 | {"xu":42000} | [0.8,0.8] | decor | floor | 0.9 | cauldron | Lư hương đồng đặt trước bàn thờ. |  |  |
| huong_thuong | Hương Thường (bó) | huong |  | {"xu":1200} |  | use |  |  |  | Thắp ở bàn thờ trong nhà: +5 Phúc Khí/ngày. | incense |  |
| huong_tram | Trầm Hương | huong |  | {"xu":4000} |  | use |  |  |  | Thắp ở bàn thờ: +8 Phúc Khí/ngày. | incense |  |
| huong_kynam | Kỳ Nam Hương | huong |  | {"ngoc":3} |  | use |  |  |  | Thắp ở bàn thờ: +12 Phúc Khí/ngày. | incense |  |
| tra_longtinh | Trà Long Tỉnh | tra |  | {"xu":2400} |  | use |  |  |  | Pha ở bàn trà trong nhà hoặc Trà Thất: nước xanh cốm. | tea |  |
| tra_thietquanam | Trà Thiết Quan Âm | tra |  | {"xu":3200} |  | use |  |  |  | Nước vàng óng, hương lan. | tea |  |
| tra_phonhi | Trà Phổ Nhĩ | tra |  | {"xu":4000} |  | use |  |  |  | Nước nâu đỏ, đậm đà. | tea |  |
| tra_bach | Bạch Trà | tra |  | {"xu":4800} |  | use |  |  |  | Nước vàng nhạt, thanh tao. | tea |  |
| tochanh | Tốc Hành Tán | duoc |  | {"xu":6000} |  | use |  |  |  | Đi nhanh gấp 1,6 lần trong 10 phút. | buff_speed |  |
| thanhtam | Thanh Tâm Đan | duoc |  | {"xu":10000} |  | use |  |  |  | Phúc Khí từ giải án hôm nay +25% (mỗi ngày dùng một viên). | buff_case |  |
| thucan_ca | Thức Ăn Cá | duoc |  | {"xu":800} |  | use |  |  |  | Cho cá trong bể ăn. | fishfood |  |
| kiem_treo | Kiếm Treo Tường | loren | 金 | {"xu":54000} | [1.4,0.1] | decor | wall | 0.4 |  | Thanh kiếm thép rèn, treo trấn trạch. |  |  |
| gia_binh_khi | Giá Binh Khí | loren | 金 | {"xu":66000} | [1.8,0.6] | decor | floor | 1.8 | bq_weapon_rack | Giá bày đao kiếm thương. |  |  |

**`WX_NAME`** (5)

| khoá | giá trị |
|---|---|
| 木 | Mộc |
| 火 | Hỏa |
| 土 | Thổ |
| 金 | Kim |
| 水 | Thủy |

### `rooms.js`

| hằng số | giá trị |
|---|---|
| `TEMPLE_NB` | ["Càn Nguyên Kiếm Các","Trấn Sơn Bảo Tháp","Bát Môn Trận Đường","Lôi Âm Điện"] |

**`SHOP_TYPES`** (16)

| khoá | name | facade | owner | look | wall | floor | sells | svc |
|---|---|---|---|---|---|---|---|---|
| moc | Mộc Nghệ Phường | bq_carpentry | Thợ Mộc | npc_villager | #c9b48e | wood | ["moc"] |  |
| gom | Lò Gốm | bq_pottery | Thợ Gốm | npc_villager | #d8c9ae | stone | ["gom"] |  |
| den | Đèn Lồng Phường | bq_lantern_shop | Bà Đèn | hero_f | #b8452c | wood | ["den"] |  |
| thuhoa | Thư Họa Các | bq_bookstore | Họa Sư | master | #e3dccb | wood | ["thuhoa"] |  |
| hoavien | Hoa Viên | bq_moongate | Người Làm Vườn | npc_villager | #cfd8bf | stone | ["hoavien"] |  |
| phongthuy | Phong Thủy Đường | bq_drum_tower | Thầy Địa Lý | master | #4a3a2a | stone | ["phongthuy"] | ["khaosat","thaymenh"] |
| huong | Hương Phường | bq_incense | Chủ Hương | npc_merchant | #8a2a1c | wood | ["huong"] |  |
| tratrang | Trà Trang | bq_teashop | Chủ Trà Trang | hero_f | #d6ccb2 | wood | ["tra"] |  |
| duoc | Dược Phòng | bq_apothecary | Lang Trung | master | #c9b993 | wood | ["duoc"] | ["thuoc","yquan"] |
| loren | Lò Rèn | bq_forge | Thợ Rèn | hero_m | #5a4a3e | stone | ["loren"] |  |
| tuu | Tửu Lâu | bq_tavern | Chưởng Quầy | npc_merchant | #c9b993 | wood | [] | ["tindon","bep","beptruong"] |
| tralau | Trà Lâu | bq_teahouse | Trà Sư | master | #d6ccb2 | wood | [] | ["thuyetthu","uongtra"] |
| dichtram | Dịch Trạm | bq_inn | Trạm Trưởng | hero_m | #c9b48e | stone | [] | ["thuengua","tientrang","cho"] |
| namon | Nha Môn Địa Ốc | bq_yamen | Quan Địa Ốc | master | #8a2a1c | stone | [] | ["diaoc","tientrang","ruong","matbang","hotich"] |
| tientrang | Tiền Trang | bq_yamen | Chưởng Quỹ | master | #8a6a3a | stone | [] | ["tientrang","cho"] |
| may | Tiệm May Tàng Y | bq_shop_lantern | Thợ May | hero_f | #e3dccb | wood | [] | ["may"] |

### `shop-data.js`

**`SVC`** (17)

| khoá | name | verb |
|---|---|---|
| khaosat | Bàn thầy địa lý | Mời thầy xem nhà |
| tindon | Bàn gọi rượu | Gọi rượu nghe chuyện (20 đồng) |
| tientrang | Quầy Tiền Trang | Gửi · rút tiền Tiền Trang |
| thuoc | Quầy thang thuốc | Bốc thang thuốc chữa bệnh nhẹ |
| yquan | Y Quán | Vào Y Quán — thầy thuốc bắt mạch |
| thuyetthu | Đài thuyết thư | Nghe thuyết thư |
| uongtra | Bàn trà | Ngồi uống trà |
| thuengua | Quầy thuê ngựa | Thuê ngựa đi nhanh |
| diaoc | Sổ địa ốc | Xem nhà rao bán |
| may | Quầy may | Xem trang phục, phụ kiện |
| cho | Chợ ký gửi · Thương hội | Ký gửi, mua bán, lò mổ, xay xát |
| ruong | Ruộng & chuồng | Thuê thửa ruộng, chuồng nuôi |
| matbang | Mặt bằng thương mại | Thuê quầy, quán, tửu lâu |
| hotich | Hộ tịch | Cầu hôn, hôn thư, ly hôn |
| bep | Bếp thuê | Vào bếp nấu món |
| beptruong | Bếp trưởng | Thưa chuyện bếp trưởng, xin làm đồ đệ |
| thaymenh | Thầy mệnh lý | Mời thầy xem quẻ · hành nghề |

**`USE_VERB`** (9)

| khoá | giá trị |
|---|---|
| teatable | Pha trà |
| desk | Ngồi án thư viết chữ |
| altar | Thắp hương bàn thờ |
| bed | Nghỉ tại đây |
| books | Đọc sách |
| light | Thắp / tắt đèn |
| plant | Tưới cây |
| fish | Cho cá ăn |
| compass | Xem phong thủy căn nhà |

### `vehicles.js`

| hằng số | giá trị |
|---|---|
| `FLY_WAKE_PER_MIN` | 6 |
| `PANTRY_MAX` | 12 |
| `PANTRY_MS` | 259200000 |
| `SEIZE_DAYS` | 3 |

**`HOUSE_UPKEEP`** (5)

| khoá | giá trị |
|---|---|
| tieuxa | 8 |
| nhapho | 20 |
| tuhop | 45 |
| bietthu | 200 |
| bietphu | 600 |

**`VEHICLES`** (5)

| khoá | name | icon | tier | price | upkeep | speed | drain | carry | ground | desc | hop | cool |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| lua | Lừa | 🫏 | 1 | 300000 | 5 | 1.15 | 0.8 | 1 | true | Đi đỡ mệt (hao No / Tỉnh −20%), chở được một thùng hàng. |  |  |
| ngua | Ngựa | 🐎 | 2 | 1500000 | 20 | 1.6 | 0.9 | 2 | true | Phi nhanh ×1,6 trên đường cái; mở việc giao hàng liên cung. |  |  |
| xengua | Xe ngựa | 🐴 | 3 | 6000000 | 50 | 1.4 | 0.85 | 6 | true | Chở 6 thùng — buôn bán, vận tải đường dài, áp tiêu. |  |  |
| linhhac | Linh hạc | 🕊️ | 4 | 40000000 | 150 |  |  |  |  | Bay thấp 60 giây, nghỉ 3 phút — bay được cả khi chưa đủ cấp ngự kiếm. | 60 | 180 |
| phikiem | Phi kiếm thượng phẩm | 🗡️ | 5 | 200000000 | 2000 |  |  |  |  | Ngự kiếm nhanh ×1,5, không hao Tỉnh — biểu tượng địa vị. |  |  |

### `roomgrid.js`

| hằng số | giá trị |
|---|---|
| `COLS` | 76 |
| `SLOT_EST` | 9000 |
| `SLOT_TEMPLE` | 9100 |
| `STEP` | 30 |
| `X0` | 4346 |
| `Z0` | -230 |

**`SHOP_SIZE`** (8)

| khoá | giá trị |
|---|---|
| moc | [20,16,6] |
| gom | [16,13,6] |
| hoavien | [16,14,6] |
| tuu | [20,16,7] |
| tralau | [18,15,6] |
| namon | [20,16,8] |
| dichtram | [16,12,6] |
| phongthuy | [16,14,7] |

## 16 · Di chuyển

### `motion.js`

| hằng số | giá trị |
|---|---|
| `CLIMB_V` | 3.2 |
| `FLOAT` | 1 |
| `G` | 20 |
| `GLIDE_FALL` | 2.2 |
| `GLIDE_SPEED` | 2.1 |
| `JUMP2_V` | 8.4 |
| `JUMP_V` | 7.2 |
| `SHORE_HAUL` | 2.4 |
| `SHORE_STEP` | 1.4 |
| `SPRINT` | 1.9 |
| `STAMINA_MAX` | 100 |
| `STEP_UP` | 0.65 |
| `SWIM` | 0.25 |
| `SWIM_SPRINT_V` | 2.4 |
| `SWIM_V` | 1.4 |
| `WADE` | {"min":0.5,"max":1.3,"speed":0.6} |

### `movement.js`

| hằng số | giá trị |
|---|---|
| `DROWN_HP` | 3 |
| `FX_CODE` | {"qi":1,"lotus":2} |

**`WATER_WALK`** (4)

| id | name | source | fx | stamina | speed |
|---|---|---|---|---|---|
| thuy_thuong_phieu | Thủy Thượng Phiêu | SKILL | qi | 2 | 1 |
| lang_ba | Lăng Ba Vi Bộ | SKILL | lotus | 2.5 | 1.1 |
| hai_ho_than | Hài Hộ Thân | VIP_ITEM | qi | 0 | 1 |
| dinh_thuy_chau | Định Thủy Châu | VIP_ITEM | lotus | 0 | 1 |

### `flight.js`

| hằng số | giá trị |
|---|---|
| `BLEND_S` | 0.25 |
| `BOOST` | 1.5 |
| `DIVE_V` | 6 |
| `FS_NAME` | ["","Cất cánh","Trôi","Hành trình","Tăng tốc","Hạ cánh"] |
| `LAND_S` | 0.6 |
| `SPEED_CAP` | 0.35 |
| `TAKEOFF_S` | 0.8 |

**`FS`** (6)

| khoá | giá trị |
|---|---|
| OFF | 0 |
| TAKEOFF | 1 |
| HOVER | 2 |
| CRUISE | 3 |
| BOOST | 4 |
| LAND | 5 |

### `flight-poses.js`

**`POSES`** (6)

| 1 | 2 | 3 | 4 | 5 | khoá |
|---|---|---|---|---|---|
| {"base":"idle","lean":0.05,"bones":[["RightArm","RightForeArm",[0.3,-0.7,-0.4]],["LeftArm"… | {"base":"idle","lean":0,"bones":[["RightArm","RightForeArm",[0.25,-0.75,-0.55]],["RightFor… | {"base":"idle","lean":0.12,"bones":[["RightArm","RightForeArm",[0.3,-0.8,-0.45]],["LeftArm… | {"base":"idle","lean":0.3,"bones":[["RightArm","RightForeArm",[0.2,-0.2,0.95]],["RightFore… | {"base":"idle","lean":-0.05,"bones":[["RightArm","RightForeArm",[0.45,-0.6,0.1]],["LeftArm… | kiem |
| {"base":"idle","seat":"calm","lean":0,"bones":[]} | {"base":"idle","seat":"calm","lean":0,"bones":[["RightForeArm","RightHand",[-0.5,0.1,0.85]… | {"base":"idle","seat":"calm","lean":0.05,"bones":[["RightForeArm","RightHand",[-0.45,0.3,0… | {"base":"idle","seat":"calm","lean":0.12,"bones":[["RightArm","RightForeArm",[0.2,-0.5,0.8… | {"base":"idle","seat":"calm","lean":-0.04,"bones":[["LeftForeArm","LeftHand",[-0.35,-0.3,0… | dai_sen |
| {"base":"sit","seat":"tea","lean":-0.1,"bones":[["LeftArm","LeftForeArm",[0.6,-0.5,0.2]]]} | {"base":"sit","seat":"tea","lean":-0.15,"bones":[["LeftArm","LeftForeArm",[0.7,-0.6,-0.1]]… | {"base":"sit","seat":"tea","lean":-0.05,"bones":[["LeftArm","LeftForeArm",[0.5,-0.4,0.5]]]… | {"base":"sit","seat":"tea","lean":0.2,"bones":[["LeftArm","LeftForeArm",[0.3,0.1,0.9]]]} | {"base":"sit","seat":"tea","lean":-0.2,"bones":[["LeftArm","LeftForeArm",[0.8,-0.3,0.2]]]} | ho_lo_bay |
| {"base":"idle","lean":0.02,"bones":[["LeftArm","LeftForeArm",[0.8,-0.5,0.1]],["LeftForeArm… | {"base":"idle","lean":0,"bones":[["LeftArm","LeftForeArm",[0.85,-0.45,0]],["LeftForeArm","… | {"base":"idle","lean":0.1,"bones":[["LeftArm","LeftForeArm",[0.85,-0.45,0]],["RightArm","R… | {"base":"idle","lean":0.28,"bones":[["LeftArm","LeftForeArm",[0.6,-0.6,-0.45]],["RightArm"… | {"base":"idle","lean":-0.06,"bones":[["LeftArm","LeftForeArm",[0.7,-0.7,0.1]],["RightArm",… | may |
| {"base":"sit","lean":0.1,"bones":[["RightArm","RightForeArm",[0.25,-0.45,0.85]],["LeftArm"… | {"base":"sit","lean":0,"bones":[["RightArm","RightForeArm",[0.3,-0.7,0.6]],["RightForeArm"… | {"base":"sit","lean":0.05,"bones":[["RightArm","RightForeArm",[0.25,-0.55,0.8]],["LeftArm"… | {"base":"sit","lean":0.55,"bones":[["RightArm","RightForeArm",[0.1,-0.3,0.95]],["RightFore… | {"base":"sit","lean":-0.1,"bones":[["RightArm","RightForeArm",[0.35,-0.6,0.7]],["LeftArm",… | hac |
| {"base":"idle","lean":0.08,"bones":[["RightArm","RightForeArm",[0.75,-0.55,-0.3]],["LeftAr… | {"base":"idle","lean":0,"bones":[["RightArm","RightForeArm",[0.6,-0.75,0.2]],["LeftArm","L… | {"base":"idle","lean":0.35,"bones":[["RightArm","RightForeArm",[0.55,-0.6,-0.55]],["LeftAr… | {"base":"idle","lean":0.7,"bones":[["RightArm","RightForeArm",[0.2,-0.3,-0.93]],["LeftArm"… | {"base":"idle","lean":-0.1,"bones":[["RightArm","RightForeArm",[0.9,-0.4,0.1]],["LeftArm",… | duc |

### `boats.js`

| hằng số | giá trị |
|---|---|
| `RENT_MS` | 1800000 |

**`BOAT_TYPES`** (3)

| khoá | idx | name | len | beam | height | draft | thrust | sprint | cf | turn | spin | sail |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| do | 0 | Đò chèo | 6 | 1.6 | 1.6 | 0.4 | 1.1 | 1.5 | 0.18 | 0.9 | 0.45 | false |
| hoa | 1 | Thuyền hoa | 14 | 3.6 | 4.2 | 0.9 | 0.7 | 1.35 | 0.08 | 0.42 | 0.12 | false |
| buom | 2 | Thuyền buồm | 22 | 5 | 12 | 1.8 | 0.18 | 1 | 0.035 | 0.26 | 0.04 | true |

### `water.js`

**`AMP`** (7)

| khoá | giá trị |
|---|---|
| canal | 0.08 |
| moat | 0.1 |
| link | 0.12 |
| stream | 0.04 |
| river | 0.32 |
| lake | 0.45 |
| pond | 0.014 |

**`WAVES`** (4)

| ang | len | a | k | w | ph |
|---|---|---|---|---|---|
| 0 | 11 | 0.42 | 0.5711986642890533 | 2.367162625734787 | 0 |
| 0.55 | 6.5 | 0.28 | 0.966643893412244 | 3.079411728621899 | 1.9 |
| -0.75 | 3.9 | 0.18 | 1.6110731556870734 | 3.9755034470228034 | 3.8 |
| 2.3 | 17 | 0.12 | 0.36959913571644626 | 1.9041448267866439 | 5.699999999999999 |

## 17 · Sản xuất, ẩm thực, kinh doanh

### `econ-data.js`

| hằng số | giá trị |
|---|---|
| `AFFINITY_NEED` | 60 |
| `CHEF_CAP` | 20 |
| `COLD` | 0.2 |
| `MILL` | {"in":{"lua":2},"out":{"gao":1},"fee":1} |
| `REGION_IDS` | ["noido","trung","song","thon","mo"] |
| `TRIALS_NEED` | 3 |

**`BUTCHER`** (3)

| khoá | thit_ga | xuong | long | thit_lon | mo | da | thit_bo |
|---|---|---|---|---|---|---|---|
| ga | 2 | 1 | 1 |  |  |  |  |
| lon |  | 3 |  | 8 | 3 | 1 |  |
| bo |  | 6 |  |  | 4 | 2 | 20 |

**`CHEFS`** (4)

| khoá | name | where | region | trials | bio |
|---|---|---|---|---|---|
| hoadau | Lão Hỏa Đầu | Hỏa Vân Tửu Lâu | noido | ["thit_kho","com_ga","bo_nuong_than"] | Bếp lửa ba mươi năm, ghét ai để than tắt giữa chừng. |
| thamba | Thẩm bà | bến Huyền Hà | song | ["ca_nuong_que","ca_chien","lau_ca"] | Bà bán cá đầu bến, nếm một đũa biết cá câu từ giờ nào. |
| tinhtrai | Sư thầy Tịnh Trai | Manh Phái Cốc | thon | ["chao_rau","rau_xao","canh_sen"] | Nấu chay cho cả cốc, dạy rằng vị thanh mới là vị khó. |
| daiho | Đại Hồ | bếp mỏ Khoáng Sơn | mo | ["com_tho_mo","thit_xong","ca_kho_to"] | Bếp mỏ to tiếng, chỉ quý người nấu được cho trăm thợ ăn no. |

**`CROPS`** (7)

| khoá | n | seed | h | out | kind | feed |
|---|---|---|---|---|---|---|
| rau | Rau | g_rau | 8 | {"rau":8} | ruong |  |
| lua | Lúa | g_lua | 24 | {"lua":12} | ruong |  |
| bong | Bông | g_bong | 36 | {"bong":6} | ruong |  |
| tra | Chè | g_tra | 48 | {"tra_la":6} | ruong |  |
| ga | Gà | g_ga | 24 | {"ga":1,"trung":4} | chuong | 2 |
| lon | Lợn | g_lon | 72 | {"lon":1} | chuong | 6 |
| bo | Bò | g_bo | 168 | {"bo":1} | chuong | 15 |

**`ITEMS`** (75)

| khoá | n | i | c | b | d | r | raw | fin | dur | k | tier | full |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| lua | Lúa thóc | 🌾 | grain | 1.2 | 0 | thon |  |  |  |  |  |  |
| gao | Gạo | 🍚 | grain | 3.8 | 0 | thon | 1 | 1 |  |  |  |  |
| bot | Bột mì | 🥣 | grain | 2.2 | 0 | thon | 1 |  |  |  |  |  |
| dau | Đậu nành | 🫘 | grain | 1.6 | 0 | thon | 1 |  |  |  |  |  |
| rau | Rau xanh | 🥬 | veg | 1.5 | 25 | thon | 1 |  |  |  |  |  |
| tra_la | Chè búp | 🍃 | veg | 3 | 48 | thon |  |  |  |  |  |  |
| bong | Bông | ☁ | misc | 2 | 0 | thon |  |  |  |  |  |  |
| thao_duoc | Thảo dược | 🌿 | veg | 5 | 72 | thon | 1 |  |  |  |  |  |
| trung | Trứng gà | 🥚 | meat | 1 | 72 | thon |  | 1 |  |  |  |  |
| ga | Gà sống | 🐓 | live | 26 | 0 | thon |  |  |  |  |  |  |
| lon | Lợn sống | 🐖 | live | 150 | 0 | thon |  |  |  |  |  |  |
| bo | Bò sống | 🐂 | live | 420 | 0 | thon |  |  |  |  |  |  |
| thit_ga | Thịt gà | 🍗 | meat | 9 | 25 | thon |  | 1 |  |  |  |  |
| thit_lon | Thịt lợn | 🥩 | meat | 10 | 25 | thon |  | 1 |  |  |  |  |
| thit_bo | Thịt bò | 🥩 | meat | 15 | 25 | thon |  | 1 |  |  |  |  |
| mo | Mỡ | 🧈 | meat | 3 | 50 | thon |  |  |  |  |  |  |
| xuong | Xương | 🦴 | meat | 1.5 | 25 | thon |  |  |  |  |  |  |
| da | Da thuộc | 🟫 | misc | 7 | 0 | thon |  | 1 |  |  |  |  |
| long | Lông gà | 🪶 | misc | 0.5 | 0 | thon |  |  |  |  |  |  |
| ca | Cá tươi | 🐟 | fish | 6 | 6 | song |  |  |  |  |  |  |
| tom | Tôm | 🦐 | fish | 9 | 6 | song |  |  |  |  |  |  |
| rong | Rong | 🌱 | veg | 2 | 25 | song |  |  |  |  |  |  |
| ca_kho | Cá khô | 🐠 | fish | 10 | 225 | song |  | 1 |  |  |  |  |
| tuong | Tương lên men | 🫙 | spice | 4 | 500 | song | 1 |  |  |  |  |  |
| muoi | Muối | 🧂 | spice | 1 | 0 | song | 1 |  |  |  |  |  |
| cam | Cám chăn nuôi | 🌰 | misc | 0.6 | 0 | thon | 1 |  |  |  |  |  |
| vai | Vải | 🧵 | misc | 14 | 0 | trung |  | 1 |  |  |  |  |
| bang | Khối băng | 🧊 | misc | 2 | 0 | song | 1 |  |  |  |  |  |
| phan | Phân bón | 💩 | misc | 1 | 0 | thon |  |  |  |  |  |  |
| oi | Đồ ôi | 🪰 | waste | 0.01 | 0 | thon |  |  |  |  |  |  |
| cuoc | Cuốc | ⛏ | tool | 30 | 0 | mo | 1 |  | 200 |  |  |  |
| dao | Dao mổ | 🔪 | tool | 25 | 0 | mo | 1 |  | 300 |  |  |  |
| g_rau | Hạt giống rau | 🌱 | seed | 2 | 0 | thon | 1 |  |  |  |  |  |
| g_lua | Mạ lúa | 🌱 | seed | 4 | 0 | thon | 1 |  |  |  |  |  |
| g_bong | Hạt bông | 🌱 | seed | 4 | 0 | thon | 1 |  |  |  |  |  |
| g_tra | Cây chè giống | 🌱 | seed | 6 | 0 | thon | 1 |  |  |  |  |  |
| g_ga | Gà con | 🐣 | seed | 6 | 0 | thon | 1 |  |  |  |  |  |
| g_lon | Lợn con | 🐷 | seed | 40 | 0 | thon | 1 |  |  |  |  |  |
| g_bo | Bê con | 🐮 | seed | 120 | 0 | thon | 1 |  |  |  |  |  |
| com_nam | Cơm nắm | 🍙 | dish | 3 | 12 | trung |  |  |  | 0.5 | 1 | 18 |
| banh_dau | Bánh đậu | 🟨 | dish | 3 | 12 | trung |  |  |  | 0.5 | 1 | 18 |
| mi_xao | Mì xào vội | 🍝 | dish | 3 | 12 | trung |  |  |  | 0.5 | 1 | 18 |
| trung_luoc | Trứng luộc | 🥚 | dish | 3 | 12 | trung |  |  |  | 0.5 | 1 | 18 |
| ca_nuong_que | Cá nướng que | 🍢 | dish | 5.3 | 12 | song |  |  |  | 0.5 | 1 | 18 |
| chao_rau | Cháo rau | 🥣 | dish | 3 | 12 | trung |  |  |  | 0.5 | 1 | 18 |
| thit_kho | Thịt kho | 🍖 | dish | 12.6 | 24 | trung |  |  |  | 0.5 | 2 | 30 |
| canh_rau | Canh rau xương | 🍲 | dish | 3 | 24 | trung |  |  |  | 0.5 | 2 | 30 |
| ca_chien | Cá chiên | 🐟 | dish | 8.1 | 24 | song |  |  |  | 0.5 | 2 | 30 |
| mi_nong | Mì nóng | 🍜 | dish | 4.7 | 24 | trung |  |  |  | 0.5 | 2 | 30 |
| com_ga | Cơm gà | 🍛 | dish | 11.5 | 24 | trung |  |  |  | 0.5 | 2 | 30 |
| dau_phu_sot | Đậu phụ sốt tương | 🧆 | dish | 4.3 | 24 | trung |  |  |  | 0.5 | 2 | 30 |
| canh_rong | Canh rong tôm | 🥘 | dish | 9.9 | 24 | song |  |  |  | 0.5 | 2 | 30 |
| thit_xong | Thịt xông khói | 🥓 | dish | 12.6 | 72 | mo |  |  |  | 0.5 | 2 | 30 |
| ca_kho_to | Cá kho tộ | 🍲 | dish | 12.6 | 72 | song |  |  |  | 0.5 | 2 | 30 |
| com_tho_mo | Suất cơm thợ mỏ | 🍱 | dish | 11.2 | 24 | mo |  |  |  | 0.5 | 2 | 30 |
| rau_xao | Rau xào mỡ tỏi | 🥗 | dish | 5.4 | 24 | thon |  |  |  | 0.5 | 2 | 30 |
| tra_dao | Trà đạo sơn cốc | 🍵 | dish | 3 | 24 | thon |  |  |  | 0.5 | 2 | 2 |
| ga_ham | Gà hầm thảo dược | 🍲 | dish | 27.6 | 6 | trung |  |  |  | 0.125 | 3 | 45 |
| bo_nuong_than | Bò nướng than hồng | 🔥 | dish | 37.2 | 6 | noido |  |  |  | 0.125 | 3 | 45 |
| yen_tiec | Yến tiệc liên hoa | 🪷 | dish | 27.6 | 6 | noido |  |  |  | 0.125 | 3 | 45 |
| lau_ca | Lẩu cá sông | 🫕 | dish | 18 | 6 | song |  |  |  | 0.125 | 3 | 45 |
| canh_sen | Canh sen hầm xương | 🥣 | dish | 11.4 | 6 | thon |  |  |  | 0.125 | 3 | 45 |
| diem_tam | Điểm tâm tinh xảo | 🥟 | dish | 18.7 | 6 | noido |  |  |  | 0.125 | 3 | 45 |
| xa_xiu | Xá xíu mật ong | 🍖 | dish | 21.6 | 6 | noido |  |  |  | 0.125 | 3 | 45 |
| suon_nuong | Sườn nướng than tre | 🍖 | dish | 18 | 6 | noido |  |  |  | 0.125 | 3 | 45 |
| bo_lui | Bò lụi tiêu rừng | 🍢 | dish | 28.8 | 6 | noido |  |  |  | 0.125 | 3 | 45 |
| ca_hap_gung | Cá hấp gừng sả | 🐟 | dish | 10.2 | 24 | song |  |  |  | 0.5 | 2 | 30 |
| tom_rang | Tôm rang muối | 🦐 | dish | 11.4 | 24 | song |  |  |  | 0.5 | 2 | 30 |
| canh_chua | Canh chua cá đồng | 🍲 | dish | 10.4 | 6 | song |  |  |  | 0.125 | 3 | 45 |
| dau_hu_nam | Đậu hũ non sốt nấm | 🍮 | dish | 3.8 | 24 | thon |  |  |  | 0.5 | 2 | 30 |
| chao_sen | Cháo hạt sen dưỡng tâm | 🥣 | dish | 8.2 | 6 | thon |  |  |  | 0.125 | 3 | 45 |
| rau_ngu_vi | Rau ngũ vị thanh trai | 🥗 | dish | 6.8 | 6 | thon |  |  |  | 0.125 | 3 | 45 |
| thit_muoi | Thịt muối chua | 🥓 | dish | 9.9 | 72 | mo |  |  |  | 0.5 | 2 | 30 |
| ca_kho_tieu | Cá khô kho tiêu | 🐠 | dish | 9.5 | 72 | mo |  |  |  | 0.5 | 2 | 30 |
| banh_mo | Bánh mỡ lò than | 🥮 | dish | 3.8 | 72 | mo |  |  |  | 0.5 | 2 | 30 |

**`NPC_RIVAL`** (5)

| khoá | giá trị |
|---|---|
| noido | 3 |
| trung | 4 |
| song | 1.5 |
| thon | 1 |
| mo | 1.5 |

**`PLOT`** (6)

| khoá | giá trị |
|---|---|
| max | 4 |
| rentWeek | 50 |
| waterH | 12 |
| dryLoss | 0.3 |
| jieqi | 0.2 |
| fert | 0.1 |

**`RECIPES`** (36)

| id | n | i | tier | ing | out | region | salted | drink | secret | step |
|---|---|---|---|---|---|---|---|---|---|---|
| com_nam | Cơm nắm | 🍙 | 1 | {"gao":1} | 2 |  |  |  |  |  |
| banh_dau | Bánh đậu | 🟨 | 1 | {"dau":2} | 2 |  |  |  |  |  |
| mi_xao | Mì xào vội | 🍝 | 1 | {"bot":1,"rau":1} | 2 |  |  |  |  |  |
| trung_luoc | Trứng luộc | 🥚 | 1 | {"trung":2} | 2 |  |  |  |  |  |
| ca_nuong_que | Cá nướng que | 🍢 | 1 | {"ca":1,"muoi":1} | 2 | song |  |  |  |  |
| chao_rau | Cháo rau | 🥣 | 1 | {"gao":1,"rau":1} | 3 |  |  |  |  |  |
| thit_kho | Thịt kho | 🍖 | 2 | {"thit_lon":1,"tuong":1} | 2 |  |  |  |  |  |
| canh_rau | Canh rau xương | 🍲 | 2 | {"rau":2,"xuong":1} | 3 |  |  |  |  |  |
| ca_chien | Cá chiên | 🐟 | 2 | {"ca":1,"mo":1} | 2 | song |  |  |  |  |
| mi_nong | Mì nóng | 🍜 | 2 | {"bot":1,"xuong":1,"rau":1} | 2 |  |  |  |  |  |
| com_ga | Cơm gà | 🍛 | 2 | {"gao":1,"thit_ga":1} | 2 |  |  |  |  |  |
| dau_phu_sot | Đậu phụ sốt tương | 🧆 | 2 | {"dau":2,"tuong":1} | 3 |  |  |  |  |  |
| canh_rong | Canh rong tôm | 🥘 | 2 | {"rong":1,"tom":1} | 2 | song |  |  |  |  |
| thit_xong | Thịt xông khói | 🥓 | 2 | {"thit_lon":2,"muoi":1} | 3 | mo | 1 |  |  |  |
| ca_kho_to | Cá kho tộ | 🍲 | 2 | {"ca_kho":1,"tuong":1} | 2 | song | 1 |  |  |  |
| com_tho_mo | Suất cơm thợ mỏ | 🍱 | 2 | {"gao":2,"thit_lon":1,"muoi":1} | 3 | mo |  |  |  |  |
| rau_xao | Rau xào mỡ tỏi | 🥗 | 2 | {"rau":2,"mo":1} | 2 | thon |  |  |  |  |
| tra_dao | Trà đạo sơn cốc | 🍵 | 2 | {"tra_la":1} | 3 | thon |  | 1 |  |  |
| ga_ham | Gà hầm thảo dược | 🍲 | 3 | {"thit_ga":2,"thao_duoc":1} | 2 |  |  |  |  |  |
| bo_nuong_than | Bò nướng than hồng | 🔥 | 3 | {"thit_bo":2,"muoi":1} | 2 | noido |  |  |  |  |
| yen_tiec | Yến tiệc liên hoa | 🪷 | 3 | {"thit_bo":1,"thit_ga":1,"tom":1,"rau":1} | 3 | noido |  |  |  |  |
| lau_ca | Lẩu cá sông | 🫕 | 3 | {"ca":2,"tom":1,"rau":1} | 3 | song |  |  |  |  |
| canh_sen | Canh sen hầm xương | 🥣 | 3 | {"xuong":2,"thao_duoc":1,"rau":1} | 2 | thon |  |  |  |  |
| diem_tam | Điểm tâm tinh xảo | 🥟 | 3 | {"bot":2,"tom":1,"thit_lon":1} | 3 | noido |  |  |  |  |
| xa_xiu | Xá xíu mật ong | 🍖 | 3 | {"thit_lon":2,"tuong":1,"mo":1} | 3 | noido |  |  | hoadau | 1 |
| suon_nuong | Sườn nướng than tre | 🍖 | 3 | {"thit_lon":2,"xuong":1,"muoi":1} | 3 | noido |  |  | hoadau | 2 |
| bo_lui | Bò lụi tiêu rừng | 🍢 | 3 | {"thit_bo":2,"muoi":1,"thao_duoc":1} | 3 | noido |  |  | hoadau | 3 |
| ca_hap_gung | Cá hấp gừng sả | 🐟 | 2 | {"ca":2,"thao_duoc":1} | 3 | song |  |  | thamba | 1 |
| tom_rang | Tôm rang muối | 🦐 | 2 | {"tom":2,"muoi":1} | 3 | song |  |  | thamba | 2 |
| canh_chua | Canh chua cá đồng | 🍲 | 3 | {"ca":1,"rau":2,"tuong":1} | 3 | song |  |  | thamba | 3 |
| dau_hu_nam | Đậu hũ non sốt nấm | 🍮 | 2 | {"dau":3,"rau":1} | 3 | thon |  |  | tinhtrai | 1 |
| chao_sen | Cháo hạt sen dưỡng tâm | 🥣 | 3 | {"gao":1,"thao_duoc":1,"rau":1} | 3 | thon |  |  | tinhtrai | 2 |
| rau_ngu_vi | Rau ngũ vị thanh trai | 🥗 | 3 | {"rau":3,"tuong":1} | 3 | thon |  |  | tinhtrai | 3 |
| thit_muoi | Thịt muối chua | 🥓 | 2 | {"thit_lon":2,"muoi":2} | 4 | mo | 1 |  | daiho | 1 |
| ca_kho_tieu | Cá khô kho tiêu | 🐠 | 2 | {"ca_kho":2,"muoi":1} | 4 | mo | 1 |  | daiho | 2 |
| banh_mo | Bánh mỡ lò than | 🥮 | 2 | {"bot":2,"mo":1,"muoi":1} | 4 | mo | 1 |  | daiho | 3 |

**`REGIONS`** (5)

| khoá | name | wx | pop | buy | like | stale |
|---|---|---|---|---|---|---|
| noido | Nội đô thượng lưu | 金 | 520 | 2.5 | ["bo_nuong_than","diem_tam","xa_xiu","suon_nuong","bo_lui"] |  |
| trung | Trung Thành | 火 | 1300 | 1.2 | [] |  |
| song | Sông nước | 水 | 480 | 1 | ["ca_chien","canh_rong","ca_kho_to","lau_ca","ca_hap_gung","tom_rang","canh_chua"] |  |
| thon | Thôn dã & thung lũng | 木 | 420 | 0.8 | ["rau_xao","tra_dao","canh_sen","dau_hu_nam","chao_sen","rau_ngu_vi"] | 0.7 |
| mo | Mỏ & xưởng | 土 | 460 | 1 | ["thit_xong","com_tho_mo","thit_muoi","ca_kho_tieu","banh_mo"] |  |

**`TIERS`** (3)

| khoá | d | k | mul | full | wake | hp | tox | buff |
|---|---|---|---|---|---|---|---|---|
| 1 | 12 | 0.5 | 1.5 | 18 | 0 | 0 | 1.5 |  |
| 2 | 24 | 0.5 | 1.8 | 30 | 6 | 2 | 0 |  |
| 3 | 6 | 0.125 | 2.4 | 45 | 12 | 6 | 0 | 0.2 |

**`VENUE_TIERS`** (3)

| khoá | name | slots | rent | license | fixed | cap | tiers | deposit | rainCut | tax |
|---|---|---|---|---|---|---|---|---|---|---|
| stall | Quầy lề đường | 24 | 20 | 7 | 0 | 60 | [1,2] | 0 | 0.6 |  |
| diner | Quán cơm bình dân | 12 | 400 | 10 | 75 | 420 | [1,2,3] | 0 |  |  |
| fine | Tửu lâu thượng hạng | 4 | 1500 | 170 | 420 | 1400 | [1,2,3] | 30 |  | 0.005 |

**`WILD`** (1)

| khoá | cap | regen | yield |
|---|---|---|---|
| fish | 40 | 0.1 | {"ca":[1,3],"tom":[0,1]} |

### `inventory.js`

| hằng số | giá trị |
|---|---|
| `BAG_MAX` | 40 |
| `CELLAR_MAX` | 12 |
| `HOUR` | 3600000 |
| `ICE_H` | 12 |

### `market.js`

| hằng số | giá trị |
|---|---|
| `BAND` | [0.3,3] |
| `DAY` | 86400000 |
| `FEE` | 0.03 |
| `HOLD_MS` | 86400000 |
| `LIST_DAYS` | 7 |
| `PAIR_CAP` | 20000 |
| `SEAL` | 1.3 |
| `STORE_FEE` | 1 |
| `TH_DOWN` | 0.6 |
| `TH_QUOTA` | 2000 |
| `TH_UP` | 1.4 |

### `production.js`

**`SEASON`** (4)

| khoá | giá trị |
|---|---|
| rau | [1,12] |
| lua | [4,9] |
| bong | [3,8] |
| tra | [2,5] |

### `cuisine.js`

| hằng số | giá trị |
|---|---|
| `SKILL_STEPS` | [100,400,1200] |

### `econ-core.js`

| hằng số | giá trị |
|---|---|
| `AGE` | {"thay":1209600000,"cuoi":604800000} |

## 18 · Huyền học, tu luyện, luân hồi

### `huyenhoc.js`

| hằng số | giá trị |
|---|---|
| `BAD` | {"benh":"Cảm mạo vặt","moctui":"Bị móc túi ở chợ","tainan":"Sơ ý bị thương"} |
| `GOOD` | {"quynhan":"Quý nhân phù trợ — tiền công hôm nay hậu hơn 20%","nhatcua":"Nhặt được của rơi"} |
| `PHONGSINH_DONG` | 30 |
| `ngWords` | ["khí sắc trong sáng, lòng không vướng bận","ấn đường hơi mờ, có việc nhỏ chưa xong","khí sắc u ám, e có nợ cũ chưa trả","mây đen phủ ấn đường, nghiệp chướng đè nặng","tội nghiệt chồng chất, mau sám h… |

**`AD_LEVELS`** (5)

| min | name |
|---|---|
| -Infinity | Bạc Phúc |
| 0 | Bình Thường |
| 5 | Có Phúc |
| 15 | Phúc Dày |
| 40 | Đại Phúc Đức |

**`NG_LEVELS`** (5)

| max | name |
|---|---|
| 0 | Trong Sạch |
| 9 | Vướng Bận |
| 29 | Nặng Nợ |
| 59 | Nghiệp Chướng |
| Infinity | Tội Nghiệt |

### `amduc.js`

| hằng số | giá trị |
|---|---|
| `NEED` | {"minutes":20,"meals":2} |
| `PENALTY` | {"convict":-5,"quit":-2,"neglect":-3} |

**`TIERS`** (5)

| min | name | text |
|---|---|---|
| 0 | Chưa có vận khí |  |
| 1 | Thân Tâm An Lạc | No tụt chậm hơn 5% · làm việc đỡ mệt 5% |
| 4 | Quý Nhân Mỉm Cười | rủi ro lao động giảm một nửa · thầy thuốc bớt 5% |
| 8 | Thời Vận Hanh Thông | thưởng đơn hàng / nhiệm vụ +10% |
| 15 | Phúc Trạch Vô Cương | một lần thoát chết |

### `realm.js`

**`PHAP`** (11)

| id | branch | name | cost | realm | eff | text | wx |
|---|---|---|---|---|---|---|---|
| khinhcong | Thân pháp | Khinh Công | 40 | 1 | [0.1,0.2,0.3] | hao thể lực khi chạy −10% → −30% |  |
| ngutphong | Thân pháp | Ngự Phong | 80 | 2 | [0.05,0.1,0.15] | bay nhanh +5% → +15% (trần chung +35%) | ["木","金"] |
| thuythuong | Thân pháp | Thủy Thượng Phiêu | 120 | 2 | [0.15,0.3,0.45] | đạp nước tốn thể lực giảm 15% → 45% | ["水"] |
| tichcoc | Dưỡng sinh | Tích Cốc | 50 | 1 | [0.05,0.1,0.15] | No tụt chậm 5% → 15% | ["土"] |
| kimcuong | Dưỡng sinh | Kim Cương Thân | 60 | 1 | [0.1,0.2,0.3] | kháng bệnh 10% → 30% |  |
| anthan | Dưỡng sinh | An Thần | 50 | 1 | [0.1,0.2,0.3] | ngủ hồi Tỉnh +10% → +30% | ["水"] |
| thiennhan | Mệnh thuật | Thiên Nhãn | 70 | 2 | [1,2,3] | luận quẻ / lá số sâu hơn ở các gian |  |
| vongkhi | Mệnh thuật | Vọng Khí | 70 | 2 | [1,2,3] | thấy mức Âm Đức / Nghiệp, thấy trước sự kiện dữ | ["火"] |
| bachnghe | Nghề | Bách Nghệ | 60 | 1 | [0.1,0.2,0.3] | tay nghề nghề hợp Dụng / Hỷ +10% → +30% |  |
| thuongdao | Nghề | Thương Đạo | 60 | 2 | [0.01,0.02,0.03] | phí ký gửi ở chợ −1% → −3% (khi có chợ — P9) | ["金"] |
| trachphap | Phong thủy | Trạch Pháp | 50 | 1 | [5,10,15] | điểm phong thủy nhà +5 → +15 |  |

**`REALMS`** (7)

| id | name | min | max | need |
|---|---|---|---|---|
| phamnhan | Phàm Nhân | 1 | 4 |  |
| luyenkhi | Luyện Khí | 5 | 9 | {"ad":1} |
| trucco | Trúc Cơ | 10 | 14 | {"ad":2,"ng":1,"meditate":60} |
| kimdan | Kim Đan | 15 | 19 | {"ad":2,"ng":1,"meditate":60,"reading":true} |
| nguyenanh | Nguyên Anh | 20 | 29 | {"ad":3,"ng":1,"meditate":90} |
| hoathan | Hóa Thần | 30 | 39 | {"ad":3,"ng":0,"meditate":120} |
| dacdao | Đắc Đạo | 40 | Infinity | {"ad":4,"ng":0,"meditate":180,"kiep":true} |

### `luanhoi.js`

| hằng số | giá trị |
|---|---|
| `FUNERAL` | 0.2 |
| `ILL_DEATH_H` | 12 |
| `STARVE_LOW` | 15 |

**`PATHS`** (6)

| id | name | min | charts | start | keepRealm | text | stamina | karmaMul | interlude | karma | karmaTo |
|---|---|---|---|---|---|---|---|---|---|---|---|
| thien | Thiên đạo | 120 | 3 | 5000 | true | chọn 1 trong 3 lá số đẹp, gia thế khá (5 lượng bạc khởi nghiệp) |  |  |  |  |  |
| atula | A-tu-la đạo | 80 | 2 | 300 |  | dòng võ: thể lực +15%, nhưng Nghiệp sinh ra ×1,2 kiếp này | 1.15 | 1.2 |  |  |  |
| nhan | Nhân đạo | 20 | 1 | 300 |  | lá số được rút, khởi đầu như người mới (300 đồng) |  |  |  |  |  |
| sucsinh | Súc sinh đạo | -20 |  |  |  | một kiếp linh thú ngắn (20 phút) rồi đầu thai Nhân đạo |  |  | 20 | -20 |  |
| ngaquy | Ngạ quỷ đạo | -60 |  |  |  | một kiếp quỷ đói ngắn — chờ người sống cúng cô hồn (tối đa 25 phút) |  |  | 25 | -40 |  |
| diangu | Địa ngục đạo | -Infinity |  |  |  | trả nghiệp ở Thập Điện — đào nghiệp thạch (20 phút) |  |  | 20 |  | 5 |

## 19 · Luật và hình phạt

### `law.js`

| hằng số | giá trị |
|---|---|
| `BAIL_PER_MIN` | 12000 |
| `FINE_XU` | 400 |
| `PARDON_NGOC` | 300 |
| `PERMA_AT` | 7 |
| `RESPAWN_MS` | 1200000 |

**`ARTICLES`** (11)

| # | c0 | c1 |
|---|---|---|
| 1 | Điều 1 · Hộ thành đại trận | Trong tường Bát Quái Thành, mọi công trình được đại trận che chở — không ai phá nổi. |
| 2 | Điều 2 · Phá hoại địa khí | Phá công trình ngoài thành là tội phá hoại địa khí; điểm tội tính theo cỡ công trình. |
| 3 | Điều 3 · Bát Môn | Phá ở hướng cát môn (Hưu, Sinh, Khai) là phá cát khí: tội nặng gấp 1,6. Cảnh, Đỗ: 1,2. Hung môn (Tử, Kinh, Thương): 0,8. |
| 4 | Điều 4 · Phạm Thái Tuế | Phạm tội vào ngày địa chi xung tuổi mình: tội nặng gấp 1,5. |
| 5 | Điều 5 · Ngũ hành | Công trình mang hành sinh trợ Dụng thần của người phạm: tự phá phúc mình, tội ×1,3. Mang hành Kỵ thần: ×0,7. |
| 6 | Điều 6 · Tái phạm | Mỗi tiền án làm tội nặng thêm 50%. Tái phạm lần thứ 7 trở đi: khổ sai vĩnh viễn tại Khoáng Sơn. |
| 7 | Điều 7 · Khung hình phạt | Dưới 20 điểm: phạt Phúc Khí. 20–60: giam Thiên Lao. Trên 60: đày Khoáng Sơn khổ sai, đào đủ quặng mới được tha. |
| 8 | Điều 8 · Nộp phạt | Không đủ Phúc Khí nộp phạt thì chuyển sang giam Thiên Lao. |
| 9 | Điều 9 · Vượt ngục | Rời Thiên Lao hay bỏ trốn khỏi Khoáng Sơn khi chưa mãn hạn: án tăng gấp đôi. |
| 10 | Điều 10 · Đại Xá | Khổ sai vĩnh viễn chỉ được tha khi nộp Đại Xá (Ngọc) tại Khoáng Sơn. |
| 11 | Điều 11 · Chuộc tội | Người bị giam Thiên Lao được nộp Phúc Khí chuộc phần hạn còn lại (30 Phúc Khí mỗi phút). Khổ sai không được chuộc bằng Phúc Khí. |

**`GATE_FACTOR`** (8)

| khoá | giá trị |
|---|---|
| Hưu Môn | 1.6 |
| Sinh Môn | 1.6 |
| Khai Môn | 1.6 |
| Cảnh Môn | 1.2 |
| Đỗ Môn | 1.2 |
| Tử Môn | 0.8 |
| Kinh Môn | 0.8 |
| Thương Môn | 0.8 |

### `prison.js`

**`CELLS`** (4)

| x | z | w | d |
|---|---|---|---|
| 4491 | 317 | 8 | 7 |
| 4501 | 317 | 8 | 7 |
| 4511 | 317 | 8 | 7 |
| 4521 | 317 | 8 | 7 |

**`JAIL`** (6)

| khoá | giá trị |
|---|---|
| key | law:jail |
| name | Thiên Lao |
| x | 4506 |
| z | 330 |
| w | 44 |
| d | 34 |

**`MINE`** (6)

| khoá | giá trị |
|---|---|
| key | law:mine |
| name | Khoáng Sơn |
| x | 4736 |
| z | 340 |
| w | 96 |
| d | 74 |

## 20 · Xã hội

### `civil.js`

| hằng số | giá trị |
|---|---|
| `D` | 86400000 |
| `H` | 3600000 |
| `MAX_YEAR` | 3 |
| `PHRASES` | ["Nguyện cùng nhau đi hết đường đời — người có bằng lòng không?","Trăng Huyền Thành chứng giám, ta muốn kết tóc se duyên cùng người.","Một đời một kiếp, xin người nhận lấy tấm lòng này."] |
| `PROPOSAL_MS` | 259200000 |
| `WAIT_REMARRY` | 2592000000 |

**`TIERS`** (3)

| khoá | name | fee | extra | assetPct | fund | buffDays | upkeep | text | title |
|---|---|---|---|---|---|---|---|---|---|
| hanvi | Hàn vi | 60 | 0 | 0 | false | 0 | 0 | Hôn thư; hai người tự ăn chung một bữa ở quầy cơm. |  |
| trungluu | Trung lưu | 600 | 2000 | 0 | true | 7 | 0 | Tiệc sảnh tửu lâu · «Hỷ khí» 7 ngày (ngủ hồi Tỉnh +10%, làm việc đỡ hao 5%) · quỹ chung. |  |
| thuongluu | Thượng lưu | 5000 | 30000 | 0.005 | true | 7 | 20 | Thuyền hoa hồ Cùng Thông · danh hiệu «Phu thê» · danh vọng kinh doanh +10 · quỹ chung (phí… | Phu thê |

## 21 · NPC và AI

### `npc-chat-core.js`

| hằng số | giá trị |
|---|---|
| `MAX_IN` | 300 |
| `QUOTA` | {"chat":30,"biz":10} |
| `SAFE_LINE` | Chuyện ấy ngoài phận sự kẻ hèn này — trong Huyền Thành, ta chỉ bàn chuyện thành, chuyện mệnh thôi. |

### `persona-data.js`

**`PERSONAS`** (20)

| id | tên | aiEnabled | runtime | xưng hô | số bark |
|---|---|---|---|---|---|
| van_coc | Vân Cốc (thiền sư) | co |  | {"tuXung":"lão tăng","goi":"con"} | 10 |
| khong_tiensinh | Khổng tiên sinh | co |  | {"tuXung":"ta","goi":"ngươi"} | 8 |
| thay_tubinh | Thầy Tử Bình | co |  | {"tuXung":"thầy","goi":"con"} | 8 |
| truong_thiensu | Trương Thiên Sư | kichban |  | {"tuXung":"bần đạo","goi":"thí chủ"} | 9 |
| dieu_am | Ni sư Diệu Âm | kichban |  | {"tuXung":"sư","goi":"con"} | 10 |
| te_tuu | Tế tửu Văn Miếu (Chu Văn Trinh) | co |  | {"tuXung":"lão phu","goi":"trò"} | 10 |
| huyen_hu | Huyền Hư chân nhân (Võ Đăng) | co |  | {"tuXung":"lão đạo","goi":"tiểu hữu"} | 10 |
| khau_daotruong | Khâu đạo trưởng (Chung Nam) | kichban |  | {"tuXung":"bần đạo","goi":"đạo hữu"} | 10 |
| maoshan_daonhan | Mao Sơn đạo nhân (Mao Tiểu Tùng) | co |  | {"tuXung":"tôi","goi":"anh/chị"} | 8 |
| truclam_thiensu | Thiền sư Trúc Lâm (Yên Tử) | kichban |  | {"tuXung":"thầy","goi":"con"} | 10 |
| lama_dakiet | Lạt-ma Đa Kiệt (Tàng Địa) | kichban | false (khoá) | {"tuXung":"tôi","goi":"bạn"} | 9 |
| phan_quan | Phán quan Thôi | co |  | {"tuXung":"bổn quan","goi":"ngươi"} | 8 |
| diatang_su | Địa Tạng sứ giả | co |  | {"tuXung":"tôi","goi":"bạn"} | 10 |
| vu_y_amau | Vu y bà A Mậu | kichban |  | {"tuXung":"bà","goi":"cháu"} | 10 |
| lo_ban_su | Yểm sư Lỗ Ban (Công Thâu Nghiệt) | khong |  | {"tuXung":"tôi","goi":"bạn trẻ"} | 9 |
| dinh_menh_hoi | Định Mệnh Hội | khong |  | {"tuXung":"ta","goi":"ngươi"} | 9 |
| gac_cong | Lão Tùng (gác cổng Sơn Môn) | khong |  | {"tuXung":"lão","goi":"khách"} | 10 |
| tho_may | Bà Tư thợ may (Tiên Y) | khong |  | {"tuXung":"bà","goi":"con"} | 8 |
| dan_dinh | Đan Đỉnh chân nhân (Cát Huyền) | co |  | {"tuXung":"thầy","goi":"con"} | 11 |
| phuong_si | Phương sĩ Vô Danh | co |  | {"tuXung":"kẻ này","goi":"người lạ"} | 10 |

### `bark-pool.js`

**`BARK_POOLS`** — số câu mỗi nhóm

| khoá | giá trị |
|---|---|
| van_coc | 10 |
| khong_tiensinh | 8 |
| thay_tubinh | 8 |
| truong_thiensu | 9 |
| dieu_am | 10 |
| te_tuu | 10 |
| huyen_hu | 10 |
| khau_daotruong | 10 |
| maoshan_daonhan | 8 |
| truclam_thiensu | 10 |
| lama_dakiet | 9 |
| phan_quan | 8 |
| diatang_su | 10 |
| vu_y_amau | 10 |
| lo_ban_su | 9 |
| dinh_menh_hoi | 9 |
| gac_cong | 10 |
| tho_may | 8 |
| dan_dinh | 11 |
| phuong_si | 10 |
| khach_dieuhau | 5 |
| khach_cachcuc | 5 |
| xam | 5 |
| que | 10 |
| huong | 4 |
| tra | 1 |
| sen | 1 |
| la_ban | 2 |
| lich | 2 |

### `batquai.js › CITIZENS` — dân Nội Thành theo cung

| khoá | giá trị |
|---|---|
| li | 5 |
| kun | 4 |
| dui | 5 |
| qian | 4 |
| kan | 2 |
| gen | 4 |
| zhen | 5 |
| xun | 4 |

