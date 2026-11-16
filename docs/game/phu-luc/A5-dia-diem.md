<!-- TỆP SINH TỰ ĐỘNG bởi scripts/docs-game-gen.mjs — KHÔNG SỬA TAY. Sinh lại: node scripts/docs-game-gen.mjs -->
# A5 · Thế giới: hằng số bố cục và danh sách địa điểm

> Sinh từ mã nguồn. Khi một con số ở chương khác lệch với tệp này thì **tệp này (tức là mã đang chạy) thắng** và chương kia phải sửa.

## A5.1 Số lượng đếm từ bộ sinh

| hằng số | giá trị |
|---|---|
| `nhà trong thành — `city4.allHouses()`` | {"tổng":18152,"phongthuy":793,"gom":638,"huong":836,"hoavien":769,"home":8940,"tralau":665,"tuu":669,"thuhoa":799,"duoc":664,"tratrang":717,"moc":736,"den":786,"loren":787,"service":16,"dichtram":16,"temple":16,"namon":16,"fortune":289} |
| `cửa hàng — `shops.cityShops()`` | {"tổng":8560,"phongthuy":771,"thuhoa":765,"duoc":642,"tralau":626,"tuu":630,"tratrang":688,"moc":712,"den":755,"hoavien":740,"gom":613,"loren":768,"huong":802,"tientrang":16,"dichtram":16,"namon":16} |
| `cửa vào được — `homes.enterables()`` | {"tổng":17411,"knock":8514,"shop":8560,"est":27,"temple":21,"fortune":289} |
| `cầu trong thành — `bridges.cityBridges()`` | 0 |
| `nhà rao bán — `estate-core.LISTING_COUNT`` | 292 |

## A5.2 Theo mô-đun

### `terrain.js`

| hằng số | giá trị |
|---|---|
| `CITY_OCT` | 2125 |
| `CLOUD_SEA` | -70 |
| `EDGE` | 3800 |
| `HALF` | 4096 |
| `MAX_WALK_SLOPE` | 0.9004040442978399 |
| `PEAK_PAD` | 200 |
| `ROOM_X0` | 4346 |
| `ROOM_X1` | 6666 |
| `SCALE` | 1.6 |
| `SKY_BRIDGE_W` | 5 |
| `SKY_SEG` | 40 |
| `SKY_Y` | 460 |
| `WATER` | -6 |
| `WORLD` | 8192 |

**`CLEARINGS`** (7)

| x | z | r |
|---|---|---|
| 1176 | -57.6 | 72 |
| -1289.6000000000001 | 99.2 | 72 |
| 768 | 672 | 72 |
| 0 | -1008 | 72 |
| -907.2 | 804.8000000000001 | 72 |
| 1046.4 | -705.6 | 72 |
| -833.6 | -860.8000000000001 | 72 |

**`REGIONS`** (8)

| id | name | x | z | r | kind | h |
|---|---|---|---|---|---|---|
| thanh | Huyền Thành | 0 | 0 | 2200 | city | 0 |
| tubinh | Tử Bình Phong | -2085.9650045003154 | -2085.9650045003154 | 368 | peak | 420 |
| manh | Manh Phái Cốc | 2085.9650045003154 | -2085.9650045003154 | 368 | valley | 300 |
| trichthien | Trích Thiên Đỉnh | -2085.9650045003154 | 2085.9650045003154 | 336 | peak | 380 |
| cungthong | Cùng Thông Hồ | 1110.2 | 728.3 | 165 | lake | -14 |
| thulau | Thư Lâu Lâm | 0 | -2950 | 256 | plateau | 110 |
| phongthuy | Phong Thủy Viên | -2950 | 0 | 240 | plateau | 55 |
| lichduong | Lịch Đường | 2950 | 0 | 240 | plateau | 55 |

**`SKY_BRIDGES`** (4)

