# 12 · Trình bày — giao diện, âm thanh, camera

> Tài liệu 12 trong bộ GDD «Huyền Giới · Mệnh Do Ta Tạo». Nở từ §12 của bản sơ đồ tổng (`docs/GAME-AAA-THIET-KE.md`), tuân theo canon `docs/gdd/00-KINH-DIEN-CHUNG.md`. Mọi khẳng định về hiện trạng đều đã đối chiếu code trong `src/game/` (markup.js, game.css, main.js, render3d.js, audio.js, haptics.js, stations.js, case-ui.js, master-ui.js, wardrobe-ui.js, vanmenh-ui.js, que-ui.js, cosmetics.js, effects.js, progress.js, protocol.js, world.js, interior.js, textures.js); ví dụ số liệu dùng lá số `MAU-A` đã chạy engine thật.

## Phạm vi

Toàn bộ lớp «trình bày» của game: màn hình và thành phần giao diện (UI), hệ thống thiết kế (chữ, màu, biểu tượng, chuyển động, âm phản hồi, rung), camera, nhạc nền, hiệu ứng âm thanh, lồng tiếng, trộn âm và bản quyền, hiệu ứng hình và ngân sách hiệu năng, bản địa hóa, trợ năng. **Không** thuộc phạm vi: luật chơi mini-game (tài liệu 09), thoại cụ thể (03, 06), công trình (07, 08), giá bán (11), kiến trúc mã (13), rủi ro chính thức (14).

## Mục lục

