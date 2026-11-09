# 12 · Trình bày — Phần 10: Danh mục hiệu ứng âm thanh (SFX-*)

> Danh mục đầy đủ các tiếng trong game (≈ 400 mục, 15 nhóm). Mã `SFX-<NHÓM>-<số>`; biến thể ngẫu nhiên ghi số lượng ở cột «Bt» (vd 4 = bốn bản thu khác nhau, phát luân phiên không lặp liền). Tiếng hiện **đã có** dạng tổng hợp trong `audio.js` (gió, chuông, mõ, lắc ống xăm) được ghi rõ để thay bằng bản thu.
>
> Cột **Bus**: `UI` giao diện · `SFX` hiệu ứng trong cảnh · `AMB` môi trường · `VO` thoại · `MUS` nhạc (phần 11 §2 về trộn). Cột **Ưu** (ưu tiên khi vượt số tiếng tối đa): 1 cao nhất – 5 thấp nhất. Cột **Nguồn**: `Thu` (thu âm thật ngoài hiện trường / foley), `Mẫu` (thư viện mẫu do dự án tự thu, dùng chung với nhạc), `TH` (tổng hợp WebAudio thủ tục), `TV` (thư viện thương mại có giấy phép — phần 11 §6). Cột «3D»: tiếng có vị trí trong không gian (panner) hay không.

---

## 1. Giao diện — `SFX-UI-*`

Chất liệu chung: **gỗ, giấy dó, tre, đồng nhỏ** — không tiếng điện tử, không «bíp». Mọi tiếng UI ngắn (< 600 ms), không vị trí, bus `UI`.

| Mã | Tên | Mô tả chất liệu | Bt | Ưu | Nguồn | Dùng ở |
|---|---|---|---|---|---|---|
| `SFX-UI-001` | Bấm nút | đầu ngón gõ lên mặt bàn gỗ lim, khô | 4 | 3 | Thu | mọi nút thường |
| `SFX-UI-002` | Nút hành động hiện | mõ gỗ nhỏ gõ rất nhẹ, có vang ngắn | 2 | 4 | Mẫu | UI-10 |
| `SFX-UI-003` | Nút chính (son) | gõ gỗ + tiếng lụa nhẹ | 3 | 3 | Thu | `.hq-primary` |
| `SFX-UI-004` | Công tắc bật / tắt | then cài cửa gỗ nhỏ | 2 | 4 | Thu | checkbox, toggle |
| `SFX-UI-005` | Tiếp câu thoại | lật một tờ giấy dó mỏng | 4 | 4 | Thu | UI-40 |
| `SFX-UI-006` | Chọn lựa chọn | gõ hai đốt ngón lên bàn | 3 | 3 | Thu | UI-40, UI-41 |
| `SFX-UI-007` | Gõ chữ thoại | ngòi bút lông chạm giấy, cực nhỏ | 6 | 5 | Thu | chữ chạy UI-40 (mỗi 4 ký tự) |
| `SFX-UI-008` | Trạng thái AI | giở trang sách đóng chỉ, rất xa | 3 | 5 | Thu | UI-41 `onStatus` |
| `SFX-UI-009` | Đổi thẻ (tab) | thẻ tre trượt trên thẻ tre | 3 | 4 | Thu | `.hq-tab` |
| `SFX-UI-010` | Mở bảng | giở giấy dó khổ lớn | 3 | 3 | Thu | UI-15 |
| `SFX-UI-011` | Đóng bảng | gấp giấy, vuốt mép | 3 | 4 | Thu | UI-15 |
| `SFX-UI-012` | Lật thẻ tre | một thẻ tre lật trên mặt gỗ | 3 | 3 | Thu | 🎲 tên, chạm tâm Mệnh Bàn |
| `SFX-UI-013` | Mở sổ đóng chỉ | bìa sổ dày mở, gáy chỉ căng | 2 | 3 | Thu | Sổ Công Quá |
| `SFX-UI-014` | Trải cuộn bản đồ | cuộn giấy lăn mở trên bàn | 2 | 3 | Thu | UI-45 |
| `SFX-UI-015` | Phóng bản đồ | giấy cong nhẹ | 3 | 5 | Thu | UI-45 |
| `SFX-UI-016` | Đặt mốc (đóng dấu son) | con dấu đá ấn lên giấy, mực son | 2 | 3 | Thu | UI-45, UI-17 |
| `SFX-UI-017` | Vuốt bottom sheet | lụa trượt | 2 | 5 | Thu | UI-15 |
| `SFX-UI-018` | Cuộn danh sách tới cuối | gõ nhẹ khung gỗ | 1 | 5 | Thu | danh sách dài |
| `SFX-UI-019` | Mở popover thuật ngữ | giấy gấp đôi mở ra | 2 | 4 | Thu | UI-57 |
| `SFX-UI-020` | Lỗi nhập | gỗ trầm dày gõ một tiếng, tắt nhanh | 2 | 2 | Thu | UI-03 |
| `SFX-UI-021` | Xác nhận báo cáo / ẩn | gõ trầm hai tiếng thưa | 1 | 3 | Thu | UI-63 |
| `SFX-UI-022` | Hộp xác nhận hiện | khóa đồng nhỏ mở | 1 | 2 | Thu | hộp z 80 |
| `SFX-UI-023` | Xoá (đã xác nhận) | giấy xé chậm | 1 | 2 | Thu | xoá hồ sơ, xoá dữ liệu |
| `SFX-UI-024` | Không được phép / khóa | khóa đồng lạch cạch, không mở | 2 | 3 | Thu | S-LOCK |
| `SFX-UI-025` | Kéo thanh trượt | hạt tràng trượt trên dây (theo bước) | 4 | 5 | Thu | cài đặt |
| `SFX-UI-026` | Chạm giữ (bắt đầu) | hít nhẹ của gỗ khi ấn (rất nhỏ) | 1 | 5 | Thu | chạm giữ |
| `SFX-UI-027` | Toast tin (T1) | không tiếng | — | — | — | (cố ý im lặng) |
| `SFX-UI-028` | Mở menu tạm nghỉ | rèm tre kéo xuống | 1 | 3 | Thu | UI-18 |
| `SFX-UI-029` | Đóng menu tạm nghỉ | rèm tre cuộn lên | 1 | 4 | Thu | UI-18 |
| `SFX-UI-030` | Chạm Mệnh Bàn / Mệnh Đồ | chuông đồng nhỏ, **cao độ theo ngũ âm** (Cung / Thương / Giốc / Chủy / Vũ của âm cung D: D E F♯ A B) | 5 | 3 | Mẫu | UI-21, UI-27 |
| `SFX-UI-031` | Xác nhận nhẹ | khánh nhỏ ngân 0,8 s | 3 | 3 | Mẫu | dòng Dụng / Hỷ / Kỵ, AI xong |
| `SFX-UI-032` | Lấp lánh sao | ba chuông nhỏ lướt | 3 | 4 | Mẫu | chạm sao Đặc Tính |
| `SFX-UI-033` | Đĩa la bàn xoay | đĩa đồng xoay trên trục, có tiếng tích tắc mỗi 15° | 2 | 4 | Thu | Mệnh Bàn xoay, La Bàn Đài |
| `SFX-UI-034` | Mở Sổ Mệnh | bìa gỗ cuốn sổ mở | 2 | 3 | Thu | dock 📜 |
| `SFX-UI-035` | Mở Tàng Y Các | rèm lụa vén + móc áo gỗ | 2 | 3 | Thu | dock 👘 |
| `SFX-UI-036` | Mở Sổ Nhiệm Vụ | bó thẻ tre tháo dây | 2 | 3 | Thu | dock 📋 |
| `SFX-UI-037` | Mở Giao lưu | quạt giấy mở | 2 | 4 | Thu | dock 💬 |
| `SFX-UI-038` | Huy hiệu Neo hiện | mỏ neo đồng đặt xuống gỗ, khẽ | 1 | 4 | Thu | UI-41 |
| `SFX-UI-039` | Huy hiệu Neo đỏ | khánh đá gõ lệch (hơi chói nhưng ngắn) | 1 | 2 | Mẫu | UI-41 cờ đỏ |
| `SFX-UI-040` | Nhận Phúc Khí / Ngọc | đồng xu rơi vào đĩa sứ, một tiếng | 3 | 3 | Thu | toast T2 |
| `SFX-UI-041` | Nhận nhiều (≥ 50) | ba xu rơi nối nhau | 2 | 3 | Thu | toast T2 lớn |
| `SFX-UI-042` | Tiêu Phúc Khí / Ngọc | xu bỏ vào ống tre | 2 | 3 | Thu | mua |
| `SFX-UI-043` | Thư mới | phong thư giấy dó rơi trên bàn | 1 | 4 | Thu | UI-70 |
| `SFX-UI-044` | Lời mời đến | chuông gió hai tiếng | 1 | 2 | Mẫu | UI-64 |
| `SFX-UI-045` | Kết nối lại phòng | chuông nhỏ một tiếng xa | 1 | 5 | Mẫu | MMO online |
| `SFX-UI-046` | Mất kết nối | không tiếng | — | — | — | (cố ý im lặng) |
| `SFX-UI-047` | Quét chạm khi bảng tải | tiếng bút mài mực tròn (vòng lặp ngắn) | 1 | 5 | Thu | S-LOAD > 1,5 s |
| `SFX-UI-048` | Đếm số tăng | hạt tràng đếm lách tách theo số | 1 | 5 | Thu | HUD đếm Phúc Khí |
| `SFX-UI-049` | Mở khóa tính năng | khóa đồng mở + then cửa | 1 | 2 | Thu | S-LOCK → mở |
| `SFX-UI-050` | Chụp ảnh | phách gỗ gõ một tiếng sắc | 2 | 3 | Thu | UI-98 |

