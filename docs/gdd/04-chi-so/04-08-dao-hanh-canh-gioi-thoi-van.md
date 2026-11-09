# 04-08 · Đạo Hạnh, Nghịch Thiên, Cảnh giới, Thời Vận

## 1. `STAT-DAOHANH` — Đạo Hạnh (Hậu Thiên)

### 1.1 Đặc tả

| Mục | Giá trị |
|---|---|
| Nguồn | **mới** (canon §5: «điểm tu tích lũy (mới)») — không lấy từ engine |
| Đơn vị vào | **công tu** thô do mỗi hoạt động cấp (09 định số) |
| Lưu | `hauThien.daoHanh` (số thực, 1 chữ số thập phân) + `hauThien.congTuGoc` (tổng công tu **sau trần ngày, trước mọi hệ số**) + `hauThien.daoHanhCaoNhat` |
| Hiển thị | số nguyên (`Math.floor`) — «Đạo Hạnh 1.284» |
| Giảm được không | Có: phạm giới, nghiệp (05 định nghĩa). **Cảnh giới không bao giờ giảm** (canon bản sơ đồ tổng §5: Cải Mệnh «Không (chỉ tăng)») — cảnh giới tính theo `daoHanhCaoNhat` |
| Không mua được | canon §7 |

### 1.2 Công thức

```
// 1) Trần ngày (chống cày), áp lên tổng công tu thô trong ngày thật (giờ máy người chơi, đổi ngày lúc 05:00)
congTuNgay_sauTran(b) = min(b, 60) + 0,5 × clamp(b − 60, 0, 60) + 0,1 × max(0, b − 120)

// 2) Mỗi lần nhận, phần công tu được phép (theo trần) đi qua 4 rổ
ĐH_nhận = congTu × (1 + R1) × (1 + R2) × R3 × NT
   R1 = Σ năng khiếu (Ngũ Hành Lực theo tầng + Đặc Tính + nút Ngũ Duy), trần 0,40
   R2 = Σ thiên thời (vùng/giờ/mùa) + Thời Vận dương, trần 0,15
   R3 = (Kỵ ? 1,3 : Cừu ? 1,15 : 1,0) × (1 + Σ thử thách), Σ thử thách trần 0,30 — chỉ hoạt động gắn thẻ thử thách
   NT = clamp(1 + (60 − Tiềm Lực)/100, 1,0, 1,5)

// 3) Làm tròn: giữ 1 chữ số thập phân mỗi lần cộng; hiển thị floor
```

Trần ngày theo công tu thô:

| Công tu thô trong ngày | 20 | 40 | 60 | 80 | 100 | 120 | 150 | 200 |
|---|---|---|---|---|---|---|---|---|
| Được tính | 20 | 40 | 60 | 70 | 80 | 90 | 93 | 98 |

Trần áp **trước** NT: người Phàm Căn không bị trần «cắt mất» lợi thế ×1,4 của mình.

### 1.3 Hai ví dụ tính tay (`MAU-A`, Tiềm Lực 41, NT ×1,19)

**Ví dụ 1 — việc thuận:** tĩnh tọa ở Võ Đang (vùng Thủy = Dụng), giờ Hợi (Thủy), mùa Đông (Thủy), 15 công tu; năm 2026 (đại vận Bình hòa, lưu niên Đại hung — không cộng R2).

| Rổ | Thành phần | Giá trị |
|---|---|---|
| R1 | Hoa Cái bậc II (đạo thống +20%) | 0,20 |
| R2 | vùng Dụng +5% · giờ Dụng +3% · mùa Dụng +2% | 0,10 |
| R3 | không phải thử thách | 1,0 |
| NT | 1 + (60 − 41)/100 | 1,19 |
| **ĐH** | 15 × 1,20 × 1,10 × 1,0 × 1,19 | **23,6** |

**Ví dụ 2 — việc thử thách:** dựng đạo tràng ở Manh Phái Cốc (vùng Thổ = **Kỵ**), giờ Tý (Thủy), mùa Đông, 20 công tu, năm 2026 lưu niên Đại hung (+15% thử thách).

