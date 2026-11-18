# 07 — Cung đình Huế triều Nguyễn: nghiên cứu từng công trình cho tiên phủ «Cung Đình Huế»

Nguyên mẫu: Hoàng Thành và Tử Cấm Thành Huế (thế kỷ 19 – đầu 20).
Danh sách gốc: `list-7-hue.txt`. Khung hiện tại lấy từ `src/game/tienphu/siteplans.js` (mục `hue`) và `styles.js`.

Quy ước trong file:
- **[đo]** = số đo có trong nguồn (ghi nguồn ở cuối mục).
- **[suy]** = số suy ra từ số đo khác (ghi cách tính).
- **[ảnh]** = nhận xét từ ảnh tham chiếu, chưa có số đo.
- **[game]** = đề xuất cho game, không phải số thật.
- Đơn vị cổ: 1 thước ≈ 0,424–0,428 m. Lê Vĩnh An & Nguyễn Thị Kim Nhung (Tạp chí Kiến trúc 08-2023) dùng mức này. File này lấy 0,425 m.
  Riêng sách Cố đô Huế (Thái Văn Kiểm) đổi 5 trượng 3 thước 2 tấc = 21,24 m, tức 0,40 m/thước.

Giới hạn khi làm: hạn mức WebSearch của lượt đã hết giữa chừng. Một số trang `.vn` (hueworldheritage.org.vn, tapchisonghuong.com.vn,
archives.org.vn, baotanglichsu.vn, codohue.vn, scholar.dlu.edu.vn) không mở được (lỗi DNS). Các số chỉ thấy trong trích đoạn kết quả
tìm kiếm thì ghi rõ là «trích đoạn tìm kiếm».

---

# PHẦN CHUNG CỦA PHONG CÁCH

## C1. Quy tắc tỉ lệ

### C1.1 Hệ gian (bề ngang) — số đo điện Thái Hòa
Nguồn: Lê Vĩnh An & Nguyễn Thị Kim Nhung, «Kết quả nghiên cứu phương pháp thiết kế kiến trúc Cung điện triều Nguyễn», Tạp chí Kiến trúc 08-2023.

| Hạng mục | Thước | Mét (×0,425) | Loại |
|---|---|---|---|
| Gian giữa (tim cột – tim cột) | 13 | 5,53 | [đo] |
| Gian kế bên | 12,3 | 5,23 | [đo] |
| Gian kế tiếp | 9,1 | 3,87 | [đo] |
| Gian ngoài cùng / chái | 8,5 | 3,61 | [đo] |
| Tổng tim trục 1–10 (mặt tiền) | 97,4 | 41,4 | [đo] |
| Toàn nền mặt tiền | 101,4 | 43,1 | [đo] |
| Các nhịp chiều sâu | 13 · 12 · 9,3 · 8,4 | 5,53 · 5,10 · 3,95 · 3,57 | [đo] |
| Tổng tim trục chiều sâu | 69 | 29,3 | [đo] |
| Toàn nền chiều sâu | 72,2 | 30,7 | [đo] |
| Mốc chuẩn: sàn → đầu cột / xà | 15,2 | 6,46 | [đo] |

Kiểm chéo: 43,1 × 30,7 m khớp số phổ biến 44 × 30,5 m. Vậy hệ số 0,425 m/thước đáng tin.

[suy] Thứ tự 9 nhịp mặt tiền khớp tổng 97,4:
8,5 · 9,1 · 12,3 · 12,3 · **13** · 12,3 · 12,3 · 9,1 · 8,5 thước (13 + 2×(12,3+12,3+9,1+8,5) = 97,4).
Bài báo không in thứ tự này. Tôi suy ra từ tổng.

Quy tắc rút ra:
1. Số gian luôn lẻ. Gian giữa rộng nhất.
2. Hai gian kề giữa gần bằng gian giữa (~95%).
3. Gian ngoài và chái hẹp hẳn (~65–70% gian giữa).
4. Nhịp trung bình của nhà lớn khoảng 4,2–4,6 m [suy]:
   - Thế Miếu: 54,6 m / 13 nhịp = 4,2 m.
   - Thái Miếu: 71 m / 17 nhịp = 4,2 m.
   - Thái Hòa: 41,4 m / 9 nhịp = 4,6 m.
   - Diên Thọ: 34,7 m / 9 nhịp = 3,86 m.
5. Gian chùa Huế (nhà rường) rộng 2,4–4,2 m [đo, khảo sát 22 chùa, Thích Trung Định].

### C1.2 Chiều cao
- Phương pháp thời Gia Long [đo, Lê Vĩnh An 2023]:
  - Cao tới diềm L2 = bề rộng gian A.
  - Cao tới đòn nóc L = 2 × L2.
- Phương pháp thời Minh Mạng [đo, cùng nguồn]:
  - Chiều cao định theo **thứ bậc** công trình trong Hoàng Thành, không theo mặt bằng.
  - Độ dốc mái đặt bằng thước «Nách».
  - Cao diềm phụ thuộc số gian mặt tiền.
- Quy chế cao độ: không công trình nào trong Hoàng Thành được cao hơn Hiển Lâm Các (17 m) [đo, Wikipedia «Hiển Lâm các»].
- Nhà Huế **thấp và bè**:
  - Thái Hòa cao 11,8 m trên mặt tiền 44 m: H/W = 0,27 [đo].
  - Thái Hòa Bắc Kinh cao 26,92 m trên 63,39 m: H/W = 0,42, chưa kể bệ 8,13 m [đo, Wikipedia «Điện Thái Hòa (Bắc Kinh)»].
- Mái chiếm khoảng 1/2 chiều cao nhà ở chùa Huế. Ở miền Bắc mái chiếm khoảng 2/3 [đo, khảo sát 22 chùa].
- [suy] Thái Hòa: 11,8 m − 6,46 m (mốc đầu cột) ≈ 5,3 m cho phần khung mái và mái, tức ~45% chiều cao.
- [suy] Nhà kép lớn: H ≈ 0,35–0,39 × chiều sâu:
  - Thái Hòa: 11,8 / 30,5 = 0,39.
  - Duyệt Thị Đường: 12 / 34,5 = 0,35.

### C1.3 Lầu nhiều tầng (căn cứ cho lầu 10 tầng)

| Công trình | Tầng | Cao | Cao/tầng | Mặt bằng | Loại |
|---|---|---|---|---|---|
| Hiển Lâm Các (1821–22) | 3 | 17 m (có nguồn ghi 13,6 m); 4 cột cái 13 m | ~5,7 m | 300 m²; 5 → 3 → 1 gian | [đo] |
| Phu Văn Lâu (1819, dựng lại 1905) | 2 | 11,67 m | ~5,8 m | nền vuông 12,24 m | [đo] |
| Thái Bình Lâu (1919–21) | 2 | 9,55 m | ~4,8 m | — | [đo] |
| Lầu Minh Viễn (1827, nền Kiến Trung) | 3 | 2 trượng 7 thước ≈ 11 m; nền 1 trượng 1 tấc (4–5 m); đỉnh ≈ 15 m | ~3,7 m | tầng dưới 3 gian 2 chái | [đo] |
| Lầu Ngũ Phụng (1833) | 2 | toàn Ngọ Môn < 15 m, có nguồn ghi > 17 m | — | lầu giữa 3 gian 2 chái | [đo] |
| Tháp Phước Duyên (1844) | 7 | 21,24 m | ~3 m | bát giác | [đo] |
| Điện Kiến Trung (bản phục hồi 2024) | 2 | ~14 m | ~7 m | 975 m² | [đo] |

### C1.4 Hình mái — số mặt mái dốc
Nguồn: Trương Ngọc Quỳnh Châu & Lê Vĩnh An, Tạp chí Kiến trúc 07-2022 [đo].
- Nhà kép «trùng thiềm điệp ốc», 2 nóc, 2 tầng mái: 12 mặt mái dốc.
- Nhà kép 3 nóc, 2 tầng mái (vd điện Càn Thành): 16 mặt mái dốc.
- Phương đình, 1 nóc, 2 tầng mái: 8 mặt mái dốc.
- Lầu / các: 8 hoặc 12 mặt tuỳ chiều cao.

### C1.5 Kết cấu
- Nhà kép «trùng thiềm điệp ốc» là nhà trước (tiền điện / tiền doanh) và nhà sau (chính điện / chính doanh) song song trên **một nền**.
  - Hai bộ mái riêng.
  - Nối nhau bằng **vì vỏ cua** (trần thừa lưu, trần cong).
  - Trên chỗ nối là **máng xối** thu nước.
  - Nguồn: Tạp chí Kiến trúc 2022; vietnamtourism.gov.vn.
- Vì kèo:
  - Nhà trước dùng **chồng rường – giả thủ** (chạm trổ).
  - Nhà sau dùng **kèo cánh ác** (đơn giản hơn).
  - Ví dụ: Thái Hòa [đo, vietnamtourism.gov.vn]. Tiền doanh Diên Thọ cũng chồng rường giả thủ.
- Đỡ mái chìa: hệ **con-xon (kẻ)**, xuyên, trến, kèo, đòn tay [đo, Wikipedia «Điện Cần Chánh»].
  Không có đấu củng chồng tầng như Trung Hoa.
- **Cổ diêm**:
  - Dải tường hoặc ván đứng chạy quanh bốn mặt, giữa mái hạ và mái thượng.
  - Chia ô hộc gắn pháp lam hoặc sành sứ theo lối «nhất thi nhất họa» (một ô thơ, một ô tranh) [đo].
- Cột:
  - Gỗ lim. Cũng dùng đinh, sến, táu.
  - Kê trên chân tảng đá Thanh.
  - Chân tảng Phu Văn Lâu cao 31 cm, hai cấp: dưới vuông, trên tròn.
- Phương đình 16 cột là ngữ pháp chuẩn của đình / tạ / lầu nhỏ [đo]:
  - Lưới 4 × 4 cột.
  - 4 cột cái ở giữa đỡ mái thượng.
  - 12 cột quân đỡ mái hạ.
  - Ví dụ: Phu Văn Lâu, Nghinh Lương Đình, Trường Du Tạ («một gian bốn chái»).

### C1.6 Nền
- Nền thấp, bó vỉa đá Thanh, lát gạch Bát Tràng:
  - Thế Miếu 0,94 m [đo].
  - Cần Chánh gần 1 m [đo].
  - Hưng Miếu 0,68 m [đo].
  - Diên Thọ 0,56 m [đo].
- Thái Hòa đặc biệt: nền điện cao 0,9–1 m trên sân Đại Triều Nghi; sân lại 2 cấp. Tổng 2,32–2,35 m trên mặt đất [đo].
- Bậc cấp số lẻ:
  - Thái Hòa: 9 bậc tầng sân dưới + 5 bậc nền điện.
  - Hiển Lâm Các: 9 bậc.
  - Ngọ Môn: 21 bậc × 22 cm.

## C2. Vật liệu và bảng màu chung

Mã hex là ước lượng [ảnh] cho game, không phải đo phổ màu.

| Bộ phận | Vật liệu thật | Hex đề xuất |
|---|---|---|
| Mái công trình của vua | ngói ống **hoàng lưu ly** (men vàng) | #D8A02A (sáng #F0C24B, tối #9C6E16) |
| Mái công trình phụ / quan | ngói ống **thanh lưu ly** (men xanh lam lục) | #2F7F6E |
| Mái nhà thường / nhà vỏ cua | ngói liệt, ngói âm dương không men | #A0583A |
| Cột, khung, cửa | gỗ lim **sơn son** | #8B1A1A |
| Chạm khắc, hoành phi, rồng mây | **thếp vàng** | #C8A040 |
| Cột phụ Thái Hòa (1839) | thếp bạc, vẽ tản vân | #B9B6AE |
| Bó vỉa, bậc, chân tảng | đá Thanh (đá vôi xanh xám) | #5F656B |
| Sàn sân | gạch Bát Tràng đỏ (38×38×3,5 cm ở Duyệt Thị Đường) | #B5643F |
| Sàn trong / nền điện | Bát Tràng tráng men vàng / lục | #D7B04A / #4E8A55 |
| Thân đài, tường bao | gạch vồ, vữa tam hợp | #8C8A82 |
| Pháp lam bờ nóc, cổ diêm | đồng tráng men | lam #2B5BA6 · lục #3D8C5C · vàng #E2B436 · trắng #F2EFE6 |
| Khảm sành sứ | mảnh bát đĩa men lam | #DCE6EE nền, #3A62A8 hoa |

Quy tắc màu mái:
- Nguyên tắc chung: mái vàng là công trình của vua và thờ vua; mái xanh là công trình phụ.
  - Ngọ Môn «một lầu vàng, tám lầu xanh» [đo].
  - Điện Văn Minh và Võ Hiển dùng thanh lưu ly [đo].
- Trường hợp riêng đã đo: Duyệt Thị Đường lợp thanh lưu ly [đo]. Trường Du Tạ dùng men xanh [đo].

