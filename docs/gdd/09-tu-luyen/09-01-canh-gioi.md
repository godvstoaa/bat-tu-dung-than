# 09-01 · Cảnh giới — thang tu, điều kiện, mở khóa, hình ảnh và hợp nhất với `progress.js`

> Phần này mở rộng canon §5 (bảng cảnh giới) và bản sơ đồ tổng §9.1, §4.7. Số liệu kinh tế (Đạo Hạnh, trần, hệ số) ở `09-03`; thử thách độ kiếp từng bậc từng đạo thống ở `09-02`; nhịp thời gian thực tế ở `09-10`.

---

## 1. Thang cảnh giới đứng trên ba nền của app

Game không bịa thang tu. Ba khung đã có trong engine được ghép lại:

| Khung của app | Nguồn | Vai trò trong thang cảnh giới |
|---|---|---|
| Nội đan bốn bậc: 炼精化气 → 炼气化神 → 炼神还虚 → 炼虚合道 | `remedy-fate › DAO_JIA[1].principle` | **tên bốn bậc trên** của họ Đạo (bậc 3–6) |
| Ba tầng cải mệnh: 改运 (nông) · 改心+改行 (giữa) · 改命 (sâu) | `remedy-fate › GAI_LEVELS` | **trọng tâm** từng cặp bậc: 1–2 cải vận, 3–4 cải tâm / cải hành, 5–6 cải mệnh |
| Năm bước cải tâm 觉 · 停 · 转 · 净 · 化 | `remedy-fate › GAI_XIN.steps` | **năm lần độ kiếp** (lên bậc 2…6) ứng năm bước (`09-02` §1) |

```
bậc  1        2           3                4                5                6
     │ Cải Vận (nông) │   Cải Tâm · Cải Hành (giữa)  │      Cải Mệnh (sâu)            │
     └── kiếp ──┘└── kiếp ──┘└──── kiếp ────┘└──── kiếp ────┘└──── kiếp ────┘
          giác        đình            chuyển           tịnh             hóa
```

Bậc 1 là điểm xuất phát (không có kiếp). Mỗi lần lên bậc là một lần đi qua một bước của `GAI_XIN`: biết niệm → dừng niệm → đổi niệm → rỗng tâm → hóa nghiệp.

---

## 2. Tên gọi: ba họ, chín đạo thống

### 2.1 Tên chính (canon — không đổi)

| Bậc | Họ Đạo | Họ Phật | Họ Nho | Ngưỡng (canon) |
|---|---|---|---|---|
| 1 | Phàm Nhân | Tín Tâm | Học Trò | 0 |
| 2 | Nhập Môn | Quy Y | Sĩ | 100 |
| 3 | Luyện Tinh Hóa Khí | Trì Giới | Quân Tử | 400 |
| 4 | Luyện Khí Hóa Thần | Định | Hiền Nhân | 1.000 |
| 5 | Luyện Thần Hoàn Hư | Tuệ | Đại Nho | 2.200 |
| 6 | Luyện Hư Hợp Đạo | Giải Thoát | Thánh Hiền | 4.500 |

**Họ của người chơi** = họ của **đạo thống chính** (§10). Trước khi chọn đạo thống chính (bậc 1 và nửa đầu bậc 2), họ lấy theo **cửa nhập môn** người chơi chọn ở độ kiếp bậc 2 (`09-02` §2: Khấu Sơn Môn → Đạo, Tam Quy → Phật, Khai Bút → Nho).

### 2.2 Đạo thống thuộc họ nào

| Đạo thống (mã `09-03` §4) | Họ | Thánh địa / phân đàn |
|---|---|---|
| Chính Nhất `CN` | Đạo | Long Hổ |
| Thanh Vi · Đan Đỉnh `TV` | Đạo | Võ Đang |
| Toàn Chân · Linh Bảo `TC` | Đạo | Chung Nam · phân đàn Huyền Quán Sơn Môn |
| Thượng Thanh · Lư Sơn `TT` | Đạo | Mao Sơn · phân đàn Trích Thiên Đỉnh |
| Bắc Đế · Động Uyên `BD` | Đạo | Phong Đô · phân đàn Thái Tuế Điện (web) / Đạo Tạng các ở Thư Lâu (iOS) |
| Thiền `TH` | Phật | Yên Tử |
| Tịnh Độ `TD` | Phật | Bút Tháp · phân đàn Cùng Thông Hồ |
| Mật (Chuẩn Đề) `MT` | Phật | Tạng Địa · phân đàn Am Vân Cốc |
| Nho · Tịnh Minh `NH` | Nho | Văn Miếu · phân đàn Thư Lâu Lâm |

**Phân đàn** là nơi tu sớm của đạo thống có thánh địa mở muộn (§6.2). Phân đàn nằm trong **vùng đã có** của bản đồ nên không cần dựng mới cả thánh địa để người chơi bậc 2 chọn bất kỳ đạo nào. Tài liệu 07 / 08 dựng gian thờ / gian học tương ứng trong các vùng đó (đề xuất, không tạo mã ở đây).

Lý do chọn phân đàn:

| Phân đàn | Lý do |
|---|---|
| Huyền Quán Sơn Môn → Toàn Chân | Sơn Môn là một đạo quán theo lối tùng lâm (trà thất, lầu chuông, chính điện) — gần lối Toàn Chân nhất |
| Trích Thiên Đỉnh → Thượng Thanh | đỉnh núi xem sao — Thượng Thanh chuộng tồn tư tinh tú |
| Thái Tuế Điện → Bắc Đế | Thái Tuế, Đẩu Mẫu là thần tinh tú phương Bắc trong tín ngưỡng dân gian; điện đã có trong game |
| Cùng Thông Hồ → Tịnh Độ | mặt hồ, sen — biểu tượng Tịnh Độ; nơi phóng sinh, thả đèn |
| Am Vân Cốc → Mật (Chuẩn Đề) | Vân Cốc thiền sư truyền pháp Chuẩn Đề cho Liễu Phàm (`remedy-fate › ZHUNTI.principle`) |
| Thư Lâu Lâm → Nho | thư viện cổ thư |

### 2.3 Danh xưng môn hạ (phụ đề theo đạo thống)

