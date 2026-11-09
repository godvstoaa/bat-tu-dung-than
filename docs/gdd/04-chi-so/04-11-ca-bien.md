# 04-11 · Ca biên — đầu vào, lịch pháp, vòng đời dữ liệu

## 1. Bảng tổng

| # | Ca | Mức ảnh hưởng | Mục |
|---|---|---|---|
| C1 | Không rõ giờ sinh | Tiềm Lực có thể lệch tới ~27 điểm | §2 |
| C2 | Sinh quanh giờ Tý (23:00) | đổi **nhật chủ** | §3 |
| C3 | Sinh sát giờ giao tiết (节) | đổi trụ tháng (đôi khi trụ năm) | §4 |
| C4 | Múi giờ lịch sử, sinh ở nước ngoài, kinh độ | đổi trụ giờ, hiếm khi đổi ngày | §5 |
| C5 | Nhập âm lịch, tháng nhuận | sai ngày dương nếu quy đổi sai | §6 |
| C6 | Ngày không tồn tại, năm ngoài khoảng, ngày tương lai | lỗi nhập | §7 |
| C7 | Trẻ chưa khởi vận, người rất cao tuổi | Thời Vận trống / ngoài bảng | §8 |
| C8 | Sửa bát tự | tính lại Tiên Thiên; Hậu Thiên quy đổi | §9 |
| C9 | Giới tính và chiều đại vận | đảo chiều đại vận | §10 |
| C10 | Đồng hồ máy sai, đổi múi giờ máy | Thời Vận, trần ngày | §11 |

## 2. C1 · Không rõ giờ sinh

### 2.1 Hành vi hiện có

- Cổng (`main.js › showBirth`): ô «Không rõ giờ sinh (thầy tạm lấy giờ Ngọ)» → gửi `h = 12, mi = 0`, lưu `birth.hourUnknown = true`; hồ sơ «Bản thân» lưu `hour: null`.
- Engine (`analyze`): `hour == null → 12`, `minute == null → 0` (loop 736). Gửi 12:00 hay `null` cho kết quả **giống hệt** (đã kiểm `MAU-N`).
- Thầy AI (`brief-extender`): người có `hourUnknown` được cảnh báo «GIỜ CHƯA RÕ → Dụng/điểm CÓ THỂ SAI ~25%».

### 2.2 Chỉ số nào phụ thuộc giờ

| Chỉ số | Phụ thuộc giờ? | Lý do |
|---|---|---|
| Tiềm Lực, Phẩm căn, Phúc phận, Mệnh Cấp | **Có** | trụ giờ góp can + tàng can vào `wx`, tổ hợp, 盖头截脚, 拱夹 |
| Ngũ Hành Lực, Thân Lực, Thiên Mệnh | **Có** | như trên |
| Ngũ Duy | **Có** | can giờ và tàng can chi giờ vào `godCount` |
| Mệnh Cách | **Thường không, đôi khi có** | cách lấy theo tháng; chất lượng (thành/bại) có thể đổi theo can giờ. `MAU-N`: 12/12 canh đều 败格 nhưng cách đổi giữa Thương Quan / Chính Ấn |
| Đặc Tính | **Một phần** | sao gặp ở chi giờ; `jinShen` chỉ tra giờ trụ |
| Túc Nghiệp, tâm ma | **Có** | đếm thập thần gồm trụ giờ |
| Tính Khí (nhật chủ), nạp âm nhật trụ | **Không** — trừ khi giờ thật rơi vào 23:00–23:59 (đổi ngày, §3) | |
| Thời Vận (đại vận) | **Có** | tuổi khởi vận tính từ giờ sinh đến tiết |

### 2.2b Mức nhạy thật trên quần thể

Quét 400 ngày sinh ngẫu nhiên (1950–2009, seed 4242), mỗi ngày chạy đủ 12 canh giờ (giữa canh, như `chartSensitivity`):

