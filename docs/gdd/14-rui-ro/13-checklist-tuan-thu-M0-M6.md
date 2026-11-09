# 14.13 · Checklist tuân thủ theo mốc phát hành M0–M6

> Mã: `RISK-CK-<mốc>-xx`. Mỗi mốc có: phạm vi (từ `GAME-AAA-THIET-KE.md` §13.4), **cổng chặn** (rủi ro Đỏ phải ở trạng thái `Đã giảm`), checklist theo nhóm, bằng chứng, người ký.
> Quy tắc: một dòng «Không đạt» thuộc cổng chặn → **không phát hành mốc**. Dòng không thuộc cổng chặn được phép «Chấp nhận có điều kiện» với chủ và hạn, ghi vào sổ rủi ro.
> Bằng chứng lưu ở `docs/review/milestones/<mốc>/` (tài liệu 13 cấp vị trí chính thức).

---

## 0. Checklist dùng chung cho **mọi** lần phát hành (kể cả bản vá)

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-ALL-01 | `npm test`, `npm run test:game`, `npm run test:mmo` đạt | QA | Nhật ký CI |
| RISK-CK-ALL-02 | Bản iOS (nếu có): `npm run verify:ios`, `npm run verify:ios-path` đạt với regex từ cấm mở rộng (tập 14.11 §8.2) | TPH | Nhật ký + ảnh `test-results/ios-*.png` |
| RISK-CK-ALL-03 | Bất biến kinh tế E1–E6 đạt (tập 14.03 §4.3) | TKT | Nhật ký test |
| RISK-CK-ALL-04 | Test mạng: không rò ngày sinh (RISK-PV-02) | QA | Nhật ký Playwright |
| RISK-CK-ALL-05 | Nếu đổi prompt / persona / mô hình: bộ an toàn AI đạt ngưỡng (tập 14.10 §4.5) | TAI | `test-results/ai-safety/*.json` |
| RISK-CK-ALL-06 | Nếu thêm nội dung tín ngưỡng: có phiếu duyệt đã ký (tập 14.07 §8) | TND | Phiếu RV-* |
| RISK-CK-ALL-07 | Nếu đổi giao thức MMO: bảng tập 14.12 §1 và §3.1 cập nhật cùng thay đổi | TMC | Diff tài liệu |
| RISK-CK-ALL-08 | Bảng tính năng × nền tảng (tập 14.11 §8.1) khớp bản build | TPH | Đối chiếu |
| RISK-CK-ALL-09 | Đường dây hỗ trợ xác minh trong 90 ngày (tập 14.09 §5.3) | TAT | `safety/helplines.json › verifiedAt` |
| RISK-CK-ALL-10 | Ghi chú phát hành không chứa từ «bói», «giải hạn», «đổi vận», «cải vận», «trúng» | TT | Văn bản ghi chú |
| RISK-CK-ALL-11 | Sổ rủi ro: rủi ro Đỏ liên quan thay đổi đã cập nhật trạng thái | GĐSX | Sổ rủi ro |

### Checklist bản vá khẩn (hotfix)

| Mã | Việc kiểm |
|---|---|
| RISK-CK-HF-01 | Bản vá chỉ chạm phạm vi sự cố; không thêm tính năng |
| RISK-CK-HF-02 | RISK-CK-ALL-01, 02, 04 đạt |
| RISK-CK-HF-03 | Nếu sự cố AI: bộ an toàn hạng mục liên quan đạt 100% |
| RISK-CK-HF-04 | Biên bản sự cố mở (tập 14.10 §7.5) |
| RISK-CK-HF-05 | Một người khác người sửa duyệt diff |

---

## 1. M0 — Mệnh Bàn, persona AI, Vân Cốc, Khổng tiên sinh, Mở đầu mới (2 tuần)

**Phạm vi:** `menhban.js` (gom chỉ số), màn Mệnh Bàn, `ai.js` persona + `gameContext` + `toolsAllow`, NPC Vân Cốc và Khổng tiên sinh, cảnh Nhập Môn mới (0.1–0.5).

**Cổng chặn (Đỏ phải `Đã giảm`):** RISK-001, RISK-002, RISK-029, RISK-031, RISK-037, RISK-053, RISK-059, RISK-078, RISK-105, RISK-122, RISK-159.

### 1.1 Nội dung và tín ngưỡng

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M0-01 | Danh mục Tàng Y Các đã sửa theo tập 14.07 §5.3 (gỡ `aura_sen`, `dai_sen`; đổi `quan_sen`, `phap_luan`, `aura_set`, `khung_sen`; sửa mô tả `tram_go`, `dao_quan`, `y_tho`, `y_tu`; `phat_tran`, `dao_quan` thôi bán) | AD + TND | Diff `cosmetics.js`; ảnh từng món |
| RISK-CK-M0-02 | Hoàn Ngọc / thay món cho người đã sở hữu món bị gỡ (di trú `wardrobe.owned`) | TMC | Test di trú |
| RISK-CK-M0-03 | Tên «Pháp Luân» không còn ở bất kỳ đâu; thêm vào bộ lọc tên | TND | grep |
| RISK-CK-M0-04 | Khổng tiên sinh tự giới thiệu đúng nguồn Liễu Phàm; codex phân biệt với Khổng Tử (RISK-011) | TND | Kịch bản 0.4 |
| RISK-CK-M0-05 | NPC dùng đạo hiệu / pháp danh hư cấu; tra không trùng người thật (RISK-009, RISK-G-PG-10) | TND | Bảng tra tên |
| RISK-CK-M0-06 | Mọi trích dẫn trong cảnh mở đầu lấy từ kho trích dẫn có nguồn (RISK-026) | TND | Kho `quotes.json` |

