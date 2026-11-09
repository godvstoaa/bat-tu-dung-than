# 09-04 · Mini-game I — Tĩnh và Tâm (MG-01 … MG-06)

> Sáu mini-game nền của đời tu: ngồi, viết phù, thi, đi quyền, dựng cát, tụng niệm. Mỗi game theo **đúng mẫu 14 mục** ở `09-03` §13.1; mọi con số B / NK / `s_min` / bậc mở / iOS lấy từ bảng chủ `09-03` §6; công thức ra Đạo Hạnh là `09-03` §2.2. Quy ước điều khiển chung (`09-03` §13.2), trợ năng chung (§13.3), chống gian chung (§12) và bộ sự kiện đo lường chung (§13.5) **không nhắc lại** — mỗi game chỉ ghi phần riêng.
>
> Ví dụ số dùng lá số mẫu `MAU-A` (Tiềm Lực 41 → NT 1,19; Dụng Thủy, Hỷ Kim) để khớp các tài liệu khác.

**Mục lục**

| Mã | Tên | Nhóm | Mở | Dòng |
|---|---|---|---|---|
| `MG-01` | Tĩnh Tọa Hồi Tức | Tĩnh | bậc 1 | §1 |
| `MG-02` | Kết Phù Ngũ Bộ (iOS: Họa Văn Ngũ Bộ) | Nghệ | bậc 2 | §2 |
| `MG-03` | Khoa Cử Tam Trường | Học | bậc 1 (Hương thí) | §3 |
| `MG-04` | Thái Cực Vân Thủ | Thân | bậc 1 | §4 |
| `MG-05` | Mạn-đà-la Cát | Lễ | bậc 3 | §5 |
| `MG-06` | Tụng Kinh · Lạy Nhịp | Lễ | bậc 1 | §6 |

**Bốn mức tinh thông** dùng trong mọi bảng «Đường cong độ khó» dưới đây là **Tu độ đạo thống** của nơi chơi (`09-03` §11.2): **Sơ** (mặc định, < 250 thô) · **Trung** (Nhập Thất, ≥ 250) · **Thâm** (Thâm Nhập, ≥ 800) · **Viên Thông** (≥ 2.000). Người chơi luôn được chọn mức thấp hơn mức mình đạt; chọn thấp hơn **không** giảm thưởng (độ khó là để thú vị, không phải để cày).

---

## 1. `MG-01` · Tĩnh Tọa Hồi Tức (vòng hơi thở)

### 1.1 Mục đích

Ngồi yên, thở đều, để tạp niệm trôi qua mà không đuổi theo. Đây là hoạt động **gốc** của mọi đạo thống (Đạo gọi tĩnh tọa / thổ nạp, Phật gọi thiền định, Nho gọi tĩnh tọa dưỡng khí), nên mở từ bậc 1 và dùng làm pha «Định» trong nhiều độ kiếp (`ACT-K3-TV`, `ACT-K4-TV`, `ACT-K3-TH`). Trụ cột: T3 (thử thách là tâm), T6 (không dạy kỹ thuật khí công thật — chỉ nhịp thở thường an toàn).

### 1.2 Engine dạy

| Nội dung | Nguồn | Dùng thế nào |
|---|---|---|
| Thổ nạp «thổ cố nạp tân» | `cultivation-data › CULTIVATION` mục `GONG_TUNA` | câu giảng khi mở game lần đầu; thẻ «Hỏi thầy» |
| Tồn tưởng · nội quan | `cultivation-data › CULTIVATION` mục `GONG_CUNXIANG`, `DAN_NEIGUAN_JING` | lời dẫn ở mức Thâm |
| «Thủ nhất / phục khí / thổ nạp — tọa 15–30 phút» | `remedy-fate › DAO_JIA[2]` | lý do trần 15 phút / lượt |
| Cảnh báo không tự luyện | `cultivation-data › ETHICS` (tái xuất từ `amta-data`) | dòng chân trang cố định |
| Tạp niệm theo tam độc | `liudao › computeLiuDao(R).poisons {tham, san, si}` và `.poisonTop` | trộn câu tạp niệm theo tỉ lệ tam độc của **lá số người chơi** |
| Nhịp 4 – 4 – 6 (14 giây) | `stations.js › openTra` (vòng `cyc % 14`: Hít vào / Giữ hơi / Thở ra) | dùng lại đúng nhịp đang có ở Trà Thất |

Phần hư cấu: hình «vòng hơi thở», câu chữ của tạp niệm, hiệu ứng linh khí.

### 1.3 Luật chơi

1. Chọn thời lượng **3 / 5 / 10 / 15 phút** (ngồi lâu hơn 15 phút được, phút thứ 16 trở đi chỉ hồi Nguyên Khí, không thêm thô).
2. Một **chu kỳ** = Hít vào 4 s → Giữ hơi 4 s → Thở ra 6 s (mức Sơ).
3. Người chơi **nhấn giữ** khi vòng bắt đầu phình (Hít vào), **giữ nguyên** suốt Giữ hơi, **thả** đúng lúc vòng bắt đầu co (Thở ra). Hai mốc chấm mỗi chu kỳ: thời điểm nhấn, thời điểm thả.
4. **Tạp niệm** là những dải chữ mờ trôi ngang màn hình. Luật duy nhất: **để yên**. Chạm vào, rê chuột theo, hay nhấn phím khi dải chữ đi qua tâm vòng → tính là «đuổi theo niệm».
5. Ba chu kỳ liền không có thao tác → trạng thái **«Ngủ gật»**: nhân vật vẫn ngồi, Nguyên Khí vẫn hồi, nhưng các phút đó không tính thô. Một thao tác đúng nhịp là tỉnh lại ngay, không phạt thêm.
6. Kết thúc khi hết giờ (chuông nhỏ, như `openTra › finish(true)`) hoặc khi đứng dậy.

**Câu tạp niệm** (trộn theo tỉ lệ tam độc; mỗi lá số có hỗn hợp riêng — đúng T1):

| Độc | Ví dụ câu (8 / độc ở bản đầu, tài liệu 06 viết thêm) |
|---|---|
| Tham (贪) | «Chiếc áo kia đang hạ giá…» · «Giá mà có thêm một chút nữa…» · «Người ta có, sao mình chưa có?» |
| Sân (嗔) | «Câu nói hôm qua, đáng lẽ mình phải đáp lại…» · «Sao lại là mình chịu thiệt?» · «Người đó cố tình…» |
| Si (痴) | «Mình rốt cuộc là ai?» · «Nếu năm sau xấu thì sao?» · «Chắc số mình là vậy rồi…» |

Tỉ lệ: `p_x = poisons.x / (tham + san + si)`; nếu tổng = 0 thì đều 1/3. Độc mạnh nhất (`poisonTop`) có dải chữ **đi chậm hơn 20%** và **đi sát tâm vòng hơn** — cám dỗ khó bỏ qua nhất là cám dỗ của chính mình.

### 1.4 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Hít vào / giữ hơi | chạm giữ bất kỳ đâu ngoài nút | giữ `Space` | giữ nút trái |
| Thở ra | nhấc ngón | nhả `Space` | nhả nút |
| Đứng dậy | nút «Đứng dậy» | `Esc` | nút |
| Bật / tắt âm hướng dẫn | nút loa | `M` | nút |
| Chọn thời lượng (trước khi ngồi) | thẻ 3 / 5 / 10 / 15 | `1`–`4` | nhấp |

Không cần nhìn: có thể nhắm mắt chơi bằng âm (hít — tiếng gió vào, giữ — lặng, thở — tiếng nước chảy).

### 1.5 Bố cục giao diện

```
┌──────────────────────────────────────────────┐
│ Trà Thất · giờ Mão          còn 08:42   [Đứng dậy] │
│                                              │
│   «Câu nói hôm qua…» ───────────→  (tạp niệm) │
│                                              │
│                 ╭──────────╮                 │
│               ╭─┤  Giữ hơi ├─╮   ← vòng hơi thở │
│               ╰─┤   ○ ○ ○  ├─╯   (3 chấm = 3   │
│                 ╰──────────╯      chu kỳ đều liền)│
│                                              │
│        ▁▂▃▄▅▆▇ khí đều                        │
│ Nguyên Khí 46 ↑ (+2/phút)          [🔈]        │
└──────────────────────────────────────────────┘
```

Camera: góc thứ ba, nhân vật ngồi bồ đoàn (`characters.js › SEAT_HIP` tư thế xếp bằng đã có), màn hình mờ dần ra rìa. Không có điểm số trên màn hình trong lúc ngồi (chỉ «khí đều» dạng thanh mềm).

### 1.6 Đường cong độ khó

| Mức | Nhịp (hít – giữ – thở) | Dung sai nhấn / thả | Mật độ tạp niệm | Đặc biệt |
|---|---|---|---|---|
| Sơ | 4 – 4 – 6 (14 s) | ± 500 ms | 1 / 45 s | vòng sáng rõ, có tiếng đếm khẽ |
| Trung | 4 – 6 – 8 (18 s) | ± 400 ms | 1 / 30 s | tạp niệm đôi khi đổi hướng |
| Thâm | 5 – 7 – 10 (22 s) | ± 350 ms | 1 / 20 s | dải chữ độc chính đi **qua tâm vòng** |
| Viên Thông | 6 – 8 – 12 (26 s) | ± 350 ms | 1 / 30 s | vòng gần như tàng hình; chỉ chuông khẽ mỗi 3 chu kỳ — «thai tức»: đếm trong lòng |

Theo bậc cảnh giới: bậc 1–2 chỉ có Sơ; bậc 3 mở Trung; bậc 4 mở Thâm; Viên Thông cần Tu độ ≥ 2.000 ở đạo thống của nơi ngồi.

### 1.7 Chấm điểm

```
H  = trung bình chu kỳ của  max(0, 1 − |Δnhấn|/dungSai) × 0,5 + max(0, 1 − |Δthả|/dungSai) × 0,5
     (chu kỳ ngủ gật: không tính vào mẫu số; chu kỳ nhấn lại giữa chừng: điểm chu kỳ × 0,5)
Đ  = max(0, 1 − sốLầnĐuổi / sốTạpNiệmXuấtHiện)
L  = chuỗi chu kỳ đạt (≥ 0,7) dài nhất / tổng chu kỳ tỉnh
s  = 0,55·H + 0,30·Đ + 0,15·L
B_eff = min(15, số phút có ≥ 1 chu kỳ tỉnh)          ← B = 1 / phút
thô = B_eff × f(s) × K_lặp × K_hư                     (09-03 §2.2)
```

