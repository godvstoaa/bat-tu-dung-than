# 05-02 · Mệnh Đồ — sinh kế hoạch cải mệnh riêng từ `gaimenhPlan(R)`

> Mệnh Đồ là bản đồ 6 nút trong Sổ Mệnh, sinh **hoàn toàn** từ `` `gaimenh › gaimenhPlan(R)` ``. Phần này đặc tả: đầu vào, đầu ra, mọi loại chẩn đoán và mọi loại tầng engine có thể sinh, mẫu nhiệm vụ mỗi loại sinh ra (mã `CQ-MD-xx`), cách xếp ưu tiên, cách tính lại khi dữ liệu sinh đổi hoặc sang năm mới, và người khác nhìn thấy gì trong MMO.
> Engine liên quan: `` `gaimenh › gaimenhPlan` ``, `` `mangpai › analyzeMangpai` ``, `` `xuankong › xuankongPan` ``, `` `remedy › buildRemedy` `` / `SPECIFIC_REMEDY`, `` `taisui › personalTaSui` `` / `TAISUI_REMEDY`, `` `naming › analyzeName` `` / `fiveGrid`, `` `zheri › evaluateDate` `` / `findGoodDates`, `` `fs-cure › SHA_LIST` `` / `cureByElement`, `` `noble-cultivate › nobleCultivation` ``, `` `five-dim-radar › fiveDimRadar` ``, `` `remedy-fate › getRemedyForChart` ``, `` `pattern-quality` `` (`rescues[].drug`).

---

## 1. Đầu vào và đầu ra của engine

### 1.1 Hình dạng dữ liệu

```
gaimenhPlan(R, opts?) → {
  diagnosis: [ { sev: 'cao'|'trung'|'thấp', t: tiêu đề, d: mô tả } ],   // ≥ 1 phần tử
  layers:    [ { pri: 1..6, name, kind, acts: [chuỗi] } ],                  // luôn đúng 6 phần tử, thứ tự cố định
  verdict:   chuỗi kết luận,
  mangpai:   kết quả analyzeMangpai(R) { score, level, fuguui, caiWx, guanWx, notes[] },
  xuankong:  kết quả xuankongPan(year) { yun, yuan, range, pan[], wangFang[], xiongFang[], advice, currentStar }
}
```

- `opts.year` chỉ đổi **năm dùng cho Huyền Không** (`xuankongPan`). Mặc định là `R.liunian[0].year` hoặc năm hiện tại. Game luôn truyền **năm can chi hiện tại của máy chủ** để mọi người chơi cùng một vòng sao.
- `layers[].kind` có đúng 6 giá trị: `space`, `name`, `timing`, `taisui`, `mangpai`, `virtue`. **Không có lá số nào thiếu tầng.** Chỉ nội dung `acts` đổi theo lá số và theo năm.

### 1.2 Sáu loại chẩn đoán engine có thể sinh

Đọc từ mã `gaimenh.js` dòng 22–38. Thứ tự đẩy vào mảng là cố định; `diagnosis[0]` là «bệnh ưu tiên» được nêu trong `verdict`.

| # | `t` (tiêu đề) | Điều kiện chính xác | `sev` | `d` (mẫu) |
|---|---|---|---|---|
| D1 | Mệnh cục thiên lệch | `synthesis.score != null && score < 55` | cao | «Tổng luận {score}/100 — Dụng {hành} thiếu lực.» |
| D2 | Tổ hợp hung | có ≥ 1 `synthesis.combos[]` với `tone === 'xiong'` | cao | «{tên các tổ hợp} làm trọc cục.» |
| D3 | Lưu niên {năm} bất lợi | `liunian[isNow].score < 0` | trung | «{can chi} score {điểm}.» |
| D4 | 盲派 做功 thấp | `mangpai.score < 55` | trung | «Tài quan phân tán/ít hợp — phú quý chậm.» |
| D5 | Tài đa thân nhược | `strength.strong === false` và `wx.score[yong.relations.wealthWx] > 2 × wx.score[yong.relations.sameWx]` | trung | «Tiền tới nhưng thân không nhậm được — dễ "tài qua tay".» |
| D6 | Mệnh tương đối cân | không có D1–D5 | thấp | «Không có bệnh lớn — tập trung vun Dụng/Hỷ + đón vận cát.» |

**Sáu tổ hợp hung** có thể làm nên D2 (`combos.js`, `tone: 'xiong'`), mỗi tổ hợp có thuốc riêng ở `remedy › SPECIFIC_REMEDY`:

| id (`combos.js`) | `name` | `vi` | Điều kiện | Thuốc (`SPECIFIC_REMEDY`) tóm tắt |
|---|---|---|---|---|
| `shangGuan` | 傷官見官 | Thương Quan Kiến Quan | có Thương Quan và Chính Quan | dùng Ấn hóa Thương; tránh cãi vã quyền trên |
| `xiaoShi` | 梟神奪食 | Kiêu Đoạt Thực | có Thiên Ấn và Thực Thần | dùng Thiên Tài chế Kiêu; giữ nguồn thu ổn định |
| `guanZha` | 官殺混雜 | Quan Sát Hỗn Tạp | có Chính Quan và Thất Sát | chuyên nhất một nghề; Thực chế Sát hoặc Ấn hóa |
| `caiDuo` | 財多身弱 | Tài Đa Thân Nhược | thân nhược, Tài ≥ 2,5 | Tỷ Kiếp trợ thân; hợp tác; tránh ôm nợ |
| `shaGong` | 殺攻身 | Sát Công Thân | thân nhược, Thất Sát ≥ 2 | Ấn hóa Sát hoặc Thực chế; chọn môi trường có người bảo hộ |
| `qunJie` | 群劫爭財 | Quần Kiếp Tranh Tài | Kiếp Tài ≥ 1,5, Tài ≥ 1 | Quan Sát chế Kiếp; giữ tiền chặt |

### 1.3 Tần suất thật (để biết nội dung nào gặp nhiều)

Chạy `analyze` + `gaimenhPlan` trên **400 lá số ngẫu nhiên** (năm sinh 1960–2009, giờ ngẫu nhiên, hai giới; hạt giống cố định 7; năm tham chiếu 2026):

| Chẩn đoán | Số lá số có | Tỷ lệ |
|---|---|---|
| D2 Tổ hợp hung | 369 | 92,3% |
| D1 Mệnh cục thiên lệch | 279 | 69,8% |
| D4 盲派 做功 thấp | 245 | 61,3% |
| D5 Tài đa thân nhược | 26 | 6,5% |
| D3 Lưu niên bất lợi | 13 | 3,3% |
| D6 Mệnh tương đối cân | 1 | 0,3% |

| `patternQuality.quality` | Tỷ lệ |
|---|---|
| 败格 (Nghịch Thiên) | 50% |
| 有救 (Đắc Cứu) | 45% |
| 成格 (Thuận Thiên) | 5% |
| 特殊 (Dị Cách) | 0% trong mẫu (hiếm) |

**Hệ quả thiết kế:**

1. Gần như ai cũng có D2 → chuỗi tổ hợp hung (mục 4.4) là **nội dung lõi**, phải làm kỹ nhất (6 biến thể).
2. D6 gần như không gặp → nhánh «Giữ Phúc» (mục 4.6) chỉ cần một chuỗi ngắn nhưng phải có, vì canon §5.1 yêu cầu lá số tốt vẫn có nút cuối.
3. D3 hiếm vì điều kiện `score < 0` chỉ xảy ra khi `adjustLiunianByGeju` đẩy điểm xuống âm. Ví dụ: MAU-A năm 2026 điểm **6** («Đại hung») **không** sinh D3. Game hiển thị **đúng** engine (trụ cột T5), nhưng nút Thời dùng thêm `rating` để tăng độ sáng (mục 3.3). Đề xuất sửa engine ghi ở README.

### 1.4 Năm lá số đã chạy (đầu ra thật, rút gọn)

