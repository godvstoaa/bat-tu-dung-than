# 12 · Trình bày — Phần 12: Hiệu ứng hình (VFX) và ngân sách hiệu năng

> Danh mục hiệu ứng hình: gia trì ngũ hành, hào quang / vệt bước / ngự vật của Tàng Y Các, nghi thức, thời tiết, môi trường, hậu kỳ; cùng ngân sách hiệu năng theo ba mức chất lượng. Tài liệu này chỉ được cấp không gian tên `UI-*`, `SFX-*`, `BGM-*`, nên hiệu ứng hình được gọi bằng **khóa cấu hình** dạng `fx.<nhóm>.<tên>` (như `cam.*` ở phần 08) — không phải mã canon. Nếu tài liệu 13 cần mã sản xuất, đề xuất mở không gian tên riêng (câu hỏi mở trong README).

---

## 1. Nguyên tắc

1. **Mực, khói, ánh sáng, nước, hoa** là chất liệu. Không nổ, không máu, không mảnh vỡ, không «sát thương» (T3).
2. **Hành đọc được bằng hình chứ không chỉ bằng màu**: mỗi hành có một **chuyển động riêng** (đã có trong `effects.js › MOTE`): Mộc xoắn lên như dây leo, Hỏa bốc thẳng thu hẹp, Thổ quay sát đất, Kim lơ lửng nhịp chậm, Thủy rơi ngược từ trên xuống. Người mù màu vẫn phân biệt được.
3. **Tôn trọng nơi thờ**: trong điện, hiệu ứng trang phục của người chơi giảm 50% độ sáng và tắt vệt bước; không có hiệu ứng nào chạm / che tượng thần.
4. **Tĩnh trước, động sau**: hiệu ứng nền chậm (khói 0,55 m/s, cánh đào 0,35 m/s, bụi 0,08 m/s); hiệu ứng nhanh chỉ ở khoảnh khắc (đóng ấn, đột phá) và kéo dài ≤ 2 s.
5. **Giảm chuyển động** tắt hạt trang trí (đã có: khói, cánh đào, bụi, đom đóm, đèn trời, đá trôi, mây trôi, vòng Thiên Bàn, kim la bàn đều kiểm `!reduced`); hiệu ứng mang thông tin (hào quang cho biết hành, đèn đã thắp) đổi sang **tĩnh** chứ không biến mất.

---

## 2. Kiểm kê hiện có (`render3d.js`, `effects.js`, `interior.js`)

