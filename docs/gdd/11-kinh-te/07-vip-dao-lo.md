# 11 · Phần 07 — VIP Thượng Khách và Đạo Lộ (season pass)

> Hai sản phẩm định kỳ của game: **VIP** (thuê bao, `SKU-V-*`) và **Đạo Lộ** (vé mùa, `SKU-DL-*`). Phần này đặt bậc, giá, quyền lợi, vòng đời thuê bao, cơ chế Lộ Điểm, bảng thưởng từng bậc. Nội dung cụ thể của 12 mùa nằm ở phần 08 và 09.
>
> Tên VIP: phần 04 §5.5 đề xuất đổi «Chân Nhân» thành **Thượng Khách** (chờ chủ dự án quyết). Phần này dùng «Thượng Khách»; code giữ `state.vip`, `vipActive`, `VIP_DAILY`.

---

## 1. Hiện trạng VIP trong code

| Thứ | Code | Giá trị |
|---|---|---|
| Trạng thái | `state.vip = { until, source }` | `until` là mốc thời gian |
| Kiểm | `progress.js › vipActive(s, now)` | `s.vip.until > now` |
| Ngọc hằng ngày | `cosmetics.js › VIP_DAILY`, `vipDaily()` | 30 / ngày, khi mở game |
| Mở sớm gia trì | `progress.js › GIATRI` (`vip: true`) | hào quang (cấp 2), linh khí (4), vệt sáng (6), ngự kiếm (8); **không** mở sớm pháp quang (10) |
| Món độc quyền | `unlock.vip` | `y_tu`, `quan_sen`, `phap_luan`, `hac` |
| Thầy AI | sơ đồ tổng §6.5 | 10 lượt / ngày → VIP 30 |
| Bán | **chưa có** — `worker/index.js` ghi «[REMOVED] VIP redeem/vip-gen + PLANS — gỡ hệ thống payment cho App Store (app free)» | — |

---

## 2. Vì sao **không** làm VIP theo tổng nạp

Nhiều game châu Á dùng «VIP 1 → VIP 15»: nạp càng nhiều, bậc càng cao, quyền lợi càng lớn, bậc hiện công khai. Huyền Giới **không** làm, vì:

1. Bậc VIP công khai biến chi tiêu thành địa vị — ngược với Thiên Bảng xếp theo Đạo Hạnh (trụ T2).
2. Quyền lợi tăng theo tổng nạp tạo động lực «nạp cho đủ bậc» — đúng hành vi phần 01 §9.3 muốn làm chậm lại.
3. Bậc cao thường mở thứ chạm gameplay (thêm lượt, thêm thưởng) — đi ngược bức tường tiền tệ.

Thay vào đó: **một** VIP thuê bao, quyền lợi cố định, không hiện công khai (người khác không thấy ai là VIP, trừ khi người đó mặc món VIP độc quyền — vốn là món thẩm mỹ họ đã trả Ngọc).

---

## 3. Bậc và giá `SKU-V-*`

### 3.1 Bảng sản phẩm

| SKU | Tên | Loại | Web (VND, gồm thuế) | App (USD) | Quy ra tháng | Bán cho < 18 tuổi |
|---|---|---|---|---|---|---|
| `SKU-V-01` | Thượng Khách · tháng | thuê bao tự gia hạn 1 tháng | 99.000 | 3,99 | 99.000 | **không** |
| `SKU-V-02` | Thượng Khách · quý | thuê bao tự gia hạn 3 tháng | 269.000 | 10,99 | 89.700 | **không** |
| `SKU-V-03` | Thượng Khách · năm | thuê bao tự gia hạn 12 tháng | 899.000 | 34,99 | 74.900 | **không** |
| `SKU-V-04` | Thẻ Thượng Khách 30 ngày | **không** tự gia hạn | 109.000 | 4,99 | 109.000 | có (trong trần tháng) |
| `SKU-V-05` | Hộ Quán · tháng | thuê bao tự gia hạn 1 tháng | 199.000 | 7,99 | 199.000 | **không** |

