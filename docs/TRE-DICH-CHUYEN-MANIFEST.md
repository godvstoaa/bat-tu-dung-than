# Trễ ảnh sau dịch chuyển — manifest

Đợt «Trễ ảnh khi dịch chuyển», 2026-11-20.

## 1. Cách đo

[`scripts/travel-probe.mjs`](../scripts/travel-probe.mjs):

- Vào game, chờ 6 s, rồi gọi `api.travel` tới điểm `SPOT`.
- Ghi lại trong T giây:
  - mọi khung hình (`requestAnimationFrame`);
  - tác vụ dài (`PerformanceObserver longtask`);
  - các chương trình shader mới so với trước khi dịch chuyển;
  - lệnh vẽ và tam giác mỗi giây.
- `PROF=1` lấy thêm hồ sơ CPU qua CDP và ghi vào `output/travel/prof.cpuprofile`. [`scripts/tmp/profwho.mjs`](../scripts/tmp/profwho.mjs) tìm hàm nào gọi một hàm cho trước.

Hai chỉ số:

- **Khung ổn**: mốc đầu tiên sau lớp phủ dịch chuyển (1,3 s) mà từ đó suốt 2 s không có khoảng hở nào ≥ 100 ms giữa hai khung.
- **Tổng đứng hình**: cộng mọi khoảng hở ≥ 100 ms giữa hai khung.

## 2. Chẩn đoán (đo, 2026-11-20)

| Điểm tới | Khung ổn | Tổng đứng hình | Khựng lớn nhất |
|---|---|---|---|
| Cổng Nam Ngoại Thành (0, 2190) | 1,3 s | 1,8 s | 0,66 s |
| Biệt thự Pháp (−1286, −1490) | 5,0 s | 4,3 s | 0,87 s |
| Phủ Mughal (1365, 1376) | **14,0 s** | **10,0 s** | 1,05 s |

Hồ sơ CPU ở phủ Mughal (25 s):

- **Biên dịch shader đồng bộ**: `getProgramInfoLog` 1,3 s cộng phần native (program) 1,9 s. Nguồn: `onFirstUse` ← `setProgram` ở lượt vẽ chính.
- `mansion3d.build` thêm khuôn viên vào cảnh ngay sau khi dựng, nên mọi vật liệu mới của phủ biên dịch ở khung đầu tiên vẽ nó.
- Nhà phố và công trình mốc đã đi qua `assets.warmObject` (`renderer.compileAsync` rồi đẩy texture lên GPU) nên không bị.
- Dựng hình bằng JS chỉ 1,2 s:
  - `estatePiece` 0,66 s;
  - nạp khuôn cây lần đầu (`bigtrees` flatten / applyFrame) 0,5 s.
- `updateMatrixWorld` ăn khoảng 16 % CPU mỗi khung, ở mọi nơi, không riêng lúc dịch chuyển. Cảnh tĩnh vẫn cập nhật ma trận.

## 3. Sửa

1. **Làm nóng trước khi hiện** (`mansion3d.build`):
   - dựng xong và bày đồ nội thất xong thì gọi `warmObject(g)`;
   - xong mới `grp.add(g)` và ẩn bản xa;
   - trong lúc chờ vẫn hiện bản xa, không có khung trống;
   - nếu khuôn viên đã bị dỡ trong lúc chờ thì không thêm.
2. **Bày đồ trước khi làm nóng**: trước đó `furnish` chạy sau, nên còn 5 chương trình đồ nội thất biên dịch đồng bộ.

## 4. Kết quả

| Điểm tới | Khung ổn | Tổng đứng hình | Khựng lớn nhất |
|---|---|---|---|
| Phủ Mughal (3 lần đo) | 4,8 / 5,1 / 5,1 s (trước 14,0) | 4,2 / 3,9 / 4,3 s (trước 10,0) | 0,6–1,3 s |
| Biệt thự Pháp | 3,4–5,0 s (trước 5,0) | 2,2–3,6 s (trước 4,3) | 0,6–0,7 s |
| Cổng Nam | 1,3 s (không đổi) | 1,6 s | 0,64 s |

Sau dịch chuyển còn 7–9 chương trình mới, đều có nguồn bất đồng bộ nạp về sau:

