# 01 · Phần 12 — Kinh thánh mỹ thuật (1/2): phong cách, ánh sáng theo giờ can chi × vùng, màu, vật liệu

> Chuẩn mỹ thuật môi trường. Phần 13 là nhân vật, hiệu ứng, giao diện. Mọi giá trị số dưới đây là **đích ban đầu** để đội ánh sáng bắt đầu; điều chỉnh được nhưng phải ghi lại trong `docs/art/` (bản sơ đồ §8.5).
>
> Gốc code: `render3d.js › KEYS` (8 mốc nội suy tuyến tính, ACES Filmic, exposure 1,05, sương `Fog` 260–1.900 m), `textures.js › PAL` (bảng «Sơn Mài»), `lights.js` (đèn điểm động), `effects.js` (gia trì).

## 1. Phong cách tổng

### 1.1 Một câu

**«Sơn mài dưới nắng thật»**: hình khối và tỷ lệ tả thực (người chơi tin vào chiều cao bậc thang, độ dày tường), bề mặt giản lược theo lối sơn mài và tranh lụa (ít chi tiết vụn, mảng màu rõ, viền vàng có chủ đích), ánh sáng tả thực theo giờ can chi.

### 1.2 Năm nguyên tắc

| # | Nguyên tắc | Nghĩa | Kiểm bằng |
|---|---|---|---|
| M1 | **Đọc được** | ở 30 m, người chơi nhận ra cửa vào, lối đi, NPC chính | ảnh thu nhỏ 25 % vẫn thấy cửa |
| M2 | **Đúng chỗ** | mỗi vùng một bảng màu khóa, một bộ mái khóa (T4) | palette checker §6 |
| M3 | **Ánh sáng có nguồn** | mọi vùng sáng ban đêm có vật phát sáng nhìn thấy được (đèn, nến, cửa sổ, trăng) | ảnh đêm |
| M4 | **Tĩnh trong bố cục** | đường chân trời ngang, khoảng trống, ít vật lơ lửng; chuyển động chậm (mây, khói, lá) | quay 10 s ở điểm ngắm |
| M5 | **Vật liệu thật, chi tiết vừa** | gỗ ra gỗ, đá ra đá; không bóng nhựa; chi tiết dồn vào chỗ mắt dừng (cửa, bàn thờ, tay vịn) | kiểm roughness §7 |

### 1.3 Tham chiếu bằng lời (không dùng ảnh có bản quyền trong tài liệu)

| Tham chiếu | Ta lấy gì | Ta không lấy |
|---|---|---|
| tranh sơn mài Việt (sắc son, then, vàng, vỏ trứng) | bảng màu nền `PAL`: then `#120d10`, son `#9e1b14`, vàng `#d9a441`, vỏ trứng `#efe6d2`, lam ngọc `#1d4b57` | độ phẳng tuyệt đối (ta cần chiều sâu 3D) |
| tranh lụa Bắc Bộ, tranh thủy mặc | sương nhiều lớp, núi xa nhạt dần, khoảng trắng | nét viền đen quanh vật thể |
| ảnh tư liệu chùa Bút Tháp, Tây Phương, Yên Tử, Văn Miếu (bảo tàng, hồ sơ di sản) | tỷ lệ, chi tiết chạm, màu gỗ lim đã lên nước | hiện trạng du lịch (biển hiệu, cáp treo) |
| ảnh tư liệu Võ Đang, Long Hổ, Bạch Vân Quán, Mao Sơn | kiểu mái, màu tường, linh vật | đám đông, xây mới bê tông |
| phim cổ trang có thiết kế mỹ thuật tốt | ánh nến trong điện, khói hương xuyên tia sáng | màu bão hòa quá, khói «sân khấu» |
| game thế giới mở hiện đại (phần 15) | sương nhiều tầng, tia sáng xuyên mây, hệ ngày đêm | hiệu ứng phép thuật chói, giao diện dày |

### 1.4 Quy trình dựng (Meshy + thủ tục)

| Loại tài sản | Cách dựng | Ngân sách đa giác (gợi ý) | Ghi chú |
|---|---|---|---|
| Vỏ công trình hạng A | Meshy (HD) theo prompt khóa vùng §1.5 → kiểm lát cắt → khoét cửa | 80–300 nghìn (bản xa: 20–40 nghìn) | bản sơ đồ §8.2: shell / interior / props |
| Vỏ công trình hạng B–C | Meshy thường hoặc lắp mô-đun | 20–80 nghìn | nhân bản có LOD (`instanceModelLod`) |
| Nội thất | bộ mô-đun 3,2 m × 3,2 m theo đạo thống | 5–15 nghìn / gian | bản sơ đồ §8.3 |
| Tượng thờ | Meshy text-to-3D: «tượng gỗ sơn son thếp vàng, ngồi trên đài sen đá, không chữ» (V2 §4) | 80–100 nghìn | không chữ trên tượng; cố vấn duyệt dáng tay (ấn) |
| Nền đất, đá, gỗ | texture thủ tục canvas (`textures.js`): `stoneTex`, `lacquerTex`… | — | có hạt giống: giống nhau mỗi lần tải |
| Cây, đèn, đá cảnh | nhân bản LOD | 1–5 nghìn | — |
| Cảnh nền (núi xa, đảo trời) | thủ tục + mô hình thấp | — | vùng nền, không đường dẫn (phần 2 §5.2) |

### 1.5 Khuôn prompt Meshy khóa vùng