Ngoài tên chính, mỗi đạo thống cho một **danh xưng môn hạ** hiện dưới tên nhân vật khi người chơi đứng trong đạo tràng của đạo đó. Danh xưng **hư cấu**, cố ý **không trùng** phẩm trật thụ lục, giới phẩm hay chức sắc tôn giáo có thật (tôn trọng tín ngưỡng — canon T6). Riêng họ Nho dùng tên các học vị / chức ở Quốc Tử Giám xưa như tên **gọi đùa trang trọng**, vì không phải chức sắc tôn giáo.

| Đạo thống | Bậc 2 | Bậc 3 | Bậc 4 | Bậc 5 | Bậc 6 |
|---|---|---|---|---|---|
| `CN` | Hương Đồng (香童) | Thị Đàn (侍壇) | Chưởng Phù (掌符) | Lôi Ấn Sứ (雷印使) | Thiên Sư Phủ Khách Khanh |
| `TV` | Tiều Đồng (樵童) | Thủ Lô (守爐) | Thái Hòa Sĩ (太和士) | Tử Tiêu Ẩn Giả (紫霄隱者) | Huyền Vũ Thị Giả |
| `TC` | Khách Quải Đơn (掛單客) | Thanh Tu (清修) | Thủ Giới (守戒) | Vân Thủy (雲水) | Bạch Vân Chủ Khách |
| `TT` | Tịnh Đàn Đồng | Tồn Tư Sĩ (存思士) | Hộ Thôn Sứ (護村使) | Kim Quang Sĩ | Tam Mao Khách Khanh |
| `BD` | Đề Đăng (提燈) | Thủ Bạ (守簿) | Dẫn Lộ Sứ (引路使) | Phán Văn (判文) | Bắc Cực Khách Khanh |
| `TH` | Sơ Tâm (初心) | Tham Học (參學) | Tịch Tĩnh (寂靜) | Kiến Tánh (見性) | Cư Trần Lạc Đạo (居塵樂道) |
| `TD` | Liên Hữu (蓮友) | Trì Danh (持名) | Hạ Phẩm Liên Đài | Trung Phẩm Liên Đài | Thượng Phẩm Liên Đài |
| `MT` | Trì Chú Sơ Học | Chuẩn Đề Hành Giả | Quán Tưởng Sĩ | Vô Thường Sĩ | Viên Luân Khách |
| `NH` | Môn Sinh Văn Miếu | Giám Sinh (監生) | Trực Giảng (直講) | Tư Nghiệp (司業) | Tế Tửu Khách Tọa |

Ghi chú: «Cư Trần Lạc Đạo» là tên bài phú của Trần Nhân Tông — dùng cho bậc cao nhất của Thiền Trúc Lâm vì đúng tinh thần «ở giữa đời mà vui với đạo», không phải xuất gia. «Liên Đài» theo ý Cửu phẩm liên hoa của Tịnh Độ (canon §5.6) nhưng chỉ dùng ba phẩm lớn, không gán chín phẩm cho người sống.

### 2.4 Ý nghĩa từng bậc (câu giới thiệu khi lên bậc)

| Bậc | Họ Đạo | Họ Phật | Họ Nho |
|---|---|---|---|
| 1 | «Người thường. Có hạt giống, chưa có vườn.» | «Có lòng tin, chưa biết tin gì.» | «Biết mình chưa biết.» |
| 2 | «Đã gõ cửa. Đã có tên gọi trong núi.» | «Nương tựa Phật, Pháp, Tăng — ba chỗ dựa để không trôi.» | «Đã cầm bút, đã chọn đường học.» |
| 3 | «Gom tinh thành khí: giữ thân cho đều, ngủ cho đủ, nói ít đi.» | «Giữ giới: không phải để bị trói, mà để không trói người khác.» | «Quân tử thận độc — ở một mình vẫn giữ như có người nhìn.» |
| 4 | «Luyện khí thành thần: tâm đã yên, việc làm tự sáng.» | «Định: sóng lặng thì thấy đáy.» | «Hiền nhân: không oán trời, không trách người.» |
| 5 | «Thần trở về hư: không còn khoe cái mình có.» | «Tuệ: thấy rõ mà không bám.» | «Đại Nho: học để thương người, không để hơn người.» |
| 6 | «Hư hợp đạo: đạo không ở trên núi, ở dưới chân mình.» | «Giải thoát: không còn ai để mà thoát.» | «Thánh hiền: tu thân, tề gia… và biết dừng.» |

Nền tham chiếu của các câu: `DAO_JIA` (Đạo), tam học Giới – Định – Tuệ (Phật; khớp tên bậc 3–5), tám điều mục Đại Học «cách vật, trí tri, thành ý, chính tâm, tu thân, tề gia, trị quốc, bình thiên hạ» (Nho). Tài liệu 06 có quyền viết lại câu chữ, giữ ý.

---

## 3. Công thức điểm cảnh giới (canon) và các điều kiện

### 3.1 Điểm Cảnh Giới

```
ĐCG(bậc ≤ 3) = 0,4 × Tiềm Lực + Đạo Hạnh
ĐCG(bậc ≥ 4) = Đạo Hạnh
```

So với ngưỡng 100 / 400 / 1.000 / 2.200 / 4.500 (canon). Tiềm Lực = `synthesis.score`; Đạo Hạnh tính như `09-03` §2.

### 3.2 Năm điều kiện lên một bậc

Một bậc mới chỉ đạt khi **đủ cả năm**:

| # | Điều kiện | Lên bậc 2 | Lên bậc 3 | Lên bậc 4 | Lên bậc 5 | Lên bậc 6 |
|---|---|---|---|---|---|---|
| D1 | ĐCG / ĐH ≥ ngưỡng | ĐCG ≥ 100 | ĐCG ≥ 400 | ĐH ≥ 1.000 | ĐH ≥ 2.200 | ĐH ≥ 4.500 |
| D2 | **Ngày củng cố** (ngày tu ở bậc hiện tại, §4) | 0 | 3 | 10 | 20 | 30 |
| D3 | Công ròng (Sổ Công Quá) | — | — | ≥ 20 | ≥ 60 | ≥ 150 |
| D4 | Điều kiện đạo | — | đã chọn **đạo thống chính** và Tu độ đạo đó ≥ 50 (Sơ Học) | Tu độ đạo chính ≥ 250 | — | **Quy nhất**: ≥ 3 đạo thống Nhập Thất (≥ 250) |
| D5 | **Độ kiếp** đạt | `ACT-K2-DAO` / `-PHAT` / `-NHO` | `ACT-K3-<đạo>` | `ACT-K4-<đạo>` | `ACT-K5-<đạo>` | `ACT-K6-<đạo>` (tổ đình) rồi `ACT-K6-QN` (Côn Lôn) |
| — | Không vướng | — | không «Cảnh giới bất ổn» | không Nợ Âm | không Nợ Âm | không Nợ Âm |

