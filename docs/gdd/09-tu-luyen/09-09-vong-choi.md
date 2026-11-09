# 09-09 · Vòng chơi — phiên, ngày, tuần, tháng âm, mùa; Nhật Khóa, chuỗi ngày và Nguyên Khí

> Mở rộng bản sơ đồ tổng §9.2. Số thưởng theo `09-03`; hoạt động theo `09-08`; nhịp lên bậc thực tế theo `09-10`.
> Tinh thần: **«Ghé quán … Không ai giục»** (`features.js › TEXT.gateLead`). Vòng chơi phải làm người chơi muốn quay lại vì **thích**, không vì sợ mất.

---

## 1. Năm tầng vòng chơi

```
MÙA (năm can chi, Lập Xuân → Lập Xuân)
 └─ 24 tiết khí (≈ 15 ngày) — đổi vị thuốc, đổi lễ, đổi cảnh
     └─ THÁNG ÂM (Sóc → Hối)
         └─ TUẦN (thứ Hai → Chủ nhật) — lễ tuần theo can chi ngày
             └─ NGÀY (00:00 → 00:00 giờ tài khoản) — Nhật Khóa, trần ngày, Dư Hương
                 └─ PHIÊN (15–30 phút) — vào quán → việc → nghỉ → ra
```

| Tầng | Câu hỏi người chơi tự hỏi | Thứ kéo người chơi quay lại | Thứ **không** dùng |
|---|---|---|---|
| Phiên | «Hôm nay làm gì?» | một khách đang chờ, một chén trà, một việc dở của độ kiếp | đồng hồ đếm ngược ép mua |
| Ngày | «Đã đủ Nhật Khóa chưa?» | Nhật Khóa, chuông sáng / trống chiều, Dư Hương sáng mai | phạt mất chuỗi nặng |
| Tuần | «Lễ tuần của đạo mình là hôm nào?» | lễ tuần, Hội thí, chương Mệnh Đồ, đồng tu | nhiệm vụ tuần hết hạn mất thưởng lớn |
| Tháng âm | «Rằm này có gì?» | Sóc, Vọng, Đình thí, Thiên Bảng chốt | — |
| Mùa | «Năm mới niên chủ là ai, mùa này hái gì?» | niên chủ Thái Tuế mới, tiết khí, lễ tiết, Đạo Lộ mùa (tài liệu 11) | xóa cảnh giới theo mùa |

---

## 2. Phiên chơi (15–30 phút)

### 2.1 Cấu trúc chung

```
[Vào] cổng Sơn Môn / nơi đứng lần trước
  │  Lão Tùng chào (1 câu, theo giờ thật và tiết khí)
  │  thư báo: khách đang chờ · lễ tuần sắp tới · Dư Hương đã nhận · độ kiếp sẵn sàng
  ▼
[Việc chính] 1–2 hoạt động «nặng» (án khách, MG nhóm Học / Nghệ / Hạnh)
  ▼
[Nghỉ] 1 hoạt động hồi Nguyên Khí (pha trà, tĩnh tọa, ăn chay, nghe chuông)
  ▼
[Việc phụ] 1 hoạt động nhẹ (hái thuốc trên đường, đèn, chuông)
  ▼
[Ra] Sổ Tu tóm tắt phiên: thô, ĐH, Nhật Khóa, việc mai
     câu tiễn của Lão Tùng (không có «đừng đi!», không có thưởng nếu ở lại thêm)
```

### 2.2 Phiên mẫu A — người mới, bậc 1, ngày thứ hai (20 phút)

Người chơi `MAU-A` (NT 1,19, Dụng Thủy). Đầu phiên Nguyên Khí 100. Chưa vào đạo thống (mọi nơi trung lập → `K_dụng = 1`).

| Phút | Việc | Mã | Thô (trong trần) | Ngoài trần | NK | Ghi chú |
|---|---|---|---|---|---|---|
| 0:00 | vào cổng, điểm danh Tàng Y Các | `ACT-013` | — | — | 100 | Ngọc 15 (ngày 2) |
| 0:01 | xem Bảng Lịch | `ACT-005` | 0 | — | 100 | PK 2 |
| 0:02 | thắp nhang | `ACT-003` | 1,0 | — | 100 | PK 5 · nhóm Lễ |
| 0:04 | giải án khách 1 (`total` 0,72) | `ACT-001` | `5 × 0,804` = 4,0 | — | 96 | PK 11 · nhóm Hạnh |
| 0:11 | pha trà Trà Sen (`s` 0,85) | `MG-14` | `4 × 0,895` = 3,6 | — | 100 (+10, chặn 100) | nhóm Tĩnh → **Nhật Khóa đủ 3 nhóm** |
| 0:14 | — | `ACT-011` | — | 6,0 | — | Nhật Khóa (chuỗi 1 ngày) |
| 0:15 | Thái Cực ở sân (`s` 0,70) | `MG-04` | `5 × 0,79` = 4,0 | — | 94 | nhóm Thân |
| 0:19 | ra quán | — | **12,6** | **6,0** | 94 | |

