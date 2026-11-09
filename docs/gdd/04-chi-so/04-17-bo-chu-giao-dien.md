# 04-17 · Bộ chữ giao diện (copy deck) của Mệnh Bàn

## 0. Quy ước

- Khóa chuỗi: `mb.<nhóm>.<mục>` (dùng trong mã giao diện; không phải mã định danh nội dung).
- `{…}` là biến; số thập phân dùng dấu phẩy (`1,19`), hàng nghìn dùng dấu chấm (`1.284`).
- Mọi chuỗi đã qua danh sách chữ 04-13 §4. Chuỗi mô tả 10 Phẩm căn ở 04-02 §4.2, câu dẫn ở 04-13 §2 — không lặp ở đây.
- Độ dài: nhãn ≤ 24 ký tự; tooltip ngắn ≤ 90 ký tự; dòng «Vì sao?» ≤ 120 ký tự.

## 1. Nhãn cố định

| Khóa | Chữ |
|---|---|
| `mb.title` | Mệnh Bàn |
| `mb.mode.tien` | Tiên Thiên |
| `mb.mode.hau` | Hậu Thiên chồng lên |
| `mb.btn.why` | Vì sao? |
| `mb.btn.table` | Bảng chữ |
| `mb.btn.source` | Xem lời gốc |
| `mb.read_on` | Theo lá số đọc ngày {ngay} |
| `mb.center.range` | khoảng {min}–{max} |
| `mb.stat.tiemluc` | Tiềm Lực |
| `mb.stat.phamcan` | Phẩm căn |
| `mb.stat.phucphan` | Phúc phận |
| `mb.stat.thanluc` | Thân Lực |
| `mb.stat.thienmenh` | Thiên Mệnh |
| `mb.stat.nhl` | Ngũ Hành Lực |
| `mb.stat.nguduy` | Ngũ Duy |
| `mb.stat.dactinh` | Đặc Tính |
| `mb.stat.thoivan` | Thời Vận |
| `mb.stat.menhcach` | Mệnh Cách |
| `mb.stat.menhcap` | Mệnh Cấp |
| `mb.stat.nguyenkhi` | Nguyên Khí |
| `mb.stat.quykhi` | Quý Khí |
| `mb.stat.tucnghiep` | Túc Nghiệp |
| `mb.stat.tinhkhi` | Tính Khí |
| `mb.stat.daohanh` | Đạo Hạnh |
| `mb.stat.nghichthien` | Nghịch Thiên |
| `mb.stat.canhgioi` | Cảnh giới |
| `mb.role.dung` | Dụng |
| `mb.role.hy` | Hỷ |
| `mb.role.ky` | Kỵ · cửa thử thách |
| `mb.role.cuu` | Cừu |
| `mb.role.nhan` | Nhàn |
| `mb.hidden` | đã ẩn |
| `mb.unsure` | ? chưa chắc (giờ sinh) |

## 2. Tooltip ngắn từng chỉ số

| Khóa | Chữ |
|---|---|
| `mb.tip.tiemluc` | Điểm hạt giống của lá số: gốc 45, cộng trừ theo khung lá số, hành cần nhất, các cặp sao… |
| `mb.tip.phamcan` | Tên gọi theo Tiềm Lực. Chỉ để gọi — không đổi tốc độ tu. |
| `mb.tip.phucphan` | Phúc Khí cộng thêm: +{tt}% từ lá số, +{ht}% từ cảnh giới hiện tại. |
| `mb.tip.thanluc` | Lực của chính bạn và nguồn sinh bạn: {effRatio}%. {muc}. |
| `mb.tip.thienmenh` | Hành cần nhất: {dung}. Mặc màu, đi vùng, tu vào giờ của hành này đều thuận. |
| `mb.tip.nhl` | {thuoc_tinh} {v} · tầng {tang}: từ {pct}% {hanh} trong lá số{he_so}. |
| `mb.tip.nhl.heso_dung` | (là Dụng, nhân 1,3) |
| `mb.tip.nhl.heso_ky` | (là Kỵ, nhân 0,8) |
| `mb.tip.nguduy` | {truc} {diem}: hình dạng sao của bạn, không phải điểm so với người khác. |
| `mb.tip.dactinh` | {ten}: {mo_ta}. Bậc {bac}. |
| `mb.tip.thoivan` | Đại vận {gz_dv} ({tu}–{den} tuổi): {rating_dv}. Năm {gz_ln}: {rating_ln}. |
| `mb.tip.menhcach` | {lop} · {cach}. {trang_thai}. |
| `mb.tip.menhcap` | Thầy xếp lá số theo 6 tiêu chí sách cổ: đạt {pass}/6. |
| `mb.tip.nguyenkhi` | Sức làm việc nặng trong ngày. Tối đa {max}, hồi {hoi} mỗi giờ. |
| `mb.tip.quykhi` | Bao lâu bạn gặp một quý nhân: {chu_ky}. |
| `mb.tip.tucnghiep` | Câu chuyện linh hồn bạn xuất phát. Hư cấu tham khảo, ẩn được. |
| `mb.tip.tinhkhi` | Giọng thoại của bạn: {giong}. Lựa chọn đúng giọng hiện trên cùng. |
| `mb.tip.daohanh` | Mọi điểm tu bạn tự làm. Đây là cột chính của Thiên Bảng. |
| `mb.tip.nghichthien` | Mỗi điểm tu của bạn được nhân {nt}. Lá số càng khó, hệ số càng cao. |
| `mb.tip.canhgioi` | {ten_bac}. Còn {con_lai} Đạo Hạnh tới bậc sau. |