```
[<loại công trình>], <nguyên mẫu> architectural style, <kiểu mái> roof with <màu ngói> tiles,
<màu tường> walls, <vật liệu cột>, <linh vật> ornaments, front door opening clearly visible and open,
realistic proportions, lacquer-painted wood, no text, no signage, no people, no modern elements,
palette: <5 mã màu khóa>
```

Ví dụ (Võ Đang, Tử Tiêu cung): `[main hall], Ming dynasty Wudang Daoist palace style, double-eave hip-and-gable roof with green glazed tiles edged gold, vermilion high walls, red lacquered columns on stone bases, Xuanwu turtle-snake ornaments, front door opening clearly visible and open, realistic proportions, lacquer-painted wood, no text, no signage, no people, no modern elements, palette: #A3271B #2F7A55 #C9A23A #8D8A84 #E9EEF2`.

Luật: prompt không chứa tên tượng thần cụ thể khi dựng vỏ; tượng dựng riêng và duyệt riêng.

## 2. Ánh sáng theo giờ can chi — 24 khóa toàn cục

### 2.1 Nguyên tắc

- Một **thời thần** (2 giờ) chia **sơ** (初, giờ đầu) và **chính** (正, giờ sau) → **24 khóa**, thay cho 8 mốc hiện có (`KEYS`). Giữ cơ chế nội suy tuyến tính.
- Ban đêm **không đen kịt** (giữ quyết định trong code: «người chơi chủ yếu chơi buổi tối»): trời lam thẫm có trăng, đèn là nguồn ấm.
- Cột «Đèn» là hệ số cho đèn lồng / đèn điểm (`lights.js`); 0 = tắt, 1 = sáng đủ.
- Cột «Mặt trời / trăng» là màu và cường độ của đèn định hướng chính.

### 2.2 Bảng 24 khóa

| Khóa | Giờ đồng hồ | Trời trên | Trời giữa | Trời dưới | Sương | Mặt trời / trăng | Hemi | Đêm | Đèn | Cảm giác |
|---|---|---|---|---|---|---|---|---|---|---|
| Tý sơ | 23:00 | `#0c1330` | `#232c5a` | `#151a36` | `#1e2646` | `#a9bcff` · 1,10 | 1,0 | 1,0 | 1,0 | khuya, trăng |
| Tý chính | 00:00 | `#0b112c` | `#202853` | `#141833` | `#1c2442` | `#a9bcff` · 1,05 | 1,0 | 1,0 | 0,8 | tĩnh nhất; đèn phố tắt bớt |
| Sửu sơ | 01:00 | `#0b112c` | `#1f2750` | `#131732` | `#1b2340` | `#a3b5f5` · 1,00 | 1,0 | 1,0 | 0,7 | ngủ |
| Sửu chính | 02:00 | `#0c122e` | `#212a55` | `#141834` | `#1d2544` | `#a3b5f5` · 1,00 | 1,0 | 1,0 | 0,7 | sương bắt đầu bò dưới thung |
| Dần sơ | 03:00 | `#10173a` | `#2b3263` | `#191d3b` | `#232a4b` | `#a9bcff` · 1,05 | 1,0 | 1,0 | 0,75 | đạo sĩ dậy; bếp trai đường đỏ lửa |
| Dần chính | 04:00 | `#131b3e` | `#353a6b` | `#1d203e` | `#282e50` | `#adbfff` · 1,10 | 1,0 | 1,0 | 0,85 | tụng sớm; đèn điện sáng lại |
| Mão sơ | 05:00 | `#2c3870` | `#9a6f86` | `#5a4a6a` | `#6c6680` | `#ffb894` · 0,6 | 0,8 | 0,7 | 0,9 | rạng đông tím hồng |
| Mão chính | 06:00 | `#4b5d9a` | `#f0a36b` | `#a9768a` | `#c08f86` | `#ffb27a` · 1,30 | 0,7 | 0,35 | 0,4 | **chuông sớm**; tia nắng đầu |
| Thìn sơ | 07:00 | `#5f86bd` | `#f2c99a` | `#c4a894` | `#d2b8a0` | `#ffd9a8` · 2,0 | 0,9 | 0,05 | 0 | sương tan dần |
| Thìn chính | 08:00 | `#6e9cc9` | `#efdcb4` | `#cdbda2` | `#d8cbb0` | `#fff0d2` · 2,6 | 1,0 | 0 | 0 | sáng trong |
| Tỵ sơ | 09:00 | `#6aa0d0` | `#eadfc0` | `#cfc3aa` | `#d6ccb6` | `#fff3dc` · 2,8 | 1,0 | 0 | 0 | đông khách |
| Tỵ chính | 10:00 | `#67a3d6` | `#e6e0c8` | `#d0c7b2` | `#d4cdbb` | `#fff6e6` · 3,0 | 1,0 | 0 | 0 | nắng lên |
| Ngọ sơ | 11:00 | `#63a5da` | `#e3e1cf` | `#d1cab8` | `#d2cec0` | `#fffaf0` · 3,2 | 1,05 | 0 | 0 | gắt, bóng ngắn |
| Ngọ chính | 12:00 | `#62a6dc` | `#e2e2d2` | `#d2cbba` | `#d1cfc3` | `#fffaf2` · 3,2 | 1,05 | 0 | 0 | đứng bóng |
| Mùi sơ | 13:00 | `#66a2d4` | `#e8dfc6` | `#d3c6ac` | `#d6cbb3` | `#fff3dd` · 3,0 | 1,0 | 0 | 0 | trưa muộn, ve |
| Mùi chính | 14:00 | `#6a9ecd` | `#ecdcbc` | `#d2c2a4` | `#d8c9ad` | `#ffeccc` · 2,8 | 1,0 | 0 | 0 | sân vắng |
| Thân sơ | 15:00 | `#6c96c2` | `#f0d5a8` | `#cfb894` | `#d8c4a2` | `#ffe2b0` · 2,5 | 0,95 | 0 | 0 | vàng chiều |
| Thân chính | 16:00 | `#6a8cb8` | `#f2c890` | `#c9a988` | `#d4b795` | `#ffd394` · 2,2 | 0,9 | 0 | 0 | bóng dài |
| Dậu sơ | 17:00 | `#56689e` | `#f2a660` | `#a9767a` | `#c28d78` | `#ffb070` · 1,7 | 0,75 | 0,15 | 0,3 | **trống chiều**; đèn bắt đầu thắp |
| Dậu chính | 18:00 | `#3b3a72` | `#f08a4b` | `#8e5a6c` | `#b4766c` | `#ff9a5a` · 1,4 | 0,65 | 0,4 | 0,8 | hoàng hôn |
| Tuất sơ | 19:00 | `#1e2350` | `#4a3f72` | `#2a2445` | `#33304f` | `#a9bcff` · 1,10 | 0,9 | 0,85 | 1,0 | chạng vạng xanh |
| Tuất chính | 20:00 | `#121a3a` | `#33386a` | `#1c1f3c` | `#262c4e` | `#a9bcff` · 1,15 | 1,0 | 1,0 | 1,0 | **cửa điện đóng**; cửa ngách mở |
| Hợi sơ | 21:00 | `#10183a` | `#2e3565` | `#1a1d3a` | `#242b4c` | `#a9bcff` · 1,15 | 1,0 | 1,0 | 1,0 | phố lên đèn đủ |
| Hợi chính | 22:00 | `#0e1634` | `#2a3260` | `#181c38` | `#222a4a` | `#a9bcff` · 1,15 | 1,0 | 1,0 | 0,95 | đèn nhà tắt dần |

