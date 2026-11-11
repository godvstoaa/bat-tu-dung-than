# MANIFEST QUY HOẠCH HUYỀN THÀNH (v5)

Quy chuẩn thiết kế phố phường cho thành Bát Quái (bát giác khoảng 4,2 km, khoảng 20 nghìn công trình).
- **Viết trước khi sửa mã.** Mọi thay đổi bố cục, nhà, đồ phố phải tuân theo văn bản này.
- **Chỉ số (V)** được `scripts/city-metrics.mjs` kiểm và chặn khi trượt.
- **Đổi quy tắc** thì sửa văn bản này trước, rồi mới sửa mã.

## 1. Vì sao cần manifest

Bản v4 có đủ chức năng (tiệm, nhà bán, miếu, trạm xe) nhưng nhìn như khu công nghiệp:
- Mỗi cạnh ô là một dải nhà liền nhau, chỉ hở 0,1 m, cùng lùi, cùng góc, cùng chiều sâu.
- Mỗi loại tiệm đúng một model, nên phố chủ đề ra 20–40 tiệm giống hệt.
- Nhà bị kéo giãn cho vừa lô. Chiều cao chỉ chênh ±2%. Màu chỉ có một hằng số mỗi cung.
- Lõi ô là dải đất trống không có gì. Chỉ 25 quảng trường cho 1.590 ô.
- Đồ phố đã viết (tường rào, đèn, cây, biển hiệu) không được nối vào.

## 2. Mẫu tham khảo (đã kiểm nguồn)

| Mẫu | Số liệu | Lấy gì cho Huyền Thành |
|---|---|---|
| **Barcelona, Eixample (Cerdà 1859)** | Ô 113,3 m, phố 20 m, góc vát 45° (cắt khoảng 14 m), nhà bao chu vi sâu 20–28 m, sân trong ô. Siêu khối (superilla) 3×3 ô khoảng 400 m: xe đi vòng ngoài, giao lộ trong thành quảng trường. | Ô có **nhà bao chu vi và sân trong**, **góc vát**, **phường = siêu khối 3×3** có quảng trường giữa |
| **Trường An (Đường)** | 108 phường (坊) có tường khoảng 3 m. Phường lớn 4 cổng và phố chữ thập, phường nhỏ 2 cổng. Hai chợ Đông, Tây chia 9 ô bằng phố 16 m. | **Phường có cổng**, có **trung tâm** (đình, miếu). Chợ khu ở giao lộ lớn (đã có). |
| **Biện Kinh (Tống), tranh Thanh Minh thượng hà** | Tường phường bị phá. Tiệm mở thẳng ra phố. Sạp lấn mép đường. Biển hiệu đặt tên phố. Cầu Cầu Vồng và cổng miếu đông nhất. | **Phố chợ mở**, **biển hiệu**, **sạp**, **đầu cầu đông** |
| **36 phố Hà Nội, Hội An** | Nhà ống mặt tiền 2–8 m, sâu 20–60 m, giếng trời. Mỗi phố một nghề (Hàng X), có đình riêng. Hội An: nhà 4–8 m × 23–40 m. | **Mặt tiền hẹp, nhịp dày**, **phố nghề** (đã có chủ đề), **đình phường** |
| **Nguyên tắc chung** | Tỉ lệ D/H (Ashihara): 1–2 là dễ chịu, > 4 là trống trải. Điểm hoạt động cách nhau khoảng 275 m, quảng trường nhỏ 14–21 m (Alexander). Mỗi trục nhìn về một công trình mốc. | Chiều cao theo cấp đường, quảng trường phường, tầm nhìn |

