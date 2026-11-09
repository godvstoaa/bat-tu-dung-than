# 12 · Trình bày — Phần 04: Thế giới, NPC, nhiệm vụ, bản đồ (UI-40 → UI-57)

> Các màn người chơi dùng khi đi lại, nói chuyện, nhận việc, và ngồi vào các bàn nghề đã có. Hội thoại AI dùng nguyên bộ `master-ui.js` (stream + Neo + gợi ý câu hỏi) và mở rộng theo kiến trúc persona §6.1 bản tổng.

---

## UI-40 · Hội thoại NPC kịch bản (mã ngắn: `talk`)

| | |
|---|---|
| Mục đích | Thoại có kịch bản, lựa chọn ①②③, cắt cảnh nhẹ — xương sống cốt truyện (tài liệu 03 viết thoại; định dạng `[CẢNH …]` canon §1) |
| Lối vào | nút hành động «Thưa chuyện với {NPC}»; NPC tự đến (Vân Cốc tìm người chơi lá số thấp); máy nhiệm vụ kích hoạt |
| Nguồn | (chưa có — cần làm) |
| Lớp | z 40; camera hội thoại (phần 08 §3.4) |

### 40.1 Khung dọc

```
┌──────────────────────────────────────┐
│ (cảnh 3D: camera qua vai, NPC 1/3    │
│  trên, nhân vật người chơi mờ góc)   │
│                                      │
│                                      │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ ◐ VÂN CỐC THIỀN SƯ        ⏩ ⋯   │ │  tên + nút tua / menu thoại
│ │ Con ngồi đi. Thầy Tử Bình chưa   │ │  chữ hiện từng cụm (28 ký tự/s)
│ │ nhận con phải không?▍            │ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │
│ │ ① «Lá số con xấu.»               │ │  lựa chọn
│ ├──────────────────────────────────┤ │
│ │ ② «Con không biết vì sao.»       │ │
│ ├──────────────────────────────────┤ │
│ │ ③ (im lặng)                      │ │
│ └──────────────────────────────────┘ │
│  ⏱ không giới hạn thời gian          │
└──────────────────────────────────────┘
```

**Khung ngang:** hộp thoại rộng 760 px giữa đáy; lựa chọn xếp dọc bên phải hộp thoại (tối đa 4), cảnh chiếm phần trên.

### 40.2 Thành phần

| Phần tử | Ghi chú |
|---|---|
| Huy hiệu người nói | vòng tròn 36 px màu đạo thống (phần 07 §2.4) + chữ Hán đầu tên (雲 cho Vân Cốc) |
| Tên | chữ hoa nhỏ (small-caps), 13 px, màu vàng |
| Lời thoại | serif 17 px (cỡ chữ theo UI-76), dòng 1,6 |
| Chỉ dẫn diễn xuất | `(rót trà)` — nghiêng, màu `--hq-dim`, không đọc thành tiếng khi có VO |
| Lựa chọn | `.hq-choice.wide` (đã có), số ①②③④ khớp phím 1–4 |
| Nhãn lựa chọn đặc biệt | 🗡 Khôi Cương (nhánh mở nhờ đặc tính `kuiGang` — canon §4.6), ✦ Tính Khí, ⚠ «lời này có thể ghi vào cột 過» (khi lựa chọn dính `YEGUO`) |
| Nút ⏩ | hiện hết câu đang chạy; bấm lần hai = câu kế |
| Menu ⋯ | Lịch sử thoại (UI-40b) · Bật / tắt tự chạy · Bỏ qua cảnh (chỉ cảnh đã xem) |

### 40.3 Luật

1. **Không giới hạn thời gian chọn** (P3). Không có lựa chọn biến mất.
2. Lựa chọn dính nghiệp (`getYeguoForChart` nhắc trước — canon §5.4): NPC dẫn đạo nói một câu nhắc **trước khi** hiện lựa chọn; lựa chọn có nhãn ⚠. Chọn rồi vẫn đổi ý được trong 3 giây («Rút lời» — chỉ với lựa chọn ⚠).
3. Lựa chọn khóa theo chỉ số hiện, có ghi lý do: «🔒 cần Tuệ Kiếm ≥ 40» — không ẩn đi (người chơi biết lá số mình mở / đóng gì, đúng T1).
4. Thoại kịch bản không bao giờ gọi AI. Sau thoại kịch bản, nếu NPC có persona và web bật AI → nút «🎙 Hỏi thêm» mở UI-41.
5. Tự chạy (auto-advance): 2,5 s + 60 ms × số ký tự sau khi câu hiện hết. Mặc định **tắt**.

### 40.4 Lịch sử thoại (UI-40b)

Danh sách cuộn mọi câu trong cảnh hiện tại và 3 cảnh trước, lựa chọn đã chọn in đậm. Truy cập: ⋯ › Lịch sử, hoặc vuốt hộp thoại xuống (điện thoại), phím `L` (máy tính).

### 40.5 Trạng thái

| Ô | Hành vi |
|---|---|
| S-LOAD | tải gói thoại vùng (JSON) lần đầu vào vùng: «…» trong hộp thoại ≤ 400 ms |
| S-EMPTY | NPC không còn thoại mới: câu `BARK-*` ngẫu nhiên + nút «Hỏi thêm» (web) / «Tạm biệt» |
| S-ERR | gói thoại lỗi: NPC nói câu dự phòng «Hôm nay thầy mệt, con quay lại sau nhé.»; ghi lỗi; nhiệm vụ không bị kẹt (máy nhiệm vụ cho bước qua) |
| S-OFF | không ảnh hưởng (thoại cục bộ) |
| S-IOS | thoại có nhánh iOS riêng ở chỗ nói về vận hạn (tài liệu 03 đánh dấu `[iOS]`) |
| S-AIOFF | ẩn nút «Hỏi thêm» |
| S-LOCK | — |
| S-RM | chữ hiện cả câu ngay, không gõ dần |

### 40.6 Câu chữ hệ thống

