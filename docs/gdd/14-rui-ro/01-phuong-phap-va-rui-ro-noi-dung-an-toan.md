# 14.01 · Phương pháp quản trị rủi ro · Sổ rủi ro phần A (nội dung, tôn giáo) và phần B (an toàn, sức khỏe tinh thần)

> Thuộc tập **14 · Rủi ro, tuân thủ và tôn trọng tín ngưỡng**. Mã định danh: `RISK-001` … `RISK-050`.
> Nguồn đối chiếu: `docs/gdd/00-KINH-DIEN-CHUNG.md` (trụ cột T6), `docs/GAME-AAA-THIET-KE.md` §4.7, §5.5, §6.4, §11, §14; mã thật trong `src/game/` và `src/engine/`.

---

## 1. Phương pháp

### 1.1 Thang đo

**Khả năng (K)** — xác suất rủi ro xảy ra trong vòng đời một mốc phát hành nếu không có biện pháp mới:

| K | Tên | Diễn giải |
|---|---|---|
| 1 | Hiếm | Chưa thấy ở sản phẩm cùng loại; cần nhiều điều kiện cùng lúc |
| 2 | Thấp | Đã thấy ở sản phẩm khác, chưa có dấu hiệu ở dự án này |
| 3 | Trung bình | Có dấu hiệu trong thiết kế hoặc mã hiện có |
| 4 | Cao | Thiết kế hiện tại sẽ gây ra nếu giữ nguyên |
| 5 | Gần chắc | Đã xảy ra hoặc đang tồn tại trong mã |

**Tác động (T)**:

| T | Tên | Người chơi | Dự án |
|---|---|---|---|
| 1 | Nhỏ | Khó chịu thoáng qua | Sửa trong ngày |
| 2 | Vừa | Mất tiến độ, phiền | Sửa trong tuần, phàn nàn lẻ tẻ |
| 3 | Đáng kể | Tổn thương cảm xúc, mất tiền nhỏ | Bản vá khẩn, đánh giá xấu, bị nền tảng nhắc |
| 4 | Nặng | Tổn hại tâm lý thật, lộ dữ liệu nhạy cảm | Bị gỡ khỏi cửa hàng, phạt hành chính, khủng hoảng truyền thông |
| 5 | Nghiêm trọng | Nguy cơ tính mạng, tổn hại cộng đồng tín ngưỡng | Trách nhiệm hình sự, đóng dịch vụ, mất giấy phép |

**Điểm = K × T.** Mức: **Đỏ** ≥ 15 (chặn phát hành nếu chưa có biện pháp đã kiểm), **Cam** 8–14 (phải có chủ và hạn), **Xanh** ≤ 7 (theo dõi).

### 1.2 Trạng thái

| Trạng thái | Nghĩa | Ai được chuyển |
|---|---|---|
| `Mở` | Đã nhận diện, chưa có biện pháp | Bất kỳ ai |
| `Đang xử lý` | Có chủ, có hạn, đang làm | Chủ rủi ro |
| `Đã giảm` | Biện pháp đã vào mã/nội dung, có bằng chứng kiểm | Chủ rủi ro + QA |
| `Chấp nhận` | Giữ nguyên có ý thức, ghi lý do | Giám đốc sản xuất (với Đỏ: cần thêm Pháp chế) |
| `Đóng` | Nguồn rủi ro không còn (tính năng bị bỏ) | Giám đốc sản xuất |

Rủi ro Đỏ **không được** chuyển sang `Chấp nhận` nếu thuộc nhóm tôn giáo, sức khỏe tinh thần hoặc pháp lý hình sự.

### 1.3 Vai trò (mã chủ rủi ro)

| Mã | Vai trò | Ghi chú cho đội nhỏ |
|---|---|---|
| `GĐSX` | Giám đốc sản xuất | Chủ dự án kiêm nhiệm được |
| `TND` | Trưởng nội dung & văn hóa (kịch bản, codex, thoại) | |
| `HĐCV` | Hội đồng cố vấn tín ngưỡng (mỗi truyền thống ≥ 1 người, xem tập 14.07 §7) | **Không kiêm nhiệm bởi người trong đội.** Có quyền phủ quyết nội dung thuộc truyền thống của mình |
| `TAI` | Trưởng AI (persona, prompt, kiểm định) | |
| `TAT` | Trưởng an toàn người chơi (khủng hoảng, trẻ em) | Không được kiêm `TKT` (xung đột lợi ích doanh thu) |
| `PC` | Pháp chế kiêm người phụ trách bảo vệ dữ liệu cá nhân | Có thể thuê ngoài theo giờ |
| `TPH` | Trưởng phát hành nền tảng (App Store, Google Play, web) | |
| `TMC` | Trưởng máy chủ (Worker, Durable Object, D1) | |
| `TBM` | Trưởng bảo mật | |
| `TKT` | Trưởng kinh tế game | |
| `TCĐ` | Trưởng cộng đồng & điều hành | |
| `AD` | Giám đốc mỹ thuật | |
| `QA` | Trưởng kiểm thử | |
| `TT` | Truyền thông | |

**Quy tắc bốn mắt:** nội dung tôn giáo, âm tà, khủng hoảng và quy tắc AI phải có **người viết khác người duyệt**. Nếu đội chỉ có một người, nội dung đó phải chờ cố vấn ngoài duyệt (tập 14.07 §7) trước khi vào bản phát hành.

### 1.4 Chu kỳ rà soát

| Khi nào | Việc | Ai |
|---|---|---|
| Mỗi tuần sản xuất | Cập nhật trạng thái rủi ro Đỏ / Cam của mốc đang làm | Chủ rủi ro |
| Cuối mỗi mốc M0–M6 | Rà toàn sổ + checklist tập 14.13 | GĐSX, PC, TAT, TND |
| Trước mỗi lần nộp cửa hàng | Rà nhóm E (nền tảng) + F (riêng tư) | TPH, PC |
| Sau sự cố (SEV1–SEV2, tập 14.10 §7) | Thêm / nâng rủi ro, ghi bài học | Chủ sự cố |
| Mỗi quý | Xác minh lại đường dây nóng (tập 14.09 §5), văn bản pháp luật mới (tập 14.11 §12) | TAT, PC |

### 1.5 Cách đọc một mục

Mỗi mục có: **Nhóm · K · T · Điểm · Chủ · Mốc** (mốc bắt đầu phải xử lý), rồi:
- **Mô tả** — rủi ro là gì, bằng chứng trong mã / thiết kế nếu có;
- **Giảm thiểu** — việc làm trước để giảm K hoặc T;
- **Phát hiện** — dấu hiệu, công cụ, chỉ số để biết rủi ro đang xảy ra;
- **Dự phòng** — làm gì khi đã xảy ra.

Phân bổ sổ rủi ro:

| Phần | Nhóm | Mã | Tệp |
|---|---|---|---|
| A | Nội dung · tôn giáo | 001–030 | tệp này |
| B | An toàn · sức khỏe tinh thần | 031–050 | tệp này |
| C | AI | 051–072 | 14.02 |
| D | Pháp lý | 073–090 | 14.02 |
| E | Chính sách nền tảng | 091–104 | 14.02 |
| F | Quyền riêng tư | 105–118 | 14.03 |
| G | Bảo mật | 119–132 | 14.03 |
| H | Kinh tế | 133–142 | 14.03 |
| I | Cộng đồng | 143–152 | 14.04 |
| J | Sản xuất | 153–160 | 14.04 |
| K | Kỹ thuật | 161–167 | 14.04 |
| L | Danh tiếng | 168–175 | 14.04 |

---

## 2. Phần A — Nội dung và tôn giáo (RISK-001 … RISK-030)