| Phần | Tệp | Nội dung |
|---|---|---|
| 01 | `01-nguyen-tac-va-khung-giao-dien.md` | 6 nguyên tắc trình bày, lớp z, bố cục dọc 390 × 844 / ngang, điểm gãy, bản đồ điều hướng, 8 ô trạng thái, quy ước câu chữ, quy ước đo lường, mẫu mục UI, khoảng trống hiện trạng |
| 02 | `02-ui-cong-nhap-mon-va-khung-choi.md` | UI-01 → UI-18: tải, cổng, mẫu bát tự, lễ lật trụ, lộ căn cốt, chấp thuận dữ liệu, HUD, dock, nút hành động, cần ảo, nhãn, toast, chuyển cảnh, bảng, theo dõi nhiệm vụ, la bàn, tạm nghỉ |
| 03 | `03-ui-so-menh-va-tien-trinh.md` | UI-20 → UI-37: Sổ Mệnh, Mệnh Bàn (vòng), «Vì sao?», Ngũ Hành, Ngũ Duy, Đặc Tính, Tính Khí – tâm ma, Mệnh Đồ, Sổ Công Quá, sổ đời thực, nghiệp – sám hối, cảnh giới, đột phá, Thiên Bảng, hồ sơ, thành tựu, Nợ Âm |
| 04 | `04-ui-the-gioi-npc-nhiem-vu.md` | UI-40 → UI-57: thoại kịch bản, thoại AI + Neo, chuyển hướng khủng hoảng, Sổ Nhiệm Vụ, bản đồ, bản đồ nhỏ, trạm, danh sách gian, việc ngày, Bàn Thầy, giải án, sảnh nghề, Vận Mệnh Các, Thái Tuế Điện, Giải Quẻ, Tàng kinh các, Bách khoa |
| 05 | `05-ui-xa-hoi-cua-hang-cai-dat.md` | UI-60 → UI-79: giao lưu, phòng, thẻ người chơi, báo cáo, đồng tu, môn phái, đạo tràng, sư đồ, hợp hôn, lịch lễ, hộp thư, Tàng Y Các, phòng thử, VIP / nạp, Đạo Lộ mùa, cài đặt (tổng, trợ năng, âm thanh – đồ họa, quyền riêng tư), cổng âm tà |
| 06 | `06-ui-hud-mini-game.md` | UI-80 → UI-99: khung HUD mini-game, 16 HUD hoạt động tu (liên kết `MG-xx` tài liệu 09), ngự kiếm, chụp ảnh, trình phát cảnh cắt; phụ lục trạng thái và chuỗi từng mini-game |
| 07 | `07-he-thong-thiet-ke.md` | phông (Việt + Hán phồn / giản), thang cỡ chữ, token màu và kiểm tương phản, màu đạo thống, 4 bộ màu ngũ hành song song, kích thước, biểu tượng Huyền Ấn thay emoji, thành phần, chuyển động, âm phản hồi, bản đồ rung |
| 08 | `08-camera.md` | thông số rig hiện có, bổ sung ngoài trời (bối cảnh, va chạm, dốc), trong nhà (mái mờ, góc thấp, từng điện), hội thoại, preset điện ảnh `cam.*`, preset mini-game, chụp ảnh, trợ năng camera |
| 09 | `09-am-nhac-bgm.md` | 5 khung giờ ứng ngũ âm, 105 `BGM-<VÙNG>-<KHUNG>` cho 21 vùng, luật thích ứng (mức M0–M3, chuông canh 12 giờ, chuyển vùng, nhạc hợp mệnh, thời tiết), nhạc điện / màn / mini-game / lễ / stinger, sản xuất, luật tôn trọng, brief sáng tác |
| 10 | `10-am-thanh-sfx.md` | ≈ 466 mã `SFX-*` trong 15 nhóm (UI, tiến trình, bước chân 18 bề mặt, chuông – khánh – mõ, nghi thức, nước, mưa, gió, môi trường 21 vùng, đám đông, mini-game, trang phục, xã hội, giọng không lời) |
| 11 | `11-thoai-tron-am-ban-quyen.md` | kế hoạch VO (hạng A–D, thẻ vai, ≈ 3.490 câu), cây bus, nén nhường, giới hạn tiếng, 3D, vang; chỉ tiêu độ to; triển khai thay `audio.js`; kiểm thử; bản quyền nhạc, tiếng, giọng |
| 12 | `12-hieu-ung-hinh-vfx.md` | kiểm kê hiệu ứng có sẵn, gia trì 5 hành, hiệu ứng Tàng Y Các, nghi thức, thời tiết, môi trường, hậu kỳ; giảm chuyển động; ngân sách hiệu năng 3 mức |
| 13 | `13-ban-dia-hoa.md` | kiến trúc chuỗi, quy tắc giãn chữ, giả bản địa hóa, chữ Hán và móc từ điển, bảng thuật ngữ vi → en, đầu ra engine / AI, định dạng, phụ đề, duyệt văn hóa |
| 14 | `14-tro-nang.md` | nền tảng đã có, **4 bảng màu ngũ hành cho mù màu đã tính kiểm**, hoa văn, phụ đề âm thanh, thị giác, thính giác, vận động, nhận thức, ánh sáng – say, an toàn cảm xúc, checklist 42 mục |
| 15 | `15-luong-trai-nghiem.md` | 12 luồng storyboard: 15 phút đầu, Vân Cốc, phiên tối, xong tầng Mệnh Đồ, đột phá, Vu Lan MMO, Tà Lộ – hồi đầu, mất mạng, bản iOS, trở lại sau 7 ngày, mua món, vào thánh địa |
| 16 | `16-bo-trinh-bay-theo-vung.md` | thẻ trình bày 21 vùng (màu, LUT, nhạc, môi trường, bước chân, vang, camera, hiệu ứng, biển, mở màn, câu tải, tôn trọng) + trình bày 7 lễ tiết |
| 17 | `17-san-xuat-va-nghiem-thu.md` | khối lượng tài sản, lộ trình M0–M6, vai trò, quy trình duyệt, ma trận thiết bị, chỉ số theo dõi, rủi ro trình bày, DoD |
| 18 | `18-ban-giao-ky-thuat-giao-dien.md` | `tokens.css` đề xuất, hằng z / điểm gãy, thông số 17 thành phần, mẫu ARIA, từ điển 125 sự kiện đo lường, hàm `api` mới |
| 19 | `19-hop-thoai-loi-va-nen-tang.md` | 18 hộp xác nhận hệ thống, ≈ 40 thông báo lỗi / sự cố, khác biệt nền tảng (quay lại Android, iOS, bàn phím ảo, màn ngang, máy tính bảng, máy tính, tay cầm, chế độ 2D) |
| 20 | `20-khoanh-khac-nghi-thuc.md` | đột phá 5 bậc × 3 cách gọi, đại nguyện 300 / 600 / 1.000 công, nhập môn phái theo 9 đạo thống, các khoảnh khắc khác, `cam.reveal` cho 12 thánh địa |
| 21 | `21-cau-dan-meo-va-trinh-bay-vat-pham.md` | kho câu dẫn / mẹo có điều kiện, bản đặt hàng ảnh nền, trình bày cả 51 món Tàng Y Các |
| 22 | `22-ma-tran-boi-canh-trinh-bay.md` | 18 bối cảnh × thành phần, nhạc, camera, gia trì, rung; cờ phủ; bảng chuyển bối cảnh; hàng đợi sự kiện |
| 23 | `23-kich-ban-kiem-thu-trinh-bay.md` | 115 ca kiểm thử (55 P0) thủ công + tự động |
| 24 | `24-chu-trong-the-gioi-3d.md` | kiểm kê chữ 3D, luật đọc được (tính theo FOV), chiều đọc chữ Hán, câu đối, chất liệu, chữ do người chơi sinh ra, bản địa hóa |

