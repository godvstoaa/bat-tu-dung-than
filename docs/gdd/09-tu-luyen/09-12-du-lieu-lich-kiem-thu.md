# 09-12 · Dữ liệu mẫu, lịch thật và vector kiểm thử

> Phần này đưa **dữ liệu chạy được**: lịch âm – tiết khí – lễ thật (tính bằng `lunar-javascript` có trong repo), lịch lễ tuần mẫu theo can chi, lược đồ dữ liệu cho MG / ACT / độ kiếp / trạng thái, dữ liệu mẫu, vector kiểm thử cho module `tu.js`, và nhật ký mô phỏng 45 ngày của `MAU-A`.
> Lược đồ ở đây là **đề xuất của tài liệu 09**; tài liệu 13 cấp mã `SCHEMA-*` chính thức.

---

## 1. Lịch thật (tính bằng engine, không viết tay)

### 1.1 Cảnh báo múi giờ

`lunar-javascript` tính lịch âm theo **múi giờ Trung Quốc (UTC+8)**. Âm lịch Việt Nam dùng **UTC+7**; hai lịch thỉnh thoảng lệch **một ngày** ở ngày Sóc (khi điểm sóc thiên văn rơi giữa 23:00 và 24:00 giờ Hà Nội), hiếm hơn lệch tháng nhuận. Game dùng âm lịch cho Sóc / Vọng / lễ tiết nên **phải** dùng lịch Việt (chưa có — cần làm: hàm quy đổi hoặc bảng hiệu chỉnh từ nguồn lịch Việt đã kiểm). Các ngày dưới đây là kết quả thư viện, cần đối chiếu lịch Việt trước khi khóa sự kiện.

### 1.2 Sóc và Vọng từ tháng 10 âm 2026 tới hết 2027 (dương lịch)

| Tháng âm | Sóc (mùng 1) | Thứ | Vọng (Rằm) | Thứ |
|---|---|---|---|---|
| 10 / 2026 | 9/11/2026 | Hai | 23/11/2026 | Hai |
| 11 / 2026 | 9/12/2026 | Tư | 23/12/2026 | Tư |
| 12 / 2026 | 8/1/2027 | Sáu | 22/1/2027 | Sáu |
| 1 / 2027 (Tết) | 6/2/2027 | Bảy | 20/2/2027 | Bảy |
| 2 / 2027 | 8/3/2027 | Hai | 22/3/2027 | Hai |
| 3 / 2027 | 7/4/2027 | Tư | 21/4/2027 | Tư |
| 4 / 2027 | 6/5/2027 | Năm | 20/5/2027 | Năm |
| 5 / 2027 | 5/6/2027 | Bảy | 19/6/2027 | Bảy |
| 6 / 2027 | 4/7/2027 | Chủ nhật | 18/7/2027 | Chủ nhật |
| 7 / 2027 | 2/8/2027 | Hai | 16/8/2027 | Hai |
| 8 / 2027 | 1/9/2027 | Tư | 15/9/2027 | Tư |
| 9 / 2027 | 30/9/2027 | Năm | 14/10/2027 | Năm |
| 10 / 2027 | 29/10/2027 | Sáu | 12/11/2027 | Sáu |
| 11 / 2027 | 28/11/2027 | Chủ nhật | 12/12/2027 | Chủ nhật |
| 12 / 2027 | 28/12/2027 | Ba | 11/1/2028 | Ba |

Quan sát thiết kế: Sóc và Vọng cùng thứ trong một tháng (cách nhau 14 ngày) nên một người bận cố định một ngày trong tuần có thể lỡ cả hai lễ của tháng → chính vì vậy `ACT-045` / `ACT-046` mở **cả ngày âm lịch** chứ không chỉ giờ tập trung (`09-08` §5.2).

### 1.3 Lễ tiết lớn năm 2027