| Lá số | Tiềm Lực | Cách | Dụng / Hỷ / Kỵ | Chẩn đoán (theo thứ tự engine) | Tổ hợp hung | `mangpai` | Lưu niên 2026 |
|---|---|---|---|---|---|---|---|
| MAU-A 1990-05-15 08:30 nam | 41 | 有救 | Thủy / Kim / Thổ | D1, D2, D4 | Thương Quan Kiến Quan, Quan Sát Hỗn Tạp | 52 · Cách trung · Phú Quý cân bằng | 6 · Đại hung |
| MAU-B 1995-06-15 08:30 nam | 48 | 败格 | Thủy / Kim / Thổ | D1, D2 | Thương Quan Kiến Quan, Kiêu Đoạt Thực, Quan Sát Hỗn Tạp | 75 · Cách trung thượng · QUÝ | 9 · Đại hung |
| MAU-C1 1988-02-03 23:10 nữ | 46 | 有救 | Hỏa / Mộc / Thủy | D1, D2, D4 | Kiêu Đoạt Thực, Quan Sát Hỗn Tạp, Tài Đa Thân Nhược | 52 · Cách trung · PHÚ | 63 · Cát |
| MAU-C2 2001-11-20 04:00 nữ | 50 | 败格 | Mộc / Thủy / Kim | D1, D2, D4 | Thương Quan Kiến Quan | 52 · Cách trung · QUÝ | 24 · Hơi kỵ |
| MAU-C3 1975-08-08 14:00 nam | 56 | 有救 | Thổ / Hỏa / Mộc | D2, D4 | Kiêu Đoạt Thực | 52 · Cách trung · PHÚ | 40 · Bình |

*(MAU-C1…C3 là lá số ví dụ riêng của tài liệu này, không thay MAU-C của tài liệu 04.)*

---

## 2. Giải phẫu một nút Mệnh Đồ

### 2.1 Thành phần

| Thành phần | Nguồn | Hiển thị |
|---|---|---|
| Tên nút | `layers[i].name` bỏ biểu tượng chữ cái (🅰️…🅵) | «Không Gian (玄空飛星 + 八宅)» |
| Vì sao cần | chẩn đoán liên kết (mục 3.1), **nguyên văn** `diagnosis[].d` | đoạn trích trong ngoặc kép, chữ nghiêng |
| Việc làm | `layers[i].acts[]` nguyên văn, mỗi câu thành **một hạng mục**; mỗi hạng mục nối ≥ 1 nhiệm vụ `CQ-MD-xx` | danh sách có ô kiểm |
| Độ sáng | điểm nhấn (mục 3.2) | 1–4 ngọn đèn |
| Người dẫn | NPC của nút (bảng 2.2) | chân dung nhỏ |
| Nơi | vùng (region id canon) | chấm trên bản đồ thế giới |
| Trạng thái | khóa / mở / đang làm / xong / làm mới năm | màu nền |

### 2.2 Sáu nút — người dẫn và nơi

| `kind` | Thứ tự `pri` | Tên trong game | Người dẫn | Vùng chính | Vùng phụ | Công trình (tài liệu 07 cấp mã) |
|---|---|---|---|---|---|---|
| `space` | 1 | Không Gian | chủ sảnh Dương Trạch (NPC phụ, tài liệu 06 cấp mã) + Trương Thiên Sư (`truong_thiensu`) cho phần trấn trạch | `phongthuy` | `thanh` (nhà riêng), `longho` | sảnh Dương Trạch, nhà riêng Huyền Thành, Thiên Sư Phủ |
| `name` | 2 | Danh | Tế tửu Văn Miếu (`te_tuu`) | `vanmieu` | `thulau` | bàn đặt tên Văn Miếu |
| `timing` | 3 | Thời | chủ sảnh Trạch Nhật (NPC phụ) + Thầy Tử Bình (`thay_tubinh`) cho đọc lưu niên | `lichduong` | `thanh` (Vận Mệnh Các) | sảnh Trạch Nhật, Vận Mệnh Các |
| `taisui` | 4 | Thái Tuế | người giữ đèn Thái Tuế Điện (NPC phụ) | `thanh` (Thái Tuế Điện) | `longho` (bái Đẩu) | Thái Tuế Điện, Đẩu Mẫu Điện |
| `mangpai` | 5 | Làm Công | chủ sảnh Tượng Pháp (NPC phụ) | `manh` | `thanh` (chợ) | sảnh Tượng Pháp, chợ Huyền Thành |
| `virtue` | 6 | Tích Âm Đức | Vân Cốc thiền sư (`van_coc`) | `vancoc` | `buttap`, `vanmieu`, `yentu` | Am Vân Cốc |

### 2.3 Luật mở nút

| Luật | Nội dung |
|---|---|
| MO-1 | Nút **Tích Âm Đức** luôn mở từ khi Mệnh Đồ được vẽ (canon: «cốt lõi, luôn mở»). |
| MO-2 | Năm nút còn lại mở theo **thứ tự cố định** pri 1 → 5, nhưng người chơi **không bị bắt** làm theo thứ tự: nút pri n mở khi (a) nút pri n−1 đã bắt đầu, **hoặc** (b) cảnh giới ≥ 2, **hoặc** (c) nút pri n có điểm nhấn 4 đèn (bệnh ưu tiên nằm ở đó). |
| MO-3 | Bản iOS: chỉ mở `name` (dạng học chữ), `mangpai` (dạng học nghề) và `virtue`. Ba nút còn lại ẩn (05-14 §6). |
| MO-4 | Mệnh Đồ chỉ dựng cho **Bản Mệnh** (lá số đã lật trụ ở Sơn Môn). Hồ sơ khách trong Sổ Mệnh (`state.profiles`) có thể **xem** Mệnh Đồ dạng đọc, không sinh nhiệm vụ. |

---

## 3. Xếp ưu tiên

### 3.1 Liên kết chẩn đoán → nút

Engine không ghi chẩn đoán nào thuộc tầng nào. Game liên kết theo **nội dung `acts`** của chính engine:

| Chẩn đoán | Nút liên kết chính | Nút liên kết phụ | Căn cứ trong `gaimenh.js` |
|---|---|---|---|
| D1 Mệnh cục thiên lệch | `name` (bổ Dụng) | `space` (vượng phương), `timing` (năm Dụng) | `name.acts[0]` «mang hành DỤNG… → BỔ MỆNH»; `timing.acts[0]` «lưu niên CÁT mang Dụng» |
| D2 Tổ hợp hung | `taisui` | `virtue` | `taisui.acts[1]` «Tổ hợp hung (…) → hóa» |
| D3 Lưu niên bất lợi | `timing` | `taisui` | `timing.acts[0]` «tránh lưu niên hung (hiện …)» |
| D4 盲派 做功 thấp | `mangpai` | — | toàn bộ `mangpai.acts` |
| D5 Tài đa thân nhược | `mangpai` | `virtue` | «hợp tác/kết nối» (mangpai) + «舍財得財» (`BAZI_HUAJIE[2].ye`) |
| D6 Mệnh tương đối cân | `virtue` | `timing` | `verdict`: «tập trung vun Dụng/Hỷ + đón vận cát» |

### 3.2 Điểm nhấn (độ sáng)

```
nhấn(nút) = 1                                             // mọi nút có ít nhất 1 đèn
          + Σ_{d ∈ diagnosis liên kết CHÍNH với nút} w(d.sev)
          + Σ_{d ∈ diagnosis liên kết PHỤ với nút} 0,5 × w(d.sev)
          + bổ_sung(nút)
w(cao) = 2, w(trung) = 1, w(thấp) = 0,5
số đèn = clamp(round(nhấn), 1, 4)
```

**Bổ sung** (không phải chẩn đoán, chỉ đổi độ sáng; ghi rõ trên giao diện là «nhắc của Mệnh Đồ»):

| Nút | Bổ sung | Điều kiện |
|---|---|---|
| `timing` | +1 | `liunian[isNow].rating ∈ {Hung, Đại hung}` (vá chỗ D3 hiếm khi sinh) |
| `taisui` | +1 | `personalTaSui(chi năm sinh, chi năm hiện tại).level === 'nặng'` |
| `taisui` | +0,5 | `level === 'nhẹ'` |
| `virtue` | +1 | `patternQuality.quality === '败格'` (BAZI_HUAJIE: «bại cần bổ lớn») |
| `space` | +0,5 | người chơi chưa có nhà riêng |

**Ví dụ MAU-A:**

| Nút | Tính | Đèn |
|---|---|---|
| space | 1 + 0,5×2 (D1 phụ) + 0,5 (chưa có nhà) = 2,5 | 3 |
| name | 1 + 2 (D1 chính) = 3 | 3 |
| timing | 1 + 0,5×2 (D1 phụ) + 1 (Đại hung) = 3 | 3 |
| taisui | 1 + 2 (D2 chính) + 1 (phạm nặng) = 4 | 4 |
| mangpai | 1 + 1 (D4 chính) = 2 | 2 |
| virtue | 1 + 0,5×2 (D2 phụ) = 2 | 2 (luôn mở) |

### 3.3 Thứ tự gợi ý

NPC dẫn đạo và nút «Đi tiếp» trong Sổ Mệnh dùng thứ tự:

1. nút có số đèn cao nhất **đang mở và chưa xong**;
2. hòa đèn → `pri` nhỏ hơn (thứ tự app: Không Gian → Danh → Thời → Thái Tuế → Làm Công);
3. nút Tích Âm Đức **luôn** có một hạng mục hằng ngày ở đầu danh sách «Hôm nay» (một việc thiện nhỏ), bất kể đèn.

