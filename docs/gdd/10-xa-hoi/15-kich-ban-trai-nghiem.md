# 10 · Phần 15 — Kịch bản trải nghiệm xã hội và ca biên cho QA

> Mục đích: ráp mọi hệ thống của Phần 01–14 thành **hành trình người chơi cụ thể** để (1) thiết kế kiểm tra tính nhất quán, (2) QA có kịch bản chơi tay từng bước với kết quả mong đợi, (3) đo các chỉ số trụ cột (Phần 13 §13.11.1).
>
> Năm nhân vật thử nghiệm (persona). Ngày giờ trong kịch bản giả định chu kỳ **Đinh Mùi 2027**; mùa mở Lập Xuân 2027-02-04 (Phần 07 §7.2.1). Ngày lễ lấy từ bảng Phần 09–10.

## 15.0 Năm nhân vật thử nghiệm

| Mã | Tên | Nhóm tuổi | Lá số (trên máy, không lên mạng) | Mục đích kiểm |
|---|---|---|---|---|
| `PS-1` | Lan | A (24) | Tiềm Lực 26 → Phàm Căn; Mệnh Cách Nghịch Thiên; hệ số Nghịch Thiên 1,34 | trụ cột T2: người lá số thấp vào xã hội không bị đánh giá |
| `PS-2` | Minh | A (38) | `MAU-A` (1990-05-15 08:30, nam): Tứ Linh Căn, điểm 41, Dụng Thủy / Hỷ Kim, tuổi Ngọ | lập chi đường, quản trị, khủng hoảng |
| `PS-3` | Bin | T (15) | bất kỳ | an toàn trẻ em |
| `PS-4` | Hải & Thu | A, A | hai lá số khác nhóm mệnh quái | đạo lữ, ba chế độ so |
| `PS-5` | «X» | A | — | kẻ khai thác |

Hệ số Nghịch Thiên của Lan: `clamp(1 + (60 − 26)/100, 1,0, 1,5)` = **1,34**. Của Minh: `1 + (60 − 41)/100` = **1,19**.

---

## 15.1 Hành trình của Lan (`PS-1`) — 30 ngày đầu mùa