### 1.2 An toàn và sức khỏe tinh thần

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M0-10 | Màn Mệnh Bàn dùng bảng thay từ và ánh xạ nhãn (tập 14.09 §2.2, §2.5) | TND + TAT | Ảnh chụp màn với lá số < 28, 28–35, ≥ 86 |
| RISK-CK-M0-11 | Câu dẫn §4.7 hiện ở mọi màn có điểm < 46 | QA | Test UI |
| RISK-CK-M0-12 | Bách phân vị chỉ hiện trong «Vì sao?», kèm hệ số Nghịch Thiên (RISK-031) | QA | Ảnh chụp |
| RISK-CK-M0-13 | Cảnh «Sơn Môn chưa nhận» đã viết lại (RISK-031) | TND | Kịch bản |
| RISK-CK-M0-14 | Cảnh 0.4 + lời Vân Cốc là một khối; mọi đường thoát đi qua thẻ phản đề (RISK-035) | QA | Test kịch bản |
| RISK-CK-M0-15 | Lời phán 0.4 chỉ dùng chủ đề cho phép (không sức khỏe, hôn nhân, tử vong, tai nạn) | TAI + TND | Danh sách chủ đề; 20 lá số thử |
| RISK-CK-M0-16 | Bộ phát hiện khủng hoảng L0 chạy trước khi chọn nguồn trả lời, cả khi không mạng (RISK-037, RISK-163) | TAI + TAT | Bộ khủng hoảng tập 14.09 §8 đạt |
| RISK-CK-M0-17 | Thẻ khủng hoảng, thẻ nhẹ, thẻ RB3 đúng văn bản đã duyệt | TAT | Phiếu duyệt ban SKTT |
| RISK-CK-M0-18 | Đường dây hỗ trợ: 115, 113 + các số đã xác minh; số chưa xác minh không vào build (RISK-039) | TAT | `helplines.json` |
| RISK-CK-M0-19 | Cổng tuổi tại chỗ hoạt động cho chat AI (< 16: chỉ câu gợi ý; 16–17: `minor`) (RISK-040, RISK-069) | QA | Test năm sinh 2012, 2009, 2007 |
| RISK-CK-M0-20 | Cảnh báo động kinh ở màn đầu; hiệu ứng nhấp nháy ≤ 3 lần/giây (tập 14.09 §6.3) | QA | Đo khung hình |

### 1.3 AI

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M0-30 | S0 có phiên bản, đặt trước persona (tập 14.10 §1.1) | TAI | Mã |
| RISK-CK-M0-31 | Thẻ persona Vân Cốc, Khổng tiên sinh đầy đủ trường (tập 14.10 §2.4); phiếu duyệt HĐCV Phật giáo cho Vân Cốc | TAI + HĐCV | Thẻ YAML + phiếu |
| RISK-CK-M0-32 | `gameContext` chỉ mã + số, không tên người chơi, không dữ liệu kinh tế (RISK-055, RISK-056) | TAI | Test chuỗi ngữ cảnh |
| RISK-CK-M0-33 | Bộ lọc đầu ra: trạng thái game, danh xưng thiêng, kinh tế, tất định, âm tà N1–N8 hoạt động (tập 14.10 §1.2) | TAI | Test đơn vị |
| RISK-CK-M0-34 | Bộ red-team ≥ 600 câu; H01, H02, H06, H12 đạt 100%; các hạng mục khác đạt ngưỡng (tập 14.10 §4.5) | TAI | Báo cáo |
| RISK-CK-M0-35 | Bộ «phải trả lời» từ chối < 3% (RISK-061) | TAI | Báo cáo |
| RISK-CK-M0-36 | checkNeo có NEO-6 … NEO-10; Neo trung bình ≥ 90 trên lá số mẫu (RISK-051) | TAI | Báo cáo |
| RISK-CK-M0-37 | Nhãn «AI» cố định ở khung chat; persona nói thật khi bị hỏi «người hay máy» (RISK-070) | QA | Ảnh chụp |
| RISK-CK-M0-38 | Tuyến Nhập Môn chơi xong với `FEATURES.ai = false` (RISK-067) | QA | Test CI |
| RISK-CK-M0-39 | Công tắc `personaKill`, `gameContext` đã có, diễn tập tắt / bật (tập 14.10 §7.4) | TMC | Nhật ký diễn tập |
| RISK-CK-M0-40 | Red-team con người lần 1 (5–10 người) xong, phát hiện đã thành đề (tập 14.10 §4.6) | TAI | Biểu mẫu phát hiện |

### 1.4 Riêng tư, pháp lý

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M0-50 | Thẻ đồng ý AI (tập 14.12 §2.3) có tên nhà cung cấp và nơi xử lý; «hỏi bằng lá số mẫu» hoạt động | PC + QA | Ảnh + test |
| RISK-CK-M0-51 | Bảng nhà cung cấp AI: vị trí, lưu trữ, huấn luyện — PC duyệt (RISK-059) | PC | Bảng |
| RISK-CK-M0-52 | Hồ sơ đánh giá tác động chuyển dữ liệu ra nước ngoài bản nháp (RISK-078) | PC | Hồ sơ |
| RISK-CK-M0-53 | Chính sách quyền riêng tư bản tiếng Việt cập nhật theo bảng tập 14.12 §1; cam kết ngày sinh đúng §2.2 | PC | Văn bản |
| RISK-CK-M0-54 | Game không gọi `/api/event` với nội dung hội thoại, ngày sinh (RISK-071, RISK-111) | TMC | Test tĩnh + mạng |
| RISK-CK-M0-55 | Đã gửi bộ câu hỏi §13 tập 14.11 cho luật sư | PC | Email |

