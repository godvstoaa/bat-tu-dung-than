# 12 · Trình bày — Phần 05: Xã hội, môn phái, Tàng Y Các, cài đặt (UI-60 → UI-79)

> MMO nhẹ, an toàn trước (Guideline 1.2 của Apple, chính sách chat soạn sẵn `protocol.js › PHRASES`), kinh tế có đạo đức (canon §11), và một màn cài đặt đủ cho trợ năng. Nội dung xã hội chi tiết (`GUILD-*`, `EV-*`) do tài liệu 10 định; phần này chỉ định màn hình.

---

## UI-60 · Giao lưu — cử chỉ và câu soạn sẵn (mã ngắn: `social`)

| | |
|---|---|
| Nguồn | `main.js › $('hq-social')`: 6 cử chỉ `EMOTES` (🙇 cúi chào · 🙏 chắp tay · 👏 vỗ tay · 🍵 mời trà · 👋 vẫy tay · 🤔 suy ngẫm), 8 câu `PHRASES` («Chào bạn!», «Cùng giải án nhé?», «Cảm ơn nhiều.», «Hay quá!», «Mời bạn chén trà.», «Mình đang học Tử Bình.», «Chờ mình chút.», «Hẹn gặp lại.»); không chat tự do |

**Khung dọc (hiện có)**

```
┌──────────────────────────────────────┐
│ Giao lưu                         ✕   │
├──────────────────────────────────────┤
│ Mọi người trong phòng 3 sẽ thấy.     │
│ ┌──────┬──────┬──────┐               │  .hq-emotes 3 cột
│ │  🙇  │  🙏  │  👏  │               │
│ │cúi   │chắp  │vỗ tay│               │
│ │chào  │tay   │      │               │
│ ├──────┼──────┼──────┤               │
│ │  🍵  │  👋  │  🤔  │               │
│ │mời trà│vẫy tay│suy ngẫm│           │
│ └──────┴──────┴──────┘               │
│ ┌─────────────┬─────────────┐        │  .hq-phrases 2 cột
│ │ Chào bạn!   │Cùng giải án │        │
│ │             │nhé?         │        │
│ ├─────────────┼─────────────┤        │
│ │Cảm ơn nhiều.│ Hay quá!    │        │
│ │ …                                  │
└──────────────────────────────────────┘
```

**★ Bổ sung:**

1. **Bánh xe nhanh** (giữ nút 💬 trên dock 0,4 s): 6 cử chỉ xếp vòng tròn quanh ngón tay, thả để gửi — không cần mở bảng. Máy tính: phím `G` + số 1–6.
2. **Câu theo ngữ cảnh** (tối đa 2 dòng thêm, vẫn soạn sẵn): đang giải án chung → «Mình nghĩ trụ ngày là…» (không có nội dung tự do); ở lễ hội → «Chúc mừng lễ {tên}!». Danh sách do tài liệu 10 duyệt.
3. **Cử chỉ theo đạo thống** mở theo môn phái: Đạo «稽首 Khể thủ» (chắp tay ôm quyền kiểu đạo sĩ), Phật «合十 Hợp thập», Nho «作揖 Tác ấp». Hoạt ảnh do `characters.js` (`play('bow')` đã có).
4. Mục «Vừa nói» (5 câu gần nhất trong phòng) để người không nhìn kịp bong bóng vẫn đọc được.

**Trạng thái:** S-OFF «Đang chơi đơn — chỉ mình bạn thấy.» (đã có). S-IOS giữ nguyên (không có UGC). 

**Âm:** gửi cử chỉ `SFX-SOC-001` (tiếng áo phất), nhận cử chỉ gửi riêng cho mình `SFX-SOC-002` + toast «{tên} {cử chỉ} bạn {icon}» + rung light (đã có).

**Đo lường:** `ui_social_send {kind: emote|phrase, id, via: sheet|wheel}`.

---

## UI-61 · Trong phòng — danh sách người (mã ngắn: `room`)

| | |
|---|---|
| Nguồn | `main.js › $('hq-online')`: «Phòng {n} · {count} người (kể cả bạn).», danh sách `.hq-players` (chấm màu áo, tên, danh xưng, nút «Xem»), dòng ẩn người «Đang ẩn {k} người. Bỏ ẩn tất cả»; `ROOM_CAP = 60`, `MAX_ROOMS = 50` |

**★ Bổ sung:** lọc «Đồng môn» / «Gần tôi (< 50 m)»; sắp theo khoảng cách; mục «Vừa nói» (UI-60 §4); nút «Đổi phòng» (chọn phòng có bạn bè / đồng môn — cần giao thức mới, tài liệu 13).

**Trạng thái:** S-OFF «Đang chơi đơn. Quán sẽ tự kết nối lại khi có mạng.» (đã có). S-EMPTY «Chưa có ai khác. Cứ thong thả, khách sẽ tới.» (đã có — câu mẫu tốt cho giọng P3).

---

## UI-62 · Thẻ người chơi (mã ngắn: `player`)

