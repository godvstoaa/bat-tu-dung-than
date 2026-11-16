# 04 · Lộ trình và hàng việc

> **Trạng thái:** `[ĐÃ CÓ]` (danh sách việc); thứ tự ưu tiên là `[ĐỀ XUẤT]`
> **Bộ phận chủ trì:** Thiết kế game (người quyết thứ tự: chủ dự án)
> **Nguồn sự thật trong mã:** [A2](phu-luc/A2-kiem-thu.md), [A4](phu-luc/A4-giao-thuc.md); mục «chưa làm» trong nhật ký thi công
> **Test:** tiêu chí nghiệm thu của từng việc
> **Thay thế:** `GAME-V2-THIET-KE` §6, `GAME-THIET-KE-CHOT` §5, `GAME-SINH-TON-KINH-TE-DAC-TA` §10, §20, §25.3, §31.3, `docs/npc-ai/15`, goal trong các manifest đồ hoạ (chỉ tóm tắt; chi tiết vẫn ở manifest)
> **Kiểm với mã ngày:** 2026-11-16

## 4.1 Mục đích

Một danh sách việc duy nhất cho mọi bộ phận. Lộ trình cũ chia theo sáu hệ mã khác nhau; chúng đều đã xong hoặc đã bị cắt, và được ánh xạ ở §4.2 để tra nhật ký. Việc mới mang mã `VC-nnn` và theo khuôn phiếu việc ở mục 2.11 của manifest.

## 4.2 Sáu hệ mã giai đoạn cũ: nay ở đâu

| Hệ mã | Nội dung | Trạng thái | Chương |
|---|---|---|---|
| `V2-1 … V2-5` | camera, ánh sáng, nhập môn, giải quẻ, điện thờ, cấp và gia trì | xong 04/11 | §11, §12, §30 |
| `P0-1`, `P0-2` (thiết kế chốt) | Đường Thầy; bước «Năm nay» ở bốn sảnh | xong 05/11 | §12 |
| `G0 … G4` (NPC-AI) | G0 dữ liệu persona · G1 chèn persona vào AI · G2 bark và chuyện khách · G3 model và vị trí · G4 chạy NPC tín ngưỡng | G0–G2 xong; G3 rút gọn; G4 chưa | §21 |
| `P0 … P21` (đời sống – kinh tế) | tài khoản → sinh tồn → nghề → bệnh → nhà xe → nhiệm vụ mệnh → NPC LLM → kho → sản xuất → ẩm thực → nhà hàng → hôn nhân → thầy mệnh lý → đạp nước → phi hành → di động → Âm Đức → tiền kim loại → Huyền học → tu luyện → luân hồi | **xong cả 22** (xem ngoại lệ ở §3.4) | §13–§18, §20, §31 |
| `v4`, `v5`, `v5.1`, `v5.2`, `v6` và `G-5.x`, `G-6.x`, `G-8.x` | thành gấp 10 → quy hoạch phường → phố có người, cây, mùa → Cửu Trọng Thiên; goal đồ hoạ | xong tới v6; goal còn mở nằm trong từng manifest | §10, §23, §30 |
| `M0 … M6` (bản tầm nhìn) | lộ trình 35 tuần | **đã cắt** (QĐ-C3) | lớp L4 |

## 4.3 Thứ tự ưu tiên `[ĐỀ XUẤT]`

| Bậc | Nghĩa | Việc |
|---|---|---|
| **Ư1 — an toàn vận hành** | hỏng thì không biết, hoặc rủi ro pháp lý | VC-008, VC-020, VC-021, VC-025, VC-007 |
| **Ư2 — khép đặc tả** | đặc tả hứa mà mã chưa có hoặc chưa kiểm | VC-013, VC-014, VC-027, VC-028, VC-029, VC-031, VC-005 |
| **Ư3 — chất lượng** | người chơi thấy được | VC-009, VC-010, VC-006, VC-012, VC-024, VC-032 |
| **Ư4 — tài liệu và nợ** | giữ bộ thiết kế sống | VC-003, VC-022, VC-023, VC-030, VC-033 |
| **Chờ chủ dự án** | không tự làm được | VC-015, VC-016, VC-017, VC-018, VC-019; quyết định pháp lý của VC-039 |

## 4.4 Phiếu việc

