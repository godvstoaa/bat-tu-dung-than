# Manifest — kiến trúc từng công trình tiên phủ (làm lại theo nguyên mẫu thật)

Ngày: 2026-11-18. Lý do: người dùng chê bản vẽ và công trình «quá thô sơ, không lột tả được công trình, cấm làm ẩu»
(FEEDBACK_LOG 2026-11-18, lần 3).

## 1. Chẩn đoán

- Mọi nhà của 9 phủ sinh từ một hàm `archkit-style.styledBuilding`: hộp tường, hàng cửa sổ, rồi chụp mái cong / bằng / vòm.
- Bản vẽ (`draw-tienphu.mjs`) vẽ lại đúng cái hộp đó bằng hình chữ nhật, nên không có gian, cột, đấu củng, cấp mái, pishtaq…
- Kích thước khung nhiều nhà sai tỉ lệ so với thật, theo nghiên cứu (`docs/tienphu-nghiencuu/0*.md`). Ví dụ:
  - Ngân An Điện ghi 2 tầng, thật 1 tầng.
  - Thế Miếu bị xoay 90°.
  - Ubosot Thái đặt mặt tiền ở cạnh dài, thật vào ở đầu hồi.

## 2. Nghiên cứu (đã làm)

`docs/tienphu-nghiencuu/01…09-*.md`: 9 phong cách, ~150 công trình, 670 nguồn URL, 202 ảnh Commons. Mỗi công trình có:
- nguyên mẫu;
- số đo (gắn nhãn [Đo] / [Suy] / [Ảnh]);
- cấu trúc từ dưới lên;
- mặt bằng;
- cấu kiện nhận diện;
- vật liệu và màu;
- đề xuất khung game.

**Thẩm tra của tôi:**
- Kiểm chéo số Taj Mahal với Wikipedia «Origins and architecture of the Taj Mahal»: thân 56,9 m, cao 67,97 m, minaret 43,02 m, Đại Môn 41,2 × 34 × 23,07 m, Masjid 56,6 × 23,38 m. Khớp với file 09.
- Đọc phần chung và đề xuất của file 01 (Trung Hoa). Quy tắc tỉ lệ có trích nguyên văn 《工程做法》.

**Giới hạn:**
- Hạn mức tìm kiếm web hết giữa chừng.
- Nhiều trang Trung, Việt, Thái lỗi DNS. Số từ các trang đó chỉ lấy qua đoạn trích tìm kiếm, đã ghi rõ trong file.

## 3. Phương pháp mới (thay bộ sinh chung)

1. **Mỗi phong cách một bộ dựng loại hình** trong `src/game/tienphu/arch/<phong-cách>.js`.
   - Trung Hoa: điện yết sơn / ngạnh sơn / quyển bằng / câu liên đáp; lâu 2 tầng; đình chóp vuông / lục giác / bát giác, đơn / trùng diêm; tháp lầu các.
   - Các phong cách khác tương tự, theo nghiên cứu.
2. **Mỗi công trình một đặc tả** trong `src/game/tienphu/arch/spec-<phong-cách>.js`.
   - Gồm: loại hình, số gian và bề rộng từng gian, cao cột, loại mái, cử giá, nền, nguyệt đài, màu ngói, số linh vật…
   - Số lấy từ nghiên cứu, ghi id nguồn.
3. **Bản vẽ chiếu từ chính mô hình 3D** (`tools/banve.html` + `scripts/banve.mjs`): camera trực giao, nét cạnh, ghi kích thước.
   - Mỗi công trình có: mặt đứng chính, mặt đứng bên, mặt bằng cắt ở cao 1,5 m, mặt cắt ngang.
   - Bản vẽ và công trình trong game là một, không vẽ tay riêng.
4. **Ghép vào phủ:** khung trong `siteplans.js` sửa theo kích thước đề xuất. Chạy lại `check-siteplans`, rồi các probe va chạm.

## 4. Quy tắc có số — Trung Hoa (Cung Vương phủ, hệ số k = 1,5)

