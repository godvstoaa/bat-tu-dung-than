# 09-11 · Bản iOS, đo lường tổng, nghiệm thu tổng và rủi ro

> Bản iOS của app («Lữ Đăng») từng bị Apple từ chối theo điều 4.3(b) vì «fortune telling». `src/game/features.js` đã có cơ chế tắt: `IOS_OFF = ['xam', 'sen', 'que', …VAN, 'door_vanmenh', 'exit_vanmenh', 'door_thaitue', 'exit_thaitue']`, `FEATURES.divination / wishes / ai = !IOS`, và bộ chữ `TEXT` đổi «Huyền Quán → Học Quán», «Phúc Khí → Điểm Tu Học», «Sổ Mệnh → Sổ Tu Học», «Lư Hương → Lò Trầm». Phần này áp đúng tinh thần đó cho toàn bộ hệ tu luyện.

---

## 1. Nguyên tắc chuyển đổi iOS

| # | Nguyên tắc | Căn cứ | Hệ quả trong tài liệu 09 |
|---|---|---|---|
| I1 | **Không có hoạt động dự đoán vận mệnh của chính người chơi** (vận hạn, đại vận, Thái Tuế, sao bản mệnh, điều ước gửi trời) | 4.3(b); `IOS_OFF` | tắt `MG-16`; bỏ bước sao bản mệnh của `MG-19`; bỏ đèn an Thái Tuế; phân đàn Bắc Đế dời về Thư Lâu |
| I2 | **Không AI** | `FEATURES.ai = !IOS` | `MG-11` đổi sang «Sổ Tham Thoại» (bộ câu hỏi soạn sẵn); `ACT-040` dùng bộ câu hỏi soạn sẵn |
| I3 | **Không nội dung âm tà** (kể cả tự nguyện bật) | thận trọng với App Review | `MG-23` dạng văn khố, `MG-24` bỏ lớp tà, Phong Đô không hiện vong |
| I4 | **Ngôn ngữ «học»** thay ngôn ngữ «linh nghiệm» | `TEXT` | đổi tên một số MG / cơ chế (§4) |
| I5 | **Lá số vẫn là nhân vật** (T1) | bản iOS hiện có vẫn lập tứ trụ, giải án khách, 8 sảnh nghề (không nằm trong `IOS_OFF`) | Tiềm Lực, NT, Dụng thần, cảnh giới, Thiên Bảng **giữ nguyên** |
| I6 | **Không thiệt Đạo Hạnh** so với web | `09-03` E3 (bói không sinh ĐH) | §3: cân bằng giữ được vì ĐH phụ thuộc thời gian tu, không phụ thuộc hoạt động bói |

---

## 2. Bảng 24 mini-game trên iOS

