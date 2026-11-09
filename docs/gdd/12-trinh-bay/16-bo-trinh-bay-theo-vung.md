# 12 · Trình bày — Phần 16: Bộ trình bày theo vùng và lễ tiết

> Một «thẻ trình bày» cho mỗi vùng: gom mọi quyết định hình, tiếng, camera của vùng vào một chỗ để họa sĩ, nhà soạn nhạc, người làm âm thanh, lập trình viên camera cùng đọc. Bảng màu của 11 thánh địa lấy **nguyên** «bảng màu khóa» canon (bản tổng §7); bảng màu 9 vùng có sẵn và Am Vân Cốc là **đề xuất** (tài liệu 07 chốt). Chữ Hán trên biển chỉ ghi khi chắc chắn theo nguyên mẫu; chỗ khác ghi «chờ cố vấn».
>
> Viết tắt trong bảng: mã môi trường dạng `-0xx` là `SFX-AMB-0xx` (phần 10 §9); bước chân `-01x` là nhóm `SFX-FOOT-01x` (phần 10 §3).
>
> Mỗi thẻ có: bảng màu và tông LUT, màu nhấn giao diện, nhạc, môi trường, bước chân, vang, camera, hiệu ứng, thời tiết, kịch bản mở màn (luồng 12 phần 15), câu dẫn màn tải, ghi chú tôn trọng.

---

## 1. Huyền Quán Sơn Môn (`thanh` · sân quán)

| Hạng | Quyết định |
|---|---|
| Bảng màu (đề xuất, theo `render.js › C`) | gạch `#3a2f2a` · tường `#5a4a3e` · mái son `#7a2d22` · bờ nóc vàng `#d6a84a` · đá sân `#6f6a63` |
| Tông LUT | ấm, tương phản vừa; đêm xanh thẫm có trăng (`KEYS` 0–5 h, 19,5–24 h) |
| Nhấn giao diện | `--hq-son` (mặc định) |
| Nhạc | `BGM-SONMON-*` (âm cung D) |
| Môi trường | `SFX-AMB-001/002`; điểm: quét sân `-055` (sáng), chuông gió `-031`, hạc `-046` khi ≥ 500 Phúc Khí |
| Bước chân | đá lát `SFX-FOOT-01x`; trong điện gạch `-02x` |
| Vang | ngoài trời đồng bằng 0,4 s; Chính Đường: điện gỗ lớn 1,6 s |
| Camera | mặc định (pitch 0,40, dist 15) — phần 08 §2.1 |
| Hiệu ứng | khói nhang, cánh đào (khi `peachBloom`), bụi nắng, đom đóm, đèn trời, Thiên Bàn |
| Thời tiết | mưa 15%, sương sớm 20% (tháng 11–3), quang còn lại |
| Mở màn | không có (là nơi bắt đầu) |
| Câu màn tải | «Giờ Tý là giờ quán yên tĩnh nhất.» |

## 2. Huyền Thành (`thanh` · phố)

| Hạng | Quyết định |
|---|---|
| Bảng màu (đề xuất) | ngói đỏ `#8a3b2a` · gỗ phố `#6b3f26` · vôi vàng `#e3c98f` · đá đường `#7d766c` · đèn lồng `#d2463c` |
| Tông LUT | đô thị ấm, bão hòa hơn Sơn Môn 10% |
| Nhạc | `BGM-THANH-*` (âm cung G) |
| Môi trường | `SFX-AMB-003/004`; chợ `SFX-CROWD-001/002/003`; gánh hàng `-056`; mõ cầm canh đêm |
| Bước chân | đá đường `-01x`, gỗ (cầu) `-04x` |
| Vang | phố — ngoài trời 0,4 s, ngõ hẹp 0,7 s |
| Camera | phố: pitch 0,32, dist 12 |
| Hiệu ứng | đèn lồng phố, khói bếp hàng quà |
| Thời tiết | như Sơn Môn |
| Câu màn tải | «Bàn Hợp Hôn ở Huyền Thành: so lá số để hiểu nhau, không để định đoạt nhau.» |