| Khóa | Tiếng Việt |
|---|---|
| `ui.talk.skip` | Hiện hết câu |
| `ui.talk.next` | Tiếp |
| `ui.talk.history` | Lịch sử thoại |
| `ui.talk.auto` | Tự chạy |
| `ui.talk.skip_scene` | Bỏ qua cảnh đã xem |
| `ui.talk.take_back` | Rút lời |
| `ui.talk.locked` | cần {chỉ số} ≥ {n} |
| `ui.talk.karma_hint` | Lời này có thể ghi vào cột 過 |
| `ui.talk.ask_more` | 🎙 Hỏi thêm |
| `ui.talk.bye` | Tạm biệt |

### 40.7 Tương tác

| Hành động | Phím | Âm | Rung |
|---|---|---|---|
| tiếp câu | Space / Enter / chạm hộp | `SFX-UI-005` (lật giấy mỏng, −20 dB) | — |
| chọn lựa chọn | 1–4 / chạm | `SFX-UI-006` (gõ bàn gỗ) | light |
| lựa chọn ⚠ | — | thêm `SFX-KARMA-001` (chuông nhỏ trầm) | medium |
| chữ gõ dần | — | `SFX-UI-007` tiếng bút rất nhỏ, mỗi 4 ký tự (tắt được: «Âm gõ chữ» UI-77) | — |

### 40.8 Trợ năng

`role="dialog"`, tên người nói trong `aria-labelledby`, lời thoại `aria-live="polite"` (đọc cả câu khi hiện xong, không đọc từng ký tự). Lựa chọn là `button` trong `role="group"`. Phụ đề VO luôn bật mặc định (hộp thoại chính là phụ đề).

### 40.9 Đo lường

`ui_talk_view {npc, scene}`; `ui_talk_choice {scene, idx, karma: bool, locked_seen: n}`; `ui_talk_skip {scene}`; `ui_talk_history_open`.

### 40.10 Nghiệm thu

Kịch bản §6.3 bản tổng (Vân Cốc gặp người lá số thấp) chạy trọn: 3 lựa chọn, câu với ① đọc đúng `synthesis.factors` của lá số mẫu, kết thúc mở Mệnh Đồ + trao Sổ Công Quá + mở nút «Hỏi thêm».

---

## UI-41 · Hội thoại AI có persona — luồng chữ và huy hiệu Neo (mã ngắn: `ai`)

| | |
|---|---|
| Mục đích | Hỏi tự do NPC dẫn đạo / Thầy Tử Bình; trả lời dạng luồng (stream); tự chấm độ khớp dữ liệu lá số (Neo) |
| Lối vào | «🎙 Hỏi thêm» sau UI-40; «Hỏi Thầy thêm» ở Vận Mệnh Các / Thái Tuế (đã có: `vanmenh-ui.js › askBtn`); giải án (đã có) |
| Nguồn | `master-ui.js › masterChatBody(api, { R, who, first, starters })`: `askAI(q, R, cfg, { history, signal, onStatus, onToken })`, `checkNeo(text, buildChartBrief(R))`, `suggestFollowups`; persona / gameContext / toolsAllow (chưa có — cần làm trong `ai.js`, §6.1) |
| Chỉ | web (`FEATURES.ai`) |

### 41.1 Khung dọc

```
┌──────────────────────────────────────┐
│ 🎙 Vân Cốc thiền sư · Am Vân Cốc  ✕  │
│ Còn 7/10 lượt hôm nay  ⓘ             │  hạn mức (canon §6.5)
├──────────────────────────────────────┤
│                 ┌──────────────────┐ │
│                 │ Bạn              │ │  .hq-msg.q (lệch phải 18%)
│                 │ Con nên bắt đầu  │ │
│                 │ tầng nào trước?  │ │
│                 └──────────────────┘ │
│ ┌──────────────────────────────────┐ │
│ │ Vân Cốc                          │ │  .hq-msg.a
│ │ Lá số con Dụng Thủy mà Thủy chỉ  │ │
│ │ có hai phần trăm. Tầng dưới cùng │ │
│ │ ai cũng đi được: tích âm đức. Con│ │
│ │ có thể…▍                         │ │  con trỏ ▍ nhấp nháy (đã có)
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │
│ │ 🎯 Neo 94% · 17 mốc dữ liệu ·    │ │  .hq-neo (đã có)
│ │    khớp lá số                    │ │
│ └──────────────────────────────────┘ │
│ ( Vì sao Thủy lại là Dụng? )         │  3 gợi ý .hq-choice (đã có)
│ ( Con làm việc thiện gì trước? )     │
│ ( Tầng Tên nghĩa là đổi tên? )       │
│ ┌────────────────────────────┐┌────┐ │
│ │ Hỏi Vân Cốc thêm…          ││Hỏi │ │  ô nhập 300 ký tự (đã có)
│ └────────────────────────────┘└────┘ │
│ Thầy luận bằng AI trên lá số đã tính │  .hq-note (đã có)
│ sẵn; «Neo» = tỉ lệ câu trả lời khớp  │
│ dữ liệu lá số. Để tham khảo và học,  │
│ không thay quyết định của bạn.       │
└──────────────────────────────────────┘
```

### 41.2 Các giai đoạn của một câu trả lời

| Giai đoạn | Hiện | Nguồn | Âm |
|---|---|---|---|
| gửi | bong bóng câu hỏi; ô nhập khóa | `ask()` | `SFX-UI-006` |
| chờ | «Thầy đang xem lá số…» (đổi theo persona: «Vân Cốc đang pha trà…», «Bần đạo đang tra sổ…») | dòng `.hq-sub` | — |
| trạng thái công cụ | «{trạng thái} …» (vd «Đang tra Thái Tuế năm 2026 …») | `onStatus(s)` | `SFX-UI-008` tiếng giở sách rất nhỏ |
| luồng chữ | markdown tối giản hiện dần, con trỏ ▍ | `onToken(_d, full)` → `md(clean(full))` (đã lọc `<think>`) | — (không âm theo token) |
| xong | bỏ con trỏ; bong bóng NPC trong cảnh hiện câu đầu ≤ 60 ký tự | `api.masterSay` | `SFX-UI-031` |
| Neo | huy hiệu | `checkNeo` | — |
| gợi ý | 3 nút câu hỏi tiếp | `suggestFollowups` | — |

### 41.3 Huy hiệu Neo — quy tắc hiển thị