*(Các mốc 08:00, 18:00, 20:00, 06:00 trùng giá trị đang có trong `KEYS` để không làm vỡ cảnh đã duyệt.)*

### 2.3 Hiệu chỉnh theo hành của ngày (can chi ngày)

Hành của **can ngày** (lịch ngày đã có) pha **rất nhẹ** vào sương và trời giữa. Người chơi tinh ý thấy, người chơi thường không thấy khó chịu.

| Hành ngày | Pha vào sương | Pha vào trời giữa | Mật độ sương | Ghi chú |
|---|---|---|---|---|
| Mộc | `#7fae7a` 3 % | 2 % | × 1,00 | cây lá bóng hơn (roughness lá −0,05) |
| Hỏa | `#e58a5a` 3 % | 3 % | × 0,92 | nắng hơi gắt |
| Thổ | `#c9a96a` 3 % | 2 % | × 1,05 | bụi vàng nhẹ trong tia nắng |
| Kim | `#e6e2d6` 3 % | 2 % | × 0,95 | trời trong, xa thấy rõ |
| Thủy | `#6f8fb5` 3 % | 3 % | × 1,10 | sương nặng hơn một bậc |

### 2.4 Hiệu chỉnh theo tiết khí (mùa)

| Nhóm tiết khí | Dời giờ bình minh / hoàng hôn | Nhiệt màu nắng | Thời tiết thêm |
|---|---|---|---|
| Lập xuân → Cốc vũ | ±0 | trung tính | mưa phùn 25 % số ngày (miền Bắc Huyền Giới) |
| Lập hạ → Đại thử | bình minh −30 phút, hoàng hôn +30 phút | ấm +3 % | mưa rào chiều 30 %; sen nở |
| Lập thu → Sương giáng | bình minh +10, hoàng hôn −10 | vàng hơn | sương sớm dày từ Bạch lộ |
| Lập đông → Đại hàn | bình minh +35, hoàng hôn −35 | lạnh −4 % | tuyết vùng núi cao (Chung Nam, Tạng Địa, Võ Đang đỉnh) |

### 2.5 Thời tiết (luật chung)

| Loại | Điều kiện | Ảnh hưởng ánh sáng |
|---|---|---|
| Quang | mặc định | theo khóa |
| Mây | 30–40 % ngày | nắng × 0,7, bóng mềm |
| Mưa phùn | xuân, vùng thấp | nắng × 0,5, sương × 1,3, mặt đá bóng (roughness −0,25) |
| Mưa rào | chiều hè | nắng × 0,4, sương × 1,6, kéo dài 20–40 phút game |
| Sương mù | sáng sớm thu, Mao Sơn | sương × 2,0 trong 2 giờ đầu ngày |
| Tuyết | đông, độ cao > 300 m | trời trên trắng xám, hemi + 0,1, mặt đất phản sáng |
| Gió | Hồi III, đèo cao | không đổi sáng; cây, cờ, khói nghiêng |

Không có thiên tai phá nhà, không sấm sét đánh người (T3, T6).

## 3. Kịch bản ánh sáng theo vùng × 12 thời thần

### 3.1 Bảng hiệu chỉnh nền của từng vùng

