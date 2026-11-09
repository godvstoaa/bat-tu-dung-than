# 03 · Phần 11 — Cảnh cắt (`CUT-001…048`)

> Danh sách đầy đủ, từng cú máy. Bảng tổng ở README §4. Tập 12 (Trình bày) cấp mã nhạc `BGM-*` và âm hiệu `SFX-*`; ở đây nhạc ghi bằng **mã gợi ý N-xx** (bảng §0.3) để tập 12 ánh xạ.

## 0. Quy ước chung

### 0.1 Kỹ thuật

| Mục | Quy ước |
|---|---|
| Động cơ | cảnh cắt chạy **trong engine** (Three.js, `render3d.js`), không video dựng sẵn — để dữ liệu lá số, trang phục, đạo hiệu hiện đúng của từng người |
| Khung | giữ tỉ lệ màn hình người chơi; thêm hai dải đen mờ 6% chiều cao trên – dưới (không cắt nội dung UI phụ đề) |
| Tiêu cự | ống kính tương đương 35 mm cho cảnh người; 24 mm cho toàn cảnh; 85 mm cho cận mặt / cận vật |
| Tốc độ máy | dolly ≤ 1,2 m/s; quay chảo ≤ 25°/s (chống say); không rung máy giả lập trừ khi ghi rõ |
| Nhân vật người chơi | luôn mặc đúng trang phục hiện tại; hào quang theo hành Dụng (nếu gia trì đã mở) |
| Phụ đề | luôn bật cho thoại; cỡ chữ theo cài đặt người chơi |
| An toàn thị giác | không nhấp nháy sáng > 3 lần / giây (chuẩn chống động kinh); mọi «lóe vàng» của vết rạn là sáng dần 0,4 s, tắt dần 0,6 s |
| Bỏ qua | giữ phím 1 giây; cảnh «không bỏ qua» chỉ là cảnh hiện dữ liệu riêng của người chơi lần đầu (lần sau bỏ qua được) |
| Dữ liệu động | ô `{…}` lấy từ engine / cờ tại lúc phát; nếu thiếu dữ liệu (engine lỗi) thì cảnh dùng khung mặc định đã ghi trong cột «Dự phòng» |
| iOS | các cảnh có nội dung đoán vận (CUT-005, CUT-022) dùng biến thể iOS ghi ở từng cảnh |
| Thời lượng | ghi ở bảng; sai số cho phép ± 10% |

### 0.2 Mẫu bảng cú máy

`#` · `Thời điểm` (giây) · `Cú máy` (toàn / trung / cận / cận đặc tả / POV) · `Camera` (chuyển động) · `Nội dung` · `Âm thanh / thoại`

### 0.3 Nhạc gợi ý (tập 12 ánh xạ sang `BGM-*`)

| Mã gợi ý | Tính chất | Nhạc cụ chủ |
|---|---|---|
| N-01 | sương sớm, trong trẻo, dân gian | sáo trúc, đàn bầu nhẹ, trống cơm thưa |
| N-02 | nghi lễ, trang nghiêm, ấm | chuông, khánh, đàn tranh, trống lớn đánh thưa |
| N-03 | lạnh, chắc nịch (chủ đề Khổng tiên sinh) | đàn nguyệt gảy đơn, mõ, im lặng dài |
| N-04 | ấm, kể chuyện (chủ đề Vân Cốc) | đàn tranh, sáo, tiếng gió lùa vách tranh |
| N-05 | chợ, rộn, ánh sáng | nhạc chợ phiên: trống, phách, kèn bầu nhỏ |
| N-06 | căng, nghi ngờ (Định Mệnh Hội) | nhị kéo trầm, gõ gỗ đều |
| N-07 | gỗ, đinh, đêm (chủ đề Lỗ Ban) | tiếng gõ gỗ làm nhịp, đàn môi, tiếng bào |
| N-08 | mộng, lệch tông theo hành Kỵ | các nhạc cụ trên, chỉnh lệch nửa cung, vang dài |
| N-09 | trại bên sông (Miêu Cương) | khèn, sáo dọc, nước chảy — **sáng tác mới, không dùng nguyên giai điệu dân ca có thật khi chưa tham vấn** |
| N-10 | âm ty, sâu, không ghê rợn | trống trầm, chuông nhỏ xa, giọng ngân không lời |
| N-11 | trời cao, mở (Côn Lôn) | dàn dây, sáo, chuông ngọc, hợp xướng không lời |
| N-12 | hồi đầu, ấm sau lạnh | đàn tranh một mình rồi thêm sáo, kết bằng tiếng nước rót trà |

---

## CUT-001 · Trì Thủ Ca ở cổng thành

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-P-01 |
| Thời lượng | 0:55 |
| Bỏ qua | từ lần 2 |
| Nhạc | N-01; giọng trẻ con hát «Trì Thủ Ca» (tập 02 §1.4.4-b), không nhạc đệm ở câu cuối |
| Dự phòng | — |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–8 | toàn | đứng yên, sương | cổng Nam Huyền Thành trong sương, đường đá ướt | gà gáy xa, N-01 vào |
| 2 | 8–18 | trung | dolly chậm vào | 5 đứa trẻ chơi chuyền dưới vòm cổng | «Trăng rơi xuống hồ, ai vớt lên?» |
| 3 | 18–26 | cận | quay quanh tay trẻ | tay đứa bé tung que chuyền | «Ba vòng một lõi, xoay không ngừng…» |
| 4 | 26–38 | trung → toàn | cẩu lên theo câu hát | máy nâng qua mái cổng, lộ đường đá lên đồi | «Vòng ngoài chỉ đất, vòng giữa chỉ giờ, vòng trong chỉ biến — lõi chờ người ngồi.» |
| 5 | 38–48 | toàn (24 mm) | đứng | Thiên Mệnh Bàn treo trên Sơn Môn xa, ba vòng quay; vết rạn mờ | nhạc lặng |
| 6 | 48–55 | POV người chơi | hạ xuống mặt đất | đứa bé nhỏ nhất quay lại, chỉ tay vào máy | «Ai ngồi giữa lõi? Là con đấy thôi!» — cắt vào điều khiển |