### VC-001 · Sửa lệnh test chung
- **Đã đóng 2026-11-16** — sửa theo [GAME-SUA-LOI-MANIFEST](../GAME-SUA-LOI-MANIFEST.md); kiểm bằng test ghi ở mục Nghiệm thu.
- **Bộ phận:** QA · **Chương:** §32 · **Phụ thuộc:** duyệt §2.5 mục 8
- **Hiện trạng:** `npm run test:game` gọi tệp test thành phố bản cũ (tên `test-game-city`), nay không còn tồn tại, nên dừng ở bộ thứ 9; 17 bộ test không nằm trong lệnh npm nào.
- **Mong muốn:** một lệnh chạy hết mọi bộ test thuần, một lệnh chạy ba bộ cần máy chủ.
- **Nghiệm thu:** [A2](phu-luc/A2-kiem-thu.md) ghi «Lệnh npm trỏ tệp không tồn tại: 0» và «0 bộ không nằm trong lệnh npm nào»; lệnh chung thoát mã 0.
- **Ngoài phạm vi:** viết thêm test mới.

### VC-002 · Đưa kiểm tài liệu vào lệnh npm
- **Đã đóng 2026-11-16** — sửa theo [GAME-SUA-LOI-MANIFEST](../GAME-SUA-LOI-MANIFEST.md); kiểm bằng test ghi ở mục Nghiệm thu.
- **Bộ phận:** Vận hành · **Chương:** §32 · **Phụ thuộc:** VC-001
- **Hiện trạng:** `docs-game-gen.mjs` và `docs-game-lint.mjs` phải gọi tay.
- **Mong muốn:** có `docs:gen` và `docs:check`; kiểm tài liệu chạy cùng bộ test trước khi deploy.
- **Nghiệm thu:** `npm run docs:check` thoát mã 1 khi phụ lục cũ hoặc liên kết gãy.
- **Ngoài phạm vi:** chặn deploy tự động trong CI.

### VC-003 · Đổi chú thích mã đang trỏ tài liệu cũ
- **Bộ phận:** Client/3D, Backend · **Chương:** §90 · **Phụ thuộc:** duyệt §2.5 mục 8
- **Hiện trạng:** 40 chú thích trong `src/game` và `worker` trỏ tới chín tài liệu thế hệ cũ.
- **Mong muốn:** mỗi chú thích trỏ tới chương và mục `§` tương ứng của bộ này.
- **Nghiệm thu:** tìm chuỗi `docs/GAME-` trong `src/game` và `worker` chỉ còn các manifest lớp L2.
- **Ngoài phạm vi:** đổi logic mã.

### VC-005 · Bộ đánh giá trước khi bật persona cho Thầy
- **Đã đóng 2026-11-16:** cổng đánh giá **đạt** — 200/200 câu do mô hình thật trả lời (glm-5.3 qua proxy `/zai` của app); P0 100 %, từ chối thừa 0 %, giữ vai 100 %; 2 câu bộ chấm đánh dấu đã được đọc lại và kết luận đạt (`scripts/eval-persona-review.json`). Ba lượt chạy: lượt 1 lộ bộ chấm chưa hiểu vế phủ định (đã sửa); lượt 2 lộ một lỗi thật (F02, thầy đọc nguyên nhãn «Đại hung», đã thêm `softenRatings`); lượt 3 đạt. `gamePersona` bật lại. Đổi lời nhắc, mô hình hay persona thì chạy lại cổng trước khi phát hành.
- **Bộ phận:** AI/NPC · **Chương:** §21 · **Phụ thuộc:** VC-021
- **Tiến độ 16/11:** đã có `scripts/eval-persona.mjs`: nạp đủ 200 câu của bộ thử đỏ (101 câu P0), chấm tự động lớp 1, tính cổng phát hành. Chế độ ngoại tuyến đã chạy: cổng khủng hoảng bắt đủ 15/15 câu P0 nhóm C. **Còn lại:** chạy chế độ trực tuyến với mô hình thật (cần khoá và chi phí gọi mô hình), rồi có người đọc lại các câu P0 trượt.
- **Hiện trạng:** `FEATURES.personaAi` tắt; chưa có bộ 200 câu đánh giá, chưa có script chấm. Trong khi đó `FEATURES.gamePersona` (giọng persona cho thầy bói trong game) **đang bật trên web mà chưa qua đánh giá nào** (kiểm 16/11).
- **Mong muốn:** bộ câu cố định và ngưỡng đạt: giữ vai ≥ 98 %, an toàn 100 %.
- **Nghiệm thu:** có tệp bộ câu, có kết quả chạy ghi vào nhật ký; quyết định bật hay không ghi ở chương 02.
- **Ngoài phạm vi:** viết lại persona.

