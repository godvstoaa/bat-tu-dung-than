# 10 · Phần 07 — Thiên Bảng: bảng xếp hạng, mùa, chống gian lận

> Căn cứ: canon §5 (Đạo Hạnh, Hệ số Nghịch Thiên, cảnh giới), §7 («Không bán Đạo Hạnh, cảnh giới, công đức»); bản sơ đồ §5 («Cảnh giới (§9) và Thiên Bảng Đạo Hạnh»), §9.2 («Một tháng âm: Thiên Bảng chốt»; «Một năm can chi: Mùa»), §11 («Không bán: Ưu tiên trên Thiên Bảng Đạo Hạnh»), §13.5, §14 («Thiên Bảng xếp theo Đạo Hạnh»); `GAME-MMO-PROMPT-PLAN.md` §B2 («Giải Tiết Khí — giải đấu 24 lần/năm theo tiết khí thật»), P3 («xếp hạng không gian lận từ client»); `protocol.js` P3: `solve {slot, date, ans}` → `graded {slot, total, results, points, season, me}`, `lb {}` → `lb {season, top[], phai[], me}`, `PHAI = { tubinh, manh, trichthien, cungthong }`.
>
> Mã bảng: `GUILD-LB-xx` (tài liệu 10 chỉ được cấp `GUILD-*`, `EV-*`). Mã mùa `SEASON-xx` do tài liệu 11 cấp; ở đây chỉ định nghĩa **cách tính kỳ**.

## 7.0 Xếp cái gì, không xếp cái gì

| Được xếp | Không bao giờ xếp |
|---|---|
| Đạo Hạnh **kiếm trong kỳ** (Hậu Thiên) | Tiềm Lực, Phẩm căn, Phúc phận, Mệnh Cấp, Mệnh Cách (Tiên Thiên) |
| Kỹ năng luận giải (giải án, Án Cổ, khoa cử) | Tổng Ngọc đã nạp, số đồ Tàng Y Các, VIP |
| Tinh tiến (so với chính mình) | Công đức dưới dạng **thứ hạng** (chỉ có bia theo ngưỡng — §7.1.9) |
| Đóng góp chung (sự kiện, sửa đường) | Số đạo hữu, số đệ tử, «độ nổi tiếng» |
| Chi đường: Đạo Vọng, hợp tác | Kích thước tông môn (tông nào đông hơn) |

**Vì sao không xếp công đức.** Liễu Phàm và `CONG_QUA` coi «làm thiện ẩn» là thiện cao (+2). Một bảng thứ hạng công đức sẽ biến việc thiện thành cuộc đua khoe — đi ngược chính điều game dạy. Công đức chỉ có **bia ngưỡng** tự nguyện (ai vượt ngưỡng thì có tên, xếp theo chữ cái, không thứ hạng).

**Vì sao không xếp Tiên Thiên.** Trụ cột T2 và chỉ số thành công §13.5 (người lá số thấp không bỏ game nhiều hơn). Một bảng «lá số đẹp nhất» là thông điệp «mệnh đã định».

---

## 7.1 Danh mục bảng

### 7.1.1 Tổng quan

| Mã | Tên | Đối tượng | Kỳ | Hiện |
|---|---|---|---|---|
| `GUILD-LB-01` | **Thiên Bảng Đạo Hạnh** | người | mùa (năm can chi) | top 100 + vị trí của mình + đạo hữu |
| `GUILD-LB-02` | **Tinh Tiến Bảng** | người | mùa | top 100 + mình |
| `GUILD-LB-03` | **Giải Tiết Khí** | người | 24 kỳ / năm | top 100 + mình + học phái |
| `GUILD-LB-04` | **Án Cổ Bảng** | người | mùa | top 50 + mình |
| `GUILD-LB-05` | **Khoa Bảng** | người | mỗi khoa (3 khoa / mùa) | danh sách đỗ theo ngưỡng + Tam khôi (3 người cao nhất) |
| `GUILD-LB-06` | **Đạo Vọng Bảng** | chi đường | tháng âm + mùa | top 50 mỗi tông + toàn máy chủ |
| `GUILD-LB-07` | **Hội Thiện Bảng** | chi đường | mùa | top 50 |
| `GUILD-LB-08` | **Hành Hương Ký** | người | mùa | không thứ hạng: huy hiệu theo mốc km |
| `GUILD-LB-09` | **Công Đức Bia** | người | mùa | theo ngưỡng, chữ cái, tự nguyện |
| `GUILD-LB-10` | **Tông Môn Đồ** | tông | tháng âm | biểu đồ tỷ lệ tham gia, không thứ hạng |
| `GUILD-LB-11` | **Bia Sự Kiện** | người, chi đường | mỗi sự kiện máy chủ | mọi người đạt ngưỡng (Phần 08) |
| `GUILD-LB-12` | **Học Phái Bảng** | học phái (Tử Bình / Manh Phái / Trích Thiên / Cùng Thông) | 24 kỳ tiết khí | xếp 4 học phái (đã có trong `lb.phai[]`) |