## CUT-002 · Lật trụ

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-P-02 |
| Thời lượng | 0:40 + 0:08 mỗi trụ |
| Bỏ qua | không (lần đầu) |
| Nhạc | N-02; mỗi lần lật một tiếng khánh; trụ ngày tiếng chuông |
| Dữ liệu động | `pillars.{year,month,day,time}.{gan,zhi,ganGod}`; `F_HOUR_UNSURE` |
| Dự phòng | thiếu trụ giờ → tấm thứ tư lật nửa |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | toàn | từ trần nhìn xuống | vòng đá 24 sơn giữa Chính Đường, người chơi đứng giữa | gió lùa cửa |
| 2 | 10–20 | trung | dolly ngang qua giá | bốn tấm bài úp trên giá gỗ | Thầy: «Năm là gốc. Tháng là lệnh…» |
| 3 | 20–28 | cận đặc tả | đứng | tấm 1 lật: chữ can chi trụ năm sáng mực vàng | khánh |
| 4 | 28–36 | cận đặc tả | đứng | tấm 2 lật | khánh |
| 5 | 36–46 | cận đặc tả | dolly chậm vào | tấm 3 lật chậm gấp đôi; Nhật chủ phát sáng màu hành | chuông nhỏ |
| 6 | 46–54 | cận đặc tả | đứng | tấm 4 lật (hoặc dừng nửa chừng) | khánh / im |
| 7 | 54–72 | trung | quay vòng 180° quanh người chơi | bốn tấm bay lên xếp thành hàng sau lưng người chơi | N-02 lên |

## CUT-003 · Mệnh Bàn hiện

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-P-02 |
| Thời lượng | 0:25 |
| Nhạc | N-02 kết câu |
| Dữ liệu động | `wx.pct` (5 cột), `yong.primary` (màu vòng), `synthesis.score/gradeVi` |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–8 | trung | đứng | năm cột sáng mọc quanh vòng đá theo `wx.pct` | tiếng nước / gỗ / lửa / đất / kim theo từng cột |
| 2 | 8–15 | cận | dolly vào ngực người chơi | các cột co lại thành vòng ngọc màu hành Dụng | — |
| 3 | 15–22 | cận đặc tả | đứng | vòng ngọc khắc con số Tiềm Lực và tên Phẩm căn | Thầy đọc điểm |
| 4 | 22–25 | trung | lùi | vòng thu vào thành cuốn sổ trong tay người chơi | khép sổ |

## CUT-004 · Vết rạn chữ Ngọ – chữ Tý

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-P-05 |
| Thời lượng | 0:35 |
| Nhạc | không nhạc; tiếng sứ rạn (SFX) vọng |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–8 | toàn, góc thấp | ngước lên | Thiên Mệnh Bàn trên trời trong | gió cao |
| 2 | 8–16 | trung | quay chảo theo vòng Thời | chữ 午 sáng vàng | — |
| 3 | 16–24 | cận | trượt dọc vết rạn | đường rạn chạy từ 午 tới 子, sượt qua lõi | tiếng sứ rạn nhỏ, vọng |
| 4 | 24–30 | cận đặc tả | đứng | lõi Thiên Tâm: **không** nứt | im |
| 5 | 30–35 | trung | hạ xuống mặt Thầy Tử Bình đang ngẩng | — | Thầy: «Con thấy vết đó chứ.» |

## CUT-005 · Ông già ngẩng lên

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-P-06 |
| Thời lượng | 0:20 (bao quanh ba lời phán; lời phán là thoại tương tác, không nằm trong cảnh cắt) |
| Nhạc | N-03 |
| iOS | giữ nguyên hình; thoại theo biến thể 6.4 |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–6 | trung | đứng, ngang tầm ngồi | Khổng tiên sinh ngồi chiếu cói, cúi đầu, giở sổ | lật giấy |
| 2 | 6–12 | cận đặc tả | đứng | ngón tay dừng ở một trang trống, bút chấm mực | mõ một tiếng |
| 3 | (thoại tương tác: ba lời phán) | | | | |
| 4 | 12–17 | cận mặt (85 mm) | dolly vào rất chậm | ông ngẩng lên, nhìn thẳng máy | im |
| 5 | 17–20 | trung, qua vai ông | đứng | người chơi trong khung | «Ta nói sai câu nào chưa?» |

## CUT-006 · Ngã rẽ · Thuận Thiên

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-P-08 (TT) |
| Thời lượng | 0:45 |
| Nhạc | N-02 nhẹ |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | toàn | dolly qua cửa Tổ Sư Đường | điện tối, khám Tổ Sư có màn | cửa gỗ |
| 2 | 10–20 | trung | đứng | người chơi bước tới khám | bước chân trên gạch |
| 3 | 20–28 | cận đặc tả | đứng | ngọn đèn dầu trước khám tự sáng thêm một nấc | tiếng bấc nổ nhỏ |
| 4 | 28–38 | trung | quay sang Thầy | Thầy nhìn đèn, mặt không mừng | — |
| 5 | 38–45 | toàn | lùi qua cửa | người chơi cúi một lạy | khánh |

## CUT-007 · Ngã rẽ · Đắc Cứu

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-P-08 (DC) |
| Thời lượng | 0:45 |
| Nhạc | N-04 biến tấu, thêm tiếng chày giã thuốc |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–8 | trung | từ trong Trà Thất nhìn ra cửa | bóng đạo nhân gầy đeo hồ lô đồng | gió, chuông gió cửa |
| 2 | 8–16 | cận đặc tả | đứng | hồ lô đồng, nút gỗ, khói thuốc nhẹ | — |
| 3 | 16–28 | trung | dolly theo ông tới bàn | ông ngồi đối diện người chơi, không hỏi | rót nước |
| 4 | 28–38 | cận tay | đứng | ông dùng ngón tay vẽ hai chấm (bệnh) và hai vòng (thuốc) lên mặt bàn ướt | — |
| 5 | 38–45 | trung | đứng | ông uống cạn, gật đầu | «Thầy chỉ chỗ, con tự đi hái.» |