### 1.5 Bảo mật, MMO

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M0-60 | `title` chỉ nhận id danh mục (RISK-122) | TMC | `test-quan-protocol.mjs` |
| RISK-CK-M0-61 | Bộ lọc tên máy chủ: chuẩn hóa + nhóm F1–F9 (tập 14.12 §6.2); ca kiểm ≥ 200 + 200 đạt | TCĐ + TMC | Báo cáo |
| RISK-CK-M0-62 | `?server=` bỏ khỏi bản phát hành; khóa `huyenquan:server` được xóa khi khởi động (RISK-129) | TMC | Test build |
| RISK-CK-M0-63 | Token admin ra khỏi URL; CORS admin hẹp (RISK-124) | TBM | Diff `admin.js` |
| RISK-CK-M0-64 | Khóa AI chuyển sang Worker Secret (RISK-125) | TBM | Cấu hình |

### 1.6 Kinh tế, kỹ thuật

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M0-70 | Bỏ «Ngự kiếm ngay, không chờ cấp 8» khỏi quyền lợi VIP; `unlocked()` không đọc VIP cho quyền lợi gắn cảnh giới (RISK-134) | TKT + TMC | Test E5 |
| RISK-CK-M0-71 | Sửa hai lỗi engine Phụ lục B (RISK-161) | TMC | Test đơn vị lá số có Kiếp Tài |

### 1.7 Ký M0

- [ ] GĐSX · TND · TAT · TAI · PC · TBM · Ban SKTT (HĐCV) · Ban Phật giáo (persona Vân Cốc)

---

## 2. M1 — Sổ Công Quá, Mệnh Đồ, máy nhiệm vụ, Hồi I, nội thất Sơn Môn (4 tuần)

**Cổng chặn:** RISK-003, RISK-040, RISK-077, RISK-133, RISK-153 (đã có cố vấn cho M2), RISK-093.

### 2.1 Nội dung và tín ngưỡng

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M1-01 | Vùng thiêng (`sacredZones`) cho Chính Đường, Chính Điện Tam Thanh, Đẩu Mẫu Điện, Vận Mệnh Các, Thái Tuế Điện, 4 bảo tháp: tắt ngự vật, nhảy, hào quang ồn; chỉ emote `bow`, `palm` (RISK-003) | GĐSX + QA | Video 4 góc mỗi điện |
| RISK-CK-M1-02 | Tượng, hương án không đứng lên được (test A* + va chạm) | QA | Nhật ký test |
| RISK-CK-M1-03 | Thứ tự bày tượng Tam Thanh được cố vấn Đạo giáo xác nhận (RISK-G-DG-04) | HĐCV Đạo giáo | Phiếu |
| RISK-CK-M1-04 | Tàng kinh các (tầng 2 Chính Đường): trích dẫn có nguồn; chú chỉ đọc (RISK-007, RISK-G-DG-21) | TND | Phiếu |
| RISK-CK-M1-05 | Thái Tuế Điện, đèn an Thái Tuế: miễn phí, không chữ «giải hạn» (RISK-016, RISK-G-TN-07) | TND | Ảnh |
| RISK-CK-M1-06 | Túc Nghiệp hiển thị dạng tâm ma, không tên cõi (RISK-023) | QA | Test chuỗi |
| RISK-CK-M1-07 | Mệnh Cấp không hiện công khai; danh hiệu công khai do người chơi chọn (RISK-032) | QA | Test giao thức |
| RISK-CK-M1-08 | Đặc Tính (bảng `shensha-perks.json`) qua checklist tập 14.09 §2.4 (RISK-050) | TND + TAT | Phiếu |
| RISK-CK-M1-09 | Chuỗi «Ba việc thiện đầu tiên» không có việc ác tự động (canon §5.3) | TND | Kịch bản |
| RISK-CK-M1-10 | Sổ đời thực chỉ ghi việc thiện, mặc định tắt, chỉ trên máy (RISK-047, RISK-113) | TMC | Test |

### 2.2 An toàn

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M1-20 | Cổng tuổi mở rộng cho nội dung, nạp tiền, MMO (< 13: chơi đơn) (RISK-040, RISK-080) | QA | Test |
| RISK-CK-M1-21 | Nhắc nghỉ 90 phút; chuỗi điểm danh không reset về 1, có ngày nghỉ (RISK-041) | TKT + QA | Test |
| RISK-CK-M1-22 | Vận Mệnh Các: nhãn «Cần vững», không màu đỏ (tập 14.09 §2.5) | QA | Ảnh |
| RISK-CK-M1-23 | Nguyên Khí mô tả là thể lực, không dùng từ bệnh, tạng (RISK-044) | TND | grep |
| RISK-CK-M1-24 | `src/game/**` không import `tang-data` (RISK-045) | TMC | Test tĩnh |

### 2.3 Pháp lý, riêng tư

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M1-30 | Hồ sơ đánh giá tác động xử lý dữ liệu hoàn thành (RISK-LG-54) | PC | Hồ sơ |
| RISK-CK-M1-31 | Màn «Dữ liệu của tôi»: xem, xuất, nhập, xóa trên máy, rút đồng ý (tập 14.12 §4) | TMC + PC | Test |
| RISK-CK-M1-32 | Quy trình sự cố dữ liệu 72 giờ có người phụ trách, mẫu thông báo (RISK-079) | PC | Văn bản |
| RISK-CK-M1-33 | Thẻ nhắc khi lập hồ sơ người khác (RISK-106) | QA | Ảnh |
| RISK-CK-M1-34 | Nút «Rời quán, xóa dữ liệu trên máy này» xóa đủ khóa (RISK-PV-41) | QA | Test |
| RISK-CK-M1-35 | Sổ cái máy chủ được thiết kế (schema, tập 14.12 §7.3) — chưa bắt buộc triển khai | TMC | Tài liệu 13 |

