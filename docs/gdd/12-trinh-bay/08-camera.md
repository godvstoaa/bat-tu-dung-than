# 12 · Trình bày — Phần 08: Camera

> Đặc tả camera ngôi thứ ba (giữ hệ đang chạy trong `render3d.js`), camera trong điện, camera hội thoại, camera điện ảnh cho cảnh cắt và nghi thức, chế độ chụp ảnh, và trợ năng. Mã preset camera viết dạng khóa cấu hình `cam.<tên>` (không phải mã định danh tài liệu).

---

## 1. Thông số rig hiện có (nguồn: `render3d.js › create3D`)

### 1.1 Ống kính và kết xuất

| Thông số | Giá trị | Dòng code |
|---|---|---|
| Loại | `PerspectiveCamera` | `new THREE.PerspectiveCamera(45, 1, 0.3, 9000)` |
| FOV dọc | **45°** ngang / **64°** khi `aspect < 0,8` (màn dọc) | `resize()` |
| Mặt phẳng gần / xa | 0,3 m / 9.000 m | — |
| Sương | `Fog('#d8cbb0', 260, 1900)`, màu đổi theo giờ (`timeLook`) | — |
| Tone mapping | ACES Filmic, phơi sáng 1,05 | — |
| Bloom | `UnrealBloomPass(512², strength 0,28, radius 0,5, threshold 0,96)` khi chất lượng có `bloom` và chưa `lowQuality` | — |
| Pixel ratio | `min(dpr, cảm ứng ? 1,5 : 2)`; tự hạ về 1 khi < 35 fps | `resize()`, vòng fps |
| Bóng mặt trời | hộp ±45 m, gần 1 / xa 400, bám người chơi | `sun.shadow.camera` |

### 1.2 Trạng thái rig

```js
cam = { yaw: 0, pitch: 0.4, dist: 15, target: Vector3(3.5, 1.2, 3.5), yawGoal: 0 }
```

| Biến | Đơn vị | Mặc định | Biên | Điều khiển |
|---|---|---|---|---|
| `yaw` / `yawGoal` | rad | 0 | tự do | kéo ngang: `yawGoal -= dx × 0,006`; phím Q / R: `±π/4`; giảm chấn `yaw += (goal − yaw) × min(1, dt × 8)` |
| `pitch` | rad | 0,4 (≈ 23°) | −0,75 … 1,15 (≈ −43° … 66°) | kéo dọc: `pitch += dy × 0,004` (kéo **lên** = ngước nhìn trời) |
| `dist` | m | 15 | 6 … 48 | lăn chuột `dist × (1 + deltaY × 0,0012)`; chụm hai ngón `dist × (pinch_cũ / pinch_mới)` |
| `target` | m | — | — | bám người chơi (§1.3) |

**Phân biệt chạm và kéo:** con trỏ đi > 8 px là kéo (xoay); nhả trong < 450 ms và chưa kéo, một ngón là **chạm** → `pick()` → đi tới. Hai ngón là chụm (không xoay).

### 1.3 Bám người chơi

| Bước | Công thức | Ý |
|---|---|---|
| điểm nhìn trước mặt | `ahead = ngồi ? 0,6 : (dọc ? 3,4 : 1,0)` m, lùi theo `−yaw` | màn dọc: người chơi nằm 1/3 dưới khung, phần trên dành cho quán |
| độ cao điểm nhìn | `gy + (ngồi ? 0,9 : 1,3)` m | ngang ngực / đầu |
| làm mượt | `target.lerp(goal, min(1, dt × 5))` | ≈ 0,2 s đuổi kịp |
| nhảy thẳng | nếu lệch > 40 m (dịch chuyển, trạm) → gán thẳng | không trượt qua nửa bản đồ |
| khoảng cách thực | `cd = dist × (ngồi ? 0,75 : 1) × (dọc ? 0,9 : 1)` | ngồi lại gần hơn |

### 1.4 Đặt camera

```
elev   = max(pitch, 0.06)
lookUp = pitch < 0.15 ? (0.15 − pitch) × cd × 2.4 : 0
pos    = target + ( sin(yaw)·cos(elev)·cd ,  sin(elev)·cd ,  cos(yaw)·cos(elev)·cd )
pos.y  = max(pos.y, groundY(pos.x, pos.z) + 0.6)          // không chui xuống đất
lookAt = target + (0, lookUp, 0)                          // ngước: nâng điểm nhìn thay vì hạ camera dưới đất
```