| Khóa | Hiện có | Thông số đang chạy | Tắt khi |
|---|---|---|---|
| `fx.env.smoke` | khói nhang Lư Hương | sinh mỗi 0,09 s khi nhang cháy, sống 3,2 s, bay lên 0,55 m/s, lắc ngang `sin`, cỡ `0,12 + 0,28 × tuổi`, opacity `0,5 × (1 − tuổi/3,2)` | `reduced`, `lowQuality` |
| `fx.env.petals` | cánh đào rơi quanh cây | rơi 0,35 m/s, lắc ngang 0,25 m/s, từ 3,8 m | không `peachBloom`, `reduced`, `lowQuality` |
| `fx.env.dust` | bụi nắng bay lên | 0,08 m/s, trần 6 m | `lowQuality` |
| `fx.env.flies` | đom đóm | lượn theo `sin/cos`, opacity theo đêm | `reduced`, `lowQuality` |
| `fx.env.skylanterns` | đèn trời quanh Thiên Bàn (instanced `SLN` chiếc) | bay lên `d.v`, xoay quanh `d.a`, lặp từ −14 m tới 34 m | `reduced` (đứng yên) |
| `fx.env.rocks` | đá trôi lơ lửng | nhấp nhô `sin(0,4 t)` | `reduced` |
| `fx.env.clouds` | mây trôi | trôi ngang, lặp ±160 m | `reduced` |
| `fx.env.pondlanterns` | đèn hoa đăng hôm nay trên Hồ Sen | ≤ 6 chiếc, trôi 0,18 m/s, nhấp nhô 2 cm | — |
| `fx.env.ripple` | gợn nước hồ (texture trôi) | offset 0,015 / s | — |
| `fx.env.candle` | lửa nến bàn xăm | nhấp nháy `sin(13 t)`, đèn 1,8 ± 0,3 + đêm × 2 | — |
| `fx.env.thienban` | ba vòng Thiên Bàn quay | 0,03 / −0,05 / 0,08 rad/s | `reduced` |
| `fx.ui.celebrate` | ăn mừng: vòng Thiên Bàn đổi màu hành, viền phát sáng | 6 s, `emissiveIntensity 0,6 + 2k` | — |
| `fx.env.needle` | kim la bàn run | `0,12 sin(0,9t) + 0,02 sin(3,1t)` | `reduced` |
| `fx.post.bloom` | ánh sáng tỏa | strength 0,28, radius 0,5, threshold 0,96 | chất lượng Thấp, `lowQuality` |
| `fx.env.sky` | vòm trời gradient + sao + trăng theo giờ | 8 mốc `KEYS` nội suy | — |
| `fx.light.pool` | đèn điểm gần người chơi | 6 / 10 / 16 đèn theo chất lượng, cập nhật mỗi 0,3 s; trong điện ×14 | — |
| `fx.giatri.aura` | vòng hào quang dưới chân | đĩa 1,1 m cộng sáng + vành 0,95–1,05 m quay 0,4 rad/s; thở `1 ± 0,06` ở 2,2 rad/s | — |
| `fx.giatri.motes` | linh khí quanh thân | 26 hạt (skin tới 40), cỡ 0,13 (Kim) / 0,18 | — |
| `fx.giatri.trail` | vệt sáng bộ pháp | 40 điểm lịch sử, cỡ 0,35 | — |
| `fx.giatri.halo` | pháp quang sau lưng | đĩa 0,9 m ở cao 1,75 m, lùi 0,28 m + vành | — |
| `fx.giatri.fly` | ngự vật khi bay | kiếm / mây (6 tấm 0,9 m) / hồ lô / đài sen / hạc + tấm sáng 1,6 × 2,4 m | — |

---

## 3. Gia trì ngũ hành (`progress.js › GIATRI` + `WX_GIATRI`)

### 3.1 Năm bộ theo hành

| Hành | Tên gia trì | Hạt (`mote`) | Màu phát sáng | Chuyển động hạt (đã có) | Vòng hào quang | Vệt bộ pháp | Pháp quang |
|---|---|---|---|---|---|---|---|
| 木 | Thanh Mộc | lá non | `#58c46a` | xoắn quanh thân, bán kính 0,6–1,1 m, trôi lên chậm 0,3 m/s, lặp ở 2,2 m | vành có **vân lá** chạy theo vòng | lá non rơi lại sau bước | vòng lá đan |
| 火 | Ly Hỏa | đốm lửa | `#ff6a3c` | bốc thẳng 0,9 m/s, thu hẹp dần lên đỉnh 2,4 m | vành **răng cưa lửa** nhấp nháy nhẹ | tàn lửa tắt nhanh (0,6 s) | vầng lửa tròn |
| 土 | Hậu Thổ | bụi vàng | `#d9a64a` | quay nhanh sát đất (1,4 rad/s), cao 0,15–0,47 m | vành **ô vuông** (đất ruộng) | bụi vàng lắng | vòng vuông bo góc |
| 金 | Canh Kim | ánh kim | `#f2e6b8` | lơ lửng, nhịp lên xuống 1,7 rad/s quanh 0,6–1,8 m | vành **tròn đôi** sáng lạnh | tia sáng mảnh | đĩa tròn trơn |
| 水 | Huyền Thủy | giọt nước | `#4f9cff` | rơi **ngược** từ 2,4 m xuống chân | vành **sóng** | giọt rơi tạo gợn trên đất (decal 0,8 s) | vòng sóng |

**Hình đặc trưng vành** (cột «Vòng hào quang») là bổ sung ★ — hiện vành chỉ là `RingGeometry` trơn. Mỗi vành là một texture vòng 256 × 256 riêng, cùng shader.

### 3.2 Mở theo tiến trình

