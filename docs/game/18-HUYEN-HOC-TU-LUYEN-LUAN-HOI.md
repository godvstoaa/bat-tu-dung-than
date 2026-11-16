# 18 · Huyền học, tu luyện, luân hồi

> **Trạng thái:** `[ĐÃ CÓ]`
> **Bộ phận chủ trì:** Thiết kế game · Nội dung (lời Âm phủ, lời thầy)
> **Nguồn sự thật trong mã:** `src/game/huyenhoc.js`, `src/game/amduc.js`, `src/game/realm.js`, `src/game/luanhoi.js`, `src/game/progress.js`; số liệu ở [A3](phu-luc/A3-so-lieu.md) mục 18
> **Test:** `scripts/test-game-huyenhoc.mjs`, `scripts/test-game-amduc.mjs`, `scripts/test-game-progress.mjs`
> **Thay thế:** `GAME-SINH-TON-KINH-TE-DAC-TA` §24, §27–§30; `docs/gdd/04`, `05`, `09` (bản tầm nhìn về chỉ số, cải mệnh, tu luyện — lớp L4)
> **Kiểm với mã ngày:** 2026-11-16

## 18.0 Mục đích, phạm vi, tóm tắt

Chương này là đường dài của game: vì sao sống tử tế có lợi, lên cảnh giới bằng cách nào, và chết rồi thì sao. Nó thi hành trụ cột TC-2: lá số cho xu hướng, việc làm của người chơi quyết định kết cục. Không gồm: kiếm Phúc Khí từ giải án (§12), cấp và gia trì (§11).

| Phần | Một dòng | Mục |
|---|---|---|
| Ba chỉ số | Phúc Khí tiêu được; Âm Đức và Nghiệp Lực chỉ thấy theo mức | §18.1 |
| Vận khí | quẻ đầu ngày, ngày điều độ, bốn cấp trợ lực, một lần thoát chết | §18.2 |
| Vận số ngày | mỗi ngày tối đa một sự kiện lành, một sự kiện dữ; giải hạn bằng Phúc Khí | §18.3 |
| Tu luyện | bảy cảnh giới phải đột phá; mười một pháp môn ba tầng | §18.4 |
| Luân hồi | chết vì đói hoặc bệnh → cân nghiệp → sáu cõi → kiếp mới | §18.5 |

Ba luật nền chi phối chương này: **LN-04** (điểm Huyền học không phải tiền), **LN-09** (không chết bất ngờ, cõi dưới tối đa 25 phút, không trả tiền để rút ngắn), **LN-01** (lá số kiếp sau là hư cấu, ngày sinh thật không đổi và không rời máy).

## 18.1 Ba chỉ số Huyền học

> **Trạng thái:** `[ĐÃ CÓ]` (P19). Bảng tăng giảm là số khởi điểm của thiết kế; số đang chạy ở [A3](phu-luc/A3-so-lieu.md) › `huyenhoc.js`.

Không chỉ số nào là tiền. Không mua bán, không chuyển cho người khác, không đổi ra vàng bạc hay Ngọc.

| Chỉ số | Bản chất | Thấy được? | Tiêu được? | Có từ đâu | Dùng vào |
|---|---|---|---|---|---|
| **Phúc Khí** 福氣 | phúc phần hiển lộ, năng lượng tu hành | có (số) | **có** — «hưởng phúc thì hao phúc» | xem quẻ, giải án, học kinh, lễ bái (thắp hương, lịch, la bàn, đèn — `state.grantDaily` có sẵn), bố thí, giúp NPC | học / nâng pháp môn (§18.4), **giải hạn** tránh họa (§18.3), đột phá cảnh giới |
| **Âm Đức** 陰德 | phúc đức tích ngầm, việc thiện không phô trương | chỉ thấy **mức** (5 mức mờ), không thấy số | không tiêu — chỉ bị **dùng** khi cứu mạng (§18.2) và **đem cân** ở Âm phủ (§18.5) | ngày sinh hoạt điều độ (§18.2), làm việc trung thực (ca trọn, không gian lận), chữa bệnh / cứu người, trả nợ đúng hạn, phóng sinh, cúng cô hồn (§18.5.3), bố thí ẩn danh | giảm tai họa, tăng phúc duyên, **đầu thai cõi lành**, điều kiện đột phá |
| **Nghiệp Lực** 業力 | món nợ nhân quả | chỉ thấy **mức** (5 mức), thầy bói NPC «nhìn ra» | không — phải **trả** | tội theo Huyền Thành Luật (phá công trình, trộm, bỏ ca), gian lận dịch vụ quẻ, bán đồ ôi cố ý, quỵt nợ, bỏ mặc bệnh lây, sát sinh quá hạn ngạch săn | tăng tai họa, **tâm ma** cản đột phá, đầu thai cõi dữ |

