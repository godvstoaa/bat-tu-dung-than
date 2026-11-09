# 12 · Trình bày — Phần 20: Kịch bản trình bày các khoảnh khắc nghi thức

> Chi tiết hóa UI-33 (đột phá, đại nguyện) và các khoảnh khắc «một lần trong đời nhân vật»: từng bậc cảnh giới theo ba cách gọi, từng mốc đại nguyện, nghi thức nhập môn phái theo đạo, thụ lục, bảng vàng, lần đầu ngự kiếm, vào Côn Lôn; và cú máy `cam.reveal` cho 12 thánh địa. Thoại của NPC trong các khoảnh khắc thuộc tài liệu 03 / 06; ở đây có **câu hệ thống mặc định** (hiện khi NPC không có câu riêng hoặc khi tắt VO).
>
> Luật chung cho mọi khoảnh khắc: bỏ qua được từ giây 2; giảm chuyển động → thẻ tĩnh 2 s; âm thanh tắt → phụ đề mô tả âm (nếu bật); HUD ẩn, toast vào hàng đợi; người chơi khác trong 30 m thấy hiệu ứng nhưng **không** bị khóa điều khiển.

---

## 1. Đột phá cảnh giới — năm lần (bậc 2 → 6)

Bậc 1 là điểm xuất phát, không có đột phá. Tên bậc theo canon §5; người chơi chọn cách gọi ở UI-32 (mặc định theo đạo thống chính).

### 1.1 Chữ hiện trên trời (nét bút `fx.rite.ink`, phông `--ff-brush`)

| Bậc | Đạo | Phật | Nho | Ngưỡng |
|---|---|---|---|---|
| 2 | 入門 Nhập Môn | 皈依 Quy Y | 士 Sĩ | 100 |
| 3 | 煉精化氣 Luyện Tinh Hóa Khí | 持戒 Trì Giới | 君子 Quân Tử | 400 |
| 4 | 煉氣化神 Luyện Khí Hóa Thần | 定 Định | 賢人 Hiền Nhân | 1.000 |
| 5 | 煉神還虛 Luyện Thần Hoàn Hư | 慧 Tuệ | 大儒 Đại Nho | 2.200 |
| 6 | 煉虛合道 Luyện Hư Hợp Đạo | 解脫 Giải Thoát | 聖賢 Thánh Hiền | 4.500 |

Chữ bốn nét dài (bậc 3–6 hệ Đạo) viết **dọc** từ trên xuống; chữ một – hai nét (Phật, Nho) viết lớn ở giữa.

### 1.2 Tăng tiến theo bậc

| Bậc | Nhạc | Lớp nhạc cụ thêm | Hiệu ứng `fx.rite.ascend` | Camera `cam.ascend` | Dòng «Mở» (canon §9.1) | Câu hệ thống mặc định |
|---|---|---|---|---|---|---|
| 2 | `BGM-ASCEND-01` | cổ cầm đơn | cột sáng mảnh, 60 hạt | xoắn ốc cao 8 m | «Mở: 3 thánh địa gần» | «Bước đầu là bước khó nhất. Bạn đã bước.» |
| 3 | `BGM-ASCEND-02` | + sáo trúc | 100 hạt, vòng hành Dụng thần dưới chân | 10 m | «Mở: ngự kiếm (gộp từ cấp 8)» | «Tinh đã hóa khí. Hơi thở bạn đã khác.» (Phật: «Giữ giới là giữ mình.» · Nho: «Quân tử tự cường không nghỉ.») |
| 4 | `BGM-ASCEND-03` | + đàn bầu | 140 hạt, mây xoáy | 12 m | «Tiên Thiên thôi tính — từ đây chỉ còn công tu của bạn.» · «Mở: thánh địa xa» | «Từ đây, lá số không còn quyết định bạn đi bao xa.» |
| 5 | `BGM-ASCEND-04` | + chuông bát | 170 hạt, chữ Hán năm hành bay quanh | 12 m + nhìn xuống | «Mở: Phong Đô (lộ cứu người), Tạng Địa» | «Biết mình rỗng thì chứa được nhiều.» |
| 6 | `BGM-ASCEND-05` (toàn bộ chủ đề Côn Lôn) | + dây + hợp xướng ngân | 200 hạt, cột sáng nối tới đảo trời Côn Lôn | lên tới thấy Côn Lôn | «Mở: Côn Lôn (cần Quy nhất)» | «Mệnh do ta tạo.» |

