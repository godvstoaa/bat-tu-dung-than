# 13.01 · Kiến trúc hiện tại (as-is)

> Phần này mô tả **đúng những gì code đang làm** ở thời điểm 2026-11-05 (nhánh `main`, kể cả các thay đổi chưa commit trong cây làm việc). Mọi con số đo lại bằng lệnh ghi kèm. Chỗ nào là suy luận thì ghi «(suy luận)». Các phần sau (02–11) dựa vào bản đồ này để đặc tả kiến trúc đích; phần 12–14 biến các điểm nợ ở §15 thành TASK.

## 1. Nguồn đo và cách tái lập

| Số liệu | Giá trị | Lệnh / nguồn |
|---|---|---|
| Số module `src/game/*.js` | 44 tệp, 11.964 dòng (tính cả `worker/*.js`) | `wc -l src/game/*.js worker/*.js` |
| Số module engine | 249 tệp, 11 MB mã nguồn | `ls src/engine \| wc -l`, `du -sh src/engine` |
| `analyze()` (Node, lá số mặc định của `perf-timing.mjs`) | 1,56 ms trung bình khi đã «ấm»; lần gọi đầu 16,5 ms | `node perf-timing.mjs`; đo tay lần đầu với `MAU-A` |
| `buildChartBrief()` | 190 ms, chuỗi 92.527 ký tự | `node perf-timing.mjs` |
| Kết quả `analyze()` tuần tự hóa | ≈ 30 KB JSON | `JSON.stringify(R).length` với `MAU-A` |
| Các engine phụ cho Mệnh Bàn | `fiveDimRadar` 0,17 ms · `classifyChartLevel` 0,23 ms · `analyzeVitality` 0,30 ms · `computeLiuDao` 0,39 ms · `analyzeNobleStars` 0,26 ms · `gaimenhPlan` 0,69 ms | đo bằng `performance.now()` trong Node với `MAU-A` |
| Tài sản 3D | `public/models` 168 MB (94 tệp, có trong git); 23 tệp `.hd.glb` = 105 MB; các tệp `.lod.glb` = 6,1 MB | `du -sh`, `git ls-files public/models \| wc -l` |
| Bản build web gần nhất trong máy | `dist/` 242 MB; chunk `render3d` 792 KB (gồm Three.js); chunk `game` 126 KB; chunk `engine-daozang` 6,09 MB | `ls -la dist/assets` |
| Bản build iOS gần nhất trong máy | `dist-ios/` 86 MB, trong đó `models/` 63 MB (đã bỏ `.hd.glb`) | `du -sh dist-ios dist-ios/models` |
| Hiệu năng Sơn Môn | 1.116 → **186** lượt vẽ, 3 → **45** khung/giây trong khung xem trước | nhật ký `docs/GAME-V2-THIET-KE.md` (2026-11-04) |
| Kiểm thử | `npm run test:game` 7 bộ đều đạt; `test-quan-protocol` 7/7; `test-terrain` 7/7; `test-game-cases` 10/10 | chạy ngày 2026-11-05 |

**Lưu ý về số đo khung hình:** 45 khung/giây đo trong khung xem trước của ứng dụng (Browser pane). Khung đó có thể bị trình duyệt hạ nhịp khi không ở tiền cảnh, nên con số chỉ dùng để so sánh tương đối trước/sau. Phần 09 quy định cách đo chuẩn.

## 2. Điểm vào và vòng đời

```
Web:  game.html ──▶ mount.js › mountGame(host)                     (không có onExit)
iOS:  src/ios/shell.js ──▶ import('../game/mount.js') › mountGame(overlay, { onExit })
                         mount.js: chèn markup.js › gameMarkup(), gọi main.js › startGame(opts)
                         gọi lần 2 trên cùng host → instance.resume() (không dựng lại)
```

- `vite.config.js` dựng hai đầu vào cho web (`index.html`, `game.html`). Bản iOS (`--mode ios`) **không** có `game.html`; game vào được qua lớp phủ do `src/ios/shell.js` nạp lười.
- `startGame()` trả `{ pause, resume, exit }`. `pause()` hủy `requestAnimationFrame`, tắt âm, mở khóa xoay màn hình, ngắt mạng (`net.stop()`).
- Sự kiện `visibilitychange`: tab ẩn thì ngừng vòng lặp; hiện lại thì `refreshDay()` rồi chạy tiếp.
- `window.__hq` mở cho kiểm thử tự động: `{ state, player, stick, altCtl, net, openStation, walkTo, STATIONS, blockedAt, findPath, renderer }`. Đây là bề mặt Playwright duy nhất của game.

### 2.1 Cổng nhập môn (luồng hiện có)

1. `showGate()`: có `state.player.birth` thì hiện «Bước qua cổng»; chưa có thì hiện form bát tự.
2. Form: tên (mặc định `names.js › randomName`), giới tính, ngày, giờ, cờ «không rõ giờ» (lấy 12:00).
3. `stations.js › chartOf()` gọi `analyze(year, month, day, hour, minute, gender, năm hiện tại)`, có bộ nhớ đệm `Map` theo khóa ngày giờ.
4. `ceremony(R)`: lật bốn trụ, thanh ngũ hành `R.wx.pct`, Dụng/Hỷ/Kỵ.
5. Bấm «Mặc phẩm phục»:
   - ghi `state.player = { name, look, birth, yong: { primary, accent, ji }, robe, accent, createdAt }`;
   - thêm hồ sơ «Bản thân» vào `state.profiles` nếu chưa có;
   - `enter()`: dựng cảnh (lần đầu), `net.start()`, bật âm thanh nếu cài đặt cho phép.

`R` **không được lưu**; mỗi lần cần thì tính lại qua `chartOf()`. Đây là điểm tốt cho bảo mật (ngày sinh chỉ ở `state.player.birth` trong `localStorage`) và là ràng buộc cho Mệnh Bàn (phần 02).

## 3. Bản đồ module `src/game/`

Cột «Thuần?» = không đụng DOM/WebGL, chạy được bằng Node (điều kiện để có test đơn vị).

