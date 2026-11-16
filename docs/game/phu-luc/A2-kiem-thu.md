<!-- TỆP SINH TỰ ĐỘNG bởi scripts/docs-game-gen.mjs — KHÔNG SỬA TAY. Sinh lại: node scripts/docs-game-gen.mjs -->
# A2 · Kiểm thử: danh sách bộ test

> Sinh từ mã nguồn. Khi một con số ở chương khác lệch với tệp này thì **tệp này (tức là mã đang chạy) thắng** và chương kia phải sửa.

Tổng **47** bộ test. **11** bộ không nằm trong lệnh npm nào. Lệnh npm trỏ tệp không tồn tại: **0**.

## A2.2 Bộ test

| tệp | dòng | trong lệnh npm | cần máy chủ dev | phạm vi (đầu tệp) | mô-đun được nhắc |
|---|---|---|---|---|---|
| `scripts/test-bark-pool.mjs` | 96 | `test:npcai` |  |  | bark-pool, persona-data |
| `scripts/test-crisis.mjs` | 97 | `test:npcai` |  |  | npc-chat |
| `scripts/test-econ-accounts.mjs` | 95 | **không** | có |  | divination |
| `scripts/test-game-ai-model.mjs` | 54 | `test:npcai` |  | Test AI của game chỉ dùng glm-5.3-flash (quyết định chủ dự án 2026-11-16) — src/game/ai-model.js, worker/llm.js › llmBackends, cổng persona gắn theo mô hình (features.js … | ai-model, llm, features |
| `scripts/test-game-ai-persona.mjs` | 168 | `test:npcai` |  |  | features, npc-personas, persona-data |
| `scripts/test-game-amduc.mjs` | 59 | `test:game` |  |  | amduc, life, illness, jobs, guild-core, state |
| `scripts/test-game-auth.mjs` | 84 | `test:game` |  |  | auth-core, protocol, state |
| `scripts/test-game-batquai.mjs` | 196 | `test:game` |  |  | batquai, court, innerfill |
| `scripts/test-game-cases.mjs` | 122 | **không** |  |  | cases, state |
| `scripts/test-game-city-v4.mjs` | 354 | `test:game` |  |  | citylayout, terrain, waterways, items, batquai, protocol |
| `scripts/test-game-collide.mjs` | 145 | **không** |  |  | obstacles, batquai, collide |
| `scripts/test-game-cosmetics.mjs` | 123 | `test:game` |  |  | cosmetics, state, protocol, life, coins |
| `scripts/test-game-dz.mjs` | 68 | `test:game` |  |  | dz-case |
| `scripts/test-game-econ.mjs` | 337 | `test:game` |  |  | econ-data, inventory, production, market, cuisine, venue, civil, divination, … |
| `scripts/test-game-estate.mjs` | 151 | `test:game` |  |  | estate, estate-core, homefs, state, protocol |
| `scripts/test-game-fate.mjs` | 64 | `test:game` |  |  | fatequest, life, illness, vehicles, state |
| `scripts/test-game-flight.mjs` | 46 | `test:game` |  |  | flight, flight-poses |
| `scripts/test-game-fortune.mjs` | 47 | **không** |  |  | fortune-npc, npc-personas |
| `scripts/test-game-halls.mjs` | 95 | `test:game` |  |  | halls, terrain, world |
| `scripts/test-game-heaven.mjs` | 74 | `test:game` |  |  | estate-core, estate, mansions, heaven, places-ui, obstacles, prison, guild-core, … |
| `scripts/test-game-homes.mjs` | 118 | `test:game` |  |  | homes, cityblocks, city4, citylayout, rooms, world, protocol |
| `scripts/test-game-huyenhoc.mjs` | 96 | `test:game` |  |  | huyenhoc, realm, luanhoi, amduc, life, state |
| `scripts/test-game-illness.mjs` | 82 | `test:game` |  |  | illness, life, law, state |
| `scripts/test-game-items.mjs` | 114 | `test:game` |  |  | items, life, coins, shops, estate, state, batquai, city4, … |
| `scripts/test-game-jobs.mjs` | 243 | `test:game` |  |  | jobs, protocol, jobzones, guild-core |
| `scripts/test-game-law.mjs` | 121 | `test:game` |  |  | law, life, coins, state, collide, obstacles, protocol, terrain, … |
| `scripts/test-game-life.mjs` | 153 | `test:game` |  |  | life, jobs, lifeplaces, state, items, estate-core, coins |
| `scripts/test-game-mansion.mjs` | 153 | `test:game` |  |  | mansions, cityblocks, citylayout, city4, batquai, estate-layout, terrain |
| `scripts/test-game-map.mjs` | 33 | **không** |  |  | map-ui |
| `scripts/test-game-motion.mjs` | 136 | `test:game` |  |  | motion, obstacles, canals, terrain, movement, waterways, bridges |
| `scripts/test-game-npc-deep.mjs` | 111 | **không** |  |  | npc-deep, npc, halls |
| `scripts/test-game-progress.mjs` | 48 | `test:game` |  |  | progress, state |
| `scripts/test-game-sky.mjs` | 135 | **không** |  |  | terrain, obstacles, motion |
| `scripts/test-game-spawn.mjs` | 57 | **không** |  |  | spawn, tutorial, protocol |
| `scripts/test-game-state.mjs` | 241 | `test:game` |  |  | state, world, obstacles, court, protocol, quan-room |
| `scripts/test-game-thay-mo-rong.mjs` | 187 | **không** |  |  | gu-gongan, namhan, kinh-tu, que-ui |
| `scripts/test-game-vanmenh.mjs` | 112 | `test:game` |  |  | vanmenh, thaitue, state |
| `scripts/test-game-vehicles.mjs` | 71 | `test:game` |  |  | vehicles, life, illness, coins, state |
| `scripts/test-game-water.mjs` | 112 | `test:game` |  |  | terrain, canals, waterways, water, city4, citylayout, innerfill, batquai, … |
| `scripts/test-game-zheri.mjs` | 77 | `test:game` |  |  | zheri-case |
| `scripts/test-map-rating.mjs` | 107 | `test:npcai` |  |  | map-rating |
| `scripts/test-persona-schema.mjs` | 175 | `test:npcai` |  |  | persona-data, npc-personas |
| `scripts/test-quan-auth.mjs` | 116 | **không** | có |  |  |
| `scripts/test-quan-mmo.mjs` | 280 | `test:mmo` | có |  | quan-room, protocol, estate-core, guild-core |
| `scripts/test-quan-protocol.mjs` | 187 | `test:mmo` |  |  | protocol, net |
| `scripts/test-story-gen.mjs` | 173 | `test:npcai` |  |  | story-gen, npc, map-rating |
| `scripts/test-terrain.mjs` | 39 | **không** |  |  | terrain |

## A2.3 Lệnh npm

| lệnh | chạy gì |
|---|---|
| `npm run dev` | vite --host :: |
| `npm run build` | vite build |
| `npm run preview` | vite preview |
| `npm run test` | node selftest.mjs |
| `npm run test:game` | node scripts/test-game-state.mjs && node scripts/test-game-zheri.mjs && node scripts/test-game-dz.mjs && node scripts/test-game-halls.mjs && node scripts/test-game-progress.mjs && node scripts/test-game-vanmenh.mjs && node scripts/test-game-cosmetics.mjs && no… |
| `npm run test:npcai` | node scripts/test-crisis.mjs && node scripts/test-persona-schema.mjs && node scripts/test-bark-pool.mjs && node scripts/test-story-gen.mjs && node scripts/test-map-rating.mjs && node scripts/test-game-ai-persona.mjs && node scripts/test-game-ai-model.mjs |
| `npm run docs:check` | node scripts/docs-game-lint.mjs |
| `npm run test:mmo` | node scripts/test-quan-protocol.mjs && node scripts/test-quan-mmo.mjs |
| `npm run dev:mmo` | node scripts/dev-mmo.mjs |
| `npm run accuracy` | node scripts/classical-accuracy.mjs |
| `npm run deploy` | rm -rf dist && node scripts/build-seo-pages.mjs && vite build && npx wrangler deploy |
| `npm run deploy:worker` | npx wrangler deploy |
| `npm run build:corpus` | node scripts/build-corpus.mjs |
| `npm run build:ios` | node scripts/build-corpus.mjs && node scripts/ios-clean-outdir.mjs && vite build --mode ios && node scripts/ios-postbuild.mjs |
| `npm run verify:ios` | node scripts/verify-ios-build.mjs |
| `npm run verify:ios-path` | node scripts/verify-ios-review-path.mjs |
| `npm run cap:ios` | npm run build:ios && npx cap sync ios |
| `npm run preview:ios` | vite preview --outDir dist-ios --host 127.0.0.1 --port 5174 |
| `npm run build:edu` | node scripts/build-seo-pages.mjs && vite build --mode edu |

