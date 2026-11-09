# HUYỀN QUÁN SƠN MÔN — Thiết kế chốt (nội dung P0 chỉ dùng tài sản sẵn có)

> Ngày chốt: 2026-11-05. Mọi quyết định dưới đây dựa vào **bằng chứng đọc được trong repo** ở dịp rà này:
> `src/game/assets.js`, `public/models/`, `src/engine/` (grep + chạy thử bằng node), 5 tài liệu thiết kế
> (`docs/GAME-HUYEN-QUAN-SPEC.md` v1.1, `docs/GAME-NOI-DUNG-THEO-APP.md`, `docs/GAME-V2-THIET-KE.md`, `docs/GAME-AAA-THIET-KE.md`, `docs/gdd/README.md`) và code game đang có.
> Nguyên tắc chủ dự án: **KHÔNG phát minh nội dung cần tài nguyên mới.** Bài nào cũng chạy bằng engine đã có, dựng bằng model đã có trong `public/models/`.

---

## 0. Khảo tài sản sẵn có (bằng chứng)

### 0.1 Model 3D hiện có (`public/models/`, nạp qua `src/game/assets.js`)

`assets.js:17` khai `HD_IDS` (palace_grand, tower_nine, sect_gate_grand, cliff_palace, city_gate, sky_palace) và `assets.js:19` — mọi model `lib_*` có 3 bản hd/thường/lod. Liệt kê `ls public/models`:

- **Tượng thần Đã dựng (Meshy, đã code vào điện):** `deity_yuanshi`, `deity_lingbao`, `deity_daode` (Tam Thanh), `deity_wenchang` (Văn Xương), `deity_doumu` (Đẩu Mẫu) — đúng 5 tượng mà `GAME-V2` nhật ký 2026-11-04 ghi «5 tượng tạo bằng Meshy». **Không có** tượng Huyền Nữ / Quỷ Cốc Tử / Thủy Quan Đại Đế / Thái Tuế trong repo.
- **Thư viện CC0 đã tải (`lib_*`, 17 model):** pavilion2, garden_pav, pagoda_red, pagoda5, courtyard, mtn_house, stone_bridge, stall_timber, horse, cart, blossom, bonsai, wood_pavilion, willow, bookshelf, paifang, lantern — theo `docs/MESHY-LIBRARY-CC0.md` (tải 2026-11-03, CC0). **Trong đợt lib này không có tượng thần nào.**
- **Còn lại:** công trình Meshy tự tạo (hall_main, tea_pavilion, observatory, luopan_stand, scholar_desk, cauldron, library_tower, rock_island, boat, bridge_arch, gate_sect…), nhân vật (hero_m/f, master, npc_merchant, npc_villager), cây, flying_sword (đang dùng cho ngự kiếm — đã code).

### 0.2 Năng lực engine (`src/engine/` — ~250 module; đếm bằng ls)

Game đang import (grep `from '../engine` trong `src/game/`): chart, kb, zhai, daily, daily-guide, zheri, wedding-date(? qua zheri), huangdao(?), fengshui-compass, xuankong, han-nuan, mangpai, ziwei, hehun, meihua, liuyao, xiaoliuren, jinkoujue, qiuqian, hexagram-meaning, taisui, taisui-general, dayun-changsheng, life-trajectory, phase-narrative, classical-cases, constants, lunar-javascript. (Dòng import thấy trong vanbia/case/dz/zheri/que/thay…)

**Nhóm engine LỚN mà game chưa dùng (ứng viên nội dung mới, 0 credit):**