| Rổ | Thành phần | Giá trị |
|---|---|---|
| R1 | không có năng khiếu khớp | 0 |
| R2 | giờ Dụng +3% · mùa Dụng +2% (vùng là Kỵ, không cộng) | 0,05 |
| R3 | Kỵ ×1,3 · năm hạn +15% | 1,3 × 1,15 = 1,495 |
| NT | | 1,19 |
| **ĐH** | 20 × 1,0 × 1,05 × 1,495 × 1,19 | **37,4** |

So với cùng việc đó ở một vùng không phải Kỵ, năm thường (20 × 1,05 × 1,19 = 25,0), việc thử thách cho **thêm 49,5%** (= 1,3 × 1,15). Năm «Đại hung» của người chơi là năm **tu nhanh nhất** nếu dám làm việc khó — cơ chế của câu «mệnh do ta tạo».

## 2. `STAT-NGHICHTHIEN` — Hệ số Nghịch Thiên

| Mục | Giá trị |
|---|---|
| Công thức (canon) | `NT = clamp(1 + (60 − TL)/100, 1,0, 1,5)` |
| Làm tròn | giữ 2 chữ số thập phân khi hiển thị; tính bằng số thực |
| Áp vào | **chỉ** Đạo Hạnh (không Phúc Khí, không Ngộ, không Ngọc) |
| Hiển thị | cạnh Tiềm Lực trong «Vì sao?»; ở màn tu luyện: «Đạo Hạnh +23,6 (×1,19 Nghịch Thiên)» |

| Tiềm Lực | ≤ 10 | 15 | 20 | 25 | 28 | 30 | 35 | 36 | 40 | 41 | 45 | 48 | 50 | 53 | 55 | 58 | ≥ 60 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| NT | 1,50 | 1,45 | 1,40 | 1,35 | 1,32 | 1,30 | 1,25 | 1,24 | 1,20 | 1,19 | 1,15 | 1,12 | 1,10 | 1,07 | 1,05 | 1,02 | 1,00 |

Ghi chú canon: bản sơ đồ tổng §4.7 viết «Phàm Căn (20 điểm) nhận ×1,4 mỗi điểm công đức; Thiên Linh Căn (88 điểm) nhận ×1,0» — khớp bảng.

## 3. `STAT-CANCO` và `STAT-CANHGIOI`

### 3.1 Căn Cơ

`CC = TL × 0,4` (1 chữ số thập phân). Chỉ cộng vào điểm xét cảnh giới bậc 1–3.

### 3.2 Công thức cảnh giới

```js
const NGUONG = [0, 100, 400, 1000, 2200, 4500];   // bậc 1..6 (canon §5)
function canhGioi({ tiemLuc, daoHanhCaoNhat, quyNhat }) {
  const diemThap = tiemLuc * 0.4 + daoHanhCaoNhat;  // bậc 1–3
  let bac = 1;
  if (diemThap >= 100) bac = 2;
  if (diemThap >= 400) bac = 3;
  if (daoHanhCaoNhat >= 1000) bac = 4;               // từ bậc 4 chỉ tính Đạo Hạnh
  if (daoHanhCaoNhat >= 2200) bac = 5;
  if (daoHanhCaoNhat >= 4500 && quyNhat) bac = 6;    // canon §9.1 bản sơ đồ tổng: Côn Lôn cần «Quy nhất»
  return bac;
}
```

Điều kiện «Quy nhất» (canon §6): tu ≥ 3 đạo thống + Sổ Công Quá dương. Đủ 4.500 mà chưa Quy nhất → hiện «Luyện Thần Hoàn Hư · viên mãn» và chỉ đường đến Côn Lôn.

### 3.3 Tên theo đạo

| Bậc | Đạo | Phật | Nho | Ngưỡng | Ghi chú |
|---|---|---|---|---|---|
| 1 | Phàm Nhân | Tín Tâm | Học Trò | 0 | |
| 2 | Nhập Môn | Quy Y | Sĩ | 100 | Căn Cơ còn tính |
| 3 | Luyện Tinh Hóa Khí | Trì Giới | Quân Tử | 400 | Căn Cơ còn tính; ngự kiếm (đã có ở cấp 8) gộp vào bậc này |
| 4 | Luyện Khí Hóa Thần | Định | Hiền Nhân | 1.000 | **Tiên Thiên thôi tính** |
| 5 | Luyện Thần Hoàn Hư | Tuệ | Đại Nho | 2.200 | |
| 6 | Luyện Hư Hợp Đạo | Giải Thoát | Thánh Hiền | 4.500 | + Quy nhất |

