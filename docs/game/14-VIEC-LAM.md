# 14 · Việc làm theo mệnh

> **Trạng thái:** `[ĐÃ CÓ]`; ngoại lệ ghi ở §14.4
> **Bộ phận chủ trì:** Thiết kế game (nghề, cân bằng) · Backend (sổ việc làm)
> **Nguồn sự thật trong mã:** `src/game/jobs.js`, `src/game/guild-core.js`, `src/game/jobzones.js`, `src/game/work.js`, `src/game/work-games.js`, `src/game/fatequest.js`, `worker/guild.js`; số liệu ở [A3](phu-luc/A3-so-lieu.md) mục 14
> **Test:** `scripts/test-game-jobs.mjs`, `scripts/test-game-fate.mjs`, `scripts/test-quan-mmo.mjs` (phần Guild, cần máy chủ)
> **Thay thế:** `GAME-SINH-TON-KINH-TE-DAC-TA` §4, §5
> **Kiểm với mã ngày:** 2026-11-16

## 14.0 Mục đích, phạm vi, tóm tắt

Việc làm là nơi lá số chạm vào túi tiền rõ nhất: cùng một nghề, người hợp Dụng thần kiếm gấp đôi, người phạm Kỵ thần kiếm một nửa và dễ gặp nạn. Chương này gồm luật mệnh, danh mục nghề, chỗ làm có hạn, ca, lương, chống gian lận và nhiệm vụ mệnh. Không gồm: sản xuất nông sản và nấu ăn (§17), thầy mệnh lý (§12.6).

| Phần | Một dòng | Mục |
|---|---|---|
| Luật mệnh | hành nghề so với Dụng / Hỷ / Kỵ thần đổi lương, sức, tay nghề, rủi ro | §14.1.1 |
| Danh mục | 31 nghề, mỗi hành ít nhất sáu; 16 nghề trong tiệm, 15 nghề theo khu, thêm việc vặt gánh nước | §14.1.2, §14.3 |
| Chỗ làm | mỗi tiệm có số suất cố định theo bậc; máy chủ giữ | §14.2.1 |
| Ca | tối đa 8 việc trong 30 phút, 3 ca mỗi ngày | §14.2.2, §14.2.4 |
| Nhiệm vụ mệnh | 15 việc, chỉ người đúng Dụng thần, đúng giờ, đúng chỗ mới thấy | §14.1.6, §14.3 |

## 14.1 Việc làm theo mệnh

> **Trạng thái:** `[ĐÃ CÓ]` — luật mệnh và 5 nghề đầu (P2), nhiệm vụ mệnh (P5), đủ danh mục (P7). Danh mục đang chạy: §14.3.

### 14.1.1 Luật mệnh (thuần, `jobs.js`)

Hành của nghề so với `yong`:

| Quan hệ | Điều kiện | Hiệu ứng |
|---|---|---|
| **Dụng thần** | hành nghề = `yong.primary` | thu nhập ×2 (×2,5 khi Thợ cả); may mắn ×2 (việc thưởng, khách sộp); **mở nhiệm vụ mệnh** (§14.1.6); thăng cấp được tới Chủ |
| **Hỷ thần** | hành nghề = `yong.accent` (hành sinh Dụng) | tay nghề ×1,6; Tỉnh hao ×0,7; thu nhập ×1,3; ổn định (không rủi ro) |
| **Trung tính** | còn lại, không phải Kỵ | ×1 |
| **Kỵ thần** | hành nghề = `yong.ji` | Tỉnh hao ×2; **rủi ro** mỗi việc 8%: tai nạn (chấn thương), hỏng hàng (bồi 2 lần giá việc), bị phạt; hiệu suất trần 0,6; **không thăng cấp** quá Thợ |

Bổ sung cho có chiều sâu mà không ồn:
- **Cung làm việc:** tiệm nằm ở cung có hành sinh hoặc trùng hành nghề thì +10%. Ví dụ tửu lâu ở Ly cung (Hỏa) cho nghề Hỏa.
- **Ngày:** ngày can chi sinh hành nghề +10%, khắc hành nghề −10%. Lịch hiện trên bảng việc.

### 14.1.2 Danh mục nghề (30 nghề, 6 nghề mỗi hành)

Cột «Nơi làm» dùng **tiệm và địa điểm có sẵn** (`shops.js`; lúc viết đặc tả thành mới có 47 tiệm, nay là 8.560 tiệm thuộc 15 loại — §10.3), cộng một số điểm mới.