| Gia trì | Mở (hiện có: cấp; canon §9.1: chuyển dần sang cảnh giới) | VIP mở sớm |
|---|---|---|
| `aura` Hào quang hộ thể | cấp 2 | có |
| `motes` Linh khí quanh thân | cấp 4 | có |
| `trail` Vệt sáng bộ pháp | cấp 6 | có |
| `fly` Ngự kiếm phi hành | cấp 8 | có |
| `halo` Pháp quang sau lưng | cấp 10 | không |

### 3.3 Độ sáng theo bối cảnh

| Bối cảnh | Hệ số độ sáng gia trì | Vệt bước |
|---|---|---|
| ngoài trời ban ngày | 0,7 | bật |
| ngoài trời đêm | 1,0 | bật |
| trong điện thờ | 0,5 | **tắt** (tôn trọng) |
| hội thoại, cảnh cắt | 0,4 | tắt |
| ngồi thiền (UI-81) | 0,6, hạt chậm 50% | tắt |
| chế độ chụp ảnh | theo người chơi (0–1,2) | theo người chơi |

---

## 4. Hiệu ứng Tàng Y Các

### 4.1 Hào quang (`AURA_SKIN`, đã có)

| Món | Khóa | Màu | Hạt | Hình đặc biệt | Số hạt | Hòa trộn |
|---|---|---|---|---|---|---|
| Đào Hoa Phi Vũ | `fx.cos.aura_dao` | `#ff9cc0` | cánh hoa (texture `petal`) | cánh rơi xoắn từ 2,6 m | 26 | thường |
| Tam Muội Chân Hỏa | `fx.cos.aura_lua` | `#ff6a2a` | lửa | bốc 1,4 m/s, thu hẹp | 40 | cộng sáng |
| Bát Quái Trận | `fx.cos.aura_batquai` | `#ffd060` | chấm nhỏ trên vòng 1,25 m | **đĩa bát quái** (`disc: 'batquai'`) dưới chân xoay | 26 | thường |
| Cửu Thiên Lôi Quang | `fx.cos.aura_set` | `#b58cff` | tia điện | **tia sét** (`bolts`) đổi vị trí 12 lần / s | 26 | cộng sáng |
| Hàn Tuyết Phiêu | `fx.cos.aura_tuyet` | `#e6f6ff` | bông tuyết | rơi 0,35 m/s, lắc | 40 | thường |
| Bộ Bộ Sinh Liên | `fx.cos.aura_sen` | `#ffd27a` | hạt vàng | **đĩa sen** dưới chân; ★ mỗi bước nở một bông sen 0,5 m tàn sau 1,2 s | 26 | cộng sáng |

**Lưu ý trợ năng:** Cửu Thiên Lôi Quang đổi vị trí tia 12 lần / giây — vượt ngưỡng nhấp nháy 3 lần / giây nếu tia sáng mạnh. ★ Giới hạn: tia sáng tối đa 30% so với hạt, đổi vị trí 12 lần / s nhưng **cường độ** chỉ đổi 2 lần / s; khi tắt «Nhấp nháy, lóe sáng» (UI-76) tia đứng yên.

### 4.2 Vệt bước (`TRAIL_SKIN`, đã có)

| Món | Khóa | Màu | Cỡ | Độ trong | Hòa trộn | Đặc biệt |
|---|---|---|---|---|---|---|
| Đằng Vân Bộ | `fx.cos.trail_may` | `#ffffff` | 0,9 | 0,55 | thường | mây cuộn |
| Liên Hoa Bộ | `fx.cos.trail_sen` | `#ffa8c4` | 0,32 | 0,9 | thường | cánh sen (`petal`) |
| Hỏa Vân Bộ | `fx.cos.trail_lua` | `#ff7a2a` | 0,42 | 0,8 | cộng sáng | — |
| Băng Phách Bộ | `fx.cos.trail_bang` | `#9fe8ff` | 0,24 | 0,9 | cộng sáng | lấp lánh (`twinkle`) |
| Tinh Hà Bộ | `fx.cos.trail_sao` | `#ffe08a` | 0,18 | 1,0 | cộng sáng | lấp lánh |

### 4.3 Ngự vật (`accessories.js › buildMount`)

