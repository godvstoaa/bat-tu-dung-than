# 23 · Mỹ thuật và tài sản 3D

> **Trạng thái:** `[ĐÃ CÓ]`
> **Bộ phận chủ trì:** Mỹ thuật · Client/3D
> **Nguồn sự thật trong mã:** `public/models/` (thống kê ở [A6](phu-luc/A6-tai-san-3d.md)), `src/game/assets.js`, `src/game/models.js`, `src/game/textures.js`, `src/game/archkit.js`, `src/game/archkit-style.js`, `src/game/characters.js`, `src/game/accessories.js`, `src/game/cityblocks.js › HOUSE_SPECS`, các script `scripts/meshy-*.mjs` và `scripts/blender/`
> **Test:** `scripts/blender/check_glb.mjs` (kiểm tệp GLB); ảnh so sánh trong `shots/`
> **Thay thế:** `GAME-MESHY-ASSET-PLAN`, `MESHY-LIBRARY-CC0`; chi tiết vẫn ở `GAME-AAA-MODEL-THANH-PHO`, `DOHOA-MANIFEST`, `CAY-QUAN-MANIFEST` (lớp L2)
> **Kiểm với mã ngày:** 2026-11-16

## 23.0 Mục đích, phạm vi, tóm tắt

Chương này nói game trông thế nào, tài sản từ đâu ra, đặt tên và chia bậc ra sao. Không gồm: cách nạp và vẽ (§30), bố cục đặt công trình (§10).

| Phần | Một dòng | Mục |
|---|---|---|
| Phong cách | sơn mài dưới nắng thật; thành cổ Á Đông; vùng trời ngọc trắng mái vàng | §23.1 |
| Tỉ lệ | mọi model theo mét thật, người 1,60–1,76 m | §23.2 |
| Nguồn tài sản | ba nguồn, đều có dòng nguồn gốc | §23.3 |
| Bậc model | mười hậu tố tệp | §23.4 |
| Nhân vật, phụ kiện | khung xương có sẵn, nhuộm màu, phụ kiện dựng bằng mã | §23.5 |
| Luật vật thiêng | tượng không chữ, không thánh tích | §23.6 |

Đích chất lượng (QĐ-24): **không hứa mức AAA**; đích là game thương mại trên web tầm trung, đo bằng số ở các điểm cố định (§30).

## 23.1 Phong cách

`[ĐÃ CÓ]`

- **Bảng màu gốc** (`textures.PAL`): then (đen sơn mài), son, vàng, vỏ trứng, lam ngọc. Huyền Thành: son, đá xám, vàng thếp, gỗ sẫm, ngà.
- **Màu theo cung:** nhà mỗi cung mang tông hành của cung, kèm biến thiên từng nhà về độ sáng và ấm lạnh. Không hai nhà liền kề giống nhau cả model, chiều cao lẫn màu.
- **Ánh sáng** theo giờ thật: ngày, chiều tà dịu, đêm có sao và đèn lồng; đêm không đen kịt.
- **Cửu Trọng Thiên:** tường ngọc trắng, viền son; mái mỗi đảo một màu theo phương và hành.
- **Cây:** sáu loài, cao thấp chênh rõ, lay theo gió, đổi màu theo mùa.
- **Mặt đất, đá, nước** sinh thủ tục: không có ảnh chụp, không có tệp texture mặt đất.

## 23.2 Tỉ lệ chuẩn

`[ĐÃ CÓ]` Toàn bảng: [GAME-AAA-MODEL-THANH-PHO](../GAME-AAA-MODEL-THANH-PHO.md) §1. Các con số dưới đây là **luật** cho mọi model mới.

| Thứ | Số đo |
|---|---|
| Người | 1,60–1,76 m; nam 1,76, nữ 1,66 |
| Gian nhà | 3,6 m; mặt tiền là bội số của gian |
| Nhà một tầng ba gian | khoảng 11,0 × 7,0 × 4,6 m |
| Nhà hai tầng | khoảng 11,0 × 8,0 × 8,0 m |
| Tiệm chợ một gian | khoảng 4,2 × 3,6 × 3,2 m; quầy cao 1,1 m |
| Cổng tông môn | rộng 14 m; cổng thành cao không quá 38 m |
| Nhà phố trong thành | đỉnh mái không quá khoảng 8,6 m, trừ công trình mốc |

Quy tắc: model **phóng đều**, không kéo méo một trục. Model sinh mới phải đúng mét từ gốc, không sửa bằng hệ số trong mã.

## 23.3 Ba nguồn tài sản

`[ĐÃ CÓ]` Luật nền LN-13.