| Điều kiện | Huy hiệu | Lớp | Câu |
|---|---|---|---|
| `source === 'ai'`, không cờ đỏ, không mâu thuẫn | 🎯 | `.hq-neo` | «Neo {score}% · {n} mốc dữ liệu · khớp lá số» |
| có mâu thuẫn, không cờ đỏ | 🎯 | `.hq-neo` | «Neo {score}% · {n} mốc dữ liệu · {k} mâu thuẫn» + ★ chạm để xem từng mâu thuẫn |
| `hasRedFlag` | ⚠ | `.hq-neo.bad` (`#e0533d`) | «Neo {score}% · … · {k} mâu thuẫn» + ★ câu «Đoạn này có chỗ lệch với lá số. Đối chiếu Mệnh Bàn trước khi tin.» |
| trả lời cục bộ (không AI) | (không icon) | `.hq-neo` | «Luận cục bộ (chưa kết nối máy chủ AI)» (đã có) |
| ★ Neo < 70 (dù không cờ đỏ) | ⚠ | `.hq-neo.bad` | như cờ đỏ — ngưỡng 70 lấy từ mục tiêu chỉ số thành công (trung bình ≥ 90) |

**★ Bảng mâu thuẫn** (chạm huy hiệu): mỗi dòng «AI nói: … · Lá số ghi: …» lấy từ `n.conflicts[]`, kèm nút «Mở Mệnh Bàn ở chỗ này».

### 41.4 Persona trong giao diện (★ khi `ai.js` có `persona`)

| Thành phần | Theo persona |
|---|---|
| Tiêu đề bảng | «🎙 {tên NPC} · {nơi}» |
| Nhãn người trả lời trong bong bóng | tên NPC (hiện cứng là «Thầy») |
| Câu chờ | mỗi persona một câu (tài liệu 06 `PERSONA-<npc>.waiting`) |
| Placeholder ô nhập | «Hỏi {tên gọi NPC} thêm…» (hiện: «Hỏi thầy thêm về lá số của {who}…») |
| Màu viền bong bóng trả lời | màu đạo thống (phần 07 §2.4) |
| Câu mở (khi `first` rỗng) | `starters` = 3 câu mẫu của persona |

### 41.5 Trạng thái

| Ô | Hành vi |
|---|---|
| S-LOAD | lần đầu tải `ai.js` (nặng): «Thầy đang chuẩn bị…» ≤ 2 s; lỗi tải → S-ERR |
| S-EMPTY | không có `first`: hiện 3 nút `starters` (đã có) |
| S-ERR | lỗi không phải hủy: «Thầy đang bận, lát hỏi lại nhé.» (đã có) + nút «Hỏi lại» giữ nguyên câu |
| S-OFF | ★ chuyển `composeAnswer` (trả lời cục bộ) — huy hiệu «Luận cục bộ»; không báo lỗi mạng |
| S-IOS | không có màn này; nút «Hỏi thêm» ẩn ở mọi nơi |
| S-AIOFF | hết lượt: ô nhập thay bằng «Hôm nay đã hỏi đủ 10 câu. Thầy vẫn trả lời các câu có sẵn bên dưới.» + 3 câu cục bộ; máy chủ tắt AI (`isAiEnabled` false): như S-OFF |
| S-LOCK | — |
| S-RM | không con trỏ nhấp nháy (CSS tắt animation toàn cục) |

### 41.6 Quy tắc an toàn trên màn (khớp §6.4 bản tổng)

1. **Rời vai khi khủng hoảng** → không hiện tiếp trong bong bóng NPC mà mở UI-42.
2. Câu trả lời nhắc tên nhiệm vụ / vật phẩm không có trong `gameContext` → bị lọc trước khi hiện (tài liệu 06 / 13); màn không cần làm gì thêm, nhưng nếu toàn bộ câu bị lọc thì hiện «Thầy chưa rõ điều đó trong quán. Con hỏi cách khác nhé.»
3. Không bao giờ hiện liên kết Tàng Y Các / VIP trong câu trả lời AI (lọc ở máy chủ, kiểm thêm ở client: link nội bộ chỉ cho phép tới Mệnh Bàn, Mệnh Đồ, bản đồ).
4. Huỷ luồng khi đóng bảng (đã có: `MutationObserver` → `abort()`).

### 41.7 Trợ năng

Vùng log là `role="log"` `aria-live="polite"`; khi đang luồng **không** đọc từng token — chỉ đọc khi xong (đặt `aria-busy="true"` trong lúc stream). Huy hiệu Neo có nhãn đầy đủ. Ô nhập có nhãn ẩn «Câu hỏi cho {NPC}».

### 41.8 Đo lường

`ui_ai_view {npc}`; `ui_ai_ask {npc, from: typed|suggest|starter}` (không gửi nội dung); `ui_ai_done {npc, ms_first_token, ms_total, neo_bucket, red: bool, local: bool}`; `ui_ai_conflicts_open`; `ui_ai_quota_hit`.

### 41.9 Nghiệm thu

Token đầu ≤ 2,5 s (p75, 4G); Neo hiện trong ≤ 300 ms sau khi xong; đóng bảng giữa chừng không để lại luồng chạy (kiểm bằng tab Network).

---

## UI-42 · Chuyển hướng hỗ trợ khi khủng hoảng (mã ngắn: `care`)

| | |
|---|---|
| Mục đích | Canon §6.4 quy tắc 3: người chơi nói về tự hại, bệnh nặng, khủng hoảng thật → NPC **rời vai**, đưa thông tin hỗ trợ thật |
| Lối vào | bộ phân loại an toàn của `ai.js` / `anti-manipulation-data` trả cờ; cũng từ các NPC Mao Sơn / Phong Đô khi mô tả triệu chứng thật (`amta-data › ETHICS`) |
| Lớp | z 40, thay hội thoại hiện tại |

```
┌──────────────────────────────────────┐
│ Tạm gác chuyện trong quán            │
├──────────────────────────────────────┤
│ Điều bạn vừa nói nghe rất nặng.      │
│ Bạn không phải mang một mình.        │
│                                      │
│ Nếu bạn đang gặp nguy hiểm, hãy gọi  │
│ ngay số cấp cứu nơi bạn ở.           │
│ [ Gọi 115 ]  (Việt Nam)              │
│ [ Đường dây hỗ trợ tâm lý ]          │  danh sách theo quốc gia (tài liệu 14)
│ [ Nhắn cho người thân ]              │
│                                      │
│ Quán vẫn ở đây khi bạn muốn quay lại.│
│ [ Quay lại quán ]                    │
└──────────────────────────────────────┘
```

