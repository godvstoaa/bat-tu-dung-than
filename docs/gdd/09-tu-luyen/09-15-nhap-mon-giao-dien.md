# 09-15 · Bảy ngày đầu, hé mở dần và giao diện của hệ tu

> Hệ tu có nhiều lớp (Đạo Hạnh, trần, Dư Hương, Nhật Khóa, Nguyên Khí, NT, hợp Dụng, Tu độ, ngày củng cố, công, độ kiếp). Đổ tất cả lên người mới trong giờ đầu là cách chắc chắn để họ bỏ đi. Phần này định **thứ tự hé mở** từng lớp, hành trình bảy ngày đầu, và bố cục giao diện (khung chức năng — tài liệu 12 vẽ mỹ thuật, cấp `UI-xx`).

---

## 1. Nguyên tắc hé mở dần

| # | Nguyên tắc | Hệ quả |
|---|---|---|
| H1 | Một khái niệm mới **chỉ hiện khi người chơi vừa chạm vào nó** | trần ngày chỉ giải thích lần đầu chạm trần; Dư Hương chỉ hiện lần đầu có dư |
| H2 | Mỗi phiên tối đa **hai** khái niệm mới | giờ đầu: Sổ Tu + Nhật Khóa; ngày 2: Nguyên Khí + NT |
| H3 | Khái niệm được **người** giới thiệu, không phải hộp thoại hệ thống | Lão Tùng, Thầy Tử Bình, Vân Cốc nói; hộp thoại hệ thống chỉ là chú thích |
| H4 | Số liệu chi tiết nằm sau một lần chạm («Vì sao?») | màn hình chính chỉ hiện tên bậc, thanh ĐH, ba chấm Nhật Khóa, thanh NK |
| H5 | Không có thông báo đẩy trong 3 ngày đầu, trừ khi người chơi bật | tránh cảm giác bị đòi |
| H6 | Người chơi cũ (ân cựu khách — `09-01` §7.4) xem bản rút gọn | một lá thư + ba thẻ, bỏ qua hướng dẫn |

---

## 2. Lịch hé mở

| Thứ tự | Khái niệm | Điều kiện xuất hiện | Ai giới thiệu | Câu chính |
|---|---|---|---|---|
| 1 | **Sổ Tu** (tab mới trong Sổ Mệnh) + **Đạo Hạnh** | xong cảnh Mở đầu đầu tiên có thưởng thô (tài liệu 03) | Lão Tùng | «Phúc Khí là tiền tiêu trong quán. Đạo Hạnh là cái con tích trong người. Cái thứ hai không ai lấy được, không ai bán được.» |
| 2 | **Nhật Khóa** | sau việc đầu tiên thuộc một nhóm pháp môn | Lão Tùng | «Mỗi ngày ba việc khác nhau: một việc tĩnh, một việc tay, một việc giúp người… Đủ ba là một ngày không uổng.» |
| 3 | **Tên bậc** và thanh tới bậc 2 | ngay sau 2 | Sổ Tu | «Phàm Nhân · còn <n> tới Nhập Môn» |
| 4 | **Nguyên Khí** | lượt đầu tiên làm Nguyên Khí giảm dưới 90, hoặc lần đầu pha trà | Lão Tùng | «Làm nhiều thì mỏi. Mỏi thì uống trà. Đơn giản thế thôi.» |
| 5 | **Hệ số Nghịch Thiên** | lần đầu mở trang chi tiết ĐH, hoặc ngày thứ 2 | Thầy Tử Bình | câu canon §4.7 + câu theo khoảng NT (`09-03` §3.3) |
| 6 | **Độ kiếp** | lần đầu đủ D1 bậc 2 | Lão Tùng | «Cửa núi mở rồi. Gõ đi.» |
| 7 | **Lễ đặt danh** | ngay sau độ kiếp bậc 2 | thầy của cửa nhập môn | `09-13` §2 `MG-10.0` |
| 8 | **Đạo thống**, **hợp Dụng** | sau lễ đặt danh | thầy + Sổ Tu | «Chín con đường. Hai đường cùng hành với Dụng thần con — gió xuôi. Còn lại cũng là đường.» |
| 9 | **Tu độ** | khi nhập môn một đạo | thầy của đạo | «Ở núi này, con bắt đầu từ Sơ Học.» |
| 10 | **Trần ngày** | lần đầu chạm trần | Sổ Tu | «Hôm nay tu đủ rồi. Phần dư thầy cất vào lư hương.» |
| 11 | **Dư Hương** | sáng hôm sau lần đầu có dư | Sổ Tu + làn hương ở lư | «Lư hương còn chút hương hôm qua.» |
| 12 | **Ngày củng cố** | lần đầu đủ ĐH mà thiếu ngày tu | Sổ Tu | «Củng cố <x> / <y> ngày tu. Đi cho mềm giày đã.» |
| 13 | **Công đức** trong điều kiện | lên bậc 3 (vì bậc 4 cần công) | thầy | «Lên bậc tới cần làm việc thiện. Ít thôi — nhưng thật.» |
| 14 | **Thiên Bảng** | lên bậc 2 | Sổ Tu (tab) | «Bảng xếp theo Đạo Hạnh. Hạt giống không xếp hạng.» |
| 15 | **Quy nhất** | lên bậc 4 | thầy | «Muốn lên Côn Lôn phải đi qua ba con đường.» |
| 16 | **Cảnh giới bất ổn**, **sám hối** | lần đầu phạm giới | Sổ Tu + NPC gần đó | `09-13` §6 |
| 17 | **Nợ Âm**, Tà Lộ | lần đầu được mời Âm Bài (tài liệu 05) | người của Định Mệnh Hội | (tài liệu 05) |

