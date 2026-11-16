# 17 · Sản xuất, ẩm thực, kinh doanh

> **Trạng thái:** `[ĐÃ CÓ]` lõi; `[MỘT PHẦN]` ở §17.8
> **Bộ phận chủ trì:** Thiết kế game (cân bằng) · Backend (sổ kinh tế)
> **Nguồn sự thật trong mã:** `src/game/econ-core.js`, `src/game/econ-data.js`, `src/game/inventory.js`, `src/game/production.js`, `src/game/market.js`, `src/game/cuisine.js`, `src/game/venue.js`, `src/game/econ-client.js`, `src/game/econ-ui.js`, `worker/economy.js`; số liệu ở [A3](phu-luc/A3-so-lieu.md) mục 17
> **Test:** `scripts/test-game-econ.mjs`, `scripts/test-econ-accounts.mjs` (cần máy chủ)
> **Thay thế:** `GAME-SINH-TON-KINH-TE-DAC-TA` §13, §15–§18, §20.3
> **Kiểm với mã ngày:** 2026-11-16

## 17.0 Mục đích, phạm vi, tóm tắt

Tách người sản xuất khỏi người tiêu dùng để tiền phải đi vòng qua tay nhiều người chơi. Không có nút «bán cho hệ thống». Không gồm: lương theo ca (§14), nhà ở (§15), hôn nhân (§20.2), thầy mệnh lý (§12.6).

```
ruộng, chuồng, sông ──▶ lò mổ, xay xát ──▶ bếp ──▶ quầy / quán / tửu lâu ──▶ người chơi và khách NPC ăn
        ▲                                                │
        └──────── đồ ôi → phân bón ◀─────────────────────┘        chợ ký gửi nối mọi khâu
```

| Phần | Một dòng | Mục |
|---|---|---|
| Sản xuất và chợ | thuê thửa, nuôi trồng theo giờ thật; ký gửi, Thương hội mồi khởi động | §17.1 |
| Ẩm thực | ba hạng món, độ tươi, khẩu vị vùng, độc tích | §17.2 |
| Đầu bếp | Thực căn từ lá số, bếp trưởng NPC, công thức bí truyền có ấn ký | §17.3 |
| Nhà hàng | ba hạng mặt bằng có hạn, ví tiệm riêng, khách NPC có trần, phá sản | §17.4 |
| Chống khai thác | độ tươi, trần sức mua, biên độ giá, két giữ | §17.5 |
| Thước đo | bảng điều khiển kinh tế cho quản trị | §17.6 |

## 17.1 Sản xuất & chuỗi cung ứng khép kín

> **Trạng thái:** `[ĐÃ CÓ]` (P9); hợp đồng sỉ: xem §17.8.

Kinh tế tách **người sản xuất** khỏi **người tiêu dùng**. Hàng đi theo chuỗi:

```
VÙNG SẢN XUẤT                       XƯỞNG CHẾ BIẾN                          BÁN LẺ
Ruộng: lúa, rau, bông, trà, thảo dược ──> Xay xát / sao trà ─────────────┐
Chuồng: gà, lợn, bò                    ──> Lò mổ: thịt, mỡ, xương, da thô ─┼──> Quầy cơm, tửu lâu, nhà hàng (§17.4)
Hoang dã: thú rừng, cá, gỗ, quặng      ──> Xưởng dệt: sợi → vải cuộn ─────┼──> Tiệm may (áo theo hành, Tàng Y Các)
                                       ──> Thợ rèn / thợ mộc: cuốc, dao ──┴──> Chợ ký gửi, sạp người chơi
                                                       ↑ đồ nghề quay về nông dân, thợ săn (hao mòn → mua mới)
```

### 17.1.1 Quy hoạch vùng (đặt vào thế giới có sẵn)

| Vùng | Chỗ trên bản đồ | Hành vùng | Sản vật |
|---|---|---|---|
| **Linh điền** (nông nghiệp) | Khôn cung ngoài tường (Tây Nam), lòng **Manh Phái Cốc** | Thổ / Mộc | lúa, rau, bông, trà, thảo dược |
| **Trang trại** (chăn nuôi) | Thung lũng Manh Phái Cốc, đồng cỏ Cấn cung | Thổ | gà (vòng nuôi 24 giờ), lợn (72 giờ), bò (7 ngày) |
| **Hoang dã** | Rừng quanh **Trích Thiên Đỉnh** và **Tử Bình Phong** | Mộc / Kim | thú rừng (da, lông, sừng), gỗ, nấm, mật |
| **Sông nước** | Sông **Huyền Hà**, hồ **Cùng Thông** | Thủy | cá, tôm, rong, muối (Đoài cung) |
| **Mỏ dân sự** | Chân núi Tử Bình Phong, **Khoáng Sơn** khu dân sự (§14.1.2) | Kim / Thổ | quặng sắt, đồng, đá |
| **Xưởng** | Vành Ngoại Thành (dọc đường vành, gần cổng) | theo xưởng | lò mổ (Kim), xưởng dệt (Mộc), lò rèn (Kim), xay xát (Thổ), hầm băng (Thủy) |
| **Thương mại** | Trung Thành và Nội Thành | Kim / Hỏa | chợ đầu mối Ly cung, tiệm, nhà hàng |