| Món | Khóa | Hình | Hiệu ứng kèm |
|---|---|---|---|
| Ngự Kiếm | `fx.cos.mount_kiem` | kiếm dưới chân | tấm sáng màu hành dưới kiếm; ★ vệt ánh kim mảnh khi bay nhanh |
| Cân Đẩu Vân | `fx.cos.mount_may` | 6 tấm mây (đã có) | ★ mây rơi rớt lại phía sau |
| Hồ Lô Phi Hành | `fx.cos.mount_holo` | hồ lô tím vàng | ★ khói tím mảnh từ miệng hồ lô |
| Liên Hoa Đài | `fx.cos.mount_sen` | đài sen vàng | ★ cánh sen rơi thưa |
| Tiên Hạc | `fx.cos.mount_hac` | hạc sải cánh | ★ lông vũ rơi thưa (1 / 2 s) |

### 4.4 Vật sau lưng có chuyển động

| Món | Khóa | Hiệu ứng |
|---|---|---|
| Phượng Hỏa Dực | `fx.cos.back_phuong` | đôi cánh đập chậm (0,8 Hz), viền lửa phát sáng, tàn lửa rơi 4 / s |
| Tiên Hạc Dực | `fx.cos.back_hac` | đập chậm (0,6 Hz), không hạt |
| Bát Quái Pháp Luân | `fx.cos.back_phapluan` | vòng bát quái xoay 0,3 rad/s, phát sáng vàng nhẹ |
| Đăng Lung Dạ Hành (cầm tay) | `fx.cos.hand_denlong` | đèn sáng thật ban đêm (đã có: `night` truyền vào `outfit.update`) — đèn điểm mượn từ `fx.light.pool` |

### 4.5 Khung tên (CSS, đã có)

`.hq-frame-khung_may` (mây, quầng xanh trắng), `khung_sen` (hồng), `khung_ngoc` (ngọc bích), `khung_long` (vàng, quầng 12 px, chữ phát sáng, tiền tố 🐉). ★ Thay 🐉 bằng hình rồng Huyền Ấn (phần 07 §4); tắt `text-shadow` phát sáng khi bật tương phản cao.

### 4.6 Hiệu ứng bộ (đủ 4 món) và Hợp mệnh

★ Mặc đủ bộ ngũ hành: thêm **một vòng chữ Hán** của hành đó (木 / 火 / 土 / 金 / 水) bay quanh chân 0,1 rad/s, mờ 40%. Bộ **Hợp mệnh** (trùng Dụng thần): vòng chữ sáng hơn và có thêm chữ 用. Người khác nhìn thấy (đồng bộ qua `cos` sẵn có).

---

## 5. Hiệu ứng nghi thức

