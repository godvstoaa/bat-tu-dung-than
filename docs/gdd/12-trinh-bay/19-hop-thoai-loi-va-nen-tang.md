# 12 · Trình bày — Phần 19: Hộp xác nhận, thông báo lỗi và khác biệt theo nền tảng

> Danh mục mọi **hộp xác nhận hệ thống** (lớp z 80), mọi **thông báo lỗi / sự cố** có câu chữ chuẩn, và cách giao diện xử lý từng nền tảng (nút quay lại Android, cử chỉ vuốt iOS, bàn phím ảo, màn ngang, máy tính bảng, tay cầm). Câu chữ theo luật phần 01 §6 (quán nói «khách», thông tin pháp lý nói «bạn»; không đổ lỗi người chơi; luôn nói bước tiếp theo).

---

## 1. Hộp xác nhận hệ thống (z 80)

Quy cách hình: phần 18 §3.17 (nút an toàn bên trái nhận focus; hành động phá hủy `.danger`). Mức: **N** nhẹ (một chạm), **V** vừa (hai nút rõ), **C** cao (gõ chữ xác nhận).

| # | Khi | Mức | Tiêu đề | Thân | Nút an toàn | Nút hành động |
|---|---|---|---|---|---|---|
| D1 | xoá một hồ sơ lá số (UI-35) | V | Xoá hồ sơ? | Xoá hồ sơ «{nhãn}» khỏi Sổ Mệnh? Lá số này sẽ không còn trên máy. | Giữ lại | Xoá hồ sơ |
| D2 | xoá toàn bộ dữ liệu (UI-78) | C | Xoá toàn bộ dữ liệu trong quán? | Mọi hồ sơ, Sổ Công Quá, tủ đồ, tiến độ sẽ mất và không khôi phục được. Gõ chữ XOÁ để xác nhận. | Hủy | Xoá vĩnh viễn |
| D3 | sửa bát tự khi đã có Mệnh Đồ (UI-06) | V | Đổi bát tự? | Mệnh Bàn và Mệnh Đồ sẽ được dựng lại theo ngày giờ mới. Công đức và Đạo Hạnh đã tích giữ nguyên. | Thôi | Đổi bát tự |
| D4 | dừng mini-game sau > 30 s (UI-80) | N | Dừng lại? | Tiến độ bước này sẽ không lưu. | Chơi tiếp | Dừng |
| D5 | mua món ≥ 300 Ngọc (UI-71) | V | Thỉnh «{tên}»? | 💎 {giá} Ngọc. Món trang phục, không tăng Đạo Hạnh hay cảnh giới. | Để sau | Thỉnh |
| D6 | nạp Ngọc bằng tiền thật (UI-73) | V | Nạp {n} Ngọc? | {giá} (đã gồm thuế), thanh toán qua {cổng}. Ngọc không mua được Đạo Hạnh, cảnh giới, công đức. | Hủy | Tiếp tục thanh toán |
| D7 | đổi chất lượng đồ họa (UI-77) | N | Dựng lại quán? | Quán sẽ dựng lại với chất lượng {mức}. Mất vài giây. | Thôi | Dựng lại |
| D8 | bật nội dung âm tà (UI-79) | V (có ô tick) | Nội dung âm tà | (thân UI-79) | Để sau | Mở nội dung |
| D9 | tắt nội dung âm tà khi đang dở Tà Lộ | V | Tắt nội dung âm tà? | Chuyện Tà Lộ sẽ tạm dừng ở chỗ an toàn. Nợ Âm vẫn hiện trong Sổ Mệnh, đường hồi đầu vẫn mở. | Giữ nguyên | Tắt |
| D10 | theo dõi nhiệm vụ thứ 4 (UI-43) | N | Đã theo dõi 3 việc | Bỏ theo dõi việc nào để thay bằng «{tên}»? (danh sách 3 việc) | Thôi | (chọn việc) |
| D11 | rời nhóm đồng tu giữa án (UI-64) | V | Rời nhóm? | Bạn sẽ rời án chung. Mọi người vẫn giải tiếp được. | Ở lại | Rời nhóm |
| D12 | đổi phòng MMO | N | Sang phòng {n}? | Bạn sẽ thấy những khách khác. Đang ngồi trà thì sẽ đứng dậy. | Ở lại | Sang phòng |
| D13 | bỏ ẩn tất cả người đã ẩn (UI-61) | N | Bỏ ẩn {k} người? | Có hiệu lực từ lần kết nối tới. | Thôi | Bỏ ẩn |
| D14 | xoá Sổ đời thực (UI-30) | C | Xoá Sổ đời thực? | Các dòng bạn tự ghi sẽ mất, không khôi phục được. Gõ chữ XOÁ. | Hủy | Xoá |
| D15 | rời quán khi đang nghi thức / mini-game (vỏ iOS gọi `exit`) | N | Rời quán bây giờ? | Việc đang làm sẽ dừng; mọi thứ khác đã lưu. | Ở lại | Rời quán |
| D16 | nhận lời mời khi đang mini-game | — | (không hộp) | lời mời chờ tới khi xong mini-game, tối đa 30 s | — | — |
| D17 | tải tệp xuất dữ liệu (UI-78) | N | Tải dữ liệu của bạn? | Tệp {tên}.json (~{kb} KB) gồm hồ sơ lá số và tiến độ. Hãy giữ tệp này riêng tư. | Thôi | Tải xuống |
| D18 | báo cáo người chơi (UI-63) | — | (không hộp — chọn lý do đã là bước xác nhận) | — | — | — |