Nguyên Khí: **+2 / phút ngồi** (kể cả phút ngủ gật), không tiêu.

**Ví dụ (`MAU-A`, Trà Thất Sơn Môn — đạo thống TC, hành Thổ, không hợp Dụng):** ngồi 15 phút, 1 phút ngủ gật → `B_eff = 14`. H = 0,78; 9 tạp niệm, đuổi 2 → Đ = 0,78; L = 0,62. `s = 0,429 + 0,234 + 0,093 = 0,756` → `f = 0,829`. `thô = 14 × 0,829 = 11,6`. NK đầu lượt 45 → `K_sung = 1`. `ĐH = 11,6 × 1,19 = 13,8` → hiện **+13**. Phúc Khí +6. NK +30.
Cùng lượt ở Võ Đang (TV, Thủy = Dụng): `ĐH = 11,6 × 1,19 × 1,10 = 15,2`.

### 1.8 Phần thưởng

| Hạng mục | Giá trị |
|---|---|
| Thô | `B_eff × f(s)`, tối đa 15 / lượt; `K_lặp` theo lượt trong ngày |
| Phúc Khí | `round(thô × 0,5)` + Phúc Khí trà theo `addTeaMinutes` nếu ngồi ở Trà Thất (giữ nguyên trần 15 / ngày đang có) |
| Nguyên Khí | +2 / phút |
| Nhật Khóa | tính một việc nhóm **Tĩnh** nếu ≥ 5 phút và `s ≥ 0,4` |
| Thành tựu mới | «Mười phút không đuổi niệm» (một lượt 10 phút, Đ = 1) · «Ba mươi ngày ngồi» |
| Đồng tu (MMO) | 5 người cùng ngồi ≥ 10 phút trong cùng phòng → tính việc tuần «Đồng tu» (`09-03` §5.4) |

### 1.9 Trạng thái thất bại

| Trạng thái | Điều kiện | Xử lý |
|---|---|---|
| Chưa đạt | `s < 0,4` | `f = 0,15`, vẫn có thô nhỏ và đủ Nguyên Khí |
| Ngủ gật cả lượt | không chu kỳ tỉnh nào | 0 thô; Nguyên Khí vẫn hồi; không tính `K_lặp` |
| Đuổi niệm liên tục | ≥ 5 lần trong 1 phút | vòng nhòe 10 s, NPC nhắc khẽ (không phạt thêm) |

```
[CẢNH MG-01.F1 · Trà Thất Sơn Môn · bất kỳ giờ · sau lượt chưa đạt]
LÃO TÙNG: (rót thêm nước) Niệm nó tới thì cứ để nó tới. Mình là cái bàn, niệm là con ruồi. Bàn đâu cần đuổi ruồi.
> Lựa chọn: ① «Ngồi lại một lượt ngắn» → mở lại 3 phút  ② «Thôi, để mai» → đóng
[CẢNH MG-01.F2 · Võ Đang · giờ Tý · ngủ gật trọn lượt]
HUYỀN HƯ: (cười) Ngủ cũng là dưỡng. Nhưng ngủ thì gọi là ngủ, đừng gọi là tọa.
```

### 1.10 Trợ năng (riêng)

- Chế độ «Thở theo đồng hồ»: thay vòng phình–co bằng thanh tiến độ ngang có ba màu đoạn (giảm chuyển động).
- Chế độ «Tự nhịp»: hệ thống **đo nhịp thở tự nhiên** của người chơi trong 3 chu kỳ đầu (thời điểm nhấn / thả), rồi lấy đó làm nhịp chuẩn (giới hạn 10–30 s / chu kỳ). Dành cho người hen suyễn, người không giữ được 4 – 4 – 6. **Không giảm điểm.**
- Tạp niệm đọc bằng `aria-live="polite"` khi bật chế độ đọc; luật «để yên» giữ nguyên (người đọc màn hình không phải làm gì).
- Rung nhẹ (`haptics.js › buzz('light')`) ở đầu mỗi pha khi bật rung.

### 1.11 Chống gian (riêng)

| Rủi ro | Biện pháp |
|---|---|
| Treo máy (kẹp phím) | giữ phím > 1,5 chu kỳ = không thả → chu kỳ 0 điểm; 3 chu kỳ liền → ngủ gật |
| Macro nhấn / thả đều tăm tắp | độ lệch chuẩn Δ < 15 ms trên 20 chu kỳ → `mg_flag` (người thật lệch 60–200 ms) |
| Đổi tab để trôi giờ | rời tiêu điểm > 10 s → tạm dừng, đồng hồ không chạy |
| Gửi `B_eff` giả | máy chủ tính `B_eff` từ nhật ký chu kỳ có dấu thời gian máy chủ nhận |

### 1.12 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `mg01_cycle` (gộp mỗi 5 chu kỳ) | `run_id, cycles, mean_press_ms, mean_release_ms, doze_cycles` |
| `mg01_chase` | `run_id, poison (tham/san/si), is_top_poison` |
| `mg01_selfpace_set` | `run_id, cycle_s` |

Câu hỏi thiết kế cần dữ liệu: độc chính có thật sự bị «đuổi» nhiều hơn không? (so tỉ lệ `is_top_poison`).

### 1.13 iOS

Giữ nguyên. Chữ «tĩnh tọa» không đổi; câu tạp niệm nhóm Si bỏ câu «Nếu năm sau xấu thì sao?» (gợi vận hạn bản thân) thay bằng «Hôm nay mình đã làm gì cho ai chưa?».

### 1.14 Nghiệm thu

- [ ] Nhịp mức Sơ khớp `openTra` (14 s, ba pha cùng tên).
- [ ] Tỉ lệ tạp niệm khớp `computeLiuDao(R).poisons` của hồ sơ «Bản thân» (test node với `MAU-A`).
- [ ] Ba chu kỳ không thao tác → ngủ gật; phút ngủ gật không vào `B_eff`; NK vẫn +2 / phút.
- [ ] Phút > 15 không thêm thô.
- [ ] «Tự nhịp» không làm đổi `s` so với chế độ thường cho cùng độ chính xác tương đối.
- [ ] Ngồi ở Võ Đang với `MAU-A` → `K_dụng = 1,10`; ở Trà Thất → 1,0.
- [ ] Không hiện số điểm trong lúc ngồi.

---

## 2. `MG-02` · Kết Phù Ngũ Bộ (iOS: «Họa Văn Ngũ Bộ»)

### 2.1 Mục đích

Dạy **cấu trúc** của một lá phù theo cổ pháp — năm phần đầu, thân, bụng, đảm, chân — như một câu đố logic ngũ hành và một bài luyện nét bút. Người chơi hiểu «phù có ngữ pháp», nhưng **không bao giờ** có được một lá phù thật vẽ lại được (canon T6: app cố ý để phù «không vẽ được»). Trụ cột: T5 (đúng cấu trúc cổ pháp), T6 (ký tự hư cấu, không bán «đổi vận»).

### 2.2 Engine dạy

| Nội dung | Nguồn | Dùng thế nào |
|---|---|---|
| Năm phần của phù | `talisman-data › TALISMANS` (lớp `fu`), trường `structure.head / body / belly / core / foot` (vd `FU_MAOSHAN_XIE`, `FU_ZHENGYI_BEIDOU`) | tên năm ô và lời giảng từng ô |
| Mục đích của từng loại phù | trường `use` (vd «驅邪 · 收妖 · 鎮宅», «延生 · 解厄 · 拜斗») | sinh loại việc cho phiếu đặt phù |
| Đạo đức | `talisman-data › ETHICS` (tái xuất `amta-data`); `library-data` ghi chú «符 chỉ cấu trúc-thị giác» | dòng chân trang + lời Trương Thiên Sư |
| Việc cần trấn | `fs-cure › SHA_LIST` (vd `chishen` 穿心煞, `luchong` 路冲), `cureByElement(R)` | phiếu «trấn trạch» có hành hóa giải |
| Hành cần bổ của khách | `chart › analyze(...).yong.primary` của NPC (`npc.js › makeNpc`) | phiếu «bình an cho người đi xa» |
| Bộ chữ «Huyền Văn» | (chưa có — cần làm) — 40 ký tự hư cấu, sinh thủ tục (procedural) | toàn bộ hình chữ |

### 2.3 Luật chơi

**Phiếu việc.** Mỗi lượt nhận một phiếu từ NPC (Trương Thiên Sư ở Long Hổ, Mao Sơn đạo nhân ở Mao Sơn), gồm: **mục đích** (trấn / an / thông / thu / hộ) và **hành cần** (một trong ngũ hành, do engine tính — xem bảng).

| Loại phiếu | Sinh từ | Hành cần |
|---|---|---|
| Trấn trạch | một sát ngẫu nhiên trong `SHA_LIST` có `severity` hung | hành trong cách hóa (vd gương / chuông đồng → Kim; cây xanh → Mộc), ánh xạ bảng tĩnh `SHA → hành` (chưa có — cần làm, 15 dòng) |
| Bình an đi xa | NPC `makeNpc` | `yong.primary` của NPC |
| Giải ách năm | NPC + năm can chi hiện tại | hành **sinh** Dụng của NPC (mẹ của Dụng) |
| Hộ học | học trò NPC | Mộc (Văn Xương, `xuankong › STAR[4]`) |

**Bộ Huyền Văn.** 40 ký tự hư cấu chia **5 lớp × 8**: lớp **Tín** (cho Đầu), **Danh** (Thân), **Trận** (Bụng), **Đảm** (Đảm), **Phong** (Chân). Mỗi ký tự mang ba thuộc tính đọc được trên thẻ: hành (木火土金水), âm / dương, tính (trấn · an · thông · thu · hộ).

**Ghép năm ô theo thứ tự từ trên xuống** (khai bút ở đầu, phong ở chân — sai thứ tự bị trừ điểm «thứ tự»):

| Ô | Lớp | Điều kiện đúng |
|---|---|---|
| Đầu | Tín | ký tự Tín của **đúng phái** nơi viết (Long Hổ có 4 ký tự Tín phái CN, Mao Sơn 4 ký tự phái TT) |
| Thân | Danh | `tính` = mục đích của phiếu |
| Bụng | Trận | hành của Trận **không khắc** hành Đảm (sinh hoặc đồng hành đều được) |
| Đảm | Đảm | hành = **hành cần** của phiếu |
| Chân | Phong | hành Phong **sinh** hành Đảm hoặc đồng hành; và âm / dương **khác** ô Đầu (đầu – chân giao nhau) |

