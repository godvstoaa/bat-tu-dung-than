# Thủy môn tường Ngoại Thành — manifest

Đợt người dùng chọn «Thủy môn», 2026-11-20. Tiếp theo [CONG-TRINH-LAM-LAI-MANIFEST.md](CONG-TRINH-LAM-LAI-MANIFEST.md) mục 7.

## 0. Hiện trạng đo được

Tường Ngoại Thành cao 34 m có 3 chỗ sông xuyên qua (`waterways.waterGates`):

| Thủy môn | Toạ độ | Mặt nước dọc tường |
|---|---|---|
| Huyền Hà vào | (−1800, 1206) | 68,9 m |
| Huyền Hà ra | (1736, 1269) | 63,1 m |
| Nam Khê vào | (420, 2125) | 23,1 m |

Bản cũ (`cityblocks3d.outerWall`) dựng các khúc tường «ướt» (đáy dưới −1,5 m) như một **thân tường đặc treo từ y = 1, ngang qua mặt sông**:

- không có vòm, trụ, viền đá hay lầu;
- thuyền chui dưới một tấm gạch phẳng;
- va chạm thuyền chỉ có tĩnh không 7 m, không có trụ.

Ảnh: `output/thuymon/before/{m0,m1,nk}_{out,side}.png`.

Hàm `cityblocks3d.waterGate` (hộp, nửa xuyến, `AK.gateHouse`) chỉ dùng cho kênh xuyên cổng ở vành `A ≤ 500` cũ. Bản đồ v4 không còn gọi tới nó.

## 1. Nghiên cứu (nguồn đã xem)