| Hành | Nghề | Nơi làm | Mini-game / hành động |
|---|---|---|---|
| **Hỏa** | Đầu bếp tửu lâu | `tuu` ×4 | canh lửa: giữ kim nhiệt trong vùng xanh, xếp món theo phiếu |
| | Thợ làm đèn lồng | `den` ×2 | dán giấy, vẽ hoa văn theo mẫu (ghép hình) |
| | Thợ hương | `huong` ×2 | trộn tỉ lệ trầm, quế, đàn |
| | Kép hát / gánh hát | sân khấu Ly cung | nhịp phách (rhythm) |
| | Giữ lò luyện đan | Đan phòng Sơn Môn | giữ lửa văn / võ theo giờ |
| | Pháo hoa lễ hội | sự kiện ngày rằm | bắn đúng nhịp |
| **Thủy** | Lái đò, thuyền hoa | kênh Khảm / Tốn, hào (`river3d` có sẵn thuyền) | chèo theo luồng, đón khách đúng bến |
| | Phu bến, phu vận tải | dịch trạm `dichtram` ×8 | giao hàng giữa các cung (đi bộ hoặc cưỡi), có hạn giờ |
| | Pha trà trà lâu | `tralau` ×3 | pha đúng độ (nhiệt, thời gian), kế thừa mini-game trà sẵn có |
| | Ngư phủ | sông ngoài thành, hồ | thả lưới theo con nước (giờ) |
| | Buôn muối, xuất nhập | Đoài cung, cửa thủy | mua thấp bán cao theo bảng giá shard |
| | Rượu, hầm rượu | tửu lâu | ủ theo ngày |
| **Mộc** | Thợ mộc | `moc` ×3 | cưa, bào theo đường vạch |
| | Người làm vườn | `hoavien` ×4, sân biệt phủ (chủ phủ thuê) | tỉa cây, tưới đúng lịch |
| | Hái thuốc, bốc thuốc | `duoc` ×4, rừng Tốn | tìm cây trong rừng (chỉ dẫn ngũ hành) |
| | Thợ may | `may` ×1 | ghép vải theo số đo |
| | Thầy đồ, chép sách | `thuhoa` ×4, Thư Lâu | chép chữ (gõ đúng), dạy học trò NPC |
| | Tiều phu | rừng ngoài thành | đốn cây (gắn hệ phá hủy, chỉ cây cho phép) |
| **Kim** | Thợ rèn | `loren` ×3 | rèn theo nhịp búa, tôi nước đúng lúc |
| | Thợ mỏ | Khoáng Sơn **khu dân sự** (tách khỏi khu khổ sai) | đào mạch quặng (dùng lại `ORES`) |
| | Thợ kim hoàn | tiệm mới Càn cung | khảm ngọc (ghép) |
| | Tiền trang (thu ngân, cho vay) | **Tiền trang** mới Càn cung | kiểm bạc giả, tính lãi |
| | Bảo tiêu, hộ vệ | dịch trạm (áp tải) | hộ tống xe hàng ra ngoài thành |
| | Nha dịch, cai ngục | Nha Môn, Thiên Lao | tuần phố, áp giải (gắn Huyền Thành Luật) |
| **Thổ** | Thợ gốm | `gom` ×3 | nặn trên bàn xoay, nung |
| | Thợ xây, sửa công trình | công trình bị phá ngoài thành (`raze.js`) | dựng lại sớm hơn 20 phút; tiền do người phá bồi |
| | Môi giới nhà đất | Nha Môn Địa Ốc `namon` ×1 | dẫn khách xem nhà (NPC hoặc người chơi), hoa hồng |
| | Thầy phong thủy | `phongthuy` ×2 | xem hướng cho nhà người khác (dùng `homefs` có sẵn) |
| | Nông phu | Khôn cung linh điền | cày, gieo, gặt theo tiết khí (`todayInfo.jieqi`) |
| | Thợ đá, khắc bia | Cấn cung | khắc chữ |

- Mỗi hành có ít nhất 2 nghề **làm được ngay** (không cần tay nghề), để ai cũng có lối vào, kể cả người mệnh Kỵ một hành.
- **Đợt 1 làm 5 nghề**, mỗi hành 1: Đầu bếp (Hỏa), Phu vận tải (Thủy), Hái thuốc (Mộc), Thợ mỏ (Kim), Thợ gốm (Thổ).

