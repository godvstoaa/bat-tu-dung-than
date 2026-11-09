# 01 · Phần 3 — Kiểm toán trụ cột cho những gì đã có và đã lên kế hoạch

> Trụ cột chỉ có giá trị nếu được áp vào thứ đang tồn tại. Phần này rà **code hiện có** (`src/game/*`) và **bản sơ đồ tổng** (`docs/GAME-AAA-THIET-KE.md`) theo sáu trụ cột, đưa ra phán quyết từng mục: **Giữ**, **Sửa lời**, **Đổi cách trao**, **Đổi tên**, **Bỏ**. Mỗi phán quyết dẫn mã ví dụ / án lệ ở phần 1–2.
>
> Phán quyết ở đây là **đề xuất của tài liệu 01**; chủ sở hữu thực thi là tài liệu 11 (kinh tế, cho Tàng Y Các), 04 (chỉ số), 05 (cải mệnh), 12 (trình bày). Phần này không sửa code.

## 1. Phương pháp

1. Liệt kê thực thể: món đồ (`cosmetics.js › ITEMS`), trạm (`features.js › ALL`), gia trì (`progress.js › WX_GIATRI`), hệ thống trong bản sơ đồ.
2. Với mỗi thực thể: đặt sáu câu hỏi kiểm **[B]** quan trọng nhất (một câu / trụ cột).
3. Ghi phán quyết và mức ưu tiên:
   - **P0** — vi phạm [B] của T6 hoặc T2: sửa trước khi có thanh toán thật;
   - **P1** — vi phạm [B] của T1, T3, T5 hoặc lệch canon: sửa trước M2;
   - **P2** — chất lượng: sửa khi chạm tới.

Ký hiệu cột trụ cột: ✓ đạt · △ đạt có điều kiện · ✗ vi phạm.

## 2. Tàng Y Các — 51 món (`cosmetics.js`)

### 2.1 Phẩm phục (8)

| id | Tên | Trao / giá | T1 | T2 | T3 | T4 | T5 | T6 | Phán quyết | Ưu tiên |
|---|---|---|---|---|---|---|---|---|---|---|
| `y_menh` | Bản Mệnh Y | miễn phí, theo Dụng / Hỷ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **Giữ**. Đây là món quan trọng nhất của T1 (`VD-T1-04`). | — |
| `y_bach` | Bạch Y Thư Sinh | 240 Phúc Khí | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **Giữ**. Trang phục dân dụng. | — |
| `y_tu` | Tử Y Chân Nhân | 380 Ngọc, VIP | ✓ | △ | ✓ | ✓ | △ | △ | **Đổi tên** (vd «Tử Y Ẩn Khách»). «Chân nhân» là danh hiệu đạo sĩ được phong; bán danh hiệu tu bằng tiền làm mờ ranh giới «không bán tu». Giữ màu và mô tả «tử khí đông lai». | P0 |
| `y_moc` | Thanh Mộc Tiên Y | 160 Ngọc, bộ Mộc | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **Giữ**. | — |
| `y_hoa` | Ly Hỏa Chân Bào | 160 Ngọc, bộ Hỏa | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **Giữ**. | — |
| `y_tho` | Hậu Thổ Đạo Bào | 160 Ngọc, bộ Thổ | ✓ | ✓ | ✓ | △ | △ | △ | **Sửa lời**: mô tả «hoàng bào đạo sĩ» nên thành «áo vàng đất kiểu đạo bào thường phục». Đạo bào thường phục (không phải pháp y chủ lễ) được phép (phần 13 §3). | P2 |
| `y_kim` | Canh Kim Kiếm Bào | 160 Ngọc, bộ Kim | ✓ | ✓ | △ | ✓ | ✓ | ✓ | **Sửa lời**: «kiếm tu» → «kiếm khách thư sinh»; tránh gợi kiếm là vũ khí (T3). | P2 |
| `y_thuy` | Huyền Thủy Long Bào | 160 Ngọc, bộ Thủy | ✓ | ✓ | ✓ | ✓ | △ | ✓ | **Sửa lời**: «long bào» theo nghĩa hẹp là áo vua; đổi «Huyền Thủy Vân Bào» hoặc ghi rõ «áo thêu rồng nước» (không phải long bào hoàng gia). | P2 |