ĐH phiên: `(12,6 + 6,0) × 1,19 = 22,1`. Phúc Khí ≈ 2 + 5 + 11 + 2 + 2 = 22 (+ 5 Tam Sự nếu đủ lịch, hương, án). Ngày đầu (Mở đầu) cốt truyện cho thêm 40 thô → sau hai ngày như vậy `MAU-A` có ĐCG ≈ `16,4 + (40 + 2 × 18,6) × 1,19 = 108` → **đủ bậc 2** (D1), sẵn sàng `ACT-K2-*`.

### 2.3 Phiên mẫu B — bậc 3, chủ tu Võ Đang (30 phút)

`MAU-A` chủ tu `TV` (Thủy = Dụng → `K_dụng = 1,10`), NK đầu phiên 82 (Sung Mãn).

| Phút | Việc | Mã | Thô | Hệ số ngoài NT | NK sau |
|---|---|---|---|---|---|
| 0:00 | ngự kiếm từ Sơn Môn tới Võ Đang (≈ 90 giây) | — | — | — | 82 |
| 0:02 | hái 3 vị trên đường lên núi | `MG-13` | 3 × 1 = 3,0 | ×1,10 (TV) × 1,10 (Sung) | 79 |
| 0:06 | tĩnh tọa Tử Tiêu 10 phút (`s` 0,82) | `MG-01` | `10 × 0,874` = 8,7 | ×1,10 × 1,10 (Sung) | 99 (+20) |
| 0:17 | luyện đan Dưỡng Nguyên (`s` 0,83) | `MG-15` | `9 × 0,881` = 7,9 | ×1,10 × 1,10 | 87 |
| 0:28 | ghi Công Quá Cách | `ACT-071` | 2 × 0,86 = 1,7 | ×1,0 (trung lập) | 87 |
| 0:30 | ra | | **21,3** (trần bậc 3 = 32) | | |

ĐH phiên ≈ `3,0×1,19×1,21 + 8,7×1,19×1,21 + 7,9×1,19×1,21 + 1,7×1,19×1,10` = `4,3 + 12,5 + 11,4 + 2,2` = **30,4** (mọi lượt đều bắt đầu ở Sung Mãn; `ACT-071` trung lập nên chỉ có `K_sung`). Nhật Khóa (Thân, Tĩnh, Nghệ) → +6 thô ngoài trần → +7,1 ĐH (Nhật Khóa không có đạo thống nên không nhân `K_dụng`).

### 2.4 Phiên mẫu C — bậc 6, ngày Rằm (30 phút)

| Phút | Việc | Mã | Ghi chú |
|---|---|---|---|
| 0:00 | đằng vân lên Côn Lôn | — | 300 m |
| 0:02 | tĩnh tọa bên Thiên Trì 10 phút | `ACT-110` / `MG-01` | NK +3 / phút |
| 0:13 | soi Mệnh Đồ (tuần này chưa soi) | `ACT-111` | xem đệ tử nào chậm |
| 0:16 | bay về Sơn Môn, chủ lễ Vọng giờ Tuất | `ACT-112`, `ACT-046` | 5 công + 15 thô ngoài trần |
| 0:28 | mời trà một người mới bậc 1 | `ACT-116` | 1 công |

Ở bậc 6, phiên chủ yếu là **trao lại** (chủ lễ, dạy, mời trà) — đúng bước «hóa» (`09-02` §6).

### 2.5 Kết thúc phiên tử tế

| Quy tắc | Cụ thể |
|---|---|
| Không giữ chân | không có hộp thoại «Bạn chắc chắn muốn rời?» trừ khi đang giữa độ kiếp |
| Tóm tắt ngắn | 3 dòng: tu được gì, Nhật Khóa, một gợi ý cho lần sau (không phải mệnh lệnh) |
| Nhắc nghỉ | phiên dài 45 phút liên tục → Lão Tùng mời trà (tắt được, `09-03` §13.3) |
| Đêm khuya | từ giờ Tý (23:00) → giờ Dần (03:00) giờ tài khoản: NPC chúc ngủ ngon, Nguyên Khí hồi chậm (§5.3); không khóa gì |

---

## 3. Ngày — Nhật Khóa và tích hợp ba việc cũ

### 3.1 Nhật Khóa (`ACT-011`)

**Luật:** trong ngày, hoàn thành ít nhất **3 việc thuộc 3 nhóm pháp môn khác nhau** (Tĩnh · Thân · Học · Nghệ · Lễ · Hạnh — nhóm của từng MG ở `09-03` §6, của từng ACT ở `09-08`). Mỗi việc phải đạt mức tối thiểu của MG đó (`s ≥ s_min`, hoặc hoàn thành với MG không có ngưỡng).

**Thưởng:** `6 + min(4, ⌊chuỗi/7⌋)` thô ngoài trần (`09-03` §14 `NHAT_KHOA`).

| Chuỗi (ngày) | Thô Nhật Khóa |
|---|---|
| 1–6 | 6 |
| 7–13 | 7 |
| 14–20 | 8 |
| 21–27 | 9 |
| ≥ 28 | 10 |

**Giao diện:** ba ô tròn trong Sổ Tu và trên góc màn hình; mỗi ô sáng màu nhóm khi xong. Không chọn trước nhóm — ô tự điền theo việc người chơi làm (không bắt «hôm nay phải học»).

**Gợi ý thông minh:** khi đã có 2 nhóm, Sổ Tu gợi ý **một** hoạt động gần nhất (theo vị trí) thuộc nhóm còn thiếu. Gợi ý có thể tắt.

