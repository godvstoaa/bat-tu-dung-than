# 13.09 · Ngân sách hiệu năng, đo đạc và chống hồi quy

## 1. Hạng thiết bị

| Hạng | Thiết bị tham chiếu (đo thật trên ít nhất một máy mỗi hạng) | Mức chất lượng mặc định |
|---|---|---|
| **low** | iPhone XR / 11 (A12–A13), Android tầm trung 2021 (Snapdragon 6xx), laptop Intel UHD 620 | `low` |
| **mid** | iPhone 12 / 13 (A14–A15), iPad M1, Android cận cao cấp 2022, laptop Iris Xe | `mid` (mặc định trên màn cảm ứng như hiện nay) |
| **high** | máy bàn GPU rời, Mac Apple Silicon | `high` (mặc định máy để bàn như hiện nay) |

Phát hiện hạng lúc chạy: `pointer: coarse` (đã dùng) + `navigator.hardwareConcurrency` + chuỗi `WEBGL_debug_renderer_info` (nếu có) + 3 giây đo khung hình đầu. Người chơi ghi đè được (`huyenquan:quality`, đã có).

## 2. Ngân sách

### 2.1 Bảng tổng

| Chỉ số (khung xấu nhất trong vùng chơi thường) | low | mid | high |
|---|---|---|---|
| Thời gian khung mục tiêu | 33,3 ms (30 khung/giây) | 20 ms (≥ 50), hướng tới 16,7 | 16,7 ms (60) |
| Tối thiểu chấp nhận (p95 khung) | ≤ 40 ms | ≤ 33,3 ms (≥ 30 khung/giây trong nhà, bản sơ đồ tổng §8.5) | ≤ 20 ms |
| Lượt vẽ | ≤ 150 | ≤ 250 | ≤ 400 |
| Tam giác/khung | ≤ 300k | ≤ 600k | ≤ 1,5 triệu |
| GPU texture | ≤ 96 MB | ≤ 180 MB | ≤ 400 MB |
| GPU hình học | ≤ 48 MB | ≤ 96 MB | ≤ 200 MB |
| Heap JS | ≤ 250 MB | ≤ 400 MB | ≤ 800 MB |
| Bản đồ bóng | tắt hoặc 1.024 | 1.536 | 2.048 |
| Tỉ lệ điểm ảnh | 1,0 | 1,5 | ≤ 2,0 |
| Đèn điểm (nhóm) | 6 | 10 | 16 |
| Bloom | tắt | bật (½ độ phân giải) | bật |
| Nhân vật có xương hoạt cảnh đầy đủ | 8 | 16 | 30 |
| Nhãn HTML hiện cùng lúc | 15 | 25 | 40 |
| Thời gian tải lần đầu vào Huyền Thành (4G tốt) | ≤ 12 s | ≤ 8 s | ≤ 5 s |
| Dữ liệu tải lần đầu | ≤ 8 MB | ≤ 8 MB | ≤ 15 MB (gồm `.hd`) |

Nguồn: mức mid khớp `DAI-THE-GIOI-DESIGN.md › C7` (≤ 250 lượt vẽ, ≤ 600k tam giác, texture ≤ 180 MB, 50–60 khung/giây, tải đầu ≤ 8 MB). `GAME-MMO-PROMPT-PLAN.md` ghi «tải lần đầu ≤ 4 MB» cho bản quán nhỏ trước đây; bản thế giới mở dùng ≤ 8 MB.

### 2.2 Ngân sách CPU một khung (mid, 16,7 ms)

| Hệ | ms | Ghi chú |
|---|---|---|
| Đầu vào, `step`, va chạm | 0,3 | |
| Mạng (`net.tick`, giải gói) | 0,3 | gói gộp `mvb` (phần 08) |
| Máy nhiệm vụ, sự kiện | 0,1 | phần 03 |
| Streamer (lập kế hoạch 0,5 s một lần, dàn trải) | 0,5 | phần 07 |
| Tải lên địa hình/đối tượng mới (giới hạn) | 1,5 | chia nhỏ qua nhiều khung |
| Hoạt cảnh nhân vật, phụ kiện, hiệu ứng | 2,5 | giới hạn số nhân vật đầy đủ |
| Ô cổng + nhóm đèn | 0,3 | phần 06 |
| Nhãn HTML | 0,6 | chỉ ghi style khi đổi > 0,5 px |
| Gửi lệnh vẽ (three.js) | 5,0 | ~250 lượt vẽ |
| Dự phòng (GC, trình duyệt) | 5,6 | |