| Module | Dòng | Trách nhiệm | Phụ thuộc chính | Thuần? | Test |
|---|---|---|---|---|---|
| `mount.js` | 17 | Điểm gắn duy nhất cho mọi nền tảng; chống dựng hai lần | `markup`, `main`, `game.css` | không | — |
| `markup.js` | 62 | Khung HTML (HUD, cổng, bảng, joystick) | — | không | — |
| `main.js` | 795 | Lõi: cổng nhập môn, vòng lặp, điều khiển (phím, joystick, chạm), HUD, bảng, giao lưu, ngự kiếm, `api` cho các gian | hầu hết module | không | Playwright qua `__hq` |
| `state.js` | 349 | Trạng thái người chơi (`localStorage` khóa `huyenquan:v1`), Phúc Khí, nhiệm vụ ngày, thành tựu, chuỗi ngày, án, đèn Thái Tuế | `features` | có | `test-game-state`, `test-game-cases` |
| `features.js` | 36 | Cờ theo bản build: `IOS`, `FEATURES.{stations, divination, wishes, ai}`, `TEXT`, `hasStation()` | `import.meta.env` | có | gián tiếp |
| `progress.js` | 55 | Cấp theo `xp` (`20·(L−1)²`), gia trì nguyên tố 5 bậc, VIP | — | có | `test-game-progress` |
| `cosmetics.js` | 229 | Tàng Y Các: 8 ô, 5 bậc hiếm, 51 món, 5 bộ ngũ hành, Hợp mệnh +10%, điểm danh, Ngọc, mã hóa trang bị cho MMO | — | có | `test-game-cosmetics` |
| `wardrobe-ui.js` | 128 | Bảng cửa hàng + tủ đồ | `cosmetics`, engine `constants` | không | — |
| `accessories.js` | 305 | Phụ kiện 3D thủ công (mũ, lưng, cầm tay, ngự vật) bám theo vị trí xương | THREE | không | — |
| `effects.js` | 186 | Gia trì nguyên tố: hào quang, linh khí, vệt bước, ngự vật | THREE | không | — |
| `characters.js` | 190 | Nhân vật Meshy có xương: nhân bản skinned, đổi màu áo/đai bằng shader HSV, động tác, tư thế xếp bằng dựng bằng xương | `assets` | không | — |
| `models.js` | 782 | Mô hình thủ tục (mái cong, cột, đèn lồng, bàn thầy, avatar dự phòng…), `mergeStatic`, `ownMaterials`, chuyển tọa độ ô ↔ mét | THREE | không | — |
| `textures.js` | 288 | Texture canvas phong cách sơn mài, `rng` có hạt giống | THREE | không | — |
| `assets.js` | 175 | Nạp GLB (GLTFLoader + Meshopt), bộ đệm, `placeModel`, LOD 3 bản, `instanceModel`, `instanceModelLod` | THREE | không | — |
| `terrain.js` | 155 | Địa hình 2048 m thuần JS: `heightAt`, `slopeAt`, `walkable`, `REGIONS` (8 vùng), sông, `treeDensity`, `CLEARINGS` | — | có | `test-terrain` (chưa gắn npm script) |
| `world3d.js` | 322 | Dựng thế giới mở: chunk 128 m + LOD + skirt, trời tán xạ + PMREM, nước, mây, rừng 2 tầng, `groundY`, che cây | THREE, `terrain`, `obstacles`, `court` | không | — |
| `landmarks.js` | 366 | Quần thể kiến trúc theo vùng (`SPOTS`), nền bậc cấp, đường đá tới sảnh nghề, nạp lười ≤ 900 m | `assets`, `collide`, `obstacles`, `lights` | không | — |
| `court.js` | 134 | Bố cục Sơn Môn (một nguồn cho vị trí gian, nền bậc, vật cản, chỗ ngồi, điểm xuất phát) | — | có | `test-game-state` |
| `sect.js` | 247 | Dựng 3D Sơn Môn theo `court.js`: sân, tường, cổng, nền đá hai tầng, Chính Đường, điện phụ, lầu, tháp, đèn | `models`, `assets`, `collide`, `lights` | không | — |
| `world.js` | 229 | Danh sách gian (`STATIONS`), sảnh nghề (`HALLS`), điện vào được (`ROOMS`), `blockedAt`, A* `findPath`, `nearestStation` | `terrain`, `obstacles`, `court`, `features` | có | `test-game-state` |
| `obstacles.js` | 51 | Lưới ô đặc 0,5 m, vòng tròn chặn, nền bậc (`addPlatform`, `platformTop`), thân người 5 điểm | — | có | `test-game-state` |
| `collide.js` | 99 | Va chạm theo hình khối: cắt lát tam giác ở dải 0,4–2,0 m trên chân, raster vào lưới | THREE, `obstacles` | không (cần THREE) | gián tiếp |
| `lights.js` | 32 | Sổ đăng ký đèn thế giới (`LIGHTS`) và vật liệu phát sáng (`GLOW_MATS`) | — | có | — |
| `interior.js` | 287 | Dựng nội thất 6 điện «phòng ngoài bản đồ»: sàn, tường, cột, bàn thờ, tượng GLB, đèn, Vận Mệnh Các, Thái Tuế Điện | `world`, `assets`, `obstacles`, `lights`, engine `taisui-general` | không | — |
| `render3d.js` | 935 | Cảnh 3D: renderer, camera thứ ba, ánh sáng theo giờ thật, hạt, nhãn HTML, raycast chọn điểm, người chơi khác, nhóm đèn điểm, làm mờ công trình che, tự hạ chất lượng | gần như mọi module 3D | không | — |
| `render.js` | 317 | Renderer 2D dự phòng (canvas pixel, sân cũ 20 × 14 ô), `ROBE`, `nightLevel` | — | không | — |
| `stations.js` | 730 | Nội dung từng gian (DOM) + gọi engine (`analyze`, `zhai`, `daily`, `qiuqian`), `chartOf`, Sổ Mệnh | engine | không | gián tiếp |
| `cases.js` | 230 | Giải án 6 bước, 38 Án Cổ; đáp án do engine tính | engine `chart`, `kb`, `classical-cases` | có | `test-game-cases` (chưa gắn npm script) |
| `case-ui.js` | 513 | Giao diện giải án, sảnh nghề, nạp lười | `cases`, `halls`, `dz-case`, `zheri-case` | không | — |
| `halls.js` | 258 | Án sảnh nghề dạng khai báo (Điều Hậu, Thư Viện, Hợp Hôn, Tử Vi, Tượng Pháp, Cách Cục) | engine `han-nuan`, `hehun`, `ziwei`, `mangpai`, `kb` | có | `test-game-halls` |
| `dz-case.js` | 120 | Án Dương Trạch 4 bước | engine `zhai`, `fengshui-compass`, `xuankong` | có | `test-game-dz` |
| `zheri-case.js` | 133 | Án Trạch Nhật 3 bước | engine `zheri` | có | `test-game-zheri` |
| `npc.js` | 60 | Sinh khách NPC theo hạt giống (ngày · khe · người chơi) | — | có | gián tiếp |
| `master-ui.js` | 102 | Thầy AI: khung hỏi đáp stream, nạp lười `ai.js` + `neo-checker.js` | engine `ai`, `neo-checker` | không | — |
| `que-ui.js` | 176 | Thầy Giải Quẻ 5 phép (web) | engine `meihua`, `liuyao`, `xiaoliuren`, `jinkoujue`, `qiuqian` | không | — |
| `vanmenh.js` | 49 | Vận Mệnh Các: 9 cổng đại vận | engine `life-trajectory`, `dayun-changsheng`, `phase-narrative` | có | `test-game-vanmenh` |
| `thaitue.js` | 41 | Thái Tuế năm nay + tuổi phạm | engine `taisui-general`, `taisui` | có | `test-game-vanmenh` |
| `vanmenh-ui.js` | 124 | Bảng Vận Mệnh Các, Thái Tuế Điện; `roomData()` cho cảnh 3D | `vanmenh`, `thaitue` | không | — |
| `net.js` | 185 | Client MMO offline-first: kết nối lại lũy thừa, chuyển phòng khi đầy, gửi vị trí ≤ 8 Hz, nội suy | `protocol` | không | `test-quan-mmo` (gián tiếp) |
| `protocol.js` | 148 | Giao thức dùng chung client/máy chủ: hằng số, `parseClient`, `cleanName`, `rateGate`, `approach` | `cosmetics` | có | `test-quan-protocol` |
| `audio.js` | 79 | Âm tổng hợp WebAudio, mặc định tắt | — | không | — |
| `haptics.js` | 29 | Rung (Capacitor Haptics hoặc `navigator.vibrate`), khóa màn dọc | Capacitor (nạp động) | không | — |
| `names.js` | 25 | Tên ngẫu nhiên, câu tĩnh tâm | — | có | — |

