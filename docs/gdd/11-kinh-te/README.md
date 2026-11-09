# 11 · KINH TẾ VÀ KIẾM TIỀN CÓ ĐẠO ĐỨC — Huyền Giới · Mệnh Do Ta Tạo

> Tài liệu chi tiết của mục §11 trong `docs/GAME-AAA-THIET-KE.md`. Đọc trước: `docs/gdd/00-KINH-DIEN-CHUNG.md` (kinh điển). Tài liệu này dựa trên code thật: `src/game/cosmetics.js`, `wardrobe-ui.js`, `state.js`, `progress.js`, `features.js`, `main.js`, `protocol.js`, `worker/index.js`, `worker/quan-room.js`, `src/engine/anti-manipulation-data.js` (`RB5`), `src/engine/taisui-general.js`.

---

## Phạm vi

Tiền tệ (Phúc Khí, Ngọc), nguồn và chỗ tiêu, mô phỏng thu nhập; hiến chương những gì được / không được bán và quy trình duyệt SKU; danh mục SKU (51 món hiện có, ~480 món dự kiến qua vùng, lễ, 12 mùa); VIP; Đạo Lộ 12 mùa theo năm Thái Tuế; tích hợp thanh toán (VNPay, MoMo, ZaloPay, Stripe, Apple IAP, Google Play Billing) với quyền lợi phía máy chủ; pháp lý Việt Nam, thuế, hóa đơn, giới hạn tuổi; analytics, KPI, luật A/B; chống gian lận, tranh chấp, khôi phục tài khoản; bản iOS và Android.

**Không thuộc phạm vi:** cốt truyện và thoại chính (03), chỉ số (04), cải mệnh / công đức / Đạo Hạnh (05), kiến trúc mã và lược đồ (13) — tài liệu này chỉ đặt luật tiền và giao diện với các tài liệu đó (phần 20 §3).

---

## Mục lục

