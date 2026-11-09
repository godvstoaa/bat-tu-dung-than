# Tập 14 · Rủi ro, tuân thủ và tôn trọng tín ngưỡng

> Thuộc bộ GDD **Huyền Giới · Mệnh Do Ta Tạo**. Mở rộng `docs/GAME-AAA-THIET-KE.md` §14 (cùng §5.5 Tà Lộ, §6.4 quy tắc an toàn hội thoại), tuân theo canon `docs/gdd/00-KINH-DIEN-CHUNG.md` (trụ cột **T6 · Tôn trọng và an toàn**).
> Không gian tên: **`RISK-*`** (canon §9).
> Phiên bản 1.0 · 2026-11-05.

---

## 1. Phạm vi

Tập này trả lời bốn câu hỏi cho mọi người làm game:

1. **Điều gì có thể đi sai?** — sổ rủi ro 175 mục (`RISK-001` … `RISK-175`), 12 nhóm.
2. **Làm gì để nó không xảy ra?** — quy tắc nội dung theo từng truyền thống, giới hạn âm tà / Tà Lộ, quy tắc ngôn ngữ cho điểm thấp và năm hạn, rào chắn AI, quy tắc kinh tế, quyền riêng tư, bảo mật, điều hành.
3. **Làm sao biết nó đang xảy ra?** — ca kiểm, bộ đề red-team, chỉ số theo dõi, thử nghiệm kín.
4. **Khi xảy ra thì làm gì?** — công tắc, kịch bản ứng phó, mẫu truyền thông, quy trình 72 giờ.

Tập này **dựa trên mã thật**: `src/engine/anti-manipulation-data.js`, `amta-data.js › ETHICS`, `tang-data.js › TANG_ETHICS`, `cultivation-data.js`, `neo-checker.js`, `ai.js`; `src/game/features.js`, `state.js`, `net.js`, `protocol.js`, `cosmetics.js`, `wardrobe-ui.js`, `master-ui.js`, `stations.js`; `worker/index.js`, `worker/quan-room.js`, `worker/admin.js`; `scripts/verify-ios-review-path.mjs`.

**Không phải ý kiến pháp lý.** Mọi trích dẫn văn bản chưa chắc chắn mang nhãn **(cần luật sư xác minh)**.

---

## 2. Mục lục