---

## 2. Tiến trình, nhiệm vụ, nghiệp — `SFX-PROG-*`, `SFX-QUEST-*`, `SFX-KARMA-*`

| Mã | Tên | Mô tả | Bt | Ưu | Nguồn | Dùng ở |
|---|---|---|---|---|---|---|
| `SFX-PROG-001` | Lên cấp | khánh đồng ngân + tiếng gió nhẹ thổi lên | 1 | 1 | Mẫu | toast T3 (thay `bell` hiện có) |
| `SFX-PROG-002` | Danh xưng mới | bút lông viết một nét dài + chuông nhỏ | 1 | 1 | Mẫu | toast T3 |
| `SFX-PROG-003` | Mở gia trì / tính năng lớn | ba chuông bậc lên (Giốc → Chủy → Vũ) | 1 | 1 | Mẫu | UI-33, toast |
| `SFX-PROG-004` | Xong 3 việc hôm nay | chuông 660 Hz nhẹ (thay `bell(660, 0.1)` đã có) | 1 | 2 | Mẫu | after() |
| `SFX-PROG-005` | Xong tầng Mệnh Đồ | khánh đá trầm, vang dài 3 s | 1 | 1 | Mẫu | UI-27 |
| `SFX-PROG-006` | Thành tựu 🏮 | đèn lồng treo lên — móc gỗ + lụa | 1 | 2 | Thu | toast T3 |
| `SFX-PROG-007` | Mốc Liễu Phàm | chuông đại một tiếng + gió | 1 | 1 | Mẫu | 300 / 600 / 1.000 công |
| `SFX-PROG-008` | Quà lên cấp | gói lụa mở | 1 | 3 | Thu | toast |
| `SFX-PROG-009` | Điểm danh chuỗi 7 | 7 chuông nhỏ lên dần | 1 | 2 | Mẫu | Tàng Y Các |
| `SFX-QUEST-001` | Nhận nhiệm vụ | thẻ tre cài vào bó | 2 | 2 | Thu | UI-43 |
| `SFX-QUEST-002` | Cập nhật bước | bút chấm một nét | 3 | 3 | Thu | UI-16 |
| `SFX-QUEST-003` | Xong nhiệm vụ | ấn son + chuông nhỏ | 2 | 2 | Thu+Mẫu | UI-16 |
| `SFX-QUEST-004` | Tới điểm đến | mõ gõ một tiếng ấm | 1 | 3 | Mẫu | khi bước vào vòng 3 m của mục tiêu |
| `SFX-QUEST-005` | Bỏ theo dõi | thẻ tre rút ra | 1 | 4 | Thu | UI-43 |
| `SFX-KARMA-001` | Lựa chọn dính nghiệp | chuông nhỏ trầm, một tiếng, vang ngắn — nhắc dừng, không dọa | 1 | 2 | Mẫu | UI-40 ⚠ |
| `SFX-KARMA-002` | Ghi cột 過 | bút chấm mực đen một nét ngắn | 1 | 3 | Thu | UI-29 |
| `SFX-KARMA-003` | Ghi cột 功 | bút chấm mực son | 2 | 3 | Thu | UI-29 |
| `SFX-KARMA-004` | Sửa sai xong | nước rửa nghiên | 1 | 2 | Thu | UI-31 |
| `SFX-KARMA-005` | Nhận Âm Bài | tiếng gỗ đen đặt xuống, trầm khô, không vang | 1 | 1 | Thu | Tà Lộ |
| `SFX-KARMA-006` | Nợ Âm tăng | giọt nước rơi vào chậu đồng tối | 1 | 2 | Thu | UI-37 |
| `SFX-KARMA-007` | Hồi Đầu | chuông chùa Việt một tiếng + gió mở | 1 | 1 | Mẫu | danh hiệu Hồi Đầu |

---

## 3. Bước chân và thân thể — `SFX-FOOT-*`, `SFX-BODY-*`

Nhân vật đi **giày vải đế mềm** (đạo phục); thanh âm nhỏ, ấm. Bước chân phát theo pha đi `poseAvatar(walk, phase)`; chọn bề mặt theo vật liệu dưới chân (lớp vật liệu của địa hình / sàn — tài liệu 13 thêm trường `surface`). Đi: −22 dB; chạy: −18 dB; đáp: −16 dB. Người chơi khác: chỉ khi < 12 m, −6 dB thêm. Bus `SFX`, 3D.

| Mã | Bề mặt | Đi (Bt) | Chạy (Bt) | Đáp sau bay / nhảy bậc (Bt) | Ở đâu |
|---|---|---|---|---|---|
| `SFX-FOOT-01x` | đá lát xanh (sân Sơn Môn, sân điện) | `-010` (8) | `-011` (8) | `-012` (3) | Sơn Môn, Huyền Thành, Long Hổ |
| `SFX-FOOT-02x` | gạch Bát Tràng / gạch vồ (sàn chùa Việt) | `-020` (8) | `-021` (6) | `-022` (3) | Bút Tháp, Yên Tử, Văn Miếu |
| `SFX-FOOT-03x` | sàn gỗ (lầu, các, nhà sàn) | `-030` (8) | `-031` (6) | `-032` (3) | Thư Lâu, Vận Mệnh Các, Miêu Cương |
| `SFX-FOOT-04x` | gỗ rỗng (cầu gỗ, cầu phong vũ) | `-040` (6) | `-041` (6) | `-042` (2) | cầu, bến |
| `SFX-FOOT-05x` | sỏi | `-050` (8) | `-051` (6) | `-052` (3) | lối vườn Phong Thủy Viên |
| `SFX-FOOT-06x` | đất nện | `-060` (8) | `-061` (6) | `-062` (3) | đường làng, ruộng |
| `SFX-FOOT-07x` | cỏ | `-070` (8) | `-071` (6) | `-072` (3) | đồi, bãi |
| `SFX-FOOT-08x` | lá khô | `-080` (8) | `-081` (6) | `-082` (3) | rừng tùng mùa thu, rừng Thư Lâu |
| `SFX-FOOT-09x` | bậc đá rêu ẩm | `-090` (8) | `-091` (6) | `-092` (3) | Yên Tử, Võ Đang thần đạo |
| `SFX-FOOT-10x` | tuyết | `-100` (8) | `-101` (6) | `-102` (3) | Chung Nam mùa đông, Tạng |
| `SFX-FOOT-11x` | băng / đá lạnh | `-110` (6) | `-111` (4) | `-112` (2) | đèo Tạng, Thiên Trì |
| `SFX-FOOT-12x` | nước nông (lội) | `-120` (6) | `-121` (6) | `-122` (3) | bờ hồ, suối |
| `SFX-FOOT-13x` | bùn ruộng | `-130` (6) | `-131` (4) | `-132` (2) | ruộng bậc thang Miêu Cương, đồng Bút Tháp |
| `SFX-FOOT-14x` | tre (sàn tre, cầu tre) | `-140` (6) | `-141` (6) | `-142` (2) | Mao Sơn, bè tre Long Hổ |
| `SFX-FOOT-15x` | cát | `-150` (6) | `-151` (6) | `-152` (2) | mạn-đà-la (bước quanh), bãi sông |
| `SFX-FOOT-16x` | thảm / nệm (trong điện Tạng, nhà) | `-160` (6) | `-161` (4) | `-162` (2) | Tạng, nhà riêng |
| `SFX-FOOT-17x` | đá đỏ đan hà (thô, vang) | `-170` (6) | `-171` (6) | `-172` (2) | Long Hổ |
| `SFX-FOOT-18x` | mây (Côn Lôn — bề mặt hư cấu) | `-180` (6) | `-181` (4) | `-182` (2) | Côn Lôn: tiếng bông, rất mềm, có ngân nhẹ |