Máy chủ:

| Tệp | Dòng | Trách nhiệm |
|---|---|---|
| `worker/index.js` | 216 | Worker Cloudflare: chặn IP, định tuyến `/ws/quan` tới Durable Object, chặn scraper, giới hạn tốc độ toàn cục, `/api/*` → `admin.js`, proxy LLM (`/zai`, `/groq`, `/nvidia`, `/openai`, `/deepseek`, `/bigmodel`), phục vụ tĩnh + header bảo mật + cache |
| `worker/quan-room.js` | 142 | `TownShard` (Durable Object, WebSocket Hibernation): một phòng ≤ 60 người |
| `worker/admin.js` | 1.833 | Bảng quản trị, ghi sự kiện, phản hồi, cấu hình AI (KV `ADMIN_KV`) — của app chính, game chưa dùng |
| `wrangler.jsonc` | — | Worker `battu`, assets `./dist`, KV `ADMIN_KV`, DO `QUAN` → `TownShard` (migration `quan-v1`, SQLite) |

## 4. Luồng dữ liệu trong một khung hình

```
requestAnimationFrame(loop)
 ├─ dt = min(0,05 s, Δt)
 ├─ step(dt)                         main.js — đọc phím / joystick / đường A*, blockedAt, trượt dọc vật cản
 ├─ net.tick(dt, self)               gửi `mv` nếu đổi > 0,02 ô, ≤ 8 Hz; nội suy người khác (approach)
 ├─ nearestStation(player, 1,5 ô)    → updatePrompt (nút «E · …»)
 ├─ mỗi 60 s: refreshDay()           todayInfo (can chi ngày, âm lịch), rollDay(state)
 └─ renderer.frame(S, dt)            render3d.js
     ├─ applyTime(now)               nội suy 8 mốc màu theo giờ thật; đêm dùng vòm gradient + trăng sao
     ├─ cập nhật nhân vật, gia trì, phụ kiện, chén trà
     ├─ world.update(px, pz)         chunk địa hình (hàng đợi ≤ 6 ms/khung), cây gần/xa, nước, mây
     ├─ lightRoom = roomAt(...)      lọc đèn theo điện; updateLightPool mỗi 0,3 s
     ├─ interiors.update(dt)
     ├─ landmarks.update(px, pz)     mỗi 1,5 s: LOD nhân bản + nạp quần thể trong 900 m
     ├─ camera thứ ba (giảm chấn, không chui đất, kẹp trong điện)
     ├─ world.occlusion(...)         cây chắn camera thu về 0
     ├─ làm mờ fadeGroups chắn đầu người chơi (opacity 0,22)
     ├─ cảnh: nhang, khói, hồ sen, lịch, cây đào, Thiên Bàn, đèn trời (InstancedMesh 40), hạt
     ├─ khách NPC (3), người chơi khác
     ├─ composer.render() hoặc renderer.render()
     ├─ nhãn HTML (chiếu 3D → 2D, ẩn khi > 220 m)
     └─ đo FPS mỗi 3 s: < 35 → lowQuality (tắt bóng, pixelRatio 1, bỏ hạt)
```

Cấu trúc `S` truyền vào `frame()` gồm: `time, player, state, now, near, target, reduced, night, dayGanZhi, lunarText, todayLanterns, lanterns, peachBloom, crane, teaColor, others, selfBubble, masterBubble, selfEmote, giatri, cos, cases`. Renderer 2D dùng cùng giao diện `{ resize, frame, yaw, rotate, celebrate, mode }`.

## 5. Hệ tọa độ

| Hệ | Đơn vị | Gốc | Dùng ở |
|---|---|---|---|
| Mét thế giới (x, y, z) | m | tâm Huyền Thành = tâm sân Sơn Môn (0, 0, 0); Bắc = −Z | dựng 3D, địa hình, va chạm, vùng |
| Ô người chơi (x, y) | 1 ô = 1,6 m | ô (10, 7) ↔ mét (0, 0) | vị trí `player`, gói MMO `mv`, A*, `STATIONS.spot` |
| Ô va chạm | 0,5 m | (0, 0) | `obstacles.js` (khóa `(i + 40000)·80000 + (j + 40000)`) |
| Ô A* | 0,5 ô = 0,8 m | khung bao hai điểm + lề 40 ô | `world.js › findPath` |

Chuyển đổi: `toTile(X, Z) = { x: X/1,6 + 10, y: Z/1,6 + 7 }`, `toWorld(x, y) = { x: (x − 10)·1,6, z: (y − 7)·1,6 }` (có ở `court.js`, `models.js`, `world.js`; ba bản sao cùng công thức).

**Biên bản đồ:** `terrain.WORLD = 2048` (±1.024 m), rìa đổ xuống biển mây từ bán kính `EDGE = 960`. `protocol.WORLD_TILES = { minX: −630, maxX: 1210, minY: −633, maxY: 647 }`: phía Đông kéo dài tới 1.200 ô (≈ 1.920 m) để chứa **các điện «ngoài bản đồ»** đặt ở x = 1.500–2.000 m (`world.js › ROOMS`).

> **Xung đột với bản đồ mở rộng của canon:** Long Hổ Sơn có tâm (1.500, −200). Chính Điện Tam Thanh hiện đặt tại origin (1.500, 0), Văn Xương Các (1.600, 0) … Thái Tuế Điện (2.000, 0). Khi mở rộng thế giới tới ±2.000 m, các phòng này nằm **ngay trong** Long Hổ Sơn. Phần 06 và 07 dời chúng sang dải túi ngoài biên (TASK-071).

## 6. Đường ống dựng hình (rendering)

### 6.1 Khởi tạo renderer

