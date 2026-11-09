# 05-26 · Yêu cầu mini-game gửi tài liệu 09

> Hệ 05 dùng 22 mini-game. Tài liệu 09 cấp mã `MG-xx`, thiết kế cảm giác chơi và hình ảnh; phần này ghi **yêu cầu chức năng bắt buộc** từ hệ cải mệnh: mục tiêu, đầu vào, nhịp / thời lượng, các mức, tâm ma, trợ năng, chống bot, móc thưởng. Mã nội bộ `Y-xx` chỉ để tham chiếu trong tài liệu 05.
> Luật chung cho mọi mini-game nghi lễ / tu: **không màn thua, không điểm kiểu «Perfect / combo»** (TT-4); kết quả chỉ có «viên» (đạt trọn) / «thành» (đạt) / «làm lại» (không mất gì).

---

## 1. Bảng tổng

| Mã | Mini-game | Dùng ở | Loại | Thời lượng | Có tâm ma | Tổ đội |
|---|---|---|---|---|---|---|
| Y-01 | Tĩnh tọa hơi thở | TV, TC, Ngũ Bộ bước Đình | nhịp giữ – thả | 5–15 phút | có | có (đồng tu) |
| Y-02 | Thiền (Sổ / Tùy / Chỉ / Quán) | TH | để yên / đếm / gọi tên | 5–20 phút | có | có |
| Y-03 | Tồn tư ánh sáng | TT | giữ ổn định | 5–10 phút | có | không |
| Y-04 | Kết phù năm đoạn | CN, TT | ghép logic | 2–4 phút / phù | không | không |
| Y-05 | Bái Đẩu thắp 7 đèn | CN | thứ tự chòm sao + lạy | 5–6 phút | không | có |
| Y-06 | Lạy theo nhịp (Hồng Danh 88, Phát Lộ 35) | TD, sám | nhịp chuông | 4–13 phút, chia phiên | không | có (lạy chung) |
| Y-07 | Tụng theo nhịp mõ (Đại Bi, Pháp Hoa, công khóa, niệm Phật) | TD, TC, nhiều | nhịp | 2–8 phút | không | có |
| Y-08 | Lần chuỗi (Chuẩn Đề 21 / 108 / 1.000) | MT | nhịp chạm | 1–80 phút, chia phiên | không | không |
| Y-09 | Quán tưởng dòng sáng (Tịnh Kim Cang) | MT, sám | giữ ổn định | 4–18 phút | không | không |
| Y-10 | Cát hoa sen | MT | xếp đối xứng + gạt | 6–10 phút | không | có (bức chung) |
| Y-11 | Canh lò đan / canh lửa sắc thuốc / nấu canh | TV, BM, hiếu | giữ vùng | 3–5 phút | không | không |
| Y-12 | Thái Cực | TV | theo đường động tác | 3–8 phút | không | có (song luyện) |
| Y-13 | Thắp đèn phố Phong Đô | BD | quản lý nhiều điểm | 8 phút | không | có |
| Y-14 | Chuyển kinh | BD | nhịp chung nhiều người | 6 phút | không | **bắt buộc** (NPC điền) |
| Y-15 | Khoa nghi vai | TC (Linh Bảo) | nhịp theo vai | 10 phút | không | **bắt buộc** (NPC điền) |
| Y-16 | Hành hương bậc đá | TH, TV | đi bộ + việc nhỏ | 8–12 phút / chặng | không | có |
| Y-17 | Chép kinh / thư pháp | KI, NH | theo nét | 2–5 phút | không | không |
| Y-18 | Hiệu đính kinh | TC | đối chiếu bảng | 5 phút | không | không |
| Y-19 | An trạch (sắp nội thất) | Mệnh Đồ Không Gian | đặt vật trên lưới 9 cung | tự do | không | có (bạn giúp) |
| Y-20 | Án «việc lạ» (quy trình 5 bước) | TT, TR | hội thoại + tìm vật | 6–15 phút | không | có |
| Y-21 | Giải oan (điều tra) | BD | thu chứng cứ, đối chiếu thời gian | 15–25 phút | không | có |
| Y-22 | Kéo ở cầu Nại Hà | BD, Tà Lộ | hai người giữ nhịp | 2 phút | không | **bắt buộc** (2 người) |

---