| Ngày | Lan làm | Hệ thống phản hồi | Ghi dữ liệu | Kiểm |
|---|---|---|---|---|
| 1 (06/02, mùng 1 Tết) | lần đầu nối mạng | 5 màn `onb.mmo.*`; Lan chọn «Giữ màu» → áo theo Dụng thần; khai năm sinh → nhóm A (client chỉ gửi `ab: 'A'`) | D1 `account(ab='A')`, `profile` (tên) | T-P-10: không gói nào có năm sinh |
| 1 | đứng ở quảng trường Huyền Thành, nhận 8 bao Lộc Xuân | `toast.fest.today` «Hôm nay là Tết Nguyên Đán.» | — | — |
| 1 | lì xì 3 người lạ (chạm → «Lì xì») | người nhận mở bao: 6 / 8 / 18 Phúc Khí (máy chủ quay) | `gift_log` ×3 | Phần 05 §5.1.4: Lan không mất gì, không nhận vật chất |
| 1 | một người lì xì lại, kèm `tet.4` «Năm mới tu tiến nhé.» | `toast.lixi.got` | — | — |
| 2 | kết đạo hữu với «Hoa» (người vừa lì xì) | `toast.fr.ok` | D1 `friend` hai chiều | Phần 04 §4.6.1 |
| 3 | xem bảng đạo hữu | thấy Hoa: tên, tông «—», online, vùng «Huyền Thành» | — | không thấy Phẩm căn của Hoa (mức 0) |
| 5 | đọc Codex Tết, giải 3 án khách (Giải Tiết Khí kỳ Lập Xuân) | `graded` mỗi án; điểm vào `case_score` | `dh_ledger` src `case` verified | T-I-03… |
| 8 | đạt cảnh giới 2 (Đạo Hạnh nhân 1,34) | — | — | Phần 07 §7.1.2 |
| 8 | tới Bút Tháp, làm `GUILD-Q-TD-00` | 3 bước: niệm 108, phóng sinh đúng cách (từ chối mua cá của người bán), sám hối có việc sửa | `CONG_QUA` «Phóng sinh» +3 (sổ trong game) | Phần 03 §3.2.4: không mua được cá |
| 8 | lễ nhập tông với Ni sư Diệu Âm, chọn «Con chưa biết, con muốn thử.» | «Thử là thật thà. Thử đủ lâu thì thành tu.» | `profile.mon = 'TD'` | Phần 01 §1.3.3 |
| 8 | chọn pháp danh: «Diệu» + «An» → engine `analyzeName` chấm «nghịch Dụng» | câu nhắc: «Tên là một lớp trong Mệnh Đồ…»; Lan vẫn chọn «Diệu An» | `profile.tu = 'Diệu An'` | không bị trừ gì |
| 9 | Lầu Danh Bộ Bút Tháp, lọc «có lễ trong 3 ngày tới» | danh sách 7 Liên Xã | — | Phần 14 §14.2 |
| 9 | xin vào «Tịnh Liên Xã» (mở cửa, cảnh giới tối thiểu 2) | vào thẳng (cửa mở, còn suất 3/ngày) → `toast.sect.apply.ok` | `sect_member`, SectHall `member(rank 0)` | Phần 01 §1.5.4 |
| 10 (Chủ nhật, giờ Tuất) | dự Liên Đăng Niệm (tông lễ) | 4 pha; Lan lệch nhịp nhiều ở pha Hành → đèn của cả sân vẫn sáng đủ 7/9 tầng | Đạo Hạnh lễ +8 × 1,34 | Phần 03 §3.2.5: không ai biết đèn nào của ai |
| 10 | dự đường lễ đầu tiên «Phóng Sinh Hồ Sen» | dự đủ 4 pha | `rite_part(full=1)`; việc tuần `GUILD-Q-TD-01` +1 | — |
| 15 (20/02, Thượng Nguyên) | thắp đèn ở quảng trường, lời cầu «cho mẹ» | đại lễ `EV-DL-02` đạt mục tiêu → dải ngân hà | — | lời cầu không ai đọc được |
| 15 | giải 5 câu đố đèn | 5 dải lụa | — | — |
| 16 | hết 7 ngày Ký Danh (đã dự ≥ 1 lễ) | `toast.sect.rank.r1` | `member.rank = 1` | T-U-19 |
| 17 | Bảng Tìm Thầy: gửi `sd_req` tới «Quảng Tín» (cảnh giới 4, Liên Xã khác) | thầy nhận; lễ bái sư ở Trà Thất (2 bồ đoàn) | D1 `mentor` | cùng nhóm tuổi A |
| 18 | thầy giao bài: tầng Mệnh Đồ «Làm công» | `toast.sd.task` | — | thầy **không** thấy chẩn đoán `diagnosis` của Lan |
| 20 | giải án, bí bước «Vượng nhược»; thầy gửi `chi.3` «Xét đắc lệnh trước rồi hẵng tính.» | `toast.sd.hint` | — | ≤ 3 gợi ý / án |
| 24 | xong tầng Mệnh Đồ «Làm công» | `toast.sd.merit` tới thầy | `mentor_merit` +10 | trần 60/tuần |
| 26 | đồng tu 3 người ở Trà Thất (Lan, thầy, Hoa), đạt Đồng tâm | hệ số 1,26; `toast.cotu.sync` «Đồng tâm.» | `dh_ledger` src `cotu` | T-U-22 |
| 30 | mở Thiên Bảng › Tinh Tiến | Lan đứng thứ 37 (người mới: mẫu số 200) | — | Phần 07 §7.1.3 |
| 30 | lời mời bật huy hiệu Nghịch Thiên (Tiềm Lực < 46) | `dlg.lb.badge`; Lan chọn «Không hiện» | không đổi gì | huy hiệu chỉ khi tự bật |

**Kết luận kiểm cho PS-1:** suốt 30 ngày, không màn hình nào hiện Phẩm căn «Phàm Căn» của Lan cho người khác; Lan có 2 đạo hữu, 1 thầy, 1 chi đường, đứng trên Thiên Bảng — đúng mục tiêu §13.5 bản sơ đồ.

---

## 15.2 Minh (`PS-2`) — lập Pháp Đàn và một mùa quản trị

### 15.2.1 Lập đường