| Mã | Thân thể | Mô tả | Bt | Ưu | Nguồn |
|---|---|---|---|---|---|
| `SFX-BODY-001` | Áo phất khi xoay người | vải lanh / lụa | 6 | 5 | Thu |
| `SFX-BODY-002` | Ngồi xuống bồ đoàn | vải + đệm cói | 3 | 3 | Thu |
| `SFX-BODY-003` | Đứng dậy | vải + hơi thở nhẹ | 3 | 4 | Thu |
| `SFX-BODY-004` | Cúi chào | áo rủ | 3 | 4 | Thu |
| `SFX-BODY-005` | Chắp tay | hai lòng bàn tay chạm | 3 | 4 | Thu |
| `SFX-BODY-006` | Vỗ tay | ba tiếng | 3 | 4 | Thu |
| `SFX-BODY-007` | Lạy (gối chạm đất) | gối chạm sàn gạch qua vải | 4 | 3 | Thu |
| `SFX-BODY-008` | Tay áo vén | lụa | 4 | 5 | Thu |
| `SFX-BODY-009` | Hít thở sâu | hít vào (nam / nữ) | 2 × 2 | 4 | Thu |
| `SFX-BODY-010` | Thở ra chậm | thở ra (nam / nữ) | 2 × 2 | 4 | Thu |
| `SFX-BODY-011` | Cầm chén trà | sứ chạm ngón | 3 | 4 | Thu |
| `SFX-BODY-012` | Nhấp trà | nhấp nhẹ (không húp to) | 3 | 4 | Thu |
| `SFX-BODY-013` | Phẩm phục mặc vào | lụa trùm + đai thắt | 2 | 3 | Thu |
| `SFX-BODY-014` | Quạt giấy phe phẩy (cầm tay) | — | 3 | 5 | Thu |
| `SFX-BODY-015` | Phất trần vung | lông đuôi ngựa | 3 | 5 | Thu |

---

## 4. Di chuyển đặc biệt, cửa, trạm — `SFX-FLY-*`, `SFX-DOOR-*`, `SFX-TRAV-*`

| Mã | Tên | Mô tả | Lặp | Bt | Ưu | Nguồn | 3D |
|---|---|---|---|---|---|---|---|
| `SFX-FLY-001` | Gió bay | nhiễu lọc, cắt tần theo tốc độ (mở rộng từ `audio.js › startWind`: nhiễu nâu, lọc thông thấp 500 Hz → 500–4.000 Hz theo tốc độ) | có | — | 2 | TH + Thu | không |
| `SFX-FLY-002` | Vút qua mây | «phù» dày | — | 3 | 3 | Thu | không |
| `SFX-FLY-003` | Hạ kiếm, đáp đất | gió tắt + chân chạm đất (bề mặt theo §3) | — | 2 | 2 | Thu | có |
| `SFX-FLY-004` | Cất cánh | gió hút lên + vải phần phật | — | 2 | 2 | Thu | có |
| `SFX-FLY-005` | Lên cao (▲ giữ) | gió cao dần | có | — | 4 | TH | không |
| `SFX-FLY-006` | Xuống thấp (▼ giữ) | gió trầm dần | có | — | 4 | TH | không |
| `SFX-FLY-010` | Ngự Kiếm | kiếm ngân rất khẽ, dao động chậm | có | — | 3 | Thu | có |
| `SFX-FLY-011` | Cân Đẩu Vân | phù phù mềm, như thổi bông | có | — | 3 | Thu | có |
| `SFX-FLY-012` | Hồ Lô Phi Hành | hồ lô gỗ lắc, nước trong hồ lô óc ách | có | — | 3 | Thu | có |
| `SFX-FLY-013` | Liên Hoa Đài | chuông nhỏ đều nhịp chậm | có | — | 3 | Mẫu | có |
| `SFX-FLY-014` | Tiên Hạc | cánh lớn vỗ chậm (mỗi 1,2 s), kêu hạc thưa | có | 2 | 3 | Thu | có |
| `SFX-DOOR-001` | Cửa gỗ nặng mở | cánh cửa điện gỗ lim, bản lề trục gỗ | — | 3 | 2 | Thu | có |
| `SFX-DOOR-002` | Cửa gỗ nặng đóng | — | — | 3 | 2 | Thu | có |
| `SFX-DOOR-003` | Cửa bức bàn (cửa xếp) | — | — | 3 | 3 | Thu | có |
| `SFX-DOOR-004` | Rèm tre | — | — | 3 | 4 | Thu | có |
| `SFX-DOOR-005` | Rèm vải (nhà Tạng, lều) | — | — | 2 | 4 | Thu | có |
| `SFX-DOOR-006` | Cổng gỗ lớn tam quan | kẽo kẹt dài | — | 2 | 2 | Thu | có |
| `SFX-DOOR-007` | Cửa đá (hang Phong Đô) | đá trượt đá | — | 2 | 2 | Thu | có |
| `SFX-DOOR-008` | Then cài | — | — | 3 | 4 | Thu | có |
| `SFX-TRAV-001` | Xe ngựa | vó ngựa trên đá + bánh gỗ, 1,5 s | — | 2 | 2 | Thu | không |
| `SFX-TRAV-002` | Đò sang | mái chèo khua + nước vỗ mạn | — | 2 | 2 | Thu | không |
| `SFX-TRAV-003` | Cưỡi hạc | cánh vỗ + gió | — | 2 | 2 | Thu | không |
| `SFX-TRAV-004` | Trạm mở lần đầu | chuông trạm (chuông ngựa) | — | 1 | 2 | Thu | có |
| `SFX-TRAV-005` | Gọi xe ở trạm | huýt + vó ngựa lại gần | — | 2 | 3 | Thu | có |

---

## 5. Chuông, khánh, mõ, trống, kèn — `SFX-BELL-*`

Thư viện mẫu **dùng chung với nhạc** (phần 09 §6.2). Mọi tiếng có đuôi ngân thật (không cắt), vị trí 3D khi phát từ vật trong cảnh; phát dạng 2D khi là tín hiệu (canh giờ).