Thứ tự trong game: khi D1–D4 đủ, Sổ Tu báo «**Thời khắc đã tới**» và mở độ kiếp (D5). Độ kiếp đạt → lên bậc ngay, cộng 50 thô ngoài trần (`09-03` §8).

### 3.3 Thô cần (tóm tắt — chi tiết `09-03` §3.2)

| TL | NT | Thô tích lũy cần cho bậc 2 / 3 / 4 / 5 / 6 |
|---|---|---|
| 20 | 1,40 | 66 / 280 / 714 / 1.571 / 3.214 |
| 41 (`MAU-A`) | 1,19 | 70 / 322 / 840 / 1.849 / 3.782 |
| 60 | 1,00 | 76 / 376 / 1.000 / 2.200 / 4.500 |
| 85 | 1,00 | 66 / 366 / 1.000 / 2.200 / 4.500 |

(Chưa trừ phần thưởng độ kiếp 50 thô mỗi bậc — thực tế cần ít hơn 50 × NT ở mỗi bậc kế tiếp.)

---

## 4. Ngày củng cố (D2)

### 4.1 Vì sao có

Không có D2, người chơi cày dài (≈ 110 phút / ngày) lên bậc 6 sau 31–44 ngày lịch (mô phỏng `09-10` §5.2) — nhanh tới mức bậc 5–6 mất ý nghĩa và Côn Lôn đến trước khi cốt truyện kể xong. D2 hãm **nhịp lịch** của người cày mà **không** hãm người chơi đều đặn (người đều đặn tự nhiên cần nhiều ngày hơn số ngày củng cố). Đây là hình thức game của câu cổ pháp «tu dần, cần chân truyền, đừng tự luyện bừa» (`DAO_JIA[1].method`).

### 4.2 Định nghĩa

- **Ngày tu** = một ngày (theo `rollDay` của tài khoản) có **≥ 10 thô** (trong trần + ngoài trần cộng lại).
- Bộ đếm `ngayCungCo` về 0 khi lên bậc; +1 mỗi ngày tu.
- Ngày không chơi **không** làm mất bộ đếm (không phạt vắng mặt, `09-03` E5).
- Hiển thị: «Củng cố cảnh giới: 7 / 10 ngày tu».

### 4.3 Bảng

| Lên bậc | Ngày tu tối thiểu ở bậc trước | Câu NPC khi đủ ĐH nhưng thiếu ngày |
|---|---|---|
| 2 | 0 | — |
| 3 | 3 | «Nước vừa rót còn gợn. Đợi nó lắng ba hôm.» |
| 4 | 10 | «Mười ngày nữa. Không phải để chờ — để quen.» |
| 5 | 20 | «Cảnh giới mới như đôi giày mới. Đi cho mềm đã.» |
| 6 | 30 | «Một tháng trăng. Trăng tròn không vội.» |

---

## 5. Cảnh giới chỉ tăng, Đạo Hạnh có thể giảm

Chi tiết ở `09-03` §10. Tóm lại cho phần cảnh giới:

| Tình huống | Bậc | Hệ quả |
|---|---|---|
| ĐH ≥ ngưỡng bậc hiện tại | giữ | bình thường |
| ĐH < ngưỡng bậc hiện tại (do phạm giới) | **giữ** | «Cảnh giới bất ổn»: gia trì mờ 50%; không độ kiếp; không nhận đệ tử mới; vẫn bay, vẫn vào mọi nơi đã mở |
| Có Nợ Âm | giữ | không độ kiếp (bậc ≥ 4); tên kèm dấu Nợ Âm trên Thiên Bảng |
| Bậc 1–3 và Tiềm Lực bị cập nhật (§12.2) | giữ | ĐCG tính lại; nếu thấp hơn ngưỡng bậc đang có → «bất ổn», không tụt |

---

## 6. Mở khóa theo bậc

### 6.1 Khả năng

| Bậc | Khả năng mới | Mô tả cơ chế | Ghi chú code |
|---|---|---|---|
| 1 | Đi bộ, chạy; Sổ Tu; mọi MG bậc 1 | — | đã có đi lại, va chạm (`collide.js`), A* (`world.js`) |
| 2 | **Thần thức sơ khai** | cụm thuốc (`MG-13`) và NPC «cần giúp» (móc `DEED-*` của tài liệu 05) trong bán kính 15 m có ánh sáng mờ màu hành | chưa có — cần làm |
| 2 | **Lễ đặt danh** | đặt đạo hiệu / pháp danh / tự (theo họ) bằng `MG-10` chế độ «của mình» | `09-05` MG-10 |
| 2 | **Nhập môn** một đạo thống chính | nghi lễ ở thánh địa hoặc phân đàn (§10) | |
| 3 | **Ngự kiếm** (bay) | gia trì `fly` cũ, giới hạn độ cao 60 m, tốc độ 18 m/s | đã có `fly` (`progress.js › GIATRI`), thêm giới hạn độ cao — cần làm |
| 3 | **Vọng khí** | sau khi người chơi xong bước «Lập trụ» của một án (`cases.js`), nhân vật NPC khách hiện vầng màu hành mạnh nhất của lá số (lấy từ `R.wx.pct`) — gợi ý cho bước «Đếm ngũ hành», **không** hiện Dụng thần | chưa có — cần làm |
| 4 | **Súc địa** | dịch chuyển giữa các đạo tràng / phân đàn đã đến; tiêu 10 Nguyên Khí; chờ 10 phút thực giữa hai lần | chưa có — cần làm |
| 4 | **Nhận đệ tử** | canon §10: cảnh giới ≥ 4 nhận đệ tử; tối đa 3 đệ tử cùng lúc (tài liệu 10 chi tiết) | |
| 4 | **Nhập định sâu** | `MG-01` mức Thâm; `MG-15` mức Thâm | |
| 4 | **Tiên Thiên thôi tính** | ĐCG chỉ còn ĐH (canon) — Sổ Tu hiện câu: «Từ đây, hạt giống không còn được tính. Chỉ còn cái cây.» | |
| 5 | **Xuất thần** | camera tách khỏi thân lên cao 120 m, nhìn «khí mạch» (đường sáng nối các điểm vượng của Huyền Không năm nay trên bản đồ — `xuankong › xuankongPan(năm).wangFang`); dùng cho hoạt động phong thủy cấp vùng (`09-08`) và chụp ảnh | chưa có — cần làm |
| 5 | **Cưỡi hạc** | ngự vật mới: độ cao 150 m, 24 m/s | chưa có — cần làm |
| 5 | Lối cứu người Phong Đô | canon §9.1 | |
| 6 | **Đằng vân** | ngự vật mây: độ cao 300 m, 30 m/s — **đủ tới Côn Lôn (cao 260 m)** | chưa có — cần làm |
| 6 | **Pháp tướng** | khi tĩnh tọa, bóng pháp tướng lớn mờ sau lưng (gia trì mới `phaptuong`) | chưa có — cần làm |
| 6 | **Chủ đại lễ** | chủ trì lễ cấp máy chủ (Sóc, Vọng, lễ tiết) — xem `09-08` | |

