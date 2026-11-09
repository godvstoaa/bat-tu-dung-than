# 13.10 · Đường ống tài sản 3D

> Mô tả đường ống hiện có (Meshy + thư viện CC0 + gltf-transform), quy ước đặt tên, ngân sách theo lớp tài sản, chi phí credit, giấy phép, và những thay đổi cần cho công trình đi vào được (phần 06) và thế giới 4,6 km (phần 07). Ngân sách hiệu năng tổng ở phần 09.

## 1. Sơ đồ đường ống hiện tại

```
assets-meshy/manifest.json  (31 tài sản: id, kind, poly, prompt, style, hd, anims, height, model)
   │
   ├─ Tạo mới (Meshy text-to-3D) ─ scripts/meshy-gen.mjs
   │     preview ──▶ status (tải thumbnail) ──▶ duyệt bằng mắt (contact sheet) ──▶ reject? ──▶ preview lại
   │                                                   └─▶ refine (PBR) ──▶ download ──▶ assets-meshy/raw/<id>.glb
   │     nhân vật: refine ──▶ rig ──▶ animate (gộp động tác) ──▶ tải GLB có xương
   │
   ├─ Thư viện cộng đồng CC0 (tải tay) ─ assets-meshy/library/<tên>.glb (+ LICENSES.md, links.json)
   │     tùy chọn: scripts/meshy-remesh.mjs <tên> <số mặt> ──▶ library/remesh/<tên>.<số mặt>.glb
   │
   └─ Đóng gói
         scripts/meshy-pack.mjs [id…]         raw ──▶ public/models/<id>.glb (+ .hd, .lod cho 6 công trình trùm)
         scripts/meshy-pack-library.mjs [id…] library ──▶ public/models/lib_<tên>{.hd,,.lod}.glb
         scripts/meshy-lod.mjs <in> <out> [ratio|t:N] [keepuv|auto]   giản lược (meshoptimizer)
```

`assets-meshy/state.json` ghi mọi `task_id` ngay khi tạo → chạy lại lệnh không tạo trùng, không mất credit. `assets-meshy/raw/` và tệp gốc thư viện **không** vào git (`.gitignore`); `public/models/` **có** trong git (94 tệp, 168 MB).

## 2. Tham chiếu script

### 2.1 `scripts/meshy-gen.mjs`

Khóa API: biến môi trường `MESHY_API_KEY` hoặc tệp `.env.meshy` (bị git bỏ qua). Không bao giờ đưa khóa vào bundle.

| Lệnh | Gọi API | Tham số gửi | Credit (theo chú thích trong script) |
|---|---|---|---|
| `balance` | `GET /openapi/v1/balance` | — | 0 |
| `preview <id…\|all>` | `POST /openapi/v2/text-to-3d` `mode: preview` | `prompt` (= prompt + `manifest.style` trừ khi `style: false`; tối đa 800 ký tự, quá thì script dừng), `ai_model` (mặc định `meshy-7.1`, tài sản có thể ghi `model`), `should_remesh: true`, `topology: triangle`, `target_polycount: poly`, `origin_at: bottom`, nhân vật thêm `pose_mode: a-pose`, công trình `hd` thêm `geometry_resolution: 4k` | 20 (+5 với hình học 4K) |
| `status` | `GET …/text-to-3d/<task>` | — | 0; ghi `previewCredits`/`refineCredits`, tải thumbnail vào `assets-meshy/thumbs/` |
| `refine <id…\|all>` | `POST /openapi/v2/text-to-3d` `mode: refine` | `preview_task_id`, `enable_pbr: true`, `texture_resolution: 4k` (hd) / `2k`, `texture_prompt`, `origin_at: bottom` | 10 |
| `download <id…\|all>` | tải `refineGlb` | — (nhân vật bỏ qua, dùng `animate`) | 0 |
| `reject <id> "lý do"` | — | đánh dấu bỏ; lần `preview` sau tạo lại và lưu lịch sử | 0 |
| `rig <id…\|all>` | `POST /openapi/v1/rigging` | `input_task_id: refine`, `height_meters: height` | 5 |
| `animate <id…\|all>` | `POST /openapi/v1/animations` | `rig_task_id`, `action_ids: anims` (thứ tự = `CHAR_ANIMS` trong `characters.js`) | 3 / động tác |