- `SKU-V-04` cho người không muốn tự gia hạn và cho tài khoản 16–17 tuổi (phần 11 §5). Đắt hơn bản tháng 10% vì không tự gia hạn — mức chênh nhỏ, công khai.
- `SKU-V-05` Hộ Quán: **quyền lợi chơi giống hệt** Thượng Khách; khác biệt chỉ là ủng hộ (§3.3).
- Không có «gói VIP trọn đời».
- Không có giá dùng thử miễn phí tự chuyển sang trả tiền (dễ làm người quên bị trừ tiền). Có thể có **thẻ 7 ngày tặng** trong sự kiện (không gắn phương thức thanh toán).

### 3.2 Quyền lợi Thượng Khách

| Quyền lợi | Chi tiết | Chạm lõi? |
|---|---|---|
| Ngọc hằng ngày | +30 Ngọc mỗi ngày mở game (`VIP_DAILY`) — Ngọc Tặng | không |
| Thầy AI | 30 lượt / ngày thay vì 10 (web, Android) | không — cùng độ sâu |
| Ngự Vân Thường | bay thấp ≤ 60 m, ×2 tốc độ ngay khi là VIP (phần 01 §4.2) | không — Ngự Kiếm cao vẫn theo cảnh giới 3 |
| Mở sớm hiệu ứng gia trì | hào quang, linh khí, vệt sáng theo hành Dụng thần (`GIATRI` có `vip: true`) | không — chỉ hình |
| Quyền mua món độc quyền | 4 món hiện có + tối đa 1 món mới / chương | không — vẫn trả Ngọc |
| +3 ô phối đồ | thêm vào 3 ô miễn phí | không |
| Thiệp lễ | +3 thiệp có hình động / ngày | không |
| Ưu tiên hỗ trợ | phản hồi trong 24 giờ thay vì 72 giờ | không |

### 3.3 Thêm cho Hộ Quán

| Quyền lợi | Chi tiết |
|---|---|
| Bảng Tri Ân | tên (tùy chọn, mặc định **tắt**) trên bảng gỗ ở Trà Thất Sơn Môn; không có thứ tự theo số tiền, xếp theo vần |
| Khung Hộ Quán mùa | 1 khung thẩm mỹ mỗi chương, chỉ có ở Hộ Quán |
| Thư quán chủ | thư cảm ơn mỗi chương kể việc quán đã làm (vùng mới, cố vấn mới) |
| Quỹ cố vấn | 20% doanh thu ròng của `SKU-V-05` chuyển vào quỹ thù lao cố vấn truyền thống, báo cáo ở «Sổ Quán» |

**Không có cho Hộ Quán:** thêm Ngọc, thêm lượt AI, quyền biểu quyết nội dung, xem trước vùng mới.

### 3.4 Khi VIP hết hạn

| Thứ | Hết hạn thì |
|---|---|
| Món đã mua (kể cả món VIP độc quyền) | **giữ vĩnh viễn**, vẫn mặc được |
| Ngọc đã nhận | giữ |
| Ngự Vân Thường | tắt (nếu chưa đủ cấp 8); đang bay thì hạ cánh nhẹ nhàng tại chỗ, không rơi |
| Hiệu ứng gia trì mở sớm | về theo cấp |
| Lượt AI | về 10 / ngày từ ngày kế |
| Ô phối đồ thêm | bộ đã lưu giữ nguyên, chỉ không sửa được ô 4–6 cho tới khi VIP lại |
| Thông báo | 2 lần: 3 ngày trước, ngày hết (phần 01 §6.4); **không** gửi «quay lại đi, bạn đang mất …» sau khi hết |

### 3.5 Giá trị và kiểm tra hợp lý