| Nguồn | Tiền tố id | Ghi chú |
|---|---|---|
| Model tạo trước đây bằng dịch vụ sinh 3D | không tiền tố (`palace_grand`, `hero_m`, `deity_*`…) | không tạo thêm; credit đã hết |
| Model CC0 tải từ thư viện cộng đồng | `lib_*`, `bq_*`, `pr_*` | mỗi model một dòng trong sổ giấy phép `assets-meshy/library/LICENSES.md` |
| Model tự sinh bằng Blender theo mã | `lib_*` (nhà phố mới, đảo, cầu vân…) | script trong `scripts/blender/gen_*.py`; đúng mét; không tốn credit (QĐ-26) |
| Kiến trúc dựng bằng mã lúc chạy | không có tệp | biệt phủ, biệt thự, tiên phủ, nội thất, phụ kiện (`archkit*.js`, `interior-build.js`, `accessories.js`) |

Lưu ý đặt tên: một số model nhà mới mang tiền tố lặp `lib_lib_`; id trong mã giữ đúng tên tệp. Không đổi tên tệp đã phát hành.

## 23.4 Bậc model

`[ĐÃ CÓ]` Số tệp mỗi bậc: [A6](phu-luc/A6-tai-san-3d.md). Luật chọn bậc theo khoảng cách: §30.

| Hậu tố | Là gì | Dùng khi |
|---|---|---|
| (không) | bản gốc đã nén, nhiều tam giác nhất | sát người chơi, khi không có bản nướng |
| `.bk` | bản nướng bằng Blender: lưới nhẹ kèm ảnh màu và ảnh pháp tuyến | bậc gần và vừa của nhà phố |
| `.mid` | bản vừa | công trình ở tầm trung |
| `.lod`, `.lod1`, `.lod2` | bản giản lược các đời trước | bậc vừa và xa của vài nhóm |
| `.far` | bản xa | công trình ở xa |
| `.vc`, `.vc2` | bản xa và rất xa dùng màu đỉnh, không ảnh | nhân bản ở xa; bản vô hình để đổ bóng |
| `.hd` | bản ảnh nét cao | nhân vật sau khi đã vào game; chỉ ở mức đồ hoạ không thấp |

Quy trình thêm một model: tải hoặc sinh → ghi nguồn gốc → nén và sinh các bậc bằng script → kiểm tệp → ảnh so sánh bậc gần và bậc vừa → mới dùng trong mã. Bản giản lược vỡ hình thì ghi vào danh sách loại trừ và dùng bản gốc ở bậc gần.

## 23.5 Nhân vật và phụ kiện

`[ĐÃ CÓ]`

- Khung xương và hoạt ảnh có sẵn: đứng, đi, chạy, ngồi, cúi chào, vẫy. Tư thế ngồi bồ đoàn, cầm đồ, bay được dựng bằng lớp lệch xương trong mã.
- **Không đổi khung xương, không đổi chiều cao** (QĐ-27). Nâng hình bằng: vật liệu dùng chung theo model và màu; nhuộm áo theo vùng màu; bỏ ánh kim sai; da ấm; viền sáng.
- **Phụ kiện** là vật cứng dựng bằng mã, bám một điểm xương: búi tóc cài trâm, khăn trán, nón lá, túi vải, bình hồ lô, ống quyển, tràng hạt… Không làm áo vải mềm.
- **Vật cưỡi** dựng bằng mã; mỗi vật một bộ tư thế và hiệu ứng riêng (§16.4).

## 23.6 Luật vật thiêng

`[ĐÃ CÓ]` Luật nền LN-11.

- Tượng thần kiểu gỗ sơn son thếp vàng trên đài sen đá; **không chữ, không thánh tích cụ thể**.
- Không đặt camera phía trên đầu tượng. Không chữ trên tượng.
- Phù, bùa chỉ là ký tự hư cấu. Không dựng chân ngôn, giới văn, câu chú thật.
- Trang phục bán được không mang tên vật thiêng hoặc pháp khí thật của một tôn giáo.

## 23.7 Liên kết, kiểm thử, việc mở

| Hệ | Trao đổi | Chương |
|---|---|---|
| Thế giới | model nào đặt ở đâu; `HOUSE_SPECS` | §10 |
| Kỹ thuật client | nạp theo bậc, nhân bản, va chạm theo hình khối | §30 |
| Nhân vật | trang bị, gia trì | §11 |
| An toàn | luật vật thiêng | §40 |

- Kiểm: `node scripts/blender/check_glb.mjs` cho model tự sinh; ảnh so sánh trong `shots/gfx/`; chỉ số quy hoạch `scripts/city-metrics.mjs`.
- Việc mở: `VC-006`, `VC-009`, `VC-010`.
