# 01 · Phần 26 — Hiệu ứng chi tiết: gia trì theo bậc × hành, đặc tả từng skin, hiệu ứng nghi lễ

> Mở rộng phần 13 §5. Gốc code: `effects.js › createGiatri(wx, skins)` với các lớp `aura` (vòng dưới chân, nhịp thở), `motes` (linh khí bay quanh), `trail` (vệt khi chạy / bay), `halo` (pháp quang sau lưng), `fly` (ngự vật). Các con số dưới đây là **đích ban đầu** cho đội VFX.

## 1. Gia trì nguyên tố: bậc × hành

Năm mốc gia trì (V2 §3.1) — khi chuyển sang cảnh giới, tài liệu 09 ánh xạ mốc. Mỗi ô: **hình — chuyển động — số hạt — chu kỳ**.

### 1.1 Mốc 1 · Hào quang hộ thể (vòng dưới chân)

| Hành | Hình | Chuyển động | Bán kính | Nhịp thở |
|---|---|---|---|---|
| Mộc | vòng lá non mảnh, 8 lá | lá xoay chậm theo chiều kim đồng hồ | 0,7 m | phồng 5 % mỗi 4 s |
| Hỏa | vòng than hồng mờ | chập chờn nhẹ (không nhấp nháy) | 0,6 m | 3,5 s |
| Thổ | vòng cát mịn | cát trôi vào tâm rồi tỏa ra | 0,8 m | 5 s (chậm nhất) |
| Kim | vòng sáng kim mảnh như sợi | đứng yên, lóe một điểm chạy quanh mỗi 6 s | 0,65 m | 4,5 s |
| Thủy | vòng gợn nước | gợn lan ra từ chân | 0,75 m | 4 s |

### 1.2 Mốc 2 · Linh khí quanh thân (`motes`)

| Hành | Hạt | Số hạt (đứng / đi) | Quỹ đạo (`MOTE`) | Ghi chú |
|---|---|---|---|---|
| Mộc | lá non | 14 / 8 | xoắn ốc đi lên tới 2,2 m rồi tan | lá không thành cánh hoa |
| Hỏa | đốm lửa | 16 / 10 | bốc thẳng, thu nhỏ dần theo độ cao (tới 2,4 m) | không bao thân |
| Thổ | bụi vàng | 18 / 10 | quay quanh sát đất (0,15–0,5 m) | — |
| Kim | ánh kim | 10 / 6 | lóe tại chỗ ngẫu nhiên quanh thân, sống 0,3 s | không hình lưỡi |
| Thủy | giọt | 14 / 8 | rơi từ 1,8 m xuống, loang trên vòng chân | đêm giảm sáng 30 % |

### 1.3 Mốc 3 · Vệt bộ pháp (`trail`)

| Hành | Vệt | Độ dài | Tan trong |
|---|---|---|---|
| Mộc | lá rơi theo bước | 6 lá | 1,5 s |
| Hỏa | đốm tàn | 1,5 m | 0,8 s |
| Thổ | dấu chân vàng mờ | 4 dấu | 2 s |
| Kim | vệt sáng ngắn | 1 m | 0,4 s |
| Thủy | vệt nước bay hơi | 1,2 m | 1,2 s |

### 1.4 Mốc 4 · Ngự kiếm (`fly`) — xem §2.3 cho skin

### 1.5 Mốc 5 · Pháp quang sau lưng (`halo`)

| Hành | Hình | Ghi chú |
|---|---|---|
| Mộc | vòng cành liễu đan, cách lưng 0,4 m | **không** đặt sau đầu (tránh hào quang thánh tướng, `VD-T6-22`) — tâm vòng ngang giữa lưng |
| Hỏa | vòng lửa mảnh | như trên |
| Thổ | vòng bát quái mờ | như trên |
| Kim | vòng kim mảnh có 8 điểm sáng | như trên |
| Thủy | vòng sóng | như trên |

## 2. Đặc tả từng skin (Tàng Y Các)

### 2.1 Hào quang

| id | Tên | Hình | Màu | Hạt | Ràng buộc |
|---|---|---|---|---|---|
| `aura_dao` | Đào Hoa Phi Vũ | cánh đào bay quanh | hồng đào `#f2a9bc` | 20 | cánh tan khi chạm đất |
| `aura_lua` | Tam Muội Chân Hỏa | lửa nhỏ bốc dưới chân | cam đỏ | 18 | không cao quá đầu gối |
| `aura_batquai` | Bát Quái Trận | trận bát quái xoay dưới chân | vàng đất | — (mặt phẳng) | xoay 1 vòng / 12 s |
| `aura_set` | Cửu Thiên Lôi Quang | tia sét tím nhỏ lách tách quanh thân | tím `#9a7cff` | 6 tia | **không tia nào ra ngoài 1 m quanh thân**, không chĩa về người khác; tần số chớp ≤ 2 / s (`TN-05`) |
| `aura_tuyet` | Hàn Tuyết Phiêu | tuyết bay lả tả | trắng lam | 24 | — |
| `aura_sen` | Bộ Bộ Sinh Liên | sen vàng nở dưới mỗi bước | vàng ấm | — | **chỉ trao** (tầng 9 Cửu phẩm), không bán (phần 3 §2.5) |

### 2.2 Vệt bước