## CUT-008 · Ngã rẽ · Nghịch Thiên

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-P-08 (NT) |
| Thời lượng | 1:05 (hai phần) |
| Nhạc | phần 1: im lặng có tiếng gió; phần 2: N-04 vào rất nhẹ khi bà Năm Rêu đặt bát cháo |
| Ghi chú | **không** có góc máy nhìn xuống người chơi (tránh cảm giác bị hạ thấp); mọi góc ngang tầm hoặc thấp hơn |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | trung | ngang tầm | Tổ Sư Đường; người chơi tới khám | bước chân |
| 2 | 10–18 | cận đặc tả | đứng | ngọn đèn đứng yên | im |
| 3 | 18–28 | trung, ngang tầm | đứng | Thầy nhìn đèn, rồi nhìn người chơi — ánh mắt ấm | Thầy nói lệ |
| 4 | 28–36 | cận tay | đứng | Thầy đưa thẻ tre | — |
| 5 | 36–46 | toàn | dolly theo người chơi xuống bậc | trời chiều, mưa phùn bắt đầu | mưa |
| 6 | 46–58 | trung | từ trong phòng trọ nhìn ra | cửa sổ, Thiên Mệnh Bàn mờ trong mưa | mưa trên mái |
| 7 | 58–65 | cận | đứng | bà Năm Rêu đặt bát cháo bốc khói | N-04 vào |

## CUT-009 · Ngã rẽ · Dị Cách

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-P-08 (DK) |
| Thời lượng | 0:45 |
| Nhạc | sáo đơn (Phương sĩ thổi), gió lớn |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–8 | trung | ngước lên mái | sân Trà Thất, tiếng sáo trên cao | sáo |
| 2 | 8–18 | toàn, góc thấp | cẩu lên | người áo bạc màu ngồi vắt chân trên nóc, tóc buộc dây cỏ | gió |
| 3 | 18–30 | cận | đứng | Phương sĩ nhìn xuống, cười | «Này, người mới.» |
| 4 | 30–40 | trung | theo cú nhảy | ông nhảy xuống, đáp nhẹ, đi về phía cổng | — |
| 5 | 40–45 | toàn | đứng | bóng ông ngược nắng chiều | sáo nhỏ dần |

## CUT-010 · Bậc đá Hậu Sơn

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-1-09 |
| Thời lượng | 0:50 |
| Nhạc | N-04 |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | toàn | đứng | Hậu Môn mở ra sườn núi, bậc đá rêu | chim rừng |
| 2 | 10–24 | toàn (24 mm) | cẩu chậm dọc dốc | bậc đá ngoằn ngoèo lên vách | — |
| 3 | 24–36 | trung | dolly vòng | cây tùng cụt ngọn với ngọn mới | gió tùng |
| 4 | 36–46 | toàn | zoom quang học chậm | mái tranh bám vách đá như tổ chim | — |
| 5 | 46–50 | trung | sau lưng hai nhân vật | Thanh Phong và người chơi bắt đầu leo | Thanh Phong: «Ông sư với ông Khổng cãi nhau bốn mươi năm…» |

## CUT-011 · Tranh cuộn Liễu Phàm

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-1-10 |
| Thời lượng | 1:40 |
| Nhạc | N-04, chuyển N-03 ở đoạn «mọi chuyện đều ứng», trở lại N-04 khi gặp lão sư |
| Phong cách | tranh thủy mặc chuyển động (shader nét mực trên giấy dó); nhân vật trong tranh không có mặt chi tiết |
| Nguồn | `remedy-fate › LIAOFAN_STORY` |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh / thoại (Vân Cốc kể) |
|---|---|---|---|---|---|
| 1 | 0–10 | cận | đứng | tay Vân Cốc mở cuộn tranh | giấy sột soạt |
| 2 | 10–24 | tranh | trượt ngang | thầy họ Khổng đoán; chữ «14», «một chức», «không con», «53» hiện như nét mực | «…năm năm mươi ba tuổi thì mất.» |
| 3 | 24–40 | tranh | trượt ngang nhanh hơn | Liễu Phàm đi thi, đỗ, làm quan; từng chữ đoán được đóng dấu son «ứng» | N-03 |
| 4 | 40–54 | tranh | dừng | Liễu Phàm ngồi trên núi ba ngày, mây trôi qua, ông bất động | «Mệnh đã an, nghĩ cũng vô ích.» |
| 5 | 54–66 | tranh | dolly vào | lão sư cười | «…hóa ra ông là phàm phu.» |
| 6 | 66–86 | tranh | trượt ngang | cuốn sổ, nét công / quá; một đứa trẻ; bảng vàng tiến sĩ; ông già 74 | N-04 lên |
| 7 | 86–100 | cận | đứng | tranh cuộn lại trong tay Vân Cốc | «Ông sống tới bảy mươi tư.» |

## CUT-012 · Mệnh Đồ trải ra

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-1-12 |
| Thời lượng | 0:35 |
| Bỏ qua | không (lần đầu) |
| Dữ liệu động | `gaimenhPlan(R, {year}).layers[].{pri, name}` |
| Nhạc | N-04 |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–8 | toàn | đứng | mỏm đá trước am, hoàng hôn, Huyền Thành dưới xa | gió |
| 2 | 8–20 | cận tay | theo que than | Vân Cốc vẽ sáu nút nối nhau trên phiến đá | than cọ đá |
| 3 | 20–28 | cận đặc tả | đứng | nút thứ sáu (tích âm đức) vẽ đậm nhất | — |
| 4 | 28–35 | trung | cẩu lên | sáu nút sáng, bay vào Sổ Mệnh; nút có `pri` nhỏ sáng trước | chuông nhỏ |

## CUT-013 · Tờ cáo thị đỏ

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-1-13 |
| Thời lượng | 0:25 |
| Nhạc | N-05 tắt dần, N-06 vào |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–8 | trung | đứng | chị Mận giơ tờ giấy ban chợ, cười | chợ ồn |
| 2 | 8–14 | trung | quay chảo sang bảng cáo thị | tờ giấy đỏ chữ đen đậm | chợ nhỏ dần |
| 3 | 14–20 | cận đặc tả | trượt dọc | dòng «… Thân, Dần phạm Thái Tuế…» | N-06 |
| 4 | 20–25 | cận đặc tả | đứng | dấu son hình chiếc đinh mũ tròn | một tiếng gõ gỗ (gieo N-07) |

