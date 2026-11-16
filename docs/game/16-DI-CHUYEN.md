# 16 · Di chuyển: đi, chạy, bơi, leo, thuyền, đạp nước, bay

> **Trạng thái:** `[ĐÃ CÓ]`
> **Bộ phận chủ trì:** Thiết kế game · Client/3D
> **Nguồn sự thật trong mã:** `src/game/motion.js`, `src/game/water.js`, `src/game/movement.js`, `src/game/flight.js`, `src/game/flight-poses.js`, `src/game/boats.js`, `src/game/boat-ui.js`, `src/game/main.js` (điều khiển); số liệu ở [A3](phu-luc/A3-so-lieu.md) mục 16
> **Test:** `scripts/test-game-motion.mjs`, `scripts/test-game-water.mjs`, `scripts/test-game-flight.mjs`, `scripts/test-game-sky.mjs`
> **Thay thế:** `GAME-SINH-TON-KINH-TE-DAC-TA` §21, §22; các mục «Di chuyển tự do», «Làm lại thủy hệ» trong nhật ký `GAME-V2-THIET-KE`
> **Kiểm với mã ngày:** 2026-11-16

## 16.0 Mục đích, phạm vi, tóm tắt

Người chơi đi tới được mọi nơi mình nhìn thấy (TC-5), bằng nhiều cách có giá khác nhau. Không gồm: phương tiện sở hữu và phí nuôi (§15.3), tìm đường và va chạm về mặt kỹ thuật (§30), bố cục sông cầu (§10).

| Cách đi | Ai dùng được | Giá phải trả | Mục |
|---|---|---|---|
| Đi, chạy nhanh, nhảy, nhảy đôi, lượn | mọi người | thể lực | §16.1 |
| Lội, bơi | mọi người | thể lực; kiệt sức thì trôi | §16.2 |
| Leo bám tường, cây, vách | chỉ VIP | — | §16.1 |
| Thuyền thuê | mọi người | tiền thuê theo 30 phút | §16.2 |
| Đạp nước | theo cấp và mệnh, hoặc vật phẩm | thể lực (nhánh thân pháp) | §16.3 |
| Ngự kiếm, vật cưỡi bay | cấp 8 hoặc VIP | hao Tỉnh | §16.4 |
| Xe ngựa nội thành, thang lên trời | mọi người | vài đồng hoặc miễn phí | §16.5 |

## 16.1 Di chuyển tự do trên cạn

`[ĐÃ CÓ]` Hằng số ở [A3](phu-luc/A3-so-lieu.md) › `motion.js`.

- **Chạy nhanh:** giữ Shift, nhanh hơn `SPRINT` lần, tốn thể lực. Thanh thể lực chỉ hiện khi chưa đầy. Tỉnh thấp thì không chạy nhanh được (§13.2).
- **Nhảy:** Space; bấm lần nữa trên không để nhảy đôi. Giữ Space khi đang rơi để **lượn**: rơi chậm, lướt nhanh.
- **Leo bám** (chỉ VIP): đi vào tường, nhà, tháp, cây hay vách dốc là tự đu lên; tới đỉnh thì bước lên mái hoặc mặt thành; Space để bật khỏi vách. Người không có VIP nhận lời nhắc.
- **Đỉnh công trình:** mọi nhà, tường thành, công trình, cây đều có độ cao đỉnh để đứng lên (`obstacles.tallTopAt`). Ra mép thì rơi theo trọng lực, lượn được.
- **Bước và bậc:** bậc thấp hơn `STEP_UP` thì bước lên; cao hơn phải nhảy.
- **Độ cao gửi lên mạng:** người khác thấy đúng độ cao, kèm hoạt ảnh chạy, leo, bơi, bay (§31).
- Trong phòng nội thất chỉ đi bộ.

## 16.2 Nước và thuyền

`[ĐÃ CÓ]` Hằng số ở [A3](phu-luc/A3-so-lieu.md) › `motion.js`, `water.js`, `boats.js`.