| Mã | Web | iOS | Thay đổi cụ thể trên iOS |
|---|---|---|---|
| `MG-01` Tĩnh Tọa Hồi Tức | ✓ | ✓ | không đổi |
| `MG-02` Kết Phù Ngũ Bộ | ✓ | ✎ | tên «**Họa Văn Ngũ Bộ**»; năm phần gọi «đầu – thân – bụng – lõi – chân của bức họa văn»; câu chữ bỏ «trấn / trừ», dùng «an lòng»; không có chế độ «trừ tà» (`ACT-091` ẩn) |
| `MG-03` Khoa Cử Tam Trường | ✓ | ✓ | câu hỏi về lá số chỉ dùng lá số **NPC** và lá số cổ; bỏ câu về «vận năm nay của bạn» nếu có |
| `MG-04` Thái Cực Vân Thủ | ✓ | ✓ | không đổi |
| `MG-05` Mạn-đà-la Cát | ✓ | ✓ | không đổi (vốn là hoa văn hình học) |
| `MG-06` Tụng Kinh · Lạy Nhịp | ✓ | ✓ | chế độ «Trì chú Chuẩn Đề» đổi tên «Tụng Chuẩn Đề (văn hóa)»; vẫn chỉ hiện số biến |
| `MG-07` Bốc Thuốc Ngũ Hành | ✓ | ✓ | không đổi (vốn có «đi khám bác sĩ») |
| `MG-08` Bố Trí Dương Trạch | ✓ | ✓ | chỉ dùng mệnh quái **NPC / nhà riêng của nhân vật**; Ngũ Hoàng năm giữ (là kiến thức phong thủy về không gian, không về số mệnh người) |
| `MG-09` Trạch Nhật Khai Đàn | ✓ | ✓ | chỉ chọn ngày cho **sự kiện trong game** (lễ môn phái, NPC) |
| `MG-10` Đặt Đạo Hiệu | ✓ | ✓ | bỏ phần «letter numerology» (Expression / Soul Urge) nếu App Review coi là thần số học; giữ ngũ cách nét chữ như **học Hán tự** |
| `MG-11` Công Án Vấn Đáp | ✓ | ✎ | «**Sổ Tham Thoại**»: không AI; ba câu dẫn soạn sẵn mỗi công án; chấm theo số ngày quay lại và tiêu chí tự đánh giá (`09-05` MG-11) |
| `MG-12` Thư Pháp Lâm Thiếp | ✓ | ✓ | không đổi |
| `MG-13` Hái Thuốc Tứ Thời | ✓ | ✓ | không đổi |
| `MG-14` Pha Trà Thất Bộ | ✓ | ✓ | «Phúc Khí» → «Điểm Tu Học» |
| `MG-15` Luyện Đan Cửu Chuyển | ✓ | ✓ | không đổi (vốn ghi rõ hư cấu, cảnh báo ngoại đan) |
| `MG-16` Thả Đèn Hoa Đăng | ✓ | ✗ | tắt (`IOS_OFF` có `'sen'`); phương án «Đèn tri ân» chờ thử App Review riêng, **mặc định không bật** |
| `MG-17` Thần Chung Mộ Cổ | ✓ | ✓ | không đổi |
| `MG-18` Họa Luân Mạn-đà-la | ✓ | ✓ | trưng bày công khai có báo cáo / chặn (quy định UGC của App Store) |
| `MG-19` Bái Đẩu Thất Tinh Đăng | ✓ | ✎ | chỉ ở Long Hổ; tên «**Thất Tinh Đăng**» (bỏ chữ «bái»); bỏ sao bản mệnh; giữ bày pháp khí (văn hóa), bảy đèn, «chuôi Đẩu chỉ mùa» (thiên văn) |
| `MG-20` Kinh Hành Bậc Đá | ✓ | ✓ | không đổi |
| `MG-21` Phóng Sinh Đúng Pháp | ✓ | ✓ | tên phụ «Cứu hộ động vật»; nội dung giữ |
| `MG-22` Đối Chất Định Mệnh Hội | ✓ | ✓ | chỉ lá số NPC; **bỏ** lời phán Thái Tuế, thay bằng lời phán ngũ hành (mặc định an toàn) |
| `MG-23` Sổ Nghiệp Giải Oan | ✓ | ✎ | Phong Đô dạng **văn khố**; «vong» là người đã khuất kể qua di vật; không bật âm tà |
| `MG-24` Tam Chẩn Cứu Người | ✓ | ✎ | ba bước Thân → Nhà → **Tâm** (không có lớp tà); ca tên «hoảng sợ ban đêm» |

**Tổng iOS:** 17 MG giữ nguyên, 6 MG đổi nội dung, 1 MG tắt.

---

## 3. Cân bằng Đạo Hạnh giữa web và iOS

### 3.1 Vì sao không cần bù

Đạo Hạnh trong trần ≈ **số phút tu × 0,7–0,9 thô / phút** (`09-10` §6.3) bất kể MG nào. Người iOS không có `MG-16` (2 phút / ngày) thì dùng 2 phút đó cho MG khác, cùng tốc độ. Ngoài trần (Nhật Khóa, tuần, tháng, lễ, cốt truyện, chuỗi đạo, công) giống hệt web.

### 3.2 Khác biệt còn lại (định lượng)

| Hoạt động web | Thô / ngày | Trên iOS | Chênh lệch |
|---|---|---|---|
| `ACT-004` Đèn an Thái Tuế | 1 (trong trần) | ✗ | người chơi dùng thời gian khác → ≈ 0 |
| `MG-16` Thả đèn | 2 (trong trần) | ✗ | ≈ 0 |
| `ACT-039`, `ACT-084` lễ đèn | ≈ 30 / lễ (ngoài trần) | ✎ đổi sang dâng hương tập thể, **cùng thưởng** | 0 |
| `MG-19` sao bản mệnh | phần `m` của điểm (20%) | thay bằng `q` chuôi Đẩu | 0 |
| `ACT-123` Bảy ngày chỉ tu | 10 / tuần | ✗ (iOS vốn không bói) | −10 thô / tuần **nếu** người web làm hằng tuần |

