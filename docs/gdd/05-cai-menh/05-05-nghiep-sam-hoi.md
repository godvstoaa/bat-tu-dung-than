# 05-05 · Nghiệp, sám hối và kinh theo việc

> Phần này đặc tả: mười **thanh nghiệp** `KARMA-*` (một thanh cho mỗi ác nghiệp của `YEGUO`), nghiệp phát sinh thế nào (chỉ từ lựa chọn), cảnh báo trước theo lá số (`getYeguoForChart`), năm pháp sám hối `CHAN_HUI` thành nghi lễ trong game, việc **sửa sai bắt buộc**, chuỗi giải nghiệp `CQ-SH-xx`, bảy kinh theo việc `JING_ZHOU` ở Tàng Kinh Các, Chuẩn Đề pháp môn, Lục Đạo, và luật trình bày tôn trọng.
> Engine: `` `remedy-fate › YEGUO` ``, `getYeguoForChart`, `CHAN_HUI`, `CHANHUI_PRINCIPLE`, `JING_ZHOU`, `ZHUNTI`, `LIAOFAN_STORY.rootChain`, `` `liudao › computeLiuDao` `` / `SIX_REALMS`, `` `amta-data › remedies` `` (`remedy-baichan`, `remedy-songjing`), `` `talisman-data` `` (tên chú, không toàn văn).
> Mini-game nghi lễ theo nhịp: tài liệu 09 cấp mã `MG-xx`; phần này chỉ ghi **yêu cầu** (nhịp, thời lượng, độ khó) để 09 dựng.

---

## 1. Nguyên lý

### 1.1 Chuỗi gốc của app

`LIAOFAN_STORY.rootChain`: **心 tâm → 念 niệm → 行 hành → 业 nghiệp → 命 mệnh**. Game đặt mỗi mắt xích vào một cơ chế:

| Mắt xích | Cơ chế game | Phần |
|---|---|---|
| 心 tâm | Tâm Đề, tĩnh tọa, thiền | 05-01 §3.5; 05-06…05-11 |
| 念 niệm | Ngũ Bộ Chuyển Niệm (bắt niệm lúc vừa khởi) | 05-01 §3.4 |
| 行 hành | lựa chọn hội thoại, DEED | 05-04 |
| 业 nghiệp | **thanh nghiệp** `KARMA-*` | phần này |
| 命 mệnh | cảnh giới, Đại Nguyện | 05-01 §4 |

### 1.2 Nguyên lý sám hối của app

`CHANHUI_PRINCIPLE`: «Nghiệp chướng từ TÂM khởi → TÂM chuyển thì NGHIỆP tiêu. Sám hối = **phát lộ** (thừa nhận) + **hối cải** (không làm nữa) + **hồi hướng**.»

Game làm đủ ba phần, không bỏ phần nào:

| Phần | Trong game | Bằng chứng máy nhiệm vụ kiểm |
|---|---|---|
| Phát lộ | người chơi **đọc lại** dòng quá cụ thể của mình trước nghi lễ (không phải «tôi có lỗi» chung chung) | đã mở thẻ sự vụ nghiệp |
| Hối cải | **việc sửa** bắt buộc (§5) + **giữ giới** liên quan trong một khoảng thời gian | việc sửa xong; không tái phạm trong kỳ giữ |
| Hồi hướng | cuối nghi lễ chọn hồi hướng cho **người bị hại** (NPC có tên) hoặc cho «chúng sinh» | lựa chọn hồi hướng |

### 1.3 Ba luật cứng

| Mã | Luật |
|---|---|
| NG-1 | **Nghiệp chỉ đến từ lựa chọn.** Không có nghiệp từ lá số, từ năm hung, từ «kiếp trước», từ ngẫu nhiên. |
| NG-2 | **Không có sám hối chỉ bằng nút.** Mọi giảm nghiệp lớn đòi việc sửa thật trong thế giới game (canon §5.4). |
| NG-3 | **Nghiệp là chuyện riêng.** Thanh nghiệp không bao giờ hiện cho người chơi khác, không vào Thiên Bảng, không lên kênh chung. Chỉ người chơi, và Phán quan Phong Đô khi người chơi tự đến đọc sổ, được thấy. |

---

## 2. Mười thanh nghiệp

### 2.1 Danh mục

| Mã thanh | `YEGUO` | Ác nghiệp (app) | Tên thanh trong game | Hình tượng | `result` (app, tóm) |
|---|---|---|---|---|---|
| KARMA-SAT | [0] | Sát sinh 业 | **Huyết Ấn** | vệt son thẫm | đoản mệnh, nhiều bệnh, tai nạn máu |
| KARMA-DAO | [1] | Thâu đạo 业 | **Hư Nang** (túi thủng) | túi vải rách | nghèo, tiền không giữ, bị lừa |
| KARMA-DAM | [2] | Tà dâm 业 | **Đoạn Tơ** | sợi tơ đỏ đứt | hôn nhân vỡ, tình cảm rối |
| KARMA-VONG | [3] | Vọng ngữ 业 | **Hư Ngôn** | chữ nhòe | không ai tin, bị bôi nhọ |
| KARMA-LUONG | [4] | Lưỡng thiệt 业 | **Song Thiệt** | hai lưỡi rắn cách điệu (mờ, không đáng sợ) | người thân ly tán |
| KARMA-AC | [5] | Ác khẩu 业 | **Gai Lời** | cành gai | thị phi, kiện cáo, thù oán |
| KARMA-Y | [6] | Ỷ ngữ 业 | **Lời Rỗng** | vỏ trấu bay | nói không ai nghe, không uy |
| KARMA-THAM | [7] | Tham 业 | **Hũ Đáy Thủng** | hũ rỗng | không biết đủ, có càng thiếu |
| KARMA-SAN | [8] | Sân 业 | **Lửa Than** | than hồng | mặt ác, nhiều thù, tai nạn |
| KARMA-SI | [9] | Si 业 | **Sương Mù** | màn sương | tối tăm, bạn ác, phúc giảm |

**Không có trên giao diện:** cột `result` của app (quả báo) **không** hiện cạnh thanh. Thanh chỉ có tên, hình, con số và «cách gỡ». Quả báo theo app chỉ xuất hiện trong thẻ Tàng Kinh khi người chơi tự mở đọc, có khung «theo quan niệm của Phật giáo về nghiệp» (tránh dọa — quy tắc §6.4 bản sơ đồ, Diệu Âm «câu cấm: đe dọa nghiệp báo»).

### 2.2 Mức của thanh

| Mức | Khoảng | Gọi | Hệ quả (chỉ nội tâm và thoại; không trừ Đạo Hạnh) |
|---|---|---|---|
| 0 | 0–19 | Nhẹ | không có gì |
| 1 | 20–49 | Vướng | NPC dẫn đạo của đạo đang tu nhắc một lần (thoại); chuỗi `CQ-SH` của thanh mở trong Sổ Mệnh |
| 2 | 50–79 | Nặng | **tâm ma** của thanh xuất hiện trong mini-game tĩnh tọa / thiền (bảng 2.4): thêm tạp niệm theo chủ đề; Ni sư Diệu Âm gửi thư mời |
| 3 | 80–100 | Chướng | **chặn đột phá** cảnh giới (từ bậc 4 trở lên, 05-01 §4.1); không chặn việc gì khác |

