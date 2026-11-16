<!-- TỆP SINH TỰ ĐỘNG bởi scripts/docs-game-gen.mjs — KHÔNG SỬA TAY. Sinh lại: node scripts/docs-game-gen.mjs -->
# A1 · Bản đồ mã: mô-đun → chương → bộ phận → test

> Sinh từ mã nguồn. Khi một con số ở chương khác lệch với tệp này thì **tệp này (tức là mã đang chạy) thắng** và chương kia phải sửa.

Tổng: **158 tệp game, 33764 dòng**; **10 tệp máy chủ**. Chưa gán chương: **0**.

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
| 30 | Kỹ thuật client | 24 | 9074 |
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
| `archkit-style.js` | 342 | 30 | Client/3D |  | 9: styleMats, styledBuilding, styledPavilion, styledFence, styledGate, waterFeature, … |  |  |
| `archkit.js` | 296 | 30 | Client/3D |  | 11: roofMatOf, kit, plinth, hall, gateHouse, walls, … |  |  |
| `assets.js` | 464 | 30 | Client/3D |  | 19: HD_IDS, hasLod, getModelQuality, setModelQuality, setWarmup, warmObject, … |  |  |
| `audio.js` | 102 | 22 | Client/UI |  | 6: setSound, bell, knock, rattle, splash, paddle |  |  |
| `auth-core.js` | 117 | 31 | Backend + Client |  | 24: OTP_TTL_MS, OTP_TRIES, SESSION_DAYS, WS_TOKEN_MS, SAVE_MAX, SAVE_CHUNK, … |  | game-auth |
| `bark-pool.js` | 162 | 21 | AI/NPC + Nội dung |  | 3: pickBark, BARK_POOLS, DYNAMIC_STATION_POOLS |  | bark-pool |
| `batquai.js` | 276 | 10 | Thiết kế game + Client/3D |  | 33: OCT_A, TAN8, OCT_SIDE, OCT_V, WALL_T, RING_A, … |  | game-batquai, game-city-v4, game-collide, game-items, game-mansion, game-water |
| `batquai3d.js` | 354 | 10 | Thiết kế game + Client/3D |  | 12: BQ_AVAILABLE, place, baguaTexture, mats, octWall, cityGates, … |  |  |
| `boat-ui.js` | 122 | 16 | Thiết kế game + Client/3D |  | 3: DOCK_KEY, registerDocks, createBoatControl |  |  |
| `boats.js` | 156 | 16 | Thiết kế game + Client/3D |  | 14: BOAT_TYPES, TYPE_BY_IDX, typeId, RENT_MS, createBoat, hullPoints, … |  | game-water |
| `boats3d.js` | 157 | 16 | Thiết kế game + Client/3D |  | 4: makeBoat, floatBoat, createFleet, makeBoatByIdx |  |  |
| `bridges.js` | 130 | 10 | Thiết kế game + Client/3D |  | 14: DECK_T, ARCH_R, ARCH_W, deckTop, localOf, cityBridges, … |  | game-motion, game-water |
| `canals.js` | 107 | 10 | Thiết kế game + Client/3D |  | 19: MOAT, MOAT_LANE, AVE_CANAL, OUTLET, CANAL_BED, CANAL_CLEAR, … |  | game-motion, game-water |
| `case-ui.js` | 516 | 12 | Thiết kế game + Nội dung |  | 9: npcCaseBody, openMaster, classicalBody, classicalListBody, masteryHtml, zheriCaseBody, … | constants |  |
| `cases.js` | 233 | 12 | Thiết kế game + Nội dung |  | 26: WX, ADVICE_CARDS, tiaohouQuote, buildCase, STEP_WEIGHTS, STEP_ORDER, … | chart, constants, kb, classical-cases | game-cases |
| `characters.js` | 312 | 11 | Client/3D |  | 7: CHAR_ANIMS, WX_HSV, NPC_TINT, enableHd, setViewer, HEIGHT, … |  |  |
| `citizens.js` | 150 | 21 | AI/NPC + Nội dung |  | 3: setCitizenCap, setHint, createCitizens |  |  |
| `city4.js` | 275 | 10 | Thiết kế game + Client/3D |  | 12: allHouses, phuPlots, isRemoved, villaPlots, streetListings, inPhuPlot, … |  | game-homes, game-items, game-mansion, game-water |
| `cityblocks.js` | 408 | 10 | Thiết kế game + Client/3D |  | 19: TRUNG_A, OUTER_GATE_W, BELT, VILLA_STREETS, GRAND_W, RINGS, … |  | game-homes, game-items, game-mansion |
| `cityblocks3d.js` | 689 | 10 | Thiết kế game + Client/3D |  | 13: outerWall, outerGates, WATER_GATE, houseScale, houseHeight, instancedSet, … |  |  |
| `citydress3d.js` | 626 | 10 | Thiết kế game + Client/3D |  | 5: TREE_SP, treeGeo, applySeason, cityDress, _test |  |  |
| `cityident3d.js` | 206 | 10 | Thiết kế game + Client/3D |  | 9: wardGates, wardPaving, shopSigns, setEstateLookup, estateSigns, setEstateOwner, … |  |  |
| `citylayout.js` | 618 | 10 | Thiết kế game + Client/3D |  | 26: CITY, FRONT_KINDS, STREET_TYPES, NGOAI, deckTop, lotCorners, … |  | game-city-v4, game-homes, game-mansion, game-water |
| `citylook.js` | 84 | 10 | Thiết kế game + Client/3D |  | 3: WARDS, wardName, houseLooks |  |  |
| `civil.js` | 82 | 20 | Thiết kế game + Backend |  | 15: H, TIERS, PHRASES, WAIT_REMARRY, civOf, cost, … |  | game-econ |
| `coins.js` | 74 | 13 | Thiết kế game |  | 11: XU, UNITS, fromDong, toDong, split, fmt, … |  | game-cosmetics, game-items, game-law, game-life, game-vehicles |
| `collide.js` | 246 | 30 | Client/3D |  | 8: footprintIdle, flushFootprints, solidifyCells, addFootprint, onFootprint, footprints, … |  | game-collide, game-law |
| `cosmetics.js` | 274 | 11 | Thiết kế game + Client/UI |  | 24: SLOTS, RARITY, ITEMS, ITEM, DEFAULT_EQUIP, SETS, … |  | game-cosmetics |
| `court.js` | 165 | 10 | Thiết kế game + Client/3D |  | 18: U, toTile, COURT, inCourt, TERRACES, STAIRS, … |  | game-batquai, game-state |
| `crisis-ui.js` | 53 | 21 | AI/NPC + Nội dung |  | 2: guardCrisis, crisisStrip | crisis |  |
| `cuisine.js` | 149 | 17 | Thiết kế game + Backend |  | 15: SKILL_STEPS, skillNorm, thucCan, cookWx, isCopy, quality, … |  | game-econ |
| `divination.js` | 125 | 12 | Thiết kế game + Nội dung |  | 16: D, RANKS, MIN_FEE, LEN, rankOf, EXAM, … |  | econ-accounts, game-econ |
| `dz-case.js` | 121 | 12 | Thiết kế game + Nội dung |  | 12: DZ_STEPS, DZ_TITLE, PALACES, PAN_NAME, STARS, GUAS, … | chart, zhai, fengshui-compass, xuankong | game-dz |
| `econ-client.js` | 40 | 17 | Thiết kế game + Backend |  | 1: createEcon |  |  |
| `econ-core.js` | 544 | 17 | Thiết kế game + Backend |  | 3: vnDay, AGE, EconEngine |  | game-econ |
| `econ-data.js` | 164 | 17 | Thiết kế game + Backend |  | 18: COLD, REGIONS, REGION_IDS, RECIPES, RECIPE_BY, CHEFS, … |  | game-econ |
| `econ-ui.js` | 353 | 17 | Thiết kế game + Backend |  | 3: TABS, TAB_OF_AT, econBody |  |  |
| `effects.js` | 214 | 11 | Client/3D |  | 1: createGiatri |  |  |
| `estate-core.js` | 171 | 15 | Thiết kế game + Backend |  | 28: TIERS, MAX_ITEMS, MAX_ITEMS_PHU, PHU_COUNT, estatePlanOfH, zonesOfH, … |  | game-estate, game-heaven, game-life, quan-mmo |
| `estate-layout.js` | 160 | 10 | Thiết kế game + Client/3D |  | 9: STYLES, TIEN_PLAN, PHU_PLAN, VILLA_STYLES, VILLA_DISTRICT_NAME, VILLAS_PER_DISTRICT, … |  | game-mansion |
| `estate.js` | 59 | 15 | Thiết kế game + Backend |  | 8: listings, listing, fitStars, FIT_TEXT, roomOf, isPhu, … |  | game-estate, game-heaven, game-items |
| `fatequest.js` | 103 | 14 | Thiết kế game + Backend |  | 13: HOURS, HOUR_TEXT, inHours, QUESTS, PERK, DAY_MIN, … |  | game-fate |
| `features.js` | 53 | 11 | Thiết kế game + Client/UI |  | 4: IOS, FEATURES, TEXT, hasStation |  | game-ai-model, game-ai-persona |
| `flight-poses.js` | 60 | 16 | Thiết kế game + Client/3D |  | 2: POSES, poseOf |  | game-flight |
| `flight.js` | 40 | 16 | Thiết kế game + Client/3D |  | 9: FS, FS_NAME, TAKEOFF_S, rarityBonus, SPEED_CAP, newFlight, … |  | game-flight |
| `forest.js` | 147 | 30 | Client/3D |  | 2: FOREST_Q, createForest |  |  |
| `fortune-npc.js` | 118 | 12 | Thiết kế game + Nội dung |  | 7: GUEST_DAILY, MASTERS, MASTER_OF_STATION, chartSource, framedQuestion, useGuestQuota, … |  | game-fortune |
| `fortune-ui.js` | 70 | 12 | Thiết kế game + Nội dung |  | 3: playerChart, fortuneBody, openFortune |  |  |
| `game.css` | 680 | 22 | Client/UI |  | 0 |  |  |
| `gen.js` | 59 | 30 | Client/3D |  | 2: gen, genBusy |  |  |
| `gen.worker.js` | 36 | 30 | Client/3D |  | 0 |  |  |
| `grass.js` | 175 | 30 | Client/3D |  | 2: GRASS_Q, createGrass |  |  |
| `ground-tex.js` | 370 | 30 | Client/3D |  | 10: GROUND_LAYERS, groundLayersData, paveData, waterNormalData, layersTexture, placeholderArray, … |  |  |
| `gu-gongan.js` | 143 | 12 | Thiết kế game + Nội dung |  | 3: gradeGongan, compareCase, buildGongan | classical-cases, classical-runner, anti-manipulation-data, constants | game-thay-mo-rong |
| `guild-core.js` | 360 | 14 | Thiết kế game + Backend |  | 15: CMINE, ORE, ORE_NODES, cmineSpawn, inCMine, workplaces, … |  | game-amduc, game-econ, game-heaven, game-jobs, quan-mmo |
| `halls.js` | 268 | 12 | Thiết kế game + Nội dung |  | 13: gradeStep, totalOf, buildDieuHau, quoteBank, buildThuVien, hehunTags, … | chart, han-nuan, hehun, ziwei, mangpai, constants, kb | game-halls, game-npc-deep |
| `haptics.js` | 30 | 22 | Client/UI |  | 2: buzz, lockPortrait |  |  |
| `heaven.js` | 74 | 10 | Thiết kế game + Client/3D |  | 6: HEAVEN, THIEN_THE, inHeaven, heavenLayout, tienPlot, registerHeaven |  | game-heaven |
| `heaven3d.js` | 206 | 10 | Thiết kế game + Client/3D |  | 1: createHeaven |  |  |
| `home-edit.js` | 214 | 15 | Thiết kế game + Backend |  | 1: homeEditBody |  |  |
| `homefs.js` | 79 | 15 | Thiết kế game + Backend |  | 3: sectorOf, scoreHome, warmReward |  | game-estate |
| `homes.js` | 135 | 10 | Thiết kế game + Client/3D |  | 7: FORTUNE_ROTA, enterables, doorOfRoom, doorNear, houseAt, knockReply, … |  | game-homes |
| `huyenhoc.js` | 71 | 18 | Thiết kế game |  | 16: AD_LEVELS, NG_LEVELS, adLevel, ngLevel, ngWords, addNghiep, … |  | game-huyenhoc |
| `illness.js` | 183 | 13 | Thiết kế game |  | 23: ILLS, EXAM, CURE_MS, SELF_HEAL_H, DEBT_RATE, illState, … |  | game-amduc, game-fate, game-illness, game-vehicles |
| `incense3d.js` | 100 | 10 | Thiết kế game + Client/3D |  | 1: createIncense |  |  |
| `innerfill.js` | 114 | 10 | Thiết kế game + Client/3D |  | 2: occupancy, innerHouses |  | game-batquai, game-items, game-water |
| `interior-build.js` | 789 | 30 | Client/3D |  | 3: furnishZone, makeZoneCtx, createRoomBuilder |  |  |
| `interior.js` | 523 | 10 | Thiết kế game + Client/3D |  | 2: VILLA_ROOMS, createInteriors | taisui-general |  |
| `inventory.js` | 140 | 17 | Thiết kế game + Backend |  | 17: BAG_MAX, freshness, checkpoint, newStack, rot, merge, … |  | game-econ |
| `items.js` | 208 | 15 | Thiết kế game + Backend |  | 20: WX_NAME, SHOP_TYPES, ITEMS, ITEM, itemsOfShop, COUPLETS, … |  | game-city-v4, game-items, game-life |
| `jobplaces.js` | 30 | 10 | Thiết kế game + Client/3D |  | 3: CART, BOSS, registerJobPlaces |  |  |
| `jobplaces3d.js` | 80 | 10 | Thiết kế game + Client/3D |  | 2: createJobPlaces, makeParcel |  |  |
| `jobs.js` | 170 | 14 | Thiết kế game + Backend |  | 22: relation, REL, HOUR_LUCK, JOBS, riskOf, settle, … |  | game-amduc, game-jobs, game-life |
| `jobzones.js` | 65 | 14 | Thiết kế game + Backend |  | 5: zones, inZone, moonAge, isRam, open |  | game-jobs |
| `kinh-tu.js` | 43 | 12 | Thiết kế game + Nội dung |  | 1: kinhTu | daozang-data | game-thay-mo-rong |
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
| `main.js` | 1842 | 30 | Client/3D |  | 1: startGame | daily |  |
| `mansion3d.js` | 203 | 10 | Thiết kế game + Client/3D |  | 1: createMansions |  |  |
| `mansions.js` | 188 | 10 | Thiết kế game + Client/3D |  | 12: DOOR_W, estates, mansions, estateByH, mansion, toLocal, … |  | game-heaven, game-mansion, game-water |
| `map-rating.js` | 91 | 12 | Thiết kế game + Nội dung |  | 8: FORBIDDEN, RATING_LEVELS, TONE_OF, SOFT_LABELS, TONE_ORDER, softenRatings, … |  | map-rating, story-gen |
| `map-ui.js` | 285 | 22 | Client/UI |  | 8: LAYERS, mapData, drawMap, searchMap, hitMap, nearestStation, … |  | game-map |
| `market.js` | 44 | 17 | Thiết kế game + Backend |  | 14: DAY, BAND, baseXu, refPrice, band, saleFee, … |  | game-econ |
| `markup.js` | 65 | 22 | Client/UI |  | 1: gameMarkup |  |  |
| `master-ui.js` | 123 | 12 | Thiết kế game + Nội dung |  | 1: masterChatBody |  |  |
| `models.js` | 769 | 30 | Client/3D |  | 33: U, toWorld, toTile, materials, mesh, mergeStatic, … |  |  |
| `motion.js` | 179 | 16 | Thiết kế game + Client/3D |  | 11: G, SPRINT, WADE, SWIM_V, FLOAT, SWIM, … |  | game-motion, game-sky |
| `mount.js` | 18 | 30 | Client/3D |  | 1: mountGame |  |  |
| `movement.js` | 34 | 16 | Thiết kế game + Client/3D |  | 5: WATER_WALK, DROWN_HP, waterWalkOf, spendWaterWalk, FX_CODE |  | game-motion |
| `names.js` | 26 | 21 | AI/NPC + Nội dung |  | 2: randomName, CALM_LINES |  |  |
| `namhan.js` | 70 | 12 | Thiết kế game + Nội dung |  | 3: SOFT_RATING, softRating, buildNamHan | liunian-pro, dayun-god, remedy-fate | game-thay-mo-rong |
| `net.js` | 284 | 31 | Backend + Client |  | 2: pid, createNet |  | quan-protocol |
| `npc-chat-core.js` | 158 | 21 | AI/NPC + Nội dung |  | 16: MAX_IN, cleanInput, route, cacheable, affTier, cacheKey, … |  | game-econ |
| `npc-chat-ui.js` | 60 | 21 | AI/NPC + Nội dung |  | 1: chatBody |  |  |
| `npc-deep.js` | 54 | 12 | Thiết kế game + Nội dung |  | 2: TONE_OF, npcDeep | liunian-pro, remedy-fate | game-npc-deep |
| `npc-personas.js` | 156 | 21 | AI/NPC + Nội dung |  | 4: personaAiAllowed, getPersona, personaSystemPrompt, personaBark |  | game-ai-persona, game-fortune, persona-schema |
| `npc.js` | 61 | 21 | AI/NPC + Nội dung |  | 3: hashSeed, rng, makeNpc |  | game-npc-deep, story-gen |
| `obstacles.js` | 195 | 30 | Client/3D |  | 28: CELL, addBlock, markSolidCell, unmarkSolidCell, cellOf, addSolidRect, … |  | game-collide, game-heaven, game-law, game-motion, game-sky, game-state |
| `perf.js` | 30 | 30 | Client/3D |  | 2: record, span |  |  |
| `persona-data.js` | 1122 | 21 | AI/NPC + Nội dung |  | 24: PERSONA_CHUNG_LUAT, PERSONA_CHUNG_10_LUAT, PERSONA_VAN_COC, PERSONA_KHONG_TIENSINH, PERSONA_THAY_TUBINH, PERSONA_TRUONG_THIEN_SU, … |  | bark-pool, game-ai-persona, persona-schema |
| `places-ui.js` | 194 | 22 | Client/UI |  | 3: TABS, rowsOf, placesBody |  | game-heaven |
| `prison.js` | 50 | 19 | Thiết kế game |  | 8: JAIL, MINE, ORES, CELLS, jailSpawn, mineSpawn, … |  | game-heaven, game-law |
| `prison3d.js` | 77 | 19 | Thiết kế game |  | 1: createPrison |  |  |
| `production.js` | 117 | 17 | Thiết kế game + Backend |  | 15: SEASON, inSeason, plotsOf, rent, extend, plant, … |  | game-econ |
| `progress.js` | 59 | 11 | Thiết kế game + Client/UI |  | 10: xpFor, levelOf, effLevel, GIATRI, WX_GIATRI, vipActive, … |  | game-progress |
| `protocol.js` | 274 | 31 | Backend + Client |  | 40: allowedTitle, VERSION, ROOM_CAP, MAX_ROOMS, MOVE_HZ, MSG_PER_SEC, … |  | game-auth, game-city-v4, game-cosmetics, game-econ, game-estate, game-heaven, game-homes, game-jobs, game-law, game-spawn, game-state, quan-mmo, quan-protocol |
| `que-ui.js` | 298 | 12 | Thiết kế game + Nội dung |  | 1: queBody | meihua, liuyao, xiaoliuren, jinkoujue, qiuqian, hexagram-meaning | game-thay-mo-rong |
| `raze.js` | 123 | 19 | Thiết kế game |  | 7: initRaze, targetNear, strike, applyRazed, tickRaze, razedCount, … |  |  |
| `realm.js` | 91 | 18 | Thiết kế game |  | 14: REALMS, realmState, effectiveLevel, realmOf, canBreak, breakthrough, … |  | game-huyenhoc |
| `render.js` | 318 | 30 | Client/3D |  | 5: ROBE, nightLevel, drawPlayer, createRenderer, clientToTile |  |  |
| `render3d.js` | 1658 | 30 | Client/3D |  | 1: create3D | crisis |  |
| `river3d.js` | 170 | 10 | Thiết kế game + Client/3D |  | 4: bridgeBody, bridgeRails, riverBridgeBody, createRiver |  |  |
| `roads.js` | 91 | 10 | Thiết kế game + Client/3D |  | 6: CITY_R, roadPath, roadLines, FIELD_RANGE, roadField, makeRoadSampler |  |  |
| `roomgrid.js` | 15 | 10 | Thiết kế game + Client/3D |  | 5: COLS, SLOT_EST, slotOrigin, SHOP_SIZE, shopSize |  |  |
| `rooms.js` | 91 | 10 | Thiết kế game + Client/3D |  | 15: TEMPLE_NB, roomSpecs, roomByKey, roomAtDyn, insideOf, exitOf, … |  | game-homes |
| `season.js` | 12 | 10 | Thiết kế game + Client/3D |  | 2: SEASONS, seasonOf |  |  |
| `sect.js` | 261 | 10 | Thiết kế game + Client/3D |  | 1: buildSect |  |  |
| `shop-data.js` | 27 | 15 | Thiết kế game + Backend |  | 3: SVC, svcInfo, USE_VERB |  |  |
| `shop-ui.js` | 445 | 15 | Thiết kế game + Backend |  | 3: fsView, listingsView, openSpot |  |  |
| `shops.js` | 64 | 10 | Thiết kế game + Client/3D |  | 3: FACADE_WD, cityShops, shopByHouse |  | game-items |
| `spawn.js` | 38 | 10 | Thiết kế game + Client/3D |  | 4: WARD_OF_WX, WX_VI, spawnOptions, savablePos |  | game-spawn |
| `state.js` | 395 | 11 | Thiết kế game + Client/UI |  | 47: KEY, REWARD, CAPS, INCENSE_MS, TITLES, TEAS, … |  | game-amduc, game-auth, game-cases, game-cosmetics, game-estate, game-fate, game-huyenhoc, game-illness, game-items, game-law, game-life, game-progress, game-state, game-vanmenh, game-vehicles |
| `stations.js` | 1015 | 12 | Thiết kế game + Nội dung |  | 8: esc, softRating, chartOf, todayInfo, openBook, openClassicalList, … | crisis, chart, zhai, daily, qiuqian, constants, daily-guide |  |
| `story-gen.js` | 191 | 21 | AI/NPC + Nội dung |  | 2: storySeed, makeStory | han-nuan, liunian-pro | story-gen |
| `streets.js` | 48 | 10 | Thiết kế game + Client/3D |  | 3: AAA_SPECS, STREET_SEED, streetHouses |  |  |
| `temples.js` | 32 | 12 | Thiết kế game + Nội dung |  | 4: GODS, GOD_OF_WARD, GOD_OF_NB, godOfTemple |  |  |
| `terrain-mesh.js` | 140 | 30 | Client/3D |  | 9: ROAD_RES, CHUNK, CHUNKS, groundAt, chunkData, TREE_STEP, … |  |  |
| `terrain.js` | 220 | 10 | Thiết kế game + Client/3D |  | 28: SCALE, WORLD, HALF, WATER, CLOUD_SEA, EDGE, … |  | game-city-v4, game-halls, game-heaven, game-law, game-mansion, game-motion, game-sky, game-water, terrain |
| `textures.js` | 289 | 30 | Client/3D |  | 18: PAL, rng, lacquerTex, panelTex, stoneTex, roofTex, … |  |  |
| `thaitue.js` | 81 | 12 | Thiết kế game + Nội dung |  | 3: suiYear, thaiTue, thaiTueBark | taisui-general, taisui, constants | game-vanmenh |
| `trees.js` | 206 | 30 | Client/3D |  | 4: barkTexture, treeTextures, makePine, makeLeafTree |  |  |
| `tutorial.js` | 42 | 11 | Thiết kế game + Client/UI |  | 7: STEPS, tutState, active, current, advance, skip, … |  | game-spawn |
| `vanmenh-ui.js` | 155 | 12 | Thiết kế game + Nội dung |  | 4: roomData, vanBiaBody, vanGateBody, thaiTueBody | constants |  |
| `vanmenh.js` | 91 | 12 | Thiết kế game + Nội dung |  | 4: VAN_GATES, vanMenh, vanBiaBark, vanGateBark | life-trajectory, dayun-changsheng, phase-narrative, constants | game-vanmenh |
| `vehicles.js` | 114 | 15 | Thiết kế game + Backend |  | 19: VEHICLES, SEIZE_DAYS, HOUSE_UPKEEP, PANTRY_MS, FLY_WAKE_PER_MIN, garage, … |  | game-fate, game-vehicles |
| `venue.js` | 87 | 17 | Thiết kế game + Backend |  | 8: dishValue, priceFactor, sellable, score, dayCost, settleDay, … |  | game-econ |
| `wardrobe-ui.js` | 131 | 11 | Thiết kế game + Client/UI |  | 1: wardrobeBody | constants |  |
| `water.js` | 103 | 16 | Thiết kế game + Client/3D |  | 10: setWaterTime, waterTime, WAVES, AMP, wind, waveHeight, … |  | game-water |
| `water3d.js` | 74 | 30 | Client/3D |  | 5: time, tick, waveGLSL, SHARED_UNIFORMS, waterMaterial |  |  |
| `waterways.js` | 204 | 10 | Thiết kế game + Client/3D |  | 22: WATER_LEVEL, CITY_WALL_A, CITY_FLAT_A, RIVER_ARC_U, LAKE_U, QUAY_W, … |  | game-city-v4, game-motion, game-water |
| `work-games.js` | 208 | 14 | Thiết kế game + Backend |  | 4: rng, HERBS, play, GAME_KINDS |  |  |
| `work.js` | 343 | 14 | Thiết kế game + Backend |  | 2: ERR, createWork |  |  |
| `world.js` | 375 | 10 | Thiết kế game + Client/3D |  | 22: COLS, ROWS, TILE, PROPS, HALLS, PLACES, … |  | game-halls, game-homes, game-state |
| `world3d.js` | 405 | 30 | Client/3D |  | 2: QUALITY, createWorld |  |  |
| `zheri-case.js` | 134 | 12 | Thiết kế game + Nội dung |  | 10: ZHERI_STEPS, ZHERI_TITLE, CHONG, OFFICERS, JOB_VI, birthZhi, … | zheri, constants | game-zheri |

## A1.3 Máy chủ `worker/`

| tệp | dòng | chương | bộ phận | vai trò (đầu tệp) | test |
|---|---|---|---|---|---|
| `worker/accounts.js` | 185 | 31 | Backend |  |  |
| `worker/admin.js` | 1885 | 32 | Vận hành |  |  |
| `worker/auth.js` | 183 | 31 | Backend |  |  |
| `worker/economy.js` | 35 | 31 | Backend |  |  |
| `worker/estate.js` | 77 | 31 | Backend |  |  |
| `worker/guild.js` | 25 | 31 | Backend |  |  |
| `worker/index.js` | 237 | 31 | Backend |  |  |
| `worker/llm.js` | 61 | 21 | AI/NPC + Backend |  | game-ai-model |
| `worker/npc-chat.js` | 76 | 21 | AI/NPC + Backend |  | crisis |
| `worker/quan-room.js` | 336 | 31 | Backend |  | game-state, quan-mmo |