## Tóm tắt các quyết định chính

1. **Sáu nguyên tắc trình bày** (phần 01 §1): con số nào cũng có «Vì sao?»; không làm người chơi xấu hổ (không đỏ cho điểm thấp, câu dẫn bắt buộc ở mọi điểm); tĩnh trước động sau; cảnh là giao diện; chữ Hán luôn có người dẫn; không bán điều không được bán.
2. **Bố cục chuẩn số 1 là màn dọc 390 × 844**; máy tính ≥ 1280 px dùng ngăn phải cho bảng dài.
3. **Dock mới từ M1:** Nhiệm vụ · Bản đồ · Giao lưu · Y Các · Sổ Mệnh; Sổ Mệnh chia thẻ Mệnh Bàn · Mệnh Đồ · Công Quá · Cảnh giới · Tủ đồ (§12 bản tổng).
4. **Mệnh Bàn** là đĩa SVG 4 vòng vẽ theo lối cổ Nam ở trên; luôn có bảng văn bản thay thế.
5. **Thoại AI** giữ nguyên bộ stream + Neo của app; thêm persona trong giao diện, ngưỡng cảnh báo Neo < 70, màn chuyển hướng khủng hoảng rời vai.
6. **Âm nhạc theo ngũ âm:** 5 khung giờ ↔ 5 điệu (Khuya-Vũ, Sớm-Giốc, Ngày-Chủy, Chiều-Thương, Tối-Cung); mỗi vùng một âm cung riêng; chuông canh đánh dấu 12 canh giờ; giờ Tý gần như im lặng.
7. **Nhạc phát dạng tệp 6 kênh (3 stem) qua một phần tử `<audio>`** để giữ thích ứng mà không vượt bộ nhớ điện thoại; có bản stereo dự phòng.
8. **Không lời kinh / chú thật, không giọng giả dân tộc**; Tạng Địa chỉ bản tạm cho tới khi có cố vấn.
9. **Biểu tượng Huyền Ấn thay emoji** (emoji khác nhau theo máy, thiếu trên máy cũ, ⛩ là cổng Thần đạo Nhật).
10. **Bốn bảng màu ngũ hành cho mù màu**, chọn bằng mô phỏng: bảng hiện tại chỉ còn ΔE 9,8 giữa Hỏa – Thổ khi mù đỏ – lục; bảng mới ≥ 32.
11. **Chỉ tiêu độ to −16 LUFS ±1, đỉnh −1 dBTP**; chế độ đêm khuya tự động 23:00–05:00.
12. **Hiệu ứng hình** đọc hành bằng **chuyển động** (đã có trong `effects.js`), tôn trọng nơi thờ (tắt vệt bước, giảm gia trì trong điện), ngân sách hạt theo 3 mức chất lượng.

## Mã định danh mới (không gian tên của tài liệu 12)

### UI-* — 94 mục + 1 mục con