### 2.4 MMO, điều hành

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M1-40 | Báo cáo chuyển hàng đợi trung tâm có TTL 90 ngày, hạn mức theo người báo (RISK-109, RISK-123) | TMC | Test |
| RISK-CK-M1-41 | Lý do báo cáo mới `groom`, `scam`, `impersonate` (tập 14.12 §6.3) | TMC | Protocol |
| RISK-CK-M1-42 | Hàng đợi admin + thao tác đổi tên / cấm MMO + nhật ký admin (RISK-093) | TMC + TCĐ | Ảnh admin |
| RISK-CK-M1-43 | Liên hệ hỗ trợ hiện trong Sổ Mệnh (dạng văn bản trên iOS) | QA | Ảnh |
| RISK-CK-M1-44 | Điều khoản sử dụng + nội quy cộng đồng chấp nhận trước khi vào MMO | PC | Văn bản + luồng |
| RISK-CK-M1-45 | Giới hạn kết nối WebSocket theo IP, `pid`; hạn `hello` (RISK-121) | TMC | Test tải |
| RISK-CK-M1-46 | MMO cho người chơi ở Việt Nam: theo phương án A (tập 14.11 §3.2) cho tới quyết định khác | PC + GĐSX | Biên bản quyết định |

### 2.5 Kinh tế

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M1-50 | Công đức từ bố thí tính theo lần (≤ 1/ngày) (RISK-133) | TKT | Test E4 |
| RISK-CK-M1-51 | Mô phỏng 30 ngày: người nạp tối đa vs không nạp — Đạo Hạnh chênh ≤ 0 | TKT | Báo cáo mô phỏng |
| RISK-CK-M1-52 | Trường `tags`, `garment` có ở mọi món; test E1 (tập 14.07 §5.2) | TMC | Test |

### 2.6 Sản xuất

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M1-60 | Đã ký thỏa thuận với ban Đạo giáo, Phật giáo Bắc tông, Tín ngưỡng Việt, SKTT (tập 14.07 §7.2) | GĐSX | Thỏa thuận |
| RISK-CK-M1-61 | Tạng truyền: thư ngỏ G0 đã gửi (tập 14.06 §6.5) | GĐSX | Email |
| RISK-CK-M1-62 | Bộ chữ phù hư cấu (≥ 120 nét) đã thiết kế (RISK-008) | AD | Tài sản |

### 2.7 Ký M1

- [ ] GĐSX · TND · TAT · PC · TMC · TCĐ · TKT · HĐCV Đạo giáo · HĐCV Phật giáo

---

## 3. M2 — Long Hổ, Võ Đang, Bút Tháp + Hồi II (6 tuần)

**Cổng chặn:** RISK-006, RISK-008, RISK-017, RISK-019, RISK-043, RISK-074 (nếu chọn phương án B/C: hồ sơ kịch bản sẵn sàng), RISK-156.

### 3.1 Nội dung và tín ngưỡng

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M2-01 | Long Hổ: checklist tập 14.05 §15 cho Chính Nhất, Thần Tiêu; phiếu D1–D6 | TND + HĐCV Đạo giáo | Phiếu |
| RISK-CK-M2-02 | Kết phù dùng bộ chữ hư cấu; tìm ảnh ngược toàn bộ texture phù (RISK-008) | AD | Báo cáo |
| RISK-CK-M2-03 | NPC giữ phủ Long Hổ không mang danh «Thiên Sư đời thứ…» (RISK-G-ZY-10) | TND | Kịch bản |
| RISK-CK-M2-04 | Võ Đang: Thanh Vi, Đan Đỉnh — không lôi pháp tấn công, không chu sa, không tịch cốc (RISK-G-QW-10, RISK-G-DD-10–13) | TND | Phiếu |
| RISK-CK-M2-05 | Kim Điện: vùng thiêng, không đáp lên mái (RISK-G-QW-12) | QA | Test |
| RISK-CK-M2-06 | Bút Tháp: checklist tập 14.06 §9 phần Tịnh Độ + §4.4 (phóng sinh, cúng dường, cầu siêu) | TND + HĐCV Phật giáo | Phiếu |
| RISK-CK-M2-07 | Không mô phỏng chi tiết bảo vật quốc gia; codex «lấy cảm hứng» (RISK-019, RISK-G-TD-14) | AD + PC | Ảnh so sánh |
| RISK-CK-M2-08 | Mini-game lạy, niệm, Thái Cực qua tập 14.07 §6.3 và có prototype cố vấn chơi thử (RISK-006) | GĐSX | Biên bản chơi thử |
| RISK-CK-M2-09 | Tháp Cửu phẩm: mở tầng theo hành trình, không theo ngưỡng công đức; không dùng tên chín phẩm làm danh hiệu (RISK-G-TD-02, RISK-G-TD-10) | TND | Kịch bản |
| RISK-CK-M2-10 | Định Mệnh Hội ở 3 vùng: mỗi án có cặp thầy chân chính đối chiếu (RISK-022) | TND | Kịch bản |
| RISK-CK-M2-11 | Âm thanh tụng niệm, chuông: có thỏa thuận; không phối lại (RISK-025, RISK-158) | GĐSX | Danh mục âm thanh |
| RISK-CK-M2-12 | Tài sản thuộc danh sách «không sinh bằng AI» làm thủ công (tập 14.07 §5.4) | AD | Danh mục tài sản có cột nguồn |
| RISK-CK-M2-13 | Thờ Mẫu (khu phụ chùa): checklist tập 14.07 §3.2 (RISK-015) | TND + HĐCV Tín ngưỡng Việt | Phiếu |

### 3.2 An toàn

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M2-20 | Thông số thở tĩnh tọa theo tập 14.09 §6.2, được người có chuyên môn y tế duyệt (RISK-042) | TAT | Phiếu |
| RISK-CK-M2-21 | Đan dược, dược liệu hư cấu; không trùng vị thuốc thật (RISK-043) | TND | Danh sách đối chiếu |
| RISK-CK-M2-22 | Persona Trương (đạo hiệu mới), Huyền Hư, Diệu Âm: thẻ persona + bộ 40 câu giáo lý do HĐCV soạn đạt (RISK-029) | TAI + HĐCV | Báo cáo |