- Lỗi 429 → chờ 5 s × lần thử, tối đa 4 lần.
- **Lưu ý dữ liệu:** `state.json` (có trong git) lưu URL GLB ký sẵn (`previewGlb`, `refineGlb`, `animGlb`) — URL hết hạn, nhưng không nên công khai; chuyển các trường URL sang tệp không đưa lên git (TASK-160).
- `state.json` chỉ ghi credit của `preview`/`refine`; `rig`/`animate` không ghi → tổng 885 credit đọc được từ tệp **thấp hơn** thực tế.

### 2.2 `scripts/meshy-pack.mjs [id…]`

- Đầu vào `assets-meshy/raw/*.glb`, đầu ra `public/models/`. Gọi `@gltf-transform/cli optimize`.
- Công trình trùm (danh sách cứng `HD` trong script — **trùng lặp** với `assets.js › HD_IDS`, TASK-161 gộp về một nguồn):
  - `.hd.glb`: `--texture-compress webp --texture-size 2048 --compress meshopt --simplify-error 0.0004`;
  - `.glb`: texture 1.024, `--simplify-error 0.0008`;
  - `.lod.glb`: `meshy-lod.mjs` tỉ lệ 0,1 rồi texture 512, không giản lược thêm.
- Nhân vật (`hero*`, `master`, `npc*`): `--simplify false` (giữ trọng số skin), texture 1.024.
- Tượng thần (`deity_*`): texture 2.048 (nhìn cận cảnh trong điện).
- Còn lại: texture 1.024, `--simplify-error 0.0008`.

### 2.3 `scripts/meshy-lod.mjs <in.glb> <out.glb> [ratio|t:<tam giác>] [keepuv|auto]`

- `meshoptimizer.MeshoptSimplifier` trên từng primitive.
- Mặc định: cờ `Permissive` (gộp qua đường nối UV — mesh Meshy tách đỉnh theo đường nối nên giản lược thường không gộp được); sai số 1 khi tỉ lệ < 0,2, 0,05 khi cao hơn.
- `keepuv`: không gộp qua đường nối (texture không bị kéo sọc), dừng ở sàn của mesh.
- `auto`: như `keepuv`; nếu còn > 1,6 × đích thì `simplifyWithAttributes` có tính sai số UV (trọng số 16, 16) + `Permissive`.
- `t:<N>`: đích theo tổng số tam giác (tỉ lệ = N ÷ tổng hiện có).

### 2.4 `scripts/meshy-remesh.mjs <tên> <số mặt> [model_url]`

- Gọi `POST /openapi/v1/remesh` (`topology: triangle`, `target_polycount`), URL lấy từ `assets-meshy/library/links.json` nếu không truyền.
- 429 (gói giới hạn tác vụ chờ) → đợi 20 s, tối đa 90 lần; thăm dò trạng thái mỗi 8 s.
- Kết quả `assets-meshy/library/remesh/<tên>.<số mặt>.glb`; in `consumed_credits` (script không ghi lại — TASK-160 ghi vào sổ credit).

### 2.5 `scripts/meshy-pack-library.mjs [id…]`

- Ba mức: `.hd` 300.000 mặt + texture 2.048; thường 80.000 + 1.024; `.lod` 12.000 + 512.
- Nếu có bản remesh đúng số mặt → dùng thẳng (texture nướng lại sạch); `.lod` giản lược từ bản remesh 80.000 nếu có.
- Chạy Node với `--max-old-space-size=12000` (tệp gốc 1–10 triệu tam giác).

### 2.6 Giới hạn của đường ống hiện tại với yêu cầu AAA

