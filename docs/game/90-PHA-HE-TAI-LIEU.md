# 90 · Phả hệ tài liệu: cái cũ nay ở đâu

> **Trạng thái:** `[ĐÃ CÓ]`; các dòng «chưa rà» thuộc `VC-022`
> **Bộ phận chủ trì:** Nội dung (đồng giữ: Vận hành)
> **Nguồn sự thật trong mã:** không
> **Test:** kiểm V7 của manifest
> **Thay thế:** không; đây là bảng chỉ đường từ tài liệu cũ sang bộ mới
> **Kiểm với mã ngày:** 2026-11-16

## 90.1 Mục đích

Ai đang cầm một tài liệu cũ, hoặc đọc một chú thích mã trỏ về tài liệu cũ, tra ở đây để biết: tài liệu đó còn hiệu lực không, phần nào đã chuyển sang chương nào.

## 90.2 Bốn lớp

| Lớp | Nghĩa | Dùng để |
|---|---|---|
| L1 | bộ này (`docs/game/`) | làm việc |
| L2 | manifest chuyên đề còn hiệu lực | tra chi tiết sâu của một mảng |
| L3 | đã thay thế, giữ làm lịch sử | hiểu vì sao |
| L4 | tầm nhìn tham khảo | lấy ý khi một chương L1 dẫn tới |

## 90.3 Từng tài liệu

| Tài liệu ở `docs/` | Ngày | Lớp | Nay ở đâu | Còn giá trị riêng |
|---|---|---|---|---|
| `GAME-HUYEN-QUAN-SPEC` | 03/11 | L3 | §11, §12.3, §40 | luật mỹ thuật và an toàn gốc (mục 9, 11) — đã gom vào §40; **chưa rà lại từng dòng** |
| `GAME-MMO-PROMPT-PLAN` | 03/11 | L3 | §20, §31 | lý do chọn cụm từ soạn sẵn; **chưa rà lại từng dòng** |
| `DAI-THE-GIOI-DESIGN` | 03/11 | L3 | §10 | ý đồ ban đầu của bảy vùng ngoài thành; **chưa rà lại từng dòng** |
| `GAME-V2-THIET-KE` | 04–14/11 | L3 (§1–§6) và **nhật ký còn dùng** (§7 trở đi) | §11, §12, §10; nhật ký → [NHAT-KY](NHAT-KY.md) | nhật ký thi công đầy đủ nhất, có số đo và lỗi đã sửa (`VC-023`) |
| `GAME-NOI-DUNG-THEO-APP` | 05/11 | L3 | §12.4 | bảng sảnh nghề ↔ engine gốc; **chưa rà lại từng dòng** |
| `GAME-THIET-KE-CHOT` | 05/11 | L3 | §2.3 (QĐ-C1…C7), §12.5 | bằng chứng kèm từng quyết định |
| `GAME-MESHY-ASSET-PLAN`, `MESHY-LIBRARY-CC0` | 03–05/11 | L3 | §23.3 | danh sách model thư viện đợt đầu |
| `GAME-AAA-THIET-KE` | 05/11 | L4 | §0.3 (trụ cột), §18.7 | bản tổng của tầm nhìn; **chưa rà** |
| `docs/gdd/` (14 tập, 343 tệp) | 05/11 | L4 | xem §90.5 | kho ý tưởng, lore, luật viết |
| `GAME-NPC-AI-THIET-KE-DAY-DU` | 09/11 | L3 | bản ghép của `docs/npc-ai/`; dùng thư mục, không dùng bản ghép | — |
| `docs/npc-ai/` (36 mục) | 09/11 | **L2** | §21 tóm tắt và dẫn tới | hồ sơ 20 persona (17–36, đã rà); kiến trúc chuỗi AI (01–16, **đã đối chiếu với mã 16/11**: §21.7.2) |
| `GAME-SINH-TON-KINH-TE-DAC-TA` | 10–11/11 | L3 | §13–§18, §20, §21, §22, §31; bảng số mục ở §90.4 | lời dẫn của từng phần; bảng phân công theo đội |
| `THANH-MANIFEST`, `TUONG-THANH-MANIFEST` | 11–12/11 | **L2** | §10 dẫn tới | quy chuẩn phường, kèm chỉ số kiểm |
| `CAY-QUAN-MANIFEST` | 12/11 | **L2** | §23 dẫn tới | cây, quán, mùa |
| `NHA-DIADIEM-MANIFEST` | 12/11 | **L2** | §10.7, §22.4, §15.2 dẫn tới | Cửu Trọng Thiên, menu «Địa điểm» |
| `DOHOA-MANIFEST` | 12–15/11 | **L2** | §30.6, §23 dẫn tới | ngân sách và các đợt đo |
| `GAME-TROI-THIET-KE` | 13/11 | **L2** | §10.7 dẫn tới | quận Thiên Bàn |
| `GAME-AAA-MODEL-THANH-PHO` | 14/11 | **L2** | §23.2 dẫn tới | bảng tỉ lệ chuẩn, bộ model nhà |
| `TAI-KHOAN-CAI-DAT` | 10/11 | **L2** | §31.2, §32.4 dẫn tới | các bước cấu hình bản thật |
| `KNOWLEDGE-BEHAVIORAL`, `docs/knowledge/` | 08/11 | — | **chưa rà**; chưa rõ có thuộc game không | — |
| `GAME-THIET-KE-MANIFEST` | 16/11 | quy tắc của L1 | — | cách soạn và kiểm bộ này |

