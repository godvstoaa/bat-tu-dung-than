# ĐẠI THẾ GIỚI HUYỀN GIỚI — Prompt · Bộ prompt Meshy · Thiết kế chi tiết · Kế hoạch

> 2026-11-03 · Mở rộng từ yêu cầu chủ dự án: «quy mô to như game tu tiên, gấp 200 lần bản hiện có» + dùng Meshy.ai tạo mô hình 3D.
> Thứ tự làm việc bắt buộc: **(A) prompt → (B) bộ prompt tài sản → (C) thiết kế chi tiết → (D) thực hiện**.
> Kế thừa: `GAME-MMO-PROMPT-PLAN.md` (MMO, iOS, giải án) và `GAME-HUYEN-QUAN-SPEC.md` §9 (phong cách Sơn Mài).

---

> **Cập nhật 2026-11-03:** chủ dự án yêu cầu không bắt chước game khác. Các mục ngự kiếm, cảnh giới tu luyện, `flying_sword` (A, C4, C5) **không làm nữa**; nội dung game lấy từ tính năng app gốc — `docs/GAME-NOI-DUNG-THEO-APP.md`. Thế giới và kiến trúc giữ làm nơi đặt các sảnh nghề.

## PHẦN A — PROMPT TỔNG (dùng cho mọi phiên phát triển thế giới)

```
Bạn là game director + technical artist + kỹ sư chính của «Huyền Giới» — thế giới mở 3D
nhiều người chơi, màn hình dọc, chạy trên web (Three.js) và iOS (Capacitor WKWebView),
dựng trên engine cổ pháp của app Bát Tự (249 module offline) và máy chủ Cloudflare
Durable Objects đã có (worker/quan-room.js).

QUY MÔ
- Thế giới 2048 × 2048 đơn vị (1 đơn vị ≈ 1 m) ≈ 4,2 km² — gấp ~6.000 lần sân Huyền Quán
  cũ (30 × 22 m). Có độ cao (núi tới +420 m, biển mây −60 m), 9 vùng, 4 tông môn trên 4
  ngọn núi, hồ, sông, thác, rừng, đảo nổi trên trời.
- Di chuyển: đi bộ / chạy, NGỰ KIẾM (bay trên kiếm) mở theo cảnh giới, TRẬN PHÁP TRUYỀN
  TỐNG giữa các vùng. Đi bộ xuyên bản đồ ~12 phút, bay ~3 phút — đủ rộng để thấy «to».

CHẤT LƯỢNG HÌNH ẢNH
- Tài sản trọng điểm (nhân vật, kiến trúc, đạo cụ, cây cổ thụ) tạo bằng Meshy.ai theo
  một «kinh thánh phong cách» thống nhất (Phần B), nén cho mobile (≤ 1K texture WebP,
  meshopt), LOD 3 tầng.
- Địa hình, nước, trời, mây, cỏ, rừng xa = procedural trên GPU (shader) để có quy mô
  lớn mà nhẹ: địa hình heightmap chia chunk + LOD, trời tán xạ khí quyển, nước phản
  chiếu Fresnel + bọt, mây biển cuộn, rừng instanced hàng chục nghìn cây, sương núi,
  bloom + tone mapping. 3 mức chất lượng: Thấp (iPhone cũ) / Vừa (iPhone 12+) / Cao (PC).

LÕI GAME GIỮ NGUYÊN, PHÓNG TO
- Giải án (6 bước chấm bằng engine), Án Cổ, MMO (thấy nhau, cử chỉ, giải chung),
  xếp hạng mùa tiết khí, môn phái → nay mỗi môn phái có cả một ngọn núi.
- «Tu luyện» = TU HỌC: cảnh giới tăng theo kỹ năng giải án thật, mở vùng mới và ngự kiếm.
  Không bán cảnh giới, không pay-to-win.

RÀNG BUỘC (giữ từ trước)
- iOS: không màn hình mở đầu, không bói cho bản thân, không hình tượng tôn giáo cụ thể,
  UGC có lọc/báo cáo/chặn, offline vẫn chơi được phần đơn.
- Không chép tài sản/bố cục của game khác. Khoá API chỉ dùng ở script cục bộ, không vào bundle.
- Mỗi hạng mục: test tự động cho luật + kiểm trình duyệt khung 390×844 + đo FPS.
```