| Vùng | Độ cao chủ (m) | Sương × | Bão hòa × | Lệch sắc | Đèn đêm (loại · nhiệt màu) | Giờ đẹp nhất | Thời tiết đặc trưng |
|---|---|---|---|---|---|---|---|
| `thanh` Huyền Thành + Sơn Môn | 0–20 | 1,0 | 1,0 | — | đèn lồng giấy · 2.300 K | Dậu chính, Tuất sơ | quang, mưa phùn xuân |
| `tubinh` Tử Bình Phong | 120 | 1,1 | 0,95 | lạnh nhẹ | đèn đá · 2.500 K | Thìn sơ | mây đỉnh |
| `manh` Manh Phái Cốc | 30 (thung) | 1,3 | 0,9 | lục | đèn dầu thấp · 2.000 K | Mão chính | sương thung |
| `trichthien` Trích Thiên Đỉnh | 260 | 0,8 | 1,0 | lam | đèn sao (Đẩu Mẫu) · 3.000 K | Tý chính (trời sao) | trời trong đêm |
| `cungthong` Cùng Thông Hồ | 5 (mặt hồ) | 1,4 | 0,95 | lam lục | đèn thuyền · 2.200 K | Mão chính (sương mặt hồ) | sương hồ |
| `thulau` Thư Lâu Lâm | 60 | 1,1 | 0,9 | ấm | đèn đọc sách · 2.600 K | Thân chính (nắng xuyên lá) | — |
| `phongthuy` Phong Thủy Viên | 20 | 1,0 | 1,05 | lục | đèn vườn · 2.400 K | Thìn chính | — |
| `lichduong` Lịch Đường | 15 | 0,95 | 1,05 | ấm | đèn chợ · 2.200 K | Tỵ chính (chợ đông) | nắng |
| `longho` Long Hổ Sơn | 80 | 1,1 | 1,05 | đỏ đá | đèn lồng đỏ trầm · 2.100 K | Thân chính (vách đan hà đỏ rực) | mưa phùn |
| `vodang` Võ Đang Huyền Nhạc | 300–1.000 | 1,4 (biển mây dưới chân) | 1,0 | lam lục | đèn cung · 2.400 K | Mão chính (Kim Điện bắt nắng đầu) | biển mây, tuyết đỉnh đông |
| `chungnam` Chung Nam Toàn Chân | 200 | 1,1 | 0,85 | lạnh | đèn dầu trai đường · 2.300 K | Dần chính (tụng sớm trong tuyết) | tuyết đông |
| `maoshan` Mao Sơn Thượng Thanh | 150 | 1,8 | 0,9 | lục xám | đèn lồng trắng · 2.600 K | Thìn sơ (sương tan qua rừng trúc) | sương, mưa |
| `yentu` Yên Tử Trúc Lâm | 100–1.000 | 1,5 | 0,95 | lục tùng | đèn nến chùa · 2.000 K | Mão sơ trên Chùa Đồng (mây dưới chân) | mây vờn đỉnh |
| `buttap` Bút Tháp Tịnh Độ | 5 | 1,1 | 1,05 | ấm vàng | đèn dầu, hoa đăng · 2.000 K | Dậu chính (hồ sen phản chiếu) | — |
| `tangdia` Tạng Địa Tuyết Vực | 600 | 0,6 | 1,15 | lam trong | đèn bơ · 1.900 K | Ngọ chính (trời lam đậm, tường trắng) | gió lạnh, tuyết |
| `vanmieu` Văn Miếu Quốc Tử Giám | 10 | 1,0 | 1,0 | ấm đỏ gạch | đèn lồng · 2.300 K | Tỵ sơ (sĩ tử vào thi) | nắng |
| `phongdo` Phong Đô Quỷ Thành | −40 (hang) | 1,6 | 0,7 | lam ma + đỏ sẫm | đèn lồng đỏ + đèn ma lam · 1.800 K / 7.000 K | Tý chính | sương lạnh, nước nhỏ giọt |
| `mieucuong` Miêu Cương Cổ Trại | 40 (sông) | 1,5 | 1,1 | lục sông | bếp lửa, đuốc · 1.900 K | Tuất sơ (khói bếp, sông xanh) | sương sông |
| `conlon` Côn Lôn Thiên Trì | 260 (đảo trời) | 0,5 | 1,1 | trắng vàng | đèn ngọc · 4.000 K | Ngọ chính | trời trong tuyệt đối |
| `vancoc` Am Vân Cốc | 180 (vách) | 1,6 | 0,85 | xám lam | một ngọn đèn dầu · 2.000 K | Hợi chính (đêm mưa — cảnh `CMG-01`) | mưa đêm |

### 3.2 Huyền Thành + Huyền Quán Sơn Môn

| Thời thần | Ánh sáng & màu | Không khí | Sự sống |
|---|---|---|---|
| Tý | trăng trên mái Chính Đường; đèn đá thần đạo sáng | gió nhẹ, côn trùng | Trà Thất còn lửa; thầy viết chữ dưới đèn |
| Sửu | đèn phố tắt 30 % | sương mỏng sân lát đá | lính canh đi tuần |
| Dần | bếp sau sáng đỏ | lạnh | đạo đồng quét sân |
| Mão | tia nắng đầu chiếu bậc ngự đạo từ phía Đông | khói hương bay ngang | **chuông sớm**; cửa điện mở |
| Thìn | sân sáng đều | — | khách lên; Lão Tùng đón |
| Tỵ | nắng gắt lên mái vàng Bàn Thầy | — | Bàn Thầy đông |
| Ngọ | bóng ngắn; hồ sen chói | ve | khách nghỉ dưới hiên |
| Mùi | ánh vàng nhạt | gió | sân vắng; Trà Thất đông |
| Thân | vàng chiều trên tường son | — | khách xuống núi |
| Dậu | hoàng hôn sau Hậu Sơn; đèn thắp từ cổng vào trong | khói bếp | **trống chiều** |
| Tuất | lam chạng vạng; Thiên Mệnh Bàn tỏa sáng nhẹ trên trời | — | cửa điện đóng; cửa ngách mở |
| Hợi | đèn lồng đủ; cửa sổ phố vàng | yên | cư dân về nhà, đèn nhà tắt dần |