## 3. Tử Bình Phong (`tubinh`)

| Hạng | Quyết định |
|---|---|
| Bảng màu (đề xuất) | đá đỉnh `#8a8780` · tùng `#3f5e48` · mây `#eef1f3` · son nhạt `#a5483a` · ngói xám `#4a4b4e` |
| Tông LUT | lạnh, trong, tương phản cao (núi 420 m) |
| Nhạc | `BGM-TUBINH-*` (âm cung E) |
| Môi trường | `-005/-006`; gió đỉnh `SFX-WIND-002` |
| Bước chân | đá `-01x`, bậc rêu `-09x` |
| Vang | đỉnh núi 0,3 s; Lão Quân Điện 0,9 s |
| Camera | đỉnh: như cao nguyên (pitch 0,26, dist 22) ở sân đỉnh; thần đạo: phần 08 §2.6 |
| Hiệu ứng | biển mây dưới chân |
| Thời tiết | sương 30%, gió mạnh 20% |
| Mở màn | «子平峰 · Tử Bình Phong — nơi định cách cục» |
| Câu màn tải | «Cách cục là khung nhà. Vận là mùa. Người là kẻ ở trong nhà.» |

## 4. Manh Phái Cốc (`manh`)

| Hạng | Quyết định |
|---|---|
| Bảng màu (đề xuất) | rêu `#4f6b45` · đá đen `#2f2e30` · sương `#c9ccc8` · gỗ cũ `#5b4636` · đèn dầu `#d99a3c` |
| Tông LUT | tối, ẩm, ánh đèn dầu ấm — thung lũng của người đọc tượng |
| Nhạc | `BGM-MANH-*` (âm cung A) — tam huyền |
| Môi trường | `-007/-008`; suối `SFX-WATER-001` |
| Bước chân | đá cuội, đất `-06x`, nước nông `-12x` |
| Vang | thung lũng 1,8 s |
| Camera | thung lũng — mặc định, pitch 0,36 |
| Hiệu ứng | sương thung lũng thấp |
| Thời tiết | sương 40%, mưa 20% |
| Mở màn | «盲派谷 · Manh Phái Cốc — đọc tượng bằng tai và tay» |
| Câu màn tải | «Thầy Manh phái không nhìn lá số. Thầy nghe nó.» |
| Tôn trọng | người thầy khiếm thị được khắc họa là bậc thầy, không bi thảm hóa; giao diện Sảnh Tượng Pháp có chế độ «nghe» (đọc to lá số bằng VO ghép) |

## 5. Trích Thiên Đỉnh (`trichthien`)

| Hạng | Quyết định |
|---|---|
| Bảng màu (đề xuất) | tím đêm `#2b2a55` · bạc sao `#d9dcef` · vàng sao `#e9c46a` · đá `#6e6a72` · ngói lam `#3c4f7a` |
| Tông LUT | đẹp nhất về đêm: trời sao đậm hơn nơi khác 30% |
| Nhạc | `BGM-TRICHTHIEN-*` (âm cung F); trong Đẩu Mẫu Điện `BGM-INT-DAUMAU` |
| Môi trường | `-009/-010`; chuông mái `SFX-BELL-006` |
| Bước chân | đá `-01x`, băng mỏng mùa đông `-11x` |
| Vang | đỉnh 0,3 s; Đẩu Mẫu Điện 0,9 s |
| Camera | pitch mặc định thấp hơn 0,08 (dễ ngước nhìn sao) |
| Hiệu ứng | sao băng hiếm (1 / 3 phút, đêm, tắt khi giảm chuyển động) |
| Mở màn | «滴天頂 · Trích Thiên Đỉnh — bầu trời của Tử Vi» |
| Câu màn tải | «Mười hai cung Tử Vi là một tấm bản đồ trời. Lá số là tọa độ của bạn trên đó.» |

## 6. Cùng Thông Hồ (`cungthong`)