## CUT-014 · Lễ nhập sổ

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-1-14 |
| Thời lượng | 0:50 |
| Nhạc | N-02 |
| Dữ liệu động | `{ten}`, ngày tới, việc thiện đầu tiên; trang đệ tử / khách học |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | toàn | dolly giữa hai hàng đệ tử | Chính Đường, chuông chín tiếng | chuông |
| 2 | 10–20 | cận | đứng | Thanh Phong mài mực | mài mực |
| 3 | 20–34 | cận đặc tả | theo ngòi bút | Thầy viết tên, ngày, việc đầu tiên | bút lông |
| 4 | 34–44 | trung | đứng | Thầy trao thẻ du phương | — |
| 5 | 44–50 | toàn | lùi qua cửa | người chơi quay ra, ánh sáng sân | N-02 kết |

## CUT-015 · Bảy cổng Đình Truyền Đạo

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-2-01 |
| Thời lượng | 0:45 |
| Nhạc | N-02 + mỗi cổng một âm sắc (khánh Long Hổ, chuông Võ Đang, mõ Chung Nam, chuông đồng Mao Sơn, chuông chùa Yên Tử, mõ Bút Tháp, trống Văn Miếu) |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–6 | toàn | đứng | Đình tám cổng, khói nhang tám màu | — |
| 2 | 6–34 | trung | dolly vòng, dừng 4 giây mỗi cổng | bảy sứ giả, mỗi người một cử chỉ chào theo truyền thống mình | âm sắc từng cổng |
| 3 | 34–42 | trung | dừng lâu | cổng thứ tám khép, dải cờ gió năm màu bay | gió, không âm sắc |
| 4 | 42–45 | toàn | cẩu lên | người chơi đứng giữa Đình | — |

## CUT-016 · Quầy đỏ đóng cửa

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-2-02 (và mẫu chung cho các án lừa, đổi người bán / tang vật) |
| Thời lượng | 0:30 |
| Nhạc | N-06 tắt, N-05 trở lại |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–8 | trung | đứng | Hà Tam gấp vải đỏ | vải |
| 2 | 8–14 | cận | đứng | treo bảng «Mồng một mở lại» | đinh gỗ |
| 3 | 14–22 | trung | theo bước | ông đi qua đám đông; đám đông dạt ra, không ai xô | tiếng xì xào |
| 4 | 22–26 | cận đặc tả | đứng | con dấu son rơi khỏi tay áo xuống đất | tiếng rơi nhỏ |
| 5 | 26–30 | toàn | cẩu lên | quầy trống; cột gỗ; chợ đông trở lại | N-05 |

## CUT-017 · Dấu đục trên Bút gãy

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-2-06 |
| Thời lượng | 0:25 |
| Nhạc | N-07 (lần đầu đủ) |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–8 | cận | xoay theo tay | cây bút gãy trong tay người chơi | gõ gỗ |
| 2 | 8–16 | cận đặc tả (macro) | trượt dọc cán | ký hiệu Huyền Văn: vòng tròn và đinh | — |
| 3 | 16–22 | cận đặc tả | đứng | vết đục nhỏ hình cái thước thợ | tiếng bào xa |
| 4 | 22–25 | trung | lùi | sau lưng người chơi, góc sân Văn Miếu tối dần | — |

## CUT-018 · Ba nén nhang

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-2-16 |
| Thời lượng | 0:40 |
| Dữ liệu động | màu ba làn khói theo ba đạo thống đã nhập môn |
| Nhạc | ba âm sắc của ba cổng hòa thành một hợp âm |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | cận | đứng | tay người chơi cắm từng nén | ba âm sắc lần lượt |
| 2 | 10–26 | trung → toàn | cẩu theo khói | ba làn khói bay lên, quấn vào nhau ở độ cao mái | hợp âm |
| 3 | 26–34 | toàn | đứng | khói tan trên mái Đình | — |
| 4 | 34–40 | trung | đứng | ba sứ giả gật đầu | Minh Tâm: «Ba làn khói bay lên một chỗ.» |

## CUT-019 · Mười sáu chữ

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-2-19 |
| Thời lượng | 0:35 |
| Nhạc | N-02, mỗi chữ một nốt đàn tranh, 16 nốt |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–6 | cận | đứng | Tú Nhi trải cuộn giấy | giấy |
| 2 | 6–26 | cận đặc tả | quay tròn theo vòng chữ | 16 chữ sáng lần lượt, bắt đầu từ 天 | 16 nốt |
| 3 | 26–32 | trung | đứng | Tú Nhi đọc to | «Thiên định kỳ khuông, nhân thư kỳ tự…» |
| 4 | 32–35 | cận | lật | mặt sau: chữ đục màu nâu | gõ gỗ một tiếng |

## CUT-020 · Vòng Biến đứng lại

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-2-21 |
| Thời lượng | 1:00 |
| Nhạc | N-07, kết bằng tiếng kẽo kẹt dài của vòng đá |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | toàn, đêm | đứng | giá đỡ Bàn Đài dưới trăng mờ | cộc… cộc… |
| 2 | 10–22 | trung, sau lưng | đứng | bóng người gầy, lưng hơi còng, vồ gỗ giơ lên | gió |
| 3 | 22–28 | cận đặc tả | đứng | cây đinh gỗ đen lút vào mộng | một nhát vồ |
| 4 | 28–42 | toàn, góc thấp | ngước theo | vòng Biến chậm dần, đứng yên; hai vòng ngoài vẫn quay | kẽo kẹt dài |
| 5 | 42–50 | cận | đứng | vết rạn vòng Thời sáng dần (0,4 s), tắt dần (0,6 s) | — |
| 6 | 50–56 | trung | đứng | bóng người quay nửa mặt — không lộ rõ | «Đọc đủ mười sáu chữ rồi phải không. Hay lắm.» |
| 7 | 56–60 | toàn | đứng | đèn bão tắt; khi sáng lại, sàn trống | im |