| Quy tắc | Số | Nguồn (file 01) |
|---|---|---|
| Số gian | luôn lẻ (3 / 5 / 7). Gian giữa rộng nhất, hai bên giảm dần (vd 7 gian: 5,3 / 6,6 / 7,9 / 9,2 / 7,9 / 6,6 / 5,3 m) | §3, sai lầm 8 |
| Cao cột tiểu thức | 0,8 × rộng gian giữa; đường kính = 0,07 × rộng gian giữa | §3a |
| Mái vươn | 0,3 × cao cột (tiểu thức); 21 dk + độ vươn đấu củng (đại thức, dk 0,08 × k) | §3a, 3b |
| Cử giá (dốc từng bước mái) | hiên 0,5 → kim 0,7 → nóc 0,9, cho mặt mái lõm. Góc mái chỉ nâng nhẹ (≤ 0,6 m × k) | §3c, sai lầm 2 |
| Chiều cao mái | ≈ 0,9 × chiều cao thân. Mái chiếm khoảng nửa chiều cao nhìn thấy | main §8 |
| Nền | cao 1/5 cao cột (tiểu thức); chính điện 2,4 m + nguyệt đài 1,8 m. Nền vươn = 0,8 × mái vươn | §3a, main |
| Cấp mái | yết sơn cho chính điện và trai quan trọng; ngạnh sơn cho đường, hiên, nhà phụ; quyển bằng cho nhà sinh hoạt, vườn. Không dùng vũ điện, không ngói vàng toàn mái | §2, §3d |
| Màu ngói | trục giữa lưu ly xanh `#3E7B4F`; trục Đông / Tây và nhà phụ xám `#5F6467` | §2, §4 |
| Mặt tiền | khung cột đỏ `#9E2A22`, mỗi gian 4–6 cánh cửa bức bàn mắt cáo. Tường gạch xám `#7E8183` chỉ ở hồi và mặt hậu | sai lầm 3 |
| Dưới mái | đấu củng (đại thức) hoặc xà (tiểu thức), thải họa toàn tử xanh lam `#2B5C8A` / xanh lục `#2E7D5B` / vàng `#C8A042` | §4 |
| Bờ nóc | vẫn thú hai đầu. Hàng linh vật: 7 con (chính điện), 5 con (nhà khác) | sai lầm 10 |

**Cấu kiện tối thiểu trên mô hình và bản vẽ:**
- nền đá có viền và bậc;
- lưới cột;
- cửa bức bàn theo gian;
- xà và thải họa;
- đấu củng (nếu đại thức);
- mái lõm có mép ngói ống;
- bờ nóc, vẫn thú;
- linh vật;
- tường hồi (ngạnh sơn), hoặc tam giác hồi thụt vào có sơn hoa (yết sơn).

## 5. Ngân sách

- **Tam giác một nhà:** điện lớn ≤ 60 k, nhà phụ ≤ 25 k, đình ≤ 15 k, lầu 10 tầng ≤ 250 k. Đấu củng, ngói ống, linh vật dùng InstancedMesh.
- **Draw call một phủ** (sau gộp vật liệu): không tăng quá 30 % so với hiện tại (`perf.mjs`: 150–216).
- **fps** không thấp hơn mức đo 2026-11-18 (37–43, headless d3d11) quá 15 %.

## 6. Checklist kiểm

- [ ] Mỗi công trình có tờ bản vẽ: mặt đứng chính, mặt đứng bên, mặt bằng, mặt cắt; có ghi kích thước, nguyên mẫu, nguồn.
- [ ] Bảng đối chiếu: bản vẽ cạnh ảnh nguyên mẫu (Commons) cho công trình chính mỗi phủ.
- [ ] Đủ cấu kiện tối thiểu §4 (và phần tương ứng của 8 phong cách còn lại) — kiểm bằng mắt từng tờ.
- [ ] Số gian, kích thước, cao nóc khớp đặc tả. Script so số đo hộp bao mô hình với đặc tả (sai ≤ 3 %).
- [ ] `check-siteplans` đạt sau khi đổi khung. Các probe va chạm đạt như trước.
- [ ] Ngân sách §5.

## 6b. Kết quả (2026-11-18/19)

**Dựng:**
- 9 phong cách, 155 công trình: 146 nhà / đình + 9 lầu.
- Bộ dựng theo loại hình nằm ở `src/game/tienphu/arch/`:
  - Trung Hoa: `cn.js`; Nhật: `jp*.js`; Tây Tạng: `tb*.js`; Gothic: `go-*.js`; Art Deco: `ad-*.js`.
  - Tân cổ điển: `fr-*.js`; Huế: `vn-*.js`; Thái: `th-*.js`; Mughal: `mg-*.js`.
- Đặc tả từng công trình ghi nguyên mẫu, số đo và tham chiếu mục nghiên cứu (trường `src`).
- 8 phong cách sau Trung Hoa do 8 luồng dựng song song, cùng một đề bài (`docs/tienphu-nghiencuu/_BRIEF-DUNG.md`).
  Tôi xem lại tờ chính và tờ lầu của từng phong cách, rồi ảnh trong game.

