# 01 · Phần 14 — Định hướng âm thanh, nguyên tắc UX, mục tiêu trợ năng

> Định hướng cấp tầm nhìn. Mã `BGM-*`, `SFX-*`, `UI-xx` thuộc tài liệu 12 (canon §9); phần này không cấp mã, chỉ đặt chuẩn.
>
> Gốc code: `audio.js` (âm tổng hợp WebAudio, **mặc định tắt**, bật bằng nút 🔈; gió nền; `bell(392 Hz)`, `knock`, `rattle` cho ống xăm), `haptics.js` (rung 8 / 16 / 30 ms), `features.js` (iOS), chế độ `reduced`.

## 1. Âm thanh — nguyên tắc

| # | Nguyên tắc | Nghĩa | Ví dụ |
|---|---|---|---|
| A1 | **Âm có nguồn** | mọi âm có vật phát ra trong cảnh (chuông, mõ, suối, gió qua trúc) | chuông giờ Mão phát từ lầu chuông, nghe to dần khi lại gần |
| A2 | **Im lặng là chất liệu** | ngân sách im lặng (phần 6 §7.5); nhạc nền có khoảng nghỉ dài | sau câu kết Vĩ thanh: 4 giây không nhạc |
| A3 | **Giờ can chi đổi nhạc** | mật độ nhạc theo giờ: Tý thưa nhất, Tỵ – Ngọ dày nhất | §1.2 |
| A4 | **Thưởng là chuông, không là kèn** | âm thưởng thuộc họ chuông, khánh, mộc; không fanfare | chuông nhỏ khi nhận Đạo Hạnh |
| A5 | **Không âm thanh dọa** | không jump-scare, không tiếng hét; Phong Đô dùng nước, gió, khánh trầm | — |
| A6 | **Tụng niệm cần phép** | không thu âm nghi lễ thật khi chưa xin phép; tụng trong game là hòa âm không lời rõ hoặc bản ghi được phép (`VD-T6-24`) | — |
| A7 | **Không chân ngôn đầy đủ** | không hát / đọc trọn thần chú (Lăng Nghiêm, chân ngôn Mật) | — |
| A8 | **Mặc định có âm, dễ tắt** | bản AAA bật âm mặc định ở mức 60 %, có nút tắt trong một chạm (hiện nay mặc định tắt vì là web nhẹ) | — |

### 1.1 Ba lớp âm

| Lớp | Nội dung | Mức (so nhạc) |
|---|---|---|
| **Môi trường** | gió, nước, côn trùng, người, chuông giờ | 100 % (lớp nền chính) |
| **Nhạc** | nhạc vùng theo giờ | 60–80 % |
| **Tương tác** | bước chân theo mặt đất, chạm, dấu, chuông thưởng | 90 % |

### 1.2 Mật độ nhạc theo thời thần

| Thời thần | Mật độ | Nhạc cụ được phép |
|---|---|---|
| Tý | 0–10 % (gần như chỉ môi trường) | một nhạc cụ đơn, cách quãng ≥ 20 s |
| Sửu, Dần | 15 % | tiêu, cổ cầm đơn |
| Mão | 40 % | chuông sớm mở đầu, tiêu / sáo |
| Thìn, Tỵ | 70 % | đủ bè của vùng |
| Ngọ | 80 % (đỉnh) | đủ bè |
| Mùi, Thân | 60 % | bớt bè gõ |
| Dậu | 50 % | trống chiều mở đầu |
| Tuất, Hợi | 30 % | bè dây trầm, chuông gió |

## 2. Nhạc cụ và màu âm theo truyền thống