| | |
|---|---|
| Nguồn | `main.js › openPlayer(id)`: tên, danh xưng, chấm màu áo; nút 🙇 Cúi chào (chính) · 🍵 Mời trà · 👏 Vỗ tay; 🙈 Ẩn người này · ⚑ Báo cáo (lý do `REPORT_REASONS`: Tên không phù hợp · Làm phiền / spam · Lý do khác) |

**Khung dọc (★ bản đầy đủ)**

```
┌──────────────────────────────────────┐
│ Khách trong quán                 ✕   │
├──────────────────────────────────────┤
│ ● Mộc Lan · Đệ Tử                    │
│   ☯ Luyện Tinh Hóa Khí · Chính Nhất  │  ★ cảnh giới + môn phái
│   Tiên Thiên: ẩn                     │  hoặc «Tam Linh Căn» nếu công khai
│   Phẩm phục: Thanh Mộc Tiên Y        │
│ [🙇 Cúi chào] [🍵 Mời trà] [👏]       │
│ [ Mời đồng tu ] [ Mời giải án chung ]│  ★ UI-64
│ ───────────────────────────────────  │
│ [🙈 Ẩn người này]  [⚑ Báo cáo]       │
└──────────────────────────────────────┘
```

**Luật:** không hiện ngày sinh, tứ trụ, Mệnh Cách của người khác — bao giờ cũng không (canon §14). Tiên Thiên chỉ khi họ bật công khai.

---

## UI-63 · Báo cáo và ẩn (mã ngắn: `report`)

**Luồng hiện có:** ⚑ Báo cáo → hiện ô lý do → chọn → `net.report(id, why)` + `net.block(id)` → đóng bảng; toast «Đã gửi báo cáo. Cảm ơn bạn giữ quán yên tĩnh.» (máy chủ trả `reported`). Ẩn: `net.block(id)` + toast «Đã ẩn {tên}. Bạn sẽ không thấy người này nữa.»

**★ Bổ sung:** mục «Đã ẩn» trong Cài đặt › Xã hội để bỏ ẩn từng người (hiện chỉ có «Bỏ ẩn tất cả»); câu xác nhận sau báo cáo nói rõ «Người này đã bị ẩn với bạn. Quán sẽ xem xét trong 24 giờ.» Không cho báo cáo cùng một người quá 1 lần / 24 giờ (tránh spam báo cáo).

**Âm:** báo cáo `SFX-UI-021` (tiếng gõ trầm xác nhận, không chuông). Không rung.

---

## UI-64 · Mời đồng tu và giải án chung (mã ngắn: `coop`)

| | |
|---|---|
| Nguồn | giao thức đã có: `inv {to}` / `inv_ok {coop}` / `inv_no`, `coop_start`, `coop_leave`, `coop_ans {step, ans, hints}`, `coop_step`, `coop_done {total, points}`, `coop_end {why}`; `COOP_MAX = 4` |

**Thẻ lời mời (hiện cho người được mời)**

```
┌────────────────────────────────┐
│ 🍵 Mộc Lan mời bạn giải án      │
│ chung (2/4 người)               │
│ [ Nhận ]   [ Để sau ]           │
│ Tự đóng sau 30 giây             │
└────────────────────────────────┘
```

**Luật:** lời mời là thẻ nổi z 30 (cạnh toast), không chặn chơi; tự đóng sau 30 s (đếm bằng thanh mảnh, không số giây đỏ). «Để sau» không báo lý do cho người mời («{tên} đang bận» chung chung). Tắt nhận lời mời trong UI-75 › Xã hội.

**Phòng chờ đồng tu:** danh sách 1–4 người, chủ phòng có nút «Bắt đầu»; người khác thấy «Chờ chủ án bắt đầu…». Trong án: ô đang được người khác chọn có viền màu áo người đó + tên nhỏ.

**Đo lường:** `ui_coop_invite {kind}`; `ui_coop_accept`; `ui_coop_decline`; `ui_coop_done {n_players, score_bucket}`.

---

## UI-65 · Môn phái — sảnh chính (mã ngắn: `sect`)

| | |
|---|---|
| Nguồn | canon §10: môn phái = đạo thống; đạo tràng chung; sổ công đức chung; lễ riêng. `protocol.js › PHAI` hiện có 4 phái theo trường phái mệnh lý (Tử Bình, Manh Phái, Trích Thiên, Cùng Thông) cho bảng xếp hạng giải án; `GUILD-*` do tài liệu 10 |
| Lối vào | Sổ Mệnh › Cảnh giới › Môn phái; đạo tràng trong thế giới |