### 17.1.2 Nghề sản xuất (bổ sung danh mục 30 nghề §14.1.2)

| Nghề | Hành | Mới / có sẵn | Việc chính |
|---|---|---|---|
| Nông phu | Thổ | có | thuê thửa ruộng, gieo theo tiết khí, tưới, gặt |
| Tá điền chăn nuôi | Thổ | **mới** | cho ăn đúng bữa; bỏ đói thì vật nuôi chậm lớn, quá 24 giờ thì chết |
| Thợ săn | Kim | **mới** (thay «Pháo hoa lễ hội» ra khỏi đợt đầu) | bẫy và săn thú hoang (mini-game rình, bắn cung); có hạn ngạch con mồi mỗi vùng |
| Đồ tể (lò mổ) | Kim | **mới** | xẻ vật nuôi theo bảng sản lượng §17.1.3 |
| Thợ dệt / nhuộm | Mộc (dệt) · Thủy (nhuộm) | **mới** | bông → sợi → vải cuộn; nhuộm theo màu ngũ hành |
| Thợ may | Mộc | có | vải → phẩm phục (Tàng Y Các có sẵn là nơi bán lẻ) |
| Thợ rèn | Kim | có | quặng → cuốc, liềm, dao, lưỡi cày (đồ nghề có độ bền) |
| Thợ mộc | Mộc | có | gỗ → cán công cụ, bàn ghế quán, chuồng trại |
| Ngư phủ | Thủy | có | cá tươi (hỏng rất nhanh, §17.2) |

Danh mục thành **36 nghề**. Đợt đầu của chuỗi sản xuất (P9) chỉ làm một tuyến khép kín: **nông phu → xay xát → đầu bếp** và **tá điền gà → đồ tể → đầu bếp**.

### 17.1.3 Vòng đời và sản lượng

- **Ruộng:** thuê **thửa** (10×10 m) ở Nha Môn Địa Ốc, 50 đồng/tuần. Mỗi người tối đa 4 thửa.
  - Thời gian lớn (giờ thật): rau 8 giờ, lúa 24 giờ, bông 36 giờ, trà 48 giờ.
  - Phải tưới mỗi 12 giờ, quá hạn thì sản lượng −30%.
  - **Tiết khí hợp** (`todayInfo.jieqi`): +20%. Nông phu mệnh Dụng Thổ: +thêm theo §14.1.1.
- **Chuồng:** gà 24 giờ, lợn 72 giờ, bò 7 ngày. Thức ăn chăn nuôi mua từ nông phu (cám, cỏ).
- **Bảng xẻ ở lò mổ:**

  | Con | Thịt | Mỡ | Xương | Da |
  |---|---|---|---|---|
  | Gà | 2 | — | 1 | lông 1 |
  | Lợn | 8 | 3 | 3 | 1 |
  | Bò | 20 | 4 | 6 | 2 |

- **Đồ nghề có độ bền:** cuốc 200 lượt, dao mổ 300 lượt. Hết độ bền phải mua mới từ thợ rèn → tạo cầu ổn định cho nghề Kim.
- **Sản vật hoang dã có hạn ngạch hồi**: mỗi vùng có trữ lượng (ví dụ 40 thú), hồi 10%/giờ. Không cày vô hạn được.

### 17.1.4 Giao thương: không có nút «bán cho hệ thống»

- **Không có NPC thu mua mọi thứ.** Người sản xuất phải:
  1. **Ký gửi** ở **chợ đầu mối** Ly cung (và 3 chợ phiên ở Khảm, Khôn, Cấn): đặt giá, hàng nằm trong kho chợ, phí ký gửi 3% khi bán được, phí kho 1 đồng/ô/ngày;
  2. hoặc **tự bày sạp** (thuê điểm sạp, §17.4.1) và đứng bán;
  3. hoặc ký **hợp đồng sỉ (B2B)** với chủ quán: giao X đơn vị mỗi ngày, giá cố định, thời hạn 7 ngày, máy chủ giữ tiền cọc 20% của hai bên.
