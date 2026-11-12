# TƯỜNG THÀNH NGOẠI THÀNH — MANIFEST (2026-11-12)

Người dùng gửi ảnh cổng thành và nhận xét: «cổng thành kiểu gì thế này… làm cái tường thành đàng hoàng tử tế».
Ảnh cho thấy hai khối hộp gạch đen cao 34 m đứng hai bên một khe trống.

## 0. Hiện trạng và nguyên nhân (đo trên bản dev)

1. **Cổng biến mất khi đứng gần.** Lỗi trong `assets.placeLod`:
   - Nhánh «không có bản rút gọn → thêm bản gốc ở bậc 0» bị gắn nhầm vào điều kiện `cullDist` vô hạn (áp cho mọi vật rộng ≥ 40 m).
   - Hậu quả: cùng một khối `.vc` vào LOD hai lần, ở 0 m và 150 m. three.js bật nó ở bậc 0 rồi tắt ở bậc 150, nên trong vòng 150 m công trình không hiện.
   - Bản gốc chi tiết không bao giờ được nạp.
   - Có từ commit 30825afc (11/11). Ảnh hưởng mọi công trình lớn: 8 cổng thành, sảnh nghề, đền.
   - Đã sửa, đo lại: cổng Nam hiện đủ ở 75 m (`shots/wall/fix/01-in-nam.png`).
2. **Thân tường thô** (`cityblocks3d.outerWall`, A = 2.125 m, cao 34 m):
   - Hộp đứng thẳng dày 6 m.
   - Vân đá phóng to nên trông như ngói đen.
   - Lỗ châu mai 1,6 m (thấy như răng cưa nhỏ trên tường 34 m).
   - Không có chân tường, gờ, tường chắn phía trong, mã diện có lầu, cờ.
   - Màu tường đen không khớp cổng đá xám.

## 1. Nghiên cứu (nguồn)

- **Tường thành Tây An, nhà Minh** ([Wikipedia: Fortifications of Xi'an](https://en.wikipedia.org/wiki/Fortifications_of_Xi%27an), [Shaanxi gov](https://en.shaanxi.gov.cn/tourism/aic/xa_2120/201712/t20171210_1595308.html)):
  - Cao 12 m, mặt trên rộng 12–14 m, chân 15–18 m: **thành dốc (batter)**, chân rộng hơn đỉnh khoảng 1,3 lần.
  - **Mã diện nhô ra mỗi 120 m** (98 cái), mỗi cái có **lầu canh**, đỉnh ngang mặt tường.
  - Khoảng cách giữa hai mã diện vừa tầm cung bắn.
  - **5.984 lỗ châu mai** ở tường chắn phía ngoài.
  - Tháp canh ở 4 góc. Gạch xanh (thanh chuyên) ốp mặt ngoài và mặt trên.
- **Kiến thức chung về thành Trung Hoa / Việt (Bắc Kinh, Huế):**
  - Phía ngoài là tường chắn có răng cưa (đóa khẩu), phía trong là nữ tường thấp.
  - Chân tường kè đá sáng màu, thân gạch xám, có gờ (diềm) dưới tường chắn.
  - Cờ hiệu dọc mặt thành.

## 2. Quy tắc (số đo)

Thành game cao 34 m (gần 2,8 lần Tây An) nên giữ chiều cao. Đường Nội Tường bắt đầu ở A − 7, nên mặt trong tường không được vào sâu quá A − 4,5.

- **Mặt cắt** (u = 0 ở trục tường, + ra ngoài):
  - Mặt trong gần đứng: từ u = −4,2 (chân) đến −3,5 (đỉnh).
  - Mặt ngoài dốc: từ u = +9 (chân) đến +3,5 (đỉnh), dốc khoảng 9°.
  - **Mặt đi trên đỉnh rộng 7 m.**
- **Chân tường:** kè đá sáng cao 3 m, nhô thêm 0,4 m.
- **Diềm:** gờ ngói sẫm 0,6 m dưới tường chắn.
- **Tường chắn ngoài:** liền, cao 1,4 m, dày 0,8 m. Trên đó là **răng cưa cao 1,3 m, rộng 2,0 m, khe 1,1 m** (nhịp 3,1 m).
- **Nữ tường phía trong:** cao 1,1 m.
- **Vật liệu:** gạch xanh xám `#8b867c`, vân gạch theo mét (ô 4 m, 16 hàng gạch). Màu khớp cổng đá xám.
- **Mã diện:**
  - Cách nhau khoảng 170 m (tỉ lệ 120 m × 1,4), nhô 16 m, rộng 24 m, cao bằng tường.
  - Răng cưa 3 phía.
  - **Lầu canh trên mọi mã diện:** thân son 10 × 7 m, cao 4,5 m, mái chóp ngói.
- **Tháp góc** (8 đỉnh bát giác): đế bát giác dốc bán kính 16 m, hai tầng lầu son với hai mái.
- **Cờ:** cờ đuôi nheo màu theo hành của cung, mỗi 30 m dọc tường chắn ngoài.
- **Thủy môn:** giữ nguyên chỗ sông xuyên tường; thân tường trên nước treo từ y = 1.
- **Va chạm:**
  - Thân tường chặn theo đúng bề dày mới.
  - Mặt đi trên đỉnh đứng được (giữ cách cũ: đỉnh = H + WH − 1,5).
  - Mã diện chặn và đứng được trên đỉnh.
- **Hiệu năng:**
  - Toàn bộ tường, mã diện, tháp, lầu gộp theo vật liệu: ≤ 10 lệnh vẽ, ≤ 300k tam giác cho cả vòng 14 km.
  - Cờ: 2 lệnh vẽ (nhân bản).

## 3. Checklist (kết quả 2026-11-12)

- [x] Ảnh trước / sau:
  - `shots/wall/before/` (khe trống, chỉ hai đầu tường đen) → `shots/wall/after/01-in-nam` (cổng hiện đủ, tường gạch xám, cờ).
  - `after/02-out-nam` (mặt ngoài: răng cưa, chân kè, cờ), `after2/01-wall-out-side` (thân dốc, mã diện có lầu canh).
  - `after2/02-aerial`, `after2/04-top` (vân gạch đúng tỉ lệ mét).
- [x] Tường mới: 9 lệnh vẽ, 136k tam giác cả vòng (thân 24k, răng cưa 69k nhân bản, diềm 16k, chân kè 9k, cờ 10k, lầu 2k).
- [x] A/B fps cùng chỗ (300, 2060): bản cũ 32 / 50 fps, 585 lệnh vẽ; bản mới 30 / 48 fps, 594 lệnh vẽ. Chênh −6 %, đạt mức ≤ 10 %.
- [x] Va chạm lấy mẫu ngang tường:
  - Mặt trong chặn từ u = −4,6. Mặt đi trên đỉnh cao 32,5 m.
  - Dải mặt dốc có bậc 21,3 m và 4,2 m. Ngoài chân tường (u ≥ 9,6) đi tự do.
- [x] Toàn bộ `test-game-*` xanh, build web xanh.
- [ ] Deploy, kiểm live.

## 4. Goal tiếp

- **G-7.1 Ủng thành (thành vòng ngoài cổng):** sân bao trước 8 cổng chính kiểu Tây An (tiễn lâu ngoài, chính lâu trong).
- **G-7.2 Hào thành:** hào nước rộng 18 m quanh tường, có cầu vào cổng.