| Bước | Minh làm | Phản hồi / kiểm |
|---|---|---|
| 1 | cảnh giới 3, Chính Nhất 25 ngày, có danh tính bền | đủ điều kiện (Phần 01 §1.5.1) |
| 2 | Lầu Danh Bộ Long Hổ › «Lập chi đường mới» | Tri Khách đọc lệ phí; `dlg.found` |
| 3 | ghép tên «Thanh» + «Vân» + Pháp Đàn | trùng → «Tên này đã có đường dùng.»; đổi «Tùng» + «Hạc» → «Tùng Hạc Pháp Đàn» |
| 4 | mời 5 đồng khởi; 4 người ký trong 48 giờ, người thứ 5 là tài khoản 3 ngày tuổi | người thứ 5 bị từ chối «đồng khởi phải có tuổi tài khoản ≥ 7 ngày»; Minh mời người khác, ký trong hạn |
| 5 | lập xong: 6 thành viên, bậc 1, Minh là Đàn Chủ | `SectHall.init`; D1 `sect`; lệ phí trừ 2.000 Phúc Khí (tiêu hủy) |
| 6 | sau 7 ngày có 9 người | không «tạm đường» (đã ≥ 8) |

### 15.2.2 Tuần điển hình (tuần thứ 4)

| Khi | Việc | Ai | Kết quả |
|---|---|---|---|
| Thứ Hai 05:00 | `vt_offer` 5 việc | máy chủ | Minh chọn `GUILD-Q-CN-01` (Phù cho khách), `-02` (Đèn Đẩu), `-08` (Đường lên Thiên Sư Phủ) |
| Thứ Hai tối | Chủ Đàn «Ngọc Dương» đặt `GUILD-RITE-CN-02` Bái Đẩu thứ Tư giờ Tuất, chọn bằng trạch nhật | Chủ Lễ | máy chủ tự kiểm `zheri` ngày thứ Tư: «tốt» → `d = 1,1` |
| Thứ Tư | Bái Đẩu 11 người, `q = 0,92` | — | Đạo Vọng = round((10 + 22) × 0,92 × 1,1) = **32** |
| Thứ Năm | Đàn Khố chi 120 Phúc Khí mua nến lễ | Tri Khố | trong hạn mức 300; Sổ Kho một dòng |
| Thứ Sáu | Thư Sớ mở `NS-01` lên bậc 2 (Đạo Vọng 312/300) | Thư Ký | 48 giờ; 8 cử tri R2 hoạt động → túc số 4 |
| Chủ nhật | `NS-01` đóng: thuận 6, chống 0, trắng 1 | — | thông qua; Giám Đàn mở công trường Tàng Lục Các |
| tuần sau | 12 người vác; đợt nào có ≥ 3 người cùng lúc thì 1,5 công | — | xong 8 đợt sau 4 ngày; `ct_done`; lễ Tạ Thổ (`GUILD-RITE-CN-04`) |

### 15.2.3 Khủng hoảng: Đàn Chủ vắng và bất tín nhiệm

| Ngày (tính từ lần cuối Minh online) | Sự kiện | Kiểm |
|---|---|---|
| 7 | Phó Đàn «Huyền Tĩnh» nhận «Chủ Trì vắng 7 ngày» | Phần 01 §1.7.5 |
| 10 | 3 thành viên R2 ký mở `NS-08` (bất tín nhiệm) vì «không tham gia lâu ngày» | `NS-08` cho phép ≥ 3 R2 ký |
| 12 | Minh quay lại, thấy `NS-08`; gửi lời trình `ns.1` «Tôi xin trình bày: tôi vắng vì việc riêng.» và `ns.3` | lời trình hiện dưới nghị sự; Minh không bỏ phiếu được |
| 13 | `NS-08` đóng: thuận 5, chống 4 → 5/9 < 2/3 → **không thông qua** | 21 ngày không mở lại được |
| 14 | Minh chủ động giao Phó Đàn quyền Chủ Lễ, đề cử thêm Phó Đàn thứ hai (`NS-06`) | — |
| Lập Xuân năm sau | bầu Đàn Chủ: 2 ứng viên (Minh, Huyền Tĩnh) | Huyền Tĩnh thắng 7/12; Minh thành Lão Đàn (R4); dòng Sổ Đường «… được bầu Chủ Trì mùa Mậu Thân (7/12 phiếu).» |

