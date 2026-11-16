# 10 · Thế giới và bản đồ

> **Trạng thái:** `[ĐÃ CÓ]`
> **Bộ phận chủ trì:** Thiết kế game (bố cục) · Client/3D (dựng hình)
> **Nguồn sự thật trong mã:** `src/game/terrain.js`, `src/game/citylayout.js`, `src/game/city4.js`, `src/game/batquai.js`, `src/game/court.js`, `src/game/world.js`, `src/game/waterways.js`, `src/game/bridges.js`, `src/game/heaven.js`, `src/game/rooms.js`, `src/game/roomgrid.js`, `src/game/homes.js`, `src/game/shops.js`, `src/game/temples.js`, `src/game/spawn.js`; hằng số và danh sách ở [A5](phu-luc/A5-dia-diem.md)
> **Test:** `scripts/test-terrain.mjs`, `scripts/test-game-city-v4.mjs`, `scripts/test-game-batquai.mjs`, `scripts/test-game-homes.mjs`, `scripts/test-game-water.mjs`, `scripts/test-game-heaven.mjs`, `scripts/test-game-sky.mjs`, `scripts/test-game-map.mjs`, `scripts/test-game-spawn.mjs`
> **Thay thế:** `DAI-THE-GIOI-DESIGN`, phần thế giới của `GAME-V2-THIET-KE`; chi tiết quy hoạch vẫn ở các manifest lớp L2 nêu trong §10.9
> **Kiểm với mã ngày:** 2026-11-16

## 10.0 Mục đích, phạm vi, tóm tắt

Chương này là bản đồ bằng chữ: thế giới gồm những gì, nằm ở đâu, theo luật bố cục nào. Người thêm một công trình, một loại tiệm hay một vùng mới phải bắt đầu từ đây. Không gồm: cách dựng hình và va chạm (§30), tỉ lệ và model (§23), chức năng của từng nơi (chương hệ thống tương ứng).

```
                         Thư Lâu Lâm (Bắc)
     Tử Bình Phong ●                         ● Manh Phái Cốc
                    ┌───────────────────────┐
                    │  NGOẠI THÀNH (tới 2.125 m): phố, 8 sảnh nghề, biệt phủ, biệt thự
 Phong Thủy Viên ●  │   ┌───────────────┐   │  ● Lịch Đường
                    │   │ TRUNG THÀNH (tới 1.050 m): phố nghề, chợ khu
                    │   │   ┌───────┐   │   │
                    │   │   │NỘI THÀNH (tới 380 m): 8 cung, phố thầy bói
                    │   │   │ SƠN MÔN│  │   │        ↑ Bắc là −z · Đông là +x
                    │   │   └───────┘   │   │
                    │   └───────────────┘   │
                    │ ~~~~ Huyền Hà xuyên phía Nam ~~~~ ● Cùng Thông Hồ
                    └───────────────────────┘
     Trích Thiên Đỉnh ●                         ──▶ dải phòng phía Đông (x từ 4.346):
                                                    nội thất, ngục, mỏ, Cửu Trọng Thiên
     Trên không: quận Thiên Bàn, 9 đảo ở độ cao 460 m phía trên Sơn Môn
```

## 10.1 Hệ toạ độ và quy mô

`[ĐÃ CÓ]` Hằng số: [A5](phu-luc/A5-dia-diem.md) › `terrain.js`.

- Đơn vị mét. `x` tăng về Đông, `z` tăng về Nam, `y` là độ cao. Tâm thế giới `(0, 0)` là tâm Sơn Môn.
- Thế giới vuông cạnh `WORLD` = 8.192 m. Rìa đi được tới `EDGE`. Ngoài rìa là biển mây ở `CLOUD_SEA`. Mực nước sông hồ `WATER`.
- Trong thành dùng thêm khung cục bộ theo cung: `u` đo dọc trục từ tâm ra, `v` đo ngang. Mọi bố cục đối xứng tám hướng viết theo `(u, v)`.
- **Trung đoạn** của bát giác (khoảng cách từ tâm tới giữa một cạnh) là số đo chuẩn của mọi vành.
- **Dải phòng:** vùng `x` từ `ROOM_X0` tới `ROOM_X1` ở phía Đông, ngoài bản đồ đi bộ. Chứa nội thất điện, phòng tiệm và nhà, Thiên Lao, Khoáng Sơn, Cửu Trọng Thiên. Người chơi tới đó bằng cửa hoặc thang, không đi bộ tới được.

## 10.2 Vùng ngoài thành

`[ĐÃ CÓ]` Bảng `terrain.REGIONS` ở [A5](phu-luc/A5-dia-diem.md).