| Đo | Kết quả |
|---|---|
| Biên độ Tiềm Lực trong một ngày (phân vị 10 / 25 / 50 / 75 / 90) | 19 / 23 / **29** / 35 / 41 điểm (lớn nhất 60) |
| Ngày có biên độ ≥ 25 («Trụ Giờ RẤT quan trọng») | **68,3%** |
| Ngày mà Phẩm căn đổi theo giờ | **100%** |
| Ngày mà **lớp Mệnh Cách** đổi theo giờ | **73,8%** |
| Ngày mà **Dụng thần** đổi theo giờ | **85,5%** |
| Ngày mà tên cách cục đổi theo giờ | 78,5% |

Dụng thần đổi theo giờ ở 85,5% ngày sinh → màu phẩm phục và thưởng Hợp mệnh của người không rõ giờ dựa trên giả định giờ Ngọ. Khi họ Sửa bát tự với giờ thật, phẩm phục đổi màu ngay (04-11 §9.2) và Tàng Y Các tặng lại **miễn phí** bộ ngũ hành tương ứng nếu người chơi đã mua bộ của Dụng cũ (để giả định ban đầu không làm họ mất Ngọc).

Kết luận thiết kế: với người không rõ giờ, Mệnh Bàn theo giờ Ngọ **chỉ là một khả năng trong mười hai**. `MAU-N` (Mệnh Cách bền ở cả 12 canh) là ca thuận lợi, không phải ca điển hình. Vì thế §2.3 bước 5 (mở màn trung tính khi Mệnh Cách không bền) sẽ áp cho khoảng 3/4 người chơi không rõ giờ.

### 2.3 Hành vi của game

1. Mệnh Bàn dựng theo 12:00 (giữ quy ước của app — một nguồn sự thật, T5).
2. Gọi thêm `sensitivity › chartSensitivity({ year, month, day, hour: 12, minute: 0, gender })` một lần (12 lần `analyze`, ~20 ms) → lưu `khoangTiemLuc = { min, max, spread }` và `menhCachOnDinh = (mọi canh cùng lớp Mệnh Cách)`.
3. Hiển thị:
   - Tiềm Lực: «41 · khoảng 31–58» (chữ nhỏ dưới số).
   - Mọi chỉ số phụ thuộc giờ (§2.2): chấm «?» nhỏ ở góc; «Vì sao?» thêm dòng: «Thầy tạm lấy giờ Ngọ. Nếu sau này con biết giờ, cứ Sửa bát tự, không mất gì.»
   - Nếu `spread ≥ 25` (engine gọi là «Trụ Giờ RẤT quan trọng»): thêm lời mời «Hỏi người nhà giờ sinh» (một nhiệm vụ nhỏ ngoài đời, không bắt buộc, thưởng 10 Ngọc khi người chơi Sửa bát tự lần đầu với giờ thật).
4. Không hiển thị câu engine «Giờ … sẽ cho điểm CAO hơn giờ thật của bạn …» (`chartSensitivity.insight`) — dễ thành «chọn giờ đẹp» (T2, T6).
5. Mệnh Cách: nếu `menhCachOnDinh = false`, 03 dùng mở màn trung tính cho đến khi người chơi xác nhận giờ hoặc qua Hồi I.

### 2.4 Chống «chọn giờ đẹp»

Người chơi có thể cố khai giờ khác để được Tiềm Lực cao. Không cấm (không có cách kiểm chứng), nhưng không khuyến khích:

- Tiềm Lực cao **không** cho tốc độ (04-08 §4.5: trên 60 điểm NT = 1,0). Khai giờ «đẹp» làm **chậm** cảnh giới dài hạn.
- Thầy nói một lần, khi Sửa bát tự lần thứ hai: «Lá số thật mới dùng được. Lá số đẹp mà không phải của con thì con tu cho ai?»

## 3. C2 · Giờ Tý và đổi ngày

### 3.1 Quy ước engine

`chart.js › ziShiRoll`: giờ ≥ 23 → **ngày hôm sau, 00:mm** (cổ pháp 子时换日: 渊海子平, 三命通会, 滴天髓). Trụ **năm và tháng** lấy theo **thời điểm thật** (sửa lỗi «节 vs 子时-roll»: nếu một tiết rơi trong cửa sổ 23:xx → 00:xx, roll không được đẩy oan sang tháng mới). `computeDaYun`, `computeLiuNian` dùng cùng `ziShiRoll`.