**Bảng tăng / giảm** (số khởi điểm, chỉnh khi cân bằng):

| Việc | Phúc Khí | Âm Đức | Nghiệp Lực |
|---|---|---|---|
| Thưởng hằng ngày ở các gian (có sẵn) | +2…+10 | — | — |
| Giải án đúng (có sẵn) | +15…+25 | +1 nếu giải giúp người khác | — |
| Ngày sinh hoạt điều độ (§18.2) | — | +1 | — |
| Ca làm trọn, không cờ gian lận | — | +0,2 | — |
| Bố thí ở đền / chùa (đồng / bạc) | +1 / 20 đồng, trần 20 / ngày | +0,5 / ngày nếu bố thí ẩn danh | — |
| Phóng sinh cá (mua ở chợ cá rồi thả sông) | +2 | +1 | −1 |
| Chữa bệnh cho người chơi khác (thầy thuốc, P3) | +3 | +2 | — |
| Cúng cô hồn cho người chơi đang ở cõi Ngạ Quỷ (§18.5.3) | +2 | +3 | — |
| Phá công trình bị kết án | — | — | +5…+20 theo án (`law.js` điểm tội) |
| Gian lận dịch vụ quẻ bị xác nhận (§12.6.4) | −20 | −5 | +15 |
| Bán đồ hết tươi cho khách NPC (§17.5.1) | — | −1 | +3 / lần |
| Quỵt nợ quá hạn (§13.3.6) | — | — | +1 / ngày |
| Bỏ mặc bệnh lây (P3) | — | −1 / ngày | +2 / ngày |
| Sám hối ở điện (lễ 10 phút, tốn Phúc Khí) | −30 | — | −10 |
| Công quả ở chùa (quét sân, gánh nước — việc làm không lương) | — | +0,5 / ca | −3 / ca |
| Khổ sai thụ án (có sẵn) | — | — | −1 / quặng |

**Mức hiển thị:**
- Âm Đức: Bạc Phúc · Bình Thường · Có Phúc · Phúc Dày · Đại Phúc Đức.
- Nghiệp Lực: Trong Sạch · Vướng Bận · Nặng Nợ · Nghiệp Chướng · Tội Nghiệt.

Thầy bói NPC và Bia Vận Mệnh có sẵn (`vanmenh`) nói mức của người chơi bằng lời («khí sắc u ám, e có nợ cũ chưa trả»).

## 18.2 Điểm danh vận khí — Âm Đức (bản gốc: «Phúc Khí tích lũy»)

> **Trạng thái:** `[ĐÃ CÓ]` (P17). Bảng «Đang có / Đề xuất» ở mục 18.2.1 là lịch sử: QĐ-13 đã chốt bỏ **mọi** Ngọc miễn phí, kể cả Ngọc VIP hằng ngày và quà lên cấp.

> Sau quyết định 12, Âm Đức là **một trong ba chỉ số Huyền học** (Phần IV §18.1). Mục này giữ phần điểm danh và cấp vận khí; bảng tăng / giảm đầy đủ ở §18.1, thoát chết gắn với luân hồi ở §18.5.1. Quyết định 13: bỏ **mọi** Ngọc miễn phí.

