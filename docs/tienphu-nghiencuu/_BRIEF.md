# Đề bài nghiên cứu chung — kiến trúc 9 tiên phủ

## Bối cảnh
Game 3D trên web (Three.js). Có 9 "tiên phủ" (khu cung điện trên mây, mỗi khu 520 × 520 m), mỗi khu một phong cách kiến trúc
dựa trên một quần thể có thật. Tổng mặt bằng đã xong. Mỗi khu có 7–13 nhà, 7–8 đình / tiểu công trình, 1 "lầu 10 tầng" (công trình
cao nhất, người chơi leo được từng tầng) và các cổng.

Hiện mọi nhà được sinh từ MỘT bộ dựng chung: hộp tường + hàng cửa sổ + mái (cong / bằng / vòm chụp lên). Người dùng chê bản vẽ
và công trình "quá thô sơ, không lột tả được công trình", và yêu cầu nghiên cứu kỹ lưỡng trước khi làm, cấm làm ẩu.
Kết quả của bạn sẽ là căn cứ để vẽ lại bản vẽ kiến trúc (mặt bằng, mặt đứng, mặt cắt) và dựng lại từng công trình.

## Việc của bạn
Nghiên cứu MỘT phong cách (đề riêng ghi rõ), cho TỪNG công trình trong danh sách được giao, rồi viết một file Markdown tiếng Việt
vào đường dẫn được chỉ định. Không sửa file nào khác.

### Với mỗi công trình (nhà, đình, cổng, lầu 10 tầng)
1. **Nguyên mẫu thật**: công trình có thật nào đúng nhất (tên gốc + tên Việt). Nếu tên trong danh sách là công trình có thật thì
   nghiên cứu đúng công trình đó; nếu là tên gán chung (vd "Nhà Khách", "Đình Góc Đông") thì chọn nguyên mẫu thật cùng loại,
   cùng thời, cùng quần thể hoặc vùng.
2. **Số đo thật** (có nguồn): rộng, sâu, cao tới diềm mái, cao tới nóc / đỉnh, số gian / số nhịp, khoảng cột, đường kính cột,
   cao bệ, số bậc, độ vươn mái, độ dốc mái, kích thước vòm / tháp / minaret… Ghi rõ số nào đo được từ nguồn, số nào suy ra (và
   suy ra thế nào). Không bịa số.
3. **Cấu trúc theo thứ tự từ dưới lên**: bệ / nền → thân (cột, tường, hành lang) → kết cấu đỡ mái (đấu củng, consol, vì kèo,
   vòm…) → mái (loại mái đúng tên chuyên môn, số tầng mái) → đỉnh (bờ nóc, linh vật, chóp, finial…).
4. **Mặt bằng**: lưới cột / gian, vị trí hành lang, cửa, cầu thang, phòng chính; chia nhịp mặt tiền (vd 9 gian, gian giữa rộng nhất;
   pishtaq ở giữa, 2 tầng iwan nhỏ hai bên…).
5. **Danh sách CẤU KIỆN NHẬN DIỆN** — những thứ BẮT BUỘC phải có trên bản vẽ / mô hình thì người xem mới nhận ra công trình
   (vd lăng Taj: bệ vuông, 4 minaret tách rời nghiêng ra ngoài, pishtaq vòm nhọn ở 4 mặt, góc vát, vòm củ hành trên trống cao,
   4 chhatri, finial…). Xếp theo mức quan trọng.
6. **Vật liệu và màu**: tên vật liệu, mã màu hex gần đúng cho từng phần (mái, tường, cột, viền, cửa).
7. **Trang trí** đặc trưng và vị trí của nó.
8. **Đề xuất kích thước dùng trong game**: so với "khung hiện tại" trong danh sách; nếu khung hiện tại sai tỉ lệ so với thật thì
   đề xuất khung mới (rộng × sâu × cao) và giải thích. Game cho phép thu phóng tỉ lệ chung nhưng TỈ LỆ GIỮA CÁC PHẦN phải đúng.
9. **Nguồn**: URL cụ thể đã đọc (ưu tiên: trang di sản chính thức, UNESCO, Wikipedia + nguồn được trích ở đó, bản vẽ đo đạc
   như HABS / Wikimedia Commons, sách / bài học thuật). Kèm 1–3 URL ảnh hoặc bản vẽ tham chiếu trên Wikimedia Commons
   (link trang File:…), ưu tiên ảnh chính diện và mặt bằng.

### Phần chung của phong cách (đặt ở đầu file)
- Quy tắc tỉ lệ chung của phong cách (vd hệ "gian" và chiều cao cột Trung Hoa theo Doanh tạo pháp thức / Công trình tố pháp;
  thức cột cổ điển và tỉ lệ entablature; hệ ken Nhật; tỉ lệ pishtaq Mughal…), có nguồn.
- Bảng màu và vật liệu chung.
- Những SAI LẦM hay gặp khi dựng phong cách này mà phải tránh (vd mái Nhật bị vẽ cong vểnh kiểu Trung Hoa; Huế mái chồng diêm
  2 tầng chứ không phải 1; Gothic không có mái cong…).
- Cách nhận diện khác biệt với phong cách gần nó (Trung Hoa ↔ Huế ↔ Nhật; Tân cổ điển ↔ Gothic…).

### Định dạng file
- Tiếng Việt, Markdown. Mỗi công trình một mục `## <id> — <tên>` theo đúng id trong danh sách, có đủ 9 tiểu mục trên.
- Số đo để trong bảng. Không nhồi nhiều ý vào một câu dài.
- Cuối file: mục "Độ tin cậy": công trình nào số đo chắc (có nguồn đo), công trình nào suy ra, công trình nào không tìm được.

## Tiêu chuẩn
- Tra cứu thật bằng WebSearch / WebFetch; đọc nguồn, không trả lời theo trí nhớ. Mỗi công trình ít nhất 2 nguồn khi có thể.
- Nếu nguồn mâu thuẫn, ghi cả hai và chọn một, nói lý do.
- Không bịa URL. Chỉ ghi URL bạn đã thật sự mở hoặc thấy trong kết quả tìm kiếm.
- Làm đủ TẤT CẢ công trình trong danh sách. Không bỏ cái nào vì "giống cái trước" — nếu giống thì vẫn ghi khác ở đâu.
- Câu trả lời cuối cùng gửi lại (không phải file): 5–10 dòng tóm tắt: đã làm bao nhiêu công trình, công trình nào thiếu số đo,
  phát hiện quan trọng nhất về việc khung hiện tại sai tỉ lệ.