| Mã | Tên | Mô tả | Bt | Ưu | Nguồn | Ghi chú |
|---|---|---|---|---|---|---|
| `SFX-BELL-001` | Chuông đồng lớn (đại hồng chung) | một tiếng, ngân 8–10 s | 3 | 1 | Thu | UI-05, mốc lớn |
| `SFX-BELL-002` | Khánh nhỏ cầm tay | ngân 2 s | 3 | 2 | Thu | hết nén hương, tĩnh tọa |
| `SFX-BELL-003` | Khánh nhỏ ngắn | 0,8 s (thay `bell(440, 0.1)` khi bật âm) | 3 | 3 | Thu | — |
| `SFX-BELL-004` | Chuông gió đồng | 3–5 nốt ngẫu nhiên | 6 | 4 | Thu | hiên nhà, Phong Thủy Viên |
| `SFX-BELL-005` | Chuông gió tre | gõ tre rỗng | 6 | 4 | Thu | Mao Sơn, Yên Tử |
| `SFX-BELL-006` | Chuông mái (linh đạc) đầu đao | lắc theo gió | 4 | 5 | Thu | mọi mái điện có đầu đao |
| `SFX-BELL-010` | Chuông gia trì (chùa Việt) | chuông bát nhỏ gõ | 4 | 2 | Thu | UI-92 mỗi lạy |
| `SFX-BELL-011a…g` | Bảy chuông sao | bảy nốt biên chung (ngũ cung lên quãng tám) | 7 | 2 | Thu | UI-93 |
| `SFX-BELL-012` | Biên chung bộ | gõ một chuỗi | 3 | 3 | Thu | Văn Miếu, Lịch Đường |
| `SFX-BELL-013` | Biên khánh (khánh đá bộ) | một tiếng / chuỗi | 5 | 3 | Thu | Lịch Đường, Tử Bình |
| `SFX-BELL-014` | Khánh đá lớn | trầm, ngân 4 s | 2 | 2 | Thu | Mệnh Đồ, Tử Bình |
| `SFX-BELL-015` | Chuông Đạo (帝鐘 đế chung — chuông cầm tay có cán) | lắc 3 tiếng | 3 | 3 | Thu | Long Hổ, Mao Sơn nghi lễ hư cấu |
| `SFX-BELL-020` | Kèn dài (dungchen) rất xa | một hồi 6 s (bản tạm — chờ tham vấn) | 2 | 3 | Thu | Tạng |
| `SFX-BELL-021` | Chuông bát (singing bowl) gõ | ngân 10 s | 4 | 2 | Thu | Tạng, mạn-đà-la |
| `SFX-BELL-022` | Chuông bát xoa vành | ngân liên tục (lặp) | 2 | 3 | Thu | Tạng, tĩnh tọa (tùy chọn) |
| `SFX-BELL-023` | Tù và (sừng trâu) | một hồi dài | 2 | 2 | Thu | Long Hổ sáng (§3.10 phần 09) |
| `SFX-BELL-024` | Ốc biển (pháp loa) | — | 2 | 3 | Thu | lễ Đạo |
| `SFX-BELL-030` | Chuông canh — chuông đại trầm | 1 tiếng (phát n lần theo canh) | 2 | 2 | Thu | phần 09 §4.3 |
| `SFX-BELL-031` | Chuông chùa Việt (chuông sớm / chiều) | một tiếng, ngân 6 s | 3 | 2 | Thu | Yên Tử, Bút Tháp |
| `SFX-BELL-032` | Chuông chiều hồi dài | chuỗi chuông thưa dần | 1 | 2 | Thu | Dậu |
| `SFX-BELL-040` | Mõ cầm canh (phố) | mõ tre lớn | 3 | 3 | Thu | Huyền Thành |
| `SFX-BELL-041` | Trống ngọ / trống báo | trống da lớn một tiếng | 3 | 2 | Thu | Ngọ, khoa cử |
| `SFX-BELL-042` | Trống đồng | mặt trống đồng gõ dùi (Miêu) | 4 | 3 | Thu | Miêu Cương |
| `SFX-BELL-043` | Trống cơm | — | 4 | 4 | Thu | Huyền Thành |
| `SFX-BELL-044` | Thanh la | — | 3 | 3 | Thu | Long Hổ, lễ |
| `SFX-BELL-045` | Chũm chọe | — | 3 | 3 | Thu | lễ Đạo |
| `SFX-BELL-046` | Mõ gỗ lớn (chùa) | (thay `knock(900)` hiện có) | 4 | 2 | Thu | sám hối, tụng |
| `SFX-BELL-047` | Mõ cá (trong điện Đạo) | — | 4 | 3 | Thu | Chung Nam |
| `SFX-BELL-048` | Mõ trúc (竹梆) | — | 4 | 4 | Thu | Mao Sơn |
| `SFX-BELL-049` | Phách | — | 4 | 4 | Thu | Văn Miếu, chợ |

---

## 6. Nghi thức và đồ thờ — `SFX-RITE-*`

| Mã | Tên | Mô tả | Bt | Ưu | Nguồn | Dùng ở |
|---|---|---|---|---|---|---|
| `SFX-RITE-001` | Gõ bút lên nghiên | cán bút trúc chạm nghiên đá | 2 | 2 | Thu | gửi mẫu bát tự |
| `SFX-RITE-002` | Mài mực | thỏi mực mài trên nghiên ướt (vòng lặp 2 s) | 2 | 3 | Thu | lễ nhập môn |
| `SFX-RITE-003a…d` | Lật thẻ trụ | bốn thẻ tre lật, cao độ tăng nửa cung mỗi thẻ | 4 | 2 | Thu | UI-04, UI-50 |
| `SFX-RITE-004` | Gió lùa qua giấy | — | 2 | 4 | Thu | thanh ngũ hành hiện |
| `SFX-RITE-005` | Nét bút lông dài | bút lông kéo trên giấy dó | 4 | 2 | Thu | vòng Tiềm Lực, chữ cảnh giới |
| `SFX-RITE-006` | Nét bút ngắn | chấm | 6 | 4 | Thu | — |
| `SFX-RITE-007` | Thổi khô mực | — | 2 | 5 | Thu | — |
| `SFX-RITE-010` | Bút lông chấm (sổ) | — | 4 | 3 | Thu | dòng Sổ Công Quá |
| `SFX-RITE-011` | Giấy vàng (phù) trải | giấy bản dày | 2 | 3 | Thu | kết phù |
| `SFX-RITE-012` | Gấp phù | — | 2 | 4 | Thu | — |
| `SFX-RITE-020` | Ngân đột phá | khánh + chuông bát chồng, ngân 6 s | 1 | 1 | Mẫu | UI-33 |
| `SFX-RITE-021` | Gia trì nổi lên | lớp ngân + gió xoáy | 1 | 1 | Mẫu | UI-33 |
| `SFX-RITE-030` | Quẹt diêm / châm lửa | que đóm chạm lửa | 4 | 3 | Thu | thắp đèn, nhang |
| `SFX-RITE-031` | Rót dầu đèn | dầu chảy vào đĩa đèn | 2 | 3 | Thu | đèn Thái Tuế |
| `SFX-RITE-032` | Nhang cháy | tí tách rất khẽ (lặp) | 1 | 5 | Thu | Lư Hương |
| `SFX-RITE-033` | Tàn nhang rơi | — | 3 | 5 | Thu | Lư Hương |
| `SFX-RITE-034` | Cắm nhang vào lư | chân nhang cắm cát tro | 3 | 3 | Thu | Lư Hương |
| `SFX-RITE-035` | Nến cháy | lửa nến (lặp, rất khẽ) | 1 | 5 | Thu | trong điện |
| `SFX-RITE-036` | Thổi tắt nến | — | 2 | 4 | Thu | — |
| `SFX-RITE-037` | Đèn dầu bùng | lửa lớn lên | 2 | 3 | Thu | đèn Thái Tuế thắp lần đầu |
| `SFX-RITE-038` | Đèn lồng lắc | khung tre + giấy | 3 | 5 | Thu | đèn lồng treo, cầm tay |
| `SFX-RITE-040` | Mõ tụng | (dùng `SFX-BELL-046`, nhịp UI-92) | — | 2 | Thu | sám hối |
| `SFX-RITE-041` | Đặt lễ vật lên bàn thờ | đĩa sứ chạm gỗ | 3 | 4 | Thu | dâng lễ |
| `SFX-RITE-042` | Rót nước cúng | — | 2 | 4 | Thu | — |
| `SFX-RITE-043` | Rót rượu cúng | — | 2 | 4 | Thu | lễ Đạo |
| `SFX-RITE-044` | Hóa vàng / đốt giấy | giấy cháy bùng nhẹ (giấy hư cấu) | 2 | 4 | Thu | lễ Vu Lan |
| `SFX-RITE-045` | Rắc nước sạch (cành lá) | — | 3 | 4 | Thu | cứu người bước ③ |
| `SFX-RITE-046` | Gieo keo âm dương | hai mảnh gỗ rơi gạch (thay phần keo trong `rattle`) | 4 | 3 | Thu | Ống Xăm |
| `SFX-RITE-047` | Xin keo — thánh keo | hai mảnh rơi nảy khác nhau | 2 | 3 | Thu | Ống Xăm |
| `SFX-RITE-048` | Phướn bay | vải dài trong gió | 3 | 5 | Thu | trong điện |
| `SFX-RITE-049` | Tràng hạt lần | hạt gỗ đếm | 4 | 4 | Thu | Tịnh Độ |
| `SFX-RITE-050` | Bánh xe kinh quay | (xem `SFX-MG-080`) | — | — | — | — |
| `SFX-RITE-051` | Ấn thụ lục | ấn gỗ lớn + tiếng tụng ngân (không lời) | 1 | 1 | Thu+Mẫu | Long Hổ thụ lục |
| `SFX-RITE-052` | Kiệu rước | đòn kiệu kẽo kẹt + bước nhiều người | 1 | 3 | Thu | lễ hội |
| `SFX-RITE-053` | Pháo lễ (xa) | tràng pháo xa, giảm nhọn | 2 | 3 | TV | Tết (tùy chọn tắt) |
| `SFX-RITE-054` | Hoa đăng đặt xuống nước | giấy chạm nước | 3 | 3 | Thu | Hồ Sen |
| `SFX-RITE-055` | Thả chim | cánh nhỏ vỗ bay lên | 3 | 3 | Thu | phóng sinh |
| `SFX-RITE-056` | Thả cá | cá quẫy, nước tóe nhẹ | 3 | 3 | Thu | phóng sinh |