| Vùng | Hướng | Địa hình | Dùng cho |
|---|---|---|---|
| Tử Bình Phong | Tây Bắc | đỉnh núi | hoang dã, mỏ, săn bắn |
| Manh Phái Cốc | Đông Bắc | thung lũng | linh điền, trang trại |
| Trích Thiên Đỉnh | Tây Nam | đỉnh núi | hoang dã |
| Cùng Thông Hồ | Đông Nam, sát thành | hồ | ngư phủ, đò, thuyền hoa |
| Thư Lâu Lâm | Bắc | cao nguyên | — |
| Phong Thủy Viên | Tây | cao nguyên | — |
| Lịch Đường | Đông | cao nguyên | — |

Từ thành v4, **tám sảnh nghề đã dời vào Ngoại Thành** (QĐ-18); các vùng trên giữ tên cũ làm cảnh và làm nơi sản xuất (§17.1.1). Công trình ngoài tường Ngoại Thành là thứ duy nhất phá được (§19).

## 10.3 Huyền Thành

`[ĐÃ CÓ]` Hằng số: [A5](phu-luc/A5-dia-diem.md) › `citylayout.js › CITY`. Quy chuẩn phố phường: [THANH-MANIFEST](../THANH-MANIFEST.md), [TUONG-THANH-MANIFEST](../TUONG-THANH-MANIFEST.md).

### 10.3.1 Ba vành và tám cung

| Vành | Trung đoạn ngoài | Là gì |
|---|---|---|
| Sơn Môn | `SONMON_A` | khu quán khởi đầu |
| Nội Thành | `NOI_A` | tám khu chủ đề theo quẻ, phố thầy bói |
| Trung Thành | `TRUNG_A` | phố nghề quanh chợ khu |
| Ngoại Thành | `A` | phố dân cư, tám sảnh nghề, biệt phủ, khu biệt thự; tường thành và tám cổng lớn |

Tám cung theo Hậu Thiên Bát Quái (`batquai.GUA`):

| Cung | Hướng | Hành | Cổng (Bát Môn) | Khu Nội Thành | Chủ đề |
|---|---|---|---|---|---|
| Ly | Nam | Hỏa | Cảnh Môn | Ly Hỏa Phường | chợ phiên, lò đan, tửu lâu |
| Khôn | Tây Nam | Thổ | Tử Môn | Khôn Nguyên Điền | linh điền, kho lương |
| Đoài | Tây | Kim | Kinh Môn | Đoài Trạch Lâu | hồ, trà lâu, cầm ca |
| Càn | Tây Bắc | Kim | Khai Môn | Càn Kiếm Các | kiếm tu, luyện võ |
| Khảm | Bắc | Thủy | Hưu Môn | Khảm Thủy Hậu Sơn | Hậu Sơn, giếng linh tuyền |
| Cấn | Đông Bắc | Thổ | Sinh Môn | Cấn Sơn Trận Các | tháp trấn sơn, trận pháp |
| Chấn | Đông | Mộc | Thương Môn | Chấn Lôi Đài | lôi đài, Lôi Âm Điện |
| Tốn | Đông Nam | Mộc | Đỗ Môn | Tốn Phong Lâm | dược viên, Tàng Phong Lâu |

Hành của cung được nhiều hệ dùng: tông màu nhà, sao hợp mệnh khi mua nhà (§15.2.1), cộng lương cho nghề cùng hành (§14.1.1), hệ số điểm tội (§19), miếu gợi ý làm nơi xuất hiện.

### 10.3.2 Đường và ô phố

- Tám **đại lộ** hướng tâm (`AVE_W`), các **vành** bát giác tại `RINGS` (`RING_W`), **phố nhánh** (`STREET_W`), **ngõ** vào sân trong (`ALLEY_W`).
- **Ô** phố khoảng `COL` × `ROW` mét; mọi góc ô vát `CHAMFER` mét. Nhà bao quanh chu vi ô, lõi ô là **sân trong**.
- **Phường** là nhóm khoảng ba nhân ba ô cùng cung, có tên, có quảng trường với đình, cây đa, giếng, sạp, cổng phường.
- Luật mặt tiền: **mọi lô quay ra đại lộ, vành hoặc quảng trường là tiệm**; lô góc lớn là tửu lâu hoặc trà lâu.
- Mỗi khu có đủ loại tiệm và đúng một Dịch Trạm, một Nha Môn, một Tiền Trang, một miếu.

### 10.3.3 Số lượng (đếm từ bộ sinh, [A5](phu-luc/A5-dia-diem.md) §A5.1)

