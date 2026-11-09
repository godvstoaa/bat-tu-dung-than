# 09 · Tu luyện, cảnh giới và vòng chơi — Huyền Giới · Mệnh Do Ta Tạo

> Tài liệu chi tiết cho phần 9 của bản sơ đồ tổng `docs/GAME-AAA-THIET-KE.md` (kèm §4.7 Tiên Thiên / Hậu Thiên và §5.6 Đạo thống). Tuân thủ canon `docs/gdd/00-KINH-DIEN-CHUNG.md`. Không gian mã được cấp: **`MG-xx`** (mini-game) và **`ACT-xxx`** (hoạt động, gồm độ kiếp `ACT-K<bậc>-<đạo>`).

---

## 1. Phạm vi

| Có trong tài liệu này | Không có (thuộc tài liệu khác) |
|---|---|
| thang 6 bậc cảnh giới × 3 họ × 9 đạo thống; điều kiện, mở khóa, hình ảnh, hợp nhất với `progress.js` | cốt truyện `MQ-*`, `BR-*` (03); chuỗi đạo thống `CQ-*` và việc thiện `DEED-*` (05) |
| 40 độ kiếp văn tu | NPC phụ, persona AI (06) |
| kinh tế Đạo Hạnh: công thức, hệ số, trần, mất – sám hối | công trình, mô-đun nội thất, nhà riêng (07, 08) |
| 24 mini-game spec đủ 14 mục | môn phái, lễ tiết `EV-*` (10) |
| 125 hoạt động | Ngọc, gói bán, Đạo Lộ mùa (11) |
| vòng chơi phiên → mùa, Nhật Khóa, chuỗi mềm, Nguyên Khí | mỹ thuật UI, âm thanh (12) |
| bảng tính và mô phỏng (chạy thật) | lược đồ chính thức, task kỹ thuật (13) |
| bản iOS, đo lường, nghiệm thu | mã rủi ro `RISK-xx` (14) |

---

## 2. Mục lục