| Tệp | Nội dung | Dòng (xấp xỉ) |
|---|---|---|
| [01-phuong-phap-va-rui-ro-noi-dung-an-toan.md](01-phuong-phap-va-rui-ro-noi-dung-an-toan.md) | Phương pháp (thang K × T, trạng thái, vai trò, chu kỳ) · Sổ rủi ro A (nội dung, tôn giáo: RISK-001…030) · B (an toàn, sức khỏe tinh thần: RISK-031…050) | 460 |
| [02-rui-ro-ai-phap-ly-nen-tang.md](02-rui-ro-ai-phap-ly-nen-tang.md) | Sổ rủi ro C (AI: 051…072) · D (pháp lý: 073…090) · E (nền tảng: 091…104) | 400 |
| [03-rui-ro-rieng-tu-bao-mat-kinh-te.md](03-rui-ro-rieng-tu-bao-mat-kinh-te.md) | Sổ rủi ro F (riêng tư: 105…118) · G (bảo mật: 119…132) · H (kinh tế: 133…142) · **Bất biến kinh tế E1–E6, danh mục cấm bán** | 330 |
| [04-rui-ro-cong-dong-san-xuat-ky-thuat-danh-tieng.md](04-rui-ro-cong-dong-san-xuat-ky-thuat-danh-tieng.md) | Sổ rủi ro I (cộng đồng) · J (sản xuất) · K (kỹ thuật) · L (danh tiếng) · Tổng hợp sổ, 20 rủi ro ưu tiên, việc ngay M0 · Mẫu truyền thông khủng hoảng | 340 |
| [05-duyet-noi-dung-dao-giao.md](05-duyet-noi-dung-dao-giao.md) | Hướng dẫn duyệt Đạo giáo: quy tắc chung + **12 phái** (Chính Nhất, Toàn Chân, Mao Sơn, Lư Sơn, Thanh Vi, Thần Tiêu, Bắc Đế, Động Uyên, Linh Bảo, Tịnh Minh, Đan Đỉnh, Phương sĩ) · bảng pháp khí · checklist | 460 |
| [06-duyet-noi-dung-phat-giao.md](06-duyet-noi-dung-phat-giao.md) | Phật giáo Bắc tông Việt Nam · Thiền Trúc Lâm · Tịnh Độ · Mật · Chuẩn Đề · **Tạng truyền: kế hoạch tham vấn, danh sách cấm làm trước, phương án dự phòng** · checklist | 420 |
| [07-duyet-nho-dan-gian-dan-toc-quy-trinh-co-van.md](07-duyet-nho-dan-gian-dan-toc-quy-trinh-co-van.md) | Nho giáo · tín ngưỡng dân gian Việt · thờ Mẫu · người Miêu / H'Mông và tộc người khác · **vật thiêng không bao giờ là đồ thời trang** (rà 51 món) · giới hạn nghi lễ · **quy trình cố vấn, phiếu duyệt, ký** | 365 |
| [08-am-ta-ta-lo.md](08-am-ta-ta-lo.md) | Âm tà / Tà Lộ: cổng tự nguyện hai lớp, quy tắc nội dung chính xác, bộ lọc N1–N8, checklist, **15 ví dụ chấp nhận / không chấp nhận**, ràng buộc số, ca kiểm | 440 |
| [09-suc-khoe-tinh-than-khung-hoang.md](09-suc-khoe-tinh-than-khung-hoang.md) | Quy tắc ngôn ngữ cho điểm thấp và «năm hạn» · phát hiện tự hại ba lớp · luồng chuyển hướng · tài nguyên hỗ trợ Việt Nam (đánh dấu cần xác minh) · an toàn thể chất · vận hành | 460 |
| [10-an-toan-ai.md](10-an-toan-ai.md) | Kiến trúc rào chắn AI · chính sách nội dung · kiểm soát bịa đặt (checkNeo mở rộng) · kế hoạch red-team · lưu trữ dữ liệu · giám sát, sự cố, công tắc | 490 |
| [11-phap-ly-nen-tang.md](11-phap-ly-nen-tang.md) | Việt Nam (an ninh mạng, dữ liệu cá nhân, trò chơi G1–G4, tuổi, tín ngưỡng, di sản, người tiêu dùng, quảng cáo, thanh toán) · cờ bạc / hộp ngẫu nhiên · Apple 4.3(b) và các mục liên quan · Google Play · PC · quốc tế · câu hỏi cho luật sư | 460 |
| [12-rieng-tu-bao-mat-dieu-hanh.md](12-rieng-tu-bao-mat-dieu-hanh.md) | Bảng kê dữ liệu D1–D21 · ngày sinh và nội dung yêu cầu AI · tối thiểu hóa MMO · quyền người chơi · tài khoản · điều hành MMO (lọc tên, báo cáo, chặn, xử phạt) · mô hình đe dọa STRIDE · sổ cái · sự cố dữ liệu | 470 |
| [13-checklist-tuan-thu-M0-M6.md](13-checklist-tuan-thu-M0-M6.md) | Checklist dùng chung, bản vá khẩn, **từng mốc M0–M6** với cổng chặn · ma trận rủi ro Đỏ × mốc · biên bản ký | 490 |
| [14-the-an-toan-persona-npc.md](14-the-an-toan-persona-npc.md) | Thẻ an toàn cho 19 NPC · ma trận câu từ chối R1–R13 · NPC không có persona AI | 505 |
| [15-tu-dien-an-toan.md](15-tu-dien-an-toan.md) | Danh xưng thiêng (Phật, Đạo, Nho, Mẫu) · chuẩn hóa tiếng Việt, teencode · ngoại lệ thuật ngữ cổ pháp · cấu trúc tệp an toàn | 460 |
| [16-bo-de-red-team-va-danh-gia.md](16-bo-de-red-team-va-danh-gia.md) | Bộ đề RT-001…225 theo hạng mục × chiến thuật · bộ khủng hoảng · 80 câu «phải trả lời» · lịch chạy | 460 |
| [17-van-ban-phap-ly-nhap.md](17-van-ban-phap-ly-nhap.md) | Bản nháp Chính sách quyền riêng tư, Điều khoản sử dụng, Nội quy cộng đồng, Điều kiện mua hàng, vi văn bản bắt buộc | — |
| [18-bo-cong-cu-co-van-va-nghien-cuu-nguoi-dung.md](18-bo-cong-cu-co-van-va-nghien-cuu-nguoi-dung.md) | Thư mời, gói giới thiệu, thỏa thuận cố vấn mẫu · hướng dẫn phỏng vấn theo ban · giao thức thử nghiệm kín nội dung nhạy cảm | — |
| [19-tinh-huong-dieu-hanh-mau.md](19-tinh-huong-dieu-hanh-mau.md) | 48 ca xử lý mẫu cho điều hành viên · mẫu thông báo xử phạt · bài kiểm tra | — |
| [20-thu-vien-loi-hien-thi-an-toan.md](20-thu-vien-loi-hien-thi-an-toan.md) | Chuỗi chính thức: Phẩm căn, Mệnh Cách, Thái Tuế, Vận Mệnh Các, Thời Vận, xin xăm, Đặc Tính, Sổ Công Quá, thông báo | — |
| [21-kich-ban-ung-pho-su-co.md](21-kich-ban-ung-pho-su-co.md) | Công tắc, kịch bản ứng phó ngoài AI (tôn giáo, khủng hoảng, dữ liệu, MMO, cửa hàng, pháp lý, báo chí, hạ tầng), diễn tập | — |
| [22-danh-gia-tac-dong-du-lieu-nhap.md](22-danh-gia-tac-dong-du-lieu-nhap.md) | Bản nháp đánh giá tác động xử lý dữ liệu và chuyển dữ liệu ra nước ngoài | — |
| [23-truy-vet-va-de-xuat-doi-canon.md](23-truy-vet-va-de-xuat-doi-canon.md) | Bảng truy vết 175 rủi ro · 23 đề xuất đổi canon · việc giao cho tập 02–13 và mã nguồn | — |
| [24-dac-ta-ky-thuat-rao-chan.md](24-dac-ta-ky-thuat-rao-chan.md) | Đặc tả mô-đun `src/game/safety/*`, điểm gắn vào mã, hàng đợi báo cáo, giới hạn kết nối, lệnh kiểm thử mới | — |
| [25-ho-so-noi-dung-g1-nhap.md](25-ho-so-noi-dung-g1-nhap.md) | Bản nháp phần nội dung hồ sơ phê duyệt kịch bản trò chơi G1 | — |
| [26-phieu-rui-ro-theo-vung.md](26-phieu-rui-ro-theo-vung.md) | Một trang rủi ro cho mỗi thánh địa | — |
| [27-canh-mau-an-toan.md](27-canh-mau-an-toan.md) | 16 cảnh kịch bản tham chiếu cho các khoảnh khắc nhạy cảm (nhập ngày sinh, điểm thấp, Khổng tiên sinh, đồng ý AI, Thái Tuế, chẩn đoán đời thực, thẻ khủng hoảng, Tà Lộ, Phong Đô, Miêu Cương, tĩnh tọa, tưởng niệm, vạch trần lừa đảo) | — |
| [28-ke-hoach-trien-khai-tuan-thu.md](28-ke-hoach-trien-khai-tuan-thu.md) | Lịch việc tuân thủ theo tuần M0–M1, theo mốc M2–M6, đường găng | — |