| Truyền thống / vùng | Nhạc cụ chủ | Thang âm / điệu | Nhịp | Vai trò cảm xúc | Không dùng |
|---|---|---|---|---|---|
| Huyền Thành + Sơn Môn | cổ cầm, tiêu, chuông đồng, mõ gỗ, đàn tranh | ngũ cung | chậm vừa | ấm, quen | trống trận |
| Chính Nhất (Long Hổ) | trống pháp, chiêng, kèn bầu (唢呐) trong lễ, sanh (笙), nhị | ngũ cung, điệu Đạo nhạc khoa nghi | lễ nghi, có phách | uy nghi | kèn bầu ngoài cảnh lễ (quá chói) |
| Thanh Vi · Đan Đỉnh (Võ Đang) | tiêu, cổ cầm, khánh đá | ngũ cung, nhiều nốt ngân | rất chậm | thong thả, cao | trống dồn |
| Toàn Chân (Chung Nam) | tụng hòa âm nam (lối «Toàn Chân chính vận» — chỉ mô phỏng không lời), mõ, khánh, đế chung | đơn âm kéo dài | đều | nghiêm, giản | dàn dây dày |
| Thượng Thanh · Lư Sơn (Mao Sơn) | sáo trúc, nhị, chuông gió, mưa | ngũ cung thứ | chậm | ấm, ẩm | — |
| Thiền Trúc Lâm (Yên Tử) | mõ, chuông gia trì, khánh, sáo trúc, gió tùng | ngũ cung, nhiều khoảng lặng | rất chậm | trong, buông | nhạc dồn, trống |
| Tịnh Độ (Bút Tháp) | niệm Phật hòa âm xa (không lời rõ), đàn bầu, đàn tranh, chuông, mõ | điệu Bắc | êm | ấm, cộng đồng | — |
| Mật / Tạng (chờ tham vấn) | dự kiến: kèn dài, chuông bát (âm ngân), tụng trầm | — | — | rộng, vô thường | dùng bất cứ bản ghi nghi lễ nào trước khi duyệt |
| Nho (Văn Miếu) | màu nhã nhạc: biên chung, biên khánh, đàn nguyệt, tì bà, nhị, sáo, trống | ngũ cung, trang trọng | đều | trang nghiêm, sáng | — |
| Âm ty (Phong Đô) | gió hang, nước nhỏ giọt, khánh trầm, nhị khàn, tụng siêu độ xa (không lời) | thưa, nốt trầm | không phách rõ | lạnh, đối diện | tiếng hét, âm sắc kinh dị |
| Bàng môn (Miêu Cương) | khèn (sênh nhiều ống), trống đồng, đàn môi, tiếng sông | ngũ cung miền núi | sống động | sống, bí ẩn | nhại nhạc dân tộc cụ thể khi chưa có cố vấn |
| Định Mệnh Hội | thanh la nhỏ, lục lạc, rao hàng | lệch giọng nhẹ | dồn, khẩn | ồn ào giả | — |
| Lỗ Ban | tiếng bào gỗ, đục, một cây đàn tranh chơi đúng mà lạnh | — | đều đều | lịch sự, lạnh | nhạc «phản diện» lộ liễu |
| Tà Lộ (đang dùng Âm Bài) | nhạc vùng + một bè trầm hấp dẫn, nhịp lệch nhẹ | — | — | ngọt có vết | — |
| Côn Lôn | mọi chủ đề hòa lại, hợp xướng không lời, chuông lớn | ngũ cung trưởng | rộng | trọn vẹn | — |

### 2.1 Chủ đề âm nhạc (leitmotif)

| Chủ đề | Gắn với | Xuất hiện |
|---|---|---|
| «Tám chữ» (4 nốt + 4 nốt, cổ cầm) | lá số người chơi | lễ lật trụ, Mệnh Bàn, lời kết |
| «Hạt giống» (tiêu, đi lên) | Vân Cốc, cải mệnh | lần đầu gặp Vân Cốc; lên cảnh giới |
| «Định mệnh» (đi xuống, cùng 4 nốt «Tám chữ» đảo ngược) | Khổng tiên sinh | lời phán; gặp lại ở Hồi II |
| «Về» (chuông + sáo) | Hồi Đầu, Nại Hà, ra Phong Đô | — |
| «Thiên Mệnh Bàn» (hợp xướng) | sự kiện máy chủ, Vĩ thanh | — |

### 2.2 Cảnh âm theo vùng × bốn khoảng giờ