---

## PHẦN B — BỘ PROMPT MESHY.AI

### B1. Kinh thánh phong cách (ghép vào cuối MỌI prompt)
> `Stylized East Asian xianxia fantasy, Vietnamese lacquer-art palette: cinnabar red, black lacquer, gold-leaf trim, eggshell white, jade teal accents. Hand-painted PBR textures, clean readable silhouette, game-ready asset, no text, no logos, no religious statues or symbols.`

Nguyên tắc chung:
- Kiến trúc: «Vietnamese-Chinese» (mái cong đầu đao, cột son, ngói ống) — tránh bản sao công trình có thật.
- Không chữ (Meshy vẽ chữ sai) — biển hiệu, chữ Hán làm bằng texture trong game.
- Nhân vật: tư thế A-pose để gắn xương; trang phục áo giao lĩnh/áo dài cổ, không giáp nặng, không vũ khí đẫm máu.

### B2. Danh sách tài sản (ưu tiên từ trên xuống)

| ID | Loại | Prompt chính (tiếng Anh, ≤ 800 ký tự kèm B1) | Poly | Ghi chú |
|---|---|---|---|---|
| `hero_m` | nhân vật | A young male scholar-cultivator, slim build, long black hair in a topknot with a jade hairpin, flowing layered robe with wide sleeves, cinnabar outer robe over cream inner robe, gold embroidered cloud trims, cloth belt with a jade pendant, soft boots, calm expression, full body | 15k | A-pose · rig + đi/chạy/đứng/ngồi/chào |
| `hero_f` | nhân vật | A young female scholar-cultivator, long black hair half-up with a gold phoenix hairpin, flowing layered robe with wide sleeves, jade-teal outer robe over white inner robe, gold cloud embroidery, sash belt, soft shoes, gentle expression, full body | 15k | như trên |
| `master` | nhân vật | An elderly scholar master, long white beard and eyebrows, black lacquer-colored scholar hat, deep indigo robe with gold trim, holding a calligraphy brush, wise and kind, full body | 15k | rig + ngồi viết, gật đầu |
| `npc_villager` | nhân vật | A middle-aged townsfolk in simple brown and cream linen clothing, conical straw hat on back, cloth shoulder bag, friendly, full body | 10k | rig + đứng, vẫy |
| `npc_merchant` | nhân vật | A plump cheerful merchant in mustard-yellow silk robe with red trims, small round hat, holding an abacus, full body | 10k | rig + đứng, gật |
| `hall_main` | kiến trúc | A grand two-tier hall of a mountain academy on a stone platform with stairs, sweeping curved roofs with upturned eaves, dark ceramic roof tiles, cinnabar pillars, black lacquer wooden panels with gold cloud carvings, gold roof ridge ornaments, lanterns hanging at the eaves | 30k | thay Chính Đường procedural |
| `gate_sect` | kiến trúc | A three-bay mountain sect gateway (paifang) of stone and lacquered wood, tiered curved roofs, cinnabar beams, gold trims, stone lion-free base, standing alone | 20k | cổng 4 tông môn (đổi màu) |
| `library_tower` | kiến trúc | A five-storey octagonal library tower, each storey with curved eaves and balconies, cinnabar pillars, black lacquer walls with lattice windows, gold finial on top | 30k | Thư Lâu |
| `tea_pavilion` | kiến trúc | An open waterside tea pavilion on stilts, square plan, four cinnabar pillars, double curved roof, low wooden railing, wooden deck | 15k | Trà Thất / thuỷ tạ |
| `house_town` | kiến trúc | A traditional two-room town house with curved tile roof, wooden walls, round moon window, small porch with lantern | 12k | nhà dân (instanced, đổi màu) |
| `bridge_arch` | kiến trúc | A single-span arched stone bridge with carved railings and small lantern posts | 10k | cầu qua sông |
| `observatory` | kiến trúc | A circular stone observatory terrace on a cliff top with bronze armillary sphere instrument in the center and stone stairs | 20k | Quan Tinh Đài |
| `luopan_stand` | đạo cụ | A large ornate geomancy compass disk with concentric rings mounted on a carved wooden pedestal, gold and black lacquer | 8k | La Bàn Đài |
| `cauldron` | đạo cụ | An ancient bronze tripod cauldron with two handles and cloud relief patterns, green patina, on a stone base | 8k | Lò trầm / luyện đan đài |
| `scholar_desk` | đạo cụ | A low black lacquer scholar desk with scrolls, ink stone, brush holder with brushes, and a small celadon vase | 6k | bàn thầy |
| `flying_sword` | đạo cụ | An elegant straight jian sword, slim blade with faint jade glow, gold guard shaped like clouds, red tassel on the pommel, floating horizontally | 4k | ngự kiếm |
| `boat` | đạo cụ | A small wooden river boat with a curved woven bamboo canopy and a long oar | 6k | hồ / sông |
| `tree_pine` | thiên nhiên | An ancient twisted pine tree with layered flat foliage clouds, gnarled trunk, growing from a rock | 10k | điểm nhấn vách núi |
| `tree_peach` | thiên nhiên | A blossoming peach tree with pink flowers, curved trunk, round canopy | 10k | thành, tông môn |
| `rock_island` | thiên nhiên | A floating rock island chunk with grassy top, a small waterfall pouring off the edge, hanging roots and vines underneath | 20k | đảo nổi |