**Luật:** nền trung tính (`--hq-card`), không nhân vật 3D, không nhạc (nhạc hạ còn −30 dB). Số điện thoại lấy theo vùng ngôn ngữ / quốc gia của thiết bị — danh sách và kiểm định do tài liệu 14 quản lý. Màn không tự đóng. Không ghi đo lường nội dung; chỉ `ui_care_view` (đếm) để biết tần suất.

---

## UI-43 · Sổ Nhiệm Vụ (mã ngắn: `quests`)

| | |
|---|---|
| Mục đích | Mọi việc đang làm / đã xong: chính, nhánh mệnh cách, đạo thống, phụ, ngày, lễ tiết, Tà Lộ |
| Lối vào | dock 📋 (★ thay «Việc hôm nay»); phím J; chạm UI-16 |
| Nguồn | (chưa có — cần làm) máy nhiệm vụ; «Việc hôm nay» hiện có (`S.tasks`, 3 việc, `S.REWARD.tasks = 5`) thành nhóm «Hôm nay» |

### 43.1 Khung dọc

```
┌──────────────────────────────────────┐
│ Sổ Nhiệm Vụ                      ✕   │
├──────────────────────────────────────┤
│ [Đang làm ●] [Hôm nay] [Đã xong]     │
│ ─ Cốt truyện ───────────────────────│
│ ◆ Hồi I · Bản Mệnh                   │
│   Ba việc thiện đầu tiên   1/3  ☑ theo│
│ ◈ Đắc Cứu · Đi hái vị thuốc «Thực»   │  BR-DC (MAU-A có cứu)
│   Tới Long Hổ Sơn            ☐ theo  │
│ ─ Đạo thống ────────────────────────│
│ ☯ Chính Nhất · Học kết phù  bước 2/5 │
│ ─ Vùng ─────────────────────────────│
│ ✧ Huyền Thành · Ông lão bán lồng chim│
│ ─ Lễ tiết ──────────────────────────│
│ ✺ Hạ Nguyên (15/10 âm) · còn 4 ngày  │
│ ─ Hôm nay (0/3) ────────────────────│
│ ◇ Thắp một tuần nhang                │  S.tasks (đã có)
│ ◇ Xem lịch hôm nay                   │
│ ◇ Ngồi bồ đoàn uống trà              │
│ Xong cả 3 → +5 Phúc Khí và nối chuỗi │
│ ngày (hiện 3 ngày). Việc làm mới lúc │
│ 0 giờ.                               │
└──────────────────────────────────────┘
```

### 43.2 Luật

1. Nhóm theo loại (ký hiệu UI-16). Trong nhóm sắp: đang theo > có điểm đến gần > mới nhận.
2. Theo dõi tối đa **3** (khớp UI-16). Chọn cái thứ 4 → hỏi bỏ cái nào.
3. Nhiệm vụ nhánh mệnh cách (`BR-TT/DC/NT/DK`) hiện **tên lớp** không hiện điểm («Đắc Cứu», không «41 điểm»).
4. Nhiệm vụ Tà Lộ (`TL-*`) ở nhóm riêng màu tím trầm, chỉ khi đã bật âm tà; luôn có dòng «Đường về: Bút Tháp / Phong Đô».
5. Nhiệm vụ lễ tiết hiện ngày âm + đếm ngày (không đồng hồ giây).

### 43.3 Trạng thái

| Ô | Hành vi |
|---|---|
| S-EMPTY (Đang làm) | «Chưa nhận việc nào. Ghé Bàn Thầy ở Chính Đường, thầy có việc cho bạn.» + Chỉ đường |
| S-EMPTY (Đã xong) | «Chưa xong việc nào. Việc đầu tiên thường chỉ mất vài phút.» |
| S-IOS | nhiệm vụ nhánh bói (xăm, Thái Tuế) không có trong dữ liệu iOS |
| S-OFF | nhiệm vụ sự kiện máy chủ (sửa đường, lễ chung) hiện «cần kết nối để cập nhật tiến độ chung» |

**Đo lường:** `ui_quests_view {tab, active_n}`; `ui_quests_track {kind}`; `ui_quests_untrack`.

---

## UI-44 · Chi tiết nhiệm vụ (mã ngắn: `quest`)

```
┌──────────────────────────────────────┐
│ ‹ Sổ Nhiệm Vụ                    ✕   │
├──────────────────────────────────────┤
│ ◈ Đi hái vị thuốc «Thực»             │
│ Nhánh Đắc Cứu · Hồi II               │
│ ┃ «Bệnh ở đâu thì thuốc ở đó. Thầy   │  câu của NPC giao
│ ┃ chỉ chỗ, con tự đi hái.» — Đan Đỉnh│
│ ┃ chân nhân                          │
│ Vì sao việc này dành cho bạn:        │  T1 — truy về engine
│ Lá số có bệnh «Tài đảng Sát, Sát vô  │
│ chế» và thuốc «Thực Thần chế Sát».   │  patternQuality.diseases/rescues
│ ─ Các bước ─────────────────────────│
│ ● Gặp Đan Đỉnh chân nhân ở Võ Đang   │
│ ◐ Học «Nét bút đầu tiên» ở Long Hổ   │
│   (Nghệ đạo — khuyết của bạn)        │
│ ◌ Viết một lá phù hư cấu đúng cấu    │
│   trúc năm phần                      │
│ ─ Thưởng ───────────────────────────│
│ Đạo Hạnh +40 (×1,19 Nghịch Thiên)    │
│ Công đức: không (việc học)           │
│ [ Theo dõi ]  [ Chỉ đường ]          │
└──────────────────────────────────────┘
```

**Luật:** mục «Vì sao việc này dành cho bạn» bắt buộc với mọi nhiệm vụ cá nhân hóa (nhánh mệnh cách, Mệnh Đồ, khuyết thập thần). Thưởng hiện cả hệ số Nghịch Thiên khi có. Không có thưởng tiền thật / Ngọc ở nhiệm vụ cốt truyện (Ngọc chỉ từ điểm danh, lên cấp, VIP — canon §7).

