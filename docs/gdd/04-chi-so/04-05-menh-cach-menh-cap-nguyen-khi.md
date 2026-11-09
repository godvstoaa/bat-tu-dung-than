# 04-05 · Mệnh Cách, Mệnh Cấp, Nguyên Khí

## 1. Tổng quan

| Chỉ số | Câu hỏi nó trả lời | Ảnh hưởng chính |
|---|---|---|
| **Mệnh Cách** | «Câu chuyện của tôi bắt đầu thế nào?» | mở màn, người dẫn, nhánh `BR-*` |
| **Mệnh Cấp** | «Thầy gọi lá số tôi là gì?» | danh hiệu khung tên, lời chào; **không** cộng số |
| **Nguyên Khí** | «Hôm nay tôi làm được bao nhiêu việc nặng?» | thể lực hằng ngày |

## 2. `STAT-MENHCACH` — Mệnh Cách

### 2.1 Hàm ánh xạ (lớp game)

```js
export function menhCachOf(R) {
  const q = R.patternQuality?.quality ?? '未知';
  if (R.pattern?.type === 'special') {
    // E1: cách đặc biệt luôn là Dị Cách; chất lượng thành trạng thái con
    return { cls: 'DK', sub: q, kind: R.pattern.special?.kind ?? null, name: R.pattern.name };
  }
  const cls = { '成格': 'TT', '有救': 'DC', '败格': 'NT', '特殊': 'DK' }[q] ?? 'TT';
  return { cls, sub: q, kind: R.pattern?.type ?? null, name: R.pattern?.name ?? null,
           nguon: q === '未知' ? 'fallback' : 'engine' };
}
```

Lý do (phát hiện E1): từ đợt audit 2026-09, `pattern-quality › specialVerdict` chấm cách đặc biệt thành `成格 / 有救 / 败格` để vận cách cục chạy cùng một kênh; giá trị `特殊` chỉ còn khi `kind` lạ. Nếu game ánh xạ máy móc «特殊 → Dị Cách», **không người chơi nào** vào được lộ Dị Cách. Canon §5 ghi «Dị Cách (特殊)» theo nghĩa «cách đặc biệt»; tài liệu này hiện thực đúng nghĩa đó bằng `pattern.type`.

### 2.2 Bốn lớp

| Mã | Lớp | Điều kiện | Tỉ lệ (5.000 lá) | Mở màn (canon bản sơ đồ tổng §4.5) | Người dẫn | Nhánh |
|---|---|---|---|---|---|---|
| `STAT-MENHCACH-TT` | **Thuận Thiên** | `type ≠ special`, `quality = 成格` | **1,9%** | Tổ Sư nhận làm đệ tử ngay | Thầy Tử Bình `thay_tubinh` | `BR-TT-*` |
| `STAT-MENHCACH-DC` | **Đắc Cứu** | `type ≠ special`, `quality = 有救` | 32,2% | NPC chỉ đường đi tìm «vị thuốc» | Đan Đỉnh chân nhân `dan_dinh` | `BR-DC-*` |
| `STAT-MENHCACH-NT` | **Nghịch Thiên** | `type ≠ special`, `quality = 败格` | **50,9%** | Sơn Môn từ chối lúc đầu (tình tiết, không phạt) | Vân Cốc thiền sư `van_coc` | `BR-NT-*` |
| `STAT-MENHCACH-DK` | **Dị Cách** | `type = special` (mọi chất lượng) | 15,0% | lộ riêng «thuận theo thế» | Phương sĩ Vô Danh `phuong_si` | `BR-DK-*` |

Trạng thái con của Dị Cách: thành (真从 / 真化 / chuyên vượng thuần) 3,7% · có cứu (假从 / 假化 / hợp Sát) 5,8% · bại (破格) 5,5%.

### 2.3 Thuận Thiên — giữ cách