`ACT-123` là chênh lệch duy nhất có thật. Xử lý: trên iOS, `ACT-123` **tự động đạt** mỗi 7 ngày tu (người iOS vốn đã «chỉ tu») → +10 thô. Cân bằng hoàn toàn.

### 3.3 Phúc Khí và Cấp

iOS mất Phúc Khí từ xin xăm (≤ 9 / ngày), thả đèn (3), đèn Thái Tuế (3) → ≈ −10% Phúc Khí / ngày (`09-10` §8.1: 100 thay vì 112 với người đều đặn). Cấp chậm hơn ≈ 10% → Ngọc từ lên cấp chậm hơn chút. Chấp nhận (Cấp không phải tiến trình chính); nếu cần bù, đội kinh tế (tài liệu 11) có thể tăng điểm danh Ngọc iOS — ngoài phạm vi tài liệu này.

### 3.4 Thiên Bảng chung

Nếu máy chủ MMO chung cho web và iOS: Thiên Bảng chung được (ĐH ngang nhau theo §3.1–3.2). Thiên Bảng **không** hiện nền tảng của người chơi.

---

## 4. Thuật ngữ trên iOS

| Web | iOS | Ghi chú |
|---|---|---|
| Huyền Quán | Học Quán | `TEXT.brand` |
| Phúc Khí | Điểm Tu Học | `TEXT.point` |
| Sổ Mệnh | Sổ Tu Học | `TEXT.book` |
| Lư Hương / thắp nhang | Lò Trầm / đốt trầm | `TEXT.huong`, `huongVerb` |
| Độ kiếp | **Khảo Đạo** | «kiếp» mang sắc thái vận hạn; «khảo» là kỳ khảo hạch |
| Thời khắc đã tới | Kỳ khảo đã mở | |
| Kết Phù | Họa Văn | `MG-02`, `ACT-051`, `ACT-091` |
| Bái Đẩu | Thất Tinh Đăng | `MG-19` |
| Trúng yểm | Hoảng sợ ban đêm | `MG-24` |
| Vong / hồn | người đã khuất | `MG-23` |
| Phong Đô Quỷ Thành | Phong Đô Cổ Thành | tên vùng |
| Cảnh giới, Đạo Hạnh, Nghịch Thiên, Đạo thống | giữ nguyên | là khái niệm tu học, không phải bói |
| Tên 6 bậc (Đạo / Phật / Nho) | giữ nguyên | canon |
| Thái Tuế Điện | không có lối vào | `IOS_OFF` |

---

## 5. Độ kiếp (Khảo Đạo) trên iOS

| Mã | Thay đổi |
|---|---|
| `ACT-K2-DAO` | Lão Tùng hỏi ba câu về lá số: Hành mạnh nhất, Dụng thần, Mệnh Cách — giữ (là **đọc lá số**, không dự đoán) |
| `ACT-K3-CN` | `MG-02` bản Họa Văn; lời thoại «tâm ấn để em yên lòng» giữ |
| `ACT-K3-TT` | «hồn con tôi bị bắt» → «con tôi hoảng sợ, mất ngủ» |
| `ACT-K3-BD` | phân đàn Đạo Tạng các ở Thư Lâu; bỏ đèn Thái Tuế, thay chép một trang kinh (`MG-12`) |
| `ACT-K3-TD` | bỏ `MG-16`, thay cảnh quét lá cùng bà góa |
| `ACT-K3-TH`, `ACT-K4-TH`, `ACT-K5-TH` | `MG-11` bản Sổ Tham Thoại |
| `ACT-K4-TT`, `ACT-K5-TT`, `ACT-K6-TT` | `MG-24` bản iOS; «nuôi bùa» → «bị đồn mang xui» |
| `ACT-K4-BD`, `ACT-K5-BD`, `ACT-K6-BD` | Phong Đô văn khố |
| `ACT-K6-MT` | người dẫn Vân Cốc (cũng là phương án web khi chưa có tham vấn Tạng truyền) |
| `ACT-K6-QN` | gương Thiên Trì hiện **Mệnh Đồ** (`gaimenh` — kế hoạch tự tu sáu tầng). Tầng «Thái Tuế» của Mệnh Đồ trên iOS hiện dạng «nhịp năm» (không gọi tên phạm Thái Tuế). Cần tài liệu 05 xác nhận |

Các độ kiếp còn lại giữ nguyên.

---

## 6. Hoạt động `ACT` trên iOS

### 6.1 Tắt (✗)