### 7.1.2 `GUILD-LB-01` Thiên Bảng Đạo Hạnh

- **Chỉ số:** `ĐH_mùa` = tổng Đạo Hạnh **đã xác thực** kiếm được trong mùa (§7.4.2), đã nhân Hệ số Nghịch Thiên (canon) như mọi nguồn.
- **Không** dùng tổng Đạo Hạnh tích lũy đời: người mới mùa này có thể đứng đầu.
- **Điều kiện xuất hiện:** cảnh giới ≥ 2, danh tính bền, không tắt «hiện trên Thiên Bảng».
- **Hòa điểm:** người đạt điểm đó **sớm hơn** đứng trên.
- **Thưởng cuối mùa** (chỉ thẩm mỹ, §7.6).

**Vì sao hệ số Nghịch Thiên đủ công bằng.** Với `hệ_số = clamp(1 + (60 − Tiềm Lực)/100, 1,0, 1,5)`: lá số Tiềm Lực 30 kiếm Đạo Hạnh ×1,3 so với lá số 60+. Cùng thời gian tu, người lá số thấp **đứng trên**. Đây là thông điệp T2 hiện thành con số: «lá số thấp có lợi thế tu». Bảng không ghi Tiềm Lực ai, nên không ai biết ai được hệ số bao nhiêu.

### 7.1.3 `GUILD-LB-02` Tinh Tiến Bảng

- **Chỉ số:** `TT = ĐH_mùa_này / max(ĐH_mùa_trước, 200)` (với người mới: mẫu số 200).
- Xếp người tiến bộ nhiều nhất **so với chính mình**. Người chơi lâu năm, tu đều thì TT ≈ 1; người mới hoặc người quay lại cố gắng thì TT cao.
- Chỉ xét người có `ĐH_mùa_này ≥ 300` (tránh nhiễu số nhỏ).
- **Huy hiệu tùy chọn «Nghịch Thiên»:** người có Tiềm Lực < 46 (đúng ngưỡng persona Vân Cốc của trang chính) **có thể tự bật** huy hiệu bên tên trên bảng này. Mặc định tắt (bật = công khai một thông tin lá số, Phần 05 §5.2). Lời mời bật hiện một lần, câu của Vân Cốc: «Con muốn người khác thấy con đi từ đâu tới đâu không? Không muốn cũng được.»

### 7.1.4 `GUILD-LB-03` Giải Tiết Khí

- **Kỳ:** từ giờ giao tiết khí này tới tiết khí kế (≈ 15 ngày). Mốc tiết khí lấy từ `lunar-javascript › Lunar.getJieQiTable()` (đã dùng trong game: `stations.js › getPrevJieQi`). Ví dụ năm âm 2026: Lập Đông 2026-11-07, Tiểu Tuyết 2026-11-22, Đại Tuyết 2026-12-07, Đông Chí 2026-12-22 (đã chạy thử thư viện).
- **Chỉ số:** tổng điểm **án khách** đã chấm ở máy chủ trong kỳ (gói `solve` → `graded.points`), tối đa 3 án/ngày (đúng `CASES_PER_DAY = 3`), mỗi án tối đa 15 điểm (`CASE_REWARD.npcMax`).
  - Trần lý thuyết một kỳ 15 ngày: 15 × 3 × 15 = **675 điểm**. Bảng xếp theo **độ chính xác**, không theo thời gian chơi dài.