| id | Tên | Hình | Tan trong | Ràng buộc |
|---|---|---|---|---|
| `trail_may` | Đằng Vân Bộ | mây trắng cuộn | 1,2 s | — |
| `trail_sen` | Liên Hoa Bộ | cánh sen hồng rơi (không phải sen nở) | 1,5 s | khác hẳn `aura_sen` |
| `trail_lua` | Hỏa Vân Bộ | đốm lửa bám gót | 0,8 s | — |
| `trail_bang` | Băng Phách Bộ | tinh thể băng lấp lánh | 1 s | lấp lánh ≤ 2 / s |
| `trail_sao` | Tinh Hà Bộ | bụi sao vàng | 1,5 s | — |

Mọi vệt bước **tắt** trong điện chính và Phong Đô.

### 2.3 Ngự vật

| id | Tên | Hình | Âm | Ràng buộc |
|---|---|---|---|---|
| `kiem` | Ngự Kiếm | kiếm nằm ngang dưới chân, lưỡi không sáng sắc | gió + kim ngân nhẹ | không hướng mũi kiếm vào người khác khi lướt gần |
| `may` | Cân Đẩu Vân | mây vàng cuộn | gió mềm | — |
| `ho_lo_bay` | Hồ Lô Phi Hành | hồ lô tím vàng to, đứng trên | gió + tiếng gỗ | — |
| `dai_sen` → `ha_diep_chu` | Hà Diệp Chu (thay Liên Hoa Đài) | lá sen xanh cong như thuyền, giọt nước rơi từ mép | nước | thay món bị bỏ (phần 3 §2.7) |
| `hac` | Tiên Hạc | hạc trắng sải cánh, người ngồi trên lưng | tiếng hạc xa | vỗ cánh chậm 0,6 / s |

### 2.4 Đồ sau lưng có hiệu ứng

| id | Hiệu ứng | Ràng buộc |
|---|---|---|
| `canh_phuong` | cánh lửa vỗ chậm, đốm tàn rơi | ≤ 0,5 lần vỗ / s khi đứng; thu khi vào điện chính |
| `canh_hac` | lông trắng mép mờ | như trên |
| `phap_luan` → `bat_quai_hoan` | vòng bát quái xoay sau lưng | bỏ nan bánh xe pháp luân; tâm vòng ngang giữa lưng |

## 3. Hiệu ứng nghi lễ và hoạt động

| Hoạt động | Hiệu ứng khi đang làm | Hiệu ứng khi thành | Khi thất bại |
|---|---|---|---|
| Kết phù | nét chu sa hiện theo bút | phù «khô mực», một vệt khói hương thẳng | nét nhòe, giấy trắng lại |
| Tĩnh tọa | vòng hào quang thở chậm theo nhịp; tạp niệm là chấm mờ trôi qua | một vòng tròn mực khép lại quanh người | chấm mờ tan, ngồi lại |
| Thái Cực | vệt tay mờ theo chiêu (màu hành) | vòng Thái Cực sáng dưới chân 1 s | — |
| Bái Đẩu | 7 điểm sao nối nét trên trời | Bắc Đẩu sáng rõ 3 s | — |
| Niệm Phật | — (tĩnh) | — | — |
| Quay Cửu phẩm | tháp gỗ quay, chuông nhỏ | tầng mới: cánh sen gỗ mở | — |
| Mạn-đà-la cát (chờ tham vấn) | cát màu rơi theo mẫu hư cấu | khi xóa: cát cuốn thành dòng chảy vào bình | — |
| Khoa cử | chữ mực hiện trên giấy thi | tên viết lên bảng vàng | giấy gấp lại |
| Phóng sinh | cá lượn vòng rồi bơi xa; chim bay vút | gợn nước, lông rơi | — |
| Sửa nhà (hóa sát) | đường khí mờ (mũi tên khói nhạt) chỉ dòng khí trong nhà | khí lặng, đèn nhà ấm hơn | — |
| Vạch mặt ĐMH | — | phù giả trên bàn thầy bói bay lả tả, màu nhạt dần | — |
| Âm Bài (dùng) | ánh tím xám rò từ thẻ, gia trì đậm lên nhưng nhịp thở lệch nửa nhịp | — | — |
| Trả nghiệp (cứu một người) | một giọt tím rời khỏi người chơi, thành giọt nước trong | — | — |
| Nại Hà | hơi thở hai người hiện thành hai dòng sương; khớp nhịp thì hai dòng quấn lại | sương tan một đoạn | — |
| Thiên Mệnh Bàn (máy chủ) | vết nứt lấp dần bằng ánh vàng | toàn bàn sáng | — |

## 4. Ngân sách theo nền tảng

| Nền tảng | Hạt tối đa toàn cảnh | Hạt / nhân vật (gần) | Nhân vật có hiệu ứng đầy đủ | Nhân vật xa |
|---|---|---|---|---|
| Web di động | 1.500 | 40 | 6 gần nhất | chỉ vòng chân tĩnh |
| Web máy tính | 4.000 | 60 | 12 | vòng chân + linh khí giảm 50 % |
| PC bản đầy đủ | 10.000 | 60 | 24 | đầy đủ trong 40 m |
| Chế độ giảm chuyển động | 0 hạt bay | — | — | vòng chân tĩnh |

## 5. Kiểm hiệu ứng

- [ ] Không hiệu ứng hướng vào người khác (V2).
- [ ] Nhấp nháy ≤ 3 / s, lấp lánh ≤ 2 / s (`TN-05`).
- [ ] Tắt / thu đúng trong điện chính, Phong Đô.
- [ ] Pháp quang không đặt sau đầu.
- [ ] Ngân sách §4 đo trên máy tầm trung.