Ngân sách credit (tài khoản 1.100): 20 tài sản × 30 (preview 20 + refine 10) = 600 · 5 nhân vật × rigging 5 = 25 · động tác ~20 × 3 = 60 → **~685 credit**, dự phòng ~415 cho làm lại / mở rộng.

### B3. Quy trình tạo (script `scripts/meshy-gen.mjs`)
1. **Preview** (meshy-7.1, remesh, `target_polycount` theo bảng, `pose_mode: a-pose` cho nhân vật) — ghi `task_id` vào `assets-meshy/state.json` ngay khi tạo (chạy lại không tạo trùng → không mất credit).
2. Tải ảnh thumbnail về `assets-meshy/thumbs/` → **duyệt bằng mắt** (đúng phong cách? đúng hình? không chữ / không tôn giáo?). Hỏng → sửa prompt, preview lại.
3. **Refine** (`enable_pbr: true`, `texture_resolution: 2k`, cùng prompt phong cách làm `texture_prompt`).
4. Nhân vật: **rigging** + **animation** (đi, chạy, đứng, ngồi, chào).
5. Tải GLB → `public/models/raw/` → nén bằng gltf-transform (texture 1024 WebP, meshopt, bỏ thuộc tính thừa) → `public/models/<id>.glb`; đo kích thước, tam giác.
6. Bản quyền: tài sản tạo bằng gói trả phí của Meshy thuộc người tạo — chủ dự án xác nhận gói đang dùng trước khi phát hành iOS.

---

## PHẦN C — THIẾT KẾ CHI TIẾT

### C1. Bản đồ (2048 × 2048, gốc (0,0) ở giữa, Bắc = −Z)

| Vùng | Tâm (x, z) | Bán kính | Độ cao | Nội dung |
|---|---|---|---|---|
| **Huyền Thành** (khởi đầu) | (0, 0) | 180 | +40 cao nguyên | quảng trường Huyền Quán cũ ở giữa, phố nhà dân, chợ, 3 khách giải án, bảng xếp hạng, trận truyền tống |
| **Tử Bình Phong** (tông môn) | (−620, −560) | 220 | đỉnh +420 | sơn môn đỏ, đại điện trên đỉnh, bậc đá xoắn |
| **Manh Phái Cốc** | (640, −520) | 220 | thung +20, vách +300 | thung lũng sương, thác lớn, động phủ |
| **Trích Thiên Đỉnh** | (−600, 600) | 200 | +380 | đỉnh tuyết, đài ngắm sao, rừng tùng |
| **Cùng Thông Hồ** | (620, 620) | 240 | mặt hồ +10 | hồ lớn, đảo giữa hồ, thuỷ tạ, thuyền |
| **Thư Lâu Lâm** | (0, −700) | 160 | +120 | Tháp Thư Lâu giữa rừng trúc — đọc kinh điển (nối Thư viện 1.583 văn bản) |
| **Phong Thủy Viên** | (−820, 0) | 150 | +60 | thung xếp nhà (mini-game bát trạch / phi tinh, P4) |
| **Lịch Đường** | (820, 0) | 150 | +60 | sân lịch, chọn ngày (P4) |
| **Thiên Bàn Đảo** (trên trời) | (0, 300) | 120 | +520 bay tới | đảo nổi, Thiên Bàn khổng lồ, Án Cổ cao cấp |

