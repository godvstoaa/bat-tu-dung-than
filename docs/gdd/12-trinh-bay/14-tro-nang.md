# 12 · Trình bày — Phần 14: Trợ năng (accessibility)

> Danh mục yêu cầu trợ năng cho game, tham chiếu WCAG 2.2 mức AA (áp vào phần giao diện HTML — lợi thế lớn vì toàn bộ bảng của game là DOM thật, đọc được bằng trình đọc màn hình) và bộ «Game Accessibility Guidelines» (các mức cơ bản / trung bình / nâng cao) cho phần cảnh 3D. Có bảng màu ngũ hành cho người mù màu đã **tính kiểm** bằng mô phỏng, danh sách nhãn phụ đề âm thanh, và checklist nghiệm thu.

---

## 1. Nền tảng đã có

| Hạng mục | Đã có trong code |
|---|---|
| Giảm chuyển động | `reduced = matchMedia('(prefers-reduced-motion: reduce)')`; CSS tắt mọi animation / transition; 3D tắt khói, cánh đào, bụi, đom đóm, đèn trời, đá trôi, mây, vòng Thiên Bàn, kim la bàn; bỏ màn chuyển khi đi trạm |
| Bàn phím | WASD / mũi tên, E vào gian, Q / R xoay, F bay, Space / C độ cao, Esc đóng; Space / Enter chỉ vào gian khi focus ở cảnh (không cướp nút HUD) |
| Focus | viền vàng 2 px `:focus-visible` cho nút, ô nhập, canvas, liên kết |
| Bảng | `role="dialog" aria-modal="true" aria-labelledby`; focus vào ô đầu (máy tính) / nút đóng (cảm ứng); trả focus về canvas khi đóng |
| Thông báo | `aria-live="polite"` cho toast; `role="alert"` cho lỗi mẫu |
| Nhãn | `aria-label` cho mọi nút icon HUD và dock; canvas có nhãn hướng dẫn điều khiển |
| Thẻ | `role="tablist"`, `role="tab"`, `aria-selected` ở Sổ Mệnh |
| Lối thay thế cảnh 3D | danh sách «Các gian» (đi tới bằng một chạm), chạm-để-đi, chế độ 2D (`?2d`) |
| Không chat tự do | chỉ cử chỉ và câu soạn sẵn (giảm nội dung độc hại) |
| Âm mặc định tắt | `audio.js` |

---

## 2. Bảng màu ngũ hành cho người mù màu

### 2.1 Vấn đề (đã đo)

Mô phỏng thị giác (ma trận Machado 2009, độ nặng 1,0) trên bảng `--wx-*` hiện tại, khoảng cách màu ΔE (CIE76) **nhỏ nhất** giữa hai hành bất kỳ:

| Thị giác | ΔE nhỏ nhất | Cặp dễ lẫn |
|---|---|---|
| thường | 42,5 | Thổ – Kim |
| mù đỏ – lục kiểu deuteranopia | **9,8** | **Hỏa – Thổ** |
| mù đỏ – lục kiểu protanopia | 16,1 | Mộc – Thổ |
| mù lam – vàng (tritanopia) | 15,8 | Mộc – Thủy |

ΔE dưới ~ 20 với vật nhỏ (chấm màu áo, thanh 8 px, cánh hoa 2%) là khó phân biệt. Hỏa – Thổ ở deuteranopia (≈ 5% nam giới) gần như trùng: `#e0533f` → `#9d8e3a`, `#c99a4a` → `#b8a74d`.

### 2.2 Bốn bảng thay thế (đã tính)

| Hành | Mặc định | Đỏ – lục (deuter- / protanopia) | Lam – vàng (tritanopia) | Đơn sắc |
|---|---|---|---|---|
| 木 Mộc | `#4fa463` | `#009e73` | `#6cc46a` | `#707070` |
| 火 Hỏa | `#e0533f` | `#d55e00` | `#e0336f` | `#8e8e8e` |
| 土 Thổ | `#c99a4a` | `#f0e442` | `#c9a227` | `#adadad` |
| 金 Kim | `#cfc8b8` | `#e8e4da` | `#dcdcdc` | `#eeeeee` |
| 水 Thủy | `#4b7cc7` | `#0072b2` | `#7a6cf0` | `#cdcdcd` |

| Bảng | ΔE nhỏ nhất · thường | · deuter | · protan | · tritan | Tương phản thấp nhất trên `--hq-card` |
|---|---|---|---|---|---|
| Mặc định | 42,5 | 9,8 | 16,1 | 15,8 | 3,96 (Thủy) |
| Đỏ – lục | 56,5 | **33,6** | **32,9** | 15,5 | 3,21 (Thủy) |
| Lam – vàng | 54,8 | 23,3 | 25,5 | **32,9** | 3,86 (Hỏa) |
| Đơn sắc | 11,7 | 11,7 | 11,7 | 11,7 | 3,36 (Mộc) |