## C3. Sai lầm phải tránh (xếp theo mức nặng)

1. **Mái một tầng.**
   - Điện Huế gần như luôn **hai tầng mái (chồng diêm)**.
   - Giữa hai tầng có dải cổ diêm ô hộc.
   - Một mái liền là sai.
2. **Nhà một khối hộp.**
   - Điện lớn là **nhà kép**: hai nhà song song chung nền, hai nóc.
   - Nhìn mặt hồi thấy hai mái chữ A cạnh nhau, nối bằng máng xối.
   - Mái nhà sau thường to hơn [ảnh].
3. **Mái cong vểnh kiểu Bắc Kinh / Hoa Nam.**
   - Mái Huế phẳng, dốc vừa, gần như thẳng [ảnh].
   - Chỉ đầu bờ quyết (bờ góc) đắp rồng / giao / phượng uốn lên.
   - Đường diềm mái gần như ngang.
4. **Đấu củng dày đặc dưới diềm.** Huế dùng kẻ (con-xon) và chồng rường. Không có tầng đấu củng.
5. **Tỉ lệ cao.**
   - Điện Huế thấp, bè: Thái Hòa H/W 0,27.
   - Dựng cao như Tử Cấm Thành Bắc Kinh là sai.
6. **Bệ đá trắng ba tầng kiểu Bắc Kinh.**
   - Huế nền thấp, bó đá Thanh xám.
   - Chỉ Thái Hòa có hai cấp sân.
7. **Tất cả mái màu xanh** (lỗi đang có trong `styles.js`: `roofCol: '#3e7d4f'`). Điện chính, miếu thờ vua, lầu vua phải màu vàng.
8. **Tường gạch kín mặt tiền.**
   - Mặt tiền điện là dãy **cửa bảng khoa** gỗ son thếp. Thái Hòa có 52 cánh ở 7 gian giữa [đo].
   - Có hiên cột chạy dọc.
   - Tường gạch chỉ ở hai đầu hồi và chái.
   - Chái Thái Hòa có cửa sổ tròn chữ Thọ đường kính ~1,4 m [đo].
9. **Số gian chẵn, gian đều nhau.** Luôn lẻ. Gian giữa rộng nhất (C1.1).
10. **Lầu bát giác.**
    - Bát giác ở Huế là **tháp Phật giáo xây gạch** (Phước Duyên).
    - Lầu / gác cung đình đều mặt bằng chữ nhật hoặc vuông, khung gỗ, có gian.
    - Lầu 10 tầng hiện là đa giác 8 cạnh (`tower.n: 8`): sai ngữ pháp.
11. **Đình bát giác ở vườn.** Đình, tạ cung đình Huế là **phương đình 16 cột** (vuông hoặc chữ nhật). Lầu bát giác 1960 trên đảo Bồng Lai là công trình tưởng niệm thời sau, không phải mẫu cung đình.

## C4. Nhận diện so với phong cách gần

| Đặc điểm | Huế (Nguyễn) | Trung Hoa (Minh–Thanh, Bắc Kinh) | Nhật |
|---|---|---|---|
| Khối nhà | nhà kép 2 nóc chung nền (trùng thiềm điệp ốc) | một khối, mái kép trên một nhà (trùng diêm vũ điện) | một khối; mái lớn, sâu |
| Tỉ lệ | thấp bè, H/W ~0,27 | cao, H/W ~0,42 + bệ 8 m | mái chiếm phần lớn chiều cao |
| Mái | 2 tầng; diềm thẳng; góc đắp rồng sành sứ | cong võng rõ; đầu góc vểnh | thẳng hoặc cong nhẹ; hiên rất sâu; không đắp sành sứ |
| Đỡ mái | kẻ, chồng rường giả thủ, vỏ cua | đấu củng dày | đấu củng (kumimono) gọn |
| Trang trí mái | pháp lam, khảm sành sứ; lưỡng long chầu nhật / hồ lô; ô thơ cổ diêm | tượng thú nối hàng trên bờ góc; si vẫn hai đầu nóc | onigawara, shachihoko |
| Màu | son, thếp vàng; vàng / xanh lưu ly | tường đỏ, mái vàng | gỗ mộc / son; tường trắng |
| Bệ | thấp, đá Thanh xám | đá trắng nhiều tầng | đá thấp |

---

# PHẦN TỪNG CÔNG TRÌNH

## main — Điện Thái Hòa

**1. Nguyên mẫu thật**
- Điện Thái Hòa (太和殿), Hoàng Thành Huế.
- Dựng năm 1805. Dời và dựng lại năm 1833, «giữ nguyên cấu trúc và kích thước» theo aseantraveller.
- Trùng tu xong 23/11/2024.

**2. Số đo**

| Hạng mục | Giá trị | Loại / nguồn |
|---|---|---|
| Dài (mặt tiền) | 44 m (101,4 thước = 43,1 m) | [đo] aseantraveller, saoviettravel; Lê Vĩnh An 2023 |
| Sâu | 30,5 m (72,2 thước = 30,7 m) | [đo] |
| Cao tới nóc | 11,8 m | [đo] |
| Diện tích | 1.360 m² (nguồn khác 1.440 m², có thể tính cả hiên) | [đo]; chọn 1.360 vì 44 × 30,5 ≈ 1.342 |
| Sàn → đầu cột (mốc chuẩn) | 15,2 thước ≈ 6,46 m | [đo] Lê Vĩnh An 2023 |
| Cao nền điện so với sân trên | 0,9 m (Wikipedia, Phan Thanh Hải 2021) / 1 m | [đo] |
| Cao nền so với mặt đất | 2,32–2,35 m | [đo] |
| Bậc | 9 cấp sân dưới (Long trì → Đan bệ) + 5 cấp nền điện; 3 hệ bậc đá Thanh trước và sau | [đo] |
| Số cột | 80 cột lim | [đo] |
| Gian | tiền điện 7 gian 2 chái đơn; chính điện 5 gian 2 chái kép | [đo] |
| Khoảng cột mặt tiền | 3,61 · 3,87 · 5,23 · 5,23 · 5,53 · … (C1.1) | [đo] / thứ tự [suy] |
| Cửa | 52 cánh cửa bảng khoa ở 7 gian giữa; 2 cửa sổ tròn chữ Thọ Ø ~1,4 m ở hai chái mặt tiền | [đo] Phan Thanh Hải 2021 |
| Đường kính cột | không tìm được | — |
| Sân Đại Triều Nghi | 1.640 m², 2 tầng (Đan bệ quan nhất–tam phẩm, Long trì tứ–cửu phẩm) | [đo] |

**3. Cấu trúc từ dưới lên**
- **Sân và nền**:
  - Sân Đại Triều Nghi 2 cấp, lát đá.
  - Nền điện bó đá Thanh, cao 0,9–1 m.
- **Thân**:
  - Lưới 80 cột lim.
  - Hai hàng cột giữa vẽ rồng mây thếp vàng.
  - Cột hai bên thếp bạc, vẽ tản vân (sửa năm 1839).
  - Mặt trước là dãy cửa bảng khoa. Hồi và chái xây gạch.
- **Đỡ mái**:
  - Nhà trước: vì chồng rường – giả thủ.
  - Nhà sau: vì kèo cánh ác.
  - Nối nhau bằng trần vỏ cua (thừa lưu) và máng xối.
- **Mái**:
  - Nhà kép, mỗi nhà mái 2 tầng (chồng diêm), tổng 12 mặt mái dốc.
  - Lợp ngói ống hoàng lưu ly.
  - Cổ diêm ô hộc giữa hai tầng mái.
- **Đỉnh**:
  - Bờ nóc ô hộc pháp lam: tiền điện 25 ô (12 ô thơ, 12 ô hình, 1 ô trung tâm màu vàng – hành Thổ).
  - Chính điện phối pháp lam với khảm sành sứ.
  - Giữa nóc: lưỡng long chầu nhật / hồ lô [ảnh].

**4. Mặt bằng**
- 9 nhịp mặt tiền, đối xứng; gian giữa 5,53 m.
- Chiều sâu chia nhà trước và nhà sau, nối bằng vỏ cua.
- Nội thất liền một không gian.
- Ngai vàng 3 tầng bệ gỗ son thếp, có bửu tán chạm 9 rồng, đặt ở gian giữa nhà sau.
- Lối vào: 3 hệ bậc mặt trước, 3 hệ mặt sau.

**5. Cấu kiện nhận diện (theo mức quan trọng)**
1. Hai tầng mái vàng rất bè, thấp, rộng gấp ~3,7 lần chiều cao.
2. Nhà kép: thấy 2 nóc khi nhìn chéo hoặc hồi.
3. Sân 2 cấp phía trước với hệ bậc giữa (dũng đạo).
4. Mặt tiền 7 gian cửa son thếp, 2 chái gạch có cửa sổ tròn.
5. Dải cổ diêm ô hộc thơ / hình giữa 2 mái.
6. Bờ nóc ô hộc pháp lam, giữa có hồ lô / mặt nhật, hai rồng chầu.
7. Bờ quyết góc đắp rồng.
8. Hàng cột son trong hiên.

**6. Vật liệu và màu**
- Mái: hoàng lưu ly #D8A02A.
- Cột, cửa: son #8B1A1A, thếp #C8A040.
- Bó nền: đá Thanh #5F656B.
- Tường chái: vữa vôi [ảnh] #E2D6B8.
- Pháp lam: theo C2.

**7. Trang trí**
- Thơ văn:
  - 47 ô hộc thơ trên pháp lam ở mái trước và sau.
  - 248 ô thơ chạm, sơn son thếp vàng trên liên ba (Nguyễn Phước Hải Trung 2019).
- Rồng mây trên cột.
- Rồng ở bờ quyết.

**8. Đề xuất cho game**
- Khung hiện tại: 50 × 26, h 13, nền 2.4.
  - Tỉ lệ sâu/rộng thật 0,69. Khung 0,52: **quá nông**.
  - Chiều cao 13/50 = 0,26 là đúng.
- [game] Đề xuất **50 × 34,7 × cao nóc 13,4 m** (hệ số 1,136 so với thật).
  - Nền điện 1,1 m trên sân.
  - Sân 2 cấp, tổng 2,6 m. Giữ `plinth` 2,4 nếu sân không dựng riêng.
- Phân mái [suy]:
  - Mốc đầu cột ≈ 7,3 m.
  - Mái hạ từ ~4,5 m tới cổ diêm.
  - Cổ diêm cao ~0,9 m.
  - Mái thượng tới 13,4 m.

**9. Nguồn**
- https://vi.wikipedia.org/wiki/%C4%90i%E1%BB%87n_Th%C3%A1i_H%C3%B2a_(Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF)
- https://www.aseantraveller.net/tin-tuc/535_dien-thai-hoa.html (trích đoạn tìm kiếm)
- https://saoviettravel.com.vn/blog/dien-thai-hoa-va-san-dai-trieu-nghi-hue/ (trích đoạn tìm kiếm)
- https://vietnamtourism.gov.vn/post/36508 (trích đoạn: vì kèo, vỏ cua)
- https://www.tapchikientruc.com.vn/chuyen-muc/ket-qua-nghien-cuu-phuong-phap-thiet-ke-kien-truc-cung-dien-trieu-nguyen-thong-qua-phuong-phap-phan-tich-doi-sanh-cong-trinh-dong-dai-va-dong-dang.html
- So sánh: https://vi.wikipedia.org/wiki/%C4%90i%E1%BB%87n_Th%C3%A1i_H%C3%B2a_(B%E1%BA%AFc_Kinh)
- Ảnh:
  - https://commons.wikimedia.org/wiki/File:Thai_Hoa_Palace_20190917.jpg
  - https://commons.wikimedia.org/wiki/File:Dien_Thai_Hoa.jpg
  - Mặt bằng Hoàng Thành: https://commons.wikimedia.org/wiki/File:Plan_of_Great_Enclosure.JPG

---

## canchanh — Điện Cần Chánh

**1. Nguyên mẫu thật**
- Điện Cần Chánh (勤政殿), Tử Cấm Thành. Dựng năm 1804.
- Bị phá huỷ năm 1947, còn nền.
- Đang phục hồi: khởi công 23/11/2024, dự kiến 4 năm, gần 200 tỷ đồng. Hợp tác với ĐH Waseda từ 1994.

**2. Số đo**

