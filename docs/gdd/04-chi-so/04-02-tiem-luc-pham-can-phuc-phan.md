# 04-02 · Tiềm Lực, «Vì sao?», Phẩm căn, Phúc phận

## 1. `STAT-TIEMLUC` — Tiềm Lực (căn cốt Tiên Thiên)

### 1.1 Đặc tả

| Mục | Giá trị |
|---|---|
| Nguồn | `chart.js › analyze() → R.synthesis.score` (do `synthesis.js › synthesize` tính) |
| Công thức engine | gốc **45**, cộng/trừ theo 17 nhóm lý do (§3), `Math.round`, kẹp `[0, 100]` |
| Lớp game | không biến đổi — dùng nguyên số |
| Kiểu | số nguyên 0–100 |
| Hiển thị | số lớn ở tâm vòng Mệnh Bàn + tên Phẩm căn bên dưới; không thanh tiến độ (tránh cảm giác «chưa đầy») |
| Chữ cạnh số | «Tiềm Lực 41 · Tứ Linh Căn» |
| Tooltip ngắn | «Điểm hạt giống của lá số: 45 làm gốc, cộng trừ theo khung lá số, Dụng thần, tổ hợp sao… Bấm “Vì sao?” để xem từng dòng.» |
| Đổi được không | Không. Đổi khi và chỉ khi Sửa bát tự (04-11 §9) hoặc nâng engine ở ranh mùa (04-01 §7.3) |
| Phân bố thật | nhỏ nhất 9 · trung vị 48 · lớn nhất 86 (5.000 lá) |

### 1.2 Tác động lối chơi

Tiềm Lực **không** cộng sức mạnh trực tiếp ở bất kỳ hoạt động nào. Nó tác động qua đúng ba kênh (đều theo canon):

| Kênh | Công thức | Ví dụ 20 / 41 / 86 |
|---|---|---|
| **Căn Cơ** (`STAT-CANCO`) — điểm cảnh giới sẵn có, chỉ tính cho bậc 1–3 | `CC = TL × 0,4` (giữ 1 chữ số thập phân) | 8,0 / 16,4 / 34,4 |
| **Hệ số Nghịch Thiên** (`STAT-NGHICHTHIEN`) — nhân Đạo Hạnh | `NT = clamp(1 + (60 − TL)/100, 1,0, 1,5)` | ×1,40 / ×1,19 / ×1,00 |
| **Phẩm căn** — bậc tên gọi, mở lộ, nghi lễ | ngưỡng §4 | Phàm Căn / Tứ Linh Căn / Thiên Linh Căn |

Hai kênh đầu kéo ngược chiều nhau: điểm cao có Căn Cơ lớn hơn (tối đa 40 điểm, so với ngưỡng bậc 2 là 100), điểm thấp có NT lớn hơn (tối đa ×1,5 trên mọi Đạo Hạnh suốt đời). Kết quả cân bằng ở 04-08 §4: **người điểm thấp lên cảnh giới cao nhanh hơn**, đúng tinh thần «khổ tận cam lai» của canon.

### 1.3 Ca biên

| Ca | Xử lý |
|---|---|
| `score` đúng ngưỡng (vd 28, 36) | Ngưỡng là `≥` (khớp `synthesis.js`): 28 → Ngũ Linh Căn, 27 → Phàm Căn. |
| Tổng trước kẹp < 0 hoặc > 100 | Engine đã kẹp; «Vì sao?» hiện tổng thô và dòng «(kẹp trong 0–100)». Quét 4.000 lá: chưa gặp ca kẹp. |
| Giờ không rõ | Tiềm Lực tính ở 12:00 nhưng hiển thị kèm **khoảng** 12 canh giờ (04-11 §2), vd `MAU-N`: «41 (khoảng 31–58)». |
| Engine lỗi | Không có số; không tạo nhân vật (04-01 §6). |

## 2. `STAT-BACHPHAN` — bách phân vị

| Mục | Giá trị |
|---|---|
| Nguồn | `R.synthesis.percentile` |
| Công thức engine | nội suy tuyến tính từng đoạn qua các mốc neo (lá số 2.160 lá): 14→1, 31→7, 41→31, 52→65, 62→90, 83→99; kẹp 1–99 |
| Kiểu | số nguyên 1–99 |
| Chữ | «Hiếm hơn 69% lá số» (dùng `100 − percentile` khi `percentile ≥ 50`) hoặc «Hơn 31% lá số» khi `< 50` — **xem quy tắc an toàn §2.2** |

### 2.1 Bảng tra (tính từ đúng công thức engine)