| Engine | Nguồn nội dung | Trạng thái dùng trong game |
|---|---|---|
| `classical-cases.js` (652 dòng, `CLASSICAL_CASES` — 38 án cổ: Quý Long, Nhạc Phi…) | án cổ nguyên văn + `known` (vượng/nhược, cách, dụng) + `principle` + `source` | cases.js chỉ dùng `known` cho án cổ ở trạm an0–an2 (`cases.js:11,159`) |
| `classical-runner.js` (192 dòng: parsePillar, buildChartFromPillars, analyzePillars, analyzeSummary) | dựng lá số từ 4 trụ cổ → chấm engine vs cổ pháp | **chưa ai dùng trong src/game** (grep toàn repo: chỉ `scripts/classical-accuracy.mjs`) |
| `liunian-pro.js` (497 dòng: scoreLiunianYear, computeDayunPhase, analyzeLiunianDeep) | 6 trường phái chấm năm + 进气/旺气/退气 | game chưa import |
| `dayun-god.js` (39 dòng: dayunGodMeaning, GOD_DECADE) | chủ đề thập thần mỗi thập niên | game chưa import |
| `remedy-fate.js` (280 dòng: LIAOFAN_STORY, YEGUO, CHAN_HUI, GAI_XIN, GAI_LEVELS, CONG_QUA, getYeguoForChart, getRemedyForChart, meritLedger) | Nghịch Thiên Cải Mệnh | game chưa import |
| `gaimenh.js` (98 dòng: gaimenhPlan → diagnosis + 6 layers + verdict) | Mệnh Đồ 6 tầng cá nhân | game chưa import |
| `daozang-data.js` (7.985 dòng: DAOZANG, suggestDaozangChartAware…) | Đạo Tạng gợi ý kinh tu theo Dụng thần | game chưa import |
| `anti-manipulation-data.js` (ANTI_MANIPULATION_DATA) | mẫu phát hiện lừa đảo tâm linh, RB2/RB5 | game chưa import |

### 0.3 Cấu trúc game đang khóa/phân bổ (liên quan cách wire nội dung)

- **Vị trí mọi trạm/sảnh nằm ở file bị khóa:** `world.js:42` `HALLS` (8 sảnh), `world.js:62` `ROOMS` (6 điện: chinhdien, vanxuong, daumau, laoquan, vanmenh, thaitue), `world.js:76-92` sinh trạm door/exit/van. **Bản đồ mở sảnh ở `stations.js:729`** `STATION_OPEN` + `stations.js:~693` `HALL_OPEN` (map id → openHall). ⇒ **Thêm sảnh/trạm mới bắt buộc đụng world.js/stations.js — hai file đang khóa.**
- **Renderer án tổng quát duy nhất:** `case-ui.js:479` `hallCaseBody` quét `cs.steps` từ `halls.js › HALL_BUILD` (`halls.js:258`) ⇒ **thêm BƯỚC vào sảnh hiện có chỉ cần sửa `halls.js`** (file không khóa); ngược lại dz-case/zheri-case có render per-key trong case-ui (`case-ui.js:417-447`) ⇒ không thể thêm bước mà không đụng case-ui (khóa).
- **Panel UI không khóa còn lại:** `que-ui.js` (Thầy Giải Quẻ trong Chính Điện Tam Thanh — trạm `que`, `stations.js:708-715` truyền sẵn `R` = lá số người chơi) và `wardrobe-ui.js` (Tàng Y Các — `api.yong()` có sẵn: `main.js:220`). `dzCaseBody`/`zheriCaseBody`/`master-ui` đều nằm cùng file khóa.
- **Danh sách file khóa đợt này** (đợt vá bug): `net.js, protocol.js, worker/quan-room.js, render3d.js, landmarks.js, obstacles.js, accessories.js, effects.js, world.js, characters.js, main.js, state.js, stations.js, interior.js, game.css, cosmetics.js, cases.js, case-ui.js, master-ui.js, vanmenh.js, vanmenh-ui.js, thaitue.js`.

### 0.4 Kiểm đã chạy trong đợt rà này (không phải suy diễn)