| Hạng mục | Giá trị | Loại / nguồn |
|---|---|---|
| Gian | chính điện 5 gian 2 chái kép; tiền điện 7 gian 2 chái đơn; bản phục hồi thêm mái hiên 9 gian | [đo] Wikipedia (Dư địa chí TT-Huế); Tuổi Trẻ, Dân Trí |
| Diện tích gốc | gần 1.000 m² | [đo] |
| Diện tích bản phục hồi | > 1.400 m² | [đo] Tuổi Trẻ |
| Cao nền | gần 1 m, bó gạch vồ và đá Thanh | [đo] |
| Số cột | 80 cột lim | [đo] |
| Hồi lang | 4 hồi lang, mỗi hồi 5 gian, nối Văn Minh, Võ Hiển, Tả Vu, Hữu Vu | [đo] |
| Dài × sâu | không tìm được | — |
| [suy] Dài × sâu | ~38 × 26 m nếu 1.000 m² và cùng tỉ lệ 0,69 như Thái Hòa; ~45 × 31 m nếu 1.400 m² | [suy] |
| Cao | không tìm được | — |

**3. Cấu trúc từ dưới lên**
- **Nền**: cao ~1 m, bó gạch vồ và đá Thanh.
- **Thân**: 80 cột lim; xuyên, trến, kèo, đòn tay và hệ con-xon chạm trổ. Được coi là «kết cấu gỗ lớn và đẹp nhất trong Tử Cấm Thành».
- **Đỡ mái**: nhà kép nối vỏ cua [suy, cùng loại hình với Thái Hòa].
- **Mái**: 2 tầng (chồng diêm), ngói hoàng lưu ly [ảnh cũ].
- **Đỉnh**: bờ nóc trang trí. Không có mô tả chi tiết.

**4. Mặt bằng**
- Cùng sơ đồ gian với Thái Hòa: 7 gian tiền điện, 5 gian chính điện.
- Ngự tọa ở gian giữa nhà chính.
- Hai bên có tranh gương vẽ kinh đô và bản đồ các tỉnh.
- Trước điện là sân Bái mạng.
- Cùng Tả Vu và Hữu Vu tạo bố cục **chữ Môn (門)**.
- Hồi lang 5 gian ở hai bên nối sang các điện phụ.

**5. Cấu kiện nhận diện**
1. Giống Thái Hòa nhưng **nhỏ hơn, nền thấp hơn**. Không có sân 2 cấp.
2. Nhà kép 2 tầng mái vàng.
3. **Hồi lang** (hành lang có mái) từ hai đầu hồi chạy ra hai bên.
4. Tả Vu và Hữu Vu vuông góc phía trước, thành chữ Môn.

**6. Vật liệu và màu**
- Như Thái Hòa: hoàng lưu ly, cột son thếp.
- Điện phụ Văn Minh và Võ Hiển dùng thanh lưu ly #2F7F6E.

**7. Trang trí**
- Chạm trổ trên xuyên, trến, con-xon.
- Liên ba ô thơ.
- Tranh gương treo trên cột.

**8. Đề xuất cho game**
- Khung hiện tại: 42 × 20, h 11, nền 1.6.
  - Sâu/rộng 0,48: **quá nông** (thật ~0,69).
  - Nền 1,6 cao hơn thật.
- [game] Đề xuất **40 × 27,6 × 11 m**, nền 1,1 m.
- Thêm hồi lang 2 bên: mái thanh lưu ly, rộng ~3,5 m, cao diềm ~3 m [game].

**9. Nguồn**
- https://vi.wikipedia.org/wiki/%C4%90i%E1%BB%87n_C%E1%BA%A7n_Ch%C3%A1nh_(Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF)
- https://tuoitre.vn/can-canh-dien-can-chanh-hoi-sinh-giua-tu-cam-thanh-10026083113284048.htm (trích đoạn)
- https://dantri.com.vn/doi-song/hinh-hai-ngoi-dien-noi-cac-vua-nha-nguyen-lam-viec-thiet-trieu-20260901122301305.htm (trích đoạn)
- Ảnh:
  - https://commons.wikimedia.org/wiki/File:N%E1%BB%81n_%C4%91i%E1%BB%87n_C%E1%BA%A7n_Ch%C3%A1nh_-_Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF.jpg
  - https://commons.wikimedia.org/wiki/File:Annam_-_Hu%C3%A9_-_Salon_du_Roi_(Fa%C3%A7ade_ext%C3%A9rieure).jpg (ảnh cũ mặt ngoài)

---

## tavu — Tả Vu

**1. Nguyên mẫu thật**
- Tả Vu, Tử Cấm Thành, phía trước bên trái điện Cần Chánh. Dành cho quan văn.
- Dựng năm 1819. Sửa lớn năm 1923 (Khải Định), có hình dạng như ngày nay.
- Trùng tu 1977, 1986–88 (chuyên gia Ba Lan làm mái), 1997–99. Phục hồi tường và trần năm 2012.

**2. Số đo**

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Gian, chái | **không tìm được** trong nguồn mở được | — |
| Dài × sâu × cao | **không tìm được** | — |
| Hành lang nối Đại Cung Môn | 9 gian | [đo] trích đoạn tìm kiếm |
| Trần | bê tông (từ 1923); sàn gạch hoa | [đo] Wikipedia |

**3. Cấu trúc từ dưới lên**
- Nền thấp.
- Thân: cột gỗ, tường.
- Đỡ mái: khung gỗ truyền thống. Trần bê tông thay từ 1923.
- Mái 2 tầng chồng diêm, ngói thanh lưu ly [ảnh].
- Bờ nóc đắp sành sứ [ảnh].

**4. Mặt bằng**
- Nhà dài, mặt quay vào sân Cần Chánh (quay Đông).
- Nối với Đại Cung Môn bằng hành lang 9 gian.

**5. Cấu kiện nhận diện**
1. Nhà dài thấp, mái 2 tầng **xanh** (cấp quan, không phải vua).
2. Đặt vuông góc với Cần Chánh, đối xứng với Hữu Vu.
3. Hành lang có mái nối sang Đại Cung Môn.
4. Nội thất vẽ màu kiểu Âu nhưng đề tài cung đình: «Lưỡng long chầu nhật», «Tam sư hý cầu», tứ linh, bát bửu.

**6. Vật liệu và màu**
- Mái thanh lưu ly #2F7F6E [ảnh].
- Cột son #8B1A1A.
- Trần và tường vẽ màu.

**7. Trang trí**
- Trần và tường vẽ kiểu Âu với đề tài truyền thống, tô màu năm 1923.

**8. Đề xuất cho game**
- Khung hiện tại 30 × 12, h 8. Chưa có số để kiểm.
- [game] Giữ 30 × 12. Đổi mái sang thanh lưu ly 2 tầng.
- Hạ h xuống ~7 m để thấp hơn Cần Chánh rõ ràng (thứ bậc theo C1.2).
- Cần kiểm lại bằng ảnh `File:Tả Vu (Huế).jpg` trước khi dựng: đếm số gian và xem là nhà đơn hay nhà kép.

**9. Nguồn**
- https://vi.wikipedia.org/wiki/T%E1%BA%A3_vu_v%C3%A0_H%E1%BB%AFu_vu_(Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF)
- https://vi.wikipedia.org/wiki/T%E1%BB%AD_C%E1%BA%A5m_th%C3%A0nh_(Hu%E1%BA%BF)
- Ảnh: https://commons.wikimedia.org/wiki/File:T%E1%BA%A3_Vu_(Hu%E1%BA%BF).jpg

---

## huuvu — Hữu Vu

**1. Nguyên mẫu thật**
- Hữu Vu, đối xứng với Tả Vu qua trục Thần Đạo. Dành cho quan võ.
- Cùng năm dựng và cùng các lần tu sửa với Tả Vu.

**2. Số đo**
- Như Tả Vu: **không tìm được** gian và kích thước.

**3–4. Cấu trúc, mặt bằng**
- Đối xứng gương với Tả Vu.
- Mặt quay Tây vào sân Cần Chánh.

**5. Khác Tả Vu ở đâu**
- Chỉ khác chức năng (võ) và hướng (quay Tây). Kiến trúc đối xứng.
- Theo nguyên tắc «tả văn hữu võ»: bên trái (Đông, nhìn từ ngai quay mặt Nam) là văn; bên phải (Tây) là võ.
- Khung game đặt Tả Vu ở x = −58. Trong `siteplans.js` cổng `east` ở x = +260, vậy +x là Đông và Tả Vu đang ở **Tây**.
  Đây là **ngược quy tắc**: phải đổi chỗ Tả Vu và Hữu Vu.

**6–7. Vật liệu, trang trí**
- Như Tả Vu.
- Hiện Hữu Vu dùng cho dịch vụ trải nghiệm cung đình.

**8. Đề xuất cho game**
- Như Tả Vu (30 × 12 × ~7 m), gương đối xứng.

**9. Nguồn**
- Như Tả Vu.

---

## themieu — Thế Miếu

**1. Nguyên mẫu thật**
- Thế Tổ Miếu (世祖廟), góc Tây Nam Hoàng Thành. Dựng 1821–1822.
- Thờ các vua Nguyễn.

**2. Số đo**

| Hạng mục | Giá trị | Loại / nguồn |
|---|---|---|
| Mặt nền | 54,60 × 27,70 m (Tạp chí Sông Hương: 55 × 28 m) | [đo] Wikipedia; Sông Hương (trích đoạn) |
| Diện tích | ~1.500 m² | [đo] |
| Cao nền | 0,94 m | [đo] laque.vn |
| Gian | chính doanh 9 gian 2 chái kép; tiền doanh 11 gian 2 chái đơn | [đo] |
| Nhịp trung bình | 54,6 / 13 nhịp = 4,2 m | [suy] |
| Cao | không tìm được | — |
| [suy] Cao | 0,37 × 27,7 ≈ 10,3 m | [suy] theo C1.2 |
| Cửu Đỉnh trước sân | cao 2,3–2,5 m; Cao Đỉnh ở giữa, đặt trước các đỉnh khác 3 m | [đo] |

**3. Cấu trúc từ dưới lên**
- **Nền**: cao 0,94 m.
  - Mặt nền xưa lát gạch Bát Tràng men vàng và lục.
  - Nay tiền doanh lát gạch hoa, chính doanh láng xi măng.
- **Thân**: khung gỗ lim. Một đợt trùng tu đã bóc 3 cột bê tông, thay lại cột gỗ.
- **Đỡ mái**: hai bộ kèo, nối bằng trần thừa lưu (vỏ cua) chạm trổ.
- **Mái**: nhà kép, 2 tầng mái, hoàng lưu ly.
- **Đỉnh**: bờ nóc có **thái cực** pháp lam.

**4. Mặt bằng**
- 13 nhịp mặt tiền (11 gian + 2 chái).
- Chính doanh 9 gian ứng với 9 án thờ và 9 đỉnh ngoài sân.
- Sân lát Bát Tràng, có hàng 14 đôn đá và đôi kỳ lân đồng.
- Phía Nam: Cửu Đỉnh, rồi Hiển Lâm Các.
- Tường bao, cửa Tuấn Liệt (trái) và Sùng Công (phải).

**5. Cấu kiện nhận diện**
1. Nhà kép **rất dài** (dài gấp 2 lần sâu), hai tầng mái vàng.
2. 9 đỉnh đồng xếp hàng trước sân.
3. Hiển Lâm Các 3 tầng đứng trước, trên trục.
4. Bờ nóc thái cực pháp lam.

**6. Vật liệu và màu**
- Mái hoàng lưu ly.
- Cột son thếp.
- Nền Bát Tràng vàng / lục.

**7. Trang trí**
- Pháp lam bờ nóc và cổ diêm.
- Trần vỏ cua chạm.

**8. Đề xuất cho game**
- Khung hiện tại: **32 × 50** (rộng × sâu), h 10. **Sai hướng**: thật là dài 54,6 theo mặt tiền × sâu 27,7.
- [game] Đề xuất **54,6 × 27,7 × 10,3 m**, nền 0,94 m. Hoặc 50 × 25,4 × 9,5 nếu thiếu chỗ (hệ số 0,92).
- Bố cục: Hiển Lâm Các ở **phía Nam** Thế Miếu (trước sân), không ở phía Bắc.
  Khung hiện đặt Hiển Lâm z = −60, phía Bắc của Thế Miếu z = +40.

**9. Nguồn**
- https://vi.wikipedia.org/wiki/Th%E1%BA%BF_T%E1%BB%95_mi%E1%BA%BFu_(Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF)
- https://laque.vn/the-mieu-noi-tho-phung-cac-vua-nguyen/ (trích đoạn)
- https://visithue.vn/The-To-Mieu.html/?pid=MjAzMDd8Y3NkbGRs0 (trích đoạn)
- http://tapchisonghuong.com.vn/tap-chi/c27/n4852/Thuoc-truong-sinh-cho-Hue.html (trích đoạn; trang không mở được)
- Ảnh:
  - https://commons.wikimedia.org/wiki/File:Th%E1%BA%BF_Mi%E1%BA%BFu_(Hu%E1%BA%BF).jpg
  - https://commons.wikimedia.org/wiki/File:CuudinhvaThemie_BAVH1914.jpg

---

## dientho — Cung Diên Thọ

**1. Nguyên mẫu thật**
- Diên Thọ chính điện, cung Diên Thọ (cung của Hoàng Thái hậu), phía Tây Hoàng Thành.
- Khuôn viên 138,5 × 126,4 m (~17.500 m²).