**MAU-A:** Thái Tuế (4 đèn) → Không Gian (3, pri 1) → Danh (3, pri 2) → Thời (3, pri 3) → Làm Công (2) ; Tích Âm Đức hằng ngày.

### 3.4 Câu NPC theo nút đầu

| Nút đầu | Lời mở (giọng NPC dẫn) |
|---|---|
| Thái Tuế | Vân Cốc: «Năm nay tuổi con đứng ngay trước mặt Thái Tuế. Đi thắp đèn trước, rồi ta nói chuyện lâu dài.» |
| Không Gian | Vân Cốc: «Người ở đâu thì khí ở đó. Con có chỗ nào gọi là nhà chưa?» |
| Danh | Tế tửu: «Tên là cái người khác gọi con mỗi ngày. Gọi cho đúng thì nghe mãi cũng thấm.» |
| Thời | Thầy Tử Bình: «Có năm để tiến, có năm để giữ. Năm nay là năm nào của con, ta xem cùng.» |
| Làm Công | chủ sảnh Tượng Pháp: «Manh phái nói: hợp là công lớn. Con làm một mình lâu rồi phải không?» |
| Tích Âm Đức | Vân Cốc: «Mấy tầng kia là thuận vận. Tầng này mới là đổi số.» |

---

## 4. Mẫu nhiệm vụ cho từng tầng

Quy ước cột: **Sinh khi** = điều kiện engine để nhiệm vụ xuất hiện; **Mục tiêu** = việc máy nhiệm vụ kiểm; **Thưởng** = Đạo Hạnh gốc `B` (nhân theo 05-01 §3.1), Phúc Khí `PK`, mở khóa; **Dạy** = dữ liệu app người chơi học được. Mọi `CQ-MD` cho Đạo Hạnh thuộc nhóm «học» (không được Nghịch Duyên) trừ khi ghi «tu tâm».

### 4.0 Mở hệ thống

| Mã | Tên | Sinh khi | Mục tiêu | NPC · vùng | Thưởng | Dạy |
|---|---|---|---|---|---|---|
| CQ-MD-00 | Vẽ Mệnh Đồ | xong nhiệm vụ cốt truyện «Mệnh Đồ» (Hồi I, tài liệu 03) | xem Vân Cốc trải cuộn Mệnh Đồ; chạm vào cả 6 nút; nghe đọc `verdict` | `van_coc` · `vancoc` | B 20; mở trang Mệnh Đồ | `gaimenhPlan.verdict`, thứ tự 6 tầng |

### 4.1 Tầng KHÔNG GIAN (`space`, pri 1)

**Engine sinh 3 câu `acts`:**
1. «Kích hoạt 旺 phương {wangFang.palace…} (đương lệnh {currentStar.name}) — cửa/sảnh/văn phòng/phòng khách ở đây.»
2. «Tránh/phòng hung phương {xiongFang 3 cung đầu (tên sao)} — không động thổ, đặt toilet/kho để "ấn" sát.»
3. «Theo 命卦 八宅 … chọn hướng cửa/giường hợp mình; ưu tiên phương giao điểm 八宅 cát ∩ 玄空 旺.»

Câu 1–2 **chỉ phụ thuộc năm** (giống nhau cho mọi người chơi cùng năm — ví dụ năm 2026 cho ra vượng phương «Trung cung / Tây Bắc», hung phương «Đông Bắc (Nhị Hắc), Chính Nam (Tam Bích), Tây Nam (Ngũ Hoàng)»). Câu 3 cá nhân hóa qua **mệnh quái Bát Trạch** của người chơi (`zhai`). Vì vậy nút này có phần chung (học Huyền Không năm) và phần riêng (Bát Trạch).

**Nhà riêng:** mỗi người chơi được một **nhà riêng ở Huyền Thành** (lô đất cố định theo số thứ tự tài khoản; tài liệu 07/08 thiết kế kiểu nhà và mô-đun nội thất). Mỗi lô có hướng cửa và **một sát ngoại cảnh cố định** (lấy từ `SHA_LIST`, xoay vòng theo lô) để bài học hóa sát có thật.

| Mã | Tên | Sinh khi | Mục tiêu | NPC · vùng | Thưởng | Dạy |
|---|---|---|---|---|---|---|
| CQ-MD-10 | Một mái nhà | nút `space` mở | nhận chìa khóa lô đất; đi vào nhà; dùng la bàn xác định hướng cửa | người giữ sổ địa chính Huyền Thành (NPC phụ) · `thanh` | B 15; PK 20 | la bàn 24 sơn |
| CQ-MD-11 | Sao đương lệnh | sau CQ-MD-10 | đến sảnh Dương Trạch; đọc bàn Huyền Không năm; chỉ đúng cung vượng và cung hung trên mô hình 9 cung | chủ sảnh Dương Trạch · `phongthuy` | B 25 | `xuankongPan`: `yun`, `currentStar`, `wangFang`, `xiongFang` |
| CQ-MD-12 | Mở cửa đón vượng | sau CQ-MD-11 | trong nhà riêng: đặt bàn tiếp khách hoặc bàn làm việc ở cung vượng (mô-đun nội thất); điểm an trạch phần «vượng» ≥ 30/40 | — (tự làm; chủ sảnh nhận xét qua thư) · `thanh` | B 30; mở **Phù Gia Trạch** khi tổng điểm an trạch ≥ 70 | acts[0] |
| CQ-MD-13 | Ấn sát | sau CQ-MD-11 | đặt kho / nhà vệ sinh / vật nặng ở cung hung; **không** đặt bếp, giường, cửa ở Ngũ Hoàng; điểm «ấn sát» ≥ 20/30 | như trên | B 25 | acts[1]; tên sao Nhị Hắc, Ngũ Hoàng |
| CQ-MD-14 | Mệnh quái của con | sau CQ-MD-10 | tính mệnh quái (theo năm sinh + giới) ở sảnh Dương Trạch; biết 4 phương cát / 4 phương hung Bát Trạch của mình | chủ sảnh Dương Trạch · `phongthuy` | B 25 | `zhai` (mệnh quái, Đông tứ / Tây tứ) |
| CQ-MD-15 | Giường và cửa | sau CQ-MD-14 | đặt đầu giường quay phương cát (Sinh Khí / Thiên Y / Diên Niên / Phục Vị); cửa chính hoặc cửa phòng mở về phương cát | — · `thanh` | B 30 | acts[2] |
| CQ-MD-16 | Giao điểm cát | sau CQ-MD-12 và -15 | tìm cung vừa là Bát Trạch cát vừa là Huyền Không vượng (nếu có) và đặt chỗ ngồi thiền ở đó; nếu năm đó không có giao điểm → NPC giải thích, nhiệm vụ đổi thành «chọn cung ít xung nhất» | chủ sảnh Dương Trạch | B 35; điểm an trạch +10 | «八宅 cát ∩ 玄空 旺» |
| CQ-MD-17 | Sát ngoài cửa | lô đất có sát ngoại cảnh | nhận diện sát của lô (vd 路冲 đường chiếu cửa, 尖角煞 góc nhọn, 反弓 đường cong ngược…); chọn đúng một cách hóa trong `cures[]` của sát đó; đặt vật hóa (mua bằng PK) | chủ sảnh Dương Trạch · `phongthuy` → `thanh` | B 30 | `SHA_LIST[id].desc / cures`; `cureByElement` (vật theo Dụng) |
| CQ-MD-18 | Trấn trạch chính tông | sau CQ-MD-17, đạo thống bất kỳ hạng I | lên Long Hổ; xem Trương Thiên Sư giảng **cấu trúc** phù «hợp cảnh bình an» (5 phần: đầu, thân, bụng, đảm, chân — chỉ cấu trúc); nhận một phù **ký tự hư cấu** treo trong nhà | `truong_thiensu` · `longho` | B 25; vật trang trí phù (không chỉ số) | `talisman-data › FU_HE_JING_PING_AN` (cấu trúc), `ETHICS` («phải do đạo sĩ thụ lục») |
| CQ-MD-19 | Năm mới đổi sao | Lập Xuân năm mới, đã xong CQ-MD-12 | xem bàn Huyền Không năm mới; dời bàn / kho theo vượng–hung mới | chủ sảnh Dương Trạch | B 20 (mỗi năm) | `xuankongPan(năm mới)` |

**Điểm an trạch** (100) để mở Phù Gia Trạch: vượng (40) + ấn sát (30) + Bát Trạch (20) + hóa sát ngoại cảnh (10). Bảng chấm do tài liệu 08 hoàn thiện theo mô-đun nội thất. **Hoàn thành nút** = CQ-MD-12, -13, -15, -17 xong → B 50 thưởng nút.

