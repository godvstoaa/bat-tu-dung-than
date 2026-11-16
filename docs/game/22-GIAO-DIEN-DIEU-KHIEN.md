# 22 · Giao diện và điều khiển

> **Trạng thái:** `[ĐÃ CÓ]`; §22.5 là `[ĐỀ XUẤT]` (chuẩn rút từ bản tầm nhìn, chưa kiểm hết trong mã)
> **Bộ phận chủ trì:** Client/UI
> **Nguồn sự thật trong mã:** `src/game/main.js`, `src/game/markup.js`, `src/game/game.css`, `src/game/map-ui.js`, `src/game/places-ui.js`, `src/game/econ-ui.js`, `src/game/audio.js`, `src/game/haptics.js` và các tệp `*-ui.js`; danh sách phím, phần tử HUD ở [A7](phu-luc/A7-dieu-khien-luu-tru.md)
> **Test:** `scripts/test-game-map.mjs`, `scripts/test-game-heaven.mjs` (menu Địa điểm); phần còn lại kiểm bằng ảnh chụp
> **Thay thế:** `GAME-SINH-TON-KINH-TE-DAC-TA` §23; `NHA-DIADIEM-MANIFEST` §3 vẫn hiệu lực; `docs/gdd/12-trinh-bay` là lớp L4
> **Kiểm với mã ngày:** 2026-11-16

## 22.0 Mục đích, phạm vi, tóm tắt

Giao diện phải để thế giới làm chủ: ít chữ, ít nút, việc gì cũng tới được trong vài chạm. Màn dọc điện thoại là chuẩn số một. Không gồm: nội dung từng bảng (chương hệ thống), dựng hình (§30).

| Phần | Một dòng | Mục |
|---|---|---|
| Khung màn hình | cảnh 3D, HUD mỏng, một bảng trượt, thông báo | §22.1 |
| Điện thoại | joystick động, nút ngữ cảnh, menu nan quạt, bản đồ nhỏ | §22.2 |
| Bàn phím, chuột | bảng phím | §22.3 |
| Tìm đường | menu «Địa điểm», bản đồ, xe ngựa | §22.4 |
| Chuẩn hình thức | màu, cỡ chữ, vùng chạm, trợ năng | §22.5 |
| Âm thanh, rung | tổng hợp, mặc định tắt | §22.6 |

## 22.1 Khung màn hình

`[ĐÃ CÓ]` Phần tử: [A7](phu-luc/A7-dieu-khien-luu-tru.md) §A7.2.

- **Cổng:** tên, giới tính, ngày giờ sinh, nút đăng nhập; rồi lễ lật trụ; rồi màn nạp thật (chờ địa hình, công trình gần, biên dịch shader xong mới mở).
- **HUD:** tiền, ba thanh sinh tồn (nhấp nháy khi thấp), Phúc Khí, số người trong phòng, trạng thái lưu mây, nút âm thanh. Thanh thể lực chỉ hiện khi chưa đầy. Đang thụ án hoặc đang trong ca thì có huy hiệu đếm.
- **Bảng:** một bảng trượt duy nhất (`hq-panel`) cho mọi nội dung; mở bảng mới thay bảng cũ. Esc hoặc nút đóng.
- **Nút ngữ cảnh** (`hq-prompt`): hiện việc làm được với vật gần nhất.
- **Thông báo** (QĐ-29): hàng đợi, một thông báo mỗi 1,5 giây, gộp trùng. Đầu ngày chỉ một thẻ «Sáng nay». Không báo từng việc vặt; NPC nói thưa.
- **Bong bóng thoại và nhãn tên:** nhãn gian chỉ hiện ở gần và không xuyên tường.
- **Bảy thẻ Kho đồ** (phím I): Kho · Ruộng · Bếp · Chợ · Tiệm · Hộ tịch · Thầy mệnh (§17.7).
- **Sổ Mệnh:** Tu học · Hồ sơ · Xăm · Đèn · Thành tựu · Cài đặt (bản iOS ẩn Xăm, Đèn).