### 18.2.1 Thay điểm danh tặng Ngọc

| Đang có | Đề xuất (quyết định 13) |
|---|---|
| Điểm danh 7 ngày tặng Ngọc (`cosmetics.js › checkin`) | **Bỏ.** Thay bằng **Gieo quẻ vận khí đầu ngày** + Âm Đức |
| VIP nhận Ngọc mỗi ngày (`vipDaily`) | giữ (quyền lợi đã trả tiền), hoặc bỏ theo đúng bản gốc |
| Quà Ngọc khi lên cấp (`levelGifts`) | giữ (không phải điểm danh), hoặc bỏ |

**Lưu ý:**
- Ngọc vốn đã không đổi được ra tiền (§13.1), nên kinh tế tiền không bị hở.
- Bỏ điểm danh Ngọc chủ yếu để đúng tinh thần «không giàu nhờ đăng nhập».
- Người đã có chuỗi điểm danh nhận nốt quà ngày đang dở rồi chuyển hệ.

### 18.2.2 Luồng mỗi ngày

```
[Lần đầu vào game trong ngày] → Gieo quẻ vận khí (quẻ + cát hung 24 giờ: engine dailyGuidance + lịch ngày có sẵn)
   → ngày đó được tính là «ngày sinh hoạt điều độ» nếu trong ngày: chơi ≥ 20 phút, ăn ≥ 2 bữa, ngủ ở chỗ ngủ (P1)
   → Âm Đức +1 · chuỗi ngày điều độ +1 · cấp vận khí theo chuỗi
```

- Chỉ đăng nhập thì không đủ: điều kiện gắn với nhịp sống trong game (chống treo máy).
- Âm Đức **không phải tiền**: không mua bán, không đổi ra tiền / Ngọc / Phúc Khí, không chuyển cho người khác.

### 18.2.3 Cấp vận khí

| Chuỗi ngày điều độ | Cấp | Tên | Hiệu ứng (gắn vào hệ có sẵn) |
|---|---|---|---|
| 1–3 | 1 | Thân Tâm An Lạc | No tụt chậm hơn 5% (`life.RATE.full`); hao Tỉnh khi làm việc −5% (`jobs WORK.wake`) |
| 4–7 | 2 | Quý Nhân Mỉm Cười | + rủi ro lao động **giảm 50%** (máy chủ: `guild-core riskP`); thầy thuốc / chủ tiệm thuốc hòa nhã, bớt 5% (P3) |
| 8–14 | 3 | Thời Vận Hanh Thông | + khách sộp / đơn hàng giá hời +10% (P9–P11); cá quý tăng nhẹ (khi có câu cá) |
| 15+ | 4 | Phúc Trạch Vô Cương | + **một lần thoát chết**: tai nạn chí mạng (đuối nước §16.3, ngã từ cao khi có sát thương rơi, tai nạn lao động nặng) thì tỉnh lại với Khí huyết 1, không mất tiền thuốc. Dùng xong thì **Âm Đức về 0**, chuỗi về 1 |

- Hiệu ứng cộng dồn theo cấp (cấp 3 có cả hiệu ứng cấp 1 và 2).
- **Máy chủ quyết** những hiệu ứng chạm tới tiền và rủi ro (giảm rủi ro việc làm, đơn hàng). Client chỉ hiển thị.

### 18.2.4 Tổn hao, đứt đoạn

| Hành vi | Âm Đức | Ghi chú |
|---|---|---|
| Gian lận dịch vụ xem quẻ bị xác nhận (§12.6.4) | −10 | cùng lúc với phạt uy tín thầy |
| Cố ý bán đồ ăn hết tươi cho khách NPC (độ tươi < 0,2 — §17.5.1) | −5 / lần | máy chủ phát hiện khi tính khách NPC |
| Bỏ mặc bệnh lây (P3, không chữa quá 24 giờ khi đang lây) | −3 / ngày | |
| Phá công trình bị kết án (Huyền Thành Luật, có sẵn) | −5 / án | |
| Bỏ ca, gian lận việc làm bị gắn cờ (§14.2.4) | −2 | |