| Yêu cầu | Vấn đề | Thay đổi |
|---|---|---|
| Vỏ có lòng trong, lỗ cửa (phần 06 §2) | Meshy trả khối liền | Meshy chỉ dựng ngoại thất; khoét cửa bằng boolean (Blender) hoặc chọn mẫu có cửa mở và kiểm bằng ảnh lát cắt (bản sơ đồ tổng §8.2) |
| Tên mesh `__roof`, `__floorN`, `__door_*` | `gltf-transform optimize` mặc định gộp node (`join`) và làm phẳng cây (`flatten`) → mất tên | với lớp `shell`: thêm `--join false --flatten false` (cờ của CLI optimize; kiểm lại tên cờ theo phiên bản `@gltf-transform/cli` 4.x đang dùng) và kiểm tên sau đóng gói (§5) |
| Ngân sách GPU texture khi thêm 10 vùng | WebP giải nén thành RGBA | thêm biến thể KTX2 (`uastc` cho texture chi tiết, `etc1s` cho texture lớn) cho mức low/mid (phần 09 §7 đòn bẩy 3) |
| Kho dữ liệu | `public/models` trong git | R2 (§7) |

## 3. Quy ước đặt tên

| Lớp | Mẫu tên tệp | Ví dụ | Biến thể |
|---|---|---|---|
| Công trình trùm hiện có | `<id>` | `palace_grand` | `.hd`, thường, `.lod` |
| Kiến trúc thường hiện có | `<id>` | `hall_main` | thường |
| Thư viện CC0 | `lib_<tên>` | `lib_courtyard` | `.hd`, thường, `.lod` |
| Nhân vật | `hero_m`, `hero_f`, `master`, `npc_<vai>` | `npc_merchant` | thường (có xương) |
| Tượng thần | `deity_<tên>` | `deity_doumu` | thường (texture 2.048) |
| **Vỏ công trình mới** | `bld_<region>_<nn>_shell` | `bld_longho_01_shell` | `.hd`, thường, `.lod`; `nn` = số trong `BLD-<region>-nn` |
| **Mô-đun nội thất** | `mod_<bộ>_<nn>` | `mod_daobac_01` | thường, `.ktx2` (biến thể texture) |
| **Đạo cụ** | `prop_<tên>` | `prop_ban_phu` | thường, `.lod` khi > 3.000 tam giác |
| **Bóng vùng xa** | `far/<region>` | `far/longho` | một bản ≤ 3.000 tam giác |
| Va chạm nướng | `col/<BLD-id>` | `col/BLD-longho-01.json` | — |

Tên id: chữ thường ASCII, số, gạch dưới; không dấu tiếng Việt (đường dẫn URL và `workerd` trên Windows đã gặp lỗi với ký tự có dấu, phần 01 §13).

## 4. Ngân sách theo lớp tài sản

| Lớp | Tam giác (.hd / thường / .lod) | Texture (.hd / thường / .lod) | Vật liệu | Kích thước tệp thường |
|---|---|---|---|---|
| Vỏ công trình hạng A | 150k / 60k / 8k | 2.048 / 1.024 / 512 | ≤ 4 | ≤ 3 MB |
| Vỏ hạng B | — / 30k / 5k | — / 1.024 / 512 | ≤ 3 | ≤ 1,5 MB |
| Vỏ hạng C (nhà dân) | — / 15k / 2k | — / 1.024 / 256 | ≤ 2 | ≤ 800 KB |
| Mô-đun nội thất | — / 0,5–6k / — | atlas bộ 2.048 dùng chung | 1 (atlas) | ≤ 200 KB |
| Đạo cụ tương tác | — / 0,5–3k / 0,3k | 512 | 1 | ≤ 250 KB |
| Nhân vật | — / 10–15k / — | 1.024 | ≤ 2 | ≤ 1 MB (hiện 0,52–0,90 MB) |
| Tượng thần | — / 100k / — | 2.048 | ≤ 2 | ≤ 1,1 MB (hiện 0,84–1,03 MB) |
| Cây, đá lặp lại | — / 5–10k / 1k | 512–1.024 | ≤ 2 | ≤ 700 KB |
| Bóng vùng xa | ≤ 3k | 256 | 1 | ≤ 150 KB |

Quy tắc chung: gốc tọa độ ở **đáy** (`origin_at: bottom` của Meshy; `placeModel` vẫn dời đáy để chắc), đơn vị mét, trục +Y lên; mặt chính của công trình hướng +Z (trùng quy ước «lối vào phía +z» của `world.js › ROOMS`).

