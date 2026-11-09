# Tài liệu 10 · Xã hội, môn phái và lễ hội

> Thuộc bộ GDD **Huyền Giới · Mệnh Do Ta Tạo** (`docs/gdd/`). Đọc trước: `docs/gdd/00-KINH-DIEN-CHUNG.md` (canon) và `docs/GAME-AAA-THIET-KE.md` §10 (phần sơ đồ mà tài liệu này mở rộng), §5.6, §11, §14.
>
> Không gian tên được cấp (canon §9): **`GUILD-*`**, **`EV-*`**. Sổ mã đầy đủ: Phần 19.

## Phạm vi

Mọi thứ người chơi làm **cùng nhau** trong Huyền Giới:

- **Môn phái** theo 9 đạo thống — hai tầng: **Tông môn** (9 tông, NPC chưởng giáo) và **Chi đường** (nhóm người chơi 8–30 người, có đạo tràng đi vào được, kho, Đạo Vọng, lễ đường, việc tuần, nghị sự).
- **Quan hệ người – người:** sư đồ, đồng tu, kim lan, đạo lữ (hợp hôn bằng engine thật), nhóm đồng hành, đạo hữu.
- **Trao đổi và an toàn:** chống mua bán bằng tiền thật, riêng tư («công khai căn cốt»), ẩn – báo cáo – kiểm duyệt, an toàn trẻ em.
- **Giao tiếp không chat tự do:** 276 cụm từ soạn sẵn, 46 cử chỉ.
- **Thiên Bảng:** 12 bảng, mùa theo năm can chi, chống gian lận.
- **Sự kiện máy chủ:** Thiên Mệnh Bàn (theo bản đồ sát của năm từ engine), sửa cầu đường (19 đường, 156 đoạn), 5 đại lễ; co giãn theo dân số.
- **Lịch lễ tiết** cả năm âm: 51 lễ, tính bằng `lunar-javascript`.
- **Giao thức MMO** bổ sung và **hạ tầng** Durable Object (`SectHall`, `EventHub`) + D1.

## Mục lục