- Sông Huyền Hà chảy từ Trích Thiên Đỉnh qua Huyền Thành ra Cùng Thông Hồ; mép bản đồ rơi xuống biển mây (−60), quanh là núi xa dạng thuỷ mặc.
- Đường đá nối thành ↔ các vùng (spline), cây cầu ở chỗ cắt sông.

### C2. Địa hình
- Heightmap 2049² tính bằng hàm noise có hạt giống (fBm + ridged cho núi) **+ dấu ấn vùng** (cao nguyên phẳng cho thành, chóp núi cho tông môn, lòng hồ trũng, lòng sông khắc theo spline). Hàm `heightAt(x, z)` dùng chung cho dựng lưới, va chạm, đặt cây, máy chủ kiểm vị trí.
- Chunk 128 × 128 (16 × 16 chunk), LOD theo khoảng cách: 64 / 32 / 16 / 8 ô mỗi chunk; vá mép bằng «skirt». Dựng lưới trong Web Worker để không giật.
- Chất liệu: shader pha theo độ dốc + độ cao (cỏ → đất → đá → tuyết), texture tile sinh bằng canvas, ánh sáng đổ bóng cascaded đơn giản (1 tầng quanh người chơi).

### C3. Trời · nước · sương · cây
- Trời: shader tán xạ khí quyển (Three `Sky`) + chu kỳ giờ thật đã có; trăng, sao; biển mây = lớp mây cuộn dưới −40.
- Nước: một mặt phẳng lớn cho hồ/biển + dải sông; shader Fresnel, sóng normal cuộn, bọt ven bờ theo độ sâu (so heightmap).
- Rừng: 3 loài procedural instanced (tùng, trúc, cây lá) ~30k cây tầm xa dạng billboard + Meshy cổ thụ làm điểm nhấn gần; cỏ instanced quanh người chơi (bán kính 40).
- Hậu kỳ: bloom nhẹ (đèn lồng, kiếm, Thiên Bàn), tone mapping ACES, sương độ cao. Tắt ở mức Thấp.

### C4. Di chuyển & camera
- Đi bộ trên địa hình (độ dốc > 42° chặn), chạy (giữ joystick ra mép / Shift), nhảy nhẹ.
- **Ngự kiếm** (mở ở cảnh giới Trúc Cơ): bay tự do, độ cao tối thiểu bám địa hình +2, tối đa +600; vệt sáng kiếm; camera kéo xa.
- **Trận truyền tống**: mỗi vùng một trận, chạm → dịch chuyển (mở khi đã tới vùng đó 1 lần).
- Quán cũ: lưới va chạm 20 × 14 giữ nguyên, đặt tại tâm Huyền Thành (toạ độ cục bộ → toàn cục).

### C5. Tu học = cảnh giới

| Cảnh giới | Điều kiện | Mở khoá |
|---|---|---|
| Luyện Khí | mặc định | Huyền Thành, Thư Lâu Lâm |
| Trúc Cơ | 10 án ≥ 60% | **ngự kiếm**, Phong Thủy Viên, Lịch Đường |
| Kim Đan | kỹ năng TB ≥ 70% + 5 Án Cổ | 4 tông môn (gia nhập 1 phái) |
| Nguyên Anh | 30 án + kỹ năng Dụng thần ≥ 80% | Thiên Bàn Đảo, Án Cổ cao cấp |
| Hoá Thần | top 100 một mùa | hào quang, bàn «Thầy đồ» (giải án cho người thật) |