- **NPC là người tiêu dùng cuối, không phải người thu mua.** Dân thành NPC mua món ăn chín ở quán và áo ở tiệm, có hạn ngạch theo dân số vùng (§17.4.4, §17.5.2). NPC **không mua nguyên liệu thô**.
- **Mồi khởi động** (đã chốt, Quyết định 8): khi shard còn ít người, «Thương hội Huyền Thành» NPC bán nguyên liệu với giá **trần** (đắt hơn giá tham chiếu 40%) và thu mua thành phẩm với giá **sàn** (rẻ hơn 40%), có hạn mức mỗi ngày. Mục đích là chuỗi không đứt khi thiếu người, nhưng người chơi luôn lợi hơn khi buôn với nhau. Tắt dần khi shard có trên 30 người hoạt động.
  - Đếm «người hoạt động» = tài khoản đăng nhập có ít nhất 1 giờ chơi trong 24 giờ qua. Hạn mức giảm tuyến tính từ 100% (≤ 10 người) về 0 (≥ 30 người).
  - Thương hội chỉ thu **thành phẩm** (gạo, thịt xẻ, vải, đồ rèn), không thu đồ ăn chín (để quán còn khách NPC) và không thu rác ủ phân.
  - Tiền Thương hội trả ra là **nguồn bơm**: ghi sổ cái với `reason='guild_buy'`, `peer='faucet:thuonghoi'`, tính vào tỉ lệ hút / bơm ở §17.6.
  - Hạn mức tính theo **tài khoản và theo ngày** (mặc định 2 lượng / người / ngày), để không thành máy in tiền cho người cày nhiều nick.
- **Giá tham chiếu** mỗi mặt hàng = trung vị giá khớp 7 ngày ở chợ, kẹp trong [0,5×, 2×] giá gốc thiết kế. Dùng cho trần giá (§17.5.3), lượng khách (§17.4.4) và thẩm định tài sản (§20.2.4).

## 17.2 Ẩm thực chuyên sâu & phân hóa vùng miền

> **Trạng thái:** `[ĐÃ CÓ]` (P10).

Đồ ăn không còn là món hồi chỉ số tức thì như P1. Đồ ăn thành **hàng hóa** có độ tươi, có nơi sản xuất, có giá theo quãng đường.

```
[Nguyên liệu tươi: ruộng, lò mổ, sông] --(hỏng dần, cả khi offline)--> [Đầu bếp nấu: hao nguyên liệu, chất lượng theo tay nghề + mệnh]
   --> [Món ăn] --(bảo quản: thường / hầm băng)--> [Người chơi hoặc NPC ăn: No, Tỉnh, buff]   hoặc   [Ôi thiu → rác]
```

### 17.2.1 Ba hạng món

| Hạng | Ví dụ ở Huyền Thành | Hạn dùng (giờ thật) | Hiệu ứng | Rủi ro |
|---|---|---|---|---|
| **1 · Thô / hàng rong** | cơm nắm, bánh bao nguội, nước lã, mì xào vội | 12 giờ | Chỉ hồi **No**; không hồi Tỉnh | Cộng **độc tích** +1,5 mỗi bữa (§17.2.3) |
| **2 · Cơm bình dân / gia đình** | thịt kho, canh rau, cá chiên, mì nóng | 24 giờ thường · 48 giờ hầm băng | Hồi No + Tỉnh cân bằng; giữ miễn dịch (bữa thứ 3 trong ngày: miễn dịch +10, §13.2.3) | Quá hạn thành **«đồ ôi»**: ăn vào ngộ độc ngay (§13.2.3) |
| **3 · Cao lương / dưỡng sinh** | gà hầm thảo dược, bò nướng than hồng, yến tiệc | 48 giờ, **bắt buộc** tủ hàn ngọc (để thường chỉ 6 giờ) | Hồi tối đa; buff **«No khí»**: hiệu suất làm việc +15–25% trong 4 giờ | Nguyên liệu đắt; nấu hỏng là mất trắng |

- **Công thức lương §13.3.3 thêm hệ số:** `× hệ_số_bữa` (1,0; hoặc 1,15–1,25 khi đang có buff hạng 3). Buff không cộng dồn, lấy cái lớn nhất.
- **Ghép với món P1** (`life.js` `FOOD`):
  - hạng 1: bánh bao, nước vối, mì;
  - hạng 2: cơm bình dân, điểm tâm;
  - hạng 3: bữa tửu lâu, tiệc, liên hoa.
  P1 ăn ngay tại quầy nên không cần kho. Từ P8, món mua mang đi vào **kho đồ** và bắt đầu hỏng.

### 17.2.2 Đặc sản 4 vùng & giá theo quãng vận chuyển

| Vùng | Chỗ | Hành | Đặc sản | Đặc tính kinh tế |
|---|---|---|---|---|
| **Sông nước** | bến Huyền Hà, hồ Cùng Thông, Khảm cung | Thủy | cá tươi, tôm, canh rong, cá khô, tương lên men | Đồ tươi rẻ tại chỗ nhưng hỏng nhanh (6 giờ). Mang vào Nội Thành bán được **×3** nhưng cần **xe thùng băng** hoặc ngựa kèm thùng băng (§15.3) |
| **Nội đô thượng lưu** | Nội Thành, Càn / Ly cung | Kim / Hỏa | tửu lâu thượng hạng, đồ nướng, điểm tâm tinh xảo, bồ đào tửu Tây Vực | Không có đất trồng, phụ thuộc 100% hàng đưa vào. Sức mua NPC cao nhất (×2,5) |
| **Thôn dã & thung lũng** | Manh Phái Cốc, Khôn cung ngoài tường | Mộc / Thổ | rau sạch, ngũ cốc, trà đạo, món thanh đạm | Nguyên liệu rẻ. NPC ở đây **chê đồ khô / đồ để lâu**: món có độ tươi < 70% bán −50% |
| **Mỏ & xưởng** | chân Tử Bình Phong, Khoáng Sơn dân sự | Thổ / Kim | suất ăn thợ mỏ nhiều năng lượng, thịt xông khói, đồ muối mặn | NPC chuộng **lượng và độ bền** hơn hương vị. Đồ muối hỏng chậm (hạn ×3) |