Sau khi ghép, **họa nhất bút**: một đường nét liền nối năm ô theo đường dẫn mờ; nhấc bút giữa chừng tính một lần «đứt mạch» (tối đa 2 lần trước khi phải viết lại).

**Kết thúc lượt.** Lá phù được trao cho NPC hoặc đốt trong lư của điện (hiệu ứng tro bay) — vật phẩm tiêu ngay, **không có túi đồ «phù»**, không có nút lưu ảnh, không in.

**Ngã rẽ phạm giới.** Khoảng 1/12 phiếu (từ bậc 3) có thêm một khách «xin mua lá phù để đổi vận, trả gấp ba». Nhận lời → −8 ĐH (`09-03` §10.2). Từ chối → +1 công (DEED do tài liệu 05 đặt mã).

### 2.4 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Chọn ô đang ghép | chạm ô trên lá phù | `↑ ↓` | nhấp |
| Chọn ký tự cho ô | chạm thẻ trong khay | `1`–`8` | nhấp thẻ |
| Lật thẻ xem thuộc tính | chạm giữ thẻ | `I` | rê chuột |
| Họa nhất bút | kéo một ngón theo đường dẫn | giữ `Space` để bút tự chạy theo đường, `← →` chỉnh lệch, nhả = nhấc bút | kéo giữ nút trái |
| Viết lại | nút «Viết lại» | `R` | nút |

### 2.5 Bố cục giao diện

```
┌──────────── Long Hổ · Thiên Sư Phủ · Phù thất ───────────┐
│ PHIẾU: Trấn trạch · 穿心煞 · hành cần: Kim ●             │
│                                                         │
│      ┌───────┐        Khay lớp «Danh»                   │
│      │ ĐẦU  ✓│        ┌──┐┌──┐┌──┐┌──┐                  │
│      │ THÂN ▸│        │꩜ ││⟁ ││⌘ ││✶ │  (ký tự hư cấu)  │
│      │ BỤNG  │        └──┘└──┘└──┘└──┘                  │
│      │ ĐẢM   │        thẻ lật: 金 ● · dương · trấn       │
│      │ CHÂN  │                                          │
│      └───────┘     [Hỏi thầy] [Viết lại] [Họa nhất bút]  │
│ Năm phần: 符頭 · 符身 · 符腹 · 符膽 · 符腳 (talisman-data) │
└─────────────────────────────────────────────────────────┘
```

### 2.6 Đường cong độ khó

| Mức | Thẻ / lớp hiện ra | Gợi ý | Đường nhất bút | Phiếu |
|---|---|---|---|---|
| Sơ | 3 | màu hành hiện trên thẻ; ô sai rung đỏ | dài 1×, có đường dẫn đậm | một điều kiện |
| Trung | 5 | màu hành ẩn, phải lật thẻ | dài 1,3×, dẫn mờ | thêm điều kiện âm / dương |
| Thâm | 8 | phiếu chỉ ghi **tứ trụ** của khách, người chơi tự suy Dụng (đáp án `analyze`, chấm như `cases.js › gradeYong`) | 1,6×, có đoạn quay ngược | hai phiếu ghép (hai việc cho cùng một nhà) |
| Viên Thông | 8 | không gợi ý | đường dẫn chỉ hiện 1 s đầu rồi tắt (viết theo trí nhớ) | phiếu do người chơi khác đặt (MMO, `ACT-K5-CN`) |

### 2.7 Chấm điểm

```
logic = (số điều kiện ô đúng) / 5          (Thâm: ô Đảm sai nhưng là Hỷ thần của khách → 0,5 ô)
order = 1 nếu ghép đúng thứ tự Đầu → Chân, 0,5 nếu sai 1 lần, 0 nếu sai ≥ 2
trace = độ khớp đường (trung bình 1 − khoảng lệch/ngưỡng, ngưỡng 18 px ở 1080p) × (1 − 0,2 × số lần đứt mạch)
s = 0,50·logic + 0,35·trace + 0,15·order        s_min = 0,5
```

**Ví dụ (`MAU-A` ở Mao Sơn — TT, hành Kim = Hỷ thần → `K_dụng 1,05`):** logic 5/5 = 1; trace 0,78; order 1 → `s = 0,5 + 0,273 + 0,15 = 0,923` → `f = 0,946`. `thô = 6 × 0,946 = 5,68`. NK đầu lượt 62 (≥ 30, < 70) → `K_hư 1`, `K_sung 1`. `ĐH = 5,68 × 1,19 × 1,05 = 7,10` → **+7**. Phúc Khí +3. NK −8.

### 2.8 Phần thưởng

| Hạng mục | Giá trị |
|---|---|
| Thô | `6 × f(s)` / lượt |
| Phúc Khí | `round(thô × 0,5)` |
| Tu độ | cộng vào CN (Long Hổ) hoặc TT (Mao Sơn) |
| Công | phiếu «Bình an đi xa» và «Giải ách» trao cho NPC khó khăn: +1 công khi `s ≥ 0,7` |
| Thẩm mỹ | 30 lá viên mãn → mở «Bút lông sói Thiên Sư Phủ» (vật cầm tay, Tàng Y Các, không bán) |

### 2.9 Trạng thái thất bại

| Trạng thái | Điều kiện | Xử lý |
|---|---|---|
| Phù «vô khí» | `logic < 0,6` | lá phù tro rơi xuống (không bay), `f = 0,15` nếu `s < 0,5` |
| Đứt mạch 3 lần | nhấc bút lần thứ 3 | phải viết lại đường, ô đã ghép giữ nguyên |
| Bán phù đổi vận | nhận lời khách | −8 ĐH, lời NPC dưới |

```
[CẢNH MG-02.F1 · Long Hổ · Phù thất · ban ngày · phù vô khí]
TRƯƠNG THIÊN SƯ: Đảm là tim của lá phù. Đặt tim sai hành thì người cầm cũng chẳng thấy gì khác. Phù là lời nhắc người ta sống cho đúng, không phải cái khóa mở vận.
> Lựa chọn: ① «Xin thầy giảng ô Đảm» → thẻ giảng `structure.core`  ② «Con viết lại» → lượt mới (tính K_lặp)
[CẢNH MG-02.F2 · Mao Sơn · Cửu Tiêu Vạn Phúc Cung · sau khi bán phù]
MAO SƠN ĐẠO NHÂN: Người ta đưa ba lạng bạc, con đưa lại họ một niềm tin sai. Món nợ ấy không ghi bằng bạc.
```

### 2.10 Trợ năng (riêng)

- Thẻ ký tự luôn kèm **tên đọc** (vd «Danh-3, Kim, dương, trấn») để người không phân biệt hình chữ lạ vẫn chơi được phần logic.
- Nhất bút có chế độ «Bút dắt» (bút tự đi, người chơi chỉ cần giữ, mỗi lần nhả = đứt mạch) — điểm trace tính theo độ giữ ổn định; không giảm thưởng.
- Đường dẫn có độ dày tùy chỉnh 2–8 px; mức tương phản cao: nền giấy trắng, mực đen.

### 2.11 Chống gian (riêng)

| Rủi ro | Biện pháp |
|---|---|
| Tra đáp án ô Đảm ngoài game | phiếu sinh theo hạt giống người chơi; bộ Huyền Văn **xáo vị trí và hình** mỗi tài khoản (cùng thuộc tính, khác hình) nên ảnh chụp đáp án không dùng chung được |
| Nét vẽ bằng phần mềm (đường hoàn hảo) | trace = 1 với vận tốc hằng số tuyệt đối → `mg_flag` |
| Phát tán hình phù | hình chữ sinh thủ tục, có nhiễu theo tài khoản; không có API xuất ảnh; vật phẩm tiêu ngay |

### 2.12 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `mg02_slot_pick` | `run_id, slot (head/body/belly/core/foot), correct, card_flips` |
| `mg02_trace_end` | `run_id, trace, breaks, path_len` |
| `mg02_sell_offer` | `run_id, accepted (bool)` — tỉ lệ nhận lời là chỉ số sức khỏe đạo đức của game |

### 2.13 iOS

Tên «**Họa Văn Ngũ Bộ**». Phiếu đổi lời: «Trấn trạch» → «Bố cục cho tranh treo nhà», «Giải ách năm» bỏ hẳn (gợi vận hạn). Năm ô giữ tên Hán (符頭 …) trong thẻ giảng vì là kiến thức văn hóa; NPC nói «họa văn», không nói «trấn». Không có ngã rẽ «bán đổi vận» (vẫn có nhánh từ chối quà biếu → +1 công).

### 2.14 Nghiệm thu

- [ ] Năm ô dùng đúng tên `structure.head/body/belly/core/foot`; thẻ giảng trích đúng chuỗi trong `talisman-data`.
- [ ] Không ký tự Huyền Văn nào trùng chữ Hán hay phù có thật (rà bởi người đọc chữ Hán + công cụ so ảnh với bộ CJK).
- [ ] Không có đường xuất ảnh / in / lưu phù.
- [ ] Hành cần của phiếu «Bình an» = `yong.primary` của NPC (test node 20 NPC).
- [ ] Điều kiện Bụng «không khắc Đảm» và Chân «sinh Đảm» đúng bảng sinh khắc.
- [ ] Nhận lời bán phù → −8 ĐH; iOS không có ngã rẽ này.

---

## 3. `MG-03` · Khoa Cử Tam Trường

### 3.1 Mục đích

Kiểm tra **hiểu biết thật** về cổ thư và lá số, theo ba kỳ như khoa cử xưa: **Hương thí** (hằng ngày), **Hội thí** (hằng tuần), **Đình thí** (hằng tháng âm). Là xương sống của đạo thống Nho (`NH`) và là cách game biến kho tri thức của app thành chơi được. Trụ cột: T5 (đáp án do engine / sách cổ, không do người viết tay), T1 (câu hỏi lá số từ `analyze`).

### 3.2 Engine dạy