| Mục | Nội dung |
|---|---|
| Chủ đề | «Có sẵn thì phải giữ.» Thử thách không phải đi tìm, mà là **không đánh mất**. |
| Dữ liệu engine | `adjustDayunByGeju` gắn `gejuDelta` cho từng đại vận: `< 0` là **vận cách-nghịch**, `gejuWorsen` là vận làm bệnh nặng thêm. |
| Cơ chế | Mỗi đại vận cách-nghịch của chính người chơi (đọc từ `R.dayun`) là một **«ải giữ cách»** ở Vận Mệnh Các: cổng vận đó có khóa; mở bằng chuỗi giới luật (05 cấp `CQ-*`). Qua ải: danh hiệu «Thủ Cách». |
| Phần thưởng đặc trưng | Được Tổ Sư nhận ngay → mở sớm Tàng kinh các kệ 2 (không phải nút Ngũ Duy, chỉ là quyền vào). |
| Không có | Không có hệ số tu cao hơn, không có Căn Cơ thêm. Thuận Thiên đã có Tiềm Lực cao (mẫu `MAU-G` 63, `MAU-H` 70, `MAU-L` 86). |

### 2.4 Đắc Cứu — đi tìm vị thuốc

| Mục | Nội dung |
|---|---|
| Chủ đề | «Có bệnh mới quý» (`有病方为贵`, engine dẫn ở `analyze()`). Mỗi bệnh của cách có một thuốc **có thật trong lá số**. |
| Dữ liệu engine | `patternQuality.diseases[]` (bệnh: `via`, `killers`, `god`, `note`) · `rescues[]` (thuốc: `drug[]` là nhóm thập thần, `note`) |
| Liên kết Dụng thần | Với `有救`, `analyze()` thăng **thuốc đầu tiên** lên Dụng chính (nếu thuốc không phải Kỵ theo Phù Ức) → Thiên Mệnh Hành chính là vị thuốc. |
| Cơ chế | Đan Đỉnh chân nhân (Võ Đang, lò đan) mở «phương thuốc» của người chơi: mỗi `rescue` là một **vị** (`STAT-VITHUOC-<nhóm>`) ở một vùng/đạo thống (§2.6). Hái đủ vị → «thuốc thành», cảnh Thầy Tử Bình đọc lại cách: «bại mà có thành». |
| Số lần hái | = số phần tử `rescues[]` (mẫu: `MAU-A` 2 lần / 2 vị, `MAU-E` 2 lần / 1 vị, `MAU-F` 1, `MAU-I` 1, `MAU-O` 1) |

### 2.5 Nghịch Thiên — đi đường khác

| Mục | Nội dung |
|---|---|
| Chủ đề | «Cách vỡ không phải đời vỡ.» Liễu Phàm cũng bị đoán trước cả đời — rồi đổi. |
| Dữ liệu engine | `diseases[]` có ít nhất một bệnh **không** có thuốc trong lá số; `rescues[]` có thể có một phần (vd `MAU-B`: 3 bệnh, 2 thuốc). |
| Cơ chế | Cảnh từ chối (03 viết) → gặp Vân Cốc → **Mệnh Đồ** (`gaimenh › gaimenhPlan(R)`, 05) thay cho «phương thuốc»: thuốc không có trong lá số thì **tạo bằng việc làm** (công quá, giới luật). Mỗi bệnh không thuốc = một **«nút thắt»** trong Mệnh Đồ. |
| Vận cứu cách | Đại vận có `gejuRescue = true` (engine: «运中救应 — 运能改格») là **thời cơ vàng** của Nghịch Thiên: trong 10 năm đó, nút thắt tương ứng tháo được bằng một hoạt động thay vì một chuỗi. Vận Mệnh Các làm cổng vận đó sáng vàng. |
| Phần thưởng | Mở thẳng **Nghịch Thiên Lộ** (cùng lộ với Phẩm căn PC1–2). Không có hình phạt nào; Tiềm Lực đã được engine trừ 7 điểm cho 败格 → NT tự động cao hơn. |
| Ghi chú tỉ lệ | 50,9% người chơi. Lộ này là **lộ chính** về số lượng; 03 cần viết nó đầy đủ nhất. |

### 2.6 Vị thuốc theo nhóm thập thần — `STAT-VITHUOC-*`

`drug[]` của engine là mã nhóm. Mỗi nhóm thành một vị thuốc, gắn một vùng và một kiểu việc (cùng nhóm với Ngũ Duy để việc tìm thuốc cũng nuôi cây kỹ năng).