### 2.2 Mũ · trâm (7)

| id | Tên | Trao / giá | Vấn đề | Phán quyết | Ưu tiên |
|---|---|---|---|---|---|
| `tram_go` | Trâm Gỗ Đào | 60 Phúc Khí | mô tả «trừ tà, giữ tâm» ngụ ý công năng thật | **Sửa lời**: «gỗ đào, theo tục xưa là gỗ trừ tà» (văn hóa, không công năng) | P2 |
| `dao_quan` | Ngân Đạo Quan | 120 Ngọc | mô tả «đạo sĩ chính tông»: mua được «chính tông» | **Sửa lời**: «kiểu quan cài búi của đạo sĩ». Trâm, quan cài búi thường phục được phép | P1 |
| `quan_la` | Liễu Diệp Quan | 120 Ngọc | — | **Giữ** | — |
| `kim_quan` | Tử Kim Quan · Lông Trĩ | 220 Ngọc | phong cách tuồng / võ tướng, lệch tông thư sinh – đạo sĩ của bộ Hỏa | **Giữ**, ghi chú mỹ thuật: lông trĩ ≤ 1,2 m, không vướng mái trong nhà | P2 |
| `dau_lap` | Đấu Lạp Mạng Sa | 120 Ngọc | — | **Giữ** | — |
| `tram_ngoc` | Bích Ngọc Trâm | 120 Ngọc | — | **Giữ** | — |
| `quan_sen` | Liên Hoa Quan | 680 Ngọc, VIP + cấp 10 | 蓮花冠 là quan của đạo sĩ Toàn Chân đã thụ giới; mô tả «của bậc đắc đạo» = bán đắc đạo | **Đổi cách trao + đổi tên**: (a) món VIP đổi thành «Kim Liên Trâm» (trâm hoa sen, họa tiết, không mang danh quan đạo); (b) «Liên Hoa Quan» thật chỉ **trao** khi hoàn tất chuỗi giới luật Toàn Chân (`CQ-` do tài liệu 05 cấp), không bán, không VIP (án lệ `AL-09`) | **P0** |

### 2.3 Sau lưng (8)

| id | Tên | Trao / giá | Vấn đề | Phán quyết | Ưu tiên |
|---|---|---|---|---|---|
| `kiem_go` | Kiếm Gỗ Đào | 120 Phúc Khí | T3: chỉ đeo, không hành vi tấn công (đã đúng) | **Giữ** (`VD-T3-02`) | — |
| `kiem_moc` | Thanh Trúc Kiếm | 140 Ngọc | — | **Giữ** | — |
| `ho_lo` | Tử Kim Hồ Lô | 140 Ngọc | mô tả «đựng đan dược» — được, miễn không có công năng thuốc | **Giữ** | — |
| `kiem_bao` | Song Kiếm Hàn Quang | 240 Ngọc | hai kiếm bạc, hình tượng giang hồ; T3 △ | **Giữ**, ràng buộc: không hoạt cảnh rút kiếm | P2 |
| `o_giay` | Ô Giấy Dầu Vẽ Sen | 140 Ngọc | — | **Giữ** | — |
| `canh_phuong` | Phượng Hỏa Dực | 320 Ngọc | cánh là motif giả tưởng, không thuộc truyền thống nào trong game | **Giữ** với điều kiện mỹ thuật: cánh vẽ theo lối lông vũ thủy mặc / lụa, không theo cánh thiên thần phương Tây (phần 13 §4.6). Ẩn cánh trong điện chính (T6, lễ nghi) | P2 |
| `canh_hac` | Tiên Hạc Dực | 320 Ngọc | như trên | như trên | P2 |
| `phap_luan` | Bát Quái Pháp Luân | 720 Ngọc, VIP | «Pháp luân» (法輪) là biểu tượng thiêng Phật giáo; ghép với bát quái là trộn hai truyền thống (T4, T5, T6) | **Đổi tên**: «Bát Quái Hoàn» (vòng bát quái); hình giữ bát quái, bỏ nan bánh xe 8 căm kiểu pháp luân | **P0** |

