# 12 · Trình bày — Phần 01: Nguyên tắc và khung giao diện

> Phần này đặt **luật chung** cho mọi màn hình UI-xx ở các phần 02–06: lớp hiển thị, bố cục dọc / ngang, bản đồ điều hướng, quy ước trạng thái, quy ước câu chữ, quy ước sự kiện đo lường, và mẫu viết một mục UI. Phần nào mâu thuẫn với phần này thì phần này thắng.
>
> Nguồn code: `src/game/markup.js` (khung HTML), `src/game/game.css` (bảng màu, bố cục), `src/game/main.js` (cổng, bảng, toast, điều khiển), `src/game/render3d.js` (nhãn, bong bóng, camera), `src/game/features.js` (nhánh iOS).

---

## 1. Sáu nguyên tắc trình bày (con của sáu trụ cột)

| # | Nguyên tắc | Trụ cột gốc | Nghĩa trên màn hình | Không được |
|---|---|---|---|---|
| P1 | **Con số nào cũng có «Vì sao?»** | T1, T5 | Mọi chỉ số Mệnh Bàn có nút «Vì sao?» mở `synthesis.factors[]` nguyên văn | Thanh, vòng, sao mà không truy được về trường engine |
| P2 | **Không làm người chơi xấu hổ** | T2 | Điểm thấp hiện kèm câu dẫn bắt buộc, màu trung tính (không đỏ), kèm hệ số Nghịch Thiên | Tô đỏ «HẠ ĐẲNG», chữ «xấu», biểu tượng mặt buồn |
| P3 | **Tĩnh trước, động sau** | T3 | Màu trầm, chuyển động chậm, âm thanh thưa; không nhấp nháy giục giã | Đồng hồ đếm ngược đỏ, rung liên tục, nút «MUA NGAY» nhảy nhót |
| P4 | **Cảnh là giao diện** | T4 | Nhãn gian, bong bóng, đèn, bia khắc tên người chơi nằm **trong thế giới** (đã có: biển Vận Mệnh Các khắc tên). Bảng chỉ mở khi cần đọc / nhập | Bảng che kín cảnh khi chỉ cần một con số |
| P5 | **Chữ Hán luôn có người dẫn** | T5 | Lần đầu xuất hiện: chữ Hán + Hán Việt + nghĩa; sau đó Hán Việt, chạm vào thì hiện lại nghĩa | Chữ Hán trơ trọi không phiên âm |
| P6 | **Không bán điều không được bán** | T6 | Màn cửa hàng không bao giờ hiện Đạo Hạnh, cảnh giới, công đức; NPC không dẫn link cửa hàng | Nút «mua Phúc Khí», «tăng vận», gói «đổi mệnh» |

---

## 2. Kiến trúc lớp hiển thị

Mọi lớp gói trong `.hq-root` (game nhúng vào vỏ iOS, CSS không được rò ra ngoài). Bảng dưới là **chỉ số z** đã có trong `game.css`, cộng các lớp mới (đánh dấu ★) cần thêm.

| z | Lớp | Phần tử hiện có | Vai trò | Chặn chạm cảnh? |
|---|---|---|---|---|
| 0 | Cảnh 3D | `#hq-canvas` | thế giới, chạm để đi, kéo để xoay | — |
| 1 | Nhãn chiếu từ 3D | `.hq-labels` (`.hq-label`, `.hq-name`, `.hq-bubble`) | tên gian, tên người, bong bóng thoại | không (`pointer-events: none`) |
| 2 ★ | HUD trong cảnh | (mới) bộ theo dõi nhiệm vụ UI-16, la bàn hướng UI-17 | thông tin bán thường trực | chỉ vùng nút |
| 3 | Điều khiển | `.hq-act` (nút hành động), `.hq-stick` (cần ảo) | thao tác trực tiếp | vùng nút |
| 4 | Màn tải | `.hq-loading` | che cảnh khi đang dựng | có |
| 6 | Cụm độ cao | `.hq-altpad` | ▲▼ khi ngự kiếm | vùng nút |
| 10 ★ | HUD mini-game | (mới) UI-80 | thay HUD thường khi đang chơi mini-game | tùy mini-game |
| 20 | Bảng | `.hq-panel` (bottom sheet / hộp giữa) | đọc, nhập, chọn | có (trừ `.peek`) |
| 30 | Toast | `.hq-toasts` (`aria-live="polite"`) | báo kết quả, tối đa 2 cái | không |
| 40 ★ | Hội thoại NPC | (mới) UI-40/41 | thoại kịch bản, AI | có |
| 50 ★ | Lễ / đột phá | (mới) UI-33, UI-04 | khoảnh khắc nghi thức toàn màn | có |
| 60 | Chuyển cảnh | `.hq-travel` | màn đen chuyển vùng / vào điện | có |
| 70 ★ | Cutscene | (mới) UI-99 | phim cắt cảnh, phụ đề | có |
| 80 ★ | Hộp xác nhận hệ thống | (mới) thay `confirm()` của trình duyệt | xoá dữ liệu, xác nhận Tà Lộ | có |