---

## 3. Tóm tắt điều quan trọng nhất

### 3.1 Năm phát hiện từ mã hiện có (sửa ở M0)

1. **Vật thiêng đang được bán, có món khóa sau VIP** (`cosmetics.js`): «Liên Hoa Đài» (tòa sen làm ngự vật), «Bộ Bộ Sinh Liên» (tích Phật đản sinh làm hào quang), «Liên Hoa Quan — mũ của bậc đắc đạo» (VIP · cấp 10), «Bát Quái Pháp Luân» (VIP, trùng tên phong trào bị cấm). → RISK-001, RISK-002; rà đủ 51 món ở 14.07 §5.3.
2. **Trường `title` trong gói `hello` không được lọc** và được phát cho cả phòng — kênh UGC tự do (`protocol.js`). → RISK-122.
3. **Tham số `?server=` được lưu vĩnh viễn** vào `localStorage` — một đường dẫn độc có thể trỏ game tới máy chủ giả (`net.js`). → RISK-129.
4. **Báo cáo MMO lưu `pid` không thời hạn, trần 500/phòng rồi bỏ im lặng, không có màn admin xử lý** (`quan-room.js`). → RISK-093, 109, 123.
5. **VIP quảng cáo «Ngự kiếm ngay, không chờ cấp 8»** trong khi canon gộp ngự kiếm vào cảnh giới bậc 3 — tức bán quyền lợi cảnh giới (`wardrobe-ui.js`). → RISK-134.

Cùng với: token admin trong URL (RISK-124), chưa có lớp phát hiện khủng hoảng trước `askAI` (RISK-037), hai lỗi engine Phụ lục B (RISK-161).