### 2.3 Nghiệp phát sinh thế nào

**Hai nguồn, cả hai là lựa chọn:**

| Nguồn | Lượng | Ví dụ |
|---|---|---|
| **DEED ác** (05-04 §14) | thanh chính `+8 × p × count`; thanh phụ (nếu có) `+4 × p × count` | DEED-201 giết gà cúng: KARMA-SAT +24, KARMA-SI +12 |
| **Thẻ nghiệp hội thoại** (không có dòng sổ vì không khớp mục `CONG_QUA` nào) | `+4` mỗi lần, tối đa `+12` / thanh / ngày | xem bảng thẻ dưới |

**Thẻ nghiệp hội thoại** (đánh dấu trên phương án trả lời; hiện biểu tượng nhỏ trước khi chọn):

| Thẻ | Thanh | Loại câu được gắn thẻ | Ghi sổ? |
|---|---|---|---|
| `luong` | KARMA-LUONG | truyền lời người này nói xấu cho người kia; xúi hai bên | không (app không có mục «hai lưỡi» trong `CONG_QUA.ac`) |
| `ac_khau` | KARMA-AC | mắng, chửi, mỉa | có, khi đủ nặng → «Nói lời tổn thương» −1 (DEED-238…241) |
| `y` | KARMA-Y | nói chuyện tục, khoe khoang vô ích, bịa chuyện cho vui | không |
| `vong` | KARMA-VONG | nói dối nhỏ không ai thiệt | không (chỉ dối có hại mới thành DEED A-DT) |
| `tham` | KARMA-THAM | đòi thêm thưởng, ép giá | có khi thành DEED-245 |
| `san` | KARMA-SAN | lời giận dữ, đe dọa | có khi thành DEED-244 |
| `si` | KARMA-SI | khẳng định «mệnh đã định, làm gì cũng vô ích» với người khác; chế giễu nhân quả | không |
| `nghich_thuong` | KARMA-AC (phụ KARMA-SI) | cãi thầy, xúc phạm bậc trên | có khi thành DEED-236 |

**Không có thẻ nghiệp** cho: câu hỏi, im lặng, từ chối giúp (không giúp không phải ác — DEED-206/226), lựa chọn trong mini-game, hành động vô ý (AC-3).

### 2.4 Tâm ma (mức Nặng)

Tâm ma là **tạp niệm có chủ đề** trong mini-game tĩnh tọa (tài liệu 09). Bình thường tạp niệm là hình mây trung tính; ở mức Nặng thêm loại tạp niệm của thanh. Người chơi vẫn đạt điểm tối đa nếu «để yên» (không chạm) đúng cách; tâm ma chỉ làm khó hơn chút, như một lời nhắc từ bên trong.

| Thanh | Tạp niệm thêm | Tần suất thêm |
|---|---|---|
| KARMA-SAT | đốm son đỏ | +1 / 20 giây |
| KARMA-DAO | đồng tiền lăn qua | +1 / 20 giây |
| KARMA-DAM | sợi tơ bay | +1 / 20 giây |
| KARMA-VONG, LUONG, AC, Y | tiếng thì thầm (âm thanh) | +1 / 25 giây |
| KARMA-THAM | hũ, đồ quý | +1 / 20 giây |
| KARMA-SAN | lửa than lóe | +1 / 15 giây |
| KARMA-SI | sương che một phần màn hình | sương 10% |

Nhiều thanh Nặng cùng lúc: cộng tần suất, trần **+3 tạp niệm / 20 giây**.

### 2.5 Giảm nghiệp

**Nghiệp không tự phai theo thời gian.** Chỉ giảm bằng việc làm. Mỗi lần phát sinh nghiệp tạo một **sự vụ nghiệp** (incident) riêng — có ngày, nơi, người bị hại, lượng. Giảm theo sự vụ:

| Cách | Giảm (theo lượng của sự vụ) | Luật |
|---|---|---|
| **Việc sửa** (§5) — bắt buộc | −50% | xong việc sửa thì dòng quá trong sổ được gạch son (05-03 §2) |
| **Nghi lễ sám** của một pháp hợp thanh (§4) | −30% | phải phát lộ đúng sự vụ (trừ «Hồng Danh» là tổng sám) |
| **Giữ giới** liên quan 7 ngày không tái phạm | −20% | giới theo cột 1 của chuỗi `CQ-SH` (§6) |
| **Kinh theo việc** (`JING_ZHOU`, §7) hợp thanh | −10% thêm (có thể vượt 100% để trừ nốt các sự vụ nhỏ cũ) | 1 lần / sự vụ |
| **Tổng sám Hồng Danh** (88 Phật) | −10 mọi thanh (trừ thẳng điểm) | 1 lần / 7 ngày; **không** thay việc sửa |
| **DEED thiện đối trị** (bảng 6) | −2 thanh tương ứng mỗi DEED hữu hiệu | trần −10 / thanh / ngày |

**Sự vụ chưa sửa** sau 30 ngày: không phạt thêm; Ni sư Diệu Âm gửi thư nhắc nhẹ một lần. Người chơi có quyền để sự vụ đó mãi.

**Sự vụ không còn đối tượng** (người bị hại là NPC sự kiện đã kết thúc): việc sửa đổi thành **hồi hướng tương đương** — làm một DEED cùng loại cho người khác hoàn cảnh tương tự (vd không còn tìm được chủ túi tiền → bố thí lượng tương đương ở hòm chùa với ghi chú «trả thay»).

---

## 3. Cảnh báo theo lá số — `getYeguoForChart(R)`

### 3.1 Engine trả gì (đã chạy thật)

`getYeguoForChart(R)` đọc **can lộ** bốn trụ (`pillars[*].ganGod`) và một vài trường khác. Các nhánh có thể trả:

| Nhánh trong mã | Điều kiện | Trả về | Tỷ lệ trên 400 lá số mẫu |
|---|---|---|---|
| Sát sinh | can lộ `七杀`/`七殺` | `YEGUO[0]` + `why` «Thất Sát lộ → dấu 杀业…» | 30% |
| Thâu đạo | `wx.score[yong.primary] < 15` **và** chuỗi JSON của `yong` chứa «财» hoặc «Tài» | `YEGUO[1]` | **86,5%** |
| Tà dâm | chi ngày có, và 300 ký tự đầu JSON `interactions` chứa 冲/克/害 | `YEGUO[2]` | 0% |
| Ỷ ngữ («khẩu nghiệp») | can lộ `伤官`/`傷官` | `YEGUO[6]` | 25% |
| Sân | can lộ `劫财` (giản thể) hoặc `七杀`/`七殺` | `YEGUO[8]` | 30% (chỉ qua Thất Sát; nhánh Kiếp Tài **không bao giờ khớp** vì engine dùng `劫財` phồn thể) |
| Bại cách | `patternQuality.quality === '败格'` | mục tổng «业障 nặng tổng (cách bại)» | 50% |