- `WebGLRenderer({ antialias: !coarse, powerPreference: 'high-performance' })`, `SRGBColorSpace`, `ACESFilmicToneMapping` (exposure 0,82–1,20 theo đêm), `PCFSoftShadowMap`.
- Một đèn hướng (mặt trời / trăng) đổ bóng, khung bóng 90 × 90 m bám người chơi; kích thước bản đồ bóng theo `QUALITY[q].shadow` (1.024 / 1.536 / 2.048).
- `HemisphereLight` bổ sung; môi trường PMREM từ `Sky` tán xạ, **dựng lại khi hướng mặt trời đổi > 0,08** (`world3d.js › setSun`).
- Camera phối cảnh FOV 45° (màn dọc 64°), near 0,3, far 9.000; sương `Fog(260, 1.900)`.
- Mức chất lượng `pickQuality()`: đọc `localStorage['huyenquan:quality']` (`low|mid|high`), mặc định `mid` trên màn cảm ứng, `high` trên máy để bàn.

| Tham số (`world3d.js › QUALITY`) | low | mid | high |
|---|---|---|---|
| Vòng chunk chi tiết cao `near` | 1 | 1 | 2 |
| Vòng chunk vừa `mid` | 2 | 3 | 4 |
| Số đoạn lưới chunk gần / vừa / xa | 32 / 16 / 6 | 48 / 24 / 8 | 64 / 32 / 8 |
| Số cây 3D gần tối đa | 160 | 240 | 320 |
| Bloom | tắt | bật | bật |
| Bản đồ bóng | 1.024 | 1.536 | 2.048 |
| Nhóm đèn điểm (`render3d.js › POOL_N`) | 6 | 10 | 16 |
| Bản model kiến trúc trùm | thường | thường | `.hd` |

### 6.2 Địa hình

- 16 × 16 chunk, mỗi chunk 128 m. Lúc khởi động dựng **toàn bộ 256 chunk ở mức xa** (6–8 đoạn), sau đó nâng dần quanh người chơi.
- `updateChunks`: khi đổi chunk đang đứng, tính lại mức mong muốn cho mọi chunk theo khoảng cách Chebyshev, xếp hàng đợi theo khoảng cách.
- `buildSome(6 ms)`: mỗi khung chỉ dựng tối đa 6 ms trên luồng chính.
- Lưới chunk lấy mẫu thêm một vòng viền để pháp tuyến ở mép trùng chunk bên cạnh; **skirt** thả 10 m che kẽ nứt giữa hai mức LOD.
- Màu đỉnh theo độ cao/độ dốc (cát, cỏ, cỏ khô, đá, tuyết, lát đá quanh Huyền Thành); texture chi tiết canvas 256² lặp theo tọa độ thế giới (`onBeforeCompile`).
- Sân Sơn Môn hạ địa hình 8 cm (`inCourt`) để không chập mặt sân.
- Mỗi chunk là một `Mesh` riêng → 256 đối tượng có thể vẽ; frustum culling của Three.js loại phần ngoài khung nhìn (suy luận: phần lớn lượt vẽ địa hình đến từ các chunk trong tầm nhìn xa, chưa đo riêng).

### 6.3 Rừng, nước, mây

- Vị trí cây sinh một lần theo lưới 11 m + `treeDensity` (2 loài: thông, cây lá).
- **Hai tầng:** tầng xa là `InstancedMesh` thẻ chéo (2 mặt phẳng, texture canvas, `alphaTest 0,5`) chứa **mọi** cây; tầng gần là `InstancedMesh` khối thấp đa giác, tối đa `treesNear` cây trong bán kính 170 m. Cây gần bị ẩn ở tầng xa bằng ma trận co 0.
- Cập nhật tầng gần khi người chơi đi quá 30 m. `frustumCulled = false` cho cả hai tầng (vẽ luôn).
- `occlusion()`: cây gần nằm trên đoạn camera–người chơi (khoảng cách < 5,5 × tỉ lệ) co về 0.
- Nước: một mặt phẳng lớn ở `WATER = −6 m`, normal map canvas trôi; mây: 70 mặt phẳng quanh rìa.

### 6.4 Kiến trúc theo vùng (`landmarks.js`)

- `SPOTS`: danh sách quần thể (Huyền Thành, Tử Bình Phong, Manh Phái Cốc, Trích Thiên Đỉnh, Cùng Thông Hồ, Thư Lâu Lâm, Phong Thủy Viên, Lịch Đường, Thiên Bàn Đảo, cổng/cầu/đèn dọc đường…).
- `update()` mỗi 1,5 s: (1) gọi các hàm LOD của nhà nhân bản; (2) quần thể nào trong **900 m** mà chưa dựng thì dựng.
- **Không bao giờ dỡ**: tập `done` chỉ thêm. Người chơi đi khắp bản đồ sẽ giữ toàn bộ kiến trúc trong bộ nhớ.
- `place()`: thử danh sách mô hình theo thứ tự ưu tiên (công trình trùm → bản thường), đặt, rồi `addFootprint` để va chạm (cổng thì khoét lối giữa bằng `keep`).
- `terrace()`: nền đá bậc cấp thủ tục, chôn đáy xuống điểm thấp nhất của địa hình dưới nền, đăng ký `addPlatform` cho từng tầng.
- Đường đá tới 7 sảnh nghề ngoài Huyền Thành: `roadPath()` (vòng cung quanh thành bán kính 205 m rồi uốn theo noise, dừng ở dốc > 0,78) + `roadMesh()`.

### 6.5 Tài sản GLB và LOD (`assets.js`)

| Hàm | Hành vi |
|---|---|
| `loadModel(id)` | Tải `models/<id>.glb` một lần (GLTFLoader + `MeshoptDecoder`), bật bóng, anisotropy 4; lỗi → `null` (game dùng mô hình thủ tục thay thế) |
| `placeModel(parent, id, { fit, at })` | Nhân bản, co giãn theo một trục đích (`height`, `width`, `depth`, `max`), đặt đáy tại `at.y` |
| `placeLod` (nội bộ) | Với id có 3 bản (`HD_IDS` hoặc `lib_*`): gần dùng `.hd` (chỉ khi chất lượng `high`) hoặc bản thường; xa dùng `.lod` ở ngưỡng `max(kích thước × 4, 80 m)`; bản xa không đổ bóng |
| `instanceModel(parent, id, items)` | Mỗi mesh con → một `InstancedMesh` (dùng cho nhà, cây, đá lặp lại) |
| `instanceModelLod(parent, id, items, { near: 90 })` | Hai bộ InstancedMesh gần/xa; `update(px, pz)` chia lại theo 90 m, chỉ ghi khi tập gần đổi |

Hệ quả hiện tại: mỗi `placeModel` tạo một bản sao cây đối tượng riêng (không gộp), nên số lượt vẽ tăng theo số mesh con của GLB. Sơn Môn đã giảm từ 1.116 xuống 186 lượt vẽ bằng cách gộp khối thủ công theo vật liệu (`models.js › mergeStatic`) và dùng bản thường cho công trình phụ.

