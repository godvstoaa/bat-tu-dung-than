# Nhân vật từ thư viện cộng đồng Meshy — manifest

Ngày 2026-11-18. Phạm vi: người chơi nam / nữ (`hero_m`, `hero_f`), NPC (`master`, `npc_villager`, `npc_merchant`, mới: `npc_lao`, `npc_ba`, `npc_nu`)
và thư viện động tác dùng chung. Không đụng công trình, không hạ chi tiết công trình.

## 1. Nghiên cứu — nguồn đã xem

- **Thư viện cộng đồng meshy.ai** (tài khoản maz.elements3), trang tìm `https://www.meshy.ai/search/<từ khoá>?kind=model`.
  - 36 từ khoá: hanfu, hanfu man / woman, wuxia swordsman, ancient chinese man / girl, chinese princess / warrior / old man / merchant /
    peasant / monk / scholar / soldier / innkeeper, taoist priest, daoist, kung fu master, xianxia, cultivator, tang / song / ming dynasty,
    và nhóm «animated … / … walking» để lọc model có sẵn xương.
  - ~410 bài đăng, ~310 là nhân vật; 107 có cờ `modelIsAnimated` (đã có xương + hoạt ảnh).
  - Danh sách rút gọn kèm id bài đăng: `output/nhanvat/meshy/shortlist.txt` (thư mục output không lên git).
- **Giấy phép:** mọi bài đăng dùng ở đây hiện nhãn **CC0** trên trang («anyone can use, share, and remix them freely, no credit needed»),
  như phần cây (`docs/TIEN-PHU-THUCVAT-MANIFEST.md` §8).
- **Model hiện có** (ảnh `output/nhanvat/cur/look/*.jpg`): 5 model Meshy tự sinh, 10–15k tam giác, 24 xương, texture 1024 (+ .hd 2048),
  6 clip cố định. Mặt gãy góc thấy rõ khi cận cảnh; trên phố mọi người chung 4 khuôn áo đỏ / ngọc.

### Học được

1. Tải từ bài đăng có hoạt ảnh, chọn khung xương **MeshyRig** → cùng tên xương với rig game (Hips, Spine02, LeftArm…). Không tốn credit.
2. Model Meshy gắn xương (đời 5.x) bị remesh về **9–19k tam giác**, texture 2048 màu + phát sáng. Riêng đời 7.1 (`c19`) giữ 101k và 83 xương
   (thêm ngón tay, xương váy / tóc).
3. TRS của nút xương trong GLB Meshy là **một khung hoạt ảnh**, không phải tư thế gắn da — phải lấy tư thế nghỉ từ `inverseBindMatrices`.
4. Rig cộng đồng có cả tư thế chữ T lẫn chữ A → ghép thẳng quaternion làm tay giơ ngang. Phải bù hướng xương nghỉ (xem §2.2).
5. Model không có xương: Meshy cho remesh **0 credit** nhưng gắn xương đòi < 300k mặt và (theo API) tốn credit → **không dùng** đợt này.
6. Mỗi tác giả gắn một bộ động tác khác nhau (A76: 19 động tác; c19: 9; A71: 6) → gom lại thành **thư viện động tác chung** miễn phí.
   Thư viện preset của Meshy (hàng trăm động tác) chỉ áp được trong workspace lên model đã gắn xương — chưa kiểm giá, chưa dùng.

## 2. Quy tắc thiết kế (số đo)

### 2.1 Chọn model
- Tả thực / bán tả thực, cùng ngôn ngữ với cảnh; loại mặt hoạt hình chibi.
- Texture không loang, không lấm chấm (loại `c274` thương nhân, `cA87`, `cA22` vì vết đen ở vạt áo).
- Tỉ lệ người: cao theo `HEIGHT` (nam 1,76 m, nữ 1,66 m, lão nông 1,66 m, bà lão 1,54 m, nữ trẻ 1,63 m).
- Ngân sách: ≤ 40k tam giác / người ở bản gần (`hero_f` 51,5k — không giản lược thêm được dưới ngưỡng sai số 0,05 do UV vụn; xem §7).
  Texture 1024 bản thường + 2048 bản `.hd` (cùng lưới), webp, meshopt.

