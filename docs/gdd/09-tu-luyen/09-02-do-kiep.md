# 09-02 · Độ kiếp — thử thách văn tu khi lên cảnh giới

> Trong truyện tu tiên, «độ kiếp» là chịu sét trời. Trong Huyền Giới không có sét đánh người (T3). **Kiếp là tâm, trí, đức, nghề**: mỗi lần lên bậc, người chơi đi qua một bài thử ba pha do thầy của đạo thống mình đặt ra, ứng một bước của năm bước cải tâm `remedy-fate › GAI_XIN` (giác → đình → chuyển → tịnh → hóa).
>
> Phần này định nghĩa **40 độ kiếp**: 3 biến thể bậc 2 (theo cửa nhập môn), 9 đạo × 4 bậc (3–6), và độ kiếp chung `ACT-K6-QN` ở Côn Lôn. Mã nằm trong không gian `ACT-*` theo mẫu `ACT-K<bậc đích>-<đạo>`.

---

## 1. Khung chung

### 1.1 Năm kiếp, năm bước

| Lên bậc | Bước `GAI_XIN` | Ý của bài thử | Pha «Tâm» thử điều gì |
|---|---|---|---|
| 2 | 觉 **Giác** — biết niệm đang khởi | biết mình là ai (đọc lá số của mình), biết mình đang bị khích | nhận ra cảm xúc khi bị phán «lá số thấp» |
| 3 | 停 **Đình** — dừng niệm xấu | dừng lại trước lời mời, trước cơn giận, trước sự rối | dừng trước tâm ma mạnh nhất của lá số |
| 4 | 转 **Chuyển** — đổi niệm | đổi cách nhìn: nghịch cảnh thành thầy, lễ thành việc giúp người | chọn đúng «chìa khóa chuyển» (`GAI_XIN.keys4`) |
| 5 | 净 **Tịnh** — rỗng tâm | làm việc khó mà lòng lặng; làm không cần ai thấy | ngồi trong im lặng khi bị quấy |
| 6 | 化 **Hóa** — nghiệp tiêu, mệnh chuyển | trao lại cái mình có; biết dừng | đối diện Khổng tiên sinh lần cuối |

### 1.2 Ba pha của mọi độ kiếp

| Pha | Tên | Dùng gì | Chấm |
|---|---|---|---|
| I | **Nghệ** (tài) | một hoặc hai MG của đạo đó ở mức khó hơn bình thường | điểm `s` của MG ≥ ngưỡng pha |
| II | **Tâm** | cảnh thoại có lựa chọn + đôi khi một MG nhỏ; nội dung theo **tâm ma mạnh nhất** của lá số (`liudao › computeLiuDao(R).poisonTop`: Tham / Sân / Si) | lựa chọn (bảng chấm từng cảnh) |
| III | **Hạnh** (đức) | một việc giúp người hoặc phụng sự trong thế giới | hoàn thành + chất lượng |

**MG mở tạm trong kiếp:** độ kiếp được dùng MG chưa tới bậc mở của người chơi (vd `MG-15` trong `ACT-K3-TV` khi người chơi đang bậc 2; `MG-23` trong `ACT-K4-BD` khi đang bậc 3). MG ấy chỉ mở **cho lượt kiếp**, ở đúng mức kiếp quy định, không tính `K_lặp`, thô của lượt kiếp **không** vào trần ngày (thưởng của kiếp là 50 thô ở §1.6).

**Ngưỡng từng pha theo bậc:**

| Lên bậc | Nghệ (`s` ≥) | Tâm (điểm ≥) | Hạnh |
|---|---|---|---|
| 2 | 0,50 | 0,5 | hoàn thành |
| 3 | 0,55 | 0,6 | hoàn thành, `s` ≥ 0,5 nếu có MG |
| 4 | 0,60 | 0,7 | `s` ≥ 0,6 |
| 5 | 0,65 | 0,7 | `s` ≥ 0,65 |
| 6 | 0,70 | 0,8 | `s` ≥ 0,7 |

### 1.3 Thử lại, không phạt

- Pha đã đạt **được giữ**; chỉ làm lại pha chưa đạt.
- Thử lại một pha sau **20 giờ thực** («một đêm»). Không mất Đạo Hạnh, không mất ngày củng cố, không tốn vật phẩm.
- Sau **3 lần** chưa đạt cùng một pha: thầy đề nghị «**Dìu một đoạn**» — bật trợ năng tối đa cho pha đó (dung sai ×2, gợi ý mở), ngưỡng **không đổi**. Người chơi có thể từ chối.
- Thất bại riêng tư: không thông báo vùng (`09-01` §8.4).
- Rời giữa kiếp (mất mạng, đóng app): pha đang làm tạm dừng 30 phút rồi coi như chưa thử (không tính lần).

### 1.4 Pha Tâm: ba biến thể theo tâm ma

Mỗi độ kiếp có **một cảnh Tâm** do người dẫn của đạo thống dàn dựng; nội dung cảnh đổi theo `poisonTop` của lá số người chơi. Nếu ba độc bằng nhau (chênh < 5% tổng), chọn theo **Kỵ thần** của lá số: Kỵ là Hỏa / Mộc → Sân; Thổ / Kim → Tham; Thủy → Si (quy ước game, ghi trong sổ).

| Độc | Hình thức thử | Lựa chọn đúng (chung mọi bậc) | Lựa chọn «rẽ» |
|---|---|---|---|
| **Tham** (贪) | được mời một đường tắt: Âm Bài của Định Mệnh Hội («×2 Hậu Thiên bảy ngày»), một món quà lớn đổi lấy việc làm sai, «chỉ lần này thôi» | từ chối mà không khinh người mời | **nhận** → pha Tâm chưa đạt **và** mở nhánh Tà Lộ (`TL-xx`, tài liệu 05). Đây là lựa chọn thật, không bẫy: Tà Lộ có đường về (Hồi Đầu) |
| **Sân** (嗔) | bị khích: Khổng tiên sinh (`khong_tiensinh`) phán «lá số ngươi thế, tu cũng vô ích»; một người chơi NPC chen ngang; bị đổ oan | nhận ra cơn giận, không đáp trả bằng lời ác; nói sự thật bình tĩnh hoặc im | mắng lại → chưa đạt (không mở Tà Lộ) |
| **Si** (痴) | bị rối: một cuộn «thiên mệnh» giả hiện ra nói tương lai; một ảo cảnh cho thấy «nếu ngươi sinh giờ khác»; tin đồn | đối chiếu bằng dữ kiện thật (lá số, sổ), không bám vào điều không kiểm được | tin cuộn giả → chưa đạt |

**Chấm cảnh Tâm:** mỗi cảnh có 2–4 điểm lựa chọn; mỗi lựa chọn mang điểm 0 / 0,5 / 1; điểm pha = trung bình. Không có lựa chọn nào bị đánh dấu «sai» trên màn hình — chỉ thấy hậu quả trong câu chuyện.

### 1.5 Hộ pháp (MMO)

Người chơi khác (bạn, đồng môn) đứng trong bán kính 20 m của người đang độ kiếp, bấm «Hộ pháp»:

| Hiệu ứng | Giá trị |
|---|---|
| Người độ kiếp | dung sai thời gian của pha Nghệ ×1,1 (cộng dồn tối đa ×1,2 với 3 người) |
| Người hộ pháp | 1 công / lần (ghi Sổ Công Quá «giúp người»), tối đa 2 lần / ngày; không thô |
| Điều kiện | người hộ pháp phải đứng yên (ngồi bồ đoàn nếu có) trong suốt pha; rời đi thì hiệu ứng mất |

Hộ pháp không làm hộ: không ai chơi thay pha Nghệ, không ai chọn thay ở pha Tâm.

### 1.6 Thưởng chung