---

## 7. Nước — `SFX-WATER-*`

| Mã | Tên | Lặp | Bt | Ưu | Nguồn | 3D | Ở |
|---|---|---|---|---|---|---|---|
| `SFX-WATER-001` | Suối nhỏ | có | 3 | 4 | Thu | có | núi |
| `SFX-WATER-002` | Suối đá lớn | có | 2 | 4 | Thu | có | Võ Đang, Miêu Cương |
| `SFX-WATER-003` | Thác xa | có | 2 | 3 | Thu | có | Côn Lôn, Võ Đang |
| `SFX-WATER-004` | Thác gần | có | 2 | 3 | Thu | có | Côn Lôn |
| `SFX-WATER-005` | Sông chảy chậm (Huyền Hà) | có | 2 | 4 | Thu | có | `RIVER` |
| `SFX-WATER-006` | Sóng hồ vỗ bờ | có | 3 | 4 | Thu | có | Cùng Thông, Hồ Sen |
| `SFX-WATER-007` | Nước vỗ mạn thuyền | có | 2 | 4 | Thu | có | bến đò |
| `SFX-WATER-008` | Mái chèo khua | — | 6 | 3 | Thu | có | đò |
| `SFX-WATER-009` | Giọt nước hang | — | 10 | 4 | Thu | có | Phong Đô |
| `SFX-WATER-010` | Giọt lậu khắc | — | 3 | 4 | Thu | có | Lịch Đường (nhịp nhạc) |
| `SFX-WATER-011` | Giếng — gàu thả | — | 2 | 4 | Thu | có | làng Bút Tháp |
| `SFX-WATER-012` | Cá đớp mặt hồ | — | 6 | 5 | Thu | có | Hồ Sen |
| `SFX-WATER-013` | Ếch nhảy xuống nước | — | 4 | 5 | Thu | có | đồng |
| `SFX-WATER-014` | Nước suối vườn (ống tre) | có | 2 | 4 | Thu | có | Phong Thủy Viên |
| `SFX-WATER-015` | Ấm trà sôi | có | 2 | 4 | Thu | có | Trà Thất, Am Vân Cốc |
| `SFX-WATER-016` | Rót trà vào chén | — | 4 | 3 | Thu | có | (= `SFX-MG-070`) |
| `SFX-WATER-017` | Nồi thuốc sôi lục bục | có | 2 | 4 | Thu | có | (= `SFX-MG-060`) |
| `SFX-WATER-018` | Hồ băng nứt khẽ | — | 4 | 5 | Thu | có | Thiên Trì, Tạng |
| `SFX-WATER-019` | Nước rút trong bồn đá | — | 2 | 5 | Thu | có | — |
| `SFX-WATER-020` | Nhảy xuống nước (rơi khi bay thấp) | — | 2 | 3 | Thu | có | — |

### 7.1 Mưa — `SFX-RAIN-*` (lớp theo bề mặt quanh người chơi)

| Mã | Mưa trên | Lặp | Bt | Nguồn |
|---|---|---|---|---|
| `SFX-RAIN-001` | mái ngói âm dương | có | 2 | Thu |
| `SFX-RAIN-002` | mái tranh (Am Vân Cốc) | có | 2 | Thu |
| `SFX-RAIN-003` | lá rừng | có | 2 | Thu |
| `SFX-RAIN-004` | lá sen, mặt hồ | có | 2 | Thu |
| `SFX-RAIN-005` | sân đá | có | 2 | Thu |
| `SFX-RAIN-006` | ô giấy dầu (khi mặc `o_giay`) | có | 1 | Thu |
| `SFX-RAIN-007` | rừng trúc | có | 2 | Thu |
| `SFX-RAIN-008` | máng xối nhỏ giọt (trong hiên) | có | 2 | Thu |
| `SFX-RAIN-009` | mưa phùn (rất mỏng) | có | 1 | Thu |
| `SFX-RAIN-010` | mưa rào bắt đầu / tạnh (chuyển) | — | 2 | Thu |

---

## 8. Gió, thời tiết — `SFX-WIND-*`, `SFX-WX-*`

| Mã | Tên | Lặp | Bt | Ưu | Nguồn | Ở |
|---|---|---|---|---|---|---|
| `SFX-WIND-001` | Gió nền đồng bằng | có | 2 | 5 | Thu (thay `startWind` tổng hợp) | mặc định |
| `SFX-WIND-002` | Gió đỉnh núi | có | 2 | 4 | Thu | Tử Bình, Trích Thiên, Võ Đang Kim Điện |
| `SFX-WIND-003` | Gió rừng tùng (thông reo) | có | 2 | 4 | Thu | Yên Tử |
| `SFX-WIND-004` | Gió rừng trúc (trúc va kẽo kẹt) | có | 2 | 4 | Thu | Mao Sơn |
| `SFX-WIND-005` | Gió đèo tuyết | có | 2 | 4 | Thu | Tạng, Chung Nam đông |
| `SFX-WIND-006` | Gió hang | có | 2 | 4 | Thu | Phong Đô, hang Miêu |
| `SFX-WIND-007` | Gió biển mây (cao, trong) | có | 1 | 4 | Thu+TH | Côn Lôn, bay cao |
| `SFX-WIND-008` | Gió qua hiên / khe cửa | có | 2 | 5 | Thu | trong điện |
| `SFX-WIND-009` | Cờ lungta phần phật | có | 3 | 4 | Thu | đèo Tạng |
| `SFX-WIND-010` | Cờ phướn / cờ lễ | có | 2 | 5 | Thu | quán, đạo tràng |
| `SFX-WIND-011` | Lá đào rơi | có | 1 | 5 | Thu | mùa xuân (`peachBloom`) |
| `SFX-WIND-012` | Cơn gió mạnh đi qua | — | 4 | 3 | Thu | ngẫu nhiên |
| `SFX-WX-001` | Sấm xa | — | 4 | 3 | Thu | mưa giông |
| `SFX-WX-002` | Sấm gần (chói, có cài đặt giảm) | — | 3 | 2 | Thu | giông (giảm 6 dB khi chế độ đêm khuya) |
| `SFX-WX-003` | Tuyết rơi trên áo / mái (rất khẽ) | có | 1 | 5 | Thu | tuyết |
| `SFX-WX-004` | Sương (không khí ẩm — lớp tần thấp) | có | 1 | 5 | TH | sương |
| `SFX-WX-005` | Côn trùng đêm hè | có | 3 | 5 | Thu | đêm |
| `SFX-WX-006` | Ve sầu trưa hè | có | 2 | 5 | Thu | ngày hè |
| `SFX-WX-007` | Băng tan nhỏ giọt (xuân Tạng) | có | 1 | 5 | Thu | — |