Tên hiển thị theo **đạo thống chính** = đạo thống người chơi kiếm nhiều Đạo Hạnh nhất trong 30 ngày gần nhất (Đạo gồm Chính Nhất, Toàn Chân, Thượng Thanh, Thanh Vi…; Phật gồm Thiền, Tịnh Độ, Mật; Nho gồm Văn Miếu). Người chơi có thể ghim một tên.

### 3.4 Ví dụ tính tay

| Mẫu | Tiềm Lực | CC | NT | Sau 40 ngày × 40 công tu: ĐH | Điểm xét bậc 1–3 | Bậc |
|---|---|---|---|---|---|---|
| `MAU-C` | 23 | 9,2 | 1,37 | 40 × 40 × 1,37 = 2.192 | — (đã ≥ 1.000) | **4** (thiếu 8 ĐH để lên 5) |
| `MAU-A` | 41 | 16,4 | 1,19 | 1.904 | — | 4 |
| `MAU-L` | 86 | 34,4 | 1,00 | 1.600 | — | 4 |

| Mẫu | Sau 5 ngày: ĐH | Điểm xét = CC + ĐH | Bậc |
|---|---|---|---|
| `MAU-C` | 274 | 283,2 | 2 |
| `MAU-L` | 200 | 234,4 | 2 |

Ngày đầu, `MAU-L` có 34,4 điểm sẵn — đủ «thấy» khác biệt Tiên Thiên. Từ ngày thứ 2, `MAU-C` đã vượt (2 × 54,8 + 9,2 = 118,8 so với 2 × 40 + 34,4 = 114,4).

## 4. Bảng cân bằng — thời gian lên cảnh giới

Giả định: công tu đều mỗi ngày, không rổ R1/R2/R3 (để thấy riêng tác động Tiên Thiên). Số ngày là số ngày **đến khi đạt** (làm tròn lên). Bậc 6 chưa tính thời gian đạt Quy nhất.

### 4.1 Nhàn — 20 công tu/ngày (1 phiên ngắn)

| Tiềm Lực | NT | ĐH/ngày | Bậc 2 | Bậc 3 | Bậc 4 | Bậc 5 | Bậc 6 |
|---|---|---|---|---|---|---|---|
| 20 (Phàm Căn) | 1,40 | 28,0 | 4 | 14 | 36 | 79 | 161 |
| 35 (Ngũ Linh Căn) | 1,25 | 25,0 | 4 | 16 | 40 | 88 | 180 |
| 50 (Tam Linh Căn) | 1,10 | 22,0 | 4 | 18 | 46 | 100 | 205 |
| 65 (Song Linh Căn) | 1,00 | 20,0 | 4 | 19 | 50 | 110 | 225 |
| 85 (Dị Linh Căn) | 1,00 | 20,0 | 4 | 19 | 50 | 110 | 225 |

### 4.2 Đều — 40 công tu/ngày (chuẩn tham chiếu)

| Tiềm Lực | NT | ĐH/ngày | Bậc 2 | Bậc 3 | Bậc 4 | Bậc 5 | Bậc 6 |
|---|---|---|---|---|---|---|---|
| 20 | 1,40 | 56,0 | 2 | 7 | 18 | 40 | 81 |
| 35 | 1,25 | 50,0 | 2 | 8 | 20 | 44 | 90 |
| 50 | 1,10 | 44,0 | 2 | 9 | 23 | 50 | 103 |
| 65 | 1,00 | 40,0 | 2 | 10 | 25 | 55 | 113 |
| 85 | 1,00 | 40,0 | 2 | 10 | 25 | 55 | 113 |

### 4.3 Chăm — 80 công tu/ngày (sau trần: 70)