MAU-A: can lộ `比肩, 劫財, 日主, 比肩` → **mảng rỗng** (nhánh Kiếp Tài trượt do lỗi chữ). MAU-B: Thâu đạo + bại cách.

### 3.2 Vấn đề và cách game dùng

| Vấn đề | Hệ quả nếu dùng thẳng | Quy định của game |
|---|---|---|
| Nhánh Thâu đạo khớp 86,5% lá số (điều kiện chuỗi JSON quá rộng) | gần như ai cũng bị nhắc «nghiệp trộm» — sai và xúc phạm | **tắt** cảnh báo Thâu đạo cho tới khi engine sửa (README, đề xuất: chỉ khi có tổ hợp `caiDuo`/`qunJie` hoặc D5) |
| Nhánh Tà dâm không bao giờ khớp | — | không dùng |
| Nhánh Kiếp Tài → Sân không khớp | lá số Kiếp Tài không được nhắc Sân | chờ sửa engine; tạm dùng thêm `computeLiuDao(R).poisons.san ≥ 50` làm điều kiện cảnh báo Sân |
| Văn app nói «dấu nghiệp quá khứ» | biến cảnh báo thành phán xét kiếp trước (trái T2, T6) | **không hiện** `why` của app trong cảnh báo gameplay. Chỉ hiện ở thẻ Tàng Kinh, có khung «một cách nhìn dân gian kết hợp lá số với nghiệp, không phải giáo lý chính thống» (dùng đúng tinh thần `liudao.disclaimer`) |
| «Bại cách = nghiệp chướng nặng tổng» | dễ làm người chơi bại cách (50%) thấy mình «nặng nghiệp» | không hiện như cảnh báo; chỉ dùng để Mệnh Đồ thêm 1 đèn nút Tích Âm Đức (05-02 §3.2) với lời «bại cần bổ lớn — tức là con được tu nhiều hơn» |

### 3.3 Cảnh báo khi sắp chọn (đặc tả)

**Điều kiện:** người chơi giữ một phương án có thẻ nghiệp X (§2.3) **và** lá số có «khuynh hướng X» theo bảng dưới.

| Thanh X | Khuynh hướng lá số (nguồn hợp lệ) |
|---|---|
| KARMA-SAT | `getYeguoForChart` nhánh Sát sinh (can lộ Thất Sát) |
| KARMA-SAN | nhánh Sân **hoặc** `liudao.poisons.san ≥ 50` |
| KARMA-Y, KARMA-AC | nhánh «khẩu nghiệp» (can lộ Thương Quan) |
| KARMA-THAM | `liudao.poisons.tham ≥ 50` |
| KARMA-SI | `liudao.poisons.si ≥ 50` |
| KARMA-DAO, DAM, VONG, LUONG | không có cảnh báo theo lá số (engine không có nguồn tin cậy) |

**Hiển thị:** trong bước 1 · Giác của Ngũ Bộ Chuyển Niệm (05-01 §3.4), thêm **một dòng** giọng NPC dẫn đạo của người chơi:

| Thanh | Câu (mẫu; luôn hướng tới, không phán quá khứ) |
|---|---|
| KARMA-SAT | «Lá số con có Thất Sát lộ. Người xưa bảo tay con nhanh hơn lòng con. Chậm một nhịp đã.» |
| KARMA-SAN | «Lửa trong lá số con vốn mạnh. Lửa nấu được cơm, cũng đốt được nhà.» |
| KARMA-AC / Y | «Thương Quan là tài ăn nói. Tài ấy để khen người thì quý.» |
| KARMA-THAM | «Con đã có đủ cho hôm nay chưa?» |
| KARMA-SI | «Câu con định nói là câu của Khổng tiên sinh. Con tin thật à?» |

Tối đa **1 cảnh báo theo lá số / hội thoại**, tối đa 5 / ngày. Người chơi tắt được ở Cài đặt › «Nhắc theo lá số».

---

## 4. Năm pháp sám hối (`CHAN_HUI`) thành nghi lễ

Bảng tổng:

| # | `name` (app) | `use` (app, tóm) | Nghi lễ trong game | Nơi · NPC | Hợp thanh | Giảm |
|---|---|---|---|---|---|---|
| 1 | 八十八佛大忏悔文 | công khóa thường ngày; nghiệp chướng nặng; **tổng sám** | **Lễ Hồng Danh** | `buttap` · `dieu_am` | mọi thanh | −10 mọi thanh (1 / 7 ngày) + tính «nghi lễ sám» −30% cho **một** sự vụ người chơi chọn |
| 2 | 金刚萨埵百字明咒 | Mật tông; tiêu nghiệp mau sau khi phạm giới | **Lễ Tịnh Kim Cang** | `tangdia` (bản chờ tham vấn: gian Chuẩn Đề `buttap`) · `lama_dakiet` | phạm giới; mọi thanh | hoàn **Đạo Hạnh bị trừ do phạm giới** (05-01 §3.7) + −30% một sự vụ |
| 3 | 三十五佛忏悔 | **biệt sám** từng nghiệp cụ thể | **Lễ Phát Lộ** | `buttap` · `dieu_am` | thanh của sự vụ | −30% sự vụ đã phát lộ; làm được cho nhiều sự vụ (mỗi sự vụ 1 lễ) |
| 4 | 地藏占察忏 | không rõ nghiệp gì → xem rồi sám tương ứng | **Lễ Soi Sổ** (phiên bản đọc sổ) | `phongdo` · `diatang_su` | — (chỉ ra thanh cao nhất) | không giảm trực tiếp; mở Lễ Phát Lộ cho đúng sự vụ |
| 5a | 大悲忏 | quanh Đại Bi (Quán Âm) | **Lễ Đại Bi** | `buttap` · `dieu_am` | KARMA-AC, SAN, LUONG | −30% một sự vụ |
| 5b | 法华忏 | hệ Pháp Hoa | **Lễ Pháp Hoa** | `buttap` · `dieu_am` | KARMA-SI, Y | −30% một sự vụ |
| Đ | (Đạo gia, `amta-data › remedy-baichan`: 星辰寶懺 / 北斗經 / 三官经) | lễ sám Đạo giáo | **Lễ Sám Tinh Thần** | `longho` · `truong_thiensu`; `phongdo` · `phan_quan` | mọi thanh (người tu Đạo) | −30% một sự vụ |

Pháp «Đ» không thuộc `CHAN_HUI` (vốn là pháp Phật); thêm từ `amta-data` để người tu Đạo có lễ sám đúng truyền thống mình, không phải sang chùa.

