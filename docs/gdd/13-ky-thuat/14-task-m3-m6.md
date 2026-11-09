# 13.14 · Bảng việc M3 – M6 (TASK-176 … TASK-290)

> Quy ước mã, vai, cách ước lượng: xem đầu phần 12.

## M3 — «Yên Tử, Văn Miếu, Mao Sơn, Chung Nam, cảnh giới, Định Mệnh Hội» (6 tuần)

**Tiêu chí đóng mốc:**
1. Bốn thánh địa đạt Định nghĩa Done; Hồi II hoàn chỉnh;
2. Cảnh giới thay cấp làm thang mở khóa (bản sơ đồ tổng §9.1); đa đạo thống ≤ 3; cờ Quy nhất;
3. MMO v2 (AOI, gói gộp) qua bài tải 60 người; biên nhận máy chủ cho án NPC và lễ tập thể;
4. Thiên Bảng hai cột chạy, chốt kỳ Mùng 1/Rằm;
5. Định Mệnh Hội có quầy ở các chợ và chuỗi vạch mặt.

---

### TASK-176 · Cảnh giới làm thang mở khóa
- **Mô tả:** UI cảnh giới trong Sổ Mệnh; gia trì và ngự kiếm mở theo cảnh giới thay vì cấp (ngự kiếm gộp vào bậc 3, bản sơ đồ tổng §9.1); `progress.js` giữ Cấp cho hoạt động hằng ngày.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-023 · **Vai:** CLI
- **Nghiệm thu:** người chơi cũ không mất ngự kiếm đã mở (giữ quyền cũ); người mới mở theo bậc 3.

### TASK-177 · Tên cảnh giới theo đạo
- **Mô tả:** `dao.school` chọn bộ tên Đạo/Phật/Nho (canon §5), đổi trong Cài đặt.
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** TASK-176 · **Vai:** CLI
- **Nghiệm thu:** người tu Phật thấy «Tín Tâm, Quy Y…».

### TASK-178 · Đa đạo thống và Quy nhất
- **Mô tả:** `joinSchool/leaveSchool` tối đa 3; cờ `quyNhat` theo phần 02 §6.3.
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** TASK-091 · **Vai:** CLI
- **Nghiệm thu:** gia nhập thứ 4 bị từ chối kèm thoại NPC; Quy nhất bật đúng điều kiện.

### TASK-179 · Yên Tử: vỏ công trình
- **Mô tả:** Chuỗi chùa Giải Oan, Hoa Yên, Huệ Quang, Chùa Đồng (canon §3) trên 4 bình đài theo độ cao.
- **Ước lượng:** 6 ngày · **Phụ thuộc:** TASK-212 · **Vai:** ART
- **Nghiệm thu:** `validate-assets` xanh; credit ghi sổ.

### TASK-180 · Dựng vùng Yên Tử
- **Mô tả:** Đường hành hương từ chân lên đỉnh, bình đài (`pads`), nội thất chùa Việt.
- **Ước lượng:** 8 ngày · **Phụ thuộc:** TASK-179, TASK-155 · **Vai:** LVL
- **Nghiệm thu:** đi bộ từ chân lên Chùa Đồng không kẹt (`test-building-dod` + `test-nav`).

### TASK-181 · Văn Miếu: vỏ công trình
- **Mô tả:** Khuê Văn Các, nhà bia, Đại Thành điện, giảng đường (theo tài liệu 07).
- **Ước lượng:** 5 ngày · **Phụ thuộc:** TASK-212 · **Vai:** ART
- **Nghiệm thu:** như TASK-179.

### TASK-182 · Dựng vùng Văn Miếu
- **Mô tả:** Phố phẳng, hồ Văn, nội thất bộ Nho môn.
- **Ước lượng:** 7 ngày · **Phụ thuộc:** TASK-181, TASK-187 · **Vai:** LVL
- **Nghiệm thu:** Định nghĩa Done; ngân sách vùng.

### TASK-183 · Mao Sơn: vỏ công trình
- **Mô tả:** Cửu Tiêu Vạn Phúc Cung và quần thể (canon §3).
- **Ước lượng:** 5 ngày · **Phụ thuộc:** TASK-212 · **Vai:** ART
- **Nghiệm thu:** như TASK-179.

### TASK-184 · Dựng vùng Mao Sơn
- **Mô tả:** Đồi thấp nhiều đỉnh, ruộng; nội thất bộ Giang Nam.
- **Ước lượng:** 7 ngày · **Phụ thuộc:** TASK-183, TASK-154 · **Vai:** LVL
- **Nghiệm thu:** như TASK-182.

### TASK-185 · Chung Nam: vỏ công trình
- **Mô tả:** Bạch Vân Quán, Trùng Dương Cung (canon §3).
- **Ước lượng:** 5 ngày · **Phụ thuộc:** TASK-212 · **Vai:** ART
- **Nghiệm thu:** như TASK-179.

### TASK-186 · Dựng vùng Chung Nam
- **Mô tả:** Nội thất bộ «Đạo quán phương Bắc» (dùng lại, phần 10 §9.3 cách giảm 2).
- **Ước lượng:** 7 ngày · **Phụ thuộc:** TASK-185, TASK-084 · **Vai:** LVL
- **Nghiệm thu:** như TASK-182.

### TASK-187 · Bộ mô-đun Nho môn
- **Mô tả:** Án thư thấp, kệ sách tre, bảng vàng, nhà bia (bản sơ đồ tổng §8.3).
- **Ước lượng:** 6 ngày · **Phụ thuộc:** TASK-144 · **Vai:** ART
- **Nghiệm thu:** ≥ 20 mô-đun; atlas.