**Ngước nhìn trời:** khi `pitch < 0,15`, camera không hạ thấp hơn `elev 0,06` mà **nâng điểm nhìn** lên `(0,15 − pitch) × cd × 2,4` — ở `pitch −0,75`, `cd 15`: điểm nhìn cao thêm ≈ 32 m → thấy mái, trời, Côn Lôn (đảo trời). Đây là cách hiện có để «ngước nhìn» mà không xuyên đất.

### 1.5 Trong điện (phòng ngoài bản đồ)

Điện thờ (`world.js › ROOMS`) dựng ở toạ độ riêng (x ≈ 1.500–2.000 m) với kích thước `w × d × h` (vd Chính Điện Tam Thanh 34 × 28 × 14 m; Vận Mệnh Các 20 × 72 × 11 m; Thái Tuế Điện 28 × 24 × 13 m). Khi điểm nhìn ở trong một phòng:

```
pos.x ∈ [origin.x − (w/2 − 0.9), origin.x + (w/2 − 0.9)]
pos.z ∈ [origin.z − (d/2 − 0.9), origin.z + (d/2 − 0.9)]
pos.y ≤ h − 1
```

Đèn: chỉ bật đèn điểm của phòng đó (`lightRoom`), cường độ ×14.

### 1.6 Làm mờ công trình che khuất

Mỗi khung: tia từ camera tới đầu người chơi (`gy + 1,2`). Với mỗi nhóm công trình có `fade` (Chính Đường, Trà Thất, công trình lớn qua `onBig`): nếu tia cắt hộp bao **trước** đầu người chơi ≥ 0,5 m và đầu không nằm trong hộp → opacity mục tiêu **0,22**, ngược lại 1; nội suy `× min(1, dt × 8)`; `depthWrite` chỉ khi opacity > 0,95. Thêm `world.occlusion(...)` cho cây / địa hình.

### 1.7 Gỡ lỗi và kiểm thử

`debugCam {pos, look}` (camera tự do), `setView({yaw, pitch, dist})`, `snapshot()`, `info()` (vị trí camera, mục tiêu) — dùng lại cho chế độ chụp ảnh (§6) và kiểm thử ảnh (tài liệu 13).

---

## 2. Camera ngoài trời — bổ sung (★)

### 2.1 Mặc định theo bối cảnh

| Bối cảnh | `pitch` | `dist` | `ahead` (dọc / ngang) | FOV (dọc / ngang) | Ghi chú |
|---|---|---|---|---|---|
| sân Sơn Môn (hiện có) | 0,40 | 15 | 3,4 / 1,0 | 64 / 45 | — |
| phố Huyền Thành ★ | 0,32 | 12 | 3,0 / 1,0 | 62 / 45 | phố hẹp, nhìn ngang tầm biển hiệu |
| thần đạo leo núi (Võ Đang, Yên Tử) ★ | 0,22 | 14 | 4,0 / 1,6 | 64 / 48 | nhìn **lên dốc**: mục tiêu nâng theo độ dốc (§2.6) |
| hồ, bến đò (Cùng Thông, Bút Tháp) ★ | 0,30 | 18 | 3,4 / 1,0 | 64 / 45 | rộng mặt nước |
| cao nguyên (Tạng Địa) ★ | 0,26 | 22 | 3,4 / 1,0 | 66 / 50 | trời lớn |
| hang, ngõ hẹp (Phong Đô, Miêu Cương) ★ | 0,45 | 9 | 2,0 / 0,8 | 60 / 45 | tránh kẹt vách |
| ngự kiếm | 0,35 | 20 | 4,0 / 2,0 | 66 → 72 theo tốc độ / 50 → 56 | FOV giãn tối đa +6° khi bay nhanh (tắt khi `reduced`) |

Chuyển giữa bối cảnh: nội suy 1,2 s (`ease-in-out`), **không** ghi đè giá trị người chơi đã chỉnh tay trong 30 s gần nhất (tôn trọng ý người chơi; chỉ áp dụng mặc định khi họ chưa động vào).

