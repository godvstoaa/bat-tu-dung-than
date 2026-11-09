# 08-23 · Công cụ cho người dựng công trình: chế độ gỡ lỗi, trình đặt mảnh trong trình duyệt, vòng lặp sửa nhanh

> Dựng ~120 công trình (và ~870 ngày người ở thánh địa mới) mà chỉ sửa tọa độ trong tệp `.js` rồi tải lại thì chậm và dễ sai. Phần này đặc tả bộ công cụ dev **chạy ngay trong game** (chỉ ở bản dev, không lên bản phát hành), dựa trên những móc đã có: `debugCam`, `debugHour`, `render3d.js › info()`. Tất cả **chưa có — cần làm**.

---

## 1. Tham số URL gỡ lỗi

Chỉ bật khi `import.meta.env.DEV` (Vite) — bản build loại bỏ hoàn toàn mã công cụ (nhập động `import('./devtools/...')`).

| Tham số | Tác dụng | Dùng khi |
|---|---|---|
| `?col=1` | vẽ ô đặc **của tầng hiện tại** thành lưới đỏ mờ trên sàn (bán kính 30 m quanh người chơi); ô chặn động (cửa khóa) màu cam; nền `addPlatform` viền xanh lá với số cao độ | kiểm A7 (chặn vô lý), T-09 thủ công |
| `?col=all` | như trên nhưng mọi tầng, mỗi tầng một màu, dịch Y theo `floorY` | kiểm chồng tầng |
| `?cells=1` | vẽ khung khoang (xanh = đang thấy, xám = đã nạp nhưng ẩn, đỏ = khoang người chơi); tứ giác cửa nhìn (vàng = mở, đỏ = đóng), hình chữ nhật chiếu trên màn của mỗi cửa nhìn đang xét | gỡ lỗi portal culling |
| `?doors=1` | nhãn trạng thái mọi cửa trong 30 m (`DONG` / `MO` / `KHOA`…) + lịch | |
| `?lights=1` | quả cầu nhỏ ở mỗi `LIGHTS` (sáng = đang trong pool, mờ = không), số đèn pool / tổng | kiểm `lightsMax`, lọt sáng |
| `?audio=1` | vẽ đường che âm từ các nguồn đang kêu tới người nghe (qua cửa nhìn nào, dB) | kiểm 08-04 §4.5 |
| `?nav=1` | vẽ đường A* hiện tại (đường ngoài trời trắng, trong nhà lam, cạnh thang tím) + nút đồ thị công trình | gỡ lỗi kẹt |
| `?hour=<0–23>` | đặt giờ (đã có dạng `debugHour`) | lịch cửa / đèn / NPC |
| `?cam=x,y,z,lx,ly,lz` | đặt camera (đã có dạng `debugCam`) | chụp so sánh |
| `?shots=<INT>` | chạy bộ ảnh nghiệm thu (08-12 §3.3) | |
| `?inplace=<INT,INT>` | bật cờ nội thất tại chỗ cho công trình chỉ định, bỏ qua `FEATURES.inplace` | thử công trình chưa phát hành |
| `?edit=<INT>` | mở trình đặt mảnh (§2) | dựng / sửa công thức |
| `?ios=1` | giả lập `features.js` chế độ iOS (tắt trạm bói, bật công năng thay thế) | kiểm D28 |

## 2. Trình đặt mảnh trong trình duyệt (`?edit=<INT>`)

### 2.1 Mục tiêu

Level designer **di chuyển, xoay, thêm, xóa** mảnh mô-đun và đạo cụ ngay trong cảnh thật (đúng ánh sáng, camera), rồi **xuất lại công thức** — không chỉnh tay số trong tệp.

### 2.2 Giao diện

| Vùng | Nội dung |
|---|---|
| Thanh trái | danh mục mảnh của bộ (`kit/<bộ>.json`): tìm theo mã / tên; kéo ra cảnh |
| Thanh phải | thuộc tính mảnh chọn: mã, vị trí cục bộ, `ry`, `n`/`step`, `cell`, `color`, `hook` |
| Cảnh | gizmo dời / xoay (`TransformControls` của three/examples), **bám lưới phụ 0,4 m** và **bám khớp** (`S-COT`, `S-TUONG`… — đỉnh khớp hiện chấm tròn khi kéo gần) |
| Thanh dưới | khoang đang sửa; nút «Nướng va chạm tạm» (chạy `addFootprint` trong trình duyệt cho mảnh đã đổi), «Xuất công thức», «Hoàn tác» |

