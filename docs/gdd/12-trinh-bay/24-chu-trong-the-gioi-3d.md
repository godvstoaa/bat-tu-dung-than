# 12 · Trình bày — Phần 24: Chữ trong thế giới 3D (biển, bia, bài vị, câu đối, bảng vàng)

> Nguyên tắc P4 «cảnh là giao diện» làm chữ trong cảnh trở thành một kênh thông tin chính: biển cổng đại vận khắc can chi của chính người chơi, bài vị Thái Tuế, bảng lịch ngày, bia Tiến sĩ khắc tên người đỗ. Phần này kiểm kê chữ 3D đang có, đặt luật đọc được, luật chữ Hán (chiều đọc, câu đối), chất liệu, và an toàn cho chữ do người chơi sinh ra.

---

## 1. Kiểm kê chữ 3D đang có

| Vật | Nguồn | Texture | Kích thước mặt | Chữ (phông, cỡ trên texture) | Phát sáng |
|---|---|---|---|---|---|
| Biển «玄館» cổng quán | `models.js` + `textures.js › signTex(han)` | canvas, chữ vàng `PAL.gold` | 2,4 × 0,9 m, cao 4,55 m | `bold 120px serif` | không (vật liệu PBR, roughness 0,35) |
| Bảng lịch ngày (Bảng Lịch) | `textures.js` (`cal.draw`) | 256 × ~300 | — | «Tháng {m} · {năm}» `bold 26px sans-serif`; ngày `bold 130px serif`; âm lịch `24px sans-serif`; can chi ngày `bold 40px serif` vàng | — |
| Vòng chữ Thiên Bàn | `textures.js › skyRingTex(items)` | vòng chữ quanh tâm | 3 vòng quay | `bold 64px serif` vàng | có (vòng quay, ăn mừng) |
| Biển can chi 9 cổng đại vận (Vận Mệnh Các) | `interior.js` (`canvasTex(256, 128)`) | 256 × 128 | 2,4 × 1,2 m, cao 4,62 m | can chi `bold 64px serif` `#f6d77a`; tuổi `22px sans-serif` `#f3e6c8`; khi chưa có bát tự: «？» + «nhập bát tự ở cổng» | `emissiveIntensity` 0,9 (cổng đang đi) / 0,3 / 0,12 (đã qua) |
| Bia Vận Mệnh | `interior.js` (`canvasTex(256, 512)`) | 256 × 512 | — | «運 命» `bold 44px serif`; các dòng `20px sans-serif` cách 40 px | — |
| Lưới 60 bài vị Thái Tuế | `interior.js` (atlas `COLS × CW`, `ROWS × CH`) | atlas | — | can chi `bold 26px serif`; tên tướng quân **dọc** `22px serif`, mỗi chữ cách 26 px (`TAISUI_60`) | — |
| Bài vị niên chủ Thái Tuế | `interior.js` (`canvasTex(256, 640)`) | 256 × 640 | thân bài vị 1,5 × 3,75 m | «{can chi}太歲» dọc `bold 54px serif` cách 62 px; «{tên}大將軍» dọc `bold 46px serif` cách 52 px; mực `#4a0e08` | `emissiveIntensity 0,4` |

Nhận xét kỹ thuật:

1. Mọi texture chữ dùng phông chung `serif` / `sans-serif` của hệ điều hành → chữ Hán vẽ bằng phông khác nhau trên Windows / Android / iOS, có máy vẽ kiểu Song thể giản lược. ★ Vẽ bằng phông đã nạp (`--ff-han`, `--ff-brush`, `--ff-ui` — phần 07 §1.2), gọi `await document.fonts.load('700 64px "Noto Serif TC"')` **trước** khi vẽ canvas; vẽ lại khi phông về muộn.
2. Chữ tiếng Việt nhỏ (22 px trên texture 256) đọc được khi đứng gần nhưng không đọc được từ xa (§2) → có nhãn HTML bổ trợ khi lại gần.

---

## 2. Luật đọc được

### 2.1 Cỡ chữ trên màn

Chiều cao chữ trên màn (px) ≈ `h_chữ(m) / (2 · d · tan(FOV/2)) × H_màn`. Với màn dọc 844 px cao, FOV 64° (`tan 32° ≈ 0,625`):