| Nguồn câu hỏi | Engine | Dạng câu |
|---|---|---|
| Nguyên văn ↔ nghĩa | `halls.js › quoteBank()` (Trích Thiên Tủy, Ngũ Ngôn Độc Bộ, Tích Thiện Thiên, Cổ quyết `DITIANSUI_MAXIMS`) | chọn nghĩa đúng (như `buildThuVien`) |
| Thư mục cổ thư | `library-data › LIBRARY` (`name_han`, `name_vi`, `school`, `layer`), `LAYERS` | tên Hán ↔ tên Việt; sách thuộc phái nào / lớp nào |
| Lá số khách | `cases.js › buildCase(makeNpc(...))`, chấm bằng `gradeWx`, `gradeStrength`, `gradeYong`, `gradeTiming`, `gradeAnswers` | vượng / nhược, Dụng thần, năm thuận |
| Sảnh nghề | `halls.js › HALL_BUILD` (`dieuhau`, `tuvi`, `tuongphap`, `cachcuc`…), chấm `halls.js › gradeStep` | một án sảnh trong Hội thí |
| Án Cổ | `cases.js › buildClassical(id)`, `classicalList()`, `gradeClassicalStrength`, `gradeGe`; nguồn `classical-cases.js › CLASSICAL_CASES` | Đình thí |
| Điều Hậu | `cases.js › tiaohouQuote(gan, monthZhi)` | trích dẫn biện hộ |
| Đạo đức tình huống | `remedy-fate › TEN_THIEN` (mười điều thiện của Liễu Phàm) | tình huống → điều thiện phù hợp |
| Ranh giới lời khuyên | `anti-manipulation-data` (`refusalBoundaries`, RB2 «không phán mệnh đã định») | câu «sách vấn» ở Đình thí |

### 3.3 Luật chơi

**Hương thí** — Thư Lâu Lâm (`thulau`), mỗi ngày 1 lượt tính thưởng (thi lại được, tính `K_lặp`). 10 câu, 8 phút:

| Câu | Loại | Nguồn | Chấm |
|---|---|---|---|
| 1–3 | nguyên văn → nghĩa | `quoteBank` | 1 / 0 |
| 4–5 | cổ thư | `LIBRARY` | 1 / 0 |
| 6 | vượng nhất / yếu nhất | `buildCase` → `gradeWx` | 0 / 0,5 / 1 |
| 7 | thân vượng / nhược / trung hòa | `gradeStrength` (chỉ phần `verdict`, bỏ cờ) | 0 / 1 |
| 8 | Dụng thần | `gradeYong` | 0 / 0,5 / 1 |
| 9–10 | tình huống thiện | `TEN_THIEN` | 1 / 0 |

Câu 6–8 dùng **một** khách chung, hiện tứ trụ ở đầu nhóm câu.

**Hội thí** — bậc ≥ 3, mỗi tuần lịch 1 lượt tính thưởng, ở tiền sảnh Văn Miếu (`vanmieu`; người chưa mở Văn Miếu thi ở Thư Lâu). 12 phút, ba phần:

1. **Một án khách đủ 6 bước** (`STEP_ORDER`: lập trụ → ngũ hành → vượng nhược → Dụng → năm thuận → lời khuyên), chấm `gradeAnswers` — trọng số 0,5.
2. **Một án sảnh** xoay vòng theo tuần trong 6 sảnh của `HALL_BUILD` — trọng số 0,25.
3. **Bốn câu điền khuyết nguyên văn**: một câu trong `quoteBank` bị che 1–2 chữ; chọn chữ đúng trong 4 (chữ nhiễu lấy từ câu khác cùng sách) — trọng số 0,25.

**Đình thí** — bậc ≥ 4, một lượt / tháng âm (mở từ mùng 2 đến 28 âm lịch), ở Đại Thành điện Văn Miếu trước mặt Tế tửu Chu Văn Trinh (`te_tuu`). 20 phút:

1. **Án Cổ**: `buildClassical` một án trong `classicalList()` người chơi **chưa từng gặp ở Đình thí**; đủ các bước có trong `steps` (vượng nhược / cách cục / Dụng) — trọng số 0,45.
2. **Đối đáp**: Tế tửu hỏi 3 câu «Vì sao?», mỗi câu người chơi chọn **2 trong 6 thẻ dẫn chứng** (từ `cite.all` của án, `DITIANSUI_MAXIMS`, `tiaohouQuote`, câu nhiễu cùng sách). Mỗi thẻ có nhãn ẩn «ủng hộ / không liên quan / phản bác» — trọng số 0,35.
3. **Sách vấn**: một tình huống tư vấn (vd «Khách hỏi có nên bỏ việc vì sang năm phạm Thái Tuế không?»), chọn 1 trong 4 lời đáp; đáp án đúng là lời **không phán mệnh đã định, có dẫn nguyên lý, chỉ việc làm được** (RB2) — trọng số 0,20.

**Thủ khoa:** lần đầu đạt `s ≥ 0,9` ở Đình thí → +30 thô ngoài trần (`09-03` §8) và danh xưng «Tiến sĩ cập đệ». Mỗi tháng, ba người điểm cao nhất máy chủ (hòa thì ai nộp trước) nhận danh xưng tháng **Trạng nguyên / Bảng nhãn / Thám hoa** — thuần danh dự, không ĐH.

### 3.4 Thuật toán sinh đề

```
seed   = hashSeed(`khoa:${userId}:${kỳ}:${khóaKỳ}`)      // khóaKỳ: ngày (Hương) · tuần ISO (Hội) · tháng âm (Đình)
r      = rng(seed)                                          // npc.js › rng
pool   = nguồn câu − seen30                                 // seen30: vòng đệm 300 mã câu (hash nguyên văn / id án) trong 30 ngày
câu    = rút theo phân bổ cố định ở bảng trên, xáo bằng r
nhiễu:
  nghĩa      → 3 nghĩa khác **cùng sách** (khó hơn `buildThuVien` vốn lấy toàn kho)
  cổ thư     → 3 mục cùng `layer`, khác `id`
  điền khuyết→ 3 chữ Hán lấy từ câu khác cùng sách, khác chữ đúng, không trùng nhau
  Dụng thần  → đủ 5 hành (như gradeYong)
  ngũ hành   → loại phương án nằm trong ±2% của đáp án (luật «near» của gradeWx) để không có câu hai đáp án
  sách vấn   → 1 đúng + 3 lỗi mẫu: «phán chắc» · «dọa để bán» · «né, không trả lời»
khách lá số: makeNpc(`khoa:${seed}`, năm) — làm lại tối đa 8 lần nếu strength.verdict = 'trung' ở Hương thí mức Sơ (bài dễ hiểu hơn)
```

Máy chủ sinh lại cùng đề từ cùng `seed` để chấm. `seen30` lưu ở `state.tu.khoaSeen` (chưa có — cần làm).

### 3.5 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Chọn đáp án | chạm | `1`–`6` | nhấp |
| Chọn nhiều (thẻ dẫn chứng) | chạm bật / tắt | `1`–`6` bật / tắt, `Enter` nộp | nhấp |
| Ghép tứ trụ (Hội thí, bước lập trụ) | kéo chữ vào ô (như án khách hiện có) | chọn chữ `←→`, `Enter` thả vào ô kế tiếp | kéo thả |
| Đánh dấu xem lại | nút cờ | `F` | nút |
| Nộp bài | nút «Nộp quyển» | `Ctrl+Enter` | nút |

### 3.6 Bố cục giao diện

```
┌──────── Văn Miếu · Đình thí · tháng Chín âm ────────── còn 14:20 ┐
│ Phần 2/3 · Đối đáp                                          │
│ TẾ TỬU: «Án này thân nhược mà lấy Ấn làm dụng. Vì sao?»     │
│ Chọn 2 dẫn chứng:                                          │
│  [1] 滴天髓 · «…» (Cổ quyết)          [ ]                    │
│  [2] 穷通宝鉴 · Giáp tháng Dần: …     [✓]                    │
│  [3] Ngũ Ngôn Độc Bộ · …              [ ]                    │
│  [4] cite.all: «…» — nguồn: …         [✓]                    │
│  [5] …                                [ ]                    │
│  [6] …                                [ ]                    │
│ Tứ trụ án: 年 甲子 · 月 丙寅 · 日 戊辰 · 時 壬子              │
│ [⚑ xem lại]                       [Hỏi thầy ✗ — Đình thí không gợi ý] [Nộp] │
└────────────────────────────────────────────────────────────┘
```

### 3.7 Đường cong độ khó

| Mức | Hương thí | Hội thí | Đình thí |
|---|---|---|---|
| Sơ | 4 phương án; câu lá số có gợi ý «đắc lệnh?» | — (chưa mở) | — |
| Trung | nhiễu cùng sách; bỏ gợi ý | án khách bình thường; điền 1 chữ | — |
| Thâm | thêm 1 câu năm thuận (`gradeTiming`) thay 1 câu cổ thư | khách được chọn có `strength.level` sát ranh giới; điền 2 chữ | án Cổ đặc biệt (`category` 从格 / 专旺) được phép rút |
| Viên Thông | đồng hồ 6 phút (tắt được) | án sảnh Tử Vi / Tượng Pháp ưu tiên | Tế tửu hỏi thêm câu thứ 4 (trọng số đối đáp giữ 0,35, chia 4) |

Bậc: Hương thí từ bậc 1; Hội thí bậc ≥ 3; Đình thí bậc ≥ 4. Gợi ý («Hỏi thầy») chỉ có ở Hương thí, mỗi gợi ý −0,15 điểm câu (cùng luật `gradePillars(..., hints)`).

### 3.8 Chấm điểm

```
Hương:  s = Σ điểm câu / 10
Hội:    s = 0,50·gradeAnswers(case).total + 0,25·totalOf(hall, results) + 0,25·(điền đúng / 4)
Đình:   s = 0,45·(Σ bước án Cổ / số bước) + 0,35·đối + 0,20·sách
        đối = trung bình 3 câu của  (số thẻ «ủng hộ» chọn đúng / 2) − 0,25 × (số thẻ «phản bác» đã chọn), kẹp [0,1]
        sách = 1 (lời đúng) · 0,3 («né») · 0 (phán chắc / dọa bán)
```

**Ví dụ Hương thí (`MAU-A`, Thư Lâu — NH, Mộc, không hợp Dụng):** 7,4 / 10 → `s = 0,74`, `f = 0,818`, `thô = 8 × 0,818 = 6,54`; NK 80 → `K_sung 1,1`. `ĐH = 6,54 × 1,19 × 1,1 = 8,56` → **+8**. NK −10.

**Ví dụ Đình thí:** án Cổ 3/3 bước = 1; đối 0,83; sách 1 → `s = 0,45 + 0,29 + 0,20 = 0,94` → `f = 0,958`; `thô = 40 × 0,958 = 38,3` (ngoài trần). Lần đầu ≥ 0,9 → +30 thô thủ khoa. `ĐH = (38,3 + 30) × 1,19 = 81,3` → **+81**.