| So sánh | Ngọc nhận / tháng (mở game hằng ngày) | Giá | Ngọc / 1.000đ |
|---|---|---|---|
| `SKU-V-01` | ~900 | 99.000đ | 9,1 |
| `SKU-P-02` (330 Ngọc) | 330 | 109.000đ | 3,0 |
| `SKU-P-04` (1.600 Ngọc) | 1.600 | 449.000đ | 3,6 |

VIP cho Ngọc gấp ~3 lần gói nạp **nếu** người chơi mở game mỗi ngày. Đây là thiết kế «thẻ tháng» quen thuộc. Kiểm đạo đức: VIP thưởng sự **hiện diện**, không phạt sự vắng mặt (không có chuỗi, không mất Ngọc tích lũy). Người mua VIP mà ít vào thì nhận ít Ngọc — trang mua VIP nói rõ: «+30 Ngọc **mỗi ngày bạn ghé quán**».

---

## 4. Vòng đời thuê bao

### 4.1 Trạng thái

| Trạng thái | Nghĩa | `vipActive` |
|---|---|---|
| `none` | chưa từng VIP | false |
| `active` | đang trong kỳ đã trả | true |
| `active_canceled` | đã hủy tự gia hạn, còn hạn kỳ hiện tại | true |
| `grace` | gia hạn thất bại (thẻ lỗi), nền tảng đang thử lại — tối đa 16 ngày (Apple), theo cấu hình (Google), 7 ngày (web) | true |
| `on_hold` | Google Play «account hold» sau grace | false |
| `paused` | Google Play tạm dừng do người dùng | false |
| `expired` | hết hạn | false |
| `revoked` | hoàn tiền / chargeback | false, và xử lý phần 13 §3 |

Máy chủ là nguồn sự thật (phần 10 §4). Client chỉ đọc `vip.until` do máy chủ cấp; `vipActive` giữ logic cũ.

### 4.2 Chuyển trạng thái

```
none ──mua──▶ active ──hủy tự gia hạn──▶ active_canceled ──hết kỳ──▶ expired
                │  ▲                          │
                │  └──────bật lại tự gia hạn──┘
                ├──gia hạn OK──▶ active (kỳ mới)
                ├──gia hạn lỗi──▶ grace ──OK──▶ active
                │                   └──hết grace──▶ on_hold (Google) / expired
                └──hoàn tiền / chargeback──▶ revoked
```

### 4.3 Đổi gói

| Từ → Đến | Cách xử lý |
|---|---|
| tháng → năm | web: hiệu lực ngay, hoàn phần chưa dùng theo ngày; Apple / Google: theo cơ chế nâng cấp của nền tảng (cùng nhóm thuê bao) |
| năm → tháng | hiệu lực khi hết kỳ năm |
| Thượng Khách → Hộ Quán | như nâng cấp |
| thuê bao → thẻ 30 ngày | không cho mua chồng khi thuê bao còn hạn; thẻ cộng sau khi thuê bao hết |

### 4.4 Hủy

- Web: **một màn hình**: «Hủy tự gia hạn» → xác nhận một lần → xong. Không hỏi lý do bắt buộc (có ô tùy chọn). Không đề nghị giảm giá để giữ chân (X9).
- Apple / Google: nút «Quản lý thuê bao» mở trang của nền tảng (bắt buộc theo luật nền tảng).

---

## 5. Đạo Lộ — cấu trúc

### 5.1 Khung thời gian

| Đơn vị | Độ dài | Mốc |
|---|---|---|
| **Mùa** (`SEASON-xx`) | một năm can chi, từ Lập Xuân tới Lập Xuân năm sau | đổi niên chủ Thái Tuế (sơ đồ tổng §9.2, §10) |
| **Chương** | một quý tiết khí ≈ 91 ngày | Lập Xuân · Lập Hạ · Lập Thu · Lập Đông |
| **Tuần Lộ** | 7 ngày, bắt đầu thứ Hai 00:00 giờ kinh tế | làm mới Lộ Thư (§5.4) |

Bốn chương của một mùa: **Xuân Lộ**, **Hạ Lộ**, **Thu Lộ**, **Đông Lộ**. Mỗi chương có hai nhánh:

| Nhánh | Tên | Ai có |
|---|---|---|
| Miễn phí | **Thanh Lộ** | mọi người chơi |
| Trả phí | **Kim Thư** | người mua `SKU-DL-*` |

### 5.2 Bậc và Lộ Điểm

- Mỗi chương **30 bậc**; mỗi bậc cần **1.000 Lộ Điểm** (LĐ). Tổng 30.000 LĐ / chương.
- Sau bậc 30: **Dư Lộ** bậc 31–40, mỗi bậc 1.500 LĐ, thưởng 100 Phúc Khí (cả hai nhánh). Không có Ngọc ở Dư Lộ (tránh vòng in Ngọc).
- Lộ Điểm **chỉ** dùng để lên bậc Đạo Lộ (phần 01 §5.2). Không đổi ra gì khác. Hết chương thì LĐ thừa mất (chương mới bắt đầu từ 0) — đây là ngoại lệ duy nhất có «hết hạn» trong kinh tế, vì LĐ là thước đo tiến độ chương chứ không phải tiền.

### 5.3 Nguồn Lộ Điểm hằng ngày

| Việc | LĐ | Tối đa / ngày | Có trên iOS |
|---|---|---|---|
| Mỗi việc trong «3 việc hôm nay» (`state.js › tasks`) | 80 | 240 | có (việc «thắp nhang» thành «đốt trầm») |
| Mỗi án khách (`recordCase` kind `npc`) | 40 | 120 | có |
| Mỗi sảnh nghề (kind `desk`) | 40 | 160 (4 sảnh) | có |
| Ngồi trà hoặc tĩnh tọa | 10 / phút | 100 | có |
| **Trần ngày** | | **600** | |

Không có LĐ cho: đăng nhập trơn, xin xăm, gieo quẻ, xem Vận Mệnh Các / Thái Tuế Điện, hỏi Thầy AI, mua hàng, mở cửa hàng. Lý do lần lượt: không thưởng hiện diện vô nghĩa; không thưởng may rủi; không đẩy người chơi vào màn hình về hạn; AI tốn phí và vắng trên iOS; không thưởng tiêu tiền.

### 5.4 Lộ Thư — việc tuần

Mỗi tuần 6 việc, mỗi việc 200 LĐ. Người chơi **chọn 4 trong 6** để tính (hoàn thành nhiều hơn 4 không thêm LĐ). Mỗi việc luôn có **cách làm một mình**.

| Loại việc (mẫu) | Ví dụ | Ghi chú |
|---|---|---|
| Đi | «Ghé 2 vùng khác nhau trong tuần» | — |
| Học | «Đọc một bài ở Thư Lâu Lâm» | `library-data` |
| Nghề | «Đạt ≥ 70% ở một sảnh nghề» | — |
| Án Cổ | «Giải một Án Cổ (mới hoặc giải lại)» | — |
| Tĩnh | «Ngồi trà hoặc tĩnh tọa tổng 30 phút trong tuần» | thay cho «ngồi cùng người khác» để người chơi một mình không thiệt |
| Lễ (tuần có lễ) | «Thả một đèn ở Hồ Sen» (web) / «Thắp một ngọn đèn ở Trà Thất» (iOS) | — |
| Giao lưu (tùy chọn) | «Ngồi trà cùng một người» — **luôn có phương án một mình thay thế cùng điểm** | — |

**Không bao giờ là việc Lộ Thư:** làm việc thiện / công đức (để việc thiện không thành «cày vé»); xem lá số người khác; mua hàng; hỏi Thầy AI; thắng người khác.

### 5.5 Trần tuần và Lộ Dư (bù cho người bận)