### 2.2 Va chạm camera (★)

Hiện camera chỉ kẹp đất và kẹp hộp phòng; ngoài trời camera có thể xuyên tường thành / vách núi (được che bằng làm mờ §1.6 chỉ cho nhóm có `fade`). Bổ sung:

1. **Tia lò xo:** bắn tia từ điểm nhìn ra vị trí camera mong muốn; nếu chạm vật thể tĩnh thuộc lớp «chắn camera» (vách núi, tường thành, công trình lớn không `fade`) → kéo camera vào tới điểm chạm − 0,4 m; nhả ra lại với tốc độ 4 m/s (không bật «pop» đột ngột).
2. **Khoảng cách tối thiểu** khi bị kéo: 2,2 m; nhỏ hơn thì ẩn mô hình người chơi xuống 30% opacity để không che màn.
3. Cây, cột, lan can: **không** chắn camera (làm mờ thay vì kéo vào — tránh camera giật khi đi qua rừng).

### 2.3 Tự xoay theo hướng đi (★ tùy chọn, mặc định tắt)

Khi đi bằng cần ảo > 2 s theo một hướng lệch camera > 60°, `yawGoal` từ từ quay sau lưng nhân vật với tốc độ 0,6 rad/s. Tắt ngay khi người chơi chạm kéo. Tùy chọn trong Cài đặt › Điều khiển («Camera tự theo sau»).

### 2.4 Nhắm mục tiêu mềm (★)

Khi đứng gần trạm / NPC (nút hành động hiện) và người chơi không chạm camera trong 3 s: yaw lệch tối đa 15° để cả nhân vật và trạm cùng nằm trong khung. Không áp dụng khi đang đi.

### 2.5 Đổi vùng và trạm

Màn chuyển (UI-14) che lúc camera nhảy. Sau khi tới: camera đặt yaw sao cho **cổng chính / công trình hạng A** của vùng nằm giữa khung (dữ liệu «điểm nhìn đến» mỗi vùng, tài liệu 07 cung cấp toạ độ).

### 2.6 Dốc và bậc thang

Khi độ dốc dưới chân > 12° (tính từ `groundY` trước / sau 2 m): `ahead` tăng 40% và điểm nhìn nâng theo cao độ đất ở điểm trước mặt (nhìn lên bậc), `pitch` mặc định giảm 0,08. Xuống dốc: ngược lại. Giúp «thần đạo ngàn bậc» của Võ Đang thấy được đích.

---

## 3. Camera trong nhà

### 3.1 Luật chung (★ thêm vào luật kẹp hộp phòng §1.5)

| Thông số | Ngoài trời | Trong điện | Lý do |
|---|---|---|---|
| `dist` mặc định | 15 | **8** (trần 12) | phòng 20–34 m rộng; xa hơn thì kẹp tường liên tục |
| `pitch` mặc định | 0,40 | **0,18** (thấp) | §12 bản tổng: «camera trong nhà tự hạ góc» — nhìn tượng thần từ dưới lên, giữ uy nghi |
| `pitch` trần | 1,15 | **0,55** | không nhìn từ trần xuống (thấy lộ trần mỏng) |
| FOV | 45 / 64 | **50 / 66** | góc rộng hơn bù khoảng cách gần |
| `ahead` | 1,0 / 3,4 | 0,8 / 2,4 | — |
| làm mờ | nhóm `fade` | **cột** (opacity 0,35) và xà thấp | cột đỏ hàng lang hay chắn |

### 3.2 Mái mờ cho công trình đi vào tại chỗ (★)

Canon §8.2 yêu cầu công trình **đi vào được tại chỗ** (không chỉ phòng ngoài bản đồ). Khi người chơi bước qua ngưỡng cửa của công trình có mô-đun mái tách rời:

1. Mái (và tầng trên nếu có) mờ về **0,0** trong 0,4 s; giữ lại **viền mái** (diềm, đầu đao) ở 0,35 để còn thấy hình công trình.
2. Thêm «trần giả» tối phía trên để ánh sáng trong nhà không lọt trời.
3. Camera chuyển sang thông số §3.1, `pitch` có thể lên tới 0,9 (nhìn từ trên xuống kiểu «nhà búp bê») — ngoại lệ duy nhất cho phép nhìn cao trong nhà, vì mái đã ẩn.
4. Ra khỏi cửa: mái hiện lại 0,4 s, thông số ngoài trời trở lại.