- sen trong ao: `lt_plant`, `lt_petal`;
- model GLB (`Material_1`): sư tử đá, đồ nội thất GLB;
- cây: `tp-bigtree-v` / `imp`, chỉ lần đầu trong phiên.

## 4b. Đợt 2 — dựng chia khung

`mansion3d.build()` giờ chỉ tạo bản ghi và một generator (`buildGen`); `update()` chạy generator tối đa 6 ms mỗi khung, giống `stepTien` của tiên phủ. Generator nhả sau mỗi phần:

- mỗi nhà (`estatePiece`)
- đình, tháp
- tường rào, cổng
- mặt nước
- gò và non bộ
- cây
- gộp nền
- đồ bài trí

Xong thì làm nóng shader rồi mới vào cảnh. `furnish` gọi trong lúc đang dựng thì bỏ qua (job tự bày đồ ở bước cuối).

| Điểm tới | Chỉ làm nóng | Thêm chia khung |
|---|---|---|
| Phủ Mughal | khung ổn 4,8–5,1 s · đứng hình 3,9–4,3 s · khựng lớn nhất 0,6–1,3 s | **3,0–3,6 s · 1,2–2,0 s · 0,45–0,50 s** |
| Biệt thự Pháp | 3,4–5,0 s · 2,2–3,6 s · 0,6–0,7 s | **2,4–3,0 s · 0,8–1,5 s · 0,49–0,52 s** |

Tổng hai đợt ở phủ Mughal: khung ổn 14,0 → 3,0–3,6 s, đứng hình 10,0 → 1,2–2,0 s.

Lưu ý khi đo: trong lúc đo, phiên khác đang sửa mã (lỗi `career QUESTS is not defined`, có lúc 3D không khởi tạo được), nên khoảng một nửa số lần chạy hỏng. Bảng trên chỉ lấy các lần chạy trọn.

## 4c. Đợt 3 — dựng sẵn khi đi + làm nóng cả vật đang ẩn

1. **Dựng sẵn khi đi** (`mansion3d.prefetch(x, z)`; gọi từ `main.api.travel` qua `render3d.prefetchAt`):
   - ngay khi bấm dịch chuyển, trong lúc lớp phủ «vó ngựa» che màn (1,2 s), dựng trước bộ đệm `estatePiece` (nhà, đình, tháp, cổng) của tối đa 3 phủ và 8 biệt thự sẽ dựng quanh điểm đến;
   - nạp sẵn khuôn cây (`estate-dress.prefetchTrees`);
   - chạy dần bằng `setTimeout`, mỗi lượt ≤ 12 ms, xong một phần mới nhả;
   - tắt bằng `__noPrefetch`.

   Đo A/B (4 cặp) chưa tách được khỏi nhiễu: khung ổn 2,2–4,0 s, cả hai bản như nhau. Hồ sơ CPU cho thấy JS dựng nhà sau khi tới nơi giảm từ 0,47 s xuống 0,16 s, nhưng phần còn lại do việc khác chi phối (mục 2 bên dưới).
2. **Làm nóng cả vật đang ẩn** (`render3d` setWarmup):
   - `renderer.compile` của three chỉ duyệt vật **đang hiện** (`traverseVisible`), nên bỏ qua: bậc chi tiết chưa tới, thân bậc vừa, nhân bản đang chờ cắt theo hướng nhìn (visible false), cây vườn;
   - các vật đó hiện ra là biên dịch đồng bộ;
   - nay bật tạm mọi vật ẩn trong phần đồng bộ của `compileAsync`, rồi trả lại ngay;
   - áp cho mọi chỗ gọi `warmObject`: công trình mốc, bậc chi tiết nạp dần, biệt phủ.

| Điểm tới | Đợt 2 (chia khung) | Đợt 3 |
|---|---|---|
| Phủ Mughal | khung ổn 3,0–3,6 s · đứng hình 1,2–2,0 s · khựng lớn nhất 0,45–0,50 s | 3,0–4,4 s · **1,1–1,4 s** · **0,30–0,37 s** |
| Biệt thự Pháp | 2,4–3,0 s · 0,8–1,5 s · 0,49–0,52 s | **1,7–2,0 s** · **0,6–0,9 s** · 0,35–0,37 s |