| Mã | Nhóm (`drug`) | Thập thần | Vị thuốc (tên game) | Vùng hái | Việc phải làm | Cây Ngũ Duy được XP |
|---|---|---|---|---|---|---|
| `STAT-VITHUOC-ti` | `ti` Tỷ Kiếp | 比肩 / 劫財 | **Đồng Tâm Thảo** | Yên Tử (rừng trúc) | đồng tu 3 buổi với người chơi hoặc NPC | Đồng đạo |
| `STAT-VITHUOC-yin` | `yin` Ấn | 正印 / 偏印 | **Văn Xương Chi** (nấm linh chi mọc trên mái Thư Lâu) | Thư Lâu Lâm, Văn Miếu | đọc 3 cổ thư, chép 1 bài | Học đạo |
| `STAT-VITHUOC-shi` | `shi` Thực Thương | 食神 / 傷官 | **Tú Linh Quả** (quả của tài hoa) | Võ Đang (lò đan) | luyện 1 lò đan, viết 1 câu đối | Nghệ đạo |
| `STAT-VITHUOC-cai` | `cai` Tài | 正財 / 偏財 | **Kim Tiền Thảo** | Huyền Thành (chợ), Lịch Đường | buôn 1 tuyến, bố thí phần lãi | Thương đạo |
| `STAT-VITHUOC-guan` | `guan` Quan Sát | 正官 / 七殺 | **Thiết Bì Lan** (lan vỏ sắt trên vách) | Chung Nam, Long Hổ | giữ một giới 7 ngày, xử 1 tranh chấp | Trị đạo |

Khi `drug` có 2 nhóm (vd luyue `['ti','yin']` ở `MAU-F`, `MAU-O`) → vị thuốc «kép», hái ở **một trong hai** vùng (người chơi chọn).

Tên vị thuốc theo **nhóm**, không theo hành, vì nhóm → hành đổi theo nhật chủ (`GROUP_WX`: với nhật chủ Kim, nhóm `shi` là Thủy; với nhật chủ Mộc, nhóm `shi` là Hỏa). Màu và hạt sáng của vị thuốc lấy theo **hành thật** của nhóm đó với nhật chủ người chơi, nên cùng là Tú Linh Quả mà người này thấy quả xanh nước, người kia thấy quả đỏ lửa. Số lần hái = `rescues.length`; số vị khác nhau = số nhóm khác nhau (vd `MAU-E` có 2 thuốc cùng nhóm `shi` → 1 vị, hái 2 lần).

### 2.7 Bệnh của cách — tên game và ánh xạ

| `via` (engine) | Nghĩa engine | Tên «bệnh» trong game | Hiện ở đâu |
|---|---|---|---|
| `noroot` | 格 thần hư phù, không thông căn | **Phù Căn** (rễ nổi) | Phương thuốc / Mệnh Đồ |
| `kong` | tàng cung 格 thần rơi không vong | **Treo Cung** | nút thắt chờ vận «xuất không» |
| `he` | 格 thần bị hợp mất | **Hợp Khứ** | |
| `ke` | nhóm killer khắc chủ cách | **Khắc Phá** | |
| `mix` | Quan Sát hỗn tạp | **Hỗn Tạp** | |
| `chong` | cung nguyệt bị hình xung | **Lay Gốc** | |
| `dang` | Tài đảng Sát / phù quá | **Đảng Thế** | |
| `duo` | Kiêu đoạt Thực / đoạt đặc trưng | **Đoạt Thực** | |
| `noyong` | luyue không Tài Quan | **Vô Dụng Xứ** (không chỗ dùng) | |
| `xoroot` | Tỷ/Kiếp đoạt Tài (财轻比重) — chỉ ở cách Tài | **Tranh Đoạt** | |
| `support-root` | cách tòng: Nhật chủ đắc gốc → «不肯从» | **Nghịch Thế** (thế bị cưỡng) | lộ Dị Cách |
| `<nhóm>-tougan` (vd `yin-tougan`, `ti-tougan` — chuỗi ghép động) | cách tòng / tòng vượng: nhóm trợ thân (hoặc nhóm khắc thế) **thấu can** | **Nghịch Thế · lộ** (vd `MAU-M`: «Ấn thấu can trợ thân (癸 偏印)») | lộ Dị Cách |
| `<nhóm>-tang` (chuỗi ghép động) | như trên nhưng chỉ **tàng** — thường được cứu theo định nghĩa 假从 | **Nghịch Thế · ẩn** | lộ Dị Cách |
| `guan` | chuyên vượng / tòng vượng: Quan Sát thấu khắc thân | **Phạm Vượng** | lộ Dị Cách |
| `clash-hua` | hóa khí: can khắc hóa thần thấu | **Phá Hóa** | lộ Dị Cách |
| `latent-support`, `latent-guan`, `latent-ke-tiet`, `latent-clash` (`latent: true`) | bệnh tiềm ẩn, chỉ phát khi gặp vận | **Thế Ẩn Họa** — không tính là nút thắt; chỉ hiện ở cổng vận tương ứng | lộ Dị Cách |

