# 10 · Phần 08 — Sự kiện máy chủ: Thiên Mệnh Bàn, Sửa cầu đường, Đại lễ

> Căn cứ: bản sơ đồ §5.3 («修橋補路 sửa cầu đường: góp công sửa đường đá giữa các vùng (sự kiện máy chủ) +2»), §9.2 («Một năm can chi: Mùa … sự kiện Thiên Mệnh Bàn»; «Một tháng âm: Mùng 1 / Rằm: sự kiện chung (dâng hương, phóng sinh tập thể)»); canon §3 (tọa độ vùng); code thật: `src/engine/annual-taboo.js › annualTabooOverview`, `xuankong.js › yearFlyingStar`, `fengshui-compass.js › SHAN_WX, shanFromDegree`, `fs-cure` (hóa sát), `state.js › lightLamp` (đèn Thái Tuế), `protocol.js › ROOM_CAP = 60, MAX_ROOMS = 50`.
>
> Mã: `EV-TMB-xx` (Thiên Mệnh Bàn), `EV-CAU-xx` (sửa cầu đường), `EV-DL-xx` (đại lễ máy chủ). Kiến trúc máy chủ (EventHub) ở Phần 12 §12.5; gói giao thức ở Phần 11 §11.7.

## 8.0 Nguyên tắc chung của sự kiện máy chủ

1. **Cả máy chủ cùng làm một việc.** Tiến độ là **một con số chung**, mọi phòng (shard) thấy cùng số.
2. **Không ai bị bỏ lại.** Người chơi đơn (offline) không góp được tiến độ chung nhưng vẫn có phiên bản cá nhân của nội dung (để không mất cốt truyện).
3. **Mục tiêu co giãn theo dân số** (§8.6): máy chủ 300 người hay 30.000 người đều xong trong khoảng thời gian dự định.
4. **Trần cá nhân mỗi ngày:** không ai «gánh» được sự kiện; người chơi ít thời gian vẫn góp phần có nghĩa.
5. **Thưởng theo ngưỡng tham gia**, không theo thứ hạng (bia sự kiện `GUILD-LB-11` ghi mọi người đạt ngưỡng).
6. **Công đức ghi cho người làm** (Phần 01 §1.10.1): «Sửa cầu đường» +2 (thang app) — mỗi người được ghi khi **chính mình** góp đủ ngưỡng một đoạn.
7. **Không có thất bại trừng phạt.** Sự kiện không xong đúng hạn thì kéo dài thêm với mục tiêu giảm; thế giới không «bị phạt».

---

## 8.1 `EV-TMB` — Thiên Mệnh Bàn (sự kiện mở mùa)

### 8.1.1 Ý niệm

Thiên Mệnh Bàn là **la bàn lớn** của Huyền Giới (vị trí và nguồn gốc theo tài liệu 02/03/07; tài liệu này chỉ định nghĩa cơ chế). Mỗi khi đổi năm can chi, khí trường xoay vần: **những phương phạm sát năm mới** làm các cung tương ứng trên Thiên Mệnh Bàn **lệch, mờ**. Người chơi cả máy chủ cùng **hóa giải** để Bàn sáng lại — đúng phương pháp phong thủy app đang dạy, không phải «đánh quái».

Ý nghĩa trò chơi: mỗi mùa, người chơi **học bản đồ sát của năm** bằng cách làm việc thật trên đó; năm nào biết hướng nào kỵ năm đó.

### 8.1.2 Hai mươi bốn sơn — cấu trúc của Bàn

Bàn chia 24 cung theo `fengshui-compass.js › SHAN_24` (mỗi sơn 15°, bắt đầu từ 壬 tại 337,5°). Hành theo **chính thể ngũ hành** (`SHAN_WX`: khẩu quyết «壬子癸水 / 丑艮寅土 / 甲卯乙木 / 辰巽巳木 / 丙午丁火 / 未坤申土 / 庚酉辛金 / 戌乾亥水»; engine ghi chú Càn có biến thể Kim).

| # | Sơn | Tên | Độ | Cung (quái) | Phương | Hành (`SHAN_WX`) |
|---|---|---|---|---|---|---|
| 1 | 壬 | Nhâm | 337,5–352,5 | Khảm | Bắc | Thủy |
| 2 | 子 | Tý | 352,5–7,5 | Khảm | Bắc | Thủy |
| 3 | 癸 | Quý | 7,5–22,5 | Khảm | Bắc | Thủy |
| 4 | 丑 | Sửu | 22,5–37,5 | Cấn | Đông Bắc | Thổ |
| 5 | 艮 | Cấn | 37,5–52,5 | Cấn | Đông Bắc | Thổ |
| 6 | 寅 | Dần | 52,5–67,5 | Cấn | Đông Bắc | Thổ |
| 7 | 甲 | Giáp | 67,5–82,5 | Chấn | Đông | Mộc |
| 8 | 卯 | Mão | 82,5–97,5 | Chấn | Đông | Mộc |
| 9 | 乙 | Ất | 97,5–112,5 | Chấn | Đông | Mộc |
| 10 | 辰 | Thìn | 112,5–127,5 | Tốn | Đông Nam | Mộc |
| 11 | 巽 | Tốn | 127,5–142,5 | Tốn | Đông Nam | Mộc |
| 12 | 巳 | Tỵ | 142,5–157,5 | Tốn | Đông Nam | Mộc |
| 13 | 丙 | Bính | 157,5–172,5 | Ly | Nam | Hỏa |
| 14 | 午 | Ngọ | 172,5–187,5 | Ly | Nam | Hỏa |
| 15 | 丁 | Đinh | 187,5–202,5 | Ly | Nam | Hỏa |
| 16 | 未 | Mùi | 202,5–217,5 | Khôn | Tây Nam | Thổ |
| 17 | 坤 | Khôn | 217,5–232,5 | Khôn | Tây Nam | Thổ |
| 18 | 申 | Thân | 232,5–247,5 | Khôn | Tây Nam | Thổ |
| 19 | 庚 | Canh | 247,5–262,5 | Đoài | Tây | Kim |
| 20 | 酉 | Dậu | 262,5–277,5 | Đoài | Tây | Kim |
| 21 | 辛 | Tân | 277,5–292,5 | Đoài | Tây | Kim |
| 22 | 戌 | Tuất | 292,5–307,5 | Càn | Tây Bắc | Thủy (biến thể Kim) |
| 23 | 乾 | Càn | 307,5–322,5 | Càn | Tây Bắc | Thủy (biến thể Kim) |
| 24 | 亥 | Hợi | 322,5–337,5 | Càn | Tây Bắc | Thủy (biến thể Kim) |