**Giá trị tại chỗ bán:**

```
giá_trị(món, vùng_bán) = giá_gốc × hệ_số_khan_hiếm(vùng_sản_xuất → vùng_bán) × hệ_số_tươi × hệ_số_thích(vùng_bán)
  hệ_số_khan_hiếm = 1 + 0,4 × (khoảng cách / 500 m), trần ×3   (đồ có nguồn ngay tại vùng: 1)
  hệ_số_tươi      = 0,4 + 0,6 × độ_tươi
  hệ_số_thích     = 1,2 cho đặc sản đúng khẩu vị vùng (ví dụ đồ muối ở mỏ), 0,8 nếu vùng chê
```

### 17.2.3 Độc tích (chất tích tụ từ đồ ăn thô)

- Chỉ số ẩn 0–100 trong `life`. Mỗi bữa hạng 1 cộng +1,5. Giảm 3 mỗi ngày không ăn đồ hạng 1.
- Trên 30: mỗi bữa hạng 1 có 5% gây **ngộ độc nhẹ** (§13.2.3). Trên 60: 15%.
- Thầy thuốc Y Quán thấy được độc tích khi bắt mạch.
- Ăn đúng **3 bữa hạng 2** một ngày giảm thêm 5.

## 17.3 Bát Tự đầu bếp & công thức bí truyền

> **Trạng thái:** `[ĐÃ CÓ]` (P10); mục 17.3.4 (bếp trưởng điều hành): xem §17.8.

Không phải ai vào bếp cũng thành đầu bếp giỏi. Lá số quyết định vị giác và khả năng lĩnh hội.

```
[Lá số] → tính «Thực căn» (năng khiếu bếp) trên máy người chơi
   → gặp NPC Bếp trưởng (chat LLM §21.3): Thực căn cao thì thiện cảm tăng ×3
   → thử thách thực tế → nhận làm đồ đệ → truyền công thức bí truyền (khóa theo tài khoản)
   → món có ấn ký người nấu (+30% giá trị) → mở quán hoặc làm Bếp trưởng điều hành
```

### 17.3.1 Thực căn (năng khiếu bếp, 0,00–1,00)

Tính **trên máy** từ lá số, như `yong`, rồi lưu dạng kết quả suy ra. Không suy ngược được ngày sinh; chịu khóa đổi 30 ngày (§31.2.3).

```
Thực căn = 0,5 × T + 0,3 × M + 0,2 × K
  T  Thập thần: hành Thực Thần / Thương Quan (hành do Nhật chủ sinh ra) là Dụng thần → 1,0 ; là Hỷ thần → 0,7 ; là Kỵ thần → 0 ; còn lại → 0,3
  M  thế Mộc sinh Hỏa: min(%Mộc, %Hỏa) / 20%, trần 1   (có củi và có lửa)
  K  Thủy Hỏa ký tế: 1 − |%Thủy − %Hỏa| / 40%, kẹp [0, 1], và cả hai ≥ 10%   (nêm nếm vừa vặn)
```

- Ví dụ: Nhật chủ Giáp (Mộc) sinh Hỏa, nên Thực / Thương là Hỏa. Dụng thần Hỏa → T = 1.
- **Hợp cách đầu bếp** = Thực căn ≥ 0,6.

**Gắn với luật mệnh §14.1.1:** nghề bếp tính quan hệ mệnh theo **hành Hỏa *hoặc* hành Thực Thần của người đó, lấy cái lợi hơn**.
- Ví dụ người Nhật chủ Kim có Thực Thần là Thủy, Dụng thần Thủy: Hỏa với người này có thể là Kỵ, nhưng vào bếp vẫn tính Dụng.
- Lý do: đúng tinh thần «Thực Thần chủ về ẩm thực» của bản gốc mà không phá bảng nghề.

**Chất lượng món:**

```
chất_lượng (0–1) = 0,35 × điểm_mini-game + 0,25 × độ_tươi_nguyên_liệu + 0,2 × tay_nghề_chuẩn_hóa + 0,2 × Thực_căn
  hạng 3: chất_lượng < 0,4 → hỏng, mất trắng nguyên liệu
```

### 17.3.2 NPC Bếp trưởng & thử thách

- **Bếp trưởng có tên:** 4 người, mỗi người một vùng, mỗi người một persona (G0):
  - **Lão Hỏa Đầu** — Hỏa Vân Tửu Lâu, đồ nướng;
  - **Thẩm bà** — bến Huyền Hà, đồ sông;
  - **Sư thầy Tịnh Trai** — Manh Phái Cốc, chay thanh đạm;
  - **Đại Hồ** — bếp mỏ, đồ muối.