### 3.3 Pháp lý, nền tảng

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M2-30 | Đã có ý kiến luật sư cho câu hỏi 1–5, 9, 10 (tập 14.11 §13) | PC | Văn bản |
| RISK-CK-M2-31 | Quyết định phương án G1 (A / B / C) bằng văn bản | GĐSX + PC | Biên bản |
| RISK-CK-M2-32 | Nếu B / C: hồ sơ kịch bản theo tập 14.11 §3.3 | PC + TND | Hồ sơ |
| RISK-CK-M2-33 | Tự đánh giá độ tuổi (tập 14.11 §3.4); cổng tuổi khớp | PC + TAT | Bảng |
| RISK-CK-M2-34 | Bản iOS (nếu nộp): §8.4 tập 14.11 đạt; review notes §8.5 cập nhật | TPH | Ảnh + văn bản |

### 3.4 Sản xuất

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M2-40 | Không công trình hạng A–B nào vào build thiếu phiếu duyệt (RISK-156) | GĐSX | Báo cáo CI trường `review` |
| RISK-CK-M2-41 | Ký thỏa thuận ban Nho học, ban Tộc người (cho M3–M4) | GĐSX | Thỏa thuận |
| RISK-CK-M2-42 | Tạng truyền: biên bản G1 hoặc quyết định dự phòng trước cuối M3 (đang theo dõi) | GĐSX | Trạng thái |

### 3.5 Ký M2

- [ ] GĐSX · TND · TAT · TAI · PC · TPH · HĐCV Đạo giáo · HĐCV Phật giáo · HĐCV Tín ngưỡng Việt

---

## 4. M3 — Yên Tử, Văn Miếu, Mao Sơn, Chung Nam + cảnh giới + Định Mệnh Hội (6 tuần)

**Cổng chặn:** RISK-004, RISK-010 (phần thiết kế tên hiển thị Công Thâu Nghiệt), RISK-020, RISK-024, RISK-033, RISK-076 (thiết kế), RISK-120, RISK-134.

### 4.1 Nội dung và tín ngưỡng

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M3-01 | Yên Tử: tam tổ không là NPC, không persona; không ấn chứng; trích dẫn có quyền dùng bản dịch (RISK-G-TL-10–12, RISK-088) | TND + HĐCV Phật giáo | Phiếu |
| RISK-CK-M3-02 | Văn Miếu: «Bảng Vàng Huyền Giới» thay bia Tiến sĩ; văn bia hư cấu (RISK-020, RISK-G-NH-03) | TND + AD | Ảnh |
| RISK-CK-M3-03 | Khổng Tử, Chu Văn An không là NPC; Tế tửu phản biện định mệnh luận (RISK-G-NH-11, RISK-011) | TND | Kịch bản |
| RISK-CK-M3-04 | Mao Sơn: tách khỏi «bùa Mao Sơn»; án trừ tà ba bước; ≥ 50% án kết thúc ở nguyên nhân đời thường (RISK-G-MS-10, RISK-AT-60, AT-61) | TND + HĐCV Đạo giáo | Bảng án |
| RISK-CK-M3-05 | Lư Sơn: chuỗi thu kinh có bước khám bệnh; không nội dung anh linh thai nhi (RISK-G-LS-01, LS-10, LS-13) | TND + TAT | Phiếu |
| RISK-CK-M3-06 | Chung Nam: Toàn Chân giữ giới; giới đàn chỉ quan sát (RISK-G-QZ-10, QZ-12) | TND | Phiếu |
| RISK-CK-M3-07 | Tên cảnh giới hiển thị kèm «(danh xưng trong truyện)»; quyết định HĐCV về «Quy Y», «Giải Thoát», «Thánh Hiền» (RISK-004, RISK-G-PG-21) | TND + HĐCV | Biên bản |
| RISK-CK-M3-08 | Định Mệnh Hội: không mạo danh đền, phủ có thật; án «căn đồng» dạy nhận diện lừa đảo (RISK-G-TN-10, RISK-G-MAU-07) | TND | Kịch bản |
| RISK-CK-M3-09 | Đền Tổ sư Lỗ Ban ở Huyền Thành; phản diện hiển thị là «Công Thâu Nghiệt» (RISK-010) | TND + AD | Ảnh + grep «Lỗ Ban» đứng một mình |

### 4.2 Cảnh giới, Thiên Bảng, kinh tế

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M3-20 | Thiên Bảng công khai chỉ Đạo Hạnh; schema không có cột Tiên Thiên (RISK-033) | TMC + PC | Schema D1 |
| RISK-CK-M3-21 | Đạo Hạnh chỉ tăng qua sự kiện máy chủ; trần tăng mỗi ngày; nhật ký sự kiện (RISK-120) | TMC | Test |
| RISK-CK-M3-22 | Ngự kiếm gắn cảnh giới bậc 3, VIP chỉ thẩm mỹ (RISK-134) | TKT | Test E5 |
| RISK-CK-M3-23 | Mô hình nguồn – tiêu Phúc Khí, Ngọc (RISK-140) | TKT | Bảng |

### 4.3 Tài khoản, pháp lý, riêng tư

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M3-30 | Tài khoản P1 (tùy chọn): xóa trong app, Sign in with Apple, phiên an toàn (RISK-095, RISK-SEC-01–04) | TMC + TPH | Test |
| RISK-CK-M3-31 | Năm sinh tuân thủ tách khỏi ngày sinh lá số (tập 14.12 §5.2) | TMC + PC | Schema |
| RISK-CK-M3-32 | Thiết kế bộ đếm giờ chơi phía máy chủ theo tài khoản (RISK-076) | TMC + PC | Tài liệu 13 |
| RISK-CK-M3-33 | Môn phái lưu `sect_id`; chính sách ghi rõ không thể hiện niềm tin thật (RISK-112) | PC | Chính sách |
| RISK-CK-M3-34 | Đồng bộ danh sách chặn theo tài khoản (tập 14.12 §6.4) | TMC | Test |
| RISK-CK-M3-35 | Huấn luyện điều hành viên (tập 14.12 §6.6); thang xử phạt công khai (RISK-152) | TCĐ | Tài liệu |