| Lễ | Âm lịch | Dương lịch 2027 | Hoạt động |
|---|---|---|---|
| Tết Nguyên Đán | 1/1 | 6/2/2027 | đón năm; tài liệu 10 |
| Lập Xuân (đổi mùa game) | — | **4/2/2027** (trước Tết 2 ngày) | `ACT-049`, Thiên Bảng mùa chốt, niên chủ mới |
| Thượng Nguyên | 15/1 | 20/2/2027 | `ACT-050` |
| Phật đản (Việt Nam theo 15/4) | 15/4 | 20/5/2027 | `ACT-083` |
| Trung Nguyên · Vu Lan | 15/7 | 16/8/2027 | `ACT-084`, `ACT-098` |
| Trùng Cửu | 9/9 | 8/10/2027 | `ACT-055` |
| Hạ Nguyên | 15/10 | 12/11/2027 | `ACT-039` |

**Mùa mới bắt đầu ở Lập Xuân, không ở Tết** (canon: năm can chi tính theo Lập Xuân; `thaitue.js › suiYear`). Năm 2027 là **丁未 Đinh Mùi**, niên chủ Thái Tuế 缪丙 (`taisui-general › TAISUI_60`). Hai ngày 4–5/2/2027 thuộc năm Đinh Mùi theo tiết khí nhưng vẫn thuộc năm Bính Ngọ theo âm lịch — UI Thái Tuế Điện và Sổ Tu phải ghi rõ «năm tiết khí».

### 1.4 Hai mươi bốn tiết khí 2027 và mùa thu hái (`MG-13`)

| Tiết khí | Ngày 2027 | Mùa game (hành vượng) |
|---|---|---|
| Tiểu Hàn | 5/1 | Đông (Thủy) |
| Đại Hàn | 20/1 | Đông (Thủy) |
| **Lập Xuân** | 4/2 | **Xuân (Mộc) bắt đầu** |
| Vũ Thủy | 19/2 | Xuân |
| Kinh Trập | 6/3 | Xuân |
| Xuân Phân | 21/3 | Xuân |
| Thanh Minh | 5/4 | Xuân |
| Cốc Vũ | 20/4 | Xuân |
| **Lập Hạ** | 6/5 | **Hạ (Hỏa) bắt đầu** |
| Tiểu Mãn | 21/5 | Hạ |
| Mang Chủng | 6/6 | Hạ |
| Hạ Chí | 21/6 | Hạ |
| Tiểu Thử | 7/7 | Hạ |
| **Đại Thử** | 23/7 | **Trường hạ (Thổ) bắt đầu** |
| **Lập Thu** | 8/8 | **Thu (Kim) bắt đầu** |
| Xử Thử | 23/8 | Thu |
| Bạch Lộ | 8/9 | Thu |
| Thu Phân | 23/9 | Thu |
| Hàn Lộ | 8/10 | Thu |
| Sương Giáng | 23/10 | Thu |
| **Lập Đông** | 7/11 | **Đông (Thủy) bắt đầu** |
| Tiểu Tuyết | 22/11 | Đông |
| Đại Tuyết | 7/12 | Đông |
| Đông Chí | 22/12 | Đông |

Độ dài mùa game 2027: Xuân 91 ngày · Hạ 78 · Trường hạ 16 · Thu 91 · Đông 89 (tới Lập Xuân 2028). Trường hạ ngắn (16 ngày) → vị Thổ (khoai lang, ý dĩ, táo đỏ, gừng) **hiếm** đúng mùa; đây là chủ ý (khan hiếm tạo lý do hái đúng lúc), nhưng nếu đo lường cho thấy Nhật Khóa nhóm Thân thiếu vào cuối hạ thì có thể chuyển sang thuyết «Thổ vượng 18 ngày cuối mỗi mùa» (`09-06` MG-13 §1.3).

### 1.5 Lịch lễ tuần mẫu (`ACT-041`) — 8 tuần, 9 đạo thống

Quy tắc `09-08` §5.1 (trong ô: T2…T7 = thứ Hai…thứ Bảy, «C.Nhật» = Chủ nhật): ngày đầu tuần có **can** cùng hành với đạo → nếu không có, ngày có **chi** cùng hành → nếu không, Chủ nhật. Can chi ngày tính bằng thư viện.