**Luật chồng lớp:**

1. Tại một thời điểm chỉ có **một** lớp ≥ 20 nhận thao tác. Mở lớp mới thì lớp cũ (trừ toast) đóng hoặc thu nhỏ — giống `panel.open()` hiện tự dọn bảng cũ bằng `_hqCleanups`.
2. Khi bảng mở (không `peek`), toast tự dời lên đầu màn hình (đã có: `.hq-root:has(.hq-panel:not([hidden]):not(.peek)) .hq-toasts`).
3. Hộp xác nhận (z 80) **không bao giờ** tự mở khi người chơi không vừa bấm — tránh bấm nhầm.
4. Cutscene (z 70) giữ toast trong hàng đợi, xả sau khi cutscene kết thúc.
5. `confirm()` / `alert()` của trình duyệt (đang dùng ở Sổ Mệnh khi xoá hồ sơ, xoá dữ liệu) **phải thay** bằng hộp z 80 — `confirm()` không theo bảng màu, không có tiếng Việt chuẩn trên mọi trình duyệt, và trên iOS WKWebView có thể bị chặn.

---

## 3. Hai bố cục chuẩn

### 3.1 Màn dọc 390 × 844 (chuẩn thiết kế số 1 — «mobile-first»)

```
┌──────────────────────────────────────┐  ← safe-area-inset-top
│ ← │ Tên · Danh xưng · Cấp 4      🗡 🔈│  HUD 52 px  (.hq-hud)
│   │ ✦ 120  🔥 3  💎 45  👥 12        │
├──────────────────────────────────────┤
│ ┌───────────────┐            N ▲     │  bộ theo dõi nhiệm vụ (UI-16) · la bàn (UI-17)
│ │◆ Ba việc thiện│                    │
│ │  đầu tiên 1/3 │                    │
│ └───────────────┘                    │
│                                      │
│           [ Bàn Thầy Tử Bình ]       │  nhãn gian (.hq-label)
│                                      │
│                 (cảnh 3D)            │  khách nằm 1/3 dưới (ahead 3,4 m — render3d)
│                                      │
│                  [Tên khách]         │
│                     🧍               │
│   ╭────╮                     ╭────╮  │
│   │ ◉  │ cần ảo 120 px       │ 📜 │  │  nút hành động 92 px (vùng ngón cái phải)
│   ╰────╯                     │Ngồi│  │
│                              ╰────╯  │
├──────────────────────────────────────┤
│ 📋     💬      ☰      👘      📜     │  dock 60 px (.hq-dock), mỗi nút ≥ 76×48
│0/3 việc Giao lưu Các gian Y Các Sổ Mệnh│
└──────────────────────────────────────┘  ← safe-area-inset-bottom
```

Số đo gốc (đã có trong `game.css`):

| Thành phần | Kích thước | Ghi chú |
|---|---|---|
| HUD | cao ≈ 52 px, nút `.hq-hbtn.icon` 40 × 40 | nhỏ hơn chuẩn 44 px — **nâng lên 44 × 44** (xem phần 07 §3) |
| Dock | nút `.hq-dbtn` tối thiểu 76 × 48 px | đạt chuẩn chạm |
| Cần ảo | 120 × 120 px, núm 54 px, bán kính kéo 46 px | `R_STICK = 46` trong `main.js` |
| Nút hành động | 92 × 92 px, cách phải 18 px, đáy 24 px | chỉ trên `pointer: coarse` |
| Cụm độ cao | nút 58 × 58 px, đáy 210 px | chỉ hiện khi ngự kiếm |
| Bottom sheet | nửa: `max-height 62dvh`; đầy: `92dvh`; thanh kéo 44 × 5 px | chạm thanh kéo để đổi nấc |
| Bảng thu nhỏ (`peek`) | `max-height 46dvh`, rộng ≤ 440 px, nền mờ `blur(6px)` | ngồi trà, nhang cháy |
| FOV camera | 64° khi `aspect < 0,8`; 45° khi ngang | `render3d.js › resize()` |