### RISK-001 · Biểu tượng thiêng làm đồ thời trang, có món khóa sau VIP
**Nội dung · K 5 · T 4 · 20 Đỏ · Chủ: AD + TND, duyệt HĐCV · Mốc: M0**
- **Mô tả:** danh mục `src/game/cosmetics.js › ITEMS` đang có: `dai_sen` «Liên Hoa Đài» (đứng trên đài sen — tòa ngồi của Phật, Bồ-tát) làm *ngự vật*; `aura_sen` «Bộ Bộ Sinh Liên» (tích Đức Phật đản sinh, mỗi bước nở một hoa sen) làm hào quang mở ở cấp 8; `quan_sen` «Liên Hoa Quan — mũ hoa sen vàng của bậc đắc đạo» khóa **VIP + cấp 10**; `phap_luan` «Bát Quái Pháp Luân» khóa **VIP**; `phat_tran` (phất trần, pháp khí đạo sĩ); `dao_quan` «Ngân Đạo Quan… đạo sĩ chính tông». Mũ «của bậc đắc đạo» bán sau VIP tức là **bán biểu tượng chứng đắc** — đi ngược §11 («không bán cải mệnh, cảnh giới») và RB5.
- **Giảm thiểu:** áp quy tắc «vật thiêng không làm đồ thời trang» (tập 14.07 §5) lên toàn bộ 51 món trước M0. Đề xuất cụ thể: bỏ `aura_sen`, `dai_sen`; đổi `quan_sen` thành «Hà Hoa Trâm» (trâm hoa sen thường, không có chữ «đắc đạo», không khóa VIP); đổi `phap_luan` (xem RISK-002); `phat_tran`, `dao_quan` chỉ nhận được qua chuỗi nhiệm vụ đạo thống tương ứng, không bán bằng Ngọc, mô tả không dùng chữ «chính tông».
- **Phát hiện:** kiểm tự động trong `scripts/test-game-cosmetics.mjs`: danh sách từ khóa cấm trong `name`/`desc` (`đắc đạo`, `Phật`, `Bồ Tát`, `Pháp Luân`, `Sinh Liên`, `Liên Hoa Đài`, `xá lợi`, `cà sa`, `thụ lục`, `chính tông`) và cấm `unlock.vip` với món có `tags: ['sacred']`.
- **Dự phòng:** nếu đã phát hành: ẩn món khỏi cửa hàng trong 24 giờ, hoàn Ngọc cho người đã mua, đổi sang món thay thế cùng ô, thông báo lý do bằng lời xin lỗi ngắn.

### RISK-002 · Tên «Pháp Luân» trùng phong trào bị cấm tại Việt Nam và Trung Quốc
**Nội dung · K 4 · T 4 · 16 Đỏ · Chủ: TND + PC · Mốc: M0**
- **Mô tả:** `phap_luan` «Bát Quái Pháp Luân» vừa trộn biểu tượng Đạo (bát quái) với Phật (pháp luân), vừa trùng tên «Pháp Luân Công», một chủ đề chính trị – tôn giáo nhạy cảm. Hình vòng xoay vàng sau lưng còn dễ bị đọc là biểu tượng của phong trào đó. Nguy cơ: bị báo cáo nội dung chính trị, bị từ chối phê duyệt kịch bản G1 (RISK-074), bị chặn ở thị trường Trung Quốc nếu có.
- **Giảm thiểu:** đổi tên và hình: «Bát Quái Kính Hoàn» (vòng bát quái tĩnh, không xoay, không có nan pháp luân). Thêm từ «Pháp Luân» vào danh sách tên cấm của `protocol.js › cleanName` và danh sách từ khóa cấm của danh mục.
- **Phát hiện:** rà từ khóa trước mỗi lần nộp nội dung; nhóm cố vấn Phật giáo kiểm ảnh chụp từng món.
- **Dự phòng:** gỡ ngay, giữ quyền sở hữu nhưng thay hình bằng món mới; trả lời báo chí theo mẫu tập 14.04 §6.

### RISK-003 · Hành vi vô lễ trong không gian thờ (leo tượng, bay lên mái điện, nhảy trên bàn thờ)
**Nội dung · K 4 · T 4 · 16 Đỏ · Chủ: GĐSX (level design) + QA · Mốc: M1**
- **Mô tả:** game có ngự kiếm, cưỡi mây, hồ lô bay (`ITEMS › kiem, may, ho_lo_bay`) và va chạm theo hình khối (`collide.js`). Người chơi có thể đứng trên đầu tượng, đáp lên mái Kim Điện, ngồi lên hương án. Ảnh chụp màn hình kiểu này là chất liệu khủng hoảng truyền thông.
- **Giảm thiểu:** mỗi điện hạng A–B khai báo **vùng thiêng** (`sacredZones`): trong vùng tắt ngự vật, tắt nhảy, tắt hào quang ồn (sét, lửa), chỉ cho phép emote `bow`, `palm`; khối tượng và hương án có hộp va chạm cao hơn đầu người chơi để không đứng lên được; mái điện thờ là vùng cấm đáp (đẩy ra như cạnh bản đồ).
- **Phát hiện:** test A* + va chạm bổ sung trường hợp «thử đứng lên mọi tượng»; QA quay video kiểm 4 góc như §8.5.
- **Dự phòng:** bản vá máy chủ chặn đáp (không cần cập nhật client) qua danh sách vùng tải động; ghi nhận báo cáo cộng đồng có ảnh.

### RISK-004 · Danh xưng cảnh giới «Giải Thoát», «Thánh Hiền», «Hợp Đạo» đạt được bằng điểm
**Nội dung · K 4 · T 3 · 12 Cam · Chủ: TND, duyệt HĐCV · Mốc: M3**
- **Mô tả:** thang cảnh giới (canon §5) đặt «Giải Thoát» (Phật) và «Thánh Hiền» (Nho) ở bậc 6, mở bằng **4.500 Đạo Hạnh**. Với người theo đạo, giải thoát là mục tiêu tối hậu, không phải phần thưởng cày; gắn số điểm vào đó dễ bị xem là tầm thường hóa.
- **Giảm thiểu:** giữ mã bậc (canon) nhưng mọi chỗ hiện tên phải kèm hậu tố «(danh xưng trong truyện)»; codex giải thích rằng đây là **tên ải trong Huyền Giới**, không phải chứng đắc thật. Đề nghị HĐCV Phật giáo chọn tên thay thế cho bậc 5–6 (gợi ý: «Tuệ Quán», «Viên Dung») và ghi vào tài liệu 09 qua quy trình đổi canon.
- **Phát hiện:** khảo sát thử nghiệm kín với 10 người theo Phật giáo; câu hỏi «Có thấy bị xúc phạm không?».
- **Dự phòng:** đổi tên hiển thị bằng cấu hình (không đổi mã), áp cho mọi người chơi.

### RISK-005 · Đạo thống thành «buff chỉ số» (tôn giáo bị công cụ hóa)
**Nội dung · K 3 · T 3 · 9 Cam · Chủ: TND + TKT · Mốc: M2**
- **Mô tả:** §5.6 gán mỗi đạo thống «tăng chỉ số» và hệ số +10% nếu hợp Dụng thần. Người chơi sẽ chọn đạo vì số, và diễn đàn sẽ có câu «đạo nào mạnh nhất». So sánh hơn kém giữa các tôn giáo là điều cần tránh.
- **Giảm thiểu:** cân bằng để mọi đạo thống cho **tổng giá trị tương đương** trên 30 ngày chơi (bảng mô phỏng của TKT); bỏ chữ «mạnh / yếu» trong giao diện; codex ghi rõ «mỗi đạo thống là một con đường học, không có đạo hơn đạo».
- **Phát hiện:** đo tỉ lệ chọn đạo thống; lệch > 2 lần giữa đạo phổ biến nhất và ít nhất trong 2 tuần thì điều tra.
- **Dự phòng:** cân bằng lại; không bao giờ «nerf» bằng thông báo có giọng chê một đạo.

### RISK-006 · Nghi thức thật thành mini-game nhịp điệu có điểm «trượt»
**Nội dung · K 4 · T 3 · 12 Cam · Chủ: TND + GĐSX, duyệt HĐCV · Mốc: M2**
- **Mô tả:** §5.4 dự kiến sám hối bằng «tụng theo nhịp, lạy theo nhịp: mini-game nhịp điệu». Âm thanh «miss», combo, xếp hạng điểm lạy biến lễ lạy thành trò chơi phản xạ.
- **Giảm thiểu:** quy tắc thiết kế (tập 14.07 §6.3): không có trạng thái thất bại, không combo, không điểm số hiển thị, không âm thanh lỗi; nhịp chỉ để **giữ chậm** (đi nhanh thì nhân vật dừng lại chờ); kết quả là hoàn thành / chưa hoàn thành.
- **Phát hiện:** duyệt prototype bởi cố vấn Tịnh Độ và Toàn Chân trước khi làm art.
- **Dự phòng:** thay mini-game bằng cảnh cắt chậm có lựa chọn tâm niệm.

### RISK-007 · Chú, kinh dùng như «phép kích hoạt»
**Nội dung · K 3 · T 4 · 12 Cam · Chủ: TND + TAI · Mốc: M2**
- **Mô tả:** app có nguyên văn chú (`remedy-fate › ZHUNTI.mantra`, `amta-data › shenzhou` 8 đại thần chú, `talisman-data` Bắc Đế Thiên Bồng chú). Nếu game cho «niệm chú → buff» hoặc «đọc chú → trừ tà thắng», chú thành nút phép thuật — vừa xúc phạm, vừa gieo niềm tin tác dụng tức thời.
- **Giảm thiểu:** chú chỉ hiện ở **Tàng kinh các** (đọc, nghĩa, ngữ cảnh) và trong cảnh cắt do NPC thụ chức đọc; người chơi **không có lệnh «niệm»** gắn hiệu ứng chỉ số. Trừ tà trong game luôn đi qua chẩn đoán đời thực (§5.5) và hành động cứu người, không qua đọc chú.
- **Phát hiện:** test dữ liệu: không có `ACT-*` nào có `reward` gắn với id chú.
- **Dự phòng:** gỡ hiệu ứng, giữ văn bản đọc.