| Tuần (thứ Hai) | Can chi 7 ngày | `CN` Chính Nhất (Hỏa) | TV (Thủy) | TC (Thổ) | TT (Kim) | BD (Thủy) | TH (Mộc) | TD (Kim) | MT (Thổ) | NH (Mộc) |
|---|---|---|---|---|---|---|---|---|---|---|
| 9/11/2026 | 丁亥 戊子 己丑 庚寅 辛卯 壬辰 癸巳 | T2 9/11 丁亥 | T7 14/11 壬辰 | T3 10/11 戊子 | T5 12/11 庚寅 | T7 14/11 | T5 12/11 庚**寅** (chi) | T5 12/11 | T3 10/11 | T5 12/11 (chi) |
| 16/11/2026 | 甲午 乙未 丙申 丁酉 戊戌 己亥 庚子 | T4 18/11 丙申 | T7 21/11 己**亥** (chi) | T6 20/11 戊戌 | C.Nhật 22/11 庚子 | T7 21/11 | T2 16/11 甲午 | C.Nhật 22/11 | T6 20/11 | T2 16/11 |
| 23/11/2026 | 辛丑 壬寅 癸卯 甲辰 乙巳 丙午 丁未 | T7 28/11 丙午 | T3 24/11 壬寅 | T2 23/11 辛**丑** (chi) | T2 23/11 辛丑 | T3 24/11 | T5 26/11 甲辰 | T2 23/11 | T2 23/11 (chi) | T5 26/11 |
| 30/11/2026 | 戊申 己酉 庚戌 辛亥 壬子 癸丑 甲寅 | C.Nhật 6/12 (không can / chi Hỏa) | T6 4/12 壬子 | T2 30/11 戊申 | T4 2/12 庚戌 | T6 4/12 | C.Nhật 6/12 甲寅 | T4 2/12 | T2 30/11 | C.Nhật 6/12 |
| 7/12/2026 | 乙卯 丙辰 丁巳 戊午 己未 庚申 辛酉 | T3 8/12 丙辰 | C.Nhật 13/12 (không Thủy) | T5 10/12 戊午 | T7 12/12 庚申 | C.Nhật 13/12 | T2 7/12 乙卯 | T7 12/12 | T5 10/12 | T2 7/12 |
| 14/12/2026 | 壬戌 癸亥 甲子 乙丑 丙寅 丁卯 戊辰 | T6 18/12 丙寅 | T2 14/12 壬戌 | C.Nhật 20/12 戊辰 | C.Nhật 20/12 (không Kim) | T2 14/12 | T4 16/12 甲子 | C.Nhật 20/12 | C.Nhật 20/12 | T4 16/12 |
| 21/12/2026 | 己巳 庚午 辛未 壬申 癸酉 甲戌 乙亥 | T2 21/12 己**巳** (chi) | T5 24/12 壬申 | T2 21/12 己巳 | T3 22/12 庚午 | T5 24/12 | T7 26/12 甲戌 | T3 22/12 | T2 21/12 | T7 26/12 |
| 28/12/2026 | 丙子 丁丑 戊寅 己卯 庚辰 辛巳 壬午 | T2 28/12 丙子 | C.Nhật 3/1/2027 壬午 | T4 30/12 戊寅 | T6 1/1/2027 庚辰 | C.Nhật 3/1 | T4 30/12 戊**寅** (chi) | T6 1/1 | T4 30/12 | T4 30/12 (chi) |

Quan sát: ngày lễ tuần của một đạo **trôi** qua các thứ trong tuần (Võ Đang: T7, T7, T3, T6, CN, T2, T5, CN) → người bận cố định một tối trong tuần vẫn dự được phần lớn các tuần; buổi lặp sáng hôm sau (giờ Thìn) bù phần còn lại. Hai đạo cùng hành (vd TV và BD, cùng Thủy) luôn trùng ngày — chấp nhận vì hai đạo ở hai thánh địa khác nhau; người tu cả hai đạo chọn một (chỉ nhận thưởng một lễ / tuần).