## 22.2 Giao diện và thao tác trên điện thoại

> **Trạng thái:** `[ĐÃ CÓ]` (P16): joystick động, menu nan quạt, bản đồ nhỏ và lớn, vuốt để bay, con quay tuỳ chọn, khoá 30 khung hình. Cần thử trên máy thật.

### 22.2.1 Bố cục

```
┌─────────────────────────────────────────────────────────────┐
│ [Bản đồ nhỏ · giờ can chi · thời tiết]   [Âm Đức ▮▮▮] [☰ Menu]│
│                                                             │
│                 THẾ GIỚI (không rác giao diện)              │
│                                                             │
│ [No ▮ Tỉnh ▮ Khí huyết ▮]                       [Ca làm …]   │
│ (cần điều khiển hiện ở chỗ chạm)        [NÚT NGỮ CẢNH lớn]   │
│                                         [Nhảy/Bay] [Dùng]   │
└─────────────────────────────────────────────────────────────┘
```

**So với hiện tại:**
- Joystick cố định (`#hq-stick`, bán kính 46 px) → thành **joystick động**.
- Nút gợi ý `#hq-prompt` → thành **nút ngữ cảnh** lớn ở góc phải dưới.
- Các nút trên thanh dưới (Sổ tay, Tủ đồ, Xã giao, Nhiệm vụ) và Menu → gom vào **menu nan quạt**.
- Bộ đếm Phúc Khí / Ngọc / chuỗi ngày → vào menu, chỉ chừa thanh Âm Đức.

### 22.2.2 Thao tác chạm

- **Joystick động:**
  - Chạm bất kỳ đâu ở nửa dưới bên trái thì cần hiện ngay dưới ngón tay; nhấc tay thì ẩn.
  - Vùng chết 8 px, bán kính 56 px.
  - Chạm nhanh không kéo (< 150 ms, < 10 px) vẫn là **chạm để đi** như cũ.
- **Nút ngữ cảnh** (64 px, trong tầm ngón cái phải): icon đổi theo vật gần nhất, ưu tiên:

  | Ưu tiên | Đứng gần | Icon / hành động | Có từ |
  |---|---|---|---|
  | 1 | NPC | 💬 Trò chuyện | NPC-AI G0–G2, P6 |
  | 2 | Bảng / quầy | 📜 Bảng Chiêu công, quầy, chỗ ngủ | P1–P2 (có) |
  | 3 | Bến thuyền, bờ nước có cá | 🛶 / 🎣 | phiên sông nước, câu cá sau |
  | 4 | Cây cho phép đốn | 🪓 | P9 |
  | 5 | Bếp | 🍳 | P10 |
  | 6 | Ghế / bồ đoàn | Ngồi | có |
  | 7 | Cửa | Vào | có |

  Nhấn giữ: mở danh sách nếu cùng lúc có nhiều thứ để làm.
- **Bay trên điện thoại:**
  - Vuốt nút Nhảy lên thì cất cánh. Khi đang bay, nút đổi thành Lên / Xuống (thay `#hq-altpad`) và Hạ cánh.
- **Con quay hồi chuyển** (tùy chọn, mặc định tắt):
  - Nghiêng máy để liệng hướng bay; vùng chết ±5°, tối đa ±30°.
  - Hiệu chỉnh khi bật.
  - iOS phải xin quyền `DeviceOrientationEvent.requestPermission()` trong một lần chạm; bị từ chối thì tắt và báo.
- **Tay trái:** tùy chọn đảo bố cục trái / phải.
- **Rung:** `haptics.js` có sẵn, rung nhẹ khi đổi icon ngữ cảnh và khi cất cánh / hạ cánh.

### 22.2.3 Menu nan quạt (☰)

