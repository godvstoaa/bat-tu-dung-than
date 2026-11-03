# HUYỀN QUÁN ONLINE — Spec game "đi xem bát tự phong thủy online"

> Phiên bản spec: 1.1 · 2026-11-03 · Trạng thái: **v1 (single-player, 3D) được build theo spec này**; mục 12 (đồng hiện nhiều người) là Phase 2.
> 1.1: chuyển hiển thị sang **3D góc nhìn thứ ba** với phong cách mỹ thuật riêng «Sơn Mài Huyền Quán» (mục 9). Bản 2D pixel giữ làm dự phòng khi máy không có WebGL.

---

## 1. Bối cảnh nghiên cứu (tháng 10–11/2026)

| Sản phẩm | Cơ chế chính | Vì sao viral | Bài học cho mình |
|---|---|---|---|
| **Sansa** (Hàn Quốc, Park Jin-won 26t) | Web, không cài. Vào phòng → thành chú tiểu tên ngẫu nhiên ("Mây thong thả"). Ngồi bồ đoàn, lạy, lần tràng hạt, nghe Bát Nhã. **Không có chat**. Mỗi phòng 100 người, mỗi bồ đoàn 1 người. Cái lạy của bạn hiện ra trên màn hình người khác. | ~600.000 lượt / 3 ngày, 100k lượt/ngày. "Ngồi cùng nhau mà không nói gì". Người không tôn giáo cũng vào — để làm nền khi làm việc, người hướng nội dám ngồi hàng đầu. | Ma sát bằng 0 · tên ngẫu nhiên dễ thương · im lặng là tính năng · nghi thức ngắn, lặp được · cảm giác "có người cạnh mình". |
| **Niệm Phật Online** (VN) | 3D trình duyệt. Tạo nhân vật, đi trong khuôn viên chùa. Lạy, tràng hạt 108, thiền có hướng dẫn thở, tụng kinh, thắp hương/nến, dâng hoa, thỉnh chuông, thả hoa đăng. Nhiệm vụ ngày/tuần, cấp độ, "công đức", tiền Sen/Ngọc, bảng xếp hạng, bản đồ chùa 3 miền, hộ chiếu hành hương. | Quen thuộc + mới lạ; cộng đồng chế meme ("nạp VIP lên trụ trì", "rớt mạng mất công đức"). | Vòng lặp nhiệm vụ ngày giữ chân · nghi thức tiêu hao vật phẩm tạo nhịp · **phải ghi rõ điểm trong game không phải công đức thật**. |
| Báo chí (Hànộimới, Tuổi Trẻ, Hoa Học Trò) | — | — | Lo ngại **thương mại hoá niềm tin**. Ta tránh: không bán "phúc", không trả tiền để có quẻ tốt. |

Nguồn: hanoimoi.vn, tuoitre.vn, cafef.vn (2 bài), cellphones.com.vn/sforum, afkmobi.com, anonyviet.com, itch.io (gamehihi).

**Khoảng trống thị trường:** chưa ai làm phiên bản "đi xem thầy" — trải nghiệm rất Việt (đi xem bói đầu năm, xin xăm ở đền, hỏi thầy hướng nhà) — nhưng ta đã có sẵn engine Bát Tự / Bát Trạch / Xăm chuẩn cổ pháp trong app. Lợi thế: nội dung **thật, tính theo lá số**, không phải câu chung chung.

---

## 2. Tầm nhìn sản phẩm

**Một câu:** *Một gian huyền quán yên tĩnh trên trình duyệt — bạn dạo bước qua sân, ngồi trước bàn thầy để được lập tứ trụ, xoay la bàn tìm hướng nhà, lắc ống xăm, thắp nén nhang, rồi ngồi uống chén trà.*

**Ba trụ cột cảm xúc:**
1. **Tĩnh** (từ Sansa): không chat, không thông báo ồn ào, âm thanh nền nhẹ, có thể để mở cả ngày.
2. **Nghi thức** (từ Niệm Phật Online): mọi kết quả đi qua một nghi thức ngắn có nhịp (rải thẻ, lắc ống xăm, xin keo) — không bao giờ là "bấm → ra chữ".
3. **Của riêng mình**: mọi luận giải tính từ lá số người chơi, gom vào "Sổ Mệnh" cá nhân.

**Không phải:** không phải app bói đầy đủ (app chính lo việc đó), không phải mạng xã hội, không pay-to-win, không bán "vận may".

---

## 3. Đối tượng