- Trần tuần: **4.000 LĐ** (gồm Lộ Thư).
- **Lộ Dư:** nếu một tuần kiếm được dưới **2.400 LĐ**, phần thiếu `(2.400 − kiếm được)` cộng vào quỹ Lộ Dư (tối đa 9.600 = 4 tuần). Khi quỹ Lộ Dư > 0, mọi LĐ kiếm được **nhân đôi** và trừ dần quỹ, cho tới khi quỹ về 0. LĐ nhân đôi vẫn trong trần tuần 4.000.
- Ý nghĩa: người vắng 2 tuần (đi công tác, ốm, thi) quay lại vẫn kịp bậc 30 với nhịp chơi bình thường.

### 5.6 Mô phỏng hoàn thành chương (13 tuần)

| Kiểu | LĐ / tuần điển hình | Có Lộ Dư? | Đạt bậc 30 vào | Ghi chú |
|---|---|---|---|---|
| A · Khách Thong Thả (4 ngày, 15–20 phút) | 4 × (240 + 40 + 40 + 80) + 3 Lộ Thư × 200 = 2.200 | +200 / tuần | **tuần 13** (≈ 30.000 nhờ Lộ Dư) | thiết kế cố ý: người chơi 4 ngày / tuần **vừa** xong bậc 30 |
| A vắng 2 tuần giữa chương | 2.200 × 11 = 24.200 + Lộ Dư 4.800 + 200 × 11 ⇒ nhân đôi đủ bù | có | tuần 13 | Lộ Dư chặn trần 9.600 |
| B · Đệ Tử Chăm | 4.000 (trần) | không | **tuần 8** | sau đó Dư Lộ |
| C · Thượng Khách 30 phút / ngày | 7 × 400 + 4 × 200 = 3.600 | không | tuần 9 | — |
| D · Sưu tầm 45 phút / ngày | 4.000 | không | tuần 8 | — |

**Tiêu chí nghiệm thu:** ≥ 70% người mua Kim Thư đạt bậc 30 trước khi chương hết (chỉ số `DL_PAID_COMPLETION`, phần 12). Nếu dưới 60% hai chương liền: giảm LĐ / bậc, không bao giờ bán bậc.

---

## 6. Sản phẩm Đạo Lộ `SKU-DL-*`

### 6.1 Bảng giá

| SKU mẫu | Tên | Web (VND) | App (USD) | Ngọc | Thời gian bán | Bán cho < 18 |
|---|---|---|---|---|---|---|
| `SKU-DL-<mùa>-XUAN` / `-HA` / `-THU` / `-DONG` | Kim Thư một chương | 109.000 | 4,99 | 1.000 | suốt chương | có (trong trần tháng) |
| `SKU-DL-<mùa>-NIEN` | Kim Thư cả năm (4 chương) | 349.000 | 14,99 | 3.400 | chỉ trong chương Xuân | có |
| `SKU-DL-<mùa>-TANG` | Kim Thư tặng bạn (một chương) | 109.000 | 4,99 | 1.000 | suốt chương | không (người tặng phải ≥ 18) |

Ví dụ mã đầy đủ: `SKU-DL-SEASON-01-XUAN`, `SKU-DL-SEASON-01-NIEN`.

### 6.2 Luật

| # | Luật |
|---|---|
| DL1 | **Không bán bậc.** Không có «mua 10 bậc», «mua Lộ Điểm», «tăng tốc LĐ ×2» (M12) |
| DL2 | Mua Kim Thư giữa chương → nhận ngay **mọi** thưởng Kim Thư của các bậc đã đạt |
| DL3 | Hết chương → thưởng chưa nhận **tự nhận** vào tủ / ví; không mất |
| DL4 | Kim Thư mua được bằng Ngọc (1.000) — người chơi miễn phí chăm (~3.100 Ngọc / chương, phần 03) mua được bằng Ngọc điểm danh |
| DL5 | Thưởng Kim Thư hoàn lại 450 Ngọc / chương → mua bằng Ngọc thì chi phí ròng 550 Ngọc |
| DL6 | Món Kim Thư quay lại Tàng Bảo Lục sau 24 tháng (phần 03 §7) với chữ khắc «phục chế» |
| DL7 | Không có Đạo Hạnh, công đức, cảnh giới ở **cả hai** nhánh (phần 01 §4.7) |
| DL8 | Không có món thân bộ ngũ hành trong Kim Thư (Hợp mệnh không gắn vé) |
| DL9 | Mỗi chương ≤ 1 món VIP-only mới, **không** nằm trong Kim Thư |
| DL10 | Niên Lộ chỉ bán trong chương Xuân; mua ở chương Xuân thì nhận 4 chương; không bán Niên Lộ muộn rồi «nhận bù chương cũ» (tránh người mua tưởng được trọn năm) |