- **Lội** ở độ sâu trong dải `WADE`: chậm, không chạy. Sâu hơn thì **bơi**: nổi quanh mặt sóng, có quán tính, bị dòng chảy cuốn. Giữa sông dòng mạnh: bơi thường gần như đứng yên, phải gắng sức mới tiến. Kiệt thể lực thì nổi trôi theo dòng.
- **Lên bờ:** bậc thấp thì bước lên; kè cao hơn thì đu trèo, tốn thể lực; kênh và hào có bậc bến đá.
- **Sóng** tính bằng một công thức dùng chung cho vật lý và hình (bốn sóng theo gió), nên người và thuyền nhấp nhô đúng mặt nước nhìn thấy.
- **Thuyền thuê:** ba loại — đò, thuyền hoa, thuyền buồm — thuê theo 30 phút ở các bến. Thuyền là vật rắn hai chiều: chèo hoặc buồm theo góc gió (ngược gió quá gắt thì không chạy), bánh lái ăn theo tốc độ, mắc cạn theo mớn nước, bị chặn bởi tĩnh không cầu và thủy môn. Trả ở bến, buộc ven bờ, lên lại.
- **Thuyền NPC:** thuyền hoa, thuyền buôn, đò dạo chạy tuyến cố định.
- **Người khác thấy:** gói vị trí mang trạng thái nước (lội, bơi, thuyền, đạp nước) và loại thuyền.

## 16.3 Đạp nước (Water-walking) và hiệu ứng mặt nước

> **Trạng thái:** `[ĐÃ CÓ]` (P14). Đang chạy: bốn nhánh điều kiện ở `movement.WATER_WALK`; đuối nước chỉ ngất (QĐ-16).

Khi đủ điều kiện, mặt nước thành **mặt đi được**: không bơi, không đuối. Nhân vật đi, chạy, đứng yên trên đúng mặt sóng nhìn thấy (`water.js › surfaceAt`, cùng công thức sóng với shader — phiên làm lại sông nước).

```
[Chạm mặt nước] → còn điều kiện? ─ có ─→ khoá bơi · sàn = mặt sóng + 0,02 · tư thế đạp nước · hiệu ứng từng bước
                                   └ không → bơi / lội như thường (motion.js)
```

### 16.3.1 Điều kiện

| Nhánh | Tên | Điều kiện mở | Vận hành |
|---|---|---|---|
| **Thân pháp** | Thủy Thượng Phiêu | Người có **Dụng thần Thủy**: cấp 10. Hỷ thần Thủy: cấp 12. Học ở Thư Lâu (sách «Thủy Kinh Chú Giải») + thử thách ở bến Huyền Hà | tốn **2 thể lực / giây** khi đứng trên nước, 3 / giây khi chạy |
| **Thân pháp** | Lăng Ba Vi Bộ | Mọi mệnh, cấp 15 + hoàn thành chuỗi án «Lạc Thần» ở Cùng Thông Hồ | 2,5 thể lực / giây; chạy nhanh hơn 10% |
| **Trang bị** | Hài Hộ Thân | Mua bằng Ngọc ở Tàng Y Các (bản web; **ẩn trên iOS** như Ngọc nạp) | bị động, **không tốn thể lực** |
| **Pháp bảo** | Định Thủy Châu | Mua bằng Ngọc ở Tàng Y Các (bản web; ẩn trên iOS) — quyết định 15; cũng là thưởng chuỗi nhiệm vụ Cùng Thông Hồ | bị động, không tốn thể lực; đứng yên câu cá, đàm đạo được |

- «Cảnh giới» trong bản gốc dùng **cấp** có sẵn (`progress.js`, cấp tính theo Phúc Khí tích lũy cả đời).
- **Hết thể lực** (nhánh thân pháp): mất phép, rơi xuống nước, chuyển sang bơi.
  - Vẫn kiệt sức ở nước sâu thì **đuối nước**: Khí huyết −3 / giây.
  - Khí huyết về 0 thì ngất như hệ có sẵn (`life.js › faint`), trừ khi Âm Đức cấp 4 cứu (§18.2).