- **Gen Z / millennial 18–35** đang chơi trào lưu đi chùa online, tò mò bát tự nhưng thấy app bói chính "nặng chữ".
- Người dùng hiện tại của app Bát Tự muốn một lối vào nhẹ nhàng mỗi ngày (retention).
- Phiên chơi điển hình: **2–5 phút/ngày** (xem lịch ngày + thắp hương), dài nhất ~15 phút lần đầu (lập lá số).

---

## 4. Thế giới & bố cục

**Huyền Quán** — một khuôn viên 3D đặt trên **đảo đá nổi giữa biển mây**, nhìn theo góc thứ ba (camera bám sau lưng khách, xoay được). Mặt bằng logic vẫn là lưới 20×14 ô (dùng cho va chạm và tìm đường); mỗi ô = 1.6 đơn vị 3D. Toàn bộ mô hình và texture **sinh bằng code** (không file ảnh/mô hình mua ngoài).

```
 ┌──────────────────────────────────────────────┐
 │  [Trà Thất]        [CHÍNH ĐƯỜNG]   [La Bàn Đài]│  ← hàng trên
 │   bồ đoàn ×4       Bàn Thầy Tử Bình  la bàn    │
 │                                                 │
 │  [Ống Xăm]          [Lư Hương]     [Bảng Lịch]  │  ← sân giữa
 │                     (sân gạch)                  │
 │  cây đào            [Hồ Sen]          cây tùng  │
 │                   ════ cổng tam quan ════       │  ← vào từ dưới
 └──────────────────────────────────────────────┘
```

### 4.1 Các trạm (station)

| ID | Tên | Vị trí | Chức năng | Engine |
|---|---|---|---|---|
| `thay` | **Bàn Thầy Tử Bình** (Chính Đường) | trên giữa | Lập tứ trụ, luận ngắn | `analyze()` |
| `labàn` → `compass` | **La Bàn Đài** | trên phải | Mệnh quái Bát Trạch, 4 cát 4 hung hướng | `computeZhai()` |
| `xam` | **Ống Xăm** | giữa trái | Xin xăm 100 thẻ Hoàng Đại Tiên + xin keo | `qiuqian()`, `zhiJiao()` |
| `huong` | **Lư Hương** | giữa | Thắp 3 nén nhang (cháy thật 3 phút) | — |
| `lich` | **Bảng Lịch Ngày** | giữa phải | Can chi hôm nay, âm lịch, ngày cát/hung theo lá số, hướng tốt | `dailyGuidance()`, `lunar-javascript` |
| `tra` | **Trà Thất** | trên trái | Ngồi bồ đoàn, pha trà, hướng dẫn thở, hẹn giờ | — |
| `sen` | **Hồ Sen** | dưới giữa | Thả đèn hoa đăng kèm một điều ước (chỉ lưu máy) | — |
| `so` | **Sổ Mệnh** | (HUD, mở mọi lúc) | Hồ sơ lá số, xăm đã xin, thành tựu | — |

---

## 5. Điều khiển

| Nền tảng | Di chuyển | Camera | Tương tác |
|---|---|---|---|
| Máy tính | WASD / mũi tên (theo hướng camera); **hoặc** click lên nền để đi tới | Kéo chuột để xoay quanh khách, lăn chuột để gần/xa, `Q`/`R` xoay 45° | `E` / `Space` / `Enter` khi đứng gần gian; click trực tiếp vào công trình = đi tới + tự mở |
| Điện thoại | Chạm lên nền để đi tới (chạm = nhấc tay trong 300 ms và lệch < 8 px) | Kéo 1 ngón để xoay, chụm 2 ngón để zoom | Chạm vào công trình = đi tới + tự mở; nút nổi «E · …» ở dưới |
| Bàn phím / trình đọc màn hình | Nút **"☰ Các gian"** trên HUD liệt kê mọi gian (button thật) → dịch chuyển tới và mở | — | — |

- Tìm đường BFS 8 hướng trên lưới (không cắt góc). Tốc độ 3.5 ô/giây; khách quay mặt theo hướng đi (nội suy mượt).
- Camera: góc ngẩng 22–62°, khoảng cách 6–22 đơn vị, bám theo khách có giảm chấn.
- Tên gian hiển thị bằng **nhãn HTML** chiếu từ 3D (chữ tiếng Việt sắc nét), mờ khi xa, đổi màu son khi đứng gần.
- `Esc` đóng mọi bảng.

## 6. Vòng lặp chơi