| Tiềm Lực | Bách phân | Tiềm Lực | Bách phân | Tiềm Lực | Bách phân |
|---|---|---|---|---|---|
| ≤ 17 | 1 | 36 | 19 | 54 | 70 |
| 18–20 | 2 | 38 | 24 | 56 | 75 |
| 21–22 | 3 | 40 | 29 | 58 | 80 |
| 23–24 | 4 | 41 | 31 | 60 | 85 |
| 25–27 | 5 | 43 | 37 | 62–63 | 90 |
| 28–29 | 6 | 45 | 43 | 64–65 | 91 |
| 30–31 | 7 | 47 | 50 | 70–71 | 94 |
| 32 | 9 | 48 | 53 | 73 | 95 |
| 33 | 12 | 50 | 59 | 76–77 | 97 |
| 35 | 17 | 52 | 65 | ≥ 80 | 99 |

### 2.2 Quy tắc hiển thị (an toàn)

- Bách phân vị **không** nằm ở mặt trước Mệnh Bàn. Nó nằm trong ngăn «Vì sao?», dòng cuối.
- Khi `percentile < 30`: hiện kèm ngay dòng «Hệ số Nghịch Thiên ×1,xx — mỗi điểm tu của bạn được nhân lên». Không bao giờ hiện bách phân vị thấp đứng một mình.
- Người chơi có thể tắt hẳn dòng này (Cài đặt › Riêng tư › «Ẩn so sánh với người khác»).
- Không dùng chữ «top x%» với `percentile < 50` (engine có câu «top …%» trong `paragraphs[0]`; game không dùng `paragraphs[0]` nguyên văn).

## 3. `STAT-VISAO` — «Vì sao?»

### 3.1 Nguyên tắc

Mỗi chỉ số Tiên Thiên có nút «Vì sao?». Với Tiềm Lực, nó liệt kê **từng dòng** `R.synthesis.factors` theo đúng thứ tự engine, mỗi dòng có Δ, nhãn nhóm, câu diễn giải dễ hiểu và (nếu có) **lối đi** trong game. Câu gốc của engine luôn mở được bằng «Xem lời gốc» (minh bạch, T5).

### 3.2 17 nhóm lý do của `synthesize`

Tần suất đo trên 4.000 lá số (seed 99). Δ là các giá trị **đã thấy thật**.