| Hạng | Quyết định |
|---|---|
| Bảng màu (đề xuất) | lam hồ `#2f6f8f` · sen `#e8a1b4` · cát `#d8c7a0` · lau `#a9a46a` · gỗ thuyền `#6b4a2e` |
| Tông LUT | mát, mờ hơi nước |
| Nhạc | `BGM-CUNGTHONG-*` (âm cung D♭) |
| Môi trường | `-011/-012`; sóng `SFX-WATER-006`; mái chèo `-008` |
| Bước chân | gỗ bến `-04x`, cát `-15x`, nước nông `-12x` |
| Vang | ngoài trời mở 0,5 s |
| Camera | hồ: pitch 0,30, dist 18 |
| Hiệu ứng | gợn nước, đèn hoa đăng lễ Hạ Nguyên |
| Thời tiết | sương sớm 35%, mưa 20% |
| Mở màn | «窮通湖 · Cùng Thông Hồ — nước điều hậu» |
| Câu màn tải | «Lá số lạnh cần lửa, lá số nóng cần nước. Điều hậu là giữ cho vừa.» |

## 7. Thư Lâu Lâm (`thulau`)

| Hạng | Quyết định |
|---|---|
| Bảng màu (đề xuất) | nâu sách `#7a5a3a` · lục rừng `#3d5a3c` · giấy `#efe2c4` · mực `#1f1b1a` · đồng `#a87b3d` |
| Nhạc | `BGM-THULAU-*` (âm cung C); trong Văn Xương Các `BGM-INT-VANXUONG` |
| Môi trường | `-013/-014` |
| Bước chân | lá khô `-08x`, sàn gỗ lầu `-03x` |
| Vang | rừng 0,8 s; Thư Lâu 1,2 s |
| Hiệu ứng | bụi nắng trong lầu sách, trang giấy bay khi gió |
| Mở màn | «書樓林 · Thư Lâu Lâm — rừng sách» |
| Câu màn tải | «Mỗi ngày Thư Lâu mở một tầng sách. Đọc chậm cũng là tu.» |

## 8. Phong Thủy Viên (`phongthuy`)

| Hạng | Quyết định |
|---|---|
| Bảng màu (đề xuất) | lục vườn `#4f7a4a` · đá Thái Hồ `#8d8a84` · nước `#5e8fa0` · gạch `#9a5a3e` · tre `#a8b06a` |
| Nhạc | `BGM-PHONGTHUY-*` (âm cung B♭) |
| Môi trường | `-015/-016`; ống tre `SFX-WATER-014`; chuông gió |
| Bước chân | sỏi `-05x`, cỏ `-07x` |
| Hiệu ứng | lá rơi, nước ống tre |
| Mở màn | «風水園 · Phong Thủy Viên — vườn của la bàn» |
| Câu màn tải | «Hướng nhà tốt mà cửa bị chắn thì cũng như không. Xem cả hình lẫn khí.» |

## 9. Lịch Đường (`lichduong`)

| Hạng | Quyết định |
|---|---|
| Bảng màu (đề xuất) | đồng xanh `#4f7f72` · vàng lịch `#d8b45a` · đá `#7f7b72` · son `#9c2a1e` · giấy `#f0e6cc` |
| Nhạc | `BGM-LICHDUONG-*` (âm cung G♭), nhịp lậu khắc |
| Môi trường | `-017/-018`; giọt lậu khắc `SFX-WATER-010` |
| Bước chân | đá `-01x` |
| Hiệu ứng | bóng đồng hồ mặt trời (khuê biểu) chạy theo giờ thật |
| Mở màn | «曆堂 · Lịch Đường — nơi chọn ngày» |
| Câu màn tải | «Ngày lành không làm thay việc của bạn. Nó chỉ không cản đường.» |

## 10. Long Hổ Sơn · Tự Hán Thiên Sư Phủ (`longho`) — Chính Nhất