### 3.2 Ví dụ thật

`MAU-O` (04-10): 1989-04-18 — 22:59 → ngày 戊申, Tiềm Lực 47; 23:00 → ngày 己酉, Tiềm Lực 55.

Ví dụ của chính engine (chú thích `buildChart`): sinh **2006-05-05 23:10**, tiết 立夏 lúc 23:30:39 cùng đêm:

| Giờ nhập | Trụ năm | Trụ tháng | Trụ ngày | Trụ giờ | Tiềm Lực | Mệnh Cách |
|---|---|---|---|---|---|---|
| 05/5 22:50 | 丙戌 | 壬辰 | 甲午 | 乙亥 | 40 | Nghịch Thiên |
| **05/5 23:10** | 丙戌 | **壬辰** (sinh trước tiết 20 phút) | 乙未 (đã roll) | 丙子 | 52 | Nghịch Thiên |
| 06/5 00:10 | 丙戌 | **癸巳** (sau tiết) | 乙未 | 丙子 | 44 | Nghịch Thiên |

23:10 và 00:10 cùng ngày bát tự (乙未) nhưng khác tháng — đúng cổ pháp: ngày theo 子时换日, tháng theo tiết khí thật.

### 3.3 Giao diện cổng

| Điều kiện | Hành vi |
|---|---|
| Giờ nhập ∈ [22:30, 23:30] | ghi chú vàng: «Sinh quanh giờ Tý: từ 23:00, bát tự tính sang ngày hôm sau. Con kiểm lại giờ trên giấy khai sinh nhé.» |
| Giờ ≥ 23:00 | Sổ Mệnh hiện **ngày thật** (`chart.solarInput`, `lunarInput`) và một dòng «Ngày trong bát tự: 19/4 (giờ Tý sớm)» |
| Người chơi phản đối quy ước (một số phái tính 23:00–24:00 vẫn là ngày cũ) | Không có tùy chọn đổi phái trong game (giữ một nguồn sự thật với trang chính). Thầy giải thích bằng chú thích engine. |

## 4. C3 · Sinh sát giờ giao tiết

### 4.1 Hiện tượng

Trụ tháng đổi ở 12 tiết «节» (Lập Xuân, Kinh Trập, Thanh Minh…), trụ năm đổi ở Lập Xuân. `lunar-javascript` tính giờ tiết theo **giờ Bắc Kinh (UTC+8)**: đã kiểm Lập Xuân 2026 = `2026-02-04 04:02:08` (khớp lịch thiên văn, tức 03:02 giờ Việt Nam). Engine nhận giờ đồng hồ người dùng **như thể** cùng múi giờ với bảng tiết.

### 4.2 Ví dụ (giờ nhập là giờ Việt Nam)

| Giờ nhập | Tứ trụ engine | Tiềm Lực | Thực tế thiên văn |
|---|---|---|---|
| 2026-02-04 03:30 | **乙巳** 己丑 己酉 丙寅 | 44 | 03:30 VN = 04:30 Bắc Kinh → **đã qua** Lập Xuân → lẽ ra 丙午 庚寅 |
| 2026-02-04 04:30 | 丙午 庚寅 己酉 丙寅 | 32 | đúng |

Khoảng ảnh hưởng: sinh trong **1 giờ sau** giờ tiết (giờ VN) — khoảng 12 giờ/năm ≈ 0,14% số ca sinh.

### 4.3 Hành vi của game

1. **Không tự sửa** (giữ khớp trang chính, T5). Ghi vào việc cần làm của engine (**chưa có — cần làm**): so tiết bằng thời điểm tuyệt đối (UTC) cho trụ năm/tháng, giữ giờ địa phương cho trụ ngày/giờ.
2. Cổng cảnh báo khi giờ nhập cách giờ một tiết «节» (đổi ra giờ VN) dưới **90 phút**: «Con sinh sát lúc giao tiết … — tháng trong bát tự rất nhạy. Thầy tính theo lịch chuẩn; nếu sau này thầy sửa phép tính, Mệnh Bàn sẽ được đọc lại ở mùa sau.» (cơ chế 04-01 §7.3).
3. `chart.jieqi.prev/next` đã có trong `R.chart` — dùng để kiểm điều kiện.