- **Học phái:** mỗi người chọn một học phái trong `PHAI` (Tử Bình, Manh Phái, Trích Thiên, Cùng Thông — bản sắc **luận mệnh**, khác tông môn tu đạo). `GUILD-LB-12` cộng điểm trung bình (không phải tổng) của thành viên mỗi học phái → học phái ít người không bị thiệt.
- **Hòa điểm:** tổng thời gian trả lời ngắn hơn đứng trên (thời gian máy chủ đo từ lúc phát đề tới lúc nhận `solve`).

### 7.1.5 `GUILD-LB-04` Án Cổ Bảng

- **Chỉ số:** tổng điểm cao nhất của mỗi Án Cổ (36 án dùng được trong 38 — `GAME-MMO-PROMPT-PLAN.md` P2), mỗi án chỉ tính lần cao nhất trong mùa.
- Án Cổ có đáp án từ sách nên dễ tra; vì vậy bảng **chỉ tính lần đầu giải mỗi án trong mùa** khi giải trong CaseRoom có ≥ 2 người (máy chủ chấm) **hoặc** khi giải đơn mà thời gian ≥ 90 giây/bước trung bình (chống chép đáp án nhanh). Giải đơn quá nhanh vẫn được thưởng cá nhân như cũ, chỉ không vào bảng.

### 7.1.6 `GUILD-LB-05` Khoa Bảng

- **Khoa:** 3 khoa / mùa — Hương thí (sau Lập Xuân + 30 ngày), Hội thí (Hạ Chí ± 7 ngày), Đình thí (Thu Phân ± 7 ngày). Hoạt động khoa cử do tài liệu 09 thiết kế; bảng chỉ định nghĩa xếp.
- **Đỗ:** đạt ngưỡng điểm (60% Hương, 70% Hội, 80% Đình) → tên vào **Bảng Vàng Giấy** của khoa (không giới hạn số người đỗ).
- **Tam khôi** (danh hiệu trò chơi): 3 người điểm cao nhất Đình thí; hòa thì cùng đứng.
- Nhắc lại Phần 03 §3.4.9: không khắc tên lên bia đá.

### 7.1.7 `GUILD-LB-06` Đạo Vọng Bảng (chi đường)

- **Chỉ số tháng:** Đạo Vọng kiếm trong tháng âm, **chia cho căn bậc hai số thành viên hoạt động**: `ĐV_chuẩn = ĐV_tháng / √(max(n_hoạt_động, 8))`.
  - Lý do: chi đường 30 người không tự nhiên thắng chi đường 10 người; nhưng cũng không chia hẳn theo đầu người (để chi đường lớn vẫn có lý do lớn).
- **Chỉ số mùa:** tổng 12 (hoặc 13 nếu năm nhuận) tháng `ĐV_chuẩn`.
- Hiện theo tông (mỗi tông một bảng) và toàn máy chủ.
- Bảng ở tầng 2 Lầu Danh Bộ mỗi thánh địa (Phần 01 §1.8.1).

### 7.1.8 `GUILD-LB-07` Hội Thiện Bảng

- **Chỉ số:** `HT = số_dự_án_hoàn_thành_có_tham_gia × (1 + 0,25 × số_chi_đường_khác_tông_đã_cùng_làm)`.
- Xếp chi đường **biết hợp tác** cao hơn chi đường làm một mình.

### 7.1.9 `GUILD-LB-09` Công Đức Bia

- **Ngưỡng mùa** (theo mốc Liễu Phàm trong game, canon §6 — 300 / 600 / 1.000 công): bia ba tầng «Tiểu Thiện», «Trung Thiện», «Đại Thiện».
- Ai vượt ngưỡng **và bật đồng ý** thì tên tu hiện ở tầng tương ứng, **xếp theo chữ cái**.
- Mặc định **không hiện**. Người không hiện được đếm vào dòng chữ cuối bia: «… và {N} người làm thiện không ghi tên.» — con số này luôn lớn và là phần đẹp nhất của bia.
- Bia đặt ở Bút Tháp (Tịnh Độ) và Văn Miếu (Nho — Liễu Phàm), công trình tài liệu 07.

### 7.1.10 `GUILD-LB-10` Tông Môn Đồ