### VC-006 · Model riêng cho Vân Cốc và Khổng tiên sinh
- **Bộ phận:** Mỹ thuật · **Chương:** §21, §23
- **Hiện trạng:** hai nhân vật dùng model `master` chung.
- **Mong muốn:** mỗi người một model CC0 hoặc tự sinh, đúng tỉ lệ người chuẩn.
- **Nghiệm thu:** có dòng nguồn gốc trong sổ giấy phép; ảnh chụp trong game; số tam giác trong ngân sách nhân vật.
- **Ngoài phạm vi:** đổi khung xương người chơi.

### VC-007 · Rà persona tín ngưỡng theo LN-11
- **Bộ phận:** AI/NPC, Nội dung · **Chương:** §21, §40
- **Hiện trạng:** sách persona yêu cầu NPC tín ngưỡng chờ biên bản tham vấn; mã để vài persona ở mức gọi được AI và đã đặt ba thầy trong ba điện (MT-9).
- **Mong muốn:** mỗi persona tín ngưỡng có một trong hai trạng thái rõ ràng: «kịch bản» hoặc «đã có biên bản».
- **Nghiệm thu:** bảng persona ở [A3](phu-luc/A3-so-lieu.md) khớp bảng ở §21; không persona tín ngưỡng nào gọi AI khi chưa có biên bản.
- **Ngoài phạm vi:** viết thoại mới.

### VC-008 · Kiểm NPC trò chuyện và trọng tài trên bản thật
- **Bộ phận:** QA · **Chương:** §21.3, §12.6
- **Hiện trạng:** đã kiểm bằng máy dev với LLM giả và kiểm mô hình thật qua cổng công khai; chưa kiểm trọn luồng bằng tài khoản thật.
- **Mong muốn:** một lượt đủ trên bản thật: hỏi xã giao, mặc cả, lời dụ phá vai, đặt một lượt xem với thầy mệnh lý.
- **Nghiệm thu:** nhật ký ghi kết quả từng bước; hạn mức ngày trừ đúng; không lộ ngày sinh trong lời gọi.
- **Ngoài phạm vi:** đo chi phí.

### VC-009 · Nối nốt model phố và đo khung hình sau đợt nhà mới
- **Bộ phận:** Client/3D · **Chương:** §23, §30
- **Hiện trạng:** quầy Tàng Y Các, xe hàng, thùng, cột phướn, biển hiệu đã sinh tệp nhưng chưa dùng; chưa đo khung hình trước và sau.
- **Mong muốn:** dùng hết model đã sinh hoặc ghi rõ lý do bỏ; có số đo ở ba điểm cố định.
- **Nghiệm thu:** `DOHOA-MANIFEST` có dòng số đo mới; không model nào trong sổ ở trạng thái «chưa nối».
- **Ngoài phạm vi:** sinh model mới.

### VC-010 · Nấu bậc vừa và bậc xa cho nhà mới
- **Bộ phận:** Mỹ thuật · **Chương:** §23
- **Hiện trạng:** nhóm nhà A, B, C chưa có `.lod1`, `.mid`, `.lod2`; bậc vừa đang mượn bậc xa.
- **Mong muốn:** đủ bậc theo quy tắc ở §23.
- **Nghiệm thu:** [A6](phu-luc/A6-tai-san-3d.md) tăng số tệp tương ứng; ảnh so sánh bậc gần và bậc vừa.
- **Ngoài phạm vi:** đổi hình model.

### VC-012 · Đo khung hình Cửu Trọng Thiên trên máy người chơi
- **Bộ phận:** QA · **Chương:** §30
- **Hiện trạng:** chỉ có số đo máy dev.
- **Mong muốn:** số đo trên máy người chơi, so với Sơn Môn cùng máy.
- **Nghiệm thu:** `NHA-DIADIEM-MANIFEST` goal G-6.4 được đánh dấu xong kèm số.
- **Ngoài phạm vi:** tối ưu thêm.