| Khóa | Nghi thức | Mô tả | Thời lượng | Hạt tối đa |
|---|---|---|---|---|
| `fx.rite.ascend` | đột phá cảnh giới (UI-33) | cột sáng màu Dụng thần từ đất lên trời mảnh (bán kính 0,6 m), chữ Hán bậc mới viết bằng nét mực phát sáng trên trời, mây xoáy quanh | 9 s | 200 |
| `fx.rite.vow` | đại nguyện Liễu Phàm | giấy vàng bay lên thành chữ 願, tan thành bụi vàng | 9 s | 150 |
| `fx.rite.menhdo` | xong tầng Mệnh Đồ | vệt mây từ chân người chơi bay lên một bậc (trong cảnh: một sợi khói vàng) | 3 s | 60 |
| `fx.rite.seal` | đóng ấn phù (UI-82) | sóng sáng tròn lan ra từ ấn, giấy phát sáng màu hành 1 s | 1,2 s | 40 |
| `fx.rite.ink` | nét mực (UI-04, UI-05) | shader nét bút: viền loang, đầu nét vát, mực thấm giấy | theo nét | — |
| `fx.rite.lamp` | thắp đèn Thái Tuế / đèn lễ | ngọn lửa bùng (cao 1,4× trong 0,4 s) rồi ổn định; quầng sáng ấm | 1,2 s | 12 |
| `fx.rite.incense` | thắp nhang | đầu nhang đỏ (đã có `tip`), khói (đã có `fx.env.smoke`), ★ tàn nhang rơi xuống lư mỗi 25 s | liên tục | 30 |
| `fx.rite.lantern_float` | thả đèn hoa đăng | đèn trượt khỏi tay, gợn nước tròn, trôi (đã có) | 4 s | 10 |
| `fx.rite.release` | phóng sinh | cá: vệt bọt + gợn; chim: vài lông vũ rơi | 3 s | 20 |
| `fx.rite.mandala` | mạn-đà-la cát | hạt cát tĩnh (mỗi lần rắc thêm vào texture vẽ — không phải hạt sống, để không tốn); khi **xóa**: cát cuộn về tâm thành dòng rồi rót xuống suối | 6 s khi xóa | 300 (lúc xóa) |
| `fx.rite.prayerwheel` | bánh xe kinh | bánh quay (vật lý quay giảm dần), không hạt | — | 0 |
| `fx.rite.baidau` | bái Đẩu (UI-93) | đèn thắp → một ngôi sao trên trần sáng dần, nối vệt sáng mảnh tới sao trước | 1,5 s / sao | 20 |
| `fx.rite.lotus9` | Cửu phẩm liên hoa (Bút Tháp) quay | tháp gỗ 9 tầng quay chậm; tầng vừa mở sáng ấm | — | 0 |
| `fx.rite.bow` | lạy / sám hối (UI-92) | mỗi lạy đúng nhịp: một vòng sáng trắng ngà lan nhẹ trên sàn quanh người lạy | 0,8 s | 0 (decal) |
| `fx.rite.hoidau` | danh hiệu Hồi Đầu | sương tím quanh người tan dần, ánh nắng chiếu xuống | 6 s | 80 |
| `fx.rite.amba` | nhận Âm Bài | ánh sáng **giảm** quanh người chơi (vignette tối nhẹ 3 s), một luồng gió lạnh làm lá bay ngược — **không** đầu lâu, ma, máu | 3 s | 30 |
| `fx.rite.thuluc` | thụ lục (Long Hổ) | khói hương xoắn thành hình ấn vuông rồi tan | 4 s | 120 |
| `fx.rite.celebrate` | ăn mừng theo hành (`renderer.celebrate(wx)`, đã có) | vòng Thiên Bàn đổi màu hành + ★ hạt hành tương ứng bung nhẹ quanh người chơi | 6 s | 60 |

---

## 6. Thời tiết, môi trường, hậu kỳ

### 6.1 Thời tiết

| Khóa | Hiện tượng | Thực hiện | Ghi chú |
|---|---|---|---|
| `fx.wx.rain` | mưa | hạt dạng vạch rơi (instanced), mật độ theo chất lượng; gợn mưa trên mặt nước (texture động); mặt đá ướt (giảm roughness 0,85 → 0,4) | ô giấy dầu (`o_giay`) che: không gợn trên vai |
| `fx.wx.drizzle` | mưa phùn | lớp sương hạt rất nhỏ gần camera | Bắc Bộ (Bút Tháp, Yên Tử) xuân |
| `fx.wx.snow` | tuyết | bông tuyết rơi lắc; tuyết đọng trên mái (vật liệu mái trộn trắng theo pháp tuyến hướng lên) | Chung Nam đông, Tạng |
| `fx.wx.fog` | sương | `Fog` gần lại (260 → 80 m), màu theo giờ; dải sương thấp ở thung lũng (tấm mờ) | Mao Sơn, Phong Đô |
| `fx.wx.lightning` | chớp | sáng toàn cảnh tối đa **2 lần / 4 s**, mỗi lần ≤ 120 ms, độ tăng sáng ≤ 40%; tắt hẳn khi tắt «Nhấp nháy» — thay bằng sáng dần 1 s | an toàn động kinh |
| `fx.wx.wind` | gió | cây lắc (vertex shader), cờ / phướn bay; độ mạnh theo vùng | — |
| `fx.wx.cloudsea` | biển mây | tấm mây lớn chuyển động UV dưới chân núi | Võ Đang, Côn Lôn |

### 6.2 Môi trường theo vùng (bổ sung ★)

