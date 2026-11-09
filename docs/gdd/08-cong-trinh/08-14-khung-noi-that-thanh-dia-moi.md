# 08-14 · Khung nội thất cho công trình ở mười hai thánh địa mới

> Tài liệu 07 cấp mã `BLD-<region>-xx` và quyết bố cục vùng. Phần này cho **khung nội thất** từng công trình chính đã nêu trong tài liệu tổng §7: hạng, bộ mô-đun, chương trình khoang (kích thước theo lưới gian 3,2 m), trạm và engine, kỹ thuật đặc biệt. Khi tài liệu 07 cấp mã, mỗi dòng ở đây thành một `INT-<region>-<tên>` theo đúng quy trình 08-02 / 08-03 / 08-12. Tên công trình dưới đây là tên mô tả, **chưa phải mã**.

**Luật cho người dựng vùng mới** (bổ sung tài liệu 07):

1. Prompt Meshy theo 08-02 §5.5; duyệt lát cắt **trước** khi refine.
2. Mỗi công trình đặt vào vùng phải có dòng trong bảng đăng ký hạng (08-01 §10) **trước** khi đặt.
3. Không đặt công trình nào trong tầm đi bộ (08-01 §1.1) mà chưa có khung nội thất ở đây hoặc ở tài liệu 07.
4. Số lượng theo tài liệu tổng §13.2: mỗi vùng A 1–2, B 4–6, C 10–20, còn lại D / E.

Ký hiệu khoang: `R × S` (m) theo lưới gian, «g» = gian 3,2 m.

---

## 1. Long Hổ Sơn — Tự Hán Thiên Sư Phủ (`longho`) · bộ GNA (bảng `longho`)

Phủ đệ (không phải cung điện): trục Bắc – Nam qua nhiều lớp sân, tường trắng mã đầu tường.

| Công trình | Hạng | Khoang (R × S, cao) | Trạm · engine | Kỹ thuật |
|---|---|---|---|---|
| Phủ môn (biển «嗣漢天師府») | B | lối giữa 4 × 9,6 · 2 phòng môn lại 6,4 × 6,4 | `longho_phumon` · đăng ký vào phủ (nhiệm vụ `CQ-zhengyi-*`) | cánh `congnang` + ngách; lịch `son_mon` |
| Nghi môn ba gian | D | đi qua 3 cửa vòm | đọc biển | ba ô cửa `vom` |
| **Đại đường** (nơi Thiên Sư thụ lục) | **A** | sảnh 5g × 3g = 16 × 9,6, cao 7 · hậu đường 16 × 6,4 · 2 phòng hồi 6,4 × 9,6 | `longho_thuluc` · thụ lục từng cấp (`talisman-data`, `schools-data › getSchool('zhengyi')`) · `longho_phu` · kết phù (MG tài liệu 09, ký tự hư cấu) · `longho_baidau` · bái Đẩu (`talisman-data › ritual`, chỉ diễn giải) | NPC `truong_thiensu`; ghế Thiên Sư (BAC-43 đổi bảng), ấn lớn trên án (đạo cụ) |
| Tam tỉnh đường | B | 3 gian 9,6 × 6,4 | `longho_tamtinh` · ghi việc ngày vào Sổ Công Quá (`remedy-fate › CONG_QUA`) | tên gợi «ngô nhật tam tỉnh ngô thân» |
| Tư đệ Thiên Sư (hậu viện) | C | phòng khách 9,6 × 6,4 · thư phòng 6,4 × 6,4 · vườn | trà với Thiên Sư (cảnh) | khoang khóa: phòng ngủ (nhìn qua song) |
| Lang vũ hai bên | B | dải 3,2 × 32 mỗi bên, 10 tĩnh thất 3,2 × 4,8 | 1 tĩnh thất mở cho người chơi: `longho_tinhthat` · tĩnh tọa (`cultivation-data`) | 9 tĩnh thất còn lại: 3 khóa (có đạo sĩ), 6 mở (đồ khác nhau) |
| Phòng phù | B | 6,4 × 6,4 | `longho_phong_phu` · công thức GNA-R3 | đèn `dendau` tập trung bàn phù |
| Thần Tiêu phân viện (lôi pháp) | B | điện 9,6 × 9,6 cao 8 | đọc lôi pháp (chỉ văn bản, `schools-data › shenxiao`) | đèn trần xanh lóe theo nhịp sấm (bão) |
| Nhà dân trấn Thượng Thanh (10–15) | C | dùng MOD-DAN + GNA, kiểu nhà Huy | án dân trấn (`cases.js`) | tường mã đầu: chái riêng |
| Bè tre trên sông Lô Khê | D | boong 3,2 × 9,6 | ngồi bè (cảnh) | phương tiện có bến → D |