**Không dùng hộp xác nhận cho:** mặc / tháo trang phục, mua món < 300 Ngọc, đóng bảng, gửi cử chỉ, thắp đèn, đổi tab — những việc hoàn tác được hoặc không tốn tài nguyên đáng kể (tránh mệt hộp thoại).

---

## 2. Thông báo lỗi và sự cố

### 2.1 Mạng và phòng chung (`net.js`, `protocol.js`)

| # | Tình huống | Mã / nguồn | Hiện ở | Câu chữ | Hành vi |
|---|---|---|---|---|---|
| E1 | mất mạng | `net.status` | chip 👥 | «Ngoại tuyến» (đã có); thẻ người chơi: «Đang chơi đơn — sẽ tự kết nối lại» | chơi đơn bình thường; tự nối lại |
| E2 | phòng đầy | đóng `4001` (`CLOSE_FULL`), `ROOM_CAP = 60` | toast T1 | «Phòng này đã đủ 60 khách. Quán xếp bạn sang phòng khác.» | tự vào phòng khác (≤ `MAX_ROOMS` 50) |
| E3 | gửi quá nhanh | đóng `4002` (`CLOSE_SPAM`), > 20 tin / s | toast T1 | «Kết nối tạm dừng vì gửi quá nhanh. Quán sẽ nối lại sau ít phút.» | chờ 60 s rồi nối lại |
| E4 | dữ liệu lạ | đóng `4003` (`CLOSE_BAD`) | — | (không báo) | ghi log, nối lại một lần; lỗi lặp → chơi đơn, chip «Ngoại tuyến» |
| E5 | lệch phiên bản | `VERSION` khác máy chủ | thẻ nhỏ trên HUD | «Quán vừa có bản mới. Tải lại trang để vào phòng chung.» + [Tải lại] | vẫn chơi đơn được |
| E6 | tên bị đổi trong phòng | sự kiện `renamed` | toast T1 | «Tên này không dùng được trong phòng chung — tạm hiển thị «{tên}». Đổi tên trong Sổ Mệnh › Cài đặt.» (đã có; ★ đổi đường dẫn thành «Cài đặt › Nhân vật») | — |
| E7 | hết chỗ bồ đoàn | `requestSeat()` trả −1 | toast T1 | «Bồ đoàn đã có khách ngồi. Chờ một chút hoặc sang chỗ khác nhé.» | — |
| E8 | máy chủ bảng xếp hạng chậm | — | UI-34 | «Thiên Bảng đang cập nhật. Điểm của bạn vẫn được giữ.» | — |