`BGM-ASCEND-06` dành cho biến thể «đột phá tại Côn Lôn» (vĩ thanh) — thay vì cột sáng, cả biển mây sáng lên.

### 1.3 Biến thể theo nơi đột phá

| Nơi | Thay đổi |
|---|---|
| trong điện thờ | không cột sáng (tôn trọng — phần 12 §1); thay bằng mọi nến trong điện bùng sáng một nhịp |
| đang ngự kiếm | tự hạ kiếm rồi mới bắt đầu |
| đang trong mini-game / hội thoại | hoãn tới khi xong (tối đa 10 phút; quá → hiện ngay khi người chơi mở Sổ Mệnh) |
| đông người (≥ 15 người trong 30 m) | hiệu ứng giữ nguyên với bản thân; người khác thấy bản 50% |
| bản iOS | giữ nguyên (tu tâm, không đoán vận) |

---

## 2. Đại nguyện Liễu Phàm — 300 / 600 / 1.000 công

Tên ba đại nguyện và phần thưởng do tài liệu 05 định; trình bày:

| Mốc | Chữ | Nhạc | Hình | Camera | Câu hệ thống mặc định |
|---|---|---|---|---|---|
| 300 | 願 (một chữ) | `BGM-VOW-01` (tiêu) | giấy vàng từ Sổ Công Quá bay lên thành chữ, tan thành bụi vàng (`fx.rite.vow`) | cận sổ → ngước | «Ba trăm việc thiện. Liễu Phàm cũng bắt đầu từ một việc.» |
| 600 | 願 + nét viền | `BGM-VOW-02` (+ cổ cầm) | như trên + sen nở dưới chân | — | «Sáu trăm. Người quanh bạn đã khác vì bạn.» |
| 1.000 | 願 lớn chiếm nửa trời | `BGM-VOW-03` (+ đàn bầu, chuông) | như trên + Sổ Công Quá trong cảnh tự gấp lại, đặt lên bàn thờ ở Am Vân Cốc (lần sau tới am thấy nó ở đó — P4) | rời người, dừng ở am | «Một nghìn công. Mệnh đã đổi — vì bạn đã đổi.» |

Đại nguyện **không** khoe công khai trên kênh chung (không thông báo toàn máy chủ) — tránh biến công đức thành thành tích khoe (tinh thần canon §5.3).

---

## 3. Nhập môn phái theo đạo thống (UI-65 lần đầu)

| Đạo thống | Nghi thức trình bày | Nơi | Âm | Hình |
|---|---|---|---|---|
| Chính Nhất (Long Hổ) | đứng trước đại đường, nhận **lục** (bản ghi đạo chức hư cấu) bằng hai tay | đại đường Thiên Sư phủ | `SFX-RITE-051` ấn thụ lục; trống một tiếng | khói hương xoắn thành ấn vuông (`fx.rite.thuluc`) |
| Thanh Vi · Đan Đỉnh (Võ Đang) | ngồi tĩnh tọa ba nhịp thở cùng Huyền Hư chân nhân, rồi nhận phất trần | Tử Tiêu cung | tiêu, khánh | biển mây tràn qua sân |
| Toàn Chân (Chung Nam) | đọc «giới» (bản tóm ý hư cấu, không giới văn thật), lạy ba lạy | Trùng Dương cung | khánh, mõ cá | tuyết rơi nhẹ (nếu mùa đông) |
| Thượng Thanh (Mao Sơn) | thắp đèn tồn tư, nhắm mắt «thấy» ánh sáng (màn tối dần → một điểm sáng) | Cửu Tiêu Vạn Phúc cung | sáo trúc, chuông đế chung | — |
| Thiền (Yên Tử) | ngồi trước sư một tiếng chuông, sư hỏi một câu công án | Hoa Yên | chuông chùa Việt | lá tùng rơi |
| Tịnh Độ (Bút Tháp) | quy y: chắp tay, Ni sư trao tràng hạt | chánh điện | chuông gia trì, mõ | đèn sen thắp |
| Nho (Văn Miếu) | lễ nhập học: vái bàn thờ Khổng Tử, nhận bút nghiên | Đại Thành điện (nguyên mẫu) | trống báo, tiểu nhạc | — |
| Mật (Tạng Địa) | **chờ tham vấn** — tạm: nhận khăn trắng (khata) và đi một vòng quanh điện | — | chuông bát | cờ gió |
| Bắc Đế · Động Uyên (Phong Đô) | không «nhập môn» theo nghĩa thường — trình bày là **lời thề cứu người** trước Địa Tạng sứ giả | Thiên Tử điện | khánh trầm | đèn dẫn đường |