### TASK-188 · Mini-game khoa cử
- **Mô tả:** Hương thí → hội thí → đình thí; câu hỏi từ `library-data`, `DITIANSUI_MAXIMS`, lá số khách (`cases.js`); đáp án engine.
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-087 · **Vai:** CLI
- **Nghiệm thu:** chấm tất định; Văn Xương +20% (đặc tính) áp đúng.

### TASK-189 · Thiền công án
- **Mô tả:** Nút `aiTalk` với persona Thiền sư (không đáp án đúng; chấm bằng số lần quay lại); thoại thay thế iOS.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-191 · **Vai:** CLI (AI hỗ trợ)
- **Nghiệm thu:** AI không thể hoàn thành nút; điểm theo số phiên, không theo nội dung trả lời.

### TASK-190 · Quầy Định Mệnh Hội
- **Mô tả:** Quầy «đổi mệnh» ở mọi chợ; trò chơi đối chiếu lời phán với lá số thật (`chart`, `taisui`, `anti-manipulation-data`).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-087 · **Vai:** CLI
- **Nghiệm thu:** lời phán sai do engine phát hiện, không viết tay; vạch mặt ghi việc thiện «khuyên thiện».

### TASK-191 · Persona bốn vùng M3
- **Mô tả:** `truclam_thiensu`, `te_tuu`, `maoshan_daonhan` (`sensitive: 'amta'`), `khau_daotruong` (tài liệu 06).
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-048 · **Vai:** CNT
- **Nghiệm thu:** đánh giá 30 câu mỗi persona; Thiền sư không đoán vận.

### TASK-192 · Nhập liệu Hồi II còn lại và nhiệm vụ phụ
- **Mô tả:** `MQ-2-*` phần M3, `SQ-yentu/vanmieu/maoshan/chungnam-*`.
- **Ước lượng:** 8 ngày · **Phụ thuộc:** TASK-162 · **Vai:** CNT
- **Nghiệm thu:** validator + `sim-quests` hết Hồi II.

### TASK-193 · Biên nhận máy chủ
- **Mô tả:** Ký/kiểm SCHEMA-RECEIPT, bảng `receipts`, dùng một lần (phần 04 §6.3).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-096 · **Vai:** SRV
- **Nghiệm thu:** `test-receipt` xanh.

### TASK-194 · `ThienBang` Durable Object
- **Mô tả:** Bảng, `submit`, top N, hạng của tôi, theo đạo thống, `alarm` chốt kỳ âm lịch (phần 04 §7).
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-193 · **Vai:** SRV
- **Nghiệm thu:** `test-thienbang` xanh; truy vấn top ≤ 50 ms.

### TASK-195 · Giao diện Thiên Bảng
- **Mô tả:** Hai cột (Đạo Hạnh chính, Tiên Thiên tách riêng chỉ người bật công khai); cột «đáng tin» của bản thân.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-194 · **Vai:** CLI
- **Nghiệm thu:** không hiện dữ liệu VIP/Ngọc; người tắt công khai không có trong cột Tiên Thiên.

### TASK-196 · Máy chủ chấm án NPC
- **Mô tả:** Xử lý gói `solve` (P3 đã khai báo): sinh lại khách từ hạt giống, chạy `cases.js` trong Worker, trả `graded` + biên nhận (D11).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-193 · **Vai:** SRV
- **Nghiệm thu:** điểm máy chủ khớp client trên 100 án thử; kích thước Worker sau đóng gói trong giới hạn nền tảng.

### TASK-197 · MMO v2: AOI, gói gộp, giới hạn theo loại
- **Mô tả:** Phần 08 §6.1–6.3 (D12).
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-166 · **Vai:** SRV
- **Nghiệm thu:** `test-quan-v2` xanh.

### TASK-198 · Bài tải 60 người trên v2
- **Mô tả:** `load-quan.mjs` với v2; so mốc v1 (TASK-173) (D12, D20).
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** TASK-197, TASK-200 · **Vai:** QA
- **Nghiệm thu:** p95 trễ < 150 ms; thông điệp ra ≤ 500/s ở phòng đầy; khách 61 sang phòng kế.

### TASK-199 · Điểm xuất phát dùng chung
- **Mô tả:** `TownShard` import `court.js › START_M` + `toTile` thay hằng chép tay (D13).
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** TASK-017 · **Vai:** SRV
- **Nghiệm thu:** đổi `START_M` → máy chủ theo, test khớp.

### TASK-200 · Client mạng v2
- **Mô tả:** `hello` có `tok`, `region`, `cv`; xử lý `mvb`, `join/leave` theo AOI; thông báo cập nhật khi máy chủ đòi.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-197 · **Vai:** CLI
- **Nghiệm thu:** E6 xanh với v2.

### TASK-201 · Lễ tập thể và biên nhận có mặt
- **Mô tả:** Chuông sớm/trống chiều, Mùng 1/Rằm: `TownShard` ghi có mặt ≥ 60 s, cấp biên nhận `presence` (phần 08 §6.4).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-193, TASK-197 · **Vai:** SRV (CLI hỗ trợ)
- **Nghiệm thu:** ba tài khoản thử có mặt nhận mục sổ `trust: 'server'`; người rời sớm không nhận.

### TASK-202 · Đồng tu và giải án chung
- **Mô tả:** `inv`, `coop_*` (P3): mời, ghép tối đa 4, từng bước 6 bước luận, điểm chung.
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-197 · **Vai:** SRV (CLI phần client)
- **Nghiệm thu:** hai trình duyệt giải chung một án; điểm ghi cho cả hai.