| Hạng mục | Giá trị |
|---|---|
| Đạo Hạnh | 50 thô ngoài trần × NT × `K_dụng` của đạo (`09-03` §8) |
| Danh xưng | tên bậc mới + danh xưng môn hạ (`09-01` §2.3) |
| Vật phẩm | `09-01` §6.4 |
| Hiệu ứng | `09-01` §8.4–8.5 |
| Nhật ký | trang «Độ kiếp» trong Sổ Tu ghi ngày, số lần thử, người hộ pháp (nếu có), câu thầy nói |

### 1.7 Đo lường chung của độ kiếp

| Sự kiện | Trường |
|---|---|
| `kiep_open` | `kiep_id, tier_to, tradition, days_since_ready` |
| `kiep_phase` | `kiep_id, phase (nghe/tam/hanh), try_no, score, pass, poison, choice_ids[]` |
| `kiep_assist` | `kiep_id, phase, accepted (bool)` |
| `kiep_result` | `kiep_id, tries_total, hophap_count, minutes_total` |
| `kiep_talo_branch` | `kiep_id` (chọn nhận Âm Bài ở pha Tâm) |

Chỉ tiêu thiết kế: ≥ 70% đạt độ kiếp trong ≤ 2 lần thử mỗi pha; tỉ lệ rẽ Tà Lộ ở pha Tâm Tham nằm trong 5–20% (dưới 5%: cám dỗ quá lộ; trên 20%: cám dỗ quá mạnh hoặc lời thoại «đúng» không đủ hấp dẫn).

---

## 2. Bậc 2 — ba cửa nhập môn (bước Giác)

Lên bậc 2 xảy ra trước khi chọn đạo thống chính. Người chơi chọn **một cửa** — cửa quyết định **họ** tạm thời (`09-01` §2.1). Cả ba cửa có cùng độ khó.

### 2.1 `ACT-K2-DAO` · Khấu Sơn Môn (gõ cửa núi)

| Mục | Nội dung |
|---|---|
| Nơi | cổng Huyền Quán Sơn Môn → Trà Thất |
| Người dẫn | Lão Tùng (`gac_cong`) |
| Nghệ | `MG-01` Tĩnh Tọa, 5 phút, mức Sơ, `s ≥ 0,5` |
| Tâm (Giác) | Lão Tùng mở Sổ Mệnh của người chơi, hỏi ba câu: «Hành nào mạnh nhất trong lá số con?», «Dụng thần của con là gì?», «Mệnh Cách của con thuộc loại nào?» — được phép **mở sổ xem** (giác là biết, không phải thuộc lòng). Sau đó Khổng tiên sinh ở bậc đá phán theo tâm ma (bảng §1.4) |
| Hạnh | quét sân trước chính điện (đi qua 6 điểm lá rụng) và rót trà mời một khách hành hương (`MG-14` mức Sơ, `s ≥ 0,3`) |
| iOS | giữ nguyên (Sổ Mệnh dùng lá số «để học», không hiện vận hạn) |

```
[CẢNH ACT-K2-DAO.2 · bậc đá trước Sơn Môn · giờ Thìn · nắng nhẹ]
KHỔNG TIÊN SINH (khong_tiensinh): (gõ quạt vào lòng bàn tay) Tứ Linh Căn. Điểm bốn mươi mốt. Ta nói trước cho đỡ tốn công: ngươi lên tới Nhập Môn là hết.
> Lựa chọn (biến thể Sân):
  ① «Ông nói vậy là không đúng!» (cao giọng) → [0,5 · K2-DAO.2a]
  ② (im lặng một lúc) «Ông nói làm con thấy nhói. Con ghi nhận cái nhói ấy.» → [1 · K2-DAO.2b]
  ③ «Ông là ai mà dám phán con?» → [0 · K2-DAO.2c]
[K2-DAO.2b] LÃO TÙNG: (từ sau cổng, khẽ) Biết mình đang nhói — thế là qua cửa thứ nhất. Người không biết thì nhói cả đời mà tưởng là giận người khác.
```

Ghi chú: số «bốn mươi mốt / Tứ Linh Căn» là của `MAU-A`; thoại thật lấy `synthesis.score` và `synthesis.gradeVi` của người chơi.

### 2.2 `ACT-K2-PHAT` · Tam Quy

| Mục | Nội dung |
|---|---|
| Nơi | Am Vân Cốc (núi sau Hậu Sơn) |
| Người dẫn | Vân Cốc thiền sư (`van_coc`) |
| Nghệ | `MG-20` Kinh Hành, 5 phút trên đường mòn lên am, mức Sơ, `s ≥ 0,5` |
| Tâm (Giác) | nghe một chuyện ngắn (người nông dân trách trời mất mùa, ghen hàng xóm, rồi lo năm sau) và chỉ ra ba chỗ **tham, sân, si** trong chuyện; sau đó cảnh tâm ma theo lá số |
| Hạnh | gánh hai thùng nước từ suối về am (đi bộ thật 180 m, không ngự vật) và giải một án khách ở Sơn Môn (`cases.js`, `total ≥ 0,5`) — «nương tựa Pháp là đem cái biết giúp người» |
| iOS | giữ nguyên |

### 2.3 `ACT-K2-NHO` · Khai Bút

| Mục | Nội dung |
|---|---|
| Nơi | Bàn Thầy, Sơn Môn → Thư Lâu Lâm |
| Người dẫn | Thầy Tử Bình (`thay_tubinh`) |
| Nghệ | `MG-12` Thư Pháp, viết bốn chữ «命由我作» (`REMEDY_QUOTES[0]`), mức Sơ, `s ≥ 0,5` |
| Tâm (Giác) | 5 câu Hương thí rút gọn (`MG-03`) về **chính lá số** của mình (tứ trụ, hành mạnh, Dụng) rồi cảnh tâm ma |
| Hạnh | giải một án khách (`total ≥ 0,55`) — «học để giúp người, không để hơn người» |
| iOS | giữ nguyên |

**Sau cả ba cửa:** lễ đặt danh (`MG-10` chế độ «của mình», `09-05`): đạo hiệu (Đạo) · pháp danh (Phật) · tự (Nho).

---

## 3. Bậc 3 — dừng (bước Đình)

Diễn ra ở **phân đàn** hoặc **thánh địa** (nếu đã mở) của đạo thống chính. Điều kiện D4: Tu độ đạo chính ≥ 50.

### 3.1 `ACT-K3-CN` · Thủ Đàn Nhất Dạ (Chính Nhất, Long Hổ)

| Mục | Nội dung |
|---|---|
| Người dẫn | Trương Thiên Sư (`truong_thiensu`) |
| Nghệ | giữ đàn một đêm trong game (≈ 12 phút thực, giờ Tuất → Dần nén lại): `MG-19` Bái Đẩu mức Sơ đầu đêm, rồi giữ bảy đèn không tắt — gió lùa 4 lần, mỗi lần người chơi che đèn trong cửa sổ 3 giây |
| Tâm (Đình) | Tham: một phú hộ đến lúc nửa đêm, đặt túi bạc, xin «phù đổi vận cho con trai thi đỗ» · Sân: một đạo sĩ trẻ của phái khác tới chê lễ «toàn hình thức» · Si: đèn bản mệnh chập chờn, người chơi tưởng «điềm xấu» |
| Đình là | dừng tay trước túi bạc / dừng lời trước lời chê / dừng suy diễn trước ngọn đèn |
| Hạnh | `MG-02` Kết Phù mức Sơ cho một em bé sợ bóng tối trong làng dưới núi — người chơi phải nói với mẹ em: phù là «tâm ấn» để em yên lòng, không thay được đèn ngủ và sự ở bên của mẹ |
| iOS | `MG-02` dưới tên «Họa Văn Ngũ Bộ»; câu thoại giữ ý «vật trao để yên lòng» |