### 3.9 Phần thưởng

| Kỳ | B | Trong trần? | NK | Khác |
|---|---|---|---|---|
| Hương thí | 8 | có | 10 | Phúc Khí `thô × 0,5`; tính Nhật Khóa nhóm **Học** |
| Hội thí | 20 | **ngoài** trần, trong trần tuần 60 (`09-03` §5.4) | 15 | `s ≥ 0,8` → huy hiệu tuần «Cử nhân» |
| Đình thí | 40 | **ngoài** trần | 20 | thủ khoa lần đầu +30 thô; danh xưng tháng (danh dự) |
| Tu độ | — | — | — | cộng vào NH dù thi ở Thư Lâu hay Văn Miếu |

### 3.10 Trạng thái thất bại

| Trạng thái | Xử lý |
|---|---|
| `s < 0,5` | `f = 0,15`; mở «Bảng sửa bài»: từng câu sai kèm `explain` / `cite` của engine |
| Hết giờ | nộp tự động phần đã làm |
| Rời Đình thí giữa chừng | được quay lại trong 30 phút (đề giữ nguyên); quá hạn → nộp phần đã làm |

```
[CẢNH MG-03.F1 · Văn Miếu · Đại Thành điện · trưa · Đình thí chưa đạt]
TẾ TỬU: Người xưa trượt ba khoa mới đỗ là chuyện thường. Trượt mà biết mình trượt chỗ nào thì đã hơn người đỗ mà không biết vì sao đỗ.
> Lựa chọn: ① «Xin tiên sinh chỉ chỗ sai» → Bảng sửa bài  ② «Tháng sau con lại xin vào» → đóng
[CẢNH MG-03.F2 · Văn Miếu · chọn «phán chắc» ở sách vấn]
TẾ TỬU: (gấp quyển) Câu trả lời của anh khiến khách yên tâm một đêm, rồi sợ một năm. Thầy giỏi phải để khách bước ra cửa với một việc làm được, không phải với một bản án.
```

### 3.11 Trợ năng (riêng)

- Chữ Hán ≥ 22 px, mỗi câu nguyên văn có nút phát âm Hán Việt (đọc máy, tiếng Việt).
- Chế độ «không thời hạn» cho cả ba kỳ (không mất danh xưng tháng, chỉ mất huy hiệu «Không trợ lực»).
- Bước lập trụ có chế độ chọn từ danh sách thả xuống thay vì kéo thả.

### 3.12 Chống gian (riêng)

| Rủi ro | Biện pháp |
|---|---|
| Tra máy (gõ tứ trụ vào app) | đó là **học**, không cấm; nhưng đồng hồ Đình thí và việc chấm đối đáp (cần hiểu lý) khiến tra máy không đủ |
| Chia sẻ đề | đề theo hạt giống tài khoản; Đình thí không trùng án giữa bạn bè cùng tháng nếu cùng môn phái (rút từ phần kho chia theo `hash(guildId)`) |
| Bot nộp trong 20 giây | Đình thí nộp < 90 s với `s ≥ 0,9` → `mg_flag`, không trao danh xưng tháng tới khi duyệt |

### 3.13 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `mg03_question` | `run_id, exam (huong/hoi/dinh), qtype, qid_hash, correct, ms, hinted` |
| `mg03_cite` | `run_id, q_no, picked_support, picked_contra` |
| `mg03_policy` | `run_id, answer_type (dung/phan/doa/ne)` |

Dùng để dò câu «quá khó» (tỉ lệ đúng < 20% sau 500 lượt) và trả về tài liệu 13 kiểm dữ liệu engine.

### 3.14 iOS

Giữ nguyên (mọi câu lá số là của **khách NPC**, không phải của người chơi). Sách vấn bỏ đề tài «Thái Tuế của khách» thay bằng «khách hỏi có nên đổi tên con» (vẫn kiểm RB2).

### 3.15 Nghiệm thu

- [ ] Đáp án câu 6–8 trùng 100% với `gradeWx / gradeStrength / gradeYong` trên cùng NPC (test node 200 hạt giống).
- [ ] Không câu nào lặp trong 30 ngày với cùng tài khoản.
- [ ] Nhiễu cổ thư cùng `layer`; nhiễu điền khuyết là chữ Hán hợp lệ, khác chữ đúng.
- [ ] Đình thí không rút lại án Cổ đã thi.
- [ ] Hội thí / Đình thí ghi vào trần tuần / ngoài trần đúng `09-03` §5.4.
- [ ] Sách vấn: lời «phán chắc» luôn 0 điểm.

---

## 4. `MG-04` · Thái Cực Vân Thủ (nhịp)

### 4.1 Mục đích

Đi một bài quyền chậm, mềm, liền theo tiếng đàn cổ cầm — **độ liền mạch quan trọng hơn trúng nhịp**. Là pha «Thân» của Thanh Vi · Đan Đỉnh và sân tập buổi sáng của Sơn Môn. Trụ cột: T3 (văn tu — quyền để dưỡng, không để đánh), T6 (không dạy động tác như hướng dẫn tập thật; chỉ là trò vẽ cung theo nhịp).

### 4.2 Engine dạy

| Nội dung | Nguồn | Dùng |
|---|---|---|
| Đạo dẫn «導氣令和, 引體令柔» | `cultivation-data › CULTIVATION` mục `GONG_DAOYIN` | lời giảng mở đầu, đề từ trên khung tập |
| Ngũ Cầm Hí, Mã Vương Đôi Đạo Dẫn Đồ | cùng mục (`meaning`) | thẻ «Hỏi thầy» ở mức Thâm |
| Tên thức quyền | danh sách thức Thái Cực 24 thức (dữ liệu tĩnh mới, chưa có — cần làm) | tên hiển thị Hán + Hán Việt |
| Hoạt ảnh | `characters.js`, `render3d.js` (rig hiện có) — hoạt ảnh thức quyền (chưa có — cần làm) | nhân vật đi quyền theo đường người chơi vẽ |

### 4.3 Luật chơi

1. Mỗi **thức** là 1–3 cung vẽ trên **vòng Thái Cực** (đường cong chữ S trong vòng tròn âm dương làm khung).
2. Đường dẫn mờ hiện trước 1 nhịp; người chơi **kéo một đường liền** dọc theo cung, sao cho **điểm cuối chạm vào phách** của đàn.
3. Tốc độ phải đều: tăng tốc đột ngột, dừng giữa cung, giật lùi đều bị trừ «mềm».
4. Một lượt 4 phút ≈ 6–8 thức, theo thứ tự bài 24 thức; lượt sau tiếp nối từ thức đã dừng (bài quyền đi hết qua nhiều ngày ở mức Sơ / Trung).
5. Khởi thức 起勢 và thu thức 收勢 luôn có ở đầu / cuối lượt.

**Bài 24 thức (thứ tự):** 起勢 Khởi thức · 野馬分鬃 Dã mã phân tông · 白鶴亮翅 Bạch hạc lượng sí · 摟膝拗步 Lâu tất ảo bộ · 手揮琵琶 Thủ huy tỳ bà · 倒捲肱 Đảo quyển hoằng · 左攬雀尾 Tả lãm tước vĩ · 右攬雀尾 Hữu lãm tước vĩ · 單鞭 Đơn tiên · 雲手 Vân thủ · 單鞭 Đơn tiên · 高探馬 Cao thám mã · 右蹬腳 Hữu đăng cước · 雙峰貫耳 Song phong quán nhĩ · 轉身左蹬腳 Chuyển thân tả đăng cước · 左下勢獨立 Tả hạ thế độc lập · 右下勢獨立 Hữu hạ thế độc lập · 左右穿梭 Tả hữu xuyên thoa · 海底針 Hải để châm · 閃通臂 Thiểm thông tý · 轉身搬攔捶 Chuyển thân ban lan chùy · 如封似閉 Như phong tự bế · 十字手 Thập tự thủ · 收勢 Thu thức.

(Tên MG lấy «Vân Thủ» 雲手 — thức «tay mây» tròn, liền nhất, làm biểu tượng.)

**Thôi thủ đôi (MMO, mức Thâm trở lên):** hai người đứng đối diện; người **dẫn** vẽ tự do trong vòng, người **theo** phải vẽ **đường đối xứng gương** của người dẫn với độ trễ ≤ 1 nhịp. Không ai «thắng»; điểm là độ hòa hợp chung.

### 4.4 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Vẽ cung | kéo một ngón theo đường dẫn | giữ `Space` = tay đi theo cung với tốc độ chuẩn; `↑` / `↓` nhẹ nhàng nhanh / chậm 10%; nhả `Space` ở phách | kéo giữ nút trái |
| Đổi tay (thức tả / hữu) | tự động | tự động | tự động |
| Xem tên thức | chạm nhãn | `I` | rê |
| Dẫn / theo (thôi thủ) | nút chọn vai trước khi vào | `1` / `2` | nhấp |

Bàn phím được chấm **cùng thang** với chạm: «mềm» đo bằng việc không nhấp nhả và không đổi tốc liên tục.

### 4.5 Bố cục giao diện

```
┌──────── Võ Đang · Thái Hòa quảng trường · giờ Thìn ───────┐
│ 雲手 Vân thủ  (thức 10/24)            ♪ cổ cầm 54 nhịp/phút │
│                                                       │
│          ╭─────────────╮                               │
│        ╭─╯  ·  ·  ·    ╰─╮   ← đường dẫn mờ (cung S)    │
│        │   ◐ ←ngón tay   │                              │
│        ╰─╮    ·  · ●    ╭─╯   ● = phách kế tiếp          │
│          ╰─────────────╯                               │
│  mềm ▁▂▃▅▆▆▅  liền ▁▃▅▆▇▇                               │
│  [nhân vật 3D đi quyền theo nét vẽ ở nền]               │
└────────────────────────────────────────────────────────┘
```

### 4.6 Đường cong độ khó

| Mức | Nhịp (BPM) | Thức / lượt | Đường dẫn | Ngưỡng «mềm» | Khác |
|---|---|---|---|---|---|
| Sơ | 48 | 6 | đậm, hiện sớm 2 nhịp | rộng | chỉ thức 1–8 |
| Trung | 54 | 7 | mờ, sớm 1 nhịp | vừa | thức 1–16 |
| Thâm | 60 | 8 | chỉ hiện điểm đầu – cuối | hẹp | đủ 24 thức; mở thôi thủ |
| Viên Thông | 60 (đàn rubato — nhịp co giãn) | 8 | không có, theo trí nhớ thứ tự | hẹp | phải «nghe» nhịp co giãn |