Danh sách `via` trên là **đủ** theo `pattern-quality.js` hiện tại (đã quét mọi `via:` trong tệp, kể cả 3 chỗ ghép chuỗi động `o.grp + '-tougan'`, `o.grp + '-tang'`, `grp + '-tougan'`). Bộ ánh xạ của game so khớp theo **hậu tố** (`-tougan`, `-tang`) để không phải liệt kê từng nhóm. `via` mới do engine thêm sau → tên game mặc định «Bệnh Cách» + `note` gốc, log `menhcach.via_unknown`.

Câu `note` của engine luôn mở được bằng «Xem lời gốc».

### 2.8 Dị Cách — thuận theo thế

Canon: «Lộ riêng: “thuận theo thế” thay vì “phù ức”. Dụng thần ngược thường lệ.» Người dẫn: Phương sĩ Vô Danh.

| Loại (`special.kind`) | Cách (engine) | Tỉ lệ / 3.000 | Dụng theo `PATTERN_PREF` | Lộ con | Chủ đề |
|---|---|---|---|---|---|
| `cong` (tòng nhược) | 從財格 Tòng Tài | 5,2% | Tài, Thực | **Tòng Lộ · Tài** | buông cái tôi, theo dòng của cải → học cho đi |
| `cong` | 從殺格 Tòng Sát | 3,7% | Quan Sát, Tài | **Tòng Lộ · Quyền** | theo kỷ luật lớn hơn mình |
| `cong` | 從兒格 Tòng Nhi | 4,0% | Thực Thương, Tài | **Tòng Lộ · Nghệ** | theo tài hoa, để tác phẩm nói thay |
| `cong` (tòng vượng) | 從旺格 Tòng Vượng | 0,7% | Tỷ, Ấn | **Vượng Lộ** | dồn thế vào một hướng |
| `zhuanwang` | 曲直 / 炎上 / 稼穡 / 從革 / 潤下 (Chuyên Vượng Mộc / Hỏa / Thổ / Kim / Thủy) | 0,2–0,4% mỗi cách | Thực Thương, Tỷ | **Chuyên Lộ · <hành>** | một hành tuyệt đối; tiết tú ra ngoài |
| `huaqi` | 化土 / 化金 / 化水 / 化木 / 化火 (Hóa khí) | 0,2–0,3% mỗi cách | nhóm của hóa thần + nhóm sinh hóa thần (`buildHuaqiPref`) | **Hóa Lộ · <hành>** | bỏ bản chất cũ, thành cái mới |

Trạng thái con:

| `quality` | Nghĩa trong lộ Dị Cách | Cơ chế |
|---|---|---|
| 成格 | thế thuần (真从 / 真化) | Bổ Dụng đổi thành **«Giữ thế»**: tránh để vận trợ thân phá thế; cổng vận có `gejuDelta < 0` là ải |
| 有救 | thế giả (假从, hợp Sát cứu) | như trên + 1 ải «hồi thế» khi vận chạm gốc ẩn |
| 败格 | thế bị phá (破格) | Phương sĩ dạy hai đường: **giữ thế bằng tu** (Mệnh Đồ) hoặc **trở về phù ức** (chuyển lộ sang Nghịch Thiên, giữ hết tiến độ) — lựa chọn của người chơi |

Lưu ý tính chất cổ pháp: cách đặc biệt phụ thuộc trường phái (`pattern.js › DEFAULT_SCHOOL = 'ditian'`, phái khoan của 滴天髓; phái `ziping` nghiêm hơn, ít cách tòng hơn). Game dùng **mặc định của trang chính** để hai nơi nói cùng một lời (T5). Không cho người chơi đổi trường phái trong game (tránh «chọn phái để đổi lộ»).

