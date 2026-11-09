# 03 · Phần 01 — Mở đầu «Nhập Môn» (`MQ-P-01…08`)

> Thời lượng 30–60 phút. Mục tiêu cảm xúc: **«game hiểu mình quá»**. Mọi câu nói về người chơi trong phần này sinh từ `chart.js › analyze()`; không có câu nào viết sẵn mà không có trường engine đứng sau.
> Lá số minh họa xuyên suốt: **MAU-A** (1990-05-15 08:30, nam). Lưu ý: engine cho trụ tháng là **辛巳 (Tân Tỵ)**, không phải tháng Ngọ như canon §11 ghi; năm sinh mới là Ngọ (庚午). Kịch bản theo engine (T1); xem Câu hỏi mở ở cuối phần.

## 0. Luồng mở đầu

```
CUT-001 ─▶ MQ-P-01 Cổng mây ─▶ MQ-P-02 Lễ lật trụ (CUT-002, CUT-003)
        ─▶ MQ-P-03 Nút «Vì sao?» ─▶ MQ-P-04 Phẩm phục
        ─▶ MQ-P-05 Vết rạn trên trời (CUT-004) ─▶ MQ-P-06 Ba lời phán (CUT-005)
        ─▶ MQ-P-07 Chén trà đầu ─▶ MQ-P-08 Ngã rẽ (CUT-006 | 007 | 008 | 009)
        ─▶ BR-<nhánh>-01  +  MQ-1-01
```

- Không có màn hướng dẫn chiến đấu. Mở đầu dạy bốn động tác: **đi, ngồi, chào, hỏi** (khớp tập 01).
- Từ MQ-P-03 trở đi người chơi có thể rời tuyến để dạo Sơn Môn; nhiệm vụ chờ ở đúng NPC, không có đồng hồ.
- Bỏ dở ở bất kỳ bước nào: lần vào sau tiếp tục ở cảnh cuối chưa xong; lá số đã nhập được giữ trên máy (§14 bản sơ đồ: ngày sinh chỉ lưu trên máy).

---

## MQ-P-01 · Cổng mây

| Trường | Giá trị |
|---|---|
| Mã | MQ-P-01 |
| Tên | Cổng mây |
| Vùng | `thanh` — cổng Nam Huyền Thành → Sơn Môn (cổng `gate_sect`) |
| Điều kiện | Tạo nhân vật mới |
| Người giao | `gac_cong` Lão Tùng |
| Mục tiêu | 1. Đi từ cổng thành tới Sơn Môn. 2. Trả lời Lão Tùng ngày, giờ, giới tính sinh. 3. (Nếu không rõ giờ) chọn giờ qua «Quét 12 Giờ». 4. Bước qua cổng. |
| Móc engine | `chart › analyze(y, m, d, h, mi, gender, nowYear)`; `hour-scan › scanHours(y, m, d, gender)`; cờ `hourWarning` của engine khi giờ mặc định 12:00 |
| Thưởng | Phúc Khí +10 (`REWARD.chart`) · Đạo Hạnh 0 |
| Bỏ dở | Đóng form giữa chừng: Lão Tùng chờ ở cổng, câu chào lặp lại ngắn. |
| Cờ đặt | `F_HOUR_UNSURE` (nếu chọn «không rõ giờ»); `R` (lá số) khóa vào nhân vật sau MQ-P-02 |

### Cảnh

```
[CẢNH MQ-P-01.1 · Cổng Nam Huyền Thành · sáng sớm, giờ Mão · sương mỏng]
(CUT-001: trẻ con chơi chuyền dưới cổng, hát «Trì Thủ Ca». Camera ngẩng theo câu hát cuối lên Thiên Mệnh Bàn treo xa trên đồi.)
TRẺ CON: (hát) Trăng rơi xuống hồ, ai vớt lên? Ba vòng một lõi, xoay không ngừng…
TRẺ CON: (hát) …Ai ngồi giữa lõi? Là con đấy thôi!
ĐỨA BÉ NHẤT: (chỉ tay vào người chơi) Anh / chị lên Quán hả? Lên Quán phải nhớ giờ đẻ nha. Không nhớ là ông Tùng hỏi hoài à.
(Đường đá dẫn lên. Bảng chỉ dẫn: «Huyền Quán Sơn Môn — 300 bậc».)
```

```
[CẢNH MQ-P-01.2 · Cổng Sơn Môn · giờ Mão · gió núi]
(Lão Tùng ngồi trên ghế tre cạnh cổng, chổi tre dựng bên. Ông đứng dậy khi người chơi tới gần 6 m.)
LÃO TÙNG: Khách sớm. Lão quét chưa xong bậc thứ ba trăm đâu.
LÃO TÙNG: Lên Quán thì lão hỏi một câu, ai lão cũng hỏi câu đó, vua tới lão cũng hỏi: cháu sinh ngày nào, giờ nào?
> Lựa chọn: ① [Thẳng] «Con nhớ rõ.» → [P-01.3]  ② [Hỏi] «Sao phải hỏi giờ sinh?» → [P-01.2b]  ③ [Mềm] «Con không chắc giờ.» → [P-01.4]
```

```
[CẢNH MQ-P-01.2b · Cổng Sơn Môn]
LÃO TÙNG: Vì cái bàn trên kia (hất cằm về Thiên Mệnh Bàn) ghi trời đang ở đâu. Còn cháu ở đâu thì phải có tám chữ mới biết.
LÃO TÙNG: Năm, tháng, ngày, giờ. Mỗi cái hai chữ. Thiếu giờ là thiếu hai chữ. Đọc được, nhưng đọc què.
> Lựa chọn: ① «Con nhớ rõ.» → [P-01.3]  ② «Con không chắc giờ.» → [P-01.4]
```

```
[CẢNH MQ-P-01.3 · Form bát tự]
(Mở form bát tự sẵn có: ngày dương lịch, giờ – phút, giới tính. Dòng chú dưới form, cố định:)
CHÚ THÍCH FORM: «Ngày giờ sinh của chính bạn. Chỉ lưu trên máy này. Không gửi lên máy chủ trừ khi bạn bật "công khai căn cốt".»
(Người chơi nhập. Nếu engine trả lỗi kiểm tra đầu vào — ngày không tồn tại, phút ngoài 0–59 — Lão Tùng nói lại bằng lời:)
LÃO TÙNG: (nếu lỗi) Ngày đó lịch không có, cháu. Nhìn lại giùm lão.
LÃO TÙNG: (khi hợp lệ) Được. Lão không biết đọc, lão chỉ biết giữ cổng. Cháu lên thẳng Chính Đường, thầy chờ.
→ [P-01.5]
```

```
[CẢNH MQ-P-01.4 · Cổng Sơn Môn · «Quét 12 Giờ»]
LÃO TÙNG: Không chắc thì nói không chắc. Người nói không chắc lão quý hơn người bịa.
LÃO TÙNG: Cháu nhập ngày. Trên Quán có tấm gương soi mười hai giờ, cháu xem cái nào giống mình nhất.
(Mở bảng `scanHours`: 12 dòng, mỗi dòng một giờ địa chi với trụ giờ và một câu tính khí. Người chơi chọn một dòng, hoặc chọn «Để 12:00 — tôi biết là chưa chắc».)
LÃO TÙNG: (khi chọn) Chọn rồi thì đi. Sau này nhớ ra giờ thật thì báo thầy, thầy sửa cho một lần.
→ đặt F_HOUR_UNSURE = true → [P-01.5]
```

