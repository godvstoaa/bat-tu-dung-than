# 12 · Trình bày — Phần 02: Cổng, lễ nhập môn và khung chơi (UI-01 → UI-18)

> Mười tám màn / thành phần người chơi gặp trong 5 phút đầu và thấy suốt cuộc chơi. Viết theo mẫu phần 01 §8. Âm thanh dẫn mã `SFX-*` (phần 10), nhạc `BGM-*` (phần 09), rung theo bảng phần 07 §8.

---

## UI-01 · Khởi động và màn tải (mã ngắn: `boot`)

| | |
|---|---|
| Mục đích | Che thời gian tải Three.js + dựng Sơn Môn + chunk địa hình; đặt không khí «quán cổ» ngay giây đầu |
| Lối vào | mở `game.html`; vỏ iOS mở overlay; `enter()` lần đầu (`renderer` chưa có) |
| Nguồn | `markup.js › #hq-loading` («Đang dựng Huyền Quán…»); `main.js › enter() → createScene()`; rơi về 2D khi WebGL lỗi |
| Lớp | z 4, che `.hq-stage` |

**Khung dọc**

```
┌──────────────────────────────────────┐
│                                      │
│                                      │
│               玄  館                 │  chữ Hán 40 px, son, giãn 12 px
│            Huyền Quán                │
│                                      │
│        ─────────●──────────          │  thanh mực: nét bút lông chạy ngang
│        Đang dựng Huyền Quán…         │
│                                      │
│   «Lá số là hạt giống, không phải    │  câu dẫn xoay vòng (8 câu)
│    cái cây.»                         │
│                                      │
│                                      │
└──────────────────────────────────────┘
```

**Khung ngang:** cùng bố cục, căn giữa, câu dẫn rộng tối đa 520 px.

**Thành phần**

| Phần tử | Loại | Dữ liệu | Ghi chú |
|---|---|---|---|
| Chữ Hán thương hiệu | văn bản trang trí `aria-hidden` | `TEXT.han` («玄 館» / iOS «學 館») | phông Noto Serif SC 700 |
| Tên | `h1` ẩn với trình đọc (đọc câu trạng thái) | `TEXT.brand` | — |
| Thanh mực | `progress` tùy chỉnh | tiến độ thật: tải module (30%), dựng cảnh (40%), chunk gần + tượng GLB (30%) | không bao giờ «đứng» quá 3 s: nếu tiến độ thật đứng yên, nét mực vẫn thấm nhẹ (giả tiến 1%/s, trần 95%) |
| Câu dẫn | `p` `aria-live="polite"` | 8 câu tuyển từ canon (bảng dưới) | đổi mỗi 4 s; tắt đổi khi giảm chuyển động |

**Câu dẫn xoay vòng** (khóa `ui.boot.tip.1…8`):

| # | Câu |
|---|---|
| 1 | «Lá số là hạt giống, không phải cái cây.» |
| 2 | «Mệnh do ta tạo, phúc tự mình cầu.» |
| 3 | «Mọi con số trong Sổ Mệnh đều có nút "Vì sao?".» |
| 4 | «Ngày sinh của bạn chỉ lưu trên máy này.» |
| 5 | «Giờ Tý là giờ quán yên tĩnh nhất.» |
| 6 | «Kéo để xoay, lăn chuột hoặc chụm hai ngón để lại gần.» |
| 7 | «Không có quái để chém. Thử thách là tâm, trí, đức, nghề.» |
| 8 | «Mỗi việc thiện là một nét bạn tự viết lại.» |

**Trạng thái**

| Ô | Hành vi |
|---|---|
| S-LOAD | như khung trên |
| S-EMPTY | — (luôn có nội dung) |
| S-ERR | WebGL không khởi tạo được → rơi về 2D không báo lỗi (đã có); nếu cả 2D lỗi: «Máy chưa dựng được quán. Thử tải lại trang, hoặc mở bằng Chrome / Safari mới.» + nút «Tải lại» |
| S-OFF | không ảnh hưởng (MMO kết nối sau khi vào) |
| S-IOS | chữ «學 館 / Học Quán» |
| S-AIOFF | — |
| S-LOCK | — |
| S-RM | thanh mực không chạy hoạt ảnh, chỉ đổi độ dài; câu dẫn không xoay |

**Tương tác:** không có. Âm: không phát tiếng (trình duyệt chặn tự phát trước thao tác người dùng; `audio.js` mặc định tắt).

**Trợ năng:** `role="status"` trên vùng chữ; trình đọc đọc «Đang dựng Huyền Quán, 40 phần trăm» mỗi khi tiến 20%.

**Đo lường:** `ui_boot_view {ms_load}` khi xong; `ui_boot_error {code: webgl|2d}`; `ui_boot_fallback2d`.

**Nghiệm thu:** điện thoại tầm trung (Snapdragon 7-series) vào cảnh ≤ 6 s qua 4G; câu dẫn không lặp trong một lần tải; 2D fallback hiện đúng `aspect-ratio 640/448`.

---

## UI-02 · Cổng — người chơi mới (mã ngắn: `gate`)

| | |
|---|---|
| Mục đích | Mời nhập bát tự; nói rõ dữ liệu ở đâu; đặt kỳ vọng «tham khảo và chiêm nghiệm» |
| Lối vào | lần đầu mở game (`state.player.birth` rỗng) |
| Nguồn | `markup.js › #hq-gate`, `.hq-gate-card`; `main.js › showGate() → showBirth()` |
| Lớp | toàn màn (thay khung chơi) |

**Khung dọc**

```
┌──────────────────────────────────────┐
│░░░░░░ nền tỏa son tím (radial) ░░░░░░│
│  ┌────────────────────────────────┐  │
│  │            玄  館              │  │
│  │          Huyền Quán            │  │  h1 30 px vàng
│  │ Ghé quán xem tứ trụ, hướng nhà,│  │  TEXT.gateLead
│  │ xin một quẻ, rồi ngồi uống chén│  │
│  │ trà. Không ai giục.            │  │
│  │ ┌────────────────────────────┐ │  │
│  │ │   (UI-03 mẫu bát tự)       │ │  │
│  │ └────────────────────────────┘ │  │
│  │ Dữ liệu chỉ lưu trên máy bạn.  │  │  .hq-fine 12,5 px
│  │ Nội dung để tham khảo và chiêm │  │
│  │ nghiệm.                        │  │
│  │ [ ← Quay lại ]                 │  │  chỉ khi có onExit
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

**Khung ngang:** thẻ rộng 440 px giữa màn; phía sau là ảnh chụp tĩnh cổng Sơn Môn lúc hoàng hôn (★ mới, 1600 × 900 webp ≤ 180 KB) thay nền radial, mờ 4 px.

**Thành phần**

| Phần tử | Loại | Ghi chú |
|---|---|---|
| `.hq-gate-han` | trang trí | iOS «學 館» |
| `h1#hq-gate-title` | tiêu đề | đích của `aria-labelledby` |
| `.hq-sub` dẫn | đoạn | `TEXT.gateLead` |
| `.hq-gate-body` | khung con | chứa UI-03 / UI-04 / UI-06 |
| `.hq-fine` | chú thích pháp lý | không bao giờ ẩn |
| `#hq-gate-exit` | nút | ẩn nếu không có `onExit` |

**Trạng thái:** S-IOS đổi chữ theo `TEXT`; S-RM tắt nền động (nếu có ảnh động mùa lễ); các ô khác — (cổng chạy cục bộ).