### 3.2 `ACT-K3-TV` · Thủ Lô Tam Canh (Thanh Vi · Đan Đỉnh, Võ Đang)

| Mục | Nội dung |
|---|---|
| Người dẫn | Huyền Hư chân nhân (`huyen_hu`), Đan Đỉnh chân nhân (`dan_dinh`) |
| Nghệ | `MG-01` Tĩnh Tọa 10 phút **mức Trung** (`s ≥ 0,55`) cạnh lò đan; rồi `MG-15` Luyện Đan mức Sơ ra ít nhất Hạ phẩm |
| Tâm (Đình) | trong lúc tĩnh tọa, tạp niệm của **độc mạnh nhất** dày gấp đôi và đi qua tâm vòng (như mức Thâm của `MG-01`); chấm phần «để yên» `Đ ≥ 0,7` thay cho thoại |
| Hạnh | hái 3 vị **đúng mùa** (`MG-13`, `m = 1`) mang cho lão tiều phu bị đau lưng ở chân núi, kèm lời khuyên «nghỉ ngơi và đi khám thầy thuốc» |
| iOS | giữ nguyên |

### 3.3 `ACT-K3-TC` · Thất Nhật Thanh Quy (Toàn Chân · Linh Bảo, phân đàn Sơn Môn hoặc Chung Nam)

| Mục | Nội dung |
|---|---|
| Người dẫn | Khâu đạo trưởng (`khau_daotruong`); ở phân đàn: Lão Tùng thay mặt |
| Nghệ | **bảy ngày tu** (không cần liền nhau, trong 14 ngày): mỗi ngày một Tảo khóa `MG-06` (`s ≥ 0,55`) |
| Tâm (Đình) | ngày thứ tư: cảnh tâm ma; ngày nào cũng có một «giới nhỏ» (không nói dối NPC trong án, không cãi nhau trong kênh chat môn phái — kênh chat chỉ theo dõi từ cấm đã có của tài liệu 10) |
| Hạnh | đánh chuông sáng `MG-17` cho cả quán **3 buổi** trong bảy ngày |
| Thất bại riêng | phạm giới nhỏ trong bảy ngày không hủy kiếp: ngày đó không tính, phải bù |
| iOS | giữ nguyên |

### 3.4 `ACT-K3-TT` · Tồn Tư Thất Tinh (Thượng Thanh · Lư Sơn, phân đàn Trích Thiên Đỉnh hoặc Mao Sơn)

| Mục | Nội dung |
|---|---|
| Người dẫn | Mao Sơn đạo nhân (`maoshan_daonhan`) |
| Nghệ | đêm trên đỉnh: nhận bảy sao Bắc Đẩu trên bầu trời thật (như `MG-19` mức Viên Thông, chỉ phần tìm sao) rồi `MG-01` 5 phút mức Trung |
| Tâm (Đình) | Si: một dân làng chạy lên báo «hồn con tôi bị bắt», đòi đạo nhân làm lễ ngay — người chơi phải **dừng** việc tin ngay · Tham: ông ta đưa vàng · Sân: ông ta trách «đạo sĩ gì mà không cứu» |
| Hạnh | xuống làng: `MG-07` Bốc Thuốc cho đứa trẻ (sốt, biếng ăn) — đáp án đúng gồm «đưa đi khám ngay» |
| iOS | thay chữ «hồn bị bắt» bằng «con tôi hoảng sợ, mất ngủ» |

### 3.5 `ACT-K3-BD` · Đề Đăng Dạ Hành (Bắc Đế · Động Uyên, phân đàn Thái Tuế Điện)

| Mục | Nội dung |
|---|---|
| Người dẫn | người giữ Thái Tuế Điện (NPC phụ — tài liệu 06 cấp mã); Phán quan Thôi (`phan_quan`) hiện trong giấc mộng cuối kiếp |
| Nghệ | `MG-19` Bái Đẩu tại Thái Tuế Điện mức Sơ, rồi đọc **gia phả** một nhà trong Huyền Thành — bản nhẹ của `MG-23`: phân loại 3 trang, có 1 trang «không phải nghiệp» |
| Tâm (Đình) | Sân: hai anh em nhà ấy cãi nhau chuyện chia đất ngay trước điện · Tham: người anh hứa «chia cho thầy một phần nếu thầy nói em tôi bị quả báo» · Si: một bà cụ xin thầy xem «ông nhà tôi dưới kia có khổ không» |
| Hạnh | thắp đèn an Thái Tuế (`state.js › lightLamp`) thay cho bà cụ không leo được bậc |
| iOS | phân đàn chuyển về Đạo Tạng các ở Thư Lâu Lâm; `MG-19` bản iOS; bỏ đèn Thái Tuế, thay bằng chép một trang kinh Bắc Đế bằng `MG-12` tặng bà cụ |

### 3.6 `ACT-K3-TH` · Ngồi Dưới Trúc (Thiền, Yên Tử)

| Mục | Nội dung |
|---|---|
| Người dẫn | Thiền sư Pháp Không (`truclam_thiensu`) |
| Nghệ | `MG-01` 10 phút ở thiền đường Yên Tử, mức Trung |
| Tâm (Đình) | `MG-11` Công Án — một công án, **hai ngày liền** quay lại (kiên trì là điểm, `09-05` MG-11); cảnh tâm ma xen giữa hai ngày |
| Hạnh | dẫn một cụ già đi chặng 1 (Giải Oan → Huệ Quang) bằng `MG-20` — tốc độ bị giới hạn theo cụ, phải dừng chờ khi cụ nghỉ |
| iOS | `MG-11` bản «Sổ Tham Thoại» không AI |

### 3.7 `ACT-K3-TD` · Thập Niệm (Tịnh Độ, phân đàn Cùng Thông Hồ hoặc Bút Tháp)

| Mục | Nội dung |
|---|---|
| Người dẫn | Ni sư Diệu Âm (`dieu_am`) |
| Nghệ | `MG-06` chế độ niệm Phật mức Trung (`s ≥ 0,55`) |
| Tâm (Đình) | Tham: người bán chim phóng sinh mời «mua một lồng tích phúc giảm giá cho thầy» · Sân: khách chen hàng niệm Phật, xô người chơi · Si: tin đồn «thả cá ngày rằm được phúc gấp mười» |
| Hạnh | `MG-21` Phóng Sinh một tình huống (`s ≥ 0,6`); rồi (web) `MG-16` thả một đèn tưởng niệm cùng một bà góa ở bờ hồ |
| iOS | thay `MG-16` bằng cùng bà góa quét lá ở bờ hồ, nghe bà kể chuyện (cảnh thoại) |

### 3.8 `ACT-K3-MT` · Thất Nhật Chuẩn Đề (Mật — Chuẩn Đề, phân đàn Am Vân Cốc)

| Mục | Nội dung |
|---|---|
| Người dẫn | Vân Cốc thiền sư (`van_coc`) — người truyền Chuẩn Đề cho Liễu Phàm (`remedy-fate › ZHUNTI.principle`) |
| Nghệ | bảy ngày tu, mỗi ngày `MG-06` chế độ trì chú 21 biến (nhịp mõ; chỉ hiện tên chú và số biến, không bắt đọc phiên âm — `ZHUNTI.mantra` chỉ hiện trong thẻ tham khảo) và một `MG-18` Họa Luân bất kỳ |
| Tâm (Đình) | ngày thứ tư, cảnh tâm ma; mỗi ngày viết **một dòng công – quá** (`ACT-071`) — đúng phương pháp «trì Chuẩn Đề + công quá cách» của `ZHUNTI.how` |
| Hạnh | ghi đủ 7 ngày công quá, trong đó ít nhất 3 công thiện thật trong game |
| iOS | giữ nguyên |
| Lưu ý | Tạng truyền chờ tham vấn; độ kiếp này chỉ dùng Chuẩn Đề (Hán truyền) như `remedy-fate` đã có |