## 5. Kiểm tài sản — `scripts/validate-assets.mjs`

Chạy trong CI cho mọi tệp `public/models/**/*.glb`:

| Mã | Kiểm | Mức |
|---|---|---|
| A1 | Có mục trong SCHEMA-ASSET (§6) và SCHEMA-LICENSE (§8) | lỗi |
| A2 | Số tam giác ≤ ngân sách lớp và biến thể | lỗi |
| A3 | Kích thước texture lớn nhất đúng biến thể (`.hd` ≤ 2.048, thường ≤ 1.024 trừ `deity_*`, `.lod` ≤ 512) | lỗi |
| A4 | Có `.lod` khi tam giác thường > 20k (trừ nhân vật, tượng) | cảnh báo |
| A5 | Vỏ công trình: có ít nhất một mesh `__roof`; tên mesh khớp `^[a-z0-9_]+(__(roof\|floor\d\|door_[a-z0-9]+\|win\|nocol))?$` | lỗi |
| A6 | Khung bao: `min.y` trong ±2% chiều cao (gốc ở đáy); tỉ lệ khung bao gần với `sizeTarget` của manifest (±40%) | cảnh báo |
| A7 | Phần mở rộng glTF chỉ thuộc tập loader hỗ trợ (`EXT_meshopt_compression`, `KHR_mesh_quantization`, `EXT_texture_webp`, `KHR_texture_basisu` khi có KTX2, `KHR_materials_*` cơ bản) | lỗi |
| A8 | Không có texture chứa chữ/biểu trưng (kiểm thủ công: đánh dấu `reviewed` trong SCHEMA-ASSET) | lỗi nếu chưa duyệt |
| A9 | Tượng/biểu tượng tôn giáo: `review.advisor` có tên và ngày (tài liệu 14) | lỗi |
| A10 | Tổng dung lượng thư mục theo vùng ≤ ngân sách vùng (SCHEMA-REGION-MANIFEST › budget) | cảnh báo |

Đếm tam giác/texture bằng `@gltf-transform/core` (`NodeIO`, đã là phụ thuộc phát triển) — không cần trình duyệt.

## 6. SCHEMA-ASSET (mở rộng `assets-meshy/manifest.json`)

```jsonc
{
  "id": "bld_longho_01_shell",
  "kind": "static",                        // 'static' | 'character' (giữ giá trị hiện có)
  "layer": "shell",                        // MỚI: 'shell'|'module'|'prop'|'character'|'deity'|'nature'|'far'|'legacy'
  "bld": "BLD-longho-01",                  // MỚI: công trình (khi layer = shell)
  "region": "longho",                      // MỚI
  "source": "meshy",                       // MỚI: 'meshy'|'library-cc0'|'handmade'
  "model": "meshy-7.1",                    // có sẵn (tùy chọn)
  "poly": 150000, "hd": true,              // có sẵn
  "prompt": "…", "style": true,            // có sẵn
  "sizeTarget": { "width": 70 },           // MỚI: kích thước trong game, để A6 kiểm
  "status": "approved",                    // MỚI: 'draft'|'preview'|'approved'|'rejected'|'packed'
  "review": { "art": "tên, ngày", "advisor": null, "noText": true },   // MỚI
  "credits": { "preview": 25, "refine": 10, "rig": 0, "anim": 0, "remesh": 0 },   // MỚI: ghi thực tế
  "notes": "khoét cửa giữa rộng 5 m"
}
```

## 7. Lưu trữ và phân phối