```
[CẢNH MQ-P-01.5 · Bậc đá Sơn Môn · giờ Mão]
(Người chơi bước qua cổng. Lão Tùng quay lại quét bậc.)
LÃO TÙNG: (nói với theo) Đừng đếm bậc. Đếm bậc thì bậc thành dài.
```

**Ca biên.**

| Ca | Xử lý |
|---|---|
| Ngày sinh trước 1900 hoặc sau năm hiện tại | Form từ chối như app; Lão Tùng: «Ngày đó cái bàn chưa ghi tới, cháu.» |
| Người chơi nhập ngày của người khác | Không kiểm được; chú thích form đã nói «của chính bạn». Không có cơ chế thưởng cho việc dò lá số người khác (RB3). |
| Người chơi muốn đổi lá số sau MQ-P-02 | Chỉ một lần sửa **giờ** miễn phí khi `F_HOUR_UNSURE` (MQ-1-01, Thầy Tử Bình). Đổi ngày = nhân vật mới (giữ trụ cột T1: nhân vật **là** lá số). |
| Người chơi dưới 13 tuổi theo ngày sinh | Bật chế độ thiếu nhi của tập 14 (TBD-14): tắt MMO tự do và Tà Lộ. |

---

## MQ-P-02 · Lễ lật trụ

| Trường | Giá trị |
|---|---|
| Mã | MQ-P-02 |
| Tên | Lễ lật trụ |
| Vùng | `thanh` — Chính Đường Sơn Môn |
| Điều kiện | MQ-P-01 xong |
| Người giao | `thay_tubinh` |
| Mục tiêu | 1. Đứng vào vòng đá giữa Chính Đường. 2. Xem bốn trụ lật. 3. Xem thanh ngũ hành. 4. Nghe Dụng – Hỷ – Kỵ. 5. Nhận Mệnh Bàn. |
| Móc engine | `R.chart.pillars.{year,month,day,time}.{gan,zhi,ganGod}`; `R.wx.pct`; `R.strength.level`; `R.yong.{primary,xi,ji,chou}`; `R.synthesis.{score,gradeVi,percentile}` |
| Thưởng | Đạo Hạnh +5 · Phúc Khí +10 · mở Sổ Mệnh |
| Bỏ dở | Không bỏ dở được giữa lễ (cảnh 2 phút, không có lựa chọn bắt buộc). Thoát game giữa lễ → lần sau phát lại từ đầu lễ. |
| Cờ đặt | `F_LOW_SCORE = (synthesis.score < 46)`; khóa `R` vào nhân vật |

### Khuôn thoại lật trụ

Thầy Tử Bình đọc từng trụ theo khuôn: **«Trụ {tên trụ}, {Can}{Chi} — {Thập thần của can}. {câu thập thần}.»** Câu thập thần lấy theo bảng dưới (trụ ngày luôn đọc «Nhật chủ»). Đây là câu **giải nghĩa vai**, không phải lời đoán.

| Thập thần (`ganGod`) | Câu của Thầy Tử Bình |
|---|---|
| 比肩 Tỷ Kiên | Người đứng ngang vai con: anh em, bạn đồng lứa. |
| 劫財 Kiếp Tài | Người cùng đường mà cũng cùng tranh: bạn mà có lúc là đối thủ. |
| 食神 Thực Thần | Cái con làm ra mà vui: tài nghệ, miếng ăn, sự thong thả. |
| 傷官 Thương Quan | Cái tài muốn bật ra khỏi khuôn: lời nói sắc, ý mới. |
| 正財 Chính Tài | Cái của làm ra bằng mồ hôi, giữ được. |
| 偏財 Thiên Tài | Cái của đến bất chợt, và đi cũng bất chợt. |
| 正官 Chính Quan | Phép tắc, người trên, tên tuổi đàng hoàng. |
| 七殺 Thất Sát | Sức ép, việc khó, người nghiêm. Có chế thì thành quyền. |
| 正印 Chính Ấn | Người che chở, chữ nghĩa, mái nhà. |
| 偏印 Thiên Ấn | Cái học lạ, nghề riêng, lối nghĩ một mình. |

Ý nghĩa vị trí trụ (Thầy nói một lần trước khi lật):

| Trụ | Câu |
|---|---|
| Năm | Gốc: tổ tiên, đất con sinh ra. |
| Tháng | Lệnh: mùa con đến, cha mẹ, anh em. |
| Ngày | Thân: chính con. Chữ trên là con, chữ dưới là người nằm cạnh con. |
| Giờ | Ngọn: việc con để lại, những năm về sau. |

### Cảnh (minh họa MAU-A; mọi chữ trong `{}` là trường engine)

```
[CẢNH MQ-P-02.1 · Chính Đường · giờ Thìn · nắng xiên qua cửa bức bàn]
(Thầy Tử Bình ngồi sau án thư thấp. Giữa sàn có vòng đá khắc 24 sơn. Bốn tấm bài gỗ úp mặt đặt trên giá.)
THẦY TỬ BÌNH: Con đứng vào giữa vòng đá. Không cần lạy. Ở đây người ta lạy cái lý, không lạy thầy.
THẦY TỬ BÌNH: Bốn tấm bài này thầy chưa xem. Lật lên là thầy với con cùng xem lần đầu.
THẦY TỬ BÌNH: Năm là gốc. Tháng là lệnh. Ngày là thân. Giờ là ngọn.
(CUT-002: tấm thứ nhất lật.)
THẦY TỬ BÌNH: Trụ năm, {Canh Ngọ} — {Tỷ Kiên}. Người đứng ngang vai con: anh em, bạn đồng lứa.
(tấm thứ hai)
THẦY TỬ BÌNH: Trụ tháng, {Tân Tỵ} — {Kiếp Tài}. Người cùng đường mà cũng cùng tranh.
(tấm thứ ba — tấm này lật chậm hơn, có tiếng chuông nhỏ)
THẦY TỬ BÌNH: Trụ ngày, {Canh Thìn}. Nhật chủ {Canh Kim}. Đây là con.
(tấm thứ tư)
THẦY TỬ BÌNH: Trụ giờ, {Canh Thìn} — {Tỷ Kiên}.
(Nếu F_HOUR_UNSURE: tấm thứ tư lật nửa chừng rồi dừng, mặt bài mờ.)
THẦY TỬ BÌNH: (nếu F_HOUR_UNSURE) Tấm này thầy để nửa. Giờ con chưa chắc, thầy không đọc chắc cái chưa chắc.
```

```
[CẢNH MQ-P-02.2 · Chính Đường · thanh ngũ hành]
(Năm cột sáng mọc lên quanh vòng đá theo `wx.pct`. MAU-A: Kim 55,1 · Hỏa 18,3 · Thổ 17,9 · Mộc 6,5 · Thủy 2,2.)
THẦY TỬ BÌNH: Năm hành trong tám chữ của con. Cột cao nhất: {Kim}, {55}%. Cột thấp nhất: {Thủy}, {2}%.
THẦY TỬ BÌNH: Con nhìn cột thấp kia đừng buồn. Cái thiếu cũng là cái chỉ đường.
THẦY TỬ BÌNH: Thân con {quá vượng}. (theo `strength.level`)
THẦY TỬ BÌNH: Vậy hành con cần — thầy gọi là Dụng — là {Thủy}. Hành giúp Dụng — Hỷ — là {Kim}. Hành ngăn Dụng — Kỵ — là {Thổ}. Hành nuôi cái Kỵ — Cừu — là {Hỏa}.
(Bốn hạt sáng màu hành bay vào ngực người chơi: Dụng sáng nhất.)
```