## 2. Yêu cầu từng mini-game

### Y-01 · Tĩnh tọa hơi thở

| Mục | Yêu cầu |
|---|---|
| Đầu vào | giữ phím / chạm giữ khi vòng nở, thả khi vòng co; không chạm tạp niệm |
| Nhịp | mức 1: 6 vòng / phút; mức 2: 5; mức 3: 4 — **không bao giờ < 4** (TV-G1); không pha giữ hơi > 6 giây |
| Đạt | «viên» khi ≥ 85% vòng đúng **và** ≤ 2 lần chạm tạp niệm |
| Tâm ma | tạp niệm có chủ đề theo thanh nghiệp mức Nặng (05-05 §2.4) và `liudao.poisonTop` (1 / 40 giây) |
| Vận Phù | Phù Dưỡng / Phương Vị nới khung ≤ 5% mỗi loại, tổng ≤ 10% |
| Tu Bổ | Định Lực rộng khung ≤ 5% |
| Câu cố định | «Đây là trò chơi. Công pháp thật cần thầy chỉ dẫn trực tiếp.» |
| Trợ năng | rung (haptics) theo vòng; chế độ một nút |
| Chống bot | phân bố lệch chạm |

### Y-02 · Thiền

| Mục | Yêu cầu |
|---|---|
| Sổ Tức | đếm 1 → 10 theo nhịp nhạc nền, chạm một lần mỗi hơi; lạc thì về 1 |
| Tùy / Chỉ | không chạm; chạm tạp niệm = «theo niệm» (đếm, không phạt) |
| Quán | khi tạp niệm (chữ mờ) xuất hiện, chọn tên (lo / nhớ / muốn / giận / sợ) — tan |
| Kết quả | **không hiện điểm**; vòng tròn mực đậm dần (đặc trưng Trúc Lâm) |
| Đạt | Sổ: 3 vòng đếm trọn; Tùy / Chỉ: ≤ 3 lần theo niệm trong 10 phút; Quán: ≥ 70% gọi đúng |
| Tâm ma | như Y-01; Tu Bổ Thiền giảm 10% / hạng |
| Kiểm máy chủ | **không** kiểm theo điểm (05-14 §4.3) — thưởng theo phiên có thưởng / ngày |

### Y-03 · Tồn tư ánh sáng

| Mục | Yêu cầu |
|---|---|
| Đầu vào | giữ một điểm sáng ổn định (chuột / cảm ứng / con quay của máy) để nó lớn thành vòng |
| Nhiễu | bóng tối lướt — để yên |
| Mức 3 | 5 điểm sáng (Hoàng Đình ngũ tạng — hình ảnh, không giải phẫu) |
| Không có | hình quỷ, hù dọa (TT-G1) |

### Y-04 · Kết phù năm đoạn

| Mục | Yêu cầu |
|---|---|
| Đơn | NPC có lá số thật (như `halls.js`) + một sát nhà từ `SHA_LIST` |
| Năm lựa chọn | đầu (loại việc) · thân (chữ công năng) · bụng (quẻ theo phương) · đảm (hành Dụng chủ nhà) · chân (phong lệnh) |
| Mảnh | **ký tự hư cấu** + nhãn tiếng Việt; không mảnh nào là chữ phù thật |
| Đạt | 5/5 «viên»; 3–4 «thành» |
| Sau kết | NPC luôn nói việc thật cần làm (`fs-cure.cures`) |
| iOS | đảm theo **sát** của nhà thay cho hành Dụng |

### Y-05 · Bái Đẩu

| Mục | Yêu cầu |
|---|---|
| Đầu vào | chạm 7 đèn theo thứ tự chòm Bắc Đẩu; 3 nhịp lạy |
| Mức cao | đèn tắt khi chạm sai thứ tự (thắp lại được — không thua) |
| Bản mệnh | đèn bản mệnh (theo chi năm sinh) sáng hơn — web; iOS: không |

### Y-06 · Lạy theo nhịp

