# 12 · Trình bày — Phần 15: Luồng trải nghiệm (storyboard trình bày)

> Ghép các màn UI, nhạc, tiếng, camera, rung, hiệu ứng thành **luồng thời gian** cho những đoạn quan trọng nhất. Mỗi luồng là bảng theo từng nhịp: thời điểm, màn hình, câu chữ, âm (`SFX-*`, `BGM-*`), camera (`cam.*`, phần 08), rung (phần 07 §8), hiệu ứng (`fx.*`, phần 12). Nội dung cốt truyện (thoại cụ thể, mã cảnh) thuộc tài liệu 03 — ở đây chỉ dùng khung và câu đã có trong code / canon.

---

## Luồng 1 · Lần đầu mở game (0 → 15 phút), bản web

Mục tiêu cảm xúc (canon §1): «game hiểu mình quá». Mục tiêu thao tác: biết đi, biết vào gian, biết mở Sổ Mệnh; nhận việc đầu tiên.

| t | Màn | Hình / chữ | Âm | Camera | Rung | Ghi chú |
|---|---|---|---|---|---|---|
| 0:00 | UI-01 | chữ 玄 館 + thanh mực + câu dẫn #1 | — (chưa được phát âm) | — | — | tải ≤ 6 s trên 4G |
| 0:06 | UI-07 | «Trước khi thầy xem» — 3 dòng dữ liệu, 2 ô tắt sẵn | — | — | — | — |
| 0:20 | UI-02 + UI-03 | cổng, mẫu bát tự, tên ngẫu nhiên điền sẵn | thao tác đầu → `BGM-GATE-01` vào dần 4 s (nếu bật âm) | — | — | âm mặc định tắt; nút 🔈 ở cổng ★ để người chơi bật ngay từ đây |
| 0:50 | UI-03 | nhập ngày → dòng âm lịch «21/4 năm Canh Ngọ» hiện (ví dụ `MAU-A`) | `SFX-UI-004` | — | — | khoảnh khắc «game biết ngày âm của mình» |
| 1:10 | UI-03 → UI-04 | «Xin thầy lập mệnh» → «Thầy đang lật sách…» | `SFX-RITE-001` | — | medium | — |
| 1:11 | UI-04 | bốn thẻ gỗ úp, lật lần lượt Giờ → Ngày → Tháng → Năm | `SFX-RITE-002`, `-003a…d`; `BGM-RITE-01` | — | 4 × light | — |
| 1:13 | UI-04 | Nhật chủ 庚 (Kim) · Thân quá vượng; thanh ngũ hành chạy; Dụng / Hỷ / Kỵ | `SFX-BELL-003`, `SFX-RITE-004`, `SFX-UI-031` × 3 | — | — | — |
| 1:15 | UI-04 | «Thanh Vân mệnh cần Thủy. Mặc màu Thủy vào quán cho hợp khí.» | — | — | medium | nút «Mặc phẩm phục» sáng đủ |
| 1:30 | UI-05 | vòng Tiềm Lực vẽ tới 41; «Tứ Linh Căn · hơn 31% người»; Mệnh Cách Đắc Cứu; câu dẫn bắt buộc | `SFX-RITE-005`, `SFX-BELL-001` (−6 dB) | — | — | từ M0 |
| 1:50 | UI-14 biến thể «vào» | màn đen «Bước qua cổng» | `SFX-DOOR-006` cổng tam quan | — | light | — |
| 1:52 | UI-08 + cảnh | sân Sơn Môn theo **giờ thật**; người chơi mặc áo màu Dụng thần | `BGM-SONMON-<khung giờ>` ở M3 trong 60 s; `SFX-AMB-001/002` | rig mặc định: pitch 0,4, dist 15 × 0,9 (dọc), ahead 3,4 | — | toast «Phẩm phục Thủy đã mặc. Thầy đang ngồi ở Chính Đường.» (đã có) |
| 2:00 | cảnh | **Lão Tùng** (gác cổng) bước tới; bong bóng «Khách mới phải không? Kéo màn hình để nhìn quanh.» | VO Lão Tùng (hạng A) | — | — | dạy xoay camera; chờ người chơi kéo > 90° |
| 2:20 | cảnh | Lão Tùng: «Chạm xuống đất chỗ nào là khách đi tới đó.» + vòng chỉ dẫn vàng nhấp nhô ở bậc Chính Đường | — | — | — | dạy chạm-để-đi |
| 2:40 | UI-10 | tới gần bàn thầy: nhãn «Bàn Thầy Tử Bình» đổi nền son, nút hành động hiện «📜 Ngồi trước bàn thầy» | `SFX-UI-002` | §2.4 nhắm mềm | light | — |
| 2:50 | UI-40 (`cam.talk` kiểu «Ngồi đối diện») | Thầy Tử Bình ngẩng đầu (đã có: `masterChar.play('bow')`), thoại mở màn cốt truyện MQ-P (tài liệu 03) | VO Thầy (hạng A); `BGM` hạ M1 | `cam.talk` | — | thoại 3–5 câu, có 1 lựa chọn |
| 4:00 | UI-50 | thầy lập lá số «Bản thân» trên bàn — nghi thức `.hq-chart.ritual` (dùng lại tiếng lật trụ) | `SFX-RITE-003a…d` | — | — | thưởng `REWARD.chart = 10` → toast «+10 Phúc Khí · …» |
| 4:30 | UI-21 lần đầu | thầy: «Con mở Sổ Mệnh xem.» — dock 📜 sáng viền 2 s | `SFX-UI-034` | — | — | dạy dock |
| 5:00 | UI-21 | Mệnh Bàn mọc từ tâm; người chơi chạm cánh Thủy 2% → UI-23 «bổ Thủy» | `SFX-UI-030` (nốt Vũ) | — | light | khoảnh khắc «game hiểu mình» thứ hai |
| 6:00 | UI-16 | nhận việc đầu tiên «Giải án cho một vị khách» (khách `an0` trong sân) | `SFX-QUEST-001`, `BGM-STING-QUEST` | — | — | — |
| 6:30 | UI-51 | án 6 bước (khách nhập vai theo `npc.js`) | `SFX-UI-005/006` | — | — | ≈ 5 phút |
| 11:30 | UI-51 kết quả | vòng điểm, «Thấu / Gần thấu» | `SFX-MG-090/091`; `SFX-UI-040` | — | medium | +Phúc Khí, ★ ghi `救人 +3` vào Sổ Công Quá khi đã có sổ |
| 12:00 | UI-13 T3 | «🏮 Thành tựu: Lần đầu gặp thầy» (đã có) | `SFX-PROG-006` | — | — | — |
| 12:30 | cảnh | Lão Tùng chỉ Trà Thất: «Mỏi thì ngồi chén trà.» | — | — | — | giới thiệu nhịp nghỉ (P3) |
| 13:00 | UI-95 Trà Thất | ngồi bồ đoàn (MMO cấp chỗ), bảng `peek`, vòng thở 14 s | `SFX-BODY-002`, `SFX-MG-070`, `BGM` M1 | ngồi: `dist × 0,75`, `ahead 0,6` | — | nếu có người chơi khác cùng ngồi: tên hiện cạnh |
| 15:00 | — | kết thúc đoạn mở; tracker còn 2 việc hôm nay | — | — | — | — |