```
[CẢNH MQ-P-02.3 · Chính Đường · điểm tiềm lực]
(CUT-003: Mệnh Bàn hiện thành một vòng ngọc trước ngực người chơi, rồi thu vào thành Sổ Mệnh.)
THẦY TỬ BÌNH: Cổ pháp chấm lá số con {41} trên trăm. Bậc {Tứ Linh Căn} — tên gốc của sách là «{TRUNG ĐẲNG · Cân bằng, cần nỗ lực}». Hơn {31}% lá số cùng thời.
→ nếu F_LOW_SCORE: [P-02.4a]  ·  ngược lại: [P-02.4b]
```

```
[CẢNH MQ-P-02.4a · Chính Đường · câu dẫn bắt buộc khi điểm < 46]
THẦY TỬ BÌNH: (đặt bút xuống) Con nghe thầy nói câu này trước, rồi hẵng nghĩ gì thì nghĩ.
THẦY TỬ BÌNH: Lá số là hạt giống, không phải cái cây. Hạt nhỏ thì phải chăm nhiều hơn. Thầy chưa từng thấy ai chăm mà cây không lớn.
THẦY TỬ BÌNH: Ở Quán này còn một sổ nữa, sổ ấy không ghi điểm trời cho. Ghi điểm con tự làm. Bảng trước Chính Đường xếp theo sổ đó.
> Lựa chọn: ① [Hỏi] «Sổ đó là sổ gì?» → THẦY: «Đạo Hạnh. Mai con sẽ thấy.» → [P-02.5]  ② [Im] (gật đầu) → [P-02.5]
```

```
[CẢNH MQ-P-02.4b · Chính Đường · điểm ≥ 46]
THẦY TỬ BÌNH: Con nghe con số đó rồi quên nó đi. Ở Quán này, bảng trước Chính Đường không xếp theo con số ấy.
THẦY TỬ BÌNH: Đất tốt mà không cày thì cỏ mọc. Thầy thấy nhiều rồi.
→ [P-02.5]
```

```
[CẢNH MQ-P-02.5 · Chính Đường]
THẦY TỬ BÌNH: Sổ Mệnh của con. Trong đó có tám chữ, năm hành, và một cái nút thầy dặn kỹ nhất. Ra Bàn Thầy, thầy chỉ.
```

**Ca biên.** Nếu `R.synthesis` thiếu (engine lỗi): lễ vẫn chạy phần trụ và ngũ hành; phần điểm thay bằng câu «Phần chấm điểm thầy để sau» và gắn cờ báo lỗi về máy chủ (không chặn tiến trình).

---

## MQ-P-03 · Nút «Vì sao?»

| Trường | Giá trị |
|---|---|
| Mã | MQ-P-03 |
| Tên | Nút «Vì sao?» |
| Vùng | `thanh` — Bàn Thầy |
| Điều kiện | MQ-P-02 |
| Người giao | `thay_tubinh` |
| Mục tiêu | 1. Mở Sổ Mệnh. 2. Bấm «Vì sao?» cạnh Tiềm Lực. 3. Chỉ ra một dòng cộng và một dòng trừ. 4. Đọc Mệnh Cấp. |
| Móc engine | `synthesis.factors[]` (các dòng «+4 …», «−6 …»); `chart-level › classifyChartLevel(R).{level,levelVi,criteria}` |
| Thưởng | Đạo Hạnh +5 · Phúc Khí +10 |
| Bỏ dở | Chỉ ra sai dòng: Thầy hỏi lại, không trừ gì. |
| Cờ đặt | `F_WHY_SEEN` |

```
[CẢNH MQ-P-03.1 · Bàn Thầy · giờ Thìn]
THẦY TỬ BÌNH: Con mở sổ ra. Thấy con số {41} không? Bên cạnh có chữ «Vì sao?». Bấm vào.
(Bảng `factors` mở ra. MAU-A có 9 dòng, ví dụ:)
  · Thành chính cách (Thất Sát cách) — có cách rõ, +4.
  · Dụng Thần Thủy yếu (2%) — thiếu lực, −6.
  · Có Hỷ Thần Kim (55%) sinh trợ Dụng — hữu tình, +5.
  · Tổ hợp hung (Thương Quan Kiến Quan, Quan Sát Hỗn Tạp) làm trọc cục, −10.
  · Tổ hợp cát (Sát Ấn Tương Sinh, Quan Ấn Tương Sinh) nâng tầng cách cục, +6.
THẦY TỬ BÌNH: Ở Quán này không con số nào được giấu lý do. Thầy cũng không được. Con chỉ cho thầy một dòng làm con mất điểm nhiều nhất.
> Người chơi chạm một dòng âm.
THẦY TỬ BÌNH: (đúng dòng âm lớn nhất) Đúng. {Tổ hợp hung … −10}. Dòng này không phải án tử. Nó là việc phải làm.
THẦY TỬ BÌNH: (chạm dòng âm khác) Dòng này cũng trừ, nhưng chưa phải nặng nhất. Nhìn số, đừng nhìn chữ.
THẦY TỬ BÌNH: Giờ chỉ thầy một dòng cộng mà con thấy lạ nhất.
> Người chơi chạm một dòng dương bất kỳ (không có đáp án sai).
THẦY TỬ BÌNH: Lạ thì hỏi. Cái nút đó cũng để hỏi Thầy AI, nếu Quán còn đèn. (⟨AI tự do: persona Thầy Tử Bình, toolsAllow toàn bộ⟩)
```

```
[CẢNH MQ-P-03.2 · Bàn Thầy · Mệnh Cấp]
THẦY TỬ BÌNH: Dòng dưới cùng của sổ là Mệnh Cấp: {清贵 · Thanh Quý — văn nhân, học vấn, thanh cao}.
THẦY TỬ BÌNH: Sách xếp tầng người theo cách cục, theo Dụng có lực không, theo cục trong hay đục. Con đạt {1} trên {n} tiêu chí. (đọc `criteria[].pass`)
THẦY TỬ BÌNH: Chữ ấy hiện trên khung tên con. Người ta nhìn thấy nó trước khi thấy con. Nên con phải lớn hơn nó.
```

---

## MQ-P-04 · Phẩm phục

| Trường | Giá trị |
|---|---|
| Mã | MQ-P-04 |
| Tên | Phẩm phục |
| Vùng | `thanh` — Tàng Y Các (cánh Tây) |
| Điều kiện | MQ-P-03 |
| Người giao | `tho_may` Bà Tư |
| Mục tiêu | 1. Vào Tàng Y Các. 2. Thử bộ phẩm phục theo hành Dụng. 3. Mặc và soi gương. |
| Móc engine | `yong.primary` → bộ ngũ hành tương ứng trong `cosmetics.js` (5 bộ); nhãn «Hợp mệnh» đã có |
| Thưởng | Bộ phẩm phục nhập môn theo hành Dụng (miễn phí, không Ngọc) · Phúc Khí +10 |
| Bỏ dở | Không mặc: vẫn giữ trong tủ; Bà Tư nhắc một lần khi đi ngang. |
| Cờ đặt | `F_PHAM_PHUC` |

```
[CẢNH MQ-P-04.1 · Tàng Y Các · giờ Tỵ]
(Bà Tư đeo kính, kim chỉ cài trên vạt áo. Hai giá treo phẩm phục.)
BÀ TƯ: Thầy dặn rồi. Lá số {Dụng Thủy}, bà may màu {đen huyền, viền lam}. Thủy thì màu nước sâu.
BÀ TƯ: Mặc vô coi. Đứng thẳng. Vai trái thấp hơn vai phải, con biết không? Ai ngồi bàn học lâu cũng vậy.
> Lựa chọn: ① [Hỏi] «Mặc màu này thì đổi mệnh hả bà?» → [P-04.2]  ② [Mềm] «Đẹp quá.» → [P-04.3]
```