### C6. MMO theo vùng
- Mỗi vùng là một nhóm shard riêng (`town-<vùng>-<n>`), chuyển vùng = đổi socket; toạ độ gói `mv` dùng hệ toàn cục (kiểm bằng biên 2048 + heightmap).
- Chỉ đồng bộ người trong bán kính 120 m (máy chủ lọc), tối đa 60/shard.

### C7. Ngân sách hiệu năng (đo trên iPhone 12, mức Vừa)
- ≤ 250 draw call, ≤ 600k tam giác/khung, texture GPU ≤ 180 MB, 50–60 fps; tải lần đầu Huyền Thành ≤ 8 MB, vùng khác tải lười.
- Tự hạ mức nếu FPS < 35 trong 3 giây.

---

## PHẦN D — KẾ HOẠCH THỰC HIỆN

| Phase | Nội dung | Kiểm |
|---|---|---|
| **W1** | Bộ máy thế giới: `heightAt`, chunk + LOD (worker), shader địa hình, trời tán xạ, nước, rừng instanced, sương, bloom, 3 mức chất lượng; đi bộ trên địa hình; quán đặt giữa Huyền Thành; trận truyền tống thử | FPS, 390×844, test `heightAt` |
| **W2** | Meshy: script tạo + duyệt + nén; thay kiến trúc/nhân vật procedural bằng GLB; LOD + instanced nhà | ảnh chụp từng tài sản, kích thước |
| **W3** | ~~Ngự kiếm + cảnh giới~~ → **đã bỏ (2026-11-03)**: thay bằng sảnh nghề theo engine app — xem `docs/GAME-NOI-DUNG-THEO-APP.md` | test từng sảnh |
| **W4** | 9 vùng đầy đủ + tông môn + MMO theo vùng | 2 trình duyệt khác vùng |
| **W5** | Nối lại P3 (giải chung, xếp hạng mùa, môn phái = núi) | test tích hợp |
| **W6** | Tối ưu iOS + gửi duyệt | build:ios + verify |

---

## PHẦN F — KIẾN TRÚC «TRÙM» (quy mô lớn)

**Mục tiêu:** công trình phải to như núi, nhìn từ xa vài trăm mét vẫn thấy rõ hình bóng, lại gần vẫn đủ chi tiết.

**6 công trình Meshy 4K** (geometry_resolution 4k, ~150k tam giác, texture 4k; prompt trong `assets-meshy/manifest.json`, cờ `hd`):

| id | Đặt ở | Kích thước trong game |
|---|---|---|
| `palace_grand` | Huyền Thành (trục bắc), Manh Phái Cốc, Phong Thủy Viên, Lịch Đường | rộng 92 m × hệ số quần thể |
| `tower_nine` | hai bên đại điện; Tử Bình (80 m); Trích Thiên (110 m); Thư Lâu (112 m) | cao 62–112 m |
| `sect_gate_grand` | cổng mỗi quần thể + sơn môn 4 tông môn | rộng 46–70 m |
| `cliff_palace` | bình đài đỉnh Tử Bình Phong | rộng 170 m |
| `city_gate` | cửa nam tường thành Huyền Thành | rộng 64 m |
| `sky_palace` | Thiên Bàn Đảo (y ≈ 460 m) | rộng 240 m |

**Quần thể** (`landmarks.js`): `terrace()` nền đá 3 tầng + gờ vàng + bậc chính diện, chân đá gồ ghề khi đặt trên sườn; `palaceComplex()` = đại điện + 2 điện phụ + 2 tháp + cổng; Huyền Thành có tường thành vòng R = 158 m (chừa cửa nam), phố nhà dọc hai trục. Mọi công trình đặc đăng ký vật cản (`obstacles.js`), nền đá đăng ký mặt đứng (`platformTop`) để khách đi lên được.

**Địa hình:** đỉnh núi tông môn được san **bình đài** bán kính 125 m (`PEAK_PAD`, `peakPadH`), mép thành vách dựng → cung điện «treo» trên đỉnh.