## 3. Số liệu đã đo (mốc hiện tại)

| Đo | Giá trị | Điều kiện | Nguồn |
|---|---|---|---|
| Lượt vẽ Sơn Môn | 1.116 → 186 sau gộp | khung xem trước | nhật ký 2026-11-04 |
| Khung/giây Sơn Môn | 3 → 45 | khung xem trước (có thể bị hạ nhịp) | như trên |
| `analyze()` | 1,56 ms ấm, 16,5 ms lần đầu | Node, máy phát triển | phần 01 |
| `buildChartBrief()` | 190 ms, 92.527 ký tự | Node | phần 01 |
| 7 engine phụ Mệnh Bàn | ≈ 2,2 ms tổng | Node | phần 01 |
| `heightAt` | 50.000 lần < 400 ms | Node | `test-terrain` |
| Kích thước chunk JS | `render3d` 792 KB, `game` 126 KB | build gần nhất, chưa nén | `dist/assets` |
| Mô hình | 168 MB tổng; `.hd` 105 MB; `.lod` 6,1 MB; iOS 63 MB | | phần 01 |

**Chưa có** số đo trên thiết bị thật theo hạng; TASK-044 (M0) đo ba cảnh S1, S2, S3 trên một máy mỗi hạng và ghi mốc vào `perf/baselines/`.

## 4. Cảnh đo chuẩn

Mỗi cảnh xác định: vị trí, hướng camera (`setView` / `setDebugCam`, đã có trong `render3d.js`), giờ cố định (`setDebugHour`, đã có), chất lượng ép, số người chơi giả.

| Mã | Cảnh | Camera | Giờ | Ghi chú |
|---|---|---|---|---|
| S1 | Sơn Môn nhìn từ cổng | `START`, nhìn Bắc, `dist 15` | 10 h | cảnh mốc 186 lượt vẽ |
| S2 | Trong Chính Đường (sau khi có ô cổng) | ô `c1` | 20 h (đèn bật) | nội thất hạng A |
| S3 | Phố Huyền Thành, 30 nhà vườn | (0, 110) nhìn Bắc | 18 h | nhân bản + LOD |
| S4 | Bay 200 m trên Huyền Thành nhìn Long Hổ | (300, −50, 200) | 10 h | địa hình xa, impostor |
| S5 | Trung tâm một thánh địa | tâm vùng | 10 h | theo từng vùng khi có |
| S6 | Sơn Môn + 60 người chơi giả | S1 | 10 h | `?bench=s6` tiêm `net.others` giả |
| S7 | Vận Mệnh Các (9 cổng, bia) | trong điện | 20 h | |
| S8 | Đi bộ theo đường Huyền Thành → Long Hổ (90 s) | bot | 10 h | đo giật do streaming |

## 5. Công cụ đo

### 5.1 HUD hiệu năng `?perf=1`

- Hiện góc màn: khung/giây p50/p95 trong cửa sổ 5 s, thời gian khung CPU (đo `performance.now()` quanh `frame()`), `renderer.info.render.calls/triangles`, `renderer.info.memory.geometries/textures`, `renderer.info.programs.length`, bộ đếm streamer (phần 07: GPU MB ước, ô theo vòng), số tác vụ dài (`PerformanceObserver({ type: 'longtask' })`), heap JS (`performance.memory`, chỉ Chrome).
- Nút «Chụp số liệu» ghi SCHEMA-PERF-REPORT vào clipboard và (nếu đồng ý phân tích) gửi sự kiện `perf`.
- `window.__hq.renderer.info()` (đã có) giữ nguyên cho Playwright.

### 5.2 Công cụ ngoài

| Công cụ | Dùng khi |
|---|---|
| Chrome DevTools › Performance (giả lập CPU chậm 4×) | tìm hàm tốn CPU trong `frame()` |
| Spector.js (tiện ích trình duyệt) | chụp một khung, xem từng lượt vẽ, vật liệu, texture |
| `chrome://gpu`, `chrome://tracing` | kiểm GPU thật, rasterizer |
| Safari Web Inspector qua USB với iPhone | Timelines (JS, layout, rendering), Graphics (canvas WebGL) cho bản iOS (WKWebView) |
| Xcode Instruments (Allocations, VM Tracker) | bộ nhớ thật của tiến trình WebContent trên iOS |
| `wrangler tail` | độ trễ, lỗi Worker/DO khi bài tải MMO |

### 5.3 Đo tự động — `scripts/bench-scenes.mjs`