- **Không xếp hạng tông.** Mỗi tháng âm, một biểu đồ cho mỗi tông: tỷ lệ thành viên dự ≥ 1 tông lễ, tỷ lệ thành viên có Đạo Hạnh mới, số chi đường hoạt động.
- Lời bình của NPC chưởng giáo chọn theo xu hướng (tăng / giữ / giảm) — **không** bao giờ so với tông khác.

---

## 7.2 Mùa và các kỳ

### 7.2.1 Mùa = năm can chi

- **Mùa bắt đầu đúng giờ giao tiết Lập Xuân** (theo `lunar-javascript`), không theo mùng 1 Tết. Khớp với cách game tính năm Thái Tuế (`thaitue.js › suiYear`: «năm tính theo Lập Xuân»).
- Ví dụ: Mùa Đinh Mùi bắt đầu Lập Xuân 2027-02-04; Mùa Mậu Thân bắt đầu Lập Xuân 2028-02-04.
- Năm âm lịch 2028 có Tết 2028-01-26 **trước** Lập Xuân 2028-02-04 (chạy thử thư viện: `Lunar.fromYmd(2028,1,1).getYearInGanZhiByLiChun()` vẫn trả 丁未). Vì vậy **Tết thuộc mùa cũ** — sự kiện `EV-TET-01` năm đó là «Tết cuối mùa», còn `EV-LAPXUAN-01` mở mùa mới chín ngày sau. Ngược lại năm 2027: Lập Xuân 2027-02-04 **trước** Tết 2027-02-06, mùa mới mở trước Tết hai ngày. Giao diện luôn ghi rõ «Mùa mới bắt đầu từ Lập Xuân».

### 7.2.2 Các kỳ con

| Kỳ | Mốc | Bảng dùng |
|---|---|---|
| Mùa | Lập Xuân → Lập Xuân | 01, 02, 04, 07, 08, 09 |
| Tiết khí | giao tiết → giao tiết (24 / mùa) | 03, 12 |
| Tháng âm | mùng 1 → mùng 1 (tháng nhuận là một kỳ riêng) | 06, 10 |
| Khoa | 3 / mùa | 05 |
| Sự kiện | theo Phần 08 | 11 |

**Tháng nhuận:** năm có tháng nhuận (vd 2028 nhuận tháng 5 — `LunarYear.fromYear(2028).getLeapMonth() = 5`) có 13 kỳ tháng; Đạo Vọng mùa cộng 13 kỳ. Để công bằng giữa các mùa, mùa có tháng nhuận dùng **trung bình × 12**.

### 7.2.3 Chốt kỳ

- Bảng chốt **giờ Tý đầu ngày** sau mốc (00:00 giờ Việt Nam), sau **24 giờ giữ** để kiểm bất thường (§7.4.5), rồi mới công bố «chính thức».
- Trong 24 giờ giữ, bảng hiện «tạm» với dấu chấm hỏi nhỏ.
- **Tiền bối bảng:** bảng mùa cũ lưu vĩnh viễn ở Thư Lâu (`thulau`) — một gian «Lưu Bảng» đi vào được, kệ sách mỗi mùa một quyển. Người xóa tài khoản: tên thay bằng «một người tu».

---

## 7.3 Nguồn điểm và độ tin cậy

Hiện trạng quan trọng: **toàn bộ tiến trình chơi đơn nằm trên máy người chơi** (`state.js › KEY = 'huyenquan:v1'` trong `localStorage`, `loadState` / `saveState`). Mọi con số người chơi gửi lên đều sửa được. Bảng chỉ đáng tin nếu điểm đến từ **sự kiện máy chủ thấy được**.

### 7.3.1 Phân loại nguồn Đạo Hạnh

