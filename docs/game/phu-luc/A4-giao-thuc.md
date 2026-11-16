<!-- TỆP SINH TỰ ĐỘNG bởi scripts/docs-game-gen.mjs — KHÔNG SỬA TAY. Sinh lại: node scripts/docs-game-gen.mjs -->
# A4 · Giao thức mạng, route HTTP, hạ tầng máy chủ

> Sinh từ mã nguồn. Khi một con số ở chương khác lệch với tệp này thì **tệp này (tức là mã đang chạy) thắng** và chương kia phải sửa.

## A4.1 Gói WebSocket

**Client → máy chủ** (29 loại, lấy từ các nhánh `case` của `worker/quan-room.js`)

`cos` · `cung` · `ec` · `emo` · `est_claim` · `est_get` · `est_like` · `est_list` · `est_release` · `est_save` · `inc` · `job_apply` · `job_board` · `job_claim` · `job_end` · `job_log` · `job_me` · `job_ores` · `job_quit` · `job_renew` · `job_start` · `job_task` · `mv` · `raze` · `report` · `say` · `sit` · `stand` · `tp`

**Máy chủ → client** (21 loại, lấy từ mọi `t: '…'` trong `worker/` và các lõi dùng chung)

`cos` · `count` · `cung` · `cung_ok` · `ec_res` · `emo` · `err` · `est_res` · `est_up` · `full` · `inc` · `job_res` · `join` · `leave` · `mv` · `razed` · `reported` · `say` · `seat` · `seats` · `welcome`

**Thao tác kinh tế** — gói `ec {op, a}`, tên thao tác phải khớp `protocol.EC_OP` (54 thao tác)

| nhóm | thao tác |
|---|---|
| ví và kho | me, deposit, withdraw, set_tc, cellar_in, cellar_out, ice, drop |
| Thương hội `th_` | th_board, th_buy, th_sell |
| chợ ký gửi `mk_` | mk_board, mk_post, mk_cancel, mk_buy |
| sản xuất | plot_rent, plot_extend, plant, water, fert, harvest, butcher, mill, compost, fish |
| bếp | cook, eat, chef_greet, chef_join |
| mặt bằng `vn_` | vn_list, vn_rent, vn_fund, vn_take, vn_stock, vn_unstock, vn_menu, vn_open, vn_close, vn_buy |
| hộ tịch `cv_` | cv_propose, cv_answer, cv_view, cv_fund, cv_take, cv_divorce, cv_agree, cv_withdraw |
| thầy mệnh lý `dv_` | dv_exam, dv_register, dv_list, dv_book, dv_mine, dv_deliver, dv_rate |

## A4.2 Hằng số giao thức