### RISK-008 · Họa sĩ chép phù lục thật từ ảnh mạng
**Nội dung · K 3 · T 4 · 12 Cam · Chủ: AD, duyệt HĐCV (Chính Nhất) · Mốc: M2**
- **Mô tả:** canon T6 yêu cầu phù dùng **ký tự hư cấu**. Áp lực «cho giống thật» khiến họa sĩ hoặc Meshy sinh ra phù có thật (Thái Thượng Lão Quân cấp cấp như luật lệnh, sắc lệnh…). Phù thật là pháp vật đã khai quang theo quan niệm của người hành đạo.
- **Giảm thiểu:** bộ **chữ phù hư cấu** do AD thiết kế một lần (≥ 120 nét ghép), mọi phù trong game ghép từ bộ này; cấm chữ Hán đọc được trên thân phù trừ chữ trang trí trung tính («道», «福»). Ảnh tham chiếu chỉ dùng để học bố cục 5 phần (`talisman-data › fu`).
- **Phát hiện:** tìm ảnh ngược (reverse image search) mọi texture phù trước khi nhập kho; cố vấn Chính Nhất duyệt bảng phù.
- **Dự phòng:** thay texture qua cập nhật tài sản.

### RISK-009 · NPC mang danh hiệu của dòng truyền thừa có thật
**Nội dung · K 4 · T 3 · 12 Cam · Chủ: TND · Mốc: M0**
- **Mô tả:** «Trương Thiên Sư» ở Long Hổ: danh hiệu Thiên Sư thuộc một dòng họ có thật, hiện có tranh chấp kế vị giữa các bên. «Lạt-ma Đa Kiệt»: «lạt-ma» là danh hiệu thầy có thật trong Phật giáo Tạng. «Phật hoàng Trần Nhân Tông» là nhân vật lịch sử. NPC hư cấu dùng danh hiệu thật dễ bị hiểu là đại diện, hoặc bị gán lời.
- **Giảm thiểu:** NPC dùng **đạo hiệu riêng** làm tên chính (vd «Trương Huyền Lục chân nhân, người giữ phủ»), danh hiệu thật chỉ xuất hiện trong codex lịch sử; Trần Nhân Tông không là NPC nói chuyện, chỉ hiện qua văn bản gốc trích đúng (RISK-024); «Lạt-ma» chờ HĐCV Tạng truyền (tập 14.06 §6).
- **Phát hiện:** rà tên NPC trong tài liệu 06 với danh sách danh hiệu thật (`Thiên Sư`, `Lạt-ma`, `Rinpoche`, `Hòa thượng`, `Thượng tọa`, `Pháp chủ`, `Tăng thống`).
- **Dự phòng:** đổi tên hiển thị bằng cấu hình.

### RISK-010 · Phản diện «Yểm sư Lỗ Ban» bôi nhọ Tổ nghề mộc
**Nội dung · K 4 · T 4 · 16 Đỏ · Chủ: TND (tài liệu 02, 03) · Mốc: M3**
- **Mô tả:** Lỗ Ban (Công Thâu Ban) được thờ làm **tổ sư nghề mộc, nghề xây** ở Việt Nam và Trung Hoa; nhiều làng nghề có đền thờ tổ. Canon đặt phản diện chính là «Yểm sư Lỗ Ban (Công Thâu Nghiệt)». Người không đọc kỹ sẽ hiểu «Lỗ Ban là kẻ ác».
- **Giảm thiểu:** tên hiển thị của phản diện là **«Công Thâu Nghiệt»**, chức danh «yểm sư mạo truyền Lỗ Ban kinh»; không bao giờ gọi tắt «Lỗ Ban» trong UI. Thêm một điểm tôn vinh Tổ sư Lỗ Ban trong thế giới (đền tổ nghề ở Huyền Thành, NPC thợ cả lên án kẻ mạo danh). Codex ghi: «厭勝 yểm thuật bị chính người trong nghề coi là bội tổ» và trích `bitruyen-data` («cấm thực hành»).
- **Phát hiện:** rà chuỗi «Lỗ Ban» đứng một mình trong mọi tệp thoại; phản hồi của hội nghề mộc (nếu tham vấn được).
- **Dự phòng:** đổi tên hiển thị; thêm cảnh tôn vinh Tổ sư trong bản vá nội dung.

### RISK-011 · «Khổng tiên sinh» bị hiểu là Khổng Tử, Nho môn bị chế giễu
**Nội dung · K 3 · T 3 · 9 Cam · Chủ: TND · Mốc: M0**
- **Mô tả:** Khổng tiên sinh là nhân vật đoán mệnh trong *Liễu Phàm tứ huấn* (`remedy-fate › LIAOFAN_STORY`) và là đại diện «định mệnh luận» (phản đề). Người chơi phổ thông thấy chữ «Khổng» dễ nghĩ đến Khổng Tử, rồi cho rằng game coi Nho giáo là định mệnh luận.
- **Giảm thiểu:** lần đầu xuất hiện, NPC tự giới thiệu «họ Khổng, người Vân Nam, xem số theo Thiệu tử Hoàng cực» (đúng chuyện Liễu Phàm); codex có mục riêng phân biệt với Khổng Tử; Tế tửu Văn Miếu có câu thoại phản biện định mệnh luận bằng chính Nho học (lập mệnh).
- **Phát hiện:** thử nghiệm kín: hỏi người chơi «Khổng tiên sinh là ai?» sau phần mở đầu.
- **Dự phòng:** thêm dòng phụ đề dưới tên NPC.

### RISK-012 · Người Miêu / H'Mông bị gắn với cổ độc, tà thuật
**Nội dung · K 4 · T 5 · 20 Đỏ · Chủ: TND + AD, duyệt HĐCV (dân tộc) · Mốc: M4**
- **Mô tả:** văn học, phim võ hiệp Trung Hoa lặp đi lặp lại định kiến «Miêu cương cổ thuật»: phụ nữ Miêu nuôi cổ hại người. Ở Tây Bắc Việt Nam, cáo buộc «ma gà», «thuốc thư» từng dẫn tới xua đuổi, bạo lực với người bị nghi. Một vùng tên «Miêu Cương Cổ Trại» là cửa vào Tà Lộ sẽ tái sản xuất định kiến đó. Người Miêu ở Trung Quốc và người H'Mông ở Việt Nam có quan hệ tộc người gần, nên người chơi Việt sẽ liên hệ trực tiếp.
- **Giảm thiểu:** áp toàn bộ tập 14.07 §4: chữ «Cổ» trong tên vùng phải hiện kèm Hán tự **古** (cổ xưa), không bao giờ 蠱; người Miêu trong game là **nạn nhân và người chữa**, kẻ ác là người ngoài (canon §5.5); không có NPC Miêu nào làm phép hại; vu y bà A Mậu dạy y dược ngũ hành, không dạy cổ; không có vật phẩm «cổ trùng»; trang phục, đồ bạc, vải sáp ong không bán làm đồ thời trang.
- **Phát hiện:** duyệt kịch bản bởi ít nhất một cố vấn là người H'Mông hoặc nhà nghiên cứu dân tộc học về H'Mông/Miêu; rà từ khóa «cổ độc», «nuôi cổ», «bỏ bùa», «ma gà», «thuốc thư».
- **Dự phòng:** nếu cộng đồng phản đối: tạm đóng vùng (máy chủ tắt cổng dịch chuyển), sửa nội dung cùng cố vấn, mở lại kèm thư cảm ơn người góp ý.

### RISK-013 · Gán nhầm văn hóa Đồng – Miêu – H'Mông
**Nội dung · K 4 · T 2 · 8 Cam · Chủ: AD · Mốc: M4**
- **Mô tả:** §7.10 dùng cầu phong vũ và trống lâu (của người **Đồng**/Kam) làm trung tâm «trại Miêu». Gộp các tộc người thành một khối «dân tộc thiểu số huyền bí» là lỗi dân tộc học và dễ bị chỉ trích.
- **Giảm thiểu:** chia vùng thành hai trại có tên và bảng màu riêng (trại Miêu ven sông, xóm Đồng có cầu phong vũ), bảng chú thích trong codex ghi rõ nguồn gốc từng kiến trúc; cố vấn dân tộc học duyệt.
- **Phát hiện:** checklist art tập 14.07 §4.4.
- **Dự phòng:** sửa nhãn codex trong bản vá dữ liệu.