| Khóa | Vùng | Hiệu ứng |
|---|---|---|
| `fx.env.lungta` | Tạng | cờ gió năm màu căng qua đèo, bay theo gió (vải mô phỏng xương) |
| `fx.env.waterfall` | Côn Lôn, Võ Đang | thác (UV cuộn + bụi nước ở chân) |
| `fx.env.bianhua` | Phong Đô | hoa bỉ ngạn đỏ lắc nhẹ; hạt phấn đỏ bay thưa (không phải «máu») |
| `fx.env.bamboo` | Mao Sơn | trúc lắc, lá trúc rơi |
| `fx.env.pinecone` | Yên Tử | lá tùng rơi, tia nắng xuyên rừng (god rays — chỉ chất lượng Cao) |
| `fx.env.ricefield` | Bút Tháp, Miêu Cương | lúa gợn sóng theo gió (vertex) |
| `fx.env.cranes` | Côn Lôn, Sơn Môn (đã có `crane` khi ≥ 500 Phúc Khí) | hạc bay vòng |
| `fx.env.redcliff` | Long Hổ | bụi nắng đỏ cam trên vách đan hà lúc chiều |
| `fx.env.steam` | Trà Thất, lò đan Võ Đang, nồi thuốc | hơi nước bốc |
| `fx.env.fireflies` | (đã có) mở rộng sang Bút Tháp, Miêu Cương đêm hè | — |

### 6.3 Hậu kỳ

| Khóa | Hiệu ứng | Chất lượng | Ghi chú |
|---|---|---|---|
| `fx.post.bloom` | (đã có) | Vừa, Cao | — |
| `fx.post.tonemap` | ACES, phơi sáng 1,05 (đã có) | mọi mức | — |
| `fx.post.vignette` | tối viền 15% | Vừa, Cao | chỉ trong cảnh cắt, nghi thức, Âm Bài |
| `fx.post.dof` | lấy nét nông | Cao | cảnh cắt, chụp ảnh |
| `fx.post.inkwash` | bộ lọc **thủy mặc** (chụp ảnh UI-98, tùy chọn trong cảnh): khử bão hòa 85%, tăng tương phản biên (Sobel nhẹ), ánh giấy ngà | Vừa, Cao | — |
| `fx.post.paper` | bộ lọc **giấy dó**: texture giấy nhân, ấm màu | mọi mức | rẻ (một lần nhân texture) |
| `fx.post.godrays` | tia nắng | Cao | rừng Yên Tử, điện có cửa sổ |
| `fx.post.colorgrade` | LUT theo vùng (bảng màu khóa canon §7) | Vừa, Cao | đảm bảo «đọc được vùng bằng màu» |

---

## 7. Giảm chuyển động và trợ năng hình

| Tùy chọn (UI-76) | `fx.*` bị ảnh hưởng | Hành vi |
|---|---|---|
| Giảm chuyển động | mọi `fx.env.*` trang trí (đã có cho một phần), `fx.rite.ascend` (bỏ cột sáng bay, giữ chữ tĩnh), `fx.wx.wind` (cây không lắc) | hạt mang thông tin → tĩnh |
| Hạt, khói, cánh hoa: Ít | mọi hạt × 0,4 | — |
| Hạt, khói, cánh hoa: Tắt | mọi hạt trang trí tắt; gia trì giữ vòng hào quang **tĩnh** (biết hành), bỏ motes / trail | — |
| Nhấp nháy, lóe sáng: Tắt | `fx.wx.lightning` sáng dần; `fx.cos.aura_set` đứng yên; nến không nhấp nháy | — |
| Tương phản cao | `fx.post.bloom` giảm 50%, bỏ `text-shadow` phát sáng trên khung tên | — |
| Mù màu | màu `WX.glow` thay theo bộ mù màu (phần 14 §2); hình chuyển động theo hành giữ nguyên | — |

---

## 8. Ngân sách hiệu năng

### 8.1 Mục tiêu khung hình

| Thiết bị tham chiếu | Chất lượng | Mục tiêu | Ngưỡng tự hạ (đã có) |
|---|---|---|---|
| điện thoại tầm trung (Snapdragon 7-series, 2023; iPhone 12) | Vừa | 45–60 fps | < 35 fps trung bình 3 s → tắt bóng, `pixelRatio 1` |
| điện thoại yếu (Helio G-series; iPhone 8) | Thấp | 30 fps | như trên; dưới 20 fps → gợi ý 2D |
| máy tính tích hợp (Intel Iris Xe) | Vừa | 60 fps | — |
| máy tính rời | Cao | 60+ fps | — |