### 3.2 Màn ngang / máy tính (chuẩn số 2 — tham chiếu 1440 × 900, tối thiểu 1024 × 640)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← │ Tên · Danh xưng · Cấp 4 │ ✦120 🔥3 💎45 👥12            │ 🗡 │ 🔈 │ ⚙ │     │
├──────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐                                     ┌───────────────┐   │
│ │◆ Ba việc thiện   │                                     │  N            │   │
│ │  đầu tiên  1/3   │          [ Bàn Thầy Tử Bình ]       │ ·  ▲  ·  bản  │   │
│ │◇ Gặp Vân Cốc     │                                     │   đồ nhỏ UI-46│   │
│ └──────────────────┘                                     └───────────────┘   │
│                                  (cảnh 3D)                                   │
│                                                                              │
│                                 [Tên khách]                                  │
│                                     🧍                                       │
│                     ╭──────────────────────────────╮                         │
│                     │ 📜  E  Ngồi trước bàn thầy   │  thẻ hành động giữa đáy │
│                     ╰──────────────────────────────╯                         │
├──────────────────────────────────────────────────────────────────────────────┤
│   📋 0/3 việc    💬 Giao lưu    ☰ Các gian    👘 Y Các    📜 Sổ Mệnh          │
│ WASD / mũi tên để đi · click để đi tới · kéo để xoay · lăn chuột gần/xa · …  │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Bảng trên máy tính là **hộp giữa** rộng ≤ 620 px (`.hq-panel-card`), cao ≤ `min(86dvh, 820px)`. Từ M2, bảng nội dung dài (Sổ Mệnh, Mệnh Đồ, bản đồ) chuyển sang **ngăn phải** rộng 520 px để cảnh vẫn thấy bên trái (★ mới — xem UI-15).
- Dòng trợ giúp phím `.hq-help` chỉ hiện khi `pointer: fine` và rộng > 600 px.

### 3.3 Điểm gãy (breakpoint)

| Điều kiện | Thay đổi | Nguồn |
|---|---|---|
| `max-width: 600px` | bảng → bottom sheet 2 nấc; ẩn `.hq-help`; nhãn 11,5 px | `game.css` |
| `max-width: 480px` | La bàn: danh sách hướng 1 cột; thành tựu 1 cột | `game.css` |
| `max-width: 380px` | bàn phím chữ giải án 4 cột thay 6 | `game.css` |
| `pointer: coarse` | hiện cần ảo, nút hành động tròn, ẩn `kbd` | `game.css` |
| `aspect < 0,8` | FOV 64°, camera nhìn vượt trước 3,4 m, `dist × 0,9` | `render3d.js` |
| ★ `min-width: 1280px` | ngăn phải cho bảng dài; bản đồ nhỏ thường trực | mới |
| ★ ngang trên điện thoại (`orientation: landscape` và `max-height: 500px`) | HUD thu còn 40 px, dock chuyển thành cột dọc bên phải | mới — bản native khóa dọc (`haptics.js › lockPortrait`), web thì không khóa được |

---

## 4. Bản đồ điều hướng