- **Thiện cảm:** người hợp cách đầu bếp tăng thiện cảm ×3 (§21.3.3). Bếp trưởng chủ động gợi ý bí quyết nêm nếm qua hội thoại; công cụ `give_hint` mở rộng sang gợi ý bếp.
- **Thử thách năng khiếu** (nhiệm vụ do máy chủ sinh, LLM chỉ kể chuyện):
  - Ví dụ Thẩm bà: «Mua cá tươi ở bến về nấu trong 3 canh giờ, độ tươi lúc nấu ≥ 80%».
  - Máy chủ kiểm: thời điểm mua, độ tươi lúc nấu, chất lượng món ≥ 0,7.
  - Cần ≥ 3 thử thách đạt và thiện cảm ≥ 60 mới được nhận làm đồ đệ.
- **Mỗi bếp trưởng nhận tối đa 20 đồ đệ mỗi shard.** Có tính khan hiếm.

### 17.3.3 Công thức bí truyền (khóa theo tài khoản)

- Mỗi bếp trưởng truyền 3 công thức bí truyền, mở dần theo tay nghề (Thợ, Thợ cả, Quản sự).
- **Khóa theo tài khoản:**
  - không có vật phẩm «sách công thức» để bán;
  - công thức nằm trong bảng `player_recipe` ở máy chủ;
  - chỉ chủ tài khoản bấm «nấu» được.
- **Ấn ký** `chef_u` trên mỗi món nấu từ công thức bí truyền: giá trị tham chiếu của món **+30%**. Lượng khách NPC (§17.4.4) tính theo giá trị đã cộng, nên đặt giá cao hơn 30% mà NPC vẫn vào.
- **Chống chép:** món khác tên nhưng cùng bộ nguyên liệu với công thức bí truyền thì không có ấn ký và chỉ đạt chất lượng trần 0,6.

### 17.3.4 Bếp trưởng điều hành (làm thuê ăn chia)

- Người có công thức bí truyền nhưng chưa có vốn có thể ký **hợp đồng Bếp trưởng điều hành** với nhà hàng của NPC hoặc người chơi.
- **Ăn chia 10–20% doanh thu** của các món mang ấn ký mình, thay cho lương theo sản phẩm. Hai bên thỏa thuận trong khung, máy chủ giữ hợp đồng.
- Bếp trưởng phải **vào ca** (§14.2.2) thì món ấn ký mới được nấu. Nhà hàng không bán được món ấn ký khi người đó vắng.
- Hợp đồng 7 ngày, gia hạn được. Tự ý bỏ ca thì mất phần chia trong ngày, uy tín −5.

## 17.4 Mặt bằng thương mại & vận hành nhà hàng

> **Trạng thái:** `[ĐÃ CÓ]` (P11); đấu giá ở mục 17.4.5: xem §17.8.

Bước chuyển từ «lao động chân tay» sang «chủ tiệm» (cấp Chủ tiệm §14.1.7).

```
vốn + (tùy chọn) công thức bí truyền → thuê / mua mặt bằng → xin giấy phép → ký hợp đồng sỉ với nông phu, đồ tể (§17.1.4)
   → thuê người (phụ bếp, chạy bàn, thu ngân: người chơi hoặc NPC) → mở cửa → chốt sổ mỗi ngày lúc giờ Tý
```

### 17.4.1 Ba hạng mặt bằng

| | **Quầy lề đường** (`STALL`) | **Quán cơm bình dân** (`DINER`) | **Tửu lâu thượng hạng** (`FINE`) |
|---|---|---|---|
| **Chỗ** | điểm sạp được kẻ sẵn dọc đại lộ, chợ, bến (như quầy cơm Sơn Môn P1) | nhà phố tầng trệt ở Trung Thành | lô mặt tiền Nội Thành / quảng trường VIP Ngoại Thành |
| **Giá** | thuê điểm sạp 20 đồng/ngày | thuê 400 đồng/ngày, hoặc mua 30 lượng | mua 300–800 lượng, hoặc thuê với **cọc 180 ngày** |
| **Sức chứa** | 2–4 khách | 15–30 khách | 50–100 khách |
| **Chi phí ngày** | gần như 0; trời mưa doanh thu −60%; đặt sai điểm thì nha dịch phạt 50 đồng | than củi 20, nước 5, phí vệ sinh phường 10, lương 1 phụ bếp | băng giữ lạnh 120, than 60, thuế môn bài 0,5% doanh thu, lương bếp trưởng + 4–6 người |
| **Giấy phép** (Nha Môn) | **Bài buôn rong** 50 đồng/tuần | **Giấy chứng vệ sinh** 300 đồng/tháng; kiểm tra ngẫu nhiên | **Giấy phép thượng hạng** 5 lượng/tháng và **phòng hỏa** (vạc nước, cát), kiểm tra hằng tuần |
| **Bán được** | món hạng 1, 2 | hạng 1–3 (hạng 3 cần tủ hàn ngọc) | mọi hạng; được bày rượu Tây Vực |