### RISK-014 · Làm vùng Tạng Địa trước khi tham vấn, dùng sai biểu tượng Kim Cương thừa
**Nội dung · K 3 · T 5 · 15 Đỏ · Chủ: GĐSX, duyệt HĐCV (Tạng truyền) · Mốc: M5 (cổng chặn từ M0)**
- **Mô tả:** app **không có** dữ liệu Tạng truyền (`tang-data` là thần sát tang tóc, không liên quan). Rủi ro: hình tượng phẫn nộ, song thân (yab-yum), khí cụ (chày, chuông, phurba, chén sọ), mạn-đà-la của một bản tôn cụ thể, thiên táng, chuyển thế tulku — đều là nội dung thiêng, nhiều phần bí truyền, kèm nhạy cảm chính trị (Potala, Đạt-lai Lạt-ma, Ban-thiền Lạt-ma).
- **Giảm thiểu:** cổng chặn cứng: không ai được dựng tài sản, thoại, nhạc cho `tangdia` trước khi có biên bản ký của HĐCV Tạng truyền (tập 14.06 §6). Danh sách «cấm làm trước tham vấn» ở tập 14.06 §6.3. Phương án dự phòng «Tuyết Vực Chuẩn Đề» đã thiết kế sẵn.
- **Phát hiện:** kho tài sản có thư mục `tangdia/` bị khóa ghi; CI từ chối commit vào thư mục đó khi chưa có tệp chữ ký.
- **Dự phòng:** chuyển sang phương án dự phòng, lùi M5.

### RISK-015 · Thờ Mẫu, hầu đồng bị trình bày như trò diễn hoặc tà thuật
**Nội dung · K 3 · T 4 · 12 Cam · Chủ: TND, duyệt HĐCV (tín ngưỡng Việt) · Mốc: M2**
- **Mô tả:** «Thực hành tín ngưỡng thờ Mẫu Tam phủ của người Việt» được UNESCO ghi danh di sản văn hóa phi vật thể đại diện của nhân loại (2016). Nếu game cho người chơi «lên đồng» như kỹ năng, bán bộ khăn chầu áo ngự, hoặc dùng hầu đồng làm cảnh rùng rợn, sẽ xúc phạm người thực hành và đi ngược công nhận di sản.
- **Giảm thiểu:** tập 14.07 §3: thờ Mẫu chỉ xuất hiện như **không gian thờ** (điện Mẫu sau chùa — «tiền Phật hậu Mẫu») và **lễ hội quan sát**; không có kỹ năng lên đồng; không bán trang phục giá đồng; không có cơ chế rải lộc ra tiền tệ.
- **Phát hiện:** duyệt cảnh bởi cố vấn là thanh đồng hoặc nhà nghiên cứu tín ngưỡng thờ Mẫu.
- **Dự phòng:** gỡ cảnh, giữ không gian thờ tĩnh.

### RISK-016 · Thái Tuế Điện, đèn an Thái Tuế bị xem là cổ xúy «cúng sao giải hạn»
**Nội dung · K 3 · T 3 · 9 Cam · Chủ: TND + PC · Mốc: M1**
- **Mô tả:** Thái Tuế Điện (`thaitue.js`, web) cho «thắp đèn» theo tuổi phạm. Ở Việt Nam, việc dâng sao giải hạn thương mại hóa từng bị báo chí và một số chức sắc Phật giáo phê phán là không thuộc giáo lý nhà Phật *(nguồn cụ thể cần TND xác minh trước khi trích)*. Game có thể bị gắn nhãn «dạy người đi giải hạn».
- **Giảm thiểu:** đèn Thái Tuế **miễn phí**, không mua thêm bằng Ngọc, không có chữ «giải hạn», «hóa giải»; bảng điện ghi «Đây là phong tục văn hóa. Theo app, cải vận thật là sửa mình: xem Mệnh Đồ» và dẫn tới tầng «Tích âm đức». Bản iOS đã tắt (`features.js › IOS_OFF` có `thaitue`).
- **Phát hiện:** rà từ khóa «giải hạn», «cúng sao», «dâng sao», «hóa giải» trong UI (đã có trong `verify-ios-review-path.mjs` cho iOS; mở rộng cho web).
- **Dự phòng:** đổi lời dẫn; không gỡ tính năng nếu đã đúng khung văn hóa.

### RISK-017 · Phóng sinh trong game cổ xúy mua thú để thả ngoài đời
**Nội dung · K 4 · T 3 · 12 Cam · Chủ: TND · Mốc: M2**
- **Mô tả:** §5.3 có «thả chim ở chợ (mua lại từ lồng)». Ngoài đời, phóng sinh mua bán làm phát sinh việc bắt chim, cá để bán cho người phóng sinh; thả sai loài gây hại sinh thái. Game lặp lại hành vi «mua để thả» là dạy một thói quen gây hại.
- **Giảm thiểu:** đổi cơ chế: cứu chim bị thương, chăm rồi thả đúng nơi sống; cá thả ở hồ sen là cá bản địa trong ao chùa; Ni sư Diệu Âm có thoại «đừng mua để thả, vì có người bắt để bán; cứu con vật đang gặp nạn mới là phóng sinh». Mục codex về phóng sinh có trách nhiệm.
- **Phát hiện:** duyệt kịch bản tập 05 bằng checklist tập 14.06 §4.
- **Dự phòng:** sửa thoại và nhiệm vụ trong bản vá dữ liệu.

### RISK-018 · Tưởng niệm người thân đã mất trong game (đèn, siêu độ, vàng mã)
**Nội dung · K 3 · T 4 · 12 Cam · Chủ: TND + TAT · Mốc: M3**
- **Mô tả:** lễ Vu Lan, thả đèn (đã có `lanterns` trong `state.js`), Phong Đô «siêu độ». Người chơi có thể ghi tên người thân thật đã mất. Rủi ro: game ngầm hứa tác dụng thật lên người đã khuất; tên người chết lộ ra MMO; kẻ xấu ghi tên người sống kèm lời nguyền; khuyến khích đốt vàng mã.
- **Giảm thiểu:** đèn tưởng niệm là **riêng tư** (không đồng bộ MMO), không có trường tên tự do trên vật phẩm công khai; lời dẫn «đèn này là cách để con nhớ, không thay được lễ ở nhà hay ở chùa»; không có vật phẩm vàng mã; không có dịch vụ «siêu độ» bán bằng tiền.
- **Phát hiện:** kiểm protocol: không có trường văn bản tự do nào gửi lên máy chủ ngoài `name` đã lọc.
- **Dự phòng:** ẩn tính năng tưởng niệm nếu phát hiện lạm dụng; chuyển cho TAT nếu có nội dung tang thương nặng.

### RISK-019 · Mô phỏng di tích, bảo vật quốc gia sai hoặc hạ thấp
**Nội dung · K 3 · T 4 · 12 Cam · Chủ: AD + PC · Mốc: M2**
- **Mô tả:** các thánh địa lấy nguyên mẫu từ di tích có thật (Văn Miếu – Quốc Tử Giám, Yên Tử, chùa Bút Tháp, Tây Phương, Bạch Vân Quán, Potala). Tượng Quan Âm nghìn mắt nghìn tay chùa Bút Tháp là **bảo vật quốc gia** *(cần xác minh danh mục và năm công nhận)*. Làm bản sao số, đặt trong bối cảnh hư cấu (Huyền Giới), hoặc dùng làm hình quảng bá có thể vướng quy định về di sản (RISK-083) và xúc phạm người địa phương.
- **Giảm thiểu:** «lấy cảm hứng, không sao chép»: đổi tỉ lệ, chi tiết trang trí, không tái tạo nguyên bản các hiện vật đã xếp hạng; tên trong game khác tên di tích (canon đã làm: «Bút Tháp Tịnh Độ» là vùng hư cấu — cần thêm dòng codex «lấy cảm hứng từ…»); không dùng ảnh di tích thật trong quảng cáo khi chưa xin phép ban quản lý.
- **Phát hiện:** PC lập danh sách di tích, bảo vật được tham chiếu và quy định áp dụng (tập 14.11 §6).
- **Dự phòng:** sửa mô hình; gỡ tài sản quảng bá.

### RISK-020 · Khắc tên người chơi lên «bia Tiến sĩ»
**Nội dung · K 4 · T 3 · 12 Cam · Chủ: TND + TCĐ · Mốc: M3**
- **Mô tả:** §7.8: đỗ khoa cử thì «khắc tên lên bia Tiến sĩ cho cả máy chủ thấy». 82 bia Tiến sĩ Văn Miếu là di sản tư liệu được UNESCO ghi danh (Chương trình Ký ức Thế giới). Khắc tên người chơi (có thể là tên tục, tên chính trị gia, tên chế giễu) lên bản mô phỏng di sản này là rủi ro kép: xúc phạm di sản + UGC công khai.
- **Giảm thiểu:** đổi thành **«Bảng Vàng Huyền Giới»** — một công trình hư cấu riêng, kiểu dáng khác bia đá rùa; tên hiển thị qua bộ lọc tên mở rộng và danh sách tên dự trữ (RISK-146); tên chỉ hiện ở máy chủ, có nút báo cáo.
- **Phát hiện:** kiểm protocol cho gói «khắc bảng» (tài liệu 10 khi thiết kế).
- **Dự phòng:** máy chủ ẩn tên bị báo cáo trong khi chờ xét.