- **Dòng chảy:** đứng trên nước vẫn bị dòng đẩy nhẹ (30% vận tốc dòng). Đứng yên giữa sông sẽ trôi chậm, đúng cảm giác lướt sóng.
- **Không đi trên:** thác ghềnh (độ dốc mặt nước > 8%), nước dưới cầu thấp hơn đầu người, thủy môn. Thuyền đang chạy là vật cản.
- **Kinh tế:** không mở đường tắt nào cho việc làm. Phu dịch trạm vẫn bị máy chủ kiểm tốc độ (≤ 12 m/s, §14.2.4); đạp nước không nhanh hơn chạy bộ.

### 16.3.2 Hiệu ứng hình, tiếng

- **Gợn sóng theo bước:** vòng tròn loang ra từ chỗ chân chạm, vẽ bằng shader vòng nước trên một tấm phẳng nằm ngay trên mặt sóng. Có phản chiếu trời.
  - Một bộ nhân bản chung, tối đa 32 vòng cùng lúc, mỗi vòng sống 1,2 giây.
- **Dấu chân độc bản** theo nguồn phép:
  - **Tiên đạo** (Lăng Ba Vi Bộ, Định Thủy Châu): **Bộ Bộ Sinh Liên** — mỗi bước nở một đài sen phát sáng mờ, tàn trong 1,5 giây. Nhân bản, tối đa 24 đài.
  - **Khí công** (Thủy Thượng Phiêu, Hài Hộ Thân): bọt nước bắn nhẹ hai bên + sương trắng (sprite) đẩy người lướt.
- **Tiếng:** tiếng ngọc gõ nước, tiếng gợn lướt êm (tổng hợp bằng WebAudio trong `audio.js`, như tiếng chuông có sẵn).
  - Người khác nghe theo vị trí: `PannerNode`, ngoài 40 m thì tắt.
- **Chất lượng thấp** chỉ giữ gợn sóng; tắt sen và sương.
- **Mạng:** cờ trạng thái nước trong gói `mv` (phiên sông nước thêm) có thêm giá trị «đạp nước» + kiểu dấu chân, để người khác thấy đúng tư thế và hiệu ứng.

## 16.4 Phi hành độc bản (Bespoke flight)

> **Trạng thái:** `[ĐÃ CÓ]` (P15). Máy trạng thái ở `flight.js`, tư thế sáu vật cưỡi ở `flight-poses.js`; trần cộng tốc độ là `flight.SPEED_CAP`.

### 16.4.1 Hiện trạng

- Ngự kiếm mở ở cấp 8 hoặc VIP (`progress.js`). Bay nhanh gấp 4, độ cao 3–420 m, vượt mọi vật cản.
- Vật cưỡi là trang bị ô «Ngự vật» (`cosmetics.js`):

  | Vật cưỡi | Giá |
  |---|---|
  | Ngự Kiếm | miễn phí |
  | Cân Đẩu Vân | 200 Ngọc |
  | Hồ Lô Phi Hành | 200 Ngọc |
  | Liên Hoa Đài | 360 Ngọc |
  | Tiên Hạc | 780 Ngọc + VIP |

- Hình vật cưỡi dựng thủ tục trong `accessories.js`, gắn dưới chân. Người cưỡi vẫn dùng tư thế đứng / đi.

### 16.4.2 Máy trạng thái bay (mọi vật cưỡi)

| Trạng thái | Vào khi | Thời lượng / quy tắc |
|---|---|---|
| **1 · Cất cánh** | bấm Bay (điện thoại: vuốt nút Nhảy lên — §22.2) | 0,8 s: lên 3 m, bung hiệu ứng khởi động, rồi sang Trôi |
| **2 · Trôi tại chỗ** | tốc độ ngang < 0,5 m/s | tư thế «thần thái» của vật cưỡi; nhấp nhô chậm |
| **3 · Hành trình** | đang bay ngang | tốc độ chuẩn |
| **4 · Tăng tốc / bổ nhào** | giữ chạy nhanh, hoặc hạ độ cao nhanh hơn 6 m/s | tốc độ ×1,5 (như nhau mọi vật cưỡi); tư thế ép gió |
| **5 · Hạ cánh** | bấm Bay lần nữa, hoặc độ cao < 2 m khi đang hạ | 0,6 s giảm chấn, tiếp đất êm |