**Câu chữ**

| Khóa | Web | iOS |
|---|---|---|
| `ui.gate.lead` | Ghé quán xem tứ trụ, hướng nhà, xin một quẻ, rồi ngồi uống chén trà. Không ai giục. | Sân học cổ pháp: ngồi bàn thầy dựng tứ trụ, xoay la bàn, xem lịch tiết khí, rồi ngồi uống chén trà. |
| `ui.gate.fine` | Dữ liệu chỉ lưu trên máy bạn. Nội dung để tham khảo và chiêm nghiệm. | (giống web) |
| `ui.gate.back` | ← Quay lại | ← Quay lại |

**Âm / nhạc:** khi người chơi chạm lần đầu vào bất kỳ đâu trên cổng (mở khóa WebAudio) và cài đặt âm đang bật → phát `BGM-GATE-01` (nhạc cổng, phần 09) nhỏ dần lên trong 4 s; tiếng chuông gió `SFX-AMB-031` thưa.

**Đo lường:** `ui_gate_view {from: boot|exit}`.

**Nghiệm thu:** thẻ không tràn ở 320 px rộng; chữ pháp lý luôn nằm trong thẻ, không phải cuộn mới thấy trên 390 × 844 khi mẫu đã thu gọn.

---

## UI-03 · Mẫu bát tự sinh thần (mã ngắn: `birth`)

| | |
|---|---|
| Mục đích | Thu năm–tháng–ngày–giờ sinh, giới tính, tên trong quán → chạy `chartOf()` (bọc `analyze()`) |
| Lối vào | UI-02; «Sửa bát tự» từ UI-06; «Sửa ngày giờ» từ UI-04 |
| Nguồn | `main.js › birthForm(), showBirth()`; `stations.js › chartOf()`; `names.js › randomName()` |

**Khung dọc** (trong thẻ cổng)

```
┌────────────────────────────────┐
│ Thầy cần bát tự sinh thần để   │
│ định Dụng thần, may phẩm phục  │
│ hợp mệnh cho bạn. Ngày sinh    │
│ chỉ lưu trên máy này.          │
│ Tên trong quán                 │
│ ┌──────────────────────┐ ┌──┐  │
│ │ Thanh Vân            │ │🎲│  │
│ └──────────────────────┘ └──┘  │
│ Giới tính (lập lá số + dáng)   │
│ (•) Nam   ( ) Nữ               │
│ Ngày sinh (dương lịch)         │
│ ┌────────────────────────────┐ │
│ │ 15/05/1990             📅 │ │
│ └────────────────────────────┘ │
│  ↳ Âm lịch: 21/4 Canh Ngọ  ★  │  dòng xác nhận âm lịch (mới)
│ Giờ sinh                       │
│ ┌────────────────────────────┐ │
│ │ 08:30                  🕗 │ │
│ └────────────────────────────┘ │
│  ↳ giờ Thìn (07–09)       ★   │  dòng giờ can chi (mới)
│ [✓] Không rõ giờ sinh (thầy   │
│     tạm lấy giờ Ngọ)           │
│ (lỗi hiện ở đây)               │
│ ┌────────────────────────────┐ │
│ │    Xin thầy lập mệnh       │ │  .hq-primary .hq-big
│ └────────────────────────────┘ │
│ ▸ Nhập theo âm lịch      ★    │  mở rộng (mới)
└────────────────────────────────┘
```

**Thành phần**

| Phần tử | Loại | Ràng buộc | Ghi chú |
|---|---|---|---|
| Tên | `input` maxlength 24 | lọc theo `protocol.js › cleanName` khi lên phòng chung | nút 🎲 `aria-label="Đổi tên ngẫu nhiên"` |
| Giới tính | radio | bắt buộc | quyết định chiều đại vận và dáng `hero_m` / `hero_f` |
| Ngày sinh | `input type=date` | 1900-01-01 → 2100-12-31 | bắt buộc |
| ★ Dòng âm lịch | `output` | tính bằng `lunar-javascript` (đã có trong dự án, `que-ui.js` dùng `Solar`) | giúp người nhớ ngày âm tự kiểm |
| Giờ sinh | `input type=time` | mặc định 12:00 | tắt khi chọn «Không rõ» |
| ★ Dòng giờ can chi | `output` | 12 canh giờ, ghi rõ giờ Tý chia đầu / cuối ngày theo cài đặt engine | — |
| Không rõ giờ | checkbox | `hourUnknown: true`, lấy 12:00 | đã có |
| ★ Nhập theo âm lịch | `details` | ngày / tháng / năm âm + cờ tháng nhuận → đổi sang dương rồi điền ô ngày | người lớn tuổi thường nhớ ngày âm |
| Lỗi | `p.hq-error role=alert` | — | đã có |
| Nút gửi | `button.hq-primary.hq-big` | — | — |

**Trạng thái**

| Ô | Hành vi |
|---|---|
| S-LOAD | sau khi bấm gửi, nút đổi «Thầy đang lật sách…» và khóa 300–800 ms (analyze chạy đồng bộ; chèn một khung hình để nút kịp đổi chữ) |
| S-EMPTY | ô tên đã điền sẵn tên ngẫu nhiên; ô ngày trống |
| S-ERR | ngày thiếu: «Xin cho thầy ngày sinh đầy đủ.» (đã có). Engine ném lỗi: hiện `ex.message` hoặc «Thầy chưa lập được lá số này.» (đã có). ★ Ngày tương lai: «Ngày này chưa tới. Xin cho thầy ngày đã qua.» ★ Tháng nhuận không tồn tại năm đó: «Năm ấy không có tháng Tư nhuận.» |
| S-OFF / S-AIOFF | — (cục bộ) |
| S-IOS | lời dẫn «Thầy cần bát tự sinh thần để dựng tứ trụ học tập…» (bỏ chữ «hợp mệnh») |
| S-LOCK | — |
| S-RM | — |

**Câu chữ bổ sung**

| Khóa | Tiếng Việt |
|---|---|
| `ui.birth.lead` | Thầy cần **bát tự sinh thần** để định Dụng thần, may phẩm phục hợp mệnh cho bạn. Ngày sinh chỉ lưu trên máy này. |
| `ui.birth.name` | Tên trong quán |
| `ui.birth.gender` | Giới tính (lập lá số + dáng nhân vật) |
| `ui.birth.date` | Ngày sinh (dương lịch) |
| `ui.birth.lunar_echo` | Âm lịch: {d}/{m}{nhuận} năm {canChi} |
| `ui.birth.time` | Giờ sinh |
| `ui.birth.hour_echo` | giờ {chi} ({from}–{to}) |
| `ui.birth.nohour` | Không rõ giờ sinh (thầy tạm lấy giờ Ngọ) |
| `ui.birth.nohour_note` | Không có giờ, thầy chỉ luận được ba trụ chắc chắn. Trụ giờ sẽ ghi «tạm». |
| `ui.birth.submit` | Xin thầy lập mệnh |
| `ui.birth.submitting` | Thầy đang lật sách… |
| `ui.birth.lunar_toggle` | Nhập theo âm lịch |
| `ui.birth.err.date` | Xin cho thầy ngày sinh đầy đủ. |
| `ui.birth.err.future` | Ngày này chưa tới. Xin cho thầy ngày đã qua. |
| `ui.birth.err.leap` | Năm ấy không có tháng {m} nhuận. |

**Tương tác**