| Mã | Nhóm (engine) | Điều kiện trong `synthesis.js` | Δ | Tần suất | Câu diễn giải trong game | Lối đi |
|---|---|---|---|---|---|---|
| `STAT-VISAO-F01` | 格局成败 | `patternQuality.quality`: 成格 +6, 有救 +2, 败格 −7, 特殊 +3, 未知 0 | +6 / +2 / −7 | 成 6,0% · 救 38,2% · bại 55,8% | «Khung lá số (cách cục) của bạn ở trạng thái …» | Mệnh Cách (04-05) |
| `STAT-VISAO-F02` | Loại cách | `pattern.type`: special +6, normal +4, luyue 0 | +6 / +4 / 0 | 16,1 / 71,0 / 12,9% | «Lá số có khung rõ ràng» / «tháng sinh là sao đồng loại, Dụng thần lấy chỗ khác» | — |
| `STAT-VISAO-F03` | Dụng có lực | `wx.score[Dụng]/total`: ≥ 15% +6; < 8% −6 | +6 / −6 | 54,3 / 22,1% | «Hành cần nhất của bạn (Thủy) đang mạnh / còn mỏng» | Chuỗi bổ Dụng (04-03 §3) |
| `STAT-VISAO-F04` | Dụng thấu can | hành Dụng có ở can năm/tháng/giờ | +3 | 49,7% | «Hành cần nhất lộ ra ngoài, dễ dùng» | — |
| `STAT-VISAO-F05` | Hỷ thần | Hỷ ≥ 12% +5; ngược lại −3 | +5 / −3 | 74,1 / 25,9% | «Có / thiếu nguồn nuôi hành cần nhất» | chuỗi bổ Hỷ (nhánh phụ của Bổ Hành) |
| `STAT-VISAO-F06` | Kỵ thái quá | Kỵ ≥ 25% | −6 | 25,4% | «Hành cần tránh đang nhiều — đó là nơi thử thách của bạn (thưởng ×1,3)» | hoạt động Kỵ (04-03 §5) |
| `STAT-VISAO-F07` | Dụng ≥ Kỵ | `wx.score[Dụng] ≥ wx.score[Kỵ]` | +3 | 50,0% | «Thế chủ động» | — |
| `STAT-VISAO-F08` | Tổ hợp hung | −5 × số tổ hợp tone `xiong` | −5 … −20 | 92,8% | «Có cặp sao giằng co; dòng “Hóa giải” cho biết sao nào đã chế» | cờ `STAT-FLAG-*` (04-07 §5) |
| `STAT-VISAO-F09` | Tổ hợp cát | +3 × min(số tổ hợp `cat`, 2) | +3 / +6 | 100% | «Có cặp sao nâng nhau» | cờ `STAT-FLAG-*` |
| `STAT-VISAO-F10` | Xung/hình nhiều | ≥ 2 xung hoặc ≥ 2 hình | −5 | 18,3% | «Các trụ va nhau nhiều — đời nhiều chuyển động» | — |
| `STAT-VISAO-F11` | Nhật chi bị xung | xung chạm chi ngày | −3 | 22,9% | «Cung gốc hay bị lay — cần chỗ dựa» | Thân Lực / quý nhân |
| `STAT-VISAO-F12` | Tam hợp về Dụng | tam hợp/tam hội hóa đúng hành Dụng | +4 | 2,0% | «Ba chi hợp về hành cần nhất» | — |
| `STAT-VISAO-F13` | Nhiều cát tinh | ≥ 2 trong {tianYi, tianDe, yueDe, wenChang, jiangXing, jinYu, sanQi} | +3 | 78,0% | «Có nhiều sao lành» | Đặc Tính (04-06) |
| `STAT-VISAO-F14` | Không vong | −2 × số trụ rơi không vong | −2 / −4 / −6 | 42,7% | «Một số trụ đang “treo”, đợi năm/vận đến mới phát» | Thời Vận (04-08) |
| `STAT-VISAO-F15` | 源流 dòng khí | vòng đủ 5/5 +5; thông ≥ 3 +2; trệ ≤ 1 −4 | +5 / +2 / −4 | 1,5 / 21,1 / 47,0% | «Dòng khí ngũ hành chảy thông / còn tắc ở hành …» | Bổ Hành hành tắc |
| `STAT-VISAO-F16` | 盖头截脚 | −2/trụ khắc trúng Dụng, +1/trụ khắc trúng Kỵ | −8 … +3 | 65,2% | «Can chi trong cùng trụ khắc nhau, chạm đúng hành cần / hành tránh» | — |
| `STAT-VISAO-F17` | 拱夹 | 拱祿 +5, 拱貴 +3, kẹp Dụng +2 (cộng dồn) | +2 … +10 | 26,4% | «Hai trụ “ôm” một sao quý ở giữa» | — |

Kiểm tra số học: lấy 45 + tổng Δ của mọi dòng, so với `score`: **4.000/4.000 khớp**.

### 3.3 Bộ tách Δ tạm thời

Do `factors` là chuỗi (E2 ở README), game dùng bộ tách sau cho tới khi engine có trường số:

```js
// Tách Δ từ một dòng factor của synthesize(). Đã kiểm 4.000 lá số: 45 + ΣΔ === score.
export function factorDelta(t) {
  const s = t.replace(/−/g, '-');                      // engine dùng cả «−» (U+2212) lẫn «-»
  if (s.startsWith('盖头截脚')) {                        // dòng này có 2 số trong ngoặc: cộng cả hai
    return [...s.matchAll(/\(([+-]\d+)\)/g)].reduce((a, m) => a + +m[1], 0);
  }
  const all = [...s.matchAll(/(?<![\d/])([+-]\d+)(?![\d/%])/g)].map(m => +m[1]);
  return all.length ? all[all.length - 1] : 0;          // số có dấu cuối cùng là Δ
}
```

Đề nghị engine (**chưa có — cần làm**): `synthesize` trả thêm `factorsStructured: [{ key: 'F03', delta: -6, text }]`; giữ `factors` cũ để trang chính không đổi. Khi có, game bỏ bộ tách.

### 3.4 Bố cục ngăn «Vì sao?»

```
┌ Vì sao Tiềm Lực = 41? ─────────────────────────────── [Xem lời gốc] ┐
│ Gốc                                                         45       │
│ ▲ Khung lá số: Thất Sát cách, có cứu (bại mà có thành)      +2       │
│ ▲ Lá số có khung rõ ràng                                     +4       │
│ ▼ Hành cần nhất (Thủy) còn mỏng: 2%          → [Chuỗi bổ Thủy] −6     │
│ ▲ Có nguồn nuôi hành cần nhất (Kim 55%)                       +5       │
│ ▼ Hai cặp sao giằng co (1 cặp đã được chế)   → [Xem cặp sao]  −10     │
│ ▲ Hai cặp sao nâng nhau                                       +6       │
│ ▲ Nhiều sao lành (Thiên Đức, Nguyệt Đức, Tướng Tinh)          +3       │
│ ▼ Dòng khí còn tắc (1/5)                     → [Bổ Hành]      −4       │
│ ▼ Hai trụ khắc trúng hành cần                                 −4       │
│ ─────────────────────────────────────────────────────────────────── │
│ Tổng                                                         41       │
│ Hệ số Nghịch Thiên ×1,19 · Hơn 31% lá số (ẩn được)                   │
│ «Lá số là hạt giống, không phải cái cây.» — Thầy Tử Bình             │
└──────────────────────────────────────────────────────────────────────┘
```