- Chuyển trạng thái **trộn tư thế** 0,25 s, không giật.
- **Tốc độ theo bậc hiếm** (quyết định 14): +5% mỗi bậc trên bậc 1, tối đa +20%; trần chung với pháp môn / cảnh giới +35% (§18.4.2). Độ cao và vật lý như nhau.

### 16.4.3 Bộ «độc bản» của từng vật cưỡi

Mỗi vật cưỡi là một gói:
- `pose` — 5 tư thế người cưỡi, là lớp lệch xương đặt lên khung xương `hero_m` / `hero_f`, trộn với clip có sẵn.
- `motion(t, state, bank, pitch)` — hàm chuyển động vật cưỡi.
- `vfx` — hệ hạt / vệt / vòng riêng.
- `sound` — tiếng riêng.

Không gói nào dùng lại `pose` hay `motion` của gói khác.

| Loại | Vật cưỡi | Tư thế người cưỡi | Chuyển động vật cưỡi | Hiệu ứng |
|---|---|---|---|---|
| **Phi kiếm** | Ngự Kiếm | Đứng nghiêng, một chân trước một chân sau; tay chắp sau lưng (trôi) / bắt kiếm quyết (tăng tốc) | Rung tần số cao biên độ nhỏ; tự nghiêng theo hướng rẽ | Vệt kiếm khí sau đuôi (dải ribbon); xoáy khí quanh mũi kiếm khi tăng tốc |
| **Tòa đài** | Liên Hoa Đài | Ngồi xếp bằng thiền định (clip `sit` + tay kết ấn) | Xoay chậm quanh trục đứng; nâng hạ theo nhịp thở 4 s | Vòng chân ngôn Bát Quái xoay dưới đáy; hào quang mờ quanh người |
| **Tòa đài** | Hồ Lô Phi Hành | Ngồi vắt chân trên miệng hồ lô, tay cầm chén rượu nghiêng | Lắc lư như say, xoay nhẹ quanh trục dọc | Khói tím vàng bay ra miệng hồ lô; hơi men lấp lánh |
| **Tòa đài** | Cân Đẩu Vân | Đứng chống nạnh một tay, tay kia che mắt nhìn xa | Mây cuộn biến dạng (dời đỉnh theo nhiễu), nghiêng theo cua | Mây ngũ sắc nâng bốn phía; vệt mây tan sau lưng |
| **Linh thú** | Tiên Hạc | Cúi người ôm cổ hạc khi tăng tốc; ngồi thẳng cầm dây lụa khi hành trình | Vỗ cánh chu kỳ sinh học (đập xuống nhanh, nâng lên chậm); cánh ép sát khi bổ nhào; lượn vòng không vỗ | Lông vũ phát sáng rơi khi vỗ; luồng gió rẽ mây; tiếng hạc kêu vọng 3D khi cất cánh |
| **Khí linh** | Ngũ Hành Dực (mới, 5 màu theo hành) | Lơ lửng tự do, tay thả lỏng nghiêng theo hướng bay | Đôi cánh năng lượng đập nhịp, uốn theo gió cản (dời đỉnh) | Bụi sao lấp lánh; dải hạt màu hành vẽ trên nền trời |