```
┌──────────────────────────────────────┐
│ ☯ Chính Nhất · Long Hổ Sơn       ✕   │
├──────────────────────────────────────┤
│ [Sảnh ●] [Đạo tràng] [Công đức] [Lễ] │
│ Chưởng môn: (NPC) Trương Thiên Sư    │
│ Đồng môn đang ở quán: 14             │
│ Thông báo của chấp sự (người chơi):  │  chỉ câu soạn sẵn + mẫu thông báo
│ «Lễ bái Đẩu tối thứ Bảy, giờ Tuất.»  │
│ ─ Việc môn phái tuần này ───────────│
│ ◇ Góp 50 lá phù hư cấu cho trai đàn  │
│   ▓▓▓▓▓▓▓░░░ 34/50                   │
│ ◇ Dựng lại tĩnh thất Tây (đạo tràng) │
│ ─ Thứ bậc (thụ lục) ────────────────│
│ Bạn: Đạo đồng · tiến lên Đạo sĩ khi │
│ đủ 2 bậc thụ lục                     │
└──────────────────────────────────────┘
```

**Luật:** thông báo chấp sự chọn từ **mẫu** (ngày, giờ can chi, loại lễ, địa điểm) — không văn bản tự do (giữ chính sách không UGC). Tên phái và thứ bậc đúng từng truyền thống (tài liệu 05 / 10 cung cấp bảng thứ bậc: Chính Nhất thụ lục; Toàn Chân giới đàn; Phật Quy Y → Thọ giới; Nho Học trò → Sĩ…).

**Trạng thái:** S-OFF hiện dữ liệu lần đồng bộ cuối + «Cập nhật lúc {giờ}». S-LOCK trước khi vào phái: «Bạn chưa vào môn phái nào. Tới thánh địa của đạo thống bạn chọn để xin nhập môn.» + danh sách 9 đạo thống có liên kết bản đồ.

---

## UI-66 · Môn phái — đạo tràng và sổ công đức chung (mã ngắn: `sectbuild`)

**Đạo tràng:** sơ đồ mặt bằng các công trình đạo tràng (mọi công trình vẫn đi vào được — canon §8), mỗi công trình có thanh tiến độ góp công; chạm → camera bay tới công trình (phần 08, preset `cam.build`).

**Sổ công đức chung:** tổng công đức phái tuần này, 10 người góp nhiều nhất **không** xếp hạng công khai số tuyệt đối — chỉ hiện «đã góp» (tránh thi đua công đức — biến việc thiện thành cuộc đua là ngược tinh thần Liễu Phàm). Người chơi tự thấy phần mình góp.

**Đo lường:** `ui_sectbuild_view`; `ui_sectbuild_contribute {kind}`.

---

## UI-67 · Sư đồ (mã ngắn: `master`)

| | |
|---|---|
| Nguồn | canon §10: cảnh giới ≥ 4 nhận đệ tử; đệ tử xong Mệnh Đồ thì sư phụ nhận công đức |

```
┌──────────────────────────────────────┐
│ Sư đồ                            ✕   │
├──────────────────────────────────────┤
│ Sư phụ: Vô Trần (Hóa Thần) ● trong quán│
│ [🙇 Bái kiến] [🍵 Mời trà]            │
│ ─ Đệ tử (2/3) ──────────────────────│
│ Thanh Vân · Mệnh Đồ 3/6 tầng         │  chỉ hiện số tầng, không nội dung
│ Hải Đường · Mệnh Đồ 6/6 ✓ (+công đức)│
│ [ Nhận thêm đệ tử ] (cảnh giới ≥ 4)  │
│ Sư phụ không thấy lá số của đệ tử.   │
└──────────────────────────────────────┘
```

**Luật quyền riêng tư:** sư phụ chỉ thấy **tiến độ** (số tầng Mệnh Đồ, cảnh giới), không thấy chẩn đoán, không thấy tứ trụ. Câu cuối bảng nói rõ điều đó.

---

## UI-68 · Hợp hôn và kết nghĩa kim lan (mã ngắn: `bond`)

| | |
|---|---|
| Nguồn | Bàn Hợp Hôn (đã có, `hophon`, án chung); canon §10: hai người chơi so lá số **thật**, kết nghĩa (`hehun`, `nayin-relation`) |

**Luồng:** người A mời → người B nhận **và** tự chọn chia sẻ lá số cho phép so (một lần, chỉ trong phiên so) → bảng so hai cột → tùy chọn kết nghĩa (danh hiệu chung «Kim Lan» / «Đạo lữ»). Không lưu lá số người kia sau phiên.

```
┌──────────────────────────────────────┐
│ Bàn Hợp Hôn · Thanh Vân × Mộc Lan ✕  │
├──────────────────────────────────────┤
│ Mộc Lan đồng ý cho so lá số trong     │
│ phiên này (không lưu lại).            │
│ Nạp âm: Bạch Lạp Kim × Đại Lâm Mộc    │
│ Quan hệ: Kim khắc Mộc → (lời luận)    │
│ ┃ So lá số để hiểu nhau, không để     │
│ ┃ định đoạt nhau.                     │
│ [ Kết nghĩa kim lan ] [ Đóng ]        │
└──────────────────────────────────────┘
```

**S-IOS:** tắt so lá số (gần đoán duyên); giữ kết nghĩa như quan hệ bạn bè thường.

---