| Tiềm Lực | NT | ĐH/ngày | Bậc 2 | Bậc 3 | Bậc 4 | Bậc 5 | Bậc 6 |
|---|---|---|---|---|---|---|---|
| 20 | 1,40 | 98,0 | 1 | 4 | 11 | 23 | 46 |
| 35 | 1,25 | 87,5 | 1 | 5 | 12 | 26 | 52 |
| 50 | 1,10 | 77,0 | 2 | 5 | 13 | 29 | 59 |
| 65 | 1,00 | 70,0 | 2 | 6 | 15 | 32 | 65 |
| 85 | 1,00 | 70,0 | 1 | 6 | 15 | 32 | 65 |

### 4.4 Cày — 150 công tu/ngày (sau trần: 93)

| Tiềm Lực | NT | ĐH/ngày | Bậc 2 | Bậc 3 | Bậc 4 | Bậc 5 | Bậc 6 |
|---|---|---|---|---|---|---|---|
| 20 | 1,40 | 130,2 | 1 | 4 | 8 | 17 | 35 |
| 35 | 1,25 | 116,3 | 1 | 4 | 9 | 19 | 39 |
| 50 | 1,10 | 102,3 | 1 | 4 | 10 | 22 | 44 |
| 65 | 1,00 | 93,0 | 1 | 5 | 11 | 24 | 49 |
| 85 | 1,00 | 93,0 | 1 | 4 | 11 | 24 | 49 |

### 4.5 Đọc bảng

1. **Căn Cơ gần như không đổi nhịp** (tối đa 40 điểm trên ngưỡng 100/400): bậc 2 ai cũng 1–4 ngày. Tiên Thiên được «thấy» ở ngày đầu, không quyết định đường dài.
2. **NT quyết định đường dài**: ở chuẩn 40/ngày, Phàm Căn tới bậc 6 sớm hơn Thiên/Dị Linh Căn **32 ngày** (81 so với 113), tức nhanh hơn 28%.
3. **Trần ngày làm hẹp khoảng cách giữa người chơi nhiều và ít**: cày 150/ngày chỉ nhanh hơn chăm 80/ngày khoảng 25% (bậc 6: 49 so với 65 ngày ở TL 65), dù bỏ gần gấp đôi công sức.
4. **Khoảng cách 65 → 85 bằng 0** ở mọi nhịp: trên 60 điểm, Tiềm Lực không còn tác dụng tốc độ. Người điểm cao khác người điểm vừa ở **Phúc phận sớm**, **nghi lễ**, **danh hiệu** — không ở tốc độ.
5. Ca rủi ro cân bằng: R3 (thử thách) cho tới ×1,3 × 1,3 = ×1,69. Người chơi chọn sống trong vùng Kỵ sẽ nhanh hơn bảng tới 69%. Đây là chủ ý (khuyến khích việc khó), nhưng 09 phải bảo đảm **mỗi vùng có đủ việc** cho mọi Kỵ hành để không ai bị thiệt vì Kỵ của mình là hành «ít việc».

### 4.6 Đạo Hạnh tích lũy sau 150 ngày (40/ngày)

| Mẫu | Tiềm Lực | Bậc 2/3/4/5/6 vào ngày | ĐH ngày 150 |
|---|---|---|---|
| `MAU-C` | 23 | 2 / 8 / 19 / 41 / 83 | 8.220 |
| `MAU-A` | 41 | 2 / 9 / 22 / 47 / 95 | 7.140 |
| `MAU-L` | 86 | 2 / 10 / 25 / 55 / 113 | 6.000 |

## 5. Thiên Bảng

| Cột | Nguồn | Mặc định |
|---|---|---|
| **Đạo Hạnh** (bảng chính, canon) | `hauThien.daoHanh` | hiện |
| Cảnh giới | `canhGioi()` | hiện |
| Tiên Thiên (Tiềm Lực, Phẩm căn) | `tienThien.tiemLuc` | **ẩn**, người chơi tự bật cho riêng mình (đề xuất của 04 — câu hỏi mở với 10) |

Lý do ẩn Tiên Thiên mặc định: bảng xếp theo một con số không ai đổi được dễ thành chỗ so bì, trái T2. Người tự hào về lá số vẫn bật được.

## 6. `STAT-THOIVAN-*` — Thời Vận

### 6.1 Đặc tả