**2. Số đo**

| Hạng mục | Giá trị | Loại / nguồn |
|---|---|---|
| Mặt bằng điện | 34,7 dài × 27,5 rộng (~960 m²; laque.vn ghi 950 m²) | [đo] Wikipedia |
| Cao nền | 1 thước 4 tấc ≈ 0,56 m | [đo] |
| Hiên | trước 2 m, sau 4,5 m | [đo] |
| Bậc | thềm trước 3 bậc đá xanh; thềm sau mỗi bên 2 bậc | [đo] |
| Gian | tiền điện 7 gian 2 chái (thời Tự Đức 3 gian 2 chái); chính điện 5 gian 2 chái kép | [đo] Wikipedia |
| Ghi chú | trang Di sản Huế ghi ngược: chính 7 gian, tiền 5 gian 2 chái kép. Chọn Wikipedia vì khớp sơ đồ Thái Hòa và Cần Chánh (tiền 7, chính 5) | — |
| Cao | không tìm được | — |
| [suy] Cao | ~9–10 m (0,35 × 27,5), thấp hơn Thế Miếu vì thứ bậc | [suy] |

**3. Cấu trúc từ dưới lên**
- **Nền**: thấp, 0,56 m.
- **Thân**: gỗ sơn đen theo Wikipedia [đo]. Cửa gắn kính.
- **Đỡ mái**: tiền điện vì chồng rường giả thủ; nối vỏ cua chạm trổ.
- **Mái**: nhà kép, 2 tầng mái.
  - Ngói lưu ly vàng.
  - Thời Tự Đức lợp ngói âm dương.
- **Đỉnh**: nóc gắn quả bầu (hồ lô). Đầu đao đắp chim phượng (cung của nữ).

**4. Mặt bằng**
- 9 nhịp mặt tiền; nhịp trung bình 3,86 m [suy].
- Hai gian hai bên là buồng kín. Ba gian giữa đặt bục gỗ tiếp khách.
- Phía Bắc cách 20 m là điện Thọ Ninh (3 gian 2 chái; diện tích bằng 1/2 chính điện).
- Phía Đông là Trường Du Tạ.
- Bốn cửa: Thọ Chỉ (Nam, kiểu lầu chồng), Diễn Trạch, Địch Tường, Thiện Khánh.

**5. Cấu kiện nhận diện**
1. Nhà kép 2 tầng mái, nền rất thấp.
2. **Phượng** ở đầu đao thay cho rồng: dấu hiệu cung Thái hậu.
3. Hồ lô giữa nóc.
4. Hiên sau rộng (4,5 m), gấp đôi hiên trước.
5. Cổ diêm ô hộc khảm sành sứ.

**6. Vật liệu và màu**
- Mái vàng.
- Gỗ sơn đen và son [đo/ảnh].
- Cửa kính.

**7. Trang trí**
- Cổ diêm khảm tranh sành sứ.
- Bảng «Diên Thọ cung» (1916).
- 8 tranh gương.

**8. Đề xuất cho game**
- Khung hiện tại: **32 × 44**, h 9, nền 1.6.
  - **Sai hướng và quá sâu**: thật dài 34,7 theo mặt tiền × sâu 27,5.
  - Nền 1,6 gấp 3 lần thật.
- [game] Đề xuất **34,7 × 27,5 × 9,5 m**, nền 0,6 m.
- Bố cục: thật ở phía **Tây** Hoàng Thành (phía Bắc Thế Miếu). Game đặt ở Đông. Đổi hay giữ do người làm tổng mặt bằng quyết.

**9. Nguồn**
- https://vi.wikipedia.org/wiki/Cung_Di%C3%AAn_Th%E1%BB%8D
- https://laque.vn/cung-dien-tho-noi-o-cua-hoang-thai-hau-me-vua/ (trích đoạn)
- http://www.hueworldheritage.org.vn/TTBTDTCDH.aspx?TieuDeID=35&TinTucID=31&l=vn (trích đoạn; trang không mở được)
- Ảnh:
  - https://commons.wikimedia.org/wiki/File:Di%C3%AAn_Th%E1%BB%8D_Ch%C3%ADnh_%C4%90i%E1%BB%87n.jpg
  - https://commons.wikimedia.org/wiki/File:Dien_Tho.JPG

---

## truongsanh — Cung Trường Sanh

**1. Nguyên mẫu thật**
- Cung Trường Sanh (cung Thái hoàng thái hậu), góc Tây Bắc Hoàng Thành, sau cung Diên Thọ.
- Dựng 1821–22. Mặt bằng chữ **Tam (三)**.
- Năm 1846 sửa thành chữ **Vương (王)**:
  - điện **Thọ Khang** ở giữa;
  - **Ngũ Đại Đồng Đường** phía trước;
  - lầu **Vạn Phúc** phía sau;
  - nối nhau bằng hành lang.
- Năm 1923 đổi tên Trường Sanh. Trùng tu 2005–2007 (nguồn khác ghi 2006–2010).

**2. Số đo**

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Khuôn viên | 126 × 85 m (Thanh Niên / tổng hợp); Wikipedia ghi 11.400 m² | [đo] |
| Hướng | quay mặt **Đông** | [đo] Wikipedia |
| Gian, kích thước điện Thọ Khang | **không tìm được** | — |

**3. Cấu trúc từ dưới lên**
- Nhà rường gỗ, mái ngói [ảnh].
- Số tầng mái của từng nhà chưa xác minh.

**4. Mặt bằng**
- Trục chữ Vương: 3 nhà ngang nối bằng một hành lang dọc.
- Có lạch Đào Nguyên bao quanh (dẫn từ Hậu hồ), cầu son bắc qua.
- Có hồ Tân Nguyệt.
- Giả sơn sau lầu Vạn Phúc: núi Bảo Sơn, Kình Ngư, Hổ Tôn.
- Cửa chính Trường An kiểu tam quan, trang trí ngũ sắc.

**5. Cấu kiện nhận diện**
1. Cụm **3 nhà song song nối hành lang** (chữ Vương), không phải một nhà lớn.
2. Lạch nước và cầu son bao quanh.
3. Cổng tam quan ngũ sắc.
4. Non bộ phía sau.

**6. Vật liệu và màu**
- Ngói, gỗ son [ảnh].
- Sân lát gạch Bát Tràng.

**7. Trang trí**
- Cổng tam quan đắp sành sứ ngũ sắc.

**8. Đề xuất cho game**
- Khung hiện tại 34 × 18, h 8: một khối. **Sai loại hình**: thật là cụm chữ Vương.
- [game] Trong khung 34 × 18 nên dựng 3 nhà ngang:
  - mỗi nhà ~30 × 4,5 m;
  - cách nhau ~2 m;
  - nối hành lang 3 m ở trục giữa;
  - nhà giữa (Thọ Khang) cao nhất, ~7 m.
- Gian giả định: 5 gian 2 chái. **Chưa có nguồn**, phải đánh dấu là giả định.

**9. Nguồn**
- https://vi.wikipedia.org/wiki/Cung_Tr%C6%B0%E1%BB%9Dng_Sanh
- https://thanhnien.vn/xem-noi-o-cua-thai-hoang-thai-hau-trieu-nguyen-185510759.htm (trích đoạn)
- https://www.vietnamplus.vn/hoan-thanh-trung-tu-cung-truong-sanh-sau-6-nam-post96427.vnp (trích đoạn)
- Ảnh:
  - https://commons.wikimedia.org/wiki/File:Truong_Sanh_Residence_1.jpg
  - https://commons.wikimedia.org/wiki/File:Cung_Truong_Sanh.jpg

---

## hienlam — Hiển Lâm Các

**1. Nguyên mẫu thật**
- Hiển Lâm Các (顯臨閣), trước sân Thế Miếu. Dựng 1821–1822.
- Công trình cao nhất Hoàng Thành. Có quy định cấm xây cao hơn.

**2. Số đo**

| Hạng mục | Giá trị | Loại / nguồn |
|---|---|---|
| Số tầng | 3 | [đo] |
| Cao | 17 m (Wikipedia, nhiều nguồn); 13,6 m (Tạp chí Sông Hương, trích đoạn) | [đo]; chọn 17 m tính tới đỉnh bình hồ lô, vì 4 cột cái đã cao 13 m |
| 4 cột cái chạy suốt | cao 13 m | [đo] |
| Tổng số cột | 24 | [đo] |
| Diện tích mặt bằng | 300 m² | [đo] |
| [suy] Kích thước | ~20 × 15 m (300 m², tỉ lệ mặt tiền / sâu ~4:3 theo ảnh) | [suy/ảnh] |
| Gian | tầng 1: 5 gian; tầng 2: 3 gian; tầng 3: 1 gian | [đo] |
| Mái | 12 mái (Wikipedia; 3 tầng × 4 mặt) | [đo] |
| Bậc | 2 hệ bậc đá Thanh (trước, sau), mỗi hệ 9 bậc | [đo] |
| Cao mỗi tầng | ~5,7 m (17 / 3) | [suy] |

**3. Cấu trúc từ dưới lên**
- **Nền**: chữ nhật, cao. Bó gạch vồ, vữa vôi, đắp nổi mảnh sành. Lát gạch Bát Tràng.
- **Thân**:
  - 24 cột gỗ; 4 cột cái suốt 3 tầng.
  - Hàng cột thứ 3 từ trước có dãy đố bản; mỗi gian mở cửa vòm.
  - Cầu thang gỗ lên tầng 2: chi tiết giá trị nhất.
- **Đỡ mái**: khung gỗ. Mỗi tầng một mái hiên vây quanh.
- **Mái**: 3 tầng mái thu nhỏ dần.
- **Đỉnh**: trên cùng tầng 3 có **bình rượu (hồ lô) màu vàng**.

**4. Mặt bằng**
- Tầng 1: 5 gian, có hiên quanh.
- Tầng 2: 3 gian, thu vào.
- Tầng 3: 1 gian.
- Bậc giữa có thành bậc chạm rồng (lối của vua).
- Hai bên là lầu chuông, lầu trống, nối tường gạch tới cửa.

**5. Cấu kiện nhận diện**
1. **Ba tầng mái chồng, mỗi tầng thu gian (5 → 3 → 1)**. Hình tháp nấc.
2. Bình hồ lô trên đỉnh.
3. Lan can / cửa vòm ở mỗi gian tầng 1.
4. Lầu chuông và trống hai bên.
5. Hoành phi «Hiển Lâm Các» nền lục, khung 9 rồng thếp vàng.

**6. Vật liệu và màu**
- Gỗ son thếp.
- Mái ngói lưu ly vàng [ảnh].
- Nền gạch có mảnh sành.

**7. Trang trí**
- Rồng, hoa, lá chạm trên cột và kèo tầng 1.
- Hoành phi nền lục #3D7A4E, rồng thếp vàng.

**8. Đề xuất cho game**
- Khung hiện tại: 20 × 20, **floors: 2**, h 13. **Sai**: thật 3 tầng, 17 m, mặt bằng chữ nhật.
- [game] Đề xuất **20 × 15 × 17 m, 3 tầng**.
  - Cao tầng 5,6 m.
  - Tầng 2 rộng ~12 m (3 gian), tầng 3 ~6 m (1 gian).
  - Mái hiên vươn ~1,8 m mỗi tầng.

**9. Nguồn**
- https://vi.wikipedia.org/wiki/Hi%E1%BB%83n_L%C3%A2m_c%C3%A1c
- https://luhanhvietnam.com.vn/du-lich/hien-lam-cac-hue.html (trích đoạn)
- Ảnh:
  - https://commons.wikimedia.org/wiki/File:Hien_Lam_Cac.jpg
  - https://commons.wikimedia.org/wiki/File:Pavilion_of_Splendour.jpg

---

## thaimieu — Thái Miếu

**1. Nguyên mẫu thật**
- Thái Tổ Miếu (太祖廟), góc Đông Nam Hoàng Thành. Đối xứng với Thế Miếu.
- Thờ các chúa Nguyễn.
- Bị phá năm 1947. Năm 1971–72 dựng tạm nhà 5 gian trên nền cũ.
- Tu bổ giai đoạn 1 từ 10/2024, dự kiến xong 2028.

**2. Số đo**

| Hạng mục | Giá trị | Loại / nguồn |
|---|---|---|
| Gian | chính đường 13 gian 2 chái kép; tiền đường 15 gian 2 chái đơn | [đo] Wikipedia, Báo Văn Hóa |
| Kích thước | 71 × 27 m, 1.917 m² | [đo] trích đoạn tìm kiếm (theo dự án trùng tu); trang mở được không hiện lại số này |
| Kiểm chéo | 71 / 17 nhịp = 4,2 m, bằng nhịp Thế Miếu | [suy] |
| Khuôn viên | 14.904 m² | [đo] |
| Cao, nền | không tìm được | — |
| [suy] Cao | ≈ 10 m (0,37 × 27) | [suy] |