```
node scripts/bench-scenes.mjs [--url http://127.0.0.1:5173/game.html] [--scenes S1,S3,S6] [--quality mid] [--seconds 20] [--out test-results/perf]
```

1. Mở trang với `?bench=<mã>&quality=<mức>&seed=1` → game bỏ cổng (dùng hồ sơ thử `MAU-A`), đặt camera/giờ theo bảng §4, tắt âm thanh, tắt mạng (hoặc tiêm người giả với S6).
2. Đợi `streamer.stats().queue === 0` và 2 s ổn định.
3. Ghi thời điểm từng `requestAnimationFrame` trong N giây; mỗi giây đọc `__hq.renderer.info()`.
4. Ghi SCHEMA-PERF-REPORT; so với `perf/baselines/<máy>/<cảnh>.json` theo §6.

### 5.4 SCHEMA-PERF-REPORT

```jsonc
{
  "scene": "S1", "quality": "mid", "at": "2026-11-05T10:00:00Z",
  "build": { "app": "3.1.0", "git": "d165f6f6", "cv": "q:2026.11.3" },
  "device": { "ua": "…", "gpu": "ANGLE (Intel, Iris Xe)", "dpr": 1.5, "w": 1280, "h": 800, "class": "mid" },
  "frames": { "n": 1180, "fpsP50": 58.2, "fpsP05": 41.0, "msP95": 24.4, "msMax": 61.0, "longTasks": 2 },
  "render": { "calls": 184, "triangles": 512340, "geometries": 812, "textures": 143, "programs": 37 },
  "memory": { "gpuTexMB": 151.2, "gpuGeoMB": 62.0, "heapMB": 210.5 },
  "stream": { "cellsN": 9, "cellsM": 28, "stalls": 0 },
  "notes": ""
}
```

## 6. Chống hồi quy

### 6.1 Chỉ số tất định và chỉ số phụ thuộc máy

| Loại | Chỉ số | Chạy ở | Ngưỡng chặn |
|---|---|---|---|
| Tất định | lượt vẽ, tam giác, số texture, số chương trình shader, GPU MB ước, dung lượng tải lần đầu, kích thước chunk JS | CI (Chrome headless với SwiftShader — FPS vô nghĩa nhưng các số này đúng) | vượt mốc > 5% hoặc vượt ngân sách bảng §2.1 → **fail** |
| Phụ thuộc máy | FPS p50/p95, thời gian khung, tác vụ dài | máy phòng thí nghiệm (một máy mỗi hạng) | tụt > 10% so mốc → cảnh báo, chặn phát hành mốc (milestone) |

- Runner GitHub không có GPU → không dùng FPS trong CI. Các con số tất định đủ bắt phần lớn hồi quy (thêm mesh không gộp, quên LOD, texture 2.048 lọt vào điện thoại).
- Cập nhật mốc: PR thay `perf/baselines/*.json` phải có dòng «Lý do tăng» và được TD duyệt.

### 6.2 Kiểm dung lượng tải

`scripts/check-bundle.mjs` (CI sau `npm run build`):

| Kiểm | Ngưỡng |
|---|---|
| Chunk `render3d` | ≤ 900 KB chưa nén |
| Chunk `game` | ≤ 250 KB |
| Tổng dữ liệu tải để vào S1 ở mức mid (JS + GLB vòng N + va chạm + kê khai) | ≤ 8 MB |
| Không có `.hd.glb` trong danh sách tải mức mid/low | 0 |
| `dist-ios/models` | không chứa `.hd.glb` (đã có trong `ios-postbuild`, kiểm lại) |

## 7. Bộ đòn bẩy tối ưu (theo thứ tự hiệu quả/chi phí)