### 4.7 Chấm điểm

```
mềm  = 1 − min(1, độ lệch chuẩn vận tốc dọc cung / vận tốc trung bình ÷ 0,6)   (trung bình các cung)
khớp = trung bình 1 − khoảng cách đường vẽ tới cung chuẩn / ngưỡng(28 px @1080p), kẹp [0,1]
phách= trung bình max(0, 1 − |Δt điểm cuối – phách| / 300 ms × hệ số dung sai)
s    = 0,50·mềm + 0,30·khớp + 0,20·phách           s_min = 0,4
thôi thủ: s = 0,4·mềm_dẫn&theo + 0,6·(1 − sai lệch gương chuẩn hóa)  — mỗi người nhận cùng s
```

**Ví dụ (`MAU-A` ở Võ Đang — TV, Thủy = Dụng):** mềm 0,72; khớp 0,70; phách 0,64 → `s = 0,36 + 0,21 + 0,128 = 0,698` → `f = 0,789`; `thô = 5 × 0,789 = 3,94`. NK 71 → `K_sung 1,1`. `ĐH = 3,94 × 1,19 × 1,10 × 1,10 = 5,67` → **+5**. Nếu đây là lượt thứ 4 trong ngày: `K_lặp 0,5` → `thô 1,97`, ĐH 2,8.

### 4.8 Phần thưởng

| Hạng mục | Giá trị |
|---|---|
| Thô | `5 × f(s)` |
| Phúc Khí | `round(thô × 0,5)` |
| Tu độ | TV (Võ Đang) hoặc TC (sân Sơn Môn) |
| Nhật Khóa | nhóm **Thân** |
| Thẩm mỹ | đi hết 24 thức (tích lũy) → động tác chờ «Vân thủ» cho nhân vật khi đứng yên |
| Thôi thủ | 10 lượt thôi thủ với ≥ 3 người khác nhau → khung tên «Đồng Môn Thôi Thủ» |

### 4.9 Trạng thái thất bại

| Trạng thái | Xử lý |
|---|---|
| `s < 0,4` | `f = 0,15`; nhân vật nền vẫn đi hết bài (không ngã, không hỏng) |
| Nhấc tay giữa cung | cung đó «khớp» tính phần đã vẽ, «mềm» = 0 cho cung đó |
| Mất kết nối (thôi thủ) | người còn lại chuyển sang đi một mình, không mất lượt |

```
[CẢNH MG-04.F1 · Võ Đang · Thái Hòa quảng trường · sáng sớm · lượt vội]
HUYỀN HƯ: Con vẽ như người đuổi xe. Quyền này không đi tới đâu cả, nên chẳng việc gì phải vội. Chậm đến mức thấy được mình đang chậm.
> Lựa chọn: ① «Xin đi lại thức này» → lặp thức hiện tại 1 lần (không tính lượt mới)  ② «Con ngồi nghỉ» → mở MG-01
```

### 4.10 Trợ năng (riêng)

- «Chế độ không phách»: bỏ thành phần phách, `s = 0,6·mềm + 0,4·khớp`.
- Đường dẫn rộng gấp đôi; cung có thể vẽ bằng **cần điều khiển ảo** (một vòng tròn cố định góc dưới) cho người không kéo ngón chính xác.
- Nhịp đàn kèm vòng sáng chớp ở rìa màn hình cho người khiếm thính.

### 4.11 Chống gian (riêng)

| Rủi ro | Biện pháp |
|---|---|
| Vẽ bằng script (đường hoàn hảo, vận tốc hằng) | vận tốc lệch chuẩn = 0 tuyệt đối trên ≥ 3 cung → `mg_flag` (người thật luôn > 0,03) |
| Thôi thủ hai tài khoản một người | hai tài khoản cùng IP + cùng thiết bị đầu vào → không tính khung tên, vẫn tính thô |

### 4.12 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `mg04_form_end` | `run_id, form_idx, soft, fit, beat` |
| `mg04_duo` | `run_id, role (lead/follow), mirror_err, partner_hash` |

### 4.13 iOS

Giữ nguyên.

### 4.14 Nghiệm thu

- [ ] Tên 24 thức đúng thứ tự và chữ Hán phồn thể như danh sách §4.3.
- [ ] «Mềm» chiếm trọng số lớn nhất; một lượt trúng phách 100% nhưng giật cục không vượt `s = 0,55`.
- [ ] Bàn phím đạt được `s ≥ 0,9` (kiểm bằng người chơi thử).
- [ ] Thôi thủ: hai người nhận cùng `s`.
- [ ] Lượt sau tiếp đúng thức đã dừng (lưu `state.tu.taiChiIdx`, chưa có — cần làm).

---

## 5. `MG-05` · Mạn-đà-la Cát (dựng rồi xóa)

### 5.1 Mục đích

Dựng một vòng hoa văn bằng cát màu suốt mười phút, rồi **tự tay quét sạch** và đổ cát xuống suối. Bài học **vô thường**: phần thưởng chỉ đến **sau khi xóa**. Thuộc đạo thống Mật (`MT`) — khay nhỏ ở Am Vân Cốc (phân đàn), đàn lớn ở Tạng Địa. Trụ cột: T6 — Tạng truyền **chờ tham vấn** (canon), nên chỉ dùng hoa văn hình học và hoa sen chung, **không** hình tôn tượng, không chủng tự, không bố cục mạn-đà-la nghi lễ có thật.

### 5.2 Engine dạy

| Nội dung | Nguồn | Dùng |
|---|---|---|
| Chuẩn Đề pháp môn (cách Vân Cốc dạy Liễu Phàm) | `remedy-fate › ZHUNTI` (`principle`, `how`, `fit`) | lời giảng khay nhỏ ở Am Vân Cốc: «chuyển hóa chứ không bỏ đời» |
| Kim Cương Tát Đỏa (sám) | `remedy-fate › CHAN_HUI[1]` | chế độ «tịnh hóa» (`09-03` §10.4) — **khóa** tới khi có tham vấn |
| Bảng màu ngũ hành | `progress.js › WX_GIATRI[].color` (Thanh Mộc `#58c46a`, Ly Hỏa `#ff6a3c`, Hậu Thổ `#d9a64a`, Canh Kim `#f2e6b8`, Huyền Thủy `#4f9cff`) | 5 màu cát + trắng |
| Cơ chế cát | (mới — chưa có — cần làm): lưới cực (vòng × cánh), mô phỏng hạt đơn giản | |

### 5.3 Luật chơi

**Pha 1 — Dựng (≈ 8 phút).**

1. Đàn là **lưới cực**: `R` vòng × `S` cánh. Mẫu hoa văn hiện mờ: mỗi ô có màu đích.
2. Chọn màu cát, **giữ để rót** từ ống (tốc độ rót cố định); rê để di chuyển miệng ống. Cát tràn ra ngoài ô thành «vết lem».
3. Đi từ **tâm ra ngoài** (vòng trong phải xong ≥ 80% trước khi vòng ngoài nhận cát — như cách dựng thật từ tâm).
4. Mức Sơ có **gương đối xứng tự động** (rót một cánh, các cánh khác tự lặp); mức cao tắt dần gương, người chơi tự giữ đối xứng.

**Pha 2 — Chiêm (30 giây).** Camera nâng lên nhìn toàn đàn; người chơi chỉ ngồi nhìn. Không thể bỏ qua (có nút «Đã đủ» sau 10 giây nếu bật trợ năng giảm thời gian).

**Pha 3 — Xóa (≈ 1,5 phút, bắt buộc).**

1. Quét theo **đường xoắn ốc từ ngoài vào tâm** (8 nhát quét ở khay nhỏ, 12 ở đàn lớn). Màu hòa thành một màu xám nâu.
2. Gom vào bình, mang bình (đi bộ ≤ 40 m) tới **dòng suối** sau am (Am Vân Cốc) hoặc **sông** dưới đàn (Tạng Địa) và đổ xuống.
3. **Chỉ khi đổ xong mới chấm điểm và trao thưởng.**

Bỏ dở trước khi xóa: đàn giữ nguyên «đàn chưa xả» 24 giờ, không mở được đàn mới, không có thưởng. Quá 24 giờ → gió tự xóa, lượt tính `s = 0` (không phạt thêm).

**Đàn chung (MMO, Tạng Địa, bậc 5):** 4 người, mỗi người một phần tư; pha Xóa cần **cả 4** cùng quét, một người đổ bình.

### 5.4 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Chọn màu cát | chạm hũ cát | `1`–`6` | nhấp |
| Rót cát | chạm giữ + rê | `←→↑↓` di miệng ống (bước 1 ô con), giữ `Space` rót | giữ nút trái + rê |
| Gõ nhẹ ống (rót ít) | chạm nhanh | `Space` gõ | nhấp nhanh |
| Xoay đàn | hai nút xoay ở cạnh | `Q` / `E` | bánh xe |
| Quét (pha Xóa) | kéo theo vệt xoắn | giữ `Space`, hệ thống dắt theo xoắn | kéo |
| Đổ bình | đi tới suối, chạm «Đổ» | `Enter` | nhấp |

### 5.5 Bố cục giao diện

```
┌──────────── Am Vân Cốc · khay cát · chiều ────────────┐
│ Pha 1/3 · Dựng     vòng 2/3      gương: BẬT    08:10  │
│                                                     │
│              ·  ·  ✿  ·  ·                          │
│           ·   ◇ ◆ ◇ ◆ ◇   ·     ← mẫu mờ / cát đã rót │
│          ✿   ◆  (●)  ◆   ✿     (●) = tâm             │
│           ·   ◇ ◆ ◇ ◆ ◇   ·                         │
│              ·  ·  ✿  ·  ·                          │
│                                                     │
│ Hũ: [木▲][火◆][土■][金●][水〰][白]   đối xứng ▃▅▆▇    │
│ VÂN CỐC: «Rót chậm thôi. Cát không đi đâu mất.»      │
└─────────────────────────────────────────────────────┘
```

### 5.6 Đường cong độ khó

| Mức / nơi | Lưới (vòng × cánh) | Gương | Mẫu | Thời gian dựng gợi ý |
|---|---|---|---|---|
| Sơ (khay nhỏ Am Vân Cốc, bậc 3) | 3 × 4 | tự động mọi cánh | hình học đơn (hình thoi, vòng tròn) | 6 phút |
| Trung | 4 × 6 | tự động **nửa** đàn (người chơi làm nửa còn lại) | thêm cánh sen | 7 phút |
| Thâm (đàn lớn Tạng Địa, bậc 5) | 5 × 8 | tắt | sen nhiều lớp + viền sóng nước | 8 phút |
| Viên Thông | 5 × 8 | tắt | mẫu chỉ hiện 5 s đầu, sau đó dựng theo trí nhớ | 8 phút |