| id | a | b | ux | uz | segs |
|---|---|---|---|---|---|
| thienban-quanthinh | {"x":178.5244623010948,"z":-92.8327203965693} | {"x":413.3994192531564,"z":-214.96769801164132} | 0.8872168012345951 | -0.4613527366419895 | [{"x":196.2687983257867,"z":-102.05977512940909,"ry":2.0503156187874927},{"x":231.75747037… |
| thienban-thudao | {"x":-178.61272701280404,"z":-100.02312712717027} | {"x":-413.31115454144714,"z":-231.4542465432104} | -0.8725060159497199 | -0.48860336893184314 | [{"x":-196.06284733179845,"z":-109.79519450580713,"ry":-2.0812846487116725},{"x":-230.9630… |
| thienban-laungoc | {"x":7.691379364521552,"z":-246.12413966468966} | {"x":16.24801457487239,"z":-519.9364663959165} | 0.031234752377721213 | -0.9995120760870788 | [{"x":8.316074412075976,"z":-266.1143811864312,"ry":3.110352820159525},{"x":9.565464507184… |
| thienban-thiendan | {"x":-14.91984793012774,"z":238.71756688204383} | {"x":-32.727210893401676,"z":523.6353742944268} | -0.06237828615518053 | 0.9980525784828885 | [{"x":-16.16741365323135,"z":258.6786184517016,"ry":-0.06241880999595735},{"x":-18.6625450… |

**`SKY_DISTRICT`** (9)

| id | name | x | z | y | r |
|---|---|---|---|---|---|
| thienban | Thiên Bàn Đảo | 0 | 0 | 460 | 260 |
| quanthinh | Quan Tinh Đảo | 500 | -260 | 460 | 130 |
| thudao | Thư Đạo Đảo | -500 | -280 | 460 | 130 |
| laungoc | Lầu Ngọc Đảo | 20 | -640 | 460 | 130 |
| thiendan | Thiên Đàn Đảo | -40 | 640 | 460 | 130 |
| thienquan | Thiền Quán Đảo | -640 | 420 | 460 | 130 |
| ansi | Ứn Sĩ Đảo | 640 | 420 | 460 | 90 |
| duocvien | Dược Viên Đảo | 1290 | 60 | 460 | 90 |
| vancanh | Vân Cảnh Đảo | -1290 | 60 | 460 | 90 |

**`SKY_ISLAND`** (6)

| khoá | giá trị |
|---|---|
| id | thienban |
| name | Thiên Bàn Đảo |
| x | 0 |
| z | 0 |
| y | 460 |
| r | 260 |

### `citylayout.js`

| hằng số | giá trị |
|---|---|
| `FRONT_KINDS` | ["avenue","ring","plaza"] |
| `STREET_TYPES` | ["moc","gom","den","thuhoa","hoavien","phongthuy","huong","tratrang","duoc","loren"] |

**`CITY`** (20)

| khoá | giá trị |
|---|---|
| A | 2125 |
| WALL_T | 8 |
| CELL | 256 |
| SEED | huyen-thanh-v4 |
| NOI_A | 380 |
| TRUNG_A | 1050 |
| SONMON_A | 190 |
| RINGS | [380,700,1050,1500,1850] |
| AVE_W | 32 |
| RING_W | 24 |
| STREET_W | 12 |
| ALLEY_W | 6 |
| COL | 120 |
| ROW | 80 |
| SETBACK | 1 |
| CHAMFER | 20 |
| COURT_INSET | 22 |
| GATE_W | 40 |
| RIVER_U | 1360 |
| QUAY_W | 10 |

**`NGOAI`** (8)

| khoá | name | hall | region | uc | side | port |
|---|---|---|---|---|---|---|
| kan | Khảm · Thư Lâu | {"id":"thuvien","name":"Thư Lâu"} | thulau | 1350 | 1 |  |
| qian | Càn · Tử Bình | {"id":"cachcuc","name":"Sảnh Cách Cục"} | tubinh | 1350 | 1 |  |
| gen | Cấn · Manh Phái | {"id":"tuongphap","name":"Sảnh Tượng Pháp"} | manh | 1350 | 1 |  |
| zhen | Chấn · Lịch Đường | {"id":"trach","name":"Sảnh Trạch Nhật"} | lichduong | 1350 | 1 |  |
| xun | Tốn · Cùng Thông Hồ | {"id":"dieuhau","name":"Sảnh Điều Hậu"} | cungthong | 1150 | -1 |  |
| li | Ly · Nam Môn | {"id":"namoncang","name":"Nam Môn Cảng"} | thanh | 1150 | 1 | true |
| kun | Khôn · Trích Thiên | {"id":"tuvi","name":"Sảnh Tử Vi"} | trichthien | 1150 | 1 |  |
| dui | Đoài · Phong Thủy Viên | {"id":"duongtrach","name":"Sảnh Dương Trạch"} | phongthuy | 1350 | 1 |  |

### `batquai.js`

| hằng số | giá trị |
|---|---|
| `AVE_W` | 7 |
| `EMBLEM_U` | 128 |
| `HOUSE_S` | 12 |
| `LION` | {"v":9.5,"h":2} |
| `OCT_A` | 158 |
| `OCT_SIDE` | 130.89148570989803 |
| `OCT_V` | 171.01796764619826 |
| `POST_U` | [112,124,136] |
| `POST_V` | 5 |
| `RING_A` | 100 |
| `RING_W` | 6 |
| `STELE` | {"u":106,"v":-6} |
| `TAN8` | 0.41421356237309503 |
| `WALL_H` | 14 |
| `WALL_T` | 5 |

**`DISTRICTS`** (8)

| khoá | buildings | houses | trees | fields | pond | treeModel | yard | well | stele | emblem | rocks | arena |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| li | [{"model":["bq_alchemy_hall","hall_main"],"fit":{"width":22},"u":120,"v":30,"foot":[22,20.… | [[84,26],[84,-26]] | [] |  |  |  |  |  |  |  |  |  |
| kun | [{"model":["bq_granary","lib_mtn_house"],"fit":{"height":9.5},"u":120,"v":-27,"foot":[12,1… | [[146,42],[146,-42]] | [[108,14],[128,-10]] | [{"u":140,"v":30,"w":16,"d":12},{"u":140,"v":-28,"w":12,"d":12}] |  |  |  |  |  |  |  |  |
| dui | [{"model":["bq_teahouse","tea_pavilion"],"fit":{"width":24},"u":124,"v":-27,"foot":[24,22.… | [[144,36],[144,-36],[80,-26]] | [[70,-12],[108,12],[108,-10]] |  | {"u":80,"v":24,"w":28,"d":20} | lib_willow |  |  |  |  |  |  |
| qian | [{"model":["bq_sword_tower","library_tower"],"fit":{"width":20},"u":124,"v":-27,"foot":[20… | [[146,-36]] | [[108,-12]] |  |  |  | {"u":138,"v":26,"w":16,"d":14} |  |  |  |  |  |
| kan | [] | [] | [] |  |  |  |  | {"x":-56,"z":-72.5} | {"x":-60,"z":-76} | {"x":22,"z":-71} |  |  |
| gen | [{"model":["bq_pagoda","lib_pagoda_red"],"fit":{"width":26},"u":126,"v":27,"foot":[32,34.7… | [[146,-40]] | [] |  |  |  |  |  |  |  | [[144,-30,6],[108,-12,5]] |  |
| zhen | [{"model":["bq_thunder_hall","hall_main"],"fit":{"width":24},"u":124,"v":-28,"foot":[24,24… | [[80,26],[144,38],[144,-38]] | [[108,14]] |  |  |  |  |  |  |  |  | {"u":80,"v":-24,"r":9.5} |
| xun | [{"model":["bq_library_pagoda","lib_pagoda5"],"fit":{"height":32},"u":126,"v":-27,"foot":[… | [[146,-38]] | [[108,-12],[128,-9]] | [{"u":142,"v":26,"w":14,"d":10,"herb":true}] |  | lib_blossom |  |  |  |  |  |  |

**`GUA`** (8)

| id | name | sym | lines | wx | dir | gate | district | theme | color |
|---|---|---|---|---|---|---|---|---|---|
| li | Ly | ☲ | [1,0,1] | 火 | [0,1] | Cảnh Môn | Ly Hỏa Phường | Chợ phiên, lò luyện đan, tửu lâu | #d8452e |
| kun | Khôn | ☷ | [0,0,0] | 土 | [-0.7071067811865476,0.7071067811865476] | Tử Môn | Khôn Nguyên Điền | Linh điền, kho lương, nông gia | #c99a3e |
| dui | Đoài | ☱ | [1,1,0] | 金 | [-1,0] | Kinh Môn | Đoài Trạch Lâu | Hồ trạch, trà lâu, cầm ca | #e7e1d2 |
| qian | Càn | ☰ | [1,1,1] | 金 | [-0.7071067811865476,-0.7071067811865476] | Khai Môn | Càn Kiếm Các | Kiếm tu, luyện võ trường | #f1ead8 |
| kan | Khảm | ☵ | [0,1,0] | 水 | [0,-1] | Hưu Môn | Khảm Thủy Hậu Sơn | Hậu Sơn, giếng linh tuyền | #3b6fa0 |
| gen | Cấn | ☶ | [0,0,1] | 土 | [0.7071067811865476,-0.7071067811865476] | Sinh Môn | Cấn Sơn Trận Các | Trấn sơn tháp, trận pháp sư | #9b8a6a |
| zhen | Chấn | ☳ | [1,0,0] | 木 | [1,0] | Thương Môn | Chấn Lôi Đài | Lôi đài đấu pháp, Lôi Âm Điện | #4f9a5a |
| xun | Tốn | ☴ | [0,1,1] | 木 | [0.7071067811865476,0.7071067811865476] | Đỗ Môn | Tốn Phong Lâm | Dược viên, Tàng Phong Lâu | #6fb08a |

### `citylook.js`

**`WARDS`** (8)

| khoá | giá trị |
|---|---|
| li | ["Chu Tước Phường","Liệt Hỏa Phường"] |
| kun | ["Hậu Thổ Phường","Phong Niên Phường"] |
| dui | ["Minh Nguyệt Phường","Liên Trì Phường"] |
| qian | ["Thiên Hành Phường","Bạch Hổ Phường"] |
| kan | ["Huyền Thủy Phường","Thanh Tuyền Phường"] |
| gen | ["Trấn Nhạc Phường","Thạch Lâm Phường"] |
| zhen | ["Phong Lôi Phường","Thanh Long Phường"] |
| xun | ["Thanh Phong Phường","Bách Thảo Phường"] |

### `cityblocks.js`

| hằng số | giá trị |
|---|---|
| `BELT` | {"ringIn":{"a":438,"w":12},"ringOut":{"a":652,"w":8},"laneV":74,"laneW":6,"u0":452,"u1":602,"uMax":646,"plazaV":[20,70],"sideV":80} |
| `BOUND_W` | 6 |
| `GRAND_W` | 14 |
| `LANES_V` | [46,86,126] |
| `LANE_W` | 5 |
| `MID_A` | 290 |
| `OUTER_A` | 672 |
| `OUTER_GATE_D` | 26.291079812206576 |
| `OUTER_GATE_W` | 56 |
| `TRUNG_A` | 420 |
| `WALL_H` | 2.6 |
| `WALL_T` | 0.5 |

**`HOUSE_SPECS`** (32)

| khoá | wd | f | hd | wall | roof | near | mid | look |
|---|---|---|---|---|---|---|---|---|
| lib_courtyard | 1.49 | [10,12] | 0.49 | #d8cfbd | #4a5058 |  |  |  |
| lib_lib_house_a2 | 1.38 | [10,12] | 0.72 | #f5f2e9 | #4a5459 | lod | lod |  |
| lib_lib_house_a1 | 1.55 | [10,12] | 0.41 | #f5f2e9 | #4a5459 | lod | lod |  |
| lib_lib_house_b2 | 0.92 | [8,9] | 1.08 | #edeae0 | #6b7a80 |  |  |  |
| lib_lib_house_b1 | 1.05 | [8,9] | 0.62 | #edeae0 | #6b7a80 |  |  |  |
| lib_house_c2 | 1.2 | [7,8.5] | 0.9 | #edeae0 | #3b424c |  |  |  |
| lib_house_c1 | 1.2 | [7,8.5] | 0.57 | #edeae0 | #3b424c |  |  |  |
| bq_house_2f | 1.05 | [8,10] | 0.89 | #e2dccd | #3d4650 |  |  |  |
| bq_house_tiled | 0.98 | [8,10] | 0.66 | #cdbfa6 | #5a4a3e |  |  |  |
| bq_house_stone | 1.6 | [9,11] | 0.45 | #a9a294 | #4e4a46 |  |  |  |
| bq_farmhouse | 1.66 | [10,12] | 0.54 | #c9b48e | #3f4a52 |  |  |  |
| lib_mtn_house | 1 | [8,10] | 0.78 | #b8a07e | #463c36 |  |  |  |
| bq_shop_lantern | 1.13 | [7.5,9] | 0.99 | #8a4a32 | #2f3438 |  |  |  |
| bq_tavern | 0.92 | [9,11] | 0.87 | #e7dfcf | #a8432f |  |  |  |
| bq_teahouse | 1.1 | [10,12] | 0.94 | #efe9dc | #b0432c |  |  |  |
| bq_canal_house | 0.99 | [8,10] | 0.46 | #d8d0c0 | #3d4650 |  |  | true |
| bq_stilt | 1.19 | [8,10] | 0.39 | #8a6a4a | #4a3a2e |  |  | true |
| bq_granary | 0.99 | [8,10] | 1.54 | #c9a86a | #6a5a3a |  |  | true |
| bq_rural_house | 1 | [8,10] | 0.59 | #c9b48e | #5a4a3e |  |  | true |
| bq_tower_house | 0.92 | [8,10] | 1.57 | #e2dccd | #3d4650 |  |  | true |
| bq_carpentry | 1.12 | [8,10] | 0.8 | #9a7a52 | #3a3a3a |  |  | true |
| bq_pottery | 1.11 | [8,10] | 0.8 | #c9b892 | #4a4038 |  |  | true |
| bq_lantern_shop | 1.36 | [8,10] | 0.8 | #a8452c | #2f3438 |  |  | true |
| bq_bookstore | 1.06 | [8,10] | 0.8 | #d8cfbd | #3d4650 |  |  | true |
| bq_moongate | 1.67 | [8,10] | 0.6 | #e6e0d2 | #39404a |  |  | true |
| bq_incense | 1.03 | [8,10] | 0.8 | #8a2a1c | #2f3438 |  |  | true |
| bq_teashop | 0.71 | [8,10] | 1 | #d6ccb2 | #4a3a2e |  |  | true |
| bq_apothecary | 1.7 | [8,10] | 0.6 | #c9b993 | #3d4650 |  |  | true |
| bq_forge | 0.9 | [8,10] | 0.8 | #5a4a3e | #2e2a28 |  |  | true |
| bq_inn | 1.33 | [8,10] | 0.7 | #c9b48e | #3f4a52 |  |  | true |
| bq_yamen | 1.1 | [8,10] | 0.75 | #8a2a1c | #2f3438 |  |  | true |
| bq_drum_tower | 1.19 | [8,10] | 1.1 | #8a3a2a | #2f3438 |  |  | true |

**`KEEP_OUT`** (1)

| x0 | x1 | z0 | z1 |
|---|---|---|---|
| -86 | -24 | -186 | -138 |

**`LANDMARK`** (8)

| khoá | model | name |
|---|---|---|
| li | ["lib_pagoda_red"] | Chu Tước Lâu |
| kun | ["bq_array_hall","hall_main"] | Hậu Thổ Từ |
| dui | ["bq_stage","lib_wood_pavilion"] | Đại Hý Đài |
| qian | ["bq_sword_tower","library_tower"] | Thiên Kiếm Lâu |
| kan | ["lib_pagoda5"] | Huyền Thủy Tháp |
| gen | ["bq_pagoda","lib_pagoda_red"] | Trấn Nhạc Tháp |
| zhen | ["bq_thunder_hall","hall_main"] | Phong Lôi Điện |
| xun | ["bq_library_pagoda","lib_pagoda5"] | Thanh Phong Các |

**`RINGS`** (8)

| a | w |
|---|---|
| 198 | 5 |
| 228 | 5 |
| 258 | 5 |
| 290 | 10 |
| 320 | 5 |
| 350 | 5 |
| 378 | 5 |
| 406 | 6 |

**`THEME`** (8)

| khoá | kind | name |
|---|---|---|
| li | market | Chu Tước Đại Thị |
| kun | fields | Linh Điền Khôn Nguyên |
| dui | lake | Đoài Trạch Hồ |
| qian | yard | Càn Nguyên Giáo Trường |
| kan | pond | Khảm Thủy Đàm |
| gen | rocks | Cấn Sơn Thạch Lâm |
| zhen | arena | Chấn Lôi Đấu Trường |
| xun | herbs | Tốn Phong Dược Viên |

**`VILLA_STREETS`** (3)

| u | w |
|---|---|
| 500 | 7 |
| 576 | 7 |
| 630 | 7 |

### `court.js`

| hằng số | giá trị |
|---|---|
| `DAIS` | {"x":0,"z":-11,"y":4} |
| `DINH` | {"x":0,"z":27.5} |
| `MAIN_HALL` | {"x":0,"z":-31,"w":44} |
| `POND_DEPTH` | 1.1 |
| `POND_LEVEL` | 0.12 |
| `POND_RAMP` | 2.4 |
| `START_M` | {"x":3,"z":43} |
| `TANGY` | {"x":-22,"z":37} |
| `U` | 1.6 |

**`BURNERS`** (9)

| x | z | main | ry |
|---|---|---|---|
| 0 | 34 | true |  |
| 6.53 | 30.54 |  | -2.007128639793479 |
| 2.46 | 34.27 |  | -2.792526803190927 |
| -2.46 | 34.27 |  | -3.490658503988659 |
| -6.53 | 30.54 |  | -4.276056667386108 |
| -5.35 | 22.68 |  | -5.445427266222309 |
| -1.5 | 20.46 |  | -6.073745796940266 |
| 1.5 | 20.46 |  | -6.492624817418905 |
| 5.35 | 22.68 |  | -7.120943348136865 |

**`COURT`** (8)

| khoá | giá trị |
|---|---|
| x0 | -60 |
| x1 | 60 |
| z0 | -66 |
| z1 | 66 |
| wall | 1.4 |
| wallH | 6.5 |
| gateS | 5 |
| gateN | 3.5 |

**`COURT_STATIONS`** (11)

| id | y | offset | center | block | spot | label |
|---|---|---|---|---|---|---|
| tra | 0 | [-30,30.85] | [-40,24] | [-44.4,21.25,-36.4,24.450000000000003] | [-40.4,25.41] | [-40,24] |
| compass | 0 | [29.6,30] | [40,22] | [37.6,20.4,42.400000000000006,23.6] | [40,24.56] | [40,22] |
| xam | 0 | [-28.8,40] | [-40,40] | [-41.6,38.4,-38.4,41.6] | [-37.44,40] | [-40,40] |
| huong | 0 | [0,33.2] | [0,34] | [-1.6,33.2,1.6,34.800000000000004] | [0,35.92] | [0,34] |
| lich | 0 | [28.8,40] | [40,40] | [38.4,38.4,41.6,41.6] | [37.44,40] | [40,40] |
| an0 | 0 | [-8.8,19.6] | [-16,22] | [-16.8,21.200000000000003,-15.200000000000001,22.8] | [-16,23.44] | [-16,22] |
| an1 | 0 | [8.8,19.6] | [16,22] | [15.200000000000001,21.200000000000003,16.8,22.8] | [16,23.44] | [16,22] |
| an2 | 0 | [18.8,34] | [26,30] | [25.200000000000003,29.2,26.8,30.8] | [26,31.44] | [26,30] |
| thay | 4 | [0,0] | [0,-11] | [-1.6,-13.8,1.6,-9.2] | [0,-8.1] | [0,-11.5] |
| tangy | 0 | [0,0] | [-22,37] | [-24.8,35.4,-19.2,37.9] | [-22,39.3] | [-22,37] |
| sen | 0 | [0,0] | [21,50] | [8.6,45.6,33.4,54.4] | [15,55.4] | [21,50] |

**`PLACE`** (8)

| khoá | giá trị |
|---|---|
| tra | [-40,24] |
| compass | [40,22] |
| xam | [-40,40] |
| huong | [0,34] |
| lich | [40,40] |
| an0 | [-16,22] |
| an1 | [16,22] |
| an2 | [26,30] |

**`PONDS`** (2)

| id | cx | cz | W | D | gap |
|---|---|---|---|---|---|
| sen | 21 | 50 | 24 | 8 | [-9,-3] |
| sen-w | -21 | 50 | 24 | 8 | [3,9] |

**`STAIRS`** (3)

| x0 | x1 | zLow | zHigh | y0 | y1 |
|---|---|---|---|---|---|
| -8 | 8 | 13 | 8 | 0 | 2 |
| -7 | 7 | -1 | -6 | 2 | 4 |
| -6 | 6 | -61 | -56 | 0 | 2 |

**`TEA_SEATS`** (3)

| x | y |
|---|---|
| -16.499999999999996 | 22.71875 |
| -15 | 22.71875 |
| -13.5 | 22.71875 |

**`TERRACES`** (2)

| id | x0 | x1 | z0 | z1 | top |
|---|---|---|---|---|---|
| L1 | -36 | 36 | -56 | 8 | 2 |
| L2 | -28 | 28 | -50 | -6 | 4 |

### `world.js`

| hằng số | giá trị |
|---|---|
| `COLS` | 20 |
| `ROWS` | 14 |
| `SKY_ARRIVE` | {"x":0,"z":205,"y":460} |
| `SKY_UP` | {"x":-72,"z":-18} |
| `START` | {"x":11.875,"y":33.875} |
| `TILE` | 32 |
| `VAN_STELE` | {"x":-5.5,"z":29.5} |

**`HALLS`** (8)

| id | region | name | verb | world | hall |
|---|---|---|---|---|---|
| trach | thanh | Sảnh Trạch Nhật | Chọn ngày cho khách | {"x":1318.6,"z":19} | {"id":"trach","kind":"hall","name":"Sảnh Trạch Nhật","x":1318.6,"z":77,"w":44,"d":34,"ry":… |
| duongtrach | thanh | Sảnh Dương Trạch | Xem nhà cho khách | {"x":-1318.6,"z":-19} | {"id":"duongtrach","kind":"hall","name":"Sảnh Dương Trạch","x":-1318.6,"z":-77,"w":44,"d":… |
| dieuhau | thanh | Sảnh Điều Hậu | Xem khí hậu lá số | {"x":791.6819432579014,"z":764.8087974588985} | {"id":"dieuhau","kind":"hall","name":"Sảnh Điều Hậu","x":832.69,"z":723.79,"w":44,"d":34,"… |
| thuvien | thanh | Thư Lâu | Đọc tầng thư hôm nay | {"x":19,"z":-1318.6} | {"id":"thuvien","kind":"hall","name":"Thư Lâu","x":77,"z":-1318.6,"w":44,"d":34,"ry":-1.57… |
| hophon | thanh | Bàn Hợp Hôn | Xem hợp hôn (án chung) | {"x":-48,"z":8} |  |
| tuvi | thanh | Sảnh Tử Vi | An sao Tử Vi | {"x":-822.5119432579014,"z":795.6387974588985} | {"id":"tuvi","kind":"hall","name":"Sảnh Tử Vi","x":-863.52,"z":754.62,"w":44,"d":34,"ry":0… |
| tuongphap | thanh | Sảnh Tượng Pháp | Đọc tượng Manh phái | {"x":945.8215728752538,"z":-918.9584271247462} | {"id":"tuongphap","kind":"hall","name":"Sảnh Tượng Pháp","x":986.84,"z":-877.94,"w":44,"d"… |
| cachcuc | thanh | Sảnh Cách Cục | Định cách cục | {"x":-918.9584271247462,"z":-945.8215728752538} | {"id":"cachcuc","kind":"hall","name":"Sảnh Cách Cục","x":-877.94,"z":-986.84,"w":44,"d":34… |

**`PLACES`** (2)

| id | name | world |
|---|---|---|
| amvancoc | Am Vân Cốc | {"x":-56,"z":-163} |
| laotung | Lão Tùng | {"x":6,"z":72} |

**`ROOMS`** (6)

| id | name | region | door | origin | w | d | h | deities | npc | master | kind |
|---|---|---|---|---|---|---|---|---|---|---|---|
| chinhdien | Chính Điện Tam Thanh | thanh | {"x":0,"z":-84} | {"x":4591,"z":0} | 34 | 28 | 14 | [["deity_lingbao",-6.5],["deity_yuanshi",0],["deity_daode",6.5]] | que |  |  |
| vanxuong | Văn Xương Các | thanh | {"x":15.5,"z":-245} | {"x":4691,"z":0} | 24 | 20 | 12 | [["deity_wenchang",0]] |  | vanxuong |  |
| daumau | Đẩu Mẫu Điện | thanh | {"x":245,"z":15.5} | {"x":4791,"z":0} | 24 | 20 | 12 | [["deity_doumu",0]] |  | tuvi |  |
| laoquan | Lão Quân Điện | thanh | {"x":-245,"z":-15.5} | {"x":4891,"z":0} | 24 | 20 | 12 | [["deity_daode",0]] |  | duocvuong |  |
| vanmenh | Vận Mệnh Các | thanh | {"x":-38.6,"z":-40} | {"x":4991,"z":0} | 20 | 72 | 11 | [] |  |  | vanmenh |
| thaitue | Thái Tuế Điện | thanh | {"x":38.6,"z":-40} | {"x":4941,"z":0} | 28 | 24 | 13 | [] |  |  | thaitue |

**`STATIONS`** (46)

| id | name | verb | block | spot | label | court | kind | slot | region | world | hall | room |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| thay | Bàn Thầy Tử Bình | Ngồi trước bàn thầy | [{"c":9,"r":-1.625,"w":2,"h":2.875000000000001}] | {"x":10,"y":1.9375000000000009} | {"x":10,"y":-0.1875} | {"id":"thay","y":4,"offset":[0,0],"center":[0,-11],"block":[-1.6,-13.8,1.6,-9.2],"spot":[0… |  |  |  |  |  |  |
| tra | Trà Thất | Ngồi bồ đoàn uống trà | [{"c":-17.749999999999996,"r":20.28125,"w":5,"h":2}] | {"x":-15.249999999999996,"y":22.88125} | {"x":-15,"y":22} | {"id":"tra","y":0,"offset":[-30,30.85],"center":[-40,24],"block":[-44.4,21.25,-36.4,24.450… |  |  |  |  |  |  |
| compass | La Bàn Đài | Xem la bàn hướng nhà | [{"c":33.5,"r":19.75,"w":3,"h":2}] | {"x":35,"y":22.349999999999998} | {"x":35,"y":20.75} | {"id":"compass","y":0,"offset":[29.6,30],"center":[40,22],"block":[37.6,20.4,42.4000000000… |  |  |  |  |  |  |
| xam | Ống Xăm | Xin một quẻ xăm | [{"c":-16,"r":30.999999999999996,"w":2.0000000000000036,"h":2.0000000000000036}] | {"x":-13.399999999999999,"y":32} | {"x":-15,"y":32} | {"id":"xam","y":0,"offset":[-28.8,40],"center":[-40,40],"block":[-41.6,38.4,-38.4,41.6],"s… |  |  |  |  |  |  |
| huong | Lư Hương | Thắp một tuần nhang | [{"c":9,"r":27.75,"w":2,"h":1}] | {"x":10,"y":29.45} | {"x":10,"y":28.25} | {"id":"huong","y":0,"offset":[0,33.2],"center":[0,34],"block":[-1.6,33.2,1.6,34.8000000000… |  |  |  |  |  |  |
| lich | Bảng Lịch Ngày | Xem lịch hôm nay | [{"c":34,"r":30.999999999999996,"w":2,"h":2.0000000000000036}] | {"x":33.4,"y":32} | {"x":35,"y":32} | {"id":"lich","y":0,"offset":[28.8,40],"center":[40,40],"block":[38.4,38.4,41.6,41.6],"spot… |  |  |  |  |  |  |
| sen | Hồ Sen | Thả đèn hoa đăng | [{"c":15.375,"r":35.5,"w":15.499999999999996,"h":5.5}] | {"x":19.375,"y":41.625} | {"x":23.125,"y":38.25} | {"id":"sen","y":0,"offset":[0,0],"center":[21,50],"block":[8.6,45.6,33.4,54.4],"spot":[15,… |  |  |  |  |  |  |
| tangy | Tàng Y Các | Xem trang phục, phụ kiện | [{"c":-5.5,"r":29.124999999999996,"w":3.5000000000000018,"h":1.5625}] | {"x":-3.75,"y":31.562499999999996} | {"x":-3.75,"y":30.125} | {"id":"tangy","y":0,"offset":[0,0],"center":[-22,37],"block":[-24.8,35.4,-19.2,37.9],"spot… |  |  |  |  |  |  |
| an0 | Khách hỏi việc | Giải án cho khách | [{"c":-0.5,"r":20.25,"w":1,"h":1}] | {"x":0,"y":21.65} | {"x":0,"y":20.75} | {"id":"an0","y":0,"offset":[-8.8,19.6],"center":[-16,22],"block":[-16.8,21.200000000000003… | case | 0 |  |  |  |  |
| an1 | Khách hỏi việc | Giải án cho khách | [{"c":19.5,"r":20.25,"w":1,"h":1}] | {"x":20,"y":21.65} | {"x":20,"y":20.75} | {"id":"an1","y":0,"offset":[8.8,19.6],"center":[16,22],"block":[15.200000000000001,21.2000… | case | 1 |  |  |  |  |
| an2 | Khách hỏi việc | Giải án cho khách | [{"c":25.75,"r":25.25,"w":1,"h":1}] | {"x":26.25,"y":26.65} | {"x":26.25,"y":25.75} | {"id":"an2","y":0,"offset":[18.8,34],"center":[26,30],"block":[25.200000000000003,29.2,26.… | case | 2 |  |  |  |  |
| trach | Sảnh Trạch Nhật | Chọn ngày cho khách | [] | {"x":834.1249999999999,"y":20.475} | {"x":834.1249999999999,"y":18.875} |  | desk |  | thanh | {"x":1318.6,"z":19} | {"id":"trach","kind":"hall","name":"Sảnh Trạch Nhật","x":1318.6,"z":77,"w":44,"d":34,"ry":… |  |
| duongtrach | Sảnh Dương Trạch | Xem nhà cho khách | [] | {"x":-814.1249999999999,"y":-3.275} | {"x":-814.1249999999999,"y":-4.875} |  | desk |  | thanh | {"x":-1318.6,"z":-19} | {"id":"duongtrach","kind":"hall","name":"Sảnh Dương Trạch","x":-1318.6,"z":-77,"w":44,"d":… |  |
| dieuhau | Sảnh Điều Hậu | Xem khí hậu lá số | [] | {"x":504.80121453618835,"y":486.6054984118116} | {"x":504.80121453618835,"y":485.0054984118116} |  | desk |  | thanh | {"x":791.6819432579014,"z":764.8087974588985} | {"id":"dieuhau","kind":"hall","name":"Sảnh Điều Hậu","x":832.69,"z":723.79,"w":44,"d":34,"… |  |
| thuvien | Thư Lâu | Đọc tầng thư hôm nay | [] | {"x":21.875,"y":-815.5249999999999} | {"x":21.875,"y":-817.1249999999999} |  | desk |  | thanh | {"x":19,"z":-1318.6} | {"id":"thuvien","kind":"hall","name":"Thư Lâu","x":77,"z":-1318.6,"w":44,"d":34,"ry":-1.57… |  |
| hophon | Bàn Hợp Hôn | Xem hợp hôn (án chung) | [] | {"x":-20,"y":13.6} | {"x":-20,"y":12} |  | desk |  | thanh | {"x":-48,"z":8} |  |  |
| tuvi | Sảnh Tử Vi | An sao Tử Vi | [] | {"x":-504.0699645361883,"y":505.87424841181155} | {"x":-504.0699645361883,"y":504.2742484118115} |  | desk |  | thanh | {"x":-822.5119432579014,"z":795.6387974588985} | {"id":"tuvi","kind":"hall","name":"Sảnh Tử Vi","x":-863.52,"z":754.62,"w":44,"d":34,"ry":0… |  |
| tuongphap | Sảnh Tượng Pháp | Đọc tượng Manh phái | [] | {"x":601.1384830470336,"y":-565.7490169529664} | {"x":601.1384830470336,"y":-567.3490169529664} |  | desk |  | thanh | {"x":945.8215728752538,"z":-918.9584271247462} | {"id":"tuongphap","kind":"hall","name":"Sảnh Tượng Pháp","x":986.84,"z":-877.94,"w":44,"d"… |  |
| cachcuc | Sảnh Cách Cục | Định cách cục | [] | {"x":-564.3490169529664,"y":-582.5384830470335} | {"x":-564.3490169529664,"y":-584.1384830470336} |  | desk |  | thanh | {"x":-918.9584271247462,"z":-945.8215728752538} | {"id":"cachcuc","kind":"hall","name":"Sảnh Cách Cục","x":-877.94,"z":-986.84,"w":44,"d":34… |  |
| door_chinhdien | Chính Điện Tam Thanh | Vào Chính Điện Tam Thanh | [] | {"x":10,"y":-44.3} | {"x":10,"y":-45.5} |  | door |  |  | {"x":0,"z":-84} |  | chinhdien |
| exit_chinhdien | Cửa điện | Ra khỏi điện | [] | {"x":2879.375,"y":15} | {"x":2879.375,"y":15} |  | exit |  |  | {"x":4591,"z":12.8} |  | chinhdien |
| que | Thầy Giải Quẻ | Xin thầy gieo quẻ | [] | {"x":2874.9374999999995,"y":7.625} | {"x":2874.0625,"y":7.625} |  | desk |  |  | {"x":4582.5,"z":1} |  | chinhdien |
| door_vanxuong | Văn Xương Các | Vào Văn Xương Các | [] | {"x":19.6875,"y":-144.925} | {"x":19.6875,"y":-146.125} |  | door |  |  | {"x":15.5,"z":-245} |  | vanxuong |
| exit_vanxuong | Cửa điện | Ra khỏi điện | [] | {"x":2941.875,"y":12.5} | {"x":2941.875,"y":12.5} |  | exit |  |  | {"x":4691,"z":8.8} |  | vanxuong |
| m_vanxuong | Tế tửu Chu Văn Trinh | Hỏi Tế tửu Chu Văn Trinh | [] | {"x":2939.3124999999995,"y":7.625} | {"x":2938.4375,"y":7.625} |  | desk |  |  | {"x":4685.5,"z":1} |  | vanxuong |
| door_daumau | Đẩu Mẫu Điện | Vào Đẩu Mẫu Điện | [] | {"x":163.125,"y":17.8875} | {"x":163.125,"y":16.6875} |  | door |  |  | {"x":245,"z":15.5} |  | daumau |
| exit_daumau | Cửa điện | Ra khỏi điện | [] | {"x":3004.375,"y":12.5} | {"x":3004.375,"y":12.5} |  | exit |  |  | {"x":4791,"z":8.8} |  | daumau |
| m_daumau | Khổng tiên sinh | Hỏi Khổng tiên sinh | [] | {"x":3001.8124999999995,"y":7.625} | {"x":3000.9375,"y":7.625} |  | desk |  |  | {"x":4785.5,"z":1} |  | daumau |
| door_laoquan | Lão Quân Điện | Vào Lão Quân Điện | [] | {"x":-143.125,"y":-1.4875} | {"x":-143.125,"y":-2.6875} |  | door |  |  | {"x":-245,"z":-15.5} |  | laoquan |
| exit_laoquan | Cửa điện | Ra khỏi điện | [] | {"x":3066.875,"y":12.5} | {"x":3066.875,"y":12.5} |  | exit |  |  | {"x":4891,"z":8.8} |  | laoquan |
| m_laoquan | Đan Đỉnh chân nhân | Hỏi Đan Đỉnh chân nhân | [] | {"x":3064.3124999999995,"y":7.625} | {"x":3063.4375,"y":7.625} |  | desk |  |  | {"x":4885.5,"z":1} |  | laoquan |
| door_vanmenh | Vận Mệnh Các | Vào Vận Mệnh Các | [] | {"x":-14.125,"y":-16.8} | {"x":-14.125,"y":-18} |  | door |  |  | {"x":-38.6,"z":-40} |  | vanmenh |
| exit_vanmenh | Cửa điện | Ra khỏi điện | [] | {"x":3129.375,"y":28.749999999999996} | {"x":3129.375,"y":28.749999999999996} |  | exit |  |  | {"x":4991,"z":34.8} |  | vanmenh |
| vanbia | Bia Vận Mệnh | Đọc bia quỹ tích đời | [] | {"x":3126.9375,"y":25.687499999999996} | {"x":3125.9375,"y":25.4375} |  | van |  |  | {"x":4985.5,"z":29.5} |  | vanmenh |
| van0 | Cổng Đại Vận 1 | Bước vào thập kỷ này | [] | {"x":3129.375,"y":23.5625} | {"x":3129.375,"y":22.625} |  | van | 0 |  | {"x":4991,"z":25} |  | vanmenh |
| van1 | Cổng Đại Vận 2 | Bước vào thập kỷ này | [] | {"x":3129.375,"y":19.8125} | {"x":3129.375,"y":18.875} |  | van | 1 |  | {"x":4991,"z":19} |  | vanmenh |
| van2 | Cổng Đại Vận 3 | Bước vào thập kỷ này | [] | {"x":3129.375,"y":16.0625} | {"x":3129.375,"y":15.125} |  | van | 2 |  | {"x":4991,"z":13} |  | vanmenh |
| van3 | Cổng Đại Vận 4 | Bước vào thập kỷ này | [] | {"x":3129.375,"y":12.3125} | {"x":3129.375,"y":11.375} |  | van | 3 |  | {"x":4991,"z":7} |  | vanmenh |
| van4 | Cổng Đại Vận 5 | Bước vào thập kỷ này | [] | {"x":3129.375,"y":8.5625} | {"x":3129.375,"y":7.625} |  | van | 4 |  | {"x":4991,"z":1} |  | vanmenh |
| van5 | Cổng Đại Vận 6 | Bước vào thập kỷ này | [] | {"x":3129.375,"y":4.8125} | {"x":3129.375,"y":3.875} |  | van | 5 |  | {"x":4991,"z":-5} |  | vanmenh |
| van6 | Cổng Đại Vận 7 | Bước vào thập kỷ này | [] | {"x":3129.375,"y":1.0625} | {"x":3129.375,"y":0.125} |  | van | 6 |  | {"x":4991,"z":-11} |  | vanmenh |
| van7 | Cổng Đại Vận 8 | Bước vào thập kỷ này | [] | {"x":3129.375,"y":-2.6875} | {"x":3129.375,"y":-3.625} |  | van | 7 |  | {"x":4991,"z":-17} |  | vanmenh |
| van8 | Cổng Đại Vận 9 | Bước vào thập kỷ này | [] | {"x":3129.375,"y":-6.4375} | {"x":3129.375,"y":-7.375} |  | van | 8 |  | {"x":4991,"z":-23} |  | vanmenh |
| door_thaitue | Thái Tuế Điện | Vào Thái Tuế Điện | [] | {"x":34.125,"y":-16.8} | {"x":34.125,"y":-18} |  | door |  |  | {"x":38.6,"z":-40} |  | thaitue |
| exit_thaitue | Cửa điện | Ra khỏi điện | [] | {"x":3098.125,"y":13.75} | {"x":3098.125,"y":13.75} |  | exit |  |  | {"x":4941,"z":10.8} |  | thaitue |
| thaitue | Bàn Lễ Thái Tuế | Xem Thái Tuế năm nay | [] | {"x":3098.125,"y":5.625} | {"x":3098.125,"y":3.125} |  | van |  |  | {"x":4941,"z":-2.2} |  | thaitue |

### `heaven.js`

| hằng số | giá trị |
|---|---|
| `THIEN_THE` | {"x":78,"z":-50} |

**`HEAVEN`** (10)

| khoá | giá trị |
|---|---|
| key | heaven |
| name | Cửu Trọng Thiên |
| cx | 5646 |
| cz | 1300 |
| R | 280 |
| plaza | 30 |
| margin | 12 |
| apron | 10 |
| bridgeW | 6 |
| half | 460 |

### `waterways.js`

| hằng số | giá trị |
|---|---|
| `CITY_FLAT_A` | 2165 |
| `CITY_WALL_A` | 2125 |
| `LAKE_U` | 1300 |
| `QUAY_W` | 10 |
| `RIVER_ARC_U` | 1360 |
| `RIVER_LEN` | 9674.350285282226 |
| `WATER_LEVEL` | -6 |

**`CHANNEL_DEFS`** (2)

| id | name | wIn | wOut | deep | flow | flowEdge | ctrl |
|---|---|---|---|---|---|---|---|
| main | Huyền Hà | 60 | 75 | 10 | 1.3 | 0.3 | [[-4300,1350],[-3600,1420],[-2900,1400],[-2350,1330],[-1799.6,1205.6],[-1492,982.9],[-1272… |
| namkhe | Nam Khê | 22 | 30 | 5 | 0.9 | 0.25 | [[420,4300],[420,3600],[440,2900],[420,2125],[420,1700],[420,1400],[420,1370]] |

**`LAKE`** (7)

| khoá | giá trị |
|---|---|
| id | cungthong |
| name | Cùng Thông Hồ |
| x | 1110.2 |
| z | 728.3 |
| r | 165 |
| bedEdge | -9 |
| bedMid | -14 |

**`RIVER`** (6)

| khoá | giá trị |
|---|---|
| halfW | 75 |
| halfWIn | 60 |
| bank | 22 |
| deep | 10 |
| flow | 1.3 |
| flowEdge | 0.3 |

### `canals.js`

| hằng số | giá trị |
|---|---|
| `AVE_HALF_CANAL` | 19 |
| `CANAL_BED` | -4.3 |
| `CANAL_CLEAR` | 5.5 |
| `CANAL_WATER` | -0.8 |
| `EXT_BANK` | 7 |
| `EXT_DEPTH` | 1.4 |
| `EXT_HW` | 4.2 |
| `LINK_BANK` | 6 |
| `LINK_DEPTH` | 3.5 |
| `LINK_HW` | 11 |
| `MOAT` | {"a":175.25,"w":25.5} |
| `MOAT_LANE` | 180.7 |
| `OUTLET` | {"gua":"xun","u0":640,"u1":694} |

**`AVE_CANAL`** (5)

| khoá | giá trị |
|---|---|
| gua | ["kan","xun"] |
| v0 | -11 |
| v1 | 11 |
| u0 | 175.25 |
| u1 | 640 |

### `bridges.js`

| hằng số | giá trị |
|---|---|
| `ARCH_R` | 5.5 |
| `ARCH_W` | 7.5 |
| `DECK_T` | 0.6 |

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

### `jobplaces.js`

| hằng số | giá trị |
|---|---|
| `BOSS` | {"x":4857,"z":358} |
| `CART` | {"x":4829,"z":356} |

**`CMINE`** (6)

| khoá | giá trị |
|---|---|
| key | job:mine |
| name | Mỏ Dân Sự Khoáng Sơn |
| x | 4851 |
| z | 340 |
| w | 56 |
| d | 44 |

### `mansions.js`

| hằng số | giá trị |
|---|---|
| `BELT` | {"ringIn":{"a":438,"w":12},"ringOut":{"a":652,"w":8},"laneV":74,"laneW":6,"u0":452,"u1":602,"uMax":646,"plazaV":[20,70],"sideV":80} |
| `DOOR_W` | 2.4 |

### `streets.js`

| hằng số | giá trị |
|---|---|
| `AAA_SPECS` | [["lib_lib_house_a2",11.12,8.06,8,0],["lib_lib_house_a1",11.12,7.19,4.6,0],["lib_lib_house_b2",7.38,8.02,7.98,0],["lib_lib_house_b1",7.38,7.02,4.58,0],["lib_house_c2",7.2,6.01,6.5,-1.8],["lib_house_c1… |
| `STREET_SEED` | 79 |

### `season.js`

| hằng số | giá trị |
|---|---|
| `SEASONS` | ["xuan","ha","thu","dong"] |