| # | Đòn bẩy | Hiện trạng | Việc làm | Ảnh hưởng ước tính |
|---|---|---|---|---|
| 1 | Gộp hình học tĩnh theo vật liệu | có `mergeStatic` cho khối thủ công | áp cho đạo cụ GLB tĩnh trong một ô (gộp sau khi đặt) | lượt vẽ đạo cụ ÷ 3–5 |
| 2 | Nhân bản (InstancedMesh) | có cho nhà, cây, đèn lồng | áp cho mô-đun nội thất (phần 06 §8.2) | lượt vẽ nội thất ≈ số loại mô-đun |
| 3 | Texture nén GPU (KTX2/Basis) | WebP 1.024 (giải nén thành RGBA trên GPU, ≈ 5,6 MB/ảnh kể cả mipmap) | `gltf-transform` `uastc`/`etc1s` + `KTX2Loader` (cần tệp transcoder WASM) | GPU texture ÷ 4–6 → giữ ngân sách 180 MB khi thêm vùng |
| 4 | Atlas texture theo bộ mô-đun | chưa có | mỗi bộ (phần 06 §8.1) một atlas 2.048 | ít đổi texture, gộp được nhiều hơn |
| 5 | LOD và khoảng chuyển | 3 bản cho công trình trùm và `lib_*`; ngưỡng `max(v × 4, 80 m)` | thêm `.lod` cho mọi công trình > 20k tam giác; ngưỡng theo kích thước góc nhìn (screen-space) | tam giác xa ÷ 5 |
| 6 | Địa hình macro | 256 chunk luôn có | phần 07 §3 | lượt vẽ địa hình ≤ 30 |
| 7 | Nhân vật: shader đổi màu bằng uniform | `customProgramCacheKey` theo bộ màu → mỗi tổ hợp áo/đai một chương trình | dùng một chương trình, màu là uniform (giữ `onBeforeCompile`, bỏ khóa theo màu) | giảm số chương trình, hết giật biên dịch khi người lạ mặc màu mới |
| 8 | Nhân vật: cắt theo khung nhìn | `frustumCulled = false` | khung cầu bao mở rộng 1,5 × chiều cao cho skinned mesh rồi bật culling | bỏ vẽ nhân vật sau lưng camera |
| 9 | Nhân vật xa | mỗi người khác một bản sao skinned | > 40 m: thay bằng mẫu gộp tĩnh (đã có cho lúc chờ nạp) hoặc thẻ phẳng; cập nhật hoạt cảnh ½ nhịp ở 20–40 m | CPU hoạt cảnh ÷ 2–3 với phòng đông |
| 10 | Nhãn HTML | ghi `style.transform` mỗi khung cho ≈ 40 nhãn | chỉ ghi khi đổi > 0,5 px; ẩn nhãn ngoài 60 m bằng một lớp CSS | giảm layout/style recalc |
| 11 | Biên dịch shader trước | biên dịch lười khi vật liệu lần đầu xuất hiện | `renderer.compileAsync(scene, camera)` sau khi nạp ô vòng N, trước khi bỏ màn chờ | hết giật khi quay camera |
| 12 | Bloom | toàn độ phân giải `UnrealBloomPass(512²)` | ½ độ phân giải ở mid; tắt ở low (đã tắt) | GPU −10–15% ở mid (ước) |
| 13 | PMREM | dựng lại khi mặt trời đổi > 0,08 | dựng trong khung riêng, không trùng khung nạp ô; ở low dựng tối đa mỗi 10 phút | bỏ một khung giật |
| 14 | Bộ hạ chất lượng thích ứng | một chiều, duyệt toàn cảnh | §8 | ổn định FPS, không giật |

## 8. Bộ điều chỉnh chất lượng thích ứng

Thay đoạn «fps < 35 → lowQuality một chiều» trong `render3d.js`:

```
knobs (thứ tự hạ):
  1 bloomScale 1 → 0,5 → 0
  2 pixelRatio −0,25 mỗi nấc, sàn 1,0
  3 shadowMapSize ÷ 2, sàn 1.024
  4 shadows tắt
  5 treesNear × 0,7
  6 nearRing × 0,85 (streamer)
  7 particles tắt
state: level ∈ [0, 7], userCap (mức người chơi chọn là trần trên)

mỗi 2 s: p90 = phân vị 90 thời gian khung trong 2 s
  if p90 > budget × 1,15 hai cửa sổ liên tiếp && level < 7: level++ ; apply(knob[level])
  else if p90 < budget × 0,70 trong 10 s && level > 0: apply_undo(knob[level]); level--
  sau mỗi lần đổi: khóa 4 s (không đổi tiếp) để đo lại
```

- `apply` không duyệt cảnh: các vật liệu bị ảnh hưởng (bóng) đã đăng ký sẵn danh sách khi tạo; đổi `needsUpdate` chỉ trên danh sách đó, chia ra 3 khung.
- Trạng thái `level` ghi vào phiên (không lưu) và gửi sự kiện `perf` khi đổi (nếu đồng ý phân tích).

## 9. Mạng và tải tài sản