- Dòng ▼ luôn kèm **lối đi** nếu nhóm có lối đi; không có dòng ▼ nào đứng một mình không lời giải (04-13 §3).
- Thứ tự giữ đúng engine; không sắp xếp «xấu lên trước».
- Câu cuối xoay vòng trong bộ câu dẫn của 04-13 §2.

### 3.5 «Vì sao?» của các chỉ số khác

| Chỉ số | Nội dung ngăn «Vì sao?» |
|---|---|
| Phẩm căn | ngưỡng 10 bậc, vị trí của mình, dòng `gradeVi`/`grade` gốc |
| Phúc phận | điều kiện engine (`score` + số tổ hợp cát) và bảng Phúc theo bậc (§5.3) |
| Ngũ Hành Lực | `wx.pct`, hệ số ×1,3/×0,8, ghi chú «không vong làm tàng can giảm 50%» nếu có trụ không vong |
| Thân Lực | `ratio`, `deLenh` (đắc lệnh), `deDia` (đắc địa), `qiPhase`, `sanFaBonus` → `effRatio` |
| Thiên Mệnh | `yong.reasons[]` và `yong.method[]` nguyên văn |
| Ngũ Duy | `dims[].gods` (số sao từng thập thần) |
| Mệnh Cách | `patternQuality.summary`, `diseases[]`, `rescues[]` |
| Mệnh Cấp | 6 tiêu chí `criteria[]` (đạt/không) + `capped`/lý do chặn |
| Nguyên Khí | `constitution`, trọng số 0,4 Nhật chủ + 0,6 Dụng |
| Đặc Tính | vị trí `at[]`, khẩu quyết `SHENSHA_KOUJUE` của sao |
| Túc Nghiệp | điểm 6 cõi, tam độc, **lời miễn trừ của engine** (`disclaimer`) |
| Thời Vận | can chi vận/năm, `score`, `rating`, ghi chú `_kwNote`, `_ylNote`, `gejuNote` |

## 4. `STAT-PHAMCAN` — 10 bậc Phẩm căn

### 4.1 Đặc tả

| Mục | Giá trị |
|---|---|
| Nguồn | `R.synthesis.score` qua đúng ngưỡng của `synthesis.js` (khớp `gradeVi`) |
| Công thức | `PHAMCAN.find(([ngưỡng]) => score >= ngưỡng)` với ngưỡng 86 / 80 / 73 / 66 / 58 / 50 / 43 / 36 / 28 / 0 |
| Kiểm chéo | `gradeVi` của engine phải bắt đầu bằng chữ tương ứng; lệch → log `menhban.grade_mismatch` |
| Kiểu | mã `PC1`…`PC10` + tên |
| Hiển thị | tên dưới số Tiềm Lực; «Vì sao?» hiện thêm `gradeVi` rút gọn (bỏ ngoặc) và tên gốc `grade` |

### 4.2 Bảng đầy đủ

`gradeVi` dưới đây là chuỗi engine **rút gọn đến dấu ngoặc**; phần trong ngoặc của engine không hiển thị ở mặt trước.