| Vùng | Sáng (Mão – Thìn) | Ngày (Tỵ – Mùi) | Chiều (Thân – Dậu) | Đêm (Tuất – Dần) |
|---|---|---|---|---|
| Huyền Thành + Sơn Môn | chuông sớm, chim sẻ, tiếng chổi tre | tiếng khách, ấm trà sôi, phố | trống chiều, gió | côn trùng, đèn lồng kẽo kẹt, thầy viết chữ (tiếng bút trên giấy) |
| Long Hổ | bè tre, sông | tiếng đọc kinh từ đại đường | gió qua long não | sông, ếch |
| Võ Đang | gió đỉnh, chuông Tử Tiêu cung | bước chân trên bậc đá, quạ núi | tiêu xa | gió lạnh, im |
| Chung Nam | mõ trai đường, tụng sớm | tiếng chổi quét tuyết | khánh | tuyết rơi (gần như im) |
| Mao Sơn | mưa nhỏ trên lá trúc | người hái chè gọi nhau | ếch đầm sen | ếch nhái, mưa |
| Yên Tử | gió tùng, chuông Chùa Đồng | suối Giải Oan | chuông chiều | gió tùng, mõ thiền tối |
| Bút Tháp | gà gáy, khói rơm (không âm), tụng sớm | trẻ con ở sân, nước giếng | tụng chiều, ếch đồng | dế, đèn dầu |
| Tạng Địa (chờ) | gió, cờ phần phật | bánh xe kinh quay | gió | im lặng cao nguyên |
| Văn Miếu | chim trên cây đa | tiếng đọc bài đồng thanh xa | ve | gió qua hàng muỗm |
| Phong Đô | (không theo giờ) nước nhỏ giọt, gió hang, tiếng sổ lật, khánh trầm | — | — | — |
| Miêu Cương | gà, sông | chợ trên cầu phong vũ | trống lâu | lửa bếp, khèn xa |
| Côn Lôn | gió cao, hạc | thác | — | — |
| Am Vân Cốc | gió vách, mõ một tiếng | im | im | mưa trên mái tranh, ấm nước |

### 2.3 Giọng đọc

| Hạng mục | Định hướng |
|---|---|
| Lồng tiếng | ưu tiên câu then chốt của NPC chính (≈ 400 câu); thoại thường là chữ |
| Giọng | theo phần 7; giọng Bắc chuẩn cho thầy, giọng vùng nhẹ cho cư dân; không giọng địa phương làm trò cười |
| Đọc to (trợ năng) | đọc mọi chữ hiện ra bằng TTS hệ thống khi bật (`PS-05`) |
| Chữ Hán | đọc Hán Việt, không đọc âm Bắc Kinh (trừ khi chọn ngôn ngữ khác) |

## 3. Nguyên tắc UX

### 3.1 Mười hai nguyên tắc

| # | Nguyên tắc | Nghĩa cụ thể | Ví dụ | Chống mẫu |
|---|---|---|---|---|
| U1 | **Minh bạch** | mọi số có «Vì sao?»; mọi giá có ghi rõ ảnh hưởng | «+10 % Phúc Khí. Không ảnh hưởng Đạo Hạnh.» | số «hộp đen» |
| U2 | **Không phạt nghỉ** | nghỉ bao lâu cũng không mất Đạo Hạnh, không thông báo trách | điểm danh 7 ngày có **1 ngày ân hạn**; chuỗi đứt thì tụt một bậc, không về 0 | «Bạn đã bỏ tu 14 ngày» |
| U3 | **Không đếm ngược bán hàng** | không «còn 2 giờ», không «giá hôm nay» | món mùa ghi ngày kết thúc mùa một lần, không đếm | đồng hồ đỏ nhấp nháy |
| U4 | **Không thông báo dùng nỗi sợ** | thông báo chỉ mời, tắt được từng loại | «Chuông giờ Mão vừa đánh. Lên Sơn Môn?» | «Ngày xung tuổi bạn!» |
| U5 | **Một phiên ngắn trọn vẹn** | 15 phút làm xong một việc có ý nghĩa | án khách ≤ 12 phút | nhiệm vụ 40 phút không lưu giữa chừng |
| U6 | **Lưu mọi lúc** | thoát giữa chừng không mất tiến độ quá 1 phút | lưu tự động sau mỗi bước | — |
| U7 | **Dẫn bằng cảnh trước, bằng UI sau** | đèn, cờ, gió, NPC vẫy chỉ đường; mũi tên chỉ khi người chơi bật | bản đồ nhỏ tắt mặc định | mũi tên chạy khắp màn |
| U8 | **Lựa chọn đảo ngược được** | quan hệ hủy được; Tà Lộ quay về được; cài đặt đổi được | — | lựa chọn vĩnh viễn không cảnh báo |
| U9 | **Một chạm tới việc chính** | từ màn chính tới Sổ, Mệnh Đồ, Trà Thất ≤ 2 chạm | — | menu lồng 4 tầng |
| U10 | **Cùng một chữ cho một thứ** | tên chuẩn (phần 11 §7) | «Phúc Khí» ở mọi nơi | lúc «vàng», lúc «coin» |
| U11 | **Ngắt được, tua được (trừ câu then chốt lần đầu)** | — | phần 6 §7.4 | cảnh cắt dài không bỏ qua |
| U12 | **Tôn trọng tiền thật** | giá bằng tiền thật trước khi bấm; xác nhận hai bước; hoàn tiền rõ | — | đổi tiền ảo nhiều lớp để giấu giá |