| Phần | Tệp | Nội dung |
|---|---|---|
| 01 | `01-hien-chuong-dao-duc.md` | Bốn câu thề; ba vòng tròn hàng hóa (bán được · chỉ tu mới có · lõi); danh sách cấm M / R / T / X; mười vùng xám và phán quyết (Hợp mệnh, bay VIP, lượt AI, ô hồ sơ, nhà, quà tặng, lễ…); bức tường tiền tệ; vùng im lặng thương mại; quy tắc lời văn; quy trình duyệt SKU + 30 câu tự kiểm; người dễ tổn thương |
| 02 | `02-phuc-khi.md` | Phúc Khí: 13 nguồn đúng code, trần ngày (web 212, iOS 197), 22 nguồn dự kiến, 10 nhóm chỗ tiêu, giá kép, nhuộm, trà, nhà, xe trạm, trùng tu, ngân sách ngày «Phúc mãn tắc tổn», ba lỗi kinh tế PK-1…PK-3 |
| 03 | `03-ngoc-mo-phong-lam-phat.md` | Ngọc: hai ví (Tặng / Nạp), nguồn, gói `SKU-P-01..05`, mô phỏng 4 kiểu người chơi theo tuần → năm, chuỗi điểm danh tạm dừng, van chống lạm phát, trần, lịch quay lại món giới hạn |
| 04 | `04-sku-hien-co.md` | 51 món `SKU-E-01..51`, dải giá chuẩn (bậc × ô), lý do giá / bậc từng món, sửa lời văn, rủi ro thiêng (`quan_sen`, `phap_luan`, `dai_sen`, tên VIP), bình giá 5 bộ + `SKU-K-01..06`, tên iOS, lint L1–L12 |
| 05 | `05-sku-vung-thanh-dia.md` | 120 món vùng `SKU-R-*` cho 20 vùng, vòng giữa từng thánh địa, thống kê, bộ câu hỏi cố vấn |
| 06 | `06-sku-le-tiet-tien-ich-nha.md` | 30 món lễ `SKU-F-*`, 27 mục không bán `SKU-A-*`, 12 gói `SKU-B-*`, 8 tiện ích `SKU-U-*`, 44 nội thất `SKU-H-*` (da trên xương miễn phí) |
| 07 | `07-vip-dao-lo.md` | VIP Thượng Khách `SKU-V-01..05`: quyền lợi, vòng đời thuê bao, hủy; Đạo Lộ: chương, Lộ Điểm, Lộ Thư, Lộ Dư, mô phỏng hoàn thành, `SKU-DL-*`, bảng thưởng 30 bậc |
| 08 | `08-mua-season-01-06.md` | `SEASON-01` … `SEASON-06` (2027–2032): chủ đề theo nạp âm và năm can chi, bảng màu, món từng chương |
| 09 | `09-mua-season-07-12.md` | `SEASON-07` … `SEASON-12` (2033–2038), bảng tổng 12 mùa, lịch Tàng Bảo Lục, ngân sách và quy trình làm một mùa |
| 10 | `10-thanh-toan-quyen-loi.md` | Sản phẩm trên từng nền tảng, mã sản phẩm, tài khoản, kiến trúc Két (Durable Object) + D1, API, bảng dữ liệu, luồng VNPay / MoMo / ZaloPay / Stripe / Apple / Google, hoàn tiền, phiếu trang bị MMO, di trú `localStorage`, bảo mật, đối soát |
| 11 | `11-phap-ly-tuoi.md` | Bản đồ nghĩa vụ pháp lý (có cột «độ chắc»), điều kiện trước khi bán, văn bản công khai, ghi nhận doanh thu, dữ liệu cá nhân, giới hạn tuổi và Bảng Phụ Huynh, thuế và hóa đơn |
| 12 | `12-phan-tich-kpi-ab.md` | Nguyên tắc thu thập, từ điển sự kiện, KPI có mục tiêu, chỉ số rào chắn đạo đức, luật A/B (danh sách cấm thử nghiệm) |
| 13 | `13-chong-gian-lan-hoan-tien-tai-khoan.md` | Mô hình đe dọa, luật phát hiện, tranh chấp thanh toán, khôi phục tài khoản, chế tài, mẫu trả lời hỗ trợ, bồi thường |
| 14 | `14-ios-android.md` | Ràng buộc App Store (4.3(b), 3.1.1, 3.1.2, 4.8, 5.1.1), sản phẩm iOS, bảng đổi tên, nhãn quyền riêng tư, xóa tài khoản, bản Android |
| 15 | `15-giao-dien-cua-hang-loi-thoai.md` | Nội dung và trạng thái mọi màn hình kinh tế, lời văn, «Đổi ý trong 10 phút», trợ năng, thoại Thợ May Bà Tư (`tho_may`) |
| 16 | `16-quan-tri-hang-so.md` | Sổ hằng số (code + dự kiến), loại thay đổi A–F, cần gạt khẩn cấp, ma trận trách nhiệm |
| 17 | `17-van-hanh-season-01.md` | Mốc ngày 2027–2028 (tính bằng `lunar-javascript`), chia tuần, kho mẫu Lộ Thư, Lộ Thư 53 tuần, lịch phát hành, giảm giá, thông báo, mốc quyết định mùa thử |
| 18 | `18-kiem-thu-mo-phong-san-xuat.md` | 86 ca kiểm thử, đặc tả công cụ mô phỏng, phân tích độ nhạy, ngân sách sản xuất / hiệu năng món |
| 19 | `19-bang-tra-thanh-toan-doanh-thu.md` | Bảng tra mã trạng thái từng kênh → hành động → lời; mô hình doanh thu – chi phí 3 kịch bản, hòa vốn, độ nhạy |
| 20 | `20-trien-khai-giao-dien-faq.md` | Lộ trình bật kinh tế E0–E6 có cửa kiểm, luật tiền cho hệ xã hội, điểm nối với tài liệu 02–14, hỏi đáp người chơi |
| 21 | `21-dinh-menh-hoi-ta-lo-kinh-te-phan-de.md` | Quầy «đổi mệnh» của Định Mệnh Hội (chỉ Phúc Khí, hàng giả, hoàn trả khi vạch mặt), luật kinh tế của Tà Lộ / Âm Bài |
| 22 | `22-du-lieu-danh-muc-de-xuat.md` | Dữ liệu danh mục sẵn nạp vào `cosmetics.js`: 6 thân bộ, `SETS` dạng nhóm, 120 món vùng và 30 món lễ với `id`, `slot`, `rarity`, `price` (kể cả giá kép), `unlock`, `look` HSV |
| 23 | `23-bang-do-mo-phong-kpi-sql.md` | Bảng dò từng ngày (Phúc Khí, Ngọc, cấp, Hợp mệnh) và từng tuần (Lộ Điểm, Lộ Dư) làm dữ liệu vàng cho kiểm thử; truy vấn SQL tính KPI và chỉ số rào chắn |
| 24 | `24-quoc-te-rui-ro-kinh-te.md` | Nguyên tắc giá theo khu vực, bậc giá khi mở rộng, bản địa hóa kinh tế, sổ 18 rủi ro kinh tế cho tài liệu 14 |