## CUT-021 · Gối đá

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-3-02 |
| Thời lượng | 0:30 |
| Nhạc | N-04 → N-08 |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–8 | trung | đứng | người chơi nằm trên phiến đá, đầu gối đá tròn | Vân Cốc tụng rất nhỏ |
| 2 | 8–22 | toàn | cẩu thẳng đứng lên | am nhỏ dần, núi nhỏ dần, đèn Huyền Thành | N-08 vào |
| 3 | 22–30 | toàn | đứng | khung hình mờ trắng rồi ám màu hành Kỵ | vang dài |

## CUT-022 · Thế giới năm Y*

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-3-03 |
| Thời lượng | 0:40 |
| Bỏ qua | không (lần đầu) |
| Dữ liệu động | `Y*.ganZhi`; `taiSuiGeneral(Y*)`; màu `yong.ji`; tuổi NPC + (Y* − nowYear) |
| iOS | lịch treo tường ghi «năm khó tự khai» người chơi đã chọn |
| Nhạc | N-08 |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–8 | POV | mở mắt (chớp 2 lần) | trần nhà riêng có vết dột | mưa nhỏ |
| 2 | 8–16 | cận đặc tả | đứng | tờ lịch: «Giáp 34 · {Y*}» | — |
| 3 | 16–28 | trung | dolly theo người chơi ra cửa | đường Bàn Đài ám màu Kỵ; mái nhà cũ hơn | — |
| 4 | 28–36 | trung | đứng | Thanh Phong 25 tuổi gọi từ ngõ | «Năm mới rồi mà ngủ!» |
| 5 | 36–40 | toàn | cẩu lên | Thiên Mệnh Bàn với chữ năm Y* sáng | — |

## CUT-023 · Kỵ thần lâm môn (5 biến thể)

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-3-08 |
| Thời lượng | 0:45 mỗi biến thể |
| Nhạc | N-08 dồn nhịp; **không** nhạc kinh dị; không cảnh người bị thương |

| Biến thể | Cú mở (0–15) | Cú giữa (15–35) | Cú kết (35–45) |
|---|---|---|---|
| Thổ | toàn: mưa dầm trên sườn Hậu Sơn | trung: bùn trượt chắn đường, bốn người phía trên vẫy | cận: tay người chơi nắm cổ tay Ông Kha |
| Hỏa | toàn: gió hanh qua chợ | trung: sạp vải bén lửa, khói | cận: người chơi dìu ông lái đò ra khỏi khói |
| Kim | toàn: mây đen trên phố Thợ | trung: mưa đá gõ mái như kim loại | cận: tay người chơi che lỗ mái trên đầu Ông Kha |
| Thủy | toàn: hồ dâng tràn xóm chài | trung: nước tới hông, thuyền giật dây | cận: tay người chơi tháo dây thuyền, chèo về phía nhà bác Thủy |
| Mộc | toàn: bão thổi rừng đào Thư Lâu | trung: cây đổ chắn cửa Thư Lâu | cận: người chơi kéo thủ thư già qua khe cửa sổ |

## CUT-024 · Tỉnh mộng

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-3-09 |
| Thời lượng | 0:30 |
| Nhạc | N-08 tan, N-04 vào |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–8 | toàn | đứng | màu Kỵ rút khỏi khung hình như mực tan trong nước | — |
| 2 | 8–18 | POV | mở mắt | trời trước bình minh, Vân Cốc ngồi bên | gió |
| 3 | 18–30 | trung | đứng | Vân Cốc khoác áo sương | «Con về rồi. Năm ấy dài không?» |

## CUT-025 · Người thợ không tên

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-3-11 |
| Thời lượng | 0:50 |
| Nhạc | N-07 |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | toàn | từ ngoài cửa xưởng | ánh đèn trong xưởng Ông Kha giữa đêm | cộc… cộc… |
| 2 | 10–20 | trung | dolly qua cửa | ông già áo nâu ngồi ghế đẩu bào gỗ đen | tiếng bào |
| 3 | 20–30 | cận tay | đứng | bàn tay chai, mũi đục, vỏ bào cuộn | — |
| 4 | 30–42 | cận mặt | đứng | ông ngẩng lên — lần đầu thấy rõ mặt: gầy, bình thản, không ác | «Vào đi. Xưởng này ta dựng.» |
| 5 | 42–50 | trung | đứng | Âm Bài đặt lên bàn bào | không nhạc |

## CUT-026 · Bè từ thượng nguồn

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-3-13 |
| Thời lượng | 0:45 |
| Nhạc | N-09 (lần đầu) |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | toàn | đứng | bến sông Huyền Thành chiều | tù và xa |
| 2 | 10–22 | toàn → trung | theo dòng | bè gỗ sam nhỏ trôi về, khăn lam vải sáp ong | nước, N-09 |
| 3 | 22–32 | cận | đứng | ống tre niêm sáp, bó thảo dược buộc chỉ màu | — |
| 4 | 32–40 | cận đặc tả | đứng | lá thư chữ nắn nót | giọng A Mậu đọc (thổ âm) |
| 5 | 40–45 | trung | đứng | Khổng tiên sinh đứng sau, nhìn bè | «Miêu Cương.» |

## CUT-027 · Quỷ Môn Quan mở

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-4-06 |
| Thời lượng | 0:40 |
| Nhạc | N-10 |
| Ghi chú | Phong Đô **không ghê rợn**: tối, lạnh, trang nghiêm; không máu, không xác, không quái |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | toàn | đứng | cổng đá đen trong sương, đèn đỏ và đèn lam | N-10 |
| 2 | 10–20 | trung | dolly chậm | người áo nâu ngồi bậc đá, tích trượng sáu vòng | sáu vòng khẽ chạm |
| 3 | 20–30 | cận mặt | đứng | Địa Tạng sứ giả ngẩng lên, ánh mắt hiền | «Người sống. Có lệnh bài.» |
| 4 | 30–40 | toàn | qua vai người chơi | đường đá dốc xuống trong sương | — |

