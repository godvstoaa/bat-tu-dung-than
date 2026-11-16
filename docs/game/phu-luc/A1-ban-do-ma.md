<!-- TỆP SINH TỰ ĐỘNG bởi scripts/docs-game-gen.mjs — KHÔNG SỬA TAY. Sinh lại: node scripts/docs-game-gen.mjs -->
# A1 · Bản đồ mã: mô-đun → chương → bộ phận → test

> Sinh từ mã nguồn. Khi một con số ở chương khác lệch với tệp này thì **tệp này (tức là mã đang chạy) thắng** và chương kia phải sửa.

Tổng: **159 tệp game, 34347 dòng**; **10 tệp máy chủ**. Chưa gán chương: **0**.

## A1.1 Theo chương

| chương | tên | số tệp | số dòng |
|---|---|---|---|
| 10 | Thế giới | 38 | 7968 |
| 11 | Mệnh và nhân vật | 9 | 1916 |
| 12 | Bói toán và nội dung | 20 | 3781 |
| 13 | Đời sống | 4 | 658 |
| 14 | Việc làm | 6 | 1249 |
| 15 | Nhà ở và phương tiện | 8 | 1317 |
| 16 | Di chuyển | 8 | 851 |
| 17 | Sản xuất, ẩm thực, kinh doanh | 9 | 1638 |
| 18 | Huyền học, tu luyện, luân hồi | 4 | 346 |
| 19 | Luật và hình phạt | 5 | 460 |
| 20 | Xã hội | 1 | 82 |
| 21 | NPC và AI | 11 | 2177 |
| 22 | Giao diện, điều khiển | 6 | 1356 |
| 30 | Kỹ thuật client | 25 | 9657 |
| 31 | Máy chủ, mạng, dữ liệu | 5 | 891 |

## A1.2 Mô-đun game `src/game/`

Cột «test» lấy tự động: bộ test nào có nhắc tới tệp đó. Ô trống nghĩa là chưa có bộ test thuần nào đụng tới mô-đun.