### 6.1 Lần đầu (onboarding, ≤ 60 giây tới hành động đầu tiên)
1. Màn cổng: tên ngẫu nhiên kiểu Sansa (ghép **tính từ thiên nhiên + danh từ**: "Mây Thong Thả", "Trúc Lặng Lẽ", "Suối Chậm Rãi"...). Nút 🎲 đổi tên, ô sửa tay. Chọn 1 trong 5 màu áo (ngũ hành). **Không bắt nhập ngày sinh ở đây.**
2. Vào sân. Gợi ý nhẹ một dòng: *"Thầy đang ngồi ở Chính Đường. Cứ thong thả."*
3. Ngày sinh chỉ hỏi khi người chơi tự ngồi trước bàn thầy (hoặc khi vào trạm cần lá số: La Bàn, Bảng Lịch → dẫn về bàn thầy).

### 6.2 Vòng ngày (core loop, 2–5 phút)
```
Vào quán → Bảng Lịch (ngày hôm nay hợp mình không?) → Lư Hương (thắp nhang)
        → [tuỳ hứng] xin 1 quẻ xăm / ngồi trà 3 phút / thả đèn
        → nhận Phúc Khí, giữ chuỗi ngày → rời quán
```

### 6.3 Vòng dài
- Tích Phúc Khí → lên danh xưng → mở trang trí nhỏ (màu áo, đèn lồng sân, loại trà).
- Sổ Mệnh đầy dần: lá số chính, lá số người thân (tối đa 5), sổ xăm, đèn đã thả.

---

## 7. Đặc tả từng trạm

### 7.1 Bàn Thầy Tử Bình (`thay`)
**Nhập:** ngày sinh dương lịch (date), giờ sinh (time, có ô "không rõ giờ" → mặc định giờ Ngọ + cảnh báo), giới tính (nam/nữ), nhãn hồ sơ ("Bản thân", "Mẹ"...).
Validation dùng chính lỗi tiếng Việt của `analyze()` (try/catch, hiện lỗi dưới form).

**Nghi thức (≈ 6 giây, bỏ qua được bằng nút "Xem ngay"):**
1. Thầy mài mực (chữ "Thầy đang lập lá số…").
2. 4 thẻ gỗ (Giờ – Ngày – Tháng – Năm, đọc phải→trái theo lối cổ) **lật lần lượt** 0.6s/thẻ, mỗi thẻ: Thiên Can trên, Địa Chi dưới, chữ Hán to + tên Việt + màu ngũ hành; thẻ Ngày có viền son "Nhật Chủ".
3. Thanh ngũ hành 5 cột chạy lên.

**Kết quả (thẻ luận, ≤ 8 dòng, ngôn ngữ đời thường):**
- **Nhật chủ:** `{can} {hành}` + hình ảnh (vd Giáp Mộc = "cây đại thụ", Đinh Hỏa = "ngọn đèn").
- **Thân vượng/nhược:** từ `strength.strong` (true/false/null → "trung hoà").
- **Dụng thần:** `yong.primary` (+ `secondary`), kèm màu/hướng/con số hợp.
- **Kỵ:** `yong.avoid`.
- **Cách cục:** `pattern.vi`.
- **Năm nay:** `liunian` của năm hiện tại → rating + can chi.
- **Đại vận hiện tại:** `dayun` có `startAge ≤ tuổi`.
- Nút **"Luận sâu trong app chính →"** (link `/` — app đầy đủ).
- Nút **"Lưu vào Sổ Mệnh"** (tự lưu hồ sơ đầu tiên làm "Bản thân").

Bảng tra hình ảnh Nhật chủ (10 can):
| Can | Hình ảnh |
|---|---|
| Giáp | cây đại thụ | 
| Ất | dây leo, hoa cỏ |
| Bính | mặt trời |
| Đinh | ngọn đèn, ánh nến |
| Mậu | núi lớn, tường thành |
| Kỷ | ruộng vườn |
| Canh | đao kiếm, quặng thô |
| Tân | trang sức, ngọc |
| Nhâm | sông lớn, biển |
| Quý | mưa móc, sương |

Màu/hướng/số theo hành (dùng cho Dụng thần):
| Hành | Màu | Hướng | Số |
|---|---|---|---|
| Mộc | xanh lá | Đông | 3, 8 |
| Hỏa | đỏ, tím | Nam | 2, 7 |
| Thổ | vàng, nâu | Trung tâm, Đông Bắc, Tây Nam | 5, 0 |
| Kim | trắng, bạc | Tây | 4, 9 |
| Thủy | đen, xanh biển | Bắc | 1, 6 |