---

## 9. Môi trường theo vùng — `SFX-AMB-*`

### 9.1 Lớp nền vùng (bed) — lặp, 2D (stereo rộng), bus `AMB`

Mỗi vùng hai lớp nền: **ngày** (Mão → Dậu) và **đêm** (Tuất → Dần). Đan chéo 20 s quanh 06:00 và 18:30 (khớp ánh sáng).

| Mã ngày / đêm | Vùng | Ngày | Đêm |
|---|---|---|---|
| `-001 / -002` | Sơn Môn | chim sẻ sân, lá đa xào xạc, tiếng quét sân xa | dế, ếch hồ sen, gió nhẹ |
| `-003 / -004` | Huyền Thành | chợ (walla tiếng Việt mờ, không câu rõ), gánh hàng kẽo kẹt, gà | phố khuya: chó sủa xa, mõ cầm canh |
| `-005 / -006` | Tử Bình Phong | gió đỉnh, chim ưng xa | gió đỉnh, cú |
| `-007 / -008` | Manh Phái Cốc | suối cốc, chim cốc, vang thung lũng | suối, ếch núi |
| `-009 / -010` | Trích Thiên Đỉnh | gió cao, chuông mái | gió, dế núi, rất thưa |
| `-011 / -012` | Cùng Thông Hồ | sóng hồ, vịt trời, mái chèo xa | sóng, ếch, cá đớp |
| `-013 / -014` | Thư Lâu Lâm | chim rừng, lá, gió nhẹ | côn trùng rừng, cú |
| `-015 / -016` | Phong Thủy Viên | suối vườn ống tre, chuông gió, ong | suối, dế |
| `-017 / -018` | Lịch Đường | gió cao nguyên, giọt lậu khắc xa | gió, côn trùng |
| `-019 / -020` | Long Hổ | sông Lô Khê, bè tre, chim, gió vách đỏ | sông, côn trùng, cú |
| `-021 / -022` | Võ Đang | gió vách, tùng bách, chim núi, vượn xa (rất thưa) | gió vách, côn trùng núi |
| `-023 / -024` | Chung Nam | thung lũng, quạ, suối (mùa đông: tuyết) | gió, cú |
| `-025 / -026` | Mao Sơn | rừng trúc, chim, đồi chè (người hái chè xa) | trúc kẽo kẹt, ếch đầm sen |
| `-027 / -028` | Yên Tử | thông reo, chim, suối, tiếng người hành hương xa | gió tùng, côn trùng, chuông xa |
| `-029 / -030` | Bút Tháp | đồng lúa gió, trâu, trẻ con chơi xa, chim sẻ | ếch đồng, dế, gió đồng |
| `-031 / -032` | Tạng Địa | gió đèo, yak (chuông cổ yak), cờ gió | gió đèo, rất lạnh (tần cao ít) |
| `-033 / -034` | Văn Miếu | chim trên cây muỗm, tiếng đọc bài xa không rõ chữ, quạt | dế, gió lá đa |
| `-035 / -036` | Phong Đô | sông, gió hang, quạ xa | giọt nước, gió hang |
| `-037 / -038` | Miêu Cương | sông xanh, chim, gà trại, trẻ con, cối giã | suối, côn trùng, lửa bếp, chó |
| `-039 / -040` | Côn Lôn | thác xuống biển mây, hạc, gió trong | thác, gió, chuông xa |
| `-041 / -042` | Am Vân Cốc | gió vách, chim, ấm trà | mưa mái tranh (khi mưa), dế |

### 9.2 Nguồn điểm (point source) — 3D, phát ngẫu nhiên theo khoảng

| Mã | Tên | Khoảng phát | Ở |
|---|---|---|---|
| `SFX-AMB-031` | Chuông gió reo | 6–20 s khi có gió | hiên nhà, cổng (dùng `SFX-BELL-004`) |
| `SFX-AMB-043` | Gà gáy | sáng 05:00–07:00, 30–90 s | làng, phố |
| `SFX-AMB-044` | Chó sủa xa | 40–120 s, đêm | phố, trại |
| `SFX-AMB-045` | Quạ | 30–90 s | Phong Đô, Chung Nam |
| `SFX-AMB-046` | Hạc kêu | 40–120 s | Côn Lôn, Sơn Môn khi `crane` (≥ 500 Phúc Khí) |
| `SFX-AMB-047` | Cú | 40–120 s, đêm | rừng |
| `SFX-AMB-048` | Vượn hú xa | 3–6 phút | Võ Đang (rất thưa) |
| `SFX-AMB-049` | Ong vo ve | khi gần hoa | vườn |
| `SFX-AMB-050` | Trong điện (tone phòng) | lặp | mọi điện thờ: không khí tĩnh, vang dài, nến |
| `SFX-AMB-051` | Lửa bếp trại | lặp | Miêu Cương |
| `SFX-AMB-052` | Cối giã gạo | 10–30 s | Miêu Cương, Bút Tháp |
| `SFX-AMB-053` | Trâu kêu, bò yak | 40–120 s | Bút Tháp / Tạng |
| `SFX-AMB-054` | Cờ trên cột | lặp | quán, đạo tràng |
| `SFX-AMB-055` | Quét sân (chổi tre) | 20–60 s | Sơn Môn sáng |
| `SFX-AMB-056` | Gánh hàng kẽo kẹt đi qua | 30–90 s | Huyền Thành |
| `SFX-AMB-057` | Bánh xe nước (cọn nước) | lặp | ruộng Miêu Cương |
| `SFX-AMB-058` | Đá khắc chú (mani) gõ đục | 30–90 s | đèo Tạng (âm thanh đục đá, không chữ) |
| `SFX-AMB-059` | Trẻ con chơi đùa xa | 60–180 s | làng |
| `SFX-AMB-060` | Đạo chúng quét lá | 30–90 s | Chung Nam |

---

## 10. Đám đông và NPC — `SFX-CROWD-*`

Walla (tiếng người nói mờ không rõ chữ) thu bằng người nói **tiếng Việt** (Huyền Thành, Bút Tháp, Yên Tử, Văn Miếu), giọng các vùng khác thu với người bản ngữ khi có cố vấn — trước đó dùng walla trung tính đã lọc mờ.