**Thiết kế cổng Côn Lôn bằng vật lý:** đảo trời ở độ cao 260 m (canon §3). Ngự kiếm (60 m, kể cả VIP mở sớm) và cưỡi hạc (150 m) không lên tới; chỉ đằng vân bậc 6 lên được. Không cần tường vô hình — đúng T4 «thế giới thật». Lần đầu lên đảo là trong độ kiếp `ACT-K6-QN`: ba vị thầy của ba đạo người chơi đang tu dựng **Vân Kiều** (cầu mây) một lần (`09-02` §7) — chính hình ảnh «quy nhất»; sau khi đạt bậc 6, người chơi tự bay lên bằng đằng vân.

### 6.2 Vùng

| Bậc | Vùng mở (là nơi được **tu học**: thầy nhận dạy, MG mở, độ kiếp) |
|---|---|
| 1 | `thanh` (Huyền Thành + Sơn Môn) · 7 vùng sảnh nghề `tubinh`, `manh`, `trichthien`, `cungthong`, `thulau`, `phongthuy`, `lichduong` · `vancoc` (khi cốt truyện Hồi I tới) |
| 2 | `vodang`, `longho`, `yentu` («3 thánh địa gần» — canon) |
| 3 | `buttap`, `vanmieu` (đi bằng ngự kiếm thuận tiện) |
| 4 | `chungnam`, `maoshan`, `mieucuong` («thánh địa xa» — canon) |
| 5 | `phongdo`, `tangdia` (canon) |
| 6 | `conlon` (cần Quy nhất — canon) |

**Quy tắc «thỉnh tổ đình»:** khi lên bậc 3, thánh địa của **đạo thống chính** mở ngay cho người chơi (dù chung ra là bậc 4–5), vì độ kiếp bậc 4 trở đi của đạo ấy diễn ra ở tổ đình. Ví dụ người chủ tu `BD` lên bậc 3 thì Phong Đô mở (chỉ khu đạo tràng Bắc Đế, chưa mở «lối cứu người» của bậc 5).

**Khách hành hương:** vùng chưa mở **vẫn đi vào được** (T4 — mọi công trình đi vào được). Người chưa đủ bậc là «khách hành hương»: vào sân, vào điện, ngồi trà, hái thuốc (`MG-13`), kinh hành trên đường công cộng (`MG-20`); thầy của vùng **chưa nhận dạy** (MG khác chưa mở) và nói một câu riêng («Con cứ ngồi chơi. Khi nào tóc con dài thêm chút nữa, ta dạy»). Không có kết giới chặn đường.

**Lối cốt truyện:** tài liệu 03 có thể đưa người chơi vào vùng sớm hơn bậc cho một cảnh cốt truyện. Trong lối cốt truyện, người chơi làm được việc của cảnh đó, **không** mở MG và độ kiếp của vùng.

### 6.3 Mini-game theo bậc

| Bậc | MG mở (chung) | MG mở sớm nếu là đạo thống chính |
|---|---|---|
| 1 | `MG-01`, `03` (Hương thí), `04`, `06`, `07`, `08`, `09`, `12`, `13`, `14`, `16` (web), `17`, `18`, `20` | — |
| 2 | `MG-02`, `10`, `11`, `19`, `21`, `22` | — |
| 3 | `MG-05` (khay nhỏ), `MG-15`, `MG-03` Hội thí | `MG-24` nếu chủ tu `TT` |
| 4 | `MG-24`, `MG-03` Đình thí, `MG-05` đàn lớn (với chủ tu `MT`) | `MG-23` nếu chủ tu `BD` |
| 5 | `MG-23`, `MG-05` đàn lớn | — |
| 6 | chế độ «Chủ lễ» của `MG-06`, `MG-17`, `MG-19` | — |

### 6.4 Gia trì và thẩm mỹ

Xem §7 (hợp nhất `GIATRI`) và §8 (hiệu ứng). Thêm theo bậc:

| Bậc | Vật phẩm thẩm mỹ nhận miễn phí (không bán, không giao dịch) |
|---|---|
| 2 | Đai lưng màu hành Dụng (theo `WX_GIATRI`) |
| 3 | Kiếm / liên đài / bút ngự (theo họ — §8.3) |
| 4 | Áo môn phái của đạo thống chính (tài liệu 08 / Tàng Y Các thiết kế) |
| 5 | Mũ / trâm / mũ sư theo họ |
| 6 | Khung tên «Hợp Đạo / Giải Thoát / Thánh Hiền» trên Thiên Bảng |