| Hành động | Kết quả | Âm | Rung |
|---|---|---|---|
| bấm 🎲 | điền tên mới | `SFX-UI-012` (lật thẻ tre) | light |
| tick «Không rõ giờ» | khóa ô giờ, hiện ghi chú | `SFX-UI-004` | — |
| gửi hợp lệ | chạy `chartOf` → UI-04 | `SFX-RITE-001` (gõ bút lên nghiên) | medium (đã có) |
| gửi lỗi | rung ô lỗi 2 lần (tắt khi giảm chuyển động), focus về ô lỗi | `SFX-UI-020` (gỗ trầm, không chói) | light |

**Trợ năng:** mọi ô có `label` bao quanh (đã có). Trên cảm ứng không tự focus ô nhập (đã có — tránh bàn phím che). Dòng âm lịch và giờ can chi là `output` có `aria-live="polite"` để trình đọc xác nhận. Ô ngày gốc của trình duyệt giữ nguyên (đọc được bằng VoiceOver) — không thay bằng bộ chọn tự vẽ.

**Đo lường:** `ui_birth_view`; `ui_birth_submit {nohour: bool, lunar_input: bool}`; `ui_birth_error {code: date|future|leap|engine}`. **Không** gửi giá trị ngày.

**Nghiệm thu:** nhập `MAU-A` (1990-05-15 08:30 nam) ra dòng âm lịch «21/4 năm Canh Ngọ» và «giờ Thìn (07–09)»; lá số khớp trang chính 100% (cùng `chartOf`).

---

## UI-04 · Lễ nhập môn — lật trụ (mã ngắn: `rite`)

| | |
|---|---|
| Mục đích | Biến kết quả `analyze()` thành **khoảnh khắc nghi thức**: lật bốn trụ, hiện ngũ hành, Dụng / Hỷ / Kỵ, may phẩm phục. Người chơi phải cảm thấy «game hiểu mình» |
| Lối vào | gửi UI-03 thành công |
| Nguồn | `main.js › ceremony(R, name)`; CSS `.hq-rite`, `.hq-pillar.rite` (`hq-flip` 0,5 s, trễ 0,35 s mỗi trụ), `.hq-wxbar` |

**Trình tự thời gian** (giây kể từ khi màn hiện; hiện có chỉ là lật bốn trụ cùng lúc có trễ — bảng dưới là bản đầy đủ M0):

| t (s) | Hình | Âm (phần 10) | Rung |
|---|---|---|---|
| 0,0 | «Thầy đặt bút, lật từng trụ…»; bốn thẻ gỗ úp (vân gỗ `#5a3520 / #6b3f26`) | `SFX-RITE-002` mài mực | — |
| 0,4 | lật trụ **Giờ** (trái → phải: Giờ, Ngày, Tháng, Năm — đúng thứ tự cột hiện có) | `SFX-RITE-003a` thẻ tre lật | light |
| 0,75 | lật trụ **Ngày** — viền son (nhật chủ) | `SFX-RITE-003b` (cao hơn nửa cung) | light |
| 1,1 | lật trụ **Tháng** | `SFX-RITE-003c` | light |
| 1,45 | lật trụ **Năm** | `SFX-RITE-003d` | light |
| 1,9 | dòng «Nhật chủ 庚 (Kim) · Thân vượng» | `SFX-BELL-003` khánh nhỏ | — |
| 2,4 | thanh ngũ hành chạy từ trái sang (5 khúc theo `wx.pct`) | `SFX-RITE-004` gió lùa qua giấy | — |
| 3,0 | ba dòng Dụng / Hỷ / Kỵ hiện lần lượt cách 0,3 s, mỗi dòng có chấm màu | `SFX-UI-031` ×3 | — |
| 4,0 | câu trích «… mệnh cần Thủy. Mặc màu Thủy vào quán cho hợp khí.» | — | medium |
| 4,4 | hai nút hiện | — | — |

**Khung dọc**

```
┌────────────────────────────────┐
│ Thầy đặt bút, lật từng trụ…    │
│ ┌─────┐┌─────┐┌─────┐┌─────┐   │
│ │ Giờ ││Ngày ││Tháng││ Năm │   │  .hq-pillars.sm
│ │  庚 ││ 庚▣ ││  辛 ││  庚 │   │  can: màu hành
│ │  辰 ││  辰 ││  巳 ││  午 │   │  chi: màu hành
│ │Canh ││Canh ││ Tân ││Canh │ ★ │  dòng Hán Việt (mới)
│ │Thìn ││Thìn ││ Tỵ  ││ Ngọ │   │
│ └─────┘└─────┘└─────┘└─────┘   │
│ Nhật chủ 庚 (Kim) · Thân vượng │
│ ▓▓▓▓▓▓▓░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒░    │  .hq-wxbar (Mộc Hỏa Thổ Kim Thủy)
│  木 火  土    金          水  ★│  nhãn chữ dưới thanh (mới)
│ ● Dụng thần: Thủy → màu áo     │
│ ● Hỷ thần: Kim · đai Mộc  ★   │
│ ● Kỵ thần: Thổ → nên tránh     │
│ ┃ «Thanh Vân mệnh cần Thủy.    │  .hq-quote
│ ┃  Mặc màu Thủy vào quán cho   │
│ ┃  hợp khí.»                   │
│ ┌────────────────────────────┐ │
│ │ Mặc phẩm phục · bước qua   │ │
│ │ cổng                       │ │
│ └────────────────────────────┘ │
│ [ Sửa ngày giờ ]               │
└────────────────────────────────┘
```

*(Đúng lá số `MAU-A` khi chạy engine: 庚辰 · 庚辰 · 辛巳 · 庚午; Dụng Thủy, Hỷ Kim, Kỵ Thổ; Mộc 6,5% · Hỏa 18,3% · Thổ 17,9% · Kim 55,1% · Thủy 2,2%.)*

**Thay đổi so với hiện có (★):**

1. **Dòng Hán Việt dưới mỗi chữ** (P5). Hiện thẻ trụ chỉ có chữ Hán.
2. **Nhãn hành dưới thanh ngũ hành**: chữ Hán 木火土金水 + phần trăm khi chạm (hiện chỉ có `title` — không đọc được trên cảm ứng).
3. **Không rõ giờ**: trụ giờ có nhãn «tạm» góc phải, viền đứt.
4. Thêm bước **UI-05 Lộ căn cốt** giữa «Mặc phẩm phục» và vào cảnh **chỉ từ bản M0** (khi đã có Mệnh Bàn). Trước M0 giữ luồng hiện tại.
5. **Sửa nhãn Hỷ thần (lỗi hiển thị tìm thấy khi rà code).** `ceremony()` lấy `acc = y.secondary || y.xi` rồi ghi «Hỷ thần». Với `MAU-A`, engine trả `yong.secondary = 木` còn `yong.xi = 金`, nên màn hiện «Hỷ thần: Mộc» — sai so với trang chính (Hỷ = Kim). Đề xuất: dòng chữ luôn đọc `yong.xi` cho nhãn «Hỷ thần»; màu đai có thể giữ quy tắc `secondary || xi` nhưng ghi đúng tên: «Đai: Mộc (hành phụ trợ)». Kiểm bằng `MAU-A`.

**Trạng thái:** S-RM → bốn trụ hiện ngay không lật, thanh ngũ hành hiện đủ ngay; âm vẫn phát nhưng dồn vào 0,6 s. S-IOS → bỏ dòng «hợp mệnh» trong câu trích, giữ ngũ hành (giáo dục). S-ERR → không xảy ra (lỗi đã bắt ở UI-03).