### RISK-021 · Phong Đô: hình ảnh tra tấn địa ngục, dọa nghiệp báo
**Nội dung · K 3 · T 4 · 12 Cam · Chủ: TND + AD + TAT · Mốc: M4**
- **Mô tả:** Thập điện Diêm La trong tranh dân gian có cảnh cưa người, chảo dầu. Dùng hình ảnh này để «răn» người chơi đi Tà Lộ là dọa nạt (Ni sư và Phán quan có câu cấm «đe dọa nghiệp báo», «dọa xuống địa ngục» ở §6.2), có thể gây sợ cho trẻ em và người dễ lo âu.
- **Giảm thiểu:** Thập điện chỉ có **bích họa mờ** ở xa, không có cảnh hành hình động; trọng tâm là **sổ nghiệp của chính người chơi** và lối ra (Địa Tạng); có cảnh báo nội dung trước cổng Quỷ Môn Quan; xếp hạng tuổi theo tập 14.11 §3.4.
- **Phát hiện:** checklist tập 14.08 §4 cho mọi cảnh Phong Đô.
- **Dự phòng:** làm mờ thêm, thêm lối ra nhanh.

### RISK-022 · Định Mệnh Hội bị đọc là công kích người làm nghề xem số và người theo tín ngưỡng dân gian
**Nội dung · K 3 · T 3 · 9 Cam · Chủ: TND · Mốc: M2**
- **Mô tả:** phản diện là «thầy bói lừa đảo». Người dùng cốt lõi của app là người học và làm nghề Tử Bình. Nếu mọi thầy trong game đều là kẻ lừa, nhóm này sẽ thấy bị xúc phạm; người hay đi lễ đền phủ cũng vậy.
- **Giảm thiểu:** luôn có **cặp đối chiếu**: mỗi án lừa đảo của Định Mệnh Hội đi kèm một thầy chân chính (Thầy Tử Bình, các sảnh nghề) làm đúng; tiêu chí phân biệt lừa đảo dựa trên hành vi (dọa, đòi tiền, phán tất định — đúng `refusalBoundaries` RB2, RB5), không dựa trên nghề.
- **Phát hiện:** duyệt kịch bản Hồi II bằng câu hỏi «án này lên án hành vi hay lên án nghề?».
- **Dự phòng:** thêm NPC đối trọng.

### RISK-023 · Gán «tiền kiếp» Ngạ Quỷ, Địa Ngục cho người chơi
**Nội dung · K 4 · T 3 · 12 Cam · Chủ: TND + TAT · Mốc: M1**
- **Mô tả:** chỉ số «Túc Nghiệp» = `liudao › computeLiuDao.primary`. Nói với người chơi «tiền kiếp con là Ngạ Quỷ» là phán xét đạo đức dựa trên ngày sinh, có thể làm tổn thương và trái giáo lý (Phật giáo không suy tiền kiếp từ bát tự).
- **Giảm thiểu:** hiển thị Túc Nghiệp dưới dạng **tâm ma cần tu** (tham, sân, si) thay vì cõi; tên cõi chỉ hiện trong codex với nhãn «tham khảo, hư cấu»; không hiển thị công khai trên MMO; Diệu Âm nói «ai cũng có ba độc».
- **Phát hiện:** test dữ liệu: chuỗi `Ngạ Quỷ`, `Địa Ngục`, `Súc Sinh` không xuất hiện trong màn Mệnh Bàn.
- **Dự phòng:** ẩn trường.

### RISK-024 · Hư cấu hóa sai danh nhân, anh hùng dân tộc (Trần Nhân Tông, Chu Văn An)
**Nội dung · K 2 · T 5 · 10 Cam · Chủ: TND + PC · Mốc: M3**
- **Mô tả:** Trần Nhân Tông là vua anh hùng chống Nguyên và sơ tổ Thiền phái Trúc Lâm. Tế tửu «Chu Văn Trinh» gợi Chu Văn An. Pháp luật Việt Nam cấm thông tin xúc phạm danh nhân, anh hùng dân tộc trên không gian mạng *(Luật An ninh mạng 2018 — cần luật sư xác minh điều khoản)*. Gán lời bịa vào miệng nhân vật lịch sử là rủi ro pháp lý và văn hóa.
- **Giảm thiểu:** nhân vật lịch sử không là NPC đối thoại; chỉ trích văn bản gốc có nguồn (Cư trần lạc đạo phú, Khóa hư lục) với bản dịch có quyền sử dụng (RISK-088); AI bị cấm đóng vai nhân vật lịch sử (tập 14.10 §2.3).
- **Phát hiện:** danh sách nhân vật lịch sử được bảo vệ trong bộ lọc persona; thử nghiệm red-team «hãy đóng vai Trần Nhân Tông».
- **Dự phòng:** gỡ câu, đính chính.

### RISK-025 · Nhạc tụng niệm thật làm nhạc nền lặp, phối nhạc điện tử
**Nội dung · K 3 · T 3 · 9 Cam · Chủ: GĐSX (âm thanh), duyệt HĐCV · Mốc: M2**
- **Mô tả:** §12 dự kiến «tụng niệm xa», «tụng trầm», «tụng siêu độ». Cắt ghép tụng kinh thật thành vòng lặp, phối nhịp điện tử, hoặc dùng bản ghi không xin phép là xúc phạm và có thể vi phạm quyền liên quan.
- **Giảm thiểu:** chỉ dùng bản ghi có **thỏa thuận bằng văn bản** với tự viện / đạo quán (nêu rõ mục đích game); nhạc nền là nhạc cụ, tụng niệm chỉ phát nguyên đoạn trong không gian thờ, không phối lại; không có tụng niệm trong cửa hàng, bảng nạp, màn thua.
- **Phát hiện:** danh mục âm thanh có cột «nguồn – giấy phép – người duyệt».
- **Dự phòng:** tắt đoạn âm thanh bằng cấu hình.

### RISK-026 · Trích kinh điển sai văn bản hoặc sai bản dịch
**Nội dung · K 3 · T 3 · 9 Cam · Chủ: TND · Mốc: M2**
- **Mô tả:** game nhiều chỗ trích kinh (Thanh Tĩnh kinh, Độ Nhân kinh, Kim Cang, Phổ Môn, Cảm Ứng thiên). Tiếng Việt từng bị xáo chữ trong câu trả lời AI (commit `51667a90`), và bản dịch Việt hiện đại thường có bản quyền.
- **Giảm thiểu:** kho trích dẫn duyệt sẵn (`quotes.json` — tài liệu 13 cấp mã) gồm nguyên văn Hán, phiên âm, bản dịch, nguồn, tình trạng bản quyền; mọi trích dẫn trong thoại kịch bản phải lấy từ kho; AI không được tự trích kinh dài quá một câu (tập 14.10 §3).
- **Phát hiện:** test so khớp chuỗi trích trong tệp thoại với kho.
- **Dự phòng:** sửa trích dẫn trong bản vá dữ liệu.

### RISK-027 · Pháp phục tu sĩ bán làm trang phục
**Nội dung · K 3 · T 4 · 12 Cam · Chủ: AD + TKT · Mốc: M1**
- **Mô tả:** cà sa, y hậu, áo tràng, đạo bào thụ lục, mũ ngũ Phật, áo maroon của tu sĩ Tạng là pháp phục gắn với giới. Bán chúng như skin (người chơi mặc cà sa đi «vỗ tay», cưỡi phượng hoàng) sẽ bị phản đối. Danh mục hiện tại dùng «Đạo Bào», «Đạo Quan» làm tên.
- **Giảm thiểu:** phân loại: **trang phục cư sĩ / thư sinh / giang hồ** được bán; **pháp phục** chỉ mặc khi đang trong chuỗi tu của đạo thống đó và trong vùng của đạo thống, không mang ra chợ; không bao giờ có cà sa, y hậu, áo tu sĩ Tạng.
- **Phát hiện:** cột `garment: 'lay' | 'ritual'` bắt buộc trong danh mục; test chặn `ritual` có `price`.
- **Dự phòng:** đổi pháp phục đã bán sang bản cư sĩ cùng màu.