### 4.1 Lễ Hồng Danh (88 Phật)

| Hạng mục | Đặc tả |
|---|---|
| App nói | «诵八十八佛名+礼佛 — tụng 88 Phật danh + lạy» |
| Chuẩn bị | đọc lại Sổ Công Quá trang «Mực đen» (phát lộ); chọn một sự vụ để tính −30% (tùy chọn) |
| Mini-game (yêu cầu cho 09) | 88 nhịp lạy. Mỗi nhịp: chạm khi chuông nhỏ ngân (cửa sổ ±250 ms ở mức thường). Không có «thất bại»: lỡ nhịp thì nhịp đó không tính, nghi lễ kéo thêm một nhịp. Tổng thời lượng mục tiêu **11–13 phút** (≈ 7,5 giây / nhịp). Có thể chia **4 phiên × 22 nhịp** trong một ngày |
| Hình ảnh | nhân vật lạy theo nghi thức chuẩn (đứng – quỳ – cúi – đứng); camera cố định góc nghiêng thấp phía sau, **không** quay cận mặt tượng, không hiệu ứng ánh sáng «trúng chiêu» |
| Âm thanh | mõ, chuông, tiếng tụng là **âm tiết hư cấu** đọc theo nhịp; danh hiệu 88 Phật **không** đọc thành tiếng trong game (chỉ hiện ở thẻ Tàng Kinh) |
| Hồi hướng | chọn một người bị hại (danh sách từ các sự vụ) hoặc «chúng sinh» |
| Thưởng | −10 mọi thanh; Đạo Hạnh `B = 30` (tu tâm); T-KI +1 công |
| Hồi chiêu | 7 ngày |

### 4.2 Lễ Tịnh Kim Cang (Kim Cang Tát Đỏa)

| Hạng mục | Đặc tả |
|---|---|
| App nói | «观想金刚萨埵+持百字明咒(21-108遍)+甘露洗净» |
| Trạng thái nội dung | **Mật tông Tạng truyền chờ tham vấn** (canon). Trước khi có cố vấn: lễ chạy ở gian Chuẩn Đề Bút Tháp với hình ảnh trung tính (ánh sáng trắng, nước trong), **không** dựng hình tượng Kim Cang Tát Đỏa |
| Mini-game | quán tưởng: giữ điểm sáng ở giữa màn hình trong khi «dòng nước sáng» chảy từ trên xuống (giữ nhẹ, không giật) — 21 vòng (≈ 4 phút) hoặc 108 vòng (≈ 18 phút, chia được) |
| Chú | **không đọc** Bách Tự Minh; âm tiết hư cấu; thẻ Tàng Kinh chỉ có tên và ý nghĩa |
| Điều kiện | có ≥ 1 án giới (phạm giới) hoặc ≥ 1 sự vụ nghiệp |
| Thưởng | hoàn Đạo Hạnh của **một** án giới (100% nếu ≤ 7 ngày, 50% nếu sau) — thay cho lễ sám riêng của đạo; −30% một sự vụ; `B = 20` (21 vòng) / `B = 45` (108 vòng) |
| Hồi chiêu | 3 ngày |

### 4.3 Lễ Phát Lộ (35 Phật — biệt sám)

| Hạng mục | Đặc tả |
|---|---|
| App nói | «诵三十五佛名+发露 cụ thể nghiệp đã làm» |
| Điểm khác | đây là lễ **gắn sự vụ**: người chơi chọn đúng một sự vụ, màn hình hiện dòng sổ nguyên văn («Ngày …, ở bến Cùng Thông, chọn giữ túi tiền của bà Tư…»), người chơi **tự gõ hoặc chọn** một câu phát lộ trong 3 câu soạn sẵn |
| Mini-game | 35 nhịp lạy (≈ 4–5 phút) |
| Thưởng | −30% sự vụ; `B = 15` |
| Hồi chiêu | không (mỗi sự vụ một lần) |

**Ba câu phát lộ soạn sẵn** (người chơi chọn một, hoặc gõ câu riêng ≤ 120 ký tự; câu gõ không lưu lên máy chủ):

1. «Con đã làm điều ấy. Con biết nó làm ai buồn.»
2. «Con làm vì lúc đó con nghĩ cho mình. Con không muốn thế nữa.»
3. «Con không biện minh.»

### 4.4 Lễ Soi Sổ (Địa Tạng chiêm sát — bản game)

| Hạng mục | Đặc tả |
|---|---|
| App nói | «占察(木轮)+得相+对应忏悔» — gieo bánh xe gỗ để biết nghiệp, rồi sám đúng nghiệp |
| Điều chỉnh của game | bánh xe **không gieo ngẫu nhiên**. Bánh xe gỗ trong điện Địa Tạng ở Phong Đô quay rồi **dừng ở thanh nghiệp cao nhất của chính người chơi** (lấy từ dữ liệu lựa chọn thật). Lý do: trong game, nghiệp là sổ việc làm, không có gì ẩn để «bói»; giữ hình thức nghi lễ, bỏ phần chiêm. Ghi rõ trong thẻ Tàng Kinh: «Pháp chiêm sát thật dùng bánh xe gỗ; ở đây sổ của con đã ghi đủ.» |
| Khi nào gợi ý | người chơi có ≥ 3 thanh ở mức Vướng và chưa biết bắt đầu từ đâu |
| Kết quả | mở Lễ Phát Lộ cho sự vụ lớn nhất của thanh đó; Địa Tạng sứ giả nói một câu (bảng §11) |
| Thưởng | `B = 10` |

### 4.5 Lễ Đại Bi và Lễ Pháp Hoa

| Hạng mục | Lễ Đại Bi | Lễ Pháp Hoa |
|---|---|---|
| App nói | «大悲忏 — 观音系 (sám quanh đại bi)» | «法华忏 — 法华经系» |
| Hợp thanh | KARMA-AC, KARMA-SAN, KARMA-LUONG | KARMA-SI, KARMA-Y |
| Mini-game | tụng theo nhịp mõ chậm (60 nhịp / phút), 5 phút | tụng nhịp + đọc 3 thẻ ngắn giữa phiên, 7 phút |
| Thưởng | −30% một sự vụ hợp thanh; `B = 20` | −30% một sự vụ; `B = 25` |
| Hồi chiêu | 48 giờ | 48 giờ |

### 4.6 Lễ Sám Tinh Thần (Đạo gia)

| Hạng mục | Đặc tả |
|---|---|
| Nguồn | `amta-data › remedies › remedy-baichan`: «Khải đàn → Tụng sám văn («懺悔消災…削落三災九厄») → Hồi hướng»; caveat «pháp sự nghiêm túc do đạo sĩ chủ trì» |
| Trong game | người chơi **không** tự chủ trì: Trương Thiên Sư (Long Hổ) hoặc Phán quan Thôi (Phong Đô) chủ trì, người chơi quỳ dự và đọc phần phát lộ |
| Mini-game | theo nhịp đẩu đăng (đèn sao): thắp 7 đèn Bắc Đẩu theo thứ tự (chạm đúng thứ tự sao), rồi 3 nhịp lạy |
| Thưởng | −30% một sự vụ; `B = 20`; người tu Chính Nhất / Bắc Đế: thêm tiến độ đạo (05-07, 05-09) |
| Hồi chiêu | 48 giờ |