### 4.4 Ký M3

- [ ] GĐSX · TND · TAT · PC · TMC · TCĐ · TKT · TPH · HĐCV Đạo giáo · HĐCV Phật giáo · HĐCV Nho học · HĐCV Tín ngưỡng Việt

---

## 5. M4 — Hồi III, IV: Tà Lộ, Phong Đô, Miêu Cương (6 tuần)

**Mốc nhạy cảm nhất.** **Cổng chặn:** RISK-010, RISK-012, RISK-013, RISK-021, RISK-034, RISK-036, RISK-048, RISK-049, RISK-053 (bộ âm tà), RISK-150, RISK-165, RISK-173 (quyết định tách game).

### 5.1 Tà Lộ, âm tà

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M4-01 | Checklist tập 14.08 §4 đạt cho toàn bộ `TL-*`, Phong Đô, Miêu Cương, án trừ tà | TND | Phiếu |
| RISK-CK-M4-02 | Cổng Lớp 1, Lớp 2 đúng văn bản tập 14.08 §2.3; cờ máy chủ `amtaEnabled`, `taLoEnabled` diễn tập tắt | TMC + QA | Nhật ký |
| RISK-CK-M4-03 | Bộ lọc N1–N8 trên toàn bộ thoại `TL-*`: 0 câu bị bắt (AT-T08) | TAI | Báo cáo |
| RISK-CK-M4-04 | Ca kiểm AT-T01 … AT-T12 đạt (tập 14.08 §7) | QA | Báo cáo |
| RISK-CK-M4-05 | Mô phỏng 30 ngày: Tà Lộ + hồi đầu ≤ chính lộ (AT-48) | TKT | Báo cáo |
| RISK-CK-M4-06 | Công Thâu Nghiệt không có persona AI; persona Vu y, Phán quan, Mao Sơn có `forbid` N1–N8 (AT-70, AT-71) | TAI | Thẻ persona |
| RISK-CK-M4-07 | Red-team con người lần 2 tập trung H01, H05, H06 (tập 14.10 §4.6) | TAI | Báo cáo |

### 5.2 Phong Đô

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M4-10 | Cảnh báo trước Quỷ Môn Quan; bích họa mờ; không âm thanh kêu thét (AT-50, AT-51, AT-55) | AD + GĐSX | Video |
| RISK-CK-M4-11 | Nút «Về Sơn Môn» ở mọi điểm (AT-T12, RISK-165) | QA | Test |
| RISK-CK-M4-12 | Phán quan chỉ đọc Sổ Công Quá; không nói người thân thật; không «canh quên» xóa tiến độ (AT-53, AT-54) | TND | Kịch bản |
| RISK-CK-M4-13 | Hắc Bạch Vô Thường, Đầu Trâu Mặt Ngựa không làm vật phẩm, emote, hình dọa (RISK-G-BD-13) | AD | Danh mục |

### 5.3 Miêu Cương, tộc người

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M4-20 | Checklist tập 14.07 §4.4 đạt; cố vấn người H'Mông / Miêu hoặc nhà dân tộc học ký | TND + HĐCV Tộc người | Phiếu |
| RISK-CK-M4-21 | Không 蠱 ở bất kỳ đâu; tên vùng kèm 古寨 (RISK-G-DT-01) | QA | grep chuỗi + ảnh |
| RISK-CK-M4-22 | Kiến trúc Miêu, Đồng tách riêng (RISK-013) | AD | Ảnh + codex |
| RISK-CK-M4-23 | Đồ bạc, trang phục, vải không có giá bán (RISK-G-DT-06) | TKT | Test E1 |

### 5.4 Hồi III, sức khỏe tinh thần

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M4-30 | Hồi III dùng năm can chi, không năm dương lịch; lựa chọn «để sau», «lá số mẫu» (RISK-034) | TND + QA | Kịch bản + ảnh |
| RISK-CK-M4-31 | Hậu quả Tà Lộ báo trước, có thể sửa, không ai chết (AT-40, AT-41, RISK-048) | TND | Kịch bản |
| RISK-CK-M4-32 | Ban SKTT đã đọc toàn bộ Hồi III, IV và ký (RISK-036) | HĐCV SKTT | Phiếu |
| RISK-CK-M4-33 | Cổng tuổi < 16: không lời mời Tà Lộ; Phong Đô bản rút gọn (AT-01) | QA | Test |
| RISK-CK-M4-34 | Thử nghiệm kín với khảo sát cảm xúc sau Hồi III, IV (RISK-034, RISK-048) | TAT | Báo cáo khảo sát |

### 5.5 Cộng đồng, nền tảng, danh tiếng

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M4-40 | Nợ Âm không hiện với người khác; cầu Nại Hà là mời – nhận lời (RISK-150, AT-T05) | TMC | Test |
| RISK-CK-M4-41 | Bản iOS không chứa Tà Lộ, Phong Đô, Miêu Cương (AT-T02) | TPH | `verify:ios` |
| RISK-CK-M4-42 | Quyết định tách game khỏi app nghiên cứu hoặc giữ chung có công tắc độc lập (RISK-173) | GĐSX + TPH | Biên bản |
| RISK-CK-M4-43 | Tuyên bố công khai «mọi phép trong Tà Lộ là ký hiệu hư cấu» trên trang chính thức (RISK-149) | TT | Trang |
| RISK-CK-M4-44 | Tài liệu báo chí sẵn sàng (tập 14.04 §6.1) | TT | Văn bản |