**Câu chữ**

| Khóa | Tiếng Việt |
|---|---|
| `ui.rite.lead` | Thầy đặt bút, lật từng trụ… |
| `ui.rite.col` | Giờ / Ngày / Tháng / Năm |
| `ui.rite.dm` | Nhật chủ **{can}** ({hành}) · **{thânLực}** |
| `ui.rite.yong` | Dụng thần: {hành} → màu áo phẩm phục |
| `ui.rite.xi` | Hỷ thần: {hành} → màu đai |
| `ui.rite.ji` | Kỵ thần: {hành} → nên tránh |
| `ui.rite.quote` | «{tên} mệnh cần {hành}. Mặc màu {hành} vào quán cho hợp khí.» |
| `ui.rite.wear` | Mặc phẩm phục · bước qua cổng |
| `ui.rite.redo` | Sửa ngày giờ |
| `ui.rite.tentative` | tạm |
| `ui.rite.toast_done` | Phẩm phục {hành} đã mặc. Thầy đang ngồi ở Chính Đường. |

**Tương tác:** chạm một trụ (sau khi lật xong) → bong bóng nhỏ: «Trụ Ngày · Canh Thìn · nạp âm Bạch Lạp Kim» (nạp âm lấy từ engine). Chạm thanh ngũ hành → bảng nhỏ 5 dòng phần trăm. «Mặc phẩm phục» → lưu `state.player`, tạo hồ sơ «Bản thân», gọi `enter()`, toast (đã có).

**Trợ năng:** bảng trụ là `table` có `caption` «Tứ trụ của bạn»; mỗi ô đọc «Trụ ngày, can Canh, hành Kim, chi Thìn, hành Thổ». Thanh ngũ hành có bản văn thay thế «Mộc 6,5%, Hỏa 18,3%, Thổ 17,9%, Kim 55,1%, Thủy 2,2%».

**Đo lường:** `ui_rite_view`; `ui_rite_tap_pillar {i}`; `ui_rite_done {ms_open}`; `ui_rite_redo`.

**Nghiệm thu:** tổng thời lượng ≤ 4,5 s; người chơi có thể bấm «Mặc phẩm phục» ngay từ 1,0 s (bỏ qua hoạt ảnh — nút hiện sớm nhưng mờ 60% cho tới 4,4 s, vẫn bấm được).

---

## UI-05 · Lộ căn cốt — Tiềm Lực và Phẩm căn (mã ngắn: `reveal`) ★ mới

| | |
|---|---|
| Mục đích | Lần đầu cho người chơi thấy **Tiềm Lực** (`synthesis.score`), **Phẩm căn** (`gradeVi`), **Mệnh Cách** (`patternQuality.quality`) — với câu dẫn bắt buộc chống cảm giác bị phán xét |
| Lối vào | UI-04 «Mặc phẩm phục» (từ M0) |
| Nguồn | (chưa có — cần làm) — dữ liệu từ `menhban.js` (TASK của tài liệu 13) |
| Lớp | z 50 (khoảnh khắc nghi thức), trong thẻ cổng |

**Khung dọc**