## 3. «Vì sao?» — câu diễn giải 17 nhóm

Biến dùng chung: `{dung}`, `{hy}`, `{ky}` tên hành; `{pct}` phần trăm; `{cach}` tên cách Việt; `{n}` số lượng; `{ds}` danh sách tên.

| Mã | Biến thể | Câu (mặt chính) | Lối đi (nút) |
|---|---|---|---|
| F01 | 成格 +6 | Khung lá số ({cach}) nguyên vẹn, không có bệnh. | Mệnh Cách |
| F01 | 有救 +2 | Khung lá số ({cach}) có bệnh, và thuốc nằm ngay trong lá số. | Phương thuốc |
| F01 | 败格 −7 | Khung lá số ({cach}) có chỗ đứt chưa nối — Mệnh Đồ là cách nối. | Mệnh Đồ |
| F01 | 特殊 +3 | Khung lá số đặc biệt, đọc theo thế. | Mệnh Cách |
| F02 | special +6 | Lá số theo một thế nhất quán. | — |
| F02 | normal +4 | Lá số có khung rõ ràng. | — |
| F02 | luyue 0 | Tháng sinh là sao cùng loại với bạn — hành cần nhất lấy ở chỗ khác. (Không cộng, không trừ.) | — |
| F03 | +6 | Hành cần nhất ({dung}) đã mạnh: {pct}%. | — |
| F03 | −6 | Hành cần nhất ({dung}) còn mỏng: {pct}%. | Chuỗi bổ {dung} |
| F04 | +3 | Hành cần nhất lộ ra ở can, dễ dùng. | — |
| F05 | +5 | Có nguồn nuôi hành cần nhất ({hy} {pct}%). | — |
| F05 | −3 | Nguồn nuôi hành cần nhất ({hy}) còn mỏng. | Chuỗi bổ {hy} |
| F06 | −6 | Hành thử thách ({ky}) đang nhiều: {pct}%. Việc của hành này thưởng ×1,3. | Cửa thử thách |
| F07 | +3 | Hành cần nhất mạnh hơn hành thử thách — thế chủ động. | — |
| F08 | −5×n | {n} cặp sao giằng co: {ds}.{che} | Cặp sao |
| F08 | `{che}` | Đã có sao chế: {mitigation}. | — |
| F09 | +3 / +6 | Cặp sao nâng nhau: {ds}. | — |
| F10 | −5 | Các trụ va nhau nhiều ({n_xung} xung, {n_hinh} hình) — đời nhiều chuyển động. | — |
| F11 | −3 | Cung gốc (chi ngày) hay bị lay — nên có chỗ dựa. | Thân Lực |
| F12 | +4 | Ba chi hợp về hành cần nhất. | — |
| F13 | +3 | Nhiều sao lành: {ds}. | Đặc Tính |
| F14 | −2×n | {n} trụ đang «treo» (không vong) — đợi năm, vận đến mới phát. | Thời Vận |
| F15 | +5 | Dòng khí năm hành chảy đủ vòng. | — |
| F15 | +2 | Dòng khí thông {len}/5, về phía {khia_canh}. | — |
| F15 | −4 | Dòng khí còn tắc ({len}/5) — đợi vận «mở dòng», hoặc bồi hành tắc. | Bổ Hành |
| F16 | − | {n} trụ có can chi khắc nhau trúng hành cần nhất. | Chuỗi bổ {dung} |
| F16 | + | {n} trụ có can chi khắc nhau trúng hành thử thách — có lợi. | — |
| F17 | + | Hai trụ «ôm» một sao quý ở giữa: {mo_ta}. | — |
| — | tổng | Tổng {score}. | — |
| — | kẹp | (Tổng thô {raw}, giữ trong 0–100.) | — |