**Phúc Khí:** +10 lần đầu lập lá số của mỗi hồ sơ (không cộng khi lập lại).

### 7.2 La Bàn Đài (`compass`)
- Cần hồ sơ (năm sinh + giới tính). Chưa có → nút "Ngồi bàn thầy trước".
- Chọn hồ sơ (dropdown) → `computeZhai(year, gender)`.
- **La bàn vẽ canvas** 8 cung (N, NE, E, SE, S, SW, W, NW), cung cát tô vàng nhạt kèm tên sao (Sinh Khí, Thiên Y, Diên Niên, Phục Vị), cung hung tô xám (Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại). Kéo/xoay bằng chuột/ngón tay; mũi kim chỉ Bắc.
- **Tuỳ chọn cảm biến:** nút "Dùng la bàn điện thoại" → `DeviceOrientationEvent` (iOS cần `requestPermission`), xoay la bàn theo hướng thật. Không có cảm biến → ẩn nút.
- Nội dung: Mệnh quái `guaName`, nhóm `grpVi`, 5 dòng `advice`.
- **Phúc Khí:** +5/ngày lần đầu xem.

### 7.3 Ống Xăm (`xam`)
- Ô câu hỏi (tuỳ chọn, ≤ 120 ký tự) + chọn chủ đề: Công danh / Tài lộc / Tình duyên / Chung.
- **Nghi thức:**
  1. Bấm giữ (hoặc lắc điện thoại — `devicemotion`, gia tốc > 15) để **lắc ống**: ống rung, tiếng thẻ lách cách, thanh lắc đầy dần 1.5–2.5s (ngẫu nhiên) → 1 thẻ rơi ra, hiện số.
  2. **Xin keo** xác nhận (`zhiJiao()`): 2 miếng keo tung lên.
     - Thánh Giáo (CÓ) → nhận thẻ, mở thơ xăm.
     - Tiếu / Âm Giáo → "Thần chưa chấp nhận thẻ này — lắc lại." (theo lệ ở đền: phải được keo thánh mới nhận thẻ).
     - Lắc lại tối đa 3 lần/phiên; lần thứ 3 không được keo thánh → "Hôm nay chưa đủ duyên, mai hãy quay lại." (vẫn ghi vào sổ là "chưa nhận").
- Số thẻ: `randomStick` thông qua `qiuqian(question, { deterministic: false })` — ngẫu nhiên thật (tôn trọng nghi thức, không hash).
- **Kết quả:** số thẻ, bậc (`toneVi`), thơ (`poem`), điển cố (`story`), luận theo chủ đề (`career`/`wealth`/`love`/`overall`), nên/tránh.
- **Giới hạn:** 3 lần nhận thẻ/ngày. Không có cách mua thêm.
- **Phúc Khí:** +3 mỗi lần nhận thẻ (tối đa 3 lần/ngày).

### 7.4 Lư Hương (`huong`)
- Bấm "Thắp nhang" → 3 nén cắm vào lư, khói bay (particle). Nhang cháy **thật 3 phút** (thời gian thực, lưu `litAt` — rời game rồi quay lại vẫn thấy đúng độ cháy).
- Trong lúc cháy: hiện câu tĩnh tâm ngẫu nhiên (danh sách ≥ 12 câu, trung tính, không gắn tôn giáo cụ thể).
- Đang cháy → không thắp chồng.
- **Phúc Khí:** +5, 1 lần/ngày.

### 7.5 Bảng Lịch Ngày (`lich`)
- Luôn hiện (không cần hồ sơ): ngày dương, âm lịch, can chi ngày/tháng/năm, tiết khí hiện tại, giờ Hoàng Đạo hôm nay (từ `lunar-javascript`: `getDayYi`, `getDayJi`, giờ cát `getTimes`... dùng `Lunar.getTimeZhiIndex`/`LunarTime.getTianShenLuck()` nếu có, fallback ẩn).
- Có hồ sơ → thêm phần cá nhân từ `dailyGuidance(R)`: điểm/100 + verdict (vòng tròn màu), "Nên" (`yi`), "Tránh" (`ji`), hướng tốt (`goodDir` tối đa 3).
- **Phúc Khí:** +2, 1 lần/ngày.