### 2.4 Cầm tay (5)

| id | Tên | Trao / giá | Vấn đề | Phán quyết | Ưu tiên |
|---|---|---|---|---|---|
| `quat_giay` | Quạt Giấy Thư Pháp | 90 Phúc Khí | chữ «道» trên quạt: chữ đúng, đồ dân dụng | **Giữ** | — |
| `phat_tran` | Phất Trần Bạch Vĩ | 260 Phúc Khí | phất trần là pháp khí của đạo sĩ và thiền sư nhưng cũng là đồ văn nhân; mức thiêng thấp | **Giữ**; trong khoa nghi (người chơi đứng hàng lễ), tự cất | P2 |
| `den_long_tay` | Đăng Lung Dạ Hành | 260 Phúc Khí | — đèn có nguồn sáng thật ban đêm: rất hợp T4 | **Giữ** | — |
| `la_ban_tay` | La Bàn Tam Hợp | 130 Ngọc | dụng cụ nghề phong thủy; nên có công năng (T4) | **Giữ**, đề xuất: khi cầm, sảnh Dương Trạch cho xem hướng nhanh (không thưởng chỉ số) | P2 |
| `quat_long` | Vũ Phiến Gia Cát | 260 Ngọc | nhân vật lịch sử, không thiêng | **Giữ** | — |

### 2.5 Hào quang (7)

| id | Tên | Trao / giá | Vấn đề | Phán quyết | Ưu tiên |
|---|---|---|---|---|---|
| `aura_menh` | Gia Trì Bản Mệnh | miễn phí, theo cấp | — | **Giữ**; khi cảnh giới thay cấp, mở theo cảnh giới (bản sơ đồ §9.1) | P1 |
| `aura_dao` | Đào Hoa Phi Vũ | 150 Ngọc | — | **Giữ** | — |
| `aura_lua` | Tam Muội Chân Hỏa | 260 Ngọc | thuật ngữ có gốc tu luyện (三昧真火), dùng phổ biến trong văn học | **Giữ**; mô tả thêm «tên lấy từ truyện cổ» | P2 |
| `aura_batquai` | Bát Quái Trận | 260 Ngọc | — | **Giữ** | — |
| `aura_set` | Cửu Thiên Lôi Quang | 260 Ngọc | T3: tia sét không bắn ra ngoài (`VD-T3-21`) | **Giữ** + ràng buộc VFX | P1 |
| `aura_tuyet` | Hàn Tuyết Phiêu | 150 Ngọc | — | **Giữ** | — |
| `aura_sen` | Bộ Bộ Sinh Liên | 640 Ngọc, cấp 8 | hình «bước đi nở sen» gắn chặt với tích Phật đản sinh; bán bằng tiền làm hàng hóa hình tượng thiêng | **Đổi cách trao**: không bán; trao khi mở **tầng chín Cửu phẩm liên hoa** ở Bút Tháp (chuỗi Tịnh Độ). Giữ tên (thành ngữ có cả nghĩa thế tục) | **P0** |

### 2.6 Vệt bước (6)

| id | Tên | Phán quyết |
|---|---|---|
| `trail_menh` | Bộ Pháp Bản Mệnh | **Giữ** |
| `trail_may` | Đằng Vân Bộ | **Giữ** |
| `trail_sen` | Liên Hoa Bộ | **Giữ** (cánh sen rơi là họa tiết, không phải sen nở dưới chân); phân biệt rõ với `aura_sen` |
| `trail_lua` | Hỏa Vân Bộ | **Giữ** |
| `trail_bang` | Băng Phách Bộ | **Giữ** |
| `trail_sao` | Tinh Hà Bộ | **Giữ** |