### 3.3 Long Hổ Sơn

| Thời thần | Ánh sáng & màu | Không khí | Sự sống |
|---|---|---|---|
| Tý | đèn lồng đỏ trầm dọc phủ môn; vách đan hà đen thẫm | sông Lô Khê róc rách | phủ yên |
| Sửu | — | sương trên sông | — |
| Dần | đèn đại đường sáng | — | đạo sĩ tụng sớm |
| Mão | nắng đầu lên đỉnh vách đỏ trước, thung còn tối | bè tre đầu tiên | mở phủ môn |
| Thìn | tường trắng mã đầu tường sáng rõ | — | khách cầu phù |
| Tỵ | nắng lên sân đá ngọc môn | — | Trương Thiên Sư tiếp ở đại đường |
| Ngọ | vách đỏ chói, bóng long não đậm | ve | — |
| Mùi | — | — | hoạt động kết phù |
| Thân | **vách đan hà đỏ rực** (giờ đẹp nhất) | — | bè tre về |
| Dậu | đỏ cam trên sông; quan tài treo trên vách thành bóng đen | gió sông | lễ tối |
| Tuất | lam; đèn đỏ lên | — | cửa phủ khép |
| Hợi | đèn tư đệ Thiên Sư (hậu viện) | — | — |

### 3.4 Võ Đang Huyền Nhạc

| Thời thần | Ánh sáng & màu | Không khí | Sự sống |
|---|---|---|---|
| Tý | trời sao rõ nhất game trừ Trích Thiên; Kim Điện phản trăng | lạnh | — |
| Sửu | biển mây trắng bạc dưới trăng | — | — |
| Dần | đèn Tử Tiêu cung | — | tĩnh tọa sớm |
| Mão | **Kim Điện bắt nắng đầu** — đỉnh vàng giữa trời tím, sườn núi còn tối | biển mây hồng | Thái Cực ở sân Tử Tiêu |
| Thìn | biển mây tan dần thành dải | — | người hành hương leo bậc |
| Tỵ | tường đỏ son, ngói lục lưu ly rõ màu nhất | — | — |
| Ngọ | nắng gắt, bóng tùng | — | nghỉ ở Nam Nham cung |
| Mùi | mây bò lên vách | gió | — |
| Thân | nắng chéo vào Nam Nham cung treo vách | — | — |
| Dậu | hoàng hôn trên 72 đỉnh | — | xuống núi |
| Tuất | đèn dọc thần đạo như chuỗi hạt | — | — |
| Hợi | — | gió đỉnh | — |

**Mùa đông:** tuyết trên ngói lục — màu ngói lộ qua lớp tuyết mỏng; không phủ trắng toàn bộ (giữ M2).

### 3.5 Chung Nam Toàn Chân

| Thời thần | Ánh sáng & màu | Không khí | Sự sống |
|---|---|---|---|
| Tý | tối, đèn dầu vân thủy đường | lạnh khô | — |
| Sửu | — | — | — |
| Dần | **tụng sớm**: đèn Ngọc Hoàng điện, hơi thở thành khói trong tuyết | im | khoa nghi sớm |
| Mão | nắng lạnh lên bờ nóc có tiểu thú | — | quét tuyết |
| Thìn | — | — | giờ ăn trai đường (mõ) |
| Tỵ | ánh trắng trên tường gạch xám | — | tàng kinh mở |
| Ngọ | — | — | trai đường (mõ) |
| Mùi | — | gió | — |
| Thân | nắng thấp, xà toàn tỉ lam lục rõ | — | giảng giới luật ở Lão Luật đường |
| Dậu | — | — | — |
| Tuất | lam lạnh | — | đóng cổng |
| Hợi | một cửa sổ sáng ở Tam Thanh các | — | đạo sĩ đọc kinh |

### 3.6 Mao Sơn Thượng Thanh

| Thời thần | Ánh sáng & màu | Không khí | Sự sống |
|---|---|---|---|
| Tý | đèn lồng trắng lờ mờ trong sương | ẩm | — |
| Sửu | — | — | — |
| Dần | — | sương dày nhất | — |
| Mão | rạng đông nhạt trong sương; tượng Lão Tử đồng chỉ thấy bóng | — | — |
| Thìn | **sương tan qua rừng trúc**, tia sáng xuyên thân trúc | — | hái chè trên đồi |
| Tỵ | tường trắng, lậu song in bóng hoa | — | án cứu người |
| Ngọ | — | — | — |
| Mùi | mưa thường đến | mưa trên lá trúc | — |
| Thân | — | — | — |
| Dậu | vàng nhạt ẩm | — | đầm sen |
| Tuất | — | — | — |
| Hợi | — | ếch nhái | — |

### 3.7 Yên Tử Trúc Lâm