| Loại | Hiện tại | Đích | Lý do |
|---|---|---|---|
| Tệp gốc Meshy, thư viện, remesh | máy cá nhân (git bỏ qua) | R2 riêng tư `hq-asset-masters`, khóa theo `sha256` + `assets-meshy/masters.json` ghi băm | không mất tệp gốc nếu hỏng máy; tái đóng gói được |
| Tệp phát hành | `public/models` trong git → Workers Assets | R2 công khai với tên có băm + tên miền con; repo chỉ giữ `models/index.json` (id → tên băm, kích thước) | repo gọn; bộ đệm `immutable`; vượt được trần dung lượng/tệp của Workers Assets khi kho lớn |
| Bản iOS | `dist-ios/models` (đóng gói vào app, đã bỏ `.hd`) | giữ đóng gói cho Sơn Môn + Huyền Thành; vùng khác tải từ R2 khi cần (cần mạng) | dung lượng app; Apple không cấm tải nội dung đồ họa |

Chuyển kho (TASK-133) làm **sau** khi `models/index.json` và tên có băm đã chạy ổn (TASK-016), để `assets.modelUrl(id)` chỉ đổi một chỗ.

## 8. Giấy phép — SCHEMA-LICENSE

Hiện có `assets-meshy/library/LICENSES.md` (17 model CC0, ngày tải 2026-11-03, trang Meshy và task id, số mặt gốc, nơi dùng; mục «đã xem nhưng không dùng» với lý do). Chuyển thành dữ liệu máy đọc được, giữ tệp Markdown làm bản xuất:

```jsonc
// assets-meshy/licenses.json
{
  "lib_courtyard": {
    "source": "library-cc0",
    "title": "A small traditional Chinese courtyard house",
    "page": "Meshy community · 01a08854-ca6b-73c5-86d7-2c41a3632b4f",
    "license": "CC0-1.0",
    "retrieved": "2026-11-03",
    "account": "maz.elements3",
    "evidence": "assets-meshy/library/evidence/courtyard.png",   // ảnh chụp trang có ghi giấy phép (MỚI)
    "derived": ["lib_courtyard.hd", "lib_courtyard", "lib_courtyard.lod"]
  },
  "palace_grand": {
    "source": "meshy",
    "plan": "?",                           // gói tài khoản lúc tạo — điều khoản sở hữu đầu ra có thể khác theo gói (câu hỏi mở Q11)
    "created": "2026-11-03",
    "taskIds": { "preview": "…", "refine": "…" },
    "license": "meshy-output",             // tham chiếu điều khoản Meshy tại thời điểm tạo
    "derived": ["palace_grand.hd", "palace_grand", "palace_grand.lod"]
  }
}
```

- CI (A1) chặn tệp phát hành không có mục giấy phép.
- Đầu ra Meshy: quyền sử dụng phụ thuộc gói tài khoản và điều khoản lúc tạo; **phải** lưu gói và ngày tạo cho từng tài sản, và chủ dự án xác nhận điều khoản trước khi phát hành thương mại.
- Model CC0: lưu ảnh chụp trang làm bằng chứng (CC0 không đòi ghi tên nhưng nên lưu nguồn).
- Không dùng model có chữ, biểu trưng, hình người thật, biểu tượng tôn giáo chưa qua duyệt.

## 9. Credit Meshy

### 9.1 Đơn giá (theo chú thích script, cần đối chiếu bảng giá Meshy hiện hành)

| Bước | Credit |
|---|---|
| Preview | 20 |
| Hình học 4K (công trình trùm) | +5 |
| Refine (PBR) | 10 |
| Rig nhân vật | 5 |
| Mỗi động tác | 3 |
| Remesh | đọc `consumed_credits` (chưa có số cố định trong repo) |

### 9.2 Lịch sử

- 31 tài sản trong manifest; `state.json` ghi 885 credit cho preview + refine (trung bình ≈ 28,5 credit/tài sản; chưa gồm rig/động tác của 5 nhân vật: 5 × 5 + Σ động tác × 3 = 25 + (6 + 6 + 3 + 3 + 3) × 3 = 25 + 63 = 88 credit theo đơn giá §9.1).
- Hai lần tạo lại (`history`) trên 31 tài sản → tỉ lệ tạo lại ≈ 6%.
- Số dư hiện tại: **7 credit** (bản sơ đồ tổng §13.3).

### 9.3 Dự báo theo vùng

Công thức: `C = Σ_tài sản [ preview × (1 + r) + hd4k + refine ] + Σ_nhân vật [ rig + 3 × số động tác ]`, với `r` tỉ lệ tạo lại (lấy 0,3 để dự phòng cho công trình phức tạp, cao hơn mức 6% đã gặp).