### 1.6 Mốc thật trong một ngày (để test `MG-17`, giờ Tý–Sửu của Nguyên Khí)

| Canh | Giờ địa phương | `MG-17` | Hệ số hồi NK |
|---|---|---|---|
| Tý | 23:00–00:59 | ngoài khung (B = 1) | ×0,5 |
| Sửu | 01:00–02:59 | ngoài khung | ×0,5 |
| Dần | 03:00–04:59 | ngoài khung | ×1 |
| Mão | 05:00–06:59 | **chuông** (B = 3) | ×1 |
| Thìn | 07:00–08:59 | **chuông** (mở rộng) | ×1 |
| Tỵ … Thân | 09:00–16:59 | ngoài khung | ×1 |
| Dậu | 17:00–18:59 | **trống** (B = 3) | ×1 |
| Tuất | 19:00–20:59 | **trống** (mở rộng) | ×1 |
| Hợi | 21:00–22:59 | ngoài khung | ×1 |

---

## 2. Lược đồ dữ liệu đề xuất

### 2.1 Định nghĩa mini-game (`mg.json`)

```json
{
  "id": "MG-01",
  "name": "Tĩnh Tọa Hồi Tức",
  "nameIos": null,
  "group": "tinh",
  "venues": [
    { "region": "vodang", "tradition": "TV" },
    { "region": "thanh", "station": "tra", "tradition": "TC" },
    { "region": "yentu", "tradition": "TH" }
  ],
  "unlockTier": 1,
  "unlockTierPrimary": null,
  "minutes": [3, 15],
  "B": { "perMinute": 1, "max": 15 },
  "nkCost": 0,
  "nkRestore": { "perMinute": 2, "max": 30 },
  "sMin": 0.4,
  "engine": ["cultivation-data.CULTIVATION#GONG_TUNA", "remedy-fate.DAO_JIA[2]", "liudao.computeLiuDao"],
  "levels": ["so", "trung", "tham", "vienthong"],
  "grader": "tu/mg01.grade",
  "ios": "on"
}
```

`ios`: `"on"` · `"variant:<khóa>"` · `"off"`. `grader` trỏ tới hàm chấm thuần (dùng chung client + máy chủ).

### 2.2 Định nghĩa hoạt động (`act.json`)

```json
{
  "id": "ACT-041",
  "name": "Lễ tuần đạo tràng",
  "region": "*primary",
  "cadence": "week",
  "schedule": { "rule": "stemThenBranchThenSunday", "main": "dau", "repeat": "thin+1d" },
  "engine": ["lunar-javascript.getDayInGanZhi"],
  "reward": { "thoOutside": 15, "congRole": 1 },
  "prereq": { "tier": 2, "joined": true },
  "group": null,
  "ios": "on"
}
```

### 2.3 Định nghĩa độ kiếp (`kiep.json`)

```json
{
  "id": "ACT-K3-TV",
  "tierTo": 3,
  "tradition": "TV",
  "step": "dinh",
  "venue": { "region": "vodang", "building": "tu_tieu_cung" },
  "guide": ["huyen_hu", "dan_dinh"],
  "phases": [
    { "kind": "nghe", "mg": [{ "id": "MG-01", "level": "trung", "minutes": 10, "sMin": 0.55 }, { "id": "MG-15", "level": "so", "minGrade": "ha" }] },
    { "kind": "tam", "mode": "mgOverride", "mg": "MG-01", "override": { "poisonDensity": 2, "throughCenter": true }, "pass": { "D": 0.7 } },
    { "kind": "hanh", "task": { "type": "deliverHerbs", "count": 3, "inSeason": true, "npc": "lao_tieu_phu", "adviceMust": ["nghi_ngoi", "kham_thay_thuoc"] } }
  ],
  "retryHours": 20,
  "assistAfter": 3,
  "ios": "on"
}
```