## CUT-028 · Cầu Nại Hà

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-4-08 |
| Thời lượng | 0:35 |
| Nhạc | N-10, thêm chuông nhỏ khi máy qua chín trụ đèn |
| MMO | cảnh dùng vị trí thật của người chơi khác trong phòng (nếu có) |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | toàn (24 mm) | cẩu ngang | ba cầu vòm song song: đèn vàng, đèn lam, đá đen | nước chảy chậm |
| 2 | 10–20 | trung | trượt ngang qua chín trụ đèn | trụ đèn nối ngang ba cầu | chín chuông nhỏ |
| 3 | 20–30 | trung | đứng | trên cầu Ác: những bóng người cúi đầu (người chơi Tà Lộ / hồn khách) | — |
| 4 | 30–35 | trung | qua vai | Địa Tạng sứ giả sau lưng người chơi | «Họ tự bước.» |

## CUT-029 · Vọng Hương Đài

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-4-09 |
| Thời lượng | 0:45 (ghép tối đa 6 khung từ cờ) |
| Nhạc | N-12 (bản không kết) |
| Dữ liệu động | bảng ưu tiên khung ở MQ-4-09 |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–6 | toàn | cẩu lên đỉnh đài | gió thổi xuống; sương phía xa thành mặt nước | gió |
| 2 | 6–42 | trung (mỗi khung 6 s) | chuyển cảnh qua mặt nước gợn | các khung đời thường ở Huyền Thành, Miêu Cương, Bút Tháp | âm thanh môi trường của từng khung, nhỏ |
| 3 | 42–45 | cận | đứng | ba lá thư bay lên đài, dừng trước người chơi | giấy |

## CUT-030 · Sổ mở

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-4-10 |
| Thời lượng | 0:30 |
| Nhạc | N-10 → N-02 rất nhẹ |
| Dữ liệu động | `meritLedger.{thienCount, acCount, net}` |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | toàn | dolly vào điện | Điện Sổ, án thư dài | — |
| 2 | 10–20 | cận đặc tả | trượt dọc trang | Sổ Công Quá của người chơi phóng lớn, hai cột | giấy |
| 3 | 20–30 | cận mặt | đứng | Phán quan Thôi ngẩng lên | «Sổ người sống còn đang viết.» |

## CUT-031 · Người đóng đinh

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-4-12 |
| Thời lượng | 1:10 (hai phần, xen thoại tương tác) |
| Nhạc | N-07 phần 1; im lặng khi Phán quan đọc; N-12 vào ở dòng «bốn mươi mốt dòng bên trái chưa mờ» |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | toàn | cẩu xuống | Điện Chuyển Luân tròn, sâu; Sổ Lớn tự viết, tự mờ | lửa âm ỉ |
| 2 | 10–20 | trung | đứng | Công Thâu Nghiệt cầm đinh dài và vồ | — |
| 3 | (thoại tương tác 12.1–12.2) | | | | |
| 4 | 20–50 | cận đặc tả | trượt theo dòng chữ | từng dòng đời ông hiện khi Phán quan đọc: cầu tre, đứa trẻ tên Kha, giá đỡ, mười sáu chữ, cầu phong vũ | im lặng, chỉ giọng Phán quan |
| 5 | 50–60 | cận mặt | dolly rất chậm | mặt Công Thâu Nghiệt — lần đầu dao động | N-12 |
| 6 | 60–70 | cận tay | đứng | cây đinh hạ xuống đất | tiếng gỗ chạm đá |

## CUT-032 · Đường lên

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-4-13 |
| Thời lượng | 0:50 |
| Nhạc | N-10 → N-11 |
| Dữ liệu động | `F_LOBAN` (có / không Công Thâu Nghiệt ở giá đỡ) |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–14 | trung | theo lưng người chơi lên cầu thang xoắn | mỗi bậc một ngọn đèn nhỏ | bước chân |
| 2 | 14–22 | toàn | đứng ở cửa núi | ánh ngày tràn vào | N-11 |
| 3 | 22–36 | trung | đứng | giá đỡ Bàn Đài, rạng sáng; Ông Kha (và thầy) tháo mộng | tiếng gỗ |
| 4 | 36–44 | toàn, góc thấp | ngước | vòng Biến kêu dài rồi quay; ba vòng xoay ngược nhau | kẽo kẹt → tiếng gió đều |
| 5 | 44–50 | trung | đứng | Thầy Tử Bình dưới sân ngẩng lên | «Vòng Biến quay rồi.» |

## CUT-033 · Hạc về Côn Lôn

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-E-02 |
| Thời lượng | 1:00 |
| Nhạc | N-11 |
| Dữ liệu động | màu vệt bay = hành Dụng |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | toàn | đứng | Thiên Bàn Đảo, bệ trống có vết lõm tròn | gió cao |
| 2 | 10–20 | trung | đứng | người chơi thổi lông hạc | tiếng sáo nhẹ |
| 3 | 20–34 | toàn | quay vòng | đàn hạc lượn quanh bệ ba vòng | tiếng cánh |
| 4 | 34–50 | toàn (24 mm) | bay theo, lùi xa | Huyền Thành, Bàn với vết rạn vàng, 12 thánh địa dưới mây | N-11 lên |
| 5 | 50–60 | toàn | cẩu lên | quần đảo Côn Lôn hiện trong mây, thác đổ | thác |

## CUT-034 · Dao Trì soi bóng

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-E-03 |
| Thời lượng | 0:45 |
| Bỏ qua | không (lần đầu) |
| Dữ liệu động | bốn trụ (giống CUT-002); ánh sáng = Đạo Hạnh / 4.500; dấu Hồi Đầu (sợi chỉ đỏ) |
| Nhạc | N-11 rồi lặp lại 4 tiếng khánh của CUT-002 |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–8 | toàn | đứng | hồ ngọc phẳng, chỗ trống giữa hồ | gió nhẹ |
| 2 | 8–14 | POV | nhìn xuống | bóng người chơi trong nước | — |
| 3 | 14–30 | cận đặc tả | đứng | bốn tấm bài hiện trong nước, lật lần lượt — y hệt lễ lật trụ | 4 khánh |
| 4 | 30–40 | trung | cẩu lên chậm | ánh sáng dâng từ đáy hồ quanh bóng người chơi | N-11 |
| 5 | 40–45 | cận | đứng | (Hồi Đầu) sợi chỉ đỏ mảnh trong ánh sáng | — |