## 5. C4 · Múi giờ, kinh độ, sinh ở nước ngoài

### 5.1 Nguyên tắc

Người chơi nhập **giờ đồng hồ tại nơi sinh** (giờ trên giấy khai sinh). App gốc mặc định **không** hiệu chỉnh (`truetime.js`: «Không longitude → KHÔNG hiệu chỉnh»). Game giữ đúng mặc định đó.

### 5.2 Hiệu chỉnh tùy chọn (chưa có — cần làm ở cổng)

| Lựa chọn | Hàm có sẵn | Ghi chú |
|---|---|---|
| Chọn thành phố sinh ở Việt Nam | `truetime › VN_CITIES` (12 thành phố, kinh độ) + `trueSolarTime({…, tzOffset: 7, longitude})` | đổi sang chân thái dương thời (kinh độ + phương trình thời gian). Hà Nội 105,85°Đ → +3,4 phút + EOT; TP.HCM 106,70°Đ → +6,8 phút + EOT |
| Sinh ở nước ngoài | `trueSolarTime` với `tzOffset` của nơi sinh | người chơi nhập múi giờ; giờ mùa hè (DST) phải trừ 1 giờ trước khi nhập — cổng hỏi «Nơi sinh có giờ mùa hè không?» |
| Không chọn | — | dùng giờ nhập y nguyên (mặc định, khớp trang chính) |

Nếu người chơi bật hiệu chỉnh, **cả** trang chính và game cần dùng cùng thiết lập (lưu trong hồ sơ «Bản thân»), nếu không hai nơi lệch nhau.

### 5.3 Múi giờ lịch sử của Việt Nam

Dữ liệu IANA `Asia/Ho_Chi_Minh` (đọc từ ICU của Node, phản ánh miền Nam / Sài Gòn):

| Từ | Đến | Múi giờ |
|---|---|---|
| — | 1911-04-30 | UTC+7:06:30 (giờ địa phương) |
| 1911-05-01 | 1942-12-31 | UTC+7 |
| 1943-01-01 | 1945-03-14 | UTC+8 |
| 1945-03-15 | 1945-09-01 | UTC+9 |
| 1945-09-02 | 1947-03-31 | UTC+7 |
| 1947-04-01 | 1955-06-30 | UTC+8 |
| 1955-07-01 | 1959-12-31 | UTC+7 |
| 1960-01-01 | 1975-06-12 | UTC+8 |
| 1975-06-13 | nay | UTC+7 |

Hệ quả: một người sinh ở Sài Gòn năm 1968 lúc «07:20» theo giấy khai sinh là 07:20 **UTC+8**, tức 06:20 theo UTC+7 — **khác trụ giờ** (giờ Thìn 辰 thành giờ Mão 卯). Sinh «08:30» thì thành 07:30, vẫn giờ Thìn — chỉ các giờ sát ranh canh mới đổi trụ, nhưng mọi giờ đều đổi tuổi khởi vận một chút. Miền Bắc sau 1954 dùng UTC+7 (cơ sở dữ liệu IANA không tách riêng; cần kiểm thêm nếu làm tự động).

Hành vi game: khi năm sinh ∈ các khoảng UTC+8/+9 và người chơi chọn nơi sinh ở miền Nam (hoặc không chọn), cổng hỏi: «Giấy khai sinh ghi giờ theo giờ Sài Gòn thời đó (sớm hơn bây giờ 1 tiếng). Thầy có trừ 1 tiếng không?» → Có / Không / Không rõ. «Không rõ» → giữ nguyên, gắn cờ `gioLichSuChuaRo` (hiện chấm «?» như §2).

## 6. C5 · Nhập âm lịch, tháng nhuận

### 6.1 Hiện trạng

Cổng game chỉ nhận **ngày dương lịch** (`<input type="date" min="1900-01-01" max="2100-12-31">`). Nhiều người Việt chỉ nhớ ngày âm. Thêm ô nhập âm lịch (**chưa có — cần làm**).