| Mục | Đại vận (`STAT-THOIVAN-DV`) | Lưu niên (`STAT-THOIVAN-LN`) |
|---|---|---|
| Nguồn | phần tử `R.dayun[]` có `startYear ≤ năm ≤ startYear + 9` (cùng quy ước `vanmenh.js`) | phần tử `R.liunian[]` có `isNow` |
| Trường | `ganZhi`, `startAge`, `score`, `rating`, `clashType`, `clashMitigated`, `gejuDelta`, `gejuRescue`, `gejuWorsen`, `_kwNote`, `_ylNote` | `ganZhi`, `score` (thường 0–100; **có thể âm** sau tầng cách cục `adjustLiunianByGeju` — đã gặp −1 ở lá 1960-12-15 17:30 nữ), `rating` |
| Thang `rating` | Đại cát (≥ 5) · Cát (≥ 2) · Hơi thuận (≥ 1) · Bình hòa · Hơi nghịch (≤ −1) · Hung (≤ −2) · Đại hung (≤ −5) | Đại cát (≥ 70) · Cát (≥ 56) · Bình (≥ 36) · Hơi kỵ (≥ 22) · Hung (≥ 10) · Đại hung (< 10) |
| Tính lại | mỗi Lập Xuân (đổi năm can chi) | mỗi Lập Xuân |
| Phân bố (2026, 5.000 lá) | Cát 25,5 · Hung 21,7 · Hơi thuận 13,5 · Bình hòa 12,7 · Hơi nghịch 12,2 · Đại cát 7,7 · Đại hung 6,8 (%) | Bình 30,8 · Hơi kỵ 21,6 · Cát 14,5 · Hung 12,2 · Đại hung 11,5 · Đại cát 9,4 (%) |

### 6.2 Tác động theo mức

Thời Vận **dương** vào R2 (thiên thời, trần 15% chung). Thời Vận **âm** **không trừ** — nó mở **thử thách** vào R3 (chỉ hoạt động gắn thẻ thử thách) và nội dung «Năm Hạn».

| Đại vận | R2 (mọi hoạt động) | R3 thử thách | Nội dung |
|---|---|---|---|
| Đại cát | +6% | — | cổng Vận Mệnh Các sáng «Đỉnh vận» |
| Cát | +4% | — | |
| Hơi thuận | +2% | — | |
| Bình hòa | 0 | — | |
| Hơi nghịch | 0 | +5% | |
| Hung | 0 | +10% | chuỗi tuần «Vượt Vận» ở Vận Mệnh Các |
| Đại hung | 0 | +15% | chuỗi «Vượt Vận» + lễ đón vận có người dẫn |

| Lưu niên | R2 | R3 thử thách | Nội dung |
|---|---|---|---|
| Đại cát | +4% | — | |
| Cát | +2% | — | |
| Bình | 0 | — | |
| Hơi kỵ | 0 | +5% | |
| Hung | 0 | +10% | chuỗi «Năm Hạn» (Hồi III) mở sớm |
| Đại hung | 0 | +15% | «Năm Hạn» + đèn Thái Tuế (Thái Tuế Điện, `thaitue.js`) có thêm một lễ |

Cộng: R2 Thời Vận tối đa +10% (đúng canon «ảnh hưởng nhỏ ±10%», ở đây chỉ dùng phía dương), cùng thiên thời vào trần 15%. R3 thử thách đại vận + lưu niên tối đa +30%.

### 6.3 Sự kiện vận đặc biệt

| Trường engine | Điều kiện | Sự kiện game |
|---|---|---|
| `gejuRescue = true` | đại vận mang phần tử cứu cách | «Vận Cứu Cách»: cổng sáng vàng; người Nghịch Thiên tháo nút thắt Mệnh Đồ bằng 1 hoạt động (04-05 §2.5) |
| `gejuWorsen = true` | vận làm bệnh cách nặng thêm | «Vận Thử Cách»: thêm 1 ải ở Vận Mệnh Các (Thuận Thiên: «ải giữ cách») |
| `clashType = '天克地冲'` | vận thiên khắc địa xung nhật trụ | «Biến Vận»: một sự kiện đổi đời trong game (chuyển nơi ở, đổi sư phụ — người chơi chọn). Nếu `clashMitigated` (vận mang Dụng/Hỷ): engine ghi «đổi thay có lợi» → sự kiện có kết quả tốt mặc định |
| `clashType = '伏吟'` | vận trùng nhật trụ | «Phục Ngâm»: một cảnh gặp lại chính mình (trong mộng) |
| `_kwNote` | chi vận rơi không vong | cổng ghi «vận treo» — Thời Vận lấy theo `score` đã giảm của engine |