**Ánh sáng / âm**: phủ đệ tối hơn cung điện (tường trắng, cửa bức bàn giấy); âm `dien_vua`; nhạc trống, tù và (tài liệu tổng §12).

---

## 2. Võ Đang Huyền Nhạc (`vodang`) · bộ BAC (bảng `vodang`)

Thần đạo leo núi; mỗi cung là một bậc tu. Đặc thù: **Kim Điện** đồng mạ vàng toàn khối, rất nhỏ; **Nam Nham cung** treo trên vách.

| Công trình | Hạng | Khoang | Trạm · engine | Kỹ thuật |
|---|---|---|---|---|
| Huyền Nhạc môn (bài phường đá 4 cột 3 gian) | D | — | đọc biển | như INT-HT-PAIFANG (nền đi được) |
| Ngộ Chân cung | B | sân + điện 3g × 2g | ải tâm 1: tĩnh tọa ngắn (`cultivation-data`) | |
| **Tử Tiêu cung** (trùng diêm, ba tầng nền) | **A** | đại điện 7g × 4g = 22,4 × 12,8, cao 11 (thông tầng) · hậu điện 22,4 × 9,6 · 2 phối điện 9,6 × 9,6 | `vodang_noidan` · bốn bậc nội đan (canon: 炼精化气 … 炼虚合道) với cảnh báo · `vodang_thaicuc` · Thái Cực (MG tài liệu 09) · `vodang_tinhtoa` | NPC `huyen_hu`; ba tầng nền **mỗi tầng một `addPlatform`** (bài học từ 08-10 §1.2) |
| **Nam Nham cung** (treo vách) | **A** | hành lang bám vách 3,2 × 48 (một bên vực, lan can) · điện đá khoét núi 12,8 × 9,6 · «Long đầu hương» (thanh đá chìa ra vực) | `vodang_namnham` · ải tâm «sợ độ cao»: đi ra Long đầu hương (đi được, lan can thấp — **không rơi**, va chạm chặn mép) | khoang điện nửa trong núi: sau tường là địa hình — lót tường đá không cần vỏ |
| Thái Hòa cung | B | điện 3g × 3g | ải tâm 3 | |
| **Kim Điện** (đồng) | **A** | **một khoang 6,4 × 4,8, cao 5** (nhỏ đúng nguyên mẫu) | `vodang_kimdien` · bái Chân Vũ, kết chuỗi | khoang < 5 m → camera **BỔ DỌC**; vật liệu toàn kim loại đồng `#C9A23A`; bước chân `dong`; vang `phong_nho` nhưng kim loại (ướt 0,25, RT60 1,4) |
| Lò đan (Đan Đỉnh) | B | điện 9,6 × 9,6 + sân lò | NPC `dan_dinh` · hái vị thuốc «Đắc Cứu» (`tcm`) | lò sáng `bep`, khói |
| Bậc ngàn bậc | E | — | — | mỗi bậc 0,4 / 0,6, chiếu nghỉ mỗi 40 bậc; trạm đi nhanh ở chân và đỉnh |
| Tường đỏ «tử thành» theo địa hình | E | — | — | va chạm theo hình; không có lối đi trên tường |

---

## 3. Chung Nam Toàn Chân (`chungnam`) · bộ BAC (bảng `chungnam`)

Tùng lâm phương Bắc nhiều lớp sân.