### 3.2 Năm nguyên tắc không thương lượng

1. **Không bán cải mệnh, không bán vật thiêng, không có gacha** (14.03 §4).
2. **Không hướng dẫn bất kỳ nghi thức có hại nào**; Tà Lộ là truyện về cám dỗ và hồi đầu, mọi phép là ký hiệu hư cấu (14.08).
3. **Lá số không quyết định giá trị con người**: ngôn ngữ mô tả, không phán; không công khai điểm Tiên Thiên (14.09, 14.20).
4. **Ngày sinh ở trên máy**; khi hỏi AI thì nói thật rằng bảng tóm tắt đủ suy ra ngày sinh, và hỏi trước (14.12 §2).
5. **Truyền thống nào thì người của truyền thống đó ký**; Tạng truyền khóa tới khi có hội đồng (14.07 §7, 14.06 §6).

### 3.3 Rủi ro điểm cao nhất

RISK-073 (MMO G1 chưa giấy phép, 25) · RISK-001, 012, 037, 053, 074, 091 (20) · 13 rủi ro 16 điểm. Danh sách 20 ưu tiên: 14.04 §5.2. Phân bố: **36 Đỏ · 120 Cam · 19 Xanh**.

---

## 4. Mã định danh mới (đều trong không gian `RISK-*`)

| Mẫu mã | Ý nghĩa | Tệp |
|---|---|---|
| `RISK-001` … `RISK-175` | Mục sổ rủi ro | 01–04 |
| `RISK-G-DG-xx` | Quy tắc chung Đạo giáo | 05 |
| `RISK-G-ZY/QZ/MS/LS/QW/SX/BD/DY/LB/JM/DD/FS-xx` | Quy tắc 12 phái Đạo giáo | 05 |
| `RISK-G-PG/TL/TD/MT/TG-xx` | Phật giáo chung / Trúc Lâm / Tịnh Độ / Mật · Chuẩn Đề / Tạng truyền | 06 |
| `RISK-G-NH/TN/MAU/DT/VT/NL-xx` | Nho / tín ngưỡng Việt / thờ Mẫu / tộc người / vật thiêng / nghi lễ | 07 |
| `RISK-AT-xx`, `AT-Txx` | Quy tắc âm tà, Tà Lộ; ca kiểm | 08 |
| `RISK-MH-xx` | Sức khỏe tinh thần | 09 |
| `RISK-AI-xx` | An toàn AI | 10 |
| `RISK-LG-xx` | Nghĩa vụ pháp lý, nền tảng | 11 |
| `RISK-PV-xx`, `RISK-SEC-xx`, `RISK-MOD-xx` | Riêng tư, bảo mật, điều hành | 12 |
| `RISK-CK-<mốc>-xx`, `RISK-CK-ALL-xx`, `RISK-CK-HF-xx` | Checklist mốc | 13 |
| `RISK-PS-<npc>`, `PS-Txx` | Thẻ an toàn persona; ca kiểm | 14 |
| `RISK-DICT-xx`, `DICT-Txx` | Từ điển, tệp cấu hình an toàn | 15 |
| `RT-xxx`, `CR-xxx`, `MA-xxx` | Đề red-team, khủng hoảng, phải trả lời | 16 (dùng trong không gian `RISK-*` qua tập này) |
| `RISK-DOC-xx` | Văn bản pháp lý | 17 |
| `RISK-ADV-xx`, `RISK-UR-xx` | Cố vấn; nghiên cứu người dùng | 18 |
| `RISK-MODCASE-xx` | Ca điều hành mẫu | 19 |
| `RISK-TXT-<nhóm>-xx`, `TXT-Txx` | Chuỗi hiển thị chính thức | 20 |
| `RISK-PB-xx` | Kịch bản ứng phó | 21 |
| `RISK-DPIA-xx` | Đánh giá tác động dữ liệu | 22 |
| `RISK-TRACE-xx`, `RISK-CANON-xx`, `RISK-REQ-xx` | Truy vết; đề xuất đổi canon; việc giao | 23 |
| `RISK-SPEC-xx` | Đặc tả kỹ thuật rào chắn | 24 |
| `RISK-G1-xx` | Hồ sơ G1 | 25 |
| `RISK-RG-<region>` | Phiếu rủi ro vùng | 26 |
| `RISK-SC-xx` | Cảnh mẫu an toàn | 27 |
| `RISK-WP-xx` | Việc triển khai tuân thủ | 28 |
| Mã vai trò `GĐSX, TND, HĐCV, TAI, TAT, PC, TPH, TMC, TBM, TKT, TCĐ, AD, QA, TT` | Chủ rủi ro | 01 §1.3 |