### VC-013 · Đưa ví tiền lên hẳn máy chủ
- **Bộ phận:** Backend · **Chương:** §31.3, §13.1
- **Hiện trạng:** ví nằm trên máy người chơi; ví chợ trên máy chủ nhận tiền gửi lên có trần mỗi ngày (QĐ-20).
- **Mong muốn:** máy chủ là sổ duy nhất của tiền; client chỉ hiển thị.
- **Nghiệm thu:** sửa bộ nhớ trình duyệt không làm tăng tiền tiêu được ở tiệm NPC lẫn chợ; test hai tài khoản đạt.
- **Ngoài phạm vi:** chỉ số sinh tồn trên máy chủ.

### VC-014 · Hệ số giờ và ngày trong lương do máy chủ tính
- **Bộ phận:** Backend · **Chương:** §14.2.4
- **Hiện trạng:** đặc tả ghi máy chủ chưa có lịch âm; mã có `jobs.HOUR_LUCK`.
- **Mong muốn:** xác nhận hệ số đang áp ở đâu; nếu chỉ ở client thì chuyển sang máy chủ.
- **Nghiệm thu:** một ca làm trong giờ hợp nghề được trả cao hơn đúng hệ số, kiểm bằng test `jobs`.
- **Ngoài phạm vi:** đổi giá trị hệ số.

### VC-015 · Đăng nhập Apple và phiên cho vỏ ứng dụng
- **Bộ phận:** Backend · **Chương:** §31.2 · **Phụ thuộc:** §2.5 mục 6
- **Hiện trạng:** chưa có; phiên dùng cookie cùng nguồn.
- **Mong muốn:** bản ứng dụng đăng nhập được và giữ phiên.
- **Nghiệm thu:** đăng nhập trên máy iOS thật, lưu mây hoạt động.
- **Ngoài phạm vi:** đưa game lên App Store.

### VC-016 · Đăng nhập số điện thoại
- **Bộ phận:** Backend, Vận hành · **Chương:** §31.2 · **Phụ thuộc:** §2.5 mục 4
- **Hiện trạng:** luồng mã có sẵn nhưng tắt; chưa có nhà cung cấp, chưa có lớp chống lạm dụng trước khi gửi tin.
- **Mong muốn:** bật được khi chủ dự án chọn nhà cung cấp.
- **Nghiệm thu:** gửi và nhận mã thật; giới hạn tần suất chặn đúng.
- **Ngoài phạm vi:** đầu số quốc tế.

### VC-017 · Cổng thanh toán Ngọc
- **Bộ phận:** Vận hành · **Chương:** §40 · **Phụ thuộc:** §2.5 mục 5
- **Hiện trạng:** bảng gói có sẵn, chưa có thanh toán thật; Ngọc không có nguồn nào.
- **Mong muốn:** do chủ dự án quyết.
- **Nghiệm thu:** theo quyết định.
- **Ngoài phạm vi:** bản iOS (luôn ẩn).

### VC-018 · Thu hồi nhà bỏ hoang
- **Bộ phận:** Thiết kế game, Backend · **Chương:** §15 · **Phụ thuộc:** §2.5 mục 9
- **Hiện trạng:** nhà đã mua giữ mãi; 292 căn là hữu hạn.
- **Mong muốn:** luật thu hồi nếu chủ dự án muốn.
- **Nghiệm thu:** theo quyết định.
- **Ngoài phạm vi:** hoàn tiền tự động.

### VC-019 · Đóng việc «ba điện vùng thiếu tượng»
- **Bộ phận:** Thiết kế game · **Chương:** §12
- **Hiện trạng:** việc treo từ 04/11; từ v4, miếu tám vị thần đã thay vai trò điện vùng (QĐ-C5).
- **Mong muốn:** chủ dự án xác nhận bỏ.
- **Nghiệm thu:** một dòng quyết định ở chương 02.
- **Ngoài phạm vi:** dựng điện mới.

### VC-020 · Văn bản quyền riêng tư cho việc gửi tứ trụ
- **Bộ phận:** Vận hành · **Chương:** §40, §12.6.3 · **Phụ thuộc:** §2.5 mục 7
- **Hiện trạng:** tính năng thầy mệnh lý đã chạy; QĐ-07 yêu cầu chính sách và nhãn kho ứng dụng ghi rõ trước khi bật.
- **Mong muốn:** chính sách ghi: gửi gì, cho ai, giữ bao lâu, xoá thế nào.
- **Nghiệm thu:** trang chính sách có mục này; thẻ đồng thuận trong game dẫn tới nó.
- **Ngoài phạm vi:** đổi luồng kỹ thuật.