```
                              ┌─────────────┐
                              │ UI-01 Khởi  │
                              │ động / tải  │
                              └──────┬──────┘
                 có bát tự? ┌────────┴────────┐ chưa
                            ▼                 ▼
                   ┌──────────────┐   ┌──────────────┐   ┌─────────────┐
                   │ UI-06 Chào   │   │ UI-07 Chấp   │──▶│ UI-03 Mẫu   │
                   │ quay lại     │   │ thuận dữ liệu│   │ bát tự      │
                   └──────┬───────┘   └──────────────┘   └──────┬──────┘
                          │                                     ▼
                          │                              ┌─────────────┐
                          │                              │ UI-04 Lật   │
                          │                              │ trụ         │──▶ UI-05 Lộ căn cốt
                          │                              └──────┬──────┘
                          ▼                                     ▼
              ┌────────────────────────────────────────────────────────┐
              │ KHUNG CHƠI: UI-08 HUD · UI-09 Dock · UI-10 Hành động   │
              │ UI-11 Cần ảo · UI-12 Nhãn · UI-16 Nhiệm vụ · UI-17 La bàn│
              └───┬──────────┬──────────┬───────────┬──────────┬───────┘
         📋 dock  │   💬     │    ☰     │    👘     │   📜     │  chạm NPC / gian
                  ▼          ▼          ▼           ▼          ▼
            UI-49 Việc   UI-60 Giao  UI-48 Các   UI-71 Tàng  UI-20 Sổ Mệnh ── thẻ:
            hôm nay      lưu         gian →      Y Các       UI-21 Mệnh Bàn
            UI-43 Sổ     UI-61 Phòng UI-47 Trạm  UI-73 VIP   UI-27 Mệnh Đồ
            Nhiệm Vụ     UI-62 Thẻ   đi nhanh                UI-29 Sổ Công Quá
                         người chơi  UI-45 Bản               UI-32 Cảnh giới
                                     đồ                      UI-36 Thành tựu
                                                             UI-75 Cài đặt
              chạm NPC ──▶ UI-40 Thoại kịch bản ──▶ UI-41 Thoại AI (web)
              chạm gian ─▶ UI-50…UI-55 · UI-80…UI-98 (HUD mini-game)
              cửa điện ──▶ UI-14 Chuyển cảnh ──▶ trong điện
```

**Luật quay lại:**

- `Esc` (máy tính), nút ✕ (mọi nơi), chạm nền mờ (trừ `peek`) và vuốt thanh kéo xuống (điện thoại) đều **đóng một tầng**.
- Bảng con mở từ bảng cha (vd «Án Cổ» từ Sổ Mệnh) hiện nút «‹ Sổ Mệnh» ở đầu (★ mới; hiện đang thay thẳng nội dung, mất đường quay lại).
- Nút ← trên HUD (`#hq-exit`) chỉ hiện khi game được nhúng trong vỏ có `onExit` (iOS, trang chính); bấm là `pause()` rồi thoát, **không** hỏi lại vì mọi thứ đã lưu tức thì (`save()` sau mỗi `after()`).

---

## 5. Quy ước trạng thái — mỗi màn phải có đủ 8 ô

Mỗi mục UI-xx ở các phần sau có một bảng «Trạng thái». Ô nào không áp dụng thì ghi «—» kèm lý do. Câu chữ mặc định:

| Mã | Trạng thái | Khi nào | Câu chữ mặc định (tiếng Việt) | Hình |
|---|---|---|---|---|
| S-LOAD | Đang tải | tải lười module (`case-ui.js`, `ai.js`, `vanmenh-ui.js`) hoặc chờ máy chủ | «Đang mở…» / tên riêng: «Đang mở án…», «Thầy đang xem lá số…» | chữ nghiêng màu `--hq-dim`, **không** vòng quay; quá 1,5 s thì thêm ba chấm động (tắt khi giảm chuyển động) |
| S-EMPTY | Rỗng | chưa có dữ liệu | Câu mời làm việc đầu tiên, có nút dẫn tới (vd «Chưa có hồ sơ nào. Ghé bàn thầy ở Chính Đường nhé.») | minh họa nét mảnh (bút lông, chén trà) |
| S-ERR | Lỗi | ngoại lệ trong `STATION_OPEN[id]` hoặc engine | «Gian này đang có chút trục trặc, khách thử lại sau nhé.» (đã có) + nút «Thử lại» | không icon cảnh báo đỏ; chỉ viền `--hq-gold` |
| S-OFF | Ngoại tuyến | `net.status !== 'online'` | «Đang chơi đơn — chỉ mình bạn thấy.» (đã có ở Giao lưu) | chip `.hq-online.off` màu `--hq-dim` |
| S-IOS | Bản iOS | `FEATURES.divination === false` hoặc `FEATURES.ai === false` | đổi từ ngữ theo `TEXT` (Học Quán, Sổ Tu Học, Điểm Tu Học); màn bói **không hiện lối vào** — không hiện màn khóa | — |
| S-AIOFF | AI tắt / hết lượt | `isAiEnabled` false, hết 10 lượt / ngày, lỗi mạng | NPC chuyển thoại kịch bản, **không** báo lỗi; nhãn nhỏ «Luận cục bộ» (đã có) | badge `.hq-neo` trung tính |
| S-LOCK | Chưa mở | thiếu cảnh giới / cấp / nhiệm vụ | «Mở ở cảnh giới Nhập Môn» — luôn nói **làm gì** để mở, không chỉ «khóa» | 🔒 màu `#ffcf7a` (đã có `.hq-yc-lock`) |
| S-RM | Giảm chuyển động | `prefers-reduced-motion: reduce` hoặc cài đặt trong game | mọi animation CSS tắt (đã có quy tắc toàn cục); 3D: tắt hạt, khói, cánh đào, kim la bàn run | — |

