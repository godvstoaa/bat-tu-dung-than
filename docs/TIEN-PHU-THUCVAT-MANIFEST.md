# TIÊN PHỦ — THỰC VẬT VÀ NỀN ĐẤT (manifest)

Nghiên cứu: [tienphu-nghiencuu/10-thuc-vat.md](tienphu-nghiencuu/10-thuc-vat.md). Lời chê gốc (2026-11-18):
- «Cây cối không phù hợp với không gian rộng … phải có kích thước to lớn như cây cổ thụ, đặc biệt ở 9 công trình;
  thực vật mỗi vùng cả địa hình sinh trưởng phải phù hợp với kiến trúc, không giống nhau.»
- «Các mẫu sẵn trong Meshy rất nhiều và đẹp … tự kiểm nghiệm rồi dùng luôn; đừng làm giảm độ chi tiết điểm ảnh mà làm vỡ công trình;
  tìm cách vẫn đẹp và mượt.»

## 1. Hiện trạng (trước)
- Cây cao 4–10 m: model bonsai / đào / liễu kéo giãn (`flora.js`). Không có cây cổ thụ.
- 9 phủ chỉ khác danh sách loài, nhưng cùng 3 model nên trông giống nhau.
- Một thảm cỏ cùng màu cho mọi phủ.
- Rải ngẫu nhiên cách nhau 4,2 m: dày như vườn ươm, không có vùng trống theo nghi lễ.

## 2. Học được từ nghiên cứu
- Cây to phải là **loài vốn to**, lấy 75–100 % chiều cao thật tối đa. Không phóng to bách cổ 8–12 m thành 30 m.
- Sân chầu, sân lát quanh điện và chùa, trục nghi lễ: **0 cây**.
- Mỗi phủ có «chữ ký» riêng (nghiên cứu §0.2), tỉ lệ cây / nhà theo phong cách (§11.1):
  - Tây Tạng ≤ 0,2;
  - Art Deco 1,5–2,5.
- Lhasa thấp và mập (3.650 m). Hàng bách Taj cách 3,5 m. Me Sanam Luang hàng đôi cách 4 m. Versailles: tường trăn 6–8 m, thuỷ tùng chóp nón.

## 3. Nguồn hình: model Meshy cộng đồng (CC0) + thủ tục khi Meshy không có
- Mỗi loài 1–2 model chọn bằng mắt trên meshy.ai (bảng ảnh tìm kiếm), giấy phép CC0 ghi trên trang model.
- Danh sách ở §8.
- Không có model đúng loài thì dùng cây thủ tục `src/game/tienphu/oldtree.js` (space colonization), đã kiểm bằng ảnh `output/cay-look/`:
  - Ashoka (*Polyalthia*);
  - tường trăn xén.
- Cấp chi tiết **không làm vỡ hình**:

  | Cấp | Khoảng cách | Kiểu | Tam giác | Ghi chú |
  |---|---|---|---|---|
  | near | ≤ 45 m | lưới giữ UV + texture 1024 | ~50k | đổ bóng |
  | mid | 45–140 m | `.vc` màu đỉnh, hàn đỉnh | ~12k | không kéo sọc texture (meshy-vclod) |
  | far | 140–330 m | `.vc2` màu đỉnh | ~1,6k | sương che phần còn lại |

  - Công trình **không** bị hạ chi tiết hay độ phân giải để bù cho cây.
- Gió: lắc theo độ cao trong shader. Mỗi cây lệch:
  - tông ±8 %;
  - cao ±15 % (cây hàng ±5 %);
  - xoay ngẫu nhiên.

## 4. Quy tắc trồng theo phủ (số đo — nghiên cứu §11.2)