Bảng Đỏ – lục dựa trên bộ màu Okabe–Ito (thiết kế cho mù màu); vẫn giữ quan hệ ngũ hành truyền thống (Thổ vàng, Kim trắng, Thủy lam, Hỏa đỏ cam, Mộc lục). Bảng Đơn sắc phân biệt chủ yếu bằng **hoa văn** (§2.3). Mọi màu ≥ 3:1 trên nền thẻ (đủ cho thành phần đồ họa — WCAG 1.4.11).

**Phạm vi thay:** cả ba tầng màu ngũ hành (phần 07 §2.5: vải, giao diện, phát sáng) — áo nhân vật, chấm màu áo người khác, thanh ngũ hành, Mệnh Bàn, gia trì, bộ Tàng Y Các, nhãn hành của la bàn. Màu ngũ hành dùng cho **chữ** vẫn dùng biến thể `-text` đủ 4,5:1.

### 2.3 Hoa văn và chữ — kênh không màu (luôn bật khi chế độ mù màu bật; tùy chọn ở chế độ thường)

| Hành | Hoa văn (thanh, cánh hoa) | Ký hiệu nhỏ | Chuyển động gia trì (đã có) |
|---|---|---|---|
| 木 | vạch dọc mảnh | 木 | xoắn lên |
| 火 | tam giác nhọn hướng lên | 火 | bốc thẳng thu hẹp |
| 土 | ô vuông | 土 | quay sát đất |
| 金 | chấm tròn | 金 | lơ lửng |
| 水 | sóng | 水 | rơi ngược |

**Luật chung (WCAG 1.4.1):** không một thông tin nào chỉ mang bằng màu. Bảng kiểm:

| Chỗ dùng màu | Kênh thứ hai |
|---|---|
| hành trong trụ (chữ màu) | chính chữ Hán đã cho biết hành (can / chi) + Hán Việt |
| thanh ngũ hành `.hq-wxbar` | nhãn chữ dưới thanh (★ UI-04) + hoa văn |
| chấm màu áo người chơi khác | tên + danh xưng; chạm thẻ người chơi ghi «Phẩm phục Thủy» |
| cát / bình / hung | ✓ / △ / ⚠ + chữ |
| bậc hiếm | ○ ◇ △ ☆ ✺ + tên bậc |
| Neo khớp / lệch | 🎯 / ⚠ + chữ «khớp lá số» / «mâu thuẫn» |
| tuổi phạm Thái Tuế nặng / nhẹ | viền đôi / viền đứt + chữ «Trị · Xung …» |
| nhãn gian gần (`.near` nền son) | nút hành động hiện + rung |
| đã điểm danh (ô vàng) | chữ «N3 ✓» |

---

## 3. Phụ đề và phụ đề âm thanh

### 3.1 Phụ đề thoại

- Mặc định **bật**. Hộp thoại UI-40 chính là phụ đề; cảnh cắt có phụ đề UI-99.
- Cỡ chữ theo `--hq-fs`; nền mờ chỉnh được 40 / 60 / 80%.
- Tên người nói luôn hiện, kèm chữ Hán đầu tên và màu đạo thống (màu không bắt buộc để hiểu).
- Lời ngoài khung hình (NPC nói từ xa): tên kèm mũi tên hướng «Vân Cốc ↗».

### 3.2 Phụ đề âm thanh (mô tả tiếng — tùy chọn, mặc định tắt)

Hiện dạng nhãn nhỏ trong ngoặc vuông ở **rìa màn theo hướng nguồn** (nếu bật «Chỉ báo âm thanh hướng»), hoặc dòng dưới phụ đề. Chỉ những tiếng **mang thông tin** — không mô tả tiếng trang trí liên tục.