| Vật | Chữ cao (m) | Ở 6 m | Ở 10 m | Ở 15 m | Kết luận |
|---|---|---|---|---|---|
| biển cổng đại vận — can chi (64 / 128 × 1,2 m ≈ 0,6 m) | 0,6 | 67 px | 40 px | 27 px | đọc tốt |
| biển cổng đại vận — tuổi (22 / 128 × 1,2 ≈ 0,21 m) | 0,21 | 24 px | 14 px | 9 px | ≥ 10 m khó đọc → nhãn HTML khi < 6 m |
| bia Vận Mệnh — dòng 20 px trên 512 (≈ 0,08 m nếu bia 2 m) | 0,08 | 9 px | 5 px | — | **không đọc được trong cảnh** → nội dung đọc qua bảng UI-53 (đã có); chữ trên bia là trang trí |
| bài vị niên chủ — 54 px / 640 × 3,75 m ≈ 0,32 m | 0,32 | 36 px | 21 px | 14 px | đọc tốt khi trong điện (camera 8 m) |

**Luật:** chữ mang thông tin phải đạt **≥ 16 px** trên màn ở khoảng cách camera mặc định của nơi đó (phần 08 §2.1, §3.5). Không đạt → (a) phóng chữ, hoặc (b) coi là trang trí và đưa thông tin vào nhãn HTML / bảng.

### 2.2 Tương phản và ánh sáng

- Chữ vàng trên nền son / gỗ sẫm: dùng viền tối 2 px (stroke) quanh nét khi vẽ canvas — giữ đọc được khi bloom (`threshold 0,96`) làm lóa vùng sáng.
- Biển quan trọng có `emissiveIntensity` ≥ 0,25 để đọc được ban đêm (như biển cổng hiện có); không vượt 0,9 để khỏi bị bloom nhòe.
- Chế độ tương phản cao (UI-76): tăng `emissiveIntensity` biển thông tin +0,2.

### 2.3 Độ phân giải texture

| Loại | Texture tối thiểu | Ghi chú |
|---|---|---|
| biển lớn (> 2 m) | 512 px theo chiều dài | hiện có 256 cho biển cổng — ★ nâng lên 512 × 256 ở chất lượng Cao |
| bài vị, bia | 256 × 640 (đã có) | — |
| câu đối (§3.2) | 128 × 1024 mỗi vế | dài, hẹp |
| bảng vàng khoa cử | 1024 × 512 | nhiều tên |

Mip-map và lọc bất đẳng hướng (`anisotropy` = tối đa của máy, trần 8) cho mọi texture chữ — chữ nhìn xiên (biển trên cao) mới không nhòe.

---

## 3. Luật chữ Hán trong cảnh

### 3.1 Chiều đọc

| Loại | Chiều | Ví dụ |
|---|---|---|
| hoành phi / biển ngang cổ | **phải → trái** (lối cổ) | «館玄» đọc là «玄館» — ★ quyết định: biển trên công trình cổ **theo lối cổ phải → trái**; biển hiện có «玄 館» đang trái → phải: giữ cho Sơn Môn (quán là công trình mới trong truyện), áp lối cổ cho thánh địa có nguyên mẫu (vd «嗣漢天師府» Long Hổ đọc phải → trái như biển thật) |
| bài vị, câu đối, bia dọc | trên → dưới, cột phải trước | bài vị Thái Tuế (đã có, dọc) |
| chữ Quốc ngữ trên biển (nếu có) | trái → phải, ngang | biển phụ tiếng Việt ở chợ |
| nhãn HTML bổ trợ | luôn ngang, trái → phải, chữ Hán + Hán Việt | UI-12 |

### 3.2 Câu đối

- Hai vế dọc hai bên cửa; **vế trên (thượng liên) ở bên phải người đứng nhìn vào**, vế dưới bên trái; hoành phi ngang ở giữa trên.
- Số chữ hai vế bằng nhau; nội dung do tài liệu 07 / cố vấn chọn từ câu đối cổ không còn bảo hộ, hoặc sáng tác mới có duyệt.
- Câu đối Tết (phần 16 §22): giấy đỏ chữ đen / vàng, treo tạm theo mùa.
- Chạm vào câu đối khi đứng gần → popover UI-57 hiện Hán Việt và nghĩa từng vế.

### 3.3 Chữ trên tượng, nơi thờ