### 2.2 AI (`master-ui.js`, `ai.js`)

| # | Tình huống | Câu chữ | Hành vi |
|---|---|---|---|
| E10 | lỗi khi hỏi (không phải hủy) | «Thầy đang bận, lát hỏi lại nhé.» (đã có) + [Hỏi lại] | giữ câu hỏi trong ô |
| E11 | hết lượt trong ngày | «Hôm nay đã hỏi đủ {n} câu. Thầy vẫn trả lời các câu có sẵn bên dưới.» | 3 câu cục bộ |
| E12 | máy chủ tắt AI | (không báo lỗi) huy hiệu «Luận cục bộ» | `composeAnswer` |
| E13 | tải `ai.js` lỗi | «Thầy chưa sẵn sàng. Thử lại sau, hoặc đọc phần luận có sẵn.» | ẩn ô nhập, hiện luận cục bộ |
| E14 | câu trả lời bị lọc hoàn toàn (quy tắc an toàn) | «Thầy chưa rõ điều đó trong quán. Con hỏi cách khác nhé.» | — |

### 2.3 Engine và dữ liệu

| # | Tình huống | Câu chữ | Hành vi |
|---|---|---|---|
| E20 | `chartOf` ném lỗi | `ex.message` hoặc «Thầy chưa lập được lá số này.» (đã có) | ở UI-03 |
| E21 | một gian lỗi khi mở | «Gian này đang có chút trục trặc, khách thử lại sau nhé.» (đã có) + ★ [Thử lại] | ghi log |
| E22 | module phụ lỗi (Mệnh Bàn) | «chưa luận được» tại dòng đó | phần còn lại vẫn hiện |
| E23 | bộ nhớ máy đầy (`localStorage` vượt hạn mức khi `saveState`) | thẻ HUD: «Máy hết chỗ lưu. Tiến độ mới có thể không được giữ. Xoá bớt hồ sơ hoặc giải phóng bộ nhớ trình duyệt.» + [Xuất dữ liệu] | thử lưu bản rút gọn (bỏ nhật ký xăm / đèn cũ — đã có giới hạn `keepSticks 30`, `keepLanterns 50`) |
| E24 | trình duyệt chặn lưu (duyệt riêng tư) | ở cổng: «Trình duyệt đang ở chế độ riêng tư nên quán không lưu được tiến độ. Bạn vẫn chơi được, nhưng đóng trang là mất.» | chơi trong bộ nhớ |
| E25 | ngày đổi giữa phiên (qua 0 giờ) | toast T1: «Đã sang ngày mới · việc hôm nay đã làm mới.» | `rollDay` (đã có, mỗi phút) |
| E26 | đồng hồ máy sai lệch lớn với máy chủ (> 2 giờ) | thẻ nhỏ: «Giờ trên máy có vẻ chưa đúng. Giờ can chi và nhạc theo giờ có thể lệch.» | dùng giờ máy (không ép giờ máy chủ — game theo giờ địa phương) |

### 2.4 Đồ họa và âm thanh

| # | Tình huống | Câu chữ | Hành vi |
|---|---|---|---|
| E30 | WebGL không khởi tạo | (không báo) | rơi về 2D (đã có) |
| E31 | mất ngữ cảnh WebGL giữa chừng (`webglcontextlost`) | lớp phủ «Đang dựng lại quán…» | ★ chờ `webglcontextrestored`, dựng lại cảnh; quá 5 s → [Tải lại] |
| E32 | máy chậm, đã tự hạ chất lượng | (một lần mỗi phiên) toast T1: «Quán đã giảm hiệu ứng cho mượt hơn. Đổi trong Cài đặt › Đồ họa.» | `lowQuality` (đã có) |
| E33 | dưới 20 fps kéo dài | thẻ: «Máy đang chạy chậm. Thử chế độ 2D nhẹ?» + [Chuyển 2D] [Giữ 3D] | — |
| E34 | âm thanh bị trình duyệt chặn | (không báo) — âm bật ở thao tác kế tiếp | `ctx().resume()` (đã có) |
| E35 | phông chữ Hán tải lỗi | (không báo) | dự phòng phông hệ thống (phần 07 §1.6) |