Trong game, Bàn dựng thành **đài tròn đường kính 48 m** chia 24 rẻ quạt; người chơi đi vào từng rẻ quạt được (mỗi rẻ quạt là một «gian lộ thiên» có bàn hóa giải — công năng thật, khớp T4).

### 8.1.3 Cung nào hỏng: lấy từ engine của năm

Khi mùa mở (giờ Lập Xuân), máy chủ gọi `annual-taboo › annualTabooOverview(năm)` và `xuankong › yearFlyingStar(năm)`. Mỗi phương (8 cung) có danh sách sát `taboos[]` với `type` và `severity` (1–5). **Ba sơn của cung đó** nhận độ hỏng:

```
độ_hỏng(cung) = Σ severity của các sát trong cung        (0 nếu sạch)
công_cần(sơn) = W_sơn × (1 + độ_hỏng(cung của sơn))        (§8.6 tính W_sơn)
```

**Ví dụ thật — năm Đinh Mùi 2027** (đã chạy engine):

| Cung | Sát (engine) | Độ hỏng | Sơn bị ảnh hưởng |
|---|---|---|---|
| Bắc | Ngũ Hoàng (5) | 5 | Nhâm, Tý, Quý |
| Đông Bắc | Tuế Phá (4) | 4 | Sửu, Cấn, Dần |
| Đông | — | 0 | Giáp, Mão, Ất |
| Đông Nam | — | 0 | Thìn, Tốn, Tỵ |
| Nam | — | 0 | Bính, Ngọ, Đinh |
| Tây Nam | Thái Tuế (3) | 3 | Mùi, Khôn, Thân |
| Tây | Tam Sát (4), Nhị Hắc (2) | 6 | Canh, Dậu, Tân |
| Tây Bắc | — | 0 | Tuất, Càn, Hợi |

Engine tóm tắt: «Năm 2027: hướng KỴ nặng: Bắc (Ngũ Hoàng), Đông Bắc (Tuế Phá), Tây (Tam Sát/Nhị Hắc). Hướng SẠCH: Đông, Đông Nam, Nam, Tây Bắc.»

**Năm Mậu Thân 2028** (đã chạy engine): Đông Bắc — Tuế Phá (4) + Nhị Hắc (2) = 6; Nam — Tam Sát (4) = 4; Tây Nam — Thái Tuế (3) + Ngũ Hoàng (5) = 8; các cung còn lại sạch.

Vì engine quyết định, **mỗi mùa Bàn hỏng một kiểu khác** — người chơi không làm lại y hệt năm trước.

### 8.1.4 Cách hóa giải theo loại sát (không «động thổ» ở phương kỵ)

Phong thủy cổ pháp kỵ **động thổ** ở phương Ngũ Hoàng, Tam Sát, Tuế Phá. Vì vậy ở các sơn đó, người chơi **không** «xây, đục, sửa đá» mà **hóa giải** theo đúng phép app dạy (`fs-cure`, `taisui › TAISUI_REMEDY`). Đây là chỗ sự kiện dạy học thật.

