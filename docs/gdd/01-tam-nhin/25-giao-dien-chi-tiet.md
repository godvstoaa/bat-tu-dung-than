# 01 · Phần 25 — Giao diện chi tiết: mã thiết kế (token), Mệnh Bàn, danh mục biểu tượng, trạng thái thành phần

> Mở rộng phần 13 §6 và phần 19. Đây là **ngôn ngữ thị giác** ở mức đủ để tài liệu 12 dựng hệ thiết kế. Giá trị màu khởi từ `game.css` hiện có (`--hq-*`, `--wx-*`).

## 1. Mã thiết kế

### 1.1 Màu nền và chữ

| Token | Giá trị | Nguồn | Dùng |
|---|---|---|---|
| `color.bg.night` | `#14111c` | `--hq-night` | nền tổng |
| `color.bg.ink` | `#1d1822` | `--hq-ink` | bảng cấp 1 |
| `color.bg.card` | `#221c27` | `--hq-card` | thẻ |
| `color.line` | `#3a3040` | `--hq-line` | đường kẻ |
| `color.paper` | `#f3e7cf` | `--hq-paper` | nền giấy (Sổ, hộp thoại) |
| `color.text.onDark` | `#f3e7cf` | — | chữ trên nền tối |
| `color.text.onPaper` | `#1a1418` | `PAL.ink` | chữ trên giấy |
| `color.text.dim` | `#b8a98f` | `--hq-dim` | chữ phụ trên nền tối (kiểm tương phản ≥ 4,5 : 1 trên `bg.card`) |
| `color.accent.son` | `#b3261e` | `--hq-son` | dấu son, nút xác nhận |
| `color.accent.gold` | `#d6a84a` | `--hq-gold` | viền, mốc |
| `color.accent.wood` | `#6b3f26` | `--hq-wood` | khung gỗ |
| `color.state.focus` | `#d6a84a` viền 2 px | — | vòng tiêu điểm bàn phím |

### 1.2 Màu ngũ hành (hai sắc độ — phần 13 §6.2)

| Token | UI | Khí (phát sáng) |
|---|---|---|
| `wx.moc` | `#4fa463` | `#58c46a` |
| `wx.hoa` | `#e0533f` | `#ff6a3c` |
| `wx.tho` | `#c99a4a` | `#d9a64a` |
| `wx.kim` | `#cfc8b8` | `#f2e6b8` |
| `wx.thuy` | `#6b9be0` | `#4f9cff` |

### 1.3 Chữ

| Token | Phông | Cỡ (di động / PC) | Dùng |
|---|---|---|---|
| `type.title` | Noto Serif 600 | 22 / 26 px | tiêu đề bảng |
| `type.heading` | Noto Serif 600 | 18 / 20 px | tiêu đề mục |
| `type.body` | Noto Serif 400 | 16 / 16 px | thoại, mô tả |
| `type.ui` | hệ thống sans 400 | 14 / 14 px | nút nhỏ, nhãn |
| `type.han` | Noto Serif SC (`.hq-han`) | ≥ 16 px | chữ Hán |
| `type.han.display` | Noto Serif SC 700 | 40–64 px | chữ trụ ở lễ lật trụ, đạo hiệu |
| `type.number` | Noto Serif, số tabular | theo ngữ cảnh | điểm, chỉ số |

Cỡ chữ nhân theo cài đặt 100–200 % (`TN-03`).

### 1.4 Khoảng cách, bo góc, bóng

| Token | Giá trị |
|---|---|
| `space.1` … `space.6` | 4 · 8 · 12 · 16 · 24 · 32 px |
| `radius.paper` | 2 px (giấy cắt) |
| `radius.button` | 6 px |
| `radius.seal` | 50 % (ấn tròn) hoặc 2 px (ấn vuông) |
| `shadow.card` | 0 2 8 rgba(0,0,0,0.35) |
| `touch.min` | 44 pt / 48 dp (`TN-04`) |