### 6.4 Năm tham chiếu theo Lập Xuân (E4)

`computeLiuNian` đánh dấu `isNow` theo năm dương lịch. Năm can chi bắt đầu từ Lập Xuân (~4/2). **Game đã có sẵn hàm đúng**: `src/game/thaitue.js › suiYear(date).year` (năm theo Lập Xuân, dùng cho Thái Tuế Điện) — `buildMenhBan` dùng lại hàm này làm `refYear`, không viết hàm mới. Bản tương đương để tham khảo:

```js
function refYearLichXuan(now) {               // now: Date của máy người chơi
  const y = now.getFullYear();
  const lx = Solar.fromYmd(y, 2, 1).getLunar().getJieQiTable()['立春']; // lunar-javascript (đã kiểm: 2026 → 2026-02-04 04:02:08)
  const lxDate = new Date(lx.getYear(), lx.getMonth() - 1, lx.getDay(), lx.getHour(), lx.getMinute(), lx.getSecond());
  return now < lxDate ? y - 1 : y;
}
```

Giờ Lập Xuân của `lunar-javascript` là giờ Bắc Kinh (UTC+8); máy người chơi ở Việt Nam (UTC+7) lệch 1 giờ quanh thời khắc giao tiết — chấp nhận được cho Thời Vận (chỉ lệch tối đa 1 giờ trong một năm).

Từ 1/1 đến trước giờ Lập Xuân, game gọi `analyze(..., refYear = y − 1)` cho phần Thời Vận. Tiên Thiên không bị ảnh hưởng (N4).

### 6.5 Ví dụ `MAU-A` năm 2026

| Mục | Giá trị engine | Trong game |
|---|---|---|
| Đại vận | 甲申, 28–37 tuổi (từ 2017), điểm 0 → Bình hòa | R2 +0 |
| Lưu niên | 丙午, điểm 6 → Đại hung | R3 thử thách +15%; «Năm Hạn» mở; đèn Thái Tuế (canon §11: tuổi Ngọ phạm Trị + Hình Thái Tuế năm 2026) |
| Câu Thầy (gợi ý cho 06) | — | «Năm nay là năm con tu nhanh nhất, nếu con chọn việc khó.» |

## 7. Ca biên

| Ca | Xử lý |
|---|---|
| Người chơi chưa khởi vận (trẻ) | `liunian = []`, đại vận không khớp → Thời Vận «Tiểu Vận», R2 = 0, R3 = 0 |
| Năm tham chiếu trước năm sinh (sinh sau 2026) | như trên |
| Đạo Hạnh âm sau phạm giới | Đạo Hạnh có sàn 0; cảnh giới theo `daoHanhCaoNhat` không giảm |
| Sửa bát tự | Đạo Hạnh tính lại = `congTuGoc_theoNgày × hệ số đã ghi` — chi tiết 04-11 §9 |
| Đổi múi giờ máy (đi du lịch) | ngày tu đổi lúc 05:00 giờ máy; đổi múi giờ không cộng thêm ngày (khóa theo ngày đã ghi cuối cùng) |
| Đồng hồ máy bị chỉnh lùi | trần ngày dùng ngày lớn nhất đã ghi; không mở lại trần |

## 8. Checklist nghiệm thu phần 04-08

- [ ] Trần ngày áp trước NT; bảng trần khớp §1.2.
- [ ] Hai ví dụ tính tay cho đúng 23,6 và 37,4.
- [ ] Cảnh giới theo `daoHanhCaoNhat`; bậc 4+ bỏ Căn Cơ; bậc 6 cần Quy nhất.
- [ ] Bảng §4 tái tạo được bằng công thức (kiểm thử 04-12 §9).
- [ ] Thời Vận âm không trừ gì; R2 Thời Vận ≤ 10%; R3 thử thách ≤ 30%.
- [ ] `refYear` theo Lập Xuân.
- [ ] Cột Tiên Thiên của Thiên Bảng ẩn mặc định.