**Bản iOS khác ở:** tên Học Quán / Sổ Tu Học / Điểm Tu Học; UI-05 đổi «Mệnh Cách» thành «Kiểu lá số»; không gợi ý Ống Xăm / Thái Tuế; Lão Tùng chỉ La Bàn Đài thay Ống Xăm.

**Kiểm tra luồng:** người thử lần đầu (n ≥ 20) tự làm tới phút 6 không cần trợ giúp ≥ 85%; ≥ 70% nói một câu kiểu «nó biết…» khi phỏng vấn sau (đo mục tiêu cảm xúc).

---

## Luồng 2 · Người chơi lá số thấp gặp Vân Cốc (Hồi I)

Dựa trên kịch bản mẫu §6.3 bản tổng (lá số 24 điểm, HẠ ĐẲNG, 败格 → Nghịch Thiên). Mục tiêu: **không bị phán xét**, nhận Mệnh Đồ, nhận Sổ Công Quá.

| Nhịp | Màn | Trình bày | Âm | Camera | Hiệu ứng |
|---|---|---|---|---|---|
| 1 | cảnh Am Vân Cốc | trời theo giờ thật; nếu có mưa: mưa mái tranh | `BGM-VANCOC-<khung>`; `SFX-RAIN-002` | `cam.reveal` lần đầu tới am (6 s) | `fx.wx.drizzle` tùy thời tiết |
| 2 | UI-40 «Ngồi đối diện» | «Con ngồi đi. Thầy Tử Bình chưa nhận con phải không?» | VO Vân Cốc; `SFX-WATER-015` ấm trà | `cam.talk` ngồi đối diện | `fx.env.steam` |
| 3 | UI-40 lựa chọn | ① «Lá số con xấu.» ② «Con không biết vì sao.» ③ (im lặng) | — | — | — |
| 4 | UI-40 (với ①) | «Xấu là chữ của người xem, không phải chữ của trời…» — câu đọc `synthesis.factors` ngắn; chữ Hán thuật ngữ có móc từ điển | VO ghép (phần 11 §1.5) | — | — |
| 5 | UI-40 | chuyện Liễu Phàm | `BGM-MENHDO-01` vào dần | camera lượn chậm sang bên 20° (ngồi > 4 s) | — |
| 6 | UI-27 mở **trong cảnh** | Vân Cốc trải một cuộn giấy trên bàn; màn chuyển mượt sang bảng Mệnh Đồ (núi sáu bậc), nút 德 «Tích âm đức» sáng | `SFX-UI-014` trải cuộn | cận cuộn giấy 1 s rồi mở bảng | `fx.rite.ink` vẽ núi |
| 7 | UI-40 | «Tầng dưới cùng ai cũng đi được, ngay hôm nay: tích âm đức.» | — | — | — |
| 8 | UI-29 lần đầu (bìa sổ mở) | «Vân Cốc thiền sư trao cho bạn Sổ Công Quá.» | `SFX-UI-013`; `BGM-STING-QUEST` | — | — |
| 9 | UI-16 | nhiệm vụ «Ba việc thiện đầu tiên 0/3» | `SFX-QUEST-001` | — | — |
| 10 | UI-41 mở khóa | nút «🎙 Hỏi thêm» xuất hiện (web) | — | — | — |