| Tệp | Nội dung | Dòng (xấp xỉ) |
|---|---|---|
| `09-01-canh-gioi.md` | thang cảnh giới trên nền `DAO_JIA` + `GAI_LEVELS` + `GAI_XIN`; tên 3 họ × 9 đạo; danh xưng môn hạ; năm điều kiện D1–D5; ngày củng cố; mở khóa (khả năng, vùng, MG, ngự vật, xã hội); hợp nhất `progress.js` (gia trì theo bậc, ân cựu khách); hiệu ứng theo bậc × họ; Sổ Tu; đạo chính / phụ; ca biên | 546 |
| `09-02-do-kiep.md` | khung ba pha Nghệ – Tâm – Hạnh; ba biến thể tâm ma theo `poisonTop`; hộ pháp MMO; 40 độ kiếp (3 cửa bậc 2, 9 đạo × bậc 3–6, `ACT-K6-QN` ở Côn Lôn); kịch bản trọn `ACT-K3-TV` | 604 |
| `09-03-dao-hanh-kinh-te.md` | **chuẩn số liệu**: đơn vị, công thức một lượt, NT, hợp Dụng (hành của 9 đạo), trần ngày, Dư Hương, nguồn ngoài trần, bảng chủ 24 MG, ĐH cho hoạt động đã có trong code, nguồn một lần, công, mất ĐH / Nợ Âm / sám hối, Thiên Bảng, Tu độ, chống gian, khung spec MG, hằng số cho lập trình | 507 |
| `09-04-mg-tinh-tam.md` | `MG-01` … `MG-06`: tĩnh tọa (vòng hơi thở), kết phù năm phần, khoa cử ba trường, Thái Cực, mạn-đà-la cát, tụng kinh / lạy nhịp | 996 |
| `09-05-mg-hoc-nghe.md` | `MG-07` … `MG-12`: bốc thuốc ngũ hành, bố trí dương trạch, trạch nhật, đặt đạo hiệu, công án AI, thư pháp | 1.021 |
| `09-06-mg-nghe-le.md` | `MG-13` … `MG-18`: hái thuốc tứ thời, pha trà thất bộ, luyện đan cửu chuyển (hư cấu), thả đèn, chuông giờ, họa luân | 897 |
| `09-07-mg-hanh-thien.md` | `MG-19` … `MG-24`: bái Đẩu, kinh hành, phóng sinh có trí, đối chất Định Mệnh Hội, sổ nghiệp giải oan, tam chẩn cứu người | 929 |
| `09-08-hoat-dong.md` | 125 hoạt động `ACT-001` … `ACT-125` theo 20 vùng; lịch lễ tuần theo can chi; spec chi tiết 24 hoạt động mới | 544 |
| `09-09-vong-choi.md` | năm tầng vòng chơi; ba phiên mẫu tính số; Nhật Khóa; chuỗi mềm; mốc giờ trong ngày; tuần / tháng âm / mùa / 24 tiết khí; Nguyên Khí (công thức, bảng tiêu – hồi, đường NK một ngày); vắng mặt và quay lại; tích hợp code | 479 |
| `09-10-bang-tinh-mo-phong.md` | mô hình 3 kiểu người chơi; **ngày và giờ tới từng bậc cho TL 20 / 40 / 41 / 60 / 85**; nguồn ĐH; Thiên Bảng 365 ngày; 6 thử nghiệm độ nhạy; đường cong; thô / phút từng MG; bảng mọi trần; Phúc Khí & Cấp; núm vận hành; mã mô phỏng; ra mắt theo mốc M1–M5 | 499 |
| `09-11-ios-nghiem-thu.md` | nguyên tắc iOS; 24 MG và 125 ACT trên iOS; cân bằng web – iOS; thuật ngữ; cờ `TU`; kiểm App Review; từ điển đo lường; chỉ số sức khỏe; nghiệm thu tổng; rủi ro | 286 |
| `09-12-du-lieu-lich-kiem-thu.md` | lịch thật (Sóc / Vọng, lễ 2027, 24 tiết khí 2027, lễ tuần 8 tuần × 9 đạo); lược đồ dữ liệu đề xuất; dữ liệu mẫu; vector kiểm thử `tu.js`; nhật ký mô phỏng 45 ngày `MAU-A` | 364 |
| `09-13-kich-ban-thoai.md` | giọng NPC; 24 cảnh mở MG; 15 cảnh tâm ma chuẩn; 8 kịch bản độ kiếp trọn; lời thầy khi lên bậc (9 đạo × 4 bậc); lời hệ thống Sổ Tu; lời từ chối dạy khách hành hương | 603 |
| `09-14-lo-trinh-dao-thong.md` | lộ trình 9 đạo: Tu độ 4 mức mở gì, 5 chương tu đề xuất, tuần mẫu, hợp lá số; ma trận kết hợp Quy nhất | 306 |
| `09-15-nhap-mon-giao-dien.md` | lịch hé mở 17 khái niệm; bảy ngày đầu; hướng dẫn giờ đầu; HUD điện thoại / máy tính; các trang Sổ Tu; chính sách thông báo; người chơi cũ | 217 |
| `09-16-tu-cung-nhau.md` | tu tập thể MMO: phòng lễ tuần, vai trong lễ, chấm theo nhịp người dẫn, điểm nhóm chỉ cộng; đồng tu; chuông chung và hàng chờ; hộ pháp; sư đồ trong hệ tu; đồng bộ đồng hồ và độ trễ; đại lễ máy chủ | 189 |

Số dòng chính xác: chạy `wc -l docs/gdd/09-tu-luyen/*.md`.

---

## 3. Tóm tắt thiết kế (một trang)

**Cảnh giới.** Sáu bậc canon (Phàm Nhân → Luyện Hư Hợp Đạo / Tín Tâm → Giải Thoát / Học Trò → Thánh Hiền), ngưỡng 0 / 100 / 400 / 1.000 / 2.200 / 4.500. Điểm cảnh giới `0,4 × Tiềm Lực + Đạo Hạnh` ở bậc 1–3, chỉ Đạo Hạnh từ bậc 4. Lên bậc cần đủ năm điều kiện: ngưỡng · ngày củng cố (0 / 3 / 10 / 20 / 30 ngày tu) · công (20 / 60 / 150 cho bậc 4 / 5 / 6) · điều kiện đạo (đạo chính, Tu độ, Quy nhất) · **độ kiếp**. Cảnh giới không bao giờ tụt; Đạo Hạnh có thể giảm khi phạm giới và khôi phục bằng sám hối.

**Độ kiếp.** Năm lần lên bậc ứng năm bước cải tâm `GAI_XIN` (giác → đình → chuyển → tịnh → hóa). Mỗi kiếp ba pha: Nghệ (MG khó hơn) · Tâm (cảnh thoại theo tâm ma mạnh nhất của **lá số**) · Hạnh (giúp người). Không sét, không thua, thử lại sau 20 giờ, không mất gì. Kiếp cuối ở Côn Lôn: ba vị thầy dựng Vân Kiều; Khổng tiên sinh được trả lời lần cuối.