- **Không giấy phép, hết hạn, hoặc kiểm tra trượt** (đồ ôi trong kho, thiếu đồ phòng hỏa): xử theo Huyền Thành Luật. Điều mới «Buôn bán trái phép»: phạt 25 Phúc Khí/điểm như bậc phạt tiền có sẵn, kèm đình chỉ 24 giờ.
- **Số mặt bằng có hạn mỗi shard:** 24 điểm sạp, 12 quán, 4 tửu lâu thượng hạng mới (ngoài 4 tửu lâu NPC). Tạo cạnh tranh vị trí, đúng với «thuê người — chỗ có hạn» §14.2.
- **4 tửu lâu NPC có sẵn** giữ nguyên, là đối thủ cạnh tranh. Các quầy P1 (quầy cơm Sơn Môn) cũng giữ, là chuẩn giá sàn cho người mới.

### 17.4.2 Tài khoản tiệm (tách khỏi ví chủ)

- Mỗi mặt bằng có **ví tiệm** riêng. Doanh thu vào ví tiệm; chi phí trừ từ ví tiệm.
- Chủ **rút lãi** được khi ví tiệm dương. Nạp vốn từ ví chủ thì ghi sổ «góp vốn».
- Không trộn hai ví, để dễ kiểm phá sản và rửa tiền.

### 17.4.3 Sổ lãi lỗ hằng ngày

```
lãi_ròng_ngày = Σ doanh_thu_món
              − định_phí   (thuê, khấu hao bếp & bàn ghế, băng giữ lạnh, than, nước, giấy phép chia theo ngày, phí vệ sinh)
              − biến_phí   (nguyên liệu mua theo §17.1.4, lương theo sản phẩm, phần chia bếp trưởng điều hành)
              − thuế       (môn bài 0,5% doanh thu với hạng FINE; thuế thân của chủ tính riêng)
```

- **Định phí trừ tự động lúc giờ Tý** dù có bán được gì hay không. Băng và than chỉ trừ khi tủ đang bật.
- **Khấu hao:** bếp 1%/ngày giá mua, bàn ghế 0,5%/ngày. Về 0 thì phải thay (tạo cầu cho thợ rèn, thợ mộc).
- Bảng sổ hiện trong giao diện chủ tiệm: 7 ngày gần nhất, món bán chạy, khách NPC và người chơi, tỉ lệ hao hụt.

### 17.4.4 Dòng khách NPC

Khách NPC vào quán theo mô phỏng mỗi giờ (alarm của Durable Object tiệm), **chỉ khi quán đang mở cửa, có ít nhất 1 người làm trong ca và có món trong kho**.

```
cầu_vùng(giờ)  = dân_số_vùng × sức_mua_vùng × đường_cong_giờ(bữa sáng / trưa / tối) × hệ_số_ngày (lễ, rằm)
điểm_quán      = danh_tiếng^0,6 × chất_lượng_tb × hệ_số_vị_trí × (1 / khoảng_cách_tới_cụm_dân)
                 × (giá_bán ≤ 1,5 × giá_trị ? (giá_trị / giá_bán)^1,2 : 0)
khách_quán     = min(sức_chứa × 2 lượt / giờ, cầu_vùng × điểm_quán / Σ điểm_các_quán_trong_vùng)
```

- **Giá vượt 150% giá trị** (§17.2.2, đã tính ấn ký) thì NPC không vào, chuyển sang quán khác.
- **Danh tiếng** 0–100: tăng khi món chất lượng ≥ 0,7, khách hài lòng, đám cưới Thượng lưu tổ chức tại quán; giảm khi bán đồ gần hỏng, kiểm tra trượt, để khách chờ vì thiếu người.
- **Sức mua vùng:** Nội Thành ×2,5 · Trung Thành ×1,2 · thôn dã ×0,8 · mỏ ×1,0, kèm khẩu vị §17.2.2.

### 17.4.5 Phá sản

- Ví tiệm **âm liên tục quá 3 ngày** (giờ Tý thứ 3) thì Nha Môn **niêm phong** mặt bằng:
  - đình chỉ bán hàng;
  - mặt bằng thuê → hủy hợp đồng, mất cọc;
  - mặt bằng mua và thiết bị → **đấu giá** 48 giờ cho người chơi, giá khởi điểm 60% thẩm định. Tiền thu được trả nợ theo thứ tự: lương người làm → nhà cung cấp → Tiền Trang → thuế.
- Nợ còn thiếu chuyển sang **nợ cá nhân** của chủ (§13.3.6). Quá hạn thì khổ sai trừ nợ (Điều 12).
- Báo trước: âm 1 ngày → thư cảnh báo; âm 2 ngày → NPC nha dịch đến nhắc (bark + thư).

## 17.5 Chống khai thác kinh tế (bắt buộc có trong mã)

> **Trạng thái:** `[ĐÃ CÓ]` (P8–P11).

### 17.5.1 Độ tươi & chuỗi lạnh