Tên khía cạnh `{khia_canh}` lấy từ `yuanliu.aspectVi` của engine, rút gọn: Tài → «của cải», Quan → «kỷ cương», Ấn → «học vấn», Thực/Thương → «tài năng», Tỷ/Kiếp → «bạn bè, tự lực».

## 4. Ngũ Hành Lực — 30 câu theo hành × tầng

Hiện dưới tên thuộc tính khi chạm vào cung.

| Hành | Tầng 0 Khuyết | 1 Nhược | 2 Bình | 3 Vượng | 4 Thịnh | 5 Cực |
|---|---|---|---|---|---|---|
| Sinh Cơ (Mộc) | Mầm còn để ngỏ — chỗ để bạn tự gieo. | Mầm non, cần tưới đều. | Cây đứng được một mình. | Cây xanh, hồi sức nhanh. | Rừng nhỏ — ở đâu cũng mọc. | Rừng già — sức sống không cạn. |
| Nhiệt Tâm (Hỏa) | Lửa chưa nhóm — chỗ để bạn tự thắp. | Đốm lửa, cần che gió. | Ngọn đèn đều. | Bếp lửa, người khác lại gần. | Lửa lễ hội. | Mặt trời — đi đâu cũng ấm. |
| Định Lực (Thổ) | Nền còn để ngỏ — chỗ để bạn tự đắp. | Đất mỏng, cần bồi. | Nền đứng vững. | Đất dày, ngồi lâu không mỏi. | Núi nhỏ — gió qua không động. | Núi lớn — tâm như đá. |
| Tuệ Kiếm (Kim) | Lưỡi còn để ngỏ — chỗ để bạn tự rèn. | Lưỡi cùn, cần mài. | Lưỡi bén vừa. | Kiếm sắc, cắt đúng chỗ. | Kiếm quý — rối nào cũng gỡ. | Kiếm báu — một nhát rõ ràng. |
| Linh Tuệ (Thủy) | Nguồn còn để ngỏ — chỗ để bạn tự khơi. | Giọt nước, cần gom. | Suối nhỏ chảy đều. | Sông — chữ vào là nhớ. | Hồ rộng — học đâu thấm đó. | Biển — trăm sông về. |

Câu Bổ Hành (chế độ Hậu Thiên): «+{bo} Bổ Hành · đã bồi từ {tang_tt} lên {tang_hd}».

## 5. Thân Lực — 5 mức

| Mức engine | Nhãn lối chơi | Câu |
|---|---|---|
| Thân quá vượng | Độc Hành | Tự làm nhanh hơn 20%. Dạy người khác thì cả hai cùng tiến (Tiết Tú). |
| Thân vượng | Tự Lập | Tự làm nhanh hơn 10%. |
| Thân trung hòa | Trung Dung | Vừa tự làm được (+5%), vừa nhận giúp tốt (×1,25). Thiền +5%. |
| Thân nhược | Cầu Trợ | Mọi giúp đỡ bạn nhận được mạnh gấp rưỡi. Quý nhân tới thêm mỗi tuần. |
| Thân quá nhược | Thuận Thế | Giúp đỡ mạnh gấp rưỡi và kéo dài gấp rưỡi. Cây non cần cọc — có cọc là đang lớn. |

## 6. Thiên Mệnh — 5 vai