### 7.6 Trà Thất (`tra`)
- Nhân vật ngồi xuống bồ đoàn (sprite ngồi). Chọn thời lượng: 1 / 3 / 5 / 10 phút.
- Chọn trà (mở theo danh xưng): Trà Sen → Trà Lài → Trà Ô Long → Trà Shan Tuyết. Chỉ là màu chén + tên.
- Vòng thở hướng dẫn 4-4-6 (hít 4 – giữ 4 – thở 6) dạng vòng tròn phồng/xẹp.
- Hết giờ: tiếng chuông nhỏ, "Chén trà đã nguội."
- Thoát giữa chừng được, thời gian ngồi vẫn tính phần đã ngồi (≥ 1 phút mới tính).
- **Phúc Khí:** +1 mỗi phút, **tối đa 15/ngày** (giống giới hạn ngồi tĩnh của Niệm Phật Online — chống treo máy cày điểm).

### 7.7 Hồ Sen (`sen`)
- Viết 1 điều ước (≤ 80 ký tự) → đèn hoa đăng thả xuống hồ, trôi chậm sang phải rồi mờ dần (đèn của hôm nay vẫn trôi khi quay lại trong ngày).
- Chỉ lưu localStorage, **không gửi đi đâu** (ghi rõ dưới ô nhập).
- 1 đèn/ngày. **Phúc Khí:** +3.

### 7.8 Sổ Mệnh (HUD)
Tab: **Hồ sơ** (tối đa 5, xoá được) · **Xăm đã xin** (30 gần nhất) · **Đèn đã thả** · **Thành tựu** · **Cài đặt** (âm thanh bật/tắt, đổi tên, xoá toàn bộ dữ liệu — có xác nhận).

---

## 8. Tiến trình

### 8.1 Phúc Khí (đơn vị duy nhất)
- **Không mua được bằng tiền. Không có tiền tệ thứ hai.**
- Dòng ghi chú cố định trong Sổ Mệnh: *"Phúc Khí chỉ là điểm ghi nhận bạn ghé quán trong trò chơi — không phải phúc đức hay vận may thật, và không làm quẻ tốt hơn."*
- Trần mỗi ngày tự nhiên: 10 (lá số, 1 lần/hồ sơ) + 5 + 9 + 5 + 2 + 15 + 3 ≈ **39 + nhiệm vụ**.

### 8.2 Danh xưng
| Phúc Khí | Danh xưng | Mở khoá |
|---|---|---|
| 0 | Khách Vãng Lai | Trà Sen, áo 5 màu |
| 30 | Khách Quen | Trà Lài |
| 100 | Môn Sinh | Trà Ô Long, đèn lồng đỏ ở sân |
| 250 | Đệ Tử | Trà Shan Tuyết, hoa đào nở quanh năm |
| 500 | Tri Âm Huyền Quán | Viền vàng trên tên, chim hạc đậu mái |

### 8.3 Nhiệm vụ ngày (3 cố định, reset 0h giờ máy)
1. Xem Bảng Lịch hôm nay.
2. Thắp một tuần nhang.
3. Ngồi Trà Thất ít nhất 3 phút.
Hoàn thành cả 3 → +5 Phúc Khí + giữ **chuỗi ngày** (streak). Lỡ 1 ngày → chuỗi về 0, không phạt gì khác.

### 8.4 Thành tựu (12)
| ID | Tên | Điều kiện |
|---|---|---|
| first_chart | Lần đầu gặp thầy | lập lá số đầu tiên |
| family | Gia phả nhỏ | 3 hồ sơ |
| compass | Biết đường về | xem La Bàn |
| first_stick | Thẻ đầu tiên | nhận 1 thẻ xăm |
| top_stick | Thượng thượng | nhận thẻ 上上签 |
| patience | Kiên nhẫn | bị từ chối keo 3 lần trong một phiên |
| incense7 | Hương khói | thắp nhang 7 ngày khác nhau |
| tea60 | Trà đạo | tổng 60 phút ngồi trà |
| lantern5 | Đèn trôi | thả 5 đèn |
| streak3 | Ba ngày liền | chuỗi 3 |
| streak7 | Một tuần thong thả | chuỗi 7 |
| walker | Dạo quán | ghé đủ 7 trạm |

Thông báo thành tựu: toast nhỏ góc dưới, tự tắt 3s, không âm thanh to.

---

## 9. Mỹ thuật — phong cách «Sơn Mài Huyền Quán» (3D)

### 9.1 Nguyên tắc riêng (không đụng chạm)
- **Không sao chép** bố cục, nhân vật, giao diện của Sansa (2D tối giản, chú tiểu) hay Niệm Phật Online (chánh điện 3D tả thực). Huyền Quán **không phải chùa**: là *thư quán của thầy địa lý / tử bình* — nhà rường gỗ, sân đá, la bàn khổng lồ.
- **Không có tượng Phật, tượng thần, biểu tượng tôn giáo cụ thể** trong cảnh; không chữ vạn, không kinh sách. Hoạ tiết chỉ dùng: bát quái, la bàn 24 sơn, ngũ hành, mây, sóng nước.
- Thầy là nhân vật hư cấu, không mặc pháp phục tôn giáo.
- Toàn bộ hình khối/texture tự sinh bằng code → không vướng bản quyền tài sản.