- Không vẽ chữ đè lên thân tượng; biển tên tượng đặt trên bàn thờ hoặc hoành phi.
- Không đặt chữ người chơi (tên, khung tên) **trong** điện thờ, trừ nơi canon cho phép (bài vị cầu an do người chơi đặt — nếu tài liệu 05 thêm — thì ở khu riêng, không trên bàn thờ chính).

---

## 4. Chất liệu chữ

| Chất liệu | Cách làm trong shader / texture | Dùng ở |
|---|---|---|
| khắc chìm trên đá | texture chữ làm **normal map** + tối màu đáy nét | bia, bia Tiến sĩ, mani thạch (Tạng — chờ tham vấn) |
| sơn son thếp vàng | nền `--hq-son` sẫm, chữ vàng kim loại (metalness 0,85 như `M.gold` của `interior.js`) | hoành phi, bài vị |
| đắp nổi | normal map ngược (nổi) + bóng | biển cổng tam quan |
| mực trên giấy | texture giấy + chữ mực, cong nhẹ theo gió | bảng vàng, câu đối Tết, giấy phù (ký tự hư cấu) |
| đèn lồng in chữ | chữ in lên vỏ đèn, phát sáng từ trong | phố Huyền Thành, lễ |
| gỗ khắc mộc | chữ chìm trên gỗ, màu gỗ đậm hơn | biển trạm, quầy chợ |
| ánh sáng (hư cấu) | chữ phát sáng trên trời | nghi thức (`fx.rite.ink`), Thiên Bàn |

---

## 5. Chữ do người chơi sinh ra

| Chỗ | Nội dung | Ai thấy | Lọc |
|---|---|---|---|
| biển cổng đại vận, bia Vận Mệnh | can chi, tuổi, mốc — từ lá số của **chính** người chơi | chỉ người chơi đó (cảnh điện là cục bộ) | — (dữ liệu engine) |
| bia Tiến sĩ (Văn Miếu) | tên người chơi đỗ đình thí | mọi người cùng máy chủ | `protocol.js › cleanName` (≤ 24 ký tự, bỏ ký tự điều khiển, chặn từ thô tục) + duyệt hàng đợi báo cáo |
| bảng vàng khoa cử | tên người đỗ kỳ | mọi người | như trên |
| đèn hoa đăng | điều ước / lời tưởng nhớ (UI-94) | **chỉ** người viết (đèn của người khác trôi trong hồ nhưng không hiện chữ) | lọc thô tục cục bộ |
| bài vị / đạo hiệu (UI-84) | đạo hiệu | mọi người (khung tên) | `cleanName` |
| khung tên người chơi | tên + danh hiệu | người trong 24 m | `cleanName` (đã có `renamed`) |

**Luật:** không có chữ tự do nào của người chơi hiện cho người khác ngoài **tên** đã qua bộ lọc (giữ chính sách không UGC tự do — phần 05 UI-60). Tên trên bia Tiến sĩ có thể bị gỡ khi báo cáo được xác nhận; bia hiện chỗ trống trang nhã, không chữ «bị xoá».

---

## 6. Bản địa hóa chữ 3D

| Loại chữ | Khi đổi sang tiếng Anh |
|---|---|
| chữ Hán trên biển, câu đối, bài vị | **giữ nguyên** (kiến trúc); nhãn HTML khi lại gần hiện «Hán · pinyin · nghĩa» (phần 13 §4.1) |
| chữ Quốc ngữ trên vật (bảng lịch «Tháng 5 · 2026», tuổi trên biển cổng, dòng trên bia Vận Mệnh) | vẽ lại texture bằng chuỗi `t()` |
| tên riêng người chơi | giữ nguyên |

Texture chữ được dựng lại khi đổi ngôn ngữ (phần 13 §2.2), ≤ 1 s, không tải lại cảnh.

---

## 7. Nghiệm thu chữ 3D

1. Mọi chữ mang thông tin đạt ≥ 16 px trên màn 390 × 844 ở khoảng cách camera mặc định (đo bằng ảnh chụp tự động `setView` + `snapshot`).
2. Chữ Hán vẽ bằng phông đã nạp trên cả ba hệ điều hành (so ảnh chụp: cùng dáng chữ).
3. Biển thánh địa có nguyên mẫu đọc phải → trái đúng như nguyên mẫu; câu đối vế trên bên phải.
4. Không chữ tự do của người chơi nào hiện cho người khác ngoài tên đã lọc.
5. Ban đêm, biển cổng đại vận và bài vị đọc được, không bị bloom làm nhòe.