```
┌────────────────────────────────┐
│          CĂN CỐT               │
│                                │
│        ╭──────────╮            │
│       ╱  41 / 100  ╲           │  vòng mực vẽ dần tới 41%
│      │   Tiềm Lực   │          │
│       ╲            ╱           │
│        ╰──────────╯            │
│     Tứ Linh Căn                │  Phẩm căn
│     TRUNG ĐẲNG · Cân bằng      │  gradeVi gốc, cỡ nhỏ
│     hơn 31% người  ⓘ          │  percentile
│                                │
│  Mệnh Cách: Đắc Cứu ⓘ        │  (MAU-A: 七殺格 · 有救)
│  Hệ số tu Hậu Thiên: ×1,19     │  clamp(1+(60−41)/100)
│ ┃ «Lá số là hạt giống, không   │  câu dẫn bắt buộc
│ ┃  phải cái cây. Hạt nhỏ thì   │
│ ┃  phải chăm nhiều hơn. Thầy   │
│ ┃  chưa từng thấy ai chăm mà   │
│ ┃  cây không lớn.»             │
│ [ Vì sao 41 điểm? ]            │  → UI-22
│ ┌────────────────────────────┐ │
│ │      Bước qua cổng         │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

**Luật hiển thị (P2):**

| Điều kiện | Màu vòng | Câu dẫn | Dòng thêm |
|---|---|---|---|
| điểm < 28 (Phàm Căn) | mực đen–vàng nhạt (`--hq-gold` 60%) — **không đỏ** | câu bắt buộc §4.7 | «Bạn mở **Nghịch Thiên Lộ** và chuỗi «Khổ tận cam lai». Hệ số tu ×1,32 trở lên.» |
| 28–35 (Ngũ Linh Căn) | như trên | câu bắt buộc | «Bạn mở **Nghịch Thiên Lộ**.» |
| 36–57 | `--hq-gold` | câu bắt buộc | hệ số |
| ≥ 58 | `--hq-gold` đậm | câu bắt buộc **vẫn hiện** | «Tốt thì giữ. Không ai được miễn tu.» (§5.1) |
| ≥ 86 (Thiên Linh Căn) | vàng + khảm ánh sáng | câu bắt buộc | «Thử thách của bạn là chữ "mạn" (kiêu).» |

Câu dẫn **luôn hiện với mọi điểm** — để người điểm cao không coi đó là lời an ủi riêng cho người điểm thấp (tránh phân tầng ngầm).

**Thành phần:** vòng điểm (SVG `circle` stroke-dasharray), nhãn Phẩm căn (chữ Hán Việt lớn + gradeVi gốc nhỏ), dòng bách phân vị, dòng Mệnh Cách (chạm ⓘ mở mô tả 4 lớp §4.5), dòng hệ số Nghịch Thiên (công thức canon), câu dẫn `.hq-quote`, nút «Vì sao?», nút chính.

**Trạng thái:** S-RM vòng hiện ngay. S-IOS: giữ (căn cốt là chỉ số, không phải đoán vận — nhưng đổi «Mệnh Cách» thành «Kiểu lá số» theo bộ chữ học tập). S-ERR: nếu `menhban` lỗi → bỏ qua màn, vào thẳng cảnh, ghi log.

**Câu chữ**

| Khóa | Tiếng Việt |
|---|---|
| `ui.reveal.title` | Căn cốt |
| `ui.reveal.score` | Tiềm Lực |
| `ui.reveal.pct` | hơn {p}% người |
| `ui.reveal.coef` | Hệ số tu Hậu Thiên: ×{k} |
| `ui.reveal.lead` | «Lá số là hạt giống, không phải cái cây. Hạt nhỏ thì phải chăm nhiều hơn. Thầy chưa từng thấy ai chăm mà cây không lớn.» |
| `ui.reveal.why` | Vì sao {n} điểm? |
| `ui.reveal.go` | Bước qua cổng |
| `ui.reveal.nt` | Bạn mở Nghịch Thiên Lộ. |
| `ui.reveal.keep` | Tốt thì giữ. Không ai được miễn tu. |

**Âm:** vòng vẽ → `SFX-RITE-005` (bút lông kéo dài theo vòng); xong vòng → `SFX-BELL-001` chuông đồng lớn, nhỏ âm lượng −6 dB. Không dùng âm «thua» cho điểm thấp — cùng một âm cho mọi điểm.

**Đo lường:** `ui_reveal_view {tier}` (tier nhóm theo §7.1, chỉ khi người chơi bật góp số liệu); `ui_reveal_tap_why`; `ui_reveal_done {ms_open}`.

**Nghiệm thu:** thử 6 lá số mẫu tài liệu 04 (điểm < 28 … ≥ 73): câu dẫn hiện đủ cả 6; không có màu đỏ ở bất kỳ điểm nào; ≥ 90% người thử (n ≥ 20) không chọn «bị phán xét» trong khảo sát sau màn.

---

## UI-06 · Cổng — người chơi quay lại (mã ngắn: `welcome`)

| | |
|---|---|
| Mục đích | Chào lại, nhắc tiến độ, vào nhanh một chạm |
| Lối vào | mở game khi `state.player.birth` đã có |
| Nguồn | `main.js › showGate()` (nhánh có `birth`) |

**Khung dọc**

```
┌────────────────────────────────┐
│            玄  館              │
│          Huyền Quán            │
│ Chào Thanh Vân quay lại quán.  │  18 px
│ Môn Sinh · ✦ 120 Phúc Khí ·    │
│ chuỗi 3 ngày                   │
│ ● Phẩm phục Thủy · đai Kim     │
│ ┌ hôm nay ★ ─────────────────┐ │
│ │ Ngày Giáp Tý · mùng 8/9 âm │ │  todayInfo()
│ │ Đèn Thái Tuế: chưa thêm dầu│ │  (web)
│ │ 0/3 việc · 3 khách đang chờ│ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │      Bước qua cổng         │ │
│ └────────────────────────────┘ │
│ [ Sửa bát tự ]                 │
└────────────────────────────────┘
```

**★ Thẻ «hôm nay»** (mới): ngày can chi + âm lịch (`stations.js › todayInfo`), trạng thái đèn Thái Tuế (`S.lampState`, chỉ web), số việc trong ngày, số khách án chờ (3 − số án đã xong). Khi có lễ tiết (tài liệu 10 `EV-*`) thì dòng đầu đổi thành tên lễ.

**Trạng thái:** S-IOS bỏ dòng đèn Thái Tuế. S-OFF không ảnh hưởng.

**Câu chữ:** `ui.welcome.hi` «Chào {tên} quay lại quán.»; `ui.welcome.robe` «Phẩm phục {hành}{ · đai {hành}}»; `ui.welcome.enter` «Bước qua cổng»; `ui.welcome.rebirth` «Sửa bát tự»; `ui.welcome.today` «Ngày {canChi} · {âmLịch}».

**Tương tác:** `Enter` khi thẻ có focus = bước qua cổng. «Sửa bát tự» → UI-03 với giá trị cũ điền sẵn (đã có). ★ Sửa bát tự khi đã có Mệnh Đồ / Sổ Công Quá → hộp xác nhận: «Đổi bát tự sẽ dựng lại Mệnh Bàn và Mệnh Đồ. Công đức và Đạo Hạnh đã tích **giữ nguyên**.»

**Đo lường:** `ui_welcome_view {streak_bucket}`; `ui_welcome_enter {ms_open}`; `ui_welcome_rebirth`.

---

## UI-07 · Chấp thuận dữ liệu (mã ngắn: `consent`) ★ mới

| | |
|---|---|
| Mục đích | Một lần duy nhất, nói rõ: ngày sinh ở đâu, MMO gửi gì, AI nhận gì; lựa chọn công khai căn cốt; lựa chọn góp số liệu ẩn danh |
| Lối vào | trước UI-03 lần đầu; Cài đặt › Quyền riêng tư (UI-78) |
| Nguồn | (chưa có — cần làm); chính sách theo §14 bản tổng («Dữ liệu cá nhân») |

**Khung dọc**

```
┌────────────────────────────────┐
│ Trước khi thầy xem             │
│                                │
│ 🔒 Ngày giờ sinh chỉ lưu trên  │
│    máy này.                    │
│ 👥 Khi vào phòng chung, người  │
│    khác chỉ thấy tên, màu áo,  │
│    trang phục, Đạo Hạnh tổng.  │
│ 🎙 Khi bạn hỏi Thầy (AI), câu  │  (web)
│    hỏi và bản tóm tắt lá số    │
│    được gửi tới máy chủ AI để  │
│    trả lời, không lưu tên bạn. │
│ ─────────────────────────────  │
│ [ ] Công khai căn cốt (Tiềm Lực│
│     và Phẩm căn) trên thẻ của  │
│     tôi                        │
│ [ ] Góp số liệu ẩn danh để cân │
│     bằng game                  │
│ ┌────────────────────────────┐ │
│ │      Tôi hiểu, tiếp tục    │ │
│ └────────────────────────────┘ │
│ Đọc đầy đủ ›                   │
└────────────────────────────────┘
```

**Luật:** hai ô chọn **mặc định tắt**. Không có nút «Đồng ý tất cả». Nút tiếp tục không phụ thuộc ô chọn. iOS: bỏ dòng AI.

**Đo lường:** chỉ `ui_consent_done {public_root: bool, analytics_opt: bool}` — và chỉ gửi **sau** khi người chơi chọn (nếu tắt góp số liệu thì vẫn gửi đúng một sự kiện này, không kèm gì khác; ghi rõ trong «Đọc đầy đủ»).

**Nghiệm thu:** duyệt pháp lý (Nghị định 13/2023 về bảo vệ dữ liệu cá nhân của Việt Nam; GDPR nếu mở EU); văn bản đọc xong ≤ 30 giây.

---

## UI-08 · HUD chính (mã ngắn: `hud`)

| | |
|---|---|
| Mục đích | Cho biết mình là ai, đang có gì, đang trong phòng nào — không che cảnh |
| Nguồn | `markup.js › header.hq-hud`; `main.js › updateHud()`, `updateOnline()` |
| Lớp | dòng cố định trên cùng, ngoài canvas |

**Khung dọc (hiện có + ★)**

```
┌──────────────────────────────────────┐
│[←] Thanh Vân · Môn Sinh · Cấp 4  [🗡][🔈][⚙★]│
│    ✦ 120  🔥 3  💎 45  👥 12  ☯ Nhập Môn★ │
└──────────────────────────────────────┘
```

**Thành phần**

| Phần tử | Id | Dữ liệu | Hành vi |
|---|---|---|---|
| Thoát | `#hq-exit` | — | chỉ khi có `onExit` |
| Danh tính | `#hq-who` | `tên · danh xưng (S.titleFor) · Cấp (levelInfo)` | cắt `…` khi dài; ★ chạm → Sổ Mệnh thẻ Mệnh Bàn |
| Phúc Khí | `#hq-phuc` | `✦ {state.phucKhi}` | chạm ★ → bảng nhỏ «Phúc Khí là gì» (`ui.hud.phuc_info`) |
| Chuỗi ngày | `#hq-streak` | `🔥 {currentStreak}` | — |
| Ngọc | `#hq-ngoc` | `💎 {wardrobe.ngoc}` | chạm ★ → Tàng Y Các |
| Trong phòng | `#hq-online` | `👥 n` / «Đang kết nối…» / «Ngoại tuyến» | chạm → UI-61 |
| ★ Cảnh giới | `#hq-realm` (mới) | `☯ {tên bậc theo đạo thống chính}` | chạm → UI-32 |
| Ngự kiếm | `#hq-fly` | ẩn khi chưa mở (`unlocked('fly')`) | bật / tắt bay |
| Âm thanh | `#hq-sound` | 🔈 / 🔇 | bật / tắt (đã có) |
| ★ Cài đặt | `#hq-settings` (mới) | ⚙ | → UI-75 (hiện cài đặt nằm sâu trong Sổ Mệnh) |