**Đo lường:** `ui_quest_view {kind}`; `ui_quest_guide`.

---

## UI-45 · Bản đồ Huyền Giới (mã ngắn: `map`)

| | |
|---|---|
| Mục đích | Nhìn toàn thế giới ±2.000 m: 8 vùng có sẵn + 12 thánh địa, đường đá, trạm đi nhanh, nhiệm vụ, người trong phòng |
| Lối vào | dock 🗺 (★ M1); phím M; giữ đĩa la bàn UI-17 |
| Nguồn | `terrain.js › REGIONS` (8 vùng có tọa độ, bán kính, loại địa hình), `SKY_ISLAND` (Thiên Bàn Đảo, cao 520 m), `RIVER` (sông Huyền Hà), `landmarks.js › roadPath`; tâm thánh địa theo canon §3 |

### 45.1 Phép chiếu và lớp

- Bản đồ vuông 4.000 × 4.000 m vẽ dạng **họa đồ thủy mặc** (giấy dó, mực, chấm son cho địa danh). Không ảnh vệ tinh 3D.
- Hướng: **Bắc ở trên** (bản đồ đi lại — khác Mệnh Bàn là Nam trên). Ghi rõ chữ 北 ở mép trên. Lý do: người chơi quen bản đồ hiện đại; đĩa la bàn UI-17 nhắc phương.
- Toạ độ thế giới → bản đồ: `x_map = (x + 2000) / 4000`, `y_map = (z + 2000) / 4000` (trục z dương hướng Nam theo hệ toạ độ hiện có — tài liệu 13 xác nhận).

| Lớp | Nội dung | Mặc định |
|---|---|---|
| Địa hình | núi (peak), cốc (valley), hồ (lake), cao nguyên (plateau), thành (city) theo `REGIONS.kind` | bật |
| Đường | đường đá toả từ cổng Nam Huyền Thành; sông Huyền Hà | bật |
| Địa danh | tên 20 vùng; công trình hạng A/B (tài liệu 07 `BLD-*`) khi phóng to | bật |
| Trạm | xe / đò / hạc (★), đã mở sáng, chưa mở mờ | bật |
| Nhiệm vụ | ký hiệu UI-16 | bật |
| Người | bạn bè / đồng môn trong phòng (chấm màu áo) | tắt |
| Sương | vùng chưa tới phủ sương mực | bật (không tắt được) |

### 45.2 Khung dọc

```
┌──────────────────────────────────────┐
│ Bản đồ Huyền Giới              ✕     │
├──────────────────────────────────────┤
│                 北                   │
│  ░░Tạng░░       Võ Đang     ░Chung░  │  sương: chưa tới
│  ░░░░░░░   ▲Tử Bình  ·Thư Lâu ░Nam░  │
│           Phong   ·Côn Lôn(đảo)  ▲Manh│
│  ░Phong░  ·Phong   ⌂ HUYỀN  ·Lịch   ·Long│
│  ░Đô ░░    Thủy    THÀNH    Đường   Hổ │
│            ~~~sông Huyền Hà~~~       │
│  ░Miêu░  ▲Trích   ·Yên Tử ·Bút  ◎Cùng│
│  ░Cương░  Thiên             Tháp Thông│
│                ·Văn Miếu   ░Mao Sơn░ │
│ ● bạn   ◆ nhiệm vụ   🐎 trạm         │
│ [ Lớp ▾ ]  [ Về chỗ tôi ]  [ − ][ + ]│
└──────────────────────────────────────┘
```

### 45.3 Tương tác

| Cử chỉ | Kết quả |
|---|---|
| kéo một ngón | trượt bản đồ |
| chụm hai ngón / lăn chuột | phóng 1× (toàn giới) → 4× (vùng) → 12× (sân) |
| chạm địa danh | thẻ nhỏ: tên + đạo thống + «Đã tới / Chưa tới» + [Chỉ đường] [Đi trạm] (nếu có trạm đã mở) |
| chạm giữ chỗ trống | đặt mốc tùy ý (1 mốc), hiện trên la bàn UI-17 |
| «Về chỗ tôi» | căn bạn vào giữa |

**Âm:** mở `SFX-UI-014` (trải cuộn giấy); phóng `SFX-UI-015` rất nhỏ; đặt mốc `SFX-UI-016` (đóng dấu son).

### 45.4 Trạng thái

| Ô | Hành vi |
|---|---|
| S-LOAD | ảnh nền bản đồ (≈ 400 KB webp) tải lười; trước khi xong vẽ lưới mực đơn giản |
| S-EMPTY | — |
| S-OFF | lớp «Người» tắt, ghi «cần kết nối» |
| S-IOS | Thái Tuế Điện, Vận Mệnh Các không có nhãn (đã tắt) |
| S-LOCK | thánh địa chưa mở theo cảnh giới: tên hiện, đường mờ, thẻ ghi «Mở ở cảnh giới {tên}» |
| S-RM | phóng / trượt không có quán tính |

### 45.5 Trợ năng

Bản đồ có **danh sách thay thế** (nút «Xem dạng danh sách» — giữ lại màn «Các gian» UI-48 làm dạng này). Địa danh đọc «Long Hổ Sơn, Chính Nhất, chưa tới, cách 1.500 mét về phía Đông».

**Đo lường:** `ui_map_view {zoom}`; `ui_map_tap {kind}`; `ui_map_pin`; `ui_map_list_mode`.

---

## UI-46 · Bản đồ nhỏ (mã ngắn: `minimap`) ★ mới

| | |
|---|---|
| Mục đích | Định hướng trong vùng mà không mở bản đồ lớn |
| Nơi | máy tính ≥ 1280 px: góc phải trên 180 × 180 px, thường trực; điện thoại: **không** thường trực (thay bằng đĩa la bàn UI-17), mở bằng chạm đĩa |

**Nội dung:** bán kính 120 m quanh người chơi (sân Sơn Môn: 40 m), xoay theo camera (tùy chọn khóa Bắc), chấm người chơi khác (màu áo `ROBE`), ký hiệu gian (icon `ICON` của `main.js`), nhiệm vụ đang theo. Trong điện: sơ đồ mặt bằng điện (vì điện là phòng ngoài bản đồ, `world.js › ROOMS` origin x ≈ 1.500–2.000) — chỉ vẽ trong khung điện.