| Công trình | Hạng | Khoang | Trạm · engine | Kỹ thuật |
|---|---|---|---|---|
| Sơn môn ba cổng vòm | B | 3 vòm + 2 phòng gác | ghi danh vân thủy | |
| Cầu Oa Phong (đồng tiền treo dưới cầu) | D | mặt cầu | `chungnam_xu` · «ném xu» vào lỗ đồng tiền — **không cược, không trả tiền game**: chỉ là thử tập trung (MG nhỏ) | mặt cầu đi được (bài học INT-CAU-HUYENHA) |
| Linh Quan điện | B | 3g × 2g | | |
| **Ngọc Hoàng điện** | **A** | 5g × 3g, cao 9 · 2 phòng hồi | `chungnam_ngochoang` · khoa nghi Linh Bảo (chỉ đọc, `schools-data › lingbao`) | |
| **Lão Luật đường** | B | giảng đường 16 × 9,6 + bục giới | `chungnam_gioi` · thử thách giới luật (ăn chay, giữ khẩu) — `daozang-data › daozangByBu` mục giới luật | NPC `khau_daotruong` |
| Khâu Tổ điện | B | 3g × 2g | | |
| Tam Thanh các (hai tầng, tàng kinh) | B | tầng 1 điện 12,8 × 9,6 · tầng 2 tàng kinh 12,8 × 9,6 | `chungnam_kinh` · tàng kinh mở dần (`daozang-data`) | thang lầu dốc trong hồi |
| Trai đường | B | 22,4 × 9,6: 6 bàn dài, bếp sau 9,6 × 6,4 | `chungnam_trai` · ăn chay giờ Ngọ — buff nhỏ (tài liệu 09) | đèn bếp; âm bát đũa |
| Vân thủy đường (đạo sĩ du phương) | C | phòng chung 12,8 × 6,4 + 6 giường | nhận nhiệm vụ vân thủy (`SQ-*` khắp bản đồ) | |
| Giới đàn (đàn ba cấp lộ thiên) | D | đứng lên đàn được | | nền từng cấp |
| Động tu, lều cỏ ẩn sĩ (3–5) | C | 1 khoang 4,8 × 4,8 mỗi động | ẩn sĩ kể chuyện | động: vang `hang_da`; không vỏ Meshy (khoét địa hình — tài liệu 13 về khoét địa hình) |

---

## 4. Mao Sơn Thượng Thanh (`maoshan`) · bộ GNA (bảng `maoshan`)

Cung trên đỉnh, nhiều sân nhỏ lệch tầng, hành lang có mái nối điện, giếng trời; tượng Lão Tử đồng lộ thiên.

| Công trình | Hạng | Khoang | Trạm · engine | Kỹ thuật |
|---|---|---|---|---|
| **Cửu Tiêu Vạn Phúc cung — điện chính** | **A** | điện 5g × 3g + giếng trời trước (GNA-R2) + 2 điện lệch tầng nối hành lang | `maoshan_tontu` · tồn tư (quán tưởng, chỉ diễn giải) · `maoshan_an` · **án trúng tà**: chẩn đoán (lá số + phong thủy nhà + giờ sinh) **trước**, phù sau (tài liệu tổng §7.4) — `amta-data › ETHICS` (tự nguyện bật), `anti-manipulation-data` | NPC `maoshan_daonhan`; sân lệch tầng: mỗi sân một `addPlatform`, bậc nối ≤ 0,41 |
| Hành lang du lang nối điện | D/E | GNA-45 nối tiếp | ngồi lan can | có mái, đi được, chiếu nghỉ ở chỗ đổi cao |
| Lư Sơn phân viện (Tam Nãi, thu kinh) | B | điện 3g × 2g | `maoshan_thukinh` · thu kinh cho trẻ (cảnh nhẹ nhàng, giải thích tâm lý) | |
| Phòng phù | B | GNA-R3 | kết phù (ký tự hư cấu) | |
| Tượng Lão Tử đồng lộ thiên | D | bệ đi quanh, bậc lên bệ | đọc «Đạo Đức Kinh» trích (`remedy-fate › DAO_JIA`) | bệ `addPlatform`, tượng chặn |
| Đình trà trên đồi chè | D | đình 6,4 × 6,4 | uống trà (`tea-therapy`) | |
| Nhà dân dưới núi (10) | C | GNA + DAN | án «nhà không yên» (`fs-cure › SHA_LIST` trước, phù sau) | |