| Nhãn | Tiếng (phần 10) | Vì sao cần |
|---|---|---|
| [chuông canh · giờ Tý] … [giờ Hợi] | `SFX-BELL-030`, `-031`, `-040`, `-041` | báo đổi canh giờ (ảnh hưởng nhạc, lễ, nhiệm vụ theo giờ) |
| [chuông chùa xa] | `SFX-BELL-031` | dẫn đường hành hương |
| [tiếng mõ] / [nhịp mõ] | `SFX-BELL-046` | nhịp sám hối UI-92 (kèm chấm nhịp hình) |
| [có người cúi chào bạn] | `SFX-SOC-002` | cử chỉ gửi riêng |
| [lời mời] | `SFX-UI-044` | UI-64 |
| [tiếng bước chân lại gần] | `SFX-FOOT-*` người khác < 4 m sau lưng | biết có người tới |
| [nước sôi] | `SFX-WATER-015`, `SFX-MG-060` | sắc thuốc UI-91 đã sôi |
| [nhang sắp tàn] | `SFX-MG-093` | đồng hồ nén hương |
| [sấm] | `SFX-WX-001/002` | đổi thời tiết |
| [ngựa tới] / [đò cập bến] / [hạc đáp] | `SFX-TRAV-*` | trạm sẵn sàng |
| [cửa điện mở] | `SFX-DOOR-001` | vào điện |
| [tiếng khánh ngân] | `SFX-RITE-020`, `SFX-PROG-005` | nghi thức, xong tầng Mệnh Đồ |
| [gió lạnh thổi ngược] | âm kèm `fx.rite.amba` | nhận Âm Bài |
| [kèn dài từ xa] | `SFX-BELL-020` | Tạng — báo lễ |
| [thác nước] | `SFX-WATER-003/004` | định hướng Côn Lôn |
| [có tiếng người rao ở quầy] | `SFX-CROWD-019` | quầy Định Mệnh Hội (nhiệm vụ UI-89) |

### 3.3 Chỉ báo âm thanh hướng

Bật thì các tiếng trong bảng §3.2 có thêm **cung nhỏ ở rìa màn** chỉ hướng nguồn (giống la bàn), mờ dần trong 2 s. Không áp dụng cho tiếng UI.

---

## 4. Thị giác

| # | Yêu cầu | Cách đáp ứng |
|---|---|---|
| V1 | Cỡ chữ 85–150% | `--hq-fs` (UI-76); nhãn 3D trần 18 px |
| V2 | Tương phản chữ ≥ 4,5:1 | sửa `--hq-note`, `-text` cho Thủy, Hỏa (phần 07 §2.3) |
| V3 | Tương phản cao | UI-76: nền thẻ `#0e0b12`, viền 2 px `--hq-paper`, bỏ chữ mờ, nút phụ có viền vàng |
| V4 | Trình đọc màn hình | toàn bộ bảng là DOM: vai trò ARIA đúng, thứ tự đọc khớp thứ tự hình; SVG Mệnh Bàn có bảng văn bản thay thế; canvas 3D có nhãn và **không** bẫy focus |
| V5 | Điều hướng cảnh không cần nhìn | «Các gian» (UI-48) + nút «Đi tới» tự đi bằng A* (`findPath` đã có); ★ chế độ «tự dẫn đường»: chọn đích trên danh sách, nhân vật tự đi, âm `SFX-QUEST-004` khi tới |
| V6 | Mô tả cảnh | ★ nút «Mô tả nơi này» (phím `?` khi focus ở cảnh): đọc tên vùng, công trình gần nhất, người gần, nhiệm vụ trong 50 m, giờ can chi, thời tiết |
| V7 | Phóng to | trình duyệt phóng tới 200% không vỡ bố cục bảng (không đặt `user-scalable=no`) |
| V8 | Chế độ 2D | giữ `?2d` như lối thay thế nhẹ; ★ đưa thành tùy chọn trong UI-77 |
| V9 | Con trỏ / vùng chạm | ≥ 44 × 44 px (phần 07 §3.1) |
| V10 | Mini-game chỉ nhìn | mỗi mini-game có mô tả chữ trạng thái (phần 06 UI-80 luật 6) |

---

## 5. Thính giác

| # | Yêu cầu | Cách đáp ứng |
|---|---|---|
| H1 | Không thông tin nào chỉ bằng âm | mọi tiếng mang thông tin có hình / chữ / rung đi kèm (§3.2) |
| H2 | Phụ đề | §3.1 |
| H3 | Thanh âm riêng từng bus | UI-77 (Tổng, Nhạc, Môi trường, Hiệu ứng, Giao diện, Thoại) |
| H4 | Mono | UI-76 «Đơn kênh» (gộp kênh ở bus master) |
| H5 | Nhịp không chỉ bằng tai | UI-92 sám hối: chấm nhịp chạy + rung light mỗi nhịp (bật «Rung theo nhịp») |
| H6 | Giảm tiếng chói | chế độ đêm khuya (phần 11 §3); sấm, chuông lớn có giới hạn |

---

## 6. Vận động