### 2.2 Ghép động tác (tools/nhanvat.js › `nv.bake`)
- Theo **không gian thế giới**: `Wđích = Wnguồn · Wnguồn_nghỉ⁻¹ · C · Wđích_nghỉ`, rồi đổi về cục bộ theo cha.
- `C` = xoay ngắn nhất đưa hướng xương nghỉ đích về hướng xương nghỉ nguồn (tay, chân; xương lá dùng `C` của cha), không áp cho hông / sống / cổ / đầu.
- Dời hông theo tỉ lệ chiều cao hông. Lấy mẫu 30 khung / s.
- Kiểm bằng bảng ảnh mọi clip: `node scripts/nhanvat-clips.mjs <glb> <ảnh>`.

### 2.3 Đa dạng động tác (characters.js)
- Thư viện 16 clip: `idle walk run sit bow wave` + `idle2 idle3 chat drink talk look pick hello walk2 walk3`
  (nguồn: rig cũ hero_m / hero_f, A76 Idle_02/03 · Talk_Passionately · Alert · Collect_Object, c19 Stand_and_Chat · Stand_and_Drink ·
  Thoughtful_Walk · Walk_Slowly_and_Look_Around, A71 Big_Wave_Hello).
- Mỗi bản sao bốc **một kiểu đi** trong 3 (`walk`, `walk2`, `walk3`).
- Đứng yên: đổi kiểu đứng mỗi **6–14 s** (45 % về `idle`, còn lại ngẫu nhiên trong 6 biến thể), crossfade 0,6 s.
- NPC / Thầy: 12 % lượt đổi chen một cử chỉ một lần (`hello`, `pick`, `bow`), xong crossfade về nền.
- Khởi động lệch pha ngẫu nhiên trong clip → hai người cạnh nhau không thở cùng nhịp.
- Khi game ghi đè xương (ngồi bồ đoàn, cầm đồ, tư thế bay) → giữ `idle` gốc.
- Loại theo model: `hero_f` (c19, tay áo rộng bị kéo thành mảng khi giơ tay) bỏ `bow wave idle3 talk hello pick`; `npc_nu` bỏ `pick` (váy toé).

### 2.4 Nhuộm phẩm phục ngũ hành
- `hero_m` áo lam h 0,60 (49 % texture, V trung vị 0,40) → khoá áo h 0,60 ± 0,06, s ≥ 0,28; đai vàng h 0,115 ± 0,035 (V 0,82).
- `hero_f` (c19) mảng váy xám lam h 0,58, s trung vị 0,19 → khoá h 0,58 ± 0,08, s ≥ 0,08, chế độ `full` (nhuộm đủ độ bão hoà đích).
- NPC mới không nhuộm (giữ màu áo thật).

## 3. Vai đã chọn

| Id game | Nguồn (bài đăng meshy.ai/posts/…) | Tam giác gốc → game | MB thường / hd | Clip |
|---|---|---|---|---|
| hero_m | «Samurai Citizen» `019b9578-489e-7aa2-8044-5e1ca90f136b` — nam áo lam đai vàng | 14 102 → 14 102 | 0,76 / 0,93 | 16 |
| hero_f | «chinese woman / Moonlit Hanfu Grace» `01a163c0-89fc-7407-b9c6-33e5fb43e9b5` — nữ áo trắng | 101 791 → 51 508 | 2,32 / 3,26 | 10 |
| npc_lao (mới) | «老汉» `019bcc10-3a61-7e6c-a6ea-68ad6febff9e` — lão nông chân đất | 13 085 | 0,77 / 1,02 | 16 |
| npc_ba (mới) | «老农妇2» `019bcc0f-f8d9-790e-98a3-4d4d8e5b683f` — bà lão nông | 8 616 | 0,68 / 0,82 | 16 |
| npc_nu (mới) | «Mint Moonlight Hanfu» `019f40cf-2716-777a-83bd-a02861cbf27a` — nữ áo bạc hà | 9 274 | 0,78 / 1,06 | 15 |
| master, npc_villager, npc_merchant | giữ lưới cũ (chưa có model cộng đồng đẹp hơn) | 15 334 / 10 146 / 10 140 | ~0,9 / 1,2–1,4 | 12 / 15 / 15 |
| (chỉ lấy động tác) | «Elder Serenity» `0196c977-1fb6-7263-8616-78e0a11b9c11` | — | — | — |