| Nhóm | Gồm (có sẵn → mới) |
|---|---|
| **Bát Tự & Vận Trình** | lá số, Dụng / Hỷ / Kỵ, xung hợp trong ngày (Sổ tay, Bia Vận Mệnh có sẵn); quẻ đầu ngày (§18.2) |
| **Túi Đồ & Tủ Thuốc** | túi đồ, đồ ăn và độ tươi (P8), thuốc (P3), nguyên liệu (P9) |
| **Bất Động Sản & Gia Sản** | nhà riêng (có), quán / tiệm (P11), động phủ đảo bay (sau) |
| **Quan Hệ & Khế Ước** | hôn nhân (P12), sổ nợ (P3), hợp đồng làm thuê và chỗ làm (P2 có), uy tín thầy mệnh lý (P13) |

**Quy chuẩn chung:**
- Mở / đóng bằng một chạm; vuốt ra ngoài để đóng.
- Tôn trọng `safe-area-inset`.
- Ô chạm ≥ 44 pt, chữ ≥ 14 px.
- Bảng chi tiết vẫn dùng bottom sheet hiện có.

### 22.2.4 Bản đồ nhỏ, hiệu năng

- **Bản đồ nhỏ** (mới): canvas 2D 120 × 120 px vẽ sẵn từ dữ liệu có (đường — `roads.js`, nước, tường thành), chấm người chơi + hướng nhìn.
  - Bấm vào thì mở bản đồ lớn.
  - Kèm giờ can chi + thời tiết.
- **Hiệu năng di động:** chất lượng tự hạ có sẵn, thêm tùy chọn khóa 30 khung hình / giây (tiết kiệm pin) và hạ tỉ lệ điểm ảnh khi máy nóng (FPS < 24 trong 10 s).

## 22.3 Bàn phím và chuột

`[ĐÃ CÓ]` Danh sách phím có trong mã: [A7](phu-luc/A7-dieu-khien-luu-tru.md) §A7.1.

| Phím | Việc |
|---|---|
| Bấm chuột lên đất hoặc lên nhà | đi tới đó; bấm thân nhà thì đi tới cửa |
| Kéo chuột · cuộn | xoay camera · phóng to, thu nhỏ |
| Q · R | xoay camera một phần tám vòng |
| E hoặc Enter | tương tác với vật gần nhất; trên thuyền: trả, buộc, lên lại |
| Shift (giữ) | chạy nhanh |
| Space | nhảy, nhảy đôi; giữ khi rơi để lượn; khi bay: lên cao |
| C | khi bay: xuống thấp |
| F | bật, tắt ngự kiếm |
| H | cưỡi phương tiện |
| X | đánh công trình ngoài thành |
| L | sách luật |
| I | Kho đồ |
| M | bản đồ |
| Esc | đóng bảng |

**Camera:** người thứ ba; mặc định cách khoảng 11 m, sát được tới 2,4 m và khi sát thì nhìn ngang mặt; ngước lên được để nhìn trời; không chui vào mái nhà; trong điện bị kẹp trong khung điện.

## 22.4 Tìm đường: menu «Địa điểm» và bản đồ

`[ĐÃ CÓ]` Quy tắc đầy đủ: [NHA-DIADIEM-MANIFEST](../NHA-DIADIEM-MANIFEST.md) §3.

- **Menu «Địa điểm»** chia theo **nhu cầu**, không theo loại công trình: Nhà tôi · Ngủ nghỉ · Ăn uống · Làm việc · Nhà đất · Xem bói, tâm linh · Mua sắm · Đi lại. Mỗi thẻ xếp gần nhất trước; mỗi dòng có tên, khu, khoảng cách, giá hoặc trạng thái, và nút «Đi». Có ô tìm không dấu.
- **Cước:** gần thì tự đi bộ; xa thì xe ngựa (vài đồng, miễn phí cho cấp thấp); về nhà và lên xuống vùng trời miễn phí (§16.5).
- **Bản đồ** toàn màn hình: kéo, phóng, chụm, từ cả thành xuống từng căn nhà; tô màu theo loại; tìm theo tên, loại tiệm, thần miếu; có lớp biệt phủ và biệt thự; bấm trạm xe là đi.