`tam` có ba chế độ: `"scene"` (cảnh thoại ba biến thể theo `poisonTop`), `"mgOverride"` (thử trong MG), `"silence"` (thử im lặng ở bậc 5).

### 2.4 Định nghĩa vị thuốc (`herb.json`)

```json
{ "id": "cu_mai", "name": "Củ mài", "han": "山藥", "wx": "水", "flavor": "甘", "color": "trắng",
  "part": "re_cu", "regions": ["vodang", "yentu"], "source": "tcm.WUX_ZANG.水.nourish", "decoyOf": null }
```

### 2.5 Trạng thái tu của người chơi

Như `09-01` §7.6; bản đầy đủ khi lưu máy chủ có thêm `rev` (số phiên bản ghi, chống ghi đè đồng thời) và `log` (100 bản ghi `dh_gain` gần nhất để giải trình khi người chơi hỏi «sao hôm nay được ít»).

### 2.6 Tin nhắn MMO mới (đề xuất cho `protocol.js`)

| Tin | Hướng | Trường | Dùng cho |
|---|---|---|---|
| `tu.kiepStart` | client → máy chủ → phòng | `kiepId, x, z` | hiện vòng mây cho người xung quanh (`09-01` §8.4) |
| `tu.hophap` | client → máy chủ | `targetId` | hộ pháp (`09-02` §1.5) |
| `tu.bell` | máy chủ → phòng | `strokeNo, section, x, z` | tiếng chuông chung (`MG-17`) |
| `tu.bellQueue` | client ↔ máy chủ | `join/leave` | hàng chờ chuông |
| `tu.ritual` | máy chủ → phòng | `actId, phase, leaderId` | lễ tuần, Sóc / Vọng |
| `tu.dongtu` | máy chủ → phòng | `seatIds[], minutes` | đồng tu (5 người) |
| `tu.tierUp` | máy chủ → vùng | `name, tierName` | thông báo lên bậc (tắt được) |

---

## 3. Dữ liệu mẫu

### 3.1 Năm vị thuốc (trích 24 vị `09-06` MG-13)

| id | Tên | Hán | Hành | Vị | Bộ phận | Vùng |
|---|---|---|---|---|---|---|
| `rau_ngot` | Rau ngót | — | 木 | — | lá | `thanh` |
| `tim_sen` | Tim sen | 蓮子心 | 火 | 苦 | hạt | `buttap`, `cungthong` |
| `y_di` | Ý dĩ | 薏苡仁 | 土 | 甘 | hạt | `mieucuong` |
| `bach_hop` | Bách hợp | 百合 | 金 | 甘 | củ | `chungnam` |
| `cu_mai` | Củ mài | 山藥 | 水 | 甘 | rễ củ | `vodang`, `yentu` |

### 3.2 Một ngày Nhật Khóa ghi trong `state.tu.nhatKhoa`

```json
{ "date": "2026-11-12", "done": [
  { "group": "le", "src": "ACT-003", "at": "06:41" },
  { "group": "hanh", "src": "ACT-001", "at": "12:20" },
  { "group": "tinh", "src": "MG-14", "at": "12:33" } ],
  "rewarded": true, "streakAfter": 15 }
```

### 3.3 Bản ghi `dh_gain` mẫu (giải trình cho người chơi)

```json
{ "at": "2026-11-12T12:33:10+07:00", "src": "MG-14", "tho": 3.58, "capLeft": 21.4, "nhan": 3.58,
  "nt": 1.19, "kDung": 1.0, "kSung": 1.1, "dh": 4.69, "phuc": 2, "duHuongAdd": 0 }
```

Giao diện «Vì sao được 4 Đạo Hạnh?» dựng lại câu: «Pha trà được 3,6 điểm tu. Hạt giống của con nhân 1,19; khí đang sung nhân 1,1. Thành 4,7.»

---

## 4. Vector kiểm thử cho `tu.js`

Mọi số dưới đây tính bằng đúng công thức `09-03` §2.2 (chạy node, làm tròn 3 chữ số).

### 4.1 Công thức một lượt