### VC-021 · Ngân sách LLM và công tắc tắt
- **Bộ phận:** AI/NPC, Vận hành · **Chương:** §21 · **Phụ thuộc:** §2.5 mục 2
- **Hiện trạng:** có hạn mức theo người, chưa có trần tiền theo tháng. NPC chat và trọng tài không ghi lượt gọi vào bảng đo của quản trị, nên chi phí của hai đường này chưa đo được (kiểm 16/11).
- **Mong muốn:** trần tháng, cảnh báo ở 80 %, thứ tự ưu tiên trọng tài trước NPC (QĐ-10), công tắc tắt trên bảng quản trị.
- **Nghiệm thu:** đặt trần thấp trên máy dev thì NPC chuyển sang câu mẫu, trọng tài vẫn chạy.
- **Ngoài phạm vi:** đổi mô hình.

### VC-022 · Rà phần tầm nhìn và sách NPC-AI còn nợ
- **Bộ phận:** Nội dung · **Chương:** §90, §21, §40
- **Hiện trạng:** ngày 16/11 đã đối chiếu trọn mục 01–16 của `docs/npc-ai/` với mã (§21.7.2) và rà **tổng quan** chín tập `docs/gdd/`: trang tổng quan của tập, danh mục tệp, vài mục chọn lọc (§90.5). Chưa đọc từng tệp của chín tập đó (khoảng 230 tệp).
- **Mong muốn:** khi một bộ phận cần khai thác sâu một tập (ví dụ Nội dung lấy kho thoại ở tập 06, Vận hành lấy văn bản pháp lý nháp ở tập 14) thì đọc trọn tập đó và ghi «đã đọc trọn» ở §90.5.
- **Nghiệm thu:** cột «Đã rà» ở §90.5 ghi đúng mức đọc của từng tập; không còn dòng «chưa rà».
- **Ngoài phạm vi:** viết lại bản tầm nhìn.

### VC-023 · Tách nhật ký khỏi tài liệu V2
- **Bộ phận:** Vận hành · **Chương:** `NHAT-KY`
- **Hiện trạng:** toàn bộ nhật ký thi công nằm trong `GAME-V2-THIET-KE` §7 và các mục sau.
- **Mong muốn:** nhật ký theo tháng trong `docs/game/`; V2 chỉ còn là lịch sử.
- **Nghiệm thu:** mỗi mục nhật ký cũ có ở tệp mới, không mất dòng.
- **Ngoài phạm vi:** viết lại nội dung nhật ký.

### VC-024 · Bốn lỗi giao diện đã biết
- **Bộ phận:** Client/UI · **Chương:** §22
- **Hiện trạng:** theo lần rà 10/11: còn hộp `confirm()` của trình duyệt, nút HUD 40 px, một màu chữ tương phản thấp, một biểu tượng cổng không đúng văn hoá. Mã đã đổi nhiều từ đó.
- **Mong muốn:** xác nhận lại từng lỗi; sửa những lỗi còn.
- **Nghiệm thu:** không còn `confirm(` trong `src/game`; vùng chạm ≥ 44 px; tương phản chữ ≥ 4,5:1.
- **Ngoài phạm vi:** thiết kế lại HUD.

### VC-025 · Dọn cây làm việc
- **Bộ phận:** Vận hành · **Chương:** §32
- **Hiện trạng:** 5 tệp đang sửa, 55 tệp chưa theo dõi, có vài tệp tên lạ ở gốc repo.
- **Mong muốn:** cây sạch; ảnh chụp kiểm thử có chỗ ở rõ ràng hoặc bị bỏ qua.
- **Nghiệm thu:** `git status` chỉ còn thay đổi có chủ đích.
- **Ngoài phạm vi:** viết lại lịch sử commit.

### VC-027 · Hợp đồng sỉ và đấu giá mặt bằng
- **Bộ phận:** Thiết kế game, Backend · **Chương:** §17.1.4, §17.4.5
- **Hiện trạng:** đặc tả có; danh sách thao tác kinh tế không có tên tương ứng.
- **Mong muốn:** xác nhận trong mã; thiếu thì hoặc làm, hoặc ghi quyết định cắt.
- **Nghiệm thu:** bảng §3.4 không còn hai dòng này.
- **Ngoài phạm vi:** đổi luật chợ ký gửi.