### 2.5 Thanh toán (khi cổng mở)

| # | Tình huống | Câu chữ |
|---|---|---|
| E40 | người chơi hủy ở cổng | «Đã hủy, chưa trừ tiền.» |
| E41 | thanh toán lỗi | «Thanh toán chưa thành công, chưa trừ tiền. Thử lại hoặc chọn cách khác.» |
| E42 | đang chờ xác nhận | «Đang chờ ngân hàng xác nhận. Ngọc sẽ vào tủ ngay khi xong — bạn có thể chơi tiếp.» |
| E43 | thành công | toast T2 «+{n} Ngọc · cảm ơn bạn đã ủng hộ quán» |
| E44 | khôi phục giao dịch (iOS) | «Đã khôi phục {k} giao dịch.» / «Không có giao dịch nào cần khôi phục.» |
| E45 | chạm giới hạn chi tiêu tự đặt | «Bạn đã đạt giới hạn nạp tháng này ({số}). Đổi trong Cài đặt › Giới hạn chi tiêu.» |

---

## 3. Khác biệt theo nền tảng

### 3.1 Nút quay lại Android (vỏ native và trình duyệt)

| Đang ở | Bấm quay lại |
|---|---|
| hộp xác nhận z 80 | = nút an toàn (Hủy) |
| cảnh cắt | hiện nút «Bỏ qua» (không bỏ ngay) |
| hội thoại kịch bản | mở ⋯ (Lịch sử / Bỏ qua cảnh đã xem); lần hai đóng menu |
| bảng con trong ngăn xếp | quay về bảng cha («‹») |
| bảng | đóng bảng |
| mini-game | như ✕ Dừng (D4 nếu > 30 s) |
| ngự kiếm | không làm gì (tránh hạ kiếm ngoài ý muốn) |
| cảnh, không có lớp nào | mở menu tạm nghỉ (UI-18) |
| menu tạm nghỉ | đóng menu; bấm lần nữa trong 2 s khi ở cảnh → thoát (vỏ) với toast «Bấm lần nữa để rời quán» |
| cổng | thoát (vỏ) / trang trước (trình duyệt) |

Trình duyệt: dùng `history.pushState` một mục cho mỗi lớp mở (bảng, menu) để nút quay lại của trình duyệt đóng lớp thay vì rời trang.

### 3.2 iOS

| Vấn đề | Cách xử lý |
|---|---|
| vuốt từ mép trái (quay lại của Safari / vỏ) trùng cần ảo | cần ảo cách mép 18 px (đã có); cần nổi (UI-11) không nhận chạm trong 20 px sát mép |
| tai thỏ / Dynamic Island | HUD dùng `padding-top: env(safe-area-inset-top)` (đã có) |
| thanh Home | dock dùng `env(safe-area-inset-bottom)` (đã có); bottom sheet cũng có (đã có) |
| khóa dọc | vỏ native khóa dọc khi vào game (`lockPortrait`), mở khi thoát (đã có); web không khóa được → bố cục ngang §3.4 |
| công tắc im lặng | native: phiên âm `ambient`; web: âm tắt mặc định (phần 11 §3) |
| rung | web iOS không có `navigator.vibrate` → không rung; native dùng Capacitor Haptics (đã có) |
| nhánh tính năng | `IOS = MODE === 'ios'`, `IOS_OFF` (đã có) — giao diện không hiện lối vào nào của màn bị tắt |
| WKWebView và phông | đóng gói phông trong app (giấy phép OFL cho phép) thay vì tải mạng |

### 3.3 Bàn phím ảo