**3. Cấu trúc từ dưới lên**
- «Ngôi nhà bằng gỗ lớn nhất» trong cung điện Nguyễn.
- Nhà kép trùng thiềm điệp ốc, 2 tầng mái [suy theo loại hình], ngói hoàng lưu ly [suy].

**4. Mặt bằng**
- 17 nhịp mặt tiền.
- Phía Nam (trước sân): **Tuy Thành Các**, 3 tầng, hình thức như Hiển Lâm Các, hai bên lầu chuông và trống.
- Phía Nam nữa: Tả Tùng Tự, Hữu Tùng Tự.
- Đông: điện Long Đức. Tây: Thổ Công Từ.
- Đông Nam: điện Chiêu Kính. Tây Nam: điện Mục Tư.
- Bắc: Triệu Tổ Miếu.
- Tường gạch bao, 5 cửa.

**5. Cấu kiện nhận diện**
1. Nhà kép **dài nhất** Hoàng Thành: dài hơn Thế Miếu 1,3 lần, cùng chiều sâu.
2. Gác 3 tầng (Tuy Thành Các) phía trước, cùng ngữ pháp Hiển Lâm Các.
3. Mái 2 tầng vàng.

**6–7. Vật liệu, trang trí**
- Như Thế Miếu [suy].

**8. Đề xuất cho game**
- Khung hiện tại: 34 × 18, h 9. **Sai nặng**: thật là công trình gỗ lớn nhất (71 × 27), lớn hơn Thế Miếu. Game lại để nhỏ hơn Thế Miếu.
- [game] Đề xuất **64 × 24,3 × 9,5 m** (hệ số 0,9), nền ~0,9 m.
- Tối thiểu phải dài hơn Thế Miếu và cùng chiều sâu.

**9. Nguồn**
- https://vi.wikipedia.org/wiki/Th%C3%A1i_T%E1%BB%95_mi%E1%BA%BFu_(Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF)
- https://baovanhoa.vn/van-hoa/di-tich-thai-mieu-dai-noi-hue-se-duoc-trung-tu-nhu-the-nao-109477.html
- Ảnh:
  - Không tìm được ảnh chính điện trên Commons (điện đã mất).
  - Vị trí trên mặt bằng: https://commons.wikimedia.org/wiki/File:Plan_of_Great_Enclosure.JPG

---

## quocsu — Quốc Sử Quán

**1. Nguyên mẫu thật**
- Quốc Sử Quán triều Nguyễn (1820–1945), phường Phú Văn **trong Kinh Thành**, ngoài Hoàng Thành.
- Nhà chính ở giữa. Hai dãy tả hữu thêm năm 1841–42 (Công thự; Giải vũ đài).
- Tàng Bản Đường ở phía sau (1849 hoặc 1857, nguồn khác nhau).
- Năm 1884 thêm **dãy nhà ngói 7 gian 2 chái**.
- Không còn công trình. Đất nay là trường THPT Nguyễn Huệ.
- Nguyên mẫu dựng hình: chọn **dãy 7 gian 2 chái (1884)**.
- Tham chiếu cùng loại (lưu trữ triều Nguyễn, còn tồn tại): **Tàng Thư Lâu** (1825).
  - 2 tầng xây gạch đá.
  - Tầng dưới 11 gian. Tầng trên 7 gian 2 chái.
  - Tường dày 0,4 m.
  - Trên đảo ~45 × 65 m giữa hồ Học Hải.

**2. Số đo**

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Gian (dãy 1884) | 7 gian 2 chái | [đo] Wikipedia |
| Kích thước | không tìm được | — |
| [suy] Dài | 7 gian × 3,8 m + 2 chái × 2,6 m ≈ 31,8 m (nhịp nhà rường 2,4–4,2 m) | [suy] |
| Tàng Thư Lâu: tường | 0,4 m; 18 cửa lớn tầng dưới; tầng trên 7 cửa lớn và 11 cửa sổ | [đo] trích đoạn |

**3. Cấu trúc từ dưới lên**
- Nhà rường đơn (một nóc) [suy: nhà làm việc, không phải điện].
- Nền thấp bó đá Thanh.
- Cột gỗ son.
- Vì kèo cánh ác.
- Mái 2 tầng hoặc 1 tầng ngói [chưa xác minh].
- Nóc có hồ lô đơn giản.

**4. Mặt bằng**
- Nhà chính ở giữa.
- Hai dãy tả hữu thành chữ U (chữ Môn).
- Tàng Bản Đường phía sau.
- Cổng có 2 bia «Khuynh cái hạ mã».

**5. Cấu kiện nhận diện**
1. Cụm nhà chữ Môn quanh sân.
2. Hai bia «Khuynh cái hạ mã» ở cổng.
3. Nhà kho bản in phía sau (tường gạch kín, kiểu Tàng Thư Lâu).
4. Tủ gỗ sơn son đựng sách (nội thất).

**6. Vật liệu và màu**
- Ngói thanh lưu ly hoặc ngói liệt (công thự, không phải cung vua) [suy].
- Gỗ son.

**7. Trang trí**
- Đơn giản. Hoành phi tên cơ quan.

**8. Đề xuất cho game**
- Khung hiện tại 34 × 18, h 9.
- [game] Giữ **32 × 14 × 8 m** cho nhà chính 7 gian 2 chái.
  - Chiều sâu 14 m: suy từ nhà rường, sâu ≈ 0,45 dài.
  - Mái xanh.
  - Thêm 2 dãy phụ nếu đủ chỗ.

**9. Nguồn**
- https://vi.wikipedia.org/wiki/Qu%E1%BB%91c_s%E1%BB%AD_qu%C3%A1n_(nh%C3%A0_Nguy%E1%BB%85n)
- https://archives.org.vn/gioi-thieu-tai-lieu-nghiep-vu/dau-an-quoc-su-quan-trieu-nguyen.htm (trích đoạn; trang không mở được)
- https://vi.wikipedia.org/wiki/T%C3%A0ng_Th%C6%B0_l%C3%A2u
- Ảnh: https://commons.wikimedia.org/wiki/File:T%C3%A0ng_Th%C6%B0_l%C3%A2u_%E2%80%93_N%C6%A1i_l%C6%B0u_gi%E1%BB%AF_c%C3%A1c_lo%E1%BA%A1i_v%C4%83n_th%C6%B0_quan_tr%E1%BB%8Dng_c%E1%BB%A7a_tri%E1%BB%81u_Nguy%E1%BB%85n._%E1%BA%A2nh_ch%E1%BB%A5p_n%C4%83m_1942.jpg

---

## LẦU 10 TẦNG — Lầu Kiến Trung

### 1. Nguyên mẫu thật và so sánh ba hướng

| | Lầu / điện Kiến Trung | Tháp Phước Duyên (Thiên Mụ) | Hiển Lâm Các |
|---|---|---|---|
| Năm | Minh Viễn 1827 → Du Cửu 1913 → Kiến Trung 1921–23 → phục hồi 2019–24 | 1844–45 | 1821–22 |
| Tầng | Kiến Trung: 2 (bản phục hồi, ~14 m); Minh Viễn: 3 (~11 m, trên nền 4–5 m, đỉnh ~15 m) | 7, cao 21,24 m (5 trượng 3 thước 2 tấc) | 3, cao 17 m |
| Mặt bằng | ~975 m² (bản phục hồi; trước 1945 > 1.000 m²) | **bát giác** | chữ nhật, 300 m², 5 → 3 → 1 gian |
| Kết cấu | bê tông, gạch vồ, đá; Á–Âu | gạch mộc, bó đá Thanh; thang xoắn ốc bên trong | gỗ, 24 cột, 4 cột cái 13 m |
| Mái | ngói ác đoa (kiểu Pháp) | mái hiên nhỏ mỗi tầng | 3 tầng mái chồng |
| Trang trí | khảm sành sứ ngũ sắc mặt tiền; 13 cửa hiên (giữa 5, hai bên mỗi bên 3, hai góc nhô ra mỗi bên 2) | pháp lam | rồng mây, hoành phi 9 rồng, hồ lô đỉnh |
| Loại | cung ở (vua) | tháp Phật giáo | gác tưởng niệm (vua) |

### Hướng chọn: **gác gỗ kiểu Hiển Lâm Các xếp chồng, trên đài kiểu Minh Viễn / Ngọ Môn**

Lý do:
1. Hiển Lâm Các là **gác nhiều tầng cung đình chuẩn mực nhất** còn nguyên.
   - Nó là công trình cao nhất Hoàng Thành, được dùng làm chuẩn cao độ.
   - Nó có ngữ pháp rõ để kéo dài: mỗi tầng thu gian, mỗi tầng một mái chồng, đỉnh hồ lô.
   - Thái Miếu có gác cùng mẫu (Tuy Thành Các). Ngữ pháp này được triều Nguyễn lặp lại.
2. Tháp Phước Duyên **không hợp**:
   - Là tháp Phật giáo xây gạch, bát giác.
   - Tầng cao ~3 m, lòng chật, thang xoắn: không làm được sảnh để người chơi đi.
   - Đặt nó vào trục cung vua là lẫn ngữ pháp chùa với ngữ pháp cung.
   - Chỉ mượn nhịp thu nhỏ đều và pháp lam.
3. Kiến Trung bản Khải Định **không hợp**:
   - Là nhà Á–Âu 2 tầng, mái Pháp.
   - Kéo lên 10 tầng sẽ thành cao ốc thuộc địa, mất nhận diện «cung đình Huế».
   - Giữ từ Kiến Trung:
     - **tên và vị trí**: cuối trục Thần Đạo, phía Bắc Tử Cấm Thành;
     - **nền cao**: Minh Viễn, chính trên nền này, có nền 1 trượng 1 tấc ≈ 4–5 m, lan can gạch hoa, 3 hệ bậc mặt Nam, 1 hệ mặt Bắc;
     - **ngói ống hoàng lưu ly** (Minh Viễn);
     - **khảm sành sứ** (Kiến Trung).

### 2. Số đo căn cứ
Đã liệt kê trong C1.3. Thêm:
- Ngọ Môn đài cao > 5 m. Bậc 21 × 22 cm = 4,62 m [đo].
- Nền lầu Ngũ Phụng trên đài cao 1,14 m [đo].
- Phu Văn Lâu: cột cái ~8 m chạy 2 tầng; cột quân ~3 m, chu vi 0,95–1 m (Ø ≈ 0,31 m) [đo].
  Chu vi cột cái ghi «10,7 m» là lỗi in. Có lẽ là 1,07 m, tức Ø ≈ 0,34 m [suy].

### 3. Cấu trúc đề xuất từ dưới lên [game]
- **Đài**:
  - Vuông cạnh 43 m. Giữ theo danh sách; `podium.a = a0 + 6`.
  - Cao **4,6 m** (21 bậc × 0,22 như Ngọ Môn). Hiện `podium: 2.4` là quá thấp.
  - Thân gạch vồ / đá Thanh xám. Nữ tường lan can gạch hoa men rỗng.
  - 3 hệ bậc mặt trước, 1 hệ mặt sau (theo Minh Viễn).
- **Mặt bằng tầng**: **vuông hoặc chữ nhật** (`n: 4`), **không bát giác**.
  - Nhóm 3 tầng như ba lớp Hiển Lâm Các: 7 gian → 5 gian → 3 gian → 1 gian.
- **Thân mỗi tầng**:
  - Hàng cột son ngoài cùng là hiên (`gal`, `bd` ≈ 2,0 m).
  - Lan can gỗ con tiện.
  - Vách «thượng song hạ bản» (trên song / kính, dưới ván).
  - Cửa sổ tròn mặt trước và sau (trời), vuông hai bên (đất), như Phu Văn Lâu.
  - Cửa sổ hình quạt / khánh xen kẽ, như Ngọ Môn.
- **Mái mỗi tầng**:
  - Mái hiên hoàng lưu ly, vươn 2,0–2,4 m.
  - Ở 3 bước thu gian (sau tầng 2, 5, 8): mái lớn hơn và **dải cổ diêm** cao 0,9 m, ô hộc pháp lam «nhất thi nhất họa».
  - Giữa các tầng cùng cỡ: mái hiên hẹp 1,2 m.
- **Đỉnh**:
  - Tầng 10 mang mái chồng diêm 2 tầng, 8 mặt mái.
  - Bờ nóc lưỡng long chầu **hồ lô** pháp lam vàng (giữ `crown: 'gourd'`).
  - Bờ quyết đắp rồng sành sứ.

### 4. Bảng tầng [game] (FH = 5,0 m của engine; thật 4,8–5,8 m/tầng, C1.3)

