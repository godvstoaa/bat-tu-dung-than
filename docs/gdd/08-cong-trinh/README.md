# 08 · Quy chuẩn công trình đi vào được — «không có công trình làm màu»

> Tài liệu 08 của bộ GDD «Huyền Giới · Mệnh Do Ta Tạo». Nở từ bản sơ đồ tổng `docs/GAME-AAA-THIET-KE.md` §8 (và dùng §7 cho phong cách vùng). Bắt buộc đọc trước: `docs/gdd/00-KINH-DIEN-CHUNG.md`.

## Luật

> **Luật số 1 của level design:** mọi công trình người chơi nhìn thấy trong **tầm đi bộ** đều **đi vào được**, có **nội thất đúng công năng** và có **ít nhất một tương tác** nối với một engine của app hoặc một nhiệm vụ. Không có mặt dựng giả, không có cửa vẽ. (Trụ cột T4.)

Ngoại lệ duy nhất là **cảnh nền xa** — ngoài tầm đi bộ đo được (08-01 §1.1) và không có đường tới. Có đường tới thì phải thật hóa **trước** khi mở đường.

## Tóm tắt

1. **Phân hạng A–E** với yêu cầu đo được cho nội thất, tương tác, NPC, ánh sáng, âm, cửa, camera, hiệu năng; «10 lời hứa thị giác» (thấy cửa = vào được, thấy cửa sổ sáng = có người…); bảng đăng ký hạng **toàn bộ 124 công trình đang có** (08-01).
2. **Đã đo thật** mọi vỏ Meshy / thư viện đang dùng bằng nguyên mẫu `bld-void` (cắt lát đúng thuật toán `collide.js`, ở đúng tỉ lệ trong game) — mặt bằng trong tài liệu dựa trên số đo, không đoán (08-02 §5.2, hồ sơ bản đồ 08-18).
3. **Pipeline** ba lớp `shell / interior / props` + nút phụ (khoang, cửa nhìn, cửa, thang, đèn, trạm); khoét cửa boolean bằng Blender headless, **khung che vết cắt**, làm rỗng, lớp lót trong tự động, **va chạm nướng sẵn** (`col.json`) để test Node thấy đúng va chạm như trình duyệt (08-02).
4. **Runtime**: khoang + cửa nhìn (portal culling) cho Three.js, nạp theo bán kính, **cửa thật** theo **giờ can chi** với luật «không nhốt» (ngách luôn mở), mờ mái / tầng trên **mà vẫn đổ bóng**, camera TRONG / BỔ DỌC (08-03); đèn theo khoang, **tầng `lv`** cho va chạm (vấn đề lớn nhất của va chạm 2D hiện tại), thang xoắn «con trỏ bậc», A* phân cấp, vang và che âm qua cửa, lưu và đồng bộ MMO (`mv.l`, gói `ix`) (08-04, hợp đồng API 08-20).
5. **9 bộ mô-đun** (≥ 45 mảnh mỗi bộ phong cách) theo lưới gian 3,2 m (08-05, 08-06), bố cục atlas và hình học mảnh then chốt (08-19).
6. **Spec thật hóa từng công trình đang có** (mặt bằng có kích thước, khoang, đồ, trạm → engine, NPC, đèn, cửa, ước lượng): Sơn Môn (08-07, 08-08), Huyền Thành gồm 36 gia đình sinh tất định có lá số và án phong thủy theo **hướng thật** của nhà (08-09), Hậu Sơn – sảnh nghề – vùng (08-10, 08-11), điện «dạy bằng không gian» (08-17), mặt bằng bổ sung (08-22); giải thể cả 6 phòng ngoài bản đồ.
7. **Nghiệm thu**: phiếu DoD 30 mục, 30 test tự động (có khung mã), duyệt art + nội dung tín ngưỡng, kế hoạch đo hiệu năng 9 kịch bản (08-12).
8. **Chuyển đổi**: 8 giai đoạn có cờ, ~636 ngày người cho công trình đang có, danh sách việc, rủi ro, **7 lỗi bố cục cần sửa ngay** (08-13); khung nội thất cho 12 thánh địa mới (~870 ngày người, 08-14); trải nghiệm – giao diện – kịch bản mẫu (08-15); công thức mẫu đủ để dán cho đợt thí điểm (08-16); cẩm nang dựng cảnh + lịch người (08-21); công cụ dev (08-23).