### TASK-203 · Khung sự kiện lễ tiết
- **Mô tả:** `EV-*` dùng `window` âm lịch; lịch lễ bản sơ đồ tổng §10; xác nhận giờ máy chủ khi thưởng vào Thiên Bảng.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-088 · **Vai:** CLI
- **Nghiệm thu:** `__hq.clock` tới Rằm tháng Giêng mở sự kiện; chỉnh đồng hồ máy không ghi Thiên Bảng.

### TASK-204 · Kiểm V16 trên toàn nội dung
- **Mô tả:** Chạy validator + bot với 4 lớp trên Hồi I–II.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-192 · **Vai:** QA
- **Nghiệm thu:** không lớp nào bị khóa tuyến chính.

### TASK-205 · Công cụ AI mới: `analyze_amta`, tra Đạo Tạng
- **Mô tả:** Thêm vào `AI_TOOLS`/`execTool` (`amta-analyze` có cổng đồng ý; `daozang-data` đã sửa D2); chỉ persona tương ứng được dùng.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-003, TASK-034 · **Vai:** AI
- **Nghiệm thu:** gọi công cụ amta khi chưa đồng ý → trả lỗi thân thiện; tra Đạo Tạng trả tên kinh có thật.

### TASK-206 · Ngâm MMO và đo chi phí Durable Object
- **Mô tả:** 2 giờ với 3 phòng × 30 client; đọc số liệu yêu cầu/thời lượng DO.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-198 · **Vai:** OPS
- **Nghiệm thu:** số liệu đưa vào mô hình chi phí phần 15 §7.

### TASK-207 · Duyệt cố vấn bốn truyền thống
- **Mô tả:** Thiền Trúc Lâm, Nho, Thượng Thanh · Lư Sơn, Toàn Chân · Linh Bảo (tài liệu 14).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-180 … TASK-192 · **Vai:** PRD (OWN ký)
- **Nghiệm thu:** biên bản duyệt.

### TASK-208 · Đo bốn vùng mới
- **Mô tả:** S5 cho 4 vùng; ngâm bộ nhớ đi qua cả 7 thánh địa.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-180 … TASK-186 · **Vai:** QA
- **Nghiệm thu:** ngân sách mid đạt.

### TASK-209 · Bản iOS với vùng mới
- **Mô tả:** Vùng ngoài Huyền Thành tải từ R2 trên iOS; `verify-ios-game` mở rộng; kích thước `dist-ios`.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-133 · **Vai:** QA
- **Nghiệm thu:** `dist-ios` ≤ 120 MB; vùng mới tải được khi có mạng, báo nhẹ khi không.

### TASK-210 · Kiểm phiên âm Hán Việt
- **Mô tả:** Quét `text/vi.json`: chữ Hán phải kèm phiên âm và nghĩa ở lần đầu (canon §1).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-066 · **Vai:** CNT
- **Nghiệm thu:** cảnh báo về 0 cho nội dung M0–M3.

### TASK-211 · Bảng vận hành Durable Object
- **Mô tả:** Số kết nối, phòng đầy, lỗi, độ trễ, số biên nhận/giờ (Workers observability đã bật trong `wrangler.jsonc`).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-197 · **Vai:** OPS
- **Nghiệm thu:** bảng dùng được khi diễn tập sự cố.

### TASK-212 · Credit Meshy cho M3
- **Mô tả:** Mua bổ sung theo sổ credit thực tế M2.
- **Ước lượng:** 0,5 ngày · **Phụ thuộc:** TASK-160 · **Vai:** OWN
- **Nghiệm thu:** số dư đủ 4 vùng + 20% dự phòng trước tuần 1 M3.

### TASK-213 · Cỡ chữ và trợ năng
- **Mô tả:** Ba cỡ chữ cho bảng, thoại; kiểm thứ tự Tab; nhãn `aria`.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** — · **Vai:** CLI
- **Nghiệm thu:** kiểm trợ năng phần 11 §11 không còn lỗi.

### TASK-214 · Nhập liệu chuỗi Định Mệnh Hội
- **Mô tả:** Nhiệm vụ vạch mặt theo tài liệu 03 (phe `dinh_menh_hoi`).
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-190 · **Vai:** CNT
- **Nghiệm thu:** validator + bot.

### TASK-215 · Đóng mốc M3
- **Mô tả:** Kiểm tiêu chí; `validate-ids`; ghi chú; xin duyệt.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** mọi TASK M3 · **Vai:** PRD
- **Nghiệm thu:** tiêu chí M3 đạt; OWN duyệt.

---

## M4 — «Hồi III, Hồi IV: Tà Lộ, Phong Đô, Miêu Cương» (6 tuần)

**Tiêu chí đóng mốc:**
1. Tà Lộ trọn vòng: lời mời → giao kèo → hệ quả lan ra thế giới → hồi đầu tại Phong Đô → danh hiệu «Hồi Đầu»;
2. Nội dung nhạy cảm qua duyệt (bản sơ đồ tổng §14): không nghi thức thật, không miệt thị dân tộc, chỉ mở sau đồng ý;
3. Phong Đô và Miêu Cương đạt Định nghĩa Done;
4. Hồi III, IV chơi hết với 4 lớp.

---

### TASK-216 · Đồng ý tự nguyện cho âm tà và Tà Lộ
- **Mô tả:** Màn xác nhận như app (`amta-data › ETHICS`), lưu `consent.amta`/`tl`, rút lại được; nhiệm vụ `sensitive` lọc theo đồng ý.
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** TASK-088 · **Vai:** CLI
- **Nghiệm thu:** không đồng ý → không thấy lời mời Tà Lộ; NPC dùng thoại thay thế.