**Luật trình bày luồng này:** không một màu đỏ nào; không một âm «thất bại» nào; câu dẫn bắt buộc (UI-05) đã hiện từ lúc nhập môn — Vân Cốc **không** nhắc lại nguyên văn (tránh lặp), mà nói theo giọng mình.

---

## Luồng 3 · Một phiên chơi tối thường ngày (20 phút, giờ Tuất – Hợi)

Canon §9.2: «vào quán → điểm danh → 1 án khách → 1 việc ở thánh địa đang theo → trà / thiền → ra».

| Phút | Việc | Màn | Âm / nhạc | Ghi chú trình bày |
|---|---|---|---|---|
| 0 | vào | UI-06 «Chào … quay lại quán»; thẻ hôm nay: ngày can chi, đèn Thái Tuế chưa thêm dầu, 0/3 việc | `BGM-GATE-01` | — |
| 0,5 | vào cảnh | sân đêm xanh thẫm có trăng (`KEYS` 19,5 h), đèn lồng sáng (`lanterns` ≥ 100 Phúc Khí) | `BGM-SONMON-TOI` (điệu Cung), chuông canh Tuất 5 tiếng nếu vừa qua 19:00 | đèn điểm theo `lightNight` |
| 1 | điểm danh | UI-71 → «Điểm danh +20 Ngọc» | `SFX-SHOP-001` | chấm đỏ dock Y Các tắt |
| 2 | đèn Thái Tuế | đi tới Thái Tuế Điện (UI-14 vào điện) → UI-54 «Thêm dầu cho đèn (+3)» | `SFX-DOOR-001`, `BGM-INT-THAITUE`, `SFX-RITE-031` | `cam.lamp` 1,2 s |
| 4 | án khách | UI-51 | `BGM` M1 | — |
| 10 | thánh địa | trạm (UI-47) → Long Hổ; màn «🕊 Cưỡi hạc tới Long Hổ Sơn» | `SFX-TRAV-003`; `BGM-LONGHO-TOI` | — |
| 11 | việc đạo thống | UI-82 kết phù bước 2/5 | `BGM-MG-KETPHU` | — |
| 16 | trà / thiền | về Sơn Môn → Trà Thất hoặc tĩnh tọa ở Long Hổ (UI-81) | `BGM-MG-TINHTOA` | — |
| 19 | chuông canh Hợi (21:00) | phụ đề âm thanh «[chuông canh · giờ Hợi]» nếu bật | `SFX-BELL-040` mõ (Huyền Thành) hoặc chuông (quán) | báo giờ tự nhiên |
| 20 | ra | menu tạm nghỉ / thoát; ★ nếu đã chơi 90 phút: nhắc nghỉ | — | — |