| Khoảng | Phần | Mục |
|---|---|---|
| UI-01 – UI-18 | 02 | 01 Khởi động · 02 Cổng mới · 03 Mẫu bát tự · 04 Lật trụ · 05 Lộ căn cốt · 06 Cổng quay lại · 07 Chấp thuận dữ liệu · 08 HUD · 09 Dock · 10 Nút hành động · 11 Cần ảo · 12 Nhãn / bong bóng · 13 Toast · 14 Chuyển cảnh · 15 Bảng chung · 16 Theo dõi nhiệm vụ · 17 La bàn · 18 Tạm nghỉ |
| UI-20 – UI-37 | 03 | 20 Sổ Mệnh · 21 Mệnh Bàn · 22 Vì sao? · 23 Ngũ Hành · 24 Ngũ Duy · 25 Đặc Tính · 26 Tính Khí / tâm ma · 27 Mệnh Đồ · 28 Tầng Mệnh Đồ · 29 Sổ Công Quá · 30 Sổ đời thực · 31 Nghiệp / sám hối · 32 Cảnh giới · 33 Đột phá / đại nguyện · 34 Thiên Bảng · 35 Hồ sơ · 36 Thành tựu · 37 Nợ Âm |
| UI-40 – UI-57 (+ UI-40b) | 04 | 40 Thoại kịch bản (40b Lịch sử thoại) · 41 Thoại AI · 42 Khủng hoảng · 43 Sổ Nhiệm Vụ · 44 Chi tiết nhiệm vụ · 45 Bản đồ · 46 Bản đồ nhỏ · 47 Trạm · 48 Các gian · 49 Việc hôm nay · 50 Bàn Thầy · 51 Giải án · 52 Sảnh nghề · 53 Vận Mệnh Các · 54 Thái Tuế Điện · 55 Giải Quẻ · 56 Tàng kinh các · 57 Bách khoa |
| UI-60 – UI-79 | 05 | 60 Giao lưu · 61 Trong phòng · 62 Thẻ người chơi · 63 Báo cáo · 64 Đồng tu · 65 Môn phái · 66 Đạo tràng · 67 Sư đồ · 68 Hợp hôn / kết nghĩa · 69 Lịch lễ · 70 Hộp thư · 71 Tàng Y Các · 72 Phòng thử · 73 VIP / nạp · 74 Đạo Lộ mùa · 75 Cài đặt · 76 Trợ năng · 77 Âm thanh – đồ họa · 78 Quyền riêng tư · 79 Cổng âm tà |
| UI-80 – UI-99 | 06 | 80 Khung mini-game · 81 Tĩnh tọa · 82 Kết phù · 83 Khoa cử · 84 Đặt tên · 85 Sửa nhà · 86 Chọn ngày · 87 Công án · 88 Mạn-đà-la · 89 Đối chiếu Định Mệnh Hội · 90 Cứu người · 91 Y dược · 92 Sám hối · 93 Bái Đẩu · 94 Phóng sinh / thả đèn · 95 Gian nhỏ Sơn Môn · 96 Hành hương / bánh xe kinh · 97 Ngự kiếm · 98 Chụp ảnh · 99 Cảnh cắt |

Khoảng trống UI-19, UI-38–39, UI-58–59 để chèn mục sau.

### BGM-*

`BGM-<VÙNG>-<KHUNG>` (21 vùng × 5 khung = 105) với vùng `SONMON, THANH, TUBINH, MANH, TRICHTHIEN, CUNGTHONG, THULAU, PHONGTHUY, LICHDUONG, LONGHO, VODANG, CHUNGNAM, MAOSHAN, YENTU, BUTTAP, TANGDIA, VANMIEU, PHONGDO, MIEUCUONG, CONLON, VANCOC` và khung `KHUYA, SANG, NGAY, CHIEU, TOI`; `BGM-MIEUCUONG-HANG`; `BGM-INT-{TAMTHANH, VANXUONG, DAUMAU, LAOQUAN, VANMENH, THAITUE, CHUA, NHA, TANGKINH}`; `BGM-GATE-01`, `BGM-RITE-01`, `BGM-MENHDO-01`, `BGM-ASCEND-01…06`, `BGM-VOW-01…03`, `BGM-CREDITS`; `BGM-MG-{TINHTOA, KETPHU, KHOACU, SAMHOI, BAIDAU, MANDALA, CONGAN, SUANHA, DOICHIEU}`; `BGM-SKY`; `BGM-EV-{TET, THUONGNGUYEN, VULAN, HANGUYEN, TRUNGCUU, PHATDAN, TETTHAY}`; `BGM-STING-{REGION, QUEST, QUESTDONE, MENHDO, TALOAN, HOIDAU, THAU, GAN, CHUA}`.

### SFX-*