### 5.6 Ký M4

- [ ] GĐSX · TND · TAT · TAI · PC · TPH · TT · HĐCV Đạo giáo · HĐCV Phật giáo (Địa Tạng) · HĐCV Tộc người · HĐCV SKTT

---

## 6. M5 — Tạng Địa (sau tham vấn), Côn Lôn, Vĩ thanh, sự kiện máy chủ (4 tuần)

**Cổng chặn:** RISK-014, RISK-028, RISK-171.

### 6.1 Tạng Địa hoặc dự phòng

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M5-01 | Hoặc: checklist tập 14.06 §6.9 đạt, G1–G4 có biên bản; hoặc: quyết định chuyển «Tuyết Vực Chuẩn Đề» (tập 14.06 §6.8) | GĐSX | Biên bản |
| RISK-CK-M5-02 | Nếu Tạng Địa: mỗi mục RISK-G-TG-01 … 21 có quyết định; không mục «chưa quyết» với hạng mục đã làm | GĐSX + HĐCV Tạng truyền | Bảng |
| RISK-CK-M5-03 | Không nội dung chính trị (lãnh đạo tinh thần, cờ, bản đồ, chuyển thế) (RISK-G-TG-17–19, RISK-171) | TND + PC | Rà soát |
| RISK-CK-M5-04 | Thư mục `tangdia/` mở khóa bằng tệp chữ ký (RISK-014) | TMC | CI |
| RISK-CK-M5-05 | Nếu dự phòng: không dấu hiệu văn hóa Tạng còn sót (cửa sổ khung đen, cờ lungta, chữ Tạng) | AD + QA | Ảnh |

### 6.2 Côn Lôn, Vĩ thanh, sự kiện

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M5-10 | «Quy nhất» trình bày là lựa chọn của nhân vật; có đoạn kết tương đương cho người theo một đạo (RISK-028) | TND + HĐCV | Kịch bản |
| RISK-CK-M5-11 | Sự kiện máy chủ (tổng công đức) là hợp tác, không xếp hạng đạo thống (RISK-143) | GĐSX | Thiết kế |
| RISK-CK-M5-12 | Lễ tiết theo giờ Việt Nam (UTC+7); bảng lễ 10 năm đúng (RISK-166) | TMC | Test |
| RISK-CK-M5-13 | Ngày lễ tôn giáo không có SKU mới (RISK-030) | TKT | Lịch cửa hàng |
| RISK-CK-M5-14 | Ban Phật giáo, Đạo giáo, Nho duyệt chung phần Vĩ thanh (lời Vân Cốc, Thiên Mệnh Bàn) | HĐCV | Phiếu |

### 6.3 Ký M5

- [ ] GĐSX · TND · PC · TKT · HĐCV Tạng truyền (nếu làm) · HĐCV Đạo giáo · HĐCV Phật giáo · HĐCV Nho học

---

## 7. M6 — Môn phái, sư đồ, mùa đầu tiên; kiếm tiền

**Cổng chặn:** RISK-073 (nếu MMO mở ở Việt Nam), RISK-076, RISK-086, RISK-094, RISK-101, RISK-119, RISK-135, RISK-136, RISK-138, RISK-141, RISK-143, RISK-145.

### 7.1 Pháp lý, kiếm tiền

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M6-01 | Nếu MMO mở cho người ở Việt Nam: giấy phép G1 + quyết định phê duyệt kịch bản (hoặc qua đối tác) | PC | Giấy phép |
| RISK-CK-M6-02 | Bộ đếm giờ chơi < 18, xác thực tài khoản theo quy định (RISK-076) | TMC + PC | Test + ý kiến luật sư |
| RISK-CK-M6-03 | Thanh toán: iOS IAP, Android Play Billing, web cổng được cấp phép (RISK-086, RISK-094, RISK-101) | TKT + TPH | Hợp đồng, test |
| RISK-CK-M6-04 | Sổ cái máy chủ cho Ngọc, VIP; đối soát (RISK-119, RISK-141) | TMC | Báo cáo đối soát thử |
| RISK-CK-M6-05 | Điều khoản mua, hoàn tiền, giá VNĐ (tập 14.11 §5.2) | PC | Văn bản + ảnh |
| RISK-CK-M6-06 | Khóa nạp < 18 (RISK-LG-74) | QA | Test |
| RISK-CK-M6-07 | Không SKU ngẫu nhiên; RISK-LG-90 … 93 ghi trong hợp đồng đối tác (nếu có) | TKT + PC | Test E3 + hợp đồng |
| RISK-CK-M6-08 | Lượt AI không bán lẻ; VIP cùng chất lượng (RISK-138) | TKT + TAI | Test |
| RISK-CK-M6-09 | Cửa hàng không đọc dữ liệu lá số, Thời Vận (RISK-136, E6) | TMC | Test tĩnh |
| RISK-CK-M6-10 | Đạo Lộ mùa: đường miễn phí, món quay lại, không gắn lễ tôn giáo (RISK-137) | TKT | Thiết kế mùa |
| RISK-CK-M6-11 | Kế toán – thuế sẵn sàng (RISK-087) | GĐSX | Hợp đồng kế toán |
| RISK-CK-M6-12 | Quy tắc quảng cáo (tập 14.11 §5.1) áp cho chiến dịch mùa đầu | TT + PC | Duyệt chiến dịch |