## UI-69 · Lịch lễ tiết và sự kiện (mã ngắn: `calendar`)

| | |
|---|---|
| Nguồn | canon §10 bảng lễ: Lập Xuân / Tết, Thượng Nguyên, Trung Nguyên (Vu Lan), Hạ Nguyên, Trùng Cửu, Phật đản, Tết thầy; `EV-*` của tài liệu 10; ngày âm từ `lunar-javascript` |

```
┌──────────────────────────────────────┐
│ Lịch quán · tháng 9 âm (丙午)    ✕   │
├──────────────────────────────────────┤
│ Hôm nay: Giáp Tý · mùng 8/9 âm       │
│ ┌──┬──┬──┬──┬──┬──┬──┐               │  lịch tháng: ngày dương lớn,
│ │ 1│ 2│ 3│ 4│ 5│ 6│ 7│               │  ngày âm nhỏ dưới
│ │ 9│10│11│12│13│14│15│               │
│ │ …│  │  │  │✺ │  │  │               │  ✺ ngày có lễ
│ └──┴──┴──┴──┴──┴──┴──┘               │
│ ✺ 9/9 Trùng Cửu · bái Đẩu ở Đẩu Mẫu  │
│   Điện · giờ Tuất (19–21)            │
│ ✺ 15/10 Hạ Nguyên · Cùng Thông Hồ    │
│ [ Nhắc tôi ] (thông báo, tùy chọn)   │
└──────────────────────────────────────┘
```

**Luật:** giờ lễ ghi bằng **giờ can chi + giờ đồng hồ** (vd «giờ Tuất (19–21)»). Nhắc lễ là tùy chọn, tắt mặc định; tối đa 1 thông báo / lễ.

**S-IOS:** giữ lễ (văn hóa), bỏ các lễ có xin xăm / thả đèn ước.

---

## UI-70 · Hộp thư và thông báo (mã ngắn: `inbox`)

**Nội dung:** quà lên cấp, thư của NPC (sau nhiệm vụ — giọng persona), thông báo bảo trì, kết quả báo cáo (chung chung), lời mời đã lỡ. **Không** có thư quảng cáo cửa hàng (P6) — kể cả khi có Đạo Lộ mùa mới: chỉ một dòng trong UI-74, không thư.

**Giữ tối đa 50 thư**, thư cũ hơn 30 ngày tự xoá (trừ thư NPC đánh dấu sao). Biểu tượng chấm trên dock theo luật UI-09.

---

## UI-71 · Tàng Y Các — cửa hàng và tủ đồ (mã ngắn: `tangy`)

| | |
|---|---|
| Nguồn | `wardrobe-ui.js › wardrobeBody(api)`; `cosmetics.js`: 8 ô (`SLOTS`: Phẩm phục, Mũ · trâm, Sau lưng, Cầm tay, Hào quang, Vệt bước, Ngự vật, Khung tên), 5 bậc hiếm (`RARITY`: Phàm `#b9b2a4`, Linh `#6fd48a`, Huyền `#5aa8ff`, Tiên `#c58bff`, Thần `#ffc44a`), 51 món, 5 bộ ngũ hành (`SETS`), «Hợp mệnh» +10% Phúc Khí (`SET_BONUS`), điểm danh 7 ngày (`CHECKIN` 10/15/20/25/30/40/80), VIP +30 / ngày, +20 / cấp |
| Lối vào | dock 👘; quầy Thợ May Bà Tư (`tangy`) trong sân |

### 71.1 Khung dọc (hiện có)