- `node -e … analyzeSummary({year:'辛卯',month:'丁酉',day:'庚午',time:'丙子'})` (án Quý Long) → `{"strengthLevel":"Thân vượng","strengthStrong":true,"patternName":"正官格","patternVi":"Chính Quan cách","yongPrimary":"火","patternQualityQuality":"败格"}` — engine khớp cổ pháp ở **vượng + dụng Hỏa** nhưng khác ở **cách** (cổ pháp: 羊刃格, «大贵天子命»). ⇒ Bài «đối chiếu cổ pháp» phải trình bày **hai phán song song**, không ép khớp.
- `node scripts/test-game-halls.mjs` → **«8 test đạt»** (baseline cho việc append bước vào halls.js; test assert `steps[0..2]` của dieuhau/tuvi/cachcuc và `steps.length === 5` của thuvien — `scripts/test-game-halls.mjs:39,47,67`).
- Shim daozang: `suggestDaozangChartAware({yong:{god:'木'},pattern:{name:'七殺格'}}, 'tĩnh tâm học tu')` → trả 3 kinh + `yongAdvice: '[BÁT TỰ PHỐI HỢP] Dụng Thần 木 → …'` ⇒ workaround lỗi L14 (engine đọc `R?.yong?.god` thay vì `.primary`, `daozang-data.js:7962`) làm được **ở phía game, không sửa engine**.
- Đã xác nhận đã code: ngự kiếm mở cấp 8/VIP (`progress.js:16`), độ cao kẹp 3–420 m (`main.js:416-417`), MMO gửi `a` 0–420 (`protocol.js:105`). Sổ Mệnh tabs thật (`stations.js:582-583`): **Tu học · Hồ sơ · Xăm · Đèn · Thành tựu · Cài đặt**.

---

## 1. Quyết định chốt (mâu thuẫn docs → một lời)

| # | Mâu thuẫn | **Quyết định** | Lý do / bằng chứng |
|---|---|---|---|
| Q1 | «Tu tiên»: `GAME-NOI-DUNG-THEO-APP.md:4` cấm ngự kiếm/cảnh giới/đột phá vs `GAME-V2` S12 «Cấp · gia trì · bay» (`GAME-V2-THIET-KE.md:59` — không phải cảnh giới) và `GAME-AAA` §9.1 thêm cảnh giới 6 bậc | **Giữ đúng những gì ĐÃ code, cắt mọi thứ chưa code.** Nội dung S12 đã code đủ (ngự kiếm mở cấp 8/VIP — `progress.js:16`; độ cao 3–420 m — `main.js:416-417`; MMO `a` 0–420 — `protocol.js:105`) → giữ, gọi là *phương tiện đi lại*, không phải tu luyện. **Cắt** cảnh giới 6 bậc — chỉ tồn tại trong `GAME-AAA` §9.1, chưa một dòng code nào (Tiên Thiên thôi tính, hệ số Nghịch Thiên, tim nghịch cùng số phận). Thang «tu» chính thức của game là **danh hiệu theo thông thạo nghề** (GAME-NOI-DUNG §3) đã chạy qua `state.deskLog` + `S.deskMastery` (stations.js dùng ở `:668,697`). | Nguyên tắc «giữ cái đã code» của chủ dự án; bằng chứng grep ở §0.4 |
| Q2 | Tượng thần: `GAME-HUYEN-QUAN-SPEC` §9.1 cấm («Không có tượng Phật, tượng thần») vs `GAME-V2` đã dựng Tam Thanh + 3 điện tượng | **Theo cái đã dựng.** 6 điện đã có trong `world.js:62-71` với 5 `deity_*` GLB. SPEC v1.1 là bản đầu (sân quán 20×14) — ghi chú: §9.1 **bị thay thế** ở vùng điện thờ bởi GAME-V2 §4/S5; giữ nguyên hai luật còn lại của SPEC: không sao chép tài sản người khác, **tượng không chữ/thánh tích cụ thể** (5 tượng Meshy hiện có đúng chuẩn này). | `ls public/models` khớp 5 tượng; `GAME-V2` nhật ký V2-4 |
| Q3 | Lộ trình AAA/GDD: 35 tuần · 15–16 người (`docs/gdd/13-ky-thuat/README.md:75-76`) · 3500–4000 credit Meshy (`GAME-AAA` §13.3) vs thực tế **còn 7 credit** (`GAME-AAA:928`) | **Cắt lộ trình 35 tuần/15–16 người/3500–4000 credit.** Lộ trình thực thi là **1 người + tài nguyên hiện có** (bảng §3 dưới). Mọi module AAA chưa tồn tại — `menhban.js`, máy nhiệm vụ, quest, Sổ Công Quá runtime, portal-cell, streaming 4,6 km — xếp mục **«Kế hoạch tài nguyên: chỉ tải về / khi nào có tài nguyên»**, không nằm lộ trình P0. | Credit là con số cứng: 7 còn lại vs 3500–4000 cần |
| Q4 | `GAME-AAA` §12.896 ghi «Sổ Mệnh (đã có) chia thẻ: Mệnh Bàn · Mệnh Đồ · Sổ Công Quá · Cảnh giới · Tủ đồ» vs code | **Chốt theo code:** tabs thật là **Tu học · Hồ sơ · Xăm · Đèn · Thành tựu · Cài đặt** (`stations.js:582-583`; iOS ẩn tab Xăm/Đèn). Dòng AAA §12 sai — sửa lại trong GAME-AAA khi đợt vá bug mở khóa docs; đến khi có menhban/quest thì các thẻ mới được *thêm vào*, không ghi «đã có». | Grep tab ở §0.4 |
| Q5 | 3/8 điện GAME-V2 chưa có (Huyền Nữ, Quỷ Cốc, Thủy Phủ — hết credit; bảng 8 điện `GAME-V2-THIET-KE.md:112-120`, 5 điện đã dựng `world.js:62-71`) | **Không chặn phát triển.** Sảnh nghề tương ứng đã hoạt động tại **bàn sảnh hiện có**: Dương Trạch `world.js:44` {x −806, z 62}, Tượng Pháp `world.js:47` {654, −441}, Điều Hậu `world.js:43` {480, 420} (đình gỗ + án thư + bonsai — `landmarks.js:230-232` dựng từ model lib_*). Lưu ý: toạ độ −820/0 trong `GAME-V2:117` là vị trí **điện** Huyền Nữ dự kiến, khác toạ độ **bàn sảnh** trong world.js. Điện thờ vùng chỉ dựng lại khi có tài nguyên theo §4 dưới (tải CC0 hoặc thuần code kiểu atlas). | Bàn sảnh đã dựng + chạy được là bằng chứng |
| Q6 | Lỗi engine L13/L14 (「劫财」 giản thể vs 「劫財」 phồn thể — `remedy-fate.js`; `R?.yong?.god` — `daozang-data.js:7962`) | **Không sửa engine trong đợt nội dung** (trùng đợt vá bug). Nơi gọi ở phía game tự lách: shim `{ yong: { god: R.yong.primary } }` cho daozang (đã kiểm chạy — §0.4); các hàm `getYeguoForChart/getRemedyForChart` chỉ dùng ở lớp *trình bày*, không chấm điểm → lỗi so chuỗi giản/phồn thể không ảnh hưởng gameplay đợt này. | Shim chạy thử thành công |
| Q7 | Điểm thông thạo cho nội dung mới | **Đợt này không ghi `deskLog`** vì `state.js` đang khóa. Nội dung mới chấm đúng/sai ngay trong panel (như tab Thư Viện đã có dạng `npc: null` — `halls.js:114`). Việc nối điểm vào thông thạo nghề xếp đợt sau cùng việc mở khóa state. | Danh sách khóa ở §0.3 |

