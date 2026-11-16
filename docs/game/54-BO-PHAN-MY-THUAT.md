# 54 · Sổ tay bộ phận Mỹ thuật và tài sản 3D

## Sứ mệnh
Giữ cho thành trông như một nơi có thật: đúng tỉ lệ người, không hai nhà kề giống nhau, đủ bậc chi tiết để chạy nhẹ, và mọi tài sản đều có giấy tờ.

## Đọc gì theo thứ tự
1. [23-MY-THUAT-TAI-SAN](23-MY-THUAT-TAI-SAN.md) trọn chương, nhất là §23.2 (tỉ lệ), §23.4 (bậc), §23.6 (vật thiêng).
2. [GAME-AAA-MODEL-THANH-PHO](../GAME-AAA-MODEL-THANH-PHO.md) (bảng tỉ lệ đầy đủ), [DOHOA-MANIFEST](../DOHOA-MANIFEST.md) (quy tắc nướng và ngân sách).
3. [THANH-MANIFEST](../THANH-MANIFEST.md), [CAY-QUAN-MANIFEST](../CAY-QUAN-MANIFEST.md) nếu làm phố, cây, quán.
4. [A6](phu-luc/A6-tai-san-3d.md): hiện có gì.

## Phạm vi sở hữu
- `public/models/` và thư mục nguồn tài sản; sổ giấy phép.
- Script tài sản: nhóm `scripts/meshy-*.mjs`, `scripts/blender/`, `scripts/blender-bake.mjs`, `scripts/strip-anim.mjs`.
- Bảng `cityblocks.js › HOUSE_SPECS`, bảng phong cách trong `estate-layout.js`, `textures.js`.
- Chương 23.

## Giao diện với bộ phận khác
| Với | Hợp đồng |
|---|---|
| Client/3D | tên tệp là id; không đổi tên tệp đã phát hành; đủ bậc trước khi giao |
| Thiết kế game | model nào cho loại nhà, loại tiệm nào |
| Nội dung | luật vật thiêng; tên hàng bán |
| Vận hành | dung lượng tải; giấy phép |

## Quy trình một việc
1. Tìm tham chiếu thật và ghi nguồn (theo quy tắc manifest của dự án).
2. Lấy model: tải bản CC0 hoặc sinh bằng Blender theo mét. **Không** tạo mới bằng dịch vụ tốn credit.
3. Ghi một dòng nguồn gốc vào sổ giấy phép.
4. Nén và sinh các bậc bằng script; kiểm tệp.
5. Chụp ảnh so sánh bản gốc với từng bậc, cùng góc và ánh sáng. Bậc nào vỡ hình thì ghi vào danh sách loại trừ.
6. Giao cho Client kèm số tam giác từng bậc.

## Định nghĩa «xong»
- Đúng bảng tỉ lệ; phóng đều, không kéo méo.
- Đủ bậc theo §23.4; dung lượng mỗi tệp trong ngưỡng của manifest đồ hoạ.
- Có dòng nguồn gốc; giấy phép là CC0 hoặc tự sinh (LN-13).
- Tượng và hàng bán theo §23.6.
- [A6](phu-luc/A6-tai-san-3d.md) sau khi sinh lại phản ánh đúng số tệp mới.
- Có ảnh so sánh trong thư mục ảnh kiểm.

## Lệnh hay dùng
```bash
node scripts/blender/check_glb.mjs
```
```bash
node scripts/meshy-pack-library.mjs
```
```bash
node scripts/meshy-vclod.mjs
```
```bash
node scripts/docs-game-gen.mjs
```

## Hàng việc hiện tại
`VC-010` (nấu bậc vừa và xa cho nhà mới) · `VC-006` (model riêng cho hai NPC canon) · `VC-009` (cùng Client). Chi tiết: [04-LO-TRINH](04-LO-TRINH.md).