**Thứ tự ưu tiên khi trùng:** S-IOS > S-LOCK > S-ERR > S-OFF > S-AIOFF > S-LOAD > S-EMPTY. Ví dụ: trên iOS, Thái Tuế Điện tắt hẳn (S-IOS) nên không bao giờ hiện S-LOAD của nó.

---

## 6. Quy ước câu chữ (UX copy)

### 6.1 Xưng hô

| Ai nói | Xưng | Gọi người chơi | Ví dụ |
|---|---|---|---|
| Hệ thống (nút, toast, nhãn) | (không xưng) | «bạn» | «Đã lưu.», «Bạn chưa thắp đèn an Thái Tuế năm nay.» |
| Quán / cổng (giọng chủ quán) | «quán» | «khách» | «Chào ${tên} quay lại quán.», «Gian này đang có chút trục trặc, khách thử lại sau nhé.» |
| Thầy Tử Bình | «thầy» | «con» (thoại) / «bạn» (bảng phân tích) | «Thầy cần bát tự sinh thần…» |
| NPC dẫn đạo | theo thẻ persona tài liệu 06 (`PERSONA-<npc>`) | theo persona | Trương Thiên Sư: «bần đạo – thí chủ» |

Hiện code trộn «bạn» và «khách» trong cùng màn (cổng: «Chào … quay lại quán» rồi «Ngày sinh chỉ lưu trên máy bạn»). Quy định: **câu nói của quán** dùng «khách»; **câu thông tin pháp lý / quyền riêng tư** dùng «bạn» (rõ nghĩa hơn). Giữ như hiện có là đúng luật này.

### 6.2 Từ cấm và từ thay

| Không viết | Viết | Lý do |
|---|---|---|
| số xấu, mệnh xấu, lá số tệ | lá số nhiều thử thách, căn cốt cần chăm | P2 |
| phán, định đoạt | luận, xem, đọc | T2, RB2 |
| giải hạn bằng tiền, mua may | (không có khái niệm này) | T6, RB5 |
| bùa (khi nói vật phẩm Tàng Y Các) | phụ kiện, trang sức | tránh hiểu nhầm là bùa thật |
| bạn bị ma, bị tà | «có thể bạn đang mệt / áp lực» (theo `amta-data › ETHICS`) | an toàn |
| chết, tử vong (trong luận lá số) | (không nói) | câu cấm của Thầy Tử Bình |
| WIN, combo, crit | thuận, liền mạch, thấu | giữ giọng văn tu |

### 6.3 Định dạng

- Số: `toLocaleString('vi-VN')` → «1.000», «2.200». Phần trăm: «55%» (không cách). Thập phân: «1,3».
- Ngày: «15/5/1990» trong bảng; ngày âm: «mùng 1 tháng Giêng», «Rằm tháng Bảy». Giờ can chi: «giờ Thìn (07–09)».
- Tiền tệ trong game: «✦ 120 Phúc Khí», «💎 45 Ngọc» — biểu tượng đứng trước số, có khoảng cách.
- Tiền thật (nạp): «22.000đ» (đã có trong `wardrobe-ui.js`), luôn kèm «đã gồm thuế» khi cổng thanh toán mở.
- Dấu ngoặc trích: «…» (ngoặc kép góc), thống nhất với tài liệu canon.
- Chữ Hán: luôn dùng **phồn thể** như engine ghi (`劫財`, không `劫财`) — xem phụ lục B của bản sơ đồ tổng về lỗi lẫn giản/phồn.

### 6.4 Độ dài tối đa (để chịu được dịch sang tiếng Anh sau này, xem phần 13)