---

## 2. Nội dung P0 (code-only, tối đa dùng tài sản đã có)

> Cả 2 mục đều **needsAssets = false**: không thêm model, không thêm credit, không đụng file khóa.
> Lane đã kiểm ở §0.3: panel duy nhất còn tự do để gắn nội dung «điện đã dựng» là **Thầy Giải Quẻ** (`que-ui.js`, trong Chính Điện Tam Thanh đã dựng); sảnh nghề chỉ mở rộng được qua `halls.js` (renderer tổng quát). Tàng Y Các (`wardrobe-ui.js`) bị loại khỏi P0 — phần hiển thị «Hợp mệnh» đã có sẵn, xem §3.

### P0-1 · «Đường Thầy» — 3 tab mới trong Thầy Giải Quẻ (Chính Điện Tam Thanh) — priority 1

- **files:** `src/game/que-ui.js` (thêm 3 mục trong `TABS` tại `que-ui.js:87` + 3 nhánh `renderForm` — que-ui chỉ **render**, toàn logic nằm ở module), `src/game/gu-gongan.js` (mới), `src/game/namhan.js` (mới), `src/game/kinh-tu.js` (mới), `scripts/test-game-thay-mo-rong.mjs` (mới — test cả 3 module bằng node, thuần import engine).
- **Tab «Án cổ» — nội dung nằm trong `gu-gongan.js`**, que-ui chỉ gọi `buildGongan(key, today)`:
  - `buildGongan` chọn 1 án/ngày từ `CLASSICAL_CASES` (`classical-cases.js:23`, 38 án, chỉ `confidence: 'high'`) theo `hashSeed('gongan:'+key)`; trả `{ pillars, person, note, steps, compare }`.
  - **Bước hỏi** (3 bước, mỗi bước 1 điểm): ① đoán thân vượng/nhược (`options: vượng/nhược/trung hoà`); ② đoán hành dụng **theo cổ pháp** — chỉ có khi `known.yongElement` khác null, null thì bước này bị lược và tổng là 2 bước; ③ đoán «phán cổ» tóm tắt (đúng/theo hướng khác, 2 lựa chọn). Đáp án lấy từ `known.strength` ('vượng'→vượng, 'nhược'→nhược, '中和'→trung hoà) và `known.yongElement`.
  - **Luật chấm (đặt trong `gu-gongan.js`, que-ui KHÔNG có gradeStep — `que-ui.js:86-176` chỉ `show()` kết quả):** hàm `grade(step, ans)` nội bộ trả 0/1; tổng X/n (n = 2 hoặc 3), hiển thị `X/n` trong panel ngay dưới các bước. **Không ghi `state.deskLog`, không có điểm thông thạo** (Q7 — `state.js` khóa); không có điều kiện qua — bảng đối chiếu luôn hiện sau khi trả lời.
  - **Bảng đối chiếu hai phán** (luôn hiện): bên cổ — `known.verdict` + `principle` + `person` + `source` nguyên văn (`classical-cases.js:23-60`); bên engine — `analyzeSummary(pillars)` từ `classical-runner.js:179` (trả strengthStrong/patternName/patternVi/yongPrimary — đã kiểm node trên án Quý Long, §0.4); từng trục đánh dấu ✓ khớp / ✗ khác: strength (`strengthStrong` vs `known.strength`), dụng (`yongPrimary` vs `known.yongElement`), cách (`patternName` vs `known.ge` — khác nhau là **bình thường**, ghi chú «engine này chưa bám được mọi phán cổ, xem scripts/classical-accuracy.mjs»).
  - **Bước 4 «bắt phán ghép»** — đợt 2 của cùng tab (cùng file `gu-gongan.js`, làm sau khi 3 bước chạy ổn): gắn `known.verdict` của một án khác lên 4 trụ hiện tại, người chơi nhận ra bằng `analyzeSummary` không khớp phán — mầm «Định Mệnh Hội» (AAA §2.2), dạy vạch mặt từ `ANTI_MANIPULATION_DATA` (`anti-manipulation-data.js:512`).