### 3.2 Nhịp quay lại có đạo đức

| Cơ chế | Cho phép | Không cho phép |
|---|---|---|
| Việc hằng ngày (3 việc) | có; làm bù được 1 ngày | phạt nếu bỏ |
| Điểm danh | có, ân hạn 1 ngày | về 0 khi lỡ |
| Lễ âm lịch | thông báo mềm 1 lần, trước 1 giờ | nhắc liên tục |
| Sự kiện mùa | thời hạn rõ, ≥ 4 tuần, phần thưởng thẩm mỹ | phần thưởng tu chỉ có trong sự kiện |
| Thông báo đẩy | tối đa 1 / ngày, tắt từng loại | gửi giờ khuya (trừ khi người chơi đặt) |
| Nhắc nghỉ | sau 2 giờ liên tục: Lão Tùng «uống ngụm nước đã»; vị thành niên: sau 1 giờ và sau 22:00 | — |

## 4. Luồng và điều khiển

| Nền tảng | Di chuyển | Camera | Tương tác | Ghi chú |
|---|---|---|---|---|
| Web máy tính | WASD / chuột chạm đất | kéo chuột, cuộn phóng | chuột trái, E | F / Space / C cho bay (đã có) |
| Web cảm ứng / Android | cần ảo hoặc chạm đất (A*) | vuốt, chụm hai ngón | chạm | chế độ một ngón |
| iOS (Học Quán) | như cảm ứng | như cảm ứng | chạm | rung bằng Capacitor Haptics |
| Tay cầm (PC đầy đủ, sau) | cần trái | cần phải | A | — |

Chạm để đi phải khởi bước ≤ 100 ms (phần 6 §7.1). Mọi thao tác giữ (giữ để kết phù…) có **lựa chọn bấm thay giữ** (§6).

## 5. Đọc chữ Hán và học thuật ngữ

| Hạng mục | Chuẩn |
|---|---|
| Lần đầu gặp thuật ngữ | chữ Hán + Hán Việt + nghĩa (canon §1); chạm vào chữ mở thẻ từ điển (phần 9–11) |
| Thẻ từ điển | Hán, Hán Việt, nghĩa, ví dụ trong lá số của **chính người chơi** nếu có («Thất Sát của bạn ở trụ tháng») |
| Mức hiện chữ Hán | 3 mức trong cài đặt: «Nhiều» (chuyên gia, `PS-06`), «Vừa» (mặc định), «Ít» (chỉ Hán Việt) |
| Tên gốc trước | cài đặt «Tên gốc trước» (`YC-16`): Mệnh Bàn hiện gradeVi / chữ Hán làm nhãn chính |
| Sổ từ đã học | Sổ có thẻ «Từ đã học»: mỗi thuật ngữ gặp được ghi lại, ôn được (phục vụ khoa cử) |
| Không chữ Hán nhỏ hơn | 16 px trên di động (nét Hán dày đặc) |

## 6. Mục tiêu trợ năng

### 6.1 Mục tiêu đo được