**Kinh tế.** `thô = B × f(s) × K_lặp × K_hư`; `ĐH = min(thô, trần) × NT × K_dụng × K_sung`. NT = `clamp(1 + (60 − TL)/100, 1, 1,5)` (canon). Hợp Dụng ×1,10 (Hỷ ×1,05) theo hành của đạo thống nơi chơi (chốt: CN Hỏa · TV Thủy · TC Thổ · TT Kim · BD Thủy · TH Mộc · TD Kim · MT Thổ · NH Mộc). Trần ngày 25–40 thô; phần dư vào Dư Hương. **Bói không sinh Đạo Hạnh.** Không mua được Đạo Hạnh, cảnh giới, công.

**Mini-game.** 24 MG, mỗi MG ≈ 1 thô / phút khi chơi tốt; sáu nhóm pháp môn (Tĩnh · Thân · Học · Nghệ · Lễ · Hạnh) để tính Nhật Khóa. Mỗi MG dạy một phần engine thật của app (`cultivation-data`, `talisman-data` cấu trúc + ký tự hư cấu, `library-data`, `tcm`, `zhai`, `xuankong`, `fs-cure`, `zheri`, `naming`, `remedy-fate`, `anti-manipulation-data`, …).

**Nhịp (mô phỏng thật).** Người «đều đặn» (≈ 50 phút / ngày, 6 ngày / tuần) TL 60 lên bậc 6 ở **ngày 91 · 65 giờ**; TL 20 ở ngày 77 · 55 giờ. Người «thong thả» TL 60: ngày 197 · 59 giờ; TL 20: ngày 136 · 41 giờ. Người «chuyên tu» mọi TL: ngày 64 · 117 giờ (bị ngày củng cố giữ); lợi thế lá số thấp của họ hiện ở Thiên Bảng (+40% ĐH sau một năm với TL 20).

**Vòng chơi.** Phiên 15–30 phút (việc nặng → nghỉ → việc nhẹ); Nhật Khóa ba nhóm; chuỗi mềm (một ngày nghỉ miễn phí mỗi 7 ngày, vắng lâu chỉ giảm nửa); lễ tuần theo can chi ngày; Sóc / Vọng; mùa đổi ở Lập Xuân; Nguyên Khí là phần thưởng cho việc nghỉ, không phải bức tường.

**iOS.** 17 MG giữ, 6 MG đổi nội dung, 1 MG tắt (`MG-16`); không vận hạn bản thân, không AI, không âm tà; «Độ kiếp» đổi tên «Khảo Đạo». Đạo Hạnh ngang web.

---

## 4. Mã định danh mới

### 4.1 Mini-game `MG-01` … `MG-24`

| Mã | Tên | Mã | Tên |
|---|---|---|---|
| `MG-01` | Tĩnh Tọa Hồi Tức | `MG-13` | Hái Thuốc Tứ Thời |
| `MG-02` | Kết Phù Ngũ Bộ (iOS: Họa Văn Ngũ Bộ) | `MG-14` | Pha Trà Thất Bộ |
| `MG-03` | Khoa Cử Tam Trường | `MG-15` | Luyện Đan Cửu Chuyển |
| `MG-04` | Thái Cực Vân Thủ | `MG-16` | Thả Đèn Hoa Đăng |
| `MG-05` | Mạn-đà-la Cát | `MG-17` | Thần Chung Mộ Cổ |
| `MG-06` | Tụng Kinh · Lạy Nhịp | `MG-18` | Họa Luân Mạn-đà-la |
| `MG-07` | Bốc Thuốc Ngũ Hành | `MG-19` | Bái Đẩu Thất Tinh Đăng |
| `MG-08` | Bố Trí Dương Trạch | `MG-20` | Kinh Hành Bậc Đá |
| `MG-09` | Trạch Nhật Khai Đàn | `MG-21` | Phóng Sinh Đúng Pháp |
| `MG-10` | Đặt Đạo Hiệu | `MG-22` | Đối Chất Định Mệnh Hội |
| `MG-11` | Công Án Vấn Đáp | `MG-23` | Sổ Nghiệp Giải Oan |
| `MG-12` | Thư Pháp Lâm Thiếp | `MG-24` | Tam Chẩn Cứu Người |

