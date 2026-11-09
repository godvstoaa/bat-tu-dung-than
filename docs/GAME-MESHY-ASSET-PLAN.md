# KẾ HOẠCH TÀI NGUYÊN 3D MESHY — Huyền Quán

> Nguyên tắc chủ dự án: **HẠN CHẾ TẠO MỚI trên Meshy — chỉ TẢI VỀ model có sẵn.**
> Ngày lập: 05-11-2026. Kiểm thực bằng lệnh thật trong session này (xem phần bằng chứng).

## 1. Đã có trong repo

Đếm bằng `ls public/models/*.glb | wc -l` → **94 file GLB**, đối chiếu ra **48 id model**, kiểm tra
magic bytes `glTF` trên cả 94 file → **0 file hỏng/empty**.

| Nhóm | Id | File trên đĩa | Nguồn gốc đã lưu trong repo |
|---|---|---|---|
| Meshy gen (manifest) | 31 id: `hero_m`, `hero_f`, `master`, `npc_villager`, `npc_merchant`, `hall_main`, `gate_sect`, `library_tower`, `tea_pavilion`, `house_town`, `bridge_arch`, `observatory`, `luopan_stand`, `cauldron`, `scholar_desk`, `flying_sword`, `boat`, `tree_pine`, `tree_peach`, `rock_island`, `palace_grand`, `tower_nine`, `sect_gate_grand`, `cliff_palace`, `city_gate`, `sky_palace`, `deity_yuanshi`, `deity_lingbao`, `deity_daode`, `deity_wenchang`, `deity_doumu` | 1 file `<id>.glb` mỗi id (6 id «trùm» có thêm `.hd.glb` + `.lod.glb`) | `assets-meshy/manifest.json` (31 id, prompt gốc) + `assets-meshy/state.json` (67 task id Meshy: preview/refine/rig) + `assets-meshy/raw/*.glb` (31 bản gốc) |
| Thư viện cộng đồng CC0 | 17 id `lib_`: `lib_blossom`, `lib_bonsai`, `lib_bookshelf`, `lib_cart`, `lib_courtyard`, `lib_garden_pav`, `lib_horse`, `lib_lantern`, `lib_mtn_house`, `lib_pagoda5`, `lib_pagoda_red`, `lib_paifang`, `lib_pavilion2`, `lib_stall_timber`, `lib_stone_bridge`, `lib_willow`, `lib_wood_pavilion` | mỗi id 3 file: `.glb` + `.hd.glb` + `.lod.glb` (đóng gói bởi `scripts/meshy-pack-library.mjs`) | `assets-meshy/library/*.glb` (17 bản gốc CC0) |

Phép cộng: 48 file base + 6 × 2 (HD) + 17 × 2 (lib hd/lod) = **94** — khớp chính xác số file đếm được.

Quy ước nạp: `src/game/assets.js:17` định nghĩa `HD_IDS` (6 công trình trùm), `src/game/assets.js:19`
`hasLod` = HD_IDS ∪ prefix `lib_`, `src/game/assets.js:23` `modelUrl(id)` → `models/<id>.glb`
(theo `document.baseURI`, tức `public/models/`).

## 2. Còn thiếu

**KHÔNG THIẾU file nào.** Kiểm thực (đã chạy trong session này):

- Đối chiếu 31 id trong `assets-meshy/manifest.json` với file `public/models/<id>.glb` → thiếu 0.
- Đối chiếu tổng 48 id (manifest + `assets-meshy/library/` + id tham chiếu trực tiếp trong code game
  qua `placeModel|instanceModel|loadModel`, gồm cả 5 `deity_*` của module `thaitue.js`) với bộ file
  theo quy tắc hd/lib = 3 file, còn lại = 1 file → thiếu 0.
- Cross-check `assets-meshy/state.json` (67 task id) vs list API Meshy (GET, đọc-only): 62 task id
  khớp tài khoản; 5 id còn lại là task **rigging/animation v1** (endpoint `/openapi/v1/rigging` +
  `/openapi/v1/animations`, không nằm trong list v2 text-to-3d) — không phải model thiếu.

Kết luận: **không cần tải thêm, không cần tạo thêm bất cứ model nào.**

## 3. Cách tải về (không tạo mới)