| Màn có ô nhập | Hành vi khi bàn phím bật |
|---|---|
| UI-03 mẫu bát tự (trong cổng) | cổng cuộn để ô đang nhập nằm trên bàn phím; không tự focus trên cảm ứng (đã có) |
| UI-41 hỏi AI | bảng tự lên nấc **full**; ô nhập dính đáy trên bàn phím (`visualViewport.resize` → `bottom` theo phần bàn phím); log cuộn xuống câu cuối |
| UI-30 sổ đời thực, UI-94 lời gửi đèn | như UI-41 |
| cảnh | phím di chuyển bị bỏ qua khi đang gõ (đã có `typing(e)`) |

### 3.4 Màn ngang trên điện thoại (web, không khóa dọc)

```
┌────────────────────────────────────────────────────────────┬──────┐
│ ← Thanh Vân · Môn Sinh · Cấp 4   ✦120 🔥3 💎45 👥12  🗡 🔈 ⚙ │  📋  │
├────────────────────────────────────────────────────────────┤  🗺  │
│ ◆ Ba việc thiện 1/3                               北 ▲     │  💬  │
│                                                            │  👘  │
│                  (cảnh 3D, FOV 45°)                        │  📜  │
│  ╭────╮                                          ╭────╮    │      │
│  │ ◉  │                                          │ 📜 │    │      │
│  ╰────╯                                          ╰────╯    │      │
└────────────────────────────────────────────────────────────┴──────┘
```

HUD gọn 40 px, dock thành **cột phải** 64 px, bảng mở dạng ngăn phải 60% rộng (không bottom sheet — chiều cao thiếu). Điều kiện: `(orientation: landscape) and (max-height: 500px)`.

### 3.5 Máy tính bảng

| Hướng | Bố cục |
|---|---|
| dọc (820 × 1180) | như điện thoại nhưng bảng là hộp giữa ≤ 620 px; cần ảo + nút hành động giữ (cảm ứng) |
| ngang (1180 × 820) | như máy tính ≥ 1024: ngăn phải cho bảng dài; bản đồ nhỏ thường trực nếu ≥ 1280 |

### 3.6 Máy tính

- Màn rất rộng (≥ 2560 px): HUD và dock giới hạn rộng 1.600 px căn giữa; cảnh vẫn tràn.
- Chuột: kéo trái = xoay (đã có); ★ kéo chuột phải = xoay mà không vô tình «đi tới» khi nhả nhanh; lăn = gần / xa (đã có).
- Phóng trình duyệt 200%: bố cục chuyển sang dạng điện thoại theo điểm gãy (vì chiều rộng CSS giảm) — chấp nhận được.

### 3.7 Tay cầm (Gamepad API, bản máy tính) ★

| Nút | Việc |
|---|---|
| cần trái | đi |
| cần phải | xoay camera / ngước |
| LT / RT | gần / xa |
| A | vào gian / tiếp thoại / chọn |
| B | đóng một lớp (như quay lại §3.1) |
| X | Giao lưu (bánh xe cử chỉ) |
| Y | Sổ Mệnh |
| LB / RB | đổi thẻ trong bảng |
| D-pad | di chuyển focus trong bảng; trong thoại chọn lựa chọn |
| Start | menu tạm nghỉ |
| Back / View | bản đồ |
| nhấn cần trái | chạy |
| nhấn cần phải | quay camera về sau lưng nhân vật |

Gợi ý nút trên màn đổi theo thiết bị đang dùng gần nhất (bàn phím `E` ↔ tay cầm `A`), như `.hq-act` hiện ẩn `kbd` trên cảm ứng.

### 3.8 Chế độ 2D (`?2d`, máy rất yếu)

Giữ toàn bộ giao diện HTML (bảng, HUD, dock); cảnh là canvas điểm ảnh `640 × 448` (`image-rendering: pixelated`, đã có). Không có: nhãn 3D (dùng danh sách gian), camera, hiệu ứng 3D. Âm thanh, nhạc giữ nguyên. Mini-game có phần 3D (UI-85 xem 3D, UI-88) chỉ còn chế độ 2D của chúng.