### 3.2 Ba việc cũ (Tam Sự — `ACT-012`)

`state.js › tasks()` hiện có ba việc: xem lịch, thắp nhang (iOS: đốt trầm), giải một án. Giữ nguyên để người chơi cũ không mất thói quen; thưởng 5 Phúc Khí như cũ. Quan hệ với Nhật Khóa:

| | Tam Sự (cũ) | Nhật Khóa (mới) |
|---|---|---|
| Nội dung | 3 việc cố định | 3 nhóm tùy chọn |
| Thưởng | 5 Phúc Khí | 6–10 thô (Đạo Hạnh) |
| Ai thấy | mọi người (cả người không tu) | từ bậc 1 khi đã mở Sổ Tu (sau cảnh Mở đầu) |
| Chồng nhau | thắp nhang = nhóm Lễ, giải án = nhóm Hạnh → làm Tam Sự đã đủ 2/3 Nhật Khóa | |

### 3.3 Chuỗi ngày «mềm»

Hiện `settleTasks` nối chuỗi khi đủ Tam Sự; lỡ một ngày là về 1 (`streak.count = lastDate === prevDay(t) ? count + 1 : 1`). Đề xuất (chưa có — cần làm) gộp và làm mềm:

**Ngày tính chuỗi** = ngày đủ Tam Sự **hoặc** đủ Nhật Khóa.

```
khi một ngày N được tính:
  gap = số ngày lịch giữa lastDate và N, trừ 1        (0 = liền)
  nếu gap == 0:                      count += 1
  nếu gap == 1 và nghỉ7 còn:          count += 1; nghỉ7 = false     ← 1 ngày nghỉ miễn phí mỗi 7 ngày tính
  nếu gap ≥ 1 (không còn nghỉ7):      count = max(1, floor(count / 2)) + 1
  mỗi khi count chia hết cho 7:       nghỉ7 = true
  lastDate = N
```

| Tình huống | Chuỗi cũ (code hiện tại) | Chuỗi mềm |
|---|---|---|
| 20 ngày liền, nghỉ 1, chơi tiếp | về 1 | 21 (dùng ngày nghỉ miễn phí) |
| 20 ngày liền, nghỉ 3, chơi tiếp | về 1 | `floor(20/2) + 1` = 11 |
| 60 ngày liền, nghỉ 10 ngày (đi viện, đi xa) | về 1 | 31 |

Vì thưởng chuỗi tối đa chỉ +4 thô / ngày, chuỗi mềm không phá cân bằng; nó chỉ bỏ cảm giác «mất trắng». Thành tựu cũ `streak3`, `streak7` đọc `streak.count` nên vẫn chạy.

### 3.4 Mốc trong ngày (giờ thật)

| Canh giờ | Giờ | Sự kiện trong game | Hoạt động gợi ý | Nguồn |
|---|---|---|---|---|
| Mão | 05–07 | chuông sáng (khung lễ tới hết giờ Thìn) | `MG-17`, Tảo khóa `MG-06` | `MERIDIAN_CLOCK.卯` (đại trường) |
| Thìn | 07–09 | Dư Hương chuyển (thực ra ngay 00:00, nhưng làn hương hiện ở lư hương nhà riêng khi người chơi ghé sáng) | ăn chay `ACT-016` | `MERIDIAN_CLOCK.辰` (vị — «ăn sáng đầy đủ») |
| Tỵ | 09–11 | hái lá (`MG-13`) | học (`MG-03`, sảnh nghề) | `MERIDIAN_CLOCK.巳` (tỳ — làm việc hiệu quả) |
| Ngọ | 11–13 | trưa: NPC nghỉ trưa ngắn ở Trà Thất | `MG-14` | `MERIDIAN_CLOCK.午` (tâm — ngủ trưa ngắn) |
| Mùi – Thân | 13–17 | hái quả hạt; khách đông ở sảnh nghề | án, sảnh nghề, `MG-07`, `MG-08` | |
| Dậu | 17–19 | trống chiều; **lễ tuần** (buổi chính) | `MG-17` trống, `ACT-041` | `MERIDIAN_CLOCK.酉` (thận) |
| Tuất | 19–21 | Sóc / Vọng tập trung; thả đèn | `ACT-045`, `ACT-046`, `MG-16` | `MERIDIAN_CLOCK.戌` (tâm bào — thư giãn, giao tiếp) |
| Hợi | 21–23 | quan sao (Trích Thiên Đỉnh); Vãn khóa | `ACT-034`, `MG-06` | `MERIDIAN_CLOCK.亥` («chuẩn bị ngủ») |
| Tý – Sửu – Dần | 23–05 | quán tắt đèn lồng; NPC ngủ; NK hồi chậm | (không gợi ý gì) | `MERIDIAN_CLOCK.子/丑` («phải ngủ») |

Không hoạt động nào **bắt buộc** đúng giờ để đủ Nhật Khóa. Giờ chỉ đổi **không khí** và **thưởng nhỏ** (vd `MG-17` ngoài khung lễ B = 1 thay vì 3).

### 3.5 Đổi ngày

`rollDay` (đã có) khi sang ngày mới. Thêm (chưa có — cần làm):