---

## Luồng 4 · Xong một tầng Mệnh Đồ

| Nhịp | Màn | Trình bày | Âm | Rung |
|---|---|---|---|---|
| 1 | trong thế giới | việc cuối của tầng hoàn thành (vd «Hóa sát ba phương» ở nhà riêng) | `SFX-QUEST-003` | medium |
| 2 | UI-13 T3 | «Mệnh Đồ · xong tầng 宅 Không gian» | `SFX-PROG-005` khánh đá | medium + light |
| 3 | cảnh | `fx.rite.menhdo`: một sợi khói vàng từ chân người chơi bay lên | `BGM-STING-MENHDO` | — |
| 4 | UI-27 (nếu đang mở) | nút đổi ● vàng + vệt mây bay sang bậc kế | `SFX-UI-030` nốt bậc | — |
| 5 | thoại NPC dẫn đạo hiện tại | một câu chúc (bong bóng, không mở hội thoại) | VO hạng B nếu có | — |
| 6 (khi đủ 6 tầng) | UI-33 biến thể núi | núi sáu bậc sáng dần từ chân lên | `BGM-VOW-*` tương ứng hoặc chủ đề Vân Cốc | light → medium → heavy |

---

## Luồng 5 · Đột phá cảnh giới (ví dụ: lên bậc 2 «Nhập Môn»)

| t | Trình bày | Âm | Camera | Hiệu ứng | Rung |
|---|---|---|---|---|---|
| 0 | thanh cảnh giới (UI-32 hoặc HUD chip ☯) chạm ngưỡng 100 | `SFX-PROG-003` | — | — | light |
| 0,3 | HUD ẩn, toast vào hàng đợi | nhạc vùng −12 dB | rời rig | `fx.post.vignette` | — |
| 0,5 | quanh người chơi mọc vòng gia trì theo hành Dụng thần | `SFX-RITE-020` | `cam.ascend` bắt đầu xoắn ốc | `fx.rite.ascend` | medium |
| 2,5 | chữ 入門 viết trên trời | `SFX-RITE-005` | đang lên cao | `fx.rite.ink` | — |
| 4,0 | «Nhập Môn» + câu của NPC dẫn đạo | VO; `BGM-ASCEND-01` | — | — | — |
| 6,0 | «Mở: 3 thánh địa gần» (canon §9.1) | `SFX-PROG-003` | nhìn xuống | — | heavy |
| 7,5 | nút «Tiếp tục tu» | — | — | — | — |
| sau | camera về rig với `pitch` / `dist` cũ (phần 08 §4.4); HUD hiện; toast xả hàng đợi | nhạc vùng trở lại | 0,8 s | — | — |

**Giảm chuyển động:** thẻ tĩnh 2 s («入門 · Nhập Môn · Mở: …»), một tiếng khánh, nút.

---

## Luồng 6 · Lễ tiết MMO — Vu Lan / Trung Nguyên (15/7 âm)