**Bản vẽ:**
- 155 tờ `docs/tienphu-banve/NN-*/ct-*.png`, chiếu trực giao từ chính mô hình.
- Mỗi tờ có: phối cảnh, mặt đứng chính, mặt đứng bên, mặt bằng cắt ở 1,5 m (tô đen phần cắt bằng stencil), mặt cắt.
- Có kích thước, thước tỉ lệ, khung tên (nguyên mẫu, căn cứ).
- Tổng mặt bằng 9 phủ vẽ lại (`00-tong-mat-bang.svg`).

**Ghép vào game:**
- `plan.archFit` lấy bảng chiếm đất và mặt đi được (`arch/footprints.gen.js`, sinh bằng `scripts/arch-gen.mjs`).
- `estate3d` dựng nhà / đình / vỏ lầu bằng bộ mới. Lầu: vách chung chỉ hiện từ trong, vỏ ngoài theo nguyên mẫu.
- Lầu 10 tầng: áp bản ghi đè n / a / thềm của từng phong cách vào `styles.js`.
- Tổng mặt bằng sửa theo khung mới và theo vị trí thật:
  - Huế: Tả / Hữu Vu đổi bên, Thế Miếu Tây Nam, Hiển Lâm Các trước Thế Miếu, Thái Miếu Đông Nam, Diên Thọ / Trường Sanh phía Tây, Quốc Sử Quán ngoài thành.
  - Mughal: dàn lại theo thứ tự Taj Mahal.
  - Gothic: hậu cung nhà nguyện quay Đông.

**Đo:**

| Hạng mục | Kết quả | Mục tiêu |
|---|---|---|
| `check-siteplans` | 9/9 sạch, khác nhau | đạt |
| test tiên phủ | 19/19 | đạt |
| test estate / heaven / mansion | 10 / 4 / 8 đạt | đạt |
| `probe-gates` | 29/29 | đạt |
| `probe-tienphu` lọt lớn nhất | 1,92 % (Trung Hoa 2,98 % → 1,27 % sau khi đặt cột ban công lầu trùng cột va chạm) | ≤ 2 % |
| `probe-npc` | xuyên 0 / 1.720 mẫu | 0 |
| `probe-props` | 7.822 / 7.831 (99,89 %): 9 món nội thất lọt ở Tây Tạng (7) và Art Deco (2) | 100 % — **chưa đạt** |
| fps (đo lại sau khi nạp) | Trung Hoa 39,5 (trước tối ưu gân ngói 30,5) · Tân cổ điển 40 · Mughal 37 | ≥ 32 (−15 % so với 37,5) |

**Tam giác** (lớn nhất / tổng mỗi phủ, chưa kể lầu):

| Phủ | Lớn nhất | Tổng |
|---|---|---|
| Trung Hoa | 100 k | 681 k |
| Nhật | 59 k | 368 k |
| Tây Tạng | 72 k | 309 k |
| Gothic | 66 k | 260 k |
| Art Deco | 25 k | 91 k |
| Tân cổ điển | 98 k | 496 k |
| Huế | 48 k | 442 k |
| Thái | 63 k | 336 k |
| Mughal | 98 k | 564 k |

**Chưa đạt / chưa làm:**
- 9 món nội thất đi vào được (probe-props).
- Lầu: tầng 5 m theo khung game, thay vì cao như nguyên mẫu. Nhật, Tây Tạng: mặt bằng vuông thay chữ nhật. Gothic: 8 cạnh thay 10.
- Tượng, phù điêu (Versailles, Thái, Mughal) còn là khối cách điệu. Cột "obelisk" trắng trước nhà ở các phủ phương Tây là tượng cũ của plan, chưa thay.
- Phủ Tân cổ điển lúc 10–11 giờ bị cháy sáng (đá trắng).
- Từng phong cách còn mục «Chưa làm» riêng, ghi trong trường `src` của đặc tả: rãnh nước Lưu Bôi Đình, vườn charbagh quanh lăng phụ, đình bai sema quanh Ubosot…
- Chưa commit, chưa deploy.

## 7. Goal

- **G-KT1:** Trung Hoa xong trọn (21 công trình + lầu), có bản vẽ và ảnh so nguyên mẫu. Báo người dùng duyệt hướng làm.
- **G-KT2:** 8 phong cách còn lại theo cùng phương pháp. Mỗi phong cách viết thêm mục quy tắc có số vào §4 trước khi dựng.
- **G-KT3:** ghép vào phủ, đo va chạm, fps.