## 90.4 Số mục của đặc tả đời sống – kinh tế: cũ → mới

Chú thích mã và nhật ký còn dùng số mục cũ (ví dụ «§5.4», «§14.4»). Tra bảng này.

| Mục cũ | Tên | Mục mới |
|---|---|---|
| §0 | Tóm tắt | chương 00 |
| §1 | Tài khoản và lưu trữ | §31.2 |
| §2 | Chỉ số sinh tồn | §13.2 |
| §3 | Kinh tế khắt khe (§3.1 tiền tệ đã bị thay) | §13.3; tiền tệ ở §13.1 |
| §4 | Việc làm theo mệnh | §14.1 |
| §5 | Thuê người, chỗ làm | §14.2 |
| §6 | Nhà ở (chỗ ngủ) | §15.1 |
| §7 | Phương tiện | §15.3 |
| §8 | NPC hội thoại bằng LLM | §21.3 |
| §9 | Máy chủ giữ sổ | §31.3 |
| §10 | Lộ trình | chương 04 |
| §11 | Quyết định | chương 02 |
| §12 | Hôn nhân và ly hôn | §20.2 |
| §13 | Sản xuất và chuỗi cung ứng | §17.1 |
| §14 | Thầy mệnh lý và trọng tài | §12.6 |
| §15 | Ẩm thực | §17.2 |
| §16 | Đầu bếp, công thức bí truyền | §17.3 |
| §17 | Mặt bằng, nhà hàng | §17.4 |
| §18 | Chống khai thác | §17.5 |
| §19 | Yêu cầu kỹ thuật (§19.5 trọng tài AI) | §31.4; trọng tài ở §21.4 |
| §20 | Phân công (§20.3 thước đo cân bằng) | chương 04, sổ tay 50–57; thước đo ở §17.6 |
| §21 | Đạp nước | §16.3 |
| §22 | Phi hành độc bản | §16.4 |
| §23 | Giao diện di động | §22.2 |
| §24 | Điểm danh vận khí, Âm Đức | §18.2 |
| §25 | Dữ liệu, gói mạng | §31.5 |
| §26 | Tiền kim loại | §13.1 |
| §27 | Ba chỉ số Huyền học | §18.1 |
| §28 | Phúc duyên và tai hoạ | §18.3 |
| §29 | Pháp môn, cảnh giới | §18.4 |
| §30 | Tử vong, Âm phủ, luân hồi | §18.5 |
| §31 | Dữ liệu, chuyển đổi | §31.6 |

Tiểu mục giữ nguyên số đuôi: «§12.4» cũ là «§20.2.4» mới.

## 90.5 Bản tầm nhìn `docs/gdd/`: đã rà tới đâu