## Mục lục

| Phần | Tệp | Nội dung |
|---|---|---|
| 01 | [08-01-phan-hang.md](08-01-phan-hang.md) | Luật, tầm đi bộ, 10 lời hứa thị giác, khoang khóa, tháp đặc; hạng A–E (yêu cầu + ví dụ có / dự kiến); cây quyết định; quy định chung; **bảng đăng ký hạng mọi công trình**; ngoại lệ; ngân sách hiệu năng |
| 02 | [08-02-pipeline-tai-san.md](08-02-pipeline-tai-san.md) | Ba lớp + nút phụ; đặt tên; thư mục; bốn loại vỏ Meshy; **đo lòng** (thuật toán + kết quả 24 vỏ); khoét boolean; làm rỗng; chọn mẫu Meshy; lớp lót tự động; Blender / gltf-transform từng lệnh; nướng va chạm; LOD theo lớp; ngân sách texture / đa giác; quy trình bộ mô-đun; credit Meshy; kiểm P1–P10 |
| 03 | [08-03-runtime-khoang-cua-camera.md](08-03-runtime-khoang-cua-camera.md) | Kiến trúc module, chỗ nối `render3d.js`; cấu trúc dữ liệu; tra khoang; portal culling; nạp / dỡ; **cửa thật** (loại, trạng thái, lịch giờ can chi, tự mở, gõ cửa, khoét / chặn động, MMO); mờ mái / tầng trên; camera trong nhà; nhãn |
| 04 | [08-04-runtime-anh-sang-tang-dan-duong-am-dong-bo.md](08-04-runtime-anh-sang-tang-dan-duong-am-dong-bo.md) | Đèn theo khoang, phơi sáng, ánh trời, lịch đèn, chống lọt sáng; **tầng `lv`**, thang, thang xoắn; A* phân cấp, chọn điểm, gỡ kẹt; vang, âm nền, che âm; lưu, chuyển lưu cũ, giao thức, vật dùng chung |
| 05 | [08-05-mo-dun-ky-thuat-bac-giangnam-chuaviet.md](08-05-mo-dun-ky-thuat-bac-giangnam-chuaviet.md) | Quy ước bộ; **MOD-KT** (32), **MOD-BAC** (55), **MOD-GNA** (48), **MOD-VIE** (49); công thức lắp |
| 06 | [08-06-mo-dun-tang-nho-mieu-amty-dandung.md](08-06-mo-dun-tang-nho-mieu-amty-dandung.md) | **MOD-TAN** (48), **MOD-NHO** (49), **MOD-MIE** (48), **MOD-AMT** (47), **MOD-DAN** (50); đồ theo nghề |
| 07 | [08-07-int-son-mon-1.md](08-07-int-son-mon-1.md) | Bối cảnh Sơn Môn, người, lịch một ngày; **Chính Đường 2 tầng**; **Vận Mệnh Các «Vòng Đời»**; **Thái Tuế Điện**; lầu chuông; lầu trống |
| 08 | [08-08-int-son-mon-2.md](08-08-int-son-mon-2.md) | Bốn bảo tháp (dời khỏi tường); Sơn Môn; Hậu Môn; Tàng Y Các (+ buồng may); Bệ Thầy, Thiên Bảng; trạm sân; nền, tường; tổng hợp |
| 09 | [08-09-int-huyen-thanh.md](08-09-int-huyen-thanh.md) | Thành môn (tàng binh động, thành lâu); **36 nhà**: bảng vị trí / hướng / kiểu, quy tắc sinh gia đình, lịch, án tại nhà; sạp (xung đột + bố trí mới); bài phường; Văn Phong Tháp; Du Phương Lâu; tường thành; trạm xe |
| 10 | [08-10-int-hau-son-sanh-nghe-vung-1.md](08-10-int-hau-son-sanh-nghe-vung-1.md) | Lỗi `palaceComplex`; **Chính Điện Tam Thanh**; điện phụ, tháp Hậu Sơn; 8 sảnh nghề; Tử Bình (Bát Cách Lang); Manh Phái Cốc («đọc tượng không cần mắt»); Trích Thiên (Quan Tinh Đài 12 cung) |
| 11 | [08-11-int-vung-2-cong-cau.md](08-11-int-vung-2-cong-cau.md) | Cùng Thông (ba trà lâu theo Điều Hậu, thủy tạ); Thư Lâu (9 tầng thư, sửa chồng khối); Phong Thủy Viên; Lịch Đường; Lưng Chừng Quán; 4 cổng tông môn; cầu Huyền Hà; ngoại lệ |
| 12 | [08-12-nghiem-thu-test-hieu-nang.md](08-12-nghiem-thu-test-hieu-nang.md) | DoD 30 mục; 30 test + khung mã `test-game-buildings.mjs`; sửa test cũ; duyệt art, nội dung; bộ ảnh; thử tay; đo hiệu năng; số liệu sau phát hành |
| 13 | [08-13-chuyen-doi-ke-hoach.md](08-13-chuyen-doi-ke-hoach.md) | Nguyên tắc, «đang trùng tu»; giai đoạn P0–P7; khớp mốc M1; danh sách việc; giải thể một phòng; rủi ro; **việc sửa ngay** |
| 14 | [08-14-khung-noi-that-thanh-dia-moi.md](08-14-khung-noi-that-thanh-dia-moi.md) | Khung nội thất 12 thánh địa mới (Long Hổ … Am Vân Cốc), ước lượng |
| 15 | [08-15-trai-nghiem-ui-kich-ban.md](08-15-trai-nghiem-ui-kich-ban.md) | Nhịp vào nhà; 12 yêu cầu giao diện; 12 kịch bản mẫu tại công trình; âm theo giờ |
| 16 | [08-16-cong-thuc-mau-thi-diem.md](08-16-cong-thuc-mau-thi-diem.md) | Công thức đầy đủ: Thái Tuế Điện, Vận Mệnh Các, Lầu chuông; bộ sinh nhà kiểu T2 |
| 17 | [08-17-noi-that-chu-de-chi-tiet.md](08-17-noi-that-chu-de-chi-tiet.md) | Bát Cách Lang, 12 cung, 9 tầng thư, Cửu Cung / Cửu Vận, Cửu Diệu / Bắc Đẩu, Trạch Nhật Đường — nội dung từng khoang lấy từ engine |
| 18 | [08-18-ho-so-do-lat-cat.md](08-18-ho-so-do-lat-cat.md) | Bản đồ lát cắt thật 9 vỏ, kết luận và thay đổi do đo |
| 19 | [08-19-atlas-hinh-hoc-dao-cu.md](08-19-atlas-hinh-hoc-dao-cu.md) | Bố cục atlas từng bộ; hình học mảnh then chốt; prompt đạo cụ anh hùng; danh mục bộ |
| 20 | [08-20-hop-dong-api.md](08-20-hop-dong-api.md) | Hợp đồng API + test đơn vị: `obstacles`, `buildings`, `cells`, `doors`, `kit`, `world`, `lights`, `audio`, giao thức, `state`, `render3d` |
| 21 | [08-21-cam-nang-dung-canh-lich-nguoi.md](08-21-cam-nang-dung-canh-lich-nguoi.md) | 12 quy tắc dựng cảnh (kèm phản ví dụ thật); lịch người theo giờ |
| 22 | [08-22-mat-bang-bo-sung.md](08-22-mat-bang-bo-sung.md) | Mặt bằng còn thiếu của mọi công trình đang có |
| 23 | [08-23-cong-cu-dev.md](08-23-cong-cu-dev.md) | Chế độ gỡ lỗi URL, trình đặt mảnh trong trình duyệt, vòng lặp sửa nhanh, lệnh `npm run bld` |
| 24 | [08-24-cong-thuc-mau-p2.md](08-24-cong-thuc-mau-p2.md) | Công thức đầy đủ đợt P2: Chính Đường 2 tầng, Sơn Môn, bảo tháp Bắc (thang xoắn) |
| 25 | [08-25-ios-may-yeu.md](08-25-ios-may-yeu.md) | Công năng thay thế iOS cho toàn bộ công trình; mức rút gọn `low`; bộ nhớ iPhone |