Ràng buộc chung: vệt bước **tắt trong điện chính** (A) và trong vùng Phong Đô (T6: nơi tôn nghiêm, không phô trương).

### 2.7 Ngự vật (5)

| id | Tên | Trao / giá | Vấn đề | Phán quyết | Ưu tiên |
|---|---|---|---|---|---|
| `kiem` | Ngự Kiếm | miễn phí | — | **Giữ**; mở bay theo cảnh giới 3 (`AL-12`) | P1 |
| `may` | Cân Đẩu Vân | 200 Ngọc | mây của Tôn Ngộ Không (Tây Du Ký, công hữu) | **Giữ** | — |
| `ho_lo_bay` | Hồ Lô Phi Hành | 200 Ngọc | — | **Giữ** | — |
| `dai_sen` | Liên Hoa Đài | 360 Ngọc | **đứng trên đài sen** là tư thế của Phật, Bồ-tát (§7.2 phần 2) | **Bỏ khỏi bán**; thay bằng «Hà Diệp Chu» (thuyền lá sen xanh, motif tranh dân gian) | **P0** |
| `hac` | Tiên Hạc | 780 Ngọc, VIP | cưỡi hạc là motif tiên Đạo giáo dân gian, không phải vật thờ | **Giữ** | — |

### 2.8 Khung tên (5)

| id | Tên | Phán quyết |
|---|---|---|
| `khung_tron` | Khung Mộc | **Giữ** |
| `khung_may` | Tường Vân | **Giữ** |
| `khung_sen` | Liên Đài | **Đổi tên** «Liên Diệp» (viền lá sen) để tránh chữ «đài» (tòa sen) — P2 |
| `khung_ngoc` | Bích Ngọc | **Giữ** |
| `khung_long` | Kim Long | **Giữ**; điểm danh 7 ngày nên có **1 ngày ân hạn** (phần 14 §3: không phạt nghỉ) — P1 |

### 2.9 Tổng kết Tàng Y Các

| Phán quyết | Số món | Món |
|---|---|---|
| Giữ nguyên (có thể kèm ghi chú nhỏ như `aura_menh`, `kiem`, `khung_long`, `la_ban_tay`) | 33 | còn lại |
| Sửa lời mô tả | 7 | `y_tho`, `y_kim`, `y_thuy`, `tram_go`, `dao_quan`, `aura_lua`, `kim_quan` (ghi chú) |
| Đổi tên | 4 | `y_tu`, `phap_luan`, `khung_sen`, `quan_sen` (món VIP) |
| Đổi cách trao (không bán, trao qua tu) | 2 | `quan_sen` (bản thật), `aura_sen` |
| Bỏ khỏi bán, thay món | 1 | `dai_sen` |
| Ràng buộc VFX / ngữ cảnh | 5 | `kiem_bao`, `canh_phuong`, `canh_hac`, `aura_set`, `phat_tran` |

*(Một món có thể nằm ở hai dòng; tổng số món là 51.)*

**Hệ quả kinh tế** (cho tài liệu 11): ba món VIP / giá cao (`quan_sen` 680, `aura_sen` 640, `dai_sen` 360) rời khỏi cửa hàng. Đề xuất bù bằng món thay thế cùng bậc hiếm và **bộ mùa theo niên chủ Thái Tuế** (bản sơ đồ §11) — không bù bằng món thiêng khác.

## 3. Trạm trong Sơn Môn (`features.js › ALL`)