| Hạng | Quyết định |
|---|---|
| Bảng màu khóa (canon) | trắng vôi `#EDEBE4` · xám ngói `#3B3D40` · đỏ trầm `#7A2A1E` · lục rêu `#4E6B45` · đỏ đá đan hà `#B5523B` |
| Tông LUT | chiều đỏ cam trên vách đan hà; tường trắng sáng ban ngày |
| Nhấn giao diện | `--dt-zhengyi #a8452f`, chữ 正 |
| Nhạc | `BGM-LONGHO-*` (âm cung C) — nhị, trống, tù và, kèn bầu |
| Môi trường | `-019/-020`; sông Lô Khê `SFX-WATER-005`; bè tre |
| Bước chân | đá lát phủ `-01x`, đá đỏ `-17x`, tre (bè) `-14x` |
| Vang | phủ đệ: điện gỗ 1,6 s; vách đỏ: thung lũng 1,8 s |
| Camera | mặc định; sân phủ rộng |
| Hiệu ứng | `fx.env.redcliff`; khói hương thụ lục |
| Thời tiết | mưa 25% (Giang Tây ẩm), sương sông sớm |
| Biển | «嗣漢天師府» (canon) |
| Mở màn | «龍虎山 · Long Hổ Sơn — Chính Nhất · theo Thiên Sư Phủ, Giang Tây» |
| Câu màn tải | «Phù là lời hứa giữ mình. Nhà không yên thì xem phong thủy trước, phù sau.» |
| Tôn trọng | Trương Thiên Sư hư cấu, không gắn đời Thiên Sư có thật (canon §7.1) |

## 11. Võ Đang Huyền Nhạc (`vodang`) — Thanh Vi · Đan Đỉnh

| Hạng | Quyết định |
|---|---|
| Bảng màu khóa (canon) | đỏ son `#A3271B` · lục lưu ly `#2F7A55` · vàng đồng `#C9A23A` · xám đá `#8D8A84` · mây `#E9EEF2` |
| Tông LUT | biển mây trắng, mái lưu ly xanh lục nổi bật |
| Nhấn | `--dt-wudang #3f9a6c`, chữ 武 |
| Nhạc | `BGM-VODANG-*` (âm cung F) |
| Môi trường | `-021/-022`; vượn xa `-048` |
| Bước chân | bậc đá rêu `-09x`, đá `-01x` |
| Vang | vách 1,8 s; Kim Điện đỉnh 0,3 s |
| Camera | thần đạo leo núi (pitch 0,22, dist 14, ahead +40% khi dốc) |
| Hiệu ứng | `fx.wx.cloudsea`, thác, khói lò đan |
| Biển | «玄嶽門» (Huyền Nhạc môn — nguyên mẫu bài phường đá) |
| Mở màn | «武當 · Võ Đang Huyền Nhạc — Thanh Vi · Đan Đỉnh» |
| Câu màn tải | «Thái Cực không nhanh. Chậm mà không đứt.» |
| Tôn trọng | không «khí công chữa bệnh», không hướng dẫn nhịn ăn (canon §6.2) |

## 12. Chung Nam Toàn Chân (`chungnam`) — Toàn Chân · Linh Bảo

| Hạng | Quyết định |
|---|---|
| Bảng màu khóa (canon) | xám gạch `#6E6A66` · đỏ tường `#8E2F24` · lam toàn tỉ `#2E5C8A` · lục `#3F7F5A` · trắng tuyết `#F2F2EE` |
| Tông LUT | đông: trắng lạnh; hè: thung lũng xanh |
| Nhấn | `--dt-quanzhen #4a7fb5`, chữ 全 |
| Nhạc | `BGM-CHUNGNAM-*` (âm cung E♭) |
| Môi trường | `-023/-024`; quét lá `-060` |
| Bước chân | gạch `-02x`, tuyết `-10x` (mùa đông) |
| Vang | điện gạch 2,2 s; động tu: hang 3,0 s |
| Hiệu ứng | `fx.wx.snow` mùa đông (tháng 11–2 theo lịch thật) |
| Biển | «重陽宮» (Trùng Dương Cung — nguyên mẫu) |
| Mở màn | «終南 · Chung Nam — Toàn Chân · tùng lâm thập phương» |
| Câu màn tải | «Giới luật không phải hàng rào. Nó là bờ cho dòng nước chảy.» |

