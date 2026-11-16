# 30 · Kỹ thuật client: kiến trúc, dựng hình, va chạm, hiệu năng

> **Trạng thái:** `[ĐÃ CÓ]`
> **Bộ phận chủ trì:** Client/3D
> **Nguồn sự thật trong mã:** `src/game/mount.js`, `src/game/main.js`, `src/game/render3d.js`, `src/game/world3d.js`, `src/game/assets.js`, `src/game/collide.js`, `src/game/obstacles.js`, `src/game/gen.js`, `src/game/gen.worker.js`, `src/game/terrain-mesh.js`, `src/game/perf.js`, `vite.config.js`; bảng mô-đun ở [A1](phu-luc/A1-ban-do-ma.md)
> **Test:** `scripts/test-game-collide.mjs`, `scripts/test-terrain.mjs`; đo bằng `scripts/perf-load.mjs`, `scripts/shot-city.mjs`
> **Thay thế:** `GAME-V2-THIET-KE` §5 và các mục hiệu năng trong nhật ký; `docs/gdd/13-ky-thuat` là lớp L4; ngân sách chi tiết vẫn ở `DOHOA-MANIFEST`
> **Kiểm với mã ngày:** 2026-11-16

## 30.0 Mục đích, phạm vi, tóm tắt

Chương này cho người viết mã client biết: mã chia lớp thế nào, thêm một thứ vào thế giới phải đụng những đâu, và ngân sách nào không được vượt. Không gồm: máy chủ (§31), kiểm thử và phát hành (§32).

```
game.html ─▶ mount.js ─▶ main.js  (cổng, vòng lặp, điều khiển, bảng, mạng)
                            │
        ┌───────────────────┼─────────────────────────┬──────────────────────┐
        ▼                   ▼                         ▼                      ▼
  mô-đun THUẦN         mô-đun DỰNG HÌNH            mô-đun GIAO DIỆN       engine của app
  (dữ liệu, luật;      (*3d.js, render3d,          (*-ui.js, markup,      (src/engine: lá số,
  chạy được trong      world3d, assets…;           game.css; DOM)         la bàn, lịch, AI…)
  Node và Worker)      three.js)
        │                   ▲
        └── nguồn toạ độ ───┘      Web Worker: sinh kết cấu, lưới địa hình, vị trí cây
```

## 30.1 Ba lớp mô-đun (luật kiến trúc)

`[ĐÃ CÓ]` Luật nền LN-14.

1. **Mô-đun thuần:** chỉ dữ liệu và luật. Không three.js, không DOM, không mạng. Chạy được bằng Node (để test) và trong Worker máy chủ (để máy chủ dùng **cùng luật** với client: `guild-core`, `econ-core`, `estate-core`, `auth-core`, `protocol`).
2. **Mô-đun dựng hình** (`*3d.js` và nhóm hạ tầng dựng hình): đọc mô-đun thuần, dựng lưới. Không tự đặt toạ độ.
3. **Mô-đun giao diện** (`*-ui.js`): dựng nội dung bảng bằng DOM; gọi mô-đun thuần để tính.

Mọi hệ mới phải theo đúng ba lớp. Bằng chứng tuân thủ: bộ test thuần nạp được mô-đun trong Node.

## 30.2 Vòng đời một phiên

`[ĐÃ CÓ]`

1. **Cổng:** nhập thông tin, lễ lật trụ; trong lúc đó nạp nền.
2. **Màn nạp thật:** chờ địa hình, rừng, Sơn Môn và vùng gần; cắt lát va chạm; biên dịch shader **trước** khi mở màn; đẩy ảnh lên card đồ hoạ; vẽ nháp một lượt. Công trình trong tầm gần lên bậc vừa rồi mới mở.
3. **Vòng lặp:** điều khiển → di chuyển và va chạm → cập nhật hệ sống (sinh tồn, ca làm, bệnh…) → mạng → vẽ.
4. **Nạp dần khi chơi:** model, nhân vật, vùng mới được biên dịch song song và đẩy ảnh dần **trước** khi đưa vào cảnh.
5. **Web Worker** sinh kết cấu mặt đất, lưới địa hình, vị trí cây, bản đồ độ sâu nước; không có Worker thì tự chạy trên luồng chính.

## 30.3 Mức đồ hoạ

`[ĐÃ CÓ]` Bảng: `world3d.QUALITY`, `grass.GRASS_Q`, `forest.FOREST_Q`.

| Mức | Khác nhau ở |
|---|---|
| `low` | lưới địa hình thưa, ít cây gần, không bloom, bóng nhỏ; tắt bóng đổ từ đầu; không nạp ảnh nét cao |
| `mid` | lưới và bóng vừa; không bloom (máy đồ hoạ tích hợp không gánh nổi) |
| `high` | lưới dày, bloom, bóng lớn |

- **Tự chọn:** máy dựng hình bằng CPU vào thẳng mức thấp và nhắc bật tăng tốc phần cứng; card tích hợp chọn mức vừa.
- **Độ phân giải động:** khung hình thấp thì hạ tỉ lệ điểm ảnh từng nấc tới một sàn; cao thì nâng lại.
- **Không tự tải lại trang** khi máy chậm; hỏi người chơi trước.
- Người chơi đặt tay mức đồ hoạ thì game không tự hạ. Khoá trên máy: [A7](phu-luc/A7-dieu-khien-luu-tru.md) §A7.3.

## 30.4 Nạp và vẽ model

`[ĐÃ CÓ]` Bậc model: §23.4.