| Mã | Ngưỡng | `grade` | `gradeVi` (rút gọn) | Phẩm căn | Tỉ lệ | NT | Căn Cơ | Mô tả cho người chơi |
|---|---|---|---|---|---|---|---|---|
| `STAT-PHAMCAN-10` | ≥ 86 | 上 | ĐỈNH CAO HUYỀN THOẠI · CỰC PHẨM | **Thiên Linh Căn** | < 0,1% | ×1,00 | 34,4–40 | «Trời ban sẵn — con đường là giữ, không phải cải. Thử thách của bạn là tâm “mạn”.» |
| `STAT-PHAMCAN-09` | 80–85 | 上 | THƯỢNG ĐẲNG XUẤT CHÚNG · CỰC HIẾM | **Dị Linh Căn** | 0,2% | ×1,00 | 32–34 | «Hiếm có. Nhiều cửa mở sẵn — chọn cửa nào là việc của bạn.» |
| `STAT-PHAMCAN-08` | 73–79 | 上 | THƯỢNG ĐẲNG · Rất hiếm | **Song Linh Căn thượng** | 1,7% | ×1,00 | 29,2–31,6 | «Hai dòng linh khí mạnh, thuận nhau. Giữ được thì đi xa.» |
| `STAT-PHAMCAN-07` | 66–72 | 上 | THƯỢNG ĐẲNG · Hiếm | **Song Linh Căn** | 4,8% | ×1,00 | 26,4–28,8 | «Nền vững. Cái khó của bạn là đừng dừng ở cái dễ.» |
| `STAT-PHAMCAN-06` | 58–65 | 中上 | TRUNG THƯỢNG CAO · Khá hiếm | **Tam Linh Căn thượng** | 13,5% | ×1,02–1,00 | 23,2–26,0 | «Ba dòng khí có thứ tự. Học đúng chỗ là tiến nhanh.» |
| `STAT-PHAMCAN-05` | 50–57 | 中上 | TRUNG THƯỢNG · Khá tốt | **Tam Linh Căn** | 21,5% | ×1,10–1,03 | 20,0–22,8 | «Trên đa số. Đường rộng, cần chọn hướng.» |
| `STAT-PHAMCAN-04` | 43–49 | 中 | TRUNG ĐẲNG THUẬN · Cân bằng tốt, ổn định | **Tứ Linh Căn thuận** | 21,8% | ×1,17–1,11 | 17,2–19,6 | «Cân bằng, ổn định. Không có chỗ quá yếu để sợ.» |
| `STAT-PHAMCAN-03` | 36–42 | 中 | TRUNG ĐẲNG · Cân bằng, cần nỗ lực | **Tứ Linh Căn** | 19,3% | ×1,24–1,18 | 14,4–16,8 | «Bốn dòng khí, một dòng còn mỏng. Chỗ mỏng là chỗ đáng tu.» |
| `STAT-PHAMCAN-02` | 28–35 | 中下 | TRUNG HẠ · Khá vất vả, có Dụng thì bứt phá được | **Ngũ Linh Căn** («tạp căn») | 11,7% | ×1,32–1,25 | 11,2–14,0 | «Năm dòng khí lẫn nhau — tạp mà rộng. Nghịch Thiên Lộ mở cho bạn.» |
| `STAT-PHAMCAN-01` | < 28 | 下 | HẠ ĐẲNG · Nhiều thử thách, «có bệnh mới quý» | **Phàm Căn** | 5,5% | ×1,50–1,33 | 0–10,8 | «Hạt giống nhỏ — phải chăm nhiều hơn. Hệ số tu của bạn cao nhất game.» |

Ghi chú: tên «linh căn» mượn tiểu thuyết tu tiên cho dễ hiểu (canon §4.2 bản sơ đồ tổng). «Vì sao?» luôn ghi tên gốc `gradeVi` để không tách khỏi cổ pháp.

### 4.3 Tác động theo bậc

Phẩm căn **không** cộng chỉ số chiến đấu hay hoạt động. Nó mở **nội dung** và **nghi lễ**:

| Phẩm căn | Mở / tác động | Nghi lễ nhập môn (Lão Tùng `gac_cong` ở cổng) | Hào quang mặc định |
|---|---|---|---|
| Thiên Linh Căn | Ải tâm ma «Mạn» (một ải riêng ở Côn Lôn, phải qua mới vào bậc 6) · danh hiệu «Thiên Tứ» sau khi qua ải | chuông Sơn Môn tự ngân 3 tiếng | viền vàng nhạt, không hạt |
| Dị Linh Căn | Ải tâm ma «Mạn» (bản nhẹ, 3 tầng) | chuông ngân 2 tiếng | viền bạc |
| Song Linh Căn thượng | Câu hỏi riêng của Thầy ở cảnh nhận lá số: «Con muốn giữ hay muốn đổi?» (không đổi số, chỉ là lựa chọn giọng kể) | chuông ngân 1 tiếng | viền theo hành Dụng |
| Song Linh Căn | như trên | — | viền theo hành Dụng |
| Tam Linh Căn thượng / Tam Linh Căn | — | — | viền theo hành Dụng |
| Tứ Linh Căn thuận / Tứ Linh Căn | gợi ý chuỗi «bổ chỗ mỏng» (trỏ dòng ▼ lớn nhất của «Vì sao?») | — | viền theo hành Dụng |
| Ngũ Linh Căn | **Nghịch Thiên Lộ** (canon §4.2 bản sơ đồ tổng) — gặp Vân Cốc sớm ở Hồi I | Lão Tùng trao «gậy tre» (đạo cụ trang trí) | viền theo hành Dụng + hạt bụi sáng |
| Phàm Căn | **Nghịch Thiên Lộ** + chuỗi **«Khổ tận cam lai»** (§4.4) | Lão Tùng tự tay mở cổng phụ và nói câu dẫn (04-13 §2, biến thể 1) | viền theo hành Dụng + hạt bụi sáng |