---

## 5. Yên Tử Trúc Lâm (`yentu`) · bộ VIE (bảng `yentu`)

Đường hành hương leo núi qua các chùa; Chùa Đồng trên đỉnh.

| Công trình | Hạng | Khoang | Trạm · engine | Kỹ thuật |
|---|---|---|---|---|
| Chùa Giải Oan (bên suối) | B | điện 3g × 2g + nhà Tổ 2g × 2g | `yentu_giaioan` · thả tâm sự xuống suối (tương tác lặng — `remedy-fate › GAI_XIN` bước 觉 → 停) | âm suối lớn |
| Vườn tháp Huệ Quang | D | đi giữa ~30 tháp mộ đặc | đọc bia tháp | tháp đặc (08-01 §1.4) |
| **Chùa Hoa Yên** | **A** | thượng điện VIE-R1 (3g × 2 vì) · tiền đường 3g × 2g · nhà Tổ 3g × 2g · tăng phòng 4 phòng 3,2 × 4,8 · sân rộng có cây đại | `yentu_thien` · thiền định (MG tài liệu 09; `spiritual-fs › spiritualPractice` theo hành Dụng) · `yentu_congan` · công án (AI dẫn, không phán mệnh) | NPC `truclam_thiensu`; không nói số mệnh (tài liệu tổng §7.5) |
| Chùa Một Mái (nép vách) | B | điện nửa trong núi 6,4 × 4,8 | `yentu_motmai` · ngồi lặng | lót vách đá như Nam Nham cung |
| **Chùa Đồng** (đỉnh) | **A** (nhỏ) | **một khoang 4,8 × 3,2** | `yentu_chuadong` · lễ ở đỉnh trong biển mây (kết hành hương) | camera BỔ DỌC; kim loại đồng; sương mây quanh (sprite) |
| Đường tùng, bậc đá rêu | E | — | — | bậc 0,4; chiếu nghỉ có ghế đá (D) |

---

## 6. Bút Tháp Tịnh Độ (`buttap`) · bộ VIE (bảng `buttap`)

«Nội công ngoại quốc»: điện chính chữ Công, bao ngoài dải vũ khép kín chữ Quốc.

| Công trình | Hạng | Khoang | Trạm · engine | Kỹ thuật |
|---|---|---|---|---|
| Tam quan | B | 3 cửa + gác trên (gác chuông nhỏ) | | |
| Gác chuông | B | VIE-R3 | `buttap_chuong` · đại hồng chung (`ix` vật dùng chung) | |
| Tiền đường · Thiêu hương · **Thượng điện** (chữ Công) | **A** | ba khoang nối thẳng: 5g × 2g · 3g × 1g · 5g × 2g; thượng điện thờ A Di Đà tam tôn (VIE-20) | `buttap_niemphat` · niệm Phật · `buttap_samhoi` · sám hối (`remedy-fate › CHAN_HUI`, 5 pháp) · `buttap_congduc` · sổ công đức (`CONG_QUA`, `TEN_THIEN`) | NPC `dieu_am`; ba khoang là cửa nhìn `open` liên tiếp — portal culling theo chuỗi |
| **Dải vũ** (hành lang La Hán bao quanh) | B | vòng ~ 120 m × 3,2 (VIE-R2 lặp) | đọc từng La Hán (18 biến thể) | một khoang dài chia 8 đoạn (khoang ≤ 16 m mỗi đoạn để cull) |
| Cầu đá Bút Tháp | D | mặt cầu lan can chạm (VIE-42) | | |
| **Tòa Cửu phẩm liên hoa** | B | điện bát giác Ø 12,8 quanh tòa tháp gỗ VIE-41 | `buttap_cuupham` · quay tầng theo công đức đã tích (tài liệu tổng §7.6) | tòa quay = đạo cụ động lớn (`fadeable` cho camera) |
| Tháp Báo Nghiêm | D | tháp đặc + khám | | |
| Hồ sen, giếng làng, đình làng | D | | thả đèn hoa đăng (`EV-vulan-*`) | |
| Nhà dân làng (10–15) | C | MOD-DAN + VIE (mái ngói mũi hài) | án làng | |