| Phần | Tệp | Nội dung chính | Dòng |
|---|---|---|---|
| 01 | `01-mon-phai-khung-chung.md` | Hai tầng tông môn / chi đường; nhập tông, đạo hiệu (`naming.js`); lập chi đường, bộ ghép danh 1.600 tổ hợp; 7 cấp + 6 chức sự + ma trận quyền; 13 mẫu nghị sự, luật bỏ phiếu, nhiệm kỳ, bất tín nhiệm, vắng mặt, hưu đường; Phường Đạo Tràng, đạo tràng 6 bậc, công trường; kho (không chi cho cá nhân); Đạo Vọng, Âm Chất; lễ tuần 4 pha + biến thể can ngày; việc tuần; giao hảo, Hội Thiện, Luận Đạo Hội, Đàn Tràng Liên Tông (không PvP); 20 ca lạm dụng | ~670 |
| 02 | `02-tong-mon-dao-giao.md` | Năm tông Đạo giáo (CN, TV, TC, TT, BD): thẻ tông, chức sự, chữ tên tu, chuỗi nhập tông có cảnh thoại, tông lễ, đường lễ, 10 việc tuần, 11 công trình, lưu ý tôn trọng, lời chưởng giáo | ~790 |
| 03 | `03-tong-mon-phat-nho.md` | Thiền Trúc Lâm, Tịnh Độ, Chuẩn Đề (⚠ chờ tham vấn), Nho Tịnh Minh; Y Lư Miêu Cương (hội nghề) | ~580 |
| 04 | `04-quan-he-ca-nhan.md` | Sư đồ (công đức thầy có trần), đồng tu (công thức hệ số), kim lan (thứ tự theo tuổi đạo, `partner-match`), đạo lữ (3 chế độ so, thẻ hợp hôn tối thiểu, phân tích lộ dữ liệu), nhóm đồng hành / đoàn, đạo hữu, tìm bạn | ~525 |
| 05 | `05-trao-doi-rieng-tu-an-toan.md` | Chống RMT (phân loại tài sản, quà nhỏ, lì xì «phải cho đi mới có»); hiện trạng gói `hello` lộ Dụng/Hỷ thần qua màu áo; 5 mức công khai căn cốt; dữ liệu tín ngưỡng; 10 lý do báo cáo, bằng chứng có cấu trúc, trọng số tin cậy; kiểm duyệt 5 bậc; nhóm tuổi U13/T/A; phá rối 3D | ~420 |
| 06 | `06-cum-tu-cu-chi.md` | 276 cụm từ (VI + EN, ô chọn), 46 cử chỉ, cử chỉ không làm, bánh xe giao lưu, trần tốc độ, biên tập, tương thích ngược | ~590 |
| 07 | `07-thien-bang.md` | 12 bảng (không xếp Tiên Thiên, không xếp công đức), Tinh Tiến, Giải Tiết Khí, mùa theo Lập Xuân, nguồn điểm xác thực / biên nhận, chống gian lận, thưởng chỉ thẩm mỹ | ~280 |
| 08 | `08-su-kien-may-chu.md` | Thiên Mệnh Bàn 24 sơn hỏng theo `annualTabooOverview` (ví dụ 2027, 2028), hóa giải đúng phép (không động thổ phương kỵ), 4 giai đoạn; sửa cầu đường; 5 đại lễ; bản chơi đơn; công thức co giãn | ~430 |
| 09 | `09-le-tiet-1.md` | Máy lịch (7 kiểu quy tắc, lịch Việt UTC+7, trùng lễ, quy tắc thưởng và tôn trọng); 25 lễ cuối năm cũ → tháng Tư | ~530 |
| 10 | `10-le-tiet-2.md` | 26 lễ tháng Năm → tháng Chạp + Nhà giáo + Sóc Vọng; ngày tổ 9 tông; lịch một năm theo dương lịch | ~480 |
| 11 | `11-giao-thuc-mmo.md` | Danh tính bền (HMAC), thay đổi gói hiện có, hằng số mới, mã lỗi, danh mục gói theo miền (đồng tu, biên nhận, nhóm, đạo hữu – thư – quà, sư đồ – kim lan – đạo lữ, riêng tư, sự kiện, lễ tiết, chi đường), giới hạn tốc độ, mẫu `parseSocial`, ma trận tương thích, 15 test | ~490 |
| 12 | `12-ha-tang-secthall.md` | Kiến trúc; lược đồ D1; `SectHall` (SQLite, alarm, RPC); thay đổi `TownShard`; `EventHub`; riêng tư ở hạ tầng; co giãn (`mvb`); 27 ca lạm dụng; cấu hình `wrangler` | ~510 |
| 13 | `13-kiem-thu-van-hanh.md` | Các lớp test (U, I, AB, L, C, P, N), lộ trình S0–S6, cờ tính năng / công tắc khẩn, vận hành trực tiếp, sổ tay sự cố, chỉ số trụ cột và sức khỏe xã hội | ~330 |
| 14 | `14-chu-giao-dien-xa-hoi.md` | Giọng văn; onboarding MMO; Tri Khách Lầu Danh Bộ; toast, hộp thoại, trạng thái trống, lỗi, nghị sự, Sổ Đường, kiểm duyệt, lời nhắc an toàn, nhãn trình đọc màn hình | ~400 |
| 15 | `15-kich-ban-trai-nghiem.md` | 5 nhân vật thử nghiệm (lá số thấp, người lập đường, thiếu niên, đạo lữ, kẻ khai thác), 30 ca biên, kịch bản QA 45 phút | ~220 |
| 16 | `16-du-lieu-mau.md` | Dữ liệu dạng mã: `guild-data.js`, `rites.js`, `festivals.js` (đủ 52 mục), `emotes.js` (46), hình dạng `phrases.js`, nhóm chỗ đồng tu, việc tuần, Thiên Mệnh Bàn, mạng đường | ~500 |
| 17 | `17-loi-thoai-le-va-npc.md` | Lời mở theo biến thể (45), lời khép theo tháng (108), 52 câu Thiền Thất, 40 câu Vấn Đáp, 30 chuyện lắng nghe, 20 tình huống Giải Oan, câu thường ngày của 9 chưởng giáo | ~400 |
| 18 | `18-noi-dung-le-tiet.md` | 120 câu đố đèn, 30 cặp câu đối Hội Văn, 20 cặp câu đối Tết, danh sách lựa chọn riêng tư, dàn ý 15 truyện Codex | ~330 |
| 19 | `19-so-ma-va-lien-ket.md` | Sổ 339 mã mới; ma trận phụ thuộc với tài liệu 02–14; 10 phát hiện trên code thật | ~240 |
| 20 | `20-kich-ban-le-lon.md` | Kịch bản cảnh ngày tổ 9 tông, Khai Xuân 9 tông, Đại Hội Quy Nhất đầy đủ, mẫu lời mở Thiên Mệnh Bàn sinh từ engine (2027, 2028) | ~330 |

## Tóm tắt các quyết định thiết kế lớn