| Mục | Yêu cầu |
|---|---|
| Nhịp | ≈ 7,5 giây / lạy; cửa sổ ±250 ms (thường), ±400 ms (nhịp rộng) |
| Lỡ nhịp | nhịp không tính, nghi kéo thêm một nhịp; **không âm báo sai** |
| Chia phiên | Hồng Danh: 4 × 22; giữ tiến độ trong ngày |
| Hoạt ảnh | đứng – quỳ – cúi – đứng; camera nghiêng thấp phía sau |
| Âm | âm tiết hư cấu; danh hiệu Phật không đọc thành tiếng |
| Tổ đội | lạy chung đồng nhịp: không thêm thưởng (tránh biến sám thành cày nhóm) |

### Y-07 · Tụng theo nhịp mõ

| Mục | Yêu cầu |
|---|---|
| Nhịp | 60 / phút (thường), 40 / phút (niệm cùng người già, CQ-TD-14) |
| Công khóa | 8 đoạn, mỗi đoạn một nhịp mõ khác + một động tác (chắp tay, thắp hương, rảy nước) |
| Niệm chung | ≥ 3 người cùng điện cùng nhịp: `B +2` (05-10) |

### Y-08 · Lần chuỗi

| Mục | Yêu cầu |
|---|---|
| Đầu vào | một chạm / hạt theo nhịp 60 / phút |
| Số | 21 / 108 / 1.000; 1.000 chia phiên tùy ý trong ngày |
| Hiển thị | chuỗi hạt quay; **không** hiện chữ chú; âm tiết hư cấu |
| Số cố định | người chơi chọn trước (05-10 §B.4.1) |

### Y-09 · Quán tưởng dòng sáng

| Mục | Yêu cầu |
|---|---|
| Đầu vào | giữ điểm sáng ở giữa khi dòng nước sáng chảy từ trên xuống — giữ nhẹ, không giật |
| Vòng | 21 (≈ 4 phút) / 108 (≈ 18 phút, chia được) |
| Hình | trung tính (ánh sáng trắng, nước trong) — **không** hình tượng bổn tôn trước tham vấn |

### Y-10 · Cát hoa sen

| Mục | Yêu cầu |
|---|---|
| Đầu vào | rắc cát màu theo hoa văn hình học hư cấu đối xứng 8 cánh |
| Bước cuối | **bắt buộc gạt sạch**, đổ xuống suối |
| Chụp ảnh | được chụp trước khi gạt (ảnh lưu máy) |
| Tổ đội | bức chung 4 người, mỗi người một phần tư |
| Trước tham vấn | không mô phỏng mạn-đà-la Tạng |

### Y-11 · Canh lửa

| Mục | Yêu cầu |
|---|---|
| Đầu vào | giữ kim lửa trong vùng «văn hỏa» hoặc «vũ hỏa» theo lệnh |
| Biến thể | lò đan (TV), sắc thuốc cho thầy (DEED-104), nấu canh (BM) |
| Thành phẩm | thẩm mỹ (đan Huyền Giới), không dùng được; thuốc sắc theo **đơn có sẵn** của thầy thuốc (không lựa chọn kê đơn) |

### Y-12 · Thái Cực

| Mục | Yêu cầu |
|---|---|
| Đầu vào | giữ nhân vật theo đường vẽ chậm |
| Song luyện | hai người đồng bộ ≥ 80%: `B +2` mỗi người |
| Trợ năng | chế độ chọn tư thế theo nhịp, không cần di chuyển |
| Không có | lời hứa sức khỏe |

### Y-13 · Thắp đèn phố

| Mục | Yêu cầu |
|---|---|
| Cơ chế | đèn tắt theo hướng gió; người chơi thắp lại theo thứ tự cuối gió trước |
| Đạt | ≥ 80% đèn sáng trong 8 phút; mức cao ≥ 90% gió mạnh |
| Thế giới | đèn sáng hiện cho người chơi khác đi qua (không thưởng họ) |

### Y-14 · Chuyển kinh

| Mục | Yêu cầu |
|---|---|
| Cơ chế | mỗi người giữ một phẩm; lật trang theo nhịp chung; người bên cạnh «đỡ» trang lật sai bằng chạm cùng lúc |
| Người | 2–6; thiếu thì NPC đạo sĩ điền |
| Mục đích | luôn gắn một tang gia sự kiện; cảnh cuối có thẻ hỗ trợ mất người thân |

### Y-15 · Khoa nghi vai