---

## 7. Tạng Địa Tuyết Vực (`tangdia`) · bộ TAN — **chờ tham vấn**

Chỉ dựng sau tham vấn (canon §3, tài liệu tổng §14). Khung dưới đây là đề xuất để tham vấn góp ý.

| Công trình | Hạng | Khoang | Trạm · engine | Kỹ thuật |
|---|---|---|---|---|
| **Điện trung tâm mạn-đà-la** (theo Samye) | **A** | điện tụng TAN-R1 6g × 5g · 4 điện châu lục 9,6 × 9,6 bốn phương · sân tròn | `tangdia_mandala` · vẽ mạn-đà-la cát rồi xóa (phần thưởng khi **xóa**) — TAN-18 · `tangdia_trichu` · trì chú Chuẩn Đề (`remedy-fate › ZHUNTI`, chỉ văn bản) | NPC `lama_dakiet`; bố cục đối xứng tâm: cửa nhìn bốn phía |
| Hành lang bánh xe kinh quanh điện | D | vòng 3,2 × ~140 m | quay bánh xe (đi chiều kim đồng hồ) | TAN-R2 |
| Bốn bảo tháp chorten bốn góc | D | tháp đặc | | |
| Tăng xá (8–12) | C | phòng 4,8 × 4,8, bếp đất, giường thấp | trà bơ (tương tác nhỏ) | tường thang dày → lót TAN-03 |
| Tàng kinh các | B | 9,6 × 9,6 tủ kinh ô (TAN-30) | `tangdia_kinh` · đọc kinh lá rời (`JING_ZHOU › 楞嚴咒` — văn bản) | |
| Đèo cờ gió, mani thạch | D | | đặt đá mani | |

---

## 8. Văn Miếu Quốc Tử Giám (`vanmieu`) · bộ NHO

Năm lớp sân theo trục.

| Công trình | Hạng | Khoang | Trạm · engine | Kỹ thuật |
|---|---|---|---|---|
| Văn Miếu môn, Đại Trung môn | B / E | cổng có phòng (môn lại) / cổng trơn | | |
| **Khuê Văn Các** (gác bốn cửa sổ tròn) | B | tầng trên 6,4 × 6,4, bốn NHO-11 | `vanmieu_khue` · ngắm sao Khuê (`ershibaxiu`) | gác trên bốn trụ gạch: thang trong một trụ |
| Thiên Quang Tỉnh + 82 bia Tiến sĩ | D | lối giữa hai dãy nhà bia | `vanmieu_bia` · đọc bia; **bia người chơi** (NHO-22, tên khắc theo máy chủ) | nhà bia NHO-23 lặp; bia người chơi do tài liệu 10 |
| Đại Thành môn | B | cổng 3 gian có phòng | | |
| **Đại bái đường + Đại Thành điện** | **A** | bái đường 9g × 2g · điện 9g × 3g (thông sau bái đường) | `vanmieu_lethanh` · lễ tiên sư · `vanmieu_congqua` · công quá cách kiểu Liễu Phàm (`remedy-fate › LIAOFAN_STORY`, `remedy › LIAOFAN`) | NPC `te_tuu`; bài vị hư cấu |
| **Thái Học (Quốc Tử Giám)** | **A** | giảng đường NHO-R2 lớn 9g × 3g · trường thi (lều chõng NHO-33 × 20 trong sân) · thư viện NHO-R1 | `vanmieu_khoacu` · khoa cử: hương thí → hội thí → đình thí (kiến thức Tứ Trụ / cổ thư `library-data`) | sân thi có lịch thi theo mùa (tài liệu 10) |
| Hồ Văn, cây đa | D | | | |