| Mã | Tên | Lặp | Bt | Nguồn | Ở |
|---|---|---|---|---|---|
| `SFX-CROWD-001` | Chợ đông | có | 3 | Thu | Huyền Thành ngày |
| `SFX-CROWD-002` | Chợ thưa | có | 2 | Thu | sáng sớm, chiều |
| `SFX-CROWD-003` | Rao hàng xa (không rõ chữ) | — | 6 | Thu | chợ |
| `SFX-CROWD-004` | Sĩ tử đọc bài đồng thanh (mờ) | có | 2 | Thu | Văn Miếu sáng |
| `SFX-CROWD-005` | Đám người hành hương leo núi | có | 2 | Thu | Yên Tử |
| `SFX-CROWD-006` | Lễ hội đông (cười, nói, trống xa) | có | 2 | Thu | lễ tiết |
| `SFX-CROWD-007` | Người trong điện thì thầm | có | 2 | Thu | điện đông người |
| `SFX-CROWD-008` | Trẻ con cười | — | 4 | Thu | làng |
| `SFX-CROWD-009` | Ho khẽ, hắng giọng | — | 6 | Thu | NPC đứng chờ |
| `SFX-CROWD-010` | Khách NPC thở dài (án khách) | — | 4 | Thu | khách giải án |
| `SFX-CROWD-011` | NPC gật gù «ừm» | — | 6 | Thu | phản hồi giải án |
| `SFX-CROWD-012` | NPC cảm ơn (không lời — tiếng cười nhẹ) | — | 4 | Thu | xong án |
| `SFX-CROWD-013` | Thầy Tử Bình viết (bút lông, giấy) | có | 2 | Thu | bàn thầy (khớp hoạt ảnh `masterChar.seat('write')`) |
| `SFX-CROWD-014` | Bà Tư thợ may (kéo cắt vải) | — | 4 | Thu | Tàng Y Các |
| `SFX-CROWD-015` | Đạo sĩ tụng ngân xa (không lời) | có | 2 | Thu | quán Đạo |
| `SFX-CROWD-016` | Ni chúng ngân xa (không lời) | có | 2 | Thu | Bút Tháp |
| `SFX-CROWD-017` | Người chơi khác ngồi xuống cạnh | — | 3 | Thu | Trà Thất MMO |
| `SFX-CROWD-018` | Bước nhiều người đi qua | có | 2 | Thu | phố |
| `SFX-CROWD-019` | Quầy «đổi mệnh» rao mời (Định Mệnh Hội — giọng ngọt, không rõ chữ) | — | 3 | Thu | chợ |
| `SFX-CROWD-020` | Đám đông im lặng dần (khi lễ bắt đầu) | — | 1 | Thu | lễ |

---

## 11. Mini-game — `SFX-MG-*`

| Mã | Tên | Mô tả | Bt | Ưu | Nguồn | Mini-game |
|---|---|---|---|---|---|---|
| `SFX-MG-001` | Tạp niệm tan | gió nhẹ thổi qua chữ | 3 | 4 | Thu | UI-81 |
| `SFX-MG-002` | Hít vào (nhạc đệm) | (lớp nhạc `BGM-MG-TINHTOA`) | — | — | — | UI-81 |
| `SFX-MG-003` | Định Lực ổn định | ngân khánh rất nhỏ | 1 | 5 | Mẫu | UI-81 |
| `SFX-MG-010` | Đặt ký tự phù | bút lông chấm mực son | 4 | 3 | Thu | UI-82 |
| `SFX-MG-011` | Đóng ấn | ấn gỗ đóng xuống giấy | 2 | 2 | Thu | UI-82 |
| `SFX-MG-012` | Gỡ ký tự | giấy cạo nhẹ | 2 | 4 | Thu | UI-82 |
| `SFX-MG-013` | Phù đúng cấu trúc | giấy phát sáng — ngân khánh + gió | 1 | 2 | Mẫu | UI-82 |
| `SFX-MG-020` | Gieo ba xu | ba xu đồng chạm bát sứ | 6 | 3 | Thu | UI-55 Lục Hào |
| `SFX-MG-021` | Lắc ống xăm | thẻ tre xóc trong ống (thay `rattle()` tổng hợp) | 6 | 3 | Thu | Ống Xăm |
| `SFX-MG-022` | Thẻ xăm rơi | một thẻ rơi xuống gạch | 3 | 2 | Thu | Ống Xăm |
| `SFX-MG-023` | Mai Hoa — tính số | hạt bàn tính gỗ gảy | 4 | 4 | Thu | UI-55 |
| `SFX-MG-024` | Tiểu Lục Nhâm — đếm đốt tay | ngón chạm đốt (rất nhỏ) | 6 | 5 | Thu | UI-55 |
| `SFX-MG-030` | Gác bút nộp bài | bút đặt lên giá bút sứ | 2 | 3 | Thu | UI-83 |
| `SFX-MG-031` | Trống báo kết quả | trống da một tiếng | 1 | 2 | Thu | UI-83 |
| `SFX-MG-032` | Dán bảng vàng | giấy dán + quét hồ | 1 | 3 | Thu | UI-83 |
| `SFX-MG-033` | Khắc tên bia Tiến sĩ | đục đá | 2 | 2 | Thu | Văn Miếu (canon §7.8) |
| `SFX-MG-034` | Chọn chữ đặt tên | thẻ chữ gỗ đặt vào khay | 4 | 4 | Thu | UI-84 |
| `SFX-MG-040` | Đặt đồ nội thất | gỗ đặt sàn gạch | 4 | 3 | Thu | UI-85 |
| `SFX-MG-041` | Treo chuông gió | (dùng `SFX-BELL-004`) | — | — | — | UI-85 |
| `SFX-MG-042` | Xoay đồ | gỗ kéo trên gạch ngắn | 3 | 4 | Thu | UI-85 |
| `SFX-MG-043` | Cung cát (đặt đúng) | chuông nhỏ trong | 2 | 3 | Mẫu | UI-85 |
| `SFX-MG-044` | Cung cần hóa | gõ trầm | 2 | 3 | Thu | UI-85 |
| `SFX-MG-045` | Chọn ngày | lật tờ lịch | 4 | 4 | Thu | UI-86 |
| `SFX-MG-046` | Trình công án | mõ một tiếng | 1 | 3 | Mẫu | UI-87 |
| `SFX-MG-050` | Cát rơi (chak-pur) | ống đồng cọ vạch, cát chảy (lặp, cao độ theo tốc độ) | 2 | 3 | Thu | UI-88 |
| `SFX-MG-051` | Quét cát | chổi lông quét vào giữa | 1 | 2 | Thu | UI-88 |
| `SFX-MG-052` | Rót cát xuống suối | cát vào nước | 1 | 2 | Thu | UI-88 |
| `SFX-MG-053` | Gạch chân lời phán | bút gạch giấy | 3 | 4 | Thu | UI-89 |
| `SFX-MG-054` | Ghép bằng chứng | kẹp gỗ kẹp giấy | 3 | 3 | Thu | UI-89 |
| `SFX-MG-055` | Hỏi chuyện đời thường (ghi chép) | bút chì than | 4 | 4 | Thu | UI-90 |
| `SFX-MG-060` | Nồi thuốc sôi | lục bục (lặp) | 2 | 4 | Thu | UI-91 |
| `SFX-MG-061` | Hái thảo dược | cành lá bẻ + túi vải | 6 | 3 | Thu | UI-91 |
| `SFX-MG-062` | Bỏ vị vào nồi | lá khô rơi vào nước | 4 | 4 | Thu | UI-91 |
| `SFX-MG-063` | Quạt lửa lò đất | quạt nan | 3 | 4 | Thu | UI-91 |
| `SFX-MG-064` | Chắt thuốc ra bát | — | 2 | 3 | Thu | UI-91 |
| `SFX-MG-070` | Rót trà | trà vào chén sứ | 4 | 3 | Thu | Trà Thất |
| `SFX-MG-071` | Chén chạm khay | sứ chạm gỗ | 4 | 4 | Thu | Trà Thất |
| `SFX-MG-072` | Tráng ấm | nước nóng xối ấm đất | 2 | 4 | Thu | Trà Thất |
| `SFX-MG-080` | Bánh xe kinh quay | gỗ – đồng quay, chuông nhỏ đỉnh trục mỗi vòng | 3 | 3 | Thu | UI-96 |
| `SFX-MG-081` | Đóng dấu hành hương | ấn son trên sổ | 3 | 3 | Thu | UI-96 |
| `SFX-MG-082` | Leo bậc thở dốc nhẹ | hơi thở (nam / nữ) theo Nguyên Khí thấp | 2 × 2 | 4 | Thu | UI-96 |
| `SFX-MG-083` | Đặt mani thạch | đá đặt lên đống đá | 3 | 3 | Thu | Tạng đèo |
| `SFX-MG-090` | Kết quả «Thấu» | chuông trong 2 nốt lên | 1 | 2 | Mẫu | UI-80 |
| `SFX-MG-091` | Kết quả «Gần thấu» | chuông 1 nốt | 1 | 2 | Mẫu | UI-80 |
| `SFX-MG-092` | Kết quả «Chưa thấu» | chuông 1 nốt treo (chưa về chủ âm) — không phải âm thua | 1 | 2 | Mẫu | UI-80 |
| `SFX-MG-093` | Nén hương gần hết | tàn nhang rơi (to hơn bình thường) | 1 | 3 | Thu | đồng hồ nén hương UI-80 |