| Phủ | Điểm nhấn (cao) | Nền / hàng (cao) | Khoảng cách | Vùng 0 cây | Nền đất |
|---|---|---|---|---|---|
| trunghoa | bạch quả 28–32 m ×4 (2 cặp), hoè 18–20 m ×6–8 | bách vặn 10–14 m, thông 12–15 m | vườn 6–8 m | trục chính, sân trước điện chính | gạch xám `#9a958c`, đất xám-lục `#8a8a68` |
| nhatban | long não 25–30 m ×5–8 (rìa) | thông đen 8–14 m, anh đào 9–12 m (khối) | anh đào 8 m, thông 10–15 m | sân sỏi trước điện, mặt tường đá | rêu `#6f8448`, sỏi trắng |
| taytang | liễu xoắn 12–15 m ×10–15 (lingka) | dương 18–22 m (hàng kênh), bách xù 8–12 m | dương 5 m, liễu 10 m | đồi đá dưới cung, quảng trường | cỏ úa `#a39a66`, đá granite |
| gothic | sồi 24–28 m ×6–10 lẻ | tần bì 25–30 m (rừng biên) | lẻ ≥ 25 m | vành 30 m quanh tường / hào | cỏ ẩm `#6c9346` |
| artdeco | dẻ gai / đoạn 25–30 m (khối viền) | bạch dương 16–20 m (nhóm) | khối 7 m | trục hồ gương ±20 m | cỏ xén `#6fa04a` |
| tancodien | dẻ ngựa 26–30 m (hàng đại lộ) | đoạn 20–25 m (bosquet), thuỷ tùng xén 4–6 m, cam thùng 3 m | hàng 7 m, thuỷ tùng 10 m | parterre (chỉ thuỷ tùng) | cát vàng `#cdbb8c` + cỏ xén |
| hue | thông nhựa 25–28 m (rừng rìa), đa / bàng 18–22 m ×4 (cặp) | đại 7–9 m, long não | cặp 12–20 m, rừng 7 m | sân Đại Triều Nghi, trục Ngọ Môn | cỏ `#7f9c50`, gạch đỏ |
| thai | cây mưa 20–24 m tán 30 m ×3–5, bồ đề 22 m ×1–2 | me 18–20 m hàng đôi, đại 6–7 m, dừa | me 4 m (hàng), cây mưa ≥ 30 m | sân chùa, quanh ubosot / chedi | cỏ xén `#7aa64c`, đá xám |
| mughal | xoài 18–22 m (trong ô), Ashoka 18–22 m (hàng tường) | bách cột 10–14 m hàng kênh | bách 3,5 m, xoài 11 m | trục kênh, bệ lăng | cỏ trũng `#86a85a`, sa thạch đỏ |

- **Quy tắc chung:**
  - Thân cách tường bao ≥ 4 m.
  - Thân cách mép nhà ≥ 0,7 × bán kính tán.
  - Thân cách lối đi ≥ 1,5 m.
  - Cây hàng trồng đúng nhịp, không lệch.
  - Cây rừng rải Poisson với khoảng cách tối thiểu = 0,6 × (Rₐ + R_b).
- **Lệch nghiên cứu có chủ ý (ghi lý do):**
  - Nghiên cứu muốn cây không vượt mái điện chính ở Trung Hoa, Huế, Nhật (tỉ lệ 0,5–0,8).
  - Người dùng yêu cầu cổ thụ to xứng không gian 520 m, nên giữ loài to ở 75–100 % chiều cao thật (bạch quả 32 m, long não 29 m, thông nhựa 28 m).
  - Đổi lại, cây to chỉ đứng ở vườn, rìa, rừng nền. Trục nghi lễ và sân chầu trống; cặp cây sát điện dùng loài thấp hơn (hoè, đại).
  - `scripts/check-flora.mjs` in tỉ lệ để theo dõi.
- **Số cây mỗi phủ:** 150–600 cây lớn (nghiên cứu đề 400–1.500, nhưng gồm cả cây bụi). Cây bụi và hoa vẫn do lớp hoa / bụi hiện có lo.

## 5. Ngân sách hiệu năng
- Tầm nhìn tại cổng mỗi phủ:
  - near ≤ 25 cây (~1,25 tr tam giác, có bóng);
  - mid ≤ 120 cây (~1,4 tr);
  - far ≤ 400 cây (~0,65 tr).