**Quy tắc mật độ:** ở 390 px, dòng chip tối đa 5 chip; khi có chip cảnh giới, chip chuỗi ngày gộp vào thẻ danh tính dạng «🔥3» sau cấp. Ở ≥ 600 px hiện đủ.

**Biến đổi động:**

| Sự kiện | Hiệu ứng HUD | Âm | Rung |
|---|---|---|---|
| Phúc Khí tăng | số đếm lên trong 400 ms, chip viền vàng 1 s | `SFX-UI-040` (đồng xu rơi đĩa sứ, nhẹ) | — |
| Lên cấp | cả dòng danh tính lóe vàng 1 lần | `SFX-PROG-001` | heavy (đã có) |
| Danh xưng mới | danh tính đổi chữ có hiệu ứng mực loang | `SFX-PROG-002` | heavy (đã có) |
| Mất mạng | chip 👥 → «Ngoại tuyến» màu mờ | — | — |

**Trợ năng:** HUD là `header` có `aria-label="Trạng thái"`; chip số liệu là `span` — ★ đổi sang `button` khi có hành vi chạm, có `aria-label` đầy đủ («Phúc Khí 120. Chạm để xem giải thích.»). Nút icon 40 → 44 px.

**Đo lường:** `ui_hud_tap_{who|phuc|ngoc|online|realm|settings|fly|sound}`.

---

## UI-09 · Dock đáy (mã ngắn: `dock`)

| | |
|---|---|
| Nguồn | `markup.js › nav.hq-dock` (5 nút); `main.js` gán `onclick` |

**Thứ tự hiện có (trái → phải):** 📋 «{n}/3 việc» · 💬 Giao lưu · ☰ Các gian · 👘 Y Các · 📜 Sổ Mệnh.

**Đề xuất M1 (★):** 📋 Nhiệm vụ (gộp «Việc hôm nay» vào Sổ Nhiệm Vụ UI-43) · 🗺 Bản đồ (thay «Các gian», danh sách gian thành thẻ trong bản đồ) · 💬 Giao lưu · 👘 Y Các · 📜 Sổ Mệnh. Lý do: thế giới mở rộng ±2.000 m, danh sách phẳng không còn đủ. «Sổ Mệnh» giữ **phải cùng** (vùng ngón cái phải, mở nhiều nhất theo thiết kế §12).

**Chấm thông báo:** `.hq-dbtn.dot` (chấm đỏ 9 px) — hiện dùng cho Y Các khi chưa điểm danh. ★ Quy định: tối đa **một** chấm trên dock cùng lúc, ưu tiên: Nhiệm vụ mới > Sổ Mệnh (Mệnh Đồ mở nút mới) > Y Các (điểm danh). Chấm Y Các **không** hiện liên tục quá 3 ngày liền nếu người chơi không mở (tránh giục mua — P6).

**Trợ năng:** `nav aria-label="Công cụ"` (đã có); mỗi nút có `aria-label` đầy đủ (đã có). Nút đang mở bảng tương ứng có `aria-current="true"`.

**Đo lường:** `ui_dock_tap {btn}` (gộp, không phát `view`).

---

## UI-10 · Nút hành động ngữ cảnh (mã ngắn: `act`)

| | |
|---|---|
| Mục đích | Một chạm làm việc ở chỗ đang đứng (ngồi bàn thầy, vào điện, giải án) |
| Nguồn | `markup.js › #hq-prompt`; `main.js › updatePrompt(near)`, `ICON` |

**Hai dạng:**

| Thiết bị | Dạng | Vị trí | Nội dung |
|---|---|---|---|
| máy tính | thẻ viên thuốc | giữa đáy cảnh, cách 14 px | `[icon] [E] verb` |
| cảm ứng | nút tròn 92 px | phải 18 px, đáy 24 px | icon 26 px trên, verb 11,5 px dưới (tối đa 2 dòng) |

**Luật hiện:** gần trạm (`nearestStation`) và **không** ngồi, **không** bay, **không** có bảng mở. Đổi trạm → rung light (đã có). ★ Thêm: khi đứng gần NPC dẫn đạo, verb là «Thưa chuyện với {tên}»; gần người chơi khác trong 2 m: nút phụ nhỏ 56 px phía trên «Chào».

**Bảng verb ví dụ** (từ `world.js › NAMES` + `ALL_STATIONS`):

| Trạm | Icon | Verb |
|---|---|---|
| `thay` | 📜 | Ngồi trước bàn thầy |
| `tra` | 🍵 | Ngồi bồ đoàn uống trà |
| `compass` | 🧭 | Xem la bàn hướng nhà |
| `xam` | 🎋 | Xin một quẻ xăm |
| `huong` | 🕯 | Thắp một tuần nhang (iOS: Đốt một nén trầm) |
| `lich` | 📅 | Xem lịch hôm nay |
| `sen` | 🪷 | Thả đèn hoa đăng |
| `tangy` | 👘 | Xem trang phục, phụ kiện |
| `an0…2` | ❓ | Giải án cho {cách gọi khách} |
| `door_*` | ✦ | Vào {tên điện} |
| `vanbia` | 🪨 | Đọc bia quỹ tích đời |
| `van0…8` | ⛩ | Bước vào thập kỷ này |
| `thaitue` | 🪔 | Xem Thái Tuế năm nay |

**Trợ năng:** `button` thật, focus được; trên máy tính phím `E` luôn mở trạm gần nhất bất kể focus (đã có); `Space` / `Enter` chỉ khi focus ở cảnh (đã có — tránh bấm nhầm nút HUD).

**Âm:** hiện nút → `SFX-UI-002` (gõ mõ rất nhẹ, −18 dB, chỉ khi trạm đổi); bấm → `SFX-UI-001`.

---

## UI-11 · Cần điều khiển ảo và cụm độ cao (mã ngắn: `stick`)

| | |
|---|---|
| Nguồn | `markup.js › #hq-stick`, `#hq-altpad`; `main.js` (bán kính 46 px, vùng chết 0,18, nhân 1,15) |

**Thông số hiện có:** đế 120 px trái 18 px đáy 18 px, núm 54 px vàng; độ lớn `min(1, |v| × 1,15)` sau vùng chết 0,18; hướng xoay theo `renderer.yaw` (lên = đi xa camera).

**★ Bổ sung:**

| Hạng mục | Thông số | Lý do |
|---|---|---|
| Cần nổi (floating) | chạm bất kỳ đâu ở 40% trái dưới cảnh → đế hiện tại chỗ chạm | tay nhỏ, máy to |
| Chế độ một tay (UI-76) | đế và nút hành động đổi sang **cùng một bên** (trái hoặc phải theo cài đặt), dock dồn về bên đó | trợ năng |
| Độ trong suốt khi không chạm | 55% → 30% sau 3 s không dùng | ít che cảnh |
| Chạy | đẩy núm ≥ 95% bán kính và giữ 0,6 s → tốc độ ×1,4, đế viền vàng sáng | hiện chỉ có một tốc độ `SPEED 3,5 ô/s` |

**Cụm độ cao:** ▲ / ▼ 58 px, phải 14 px, đáy 210 px — chỉ khi `player.flying`. Tầm 3–420 m, 26 m/s (đã có). ★ Thêm thước độ cao mảnh bên trái cụm: «126 m».

