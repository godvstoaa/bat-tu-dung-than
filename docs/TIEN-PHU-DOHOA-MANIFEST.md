# TIÊN PHỦ — MANIFEST ĐỒ HOẠ (cây cỏ · đèn · đá · nội thất)

Viết trước khi dựng, theo `~/.claude/rule.md §2`. Lệch khỏi đây thì sửa manifest trước, ghi lý do.

**Phản hồi người chơi (2026-11-17):** «tất cả các chi tiết từ cây cỏ, đèn đường đến nội thất bên trong đều xấu không tả được».

**Hiện trạng đo được:** 630 cây mỗi phủ đều là khối thủ tục: nón, cầu, hộp (`archkit-style.styledTree`). Tương tự cho:
- 111–113 đèn (`lampGeo`, hộp + trụ);
- 24 đá (khối 12 mặt);
- nội thất 10 tầng lầu và 10 sảnh (`themes.js`): ghế, bàn, tủ, giường, bình đều ghép từ hộp và trụ.

Trong khi đó kho có hơn 500 model, phần lớn chưa dùng.

## 1. Nghiên cứu

| Nguồn | Học được → quy tắc |
|---|---|
| [Plants in Cuijin Garden — Bảo tàng Cung Vương Phủ](http://en.pgm.org.cn/2018-08/20/c_759285.htm), [Visit Beijing](https://english.visitbeijing.com.cn/article/47OOq3u1cnS) | Thông rậm ở sườn bắc núi chính; du quanh ao Bức (hồ «tiền rơi»); hải đường cổ một cặp giữa sân chính; tử đằng 200 năm; núi giả đá Thái Hồ, đỉnh Độc Lạc 5 m ngay sau cổng. → **Thông dồn về phía sau phủ (toạ sơn). Cây hoa đặt từng CẶP đối xứng trước sảnh. Cây rủ (liễu, tử đằng) đặt ven nước.** |
| [Hall of Supreme Harmony (Baidu Baike)](https://baike.baidu.com/en/item/Hall%20of%20Supreme%20Harmony/928764), [Palace of Heavenly Purity](https://www.travelchinaguide.com/attraction/beijing/forbidden/celestial_palace.htm), [The Main Hall — Artron](https://m-news.artron.net/news/20250419/n126828.html) | Ngai đặt trên bục ở gian giữa, trục chính; sau ngai là bình phong lớn; trước ngai bày từng cặp: hạc, lư hương, voi báu. Sảnh nhà quyền quý: ghế và bàn trà nhỏ (trà kỷ) xếp đối xứng hai bên, trà kỷ kẹp giữa mỗi cặp ghế; hai bên phía trước có giá trưng bày, kệ hoa. → **Đại Sảnh: ngai + bình phong sau ngai, hai dãy «ghế–trà kỷ–ghế», bình cao từng cặp.** |
| [Stone lantern — Wikipedia](https://en.wikipedia.org/wiki/Stone_lantern), [Zentner — ishidōrō](https://zentnercollection.com/japanese-stone-lanterns/) | Đèn đá vốn soi lối trong chùa. Đặt ở khúc quanh lối, cạnh nước, chỗ chuyển vùng, không đặt chính giữa; cách bồn nước 1–2 m. → **Phủ Á Đông: đèn đá thật thay đèn hộp, giữ vị trí dọc lối hiện có (khoảng 10–19 m một cây).** |
| `docs/CAY-QUAN-MANIFEST.md` (đã làm cho phố) | Model cây bonsai-dáng phải «cây hoá»: thu thân về tâm, nâng tán (thin 0,6–0,65, lift 0,34–0,36), nếu không thì phóng lên 6 m thành bonsai khổng lồ gốc to. → **Dùng cùng kỹ thuật, viết riêng cho tiên phủ** (`citydress3d.js` đang có phiên khác sửa). |
| **Kho model, đã chụp bảng ảnh xem từng cái** (`$TEMP/tpg/g1.png`, `g2.png`) | **Tốt:** `tree_peach` (đào hồng), `lib_blossom` (mai trắng hồng), `lib_willow` (liễu rủ), `lib_bonsai` (tùng uốn), `lib_lib_tree_broad3d` (lá rộng), `lib_lib_flower_meadow`, `lib_lib_shrub_under`, `lib_lib_rock_boulder`, `pr_stonelantern`, cùng 15 món `pr_*` (tủ sơn mài, ghế son, ghế thái sư, bàn Minh, bàn tròn, bàn trà, bộ trà, bình phong ×2, bình lam, chum, bình men ngọc, giường, bể cá, tỳ hưu). **Hỏng:** `lib_lib_tree_pine3d`, `peach3d`, `willow3d` (màu nướng của tán = 0, tán đen sì), nên không dùng. |

## 2. Quy tắc (có số đo)

### 2.1 Cây — 630 / phủ, giữ nguyên vị trí theo `plan.plantTrees`

| Loài trong plan | Model | Cao (m) | Cây hoá | Màu tán |
|---|---|---|---|---|
| pine | `lib_bonsai` | 7–10 | thin 0,6 · lift 0,34 | gốc |
| peach, plum, sakura, camellia | `tree_peach` | 4,5–6 | 0,65 · 0,34 | hồng gốc |
| plum (Huế), osmanthus, magnolia, frangi | `lib_blossom` | 4,5–6,5 | 0,65 · 0,34 | trắng hồng gốc |
| jacaranda | `lib_blossom` | 5–7 | 0,65 · 0,34 | nhuộm tím #8a6ad0 |
| willow | `lib_willow` | 6–8,5 | 0,6 · 0,36 | #8fb35a (model gốc ô-liu đục) |
| wisteria | `lib_willow` | 4,5–6 | 0,6 · 0,36 | nhuộm tím #a58ad8 |
| ginkgo, maple, birch | `lib_blossom` | 5,5–9,5 | 0,65 · 0,34 | ginkgo #d8c84a · maple #c8452a · birch #9cc46a |
| olive | `tree_peach` | 5–6,5 | 0,65 · 0,34 | #8fa07a |
| banyan | `lib_willow` | 8–10,5 | 0,6 · 0,36 | #4f7a3a |

*Lệch so với bản đầu, đã sửa:* ban đầu dùng `lib_lib_tree_broad3d` cho cây lá rộng. Ảnh lần 2 cho thấy lá thẻ phẳng của model này trông như cắm giấy, nên đổi sang model lá chùm nhuộm màu.
| cypress | thủ tục mới trong flora.js (ngọn lửa 6 múi gồ, thân) | 6–9 | — | #2f5e34 ± nhiễu |
| hedge | thủ tục mới (khối bo góc r 0,18, mặt gồ ±6 %) | 1,1–1,4 (rộng 1,5 × cao) | — | #3f7a3a ± nhiễu |
| palm, bamboo | thủ tục cũ (chưa có model) | — | — | **mục tiêu G-DH2** |

**Bậc chi tiết:**
- ≤ 55 m: bản `.vc` (~4–5k tam giác, cây lá rộng 850).
- 55–240 m: bản `.vc2` (~1k). (Bản đầu 300 m; đo fps −17 % nên hạ, sương đã che.)
- Xa hơn: ẩn.
- Chỉ bậc gần đổ bóng.

**Mùa (tuỳ biến `season`):** nhuộm đỉnh tán theo mặt nạ «lá» (sáng > 0,45 hoặc sắc lục), thân giữ nguyên.
- Xuân: #f2a6c0
- Thu: #d0602a
- Đông: #eef2f4

**Va chạm:** trụ thân ẩn, bán kính 0,18–0,4 m (= 0,045 × cao), cao 2,2 m, đặt trong lớp `proxy` của voxel. Tán cây không chặn.

### 2.2 Cỏ hoa, bụi (thêm mới, tất định, RNG riêng nên không đổi vị trí cây / đèn cũ)
- **Hoa** `lib_lib_flower_meadow`, cao 0,5–0,75 m: viền hai bên mọi lối lát, cách mép 0,7 m, mỗi 1,6 m. Thêm 2 khóm quanh mỗi cây hoa. Trần **1.800 khóm / phủ** (sửa sau ảnh lần 1: 2,5 m / 0,35–0,55 m quá thưa, quá nhỏ, nhìn không thấy).
- **Bụi** `lib_lib_shrub_under`, cao 0,6–1,1 m: 1 khóm quanh mỗi cây thứ ba, lệch 1,4–2,2 m. Trần **400 / phủ**.
- Tránh nước, công trình, cổng (dùng `blockers`). Không va chạm, vì cao dưới tầm thân hoặc mềm.

### 2.3 Đèn, đá
- **Đèn đá** `pr_stonelantern`, cao 2,0 m, chân 0,8 × 0,8: dùng cho đèn phong cách `palace`, `toro`, `butter`, `thai` (5 phủ Á Đông) và tuỳ chọn «Đèn đá».
  - Bậc xa `pr_stonelantern.vc2` (rút gọn ~10 %) ngoài 70 m.
  - Phủ Tây (`iron`, `deco`, `classic`, `mughal`) giữ đèn thủ tục hợp phong cách, xem G-DH2.
- **Đèn lồng đỏ** (tuỳ chọn «Đèn lồng đỏ»): cột gỗ son 2,8 m có tay vươn, treo `lib_lantern` cao 0,75 m.
- **Đá** `lib_lib_rock_boulder`: thay khối 12 mặt, rộng = 2 × r. Khối va chạm theo r.

### 2.4 Nội thất — 5 phủ Á Đông (trunghoa, nhatban, taytang, hue, thai) và cả 10 sảnh của chúng

| Món thủ tục cũ | Model | Kích thước |
|---|---|---|
| ngai | `pr_chair` (thái sư) | cao 1,5 trên bục |
| bình phong sau ngai / trà thất / tẩm cung | `pr_screen_antique`, `pr_screen_blossom` | cao 2,4 / 2,0 |
| ghế khách | `pr_chair_red` | cao 1,05 |
| bàn trà kẹp giữa cặp ghế (trà kỷ) | `pr_table_long` | cao 0,5 |
| bàn trà thấp + ấm chén | `pr_table_long` + `pr_teaset` | cao 0,45 + 0,3 |
| kệ sách, tủ thuốc, tủ áo | `pr_cabinet`, `pr_cabinet2` | cao 2,0 / 1,7 |
| bàn đọc, hương án | `pr_table_ming` | rộng 2,0 |
| bàn tròn yến | `pr_table_round` | rộng 1,9, 5 ghế son quanh |
| giường màn | `pr_bed` | cao 2,4 |
| bình hoa, vò rượu | `pr_vase_ming`, `pr_jar_porcelain`, `pr_vase_celadon` | cao 1,2–1,6 / 0,9 |
| chậu cây | `lib_bonsai` | cao 1,1 trên đôn đá 0,4 |
| tượng trưng bày (Bảo Khố) | `pr_pixiu` | cao 0,9 trên bệ |
| bể cá (Thiền phòng) | `pr_fishbowl` | cao 0,9 |

- **Giữ thủ tục:** bục ngai, thảm, đỉnh hương, lò đan, nghi khí thiên văn, trống, chuông, bồ đoàn. Kho không có model tương ứng.
- **Phủ Tây và Mughal:** chỉ thay chậu cây, bình, bể cá. Ghế, bàn kiểu Tây chưa có model, xem G-DH2.
- **Va chạm:** hộp ẩn theo kích thước chân đồ (lớp `proxy`).
- **Hiển thị:**
  - Đồ tầng k chỉ hiện khi người chơi ở tầng k hoặc k + 1.
  - Đồ sảnh chỉ hiện khi người chơi ở trong hoặc sát cửa sảnh (0,6 × bán kính sảnh + 6 m). Bản đầu là 40 m, nhưng vỏ sảnh đặc đã che kín nên vẽ thừa.
  - Bên ngoài lầu: không vẽ đồ GLB nào.

## 3. Ngân sách hiệu năng
- Cây trong khung nhìn ở sân giữa phủ: ≤ 900k tam giác (gần ≤ 60 × 5k, xa ≤ 600 × 1k).
- Hoa + bụi ≤ 160k tam giác.
- Đèn ≤ 25 bản gần × 6k = 150k.
- Lệnh vẽ thêm ngoài trời ≤ 40 (mỗi loài × bậc một lệnh; cộng bóng).
- Trong một tầng: ≤ 25 món GLB × 6k ≈ 150k, ≤ 20 lệnh vẽ thêm.
- fps tại sân phủ (Chromium headless, d3d11): không thấp hơn trước quá 15 % (trước: 56 fps).
- Thời gian dựng phủ: không tăng quá 1 s (model nạp bất đồng bộ, đã có sẵn trong bộ đệm).

## 4. Checklist kiểm
- [x] **Ảnh trước / sau** cùng góc máy, khoá giờ 10:00 (`scripts/shot-tienphu.mjs`, `scripts/shot-tienphu-garden.mjs` → `output/tienphu-dohoa/before|after`) cho Quân Thiên, Thương Thiên, Chu Thiên, Huyền Thiên. Bảng ghép: `ss-garden.png`, `ss-interior.png`, `ss-wide.png` (`scripts/compare-sheet.mjs`).
- [x] Không còn cây khối nón / cầu ở 5 phủ Á Đông, trừ tre (bamboo). Bách và giậu đã có dáng thủ tục mới; palm và bamboo chưa thay (G-DH2).
- [x] `probe-tienphu`: lọt ≤ 2 %. `probe-gates`: 36/36. `probe-npc`: xuyên 0.
- [x] Đồ GLB: mọi món cao > 0,3 m và mọi gốc cây «kín», tức không đi vào trong được, đạt 100 % (`scripts/probe-props.mjs`). *Sửa tiêu chí:* bản đầu đòi «chặn ở tâm». Nhưng voxel chỉ ghi vỏ, ruột khối to rỗng mà không tới được, nên tiêu chí đó đo sai câu hỏi.
- [x] Test Node: tienphu 18/18 cùng heaven, mansion, estate, motion, batquai, homes.
- [x] fps, số tam giác, thời gian CPU dựng phủ: ghi ở §5. **Hai mục lệch ngân sách**, ghi rõ ở đó.

## 5. Kết quả (2026-11-17/18)

**Đã thay:**
- **Cây:** 630 cây mỗi phủ dùng model thật qua `tienphu/flora.js`: đào, mai, liễu, tùng, cùng phong, ngân hạnh, ô-liu, bạch dương, đa nhuộm màu.
  - Bách và giậu dựng thủ tục mới.
  - Nhân bản theo ô 80 m có loại theo khung nhìn, 2 bậc chi tiết.
  - Màu mùa nhuộm theo mặt nạ lá.
- **Đèn:** 111 đèn đá thật ở 5 phủ Á Đông. Tuỳ chọn «đèn lồng đỏ» dùng cột son treo đèn lồng thật.
- **Đá:** 24 đá tảng thật.
- **Hoa cỏ:** 578 → khoảng 1.800 khóm hoa viền lối, khoảng 190 khóm bụi.
- **Nội thất:** 10 tầng lầu và 10 sảnh dùng bộ `pr_*` cổ điển (ngai thái sư, bình phong, ghế son, trà kỷ, bàn Minh, bàn tròn yến, tủ sơn mài, giường, bình lam, vò, bể cá, tỳ hưu, chậu tùng).

**Lỗi tìm ra trong lúc làm, đã sửa:**
1. **Tán cây đen sì** (ảnh sau lần 1).
   - Nguyên nhân: vật liệu hai mặt lật pháp tuyến ở mặt sau, mà pháp tuyến tán đã được hướng ra ngoài.
   - Sửa: vá shader không lật.
2. **`voxel.js` bỏ sót tam giác đứng hẹp hơn 0,2 m** (thành trụ nhỏ, chấn song, chân cột mảnh).
   - Nguyên nhân: chỉ lấy mẫu ở hai đầu mút, nơi chiều cao suy biến.
   - Sửa: lấy mẫu thêm tại vị trí của 3 đỉnh.
   - Hệ quả: lọt toàn phủ giảm từ 1,84 % xuống khoảng 0,5 %. Đây cũng là nguồn «lọt chân cột» ghi trong TIEN-PHU-MANIFEST.
3. **Cây lá rộng `lib_lib_tree_broad3d`** có lá thẻ phẳng, trông như cắm giấy. Đổi sang model lá chùm nhuộm màu.
4. **Hoa viền lối = 0 điểm hợp lệ.**
   - Nguyên nhân: danh sách vật cản trồng cây tính cả lối lát cộng lề 1,2 m.
   - Sửa: `freeAt` kiểm lối riêng với lề 0,3 m.

**Đo va chạm (bản cuối):**

| Phép đo | Kết quả |
|---|---|
| Đồ GLB kín | 6.926 / 6.926 |
| Lối cổng | 36 / 36 |
| NPC xuyên | 0 / 672 mẫu |
| Lọt lớn nhất | 0,51 % (trước khi sửa voxel: 1,84 %; mục tiêu ≤ 2 %) |

**Hiệu năng** (Quân Thiên, điểm (0, 120) cục bộ, 10:00, trung vị 5 × 2 s, đo xen kẽ hai bản):
- **fps**, sau khi tối ưu:
  - Bản gốc: 43–46.
  - Bản mới: 37–47, trung bình chênh khoảng −4 % đến −15 % tuỳ lượt. Máy đo dao động mạnh. Ngân sách là −15 %.
- **Các bước tối ưu đã làm:**
  - Cây chia ô có loại theo khung nhìn.
  - Bậc xa vẽ tới 240 m thay vì 300 m.
  - Hoa cắt ở 70 m, bụi ở 90 m (tham số `cut` mới của `assets.instanceModel`).
  - Đồ sảnh chỉ hiện khi ở trong sảnh.
  - Bậc xa cho đèn: `pr_stonelantern.vc2`, 1.348 tam giác so với 6.000.
- **Tam giác trong khung:** bản gốc 1,40 triệu, bản mới 1,48–1,71 triệu.
- **CPU dựng một phủ** (chạy liền, `$TEMP/tpg/buildcpu.mjs`):
  - Job hình: bản gốc 0,47–1,40 s, bản mới 0,32–1,19 s.
  - Job voxel: bản gốc 0,67–1,42 s, bản mới 1,9–3,0 s.
  - **LỆCH ngân sách «không tăng quá 1 s»:** voxel tăng 1,2–1,6 s, do bộ lọc 9 điểm chống kẹt chân bậc (sửa đi xuyên lần 2). Job chia 6 ms / khung nên không khựng, nhưng phủ có va chạm muộn hơn khoảng 1–2 s sau khi dựng. Đã thử 3 cách tối ưu, ghi trong mã. Cách duy nhất giảm được (chỉ hỏi khi khoảng cao ≥ 0,3 m kèm đệm dùng chung) làm hỏng 1 lối cổng, nên bỏ. Xem G-DH4.
- **Ảnh lỗi:** một lần chụp vườn Thương Thiên ra khung đen. Không lỗi trang, chụp lại thì bình thường; ghi nhận là sự cố thoáng qua của trình duyệt headless.

## 6. Goal phát triển
- **G-DH1:** đạt §4. Sau đó báo người chơi kèm ảnh.
- **G-DH2:** model cho cypress, hedge, palm, bamboo, cho đèn và nội thất kiểu Tây / Mughal, để thay nốt đồ thủ tục ở 4 phủ còn lại. Bước kế: tạo model (Meshy theo `scripts/meshy-pack-library.mjs`) hoặc dựng thủ tục chất lượng cao theo ảnh tham chiếu. Tiêu chí: ảnh cận 4 phủ không còn khối nón, hộp.
- **G-DH3:** gió lay tán (shader), như phố. Tiêu chí: ≤ 0,2 ms / khung.
- **G-DH4:** đưa job voxel về ≤ 1,5 s CPU / phủ mà vẫn giữ 36/36 lối cổng và 100 % đồ kín. Hướng: chỉ mục `platformTop` theo ô cho vùng lầu (hàng trăm nền bậc), thay cho quét bucket. Tiêu chí: `buildcpu.mjs`.
- **G-DH5:** sảnh và tầng còn thưa so với diện tích (tầng 1 khoảng 30 × 30 m mà chỉ khoảng 24 món ở giữa). Thêm đồ dọc vách: giá bát bảo, câu đối, tranh treo, kệ hoa. Tiêu chí: ảnh `*-room.png` không còn khoảng sàn trống quá 8 m.

## 7. Deploy

- 2026-11-18: Worker phiên bản `bcb7b8b0-a636-427b-aeb2-e1661761f4bf`, build từ `2832baf4` (gồm `c6d30d72`) trong worktree sạch. Kiểm nhanh trên bản thật đạt. Chưa push.
- Đợt kế tiếp (9 tổng mặt bằng khác nhau) ghi ở [TIEN-PHU-MATBANG-MANIFEST.md](TIEN-PHU-MATBANG-MANIFEST.md), chưa deploy.