Nguồn:
- barcelona.cat/metropolis (Eixample)
- Wikipedia (Cerdà Plan, Chang'an, Along the River During the Qingming Festival)
- Báo cáo superilla của ASPB
- academia.edu (tube houses Hàng Bạc)
- ashihara.jp
- Pattern Language #61
- Parish & Müller 2001
- Townscaper (Stålberg)

## 3. Quy tắc

### 3.1 Cấp bậc
- **Cung** (8) → **khu** (Trung, Ngoại) → **phường** → **ô** → **lô**.
- **Phường** là nhóm khoảng 3×3 ô cùng cung, cùng dải vành, cùng bên đại lộ (khoảng 350–450 m). Ranh là đại lộ, vành, phố ranh. Mỗi phường có tên.
- **Ô** khoảng 120 × 80 m (giữ lưới v4). **Không chẻ ô bằng ngõ.** Nhà bao quanh chu vi, **lõi ô là sân trong**.
- **Ngõ xuyên** rộng 6 m nối phố vào sân trong: mỗi ô 1 ngõ, ô quảng trường phường 2 ngõ. Ngõ đặt trên cạnh phố nhánh, cách góc ô ít nhất 30 m.

### 3.2 Góc phố
- Mọi góc ô vát 45°: lô dọc cạnh bắt đầu cách đỉnh góc ít nhất 20 m. **V: 100% góc.**
- **Góc giáp mặt tiền lớn** (đại lộ, vành, quảng trường): đặt **nhà góc** xoay 45° nhìn ra giao lộ, loại tửu lâu hoặc trà lâu.
- **Góc phố nhánh**: theo hash, hoặc nhà góc (nhà ở), hoặc **sân góc** (cây, đèn đá, miếu thổ địa).

### 3.3 Nhịp mặt tiền
- **Mặt tiền tiệm** (đại lộ, vành, quảng trường): 35% hẹp 5–7 m · 40% vừa 8–11 m · 20% rộng 12–15 m · 5% 16–19 m.
- **Mặt tiền nhà ở** (phố nhánh): 40% 7–10 m · 45% 10–14 m · 15% 14–18 m. Nhà vườn (g2, g3): 20–26 m.
- **Nhóm 3–6 nhà** liền tường (khe 0,1 m). Giữa hai nhóm có **khe 2–4 m**, ghi lại để dựng tường rào, cổng ngõ, cây.
- **Lùi theo nhóm:** đại lộ 0–0,8 m, phố nhánh 0–1,5 m.
- **Sâu lô theo nhóm:** tiệm 16–20 m, nhà ở 14–17 m. **V: ≥ 95% ô (không phải nhà vườn) có lõi trống ≥ 30% diện tích.**

### 3.4 Không nhà nào giống nhà bên cạnh
- **V:** 0 cặp nhà liền kề cùng model, cùng chiều cao (chênh < 1 m) và cùng màu.
- **V:** ≥ 95% cửa sổ 5 nhà liên tiếp có ≥ 3 model khác nhau và ≥ 2 bậc chiều cao (chênh ≥ 1 m).
- Mỗi loại tiệm có **nhóm 3–4 model** cùng phong cách. Nhà ở mỗi cung có **5–6 model**.
- Model chọn theo hash, rồi **đổi sang model kế tiếp trong nhóm** nếu trùng nhà bên trái.

### 3.5 Chiều cao và tỉ lệ
- **Chiều cao đích (mái):**

  | Cấp đường | Chiều cao |
  |---|---|
  | Đại lộ (32 m) | 8–12 m |
  | Vành (24 m) | 7–11 m |
  | Phố nhánh (12 m) | 6–9 m |
  | Nhà vườn | 6–8 m |

  Nhà góc cộng 2 m. D/H nằm trong khoảng 1–3.
- **Model phóng đều**, không kéo méo: hệ số = mặt tiền lô ÷ bề rộng tự nhiên của model. Nếu chiều cao ra ngoài khoảng đích thì đổi model trong nhóm.
- **V:** ≥ 95% dãy (cạnh ô có ≥ 6 nhà) có độ lệch chuẩn chiều cao ≥ 0,8 m. Chiều cao đích xen kẽ nửa trên và nửa dưới khoảng đích dọc dãy.

### 3.6 Màu
- **Màu nhà** = màu cung × biến thiên từng nhà: độ sáng ±10%, lệch ấm hoặc lạnh ±6%.
- Ở bậc khối xa, mái và tường lệch nhau.

### 3.7 Sân trong
- Mỗi sân trong (lõi ô, lùi 22 m vào từ mép ô) có ≥ 3 cây và 1 trong: giếng, ao, đèn đá. Sân nhà vườn có ao và giả sơn.
- Cây nhân bản thủ tục (không model 70k). Xa hơn 150 m thì ẩn.

### 3.8 Phường có trung tâm
- **V:** ≥ 95% phường có ô quảng trường. Phường ven sông không có sân khô thì dựa vào cầu và quảng trường lân cận (xem chỉ số ≤ 300 m). Sân trong của ô quảng trường là **quảng trường phường**, mở 2 ngõ, có:
  - **sân lát khoảng 30 × 30 m** quanh **đình** (`lib_wood_pavilion` hoặc `bq_music_pav`), có vòng cây; phần còn lại của sân là vườn;
  - **cây đa** lớn, giếng, 2–4 sạp (`lib_stall_timber`);
  - **cổng phường** (`lib_paifang`) ở hai đầu ngõ vào.
- **V:** ≥ 98% cửa nhà cách điểm hoạt động gần nhất ≤ 300 m (quảng trường phường, quảng trường chợ, sảnh, cầu).

### 3.9 Đường có đời sống
- **Đại lộ:** hàng cây hai bên mỗi khoảng 14 m, cột đèn lồng mỗi khoảng 28 m.
- **Vành:** đèn lồng mỗi khoảng 32 m.
- **Tiệm:** biển hiệu treo trước cửa, màu theo nghề. Khoảng 1/4 số tiệm có sạp lấn ra 1,5 m.
- **Đầu cầu:** sạp hai bên. **Quảng trường (chợ, sảnh, trung tâm):** lát đá, hàng cây quanh mép, lưới sạp có mái vải kiểu chợ Biện Kinh.

### 3.10 Tầm nhìn
- Mỗi đại lộ nhìn về một cổng thành (đã có).
- Công trình mốc cao ≥ 3 lần nhà xung quanh, cách nhau 600–1.000 m: 8 sảnh Ngoại Thành (đã có) và **tháp ở 8 quảng trường chợ Trung Thành**.

### 3.11 Hiệu năng
- Ở 4 điểm đo cố định (phố 1 `0,520`; phố 2 `420,0`; phố 3 `700,700`; Sơn Môn `0,40`): fps không giảm quá 10% so với bản trước, lệnh vẽ tăng ≤ 150.
- Đồ phố nhân bản theo loại, dựng theo ô 256 m quanh người chơi.

## 4. Bất biến không được phá
- **Định danh:** id nhà `${cell}:${i}` tất định.
- **Lô mặt tiền lớn:** mọi lô mặt đại lộ, vành, quảng trường là tiệm. Lô góc không đặc biệt là tửu lâu hoặc trà lâu.
- **Dịch vụ mỗi khu:** đủ loại tiệm, đúng 1 Dịch Trạm, 1 Nha Môn, 1 Tiền Trang, 1 miếu.
- **Va chạm và đường đi:** không nhà nào chồng nhau, lấn đường hay đè nước. Mọi cửa đi tới được.
- **Biệt phủ, nhà bán:** biệt phủ g3 cột 0 hàng 0–1, 240 biệt thự, 27 nhà rao bán. Chỉ số h giữ nguyên.
- **Đổi khoá tiệm:** số tiệm hoặc thứ tự đổi thì nâng `guild-core.LAYOUT_VER` (ghế làm việc theo khoá cũ được trả về).

## 5. Kiểm tra
- `node scripts/city-metrics.mjs`: in mọi chỉ số V, thoát mã 1 khi trượt.
- **Bộ ảnh cố định** (mức thường và mức thấp):
  1. toàn cảnh khu từ trên cao
  2. đại lộ ngang tầm mắt
  3. phố nghề
  4. ngõ vào sân trong
  5. quảng trường phường
  6. đầu cầu
- **Nhìn ảnh, không được có:** dải ≥ 4 nhà giống hệt; góc ô vuông trơ; lõi ô trống không cây; phố không biển hiệu, không đèn.