| Thứ | Số |
|---|---|
| Nhà trong thành | 18.152, trong đó 8.940 nhà dân |
| Cửa hàng | 8.560 thuộc 15 loại (12 loại hàng, cùng Tiền Trang, Dịch Trạm, Nha Môn mỗi loại 16) |
| Quầy thầy bói | 289 |
| Cửa vào được | 17.411: 8.560 tiệm, 8.514 nhà dân gõ cửa, 289 quầy thầy, 27 nhà rao bán, 21 miếu và điện |
| Nhà rao bán | 292 căn (§15.2.1) |

Các con số này đổi mỗi khi bộ sinh đổi; **không chép sang chương khác**, hãy dẫn về A5.

### 10.3.4 Bất biến của thành (LN-12, LN-14)

1. Id nhà dạng «ô : thứ tự» là tất định theo hạt giống.
2. Chỉ số nhà rao bán `h` giữ nguyên qua mọi lần đổi bố cục.
3. Số tiệm hoặc thứ tự tiệm đổi thì nâng `guild-core.LAYOUT_VER`.
4. Không nhà nào chồng nhau, lấn đường, đè nước. Mọi cửa đi tới được.
5. Mỗi loại dữ liệu bố cục có một mô-đun thuần làm nguồn; mô-đun dựng hình, va chạm và test đều đọc từ đó.

## 10.4 Sơn Môn

`[ĐÃ CÓ]` Bố cục: `court.js`; toạ độ từng gian ở [A5](phu-luc/A5-dia-diem.md) › `court.js`.

Khuôn viên 120 × 132 m có tường son, cổng Nam (Sơn Môn) và cổng Bắc. Từ cổng vào:
- **Sân trước:** thần đạo, Đại Đỉnh với lư hương chung, hai hồ sen. Cánh Tây: Trà Thất, Ống Xăm, Bàn Hợp Hôn, Tàng Y Các. Cánh Đông: La Bàn Đài, Bảng Lịch.
- **Hai tầng nền đá** có lan can và bậc ngự đạo. Trên cùng là **Bàn Thầy** trước Chính Đường.
- **Hậu Sơn** phía Bắc: cửa Chính Điện Tam Thanh. Hai bên là cửa Vận Mệnh Các và Thái Tuế Điện.
- **Ngoài cổng Nam:** quầy cơm, liêu xá, Giếng Đông (nơi sinh hoạt của người mới, §13).
- **Thang lên trời:** Thiên Thê ngoài tường Đông; Vân Thang trong sân (§16.5).
- **NPC có tên:** Thầy Tử Bình (Bàn Thầy), Lão Tùng (cổng), Bà Tư (Tàng Y Các); Am Vân Cốc với Vân Cốc và Khổng tiên sinh ở sườn Tây Hậu Sơn (§21).

## 10.5 Điện, miếu, sảnh nghề

`[ĐÃ CÓ]` Danh sách: [A5](phu-luc/A5-dia-diem.md) › `world.js › ROOMS`, `HALLS`; [A3](phu-luc/A3-so-lieu.md) › `temples.js`.

- **Sáu điện vào được**, cửa ở Sơn Môn và Nội Thành, nội thất ở dải phòng: Chính Điện Tam Thanh, Văn Xương Các, Đẩu Mẫu Điện, Lão Quân Điện, Vận Mệnh Các, Thái Tuế Điện.
- **Miếu phường**: tám vị thần, mỗi cung một vị, mỗi vị một nghi thức và một thầy giữ miếu (§12.2).
- **Tám sảnh nghề** trong thành, mỗi sảnh gắn một phép của engine (§12.4).
- **Phố Thầy Bói** ở Nội Thành: các quầy thầy luân phiên theo `homes.FORTUNE_ROTA`.

## 10.6 Thủy hệ

`[ĐÃ CÓ]` Hằng số: [A5](phu-luc/A5-dia-diem.md) › `waterways.js`, `canals.js`, `bridges.js`.

- **Huyền Hà:** sông chính, chạy xuyên phía Nam thành giữa hai bờ kè đá, có lạch sâu giữa dòng và dòng chảy mạnh dần về giữa. Kênh nhánh Nam Khê.
- **Cùng Thông Hồ** ở Đông Nam; ao và hồ sen trong thành là nước thật, lội được.
- **Cầu:** dốc thoải cho người đi bộ, tĩnh không đủ cho thuyền. Mặt cầu là nền đi được có mặt dưới, nên bơi dưới gầm không bị nhấc lên.
- **Thủy môn** nơi sông kênh xuyên tường thành.
- **Luật:** không công trình nào đứng giữa dòng; test `water` dò toàn bộ nhà và công trình.

## 10.7 Hai vùng trời

`[ĐÃ CÓ]`