| Nguồn | Máy chủ thấy? | Loại | Tính vào bảng |
|---|---|---|---|
| Án khách chấm ở máy chủ (`solve` → `graded`) | có (máy chủ tự dựng án từ hạt giống ngày · khe · người chơi và chấm bằng engine) | **xác thực** | 100% |
| Án hợp tác CaseRoom | có | xác thực | 100% |
| Lễ tông / đường lễ (SectHall thấy pha, thao tác, vị trí) | có | xác thực | 100% |
| Đồng tu (máy chủ phát nhịp, nhận pha thở) | có (một phần — pha do client báo) | **bán xác thực** | 100% nhưng có trần ngày (Phần 04 §4.2.3) |
| Sự kiện máy chủ | có | xác thực | 100% |
| Việc tuần chi đường | có (đếm qua máy chủ) | xác thực | (không cấp Đạo Hạnh trực tiếp) |
| Tĩnh tọa một mình online | client báo, máy chủ thấy thời lượng phiên | bán xác thực | 100%, trần ngày 30 |
| Chuỗi tu `CQ-*`, Mệnh Đồ, sảnh nghề **khi online** | client tính, gửi «biên nhận» (§7.3.2) | **có biên nhận** | 100% nếu biên nhận hợp lệ |
| Mọi thứ làm **khi offline** | không | **chưa xác thực** | tối đa **30%** tổng `ĐH_mùa` trên bảng |

Giải thích cho người chơi (trong Sổ Mệnh › Thiên Bảng): «Đạo Hạnh tu khi không có mạng vẫn là của bạn, vẫn mở cảnh giới. Trên Thiên Bảng, phần đó chỉ tính tối đa 30% để bảng công bằng.»

### 7.3.2 Biên nhận việc làm (receipt)

Với hoạt động client tự chấm khi đang online (vd sảnh nghề, mini-game tu): client gửi gói `rcpt` (Phần 11) gồm `{act, seed, input, result, t0, t1}`. Máy chủ:

1. kiểm `act` là hoạt động có bản chấm được ở máy chủ (engine thuần JS chạy được trong worker — kế hoạch P3 đã nêu);
2. dựng lại đề từ `seed` (hạt giống do **máy chủ** cấp khi mở hoạt động — gói `act_open`), chấm lại `input`, so với `result`;
3. kiểm `t1 − t0` trong khoảng hợp lý (không nhanh hơn giới hạn người);
4. hợp lệ → ghi Đạo Hạnh xác thực vào Sổ Đạo Hạnh máy chủ.

Hoạt động **không** chấm lại được ở máy chủ (vd mini-game nhịp thuần cảm giác) → biên nhận chỉ kiểm thời lượng + giới hạn ngày → «bán xác thực».

---

## 7.4 Chống gian lận

### 7.4.1 Mô hình đe dọa

| Kẻ gian | Cách | Chặn bằng |
|---|---|---|
| Sửa `localStorage` tăng Đạo Hạnh | sửa `state` | bảng không đọc `state`; chỉ đọc Sổ Đạo Hạnh máy chủ |
| Gửi `solve` với đáp án tra sẵn | dùng engine app chạy riêng để tính đáp án rồi gửi | **không chặn tuyệt đối** — engine là mã công khai trong app; giảm thiểu: (a) trần 3 án/ngày, (b) đo thời gian từng bước, (c) đề có thẻ nhiễu, (d) bảng xếp theo chính xác nên người giỏi thật vẫn đạt 100% — kẻ gian chỉ «bằng» người giỏi, không vượt |
| Bot đồng tu | client giả báo pha thở hoàn hảo | trần ngày; pha thở người thật có nhiễu — chuỗi pha **quá đều** (độ lệch chuẩn < ngưỡng) bị gắn cờ |
| Nhiều tài khoản cày cho một chi đường | — | Đạo Vọng chuẩn hóa theo `√n`; danh tính bền; cụm thiết bị |
| Đổi giờ máy để cày ngày | — | máy chủ dùng giờ máy chủ cho mọi «ngày» tính bảng |
| Phát lại gói (replay) | gửi lại `rcpt` cũ | `seed` dùng một lần; máy chủ ghi `seed` đã tiêu |
| Đẩy hàng loạt `mv` để «đi bộ» nhanh (Hành Hương Ký) | — | tốc độ tối đa: đi bộ 3,5 ô/giây ≈ 5,6 m/s (hằng số trong `net.js › tick`: `3.5 * 1.35 * dt` cho nội suy) — quãng chỉ tính khi tốc độ ≤ 6 m/s, `a = 0` (không bay), và không «nhảy» > 4 ô (ngưỡng teleport của `protocol.js › approach`) |

### 7.4.2 Sổ Đạo Hạnh máy chủ