Nguyên tắc nghi lễ: bậc cao được **âm thanh**, bậc thấp được **người** (một NPC dừng việc để đón). Không bậc nào bị bỏ qua nghi lễ.

### 4.4 Chuỗi «Khổ tận cam lai» (chỉ Phàm Căn)

Năm chặng, mỗi chặng mở khi đạt mốc; mã nhiệm vụ do 03 cấp (`BR-NT-*`). Tài liệu này định nghĩa điều kiện và thưởng.

| Chặng | Mở khi | Nội dung (tóm tắt, 03 viết kịch bản) | Thưởng |
|---|---|---|---|
| 1 · Hạt | tạo nhân vật | Lão Tùng chỉ một khoảnh đất sau Sơn Môn: gieo hạt đào | danh hiệu «Người gieo hạt»; cây đào riêng mọc theo Đạo Hạnh |
| 2 · Mầm | bậc 2 | Vân Cốc kể chuyện Liễu Phàm (`remedy-fate › LIAOFAN_STORY`) | +1 điểm Bổ Hành vào hành Dụng |
| 3 · Cây | bậc 3 | cây đào ra hoa; người chơi chọn tặng hoa cho 3 NPC | Đạo Hạnh 60 công tu (nhân NT) |
| 4 · Hoa | bậc 4 (lúc Tiên Thiên thôi tính) | cảnh Thầy Tử Bình nói «từ đây, lá số không còn đứng trước con» | danh hiệu «Khổ Tận Cam Lai» (hiện ở khung tên, thay Mệnh Cấp nếu muốn) |
| 5 · Quả | bậc 5 | cây đào cho quả; người chơi đem quả đến Am Vân Cốc | trang phục «Áo vải bạc màu» (không cộng chỉ số) |

### 4.5 Ca biên

| Ca | Xử lý |
|---|---|
| `gradeVi` engine đổi chữ (engine nâng cấp) | Game dùng **ngưỡng số**, không so chuỗi; chỉ log khi lệch. |
| Engine đổi ngưỡng | Cập nhật bảng §4.2 cùng `MENHBAN_VERSION`; người chơi nhận số mới ở ranh mùa. |
| Sửa bát tự từ Phàm Căn sang bậc khác giữa chuỗi «Khổ tận cam lai» | Chặng đã xong giữ thưởng; chặng chưa mở bị khóa (04-11 §9). |

## 5. `STAT-PHUCPHAN` — 6 bậc Phúc phận

### 5.1 Đặc tả

| Mục | Giá trị |
|---|---|
| Nguồn | `R.synthesis.fortune` (+ `fortuneVi` để «Vì sao?») |
| Điều kiện engine | đại phú quý: `score ≥ 75` **và** ≥ 1 tổ hợp cát · phú quý: `score ≥ 60` và ≥ 1 tổ hợp cát · tiểu phú quý: `score ≥ 50` · khá no: `≥ 41` · bình: `≥ 31` · tiềm năng ẩn: `< 31` |
| Lớp game | hai hệ số Phúc theo cảnh giới (§5.2) |
| Áp vào | Phúc Khí nhận từ mọi hoạt động; xác suất rơi vật phẩm hiếm (hái thảo, quà quý nhân) |
| Không áp vào | Đạo Hạnh, cảnh giới, Ngọc |

Lưu ý điều kiện «≥ 1 tổ hợp cát»: quét 4.000 lá, 100% lá số có ít nhất một tổ hợp cát (`caiGuan` 90%), nên trên thực tế Phúc phận gần như chỉ phụ thuộc điểm.

### 5.2 Hai hệ số Phúc (lớp game)

Ý tưởng: **phúc Tiên Thiên tiêu dần, phúc Hậu Thiên tích dần.** Người lá số «phú quý» hưởng sớm; người «tiềm năng ẩn» hưởng muộn mà nhiều hơn — đúng nghĩa đen tên bậc của engine.

```
PhucTT(bậc) = gốc × max(0, 1 − (bậc − 1)/4)          // tắt hẳn từ bậc 5
PhucHT(bậc) = tăng × (bậc − 1)
PhúcKhí_nhận = round(PhúcKhí_gốc × (1 + (PhucTT + PhucHT)/100) × (1 + R1 + R2) × HợpMệnh × HỷHành)
```