| Loại sát | Ý nghĩa (engine) | Việc hóa giải trong sự kiện | Hoạt động người chơi | Engine |
|---|---|---|---|---|
| **Ngũ Hoàng** (五黃, sao 5) | đại kỵ, không động thổ | dùng **Kim** tiết Thổ: treo chuông đồng, khánh đồng; tĩnh, không đào | (a) vác chuông đồng nhỏ từ lò đúc tới rẻ quạt và treo (đi bộ); (b) giải án khách ở Sảnh Cách Cục / Trạch Nhật (Kim = trí); (c) kết phù ở Long Hổ (bản ký tự hư cấu) | `fs-cure`, `xuankong` |
| **Thái Tuế** | không xung, nên an | **an Thái Tuế**: thắp đèn | thắp/thêm dầu đèn Thái Tuế ở Thái Tuế Điện (đã có: `state.js › lightLamp`, mỗi năm một ngọn, mỗi ngày thêm dầu) — mỗi lần thắp/thêm dầu khi sự kiện mở được tính công cho sơn Thái Tuế | `thaitue.js`, `taisui` |
| **Tuế Phá** (đối xung Thái Tuế) | phá, chia rẽ | **hòa**: việc hòa giải giữa người với người | dàn hòa NPC (`GUILD-RITE-BD-02` Giải Oan), «nói lời hòa hợp» trong hội thoại, mời trà người lạ (`tea`) | `YEGUO › Lưỡng thiệt` (cure) |
| **Tam Sát** | «kỵ tọa, không kỵ hướng» | không đứng **tựa** lưng vào phương sát; làm việc **quay mặt** về phía đó | rẻ quạt Tam Sát chỉ nhận công khi người chơi đứng **quay mặt** vào phương sát (hướng nhìn `h` trong gói `mv`); trò chơi «xoay la bàn» ở La Bàn Đài (station `compass` có sẵn) | `annual-taboo`, `fengshui-compass` |
| **Nhị Hắc** (二黑 bệnh phù) | bệnh tật | **Kim** + hồ lô; chăm sóc sức khỏe | Y Lư: hái thuốc theo mùa; mang nước ấm cho NPC già; (câu nhắc: «đau ốm thật thì gặp thầy thuốc») | `tcm`, `fs-cure` |
| **Cung sạch** | không sát | **an tinh**: giữ cho sáng | đồng tu ở rẻ quạt (Phần 04 §4.2); thả hoa đăng (cung Thủy); trồng cây (cung Mộc); thắp đèn (cung Hỏa); quét dọn (cung Thổ); đọc sách (cung Kim) | — |

Mỗi rẻ quạt có **bảng chỉ dẫn** đi vào được: đọc ra loại sát, vì sao kỵ, việc cần làm, và câu nhắc «Đây là phép hóa giải trong game theo cổ pháp; nhà thật của bạn nên xem bằng Sổ Mệnh › Dương Trạch với hướng nhà thật.»

### 8.1.5 Bốn giai đoạn

| Giai đoạn | Mốc (tiết khí) | Việc |
|---|---|---|
| **Khai** (開) | Lập Xuân → Vũ Thủy (~15 ngày) | Bàn hiện các cung hỏng; người chơi «chẩn» từng rẻ quạt (đọc bảng, trả lời 2 câu hỏi nhỏ: sát gì, kỵ gì) — chẩn đủ 24 rẻ quạt bởi cả máy chủ (mỗi rẻ quạt cần `ceil(N/200)` lượt chẩn, tối thiểu 3) thì mở giai đoạn sau |
| **Hóa** (化) | Vũ Thủy → Xuân Phân (~30 ngày) | hóa giải các cung hỏng theo §8.1.4 |
| **An** (安) | Xuân Phân → Thanh Minh (~15 ngày) | an tinh mọi cung (kể cả cung sạch) — việc nhẹ, ai cũng làm được |
| **Thành** (成) | ngày Thanh Minh hoặc sớm hơn khi xong | **Đại lễ khánh thành** `EV-DL-01` (§8.3.2) |

Giai đoạn chỉ chuyển khi giai đoạn trước đạt 100% **hoặc** hết hạn. Hết hạn mà chưa đạt: giai đoạn sau mở, phần còn lại của giai đoạn trước giảm mục tiêu 30% và chạy song song.

### 8.1.6 Kịch bản mở và đóng

```
[CẢNH EV-TMB-01.MO · sân Sơn Môn, trước Thiên Mệnh Bàn · giờ giao tiết Lập Xuân · gió đầu xuân]
(mọi người chơi online thấy thông báo; ai đứng gần Bàn thấy cảnh trực tiếp, người khác xem lại trong Sổ Mệnh)
THẦY TỬ BÌNH: Năm mới vào tiết rồi. Các con nhìn Bàn.
(các rẻ quạt phương sát mờ đi, kim Bàn rung)
THẦY TỬ BÌNH: Năm nay {danh sách cung kỵ từ engine}. Chỗ nào tối là chỗ năm nay phải giữ.
KHỔNG TIÊN SINH: (đứng ở bậc đá, cười) Bàn hỏng là số trời. Sửa làm gì cho mệt?
THẦY TỬ BÌNH: Số trời là trời xoay. Người thì sửa. Năm nào cũng thế.
THẦY TỬ BÌNH: Chỗ Ngũ Hoàng đừng đào. Chỗ Thái Tuế thì thắp đèn. Chỗ Tuế Phá thì đi làm hòa với nhau. Ai chưa biết, vào từng gian mà đọc.
→ mở giai đoạn Khai
```

```
[CẢNH EV-TMB-01.DONG · Thiên Mệnh Bàn · sau Đại lễ khánh thành]
(24 rẻ quạt sáng; kim Bàn chỉ thẳng; tên những người đạt ngưỡng chạy quanh vành Bàn)
THẦY TỬ BÌNH: Sáng rồi. Năm nay ai cũng biết nhà mình nên tránh hướng nào.
KHỔNG TIÊN SINH: (lặng một lúc) … Năm sau nó lại tối.
THẦY TỬ BÌNH: Thì năm sau lại sửa. Tu là thế.
```

### 8.1.7 Ngưỡng và thưởng