**Luật:** lời, giới văn, câu tụng trong các nghi thức này là **tóm ý hư cấu** do tài liệu 05 viết và cố vấn duyệt; không dùng nghi văn có thật. Mỗi nghi thức ≤ 45 s, có nút bỏ qua.

---

## 4. Các khoảnh khắc khác

| Khoảnh khắc | Kích hoạt | Trình bày | Âm / nhạc | Camera | Thời lượng |
|---|---|---|---|---|---|
| Lần đầu ngự kiếm | mở `fly` (cấp 8 hoặc VIP, hoặc bậc 3 sau khi gộp) | kiếm (hoặc ngự vật đang mặc) bay tới chân, nhân vật bước lên, cất lên 18 m (độ cao vào bay tối thiểu hiện có) rồi trả điều khiển | `SFX-FLY-004`, `SFX-FLY-010`; `BGM-SKY` vào | sau lưng → ngang → sau lưng | 6 s |
| Mở gia trì mới | `newlyUnlocked` (đã có toast) | ngoài toast: hiệu ứng mới «nở» quanh người 2 s | `SFX-PROG-003` | không đổi | 2 s |
| Đỗ khoa cử | UI-83 vòng đình thí đạt | bảng vàng dán tường Văn Miếu, tên người chơi viết bằng nét bút (P4), sau đó **khắc lên bia Tiến sĩ mới** cho cả máy chủ thấy (canon §7.8) | trống báo `SFX-MG-031`, đục đá `SFX-MG-033`, đại nhạc | cận bảng → toàn sân bia | 12 s |
| Cửu phẩm liên hoa mở tầng (Bút Tháp) | đủ công đức (canon §7.6) | tháp gỗ 9 tầng quay chậm một vòng, tầng mới sáng ấm (`fx.rite.lotus9`) | gỗ quay, chuông | cận tháp, ngước theo tầng | 8 s |
| Bái sư (UI-67) | sư phụ nhận | đệ tử dâng trà, sư phụ nhận chén | `SFX-SOC-008`, `SFX-MG-070` | hai người ngang | 6 s |
| Kết nghĩa kim lan (UI-68) | hai bên đồng ý | hai người cùng thắp một nén hương | `SFX-SOC-007`, `SFX-RITE-030` | hai người ngang | 6 s |
| Xong Mệnh Đồ 6 tầng | tầng cuối xong | núi sáu bậc sáng từ chân lên (UI-33 biến thể) | chủ đề Vân Cốc đầy đủ | `cam.ascend` bản thấp (6 m) | 9 s |
| Danh hiệu Hồi Đầu | trả xong nợ cuối | sương tím tan, nắng xuống (`fx.rite.hoidau`) | `SFX-KARMA-007`, `BGM-STING-HOIDAU` | từ trên xuống, mở ra trời | 8 s |
| Vào Côn Lôn lần đầu | đủ Quy nhất | `cam.reveal` đặc biệt: cầu mây hiện từ biển mây, mỗi đạo thống đã tu thêm một nhịp cầu | chủ đề Côn Lôn + lớp đạo thống (phần 09 §3.20) | bay từ Huyền Thành lên đảo trời | 14 s |