- Mọi vật phẩm thực phẩm (nguyên liệu và món) trong kho người chơi, kho tiệm, kho chợ đều có `fresh_at` (thời điểm 100%) và `decay_h` (số giờ từ 100% về 0%).
- **Tính lười, không chạy đồng hồ:** `độ_tươi(t) = 1 − Σ (đoạn_thời_gian × hệ_số_bảo_quản) / decay_h`. Máy chủ chỉ tính lại khi có ai đọc / dùng / bán món đó; mỗi lần đổi chỗ bảo quản thì chốt đoạn.

  | Nơi để | Hệ số bảo quản |
  |---|---|
  | Thường (túi, kho thường) | 1,0 |
  | Hầm băng, tủ hàn ngọc, xe thùng băng (đang có băng) | 0,2 (giảm 80%) |
  | Đồ muối, đồ khô | `decay_h` ×3 sẵn trong thông số món |

- Nguyên liệu tươi mặc định `decay_h = 25` (−4%/giờ theo bản gốc); cá tươi 6; món theo bảng hạng §17.2.1.
- **Hết tươi** → biến thành **«Đồ ôi»** (`rotted`): chỉ bán cho nông phu làm phân bón (đối tượng duy nhất mua được), 1 đồng mỗi đơn vị. Phân bón giúp ruộng +10% sản lượng. Rác có đường về, không phải NPC «mua rác».
- **Băng là hàng tiêu hao:** 1 khối giữ lạnh 1 ô kho trong 12 giờ. Hầm băng (Thủy) sản xuất băng. Muốn tích trữ thì phải trả liên tục → triệt tiêu đầu cơ lương thực.

### 17.5.2 Trần sức mua & lượng khách NPC

- Mỗi vùng có `dân_số` và `sức_mua` cố định theo thiết kế, chỉnh theo số người chơi hoạt động.
- Tổng tiền NPC chi trong một vùng mỗi ngày có **trần**. Không ai «cắm máy bán vô hạn cho hệ thống».
- Mặt bằng mới mở chia lại cùng một chiếc bánh; nhiều quán quá thì quán kém tự đóng.
- NPC chỉ mua **món ăn chín** và **áo**; không mua nguyên liệu, không mua đồ của tài khoản khách.

### 17.5.3 Trần giá & chống rửa tiền qua giao dịch

- **Mọi giao dịch giữa người chơi** (chợ ký gửi, sạp, hợp đồng sỉ, món trong quán bán cho người chơi) có biên độ:

  ```
  0,3 × giá_tham_chiếu ≤ đơn_giá ≤ 3 × giá_tham_chiếu        (giá tham chiếu §17.1.4; món có ấn ký: × 1,3)
  ```

- **Ngoài biên độ:** giao dịch không bị chặn cứng mà chuyển vào **két giữ 24 giờ** (`HOLD`) và gắn cờ cả hai tài khoản. Trọng tài kiểm đồ thị quan hệ (§12.6.5):
  - sạch → giải ngân;
  - nghi vấn → hàng đợi admin.
- **Ngưỡng tích lũy:** một cặp tài khoản giao dịch tổng > 20 lượng / 7 ngày cũng vào diện xem xét, dù từng lần đều trong biên độ.
- **Tài khoản khách** không giao dịch với ai (§31.3).

### 17.5.4 Kênh chuyển tiền khác đã được chặn

| Kênh | Chặn bằng |
|---|---|
| Hôn nhân / ly hôn | chia theo tỉ lệ góp (§20.2.4); chờ 30 ngày; tối đa 3 lần / năm; điều luật «Lừa hôn» |
| Dịch vụ mệnh lý | két 24 giờ, thuế 15–20%, 1 lượt / tuần mỗi cặp, đồ thị quan hệ (§12.6.5) |
| Mừng cưới | không có cơ chế mừng tiền (§20.2.2) |
| Đấu giá phá sản | giá khởi điểm 60%; người mua có quan hệ (đồ thị) với chủ cũ thì không được đấu |
| Hợp đồng sỉ | đơn giá trong biên độ §17.5.3; cọc 20%; tổng tích lũy vào ngưỡng xem xét |
| Bếp trưởng điều hành | phần chia 10–20% tính trên doanh thu **thực của khách NPC và người chơi không liên quan** |

## 17.6 Thước đo cân bằng (bảng admin)

> **Trạng thái:** `[ĐÃ CÓ]` — bảng quản trị kinh tế có từ P7.

- Tổng tiền lưu hành và **tỉ lệ hút / bơm** mỗi ngày: mục tiêu hút 90–105% bơm. Tách riêng dòng bơm của Thương hội (§17.1.4) để thấy lúc nào nó tự tắt.
- Giá tham chiếu 10 mặt hàng chính (biến động > 25% / ngày thì cảnh báo).
- Tỉ lệ quán lãi / lỗ / niêm phong; thu nhập trung vị theo nghề và theo quan hệ mệnh.
- Số cờ nghi vấn mỗi ngày, tỉ lệ cờ xác nhận gian lận.
- Chi phí LLM theo tính năng (NPC chat, trọng tài) so với ngân sách tháng.