| Ngưỡng cá nhân (công góp trong cả sự kiện) | Thưởng |
|---|---|
| ≥ 1 lượt chẩn | tên trên vành Bàn (`GUILD-LB-11`) — tự nguyện, mặc định bật với nhóm A, tắt với nhóm T |
| ≥ 60 công | khung tên mùa «Hộ Bàn {năm can chi}» |
| ≥ 200 công | vật bày nhà riêng: «La bàn đồng mini {năm}» (mỗi năm một mẫu, ghi can chi) |
| ≥ 400 công, có góp ở ≥ 4 loại sát khác nhau | danh xưng «Thông Sát {năm}» — người đã học đủ các loại sát năm đó |
| Toàn máy chủ hoàn thành Thành | mọi người online trong 7 ngày sau nhận pháo giấy đỏ tại nhà riêng + 50 Phúc Khí |

Công đức: góp ≥ 30 công ở **giai đoạn Hóa** → ghi «Giúp người khó khăn» (+2, thang app) một lần / mùa (hóa giải cho thế giới chung là giúp người).

---

## 8.2 `EV-CAU` — Sửa cầu đường (sự kiện thường trực)

### 8.2.1 Mạng đường

Đường đá nối Huyền Thành với 8 vùng gốc và 12 thánh địa (canon §3; tọa độ tâm dùng để tính chiều dài — đường thật trong `terrain.js` / `world.js` sẽ dài hơn do uốn theo địa hình). Côn Lôn (đảo trời, cao 260 m) không có đường bộ — chỉ có Thiên Kiều (tài liệu 07).

| Mã | Đường | Chiều dài thẳng (m) | Số đoạn (≈ 100 m) | Mùa mưa ảnh hưởng mạnh |
|---|---|---|---|---|
| `EV-CAU-01` | Huyền Thành ↔ Am Vân Cốc | 260 | 3 | — |
| `EV-CAU-02` | Huyền Thành ↔ Thư Lâu Lâm | 700 | 7 | có (rừng) |
| `EV-CAU-03` | Huyền Thành ↔ Tử Bình Phong | 835 | 8 | — |
| `EV-CAU-04` | Huyền Thành ↔ Manh Phái Cốc | 825 | 8 | có (thung lũng) |
| `EV-CAU-05` | Huyền Thành ↔ Trích Thiên Đỉnh | 849 | 8 | — |
| `EV-CAU-06` | Huyền Thành ↔ Cùng Thông Hồ | 877 | 9 | có (hồ) |
| `EV-CAU-07` | Huyền Thành ↔ Phong Thủy Viên | 820 | 8 | — |
| `EV-CAU-08` | Huyền Thành ↔ Lịch Đường | 820 | 8 | — |
| `EV-CAU-09` | Lịch Đường ↔ Long Hổ Sơn | 709 | 7 | có (sông) |
| `EV-CAU-10` | Thư Lâu Lâm ↔ Võ Đang | 800 | 8 | — |
| `EV-CAU-11` | Manh Phái Cốc ↔ Chung Nam | 1.089 | 11 | — |
| `EV-CAU-12` | Cùng Thông Hồ ↔ Mao Sơn | 1.112 | 11 | có |
| `EV-CAU-13` | Trích Thiên Đỉnh ↔ Yên Tử | 922 | 9 | có (núi) |
| `EV-CAU-14` | Cùng Thông Hồ ↔ Bút Tháp | 888 | 9 | có (đồng bằng) |
| `EV-CAU-15` | Tử Bình Phong ↔ Tạng Địa | 1.150 | 12 | tuyết (mùa đông) |
| `EV-CAU-16` | Bút Tháp ↔ Văn Miếu | 640 | 6 | — |
| `EV-CAU-17` | Yên Tử ↔ Văn Miếu | 566 | 6 | — |
| `EV-CAU-18` | Phong Thủy Viên ↔ Phong Đô | 680 | 7 | có (sông) |
| `EV-CAU-19` | Trích Thiên Đỉnh ↔ Miêu Cương | 1.063 | 11 | có (rừng) |
| | **Tổng** | **15.604** | **156** | |

Trên mỗi đường có ít nhất một **cầu** (đoạn đặc biệt, công cần × 3) và một **trạm nghỉ** (§8.2.5).

### 8.2.2 Độ hư của đoạn đường

Mỗi đoạn có `hư ∈ [0, 100]`, bắt đầu mùa đầu tiên ở 40 (đường cũ).

**Tăng hư (mỗi ngày, máy chủ tính lúc giờ Tý):**

```
Δhư = mưa(tiết) + lưu_thông(đoạn) + biến_cố
mưa(tiết)       = 1,5 nếu tiết khí hiện tại ∈ {Cốc Vũ, Lập Hạ, Tiểu Mãn, Mang Chủng, Hạ Chí, Tiểu Thử, Đại Thử}
                  và đường có cờ «mùa mưa»; 0,5 nếu tiết khác; 0 nếu đường không cờ
                  (đường Tạng Địa: 1,5 trong Tiểu Tuyết → Đại Hàn — tuyết)
lưu_thông(đoạn) = số lượt người chơi đi bộ qua đoạn hôm qua / 400   (trần 1,0)
biến_cố         = theo cốt truyện / sự kiện (vd bão — tài liệu 03)  (thường 0)
```

**Hệ quả (không bao giờ chặn đường hoàn toàn):**

| Hư | Cảnh | Ảnh hưởng chơi |
|---|---|---|
| 0–30 | đường lành, cỏ hai bên | +5% tốc độ đi bộ trên đoạn (cảm giác thông thoáng) |
| 31–60 | ổ gà, đá lệch | không |
| 61–85 | vũng nước, đá vỡ | −10% tốc độ đi bộ trên đoạn; bụi/bùn bám vệt bước |
| 86–100 | đoạn sụt, cầu ván tạm | −20% tốc độ; A* ưu tiên đường vòng nếu có; **luôn còn lối qua** (cầu ván tạm, đò NPC) |