| Trạm | Nội dung | T1 | T2 | T6 | iOS | Phán quyết |
|---|---|---|---|---|---|---|
| `thay` | Bàn Thầy Tử Bình | ✓ engine | △ cần câu dẫn điểm thấp | ✓ | bật (dạng học) | **Giữ**; thêm câu dẫn bắt buộc `VD-T2-01` — P0 |
| `compass` | La Bàn Đài | ✓ | ✓ | ✓ | bật | **Giữ** |
| `xam` | Ống Xăm | ✓ `qiuqian` | △ lời xăm cổ có câu tuyệt đối | △ | **tắt** | **Sửa lời**: mỗi quẻ xăm có dòng «lời bàn: xu hướng, việc nên làm» — P1 |
| `huong` | Lư Hương / Lò Trầm | — | ✓ | ✓ lễ, không cầu được | bật (Lò Trầm) | **Giữ** |
| `lich` | Bảng Lịch | ✓ `zheri` | △ ngày «hung» | ✓ | bật | **Sửa lời**: ngày hắc đạo → «ngày nên giữ, nên nghỉ» — P1 |
| `tra` | Trà Thất | — | ✓ | ✓ | bật | **Giữ**; là «khoảnh khắc tĩnh» chuẩn (`KT-T3-09`) |
| `sen` | Hồ Sen (hoa đăng điều ước) | — | ✓ | △ điều ước không hứa thành | **tắt** | **Giữ**, lời «gửi điều ước» không «cầu được ước thấy» — P2 |
| `an0`–`an2` | Án khách | ✓ `cases.js` | △ lời thất bại | ✓ | bật | **Sửa lời** thất bại theo `VD-T2-16` — P1 |
| `trach` | Trạch Nhật | ✓ | ✓ | ✓ | bật (học) | **Giữ** |
| `duongtrach` | Dương Trạch | ✓ | ✓ | ✓ | bật | **Giữ** |
| `dieuhau` | Điều Hậu | ✓ | ✓ | ✓ | bật | **Giữ** |
| `thuvien` | Thư Lâu | ✓ | ✓ | ✓ | bật | **Giữ** |
| `hophon` | Hợp Hôn | ✓ `hehun` | △ «không hợp» dễ thành phán | △ | bật | **Sửa lời**: kết quả hợp hôn là «chỗ hai người cần bù cho nhau», không «nên / không nên lấy» — P0 |
| `tuvi` | Tử Vi | ✓ | ✓ | ✓ | bật | **Giữ** |
| `tuongphap` | Tượng Pháp | ✓ | ✓ | ✓ | bật | **Giữ**; ghi rõ «theo Manh phái» (`VD-T5-09`) |
| `cachcuc` | Cách Cục | ✓ | ✓ | ✓ | bật | **Giữ** |
| `que` | Giải Quẻ 5 phép | ✓ | △ | △ | **tắt** | **Sửa lời**: như `xam` — P1 |
| `tangy` | Tàng Y Các | — | — | △ | bật (ẩn nạp) | thi hành §2 |
| `vanbia`, `van0`–`van8` | Vận Mệnh Các | ✓ `vanmenh.js` | △ đại vận xấu | ✓ | **tắt** | **Sửa lời**: mỗi cổng đại vận có dòng «việc nên làm trong mười năm này» — P1 |
| `thaitue` | Thái Tuế Điện | ✓ `thaitue.js` | △ | △ đèn Thái Tuế | **tắt** | **Giữ** đèn là lễ; cấm lời «thắp đèn để giải hạn»; đèn **không** bán bằng Ngọc — P0 |

## 4. Bản sơ đồ tổng — chỗ lệch trụ cột hoặc lệch canon