### TASK-217 · Nợ Âm và danh hiệu Hồi Đầu
- **Mô tả:** Hiệu ứng `amNo`, ô hiển thị riêng, điều kiện danh hiệu (phần 04 §8).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-091 · **Vai:** CLI
- **Nghiệm thu:** `amNo` chỉ đổi từ nhiệm vụ `kind: 'tl'`; về 0 + chuỗi Phong Đô → danh hiệu.

### TASK-218 · Âm Bài
- **Mô tả:** Hệ số ×2 Hậu Thiên trong 7 ngày game, mỗi lần dùng sinh Nợ Âm, công khai trong Sổ Mệnh (canon §6).
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** TASK-217, TASK-023 · **Vai:** CLI
- **Nghiệm thu:** không có chi phí ẩn; trần ngày Đạo Hạnh vẫn áp (không phá cân bằng).

### TASK-219 · Hệ quả lan ra thế giới
- **Mô tả:** Trạng thái NPC thân quen theo cờ Tà Lộ (Trà Thất có người ốm, khách bỏ về, Thầy Tử Bình không tiếp) (bản sơ đồ tổng §5.5).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-217 · **Vai:** CLI
- **Nghiệm thu:** không phạt chỉ số trực tiếp; hồi đầu khôi phục dần.

### TASK-220 · Phong Đô: vỏ công trình
- **Mô tả:** Theo tài liệu 07 (Phong Đô Trùng Khánh làm nguyên mẫu).
- **Ước lượng:** 6 ngày · **Phụ thuộc:** TASK-212 (hoặc gói M4) · **Vai:** ART
- **Nghiệm thu:** `validate-assets`, cố vấn A9.

### TASK-221 · Dựng vùng Phong Đô
- **Mô tả:** Đồi ven sông, quần thể, đường.
- **Ước lượng:** 8 ngày · **Phụ thuộc:** TASK-220, TASK-223 · **Vai:** LVL
- **Nghiệm thu:** Định nghĩa Done.

### TASK-222 · Phòng túi Âm ty
- **Mô tả:** Án phán quan, gương nghiệt kính, sổ (đọc Sổ Công Quá thật của người chơi), cột xích, đèn ma; trong dải phòng túi.
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-071, TASK-223 · **Vai:** LVL
- **Nghiệm thu:** nội dung không dọa nạt (cố vấn duyệt); sổ hiện đúng mục của người chơi.

### TASK-223 · Bộ mô-đun Âm ty
- **Mô tả:** Theo bản sơ đồ tổng §8.3.
- **Ước lượng:** 5 ngày · **Phụ thuộc:** TASK-144 · **Vai:** ART
- **Nghiệm thu:** ≥ 15 mô-đun; atlas.

### TASK-224 · Miêu Cương: vỏ công trình
- **Mô tả:** Nhà sàn, trại, cổng (Phượng Hoàng cổ thành, trại Tây Giang làm nguyên mẫu).
- **Ước lượng:** 6 ngày · **Phụ thuộc:** gói credit M4 · **Vai:** ART
- **Nghiệm thu:** không có biểu tượng tôn giáo/dân tộc chưa duyệt.

### TASK-225 · Dựng vùng Miêu Cương và ruộng bậc thang
- **Mô tả:** Noise bậc trong vùng (phần 07 §1.3), trại, nội thất.
- **Ước lượng:** 8 ngày · **Phụ thuộc:** TASK-224, TASK-226 · **Vai:** LVL
- **Nghiệm thu:** đi được trên ruộng bậc (bậc ≤ 0,45 m hoặc có dốc).

### TASK-226 · Bộ mô-đun Miêu Cương
- **Mô tả:** Sàn gỗ treo, hỏa đường, kệ bình cổ, khung dệt (bản sơ đồ tổng §8.3).
- **Ước lượng:** 5 ngày · **Phụ thuộc:** TASK-144 · **Vai:** ART
- **Nghiệm thu:** duyệt cố vấn văn hóa.

### TASK-227 · Hang dưới Miêu Cương
- **Mô tả:** Không gian ngầm (ô cổng nhiều lớp hoặc phòng túi) cho Lỗ Ban.
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-076, TASK-077 · **Vai:** LVL
- **Nghiệm thu:** vào/ra không kẹt; ánh sáng đúng ngân sách.

### TASK-228 · Persona và thoại M4
- **Mô tả:** `phan_quan`, `diatang_su`, `vu_y_amau`, `lo_ban_su` (chủ yếu thoại kịch bản; AI chỉ ở phạm vi an toàn).
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-048 · **Vai:** CNT
- **Nghiệm thu:** `forbid` chặn công thức thuốc, câu chú, dọa địa ngục.

### TASK-229 · Nhập liệu Hồi III
- **Mô tả:** `MQ-3-*` (tài liệu 03).
- **Ước lượng:** 8 ngày · **Phụ thuộc:** TASK-192 · **Vai:** CNT
- **Nghiệm thu:** validator + bot.

### TASK-230 · Nhập liệu Hồi IV
- **Mô tả:** `MQ-4-*`.
- **Ước lượng:** 8 ngày · **Phụ thuộc:** TASK-229 · **Vai:** CNT
- **Nghiệm thu:** validator + bot.

### TASK-231 · Nhập liệu chuỗi Tà Lộ
- **Mô tả:** `TL-*`, `sensitive: 'tl'`.
- **Ước lượng:** 5 ngày · **Phụ thuộc:** TASK-216 · **Vai:** CNT
- **Nghiệm thu:** V17; hồi đầu luôn mở được ở mọi điểm (không có điểm không quay lại).