| # | Yêu cầu | Cách đáp ứng |
|---|---|---|
| M1 | Một tay | UI-76 «Bố cục một tay»: cần ảo, nút hành động, dock dồn về một bên; chạm-để-đi đủ để chơi toàn bộ không cần cần ảo |
| M2 | Không bắt giữ lâu | mọi thao tác giữ có đường thay thế: tĩnh tọa «chạm chuyển pha» (UI-81); «Bỏ qua» cảnh cắt giữ 1 s → tùy chọn chạm hai lần |
| M3 | Không thao tác nhanh bắt buộc | không có QTE; mini-game nhịp có «Hỗ trợ nhịp» Rộng / Rất rộng / Tự động (UI-92) |
| M4 | Không bắt cử chỉ phức tạp | chụm hai ngón (zoom) có nút −/+ thay thế (★ hai nút nhỏ cạnh đĩa la bàn, bật trong UI-76); kéo thả có «chạm – chạm» thay thế (UI-82, UI-85, UI-89) |
| M5 | Đổi phím | ★ màn đổi phím (UI-75 › Điều khiển): mọi phím trong bảng UI-18 đổi được; hỗ trợ tay cầm (Gamepad API) cho bản máy tính |
| M6 | Lắc máy (Ống Xăm) | luôn có nút «Lắc» thay lắc thật |
| M7 | Tốc độ con trỏ / xoay | độ nhạy, đảo trục (phần 08 §7) |
| M8 | Không bấm nhầm hành động lớn | hành động không hoàn tác (xoá, nạp tiền, mở Tà Lộ) luôn có hộp xác nhận; nút nguy hiểm không đặt cạnh nút chính |

---

## 7. Nhận thức và đọc hiểu

| # | Yêu cầu | Cách đáp ứng |
|---|---|---|
| C1 | Không áp lực thời gian | không đồng hồ đếm ngược đỏ; nén hương thay đồng hồ; lựa chọn thoại không hết giờ (UI-40) |
| C2 | Nhắc mình đang làm gì | bộ theo dõi nhiệm vụ (UI-16); ★ «Lần trước bạn…» ở UI-06 khi vắng > 3 ngày (tóm 2 dòng: nhiệm vụ đang theo, tầng Mệnh Đồ) |
| C3 | Thuật ngữ khó | móc từ điển (phần 13 §4), chữ Hán luôn kèm Hán Việt (mặc định) |
| C4 | Xem lại hướng dẫn | menu tạm nghỉ › Phím tắt; mỗi mini-game có [?] |
| C5 | Ngôn ngữ đơn giản ở chỗ quan trọng | câu quyền riêng tư, xác nhận, an toàn: câu ngắn, «bạn», không thuật ngữ |
| C6 | Không quá tải | tối đa 2 toast; tối đa một chấm thông báo trên dock; tối đa 8 nhãn gian |
| C7 | Lịch sử thoại | UI-40b |
| C8 | Tự chạy thoại / thời gian thông báo | UI-76 |

---

## 8. Nhạy cảm ánh sáng và say chuyển động

| # | Yêu cầu | Cách đáp ứng |
|---|---|---|
| P1 | ≤ 3 lóe / giây | chớp (`fx.wx.lightning`), lôi quang (`fx.cos.aura_set`) có giới hạn (phần 12 §4.1, §6.1) |
| P2 | Tắt nhấp nháy | UI-76 «Nhấp nháy, lóe sáng: Tắt» |
| P3 | Giảm chuyển động | §1 + phần 08 §7 + phần 12 §7 |
| P4 | Chống say | tốc độ xoay camera giới hạn, FOV bổ sung, khoảng cách camera xa, tắt rung camera (phần 08 §7) |
| P5 | Không chuyển động nền to khi đọc | bảng full: cảnh tối mờ 55% (đã có `rgba(8,6,12,.55)`); ★ dừng mây / cây lắc sau bảng full |

---

## 9. An toàn cảm xúc

| # | Yêu cầu | Cách đáp ứng |
|---|---|---|
| E1 | Không làm xấu hổ vì lá số | câu dẫn bắt buộc (UI-05), không đỏ cho điểm thấp (phần 07 §2.6) |
| E2 | Nội dung âm tà tự nguyện | UI-79, tắt lại được bất cứ lúc nào |
| E3 | Khủng hoảng | UI-42 |
| E4 | Nhắc nghỉ | UI-18 (90 phút mặc định) |
| E5 | Không giục chi tiền | không đếm ngược giảm giá, chấm Y Các tự tắt sau 3 ngày (UI-09, UI-71) |
| E6 | Riêng tư khi chụp ảnh | người khác ẩn mặc định (UI-98) |
| E7 | Cảnh báo nội dung trước vùng nặng | Phong Đô, hang Miêu Cương: thẻ nhỏ trước khi vào lần đầu «Vùng này kể chuyện về nghiệp và cái chết theo tín ngưỡng dân gian. Không có cảnh ghê rợn.» + lựa chọn «Vào» / «Để sau» |