### 1.5 Chuyển động

| Token | Thời lượng | Đường cong | Dùng |
|---|---|---|---|
| `motion.paper.open` | 320 ms | cubic-bezier(0.2, 0.8, 0.2, 1) | mở bảng |
| `motion.page` | 250 ms | ease-in-out | lật thẻ Sổ |
| `motion.seal` | 350 ms | rơi + nảy 1 lần | dấu son |
| `motion.ink` | 600 ms | ease-out | nét mực Đạo Hạnh |
| `motion.reduced` | 150 ms | linear, chỉ mờ dần | khi giảm chuyển động |

## 2. Mệnh Bàn — đặc tả hình học

| Vòng | Bán kính (so đường kính la bàn) | Nội dung | Tương tác |
|---|---|---|---|
| Tâm | 0–18 % | 4 ô trụ (can trên, chi dưới), chữ Hán `type.han.display` thu nhỏ; ô giờ phủ sương nếu Tam Trụ | chạm trụ → can chi, tàng can, thập thần |
| Vòng 1 · ngũ hành | 18–38 % | 5 cánh hoa, góc mỗi cánh tỷ lệ `wx.pct`; cánh Dụng thần viền `accent.gold`, có nhãn «×1,3»; cánh Kỵ có nhãn «×0,8» | chạm cánh → chỉ số hành (Sinh Cơ…), «Vì sao?» |
| Vòng 2 · Ngũ Duy | 38–56 % | 5 cung, độ đậm theo điểm 0–100; trục mạnh có chấm son, trục yếu có vòng đứt nét | chạm → nhánh kỹ năng, chuỗi học bù |
| Vòng 3 · Đặc Tính | 56–74 % | mỗi thần sát một ấn nhỏ (chữ Hán 1–2 ký tự), xếp theo vị trí trụ | chạm → đặc tính, mô tả đã lọc câu y khoa |
| Vòng 4 · Phẩm căn | 74–92 % | thang 10 nấc; nấc hiện tại khắc đậm; **không màu đỏ** cho nấc thấp | chạm → «Vì sao?» (`factors`) |
| Vành ngoài | 92–100 % | 24 sơn (trang trí, gợi la kinh) + Thiên Mệnh Hành, Mệnh Cách, Mệnh Cấp dạng chữ | — |

**Dạng danh sách** (đọc màn hình, màn nhỏ): cùng nội dung theo thứ tự: Tứ trụ → Ngũ Hành Lực → Thân Lực → Thiên Mệnh Hành / Hỷ / Kỵ / Cừu → Ngũ Duy → Mệnh Cách → Mệnh Cấp → Phẩm căn + Tiềm Lực → Phúc phận → Nguyên Khí → Đặc Tính → Túc Nghiệp → Tính Khí → Thời Vận.

**Hiển thị Tiềm Lực:** số ở vòng 4 dùng `type.number`, cùng màu chữ thường; với cài đặt «ẩn con số» thì chỉ hiện tên bậc.

## 3. Danh mục biểu tượng (thay emoji — phần 13 §6.4)