| Vai | Câu |
|---|---|
| Dụng | Hành cần nhất: {dung}. Áo màu này, vùng {vung}, giờ {gio}, mùa {mua} đều thuận cho bạn. |
| Dụng phụ | Hành phụ: {dung_phu} — màu đai. |
| Hỷ | Hành nuôi {dung}: {hy}. Việc của hành này thêm 5% Phúc Khí. |
| Kỵ | Hành thử thách: {ky}. Việc và vùng của hành này khó hơn một bậc, thưởng tu ×1,3. |
| Cừu | Hành nuôi thử thách: {cuu}. Việc của hành này thưởng tu ×1,15. |
| Nhàn | Hành thư thả: {nhan}. Không cộng không trừ — quán trà hành này là chỗ nghỉ chân. |

`{vung}`: tên một vùng hợp Dụng gần nhất (04-03 §6.1); `{gio}`: hai chi giờ của hành; `{mua}`: mùa của hành.

## 7. Ngũ Duy — 5 trục × 4 trạng thái

| Trục | Trội (100) | Trung (26–99) | Yếu nhất (Bổ Khuyết) | Khuyết hẳn (0) |
|---|---|---|---|---|
| Thương đạo (Tài) | Bạn biết thứ gì ở đâu thì quý. Cây khởi đầu: Thương đạo. | Có duyên buôn bán. | Cánh này ngắn — chỗ đáng tu. Tìm một người buôn giỏi để học. | Lá số không mang sao Tài. Học buôn như học một thứ tiếng lạ. |
| Trị đạo (Quan) | Người khác dễ nghe bạn. Cây khởi đầu: Trị đạo. | Có duyên giữ kỷ cương. | Cánh này ngắn. Tìm một người xử việc giỏi để học. | Lá số không mang sao Quan. Học xử việc như học tiếng lạ. |
| Học đạo (Ấn) | Chữ vào là ở lại. Cây khởi đầu: Học đạo. | Có duyên sách vở. | Cánh này ngắn. Tìm một người học giỏi để học cách học. | Lá số không mang sao Ấn. Học cách học như học tiếng lạ. |
| Nghệ đạo (Thực) | Tay bạn làm ra cái đẹp. Cây khởi đầu: Nghệ đạo. | Có duyên tay nghề. | Cánh này ngắn. Tìm một người khéo tay để học. | Lá số không mang sao Thực. Học nghề như học tiếng lạ. |
| Đồng đạo (Tỷ) | Bạn có bạn. Cây khởi đầu: Đồng đạo. | Có duyên bạn đồng tu. | Cánh này ngắn. Tìm một nhóm người để đi cùng. | Lá số không mang sao Tỷ. Học có bạn như học tiếng lạ. |

## 8. Mệnh Cách — thẻ bên

| Lớp | Trạng thái | Dòng 1 | Dòng 2 |
|---|---|---|---|
| Thuận Thiên | 成格 | Thuận Thiên · {cach} | Cách nguyên vẹn. Việc của bạn: giữ. {so_ai} ải giữ cách. |
| Đắc Cứu | 有救 (đang hái) | Đắc Cứu · {cach} | Phương thuốc: {da_hai}/{so_lan} lần hái. |
| Đắc Cứu | thuốc thành | Đắc Cứu · {cach} | Bại mà có thành. |
| Nghịch Thiên | 败格 | Nghịch Thiên · {cach} | Mệnh Đồ: {nut_da_thao}/{nut_that} nút thắt đã tháo. |
| Nghịch Thiên | có vận cứu cách | Nghịch Thiên · {cach} | Đại vận {gz} ({tu}–{den} tuổi) là vận cứu cách. |
| Dị Cách | 成格 | Dị Cách · {cach} | Thế thuần. Việc của bạn: giữ thế. |
| Dị Cách | 有救 | Dị Cách · {cach} | Thế giữ được — có chỗ cần canh. |
| Dị Cách | 败格 | Dị Cách · {cach} | Thế bị cưỡng. Hai đường: giữ thế, hoặc về đường thường. |

## 9. Nguyên Khí, Quý Khí

| Khóa | Chữ |
|---|---|
| `mb.nk.state.thinh` | Khí Thịnh — hồi nhanh hơn |
| `mb.nk.state.binh` | Khí Bình |
| `mb.nk.state.duong` | Mùa dưỡng sức — trà và giấc ngủ hồi thêm |
| `mb.nk.empty` | Nguyên Khí đã cạn cho hôm nay. Việc nhẹ vẫn làm được — uống chén trà đã. |
| `mb.nk.low` | Còn {nk} Nguyên Khí — đủ {n} việc nặng. |
| `mb.qk.hien` | Quý Khí Hiển — quý nhân ghé mỗi ngày. |
| `mb.qk.thinh` | Quý Khí Thịnh — quý nhân ghé hai ngày một lần. |
| `mb.qk.binh` | Quý Khí Bình — quý nhân ghé ba ngày một lần. |
| `mb.qk.tutao` | Tự Tạo Quý Nhân — người bạn giúp sẽ quay lại giúp bạn. Đã có {n}/5. |