### TASK-232 · Mini-game sám hối nhịp điệu
- **Mô tả:** Tụng/lạy theo nhịp; **bắt buộc** kèm nhiệm vụ sửa sai, không có sám hối chỉ bằng nút (bản sơ đồ tổng §5.4).
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-087 · **Vai:** CLI
- **Nghiệm thu:** validator chặn nhiệm vụ sám hối thiếu nút hành động.

### TASK-233 · Mini-game y dược
- **Mô tả:** Hái thảo theo mùa/hành, sắc thuốc cho NPC theo tạng phủ (`tcm`); không công thức thật, không chẩn bệnh.
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-087 · **Vai:** CLI
- **Nghiệm thu:** cố vấn duyệt văn bản; câu chuyển y tế xuất hiện khi NPC mô tả triệu chứng thật.

### TASK-234 · Bộ lọc nội dung nhạy cảm
- **Mô tả:** Danh sách từ cấm Tà Lộ (nguyên liệu, câu chú, cách làm yểm thuật) cho validator và `postFilter`.
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** TASK-089, TASK-038 · **Vai:** CNT (CLI hỗ trợ)
- **Nghiệm thu:** bộ câu thử bị chặn 100%.

### TASK-235 · Duyệt nội dung nhạy cảm
- **Mô tả:** Cố vấn và chủ dự án duyệt toàn bộ Hồi III–IV, Tà Lộ, Phong Đô, Miêu Cương (bản sơ đồ tổng §14).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-229 … TASK-233 · **Vai:** OWN (PRD tổ chức)
- **Nghiệm thu:** biên bản; mục sửa đóng hết.

### TASK-236 · Sự kiện Trung Nguyên / Vu Lan
- **Mô tả:** Phong Đô mở lối cứu người; thả hoa đăng ở Hồ Sen (đã có).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-203 · **Vai:** CLI (CNT nội dung)
- **Nghiệm thu:** mở đúng 15/7 âm lịch theo giờ máy chủ.

### TASK-237 · Kiểm an toàn khủng hoảng trong nội dung tối
- **Mô tả:** Chạy `test-crisis` với câu thoại người chơi trong ngữ cảnh Tà Lộ/Phong Đô.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-039 · **Vai:** QA
- **Nghiệm thu:** không ca dương tính nào bị bỏ lỡ.

### TASK-238 · Đo Phong Đô, Miêu Cương
- **Mô tả:** S5 hai vùng; hang ngầm.
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** TASK-221, TASK-225 · **Vai:** QA
- **Nghiệm thu:** ngân sách mid.

### TASK-239 · Bot tới hết Hồi IV
- **Mô tả:** `sim-quests` mở rộng, có nhánh Tà Lộ (đồng ý) và không Tà Lộ.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-230, TASK-231 · **Vai:** QA
- **Nghiệm thu:** cả hai nhánh tới cuối Hồi IV.

### TASK-240 · Cảnh cắt
- **Mô tả:** Runtime `CUT-xxx`: đường camera, thoại, bỏ qua được, giảm chuyển động.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-087 · **Vai:** CLI
- **Nghiệm thu:** cảnh cắt không chặn MMO (người khác vẫn thấy nhân vật đứng yên).

### TASK-241 · Nhập liệu cảnh cắt Hồi III–IV
- **Mô tả:** Theo tài liệu 03.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-240 · **Vai:** CNT
- **Nghiệm thu:** mọi `CUT` được tham chiếu đều có dữ liệu.

### TASK-242 · Âm thanh Phong Đô, Miêu Cương
- **Mô tả:** `BGM-*` (gió, giọt nước, tụng siêu độ; khèn, trống đồng).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-172 · **Vai:** CLI
- **Nghiệm thu:** chuyển vùng đúng nhạc.

### TASK-243 · Nhật ký kiểm toán nội dung nhạy cảm
- **Mô tả:** Ghi lại ai duyệt gì, phiên bản nào; lưu cùng `docs/`.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-235 · **Vai:** PRD
- **Nghiệm thu:** truy được người duyệt cho mỗi nhiệm vụ `sensitive`.

### TASK-244 · Quyết định và kiểm Tà Lộ trên iOS
- **Mô tả:** Theo quyết định OWN (câu hỏi mở Q7): tắt hoặc giữ phần «hồi đầu»; cập nhật `features.js` và `verify-ios-game`.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-231 · **Vai:** QA (OWN quyết định)
- **Nghiệm thu:** hành vi iOS khớp quyết định; script xanh.

### TASK-245 · Đóng mốc M4
- **Mô tả:** Kiểm tiêu chí; `validate-ids`; ghi chú; xin duyệt.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** mọi TASK M4 · **Vai:** PRD
- **Nghiệm thu:** tiêu chí M4 đạt; OWN duyệt.

---

## M5 — «Tạng Địa, Côn Lôn, Vĩ thanh, sự kiện máy chủ» (4 tuần)

**Tiêu chí đóng mốc:**
1. Tạng Địa **chỉ** làm khi có tham vấn (canon §3); không có thì dời, không chặn mốc;
2. Côn Lôn mở bằng Quy nhất; Vĩ thanh chơi hết;
3. Một sự kiện máy chủ (sửa cầu đường chung) chạy trọn;
4. Ngâm toàn thế giới 2 giờ không rò rỉ.

---

### TASK-246 · Cổng tham vấn Tạng truyền
- **Mô tả:** Chủ dự án mời cố vấn; quyết định làm/dời Tạng Địa, Lạt-ma Đa Kiệt.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** — · **Vai:** OWN (PRD tổ chức)
- **Nghiệm thu:** văn bản quyết định; nếu dời, TASK-247 … TASK-250, TASK-254 chuyển sang mốc sau.