**Hiệu năng:** vẽ canvas 2D 10 lần / giây (không mỗi khung), dùng ảnh nền vùng cắt sẵn.

---

## UI-47 · Trạm đi nhanh — xe, đò, hạc (mã ngắn: `station`)

| | |
|---|---|
| Mục đích | Đi nhanh giữa các vùng đã tới (canon §7.0: «mỗi thánh địa có một trạm xe / đò / hạc, mở sau khi tới tận nơi lần đầu») |
| Nguồn | hiện có: `teleportTo(st)` + màn `.hq-travel` cho 8 sảnh nghề (xe ngựa / đò `cungthong`); trạm thánh địa (chưa có — cần làm) |
| Lối vào | đứng ở trạm trong thế giới (nút hành động «Gọi xe / đò / hạc»); bản đồ › Đi trạm |

```
┌──────────────────────────────────────┐
│ Trạm Ngựa Cổng Nam · Huyền Thành  ✕  │
├──────────────────────────────────────┤
│ Đi tới:                              │
│ 🐎 Lịch Đường            820 m  Đông  │
│ 🐎 Phong Thủy Viên       820 m  Tây   │
│ ⛵ Cùng Thông Hồ (đò)    880 m  ĐN    │
│ 🕊 Long Hổ Sơn (hạc)   1.500 m  Đông  │
│ ░ Võ Đang Huyền Nhạc — chưa tới ░    │
│ Dịch Mã (驛馬): trạm rẻ hơn 20%      │  đặc tính canon §4.6 nếu có
│ Phí: ✦ 0 (trạm đã mở miễn phí)       │
└──────────────────────────────────────┘
```

**Luật:** trạm chưa tới thì không chọn được (mờ, ghi «chưa tới»). Đang ngồi / đang trong mini-game thì không đi được (đã có: `if (player.sitting) return`). Đang ngự kiếm thì hạ kiếm trước khi vào điện (đã có). Phí: tài liệu 11 quyết định; mặc định miễn phí cho trạm đã mở (không biến di chuyển thành điểm thu tiền).

**Âm:** chọn → `SFX-TRAV-001/002/003` theo loại, rồi UI-14.

**Đo lường:** `ui_station_view {at}`; `ui_station_go {to, kind}`.

---

## UI-48 · Các gian và sảnh nghề — danh sách (mã ngắn: `rooms`)

| | |
|---|---|
| Nguồn | `main.js` nút ☰ «Các gian»: 3 nhóm «Trong quán» (gian không `world`), «Sảnh nghề · đi trạm (mỗi sảnh 1 khách/ngày)», «Điện thờ»; mỗi dòng `{icon} {tên} — {verb}{ ✓}`, bấm → `teleportTo` |

**Giữ làm:** dạng danh sách của bản đồ (trợ năng UI-45) và lối nhanh trong Huyền Thành.

**★ Cải tiến:** thêm khoảng cách và trạng thái «đã làm hôm nay ✓» (đã có cho bàn sảnh nghề) cho cả gian trong quán; ô tìm kiếm khi > 20 dòng; nhóm thứ tư «Thánh địa» (chỉ cái đã tới).

**Trạng thái S-IOS:** danh sách lọc theo `FEATURES.stations` (đã có — xăm, sen, quẻ, Vận Mệnh Các, Thái Tuế không có).

---

## UI-49 · Việc hôm nay (mã ngắn: `daily`)

| | |
|---|---|
| Nguồn | `main.js` nút 📋: `S.tasks(state)` 3 việc, `✅ / ◻️`, câu «Xong cả 3 → +{REWARD.tasks} {point} và nối chuỗi ngày (hiện {k} ngày). Việc làm mới lúc 0 giờ.» |

**Từ M1:** trở thành nhóm «Hôm nay» trong UI-43. Thêm vào nhóm: đèn Thái Tuế (web), 3 án khách, 1 khách sảnh nghề mỗi sảnh, một bậc tu (canon §9.2 «Một ngày»). Nút dock hiển thị `{xong}/{tổng} việc` thay `{n}/3`.

**Luật nhịp:** ngày reset theo **0 giờ giờ máy** (đã có). ★ Câu hỏi mở cho tài liệu 09 / 10: có reset theo giờ Tý (23:00) cho khớp lịch can chi không — phần 09 (âm nhạc) đã đổi nhạc theo giờ Tý; giao diện ghi «Việc làm mới lúc 0 giờ» cho tới khi quyết định.

---

## UI-50 · Bàn Thầy Tử Bình — lập lá số (mã ngắn: `thay`)

| | |
|---|---|
| Nguồn | `stations.js › openThay` → nghi thức `.hq-chart.ritual` (dòng mực nghiêng «.hq-ink» trong lúc lật trụ, thanh `.hq-bars` và luận `.hq-reading` mờ rồi hiện), 4 trụ `.hq-pillars` (trụ ngày `.is-day` viền son), thanh ngũ hành `.hq-bar`, chọn hồ sơ `profileSelect`, thưởng `REWARD.chart = 10` |

**Bố cục hiện có giữ nguyên;** bổ sung:

1. Dòng Hán Việt dưới chữ trụ (như UI-04).
2. Nút «Mở Mệnh Bàn» khi hồ sơ là «Bản thân».
3. Nút «🎙 Hỏi Thầy» (web) mở UI-41 persona Thầy Tử Bình (đã có luồng `openMaster`).
4. Hồ sơ người khác: luận dùng ngôi thứ ba («lá số của Mẹ»), không «con».

**Âm:** nghi thức lật trụ dùng cùng bộ `SFX-RITE-001…004` như UI-04 (nhất quán: người chơi nhận ra «tiếng lập lá số»).

---

## UI-51 · Giải án sáu bước (mã ngắn: `case`)

| | |
|---|---|
| Nguồn | `case-ui.js › shell(head, steps)` + `runSteps()`: chấm tiến độ `.hq-steps` (6 vạch: done / on), tiêu đề «Bước i/n · {tên}», nút «Tiếp →» / «Xem kết quả»; các bước `STEP_ORDER` = `pillars, wx, strength, yong, timing, advice` (`protocol.js › STEPS`); bàn chữ `.hq-tiles` (6 cột, 4 cột ≤ 380 px), ô trụ `.hq-slotcol`, phản hồi `.hq-feedback.good/mid/bad`, trích cổ thư `.hq-cite`, kết quả `.hq-result` với vòng điểm `.hq-score` |