---

## 3. Hành trình bảy ngày đầu (người chơi «đều đặn», lá số `MAU-A`)

Số liệu từ nhật ký mô phỏng `09-12` §5 (ĐH đã nhân NT 1,19).

| Ngày | Phiên | Việc chính | Khái niệm mới | ĐH cuối ngày | Bậc |
|---|---|---|---|---|---|
| 1 | 2 phiên (≈ 50 phút) | cảnh Mở đầu: vào cổng, lập lá số bản thân, ngồi Bàn Thầy, giải án đầu tiên, Trà Thất | Sổ Tu, Đạo Hạnh, Nhật Khóa, tên bậc | ≈ 49 | 1 |
| 2 | 2 phiên | Thái Cực ở sân, đánh chuông sáng, án khách; **độ kiếp bậc 2** (`ACT-K2-*`), lễ đặt danh | Nguyên Khí, NT, độ kiếp, đạo hiệu | ≈ 98 → lên bậc 2 | 2 |
| 3 | 2 phiên | chọn đạo chính (gợi ý `TV` — hợp Dụng Thủy); chưa bay được nên đi bộ tới Võ Đang (≈ 1,5 km, có trạm trà giữa đường); nhập môn, chương tu 1 | đạo thống, hợp Dụng, Tu độ, Thiên Bảng | ≈ 212 | 2 |
| 4 | 2 phiên | hái thuốc, tĩnh tọa ở Tử Tiêu (Sung Mãn), án khách | — (củng cố thói quen) | ≈ 266 | 2 |
| 5 | 2 phiên | Hương thí ở Thư Lâu, pha trà (chưa chạm trần: 25,6 thô MG < trần bậc 2 là 30) | — | ≈ 320 | 2 |
| 6 | nghỉ | — | — | — | — |
| 7 | 2 phiên | thiếu 9 ĐCG tới bậc 3; Sổ Tu: «còn một chút nữa» | — | ≈ 375 | 2 |
| 8 | 2 phiên (thứ Hai) | lễ tuần đầu tiên ở Võ Đang, chương Mệnh Đồ, đồng tu; **độ kiếp bậc 3** (`ACT-K3-TV`); **ngự kiếm** | việc tuần, trần ngày (lần đầu chơi dài), ngự kiếm | ≈ 478 → bậc 3 | 3 |

**Nhịp cảm xúc dự kiến:** ngày 1 «quán này thật đẹp»; ngày 2 «mình đã có đạo hiệu»; ngày 3 «mình chọn đường của mình»; ngày 4–7 «mình đang tiến»; ngày 8 «mình bay được». Không ngày nào trong tuần đầu có bức tường (thiếu điều kiện kéo dài > 1 ngày).

**Nếu người chơi «thong thả»:** bậc 2 ở ngày 4, bậc 3 ở ngày 15 (`09-10` §2.1). Khoảng ngày 5–14 dài: lấp bằng chương tu đạo thống (mở ở bậc 2) và cốt truyện Hồi I; Sổ Tu hiện **mốc gần** (vd «còn 40 ĐH tới bậc 3» thay vì «còn 7 ngày»).

---

## 4. Các bước hướng dẫn trong giờ đầu