```
┌──────────────────────────────────────┐
│ Tàng Y Các                       ✕   │
├──────────────────────────────────────┤
│ [✦ 120 Phúc Khí] [💎 45 Ngọc] [Chưa  │  .hq-yc-bal
│  VIP]                                │
│ ┌──┬──┬──┬──┬──┬──┬──┐               │  .hq-yc-checkin
│ │N1│N2│N3│N4│N5│N6│N7│               │
│ │💎10│💎15│💎20│…   │💎80│            │
│ └──┴──┴──┴──┴──┴──┴──┘               │
│ [📅 Điểm danh +20 Ngọc] [💎 Nạp Ngọc]│
│ [🀄 Bộ][👘 Phẩm phục][👑 Mũ][🗡 Lưng]│  .hq-yc-tabs
│ [🪭 Tay][✨ Hào quang][👣 Vệt][☁ Ngự]│
│ [🏷 Khung][👑 VIP]                    │
│ ┌──────────────────────────────────┐ │  .hq-yc-setcard
│ │ ■■■■ Huyền Thủy Long Tông  hành  │ │
│ │      Thủy · Hợp mệnh của bạn     │ │
│ │ Có 0/4 · đang mặc 0/4 · thiếu 💎 │ │
│ │ 570                              │ │
│ │ [ Mặc cả bộ ] (mờ)               │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### 71.2 Thẻ món (`.hq-yc-card`)

Ô màu / icon 48 px · tên · bậc hiếm (chữ màu bậc) · bộ · mô tả · 🔒 điều kiện · hành động: Mặc / Tháo / Đang mặc ✓ / [giá] / Thử 20s / lý do không mua được.

### 71.3 Bổ sung (★)

1. **Xem nhân vật xoay** (UI-72) thay cho «Thử 20s — xem nhân vật ngoài cảnh» (hiện phải đóng bảng mới thấy).
2. **Nhãn bậc hiếm bằng chữ + hình**: Phàm ○, Linh ◇, Huyền △, Tiên ☆, Thần ✺ — màu bậc hiếm không phải kênh duy nhất (phần 14).
3. **Mô tả «Hợp mệnh»** ghi rõ: «+10% Phúc Khí khi giải án và ở sảnh nghề. Không cộng Đạo Hạnh, cảnh giới hay công đức.» (canon §11 yêu cầu ghi rõ trong mô tả món).
4. **Không** có đếm ngược giảm giá, không «chỉ còn N món», không gói ngẫu nhiên (canon §14: không gacha).
5. **Chấm đỏ dock** tối đa 3 ngày liền nếu người chơi không mở (UI-09).

### 71.4 Trạng thái

| Ô | Hành vi |
|---|---|
| S-EMPTY | thẻ ô chưa có món nào ngoài món miễn phí: «Bạn đang mặc {món miễn phí}. Món khác mở bằng Phúc Khí hoặc Ngọc.» |
| S-ERR | mua thất bại: toast lý do `canBuy().reason` («Thiếu Ngọc (cần 160).», «Cần cấp 8.», «Chỉ dành cho VIP.», «Cần điểm danh 7 ngày liền.», «Đã có trong tủ.») — đã có |
| S-OFF | mua bằng Phúc Khí / Ngọc vẫn được (cục bộ); nạp tiền thật cần mạng |
| S-IOS | ẩn nút «Nạp Ngọc» và gói nạp (đã có `IOS ? '' : …`); IAP Apple là màn riêng khi có |
| S-LOCK | 🔒 + điều kiện (đã có) |

### 71.5 Âm và rung

| Hành động | Âm | Rung |
|---|---|---|
| điểm danh | `SFX-SHOP-001` (chuông gió + đồng xu) | medium |
| mua (thỉnh) | `SFX-SHOP-002` (gói lụa, buộc dây) | medium |
| mặc | `SFX-SHOP-003` (áo lụa phất) — biến thể theo ô: mũ `-h`, lưng `-b`, tay `-n` | light |
| mặc đủ bộ Hợp mệnh | `SFX-SHOP-004` (năm nốt ngũ âm của hành bộ đó) | heavy |

**Đo lường:** `ui_tangy_view {tab}`; `ui_tangy_checkin {day}`; `ui_tangy_buy {item, currency}`; `ui_tangy_try {item}`; `ui_tangy_equip {slot}`. **Không** đo thời gian «lưỡng lự» trước nút mua để tối ưu chuyển đổi (P6).

---

## UI-72 · Xem nhân vật xoay — phòng thử đồ (mã ngắn: `fitting`) ★ mới

| | |
|---|---|
| Mục đích | Thấy món trên người mình ngay trong bảng: xoay 360°, phóng, đổi giờ (ngày / đêm để thấy đèn lồng cầm tay sáng thật) |
| Nguồn | cảnh Three.js thứ hai cỡ nhỏ (canvas 320 × 420) dùng lại `characters.js`, `accessories.js`, `effects.js › createGiatri` |

```
┌──────────────────────────────────────┐
│ ‹ Tàng Y Các   Phòng thử         ✕   │
├──────────────────────────────────────┤
│            ┌───────────┐             │
│            │   (nhân   │             │  kéo để xoay
│            │   vật 3D) │             │
│            │  ✨ hào   │             │
│            │  quang    │             │
│            └───────────┘             │
│  [☀ Ngày | ☾ Đêm]  [Đứng | Đi | Bay] │
│ Đang thử: Phượng Hỏa Dực (Tiên ☆)    │
│ [ Thỉnh 💎 320 ]  [ Bỏ thử ]          │
└──────────────────────────────────────┘
```

**Luật:** «Đi» cho thấy vệt bước; «Bay» cho thấy ngự vật (kể cả khi người chơi chưa mở bay — xem thử được, ghi «Bay mở ở cấp 8 hoặc VIP»). Ánh sáng trung tính 3 điểm, nền tối `--hq-night`. Hiệu năng: cảnh thử đồ tạm dừng cảnh chính (khung chính ngừng vẽ khi bảng full).

---

## UI-73 · Chân Nhân (VIP) và Nạp Ngọc (mã ngắn: `vip`)

| | |
|---|---|
| Nguồn | `wardrobe-ui.js › vipView`: quyền lợi (💎 +30 / ngày; 🗡 bay ngay; ✨ mở sớm hào quang, linh khí, vệt bước; 👘 đồ độc quyền), gói nạp 60 / 330 / 700 / 1.600 Ngọc giá 22.000đ / 109.000đ / 219.000đ / 449.000đ (đang **khóa**, «Cổng thanh toán đang được chuẩn bị») |

**★ Màn khi cổng thanh toán mở:**

```
┌──────────────────────────────────────┐
│ ‹ Tàng Y Các   Nạp Ngọc          ✕   │
├──────────────────────────────────────┤
│ Ngọc dùng cho trang phục và tiện ích.│
│ Ngọc không mua được Đạo Hạnh, cảnh   │  câu bắt buộc (P6)
│ giới, công đức hay Mệnh Đồ.          │
│ ┌────────────┐ ┌────────────┐        │
│ │  💎 60     │ │  💎 330    │        │
│ │ 22.000đ    │ │ 109.000đ   │        │
│ └────────────┘ └────────────┘        │
│ ┌────────────┐ ┌────────────┐        │
│ │  💎 700    │ │  💎 1.600  │        │
│ │ 219.000đ   │ │ 449.000đ   │        │
│ └────────────┘ └────────────┘        │
│ Giá đã gồm thuế. Thanh toán qua      │
│ VNPay / thẻ (web) · Apple (iOS).     │
│ Giới hạn nạp tháng này: còn 2.000.000đ│  ★ giới hạn tự đặt (UI-75)
└──────────────────────────────────────┘
```

**Luật:** không gói «ưu đãi lần đầu ×2» nhấp nháy; không so sánh «tiết kiệm 30%» bằng màu đỏ. Xác nhận thanh toán luôn qua màn của cổng thanh toán (không lưu thẻ trong game). Người chơi dưới 18 tuổi (khai ở cổng — **câu hỏi mở**, tài liệu 14) có giới hạn tháng mặc định.

**Đo lường:** `ui_vip_view`; `ui_topup_view`; `ui_topup_select {pack}`; `ui_topup_result {ok, provider}` (không gửi số tiền gắn mã người chơi trong cùng sự kiện — §7.1 phần 01).

---

## UI-74 · Đạo Lộ mùa (mã ngắn: `season`)

| | |
|---|---|
| Nguồn | canon §11: «Đạo Lộ mùa» = battle pass **thẩm mỹ**, bộ phục mùa theo niên chủ Thái Tuế; `SEASON-xx` do tài liệu 11 |

```
┌──────────────────────────────────────┐
│ Đạo Lộ · mùa 丙午 (Thái Tuế Văn Triết)│
├──────────────────────────────────────┤
│ Bậc 7 / 40   ▓▓▓▓░░░░░░░░░           │
│ Điểm mùa từ: việc ngày, lễ tiết, giải │
│ án — không từ nạp tiền                │
│ ┌──┬──┬──┬──┬──┬──┐ (cuộn ngang)     │
│ │ 5│ 6│ 7│ 8│ 9│10│                  │
│ │🏷│✨│👘│☁ │🪭│🎐│ đường thường     │
│ │  │  │🔒│  │🔒│  │ đường Chân Nhân  │
│ └──┴──┴──┴──┴──┴──┘                  │
│ Còn 212 ngày (tới Lập Xuân)          │
└──────────────────────────────────────┘
```

**Luật:** chỉ phần thưởng thẩm mỹ (khung tên, hào quang, phẩm phục mùa). Điểm mùa **không** mua được trực tiếp (không «mua bậc»). Đếm ngày tới Lập Xuân (đổi niên chủ), không đếm giờ phút.

---

## UI-75 · Cài đặt — tổng (mã ngắn: `settings`)

| | |
|---|---|
| Nguồn | hiện có: Sổ Mệnh › Cài đặt (tên, dáng nam / nữ tu sĩ, «Xoá toàn bộ dữ liệu trong quán»), nút 🔈 HUD (`state.settings.sound`), chất lượng đồ họa qua `localStorage['huyenquan:quality']` (`low / mid / high`, không có giao diện) |
| Lối vào | ⚙ HUD (★); menu tạm nghỉ |

```
┌──────────────────────────────────────┐
│ Cài đặt                          ✕   │
├──────────────────────────────────────┤
│ 👤 Nhân vật                       ›  │  tên, dáng, đổi bát tự
│ 🔈 Âm thanh                       ›  │  UI-77
│ 🖥 Đồ họa                         ›  │  UI-77
│ 🎮 Điều khiển                     ›  │
│ ♿ Trợ năng                        ›  │  UI-76
│ 🌐 Ngôn ngữ: Tiếng Việt           ›  │  (English — sau)
│ 👥 Xã hội                         ›  │  lời mời, đã ẩn, hiện tên
│ 🔒 Quyền riêng tư & dữ liệu       ›  │  UI-78
│ 🕯 Nội dung âm tà: Tắt            ›  │  UI-79 (web)
│ 💳 Giới hạn chi tiêu              ›  │  (web, khi có nạp)
│ ℹ Giới thiệu · phiên bản 1.x.y      │
└──────────────────────────────────────┘
```

**Điều khiển (trang con):** độ nhạy xoay (mặc định 0,006 rad/px ngang, 0,004 dọc — `render3d.js`), đảo trục dọc, cần nổi / cố định, vùng chết cần (0,18), chạm-để-đi bật / tắt, giữ để chạy / chạm hai lần để chạy, rung bật / tắt + cường độ, bố cục một tay (trái / phải / tắt).

**Xã hội:** nhận lời mời (mọi người / đồng môn / tắt), hiện tên người khác (luôn / gần / tắt), danh sách đã ẩn.

**Đo lường:** `ui_settings_change {key}` (chỉ tên khóa và giá trị dạng enum / boolean).

---

## UI-76 · Cài đặt trợ năng (mã ngắn: `a11y`)

| Nhóm | Tùy chọn | Giá trị | Mặc định | Áp dụng vào |
|---|---|---|---|---|
| Chữ | Cỡ chữ giao diện | 85% · 100% · 115% · 130% · 150% | 100% | biến `--hq-fs` nhân mọi cỡ chữ (phần 07 §1.3) |
| | Phông dễ đọc | Mặc định · Không chân (bỏ serif ở thoại) | Mặc định | thoại, kinh |
| | Chữ Hán luôn kèm Hán Việt | Bật · Tắt | Bật | nhãn, trụ, thuật ngữ |
| | Độ đậm chữ | Thường · Đậm | Thường | toàn bộ |
| Màu | Chế độ mù màu | Tắt · Đỏ–lục (deuteranopia / protanopia) · Lam–vàng (tritanopia) · Đơn sắc | Tắt | bảng màu ngũ hành thay thế (phần 14 §2) |
| | Tương phản cao | Bật · Tắt | Tắt | nền thẻ đen hơn, viền 2 px, bỏ chữ mờ `.hq-note` |
| | Hoa văn ngũ hành | Bật · Tắt | Bật khi chế độ mù màu bật | Mệnh Bàn, thanh ngũ hành |
| Chuyển động | Giảm chuyển động | Theo hệ thống · Bật · Tắt | Theo hệ thống | biến `reduced` (đã có, hiện chỉ đọc hệ thống) |
| | Rung lắc camera | Bật · Tắt | Bật | camera điện ảnh (phần 08) |
| | Hạt, khói, cánh hoa | Đủ · Ít · Tắt | Đủ | VFX (phần 12) |
| | Nhấp nháy, lóe sáng | Bật · Tắt | Bật | sấm, lôi quang, đột phá |
| Âm thanh | Phụ đề thoại | Bật · Tắt | Bật | UI-40, cutscene |
| | Phụ đề âm thanh (mô tả âm) | Bật · Tắt | Tắt | «[tiếng chuông xa]» |
| | Chỉ báo âm thanh hướng | Bật · Tắt | Tắt | mũi tên nhỏ ở rìa màn cho âm quan trọng |
| | Đơn kênh (mono) | Bật · Tắt | Tắt | bus master |
| Điều khiển | Bố cục một tay | Tắt · Trái · Phải | Tắt | cần ảo + nút hành động + dock |
| | Giữ thay vì nhấn liên tục | Bật · Tắt | Tắt | mini-game nhịp (UI-81, UI-92) |
| | Thời gian thông báo | 1× · 1,5× · 2× | 1× | toast |
| | Tự chạy thoại | Bật · Tắt | Tắt | UI-40 |
| Nhịp | Hỗ trợ nhịp (mini-game) | Tắt · Rộng · Rất rộng · Tự động | Tắt | cửa sổ chấm nhịp (UI-92) |
| Nhắc | Nhắc nghỉ | Tắt · 60 · 90 · 120 phút | 90 | UI-18 |
| | Bộ theo dõi nhiệm vụ | Hiện · Ẩn | Hiện | UI-16 |

**Luật:** mọi tùy chọn có hiệu lực **ngay** (xem trước tại chỗ: đoạn chữ mẫu, mẫu ngũ hành). Đặt lại về mặc định có nút riêng. Đồng bộ với cài đặt hệ thống: «Theo hệ thống» đọc `prefers-reduced-motion`, `prefers-contrast` khi có.

**Đo lường:** `ui_a11y_change {key, value}` — dùng để ưu tiên đầu tư trợ năng; không gắn với hành vi chơi khác.

---

## UI-77 · Cài đặt âm thanh và đồ họa (mã ngắn: `av`)

**Âm thanh** (bus theo phần 11 §2):

| Thanh trượt | Mặc định | Ghi chú |
|---|---|---|
| Tổng | 80% | — |
| Nhạc (BGM) | 70% | — |
| Môi trường (gió, nước, chim) | 80% | thay tiếng gió tổng hợp `audio.js › startWind` (gain 0,05) |
| Hiệu ứng (SFX) | 80% | — |
| Giao diện | 60% | — |
| Thoại (VO) | 100% | — |
| Âm gõ chữ thoại | Bật | UI-40 |
| Phát khi chạy nền | Tắt | — |
| Chế độ đêm khuya (nén động) | Tự động 23:00–05:00 (giờ Tý–Dần) | giảm đỉnh 6 dB, phần 11 §3 |

**Đồ họa** (`world3d.js › QUALITY`, `render3d.js`):

| Tùy chọn | Giá trị | Mặc định | Nguồn |
|---|---|---|---|
| Chất lượng | Thấp · Vừa · Cao · Tự động | Tự động (cảm ứng → Vừa, chuột → Cao) | `pickQuality(coarse)` |
| Tự hạ khi chậm | Bật · Tắt | Bật | `fps < 35` → tắt bóng, `pixelRatio 1` (đã có) |
| Độ phân giải | 1× · 1,5× · 2× | cảm ứng 1,5×, chuột 2× | `setPixelRatio(min(dpr, coarse ? 1.5 : 2))` |
| Bóng đổ | Tắt · 1024 · 1536 · 2048 | theo chất lượng | `QUALITY[q].shadow` |
| Bloom (ánh sáng tỏa) | Bật · Tắt | theo chất lượng (Thấp tắt) | `UnrealBloomPass(0.28, 0.5, 0.96)` |
| Mật độ cây gần | 160 · 240 · 320 | theo chất lượng | `treesNear` |
| Đèn điểm tối đa | 6 · 10 · 16 | theo chất lượng | `POOL_N` |
| Tầm nhìn sương | 1.200 · 1.900 · 2.600 m | 1.900 | `Fog(260, 1900)` |
| Giới hạn khung hình | 30 · 60 · Không giới hạn | 60 | (mới — tiết kiệm pin) |
| Chế độ 2D (máy rất yếu) | Bật · Tắt | Tắt | `?2d` (đã có, hiện qua URL) |

Mỗi tùy chọn ghi ảnh hưởng pin / hiệu năng bằng một từ («nhẹ / vừa / nặng»). Đổi chất lượng cần tải lại cảnh → hộp xác nhận «Dựng lại quán với chất lượng mới?».

---

## UI-78 · Quyền riêng tư và dữ liệu (mã ngắn: `privacy`)

| Mục | Hành vi |
|---|---|
| Ngày sinh lưu ở đâu | «Chỉ trên máy này (`localStorage`, khóa `huyenquan:v1`).» |
| Công khai căn cốt | công tắc (UI-07) |
| Góp số liệu ẩn danh | công tắc (UI-07) |
| Sổ đời thực | bật / tắt (UI-30) |
| Lịch sử hỏi AI | «Không lưu trên máy chủ quán. Trên máy này: {n} cuộc» + [Xoá] |
| Xuất dữ liệu | tải tệp JSON toàn bộ trạng thái (hồ sơ, Sổ Công Quá, tủ đồ) |
| Xoá toàn bộ dữ liệu | hộp xác nhận z 80 hai bước: «Xoá toàn bộ dữ liệu trong quán? Không khôi phục được.» → gõ chữ «XOÁ» → `api.wipe()` (thay `confirm()` hiện có) |
| Chính sách đầy đủ | liên kết |

**Ngôn ngữ:** câu ngắn, «bạn», không thuật ngữ pháp lý trừ trong trang chính sách đầy đủ.

---

## UI-79 · Cổng xác nhận nội dung âm tà và Tà Lộ (mã ngắn: `amta`)

| | |
|---|---|
| Mục đích | Canon §5.5 + `amta-data › ETHICS`: nội dung âm tà chỉ mở sau **xác nhận tự nguyện**, như app |
| Lối vào | Cài đặt › Nội dung âm tà; lần đầu NPC mời vào Tà Lộ (Lỗ Ban, Hồi III) |
| Lớp | z 80 |

```
┌──────────────────────────────────────┐
│ Nội dung âm tà                       │
├──────────────────────────────────────┤
│ Phần này kể chuyện về cám dỗ, yểm    │
│ thuật và đường quay về. Đây là truyện│
│ hư cấu:                              │
│ · không có nghi thức, câu chú hay    │
│   nguyên liệu thật;                  │
│ · ký hiệu phù trong game là chữ bịa; │
│ · không nói ai «bị ma» — nhiều điều  │
│   gọi là tà thật ra là mệt mỏi, áp   │
│   lực, bệnh. Khi cần, hãy tìm bác sĩ │
│   hoặc người tư vấn.                 │
│ Bạn có thể tắt lại bất cứ lúc nào.   │
│ [ ] Tôi đủ 18 tuổi và muốn mở phần   │
│     này                              │
│ [ Mở nội dung ]   [ Để sau ]         │
└──────────────────────────────────────┘
```

**Luật:** nút «Mở nội dung» chỉ bật khi tick. Tắt lại: Tà Lộ đang dở dừng ở trạng thái an toàn; Nợ Âm vẫn hiện (công khai) và đường hồi đầu vẫn mở. iOS: mặc định không có lối vào (tài liệu 14 quyết định).

**Đo lường:** `ui_amta_view {from}`; `ui_amta_enable`; `ui_amta_disable`.