### VC-028 · Bếp trưởng điều hành ăn chia
- **Bộ phận:** Thiết kế game, Backend · **Chương:** §17.3.4
- **Hiện trạng:** như VC-027.
- **Mong muốn:** như VC-027.
- **Nghiệm thu:** bảng §3.4 không còn dòng này.
- **Ngoài phạm vi:** thêm bếp trưởng NPC.

### VC-029 · Đồng sở hữu tài sản và thừa kế trong hôn nhân
- **Bộ phận:** Thiết kế game, Backend · **Chương:** §20.2.3
- **Hiện trạng:** mã có quỹ chung ghi tỉ lệ góp; chưa thấy đồng sở hữu nhà, xe, mặt bằng.
- **Mong muốn:** như VC-027.
- **Nghiệm thu:** bảng §3.4 không còn dòng này.
- **Ngoài phạm vi:** đổi ba hạng lễ.

### VC-030 · Duyệt trụ cột và mâu thuẫn
- **Bộ phận:** chủ dự án · **Chương:** §0.3, §2.4
- **Hiện trạng:** bảy trụ cột và mười cách giải mâu thuẫn đang là đề xuất.
- **Mong muốn:** duyệt, sửa hoặc bác từng dòng.
- **Nghiệm thu:** nhãn `[ĐỀ XUẤT]` ở hai mục đó đổi thành quyết định có số.
- **Ngoài phạm vi:** đổi mã.

### VC-031 · Chỉ số giá theo phòng
- **Bộ phận:** Thiết kế game, Backend · **Chương:** §13.3.4
- **Hiện trạng:** đặc tả mô tả giá đồ ăn, thuốc, trọ chỉnh theo lượng tiền lưu hành; chưa thấy trong mã.
- **Mong muốn:** làm, hoặc ghi quyết định hoãn kèm điều kiện mở lại.
- **Nghiệm thu:** bảng §3.4 không còn dòng này.
- **Ngoài phạm vi:** bảng điều khiển kinh tế (đã có).

### VC-032 · Rà chuỗi hiển thị theo luật ngôn từ
- **Bộ phận:** Nội dung · **Chương:** §40
- **Hiện trạng:** nhiều hệ mới (bệnh, luật, luân hồi, trọng tài) thêm chuỗi hiển thị sau lần rà ngôn từ gần nhất.
- **Mong muốn:** mọi chuỗi người chơi thấy tuân LN-07.
- **Nghiệm thu:** tìm các từ ở danh sách cấm của §40 trong chuỗi hiển thị cho kết quả rỗng, trừ chỗ có chú thích lý do.
- **Ngoài phạm vi:** đổi cơ chế.

### VC-033 · Đối chiếu từng con số luật kế thừa từ đặc tả với mã
- **Bộ phận:** QA, Thiết kế game · **Chương:** §12, §13, §14, §15, §16, §17, §18, §20, §21, §22, §31
- **Hiện trạng:** 1.590 dòng luật được chép từ đặc tả kinh tế sang 11 chương. Chỗ mã chạy khác lời đặc tả đã ghi ở các mục «đang chạy thêm hoặc khác đặc tả», nhưng chưa ai đối chiếu **từng con số**. Đợt soạn bộ này chỉ kiểm mẫu 30 con số (lệch 2, đã sửa) và bắt được một số cũ còn sót («47 tiệm»).
- **Mong muốn:** mỗi con số luật trong các mục đó hoặc khớp một hằng số trong mã và ghi kèm tên hằng, hoặc nằm trong mục «khác đặc tả» của chương.
- **Nghiệm thu:** mỗi chương nêu trên cập nhật trường «Kiểm với mã ngày» ở đầu tệp sau khi đối chiếu xong; `node scripts/docs-game-lint.mjs` vẫn đạt; danh sách con số lệch (nếu có) được ghi vào nhật ký.
- **Ngoài phạm vi:** đổi cân bằng game; sửa mã cho khớp đặc tả.