```
rollDayTu(s, now):
  nếu s.tu.capDate != hôm nay:
    chuyển = min(s.tu.duHuong, 10); s.tu.duHuong -= chuyển
    s.tu.capUsed = 0; s.tu.capDate = hôm nay; s.tu.repeat = {}
    s.tu.nhatKhoa = { date: hôm nay, done: [] }
    ghi ngoaiTran += chuyển (09-03 §5.3)
    nếu hôm qua là ngày tu (≥ 10 thô): s.tu.dwell += 1           (09-01 §4.2)
```

Máy chủ (`worker/quan-room.js`) giữ bản gốc của các trường này; client chỉ hiển thị.

---

## 4. Tuần, tháng âm, mùa

### 4.1 Tuần mẫu — người chơi «đều đặn», bậc 4, chủ tu Nho (`NH`), tu thêm Thiền và Tịnh Độ

Can chi thật lấy từ lịch; ví dụ dưới giả định lễ tuần Nho (hành Mộc → ngày can Giáp / Ất đầu tiên) rơi vào thứ Năm.

| Ngày | Phiên (≈ 50 phút) | Nhật Khóa | Việc tuần | Thô trong trần (≤ 35) | Ngoài trần |
|---|---|---|---|---|---|
| Thứ Hai | 2 án + Hương thí + trà + Công Quá Cách | Hạnh · Học · Tĩnh | — | 28 | 6 + 2 (chuỗi) |
| Thứ Ba | Thư pháp + Kinh hành Yên Tử chặng 2 + niệm Phật | Nghệ · Thân · Lễ | — | 26 | 8 |
| Thứ Tư | Đối chất ở Văn Miếu + đặt tên trẻ + trà | Hạnh · Học · Tĩnh | Chương Mệnh Đồ | 30 | 8 + 20 |
| Thứ Năm | Lễ tuần Văn Miếu giờ Dậu + án | Lễ · Hạnh · (trà) Tĩnh | **Lễ tuần** | 18 | 8 + 15 |
| Thứ Sáu | nghỉ | — | — | 0 | 0 |
| Thứ Bảy | Hội thí + phóng sinh + công án | Học · Hạnh · Tĩnh | **Hội thí** | 24 | 8 + 18 (Hội thí `s` 0,87) |
| Chủ nhật | đồng tu ở Trà Thất (5 người) + hái thuốc + Thái Cực | Tĩnh · Thân · (Thái Cực) Thân → thêm `MG-12` Nghệ | **Đồng tu** | 22 | 8 + 5 |

Tổng tuần: thô trong trần 148 · ngoài trần 6+2+8+8+20+8+15+8+18+8+5 = 106 → trong đó nguồn «tuần» = 20 + 15 + 18 + 5 = 58 (dưới trần tuần 60). `MAU-A` (NT 1,19) → ĐH tuần ≈ `254 × 1,19 ≈ 302` (chưa tính `K_dụng`, `K_sung`).

### 4.2 Tháng âm

| Ngày âm | Sự kiện | Hoạt động | Thưởng |
|---|---|---|---|
| 1 (Sóc) | dâng hương mùng 1; Thiên Bảng chụp kỳ; đặt điều nguyện tháng (lưu máy) | `ACT-045`, `ACT-048` | 15 thô |
| 1–3 | Đình thí mở đăng ký (bậc ≥ 4) | `ACT-047` | — |
| 8 (Thượng huyền) | — (nhịp nghỉ của tháng) | | |
| 14 | hạn nộp Đình thí | `MG-03` | ≤ 40 thô |
| 15 (Vọng) | lễ rằm; thả đèn tập thể; công bố Đình thí | `ACT-046`, `MG-16` | 15 thô |
| 23 (Hạ huyền) | — | | |
| 29 / 30 (Hối) | tổng kết tháng trong Sổ Tu: ĐH tháng, công tháng, Tu độ | — | — |

Tháng có lễ tiết lớn (tháng Giêng, tháng 4, tháng 7, tháng 9, tháng 10) chồng `ACT-050` lên Vọng.

### 4.3 Mùa (năm can chi) và 24 tiết khí

**Lập Xuân** = bắt đầu mùa (`thaitue.js › suiYear` tính năm theo Lập Xuân). Việc lúc chuyển mùa:

| Việc | Cụ thể |
|---|---|
| Niên chủ Thái Tuế mới | tượng niên chủ ở Thái Tuế Điện đổi (`TAISUI_60`); đèn an Thái Tuế năm mới (`ACT-004`, web) |
| Thiên Bảng mùa | chốt, mở bảng mới (`09-03` §11.1) |
| Đạo Lộ mùa | bộ phục theo niên chủ (tài liệu 11, `SEASON-xx`) — thuần thẩm mỹ |
| Thư năm sau | mở thư `ACT-124` năm trước, viết thư mới |
| Huyền Không năm | sao bay năm đổi (`xuankong › yearFlyingStar`) → nhà riêng có thể cần bố trí lại (`ACT-014`) |

**24 tiết khí** là nhịp phụ ≈ 15 ngày, đổi thế giới mà không đòi người chơi làm gì:

| Tiết khí | Mùa (hành vượng) | Đổi trong thế giới | Gợi ý hoạt động |
|---|---|---|---|
| Lập Xuân | Xuân (Mộc) | đổi mùa; niên chủ mới | `ACT-124`, `ACT-004` |
| Vũ Thủy | Mộc | mưa xuân, rêu lên bậc Yên Tử | `MG-20` |
| Kinh Trập | Mộc | sấm đầu năm ở Long Hổ (không chớp) | `MG-19` |
| Xuân Phân | Mộc | ngày đêm bằng nhau; chuông sáng sớm hơn | `MG-17` |
| Thanh Minh | Mộc | tảo mộ — Phong Đô yên tĩnh, đèn tưởng niệm | `ACT-099` |
| Cốc Vũ | Mộc | mưa nuôi lúa; ruộng Lịch Đường xanh | `MG-13` |
| Lập Hạ | Hạ (Hỏa) | sen búp ở Cùng Thông Hồ | `MG-13` tim sen |
| Tiểu Mãn | Hỏa | lúa ngậm sữa | — |
| Mang Chủng | Hỏa | gieo mạ; ốc bươu vàng xuất hiện ở ruộng (tình huống `MG-21`) | `MG-21` |
| Hạ Chí | Hỏa | ngày dài nhất; trống chiều muộn hơn | `MG-17` |
| Tiểu Thử | Hỏa | nóng; NPC khuyên uống trà sen | `MG-14` |
| Đại Thử | **Trường hạ (Thổ)** | khoai, ý dĩ chín | `MG-13` (Thổ) |
| Lập Thu | Thu (Kim) | lá ngả vàng ở Chung Nam | `ACT-086` |
| Xử Thử | Kim | — | |
| Bạch Lộ | Kim | sương trắng buổi sớm; lê chín | `MG-13` |
| Thu Phân | Kim | ngày đêm bằng nhau | |
| Hàn Lộ | Kim | kỷ tử bắt đầu chín đẹp (Tạng Địa) | `MG-13` Viên Thông |
| Sương Giáng | Kim | sương muối Võ Đang; củ mài đào được | `MG-13` |
| Lập Đông | Đông (Thủy) | mùa phòng khí than (`ACT-094`) | `ACT-094` |
| Tiểu Tuyết | Thủy | tuyết đầu mùa trên Tạng Địa | `ACT-100` |
| Đại Tuyết | Thủy | — | |
| Đông Chí | Thủy | đêm dài nhất; «nhất dương sinh» — Võ Đang tĩnh tọa tập thể | `MG-01` |
| Tiểu Hàn | Thủy | — | |
| Đại Hàn | Thủy | quét dọn đạo tràng đón năm mới | `ACT-054` |

(Mùa theo `tcm › WUX_ZANG[].season`; ranh Trường hạ theo `09-06` MG-13 §1.3.)

---

### 4.4 Kế hoạch một mùa mẫu — năm Đinh Mùi (Lập Xuân 4/2/2027 → Lập Xuân 2028)

Ngày dương tính bằng `lunar-javascript` (`09-12` §1; cần hiệu chỉnh lịch Việt). Cột «Người chơi trung thành đang ở» lấy từ ước tính `09-10` §9 cho người bắt đầu cùng mùa.

| Tháng (dương) | Tiết khí / lễ trong tháng | Điểm nhấn hệ tu | Hoạt động nổi bật | Người chơi trung thành đang ở |
|---|---|---|---|---|
| Tháng 2 | Lập Xuân 4/2 · Tết 6/2 · Vũ Thủy 19/2 · Thượng Nguyên 20/2 | đổi mùa, Thiên Bảng mùa mới, niên chủ 缪丙; thư năm sau (`ACT-124`) mở / viết | `ACT-049`, `ACT-124`, `ACT-050` Thượng Nguyên (dâng đèn cầu phúc — web; iOS: dâng hương) | bậc 1–3 (người mới) |
| Tháng 3 | Kinh Trập 6/3 · Sóc 8/3 · Xuân Phân 21/3 · Vọng 22/3 | vị Mộc đúng mùa (rau má, atiso…); chuông sáng sớm dần | `MG-13` Mộc, `MG-17` | bậc 3–4 |
| Tháng 4 | Thanh Minh 5/4 · Sóc 7/4 · Cốc Vũ 20/4 · Vọng 21/4 | Thanh Minh: Phong Đô yên tĩnh, dẫn lộ, tảo mộ | `ACT-099`, `ACT-075` hiếu đạo | bậc 4 |
| Tháng 5 | Sóc 6/5 · Lập Hạ 6/5 · Phật đản 20/5 · Tiểu Mãn 21/5 | mùa Hỏa; sen búp; **Phật đản** — tắm Phật, phóng sinh tập thể | `ACT-083`, `MG-21` tập thể | bậc 4–5 |
| Tháng 6 | Sóc 5/6 · Mang Chủng 6/6 · Vọng 19/6 · Hạ Chí 21/6 | ốc bươu vàng xuất hiện ở ruộng (tình huống `MG-21`); trống chiều muộn | `MG-21`, `MG-17` | bậc 5 |
| Tháng 7 | Sóc 4/7 · Tiểu Thử 7/7 · Vọng 18/7 · Đại Thử 23/7 | **Trường hạ** bắt đầu 23/7 (16 ngày): vị Thổ hiếm | `MG-13` Thổ, `MG-14` trà sen | bậc 5–6 |
| Tháng 8 | Sóc 2/8 · Lập Thu 8/8 · **Trung Nguyên / Vu Lan 16/8** · Xử Thử 23/8 | Vu Lan: Phong Đô mở lối cứu người tập thể; đèn tưởng niệm | `ACT-084`, `ACT-098` | bậc 6 (đa số người đều đặn) |
| Tháng 9 | Sóc 1/9 · Bạch Lộ 8/9 · Vọng 15/9 · Thu Phân 23/9 · Sóc 30/9 | mùa Kim; lê, bách hợp; Chung Nam lá vàng | `ACT-086` quải đơn | bậc 6 — Viên Thông các đạo |
| Tháng 10 | **Trùng Cửu 8/10** · Hàn Lộ 8/10 · Vọng 14/10 · Sương Giáng 23/10 · Sóc 29/10 | bái Đẩu tập thể Đẩu Mẫu; kỷ tử Tạng Địa chín | `ACT-055`, `MG-13` Viên Thông | — |
| Tháng 11 | Lập Đông 7/11 · **Hạ Nguyên 12/11** · Tiểu Tuyết 22/11 · Sóc 28/11 | Hạ Nguyên thả đèn môn phái Cùng Thông Hồ; mùa phòng khí than bắt đầu | `ACT-039`, `ACT-094` | — |
| Tháng 12 | Đại Tuyết 7/12 · Vọng 12/12 · Đông Chí 22/12 · Sóc 28/12 | Đông Chí «nhất dương sinh»: tĩnh tọa tập thể Võ Đang | `MG-01` tập thể | — |
| Tháng 1 / 2028 | Tiểu Hàn · Vọng 11/1 · Đại Hàn | quét dọn đạo tràng đón năm; tổng kết mùa trong Sổ Tu | `ACT-054` | — |