Thứ tự đọc gợi ý: 01 → 02 → 03 → 04 → 07 → 10 → 11 → phần còn lại theo nhu cầu.

---

## Tóm tắt các quyết định chính

1. **Không bán mệnh, không bán may rủi, không bán nỗi sợ, không bán thứ thiêng** (phần 01). Đạo Hạnh, cảnh giới, công đức, Nghiệp, Nợ Âm, Mệnh Đồ, nội dung luận giải, thứ hạng Thiên Bảng không tồn tại dưới dạng vật phẩm. Không gacha. Không lời mời mua trong 10 phút sau màn hình vận mệnh.
2. **Hai tiền tách hẳn:** Phúc Khí (cày) và Ngọc (tặng + nạp) không đổi qua lại; không cái nào đổi ra tiền, Đạo Hạnh, công đức.
3. **Hợp mệnh giữ, nhưng sửa bất công:** bộ Hỏa đang đắt gấp 1,68 lần bộ Mộc cho cùng +10% → bình giá 570 Ngọc / bộ, thêm giá Phúc Khí 2.400 / bộ, hoàn chênh lệch người đã mua.
4. **Bay VIP tách khỏi cảnh giới:** VIP được «Ngự Vân Thường» (bay thấp); «Ngự Kiếm» cao vẫn theo cảnh giới 3.
5. **Hai ví Ngọc**, tiêu Ngọc Tặng trước để bảo vệ người mua khi hoàn tiền.
6. **Một VIP thuê bao**, không bậc VIP theo tổng nạp; hết VIP giữ mọi món.
7. **Đạo Lộ = năm can chi, 4 chương × 30 bậc**; không bán bậc; Lộ Dư bù người bận; người chơi 4 ngày / tuần vừa xong bậc 30; Kim Thư mua được bằng 1.000 Ngọc.
8. **Máy chủ là nguồn sự thật** trước khi thu đồng tiền thật đầu tiên: tài khoản, Két (Durable Object / tài khoản), sổ cái chỉ thêm, quyền lợi, phiếu trang bị MMO.
9. **Trẻ em:** < 16 cần cha mẹ xác nhận, trần 200.000đ / 30 ngày, duyệt từng giao dịch; 16–17 trần 500.000đ, không thuê bao tự gia hạn.
10. **Minh bạch:** «Sổ Quán» mỗi mùa công bố tỷ lệ doanh thu từ 1% người chi nhiều nhất, tỷ lệ hoàn tiền, chi tiêu của tài khoản dưới 18, chênh lệch trả phí giữa người lá số thấp và cao.

---

## Lỗi và rủi ro phát hiện trong code hiện có