---

## 9. Phong Đô Quỷ Thành (`phongdo`) · bộ AMT

Đường **một chiều xuống dốc** qua các quan; lối ra duy nhất là đi lên ở đáy.

| Công trình | Hạng | Khoang | Trạm · engine | Kỹ thuật |
|---|---|---|---|---|
| Quỷ Môn Quan | B | cổng + 2 phòng quỷ sai | đăng ký vào Âm ty (chỉ khi theo lộ Tà Lộ hoặc nhiệm vụ) | cửa **một chiều**: `luoi` lịch `dem`; đi ngược không chặn bằng tường mà bằng cảnh (NPC nhắc) — luật không nhốt: lối thoát luôn mở |
| Đường Hoàng Tuyền | E | lối đá có khe hoa bỉ ngạn | | dốc chia bậc 0,4 |
| Cầu Nại Hà (ba cầu thiện / bình / ác) | D | 3 cầu AMT-29 song song | cầu theo nghiệp tích của người chơi (`remedy-fate › YEGUO`) — chỉ chọn lối, không trừng phạt | ba mặt cầu đi được, lan can |
| Vọng Hương đài | D | đài có lan can | nhìn «quê nhà» (Huyền Thành từ xa) | |
| **Thập điện** (10 điện xoắn xuống) | **A** (cụm) | 10 điện 9,6 × 9,6 nối thang xuống, mỗi điện cao hơn điện sau 4 m | `phongdo_dien_<n>` · mỗi điện một nhóm nghiệp; `phongdo_sonnghiep` · đọc sổ nghiệp (`meritLedger`) với NPC `phan_quan` | 10 khoang `sealed`, mỗi khoang chỉ thấy khoang kế (portal culling rất hiệu quả); âm `hang_da` |
| **Điện Địa Tạng** (đáy) | **A** | 16 × 12,8 đài sen AMT-38 | `phongdo_diatang` · sám hối – trả nghiệp (`CHAN_HUI`, chuỗi `TL-*`), danh hiệu **Hồi Đầu** | NPC `diatang_su`; lối ra đi **lên** (thang dài sáng dần — ánh sáng tăng theo từng chiếu nghỉ) |
| Quán canh Mạnh Bà | D | bàn AMT-28 | cảnh (không bắt uống) | |

---

## 10. Miêu Cương Cổ Trại (`mieucuong`) · bộ MIE

Trại dốc ven sông, nhà sàn treo, cầu phong vũ, trống lâu, lò cổ trong hang (phản diện).

| Công trình | Hạng | Khoang | Trạm · engine | Kỹ thuật |
|---|---|---|---|---|
| **Nhà vu y bà A Mậu** | **A** (nơi NPC dẫn đạo) | nhà sàn: gian hỏa đường 9,6 × 6,4 · buồng thuốc 6,4 × 4,8 · hiên sàn | `mieu_vuy` · vu y chính đạo: chữa theo ngũ hành (`tcm › analyzeHealth` — **không chẩn bệnh thật**, chỉ minh họa trong game, canon T6) · `mieu_chuyen` · chuyện cổ (truyền thuyết, không hướng dẫn) | NPC `vu_y_amau`; sàn treo trên cột: gầm có nước — va chạm cột |
| Nhà sàn treo (12–18) | C | MIE: gian bếp giữa + 1–2 buồng | án dân trại | cột chân cắm nước; thang MIE-37 |
| **Cầu phong vũ** (cầu có mái nhiều tầng tháp) | B | mặt cầu có ghế dọc hai bên 3,2 × 48 · tầng tháp giữa có phòng 6,4 × 6,4 | nơi hát đối (tài liệu 10) | khoang dài chia đoạn |
| **Trống lâu** (nhiều tầng mái) | B | sàn trệt 9,6 × 9,6 có hỏa đường + thang lên tầng trống | `mieu_trong` · trống đồng (`ix`) | thang xoắn gỗ (bậc MIE) |
| Lò cổ trong hang | B | hang 12,8 × 9,6 + bàn đá (MIE-46) | cảnh cốt truyện phản diện `lo_ban_su` (tài liệu 03) | hang khoét địa hình; `hang_da`; đuốc |
| Xưởng bạc, khung dệt | C | | xem làm bạc, dệt sáp | đồ nối Tàng Y Các (bộ Thủy / Mộc) |