### 3.9 `ACT-K3-NH` · Hương Thí Nhập Giám (Nho, phân đàn Thư Lâu Lâm)

| Mục | Nội dung |
|---|---|
| Người dẫn | Thầy Tử Bình (`thay_tubinh`) ở Thư Lâu; thư của Tế tửu (`te_tuu`) gửi về |
| Nghệ | `MG-03` Hương thí `s ≥ 0,7` trong **3 ngày khác nhau** của một tuần |
| Tâm (Đình) | Sân: một thư sinh NPC chế giễu bài của người chơi trước mọi người · Tham: hắn đề nghị đổi bài cho nhau · Si: lời đồn «đề Hương thí mai đã lộ» |
| Hạnh | dạy chữ cho một em bé làng: `MG-12` chế độ «viết cùng» (người chơi viết mẫu, em viết theo) 3 chữ |
| iOS | giữ nguyên |

---

## 4. Bậc 4 — chuyển (bước Chuyển)

Diễn ra ở **tổ đình** (thánh địa của đạo chính, đã mở nhờ quy tắc thỉnh tổ đình). D4: Tu độ đạo chính ≥ 250; D3: công ≥ 20. Pha Tâm ở bậc 4 luôn có bước chọn **chìa khóa chuyển** (`GAI_XIN.keys4`).

### 4.1 `ACT-K4-CN` · Trai Tiếu Tiểu Đàn (Chính Nhất, Long Hổ)

| Mục | Nội dung |
|---|---|
| Nghệ | dựng một lễ nhỏ cho làng: `MG-09` chọn ngày (`s ≥ 0,6`), `MG-19` mức Trung, `MG-02` mức Trung cho 3 gia đình |
| Tâm (Chuyển) | Khổng tiên sinh đứng ngoài đàn: «Lễ là buôn bán. Ngươi nhận tiền thì có khác gì Định Mệnh Hội?» — người chơi chọn cách **chuyển** lời buộc tội thành câu hỏi thật cho chính mình (逆增上缘), rồi trả lời bằng việc làm |
| Hạnh | từ chối lễ vật bằng tiền của cả 3 gia đình; với mỗi nhà, đưa một lời khuyên thực tế miễn phí theo Dụng thần của chủ nhà (như `RB5.caveatTemplate`) |
| iOS | giữ (với `MG-02` bản iOS) |

### 4.2 `ACT-K4-TV` · Cửu Chuyển Sơ Thành (Thanh Vi · Đan Đỉnh, Võ Đang)

| Mục | Nội dung |
|---|---|
| Nghệ | `MG-15` ra **Trung phẩm** trở lên; `MG-04` trọn bài (mọi thức mở ở mức Trung) `s ≥ 0,6`; `MG-01` mức Thâm 10 phút |
| Tâm (Chuyển) | trong `MG-01`, ba vọng niệm lớn hiện ra như ở `MG-20` (cùng cơ chế giác – đình – chuyển) — chọn chìa khóa hợp |
| Hạnh | dạy Thái Cực cho hai cụ già ở sân Tử Tiêu (chế độ «dẫn tập» của `MG-04`: người chơi làm mẫu chậm, NPC làm theo) |
| iOS | giữ nguyên |

### 4.3 `ACT-K4-TC` · Vân Thủy Du Phương (Toàn Chân · Linh Bảo, Chung Nam)

| Mục | Nội dung |
|---|---|
| Nghệ | trong 7 ngày đi qua 5 vùng khác nhau (không dùng súc địa — đi bộ hoặc ngự kiếm), ở mỗi nơi làm một Tảo khóa `MG-06` tại điện thờ của vùng (`s ≥ 0,6`) |
| Tâm (Chuyển) | ở vùng thứ ba, chủ quán trọ không cho «quải đơn» (ở nhờ) và mắng — chọn chìa khóa 顺受 hoặc 逆增上缘 |
| Hạnh | ở mỗi vùng làm một việc nhỏ cho người ở đó (một án khách, một bốc thuốc, một chọn ngày) — 5 việc, mỗi việc `s ≥ 0,6` |
| iOS | giữ nguyên |

### 4.4 `ACT-K4-TT` · Hộ Thôn (Thượng Thanh · Lư Sơn, Mao Sơn)

| Mục | Nội dung |
|---|---|
| Nghệ | `MG-24` Tam Chẩn mức Trung ở **ba làng** (`s ≥ 0,6` mỗi ca) |
| Tâm (Chuyển) | ở làng thứ ba, dân làng đã đốt nhà một bà bị đồn «nuôi bùa»; người chơi gặp bà ngồi trước tro — chuyển nỗi giận thành việc làm: tìm ra kẻ cài vật «yểm» (Định Mệnh Hội) và nói với làng |
| Hạnh | dựng lại một gian bếp cho bà (hoạt động xây dựng nhỏ của tài liệu 08: đặt 4 mô-đun), vận động 3 nhà góp công |
| iOS | `MG-24` bản iOS; cảnh «nuôi bùa» đổi thành «bị đồn mang xui» |

### 4.5 `ACT-K4-BD` · Dẫn Lộ (Bắc Đế · Động Uyên, Phong Đô — khu đạo tràng)

| Mục | Nội dung |
|---|---|
| Nghệ | `MG-23` Sổ Nghiệp mức Sơ, **hai sổ** (`s ≥ 0,6`) |
| Tâm (Chuyển) | Si: Phán quan mở **sổ của chính người chơi** — những lỗi trong game (nếu chưa từng phạm: những lần bỏ ngang lời hứa với NPC) — người chơi chọn chìa khóa 消业想 / 还债想 và **tự sám** |
| Hạnh | việc hoàn trả của một trong hai sổ (nhiệm vụ ở Huyền Thành do tài liệu 05 cấp `DEED-*`) |
| iOS | Phong Đô hiện dạng văn khố (`09-07` MG-23 §5.13) |

### 4.6 `ACT-K4-TH` · Bảy Ngày Một Câu (Thiền, Yên Tử)

| Mục | Nội dung |
|---|---|
| Nghệ | `MG-11` Công Án: một câu, **bảy ngày tu** quay lại (không cần liền); điểm kiên trì `≥ 0,6` theo rubric `09-05` |
| Tâm (Chuyển) | ngày thứ năm, Pháp Không bỏ đi vắng; một vị khách tự xưng «đã ngộ» đưa cho người chơi «đáp án công án» — chuyển: không cầm đáp án của người khác |
| Hạnh | `MG-20` trọn tuyến Yên Tử (bốn chặng) cùng một nhóm khách hành hương NPC, dạy họ dừng khi vọng niệm |
| iOS | `MG-11` bản «Sổ Tham Thoại» |

### 4.7 `ACT-K4-TD` · Niệm Phật Thất (Tịnh Độ, Bút Tháp)

| Mục | Nội dung |
|---|---|
| Nghệ | bảy ngày tu, mỗi ngày `MG-06` niệm Phật mức Thâm (`s ≥ 0,6`) |
| Tâm (Chuyển) | ngày thứ năm, tin nhà một NPC thân quen mất người — người chơi được mời nói lời an ủi; chuyển nỗi buồn của họ (và của mình) bằng chìa khóa 顺受 |
| Hạnh | `MG-21` mức Thâm (tình huống người bán chim) và chủ trì sám hối nhỏ cho 3 NPC (`MG-06` chế độ sám hối, người chơi giữ nhịp mõ) |
| iOS | giữ nguyên |

### 4.8 `ACT-K4-MT` · Đàn Cát Đầu Tiên (Mật, Tạng Địa hoặc Am Vân Cốc)