**Nhịp mùa:** nửa đầu mùa người chơi mới **leo bậc**; nửa sau người chơi trung thành đã ở bậc 6 và chuyển sang **Viên Thông**, sư đồ, chủ lễ — đúng lúc lễ lớn nhất (Vu Lan, Trùng Cửu, Hạ Nguyên) cần chủ lễ bậc cao. Người vào giữa mùa gặp đông người bậc cao làm thầy — vòng «trao lại» (`§8`) tự vận hành.

---

## 5. Nguyên Khí — nền kinh tế nghỉ ngơi

### 5.1 Hai «Nguyên Khí» khác nhau

| Tên | Bản chất | Nguồn | Đổi được? |
|---|---|---|---|
| **Nguyên Khí Tiên Thiên** (chỉ số, 0–100) | chỉ số lá số | `vitality › analyzeVitality.baseVitality` (canon §5) | không |
| **Nguyên Khí hiện thời** (thanh, 0–100) | sức bền chơi trong game | `state.tu.nk` | lên xuống trong ngày |

Giao diện gọi thanh là «Nguyên Khí»; trang Mệnh Bàn gọi chỉ số là «Nguyên Khí Tiên Thiên». Chỉ số Tiên Thiên chỉ ảnh hưởng thanh **rất nhẹ** (§5.2) để không phạt lá số.

### 5.2 Công thức

```
NK_max = 100                                    (mọi người như nhau)
V      = Nguyên Khí Tiên Thiên (0–100)

Hồi tự nhiên (mỗi giờ thực, cả khi không chơi):
  r = 10 × (0,9 + 0,2 × V/100)                  → 9,0 … 11,0 / giờ
  giờ Tý → hết giờ Sửu (23:00–03:00 giờ tài khoản):  r × 0,5

Hồi chủ động (khi làm việc nghỉ):
  D = 1 + min(0,2 , max(0, 60 − V) / 200)        → 1,0 … 1,2  («dưỡng sinh»: lá số Tiên Thiên yếu hồi chủ động nhiều hơn)
  hồi = (giá trị gốc) × D

Tiêu: chi phí NK của từng hoạt động (bảng §5.4), trừ lúc bắt đầu lượt.
Không âm: NK = max(0, NK − chi phí); thiếu thì lượt vẫn chơi được nhưng K_hư = 0,25 (09-03 §2.2).
```

**Tính lười (không cần đồng hồ chạy):** lưu `nk` và `nkAt` (mốc thời gian). Khi đọc:

```
nkNow = min(100, nk + hồi tự nhiên tích phân từ nkAt tới bây giờ)    (tách đoạn 23:00–03:00 để nhân 0,5)
```

### 5.3 Trạng thái Nguyên Khí

| NK đầu lượt | Trạng thái | `K_hư` (vào thô) | `K_sung` (vào ĐH) | Hiển thị |
|---|---|---|---|---|
| ≥ 70 | **Sung Mãn** | 1,0 | 1,10 | thanh sáng, viền màu hành Dụng |
| 30–69 | Bình | 1,0 | 1,0 | bình thường |
| 10–29 | **Hư** | 0,8 | 1,0 | thanh nhạt; NPC gợi ý nghỉ |
| < chi phí lượt | **Kiệt** | 0,25 | 1,0 | thanh xám; Lão Tùng mời trà (một lần / ngày) |

### 5.4 Bảng chi phí và hồi

**Tiêu** (NK / lượt; MG theo `09-03` §6):