## 10. Thời Vận

| Khóa | Chữ |
|---|---|
| `mb.tv.dv.dai_cat` | Đỉnh vận — mười năm thuận gió (+{r2}%). |
| `mb.tv.dv.cat` | Vận thuận (+{r2}%). |
| `mb.tv.dv.hoi_thuan` | Vận hơi thuận (+{r2}%). |
| `mb.tv.dv.binh` | Vận bình. |
| `mb.tv.dv.goi` | Vận gợn — việc thử thách thêm {r3}%. |
| `mb.tv.dv.thu_thach` | Vận thử thách — việc thử thách thêm {r3}%. |
| `mb.tv.dv.dai_thu_thach` | Vận đại thử thách — mười năm đường dốc, mỗi bước được hai bước (+{r3}% việc thử thách). |
| `mb.tv.ln.nam_dinh` | Năm đỉnh (+{r2}%). |
| `mb.tv.ln.thuan` | Năm thuận (+{r2}%). |
| `mb.tv.ln.binh` | Năm bình. |
| `mb.tv.ln.goi` | Năm gợn — việc thử thách thêm {r3}%. |
| `mb.tv.ln.thu_thach` | Năm thử thách — «Năm Hạn» mở sớm. |
| `mb.tv.ln.nam_han` | Năm Hạn — tu nhanh nhất nếu chọn việc khó (+{r3}%). Thái Tuế Điện có lễ cho bạn. |
| `mb.tv.tieu_van` | Tiểu Vận — chưa tới đại vận đầu tiên. |
| `mb.tv.cuu_cach` | Vận cứu cách — 10 năm này nút thắt dễ tháo. |
| `mb.tv.bien_van` | Biến vận — mười năm có một lần đổi lớn{co_loi}. |
| `mb.tv.bien_van.co_loi` | , đổi theo hướng có lợi |
| `mb.tv.phuc_ngam` | Phục ngâm — mười năm gặp lại chính mình. |
| `mb.tv.van_treo` | Vận treo (không vong) — lực giảm. |

## 11. Thông báo (toast)

| Sự kiện | Chữ | Hiện bao lâu |
|---|---|---|
| Bổ Hành +1 | {thuoc_tinh} +1 Bổ Hành ({tong}/20). | 4 s |
| Tầng hiệu dụng tăng | {thuoc_tinh} lên tầng {tang}: {cau_tang} | 6 s |
| Nhận Ngộ | +1 Ngộ {cay}. | 3 s |
| Mở nút mới | Có thể mở: {ten_nut}. | 5 s |
| Bổ Khuyết xong | Cánh {truc} mọc nhanh nhất từ hôm nay (×{tm}). | 8 s |
| Tâm ma giảm | {doc} lắng xuống ({gia_tri}). | 3 s |
| Qua một tầng ải tâm ma | Qua tầng {tang}/{tong} ải {doc}. | 5 s |
| «Tam Độc Tiêu» | Ba ngọn lửa đều đã thấp. Danh hiệu «Tam Độc Tiêu». | 8 s |
| Lên cảnh giới | {ten_bac}. | 8 s + cảnh |
| Cảnh giới 4 | Từ hôm nay, chỉ tính phần bạn tự làm. | 8 s + cảnh |
| Kiếp số mở | Ải «{ten_kiep}» đã mở. Kiếp là ải, không phải án. | 8 s |
| Vận mới (đổi đại vận) | Bước qua cổng vận {gz} ({tu}–{den} tuổi). | 8 s |
| Năm mới (Lập Xuân) | Năm {gz} bắt đầu. Thời Vận đã đọc lại. | 6 s |
| Vị thuốc hái xong | Đã hái {vi_thuoc} ({da_hai}/{so_lan}). | 5 s |
| Quý nhân ghé | {ten_npc} ghé qua{qua}. | 5 s |
| Tự tạo quý nhân | {ten_npc} nhớ ơn bạn — từ nay là quý nhân của bạn. | 6 s |
| Đồng tu duyên | Hai nạp âm hợp nhau: +5% khi tu cùng. | 5 s |
| Hợp mệnh (đã có) | giữ chữ hiện tại của Tàng Y Các | — |