### 14.1.3 Rủi ro lao động (Kỵ thần và mọi nghề)

Mỗi việc tung xác suất rủi ro:

```
p = 1% + (Kỵ ? 7% : 0) + (Tỉnh < 20 ? 5% : 0) + (bệnh ? 5% : 0) − (đồ nghề tốt ? 2% : 0)
```

| Rủi ro | Tỉ lệ khi trúng | Hậu quả |
|---|---|---|
| Tai nạn | 40% | chấn thương (§13.2.3) |
| Hỏng hàng | 40% | bồi 2 lần giá việc |
| Bị phạt hoặc khách phàn nàn | 20% | trừ tiền việc, chủ tiệm nhớ |

### 14.1.4 Hao Tỉnh và No theo nghề

- Mỗi việc (≈ 3–5 phút chơi) hao Tỉnh 3–8 và No 2–5 tùy nghề: nặng nhất là thợ mỏ, thợ xây, phu; nhẹ nhất là thầy đồ, thu ngân.
- Có hệ số mệnh (§14.1.1).
- Một **ca** = 30 phút chơi ≈ 6–8 việc.

### 14.1.5 Hiệu suất

- Hiệu suất của mỗi việc = điểm mini-game (0–1), quy đổi sang 0,3–1,5.
- Cộng thưởng chuỗi: 5 việc liền tốt thì +0,1.
- Trừ khi Tỉnh < 30 (−0,2).
- **Không cho treo máy:** việc nào cũng phải thao tác. Máy chủ kiểm khoảng thời gian tối thiểu giữa hai việc, và nhịp quá đều thì nghi bot.

### 14.1.6 Nhiệm vụ mệnh độc quyền

Chỉ mở khi người chơi đứng đúng **tọa độ phong thủy và giờ** hợp **Dụng thần** của mình. Người khác đứng đó cũng không thấy.

| Dụng thần | Nơi | Giờ | Cơ hội |
|---|---|---|---|
| Thủy | bến sông ngoài thành, chợ cá, hào Khảm | Hợi – Tý (21–1h) | lô hàng muối, cá lớn ×5 giá; thuyền buôn đêm |
| Hỏa | quảng trường Ly cung, lò luyện đan | Tỵ – Ngọ (9–13h) | đặt tiệc lớn, đơn pháo hoa lễ hội |
| Mộc | rừng Tốn / Chấn, dược viên | Dần – Mão (3–7h) | linh dược hiếm (bán Y Quán ×6) |
| Kim | Càn / Đoài, mạch mỏ sâu | Thân – Dậu (15–19h) | mạch kim tinh, hợp đồng tiền trang |
| Thổ | Khôn / Cấn, công trường | Thìn, Tuất, Sửu, Mùi | thầu xây lại công trình lớn, môi giới biệt phủ |

- Mỗi người 1 nhiệm vụ mệnh mỗi ngày (giờ thật). Thưởng ×3–6 lương ngày, có đồ hiếm.
- Có **chuỗi 7 ngày**: hoàn thành đủ thì mở «đặc quyền» theo hành: hợp đồng dài hạn, nghề hiếm, giảm giá tài sản.
- Gợi ý được cài vào lời NPC và Bia Vận Mệnh. Người chơi phải **thấu hiểu bản mệnh** mới tìm ra (đúng tôn chỉ GDD).

### 14.1.7 Thăng tiến nghề

| Cấp | Tay nghề | Mở |
|---|---|---|
| Học việc | 0 | việc dễ, ×0,8 |
| Thợ | 100 | việc thường |
| Thợ cả | 400 | việc khó, dạy học việc (+5% tiền của họ) |
| Quản sự | 1.200, uy tín ≥ 60, **không phải nghề Kỵ** | điều ca, +3% doanh thu tiệm |
| Chủ tiệm | 3.000, sở hữu nhà phố từ cấp 2 trở lên | mở tiệm riêng trong nhà mình, tự thuê người (người chơi hoặc NPC) |

- Tay nghề mỗi việc = 1 × hệ số Hỷ (×1,6) × hiệu suất.
- Lý lịch nghề gồm: uy tín (0–100), số ca, số lần phạt. NPC chủ tiệm đọc lý lịch này (§21.3.3).

## 14.2 Thuê người — chỗ làm có hạn