| Tầng | Cạnh (m) | apothem `a` | Bố cục | Mái trên tầng |
|---|---|---|---|---|
| 1 | 31,2 | 15,6 | 7 gian 2 chái (giữa 4,4 · bên 3,6 · chái 2,6) | hiên hẹp |
| 2 | 29,6 | 14,8 | 7 gian 2 chái (gian 3,4) | **mái lớn + cổ diêm** |
| 3 | 24,0 | 12,0 | 5 gian 2 chái | hiên hẹp |
| 4 | 23,0 | 11,5 | 5 gian 2 chái | hiên hẹp |
| 5 | 22,0 | 11,0 | 5 gian 2 chái | **mái lớn + cổ diêm** |
| 6 | 18,0 | 9,0 | 3 gian 2 chái | hiên hẹp |
| 7 | 17,2 | 8,6 | 3 gian 2 chái | hiên hẹp |
| 8 | 16,4 | 8,2 | 3 gian 2 chái | **mái lớn + cổ diêm** |
| 9 | 16,0 | 8,0 | 1 gian 4 chái (16 cột, phương đình) | hiên hẹp |
| 10 | 16,0 | 8,0 | 1 gian 4 chái | **mái chồng diêm 2 tầng + hồ lô** |

Ghi chú:
- Hiện `a: 15 − 0,4k` cho bát giác. Đổi sang bảng trên với `n: 4`.
- Apothem nhỏ nhất 8,0 để vẫn đặt được thang (RUN 8,4 m) và đĩa thang phép.
- Tầng 1 với `a` = 15,6 cho `podium.a` = 21,6, tức bệ 43,2 m: khớp «bệ vuông cạnh 43 m».

**Chiều cao tổng** [game]: 4,6 (đài) + 10 × 5,0 + ~5,5 (mái đỉnh) + ~1,5 (hồ lô) ≈ **61,6 m**.

### 5. Cấu kiện nhận diện (theo mức quan trọng)
1. Mặt bằng vuông / chữ nhật có gian, cột son lộ ra ngoài. Không phải khối xây kín.
2. Mỗi tầng một mái hiên vàng. Nhịp **thu gian theo 3 bậc** (7 → 5 → 3 → 1) với dải cổ diêm ở mỗi bậc.
3. Hồ lô vàng trên đỉnh, hai rồng chầu.
4. Đài gạch cao 4,6 m, lan can gạch hoa men, bậc giữa có thành rồng.
5. Lan can gỗ con tiện quanh hiên các tầng trên.
6. Cửa sổ tròn / vuông / quạt.

### 6. Vật liệu và màu
- Mái: hoàng lưu ly #D8A02A.
- Cột: son #8B1A1A.
- Vách: song gỗ thếp #C8A040.
- Đài: #8C8A82, bó đá #5F656B.
- Cổ diêm pháp lam: lam #2B5BA6, lục #3D8C5C.
- Hiện `eaveCol: '#3e7d4f'` (xanh) là **sai** cho lầu vua. Minh Viễn lợp hoàng lưu ly.

### 7. Trang trí
- Khảm sành sứ ngũ sắc ở tầng 1 (dấu Kiến Trung).
- Ô thơ pháp lam ở cổ diêm.
- Rồng ở bờ quyết.
- Hoành phi «Kiến Trung Lâu» nền lục, khung rồng.

### 8. Khung game
- Bệ 43 m giữ nguyên.
- Đổi `n: 8 → 4`.
- Đổi `podium: 2,4 → 4,6`.
- Đổi màu mái sang vàng.
- Bảng tầng như trên.

### 9. Nguồn
- https://baochinhphu.vn/net-uy-nghi-trang-le-cua-dien-kien-trung-hoang-thanh-hue-1022402221553592.htm
- https://khamphahue.com.vn/Hue-24h/Chi-tiet/tid/Dien-Kien-Trung-Noi-tung-la-%E2%80%9CDe-nhat-canh%E2%80%9D-cua-dat-Than-kinh.html/pid/17140/cid/28 (Minh Viễn: nền 1 trượng 1 tấc, 3 tầng, 2 trượng 7 thước, ngói hoàng lưu ly)
- https://suckhoedoisong.vn/dien-kien-trung-tu-nen-mong-den-diem-den-thu-hut-du-khach-169241119145210835.htm (trích đoạn: 13 cửa hiên, > 1.000 m²)
- https://husta.vn/kien-truc-phuong-tay-trong-kien-truc-cung-dinh-hue/
  - Kiến Trung: nền > 930 m², ngói ác đoa.
  - Lưu ý: số «3 tầng, 745 m²» ở trang này là của **lầu Khải Tường (cung An Định)**, không phải Kiến Trung. Một số bản tóm tắt bị lẫn.
- https://vi.wikipedia.org/wiki/T%E1%BB%AD_C%E1%BA%A5m_th%C3%A0nh_(Hu%E1%BA%BF)
- https://vi.wikipedia.org/wiki/Ch%C3%B9a_Thi%C3%AAn_M%E1%BB%A5
- https://nguoihanoi.vn/de-nhat-co-tu-co-do-hue-bai-1-kien-truc-nghe-thuat-doc-dao-voi-thap-7-tang-hinh-bat-giac-88860.html (trích đoạn)
- https://baotanglichsu.vn/vi/Articles/3099/69172/nhung-trang-tri-bang-phap-lam-tai-thap-phuoc-duyen-chua-thien-mu.html (trích đoạn: 21,24 m; trang không mở được)
- https://vi.wikipedia.org/wiki/Hi%E1%BB%83n_L%C3%A2m_c%C3%A1c
- Ảnh:
  - https://commons.wikimedia.org/wiki/File:Hue_Kien_Trung_Palace.jpg
  - https://commons.wikimedia.org/wiki/File:Hu%E1%BA%BF_(2024)_-_%C4%90i%E1%BB%87n_Ki%E1%BA%BFn_Trung_-_Kien_Trung_Palace_-_img_01.jpg
  - https://commons.wikimedia.org/wiki/File:Ph%C6%B0%E1%BB%9Bc_Duy%C3%AAn_Tower,_Thi%C3%AAn_M%E1%BB%A5_Pagoda,_Hu%E1%BA%BF.jpg

---

# ĐÌNH / TIỂU CÔNG TRÌNH

## summit — Vọng Sơn Đình

**1. Nguyên mẫu thật**
- Đình ngắm cảnh trên giả sơn. Huế không có đình bát giác cung đình còn đo được.
- Chọn **phương đình 16 cột 2 tầng mái**. Mẫu đo được gần nhất:
  - khối chính **Nghinh Lương Đình** (1852, bờ sông Hương);
  - **Trường Du Tạ** (1849, cung Diên Thọ).
- Tham khảo chức năng «vọng»: **lầu Tứ Phương Vô Sự** (1923, trên Bắc Khuyết Đài).
  - 2 tầng, 14 × 13 m, 182 m².
  - Mỗi mặt mỗi tầng 2 cửa sổ và 1 cửa đi.
  - Kiểu Á–Âu. Chỉ tham khảo.

**2. Số đo**

| Hạng mục | Giá trị | Loại / nguồn |
|---|---|---|
| Nghinh Lương: nền | vuông 17,80 m, cao 0,80–0,90 m (nguồn lệch) | [đo] |
| Nghinh Lương: nhà | 15,70 (B–N) × 10,40 m (Đ–T): nhà chính + 2 nhà vỏ cua 10 × 2,70 m | [đo] |
| [suy] Nhà chính phương đình | ~10,4 × 10,3 m (15,7 − 2 × 2,7) | [suy] |
| Cột | 16 cột gỗ: 4 cột giữa đỡ mái thượng, 12 cột quân đỡ mái hạ; tường gạch 0,30 m gia cường cột quân | [đo] |
| Mái | nhà chính 8 mặt (4 thượng, 4 hạ); tổng 16 mặt cùng 2 nhà vỏ cua | [đo] |
| Cao | không tìm được | — |

**3. Cấu trúc từ dưới lên**
- Nền vuông bó gạch đá, lan can gạch.
- Chân tảng đá Thanh cho 4 cột cái.
- 12 cột quân.
- Mái hạ 4 mặt, cổ diêm, mái thượng 4 mặt.
- Bờ nóc đắp «hồi long» chầu mặt nhật. Bờ quyết hình con giao.

**4. Mặt bằng**
- Lưới 4 × 4 cột.
- 3 lối mỗi mặt trước và sau (mỗi gian một lối). Hai bên hông mỗi bên 1 lối ở gian giữa.

**5. Cấu kiện nhận diện**
1. Mặt bằng vuông, 16 cột.
2. Hai tầng mái (8 mặt).
3. Cổ diêm khảm sành sứ.
4. Lưỡng long chầu nhật trên nóc.

**6. Vật liệu và màu**
- Nhà chính ngói ống hoàng lưu ly; nhà vỏ cua ngói liệt.
- Cột son.

**7. Trang trí**
- Đầu đốc hình dơi ngậm đồng tiền (nhà chính), hổ phù (nhà vỏ cua).
- Bờ quyết mái hạ chia ô hộc.

**8. Đề xuất cho game**
- Khung 9 × 9, `octa: true`, h 3,6. **Sai hình**: phải vuông. Chiều cao quá thấp cho 2 tầng mái.
- [game] **9 × 9 × 7,5 m**:
  - cột cái 5,5 m;
  - cột quân 3,0 m (tỉ lệ cột quân / cột cái ≈ 0,55, lấy từ Phu Văn Lâu 3/8 cho bản 2 tầng, nới cho đình 1 tầng);
  - `octa: false`.

**9. Nguồn**
- https://thanhdiavietnamhoc.com/nghinh-luong-dinh-nhung-thay-doi-ve-hinh-dang-kien-truc-trong-cac-giai-doan-lich-su/
- https://huexuavanay.com/nghenh-luong-dinh/ (trích đoạn)
- https://laque.vn/nghinh-luong-dinh-noi-nghi-chan-hong-mat-cua-vua-trieu-nguyen/ (trích đoạn)
- https://vietnam.vnanet.vn/vietnamese/long-form/ngam-hue-tu-lau-tu-phuong-vo-su-467965.html (trích đoạn)
- http://redsvn.net/chum-anh-kham-pha-lau-tu-phuong-vo-su-cua-hoang-thanh-hue2/ (trích đoạn: 14 × 13 m)
- Ảnh: https://commons.wikimedia.org/wiki/File:Ngh%C3%AAnh_L%C6%B0%C6%A1ng_%C4%90%C3%ACnh.jpg

---

## ngomonW — Lầu Ngũ Phụng Tây

**1. Nguyên mẫu thật**
- Các lầu trên cánh Tây của Ngọ Môn (1833).
- Lầu Ngũ Phụng gồm 9 lầu nối liền:
  - 5 lầu chính, 4 lầu phụ;
  - 3 dãy vuông góc;
  - dãy giữa: lầu trung tâm 3 gian 2 chái cao vượt;
  - mỗi cánh: 2 lầu chính + 1 lầu phụ.
- «Tả chung hữu cổ»:
  - gian góc cánh trái treo **chuông** (1822, cao ~1,8 m, 815 kg);
  - gian góc cánh phải đặt **trống**.
- Ngọ Môn quay Nam. Tả (trái của vua nhìn ra Nam) là Đông.
  - **ngomonW = lầu trống** (Hữu).
  - **ngomonE = lầu chuông** (Tả).

**2. Số đo**

| Hạng mục | Giá trị | Loại / nguồn |
|---|---|---|
| Đài chữ U | đáy 57,96 m (nguồn khác 57,77), cánh 27,50 m (nguồn khác 27,06); cao > 5 m; ~1.400 m² (nguồn khác > 1.560 m²) | [đo] Phan Thanh Hải 2015 |
| Bậc lên đài | 2 hệ (hai bên, phía sau), mỗi hệ 21 bậc × 22 cm, rộng 5,25 m | [đo] |
| Nền lầu trên đài | 1,14 m | [đo] |
| Cột | 100 cột lim son thếp, 48 cột suốt 2 tầng | [đo] |
| Tổng chiều cao Ngọ Môn | «chưa đến 15 m» (Phan Thanh Hải 2015); «hơn 17 m» (Phan Thuận An 2000) | [đo]; chọn ≈ 15 m vì Phan Thanh Hải đo trực tiếp, tổng các phần ~5 + 1,14 + lầu ~9 m |
| Cửa giữa | cao 1 trượng 3 thước 3 tấc, rộng 8 thước 2 tấc; Giáp môn cao 1 trượng 2 thước 4 tấc 5 phân, rộng 6 thước 3 tấc; Dịch môn cao 7 thước 6 tấc, rộng 6 thước 3 tấc | [đo] KĐĐNHĐSL qua Phan Thanh Hải |
| Lưu ý quy đổi | đổi 0,40–0,425 m/thước thì cửa giữa cao 5,3–5,65 m, **vượt** chiều cao đài. Thước đo cửa có lẽ là thước khác (Huế có 2 loại thước Lỗ Ban, một loại riêng cho cửa). Chỉ dùng **tỉ lệ**: rộng / cao cửa giữa = 0,62 | [suy] |
| [suy] Ô mỗi lầu cánh | cánh 27,5 m chia 3 lầu → ~9 m mỗi lầu | [suy] |
| Lầu cánh: gian, cao riêng | không tìm được | — |