### 2.9 24 cách engine biết — bảng đầy đủ

Tỉ lệ trên mẫu 3.000 lá (seed 12345). «Thuận/Nghịch dụng» theo `PATTERN_PREF.shun`. Danh hiệu cách hiện dưới tên nhân vật khi mở Sổ Mệnh.

| Cách (engine) | Tên Việt (`PATTERN_VI`) | `type` | Tỉ lệ | Dụng | Hỷ | Kỵ | Thuận / Nghịch | Danh hiệu cách (game) |
|---|---|---|---|---|---|---|---|---|
| 正官格 | Chính Quan cách | normal | 9,4% | Quan | Tài, Ấn | Thực | thuận | «Chính Ngôn» |
| 七殺格 | Thất Sát cách | normal | 10,3% | Thực, Ấn | Thực | Tài | nghịch | «Nghiêm Kiếm» |
| 正財格 | Chính Tài cách | normal | 7,9% | Tài | Thực, Quan | Tỷ | thuận | «Cần Kiệm» |
| 偏財格 | Thiên Tài cách | normal | 8,2% | Tài | Thực, Quan | Tỷ | thuận | «Khoáng Đạt» |
| 正印格 | Chính Ấn cách | normal | 10,5% | Ấn | Quan | Tài | thuận | «Ôn Hậu» |
| 偏印格 | Thiên Ấn cách (Kiêu Thần) | normal | 10,2% | Tài | Tài | Tỷ | nghịch | «Kỳ Tư» |
| 食神格 | Thực Thần cách | normal | 8,2% | Thực | Tài, Quan | Ấn | thuận | «An Nhàn» |
| 傷官格 | Thương Quan cách | normal | 7,7% | Ấn, Tài | Tài, Ấn | Quan | nghịch | «Tài Hoa» |
| 建祿格 | Kiến Lộc cách | luyue | 4,2% | Tài, Quan | Tài, Quan, Ấn | Tỷ | thuận | «Tự Lập» |
| 月劫格 | Nguyệt Kiếp cách | luyue | 4,9% | Quan, Thực | Quan | Tài | nghịch | «Tranh Phong» |
| 羊刃格 | Dương Nhận cách | luyue | 2,5% | Quan, Thực | Quan | Tài | nghịch | «Cương Nhận» |
| 從財格 | Tòng Tài cách | special | 5,2% | Tài, Thực | Tài, Thực, Quan | Tỷ, Ấn | — | «Tùy Lưu» |
| 從殺格 | Tòng Sát cách | special | 3,7% | Quan, Tài | Quan, Tài | Tỷ, Ấn, Thực | — | «Tùy Uy» |
| 從兒格 | Tòng Nhi cách | special | 4,0% | Thực, Tài | Thực, Tài | Ấn, Tỷ, Quan | — | «Tùy Nghệ» |
| 從旺格 | Tòng Vượng cách | special | 0,7% | Tỷ, Ấn | Tỷ, Ấn | Quan, Tài, Thực | — | «Tụ Thế» |
| 曲直格 | Khúc Trực cách (Mộc) | special | 0,2% | Thực, Tỷ | Ấn | Quan | — | «Thanh Lâm» |
| 炎上格 | Diêm Thượng cách (Hỏa) | special | 0,2% | Thực, Tỷ | Ấn | Quan | — | «Liệt Dương» |
| 稼穡格 | Giá Sắc cách (Thổ) | special | 0,4% | Thực, Tỷ | Ấn | Quan | — | «Hậu Điền» |
| 從革格 | Tòng Cách cách (Kim) | special | 0,2% | Thực, Tỷ | Ấn | Quan | — | «Bách Luyện» |
| 潤下格 | Nhuận Hạ cách (Thủy) | special | 0,3% | Thực, Tỷ | Ấn | Quan | — | «Vạn Lưu» |
| 化土格 | Hóa Thổ (Giáp Kỷ) | special | 0,2% | theo `buildHuaqiPref` | | | — | «Hóa Thổ» |
| 化金格 | Hóa Kim (Ất Canh) | special | 0,2% | 〃 | | | — | «Hóa Kim» |
| 化水格 | Hóa Thủy (Bính Tân) | special | 0,2% | 〃 | | | — | «Hóa Thủy» |
| 化木格 | Hóa Mộc (Đinh Nhâm) | special | 0,2% | 〃 | | | — | «Hóa Mộc» |
| 化火格 | Hóa Hỏa (Mậu Quý) | special | 0,3% | 〃 | | | — | «Hóa Hỏa» |

