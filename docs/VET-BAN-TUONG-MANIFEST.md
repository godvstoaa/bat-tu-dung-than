# Vệt bẩn mặt tường Ngoại Thành — manifest

Đợt «Vệt bẩn mặt tường», 2026-11-20. Tiếp theo mục 7 «Chưa đạt» của [CONG-TRINH-LAM-LAI-MANIFEST.md](CONG-TRINH-LAM-LAI-MANIFEST.md).

## 0. Hiện trạng

Tường bát giác cao 34 m, dài khoảng 8 × 1.760 m. Thân, chân tường và mũ tường đều dùng gạch / đá lặp theo mét, một màu, không phong hoá. Từ xa cả mặt tường là một tấm đều, đọc như tường giả.

Ảnh: `output/vetban/before/{kan,li,zhen}_{out,close,in}.png`. Mặt Bắc (Khảm), Nam (Ly) và Đông (Chấn); mỗi mặt chụp từ ngoài, sát chân tường và từ trong thành.

## 1. Nghiên cứu

- **Tường Tây An** ([Wikipedia](https://en.wikipedia.org/wiki/Fortifications_of_Xi'an), [Baidu Baike](https://baike.baidu.com/en/item/Xi%E2%80%99an%20City%20Wall%20and%20Beilin%20Museum%20Historical%20and%20Cultural%20Scenic%20Area/944901)):
  - mỗi 40–60 m có một máng nước;
  - máng đặt ở mặt trong tường, miệng máng đá trên đỉnh;
  - mặt đi trên đỉnh dốc vào trong;
  - máng làm năm 1781, khi Tất Nguyên tu bổ tường.
- **Phong hoá gạch đá** ([InterNACHI](https://forum.nachi.org/t/efflorescence-patterns-to-diagnose-water-intrusion/38216), [BrikBase](https://www.brikbase.org/sites/default/files/Vol-31-N2-Historic-Stone-Masonry.pdf), [IDS](https://www.ids-dmv.com/masonry/insidious-damage-in-a-historic-brick-wall/), [AAA brick cleaning](https://aaabrickcleaning.com.au/types-of-stains-on-bricks-and-brickwork/)):
  - vệt muối trắng hình giọt chảy dưới mũ tường và chỗ vá;
  - vệt sẫm dọc nơi nước tràn;
  - ẩm từ đất ngấm lên tạo dải sẫm và muối ở chân tường;
  - tảo và rêu ở chân tường và mặt khuất nắng (hướng Bắc ở bán cầu Bắc);
  - mảng vá gạch mới khác màu.

## 2. Quy tắc (số đo)

Làm bằng shader trên vật liệu riêng của tường, theo toạ độ thế giới. Không thêm decal hay lưới, không nặng thêm texture. Gọi s là toạ độ dọc mặt tường, tính từ pháp tuyến: s = toạ độ xz chiếu lên tiếp tuyến.

1. **Vệt nước dưới mũ tường**:
   - mỗi cột 0,45 m có khoảng 45 % mang vệt;
   - dài 3–16 m tính từ đỉnh, mờ dần xuống dưới;
   - làm tối tối đa 32 %;
   - mép vệt mềm.
2. **Vệt muối trắng** (mặt ngoài): mỗi cột 1,1 m có 12 % mang vệt, dài 1–4 m dưới mũ tường, làm sáng 18 %.
3. **Máng thoát nước** (mặt trong):
   - mỗi 48 m (Tây An 40–60 m), miệng máng đá 0,5 × 0,35 m, nhô 1,4 m, dưới mặt đi 0,6 m;
   - vệt sẫm dưới máng rộng 1,4 m, chạy suốt xuống chân tường, làm tối 50 %.
4. **Ẩm chân tường**:
   - dải 2,8 m (dao động ±0,75 m theo nhiễu);
   - pha màu rêu (0,62; 0,72; 0,50), mạnh 75 %;
   - mặt hướng Bắc (pháp tuyến z < 0) mạnh gấp 1,35 lần;
   - mép trên của dải có chấm muối trắng.
5. **Mảng vá**: lưới 3,2 × 1,6 m, 10 % ô mang màu khác (+9 % hoặc −10 %).
6. **Loang lớn**: nhiễu tần thấp (0,08 / m ngang, 0,12 / m dọc), làm tối tối đa 18 %.
7. **Chỉ áp lên mặt đứng**: hệ số mờ theo độ dốc pháp tuyến (|n.y| ≥ 0,9 thì không vẽ).

Ngân sách:
- Thêm khoảng 25 phép toán ALU mỗi điểm ảnh trên vật liệu tường, không thêm lần lấy mẫu texture.
- Thêm 1 lệnh vẽ (máng thoát nước, vẽ nhân bản khoảng 290 cái).
- FPS lệch trong mức nhiễu.

## 3. Checklist

- [x] Ảnh sau cùng 9 góc (`output/vetban/after/`); ghép `output/vetban/so-sanh-vet-ban.jpg`.
- [x] Nhìn xa: mặt tường có nhịp sáng tối, không còn là một tấm đều.
- [x] Nhìn gần (`kan_close`): không lộ ô vuông. Chưa kiểm nhấp nháy khi di chuyển.
- [x] A/B lệnh vẽ và FPS (`FLAG=__noWallWeather`).

## 4. Kết quả (2026-11-20)

Vòng 1 quá nhạt khi nhìn xa. Vòng 2 đã chỉnh:
- vệt dưới mũ tường: cột 0,6 m, 58 %, dài 4–22 m, làm tối 42 %;
- thêm vệt dưới khe răng cưa: bước 3,1 m, 65 %, dài 6–14 m;
- dải ẩm chân tường lên 3,6 m, rêu (0,52; 0,62; 0,40) mạnh 85 %;
- loang thêm một tầng nhiễu 0,31 / m.

Máng thoát nước: khoảng 290 miệng máng đá ở mặt trong, 1 lệnh vẽ nhân bản, đặt khớp toạ độ vệt sẫm của shader.

| Góc | Bản cũ | Bản mới |
|---|---|---|
| Mặt Bắc, ngoài | 21,5 fps · 1690 lệnh vẽ · 2,98 tr tg | 23,3 fps · 1691 lệnh vẽ · 2,99 tr tg |
| Mặt Nam, ngoài | 17,8 · 1372 · 2,75 | 19,8 · 1373 · 2,76 |

Máy đang có tải nên FPS thấp ở cả hai bản. Không thấy chi phí đo được.

## 5. Chưa đạt / chưa làm

- Rêu ở chân bệ đá còn nhạt: bệ đá màu sáng nên pha màu nhân lên vẫn nhạt. Chưa có mảng rêu xanh đậm hay cỏ mọc ở khe.
- Vệt chỉ là đổi màu, chưa đổi độ nhám (vệt ướt chưa bóng hơn) và chưa đổi pháp tuyến.
- Đỉnh vệt lấy theo cao độ tuyệt đối (mặt đi 32,5). Đoạn tường đặt trên đất cao hơn thì vệt bắt đầu thấp hơn mũ tường một chút.
- Lầu canh, giác lâu và lầu cổng không phong hoá. Răng cưa (nhân bản) cũng chưa.
- Chưa xem ảnh lúc chiều tối và ban đêm.