**3. Cấu trúc từ dưới lên**
- **Đài**: gạch vồ, đá Thanh, vữa tam hợp, xà đồng.
  - 3 cửa giữa cuốn vòm có 70 xà đồng (16 × 13 cm và 13 × 8,5 cm, dài 2,3–5,4 m).
  - Nữ tường lan can gạch hoa men rỗng.
- **Nền lầu**: 1,14 m.
- **Tầng dưới**: phần lớn để trống, chỉ lầu giữa có vách và cửa.
- **Tầng trên**:
  - Che kín ván.
  - Mặt trước lầu giữa có cửa lá sách.
  - Cửa sổ tròn, rẻ quạt, chiếc khánh.
  - Lan can gỗ con tiện.
- **Mái**: 9 bộ mái, mỗi lầu 2 tầng mái.
  - Lầu giữa hoàng lưu ly.
  - 8 lầu còn lại thanh lưu ly.
- **Đỉnh**: lầu giữa có bình hồ lô pháp lam trên nóc; bờ nóc ô thơ «nhất thi nhất họa».

**4. Mặt bằng**
- Lầu cánh Tây gồm lầu chính, lầu phụ (đoạn hành lang được nâng cấp) và lầu chính góc.
- Gian góc đặt trống.

**5. Cấu kiện nhận diện**
1. Mái **xanh** 2 tầng (khác lầu giữa vàng).
2. Tầng dưới thoáng, cột son.
3. Tầng trên kín ván, cửa sổ hình tròn / quạt / khánh.
4. Lan can gỗ con tiện tầng trên.
5. Đặt **trên đài gạch cao ~5 m**, không đứng trên mặt đất.

**6. Vật liệu và màu**
- Mái thanh lưu ly #2F7F6E.
- Cột son thếp.
- Đài gạch xám #8C8A82.
- Lan can gạch hoa men vàng / lục.

**7. Trang trí**
- Rồng, giao long, dơi ngậm tiền, hoa lá, bát bửu ở mái.

**8. Đề xuất cho game**
- Khung 9 × 9, h 3,6.
  - Bề ngang 9 m khớp suy luận ô ~9 m.
  - Thiếu tầng 2 và thiếu đài.
- [game] **9 × 9 × 8,5 m**, 2 tầng, trên nền 1,14 m.
- Nếu không dựng đài Ngọ Môn thì nâng cả lầu lên một khối đài cao ~5 m nối với cổng.
- `gate: 'ngomon'` trong `styles.js` nên là đài chữ U 58 × 27,5 × 5 m mang 9 lầu.

**9. Nguồn**
- https://dsvh.gov.vn/Upload/files/5013_Ngo%20Mon%20bieu%20tuong%20vinh%20hang%20cua%20co%20do%20hue.pdf (Phan Thanh Hải, Di sản văn hóa 1(50)-2015; đã đọc toàn văn)
- https://vi.wikipedia.org/wiki/Ng%E1%BB%8D_M%C3%B4n_(Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF)
- https://tapchidongnama.vn/cac-loai-hinh-cong-cua-trong-kien-truc-cung-dinh-hue/ (trích đoạn: «hơn 17 m», Phan Thuận An 2000)
- https://thanhuyhue.vn/tin-tuc-trong-tinh/van-hoa-du-lich/kien-truc-dac-sac-ngo-mon-truoc-kinh-thanh-hue.html (trích đoạn: 57,77 / 27,06 / 1,14)
- Ảnh:
  - https://commons.wikimedia.org/wiki/File:Meridian_Gate,_Hue_(I).jpg
  - https://commons.wikimedia.org/wiki/File:Hu%E1%BA%BF_(2024)_-_Meridian_Gate_-_Ng%E1%BB%8D_M%C3%B4n_(Ho%C3%A0ng_th%C3%A0nh_Hu%E1%BA%BF)_-_img_01.jpg

---

## ngomonE — Lầu Ngũ Phụng Đông

**1. Nguyên mẫu thật**
- Các lầu trên cánh Đông Ngọ Môn. Gian góc treo **chuông đồng** Minh Mạng (1822).

**2. Số đo**
- Như ngomonW.
- Chuông cao gần 4 thước (~1,8 m), nặng 1.359 cân (815 kg) [đo]. Là bảo vật quốc gia (2024).

**3–4. Cấu trúc, mặt bằng**
- Gương đối xứng với ngomonW.

**5. Khác ngomonW ở đâu**
- Chỉ khác vật treo trong gian góc: chuông ở đây, trống ở Tây.
- Khi dựng nội thất: treo chuông trên giá gỗ son.

**6–7. Vật liệu, trang trí**
- Như ngomonW.

**8. Đề xuất cho game**
- 9 × 9 × 8,5 m, 2 tầng. Gian góc treo chuông Ø ~1,1 m, cao 1,8 m [game, Ø ước từ ảnh].

**9. Nguồn**
- Như ngomonW.

---

## kimthuyW — Đình Kim Thủy Tây

**1. Nguyên mẫu thật**
- Ghi chú tên gọi:
  - Ở Huế, «Kim Thủy» là **hào nước quanh Hoàng Thành** (Ngoại Kim Thủy).
  - Hoặc là **Hậu Hồ** phía sau (Nội Kim Thủy, đào năm 1804).
  - Hồ trước điện Thái Hòa có cầu Trung Đạo là **hồ Thái Dịch**.
  - Khung game gọi hồ trước Thái Hòa là «hồ Kim Thủy (Thái Dịch)». Nên đổi tên thành **hồ Thái Dịch**.
- Đình ven hồ Nội Kim Thủy xưa: đình Thất Doanh, Thanh Khả Cư (thủy tạ), tạ Trừng Tâm. Đều đã mất, không có số đo.
- Nguyên mẫu dựng hình: **Trường Du Tạ** (1849), thủy tạ cung đình còn tồn tại.

**2. Số đo**

| Hạng mục | Giá trị | Loại / nguồn |
|---|---|---|
| Hồ của tạ | 28 × 20 m; mặt bằng tạ bằng ~1/2 mặt hồ | [đo] Wikipedia «Cung Diên Thọ» |
| Kiểu | phương đình kiểu nhà rường, **1 gian 4 chái, 16 cột** | [đo] |
| Mái | ngói lưu ly men xanh | [đo] |
| Kích thước tạ, cao | không tìm được riêng | — |

**3. Cấu trúc từ dưới lên**
- Trụ / móng đứng trong hồ.
- Sàn gạch hoa.
- 16 cột (lưới 4 × 4).
- Vách kính, cửa sổ 4 mặt.
- Mái 2 tầng (phương đình) [suy theo C1.4].
- Nóc hồ lô hoặc lưỡng long [ảnh].

**4. Mặt bằng**
- 1 gian giữa bao bởi 4 chái.
- Xưa có hành lang 3 mặt (đã dỡ).
- Hai hòn non bộ với 5 am nhỏ và 2 cầu.

**5. Cấu kiện nhận diện**
1. Nhà vuông 16 cột **đứng trên mặt nước**.
2. Mái 2 tầng xanh.
3. Vách kính / cửa sổ 4 mặt.
4. Non bộ nhỏ trong hồ.

**6. Vật liệu và màu**
- Mái thanh lưu ly #2F7F6E.
- Cột son.
- Kính.

**7. Trang trí**
- Đắp sành sứ bờ nóc [ảnh].

**8. Đề xuất cho game**
- Khung 8 × 8, h 3,6.
- [game] **8 × 8 × 6,5 m**, mái 2 tầng xanh, sàn nhô trên mặt nước 0,6 m, `octa: false`.

**9. Nguồn**
- https://vi.wikipedia.org/wiki/Cung_Di%C3%AAn_Th%E1%BB%8D (mục Trường Du tạ)
- https://vi.wikipedia.org/wiki/H%E1%BA%ADu_h%E1%BB%93
- Ảnh: https://commons.wikimedia.org/wiki/File:Tr%C6%B0%E1%BB%9Dng_Du_T%E1%BA%A1.jpg

---

## kimthuyE — Đình Kim Thủy Đông

**1. Nguyên mẫu thật**
- Gương của kimthuyW.
- Tham khảo thêm **Thương Bạc Đình** (bờ sông Hương). Có ảnh Commons, chưa có số đo.

**2. Số đo**
- Như kimthuyW.

**3–4. Cấu trúc, mặt bằng**
- Như kimthuyW.

**5. Khác kimthuyW ở đâu**
- Đặt đối xứng bên Đông.
- Nếu muốn khác biệt: dùng biến thể có **2 nhà vỏ cua trước và sau** (mẫu Nghinh Lương Đình, 3 nóc, 16 mặt mái). Mặt bằng thành chữ nhật 8 × 12 m.

**6–7. Vật liệu, trang trí**
- Như kimthuyW.

**8. Đề xuất cho game**
- 8 × 8 × 6,5 m. Hoặc 8 × 12 nếu dùng biến thể vỏ cua.

**9. Nguồn**
- Như kimthuyW.
- https://thanhdiavietnamhoc.com/nghinh-luong-dinh-nhung-thay-doi-ve-hinh-dang-kien-truc-trong-cac-giai-doan-lich-su/
- Ảnh: https://commons.wikimedia.org/wiki/File:Th%C6%B0%C6%A1ng_B%E1%BA%A1c_%C4%90%C3%ACnh.JPG

---

## tinhtam1 — Đình Tịnh Tâm Đông

**1. Nguyên mẫu thật**
- Hồ Tịnh Tâm (1822). Chu vi ~1.500 m, 107.553 m², 3 đảo: Bồng Lai, Phương Trượng, Doanh Châu.
- Phía Đông điện Bồng Doanh trên đảo Bồng Lai có **nhà Thủy tạ Thanh Tâm**, quay mặt Đông.
- Chọn Thanh Tâm thủy tạ làm nguyên mẫu (đúng vị trí «Đông»).
- Công trình chính của đảo là **điện Bồng Doanh**: 3 gian 2 chái, mái trùng diêm, ngói hoàng lưu ly, lan can gạch.

**2. Số đo**

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Hồ | chu vi ~1.500 m; 107.553 m² | [đo] |
| Thanh Tâm thủy tạ | không có số đo (đã mất) | — |
| Bồng Doanh | 3 gian 2 chái | [đo] |

**3. Cấu trúc từ dưới lên**
- Thủy tạ một phần đứng trên nước.
- Phương đình 16 cột, 2 tầng mái [suy theo loại hình].

**4. Mặt bằng**
- Mặt quay Đông ra mặt nước.
- Hành lang có mái nối các đảo (44 gian và 56 gian).
- Cầu Lục Liễu có mái 3 gian.

**5. Cấu kiện nhận diện**
1. Thủy tạ hướng ra hồ sen.
2. Mái 2 tầng.
3. Hành lang có mái dài nối tới.

**6. Vật liệu và màu**
- Nếu theo điện chủ Bồng Doanh: ngói hoàng lưu ly [suy]. Không chắc cho riêng thủy tạ.

**7. Trang trí**
- Sành sứ bờ nóc [ảnh].

**8. Đề xuất cho game**
- Khung 9 × 9, h 3,6.
- [game] **9 × 9 × 7 m**, phương đình 16 cột mái 2 tầng, sàn nhô ra nước.
- Thêm 1 đoạn hành lang có mái ~3 × 12 m nối bờ, nếu đủ chỗ.

**9. Nguồn**
- https://vi.wikipedia.org/wiki/H%E1%BB%93_T%E1%BB%8Bnh_T%C3%A2m
- https://hue.gov.vn/Du-kh%C3%A1ch/Du-l%E1%BB%8Bch/Th%C3%B4ng-tin-chi-ti%E1%BA%BFt/tid/Ho-Tinh-Tam/newsid/5C763B4F-93C5-4BAF-80AA-72DC68DC744B/cid/9B74C4A9-4BF5-4B30-889E-4CA343944E31,763CADD8-44F7-44A4-895C-44988C3C9A93,17CA19EF-5FE0-4556-BB17-8235DFD093E8,2307076E-60C2-43EE-93A1-B7C8C3A475A9,B9FF3533-F4F4-44C4-BF7E-9AF1A1196188 (trích đoạn)
- Ảnh: https://commons.wikimedia.org/wiki/File:Tinh_Tam_Lake_1.jpg

---

## thieuphuong — Đình Thiệu Phương

**1. Nguyên mẫu thật**
- Vườn Thiệu Phương (1828), góc Đông Tử Cấm Thành, trong cửa Hưng Khánh.
- Trung tâm là **Vạn tự hồi lang**: hành lang gấp khúc hình chữ Vạn (卍) chạy ra 4 phía.
- Bốn góc là 2 «đường» và 2 «hiên»:
  - Di Nhiên Đường (Tây Nam);
  - Vĩnh Phương Hiên (Đông Nam);
  - Hàm Xuân Hiên (Tây Bắc);
  - phía Đông Bắc là cửa Xuân Đường / Cấm Uyển (nguồn khác nhau).