---

## 5. Sửa sai bắt buộc

### 5.1 Năm loại việc sửa

| Loại | Dùng cho | Ví dụ (DEED ác → việc sửa) |
|---|---|---|
| **Hoàn trả** | trộm, ăn chặn, giữ của rơi | DEED-212 → tìm chủ trả túi tiền + bồi thường 20% |
| **Xin lỗi** | lời ác, cãi thầy, bỏ bữa | DEED-236 → về Bàn Thầy, hội thoại xin lỗi (không có phương án xin lỗi «cho có») |
| **Đính chính** | dối, tin đồn, hai lưỡi | DEED-233 → đứng ở đình làng nói rõ sự thật |
| **Bồi đắp** | sát sinh, phá hoại | DEED-201 → 3 DEED phóng sinh + vạch mặt quầy đã xúi |
| **Cứu giúp** | hại người qua Tà Lộ | các sự vụ Âm Bài → chuỗi `CQ-HD` (05-12) |

### 5.2 Luật việc sửa

| Mã | Luật |
|---|---|
| SS-1 | Mỗi DEED ác có **một** việc sửa xác định sẵn (cột «Sửa» 05-04 §14). |
| SS-2 | Việc sửa làm **trước hoặc sau** nghi lễ đều được; sự vụ chỉ «xong» khi có cả hai (hoặc việc sửa + giữ giới, nếu người chơi không muốn làm lễ — xem SS-5). |
| SS-3 | Việc sửa **không cho công thiện** riêng (tránh vòng «làm ác rồi sửa để lấy công»). Ngoại lệ: các DEED thiện dùng làm bồi đắp (vd phóng sinh) vẫn ghi công bình thường **nhưng không hữu hiệu** (05-03 §3.3) cho tới khi sự vụ xong. |
| SS-4 | Đối tượng không còn → hồi hướng tương đương (§2.5). |
| SS-5 | Người chơi **không tu đạo Phật / Đạo** hoặc không muốn làm lễ: việc sửa (−50%) + giữ giới 14 ngày (−50%) cũng xóa trọn sự vụ. Không ai bị bắt làm nghi lễ tôn giáo. |
| SS-6 | Tái phạm cùng việc với cùng đối tượng trong 7 ngày: việc sửa lần này **thêm một bước** (vd xin lỗi + làm giúp một việc). |

### 5.3 Ví dụ trọn vòng

> MAU-A, ngày 12: ở bến Cùng Thông Hồ, người chơi chọn giữ túi tiền nhặt được (DEED-212, −3, KARMA-DAO +24). Thanh Hư Nang lên 24 → mức Vướng; Sổ Mệnh mở `CQ-SH-DAO-01…03`.
> Ngày 13: người chơi lần theo manh mối, trả túi cho bà bán cá, bồi 20% (việc sửa: −12). Dòng quá được gạch son. KARMA-DAO 12.
> Ngày 15: Lễ Phát Lộ ở Bút Tháp (−30% × 24 = −7,2 → làm tròn −7). KARMA-DAO 5.
> Ngày 15–22: giữ giới «không lấy không cho» 7 ngày (−20% × 24 ≈ −5). KARMA-DAO 0. Sự vụ đóng.

---

## 6. Chuỗi giải nghiệp `CQ-SH` theo từng thanh

Mỗi thanh có chuỗi 3 bước bám **nguyên văn cột `cure` của `YEGUO`**: bước 1 là **giới** (持…戒), bước 2 là **kinh / chú / pháp** (持…经/咒), bước 3 là **sám + việc thiện đối trị**. Chuỗi mở khi thanh ≥ 20; làm trọn chuỗi lần đầu: `B = 60` và danh hiệu nhỏ theo thanh.

| Mã | Thanh | Bước 1 · Giới (từ `cure`) | Bước 2 · Kinh / pháp (từ `cure`) | Bước 3 · Sám + đối trị | DEED đối trị (−2 thanh / DEED) |
|---|---|---|---|---|---|
| CQ-SH-SAT-01…03 | KARMA-SAT | 日持不杀戒: 7 ngày không chọn phương án hại sinh vật; 3 ngày chay | 持药师咒/药师经: đọc thẻ Dược Sư (DEED-172) | 礼佛忏悔杀业: Lễ Phát Lộ cho sự vụ sát + 放生 3 lần | DEED-001…019 |
| CQ-SH-DAO-01…03 | KARMA-DAO | 持不与取戒 (绝不白拿…): 7 ngày không lấy đồ không phải của mình (kể cả đồ rơi «không ai thấy») | 持地藏经/地藏圣号: đọc thẻ Địa Tạng (DEED-173) | 忏悔盗业+补偿原主: Lễ Phát Lộ + hoàn trả; 先还欠再施: trả hết nợ rồi bố thí | DEED-081…100 |
| CQ-SH-DAM-01…03 | KARMA-DAM | 持不邪淫戒: không nhận việc phá duyên / bùa mê 14 ngày | 持观音圣号/准提咒: Lễ Đại Bi hoặc trì Chuẩn Đề 21 (DEED-177) | 礼普贤行愿品忏悔: Lễ Phát Lộ + gỡ bùa (nếu có) + đính chính | DEED-076, DEED-154 |
| CQ-SH-VONG-01…03 | KARMA-VONG | 持不妄语戒 (事事核实再言): 7 ngày không chọn câu dối | 持金刚经/阿弥陀佛: đọc thẻ Kim Cang (DEED-174) | 发露忏悔+当众更正曾说之谎: Lễ Phát Lộ + đính chính trước đông người | DEED-132…145 |
| CQ-SH-LUONG-01…03 | KARMA-LUONG | 持不两舌戒 (绝不传是非): 7 ngày không chọn câu truyền lời | 持大悲咒/文殊圣号: Lễ Đại Bi | 主动说和合语/调解+赞叹他人功德: hòa giải 2 lần (DEED-157) + khen người vắng mặt (DEED-120) | DEED-056, DEED-157, DEED-120 |
| CQ-SH-AC-01…03 | KARMA-AC | 持不恶口戒: 7 ngày không chọn câu `ac_khau` | 持灭定业真言/大悲咒: Lễ Đại Bi | 修忍辱 (被骂不还口)+致歉曾骂之人: sự kiện «bị mắng»: chọn không đáp trả 3 lần + xin lỗi người từng bị mắng | DEED-120, DEED-065 |
| CQ-SH-Y-01…03 | KARMA-Y | 持不绮语戒 (戒闲聊/荤段子): 7 ngày không chọn câu `y` | 以诵经持咒代无义闲谈: 7 phiên kinh ngắn (DEED-186) | 立每日有益语功课: Lễ Pháp Hoa + mỗi ngày một câu khuyên thiện (DEED-155) | DEED-155, DEED-170 |
| CQ-SH-THAM-01…03 | KARMA-THAM | 日修知足观: 7 ngày không đòi thêm thưởng / không ép giá | 持准提咒/弥勒圣号: trì Chuẩn Đề 108 (DEED-178) | 修布施 (先小额固定)+忏悔非分所求: hũ phúc 7 ngày (DEED-086) + Lễ Phát Lộ | DEED-081…100 |
| CQ-SH-SAN-01…03 | KARMA-SAN | 持不嗔戒 (怒起先停三息): 7 lần dùng Ngũ Bộ Chuyển Niệm thành công với thẻ `san` | 日修慈心观 (亲→中→怨次第): 3 buổi thiền từ tâm (mini-game: gửi ánh sáng tới người thân → người lạ → người từng làm mình giận) | 发露忏悔回向曾伤之人: Lễ Đại Bi, hồi hướng cho người bị hại | DEED-065, DEED-157 |
| CQ-SH-SI-01…03 | KARMA-SI | 皈依三宝 / 亲近正见善知识: ghé 3 NPC dẫn đạo khác nhau nghe giảng (DEED-184) | 日读十善业道经/心经/金刚经建正见: đọc thẻ Thập Thiện (DEED-190) + Kim Cang | 持文殊心咒破痴+忏悔谤法邪见: Lễ Pháp Hoa + vạch mặt một quầy Định Mệnh Hội (thay «tà kiến» bằng chính kiến) | DEED-146…154 |