Ngự kiếm / bay không bị ảnh hưởng (nhưng không góp được công sửa khi đang bay).

### 8.2.3 Việc sửa

| Việc | Cách làm | Công | Hư giảm |
|---|---|---|---|
| **Vác đá** | lấy đá ở bãi đá gần nhất (mỗi đường có 1–2 bãi), đi bộ tới đoạn hư, thả vào ổ | 1 / chuyến | 0,4 |
| **Lát phiến** | phiến đá lớn **cần 2 người khiêng** (hai người bấm «khiêng» trong 3 giây, đi cùng nhịp — lệch > 4 m thì đặt xuống) | 3 / chuyến (mỗi người) | 1,5 |
| **Khơi rãnh** | mini-game đào rãnh thoát nước (vẽ đường cho nước chảy ra suối) | 2 | 0,8 |
| **Trồng cây ven đường** | trồng cây theo mùa (giống cây do Y Lư/Hậu Viên cung cấp) | 1 | 0,2 + giảm `mưa` của đoạn 20% trong mùa |
| **Sửa cầu** | đoạn cầu: thay ván (gỗ), buộc dây (giấy dó? → dây mây), đóng cọc; cần 3 người cùng lúc ở 3 vị trí | 4 / lượt | 2,0 (đoạn cầu) |
| **Dựng trạm nghỉ** | §8.2.5 | — | — |

**Trần:** 120 công / người / ngày cho mọi việc `EV-CAU` cộng lại. Thời gian tối thiểu mỗi chuyến vác đá: 8 giây (đi bộ thật được máy chủ kiểm qua chuỗi `mv`).

### 8.2.4 Ghi công đức

- Mỗi người góp ≥ 10 công **vào một đường** trong một tuần → ghi «Sửa cầu đường» +2 (thang app; canon «修橋補路 +2») một lần / đường / tuần, tối đa 3 lần / tuần.
- Ghi chú trong Sổ Công Quá: «Sửa đường {tên đường}» — người chơi nhìn lại được mình đã sửa những đâu.

### 8.2.5 Trạm nghỉ — công trình công cộng đi vào được

Mỗi đường có 1 trạm nghỉ ở giữa (đường dài > 1 km: 2 trạm). Trạm là **đình nhỏ đi vào được** (canon T4) với:

- 4 bồ đoàn (đồng tu nhỏ);
- ấm trà (mời trà — quà nhỏ Phần 05 §5.1.3 lấy ở đây được, 1 lần/ngày/người);
- bảng đường: độ hư từng đoạn, ai vừa sửa gần đây (tên tu, tự nguyện);
- **bia đường**: tên những người/chi đường góp nhiều nhất mùa trước (theo ngưỡng, không thứ hạng).

Trạm ban đầu là **nền đất trống**. Dựng trạm là dự án Hội Thiện (Phần 01 §1.13.2): cần 300 công + vật liệu công cộng (gỗ 80, ngói 40, đá 60) góp từ kho chi đường qua `NS-04`. Trạm dựng xong không xuống cấp.

### 8.2.6 Hội Thiện hằng tháng = dự án `EV-CAU`

Mùng 1 mỗi tháng âm, máy chủ chọn **3 dự án** cho Hội Thiện:

1. đường có **tổng hư cao nhất** (ưu tiên thực tế);
2. đường dẫn tới **thánh địa có lễ tiết** trong tháng (vd tháng Giêng: Yên Tử — `EV-YENTU-01`);
3. một **trạm nghỉ** chưa dựng (nếu còn), hoặc cầu hư nhất.

Dự án «hoàn thành» khi mọi đoạn của đường có hư ≤ 30 (hoặc trạm dựng xong).

### 8.2.7 Sửa đường cho người mới

Người cảnh giới 1 (chưa nhập tông) gặp đoạn hư lần đầu → Lão Tùng (người gác cổng Sơn Môn, `gac_cong`) xuất hiện ở trạm nghỉ gần nhất:

```
[CẢNH EV-CAU-TUT · trạm nghỉ đầu đường · bất kỳ giờ]
LÃO TÙNG: Đường xấu nhỉ. Ai đi cũng than, ít ai sửa.
LÃO TÙNG: Bãi đá ở kia. Vác một hòn thôi, bỏ vào cái ổ gà kia.
(người chơi vác — chuyến đầu được hướng dẫn)
LÃO TÙNG: Thế. Người xưa bảo sửa cầu sửa đường là việc thiện. Không ai cảm ơn con đâu. Người đi sau sẽ không vấp. Thế là được.
→ ghi «Sửa cầu đường» lần đầu (dù chưa đủ 10 công) — một lần duy nhất mỗi tài khoản
```

---

## 8.3 `EV-DL` — Đại lễ máy chủ

### 8.3.1 Danh mục