- Bảng D1 `dh_ledger` (Phần 12): mỗi dòng một lần ghi `{uid, src, amount, verified, ref, at}`; `src` ∈ {`case`, `coop`, `rite`, `cotu`, `event`, `rcpt`, `offline`}.
- `ĐH_mùa` (bảng) = Σ `verified` trong mùa + min(Σ `offline` + Σ bán xác thực vượt trần, 0,3 × tổng).
- Client **đồng bộ phần offline** khi online lại bằng gói `dh_sync {sum, since}`: máy chủ chỉ ghi dưới dạng `offline`, không kiểm được chi tiết.

### 7.4.3 Phát hiện bất thường (chạy mỗi đêm)

| Kiểm | Ngưỡng | Hành động |
|---|---|---|
| Điểm Giải Tiết Khí 100% ở **mọi** án ≥ 10 ngày liên tiếp **và** thời gian trả lời < 20% trung vị | — | đưa vào danh sách xem tay; tạm ẩn khỏi top 100 |
| Đạo Hạnh xác thực / ngày vượt bách phân vị 99,9 của cùng cảnh giới | — | xem tay |
| Pha thở đồng tu có độ lệch chuẩn < 0,02 vòng trong ≥ 30 phút | — | loại phần đồng tu của phiên đó khỏi bảng |
| ≥ 3 tài khoản cùng cụm thiết bị cùng có mặt top 100 | — | xem tay |
| Đạo Vọng chi đường tăng > 5 lần trung vị tông trong 1 tuần | — | xem tay |

### 7.4.4 Biện pháp

| Mức | Biện pháp | Ai |
|---|---|---|
| 1 | Loại một phần điểm (phiên/ngày nghi vấn) khỏi bảng | tự động hoặc người |
| 2 | Ẩn khỏi bảng một kỳ | người |
| 3 | Cấm vào bảng một mùa | người |
| 4 | Biện pháp kiểm duyệt (Phần 05 §5.4.3) nếu kèm hành vi khác | người |

**Không bao giờ trừ Đạo Hạnh cá nhân, không hạ cảnh giới** vì nghi gian lận bảng: cảnh giới là tiến trình của người chơi; bảng là chuyện công khai. Người bị xử lý được khiếu nại (Phần 05 §5.5).

### 7.4.5 Giữ 24 giờ và xem tay top

- Mọi bảng kỳ: 24 giờ giữ trước khi chính thức.
- Top 10 mỗi bảng người: người kiểm duyệt **xem tay** trước khi phát thưởng mùa (khối lượng nhỏ: 12 bảng × 10).

---

## 7.5 Hiển thị

### 7.5.1 Nơi xem trong thế giới

| Nơi | Bảng |
|---|---|
| **Thiên Bảng Đài** (Huyền Thành; công trình đi vào được, tài liệu 07 cấp mã) | 01, 02, 03, 12 — bia lớn ba mặt, đứng gần là đọc được; tầng trong có bàn tra |
| Lầu Danh Bộ (mỗi thánh địa, tầng 2) | 06 (tông đó), 07, 10 |
| Bút Tháp, Văn Miếu | 09 |
| Văn Miếu (Bảng Vàng Giấy) | 05 |
| Thư Lâu — gian Lưu Bảng | các mùa cũ |
| Công trình công cộng vừa sửa | 11 |

Mọi bảng cũng xem được trong Sổ Mệnh › Thiên Bảng.

### 7.5.2 Một dòng trên bảng hiện gì

`{hạng} · {tên tu hoặc tên} · {biểu tượng tông (nếu không ẩn)} · {chỉ số} · {huy hiệu tùy chọn}`

**Không bao giờ hiện:** Phẩm căn, cảnh giới (trừ khi người đó bật hiện cảnh giới), chi đường của người nhóm tuổi T (tránh tìm ra nhóm của trẻ), vùng đang ở.

### 7.5.3 Tùy chọn của người chơi

- «Hiện trên Thiên Bảng»: bật mặc định với nhóm A, **tắt mặc định với nhóm T** (bật được).
- Ẩn → vẫn thấy hạng của mình (riêng), người khác không thấy; hạng của người khác không bị dồn lên khi mình ẩn (mình được tính nhưng hiển thị «một người tu»).

---

## 7.6 Thưởng