| Hoạt động | NK |
|---|---|
| `MG-24` Tam Chẩn, `MG-15` Luyện Đan | 12 |
| `MG-03` Khoa cử (Hương / Hội / Đình) | 10 / 15 / 20 |
| `MG-05` Mạn-đà-la Cát | 10 |
| `MG-02`, `MG-08`, `MG-22`, `MG-23` | 8 |
| `MG-07` Bốc thuốc, `MG-04` Thái Cực | 6 |
| `MG-06`, `MG-09`, `MG-10`, `MG-12`, `MG-19` | 5 |
| `ACT-001` giải án khách, `ACT-021`–`028` sảnh nghề (mới gán) | 4 |
| `MG-11` Công án, `MG-18` Họa luân, `MG-20` Kinh hành | 4 |
| `MG-17` Chuông, `MG-21` Phóng sinh | 3 |
| `MG-13` Hái thuốc | 1 / cây |
| `MG-16` Thả đèn, thắp nhang, xem lịch, la bàn, xin xăm, gieo quẻ | 0 |
| Súc địa (bậc 4) | 10 |
| Bay (mọi ngự vật) | 0 |

**Hồi** (trước hệ số D):

| Hoạt động | Hồi |
|---|---|
| Tự nhiên | 9–11 / giờ (§5.2) |
| `MG-01` Tĩnh tọa | +2 / phút (≤ 30 / lượt) |
| `MG-14` Pha trà (lượt 1–3 / ngày) | +10 (lượt 4+: +3) |
| Ngồi trà thụ động (`openTra`) | +1 / phút |
| `ACT-016` Một bữa chay | +15 |
| `ACT-015` Nghỉ đêm ở tĩnh thất | đặt về 100 (1 / ngày) |
| `ACT-110` Tĩnh tọa Thiên Trì | +3 / phút |
| `ACT-119` Nghe chuông chung | +1 |
| Đan (`MG-15`): Thanh Tâm Đan | +20 (1 / ngày) |
| Đan: Dưỡng Nguyên Đan | +2 / giờ trong 6 giờ |
| Khách được mời trà (`ACT-116`) | +5 |

### 5.5 Đường Nguyên Khí một ngày (tính tay)

**Người «đều đặn», V = 50** (r = 10 / giờ, D = 1,05). Ngủ ở tĩnh thất tối qua → 07:00 NK 100.

| Giờ | Việc | Thay đổi | NK |
|---|---|---|---|
| 07:00 | thức | — | 100 |
| 07:30 | chuông sáng `MG-17` | −3 (hồi 30 phút bị chặn ở 100) | 97 |
| 07:35 | Tảo khóa `MG-06` | −5 | 92 |
| 12:15 | (không chơi 4,6 giờ) | +46 | 100 |
| 12:15 | án khách ×2 | −8 | 92 |
| 12:30 | Hương thí `MG-03` | −10 | 83 |
| 20:00 | (7,5 giờ) | +75 → chặn | 100 |
| 20:00 | lễ tuần (chuông + tụng) | −8 | 92 |
| 20:20 | `MG-02` kết phù ×2 | −16 | 77 |
| 20:35 | pha trà `MG-14` | +10,5 | 87 |
| 21:00 | nghỉ đêm `ACT-015` | → 100 | 100 |

Kết luận: người đều đặn **luôn Sung Mãn** khi bắt đầu lượt (thưởng `K_sung` 1,10 gần như mọi lượt). Thanh Nguyên Khí chủ yếu là **phần thưởng cho việc nghỉ**, không phải bức tường.

**Người «chuyên tu» chơi liền 110 phút, V = 20** (r = 9,4 / giờ, D = 1,2), bắt đầu 100:

| Phút | Việc | NK sau | Trạng thái lượt kế |
|---|---|---|---|
| 0 | `MG-24` | 88 | Sung |
| 12 | `MG-15` | 78 (hồi +2) | Sung |
| 24 | `MG-03` Hương | 70 | Sung |
| 33 | `MG-22` | 63 | Bình |
| 41 | `MG-08` | 56 | Bình |
| 50 | `MG-02` ×2 | 41 | Bình |
| 60 | `MG-07` | 37 | Bình |
| 67 | `MG-04` ×2 | 26 | **Hư** (×0,8) |
| 76 | `MG-14` pha trà (+10 × 1,2) | 39 | Bình |
| 80 | `MG-01` tĩnh tọa 10 phút (+2 × 1,2 × 10) | 63 | Bình |
| 91 | `MG-24` | 52 | Bình |
| 102 | `MG-12` + `MG-06` | 43 | Bình |
| 110 | ra | 43 | |

Người chuyên tu có ý xen trà và tĩnh tọa thì **không bao giờ Kiệt**; người cày liền 8 MG nặng không nghỉ sẽ rơi Hư rồi Kiệt sau ≈ 80 phút. Đúng ý thiết kế: **xen kẽ động – tĩnh** như nhịp tu thật («văn võ tương gian»).

### 5.6 Chống lạm dụng Nguyên Khí

- Hồi chủ động có trần trong ngày: tổng hồi chủ động (trà, tĩnh tọa, chay, đan) ≤ 150 / ngày. Vượt trần: các việc nghỉ vẫn làm được, không hồi thêm.
- `ACT-015` nghỉ đêm: cần ≥ 6 giờ thực từ lần nghỉ đêm trước.
- Đổi múi giờ để lợi dụng hệ số giờ Tý–Sửu: theo `09-03` §5.1 (giữ múi cũ).