Đồ của Tàng Y Các (`cosmetics.js › ITEMS`) giữ nguyên điều kiện cũ (`unlock.level`, `unlock.vip`). Không món nào của Tàng Y Các bị khóa theo cảnh giới (để không biến cảnh giới thành cổng bán hàng); ngược lại vật phẩm cảnh giới không bán trong Tàng Y Các (E1).

### 6.5 Ngự vật và giới hạn bay

| Ngự vật | Mở | Độ cao tối đa | Tốc độ | Tiêu Nguyên Khí | Ghi chú |
|---|---|---|---|---|---|
| Ngự kiếm / Liên đài / Ngự bút | bậc 3 (VIP sớm) | 60 m | 18 m/s | 0 | da hình theo họ; Tàng Y Các bán da khác (thẩm mỹ) |
| Cưỡi hạc | bậc 5 | 150 m | 24 m/s | 0 | |
| Đằng vân | bậc 6 | 300 m | 30 m/s | 0 | tới được Côn Lôn |
| Súc địa (không phải bay) | bậc 4 | — | tức thời | 10 | chờ 10 phút |

Bay không tốn Nguyên Khí (bay là thưởng, không phải gánh nặng). Trong vùng thánh địa, bay bị hạ thấp tự nhiên khi vào sân đạo tràng (người chơi đáp xuống đi bộ — tôn trọng nơi thờ tự); vùng đáp đánh dấu bằng cổng sơn môn.

### 6.6 Xã hội

| Bậc | Quyền |
|---|---|
| 2 | vào môn phái (tài liệu 10, `GUILD-*`) của đạo thống chính |
| 3 | được giao vai trong lễ tuần (`ACT-041`): «Chung đầu», «Hương đăng» |
| 4 | nhận đệ tử (canon); dẫn đồng tu |
| 5 | chủ lễ tuần của môn phái |
| 6 | chủ đại lễ cấp máy chủ; được mời làm «giám khảo danh dự» ở Đình thí (chỉ đọc bài, không chấm — điểm vẫn do máy) |

---

## 7. Hợp nhất với `progress.js`

### 7.1 Hai thang song song

| Thang | Nguồn | Tăng bởi | Dùng để |
|---|---|---|---|
| **Cấp** (giữ nguyên) | `progress.js › levelOf(state.xp)`; `xp` = Phúc Khí tích lũy đời | mọi hoạt động có Phúc Khí (cả bói, trên web) | Ngọc +20 / cấp (canon §7), điều kiện `unlock.level` của Tàng Y Các, danh hiệu quán `TITLES` (theo Phúc Khí) |
| **Cảnh giới** (mới) | `state.tu` (chưa có — cần làm) | Đạo Hạnh + điều kiện §3.2 | vùng, khả năng, gia trì, MG, ngự vật, quyền xã hội |

Cấp đo **mức tham gia**, cảnh giới đo **mức tu**. Người chỉ thích xin xăm, xem quẻ vẫn lên cấp, vẫn có Ngọc, nhưng không lên cảnh giới (`09-03` E3).

### 7.2 Gia trì: chuyển từ cấp sang cảnh giới

Canon §9.1: «cấp gia trì mở theo cảnh giới thay vì cấp».

| Gia trì (`GIATRI.id`) | Tên | Cấp cũ (`lv`) | **Bậc mới** | VIP mở sớm (giữ cờ `vip`) |
|---|---|---|---|---|
| `aura` | Hào quang hộ thể | 2 | **2** | có |
| `motes` | Linh khí quanh thân | 4 | **3** | có |
| `fly` | Ngự kiếm phi hành | 8 | **3** (canon) | có (độ cao 60 m) |
| `trail` | Vệt sáng bộ pháp | 6 | **4** | có |
| `halo` | Pháp quang sau lưng | 10 | **5** | không |
| `phaptuong` (mới) | Pháp tướng | — | **6** | không |

Màu gia trì giữ nguyên quy tắc hiện có: theo hành Dụng thần của người chơi (`WX_GIATRI`).

### 7.3 Mã đề xuất (sửa `progress.js`)

```js
// progress.js (đề xuất) — giữ API cũ, thêm bậc
export const GIATRI = [
  { id: 'aura', lv: 2, tier: 2, vip: true, name: 'Hào quang hộ thể', desc: '…' },
  { id: 'motes', lv: 4, tier: 3, vip: true, name: 'Linh khí quanh thân', desc: '…' },
  { id: 'trail', lv: 6, tier: 4, vip: true, name: 'Vệt sáng bộ pháp', desc: '…' },
  { id: 'fly', lv: 8, tier: 3, vip: true, name: 'Ngự kiếm phi hành', desc: '…' },
  { id: 'halo', lv: 10, tier: 5, vip: false, name: 'Pháp quang sau lưng', desc: '…' },
  { id: 'phaptuong', lv: null, tier: 6, vip: false, name: 'Pháp tướng', desc: 'bóng pháp tướng khi tĩnh tọa' },
];
export const tierOf = (s) => s?.tu?.tier || 1;              // bậc lưu sẵn (mốc cao nhất), không tính lại mỗi lần
export function unlocked(s, id, now = Date.now()) {
  const g = GIATRI.find((x) => x.id === id);
  if (!g) return false;
  const legacy = (s?.flags?.giatriLegacy || []).includes(id); // ân cựu khách (§7.4)
  return tierOf(s) >= g.tier || (g.vip && vipActive(s, now)) || legacy;
}
// newlyUnlocked(a, b) đổi chữ ký: newlyUnlockedTier(tierA, tierB)
```

`lv` giữ lại trong dữ liệu để migration đọc; UI không còn hiện «mở ở cấp X» mà hiện «mở ở bậc Y».

### 7.4 Migration «ân cựu khách»

Người chơi đang có cấp cao trước bản cập nhật **không mất** gia trì đã có.

```
khi tải state lần đầu sau bản cập nhật (state.tu chưa có):
  legacy = GIATRI.filter(g => g.lv && levelOf(state.xp) >= g.lv).map(g => g.id)
  state.flags.giatriLegacy = legacy
  state.tu = { tier: 1, daoHanh: 0, ... }        // cảnh giới bắt đầu từ bậc 1 cho mọi người
  hiện thư «Ân cựu khách»: liệt kê gia trì được giữ; giải thích cảnh giới mới
```