| Thời thần | Ánh sáng & màu | Không khí | Sự sống |
|---|---|---|---|
| Tý | nến chùa Hoa Yên | gió tùng | — |
| Sửu | — | — | — |
| Dần | — | — | tăng dậy công phu |
| Mão | **Chùa Đồng trên biển mây, nắng đầu** (giờ đẹp nhất) | mây dưới chân | hành hương tới đỉnh |
| Thìn | rừng tùng xuyên nắng | — | kinh hành |
| Tỵ | ngói mũi hài đỏ nâu rõ nhất | — | — |
| Ngọ | — | — | — |
| Mùi | mây bò lên từ thung | — | — |
| Thân | nắng vàng trên vườn tháp Huệ Quang | — | — |
| Dậu | — | chuông chiều | — |
| Tuất | nến | — | thiền tối |
| Hợi | — | — | — |

### 3.8 Bút Tháp Tịnh Độ

| Thời thần | Ánh sáng & màu | Không khí | Sự sống |
|---|---|---|---|
| Tý | đèn dầu hành lang chữ Quốc | ếch, dế | — |
| Sửu | — | — | — |
| Dần | — | — | ni chúng công phu |
| Mão | nắng đầu trên đồng lúa | khói rơm | — |
| Thìn | — | — | Phật tử lên chùa |
| Tỵ | nắng trên tượng La Hán qua cửa | — | — |
| Ngọ | — | — | — |
| Mùi | — | — | phóng sinh |
| Thân | — | — | — |
| Dậu | **hồ sen phản chiếu hoàng hôn**, son thếp vàng trong điện ánh lên | — | tụng chiều |
| Tuất | đèn dầu; rằm: hoa đăng trên hồ | — | — |
| Hợi | — | — | — |

### 3.9 Tạng Địa Tuyết Vực *(chờ tham vấn về nội dung; ánh sáng dựng được)*

| Thời thần | Ánh sáng & màu | Không khí | Sự sống |
|---|---|---|---|
| Tý | trời sao dày, tường trắng phản sao | lạnh khô | — |
| Sửu–Dần | — | gió | — |
| Mão | nắng đầu lên kim đỉnh | — | — |
| Thìn–Tỵ | trời lam đậm, tường trắng – đỏ Hồng cung tương phản cao | — | hành lang bánh xe kinh |
| Ngọ | **trưa cao nguyên**: bóng rất gắt, trời gần tím ở đỉnh | — | — |
| Mùi–Thân | — | cờ gió căng | — |
| Dậu | hồ ngọc lam đổi sang vàng | — | — |
| Tuất–Hợi | hàng đèn bơ trong điện | — | — |

### 3.10 Văn Miếu Quốc Tử Giám

| Thời thần | Ánh sáng & màu | Không khí | Sự sống |
|---|---|---|---|
| Tý–Dần | đèn lồng Khuê Văn Các | — | — |
| Mão | nắng đầu xuyên bốn cửa tròn Khuê Văn Các | — | — |
| Thìn | — | — | sĩ tử tới |
| Tỵ | **Thiên Quang tỉnh phản trời**, bia đá sáng | — | thi |
| Ngọ–Mùi | bóng đa, muỗm | ve | — |
| Thân | gạch đỏ nâu ấm | — | — |
| Dậu–Hợi | đèn lồng hai bên trục | — | — |

### 3.11 Phong Đô Quỷ Thành

Phong Đô ở dưới đất, **không theo trời**. Ánh sáng theo **quan** (phần 6 §4.5) thay vì giờ; giờ thật chỉ đổi cường độ nhẹ (đêm thật: đèn ma lam × 1,15).

| Quan | Ánh sáng & màu | Không khí |
|---|---|---|
| Quỷ Môn Quan | đèn lồng đỏ sẫm, bóng dài | gió lạnh thổi ra |
| Đường Hoàng Tuyền | hoa bỉ ngạn đỏ **phát sáng nhẹ**, phần còn lại xám lam | nước nhỏ giọt |
| Cầu Nại Hà | ba cầu: thiện (ánh vàng mờ), bình (xám), ác (lam lạnh) — chỉ là phản chiếu | sương trên nước đen |
| Vọng Hương đài | lỗ trời nhìn thấy đèn Huyền Thành rất xa (ấm) | — |
| Thập điện | đèn bàn án, gương nghiệt kính sáng | tiếng sổ lật |
| Điện Địa Tạng | **ấm dần lên**, cuối cùng là ánh vàng sớm (Mão chính) khi ra | chuông xa |

Cài đặt «nhẹ nhàng» (`YC-09`): sương × 0,7, bão hòa đỏ bỉ ngạn × 0,6, đèn tăng 30 %.

### 3.12 Miêu Cương Cổ Trại

| Thời thần | Ánh sáng & màu | Không khí | Sự sống |
|---|---|---|---|
| Tý | bếp lửa trong nhà sàn qua khe ván | sông | — |
| Sửu–Dần | — | sương sông dày | — |
| Mão | nắng đầu trên ruộng bậc thang | — | — |
| Thìn | sông xanh lục rõ | — | giặt vải sáp ở bến |
| Tỵ–Mùi | — | — | chợ trại ở cầu phong vũ |
| Thân | nắng chéo qua mái âm dương | — | — |
| Dậu | — | khói bếp | trống lâu đánh |
| **Tuất** | **khói bếp, đèn đuốc soi sông** (giờ đẹp nhất) | — | quây quần bếp lửa |
| Hợi | đuốc tắt dần | — | — |