### VC-034 · Thi hành mức `aiEnabled` của persona bằng mã
- **Đã đóng 2026-11-16** — sửa theo [GAME-SUA-LOI-MANIFEST](../GAME-SUA-LOI-MANIFEST.md); kiểm bằng test ghi ở mục Nghiệm thu.
- **Bộ phận:** AI/NPC, Backend · **Chương:** §21.2, §40.3
- **Hiện trạng:** mức `aiEnabled` chỉ là dữ liệu; chuỗi AI chỉ chặn `runtime: false`. Khi `gamePersona` bật, hai persona mức `kichban` (Trương Thiên Sư, Ni sư Diệu Âm) được nạp vào AI của thầy bói trong game. Đường `/api/npc/chat` nạp bất kỳ mã persona nào client gửi, kể cả mức `khong`.
- **Mong muốn:** persona mức `kichban` và `khong` không bao giờ được chèn vào lời gọi mô hình, ở cả client lẫn máy chủ; thầy bói mang persona đó trả lời bằng giọng chung hoặc bằng kịch bản.
- **Nghiệm thu:** `scripts/test-game-ai-persona.mjs` có ca cho từng mức ở cả hai đường và đạt; chạy thử với mô hình giả, lời nhắc gửi đi không chứa persona mức `kichban` hay `khong`.
- **Ngoài phạm vi:** quyết định persona nào được nâng lên mức `co` (`VC-007`).

### VC-035 · Cổng khủng hoảng trước mọi đường trò chuyện
- **Đã đóng 2026-11-16** — sửa theo [GAME-SUA-LOI-MANIFEST](../GAME-SUA-LOI-MANIFEST.md); kiểm bằng test ghi ở mục Nghiệm thu.
- **Bộ phận:** AI/NPC, Client 3D · **Chương:** §40.4, §21.2
- **Hiện trạng:** luật «khủng hoảng chạy trước AI» mới là câu chữ trong dữ liệu persona. Không đường trò chuyện nào có bộ nhận tín hiệu: Thầy ở trang chính, thầy bói trong game, NPC chat (kiểm 16/11).
- **Mong muốn:** đúng các luật ở §40.4: xét tín hiệu trên máy trước lời gọi AI, kể cả bản iOS và khi AI tắt; rời vai đúng một câu; khối hỗ trợ cố định không gọi mạng; huỷ lượt đang stream.
- **Nghiệm thu:** bộ câu mẫu có và không có tín hiệu đạt ở cả ba đường; số điện thoại trong khối hỗ trợ đã được chủ dự án xác minh.
- **Ngoài phạm vi:** mức trung gian mà sách chưa chốt; tư vấn tâm lý trong game.

### VC-036 · Vật thiêng trong danh mục Tàng Y Các
- **Đã đóng 2026-11-16** — sửa theo [GAME-SUA-LOI-MANIFEST](../GAME-SUA-LOI-MANIFEST.md); kiểm bằng test ghi ở mục Nghiệm thu.
- **Bộ phận:** Nội dung, Thiết kế game · **Chương:** §40.3, §40.7, §23.6
- **Hiện trạng:** luật «hàng bán không mang tên vật thiêng» lệch với danh mục đang chạy: «Bộ Bộ Sinh Liên», «Liên Hoa Đài», «Mũ Sen Vàng» (khoá VIP), «Bát Quái Hộ Thân Phù» (khoá VIP), «Tử Y Chân Nhân» (khoá VIP). Bản tầm nhìn xếp đây là rủi ro hàng đầu; riêng tên «Pháp Luân» đã được đổi.
- **Mong muốn:** chủ dự án quyết từng món: giữ, đổi tên và mô tả, bỏ khoá VIP, hay rút. Sau quyết định, có test tự động chặn món mang nhãn thiêng mà bán bằng Ngọc hoặc khoá VIP (sáu bất biến của bản tầm nhìn, tập 14).
- **Nghiệm thu:** quyết định ghi ở chương 02; `scripts/test-game-cosmetics.mjs` có ca kiểm tương ứng và đạt.
- **Ngoài phạm vi:** dựng lại model.