| tệp | dòng | chương | bộ phận | vai trò (đầu tệp) | export | engine app | test |
|---|---|---|---|---|---|---|---|
| `accessories.js` | 436 | 11 | Client/3D |  | 4: disposeObject, buildMount, createOutfit, HAS_3D |  |  |
| `account-ui.js` | 114 | 31 | Backend + Client |  | 2: accountBody, chooseBody |  |  |
| `account.js` | 102 | 31 | Backend + Client |  | 1: createAccount |  |  |
| `ai-model.js` | 38 | 21 | AI/NPC + Nội dung | MÔ HÌNH AI CỦA GAME — một chỗ duy nhất (client lẫn Worker cùng import). Quyết định chủ dự án 2026-11-16: mọi lượt AI trong game (khung thầy bói, NPC chat, giám khảo kinh tế, bộ đánh giá pers | 8: GAME_AI_MODEL, ZAI_MODELS, ZAI_DEFAULT_MODEL, pickZaiModel, gameModelOnly, gameAiConfig, … |  | game-ai-model |
| `amduc.js` | 94 | 18 | Thiết kế game |  | 13: TIERS, NEED, PENALTY, tierOfStreak, adState, tier, … |  | game-amduc, game-huyenhoc |
| `archkit-style.js` | 342 | 30 | Client/3D | BỘ KIẾN TRÚC THEO PHONG CÁCH (three.js, thủ tục, nhẹ) — nhà, mái, tường rào, cổng, mặt nước, cây cho 16 phong cách biệt phủ + 8 phong cách khu biệt thự (estate-layout.STYLES): · Á Đông: cung | 9: styleMats, styledBuilding, styledPavilion, styledFence, styledGate, waterFeature, … |  |  |
| `archkit.js` | 296 | 30 | Client/3D | BỘ KIẾN TRÚC THỦ TỤC (three.js) — dựng biệt phủ đúng tỉ lệ người 1,9 m bằng hình khối nhẹ, không model Meshy 300k: nền đá có bậc, hàng cột sơn son, vách cửa bức bàn (song gỗ), xà vẽ màu, mái | 11: roofMatOf, kit, plinth, hall, gateHouse, walls, … |  |  |
| `assets.js` | 464 | 30 | Client/3D | Nạp mô hình GLB (tạo bằng Meshy, nén bằng scripts/meshy-pack.mjs) — public/models/&lt;id>.glb - loadModel(id): tải 1 lần, cache; lỗi / thiếu file → null (game dùng mô hình procedural). - placeM | 19: HD_IDS, hasLod, getModelQuality, setModelQuality, setWarmup, warmObject, … |  |  |
| `audio.js` | 102 | 22 | Client/UI |  | 6: setSound, bell, knock, rattle, splash, paddle |  |  |
| `auth-core.js` | 117 | 31 | Backend + Client |  | 24: OTP_TTL_MS, OTP_TRIES, SESSION_DAYS, WS_TOKEN_MS, SAVE_MAX, SAVE_CHUNK, … |  | game-auth |
| `bark-pool.js` | 162 | 21 | AI/NPC + Nội dung | NPC-AI G0 · BARK-POOL — MỘT NGUỒN dữ liệu bark của quán (docs/npc-ai/ 15-lo-trinh-tich-hop.md §15.5b; khuôn hàm mục 05 §05.3; nguyên tắc một nguồn mục 04). Thuần JS, không DOM, không state,  | 3: pickBark, BARK_POOLS, DYNAMIC_STATION_POOLS |  | bark-pool |
| `batquai.js` | 276 | 10 | Thiết kế game + Client/3D |  | 33: OCT_A, TAN8, OCT_SIDE, OCT_V, WALL_T, RING_A, … |  | game-batquai, game-city-v4, game-collide, game-items, game-mansion, game-water |
| `batquai3d.js` | 354 | 10 | Thiết kế game + Client/3D | BÁT QUÁI THÀNH — dựng 3D theo batquai.js: tường bát giác + 8 cổng (Bát Môn), tháp góc, đĩa quẻ khảm đá, bia quẻ, 8 khu (công trình Meshy CC0 + thủ công: ao, ruộng, sân võ, lôi đài, giếng), đ | 12: BQ_AVAILABLE, place, baguaTexture, mats, octWall, cityGates, … |  |  |
| `boat-ui.js` | 122 | 16 | Thiết kế game + Client/3D |  | 3: DOCK_KEY, registerDocks, createBoatControl |  |  |
| `boats.js` | 156 | 16 | Thiết kế game + Client/3D |  | 14: BOAT_TYPES, TYPE_BY_IDX, typeId, RENT_MS, createBoat, hullPoints, … |  | game-water |
| `boats3d.js` | 157 | 16 | Thiết kế game + Client/3D |  | 4: makeBoat, floatBoat, createFleet, makeBoatByIdx |  |  |
| `bridges.js` | 130 | 10 | Thiết kế game + Client/3D |  | 14: DECK_T, ARCH_R, ARCH_W, deckTop, localOf, cityBridges, … |  | game-motion, game-water |
| `canals.js` | 107 | 10 | Thiết kế game + Client/3D |  | 19: MOAT, MOAT_LANE, AVE_CANAL, OUTLET, CANAL_BED, CANAL_CLEAR, … |  | game-motion, game-water |
| `case-ui.js` | 516 | 12 | Thiết kế game + Nội dung |  | 9: npcCaseBody, openMaster, classicalBody, classicalListBody, masteryHtml, zheriCaseBody, … | constants |  |
| `cases.js` | 233 | 12 | Thiết kế game + Nội dung | GIẢI ÁN — lõi chiều sâu của Huyền Quán (docs/GAME-MMO-PROMPT-PLAN.md §B2, P2). Khách NPC mang ngày sinh thật + câu hỏi đời thường; người chơi đi 6 bước luận, ĐÁP ÁN do engine cổ pháp tính (a | 26: WX, ADVICE_CARDS, tiaohouQuote, buildCase, STEP_WEIGHTS, STEP_ORDER, … | chart, constants, kb, classical-cases | game-cases |
| `characters.js` | 312 | 11 | Client/3D |  | 7: CHAR_ANIMS, WX_HSV, NPC_TINT, enableHd, setViewer, HEIGHT, … |  |  |
| `citizens.js` | 150 | 21 | AI/NPC + Nội dung | DÂN THÀNH BÁT QUÁI — NPC từng khu (batquai.js › CITIZENS): đứng việc của mình hoặc đi lại trên đại lộ, quay nhìn + chào khi khách tới gần, nói câu theo vai (bark cục bộ, không qua mạng). Nhâ | 3: setCitizenCap, setHint, createCitizens |  |  |
| `city4.js` | 275 | 10 | Thiết kế game + Client/3D |  | 12: allHouses, phuPlots, isRemoved, villaPlots, streetListings, inPhuPlot, … |  | game-homes, game-items, game-mansion, game-water |
| `cityblocks.js` | 408 | 10 | Thiết kế game + Client/3D |  | 19: TRUNG_A, OUTER_GATE_W, BELT, VILLA_STREETS, GRAND_W, RINGS, … |  | game-homes, game-items, game-mansion |
| `cityblocks3d.js` | 689 | 10 | Thiết kế game + Client/3D |  | 13: outerWall, outerGates, WATER_GATE, houseScale, houseHeight, instancedSet, … |  |  |
| `citydress3d.js` | 626 | 10 | Thiết kế game + Client/3D | ĐỒ PHỐ HUYỀN THÀNH v5 (docs/THANH-MANIFEST.md §3.3, §3.7–3.10) — thứ làm cho phố có đời sống: · nền lô lát đá + sân trước, tường rào mũ ngói ở khe giữa các nhóm nhà (§3.3) · biển hiệu treo m | 5: TREE_SP, treeGeo, applySeason, cityDress, _test |  |  |
| `cityident3d.js` | 206 | 10 | Thiết kế game + Client/3D |  | 9: wardGates, wardPaving, shopSigns, setEstateLookup, estateSigns, setEstateOwner, … |  |  |
| `citylayout.js` | 618 | 10 | Thiết kế game + Client/3D |  | 26: CITY, FRONT_KINDS, STREET_TYPES, NGOAI, deckTop, lotCorners, … |  | game-city-v4, game-homes, game-mansion, game-water |
| `citylook.js` | 84 | 10 | Thiết kế game + Client/3D |  | 3: WARDS, wardName, houseLooks |  |  |
| `civil.js` | 82 | 20 | Thiết kế game + Backend |  | 15: H, TIERS, PHRASES, WAIT_REMARRY, civOf, cost, … |  | game-econ |
| `coins.js` | 74 | 13 | Thiết kế game |  | 11: XU, UNITS, fromDong, toDong, split, fmt, … |  | game-cosmetics, game-items, game-law, game-life, game-vehicles |
| `collide.js` | 246 | 30 | Client/3D |  | 8: footprintIdle, flushFootprints, solidifyCells, addFootprint, onFootprint, footprints, … |  | game-collide, game-law |
| `cosmetics.js` | 274 | 11 | Thiết kế game + Client/UI | TÀNG Y CÁC — trang phục, phụ kiện, hiệu ứng (docs/GAME-V2-THIET-KE.md §S13). Ô trang bị: phẩm phục · mũ/trâm · sau lưng · cầm tay · hào quang · vệt bước · ngự vật · khung tên. Bậc hiếm: Phàm | 24: SLOTS, RARITY, ITEMS, ITEM, DEFAULT_EQUIP, SETS, … |  | game-cosmetics |
| `court.js` | 165 | 10 | Thiết kế game + Client/3D | HUYỀN QUÁN SƠN MÔN — bố cục khu quán khởi đầu (mét thế giới, tâm quán = gốc toạ độ). Một nguồn duy nhất cho: vị trí các gian (world.js), nền bậc + vật cản (obstacles.js), dựng 3D (render3d.j | 18: U, toTile, COURT, inCourt, TERRACES, STAIRS, … |  | game-batquai, game-state |
| `crisis-ui.js` | 53 | 21 | AI/NPC + Nội dung | Khung khủng hoảng trong game — dùng chung cho khung hỏi thầy bói và khung trò chuyện NPC. Luật hiển thị: docs/npc-ai/11-khung-hoang-crisis.md §11.2–11.4 — giữ khung thoại, chữ đổi sang phông | 2: guardCrisis, crisisStrip | crisis |  |
| `cuisine.js` | 149 | 17 | Thiết kế game + Backend |  | 15: SKILL_STEPS, skillNorm, thucCan, cookWx, isCopy, quality, … |  | game-econ |
| `divination.js` | 125 | 12 | Thiết kế game + Nội dung |  | 16: D, RANKS, MIN_FEE, LEN, rankOf, EXAM, … |  | econ-accounts, game-econ |
| `dz-case.js` | 121 | 12 | Thiết kế game + Nội dung |  | 12: DZ_STEPS, DZ_TITLE, PALACES, PAN_NAME, STARS, GUAS, … | chart, zhai, fengshui-compass, xuankong | game-dz |
| `econ-client.js` | 40 | 17 | Thiết kế game + Backend |  | 1: createEcon |  |  |
| `econ-core.js` | 544 | 17 | Thiết kế game + Backend |  | 3: vnDay, AGE, EconEngine |  | game-econ |
| `econ-data.js` | 164 | 17 | Thiết kế game + Backend |  | 18: COLD, REGIONS, REGION_IDS, RECIPES, RECIPE_BY, CHEFS, … |  | game-econ |
| `econ-ui.js` | 353 | 17 | Thiết kế game + Backend |  | 3: TABS, TAB_OF_AT, econBody |  |  |
| `effects.js` | 214 | 11 | Client/3D |  | 1: createGiatri |  |  |
| `estate-core.js` | 171 | 15 | Thiết kế game + Backend | NHÀ RIÊNG — phần LÕI nhẹ (thuần JS, không dựng thành): hạng nhà, mã hoá bố cục, kiểm tra bài trí. Máy chủ (worker/estate.js qua protocol.js) và client dùng chung — không kéo cityblocks vào w | 28: TIERS, MAX_ITEMS, MAX_ITEMS_PHU, PHU_COUNT, estatePlanOfH, zonesOfH, … |  | game-estate, game-heaven, game-life, quan-mmo |
| `estate-layout.js` | 160 | 10 | Thiết kế game + Client/3D | QUY HOẠCH TRONG KHUÔN VIÊN (thuần JS, tất định, KHÔNG phụ thuộc cityblocks — máy chủ dùng được qua estate-core): phong cách kiến trúc + bố cục một biệt phủ (4.550–10.000 m²) hoặc một biệt th | 9: STYLES, TIEN_PLAN, PHU_PLAN, VILLA_STYLES, VILLA_DISTRICT_NAME, VILLAS_PER_DISTRICT, … |  | game-mansion |
| `estate.js` | 59 | 15 | Thiết kế game + Backend | NHÀ RIÊNG — danh sách nhà rao bán, giá, hợp mệnh, mã hoá bố cục đồ đạc, kiểm tra bài trí. Thuần JS, tất định (máy chủ worker/estate.js và test Node dùng chung). Chủ sở hữu do máy chủ giữ (Es | 8: listings, listing, fitStars, FIT_TEXT, roomOf, isPhu, … |  | game-estate, game-heaven, game-items |
| `fatequest.js` | 103 | 14 | Thiết kế game + Backend |  | 13: HOURS, HOUR_TEXT, inHours, QUESTS, PERK, DAY_MIN, … |  | game-fate |
| `features.js` | 53 | 11 | Thiết kế game + Client/UI |  | 4: IOS, FEATURES, TEXT, hasStation |  | game-ai-model, game-ai-persona |
| `flight-poses.js` | 60 | 16 | Thiết kế game + Client/3D |  | 2: POSES, poseOf |  | game-flight |
| `flight.js` | 40 | 16 | Thiết kế game + Client/3D |  | 9: FS, FS_NAME, TAKEOFF_S, rarityBonus, SPEED_CAP, newFlight, … |  | game-flight |
| `forest.js` | 147 | 30 | Client/3D | HUYỀN GIỚI — rừng: cây sinh thủ tục (trees.js) ba tầng chi tiết. gần (&lt; near m) cây đầy đủ, đổ bóng vừa (&lt; mid m) cùng hình học, không đổ bóng (máy yếu) xa «impostor»: chụp chính cây đó thàn | 2: FOREST_Q, createForest |  |  |
| `fortune-npc.js` | 118 | 12 | Thiết kế game + Nội dung |  | 7: GUEST_DAILY, MASTERS, MASTER_OF_STATION, chartSource, framedQuestion, useGuestQuota, … |  | game-fortune |
| `fortune-ui.js` | 70 | 12 | Thiết kế game + Nội dung |  | 3: playerChart, fortuneBody, openFortune |  |  |
| `fx-foliage.js` | 445 | 30 | Client/3D | HUYỀN GIỚI — GIÓ LÁ THỐNG NHẤT WIND-V2 + CỎ BLADE 3-TRI + HOA ĐỒNG CỎ (docs/GAME-SIEU-THUC-THIET-KE.md §2.1–2.2, §4.3). • WIND: một bộ uniform dùng chung { uT, uDir, uGust } — hướng LẤY ĐÚNG | 8: WIND, tickWind, applyWindV2, windDepthMat, windifyForest, sweepCityWind, … |  |  |
| `game.css` | 680 | 22 | Client/UI |  | 0 |  |  |
| `gen.js` | 59 | 30 | Client/3D |  | 2: gen, genBusy |  |  |
| `gen.worker.js` | 36 | 30 | Client/3D |  | 0 |  |  |
| `grass.js` | 175 | 30 | Client/3D | HUYỀN GIỚI — cỏ thật quanh người chơi (thay «thảm xanh» phẳng). • Hàng chục nghìn khóm cỏ, mỗi khóm 3–5 ngọn cong, vuốt nhọn, gốc tối ngọn sáng. • Vị trí xoay vòng (toroidal) theo người chơi | 2: GRASS_Q, createGrass |  |  |
| `ground-tex.js` | 370 | 30 | Client/3D |  | 10: GROUND_LAYERS, groundLayersData, paveData, waterNormalData, layersTexture, placeholderArray, … |  |  |
| `gu-gongan.js` | 143 | 12 | Thiết kế game + Nội dung | ĐƯỜNG THẦY · TAB «ÁN CỔ» (docs/GAME-THIET-KE-CHOT.md P0-1) — đọc án cổ 命例, tự đoán 2–3 bước rồi ĐỐI CHIẾU HAI PHÁN: cổ pháp nguyên văn vs engine tự tiêu (analyzeSummary — classical-runner.js | 3: gradeGongan, compareCase, buildGongan | classical-cases, classical-runner, anti-manipulation-data, constants | game-thay-mo-rong |
| `guild-core.js` | 360 | 14 | Thiết kế game + Backend | SỔ VIỆC LÀM (thuần JS, chạy được cả trong worker) — chỗ làm có hạn, ca làm, chấm lương, sổ tiền công. worker/guild.js bọc lớp này trong Durable Object `Guild` (một bản toàn cục, như Estate); | 15: CMINE, ORE, ORE_NODES, cmineSpawn, inCMine, workplaces, … |  | game-amduc, game-econ, game-heaven, game-jobs, quan-mmo |
| `halls.js` | 268 | 12 | Thiết kế game + Nội dung |  | 13: gradeStep, totalOf, buildDieuHau, quoteBank, buildThuVien, hehunTags, … | chart, han-nuan, hehun, ziwei, mangpai, constants, kb | game-halls, game-npc-deep |
| `haptics.js` | 30 | 22 | Client/UI |  | 2: buzz, lockPortrait |  |  |
| `heaven.js` | 74 | 10 | Thiết kế game + Client/3D | CỬU TRỌNG THIÊN (thuần JS, tất định — NHA-DIADIEM-MANIFEST §2): chín đảo trời ở dải không gian phía Đông. · đảo giữa Quân Thiên (phủ 100 × 100 m + quảng trường ngọc 30 m) · 8 đảo ngoài cách  | 6: HEAVEN, THIEN_THE, inHeaven, heavenLayout, tienPlot, registerHeaven |  | game-heaven |
| `heaven3d.js` | 206 | 10 | Thiết kế game + Client/3D | CỬU TRỌNG THIÊN — dựng hình (bố cục: heaven.js · NHA-DIADIEM-MANIFEST §2). Dựng lười lần đầu bước vào vùng trời. · mặt đảo lát ngọc trắng (thảm cỏ tiên trong tường phủ) + ĐÁY ĐÁ treo hình nó | 1: createHeaven |  |  |
| `home-edit.js` | 214 | 15 | Thiết kế game + Backend |  | 1: homeEditBody |  |  |
| `homefs.js` | 79 | 15 | Thiết kế game + Backend |  | 3: sectorOf, scoreHome, warmReward |  | game-estate |
| `homes.js` | 135 | 10 | Thiết kế game + Client/3D |  | 7: FORTUNE_ROTA, enterables, doorOfRoom, doorNear, houseAt, knockReply, … |  | game-homes |
| `huyenhoc.js` | 71 | 18 | Thiết kế game |  | 16: AD_LEVELS, NG_LEVELS, adLevel, ngLevel, ngWords, addNghiep, … |  | game-huyenhoc |
| `illness.js` | 183 | 13 | Thiết kế game |  | 23: ILLS, EXAM, CURE_MS, SELF_HEAL_H, DEBT_RATE, illState, … |  | game-amduc, game-fate, game-illness, game-vehicles |
| `incense3d.js` | 100 | 10 | Thiết kế game + Client/3D |  | 1: createIncense |  |  |
| `innerfill.js` | 114 | 10 | Thiết kế game + Client/3D |  | 2: occupancy, innerHouses |  | game-batquai, game-items, game-water |
| `interior-build.js` | 789 | 30 | Client/3D | DỰNG NỘI THẤT PHÒNG LƯỚI (rooms.js) — dựng LƯỜI khi người chơi bước vào, giữ tối đa 6 phòng, giải phóng phòng cũ nhất. Ba loại: · cửa hàng: quầy + chủ tiệm (NPC có tên) + hàng THẬT của tiệm  | 3: furnishZone, makeZoneCtx, createRoomBuilder |  |  |
| `interior.js` | 523 | 10 | Thiết kế game + Client/3D |  | 2: VILLA_ROOMS, createInteriors | taisui-general |  |
| `inventory.js` | 140 | 17 | Thiết kế game + Backend |  | 17: BAG_MAX, freshness, checkpoint, newStack, rot, merge, … |  | game-econ |
| `items.js` | 208 | 15 | Thiết kế game + Backend |  | 20: WX_NAME, SHOP_TYPES, ITEMS, ITEM, itemsOfShop, COUPLETS, … |  | game-city-v4, game-items, game-life |
| `jobplaces.js` | 30 | 10 | Thiết kế game + Client/3D |  | 3: CART, BOSS, registerJobPlaces |  |  |
| `jobplaces3d.js` | 80 | 10 | Thiết kế game + Client/3D |  | 2: createJobPlaces, makeParcel |  |  |
| `jobs.js` | 170 | 14 | Thiết kế game + Backend |  | 22: relation, REL, HOUR_LUCK, JOBS, riskOf, settle, … |  | game-amduc, game-jobs, game-life |
| `jobzones.js` | 65 | 14 | Thiết kế game + Backend |  | 5: zones, inZone, moonAge, isRam, open |  | game-jobs |
| `kinh-tu.js` | 43 | 12 | Thiết kế game + Nội dung | ĐƯỜNG THẦY · TAB «CHỌN KINH» (docs/GAME-THIET-KE-CHOT.md P0-1) — Đạo Tạng gợi kinh theo Dụng Thần + cách cục + việc đang hỏi. Module thuần logic, không DOM. Engine: suggestDaozangChartAware  | 1: kinhTu | daozang-data | game-thay-mo-rong |
| `landmarks.js` | 531 | 10 | Thiết kế game + Client/3D |  | 1: createLandmarks |  |  |
| `law-ui.js` | 76 | 19 | Thiết kế game |  | 5: sentenceLine, lawBookBody, verdictBody, wardenBody, overseerBody |  |  |
| `law.js` | 134 | 19 | Thiết kế game |  | 22: FINE_XU, GATE_FACTOR, PERMA_AT, RESPAWN_MS, ARTICLES, lawState, … |  | game-illness, game-law |
| `life-ui.js` | 167 | 13 | Thiết kế game |  | 5: fmtVan, vitalsBody, menuBody, dormBody, sleepOverlay |  |  |
| `life.js` | 234 | 13 | Thiết kế game |  | 37: START_VAN, LUONG, RATE, NIGHT_WAKE, OFFLINE, ACT, … |  | game-amduc, game-cosmetics, game-fate, game-huyenhoc, game-illness, game-items, game-law, game-life, game-vehicles |
| `lifeplaces.js` | 34 | 10 | Thiết kế game + Client/3D |  | 9: KEY, STALL, DORM, WELL, TAVERN_DOOR, SPOTS, … |  | game-life |
| `lifeplaces3d.js` | 63 | 10 | Thiết kế game + Client/3D |  | 2: createLifePlaces, makeYoke |  |  |
| `lights.js` | 40 | 30 | Client/3D |  | 6: LIGHTS, GLOW_MATS, addLight, removeRoomLights, addGlow, glowAll |  |  |
| `lotus.js` | 166 | 30 | Client/3D |  | 4: waterSurface, lotusLife, updateLotus, disposeLotus |  |  |
| `luanhoi.js` | 90 | 18 | Thiết kế game |  | 12: PATHS, STARVE_LOW, causeOf, dying, weigh, pathFor, … |  | game-huyenhoc |
| `main.js` | 1842 | 30 | Client/3D | HUYỀN QUÁN — lõi game: cổng, vòng lặp, điều khiển (phím, chạm, joystick ảo), HUD, bảng. Gọi qua mount.js sau khi markup đã chèn vào DOM. Spec: docs/GAME-HUYEN-QUAN-SPEC.md · Kế hoạch: docs/G | 1: startGame | daily |  |
| `mansion3d.js` | 203 | 10 | Thiết kế game + Client/3D | KHUÔN VIÊN 3D — 16 biệt phủ + 240 biệt thự (mansions.js) ở vành phủ Ngoại Thành, mỗi phủ / mỗi khu một phong cách. · Va chạm + nền đăng ký NGAY cho mọi khuôn viên (đi vào được, A* / NPC biết | 1: createMansions |  |  |
| `mansions.js` | 188 | 10 | Thiết kế game + Client/3D | KHUÔN VIÊN ĐI BỘ (thuần JS, tất định) — 16 BIỆT PHỦ + 240 BIỆT THỰ ở vành phủ Ngoại Thành. Lô do cityblocks.mansionPlots / villaLots quy hoạch; bố cục trong lô theo phong thủy và phong cách  | 12: DOOR_W, estates, mansions, estateByH, mansion, toLocal, … |  | game-heaven, game-mansion, game-water |
| `map-rating.js` | 91 | 12 | Thiết kế game + Nội dung | MAP RATING 6 MỨC → TỪ MỀM (docs/npc-ai/06-bo-loc-hau-xu-ly-v1-v8.md §6.2 — pseudo-code «mẫu bắt buộc»; docs/GAME-NPC-AI-THIET-KE-DAY-DU.md G0 mục 15.5d) — helper thuần: 6 mức rating lưu niên | 8: FORBIDDEN, RATING_LEVELS, TONE_OF, SOFT_LABELS, TONE_ORDER, softenRatings, … |  | map-rating, story-gen |
| `map-ui.js` | 285 | 22 | Client/UI | BẢN ĐỒ HUYỀN THÀNH (v4) — bản đồ chi tiết kiểu game nhập vai lớn (Genshin / WoW / GTA): · toàn màn hình, KÉO để di, LĂN chuột / chụm 2 ngón để phóng (từ cả thành 4,25 km tới từng căn nhà) ·  | 8: LAYERS, mapData, drawMap, searchMap, hitMap, nearestStation, … |  | game-map |
| `market.js` | 44 | 17 | Thiết kế game + Backend |  | 14: DAY, BAND, baseXu, refPrice, band, saleFee, … |  | game-econ |
| `markup.js` | 65 | 22 | Client/UI | Khung HTML của game — chèn vào bất kỳ host nào (game.html trên web, overlay trong vỏ iOS). | 1: gameMarkup |  |  |
| `master-ui.js` | 123 | 12 | Thiết kế game + Nội dung | THẦY LUẬN (AI) — dùng nguyên bộ AI của app (../engine/ai.js: askAI stream + tool tra cứu, tóm tắt lá số đã tính, «não» suy luận) + tự chấm Neo (../engine/neo-checker.js). Trong game: thầy tr | 1: masterChatBody |  |  |
| `models.js` | 769 | 30 | Client/3D |  | 33: U, toWorld, toTile, materials, mesh, mergeStatic, … |  |  |
| `motion.js` | 179 | 16 | Thiết kế game + Client/3D | DI CHUYỂN TỰ DO (thuần JS — main.js gọi mỗi khung, test Node dùng được): · chạy nhanh (Shift, tốn thể lực) · nhảy (Space) + khinh công nhảy hai lần trên không · giữ Space khi rơi = lượn (rơi | 11: G, SPRINT, WADE, SWIM_V, FLOAT, SWIM, … |  | game-motion, game-sky |
| `mount.js` | 18 | 30 | Client/3D | mountGame(host, { onExit }) — điểm gắn duy nhất cho mọi nền tảng. Web: game.html gọi không có onExit. iOS: vỏ Lữ Đăng mở overlay, truyền onExit để quay về tab trước. Gọi lại lần 2 trên cùng  | 1: mountGame |  |  |
| `movement.js` | 34 | 16 | Thiết kế game + Client/3D |  | 5: WATER_WALK, DROWN_HP, waterWalkOf, spendWaterWalk, FX_CODE |  | game-motion |
| `names.js` | 26 | 21 | AI/NPC + Nội dung | Tên khách ngẫu nhiên kiểu Sansa ("Mây Thong Thả") + câu tĩnh tâm cho Lư Hương. | 2: randomName, CALM_LINES |  |  |
| `namhan.js` | 70 | 12 | Thiết kế game + Nội dung | ĐƯỜNG THẦY · TAB «NĂM HẠN CỦA BẠN» (docs/GAME-THIET-KE-CHOT.md P0-1) — đại vận đang đi + chủ đề thập niên + 5 năm tới, luận từ lá số CỦA NGƯỜI CHƠI (R do stations.js:709-713 truyền sẵn qua c | 3: SOFT_RATING, softRating, buildNamHan | liunian-pro, dayun-god, remedy-fate | game-thay-mo-rong |
| `net.js` | 284 | 31 | Backend + Client | HUYỀN QUÁN MMO — client mạng. Offline-first: không kết nối được thì game vẫn chơi đơn như cũ; có mạng thì thấy người thật trong cùng phòng (shard). Giao thức: ./protocol.js · Máy chủ: worker | 2: pid, createNet |  | quan-protocol |
| `npc-chat-core.js` | 158 | 21 | AI/NPC + Nội dung | NPC HỘI THOẠI BẰNG LLM — phần THUẦN (P6, test Node). Đặc tả §8. · Lọc đầu vào (≤ 300 ký tự, bỏ ký tự điều khiển, chặn thô tục) → định tuyến ý định: xã giao (cache theo NPC × ý định × bậc thi | 16: MAX_IN, cleanInput, route, cacheable, affTier, cacheKey, … |  | game-econ |
| `npc-chat-ui.js` | 60 | 21 | AI/NPC + Nội dung | KHUNG TRÒ CHUYỆN VỚI NPC (P6) — gõ tự do (≤ 300 ký tự), NPC trả lời bằng LLM qua /api/npc/chat. Thẻ hành động do máy chủ đã duyệt (báo giá trong khung 80–110%, mời làm công, cho chịu, gợi ý  | 1: chatBody |  |  |
| `npc-deep.js` | 54 | 12 | Thiết kế game + Nội dung | BƯỚC «NĂM NAY» CHO 4 SẢNH NGHỀ (docs/GAME-THIET-KE-CHOT.md P0-2) — hàm thuần npcDeep(R, nowYear): nhận LÁ SỐ KHÁCH đã có sẵn ở builder (R = npcR(npc, year), halls.js:26) và luận lưu niên năm | 2: TONE_OF, npcDeep | liunian-pro, remedy-fate | game-npc-deep |
| `npc-personas.js` | 156 | 21 | AI/NPC + Nội dung | NPC-AI G0 · NPC-PERSONAS — module THUẦN (không DOM, không state, không mạng) của chuỗi persona Huyền Quán (docs/npc-ai/04-kien-truc-persona-object.md §4.4.1; lộ trình docs/npc-ai/15-lo-trinh | 4: personaAiAllowed, getPersona, personaSystemPrompt, personaBark |  | game-ai-persona, game-fortune, persona-schema |
| `npc.js` | 61 | 21 | AI/NPC + Nội dung |  | 3: hashSeed, rng, makeNpc |  | game-npc-deep, story-gen |
| `obstacles.js` | 195 | 30 | Client/3D |  | 28: CELL, addBlock, markSolidCell, unmarkSolidCell, cellOf, addSolidRect, … |  | game-collide, game-heaven, game-law, game-motion, game-sky, game-state |
| `perf.js` | 30 | 30 | Client/3D | Đo giật khung (công cụ phát triển): đoạn việc nào chiếm luồng chính > 8 ms thì ghi lại. Xem trong console: __perf.top() — gộp theo tên, sắp theo tổng thời gian. | 2: record, span |  |  |
| `persona-data.js` | 1122 | 21 | AI/NPC + Nội dung | NPC-AI G0 · PERSONA-DATA — dữ liệu 20 persona canon + PERSONA-CHUNG 10 luật (docs/npc-ai/04-kien-truc-persona-object.md §4.1/§4.2; hồ sơ 17–36; lộ trình docs/npc-ai/15-lo-trinh-tich-hop.md § | 24: PERSONA_CHUNG_LUAT, PERSONA_CHUNG_10_LUAT, PERSONA_VAN_COC, PERSONA_KHONG_TIENSINH, PERSONA_THAY_TUBINH, PERSONA_TRUONG_THIEN_SU, … |  | bark-pool, game-ai-persona, persona-schema |
| `places-ui.js` | 194 | 22 | Client/UI | MENU «ĐỊA ĐIỂM» (NHA-DIADIEM-MANIFEST §3) — thay «Các gian & sảnh nghề»: chia theo NHU CẦU, gần nhất trước (kiểu «Find NPC» của Black Desert: tìm theo chức năng, chọn là đi tới nơi gần nhất) | 3: TABS, rowsOf, placesBody |  | game-heaven |
| `prison.js` | 50 | 19 | Thiết kế game |  | 8: JAIL, MINE, ORES, CELLS, jailSpawn, mineSpawn, … |  | game-heaven, game-law |
| `prison3d.js` | 77 | 19 | Thiết kế game |  | 1: createPrison |  |  |
| `production.js` | 117 | 17 | Thiết kế game + Backend |  | 15: SEASON, inSeason, plotsOf, rent, extend, plant, … |  | game-econ |
| `progress.js` | 59 | 11 | Thiết kế game + Client/UI |  | 10: xpFor, levelOf, effLevel, GIATRI, WX_GIATRI, vipActive, … |  | game-progress |
| `protocol.js` | 274 | 31 | Backend + Client |  | 40: allowedTitle, VERSION, ROOM_CAP, MAX_ROOMS, MOVE_HZ, MSG_PER_SEC, … |  | game-auth, game-city-v4, game-cosmetics, game-econ, game-estate, game-heaven, game-homes, game-jobs, game-law, game-spawn, game-state, quan-mmo, quan-protocol |
| `que-ui.js` | 298 | 12 | Thiết kế game + Nội dung | THẦY GIẢI QUẺ (docs/GAME-V2-THIET-KE.md §S6 + docs/GAME-THIET-KE-CHOT.md P0-1) — 5 phép của trang chính, cùng engine: Mai Hoa Dịch Số (theo giờ / theo 2 số) · Lục Hào (gieo 3 xu × 6) · Tiểu  | 1: queBody | meihua, liuyao, xiaoliuren, jinkoujue, qiuqian, hexagram-meaning | game-thay-mo-rong |
| `raze.js` | 123 | 19 | Thiết kế game |  | 7: initRaze, targetNear, strike, applyRazed, tickRaze, razedCount, … |  |  |
| `realm.js` | 91 | 18 | Thiết kế game |  | 14: REALMS, realmState, effectiveLevel, realmOf, canBreak, breakthrough, … |  | game-huyenhoc |
| `render.js` | 318 | 30 | Client/3D | HUYỀN QUÁN — vẽ sân quán bằng canvas (pixel art sinh bằng code, không file ảnh). Đơn vị vẽ = ô (TILE px logic); ctx đã scale sẵn theo độ phân giải màn hình. | 5: ROBE, nightLevel, drawPlayer, createRenderer, clientToTile |  |  |
| `render3d.js` | 1734 | 30 | Client/3D | HUYỀN QUÁN 3D — cảnh, camera thứ ba, ánh sáng theo giờ thật, hạt, nhãn HTML, chọn điểm bằng raycast. Spec mục 5 + 9. Cùng giao diện với renderer 2D: { resize, frame(scene, dt), yaw, rotate(s | 1: create3D | crisis |  |
| `river3d.js` | 170 | 10 | Thiết kế game + Client/3D |  | 4: bridgeBody, bridgeRails, riverBridgeBody, createRiver |  |  |
| `roads.js` | 91 | 10 | Thiết kế game + Client/3D |  | 6: CITY_R, roadPath, roadLines, FIELD_RANGE, roadField, makeRoadSampler |  |  |
| `roomgrid.js` | 15 | 10 | Thiết kế game + Client/3D |  | 5: COLS, SLOT_EST, slotOrigin, SHOP_SIZE, shopSize |  |  |
| `rooms.js` | 91 | 10 | Thiết kế game + Client/3D |  | 15: TEMPLE_NB, roomSpecs, roomByKey, roomAtDyn, insideOf, exitOf, … |  | game-homes |
| `season.js` | 12 | 10 | Thiết kế game + Client/3D | MÙA trong game (docs/CAY-QUAN-MANIFEST.md §5 — G-5.3): theo tiết khí giờ Việt Nam Lập xuân 4/2 · Lập hạ 5/5 · Lập thu 7/8 · Lập đông 7/11. Thử mùa khác: localStorage 'huyenquan:season'. Dùng | 2: SEASONS, seasonOf |  |  |
| `sect.js` | 261 | 10 | Thiết kế game + Client/3D |  | 1: buildSect |  |  |
| `shop-data.js` | 27 | 15 | Thiết kế game + Backend |  | 3: SVC, svcInfo, USE_VERB |  |  |
| `shop-ui.js` | 445 | 15 | Thiết kế game + Backend | THÀNH BÁT QUÁI — bảng tương tác trong phòng (world.js › trạm ảo 'spot'): owner chủ tiệm → toàn bộ hàng của tiệm + bán lại đồ trong túi ware một món bày trong tiệm → thẻ hàng, mua svc dịch vụ | 3: fsView, listingsView, openSpot |  |  |
| `shops.js` | 64 | 10 | Thiết kế game + Client/3D |  | 3: FACADE_WD, cityShops, shopByHouse |  | game-items |
| `spawn.js` | 38 | 10 | Thiết kế game + Client/3D | NƠI XUẤT HIỆN (v4 · G3) — thay cho MỘT điểm chung (sân Sơn Môn, máy chủ gán cứng). Kết hợp: lần đầu vào → Tân Thủ (đi kèm hướng dẫn tân thủ); các lần sau người chơi chọn: · chỗ lần trước (mặ | 4: WARD_OF_WX, WX_VI, spawnOptions, savablePos |  | game-spawn |
| `state.js` | 395 | 11 | Thiết kế game + Client/UI |  | 47: KEY, REWARD, CAPS, INCENSE_MS, TITLES, TEAS, … |  | game-amduc, game-auth, game-cases, game-cosmetics, game-estate, game-fate, game-huyenhoc, game-illness, game-items, game-law, game-life, game-progress, game-state, game-vanmenh, game-vehicles |
| `stations.js` | 1015 | 12 | Thiết kế game + Nội dung | HUYỀN QUÁN — nội dung từng gian (bảng DOM) + gọi engine Bát Tự / Bát Trạch / Xăm. Spec: docs/GAME-HUYEN-QUAN-SPEC.md mục 7. `api` do main.js cấp: { state, panel, onClose(body, fn), after(gai | 8: esc, softRating, chartOf, todayInfo, openBook, openClassicalList, … | crisis, chart, zhai, daily, qiuqian, constants, daily-guide |  |
| `story-gen.js` | 191 | 21 | AI/NPC + Nội dung | STORY GENERATOR CHO KHÁCH PROCEDURAL (docs/npc-ai/08-npc-procedural-story- generator.md §8.4 — chủ sở hữu chữ ký; docs/GAME-NPC-AI-THIET-KE-DAY-DU.md G0 mục 15.5c) — makeStory(seed, R, slot, | 2: storySeed, makeStory | han-nuan, liunian-pro | story-gen |
| `streets.js` | 48 | 10 | Thiết kế game + Client/3D | DÃY NHÀ PHỐ AAA Nội Thành — nguồn dữ liệu DUY NHẤT cho landmarks.js (đặt nhà) và script kiểm placement (_neo_tmp/check-streethouses.mjs). Bài học 2026-11-14: check hardcode biến thể sai ở 10 | 3: AAA_SPECS, STREET_SEED, streetHouses |  |  |
| `temples.js` | 32 | 12 | Thiết kế game + Nội dung |  | 4: GODS, GOD_OF_WARD, GOD_OF_NB, godOfTemple |  |  |
| `terrain-mesh.js` | 140 | 30 | Client/3D |  | 9: ROAD_RES, CHUNK, CHUNKS, groundAt, chunkData, TREE_STEP, … |  |  |
| `terrain.js` | 220 | 10 | Thiết kế game + Client/3D |  | 28: SCALE, WORLD, HALF, WATER, CLOUD_SEA, EDGE, … |  | game-city-v4, game-halls, game-heaven, game-law, game-mansion, game-motion, game-sky, game-water, terrain |
| `textures.js` | 289 | 30 | Client/3D | HUYỀN QUÁN 3D — texture sinh bằng canvas, phong cách «Sơn Mài» (spec mục 9.2). Không dùng file ảnh. Mỗi hàm trả THREE.CanvasTexture (sRGB) đã cấu hình. | 18: PAL, rng, lacquerTex, panelTex, stoneTex, roofTex, … |  |  |
| `thaitue.js` | 81 | 12 | Thiết kế game + Nội dung |  | 3: suiYear, thaiTue, thaiTueBark | taisui-general, taisui, constants | game-vanmenh |
| `trees.js` | 206 | 30 | Client/3D | HUYỀN GIỚI — cây sinh thủ tục kiểu game thật: thân/cành là ống thuôn có vỏ cây, tán là cụm «thẻ lá» (quad có alpha) với pháp tuyến cầu → ánh sáng mềm có khối. pine : thông núi kiểu Hoàng Sơn | 4: barkTexture, treeTextures, makePine, makeLeafTree |  |  |
| `tutorial.js` | 42 | 11 | Thiết kế game + Client/UI |  | 7: STEPS, tutState, active, current, advance, skip, … |  | game-spawn |
| `vanmenh-ui.js` | 155 | 12 | Thiết kế game + Nội dung |  | 4: roomData, vanBiaBody, vanGateBody, thaiTueBody | constants |  |
| `vanmenh.js` | 91 | 12 | Thiết kế game + Nội dung | VẬN MỆNH CÁC — hành lang đại vận của chính người chơi (docs/GAME-NOI-DUNG-THEO-APP.md). Mỗi cổng = một đại vận 10 năm: can chi, thập thần can/chi, trường sinh của vận, chấm điểm, chủ đề thập | 4: VAN_GATES, vanMenh, vanBiaBark, vanGateBark | life-trajectory, dayun-changsheng, phase-narrative, constants | game-vanmenh |
| `vehicles.js` | 114 | 15 | Thiết kế game + Backend |  | 19: VEHICLES, SEIZE_DAYS, HOUSE_UPKEEP, PANTRY_MS, FLY_WAKE_PER_MIN, garage, … |  | game-fate, game-vehicles |
| `venue.js` | 87 | 17 | Thiết kế game + Backend |  | 8: dishValue, priceFactor, sellable, score, dayCost, settleDay, … |  | game-econ |
| `wardrobe-ui.js` | 131 | 11 | Thiết kế game + Client/UI |  | 1: wardrobeBody | constants |  |
| `water.js` | 103 | 16 | Thiết kế game + Client/3D | NƯỚC (thuần — motion.js, boats.js, water3d.js, test dùng chung): mực nước, độ sâu, loại nước, dòng chảy, gió, sóng. Sóng = tổng 4 sóng sin theo hướng gió (cùng hằng số với shader water3d.wav | 10: setWaterTime, waterTime, WAVES, AMP, wind, waveHeight, … |  | game-water |
| `water3d.js` | 126 | 30 | Client/3D |  | 7: time, RIPPLE_N, tick, ripple, waveGLSL, SHARED_UNIFORMS, … |  |  |
| `waterways.js` | 204 | 10 | Thiết kế game + Client/3D |  | 22: WATER_LEVEL, CITY_WALL_A, CITY_FLAT_A, RIVER_ARC_U, LAKE_U, QUAY_W, … |  | game-city-v4, game-motion, game-water |
| `work-games.js` | 208 | 14 | Thiết kế game + Backend |  | 4: rng, HERBS, play, GAME_KINDS |  |  |
| `work.js` | 343 | 14 | Thiết kế game + Backend | VIỆC LÀM (P2, client) — bảng Chiêu công trong tiệm, ca làm, mini-game, phu áp hàng, mỏ dân sự, huy hiệu ca. Máy chủ (Guild DO — guild-core.js) giữ chỗ làm, chấm lương, ghi sổ; ví tiền vẫn ở  | 2: ERR, createWork |  |  |
| `world.js` | 375 | 10 | Thiết kế game + Client/3D |  | 22: COLS, ROWS, TILE, PROPS, HALLS, PLACES, … |  | game-halls, game-homes, game-state |
| `world3d.js` | 415 | 30 | Client/3D | HUYỀN GIỚI — dựng thế giới mở trong Three.js (docs/DAI-THE-GIOI-DESIGN.md §C2–C3, §C7). Địa hình chunk 128 m + LOD (64/32/8 ô) + skirt chống nứt, tô màu theo độ cao/độ dốc; trời tán xạ (Sky) | 2: QUALITY, createWorld |  |  |
| `zheri-case.js` | 134 | 12 | Thiết kế game + Nội dung | ÁN TRẠCH NHẬT (sảnh Lịch Đường) — khách cần chọn ngày cho một việc lớn. Đáp án do engine app tính: ../engine/zheri.js (12 trực, Hoàng/Hắc đạo, xung–hại–hình–hợp tuổi). 3 bước: lọc ngày xung  | 10: ZHERI_STEPS, ZHERI_TITLE, CHONG, OFFICERS, JOB_VI, birthZhi, … | zheri, constants | game-zheri |

## A1.3 Máy chủ `worker/`

| tệp | dòng | chương | bộ phận | vai trò (đầu tệp) | test |
|---|---|---|---|---|---|
| `worker/accounts.js` | 185 | 31 | Backend |  |  |
| `worker/admin.js` | 1885 | 32 | Vận hành |  |  |
| `worker/auth.js` | 183 | 31 | Backend |  |  |
| `worker/economy.js` | 35 | 31 | Backend | ECONOMY — Durable Object duy nhất («economy») giữ sổ kinh tế Phần II cho mọi shard: kho đồ & độ tươi (P8), sản xuất + chợ ký gửi + Thương hội (P9), bếp & bếp trưởng (P10), mặt bằng / nhà hàn |  |
| `worker/estate.js` | 77 | 31 | Backend |  |  |
| `worker/guild.js` | 25 | 31 | Backend |  |  |
| `worker/index.js` | 235 | 31 | Backend | Cloudflare Worker — serve static app + proxy LLM + admin + anti-scraping + anti-abuse. |  |
| `worker/llm.js` | 61 | 21 | AI/NPC + Backend | GỌI LLM PHÍA MÁY CHỦ (không stream) — dùng cho NPC chat (§8) và trọng tài thầy mệnh lý (§14.4). Cùng cấu hình «AI Config» của admin (ADMIN_KV ai:config): khoá z.ai trả phí trước, pool miễn p | game-ai-model |
| `worker/npc-chat.js` | 76 | 21 | AI/NPC + Backend |  | crisis |
| `worker/quan-room.js` | 336 | 31 | Backend |  | game-state, quan-mmo |