| Nhóm | Biểu tượng (mô tả nét mực, 24 px) |
|---|---|
| Ô trang bị (8) | phẩm phục: áo giao lĩnh · mũ / trâm: trâm cài búi · sau lưng: kiếm trong bao · cầm tay: quạt gập · hào quang: vòng mây · vệt bước: ba dấu chân · ngự vật: đám mây cuộn · khung tên: khung chữ nhật góc cuốn |
| Ngũ hành (5) | chữ 木 火 土 金 水 trong ô tròn + hình phụ (lá, lửa, núi, tròn, giọt) |
| Sổ (7 thẻ) | la bàn (Mệnh Bàn) · bản đồ cuộn (Mệnh Đồ) · sổ có dấu (Sổ Công Quá) · bậc thang (Cảnh giới) · rương gỗ (Tủ đồ) · bút lông (Từ đã học) · ngọn đèn (Lời người làm game) |
| Tiền | Phúc Khí: đồng tiền lỗ vuông · Ngọc: miếng ngọc bích hình giọt (không kim cương) |
| Trạng thái | việc thiện: ấn son · việc ác: giọt mực · Nợ Âm: giọt tím xám · Hồi Đầu: vòng tròn mực khép |
| Điều hướng | trở về: mũi tên nét bút · đóng: nét gạch chéo mảnh · cài đặt: bàn tính nhỏ · âm thanh: chuông |
| Xã hội | đồng tu: hai bồ đoàn · đạo lữ: hai chén trà · kim lan: hai bàn tay nắm · sư đồ: thầy cầm sách, trò ngồi |
| Bản đồ | xe · đò · hạc (trạm); cờ ngũ hành (đánh dấu); đền nhỏ (thánh địa) |
| Thời gian | 12 chi: hình con giáp nét đơn (Mão là **mèo**) |
| An toàn | khung hỗ trợ khủng hoảng: bàn tay mở (không biểu tượng tôn giáo) |

**Không dùng:** hình Phật, Bồ-tát, thần; chữ Phạn / Tạng; vương miện kiểu phương Tây; đầu lâu; biểu tượng tiền tệ thật.

## 4. Trạng thái thành phần

| Thành phần | Thường | Chạm / rê | Nhấn | Tắt | Tiêu điểm bàn phím | Ghi chú |
|---|---|---|---|---|---|---|
| Nút chính | nền `accent.son`, chữ `paper` | sáng 8 % | lún 1 px | xám 40 % + lý do khi chạm | viền vàng 2 px | «Mua» và «Không» cùng cỡ |
| Nút phụ | viền `line`, chữ `paper` | nền `bg.ink` | — | — | viền vàng | — |
| Thẻ trạm (trong cảnh) | viền sáng mảnh 0,3 s khi gần | — | — | — | — | không chữ nổi trên đầu trừ khi bật nhãn |
| Lựa chọn thoại | thẻ giấy dọc | gạch chân mực | dấu son nhỏ bên trái | — | viền vàng | luôn có lựa chọn trung tính |
| Ô gõ Thầy AI | nền giấy | — | — | khi AI tắt: ẩn ô, giữ gợi ý kịch bản | — | đếm lượt còn lại |
| Thanh Nguyên Khí | ẩn | hiện khi tốn | — | — | — | không màu đỏ khi thấp; nhạt dần |
| Thẻ món (Tàng Y Các) | ảnh, tên, giá | xoay mẫu 3D | mở chi tiết | đã sở hữu: dấu «Đã có» | viền vàng | giá Ngọc nạp kèm tiền thật |

## 5. Bố cục màn chính theo nền tảng

| Vùng màn | Di động dọc | Di động ngang / tablet | PC |
|---|---|---|---|
| Đồng hồ can chi | góc trên trái | góc trên trái | góc trên trái |
| Nhiệm vụ đang theo | dưới đồng hồ, 1 dòng | như dọc | như dọc |
| Nút Sổ | góc dưới phải, ngón cái | góc dưới phải | phím S + nút |
| Nút bay | trên nút Sổ khi đã mở | — | F / Space / C |
| Hộp thoại | đáy màn, 3 dòng | đáy, 2 dòng rộng | đáy giữa, rộng ≤ 900 px |
| Cần ảo | trái dưới (tắt được, mặc định: chạm để đi) | — | không |

## 6. Kiểm giao diện (mỗi màn mới)

- [ ] Token đúng bảng §1; không mã màu rời.
- [ ] Tương phản `TN-01`; mục chạm `TN-04`.
- [ ] Biểu tượng từ danh mục §3; không emoji.
- [ ] Có dạng danh sách cho đọc màn hình nếu màn có hình học (Mệnh Bàn, bản đồ).
- [ ] Lời văn từ phần 19 §2.