*Ghi chú:* các mã ca kiểm ngắn (`AT-T`, `PS-T`, `TXT-T`, `DICT-T`, `RT`, `CR`, `MA`) chỉ dùng **bên trong tập 14**; tài liệu khác dẫn chúng kèm tiền tố tập («14.16 RT-053»).

---

## 5. Cách dùng tập này

| Bạn là | Đọc trước | Dùng khi làm việc |
|---|---|---|
| Người viết kịch bản, thoại | 14.05–14.09, 14.20 | Phiếu duyệt 14.07 §8; bảng thay từ 14.09 §2.2 |
| Họa sĩ, level designer | 14.05 §14, 14.06 §7, 14.07 §5, 14.26 | Vùng thiêng 14.24 §9; danh sách «không sinh bằng AI» 14.07 §5.4 |
| Người làm AI | 14.10, 14.14, 14.16 | Thẻ persona; bộ đề; ngưỡng phát hành |
| Kỹ sư máy chủ, client | 14.12, 14.24 | Đặc tả mô-đun; checklist bảo mật 14.12 §7.6 |
| Thiết kế kinh tế | 14.03 §4, 14.11 §7 | Bất biến E1–E6 |
| Phát hành nền tảng | 14.11 §8–§10 | Bảng tính năng × nền tảng; review notes |
| Điều hành cộng đồng | 14.12 §6, 14.19 | Thang xử phạt; 48 ca mẫu |
| Pháp chế | 14.11, 14.17, 14.22, 14.25 | Câu hỏi luật sư 14.11 §13 |
| Giám đốc sản xuất | README, 14.04 §5, 14.13, 14.23 | Cổng mốc; đề xuất đổi canon |

---

## 6. Phụ thuộc với các tập khác

- **Tập này đặt ràng buộc cho:** 03 (Tà Lộ, Hồi III), 04 (chỉ số, Đặc Tính), 05 (công đức, phóng sinh), 06 (persona — 14.14 là chuẩn an toàn), 07–08 (vùng thiêng, vật thiêng), 09 (thở, nghi lễ), 10 (xã hội), 11 (kinh tế), 12 (chuỗi hiển thị), 13 (`TASK-*` cho mọi rào chắn). Chi tiết: 14.23 §3.
- **Tập này cần từ tập khác:** 04 lá số `MAU-C…` (< 28, cách 有救, 特殊) để kiểm thử; 06 thẻ giọng NPC; 13 vị trí chính thức cho `docs/review/`, `safety/`, `test-data/`.

---

## 7. Câu hỏi còn mở (cần quyết định)

1. **Phương án G1** cho MMO ở Việt Nam: A (tắt MMO), B (đối tác), C (tự xin phép) — 14.11 §3.2. Mặc định A.
2. **iOS:** app nghiên cứu cho hỏi AI trong Chart Lab trong khi game tắt AI — thống nhất bảng 14.11 §8.1; có tách game thành sản phẩm riêng trước M4 không (RISK-173)?
3. **Tạng Địa:** có lập được hội đồng trước cuối M3 không; nếu không, chuyển «Tuyết Vực Chuẩn Đề».
4. **Tên cảnh giới** Phật / Nho bậc 2, 6 (RISK-CANON-04) — chờ HĐCV.
5. **NPC trùng nhân vật lịch sử:** Vân Cốc (giữ theo ngoại lệ RISK-AI-30a?), Cát Huyền (đổi tên?), «Trương Thiên Sư» (đổi?).
6. **Đường dây hỗ trợ tâm lý tại Việt Nam:** chưa xác minh số nào ngoài 115, 113; 111 cần xác minh giờ — TAT xác minh trước M0.
7. **Nhà cung cấp AI:** vị trí xử lý, chính sách lưu trữ của z.ai và pool — cần trước khi mở AI công khai.
8. **Dữ liệu app chính** (`vprof` có tên + ngày giờ sinh + IP): ngoài phạm vi game nhưng ảnh hưởng uy tín — đề xuất chủ app thu hẹp.

---

## 8. Lịch sử phiên bản

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| 1.0 | 2026-11-05 | Bản đầu: 28 phần, 175 rủi ro, quy tắc 5 nhóm truyền thống, âm tà, sức khỏe tinh thần, AI, pháp lý, riêng tư, checklist M0–M6 |