| | Cửu Trọng Thiên | Quận Thiên Bàn |
|---|---|---|
| Ở đâu | dải phòng phía Đông, tâm quanh `(5.646, 1.300)` | ngay trên Sơn Môn, độ cao 460 m |
| Gồm | đảo giữa Quân Thiên và tám đảo theo tám phương, nối bằng tám cầu | đảo chủ và tám đảo nhỏ, nối bằng bốn cầu vân |
| Để làm gì | chín tiên phủ mua được (§15.2.1) | cảnh, bốn phòng mẫu «biệt thự trên mây» |
| Lên bằng | Thiên Thê | Vân Thang |
| Chi tiết | [NHA-DIADIEM-MANIFEST](../NHA-DIADIEM-MANIFEST.md) §2 | [GAME-TROI-THIET-KE](../GAME-TROI-THIET-KE.md) |

Luật chung: nền đảo là «nền trời», chỉ tính khi lời gọi biết độ cao của người; mọi phép tính hai chiều (camera, dân phố, cỏ) bỏ qua, để đi dưới đảo không bị nhấc lên.

## 10.8 Phòng trong nhà, ngục, mỏ, nơi xuất hiện

`[ĐÃ CÓ]`

- **Phòng lưới** (`rooms.js`, `roomgrid.js`): mỗi tiệm, nhà rao bán, miếu có một phòng riêng ở dải phòng, toạ độ tất định theo khoá, nên hai người cùng vào một căn sẽ thấy nhau. Phòng dựng khi bước vào và được giải phóng khi vượt số phòng giữ tối đa (§30).
- **Trạm ảo:** cửa `door:`, gõ cửa `knock:`, lối ra `exit:` (về đúng cửa đã vào), điểm tương tác trong phòng `spot:`.
- **Thiên Lao, Khoáng Sơn** (§19) và **Mỏ Dân Sự** (§14) nằm ở dải phòng.
- **Nơi xuất hiện** (`spawn.js`): lần đầu ở sân Sơn Môn cạnh Thầy Tử Bình; về sau chọn chỗ lần trước, nhà riêng, miếu ứng với Dụng thần, hoặc Sơn Môn. Máy chủ chỉ nhận nơi xuất hiện nằm trong biên.
- **Mùa** (`season.js`): theo tiết khí giờ Việt Nam; cây đổi màu, hoa theo mùa.

## 10.9 Tài liệu chi tiết (lớp L2)

| Cần biết | Đọc |
|---|---|
| Quy chuẩn phường, mặt tiền, chiều cao, màu, sân trong, kèm chỉ số kiểm | [THANH-MANIFEST](../THANH-MANIFEST.md); script `scripts/city-metrics.mjs` |
| Tường thành, cổng | [TUONG-THANH-MANIFEST](../TUONG-THANH-MANIFEST.md) |
| Cửu Trọng Thiên, menu «Địa điểm» | [NHA-DIADIEM-MANIFEST](../NHA-DIADIEM-MANIFEST.md) |
| Quận Thiên Bàn | [GAME-TROI-THIET-KE](../GAME-TROI-THIET-KE.md) |
| Cây, quán, mùa | [CAY-QUAN-MANIFEST](../CAY-QUAN-MANIFEST.md) |

## 10.10 Liên kết với hệ khác

| Hệ | Lấy gì từ thế giới | Chương |
|---|---|---|
| Việc làm | loại tiệm, khoá tiệm, khu làm việc, cung của tiệm | §14 |
| Nhà | vị trí và hành phường của từng căn, hướng cửa | §15 |
| Bói toán | vị trí thầy, miếu, sảnh | §12 |
| Di chuyển | nền đi được, nước, cầu, thang | §16 |
| Luật | trong hay ngoài tường Ngoại Thành; cung nào | §19 |
| Mạng | biên toạ độ hợp lệ, phát vị trí theo vùng | §31 |
| Giao diện | bản đồ, menu «Địa điểm» | §22 |

## 10.11 Kiểm thử, nghiệm thu, việc mở

- Các bộ test ở đầu chương bảo vệ: tường kín và cổng thông; không nhà đè nhà, đè đường, đè nước; mọi cửa tới được; đảo không hở; chỉ số `h` giữ nguyên.
- `node scripts/city-metrics.mjs` in chỉ số quy hoạch của `THANH-MANIFEST` và thoát mã 1 khi trượt.
- **Thêm một công trình hoặc loại tiệm:** (1) thêm vào mô-đun thuần nguồn; (2) chạy bộ test bố cục; (3) nếu đổi số hoặc thứ tự tiệm, nâng `LAYOUT_VER`; (4) sinh lại phụ lục.
- Việc mở: `VC-019`.