### 6.6 Gộp và làm mờ

- `mergeStatic(group)`: gom mesh tĩnh theo `material.uuid + cờ bóng`, gộp hình học (`mergeGeometries`), giữ `userData`. Bỏ qua mesh có `userData.dynamic` và InstancedMesh; chỉ giữ thuộc tính `position/normal/uv`.
- `ownMaterials(group)`: nhân bản vật liệu (trong suốt) để làm mờ riêng từng công trình.
- `fadeGroups`: mỗi khung, tia camera → đầu người chơi giao với hộp bao công trình nào thì opacity về 0,22 (`depthWrite` tắt khi < 0,95).

### 6.7 Ánh sáng điểm

- `lights.js › LIGHTS` là sổ đăng ký `{ x, y, z, color, power, room }`; mọi đèn lồng, nến, lư hương đều đăng ký ở đây (không tạo `PointLight` thật).
- `render3d.js` giữ **một nhóm cố định `POOL_N` đèn điểm** (6/10/16). Mỗi 0,3 s: lọc đèn cùng `room` với người chơi (`roomAt`), lấy các đèn trong 140 m gần nhất, gán vị trí/màu/cường độ.
- Cường độ: trong điện `power × 14`; ngoài trời `power × (1,2 + 16 × đêm)`.
- `GLOW_MATS`: vật liệu tự phát sáng chỉnh `emissiveIntensity = base + night × đêm` trong `applyTime`.

### 6.8 Nhân vật và người chơi khác

- Nhân vật Meshy: `createCharacter(id, { height, tint })` nhân bản bằng `SkeletonUtils.clone`, đo khung bao theo da (skinning) để co đúng chiều cao, `AnimationMixer` với tên động tác theo thứ tự `CHAR_ANIMS`.
- Đổi màu phẩm phục bằng `onBeforeCompile`: vùng đỏ bão hòa (áo) → HSV của Dụng thần, vùng xanh ngọc (đai) → HSV của Hỷ thần; `customProgramCacheKey` theo bộ màu (mỗi bộ màu là một chương trình shader).
- `frustumCulled = false` cho mọi mesh nhân vật (tránh lỗi khung bao skinned) → nhân vật ngoài khung nhìn vẫn được vẽ.
- Người chơi khác: trước khi GLB nạp xong dùng mẫu avatar thủ tục đã gộp theo (màu áo × đứng/ngồi); nạp xong thay bằng nhân vật Meshy riêng cho từng người. Chỉ cập nhật hoạt cảnh, phụ kiện, hiệu ứng khi camera cách < 60 m; nhãn tên chỉ hiện < 24 m.
- Mỗi người chơi khác có một `createOutfit(scene)` riêng và có thể có một bộ gia trì (`createGiatri`).

### 6.9 Hậu kỳ và tự hạ chất lượng

- Bloom (`UnrealBloomPass` 512², strength 0,28) qua `EffectComposer` khi `QUALITY[q].bloom`.
- Đo FPS trung bình 3 giây; < 35 thì `lowQuality = true` **một chiều** (không bao giờ nâng lại): tắt bóng, `pixelRatio 1`, bỏ khói, hạt, cánh đào; duyệt toàn cảnh đặt `material.needsUpdate` (một khung giật lớn).

### 6.10 Nhãn HTML

- Mỗi gian một `div` trong lớp `.hq-labels`; mỗi khung chiếu tọa độ 3D → màn hình, ghi `style.transform` và `style.opacity`.
- Ẩn khi ngoài khung hoặc > 220 m. Số gian hiện tại ≈ 40 (gồm cửa/lối ra điện, 9 cổng Vận Mệnh, 8 sảnh nghề) → ≈ 40 lần ghi style mỗi khung.

## 7. Va chạm

### 7.1 Lưới (`obstacles.js`)

- `solid: Set` khóa số nguyên cho ô 0,5 m; `addSolidRect`, `clearSolidRect`, `markSolidCell`.
- `circles[]` (vòng chặn thủ công), `rects[]` (nền bậc xoay với `top`).
- `blockedByBuilding(x, z)`: thử 5 điểm thân (tâm và ±0,3 m theo hai trục) với ô đặc + vòng tròn.
- `platformTop(x, z)`: lấy `top` lớn nhất của các nền chứa điểm.

### 7.2 Cắt lát hình khối (`collide.js › addFootprint`)

1. Lấy bản LOD xa nhất nếu đối tượng là `THREE.LOD` (ít tam giác, cùng hình dáng).
2. Với mỗi tam giác: bỏ nếu nằm hẳn ngoài dải `[chân + lo, chân + hi]` (mặc định 0,4–2,0 m).
3. Cắt đa giác bằng hai mặt phẳng ngang (`clipY`), chiếu xuống XZ.
4. Raster: lấy mẫu cạnh mỗi nửa ô (tường mỏng, cột) + tô ô có tâm nằm trong đa giác lồi (mặt).
5. `keep(x, z)` trả `false` để bỏ ô (khoét lối qua cổng); `ground(x, z)` cho InstancedMesh (mỗi bản sao lấy chân tại mặt đất của nó).

### 7.3 Giới hạn hiện tại

| Giới hạn | Hệ quả |
|---|---|
| Lưới **một lớp** (2D) | Không thể có hai tầng nhà: tường tầng 2 sẽ chặn tầng 1 nếu nằm trong dải cắt. Hiện tránh bằng cách chỉ cắt dải thân người quanh chân công trình |
| Không có chủ sở hữu ô | Không dỡ được va chạm của một công trình → không dỡ được kiến trúc khi đi xa |
| Va chạm chỉ có **sau khi GLB tải xong** | Trong vài giây đầu người chơi có thể đi xuyên công trình chưa nạp |
| Node không nạp GLB | Test Node chỉ thấy khối thủ công (`court.js`), không thấy footprint Meshy → Định nghĩa Done §8.5 của bản sơ đồ tổng chưa kiểm tự động được |
| Thân người 5 điểm | Góc chéo hẹp hơn 0,3 m vẫn có thể lách qua (suy luận theo hình học điểm mẫu) |

## 8. Tìm đường (`world.js › findPath`)

```
findPath(from, to)                       tọa độ ô
 ├─ goal = nearestFreePoint(to)          quét vòng 0,5 → 10 ô, 24 hướng
 ├─ clearLine(from, goal)? → [goal]      lấy mẫu mỗi 0,2 ô, có xét độ dốc từ điểm trước
 ├─ |goal − from| > 150 ô? → [goal]      đi thẳng, gặp núi/nước thì dừng (đi xa dùng trạm đi nhanh)
 ├─ A* 8 hướng, ô 0,5 ô (0,8 m), khung bao + lề 40 ô, không cắt góc
 │    heuristic octile, heap nhị phân tự viết, MAX_NODES = 60.000
 │    state[] lười: chỉ gọi blockedAt khi lần đầu chạm ô
 └─ rút gọn: từ mỗi điểm nhảy tới điểm xa nhất còn nhìn thẳng thấy (clearLine)
```