---

## 7. Bảng thưởng chuẩn một chương

Bảng này là **khuôn**; mỗi chương thay tên món cụ thể (phần 08, 09). «PK» = Phúc Khí.

| Bậc | Thanh Lộ (miễn phí) | Kim Thư (trả phí) |
|---|---|---|
| 1 | — | Tư thế chào mùa (emote) |
| 2 | — | 50 Ngọc |
| 3 | 300 PK | Thiệp lễ mùa ×5 |
| 4 | — | 200 PK |
| 5 | — | **Mũ / trâm chương** (Huyền) |
| 6 | 50 Ngọc | 50 Ngọc |
| 7 | — | Bảng nhuộm mùa (6 màu) |
| 8 | — | 200 PK |
| 9 | **Món Thanh Lộ 1** (Huyền) | 50 Ngọc |
| 10 | — | **Sau lưng chương** (Huyền) |
| 11 | — | Nội thất mùa 1 |
| 12 | 400 PK | 50 Ngọc |
| 13 | — | Tư thế ngồi trà mùa |
| 14 | — | 200 PK |
| 15 | 100 Ngọc | **Cầm tay chương** (Huyền) |
| 16 | — | 50 Ngọc |
| 17 | — | Hiệu ứng ấm trà mùa |
| 18 | Bảng nhuộm mùa (3 màu) | 200 PK |
| 19 | — | 50 Ngọc |
| 20 | — | **Hào quang hoặc vệt bước chương** (Tiên) |
| 21 | 500 PK | Nội thất mùa 2 |
| 22 | — | 50 Ngọc |
| 23 | — | Thiệp lễ mùa ×5 |
| 24 | 150 Ngọc | 200 PK |
| 25 | — | **Khung chương** (Huyền) |
| 26 | — | 50 Ngọc |
| 27 | **Món Thanh Lộ 2** (Huyền) | Tư thế đi dạo mùa |
| 28 | — | Bảng nhuộm mùa bổ sung (6 màu) |
| 29 | — | 50 Ngọc |
| 30 | Khung Kỳ Cựu chương (`SKU-A-23`, không bán) | **Phẩm phục chương** (Tiên); ở chương Đông thêm **Ngự vật niên** (Tiên) |
| 31–40 (Dư Lộ) | 100 PK / bậc | 100 PK / bậc |

### 7.1 Tổng một chương

| Nhánh | Ngọc | PK | Món thẩm mỹ (ô trang bị) | Món phụ (emote, nhuộm, nội thất, thiệp, hiệu ứng) |
|---|---|---|---|---|
| Thanh Lộ | 300 | 1.200 | 2 (Huyền) | 1 (nhuộm) + khung Kỳ Cựu |
| Kim Thư | 450 | 1.000 | 6 (4 Huyền, 2 Tiên) — chương Đông 7 | 12 |

Giá trị lẻ Kim Thư (theo dải chuẩn phần 04 §3.3): mũ 120 + sau lưng 140 + cầm tay 130 + khung 90 + hào quang 260 + phẩm phục 270 = **1.010 Ngọc** món ô trang bị; + 450 Ngọc; + món phụ ≈ 400 Ngọc → ≈ **1.860 Ngọc** ≈ 614.000đ (tỷ giá `SKU-P-02`) cho giá 109.000đ. Tỷ lệ giá trị ≈ 5,6×, trong khoảng thường gặp của vé mùa.

### 7.2 Tổng một mùa (4 chương)