- **Bàn Môn, Tô Châu** (thủy môn kép, Nguyên 1351) — [Baidu Baike](https://baike.baidu.com/en/item/Panmen/663925), [panmen.com.cn](https://en.panmen.com.cn/About/1.html):
  - hai lớp cửa cách 4,6 m, sâu 24,5 m;
  - cửa ngoài có vòm trên trụ đá vuông, vòm vồng 2,75 m, **có rãnh cửa áp quan**;
  - vòm trong lớn nhất cao 9,7 m, rộng 9,3 m, sâu 6 m.
- **Đông Thủy Quan, Nam Kinh** (Minh Hồng Vũ) — [Baidu Baike](https://baike.baidu.com/en/item/East%20Water%20Gate/70964):
  - 33 vòm xếp **3 tầng × 11 vòm**, gạch đá;
  - tầng dưới cho nước qua, giữa có **lưới sắt**, nước qua được mà thuyền giặc không qua;
  - 2 tầng trên là **động tàng binh**, chứa quân và đồ.
- **Đông Thành Thủy Quan, Huế** — [anhang.vn](https://anhang.vn/di-an/dong-thanh-thuy-quan-cua-ngo-tho-mong-cua-kinh-thanh-hue.html), [archives.org.vn](https://www.archives.org.vn/gioi-thieu-tai-lieu-nghiep-vu/he-thong-phong-thu-dong-thanh-thuy-quan-thoi-nguyen.htm):
  - cống vòm Ø 8,4 m, 6 lớp vòm đá;
  - cửa áp quan sập xuống / nâng lên cho ghe qua và điều tiết nước;
  - lan can trên có pháo môn.
- **Ràng buộc trong game**:
  - `bridges.waterGates`: tĩnh không 7 m, thuyền buồm cột 12 m không qua;
  - đò và thuyền hoa (cao 4,2 m) phải qua được.

## 2. Quy tắc (số đo)

- **Nhịp** (`bridges.waterGateBays`, dùng chung cho hình và va chạm):
  - số vòm lẻ, trụ 2,0 m, nhịp không quá 9,3 m (theo vòm Bàn Môn);
  - mặt nước 68,9 m chia 7 vòm × 8,1 m; 63,1 m chia 7 × 7,3 m; 23,1 m chia 3 × 6,4 m;
  - đỉnh vòm cao 8,4 m trên mặt nước: tĩnh không 7 m cộng vành đá.
- **Thân**:
  - gạch đứng, dày từ X −4,2 đến +3,5 (bằng mặt đi trên tường);
  - dài bằng các khúc tường 24 m phủ mặt nước, cộng 12 m bờ mỗi bên;
  - đáy ở mặt nước −4.
- **3 tầng vòm** theo Đông Thủy Quan:
  - tầng 1: vòm nước thông suốt;
  - tầng 2: vòm lõm sâu 2,6 m, rộng min(6, 0,75 s), cao 6,5 m, bắt đầu từ đỉnh vòm nước +2,8;
  - tầng 3: vòm lõm rộng min(4,6, 0,55 s), cao 5,5 m, trên tầng 2 9,4 m;
  - vách hậu động gạch sẫm, để đọc được chiều sâu;
  - lỗ châu mai 0,8 × 1,8 m, mỗi khoảng 4,2 m, dưới mặt đi 4,6 m;
  - làm cả hai mặt (ngoài thành và trong thành).
- **Đá**:
  - viền vòm đá trắng rộng 0,65 m, nhô 0,3 m, kèm đá khoá;
  - dải đá chân từ mực nước −4 đến +1,2 trên mặt trụ;
  - gờ đá ngang trên đỉnh vòm +1,5 và dưới mặt đi.
- **Trụ**: mũi rẽ nước ngũ giác dài 3 m ở cả hai phía, cao tới mặt nước +3,2, có nắp dốc.
- **Áp quan**:
  - lưới sắt kéo lên: thanh đứng Ø 0,12 cách 0,32, đầu nhọn, 2 thanh ngang;
  - đáy lưới cách đỉnh vòm 1,9 m;
  - rãnh dọc tối hai bên vòm, nằm giữa bề dày tường.
- **Lầu thủy quan** trên đỉnh: 5 gian (3 gian ở Nam Khê), yết sơn ngói xám, đấu củng; bộ `cn.js`, vật liệu lặp theo mét.
- **Va chạm thuyền** (`bridges.waterGatePiers`): mỗi trụ 5 vòng tròn dọc bề dày tường (thân và mũi), góp vào `bridges.piers()`. Thuyền va trụ thì nảy, như trụ cầu.
- **Ngân sách**: mỗi thủy môn ≤ 50k tam giác, ≤ 20 lưới.

## 3. Kết quả

- Hình (node, `scripts/tmp/wgtest.mjs`): sông chính 44,2k tam giác, 17 lưới; Nam Khê 27,2k, 17 lưới.
- Ảnh trước/sau cùng góc: `output/thuymon/so-sanh-thuy-mon.jpg` (từ `before/` và `after/`).
- A/B (`FLAG=__noWaterGate node scripts/bietphu-perf.mjs`, 1280 × 720):

  | Góc nhìn | Bản cũ | Bản mới |
  |---|---|---|
  | m0 ngoài | 37 fps · 1815 lệnh vẽ · 3,13 tr tg | 35,3 fps · 1849 lệnh vẽ · 3,22 tr tg |
  | m1 ngoài | 38,3 · 1775 · 3,07 | 38,3 · 1809 · 3,16 |
  | Nam Khê | 38,8 · 1753 · 3,16 | 37,8 · 1770 · 3,18 |

  Lệnh vẽ +17…34, tam giác +0,02…0,09 triệu, FPS lệch trong mức nhiễu.

## 4. Chưa đạt / chưa làm

- Mặt thủy môn đứng thẳng, còn tường hai bên có mặt ngoài dốc. Chỗ nối lộ đầu khúc tường xiên (một vệt sáng dọc ở Nam Khê).
- Vòm vuông góc với tường, nhưng sông Huyền Hà cắt tường xiên (68,9 / 63,3). Lòng vòm không chạy theo dòng.
- Không có bậc chi tiết vừa / xa riêng: lưới sắt và lầu vẫn vẽ ở xa. Không thấy rõ khi đo, nhưng là chi phí thừa.
- Động tàng binh chỉ là hốc lõm 2,6 m, chưa có lối vào và không đi vào được.
- Lầu thủy quan không có va chạm. Đi trên mặt tường sẽ xuyên qua lầu, giống lầu canh cũ.
- Chưa có hơi nước / bọt quanh mũi trụ, chưa có rêu ở mực nước.

## 5. Goal tiếp

1. Bậc xa: thủy môn ngoài 400 m bỏ lưới sắt và lầu. Đo được: lệnh vẽ ngoài cổng giảm ≥ 10.
2. Vòm xiên theo dòng sông. Đo được: trục lòng vòm lệch dòng ≤ 5°.