- Khi bước tiếp theo bị chặn: trượt dọc trục x hoặc z; không được thì tính lại đường **một lần**; vẫn kẹt thì dừng.
- `blockedAt(x, y, from)`: ô đặc → chặn; trên nền bậc → đi được; ngoài ra `terrain.walkable` (trong biên, không lội nước sâu, không leo dốc > 42°; xuống dốc không giới hạn).
- Độ phức tạp: O(N log N) với N ≤ 60.000 nút; mỗi nút gọi `blockedAt` tối đa một lần (`heightAt` hai lần khi có điểm trước).

## 9. Trạng thái và lưu trữ

### 9.1 Khóa `localStorage`

| Khóa | Nội dung |
|---|---|
| `huyenquan:v1` | Toàn bộ trạng thái người chơi (JSON, `v: 1`) |
| `huyenquan:v1:corrupt` | Bản hỏng giữ lại khi đọc lỗi |
| `huyenquan:pid` | Mã thiết bị (UUID 36 ký tự) gửi máy chủ MMO trong `hello` |
| `huyenquan:blocked` | Danh sách mã `u` đã ẩn (≤ 200) |
| `huyenquan:quality` | Ghi đè mức chất lượng |
| `huyenquan:server` | Ghi đè địa chỉ máy chủ MMO |
| (app chính) cấu hình AI | `ai.js › getConfig()` đọc khóa cấu hình của app, dùng chung với game |

### 9.2 Khung trạng thái (`state.js › createState`)

`{ v, player, profiles[], phucKhi, daily{date, got, teaMin, sticks, chartIds, cases?, desks?}, incense{litAt}, tea{totalMin}, sticks[], lanterns[], stationsVisited[], incenseDays[], streak{count, lastDate}, achievements{}, flags{}, settings{sound}, mastery{}, classical{}, caseLog[], deskLog{}, xp, vip, thaitue, wardrobe }`

### 9.3 Quy tắc hydrate (rất quan trọng cho mọi tính năng mới)

1. `raw.v !== 1` → coi là hỏng.
2. **Chỉ những khóa có trong `createState()` được chép lại**; khóa lạ bị bỏ khi đọc. Mọi trường mới **phải** thêm vào `createState()` trước, nếu không sẽ mất sau lần tải lại đầu tiên (đã có ghi chú cảnh báo trong code).
3. Thiếu `xp` → quy đổi từ `phucKhi` (người chơi cũ).
4. `profiles`, `sticks` phải là mảng; `phucKhi` phải là số.
5. `daily` được trộn với khung ngày mới; `got` được nhân bản.
6. Lỗi → lưu bản gốc vào `:corrupt`, tạo trạng thái mới (người chơi mất tiến trình nhưng game không sập).

### 9.4 Tiền tệ và tiến trình

- `addPhuc(n)` cộng `phucKhi` và `xp` (chỉ phần dương). Chi tiêu Phúc Khí không giảm `xp` → cấp không tụt.
- `recordCase()`: án NPC tối đa 3/ngày (thưởng ≤ 15 × điểm), Án Cổ thưởng 25 lần đầu đạt ≥ 60%, sảnh nghề 15 × điểm một lần/ngày/sảnh. Hợp mệnh nhân `(1 + 0,1)`.
- Ngọc, VIP, đồ đã mua, điểm danh: **chỉ ở client** (`state.wardrobe`, `state.vip`). Người dùng sửa được bằng công cụ trình duyệt. Chấp nhận được khi chưa có thanh toán; **không** chấp nhận được khi bán thật (phần 08).

## 10. MMO

### 10.1 Giao thức (`protocol.js`, `VERSION = 1`)

| Hằng số | Giá trị |
|---|---|
| `ROOM_CAP` | 60 người / phòng |
| `MAX_ROOMS` | 50 phòng (`town-0` … `town-49`) |
| `MOVE_HZ` | 8 |
| `MSG_PER_SEC` | 20 (vượt → đóng 4002) |
| Mã đóng | 4001 đầy, 4002 spam, 4003 sai |
| `SEATS` | 3 bồ đoàn Trà Thất (tọa độ ô, khớp `court.js › TEA_SEATS`) |

Client → máy chủ đã xử lý: `hello, mv, cos, emo, say, sit, stand, report`. Khai báo trong `parseClient` nhưng **máy chủ chưa xử lý** (rơi vào `default`): `solve, lb, inv, inv_ok, inv_no, coop_start, coop_leave, coop_ans` (kế hoạch P3).

`parseClient` kiểm: độ dài ≤ 1.024 ký tự, JSON hợp lệ, `mv` trong `WORLD_TILES`, độ cao bay 0–420 m, `emo`/`say` chỉ nhận khóa soạn sẵn (không chat tự do), tên qua `cleanName` (bỏ ký tự điều khiển/zero-width, chặn từ thô tục, ≤ 24 ký tự), trang bị qua `cleanCos`.

### 10.2 Client (`net.js`)

- Địa chỉ: `?server=` → `localStorage['huyenquan:server']` → native `wss://battu.god8.shop` → cùng host.
- Kết nối lại: lũy thừa `1,5 s × 2^(n−1)`, trần 30 s, tối đa 6 nấc.
- Phòng đầy (4001) → thử phòng kế tiếp.
- Gửi `mv` khi đổi > 0,02 ô hoặc đổi ngồi/độ cao, ≤ 8 Hz; nội suy người khác với tốc độ 3,5 × 1,35 ô/s, nhảy thẳng nếu lệch > 4 ô.
- Ẩn người: theo mã ổn định `u` (băm SHA-256 của `pid`), lưu cục bộ.
- `requestSeat()`: chờ máy chủ cấp chỗ ≤ 1,5 s; offline → chỗ giữa.

### 10.3 Máy chủ (`TownShard`)

- WebSocket Hibernation: trạng thái từng người nằm trong `serializeAttachment` → sống qua lúc DO ngủ.
- `rateGate` theo socket trong `WeakMap` (mất khi DO ngủ — chấp nhận).
- `hello`: gán vị trí xuất phát **hằng số** `(11,875; 33,875)` (= `world.js › START`, chép tay), gửi `welcome` + danh sách người, phát `join` và `count`.
- `mv`: lưu vào attachment và **phát cho cả phòng** (không lọc theo khoảng cách). Với 60 người × 8 Hz: tối đa ≈ 480 gói vào/giây và ≈ 28.000 gói ra/giây cho một phòng đầy (suy luận theo công thức n × 8 × (n − 1)).
- `report`: lưu `ctx.storage` khóa `report:<pid>:<id>`, trần 500 báo cáo / phòng.
- Không xác thực danh tính; `pid` do client tự sinh.

### 10.4 Định tuyến Worker