- Khai quật 2002. Phục hồi thích nghi 2014–2018.
- Nguyên mẫu: **một trong bốn nhà góc**, nối với hồi lang chữ Vạn.

**2. Số đo**

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Diện tích vườn | ~8.000 m² (kế hoạch 2010) | [đo] trích đoạn |
| Nhà góc, hồi lang | không tìm được | — |

**3. Cấu trúc từ dưới lên**
- Nhà gỗ nhỏ, nền thấp.
- Mái ngói [ảnh].
- Hồi lang: hành lang có mái, cột gỗ son, mái ngói hai dốc [suy theo hồi lang Huế].

**4. Mặt bằng**
- Nhà nhỏ nằm ở đầu một nhánh hồi lang chữ Vạn.
- Ngự Câu (lạch) phía Tây nối hồ Ngọc Dịch.
- Đồi Trích Thúy Sơn phía Đông.
- Lối gạch, bồn hoa, non bộ.

**5. Cấu kiện nhận diện**
1. **Hồi lang gấp khúc chữ Vạn** nối nhà. Đây là dấu hiệu chính, quan trọng hơn chính cái đình.
2. Nhà nhỏ ở góc.
3. Lạch nước và non bộ.

**6. Vật liệu và màu**
- Cột son.
- Mái thanh lưu ly hoặc ngói liệt [chưa xác minh].

**7. Trang trí**
- Không có mô tả.

**8. Đề xuất cho game**
- Khung 9 × 9, `octa: true`. **Sai**: không có đình bát giác ở đây.
- [game] Nhà vuông **9 × 9 × 6 m**, 16 cột, mái 2 tầng, `octa: false`.
- Thêm **hồi lang chữ Vạn**:
  - rộng 3 m;
  - mỗi nhánh ~12 m;
  - gấp vuông góc 1 lần ở cuối nhánh.
- Đó mới là thứ để người xem nhận ra Thiệu Phương.

**9. Nguồn**
- https://luhanhvietnam.com.vn/du-lich/vuon-thieu-phuong-hue.html
- https://vi.wikipedia.org/wiki/T%E1%BB%AD_C%E1%BA%A5m_th%C3%A0nh_(Hu%E1%BA%BF)
- https://tuoitre.vn/plo/tai-hien-mot-trong-nhung-vuon-ngu-uyen-dep-nhat-thoi-nguyen-post178167.html (trích đoạn)
- Ảnh: không tìm được ảnh Commons có tên Thiệu Phương.

---

## island — Hồ Tâm Đình

**1. Nguyên mẫu thật**
- Lầu giữa hồ của ngự uyển Huế:
  - **Lầu Vô Hạn Ý** giữa Hậu Hồ: 3 gian, 2 tầng, mái ván, quay Nam, cầu gỗ sam nối bờ.
  - **Gác Nam Huân** giữa đảo Phương Trượng (hồ Tịnh Tâm): 2 tầng, ngói hoàng lưu ly, quay Nam.
- Cả hai đã mất, không có số đo.
- Mẫu đo được cho **lầu vuông 2 tầng 2 mái**: **Phu Văn Lâu** (1819 / 1905).

**2. Số đo (Phu Văn Lâu)**

| Hạng mục | Giá trị | Loại |
|---|---|---|
| Nền | vuông 12,24 m; cao 1,22 m (trước) / 1,07 m (sau) | [đo] |
| Cao | 11,67 m | [đo] |
| Cột | 16: 4 cột cái ~8 m suốt 2 tầng; 12 cột quân ~3 m, chu vi 0,95–1 m | [đo] |
| Chân tảng | đá xanh 2 cấp (vuông dưới, tròn trên), cao 31 cm | [đo] |
| Lan can nền | đá, cao 0,65 m; ngắt ở bậc trước, trái, phải | [đo] |
| Tỉ lệ H / cạnh | 11,67 / 12,24 = 0,95 | [suy] |

**3. Cấu trúc từ dưới lên**
- Nền vuông có lan can đá.
- Tầng dưới thoáng hoàn toàn.
- Cầu thang gỗ ở góc phải.
- Tầng trên:
  - Vách ván khung tranh.
  - Cửa sổ **tròn** mặt trước / sau (trời), **vuông** hai bên (đất).
  - Lan can gỗ chạm vòng ngoài.
- Mái hạ lớn, mái thượng nhỏ.
- Bờ nóc «hồi long» chầu mặt nhật. Góc quyết hình giao. Ô hộc bờ nóc đắp sứ hoa lá.

**4. Mặt bằng**
- Lưới 4 × 4 cột (3 × 3 nhịp).
- Tầng trên nằm trong vòng 4 cột cái.

**5. Cấu kiện nhận diện**
1. Lầu vuông 2 tầng, 2 mái chồng.
2. Tầng dưới mở thoáng, tầng trên kín.
3. Cửa sổ tròn / vuông.
4. Lan can đá quanh nền.
5. Lưỡng long chầu nhật.

**6. Vật liệu và màu**
- Ngói hoàng lưu ly (nguyên bản; sau 1905 thay ngói âm dương).
- Cột son.
- Nền đá xanh.

**7. Trang trí**
- Hoành phi tên lầu.
- Sứ hoa lá ở ô bờ nóc.

**8. Đề xuất cho game**
- Khung 10 × 10, h 3,8, `octa: true`. **Sai hình và thiếu tầng.**
- [game] **10 × 10 × 9,5 m**:
  - tỉ lệ 0,95 như Phu Văn Lâu;
  - cột cái 6,5 m;
  - cột quân 2,5 m;
  - nền 1 m có lan can đá 0,55 m;
  - `octa: false`.

**9. Nguồn**
- https://scov.gov.vn/dat-nuoc-con-nguoi/dat-nuoc-viet-nam/phu-van-lau-mot-di-tich-van-hoa-va-lich-su.html (theo Tạp chí Sông Hương)
- https://vi.wikipedia.org/wiki/Phu_V%C4%83n_l%C3%A2u (trích đoạn)
- https://vi.wikipedia.org/wiki/H%E1%BA%ADu_h%E1%BB%93
- https://vi.wikipedia.org/wiki/H%E1%BB%93_T%E1%BB%8Bnh_T%C3%A2m
- Ảnh:
  - https://commons.wikimedia.org/wiki/File:Phu_V%C4%83n_l%C3%A2u.jpg
  - https://commons.wikimedia.org/wiki/File:PhuVan_Pavilion.jpg

---

## Giả sơn — Thiệu Phương Viên · non bộ

- Huế không có giả sơn lớn kiểu đồi đá Tô Châu. Có hai loại:
  - **đồi đất nhỏ**: Trích Thúy Sơn ở Thiệu Phương;
  - **non bộ trong bể cạn hoặc trong hồ**: Trường Du Tạ có 2 hòn non bộ với 5 am nhỏ và 2 cầu; Trường Sanh có núi Bảo Sơn, Kình Ngư, Hổ Tôn; Doanh Châu ở hồ Tịnh Tâm làm như một hòn non bộ nổi.
- Khung game: giả sơn 40 × 30 × 9 m có bậc lên đình đỉnh. Lớn hơn mọi mẫu Huế đã biết.
- [game] Giữ cho gameplay, nhưng hình nên là **đồi đất trồng cây** (Trích Thúy Sơn), có điểm đá.
  - Non bộ đá đặt thành cụm nhỏ 2–4 m trong bể cạn hoặc hồ quanh chân.
  - Không làm khối đá chồng nhọn kiểu Trung Hoa.
- Số đo: không tìm được.

---

# PHÁT HIỆN LỚN VỀ KHUNG HIỆN TẠI

1. **Thế Miếu (32 × 50) và Diên Thọ (32 × 44) sai hướng.** Thật là nhà dài theo mặt tiền: 54,6 × 27,7 và 34,7 × 27,5.
2. **Thái Miếu (34 × 18) bị làm nhỏ hơn Thế Miếu.** Thật là nhà gỗ lớn nhất (71 × 27).
3. **Thái Hòa và Cần Chánh quá nông.** Sâu / rộng thật ~0,69; khung chỉ ~0,5.
4. **Hiển Lâm Các 2 tầng, 13 m.** Thật 3 tầng, 17 m, thu gian 5 → 3 → 1.
5. **Lầu 10 tầng bát giác, nền 2,4 m, mái xanh.** Phải vuông / chữ nhật, đài 4,6 m, mái vàng.
6. **Mọi đình `octa: true`** (Thiệu Phương, đình đỉnh, đình giữa hồ). Huế dùng **phương đình 16 cột**.
7. **Màu mái chung xanh** (`roofCol '#3e7d4f'`). Điện, miếu, lầu của vua phải hoàng lưu ly. Xanh chỉ cho Tả Vu, Hữu Vu, 8 lầu phụ Ngọ Môn, thủy tạ, công thự.
8. **Nền 1,6 m** cho hầu hết nhà là quá cao. Thật 0,56–1 m. Chỉ Thái Hòa ~2,3 m tính cả sân.
9. Bố cục (ngoài phạm vi, chỉ ghi lại):
   - Hiển Lâm Các phải ở **phía Nam** (trước) Thế Miếu.
   - Diên Thọ và Trường Sanh thật ở phía **Tây**. Game đặt ở Đông (x = +122).
   - Thái Miếu thật ở góc **Đông Nam**, đối xứng Thế Miếu. Game đặt ở Tây (x = −122, z = 130), cùng phía với Thế Miếu.
   - Quốc Sử Quán thật nằm ngoài Hoàng Thành (trong Kinh Thành).
   - Tả Vu (văn) phải ở phía **Đông**. Game đặt ở Tây (+x là Đông theo cổng `east`).
   - Hồ trước Thái Hòa là **Thái Dịch**, không phải Kim Thủy.

---

# ĐỘ TIN CẬY

**Số đo chắc (có nguồn đo, kiểm chéo được)**
- Thái Hòa: 44 × 30,5 × 11,8; gian theo thước, khớp với kích thước mét.
- Thế Miếu: 54,6 × 27,7; nền 0,94.
- Diên Thọ chính điện: 34,7 × 27,5; nền 0,56; hiên 2 / 4,5.
- Ngọ Môn: đài, bậc, nền lầu, số cột (Phan Thanh Hải 2015, đọc toàn văn).
- Phu Văn Lâu: nền 12,24; cao 11,67; cột.
- Nghinh Lương Đình: nền 17,8; nhà 15,7 × 10,4; 16 cột.
- Hiển Lâm Các: 3 tầng, 5 / 3 / 1 gian, 24 cột, 300 m². Chiều cao có 2 số (17 / 13,6).
- Tháp Phước Duyên: 7 tầng, 21,24 m.

**Một phần chắc, phần còn lại suy ra**
- Cần Chánh: gian, cột, diện tích chắc; kích thước suy ra.
- Thái Miếu: gian chắc; 71 × 27 chỉ thấy trong trích đoạn tìm kiếm.
- Quốc Sử Quán: chỉ biết dãy 7 gian 2 chái; dùng Tàng Thư Lâu làm mẫu.
- Lầu Ngũ Phụng cánh: kích thước lầu cánh suy từ chiều dài cánh đài.
- Kiến Trung: chỉ có 2 tầng, ~14 m, 975 m²; không có dài × rộng.
- Kim Thủy / Tịnh Tâm / đình đỉnh: dựa trên mẫu đo được cùng loại (Trường Du Tạ, Nghinh Lương, Phu Văn Lâu), không phải chính công trình.

**Không tìm được số đo**
- Tả Vu, Hữu Vu: số gian, kích thước.
- Cung Trường Sanh: điện Thọ Khang.
- Thiệu Phương: nhà góc, hồi lang.
- Thanh Tâm thủy tạ, lầu Vô Hạn Ý, gác Nam Huân.
- Đường kính cột Thái Hòa.
- Độ dốc mái theo độ của mọi công trình.

# CHƯA ĐẠT / CHƯA LÀM

- Hạn mức WebSearch đã hết. Chưa tìm thêm được:
  - Tả Vu / Hữu Vu;
  - Trường Sanh;
  - kích thước Thái Miếu từ nguồn mở được;
  - độ dốc mái.
- Các trang hueworldheritage.org.vn, tapchisonghuong.com.vn, archives.org.vn, baotanglichsu.vn, codohue.vn, scholar.dlu.edu.vn không truy cập được (DNS). Cần đọc lại khi có mạng.
- Chưa xem trực tiếp ảnh Commons. Mọi mục ghi [ảnh] cần kiểm bằng mắt trước khi vẽ lại.
- Mã hex là ước lượng, chưa lấy mẫu màu từ ảnh.