### VC-037 · Vá các lỗ hổng đã biết của phòng nhiều người
- **Bộ phận:** Backend · **Chương:** §31, §20.1
- **Đã đóng 2026-11-16** — năm mục đều xử lý; kết quả từng mục ở §3.6.
- **Hiện trạng:** kiểm 16/11 theo danh sách của bản tầm nhìn: (1) tham số `?server=` — **đã sửa 16/11**, chỉ còn ở bản dev; (2) trang phục gửi qua mạng chỉ được kiểm «có trong danh mục», chưa kiểm sở hữu; (3) danh hiệu được lọc ký tự như tên nhưng chưa đối chiếu danh hiệu đã đạt; (4) báo cáo vi phạm lưu tối đa 500 mục mỗi phòng, chưa có người duyệt; (5) chưa kiểm: khoá quản trị có truyền qua địa chỉ không, màu áo đồng bộ có để lộ Dụng thần không.
- **Mong muốn:** bản phát hành không nhận `?server=`; máy chủ chỉ phát trang phục và danh hiệu mà tài khoản có; báo cáo có hàng đợi và người phụ trách; mục (5) được kiểm và ghi kết quả vào §3.6.
- **Nghiệm thu:** mỗi mục có ca test giao thức; `scripts/test-quan-protocol.mjs` đạt.
- **Ngoài phạm vi:** viết lại giao thức.

### VC-038 · Lỗi nhỏ đã biết trong mã
- **Đã đóng 2026-11-16** — sửa theo [GAME-SUA-LOI-MANIFEST](../GAME-SUA-LOI-MANIFEST.md); kiểm bằng test ghi ở mục Nghiệm thu.
- **Bộ phận:** Backend, AI/NPC · **Chương:** §21.5, §3.6
- **Hiện trạng:** (1) hàm làm sạch câu người chơi gửi NPC (`npc-chat-core.js › cleanInput`) thay mọi chữ «s» bằng dấu cách vì biểu thức thiếu một dấu gạch chéo ngược; mọi câu người chơi gõ đều bị hỏng chữ và bộ lọc từ thô tục bị lọt. (2) Engine: so chuỗi giản thể với phồn thể; đọc sai khoá Dụng thần; hai lỗi chính tả trong chữ hiển thị (QĐ-C6 đang cho game lách). (3) Biểu tượng cổng đền của Nhật dùng cho cổng đại vận ở hai chỗ. (4) Chú thích ở máy chủ ghi sai tên mô hình.
- **Mong muốn:** sửa (1) trước vì ảnh hưởng mọi câu; các mục còn lại theo quyết định của chủ dự án về engine.
- **Nghiệm thu:** test mới: câu có chữ «s» đi qua hàm làm sạch giữ nguyên chữ, khoảng trắng liền nhau gộp làm một, từ trong danh sách cấm bị chặn.
- **Ngoài phạm vi:** viết lại bộ lọc.

### VC-039 · Giấy phép cho chế độ nhiều người tại Việt Nam
- **Phần kỹ thuật xong 2026-11-16:** biến môi trường `MMO_BLOCK_COUNTRIES` (vd `VN`) tắt chế độ nhiều người theo quốc gia; client nhận mã đóng `CLOSE_REGION`, dừng thử lại, chơi đơn đủ hệ. Mặc định không chặn ai. Phần còn lại là quyết định pháp lý.
- **Bộ phận:** Vận hành (chủ dự án quyết) · **Chương:** §40.6
- **Hiện trạng:** bản tầm nhìn (tập 14) xếp đây là rủi ro số một: theo cách hiểu của người soạn tập đó về Nghị định 147/2024/NĐ-CP, game nhiều người chơi tương tác qua máy chủ thuộc loại G1, cần giấy phép và phê duyệt kịch bản trước khi phát hành tại Việt Nam; chính tập đó ghi «cần luật sư xác minh». Bộ thiết kế này chưa có quyết định nào về việc đó, trong khi chế độ nhiều người đã có trong mã.
- **Mong muốn:** chủ dự án chọn một trong ba hướng mà tập 14 nêu (tắt chế độ nhiều người ở Việt Nam; phát hành qua đối tác có phép; tự xin phép) sau khi có ý kiến luật sư.
- **Nghiệm thu:** quyết định ghi ở chương 02, kèm ngày và người tư vấn.
- **Ngoài phạm vi:** tự diễn giải luật.

## 4.5 Liên kết

- Trạng thái từng hệ: [03-TRANG-THAI](03-TRANG-THAI.md). Việc theo bộ phận: sổ tay 50–57.
- Goal đồ hoạ còn mở: xem mục goal của `DOHOA-MANIFEST`, `CAY-QUAN-MANIFEST`, `NHA-DIADIEM-MANIFEST`.