| Mã | Lý do |
|---|---|
| `ACT-004` Đèn an Thái Tuế | vận hạn bản thân; `door_thaitue` trong `IOS_OFF` |
| `ACT-007` Xin xăm | `'xam'` trong `IOS_OFF` |
| `ACT-008` Gieo quẻ | `'que'` trong `IOS_OFF` |
| `ACT-009` Vận Mệnh Các | `VAN` trong `IOS_OFF` |
| `ACT-036` Thả đèn Cùng Thông Hồ | `'sen'` / điều ước |
| `ACT-049` Đổi niên chủ Thái Tuế | Thái Tuế Điện |
| `ACT-123` Bảy ngày chỉ tu | tự động đạt (§3.2) — không có lối vào riêng |

### 6.2 Đổi nội dung (✎)

| Mã | iOS |
|---|---|
| `ACT-003` | Lò Trầm |
| `ACT-039` | Lễ Hạ Nguyên: dâng hương tập thể bên hồ, cùng thưởng |
| `ACT-040` | Tham vấn Vân Cốc bằng bộ câu hỏi soạn sẵn |
| `ACT-050` | Lễ tiết: bỏ phần vận hạn (vd không «an sao giải hạn» dịp Thượng Nguyên) |
| `ACT-051`, `ACT-053`, `ACT-091` | Họa Văn |
| `ACT-052`, `ACT-055` | Thất Tinh Đăng |
| `ACT-067` | Sổ Tham Thoại |
| `ACT-084` | Vu Lan: dâng hương tưởng niệm |
| `ACT-090` | Tam chẩn bản iOS |
| `ACT-095`, `ACT-098` | văn khố |
| `ACT-125` | ẩn lớp `fu`, `mantra` của Thư Viện nếu App Review yêu cầu |

### 6.3 Nhật Khóa trên iOS — mọi nhóm đều làm được từ bậc 1

| Nhóm | Hoạt động iOS bậc 1 |
|---|---|
| Tĩnh | `MG-01`, `MG-14`, `ACT-071` |
| Thân | `MG-04`, `MG-13`, `MG-20` |
| Học | `MG-03`, `MG-07`, `MG-09`, sảnh nghề |
| Nghệ | `MG-08`, `MG-12`, `MG-18` |
| Lễ | `MG-06`, `MG-17`, Lò Trầm (`ACT-003`) |
| Hạnh | giải án khách (`ACT-001`), `ACT-016` ăn chay |

---

## 7. Cờ tính năng đề xuất (mở rộng `features.js`)

```js
// features.js (đề xuất — chưa có, cần làm)
export const TU = IOS
  ? {
      kiepName: 'Khảo Đạo', kiepReady: 'Kỳ khảo đã mở',
      mgOff: ['MG-16'],
      mgVariant: { 'MG-02': 'hoavan', 'MG-11': 'sotham', 'MG-19': 'thattinh', 'MG-22': 'nothaitue', 'MG-23': 'vankho', 'MG-24': 'notamta' },
      amta: false,                       // không cho bật âm tà
      bdBranch: 'thulau',                // phân đàn Bắc Đế
      autoAct123: true,
    }
  : {
      kiepName: 'Độ kiếp', kiepReady: 'Thời khắc đã tới',
      mgOff: [], mgVariant: {}, amta: 'optin', bdBranch: 'thaitue', autoAct123: false,
    };
export const hasMG = (id) => !TU.mgOff.includes(id);
```

Mọi chỗ trong code tu luyện đọc `TU` thay vì tự kiểm `IOS` (một nguồn sự thật, như `hasStation` hiện có).

---

## 8. Danh sách kiểm App Review (cho mỗi bản iOS có hệ tu luyện)

- [ ] Không màn hình nào dùng từ «bói», «xem vận», «giải hạn», «điềm», «linh nghiệm» trong bản iOS (quét chuỗi tự động trên gói build).
- [ ] Không màn hình nào hiển thị dự đoán về **người dùng** (năm tốt / xấu, phạm Thái Tuế, sao chiếu mệnh).
- [ ] Ảnh chụp App Store chỉ dùng cảnh: kiến trúc, tĩnh tọa, Thái Cực, thư pháp, khoa cử, pha trà, hái thuốc.
- [ ] Ghi chú cho người duyệt: «Học Quán là game học văn hóa cổ (thư pháp, kiến trúc, thiền, Đông y dưỡng sinh); lá số dùng như **hồ sơ nhân vật** sinh từ ngày sinh, không dự đoán tương lai».
- [ ] Tài khoản thử cho người duyệt: nhân vật bậc 3, đã nhập môn, có nhà riêng.
- [ ] UGC (`MG-18` tranh công khai, Dược Chí `MG-13`): có báo cáo, chặn, lọc, điều khoản.
- [ ] `MG-07`, `MG-24`: câu «không thay thế khám bệnh» hiển thị rõ.
- [ ] Không AI (`FEATURES.ai = false`) — kiểm không có lời gọi mạng tới dịch vụ AI.