## Mã định danh mới

Chỉ dùng hai không gian tên của tài liệu 08 (`00-KINH-DIEN-CHUNG.md` §9): **`MOD-<bộ>-xx`** và **`INT-<bld>`**.

### MOD — bộ mô-đun

| Bộ | Phong cách | Số mảnh | Phần |
|---|---|---|---|
| `MOD-KT-01…32` | kỹ thuật chung (sàn, tường lót, khung cửa trơn, thang, nút dữ liệu, thẻ cửa sổ đêm) | 32 | 08-05 §2 |
| `MOD-BAC-01…55` | Đạo quán phương Bắc (quan thức) | 55 | 08-05 §3 |
| `MOD-GNA-01…48` | Đạo quán Giang Nam | 48 | 08-05 §4 |
| `MOD-VIE-01…49` | Chùa Việt | 49 | 08-05 §5 |
| `MOD-TAN-01…48` | Tạng truyền (chờ tham vấn) | 48 | 08-06 §1 |
| `MOD-NHO-01…49` | Nho môn | 49 | 08-06 §2 |
| `MOD-MIE-01…48` | Miêu Cương | 48 | 08-06 §3 |
| `MOD-AMT-01…47` | Âm ty | 47 | 08-06 §4 |
| `MOD-DAN-01…50` | Dân dụng Huyền Thành | 50 | 08-06 §5 |
| `MOD-CON-*` | Côn Lôn (lưu ly vàng, ngọc) — **dự kiến**, chưa cấp mảnh | — | 08-14 §11 |

