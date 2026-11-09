# 08-17 · Nội thất chủ đề — chi tiết từng khoang của các điện «dạy bằng không gian»

> Sáu công trình ở vùng dùng **bố cục không gian để dạy một hệ tri thức** của app: Bát Cách Lang (cách cục Tử Bình), Quan Tinh Đài (12 cung Tử Vi), Thư Lâu (8 tầng thư), Cửu Cung Lâu + Cửu Vận Lâu (Huyền Không, Tam Nguyên), Cửu Diệu Lâu + Bắc Đẩu Lâu (tinh tú), Trạch Nhật Đường (12 trực, 24 tiết khí, 28 tú). Phần này cho **nội dung từng khoang** — mọi dữ kiện chuyên môn **đọc từ engine** (trụ cột T5: game nói đúng như trang chính), tài liệu chỉ quy định vật gì đặt ở đâu và lấy dữ liệu từ trường nào.

---

## 1. Bát Cách Lang — Tử Bình Phong (INT-TB-CHINHDIEN, khoang `tb.cach.1…8`)

### 1.1 Khuôn chung một điện cách (12,5 × ~20 m, cao 10 m)

```
 (sau)  ┌──────────────── 12,5 ────────────────┐
        │  [BIA CÁCH] tên cách · Hán · Hán Việt│   ← NHO-35 hoành phi + MOD-BAC-53 bia
        │                                       │
        │  ┌──────┐   ┌──────┐   ┌──────┐       │   ← ba án mẫu (bàn đọc NHO-46):
        │  │ án 1 │   │ án 2 │   │ án 3 │       │      thành cách · phá cách · có cứu
        │  └──────┘   └──────┘   └──────┘       │
        │                                       │
        │  [VÁCH DỤNG – HỶ – KỴ] ba cột màu     │   ← canvas từ PATTERN_PREF
        │                                       │
        │  ○ ○  bồ đoàn đọc                      │
 (lối)  └──────────[ ô cửa ra lối dọc 4 m ]─────┘
```

| Thành phần | Dữ liệu | Nguồn |
|---|---|---|
| Bia cách | tên cách (chữ Hán + Hán Việt) và câu tóm tắt | `pattern.js › PATTERN_VI` |
| Vách dụng – hỷ – kỵ | ba cột: nhóm thần làm **dụng**, **hỷ**, **kỵ** cho cách (Quan Sát / Tài / Ấn / Thực Thương / Tỷ Kiếp) | `pattern.js › PATTERN_PREF[<cách>]` (`yong`, `xi`, `ji`), nhãn `pattern-quality › GROUP_VI` |
| Thuận / nghịch dụng | dải chữ trên vách: cách thần là cát thần (thuận dưỡng) hay hung thần (nghịch chế) | `computePattern(...)` trả `shunNi`, `note` (như `halls.js › buildCachCuc` đang dùng) |
| Ba án mẫu | ba lá số **NPC** tìm bằng cách quét hạt giống như `buildCachCuc` (`makeNpc('tbcach:<cách>:<i>')`) đến khi được: (1) cách thành, (2) cách phá, (3) phá mà có cứu — theo `pattern-quality › patternQuality(R).quality` (Thuận Thiên / Nghịch Thiên / Đắc Cứu — canon §5) | `pattern-quality › patternQuality`, `GE_RULES` |
| Ánh sáng | màu nhóm của cách thần (quy ước 08-10 §3.2) cường độ 0,8; ba án mẫu có đèn bàn riêng | — |

Người chơi đứng trước án mẫu: bảng tứ trụ, cách thần đánh dấu, giải thích **vì sao thành / phá / có cứu** — lấy nguyên văn chuỗi giải thích engine trả (không viết lời mới).

### 1.2 Tám điện