| Mục | Nội dung |
|---|---|
| Nghệ | `MG-05` Mạn-đà-la Cát đàn lớn mức Trung, `s ≥ 0,6` |
| Tâm (Chuyển) | Tham: trước khi xóa, một thương nhân NPC đề nghị mua cả đàn cát «đem về thờ» với giá lớn; người chơi chuyển niệm tiếc thành niệm cho (vô thường) |
| Hạnh | dẫn dân làng ra suối đổ cát, mỗi người một vốc (`MG-05` bước xóa ở chế độ tập thể) |
| Lưu ý | bố cục đàn chỉ là hoa văn hình học và sen chung (Tạng truyền chờ tham vấn — `09-04` MG-05) |
| iOS | giữ nguyên |

### 4.9 `ACT-K4-NH` · Hội Thí (Nho, Văn Miếu)

| Mục | Nội dung |
|---|---|
| Nghệ | `MG-03` Hội thí `s ≥ 0,7` (một lần trong kỳ tuần) và `MG-22` Đối Chất mức Trung `s ≥ 0,6` |
| Tâm (Chuyển) | Sân: kết quả Hội thí bị một quan trường NPC «đánh tụt» vì người chơi không biếu lễ — chuyển: không oán (Hiền nhân: không oán trời, không trách người), dùng đường chính đáng (đơn trình Tế tửu) |
| Hạnh | `MG-10` Đặt tên cho 3 trẻ sơ sinh trong làng, đọc lời giải nghĩa tên cho cha mẹ |
| iOS | giữ nguyên |

---

## 5. Bậc 5 — rỗng tâm (bước Tịnh)

Tổ đình. D3: công ≥ 60; D2: 20 ngày tu. Pha Tâm ở bậc 5 có **thử im lặng**: một cảnh trong đó lựa chọn tốt nhất là **không làm gì** trong 30–60 giây khi bị quấy (giữ máy yên — đo bằng không thao tác).

### 5.1 `ACT-K5-CN` · Lôi Đình Bất Động (Chính Nhất, Long Hổ)

| Mục | Nội dung |
|---|---|
| Nghệ | giữa cơn giông lớn trên núi (sấm xa, không sét đánh người), hoàn thành **3 phiếu kết phù** do **người chơi khác** đặt (MMO: phiếu treo ở Thiên Sư Phủ; ngoại tuyến: phiếu NPC) bằng `MG-02` mức Thâm, `s ≥ 0,65` mỗi phiếu |
| Tâm (Tịnh) | thử im lặng: sấm nổ gần, gió tạt mở cửa điện; người chơi giữ yên 45 giây không thao tác |
| Hạnh | không nhận gì từ ba người đặt phiếu (từ chối quà trong giao diện trao đổi) |
| iOS | `MG-02` bản iOS |

### 5.2 `ACT-K5-TV` · Thai Tức (Thanh Vi · Đan Đỉnh, Võ Đang)

| Mục | Nội dung |
|---|---|
| Nghệ | `MG-01` 15 phút mức Viên Thông (vòng gần như vô hình, «thai tức») `s ≥ 0,65`; `MG-15` ra **Thượng phẩm** một lần |
| Tâm (Tịnh) | thử im lặng trong lúc tĩnh tọa: một đệ tử nhỏ chạy vào gọi «thầy ơi có khách!» ba lần — đúng là thở tiếp, không đứng dậy (khách là thầy Huyền Hư thử) |
| Hạnh | tặng đan Thượng phẩm cho sư phụ và hai người khác, không giữ viên nào |
| iOS | giữ nguyên |

### 5.3 `ACT-K5-TC` · Tọa Tam Canh (Toàn Chân · Linh Bảo, Chung Nam)

| Mục | Nội dung |
|---|---|
| Nghệ | ba ngày tu liền, mỗi ngày `MG-01` mức Thâm 15 phút; ngày thứ ba **chủ trì** Tảo khóa cho đạo tràng (`MG-06` chế độ chủ lễ: người chơi giữ nhịp, 6 NPC theo) `s ≥ 0,65` |
| Tâm (Tịnh) | thử im lặng: trong buổi chủ lễ, một đạo sĩ NPC cố tình gõ lệch nhịp; đúng là giữ nhịp của mình, không dừng lại sửa người |
| Hạnh | chép một trang Đạo Tạng (`MG-12` mức Thâm, câu từ `library-data` lớp `daozang`) tặng thư viện Chung Nam |
| iOS | giữ nguyên |

### 5.4 `ACT-K5-TT` · Kim Quang Hộ Thân (Thượng Thanh · Lư Sơn, Mao Sơn)

| Mục | Nội dung |
|---|---|
| Nghệ | `MG-01` chế độ tồn tưởng (mức Thâm, lời dẫn `GONG_CUNXIANG`) và `MG-24` mức Thâm với ca có nguy hiểm thật (CO) `s ≥ 0,65` |
| Tâm (Tịnh) | thử im lặng: trong đêm ở nhà bệnh nhân, tiếng động lạ ngoài sân (mèo, gió); người nhà hoảng — đúng là ngồi yên, không «làm lễ» vội, rồi mới ra xem bằng đèn |
| Hạnh | ở lại làng ba ngày tu, mỗi ngày ghé thăm bệnh nhân (thăm hỏi — cảnh thoại ngắn) |
| iOS | `MG-24` bản iOS |

### 5.5 `ACT-K5-BD` · Phán Văn (Bắc Đế · Động Uyên, Phong Đô)

| Mục | Nội dung |
|---|---|
| Nghệ | `MG-23` mức Thâm: sổ ba đời của một gia đình, `s ≥ 0,65` |
| Tâm (Tịnh) | Sân: con cháu đời thứ ba (người sống) đến Phong Đô đòi «trừng phạt» ông tổ; thử im lặng: để họ nói hết 60 giây không ngắt lời; sau đó mới đáp |
| Hạnh | hòa giải: dẫn con cháu làm việc hoàn trả cho nhà bị hại năm xưa (`DEED-*`) |
| iOS | Phong Đô dạng văn khố |

### 5.6 `ACT-K5-TH` · Kiến Tánh (Thiền, Yên Tử)

| Mục | Nội dung |
|---|---|
| Nghệ | `MG-20` mức Viên Thông (không thẻ chìa khóa) trọn tuyến trong 2 ngày; `MG-11` một công án với chế độ «đáp bằng im lặng» (gửi khung trống được chấp nhận và chấm theo số ngày quay lại) |
| Tâm (Tịnh) | thử im lặng trên đỉnh Chùa Đồng: Pháp Không hỏi «Con là ai?» ba lần; mọi câu trả lời bằng chữ đều được nghe, nhưng **im lặng 60 giây** được 1 điểm (lựa chọn chữ hay được 0,5) |
| Hạnh | xuống núi về chợ Huyền Thành giải 3 án khách liền trong ngày («cư trần») `total ≥ 0,65` |
| iOS | `MG-11` bản «Sổ Tham Thoại» |

### 5.7 `ACT-K5-TD` · Bách Bát Lạy (Tịnh Độ, Bút Tháp)

| Mục | Nội dung |
|---|---|
| Nghệ | `MG-06` chế độ lạy: **108 lạy** chia 3 đợt trong một ngày (mỗi đợt 36 lạy chậm), `s ≥ 0,65` |
| Tâm (Tịnh) | trong đợt thứ ba, khách hành hương chụp ảnh, bàn tán về người chơi; thử im lặng: lạy tiếp không dừng, không quay lại |
| Hạnh | dẫn phóng sinh tập thể (`MG-21` mức Viên Thông, nhóm 5 NPC hoặc người chơi) |
| iOS | giữ nguyên |

### 5.8 `ACT-K5-MT` · Ba Đàn Vô Thường (Mật, Tạng Địa)