**Trợ năng:** `aria-hidden` (đã có) vì có đường thay thế (chạm-để-đi, phím). Cụm độ cao có `aria-label` (đã có).

---

## UI-12 · Nhãn thế giới, khung tên, bong bóng (mã ngắn: `label`)

| | |
|---|---|
| Nguồn | `render3d.js` (vòng nhãn: hiện khi `proj.z < 1`, trong ±1,15 khung, < 220 m; mờ theo khoảng cách `max(0,35, min(0,9, 1,4 − d/30))`); CSS `.hq-label`, `.near`, `.hq-name`, `.gold`, `.hq-frame-*`, `.hq-bubble`, `.master` |

**Ba loại nhãn:**

| Loại | Lớp CSS | Neo | Hiện khi | Kiểu |
|---|---|---|---|---|
| Nhãn gian | `.hq-label` | `LABEL_ANCHOR` / đất + 3,4 m | < 220 m, trong khung | viên thuốc tối 72%, viền vàng 45%; gần (`.near`) → nền son chữ trắng |
| Tên người chơi | `.hq-label.hq-name` | đầu + 2,45 m (ngồi 1,75) | luôn (bản thân); người khác < 24 m | nhỏ 12 px; ≥ 500 Phúc Khí → `.gold`; khung tên Tàng Y Các `.hq-frame-*` |
| Bong bóng | `.hq-bubble` | trên tên 22 px | đến hạn `until` (3,8 s người chơi; 6 s thầy; 60 s khi thầy «đang luận») | thầy: nền kem `#fff3d6`, viền son, rộng ≤ 240 px |

**★ Luật chống rối (mới, cho thánh địa đông nhãn):**

1. Tối đa **8** nhãn gian cùng lúc; ưu tiên: đang gần > có nhiệm vụ > gần camera.
2. Nhãn chồng nhau (giao hộp > 30%): nhãn xa hơn ẩn.
3. Khi bảng mở (không `peek`): ẩn mọi nhãn trừ tên bản thân.
4. Trong điện thờ: nhãn tượng thần chữ Hán dọc (★ `writing-mode: vertical-rl`), Hán Việt nhỏ bên cạnh.
5. Cỡ chữ nhãn theo cài đặt cỡ chữ (UI-76), trần 18 px.

**Bong bóng NPC (★):** cùng kiểu `.master`, viền màu đạo thống của NPC (bảng màu phần 07 §2.4). Câu bong bóng lấy từ `BARK-*` (tài liệu 06).

**Trợ năng:** nhãn là trang trí (`pointer-events: none`); thông tin thật có ở UI-10 và danh sách gian. Bong bóng của người khác đọc được qua lịch sử Giao lưu (★ UI-61 thêm mục «Vừa nói»).

---

## UI-13 · Toast và băng thông báo (mã ngắn: `toast`)

| | |
|---|---|
| Nguồn | `main.js › toast(text)` — tối đa 2 cái, 2,7 s hiện + 0,5 s mờ; `.hq-toasts aria-live="polite"`; dời lên đầu khi bảng mở |

**Phân loại (★ chuẩn hóa thành 4 mức):**

| Mức | Dùng cho | Thời gian | Kiểu | Âm | Rung |
|---|---|---|---|---|---|
| T1 tin | lưu, ẩn người, đã gửi báo cáo | 2,7 s | viên thuốc viền vàng (hiện có) | — | — |
| T2 thưởng | +Phúc Khí, +Ngọc, điểm danh | 2,7 s | viên thuốc + icon tiền | `SFX-UI-040` | — |
| T3 mốc | lên cấp, danh xưng, thành tựu 🏮, xong 3 việc | 4 s | thẻ rộng hơn, nền vân giấy, chữ serif | `SFX-PROG-001…004` | heavy / medium (đã có) |
| T4 nghi thức | đột phá cảnh giới, mốc Liễu Phàm 300/600/1.000 công | không dùng toast — mở UI-33 | — | — | — |

**Luật hàng đợi:** T3 không bị T1 đẩy ra — T1 đến khi đang có 2 cái thì thay cái T1 cũ nhất; nếu cả hai là T3 thì T1 chờ. Cutscene / UI-33 đang mở: giữ hàng đợi.

**Câu chữ chuẩn** (lấy nguyên từ `main.js`): «+{n} Phúc Khí · {lý do}», «✨ Cấp {n} · mở {gia trì} ({tên hành})», «Xong 3 việc hôm nay · +{n} · chuỗi {k} ngày», «🏮 Thành tựu: {tên}», «Danh xưng mới: {tên}», «🎁 Quà lên cấp · +{n} Ngọc», «👑 Chân Nhân · +{n} Ngọc hôm nay», «🗡️ Ngự kiếm · kéo cần để bay, ▲▼ đổi độ cao», «Hạ kiếm, đáp đất.».

**Trợ năng:** `aria-live="polite"` (đã có); T3 dùng `role="status"`. Cài đặt «Thời gian thông báo» (UI-76): 1× / 1,5× / 2×.

---

## UI-14 · Màn chuyển cảnh (mã ngắn: `travel`)

| | |
|---|---|
| Nguồn | `main.js › enterRoom(st)` (0,5 s dời, 1,0 s mở lại, 1,6 s gỡ), `teleportTo(st)` (0,65 s / 1,3 s / 1,9 s); CSS `.hq-travel` (mờ 0,55 s) |

**Ba biến thể:**

| Biến thể | Tiêu đề | Phụ đề | Âm |
|---|---|---|---|
| vào điện | «⛩ Bước vào {tên điện}» | «Khói trầm thoang thoảng, nến lung linh…» | `SFX-DOOR-001` cửa gỗ nặng + `SFX-AMB-050` trong điện |
| ra điện | «⛩ Ra khỏi {tên điện}» | «Trở lại ngoài trời» | `SFX-DOOR-002` |
| đi trạm | «🐎 Xe ngựa tới {sảnh}» / «⛵ Đò sang {sảnh}» (`cungthong`) | tên vùng | `SFX-TRAV-001` vó ngựa / `SFX-TRAV-002` mái chèo |

**★ Bổ sung M2:** «🕊 Cưỡi hạc tới {thánh địa}» (trạm hạc, `SFX-TRAV-003` cánh vỗ); câu phụ đề lấy từ một dòng mô tả cảnh quan của vùng (tài liệu 07). Màn chuyển dài hơn 1,9 s chỉ khi phải tải chunk mới: hiện thêm thanh mực mảnh dưới cùng.

**Giảm chuyển động:** đi trạm khi `reduced` thì **bỏ hẳn** màn (đã có: `if (st.world && !reduced)`). Vào điện vẫn có màn nhưng không mờ dần — bật / tắt tức thì.

---

## UI-15 · Khung bảng chung — bottom sheet / hộp giữa / ngăn phải (mã ngắn: `sheet`)

| | |
|---|---|
| Nguồn | `markup.js › #hq-panel` (`role="dialog" aria-modal="true"`); `main.js › panel.open/close`, `api.peek(on)`; CSS ba nấc |

**Nấc:**