Biệt thự đạt goal ≤ 2,5 s.

Thử thêm `renderer.debug.checkShaderErrors = false` (cờ `__noShaderCheck`): không khác biệt đo được (3,0–3,9 so với 3,9–4,2 s), nên không bật mặc định.

## 4e. Đợt 4 — truy shader còn sót (khoá lệch)

**Đo** (`DIAG=1 node scripts/travel-probe.mjs`): vá `renderer.compile` (đánh dấu chương trình sinh lúc làm nóng), `renderBufferDirect` (ghi lần vẽ > 8 ms kèm chương trình mới / vật liệu / vật / khoá) và `getProgramInfoLog`.

**Kết quả**: mọi lần vẽ chậm đều do chương trình sinh ra **lúc vẽ**, không phải lúc làm nóng (`warm: false`), kể cả vật đã qua `warmObject`. Các khoá cũng có hai biến thể `srgb` và `srgb-linear`.

**Nguyên nhân**:
- Khoá chương trình của three phụ thuộc **đích vẽ**: `toneMapping` và `outputColorSpace` lấy theo `currentRenderTarget`.
- Game vẽ cảnh qua EffectComposer: `RenderPass` vẽ vào render target, nên không tone mapping và đầu ra tuyến tính.
- `compile()` lại chạy với đích là màn hình (ACES, sRGB).
- Vì thế từ trước tới nay **mọi lần làm nóng đều biên dịch sai biến thể**: cả màn nạp, `warmObject` của công trình mốc, bậc chi tiết nạp dần và biệt phủ. Biến thể dùng thật luôn biên dịch đồng bộ lúc vẽ.

**Sửa** (`render3d.compileLike`, dùng ở màn nạp, `warmScene`, `setWarmup`):
- trong phần đồng bộ của `compileAsync`, đặt đích = `composer.readBuffer` (máy không có composer thì giữ màn hình);
- bật tạm các vật ẩn;
- xong thì trả lại đích và độ ẩn ngay.

**Sau sửa**: lúc vẽ không còn sinh chương trình mới, trừ một chương trình bóng (`MeshDepthMaterial` của cây gió). `compile` không biên dịch biến thể bóng.

| Điểm tới | Đợt 3 | Đợt 4 |
|---|---|---|
| Phủ Mughal (4 lần đo) | khung ổn 3,0–4,4 s · đứng hình 1,1–1,4 s · khựng lớn nhất 0,30–0,37 s | **2,2–3,3 s · 0,8–1,3 s · 0,18–0,21 s** |
| Biệt thự Pháp (4 lần đo) | 1,7–2,0 s · 0,6–0,9 s · 0,35–0,37 s | 2,1–3,4 s · 0,8–1,2 s · **0,16–0,23 s** |

Biệt thự đo lần này chậm hơn đợt 3. Đây là nhiễu máy: các cú khựng còn lại đều < 0,25 s, rải đều, không còn cú nào nổi trội.

- **Màn nạp đầu**: 14,8 / 15,3 s, so với 19,3 s đo lúc đầu đợt biệt phủ. Không tăng dù giờ biên dịch cả vật đang ẩn.
- **Tắt kiểm lỗi shader** (`__noShaderCheck`, đo lại 4 cặp): không khác biệt, nên giữ mặc định.

## 4f. Đợt 5 — làm nóng shader bóng

Đo bằng `DIAG` (đếm chương trình sinh ra lúc vẽ). Cách này không phụ thuộc tải máy; FPS lúc đo nhiễu nặng vì có 27 tiến trình trình duyệt headless của các phiên khác.

1. **`render3d.compileLike` biên dịch thêm biến thể bóng.** Với mỗi lưới đổ bóng, hoặc có `customDepthMaterial`, dựng một lưới thay thế cùng hình học và cùng cờ nhân bản. Vật liệu của lưới thay thế giống hệt cái mà `WebGLShadowMap.getDepthMaterial` sẽ dùng:
   - dùng `customDepthMaterial` nếu có, nếu không thì `MeshDepthMaterial(RGBADepthPacking)`;
   - `side = shadowSide ?? đảo(side)`;
   - `map`, `alphaMap`, `alphaTest`, `displacement` lấy theo vật liệu gốc.

   Biên dịch với đích là một render target 1 × 1 tuyến tính, giống bản đồ bóng. Tắt bằng cờ `__noDepthWarm`.