- Gốc tải về (không lên git): `assets-meshy/library/chars/*.glb`; bản cũ: `assets-meshy/library/chars/old/`.
- Đóng gói: `node scripts/nhanvat-pack.mjs [id…]` (bảng `ROLES` trong script).
- **Đã xem và loại:** thương nhân áo vàng `019b35a7-…` (texture loang), nữ «Elegance in White» `019c22b7-…` (lấm chấm),
  nam áo trắng `019b5136-…` (vết đen), đạo sĩ «Elder Serenity» (mặt hoạt hình — chỉ lấy động tác),
  đạo sĩ T-pose `019a81dc-…` (598k mặt, không xương).
- Phân vai: lão nông Thổ Căn, cổ sư Lôi Minh, phu khuân vác → `npc_lao`; bà giữ giếng → `npc_ba`; ca kỹ Liên Hoa, thiếu nữ hái thuốc → `npc_nu`;
  dân phố `city4` / `cityblocks` bốc thêm 3 loại mới.

## 4. Ngân sách hiệu năng
- FPS không tụt quá 10 % ở phố đông người.
- Tam giác thêm cho 24 người ≤ +10 %.
- Tải thêm ≤ 3 MB.

## 5. Checklist kiểm

| Hạng mục | Cách kiểm | Kết quả |
|---|---|---|
| Ảnh mọi model cùng ánh sáng | `scripts/nhanvat-look.mjs` → `output/nhanvat/cand/look/all9.jpg` | ✔ |
| Mọi clip ghép đúng (không vặn tay, không xoay người) | `output/nhanvat/test/*-clips.jpg` | ✔ (lỗi tay áo c19 → đã bỏ clip) |
| Trước / sau trong game, cùng chỗ | `output/nhanvat/perf/so-sanh-vong.jpg`, cận cảnh `sauCan-3can.png` | ✔ |
| Đứng yên vẫn thở, đổi kiểu đứng, chuyển clip crossfade | code §2.3 | ✔ thở / crossfade; ✔ chớp mắt (§10, 2026-11-19) |
| FPS / tam giác / lệnh vẽ | `scripts/perf-nhanvat.mjs` (§6) | ✔ |

## 6. Số đo (headless Chromium, d3d11, 1280×720, 10 giờ sáng, phố city4 (13,5; 200); trung vị 3 × 5 s)

| | Trước (model cũ) | Sau | Chênh |
|---|---|---|---|
| Phố có dân — FPS | 21,2 | 20,6 | −2,8 % |
| + 24 nhân vật quanh người chơi — FPS | 20,8 | 20,2 | −2,9 % |
| Tam giác cả khung (+24 người) | 2 714 360 | 2 802 862 | +3,3 % |
| Lệnh vẽ | 839 | 839 | 0 |
| Tải model nhân vật (bản thường) | 3,5 MB (5 file) | 8,0 MB (8 file) | +4,5 MB lần đầu (.hd nạp sau khi vào game; mỗi file chỉ tải khi có người dùng nó) |

Headless chỉ để so tương đối; đợt trước dùng model cũ cho cả 3 id NPC mới để cùng số người.