`/ws/quan?room=N` → kiểm `Upgrade`, kiểm `Origin` theo danh sách cho phép, `env.QUAN.idFromName('town-' + N)`. Trước đó mọi yêu cầu đều qua bước kiểm IP bị chặn (một lần đọc KV).

## 11. Proxy AI và Thầy AI

```
master-ui.js ──(nạp lười)──▶ engine/ai.js › askAI(question, R, cfg, { onToken, onStatus, history, signal, style })
   messages = [ SYSTEM_PROMPT (iOS: RESEARCH_SYSTEM_PROMPT),
                brief (RAG theo câu hỏi hoặc brief đầy đủ khi câu tổng hợp) + «não» brainThink + hướng dẫn + _ANTI_MANIP_GUIDE,
                STYLE_DIRECTIVES[style],
                lịch sử ≤ 8 lượt, câu hỏi ]
   stream; tối đa 6 vòng / 9 lần thử; tool AI_TOOLS (~40) qua execTool(name, args, R)
   lỗi → tắt tools → tắt thinking → composeAnswer (trả lời cục bộ)
   ──▶ checkNeo(answer, brief) hiển thị điểm Neo + suggestFollowups
```

- Cấu hình mặc định: preset `zai-proxy`, endpoint `/zai/api/paas/v4`, model `glm-5.3`, không cần khóa (Worker chèn khóa phía máy chủ).
- Worker `/zai`: nếu quản trị đặt khóa riêng → chuyển thẳng; không thì `freeRoute()`: thử z.ai Coding Plan trước, sau đó các backend trong `ai:config.freePool` (bỏ `tools` cho pool để tránh 413). Timeout 90 s tới khi có header.
- Giới hạn: 30 lần gọi/phút/IP (KV), công tắc `isAiEnabled`, `isFreeAiEnabled`.
- Brief đầy đủ ≈ 92,5 nghìn ký tự (bình luận trong Worker ước tính ≈ 20 nghìn token). Câu hỏi hẹp dùng RAG khi tập mục liên quan < 60% brief.
- Bản iOS: `FEATURES.ai = false` → không có Thầy AI trong game.
- Game **chưa có** persona, `gameContext`, `toolsAllow`, hạn mức theo người chơi, bộ đệm trả lời.

## 12. Tích hợp engine

| Module game | Engine dùng | Cách nạp |
|---|---|---|
| `stations.js` | `chart.analyze`, `zhai.computeZhai`, `daily.dailyGuidance`, `qiuqian`, `constants`, `daily-guide` | tĩnh (cùng chunk `game`) |
| `cases.js` | `chart.analyze`, `computeLiuNian`, `kb` (Cùng Thông Bảo Giám, Trích Thiên Tủy), `classical-cases` | tĩnh trong `cases.js`, `case-ui.js` nạp lười |
| `halls.js` | `han-nuan`, `hehun`, `ziwei`, `mangpai`, `kb` | nạp lười qua `case-ui.js` |
| `dz-case.js`, `zheri-case.js` | `zhai`, `fengshui-compass`, `xuankong`, `zheri` | nạp lười |
| `vanmenh.js`, `thaitue.js` | `life-trajectory`, `dayun-changsheng`, `phase-narrative`, `taisui-general`, `taisui` | nạp lười qua `vanmenh-ui.js` (chỉ web) |
| `interior.js` | `taisui-general.TAISUI_60` | tĩnh (cùng chunk 3D) |
| `que-ui.js` | `meihua`, `liuyao`, `xiaoliuren`, `jinkoujue`, `qiuqian`, `hexagram-meaning` | nạp lười (chỉ web) |
| `master-ui.js` | `ai`, `neo-checker` | nạp lười (chỉ web) |

- `chartOf()` có bộ đệm `Map` **không giới hạn, không xóa**; khóa gồm phút sinh. Năm tham chiếu là năm hiện tại lúc tính (qua giao thừa dương lịch mà không tải lại thì `liunian.isNow` cũ).
- Chia chunk Vite: `engine-kb`, `engine-ai`, `engine-ziwei`, `engine-divination`, `engine-daozang` (6,09 MB), `engine-library`… Game hiện không kéo `daozang` (chỉ app chính dùng).

## 13. Bản build và triển khai

| Mục tiêu | Lệnh | Kết quả | Ghi chú |
|---|---|---|---|
| Web dev | `npm run dev` | Vite cổng 5173, proxy `/ws` → 8788 và các proxy LLM | |
| MMO dev | `npm run dev:mmo` | `wrangler dev` cổng 8788 | Script dựng cấu hình tạm trong thư mục ASCII và junction tới repo vì `workerd` trên Windows sập với đường dẫn có dấu («app bói toán») |
| Web build | `npm run build` | `dist/` (đầu vào `index.html` + `game.html`) | Plugin `sw-auto-version` đổi tên cache SW |
| Triển khai | `npm run deploy` | build trang SEO + build + `wrangler deploy` | |
| iOS | `npm run build:ios` → `verify:ios` → `cap:ios` | `dist-ios/` (không `game.html`; game vào qua overlay), `ios-postbuild` xóa `.hd.glb` và các tệp bị cắt | Capacitor app id `shop.god8.lvdang` |
| GitHub Pages | workflow `pages.yml` | `GH_PAGES=1` đổi `base` | |
| CI Cloudflare | workflow `cloudflare.yml` | **tự triển khai mỗi lần push `main`** nếu có secret | Mâu thuẫn với yêu cầu «triển khai cần chủ dự án duyệt» — xem TASK-014 |
| CI iOS | workflow `ios-build.yml` | build Release không ký, đẩy artifact | ký và nộp thủ công |

## 14. Kiểm thử hiện có

| Lệnh / tệp | Phạm vi | Ghi chú |
|---|---|---|
| `npm test` (`selftest.mjs`, 10.248 dòng) | engine app chính | không gồm game |
| `npm run test:game` | `test-game-state`, `-zheri`, `-dz`, `-halls`, `-progress`, `-vanmenh`, `-cosmetics` | 7 bộ |
| `test-game-cases.mjs` | giải án + `recordCase` | **chưa** có trong `test:game` |
| `test-terrain.mjs` | `heightAt`, hiệu năng 50.000 lần < 400 ms | **chưa** có trong npm script |
| `npm run test:mmo` | `test-quan-protocol` (đơn vị) + `test-quan-mmo` (tích hợp, cần `dev:mmo`) | Bộ tích hợp có 10 bước; **không có** bài tải 60 người |
| `smoke-browser.mjs` | Playwright: lỗi runtime trang chính | mặc định chạy trên production |
| `verify-ios-build.mjs`, `verify-ios-review-path.mjs` | tạo tác iOS, đường duyệt của Apple | không kiểm riêng game |
| `npm run accuracy` | độ chính xác cổ pháp | engine |

## 15. Nợ kỹ thuật và phát hiện khi rà soát