| Khoang | Cách | Nhóm cách thần | Màu đèn (quy ước) | Ghi chú dựng |
|---|---|---|---|---|
| `tb.cach.1` | 正官 Chính Quan | Quan Sát | trắng bạc | điện đầu từ phía Lão Quân Điện; hoành phi lớn nhất (mở đầu lang) |
| `tb.cach.2` | 七殺 Thất Sát | Quan Sát | trắng bạc lạnh, tương phản mạnh | cùng nhóm với điện 1 — đặt cạnh để so «chính / thiên» |
| `tb.cach.3` | 正財 Chính Tài | Tài | vàng ấm | |
| `tb.cach.4` | 偏財 Thiên Tài | Tài | vàng ấm, đèn lồng nhiều hơn (động) | |
| `tb.cach.5` | 正印 Chính Ấn | Ấn | lam dịu | kệ sách thêm (Ấn = học) |
| `tb.cach.6` | 偏印 Thiên Ấn | Ấn | lam tím | |
| `tb.cach.7` | 食神 Thực Thần | Thực Thương | đỏ cam dịu | bàn trà (Thực = hưởng thụ) |
| `tb.cach.8` | 傷官 Thương Quan | Thực Thương | đỏ cam gắt | điện cuối, nối Cách Cục Đường |

Thứ tự theo `halls.js › GE_GODS` (cũng là thứ tự đáp án trong án sảnh nghề) để người chơi đã giải án Cách Cục nhận ra.

### 1.3 Trạm

`tb_cach_1` … `tb_cach_8` — một trạm mỗi điện, `kind: 'read'`, hành động «Học cách …»: mở bảng ba án mẫu. Hoàn tất cả tám → cờ `tb.batcach` mở **án khó** ở Cách Cục Đường (`tb_ankho`).

---

## 2. Quan Tinh Đài — mười hai cung (INT-TT-QUANTINH, khoang `qt.cung.<chi>`)

### 2.1 Vị trí cố định của mười hai chi (quy ước bàn Tử Vi)

```
 ┌──────┬──────┬──────┬──────┐
 │  Tỵ  │ Ngọ  │ Mùi  │ Thân │
 ├──────┼──────┴──────┼──────┤
 │ Thìn │   THIÊN     │ Dậu  │
 ├──────┤    BÀN      ├──────┤
 │ Mão  │             │ Tuất │
 ├──────┼──────┬──────┼──────┤
 │ Dần  │ Sửu  │  Tý  │ Hợi  │
 └──────┴──────┴──[cửa]┴─────┘
```

Bố cục theo **bàn Tử Vi** (Ngọ ở trên), không theo phương thật; biển ở cửa đài ghi rõ «Đài xây theo bàn số, không theo la bàn».

### 2.2 Phần cố định của mỗi ô (không phụ thuộc người chơi)

| Ô | Hành của chi | Con giáp (phù điêu) | Tháng (âm lịch, kiến) | Giờ | Màu nền ô |
|---|---|---|---|---|---|
| Tý | Thủy | Chuột | tháng 11 | 23–1 | lam đậm |
| Sửu | Thổ | Trâu | tháng 12 | 1–3 | vàng đất |
| Dần | Mộc | Hổ | tháng Giêng | 3–5 | lục |
| Mão | Mộc | Mèo (Việt) / Thỏ | tháng 2 | 5–7 | lục nhạt |
| Thìn | Thổ | Rồng | tháng 3 | 7–9 | vàng đất |
| Tỵ | Hỏa | Rắn | tháng 4 | 9–11 | đỏ cam |
| Ngọ | Hỏa | Ngựa | tháng 5 | 11–13 | đỏ |
| Mùi | Thổ | Dê | tháng 6 | 13–15 | vàng đất |
| Thân | Kim | Khỉ | tháng 7 | 15–17 | trắng |
| Dậu | Kim | Gà | tháng 8 | 17–19 | trắng bạc |
| Tuất | Thổ | Chó | tháng 9 | 19–21 | vàng đất |
| Hợi | Thủy | Lợn | tháng 10 | 21–23 | lam |

Ô của **giờ hiện tại** có đèn sàn sáng nhẹ (đồng hồ sống của đài).

### 2.3 Phần động (khi người chơi đã có lá số)

| Thành phần | Dữ liệu | Nguồn |
|---|---|---|
| Biển tên cung | cung của lá số người chơi đóng ở chi này (Mệnh, Huynh Đệ, Phu Thê…) | `ziwei › computeZiwei(...)`, `PALACES` |
| Khám sao | chính tinh ở cung: tên Hán + Việt; phụ tinh hàng nhỏ dưới | `ziwei › STAR_VI`; tên chính tinh như `halls.js › ZW_MAIN` |
| Đèn trần «sao» | cường độ theo **độ sáng** sao ở chi đó (miếu → hãm) | `ziwei-brightness › BRIGHTNESS` |
| Tam phương tứ chính | đứng trong ô X: ba ô kia (tam hợp + xung chiếu) sáng theo | `ziwei-sanfang › sanfangSizheng`, `TRINE`, `OPP` |
| Tứ hóa năm sinh | dải lụa bốn màu (Lộc, Quyền, Khoa, Kỵ) buộc ở ô có sao hóa | `ziwei › computeSihua` |
| Lời đọc cung | tóm tắt ngắn khi đứng giữa ô | `ziwei-sanfang › analyzePalaceSanfang`, `ziweiCoreReading` |