**Khung dọc (bước 1 — dựng trụ)**

```
┌──────────────────────────────────────┐
│ Án của chị Lan                   ✕   │
├──────────────────────────────────────┤
│ (●) Chị Lan · 34 tuổi · hỏi chuyện   │  .hq-npc
│ ┃ «Năm nay có nên đổi việc không?»   │  .hq-quote
│ ▬▬ ▬▬ ── ── ── ──                    │  .hq-steps
│ Bước 1/6 · Dựng tứ trụ               │
│ ┌────┬────┬────┬────┐                │  .hq-slots
│ │Giờ │Ngày│Thg │Năm │                │
│ │ 甲 │ ?  │ 丙 │ 辛 │                │
│ │ 子 │ ?  │ 申 │ 未 │                │
│ └────┴────┴────┴────┘                │
│ ┌──┬──┬──┬──┬──┬──┐                  │  .hq-tiles
│ │甲│乙│丙│丁│戊│己│                  │
│ │Giáp│Ất│Bính│Đinh│Mậu│Kỷ│            │  small Hán Việt
│ ├──┼──┼──┼──┼──┼──┤                  │
│ │庚│辛│壬│癸│  │  │                  │
│ └──┴──┴──┴──┴──┴──┘                  │
│ ▸ Thầy nhắc (gợi ý, −10%)            │
│ [ Tiếp → ]                           │
└──────────────────────────────────────┘
```

**★ Bổ sung:** mỗi bước có phím tắt (1–9 chọn chữ, ⌫ xoá, Enter tiếp); phản hồi sai **không** dùng chữ «Sai» — dùng «Chưa khớp: …» + trích cổ thư; chế độ đồng tu (coop 4 người, đã có giao thức `coop_*`) hiện avatar người đang chọn trên ô.

**Đo lường (đã có giao thức chấm `graded`):** `ui_case_step {i, n, score_bucket}`; `ui_case_done {score_bucket, coop: bool}`; `ui_case_hint`.

---

## UI-52 · Sảnh nghề (mã ngắn: `hall`)

| | |
|---|---|
| Nguồn | `halls.js` (8 sảnh), cùng khung `shell/runSteps` với bước riêng: Trạch Nhật (`zheri-case.js`, `ZHERI_STEPS`), Dương Trạch (`dz-case.js`, lưới 9 cung `.hq-grid9`), Điều Hậu, Thư Lâu, Hợp Hôn, Tử Vi, Tượng Pháp, Cách Cục; thưởng `DESK_REWARD = 15`, 1 khách / sảnh / ngày (`deskDone`) |

**Thống nhất giao diện 8 sảnh:**

| Sảnh | Vùng | Màu nhấn (đạo / phái) | Thành phần riêng |
|---|---|---|---|
| Trạch Nhật | Lịch Đường | vàng lịch | lưới ngày 建除十二神, chọn ngày |
| Dương Trạch | Phong Thủy Viên | lục rêu | lưới 9 cung (đã có) |
| Điều Hậu | Cùng Thông Hồ | lam nước | thanh hàn – noãn |
| Thư Lâu | Thư Lâu Lâm | nâu sách | trang sách lật |
| Hợp Hôn | Huyền Thành | son hồng | hai lá số song song |
| Tử Vi | Trích Thiên Đỉnh | tím sao | bàn 12 cung |
| Tượng Pháp | Manh Phái Cốc | đen mực | thẻ «tượng» kéo thả |
| Cách Cục | Tử Bình Phong | son | bảng cách cục |

**Luật chung:** đầu bảng ghi «Sảnh {tên} · khách hôm nay: {n}/1». Đã xong: «Hôm nay sảnh đã đóng sổ. Mai thầy có khách mới.» (S-EMPTY). Màu nhấn chỉ dùng cho viền và tiêu đề, không đổi màu nút chính (giữ son).

---

## UI-53 · Vận Mệnh Các — bia và chín cổng đại vận (mã ngắn: `vanmenh`)

| | |
|---|---|
| Nguồn | `vanmenh-ui.js › vanBiaBody` (nền mệnh, danh sách cổng `.hq-van-list` với `li.on` đang đi / `li.past` đã qua, nhãn `.hq-luck good/mid/bad`, các mốc), `vanGateBody(api, i)` (một cổng: can / chi thập thần, chủ đề, Trường sinh, cứu / phá cách); `roomData` khắc biển cổng / bia trong cảnh 3D; câu chú `NOTE` |
| Chỉ | web |

**Giữ bố cục hiện có;** bổ sung:

1. Mỗi cổng đại vận trong **cảnh 3D** có biển khắc can chi (đã có) — giao diện chỉ mở khi người chơi đứng trước cổng (`van0…8`), đúng P4 «cảnh là giao diện».
2. Ví dụ `MAU-A`: chín cổng 壬午 · 癸未 · 甲申 · 乙酉 · 丙戌 · 丁亥 · 戊子 · 己丑 · 庚寅; cổng thứ 3 (甲申, 28–37 tuổi) sáng `li.on`.
3. Nhãn đánh giá `.hq-luck` luôn kèm chữ (Cát / Bình / Hung) — không chỉ màu.
4. Câu chú bắt buộc ở cuối mọi bảng: «Quỹ tích và vận hạn là tham khảo theo cổ pháp — đời người do mình quyết định.» (đã có).
5. Nút «🎙 Hỏi Thầy thêm» (đã có) dùng persona Thầy Tử Bình.

**Đo lường:** `ui_vanmenh_view {what: bia|gate, i}`; `ui_vanmenh_ask`.

---

## UI-54 · Thái Tuế Điện — bàn lễ và đèn (mã ngắn: `thaitue`)

| | |
|---|---|
| Nguồn | `vanmenh-ui.js › thaiTueBody`: niên chủ `{ganZhi} 太歲`, vị thứ /60, phương Thái Tuế, ô «bạn phạm / không phạm» `.hq-tt-me.bad/good`, lưới 12 tuổi `.hq-tt-grid` (`.heavy` / `.light` / `.me`), tập tục dân gian (details), đèn an Thái Tuế (`S.lampState`, `S.lightLamp`, `LAMP_REWARD first 10 / daily 3`) |
| Chỉ | web |