Hang của yểm sư (cửa Tà Lộ) **không** dùng bảng trại: ánh sáng tím lạnh từ đá, không đèn ấm — tách thị giác giữa trại (ấm, sống) và hang (lạnh).

### 3.13 Côn Lôn Thiên Trì và Am Vân Cốc

| Vùng | Ánh sáng chủ | Ghi chú |
|---|---|---|
| Côn Lôn | chỉ dùng khóa **Ngọ chính** cố định trong Vĩ thanh (trời trong tuyệt đối); sau Vĩ thanh, theo giờ thật nhưng sương × 0,5 | nơi duy nhất vàng lưu ly cho cả quần thể |
| Am Vân Cốc | theo giờ thật; đêm chỉ một ngọn đèn dầu trong am, cửa giấy vàng | cảnh then chốt: Hợi chính, mưa |

## 4. Kịch bản màu theo hồi (color script)

| Hồi | Cảnh khóa | Màu chủ | Màu nhấn | Độ tương phản | Cảm giác màu |
|---|---|---|---|---|---|
| Mở đầu | lễ lật trụ (Thìn sáng) | son `#9e1b14`, vỏ trứng `#efe6d2` | vàng `#d9a441` (viền trụ) | trung bình | trang nghiêm ấm |
| Mở đầu (Nghịch Thiên) | nhà trọ đêm mưa | lam đêm `#121a3a` | vàng đèn dầu `#ffb050` | cao (một nguồn sáng) | cô đơn → được tìm thấy |
| Hồi I | Mệnh Đồ trong am | giấy dó `#e8dcc0` | mực `#1a1418`, sáu nút màu ngũ hành | trung bình | rõ ràng |
| Hồi II | đổi theo thánh địa (bảng màu khóa) | — | — | — | đa dạng có trật tự |
| Hồi II | vạch mặt Định Mệnh Hội | nắng Tỵ gắt | đỏ áo thầy bói → nhạt dần khi bị vạch | cao | sự thật phơi ra |
| Hồi III | năm hạn | màu hành Kỵ người chơi + 15 % | đèn ấm hiếm | thấp, mờ | gió ngược |
| Hồi III | Lỗ Ban mời | ấm dễ chịu (đèn trà) | tím lạnh của Âm Bài | trung bình | cám dỗ đẹp |
| Hồi IV | Phong Đô | đen đá, đỏ sẫm, lam ma | đỏ bỉ ngạn | cao | đối diện |
| Hồi IV | ra khỏi Phong Đô | vàng sớm `#ffb27a` | — | chuyển đột ngột | được về |
| Vĩ thanh | Thiên Mệnh Bàn | trắng ngọc `#f4f1ea`, vàng lưu ly `#e3b341` | lam trời `#7fb7e6` | thấp, sáng | trọn vẹn |

## 5. Bảng màu khóa (tổng hợp)

Bảng màu thánh địa lấy nguyên từ bản sơ đồ §7. Bổ sung hai vùng chưa có:

| Vùng | Màu 1 | Màu 2 | Màu 3 | Màu 4 | Màu 5 |
|---|---|---|---|---|---|
| Huyền Thành + Sơn Môn | son tường `#9b2a1f` | đá lát `#8f877a` | vàng `#d4a63c` | gỗ sơn then `#2b2622` | vỏ trứng `#efe6d2` |
| Am Vân Cốc | tranh xám `#8a8172` | đá vách `#5c5a57` | giấy cửa `#e8dcc0` | rêu `#55684a` | đèn dầu `#ffb050` |
| Long Hổ | `#EDEBE4` | `#3B3D40` | `#7A2A1E` | `#4E6B45` | `#B5523B` |
| Võ Đang | `#A3271B` | `#2F7A55` | `#C9A23A` | `#8D8A84` | `#E9EEF2` |
| Chung Nam | `#6E6A66` | `#8E2F24` | `#2E5C8A` | `#3F7F5A` | `#F2F2EE` |
| Mao Sơn | `#F0EEE8` | `#2A2B2E` | `#6D9B57` | `#5B6670` | `#B8923A` |
| Yên Tử | `#8B3A2B` | `#5A3826` | `#2F4F3A` | `#9A968C` | `#A87B3D` |
| Bút Tháp | `#9A4130` | `#B8862B` | `#4F3020` | `#4F7A3E` | `#E8A1B4` |
| Tạng Địa | `#F1EEE6` | `#7B1E1E` | `#D8A928` | `#1E1A18` | `#3FA7C9` |
| Văn Miếu | `#8A3B2A` | `#9C2A1E` | `#7F7B72` | `#3E5C38` | `#C6A044` |
| Phong Đô | `#1C1B1F` | `#5A1414` | `#3E7FA8` | `#C21F2B` | `#6A6A70` |
| Miêu Cương | `#6B4A2E` | `#4A4A4C` | `#2B4E7A` | `#D7DADF` | `#3D8A78` |
| Côn Lôn | `#F4F1EA` | `#E3B341` | `#7FB7E6` | `#F2A9BC` | `#DDE3EA` |

Bảy vùng sảnh nghề cũ (`tubinh`, `manh`, `trichthien`, `cungthong`, `thulau`, `phongthuy`, `lichduong`) **kế thừa bảng Huyền Thành** và thêm một màu nhấn riêng theo vị thần của điện vùng (V2 §4): Lão Quân vàng đất, Quỷ Cốc lục rêu, Đẩu Mẫu lam sao, Thủy Quan lam hồ, Văn Xương son đỏ, Huyền Nữ tím nhạt, Thái Tuế vàng đồng — tài liệu 07 chốt mã.