- **fps** (đo `shot-tienphu-eye` / perf như các lần trước): không thấp hơn mức hiện tại quá 10 %.
  Mức hiện tại: Trung Hoa 39,5, Tân cổ điển 40, Mughal 37.
- Tải: mỗi loài ≤ 6 MB cho cả 3 cấp. Tải theo phủ đang dựng, không tải sẵn cả 28 loài.

## 6. Checklist kiểm
- [x] Script `check-flora.mjs`: chiều cao mỗi cây trong khoảng loài; 0 cây trong sân cấm; 0 thân trong nhà / lối / nước — 9/9 sạch.
- [x] Script `test-tienphu.mjs` 19/19 (mốc «≥ 500 cây» đổi thành «≥ 150 cổ thụ» theo §4); `check-siteplans` 9/9.
- [x] Va chạm: trụ thân ẩn theo bán kính thân thật của loài (`bigProxy`), cây xén / chậu chặn cả khối. *Chưa đo lại tỉ lệ đi xuyên bằng probe.*
- [x] Mắt: từng loài 3 cấp `output/cay-look/m-big.png`; ảnh xa `public/models/lib_tp_*.imp.png`.
- [x] Mắt: trên cao trước / sau `output/tienphu-thucvat/m-truoc-sau-aerial.png`, `m-truoc-sau-aerial2.png`; chéo cao 9 phủ `m-after-a.png`, `m-after-b.png`; tầm mắt `m-after2.png`, `m-after3.png`, `m-after5.png`.
- [x] Số: fps (§9).

## 9. Kết quả đo (2026-11-18)
- **fps** (đứng sân trong, 10 giờ, trung vị 5 × 2 s; dao động ±5 giữa các lần chạy):

  | Phủ | Cây cũ | Cây mới | Tắt hẳn cây |
  |---|---|---|---|
  | Versailles (885 cổ thụ) | 40 | 40,5 | 42,5 |
  | Trung Hoa | 39,5 | 38 | 47 |
  | Taj | 37 | 35,5 | 54,5 |
  | Huế | — | 45 | 46 |

  Lệch ≤ 4 %, trong ngưỡng §5.
- **Cấp chi tiết thật dùng:**
  - near ≤ 45 m: model Meshy có texture, 16k (bách, cây xén, chậu), 22–27k (bách xù, dừa), ~50k (cây lá rộng), 75k (dẻ gai, đoạn). Chỉ cấp này đổ bóng.
  - mid 45–110 m: màu đỉnh 6–12k.
  - far 110–330 m: **ảnh chụp sẵn 3 ô** (trước / bên / trên), 6 tam giác mỗi cây.
  - Bản giản lược 1,6k làm vỡ dẻ ngựa và đoạn nên đã bỏ.
- **Đổi so với kế hoạch** (thấy khi xem ảnh):
  - dẻ ngựa dùng model dẻ gai, vì lá dải mỏng rụng khi giản lược;
  - long não dùng model sồi, vì model gốc trông như bao báp;
  - thông nhựa dùng bản thủ tục;
  - Huế giảm mật độ rừng (hệ số 0,55 → 0,33) vì sân trong thành bị lấp;
  - cấp xa giữ pháp tuyến hướng trời (mặt sau tấm từng đen).
- **Ngân sách tải:** 24 model × 3 bản + ảnh xa ≈ 36 MB trong `public/models`. Chỉ tải loài của phủ đang dựng.

## 7. Goal tiếp theo
- **G1:** ≥ 3 biến thể mỗi loài. Hiện mỗi loài 1–2 model Meshy; thêm model hoặc sinh biến thể thủ tục.
  Đo: mỗi loài ≥ 3 lưới khác nhau.
- **G2:** địa hình nhỏ theo phủ. Đo bằng ảnh trên cao:
  - đồi đá Marpo Ri dưới cung Tây Tạng;
  - gò đất có rễ nổi quanh đa Huế;
  - bồn xây quanh cổ thụ Huế / Thái.
- **G3:** ảnh xa (impostor) bake từ bản near, để thay `.vc2` nếu `.vc2` nhìn thô ở 150–330 m.