## 7. Chưa đạt / chưa làm
- ~~Không chớp mắt~~ → đã làm bằng shader mí (§10).
- `hero_f` bản gần vẫn 51,5k tam giác (vượt 40k của §2.1) — nay chỉ hiện trong 15–18 m; ở xa dùng bản 7,9k (§9).
- ~~`hero_f` thiếu cúi chào / vẫy~~ → đã có (§10): cúi chào giữ tay như lúc đứng, vẫy tay biên độ 45 %.
- ~~Tải thêm 4,5 MB lần đầu~~ → đã sửa bằng LOD (§9): tải đầu 3,31 MB (bản xa), bản gần chỉ tải khi lại gần.
- `master`, `npc_villager`, `npc_merchant` giữ lưới cũ (mặt gãy góc) — chưa tìm được bản cộng đồng có xương đẹp hơn.
- Chưa dùng thư viện preset ~600 động tác của Meshy. Đã kiểm giá (§10): web app Remesh / Rigging / Animate = **0 credit** (clip ngoài bộ free cần gói trả phí); API 5 credit gắn xương + 3 credit / động tác. Chưa làm vì cần đưa model lên tài khoản người dùng để gắn xương — chờ người dùng đồng ý.
- Tên NPC phố ngẫu nhiên không theo giới tính model (đã có từ trước).
- `npc_villager` (bà áo đỏ) vẫn đóng vai nam ở vài chỗ (`render3d.js` chủ đò, `mansions.js`) — file đang do phiên khác sửa, chưa đổi.
- Đã remesh thử 1 model trong workspace Meshy (0 credit) để xem bước gắn xương; không gắn xương, không tốn credit.

## 8. Goal phát triển tiếp
1. ~~**Mặt sống:** chớp mắt~~ — đạt 2026-11-19 (§10).
2. ~~**LOD nhân vật**~~ — đạt 2026-11-19 (§9): −67 % tam giác, FPS +7,5 %, tải đầu 3,31 MB.
3. **Thay master / villager / merchant** bằng model cộng đồng có xương đạt chuẩn §2.1 — tiêu chí: ảnh cận mặt không gãy góc.
4. ~~Preset Meshy~~ — đạt 2026-11-19 (§11). (Kế hoạch cũ: gắn xương 1 model (0 credit) → thêm ~10 preset hợp phố cổ (Idle 1–15, Long Breathe and Look Around, Carry Water Bucket Walk, Elderly Shaky Walk, Dozing Elderly, Sit Cross-legged on Floor, Pull Radish, Female Stand Pick Fruit Basket, Gentlemans Bow, Listening Gesture, Walk with Umbrella) → `nv.bake` sang cả 8 nhân vật. Tiêu chí: ≥ 26 clip, NPC phố không hai người cùng động tác trong 1 khung hình 12 người.)

## 9. LOD nhân vật (2026-11-19, goal 2)

### Số đo trước khi làm
- Người cao 1,7 m, camera FOV ~50°, khung 720 px → ở 15 m cao ≈ 85 px; ở 30 m ≈ 42 px. Ở các cỡ đó, 5–6k tam giác đủ giữ dáng.
- Nặng nhất hiện tại: `hero_f` 51,5k tam giác / 2,3 MB; 8 file bản gần tổng 8,0 MB tải lần đầu.

### Quy tắc
| Bậc | Khi nào hiện | Tam giác | Texture | Ghi chú |
|---|---|---|---|---|
| gần (`<id>.glb`, `.hd`) | camera < 15 m | như §3 | 1024 → 2048 | chỉ tải khi nhân vật **lần đầu** vào vòng 25 m |
| xa (`<id>.lod.glb`) | camera > 18 m (giữa 15–18 m giữ bậc đang có, chống nhấp nháy) | 4 000 (đích); thực tế 4 000–7 900 | 512 (hero_f: màu đỉnh, không texture) | mang xương + mọi clip, tải trước — là «gốc» của nhân vật |

- Bản xa sinh từ cùng lưới gốc bằng giản lược **thường** (giữ UV, sai số 0,05). **Cấm sloppy** — đã thử: nối tam giác qua mảnh UV → áo loang như cẩm thạch (lần 1 `output/nhanvat/lodcmp/gan-xa.jpg` trước khi sửa).
- Model UV vụn mà giản lược thường kẹt (hero_f / c19 kẹt ở 51,5k) → `scripts/nhanvat-vclod.mjs`: nướng màu texture vào đỉnh, đỉnh trùng vị trí lấy màu trung bình, hàn đỉnh, giản lược, tính lại pháp tuyến mượt; giữ JOINTS/WEIGHTS.
- Hoạt ảnh của bản xa gộp khoá gần nhau (`resample --tolerance 0.002`, ≈ 0,25° mỗi xương): 600 → ~380 KB / file. Bản gần không mang clip.
- Shader nhuộm phẩm phục chèn sau `color_fragment` → nhuộm được cả bản màu-đỉnh.
- Bản gần gắn vào **cùng bộ xương** của bản xa (khớp theo tên xương) → đổi bậc không giật động tác, không phải nạp lại clip.
- Không đổi khoảng cách đổi bậc của công trình; không hạ texture / lưới công trình.