**Kiểm:** không có cách nào để Minh «giữ ghế» bằng cách đuổi người ký `NS-08` (R2 chỉ mời ra qua nghị sự 2/3; nếu Minh đuổi người vừa ký, khiếu nại `guild` + cờ «đuổi trong 24 giờ sau báo cáo»).

### 15.2.4 Minh và Thiên Mệnh Bàn

- Năm 2027, cung Tây Nam có Thái Tuế (3). Minh là tuổi Ngọ; Bàn Lễ Thái Tuế trên máy Minh nói năm 2027 (Đinh Mùi) **tuổi Ngọ với Mùi là Lục Hợp** — `taisui › personalTaSui('午', '未')` trả đúng câu «Tuổi Ngựa (午) KHÔNG phạm thái tuế năm này — bình an.» (đã chạy engine); Minh không thấy lời «phạm» như năm 2026 (canon: `MAU-A` phạm Trị + Hình năm 2026 Bính Ngọ). *(Kiểm: lời Bàn Lễ đổi theo năm, không giữ cảnh báo năm cũ.)*
- Minh đứng rẻ quạt Tây (Tam Sát): chỉ nhận công khi **quay mặt** về phía Tây (hướng `h`). Minh đứng quay lưng → `E_STATE` «Việc này làm ở … quay mặt về phía sát.» *(câu `toast` riêng cho Tam Sát)*.

---

## 15.3 Bin (`PS-3`) — thiếu niên 15 tuổi

| Tình huống | Bin làm | Hệ thống | Kiểm |
|---|---|---|---|
| Vào MMO | khai năm sinh → `ab: 'T'` | chế độ an toàn bật; «Hiện trên Thiên Bảng» mặc định tắt | Phần 05 §5.6.2 |
| Người lớn lạ «K» chạm vào Bin → «Kết đạo hữu» | — | nút không có với K (client); nếu K sửa client gửi `fr_add` → `E_AGE` | T-I-13 |
| K mời Bin đi cùng | — | lời mời không tới Bin | luật lời mời người lạ |
| K đi theo Bin qua 3 vùng trong 40 phút, khoảng cách < 10 m | Bin bấm `at.3` «Đừng đi theo mình nữa.» rồi báo cáo `follow` | cờ dụ dỗ (§5.6.4) gắn cho K; hàng khẩn; tương tác A↔T của K bị khóa trong lúc chờ | T-I-12 |
| Bin vào Văn Hội «Mặc Khê Văn Hội» (có người lớn) | — | chi đường gắn cờ «có thành viên T»; Hội Trưởng (người lớn) nhận `care.teen.sect` | Phần 05 §5.6.3 |
| Hội Trưởng gửi thư riêng cho Bin | — | chỉ được nếu là đạo hữu (qua mã); nếu không → `E_AGE` | — |
| Lớp Giảng Tập ở Giảng Đường | Bin học cùng 5 người | được (nơi chung, ≥ 3 người) | — |
| Bin muốn có thầy | Bảng Tìm Thầy chỉ hiện thầy nhóm T (cảnh giới ≥ 4) — ít; gợi ý lớp học nhóm | — | Phần 04 §4.1.2 |
| Trung Thu (15/09/2027) | «Đội rước đèn» chỉ nhóm T; làm đèn ông sao | — | Phần 10 `EV-TRUNGTHU-01` |
| Đoan Ngọ | không thấy món «cơm rượu» | — | Phần 10 |
| 22:00 | `care.night` (Lão Tùng); 22:30 `care.night.30` | — | Phần 14 §14.10 |
| Bin bật «Hiện trên Thiên Bảng» | hiện tên tu, không hiện chi đường | — | Phần 07 §7.5.2 |
| Bin tròn 18 tuổi (khai lại) | nâng `ab` T → A | không có đường hạ ngược | Phần 11 §11.1.2 |

---

## 15.4 Hải và Thu (`PS-4`) — đạo lữ