### 9.2 Ngôn ngữ hình ảnh
Lấy cảm hứng **tranh sơn mài Việt** (nền đen–son, dát vàng quỳ, khảm vỏ trứng) chuyển sang 3D low-poly «điêu khắc»:

| Yếu tố | Cách làm |
|---|---|
| Bảng màu | Đen sơn `#120d10`, son `#9e1b14`, cánh gián `#5a2a14`, vàng quỳ `#d9a441`, trắng vỏ trứng `#efe6d2`, lam ngọc `#1d4b57` |
| Gỗ | Texture sơn mài sinh bằng canvas: nền son/đen + vân mài + chấm vàng quỳ; roughness ~0.4 |
| Đá sân | Lát đá vuông, mạch khảm vỏ trứng (đường gãy ngẫu nhiên) |
| Đổ bóng | Bóng mềm từ một nguồn sáng chính (PCF soft), ánh viền ấm từ đèn lồng |
| Không khí | Sương tím-than theo khoảng cách, biển mây dưới đảo, bụi vàng lơ lửng, đom đóm về đêm, cánh đào rơi |
| Chữ | Chỉ chữ trang trí: 玄館 (biển quán), 24 sơn trên la bàn, can chi ngày trên bảng lịch |

### 9.3 Biểu tượng riêng
- **Thiên Bàn**: vòng la bàn khổng lồ dát vàng lơ lửng phía sau Chính Đường, 3 vòng đồng tâm xoay ngược chiều (bát quái · 12 chi · 24 sơn). Lập xong lá số → Thiên Bàn sáng màu Dụng thần của khách trong vài giây.
- **Đảo nổi**: khuôn viên trên khối đá lơ lửng giữa biển mây, có đá treo nhỏ trôi quanh.
- **Đèn trời**: vài chục đèn giấy bay chậm quanh đảo (instanced); đèn hoa đăng khách thả trôi thật trong hồ 3D.

### 9.4 Danh mục mô hình (procedural)

| Mô hình | Chi tiết tối thiểu |
|---|---|
| Chính Đường | nền đá bậc, hàng cột sơn son, xà, vách gỗ ô hộc, cửa giữa, mái cong 2 tầng đầu đao vểnh, ngói ống, bờ nóc vàng, biển 玄館, đèn lồng |
| Bàn thầy | án thư, giấy, nghiên mực, thầy ngồi (áo dài tối, khăn xếp, râu bạc) |
| Trà Thất | thuỷ tạ 4 cột, mái cong, sàn gỗ, bàn trà thấp, ấm + chén, 4 bồ đoàn |
| La Bàn Đài | bệ đá tròn bậc, đĩa la bàn texture nhiều vòng có chữ, kim đỏ, 8 cột mốc quẻ bát quái |
| Ống Xăm | án sơn son phủ khăn, ống tre với thẻ, 2 nến (ánh sáng lập loè) |
| Lư Hương | đỉnh đồng 3 chân 2 quai, khói khi nhang cháy, nhang ngắn dần theo thời gian thực |
| Bảng Lịch | khung gỗ, giấy đỏ ghi ngày dương, âm lịch, can chi (texture đổi theo ngày) |
| Hồ Sen | bờ đá, mặt nước gợn, lá + hoa sen, đèn hoa đăng của khách |
| Cây | đào (thân + tán hoa, hoa rơi), tùng (tầng tán), cụm trúc |
| Tường & cổng | tường thấp có ngói, cổng mái cong 3 gian |
| Khách | áo màu ngũ hành đã chọn, đầu, tóc búi, nón lá; animation đi và ngồi |

### 9.5 Ánh sáng theo giờ thật

| Giờ | Trời / sương | Ánh sáng |
|---|---|---|
| 6–16h | lam nhạt pha vàng, sương mỏng | nắng ấm, bóng rõ |
| 16–19h | hoàng hôn cam–tím | mặt trời thấp, bóng dài, đèn lồng sáng dần |
| 19–5h | tím than, sao, trăng | ánh trăng lạnh + đèn lồng ấm, đom đóm |