### Ngân sách / tiêu chí đạt
- 24 người ở 20–35 m: tam giác nhân vật giảm ≥ 40 %.
- FPS cảnh phố + 24 người không thấp hơn bản không LOD.
- Tải lần đầu (chỉ bản xa) ≤ 3,5 MB cho 8 nhân vật.
- Ảnh cùng nhân vật ở 15 m (gần) và 18 m (xa) đặt cạnh nhau: không thấy khác dáng / màu đáng kể.

### Kết quả (2026-11-19)

| Id | Gần (tam giác) | Xa (tam giác) | Cách làm bản xa | Xa MB | Gần MB (không clip) |
|---|---|---|---|---|---|
| hero_m | 14 102 | 4 000 | giản lược thường | 0,38 | 0,30 |
| hero_f | 51 508 | 7 891 | màu đỉnh | 0,31 | 1,93 |
| master | 15 334 | 7 714 | thường (UV kẹt ở 7,7k) | 0,49 | 0,50 |
| npc_villager | 10 146 | 5 875 | thường (kẹt 5,9k) | 0,50 | 0,46 |
| npc_merchant | 10 140 | 4 918 | thường | 0,45 | 0,39 |
| npc_lao | 13 085 | 4 000 | thường | 0,39 | 0,31 |
| npc_ba | 8 616 | 4 000 | thường | 0,37 | 0,22 |
| npc_nu | 9 274 | 4 896 | thường | 0,42 | 0,35 |
| **Tổng** | | | | **3,31** (tải đầu, ≤ 3,5 ✔) | 4,46 (chỉ khi lại gần) |

- Ảnh gần / xa cạnh nhau (trên: cỡ đầy; dưới: thu về ~105 px cao như ở 15 m rồi phóng lại): `output/nhanvat/lodcmp/gan-xa.jpg`; cận nữ `hero_f-gan-xa.jpg`.
  Dáng / màu khớp; bản xa của nữ mất nét mặt (ở ≥ 18 m mặt ~10 px).
- Trong game (`scripts/perf-nhanvat.mjs`, headless, phố city4, trung vị 3 × 5 s):

| Đo | Không LOD (ép bậc gần) | Có LOD | Chênh |
|---|---|---|---|
| Tam giác của 24 người ở 20–32 m | 132 205 | 43 294 | **−67 %** ✔ (≥ 40 %) |
| Tam giác dân phố (trước khi thêm vòng) | 2 433 434 | 2 376 264 | −57 170 |
| FPS phố + 24 người ở xa | 21,2 | 22,8 | +7,5 % ✔ |
| Bản gần đã tải (vòng xa) | 24 | 9 (chỉ người trong 25 m) | |
| Vòng 3,5–9 m: số người bậc gần / xa | — | 18 / 6, đủ động tác, đúng màu | ảnh `output/nhanvat/perf/ganLod3-3can.png` |

- Lỗi đã gặp khi đo: script đo import `characters.js` không kèm `?t=` của Vite → bản module thứ hai không nhận vị trí camera → mọi người kẹt bậc xa. Đã sửa script (import đúng URL game đang dùng); game không bị.

### Chưa đạt (LOD)
- ~~Bản xa master 7,7k / bà áo đỏ 5,9k~~ → chuyển sang màu đỉnh: 4 000 / 3 994 tam giác (§10).
- Chưa có bậc thứ ba (vật thể thay thế / ảnh chụp) cho người > 60 m; chưa gộp hoạt ảnh các người ở xa (mỗi người vẫn một mixer, chỉ thưa nhịp 2–4 khung).
- Đổi bậc tức thì (không mờ chéo) — đã đo (§10): chênh điểm ảnh lúc đổi bậc ≈ chênh do lùi 0,6 m cùng bậc → không cần mờ chéo.