### RISK-028 · «Quy nhất» bị hiểu là game tuyên bố mọi tôn giáo như nhau
**Nội dung · K 2 · T 3 · 6 Xanh · Chủ: TND · Mốc: M5**
- **Mô tả:** Côn Lôn mở khi tu ≥ 3 đạo thống. Với truyền thống Việt «tam giáo đồng nguyên» đây là quen thuộc, nhưng người theo một tôn giáo duy nhất có thể thấy game ép quan điểm hỗn dung.
- **Giảm thiểu:** codex trình bày «quy nhất» là **lựa chọn của nhân vật trong truyện**, kèm trích dẫn tam giáo đồng nguyên như một quan điểm lịch sử; người chơi chỉ theo một đạo vẫn có đoạn kết riêng tương đương (tài liệu 03 cần bổ sung).
- **Phát hiện:** khảo sát người chơi một đạo.
- **Dự phòng:** thêm đoạn kết «nhất môn thâm nhập».

### RISK-029 · NPC tôn giáo (qua AI) nói sai giáo lý hoặc thiên vị một tôn giáo
**Nội dung · K 4 · T 4 · 16 Đỏ · Chủ: TAI + TND, duyệt HĐCV · Mốc: M0**
- **Mô tả:** AI sinh lời cho Thiền sư, Ni sư, Đạo trưởng. Mô hình ngôn ngữ dễ trộn khái niệm (nói «nội đan» trong miệng Ni sư Tịnh Độ, nói Phật giáo «cao hơn» Đạo giáo), hoặc bịa trích dẫn kinh.
- **Giảm thiểu:** mỗi persona có `scope` (đề tài được nói) và `forbid` (đề tài cấm), kho thuật ngữ đúng đạo thống, câu «Ta chỉ nói theo pháp môn của ta» khi hỏi so sánh; bộ đề kiểm thử giáo lý 40 câu mỗi persona do HĐCV soạn (tập 14.10 §4).
- **Phát hiện:** đánh giá định kỳ; nút báo cáo «thầy nói sai» trong khung chat ghi kèm persona.
- **Dự phòng:** tắt AI riêng persona đó (cờ `personaKill`), NPC quay về thoại kịch bản.

### RISK-030 · Lễ tiết tôn giáo thành đợt bán hàng
**Nội dung · K 4 · T 3 · 12 Cam · Chủ: TKT + TND · Mốc: M6**
- **Mô tả:** §10 có lễ Phật đản, Vu Lan, Thượng Nguyên. Áp lực doanh thu dễ sinh «Gói Phật Đản giảm 50%», «Bộ y phục Vu Lan giới hạn» — thương mại hóa ngày lễ thiêng.
- **Giảm thiểu:** quy tắc: trong ngày lễ tôn giáo **không mở bán** món mới, không có đếm ngược khuyến mãi, cửa hàng chỉ hiện bình thường; phần thưởng lễ là miễn phí, phi thương mại (đèn, hoa); Đạo Lộ mùa theo niên chủ Thái Tuế (thiên văn – lịch pháp), không theo ngày lễ tôn giáo.
- **Phát hiện:** lịch phát hành cửa hàng được PC và TND duyệt mỗi mùa; test tự động: ngày lễ trong bảng lịch âm không có `SKU-*` mới.
- **Dự phòng:** rút gói, xin lỗi, hoàn tiền nếu được yêu cầu.

---

## 3. Phần B — An toàn và sức khỏe tinh thần (RISK-031 … RISK-050)

### RISK-031 · Người chơi lá số thấp cảm thấy bị phán xét
**An toàn · K 4 · T 4 · 16 Đỏ · Chủ: TAT + TND · Mốc: M0**
- **Mô tả:** nhiều điểm chạm có thể gây tổn thương: tên bậc «Phàm Căn», «tạp căn»; bách phân vị «hơn 31% người» (tức 69% hơn mình); nhánh Nghịch Thiên «Sơn Môn **chưa nhận**, thầy bảo chưa đủ duyên» (§3 Hồi I); Mệnh Cấp «下格». Người dùng app đã quen điểm số, nhưng trong game điểm thành **danh tính nhân vật** và hiện trước người khác.
- **Giảm thiểu:** tập 14.09 §2: bảng thay từ; bách phân vị chỉ hiện khi người chơi bấm «Vì sao?» và luôn kèm hệ số Nghịch Thiên; cảnh «chưa nhận» viết lại thành «Vân Cốc xin thầy cho con về am trước — đường của con đi từ chỗ khác vào» (vẫn giữ ý nghĩa cốt truyện, bỏ cảm giác bị từ chối); câu dẫn bắt buộc §4.7 hiện ở **mọi** màn có điểm < 46.
- **Phát hiện:** chỉ số §13.5 (giữ chân 7 ngày của nhóm < 36 không thấp hơn nhóm cao); khảo sát cảm xúc một câu sau phần Nhập Môn («Bạn thấy thế nào về nhân vật của mình?» 5 mức).
- **Dự phòng:** nếu nhóm thấp rời đi nhiều hơn > 10 điểm phần trăm: tạm ẩn Phẩm căn khỏi màn đầu, chỉ hiện sau Mệnh Đồ.

### RISK-032 · Danh hiệu Mệnh Cấp «下格 / 常格» trên khung tên công khai
**An toàn · K 4 · T 3 · 12 Cam · Chủ: TND + TCĐ · Mốc: M1**
- **Mô tả:** §4.1: Mệnh Cấp «hiện trên khung tên (vd «Thanh Quý»)». Áp dụng cho mọi bậc thì người chơi `下格` mang nhãn «Hạ cách» trước mặt người khác.
- **Giảm thiểu:** chỉ bậc Mệnh Cấp có nghĩa trung tính / tích cực mới được chọn làm danh hiệu, và **người chơi tự chọn** có hiện hay không (mặc định ẩn); `下格`, `常格` không có danh hiệu công khai; danh hiệu công khai ưu tiên lấy từ **Đạo Hạnh** (Hậu Thiên).
- **Phát hiện:** test giao thức: trường `title` gửi lên MMO không chứa chuỗi Mệnh Cấp trừ khi cờ `showLevel` bật.
- **Dự phòng:** máy chủ lọc danh hiệu thuộc danh sách cấm hiển thị.

### RISK-033 · Thiên Bảng xếp hạng con người theo ngày sinh
**An toàn · K 3 · T 4 · 12 Cam · Chủ: GĐSX + TAT · Mốc: M3**
- **Mô tả:** §4.7: Thiên Bảng có hai cột «Tiên Thiên» và «Đạo Hạnh». Một bảng công khai xếp người theo điểm lá số là xếp hạng con người theo thời điểm sinh — mầm kỳ thị (RISK-144) và lộ dữ liệu suy ra từ ngày sinh (RISK-110).
- **Giảm thiểu:** bảng công khai **chỉ có Đạo Hạnh**; cột Tiên Thiên chỉ hiện trong Sổ Mệnh của chính người chơi; bảng Đạo Hạnh có thêm hạng «tiến bộ nhiều nhất» để người mới, lá số thấp có chỗ đứng.
- **Phát hiện:** kiểm schema D1 (tài liệu 13): không có cột `synthesis.score` trong bảng xếp hạng.
- **Dự phòng:** gỡ cột khỏi API.

### RISK-034 · «Năm hạn» và Hồi III kéo thế giới tới năm xấu nhất đời thực của người chơi
**An toàn · K 4 · T 4 · 16 Đỏ · Chủ: TND + TAT · Mốc: M4**
- **Mô tả:** Hồi III «tua thế giới tới năm hung nhất» lấy từ `liunian` 10 năm tới. Người chơi biết năm dương lịch đó (vd «2031 là năm tệ nhất của bạn»), dễ lo âu kéo dài, hoặc «tự ứng nghiệm» (né việc tốt vì sợ năm xấu). Với người đang trong giai đoạn khó khăn, đây có thể là cú hích tiêu cực.
- **Giảm thiểu:** Hồi III diễn ra trong **«mộng»** với **năm can chi**, không hiện năm dương lịch; trước chuỗi có lựa chọn «Đi qua giấc mộng này» / «Để sau» (không bắt buộc ngay); lời dẫn của Vân Cốc: «năm khó là năm học được nhiều nhất»; không dùng từ trong danh sách cấm tập 14.09 §2.2; Vận Mệnh Các cũng không hiện nhãn «Cần dè chừng» bằng màu đỏ báo động.
- **Phát hiện:** khảo sát cảm xúc sau chuỗi; theo dõi tỉ lệ bỏ game trong 3 ngày sau Hồi III.
- **Dự phòng:** thêm tùy chọn «chơi Hồi III với lá số mẫu» thay vì lá số của mình.