- **Quên một ngày:** không mất điểm, nhưng **tạm ngừng hiệu ứng**. Có lại 2 ngày điều độ liên tiếp thì hiệu ứng trở lại ở cấp cũ trừ 1.
- **Âm Đức âm:** không có hiệu ứng xấu (giữ nhẹ nhàng), chỉ không có trợ lực tới khi về lại ≥ 0. Thầy bói NPC nhắc khéo.

## 18.3 Phúc duyên và tai họa hằng ngày

> **Trạng thái:** `[ĐÃ CÓ]` (P19).

Mỗi ngày (giờ Tý, máy chủ tính) mỗi người có một **vận số ngày**:
```
vận = 50 + 0,02·Phúc Khí (trần +15) + mức Âm Đức × 6 − mức Nghiệp Lực × 8
      + hợp / xung ngày với lá số (law.clash có sẵn, ±8) − phạm Thái Tuế năm (thaitue có sẵn, −6) + cấp vận khí §18.2 × 2
```

**Sự kiện ngẫu nhiên** (mỗi ngày tối đa 1 lành + 1 dữ) rút theo `vận`:

| Lành (vận cao) | Dữ (vận thấp / Nghiệp nặng) |
|---|---|
| Quý nhân: NPC tặng tiền công hậu (+10–30%) | Bệnh vặt (P3), thêm khi Nghiệp nặng |
| Nhặt được của rơi (vài đồng → 1 lượng bạc, hiếm) | Bị móc túi ở chợ (−5–10% tiền mang theo) |
| Khách sộp ở tiệm / quán (P11) | Tai nạn lao động (cộng vào rủi ro §14.1.3) |
| Câu được cá quý / hái được linh dược (P9) | Hàng hỏng nhanh hơn trong ngày (độ tươi ×1,2) |

- **Giải hạn** (tiêu Phúc Khí): ở điện thờ, cúng giải hạn 30 Phúc Khí chặn sự kiện dữ của ngày kế; 80 Phúc Khí cho cả tuần.
  - Đúng nguyên lý «phúc che họa». Không mua bằng tiền hay Ngọc được.
- Quẻ đầu ngày (§18.2) báo trước khuynh hướng vận số ngày bằng lời quẻ (engine `dailyGuidance` có sẵn).

## 18.4 Pháp môn và tu luyện cảnh giới

> **Trạng thái:** `[ĐÃ CÓ]` (P20). Người chơi cũ giữ cảnh giới ứng với cấp đang có.

### 18.4.1 Cảnh giới (thay «cấp» hiện tại)

Cấp hiện tính từ Phúc Khí tích lũy cả đời (`progress.js`, `xp`). Giữ nguyên công thức, đặt tên cảnh giới, thêm **đột phá** ở mỗi ranh giới lớn:

| Cảnh giới | Cấp | Mở (gia trì có sẵn + mới) | Đột phá vào cảnh giới cần |
|---|---|---|---|
| **Phàm Nhân** | 1–4 | hào quang hộ thể (2), linh khí quanh thân (4) | — |
| **Luyện Khí** | 5–9 | vệt sáng bộ pháp (6), **ngự kiếm (8)** | Âm Đức ≥ Bình Thường |
| **Trúc Cơ** | 10–14 | pháp quang (10), Thủy Thượng Phiêu cho người Dụng thần Thủy (§16.3) | Âm Đức ≥ Có Phúc, Nghiệp ≤ Vướng Bận, **thử thách tĩnh tọa** ở Sơn Môn |
| **Kim Đan** | 15–19 | Lăng Ba Vi Bộ (§16.3), giải hạn tuần rẻ 30% | Âm Đức ≥ Có Phúc, Nghiệp ≤ Vướng Bận, tĩnh tọa + **luận một lá số** cho NPC (dùng engine) |
| **Nguyên Anh** | 20–29 | bay nhanh +10% (cộng tốc vật cưỡi §16.4), xuất hồn xem lá số người khác (với sự đồng ý) | Âm Đức ≥ Phúc Dày, Nghiệp ≤ Vướng Bận |
| **Hóa Thần** | 30–39 | đầu thai được chọn lá số (§18.5), giảm tai họa | Âm Đức ≥ Phúc Dày, Nghiệp = Trong Sạch |
| **Đắc Đạo** | 40+ | danh hiệu Chân Nhân vĩnh viễn, tên khắc Bia Đắc Đạo ở Thiên Bàn Đảo, thoát luân hồi tùy chọn (§18.5.4) | Âm Đức = Đại Phúc Đức, Nghiệp = Trong Sạch, vượt **Thiên Kiếp** (sự kiện sấm sét ở Thiên Bàn Đảo, thử thách ngắn) |