### 4.2 Tầng DANH (`name`, pri 2)

**Engine sinh 2 câu:**
1. «Đảm bảo tên … mang hành DỤNG {hành} / HỶ {hành} → BỔ MỆNH; nếu tên mang KỴ {hành} → cân nhắc đổi chữ/bí danh dùng hành Dụng.»
2. «Tên khai sinh khó đổi thì dùng tên gọi/bút danh/địa danh kinh doanh mang hành Dụng để "tăng số".»

**Nguyên tắc đạo đức riêng của game:** game **không bao giờ** khuyên người chơi đổi **tên thật** ngoài đời. Mọi nhiệm vụ đặt tên chỉ áp lên **tên trong game**: đạo hiệu, bút danh khoa cử, tên nhà, tên quầy. Câu 1 của engine được hiển thị nguyên văn kèm chú thích của Tế tửu: «Tên khai sinh là của cha mẹ cho. Ở đây ta đặt đạo hiệu.»

| Mã | Tên | Sinh khi | Mục tiêu | NPC · vùng | Thưởng | Dạy |
|---|---|---|---|---|---|---|
| CQ-MD-20 | Đọc tên mình | nút `name` mở | nhập tên hiển thị (Hán Việt) vào bàn đặt tên; xem ngũ cách (thiên, nhân, địa, ngoại, tổng) và hành của từng cách | `te_tuu` · `vanmieu` | B 20 | `naming › fiveGrid`, `analyzeName` |
| CQ-MD-21 | Chữ của hành Dụng | sau CQ-MD-20 | ở Thư Lâu: tìm 5 chữ Hán mang hành Dụng (theo bộ thủ / nghĩa) trong kệ sách; mỗi chữ có thẻ giải nghĩa | thủ thư Thư Lâu (NPC phụ) · `thulau` | B 25 | quy tắc hành của chữ trong `naming` |
| CQ-MD-22 | Đặt đạo hiệu | sau CQ-MD-21 | chọn 2 chữ đạo hiệu; tổng nét và nhân cách có hành Dụng hoặc Hỷ; Tế tửu chấm (dùng `analyzeName`) ≥ «cát» | `te_tuu` · `vanmieu` | B 40; **đạo hiệu** hiển thị trên bảng tên (thay hoặc cạnh tên) | `STROKES_81` (81 số lý), ngũ cách |
| CQ-MD-23 | Tên nhà | sau CQ-MD-22 và có nhà riêng | đặt tên biển nhà (2–4 chữ) mang hành Dụng; treo biển | `te_tuu` (thư) · `thanh` | B 15; biển nhà | acts[1] «địa danh» |
| CQ-MD-24 | Bút danh khoa cử | đạo Nho đang tu hoặc đã thi Hương | đăng ký bút danh khi nộp quyển (dùng ở bảng vàng) | `te_tuu` · `vanmieu` | B 15 | acts[1] «bút danh» |
| CQ-MD-25 | Tên của cha mẹ cho | tên hiển thị chứa chữ hành **Kỵ** | nghe Tế tửu kể vì sao người xưa giữ tên khai sinh và dùng tự / hiệu; chọn: giữ tên hiển thị (được) hoặc dùng đạo hiệu làm tên chính | `te_tuu` | B 15; không có lựa chọn sai | acts[0] phần «nếu tên mang KỴ» + giới hạn đạo đức của game |

**Biến thể theo hành Dụng** (đổi kệ sách ở CQ-MD-21 và gợi ý của Tế tửu):

| Dụng | Gợi ý bộ / nghĩa (nội dung game) | Ví dụ đạo hiệu được chấm cát (minh họa, chấm thật bằng `analyzeName`) |
|---|---|---|
| Mộc | bộ Mộc 木, Thảo 艹, Trúc 竹; nghĩa cây, xuân, sinh | «Thanh Lâm», «Xuân Trúc» |
| Hỏa | bộ Hỏa 火 / 灬, Nhật 日; nghĩa sáng, ấm | «Minh Chiếu», «Huy Quang» |
| Thổ | bộ Thổ 土, Sơn 山, Thạch 石; nghĩa núi, vững | «Hậu Sơn», «Bàn Thạch» |
| Kim | bộ Kim 金 / 釒; nghĩa sắc, trong, bạc | «Minh Kính», «Kim Thanh» |
| Thủy | bộ Thủy 氵, Vũ 雨; nghĩa nước, sâu, tĩnh | «Tĩnh Hải», «Thanh Tuyền» |

**Hoàn thành nút** = CQ-MD-20, -21, -22 → B 50.

### 4.3 Tầng THỜI (`timing`, pri 3)

**Engine sinh 3 câu:**
1. «Việc lớn … làm vào lưu niên CÁT mang Dụng {hành}; tránh lưu niên hung (hiện {năm} = {rating}).»
2. «Dùng mục Chọn Ngày Lành (建除十二神 + tránh xung tuổi) cho từng việc cụ thể.»
3. «Cát tháng: xem mục Lưu Nguyệt, ưu tiên tháng CÁT trong năm…»

Câu 1 có **phần đuôi** đổi theo `liunian[isNow].rating` — đây là chỗ sinh biến thể.

| Mã | Tên | Sinh khi | Mục tiêu | NPC · vùng | Thưởng | Dạy |
|---|---|---|---|---|---|---|
| CQ-MD-30 | Năm này của con | nút `timing` mở | vào Vận Mệnh Các; đứng trước cổng đại vận đang đi; đọc bảng lưu niên 10 năm; chỉ ra năm hiện tại và rating | `thay_tubinh` · `thanh` | B 25 | `R.liunian[].score/rating`, `vanmenh.js` |
| CQ-MD-31 | Thời điểm vàng | sau CQ-MD-30 | đánh dấu trên **Lịch Đạo** (lịch cá nhân trong Sổ Mệnh) các năm Cát / Đại cát sắp tới do `buildRemedy.timing` trả | `thay_tubinh` | B 20; Lịch Đạo có dấu năm | `buildRemedy › timing` |
| CQ-MD-32 | Ngày cho lễ nhập đạo | trước lễ nhập đạo thống đầu tiên | ở sảnh Trạch Nhật: dùng `findGoodDates` tìm 3 ngày tốt cho hoạt động «nhập học / khai trương» (activityId do tài liệu 09 chọn), loại ngày xung tuổi; chọn một ngày; làm lễ đúng ngày đó | chủ sảnh Trạch Nhật · `lichduong` | B 35; **Phù Cát Nhật** cho lễ | `zheri › evaluateDate`, `findGoodDates`, 建除十二神 |
| CQ-MD-33a | Năm tiến | rating ∈ {Cát, Đại cát} | khởi một việc lớn trong game trong năm này: mở quầy ở chợ, nhận chức trong đạo tràng, hoặc xây thêm phòng nhà riêng | `thay_tubinh` | B 40 | `buildLiunianAdvice`: «nên tiến thủ, nắm cơ hội» |
| CQ-MD-33b | Năm ổn | rating = Bình | giữ nhịp: 21 ngày có ít nhất một việc tu; không khởi đại sự mới | `thay_tubinh` | B 40 | «giữ ổn định, thuận tự nhiên» |
| CQ-MD-33c | Năm giữ | rating ∈ {Hơi kỵ, Hung, Đại hung} | «thủ không tiến»: hoãn một việc lớn đang định (máy nhiệm vụ đưa lựa chọn hoãn mở quầy / hoãn thi Đình) **và** làm 7 buổi tu tâm (Nghịch Duyên đang bật) | `thay_tubinh` + `van_coc` | B 40 (tu tâm) | «thủ không tiến: giữ tiền, tránh đầu tư/liều… tích đức hoá giải» (`liunian-pro`); `GAI_XIN.keys4[1]` |
| CQ-MD-34 | Tháng cát trong năm | sau CQ-MD-30 | xem lưu nguyệt; chọn tháng cát nhất còn lại của năm; đặt lịch một lễ ở thánh địa trong tháng đó | chủ sảnh Trạch Nhật | B 25 | lưu nguyệt (`liunian-pro`/mục Lưu Nguyệt app) |
| CQ-MD-35 | Năm sau | 30 ngày trước Lập Xuân | xem trước rating năm sau; chuẩn bị (đổi CQ-MD-33 biến thể cho năm sau) | `thay_tubinh` | B 15 | |

**Lời Thầy Tử Bình theo biến thể** (bắt buộc kèm «con có thể…», quy tắc an toàn §6.4 bản sơ đồ):