## 13. Mao Sơn Thượng Thanh (`maoshan`) — Thượng Thanh · Lư Sơn

| Hạng | Quyết định |
|---|---|
| Bảng màu khóa (canon) | trắng `#F0EEE8` · đen ngói `#2A2B2E` · lục trúc `#6D9B57` · xám đá xanh `#5B6670` · vàng đồng `#B8923A` |
| Tông LUT | sương mù trong sáng (không âm u) |
| Nhấn | `--dt-maoshan #7fb066`, chữ 茅 |
| Nhạc | `BGM-MAOSHAN-*` (âm cung A) |
| Môi trường | `-025/-026`; gió trúc `SFX-WIND-004` |
| Bước chân | tre `-14x`, đá `-01x`, đất đồi chè `-06x` |
| Vang | rừng 0,8 s |
| Hiệu ứng | `fx.env.bamboo`, `fx.wx.fog` (nhẹ) |
| Biển | «九霄萬福宮» (Cửu Tiêu Vạn Phúc Cung — nguyên mẫu) |
| Mở màn | «茅山 · Mao Sơn Thượng Thanh — trừ tà chính tông» |
| Câu màn tải | «Đa phần cái gọi là tà là người mình mệt. Ngủ đủ đã, rồi thầy xem.» (câu persona canon) |
| Tôn trọng | không hình ảnh kinh dị; chẩn đoán đời thực trước (UI-90) |

## 14. Yên Tử Trúc Lâm (`yentu`) — Thiền

| Hạng | Quyết định |
|---|---|
| Bảng màu khóa (canon) | đỏ ngói `#8B3A2B` · nâu gỗ lim `#5A3826` · lục tùng `#2F4F3A` · xám đá `#9A968C` · đồng `#A87B3D` |
| Tông LUT | rừng tùng xanh sẫm, mây vờn, nắng xuyên |
| Nhấn | `--dt-truclam #4f7d5f`, chữ 禪 |
| Nhạc | `BGM-YENTU-*` (âm cung D) |
| Môi trường | `-027/-028`; người hành hương `SFX-CROWD-005` |
| Bước chân | bậc đá rêu `-09x`, gạch chùa `-02x`, lá tùng `-08x` |
| Vang | rừng 0,8 s; chùa 2,2 s |
| Camera | thần đạo leo núi |
| Hiệu ứng | `fx.env.pinecone`, `fx.post.godrays` (Cao) |
| Biển | chờ cố vấn (tên chữ Hán các chùa Giải Oan, Hoa Yên, Chùa Đồng cần đối chiếu nguồn) |
| Mở màn | «竹林 · Yên Tử Trúc Lâm — Thiền Việt» |
| Câu màn tải | «Thiền không cần đáp án. Cần ngồi lại.» |
| Tôn trọng | Trần Nhân Tông và Thiền phái Trúc Lâm là di sản Việt — không đặt NPC đóng vai Phật hoàng; cố vấn Phật giáo Việt duyệt |

## 15. Bút Tháp Tịnh Độ (`buttap`) — Tịnh Độ · sám hối

| Hạng | Quyết định |
|---|---|
| Bảng màu khóa (canon) | đỏ ngói `#9A4130` · son thếp vàng `#B8862B` · nâu lim `#4F3020` · lục sen `#4F7A3E` · hồng sen `#E8A1B4` |
| Tông LUT | đồng quê Bắc Bộ, ấm, mềm |
| Nhấn | `--dt-tinhdo #e8a1b4`, chữ 淨 |
| Nhạc | `BGM-BUTTAP-*` (âm cung G); điện Phật `BGM-INT-CHUA` |
| Môi trường | `-029/-030`; giếng `SFX-WATER-011`; cối giã `-052`; trâu `-053` |
| Bước chân | gạch vồ `-02x`, đất làng `-06x`, bùn ruộng `-13x` |
| Vang | chùa gạch – đá 2,2 s; đồng 0,4 s |
| Hiệu ứng | `fx.rite.lotus9` (Cửu phẩm liên hoa), đèn hoa đăng, `fx.env.ricefield` |
| Biển | «寧福寺» (Ninh Phúc tự — tên chính thức của chùa Bút Tháp) |
| Mở màn | «筆塔 · Bút Tháp Tịnh Độ — niệm Phật, sám hối, phóng sinh» |
| Câu màn tải | «Tham, sân, si ai cũng có. Đếm được thì bớt được.» (câu persona canon) |