| Mục | Yêu cầu |
|---|---|
| Vai | cao công (hạng IV), đô giảng, giám trai, thị hương, thị đăng, thị kinh |
| Đạt | đồng bộ tổng ≥ 70% |
| Không có | trình tự khoa nghi thật đầy đủ (TC-G4) |

### Y-16 · Hành hương

| Mục | Yêu cầu |
|---|---|
| Ngự vật | tắt trên đường hành hương |
| Việc nhỏ dọc đường | sinh DEED (nhặt sành, đỡ người già, trơn mưa) |
| Thời lượng | 8–12 phút / chặng; mưa +20% |

### Y-17 · Chép kinh / thư pháp

| Mục | Yêu cầu |
|---|---|
| Đầu vào | theo nét mờ; không chấm đẹp xấu, chỉ chấm đủ nét |
| Nội dung chép | câu ≤ 15 chữ từ dữ liệu app (`REMEDY_QUOTES`, `key_text`) |
| Câu đối Khuê Văn Các | ghép từ `REMEDY_QUOTES` |

### Y-18 · Hiệu đính kinh

| Mục | Yêu cầu |
|---|---|
| Dữ liệu | `_DZ_FIX` (số sai → đúng), `_DOWNGRADE` (độ chắc chắn) |
| Đầu vào | đối chiếu tên quyển với bảng, sửa số; đánh dấu «chưa chắc» |
| Bài học | «ghi chưa chắc mà đúng quý hơn ghi chắc mà sai» |

### Y-19 · An trạch

| Mục | Yêu cầu |
|---|---|
| Lưới | 9 cung theo `xuankongPan(năm)` + 8 phương Bát Trạch theo mệnh quái |
| Điểm | vượng 40 · ấn sát 30 · Bát Trạch 20 · hóa sát ngoại cảnh 10 |
| Ngưỡng | 70 → Phù Gia Trạch |
| Mô-đun | do tài liệu 08 (`MOD-*`) |
| Năm mới | chấm lại theo sao năm mới |

### Y-20 · Án «việc lạ»

Đặc tả đủ ở 05-13 (máy trạng thái QT-1…QT-7, danh mục 30 nguyên nhân, bộ sinh án). Yêu cầu riêng cho 09: phần «xem nhà» là tìm vật (tổ chuột, khe gió, ống rỉ, vật lạ trước cửa) trong 3 phút, có gợi ý sau 90 giây.

### Y-21 · Giải oan

| Mục | Yêu cầu |
|---|---|
| Cơ chế | như giải án (`cases.js`) nhưng là án người: lời khai, vật chứng, dòng thời gian |
| Kết | trình Phán quan; sự thật được đọc to; người có lỗi được mời sửa |
| Không có | cảnh trừng phạt, tra tấn |

### Y-22 · Kéo ở cầu Nại Hà

| Mục | Yêu cầu |
|---|---|
| Cơ chế | hai người giữ nhịp kéo – thả 2 phút; lệch nhịp thì chậm lại, không rơi |
| Đồng ý | người được kéo phải bấm nhận trước khi bắt đầu |
| Kết | người Tà Lộ bắt đầu CQ-HD-02; người kéo nhận DEED-037 / 161 |

---

## 3. Trợ năng chung

| Yêu cầu | Áp cho |
|---|---|
| Chế độ «nhịp rộng» (cửa sổ ±400 ms) **không giảm thưởng** | Y-05…Y-08, Y-12, Y-14, Y-15, Y-22 |
| Chế độ một nút | mọi mini-game nhịp |
| Giảm hiệu ứng (tắt chậm thời gian, rút màu, rung màn) | Y-01, Y-02, Ngũ Bộ |
| Phụ đề âm thanh (tiếng chuông, mõ) | mọi mini-game |
| Tạm dừng bất cứ lúc nào | mọi mini-game đơn |

## 4. Móc thưởng (hook) mà 09 phải phát

| Sự kiện | Trường |
|---|---|
| `minigame_done` | `kind (Y-xx), level, result ('vien'|'thanh'|'lai'), durationMs, rhythmDigest?, path?, incidentId?` |
| `minigame_part` | phiên chia (lạy, lần chuỗi): `kind, partIndex, partsTotal` |

Máy nhiệm vụ của hệ 05 (05-19 §4–5) đổi các sự kiện này ra Đạo Hạnh, tiến độ, giảm nghiệp — **mini-game không tự cộng điểm**.