Chưa có lá số: biển ghi chi, con giáp; lời «An sao ở Sảnh Tử Vi để thấy cung của mình».

### 2.4 Thiên Bàn (4 ô giữa)

Đẩu Mẫu Điện (tượng `deity_doumu` chuyển từ phòng cũ) ở nửa sau; nửa trước là **bàn an sao lớn**: mô hình bàn số Tử Vi 3,2 × 3,2 m đặt nằm, người chơi bấm ô nào thì ô lớn tương ứng của đài sáng (liên kết hai tỉ lệ). Án khó Tử Vi (`qt_ankho`) đặt ở đây.

### 2.5 Mặt đài (y + 6,8)

| Vật | Dữ liệu |
|---|---|
| 28 cọc đá quanh lan can, mỗi cọc một tú | `ershibaxiu › XIU_TABLE`; tú trực hôm nay (`xiuDay`) đội đèn |
| Hỗn thiên nghi | đạo cụ anh hùng `prop_armillary` |
| Bảng Thất Chính Tứ Dư | vị trí Nhật, Nguyệt, Ngũ tinh, La Hầu, Kế Đô… đêm nay | `qizheng › getLuminaries`, `getSiYu`, `longitudeToMansion` |

---

## 3. Thư Lâu — chín tầng (INT-TL-THULAU)

### 3.1 Khuôn một tầng thư (thân dựng lại bằng mô-đun, tầng cao 11 m = sàn chính 6,4 + gác kệ 4,6)

```
 ┌────────────── ~18 × 19 m ──────────────┐
 │ ▓▓▓▓▓▓▓ kệ hai mức (NHO-17 + gác kệ) ▓▓ │   gác kệ: hành lang 1,6 m có lan can quanh
 │ ▓                                    ▓ │   bốn vách, lên bằng thang gỗ nhỏ ở góc
 │ ▓    [NHO-46 bàn đọc đứng: «sách   ] ▓ │
 │ ▓    [ hôm nay của tầng này»       ] ▓ │
 │ ▓  [NHO-13 ×4 án thấp + NHO-16 chiếu]▓ │
 │ ▓                                    ▓ │
 │ ▓         ┌──── lõi thang U ────┐    ▓ │   lõi giữa: thang U lên tầng trên,
 │ ▓         │  ▲ lên     ▼ xuống  │    ▓ │   vách lõi treo biển tầng
 │ ▓         └─────────────────────┘    ▓ │
 └──────────[ cửa sổ 4 mặt × 3 ô ]────────┘
```

### 3.2 Tầng và nội dung

| Tầng | Lớp (`library-data › LAYERS`) | Đồ riêng | Ánh sáng | Điều kiện mở |
|---|---|---|---|---|
| Trệt | Văn Xương Các + bàn «tầng thư hôm nay» (`halls.js › buildThuVien`) | tượng `deity_wenchang`, kệ xoay NHO-45 | ấm, nhiều nến | luôn |
| 2 | `classic` 經典 Kinh điển Bát Tự | kệ cuộn trục NHO-18 | ấm | luôn |
| 3 | `daozang` 道藏 Đạo Tạng | rương kinh BAC-41 | ấm | luôn |
| 4 | `cultivation` 功法 Công pháp | bồ đoàn (đọc ngồi) | dịu | luôn — mỗi trang có cảnh báo «không tự luyện ngoài đời» |
| 5 | `ritual` 科儀 Nghi thức · Ấn | tủ cửa lưới NHO-19 | dịu | luôn — chỉ lịch sử, không hướng dẫn thực hành |
| 6 | `phuongthuat` 方術 Phương thuật | — | dịu | đã đọc ≥ 3 tầng dưới |
| 7 | `mantra` 神咒 Thần chú | — | lam nhạt | ≥ 4 tầng |
| 8 | `fu` 符籙 Phù bùa | — | lam nhạt | ≥ 5 tầng — **ký tự hư cấu của game**, không hiện hình phù thật |
| 9 | `bitruyen` 秘傳 Bí truyền · Thất truyền + đài ngắm | — | ánh trời | đã đọc đủ 7 tầng dưới (`countByLayer`) |