> **Trạng thái:** `[ĐÃ CÓ]` (P2, mở rộng ở P7). Mục 14.2.4 là ghi chú thi công của đợt đầu; phần mới hơn ở §14.3.

### 14.2.1 Số chỗ mỗi tiệm (máy chủ giữ)

| Loại tiệm | Số tiệm | Chỗ / tiệm (Học việc · Thợ · Thợ cả · Quản sự) |
|---|---|---|
| Tửu lâu `tuu` | 4 | 3 · 3 · 1 · 1 = **8** |
| Dịch trạm `dichtram` | 8 | 2 · 3 · 1 · 1 = 7 |
| Trà lâu `tralau` / Trà trang `tratrang` | 3 / 3 | 2 · 2 · 1 · 1 = 6 |
| Dược Phòng `duoc` | 4 | 2 · 2 · 1 · 1 = 6 |
| Lò rèn `loren`, Mộc `moc`, Gốm `gom` | 3 / 3 / 3 | 2 · 2 · 1 · 0 = 5 |
| Hoa viên, Thư họa, Đèn, Hương, May, Phong thủy | 4 / 4 / 2 / 2 / 1 / 2 | 1 · 2 · 1 · 0 = 4 |
| Nha Môn Địa Ốc | 1 | 2 · 4 · 2 · 1 = 9 |
| Điểm ngoài trời (mỏ dân sự, bến đò, rừng, công trường) | — | không giới hạn chỗ; giới hạn theo **mỏ / bến còn hàng** |

Tổng ≈ 270 chỗ trong tiệm mỗi shard. Shard có 60 người, nên thiếu chỗ ở tiệm ngon (tửu lâu), phải cạnh tranh hoặc đi nghề ngoài trời.

### 14.2.2 Ca làm

- Xin việc qua bảng **«Chiêu công»** trước cửa tiệm hoặc nói chuyện với chủ tiệm (§21.3).
- Nhận vào thì giữ **chỗ** tối đa 3 ngày; mỗi ngày phải làm ít nhất 1 ca, nếu không mất chỗ và trừ uy tín.
- Bấm **«Vào ca»** thì giữ chỗ đứng trong 30 phút, **«Tan ca»** thì nhận tổng tiền và tóm tắt.
- Bỏ ca giữa chừng: chỉ nhận 50%, uy tín −5.
- Chỗ trống thì có **NPC làm thay** (tiệm vẫn có người, thế giới không chết).
- Người chơi giỏi có thể **thay thế NPC**: chủ tiệm cân nhắc theo lý lịch.
- Tiệm do **người chơi làm chủ** (cấp Chủ tiệm): chủ tự đặt lương theo sản phẩm (trong khung sàn và trần) và tự duyệt đơn. Máy chủ giữ hợp đồng.

### 14.2.3 Dữ liệu máy chủ (Durable Object `Guild`, một bản mỗi shard)

```
slot   { shop, rank, seat, holderU | null, since, lastShift }
shift  { u, shop, start, tasks:[{t, perf, pay, risk}], end }
career { u, job, skill, rank, rep, fines, shifts }
```

**Gói trong `protocol.js` (đã làm ở P2):**
- `job_me`, `job_board {k}`, `job_apply {k, r, y}`, `job_renew`, `job_quit`, `job_start {job, k?, y}`, `job_task {seed, sc, node?, wl?, wl30?, sk?}`, `job_end`, `job_claim`, `job_ores`, `job_log`
- máy chủ trả `job_res {q, ok, err?, …}`. `y` = Dụng / Hỷ / Kỵ thần (chỉ hành, không ngày sinh); `sc` = điểm mini-game 0–1.

### 14.2.4 Đã làm ở P2 và chỗ khác đặc tả

**Mã:** `jobs.js` (luật thuần), `guild-core.js` (sổ máy chủ, thuần — chạy trong worker và trong test), `worker/guild.js` (DO), `work.js` (bảng Chiêu công, ca, huy hiệu ca), `work-games.js` (mini-game), `jobplaces.js` / `jobplaces3d.js` (mỏ dân sự), `roomgrid.js` (lưới phòng dùng chung client / máy chủ). Test: `scripts/test-game-jobs.mjs` (17), thêm 3 bước Guild vào `scripts/test-quan-mmo.mjs`.