## 10. Hoàn thiện (2026-11-19): chớp mắt, bỏ emissive, bản xa 4k, chào / vẫy hero_f, kiểm đổi bậc

### 10.1 Chớp mắt (shader mí)
- Model Meshy không có mí / blendshape → shader phủ «mí» lên vùng mắt theo UV (`characters.js` `EYES_RAW`, `hq_lid`).
- Đo mắt: `scripts/nhanvat-face.mjs` chụp chính diện đầu (lưới 5 %) → đọc tâm / góc ngoài / mí trên trên ảnh →
  `scripts/nhanvat-eyes.mjs` bắn lưới 7×7 tia quanh mắt, giữ điểm cùng độ sâu (±2 cm, bỏ tóc mái) và cùng mảnh UV,
  khớp bình phương tối thiểu → tâm UV + trục a (góc mắt), b (mí trên). Kiểm trên texture: `scripts/nhanvat-eyetex.mjs` → `output/nhanvat/eyes/tex-<id>.png`.
- Mí: toạ độ mắt q = [a b]⁻¹(uv − c); vùng elip 1,3 × 1,7; mép mí trượt từ +1,7 xuống −1,35, cong theo q.x²;
  màu = trung bình 4 điểm da **gò má dưới mắt** (trên mắt hay dính mi / lông mày; hero_f phía trên là mảnh UV khác);
  mép mí sẫm 0,28 như hàng mi; dưới mí dùng pháp tuyến phẳng + độ nhám 0,6 (normal map nhãn cầu làm hiện viền mắt).
- Nhịp: 2,5–6,5 s / lần, 15 % chớp đôi; khép 70 ms · giữ 40 ms · mở 150 ms. Chỉ lưới gần (≤ 15–18 m); mỗi nhân vật một bản sao vật liệu (cùng chương trình shader, riêng `uBlink`).
- Kiểm (`scripts/nhanvat-blink.mjs`, trong game, 8 nhân vật bậc gần): ảnh mí 0 / 0,5 / 1 `output/nhanvat/blink/sheet.jpg` — cả 8 khép kín ở 1;
  đếm chớp 20 s: 4–6 lần / người (≈ 3,3–5 s / lần) ✔ (đích 3–6 s).

### 10.2 Bỏ emissive Meshy
- 4 model cộng đồng (hero_m, npc_lao, npc_ba, npc_nu) xuất `emissiveTexture` = chính texture màu, `emissiveFactor` 1 → tự sáng:
  phẳng bệt, 21 giờ vẫn sáng như ban ngày, áo nhuộm lộ màu gốc (vệt lam ở hero_m trước đây là do đây), mắt hiện xuyên mí.
- `charMaterial` bỏ emissive cho mọi nhân vật. Ảnh trước / sau 10 giờ và 21 giờ: `output/nhanvat/light/so-sanh.jpg` (`scripts/nhanvat-light.mjs`, `EMIS=1` = trước).

### 10.3 Bản xa master / bà áo đỏ
- Chuyển sang màu đỉnh (`lodVc`): master 7 714 → **4 000**, npc_villager 5 875 → **3 994** tam giác; 0,49 + 0,50 → 0,24 + 0,28 MB.
  Bản xa cũ của bà áo đỏ có vệt trắng trên áo — bản mới hết. Ảnh gần / xa cũ / xa mới: `output/nhanvat/lodcmp2/look/cmp.jpg`.
- Tải đầu 8 nhân vật (bản xa): 3,31 → **2,83 MB**.

### 10.4 Cúi chào / vẫy cho hero_f
- `nv.pack` thêm tuỳ chọn `{ arms }`: tay (vai → ngón) lấy theo clip idle, trộn `arms` phần clip gốc.
  hero_f: `bow` arms 0 (thân gập, tay giữ như lúc đứng), `wave` arms 0,45. Tay áo không bị kéo: `output/nhanvat/test/hero_f-chao.jpg`.
  Dùng cho biểu cảm 🙇 / 👋 của người chơi nữ (`render3d.js` gọi `play('bow' | 'wave')`).