**Người không theo Phật:** bước 2 có lựa chọn thay thế theo đạo đang tu — Đạo: tụng Thanh Tĩnh Kinh / Bắc Đẩu Kinh (DEED-171, DEED-181); Nho: đọc *Liễu Phàm Tứ Huấn* (thẻ) hoặc *Thái Thượng Cảm Ứng Thiên* (DEED-187). Bước 3 dùng Lễ Sám Tinh Thần (Đạo) hoặc việc sửa + giữ giới (SS-5, Nho / không tôn giáo).

---

## 7. Kinh theo việc (`JING_ZHOU`) — Tàng Kinh Các

### 7.1 Nguyên tắc

- Tàng Kinh Các (mỗi thánh địa Phật một gian; Đạo có thư khố riêng) là nơi **đọc**: giới thiệu, ý nghĩa, ngữ cảnh, nguồn.
- **Không in toàn văn chú** ngoài phần app đã có và được phép trích (canon §5.4). Phần tụng trong mini-game dùng âm tiết hư cấu.
- **Không** biến kinh thành vật phẩm «bấm để buff». Đọc thẻ chỉ ghi T-KI +1 công (05-04 §12) và, khi hợp, giảm nghiệp 10% (§2.5). Không kinh nào cho Phúc Khí, may mắn, chỉ số chiến đấu (game không có).
- Mỗi thẻ có dòng: «Đây là giới thiệu văn hóa – tôn giáo. Muốn tu tập thật, hãy tìm thầy và cộng đồng của truyền thống này.»

### 7.2 Bảy thẻ

| # | `problem` (app) | `cure` (app) | Thẻ trong game: ngữ cảnh gợi ý | Gian | Liên kết cơ chế | Giới hạn riêng |
|---|---|---|---|---|---|---|
| 1 | Bệnh / tai nạn / đoản mệnh | Dược Sư chú + kinh + Dược Sư Phật (12 đại nguyện) | khi người chơi làm DEED cứu người bệnh, chăm thầy ốm (DEED-104) | Bút Tháp | giảm KARMA-SAT 10% | **không** nói kinh chữa bệnh; dòng «Người bệnh cần thầy thuốc. Kinh là để lòng người chăm bệnh an.» |
| 2 | Nghiệp chướng nặng / tổ tiên / quỷ thần chướng | Địa Tạng kinh + Địa Tạng Bồ Tát | khi tổng thanh ≥ 150 hoặc khi vào Phong Đô | Bút Tháp, Phong Đô | giảm mọi thanh của **một** sự vụ 10%; mở Lễ Soi Sổ | không dọa địa ngục |
| 3 | Chấp trước / vô minh / cầu trí tuệ | Kim Cang kinh (4 câu kệ «一切有为法，如梦幻泡影») | khi thi trượt, khi mất đồ, khi thiền Yên Tử | Yên Tử | KARMA-SI, KARMA-VONG 10% | trích ≤ 1 câu kệ |
| 4 | Tai nạn / cấp khó | Phổ Môn phẩm + Quán Thế Âm | sau sự kiện cứu nạn (lũ, cháy) | Bút Tháp | — (không giảm nghiệp; đọc để hiểu) | không hứa «niệm thì thoát nạn» |
| 5 | Ma chướng / tà chướng | Lăng Nghiêm chú (đầu đại chú, hàng ma) | trong chuỗi trừ tà chính tông, **sau** bước chẩn đoán đời thực (05-13 §6) | Bút Tháp | — | không in chú; nhấn mạnh «đa phần là người mệt» |
| 6 | Nghèo / phúc mỏng | Chuẩn Đề chú + tài tôn pháp | khi người chơi hết Phúc Khí; khi học Liễu Phàm | Bút Tháp, Tạng Địa | dẫn sang Chuẩn Đề pháp môn (§8) và bố thí | **không** có hiệu ứng tăng Phúc Khí; dòng «舍财得财 — cho trước, rồi biết đủ» |
| 7 | Khó có con / cầu tử | Tống Tử Quan Âm + Phổ Môn | **không gợi ý chủ động** | Bút Tháp | không có | chủ đề nhạy cảm (hiếm muộn thật): thẻ chỉ giới thiệu tín ngưỡng dân gian; không nhiệm vụ, không nghi lễ, không ai trong game hỏi người chơi về con cái |

---

## 8. Chuẩn Đề pháp môn (`ZHUNTI`) — phương pháp Liễu Phàm thật

`ZHUNTI.how` có 4 việc: **持准提咒** (số cố định / ngày) + **功过格** (sổ công quá) + **积善** (tích thiện cố định) + **回向** (hồi hướng). `ZHUNTI.fit`: hợp **người đời**, không cần xuất gia, «chuyển hóa chứ không bỏ đời».

Game ráp đúng 4 việc đó thành **Pháp Môn Liễu Phàm** — chế độ tu dành cho người chơi không muốn vào một đạo thống, chỉ muốn đi con đường Liễu Phàm:

| Việc (app) | Trong game | Nhịp |
|---|---|---|
| 持准提咒 | trì 21 hoặc 108 (DEED-177 / 178), chọn một số **cố định** và giữ | mỗi ngày |
| 功过格 | Sổ Công Quá (05-03) | tự động |
| 积善 | «hũ phúc» hoặc một DEED cố định mỗi ngày (người chơi tự chọn loại) | mỗi ngày |
| 回向 | cuối ngày, Sổ Mệnh hỏi «hôm nay hồi hướng cho ai?» (chọn NPC đã giúp / người thân trong game / chúng sinh) | mỗi ngày |