| Nghề | Nơi | Mini-game | Thời gian tối thiểu |
|---|---|---|---|
| Đầu bếp tửu lâu (Hỏa) | 4 tửu lâu | canh lửa 3 món, giữ kim nhiệt trong vùng xanh | 20 giây |
| Phu dịch trạm (Thủy) | 8 dịch trạm | áp kiện sang trạm kế bên; điểm theo thời gian so với đi bộ; không cưỡi ngựa trạm, không ngự kiếm | quãng đường ÷ 12 m/s |
| Bốc thuốc (Mộc) | 4 Dược Phòng | nhớ toa 4 vị, bốc đúng ngăn trong tủ 12 ngăn | 14 giây |
| Thợ mỏ (Kim) | Mỏ Dân Sự Khoáng Sơn (xe goòng ở 3 Lò Rèn), không giới hạn chỗ | 3 nhát búa vào điểm ngọt; 10 mạch, mỗi mạch 3 lần, 4 phút hồi 1 | 8 giây |
| Thợ gốm (Thổ) | 3 Lò Gốm | bàn xoay 6 vòng, tâm hẹp dần | 16 giây |

- **Lương:** `base × hiệu suất × hệ số mệnh × hệ số bậc × cung (+10%) × bệnh`, đúng §13.3.3. Học việc, mệnh bình thường, làm trung bình: 2 ca × 8 việc ≈ 80–85 đồng (test cân bằng). Ví dụ một việc: bếp 6,5 · phu 7,5 · bốc thuốc 6 · mỏ 6,5 · gốm 6,5 đồng ở hiệu suất 1,0.
- **Ca:** tối đa 8 việc trong 30 phút; tan ca trước giờ với dưới 4 việc là bỏ ca (nửa tiền, uy tín −5); ca trọn uy tín +1. Rớt mạng thì máy chủ tự đóng ca khi hết giờ, tiền chờ nhận một lần (`job_claim`).
- **Chống gian (máy chủ):** mã việc (seed) do máy chủ cấp; chặn nộp nhanh hơn thời gian tối thiểu; kiểm vị trí bằng toạ độ máy chủ biết (đứng trong tiệm / đúng trạm đích / cạnh mạch quặng); nhịp 6 việc lệch nhau dưới 0,12 giây → không tính, ghi cờ; 8/10 việc điểm tuyệt đối → kẹp 0,85, ghi cờ.
- **Khác đặc tả, cần biết:**
  - **Một DO `Guild` toàn cục** (như `Estate`), không phải một bản mỗi shard: mọi phòng shard thấy cùng một thành, cùng chỗ làm.
  - **Thêm trần 3 ca / ngày** (giờ Việt Nam) trên máy chủ, vì Tỉnh còn tính trên máy nên máy chủ chưa dựa được vào Tỉnh.
  - **«Hái thuốc» làm thành «Bốc thuốc» trong tiệm** ở đợt 1; đi rừng hái thuốc để sau.
  - **Chưa có hệ số giờ hoàng đạo và ngày can chi** trên máy chủ (cần lịch âm trong worker); cung tiệm +10% thì đã có.
  - **Khách (pid) vẫn xin được chỗ** cho tới khi `accounts-v1` được deploy; sau đó nên chỉ cho tài khoản đăng nhập giữ chỗ trong tiệm (khách vẫn xuống mỏ được).
  - **Ví tiền vẫn ở máy:** máy chủ chỉ ghi sổ tiền công (`l:<u>:<id>`) và client cộng đúng số được trả. Chuyển hẳn ví lên máy chủ ở P8.
  - **Gánh nước** vẫn là việc vặt chấm trên máy, không cần chỗ làm, để mất mạng vẫn có đường kiếm sống.
  - **Dụng thần khai báo** bị khoá 30 ngày trên máy chủ (§31.2.3): lần đầu nhận ngay, đổi lại phải chờ.

## 14.3 Phần đang chạy thêm hoặc khác đặc tả

`[ĐÃ CÓ]` Lấy từ nhật ký 11/11 và mã; khi lệch với §14.1–§14.2 thì mục này và [A3](phu-luc/A3-so-lieu.md) thắng.