## 16. Tạng Địa Tuyết Vực (`tangdia`) — Mật (Chuẩn Đề) · **chờ tham vấn**

| Hạng | Quyết định |
|---|---|
| Bảng màu khóa (canon) | trắng vôi `#F1EEE6` · đỏ Hồng cung `#7B1E1E` · vàng kim đỉnh `#D8A928` · đen khung `#1E1A18` · lam hồ `#3FA7C9` |
| Tông LUT | nắng cao nguyên gắt, trời lam sâu |
| Nhấn | `--dt-mat #3fa7c9`, chữ 密 |
| Nhạc | `BGM-TANGDIA-*` bản tạm (chuông bát, gió, kèn xa) |
| Môi trường | `-031/-032`; cờ gió `SFX-WIND-009`; yak `-053`; đục đá mani `-058` |
| Bước chân | tuyết `-10x`, băng `-11x`, thảm trong điện `-16x` |
| Vang | đèo: đỉnh 0,3 s; điện 1,6 s |
| Camera | cao nguyên (pitch 0,26, dist 22) |
| Hiệu ứng | `fx.env.lungta`, `fx.wx.snow` |
| Biển | chờ cố vấn |
| Mở màn | chờ cố vấn (tạm: «雪域 · Tạng Địa Tuyết Vực») |
| Tôn trọng | không lồng tiếng, không tụng, không mô phỏng nghi lễ cho tới khi có cố vấn (canon §3, §14) |

## 17. Văn Miếu Quốc Tử Giám (`vanmieu`) — Nho · Tịnh Minh

| Hạng | Quyết định |
|---|---|
| Bảng màu khóa (canon) | đỏ gạch `#8A3B2A` · son `#9C2A1E` · xám bia đá `#7F7B72` · lục cổ thụ `#3E5C38` · vàng hoàng `#C6A044` |
| Tông LUT | trang nghiêm, xanh cổ thụ, hồ Văn phản chiếu |
| Nhấn | `--dt-nho #c6a044`, chữ 儒 |
| Nhạc | `BGM-VANMIEU-*` (âm cung C), lễ: đại nhạc |
| Môi trường | `-033/-034`; sĩ tử đọc bài `SFX-CROWD-004` |
| Bước chân | gạch `-02x`, đá `-01x` |
| Vang | điện gạch – đá 2,2 s; sân 0,5 s |
| Hiệu ứng | bia Tiến sĩ khắc tên người chơi đỗ (P4), cá hồ Văn |
| Biển | «文廟», «奎文閣» (Khuê Văn Các), «國子監» |
| Mở màn | «文廟 · Văn Miếu Quốc Tử Giám — Nho môn» |
| Câu màn tải | «Lập chí trước. Chí lập rồi thì đường tự mở.» |
| Tôn trọng | bia Tiến sĩ thật là di sản (UNESCO Ký ức Thế giới) — bia trong game là **bia mới** khắc tên người chơi, không làm giả bia cổ |

## 18. Phong Đô Quỷ Thành (`phongdo`) — Bắc Đế · Động Uyên · Địa Tạng