| Vị trí | Tối đa (ký tự tiếng Việt) | Ví dụ hiện có |
|---|---|---|
| Nhãn nút dock | 10 | «Giao lưu», «Các gian», «Sổ Mệnh» |
| Nhãn nút hành động (cảm ứng, 2 dòng trong 92 px) | 24 | «Ngồi bồ đoàn uống trà» (21) |
| Toast | 70 | «Xong 3 việc hôm nay · +5 · chuỗi 3 ngày» |
| Tiêu đề bảng | 28 | «Các gian & sảnh nghề» |
| Nhãn gian 3D | 22 | «Chính Điện Tam Thanh» |
| Bong bóng thoại | 60 (cắt câu đầu — đã có: `.slice(0, 60)`) | — |

---

## 7. Quy ước đo lường (analytics)

### 7.1 Nguyên tắc riêng tư

1. **Không bao giờ** gửi ngày giờ sinh, tứ trụ, điểm Tiềm Lực, Phẩm căn, Mệnh Cách, nội dung hỏi AI, nội dung «Sổ đời thực».
2. Gửi được: mã màn, mã nút, thời lượng, cảnh giới (bậc 1–6), cấp hoạt động, vùng, nền tảng, chất lượng đồ họa, cờ trợ năng (dạng boolean).
3. Mệnh Cách chỉ được gửi **dạng nhóm** khi người chơi bật «Góp số liệu ẩn danh để cân bằng game» (mặc định tắt) — phục vụ chỉ số thành công §13.5 (giữ chân nhóm lá số thấp). Nhóm: `tier ∈ {lt36, 36to57, ge58}`, không gửi điểm cụ thể.
4. Không gắn mã người chơi MMO (`huyenquan:pid`) với tài khoản thanh toán trong cùng sự kiện.

### 7.2 Tên sự kiện

`ui_<màn>_<hành động>` viết thường, gạch dưới. `<màn>` là mã ngắn trong mỗi mục UI (vd `gate`, `birth`, `rite`, `menhban`). Hành động chuẩn:

| Hành động | Nghĩa | Thuộc tính bắt buộc |
|---|---|---|
| `view` | màn hiện lên | `from` (màn trước), `ms_load` |
| `close` | đóng | `ms_open`, `how ∈ {x, esc, scrim, swipe, back}` |
| `tap_<nút>` | bấm một nút | — |
| `submit` / `error` | gửi biểu mẫu / lỗi | `code` (mã lỗi, không gửi giá trị nhập) |
| `step` | qua một bước trong chuỗi (giải án, mini-game) | `i`, `n`, `score_bucket` |
| `done` | hoàn thành | `ms_total`, `score_bucket` |
| `abandon` | bỏ giữa chừng | `i`, `n`, `ms` |

Thuộc tính chung gắn mọi sự kiện: `v` (phiên bản build), `plat ∈ {web, ios, android, pc}`, `ori ∈ {portrait, landscape}`, `q ∈ {low, mid, high}`, `lowq` (đã tự hạ chất lượng vì < 35 fps), `rm` (giảm chuyển động), `fs` (cỡ chữ %), `net ∈ {online, connecting, offline}`, `realm` (cảnh giới 1–6), `region`.

### 7.3 Lấy mẫu và gửi

- Gom theo lô 20 sự kiện hoặc 30 giây; gửi bằng `navigator.sendBeacon` khi `visibilitychange → hidden` (cùng chỗ `main.js` đang dừng vòng lặp).
- Màn có tần suất rất cao (nhãn, toast) **không** phát `view`; chỉ đếm gộp theo phiên.
- Bản iOS gửi cùng lược đồ; không có sự kiện của màn bị tắt.

---

## 8. Mẫu một mục UI-xx

Mọi mục ở phần 02–06 viết theo khung sau (bỏ dòng không áp dụng):

```
### UI-xx · Tên màn  (mã ngắn: `abc`)
| Mục đích | … |
| Lối vào | … |
| Nguồn | file › hàm (đã có) / (chưa có — cần làm) |
| Lớp z / dạng | … |
Khung dọc 390×844   (ASCII)
Khung ngang         (ASCII, có thể gọn)
Thành phần          (bảng: phần tử · loại · dữ liệu · ghi chú)
Trạng thái          (8 ô theo §5)
Câu chữ             (bảng: khóa chuỗi · tiếng Việt)
Tương tác           (cử chỉ / phím → kết quả, kèm âm SFX-* và rung)
Trợ năng            (vai trò ARIA, thứ tự focus, thay thế màu, đọc màn hình)
Đo lường            (sự kiện)
Nghiệm thu          (tiêu chí đạt)
```