| Biến thể | Lời |
|---|---|
| Năm tiến | «Năm nay gió thuận. Con có thể làm việc lớn, nhưng nhớ: thuận vận là trời cho mượn.» |
| Năm ổn | «Năm bình. Con có thể giữ nhịp đều — người đi xa nhất là người đi đều nhất.» |
| Năm giữ | «Năm nay là năm giữ. Con có thể hoãn việc lớn mà không thua ai: năm giữ là năm tu tâm được nhiều nhất.» |

**Hoàn thành nút** = CQ-MD-30, -32, một biến thể -33 → B 50. Nút **làm mới mỗi năm** (biến thể -33 theo năm mới).

### 4.4 Tầng THÁI TUẾ (`taisui`, pri 4)

**Engine sinh 2 câu:**
1. «Kiểm tra mục Thái Tuế — nếu phạm (值/冲/刑/破/害) → làm 7 pháp hoá giải sau Lập Xuân.»
2. «Tổ hợp hung ({danh sách}) → hóa: 伤官见官 dùng Ấn chế; 枭夺食 dùng Tài chế Kiêu; v.v.»

Câu 2 của engine chỉ nêu rõ hai tổ hợp rồi «v.v.». Game dùng `SPECIFIC_REMEDY` để có thuốc cho **cả sáu**.

#### 4.4.1 Chuỗi Thái Tuế theo kiểu phạm

`personalTaSui(chi năm sinh, chi năm hiện tại)` trả `offends`, `level` (`nặng` nếu Trị hoặc Xung, `nhẹ` nếu khác), `types[]`, `remedyCharms` (hai con giáp tam hợp).

| Mã | Tên | Sinh khi | Mục tiêu | NPC · vùng | Thưởng | Dạy |
|---|---|---|---|---|---|---|
| CQ-MD-40 | Năm tuổi | nút `taisui` mở | vào Thái Tuế Điện; tìm tượng niên chủ năm nay; tra bảng 12 con giáp năm nay (`taSuiTable`) | người giữ đèn · `thanh` | B 20 | `taSuiTable`, `TYPE_VI` |
| CQ-MD-41 | Trị Thái Tuế | `types` có `zhi` | nghe giảng «năm tuổi, biến động nặng»; làm ①②④⑥⑦ (bảng 4.4.2) | người giữ đèn | B 40 | `TYPE_VI.zhi` |
| CQ-MD-42 | Xung Thái Tuế | `chong` | như trên; thêm: không di chuyển nhà riêng trong tháng xung | người giữ đèn | B 40 | `TYPE_VI.chong` |
| CQ-MD-43 | Hình Thái Tuế | `xing` | học ba loại hình (vô lễ, thế thế, vô ân, tự hình); làm ①⑥⑦; chuỗi «tránh khẩu thiệt» 7 ngày (không chọn phương án `ac_khau`) | người giữ đèn | B 30 | `taisui › xingOf` |
| CQ-MD-44 | Phá Thái Tuế | `po` | làm ①⑥; giữ một lời hứa với NPC 7 ngày | người giữ đèn | B 25 | `TYPE_VI.po` |
| CQ-MD-45 | Hại Thái Tuế | `hai` | làm ①⑥; nhận diện «tiểu nhân» trong án Định Mệnh Hội của vùng | người giữ đèn | B 25 | `TYPE_VI.hai` |
| CQ-MD-46 | Năm bình an | `offends === false` | thắp đèn cho một NPC phạm Thái Tuế (người già ở Huyền Thành) | người giữ đèn | B 20; +1 công «Giúp người khó khăn» | lòng giúp người phạm |

**MAU-A** (2026, tuổi Ngọ): sinh CQ-MD-40, -41 (Trị), -43 (Hình). Đeo tam hợp: Hổ, Chó.

#### 4.4.2 Bảy pháp hóa Thái Tuế → nhiệm vụ con

`TAISUI_REMEDY` có 7 pháp. Game làm 6; **pháp ③ bị loại** vì nội dung «hiến máu / cạo máu / trích nha… chủ động ứng huyết quang» liên quan tới tự gây chảy máu (trụ cột T6). Thay bằng thẻ Tàng Kinh ghi rõ: «Có người làm thế. Game không làm, và con cũng không cần làm.»

| Pháp | App nói | Nhiệm vụ con | Cơ chế | Thưởng |
|---|---|---|---|---|
| ① | an Thái Tuế sau Lập Xuân | CQ-MD-47 «Thắp Đèn Niên» | `state › lightLamp(year)` (đã có): lần đầu +10 PK, mỗi ngày +3 PK | B 15 lần đầu |
| ② | đeo tam hợp sinh tiếu | CQ-MD-48 «Bạn tam hợp» | nhận một **mặt dây** con giáp từ `remedyCharms` (ô «cầm tay» hoặc phụ kiện; vật thẩm mỹ, không chỉ số) | B 10 |
| ③ | huyết quang | **không làm** | — | — |
| ④ | đỗ xuân (躲春) | CQ-MD-49 «Ở yên giờ Lập Xuân» | sự kiện máy chủ đúng giờ Lập Xuân (giờ thật): người chơi trong nhà riêng hoặc trong điện ≥ 30 phút quanh giờ khắc | B 20 (tu tâm) |
| ⑤ | thái tuế phù | CQ-MD-50 «Phù năm» | nhận phù **ký tự hư cấu** ở Thái Tuế Điện; cuối năm «hóa» (trả lại điện) — hoạt ảnh thu phù, không đốt trên màn hình nhà riêng | B 10 |
| ⑥ | hành thiện tích đức | CQ-MD-51 «Thiện năm tuổi» | 12 việc thiện (DEED bất kỳ) trong năm phạm | B 30; liên kết Sổ Công Quá |
| ⑦ | khiêm, tránh khẩu thiệt, không động thổ phương Thái Tuế | CQ-MD-52 «Không động phương Thái Tuế» | trong năm: không sửa / xây ở cung nhà trùng `taSuiDirection(chi năm)`; 30 ngày không chọn phương án `ac_khau` | B 30 |

#### 4.4.3 Chuỗi hóa tổ hợp hung

Mỗi tổ hợp hung trong `synthesis.combos` sinh **một** chuỗi 3 bước: hiểu (học) → tập (hành) → giữ (tâm). Nội dung bám câu `SPECIFIC_REMEDY` tương ứng.

| Mã | Tổ hợp | Bước 1 · Hiểu | Bước 2 · Tập | Bước 3 · Giữ | NPC · vùng | Thưởng |
|---|---|---|---|---|---|---|
| CQ-MD-53 | Thương Quan Kiến Quan | giải 1 án khách có tổ hợp này ở sảnh Cách Cục; chỉ ra Ấn hóa Thương | «Ấn chế»: đọc 3 quyển ở Văn Miếu / Thư Lâu (học) | 14 ngày không chọn phương án cãi bậc trên (thẻ `nghich_thuong`) | chủ sảnh Cách Cục → `te_tuu` · `tubinh`, `vanmieu` | B 30 / 30 / 40 |
| CQ-MD-54 | Kiêu Đoạt Thực | giải 1 án có tổ hợp; chỉ ra Tài chế Kiêu | «giữ nguồn thu ổn định»: mở quầy nhỏ ở chợ, bán đều 7 ngày (không đầu cơ) | không tham gia sự kiện «đánh cược Phúc Khí» trong tháng | chủ sảnh Cách Cục → chợ Huyền Thành | B 30 / 30 / 40 |
| CQ-MD-55 | Quan Sát Hỗn Tạp | giải 1 án; chỉ ra «khử trọc lưu thanh» | chọn **một** đạo thống làm chính, chỉ tu đạo đó 30 ngày | không đổi đạo chính trong 30 ngày | chủ sảnh Cách Cục → Am Vân Cốc | B 30 / 30 / 40 |
| CQ-MD-56 | Tài Đa Thân Nhược | giải 1 án; chỉ ra Tỷ Kiếp trợ thân | tổ đội 5 lần với cùng một đồng môn (hợp tác) | không vay Phúc Khí của người khác quá 2 lần / tháng (hệ thống vay mượn của tài liệu 11) | chủ sảnh Cách Cục → chợ | B 30 / 30 / 40 |
| CQ-MD-57 | Sát Công Thân | giải 1 án; chỉ ra Ấn hóa Sát / Thực chế Sát | chọn: học kinh (Ấn) **hoặc** luyện một nghề tới thông thạo ≥ 70% (`deskMastery`) | 7 ngày không nhận nhiệm vụ nguy hiểm (thử thách «vào hang Miêu Cương một mình») — đi cùng người bảo hộ | chủ sảnh Cách Cục | B 30 / 30 / 40 |
| CQ-MD-58 | Quần Kiếp Tranh Tài | giải 1 án; chỉ ra Quan Sát chế Kiếp | nhận một **kỷ luật** (giới tự nguyện 14 ngày) | không cho vay / đầu cơ Phúc Khí 30 ngày | chủ sảnh Cách Cục | B 30 / 30 / 40 |