---

## 10. Checklist nghiệm thu trợ năng

Mức: **CB** cơ bản (bắt buộc trước M1), **TB** trung bình (trước M3), **NC** nâng cao (trước phát hành). Cách kiểm: **TĐ** tự động, **TC** thủ công, **NT** người thật (người khuyết tật tham gia thử).

| # | Mục | Mức | Kiểm |
|---|---|---|---|
| 1 | Mọi nút icon có nhãn trợ năng | CB | TĐ (axe-core) |
| 2 | Tương phản chữ ≥ 4,5:1 (chữ thường), ≥ 3:1 (chữ lớn, đồ họa) | CB | TĐ |
| 3 | Đi hết mọi bảng chỉ bằng bàn phím, không bẫy focus ngoài ý muốn | CB | TC |
| 4 | Bẫy focus **trong** bảng đang mở | CB | TC |
| 5 | `Esc` đóng mọi bảng / hộp | CB | TC |
| 6 | Toast đọc được bằng trình đọc màn hình | CB | TC (VoiceOver, TalkBack, NVDA) |
| 7 | Giảm chuyển động theo hệ thống | CB | TC |
| 8 | Không thông tin chỉ bằng màu (bảng §2.3) | CB | TC |
| 9 | Phụ đề thoại bật mặc định | CB | TC |
| 10 | Cỡ chữ 150% không vỡ bố cục 390 × 844 | CB | TC + ảnh chụp |
| 11 | Vùng chạm ≥ 44 px | CB | TĐ (đo DOM) |
| 12 | Không lóe > 3 lần / giây | CB | TĐ (phân tích video) |
| 13 | Thanh âm riêng từng bus | CB | TC |
| 14 | Tắt rung | CB | TC |
| 15 | Hộp xác nhận cho hành động không hoàn tác | CB | TC |
| 16 | Bốn bảng mù màu (§2.2) | TB | TĐ (mô phỏng) + NT |
| 17 | Hoa văn ngũ hành | TB | TC |
| 18 | Tương phản cao | TB | TC |
| 19 | Bố cục một tay | TB | NT |
| 20 | Hỗ trợ nhịp mini-game | TB | NT |
| 21 | Lịch sử thoại | TB | TC |
| 22 | Móc từ điển thuật ngữ | TB | TC |
| 23 | Phụ đề âm thanh (§3.2) | TB | TC |
| 24 | Đơn kênh | TB | TC |
| 25 | Đổi phím, tay cầm | TB | TC |
| 26 | Nút −/+ thay chụm hai ngón | TB | TC |
| 27 | «Mô tả nơi này» | NC | NT (người khiếm thị) |
| 28 | Tự dẫn đường tới đích | NC | NT |
| 29 | Chỉ báo âm thanh hướng | NC | NT (người khiếm thính) |
| 30 | Tùy chọn FOV, khoảng cách camera, khóa góc nhìn | NC | NT (người dễ say) |
| 31 | Cảnh báo nội dung trước vùng nặng | TB | TC |
| 32 | Nhắc nghỉ | CB | TC |
| 33 | UI-42 khủng hoảng hoạt động trên mọi màn hội thoại | CB | TC + duyệt chuyên gia |
| 34 | Bản iOS: không lối vào nào tới màn bị tắt | CB | TĐ (quét DOM bản iOS) |
| 35 | Chế độ 2D chơi được toàn bộ các gian Sơn Môn | TB | TC |
| 36 | Trình đọc màn hình đọc được Mệnh Bàn (bảng thay thế) | TB | NT |
| 37 | Màn quyền riêng tư đọc xong ≤ 30 s, ngôn ngữ đơn giản | CB | NT |
| 38 | Thời gian thông báo 1× / 1,5× / 2× | TB | TC |
| 39 | Tự chạy thoại tắt mặc định | CB | TC |
| 40 | Không thao tác nào cần giữ > 1 s mà không có cách thay | TB | TC |
| 41 | Mọi mini-game có mô tả chữ trạng thái | TB | TC |
| 42 | Âm thanh tắt hẳn khi bấm 🔈 (0 tiếng) | CB | TĐ |

**Ngân sách thử với người thật:** mỗi mốc M1, M3, M5 một vòng 8–12 người (khiếm thị, khiếm thính, vận động hạn chế, mù màu, người lớn tuổi > 60 — nhóm người dùng app Bát Tự hiện có nhiều người lớn tuổi).