### 10.5 Kiểm đổi bậc LOD (`scripts/nhanvat-lodswitch.mjs`)
- 8 nhân vật lùi 10 → 22 m rồi tiến 22 → 10 m, bước 0,2 m (121 bước × 8): **0** khung trống hình / chồng hai bậc;
  mỗi người đổi bậc đúng 1 lần mỗi chiều (xa ở 18,05–18,19 m, gần ở 14,90–14,97 m) — không nhấp nháy.
- Chênh điểm ảnh ngay trước / sau đổi bậc: 1,80 (lùi) / 2,28 (tiến) trên 255; đối chứng cùng bậc lùi 0,6 m: 1,50 → đổi bậc gần như không thấy; chưa cần mờ chéo.

### 10.6 Số đo (headless, phố city4, 24 người)
| Đo | Kết quả |
|---|---|
| Tam giác 24 người ở 20–32 m: không LOD / có LOD | 132 205 / **37 699** (−71,5 %; trước §10: 43 294) |
| Lệnh vẽ vòng gần (18 bậc gần, có bản sao vật liệu chớp mắt) / vòng xa | 814 / 824 — bản sao vật liệu không thêm lệnh vẽ |
| Chương trình shader | 324–328 (không tăng theo số nhân vật) |
| FPS | dao động ±30 % giữa các lượt headless trong phiên này (phố trống 21,2–38,6) → không dùng để so; số FPS đáng tin là cặp đo liền nhau ở §9 |

### 10.7 Chưa đạt / chưa làm (§10)
- Mí là phủ màu theo UV, không có khối: nhìn rất gần (mặt > 150 px) thấy viền elip mờ ở npc_villager / npc_nu; ở khoảng cách chơi bình thường (≤ 15 m, mặt 20–60 px) không thấy.
- Chưa có liếc mắt / nhìn theo người chơi.
- ~~Thư viện preset Meshy chưa dùng~~ → đã dùng (§11).
- master / villager / merchant vẫn lưới cũ mặt gãy góc (goal 3 §8).
- `npc_villager` (nữ) vẫn đóng vai nam ở `render3d.js` chủ đò / `mansions.js` — file do phiên khác giữ.

## 11. Thư viện preset Meshy (2026-11-19, goal 4 §8)

### Nguồn và chi phí
- Meshy web app, `Animate`: gắn xương model «Elder T-POSE» trong workspace (task `01a1f1cb…`, 103,8k mặt, Humanoid, mốc háng kéo xuống 47 % chiều cao)
  → **0 credit**; thêm 29 preset → **0 credit** (số dư 7 → 57: được cộng, không bị trừ). Giấy phép task: `cc0`.
- Giới hạn: nút Download chỉ lấy 20 preset thêm gần nhất → lấy thẳng `animationGlbUrl` từng preset trong JSON task (đã ký, hết hạn 2026-11-21):
  `assets-meshy/library/chars/preset/<Tên>.glb` (chỉ xương + clip, 18,7 MB tổng) + `_armature.glb` (khung có da, để lấy tư thế gắn da).
- Khung preset là Mixamo 66 xương (`mixamorig:*`) → `tools/nhanvat.js` `loadPreset` đổi tên về MeshyRig (Spine1→Spine01, Spine2→Spine02, Neck→neck, HeadTop_End→head_end;
  ngón tay bỏ) rồi `nv.bake` như cũ. Bảng ảnh 29 preset trên hero_m: `output/nhanvat/preset/sheet.jpg` (`scripts/nhanvat-preset-test.mjs`).