| # | Ca | B | `s` / `s_min` | Lượt | NK / chi phí | TL | `K_dụng` | Trần còn | **thô** | **nhận** | Dư | **ĐH** | PK |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| T1 | `MG-01` 10 phút, Võ Đang, `MAU-A` | 10 | 0,82 / 0,4 | 1 | 74 / 0 | 41 | 1,10 | 18 | 8,740 | 8,740 | 0 | **12,585** | 4 |
| T2 | `MG-04` lượt 6, kiệt sức | 5 | 0,90 / 0,4 | 6 | 3 / 6 | 60 | 1 | 25 | 0,116 | 0,116 | 0 | **0,116** | 0 |
| T3 | `MG-02` dưới ngưỡng | 6 | 0,45 / 0,5 | 1 | 50 / 8 | 20 | 1 | 30 | 0,900 | 0,900 | 0 | **1,260** | 0 |
| T4 | `MG-24` Mao Sơn, `MAU-A` (Kim = Hỷ), Sung | 12 | 0,978 / 0,5 | 1 | 80 / 12 | 41 | 1,05 | 30 | 11,815 | 11,815 | 0 | **16,239** | 6 |
| T5 | `MG-08` lượt 4, NK Hư | 8 | 0,70 / 0,5 | 4 | 20 / 8 | 85 | 1 | 30 | 2,528 | 2,528 | 0 | **2,528** | 1 |
| T6 | `MG-03` Hương thí, trần gần hết | 8 | 0,60 / 0,5 | 1 | 65 / 10 | 28 | 1 | 2,4 | 5,760 | 2,400 | **3,360** | **3,168** | 3 |

Giải thích T3: `s = 0,45 < s_min 0,5` → `f = 0,15` → thô `6 × 0,15 = 0,9`; TL 20 → NT 1,4 → ĐH 1,26.
Giải thích T6: phần dư 3,36 vào Dư Hương (`09-03` §5.3); PK tính trên **thô** (5,76 × 0,5 = 2,88 → 3), không trên phần nhận.

### 4.2 Điểm Cảnh Giới và điều kiện

| # | Trạng thái | Kỳ vọng |
|---|---|---|
| C1 | TL 41, ĐH 83,5, bậc 1, chưa kiếp | ĐCG 99,9 → chưa đủ bậc 2 |
| C2 | TL 41, ĐH 83,6 | ĐCG 100,0 → D1 bậc 2 đủ; mở `ACT-K2-*` |
| C3 | TL 85, ĐH 990, bậc 3, dwell 10, công 25, Tu độ chính 260 | bậc 4: D1 **không đủ** (bậc ≥ 4 không cộng 0,4 × TL) |
| C4 | TL 20, ĐH 1.000, bậc 3, dwell 9, công 25, Tu độ 260 | D2 thiếu 1 ngày tu → «Củng cố 9 / 10» |
| C5 | ĐH 2.300, bậc 4, dwell 20, công 59 | D3 thiếu 1 công |
| C6 | bậc 5, ĐH 4.600, dwell 30, công 160, Tu độ [300, 260, 240] | Quy nhất chưa đủ (đạo 3 = 240 < 250) |
| C7 | bậc 4, ĐH 900 (sau khi bị trừ 120 do phạm giới) | «Cảnh giới bất ổn»; bậc vẫn 4; không mở kiếp 5 |
| C8 | bậc 5, Nợ Âm 40 | không mở kiếp 6 dù đủ D1–D4 |

### 4.3 Dư Hương

| # | Ngày | Thô trong ngày (trần 30) | Dư Hương trước | Sáng hôm sau chuyển | Dư Hương sau |
|---|---|---|---|---|---|
| H1 | N | 45 | 0 | — | 15 |
| H2 | N + 1 sáng | — | 15 | **10** | 5 |
| H3 | N + 1 | 52 (vượt 22) | 5 | — | 20 (chặn 20) |
| H4 | N + 2 sáng | — | 20 | 10 | 10 |
| H5 | N + 2 | 10 (không vượt) | 10 | — | 10 |
| H6 | N + 3 sáng | — | 10 | 10 | 0 |