---

## 6. Vắng mặt và quay lại

| Thời gian vắng | Đón tiếp | Thưởng / bù |
|---|---|---|
| 1–2 ngày | bình thường | Dư Hương (≤ 10 thô / sáng, tối đa 20 tích) |
| 3–13 ngày | Lão Tùng: «Quán vẫn đây.» Tóm tắt những gì đã diễn ra (lễ tuần, Thiên Bảng) | chuỗi mềm (§3.3); NK đầy |
| ≥ 14 ngày | cảnh «Trở về»: một chén trà với Lão Tùng, đọc lại Mệnh Đồ | **Hồi Tâm**: trần ngày +20% trong 3 ngày tu kế tiếp; không có ĐH «bù» cho ngày vắng |
| Đang giữa độ kiếp nhiều ngày | khung 14 ngày giữ ngày đã làm; mở khung mới | (`09-02` §9) |

Lý do «Hồi Tâm» nhỏ: người quay lại cần cảm giác tiến lên ngay, nhưng không được biến vắng mặt thành lợi thế.

---

## 7. Tích hợp với code hiện có

| Việc | Tệp | Thay đổi đề xuất | Trạng thái |
|---|---|---|---|
| Khung trạng thái tu | `src/game/state.js › createState` | thêm `tu: {…}` (`09-01` §7.6) | chưa có — cần làm |
| Đổi ngày | `state.js › rollDay` | gọi thêm `rollDayTu` (§3.5) | chưa có — cần làm |
| Nhật Khóa | module mới `src/game/tu.js` | `markGroup(s, group, ok)`, `nhatKhoaDone(s)`; gọi từ mọi `recordX` | chưa có — cần làm |
| Chuỗi mềm | `state.js › settleTasks` | đổi công thức theo §3.3; tính ngày theo «Tam Sự **hoặc** Nhật Khóa» | chưa có — cần làm |
| Ghi án | `state.js › recordCase` | thêm thô `B = 5` (án) / `B = 4` (sảnh) theo `09-03` §7 | chưa có — cần làm |
| Trà | `stations.js › openTra` | phần pha (`MG-14`) trước phần ngồi; hồi NK | chưa có — cần làm |
| Đèn | `stations.js › openSen` | phần làm đèn (`MG-16`) | chưa có — cần làm |
| Máy chủ | `worker/quan-room.js` | giữ `tu` gốc, chấm lại MG, trần ngày, `K_lặp`, NK | chưa có — cần làm |
| Đồng bộ MMO | `src/game/net.js`, `protocol.js` | tin nhắn: lễ tuần, chuông chung, hộ pháp, đồng tu | chưa có — cần làm |

Thứ tự gợi ý: (1) `tu.js` thuần logic + test node (như `scripts/test-game-state.mjs`); (2) nối `recordCase`, `openTra`; (3) Nhật Khóa + chuỗi mềm; (4) máy chủ; (5) MG mới theo lộ trình của tài liệu 13.

---

## 8. Sơ đồ vòng lặp lõi

```
          ┌──────────── khách / NPC cần giúp ◄─────────────┐
          │                                                │
          ▼                                                │
   [MG nặng: Học / Nghệ / Hạnh] ──► thô ──► Đạo Hạnh ──► Cảnh giới ──► mở vùng, MG, ngự vật
          │            ▲                     │                │
       tiêu NK      K_sung                   │                ▼
          ▼            │                     │         độ kiếp (tâm ma của lá số)
   [MG nghỉ: trà, tĩnh tọa] ──► hồi NK ──────┘                │
          │                                                   ▼
          └────► Nhật Khóa (3 nhóm) ──► chuỗi mềm      dạy lại, chủ lễ, mời trà
                                                     (bậc cao trao lại cho bậc thấp)
```

Vòng ngoài (xã hội): người bậc cao làm chủ lễ, hộ pháp, dạy đệ tử → người bậc thấp có lễ để dự, có người hộ pháp, có thầy → người bậc thấp lên bậc → thành người trao lại. Đây là vòng giữ người chơi dài hạn của một game «văn tu» không có chiến đấu.

---

## 9. Nghiệm thu vòng chơi

- [ ] Phiên mẫu A, B, C chơi lại được trong bản dựng thử với đúng số thô (sai số làm tròn ≤ 0,1).
- [ ] Nhật Khóa tính đúng 3 nhóm khác nhau; gợi ý nhóm thiếu theo vị trí; tắt được.
- [ ] Tam Sự giữ nguyên thưởng 5 Phúc Khí; chuỗi mềm qua 3 ca ở §3.3.
- [ ] Nguyên Khí tính lười đúng qua đêm (test 23:00 → 07:00 với hệ số 0,5 đoạn Tý–Sửu).
- [ ] Trạng thái Sung / Bình / Hư / Kiệt áp đúng `K_hư`, `K_sung`.
- [ ] Không có thông báo đẩy kiểu «Bạn sắp mất chuỗi!»; chỉ có nhắc lễ tuần (tắt được) và báo độ kiếp sẵn sàng.
- [ ] Vắng ≥ 14 ngày nhận Hồi Tâm 3 ngày tu, không nhận ĐH bù.