| Mục | Nội dung |
|---|---|
| Nghệ | ba ngày tu, mỗi ngày một `MG-05` đàn lớn mức Thâm, xóa cả ba; `s ≥ 0,65` |
| Tâm (Tịnh) | ngày thứ ba, gió thổi mất một góc đàn trước khi xong; thử im lặng: không làm lại góc ấy, hoàn thành phần còn lại rồi xóa |
| Hạnh | tặng cát của đàn thứ ba cho dân bản mang về rải ruộng |
| Lưu ý | chờ tham vấn Tạng truyền; nếu tham vấn yêu cầu, thay bối cảnh Tạng Địa bằng Am Vân Cốc |
| iOS | giữ nguyên |

### 5.9 `ACT-K5-NH` · Đình Thí (Nho, Văn Miếu)

| Mục | Nội dung |
|---|---|
| Nghệ | `MG-03` Đình thí `s ≥ 0,75` (một kỳ tháng âm) |
| Tâm (Tịnh) | thử im lặng trong phần ứng đối: Tế tửu hỏi một câu khó rồi **ngồi im** — người chơi nào vội nói lấp khoảng lặng được 0,5; người ngồi đợi 30 giây rồi mới đáp được 1 |
| Hạnh | mở «lớp dạy chữ» ở Thư Lâu Lâm cho 3 người chơi bậc 1–2 hoặc 3 NPC (một buổi, `MG-12` chế độ dạy) |
| iOS | giữ nguyên |

---

## 6. Bậc 6 — hóa (bước Hóa), phần của từng đạo

Tổ đình. D3: công ≥ 150; D2: 30 ngày tu; D4: Quy nhất. Hoàn thành `ACT-K6-<đạo>` thì ba vị thầy dựng Vân Kiều, mở `ACT-K6-QN` (§7). Bậc 6 không có pha Nghệ khó hơn bậc 5 — kiếp cuối thử **sự trao lại** và **biết dừng**.

| Mã | Đạo | Pha Nghệ | Pha Tâm (Hóa) | Pha Hạnh |
|---|---|---|---|---|
| `ACT-K6-CN` · Truyền Đăng | Chính Nhất | `MG-19` dẫn lễ tập thể 7 người (mức Viên Thông) `s ≥ 0,7` | Trương Thiên Sư trao «ấn» (vật phẩm thẩm mỹ) rồi hỏi: «Ấn này ở tay con có khác gì ở tay kẻ bán bùa?» — trả lời bằng việc: từ nay mọi `MG-02` cho NPC của người chơi không nhận lễ vật | dạy một đệ tử (người chơi hoặc NPC) hoàn thành `MG-02` mức Sơ |
| `ACT-K6-TV` · Hoàn Hư | Thanh Vi · Đan Đỉnh | `MG-01` 15 phút **không giao diện** (không vòng, không đồng hồ, không điểm — chấm ngầm theo nhịp thao tác) `s ≥ 0,7` | Huyền Hư hỏi người chơi muốn mang theo gì lên Côn Lôn; đáp án tốt nhất: không mang gì — tặng hết đan trong kho | dạy Thái Cực cho đệ tử |
| `ACT-K6-TC` · Phong Đàn | Toàn Chân · Linh Bảo | chủ trì Tảo khóa và Vãn khóa cùng ngày `s ≥ 0,7` | Khâu đạo trưởng mời người chơi làm trụ trì Chung Nam; đáp án tốt nhất: từ chối, xin tiếp tục vân du | quét sạch đạo tràng (đi qua 12 điểm) một mình lúc rạng sáng |
| `ACT-K6-TT` · Quy Sơn | Thượng Thanh · Lư Sơn | `MG-24` mức Viên Thông (ca cấp cứu) `s ≥ 0,7` | dân làng muốn lập miếu thờ người chơi; đáp án tốt nhất: khuyên lập trạm y tế / lớp học thay miếu | dạy một đệ tử thứ tự «thân trước, nhà sau» (đệ tử hoàn thành một ca `MG-24` mức Sơ) |
| `ACT-K6-BD` · Khép Sổ | Bắc Đế · Động Uyên | `MG-23` mức Viên Thông (giải oan hai phía) `s ≥ 0,7` | Phán quan đưa bút cho người chơi «tự ghi sổ mình»; đáp án tốt nhất: ghi cả công lẫn quá, không xóa quá | dẫn một vong cuối cùng ra cửa Phong Đô cùng Địa Tạng sứ giả (cảnh) |
| `ACT-K6-TH` · Cư Trần | Thiền | `MG-20` dẫn đoàn hành hương mức Viên Thông | Pháp Không: «Lên tới đây rồi, xuống làm gì nữa?» — đáp án tốt nhất: chọn xuống núi | một ngày ở chợ Huyền Thành: giải án, bốc thuốc, mời trà cho người lạ (5 việc nhóm Hạnh / Tĩnh) |
| `ACT-K6-TD` · Hồi Hướng | Tịnh Độ | `MG-06` chủ trì niệm Phật tập thể `s ≥ 0,7` | Diệu Âm hỏi người chơi muốn hồi hướng toàn bộ công đức cho ai; đáp án tốt nhất: cho tất cả, kể cả người từng làm mình khổ (gọi tên được một NPC đối thủ trong cốt truyện) | dạy một đệ tử `MG-21` mức Sơ |
| `ACT-K6-MT` · Không Giữ | Mật | `MG-05` đàn lớn mức Viên Thông `s ≥ 0,7` | sau khi xóa, Đa Kiệt (`lama_dakiet`; chờ tham vấn — có thể thay bằng Vân Cốc) hỏi «Đàn đẹp nhất của con là đàn nào?» — đáp án tốt nhất: «đàn chưa vẽ» hoặc im lặng | dạy một đệ tử dựng và xóa một khay nhỏ |
| `ACT-K6-NH` · Biết Dừng | Nho | `MG-03` ra đề cho một kỳ Hương thí của người chơi khác (chế độ ra đề: chọn 10 câu từ ngân hàng, máy kiểm độ khó cân đối) | Tế tửu đề nghị khắc tên người chơi lên bia (như bia Tiến sĩ); đáp án tốt nhất: xin khắc tên **thầy** mình (Thầy Tử Bình) thay vào | mở lớp dạy chữ lần hai |

**iOS cho bậc 6:** `ACT-K6-BD` dạng văn khố; `ACT-K6-MT` đổi người dẫn sang Vân Cốc nếu chưa có kết quả tham vấn; còn lại giữ nguyên.

---

## 7. `ACT-K6-QN` · Quy Nhất (Côn Lôn Thiên Trì — độ kiếp chung)

### 7.1 Điều kiện mở

- Xong `ACT-K6-<đạo chính>`.
- Quy nhất (≥ 3 đạo Nhập Thất), công ≥ 150, không Nợ Âm, đủ 30 ngày tu ở bậc 5.

### 7.2 Diễn tiến

| Đoạn | Nơi | Nội dung | Chấm |
|---|---|---|---|
| Vân Kiều | quảng trường tổ đình → trời | ba vị thầy của **ba đạo người chơi đang tu** đứng thành tam giác, mỗi người thả một dải mây; ba dải thành cầu. Người chơi đi bộ trên cầu 400 m (không bay được trên cầu) | đi hết cầu (không chấm) |
| Cửa thứ nhất | Côn Lôn, bờ Thiên Trì | MG đặc trưng của **đạo phụ thứ nhất**, mức Thâm, `s ≥ 0,7` | Nghệ |
| Cửa thứ hai | Côn Lôn, rừng đào | MG đặc trưng của **đạo phụ thứ hai**, mức Thâm, `s ≥ 0,7` | Nghệ |
| Gương Thiên Trì | mặt hồ | mặt nước hiện **Mệnh Đồ** của người chơi (sáu tầng `gaimenh › gaimenhPlan(R)`: Không gian → Tên → Thời → Thái Tuế → Làm công → Tích âm đức — canon §6), mỗi tầng đã đi tới đâu. Người chơi chọn một câu để lại bên hồ, từ `remedy-fate › REMEDY_QUOTES` | Tâm (không có đáp án sai — mọi câu hợp lệ; chấm theo việc dừng đọc Mệnh Đồ ≥ 60 giây) |
| Lần cuối gặp Khổng tiên sinh | mỏm đá trên hồ | Khổng tiên sinh (canon: đoán đúng mọi điều — phản đề) đọc lại lời phán năm xưa về người chơi (từ cảnh `ACT-K2-*`), chỉ ra rằng ông vẫn «đúng» ở mọi điều đã xảy ra. Người chơi đáp | Tâm (bảng §7.3) |
| Hợp đạo | giữa hồ | ngồi tĩnh tọa trên mặt nước 3 phút, **không giao diện**; khi đứng dậy: bậc 6 | Hạnh = toàn bộ hành trình (đã kiểm ở điều kiện) |