| Điểm | Đang chạy |
|---|---|
| **Số nghề** | 31: đủ 30 nghề của §14.1.2 cộng nghề cân trà. 16 nghề gắn với loại tiệm (`jobs.JOB_OF_SHOP`), 15 nghề làm theo khu ngoài tiệm (`jobzones.zones()`): kép hát, giữ lò đan, pháo hoa, lái đò, ngư phủ, buôn muối, ủ rượu, tiều phu, kim hoàn, thu ngân Tiền Trang, bảo tiêu, nha dịch, thợ xây, nông phu, thợ đá |
| **Nghề theo khu** | không giữ chỗ; máy chủ kiểm người chơi đứng trong khu cả lúc vào ca lẫn từng việc. Pháo hoa chỉ mở đêm rằm, 18–23 giờ |
| **Mini-game** | bốn trò (`work-games.GAME_KINDS`) dùng lại cho mọi nghề với bộ thẻ và lời dẫn riêng |
| **Sổ việc làm** | một Durable Object `Guild` cho cả thế giới, không phải mỗi phòng một bản (MT-10) |
| **Số tiệm đổi** | từ thành v4, số tiệm và thứ tự đổi; mỗi lần đổi phải nâng `guild-core.LAYOUT_VER`, chỗ đang giữ theo khoá cũ được trả lại, tay nghề và uy tín giữ nguyên (LN-12) |
| **Dụng thần khai với máy chủ** | khoá 30 ngày; lần đầu nhận ngay (QĐ-30). Đầu thai là ngoại lệ (§18.5.4) |
| **Gánh nước** | việc vặt chấm trên máy, không cần máy chủ, để mất mạng vẫn có đường sống |
| **Nhiệm vụ mệnh** | 15 nhiệm vụ (`fatequest.QUESTS`), ba cho mỗi hành. Cột sáng chỉ người đúng mệnh thấy trong 60 m. Làm xong mở **đặc quyền vĩnh viễn theo hành** (`fatequest.PERK`): thuyền, đồ ăn, thuốc, Tiền Trang hoặc nhà |
| **Quý nhân** | sự kiện lành của vận số ngày tăng tiền công (§18.3) |
| **Vận khí** | cấp 2 trở lên giảm rủi ro lao động (§18.2.3) |

## 14.4 Chưa có hoặc cần đối chiếu `[MỘT PHẦN]`

- **Hệ số giờ hoàng đạo và ngày can chi trên máy chủ** (§14.2.4): cần xác nhận → `VC-014`.
- **Thay thế NPC, tiệm do người chơi làm chủ tự đặt lương** (§14.2.2): tiệm người chơi đang đi qua mặt bằng ở §17.4; chưa có luồng «chủ tiệm tuyển người chơi» → theo dõi cùng `VC-027`.
- **Lý lịch nghề được NPC chủ tiệm đọc** (§14.1.7): trí nhớ NPC có ở §21.3.3; cần kiểm nó có nhận sự kiện bỏ ca không.

## 14.5 Liên kết với hệ khác

| Hệ | Trao đổi | Chương |
|---|---|---|
| Mệnh | Dụng / Hỷ / Kỵ thần, chỉ gửi **hành**, không gửi ngày sinh | §11, LN-01 |
| Đời sống | lương vào ví; hao Tỉnh, No; bệnh giảm 70 % hiệu suất | §13 |
| Thế giới | loại tiệm, vị trí tiệm, khu làm việc, cung của tiệm | §10 |
| Máy chủ | gói `job_*`, kiểm vị trí, thời gian tối thiểu, nhịp đều | §31, [A4](phu-luc/A4-giao-thuc.md) |
| Ẩm thực | món cao lương cho «No khí» tăng hiệu suất | §17.2.1 |
| Huyền học | ca trọn sinh Âm Đức; bỏ ca, gian lận sinh Nghiệp Lực | §18.1 |
| Pháp môn | Bách Nghệ tăng tay nghề nghề hợp mệnh | §18.4.2 |

## 14.6 Kiểm thử và nghiệm thu

- `test-game-jobs` (18 ca): hệ số mệnh, trần chỗ, luật ca, chống treo máy, cân bằng hai ca ≈ một ngày sống.
- `test-game-fate` (6 ca): chỉ người đúng mệnh, đúng giờ, đúng chỗ mới thấy.
- Thêm một nghề: thêm vào `jobs.js`, gắn loại tiệm hoặc khu, thêm ca kiểm cân bằng; lương cơ sở không vượt mức trần đang dùng cho mọi nghề.

## 14.7 Việc còn mở

`VC-014` · `VC-027` · `VC-013` (lương vào ví trên máy chủ).