### TASK-247 · Tạng Địa: vỏ công trình
- **Mô tả:** Theo tài liệu 07 và góp ý cố vấn (Potala, Samye, Jokhang làm nguyên mẫu).
- **Ước lượng:** 6 ngày · **Phụ thuộc:** TASK-246 · **Vai:** ART
- **Nghiệm thu:** A9 có cố vấn Tạng truyền.

### TASK-248 · Dựng vùng Tạng Địa
- **Mô tả:** Cao nguyên lạnh, tuyết cục bộ, nội thất.
- **Ước lượng:** 8 ngày · **Phụ thuộc:** TASK-247, TASK-249 · **Vai:** LVL
- **Nghiệm thu:** Định nghĩa Done.

### TASK-249 · Bộ mô-đun Tạng truyền
- **Mô tả:** Cột vuông bọc vải, phướn, thangka (vẽ mới theo duyệt), đèn bơ, bàn mạn-đà-la.
- **Ước lượng:** 5 ngày · **Phụ thuộc:** TASK-246 · **Vai:** ART
- **Nghiệm thu:** cố vấn duyệt từng mô-đun mang biểu tượng.

### TASK-250 · Mạn-đà-la cát
- **Mô tả:** Mini-game đặt cát đối xứng rồi xóa (vô thường); trong phòng túi.
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-246, TASK-087 · **Vai:** CLI
- **Nghiệm thu:** chạy low 30 khung/giây; không lưu «tác phẩm» (đúng tinh thần xóa).

### TASK-251 · Đảo trời và streaming 3D
- **Mô tả:** `SKY_ISLANDS` (Côn Lôn (0, −900) cao 260 m, Thiên Bàn Đảo có sẵn); vòng tải theo khoảng cách 3D.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-132 · **Vai:** CLI
- **Nghiệm thu:** bay lên thấy đảo tải dần; đứng dưới đất không tải nội thất đảo.

### TASK-252 · Dựng Côn Lôn Thiên Trì
- **Mô tả:** Theo tài liệu 07 (Dao Trì).
- **Ước lượng:** 6 ngày · **Phụ thuộc:** TASK-251 · **Vai:** LVL (ART hỗ trợ)
- **Nghiệm thu:** Định nghĩa Done.

### TASK-253 · Mở Côn Lôn bằng Quy nhất
- **Mô tả:** Điều kiện `quyNhat`; không có đường/trận truyền tống khi chưa đủ (cảnh nền xa).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-178 · **Vai:** CLI
- **Nghiệm thu:** bay ngự kiếm tới gần khi chưa đủ điều kiện bị kết giới chặn nhẹ nhàng (thoại).

### TASK-254 · Persona Lạt-ma Đa Kiệt
- **Mô tả:** Chỉ khi TASK-246 cho phép; `status: approved` do cố vấn ký.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-246 · **Vai:** CNT
- **Nghiệm thu:** không phát hành nếu chưa có chữ ký.

### TASK-255 · Nhập liệu Vĩ thanh
- **Mô tả:** `MQ-E-*`.
- **Ước lượng:** 5 ngày · **Phụ thuộc:** TASK-230 · **Vai:** CNT
- **Nghiệm thu:** bot tới kết thúc.

### TASK-256 · Sự kiện máy chủ «sửa cầu đường»
- **Mô tả:** DO tiến độ toàn máy chủ; đóng góp từ việc thiện đáng tin; cầu/đường trong thế giới đổi trạng thái khi đủ.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-193 · **Vai:** SRV (CLI phần hiển thị)
- **Nghiệm thu:** hai tài khoản cùng góp thấy tiến độ chung; chỉ phần đáng tin được tính.

### TASK-257 · Lập Xuân đổi niên chủ Thái Tuế
- **Mô tả:** Sự kiện Tết, tượng niên chủ mới ở Thái Tuế Điện (web), an Thái Tuế toàn máy chủ.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-203 · **Vai:** CLI (CNT nội dung)
- **Nghiệm thu:** trước/sau Lập Xuân đúng năm can chi (`suiYear`).

### TASK-258 · Các lễ tiết còn lại
- **Mô tả:** Thượng Nguyên, Hạ Nguyên, Trùng Cửu, Phật đản, giỗ Khổng Tử (bản sơ đồ tổng §10).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-203 · **Vai:** CNT
- **Nghiệm thu:** mỗi lễ có `window` đúng; validator xanh.

### TASK-259 · Đo Côn Lôn, Tạng Địa
- **Mô tả:** S5 hai vùng, bay quanh đảo.
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** TASK-248, TASK-252 · **Vai:** QA
- **Nghiệm thu:** ngân sách mid.

### TASK-260 · Ngâm toàn thế giới 2 giờ
- **Mô tả:** Bot đi qua mọi vùng, vào mọi công trình hạng A.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-252 · **Vai:** QA
- **Nghiệm thu:** bộ nhớ ổn định; không mất WebGL context.

### TASK-261 · Tối ưu theo số liệu thật
- **Mô tả:** Dùng sự kiện `perf` (người chơi đồng ý) tìm cảnh/vùng tụt; áp đòn bẩy phần 09 §7.
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-118 · **Vai:** GFX
- **Nghiệm thu:** p95 khung của 3 vùng tệ nhất cải thiện ≥ 15%.

### TASK-262 · Rà soát văn bản toàn bộ
- **Mô tả:** Chính tả, dấu, phiên âm, giọng NPC nhất quán.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-255 · **Vai:** CNT
- **Nghiệm thu:** V19 = 0; danh sách sửa đóng.