**Hoàn thành nút Thái Tuế** = CQ-MD-40 + (một chuỗi kiểu phạm hoặc -46) + ≥ 1 chuỗi tổ hợp hung (nếu có) → B 50. Làm mới mỗi năm (phần Thái Tuế); chuỗi tổ hợp hung chỉ làm **một lần đời**.

### 4.5 Tầng LÀM CÔNG (`mangpai`, pri 5)

**Engine sinh 2 câu:**
1. «盲派: "hợp" = công lớn → tăng 做功 bằng HỢP TÁC/KẾT NỐI/quan hệ ({fuguui}). Dù mệnh thấp, năng lực "lấy tài quan về主位" vẫn tăng được qua mạng lưới.»
2. `mangpai.notes[notes.length − 2]` — thực tế luôn là dòng «【做功定層次】{level}. {fuguui}.»

Biến thể theo `fuguui` (3) × `level` (4):

| `fuguui` | Ý (app) | Hướng làm công trong game |
|---|---|---|
| PHÚ (Tài chủ đạo) | «hướng phú/kinh doanh» | **Thương đạo**: quầy chợ, hội buôn, vận chuyển hàng giữa vùng |
| QUÝ (Quan/Sát chủ đạo) | «hướng quý/quyền/quan» | **Trị đạo**: làm trưởng ban lễ ở đạo tràng, hòa giải tranh chấp ở Huyền Thành, xử án Định Mệnh Hội |
| Phú Quý cân bằng | — | chọn một trong hai, đổi được một lần |

| `level` | `mangpai.score` | Độ dài chuỗi |
|---|---|---|
| Cách cao (làm lớn được) | ≥ 78 | 2 bước (đã có nền; chỉ cần «giữ hợp») |
| Cách trung thượng | 62–77 | 3 bước |
| Cách trung | 45–61 | 4 bước |
| Cách thường | < 45 | 5 bước (đi chậm, nhiều người giúp) |

| Mã | Tên | Sinh khi | Mục tiêu | NPC · vùng | Thưởng | Dạy |
|---|---|---|---|---|---|---|
| CQ-MD-60 | Đọc làm công | nút `mangpai` mở | ở sảnh Tượng Pháp: đọc `notes` của chính mình (Lộc tọa đâu, Tài Quan ở chủ vị hay tân vị); trả lời 3 câu hỏi về «hợp nhận / xung lấy» | chủ sảnh Tượng Pháp · `manh` | B 25 | `analyzeMangpai`: 禄, 主位 / 宾位, «HỢP NHẬN», «XUNG LẤY» |
| CQ-MD-61 | Hợp là công lớn | sau CQ-MD-60 | 3 hoạt động tổ đội (giải án đôi, sảnh nghề đôi, sự kiện chung) | chủ sảnh Tượng Pháp | B 30 | acts[0] |
| CQ-MD-62P | Quầy đầu tiên | `fuguui` PHÚ | mở quầy ở chợ Huyền Thành; bán ≥ 20 món cho người chơi / NPC với **giá niêm yết công bằng** (không vượt 120% giá gốc) | quản chợ (NPC phụ) · `thanh` | B 30; PK theo doanh thu | «Tài chủ đạo» |
| CQ-MD-62Q | Người hòa giải | `fuguui` QUÝ | xử 3 vụ tranh chấp nhỏ ở Huyền Thành (hội thoại có lựa chọn công bằng) | trưởng phố (NPC phụ) · `thanh` | B 30 | «Quan/Sát chủ đạo» |
| CQ-MD-63 | Mạng lưới | `level` ≤ Cách trung | kết giao 5 NPC thuộc 5 vùng khác nhau (hội thoại «thăm hỏi», giữ liên lạc 3 lần mỗi người trong 30 ngày) | — | B 40 | `noble-cultivate.maintenance[1]` «giữ liên lạc đều» |
| CQ-MD-64 | Tìm quý nhân | sau CQ-MD-61 | đi tới nơi gợi ý theo Dụng (`WX_NOBLE_SEEK[dung].place` ánh xạ vào vùng game); làm việc «cho trước» (`GIVE_BACK[dung]`) cho một NPC ở đó | NPC quý nhân của vùng (NPC phụ) | B 35 | `nobleCultivation`: `whereToFind`, `whatToGive`, 5 nguyên tắc |
| CQ-MD-65 | Trục mạnh | sau CQ-MD-60 | xem Ngũ Duy; chọn trục cao nhất; làm 5 việc thuộc trục đó (Thương / Trị / Học / Nghệ / Đồng đạo — bảng ở tài liệu 04) | chủ sảnh Tượng Pháp | B 30 | `fiveDimRadar` |
| CQ-MD-66 | Thành quý nhân của người | sau CQ-MD-64 | giúp một người chơi mới (bậc 1) xong nhiệm vụ đầu tiên của họ | — | B 40; +2 công «Giúp người khó khăn» | `maintenance[4]` «trở thành quý nhân của người khác» |

**Ánh xạ nơi gặp quý nhân** (`WX_NOBLE_SEEK[x].place` → vùng game):

| Dụng | App: nơi | Game: vùng / nơi |
|---|---|---|
| Mộc | rừng, công viên, trường học | Thư Lâu Lâm (`thulau`), vườn thuốc Miêu Cương |
| Hỏa | sự kiện, bếp, show | lễ hội ở Huyền Thành, lò đan Võ Đang |
| Thổ | xây dựng, thiền đường | xưởng sửa chùa Bút Tháp, Chung Nam |
| Kim | tài chính, văn phòng luật | sảnh Cách Cục (`tubinh`), xưởng chuông Long Hổ |
| Thủy | cảng, thương mại, sông hồ | bến Cùng Thông Hồ (`cungthong`), chợ Huyền Thành |

**Hoàn thành nút** = số bước theo `level` (bảng trên, lấy theo thứ tự -60, -61, -62x, -63, -64) → B 50.

### 4.6 Tầng TÍCH ÂM ĐỨC (`virtue`, pri 6, luôn mở)

**Engine sinh 2 câu** (giống nhau cho mọi lá số):
1. «《了凡四训》: số KHÔNG bất biến — TÍCH ÂM ĐỨC (hành thiện không đồ báo) là pháp DUY NHẤT thật sự "nghịch thiên"…»
2. «Sửa lỗi (改过) + khiêm đức (谦德) + lập chí hướng…»

Nút này nối thẳng vào Sổ Công Quá (05-03) và nghiệp (05-05).

| Mã | Tên | Sinh khi | Mục tiêu | NPC · vùng | Thưởng | Dạy |
|---|---|---|---|---|---|---|
| CQ-MD-70 | Ba việc thiện đầu tiên | CQ-MD-00 xong | làm 3 DEED thiện bất kỳ (ít nhất 2 loại khác nhau) | `van_coc` · `vancoc` | B 20 | `CONG_QUA.thien` |
| CQ-MD-71 | Trang sổ đầu | sau CQ-MD-70 | mở Sổ Công Quá; đọc lời nhận xét `meritLedger(7 ngày).verdict`; ghi một dòng tự nhận xét (tùy chọn, không chấm) | `van_coc` | B 15 | `meritLedger` |
| CQ-MD-72 | Lập chí | sau CQ-MD-71 | chọn **một chí hướng** trong 6 (bảng 4.6.1) và đọc lời nguyện trước tượng ở am | `van_coc` | B 30; ghi «chí» lên Sổ Mệnh | `LIAOFAN.quote` «立定此志» |
| CQ-MD-73 | Cải quá | có ≥ 1 mục «quá» trong Sổ Công Quá | chọn một mục quá; làm việc sửa tương ứng (trả lại, xin lỗi, bồi đắp — danh mục ở 05-05) | `van_coc` | B 30 | `LIAOFAN.principle` 改過之法 |
| CQ-MD-74 | Khiêm | sau CQ-MD-72 | 5 lần chọn phương án khiêm (05-01 §3.6) | `van_coc` | B 25 (tu tâm) | 谦德之效 |
| CQ-MD-75 | Tam Tầng Dược | sau CQ-MD-71 | xem thẻ Tam Tầng Dược (05-01 §3.9); làm một việc ở mỗi lớp hình · tâm · nghiệp | `van_coc` | B 40 | `getRemedyForChart`, `BAZI_HUAJIE` |
| CQ-MD-76 | Âm chất đầu tiên | sau CQ-MD-70 | làm một việc thiện **ẩn** (05-01 §3.6) | — | B 15 | «Làm thiện ẩn (âm chất)» |
| CQ-MD-77 | Ba trăm | công hữu hiệu ròng ≥ 300 | về Am Vân Cốc; lễ Nguyện Thứ Nhất | `van_coc` | Đại Nguyện 1 (05-01 §4.4) | `LIAOFAN_STORY` |
| CQ-MD-78 | Sáu trăm | ≥ 600 | đến Văn Miếu; khắc tên bia Đạo Hạnh | `te_tuu` · `vanmieu` | Đại Nguyện 2 | |
| CQ-MD-79 | Một nghìn | ≥ 1.000 | lên Côn Lôn cùng Vân Cốc (cần bậc 6) hoặc, nếu chưa bậc 6, nghe lời hẹn ở am | `van_coc` · `conlon` | Đại Nguyện 3 | |