### 2.3 Hành vi

- Mảnh đặt mới tự nhận `cell` theo khoang chứa tâm đáy; ra ngoài mọi khoang → cảnh báo đỏ.
- Bám khớp: cột chỉ nhận `S-COT`; khung cửa chỉ nhận `S-CUA` trên mảnh tường; đồ đạc bám `S-PHU` (0,4 m) và **không chồng** khung bao đồ khác (cảnh báo).
- Kiểm trực tiếp khi kéo: khoảng trống trước cửa (2,4 m) và lối đi (1,2 m) — vùng vi phạm tô đỏ trên sàn.
- Chế độ «đi thử»: bấm `P` — tạm thoát trình sửa, đi bộ bằng nhân vật với va chạm tạm, bấm lại để về.

### 2.4 Xuất

«Xuất công thức» sinh **đoạn mảng `pieces`** (gom các bản sao thẳng hàng cùng mã thành `n` + `step` nếu khoảng cách đều) và chép vào bộ nhớ tạm + tải xuống tệp `<slug>.pieces.js`; người làm dán vào công thức và commit. **Không** ghi thẳng vào mã nguồn từ trình duyệt (tránh sửa ngoài ý muốn, giữ duyệt qua git).

Đồng thời xuất `<slug>.shots.js` nếu người làm đã ghim góc chụp (nút «Ghim góc camera»).

## 3. Vòng lặp sửa nhanh

| Bước | Công cụ | Thời gian mục tiêu |
|---|---|---|
| Sửa công thức `src/game/int/<slug>.js` | trình soạn thảo | — |
| Vite HMR nạp lại module công thức | `import.meta.hot.accept` trong `buildings.js`: gỡ nhóm khoang cũ (`removeBaked`, dispose), dựng lại công trình đó | ≤ 1 s, không tải lại cả game |
| Va chạm tạm | cắt lát trong trình duyệt (như `collide.js` hiện nay) cho công trình đang sửa; cờ «chưa nướng» hiện góc màn | ngay |
| Nướng chính thức | `node scripts/bld-bake.mjs <slug>` | ≤ 10 s / công trình |
| Test một công trình | `node scripts/test-game-buildings.mjs --only=INT-SM-DIENDONG` | ≤ 5 s |

## 4. Báo lỗi tự động khi chơi thử nội bộ

Bản dev ghi vào `localStorage['huyenquan:devlog']` (và hiện bảng `?devlog=1`):

| Sự kiện | Ghi |
|---|---|
| Gỡ kẹt (08-04 §3.6) | INT, khoang, ô, `lv`, ảnh chụp 256² |
| Camera kẹp chạm tường > 2 s | INT, khoang, vị trí camera |
| Cửa đổi trạng thái > 6 lần / 10 s | id cửa (nghi lặp mở – đóng) |
| Khoang nạp > 2,5 s (A) / 0,8 s (C) | INT, thời gian, số mảnh |
| Trạm bấm mà không có `engine` / `quest` | id trạm |
| Đèn pool đầy (mọi `POOL_N` dùng) trong khoang | INT, khoang, số đèn khai |

Nút «Gửi nhật ký» xuất JSON để đính kèm vào phiếu nghiệm thu (08-12 §1.2).

## 5. Công cụ dòng lệnh tổng hợp

| Lệnh | Việc |
|---|---|
| `npm run bld -- void <slug>` | `bld-void` + in ASCII như 08-18 |
| `npm run bld -- cut <slug>` | gọi Blender headless chuỗi `import → cut_door → hollow → export` |
| `npm run bld -- pack <slug>` | `bld-split` + `bld-pack` |
| `npm run bld -- bake <slug\|all>` | `bld-bake` |
| `npm run bld -- check <slug\|all>` | kiểm pipeline P1–P10 (08-02 §11) + test công trình |
| `npm run bld -- kit <bộ>` | đóng gói bộ mô-đun + `kit/<bộ>.json` + tăng `version` |
| `npm run test:buildings` | toàn bộ `test-game-buildings.mjs` |

Một tệp điều phối `scripts/bld.mjs` gọi các script con (đặt cùng thư mục `scripts/` như các script `meshy-*.mjs` hiện có).