**Kỹ thuật:**
- **Tư thế:** bảng góc xương (vai, khuỷu, hông, gối, cột sống, đầu) cho 5 trạng thái, trộn vào `AnimationMixer`. Đặt ở `src/game/flight-poses.js`; test thuần kiểm đủ 5 trạng thái và không gói nào trùng nhau.
- **Tóc và vạt áo bay:** không giả lập vải. Dùng tham số gió trong shader áo (dời đỉnh phần dưới vạt theo tốc độ bay), dùng chung cho mọi vật cưỡi.
- **Model mới** (nếu cần, ví dụ hạc chi tiết hơn): chỉ tải từ thư viện đã có giấy phép, không tạo mới qua Meshy. Còn lại dựng thủ tục như `accessories.js`.
- **Ngân sách:**
  - ≤ 200 hạt / vật cưỡi của mình. Vật cưỡi người khác ngoài 60 m bỏ hạt, chỉ giữ hình.
  - Vệt: 1 dải ribbon 32 đoạn.
  - Chất lượng thấp chỉ giữ vệt.
- **Mạng:**
  - Vật cưỡi đã có trong gói trang bị (`cos`).
  - Thêm trường `fs` (trạng thái bay 1–5) vào `mv`, để người khác thấy cất cánh / bổ nhào / hạ cánh đúng lúc.

## 16.5 Đi lại trong thành và lên trời

`[ĐÃ CÓ]` (v4, v6, 14/11)

| Cách | Từ đâu tới đâu | Giá | Ghi chú |
|---|---|---|---|
| **Xe ngựa nội thành** | bấm bản đồ, chọn một trong các trạm xe | vài đồng; miễn phí cho cấp thấp | menu «Địa điểm» tự dùng xe khi đích xa hơn một ngưỡng, gần hơn thì tự đi bộ |
| **Về nhà riêng** | từ bất kỳ đâu | miễn phí | |
| **Thiên Thê** | thang mây ngoài tường Đông Sơn Môn → Nam Thiên Môn của Cửu Trọng Thiên | miễn phí | «Hạ phàm» ở Nam Thiên Môn để về |
| **Vân Thang** | trong sân Sơn Môn → đảo chủ quận Thiên Bàn (độ cao 460 m) | miễn phí | «Hạ giới» trước Nam Môn đảo chủ |
| **Cửa điện, cửa nhà** | cửa ngoài phố ↔ phòng ở dải phòng | miễn phí | ra đúng cửa đã vào |

Luật: **bay từ mặt đất không lên được hai vùng trời** (trần bay thấp hơn đáy nền đảo). Hai vùng trời chỉ vào bằng thang, để chúng là đích đến chứ không phải lối tắt.

## 16.6 Liên kết với hệ khác

| Hệ | Trao đổi | Chương |
|---|---|---|
| Đời sống | trần thể lực theo Tỉnh; chạy và bơi làm No tụt nhanh hơn; bay hao Tỉnh | §13.2 |
| Việc làm | nghề áp kiện bị kiểm tốc độ; không bay khi áp hàng | §14.2.4 |
| Mệnh | Dụng thần Thủy mở đạp nước sớm hơn | §16.3.1 |
| Tu luyện | pháp môn Khinh Công, Ngự Phong; cảnh giới cộng tốc bay | §18.4 |
| Tàng Y Các | vật cưỡi là trang bị ô Ngự vật; bậc hiếm cộng tốc độ | §11 |
| Luật | đang thụ án thì khoá ngự kiếm | §19 |
| Mạng | gói vị trí mang độ cao tương đối, độ cao tuyệt đối, trạng thái nước, loại thuyền, trạng thái bay | §31, [A4](phu-luc/A4-giao-thuc.md) |

## 16.7 Kiểm thử và nghiệm thu

- `test-game-motion` (10): nhảy, lượn, leo, bơi sông, lội, kiệt sức, gầm cầu.
- `test-game-water` (9): sông, hồ, cầu, thuyền.
- `test-game-flight` (3): đủ năm trạng thái, không gói tư thế trùng nhau, trần tốc độ.
- `test-game-sky` (44): đứng trên đảo không rơi, bốn cầu không hở, dưới gầm đảo không bị nhấc.
- Thêm một cách di chuyển: phải có dòng ở bảng §16.0, có trạng thái trong gói vị trí, có ca kiểm.

## 16.8 Việc còn mở

Không có việc riêng. Liên quan: `VC-012` (đo khung hình vùng trời).