Bảng Dụng/Hỷ/Kỵ ở trên là **ưa ghét của cách** (`PATTERN_PREF`), khác `yong` (Dụng thần cuối cùng của lá số, đã qua Phù Ức, Điều Hậu…). Game dùng `yong` cho Thiên Mệnh; dùng `PATTERN_PREF` chỉ để Phương sĩ/Thầy giảng chữ.

### 2.10 Ca biên Mệnh Cách

| Ca | Xử lý |
|---|---|
| `patternQuality` null / `未知` | Thuận Thiên `nguon: 'fallback'`; mở màn trung tính (03 có một cảnh dự phòng). Chưa gặp trên 3.000 lá. |
| `quality = 特殊` (kind lạ) | Dị Cách, trạng thái con «thế chưa định», như 成格. |
| Giờ không rõ làm đổi Mệnh Cách | Có thật: `MAU-N` (2000-02-29) ở giờ Ngọ là Chính Ấn cách, 10/12 canh giờ còn lại là Thương Quan cách (đều 败格). Game dùng giờ Ngọ theo quy ước, ghi chú «cách có thể khác nếu biết giờ» (04-11 §2). |
| Sửa bát tự đổi lớp | Nhiệm vụ nhánh cũ đã xong giữ thưởng; nhánh mới mở từ đầu; vị thuốc đã hái được quy đổi thành vật phẩm lưu niệm (04-11 §9). |

## 3. `STAT-MENHCAP` — Mệnh Cấp

### 3.1 Đặc tả

| Mục | Giá trị |
|---|---|
| Nguồn | `chart-level › classifyChartLevel(R)` → `level`, `passCount`, `rawPassCount`, `capped`, `criteria[6]` |
| Lớp game | đổi tên hiển thị (không dùng `levelVi` — E6) |
| Thang | 6 bậc + `unknown` |
| Tác động | danh hiệu khung tên, lời chào đầu của NPC, khung ảnh đại diện; **không** cộng chỉ số |

### 3.2 Sáu tiêu chí (engine)

| # | Tiêu chí | Đạt khi | Giải thích cho người chơi |
|---|---|---|---|
| 1 | 格局成败 | `pattern.type` là normal / special / luyue (luyue được tính từ loop 63) | «Lá số có khung» |
| 2 | 用神有力 | Dụng ≥ 15% | «Hành cần nhất đủ lực» |
| 3 | 清浊 | không tổ hợp hung | «Không có cặp sao giằng co» |
| 4 | 配合流通 | hành lớn nhất < 50% **và** nhỏ nhất > 5% | «Ngũ hành tương đối đều» |
| 5 | 吉神 | ≥ 3 cát tinh trong {tianYi, tianDe, yueDe, wenChang, jiangXing, jinYu, sanQi, luShen} | «Nhiều sao lành» |
| 6 | 运势 | ≥ 3 trong 8 đại vận đầu có điểm ≥ 2 | «Nhiều đại vận thuận» |

Chặn (engine): Tiềm Lực < 22 → tối đa 1 tiêu chí; < 31 → 2; < 40 → 3. Có ≥ 2 tổ hợp «đại bại» chưa chế (`shangGuan`, `xiaoShi`, `qunJie`, `shaGong`) → tối đa 2; có 1 → tối đa 3.

### 3.3 Sáu bậc