| Mã | Phúc phận | `fortuneVi` (rút gọn) | Tỉ lệ | gốc | tăng |
|---|---|---|---|---|---|
| `STAT-PHUCPHAN-1` | đại phú quý | ĐẠI PHÚ/QÚY | 1,1% | 12 | 0 |
| `STAT-PHUCPHAN-2` | phú quý | Phú/Qúy — danh lợi đều có | 14,7% | 9 | 0,5 |
| `STAT-PHUCPHAN-3` | tiểu phú quý | Tiểu phú/qúy — ấm no dư dả | 25,9% | 6 | 1 |
| `STAT-PHUCPHAN-4` | khá no | Khá no ấm — có thành tựu nếu nắm đúng vận | 27,7% | 3 | 1,5 |
| `STAT-PHUCPHAN-5` | bình | Bình thường — no ấm, cần nỗ lực | 22,0% | 0 | 2,5 |
| `STAT-PHUCPHAN-6` | tiềm năng ẩn | Khởi đầu vất vả nhưng có tiềm năng | 8,6% | 0 | 3 |

(`fortuneVi` của engine viết «Qúy» — lỗi đặt dấu; game hiển thị «Quý».)

### 5.3 Bảng thưởng Phúc Khí theo cảnh giới (% cộng thêm)

| Phúc phận | Bậc 1 | Bậc 2 | Bậc 3 | Bậc 4 | Bậc 5 | Bậc 6 |
|---|---|---|---|---|---|---|
| đại phú quý | +12 | +9 | +6 | +3 | 0 | 0 |
| phú quý | +9 | +7,25 | +5,5 | +3,75 | +2 | +2,5 |
| tiểu phú quý | +6 | +5,5 | +5 | +4,5 | +4 | +5 |
| khá no | +3 | +3,75 | +4,5 | +5,25 | +6 | +7,5 |
| bình | 0 | +2,5 | +5 | +7,5 | +10 | +12,5 |
| tiềm năng ẩn | 0 | +3 | +6 | +9 | +12 | +15 |

Đọc bảng: tới bậc 4 (khi Tiên Thiên thôi tính cảnh giới), «bình» và «tiềm năng ẩn» đã vượt «đại phú quý». Đây là cơ chế, không phải lời an ủi.

Tổng Phúc Khí tích lũy — mô phỏng 40 Phúc Khí gốc/ngày, 40 công tu/ngày, mỗi bậc Phúc phận lấy một điểm đại diện (80 / 65 / 53 / 45 / 35 / 25) và nhịp lên cảnh giới thật theo 04-08 §4:

| Sau | đại phú quý | phú quý | tiểu phú quý | khá no | bình | tiềm năng ẩn |
|---|---|---|---|---|---|---|
| 100 ngày | 4.110 | 4.144 | 4.177 | 4.217 | 4.336 | 4.415 |
| 150 ngày | 6.110 | 6.192 | 6.275 | 6.367 | 6.586 | 6.715 |
| 200 ngày | 8.110 | 8.242 | 8.375 | 8.517 | 8.836 | 9.015 |

Chênh tối đa 7,4% (100 ngày) đến 11,2% (200 ngày), **nghiêng về bậc thấp** vì họ vừa có Phúc Hậu Thiên lớn hơn vừa lên cảnh giới nhanh hơn (NT). Mười ngày đầu, «đại phú quý» dẫn trước — cảm giác «trời ban» có thật, nhưng ngắn. Phúc phận đổi **thời điểm** hưởng nhiều hơn là đổi tổng.

### 5.4 Rơi vật phẩm hiếm

`P(hiếm) = P_gốc × (1 + (PhucTT + PhucHT)/100)`. Ví dụ hái Tuyết Liên ở Tạng Địa, `P_gốc = 4%`: đại phú quý bậc 1 → 4,48%; tiềm năng ẩn bậc 6 → 4,60%.

### 5.5 Chuỗi ẩn «Khởi Sắc Muộn» (chỉ «tiềm năng ẩn»)

Canon §4.1: bậc «tiềm năng ẩn» mở **chuỗi nhiệm vụ ẩn** riêng. «Ẩn» nghĩa là: không có dấu nhiệm vụ trên bản đồ, chỉ có **một chi tiết lạ** ở thế giới mà người khác không thấy.