| Nấc | Điện thoại | Máy tính | Khi dùng |
|---|---|---|---|
| peek | thẻ nổi đáy, ≤ 46dvh, nền mờ | thẻ nổi đáy ≤ 440 px | ngồi trà, nhang cháy, tĩnh tọa — cần thấy cảnh |
| half (mặc định) | 62dvh | hộp giữa 620 px | đa số bảng |
| full | 92dvh (chạm thanh kéo) | — | bảng dài |
| ★ side | — | ngăn phải 520 px, cao đủ, cảnh co sang trái | Sổ Mệnh, Mệnh Đồ, bản đồ, Sổ Nhiệm Vụ trên ≥ 1280 px |

**Đầu bảng:** `h2` tiêu đề vàng 20 px + nút ✕. ★ Thêm nút «‹ {bảng cha}» bên trái tiêu đề khi mở từ bảng khác (ngăn xếp tối đa 3 tầng).

**Luật focus (đã có):** mở → focus phần tử nhập đầu tiên trên máy tính, nút ✕ trên cảm ứng; đóng → focus về canvas. ★ Thêm bẫy focus (Tab không thoát khỏi bảng).

**Luật cử chỉ (★):** vuốt thanh kéo xuống > 80 px → đóng; vuốt lên → full. Hiện chỉ có chạm để đổi nấc.

**Dọn dẹp:** `api.onClose(body, fn)` gắn hàm dọn (huỷ luồng AI, dừng hẹn giờ nhang) — mọi màn mới **bắt buộc** dùng.

**Âm:** mở `SFX-UI-010` (giở giấy dó), đóng `SFX-UI-011` (gấp giấy). Không âm khi đổi nấc.

---

## UI-16 · Bộ theo dõi nhiệm vụ trên HUD (mã ngắn: `tracker`) ★ mới

| | |
|---|---|
| Mục đích | Nhắc việc đang theo (tối đa 3 dòng) mà không mở bảng |
| Nguồn | (chưa có — cần làm); dữ liệu từ máy nhiệm vụ (tài liệu 13) |
| Lớp | z 2, góc trên trái cảnh |

```
┌───────────────────────┐
│◆ Ba việc thiện đầu    │  nhiệm vụ chính (MQ) — hình thoi đặc son
│  tiên            1/3  │
│◇ Thắp đèn Thái Tuế    │  việc ngày (DQ) — hình thoi rỗng
│○ Gặp Vân Cốc · 180 m ↗│  việc có điểm đến — khoảng cách + mũi tên
└───────────────────────┘
```

**Luật:** rộng ≤ 46% màn dọc, ≤ 320 px ngang; chữ 12,5 px; nền tối 55%. Thu gọn thành một chip «◆ 3» khi đang đi (di chuyển > 2 s) trên màn dọc, mở lại khi dừng. Chạm dòng → UI-44 chi tiết. Chạm giữ → bỏ theo dõi.

**Ký hiệu loại** (dùng chung bản đồ và Sổ Nhiệm Vụ): ◆ chính `MQ`, ◈ nhánh mệnh cách `BR`, ◇ ngày `DQ`, ✧ phụ `SQ`, ☯ đạo thống `CQ`, ✺ lễ tiết `EV`, ☾ Tà Lộ `TL` (màu tím trầm, chỉ khi đã bật).

**Âm:** nhiệm vụ cập nhật → `SFX-QUEST-002`; xong → `SFX-QUEST-003`.

**Trợ năng:** `aside aria-label="Nhiệm vụ đang theo"`; cập nhật đọc qua `aria-live="polite"`. Có thể tắt hẳn trong UI-76.

**Đo lường:** `ui_tracker_tap {kind}`; `ui_tracker_untrack`.

---

## UI-17 · La bàn hướng và chỉ dẫn (mã ngắn: `compassbar`) ★ mới

| | |
|---|---|
| Mục đích | Biết hướng (Bắc–Nam là trục cổ pháp: phong thủy, Thái Tuế phương) và hướng tới mục tiêu |
| Nguồn | (chưa có); hướng camera `renderer.yaw` |

**Dạng:** dải ngang mảnh trên cùng cảnh (máy tính) hoặc đĩa la bàn 56 px góc phải trên (điện thoại).

```
 Điện thoại (đĩa)            Máy tính (dải)
     北                       ·  Tây Bắc  ·  BẮC  ·  Đông Bắc  ·  ◆  ·  Đông
  西  ●  東                                           ▲ mục tiêu
     南
```

**Nội dung:** bốn hướng chữ Hán + chữ cái Việt (B / N / Đ / T) ở cỡ chữ ≥ 130%. Mục tiêu nhiệm vụ đang theo: thoi vàng trên vành. Phương Thái Tuế năm nay (web): vạch son mảnh kèm chữ «Thái Tuế» khi đứng trong Huyền Thành.

**Hành vi:** chạm đĩa → quay camera về hướng Bắc (yaw 0) trong 0,6 s (giảm chuyển động: tức thì). Giữ đĩa → mở bản đồ UI-45.

---

## UI-18 · Tạm dừng và menu hệ thống (mã ngắn: `pause`)

| | |
|---|---|
| Mục đích | Một chỗ cho: tiếp tục, cài đặt, trợ giúp, thoát; dùng khi `Esc` mà không có bảng nào mở (★ hiện `Esc` chỉ đóng bảng) |
| Nguồn | `main.js › pause()/resume()` (vỏ iOS gọi); màn hình (chưa có — cần làm) |

```
┌────────────────────────────────┐
│           Tạm nghỉ             │
│  [ Tiếp tục ]                  │
│  [ Cài đặt ]          → UI-75  │
│  [ Phím tắt & điều khiển ]     │
│  [ Ảnh chụp ]         → UI-98  │
│  [ Góp ý cho quán ]            │
│  [ Rời quán ]         (onExit) │
│  Giờ thật: 21:40 · giờ Hợi     │
│  Đã ngồi trong quán 42 phút ★  │  nhắc nghỉ mềm
└────────────────────────────────┘
```

**Nhắc nghỉ mềm (★, P3):** sau 90 phút liên tục, dòng «Đã ngồi trong quán 90 phút. Đứng dậy vươn vai, uống ngụm nước nhé.» hiện trong menu và một toast T1 (không chặn chơi). Tắt được trong UI-76.

**Hành vi pause thật:** vòng lặp dừng (`cancelAnimationFrame`), âm tắt, MMO ngắt (`net.stop()`), khóa dọc bỏ. Mở menu tạm nghỉ **trên web** không ngắt MMO (người chơi chỉ tạm đọc menu) — chỉ ngắt khi tab ẩn (`visibilitychange`, đã có).

**Phím tắt (bảng hiện trong menu, nguồn `main.js › onKeyDown` + `.hq-help`):**

| Phím | Việc |
|---|---|
| W A S D / mũi tên | đi |
| Click / chạm cảnh | đi tới điểm / gian |
| Kéo chuột / một ngón | xoay camera, ngước nhìn |
| Lăn chuột / chụm hai ngón | gần / xa (6–48 m) |
| Q / R | xoay 45° trái / phải |
| E | vào gian gần nhất |
| Space / Enter | vào gian (khi focus ở cảnh); bay lên (khi ngự kiếm) |
| C | hạ độ cao (khi ngự kiếm) |
| F | bật / tắt ngự kiếm |
| Esc | đóng bảng; ★ không có bảng → menu tạm nghỉ |
| ★ M | bản đồ |
| ★ J | Sổ Nhiệm Vụ |
| ★ B | Sổ Mệnh |
| ★ P | chế độ chụp ảnh |

**Đo lường:** `ui_pause_view {from: esc|shell}`; `ui_pause_tap {item}`; `ui_pause_breakreminder`.