Thêm: người cũ có `xp ≥ 500` (cấp ≥ 6) nhận **Ân Cựu Khách** = 40 thô ngoài trần một lần (≈ một ngày tu), ghi lý do «đã ở quán lâu». Không quy đổi Phúc Khí cũ thành Đạo Hạnh theo tỉ lệ (sẽ phá nhịp và mâu thuẫn E3 vì Phúc Khí cũ có cả từ bói).

### 7.5 `TITLES`, `TEAS` và cấp

- `TITLES` (Khách Vãng Lai → Tri Âm Huyền Quán) giữ nguyên, hiện như «danh hiệu quán». Tên cảnh giới hiện ở dòng riêng.
- `TEAS` hiện mở theo `state.phucKhi` (số dư). Đề xuất đổi sang `state.xp` (tích lũy) để tiêu tiền không khóa lại trà (câu hỏi mở — README).
- Ngọc +20 mỗi lần lên **cấp** (canon) giữ nguyên. Lên **cảnh giới** không cho Ngọc (tránh gắn cảnh giới với tiền); cho vật phẩm thẩm mỹ §6.4.

### 7.6 Cấu trúc `state.tu` đề xuất

```js
// state.js › createState() thêm (chưa có — cần làm); máy chủ giữ bản gốc
tu: {
  tier: 1,                 // mốc cao nhất đã đạt (không tụt)
  daoHanh: 0,              // ×10, số nguyên
  family: null,            // 'dao' | 'phat' | 'nho' (từ cửa nhập môn, rồi theo đạo chính)
  primary: null,           // mã đạo thống chính: 'CN' | 'TV' | …
  traditions: {},          // { CN: { tudo: 0 }, … } tối đa 3 đạo đang tu (§10.2)
  dwell: 0,                // ngày tu ở bậc hiện tại
  capUsed: 0, capDate: '', // trần ngày
  duHuong: 0,              // 09-03 §5.3
  repeat: {},              // { 'MG-04': 2 } số lượt trong ngày
  nk: 100, nkAt: 0,        // Nguyên Khí hiện thời + mốc thời gian (09-09 §5)
  tlSnap: null,            // { score, engineVer, at } — ấn Tiên Thiên (§12.2)
  noAm: 0,                 // Nợ Âm (09-03 §10.3)
  faults: [],              // lỗi phạm giới chưa sám (09-03 §10.2)
  kiep: {},                // { 3: { tries, lastAt, passedAt } }
  nhatKhoa: { date: '', done: [] },
}
```

`hydrate()` hiện chép mọi khóa của khung mặc định nên thêm `tu` vào `createState()` là đủ để bản cũ không vỡ.

---

## 8. Hình ảnh và hiệu ứng

### 8.1 Nguyên tắc

- Màu chủ đạo = hành Dụng thần của người chơi (`WX_GIATRI[yong.primary].color`) — giống gia trì hiện có.
- Hiệu ứng **tăng dần, không lòe loẹt**: bậc 6 phải trang nghiêm hơn, không «chói» hơn bậc 5.
- Người chơi tắt được từng lớp hiệu ứng của **chính mình** và của **người khác** (Cài đặt › Hiển thị).

### 8.2 Hiệu ứng thường trực theo bậc × họ

| Bậc | Họ Đạo | Họ Phật | Họ Nho |
|---|---|---|---|
| 1 | — | — | — |
| 2 | vòng sáng mảnh dưới chân (`aura`) | vòng sáng mảnh + chuỗi tràng hạt trên tay | vòng sáng mảnh + túi sách bên hông |
| 3 | linh khí theo hành bay quanh (`motes`); kiếm sau lưng khi không bay | `motes` dạng cánh sen nhỏ | `motes` dạng chữ triện nhỏ (仁義禮智信) trôi chậm |
| 4 | **ngũ khí triều nguyên**: năm đốm năm màu hội về ngực khi đứng yên 5 giây; `trail` khi chạy | khi đứng yên, mặt đất quanh chân gợn như mặt nước lặng («Định») | khi đứng yên, gió nhẹ lật trang sách vô hình; `trail` là vệt mực mờ |
| 5 | **tam hoa tụ đỉnh**: ba đóa hoa ánh sáng rất mờ trên đỉnh đầu; `halo` | hào quang tròn sau gáy (`halo`) dạng hoa sen | `halo` dạng vòng sách cuộn |
| 6 | **pháp tướng** khi tĩnh tọa; khi đi lại không có thêm gì (đạo «trở về thường») | thân đi qua để lại hạt sáng tan nhanh («không bám») | cột khí trắng mảnh khi đứng nghiêm ở Văn Miếu («hạo nhiên chi khí») |

Ghi chú: «Ngũ khí triều nguyên, tam hoa tụ đỉnh» (五氣朝元、三花聚頂) là thành ngữ nội đan quen thuộc; dùng làm hình ảnh, không phải chỉ dẫn luyện.

### 8.3 Ngự vật theo họ ở bậc 3

| Họ | Ngự vật bậc 3 | Mô tả |
|---|---|---|
| Đạo | Ngự kiếm (đã có) | đứng trên kiếm |
| Phật | Liên đài | đứng trên đài sen tỏa nhẹ |
| Nho | Ngự bút | ngồi trên cây bút lông lớn bay ngang, vệt mực mờ |

Ba ngự vật cùng thông số (§6.5); chỉ khác hình.

### 8.4 Hiệu ứng khoảnh khắc độ kiếp

| Pha | Hình | Âm | Người xung quanh thấy |
|---|---|---|---|
| Báo «Thời khắc đã tới» | mây trên đầu tụ chậm thành vòng | một tiếng khánh xa | thấy vòng mây (bán kính 200 m) |
| Trong kiếp | thời tiết cục bộ theo bậc (§8.5) | nhạc nền riêng của đạo (tài liệu 12) | thấy nhân vật đứng / ngồi trong vùng sáng; có thể **hộ pháp** (`09-08`) |
| Đạt | một cột sáng màu hành bắn lên rồi tan thành mưa cánh hoa / lá / chữ (theo họ) | chuông dài | thông báo vùng: «<đạo hiệu> đã nhập <tên bậc>» (tắt được) |
| Chưa đạt | mây tan nhẹ, không có cột sáng | gió | không thông báo (riêng tư) |