### 4.2 Hoạt động `ACT-001` … `ACT-125`

| Dải | Vùng / nhóm |
|---|---|
| `ACT-001` – `ACT-020` | Huyền Thành, Huyền Quán Sơn Môn |
| `ACT-021` – `ACT-030` | bảy vùng sảnh nghề (8 sảnh) + Hương thí + chọn ngày môn phái |
| `ACT-031` – `ACT-040` | Am Vân Cốc, phân đàn ở vùng cũ |
| `ACT-041` – `ACT-050` | định kỳ chung (lễ tuần, đồng tu, Hội thí, Mệnh Đồ, Sóc, Vọng, Đình thí, Thiên Bảng, niên chủ, lễ tiết) |
| `ACT-051` – `ACT-056` | Long Hổ |
| `ACT-057` – `ACT-064` | Võ Đang |
| `ACT-065` – `ACT-070` | Yên Tử |
| `ACT-071` – `ACT-078` | Văn Miếu, Thư Lâu |
| `ACT-079` – `ACT-084` | Bút Tháp |
| `ACT-085` – `ACT-089` | Chung Nam |
| `ACT-090` – `ACT-094` | Mao Sơn |
| `ACT-095` – `ACT-099` | Phong Đô |
| `ACT-100` – `ACT-104` | Tạng Địa (chờ tham vấn) |
| `ACT-105` – `ACT-109` | Miêu Cương |
| `ACT-110` – `ACT-114` | Côn Lôn |
| `ACT-115` – `ACT-125` | xã hội, MMO, xuyên vùng |

### 4.3 Độ kiếp (40 mã, thuộc không gian `ACT-*`)

`ACT-K2-DAO`, `ACT-K2-PHAT`, `ACT-K2-NHO` · `ACT-K3-{CN, TV, TC, TT, BD, TH, TD, MT, NH}` · `ACT-K4-{…9 đạo}` · `ACT-K5-{…9 đạo}` · `ACT-K6-{…9 đạo}` · `ACT-K6-QN`.

### 4.4 Ký hiệu nội bộ (không phải mã toàn cục)

Mã đạo thống hai chữ `CN, TV, TC, TT, BD, TH, TD, MT, NH` (dùng trong dữ liệu và `TRAD_WX`); nhóm pháp môn `tinh, than, hoc, nghe, le, hanh`; mức Tu độ `so, trung, tham, vienthong`. Đây là khóa dữ liệu nội bộ của hệ tu, không phải không gian mã canon.

---

## 5. Phụ thuộc và yêu cầu gửi tài liệu khác

| Tài liệu | Cần chốt / làm | Ở đâu trong 09 |
|---|---|---|
| 03 Cốt truyện | ngân sách 700 thô cho `MQ-*` (phân bổ đề xuất theo hồi); lối cốt truyện vào vùng sớm; Vĩ thanh mở sau bậc 6 hoặc có lối riêng; câu chuyện Lỗ Ban nối `ACT-092`, `MG-22`, `MG-24` | `09-03` §8, `09-01` §6.2, `09-10` §2.4 |
| 05 Cải mệnh | `CQ-<đạo>-01…05` (250 thô / đạo, 5 chương đề xuất ở `09-14`); `DEED-*`; tốc độ công / ngày tương thích điều kiện công (`09-10` §5.5); Tà Lộ / Âm Bài / Nợ Âm; Mệnh Đồ tuần 20 thô | `09-03` §9–§10, `09-14` |
| 06 NPC · AI | `PERSONA-*` cho mọi người dẫn; NPC phụ (người giữ Thái Tuế Điện, ông lang, người bán chim, lão tiều phu…); câu tạp niệm thêm; rà giọng thoại `09-13` | `09-13` |
| 07 Thánh địa | gian phân đàn trong vùng cũ; trai đường, tĩnh thất, trà thất Yên Tử, lò đan, đàn cát Tạng Địa, vườn đào Dao Trì, Vân Kiều | `09-01` §2.2, `09-08` |
| 08 Công trình | nhà riêng và mô-đun đồ đạc cho `MG-08` / `ACT-014`; dựng bếp cho `ACT-K4-TT` | `09-05` MG-08, `09-08` §20.1 |
| 10 Xã hội | môn phái, lễ tiết `EV-*` (≈ 30 thô / lễ, ≈ 240 / năm), sư đồ, kết nghĩa, kiểm duyệt chat | `09-08` §5, `09-09` §4 |
| 11 Kinh tế | xác nhận không bán ĐH / cảnh giới / công / đan; da ngự vật; bù Ngọc iOS nếu cần | `09-03` E1, `09-11` §3.3 |
| 12 Trình bày | `UI-xx` cho HUD, Sổ Tu, 24 MG; `SFX-*` chuông, mõ, sấm xa; hiệu ứng theo bậc × họ | `09-15`, `09-01` §8 |
| 13 Kỹ thuật | module `src/game/tu.js`; máy chủ giữ `state.tu`; tin nhắn MMO mới; `SCHEMA-*` cho dữ liệu MG / ACT / kiếp; bộ mô phỏng vào `scripts/` | `09-12` §2, `09-09` §7 |
| 14 Rủi ro | cấp `RISK-xx` cho bảng rủi ro | `09-11` §11 |