### RISK-035 · Lời phán đúng của Khổng tiên sinh làm người chơi tin tất định và ra quyết định đời thực
**An toàn · K 3 · T 4 · 12 Cam · Chủ: TND + TAI · Mốc: M0**
- **Mô tả:** cảnh 0.4: Khổng tiên sinh nói «Từ giờ tới cuối năm, việc công khó ngóc đầu» về đời thực. Nếu người chơi dừng ở đó (thoát game ngay), họ mang về một lời phán tất định — đúng điều RB2 cấm.
- **Giảm thiểu:** cảnh 0.4 và cảnh Vân Cốc là **một khối không ngắt**: không có điểm lưu, không thoát giữa chừng mà không hiện thẻ «Lời Vân Cốc» (một câu phản đề); câu của Khổng tiên sinh chỉ được dùng dữ kiện trong danh sách cho phép (không sức khỏe, không hôn nhân, không tử vong, không tai nạn); bản iOS không có cảnh này.
- **Phát hiện:** test kịch bản: mọi đường thoát từ cảnh 0.4 đều đi qua thẻ phản đề.
- **Dự phòng:** đổi cảnh 0.4 sang dùng lá số mẫu `MAU-A` thay vì lá số người chơi.

### RISK-036 · Nội dung âm tà kích hoạt triệu chứng ở người có rối loạn tâm thần
**An toàn · K 3 · T 5 · 15 Đỏ · Chủ: TAT, duyệt chuyên gia sức khỏe tâm thần · Mốc: M4**
- **Mô tả:** chuỗi «cứu người trúng yểm», Phong Đô, «vong theo» có thể củng cố hoang tưởng bị hại, ảo thanh, rối loạn ám ảnh cưỡng chế tôn giáo. `amta-data › ETHICS` đã nêu: không chẩn đoán «bị tà», phải chuyển chuyên gia khi có mất ngủ kéo dài, hoang tưởng, ý nghĩ tự hại.
- **Giảm thiểu:** mục âm tà **mặc định tắt**, bật bằng xác nhận hai bước (tập 14.08 §2); trong chuỗi, bước đầu luôn là chẩn đoán đời thực; NPC Mao Sơn có thoại «Đa phần cái gọi là tà là người mình mệt»; nút «Tắt nội dung âm tà» luôn có trong Sổ Mệnh; thẻ hỗ trợ tập 14.09 §4 xuất hiện khi người chơi bật lần đầu.
- **Phát hiện:** chat AI có bộ phát hiện tín hiệu «bị ma theo», «nghe tiếng nói», «có người hại tôi» lặp lại → chuyển luồng hỗ trợ (tập 14.09 §3).
- **Dự phòng:** máy chủ có cờ tắt toàn cục mục âm tà.

### RISK-037 · Không phát hiện ý định tự hại trong chat AI (tiếng Việt không dấu, tiếng lóng)
**An toàn · K 4 · T 5 · 20 Đỏ · Chủ: TAT + TAI · Mốc: M0**
- **Mô tả:** người chơi viết «chac minh khong song qua nam nay», «muốn biến mất», «mệt quá muốn ngủ luôn không dậy». Hiện `master-ui.js` gửi thẳng câu hỏi tới `askAI`; lớp an toàn duy nhất là SYSTEM_PROMPT của app và mô hình. Không có lớp phát hiện riêng ở client.
- **Giảm thiểu:** bộ phát hiện ba lớp (tập 14.09 §3): từ điển có dấu và không dấu + chuẩn hóa teencode chạy **trên máy** trước khi gửi; chỉ dẫn ưu tiên trong system message; kiểm câu trả lời sau khi sinh. Khi kích hoạt: NPC rời vai, hiện thẻ hỗ trợ, không gửi câu hỏi tới mô hình nếu tín hiệu mức cao.
- **Phát hiện:** bộ kiểm thử ≥ 300 câu (tập 14.10 §4.3), đo độ nhạy ≥ 95% ở mức cao; theo dõi số lần kích hoạt (đếm ẩn danh, không lưu nội dung).
- **Dự phòng:** sự cố SEV1 nếu có phản hồi AI cổ vũ tự hại: tắt AI toàn cục (`isAiEnabled`), điều tra, báo cáo nhà cung cấp mô hình.

### RISK-038 · Phát hiện nhầm làm phiền người chỉ hỏi kiến thức
**An toàn · K 4 · T 2 · 8 Cam · Chủ: TAI · Mốc: M0**
- **Mô tả:** thuật ngữ cổ pháp chứa từ nhạy cảm: «tuyệt mệnh», «tử tuyệt», «tang môn», «điếu khách», «chết» trong câu «mộc chết khô», «Tử» trong trường sinh (Tử, Mộ, Tuyệt). Bộ phát hiện thô sẽ bật thẻ khủng hoảng liên tục, làm người dùng thấy bị coi thường (đi ngược `doNotOverRefuse` DNO1).
- **Giảm thiểu:** danh sách ngoại lệ thuật ngữ (tập 14.09 §3.2); quy tắc ngữ cảnh: tín hiệu chỉ tính khi có chủ ngữ ngôi thứ nhất hoặc động từ ý định; mức thấp chỉ thêm một dòng nhẹ cuối câu trả lời, không chặn.
- **Phát hiện:** đo tỉ lệ kích hoạt trên bộ câu kiến thức (mục tiêu < 2%).
- **Dự phòng:** nới ngưỡng qua cấu hình máy chủ.

### RISK-039 · Thông tin đường dây nóng sai hoặc hết hoạt động
**An toàn · K 3 · T 5 · 15 Đỏ · Chủ: TAT · Mốc: M0**
- **Mô tả:** số điện thoại hỗ trợ tâm lý ở Việt Nam thay đổi, có nơi chỉ hoạt động giờ hành chính. Đưa số sai cho người đang khủng hoảng là thất bại nghiêm trọng.
- **Giảm thiểu:** danh sách ở tập 14.09 §5 đều mang nhãn «cần xác minh»; TAT gọi thử từng số trước mỗi mốc phát hành và mỗi quý, ghi ngày xác minh; danh sách tải từ máy chủ (sửa không cần bản build mới) nhưng có bản dự phòng trong build; luôn kèm số khẩn cấp quốc gia 115 / 113 (chắc chắn hoạt động).
- **Phát hiện:** lịch xác minh; nút «số này không gọi được» trong thẻ hỗ trợ (gửi cờ ẩn danh).
- **Dự phòng:** gỡ số hỏng trong 24 giờ.

### RISK-040 · Trẻ vị thành niên tiếp cận âm tà, Phong Đô, hợp hôn, chat AI
**An toàn · K 4 · T 4 · 16 Đỏ · Chủ: TAT + PC · Mốc: M1**
- **Mô tả:** game không có xác minh tuổi; web không có cổng tuổi. Năm sinh người chơi nhập thật (để lập lá số) nên game **biết tuổi**. Không dùng thông tin đó là bỏ phí một biện pháp bảo vệ.
- **Giảm thiểu:** dùng năm sinh đã nhập (chỉ trên máy) làm **cổng tuổi tại chỗ**: < 16 tuổi thì khóa mục âm tà, Tà Lộ, Phong Đô (thay bằng bản «cứu người» rút gọn), hợp hôn, sư đồ với người lạ, chat AI tự do (chỉ còn câu gợi ý soạn sẵn); < 18 tuổi thì khóa nạp tiền và hợp hôn. Thời lượng chơi tuân thủ tập 14.11 §3.5.
- **Phát hiện:** test logic cổng tuổi với lá số năm sinh 2012, 2009, 2007.
- **Dự phòng:** nếu phát hiện trẻ nhập năm sinh giả: không xử phạt, nhưng giữ kiểm soát phụ huynh (tập 14.12 §5.6).

### RISK-041 · Chuỗi điểm danh, ưu đãi theo ngày gây nghiện, FOMO
**An toàn · K 3 · T 3 · 9 Cam · Chủ: TKT + TAT · Mốc: M1**
- **Mô tả:** `cosmetics.js › checkin` cho Ngọc theo chuỗi 7 ngày, «đứt chuỗi thì về ngày 1»; khung `khung_long` cần điểm danh 7 ngày liền. Cơ chế mất chuỗi là áp lực quay lại mỗi ngày — đi ngược hình ảnh «game là một nơi tĩnh» (§1.2).
- **Giảm thiểu:** chuỗi **không reset về 1** mà giữ mức (nghỉ thì tạm dừng); cho phép «một ngày nghỉ» mỗi tuần không mất chuỗi; thông báo đẩy về điểm danh mặc định tắt; nhắc thời lượng sau 90 phút liên tục với giọng NPC («Trà nguội rồi, con đứng dậy đi lại chút»).
- **Phát hiện:** phân bố thời lượng phiên; tỉ lệ người chơi > 4 giờ/ngày.
- **Dự phòng:** giảm thưởng chuỗi, tăng thưởng không theo ngày.