- **Theo khoảng cách:** mỗi công trình bắt đầu bằng bậc xa, lên bậc vừa rồi bậc gần khi người chơi tới; có vùng trễ để không nhấp nháy ở ngưỡng.
- **Nhân bản:** nhà phố, cây, đèn, đá vẽ bằng lưới nhân bản theo bậc; ở xa là khối hộp có mái gộp theo ô. Bộ nhân bản bị **cắt theo hướng nhìn**; bóng chỉ giữ quanh người chơi.
- **Bóng:** công trình gần đổ bóng bằng bản nhẹ vô hình đi kèm, không dùng bản gốc.
- **Danh sách tệp lúc dựng bản:** mã hỏi «model này có bậc này không» từ danh sách sinh lúc build, không thăm dò bằng yêu cầu mạng.
- **Giải phóng:** đổi trang bị hoặc người rời phòng thì huỷ lưới và vật liệu riêng; ảnh dùng chung không huỷ.
- **Số đèn điểm cố định:** đèn rỗi để cường độ 0, không bật tắt (đổi số đèn làm mọi shader biên dịch lại).
- **Dựng lười:** phòng nội thất dựng khi bước vào, giữ một số phòng tối đa; khuôn viên phủ dựng chi tiết khi tới gần, giữ tối đa vài phủ; vùng trời chỉ vẽ khi người chơi ở trên trời.

## 30.5 Va chạm, nền, tìm đường

`[ĐÃ CÓ]` API: `obstacles.js`, `collide.js`.

| Thứ | Cách làm | Dùng khi |
|---|---|---|
| Công trình model | cắt lát ở tầm thân người vào lưới ô nửa mét; công trình lớn được **đặc hoá** (đóng khe, lấp ruột kín) | mọi model đặt lẻ |
| Nhà phố nhân bản | hộp xoay đặt tay theo khung nhà | hàng nghìn nhà; không cắt lát |
| Tường, tháp, cột, cây | đoạn thẳng, vòng tròn | |
| Nền đi được | nền có mặt trên và mặt dưới (cầu, bậc); sàn phòng tra theo ô; **nền trời** chỉ tính khi biết độ cao người | |
| Đỉnh công trình | độ cao đỉnh để leo lên và đứng | |
| NPC và người chơi | vòng chặn động; người chơi khác chỉ tách ở phần hiển thị | |
| Lưới cả thành | lưu theo mảnh dạng bitset (số ô quá lớn cho cấu trúc tập hợp thường) | |

- **Tìm đường:** A* trên lưới, rút gọn theo tầm nhìn thẳng; vướng thì trượt dọc vật cản rồi tính lại; tránh nước.
- **Chừa chỗ đứng:** mọi trạm và cửa có vùng trống đăng ký trước để việc đặc hoá không bịt cửa.

**Năm luật khi thêm một công trình:** (1) toạ độ lấy từ mô-đun thuần; (2) đăng ký va chạm ngay khi đặt, không chờ hình; (3) chừa chỗ đứng cho cửa và trạm; (4) cập nhật ma trận cả chuỗi cha trước khi cắt lát; (5) chạy `test-game-collide` và bộ test bố cục của vùng đó.

## 30.6 Ngân sách hiệu năng

`[ĐÃ CÓ]` Nguồn chuẩn: [DOHOA-MANIFEST](../DOHOA-MANIFEST.md) §3.4 và các đợt đo sau đó; [THANH-MANIFEST](../THANH-MANIFEST.md) §3.11.

| Điểm đo cố định (mức vừa, 1280 × 720) | Ngưỡng |
|---|---|
| Sân Sơn Môn | không quá 2,2 triệu tam giác; từ 24 khung hình mỗi giây |
| Phố | không quá 1,6 triệu tam giác; từ 28 khung hình mỗi giây |
| Rừng | không giảm |
| Mỗi thay đổi về phố | khung hình không giảm quá 10 % so với bản trước; lệnh vẽ tăng không quá 150 |
| Tải | vào game khoảng 10 giây trên mạng thường; model nhà tải thêm không quá 18 MB, nạp theo nhu cầu |
| Vùng trời | cảnh trời (không tính phủ) không quá 25 lệnh vẽ và 120 nghìn tam giác |

**Cách đo:** thêm `?fps` vào địa chỉ game để hiện ô đo; trong bảng điều khiển trình duyệt gọi công cụ đo giật khung của `perf.js`; `scripts/perf-load.mjs` đo tải; `scripts/shot-city.mjs` chụp bộ ảnh cố định; `scripts/live-map.mjs` và `scripts/live-travel.mjs` kiểm trên bản thật.

**Luật:** không tuyên bố «nhanh hơn» khi chưa có số đo trước và sau ở cùng điểm, cùng mức, cùng phiên.

## 30.7 Dựng bản

`[ĐÃ CÓ]` `vite.config.js`: nhiều điểm vào (app và game), chế độ `ios` và `edu`, danh sách tệp model sinh lúc build, uỷ quyền các đường `/api` và WebSocket sang máy chủ dev. Engine nặng (kho kinh sách) chỉ nạp khi cần. Bộ đệm model một ngày, dùng lại bản cũ trong lúc kiểm bản mới (`public/_headers`).

## 30.8 Liên kết, kiểm thử, việc mở

| Hệ | Trao đổi | Chương |
|---|---|---|
| Thế giới | mô-đun thuần là nguồn toạ độ | §10 |
| Mỹ thuật | bậc model, quy trình tài sản | §23 |
| Máy chủ | `net.js`, `protocol.js`; lõi dùng chung | §31 |
| Giao diện | bảng, HUD, điều khiển | §22 |

- `test-game-collide` (256 ca): tường kín, cổng thông, đặc hoá, mọi trạm tới được.
- Việc mở: `VC-009`, `VC-010`, `VC-012`, `VC-003`.
- Nợ kỹ thuật đã biết: `main.js`, `render3d.js`, `stations.js` rất lớn; hằng số tiền còn tên cũ; vài model tiền tố lặp.