---

## 5. `cam.reveal` cho 12 thánh địa

Cú máy mở màn khi tới lần đầu (luồng 12, phần 15). Tọa độ tương đối với **tâm vùng** canon §3 (x, z, mét; y là độ cao trên mặt đất). Công trình làm điểm nhấn lấy theo nguyên mẫu ở canon / bản tổng §7; mã công trình `BLD-*` do tài liệu 07 cấp.

| Thánh địa | Tâm (canon) | Bắt đầu (x, y, z tương đối) | Kết thúc | Hướng nhìn kết | Điểm nhấn | Ý cú máy |
|---|---|---|---|---|---|---|
| Long Hổ | 1500, −200 | (−40, 3, 60) thấp sau bè tre trên sông | (−20, 45, 80) | phủ môn và vách đan hà phía sau | biển «嗣漢天師府» | từ mặt sông lên thấy vách đỏ |
| Võ Đang | 0, −1500 | (0, 4, 90) dưới chân Huyền Nhạc môn | (0, 120, 40) | Kim Điện trên đỉnh | bài phường «玄嶽門» → Kim Điện | thần đạo ngàn bậc, đi theo trục dốc |
| Chung Nam | 1400, −1300 | (30, 2, 50) giữa rừng tùng | (10, 35, 70) | Trùng Dương cung trong thung | cổng tùng lâm | rừng mở ra thung lũng |
| Mao Sơn | 1500, 1300 | (−20, 1,5, 40) trong rừng trúc | (0, 40, 60) | Cửu Tiêu Vạn Phúc cung trên đỉnh, đồi chè | đỉnh cung | xuyên qua trúc và sương |
| Yên Tử | −400, 1500 | (0, 2, 120) chân núi, chùa Giải Oan | (0, 160, 20) | Chùa Đồng trên đỉnh, mây vờn | đường tùng | theo đường hành hương lên mây |
| Bút Tháp | 500, 1500 | (−60, 1,2, 30) bờ ruộng, ngang lúa | (−30, 25, 50) | tam quan, gác chuông, tháp Báo Nghiêm | cầu đá | từ đồng quê vào làng chùa |
| Tạng Địa | −1500, −1300 | (0, 3, 150) đèo cờ gió | (0, 60, 90) | điện trên núi (nguyên mẫu Potala — **chờ tham vấn** chi tiết) | cờ lungta | cờ gió rồi trời lớn (tạm) |
| Văn Miếu | 0, 1900 | (0, 1,8, 70) trước hồ Văn | (0, 20, 50) | Khuê Văn Các phản chiếu mặt hồ | «奎文閣» | đối xứng tuyệt đối theo trục |
| Phong Đô | −1500, 0 | (0, 2, 60) bờ sông sương | (0, 15, 40) | Quỷ Môn Quan, cầu Nại Hà | hoa bỉ ngạn | chậm, thấp, không giật (sau thẻ cảnh báo) |
| Miêu Cương | −1400, 1300 | (−50, 2, 40) trên bè gỗ giữa sông xanh | (−20, 30, 60) | trại nhà sàn treo, cầu phong vũ, ruộng bậc thang | cầu phong vũ | sông → trại sống động |
| Côn Lôn | 0, −900, cao 260 | xem §4 «Vào Côn Lôn» | — | Dao Trì «瑤池» | thác xuống biển mây | — |
| Am Vân Cốc | 0, −260 | (10, 2, 25) lối mòn vách đá | (5, 12, 15) | am tranh trên vách | mái tranh | nhỏ, gần, ấm |

**Ràng buộc:** tốc độ góc ≤ 25°/s, không vượt trục, kết ở góc mà nhân vật đứng **trong khung** (camera trả về rig mượt — phần 08 §4.4). Mọi điểm bắt đầu kiểm va chạm với địa hình thật khi vùng dựng xong (tọa độ trên là ý đồ, tài liệu 07 chỉnh theo bố cục thật).