API key ĐÃ CÓ sẵn: biến `MESHY_API_KEY` trong `.env.meshy` (git bỏ qua — script
`scripts/meshy-gen.mjs:15-21` đọc từ file này). Các bước khi cần tải lại, chỉ dùng GET:

1. **Xem số credit còn lại** (GET, miễn phí):
   `node scripts/meshy-gen.mjs balance` (→ `scripts/meshy-gen.mjs:156` gọi GET `/openapi/v1/balance`).
   Session này đã chạy trực tiếp GET đó: tài khoản còn **7 credit** — đủ để KHÔNG đụng vào.
2. **Liệt kê task đã có** (GET, miễn phí — không tạo gì):
   GET `https://api.meshy.ai/openapi/v2/text-to-3d?page=1&page_size=100` (mảng task trực tiếp;
   mỗi task `status: "SUCCEEDED"` có `model_urls.glb`). Session này đã liệt kê: **64/64 task SUCCEEDED,
   đủ 64 GLB khả dụng** trong thư viện tài khoản.
3. **Tải GLB về repo** (GET URL đã ký, miễn phí): `node scripts/meshy-gen.mjs download <id…|all>`
   (script `scripts/meshy-gen.mjs` chỉ GET task + tải `model_urls.glb` về `assets-meshy/raw/`).
   Sau đó chạy `node scripts/meshy-pack.mjs <id…>` để nén vào `public/models/<id>.glb`.
4. **Model thư viện CC0**: tải tay từ meshy.ai (trang chủ đang mở) → đặt file vào
   `assets-meshy/library/<tên>.glb` → chạy `node scripts/meshy-pack-library.mjs <tên>`
   → sinh `public/models/lib_<tên>.glb` + `.hd.glb` + `.lod.glb`.

⚠️ Nếu chủ dự án tải thủ công trên meshy.ai: **tên file phải khớp đúng id trong
`assets-meshy/manifest.json` / quy ước `assets.js`** — lưu thành
`public/models/<id>.glb` (hoặc `lib_<tên>.glb` cho model thư viện); sai tên → game rơi về mô hình
procedural vì `loadModel` bắt lỗi trả `null` (`src/game/assets.js:35`).

## 4. Không làm gì tốn credit

- **CẤM chạy** `preview`, `refine`, `rig`, `animate` của `scripts/meshy-gen.mjs` — các lệnh này POST
  (`scripts/meshy-gen.mjs:69,104,130,149`) và trừ credit (20/10/5/3). Session này KHÔNG chạy bất kỳ
  lệnh POST nào; chỉ dùng GET (balance + list).
- **CẤM gọi endpoint tạo/generate mới** (`POST /openapi/v2/text-to-3d`, `/openapi/v1/rigging`,
  `/openapi/v1/animations`). Kho đã đủ 94 file / 48 id — mọi nhu cầu 3D mới ưu tiên:
  (a) tải lại GLB có sẵn trong thư viện tài khoản (GET, free), (b) tái dùng model `lib_` CC0,
  (c) mô hình procedural của engine khi thiếu (`assets.js` fallback về procedural khi không có file).
- Không in/bundle key: key chỉ nằm trong `.env.meshy`, không bao giờ đưa vào bundle game
  (đúng ghi chú `scripts/meshy-gen.mjs:3`).

## Bằng chứng kiểm thực (đã chạy trong session này)

| Lệnh | Kết quả |
|---|---|
| `find public -iname "*.glb" -o -iname "*.gltf"` | 94 đường dẫn, tất cả trong `public/models/` (0 `.gltf`) |
| `ls public/models/*.glb \| wc -l` | `94` |
| node đối chiếu manifest/state/lib ↔ file | `total ids checked: 48 \| ids thiếu file: 0` |
| `grep MESHY_API_KEY .env.meshy` (chỉ tên biến + độ dài giá trị, không in giá trị) | tồn tại, giá trị 40 ký tự, prefix `msy` |
| GET `https://api.meshy.ai/openapi/v1/balance` | HTTP 200, `balance: 7` |
| GET `https://api.meshy.ai/openapi/v2/text-to-3d?page=1&page_size=100` | 64 task, 64 SUCCEEDED, 64 có GLB |
| node kiểm magic bytes cả 94 file | `checked: 94 files — corrupt/empty: 0` |