## CUT-035 · Bàn về hồ

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-E-05 |
| Thời lượng | 1:30 (bản đầy đủ khi máy chủ đạt 45N); 0:30 (bản rút gọn khi chưa đạt) |
| Nhạc | N-11 đầy đủ; Trì Thủ đọc 16 chữ, mỗi chữ một nốt như CUT-019 |
| Dữ liệu động | `F_LOBAN` (bóng dưới đáy hồ / bóng trong đám đông / không bóng) |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–15 | toàn | cẩu theo | đàn hạc nâng Bàn khỏi giá đỡ Sơn Môn | tiếng cánh, chuông Sơn Môn |
| 2 | 15–40 | toàn (24 mm) | bay theo Bàn | Bàn qua 12 thánh địa; mỗi nơi một âm sắc | 12 âm sắc |
| 3 | 40–55 | toàn | đứng | Bàn hạ xuống Thiên Trì; mặt hồ in ba vòng | nước |
| 4 | 55–75 | cận đặc tả | quay theo vòng Thời | Trì Thủ đọc 16 chữ; vết rạn 午–子 đông thành đường vàng | 16 nốt |
| 5 | 75–85 | trung | đứng | Vân Cốc và người chơi ở mép hồ | «Chỗ nứt là chỗ ánh sáng vào.» |
| 6 | 85–90 | toàn | đứng | (biến thể `F_LOBAN`) | — |

Bản rút gọn: #1 thay bằng đàn hạc lượn quanh Bàn ở Sơn Môn; bỏ #2–#4; #5 thoại «Năm nay chưa đủ. Năm sau.»

## CUT-036 · Thiên Bảng khắc tên

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-E-06 |
| Thời lượng | 0:30 |
| Nhạc | N-02 |
| Dữ liệu động | đạo hiệu, cảnh giới, dấu danh hiệu |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | toàn | đứng | bảng đá trước Chính Đường, hai hàng đệ tử | — |
| 2 | 10–22 | cận đặc tả | theo mũi đục | thợ đá khắc đạo hiệu người chơi | đục đá |
| 3 | 22–30 | trung | đứng | Thầy Tử Bình đọc tên | «Thầy giữ lời.» |

## CUT-037 · Lập Xuân

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-E-07 (mỗi mùa) |
| Thời lượng | 0:40 |
| Nhạc | N-01 (gợi lại CUT-001) |
| Dữ liệu động | năm can chi mới; tượng Thái Tuế trị niên mới |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | toàn | đứng | cổng Nam trong sương, trẻ con chơi chuyền (như CUT-001) | Trì Thủ Ca |
| 2 | 10–20 | trung | dolly | Lão Tùng quét bậc | chổi tre |
| 3 | 20–32 | trung | cắt sang Thái Tuế Điện | tượng trị niên mới được đặt lên bệ đúng phút Lập Xuân | chuông |
| 4 | 32–40 | toàn | cẩu lên | Thiên Mệnh Bàn quay với đường hàn vàng | «Là con đấy thôi!» |

## CUT-038 · Tấm bài đen

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | TL-01 |
| Thời lượng | 0:35 |
| Nhạc | không nhạc; chỉ âm thanh môi trường của nhà riêng |
| Ghi chú | tấm bài **không** phát sáng, không có âm thanh siêu nhiên |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | trung | đứng | người chơi đặt bài lên bàn ngồi | gỗ chạm gỗ |
| 2 | 10–22 | cận đặc tả | đứng | tấm bài đen cạnh bình nước hành Dụng | im |
| 3 | 22–30 | cận đặc tả | đứng | mặt nước trong bình, không gợn | — |
| 4 | 30–35 | cận | đứng | mảnh gỗ chữ đục: «Ta không thích nợ ẩn.» | — |

## CUT-039 · Con số trên trán

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | TL-08 |
| Thời lượng | 0:20 |
| Nhạc | N-05 tắt dần còn tiếng chợ |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–8 | trung, ngang vai | theo bước | con số nhỏ đỏ sẫm trên đầu người chơi | chợ |
| 2 | 8–16 | trung | quay chảo | người đi chợ liếc lên rồi nhìn đi | chợ nhỏ dần |
| 3 | 16–20 | cận | đứng | thiếu niên ngước nhìn | «Số đó là gì vậy?» |

## CUT-040 · Hồi Đầu

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | TL-13 |
| Thời lượng | 1:00 |
| Nhạc | N-12 đầy đủ, kết bằng tiếng rót trà |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | trung | đứng | cửa gian sau Bàn Thầy; người chơi gõ ba tiếng | gõ cửa |
| 2 | 10–18 | trung | đứng | cửa mở ngay; Thầy đứng sau cửa | — |
| 3 | 18–30 | cận đặc tả | đứng | Sổ Mệnh: dòng «Nợ Âm» mờ đi, sợi chỉ đỏ chạy dọc mép trang | N-12 vào |
| 4 | 30–45 | toàn | dolly qua sân sang Trà Thất | Dì Hạnh đi khập khiễng, bé Lúa pha trà | sân Sơn Môn |
| 5 | 45–60 | cận | đứng | bé Lúa đặt chén trước người chơi | tiếng rót trà |

## CUT-041 · Thủ Cách

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | BR-TT-07 |
| Thời lượng | 0:35 |
| Nhạc | N-02 |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | cận | đứng | tay người chơi châm đèn lần thứ một trăm (bộ đếm khắc trên chân đèn) | bấc |
| 2 | 10–20 | cận đặc tả | đứng | đèn sáng thêm một nấc | — |
| 3 | 20–35 | trung | quay sang Thầy | Thầy gật | «Lần này là con châm đủ một trăm tối.» |