1. **Môn phái hai tầng.** Tông do NPC dẫn (không ai «làm chưởng môn» một truyền thống tôn giáo có thật); chi đường ≤ 30 người do người chơi tự quản (khớp `GAME-MMO-PROMPT-PLAN.md` «Môn phái ≤ 30 người»).
2. **Không PvP, không chiếm đất, không cướp kho.** Quan hệ liên nhóm chỉ là hợp tác và thi đua có lợi cho cả hai (Hội Thiện xếp theo số chi đường cùng làm).
3. **Kho chi đường không bao giờ chi cho cá nhân**; giải tán thì kho đổ ra đường sá công cộng. Gốc rễ chống gom tài sản và RMT ở cấp nhóm.
4. **Công đức chỉ ghi cho người thật sự làm** (kể cả công đức của thầy là công đức «dạy», có trần).
5. **Không chat tự do**, không tên chi đường / tên tu tự do (ghép từ danh sách) — UGC chỉ còn tên hiển thị.
6. **Riêng tư mặc định kín**: ngày sinh không bao giờ lên mạng; năm mức công khai căn cốt; hợp hôn có chế độ «Giản lược» chỉ lộ 4 mức xếp loại; phân tích cho người chơi thấy thẻ hợp hôn lộ năm sinh thế nào.
7. **Thiên Bảng xếp Hậu Thiên**, không xếp Tiên Thiên, không xếp công đức (chỉ bia ngưỡng tự nguyện + «và N người không ghi tên»); hệ số Nghịch Thiên làm người lá số thấp có lợi thế.
8. **Thiên Mệnh Bàn hỏng theo engine phong thủy thật của năm**, và người chơi hóa giải đúng phép (không động thổ ở Ngũ Hoàng / Tam Sát / Tuế Phá) — mỗi mùa là một bài học khác.
9. **Lễ tiết theo lịch âm thật**, tôn trọng: không bán vật phẩm tôn giáo hay «may mắn», phần tưởng nhớ người thân luôn riêng tư, lễ chưa chắc ngày đánh dấu ⚠ và khóa phát hành tới khi cố vấn xác nhận.
10. **Trẻ em:** U13 không vào MMO; thiếu niên có chế độ an toàn (không kết bạn người lớn lạ, không sư đồ / kim lan khác nhóm tuổi, không đạo lữ).

## Mã định danh mới (tóm tắt — chi tiết Phần 19)

| Nhóm | Số mã | Mẫu |
|---|---|---|
| Tông môn | 10 | `GUILD-CN`, `GUILD-TV`, `GUILD-TC`, `GUILD-TT`, `GUILD-BD`, `GUILD-TH`, `GUILD-TD`, `GUILD-MT`, `GUILD-NH`, `GUILD-BM` (dành sẵn) |
| Chuỗi nhập tông + việc tuần | 99 | `GUILD-Q-<tông>-00…10` |
| Lễ tông + đường lễ | 36 | `GUILD-RITE-<tông>-01…04` |
| Công trình đạo tràng | 99 | `GUILD-DT-<tông>-01…11` |
| Thiên Bảng | 12 | `GUILD-LB-01…12` |
| Quan hệ | 6 | `GUILD-REL-SD`, `-DT`, `-KL`, `-DL`, `-DH`, `-DH2` |
| Lễ tiết | 52 | `EV-TET-01` … `EV-SOCVONG-01` (+ `EV-NIETBAN-01` phụ) |
| Sự kiện máy chủ | 25 | `EV-TMB-xx`, `EV-CAU-01…19`, `EV-DL-01…05` |
| **Tổng** | **339** | |

## Trạng thái so với code hiện có

| Có sẵn (dùng lại) | Chưa có — cần làm |
|---|---|
| `TownShard` (WebSocket Hibernation, ≤ 60 người, 50 phòng), `parseClient`, `cleanName`, `rateGate`, 6 cử chỉ, 8 cụm từ, 3 bồ đoàn Trà Thất, báo cáo, ẩn theo `u` | danh tính bền (HMAC), xử lý `solve / lb / inv / coop` ở máy chủ, `SectHall`, `EventHub`, D1 |
| `computeHehun`, `matchBusinessPartners`, `scanMarriageTiming`, `naming › analyzeName`, `annualTabooOverview`, `yearFlyingStar`, `thaitue.js`, `lunar-javascript` | `hehunFromCards` + tham số mệnh quái tính sẵn; `festivals.js`, `lich-viet.js`, `guild-data.js`, `phrases.js`, `emotes.js`, `zones.js` |
| Cosmetics đồng bộ (`cleanCos`), `state.js › lightLamp`, station `sen`, `huong`, `hophon`, `ROOMS` (Thái Tuế Điện, Đẩu Mẫu Điện, Văn Xương Các, Lão Quân Điện) | sửa `WORLD_TILES` cho Thái Tuế Điện; gói `mvb`; jitter kết nối lại |

## Câu hỏi mở (cần chủ dự án / pháp chế / cố vấn)

1. **Deploy máy chủ MMO** (hiện chỉ chạy `wrangler dev`) và bật D1 + Durable Object mới — chi phí Cloudflare.
2. **Pháp chế:** dữ liệu tông môn có là dữ liệu «quan điểm tôn giáo» theo Nghị định 13/2023 / GDPR không; luật giới hạn giờ chơi của trẻ vị thành niên có áp dụng; luồng phụ huynh cho U13; lì xì có yếu tố ngẫu nhiên.
3. **Cố vấn tôn giáo – văn hóa:** xác nhận ngày các lễ ⚠ (Thiên Sư 18/5, Trương Tam Phong 9/4, Mao Sơn 18/3, Trùng Dương 22/12, Chu Văn An 26/11); toàn bộ `GUILD-MT` và lễ Tạng; Hội Khèn Trăng (Miêu Cương hư cấu).
4. **Khôi phục tài khoản trên web** (email?) khi người chơi mất khóa thiết bị.
5. **Tách phòng theo vùng** khi vượt 3.000 người đồng thời (sau M6).
6. **Cổng Âm tà** của Tĩnh Thất: mức nội dung «trừ tà» cụ thể chờ tài liệu 05/14 chốt.