### 7.3 Cảnh Khổng tiên sinh

```
[CẢNH ACT-K6-QN.4 · mỏm đá trên Thiên Trì, Côn Lôn · không có giờ · mây ngang chân]
KHỔNG TIÊN SINH (khong_tiensinh): (mở cuốn sổ cũ, chữ đã nhạt) Năm ấy ta nói: «Tứ Linh Căn. Lên tới Nhập Môn là hết.» Ta sai chỗ ấy. Nhưng ta đúng chỗ khác — ngươi từng giận, từng tiếc, từng muốn bỏ. Ta biết ngươi hơn ngươi tưởng.
> Lựa chọn:
  ① «Ông đúng. Những điều ấy đều có thật.» → [1 · QN.4a]
  ② «Ông chỉ đoán trúng quá khứ thôi.» → [0,5 · QN.4b]
  ③ «Ông đã sai, thế là đủ.» → [0,5 · QN.4c]
  ④ (im lặng, rót cho ông một chén trà) → [1 · QN.4d]
[QN.4a] NGƯỜI CHƠI: Ông đúng về cái hạt. Ông chỉ không tính người tưới.
KHỔNG TIÊN SINH: (gấp sổ) Người tưới… Phải. Sổ ta không có cột ấy.
[QN.4d] KHỔNG TIÊN SINH: (nhìn chén trà rất lâu) Năm mươi năm xem số, chưa ai rót trà cho ta. (uống) Có lẽ ta nên học lại từ đầu.
```

Ghi chú tài liệu 03: Khổng tiên sinh là hình ảnh của thầy bói trong điển cố Liễu Phàm (`remedy-fate › LIAOFAN_STORY.story`: «Khổng tiên sinh bói Liễu Phàm…»). Cảnh này khép vòng cốt truyện «Mệnh do ta tạo»; tài liệu 03 có quyền viết lại thoại, giữ cấu trúc chấm.

### 7.4 Thưởng riêng

| Hạng mục | Giá trị |
|---|---|
| Đằng vân | mở (`09-01` §6.5) |
| Gia trì | `phaptuong` |
| Côn Lôn | mở vĩnh viễn (tự bay lên bằng đằng vân) |
| Dấu ấn | câu người chơi để lại bên Thiên Trì hiện cho người chơi khác khi họ đứng ở đúng chỗ ấy (chỉ câu chọn từ `REMEDY_QUOTES`, không có văn bản tự do — an toàn nội dung) |

---

## 8. Kịch bản mẫu đầy đủ — `ACT-K3-TV` (Thủ Lô Tam Canh)

Để đội viết thoại có khuôn, một kịch bản trọn ba pha. Người chơi mẫu: lá số `MAU-A` (Dụng Thủy → Võ Đang hợp Dụng); giả sử `poisonTop` = Sân.

```
[CẢNH ACT-K3-TV.0 · cửa Tử Tiêu cung, Võ Đang · giờ Dậu · sương chiều]
HUYỀN HƯ CHÂN NHÂN (huyen_hu): (không quay lại, tay vẫn quét lá) Sổ của con báo «thời khắc đã tới». Sổ báo, ta chưa thấy.
HUYỀN HƯ CHÂN NHÂN: Đêm nay con giữ lò cho Cát Huyền. Ba canh. Lò không được tắt, con không được ngủ, mà cũng không được vội.
> Lựa chọn: ① «Con xin giữ lò.» → [K3-TV.1]  ② «Ba canh là bao lâu ạ?» → [K3-TV.0b]
[K3-TV.0b] HUYỀN HƯ CHÂN NHÂN: Đủ lâu để con chán. Chán rồi còn ngồi được, mới là ngồi.

[CẢNH ACT-K3-TV.1 · phòng lò đan · giờ Tuất · lửa than đỏ]
ĐAN ĐỈNH CHÂN NHÂN (dan_dinh): (đặt gáo nước cạnh người chơi) Trước khi luyện, ngồi đã. Lò nóng mà người lạnh thì đan hỏng.
→ MG-01 · 10 phút · mức Trung · tạp niệm Sân dày gấp đôi, đi qua tâm vòng.
   Tạp niệm mẫu (Sân): «Hồi chiều thầy nói giọng như chê mình…» · «Người ta lên bậc ba lâu rồi…» · «Ông Khổng ấy…»
   Chấm: s ≥ 0,55 VÀ Đ ≥ 0,7.

[CẢNH ACT-K3-TV.2 · phòng lò đan · giờ Hợi]
ĐAN ĐỈNH CHÂN NHÂN: Giờ thì lửa. Dưỡng Nguyên Đan. Thổ ba, Kim ba, Thủy ba.
→ MG-15 · mức Sơ · ra Hạ phẩm trở lên.

[CẢNH ACT-K3-TV.3 · giữa chuyển thứ năm · sự cố kịch bản]
(Cửa phòng bật mở. Một đạo đồng chạy vào, vấp, làm đổ khay vị thuốc của người chơi.)
ĐẠO ĐỒNG (NPC phụ): (lắp bắp) Con… con xin lỗi! Sư huynh gọi con mà con chạy vội…
> Lựa chọn (pha Tâm, biến thể Sân):
  ① «Ra ngoài!» → [0 · K3-TV.3a]
  ② (thở ra một hơi, nhặt khay) «Không sao. Em giúp anh nhặt lại, rồi đi gọi sư huynh.» → [1 · K3-TV.3b]
  ③ (không nói gì, quay lại quạt lò, mặt lạnh) → [0,5 · K3-TV.3c]
[K3-TV.3b] ĐAN ĐỈNH CHÂN NHÂN: (từ góc phòng, không ngẩng lên) Khay đổ thì nhặt. Lửa giận đổ ra thì không nhặt lại được. Con dừng được rồi đấy.
   (Vị thuốc nhặt lại đủ; chuyển thứ năm được kéo dài 20 giây bù.)
[K3-TV.3c] ĐAN ĐỈNH CHÂN NHÂN: Im lặng mà lạnh cũng là một thứ lửa. Thôi, quạt tiếp.

[CẢNH ACT-K3-TV.4 · chân núi Tử Tiêu · sáng hôm sau, giờ Mão]
LÃO TIỀU PHU (NPC phụ): (ngồi trên bậc, tay chống lưng) Lưng tôi mấy hôm nay cứng như gỗ. Cậu là người trên núi, có thuốc gì không?
→ Pha Hạnh: hái 3 vị đúng mùa (MG-13, m = 1) mang tới; chọn lời dặn có «nghỉ ngơi» và «đi khám thầy thuốc».
LÃO TIỀU PHU: (nhận gói thuốc) Củ mài với hạt óc chó… nấu cháo được. Ừ, mai tôi xuống trạm xá.

[CẢNH ACT-K3-TV.5 · sân Tử Tiêu · giờ Thìn · mưa phùn ấm]
HUYỀN HƯ CHÂN NHÂN: Ba canh. Lò còn đỏ. Người còn tỉnh. Đứa nhỏ kia còn dám vào phòng lò.
HUYỀN HƯ CHÂN NHÂN: Luyện tinh hóa khí, nói cho dễ hiểu: đừng để cái gì đáng giữ chảy mất. Đêm qua con giữ được.
(Cột sáng Huyền Thủy. Sổ Tu: «Thủ Lô · Luyện Tinh Hóa Khí».)
```