### 6.2 Quy đổi

```js
import { Lunar, LunarYear } from 'lunar-javascript';
// thangAm: 1..12; nhuan: boolean
function amSangDuong({ namAm, thangAm, ngayAm, nhuan, gio = 12, phut = 0 }) {
  if (nhuan && LunarYear.fromYear(namAm).getLeapMonth() !== thangAm)
    throw new Error(`Năm ${namAm} không có tháng ${thangAm} nhuận.`);
  const s = Lunar.fromYmdHms(namAm, nhuan ? -thangAm : thangAm, ngayAm, gio, phut, 0).getSolar();
  return { y: s.getYear(), m: s.getMonth(), d: s.getDay() };   // rồi đi tiếp như nhập dương lịch
}
```

Đã kiểm với `lunar-javascript`:

| Đầu vào | Kết quả |
|---|---|
| 2023, tháng 2, ngày 15 | 2023-03-06 |
| 2023, tháng **2 nhuận**, ngày 15 | 2023-04-05 (2023 có tháng 2 nhuận: `getLeapMonth() = 2`) |
| 2024, tháng 2 nhuận | lỗi `wrong lunar year 2024 month -2` → game bắt và báo «Năm 2024 không có tháng 2 nhuận.» |
| năm 2025 | tháng nhuận là **6** |

Kiểm thêm: ngày 30 ở tháng thiếu (29 ngày) → `lunar-javascript` ném lỗi → game báo «Tháng … năm … âm lịch chỉ có 29 ngày.»

### 6.3 Năm âm lịch, Tết và Lập Xuân

Bát tự đổi **năm** ở **Lập Xuân** (~4/2), không ở **Tết**. Nhiều người nghĩ «tuổi» theo Tết.

| Sinh | Năm âm lịch (theo Tết) | Trụ năm bát tự |
|---|---|---|
| 2026-01-20 | Ất Tỵ (Tết 2026 là 17/2) | 乙巳 (trước Lập Xuân 4/2) |
| 2026-02-10 | **Ất Tỵ** | **丙午** (đã qua Lập Xuân) |
| 2026-02-20 | Bính Ngọ | 丙午 |

Trường hợp giữa Lập Xuân và Tết, Sổ Mệnh ghi: «Theo lịch âm con tuổi Tỵ; trong bát tự (tính theo Lập Xuân) năm sinh là Bính Ngọ. Thầy dùng bát tự.» Thái Tuế (tuổi xung/hình) dùng **chi năm bát tự**, như `thaitue.js` của game.

## 7. C6 · Ngày sai, năm ngoài khoảng, ngày tương lai

| Ca | Engine | Game |
|---|---|---|
| 29/2 năm không nhuận, 30/2, 31/4… | ném lỗi tiếng Việt: «Ngày 29/2/2025 không tồn tại (tháng 2 năm 2025 chỉ có 28 ngày).» | hiện nguyên lỗi ở ô `data-role=err` (đã có) |
| 29/2/2000 | hợp lệ (năm chia hết 400) | `MAU-N` |
| Năm < 1900 | engine chạy được (đã thử 1600: Tiềm Lực 65; 1899: 43) | cổng chặn bằng `min="1900-01-01"` (đã có). Lý do: múi giờ / lịch dân sự trước 1900 khó xác minh; người chơi thật không sinh trước 1900 |
| Năm > 2100 | engine chạy (2101, 2200, 3000) | cổng chặn bằng `max="2100-12-31"` (đã có) |
| Ngày sinh ở tương lai (sau hôm nay) | engine **không** chặn: `analyze(2030, …, 2026)` chạy, `liunian = []` | **game phải chặn** (chưa có — cần làm): «Ngày sinh chưa tới.» |
| Giờ 24, phút 60, chữ | engine ném lỗi «Giờ sinh không hợp lệ («…» — phải 0-23).» | ô `type="time"` đã chặn phần lớn |
| Giới tính lạ | `parseGender` ném «Giới tính không hợp lệ («x») — nhập «nam» hoặc «nữ».»; chấp nhận một số biến thể như `male` | cổng chỉ có 2 nút, không gặp |