| # | Ở đâu | Vấn đề | Phần |
|---|---|---|---|
| 1 | `main.js` gọi `S.titleFor(state.phucKhi)`; `stations.js` mở trà theo `state.phucKhi` | tiêu Phúc Khí làm tụt danh xưng (phát lên MMO) và khóa lại trà → người chơi tích trữ, chỗ tiêu vô dụng | 02 PK-1 |
| 2 | `state.js › grantChart` + `addProfile` | xóa / thêm lại cùng lá số in +10 Phúc Khí vô hạn | 02 PK-2 |
| 3 | `todayStr()`, `cosmetics.js › checkin` dùng giờ máy | đổi đồng hồ để nhận lại thưởng ngày và Ngọc | 02 PK-3, 03 NG-2 |
| 4 | `cosmetics.js › SETS` | giá bộ 570 / 680 / 780 / 960 tùy hành → lá số quyết định giá Hợp mệnh | 01 §4.1, 04 §6 |
| 5 | `recordCase` cộng thưởng Hợp mệnh vào cả `xp` | tiền thật gián tiếp mua cấp (nhỏ) — chấp nhận sau khi có đường Phúc Khí | 01 §4.1, §5.3 |
| 6 | `protocol.js › cleanCos`, `worker/quan-room.js` | MMO hiện mọi món trong danh mục, không kiểm sở hữu | 10 §9 |
| 7 | `cosmetics.js › ITEMS` | tên «Bát Quái Pháp Luân» nhạy cảm; «Liên Hoa Quan» gần mũ nghi lễ Toàn Chân; «Liên Hoa Đài» gần tòa sen tượng Phật; mô tả «trừ tà», «chính tông», «bậc đắc đạo» | 04 §5 |
| 8 | Tên VIP «Chân Nhân» | danh hiệu tu của Đạo giáo, đồng thời là danh xưng NPC tôn kính | 04 §5.5 |
| 9 | `wardrobe-ui.js` | mua ngay khi bấm giá, không xác nhận | 15 §1.4 |
| 10 | `checkin` đứt chuỗi về ngày 1 | người chơi 4 ngày / tuần nhận ít hơn ~2,9 lần Ngọc | 03 NG-1 |

---

## Mã định danh mới (chỉ trong không gian `SKU-*`, `SEASON-*`)

| Mẫu | Phạm vi | Số lượng | Phần |
|---|---|---|---|
| `SKU-E-01` … `SKU-E-51` | 51 món hiện có trong `cosmetics.js` | 51 | 04 |
| `SKU-K-01` … `SKU-K-06` | món thân bộ mới để bình giá | 6 | 04 |
| `SKU-R-<vùng>-NN` | món vùng / thánh địa | 120 | 05 |
| `SKU-F-<lễ>-NN` | món lễ tiết | 30 | 06 |
| `SKU-A-01` … `SKU-A-27` | danh mục **không bán** (vòng giữa, thành tựu) | 27 | 06, 09 |
| `SKU-B-01` … `SKU-B-12` | gói | 12 | 06 |
| `SKU-U-01` … `SKU-U-08` | tiện ích | 8 | 06 |
| `SKU-H-<bộ>-NN` | nội thất nhà riêng | 44 | 06 |
| `SKU-P-01` … `SKU-P-05` | gói Ngọc | 5 | 03 |
| `SKU-V-01` … `SKU-V-05` | VIP | 5 | 07 |
| `SKU-DL-<SEASON-xx>-<XUAN/HA/THU/DONG/NIEN/TANG>` | vé Đạo Lộ | 6 / mùa | 07 |
| `SKU-Sxx-<C>-<Kn/Ln/Nn>` | món mùa (Kim Thư, Thanh Lộ, nội thất) | 479 (gồm 3 quà sự kiện mùa 01) | 08, 09 |
| `SEASON-01` … `SEASON-12` | 12 mùa, 丁未 2027 → 戊午 2038 | 12 | 07, 08, 09 |