| Vấn đề | Hiện tại | Đích | TASK |
|---|---|---|---|
| Giới hạn tốc độ KV 120 yêu cầu/phút/IP áp cả `/models/` | có (D8) | bỏ giới hạn cho `/models/*`, `/col/*`, `/stream/*`, `/nav/*` (tài sản tĩnh) | TASK-015 |
| Bộ đệm GLB | mặc định của Workers Assets (xác thực lại) | tên tệp có băm nội dung (`<id>.<hash8>.glb`) qua bảng ánh xạ `models/index.json`; `Cache-Control: public, max-age=31536000, immutable` | TASK-016 |
| Tải lặp giữa các phiên | phụ thuộc bộ đệm HTTP | thêm bộ đệm Service Worker cho tài sản game (SW hiện chỉ cho app chính) với ngân sách 300 MB, LRU | TASK-152 |
| Kho tài sản | `public/models` trong git, phục vụ qua Workers Assets | R2 + tên miền con `assets.<miền>` khi tổng > 500 MB | TASK-133 |

## 10. Kiểm thử phần này

| Bộ | Ca |
|---|---|
| `bench-scenes.mjs` (CI, SwiftShader) | S1, S3, S6, S7: lượt vẽ/tam giác/texture/chương trình ≤ mốc + 5% và ≤ ngân sách mid |
| `bench-scenes.mjs` (máy phòng thí nghiệm) | mọi cảnh, ba mức; FPS p50/p95 ≥ ngưỡng §2.1 |
| `check-bundle.mjs` (CI) | §6.2 |
| `test-quality-ctl.mjs` (thuần) | chuỗi thời gian khung giả: hạ đúng thứ tự, không dao động (khóa 4 s), không vượt trần người chơi |
| Ngâm bộ nhớ | phần 07 §10 |

## 11. Phân bổ ngân sách lượt vẽ theo cảnh (mid, mục tiêu)

Mốc hiện tại S1 = 186 lượt vẽ (gộp toàn cảnh). Bảng chia ngân sách để mỗi hệ biết trần của mình; `bench-scenes` ghi tách theo nhóm bằng cách gắn `userData.budgetGroup` cho gốc mỗi hệ và đếm lượt vẽ theo nhóm (đếm `renderer.info.render.calls` trước/sau khi ẩn từng nhóm trong chế độ đo).

| Nhóm | S1 Sơn Môn | S2 Chính Đường (trong) | S3 phố Huyền Thành | S4 bay 200 m | S5 tâm thánh địa | S6 Sơn Môn + 60 người |
|---|---|---|---|---|---|---|
| Địa hình (gần + macro) | 20 | 6 (ngoài ẩn khi không thấy cổng) | 24 | 30 | 24 | 20 |
| Cây, mây, nước, trời | 12 | 0 | 14 | 16 | 14 | 12 |
| Sơn Môn thủ tục (đã gộp) | 60 | 10 (thấy qua cửa) | 20 | 6 | 0 | 60 |
| Công trình GLB vòng N | 50 | 8 (vỏ + mái mờ) | 70 | 0 | 90 | 50 |
| Công trình vòng M / bóng xa | 10 | 0 | 20 | 60 | 20 | 10 |
| Nội thất (ô thấy) | 0 | 60 | 10 | 0 | 30 | 0 |
| Nhân vật (người chơi + NPC) | 10 | 8 | 12 | 2 | 12 | 70 |
| Hiệu ứng, hạt, nhãn 3D | 10 | 6 | 10 | 6 | 10 | 20 |
| Bóng đổ (lượt vẽ phụ) | 25 | 15 | 30 | 0 (tắt ở độ cao) | 30 | 30 |
| **Cộng** | **197** | **113** | **210** | **120** | **230** | **272 → vượt** |

S6 vượt 250: chính là lý do của TASK-150 (nhân vật xa dùng mẫu tĩnh gộp, cắt khung nhìn) — mục tiêu nhóm nhân vật S6 ≤ 40.

## 12. Phòng thí nghiệm thiết bị

| Hạng | Thiết bị tối thiểu cần có | Trình duyệt | Dùng cho |
|---|---|---|---|
| low | 1 iPhone 11 (iOS mới nhất hỗ trợ) · 1 laptop Intel UHD 620 | Safari (WKWebView qua app), Chrome | S1–S8, ngâm bộ nhớ iOS |
| mid | 1 iPhone 13 · 1 laptop Iris Xe hoặc Ryzen iGPU | Safari, Chrome, Edge | mốc chính (mid là mặc định cảm ứng) |
| high | 1 máy bàn GPU rời · 1 Mac Apple Silicon | Chrome, Safari, Firefox | `.hd`, bloom đầy đủ |

Quy ước đo: máy cắm sạc, nhiệt độ phòng, tắt chế độ tiết kiệm pin, đóng ứng dụng khác, đo sau 60 s khởi động (để GPU đạt xung ổn định), chạy 3 lần lấy trung vị.