| Bảng | Thưởng | Loại |
|---|---|---|
| 01 Thiên Bảng | top 1: khung tên «Thiên Bảng Đệ Nhất · {mùa}»; top 10: khung «Thiên Bảng Thập Kiệt»; top 100: khung «Thiên Bảng Bách Danh»; mọi người cảnh giới ≥ 3 có ≥ 1.000 ĐH_mùa: dải lụa «Tu Trọn Mùa» | khung tên (`frame`), dải lụa (`back`) — Tàng Y Các, không bán |
| 02 Tinh Tiến | top 100: vệt bước «Bộ Bộ Tinh Tiến» (một mùa) | `trail` |
| 03 Giải Tiết Khí | top 1 mỗi kỳ: tên tiết khí trên khung tên (vd «Quán quân Đông Chí»); 24 kỳ một mùa → bộ sưu tập «Nhị Thập Tứ Tiết» | danh xưng |
| 04 Án Cổ | giải đủ 36 án ≥ 60%: trâm «Cổ Án Trâm» | `head` |
| 05 Khoa | đỗ: danh xưng khoa (kèm «danh hiệu trò chơi»); Tam khôi: mũ «Hoa Quan» một mùa | danh xưng, `head` |
| 06 Đạo Vọng | top 3 tông mỗi tháng: cờ hiệu tháng cho cổng đạo tràng | đồ bày |
| 07 Hội Thiện | top 10: biển gỗ khắc «Hội Thiện {mùa}» | đồ bày |
| 08 Hành Hương | 100 / 500 / 1.000 km: gậy trúc, nón lá, dép cỏ (thẩm mỹ) | `hand`, `head` |
| 09 Công Đức Bia | không thưởng vật | — |
| 11 Bia Sự Kiện | theo sự kiện (Phần 08) | — |

**Không có thưởng nào** là Đạo Hạnh, công đức, Ngọc, hay tăng tốc độ tu. Phúc Khí thưởng tối đa 200 cho top 100 mỗi bảng mùa — tiền tiêu trong game, không ảnh hưởng tu.

## 7.7 Dữ liệu và tính toán

| Bảng D1 (Phần 12) | Nội dung |
|---|---|
| `dh_ledger` | sổ Đạo Hạnh máy chủ |
| `case_score` | điểm án đã chấm (kỳ tiết khí, học phái) |
| `lb_snapshot` | ảnh chụp bảng đã chốt `{board, period, rank, uid, value, at}` |
| `lb_flag` | cờ bất thường và quyết định |

- **Tính bảng:** Cron Trigger của Worker chạy mỗi 10 phút cập nhật bảng «trực tiếp» (truy vấn tổng hợp trên D1 có chỉ mục `(board_period, value DESC)`); chốt kỳ bằng Cron vào giờ Tý.
- **Gói `lb`:** mở rộng từ `lb {}` hiện có thành `lb {b, p?, scope?}` (Phần 11): `b` mã bảng, `p` kỳ (mặc định hiện tại), `scope` ∈ {`top`, `me`, `friends`, `sect`}. Phản hồi `lb {b, p, rows[], me?}`. Gói cũ `lb {}` = `lb {b: 'LB-03'}` để tương thích.

## 7.8 Checklist nghiệm thu Phần 07

- [ ] Không có bảng nào đọc giá trị từ `state` client gửi lên ngoài `dh_sync` (giới hạn 30%).
- [ ] `solve` chấm ở máy chủ cho kết quả trùng `cases.js` client trên 1.000 án ngẫu nhiên.
- [ ] Mùa mở đúng giờ Lập Xuân; test 2027 (Lập Xuân trước Tết) và 2028 (Tết trước Lập Xuân).
- [ ] Tháng nhuận 2028 (tháng 5) tạo kỳ riêng; Đạo Vọng mùa dùng trung bình × 12.
- [ ] Công Đức Bia: mặc định không hiện; dòng «… và N người không ghi tên» đúng.
- [ ] Huy hiệu Nghịch Thiên: chỉ hiện khi người chơi tự bật.
- [ ] Nhóm T: mặc định không hiện; không hiện chi đường.
- [ ] Phát hiện bất thường chạy trên dữ liệu giả lập có 1% kẻ gian: bắt ≥ 90% với dương tính giả ≤ 0,5%.
- [ ] Không thưởng nào là Đạo Hạnh / công đức / Ngọc.