| Tập | Tên | Đã rà | Lấy gì | Bỏ gì |
|---|---|---|---|---|
| 00 | Kinh điển chung | rà tổng quan 16/11 (tiêu đề và mục đính chính) | tám đính chính của chính bản tầm nhìn; hai điều còn dùng được: âm lịch phải đối chiếu múi giờ Việt Nam (§3.6), lời cho lá số thấp phải viết cho số đông (§40.2) | mã vùng, mã nhiệm vụ, công thức chỉ số |
| 01 | Tầm nhìn | **đã rà 10/11** | luật văn phong và cấm kỵ → §40.2; sáu trụ cột → §0.3 (viết lại) | chân dung nhóm lớn, chỉ số cho đội đông người |
| 02 | Thế giới | **đã rà 10/11** | vũ trụ quan, câu khắc Thiên Mệnh Bàn, Âm phủ là nơi soi xét → §18.7; quy ước đặt tên → §40.3 | hai mươi vùng, toạ độ |
| 03 | Cốt truyện | **đã rà 10/11** | luật an toàn nội dung; khuôn «chuỗi án lừa» có thể làm nội dung sau | bốn hồi, 48 cảnh cắt |
| 04 | Chỉ số | rà tổng quan 16/11 | số đo phân bố lá số (khoảng một nửa thuộc nhóm thấp) → §40.2; tệp ngôn từ an toàn cho điểm thấp là kho tham khảo của Nội dung | Mệnh Bàn, Tiềm Lực, Phẩm căn, 60 nút kỹ năng, perk theo sao. Nguyên tắc «chỉ cộng, không trừ» của tập này **không** được game đang chạy áp dụng: phạm Kỵ thần làm giảm lương (§14.1.1) |
| 05 | Cải mệnh | rà tổng quan 16/11 | câu nền «mệnh là quỹ đạo, không phải kết cục»; chín luật chống cày việc thiện là kho tham khảo cho §18 | Mệnh Đồ, Vận Phù, Sổ Công Quá 245 việc, mười thanh nghiệp, chín đạo thống, Tà Lộ (game đang chạy dùng Phúc Khí, Âm Đức, Nghiệp Lực và 11 pháp môn) |
| 06 | NPC-AI | rà tổng quan 16/11; phần thiết kế đã bị `docs/npc-ai/` thay | **vẫn là kho thoại:** hồ sơ, cây thoại và bark của 20 NPC, 44 NPC phụ, bộ thử đỏ 200 câu; sách NPC-AI dẫn các tệp này làm nguồn | phần kiến trúc AI |
| 07 | Thánh địa | **đã rà 10/11** | lore Am Vân Cốc; luật tôn trọng theo vùng | mười hai thánh địa, 324 công trình |
| 08 | Công trình | rà tổng quan 16/11 | luật «không có công trình làm màu» và mười lời hứa thị giác là chuẩn tham khảo cho §10; danh sách lỗi bố cục Sơn Môn chưa kiểm lại (§3.6) | chín bộ mô-đun kiến trúc, cơ chế khoang và cửa nhìn, kế hoạch 636 ngày người |
| 09 | Tu luyện | rà tổng quan 16/11 | 24 đặc tả mini-game và 125 hoạt động là kho ý tưởng; cách mô phỏng nhịp lên bậc | thang sáu bậc (đã thay bằng bảy cảnh giới, QĐ-12), kinh tế Đạo Hạnh, Nguyên Khí |
| 10 | Xã hội | rà tổng quan 16/11 | kho 276 cụm từ và 46 cử chỉ; lịch 51 lễ tính bằng lịch thật; phân tích việc màu áo để lộ Dụng thần (§3.6) | môn phái, sư đồ, kim lan, Thiên Bảng (§20.5), giao thức và hạ tầng riêng |
| 11 | Kinh tế | rà tổng quan 16/11; đọc thêm hiến chương đạo đức | bốn câu thề của cửa hàng → §40.7; rủi ro vật thiêng trong danh mục → `VC-036` | Phúc Khí làm tiền (đã thay bằng tiền kim loại), khoảng 530 mã hàng, 12 mùa, vé mùa, mô hình doanh thu |
| 12 | Trình bày | **đã rà 10/11** | màu, cỡ chữ, vùng chạm, trợ năng → §22.5 | 94 màn, nhạc, lồng tiếng |
| 13 | Kỹ thuật | rà tổng quan 16/11 | 21 lỗi mã ghi ở trang tổng của bộ, đã kiểm lại → §3.6; bộ quy trình mẫu là kho tham khảo của Vận hành | kiến trúc đích, 41 lược đồ, 290 việc theo mốc, lộ trình 35 tuần (lúc viết mã có 44 mô-đun, nay 156) |
| 14 | Rủi ro | rà tổng quan 16/11; đọc thêm bảng 20 rủi ro ưu tiên, mục pháp lý trò chơi, mục hỗ trợ khẩn cấp | giấy phép chế độ nhiều người → §40.6, `VC-039`; luồng khủng hoảng và số hỗ trợ → §40.4; sáu bất biến kinh tế kiểm tự động → `VC-036`; bản nháp chính sách quyền riêng tư và điều khoản là điểm xuất phát cho `VC-020` | sổ 175 rủi ro gắn mốc của bản tầm nhìn; hướng dẫn duyệt cho các vùng đã cắt |

«Đã rà» nghĩa là một lượt rà đã đọc trọn tập. «Rà tổng quan» nghĩa là đã đọc trang tổng quan của tập và danh mục tệp, cộng những mục được nêu tên; **chưa đọc từng tệp**. Bộ phận nào cần khai thác sâu một tập thì đọc trọn tập đó trước (`VC-022`).

## 90.6 Chú thích mã đang trỏ tài liệu cũ

Bốn mươi chú thích trong `src/game` và `worker` trỏ tới chín tài liệu lớp L3. Tra §90.3 và §90.4 để tìm chỗ mới. Đổi các chú thích này là việc `VC-003`.