| Hạng mục mỗi thánh địa | Số lượng | Credit/cái | Credit |
|---|---|---|---|
| Vỏ công trình trùm (hạng A, 4K) | 2 | 20 × 1,3 + 5 + 10 = 41 | 82 |
| Vỏ hạng B/C (Meshy thường) | 6 | 20 × 1,3 + 10 = 36 | 216 |
| Đạo cụ Meshy | 15 | 36 | 540 |
| Mô-đun nội thất | ~40 | thủ công (0) hoặc Meshy rẻ (bản sơ đồ tổng ước 5) | 0–200 |
| NPC riêng vùng (có xương, 4 động tác) | 2 | 36 + 5 + 12 = 53 | 106 |
| **Cộng** | | | **≈ 944–1.144** |

Mức này **cao hơn** ước tính 320–400 credit/vùng của bản sơ đồ tổng §13.3 vì gồm đạo cụ và NPC. Hai cách giảm:

1. Đạo cụ ưu tiên thư viện CC0 + remesh (chỉ trả credit remesh) và đồ thủ tục (như `models.js` đang làm cho đèn lồng, bàn thầy).
2. Dùng chung đạo cụ giữa các vùng cùng phong cách (bộ «Đạo quán phương Bắc» dùng cho cả Võ Đang và Chung Nam).

Với hai cách trên, mục tiêu **≤ 450 credit/vùng** → 10 vùng ≈ 4.500 credit, sát dự báo 3.500–4.000 của bản sơ đồ tổng. Cần mua gói trước M2 (canon). Giá tiền thật của gói do chủ dự án tra khi mua (câu hỏi mở Q12).

### 9.4 Sổ credit

`assets-meshy/credits.jsonl` (mới, không chứa URL): mỗi dòng `{ at, id, step, task, credits }` ghi bởi `meshy-gen.mjs` và `meshy-remesh.mjs`; `scripts/credits-report.mjs` cộng theo vùng/bước/tháng.

## 10. Tài sản làm tay

- Công cụ: Blender (bản LTS), xuất glTF nhị phân, +Y lên, mét, áp dụng biến đổi, tên mesh theo §2/§3.
- Mô-đun nội thất: lưới gian 3,2 m (phần 06 §8), điểm gốc tại góc gian theo `snap`, một vật liệu dùng atlas của bộ.
- Đạo cụ thủ tục (code) vẫn được khuyến khích cho vật đơn giản (đèn, bàn, bồ đoàn) — không tốn credit, gộp được (`mergeStatic`).

## 11. Duyệt và tờ tổng hợp

- `scripts/asset-sheet.mjs [--region longho] [--stage preview|refine|packed]`: ghép thumbnail (`sharp`, đã là phụ thuộc phát triển) thành tờ tổng hợp như `assets-meshy/contact-sheet.jpg`, `hd_sheet.png`, `deity_sheet.png` hiện có; ghi id, số tam giác, credit dưới mỗi ô.
- Quy trình duyệt: TA tạo preview → ART/LVL duyệt tờ tổng hợp → `refine` → đóng gói → `validate-assets` → ảnh trong game (Định nghĩa Done phần 06 §11) → `status: approved`.
- Tượng thần, biểu tượng tôn giáo: thêm bước cố vấn tài liệu 14; manifest hiện đặt `style: false` cho `deity_*` (bỏ dòng «no religious statues» của phong cách chung) → mọi tượng mới phải có `review.advisor`.

## 12. Kiểm thử

| Bộ | Ca |
|---|---|
| `validate-assets.mjs` (CI) | A1–A10 |
| `test-pack.mjs` | đóng gói một GLB mẫu nhỏ có mesh `__roof` → tên còn sau `optimize` với cờ lớp shell; biến thể đúng kích thước texture |
| `credits-report.mjs` | tổng khớp `state.json` cho preview/refine |

## 13. Kiểm kê tài sản hiện có (2026-11-05)