### 8.2 Ngân sách theo mức chất lượng (`world3d.js › QUALITY` mở rộng)

| Hạng mục | Thấp | Vừa | Cao | Ghi chú |
|---|---|---|---|---|
| Lệnh vẽ (draw call) / khung | ≤ 180 | ≤ 300 | ≤ 600 | đo bằng `renderer.info.render.calls` (đã có trong `info()`) |
| Tam giác / khung | ≤ 350 nghìn | ≤ 800 nghìn | ≤ 2 triệu | — |
| Bóng | tắt / 1.024 | 1.536 | 2.048 | `QUALITY.shadow` |
| Đèn điểm | 6 | 10 | 16 | `POOL_N` |
| Bloom | tắt | bật | bật | — |
| Hạt sống toàn cảnh | ≤ 600 | ≤ 1.500 | ≤ 4.000 | tổng mọi `Points` + instanced |
| Hạt của **chính người chơi** (gia trì + trang phục) | ≤ 80 | ≤ 140 | ≤ 220 | aura 1 đĩa + motes 26–40 + trail 40 + halo + mount |
| Người chơi khác có hiệu ứng đầy đủ | 3 (< 16 m) | 6 (< 24 m) | 10 (< 32 m) | xa hơn: chỉ đĩa hào quang tĩnh; > 60 m: không hiệu ứng |
| Lớp cộng sáng chồng nhau (overdraw) | ≤ 2 lớp toàn màn tương đương | ≤ 3 | ≤ 4 | hạt cộng sáng gần camera là thủ phạm chính — giới hạn cỡ hạt khi camera < 3 m |
| Texture hiệu ứng (bộ nhớ GPU) | ≤ 16 MB | ≤ 32 MB | ≤ 64 MB | atlas 1.024² cho hạt |
| Cập nhật hạt bằng JS / khung | ≤ 1,0 ms | ≤ 1,5 ms | ≤ 2,5 ms | hiện vòng `animate()` cập nhật `BufferAttribute` trên CPU — ★ chuyển hạt môi trường sang shader (vị trí tính trên GPU theo thời gian) |
| Hậu kỳ | tonemap | + bloom, vignette, LUT | + DOF, god rays | — |

### 8.3 Ngân sách theo khoảnh khắc

| Khoảnh khắc | Cho phép vượt | Điều kiện |
|---|---|---|
| đột phá (UI-33) | hạt +200, DOF ở mức Vừa | HUD ẩn, người chơi khác ẩn hiệu ứng trong 9 s |
| lễ hội MMO (60 người) | — | **không** vượt: người khác > 10 chỉ hiện đĩa tĩnh; đèn hoa đăng tối đa 40 chiếc toàn hồ |
| cảnh cắt | +30% lệnh vẽ | cảnh dựng sẵn, đã đo |

### 8.4 Đo và giám sát

- `render3d.js › info()` đã trả `renderer.info.render` + `quality` + số cây + chunk chờ — dùng cho màn gỡ lỗi hiệu năng (phím ẩn) và kiểm thử tự động.
- Kiểm thử ảnh tự động đặt `setView` + `debugHour` tại 30 điểm cố định, ghi fps / lệnh vẽ / hạt; vượt ngân sách → lỗi build (tài liệu 13).

---

## 9. Nghiệm thu VFX

1. Năm hành phân biệt được bằng **chuyển động** khi ảnh đã khử màu (thử 10 người, ≥ 90% đúng).
2. Trong mọi điện thờ: không vệt bước, gia trì ≤ 50% độ sáng, không hạt nào xuyên tượng.
3. Không hiệu ứng nào vượt 3 lần lóe / giây (kiểm bằng công cụ phân tích chớp — tiêu chí PEAT / Harding).
4. Bật «Hạt: Tắt» + «Giảm chuyển động»: vẫn đọc được hành của người chơi (vòng hào quang tĩnh), đèn đã thắp, nhang đang cháy.
5. Sân Sơn Môn 60 người chơi trên điện thoại tầm trung: ≥ 40 fps, hạt ≤ 1.500.