| Mã | Mục tiêu | Chuẩn | Đo |
|---|---|---|---|
| `TN-01` | Tương phản chữ thường ≥ 4,5 : 1; chữ lớn ≥ 3 : 1 | WCAG 2.2 AA (1.4.3) | công cụ đo trên mọi màn UI |
| `TN-02` | Không truyền thông tin chỉ bằng màu (ngũ hành có chữ + hình) | WCAG 1.4.1 | rà UI |
| `TN-03` | Cỡ chữ chỉnh 100–200 %, bố cục không vỡ ở 150 % | WCAG 1.4.4 | ảnh chụp |
| `TN-04` | Mục chạm ≥ 44 × 44 pt (iOS), ≥ 48 dp (Android) | HIG / Material | rà |
| `TN-05` | Không nội dung nhấp nháy > 3 lần / giây | WCAG 2.3.1 | rà VFX |
| `TN-06` | Chế độ giảm chuyển động (đã có `reduced`) phủ camera, hạt, chuyển trang | WCAG 2.3.3 | thử |
| `TN-07` | Phụ đề cho mọi lời nói, có tên người nói, cỡ chỉnh được | — | thử |
| `TN-08` | Mọi hoạt động có thời gian (nhịp lạy, Thái Cực, kịp giờ) có chế độ không thời gian **trên tuyến chính** | WCAG 2.2.1 | rà nhiệm vụ |
| `TN-09` | Mọi thao tác giữ / kéo có cách bấm thay thế | WCAG 2.5.1 / 2.5.7 | rà |
| `TN-10` | Đọc màn hình (VoiceOver / TalkBack) đọc được Sổ, Mệnh Bàn (dạng danh sách), hộp thoại | — | thử trên iOS / Android |
| `TN-11` | Đổi phím, đổi tay thuận | — | cài đặt |
| `TN-12` | Chế độ chống say khi bay (giảm FOV dao động, viền tối nhẹ) | — | thử 5 người dễ say |
| `TN-13` | Chế độ «nhẹ nhàng» cho nội dung u tối (`YC-09`) | — | thử |
| `TN-14` | Không yêu cầu nghe để tiến (mọi tín hiệu âm có tín hiệu hình) | — | rà |
| `TN-15` | Chế độ mù màu (3 bộ lọc) cho cảnh và gia trì | — | thử |

### 6.2 Trợ năng nhận thức và cảm xúc

| Hạng mục | Định hướng |
|---|---|
| Tóm tắt chuyện | «Chuyện đến đâu rồi?» bất cứ lúc nào, một đoạn ngắn + đọc to |
| Nhật ký nhiệm vụ | ghi bằng câu người chơi đã nghe, không mã |
| Nội dung nhạy cảm | cảnh báo trước Hồi IV, Tà Lộ, Âm tà (opt-in) — nói rõ nội dung, không giật gân |
| Khủng hoảng | quy tắc rời vai (phần 8 §3) |
| Nghỉ | nhắc nghỉ (§3.2) |

## 7. Hiệu năng là một phần của trải nghiệm

| Mục tiêu | Giá trị | Ghi chú |
|---|---|---|
| Khung hình ngoài trời (máy tầm trung) | ≥ 30 khung / giây; mục tiêu 60 trên PC | Sơn Môn đã từ 3 → 45 khung / giây sau gộp khối (V2 nhật ký) |
| Trong nhà | ≥ 30 khung / giây | bản sơ đồ §8.5 |
| Thời gian vào game lần đầu (web) | ≤ 20 giây tới lễ lật trụ trên mạng 4G | tải dần thánh địa |
| Thời gian chờ AI | hiện hoạt cảnh sau 0,5 s; chuyển kịch bản sau 6 s | phần 6 §7.4 |

## 8. Checklist trình bày (mỗi mốc M)

- [ ] Ngân sách im lặng đạt (phần 6 §7.5).
- [ ] Không âm thanh nghi lễ thật chưa phép trong bản build.
- [ ] `TN-01` → `TN-15` đo trên màn mới.
- [ ] Mọi thông báo đẩy qua bảng U4.
- [ ] Biểu tượng emoji đã thay bằng biểu tượng nét mực ở các màn mới.