## 8. C7 · Trẻ chưa khởi vận, người rất cao tuổi

| Ca | Engine | Game |
|---|---|---|
| Chưa tới tuổi khởi vận (thường < 1–10 tuổi) | `computeLiuNian` không tìm được đại vận đang hành → `liunian = []`; `dayun[]` vẫn đủ 12 | Thời Vận = «Tiểu Vận» (R2 = 0, R3 = 0); Vận Mệnh Các hiện «trước đại vận đầu tiên» (đã có: `vanmenh › childhood`) |
| Năm tham chiếu trước năm sinh | như trên | chỉ xảy ra nếu đồng hồ máy sai (§11) |
| Trên ~117 tuổi | `dayun` 12 thập kỷ (tới ~120 tuổi, `bugfix-dayun-elder`); `analyzeVitality` lấy phần tử đầu nếu không khớp | Thời Vận dùng đại vận cuối đã bắt đầu (`lastFit` của engine) |
| Người chơi dưới 13 tuổi | — | không thuộc phạm vi 04 (chính sách tuổi của 14 / 11) |

## 9. C8 · Sửa bát tự

### 9.1 Khi nào được sửa

| Thời điểm | Giới hạn |
|---|---|
| Trong 24 giờ đầu hoặc trước cảnh giới 2 | không giới hạn, không hỏi |
| Lần đầu sau đó, nếu trước kia tích «Không rõ giờ» | miễn phí, không tính vào giới hạn (khuyến khích nhập giờ thật) |
| Các lần khác | 1 lần / 30 ngày; hộp xác nhận liệt kê chính xác những gì sẽ đổi (§9.2) |

Nút «Sửa bát tự» đã có ở cổng (`main.js › hq-rebirth`).

### 9.2 Cái gì giữ, cái gì đổi

| Dữ liệu | Sau Sửa bát tự |
|---|---|
| Toàn bộ Tiên Thiên (`tienThien`), Thời Vận | **tính lại** |
| Màu phẩm phục (`player.robe = yong.primary`), màu đai | đổi theo Dụng mới (đã là hành vi hiện tại) |
| Thưởng Hợp mệnh (Tàng Y Các) | tính lại theo Dụng mới (`setBonus(s, yongWx)`) |
| Đặc Tính | tính lại; móc nhiệm vụ của sao mất đi: đóng, thưởng đã nhận giữ |
| Mệnh Cách | lớp mới; nhánh cũ đã xong giữ thưởng; nhánh mới mở từ đầu; vị thuốc đã hái đổi thành «Hộp thuốc cũ» (trang trí) |
| Phúc Khí, `xp` (cấp, `progress.js`), Ngọc, tủ đồ, bạn bè, bang, nhà riêng | **giữ** |
| Bổ Hành (`hauThien.boHanh`) | **giữ** (Hậu Thiên của người, không của lá số) |
| Ngộ và nút Ngũ Duy | **giữ**; nút 01 của trục trội mới tặng thêm (04-04 §12) |
| Tâm ma | **gốc mới + Δ đã tích** (Δ lưu riêng, 04-07 §3.1) |
| Danh hiệu đã nhận | **giữ** |
| Sổ Công Quá (05) | **giữ** |
| Đạo Hạnh | **quy đổi** theo §9.3 |
| Cảnh giới | tính lại từ Đạo Hạnh sau quy đổi (có thể **giảm** — cảnh báo trước khi xác nhận) |
| Hồ sơ «Bản thân» trong Sổ Mệnh | thêm hồ sơ mới; hồ sơ cũ đổi nhãn «Bản thân (cũ)» (`main.js` hiện chỉ thêm khi khác ngày/giới) |

### 9.3 Quy đổi Đạo Hạnh — chống khai điểm thấp để cày

Lỗ hổng cần chặn: khai lá số Tiềm Lực thấp (NT ×1,5) để cày, rồi sửa về lá số thật điểm cao.