- **Đủ cấp nhưng chưa đột phá:** dừng ở đỉnh cảnh giới cũ. Phúc Khí vẫn tích nhưng không mở thêm. Nghiệp nặng thì **tâm ma**: đột phá thất bại, mất 10% Phúc Khí đang có.
- VIP vẫn mở sớm hào quang / linh khí / vệt / ngự kiếm như hiện nay. VIP không bỏ qua được đột phá.

### 18.4.2 Pháp môn (kỹ năng — học bằng Phúc Khí)

**Học** = tiêu Phúc Khí + đủ cảnh giới + (tùy pháp môn) hợp mệnh. Mỗi pháp môn 3 tầng; tầng sau đắt gấp đôi.

| Nhánh | Pháp môn | Tác dụng tầng 1 → 3 | Hợp mệnh |
|---|---|---|---|
| **Thân pháp** | Khinh Công | hao thể lực chạy −10% → −30% | — |
| | Thủy Thượng Phiêu / Lăng Ba Vi Bộ | đạp nước (§16.3), tốn thể lực giảm dần | Dụng thần Thủy rẻ 50% |
| | Ngự Phong | bay +5% → +15% (cộng vật cưỡi, trần chung +35%) | Dụng thần Mộc / Kim |
| **Dưỡng sinh** | Tích Cốc | No tụt chậm 5% → 15% | Dụng thần Thổ |
| | Kim Cương Thân | kháng bệnh 10% → 30% (P3) | — |
| | An Thần | ngủ hồi Tỉnh +10% → +30% | Dụng thần Thủy |
| **Mệnh thuật** | Thiên Nhãn | xem quẻ / lá số sâu hơn ở các gian (mở mục luận chuyên sâu có sẵn trong engine) | — |
| | Vọng Khí | thấy mức Âm Đức / Nghiệp của NPC, thấy sự kiện dữ sắp tới | Dụng thần Hỏa |
| **Nghề** | Bách Nghệ | tay nghề nghề hợp Dụng / Hỷ +10% → +30% | — |
| | Thương Đạo | phí ký gửi chợ −1% → −3% (§17.1.4) | Dụng thần Kim |
| **Phong thủy** | Trạch Pháp | điểm phong thủy nhà (`homefs`) +5 → +15 | — |

- **Không pháp môn nào sinh ra tiền trực tiếp.** Tác dụng lên kinh tế đều nhỏ, có trần, và máy chủ tính (Guild / Market).
- **Tốc độ bay** (quyết định 14):

  | Bậc hiếm vật cưỡi | Thưởng tốc độ |
  |---|---|
  | 1 | 0 |
  | 2 | +5% |
  | 3 | +10% |
  | 4 | +15% |
  | 5 | +20% |

  - Cộng thêm Ngự Phong / Nguyên Anh, tổng trần +35%.
  - Bay không dùng được khi đang áp hàng (§14.2.4). Máy chủ vẫn kiểm tốc độ cho mọi việc làm.

## 18.5 Tử vong, Âm phủ, lục đạo luân hồi