## 8. Model Meshy đã dùng (CC0)
- **Giấy phép:** bài đăng cộng đồng meshy.ai ghi «Models: CC0 — anyone can use, share, and remix them freely, no credit needed».
  Trang model hiển thị nhãn CC0. Tải 2026-11-18, tài khoản maz.elements3.
- **Lưu file:** gốc ở `assets-meshy/library/tp_<khoá>.glb` (không lên git). Bản dùng: `public/models/lib_tp_<khoá>.{near,vc,vc2}.glb`,
  do `scripts/meshy-pack-trees.mjs` sinh. 24 model, tổng 34 MB cho cả 3 cấp.
- **Chọn bằng mắt:** từ bảng ảnh tìm kiếm (mỗi loài 10 kết quả đầu); nhận dạng file tải bằng ảnh render `scripts/glb-thumbs.mjs`.

| Khoá | Tên model Meshy (tên file) | Mặt gốc → near | Dùng cho loài |
|---|---|---|---|
| soi | Oak Tree (demonsurgery) | 1.797.730 → 47k | sồi (Gothic) |
| tanbi | (ash tree, cỏ ở gốc) | 6.216.493 → 48k | tần bì |
| degai | (beech tree) | 1.682.725 → 75k | dẻ gai (Art Deco) |
| doan | (linden tree) | 97.940 → 78k | đoạn |
| (bỏ) | Verdant Majesty | 411.852 → 180k (lá dải mỏng rụng khi giản lược < 180k) | — dẻ ngựa dùng model dẻ gai (**thay thế dáng**) |
| topiary | (tall cypress topiary, đế đĩa — cắt đế) | 291.766 → 59k | thuỷ tùng xén chóp |
| camchau | Green Globe Topiary in pot | 79.487 → 60k | cam trong thùng (giữ chậu) |
| bachy | (italian cypress) | 437.413 → 50k | bách Ý hàng kênh (Mughal) |
| buxu | (juniper tree) | 83.618 → 50k | bách xù Tây Tạng; **dùng chung** cho trắc bách Trung Hoa |
| lieutang | (old willow, thân đỏ vặn) | 23.444 → 23k | liễu cổ Lhasa |
| duonglhasa | Tall Columnar Tree | 1.110.482 → 50k | dương Lhasa |
| sakura | (cherry blossom tree) | 1.430.514 → 50k | anh đào |
| kuromatsu | bonsai pine leafy | 1.795.820 → 49k | thông đen Nhật |
| keyaki | Young Oak Tree | 687.542 → 50k | zelkova; **cùng file** với `bachqua` |
| bachqua | Young Oak Tree | 687.542 → 50k | bạch quả — **thay thế dáng** (Meshy không có bạch quả xanh đẹp) |
| (bỏ) | a tree (thân cổ thụ to) | 352.221 → 50k | xem trong game giống cây bao báp giữa vườn Nhật → long não dùng model sồi (**thay thế dáng**) |
| thongcn | (umbrella pine on mound — cắt gò) | 854.408 → 48k | thông Bắc Kinh |
| hoe | Emerald Canopy Tree | 1.252.230 → 49k | hoè; **dùng chung** cho me (Thái) |
| da | Sacred Banyan Tree | 7.731.778 → 49k | đa (Huế); **dùng chung** cho bồ đề (Thái) |
| dai | Blooming Frangipani Tree | 30.552 → 31k | đại / sứ |
| muamy | Emerald Canopy | 1.675.108 → 50k | cây mưa (co ngang theo tán 1,45 × cao) |
| dua | coconut palm tree | 191.025 → 50k | dừa |
| xoai | (broadleaf sẫm, tải lượt 1 không rõ bài) | 1.560.019 → 50k | xoài — **thay thế dáng** |
| — | thủ tục `oldtree.js` | — | Ashoka (Mughal), thuỷ tùng cổ (Gothic), thông nhựa (Huế: Meshy chỉ có cây que tán bé) |
- **Loại bỏ sau khi xem:** cây «Enchanted Forest Relic» (có mặt người, fantasy); cây Roblox treo quả vàng (fantasy).