### 9.6 Âm thanh
Tổng hợp bằng WebAudio (không file): chuông nhỏ, tiếng gỗ, thẻ xăm, gió nền. Mặc định **tắt** đến khi bấm 🔈.

### 9.7 Hiệu năng & dự phòng
- Mục tiêu ≥ 50 fps trên laptop đồ hoạ tích hợp / điện thoại tầm trung: gộp hình học + instancing, 1 đèn đổ bóng, pixel ratio ≤ 2 (≤ 1.5 trên điện thoại), dừng render khi tab ẩn.
- Tự hạ chất lượng: fps trung bình 3 giây < 35 → tắt bóng và hạt.
- Không có WebGL → tự dùng renderer 2D pixel (bản đầu) — vẫn chơi đủ.
- `prefers-reduced-motion`: Thiên Bàn đứng yên, tắt hạt, camera không tự trôi.

## 10. Kiến trúc kỹ thuật (v1)

- **Trang riêng** `game.html` (Vite multi-page) → URL `/game.html`. Không đụng `main.js` (app chính đang có thay đổi chưa commit).
- Web: `game.html` gọi `mountGame()`. iOS: tab «Học Quán» trong vỏ Lữ Đăng mở overlay gọi cùng `mountGame()`; cờ `features.js` tắt gian bói (xăm, hoa đăng) và đổi từ ngữ (xem `GAME-MMO-PROMPT-PLAN.md` §B1).
- Thư mục `src/game/`:
  | File | Trách nhiệm |
  |---|---|
  | `main.js` | khởi tạo, vòng lặp `requestAnimationFrame`, input |
  | `world.js` | bản đồ lưới, vật cản, vị trí trạm, tìm đường BFS |
  | `render3d.js` | Three.js: cảnh, camera thứ ba, ánh sáng theo giờ, chọn điểm (raycast), nhãn HTML |
  | `models.js` | mô hình procedural: công trình, cây, khách, thầy, Thiên Bàn, đảo, hồ |
  | `textures.js` | texture canvas: sơn mài, đá khảm, la bàn, bảng lịch, biển hiệu |
  | `render.js` | renderer 2D pixel — dự phòng khi không có WebGL |
  | `stations.js` | UI từng trạm (DOM panel), gọi engine |
  | `state.js` | lưu/đọc localStorage, Phúc Khí, nhiệm vụ, thành tựu, reset ngày |
  | `audio.js` | âm thanh WebAudio |
  | `names.js` | sinh tên ngẫu nhiên, câu tĩnh tâm |
  | `game.css` | style HUD/panel |
- Engine import trực tiếp: `../engine/chart.js`, `../engine/zhai.js`, `../engine/daily.js`, `../engine/qiuqian.js`, `../engine/constants.js`, `lunar-javascript`.
- **Lưu trữ:** key `huyenquan:v1` trong localStorage, một object JSON:
  ```js
  {
    v: 1,
    player: { name, robe /* 木|火|土|金|水 */, createdAt },
    profiles: [{ id, label, year, month, day, hour /* null = không rõ */, minute, gender /* 'nam'|'nữ' */ }],
    phucKhi: 0,
    daily: { date: 'YYYY-MM-DD', got: { lich, huong, compass, lantern, tasksBonus }, teaMin, sticks, chartIds: [] },
    incense: { litAt /* ms */ | null },
    tea: { totalMin },
    sticks: [{ num, tone, accepted, question, topic, at }],   // ≤ 30
    lanterns: [{ wish, at }],                                    // ≤ 50
    stationsVisited: [ids],
    incenseDays: ['YYYY-MM-DD'],                                 // ≤ 400
    streak: { count, lastDate },
    achievements: { [id]: atMs },
    settings: { sound: false },
  }
  ```
  Đọc lỗi/hỏng → khởi tạo lại (giữ bản hỏng dưới key `huyenquan:v1:corrupt` để không mất trắng).
- **Ngày** = ngày theo giờ máy người chơi (`YYYY-MM-DD` local). Đổi ngày khi đang chơi → reset `daily` ở lần hành động kế tiếp.
- **Thư viện:** `three` (r170) — dependency duy nhất thêm vào, tách chunk riêng, chỉ trang game tải.
- **Hiệu năng:** xem 9.7.
- **Không mạng ở v1:** game chạy offline hoàn toàn sau khi tải. Không gửi dữ liệu sinh ra ngoài.

---

## 11. Đạo đức & an toàn nội dung