## 6. Kiểm bảng màu (palette checker)

**Mục đích:** phát hiện trộn phong cách (T4, `KT-T4-04`) bằng máy trước khi người duyệt nhìn.

1. Chụp 4 góc chuẩn + 1 trong nhà của công trình (bản sơ đồ §8.5) ở khóa **Tỵ chính** (10:00, ánh sáng trung tính) và **Tuất chính** (20:00).
2. Che (mask) bầu trời, người chơi, NPC, hiệu ứng.
3. Gom màu điểm ảnh còn lại thành 8 cụm (k-means trong không gian CIELAB).
4. Mỗi cụm chiếm ≥ 5 % diện tích phải có ΔE2000 ≤ 12 tới **một** màu khóa của vùng, hoặc ≤ 8 tới màu trung tính (đen, trắng, xám đá theo vùng).
5. **Ngân sách màu lạ:** tổng diện tích cụm không khớp ≤ 10 %.
6. Kết quả **đỏ** nếu vượt; **vàng** nếu 7–10 %; người duyệt mỹ thuật quyết định ngoại lệ (vd hoa đăng rằm).

(Công cụ là việc của tài liệu 13; ngưỡng ở đây là chuẩn mỹ thuật.)

## 7. Luật vật liệu

### 7.1 Bảng vật liệu chuẩn (PBR, `MeshStandardMaterial`)

| Vật liệu | Màu gốc | Roughness | Metalness | Phát sáng | Texture thủ tục | Ghi chú |
|---|---|---|---|---|---|---|
| Gỗ sơn son | `#9e1b14` → `#7a140f` | 0,55–0,7 | 0 | — | `lacquerTex` (sọc nhẹ) | không bóng như nhựa; mép sờn lộ gỗ nâu ở chỗ tay chạm |
| Sơn then (đen) | `#120d10` | 0,35–0,5 | 0 | — | `lacquerTex` | phản chiếu mờ đèn |
| Thếp vàng | `#d4a63c` | 0,3–0,4 | 0,85 | — | — | chỉ ở chỗ thờ, viền, chữ; ≤ 8 % diện tích công trình (trừ Kim Điện, Côn Lôn) |
| Đồng (Kim Điện, chuông) | `#b8862f` | 0,35 | 0,9 | — | — | rỉ xanh ở chân, chỗ mưa đọng |
| Gỗ lim lên nước | `#5a3826` | 0,6 | 0 | — | vân gỗ | chùa Việt |
| Gỗ sam để mộc | `#6b4a2e` | 0,8 | 0 | — | vân thô | Miêu Cương |
| Đá xanh / đá lát | `#8f877a` | 0,85–0,95 | 0 | — | `stoneTex` | ướt khi mưa: roughness −0,25 |
| Đá ong | `#9a5a3a` | 0,95 | 0 | — | lỗ rỗ | tháp Huệ Quang |
| Gạch Bát Tràng | `#8a3b2a` | 0,85 | 0 | — | mạch vữa | Văn Miếu |
| Vôi trắng | `#edebe4` | 0,9 | 0 | — | vết ố chân tường | Long Hổ, Mao Sơn, Tạng |
| Ngói mũi hài | `#8b3a2b` | 0,8 | 0 | — | lớp ngói so le | rêu ở mái hướng Bắc |
| Lưu ly (lục / vàng) | `#2f7a55` / `#e3b341` | 0,25 | 0,1 | — | — | bóng men; không dùng cho chùa Việt |
| Giấy dó / giấy cửa | `#e8dcc0` | 0,95 | 0 | đêm: phát sáng khi có đèn sau | — | truyền sáng (translucency giả bằng emissive) |
| Lụa phướn | theo vùng | 0,7 | 0 | — | — | chuyển động gió |
| Nước hồ | — | 0,05 | 0 | — | phản chiếu | sen, hoa đăng nổi |
| Tuyết | `#f2f2ee` | 0,7 | 0 | — | — | không phủ kín ngói |
| Đèn lồng giấy | `#ffd9a0` | 0,6 | 0 | `#ffb050` × 1 | — | đã có (`lampGlow` trong `sect.js`) |
| Đèn bơ (Tạng) | `#ffcf80` | 0,5 | 0 | `#ff9a40` × 1,2 | — | chờ tham vấn bối cảnh |

### 7.2 Luật

1. **Không vật liệu kim loại bóng** ngoài đồng, thếp vàng, gương bát quái.
2. **Dấu vết thời gian ở chỗ người chạm**: tay vịn mòn, bậc lõm giữa, cột sờn ngang vai, sàn trước bàn thờ bóng hơn.
3. **Một mặt sạch, một mặt đời**: điện thờ sạch, gọn; nhà dân có đồ đạc, áo phơi, chén dở (`KT-T4-10`).
4. **Thếp vàng có trật tự**: vàng chỉ ở chỗ thờ và viền kiến trúc; không vàng trên tường, sàn.
5. **Không chữ ngẫu nhiên**: mọi chữ trong cảnh (biển, câu đối, bia) do biên tập Hán cấp (phần 8 §5).
6. **Phù trong cảnh**: dùng bộ ký tự hư cấu (phần 13 §5.4), mực chu sa `#b3261e` trên giấy vàng `#e6c35a`.