| Mã | Tên | Khi nào | Nơi | Gắn với |
|---|---|---|---|---|
| `EV-DL-01` | **Đại lễ Khánh thành Thiên Mệnh Bàn** | kết thúc `EV-TMB` (≤ Thanh Minh) | Thiên Mệnh Bàn, Huyền Thành | `EV-TMB` |
| `EV-DL-02` | **Vạn Đăng Thượng Nguyên** | Rằm tháng Giêng | Huyền Thành + 12 thánh địa | `EV-THUONGNGUYEN-01` |
| `EV-DL-03` | **Vạn Đăng Vu Lan** (thả hoa đăng toàn máy chủ) | Rằm tháng Bảy | mọi mặt nước có điểm thả | `EV-VULAN-01` |
| `EV-DL-04` | **Vạn Nhân Đồng Tu Đông Chí** | ngày Đông Chí | Huyền Thành, quảng trường | `EV-DONGCHI-01` |
| `EV-DL-05` | **Đại Hội Quy Nhất** (đàn liên tông) | Đại Hàn (cuối mùa) | sân lớn Huyền Thành | đóng mùa |

Đại lễ là **một khoảnh khắc đồng bộ** (bắt đầu cùng một giờ máy chủ) kéo dài 20–40 phút, với **mục tiêu chung toàn máy chủ** trong phiên đó.

### 8.3.2 `EV-DL-01` Khánh thành Thiên Mệnh Bàn

- **Thời điểm:** giờ Tỵ (09:00) ngày sau khi giai đoạn An đạt 100% (hoặc Thanh Minh), có suất lặp giờ Tuất (19:00).
- **Cấu trúc:** 3 pha × 8 phút.
  1. **Chầu:** người chơi đứng vào 24 rẻ quạt; mỗi rẻ quạt cần `ceil(N_online/24)` người (trần 60 — bằng `ROOM_CAP`). Người dư đứng vòng ngoài.
  2. **Xoay kim:** mỗi rẻ quạt giữ nhịp (mini-game nhịp đơn giản, ai cũng làm được); khi đủ rẻ quạt đạt nhịp, kim Bàn xoay một vòng 360° qua cả 24 sơn.
  3. **Định hướng:** kim dừng ở **hướng sạch** tốt nhất của năm (lấy từ `annualTabooOverview(năm).clean[0]` hoặc cung có sao cát mạnh nhất trong `yearFlyingStar(năm).pan`); Thầy Tử Bình đọc: «Năm nay hướng {…} sạch. Ai sửa nhà, chọn ngày lành mà làm phía đó.»
- **Phân phòng:** Thiên Mệnh Bàn nằm ở Huyền Thành — nơi đông nhất. Mỗi phòng TownShard (≤ 60 người) có **bản sao Bàn**; nhịp của tất cả phòng cộng về EventHub (Phần 12). Người chơi thấy trong phòng mình ≤ 60 người, nhưng thanh tiến độ là của cả máy chủ.

### 8.3.3 `EV-DL-02` Vạn Đăng Thượng Nguyên

- Mỗi người thắp **một ngọn đèn** ở bất kỳ điểm đèn nào (Huyền Thành + 12 thánh địa, mỗi nơi 1 quảng trường đèn).
- Mục tiêu toàn máy chủ: `N_đèn = 0,6 × N_hoạt_động_7_ngày` (trần 1.000.000). Đạt → đèn khắp Huyền Giới bay lên trời thành dải ngân hà (hiệu ứng trời đêm cả đêm Rằm).
- Mỗi ngọn đèn mang một **lời cầu** chọn từ danh sách (Phần 06 nhóm lễ tiết) — không ai đọc được lời của người khác.
- Chi tiết lễ: Phần 09 `EV-THUONGNGUYEN-01`.

### 8.3.4 `EV-DL-03` Vạn Đăng Vu Lan

- Thả hoa đăng (cử chỉ `tha_den`) ở mọi mặt nước có điểm thả: Hồ Sen Sơn Môn (station `sen` đã có — «Thả đèn hoa đăng»), hồ Cùng Thông, sông Phong Đô (`GUILD-RITE-BD-04`), ao Bút Tháp, suối Yên Tử.
- **iOS:** station `sen` thuộc `IOS_OFF` (đèn hoa đăng điều ước bị tắt vì 4.3(b)). Trên iOS, `EV-DL-03` đổi thành **«Thắp Đèn Báo Hiếu»** ở Văn Miếu: đèn không kèm điều ước cho bản thân, chỉ chọn lời **cảm ơn** («Cảm ơn mẹ», «Cảm ơn cha», «Cảm ơn thầy», «Cảm ơn người đã giúp tôi»).
- Mục tiêu: `0,5 × N_hoạt_động_7_ngày`. Đạt → sông Phong Đô sáng suốt đêm, Độ Nhân Kiều (công trình chung ở thánh địa) mở cửa cho mọi người (không cần cảnh giới 5) trong 24 giờ để **xem** (không làm nhiệm vụ).
- Chi tiết: Phần 10 `EV-VULAN-01`.

### 8.3.5 `EV-DL-04` Vạn Nhân Đồng Tu Đông Chí

- Đông Chí: «nhất dương sinh» — dương khí bắt đầu trở lại. Quảng trường Huyền Thành trải **bồ đoàn ảo** đủ chỗ cho mọi người online (mỗi phòng 60 bồ đoàn).
- Mọi người tĩnh tọa cùng nhịp máy chủ (cơ chế Đồng tâm Phần 04 §4.2.3 mở rộng): mỗi phòng tính tỷ lệ Đồng tâm; tỷ lệ trung bình toàn máy chủ hiện thành **mặt trời nhỏ** mọc dần ở chân trời.
- 20 phút; mỗi người nhận Đạo Hạnh theo luật đồng tu thường (không thêm thưởng riêng — thưởng là cảm giác và hình ảnh), cộng một **«Cửu Cửu Tiêu Hàn đồ»** (bức mai 81 cánh, Phần 10 `EV-DONGCHI-01`).