```
[CẢNH MQ-P-04.2 · Tàng Y Các]
BÀ TƯ: (cười) Đổi được mệnh thì bà may cho bà trước rồi.
BÀ TƯ: Áo hợp hành thì người mặc thấy dễ chịu, người nhìn thấy dễ gần. Vậy thôi. Cái đó gọi là cải vận, nông như mặt nước. Muốn sâu thì phải lên núi hỏi ông sư trên Hậu Sơn, không phải hỏi bà thợ may.
→ [P-04.3]
```

```
[CẢNH MQ-P-04.3 · Tàng Y Các · gương đồng]
(Người chơi soi gương; hào quang mờ màu hành Dụng thoáng qua vai.)
BÀ TƯ: Được. Áo này của Quán, không tính tiền. Mai mốt con muốn may thêm thì bà còn đây, mà không may cũng chẳng sao.
```

*Ghi chú:* Bà Tư không giới thiệu quầy bán, không nhắc Ngọc hay VIP (§6.4 quy tắc 1). Lời «không may cũng chẳng sao» là bắt buộc.

---

## MQ-P-05 · Vết rạn trên trời

| Trường | Giá trị |
|---|---|
| Mã | MQ-P-05 |
| Tên | Vết rạn trên trời |
| Vùng | `thanh` — sân trước Chính Đường, dưới Thiên Mệnh Bàn |
| Điều kiện | MQ-P-04 |
| Người giao | `thay_tubinh` |
| Mục tiêu | 1. Ra sân, ngẩng nhìn Thiên Mệnh Bàn. 2. Hỏi Thầy về vết rạn. 3. Đọc tấm bia chép nửa Bàn Minh. |
| Móc engine | `models › thienBan()` (`userData.rings`: vòng Địa 24 sơn, vòng Thời 12 chi, vòng Biến bát quái); hiệu ứng rung `rings[1]` (chưa có — cần làm, tập 02 §1.4.5) |
| Thưởng | Đạo Hạnh +5 · mục codex «Thiên Mệnh Bàn» (tập 02) |
| Bỏ dở | — |
| Cờ đặt | `F_BAN_SEEN` |

```
[CẢNH MQ-P-05.1 · Sân Chính Đường · giờ Tỵ · trời trong]
(CUT-004: camera từ dưới ngước lên Bàn. Ba vòng xoay ngược chiều. Vòng giữa — vòng Thời — rung, một đường rạn ánh vàng chạy từ chữ 午 sang chữ 子, sượt qua lõi.)
THẦY TỬ BÌNH: Con thấy vết đó chứ. Đêm Lập Xuân năm Giáp Thìn, hai năm trước. Bàn kêu như chén sứ rạn.
> Lựa chọn: ① [Hỏi] «Trời phạt sao thầy?» → [P-05.2]  ② [Hỏi] «Bàn này ai làm?» → [P-05.3]  ③ [Thẳng] «Bàn nứt thì mệnh người có đổi không?» → [P-05.4]
```

```
[CẢNH MQ-P-05.2]
THẦY TỬ BÌNH: Trời không phạt ai bằng cái bàn. Lịch vẫn đúng từng khắc. Lập Xuân vẫn tới đúng phút. Rạn là cái gương soi trời, không phải trời.
→ [P-05.5]
```

```
[CẢNH MQ-P-05.3]
LÃO TÙNG: (đang quét sân, nói xen) Người giữ hồ trên Côn Lôn. Tên họ? Không ai ghi. Người làm việc lớn thường không để tên.
THẦY TỬ BÌNH: (cười) Lão Tùng nói đúng phần trên. Phần dưới thì có người ghi: cái giá đỡ Bàn Đài là thợ Huyền Thành dựng lại, bốn mươi năm trước. Người thợ giỏi nhất thời đó. Giờ không ai biết ông ấy đâu.
(Đây là lần đầu nhắc tới Công Thâu Nghiệt. Không nêu tên.)
→ [P-05.5]
```

```
[CẢNH MQ-P-05.4]
THẦY TỬ BÌNH: Câu đó dạo này cả Huyền Thành hỏi. Vì có một bọn đi khắp chợ, nói rằng Bàn nứt là trời đã khóa: mệnh ai nấy chịu, trừ khi mua lễ đổi.
THẦY TỬ BÌNH: Họ tự xưng Định Mệnh Hội. Thầy nói trước để con khỏi bị lạ: ở Quán này không ai bán lễ đổi mệnh. Ai bán, người đó không phải người của Quán.
→ [P-05.5]
```

```
[CẢNH MQ-P-05.5 · Bia đá dưới chân Bàn Đài]
(Bia khắc 8 chữ, phần còn lại vỡ mất: 「框不可移　天定其框」.)
THẦY TỬ BÌNH: Vành Bàn có mười sáu chữ. Bia này chép từ đời nào thầy không rõ, chỉ còn tám. Bọn Định Mệnh Hội đọc tám chữ này: «khung không dời được, trời đã định khung».
THẦY TỬ BÌNH: Tám chữ kia ở đâu thì thầy cũng đang tìm. Con nhớ giùm thầy: đọc thiếu một nửa thì cái gì cũng thành đúng.
(Codex mở: «Bàn Minh — bản thiếu». Bản đủ tìm ở MQ-2-19.)
```

---

## MQ-P-06 · Ba lời phán

| Trường | Giá trị |
|---|---|
| Mã | MQ-P-06 |
| Tên | Ba lời phán |
| Vùng | `thanh` — bậc đá Sơn Môn (bậc thứ 108, chiếu nghỉ) |
| Điều kiện | MQ-P-05 |
| Người giao | `khong_tiensinh` (tự gọi người chơi khi đi ngang) |
| Mục tiêu | 1. Ngồi xuống trước Khổng tiên sinh. 2. Nghe ba lời phán. 3. Trả lời câu hỏi ngược. |
| Móc engine | Lời 1: `chart.dayGan`, `pillars.month.zhi`, `strength.level`, `wx.pct`, `pattern.vi`, `patternQuality.quality`. Lời 2: `liunian.find(isNow)` (`ganZhi`, `score`, `rating`), thập thần của can năm so Nhật chủ, `taisui › personalTaSui(pillars.year.zhi, chi năm nay)`. Lời 3: `dayun` (đại vận đang đi và kế tiếp: `ganZhi`, `startAge`, `startYear`, `rating`) |
| iOS | Chỉ lời 1, thay bằng tính khí (`personality-profile.temperament` + nạp âm nhật trụ); câu hỏi ngược giữ nguyên |
| Thưởng | Đạo Hạnh +10 · Phúc Khí +10 |
| Bỏ dở | Người chơi bỏ đi giữa chừng: Khổng tiên sinh nói với theo «Ngươi đi cũng được. Năm vẫn là năm ấy.» và nhiệm vụ coi như xong với `F_KHONG_REPLY = im`. |
| Cờ đặt | `F_KHONG_REPLY ∈ {phan, nhan, im}` |

### 6.1 Khuôn sinh lời phán (spec)

Khổng tiên sinh **chỉ nói điều engine đoán**, giọng chắc nịch. Lời phán được **máy nhiệm vụ** ghép từ khuôn (deterministic). AI (nếu bật) chỉ được đổi nhịp câu trong persona, giữ nguyên mọi giá trị trong `{}`; bản AI phải qua `checkNeo` đối chiếu brief, trượt thì dùng bản khuôn.