| `level` | Đạt | Tên game (khung tên) | Tên gốc (trong «Vì sao?») | Tỉ lệ | Khung | Lời chào đầu (Lão Tùng, cổng) |
|---|---|---|---|---|---|---|
| 极品 | 6/6 | **Cực Phẩm** | Cực Phẩm 极品 | 0,2% | khung vàng chạm rồng mây | «Lão giữ cổng bốn mươi năm, đây là lần thứ hai thấy chuông tự ngân như vậy.» |
| 贵格 | 5 | **Quý Cách** | Quý Cách 贵格 | 7,3% | khung vàng | «Khách quý. Mời vào.» |
| 富格 | 4 | **Phú Cách** | Phú Cách 富格 | 19,1% | khung đồng | «Người có phúc lộc. Vào đi, trà đang nóng.» |
| 清贵 | 3 | **Thanh Quý** | Thanh Quý 清贵 | 41,5% | khung gỗ mun | «Khí sắc thanh. Thầy đang chờ.» |
| 常格 | 2 | **Thường Cách** | Thường Cách 常格 | 25,6% | khung gỗ mộc | «Người thường thì đường rộng nhất. Vào đi.» |
| 下格 | 0–1 | **Ngọc Trong Đá** | Hạ Cách 下格 | 6,3% | khung đá xanh có vân ngọc | «Đá xấu ngoài mà ngọc ở trong. Lão mở cổng cho con.» |
| `unknown` | — | (không danh hiệu) | — | — | khung trơn | lời chào chung |

Quy tắc chữ: **không bao giờ** hiển thị `levelVi` của engine (có chữ «bần tiện» ở 下格) hay `note` có «Mệnh nhiều khó». Người chơi được **tắt** danh hiệu Mệnh Cấp khỏi khung tên (Cài đặt › Riêng tư); khi tắt, khung hiện Cảnh giới.

### 3.4 Khi Mệnh Cấp bị chặn

Nếu `capped = true`, «Vì sao?» hiện: «Đạt 4/6 tiêu chí nhưng lá số có cặp sao “đại bại” chưa chế → Thầy xếp tối đa Thanh Quý. Khi cặp sao được chế (vận Ấn đến, hoặc bạn tu …), cách sẽ thanh hơn.» Chữ «đại bại» chỉ trong «Xem lời gốc»; mặt chính dùng «cặp sao giằng co».

### 3.5 Kiểm chứng

| Mẫu | Đạt | Thô | Chặn | `level` | Tên game |
|---|---|---|---|---|---|
| `MAU-A` | 3 | 3 | — | 清贵 | Thanh Quý |
| `MAU-C` | 2 | 3 | Tiềm Lực 23 < 31 | 常格 | Thường Cách |
| `MAU-F` | 4 | 4 | — | 富格 | Phú Cách |
| `MAU-J` | 3 | 4 | tổ hợp đại bại chưa chế (`shangGuan`) | 清贵 | Thanh Quý |
| `MAU-O` | 5 | 5 | — | 贵格 | Quý Cách |

## 4. `STAT-NGUYENKHI` — Nguyên Khí

### 4.1 Đặc tả

| Mục | Giá trị |
|---|---|
| Nguồn | `vitality › analyzeVitality(R).baseVitality` = `round(pct[Nhật chủ] × 0,4 + pct[Dụng] × 0,6)` |
| Lớp game | **NK tối đa** = `100 + round(baseVitality × 0,5)` |
| Thang nền | 0–100 (thực tế 5–73; trung vị 22) |
| Thang tối đa | 100–150 (thực tế 103–137; trung vị 111) |
| Hiển thị | bình hồ lô ở HUD; «Nguyên Khí 87 / 112» |
| Tooltip | «Nguyên Khí nền 23 = 40% hành Nhật chủ (Kim 55%) + 60% hành Dụng (Thủy 2%). Tối đa 112.» |

Sàn 100 bảo đảm **mọi lá số** làm được một phiên chơi đầy đủ (~5 việc nặng) trước khi cần nghỉ. Chênh giữa lá số Nguyên Khí thấp nhất và cao nhất chỉ là ~1 việc nặng/ngày. Đây là chủ ý: Nguyên Khí là **nhịp**, không phải rào.

### 4.2 Tiêu và hồi

| Việc | Tốn NK | Ghi chú |
|---|---|---|
| Leo thần đạo (mỗi chặng ≥ 200 bậc) | 15 | |
| Tĩnh tọa dài (≥ 10 phút thật) | 20 | tĩnh tọa ngắn ≤ 5 phút **hồi** 10 |
| Luyện đan (một lò) | 12 | |
| Du phương (mỗi chặng giữa 2 vùng, đi bộ) | 8 | trạm đi nhanh: 0 |
| Khoa cử (một vòng) | 25 | |
| Cứu người trúng yểm (một ca) | 20 | |
| Giải án khách | 10 | |
| Trò chuyện, đọc ngắn, mua bán, dạo chơi, xem Mệnh Bàn | 0 | việc nhẹ không tốn |