### 8.3.6 `EV-DL-05` Đại Hội Quy Nhất

- Cuối mùa (tiết Đại Hàn), một **đàn liên tông lớn** ở Huyền Thành: 9 tông (8 nếu `GUILD-MT` chưa mở) mỗi tông đảm nhận một **đoạn** của pha Hành theo cách tông mình (giống Đàn Tràng Liên Tông của chi đường, Phần 01 §1.13.4, nhưng quy mô máy chủ).
- Thứ tự đoạn (cố định): Nho (dâng lễ, đọc lời mở) → Chính Nhất (dâng sớ) → Toàn Chân (khóa tụng) → Thanh Vi (Thái Cực) → Thượng Thanh (tồn tư) → Bắc Đế (đèn cầu) → Thiền (lặng) → Tịnh Độ (liên đăng) → Chuẩn Đề (mạn-đà-la, nếu mở) → **cùng nhau**: một phút im lặng của cả máy chủ.
- Người chơi tham gia đoạn của **chính tông**; người không thuộc tông nào chọn đứng vòng ngoài và tham gia đoạn cuối «cùng nhau».
- Lời khép của Thầy Tử Bình: «Chín đường, một sân. Mùa sau mỗi người về đường mình. Nhớ sân này.»
- Mở cổng sang mùa mới (Lập Xuân sau đó ~15 ngày).

### 8.3.7 Đồng bộ đại lễ giữa các phòng

| Vấn đề | Giải pháp |
|---|---|
| Bắt đầu cùng lúc | EventHub gửi `ev_phase {id, phase, at}` với `at` là **giờ máy chủ tương lai** (trước 30 giây); client đếm ngược theo độ lệch đồng hồ đo khi kết nối (gói `welcome` thêm `now`) |
| Phòng đông > 60 | client tự sang phòng kế như hiện nay (`CLOSE_FULL` → `room += 1`); đại lễ có bản sao ở mọi phòng |
| Người đến muộn | vào pha hiện tại; không tính pha đã qua |
| Một phòng mất kết nối với EventHub | phòng tiếp tục pha theo `at` đã nhận; gom đóng góp, gửi bù khi nối lại (idempotent theo `seq`) |

---

## 8.4 Sự kiện mùng 1 và rằm

Bản sơ đồ §9.2: «Mùng 1 / Rằm: sự kiện chung (dâng hương, phóng sinh tập thể)». Mã lễ `EV-SOCVONG-01` (Phần 09 có lịch). Phần máy chủ:

| Ngày | Việc chung | Mục tiêu (toàn máy chủ) | Thưởng chung |
|---|---|---|---|
| Mùng 1 | dâng hương ở Lư Hương Sơn Môn (station `huong` đã có — `lightIncense`, `INCENSE_MS = 3 phút`) hoặc chính điện thánh địa | `0,3 × N_hoạt_động_7_ngày` nén | khói hương bay thành hình can chi của tháng trên trời Huyền Thành |
| Rằm | phóng sinh tập thể đúng cách (Phần 03 §3.2.4) ở hồ, sông | `0,2 × N_hoạt_động_7_ngày` lượt | đàn cá vàng tự nhiên xuất hiện ở Hồ Sen suốt tháng |

iOS: station `huong` đổi tên «Lò Trầm» (`TEXT.huong`), việc chung mùng 1 là «đốt một nén trầm» — vẫn hợp lệ (không phải bói).

---

## 8.5 Phiên bản chơi đơn

Người chơi offline (hoặc server chưa deploy — hiện `GAME-MMO-PROMPT-PLAN.md` ghi MMO «CHƯA deploy») vẫn có:

| Sự kiện | Bản đơn |
|---|---|
| `EV-TMB` | Bàn hỏng theo engine như bản MMO; mục tiêu = mục tiêu một người (W_sơn đơn = 10 công) — người chơi tự hóa giải 24 sơn trong mùa; kịch bản giống hệt |
| `EV-CAU` | độ hư của đường tính cục bộ, chỉ tăng khi người chơi đi qua; sửa một mình |
| `EV-DL-*` | phiên bản thu nhỏ: NPC đứng vào chỗ trống («người trong làng»), mục tiêu là của riêng người chơi; ghi chú «Ngoại tuyến — chỉ mình bạn thấy» (như `main.js` ghi «Đang chơi đơn — chỉ mình bạn thấy») |

**Không** giả lập người chơi ảo (nguyên tắc `GAME-MMO-PROMPT-PLAN.md`: «Không bao giờ giả lập người chơi ảo»): NPC trong bản đơn rõ ràng là NPC (áo dân làng, không tên người chơi, không nhãn tên kiểu người chơi).

---

## 8.6 Co giãn theo dân số

### 8.6.1 Đại lượng gốc

- `N7` = số tài khoản danh tính bền có ≥ 15 phút online trong 7 ngày qua (máy chủ đếm hằng ngày).
- `p` = tỷ lệ dự kiến tham gia sự kiện (dữ liệu thật sau mùa đầu; khởi đầu 0,35).
- `c` = công dự kiến mỗi người tham gia / ngày (khởi đầu 25 — tương đương ~20 phút việc sự kiện).
- `D` = số ngày thiết kế của giai đoạn.

### 8.6.2 Mục tiêu một giai đoạn