---

## 12. Tàng Y Các và hiệu ứng trang phục — `SFX-SHOP-*`, `SFX-COS-*`

| Mã | Tên | Mô tả | Lặp | Bt | Nguồn |
|---|---|---|---|---|---|
| `SFX-SHOP-001` | Điểm danh | chuông gió + đồng xu | — | 1 | Thu |
| `SFX-SHOP-002` | Thỉnh món | gói lụa, buộc dây | — | 2 | Thu |
| `SFX-SHOP-003` | Mặc món (biến thể ô `-h` mũ, `-b` lưng, `-n` tay, `-a` hào quang, `-t` vệt, `-m` ngự vật, `-f` khung) | lụa phất / gài trâm / đeo kiếm / cầm quạt… | — | 8 | Thu |
| `SFX-SHOP-004` | Đủ bộ Hợp mệnh | năm nốt ngũ âm của hành bộ đó | — | 5 | Mẫu |
| `SFX-SHOP-005` | Thử món | gương đồng xoay | — | 2 | Thu |
| `SFX-SHOP-006` | Không đủ tiền | (dùng `SFX-UI-024`) | — | — | — |
| `SFX-COS-001` | Hào quang Bản Mệnh — Mộc | rì rào lá non, rất khẽ | có | 1 | Thu+TH |
| `SFX-COS-002` | Hào quang — Hỏa | lửa nhỏ tí tách | có | 1 | Thu |
| `SFX-COS-003` | Hào quang — Thổ | cát mịn xoáy | có | 1 | Thu |
| `SFX-COS-004` | Hào quang — Kim | ngân kim loại mảnh | có | 1 | Mẫu |
| `SFX-COS-005` | Hào quang — Thủy | giọt nước rơi ngược (đảo) | có | 1 | Thu |
| `SFX-COS-006` | Đào Hoa Phi Vũ | cánh hoa rơi | có | 1 | Thu |
| `SFX-COS-007` | Tam Muội Chân Hỏa | lửa bốc vù | có | 1 | Thu |
| `SFX-COS-008` | Bát Quái Trận | đĩa đá xoay rì rầm | có | 1 | Thu |
| `SFX-COS-009` | Cửu Thiên Lôi Quang | tia lửa điện lách tách (giảm cao tần, không chói) | có | 1 | TH |
| `SFX-COS-010` | Hàn Tuyết Phiêu | tuyết khẽ | có | 1 | Thu |
| `SFX-COS-011` | Bộ Bộ Sinh Liên | chuông nhỏ khi sen nở mỗi bước | — | 4 | Mẫu |
| `SFX-COS-012` | Vệt bước mây / sen / lửa / băng / sao | mỗi vệt một tiếng bước phụ rất khẽ | — | 5 × 3 | Thu |
| `SFX-COS-013` | Phượng Hỏa Dực đập | cánh lửa | có | 1 | Thu |
| `SFX-COS-014` | Tiên Hạc Dực đập | cánh lông | có | 1 | Thu |
| `SFX-COS-015` | Bát Quái Pháp Luân xoay | vòng đồng xoay | có | 1 | Thu |
| `SFX-COS-016` | Đèn lồng cầm tay (đêm) | lửa nến trong lồng | có | 1 | Thu |
| `SFX-COS-017` | Celebrate (ăn mừng theo hành, `renderer.celebrate(wx)`) | ngân ngũ âm của hành + gió xoáy | — | 5 | Mẫu |

**Luật âm trang phục:** âm hào quang / ngự vật của **người chơi khác** chỉ phát khi < 8 m và tối đa 3 nguồn cùng lúc (ưu tiên gần nhất) — chống ồn ở chỗ đông người MMO. Âm của chính mình −20 dB, tắt được (UI-77 «Âm trang phục»).

---

## 13. Xã hội — `SFX-SOC-*`

| Mã | Tên | Mô tả | Bt | Nguồn |
|---|---|---|---|---|
| `SFX-SOC-001` | Gửi cử chỉ | áo phất | 3 | Thu |
| `SFX-SOC-002` | Nhận cử chỉ gửi riêng | chuông gió một tiếng | 2 | Mẫu |
| `SFX-SOC-003` | Bong bóng câu nói xuất hiện (người khác, gần) | giấy mỏng | 3 | Thu |
| `SFX-SOC-004` | Người chơi vào phòng (gần) | bước chân + không gì khác | — | (dùng FOOT) |
| `SFX-SOC-005` | Nhận lời mời đồng tu | (dùng `SFX-UI-044`) | — | — |
| `SFX-SOC-006` | Đồng tu bắt đầu | hai chén trà chạm | 2 | Thu |
| `SFX-SOC-007` | Kết nghĩa kim lan | chuông đôi | 1 | Mẫu |
| `SFX-SOC-008` | Bái sư | khánh + áo quỳ | 1 | Thu+Mẫu |

---

## 14. Âm thanh chữ giọng không lời của NPC — `SFX-VOX-*`

Cho NPC **chưa có thu âm thoại** (đa số NPC phụ): mỗi câu thoại kịch bản phát một «âm sắc giọng» ngắn không thành chữ (kiểu ngân «ừm», «à», «này») theo persona, để câu có hồn mà không cần lồng tiếng toàn bộ (VO đầy đủ: phần 11 §1).

| Mã | Giọng | Bt | Dùng cho |
|---|---|---|---|
| `SFX-VOX-001` | ông lão trầm ấm | 8 | Thầy Tử Bình (khi tắt VO), Vân Cốc, Lão Tùng |
| `SFX-VOX-002` | lão đạo thong thả | 8 | Huyền Hư, Khâu đạo trưởng |
| `SFX-VOX-003` | đạo nhân trung niên dứt khoát | 8 | Trương Thiên Sư, Mao Sơn đạo nhân |
| `SFX-VOX-004` | ni sư dịu | 8 | Diệu Âm |
| `SFX-VOX-005` | bà lão thổ âm | 8 | Vu y bà A Mậu, Bà Tư |
| `SFX-VOX-006` | nho sĩ mạch lạc | 8 | Tế tửu Văn Miếu |
| `SFX-VOX-007` | quan trang nghiêm | 8 | Phán quan Thôi |
| `SFX-VOX-008` | giọng lạnh chắc nịch | 8 | Khổng tiên sinh |
| `SFX-VOX-009` | giọng ngọt mềm (nguy hiểm) | 8 | Lỗ Ban, Định Mệnh Hội |
| `SFX-VOX-010` | thiền sư ít lời | 6 | Thiền sư Trúc Lâm |
| `SFX-VOX-011…016` | khách NPC: thanh niên nam / nữ, trung niên nam / nữ, cụ ông / cụ bà | 6 mỗi giọng | khách giải án (`npc.js › makeNpc`) |

---

## 15. Tổng kết số lượng

| Nhóm | Số mục (mã) | Số tệp (tính cả biến thể) |
|---|---|---|
| UI | 50 | ≈ 115 |
| PROG / QUEST / KARMA | 21 | ≈ 26 |
| FOOT (18 bề mặt × 3) + BODY | 54 + 15 | ≈ 330 + 50 |
| FLY / DOOR / TRAV | 24 | ≈ 45 |
| BELL | 34 | ≈ 100 |
| RITE | 45 | ≈ 110 |
| WATER + RAIN | 30 | ≈ 60 |
| WIND + WX | 19 | ≈ 35 |
| AMB (42 nền + 18 điểm) | 60 | ≈ 100 |
| CROWD | 20 | ≈ 50 |
| MG | 47 | ≈ 115 |
| SHOP / COS | 23 | ≈ 50 |
| SOC | 8 | ≈ 12 |
| VOX | 16 | ≈ 120 |
| **Tổng** | **≈ 466 mã** | **≈ 1.320 tệp** |