- Giữ đủ 4 việc 7 ngày liền: `B = 50` (tu tâm), tiến độ hạng của đạo **Mật · Chuẩn Đề** nếu người chơi có tu (05-10), hoặc tiến độ «Pháp Môn Liễu Phàm» (thang riêng 3 bậc: Phát Nguyện → Thường Hành → Viên Mãn, không chiếm suất đạo thống).
- Lời Vân Cốc khi giới thiệu: «Liễu Phàm không đi tu. Ông vẫn làm quan, vẫn nuôi vợ con. Ông chỉ đếm việc mình làm, và đếm số câu chú mỗi ngày. Đếm đều thì đổi.»

---

## 9. Lục Đạo — dùng `computeLiuDao(R)` thế nào

### 9.1 Engine trả

`{ poisons: {tham, san, si, thien, dinh, bo}, scores: {天道, 人道, 阿修罗道, 畜生道, 饿鬼道, 地狱道}, primary, realm, poisonTop, narrative, disclaimer }`. App ghi rõ: **đồng bộ dân gian**, chỉ là **khuynh hướng tính cách**, không đoán nẻo tái sinh.

Ví dụ thật: MAU-A `primary = 人道` (tham 29, sân 37, si 27). MAU-C1 (1988 nữ) `primary = 饿鬼道` (tham 67).

### 9.2 Cách game dùng

| Dùng | Quy định |
|---|---|
| **NPC Diệu Âm tìm tới** | khi `primary ∈ {畜生道, 饿鬼道, 地狱道}` (canon §5.2). Lời mở: «Tham, sân, si ai cũng có. Đếm được thì bớt được.» **Không** nói tên đạo cho người chơi trong lần gặp đầu |
| Hiển thị cõi | chỉ trong Sổ Mệnh › «Tính khí» (tài liệu 04) dưới tên **«khuynh hướng tu học»**, kèm `disclaimer` nguyên văn app; không bao giờ «bạn thuộc cõi ngạ quỷ». Tên hiển thị dùng «khuynh hướng tham» / «khuynh hướng sân» / «khuynh hướng si» thay cho tên ba đường dữ |
| Tâm ma khởi điểm | `poisonTop` quyết định **loại tạp niệm mặc định nhẹ** trong tĩnh tọa (1 / 40 giây) — để mỗi người có «tâm ma» riêng ngay từ đầu, độc lập với thanh nghiệp |
| Cảnh báo | `poisons.san/tham/si ≥ 50` là nguồn cảnh báo hợp lệ (§3.3) |
| Không dùng | không dùng `scores` để chặn, giảm, phạt bất cứ gì |

Bảng pháp đối trị của app (`SIX_REALMS[*].remedy`) thành Tâm Đề phụ (05-01 §3.5) khi Diệu Âm nhận dẫn:

| Khuynh hướng | `remedy` (app) | Tâm Đề phụ trong game |
|---|---|---|
| 天道 (mạn) | tu khiêm nhường, xả mạn | «Khiêm» — 5 lần khiêm / tuần |
| 阿修罗道 (đố kỵ / sân) | tu hỷ xả, buông đố kỵ | «Tùy hỷ» — khen người chơi khác 3 lần / tuần |
| 畜生道 (si) | khai trí, học pháp, tin nhân quả | «Học» — 5 thẻ Tàng Kinh / tuần |
| 饿鬼道 (tham) | tu bố thí, buông tham | «Xả» — hũ phúc 7 ngày |
| 地狱道 (sân) | tu từ bi, nhẫn nhục, buông sân | «Nhẫn» — 3 lần chọn không đáp trả |

---

## 10. Luật trình bày tôn trọng (bắt buộc với mọi nghi lễ, kinh, sám)

| # | Luật |
|---|---|
| TT-1 | Tượng Phật, Bồ Tát, Tam Thanh, Thánh Khổng **không** là vật phẩm bán, không là phần thưởng, không đặt trong nhà riêng như đồ trang trí (bàn thờ gia tiên là ngoại lệ, chỉ có bài vị chung). |
| TT-2 | Không cho người chơi **leo, ngồi, đứng** lên bệ thờ, bàn thờ, bia; va chạm vật lý chặn (đã có `collide.js` theo hình khối). |
| TT-3 | Không hoạt ảnh hài, không biểu cảm đùa, không «nhảy múa» trong điện. Lệnh biểu cảm MMO bị tắt trong vùng chính điện. |
| TT-4 | Nghi lễ không có màn hình «thắng / thua», không có điểm số kiểu trò chơi (không «Perfect!», không combo). Chỉ có tiếng chuông kết thúc và một câu. |
| TT-5 | Không đọc thành tiếng danh hiệu Phật, chú thật trong mini-game; dùng âm tiết hư cấu. Thẻ Tàng Kinh được phép hiện chữ thật trong giới hạn app đã có. |
| TT-6 | Mật tông Tạng truyền: **chờ tham vấn** (canon). Không dựng hình tượng bổn tôn, mạn-đà-la thật, thủ ấn thật trước khi có cố vấn. |
| TT-7 | Không hứa hiệu quả đời thực của kinh, chú, sám (không «tụng để khỏi bệnh», «trì để giàu»). |
| TT-8 | Không so sánh hơn kém giữa các truyền thống (`ETHICS.forbiddenAbsoluteClaims`: «Khẳng định một trường phái là "đúng nhất"»). |
| TT-9 | Đạo sĩ, tăng ni trong game **không** bán dịch vụ cho người chơi (không «trả Phúc Khí để sư tụng giùm»). Người chơi có thể cúng dường (bố thí) nhưng không đổi được gì. |
| TT-10 | Người chơi được bỏ qua mọi nghi lễ (SS-5) mà không mất đường tiến (có đường thay thế bằng việc làm). |
| TT-11 | Không có nghi lễ nào trong game là bản hướng dẫn thật: không đủ bước, không đủ lời, không đủ vật để làm theo ngoài đời. |
| TT-12 | Trang phục tăng ni, đạo sĩ là trang phục **của NPC**; Tàng Y Các không bán y phục tăng thật (cà sa, áo hậu) — chỉ có «phục hành hương» cách điệu. Đạo bào là ngoại lệ đã có (`y_tho` «Hậu Thổ Đạo Bào») vì là phong cách võ hiệp phổ biến, nhưng **không** mặc được trong lễ thụ lục / thụ giới (lễ tự đổi sang phục lễ của nghi). |
| TT-13 | Chữ Hán trên phù, sớ, bài vị trong game là **ký tự hư cấu** hoặc chữ trang trí không mang nghĩa nghi lễ (canon T6). |
| TT-14 | Cố vấn nội dung từng truyền thống duyệt trước M2–M5 (bản sơ đồ §14). Mỗi nghi lễ ghi cố vấn đã duyệt trong bảng nội dung. |