| Hạng | Quyết định |
|---|---|
| Bảng màu khóa (canon) | đen đá `#1C1B1F` · đỏ sẫm `#5A1414` · lam ma `#3E7FA8` · đỏ bỉ ngạn `#C21F2B` · xám sương `#6A6A70` |
| Tông LUT | lạnh, tối nhưng **đọc được** (độ sáng tối thiểu cảnh ≥ 15% để không mất chi tiết trên điện thoại) |
| Nhấn | `--dt-phongdo #5a95bd`, chữ 酆 |
| Nhạc | `BGM-PHONGDO-*` (âm cung B) + lớp hy vọng khi hồi đầu |
| Môi trường | `-035/-036`; giọt nước hang `SFX-WATER-009`; quạ `-045` |
| Bước chân | đá `-01x`, đá hang ẩm (dùng `-09x`) |
| Vang | hang 3,0 s; Thiên Tử điện 2,2 s |
| Camera | hang / ngõ hẹp (pitch 0,45, dist 9) |
| Hiệu ứng | `fx.env.bianhua`, `fx.wx.fog` |
| Biển | «鬼門關» (Quỷ Môn Quan), «奈何橋» (cầu Nại Hà) |
| Mở màn | thẻ cảnh báo nội dung (phần 14 §9 E7) rồi «酆都 · Phong Đô — nơi trả nghiệp và cứu người» |
| Câu màn tải | «Không có điểm không quay lại được.» |
| Tôn trọng | không quái, không dọa (canon §7.9); Phán quan đọc sổ như sổ sách |

## 19. Miêu Cương Cổ Trại (`mieucuong`) — bàng môn (hư cấu)

| Hạng | Quyết định |
|---|---|
| Bảng màu khóa (canon) | nâu gỗ sam `#6B4A2E` · xám ngói `#4A4A4C` · lam sáp `#2B4E7A` · bạc `#D7DADF` · lục sông `#3D8A78` |
| Tông LUT | sông xanh lục, sương, ruộng bậc thang — tươi, sống động |
| Nhấn | `--dt-mieu #4fa08c`, chữ 苗 |
| Nhạc | `BGM-MIEUCUONG-*` (âm cung E); hang Lỗ Ban: `BGM-MIEUCUONG-HANG` |
| Môi trường | `-037/-038`; lửa bếp `-051`; cối giã `-052`; cọn nước `-057` |
| Bước chân | gỗ nhà sàn `-03x`, gỗ cầu phong vũ `-04x`, bùn ruộng `-13x`, đá suối |
| Vang | thung lũng 1,8 s; hang 3,0 s |
| Hiệu ứng | `fx.env.ricefield`, `fx.env.fireflies`, hơi nước nồi thuốc |
| Biển | chờ cố vấn (văn hóa Miêu) |
| Mở màn | «苗疆 · Miêu Cương Cổ Trại — vu y và chuyện xưa» |
| Câu màn tải | «Người Miêu ở đây là người chữa, không phải người hại.» |
| Tôn trọng | trang phục bạc, hoa văn sáp ong — tham vấn nghệ nhân; không gán biểu tượng văn hóa Miêu cho phe ác (canon §5.5) |

## 20. Côn Lôn Thiên Trì (`conlon`) — quy nhất (end-game)

| Hạng | Quyết định |
|---|---|
| Bảng màu khóa (canon) | trắng ngọc `#F4F1EA` · vàng lưu ly `#E3B341` · lam trời `#7FB7E6` · hồng đào `#F2A9BC` · bạc mây `#DDE3EA` |
| Tông LUT | sáng nhất game, khuếch tán, ít bóng gắt |
| Nhấn | `--dt-conlon #7fb7e6`, chữ 崑 |
| Nhạc | `BGM-CONLON-*` (âm cung D) + lớp theo đạo thống đã tu |
| Môi trường | `-039/-040`; thác `SFX-WATER-003/004`; hạc |
| Bước chân | mây `-18x`, ngọc / đá trắng `-01x` |
| Vang | biển mây 4,0 s (mix 15%) |
| Camera | cao nguyên + `cam.skyward` khi tới Dao Trì |
| Hiệu ứng | `fx.wx.cloudsea`, `fx.env.waterfall`, hạc, đào tiên nở |
| Biển | «瑤池» (Dao Trì) |
| Mở màn | «崑崙 · Côn Lôn Thiên Trì — quy nhất» (chỉ khi đủ điều kiện quy nhất) |
| Câu màn tải | «Mệnh do ta tạo.» |