Nhãn đánh số **trong phạm vi một phần** (M1…M12, R1…R6, T1…T10, X1…X12, PK-1…3, NG-1…5, V1…V8, B1…B7, DL1…DL10, I1…I6, A1…A6, AB-X1…, G-R…, K-01…K-86, Đ1…Đ7, T-1…T-7, E0…E6, P1…P9) **không** phải mã dùng chung giữa tài liệu; tài liệu khác trích bằng «phần NN §x».

---

## Quyết định cần chủ dự án

| # | Câu hỏi | Đề xuất của tài liệu | Phần |
|---|---|---|---|
| 1 | Đổi tên hiển thị VIP «Chân Nhân» → «Thượng Khách»? | đổi | 04 §5.5 |
| 2 | Đổi tên «Bát Quái Pháp Luân» → «Bát Quái Kim Luân» trước khi bán? | bắt buộc | 04 §5.3 |
| 3 | Pháp nhân nhận Stripe (Stripe không hỗ trợ doanh nghiệp đăng ký tại VN) hay dùng cổng thẻ quốc tế của trung gian VN? | cổng thẻ của trung gian VN cho năm đầu | 11 P4 |
| 4 | Bản Android theo bản web (đủ gian, có AI) hay theo bản iOS? | theo web | 14 §8 |
| 5 | Có trích doanh thu cho quỹ cố vấn truyền thống (`SKU-V-05`, `SKU-B-12`) và / hoặc từ thiện ngoài game? | có quỹ cố vấn; từ thiện làm ngoài game | 01 §4.10, 07 §3.3 |
| 6 | Trang phục dân tộc (Miêu Cương / H'Mông, Tạng): có làm không, điều kiện ghi công / chia sẻ? | chỉ khi có cố vấn cộng đồng và thỏa thuận | 05 §4.7, §4.10 |
| 7 | Công bố doanh thu tuyệt đối hay chỉ tỷ lệ trong «Sổ Quán»? | chỉ tỷ lệ | 15 §9 |
| 8 | Mùa thử SEASON-01 (Xuân, Hạ không bán Kim Thư) có chấp nhận được về doanh thu? | có | 08, 17 |

---

## Thuật ngữ

| Thuật ngữ | Nghĩa trong tài liệu này |
|---|---|
| **Phúc Khí** | tiền cày (`state.phucKhi`); trên iOS «Điểm Tu Học» |
| **`xp`** | Phúc Khí tích lũy cả đời, quyết định cấp |
| **Ngọc Tặng / Ngọc Nạp** | hai ví Ngọc trên máy chủ (phần 03 §2) |
| **Hợp mệnh** | +10% Phúc Khí khi mặc đủ bộ ngũ hành trùng Dụng thần; iOS «Hợp hành» |
| **Thân bộ / tôn bộ** | món bắt buộc giá chuẩn của bộ / món đẹp hơn cùng ô, không bắt buộc |
| **Giá kép** | món có cả giá Ngọc và giá Phúc Khí |
| **Vòng giữa** | thứ chỉ nhận được bằng tu, không bán (`SKU-A-*`) |
| **Vùng im lặng** | 10 phút sau màn hình vận mệnh, cửa hàng không đề cử |
| **Két** | tên làm việc của Durable Object giữ ví và quyền lợi mỗi tài khoản |
| **Đạo Lộ · Thanh Lộ · Kim Thư** | vé mùa · nhánh miễn phí · nhánh trả phí; iOS «Niên Lộ» |
| **Lộ Điểm (LĐ) · Lộ Thư · Lộ Dư · Dư Lộ** | điểm lên bậc · việc tuần · quỹ bù cho người bận · bậc 31–40 |
| **Tàng Bảo Lục** | kho món mùa quay lại sau 24 tháng |
| **Sổ Quán** | báo cáo minh bạch mỗi mùa |
| **Ngự Vân Thường** | bay thấp của VIP / cấp 8, tách khỏi Ngự Kiếm theo cảnh giới |