## CUT-042 · Thang thuốc

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | BR-DC-07 |
| Thời lượng | 0:40 |
| Nhạc | N-04 + tiếng lửa lò |
| Dữ liệu động | số vị thuốc = số sợi khói |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | toàn | đứng | lò đồng ba chân giữa sân Thái Hòa cung | lửa |
| 2 | 10–24 | cận | theo tay | từng vật kỷ niệm đặt vào lò, mỗi vật một sợi khói màu | — |
| 3 | 24–34 | trung | đứng | khói tan; trong lò một cuốn sổ bìa gỗ đào | — |
| 4 | 34–40 | cận | đứng | Cát Huyền mở trang một | «Rèn dao cắt thuốc…» |

## CUT-043 · Cổng mở

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | BR-NT-07 |
| Thời lượng | 0:50 |
| Nhạc | im lặng → N-12 khi đèn sáng nấc thứ hai |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | trung, ngang tầm | đứng (đối xứng với CUT-008 #1) | người chơi bước vào Tổ Sư Đường | bước chân |
| 2 | 10–20 | cận đặc tả | đứng | đèn sáng một nấc | — |
| 3 | 20–28 | cận đặc tả | đứng | đèn sáng thêm nấc nữa | N-12 |
| 4 | 28–42 | trung | quay sang Thầy | Thầy đứng sau, không ngạc nhiên | «Đèn sáng.» |
| 5 | 42–50 | cận đặc tả | đứng (chèn hồi tưởng) | dòng chữ dưới cửa sổ Mái Rêu: «Đèn không sáng thì mình sáng. — K.» | — |

## CUT-044 · Dị Nhân

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | BR-DK-07 |
| Thời lượng | 0:40 |
| Nhạc | sáo đơn (gợi CUT-009) |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–12 | cận đặc tả | theo ngòi bút | trang giáo trình mới, ba đoạn ghép | bút |
| 2 | 12–24 | cận | đứng | dòng tác giả: «Vô Danh» (hoặc tên người chơi) | — |
| 3 | 24–34 | trung | đứng | Thanh Phong nhận trang | — |
| 4 | 34–40 | toàn | cắt sang đồi gió | lá cờ của Phương sĩ đổi hướng theo gió | sáo |

## CUT-045 · Văn đấu: Bàn Minh đọc đủ

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-2-20 (vòng 1) |
| Thời lượng | 0:40 |
| Nhạc | N-02 + 16 nốt (như CUT-019) |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–8 | toàn | đứng | sân Chính Đường đông người | xì xào |
| 2 | 8–16 | trung | đứng | bản dập đặt cạnh bia tám chữ | giấy |
| 3 | 16–32 | toàn, chiếu lên vách | quay theo vòng | 16 chữ sáng trên vách Chính Đường; tám chữ của bia mờ thành nửa vòng | 16 nốt |
| 4 | 32–40 | trung | quay chảo qua đám đông | người dân đọc theo, môi mấp máy | đám đông im |

## CUT-046 · Khổng tiên sinh gấp sổ

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-E-04 |
| Thời lượng | 0:35 |
| Nhạc | N-03 → N-04 (hai chủ đề hòa nhau ở nốt cuối) |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–12 | cận đặc tả | trượt dọc | trang sổ hai cột: trái «lời phán», phải «người nghe đã làm gì» | — |
| 2 | 12–20 | cận tay | đứng | bìa gỗ khép lại | gỗ |
| 3 | 20–26 | cận tay | đứng | ngón tay gõ ba lần lên bìa rồi dừng | ba tiếng mõ |
| 4 | 26–35 | cận mặt | dolly chậm | Khổng tiên sinh nhìn ra hồ | «Người ta đoán không còn là người ấy.» |

## CUT-047 · Hang dưới trại

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | MQ-4-04 |
| Thời lượng | 0:35 |
| Nhạc | N-09 → N-07 |
| Ghi chú | hang là **xưởng mộc** của người ngoài, không phải nơi thờ cúng của trại; không đồ vật tín ngưỡng Miêu nào xuất hiện trong hang |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–8 | toàn | đứng | thác nhỏ, vách đá vôi | thác |
| 2 | 8–16 | trung | dolly qua màn nước | cánh cửa gỗ ghép mộng không bản lề | — |
| 3 | 16–26 | cận tay | đứng | thước thợ của Ông Kha đo khe mộng | gỗ |
| 4 | 26–35 | trung | dolly vào hang | xưởng mộc gọn, ba giá bài đen, chum sơn, ống tre dẫn ra suối | N-07, gõ gỗ |

## CUT-048 · Đêm gõ cửa

| Mục | Giá trị |
|---|---|
| Nhiệm vụ | BR-NT-03 |
| Thời lượng | 0:40 |
| Nhạc | mưa → N-04 |

| # | Thời điểm | Cú máy | Camera | Nội dung | Âm thanh |
|---|---|---|---|---|---|
| 1 | 0–10 | trung | từ trong phòng | cửa gỗ, mưa ngoài hiên | ba tiếng gõ |
| 2 | 10–18 | trung | đứng | cửa mở: lão tăng ướt vai, đèn lồng giấy | mưa |
| 3 | 18–30 | cận | đứng | Vân Cốc ngồi xuống chiếu, pha trà | nước sôi, N-04 vào |
| 4 | 30–40 | cận mặt | đứng | Vân Cốc nhìn lên | «Mệnh do ta tạo, phúc tự mình cầu.» |

---

## Kiểm thử nghiệm thu cảnh cắt

| # | Kiểm | Đạt khi |
|---|---|---|
| 1 | Không nhấp nháy > 3 Hz | phân tích khung hình tự động trên mọi cảnh có vết rạn / lửa / đèn |
| 2 | Dữ liệu động đúng | 5 lá số mẫu phát CUT-002, 012, 022, 034 ra đúng chữ / màu |
| 3 | Không cảnh bạo lực, không thương tích hiện hình | duyệt từng cú máy CUT-023, 027–031 |
| 4 | Miêu Cương | CUT-026, 047: không biểu tượng tín ngưỡng thật bị gán cho cái ác |
| 5 | Góc máy nhánh NT không nhìn xuống người chơi | CUT-008, 043 |
| 6 | Bỏ qua | mọi cảnh trừ các cảnh «không bỏ qua lần đầu» |