1. Mọi luận giải kèm câu nhỏ: *"Để tham khảo và chiêm nghiệm, không thay quyết định của bạn."*
2. Không có bất kỳ giao dịch tiền nào ở v1. Phase sau nếu có thu phí: chỉ trang trí, **không bao giờ** bán lượt xăm, Phúc Khí hay "giải hạn".
3. Không dùng ngôn ngữ doạ ("đại hạn", "chết", "tai hoạ") ở lớp game — map rating của engine sang từ mềm: Đại cát → "Rất thuận", Đại hung → "Nên thủ, giữ sức".
4. Dữ liệu ngày sinh chỉ nằm trên máy. Có nút xoá toàn bộ.
5. Điều ước ở Hồ Sen không bao giờ rời máy.

---

## 12. Phase 2 — Đồng hiện (presence) kiểu Sansa *(chưa build)*

- Cloudflare **Durable Object** `QuanRoom` (1 object/phòng, 50 người/phòng), WebSocket từ worker hiện có (`worker/index.js`, route `/ws/quan?room=n`).
- Gói tin (JSON, ≤ 200 B): `join {name, robe}` · `move {x,y}` (≤ 5/s, chỉ ô lưới) · `act {type: incense|bow|tea|lantern}` · `leave`. **Không có tin nhắn văn bản.**
- Server chỉ chuyển tiếp vị trí + hành động; không nhận ngày sinh, không nhận điều ước.
- Mỗi bồ đoàn ở Trà Thất 1 người (khoá trên server, sửa đúng bug Sansa gặp: 2 người 1 bồ đoàn).
- Hiệu ứng "Đồng tâm": ≥ 3 người thắp nhang trong 60s → khói lư hương dày hơn với tất cả.
- Hiển thị số người thật đang ở trong quán. **Không bao giờ giả lập người chơi ảo.**
- Rate limit theo IP + `CF-Connecting-IP`, đóng kết nối khi spam.

## 13. Phase 3 (ý tưởng)
- "Hành hương": các quán theo vùng (Huyền Quán Hà Nội / Huế / Sài Gòn) với lịch lễ tết riêng.
- Hợp hôn mini: hai hồ sơ ngồi chung bàn thầy.
- Sự kiện theo tiết khí (Lập Xuân, Đông Chí) — đổi cảnh sân.

---

## 14. Tiêu chí nghiệm thu v1

| # | Tiêu chí | Cách kiểm |
|---|---|---|
| A1 | Mở `/game.html` → cổng, đặt tên → vào sân trong ≤ 3 thao tác | tay + Playwright |
| A2 | Đi bằng WASD (theo hướng camera), click-to-walk, tap; không xuyên công trình; kéo xoay camera không bị hiểu nhầm thành click | tay + Playwright |
| A3 | 7 trạm mở được bằng đi tới + E, click trạm, và menu "☰ Các gian" | Playwright |
| A4 | Lập lá số 1995-06-15 08:30 nam → tứ trụ 乙亥 / 壬午 / ... khớp `analyze()` app chính; dụng thần Thủy | so trực tiếp với engine |
| A5 | Ngày không tồn tại (2025-02-29) → lỗi tiếng Việt, không crash | tay |
| A6 | Xăm: keo không thánh → bắt lắc lại; 3 lần trượt → "chưa đủ duyên"; tối đa 3 thẻ/ngày | Playwright (mock random) |
| A7 | Nhang cháy theo thời gian thực, reload vẫn đúng độ cháy | tay |
| A8 | Phúc Khí cộng đúng giới hạn/ngày; trà tối đa 15/ngày | unit test `state.js` |
| A9 | Đổi ngày → nhiệm vụ reset, streak tính đúng (liên tiếp / đứt) | unit test |
| A10 | Reload giữ toàn bộ tiến trình; localStorage hỏng không làm trắng trang | tay |
| A11 | Không có request mạng nào ngoài tải trang | DevTools / Playwright |
| A12 | `npm run build` thành công; bản iOS mở game qua tab «Học Quán» (overlay, không phải `game.html`), gian bói tắt — xem `GAME-MMO-PROMPT-PLAN.md` | build + verify:ios-path |
| A13 | Không lỗi console khi chơi hết các trạm | Playwright |
| A14 | Màn hình 375px dùng được (panel full-width, chạm đi được) | Playwright mobile viewport |
| A15 | Cảnh 3D đủ mô hình mục 9.4, Thiên Bàn xoay, ánh sáng đổi theo giờ | screenshot |
| A16 | Không có WebGL → tự chạy bản 2D | Playwright |
| A17 | Không có hình tượng tôn giáo cụ thể trong cảnh | soát tay |