Mỗi dòng có TASK xử lý trong phần 12–14.

| Mã | Phát hiện | Mức | TASK |
|---|---|---|---|
| D1 | `remedy-fate › getRemedyForChart` và `getYeguoForChart` so `'劫财'` (giản thể) trong khi `core.js › tenGod` trả `'劫財'` (phồn thể). Nhánh Kiếp Tài không bao giờ khớp. Cả hai hàm chỉ xét thập thần **can** (`ganGod`), bỏ tàng can | cao | TASK-001, TASK-002 |
| D2 | `daozang-data › suggestDaozangChartAware` đọc `R.yong.god` (không tồn tại; khóa thật là `primary`, `secondary`, `avoid`, `xi`, `ji`, `chou`…). Nhánh gợi ý tu theo Dụng thần **không bao giờ chạy** (xác nhận bằng `Object.keys(R.yong)`) | cao | TASK-003 |
| D3 | Cùng lớp lỗi D1: `ai.js` (dòng 377, khối «TỔ HỢP KINH ĐIỂN» của brief) so `'伤官'`, `'七杀'`, `'正财'`, `'偏财'`, `'劫财'` giản thể với `ganGod`/tàng can phồn thể → các tổ hợp 伤官配印, 杀印相生, 财生官, 比劫争财… có thể không bao giờ hiện trong brief. Các tệp khác có chuỗi giản thể cần rà: `kb.js`, `neo-checker.js`, `tang-analyze.js`, `xingshen-zuo.js` (tệp `ziwei-*` dùng tên sao, không phải thập thần) | cao | TASK-004, TASK-005 |
| D4 | Điện «ngoài bản đồ» ở x = 1.500–2.000 m trùng tâm Long Hổ Sơn của canon | cao | TASK-071 |
| D5 | `WORLD = 2048`, `EDGE = 960`: các thánh địa mới (tới ±2.000 m) nằm ngoài bản đồ | cao | TASK-126 … TASK-131 |
| D6 | Va chạm một lớp, không có chủ sở hữu ô, chỉ có sau khi GLB nạp | cao | TASK-072, TASK-073, TASK-075 |
| D7 | `landmarks` không bao giờ dỡ; `chartCache` không giới hạn | trung | TASK-132, TASK-020 |
| D8 | Giới hạn tốc độ toàn cục 120 yêu cầu/phút/IP áp cho cả `/models/*.glb` (không thuộc `/assets/`); mỗi yêu cầu ghi KV một lần. Một lần vào Sơn Môn tải hàng chục GLB → người chơi sau NAT chung (trường học, quán net) dễ bị 429 | cao | TASK-015 |
| D9 | GLB không có `Cache-Control` riêng (regex cache chỉ có png/webp/jpg/jpeg/gif/svg) → mỗi lần vào phải xác thực lại tệp lớn | trung | TASK-016 |
| D10 | `public/models` (168 MB) nằm trong git; mở rộng 10 vùng ước tính lên hàng GB | trung | TASK-133 |
| D11 | Protocol khai báo P3 (`solve`, `lb`, `coop_*`) nhưng máy chủ chưa xử lý | thấp | TASK-196 |
| D12 | Máy chủ phát `mv` cho cả phòng, không lọc khoảng cách; không có bài tải 60 người | trung | TASK-197, TASK-198 |
| D13 | Vị trí xuất phát chép tay ở máy chủ (`11,875; 33,875`) | thấp | TASK-199 |
| D14 | Ngọc, VIP, đồ mua chỉ ở client | cao khi bán thật | TASK-266 … TASK-272 |
| D15 | CI tự triển khai lên Cloudflare mỗi push `main` | cao (quy trình) | TASK-014 |
| D16 | `test-game-cases`, `test-terrain` chưa gắn vào npm script | thấp | TASK-012 |
| D17 | Nhân vật `frustumCulled = false`; mỗi người chơi khác là một bản sao skinned + bộ phụ kiện riêng | trung | TASK-150 |
| D18 | Tự hạ chất lượng một chiều, duyệt toàn cảnh gây giật | thấp | TASK-151 |
| D19 | `admin.js › logEvent` lưu `dob/time/gender` vào KV `vprof:` khi app chính gửi sự kiện `chart`. Game **không được** dùng đường này cho phân tích (vi phạm «ngày sinh chỉ lưu trên máy») | cao (quyền riêng tư) | TASK-060, TASK-273 |
| D20 | Canon ghi «tải 60 người / phòng (đã có test)»; thực tế chưa có bài tải | thấp (tài liệu) | TASK-198 |
| D21 | Ba bản sao công thức ô ↔ mét (`court.js`, `models.js`, `world.js`) | thấp | TASK-017 |
| D22 | Lá số mẫu chưa có bản «sự thật engine» dùng chung. `MAU-A` chạy thật cho `pattern.name = '七殺格'`, `patternQuality.quality = '有救'` (lớp **Đắc Cứu**), `synthesis.score = 41`, `percentile = 31`, `fortune = 'khá no'`, `strength.level = 'Thân quá vượng'`, `effRatio = 0,77`, Ngũ Duy `cai 26 · guan 45 · yin 54 · shi 15 · ti 100`, `classifyChartLevel = '清贵'`, `baseVitality = 23`, `liudao.primary = '人道'`. Mỗi tài liệu tự chép tay sẽ lệch khi engine sửa (D1–D3) | trung (tài liệu) | TASK-033 |
| D23 | `patternQuality.quality` có thể trả `'未知'` (cách không có luật thành/bại). Canon chỉ định nghĩa 4 lớp; game phải có nhánh dự phòng | trung | TASK-010 |

## 16. Những gì giữ lại cho bản AAA

Đúng như §13.1 bản sơ đồ tổng, các phần sau được giữ và mở rộng, không viết lại:

1. **Hợp đồng renderer** `{ resize, frame(S, dt), yaw, rotate, celebrate, mode }`: thêm trường vào `S`, không đổi chữ ký.
2. **Thuần logic tách khỏi DOM** (`state`, `progress`, `cosmetics`, `protocol`, `terrain`, `court`, `world`, `cases`, `halls`…): mọi module mới (Mệnh Bàn, máy nhiệm vụ, Sổ Công Quá) theo cùng quy tắc để test bằng Node.
3. **Offline-first**: mất mạng vẫn chơi đơn; AI tắt vẫn tiến triển.
4. **Cờ tính năng** `features.js`: mọi tính năng bói/đoán vận mới phải khai báo cờ, bản iOS tắt.
5. **Engine dùng trực tiếp ở client**: không viết lại công thức bói trong game (trụ cột T1, T5).
6. **Va chạm theo hình khối + A***: mở rộng thành nhiều lớp và có chủ sở hữu (phần 06).
7. **Nhóm đèn điểm cố định**: mở rộng theo ô cổng (phần 06).
8. **WebSocket Hibernation**: giữ cho mọi Durable Object mới có kết nối dài (phần 08).