### INT — công trình

| Nhóm | Mã |
|---|---|
| Sơn Môn | INT-SM-CHINHDUONG · INT-SM-DIENTAY · INT-SM-DIENDONG · INT-SM-LAUCHUONG · INT-SM-LAUTRONG · INT-SM-THAP-TB · INT-SM-THAP-DB · INT-SM-THAP-TN · INT-SM-THAP-DN · INT-SM-SONMON · INT-SM-HAUMON · INT-SM-TANGY · INT-SM-BANTHAY · INT-SM-THIENBANG · INT-SM-TRATHAT · INT-SM-LABAN · INT-SM-XAM · INT-SM-HUONG · INT-SM-LICH · INT-SM-KHACH · INT-SM-DAIDINH · INT-SM-HOSEN · INT-SM-NEN · INT-SM-TUONG |
| Huyền Thành | INT-HT-THANHMON · INT-HT-NHA-01 … INT-HT-NHA-36 · INT-HT-SAP-01 … INT-HT-SAP-06 · INT-HT-PAIFANG · INT-HT-VANPHONG · INT-HT-DUPHUONG · INT-HT-TUONGTHANH · INT-HT-TRAMXE |
| Hậu Sơn | INT-HS-CHINHDIEN · INT-HS-DIENDONG · INT-HS-DIENTAY · INT-HS-THAPDONG · INT-HS-THAPTAY · INT-HS-NEN |
| Sảnh nghề | INT-SN-TRACH · INT-SN-DUONGTRACH · INT-SN-DIEUHAU · INT-SN-THUVIEN · INT-SN-HOPHON · INT-SN-TUVI · INT-SN-TUONGPHAP · INT-SN-CACHCUC |
| Tử Bình | INT-TB-CHINHDIEN · INT-TB-THAPDONG · INT-TB-THAPTAY |
| Manh Phái Cốc | INT-MP-DAIDIEN · INT-MP-DIENDONG · INT-MP-DIENTAY · INT-MP-THAPDONG · INT-MP-THAPTAY · INT-MP-SONMON · INT-MP-DAIDINH |
| Trích Thiên | INT-TT-QUANTINH · INT-TT-CUUTANG · INT-TT-NGUTANG |
| Cùng Thông | INT-CT-TRALAU-NOAN · INT-CT-TRALAU-HAN · INT-CT-TRALAU-TAOTHAP · INT-CT-THUYTA |
| Thư Lâu | INT-TL-THULAU · INT-TL-TANGTHU-DONG · INT-TL-TANGTHU-TAY |
| Phong Thủy Viên | INT-PT-DAIDIEN · INT-PT-DIENDONG · INT-PT-DIENTAY · INT-PT-THAPDONG · INT-PT-THAPTAY · INT-PT-SONMON · INT-PT-LABAN |
| Lịch Đường | INT-LD-DAIDIEN · INT-LD-DIENDONG · INT-LD-DIENTAY · INT-LD-THAPDONG · INT-LD-THAPTAY · INT-LD-SONMON |
| Đường núi, cổng, cầu | INT-NUI-LUNGCHUNG · INT-CONG-TUBINH · INT-CONG-MANH · INT-CONG-TRICHTHIEN · INT-CONG-CUNGTHONG · INT-CAU-HUYENHA |
| Thánh địa mới | `INT-<region>-<tên>` cấp khi tài liệu 07 cấp `BLD-<region>-xx` (khung ở 08-14) |