### TASK-263 · Duyệt cố vấn Mật/Tạng
- **Mô tả:** Duyệt cuối nội dung Tạng Địa (nếu làm).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-248, TASK-254 · **Vai:** OWN
- **Nghiệm thu:** biên bản.

### TASK-264 · Bot toàn tuyến
- **Mô tả:** `sim-quests` từ `MQ-P` tới `MQ-E` với 5 lá số.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-255 · **Vai:** QA
- **Nghiệm thu:** xanh hằng đêm 7 ngày liên tiếp.

### TASK-265 · Đóng mốc M5
- **Mô tả:** Kiểm tiêu chí; `validate-ids`; ghi chú; xin duyệt.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** mọi TASK M5 · **Vai:** PRD
- **Nghiệm thu:** tiêu chí M5 đạt; OWN duyệt.

---

## M6 — «Môn phái, sư đồ, mùa đầu tiên, thanh toán» (6 tuần)

**Tiêu chí đóng mốc:**
1. Môn phái và sư đồ chạy trên `SectHall`; lễ riêng môn phái;
2. Mùa đầu tiên (niên chủ Thái Tuế, Đạo Lộ mùa thẩm mỹ) mở;
3. Thanh toán (nếu OWN đã có merchant) qua sandbox đầu-cuối; Ngọc do máy chủ quản;
4. Kiểm toán quyền riêng tư đạt; chính sách quyền riêng tư cập nhật;
5. Bài tải 60 người + môn phái đạt.

---

### TASK-266 · Danh mục SKU phía máy chủ
- **Mô tả:** `skus.json` (tài liệu 11 nội dung), đóng gói vào Worker, `test-skus` (phần 08 §5.2) (D14).
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** — · **Vai:** SRV
- **Nghiệm thu:** không SKU nào chạm Đạo Hạnh/cảnh giới/công đức/nhiệm vụ.

### TASK-267 · Ngọc do máy chủ quản
- **Mô tả:** Nhật ký thao tác Ngọc, điểm danh/VIP/quà cấp kiểm ở máy chủ, đối soát chi tiêu offline, trần nhập số dư cũ (phần 08 §5.3).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-096 · **Vai:** SRV (CLI phần client)
- **Nghiệm thu:** `test-ngoc` xanh; sửa `localStorage` không tạo được Ngọc trên máy chủ.

### TASK-268 · Apple In-App Purchase
- **Mô tả:** Plugin StoreKit cho Capacitor, xác minh JWS ở Worker, App Store Server Notifications V2 (phần 08 §5.4).
- **Ước lượng:** 5 ngày · **Phụ thuộc:** TASK-266, TASK-267; OWN có thỏa thuận Paid Apps · **Vai:** SRV (CLI phần app)
- **Nghiệm thu:** sandbox mua → món vào tủ; hoàn tiền sandbox → thu hồi.

### TASK-269 · Stripe Checkout
- **Mô tả:** Phiên thanh toán, webhook ký, lũy đẳng theo `tx`.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-266; OWN có tài khoản Stripe · **Vai:** SRV
- **Nghiệm thu:** khóa thử: mua, hoàn tiền đúng.

### TASK-270 · VNPay
- **Mô tả:** Tạo URL thanh toán, IPN HMAC-SHA512, đối soát.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-266; OWN có merchant VNPay · **Vai:** SRV
- **Nghiệm thu:** môi trường thử VNPay: giao dịch thành công cấp đúng một lần.

### TASK-271 · Thu hồi và hoàn tiền
- **Mô tả:** Gỡ món, xử lý số dư âm, thông báo người chơi.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-268 … TASK-270 · **Vai:** SRV (CLI hỗ trợ)
- **Nghiệm thu:** món đang mặc bị thu hồi → về mặc định; không sập.

### TASK-272 · Kiểm thanh toán đầu-cuối
- **Mô tả:** Kịch bản sandbox ba kênh, gồm mất mạng giữa chừng, webhook đến trước.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-271 · **Vai:** QA
- **Nghiệm thu:** 0 lần cấp trùng, 0 lần mất món đã trả tiền.

### TASK-273 · Kiểm toán quyền riêng tư
- **Mô tả:** Rà mọi đường dữ liệu: phân tích, lưu đám mây, AI, sổ đời thực, MMO; đối chiếu chính sách; xác nhận game không đi qua `logEvent` của app chính (D19).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-118, TASK-099 · **Vai:** OPS (PRD, OWN ký)
- **Nghiệm thu:** báo cáo không có mục mở mức cao.

### TASK-274 · `SectHall` Durable Object
- **Mô tả:** Bảng và API phần 08 §7; migration (OWN duyệt).
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-193 · **Vai:** SRV
- **Nghiệm thu:** `test-sect` xanh.

### TASK-275 · Giao diện môn phái
- **Mô tả:** Gia nhập (một môn phái chính), thông tin, top thành viên, sổ công đức chung, thông báo soạn sẵn.
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-274 · **Vai:** CLI
- **Nghiệm thu:** không có ô nhập văn bản tự do.

### TASK-276 · Đạo tràng nâng cấp
- **Mô tả:** Công trình đạo tràng theo cấp (dữ liệu `hall`), mọi cấp vẫn đi vào được (bản sơ đồ tổng §10).
- **Ước lượng:** 4 ngày · **Phụ thuộc:** TASK-274, TASK-081 · **Vai:** LVL
- **Nghiệm thu:** mỗi cấp đạt Định nghĩa Done.