2. **Gió cây phố được vá trước khi biên dịch.** `world3d` gọi `sweepCityWind` mỗi 2 s để vá gió v2 (khoá `:w2`) và gắn vật liệu bóng (`:depth`) cho các ô phố mới, tức là **sau** lúc làm nóng. Giờ `compileLike` gọi `sweepCityWind(obj)` trước.
3. **Ô đồ phố (`citydress`) dựng lúc chạy được làm nóng trước khi vào cảnh.** Trước đây ô được thêm thẳng vào cảnh. `settle` ở màn nạp vẫn thêm thẳng, vì màn nạp đã biên dịch cả cảnh.

**Kết quả `DIAG` ở phủ Mughal:**

| | Trước đợt | Sau đợt |
|---|---|---|
| Chương trình bóng sinh lúc vẽ | 1–2 (cây gió `:w2:depth` 134 ms; `MeshDepthMaterial` chung 63 ms) | **0** |
| Chương trình sinh lúc vẽ, tổng | — | chỉ còn `fx-juice-dust` (12–17 ms) |
| `getProgramInfoLog` > 8 ms | — | 4–6 lần, lần dùng đầu của chương trình đã làm nóng |

Đo thời gian (3 lần, máy có tải): khung ổn 1,7 / 3,2 / 3,9 s, tổng đứng hình 1,0–2,1 s, khựng lớn nhất 0,18–0,34 s, không còn tác vụ dài ≥ 300 ms.

## 5. Chưa đạt / chưa làm

- Còn khựng tới 0,5 s. Đó là một lần gọi bộ dựng một nhà, nặng nhất ở lần đầu của mỗi phong cách (nhà chính Mughal hoặc lâu đài khoảng 0,3 s), không chia nhỏ hơn được nếu không sửa bộ dựng của từng họ. Cộng thêm việc nạp khuôn cây lần đầu (`bigtrees` flatten).
- Goal «khung ổn ≤ 2,5 s ở mọi phủ» mới đạt ở biệt thự (1,7–2,0 s). Phủ Mughal còn 3,0–4,4 s.
- ~~0,65 s biên dịch đồng bộ lúc vẽ~~: đã xử lý ở §4e (khoá lệch đích vẽ).
- Lần dùng đầu một chương trình đã làm nóng vẫn tốn khoảng 20–70 ms (`onFirstUse`), có lẽ do ANGLE hoàn tất ở lần vẽ đầu. Còn khoảng 6 lần như vậy mỗi lần tới nơi.
- ~~Biến thể bóng chưa làm nóng~~: xong ở §4f.
- Hiệu ứng `fx-juice-dust` vẫn biên dịch lúc vẽ (khoảng 15 ms), vì nó tạo ở cảnh gốc khi chạy.
- Goal «khung ổn ≤ 2,5 s ở mọi phủ»: phủ Mughal có lần đạt (2,2 / 2,5 s), có lần chưa (2,9–3,3 s). Biệt thự 2,1–3,4 s. Vẫn chưa ổn định dưới 2,5 s.
- Sen, sư tử đá và đồ GLB nạp bất đồng bộ vẫn biên dịch lúc hiện.
- `updateMatrixWorld` 16 % CPU mỗi khung: cảnh tĩnh chưa tắt `matrixAutoUpdate`. Đây là việc chung về FPS, không riêng dịch chuyển.
- Lần đo trước ghi «30 s màn đen ở cổng Ngoại Thành», nhưng lần này đo cổng Nam chỉ 1,3 s. Con số 30 s có lẽ do cách chờ chụp ảnh trong `scan-scene`, chưa tái hiện được.

## 6. Goal tiếp

- **Khung ổn ≤ 2,5 s ở mọi phủ.**
- Bước kế:
  - ~~dựng khuôn viên theo generator, mỗi khung tối đa 6 ms~~ (xong, đợt 2);
  - dựng sẵn bộ đệm `estatePiece` của các phong cách quanh điểm đến lúc thời gian rảnh, hoặc trong 1,2 s lớp phủ «vó ngựa» trước khi dịch chuyển.