Nhóm và khoảng (danh mục đầy đủ phần 10): `SFX-UI-001…050` · `SFX-PROG-001…009` · `SFX-QUEST-001…005` · `SFX-KARMA-001…007` · `SFX-FOOT-010…182` (18 bề mặt × đi / chạy / đáp) · `SFX-BODY-001…015` · `SFX-FLY-001…014` · `SFX-DOOR-001…008` · `SFX-TRAV-001…005` · `SFX-BELL-001…049` · `SFX-RITE-001…056` · `SFX-WATER-001…020` · `SFX-RAIN-001…010` · `SFX-WIND-001…012` · `SFX-WX-001…007` · `SFX-AMB-001…060` · `SFX-CROWD-001…020` · `SFX-MG-001…093` · `SFX-SHOP-001…006` · `SFX-COS-001…017` · `SFX-SOC-001…008` · `SFX-VOX-001…016`.

### Khóa cấu hình (không phải mã canon)

Vì tài liệu 12 chỉ được cấp `UI-*`, `SFX-*`, `BGM-*`, các thứ sau dùng **khóa cấu hình** chữ thường: preset camera `cam.*` (phần 08), hiệu ứng hình `fx.*` (phần 12), khóa chuỗi `ui.*`, `tip.*`, `term.*` (phần 13, 21), mã ca kiểm thử `K-*` (phần 23), bối cảnh `C0…C17` (phần 22).

## Lỗi / bất nhất phát hiện trong code khi rà soát

1. `main.js › ceremony()` ghi nhãn «Hỷ thần» nhưng lấy `yong.secondary || yong.xi`; với `MAU-A` hiện «Hỷ thần: Mộc» trong khi engine ghi Hỷ = Kim (phần 02 UI-04).
2. `game.css` định nghĩa `.hq-tabs` / `.hq-tab` **hai lần** (kiểu gạch chân và kiểu viên thuốc), quy tắc sau đè quy tắc trước (phần 07 §5).
3. Tương phản chưa đạt AA: `.hq-note` `#8e8170` (4,37:1 trên thẻ), chữ màu `--wx-thuy` (3,96:1), `--wx-hoa` (4,34:1) (phần 07 §2.3).
4. Bốn bộ màu ngũ hành song song (`--wx-*`, `ROBE`, `WX_GIATRI`, `WX_COLOR`) (phần 07 §2.5).
5. `confirm()` của trình duyệt cho xoá hồ sơ / xoá dữ liệu (phần 01 §2).
6. Emoji ⛩ (cổng Thần đạo) dùng cho cổng đại vận và màn vào điện (phần 07 §4.1).
7. Nút icon HUD 40 × 40 px, dưới chuẩn 44 (phần 01 §3.1).
8. Texture chữ 3D vẽ bằng phông chung `serif` của hệ điều hành (phần 24 §1).

## Câu hỏi mở

1. Thứ tự hiển thị Mệnh Đồ: engine sắp `pri` 1 = Không gian, canon gọi Tích âm đức là nền — vẽ âm đức ở chân núi được không? (tài liệu 05)
2. Ngày reset việc hằng ngày: 0 giờ (hiện tại) hay giờ Tý 23:00 cho khớp lịch can chi và nhạc? (09, 10)
3. Số hiệu `MG-xx` cho 16 mini-game để điền bảng phần 06 §0. (09)
4. Có mở không gian tên riêng cho hiệu ứng hình / preset camera (vd `FX-*`, `CAM-*`) không? (00, 13)
5. Khai báo tuổi ở cổng để áp giới hạn nạp cho người dưới 18 và cổng âm tà? (11, 14)
6. Bản iOS có giữ lễ thả đèn dạng «lời tưởng nhớ» không? (14)
7. Biển chữ Hán cho Yên Tử, Miêu Cương, Tạng Địa — chờ cố vấn. (07, 14)
8. Lồng tiếng tiếng Anh có cần không, hay giữ VO Việt + phụ đề? (13)
9. Thuật ngữ tiếng Anh: dùng pinyin cho thuật ngữ BaZi nhưng giữ Hán Việt cho tên người / nơi — xác nhận. (13)
10. Lớp «nhạc hợp mệnh» theo Dụng thần có nên bật mặc định? (09)
11. Phí trạm đi nhanh: miễn phí cho trạm đã mở? (11)
12. Ngưỡng Neo cảnh báo 70 có phù hợp với phân bố điểm `checkNeo` thực tế? (06, 13)