**Hoàn thành nút** = CQ-MD-70, -71, -72, -73 (hoặc -74 nếu chưa có quá nào) → B 50. Nút không bao giờ «đóng»: các nhiệm vụ mốc -77…-79 nằm trong nút.

#### 4.6.1 Sáu chí hướng (CQ-MD-72)

Lấy cảm hứng từ chí của Liễu Phàm (cầu con, cầu công danh) nhưng chuyển sang việc trong game, không ai cầu «giàu» hay «có con» bằng điểm:

| Chí | Gắn với | Mục tiêu dài |
|---|---|---|
| Lập Thân | Nho · khoa cử | đỗ Tiến sĩ (05-11) |
| Cứu Người | trừ tà chính tông, cứu nạn | 60 lần «Cứu người nguy cấp» |
| Hộ Pháp | thánh địa | góp 10 lần sửa đạo tràng |
| Hiếu Đạo | gia đình NPC | trọn chuỗi hiếu đạo Huyền Thành |
| Giải Thoát | Thiền / Tịnh Độ | hạng V một đạo Phật |
| Truyền Đạo | sư đồ | 3 đệ tử hoàn thành Mệnh Đồ |

Chí không đổi điểm; chỉ đổi **lời nhắc của Vân Cốc** và đoạn kết Đại Nguyện 3 (tài liệu 03 viết lời).

### 4.7 Phụ lục nút: Đắc Cứu — «vị thuốc» (chỉ lá số 有救)

Khi `patternQuality.quality === '有救'`, cách cục có `rescues[]` với `drug` thuộc 5 nhóm (`pattern-quality.js`): `yin` (Ấn), `ti` (Tỷ Kiếp), `shi` (Thực Thương), `cai` (Tài), `guan` (Quan Sát). Hồi I nhánh Đắc Cứu (tài liệu 03, `BR-DC`) biến mỗi vị thuốc thành một thánh địa phải tới. Mệnh Đồ hiện chúng thành **nút phụ** gắn bên nút Tích Âm Đức:

| `drug` | Vị thuốc (game gọi) | Thánh địa gợi ý | Nhiệm vụ Mệnh Đồ | Lý do |
|---|---|---|---|---|
| `yin` | Ấn — «mực và sách» | Văn Miếu, Chung Nam | CQ-MD-90 «Hái vị Ấn»: học 5 quyển | Ấn = học, che chở |
| `ti` | Tỷ — «bạn đồng hành» | Võ Đang, Huyền Thành | CQ-MD-91 «Hái vị Tỷ»: kết nghĩa / tổ đội lâu | Tỷ Kiếp = đồng đạo |
| `shi` | Thực — «tay nghề» | Long Hổ (kết phù), Miêu Cương (vu y) | CQ-MD-92 «Hái vị Thực»: một nghề thông thạo | Thực Thương = nghệ |
| `cai` | Tài — «của để cho» | chợ Huyền Thành, Bút Tháp | CQ-MD-93 «Hái vị Tài»: bố thí định kỳ 7 ngày | Tài; 舍財得財 |
| `guan` | Quan — «kỷ luật» | Chung Nam (giới), Văn Miếu | CQ-MD-94 «Hái vị Quan»: giữ một giới 30 ngày | Quan = khuôn phép |

MAU-A có `rescues = [shi, cai]` → sinh CQ-MD-92 và CQ-MD-93. Người dẫn: Đan Đỉnh chân nhân (`dan_dinh`) — «Bệnh ở đâu thì thuốc ở đó. Thầy chỉ chỗ, con tự đi hái.» Mỗi vị: B 40.

---

## 5. Tính lại Mệnh Đồ

### 5.1 Khi nào tính lại

| Sự kiện | Tính lại phần nào | Ghi chú |
|---|---|---|
| Người chơi **sửa ngày giờ sinh** Bản Mệnh | toàn bộ (`diagnosis`, mọi `acts`, đèn) | luật 5.3 |
| **Lập Xuân** (năm can chi mới, máy chủ) | `space` (Huyền Không năm), `timing` (rating năm), `taisui` (phạm năm), D3 | «Mệnh Đồ năm mới» |
| Đại vận đổi (sinh nhật bước qua mốc đại vận) | không đổi `gaimenhPlan` (engine không đọc đại vận); chỉ cập nhật CQ-MD-30 lời Thầy | |
| Bản engine mới (sửa lỗi) | toàn bộ, ở lần đăng nhập kế | luật 5.3 áp như sửa ngày sinh nhưng **không** tính vào hạn đổi |
| Người chơi chọn Bản Mệnh khác trong Sổ Mệnh | **không cho phép** đổi Bản Mệnh sau lễ lật trụ (chỉ được sửa dữ liệu, luật 5.4) | hồ sơ khác chỉ để xem |

### 5.2 Mệnh Đồ năm mới

- Lưu bản cũ thành «Mệnh Đồ năm {can chi}» (đọc được, không làm tiếp).
- Nút `space`, `timing`, `taisui`: trạng thái về «làm mới năm»; nhiệm vụ năm (CQ-MD-19, -33x, -35, -40…-52) sinh lại; nhiệm vụ đời (CQ-MD-10…-18, -53…-58) **giữ nguyên trạng thái xong**.
- Nút `name`, `mangpai`, `virtue`: không đổi.
- Thưởng hoàn thành nút làm mới: B 20 (không phải 50).

### 5.3 Luật «không thu hồi»

Khi tính lại vì sửa dữ liệu:

| Tình huống | Xử lý |
|---|---|
| Nhiệm vụ đã xong nhưng không còn trong kế hoạch mới (vd tổ hợp hung cũ biến mất) | giữ dấu «đã xong theo lá số cũ»; **không thu hồi** Đạo Hạnh, Phúc Khí, vật phẩm |
| Nhiệm vụ đang làm dở không còn trong kế hoạch mới | đóng, hoàn tiến độ thành **B 50%** của bước đã làm |
| Kế hoạch mới có nhiệm vụ trùng mã đã xong | coi như xong |
| Kế hoạch mới có nhiệm vụ mới | sinh bình thường |
| Đại Nguyện đã đạt | giữ |

### 5.4 Chống «đổi ngày sinh để lấy lợi»

Lợi ích có thể bị lạm dụng: hệ số Nghịch Thiên `k` cao hơn khi Tiềm Lực thấp hơn. Ngày sinh chỉ lưu trên máy người chơi (bản sơ đồ §14), game không kiểm được thật giả. Luật:

| Luật | Nội dung |
|---|---|
| DS-1 | Sửa **miễn phí trong 72 giờ** đầu sau lễ lật trụ (người chơi nhập nhầm giờ là chuyện thường). |
| DS-2 | Sau 72 giờ: tối đa **3 lần đời**, cách nhau ≥ **30 ngày**, phải qua «Lễ chỉnh giờ» ở Bàn Thầy (Thầy Tử Bình hỏi lại «con chắc giờ sinh chưa? giấy khai sinh ghi gì?»). |
| DS-3 | `k` mới chỉ áp **từ thời điểm sửa** (không tính lại Đạo Hạnh đã có). |
| DS-4 | Máy chủ giữ **lịch sử Tiềm Lực** (chỉ con số, không ngày sinh). Nếu `k` mới > `k` cũ, Thiên Bảng hiện dấu nhỏ «đã chỉnh lá số» trong 30 ngày (người khác chỉ thấy dấu, không thấy số). |
| DS-5 | Cảnh giới không hạ (05-01 §4.3). |

---

## 6. MMO — người khác thấy gì