**Bổ sung:**

1. Lưới 12 tuổi: mỗi ô có **chữ tắt loại phạm** (Trị · Xung · Hình · Phá · Hại — đã có) + viền; thêm hoa văn (viền đôi = nặng, viền đứt = nhẹ) cho người mù màu.
2. Ô «bạn phạm»: nền `rgba(224,83,63,.16)` hiện có → đổi sang nền **vàng đất** `rgba(201,154,74,.18)` với chữ `#f1d9a8`. Lý do P2: phạm Thái Tuế là tục lệ, không phải án phạt; đỏ gây sợ.
3. Đèn: khi bấm thắp / thêm dầu → camera cận ngọn đèn trong cảnh 1,2 s (phần 08, preset `cam.lamp`), âm `SFX-RITE-030` (diêm quẹt) + `SFX-RITE-031` (dầu rót).
4. Câu chú bắt buộc (đã có): «Tín ngưỡng dân gian để tham khảo — giữ tâm an, làm việc thiện là chính.»

**Ví dụ `MAU-A` năm 2026 丙午:** tuổi Ngọ — ô «bạn phạm» liệt kê Trị (值) và Hình (刑) (canon §11).

---

## UI-55 · Thầy Giải Quẻ — năm phép (mã ngắn: `que`)

| | |
|---|---|
| Nguồn | `que-ui.js`: thẻ `.hq-tabs` (Mai Hoa theo giờ / theo 2 số · Lục Hào gieo 3 xu × 6 · Tiểu Lục Nhâm · Kim Khẩu Quyết · Xin xăm kèm keo), kết quả `.hq-que-res`, quẻ `.hq-que-hex`, xu `.hq-coins` (lật `hq-coin` 0,6 s), hào `.hq-ly-line` (hào động phát sáng cam), Tiểu Lục Nhâm `.hq-xlr`, nhãn `.hq-luck` |
| Chỉ | web (`FEATURES.divination`) |

**Bổ sung:**

1. Gieo xu: âm `SFX-MG-020` (ba xu đồng chạm bát sứ), rung light mỗi lần gieo; giảm chuyển động → xu hiện mặt ngay.
2. Hào động: ngoài màu cam phát sáng (đã có) thêm ký hiệu «○» (dương động) / «×» (âm động) theo lối ghi cổ — kênh không-màu.
3. Mỗi quẻ có dòng Hán Việt tên quẻ (đã có `nameVi` khi có) và nghĩa một dòng.
4. Câu chú cuối: «Quẻ để chiêm nghiệm. Việc lớn vẫn nên bàn với người thật.»

---

## UI-56 · Tàng kinh các — đọc kinh, cổ thư (mã ngắn: `library`)

| | |
|---|---|
| Mục đích | Đọc giới thiệu, ý nghĩa, ngữ cảnh của kinh và cổ thư (canon §5.4: «không in toàn văn chú ngoài những gì app đã có và được phép trích») |
| Nguồn | `remedy-fate › JING_ZHOU` (7 kinh theo việc), `daozang-data` (1.527 bản), `library-data`; Thư Lâu đã có (sảnh nghề) |
| Lối vào | Tàng kinh các ở Bút Tháp, Chung Nam; Văn Xương Các; liên kết từ UI-31 |

```
┌──────────────────────────────────────┐
│ Tàng kinh các · Bút Tháp         ✕   │
├──────────────────────────────────────┤
│ 🔎 Tìm theo tên / việc…              │
│ [Theo việc] [Đạo Tạng] [Nho] [Phật]  │
│ ─ Theo việc (JING_ZHOU) ────────────│
│ 藥師經 Dược Sư — khi bệnh            │
│ 地藏經 Địa Tạng — nghiệp nặng        │
│ 金剛經 Kim Cang — trí tuệ            │
│ 普門品 Phổ Môn — tai nạn             │
│ 楞嚴經 Lăng Nghiêm — chướng ngại     │
│ 準提 Chuẩn Đề — nghèo khó            │
│ 送子觀音 Tống Tử Quan Âm — con cái   │
└──────────────────────────────────────┘
```

**Trang một bản kinh:** tên Hán + Hán Việt + nghĩa; nguồn gốc; ý nghĩa; «trong game bạn gặp kinh này ở…»; **không** có nút «tụng để nhận thưởng» (canon §5.4: không biến tụng kinh thành vật phẩm bấm để buff). Bản iOS giữ (học).

**Kiểu chữ đọc dài:** serif 17 px, dòng 1,75, rộng dòng ≤ 34 em, nền giấy (đảo màu: chữ `#2a1d10` trên `--hq-paper`, tương phản 13,4) — giống thẻ xăm `.hq-stick-card` hiện có.

---

## UI-57 · Bách khoa — từ điển thuật ngữ (mã ngắn: `codex`)

| | |
|---|---|
| Mục đích | Nơi tra mọi chữ Hán, thuật ngữ, mục lore (`LORE-xxx` của tài liệu 02) |
| Lối vào | chạm bất kỳ thuật ngữ gạch chân chấm (glossary hook — phần 13 §4); menu tạm nghỉ |
| Nguồn | (chưa có — cần làm); dữ liệu từ phụ lục C bản tổng + `constants.js` của engine (`WX_VI`, `ZHI`…) |

**Thẻ thuật ngữ (popover, không mở bảng)**

```
        ┌──────────────────────────────┐
        │ 七殺 Thất Sát                 │
        │ Thập thần khắc nhật chủ, cùng │
        │ dấu âm dương. Ví như áp lực,  │
        │ thử thách, quyền lực cứng.    │
        │ [ Đọc thêm trong Bách khoa › ]│
        └──────────────────────────────┘
```

**Luật:** popover ≤ 3 dòng nghĩa; mở bằng chạm (không hover-only); đóng bằng chạm ngoài / Esc. Thuật ngữ đã tra ≥ 3 lần thì bỏ gạch chân (giảm nhiễu) — có tùy chọn giữ (UI-76).

**Đo lường:** `ui_codex_pop {term_id}`; `ui_codex_view {entry}`.