**Khóa chuỗi** (string key) dạng `ui.<màn>.<phần>` — vd `ui.gate.lead`. Tài liệu 13 (kỹ thuật) định dạng tệp chuỗi; phần 13 của tài liệu này đặt luật bản địa hóa.

---

## 9. Hiện trạng → khoảng trống

| Hạng mục | Đã có (file) | Thiếu | Ưu tiên |
|---|---|---|---|
| Cổng + mẫu bát tự + lật trụ | `main.js › showGate, birthForm, ceremony` | lộ căn cốt (UI-05), chấp thuận dữ liệu (UI-07), lịch âm / giờ can chi trong mẫu | M0 |
| HUD + dock | `markup.js` | nút cài đặt, theo dõi nhiệm vụ, la bàn, cảnh giới trên HUD | M0–M1 |
| Bảng (sheet) | `main.js › panel` | nút «‹ quay lại», ngăn phải trên máy tính, hộp xác nhận thay `confirm()` | M0 |
| Sổ Mệnh | `stations.js › openBook` (6 thẻ: Tu học, Hồ sơ, Xăm, Đèn, Thành tựu, Cài đặt) | Mệnh Bàn, Mệnh Đồ, Sổ Công Quá, Cảnh giới (theo §12 bản tổng) | M0–M1 |
| Thầy AI + Neo | `master-ui.js › masterChatBody` | persona NPC, giới hạn lượt, màn chuyển hướng khủng hoảng | M0 |
| Hội thoại NPC kịch bản | (chưa có — cần làm) | toàn bộ UI-40 | M0 |
| Nhiệm vụ | `main.js` «Việc hôm nay» (3 việc) | Sổ Nhiệm Vụ, theo dõi, chi tiết | M1 |
| Bản đồ / đi nhanh | «Các gian» (danh sách) + màn chuyển `.hq-travel` | bản đồ thế giới, bản đồ nhỏ, trạm xe / đò / hạc | M1–M2 |
| Tàng Y Các | `wardrobe-ui.js` | xem nhân vật xoay (thử đồ đang xem ngoài cảnh) | M1 |
| Cài đặt | thẻ «Cài đặt» trong Sổ Mệnh (tên, dáng, xoá dữ liệu) + nút 🔈 | đồ họa, trợ năng, điều khiển, ngôn ngữ, quyền riêng tư | M0 |
| Mini-game | xăm, nhang, trà, thả đèn, la bàn, giải án, sảnh nghề, giải quẻ | 16 HUD mới (phần 06) | M1–M5 |
| Âm thanh | `audio.js`: gió, chuông, mõ (tổng hợp WebAudio) | BGM, SFX file, trộn, bus | M1 |
| Rung | `haptics.js › buzz(light/medium/heavy)` | bản đồ rung đầy đủ (phần 07) | M0 |

---

## 10. Nghiệm thu chung cho mọi màn

1. Mở được trên 390 × 844 (Safari iOS 17, Chrome Android 12+) và 1440 × 900 (Chrome, Firefox, Safari) không có chữ bị cắt ở cỡ chữ 100% và 130%.
2. Đủ 8 ô trạng thái (§5) có câu chữ thật, đã qua duyệt ngôn ngữ.
3. Đi hết màn bằng bàn phím: `Tab` theo thứ tự đọc, `Esc` đóng, `Enter` / `Space` kích hoạt; vòng focus không thoát ra cảnh khi bảng mở.
4. VoiceOver / TalkBack đọc đúng tiêu đề (`aria-labelledby`), vai trò (`dialog`, `tablist`, `tab`), trạng thái (`aria-pressed`, `aria-selected`).
5. Không màu nào là kênh **duy nhất** mang nghĩa (xem phần 14 — ngũ hành luôn kèm chữ Hán / ký hiệu).
6. Phát đúng sự kiện đo lường, không rò dữ liệu cấm ở §7.1 (kiểm bằng test tự động quét payload).
7. Âm và rung theo bảng phần 07; tắt âm thì không còn tiếng nào; tắt rung thì `buzz()` không gọi.
8. Bản iOS: màn bị tắt không có lối vào nào (dock, danh sách gian, liên kết trong bảng, gợi ý AI).