Lưu thêm `hauThien.dhKhongNT` = tổng của `congTu × (1+R1) × (1+R2) × R3` (mọi thứ **trừ** NT) và `hauThien.dhTru` = tổng Đạo Hạnh bị trừ do phạm giới (05). Khi đó:

```
ĐH = dhKhongNT × NT − dhTru               // luôn đúng vì NT cố định trong suốt một lá số
Sau Sửa bát tự:  ĐH_mới = dhKhongNT × NT_mới − dhTru
daoHanhCaoNhat_mới = daoHanhCaoNhat_cũ × NT_mới / NT_cũ
```

Ví dụ: người chơi khai Tiềm Lực 20 (NT 1,40), cày tới ĐH 1.400 (`dhKhongNT` = 1.000), rồi sửa về Tiềm Lực 70 (NT 1,00) → ĐH = 1.000, cảnh giới từ bậc 4 (1.400) **vẫn** bậc 4 (1.000). Nếu sửa ngược (70 → 20) thì ĐH tăng lên 1.400 — người khai sai lá số cao rồi sửa về thật được trả đủ phần Nghịch Thiên lẽ ra có.

### 9.4 Điều không làm

- Không cho «thử» lá số khác mà không áp (tránh dò giờ đẹp). Muốn xem lá số khác, người chơi dùng Bàn Thầy với hồ sơ khác (đã có).
- Không gửi lá số cũ / mới lên máy chủ (N8).

## 10. C9 · Giới tính và chiều đại vận

- Bát tự cần «nam/nữ» **chỉ** để tính **chiều và tuổi khởi đại vận** (`getYun(1 | 0)`, năm âm/dương). Đổi giới tính đảo chiều đại vận → đổi Thời Vận, Vận Mệnh Các, `analyzeVitality`, Mệnh Cấp (tiêu chí 运势). Không đổi tứ trụ.
- `main.js` hiện gắn **dáng nhân vật** với giới tính lá số (`look = gender === 'nữ' ? 'hero_f' : 'hero_m'`). Đề nghị tách: ô «Giới tính (để tính đại vận)» và ô «Dáng nhân vật» riêng, người chơi chọn tự do (T6: tôn trọng). Mệnh Bàn không hiển thị giới tính ở mặt chính.

## 11. C10 · Đồng hồ máy

| Ca | Xử lý |
|---|---|
| Đồng hồ máy chỉnh lùi | Thời Vận dùng `max(refYear đã ghi, refYear hiện tại)`; trần ngày dùng ngày lớn nhất đã ghi |
| Đồng hồ máy chỉnh tới (nhảy năm) | Thời Vận theo năm mới (không có lợi gì lớn: R2 ≤ 10%); không cộng bù Đạo Hạnh theo ngày trống |
| Đổi múi giờ máy khi đi du lịch | Ngày tu đổi lúc 05:00 **giờ máy**; không cấp thêm một «ngày» khi bay qua múi giờ (khóa theo ngày đã ghi cuối) |
| Lập Xuân | tính bằng `lunar-javascript` theo giờ Bắc Kinh; lệch ≤ 1 giờ so với giờ VN — chấp nhận (04-08 §6.4) |

## 12. Checklist nghiệm thu phần 04-11

- [ ] Giờ không rõ: dựng theo 12:00, lưu khoảng từ `chartSensitivity`, chấm «?» ở chỉ số phụ thuộc giờ, không hiện câu «giờ … cho điểm cao hơn».
- [ ] Ghi chú giờ Tý khi giờ ∈ [22:30, 23:30]; hiển thị ngày thật (`solarInput`).
- [ ] Cảnh báo sinh sát giờ tiết (< 90 phút).
- [ ] Hỏi trừ 1 giờ cho năm sinh trong khoảng UTC+8/+9 (miền Nam).
- [ ] Nhập âm lịch + tháng nhuận; báo lỗi tháng nhuận không tồn tại.
- [ ] Chặn ngày sinh tương lai.
- [ ] Sửa bát tự: giữ / đổi đúng bảng §9.2; quy đổi Đạo Hạnh theo `dhKhongNT`.
- [ ] Tách giới tính lá số và dáng nhân vật.