> **Trạng thái:** `[ĐÃ CÓ]` (P21).

### 18.5.1 Khi nào chết, khi nào chỉ ngất

| Nguyên nhân Khí huyết về 0 | Kết quả |
|---|---|
| **Đói** (No = 0 kéo dài làm Khí huyết cạn) | **Chết** → luân hồi |
| **Bệnh** tới giai đoạn cuối không chữa (P3) | **Chết** → luân hồi |
| Kiệt sức, thức trắng, đuối nước (§16.3, quyết định 16), tai nạn, ngã | **Ngất** như hệ có sẵn (thầy thuốc cứu, mất tiền thuốc) |
| Bất kỳ, khi Âm Đức cấp 4 còn lượt (§18.2) | tỉnh lại Khí huyết 1, không mất gì; dùng lượt |

Trước khi chết luôn có **cảnh báo rõ**: Khí huyết dưới 15 do đói / bệnh thì màn hình xám dần, NPC nhắc, có nút «Tìm thầy thuốc» / «Tới quầy cơm gần nhất». Không chết bất ngờ.

### 18.5.2 Âm phủ cân nghiệp

```
[Chết] → Cầu Nại Hà (cảnh 30 giây) → Thập Điện Diêm Vương: CÂN NGHIỆP
   điểm cân = Âm Đức × 3 + Phúc Khí tích lũy kiếp này / 200 − Nghiệp Lực × 4
   → chọn cõi (bảng dưới) → Canh Mạnh Bà (uống: quên 70% tay nghề; từ chối: giữ ký ức, cõi tụt một bậc)
   → [đầu thai] lá số mới · thân phận mới · giữ phần tiền kiếp
```

| Cõi (lục đạo) | Điểm cân | Trải nghiệm | Ra đời với |
|---|---|---|---|
| **Thiên đạo** | ≥ 120 | đầu thai ngay | chọn 1 trong **3 lá số** đẹp; gia thế khá: 5 lượng bạc khởi nghiệp; giữ cảnh giới |
| **A-tu-la đạo** | 80–119 | đầu thai ngay | dòng võ: thể lực +15%, nhưng Nghiệp sinh ra ×1,2 kiếp này; chọn 1 trong 2 lá số |
| **Nhân đạo** | 20–79 | đầu thai ngay | lá số được rút; khởi đầu chuẩn (300 đồng như người mới) |
| **Súc sinh đạo** | −20…19 | **kiếp linh thú ngắn** (§18.5.3): 20 phút chơi | rồi đầu thai Nhân đạo, Nghiệp −20 |
| **Ngạ quỷ đạo** | −60…−21 | **kiếp quỷ đói ngắn** (§18.5.3): chờ người sống cúng cô hồn, tối đa 25 phút | rồi đầu thai Nhân đạo, Nghiệp −40 |
| **Địa ngục đạo** | < −60 | **trả nghiệp** ở Thập Điện (khổ sai như Khoáng Sơn có sẵn): 20 phút | rồi đầu thai Nhân đạo, Nghiệp về Vướng Bận |

**Dễ trùng sinh** (yêu cầu của người dùng):
- Ba cõi trên đầu thai ngay.
- Ba cõi dưới là **một đoạn chơi ngắn** (tối đa 25 phút, không bao giờ khóa tài khoản), có thể thoát sớm bằng việc tốt trong đoạn đó.
- Không trả tiền / Ngọc để rút ngắn.

### 18.5.3 Ba đoạn chơi cõi dưới (dùng lại thế giới có sẵn)

- **Kiếp linh thú (Súc sinh):**
  - Hóa mèo / hạc / cá chép linh trong Huyền Thành, người khác nhìn thấy.
  - Nhiệm vụ nhỏ: dẫn đường cho người lạc, bắt chuột ở kho Khôn cung, bơi theo thuyền hoa…
  - Mỗi việc rút ngắn thời gian.