### Chọn (theo ảnh)
| Nhóm | Tên trong game ← preset | Ai có |
|---|---|---|
| Kiểu đứng | idle4 ← Idle_3, idle5 ← Idle_4, idle6 ← Idle_6, idle7 ← Idle_7, breathe ← Long_Breathe_and_Look_Around, breathe2 ← Short_Breathe…, sway ← Happy_Sway_Standing | mọi người (Thầy không có sway) |
| Cử chỉ (một lần) | agree, scratch, hip, listen, shrug, pickup ← Agree_Gesture, Confused_Scratch, Hand_on_Hip_Gesture, Listening_Gesture, Shrug, Male_Bend_Over_Pick_Up; rub ← Scheming_Hand_Rub | NPC; Thầy chỉ agree / listen; rub chỉ người buôn; hero_f không (tay áo) |
| Kiểu đi | walk5 ← Discuss_While_Moving; walk4 ← Elderly_Shaky_Walk | mọi người; walk4 chỉ lão nông / bà lão (60 % chọn) |
- Bỏ: Idle_02 / Idle_03 (trùng clip đã có), Idle_5 / Idle_8 (thế võ), Carry_Heavy / Carry_Water / Female_Pick_Fruit (tay ôm vật vô hình),
  Dozing_Elderly / Sit_and_Drink (ngồi lơ lửng, cần ghế), Gentlemans_Bow (chào kiểu Tây, chéo chân). Đã tải, chưa nối: Pull_Radish, Sit_Cross_Legged_on_Floor (cần chỗ đứng riêng: ruộng, thiền đài).
- Kiểm trên model dễ vỡ: `output/nhanvat/preset/{hero_f,npc_ba,master,npc_merchant}.jpg` — không vỡ tay áo, không vặn khớp.
  Thầy xoè bàn tay ngửa ở mọi clip — có sẵn ở clip gốc (`master-goc.jpg`), do khung xương model cũ.

### Đóng gói (`node scripts/nhanvat-pack.mjs --anim`)
- `<id>.anim.glb`: chỉ nút xương + clip (bỏ lưới / da / vật liệu), `resample 0.002`, meshopt: 0,13–0,26 MB / nhân vật, **1,86 MB** tổng.
- Tải **sau khi vào game** (`enableHd` → `afterStart`, mọi chất lượng máy), gắn vào cùng mixer theo tên xương → tải đầu không đổi (2,83 MB).
- `characters.js`: thêm vào `IDLE_V` / `WALK_V` / `GEST_X`; mỗi lần vào clip lặp bắt đầu ở pha ngẫu nhiên; kiểu đứng chạy nhịp riêng 0,88–1,12× mỗi người;
  về «idle» gốc 25 % (trước 45 %).

### Số đo (`scripts/nhanvat-dongtac.mjs`: 12 người, mẫu 0,5 s × 90 s)
| Đo | Trước sửa pha / tỉ lệ | Sau |
|---|---|---|
| Động tác mỗi nhân vật | 16 | 29–31 (Thầy, hero_f: 20) ✔ (đích ≥ 26) |
| Clip khác nhau thấy trong 90 s | — | 20 |
| % thời gian ở «idle» gốc | 43 % | 28 % |
| Cặp người cùng clip / khung (66 cặp) | 14,9 | 7,1 |
| Cặp cùng clip lệch pha < 0,3 s / khung | 1,68 | 0,81 (≈ mức ngẫu nhiên) |
| Cử chỉ xuất hiện trong 90 s | 6 | 9 (6 loại) |
- Ảnh: `output/nhanvat/dongtac/2.png`. Lệnh vẽ / tam giác không đổi (động tác không thêm lưới). FPS headless lượt này dao động mạnh (phố trống 19–38) — không dùng để so.

### Chưa đạt / chưa làm (§11)
- Tiêu chí cũ «không hai người cùng động tác trong khung 12 người» không đạt và không thực tế (20 clip cho 12 người luôn có trùng);
  thay bằng «không cử động khớp nhau»: cặp trùng pha nay ở mức ngẫu nhiên và trôi lệch nhờ nhịp riêng.
- Chưa nối Pull_Radish (ruộng), Sit_Cross_Legged_on_Floor (thiền); gánh nước / vác đồ cần đạo cụ trên tay.
- Liên kết tải preset hết hạn 2026-11-21; file đã lưu cục bộ (git-ignore). Lần sau cần thêm preset: vào lại task trong workspace.