| Bước | Diễn biến | Kiểm |
|---|---|---|
| 1 | Hải, Thu là đạo hữu 20 ngày, cả hai A, cả hai có danh tính bền | đủ điều kiện (Phần 04 §4.4.1) |
| 2 | đứng quanh Bàn Hợp Hôn; Hải gửi `dl_req`; Thu chấp nhận | — |
| 3 | Hải chọn «Đầy đủ» (`dlg.dl.mode.full`, đếm 5 giây, xác nhận hai lần); Thu chọn «Giản lược» | chế độ thực hiện = **Giản lược** (thấp hơn) |
| 4 | hai client gửi `hh_card` | TownShard tính `hehunFromCards`; khác nhóm mệnh quái → yếu tố −4 trong `factors` (không gửi vì Giản lược) |
| 5 | `hh_res`: `rating = 'Trung'`, câu dẫn «Hợp một mặt, khác một mặt. Phần lớn là do hai người làm.» + `verdict` của engine + «Để tham khảo và chiêm nghiệm…» | không có `score`, `factors` (T-I-14) |
| 6 | thẻ bị xóa | rà storage / D1 / log: không có (T-P-12) |
| 7 | chọn ngày: «Không dùng lá số» → `zheri` gợi ý ngày hoàng đạo 2027-08-08 (Thất Tịch) | ngày do người chơi chọn; engine chỉ gợi ý |
| 8 | lễ kết đạo lữ có 14 khách; mỗi người chọn lời hẹn (Hải ③ «Mệnh do ta tạo — tạo cùng nhau», Thu ① ) | đồ đôi «Đồng Tâm» miễn phí |
| 9 | Thất Tịch: cùng góp ván bắc cầu Ô Thước, đi qua cầu | `EV-THATTICH-01` |
| 10 (6 tháng sau) | Thu bấm «Giải duyên» | Hải nhận `toast.dl.end`; đồ đôi thành đồ đơn; chờ 7 ngày mới kết mới |

**Biến thể iOS:** cùng hành trình trên bản iOS → bước 3–6 không có (chỉ «Không so»); lễ vẫn đủ (Phần 04 §4.4.11).

---

## 15.5 «X» (`PS-5`) — kẻ khai thác

| Thử | Cách | Hệ thống | Mã test |
|---|---|---|---|
| Cày Thiên Bảng bằng sửa `localStorage` | tăng `phucKhi`, Đạo Hạnh trong `huyenquan:v1` | Thiên Bảng chỉ đọc `dh_ledger`; `dh_sync` của X bị kẹp theo thời gian thực đã trôi và ≤ 30% bảng | T-U-40 |
| Bot vác đá `EV-CAU` | gửi `ev_act carry` mỗi 1 giây | yêu cầu ≥ 8 giây / chuyến + quãng đi bộ thật → chỉ ~1/8 được nhận; trần 120 công / ngày | T-AB-01, 08 |
| Dịch chuyển giữa bãi đá và ổ gà | `mv` nhảy 40 ô | quãng không tính; `ev_act` ở đoạn giữa bị từ chối | T-AB-01 |
| Lập 5 tài khoản làm đồng khởi | cùng thiết bị | cùng `pid_hash` cụm → đồng khởi không tính; tuổi tài khoản < 7 ngày bị từ chối | T-AB-11 |
| Rút kho chi đường về mình | — | không có gói nào làm được | T-P-05 |
| Gửi `hh_card` để dò lá số người khác | — | chỉ trong cặp đã đồng ý; giới hạn 1 lần / cặp / 24 giờ; Giản lược chỉ 4 mức | T-AB-15 |
| Đặt tên «GM Huyền Quán» | — | `cleanName` mở rộng chặn mạo danh → «Khách» | T-AB-22 |
| Gửi `title` «Admin» | sửa client | `title` chuỗi bị bỏ, `ti` mặc định | Phần 11 §11.2.1 |
| Spam `emo` có đích vào Lan | 20 / phút | 6 / phút qua, cùng người nhận ≤ 3 / phút; Lan bật «không nhận cử chỉ từ người lạ» | Phần 06 §6.23.3 |
| Báo cáo dồn Minh bằng 6 tài khoản mới | — | trọng số 0,2 mỗi tài khoản → tổng 1,2 < 3 → không có hành động tự động | T-AB-21 |
| Tặng quà vòng để «nuôi» tài khoản | A→B→C→A | cờ `GIFT_RING`; giá trị ≤ 5 Phúc Khí / quà → vô nghĩa | T-AB-20 |
| Treo 4 tài khoản ở bồ đoàn tăng `n` đồng tu | không thao tác | không tính vào `n` sau 2 vòng | T-AB-26 |

---

## 15.6 Ca biên (E)