**3 mức chi tiết mỗi công trình** (`scripts/meshy-pack.mjs` + `scripts/meshy-lod.mjs`):
- `<id>.hd.glb`: texture 2048, chỉ máy mức «high» (bản iOS tự xoá trong `ios-postbuild`).
- `<id>.glb`: texture 1024, điện thoại / mức vừa.
- `<id>.lod.glb`: giản lược ~10% tam giác (meshoptimizer cờ `Permissive` để gộp qua đường nối UV), texture 512, ~0,3 MB; dùng khi xa hơn 2,2 × kích thước công trình (`THREE.LOD` trong `assets.js › placeLod`).

**Ngân sách:** 6 công trình: 4K thô ~222 MB → bản iOS (thường + lod) ~15 MB; `dist-ios/models` 29 MB.

## PHẦN E — NHẬT KÝ TIẾN ĐỘ

### 2026-11-03 — W1 (bộ máy thế giới) + W2 phần lớn (tài sản Meshy)
**Thế giới mở**
- `src/game/terrain.js`: `heightAt` (simplex fBm + ridged + dấu ấn 8 vùng + sông khắc + cao nguyên phẳng + rìa biển mây), `slopeAt`, `walkable` (chặn dốc > 42° và nước sâu), `treeDensity`. 7 test (`scripts/test-terrain.mjs`), 50k lần gọi ≈ 0,3 s.
- `src/game/world3d.js`: 256 chunk 128 m, LOD 64/32/8 ô theo khoảng cách (nâng dần ≤ 6 ms/khung), mẫu thêm viền để pháp tuyến liền mạch giữa chunk, skirt chống nứt; tô màu theo độ cao/độ dốc (cỏ → đất khô → đá → tuyết, cát ven nước, đá lát quanh thành); Sky tán xạ + môi trường PMREM; nước gợn phản chiếu; biển mây 70 mảng; ~4.900 cây (gần: cây 3D instanced ≤ 320, xa: billboard), cây chắn camera tự ẩn.
- `render3d.js`: bloom (mức cao/vừa), 3 mức chất lượng (`localStorage huyenquan:quality`), bóng đổ bám người chơi, camera nhảy khi dịch chuyển xa, kéo xa tới 48 m.
- Đi bộ: cổng tam quan mở ra thế giới; trong sân dùng lưới cũ, ngoài sân đi thẳng theo địa hình; giao thức MMO nhận toạ độ toàn thế giới (±640 ô).

**Tài sản Meshy (20 mô hình, đã nén 126 MB → ~10 MB)**
- `scripts/meshy-gen.mjs` (preview/status/refine/download/rig/animate/reject, ghi task_id ngay → không mất credit khi chạy lại), `scripts/meshy-pack.mjs` (gltf-transform: WebP 1024 + meshopt), `assets-meshy/manifest.json` (prompt + kinh thánh phong cách), ảnh duyệt `assets-meshy/thumbs/`, `contact-sheet.jpg`.
- Duyệt: 18/20 đạt ngay; `npc_villager` (áo hiện đại) và `tree_peach` (đĩa lơ lửng) bị bỏ → sửa prompt → đạt.
- Nhân vật: gắn xương + động tác (đứng, đi, chạy, ngồi, cúi chào, vẫy) — `src/game/characters.js` (đo khung bao theo da: rig Meshy dùng cm ×0.01). Người chơi chọn dáng nam/nữ (cổng + Sổ › Cài đặt), thầy Meshy ngồi bàn (cúi chào khi khách tới), khách giải án là thương nhân/dân làng (vẫy tay khi lại gần), người chơi khác thấy đúng dáng (gói `hello.look`).
- `src/game/landmarks.js`: 26 nhà dân + 2 học viện + đào + đỉnh đồng + 4 đảo nổi ở Huyền Thành; đại điện + rừng tùng cổ thụ ở Tử Bình Phong; đỉnh đồng Manh Phái Cốc; đài quan tinh Trích Thiên Đỉnh; thuỷ tạ + 4 thuyền Cùng Thông Hồ; tháp Thư Lâu + án thư; la bàn Phong Thủy Viên; sơn môn 4 tông môn + Lịch Đường; cầu vòm qua sông. Nạp theo vùng (≤ 800 m).
- Credit: dùng ~730/1.100 (còn ~370).