## 22.5 Chuẩn hình thức và trợ năng `[ĐỀ XUẤT]`

Rút từ `docs/gdd/12-trinh-bay/07`, `14`, `18` (phần đã đối chiếu với `game.css` ngày 10/11). Dùng làm chuẩn cho bảng mới; các điểm lệch đã biết nằm ở `VC-024`.

| Hạng mục | Chuẩn |
|---|---|
| Màn chuẩn | dọc 390 × 844 trước, rồi 1440 × 900 |
| Màu nền và chữ | `--hq-night #14111c`, `--hq-card #221c27`, `--hq-line #3a3040`, `--hq-paper #f3e7cf`, `--hq-dim #b8a98f`, `--hq-son #b3261e`, `--hq-gold #d6a84a` |
| Màu ngũ hành | Mộc `#4fa463`, Hỏa `#e0533f`, Thổ `#c99a4a`, Kim `#cfc8b8`, Thủy `#4b7cc7`; **luôn kèm chữ hoặc hoa văn**, không chỉ dựa vào màu |
| Tương phản | chữ ≥ 4,5:1; đồ hoạ ≥ 3:1; không dùng màu đỏ cho «điểm thấp» |
| Vùng chạm | tối thiểu 44 px, cách nhau ≥ 8 px |
| Cỡ chữ | thân 15 px, thoại 17 px; phóng 85–150 % không vỡ màn dọc |
| Lớp | mỗi lúc chỉ một lớp bảng nhận thao tác; thông báo tối đa hai cùng lúc |
| Chuyển động | 100–550 ms; không quá ba lần loé mỗi giây; không có thao tác bấm nhanh bắt buộc |
| Lời văn | nút = động từ + danh từ; không dấu chấm than dồn, không đếm ngược thúc ép; người chơi là «khách» trong lời quán, là «bạn» trong lời pháp lý |
| Trạng thái của một ô | bản iOS ẩn · bị khoá · lỗi · ngoại tuyến · AI tắt · đang nạp · rỗng; mỗi ô phải có lời cho cả bảy |
| Hộp xác nhận | dùng hộp của game, không dùng hộp của trình duyệt |

## 22.6 Âm thanh và rung

`[ĐÃ CÓ]` Âm thanh tổng hợp bằng WebAudio, không có tệp âm thanh; **mặc định tắt**, chỉ bật khi người chơi bấm nút loa. Có chuông, tiếng gõ, lắc ống xăm, tóe nước, mái chèo (`audio.js`). Rung nhẹ trên điện thoại khi đổi biểu tượng ngữ cảnh, cất và hạ cánh (`haptics.js`). Nhạc nền chưa có.

## 22.7 Liên kết với hệ khác

| Hệ | Trao đổi | Chương |
|---|---|---|
| Mọi chương hệ thống | mỗi hệ một bảng `*-ui.js` | §10–§21 |
| Thế giới | dữ liệu bản đồ, trạm, địa điểm | §10 |
| Kỹ thuật client | vòng lặp, mức đồ hoạ, khoá khung hình | §30 |
| An toàn | lời văn, bản iOS, trợ năng | §40 |

## 22.8 Kiểm thử, nghiệm thu, việc mở

- `test-game-map` (4): dữ liệu bản đồ, tìm kiếm, chạm trúng. `test-game-heaven` (4): menu đủ tám thẻ.
- Bảng mới: thử ở màn dọc 390 × 844; có lời cho đủ bảy trạng thái; không dùng hộp của trình duyệt.
- Việc mở: `VC-024`; thử máy thật iOS và Android cho §22.2.