- **Kiếp quỷ đói (Ngạ quỷ):**
  - Hiện hình mờ trong thành lúc đêm (khung cảnh đổi màu), chỉ đi được ở nơi tối.
  - Người sống **cúng cô hồn** ở các bàn cúng đầu ngõ (bàn có sẵn ở `cityident3d` hoặc thêm) thì quỷ được siêu thoát sớm.
  - Người cúng được Âm Đức (§18.1). Đây là cơ chế xã hội: người chơi giúp nhau.
- **Thập Điện (Địa ngục):**
  - Khu Âm phủ ở dải nội thất phía Đông (cạnh Thiên Lao / Khoáng Sơn). Đào «nghiệp thạch» như khổ sai.
  - Mỗi viên trừ Nghiệp, đủ thì qua cầu đầu thai.

### 18.5.4 Kiếp trước – kiếp sau

| Thứ | Sang kiếp sau |
|---|---|
| **Lá số nhân vật** | **Lá số mới** (ngày giờ sinh hư cấu do Âm phủ cấp — **không phải ngày sinh thật** của người chơi; ngày sinh thật vẫn ở trên máy cho các gian xem quẻ). Dụng thần mới → nghề hợp mệnh mới. Máy chủ ghi đổi Dụng thần lý do «đầu thai» (ngoài khóa 30 ngày §31.2.3) |
| **Tên** | giữ hoặc đặt mới |
| **Nhà, đồ trong nhà, tiền trong Tiền Trang** | để lại làm **di sản**: kiếp sau nhận lại sau tang lễ (trừ 20% tang phí — hố hút tiền). Vợ / chồng (§20.2) được quyền ở nhà chung trong lúc chờ |
| **Tiền mang theo người** | mất 50% (rơi ở chỗ chết; người khác **không** nhặt được — tránh lợi dụng) |
| **Tay nghề** | còn 30% (uống canh Mạnh Bà) hoặc 100% (từ chối canh, cõi tụt một bậc) |
| **Phúc Khí đang có** | còn 50% |
| **Phúc Khí tích lũy / cảnh giới** | **giữ** («đạo căn» không mất — tu hành nhiều đời) |
| **Âm Đức** | trừ phần đã đem cân (cõi lành tiêu nhiều, cõi dữ không tiêu) |
| **Nghiệp Lực** | trừ theo cõi (bảng §18.5.2) |
| **Chỗ làm (§14.2)** | mất chỗ, xin lại được ngay |
| **Hôn nhân (§20.2)** | thành **góa** (không phải ly hôn), tài sản chung theo tỉ lệ góp về di sản; tái hôn không phải chờ 30 ngày |

- **Sổ Luân Hồi:** Bia Vận Mệnh (`vanmenh` có sẵn) thêm mục «Tiền kiếp».
  - Mỗi kiếp một dòng: tên, lá số, cảnh giới, nguyên nhân chết, cõi đầu thai, việc lớn đã làm.
  - Kiếp nào đắc đạo thì khắc tên Bia Đắc Đạo.
- **Đắc đạo thoát luân hồi:** nhân vật đắc đạo có thể «phi thăng».
  - Giữ danh hiệu, Bia, toàn bộ đồ thời trang.
  - Bắt đầu một «kiếp mới» tùy chọn (chơi lại kinh tế từ đầu với hào quang Chân Nhân), hoặc ở lại tiếp tục.

## 18.6 Phần đang chạy thêm hoặc khác đặc tả

`[ĐÃ CÓ]` Lấy từ nhật ký 11/11 và mã.