### 4.4 Nguyên Khí tính lười

| # | Bắt đầu | NK đầu | V | Đến | Kỳ vọng |
|---|---|---|---|---|---|
| N1 | 22:00 | 10 | 50 | 07:00 | 10 + 1 h × 10 + 4 h × 5 + 4 h × 10 = **80** |
| N2 | 22:00 | 30 | 50 | 07:00 | 30 + 10 + 20 + 40 = 100 (chặn) |
| N3 | 12:00 | 40 | 20 | 15:00 | 40 + 3 × 9,4 = **68,2** |
| N4 | 12:00 | 40 | 80 | 15:00 | 40 + 3 × 10,6 = **71,8** (Sung Mãn) |
| N5 | pha trà, V = 20 | 26 | 20 | ngay | 26 + 10 × 1,2 = **38** |
| N6 | hồi chủ động đã 145 trong ngày, tĩnh tọa 10 phút V = 50 | 50 | 50 | sau 10 phút | +5 (chạm trần 150) + hồi tự nhiên 1,7 → **56,7** |

### 4.5 Chuỗi mềm

| # | Chuỗi trước | Khoảng trống (ngày) | Ngày nghỉ miễn phí còn? | Chuỗi sau |
|---|---|---|---|---|
| S1 | 20 | 1 | có | **21** |
| S2 | 20 | 3 | không | **11** |
| S3 | 60 | 10 | không | **31** |
| S4 | 6 | 1 | không (chưa đủ 7) | **4** |
| S5 | 0 | — (ngày đầu) | — | **1** |
| S6 | 13 | 0 | — | **14**, bật lại «ngày nghỉ miễn phí» vì 14 chia hết cho 7 |

### 4.6 Hệ số Nghịch Thiên và hợp Dụng

| TL | NT | Dụng / Hỷ | Đạo nơi chơi | `K_dụng` |
|---|---|---|---|---|
| 0 | 1,50 | 木 / 水 | TH (木) | 1,10 |
| 41 | 1,19 | 水 / 金 | TT (金) | 1,05 |
| 41 | 1,19 | 水 / 金 | CN (火) | 1,00 |
| 59 | 1,01 | 土 / 火 | MT (土) | 1,10 |
| 60 | 1,00 | 火 / 木 | NH (木) | 1,05 |
| 100 | 1,00 | 金 / 土 | trung lập | 1,00 |

---

## 5. Nhật ký mô phỏng 45 ngày — `MAU-A` chơi «đều đặn»

Kết quả trực tiếp từ bộ mô phỏng `09-10` §12 (TL 41, NT 1,19; không tính `K_dụng`, `K_sung`). «Thô ngày» là tổng thô (trong + ngoài trần) trước NT; ngày vắng mặt là ngày nghỉ của kiểu chơi (6 / 7).