| Nhịp | Trình bày | Âm / nhạc | Giao diện | Ghi chú |
|---|---|---|---|---|
| trước 3 ngày | UI-69 lịch: ✺ 15/7; UI-70 thư của Ni sư Diệu Âm (giọng persona) | — | chấm dock theo luật UI-09 | không thư quảng cáo cửa hàng |
| ngày lễ, mở | Bút Tháp, Phong Đô, Hồ Sen đổi trang trí (đèn hoa đăng nhiều hơn, phướn) | `BGM-EV-VULAN` thay nhạc vùng ở ba nơi | tracker ✺ «Vu Lan · thả đèn cho người đã khuất» | — |
| thả đèn | UI-94 — ô nhập lời gửi (lọc chữ), đèn trôi chung hồ với đèn người chơi khác (tối đa 40 chiếc toàn hồ — phần 12 §8.3) | `SFX-RITE-054`; `cam.river` | — | iOS: lời gửi đổi thành «lời tưởng nhớ», không «điều ước» |
| giờ lễ chung (giờ Tuất) | đám đông im dần; chuông chùa | `SFX-CROWD-020`, `SFX-BELL-031` | đếm người tham gia (không xếp hạng) | — |
| Phong Đô mở lối | thẻ cảnh báo nội dung (phần 14 §9 E7) lần đầu | `BGM-PHONGDO-*` + lớp hy vọng | — | — |
| sau lễ | UI-36 thành tựu «Vu Lan» (nếu có — tài liệu 10) | `SFX-PROG-006` | — | — |

---

## Luồng 7 · Tà Lộ: nhận Âm Bài và hồi đầu

Trình bày phải cho thấy cái giá **công khai** và đường về **luôn mở** (canon §5.5).

| Nhịp | Màn | Trình bày | Âm | Hiệu ứng |
|---|---|---|---|---|
| 1 | UI-79 (nếu chưa bật) | cổng xác nhận âm tà | — | — |
| 2 | UI-40 với Lỗ Ban | giọng ngọt; lựa chọn nhận Âm Bài có nhãn ⚠ và câu nhắc của NPC dẫn đạo **trước** lựa chọn | VO Lỗ Ban; `SFX-KARMA-001` | — |
| 3 | nhận | thẻ «Âm Bài: ×2 Hậu Thiên trong 7 ngày · mỗi lần dùng sinh Nợ Âm (công khai trong Sổ Mệnh)» | `SFX-KARMA-005`; `BGM-STING-TALOAN` | `fx.rite.amba` |
| 4 | HUD | chip mới «陰 Nợ Âm {n}» cạnh chip cảnh giới — không ẩn được trong 7 ngày | — | — |
| 5 | thế giới | hệ quả: Trà Thất có người ốm (NPC nằm, tiếng ho `SFX-CROWD-009`); khách Sơn Môn bỏ về; Thầy Tử Bình «không tiếp» (nút hành động bàn thầy đổi thành «Thầy đang nghỉ») | — | — |
| 6 | UI-37 | danh sách «Những người đã chịu thay bạn» + nút hồi đầu | `SFX-KARMA-006` khi Nợ Âm tăng | — |
| 7 | hồi đầu | Phong Đô: đọc sổ nghiệp (Phán quan), sám hối UI-92, cứu từng người | `BGM-PHONGDO-*` lớp hy vọng to dần | — |
| 8 | danh hiệu | UI-33 biến thể Hồi Đầu: sương tím tan, nắng xuống | `SFX-KARMA-007`; `BGM-STING-HOIDAU` | `fx.rite.hoidau` |

---

## Luồng 8 · Mất mạng giữa chừng

| Tình huống | Trình bày |
|---|---|
| đang đi trong sân | chip 👥 → «Đang kết nối…» → «Ngoại tuyến»; người chơi khác mờ dần biến mất trong 2 s (không biến mất đột ngột); không toast |
| đang ngồi bồ đoàn MMO | vẫn ngồi (chỗ ngồi cục bộ), khi có mạng lại xin lại chỗ; nếu chỗ đã có người → đứng dậy nhẹ nhàng, toast «Chỗ này vừa có khách, mời bạn sang bồ đoàn bên.» |
| đang giải án chung (coop) | thẻ «Mất kết nối với nhóm. Bạn có thể giải tiếp một mình.» + hai nút «Giải một mình» / «Chờ kết nối» |
| đang hỏi AI | câu trả lời chuyển sang luận cục bộ (S-OFF UI-41), huy hiệu «Luận cục bộ» |
| có mạng lại | chip 👥 n; `SFX-UI-045` rất nhỏ; không toast |

---

## Luồng 9 · Bản iOS (Học Quán) — 10 phút đầu