Tầng chưa mở: thang vẫn đi được, cửa tầng là `KHOA` có song (nhìn được kệ sách bên trong — khoang khóa hợp lệ, 08-01 §1.3); thủ thư giải thích điều kiện. «Mở» chỉ là thứ tự đọc, không phải trả phí.

---

## 4. Cửu Cung Lâu (INT-TB-THAPDONG) và Cửu Vận Lâu (INT-TB-THAPTAY)

### 4.1 Cửu Cung Lâu — chín cung Lạc Thư

| Tầng | Cung | Quái | Phương | Hành | Sao gốc (cửu tinh) | Nội dung tầng |
|---|---|---|---|---|---|---|
| 1 | 1 | Khảm | Bắc | Thủy | Nhất Bạch | bàn phi tinh **năm nay** cho cung này: sao nào bay vào |
| 2 | 2 | Khôn | Tây Nam | Thổ | Nhị Hắc | như trên |
| 3 | 3 | Chấn | Đông | Mộc | Tam Bích | |
| 4 | 4 | Tốn | Đông Nam | Mộc | Tứ Lục | |
| 5 | 5 | Trung cung | Giữa | Thổ | Ngũ Hoàng | tầng giữa tháp: tượng trưng «trung cung», bảng tổng cửu cung năm nay |
| 6 | 6 | Càn | Tây Bắc | Kim | Lục Bạch | |
| 7 | 7 | Đoài | Tây | Kim | Thất Xích | |
| 8 | 8 | Cấn | Đông Bắc | Thổ | Bát Bạch | |
| 9 | 9 | Ly | Nam | Hỏa | Cửu Tử | đỉnh: nhìn bốn phương, mũi tên chỉ phương của từng sao năm nay |

Mỗi tầng: một **cửa sổ chính quay đúng phương thật** của cung (tháp xoay theo `ry` vùng — công thức tính hướng cửa sổ từ `ry` để phương thật đúng). Dữ liệu sao năm: `xuankong › yearFlyingStar`, tên / tính chất sao: `xuankong › STAR`.

### 4.2 Cửu Vận Lâu — chín vận Tam Nguyên

| Tầng | Vận | Nguyên | Năm | Sao chủ vận |
|---|---|---|---|---|
| 1 | 1 | Thượng | 1864–1883 | Nhất Bạch |
| 2 | 2 | Thượng | 1884–1903 | Nhị Hắc |
| 3 | 3 | Thượng | 1904–1923 | Tam Bích |
| 4 | 4 | Trung | 1924–1943 | Tứ Lục |
| 5 | 5 | Trung | 1944–1963 | Ngũ Hoàng |
| 6 | 6 | Trung | 1964–1983 | Lục Bạch |
| 7 | 7 | Hạ | 1984–2003 | Thất Xích |
| 8 | 8 | Hạ | 2004–2023 | Bát Bạch |
| 9 | 9 | Hạ | 2024–2043 | Cửu Tử (vận hiện hành — tầng đỉnh thắp sáng) |

Dữ liệu chạy: `sanyuan-jiuyun › sanyuanJiuyun`, `currentYun` (bảng trên là để dựng; số trên biển lấy từ engine). Mỗi tầng một «ngôi nhà mẫu» thu nhỏ của vận đó (mái, cửa theo hướng vượng của vận — minh họa, không lời khuyên cá nhân); tầng năm sinh của người chơi có dấu «vận bạn ra đời».

---

## 5. Cửu Diệu Lâu (INT-TT-CUUTANG) và Bắc Đẩu Lâu (INT-HS-THAPDONG)

### 5.1 Cửu Diệu Lâu

| Tầng | Diệu | Nội dung |
|---|---|---|
| 1 | Thái Dương (Nhật) | vị trí hoàng kinh, tú đang ở — `qizheng › getLuminaries`, `longitudeToMansion` |
| 2 | Thái Âm (Nguyệt) | như trên + tuần trăng |
| 3 | Tuế tinh (Mộc) | |
| 4 | Huỳnh Hoặc (Hỏa) | |
| 5 | Trấn tinh (Thổ) | |
| 6 | Thái Bạch (Kim) | |
| 7 | Thần tinh (Thủy) | |
| 8 | La Hầu | `qizheng › getSiYu` |
| 9 | Kế Đô | `getSiYu`; đỉnh: đài ngắm, kính ngắm (tương tác nhỏ) |