| Điểm | Đang chạy |
|---|---|
| **Chết vì bệnh** | bệnh nặng không chữa quá một số giờ định sẵn (`luanhoi.ILL_DEATH_H`); trước đó có cảnh báo và màn hình xám dần |
| **Chết vì đói** | cảnh báo khi Khí huyết xuống dưới ngưỡng `STARVE_LOW` do đói |
| **Tang phí** | tiền gửi trừ theo `luanhoi.FUNERAL`; tiền mang theo người mất một nửa |
| **Canh Mạnh Bà** | uống thì quên phần lớn tay nghề; từ chối thì tụt một cõi |
| **Cúng cô hồn** | người sống cúng cho người đang ở cõi Ngạ quỷ qua gói mạng `cung`; người cúng được Âm Đức |
| **Bố thí, phóng sinh, sám hối, giải hạn** | có ở `huyenhoc.js`; bố thí có trần ngày |
| **Án tù và khổ sai** | án cộng Nghiệp Lực theo mức; mỗi quặng khổ sai trừ Nghiệp |
| **Thoát chết** | vận khí cấp 4 cứu một lần rồi về 0 |
| **Đầu thai** | Dụng thần đổi theo lá số hư cấu; máy chủ ghi nhận ngoài khoá 30 ngày (QĐ-30) |

## 18.7 Vũ trụ quan dùng cho lời văn

`[ĐÃ CÓ]` ở mức luật viết; `[TẦM NHÌN]` ở mức cốt truyện. Rút từ `docs/gdd/02-the-gioi` (đã rà 10/11). Người viết thoại Âm phủ, thầy, bia phải theo:

1. **Mệnh là quỹ đạo, không phải kết cục.** Chuỗi gốc: tâm → niệm → hành → nghiệp → mệnh.
2. **Âm phủ là nơi soi xét, không phải nơi hành hạ.** Mỗi điện ứng một loại nghiệp và kết bằng một **việc sửa**. Không tả cực hình, không «mười tám tầng».
3. **Lục đạo là khuynh hướng của tâm**, có đường chuyển hoá; không cõi nào là ngõ cụt. Luôn có lối đi lên.
4. **Câu khắc trên Thiên Mệnh Bàn** (dùng được làm đề từ): «Trời định cái khung, người viết chữ; khung không dời, chữ không ai viết thay.» Kẻ lừa đảo trong thế giới này là kẻ chỉ đọc nửa đầu.
5. Không lời nào của game khẳng định cõi đầu thai của một người thật ngoài đời hay của người thân đã mất (§40).

## 18.8 Liên kết với hệ khác

| Hệ | Trao đổi | Chương |
|---|---|---|
| Nội dung mệnh | giải án, lễ bái sinh Phúc Khí | §12 |
| Nhân vật | cấp tính từ Phúc Khí tích lũy; cảnh giới đặt tên cho dải cấp | §11 |
| Đời sống | ngày điều độ cần ăn đủ bữa, ngủ đúng chỗ; đói và bệnh dẫn tới chết | §13 |
| Việc làm | ca trọn sinh Âm Đức; vận khí giảm rủi ro; Bách Nghệ tăng tay nghề | §14 |
| Di chuyển | đạp nước, tốc bay theo pháp môn và cảnh giới | §16 |
| Luật | án sinh Nghiệp Lực; khổ sai trả nghiệp | §19 |
| Nhà, hôn nhân | di sản, goá | §15, §20.2 |
| Thế giới | Bia Vận Mệnh mang Sổ Luân Hồi; khu Âm phủ ở dải phòng; Bia Đắc Đạo | §10, §12 |

## 18.9 Kiểm thử và nghiệm thu

- `test-game-huyenhoc` (10): không đổi ra tiền; Nghiệp tăng tai hoạ; giải hạn chặn sự kiện; đủ cấp chưa đột phá thì dừng; cân nghiệp ra đúng cõi; đoạn cõi dưới không quá 25 phút; ngày sinh thật không đổi.
- `test-game-amduc` (6): chuỗi ngày → cấp; đứt chuỗi thì tạm ngừng; thoát chết một lần.
- Đổi bảng tăng giảm: ba luật nền ở §18.0 không được vỡ.

## 18.10 Việc còn mở

`VC-032` (rà lời Âm phủ, lời báo bệnh theo LN-07) · `VC-022` (rà ba tập tầm nhìn 04, 05, 09 xem còn chi tiết nào đáng lấy).