---

## 9. Đo lường tổng của tài liệu 09

### 9.1 Từ điển sự kiện (tổng hợp)

| Nhóm | Sự kiện | Định nghĩa ở |
|---|---|---|
| Chung MG | `mg_start`, `mg_step`, `mg_end`, `mg_abandon`, `mg_assist`, `mg_hint`, `mg_flag` | `09-03` §13.5 |
| Riêng MG | (mỗi MG mục 12) vd `herb_pick`, `tea_step`, `alchemy_turn`, `lantern_release`, `bell_section`, `mandala_draw_done`, `doudeng_order`, `kinhhanh_wander`, `release_scenario`, `doichat_claim`, `ledger_page`, `tamchan_order` … | `09-04` – `09-07` |
| Độ kiếp | `kiep_open`, `kiep_phase`, `kiep_assist`, `kiep_result`, `kiep_talo_branch` | `09-02` §1.7 |
| Cảnh giới | `tier_up` (`tier_to, days_from_create, hours_played, tl_bucket, tradition`) · `tier_unstable` (`reason`) · `tradition_join` / `tradition_switch` | mới (dưới) |
| Kinh tế | `dh_gain` (`source, tho, dh, nt, k_dung, k_sung, cap_used`) · `cap_hit` · `duhuong_transfer` · `dh_loss` (`fault_type`) · `dh_restore` | mới |
| Vòng chơi | `nhatkhoa_done` (`groups[], streak`) · `streak_soft_save` (`gap, before, after`) · `nk_state` (`state` khi bắt đầu lượt) · `session_end` (`minutes, tho, dh`) · `return_after_absence` (`days`) | mới |
| Hoạt động | `act_done` (`act_id, cadence, reward`) | `09-08` |

**Riêng tư:** không gửi ngày giờ sinh, tên hồ sơ, điều ước, nội dung công án / Sổ Tham Thoại, nội dung thư `ACT-124`. `tl_bucket` = bội số 10.

### 9.2 Chỉ số sức khỏe hệ thống

| Chỉ số | Mục tiêu | Nguồn |
|---|---|---|
| Thời gian tới bậc 2 (trung vị) | ≤ 2 giờ chơi | `tier_up` |
| Thời gian tới bậc 6 (người còn chơi đều, trung vị) | 55–70 giờ | `tier_up` so với `09-10` §2.1 |
| Tỉ lệ đạt độ kiếp ≤ 2 lần thử / pha | ≥ 70% | `kiep_phase` |
| Tỉ lệ rẽ Tà Lộ ở pha Tâm Tham | 5–20% | `kiep_talo_branch` |
| Tỉ lệ ngày có Nhật Khóa / ngày chơi | ≥ 60% | `nhatkhoa_done` |
| Tỉ lệ lượt bắt đầu ở trạng thái Kiệt | < 3% | `nk_state` |
| Tỉ lệ người chơi chạm trần ngày | 5–15% (chỉ người chơi dài) | `cap_hit` |
| Phân bố thô theo MG | không MG nào > 20% | `dh_gain` |
| Tỉ lệ lá số TL < 40 trong top 100 Thiên Bảng | 25–45% | Thiên Bảng |
| Tỉ lệ thả loài xâm hại lần gặp thứ hai | < 10% | `release_trap` |
| Tỉ lệ bỏ sót nguy hiểm thật (`MG-24`) lần gặp thứ hai | < 5% | `tamchan_house` |

---

## 10. Nghiệm thu tổng tài liệu 09

### 10.1 Dữ liệu và logic

- [ ] Module thuần `src/game/tu.js` (chưa có — cần làm) chứa hằng số `09-03` §14; test node phủ: công thức ĐH, trần, Dư Hương, `K_lặp`, `K_hư`, `K_sung`, NT, `K_dụng`, ĐCG, năm điều kiện lên bậc, ngày củng cố, chuỗi mềm, Nguyên Khí tính lười.
- [ ] Mỗi MG có module chấm thuần dùng chung client + máy chủ, test với ví dụ số trong spec (sai số ≤ 0,01).
- [ ] Dữ liệu 24 MG, 125 ACT, 40 độ kiếp ở dạng khai báo (như `halls.js` khai báo án), UI đọc dữ liệu.
- [ ] Bộ mô phỏng `09-10` §12 có trong `scripts/`, in lại bảng §2.1.