**Còn lại W2–W4:** thay hẳn Chính Đường trong sân bằng GLB (giữ bàn thầy), đường đá nối vùng, trận truyền tống, ngự kiếm (W3), cảnh giới tu học (W3), MMO theo vùng (W4), đo FPS trên iPhone thật.

### 2026-11-03 — Kiến trúc «trùm» (PHẦN F)
- 6 công trình Meshy 4K (đại điện, tháp chín tầng, sơn môn lớn, cung vách núi, cổng thành, thiên cung) — duyệt preview 6/6 đạt, refine 4K, đóng gói 3 mức chi tiết.
- Bố cục lại toàn thế giới theo quy mô tu tiên: tường thành + phố + quần thể cung điện ở Huyền Thành; bình đài đỉnh núi; thiên cung 240 m trên đảo trời.
- Gỡ lỗi: `render3d.setDebugCam({pos, look})` để chụp cảnh từ bất kỳ đâu.
- Kiểm: test 12+10+7+7 đạt; build iOS + `verify:ios` OK; `verify:ios-path` 15/15.
- Credit Meshy còn 162.

### 2026-11-03 — Model thư viện cộng đồng Meshy (CC0)
- Chủ dự án tự đăng nhập Meshy; tôi lọc kết quả tìm kiếm theo giấy phép CC0, ưu tiên model nặng và nhiều chi tiết nhất, rồi duyệt bằng mắt (bỏ model có chữ, lạc chủ đề, chưa có texture). Tải 17 model, ~2,6 GB gốc. Danh sách và nguồn: `docs/MESHY-LIBRARY-CC0.md`.
- Cách lấy file: hộp tải của trang chỉ để bắt link GLB ký sẵn (đã chặn hộp Save của hệ điều hành); file tải bằng curl về `assets-meshy/library/` (không lên git).
- Đóng gói `scripts/meshy-pack-library.mjs` → `lib_<tên>` 3 mức: hd ~300k mặt/2048 · thường ~80k/1024 · lod ~12k/512. `scripts/meshy-lod.mjs` nhận `t:<số tam giác>`. `assets.js › hasLod()` áp LOD cho mọi `lib_*`; khoảng đổi LOD tối thiểu 45 m.
- Đặt vào thế giới (`landmarks.js`): phố chợ đại lộ Nam (quầy chợ, cột đèn lồng 12 m/cột, cổng chào), nhà vườn vành thành, tháp đỏ + đình hai tầng hai góc Bắc thành, đào hoa; mỗi sảnh nghề có mái đình gỗ, bonsai, cột đèn, trạm xe kiệu + ngựa; Thư Lâu thêm tủ sách; Cùng Thông Hồ thêm đình vườn, liễu và đào quanh hồ; Trích Thiên thêm tháp năm tầng; nhà trên núi ở chân Tử Bình; cầu đá thay cầu cũ.
- **Giảm đa giác đúng cách (bài học):** giản lược tại chỗ kiểu «Permissive» (gộp qua đường nối UV) làm texture kéo sọc rõ, kể cả ở 300k. Hiện dùng:
  1. Model đạt được mức đích mà vẫn giữ đường nối UV (`meshy-lod.mjs keepuv`): bookshelf, courtyard, horse, lantern, paifang, stall_timber, stone_bridge, wood_pavilion, cart.
  2. Model nhiều đảo UV nhỏ, sàn giữ-UV quá cao (0,8–2,5 triệu mặt): dựng lại lưới bằng **Meshy Remesh API** (`scripts/meshy-remesh.mjs`, 5 credit/lượt, texture nướng lại sạch) ở 80k và 300k: pavilion2, garden_pav, pagoda5, pagoda_red, mtn_house, willow, blossom, bonsai (bonsai đổi sang «Twisted bonsai juniper tree» CC0 vì file gốc cũ 405 MB vượt giới hạn 400 MB của API).
  3. Bản `.lod` (nhìn xa) vẫn gộp mạnh, chỉ bật khi xa ≥ 80 m hoặc 4× kích thước (`assets.js › placeLod`).
- Gói tài khoản Meshy giới hạn số tác vụ chờ → `meshy-remesh.mjs` tự đợi và gửi lại khi gặp 429; bỏ qua bản đã có.