## 17.7 Phần đang chạy thêm hoặc khác đặc tả

`[ĐÃ CÓ]` Lấy từ nhật ký 11/11 và mã; khi lệch thì mục này và [A3](phu-luc/A3-so-lieu.md) thắng.

| Điểm | Đang chạy |
|---|---|
| **Một sổ** | Mọi phần của chương này chạy trong **một** Durable Object `Economy` (QĐ-19). Luật nằm ở `econ-core.js`, dùng chung cho máy chủ, test và **sổ trên máy khi ngoại tuyến** (`econ-client.js`) |
| **Ví chợ** | Ví chợ trên máy chủ tách khỏi ví trên máy. Gửi tiền lên có trần mỗi ngày (khách thấp, tài khoản cao hơn) và có khoá chống gửi trùng (QĐ-20) |
| **Khách** | Người chưa đăng nhập không giao dịch với người khác; vẫn dùng được Thương hội, bếp, ruộng trên sổ của mình |
| **Giao thức** | Một gói `ec {op, a}`; tên thao tác phải khớp `protocol.EC_OP`. Thao tác quản trị không gửi được từ client. Danh sách ở [A4](phu-luc/A4-giao-thuc.md) §A4.1 |
| **Vật phẩm** | 75 mục trong `econ-data.ITEMS` (nguyên liệu, vật nuôi, đồ nghề, món), các công thức ở `RECIPES`, bốn bếp trưởng ở `CHEFS` |
| **Vùng khẩu vị** | năm vùng trong mã (đặc tả ghi bốn) |
| **Thửa ruộng, chuồng** | thuê theo tuần, tối đa bốn; tưới mỗi 12 giờ; có mùa vụ và phân bón |
| **Chợ** | phí bán và phí kho ở `market.js`; giá tham chiếu là trung vị bảy ngày; ngoài biên độ thì vào két 24 giờ; một cặp giao dịch vượt ngưỡng tích lũy cũng vào két |
| **Thương hội** | bán nguyên liệu cao hơn giá tham chiếu, thu thành phẩm thấp hơn; hạn mức mỗi người mỗi ngày giảm theo số người hoạt động; không thu đồ chín và đồ ôi (QĐ-08) |
| **Mặt bằng** | số lượng có hạn theo ba hạng; âm ba ngày thì niêm phong, phần âm thành nợ của chủ |
| **Giao diện** | nút Kho đồ (phím I) mở bảy thẻ: Kho · Ruộng · Bếp · Chợ · Tiệm · Hộ tịch · Thầy mệnh. Việc cần đúng chỗ thì mở từ quầy dịch vụ trong tiệm (§15.2.5) |
| **Cân bằng đã chỉnh** | giá gạo nâng để khâu xay xát không lỗ; test bảo vệ «chuỗi lúa → cơm có lãi ở cả ba khâu» |

## 17.8 Chưa thấy trong mã `[MỘT PHẦN]`

So tên thao tác ở [A4](phu-luc/A4-giao-thuc.md) với đặc tả, ba phần sau chưa có thao tác tương ứng. Cần người phụ trách mở mã xác nhận.

| Mục | Việc |
|---|---|
| Hợp đồng sỉ giữa người chơi (§17.1.4 ý 3) | `VC-027` |
| Đấu giá mặt bằng phá sản (§17.4.5) | `VC-027` |
| Bếp trưởng điều hành ăn chia (§17.3.4) | `VC-028` |

## 17.9 Liên kết với hệ khác

| Hệ | Trao đổi | Chương |
|---|---|---|
| Đời sống | món ăn hồi No, Tỉnh; đồ ôi gây ngộ độc | §13.2 |
| Việc làm | «No khí» tăng hiệu suất; nghề nông, ngư, bếp | §14 |
| Mệnh | Thực căn; Dụng thần Thổ lợi nghề nông | §11 |
| Thế giới | vùng sản xuất, chợ, điểm sạp, lô mặt bằng | §10 |
| NPC | bếp trưởng có persona; chủ tiệm báo giá trong khung | §21.3 |
| Huyền học | bán đồ hết tươi sinh Nghiệp Lực; quý nhân, khách sộp theo vận số | §18.1, §18.3 |
| Luật | buôn bán trái phép, quỵt nợ | §19 |
| Máy chủ | sổ tiền, két giữ, khoá chống trùng | §31.4 |

## 17.10 Kiểm thử và nghiệm thu

- `test-game-econ` (32 ca): kho và độ tươi, chuỗi lúa → cơm, mô phỏng nhà hàng 30 ngày, chợ, Thương hội, bếp, hộ tịch, thầy mệnh lý, chống thao túng NPC.
- `test-econ-accounts` (máy chủ dev): trần ví chợ, ký gửi giữa hai tài khoản, két 24 giờ.
- Đổi giá hoặc sản lượng: mô phỏng chuỗi phải còn lãi ở mọi khâu; tỉ lệ hút trên bơm trong dải §17.6.

## 17.11 Việc còn mở

`VC-027` · `VC-028` · `VC-013` · `VC-031`.