| Mã | Ca | Hành vi mong đợi |
|---|---|---|
| E-01 | Chủ Trì xóa tài khoản giữa lúc có nghị sự mở | chuyển giao ngay theo luật vắng mặt; nghị sự giữ nguyên; tên trong nghị sự thành «một người tu» |
| E-02 | Chi đường đúng 8 người, 1 người rời → 7 | không giải tán; chỉ khóa nâng bậc 2 nếu chưa đạt (trạng thái «tạm đường» chỉ áp trong 30 ngày đầu) |
| E-03 | Lễ đường mà Chủ Lễ mất mạng giữa pha | pha chạy theo `at` (SectHall); người khác vẫn hoàn thành; Chủ Lễ nối lại kịp thì vẫn tính vai |
| E-04 | Hai nghị sự mâu thuẫn cùng thông qua (đổi lịch lễ sang thứ Ba và sang thứ Năm) | nghị sự **đóng sau** thắng; Sổ Đường ghi cả hai |
| E-05 | Kho không đủ khi công trường sang đợt mới | đợt chờ; `ct_state` hiện «Chờ vật liệu: {thiếu}» |
| E-06 | Thành viên bị ẩn (block) bởi người khác cùng chi đường | cả hai vẫn ở đường; người ẩn không thấy người bị ẩn trong đạo tràng; phiếu vẫn tính |
| E-07 | Lễ tông khi chỉ có 1 người dự | lễ vẫn diễn ra với NPC chưởng giáo; Đạo Vọng tông lễ cho chi đường cần ≥ 3 thành viên dự (Phần 01 §1.10.2) |
| E-08 | Người chơi đổi múi giờ (đi nước ngoài) | lễ chung theo giờ Việt Nam; lễ tông có suất thứ Bảy giờ Thìn; giao diện hiện giờ địa phương kèm «(giờ Tuất ở Huyền Quán)» |
| E-09 | Năm có Tết trước Lập Xuân (2028) | `EV-TET-01` thuộc mùa cũ; khung tên «Xuân Mậu Thân»? → **không**: khung Tết ghi theo **năm âm** «Xuân Mậu Thân», mùa Thiên Bảng vẫn là Đinh Mùi tới 2028-02-04; Codex giải thích |
| E-10 | Tháng 7 âm chỉ 29 ngày | `EV-DIATANG-01` rơi vào 29 |
| E-11 | Đông Chí: người chơi tô cánh mai ngày 1, bỏ 10 ngày | 10 cánh trắng giữ nguyên; không cho tô bù; ≥ 60 cánh vẫn nhận khung «Tiêu Hàn» nếu đủ về sau |
| E-12 | EventHub mục tiêu đạt 100% khi còn người đang vác | công cuối vẫn ghi cho người vác (ngưỡng thưởng cá nhân); tiến độ chung ở 100% |
| E-13 | Đoạn đường hư 100 và người chơi đang đứng giữa | không kẹt: đoạn có cầu ván tạm; A* tìm được |
| E-14 | Thầy và trò đổi nhóm tuổi (trò tròn 18) | sư đồ T–T thành A–T? → trò tròn 18 **sau** khi đã bái thầy nhóm T: quan hệ kết thúc êm (hệ thống), không thông báo lý do; cả hai có thể bái lại nếu thầy cũng đã A |
| E-15 | Kim lan 5 người, 1 người bị khóa MMO bậc 4 | vẫn là thành viên; không tham gia nghĩa cử được trong thời gian khóa |
| E-16 | Đạo lữ: một người xóa tài khoản | quan hệ kết thúc; người kia nhận thông báo trung tính |
| E-17 | Hai người cùng là «người xông đất đầu tiên» trong cùng mili-giây | `rq` đến trước ở DO thắng (DO tuần tự) |
| E-18 | Lì xì cho người đã nhận đủ 16 bao | bao quay về người tặng (còn hạn trong ngày) |
| E-19 | Cụm từ slot `{vung}` là vùng người gửi chưa mở | máy chủ từ chối; client mới không hiện vùng đó trong danh sách |
| E-20 | Client v1 trong vùng im lặng gửi `say hi` | máy chủ bỏ gói (luật vùng áp mọi phiên bản) |
| E-21 | Lễ tiết bị tắt (`fest.<id>`) giữa ngày | thưởng đã nhận giữ nguyên; hoạt động ẩn; thông báo xin lỗi |
| E-22 | Người chơi ở trong Thái Tuế Điện lúc chưa sửa `WORLD_TILES` | (lỗi hiện tại) người khác thấy họ đứng ở cửa — sau sửa: thấy đi trong điện |
| E-23 | Phòng đầy 60 khi đại lễ | client tự sang phòng kế (`CLOSE_FULL`); đại lễ có bản sao ở mọi phòng |
| E-24 | Chi đường hưu đường khi còn công trường dở | vật liệu đã trừ không hoàn; phần kho còn lại đổ Quỹ Cầu Đường |
| E-25 | Người bị mời ra khỏi chi đường trong lúc đang dự lễ | lễ đó vẫn tính cho họ (dự đủ trước khi bị mời ra) |
| E-26 | `MT` bật sau tham vấn khi đang giữa mùa | tông mở; người kiêm tu quá 3 tông không thêm được; không ảnh hưởng mùa |
| E-27 | Người chơi chơi đơn cả mùa | `EV-TMB` bản đơn; Thiên Bảng không có tên; không mất gì về tu |
| E-28 | Hai chi đường giao hảo, một bên hưu đường | giao hảo tự hủy; bên kia nhận thông báo |
| E-29 | Thầy bị khóa vĩnh viễn MMO | quan hệ sư đồ kết thúc bởi hệ thống; trò không bị ảnh hưởng tiến trình |
| E-30 | Lập Xuân đúng lúc đang diễn ra tông lễ (giờ giao tiết rơi vào giờ Tuất Chủ nhật) | lễ thuộc mùa bắt đầu lúc lễ mở (mùa cũ); thưởng ghi mùa cũ; `EV-TMB` mở sau khi lễ kết thúc 10 phút |