### TASK-277 · Sư đồ
- **Mô tả:** Xin/nhận đệ tử (sư phụ cảnh giới ≥ 4, tối đa 5), đệ tử xong Mệnh Đồ → biên nhận `mentor` cho sư phụ.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-274, TASK-093 · **Vai:** SRV (CLI hỗ trợ)
- **Nghiệm thu:** đệ tử tự khai báo xong không đủ; cần cờ nhiệm vụ đáng tin.

### TASK-278 · Lễ riêng môn phái
- **Mô tả:** Lịch theo can chi ngày, có mặt → biên nhận.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-201, TASK-274 · **Vai:** SRV (CLI hỗ trợ)
- **Nghiệm thu:** lễ mở đúng ngày can chi; thành viên có mặt nhận mục sổ.

### TASK-279 · Mùa đầu tiên
- **Mô tả:** `SEASON-xx` (tài liệu 11) theo năm can chi; Đạo Lộ mùa thẩm mỹ; Thiên Bảng mùa mới.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-194, TASK-266 · **Vai:** CLI (SRV hỗ trợ)
- **Nghiệm thu:** chuyển mùa không mất dữ liệu; phần thưởng Đạo Lộ chỉ thẩm mỹ.

### TASK-280 · Chốt Thiên Bảng mùa và danh hiệu
- **Mô tả:** DO mùa cũ chỉ đọc; danh hiệu mùa ghi vào vault.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-194 · **Vai:** SRV
- **Nghiệm thu:** danh hiệu hiện trong hồ sơ.

### TASK-281 · Xóa tài khoản trong app
- **Mô tả:** Nút trong Cài đặt gọi `/auth/forget`; giải thích hậu quả (yêu cầu của Apple khi có tạo tài khoản).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-095 · **Vai:** CLI (SRV hỗ trợ)
- **Nghiệm thu:** xóa xong dữ liệu biến mất khỏi vault, Thiên Bảng, môn phái trong 30 ngày.

### TASK-282 · Liên kết Apple (có điều kiện)
- **Mô tả:** Sign in with Apple nếu OWN quyết định cần (câu hỏi mở Q9).
- **Ước lượng:** 3 ngày · **Phụ thuộc:** quyết định OWN · **Vai:** SRV
- **Nghiệm thu:** liên kết/gỡ liên kết; không thu email nếu người dùng ẩn.

### TASK-283 · Bài tải 60 người với môn phái
- **Mô tả:** `load-quan` + yêu cầu `SectHall` song song.
- **Ước lượng:** 1,5 ngày · **Phụ thuộc:** TASK-274 · **Vai:** QA
- **Nghiệm thu:** ngưỡng TASK-198 giữ nguyên.

### TASK-284 · Bảng chỉ số kinh tế
- **Mô tả:** Doanh thu đối soát với bảng `ent`, tỉ lệ hoàn tiền, phân bố SKU.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-272 · **Vai:** OPS
- **Nghiệm thu:** khớp đối soát sandbox.

### TASK-285 · Diễn tập ứng phó sự cố
- **Mô tả:** Diễn tập 3 kịch bản phần 15 §6 (AI sập, DO quá tải, rò rỉ khóa).
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-211 · **Vai:** OPS
- **Nghiệm thu:** thời gian phát hiện và khắc phục ghi lại; runbook cập nhật.

### TASK-286 · Cập nhật chính sách quyền riêng tư
- **Mô tả:** Mô tả tài khoản thiết bị, lưu đám mây, phân tích, thanh toán.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-273 · **Vai:** OWN
- **Nghiệm thu:** đăng ở trang và trong app.

### TASK-287 · Gửi duyệt App Store
- **Mô tả:** Bản iOS có game mở rộng (và IAP nếu có); ghi chú duyệt nhấn mạnh phần học/tu tâm, không bói (4.3(b)).
- **Ước lượng:** 2 ngày · **Phụ thuộc:** TASK-209, TASK-268 (nếu có) · **Vai:** PRD (OWN nộp)
- **Nghiệm thu:** `verify:ios`, `verify:ios-path`, `verify:ios-game` xanh trước khi nộp.

### TASK-288 · Mô phỏng kinh tế với SKU
- **Mô tả:** `sim-economy` thêm người mua/không mua; xác nhận đồ mua không ảnh hưởng Đạo Hạnh.
- **Ước lượng:** 1 ngày · **Phụ thuộc:** TASK-266 · **Vai:** QA
- **Nghiệm thu:** chênh lệch Đạo Hạnh giữa người mua và không mua = 0.

### TASK-289 · Hợp hôn / kết nghĩa giữa hai người chơi
- **Mô tả:** Bàn Hợp Hôn mở rộng: hai người chơi đồng ý so lá số (`hehun`, `nayin-relation`); chỉ trao đổi kết quả, không trao đổi ngày sinh thô.
- **Ước lượng:** 3 ngày · **Phụ thuộc:** TASK-197 · **Vai:** CLI (SRV hỗ trợ)
- **Nghiệm thu:** máy chủ không nhận ngày sinh (tính ở client người khởi xướng sau khi người kia gửi bát tự đã mã hóa đầu-cuối, hoặc tính ở cả hai bên với dữ liệu tự nhập — chọn cách ở ADR).

### TASK-290 · Đóng mốc M6 và phát hành mùa đầu
- **Mô tả:** Kiểm tiêu chí; `validate-ids`; ghi chú phát hành; kế hoạch theo dõi tuần đầu.
- **Ước lượng:** 2 ngày · **Phụ thuộc:** mọi TASK M6 · **Vai:** PRD
- **Nghiệm thu:** tiêu chí M6 đạt; OWN duyệt triển khai.