### 5.7 Chấm điểm

```
phủ    = số ô đúng màu (≥ 70% diện tích ô) / tổng ô
đốiXứng= 1 − trung bình |màu ô(i, cánh k) ≠ màu ô(i, cánh 0)| trên mọi cánh   (mức có gương tự động: = 1)
gọn    = 1 − min(1, cát lem ngoài ô / tổng cát rót ÷ 0,25)
xóa    = 1 nếu quét đúng chiều ngoài → trong và đổ xuống nước; 0,6 nếu quét sai chiều (vẫn xong)
s = 0,45·phủ + 0,25·đốiXứng + 0,15·gọn + 0,15·xóa          s_min = 0,5
```

**Ví dụ (`MAU-A` ở Tạng Địa — MT, Thổ, không hợp Dụng / Hỷ):** phủ 0,84; đối xứng 0,78; gọn 0,70; xóa 1 → `s = 0,378 + 0,195 + 0,105 + 0,15 = 0,828` → `f = 0,880`; `thô = 10 × 0,880 = 8,8`. NK 55 → `K_sung 1`. `ĐH = 8,8 × 1,19 = 10,5` → **+10**. NK −10.

### 5.8 Phần thưởng

| Hạng mục | Giá trị |
|---|---|
| Thô | `10 × f(s)`, trao sau khi đổ bình |
| Phúc Khí | `round(thô × 0,5)` |
| Tu độ | MT |
| Ảnh lưu | **một** ảnh chụp đàn trước khi xóa được lưu vào «Sổ Vô Thường» (album riêng); ảnh mờ dần qua 7 ngày rồi chỉ còn khung — vô thường ngay cả trong album |
| Đàn chung | +2 công cho mỗi người khi 4 người cùng hoàn thành pha Xóa |

### 5.9 Trạng thái thất bại

| Trạng thái | Xử lý |
|---|---|
| `s < 0,5` | `f = 0,15`, vẫn phải xóa mới nhận |
| Bỏ dở trước xóa | đàn chưa xả 24 giờ; không thưởng |
| Hắt đổ cát (rót > 25% ra ngoài) | không phạt thêm ngoài điểm «gọn»; NPC nói câu dưới |

```
[CẢNH MG-05.F1 · Am Vân Cốc · khay cát · chiều · người chơi định rời đi trước khi xóa]
VÂN CỐC: Đẹp nhỉ. Con muốn giữ nó lại? (ngừng) Liễu Phàm năm xưa cũng muốn giữ cái số người ta đoán cho mình. Giữ lâu quá thành ra không sống.
> Lựa chọn: ① «Con xóa đây» → pha Xóa  ② «Để con ngắm thêm» → giữ đàn (24 giờ)
[CẢNH MG-05.F2 · Tạng Địa · bờ sông · sau khi đổ bình]
LAMA ĐA KIỆT: (chắp tay, im lặng một lúc) Nước mang đi rồi. Cũng chẳng mất gì cả.
```

(Lời Lạt-ma Đa Kiệt là bản tạm; mọi thoại của `lama_dakiet` **chờ tham vấn** theo canon.)

### 5.10 Trợ năng (riêng)

- «Rót theo ô»: chạm một ô là rót đầy ô đó bằng màu đang chọn (không cần rê chính xác); «gọn» tự đạt 1. Không giảm thưởng.
- Pha Chiêm rút còn 10 s và pha Xóa có chế độ «quét dắt» (giữ một nút, hệ thống quét).
- Mẫu màu luôn kèm ký hiệu hình trên từng ô (§13.3 `09-03`).

### 5.11 Chống gian (riêng)

| Rủi ro | Biện pháp |
|---|---|
| Bỏ qua pha Xóa bằng sửa client | máy chủ chỉ trao thô khi nhận sự kiện «đổ bình» có vị trí nhân vật trong vùng suối / sông (kiểm tọa độ máy chủ) |
| Tô tự động bằng script | thời gian dựng < 90 s cho lưới 5 × 8 → `mg_flag` |

### 5.12 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `mg05_ring_done` | `run_id, ring, coverage, spill` |
| `mg05_leave_unerased` | `run_id, coverage` — tỉ lệ người «không nỡ xóa» là chỉ số thiết kế đáng xem |
| `mg05_pour` | `run_id, erase_order_ok, walk_s` |

### 5.13 iOS

Giữ nguyên.

### 5.14 Nghiệm thu

- [ ] Không có thưởng nào trước sự kiện «đổ bình».
- [ ] Bộ mẫu chỉ gồm hình học và sen; có biên bản rà của người tham vấn văn hóa trước khi mở Tạng Địa.
- [ ] Chế độ «tịnh hóa» (Kim Cương Tát Đỏa) tắt bằng cờ cho tới khi có tham vấn.
- [ ] Màu 5 hũ đúng mã màu `WX_GIATRI`.
- [ ] Đàn chung cần đủ 4 người quét mới cho đổ bình.
- [ ] Ảnh «Sổ Vô Thường» mờ dần trong 7 ngày.

---

## 6. `MG-06` · Tụng Kinh · Lạy Nhịp

### 6.1 Mục đích

Tụng một đoạn kinh ngắn theo tiếng mõ và lạy chậm — **kính cẩn trước, đúng nhịp sau**. Là khóa lễ sớm tối của mọi đạo tràng (Sơn Môn chính điện, Chung Nam, Bút Tháp, Yên Tử) và là đường **sám hối** chính (`09-03` §10.4). Trụ cột: T6 (tôn trọng tín ngưỡng: không combo, không «PERFECT», không hiệu ứng lòe), T5 (đúng kinh theo việc của `JING_ZHOU`).

### 6.2 Engine dạy

| Nội dung | Nguồn | Dùng |
|---|---|---|
| Kinh theo việc (7 vấn đề → kinh / chú) | `remedy-fate › JING_ZHOU` (`problem`, `cure`, `method`) | chế độ «Tụng cho khách»: chọn kinh hợp vấn đề của NPC |
| Năm pháp sám | `remedy-fate › CHAN_HUI`, `CHANHUI_PRINCIPLE` (phát lộ – hối cải – hồi hướng) | chế độ Sám hối, ba pha trong lượt |
| Thanh Tĩnh Kinh | `remedy-fate › DAO_JIA[0]`; `cultivation-data` mục `DAN_QINGJING_JING` (`textual_certainty: 'partial'`) | Tảo khóa / Vãn khóa ở Sơn Môn và Chung Nam |
| Mười điều thiện | `remedy-fate › TEN_THIEN` | câu hồi hướng cuối lượt (chọn một điều nguyện làm hôm nay) |
| Tiếng mõ / chuông | âm thanh (tài liệu 12 đặt mã `SFX-*`) | |

**Quy tắc trích dẫn:** chỉ hiện **cụm ngắn** (≤ 12 chữ Hán / dòng, tối đa 6 dòng / lượt), kèm nhãn độ chắc văn bản lấy từ trường `textual_certainty` của mục `library-data` tương ứng («chắc» / «một phần — cần đối chiếu»). Câu nào app chưa xác minh nguyên văn thì hiện **danh hiệu / tên kinh**, không hiện nguyên văn.

### 6.3 Luật chơi

**Tụng (pha chính).** Dòng kinh chạy chậm; mỗi chữ (hoặc mỗi danh hiệu ở Bút Tháp) ứng một tiếng mõ. Người chơi **gõ mõ** đúng nhịp. Nhịp chậm (52–72 BPM). Gõ thừa giữa nhịp, gõ dồn, bỏ nhịp đều làm giảm «tâm định».

**Lạy.** Xen giữa các đoạn tụng (mỗi 8 nhịp ở Bút Tháp, mỗi đoạn ở đạo quán):
1. **Nhấn giữ** → nhân vật cúi xuống chậm (3 s).
2. **Giữ yên** ở dưới (2 s).
3. **Nhả** → đứng lên (3 s).
Nhả sớm hơn 2,5 s sau khi chạm đất = «vội» (trừ tâm định). Không có thưởng cho lạy nhanh.

**Tâm định (ẩn).** Một thước đo **không hiển thị số**, chỉ thể hiện bằng ánh nến: nến cháy đứng khi tâm định cao, chao khi thấp. Khởi đầu 0,7; mỗi nhịp đúng +0,01; gõ thừa −0,04; bỏ nhịp −0,03; lạy vội −0,08; rời app −0,1. Kẹp [0,1].

**Ba chế độ:**

| Chế độ | Khung giờ (giờ địa phương) | Nơi | Nội dung |
|---|---|---|---|
| Tảo khóa | 05:00–09:00 | mọi điện | Đạo quán: cụm câu Thanh Tĩnh Kinh; chùa: danh hiệu Phật / Bồ Tát; 3 lạy |
| Vãn khóa | 17:00–21:00 | mọi điện | như trên, đoạn khác; 3 lạy |
| Sám hối | bất kỳ, khi có lỗi chưa sám (`09-03` §10.2) | Bút Tháp (sám chung 88 Phật), Chung Nam (Thanh Tĩnh Kinh) | 3 pha theo `CHANHUI_PRINCIPLE`: **Phát lộ** (chọn đúng lỗi mình đã phạm trong danh sách) → **Tụng + 12 lạy** → **Hồi hướng** (chọn 1 điều trong `TEN_THIEN`) |
| Tụng cho khách | bất kỳ | Bút Tháp, Yên Tử | NPC kể nỗi khổ; người chơi chọn kinh theo `JING_ZHOU` rồi tụng |

Ngoài khung giờ Tảo / Vãn khóa vẫn tụng được ở chế độ «Tự tụng» (cùng luật, cùng thưởng) — khung giờ chỉ thêm lời NPC và không khí, **không** thêm thưởng (tránh ép dậy sớm).

**Tụng cho khách — bảng đáp án (rút gọn từ `JING_ZHOU`):**

| Nỗi khổ của khách | Kinh / chú đúng | Phương án nhiễu |
|---|---|---|
| Bệnh, tai nạn | Dược Sư | Kim Cương; Lăng Nghiêm |
| Nghiệp nặng, tổ tiên | Địa Tạng | Phổ Môn; Chuẩn Đề |
| Chấp trước, cầu trí tuệ | Kim Cương | Dược Sư; Địa Tạng |
| Tai nạn cấp | Phổ Môn | Lăng Nghiêm; Kim Cương |
| Nghèo, phúc mỏng | Chuẩn Đề + bố thí | Phổ Môn; Dược Sư |