---

## 11. Côn Lôn Thiên Trì (`conlon`) — cần bộ mô-đun riêng (chưa có)

Quần đảo lơ lửng, lưu ly vàng và trắng ngọc. Bảy bộ hiện có **không** đủ: cần bộ **MOD-CON** (mới, mở khi tài liệu 07 chốt Côn Lôn; vẫn trong không gian tên 08). Khung:

| Công trình | Hạng | Khoang | Trạm |
|---|---|---|---|
| **Điện Dao Trì** | A | điện tròn Ø 25,6 cao 12, vòng cột ngọc | cảnh vĩ thanh `MQ-E-*` |
| Thiên Mệnh Bàn giữa hồ | D | la bàn khổng lồ (Thiên Bàn Sơn Môn hiện nay) đi được trên mặt | «quy nhất» |
| Cầu mây nối đảo | E | mặt cầu đi được, lan can mây (va chạm thật) | — |
| Đình đào tiên | D | | |

---

## 12. Am Vân Cốc (`vancoc`, núi sau Hậu Sơn) · bộ VIE + DAN

| Công trình | Hạng | Khoang | Trạm · engine | Kỹ thuật |
|---|---|---|---|---|
| **Am tranh trên vách** | C nhưng **chuẩn cảnh hạng A** (ánh sáng, âm, camera) | một gian 6,4 × 4,8: bếp trà, chiếu, kệ sách, cửa sổ nhìn vực | `vancoc_tra` · ngồi trà với Vân Cốc (cảnh mẫu tài liệu tổng §6.3) · `vancoc_menhdo` · lập Mệnh Đồ (`gaimenh › gaimenhPlan`) · `vancoc_congqua` · sổ công quá Liễu Phàm | NPC `van_coc`; khoang nhỏ → BỔ DỌC, nhưng cảnh hội thoại dùng neo `CA__` đặt sát cửa sổ; mưa trên mái tranh (âm) |
| Lối mòn từ Hậu Sơn lên am | E | bậc đá, đoạn ván treo vách | | đoạn ván treo: lan can, không rơi |

---

## 13. Ước lượng sơ bộ theo vùng (để tài liệu 07 / 13 lập lịch)

Tính theo đơn giá rút từ công trình đang có: A ≈ 15–25 ngày, B ≈ 4–8, C ≈ 1,5–3 (có công thức kiểu), D ≈ 0,5–2, E ≈ 0,5–3.

| Vùng | A | B | C | D / E | Ngày người (nội thất, không gồm vỏ Meshy) |
|---|---|---|---|---|---|
| Long Hổ | 1 | 5 | 12 | 6 | 85 |
| Võ Đang | 3 (Tử Tiêu, Nam Nham, Kim Điện) | 4 | 6 | 8 | 110 |
| Chung Nam | 1 | 6 | 8 | 4 | 80 |
| Mao Sơn | 1 | 2 | 10 | 5 | 60 |
| Yên Tử | 2 | 2 | 4 | 6 | 65 |
| Bút Tháp | 1 (cụm 3 khoang) | 4 | 12 | 8 | 85 |
| Tạng Địa | 1 | 1 | 10 | 6 | 70 (sau tham vấn) |
| Văn Miếu | 2 | 4 | 4 | 6 | 90 |
| Phong Đô | 2 (Thập điện, Địa Tạng) | 1 | 2 | 6 | 80 |
| Miêu Cương | 1 | 3 | 15 | 4 | 75 |
| Côn Lôn | 1 | — | — | 4 | 45 + bộ MOD-CON 15 |
| Vân Cốc | — | — | 1 (chuẩn A) | 2 | 12 |
| **Cộng** | | | | | **≈ 870 ngày người** |