---

## 6. Việc «chưa có — cần làm» trong code (tổng hợp)

| Hạng mục | Mô tả |
|---|---|
| `src/game/tu.js` | module thuần: hằng số `09-03` §14, công thức, trần, Dư Hương, NK tính lười, điều kiện lên bậc, Nhật Khóa, chuỗi mềm |
| `state.js` | khung `tu` trong `createState`; `rollDayTu`; thô cho `recordCase`; chuỗi mềm trong `settleTasks` |
| `progress.js` | `GIATRI.tier`, `tierOf`, `unlocked` theo bậc, gia trì `phaptuong`, migration ân cựu khách |
| `features.js` | cờ `TU` cho iOS |
| `stations.js` | phần pha của `openTra` (`MG-14`), phần làm đèn của `openSen` (`MG-16`), tab Tu trong `openBook` |
| `worker/quan-room.js` | máy chủ giữ `tu`, chấm lại MG, trần, chống gian |
| `net.js`, `protocol.js` | tin nhắn `tu.*` (`09-12` §2.6) |
| `remedy-fate.js` | trường `LIAOFAN_STORY.chapters` (tên bốn thiên) |
| `tcm.js` | export `SHENG` (đề xuất của `09-05`) |
| `naming.js` | export bảng chữ, dữ liệu hành theo chữ, sửa số nét Khang Hy (`09-05`) |
| `zheri.js` | `ACTIVITY.pray` (đề xuất của `09-05`) |
| dữ liệu mới | Huyền Văn 40 ký tự, bảng sát → hành, danh sách thức Thái Cực, nét chữ Hán (kiểm giấy phép), ngân hàng công án, bảng sao bản mệnh, 24 vị thuốc, đan phương, bộ tình huống `MG-21`, `MG-22`, `MG-24`, sổ nghiệp `MG-23` |
| lịch | quy đổi âm lịch Việt (UTC+7) cho Sóc / Vọng / lễ (`09-12` §1.1) |

---

## 7. Câu hỏi mở

1. **Côn Lôn và Vĩ thanh:** Vĩ thanh cốt truyện mở trước hay sau bậc 6? Đề xuất: sau, hoặc lối cốt truyện riêng (`09-10` §2.4).
2. **Tốc độ công thật** (tài liệu 05): nếu < 2,6 công / ngày chơi với người đều đặn, phải hạ điều kiện công bậc 6 (150) để không xóa hệ số Nghịch Thiên.
3. **Trà mở theo số dư Phúc Khí** (`TEAS` dùng `state.phucKhi`): đổi sang `xp`?
4. **Tham vấn Tạng truyền:** giữ Tạng Địa cho đạo `MT` hay chuyển toàn bộ về Am Vân Cốc?
5. **iOS:** có thử App Review cho «Đèn tri ân» và cho Tà Lộ không? Có giữ thần số học (letter numerology) trong `MG-10` không?
6. **Ngày củng cố 20 ngày ở bậc 5** có gây bực cho người đều đặn lá số thấp (chờ ≈ 5 ngày)? Kiểm thử người dùng; phương án 15 ngày.
7. **Lịch âm Việt** (UTC+7) — nguồn chuẩn nào để hiệu chỉnh thư viện (UTC+8)?
8. **Thiên Bảng chung web / iOS** trên một máy chủ MMO hay tách?
9. **Mốc ra mắt cảnh giới:** đưa thang bậc 1–3 và độ kiếp bậc 2–3 (CN, TV, TD) lên M2 thay vì M3, để Đạo Hạnh tích trước không thành «bức tường» (`09-10` §14.2)?