## 21. Am Vân Cốc (`vancoc`) — Liễu Phàm

| Hạng | Quyết định |
|---|---|
| Bảng màu (đề xuất) | tranh mái `#a89160` · đá vách `#6a665e` · rêu `#5a6e4a` · giấy cũ `#c9b98f` · lửa bếp `#d98a3a` |
| Tông LUT | mưa nhẹ là trạng thái «đẹp nhất» của am |
| Nhấn | `--dt-vancoc #c9b98f`, chữ 雲 |
| Nhạc | `BGM-VANCOC-*` (âm cung G) — tiêu đơn |
| Môi trường | `-041/-042`; mưa mái tranh `SFX-RAIN-002`; ấm trà `SFX-WATER-015` |
| Bước chân | đá vách `-09x`, sàn tre am `-14x` |
| Vang | am nhỏ: phòng gỗ 0,6 s |
| Camera | trong am: camera trong nhà (phần 08 §3.1), dist 6 |
| Hiệu ứng | `fx.env.steam`, `fx.wx.drizzle` |
| Mở màn | «雲谷 · Am Vân Cốc — mệnh do ta tạo» |
| Câu màn tải | «Mỗi việc thiện là một nét bạn tự viết lại.» |

---

## 22. Trình bày lễ tiết (canon §10)

| Lễ | Ngày | Thay đổi giao diện | Thay đổi cảnh | Nhạc | Tiếng |
|---|---|---|---|---|---|
| Lập Xuân / Tết | tiết Lập Xuân; mùng 1 tháng Giêng | khung bảng viền câu đối đỏ chữ vàng; màn tải câu chúc; Đạo Lộ mùa mới (UI-74) | tượng niên chủ Thái Tuế mới ở Thái Tuế Điện; đào nở toàn Huyền Thành; câu đối trên cổng | `BGM-EV-TET` | pháo xa (tùy chọn tắt) `SFX-RITE-053`; chiêng trống |
| Thượng Nguyên | Rằm tháng Giêng | đèn lồng trang trí góc bảng | đèn lồng khắp phố, Thái Tuế Điện thắp đèn chung | `BGM-EV-THUONGNGUYEN` | — |
| Trung Nguyên – Vu Lan | Rằm tháng Bảy | màu nhấn đổi sang `--dt-tinhdo` (hoa hồng cài áo) | hồ sen nhiều đèn hoa đăng; Phong Đô mở lối | `BGM-EV-VULAN` | chuông chùa, ngân xa |
| Hạ Nguyên | Rằm tháng Mười | — | đèn trên Cùng Thông Hồ | `BGM-EV-HANGUYEN` | — |
| Trùng Cửu (Đẩu Mẫu) | 9/9 âm | — | Đẩu Mẫu Điện 49 đèn đàn lễ (UI-93 bản MMO) | `BGM-EV-TRUNGCUU` | chuông sao |
| Phật đản | theo lịch Phật giáo (tài liệu 10 chốt ngày) | — | Bút Tháp, Yên Tử treo cờ Phật giáo; lễ tắm Phật | `BGM-EV-PHATDAN` | chuông, mõ |
| Tết thầy / giỗ Khổng Tử | tài liệu 10 chốt ngày | bảng vàng khoa cử đặc biệt | Văn Miếu treo đèn, đại nhạc | `BGM-EV-TETTHAY` | trống báo |

**Luật lễ tiết:** giao diện chỉ đổi **trang trí** (viền, màu nhấn, hình nền màn tải) — không đổi bố cục, không chặn thao tác; mọi lễ có câu một dòng giải thích ý nghĩa trên thẻ lịch (UI-69), đọc được trước khi tham gia; lễ tôn giáo được duyệt bởi cố vấn truyền thống tương ứng.