| Bước | Kích hoạt | Người nói | Việc người chơi làm | Xong khi | Bỏ qua được? |
|---|---|---|---|---|---|
| 1 | vào cổng lần đầu (đã có trong game) | Lão Tùng | đi tới Bàn Thầy | tới nơi | không (cốt truyện) |
| 2 | lập lá số bản thân | Thầy Tử Bình | nhập ngày giờ sinh | lá số hiện | không |
| 3 | lá số hiện | Thầy Tử Bình | nghe giải Mệnh Bàn (Tiềm Lực, Phẩm căn) | đóng thẻ | có |
| 4 | sau bước 3 | Lão Tùng | thắp nhang (`ACT-003`) | thắp | có |
| 5 | sau thắp nhang | Sổ Tu | xem tab Tu: ĐH vừa nhận | mở tab | có |
| 6 | sau bước 5 | Lão Tùng | giải án khách đầu tiên (đã có `case-ui.js`) | xong án | không (Nhật Khóa cần) |
| 7 | xong án | Lão Tùng | pha trà (`MG-14` mức Sơ) | mời trà | có |
| 8 | đủ ba nhóm (Lễ, Hạnh, Tĩnh) | Sổ Tu | xem Nhật Khóa sáng đủ ba chấm | tự động | — |
| 9 | Nguyên Khí đã giảm và tăng lại | Lão Tùng | đọc thanh NK | tự động | — |
| 10 | kết thúc phiên đầu | Lão Tùng | rời quán | — | — |

Không có bước nào giải thích công thức. Ai muốn xem công thức: nút «Vì sao?» trong Sổ Tu (§6.4).

---

## 5. Bố cục màn hình chính (HUD) của hệ tu

### 5.1 Điện thoại (dọc)

```
┌────────────────────────────┐
│ ◐ Nhập Môn ▓▓▓▓░░ 266/400   │ ← huy hiệu bậc (màu hành Dụng) + thanh tới bậc kế
│ ● ● ○  Nhật Khóa            │ ← ba chấm (màu nhóm) — chạm mở danh sách gợi ý
│                            │
│                            │
│        (thế giới 3D)        │
│                            │
│                            │
│ ▕██████████▏ Nguyên Khí 82  │ ← thanh NK (viền sáng khi Sung Mãn)
│ [Sổ] [Bản đồ] [Túi] [⋯]     │ ← thanh dưới (đã có Sổ Mệnh)
└────────────────────────────┘
```

### 5.2 Máy tính

```
┌──────────────────────────────────────────────────────────────┐
│ ◐ Luyện Tinh Hóa Khí · Thủ Lô (Võ Đang)   ▓▓▓▓▓▓▓░░ 812/1.000   │
│ ● ● ○ Nhật Khóa       Trần hôm nay 22/32     Dư Hương 6          │
│                                                              │
│                         (thế giới 3D)                         │
│                                                              │
│ Nguyên Khí ▕█████████░▏ 82 · Sung Mãn                           │
│ [S] Sổ Tu  [M] Bản đồ  [I] Dược Lâu  [Esc] Cài đặt              │
└──────────────────────────────────────────────────────────────┘
```

Trên máy tính có thêm «Trần hôm nay» và «Dư Hương» vì màn hình rộng; trên điện thoại hai số này ở trong Sổ Tu.

### 5.3 Trạng thái thị giác của HUD

| Trạng thái | Biểu hiện |
|---|---|
| Thời khắc đã tới (đủ D1–D4) | huy hiệu bậc tỏa sáng nhẹ, nhịp như hơi thở (không nhấp nháy gắt) |
| Củng cố | thanh bậc đầy nhưng có vạch «ngày tu x / y» |
| Cảnh giới bất ổn | huy hiệu mờ 50% |
| Có Nợ Âm | viền huy hiệu xám, chạm xem chi tiết |
| Sung Mãn | thanh NK có viền màu hành Dụng |
| Hư | thanh NK nhạt |
| Kiệt | thanh NK xám, Lão Tùng xuất hiện gần nhất mời trà (một lần / ngày) |
| Chạm trần | thanh tới bậc có biểu tượng lư hương nhỏ |

### 5.4 Trợ năng HUD

- Mọi thanh có số; màu luôn kèm chữ / ký hiệu (`09-03` §13.3).
- Đọc màn hình: huy hiệu đọc «Bậc 3, Luyện Tinh Hóa Khí, 812 trên 1.000 Đạo Hạnh, Nhật Khóa 2 trên 3, Nguyên Khí 82, Sung Mãn».
- Chế độ «HUD tối giản»: chỉ hiện huy hiệu bậc; mọi thứ khác trong Sổ Tu.
- Cỡ chữ HUD theo cài đặt app.

---

## 6. Sổ Tu — các trang

### 6.1 Trang «Tu» (tổng quan)

Như `09-01` §9.

### 6.2 Trang «Đạo thống»

```
┌────────────────────────────────────────────────────┐
│ ĐẠO THỐNG                                  Quy nhất 2/3 │
│ ─────────────────────────────────────────────────── │
│ ★ Thanh Vi · Đan Đỉnh (chính)   水 hợp Dụng ×1,10       │
│   Tu độ 912 · Thâm Nhập  ▓▓▓▓▓▓░░░ tới Viên Thông 2.000 │
│   Chương tu: 4/5   Lễ tuần: Thứ Bảy 14/11 giờ Dậu      │
│ ○ Bắc Đế · Động Uyên (phụ)      水 hợp Dụng ×1,10       │
│   Tu độ 268 · Nhập Thất ✓                             │
│ ○ Tịnh Độ (phụ)                  金 hợp Hỷ ×1,05        │
│   Tu độ 141 · Sơ Học  ▓▓░░░ tới Nhập Thất 250           │
│ ─────────────────────────────────────────────────── │
│ [Thêm đạo phụ]  [Cải tông (còn 12 ngày)]  [Chín đạo]   │
└────────────────────────────────────────────────────┘
```