## 12. Cổng nhập — cảnh báo và lỗi

| Khóa | Chữ |
|---|---|
| `gate.warn.gio_ty` | Sinh quanh giờ Tý: từ 23:00, bát tự tính sang ngày hôm sau. Con kiểm lại giờ trên giấy khai sinh nhé. |
| `gate.warn.giao_tiet` | Con sinh sát lúc giao tiết {tiet} ({gio_tiet}). Tháng trong bát tự rất nhạy — thầy tính theo lịch chuẩn. |
| `gate.ask.gio_lich_su` | Năm {nam}, giờ ở Sài Gòn sớm hơn bây giờ một tiếng. Giấy khai sinh ghi giờ cũ — thầy có trừ một tiếng không? |
| `gate.ask.gio_lich_su.co` | Có, trừ một tiếng |
| `gate.ask.gio_lich_su.khong` | Không, giữ nguyên |
| `gate.ask.gio_lich_su.chua_ro` | Không rõ |
| `gate.err.tuong_lai` | Ngày sinh chưa tới. |
| `gate.err.nhuan` | Năm {nam} không có tháng {thang} nhuận. |
| `gate.err.thang_thieu` | Tháng {thang} năm {nam} âm lịch chỉ có 29 ngày. |
| `gate.note.lap_xuan` | Theo lịch âm con tuổi {tuoi_am}; trong bát tự (tính theo Lập Xuân) năm sinh là {nam_bt}. Thầy dùng bát tự. |
| `gate.err.engine` | (dùng nguyên lỗi tiếng Việt của engine) |

## 13. Hộp xác nhận Sửa bát tự

```
Sửa bát tự
───────────
Sẽ đọc lại:  Tiềm Lực, Phẩm căn, Ngũ Hành Lực, Thân Lực, Thiên Mệnh, Ngũ Duy,
             Mệnh Cách, Mệnh Cấp, Đặc Tính, Túc Nghiệp, Tính Khí, Thời Vận.
Màu áo:      {mau_cu} → {mau_moi}
Đạo Hạnh:    {dh_cu} → {dh_moi}  (theo hệ số Nghịch Thiên mới ×{nt_moi})
Cảnh giới:   {cg_cu} → {cg_moi}
Giữ nguyên:  Phúc Khí, Ngọc, tủ đồ, bạn bè, nhà, danh hiệu, Bổ Hành, cây kỹ năng, Sổ Công Quá.
Lần sửa tiếp theo: sau {ngay_sau}.
                                  [Giữ lá cũ]   [Sửa]
```

Khi `cg_moi < cg_cu`: thêm dòng đỏ nhạt (không chữ «mất»): «Cảnh giới sẽ đọc lại theo lá số mới.»

## 14. Nhãn cho trình đọc màn hình

| Phần tử | Mẫu `aria-label` |
|---|---|
| Tâm | Nhật chủ {can} ({han_viet}), Tiềm Lực {tl}, Phẩm căn {pc}{khoang} |
| Cung Thân Lực | Thân Lực {v} trên 100, {muc} |
| Hạt Thiên Mệnh | Hành {hanh}, vai {vai} |
| Cung Ngũ Hành Lực | {thuoc_tinh}, hành {hanh}, lực {v}, tầng {tang} {ten_tang}{vai_dung_ky}{bo} |
| Cánh Ngũ Duy | {truc}, {diem} trên 100{troi_yeu} |
| Hạt Đặc Tính | {ten}, bậc {bac}, {nhom} |
| Đoạn Thời Vận | Đại vận {gz}, {tu} đến {den} tuổi, {rating}{hien_tai} |
| Thẻ | {ten_the}: {dong_1}. {dong_2} |

## 15. Checklist nghiệm thu phần 04-17

- [ ] Mọi khóa có chữ; không khóa nào rỗng ở tiếng Việt.
- [ ] Không chuỗi nào vượt độ dài §0.
- [ ] Quét §4.1 của 04-13 không trúng chuỗi nào.
- [ ] Số thập phân dùng dấu phẩy, hàng nghìn dấu chấm.