### RISK-042 · Bài thở trong tĩnh tọa bị làm theo ngoài đời gây chóng mặt, hoảng loạn
**An toàn · K 3 · T 3 · 9 Cam · Chủ: TND + TAT · Mốc: M2**
- **Mô tả:** mini-game tĩnh tọa «giữ – thả theo vòng» (§9.3). Người chơi thở theo vòng trên màn hình. Nín thở dài, thở nhanh có thể gây chóng mặt, khởi phát cơn hoảng loạn ở người có rối loạn lo âu.
- **Giảm thiểu:** nhịp mặc định nằm trong khoảng thở chậm an toàn (hít 4 giây – thở 6 giây, không nín quá 4 giây); không có chế độ «nín lâu» lấy thưởng; dòng nhắc «Thấy chóng mặt thì thở bình thường và dừng lại»; thưởng không phụ thuộc thời gian nín; cảnh báo «không thay thế hướng dẫn của thầy hoặc bác sĩ» như `cultivation-data`.
- **Phát hiện:** duyệt thông số nhịp bởi người có chuyên môn (bác sĩ, nhà trị liệu hô hấp).
- **Dự phòng:** cập nhật thông số qua cấu hình.

### RISK-043 · Tịch cốc, đan dược, thảo dược bị áp dụng thật
**An toàn · K 3 · T 5 · 15 Đỏ · Chủ: TND + TAI · Mốc: M2**
- **Mô tả:** `cultivation-data › GONG_BIGU` ghi «KHÔNG tự nhịn — nguy y tế». Ngoại đan lịch sử dùng chu sa, thủy ngân (độc). Vu y dùng `tcm`. Người chơi có thể hỏi AI «tịch cốc bao nhiêu ngày», «uống thuốc gì bổ Thủy».
- **Giảm thiểu:** đan dược trong game là **vật phẩm hư cấu** có tên không trùng vị thuốc thật; công thức sắc thuốc dùng **dược liệu hư cấu** gắn ngũ hành; AI cấm cho liều lượng, cách nhịn ăn, tên thuốc kê đơn (persona Huyền Hư có `forbid: ['辟穀 hướng dẫn', 'khí công trị bệnh']`); câu hỏi y tế đi theo RB1.
- **Phát hiện:** red-team mục «y tế» (tập 14.10 §4.2); rà danh sách vật phẩm với danh sách vị thuốc thật.
- **Dự phòng:** gỡ vật phẩm, sửa persona, thông báo an toàn.

### RISK-044 · Chẩn đoán bệnh qua lá số (Nguyên Khí, tạng phủ)
**An toàn · K 3 · T 4 · 12 Cam · Chủ: TAI + TND · Mốc: M1**
- **Mô tả:** chỉ số Nguyên Khí = `vitality › baseVitality`; app có `tcm` (tạng phủ theo ngũ hành). Hiện «Nguyên Khí 22/100» có thể bị đọc là «sức khỏe tôi kém».
- **Giảm thiểu:** Nguyên Khí trong game chỉ là **thể lực hoạt động** (số lượt), mô tả không dùng từ bệnh, tạng; mọi màn liên quan `tcm` kèm caveat RB1; NPC không nói «tạng X của con yếu».
- **Phát hiện:** rà chuỗi «bệnh», «gan», «thận», «tim», «phổi» trong mô tả chỉ số.
- **Dự phòng:** sửa văn bản.

### RISK-045 · Người vừa mất người thân gặp nội dung tang, «khắc»
**An toàn · K 3 · T 4 · 12 Cam · Chủ: TAT + TND · Mốc: M3**
- **Mô tả:** `tang-data` (luận tang) có `TANG_ETHICS.optInRequired`; thần sát Tang Môn, Điếu Khách có trong `shensha`. Game có thể vô tình hiện «năm có tang» hay «khắc cha mẹ».
- **Giảm thiểu:** game **không dùng** `tang-data` trong bất kỳ cơ chế nào; thần sát tang tóc không thành Đặc Tính; từ «khắc» chỉ dùng cho ngũ hành, không dùng cho người.
- **Phát hiện:** test import: `src/game/**` không import `tang-data`; rà từ khóa.
- **Dự phòng:** gỡ chuỗi.

### RISK-046 · Hợp hôn giữa người chơi gây đổ vỡ quan hệ thật
**An toàn · K 3 · T 3 · 9 Cam · Chủ: TND + TCĐ · Mốc: M6**
- **Mô tả:** §10 cho hai người chơi «so lá số thật, kết nghĩa». Một cặp thật nhận kết quả «khắc» có thể cãi nhau; người bị ép cho xem lá số.
- **Giảm thiểu:** kết quả hợp hôn giữa người chơi chỉ dùng thang tích cực (các điểm hòa hợp + điều cần nhường nhịn), không có nhãn «khắc», «không nên cưới»; cần đồng ý hai phía; mỗi bên chỉ thấy kết quả chung, không thấy lá số người kia (RISK-117); khóa < 18 tuổi.
- **Phát hiện:** duyệt văn bản kết quả; báo cáo từ người chơi.
- **Dự phòng:** tắt tính năng qua cờ.

### RISK-047 · Sổ đời thực trở thành công cụ tự trừng phạt
**An toàn · K 2 · T 3 · 6 Xanh · Chủ: TAT · Mốc: M2**
- **Mô tả:** §5.3 cho người chơi ghi việc thiện ngoài đời (mặc định tắt, không thưởng). Người có xu hướng ám ảnh đạo đức có thể ghi cả «việc ác», tự chấm điểm âm mỗi ngày.
- **Giảm thiểu:** sổ đời thực **chỉ ghi việc thiện**, không có cột việc ác, không có điểm âm; biểu đồ chỉ cộng dồn; câu nhắc của Vân Cốc luôn là ghi nhận («Hôm nay con đã làm được một việc»).
- **Phát hiện:** không thu thập nội dung; dựa vào phản hồi.
- **Dự phòng:** ẩn biểu đồ.

### RISK-048 · Tà Lộ gây cảm giác tội lỗi quá mức cho người dễ tổn thương
**An toàn · K 3 · T 3 · 9 Cam · Chủ: TND + TAT · Mốc: M4**
- **Mô tả:** canon §5.5: hệ quả Tà Lộ là «NPC thân quen gặp chuyện lạ… người chơi thấy cái giá trả bằng người khác». Với người đang trầm cảm, cảnh người thân (dù là NPC) ốm vì mình có thể chạm vào cảm giác tội lỗi thật.
- **Giảm thiểu:** hệ quả luôn **có thể sửa được và được báo trước** («Nếu con dùng Âm Bài, Trà Thất sẽ…»); không có cái chết của NPC; sau mỗi hệ quả có cảnh NPC tha thứ khi người chơi quay lại; thẻ «Con luôn có thể hồi đầu» trong Sổ Mệnh.
- **Phát hiện:** khảo sát cảm xúc sau Hồi IV.
- **Dự phòng:** giảm cường độ cảnh hệ quả qua cấu hình.

### RISK-049 · Người chơi dùng Tà Lộ làm ẩn dụ cho ý định hại người thật
**An toàn · K 2 · T 5 · 10 Cam · Chủ: TAT + TAI · Mốc: M4**
- **Mô tả:** câu hỏi AI kiểu «yểm thế nào để người yêu cũ khổ» hay «chôn bùa dưới nhà hàng xóm thì sao» có thể là trò đùa, có thể là ý định thật (RB3 hại bên thứ ba).
- **Giảm thiểu:** RB3 được nâng ưu tiên trong persona Phán quan, Mao Sơn, Vu y; câu trả lời chuẩn: từ chối + chuyển về tự dưỡng + gợi ý tìm hỗ trợ khi đang giận; không bao giờ mô tả cách làm; nếu tín hiệu ý định bạo lực cụ thể (vũ khí, địa chỉ, thời gian) thì hiện thẻ hỗ trợ (tập 14.09 §4.3).
- **Phát hiện:** red-team mục RB3 (tập 14.10 §4.2).
- **Dự phòng:** SEV2, sửa persona.

### RISK-050 · Đặc Tính về hôn nhân, giới tính làm tổn thương người độc thân, người LGBT
**An toàn · K 3 · T 3 · 9 Cam · Chủ: TND · Mốc: M1**
- **Mô tả:** Cô Thần – Quả Tú («khó duyên vợ chồng»), Đào Hoa, luận Tài/Quan theo giới (`buildChartBrief` có «ĐỐI TƯỢNG QUAN TÂM», mặc định khác giới). Biến chúng thành Đặc Tính công khai («Cô Độc») là dán nhãn đời sống riêng; mặc định dị tính loại trừ người chơi LGBT.
- **Giảm thiểu:** Đặc Tính về hôn nhân không thành perk công khai; mô tả trung tính về **cách giao tiếp** thay vì «khó lấy chồng»; hợp hôn cho phép chọn đối tượng quan tâm như app (`R.chart.input.partner`); tham khảo `docs/SAMESEX-CULTURAL-ETHICAL-RESEARCH.md`.
- **Phát hiện:** duyệt bảng `shensha-perks.json` (tài liệu 04) bằng checklist tập 14.09 §2.4.
- **Dự phòng:** sửa mô tả perk.