Mỗi tầng: quả cầu đồng tượng trưng diệu đó treo giữa tầng, quỹ đạo vẽ trên trần; ban đêm cửa sổ hướng về diệu nếu nó đang trên chân trời (theo `getLuminaries` + giờ thật).

### 5.2 Bắc Đẩu Lâu (Hậu Sơn)

| Tầng | Sao | Ghi chú |
|---|---|---|
| 1 | Tham Lang | |
| 2 | Cự Môn | |
| 3 | Lộc Tồn | |
| 4 | Văn Khúc | |
| 5 | Liêm Trinh | |
| 6 | Vũ Khúc | |
| 7 | Phá Quân | |
| 8 | Tả Phụ | sao ẩn |
| 9 | Hữu Bật | đỉnh — chuông Bắc Đẩu (`ix` `hs.bacdau.chuong`) |

Tên trùng một phần với chính tinh Tử Vi (Tham Lang, Cự Môn, Liêm Trinh, Vũ Khúc, Phá Quân, Văn Khúc) — biển mỗi tầng ghi rõ «sao Bắc Đẩu» và dẫn sang Quan Tinh Đài cho nghĩa trong Tử Vi (`ziwei › STAR_VI`) để không lẫn.

---

## 6. Trạch Nhật Đường — Lịch Đường (INT-LD-DAIDIEN)

### 6.1 Ba vòng thời gian trong một sảnh (25 × 13,2 m)

```
 ┌────────────────────────── 25 ──────────────────────────┐
 │  ║建║除║満║平║定║執║破║危║成║收║開║閉║   ← 12 CỘT TRỰC        │
 │                                                        │
 │   phướn 24 tiết khí treo xà (12 mỗi bên lối giữa)      │
 │         ╭──────── vòng 28 tú khắc sàn ────────╮        │
 │         │      [BÀN CHỌN NGÀY giữa vòng]      │        │
 │         ╰─────────────────────────────────────╯        │
 └──────────────────────[ cửa giữa ]──────────────────────┘
```

| Thành phần | Dữ liệu | Nguồn |
|---|---|---|
| 12 cột trực | Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thu, Khai, Bế; **cột trực hôm nay** sáng; cột **hoàng đạo** (cát) viền vàng, hắc đạo viền xám — đúng phân loại engine (Trừ, Nguy, Định, Chấp, Thành, Khai là cát) | `zheri.js` (`ZHI_OFFICERS`, `OFFICER_VI`) |
| 24 phướn tiết khí | phướn tiết hiện tại hạ thấp, có đèn | `month-calendar › monthCalendar` |
| Vòng 28 tú | tú trực hôm nay sáng | `ershibaxiu › xiuDay` |
| Bàn chọn ngày | chọn việc → 5 ngày tốt nhất trong 30 ngày; giải thích theo trực, tú, hoàng đạo | `zheri › findGoodDates`, `evaluateDate`; `huangdao › huangdao12` |

Đứng ở cột một trực → đọc định nghĩa trực đó từ engine. Đây vừa là nơi học, vừa là **sảnh trong** của nghề Trạch Nhật (án khó `ld_ankho`).

---

## 7. Quy tắc chung cho các điện «dạy bằng không gian»

1. **Không chữ nào tự viết cho tri thức chuyên môn** — biển, bảng lấy chuỗi từ engine; chỗ engine chưa có chuỗi thì ghi «(chưa có — cần làm)» trong công thức và để trống biển (không bịa).
2. **Bố cục phải khớp dữ liệu thật**: mười hai ô theo đúng thứ tự chi; chín cung đúng Lạc Thư; cửa sổ cung quay đúng phương thật (tính từ `ry` vùng).
3. **Không phán**: điện nào cũng có câu «Đây là học; lá số không định đời bạn» (trụ cột T2) ở cửa.
4. **Một trạm mỗi khoang** đủ nối engine; tương tác phụ (chạm cột, chạm phù điêu) là tương tác nhỏ.
5. **Hiệu năng**: chữ trên biển là `CanvasTexture` vẽ một lần mỗi ngày (giống `drawPlaque` / `drawStele` trong `interior.js`), không vẽ lại mỗi khung.