**Lời 1 · Thể** = `«{Can}{Hành} sinh tháng {Chi tháng}, {cụm mùa}. {cụm thế}. {cụm cách}.»`

| Thành phần | Nguồn | Cách chọn |
|---|---|---|
| `{Can}{Hành}` | `chart.dayGan` + hành của can | «Canh Kim», «Đinh Hỏa», «Kỷ Thổ»… |
| `{Chi tháng}` | `pillars.month.zhi` | tên Hán Việt |
| `{cụm mùa}` | quan hệ hành chi tháng → hành Nhật chủ | bảng A |
| `{cụm thế}` | `strength.level` + hành có `wx.pct` cao nhất | bảng B |
| `{cụm cách}` | `pattern.vi` (rút gọn trước dấu «(») + `patternQuality.quality` | bảng C; bỏ nếu `quality === '未知'` |

Bảng A — cụm mùa:

| Chi tháng so Nhật chủ | Cụm |
|---|---|
| tháng **khắc** Nhật chủ | «{mùa} luyện mà {hành} còn cứng» (Kim gặp Hỏa), «{mùa} chặt, {hành} phải gồng» (các hành khác) |
| tháng **sinh** Nhật chủ | «mùa nuôi mình» |
| tháng **cùng hành** | «đúng mùa của mình» |
| Nhật chủ **khắc** tháng | «ra sức chế mùa» |
| Nhật chủ **sinh** tháng | «tự hao mình cho mùa» |

Bảng B — cụm thế (`strength.level` engine có 5 mức):

| `strength.level` | Cụm |
|---|---|
| Thân quá vượng | «{hành cao nhất} chiếm {pct}% cục, dày mà khó uốn» |
| Thân vượng | «thân đủ sức tự đứng» |
| Trung hòa (mức giữa) | «thân không nặng không nhẹ» |
| Thân nhược | «thân mỏng, {hành cao nhất} rút sức» |
| Thân quá nhược | «thân như ngọn đèn trước gió, {hành cao nhất} {pct}%» |

Bảng C — cụm cách:

| `quality` | Cụm |
|---|---|
| 成格 | «{cách} thành, khung còn nguyên» |
| 有救 | «{cách} vỡ một góc, có chỗ vá» |
| 败格 | «{cách} đã vỡ» |
| 特殊 / `type: special` | «cách lạ: {cách}, không đọc theo lối thường» |

**Lời 2 · Năm** = `«Năm nay {GZ năm}, {Thập thần} lâm năm{, cụm Thái Tuế}. {cụm năm}.»`

| Thành phần | Nguồn | Cách chọn |
|---|---|---|
| `{GZ năm}` | `liunian.find(isNow).ganZhi` | Hán Việt |
| `{Thập thần}` | thập thần của can năm so `chart.dayGan` | tên Hán Việt |
| `{cụm Thái Tuế}` | `personalTaSui(...)` | nếu `offends`: «lại đúng tuổi {con giáp}: phạm {loại}» ; không phạm: bỏ |
| `{cụm năm}` | `rating` + lĩnh vực của thập thần (bảng D) | bảng E |

Bảng D — lĩnh vực theo thập thần của năm:

| Thập thần năm | Lĩnh vực Khổng nói |
|---|---|
| Chính Quan / Thất Sát | việc công, người trên |
| Chính Tài / Thiên Tài | tiền bạc, buôn bán |
| Chính Ấn / Thiên Ấn | giấy tờ, chữ nghĩa, mái nhà |
| Thực Thần / Thương Quan | lời nói, tay nghề |
| Tỷ Kiên / Kiếp Tài | bạn bè, chia phần |

Bảng E — cụm năm theo `rating`:

| `rating` | Cụm |
|---|---|
| Đại cát | «Trong năm này {lĩnh vực} gió thuận, việc tự tới tay» |
| Cát | «Trong năm này {lĩnh vực} dễ thở» |
| Bình | «Năm này {lĩnh vực} không lên không xuống» |
| Hơi kỵ | «Năm này {lĩnh vực} hay vấp» |
| Hung | «Năm này {lĩnh vực} nặng» |
| Đại hung | «Từ giờ tới hết năm {lĩnh vực} khó ngóc đầu» |

**Lời 3 · Vận**:
- Nếu đại vận kế tiếp bắt đầu trong ≤ 3 năm: `«{startAge} tuổi đổi vận {GZ kế}, {cụm vận(rating kế)} mười năm.»`
- Ngược lại: `«Vận {GZ hiện} còn {n} năm, {cụm vận(rating hiện)}.»`
- Nếu vận hiện **vừa bắt đầu năm nay**: `«Vận {GZ hiện} vừa vào. {cụm vận} mười năm.»`

| `rating` vận | Cụm vận |
|---|---|
| Đại cát | gió thuận |
| Cát | dễ thở |
| Hơi thuận | êm |
| Bình hòa | bình hòa |
| Hung | nặng vai |
| Đại hung | phải gồng |

**Kết** (cố định, không đổi theo lá số):
1. (ngẩng lên) «Ta nói sai câu nào chưa?»
2. Sau lựa chọn của người chơi: «…Không sai. Thì ngươi định sống đúng như vậy à?»

**Ràng buộc bắt buộc của khuôn**

| # | Ràng buộc | Nguồn |
|---|---|---|
| 1 | Không trường sức khỏe, bệnh, tai nạn, kiện tụng, chết | RB1; `personality-profile.health` bị loại khỏi khuôn |
| 2 | Không con số tiền, không «chắc chắn», «trăm phần trăm» | DP6 |
| 3 | Không hôn nhân tất định («chắc ly hôn»); cờ 💍 của `decadeForecast` **không** dùng trong lời phán mở đầu | RB2 |
| 4 | Tuổi trong lời 3 là `startAge` của engine (tuổi mụ), không tự tính lại | T1 |
| 5 | Thiếu giờ (`F_HOUR_UNSURE`): lời 1 thêm «Ba trụ, ta đọc ba trụ.»; lời 2, 3 không đổi (không phụ thuộc trụ giờ) | — |
| 6 | Mỗi lời ≤ 40 chữ; tổng ≤ 120 chữ | nhịp cảnh cắt CUT-005 |
| 7 | Không có lời khuyên nào | persona: lời khuyên để dành cho Vân Cốc |

### 6.2 Ba ví dụ đã chạy engine (năm hiện tại 2026)

**Ví dụ 1 · MAU-A** (1990-05-15 08:30 nam). Engine: 庚午 辛巳 庚辰 庚辰; Thân quá vượng; Kim 55,1%; Thất Sát cách — 有救; lưu niên 2026 丙午 điểm 6 «Đại hung»; 丙 so 庚 = Thất Sát; tuổi Ngọ năm Ngọ: `personalTaSui` → **phạm Trị + Hình**; đại vận 甲申 (28 tuổi, 2017, Bình hòa) → 乙酉 (38 tuổi, 2027, Bình hòa).

```
[CẢNH MQ-P-06.A · Bậc thứ 108 · giờ Mùi · nắng nghiêng]
(Ông già áo xám ngồi trên chiếu cói, trước mặt một cuốn sổ bìa gỗ và nghiên mực. Không có biển hiệu, không có hộp tiền.)
KHỔNG TIÊN SINH: (không ngẩng lên) Ngồi.
(Người chơi ngồi. CUT-005 bắt đầu khi ông giở sổ.)
KHỔNG TIÊN SINH: Canh Kim sinh tháng Tỵ, lửa hạ luyện mà kim còn cứng. Kim chiếm năm mươi lăm phần cục, dày mà khó uốn. Thất Sát cách vỡ một góc, có chỗ vá.
KHỔNG TIÊN SINH: Năm nay Bính Ngọ, Thất Sát lâm năm, lại đúng tuổi Ngọ: phạm Trị, phạm Hình. Từ giờ tới hết năm, việc công khó ngóc đầu.
KHỔNG TIÊN SINH: Vận Giáp Thân sắp hết. Ba mươi tám tuổi đổi vận Ất Dậu, bình hòa mười năm.
KHỔNG TIÊN SINH: (ngẩng lên) Ta nói sai câu nào chưa?
> Lựa chọn: ① [Thẳng] «Không sai. Nhưng con không sống theo lời ai.» → [P-06.R1]  ② [Hỏi] «Không sai… vậy con phải chịu sao?» → [P-06.R2]  ③ [Im] (cúi đầu, không đáp) → [P-06.R3]
```

**Ví dụ 2 · MAU-B** (1995-06-15 08:30 nam). Engine: 乙亥 壬午 丁丑 甲辰; Thân vượng; Mộc 29,2% cao nhất; Chính Quan cách — 败格; 2026 丙午 điểm 9 «Đại hung»; 丙 so 丁 = Kiếp Tài; tuổi Hợi **không phạm**; đại vận 己卯 (24 tuổi, 2018, Đại hung) → 戊寅 (34 tuổi, 2028, Đại hung). Đại vận kế cách 2 năm (≤ 3) nên lời 3 nói vận kế.

```
[CẢNH MQ-P-06.B · Bậc thứ 108]
KHỔNG TIÊN SINH: Đinh Hỏa sinh tháng Ngọ, đúng mùa của mình. Thân đủ sức tự đứng. Chính Quan cách đã vỡ.
KHỔNG TIÊN SINH: Năm nay Bính Ngọ, Kiếp Tài lâm năm. Từ giờ tới hết năm, bạn bè chia phần, khó ngóc đầu.
KHỔNG TIÊN SINH: Ba mươi tư tuổi đổi vận Mậu Dần, phải gồng mười năm.
KHỔNG TIÊN SINH: (ngẩng lên) Ta nói sai câu nào chưa?
```

*Ghi chú biên tập:* khi cả vận hiện và vận kế đều «Đại hung», khuôn **không** gộp thành «hai mươi năm xấu»; chỉ nói vận kế. Việc gộp là suy diễn thêm, Khổng tiên sinh không suy diễn.

**Ví dụ 3 · lá số minh họa NT-1** (1970-05-19 08:00 nam; chạy lại được). Engine: 庚戌 辛巳 己亥 戊辰; điểm **19** (HẠ ĐẲNG → Phàm Căn); Thân nhược; Thổ 37,8% · Kim 37,6%; Thương Quan cách — 败格; 2026 丙午 điểm 58 «Cát»; 丙 so 己 = Chính Ấn; tuổi Tuất **không phạm** 2026; đại vận 丁亥 bắt đầu **57 tuổi, năm 2026**, «Đại cát».

```
[CẢNH MQ-P-06.C · Bậc thứ 108]
KHỔNG TIÊN SINH: Kỷ Thổ sinh tháng Tỵ, mùa nuôi mình. Thân mỏng, Thổ ba mươi tám phần mà kim rút sức. Thương Quan cách đã vỡ.
KHỔNG TIÊN SINH: Năm nay Bính Ngọ, Chính Ấn lâm năm. Trong năm này giấy tờ, chữ nghĩa, mái nhà dễ thở.
KHỔNG TIÊN SINH: Vận Đinh Hợi vừa vào. Gió thuận mười năm.
KHỔNG TIÊN SINH: (ngẩng lên) Ta nói sai câu nào chưa?
```

*Ý đồ:* người chơi điểm thấp nhất cũng có thể nhận một lời phán **thuận**. Khổng tiên sinh không phải kẻ gieo sợ; ông chỉ nói đúng. Câu hỏi ngược vẫn y nguyên: thuận mà ngồi chờ cũng là «sống đúng như lời ta».

### 6.3 Phần trả lời (chung cho mọi lá số)

```
[CẢNH MQ-P-06.R1 · F_KHONG_REPLY = phan]
KHỔNG TIÊN SINH: Không sai. Thì ngươi định sống đúng như vậy à?
NGƯỜI CHƠI: (giọng theo lựa chọn) Con không sống theo lời ai.
KHỔNG TIÊN SINH: Ai cũng nói câu đó ở bậc này. Ta ghi lại hết. (gõ bút vào sổ) Năm năm sau ta giở ra đọc, câu nào cũng ứng đúng lời ta, không ứng câu họ.
KHỔNG TIÊN SINH: Ngươi về đi. Ta không giữ ai, cũng không lấy của ai đồng nào.
```

```
[CẢNH MQ-P-06.R2 · F_KHONG_REPLY = nhan]
KHỔNG TIÊN SINH: Không sai. Thì ngươi định sống đúng như vậy à?
NGƯỜI CHƠI: Nếu đúng hết thì con biết làm gì khác?
KHỔNG TIÊN SINH: (nhìn lâu hơn bình thường) Ta không biết. Ta chỉ biết đoán. Cái «làm gì» không nằm trong sổ ta.
KHỔNG TIÊN SINH: Có một lão sư trên Hậu Sơn hay cãi ta chuyện đó. Ta với lão ấy cãi nhau bốn mươi năm chưa xong.
```

```
[CẢNH MQ-P-06.R3 · F_KHONG_REPLY = im]
(Người chơi im. Khổng tiên sinh đợi ba nhịp thở.)
KHỔNG TIÊN SINH: Không cãi. Cũng không gật. (gấp sổ) Ta ghi «im». Người im thường là người còn đang nghĩ. Ta ít khi đoán được người đang nghĩ.
```

```
[CẢNH MQ-P-06.4 · khi người chơi đứng dậy]
KHỔNG TIÊN SINH: (nếu có người đi ngang hỏi giá — NPC qua đường) Ta không lấy tiền. Lấy tiền thì người ta tưởng ta bán. Ta không bán, ta nói.
(Khổng tiên sinh xuất hiện lại ở chợ Huyền Thành từ MQ-1-08.)
```

### 6.4 Biến thể iOS

```
[CẢNH MQ-P-06.iOS · Bậc thứ 108]
KHỔNG TIÊN SINH: {Canh Kim}. Sắt thép dương: cương nghị, quả cảm, dứt khoát. Nhật trụ {Canh Thìn}, nạp âm {Kim Sáp Trắng}: đẹp, quý, mà mỏng.
KHỔNG TIÊN SINH: Ngươi nói thẳng làm người khác đau mà không biết. Ngươi giữ chữ tín hơn giữ lòng người.
KHỔNG TIÊN SINH: (ngẩng lên) Ta nói sai câu nào chưa? … Không sai. Thì ngươi định sống đúng như vậy à?
```

(Nguồn: `personality-profile.profile.temperament/weaknesses` + `nayin-personality › dayNayinPersonality(R).vi/traits`. Không năm, không vận.)

---

## MQ-P-07 · Chén trà đầu

| Trường | Giá trị |
|---|---|
| Mã | MQ-P-07 |
| Tên | Chén trà đầu |
| Vùng | `thanh` — Trà Thất Sơn Môn |
| Điều kiện | MQ-P-06 |
| Người giao | Dì Hạnh (TBD-06) |
| Mục tiêu | 1. Vào Trà Thất. 2. Ngồi một lượt trà (cơ chế trà đã có). 3. Nói chuyện với Thanh Phong và bé Lúa. 4. Xem ba thanh tâm ma trong Sổ Mệnh. |
| Móc engine | `personality-profile › getPersonalityProfile(R)`; `nayin-personality › dayNayinPersonality(R)`; `liudao › computeLiuDao(R).poisons.{tham, san, si}` |
| Thưởng | Đạo Hạnh +5 · Phúc Khí +10 · `addTeaMinutes` |
| Bỏ dở | Không uống trà: Dì Hạnh vẫn rót, chén để nguội trên bàn đến khi người chơi quay lại. |
| Cờ đặt | `F_MET_HANH`, `F_MET_LUA`, `F_MET_THANHPHONG` |

```
[CẢNH MQ-P-07.1 · Trà Thất · giờ Thân · hơi nóng bốc từ ấm]
DÌ HẠNH: Ngồi đi con. Mặt mũi vậy là mới ngồi với ông Khổng xong phải không? Ai ngồi với ổng xong cũng cái mặt đó.
> Lựa chọn: ① [Hỏi] «Ông ấy đoán đúng hết hả dì?» → [P-07.2]  ② [Mềm] «Con chỉ mệt thôi.» → [P-07.3]
```

```
[CẢNH MQ-P-07.2]
DÌ HẠNH: Đúng. Đúng tới phát sợ. Hồi dì còn con gái ổng nói dì lấy chồng xa, chồng đi sớm. Đúng hết.
DÌ HẠNH: (rót trà) Nhưng ổng không nói được là dì sẽ mở cái quán này, nuôi được con bé Lúa, ngày nào cũng có người ngồi chỗ con đang ngồi. Ổng đoán cái trời đưa. Cái dì làm thì ổng không đoán.
→ [P-07.3]
```

```
[CẢNH MQ-P-07.3 · Trà Thất]
(Thanh Phong, tiểu đồng 15 tuổi, chạy vào, áo xanh đệ tử dính bụi.)
THANH PHONG: Dì Hạnh! Cho con chén trà, con quét xong ba trăm bậc rồi — à. (thấy người chơi) Người mới hả? Lão Tùng bảo có người mới, con tưởng ông nói chơi.
THANH PHONG: Mình là Thanh Phong. Mai thầy bắt mình dẫn bạn đi khắp Quán. Bạn {tính khí: Sắt thép dương — cương nghị} phải không? Nhìn cái đi là biết.
> Lựa chọn: ① [Thẳng] «Sao biết?» → THANH PHONG: «Đi thẳng một mạch, không nhìn ai. Người Kim hay vậy.» ② [Mềm] «Mình cũng không chắc.» → THANH PHONG: «Thầy bảo không chắc là bắt đầu biết.»
(BÉ LÚA ngồi góc bàn, vẽ que lên giấy bản, không ngẩng lên.)
DÌ HẠNH: Con bé Lúa, cháu dì. Lúa, chào khách.
BÉ LÚA: (nhỏ) Chào. (lại vẽ)
DÌ HẠNH: (hạ giọng) Nó ít nói từ hồi có người xem số nó ngoài chợ. Mười một tuổi mà người ta phán một câu, nó nhớ tới giờ.
(Gieo cho BR-TT-05, TL-07. Không nói câu phán là gì.)
```

```
[CẢNH MQ-P-07.4 · Trà Thất · ba thanh tâm ma]
THANH PHONG: Bạn mở Sổ Mệnh trang cuối coi. Có ba thanh không? Tham, Sân, Si.
(Sổ Mệnh hiện ba thanh. MAU-A: Tham 29 · Sân 37 · Si 27.)
THANH PHONG: Của bạn thanh {Sân} cao nhất. Không phải xấu đâu. Thầy nói ai cũng có ba cái này, đếm được thì bớt được.
DÌ HẠNH: Uống trà đi. Trà nguội là trà buồn.
(Kết: người chơi uống một lượt trà; thanh Sân giảm 0 — chưa có cơ chế giảm ở mở đầu; chỉ hiện chú thích «Giảm bằng: tĩnh tọa, sám hối, việc thiện» — tập 05.)
```

---

## MQ-P-08 · Ngã rẽ

| Trường | Giá trị |
|---|---|
| Mã | MQ-P-08 |
| Tên | Ngã rẽ |
| Vùng | `thanh` (Tổ Sư Đường / Trà Thất / nhà trọ Mái Rêu, theo nhánh) |
| Điều kiện | MQ-P-07; giờ Dậu trở đi (nếu người chơi vào lúc khác, cảnh chờ tới khi người chơi ra khỏi Trà Thất) |
| Người giao | theo nhánh (bảng dưới) |
| Mục tiêu | Xem cảnh rẽ nhánh; nhận nhiệm vụ đầu nhánh |
| Móc engine | `pattern.type`, `patternQuality.quality`, `patternQuality.diseases[]/rescues[]`, `synthesis.score` (luật xếp nhánh ở README §2.2) |
| Thưởng | Đạo Hạnh +10 · Phúc Khí +10 |
| Bỏ dở | Không bỏ được (cảnh tự chạy). |
| Cờ đặt | `F_BRANCH`; mở `BR-<nhánh>-01` và `MQ-1-01` |

| Nhánh | NPC | Nơi | Cảnh cắt | Nhiệm vụ mở |
|---|---|---|---|---|
| TT | `thay_tubinh` | Tổ Sư Đường | CUT-006 | BR-TT-01 |
| DC | `dan_dinh` Cát Huyền | Trà Thất | CUT-007 | BR-DC-01 |
| NT | `thay_tubinh` → bà Năm Rêu | Tổ Sư Đường → nhà trọ Mái Rêu | CUT-008 | BR-NT-01 |
| DK | `phuong_si` | mái Trà Thất | CUT-009 | BR-DK-01 |

### 8.1 Thuận Thiên (成格)

*Minh họa bằng lá số TT-1: 1976-12-05 10:00 nam — 丙辰 己亥 辛卯 癸巳, Thương Quan cách 成格, điểm 71 (Song Linh Căn).*

```
[CẢNH MQ-P-08.TT · Tổ Sư Đường · giờ Dậu · đèn dầu]
(CUT-006: tượng Tổ Sư ngồi trong khám. Ngọn đèn trước khám tự sáng thêm một nấc khi người chơi bước vào.)
THẦY TỬ BÌNH: Cách con {Thương Quan cách}, thành. Khung còn nguyên. Tổ Sư có lệ: lá số thành cách thì Quán nhận làm đệ tử ngay, khỏi qua vòng khách học.
THẦY TỬ BÌNH: Thầy nói thật: thầy không mừng nhiều. Người được nhận dễ thường giữ không lâu.
> Lựa chọn: ① [Thẳng] «Con sẽ giữ.» → THẦY: «Giữ cái gì? Mai con trả lời thầy.» ② [Hỏi] «Thầy sợ con kiêu?» → THẦY: «Thầy sợ con không biết mình đang kiêu.»
THẦY TỬ BÌNH: Lạy Tổ Sư một lạy. Một thôi. Lạy nhiều là xin, mà con chưa có gì để xin.
→ đặt F_BRANCH = TT · mở BR-TT-01
```

### 8.2 Đắc Cứu (有救)

*Minh họa MAU-A: `diseases` = «Tài đảng Sát mà không có Thực/Ấn chế» và «Kiêu đoạt thực»; `rescues[].drug` = `["shi"]`, `["cai"]`.*

```
[CẢNH MQ-P-08.DC · Trà Thất · giờ Dậu]
(CUT-007: một đạo nhân gầy đeo hồ lô đồng bước vào, mùi thuốc bắc theo vào cùng. Ông ngồi đối diện người chơi, không hỏi.)
CÁT HUYỀN: Bần đạo xin chén nước. (uống) Lá số của con, thầy Tử Bình kể rồi. Bần đạo từ Võ Đang xuống lấy dược liệu, nghe chuyện nên ghé.
CÁT HUYỀN: Bệnh thứ nhất: {Tài đảng Sát mà không có Thực, Ấn chế} — sức ép không ai đỡ. Bệnh thứ hai: {Kiêu đoạt thực} — cái tài vừa bật lên đã bị cái học lạ nuốt mất.
CÁT HUYỀN: Nhưng sách ghi luôn thuốc. Vị thứ nhất: {Thực Thần}. Vị thứ hai: {Tài}. Bệnh ở đâu thì thuốc ở đó. Thầy chỉ chỗ, con tự đi hái.
> Lựa chọn: ① [Hỏi] «Thuốc đó hái ở đâu?» → CÁT HUYỀN: «Mỗi vị một nơi. Lên lò đan Võ Đang tìm bần đạo, bần đạo vẽ đường.» ② [Thẳng] «Con không bệnh.» → CÁT HUYỀN: «Ai cũng nói vậy trước khi biết tên bệnh. Biết tên rồi mới hết sợ.»
→ đặt F_BRANCH = DC · mở BR-DC-01 (mốc định vị lò đan Võ Đang; trước bậc cảnh giới 2 chỉ hiện «xa»)
```

### 8.3 Nghịch Thiên (败格)

*Minh họa NT-1 (điểm 19, Thương Quan cách 败格). Cảnh dài nhất của mở đầu; mục tiêu: **không** để người chơi thấy bị phán xét.*

```
[CẢNH MQ-P-08.NT.1 · Tổ Sư Đường · giờ Dậu]
(CUT-008 phần 1: ngọn đèn trước khám không sáng thêm. Thầy Tử Bình nhìn đèn, rồi nhìn người chơi.)
THẦY TỬ BÌNH: Quán có lệ cũ: người mới vào Tổ Sư Đường, đèn sáng thì nhận. Đèn đứng yên thì gọi là «chưa đủ duyên».
THẦY TỬ BÌNH: Thầy nói rõ để con khỏi nghĩ sai: không phải vì con số {19}. Thầy từng nhận người điểm thấp hơn. Lệ là lệ của đèn, thầy không hiểu hết, thầy cũng không cãi.
> Lựa chọn: ① [Thẳng] «Vậy con đi.» → [NT.2]  ② [Hỏi] «Bao giờ thì đủ duyên?» → [NT.2b]  ③ [Mềm] «Con hiểu.» → [NT.2]
```

```
[CẢNH MQ-P-08.NT.2b]
THẦY TỬ BÌNH: Thầy không biết. Thầy chỉ biết đèn này từng đứng yên với ba người, và cả ba sau này đều vào Quán. Một người giờ ngồi chỗ thầy.
→ [NT.2]
```

```
[CẢNH MQ-P-08.NT.2 · Tổ Sư Đường]
THẦY TỬ BÌNH: Con chưa phải đệ tử, nhưng Bàn Thầy là bàn công. Ai ngồi cũng được. Mai con cứ tới học như mọi người.
THẦY TỬ BÌNH: Tối nay con ngủ ở nhà trọ Mái Rêu dưới thành. Bà Năm Rêu là người quen. (đưa một thẻ tre) Đưa bà cái này, bà không lấy tiền.
```

```
[CẢNH MQ-P-08.NT.3 · Nhà trọ Mái Rêu · giờ Tuất · mưa phùn]
(CUT-008 phần 2: phòng nhỏ, cửa sổ nhìn lên Sơn Môn, Thiên Mệnh Bàn mờ trong mưa.)
BÀ NĂM RÊU: Thẻ tre ông Tử Bình. Lại một đứa đèn không sáng. (đặt bát cháo) Ăn đi. Đứa trước ở phòng này giờ làm thầy trên đó đó.
BÀ NĂM RÊU: Đêm nay ai gõ cửa thì mở. Ở đây không có trộm, chỉ có người lạ tốt bụng.
→ đặt F_BRANCH = NT · mở BR-NT-01 (cảnh gõ cửa đêm là BR-NT-03, CUT-048)
```

### 8.4 Dị Cách (`pattern.type === 'special'`)

*Minh họa DK-1: 1970-09-27 08:00 nam — 庚戌 乙酉 庚戌 庚辰, «Tòng Cách cách (Chuyên Vượng Kim)», `quality` 成格, Kim 61%, Thủy 1,1%.*

```
[CẢNH MQ-P-08.DK · Sân Trà Thất · giờ Dậu · gió lớn]
(CUT-009: tiếng sáo trên mái. Một người áo vải bạc màu, tóc buộc bằng dây cỏ, ngồi vắt chân trên nóc Trà Thất.)
PHƯƠNG SĨ VÔ DANH: Này, người mới. Ngửa mặt lên đây.
PHƯƠNG SĨ VÔ DANH: Kim sáu mươi mốt phần, cả cục một hành. Thầy dưới kia đọc «thân quá vượng, phải ức» đúng không? Đúng sách. Nhưng sách có hai cuốn.
PHƯƠNG SĨ VÔ DANH: Cách của bạn là {Chuyên Vượng Kim}: một dòng sông chảy một chiều. Chặn sông thì vỡ đê. Người ta gọi là cách lạ.
> Lựa chọn: ① [Hỏi] «Vậy phải làm sao?» → PHƯƠNG SĨ: «Thuận thế. Mai lên đỉnh Hậu Sơn, tại hạ chỉ cho.» ② [Thẳng] «Ông là ai?» → PHƯƠNG SĨ: «Người không có phái. Có tên thì người ta hỏi phái.»
PHƯƠNG SĨ VÔ DANH: (nhảy xuống, đi về phía cổng) Đừng sửa mình cho giống người khác. Sửa mình cho giống dòng sông của mình.
→ đặt F_BRANCH = DK · mở BR-DK-01
```

---

## 9. Kiểm thử nghiệm thu phần Mở đầu

| # | Kiểm | Cách kiểm | Đạt khi |
|---|---|---|---|
| 1 | Lời phán khớp engine | chạy khuôn 6.1 với MAU-A, MAU-B, NT-1 | ra đúng 3 cảnh 6.2 từng chữ trong `{}` |
| 2 | Không câu RB1 trong khuôn | quét 200 lá số ngẫu nhiên, regex «bệnh|chết|tai nạn|kiện|ly hôn|chắc chắn|%\s*chắc» | 0 kết quả |
| 3 | Câu dẫn §4.7 | 50 lá số điểm < 46 | 100% thấy cảnh P-02.4a |
| 4 | Nhánh | 5 lá số mẫu của §8 | MAU-A → DC, MAU-B → NT, TT-1 → TT, NT-1 → NT, DK-1 → DK |
| 5 | Không bán | quét thoại MQ-P-* | không chữ «Ngọc», «VIP», «mua», «giá» ngoài miệng Định Mệnh Hội |
| 6 | iOS | bật cờ iOS | MQ-P-06 chỉ có biến thể 6.4; không có Vận Mệnh Các, Thái Tuế Điện trong mở đầu |
| 7 | AI tắt | `isAiEnabled = false` | toàn bộ MQ-P chơi xong bằng thoại kịch bản |

**Câu hỏi mở của phần này:** canon §11 và bản sơ đồ §3 ghi MAU-A «Canh Kim tháng Ngọ», «lửa luyện»; engine cho trụ tháng **辛巳** (sinh trước Mang Chủng). Tập 03 viết theo engine («sinh tháng Tỵ, lửa hạ luyện»); đề nghị sửa canon §11.