Bảng công trình nào dùng cách «mái mờ» và công trình nào dùng «phòng ngoài bản đồ» do tài liệu 08 (`INT-<bld>`) quy định.

### 3.3 Chỗ ngồi

Ngồi (bồ đoàn Trà Thất, bàn thầy, ghế lễ): `dist × 0,75` (đã có), `ahead 0,6` (đã có). ★ Thêm: khi ngồi > 4 s, camera tự lượn chậm sang bên 20° rồi dừng (cảm giác «ngồi lại»), tắt khi `reduced`.

### 3.4 Camera hội thoại (UI-40)

| Kiểu | Khi | Bố cục |
|---|---|---|
| **Qua vai** (mặc định) | thoại 1–1 | camera sau vai phải người chơi 0,6 m, cao ngang mắt, NPC ở 1/3 phải khung; FOV 40 (ngang) / 52 (dọc) |
| **Hai người ngang** | NPC đang làm việc (rót trà, viết) | camera vuông góc trục hai người, 3 m, thấy tay NPC |
| **Ngước** | NPC uy nghi (Trương Thiên Sư trên đại đường, Phán quan) | camera thấp ngang hông người chơi, nhìn lên 12° |
| **Ngồi đối diện** | Vân Cốc «Con ngồi đi.» | cả hai ngồi, camera ngang bàn trà |

Đổi người nói: **không** cắt qua lại từng câu (gây chóng mặt trên màn nhỏ); chỉ cắt khi đổi người nói **và** câu > 40 ký tự, tối thiểu 3 s giữa hai lần cắt.

### 3.5 Thông số từng điện đang có (`world.js › ROOMS`)

Hộp kẹp camera = `(w/2 − 0,9) × (d/2 − 0,9)`, trần `h − 1` (luật §1.5). Bảng dưới thêm mặc định ★ theo §3.1 cho từng điện.

| Điện | `w × d × h` (m) | Hộp camera (± x, ± z, trần) | Tượng / vật chính | `dist` mặc định | `pitch` | Hướng nhìn khi vào | Ghi chú |
|---|---|---|---|---|---|---|---|
| Chính Điện Tam Thanh | 34 × 28 × 14 | ±16,1 · ±13,1 · 13 | ba tượng Tam Thanh (Linh Bảo −6,5, Nguyên Thủy 0, Đạo Đức +6,5) | 9 | 0,16 | thẳng vào tượng giữa | điện lớn nhất; Thầy Giải Quẻ (`que`) đặt lệch trái — camera không che bàn thầy |
| Văn Xương Các | 24 × 20 × 12 | ±11,1 · ±9,1 · 11 | tượng Văn Xương | 8 | 0,18 | thẳng tượng | — |
| Đẩu Mẫu Điện | 24 × 20 × 12 | ±11,1 · ±9,1 · 11 | tượng Đẩu Mẫu | 8 | 0,12 | thẳng tượng, ngước nhẹ (trần sao — UI-93) | `cam.skyward` dùng ở đây |
| Lão Quân Điện | 24 × 20 × 12 | ±11,1 · ±9,1 · 11 | tượng Đạo Đức Thiên Tôn | 8 | 0,18 | thẳng tượng | — |
| Vận Mệnh Các | 20 × 72 × 11 | ±9,1 · ±35,1 · 10 | bia tổng quan ở lối vào (−5,5; 29,5) + 9 cổng dọc lối giữa (`z = 25 − 6i`) | 7 | 0,22 | dọc lối giữa, thấy cổng kế tiếp | điện dài: camera **sau lưng** theo trục z, không xoay ngang quá ±50° (thấy được chuỗi cổng như hành lang thời gian) |
| Thái Tuế Điện | 28 × 24 × 13 | ±13,1 · ±11,1 · 12 | bàn lễ Thái Tuế + đèn an Thái Tuế (`lamps`) | 8 | 0,20 | thẳng bàn lễ | `cam.lamp` khi thắp đèn |

---

## 4. Camera điện ảnh (cảnh cắt, nghi thức)