### 8.5 Thời tiết độ kiếp theo bậc

| Lên bậc | Họ Đạo | Họ Phật | Họ Nho |
|---|---|---|---|
| 2 | gió núi | tiếng chuông xa | gió lật sách |
| 3 | mưa phùn ấm | mưa hoa nhỏ | mưa bụi trên mái ngói |
| 4 | sấm xa không chớp (không có sét đánh vào người — T3) | trăng hiện giữa ban ngày | mây ngũ sắc |
| 5 | tuyết mỏng giữa mùa | sen nở trên mặt nước gần nhất | tiếng đọc sách vọng từ xa |
| 6 | trời quang tuyệt đối, không một gợn mây | im lặng hoàn toàn trong 10 giây | ánh nắng chiếu thẳng vào bảng đá Tiến sĩ (ở Văn Miếu) hoặc nơi đứng |

### 8.6 Ngân sách hiệu năng (theo mỗi nhân vật)

| Bậc | Hạt tối đa (cao / trung / thấp) | Vật thể sáng | Hiện cho người khác ngoài 30 m |
|---|---|---|---|
| 2 | 24 / 16 / 8 | 1 (vòng chân) | chỉ vòng chân |
| 3 | 48 / 32 / 12 | 2 | vòng chân |
| 4 | 64 / 40 / 16 | 2 | vòng chân + `trail` khi chạy |
| 5 | 96 / 56 / 24 | 3 | vòng chân + `halo` |
| 6 | 128 / 72 / 32 | 3 | vòng chân + `halo` |

Trong MMO đông người (> 30 nhân vật trong tầm nhìn), mọi nhân vật khác hạ xuống mức «thấp» tự động. Ràng buộc dựa trên bộ dựng hiện tại `render3d.js` (Three.js).

---

## 9. Giao diện Sổ Tu (cảnh giới)

Thêm tab «Tu» vào Sổ Mệnh (`stations.js › openBook`, đang có tab `tuhoc`). Trên iOS sổ tên «Sổ Tu Học» (`features.js › TEXT.book`).

```
┌────────────────────────────────────────────────────┐
│ SỔ TU · Huyền Thủy · đạo hiệu: Thanh Hư                 │
│ ─────────────────────────────────────────────────── │
│  Bậc 3 · LUYỆN TINH HÓA KHÍ        Thủ Lô (Võ Đang)     │
│  «Gom tinh thành khí: giữ thân cho đều…»                 │
│                                                    │
│  Đạo Hạnh   812 / 1.000  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░           │
│  Củng cố    10 / 10 ngày tu ✓                           │
│  Công ròng  34 / 20 ✓                                   │
│  Tu độ TV   290 / 250 ✓ (Nhập Thất)                     │
│  → còn 188 Đạo Hạnh tới «Thời khắc»                     │
│                                                    │
│  Hôm nay: trần 22,4 / 32 · Dư Hương 6 · Nguyên Khí 64   │
│  Nhật Khóa: [Tĩnh ✓] [Học ✓] [Hạnh ○]                   │
│                                                    │
│  Hệ số Nghịch Thiên ×1,19 · Hợp Dụng: Võ Đang, Phong Đô  │
│  «Gốc vừa phải. Đạo không hỏi gốc…»                     │
│  [Đạo thống] [Lịch sử độ kiếp] [Thiên Bảng]             │
└────────────────────────────────────────────────────┘
```

Không hiện Tiềm Lực ở trang chính sau bậc 4 (vì không còn tính) — vẫn xem được ở tab Mệnh Bàn.

---

## 10. Đạo thống chính, phụ, đổi đạo

### 10.1 Chọn đạo thống chính

- Mở sau độ kiếp bậc 2. Người chơi đến thánh địa (nếu đã mở) hoặc phân đàn của đạo muốn theo, làm nghi lễ **nhập môn** (cảnh do tài liệu 05 viết trong `CQ-<đạo>-01`).
- Sổ Tu gợi ý hai đạo **hợp Dụng** (`09-03` §4) nhưng ghi rõ: «Gợi ý, không bắt buộc» (canon §5.6).
- Khi chọn, **họ** của người chơi đổi theo đạo chính (§2.1); tên bậc đổi theo họ.

### 10.2 Tối đa ba đạo đang tu

Canon: tu song song tối đa 3 đạo thống chính. Người chơi có **1 đạo chính + tối đa 2 đạo phụ**. Hoạt động của đạo thứ tư vẫn chơi được (như khách) và vẫn cho ĐH theo nơi chơi, nhưng **không tăng Tu độ** cho đạo thứ tư.

| Thao tác | Điều kiện | Hệ quả |
|---|---|---|
| Thêm đạo phụ | bậc ≥ 3 cho đạo phụ thứ nhất, bậc ≥ 4 cho đạo phụ thứ hai | Tu độ đạo đó bắt đầu tính |
| Bỏ một đạo phụ | bất kỳ lúc nào | Tu độ **giữ nguyên** (đông lạnh), tính lại nếu quay về |
| Đổi đạo chính («cải tông») | một lần / 30 ngày; đạo mới phải đang là đạo phụ có Tu độ ≥ 250 | họ và tên bậc đổi; danh xưng môn hạ theo đạo mới; độ kiếp kế tiếp theo đạo mới |

### 10.3 Quy nhất

Điều kiện độ kiếp bậc 6 (D4): ba đạo đang tu đều Tu độ ≥ 250 (Nhập Thất) và công ròng dương (canon). Sổ Tu có thanh «Quy nhất 2 / 3» từ bậc 4.

---

## 11. Sau bậc 6

Cảnh giới dừng ở bậc 6; con đường tu không dừng.

| Mạch | Đo bằng | Phần thưởng |
|---|---|---|
| Thiên Bảng Đạo Hạnh | ĐH đời và ĐH mùa | khung tên, chỗ ngồi danh dự trong đại lễ |
| Viên Thông từng đạo | Tu độ ≥ 2.000 | danh hiệu «Viên Thông <đạo>», áo môn phái cao, mức Viên Thông của MG |
| Mốc Liễu Phàm (canon 300 / 600 / 1.000 công) | công ròng | 300: danh hiệu «Lập Mệnh» · 600: «Cải Quá» (đối tượng đặc biệt ở Am Vân Cốc) · 1.000: «Liễu Phàm Truyền Nhân» + bức hoành phi trong nhà riêng «命由我作» (`REMEDY_QUOTES[0]`) |
| Sư đồ | số đệ tử lên bậc 3 | canon: đệ tử hoàn thành Mệnh Đồ thì sư phụ nhận công |
| Côn Lôn Thiên Trì | hoạt động cuối (`09-08`) | — |