- **Tab «Năm hạn của bạn» — nội dung nằm trong `namhan.js`**, que-ui chỉ gọi `buildNamHan(R, nowYear)` (chỉ hiện khi `R` khác null — `stations.js:709-713` đã truyền sẵn; ngày sinh vẫn chỉ nằm trên máy — GAME-HUYEN-QUAN-SPEC.md §11 mục 4, :355):
  - `buildNamHan` trả 1 object duy nhất: `{ dayun: computeDayunPhase(R.dayun, nowYear)` (`liunian-pro.js:348` — 进气/旺气/退气 + %), `godDecade: dayunGodMeaning(R.chart, R.dayun).items.find(d === dayun đang đi)` (`dayun-god.js:25` — thập thần + chủ đề thập niên), `years: [5 năm tới]` — mỗi năm gọi `analyzeLiunianDeep(R, year)` (`liunian-pro.js:362`) lấy `{ score, rating, schools, ganGod }`, `advice` — 1 câu `GAI_LEVELS` (`remedy-fate.js:130`)`. Toàn bộ thuần logic, test node được (không DOM).
  - **Luật map ngôn ngữ (trong `namhan.js`, áp cho cả tab):** rating 6 mức của `liunian-pro.js:304-309` → từ mềm theo `GAME-HUYEN-QUAN-SPEC.md` §11 mục 3 (:354): `Đại cát/Cát → «thuận — nên làm»`, `Bình → «bình thường»`, `Hơi kỵ/Hung/Đại hung → «nên thủ, giữ sức»`. **Cấm chữ** «đại hung/tai họa/chết» ở lớp hiển thị; chữ kỹ thuật (`Hơi kỵ`, `Hung`) chỉ hiện trong `<details>` tra cứu, không trong câu chính.
- **Tab «Chọn kinh» — nội dung nằm trong `kinh-tu.js`**, que-ui chỉ gọi `kinhTu(R, question)`: gọi `suggestDaozangChartAware` (`daozang-data.js:7957`) qua shim `{ yong: { god: R.yong.primary } }` (lách lỗi L14 — engine đọc `R?.yong?.god` tại `daozang-data.js:7962`, đã kiểm node shim trả đúng 3 kinh + yongAdvice); không có câu hỏi thì chỉ dùng nhánh Dụng thần + cách cục. Trả mảng `{ name_vi, essence, notes }` — que-ui render.
- **Điều kiện:** panel `que` đã tắt trên iOS (`features.js IOS_OFF` gồm `que`) — không phải xử lý thêm. Lazy import 3 module theo khuôn lazy-load hiện có của que-ui để không phình bundle. **needsAssets:** false (UI DOM, điện đã dựng).

### P0-2 · Khách sảnh nghề có bước «Năm nay» — priority 2

- **files:** `src/game/halls.js` (append 1 bước cuối vào `buildDieuHau`, `buildTuVi`, `buildTuongPhap`, `buildCachCuc` — **không** đụng `buildThuVien`/`buildHopHon`), `src/game/npc-deep.js` (mới), `scripts/test-game-npc-deep.mjs` (mới).
- **`npc-deep.js` là hàm thuần `npcDeep(R, nowYear)` — KHÔNG bọc `makeNpc`.** Các builder halls.js đã tự có NPC + lá số: `R = npcR(npc, year)` có sẵn tại `halls.js:55,150,185,206,237`; `npcDeep` nhận đúng `R` đó và trả `{ options, answer, explain }` cho 1 bước: gọi `analyzeLiunianDeep(R, nowYear)` (`liunian-pro.js:362`) lấy `rating`/`score`/`schools`. Thuần logic, test node được.
- **Luật map rating 6 mức (`liunian-pro.js:304-309`) → 3 lựa chọn của bước:** `Đại cát`+`Cát` → `thuan`; `Bình` → `binh`; `Hơi kỵ`+`Hung`+`Đại hung` → `giu`. Nhãn hiển thị dùng từ mềm của `GAME-HUYEN-QUAN-SPEC.md` §11 mục 3 (:354): «Thuận — nên làm» / «Bình thường» / «Nên thủ, giữ sức». `explain` ghép `schools[0].phai + note` + 1 câu GAI. Bước khai `order: ['thuan','binh','giu']` để chọn kề thang được 0,4 (giảm xáo điểm khi lệch một bậc).
- **Bước mới (append cuối mảng `steps`):** prompt «Năm nay của khách thế nào?»; renderer tổng quát `hallCaseBody` (`case-ui.js:479`) hiển thị không cần sửa — nó quét `cs.steps` và chấm qua `gradeStep` (`halls.js:29`).
- **Hệ quả chấm sảnh (chấp nhận có chủ đích):** `totalOf` chia cho `steps.length` (`halls.js:43`) → thêm bước thứ 5 làm mỗi bước chỉ còn 1/5 trọng số (trước là 1/4); `deskMastery` đã lưu từ các ngày trước (4 bước) không so sánh trực tiếp được với lần sau (5 bước) — chấp nhận vì mastery là trung bình các lần gần nhất, không có migration. Người chơi bỏ trống bước mới sẽ kéo tổng xuống — hợp lý (bước là một phần án). Lựa chọn thay thế bị loại: bước ngoài `totalOf` đòi sửa `case-ui.js` (khóa).
- **An toàn test:** baseline `node scripts/test-game-halls.mjs` = 8 test đạt (đã chạy §0.4). Append cuối giữ nguyên `steps[0..2]` (assert ở `test-game-halls.mjs:39,67,75`); `buildThuVien` không thêm vì test assert `steps.length === 5` (`:47`).
- **needsAssets:** false.

### Mục P0-3 cũ bị loại (sau góp ý duyệt)

Mục «Tàng Y Các: dòng Hợp mệnh vì sao» bị **rút khỏi P0** vì phần cần làm đã tồn tại sẵn trong chính file định sửa: dòng giải thích «Mặc đủ 4 món một bộ → … Hợp mệnh: +10% Phúc Khí» đã render tại `wardrobe-ui.js:84`, thẻ bộ có highlight `match` (:87) và nhãn «Hợp mệnh của bạn» (:90); kể cả «Thử 20s» cũng đã có (:68,:72). Làm thêm chỉ nhân đôi UI. Không thay bằng mục mới trong đợt này — hai mục P0-1/P0-2 đủ giá trị và an toàn hơn một mục bịa chỗ trống.

### Đề tài P0 đã xét và hoãn (vì đụng file khóa)

- **Mệnh Đồ 6 tầng (`gaimenhPlan`) + Sổ Công Quá (`CONG_QUA`, `meritLedger`) vào trạm Tu học:** đúng nguyên liệu (§0.2) nhưng tab «Tu học» render trong `stations.js` (khóa) và Sổ Mệnh ghi điểm qua `state.js` (khóa) → **hoãn**, ghép đợt sau cùng Q4/Q7.
- **Bổ tượng/vách cho 3 điện thiếu:** xếp mục §4 (tài nguyên), không phải P0 code.
- **Nội dung mới vào Vận Mệnh Các / Thái Tuế Điện:** `vanmenh.js`, `vanmenh-ui.js`, `thaitue.js`, `interior.js` đều khóa → hoãn.

---

## 3. Cắt gì và vì sao (từ AAA + GAME-V2 + GDD)

| Cắt | Vì sao |
|---|---|
| Cảnh giới 6 bậc, Tiên Thiên/Hậu Thiên, hệ số Nghịch Thiên, tim tâm ma (AAA §4.7, §9.1) | Chưa có một dòng code; cần máy nhiệm vụ + menhban chưa tồn tại. Trái nguyên tắc «cắt mọi thứ chưa code đòi scope mới». |
| 12 thánh địa (AAA §7: Long Hổ, Võ Đang, Bút Tháp…), 324 công trình `BLD-*`, 456 `MOD-*` | Cần 3500–4000 credit Meshy (`GAME-AAA:926`) vs còn 7 (`:928`). Tài liệu gdd 14 tập giữ làm **tầm nhìn tham khảo**, không phải kế hoạch thực thi. |
| 35 tuần · 15–16 người · 731,75 ngày công (`docs/gdd/13-ky-thuat/README.md:75-76`) | Không có biên chế như vậy; lộ trình thực tế = 1 người theo bảng §4. |
| Mệnh Bàn · Mệnh Đồ · Sổ Công Quá · Cảnh giới · Tủ đồ «đã có» (AAA §12) | Sai với code (`stations.js:582-583`) — Q4. |
| Persona AI 20 NPC, gameContext, toolsAllow trong `ai.js` (AAA §6) | `ai.js` là engine app, đang trong vùng rà bug; Thầy AI hiện tại (`askAI` + `checkNeo` qua master-ui, khóa) đã đủ cho nội dung P0. |
| Kết phù, khoa cử, mạn-đà-la, Tà Lộ, Phong Đô, Miêu Cương (AAA §9.3) | Cùng lý do Q1/Q3: engine phụ có, nhưng không có nơi gắn (mọi trạm mới đụng world.js/stations.js khóa) và không có tài nguyên. |
| Mục P0-3 cũ «Tàng Y Các: dòng Hợp mệnh vì sao» (`wardrobe-ui.js`) | Không phải «cắt» vì thiếu tài nguyên mà vì **đã có sẵn**: dòng giải thích Hợp mệnh tại `wardrobe-ui.js:84`, highlight `match` (:87) + nhãn «Hợp mệnh của bạn» (:90), «Thử 20s» (:68,:72). Làm thêm = nhân đôi UI (góp ý duyệt 2026-11-05). |
| Ngự kiếm thêm cơ chế mới (đua, bỏ qua vật cản chọn lọc…) | Đã code đủ: `main.js:416-417`, `protocol.js:105`. Không mở rộng. |

---

## 4. Kế hoạch tài nguyên: chỉ tải về (không tạo mới bằng credit)

Nguyên tắc: chỉ **tải model CC0 có sẵn trên trang Meshy** (như đợt 2026-11-03 — `docs/MESHY-LIBRARY-CC0.md`) và pack bằng `scripts/meshy-pack-library.mjs` ra 3 bản hd/glb/lod; hoặc **nội dung thuần code** (canvas atlas / procedural) như vách 60 bài vị Thái Tuế. **Không** dùng text-to-3D tốn credit cho đến khi chủ dự án mua gói mới.

| Khi nào có tài nguyên | Việc | Hình thức |
|---|---|---|
| Tải được tượng CC0 hợp phong cách (gỗ sơn son, không chữ) | Huyền Nữ Điện (Phong Thủy Viên), Quỷ Cốc Đường (Tượng Pháp), Thủy Phủ (Cùng Thông Hồ) — khai `ROOMS` + `deities` trong `world.js:62-71` (khi mở khóa) | Tải CC0 từ trang Meshy (lưu ý: đợt lib hiện có **không** có tượng — cần đợt lọc mới) |
| Không cần tải | Nội dung Thái Tuế mở rộng (bảng 12 con giáp, tập tục) | Thuần code canvas atlas — theo khuôn `thaitue.js` |
| Chưa có gì | 3 điện trên **chưa dựng**: sảnh nghề vẫn chạy ở bàn sảnh hiện có (Q5) | — |
| Chủ dự án mua credit (nếu muốn AAA thật) | Chỉ áp cho công trình hạng A của AAA §8; còn lại nội dung engine là đủ | Quyết của chủ dự án |

---

## 5. Thứ tự thực thi đợt này (1 người)

1. **P0-1** «Đường Thầy» — giá trị nội dung lớn nhất (38 án cổ nguyên văn + 6 trường phái lưu niên + 7.985 dòng Đạo Tạng), chỉ 1 file UI + 3 module thuần + test. Làm theo thứ tự: gu-gongan → namhan → kinh-tu.
2. **P0-2** bước «Năm nay» — làm sâu 4 sảnh có khách, giữ baseline 8 test halls.
3. Sau khi đợt vá bug mở khóa `state.js`/`stations.js`: nối điểm thông thạo (Q7), Mệnh Đồ vào tab Tu học (§2 hoãn).

### Nhật ký

- 2026-11-05: rà tài sản (`assets.js`, `public/models`, grep engine, 5 docs), chạy kiểm node cho classical-runner + daozang shim + baseline `test-game-halls.mjs` (8 đạt); chốt 7 quyết định; lập 3 mục P0 code-only.
- 2026-11-05 (sửa theo góp ý duyệt — 8 lỗi): (1) bổ sung mô tả nội dung `namhan.js` (trước đây liệt kê file mà không nói chứa gì); (2) đặt luật chấm tường minh cho tab «Án cổ» (X/n trong panel, không state — trước đây «điểm ghi trong panel» mâu thuẫn Q7); (3) P0-2: `makeNpc` sửa thành `npc.js:41`, `npc-deep` đổi thành hàm thuần `npcDeep(R, year)` (builder đã có `R = npcR(...)` ở `halls.js:55,150,185,206,237`), thêm luật map 6 mức rating (`liunian-pro.js:304-309`) → 3 lựa chọn và ghi nhận hệ quả `totalOf` (`halls.js:43`) đổi trọng số bước; (4) loại mục P0-3 — phần hiển thị Hợp mệnh đã có sẵn tại `wardrobe-ui.js:84,:87,:90`; (5) sửa trích dẫn «SPEC §11.3/§11.4» → `GAME-HUYEN-QUAN-SPEC.md` §11 mục 3 (:354) / mục 4 (:355) — grep «11.3» trong docs không ra vì mục dùng danh sách đánh số, không heading; (6) sửa Q5: toạ độ bàn sảnh Dương Trạch là {−806, 62} (`world.js:44`), −820/0 là vị trí điện dự kiến (`GAME-V2:117`); (7) sửa Q1: GAME-V2 S12 (:59) là «Cấp·gia trì·bay», cảnh giới 6 bậc chỉ ở GAME-AAA §9.1; (8) đổi tên tài liệu viện dẫn thành tên file đầy đủ trong header. Kiểm lại bằng `grep -n`/`sed -n` cho từng số dòng nêu trên trong đợt sửa này.