Đo bằng `stat` trên `public/models` (byte → MB, 2 chữ số); «Dùng ở» lấy bằng tìm id trong `src/game/*.js`. Cột «Lớp đích» là giá trị `layer` đề xuất khi bổ sung manifest (§6) và hướng xử lý cho bản AAA.

| id | Thường | `.hd` | `.lod` | Dùng ở | Lớp đích / hướng xử lý |
|---|---|---|---|---|---|
| `palace_grand` | 3,10 | 4,31 | 0,30 | `sect.js` (Chính Đường), `landmarks.js` | shell — khoét cửa, 2 tầng (TASK-085, TASK-101) |
| `cliff_palace` | 1,78 | 2,81 | 0,30 | `landmarks.js` (Hậu Sơn, Tử Bình Phong) | shell — Chính Điện Tam Thanh bên trong (TASK-112) |
| `city_gate` | 1,93 | 2,89 | 0,27 | `landmarks.js` (cổng Huyền Thành) | shell hạng E — cổng, chỉ khoét lối (đã có `keep`) |
| `sect_gate_grand` | 2,72 | 3,61 | 0,30 | `landmarks.js` (cổng tông môn vùng) | shell hạng E |
| `sky_palace` | 2,59 | 3,51 | 0,27 | `landmarks.js` (Thiên Bàn Đảo) | shell — cân nhắc tái dùng cho Côn Lôn (M5) |
| `tower_nine` | 2,48 | 3,73 | 0,35 | `landmarks.js` (Tử Bình, Trích Thiên, Thư Lâu) | shell hạng B — tầng trệt + cầu thang |
| `hall_main` | 0,96 | — | — | `sect.js` (điện phụ Đông/Tây), `landmarks.js` | shell — Vận Mệnh Các, Thái Tuế Điện bên trong (TASK-105/106); cần `.lod` |
| `gate_sect` | 0,75 | — | — | `sect.js` (Sơn Môn, Hậu Môn), `landmarks.js` | shell — phòng gác (TASK-109) |
| `library_tower` | 0,95 | — | — | `landmarks.js` | legacy (phương án lùi của `tower_nine`) |
| `observatory` | 0,53 | — | — | `landmarks.js` (Trích Thiên) | shell hạng A tương lai — cần bản 4K |
| `tea_pavilion` | 0,51 | — | — | `landmarks.js` (Cùng Thông Hồ) | shell hạng D (đứng dưới mái được) |
| `house_town` | 0,49 | — | — | `landmarks.js` (phương án lùi nhà phố) | legacy |
| `bridge_arch` | 0,46 | — | — | `landmarks.js` (phương án lùi cầu) | legacy |
| `boat` | 0,46 | — | — | `landmarks.js` (hồ) | prop |
| `cauldron` | 0,40 | — | — | `sect.js` (Đại Đỉnh), `interior.js`, `landmarks.js` | prop |
| `luopan_stand` | 0,48 | — | — | `landmarks.js` (Phong Thủy Viên) | prop |
| `scholar_desk` | 0,35 | — | — | `interior.js` (Thầy Giải Quẻ), `landmarks.js` | prop |
| `rock_island` | 0,62 | — | — | `landmarks.js` (đảo trôi) | nature |
| `tree_peach` | 0,67 | — | — | `sect.js`, `landmarks.js` | nature |
| `tree_pine` | 0,40 | — | — | `sect.js`, `landmarks.js` | nature |
| `flying_sword` | 0,34 | — | — | `effects.js` (ngự kiếm) | prop |
| `hero_m` | 0,81 | — | — | `render3d.js`, `main.js` | character |
| `hero_f` | 0,86 | — | — | `render3d.js`, `main.js` | character |
| `master` | 0,62 | — | — | `render3d.js` (Thầy Tử Bình), `interior.js`, `case-ui.js` | character — tô màu cho NPC mới (TASK-053) |
| `npc_merchant` | 0,50 | — | — | `render3d.js` (thợ may, khách) | character |
| `npc_villager` | 0,55 | — | — | `render3d.js` (khách) | character |
| `deity_yuanshi` | 0,94 | — | — | `world.js › ROOMS` (Chính Điện) | deity — cần `review.advisor` hồi tố |
| `deity_lingbao` | 0,98 | — | — | như trên | deity |
| `deity_daode` | 0,99 | — | — | Chính Điện, Lão Quân Điện | deity |
| `deity_wenchang` | 0,96 | — | — | Văn Xương Các | deity |
| `deity_doumu` | 0,80 | — | — | Đẩu Mẫu Điện | deity |
| `lib_courtyard` | 1,15 | 3,29 | 0,20 | `landmarks.js` (30 nhà vườn, nhân bản LOD) | shell hạng C — mỗi nhà một BLD (TASK-110) |
| `lib_pavilion2` | 2,13 | 6,98 | 0,29 | `sect.js` (lầu chuông/trống), `landmarks.js` | shell hạng B — tầng 2 (TASK-107) |
| `lib_pagoda5` | 2,00 | 6,04 | 0,29 | `sect.js` (bảo tháp), `landmarks.js` | shell hạng B (TASK-108) |
| `lib_pagoda_red` | 2,16 | 6,71 | 0,29 | `sect.js` (bảo tháp), `landmarks.js` | shell hạng B (TASK-108) |
| `lib_wood_pavilion` | 1,02 | 3,59 | 0,18 | `sect.js`, `landmarks.js` (mái che sảnh) | shell hạng D |
| `lib_garden_pav` | 1,76 | 5,12 | 0,27 | `landmarks.js` | shell hạng D |
| `lib_mtn_house` | 2,25 | 7,81 | 0,30 | `landmarks.js` | shell hạng C |
| `lib_paifang` | 1,77 | 4,51 | 0,27 | `landmarks.js` | hạng D (cổng chào) |
| `lib_stone_bridge` | 0,90 | 3,00 | 0,18 | `landmarks.js` | hạng E (đi trên mặt cầu — cần `addRamp`) |
| `lib_stall_timber` | 1,06 | 3,34 | 0,20 | `landmarks.js` | prop lớn (quầy chợ, quầy Định Mệnh Hội ở M3) |
| `lib_lantern` | 1,16 | 3,88 | 0,23 | `interior.js` (bản `.lod` nhân bản), `landmarks.js` | prop |
| `lib_blossom` | 1,86 | 7,33 | 0,36 | `landmarks.js` | nature |
| `lib_willow` | 1,88 | 7,36 | 0,32 | `landmarks.js` | nature |
| `lib_bonsai` | 1,86 | 7,24 | 0,24 | `landmarks.js` | prop |
| `lib_bookshelf` | 1,20 | 3,47 | 0,27 | `landmarks.js` (Thư Lâu) | prop — ứng viên mô-đun Nho môn |
| `lib_horse` | 1,03 | 3,44 | 0,20 | `landmarks.js` (trạm đi nhanh) | prop |
| `lib_cart` | 0,24 | 0,47 | 0,16 | `landmarks.js` | prop |

Nhận xét dùng cho kế hoạch:

1. `.hd` của 17 mô hình thư viện chiếm phần lớn 105 MB bản HD; mỗi tệp 3–8 MB với texture 2.048. Ở mức `high` trên máy bàn chấp nhận được; bản iOS đã loại. Biến thể KTX2 (TASK-143) ưu tiên cho các tệp `lib_*` thường (1–2,4 MB) vì chúng dùng ở mức mid.
2. Cây thư viện (`lib_blossom`, `lib_willow`) ở bản thường gần 1,9 MB — nặng cho «đạo cụ thiên nhiên» (ngân sách §4: ≤ 700 KB). Đề xuất remesh xuống ~30k và texture 512 khi dùng số lượng lớn.
3. Năm tượng thần chưa có `review.advisor` (tạo trước khi có quy trình) — bổ sung hồi tố ở TASK-170 hoặc TASK-207.
4. Ba mô hình `legacy` (`library_tower`, `house_town`, `bridge_arch`) chỉ còn làm phương án lùi trong `landmarks.place()`; có thể bỏ khỏi bản iOS để tiết kiệm ~1,9 MB khi bản thư viện ổn định.