Tên ba danh hiệu lấy từ tên bốn thiên của Liễu Phàm Tứ Huấn (Lập mệnh chi học · Cải quá chi pháp · Tích thiện chi phương · Khiêm đức chi hiệu). `remedy-fate › LIAOFAN_STORY` hiện chỉ có tóm tắt điển cố (`title`, `story`, `lesson`, `rootChain`), chưa có tên bốn thiên (chưa có — cần làm: thêm trường `chapters`).

---

## 12. Ca biên

### 12.1 Lá số không rõ giờ sinh

Form lập hồ sơ có ô «Không rõ giờ sinh» (`stations.js`). Tiềm Lực tính theo cách engine xử lý lá số thiếu giờ (theo `chart.js › analyze` với giờ mặc định của app). Thêm quy tắc: lá số **không giờ** của nhân vật chính được hiện nhãn «ba trụ» và NT **không** đổi vì thiếu giờ — game không thưởng hay phạt việc thiếu giờ.

### 12.2 Ấn Tiên Thiên (khóa Tiềm Lực)

- Tiềm Lực của nhân vật chụp lại lúc **tạo nhân vật** (`tu.tlSnap = { score, engineVer, at }`).
- Người chơi sửa ngày giờ sinh **miễn phí 1 lần** trong 7 ngày đầu và **trước khi lên bậc 2** (người nhập nhầm). Sau đó, đổi ngày giờ sinh = tạo nhân vật mới (giữ trang phục, Ngọc; Đạo Hạnh và cảnh giới bắt đầu lại). Lý do: hệ số NT phụ thuộc Tiềm Lực; nếu đổi tùy ý, người chơi có thể «chọn hạt giống nhỏ» giữa chừng để lấy ×1,5.
- Khi engine được sửa (Phụ lục B của bản sơ đồ tổng có lỗi engine cần sửa) và `synthesis.score` của cùng ngày giờ đổi: **ấn cũ giữ nguyên**; Sổ Tu báo «Thầy vừa tính lại kỹ hơn, Tiềm Lực mới của con là X» và cho chọn một lần **giữ ấn cũ** hoặc **nhận ấn mới** (áp dụng từ hôm đó trở đi, ĐH đã có không đổi).

### 12.3 Nhiều hồ sơ trong Sổ Mệnh

Sổ Mệnh có tới 5 hồ sơ (`CAPS.maxProfiles`). **Nhân vật** dùng hồ sơ được đánh dấu «Bản thân» (hồ sơ đầu tiên mặc định nhãn «Bản thân» trong form hiện có). Hồ sơ người nhà chỉ dùng cho xem, cho `MG-19` lễ thay, cho án; không tạo cảnh giới riêng.

### 12.4 Người chơi chọn lá số «xấu» có chủ đích

Không chặn. Hệ số NT tối đa 1,5 và lợi thế 0,4 × TL biến mất ở bậc 4; người «chọn hạt giống nhỏ» vẫn phải chơi đủ ngày củng cố (D2) và làm đủ công (D3). Thiên Bảng không xác minh ngày sinh; game không có PvP, không bán Đạo Hạnh, nên lợi ích gian lận thấp. Câu dẫn của Sổ Tu không nói «bạn may mắn vì lá số xấu» — chỉ nói «hạt nhỏ thì chăm nhiều hơn».

### 12.5 Lên hai bậc trong một ngày

Không thể: mỗi bậc cần độ kiếp riêng và D2 của bậc sau bắt đầu từ 0 (trừ bậc 2 → 3 cần 3 ngày tu). Bậc 1 → 2 trong ngày đầu là bình thường.

### 12.6 Đổi múi giờ, du lịch

Theo `09-03` §5.1: ngày tài khoản theo múi giờ khai báo; đổi múi giờ quá 1 lần / 30 ngày giữ múi cũ. Ngày tu (D2) tính theo ngày tài khoản.

### 12.7 Ngoại tuyến lâu

Chơi ngoại tuyến được (web có lưu cục bộ). Đạo Hạnh ngoại tuyến «tạm» tới khi đồng bộ; lên bậc chỉ xác nhận khi trực tuyến (độ kiếp cần máy chủ chấm). Ngày tu ngoại tuyến được tính khi đồng bộ nếu nhật ký hợp lệ (`09-03` §12).

---

## 13. Nghiệm thu phần cảnh giới

- [ ] Ba họ × sáu bậc hiện đúng tên canon; họ đổi theo đạo chính.
- [ ] ĐCG bậc ≤ 3 có `0,4 × Tiềm Lực`; từ bậc 4 chỉ ĐH (test 4 TL: 20, 41, 60, 85).
- [ ] Năm điều kiện D1–D5 kiểm ở máy chủ; thiếu điều kiện nào Sổ Tu nói rõ điều kiện ấy.
- [ ] Cảnh giới không tụt trong mọi đường mã (phạm giới, cập nhật Tiềm Lực, đổi đạo chính).
- [ ] Gia trì mở theo bậc; ân cựu khách giữ gia trì cũ; VIP vẫn mở sớm `aura`, `motes`, `trail`, `fly`.
- [ ] Ngự kiếm không lên quá 60 m, cưỡi hạc 150 m, đằng vân 300 m; Côn Lôn (260 m) chỉ tới bằng đằng vân.
- [ ] Vùng chưa mở vẫn đi vào được (khách hành hương); thầy từ chối dạy bằng thoại riêng.
- [ ] Quy tắc thỉnh tổ đình: đạo chính mở thánh địa ở bậc 3.
- [ ] Ngân sách hạt theo §8.6; tắt được hiệu ứng của mình và của người khác.
- [ ] Danh xưng môn hạ không trùng phẩm trật tôn giáo thật (rà bởi cố vấn tôn giáo của dự án — tài liệu 14).