Tổng công trình đang có: **124 mã INT** (24 Sơn Môn + 47 Huyền Thành + 6 Hậu Sơn + 8 sảnh + 33 vùng + 6 đường / cổng / cầu).

Mã khác dùng **nội bộ** (không phải mã toàn bộ GDD): id khoang (`cd.l0.chinh`…), id trạm mới (`cd_tosu`…, khai trong công thức), id cửa / thang, mã việc chuyển đổi `V<giai đoạn>.<số>` (tài liệu 13 có thể gán `TASK-xxx`), mã test `T-xx` / `U-xx`, mã lỗi kiểm pipeline `P1…P10`, phiếu `D01…D30`, duyệt art `R01…R12`.

## Truy vết yêu cầu (bản sơ đồ tổng §8 → tài liệu này)

| Yêu cầu §8 tổng | Ở đâu |
|---|---|
| Luật số 1, ngoại lệ cảnh nền xa | 08-01 §1, §11 |
| §8.1 Phân hạng A–E | 08-01 §2–§8, đăng ký §10 |
| §8.2.1 Ngoại thất ↔ nội thất cùng khối, bỏ phòng ngoài bản đồ | 08-03; giải thể 6 phòng 08-13 §4 |
| §8.2.2 Ba lớp shell / interior / props; khoét boolean; đo lòng qua lưới va chạm | 08-02 §2–§6, số đo 08-02 §5.2, 08-18 |
| §8.2.3 Ẩn mái / tầng trên, camera hạ, đèn theo phòng | 08-03 §7–§8, 08-04 §1 |
| §8.2.4 Ô cổng, nạp ≤ 60 m | 08-03 §4–§5 |
| §8.2.5 Va chạm khoét `keep`, nội thất, cầu thang `addPlatform` | 08-03 §6.7, 08-04 §2 |
| §8.2.6 Cửa thật, đóng giờ Tuất mở giờ Mão, ngách đêm | 08-03 §6 |
| §8.3 Bộ mô-đun 7 phong cách | 08-05, 08-06 (+ KT, DAN), 08-19 |
| §8.4 Danh sách nội thất công trình đang có | 08-07 … 08-11, 08-16, 08-17, 08-22 |
| §8.5 Definition of Done | 08-12 §1 (mở rộng từ 6 lên 30 mục) |
| §13.2 «Công trình đi vào được» (P0) | 08-13 P0 |

## Phát hiện khi đo game hiện tại (đã ghi việc sửa)