| Chặng | Điều kiện | Chi tiết lạ (chỉ người chơi này thấy) | Kết quả |
|---|---|---|---|
| 1 | bậc 2 | một con hạc giấy trên bậc Sơn Môn, mỗi sáng đổi chỗ | nhặt 7 sáng liền → hạc dẫn tới thư của «người cũ» ở Thư Lâu Lâm |
| 2 | bậc 3 + đọc thư | bóng một người ngồi câu ở Cùng Thông Hồ lúc giờ Dậu | trò chuyện 3 lần → nhận cần câu «Thả Câu Không Mồi» (trang trí) |
| 3 | bậc 4 | dưới gốc tùng Võ Đang có chữ khắc chỉ hiện khi mưa | chép chữ → mở một câu công án riêng ở Yên Tử |
| 4 | bậc 5 | ở Lịch Đường, cuốn lịch của năm sinh người chơi tự lật | đặt cuốn lịch về Am Vân Cốc → Vân Cốc kể «có những hạt mùa đông mới nảy» |
| 5 | bậc 6 | hạc giấy xuất hiện lại trên Côn Lôn | danh hiệu «Đông Mai» (hoa mai nở muộn) |

Không có thưởng Đạo Hạnh lớn ở chuỗi này (tránh biến Phúc phận thành quyền lực); thưởng là kể chuyện, danh hiệu và Phúc Hậu Thiên đã nằm trong §5.3.

### 5.6 Ca biên

| Ca | Xử lý |
|---|---|
| `fortune` lạ (engine thêm bậc) | coi như «bình» (gốc 0, tăng 2,5), log `menhban.fortune_unknown` |
| Sửa bát tự giữa chuỗi ẩn | chặng đã xong giữ danh hiệu; chuỗi đóng nếu bậc mới không phải «tiềm năng ẩn» |
| Phúc phận và Hợp mệnh | nhân độc lập: Hợp mệnh (+10%, `cosmetics.js › SET_BONUS`) vẫn áp như hiện tại |

## 6. Kiểm chứng trên lá số mẫu

| Mẫu | Tiềm Lực | Bách phân | Phẩm căn | Phúc phận | NT | Căn Cơ |
|---|---|---|---|---|---|---|
| `MAU-C` 1986-09-01 13:15 nữ | 23 | 4 | Phàm Căn | tiềm năng ẩn | ×1,37 | 9,2 |
| `MAU-D` 1999-03-05 07:15 nữ | 29 | 6 | Ngũ Linh Căn | tiềm năng ẩn | ×1,31 | 11,6 |
| `MAU-A` 1990-05-15 08:30 nam | 41 | 31 | Tứ Linh Căn | khá no | ×1,19 | 16,4 |
| `MAU-B` 1995-06-15 08:30 nam | 48 | 53 | Tứ Linh Căn thuận | khá no | ×1,12 | 19,2 |
| `MAU-F` 1957-02-22 17:30 nam | 53 | 68 | Tam Linh Căn | tiểu phú quý | ×1,07 | 21,2 |
| `MAU-G` 1969-09-10 09:00 nam | 63 | 90 | Tam Linh Căn thượng | phú quý | ×1,00 | 25,2 |
| `MAU-H` 2003-08-10 06:45 nữ | 70 | 94 | Song Linh Căn | phú quý | ×1,00 | 28,0 |
| `MAU-I` 1997-03-17 05:00 nữ | 74 | 96 | Song Linh Căn thượng | phú quý | ×1,00 | 29,6 |
| `MAU-J` 1972-05-12 22:15 nam | 76 | 97 | Song Linh Căn thượng | đại phú quý | ×1,00 | 30,4 |
| `MAU-K` 1992-10-12 07:15 nữ | 83 | 99 | Dị Linh Căn | đại phú quý | ×1,00 | 33,2 |
| `MAU-L` 1999-03-07 16:15 nữ | 86 | 99 | Thiên Linh Căn | đại phú quý | ×1,00 | 34,4 |

(`MAU-I` 74 điểm nhưng «phú quý» chứ không «đại phú quý» vì ngưỡng đại phú quý là 75.)

## 7. Checklist nghiệm thu phần 04-02

- [ ] Phẩm căn tính bằng ngưỡng số; khớp `gradeVi` trên 15 mẫu.
- [ ] «Vì sao?» Tiềm Lực: 45 + ΣΔ = `score` trên bộ kiểm 4.000 lá.
- [ ] Không dòng ▼ nào thiếu lối đi khi nhóm có lối đi.
- [ ] Bách phân vị không ở mặt trước; `< 30` luôn kèm NT; tắt được.
- [ ] Bảng Phúc §5.3 khớp công thức tới 2 chữ số thập phân.
- [ ] Chuỗi «Khổ tận cam lai» chỉ mở cho PC1; Nghịch Thiên Lộ mở cho PC1–PC2.
- [ ] Chữ «Qúy» của engine được sửa thành «Quý» khi hiển thị.