| Thông tin | Người lạ | Bạn bè / đồng môn | Sư phụ (khi đệ tử cho phép) | Ghi chú |
|---|---|---|---|---|
| Số nút đã xong (vd «Mệnh Đồ 4/6») | có (biểu tượng cuộn trên thẻ người chơi) | có | có | không lộ lá số |
| Tên nút đang làm | không | có, nếu người chơi bật «chia sẻ tu trình» | có | |
| Chẩn đoán (`diagnosis[].d`), tổ hợp hung, phạm Thái Tuế | **không** | không | có, chỉ khi đệ tử bật «cho sư phụ xem Mệnh Đồ» | nhạy cảm như lá số |
| Đèn Thái Tuế đang thắp | có (ngọn đèn trên đầu trong Thái Tuế Điện, không ghi tuổi) | có | có | |
| Đạo hiệu (CQ-MD-22) | có | có | có | |
| Nhà riêng và điểm an trạch | nhà: có (đi vào được nếu chủ mở cửa); điểm: không | điểm: có nếu chủ cho | có | |

**Nhiệm vụ đôi:** các bước ghi «tổ đội» (CQ-MD-56, -61) tính cho **cả hai** người chơi nếu cả hai đều có bước đó; nếu chỉ một người có, người kia được +1 công «Giúp người khó khăn» (05-04).

**Sư đồ:** đệ tử hoàn thành **cả 6 nút** lần đầu → sư phụ +10 công hữu hiệu (không vượt nhật hạn công của sư phụ; dồn sang ngày sau) và thư cảm tạ. Đây là cơ chế canon §10 («Đệ tử hoàn thành Mệnh Đồ thì sư phụ nhận công đức»).

---

## 7. Giao diện Mệnh Đồ

### 7.1 Bố cục

- Cuộn tranh dọc (thủy mặc), 6 nút xếp **từ trên xuống** theo `pri` 1 → 6, đúng thứ tự app. Nút Tích Âm Đức **to nhất, ở đáy**, như nền móng của cả cuộn. Đường mực nối các nút.
- Mỗi nút: biểu tượng (nhà, bút, lịch, đèn, cân, sen), số đèn, trạng thái.
- Góc trên: `verdict` của engine (rút gọn 2 dòng, chạm để đọc đủ).
- Góc dưới: «Bệnh ưu tiên: {diagnosis[0].t}».
- Nút phụ Đắc Cứu (nếu có) mọc như cành bên nút Tích Âm Đức.

### 7.2 Trạng thái màu

| Trạng thái | Màu nền nút | Biểu hiện |
|---|---|---|
| khóa | giấy xám | mờ, có ổ khóa nhỏ + điều kiện mở |
| mở | giấy trắng | viền mực |
| đang làm | giấy vàng nhạt | mực đậm, tiến độ dạng nét bút |
| xong | son đỏ đóng dấu | con dấu «成» |
| làm mới năm | dấu son cũ mờ + viền mới | nhãn năm can chi |

### 7.3 Bản đọc cho hồ sơ khách

- Cùng bố cục, không có nhiệm vụ, không có đèn, đầu trang ghi «Mệnh Đồ của {tên hồ sơ} — để tham khảo». Dùng khi người chơi muốn xem cho người nhà (đúng thói quen app). Bản iOS: không có.

---

## 8. Ví dụ Mệnh Đồ đầy đủ — MAU-A, năm 2026

| Nút | Đèn | «Vì sao» (nguyên văn engine) | Nhiệm vụ sinh ra |
|---|---|---|---|
| Thái Tuế | 4 | «Thương Quan Kiến Quan, Quan Sát Hỗn Tạp làm trọc cục.» | CQ-MD-40, -41 (Trị), -43 (Hình), -47…-52 (bỏ ③), -53 (Thương Quan Kiến Quan), -55 (Quan Sát Hỗn Tạp) |
| Không Gian | 3 | «Tổng luận 41/100 — Dụng Thủy thiếu lực.» | CQ-MD-10…-17 (lô đất có sát `luchong` theo lô), -18 tùy chọn |
| Danh | 3 | như trên | CQ-MD-20, -21 (kệ Thủy), -22, -23 |
| Thời | 3 | «(nhắc của Mệnh Đồ: năm 2026 Đại hung)» | CQ-MD-30, -31 (năm Cát kế tiếp do `timing` trả), -32, **-33c Năm giữ**, -34 |
| Làm Công | 2 | «Tài quan phân tán/ít hợp — phú quý chậm.» | `level` Cách trung → 4 bước: -60, -61, -62 (Phú Quý cân bằng: chọn), -63 |
| Tích Âm Đức | 2 | (luôn mở) | CQ-MD-70…-76; phụ Đắc Cứu: -92 (shi), -93 (cai) |

Thứ tự gợi ý: Thái Tuế → Không Gian → Danh → Thời → Làm Công; hằng ngày 1 việc thiện.
Lời Vân Cốc khi trải cuộn: «Năm nay tuổi con đứng ngay trước mặt Thái Tuế, lại thêm hai cái gai trong cách: Thương Quan gặp Quan, Quan lẫn với Sát. Gai không nhổ được, nhưng đi giày thì không đau. Đi thắp đèn trước.»

### 8.1 Ví dụ ngắn — MAU-C3 (1975-08-08 14:00 nam, Tiềm Lực 56)

| Nút | Đèn | Nhiệm vụ |
|---|---|---|
| Thái Tuế | 3,5 → 4 (D2 cao + phạm nhẹ) | -40, -44 (năm sinh Ất Mão 1975; Mão–Ngọ là **Phá** Thái Tuế 2026), -54 (Kiêu Đoạt Thực) |
| Làm Công | 2 (D4) | Cách trung · PHÚ → -60, -61, -62P, -63 |
| Không Gian, Danh, Thời | 1 | bình thường; Thời năm 2026 «Bình» → -33b |
| Tích Âm Đức | 1 | -70…-76; Đắc Cứu: phụ theo `rescues` |

*(Kiểm: `personalTaSui('卯','午')` trả `po` — mức nhẹ; khớp bảng 4.4.1.)*

---

## 9. Ca biên

| Ca | Xử lý |
|---|---|
| `synthesis.score` null | D1 không sinh (đúng engine); nút `name` 1 đèn |
| `xiongFang` < 3 phần tử | câu 2 của `space` ngắn hơn; CQ-MD-13 chỉ đòi các cung có |
| `wangFang` rỗng | CQ-MD-12 đổi thành «giữ trung cung sạch thoáng» (lời giải thích của chủ sảnh) |
| `mangpai.notes` có < 2 phần tử | engine in «(không có ghi chú)»; CQ-MD-60 dùng `level` + `fuguui` |
| `personalTaSui` lỗi (thiếu chi năm sinh) | ẩn chuỗi kiểu phạm, giữ CQ-MD-40 |
| Lá số Dị Cách (`特殊`) | Mệnh Đồ sinh như thường (engine không phân biệt); Phương Sĩ Vô Danh thêm lời: «cách lạ thì thuận thế» — chỉ đổi lời, không đổi nhiệm vụ |
| Người chơi đã làm xong mọi nhiệm vụ đời, năm mới chưa tới | nút hiện «đã viên mãn — chờ năm mới»; nút Tích Âm Đức vẫn có việc hằng ngày |
| `gaimenhPlan` ném lỗi (bất thường engine) | hiện Mệnh Đồ «tối thiểu»: chỉ nút Tích Âm Đức + thông báo «Thầy đang xem lại cuộn» (không lộ lỗi) |
| Bản iOS | chỉ 3 nút (MO-3); không hiện `diagnosis`, `verdict` (vì là luận đoán lá số) |

---

## 10. Checklist nghiệm thu 05-02

- [ ] Với 5 lá số ở bảng 1.4, Mệnh Đồ sinh đúng chẩn đoán và đúng nhiệm vụ như bảng mục 8 (test tự động so chuỗi `diagnosis[].t` và danh sách mã `CQ-MD`).
- [ ] Văn «Vì sao cần» là **nguyên văn** `diagnosis[].d`; không câu nào do game tự viết lại thành chẩn đoán mới.
- [ ] Phần «nhắc của Mệnh Đồ» (năm hung, phạm Thái Tuế, bại cách) ghi rõ không phải chẩn đoán engine.
- [ ] Pháp ③ huyết quang không xuất hiện ở bất kỳ nhiệm vụ nào.
- [ ] Không nhiệm vụ nào yêu cầu đổi tên thật.
- [ ] Sửa ngày sinh theo DS-1…DS-5; không thu hồi thưởng đã nhận.
- [ ] Lập Xuân sinh Mệnh Đồ năm mới; nhiệm vụ đời giữ trạng thái.
- [ ] MMO không bao giờ gửi `diagnosis` lên máy chủ trừ khi đệ tử bật chia sẻ cho sư phụ (và khi đó chỉ gửi tới sư phụ, mã hóa đầu cuối do tài liệu 13 quyết).
- [ ] Ba nút iOS hiển thị đúng; không có Thái Tuế, Huyền Không, lưu niên.