| # | Chỗ (bản sơ đồ) | Vấn đề | Trụ cột | Đề xuất | Chủ sở hữu |
|---|---|---|---|---|---|
| 1 | §7.6 Bút Tháp: «Sổ công đức (thay đổi trực tiếp **Phúc Đức** của nhân vật)» | «Phúc Đức» không có trong canon; Phúc phận (`synthesis.fortune`) là **Tiên Thiên**, không đổi được | T1 | Đổi thành «Sổ Công Quá → Đạo Hạnh (Hậu Thiên)»; Phúc phận giữ nguyên | 05 |
| 2 | §5.6 bảng đạo thống: Tịnh Độ «tăng chỉ số: Công đức, **Phúc phận**» | như trên | T1 | «Công đức, Phúc Khí nhận thêm» | 05 |
| 3 | §5.6: Thanh Vi · Đan Đỉnh «tăng **Nguyên Khí**, Sinh Cơ» | Nguyên Khí gốc (`baseVitality`) là Tiên Thiên; Sinh Cơ là `wx.pct` | T1 | Tách: **trần Nguyên Khí** cố định, tu chỉ tăng **tốc độ hồi** hoặc số lượt dự trữ (Hậu Thiên) — tài liệu 04 chốt | 04 |
| 4 | §4.6 Hoa Cái: «giao lưu −10% (cô độc)» | phạt theo sao ngày sinh, dù nhỏ | T2 △ | Đổi thành «mở chuỗi độc tu riêng; ở một mình ngồi thiền +10%» (hai mặt đều là lợi, khác hướng) | 04 |
| 5 | §3.1 / §11: VIP «mở bay sớm» | nếu bay mở theo cảnh giới (§9.1), mở sớm bằng tiền = mua quyền lợi của cảnh giới | T2, T6 | VIP chỉ mở sớm **hình** gia trì (xem trước), không mở **bay** | 11 |
| 6 | §6.5: VIP 30 lượt AI / ngày | được, nếu chất lượng trả lời không đổi theo VIP | T6 △ | Ghi rõ: VIP chỉ thêm lượt, cùng persona, cùng brief, cùng `checkNeo` | 11 |
| 7 | §7.12: «Bảng Thiên Bảng: xếp hạng tiềm lực ban đầu và tiềm lực đã cải» | «tiềm lực đã cải» dễ hiểu nhầm là Tiên Thiên đổi | T1, T2 | Hai cột: «Tiên Thiên (Tiềm Lực)» và «Đạo Hạnh»; không dùng chữ «tiềm lực đã cải» | 10 |
| 8 | §7.4 Mao Sơn: «thu phục yêu (hư cấu, trong game)» | «thu phục» gần sát phạt mềm | T3 | «Hóa giải» / «dẫn về»: sinh linh lạc lối được đưa về chỗ của nó | 07 |
| 9 | §7.10 Miêu Cương: «Cửa vào lộ âm tà: sức mạnh nhanh» | gắn vùng dân tộc với cửa tà | T6 △ | Cửa vào Tà Lộ là **hang dưới Miêu Cương của yểm sư** (canon §4: Lỗ Ban ở hang), không phải trại Miêu; vu y bà là người can | 03 |
| 10 | §9.1: «ngự kiếm (đã có ở cấp 8 → gộp vào bậc này)» | người chơi cũ đang bay ở cấp 8 | T4 / chuyển đổi | Người chơi đã mở bay giữ quyền bay (không tước); người mới theo cảnh giới | 09 |
| 11 | §5.3 «Sổ đời thực» | đúng hướng; cần chặn mọi thưởng gián tiếp (danh hiệu, khung) | T6 | Không danh hiệu, không khung, không thống kê công khai | 05 |
| 12 | §3 Hồi III: «game "tua" thế giới tới năm đó» | hiện năm dương lịch thật có thể gây sợ | T2, T6 | Án lệ `AL-08`: chỉ hiện can chi | 03 |
| 13 | §6.2 Lạt-ma Đa Kiệt «giọng chờ tham vấn» | đúng | T5, T6 | Giữ; không viết thoại tạm vào bản build | 06 |
| 14 | §4.2 tên «linh căn» | mượn tiểu thuyết (nguồn bậc E) | T5 | Đã đúng cách: luôn kèm gradeVi | — |
| 15 | V2 §2: danh hiệu «Môn Sinh → Học Đồ → Thầy Xem → Đại Sư» | «Đại Sư» là danh xưng dành cho tăng sĩ cao hạ ở nhiều nơi | T6 △ | Đổi bậc cuối thành «Lão Sư» hoặc «Tiên Sinh» (nghề luận mệnh), hoặc gộp vào cảnh giới | 09 |

## 5. Gia trì nguyên tố (`progress.js › WX_GIATRI`, `effects.js`)