| # | Lỗi | Phần |
|---|---|---|
| 1 | Thái Tuế Điện (x ≈ 2.000 m) vượt `WORLD_TILES.maxX` → máy chủ bỏ gói `mv` | 08-04 §5.2 |
| 2 | Bốn bảo tháp Sơn Môn lấn tường bao | 08-08 §1–§2 |
| 3 | Sạp chợ chắn cửa hai nhà và lấn đế bài phường | 08-09 §5.2 |
| 4 | Hai Tàng Thư Các chồng vào Thư Lâu | 08-11 §2.2 |
| 5 | Trà lâu Cùng Thông, cầu Huyền Hà không va chạm | 08-11 §1.1, §7 |
| 6 | Nền `palaceComplex` một mặt phẳng; bậc chỉ là hình; công trình phụ lơ lửng | 08-10 §1.2 |
| 7 | Cửa hai điện phụ Sơn Môn nhìn vào vách nền | 08-16 §2 |
| 8 | Khối va chạm «vô hình» (bài phường, Trà Thất, bệ đình, thân sạp) | 08-21 A7 |
| 9 | Đại Đỉnh và hồ sen Tây không có tương tác (vi phạm hạng D) | 08-08 §7 |

## Phụ thuộc tài liệu khác

| Tài liệu | Cần từ họ | Cho họ |
|---|---|---|
| 02 Thế giới | chữ hoành phi, câu đối, bia, `LORE-*` tổ sư hư cấu | — |
| 03 Cốt truyện | cảnh `MQ-*` diễn trong công trình | INT id để gắn cảnh |
| 04 Chỉ số | tên trường Ngũ Duy, Hỷ thần | — |
| 05 Cải mệnh | `CQ-*` mở khoang khóa | trạm Sổ Công Quá (Hậu Sơn) |
| 06 NPC | mã `NPC-*` cho ~25 vai phụ, `BARK-*`, persona | lịch người (08-21 B) |
| 07 Thánh địa | `BLD-*`, bố cục vùng | khung nội thất (08-14), luật đặt công trình |
| 09 Tu luyện | `MG-*` (đánh chuông, kết phù, thiền…) | vị trí trạm |
| 10 Xã hội | `EV-*`, `GUILD-*`, bia người chơi | vật dùng chung `ix` |
| 11 Kinh tế | thưởng lần đầu vào công trình, có bán hàng ở nhà phố không | — |
| 12 Trình bày | mã `UI-*`, `SFX-*`, `BGM-*` | 12 yêu cầu giao diện (08-15 §2) |
| 13 Kỹ thuật | `TASK-*`, `SCHEMA-*`, khoét địa hình (động, hang) | hợp đồng API (08-20) |
| 14 Rủi ro | `RISK-*` | rủi ro 08-13 §5 |

## Câu hỏi mở

1. **Phương án M1** (08-13 §2.1): đội 4 người → M1 chỉ đủ nền móng + thí điểm 4 công trình; chấp nhận dời phần Sơn Môn còn lại sang M2?
2. **Giờ thế giới MMO**: cửa / đèn theo giờ máy từng người (như mặt trời hiện nay) hay «giờ Huyền Giới» chung UTC+7?
3. **Hai bảo tháp Nam**: giữ tháp đặc có địa cung (đề xuất) hay thay bằng `lib_pagoda5` để đủ «tầng đỉnh chuông gió» ở cả bốn tháp?
4. **Đường tuần trên tường thành** (~990 m): làm (mở từ thành lâu) hay để tường hạng E thuần?
5. **Lưu `raw/` lớn** của `assets-bld/`: Git LFS hay ổ chung?
6. **Thưởng lần đầu vào công trình** (+1 Phúc Khí đề xuất) — tài liệu 11 quyết.
7. **Tạng Địa**: ai là người tham vấn, mốc nào; trước đó bộ MOD-TAN chỉ dừng ở khung.
8. **Chính Điện Tam Thanh**: nếu dọn lòng `cliff_palace` làm thủng mái, chấp nhận phương án trần 4,2 m (tượng nhỏ hơn phòng cũ)?