| Ngày | Bậc đầu ngày | Thô ngày | ĐH cuối ngày | Công | Ngày tu ở bậc | Sự kiện |
|---|---|---|---|---|---|---|
| 1 | 1 | 41,1 | 49 | 3 | 1 | Mở đầu cốt truyện; Nhật Khóa đầu tiên |
| 2 | 1 | 41,1 | 98 | 6 | 2 | **lên bậc 2** (ĐCG 98 + 16,4 = 114,4 ≥ 100), kiếp `ACT-K2-DAO` |
| 3 | 2 | 45,6 | 212 | 9 | 1 | (+59,5 ĐH thưởng kiếp đã cộng) chọn đạo chính TV, chuỗi đạo chương 1 |
| 4 | 2 | 45,6 | 266 | 12 | 2 | |
| 5 | 2 | 45,6 | 320 | 15 | 3 | đủ 3 ngày tu (D2 bậc 3) |
| 6 | — | — | — | — | — | nghỉ |
| 7 | 2 | 45,6 | 375 | 18 | 4 | ĐCG 391 — thiếu 9 |
| 8 | 2 | 86,6 | 478 | 21 | 5 | việc tuần (lễ tuần, Mệnh Đồ, đồng tu); **lên bậc 3** `ACT-K3-TV` |
| 9 | 3 | 46,6 | 593 | 24 | 1 | ngự kiếm; Bút Tháp, Văn Miếu mở |
| 12 | 3 | 46,6 | 759 | 33 | 4 | |
| 15 | 3 | 121,6 | 959 | 39 | 6 | Sóc + việc tuần + Hội thí |
| 16 | 3 | 47,6 | 1.016 | 42 | 7 | ĐH ≥ 1.000 nhưng **D2 thiếu** (7 / 10) |
| 19 | 3 | 39,6 | 1.177 | 51 | 10 | đủ 10 ngày tu → **lên bậc 4** `ACT-K4-TV` |
| 21 | 4 | 47,6 | 1.293 | 54 | 1 | Tiên Thiên thôi tính; súc địa; đạo phụ thứ hai |
| 22 | 4 | 107,6 | 1.421 | 57 | 2 | việc tuần |
| 29 | 4 | 99,6 | 1.805 | 75 | 8 | việc tuần |
| 30 | 4 | 48,6 | 1.863 | 78 | 9 | Sóc |
| 38 | 4 | 49,6 | 2.271 | 99 | 16 | ĐH ≥ 2.200 nhưng D2 thiếu (16 / 20) |
| 43 | 4 | 109,6 | 2.578 | 111 | 20 | đủ 20 ngày tu → **lên bậc 5** `ACT-K5-TV` |
| 44 | 5 | 49,6 | 2.697 | 114 | 1 | Phong Đô, Tạng Địa mở; cưỡi hạc |
| … | | | | | | |
| 78 | 5 | — | ≈ 4.700 | 201 | 30 | đủ 30 ngày tu, Quy nhất → **bậc 6** (`09-10` §2.1) |

**Đọc nhật ký:** ở bậc 4 và bậc 5, người đều đặn TL 41 **chờ ngày củng cố** 5 ngày (d38 → d43) và vài ngày ở bậc 5 → 6. Trong thời gian chờ, Sổ Tu hiện «Củng cố 16 / 20» chứ không hiện «chưa đủ Đạo Hạnh» — người chơi hiểu rằng mình không chậm, chỉ đang «cho giày mềm» (`09-01` §4.3). Đây là trải nghiệm cần kiểm thử người dùng: nếu người chơi thấy bực, giảm `DWELL[4]` từ 20 xuống 15 (tác động: người chuyên tu về đích sớm hơn 5 ngày; người thong thả không đổi).

---

## 6. Ca biên dữ liệu

| Ca | Xử lý |
|---|---|
| Người chơi sinh trước 1900 hoặc sau 2100 | form hiện có chặn (`min="1900-01-01" max="2100-12-31"` trong `stations.js`) |
| Lá số không giờ | `09-01` §12.1 |
| Ngày lễ âm trùng ngày lễ tuần | nhận cả hai thưởng (khác nguồn), nhưng thời gian tập trung lễ tiết ưu tiên; lễ tuần dời buổi lặp |
| Tháng âm nhuận | Sóc / Vọng của tháng nhuận vẫn là lễ; Đình thí **không** mở ở tháng nhuận (một kỳ / tháng thường) |
| Lập Xuân rơi giữa Sóc và Tết | mùa game đổi ở Lập Xuân; Thái Tuế Điện ghi «năm tiết khí» |
| Người chơi đổi ngày giờ sinh trong 7 ngày đầu | tính lại Tiềm Lực, NT; ĐH đã có giữ, ĐCG tính lại (`09-01` §12.2) |
| Dư Hương khi đã bậc 6 | vẫn hoạt động (đẩy Thiên Bảng) |
| Ngày tài khoản có 23 / 25 giờ (giờ mùa hè ở nước ngoài) | `prevDay` hiện dùng ngày lịch, không 24 giờ (đã có trong `state.js`) — giữ |