| Nhánh | Ngọc | PK | Món ô trang bị | Món phụ |
|---|---|---|---|---|
| Thanh Lộ | 1.200 | 4.800 | 8 | 4 nhuộm + 4 khung Kỳ Cựu |
| Kim Thư | 1.800 | 4.000 | 25 | 48 |

---

## 8. Chương và Thái Tuế — quy tắc chủ đề

Mỗi mùa gắn một năm can chi và vị Thái Tuế trị niên (`taisui-general › TAISUI_60`, `thaitue.js › suiYear`). Quy tắc dùng chủ đề:

| Được dùng | Không được dùng |
|---|---|
| Hành của **nạp âm** năm (ví dụ 丙午, 丁未 = 天河水 Thiên Hà Thủy) làm màu, chất liệu | hình, tượng, tên vị Thái Tuế trên món |
| **Con giáp** năm làm họa tiết (ngựa, dê, khỉ…) | «bùa Thái Tuế», «đèn an Thái Tuế bản cao cấp», mọi thứ gắn lễ an Thái Tuế (`lightLamp` luôn miễn phí) |
| **Đức tính** ghi trong ghi chú của vị trị niên (`taisui-general › CURATED`, ví dụ 丙午 «cơ trí quyết đoán») làm chủ đề câu chuyện mùa | câu chữ «tuổi … phạm Thái Tuế năm nay nên mặc …» |
| Lễ tiết và tiết khí trong năm | món chỉ bán cho người «tuổi xung» năm đó |
| Phong cảnh của thánh địa ra mắt trong mùa | — |

Tên vị Thái Tuế chỉ xuất hiện trong **phần kể chuyện** ở Thái Tuế Điện (đã có, `thaitue.js`) và trong sự kiện Lập Xuân (tài liệu 10), không bao giờ trên thẻ món hay màn hình Đạo Lộ.

---

## 9. Ca biên

| Ca | Hành vi |
|---|---|
| Mua Kim Thư rồi hoàn tiền | thu hồi quyền Kim Thư; món đã nhận **giữ** nếu hoàn tiền theo luật đổi ý trong 14 ngày và chưa nhận thưởng nào; nếu đã nhận thưởng → không hoàn tiền tự nguyện (trừ luật buộc); chargeback → xử lý phần 13 |
| Mua Niên Lộ, đến chương Thu thì ngưng chơi | vẫn giữ quyền; thưởng chương nào đạt bậc chương đó |
| Người chơi đổi múi giờ | tuần Lộ theo giờ kinh tế của tài khoản |
| Chương mới bắt đầu giữa phiên chơi | LĐ kiếm trước 00:00 Lập Hạ tính chương cũ; sau tính chương mới |
| Người được tặng Kim Thư đã tự mua | không cho tặng (máy chủ kiểm trước khi thu tiền) |
| iOS | Đạo Lộ gọi «Niên Lộ Học Quán» (phần 14); không chữ Thái Tuế |
| Máy chủ sự cố một ngày | +600 LĐ bồi thường cho mọi người đăng nhập trong 3 ngày sau |

---

## 10. Checklist nghiệm thu phần 07

- [ ] Máy chủ giữ trạng thái thuê bao (§4.1), client chỉ đọc.
- [ ] Hủy tự gia hạn trên web một màn hình, không đề nghị giữ chân.
- [ ] Không có sản phẩm bán bậc / LĐ (lint danh sách sản phẩm).
- [ ] LĐ không thưởng cho xăm, quẻ, Vận Mệnh, Thái Tuế, AI, mua hàng (test).
- [ ] Lộ Thư luôn có phương án một mình.
- [ ] Lộ Dư hoạt động (test: vắng 2 tuần vẫn đạt bậc 30 với nhịp kiểu A).
- [ ] Món Đạo Lộ không có tên Thái Tuế (lint L9 phần 04).
- [ ] Hết hạn VIP: món giữ nguyên, bay hạ cánh mềm.