### 4.1 Hệ preset

Mỗi cảnh cắt `CUT-xxx` (tài liệu 03) là một danh sách **đoạn quay**, mỗi đoạn tham chiếu một preset camera và thông số:

```json
{ "shot": "cam.orbit", "subject": "player", "from": { "yaw": 0.2, "pitch": 0.3, "dist": 6 },
  "to": { "yaw": 1.1, "pitch": 0.15, "dist": 4 }, "dur": 4.0, "ease": "ink", "fov": 40 }
```

### 4.2 Danh mục preset

| Preset | Mô tả | Thông số chính | Dùng ở |
|---|---|---|---|
| `cam.ascend` | rời vai, xoắn ốc lên cao 12 m quanh nhân vật, rồi nhìn xuống | 9 s, yaw +π, dist 4 → 14, pitch 0,2 → 0,9 | UI-33 đột phá |
| `cam.lamp` | cận ngọn đèn, lấy nét nông (bloom tăng 0,1) | 1,2 s, dist 1,2, FOV 30 | thắp đèn Thái Tuế, bái Đẩu |
| `cam.build` | bay từ chỗ người chơi tới công trình đạo tràng, vòng nửa vòng | 2,5 s, cao 25 m | UI-66 |
| `cam.skyward` | từ sau lưng ngước lên trần / trời | 2 s, pitch → −0,6 | bái Đẩu, Côn Lôn |
| `cam.reveal` | mở màn vùng mới: cẩu cao từ thấp sau lùm cây lên lộ toàn cảnh | 6 s, cao 2 → 40 m | lần đầu tới thánh địa |
| `cam.talk` | §3.4 | — | thoại |
| `cam.orbit` | quỹ đạo quanh chủ thể | tham số | chung |
| `cam.dolly` | trượt thẳng theo ray | tham số | rước kiệu, hành hương |
| `cam.static` | khung tĩnh có rung tay nhẹ (biên độ 0,02 rad) | tham số | thoại dài |
| `cam.topdown` | nhìn thẳng xuống | pitch 1,5, FOV 35 | UI-85 sửa nhà, UI-88 mạn-đà-la |
| `cam.mirror` | đối diện nhân vật (mặt trước) | dist 3, yaw +π | UI-72 phòng thử (cảnh phụ), lễ nhập môn bản 3D (M2) |
| `cam.river` | lướt sát mặt nước theo đèn hoa đăng trôi | 5 s, cao 0,6 m | thả đèn, Vu Lan |

### 4.3 Ngữ pháp quay (luật cho người dựng cảnh)

1. **Quy tắc 180°** giữa hai nhân vật đang nói — không vượt trục.
2. Mở cảnh bằng **khung toàn** (thấy nơi chốn, kiến trúc — trụ cột T4), rồi mới vào trung / cận.
3. Kiến trúc thờ tự: không đặt camera **trên đầu tượng thần** nhìn xuống, không quay lưng tượng (tôn trọng — tài liệu 14). Góc nhìn tượng: ngang hoặc từ dưới lên.
4. Màn dọc: bố cục dọc theo trục thẳng (người trên – vật dưới); không dùng khung toàn ngang rộng làm cảnh chính.
5. Mỗi đoạn quay ≥ 2,5 s; tốc độ góc ≤ 25°/s (chống say).
6. Lấy nét nông chỉ ở chất lượng Cao; Thấp / Vừa: bỏ, không giả bằng mờ toàn khung.
7. Không cắt ngang lúc nhân vật đang lạy / chắp tay (để trọn động tác).

### 4.4 Trả quyền điều khiển

Kết thúc cảnh: camera nội suy 0,8 s về rig người chơi với `yaw` = hướng nhân vật đang nhìn, `pitch` và `dist` = **giá trị người chơi đang dùng trước cảnh** (không đặt lại).

---

## 5. Preset camera cho mini-game (khai báo trong UI-80)