### 7.2 Xã hội: môn phái, sư đồ, hợp hôn

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M6-20 | Không bảng xếp hạng giữa đạo thống (RISK-143) | GĐSX | Thiết kế |
| RISK-CK-M6-21 | Sư đồ chỉ cùng nhóm tuổi; không trao đổi liên lạc; báo cáo `groom` ưu tiên khẩn (RISK-145, RISK-MOD-23) | TAT + TCĐ | Test |
| RISK-CK-M6-22 | Hợp hôn MMO: tính trên máy chủ, mỗi bên chỉ thấy kết quả chung; không nhãn «khắc»; khóa < 18 (RISK-046, RISK-117) | TMC + TND | Test |
| RISK-CK-M6-23 | Phẩm căn không hiện ở ghép đội (RISK-144) | QA | Ảnh |
| RISK-CK-M6-24 | Thư viện cụm từ mở rộng (≥ 80) qua quy trình tập 14.12 §6.8 (RISK-148) | TCĐ | Danh sách |
| RISK-CK-M6-25 | Kênh cộng đồng chính thức có nội quy, điều hành viên (RISK-148) | TCĐ | Trang |

### 7.3 Vận hành

| Mã | Việc kiểm | Chủ | Bằng chứng |
|---|---|---|---|
| RISK-CK-M6-30 | Tải 60 người / phòng đạt (đã có test) với bộ lọc, báo cáo, giới hạn kết nối bật | TMC | `test-quan-mmo.mjs` |
| RISK-CK-M6-31 | Ngân sách AI ngày, cảnh báo 80% (RISK-066) | TMC | Bảng theo dõi |
| RISK-CK-M6-32 | Diễn tập sự cố dữ liệu (tập 14.12 §8.4) và sự cố AI SEV1 (tập 14.10 §7.3) | TBM + TAI | Biên bản diễn tập |
| RISK-CK-M6-33 | Rà sau phát hành 90 ngày với HĐCV (tập 14.07 §7.4 D7) được lên lịch | GĐSX | Lịch |

### 7.4 Ký M6

- [ ] GĐSX · PC · TKT · TPH · TMC · TCĐ · TAT · TAI · TBM · TT

---

## 8. Ma trận rủi ro Đỏ × mốc chặn

| Rủi ro | M0 | M1 | M2 | M3 | M4 | M5 | M6 |
|---|---|---|---|---|---|---|---|
| RISK-001 Vật thiêng làm đồ thời trang | ■ | | | | | | |
| RISK-002 «Pháp Luân» | ■ | | | | | | |
| RISK-003 Vô lễ không gian thờ | | ■ | | | | | |
| RISK-010 Bôi nhọ Tổ nghề mộc | | | | ■ | ■ | | |
| RISK-012 Định kiến Miêu / H'Mông | | | | | ■ | | |
| RISK-014 Tạng truyền trước tham vấn | (cổng khóa thư mục từ M0) | | | | | ■ | |
| RISK-029 NPC sai giáo lý | ■ | | ■ | ■ | | | |
| RISK-031 Lá số thấp bị phán xét | ■ | | | | | | |
| RISK-034 Năm hạn đời thực | | | | | ■ | | |
| RISK-036 Âm tà và rối loạn tâm thần | | | | | ■ | | |
| RISK-037 Phát hiện tự hại | ■ | | | | | | |
| RISK-039 Đường dây sai | ■ | mọi mốc | | | | | |
| RISK-040 Trẻ em | | ■ | | | | | |
| RISK-043 Tịch cốc, đan dược | | | ■ | | | | |
| RISK-053 Jailbreak yểm | ■ | | | | ■ | | |
| RISK-054 Tất định | ■ | | | | | | |
| RISK-059 Dữ liệu ra nước ngoài | ■ | | | | | | |
| RISK-073 G1 chưa phép | | | | | | | ■ (nếu mở VN) |
| RISK-074 Kịch bản G1 | | | ■ | | | | |
| RISK-076 Giờ chơi, xác thực | | | | ■ (thiết kế) | | | ■ |
| RISK-077 Dữ liệu nhạy cảm | | ■ | | | | | |
| RISK-078 Hồ sơ chuyển dữ liệu | ■ | | | | | | |
| RISK-091 Apple 4.3(b) | mỗi lần nộp | | | | | | |
| RISK-092 Tính năng ẩn | mỗi build iOS | | | | | | |
| RISK-105 Brief suy ra ngày sinh | ■ | | | | | | |
| RISK-119 Tiền tệ phía khách | | | | | | | ■ |
| RISK-122 `title` không lọc | ■ | | | | | | |
| RISK-133 Mua công đức gián tiếp | | ■ | | | | | |
| RISK-134 VIP mở ngự kiếm | ■ (bỏ quảng cáo) | | | ■ | | | |
| RISK-135 Gacha | mọi mốc | | | | | | |
| RISK-153 Thiếu cố vấn | | ■ | | | | | |
| RISK-156 Cắt khâu duyệt | | | ■ | ■ | ■ | ■ | |
| RISK-159 Tự viết tự duyệt | ■ | mọi mốc | | | | | |
| RISK-162 Cờ iOS lọt | mỗi build iOS | | | | | | |
| RISK-168 «Cổ xúy mê tín» | trước mọi công bố | | | | | | |
| RISK-169 Ảnh AI lan truyền | ■ | | | | | | |

■ = mốc mà rủi ro phải ở trạng thái `Đã giảm`.

---

## 9. Mẫu biên bản ký mốc

```
BIÊN BẢN KÝ MỐC · <M0 … M6> · <ngày>
Phiên bản build: ……  Commit: ……
Phạm vi đã phát hành: ……
Cổng chặn: [ ] tất cả đạt   [ ] không đạt (liệt kê → KHÔNG phát hành)
Dòng «Chấp nhận có điều kiện»:
  - RISK-CK-…: chủ ……, hạn ……, lý do ……
Rủi ro mới phát hiện trong mốc: RISK-…
Ký:
  GĐSX ……   PC ……   TAT ……   TND ……   TAI ……   (các vai theo mục «Ký» của mốc)
  HĐCV (ban ……): ……
```