### 6.3 Trang «Độ kiếp»

Danh sách các lần độ kiếp: ngày, đạo, số lần thử, người hộ pháp, câu thầy nói (`09-13` §5). Độ kiếp đang mở hiện ba pha với trạng thái từng pha (đạt / chưa / chờ 20 giờ).

### 6.4 Trang «Vì sao?» (giải trình Đạo Hạnh)

Liệt kê 100 bản ghi `dh_gain` gần nhất (`09-12` §2.5) ở dạng câu: «Pha trà được 3,6 điểm tu. Hạt giống của con nhân 1,19; khí đang sung nhân 1,1. Thành 4,7.» Có bộ lọc theo ngày, theo nguồn. Đây là trang dành cho người tò mò và cho đội hỗ trợ khi người chơi khiếu nại «sao hôm nay được ít».

### 6.5 Trang «Thiên Bảng»

Ba tab: Đạo Hạnh đời · Mùa này · Môn phái. Cột: hạng, đạo hiệu, bậc (huy hiệu họ), ĐH. **Không** có cột Tiềm Lực ở bảng chính (canon: bảng chính xếp theo Đạo Hạnh); chạm vào một người xem được Phẩm căn của họ nếu họ để công khai (mặc định ẩn — lá số là dữ liệu riêng tư).

### 6.6 Trang «Lịch»

Lễ tuần của các đạo đang tu (tính theo can chi — `09-08` §5.1), Sóc / Vọng, lễ tiết tháng này, tiết khí hiện tại và vị thuốc đúng mùa. Dữ liệu như `09-12` §1.

---

## 7. Thông báo

| Loại | Kênh | Mặc định | Nội dung mẫu |
|---|---|---|---|
| Thời khắc đã tới | trong game + đẩy (nếu bật) | trong game: bật · đẩy: tắt | «Thầy đang đợi con ở Võ Đang.» |
| Lễ tuần sắp tới | đẩy | tắt | «Tối nay giờ Dậu, lễ tuần ở Võ Đang.» |
| Sóc / Vọng | đẩy | tắt | «Mai là Rằm.» |
| Đệ tử cần giúp | trong game | bật | «<đệ tử> đang độ kiếp, cần hộ pháp.» |
| Chuỗi sắp đứt | — | **không có** | (cố ý không làm) |
| Nguyên Khí đầy | — | **không có** | (cố ý không làm — không kéo người chơi về chỉ vì thanh đầy) |
| Thư năm sau mở được | đẩy | bật (một lần / năm) | «Lá thư con viết năm ngoái đã mở được.» |

Tối đa **1** thông báo đẩy / ngày cho mọi loại cộng lại; im lặng giờ Tý–Dần.

---

## 8. Người chơi cũ khi bản cập nhật hệ tu ra mắt

| Bước | Nội dung |
|---|---|
| 1 | Lá thư «Ân cựu khách» từ Lão Tùng: hệ tu mới; gia trì cũ được giữ (`09-01` §7.4); +40 thô nếu cấp ≥ 6 |
| 2 | Ba thẻ: «Đạo Hạnh khác Phúc Khí» · «Nhật Khóa» · «Chín đạo thống» |
| 3 | Mở ngay tab Sổ Tu; độ kiếp bậc 2 sẵn sàng nếu ĐCG đủ (với TL ≥ 85 và 40 thô ân cựu khách: `34 + 40 = 74` — chưa đủ; người cũ vẫn cần ≈ một ngày tu) |
| 4 | Không lặp lại hướng dẫn giờ đầu |

---

## 9. Nghiệm thu

- [ ] Mỗi khái niệm ở §2 xuất hiện đúng điều kiện, đúng người nói, một lần (xem lại được trong Sổ Tu › «Đã học»).
- [ ] Phiên đầu không có quá hai khái niệm mới.
- [ ] HUD điện thoại chỉ có ba thành phần tu (huy hiệu, Nhật Khóa, NK); chế độ tối giản hoạt động.
- [ ] Trang «Vì sao?» dựng câu đúng từ bản ghi `dh_gain`.
- [ ] Không có thông báo «chuỗi sắp đứt» hay «Nguyên Khí đầy»; tối đa 1 đẩy / ngày.
- [ ] Người chơi cũ nhận ân cựu khách đúng một lần.
- [ ] Thiên Bảng không lộ Tiềm Lực mặc định.