| Khác biệt | Trình bày |
|---|---|
| thương hiệu | 學 館 · Học Quán; Sổ Tu Học; Điểm Tu Học (`TEXT` iOS) |
| lời dẫn cổng | «Sân học cổ pháp: ngồi bàn thầy dựng tứ trụ, xoay la bàn, xem lịch tiết khí, rồi ngồi uống chén trà.» |
| lễ nhập môn | giữ lật trụ, ngũ hành, Dụng thần (giáo dục); câu trích bỏ «hợp mệnh» |
| gian tắt | Ống Xăm, Hồ Sen (điều ước), Thầy Giải Quẻ, Vận Mệnh Các, Thái Tuế Điện (`IOS_OFF`) — **không có lối vào**, kể cả cửa điện (`door_vanmenh`, `door_thaitue` cũng tắt) |
| Thầy AI | không có; thầy trả lời bằng thoại kịch bản + luận cục bộ |
| Mệnh Đồ | «Lộ Tu»: bỏ tầng Thời và Thái Tuế |
| nhạc / tiếng | giữ nguyên (không phụ thuộc bói) |
| tôn trọng công tắc im lặng | phiên âm thanh `ambient` (phần 11 §3) |

---

## Luồng 10 · Trở lại sau 7 ngày vắng

| Nhịp | Trình bày |
|---|---|
| UI-06 | «Chào {tên} quay lại quán.» + ★ «Lần trước bạn: đang theo «Đi hái vị thuốc «Thực»» · Mệnh Đồ 2/6 tầng.» |
| chuỗi ngày | chuỗi điểm danh đứt → không câu trách; «Điểm danh lại từ ngày 1» trung tính |
| thư | ≤ 3 thư NPC tóm việc đã lỡ (lễ tiết qua rồi) — không «bạn đã bỏ lỡ phần thưởng X» |
| vào cảnh | nhạc M3 60 s như vào vùng mới (cảm giác chào đón) |
| bộ theo dõi | mở rộng 10 s rồi thu gọn |

---

## Luồng 11 · Mua món ở Tàng Y Các (đạo đức kinh tế)

| Nhịp | Trình bày | Luật |
|---|---|---|
| mở Y Các | số dư, điểm danh, thẻ bộ | không pop-up quảng cáo khi mở |
| xem món | thẻ món + «Thử» → UI-72 phòng thử | thử miễn phí, không giới hạn số lần |
| mua | nút giá → (nếu đủ) mua ngay, mặc ngay, toast «Đã thỉnh «{tên}» · đang mặc» (đã có) | **không** hộp «Bạn có chắc?» cho món ≤ 200 Ngọc (giảm ma sát hợp lý); có hộp xác nhận khi ≥ 300 Ngọc hoặc khi dùng tiền thật |
| thiếu tiền | toast lý do (đã có); ★ dòng «Ngọc có từ điểm danh, lên cấp, VIP» | **không** nhảy thẳng sang màn nạp |
| bộ Hợp mệnh | `SFX-SHOP-004`, vòng chữ 用 (phần 12 §4.6) | mô tả ghi rõ chỉ +10% Phúc Khí |

---

## Luồng 12 · Lần đầu vào một thánh địa

Áp dụng cho 12 thánh địa (kịch bản mở màn từng nơi: phần 16).

| t | Trình bày | Âm | Camera |
|---|---|---|---|
| 0 | bước qua ranh vùng (theo bán kính vùng) hoặc xuống trạm | nhạc vùng cũ tắt dần 6 s | — |
| 0,5 | HUD mờ 50% | — | `cam.reveal` 6 s |
| 1 | tên vùng viết bút lông giữa trời: chữ Hán + Hán Việt | `BGM-STING-REGION` (motif vùng) | — |
| 3 | dòng phụ: đạo thống · nguyên mẫu kiến trúc (vd «Chính Nhất · theo Thiên Sư Phủ, Giang Tây») | — | — |
| 6 | HUD trở lại; trạm đi nhanh mở: toast «Mở trạm hạc Long Hổ Sơn» | `SFX-TRAV-004` | về rig |
| 6+ | nhạc vùng M3 trong 60 s rồi về mức theo giờ | `BGM-<VÙNG>-<KHUNG>` | — |

**Giảm chuyển động:** không `cam.reveal`; tên vùng hiện thẻ tĩnh 2 s.