| Mini-game | Preset | Thông số |
|---|---|---|
| UI-81 Tĩnh tọa | `cam.static` trước mặt, thấp | dist 3,5, pitch 0,05, FOV 40; lượn chậm ±5° 60 s / chu kỳ |
| UI-82 Kết phù | giao diện 2D phủ, cảnh mờ phía sau | — |
| UI-83 Khoa cử | giao diện 2D; cảnh trường thi mờ | — |
| UI-85 Sửa nhà | `cam.topdown` ↔ ngoài trời trong nhà | xoay 90° theo nút ⟲ |
| UI-88 Mạn-đà-la | `cam.topdown` | khóa |
| UI-91 Y dược (hái) | camera thường; (sắc) cận lò | dist 2,5 |
| UI-92 Sám hối | sau lưng thấp, tượng phía trước | dist 4, pitch 0,1 |
| UI-93 Bái Đẩu | `cam.skyward` khi mỗi sao sáng, về lại sau 1,5 s | — |
| UI-94 Thả đèn / phóng sinh | `cam.river` / ngước theo chim | — |
| UI-96 Bánh xe kinh | qua vai, bám đường vòng quanh điện | — |
| UI-97 Ngự kiếm | §2.1 hàng ngự kiếm | — |

---

## 6. Chế độ chụp ảnh — camera (giao diện ở UI-98)

| Thông số | Biên | Bước | Ghi chú |
|---|---|---|---|
| Vị trí tự do | cầu bán kính 30 m quanh nhân vật | — | va chạm đất và hộp phòng như rig chính |
| Tốc độ bay | 1–8 m/s | — | cần trái: trượt; kéo phải: xoay |
| FOV | 20–90° | 1° | — |
| Nghiêng (roll) | ±20° | 1° | — |
| Giờ ánh sáng | 0–24 h | 15 phút | `debugHour` (đã có), chỉ trong chế độ chụp |
| Phơi sáng | 0,7–1,4 | 0,05 | `toneMappingExposure` |
| Lấy nét | tự / tay (khoảng cách) | — | chỉ chất lượng Cao |
| Lưới | tắt / 1/3 / đường chéo | — | — |
| Ẩn | người khác, tên, hiệu ứng gia trì, HUD | — | người khác ẩn mặc định |

Thoát chế độ chụp: camera trở lại rig với thông số trước khi vào.

---

## 7. Trợ năng camera

| Tùy chọn | Ảnh hưởng |
|---|---|
| Giảm chuyển động (`reduced`) | cảnh cắt: cắt cứng thay vì bay, preset `cam.ascend` → khung tĩnh; không FOV giãn khi bay; không lượn ngồi; không rung tay `cam.static`; chuyển bối cảnh tức thì |
| Rung lắc camera: tắt | bỏ mọi biên độ rung (kể cả nghi thức) |
| Độ nhạy xoay | ×0,5 … ×2 trên `0,006 / 0,004` rad/px |
| Đảo trục dọc | đổi dấu `dy` (hiện kéo lên = ngước nhìn) |
| Khoảng cách mặc định | 8 / 15 / 22 m (người hay say chọn xa) |
| Camera tự theo sau | §2.3 (bật giúp người chỉ dùng một tay) |
| Khóa góc nhìn | tắt kéo xoay; chỉ Q / R và nút xoay 45° trên màn (★ hai nút nhỏ cạnh đĩa la bàn UI-17) |
| FOV bổ sung | +0 / +5 / +10° (giảm say khi màn nhỏ) |

**Chống say (luôn bật):** tốc độ yaw giảm chấn tối đa 3 rad/s; không xoay camera khi người chơi không yêu cầu, trừ §2.4 (≤ 15°, chậm) và §2.3 (nếu bật).

---

## 8. Nghiệm thu camera

1. Đi khắp sân Sơn Môn và Huyền Thành: camera không xuyên tường thành, không chui đất, không kẹt sau cây.
2. Vào mọi điện thờ đang có: tượng thần luôn thấy được ở khoảng cách mặc định; không nhìn thấy mặt ngoài tường từ bên trong.
3. Màn dọc 390 × 844: người chơi ở dải 55–75% chiều cao khung khi đứng yên.
4. Ngự kiếm 420 m: không thấy rìa bản đồ trống (sương che), không giật khi đổi chunk.
5. 20 cảnh cắt đầu: không vượt trục, tốc độ góc ≤ 25°/s (kiểm bằng công cụ đọc preset).
6. Bật giảm chuyển động: không còn chuyển động camera nào không do người chơi điều khiển, trừ bám theo nhân vật.