| Hành | Tên | Màu | Linh khí | Phán quyết | Ghi chú cho mỹ thuật (phần 13 §5) |
|---|---|---|---|---|---|
| 木 | Thanh Mộc | `#58c46a` | lá non | **Giữ** | lá xoắn đi lên chậm; không thành cánh hoa (để phân biệt với `aura_dao`) |
| 火 | Ly Hỏa | `#ff6a3c` | đốm lửa | **Giữ** | đốm bốc lên, thu nhỏ dần; không thành ngọn lửa liếm thân (gợi thiêu) |
| 土 | Hậu Thổ | `#d9a64a` | bụi vàng | **Giữ** | xoáy thấp sát đất; tốc độ chậm nhất trong 5 hành |
| 金 | Canh Kim | `#f2e6b8` | ánh kim | **Giữ** | lóe ngắn, sắc; không hình lưỡi kiếm |
| 水 | Huyền Thủy | `#4f9cff` | giọt nước | **Giữ** | giọt rơi và loang; ban đêm giảm độ sáng 30% để không chói |

Đối chiếu biến CSS UI (`game.css`): `--wx-moc #4fa463`, `--wx-hoa #e0533f`, `--wx-tho #c99a4a`, `--wx-kim #cfc8b8`, `--wx-thuy #4b7cc7`. **UI và VFX đang dùng hai bộ màu ngũ hành khác nhau.** Đề xuất (phần 13 §6): một bảng **màu ngũ hành chuẩn** có hai sắc độ: «UI» (đặc, đọc chữ được) và «linh khí» (sáng, cho phát sáng), sinh từ cùng một sắc tướng.

## 6. MMO và dữ liệu (`net.js`, `protocol.js`, `worker/quan-room.js`)

| Điểm | Hiện trạng | Trụ cột | Phán quyết |
|---|---|---|---|
| Gửi `robe` (màu Dụng thần) | có | T1 ✓, T6 △ | Màu áo khởi đầu để lộ **hành Dụng thần** cho người khác. Dụng thần một mình không định danh được người; chấp nhận, nhưng ghi trong chính sách riêng tư: «màu Bản Mệnh Y cho thấy hành Dụng thần của bạn». Người chơi đổi áo khác thì hết lộ. |
| Không gửi ngày sinh | đúng | T6 ✓ | **Giữ** |
| `cleanCos` lọc đồ qua danh mục | có | T6 ✓ | **Giữ**; khi đổi tên / bỏ món (§2) cần ánh xạ id cũ → id mới để người đã mua không mất đồ |
| Va chạm người chơi | (cần kiểm) | T3 | phải **tắt** (`VD-T3-17`) |
| Chat | (tài liệu 10) | T2, T6 | bộ lọc từ «căn rác», «phế căn»… (phần 08 §2) |

## 7. Bảng hành động tổng hợp

| Ưu tiên | Việc | Số mục | Chủ sở hữu |
|---|---|---|---|
| **P0** | Tàng Y Các: `quan_sen`, `aura_sen`, `dai_sen`, `phap_luan`, `y_tu` | 5 | 11 |
| **P0** | Câu dẫn điểm thấp ở Bàn Thầy; lời Hợp Hôn; lời Thái Tuế Điện | 3 | 03, 12 |
| **P1** | Lời xăm, quẻ, lịch, án khách, Vận Mệnh Các theo khung T2 | 5 | 03, 12 |
| **P1** | Sửa lệch canon trong bản sơ đồ (#1, #2, #3, #7) | 4 | 04, 05 |
| **P1** | Một bảng màu ngũ hành chuẩn UI + VFX | 1 | 12 |
| **P2** | Sửa lời mô tả 7 món; ràng buộc VFX 5 món | 12 | 11, 12 |

Mọi mục P0 phải xong **trước khi bật thanh toán thật** (VNPay / Stripe / Apple IAP), vì sau khi người chơi đã trả tiền thật cho món thiêng thì việc rút món sẽ khó và gây tổn thương cho cả hai phía.