(Mục «ma chướng» dẫn tới Lăng Nghiêm và mục «cầu con» chỉ dùng ở mức Thâm, có thoại do tài liệu 06 duyệt.) Kèm luật bắt buộc: lời kết của NPC luôn nhắc **phần việc của khách** (theo trường `method`, vd «hồi hướng chúng sinh ly bệnh», «bố thí»), không hứa kết quả.

### 6.4 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Gõ mõ | chạm vùng mõ (nửa dưới màn hình) | `Space` hoặc `J` | nhấp trái |
| Lạy | chạm giữ biểu tượng bồ đoàn | giữ `K` | giữ nút phải (hoặc giữ trái trên bồ đoàn) |
| Chọn kinh / lỗi / điều thiện | chạm thẻ | `1`–`6` | nhấp |
| Thỉnh chuông kết | chạm chuông | `Enter` | nhấp |

### 6.5 Bố cục giao diện

```
┌──────────── Bút Tháp · chính điện · Vãn khóa ────────────┐
│                                                        │
│        南 無 阿 彌 陀 佛                                 │
│        Nam mô A Di Đà Phật   (danh hiệu · chắc chắn)     │
│              ▲ chữ đang tụng sáng dần                   │
│                                                        │
│      🕯  (nến — đứng / chao theo tâm định)               │
│                                                        │
│   [ bồ đoàn: giữ để lạy ]            [ mõ: gõ ]          │
│ NI SƯ DIỆU ÂM: «Chậm thôi con. Phật không đi đâu.»       │
└────────────────────────────────────────────────────────┘
```

Không có điểm, combo, thanh máu. Kết lượt chỉ hiện: «Đã tụng 5 phút · 3 lạy · khí đều» và số thô nhỏ ở góc.

### 6.6 Đường cong độ khó

| Mức | BPM | Biến tấu nhịp | Lạy / lượt | Văn bản |
|---|---|---|---|---|
| Sơ | 60 | không | 3 | danh hiệu ngắn lặp lại |
| Trung | 56 | mõ chuyển nhịp chậm dần cuối đoạn | 3 | cụm câu kinh, có Hán Việt |
| Thâm | 52 | «nhịp thở»: mõ ngừng 1 nhịp sau mỗi câu — phải nghe để không gõ thừa | 6 | chỉ chữ Hán, Hán Việt hiện khi chạm |
| Viên Thông | 52–72 dao động theo người chủ lễ (MMO) | theo người chủ lễ | 9 | tụng tập thể: nhịp do người cảnh giới cao nhất trong phòng dẫn |

### 6.7 Chấm điểm

```
nhịp   = trung bình max(0, 1 − |Δt| / 250 ms) trên các nhịp (gõ thừa tính như một nhịp 0)
lạy    = trung bình mỗi lạy: 1 nếu cúi ≥ 2,5 s và giữ ≥ 1,5 s, giảm tuyến tính tới 0 khi vội một nửa
định   = tâm định cuối lượt
s = 0,35·nhịp + 0,25·lạy + 0,40·định                  s_min = 0,4
Tụng cho khách: chọn kinh đúng → ×1; nhiễu → s × 0,6 (vẫn tụng, NPC giải thích kinh đúng)
Sám hối: chọn sai lỗi ở pha Phát lộ → lượt vẫn tính thô nhưng không khôi phục ĐH (09-03 §10.4)
```

**Ví dụ (`MAU-A`, Vãn khóa ở Bút Tháp — TD, Kim = Hỷ → `K_dụng 1,05`):** nhịp 0,86; lạy 0,9; định 0,88 → `s = 0,301 + 0,225 + 0,352 = 0,878` → `f = 0,915`; `thô = 6 × 0,915 = 5,49`. NK 40 → `K_sung 1`. `ĐH = 5,49 × 1,19 × 1,05 = 6,86` → **+6**. NK −5.
**Sám hối:** nếu `MAU-A` trước đó bị −5 ĐH do lời khuyên «dọa để bán bùa» và phát lộ đúng lỗi ở Bút Tháp (sám chung 88 Phật) → khôi phục 50% = +2,5 ĐH, cộng thô của lượt.

### 6.8 Phần thưởng

| Hạng mục | Giá trị |
|---|---|
| Thô | `6 × f(s)` |
| Phúc Khí | `round(thô × 0,5)` |
| Tu độ | TD / TC / TH theo nơi tụng (Sơn Môn chính điện = TC) |
| Nhật Khóa | nhóm **Lễ** |
| Công | «Tụng cho khách» chọn đúng kinh: +1 công (đọc / sao kinh trong `CONG_QUA.thien`) |
| Khôi phục | chế độ Sám hối theo `09-03` §10.4 |
| Thành tựu | «Mười tám buổi khóa» (đủ 9 Tảo + 9 Vãn khóa trong khung giờ — tính tổng, không cần liên tục) |

### 6.9 Trạng thái thất bại

| Trạng thái | Xử lý |
|---|---|
| `s < 0,4` | `f = 0,15`; nến vẫn sáng, không có hiệu ứng «tắt nến» |
| Gõ dồn liên tục (≥ 6 lần / 2 s) | mõ «nghẹn» 3 giây (không kêu), NPC nhắc khẽ |
| Lạy vội 3 lần liền | nhân vật tự dừng ở tư thế quỳ, chờ người chơi giữ yên 3 s |

```
[CẢNH MG-06.F1 · Bút Tháp · chính điện · tối · tụng vội]
DIỆU ÂM: (đặt tay lên mõ) Con gõ như người đếm tiền. Mỗi tiếng mõ là một lần nhớ ra mình đang ở đây. Nhớ mà vội thì lại quên.
> Lựa chọn: ① «Xin ni sư gõ trước, con theo» → 8 nhịp mẫu rồi tiếp lượt  ② «Con xin nghỉ» → đóng
[CẢNH MG-06.F2 · Chung Nam · Trùng Dương Cung · sáng · sám hối, phát lộ sai lỗi]
KHÂU ĐẠO TRƯỞNG: Sám mà nói tránh đi thì là kể chuyện, không phải sám. Lỗi nào thì gọi đúng tên lỗi ấy.
```

### 6.10 Trợ năng (riêng)

- «Mõ tự gõ»: hệ thống gõ, người chơi chỉ lạy — thành phần nhịp = 1, không giảm thưởng.
- Lạy bằng một nút bấm hai lần (xuống / lên) thay vì giữ, khung thời gian hiện vòng đếm.
- Chữ kinh cỡ 28 px; chế độ đọc màn hình đọc Hán Việt từng dòng.
- Nến (tâm định) kèm mô tả chữ cho người khiếm thị: «nến đứng» / «nến hơi chao».

### 6.11 Chống gian (riêng)

| Rủi ro | Biện pháp |
|---|---|
| Macro gõ mõ | độ lệch chuẩn Δt < 6 ms trên 40 nhịp → `mg_flag` |
| Lặp chế độ Sám hối để «nhân» khôi phục | mỗi lỗi chỉ khôi phục một lần (máy chủ khóa theo mã lỗi) |
| Ngắt app để né trừ tâm định | rời app vẫn −0,1 và tạm dừng; quay lại trong 10 phút tiếp tục |

### 6.12 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `mg06_mode` | `run_id, mode (tao/van/samhoi/khach/tu), in_window (bool)` |
| `mg06_bow` | `run_id, down_ms, hold_ms, rushed` |
| `mg06_sutra_pick` | `run_id, problem_idx, correct` |
| `mg06_confess` | `run_id, fault_correct (bool)` — không ghi nội dung lỗi |

### 6.13 iOS

Giữ nguyên, kể cả Sám hối (là tu tâm, không phải bói). «Tụng cho khách» bỏ dòng «cầu con» và «nghèo, phúc mỏng» (dễ đọc thành «làm lễ để được») — thay bằng «khách mất ngủ vì lo» → Kim Cương / Thanh Tĩnh Kinh.

### 6.14 Nghiệm thu

- [ ] Không có chữ «PERFECT», combo, số điểm lớn, rung màn hình khi tụng.
- [ ] Lạy nhanh hơn chuẩn không bao giờ cho điểm cao hơn lạy chậm.
- [ ] Bảng «Tụng cho khách» khớp `JING_ZHOU` (test đối chiếu chuỗi `problem` / `cure`).
- [ ] Mọi dòng nguyên văn ≤ 12 chữ Hán và có nhãn độ chắc lấy từ `textual_certainty`.
- [ ] Ngoài khung giờ tụng vẫn nhận thưởng như trong khung giờ.
- [ ] Sám hối khôi phục đúng tỉ lệ `09-03` §10.4 và chỉ một lần mỗi lỗi.
- [ ] Người tham vấn Phật giáo và Đạo giáo duyệt văn bản hiển thị trước khi mở bản công khai.

---

## 7. Tóm tắt số liệu sáu game (đối chiếu `09-03` §6)

| Mã | B (thô / lượt) | NK | `s_min` | Thô điển hình (`s` = 0,8) | ĐH điển hình `MAU-A` (nơi hợp nhất) | Phút | Thô / phút |
|---|---|---|---|---|---|---|---|
| `MG-01` | 1 / phút, ≤ 15 | +2 / phút | 0,4 | 12,9 (15 phút) | 16,9 (Võ Đang) | 15 | 0,86 |
| `MG-02` | 6 | −8 | 0,5 | 5,2 | 6,5 (Mao Sơn) | 4 | 1,29 |
| `MG-03` Hương | 8 | −10 | 0,5 | 6,9 | 8,2 (Thư Lâu) | 8 | 0,86 |
| `MG-04` | 5 | −6 | 0,4 | 4,3 | 5,6 (Võ Đang) | 4 | 1,08 |
| `MG-05` | 10 | −10 | 0,5 | 8,6 | 10,2 (Tạng Địa) | 10 | 0,86 |
| `MG-06` | 6 | −5 | 0,4 | 5,2 | 6,5 (Bút Tháp) | 5 | 1,03 |

Nhịp ≈ 1 thô / phút khớp mục tiêu `09-03` §6. `MG-02` hơi cao vì có ngã rẽ phạm giới và yêu cầu bậc 2 — chấp nhận; nếu đo lường cho thấy người chơi chỉ cày `MG-02`, giảm B xuống 5.