---

## 9. Trợ năng, chống gian, iOS — riêng cho độ kiếp

| Hạng mục | Quy định |
|---|---|
| Trợ năng | mọi pha Nghệ dùng trợ năng của MG gốc; «Dìu một đoạn» (§1.3) không đổi ngưỡng; pha «thử im lặng» với người dùng công cụ trợ giúp liên tục (quét công tắc) được tính bằng **không có lệnh hành động** thay vì không có tín hiệu nào |
| Đa ngày | kiếp nhiều ngày (`ACT-K3-TC`, `-MT`, `ACT-K4-TC`, `-TD`, …) cho khung 14 ngày; hết khung giữ các ngày đã làm, mở khung mới |
| Chống gian | mọi pha chấm ở máy chủ; kịch bản pha Tâm sinh từ hạt giống tài khoản; MMO hộ pháp chỉ nhận tài khoản có ≥ 3 ngày tu trong 14 ngày |
| Riêng tư | lựa chọn ở pha Tâm không hiện cho người hộ pháp |
| iOS | đã ghi trong từng thẻ; nguyên tắc chung: bỏ mọi chi tiết vận hạn **của chính người chơi** (Thái Tuế, đèn an Thái Tuế, sao bản mệnh), thay «ma / yểm» bằng «hoảng sợ / tin đồn», không AI |

---

## 10. Bảng tổng 40 độ kiếp

| Mã | Lên bậc | Đạo | Tên | MG chính | Nơi |
|---|---|---|---|---|---|
| `ACT-K2-DAO` | 2 | (cửa Đạo) | Khấu Sơn Môn | 01, 14 | Sơn Môn |
| `ACT-K2-PHAT` | 2 | (cửa Phật) | Tam Quy | 20 | Am Vân Cốc |
| `ACT-K2-NHO` | 2 | (cửa Nho) | Khai Bút | 12, 03 | Sơn Môn, Thư Lâu |
| `ACT-K3-CN` | 3 | CN | Thủ Đàn Nhất Dạ | 19, 02 | Long Hổ |
| `ACT-K3-TV` | 3 | TV | Thủ Lô Tam Canh | 01, 15, 13 | Võ Đang |
| `ACT-K3-TC` | 3 | TC | Thất Nhật Thanh Quy | 06, 17 | Sơn Môn / Chung Nam |
| `ACT-K3-TT` | 3 | TT | Tồn Tư Thất Tinh | 19, 01, 07 | Trích Thiên Đỉnh / Mao Sơn |
| `ACT-K3-BD` | 3 | BD | Đề Đăng Dạ Hành | 19, 23 (nhẹ) | Thái Tuế Điện |
| `ACT-K3-TH` | 3 | TH | Ngồi Dưới Trúc | 01, 11, 20 | Yên Tử |
| `ACT-K3-TD` | 3 | TD | Thập Niệm | 06, 21, 16 | Cùng Thông Hồ / Bút Tháp |
| `ACT-K3-MT` | 3 | MT | Thất Nhật Chuẩn Đề | 06, 18 | Am Vân Cốc |
| `ACT-K3-NH` | 3 | NH | Hương Thí Nhập Giám | 03, 12 | Thư Lâu Lâm |
| `ACT-K4-CN` | 4 | CN | Trai Tiếu Tiểu Đàn | 09, 19, 02 | Long Hổ |
| `ACT-K4-TV` | 4 | TV | Cửu Chuyển Sơ Thành | 15, 04, 01 | Võ Đang |
| `ACT-K4-TC` | 4 | TC | Vân Thủy Du Phương | 06 | 5 vùng |
| `ACT-K4-TT` | 4 | TT | Hộ Thôn | 24 | Mao Sơn |
| `ACT-K4-BD` | 4 | BD | Dẫn Lộ | 23 | Phong Đô |
| `ACT-K4-TH` | 4 | TH | Bảy Ngày Một Câu | 11, 20 | Yên Tử |
| `ACT-K4-TD` | 4 | TD | Niệm Phật Thất | 06, 21 | Bút Tháp |
| `ACT-K4-MT` | 4 | MT | Đàn Cát Đầu Tiên | 05 | Tạng Địa / Am Vân Cốc |
| `ACT-K4-NH` | 4 | NH | Hội Thí | 03, 22, 10 | Văn Miếu |
| `ACT-K5-CN` | 5 | CN | Lôi Đình Bất Động | 02 | Long Hổ |
| `ACT-K5-TV` | 5 | TV | Thai Tức | 01, 15 | Võ Đang |
| `ACT-K5-TC` | 5 | TC | Tọa Tam Canh | 01, 06, 12 | Chung Nam |
| `ACT-K5-TT` | 5 | TT | Kim Quang Hộ Thân | 01, 24 | Mao Sơn |
| `ACT-K5-BD` | 5 | BD | Phán Văn | 23 | Phong Đô |
| `ACT-K5-TH` | 5 | TH | Kiến Tánh | 20, 11 | Yên Tử |
| `ACT-K5-TD` | 5 | TD | Bách Bát Lạy | 06, 21 | Bút Tháp |
| `ACT-K5-MT` | 5 | MT | Ba Đàn Vô Thường | 05 | Tạng Địa |
| `ACT-K5-NH` | 5 | NH | Đình Thí | 03, 12 | Văn Miếu |
| `ACT-K6-CN` | 6 | CN | Truyền Đăng | 19, 02 | Long Hổ |
| `ACT-K6-TV` | 6 | TV | Hoàn Hư | 01, 04 | Võ Đang |
| `ACT-K6-TC` | 6 | TC | Phong Đàn | 06 | Chung Nam |
| `ACT-K6-TT` | 6 | TT | Quy Sơn | 24 | Mao Sơn |
| `ACT-K6-BD` | 6 | BD | Khép Sổ | 23 | Phong Đô |
| `ACT-K6-TH` | 6 | TH | Cư Trần | 20 | Yên Tử → Huyền Thành |
| `ACT-K6-TD` | 6 | TD | Hồi Hướng | 06, 21 | Bút Tháp |
| `ACT-K6-MT` | 6 | MT | Không Giữ | 05 | Tạng Địa |
| `ACT-K6-NH` | 6 | NH | Biết Dừng | 03 | Văn Miếu |
| `ACT-K6-QN` | 6 | chung | Quy Nhất | MG của 2 đạo phụ | Côn Lôn Thiên Trì |

---

## 11. Nghiệm thu độ kiếp

- [ ] 40 độ kiếp có dữ liệu kịch bản (pha, MG, ngưỡng, cảnh Tâm ba biến thể) trong một tệp dữ liệu, không viết cứng trong UI.
- [ ] Pha đã đạt được giữ; thử lại sau 20 giờ; không mất gì khi chưa đạt.
- [ ] Biến thể Tâm chọn đúng theo `poisonTop` (test ba lá số có độc trội khác nhau, một lá số ba độc bằng nhau).
- [ ] Lựa chọn nhận Âm Bài mở `TL-xx` và **không** làm kẹt tiến trình (có đường Hồi Đầu).
- [ ] Hộ pháp không chơi thay; thưởng công trần 2 / ngày.
- [ ] `ACT-K6-QN` dùng MG của **đúng hai đạo phụ** của người chơi; Vân Kiều chỉ xuất hiện một lần.
- [ ] Mọi thẻ iOS đã thay chi tiết vận hạn bản thân.
- [ ] Cố vấn tôn giáo rà bối cảnh từng đạo (đặc biệt Mật / Tạng Địa chờ tham vấn, nghi lễ Chính Nhất, Phong Đô).