```
W_giai_đoạn = clamp( N7 × p × c × D × k , W_min , W_max )
k           = 0,85        // để đa số máy chủ xong trước hạn ~15%
W_min       = 2.000        // máy chủ rất nhỏ vẫn có cảm giác «cùng làm»
W_max       = 5.000.000    // trần kỹ thuật
```

Phân về từng sơn (EV-TMB, giai đoạn Hóa):

```
W_sơn = W_giai_đoạn × (1 + độ_hỏng(cung)) / Σ_các_sơn_hỏng (1 + độ_hỏng(cung))
```

Ví dụ năm 2027, `N7 = 6.000`, `D = 30`: `W = 6.000 × 0,35 × 25 × 30 × 0,85 ≈ 1.338.750` công cho giai đoạn Hóa; cung Tây (độ hỏng 6) có mỗi sơn ≈ `1.338.750 × 7 / (3×6 + 3×5 + 3×7 + 3×4)` = `1.338.750 × 7 / 66` ≈ 141.990 công. *(Mẫu số: Bắc 3 sơn × (1+5)=18; Đông Bắc 3 × (1+4)=15; Tây Nam 3 × (1+3)=12; Tây 3 × (1+6)=21; tổng 66.)*

### 8.6.3 Điều chỉnh giữa chừng

- Mỗi ngày giờ Tý, máy chủ ước lượng ngày hoàn thành theo tốc độ 3 ngày gần nhất.
- Nếu dự kiến **trễ** > 20% hạn: giảm phần còn lại 15% (tối đa 2 lần / giai đoạn) — thông báo «Thế giới cảm ơn những người đã góp sức; phần việc còn lại nhẹ đi.»
- Nếu dự kiến **sớm** > 40% hạn: **không** tăng mục tiêu (không phạt việc làm nhanh); mở sớm giai đoạn sau.

### 8.6.4 Trần cá nhân và «công nhóm»

| Trần | Giá trị |
|---|---|
| Công `EV-TMB` / người / ngày | 100 |
| Công `EV-CAU` / người / ngày | 120 |
| Thưởng nhóm (Phần 04 §4.5.4) | +10% công cho phần việc làm khi ≥ 2 người cùng nhóm đồng hành, tính trong trần |

Với trần 100/ngày, người chơi nhiều nhất góp ≈ `100 / 25` = 4 lần người chơi trung bình — đủ để người nhiệt tình thấy mình có ích, không đủ để một nhóm nhỏ «gánh» thay cả máy chủ.

### 8.6.5 Bảng dự kiến theo quy mô (giai đoạn Hóa 30 ngày)

| `N7` | `W` (công) | Ghi chú |
|---|---|---|
| 100 | 22.312 | máy chủ nhỏ; `W_min` không chạm |
| 1.000 | 223.125 | — |
| 10.000 | 2.231.250 | — |
| 30.000 | 5.000.000 (`W_max`) | tính ra 6,7 triệu → chạm trần; xong sớm hơn hạn |

*(`W_min` = 2.000 chỉ có tác dụng khi `N7` < 9 — tức máy chủ thử nghiệm hoặc bản chạy cục bộ `dev:mmo`.)*

---

## 8.7 Chống lạm dụng sự kiện

| Hành vi | Biện pháp |
|---|---|
| Bot vác đá | tốc độ tối thiểu mỗi chuyến; quãng đi bộ thật (chuỗi `mv` trên máy chủ, tốc độ ≤ 6 m/s, `a = 0`); trần ngày |
| Hai tài khoản một người khiêng phiến | hai người khiêng phải khác cụm thiết bị; cùng thiết bị → công × 0,5 |
| Đứng Tam Sát sai hướng nhưng sửa client báo hướng đúng | chấp nhận được (thiệt hại nhỏ); hướng `h` vẫn kiểm khớp với hướng đi gần nhất |
| Thắp đèn Thái Tuế liên tục để cày công | `lightLamp` đã giới hạn: mỗi năm một ngọn, mỗi ngày thêm dầu một lần → tối đa 1 công / ngày từ nguồn này |
| Phá tiến độ (làm ngược) | không có hành động nào làm giảm tiến độ chung |
| Spam vào phòng đại lễ | trần tốc độ như thường; vùng lễ không cho cử chỉ ngoài danh sách |

## 8.8 Checklist nghiệm thu Phần 08

- [ ] Độ hỏng 24 sơn sinh từ `annualTabooOverview` khớp bảng 2027/2028 ở §8.1.3 (test).
- [ ] Rẻ quạt Ngũ Hoàng, Tam Sát, Tuế Phá không có hành động «đào / động thổ».
- [ ] Mỗi rẻ quạt, trạm nghỉ là công trình đi vào được, có công năng (DoD Phần 01 §1.8.5).
- [ ] Đường không bao giờ bị chặn hoàn toàn (test A*: mọi vùng đến được khi mọi đoạn hư = 100).
- [ ] Công thức `W` và phân sơn đúng ví dụ §8.6.2; giảm giữa chừng tối đa 2 lần.
- [ ] Đại lễ: mọi phòng nhận `ev_phase` cùng `at`; đóng góp gửi bù idempotent.
- [ ] iOS: `EV-DL-03` dùng bản «Thắp Đèn Báo Hiếu», không dùng station `sen`.
- [ ] Bản đơn không có NPC giả làm người chơi.
- [ ] Công đức «Sửa cầu đường» ghi đúng trần 3 lần/tuần, chỉ cho người góp ≥ 10 công/đường/tuần.