| hằng số | giá trị |
|---|---|
| `AOI_FAR_MS` | 2000 |
| `AOI_TILES` | 375 |
| `BURNER_CAP` | [15,6,6,6,6,6,6,6,6] |
| `CLOSE_BAD` | 4003 |
| `CLOSE_FULL` | 4001 |
| `CLOSE_SPAM` | 4002 |
| `COOP_MAX` | 4 |
| `EC_MAX` | 16000 |
| `EC_OP` | /^(me¦deposit¦withdraw¦set_tc¦cellar_in¦cellar_out¦ice¦drop¦th_board¦th_buy¦th_sell¦mk_board¦mk_post¦mk_cancel¦mk_buy¦plot_rent¦plot_extend¦plant¦water¦fert¦harvest¦butcher¦mill¦compost¦fish¦cook¦eat¦… |
| `EST_SAVE_MAX` | 12600 |
| `GRID` | {"cols":20,"rows":14} |
| `INCENSE_MS` | 180000 |
| `JOB_IDS` | ["bep","phu","boc","mo","gom","den","huong","tra","cantra","may","vuon","moc","chep","ren","moigioi","phongthuy","kephat","lodan","phaohoa","laido","nguphu","buonmuoi","hamruou","tieuphu","kimhoan","t… |
| `MAX_ROOMS` | 50 |
| `MOVE_HZ` | 8 |
| `MSG_PER_SEC` | 20 |
| `MV_JUMP_TILES` | 25 |
| `RAZE_COOLDOWN_MS` | 4000 |
| `RAZE_ID` | /^s-?\d{1,4}:-?\d{1,4}$/ |
| `RAZE_KEEP` | 400 |
| `RAZE_OUTSIDE` | 20 |
| `RAZE_REACH_TILES` | 12 |
| `REPORT_REASONS` | {"name":"Tên không phù hợp","spam":"Làm phiền / spam","other":"Lý do khác"} |
| `RESPAWN_MS` | 1200000 |
| `ROBES` | ["木","火","土","金","水"] |
| `ROOM_CAP` | 60 |
| `STEPS` | ["pillars","wx","strength","yong","timing","advice"] |
| `VERSION` | 1 |

**`EMOTES`** (6)

| khoá | icon | text |
|---|---|---|
| bow | 🙇 | cúi chào |
| palm | 🙏 | chắp tay |
| clap | 👏 | vỗ tay |
| tea | 🍵 | mời trà |
| wave | 👋 | vẫy tay |
| think | 🤔 | suy ngẫm |

**`PHAI`** (4)

| khoá | giá trị |
|---|---|
| tubinh | Tử Bình |
| manh | Manh Phái |
| trichthien | Trích Thiên |
| cungthong | Cùng Thông |

**`PHRASES`** (8)

| khoá | giá trị |
|---|---|
| hi | Chào bạn! |
| join | Cùng giải án nhé? |
| thanks | Cảm ơn nhiều. |
| nice | Hay quá! |
| tea | Mời bạn chén trà. |
| learn | Mình đang học Tử Bình. |
| wait | Chờ mình chút. |
| bye | Hẹn gặp lại. |

**`SEATS`** (3)

| x | y |
|---|---|
| -16.5 | 22.71875 |
| -15 | 22.71875 |
| -13.5 | 22.71875 |

**`WORLD_TILES`** (4)

| khoá | giá trị |
|---|---|
| minX | -2550 |
| maxX | 4202 |
| minY | -2553 |
| maxY | 2567 |


## A4.3 Hằng số tài khoản

| hằng số | giá trị |
|---|---|
| `OTP_LIMITS` | {"key":[[3,900000],[10,86400000]],"ip":[[20,3600000]]} |
| `OTP_TRIES` | 5 |
| `OTP_TTL_MS` | 600000 |
| `SAVE_CHUNK` | 100000 |
| `SAVE_MAX` | 900000 |
| `SESSION_DAYS` | 30 |
| `WS_TOKEN_MS` | 60000 |


## A4.4 Route HTTP

| route | xuất hiện trong |
|---|---|
| `/admin` | `worker/admin.js` |
| `/api/` | `worker/admin.js` |
| `/api/ai` | `worker/admin.js` |
| `/api/ai-config` | `worker/admin.js` |
| `/api/event` | `worker/admin.js` |
| `/api/feedback` | `worker/admin.js` |
| `/api/inbox` | `worker/admin.js` |
| `/api/log-error` | `worker/admin.js` |
| `/api/stats` | `worker/admin.js` |
| `/api/auth/claim-guest` | `worker/auth.js` |
| `/api/auth/config` | `worker/auth.js` |
| `/api/auth/delete` | `worker/auth.js` |
| `/api/auth/export` | `worker/auth.js` |
| `/api/auth/google/callback` | `worker/auth.js` |
| `/api/auth/google/start` | `worker/auth.js` |
| `/api/auth/logout` | `worker/auth.js` |
| `/api/auth/me` | `worker/auth.js` |
| `/api/auth/otp/send` | `worker/auth.js` |
| `/api/auth/otp/verify` | `worker/auth.js` |
| `/api/auth/ws-token` | `worker/auth.js` |
| `/api/save` | `worker/auth.js` |
| `/admin` | `worker/index.js` |
| `/admin/` | `worker/index.js` |
| `/api/` | `worker/index.js` |
| `/api/auth/` | `worker/index.js` |
| `/api/npc/chat` | `worker/index.js` |
| `/api/save` | `worker/index.js` |
| `/ws/quan` | `worker/index.js` |
| `/zai` | `worker/index.js` |

## A4.5 Durable Object và migration (`wrangler.jsonc`)

| binding | lớp |
|---|---|
| QUAN | TownShard |
| ESTATE | Estate |
| ACCOUNTS | Accounts |
| GUILD | Guild |
| ECONOMY | Economy |

| thẻ migration | lớp |
|---|---|
| quan-v1 | TownShard |
| estate-v1 | Estate |
| accounts-v1 | Accounts |
| guild-v1 | Guild |
| economy-v1 | Economy |