---

## 11. Kịch bản cảnh

```
[CẢNH CQ-SH-HD.1 · Bút Tháp, điện Thượng · giờ Thân · mưa phùn]
(Ni sư Diệu Âm đặt hai bồ đoàn. Sổ Công Quá của người chơi mở ở trang Mực Đen.)
DIỆU ÂM: Con đọc đi. Đọc to cũng được, đọc thầm cũng được.
(Màn hình hiện dòng: «Ngày 12 · bến Cùng Thông · giữ túi tiền nhặt được.»)
> Lựa chọn: ① (đọc thầm) → [.2]  ② «Sư có cần nghe không?» → [.1b]

[CẢNH CQ-SH-HD.1b]
DIỆU ÂM: Sư không cần. Người cần nghe là con.
→ [.2]

[CẢNH CQ-SH-HD.2]
DIỆU ÂM: Tám mươi tám lạy. Lạy mệt thì nghỉ, chiều mai lạy tiếp. Phật không đếm giờ.
(Mini-game Lễ Hồng Danh, có thể dừng ở mốc 22 / 44 / 66.)
(Hết lạy. Chuông.)
DIỆU ÂM: Hồi hướng cho ai?
> Lựa chọn: ① «Bà bán cá.» ② «Chúng sinh.» ③ «Con không biết.»
DIỆU ÂM: (với ①) Ừ. Mai con đem trả túi tiền nhé — lạy rồi mà chưa trả thì lạy chưa xong.
DIỆU ÂM: (với ②) Rộng thế cũng tốt. Nhưng bà bán cá vẫn đang đợi túi tiền.
DIỆU ÂM: (với ③) Không biết thì cứ để đó. Hồi hướng cho người con nhớ ra đầu tiên.
(Kết: −10 mọi thanh; Đạo Hạnh B 30; sự vụ chưa xong nếu chưa hoàn trả.)
```

```
[CẢNH SOI-SỔ.1 · Phong Đô, điện Địa Tạng · giờ Tý · đèn dầu]
ĐỊA TẠNG SỨ GIẢ: Con không biết bắt đầu từ đâu, nên đến đây.
(Bánh xe gỗ quay chậm, dừng ở hình than hồng — KARMA-SAN.)
ĐỊA TẠNG SỨ GIẢ: Bánh xe này người xưa gieo để hỏi. Còn con thì sổ đã ghi rồi, khỏi gieo. Nó dừng ở lửa.
ĐỊA TẠNG SỨ GIẢ: Lửa không xấu. Lửa đốt nhầm chỗ mới khổ. Con lên Bút Tháp, làm lễ Đại Bi, rồi về xin lỗi người bán quạt.
(Mở Lễ Phát Lộ cho sự vụ KARMA-SAN lớn nhất. B 10.)
```

```
[CẢNH DIỆU-ÂM-GẶP.1 · Huyền Thành, Trà Thất · chiều · nắng xiên]
(Chỉ khi liudao.primary thuộc ba khuynh hướng dữ. Diệu Âm ngồi bàn bên, tự rót trà.)
DIỆU ÂM: Trà lài ở đây ngon hơn ở chùa. Con ngồi chung không?
> Lựa chọn: ① (ngồi) → [.2]  ② «Sư là ai?» → [.1b]  ③ (từ chối lịch sự) → [.1c]

[CẢNH DIỆU-ÂM-GẶP.1b]
DIỆU ÂM: Một bà sư đi xin nước. Ngồi đi rồi biết.
→ [.2]

[CẢNH DIỆU-ÂM-GẶP.1c]
DIỆU ÂM: Ừ. Hôm khác. Chùa Bút Tháp lúc nào cũng có trà.
(Kết: Diệu Âm để lại thư mời trong hòm thư. Không trừ gì.)

[CẢNH DIỆU-ÂM-GẶP.2]
DIỆU ÂM: Tham, sân, si ai cũng có. Đếm được thì bớt được. Con thử đếm xem tuần này con giận mấy lần.
> Lựa chọn: ① «Nhiều lắm.» ② «Không lần nào.» ③ «Đếm làm gì ạ?»
DIỆU ÂM: (với ①) Biết là nhiều thì đã bớt một nửa rồi.
DIỆU ÂM: (với ②) Vậy thì tuần sau đếm kỹ hơn nhé. (cười)
DIỆU ÂM: (với ③) Cái gì đếm được thì không còn sai khiến được mình.
(Mở Tâm Đề phụ theo khuynh hướng; mở đường tới Bút Tháp.)
```

---

## 12. Ca biên

| Ca | Xử lý |
|---|---|
| Hai sự vụ cùng thanh | giảm theo từng sự vụ; tổng thanh = tổng lượng còn lại của các sự vụ (không âm) |
| Thanh > 100 do cộng dồn | kẹp 100 khi hiển thị; lượng thật vẫn lưu để trừ đúng |
| Người chơi phạm giới trong lúc làm chuỗi `CQ-SH` | chuỗi không hủy; bước giới đếm lại từ đầu |
| Sự vụ từ Tà Lộ | vừa vào thanh nghiệp, vừa sinh Nợ Âm (05-12); xóa sự vụ không xóa Nợ Âm và ngược lại |
| Đổi lá số | cảnh báo theo lá số tính lại; thanh nghiệp không đổi (nghiệp là việc làm) |
| iOS | thanh nghiệp, sám hối, Tàng Kinh **có** (tu tâm, học, việc thiện); cảnh báo theo lá số **tắt** (vì là luận lá số); Lục Đạo **tắt** |
| Người chơi tắt mọi nhắc | thanh vẫn chạy; Sổ Mệnh vẫn hiện; không có thư, không cảnh báo |

---

## 13. Checklist nghiệm thu 05-05

- [ ] 10 thanh `KARMA-*` khớp đúng 10 mục `YEGUO`; không thanh nào tăng ngoài lựa chọn có thẻ.
- [ ] Cảnh báo Thâu đạo **tắt**; cảnh báo không bao giờ dùng `why` «dấu nghiệp quá khứ».
- [ ] Mỗi pháp `CHAN_HUI` có nghi lễ; mỗi nghi lễ đòi phát lộ đúng sự vụ (trừ Hồng Danh) và không thay được việc sửa.
- [ ] SS-5: người không làm nghi lễ vẫn xóa được sự vụ bằng việc sửa + giữ giới.
- [ ] 7 thẻ `JING_ZHOU` có dòng giới hạn riêng; thẻ cầu tử không gợi ý chủ động.
- [ ] Không mini-game nghi lễ nào hiện «Perfect / combo / thua».
- [ ] Lục Đạo chỉ hiện «khuynh hướng tu học» kèm `disclaimer`.
- [ ] Luật TT-1 … TT-14 được kiểm trong bảng nghiệm thu nội dung từng thánh địa (tài liệu 07).