---

## 15.7 Kịch bản chơi tay mẫu (QA, 4 thiết bị, 45 phút)

**Chuẩn bị:** `npm run dev:mmo` + `npm run dev`; 4 trình duyệt / thiết bị (A, B, C người lớn; D nhóm T); 390 × 844.

| Phút | Bước | Mong đợi |
|---|---|---|
| 0 | A, B, C, D vào cùng phòng | chip «👥 4» |
| 2 | A mở bánh xe, gửi `hi`; D gửi `at.1` | bong bóng đúng; nhật ký giao lưu có 2 dòng |
| 4 | A kết đạo hữu với B (chạm) | cả hai `toast.fr.ok` |
| 5 | A thử kết đạo hữu với D | không có nút |
| 6 | A, B, C đồng tu ở Trà Thất (3 chỗ) | vòng thở chung; sau vài vòng «Đồng tâm» |
| 10 | D thử ngồi (Trà Thất kín) | `seat i = -1` → «Bồ đoàn đã kín.» |
| 12 | A lập nhóm đồng hành với B, C → giải án hợp tác | mỗi người giữ bước; `coop_done` |
| 20 | A (đủ điều kiện thử nghiệm) lập chi đường với B, C + 3 tài khoản thử đủ tuổi | `SectHall.init`; bước qua cổng thấy đạo tràng bậc 1 |
| 25 | A mở `NS-11`; B, C bỏ phiếu | sau thời hạn rút gọn (cờ QA: 2 phút) → đóng, kết quả đúng |
| 30 | A đặt đường lễ (cờ QA: bắt đầu sau 1 phút) | 4 pha; `rite_end` |
| 38 | B góp 250 Phúc Khí | `toast.sect.give.limit` sau 200 |
| 40 | C báo cáo A lý do `spam` | `toast.reported`; A bị C ẩn |
| 43 | A gửi 11 `say` liên tục | câu thứ 11 «Chậm lại một chút nhé.» |
| 45 | tắt mạng của B | B «Mất kết nối. Bạn vẫn chơi được — sẽ tự nối lại.»; bật lại → tự nối |

Biên bản ghi: thiết bị, phiên bản, bước lỗi, ảnh màn hình.

## 15.8 Checklist nghiệm thu Phần 15

- [ ] Năm hành trình chạy được trên bản thử nghiệm với kết quả đúng như bảng (biên bản QA).
- [ ] 30 ca biên E-01…E-30 có test tự động hoặc biên bản tay.
- [ ] Kịch bản 45 phút §15.7 chạy trơn trên 390 × 844 và một iPhone thật.