### 10.2 Trụ cột

- [ ] **T1** — Tiềm Lực, NT, Dụng thần (hợp Dụng), tâm ma (`poisonTop`), sao bản mệnh, Mệnh Đồ đều lấy từ engine, không viết tay.
- [ ] **T2** — Không câu nào nói «mệnh đã định»; NT hiện với câu dẫn; bói không sinh ĐH; Khổng tiên sinh được trả lời ở `ACT-K6-QN`.
- [ ] **T3** — Không chiến đấu; không «thua»; không sét đánh, không nổ lò, không jump scare.
- [ ] **T4** — Vùng chưa mở vẫn đi vào được; Côn Lôn chặn bằng độ cao, không tường vô hình.
- [ ] **T5** — Mọi dẫn engine có thật (rà bằng grep tên hàm); dữ kiện văn hóa có nguồn và người rà.
- [ ] **T6** — Phù hư cấu, không in / xuất; y dược luôn «đi khám»; phóng sinh không khuyến khích mua; âm tà tự nguyện; Tạng truyền chờ tham vấn; danh xưng không trùng phẩm trật thật.

### 10.3 Kinh tế

- [ ] Không đường nào mua được ĐH, cảnh giới, công (E1); VIP chỉ mở sớm gia trì thẩm mỹ.
- [ ] Trần ngày, tuần, `K_lặp` tính ở máy chủ.
- [ ] Phạt phạm giới không nhân NT; sám hối khôi phục đúng tỉ lệ; mỗi lỗi sám một lần.

### 10.4 Nền tảng

- [ ] iOS: bảng §2, §5, §6 đúng; danh sách App Review §8 đạt.
- [ ] Web và iOS dùng chung máy chủ: Thiên Bảng không lộ nền tảng.

---

## 11. Rủi ro (để tài liệu 14 cấp mã `RISK-xx`)

| Rủi ro | Khả năng | Ảnh hưởng | Giảm thiểu đề xuất |
|---|---|---|---|
| Người chơi đổi ngày sinh để lấy NT cao | trung bình | thấp (không PvP, không bán ĐH) | khóa Tiềm Lực sau bậc 2 (`09-01` §12.2) |
| Tốc độ công (tài liệu 05) lệch làm điều kiện công thành cổ chai, xóa NT | trung bình | cao | công thức an toàn `09-10` §5.5; chạy lại mô phỏng khi đổi |
| Cộng đồng tôn giáo phản đối cách dựng lễ (Bái Đẩu, Mật, Phong Đô) | thấp – trung bình | cao | cố vấn tôn giáo; danh xưng hư cấu; Tạng truyền chờ tham vấn; nút báo «nội dung chưa phù hợp» |
| App Review coi phong thủy / ngũ cách / Đông y là «fortune telling» | trung bình | cao | §8; giữ khung «học văn hóa»; bản iOS tắt ngay qua cờ `TU` |
| Thông tin Đông y bị hiểu như chẩn đoán | thấp | cao | «đi khám» luôn là đáp án; RB1 caveat; không liều lượng thuốc |
| Thông tin an toàn (khí CO) sai | thấp | cao | chuyên gia an toàn rà `MG-24`, `ACT-094` |
| Danh mục loài xâm hại lỗi thời | trung bình | trung bình | ghi ngày rà soát; rà mỗi năm |
| AI công án nói điều sai / gây hại | thấp | trung bình | `checkNeo`; lộ trình an toàn canon §6.4; giới hạn chi phí canon §6.5 |
| Người chơi bị áp lực «phải lên bậc» | trung bình | trung bình | chuỗi mềm; không thông báo «sắp mất chuỗi»; không xóa cảnh giới theo mùa |
| Hiệu năng hiệu ứng bậc cao trên máy yếu | trung bình | thấp | ngân sách hạt `09-01` §8.6; tự hạ mức khi đông người |
| Gian lận nhịp bằng công cụ tự động | trung bình | trung bình | `09-03` §12; kiểm «nghi máy» ở `MG-17`, `MG-04`, `MG-01` |

---

## 12. Mã dùng trong phần này

Chỉ tham chiếu `MG-01` … `MG-24`, `ACT-001` … `ACT-125`, `ACT-K*`. Không tạo mã mới.