| Cách hồi | Lượng | Giới hạn |
|---|---|---|
| Thời gian thật (cả lúc thoát game) | 8 + Sinh Cơ M1 (0–5) / giờ | — |
| Uống trà (quán, nhà riêng) | +15 (+5 với `STAT-ND-THUC-02`) | 3 lần/ngày |
| Ngủ ở nhà riêng / khách điếm | +50 | 1 lần/ngày |
| Đan Hồi Nguyên | +30 (thượng phẩm ×1,5) | không giới hạn, tốn nguyên liệu |
| Tĩnh tọa ngắn | +10 | 4 lần/ngày |

NK = 0: việc nặng tạm khóa, việc nhẹ mở hết; NPC gần nhất gợi ý trà/nghỉ. Không có trạng thái suy yếu, không giảm thưởng.

### 4.3 Sinh lực theo đại vận (`currentVitality`)

`analyzeVitality.trajectory[]` chấm từng đại vận (50 ± hành Dụng/Hỷ/Kỵ/Cừu của can/chi vận ± thập thần can vận, kẹp 10–95). Game dùng hai cách, đều chỉ cộng:

| `currentVitality` | Tên | Tác động |
|---|---|---|
| ≥ 65 | **Khí Thịnh** | hồi theo giờ +2 |
| 45–64 | Khí Bình | — |
| < 45 | **Dưỡng Sinh** | trà và ngủ hồi thêm 25%; Thầy gợi ý bài dưỡng sinh (`cultivation-data`) |

Ở Vận Mệnh Các, cổng đại vận có `peakAge` sáng chữ «Đỉnh sinh lực», cổng `lowAge` ghi «Mùa dưỡng sức» (không ghi «đáy»).

`MAU-A` năm 2026: `currentVitality` 58 (Khí Bình); đỉnh 88–97 tuổi, mùa dưỡng sức 48–57 tuổi.

### 4.4 Dưỡng Khí (Hậu Thiên)

Tu nội đan (Võ Đang `huyen_hu`), Thái Cực, dưỡng sinh nâng **NK tối đa Hậu Thiên** +1 mỗi chặng, trần **+30**. Hiển thị là đoạn sáng nối vào bình hồ lô. Không mua được.

### 4.5 Ca biên

| Ca | Xử lý |
|---|---|
| `R.asOfYear` chưa đặt | `currentVitality` theo đồng hồ máy (không tất định) — `buildMenhBan` luôn đặt (E3). |
| `dayun` rỗng | `trajectory` rỗng, `currentVitality = 0` → coi là Khí Bình (không áp «Dưỡng Sinh» vì không có dữ liệu). |
| Người chơi trên 117 tuổi (năm sinh rất xa) | Ngoài bảng 12 đại vận → `current` lấy đại vận đầu (hành vi engine). Không ảnh hưởng NK tối đa. |
| Dụng thần đổi do Sửa bát tự | NK tối đa tính lại; NK hiện tại giữ nguyên số tuyệt đối, kẹp vào tối đa mới. |

## 5. Checklist nghiệm thu phần 04-05

- [ ] `menhCachOf` dùng `pattern.type === 'special'` cho Dị Cách (E1); kiểm 15 mẫu.
- [ ] Đắc Cứu: số lần hái = `rescues.length`, số vị = số nhóm khác nhau; vị kép cho `drug` hai nhóm; màu vị theo hành thật của nhóm.
- [ ] Nghịch Thiên: mỗi bệnh không thuốc = 1 nút thắt Mệnh Đồ; vận `gejuRescue` sáng vàng.
- [ ] Dị Cách 败格 cho phép chuyển sang Nghịch Thiên, giữ tiến độ.
- [ ] Không hiển thị `levelVi`, `note` của `classifyChartLevel`.
- [ ] NK tối đa = 100 + round(nền × 0,5); việc nhẹ không tốn NK; NK = 0 không giảm thưởng.
