# 03 — Tiên phủ Tây Tạng (Biến Thiên): nghiên cứu kiến trúc Cung Potala

Phong cách: cung điện – pháo đài Tây Tạng (dzong / phodrang), nguyên mẫu chính là **Cung Potala, Lhasa**:
Bạch Cung (Potrang Karpo), Hồng Cung (Potrang Marpo), sân Deyang Shar, làng Shöl dưới chân núi, hồ và điện Lukhang phía sau.
Đối chiếu thêm: Jokhang (mái vàng kiểu Hán), Sera và Drepung (tăng học viện, tăng xá), Norbulingka (đình hồ kiểu Hán).

Danh sách công trình lấy từ `list-3-taytang.txt`. Khung hiện tại lấy từ `src/game/tienphu/siteplans.js` (taytang) và
`src/game/tienphu/styles.js` / `tower.js` (lầu: 4 cạnh, apothem 19 → 11,08 m, tầng 5 m, bệ 3 m).

> Quy ước trong file này
> - **[Đo]** = số có trong nguồn. **[Suy]** = tôi suy ra từ số có nguồn, có ghi cách suy. **[Đề xuất]** = số đề xuất cho game, không phải số đo thật.
> - Mã màu hex đều là **gần đúng** theo mô tả màu trong nguồn (đỏ son, trắng vôi, nâu đỏ penbey, đen viền cửa, vàng mạ). Không có nguồn đo màu.
> - Nguồn ghi «mở» = tôi đã mở trang đọc. Ghi «tìm» = chỉ thấy đoạn trích trong kết quả tìm kiếm (trang không mở được hoặc chưa mở).
> - Ảnh Wikimedia Commons: tôi chỉ thấy **tên file trong trang danh mục** (đã mở danh mục), chưa xem nội dung ảnh. Cần mở ảnh để kiểm trước khi vẽ.

---

## 0. Bảng nguồn dùng chung (mã → URL)

| Mã | URL | Trạng thái |
|---|---|---|
| W-POT | https://en.wikipedia.org/wiki/Potala_Palace | mở |
| ZW-POT | https://zh.wikipedia.org/zh-hans/%E5%B8%83%E8%BE%BE%E6%8B%89%E5%AE%AB | mở |
| BD-POT | https://baike.baidu.com/en/item/Potala%20Palace/985649 | mở |
| NEAC | https://www.neac.gov.cn/seac/c103391/202210/1159312.shtml (Ủy ban Dân tộc Quốc gia TQ, «道中华») | mở |
| SOHU-POT | https://www.sohu.com/a/357211653_162926 | mở |
| MATRX | https://www.studiomatrx.org/architecture-canon/potala-palace | mở |
| W-LHASA | https://en.wikipedia.org/wiki/Architecture_of_Lhasa | mở |
| W-TBA | https://en.wikipedia.org/wiki/Tibetan_Buddhist_architecture | mở |
| W-ZHOL | https://en.wikipedia.org/wiki/Zhol_Village | mở |
| W-JOK | https://en.wikipedia.org/wiki/Jokhang | mở |
| YZ | https://www.sohu.com/a/1013126464_121124715 («藏地·营建 — 西藏地区传统建筑营造技艺») | mở |
| THF | http://www.tibetheritagefund.org/page/?r=120 (Tibet Heritage Fund — kiến trúc dân gian) | mở |
| THL-PRINT | https://places.kmaps.virginia.edu/features/27418 (THL Places — Zhöl Parkhang) | mở |
| SHALU | https://www.asianart.com/associations/shalu/lukhang/index.html (Shalu Association — Lukhang) | mở |
| TT-FEAT | https://www.tibettravel.org/tibetan-architecture/feature-of-tibetan-architecture.html | mở |
| CSGPC | https://www.csgpc.org/index.php/detail/5836.html (Hội Trắc hoạ TQ — bài đo 3D Potala) | tìm |
| XZDW | https://zfw.xzdw.gov.cn/zfjj/xyfq/201907/t20190719_164115.html | tìm |
| BOOK-POT | https://dokumen.pub/potala-palace-1nbsped-9787112134243.html (sách 《布达拉宫》, NXB Kiến trúc TQ) | tìm (trang báo bảo trì khi mở) |
| BD-SHOL | https://baike.baidu.com/item/%E5%B8%83%E8%BE%BE%E6%8B%89%E5%AE%AB%E9%9B%AA%E5%9F%8E (Baidu «布达拉宫雪城») | tìm (DNS lỗi khi mở) |
| ZHIHU-SHOL | https://zhuanlan.zhihu.com/p/392750051 | tìm |
| SINA-POT | https://k.sina.cn/article_6425294870_17efa38160010041v5.html | tìm |
| HBTM | http://www.hbtmjzxh.com/news/show.php?itemid=3554 (Hội Xây dựng Hồ Bắc — Potala) | tìm |
| SLIDE | https://www.slideshare.net/slideshow/potala-palace/191271512 | tìm |
| BUDDOOR | https://www.buddhistdoor.net/news/renovation-of-tibets-iconic-potala-palace-completed/ | tìm |
| TOL-PRINT | https://treasuryoflives.org/bo/institution/Shol-Printery | tìm |
| PRM | https://web.prm.ox.ac.uk/tibet/photo_BMR.6.8.167.html (Pitt Rivers Museum) | tìm |
| DZOG | https://pdfcoffee.com/the-dzogchen-murals-of-the-lukhang-in-lhasa-pdf-free.html | tìm |
| TD-LUK | https://www.tibetdiscovery.com/what-to-see/zongjiao-lukang-park/ | tìm |
| TF-LUK | https://www.tibetfocus.travel/attractions-in-tibet/lhasa/lukhang-temple/ | tìm |
| XZ-STD | https://zjt.xizang.gov.cn/xwzx/tzgg/202310/P020231023581952185493.pdf (Tiêu chuẩn kỹ thuật nhà lắp ghép cao nguyên, Sở XD Tây Tạng) | tìm |
| SHINE | https://archive.shine.cn/sunday/now-and-then/Tibets-sacred-monastery-a-living-relic/shdaily.shtml (Shanghai Daily — penbey) | tìm |
| SNOW | https://snowliontours.com/tibet-info/tibet-buddhist-monasteries/ | tìm |
| KUMBUM | https://www.tandfonline.com/doi/full/10.1080/13467581.2022.2153598 (JAABE — điện Kumbum) | tìm |
| MINZU | https://www.minzu56.net/zz/wh/418.html (Trung Hoa dân tộc võng — dân cư Tây Tạng) | tìm |
| YAM | https://naturallybread.yam.org.tw/2008-adama/200802tibet-b/200802tibet-b-index.htm | tìm |
| BD-JOK | https://baike.baidu.com/item/%E5%A4%A7%E6%98%AD%E5%AF%BA/532150?noadapt=1 | tìm |
| SUBAI | https://m.idisk.qq.com/read/1041151179/7 (Túc Bạch, 《藏传佛教寺院考古》) | tìm |
| TIBOL | https://www.tibetol.cn/html/2013/sm_0419/604.html | tìm |
| SERA-TT | https://www.tibettravel.org/tibet-travel-guide/sera-monastery-architecture.html | tìm |
| SERA-W | https://en.wikipedia.org/wiki/Sera_Monastery | tìm |
| TOL-SERAJE | https://treasuryoflives.org/institution/Sera-Je | tìm |
| LASA-DRE | https://www.lasa.gov.cn/lasa/tsls/201912/eb5d0d39669141a4b4339d8d3d9374b4.shtml (Chính quyền TP Lhasa — Drepung) | tìm |
| MEET99 | https://www.meet99.com/jingdian-lasazhebangsi-50082.html | tìm |
| PARGO | https://en.wikipedia.org/wiki/Pargo_Kaling | tìm |
| NORBU | https://www.chinahighlights.com/lhasa/attraction/norbulingka.htm | tìm |
| TOL-MANI | https://treasuryoflives.org/institution/Barkor-Mani-Lhakhang | tìm |
| TTE-MANI | https://www.tibettravelexpert.com/lhasa-barkor-mani-lhakhang/ | tìm |
| LP-MANI | https://www.lonelyplanet.com/china/tibet/lhasa/attractions/phurbu-chok-hermitage-mani-lhakhang/a/poi-sig/1451209/356124 | tìm |
| DHVAJA | https://en.wikipedia.org/wiki/Dhvaja | tìm |
| TT-SYM | https://www.tibettravel.org/tibetan-buddhism/tibetan-temple-symbol.html | tìm |
| ASHMO | http://www.jameelcentre.ashmolean.org/collection/7/680/681/all/per_page/50/offset/0/sort_by/seqn./object/11319 | tìm |
| HUNT | https://huntingtonarchive.org/Exhibitions/PDFs/Tibet%20PDFs/Stupas/Kadam%20Chorten%20(Stupa).pdf | tìm |

Ghi chú: hạn mức tìm kiếm web của lượt này đã hết trước khi tra thêm ảnh danh mục Jokhang / Sera Je / Tse Lobdra.

---

## A. Phần chung của phong cách Tây Tạng (Potala)

### A1. Quy tắc tỉ lệ chung (có nguồn)

| Quy tắc | Giá trị | Nguồn | Ghi chú |
|---|---|---|---|
| Độ nghiêng (thu phân 收分) tường đá công trình lớn | ≈ 10 % (tức ≈ 5,7°) | YZ | Công trình khác 5–10 %; nhà trên núi thu nhiều hơn; nhà dân ≥ 2–3 %. |
| Độ nghiêng theo quy chuẩn hiện hành | 3–8° | XZ-STD | Cho phép thu toàn bộ, thu cục bộ hoặc lùi bậc. |
| Độ nghiêng theo Wikipedia | 10° | W-TBA | Không có nguồn trích riêng. **Mâu thuẫn** với 10 % ở trên. Chọn **≈ 6° (10 %)** cho tường lớn vì nguồn YZ là nguồn kỹ thuật, có phân cấp theo loại công trình. |
| Tường chỉ nghiêng **mặt ngoài** | mặt trong thẳng đứng | YZ, SOHU-POT, NEAC | «墙体内侧垂直、外侧收分». |
| Tường Potala | dày TB 3 m, chân 5 m | W-POT (Booz 1986) | ZW-POT: 2–5 m. |
| Tường đá thường | đỉnh ≥ 0,5 m, chân > 1 m | YZ | Công thức: dày chân = dày đỉnh + cao × hệ số thu. |
| Tường đất nện / gạch mộc | ≥ 1 m / 0,4–0,7 m | YZ | |
| Đơn vị không gian «một cột» (ka / 柱) | ≈ 2 × 2 m | MINZU, YAM | Phòng ở thường 4 ô = 4 × 4 m. |
| Nhịp dầm = khoảng cột | ≈ 2–2,5 m; gỗ thường < 3 m | YZ | Vì gỗ hiếm, dầm ngắn → lưới cột dày. |
| Cột | dài ≈ 2–2,5 m (giới hạn vận chuyển); điện cao thì nối 2 khúc | YZ | |
| Tầng nhà dân (thông thuỷ) | 2,2–2,4 m, ít khi > 2,8 m | MINZU, YAM | |
| Mái bằng đất arga (阿嘎土) | lớp thô ≈ 15 cm + lớp mịn ≈ 5 cm; cả mái ≈ 0,4–0,5 m | YZ; BD-POT xác nhận Potala dùng arga cho sàn và mái | |
| Dải penbey (边玛墙) | bó cành 7–10 cm đường kính, dài 25–30 cm; chiếm 1/2–2/3 bề dày tường; cao bằng tường chắn mái, vài lớp, **hoặc cả tầng trên cùng** | YZ; SHINE (bó dài ~30 cm, đk 8–9 cm, xen lớp đất sét) | Chỉ dùng cho công trình tôn giáo và nhà quý tộc (SHINE). |
| Thang trong nhà | dốc > 45° (1:0,5 trong nhà; ≈ 1:1 ở lối vào) | YZ | Thang gỗ dốc kiểu «thang leo». |
| Hướng | quay Nam, đặt nơi cao, nắng | W-TBA, SHALU (Lukhang quay Nam như Potala) | |

**Quy tắc chiều đứng quan trọng nhất cho game:** tầng Tây Tạng thật thấp (2,2–3 m), còn tầng game là 5 m.
Vì vậy mặt đứng phải vẽ **hàng cửa sổ dày** (công trình dân / Shöl: 2 hàng cửa sổ cho mỗi tầng game 5 m) — nếu không sẽ thành «hộp cao có ít cửa», mất cảm giác Tây Tạng.

### A2. Bảng màu và vật liệu chung (hex gần đúng)

| Phần | Vật liệu thật | Màu | Hex gần đúng |
|---|---|---|---|
| Tường Bạch Cung, Zhasha, Shöl | đá + đất nện, quét vôi trắng | trắng ngà | `#EEE9DD` |
| Tường Hồng Cung | như trên, quét đỏ (vôi pha đất son) | đỏ son thẫm | `#8E2A22` |
| Dải penbey | bó cành liễu bách / tamarisk (柽柳) nhuộm | nâu đỏ sẫm «như thảm len» | `#5A2620` |
| Viền cửa sổ (nag-thig, «baka» 巴卡) | vữa / sơn đen | đen | `#1B1716` |
| Mái vàng (gyaphib, 金顶) | ngói đồng mạ vàng | vàng kim | `#C9A43A` |
| Huy hiệu trên penbey (pháp luân, bát bảo) | đồng mạ vàng | vàng kim | `#D4AF37` |
| Sàn / mái arga | đất đá nện, đánh bóng | xám be | `#A39C90` |
| Sân Deyang Shar (tường) | sơn vàng | vàng đất | `#D2A23C` |
| Cột, cửa gỗ | gỗ sơn đỏ | đỏ | `#8B1E1A` |
| Đầu xà, «tinh tinh mộc» (星星木) | gỗ sơn | đỏ chấm trắng; đầu rui 5 màu | đỏ `#A3231C`, xanh `#1F4E8C`, lục `#2E7D4F`, vàng `#E3B23C`, trắng `#F4F1EA` |
| Rèm vải trên cửa (shambu) | vải sọc | đỏ / xanh / trắng (TT-FEAT) | `#B22A22` / `#1F4E8C` / `#F5F3EE` |
| Bệ đá, đá lộ chân tường | đá hoa cương (granite) | xám nâu | `#8A7F6E` |

Nguồn màu: NEAC (đỏ, trắng, vàng, đen), BD-POT (penbey đỏ mềm trên diềm, penbey đỏ thẫm hai bên thang; khung cửa đen hình thang),
TT-FEAT (ba màu đỏ – trắng – đen từ đất địa phương; vàng = phái Gelug), W-LHASA (Deyangshar sơn vàng), YZ (màu cửa, đầu rui, tinh tinh mộc).

### A3. Những SAI LẦM hay gặp — phải tránh

1. **Tường thẳng đứng.** Tường Tây Tạng nghiêng vào ở mặt ngoài (≈ 10 % ở công trình lớn). Mặt trong thẳng đứng. Không làm tường mỏng nghiêng cả hai mặt.
2. **Lầu bậc thang thu nhỏ từng tầng như tháp chùa.** Hồng Cung là **một khối lăng trụ** có tường nghiêng liên tục, không phải chồng 10 hộp nhỏ dần có gờ ở mỗi tầng.
3. **Mái cong vểnh ở mọi tầng.** Thân nhà Tây Tạng là **mái bằng** có tường chắn mái. Mái vàng kiểu Hán chỉ là **các đình nhỏ đặt trên mái bằng** (gyaphib) của điện thờ quan trọng — không phủ cả công trình.
4. **Cửa sổ chữ nhật trơn.** Cửa sổ phải có **viền đen hình thang, hẹp trên rộng dưới**, có lanh tô nhiều lớp rui nhỏ nhô ra (三椽三盖) và rèm vải sọc.
5. **Penbey ở mọi nhà.** Dải penbey chỉ có trên công trình tôn giáo và nhà quý tộc (SHINE). Nhà dân Shöl dùng tường chắn mái trơn: nâu đỏ, đen hoặc cùng màu tường (YZ).
6. **Tầng cao, ít cửa.** Tầng thật 2,2–3 m. Mặt đứng phải dày hàng cửa sổ, cửa sổ to dần lên trên (dưới là kho, trên là nơi ở).
7. **Một màu.** Phải tách trắng / đỏ son / nâu penbey / đen viền / vàng mạ. Hồng Cung đỏ, Bạch Cung trắng — không đảo.
8. **Lukhang đặt trên bờ.** Lukhang thật nằm **trên đảo tròn giữa hồ chữ nhật**, nối bằng cầu đá vòng kiểu Hán.
9. **Đình bát giác kiểu Trung Hoa khắp nơi.** Kiến trúc Tây Tạng gốc là khối vuông / chữ nhật. Đình kiểu Hán chỉ có ở vườn (Lukhang, Norbulingka) và mái vàng.
10. **Nhầm gyaltsen với cột cờ.** Gyaltsen trên mái là **trụ đồng mạ vàng hình ống** ở 4 góc mái (DHVAJA, TT-SYM); ngoài ra Potala có cờ chiến thắng nhỏ bằng khung đồng phủ lụa đen, đỉnh đinh ba. Cột cờ cầu nguyện (darchen) là thứ khác, đặt dưới sân.

### A4. Phân biệt với phong cách gần

| So với | Khác ở đâu |
|---|---|
| Trung Hoa (cung điện Hán) | Trung Hoa: khung gỗ chịu lực, **mái chiếm 1/2 chiều cao**, tường chỉ là vách. Tây Tạng: **tường dày nghiêng chịu lực**, mái bằng, cột gỗ chỉ ở bên trong. Mái Hán ở Potala chỉ là «vương miện» trên đỉnh. |
| Bhutan (dzong) | Bhutan: tầng trên có khung gỗ lộ, mái dốc lợp ván, dải kemar. Tây Tạng: mái bằng arga, dải penbey bằng cành bó, ít gỗ lộ ngoài. |
| Huế / Nhật | Hoàn toàn là hệ mái gỗ. Không có tường nghiêng, không có mái bằng. |
| Ladakh (Leh Palace) | Gần nhất về hình khối (tường nghiêng, mái bằng, cửa viền đen) nhưng chủ yếu gạch mộc, gần như không có mái vàng kiểu Hán. |
| Pháo đài Trung Đông / Yemen | Cũng tường đất nhiều tầng, nhưng không có viền cửa đen hình thang, không có penbey, không có mái vàng. |

### A5. Thứ tự dựng chung (từ dưới lên)

1. **Nền đá / tường chân (地垄墙)**: ô tường đá chồng lên theo sườn núi tạo mặt bằng; bên ngoài là tường nghiêng có hàng cửa hẹp. Potala: đổ đồng vào móng chống động đất (W-POT).
2. **Thân**: tường đá + đất nện nghiêng ngoài; bên trong lưới cột gỗ ≈ 2–2,5 m; cửa sổ nhỏ ở dưới, to dần lên trên; tầng trên có ban công gỗ / cửa sổ lồi (rabsel).
3. **Đỡ sàn / mái**: cột → đấu vuông (bo-gyab) → **đà đỡ hình cung (弓木, «cung mộc»)** → xà → rui tròn / vuông dày → lớp cành → đất → arga (YZ; TIBOL mô tả chuỗi «cột → khối gỗ vuông → đà → xà → rui → cành → đá đất»).
4. **Diềm**: dải penbey nâu đỏ (công trình tôn giáo / quý tộc), gắn huy hiệu đồng mạ vàng; trên là gờ mái chắn bằng đá.
5. **Mái**: mái bằng arga, có lỗ thoát nước + máng gỗ ở chân tường chắn (YZ). Điện quan trọng có **gyaphib** (đình mái vàng kiểu Hán, đơn diêm, mái yết sơn 歇山 hoặc lục giác).
6. **Đỉnh**: gyaltsen (trụ đồng mạ vàng) ở 4 góc mái vàng; bình báu (bumpa) trên nóc; pháp luân với đôi nai (Jokhang, W-JOK).

---

## lau10 — Hồng Cung (Potrang Marpo) — lầu 10 tầng

### 1. Nguyên mẫu thật
**Potrang Marpo (ཕོ་བྲང་དམར་པོ, 红宫), Hồng Cung của Cung Potala, Lhasa.** Xây 1690–1694 dưới quyền nhiếp chính Desi Sangye Gyatso (W-POT, MATRX).
Nằm giữa quần thể: phía Đông nối Bạch Cung, phía Tây nối Zhasha (NEAC, ZW-POT). Chức năng: điện thờ, điện tháp xá lợi các Đạt Lai Lạt Ma, thư viện.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Cả quần thể chính (Bạch + Hồng + Zhasha) | Đông–Tây 360 m × Bắc–Nam 140 m | [Đo] | ZW-POT, NEAC |
| Như trên, số khác | 400 × 350 m (tính cả tường ngoài) | [Đo] | W-POT (Booz) ; CSGPC: 360 × 270 m tính từ tường thành ngoài |
| Cao toàn bộ (từ chân núi) | 117,2 m / 115,7 m / 119 m | [Đo] mâu thuẫn | ZW-POT 117,2; CSGPC, XZDW 115,7(03); W-POT 119. **Chọn 117 m** (số trung vị, dùng nhiều nhất). |
| Sân Deyang Shar cao hơn mặt đất | > 60 m | [Đo] | kết quả tìm (trích «海拔高出地面 60 余米») |
| Phần Hồng Cung nhô trên mức Deyang Shar | ≈ 57 m | [Suy] 117 − 60 | |
| Số tầng nhìn từ ngoài / thực | 13 / 9 | [Đo] | ZW-POT, NEAC: «外显13层，宫内实际有9层»; 4 tầng dưới là tường đá xếp từ đá núi (地垄墙) |
| Cách đếm khác (Baidu) | 9 tầng: 4 tầng dưới là móng – tường ngầm; Đại điện Tây ở **tầng 5**; 4 tầng trên điện tạo **giếng trời** | [Đo] | BD-POT |
| Mặt bằng Hồng Cung | gần vuông | [Đo] | BD-POT |
| Rộng × sâu Hồng Cung | **không tìm được** | — | đã tìm EN + ZH, không có số |
| Giếng trời giữa (từ tầng 6 trở lên) | 24,6 × 15,8 m = 388,7 m² | [Đo] | BOOK-POT (trích trong kết quả tìm) |
| Đại điện Tây (Tsomchen Nub, 西大殿 / 司西平措) | 725,7 m², cao > 6 m | [Đo] | ZW-POT, BD-POT |
| Quảng trường Tây (西欢乐广场), phía Nam Hồng Cung | 258 m², chữ nhật | [Đo] | BOOK-POT (trích) |
| Điện tháp Đạt Lai thứ 5 | 16 cột vuông lớn | [Đo] | ZW-POT |
| Tháp xá lợi Đạt Lai thứ 5 | 14,85 m (một nguồn: 12,60 m cao, 7,65 m rộng) | [Đo] mâu thuẫn | ZW-POT; kết quả tìm khác. Chọn 14,85 m (wiki + SOHU-POT). |
| Tháp Đạt Lai thứ 13 | 12,97 m, chân 7,83 m (nguồn khác ≈ 14 m) | [Đo] | BD-POT |
| Tháp Đạt Lai thứ 7 | 9,36 m, chân 5,45 m | [Đo] | kết quả tìm (163.com / sina) |
| Số mái vàng | 7 (Đông → Tây: tháp ĐL 9, ĐL 8, điện thờ chính, ĐL 7, ĐL 10 / Thượng sư điện, ĐL 5, ĐL 13) | [Đo] | BD-POT, SOHU-POT, BUDDOOR («seven gilded bronze peaks») |
| Kiểu mái vàng | 5 mái yết sơn đơn diêm (歇山) + 2 mái lục giác (điện thờ chính, Thượng sư điện) | [Đo] | SOHU-POT; ZW-POT nói «单檐歇山式» cho cả nhóm. Chọn cách của SOHU-POT vì chi tiết hơn. |
| Cao trình mái vàng | ≈ 3 750 m so với mặt biển | [Đo] | SOHU-POT |
| Thông thuỷ dưới mái vàng | ≈ 2 m; cột mái vàng ≈ 2 m | [Đo] | YZ |
| Hành lang tầng 2 | 698 bức bích hoạ | [Đo] | BD-POT |
| Tường | dày TB 3 m, chân 5 m | [Đo] | W-POT |
| Độ nghiêng tường | 10 % (≈ 5,7°) cho công trình đá lớn | [Đo, chung] | YZ |

### 3. Cấu trúc từ dưới lên
1. **Chân / nền**: tường đá xếp từ đá núi Marpo Ri (地垄墙), tạo 4 tầng đặc / kho kín; dày 3–5 m; đổ đồng vào móng (W-POT, ZW-POT).
2. **Thân dưới (tầng 1–4 thực)**: các điện tháp xá lợi, kho, hành lang bích hoạ ở tầng 2.
3. **Tầng 5**: Đại điện Tây 725,7 m², cao > 6 m (hai tầng thông), là tâm mặt bằng.
4. **Tầng 6–9**: bốn tầng phòng, hành lang vây quanh **giếng trời 24,6 × 15,8 m** mở trên mái Đại điện Tây (cửa mái lấy sáng).
5. **Tầng trên cùng**: điện Sasum Namgyal (殊胜三界殿) — điện cao nhất của Hồng Cung (BD-POT). Ngoài mặt là **dải penbey nâu đỏ chạy hết tầng trên**, gắn pháp luân + đôi lân, bát bảo, thất chính bảo bằng đồng mạ vàng (NEAC, SOHU-POT).
6. **Mái**: mái bằng arga; trên đó 7 **gyaphib** (đình mái vàng kiểu Hán): mái yết sơn đơn diêm, đỡ bằng đấu củng gỗ, lợp ngói đồng mạ vàng (ZW-POT, SOHU-POT); 2 cái mái lục giác.
7. **Đỉnh**: gyaltsen (trụ đồng mạ vàng) ở góc mái vàng, bình báu, pháp luân (NEAC: «胜利幢、宝瓶»).

### 4. Mặt bằng
- Gần vuông; tâm là Đại điện Tây (tầng 5) + giếng trời phía trên. Phía Tây là điện tháp Đạt Lai thứ 5 (16 cột vuông, tháp cao 14,85 m xuyên nhiều tầng).
- Mặt tiền Nam: **dải cửa sổ lớn dạng lưới đứng, thông suốt 7 tầng, ở giữa** (SOHU-POT / trích «红宫中央采用上下七层贯通的竖向大窗格»), hai bên là tường đỏ đặc, cửa sổ nhỏ và khe thông gió.
- Lối lên: từ sân Deyang Shar qua Bạch Cung, hoặc thang Tây; cầu thang trong là thang gỗ dốc.

**Ánh xạ 13 tầng thật → 10 tầng chơi** (đề xuất):

| Tầng game | Tầng thật (13 tầng ngoài) | Nội dung | Mặt ngoài |
|---|---|---|---|
| Bệ (không chơi) | 3 tầng tường đá dưới cùng (地垄墙) | khối đá nghiêng, chỉ có khe hẹp | 3 hàng khe sáng nhỏ, tường đỏ trên chân đá trắng / đá xám |
| T1 | tầng đá thứ 4 (地垄墙 trên cùng) | kho, cổng vào, thang | cửa nhỏ |
| T2–T4 | tầng thực 1–3 (dưới Đại điện) | điện tháp, hành lang bích hoạ (T3 = «tầng 2» có 698 bích hoạ) | cửa sổ vừa |
| T5 | tầng thực 4–5 | **Đại điện Tây** (cao > 6 m; trong game 5 m + cửa mái) | bắt đầu dải cửa lưới giữa |
| T6–T9 | tầng thực 6–9 | 4 tầng hành lang quanh **giếng trời** (lỗ mở giữa sàn) | dải cửa lưới giữa tiếp tục |
| T10 | tầng trên cùng (Sasum Namgyal) | điện cao nhất | **toàn bộ là dải penbey + huy hiệu vàng** |
| Vọng Đài (deck) | mái bằng | mái arga + 7 (hoặc ít nhất 3) gyaphib + gyaltsen | mái vàng nhô trên đường mái |

Cách tính: 3 hàng khe ở bệ + 10 tầng = **13 hàng nhìn từ ngoài**, khớp «13 tầng»; dải cửa lưới giữa phủ T4–T10 = **7 tầng**, khớp nguồn.
Hai cách đếm của nguồn (13 = 4 + 9 hay 9 = 4 + 1 + 4) đều được giữ: Đại điện ở giữa, 4 tầng giếng trời ở trên, 4 tầng đá ở dưới.

### 5. Cấu kiện nhận diện (xếp theo mức quan trọng)
1. Khối lăng trụ **đỏ son**, tường nghiêng ngoài, đặt **cao hơn và ở giữa** khối trắng.
2. **Dải penbey nâu đỏ ở tầng trên cùng** gắn huy hiệu vàng (pháp luân lớn ở giữa).
3. **Các mái vàng kiểu Hán nhỏ trên mái bằng** (7 cái; tối thiểu 3: một lớn hai nhỏ — ZW-POT nhắc «三座宝塔，一大二小» trên đỉnh).
4. **Dải cửa sổ lưới đứng 7 tầng ở giữa mặt Nam**.
5. Cửa sổ viền đen hình thang, rèm vải sọc trên cửa.
6. Gyaltsen vàng ở góc mái; cờ chiến thắng khung đồng phủ lụa đen.
7. Phần trắng bao hai bên / phía dưới (khối Hồng Cung nằm trên các tầng trắng).

### 6. Vật liệu và màu

| Phần | Vật liệu | Hex |
|---|---|---|
| Tường Hồng Cung | đá + đất nện, quét đỏ | `#8E2A22` |
| Chân đá / bệ | đá granite | `#8A7F6E` |
| Penbey | cành tamarisk bó, nhuộm đỏ nâu | `#5A2620` |
| Huy hiệu penbey | đồng mạ vàng | `#D4AF37` |
| Viền cửa | đen | `#1B1716` |
| Khung cửa lưới giữa | gỗ đỏ sẫm / nâu | `#5C1E16` |
| Mái vàng | ngói đồng mạ vàng | `#C9A43A` |
| Mái bằng | arga | `#A39C90` |

### 7. Trang trí
- Trên penbey: pháp luân + đôi lân/nai (祥麟法轮), bát cát tường, thất chính bảo (NEAC, SOHU-POT).
- Mái vàng: rồng cá (makara) ở đầu bờ, chuông gió, gyaltsen, bình báu.
- Dưới mái vàng: đấu củng sơn màu (ZW-POT).
- Rèm vải sọc đỏ–xanh–trắng trên mỗi cửa sổ.
- Trong: bích hoạ (698 bức hành lang tầng 2), tháp xá lợi mạ vàng.

### 8. Đề xuất kích thước game
- **Khung hiện tại**: bệ vuông 50 m cao 3 m; tầng vuông cạnh 38 m (T1) giảm đều còn 22,2 m (T10), mỗi tầng lùi 0,88 m mỗi bên (≈ 17,6 % ≈ 10°); tầng 5 m; tổng cao 3 + 50 + 4 = **57 m**.
- **Đúng**: tổng ≈ 57 m khớp phần Hồng Cung nhô trên Deyang Shar (≈ 57 m, [Suy]).
- **Sai**:
  1. Thu nhỏ **bậc từng tầng** (thành tháp chùa) — thật là tường nghiêng **liên tục**, khối không thu nhỏ theo bậc.
  2. Độ nghiêng 10° quá lớn so với nguồn kỹ thuật (10 % ≈ 5,7°).
  3. Mặt bằng vuông — thật «gần vuông» nhưng mặt Nam phải dài hơn mặt bên để chứa dải cửa giữa và hai mảng tường đặc; đề xuất chữ nhật nhẹ.
  4. Bệ 3 m quá thấp — không thể hiện 3–4 tầng đá dưới.
- **Khung đề xuất** [Đề xuất]:

| Thông số | Hiện tại | Đề xuất |
|---|---|---|
| Bệ (khối đá nghiêng, không chơi) | 50 × 50 × 3 m | 52 × 44 m, cao **10 m**, nghiêng 10 %, 3 hàng khe sáng |
| Mặt bằng T1 (mặt ngoài) | 38 × 38 m | **44 × 34 m** (Đông–Tây × Bắc–Nam) |
| Mặt bằng T10 | 22,2 × 22,2 m | **35 × 25 m** (tường nghiêng liên tục 10 %: lùi 0,5 m mỗi bên mỗi tầng 5 m) |
| Giếng trời T6–T10 | không có | lỗ mở **14 × 9 m** (giữ tỉ lệ 24,6 : 15,8 ≈ 1,56) ở giữa sàn, lan can quanh; thang đặt ngoài vùng giếng |
| Dải cửa lưới giữa mặt Nam | không có | rộng ≈ 1/3 mặt tiền (≈ 12–14 m), từ T4 đến T10 |
| Dải penbey | không rõ | cao **= cả T10 (4–5 m)**, phẳng với mặt tường đỏ; trên cùng là gờ mái đá nhô ≈ 0,3 m |
| Mái vàng | 'goldCanopy' 1 khối | 3 gyaphib (1 lớn ở giữa ≈ 12 × 9 m, 2 nhỏ ≈ 7 × 6 m) hoặc đủ 7 xếp Đông–Tây; mái yết sơn đơn diêm, độ dốc kiểu Hán; 2 cái lục giác |
| Tổng cao | 57 m | 10 + 50 + ≈ 7 (gyaphib) = **≈ 67 m** |

Tỉ lệ giữa các phần cần giữ: cao thân : rộng mặt Nam ≈ 50 : 44; dải penbey = 1/10 chiều cao thân; mái vàng thấp, không quá 1/8 tổng cao.

### 9. Nguồn
- https://en.wikipedia.org/wiki/Potala_Palace (mở)
- https://zh.wikipedia.org/zh-hans/%E5%B8%83%E8%BE%BE%E6%8B%89%E5%AE%AB (mở)
- https://baike.baidu.com/en/item/Potala%20Palace/985649 (mở)
- https://www.neac.gov.cn/seac/c103391/202210/1159312.shtml (mở)
- https://www.sohu.com/a/357211653_162926 (mở)
- https://www.studiomatrx.org/architecture-canon/potala-palace (mở)
- https://www.sohu.com/a/1013126464_121124715 (mở)
- https://dokumen.pub/potala-palace-1nbsped-9787112134243.html (tìm — số giếng trời, quảng trường Tây)
- https://www.csgpc.org/index.php/detail/5836.html (tìm), https://www.buddhistdoor.net/news/renovation-of-tibets-iconic-potala-palace-completed/ (tìm)
- Ảnh Commons (tên file trong danh mục «Red Palace», đã mở danh mục):
  - https://commons.wikimedia.org/wiki/File:Red_Palace_of_the_Potala.jpg
  - https://commons.wikimedia.org/wiki/File:Potala_Palace_center_front_detail_on_20_May_2014.jpg
  - https://commons.wikimedia.org/wiki/File:Potala_Red_Palace_walls.jpg
  - Mặt bằng tổng: https://commons.wikimedia.org/wiki/File:Potala_Palace_plan..jpg (mở trang tìm thấy; «Potala Palace plan. 17th century», tác giả không rõ) và https://commons.wikimedia.org/wiki/File:Potala_esquema.gif (mở trang file; sơ đồ, không thấy chú thích tỉ lệ)

---

## main — Bạch Cung (Potrang Karpo)

### 1. Nguyên mẫu thật
**Potrang Karpo (ཕོ་བྲང་དཀར་པོ, 白宫)**, Bạch Cung của Potala. Xây 1645–1648, chính quyền Đạt Lai thứ 5 dọn vào năm 1649 (W-POT, MATRX).
Chức năng: nơi ở mùa đông của Đạt Lai, công đường nhiếp chính, đại sảnh nghi lễ. Mặt Đông nhìn ra sân Deyang Shar.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Số tầng | 7 | [Đo] | BD-POT, ZW-POT, NEAC |
| Đại điện Đông (Tsomchen Shar, 措钦厦) | dài 27,8 m × rộng 25,8 m; 717 m² | [Đo] | ZW-POT (27,8 × 25,8), BD-POT (717 m²) |
| Số cột Đại điện Đông | 34 (nguồn khác 38 / 44) | [Đo] mâu thuẫn | ZW-POT, BD-POT: 34; một nguồn 38; SOHU-POT ≈ 44. **Chọn 34** (2 nguồn). |
| Mặt tiền Đại điện Đông | 7 gian | [Đo] | ZW-POT |
| Hiên trước Đại điện Đông | 10 cột | [Đo] | ZW-POT |
| Vị trí Đại điện Đông | giữa tầng 4 | [Đo] | BD-POT |
| Tầng 5–6 | văn phòng và chỗ ở nhiếp chính | [Đo] | BD-POT |
| Tầng 7 | 2 tẩm điện mùa đông: Nhật Quang Đông / Tây (Nyiwö Shar / Nub); mặt Nam là kính sát sàn | [Đo] | BD-POT, kết quả tìm |
| Tường cổng chính Bạch Cung | dày ≈ 2 m | [Đo] | SOHU-POT |
| Rộng tổng Bạch Cung | **không tìm được** | — | Một nguồn (Đại Vận Hà di sản võng) ghi 320 × 200 m — rõ ràng là cả quần thể, **bỏ** |
| Tháp tròn hai đầu Đông / Tây quần thể | có, «tượng trưng mặt trời, mặt trăng» | [Đo, định tính] | NEAC |
| Kích thước gian / nhịp | ≈ 27,8 m / 7 gian ≈ 4,0 m mỗi gian | [Suy] | từ ZW-POT |

### 3. Cấu trúc từ dưới lên
1. Chân: tường đá xếp từ sườn núi, nghiêng mạnh; các tầng dưới là kho, ít cửa.
2. Thân 7 tầng: tường trắng nghiêng ngoài; cửa nhỏ ở dưới, tầng trên cửa lớn và ban công gỗ.
3. Tầng 4: Đại điện Đông 7 gian, lưới cột gỗ đỡ xà + đà cung, giếng trời / cửa mái lấy sáng (BD-POT: «major halls … have skylights»).
4. Tầng 7: Nhật Quang điện — mặt Nam là cửa kính lớn, mái hiên gỗ.
5. Diềm: dải penbey nâu đỏ dưới gờ mái.
6. Mái: bằng, arga; không có gyaphib lớn (mái vàng nằm trên Hồng Cung).

### 4. Mặt bằng
- Khối chữ nhật dài theo Đông–Tây, ăn vào sườn núi (sau lưng là đá). Mặt chính quay Đông ra Deyang Shar.
- Lối vào chính: từ Deyang Shar lên **3 thang gỗ song song** (thang giữa dành riêng Đạt Lai), qua hành lang Dasong Gekor tới Đại điện Đông (kết quả tìm, các trang du lịch trích Baidu).
- Đại điện Đông ở giữa tầng 4 (27,8 × 25,8 m, 7 gian). Tầng 5–6 công đường, tầng 7 tẩm điện.

### 5. Cấu kiện nhận diện
1. Khối **trắng** dài, nhiều tầng (7 hàng cửa), tường nghiêng.
2. Cửa sổ viền đen hình thang, dày đặc; tầng trên cửa lớn hơn.
3. Dải penbey nâu đỏ ở diềm.
4. **Hai bên cầu thang chính là tường penbey đỏ thẫm** (BD-POT: «deep crimson Penma eave walls flank the steps»).
5. Ba thang gỗ song song từ sân lên.
6. Nhật Quang điện tầng 7 có mặt kính lớn quay Nam, rèm vàng.
7. Tháp tròn (bastion) ở đầu Đông.

### 6. Vật liệu và màu
Tường vôi trắng `#EEE9DD`; penbey `#5A2620`; viền cửa `#1B1716`; khung cửa / ban công gỗ đỏ `#8B1E1A`; rèm sọc `#B22A22`/`#1F4E8C`/`#F5F3EE`; mái arga `#A39C90`; chân đá `#8A7F6E`.

### 7. Trang trí
Huy hiệu đồng mạ vàng trên penbey (ít hơn Hồng Cung); rèm vải trên cửa sổ và cửa ra vào; ban công gỗ chạm sơn màu ở tầng trên; trong Đại điện: cột bọc vải / thảm, xà sơn màu, bích hoạ.

### 8. Đề xuất kích thước game
- **Khung hiện tại**: 60 × 30 m, 2 tầng, cao 14 m, bệ 4,2 m.
- **Sai**: 2 tầng (14 m) thì mất hẳn đặc trưng «7 tầng trắng». Rộng 60 m chấp nhận được (Đại điện 27,8 m chỉ là phần giữa). Sâu 30 m vừa đủ chứa Đại điện 25,8 m + 2 tường 2 m — quá sát.
- **Khung đề xuất** [Đề xuất]: **60 × 34 m, cao thân ≈ 24 m + bệ đá 6 m**.
  - Giữ 2 tầng chơi (mỗi 5 m) cho tầng 4 (Đại điện) và tầng 7 (Nhật Quang điện); các tầng còn lại là **mặt đứng giả**: tổng 7 hàng cửa sổ trên ≈ 24 m (≈ 3,4 m mỗi hàng).
  - Đại điện ≈ 28 × 26 m ở giữa, lưới cột 7 gian × 6 gian (≈ 4 m).
  - Tường nghiêng 10 %; chân dày 3 m, đỉnh 2 m.
  - Mặt Đông: 3 thang gỗ song song rộng tổng ≈ 8 m, hai bên là tường penbey đỏ thẫm.

### 9. Nguồn
- https://en.wikipedia.org/wiki/Potala_Palace (mở); https://zh.wikipedia.org/zh-hans/%E5%B8%83%E8%BE%BE%E6%8B%89%E5%AE%AB (mở); https://baike.baidu.com/en/item/Potala%20Palace/985649 (mở); https://www.neac.gov.cn/seac/c103391/202210/1159312.shtml (mở); https://www.sohu.com/a/357211653_162926 (mở)
- Ảnh: https://commons.wikimedia.org/wiki/File:Potala_Palace_from_Shol_on_20_May_2014.jpg ; https://commons.wikimedia.org/wiki/File:Looking_up_at_the_Potala_Palace_from_Shol_on_20_May_2014.jpg (danh mục Potala Palace, đã mở danh mục; danh mục con «White Palace» có 33 file nhưng chưa đọc được tên)

---

## printing — Ấn Kinh Viện

### 1. Nguyên mẫu thật
**Shöl Parkhang (ཞོལ་པར་ཁང་, 雪印经院)**, nhà in kinh của chính quyền Ganden Phodrang ở góc Đông Nam làng Shöl, lập khoảng 1690 dưới Đạt Lai thứ 5 (THL-PRINT, TOL-PRINT).
Tên đầy đủ: Zhol Parkhang Shar Ganden Phuntsok Ling — «Ấn kinh viện Đông Shöl». Thập niên 1920 Đạt Lai thứ 13 lập thêm một nhà in lớn hơn (Ấn kinh viện Tây) (PRM, THL-PRINT).
Nguyên mẫu chọn: **Ấn kinh viện Đông** (có số đo).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Số tầng | 2 | [Đo] | THL-PRINT, TOL-PRINT |
| Kiểu | nhà có sân trong (courtyard) | [Đo] | THL-PRINT |
| Vật liệu | đá và gạch mộc | [Đo] | THL-PRINT |
| Diện tích sàn | 760 m² | [Đo] | BD-SHOL (trích trong kết quả tìm) |
| Diện tích chiếm đất | ≈ 380 m² | [Suy] 760 / 2 tầng | |
| Kích thước ngoài | ≈ 20 × 19 m (vd 20 × 19 = 380 m²) | [Suy] giả định gần vuông | |
| Nhà in Derge (so sánh, không phải nguyên mẫu) | 3 tầng, 5 886 m², có sân | [Đo] | Rubin Museum (kết quả tìm) — **không** dùng cho Shöl |

### 3. Cấu trúc từ dưới lên
1. Nền đá thấp (làng Shöl ở chân núi, nền bằng).
2. Thân 2 tầng: tường đá dưới, gạch mộc trên, nghiêng nhẹ (nhà thường 2–5 %).
3. Sàn / mái: lưới cột gỗ ≈ 2 m, xà, rui, đất, arga.
4. Diềm: là cơ quan chính quyền – tôn giáo nên có thể có penbey mỏng; **chưa có nguồn xác nhận** penbey trên nhà in Shöl → [Đề xuất] dùng tường chắn mái nâu đỏ (không bó cành) cho chắc.
5. Mái bằng arga.

### 4. Mặt bằng
Vòng nhà quanh sân trong: tầng dưới là kho ván khắc gỗ (dãy giá dài), tầng trên là phòng in / đóng sách, hành lang gỗ mở vào sân. Cổng vào giữa một cạnh (không có nguồn hướng cổng).

### 5. Cấu kiện nhận diện
1. Khối trắng 2 tầng, sân trong, tường nghiêng nhẹ.
2. Cửa sổ viền đen hình thang, rèm vải.
3. Hành lang gỗ đỏ quanh sân ở tầng trên.
4. Bên trong: giá ván khắc kinh xếp kín tường (dấu hiệu chức năng).

### 6. Vật liệu và màu
Tường trắng `#EEE9DD`; chân đá `#8A7F6E`; viền cửa `#1B1716`; gỗ hành lang `#8B1E1A`; tường chắn mái nâu đỏ `#6A2E24`; sân arga `#A39C90`.

### 7. Trang trí
Đơn giản. Rèm vải sọc trên cửa; đầu rui sơn 5 màu dưới lanh tô; cửa gỗ đỏ có đinh / bản lề sắt đen.

### 8. Đề xuất kích thước game
- **Khung hiện tại**: 40 × 18 m, 2 tầng, cao 8 m — diện tích chiếm đất 720 m², gần **gấp đôi** thật (≈ 380 m²); dạng thanh dài không có sân.
- **Khung đề xuất** [Đề xuất]: **22 × 20 m**, sân trong 8 × 7 m, 2 tầng chơi = 4 hàng cửa sổ, cao thân ≈ 8 m + tường chắn 0,8 m.

### 9. Nguồn
- https://places.kmaps.virginia.edu/features/27418 (mở)
- https://treasuryoflives.org/bo/institution/Shol-Printery (tìm); https://web.prm.ox.ac.uk/tibet/photo_BMR.6.8.167.html (tìm); https://baike.baidu.com/item/%E5%B8%83%E8%BE%BE%E6%8B%89%E5%AE%AB%E9%9B%AA%E5%9F%8E (tìm)
- https://en.wikipedia.org/wiki/Zhol_Village (mở — danh sách công trình trong Shöl)
- Ảnh: https://commons.wikimedia.org/wiki/File:%E9%9B%AA%E5%9F%8E_-_panoramio.jpg ; https://commons.wikimedia.org/wiki/File:Tibet_-_Lhasa_and_Shol_from_Potala_Palace_in_2011.jpg (danh mục Shol)

---

## sholoffice — Shöl Lekhung

### 1. Nguyên mẫu thật
**Shöl Lekhung (ཞོལ་ལས་ཁུངས་, 雪巴列空)** — «văn phòng Shöl», cơ quan của chính quyền cũ quản lý làng Shöl và 18 dzong (huyện / trang viên) quanh Lhasa, phục vụ Đạt Lai và quan hầu (kết quả tìm, trích Baidu / 57tibet).
Cùng khu: toà án (W-ZHOL nhắc «magistrates' court», «five courts»).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Diện tích sàn | 5 280 m² | [Đo] | BD-SHOL (trích) |
| Số tầng | 3, mái bằng | [Đo] | BD-SHOL (trích) |
| Số phòng | 32 | [Đo] | BD-SHOL (trích) |
| Chiếm đất | ≈ 1 760 m² | [Suy] 5 280 / 3 | |
| Kích thước ngoài | ≈ 44 × 40 m có sân | [Suy] giả định vuông có sân | |
| Làng Shöl (để đối chiếu) | 317 × 170 m; 50 000 m²; 22 công trình cổ, tổng 33 470 m² | [Đo] | BD-SHOL, ZHIHU-SHOL, W-ZHOL (50 000 m²) |

### 3. Cấu trúc từ dưới lên
Nền đá bằng → thân 3 tầng tường đá + gạch mộc trắng, nghiêng nhẹ → lưới cột gỗ trong (≈ 2–2,5 m) → mái bằng arga, tường chắn mái → không có mái vàng.

### 4. Mặt bằng
Nhà vòng quanh sân trong (kiểu công sở – nhà quý tộc Lhasa «内院回廊»). 32 phòng chia đều 3 tầng (≈ 10–11 phòng / tầng) [Suy]. Tầng trệt: kho, chuồng; tầng 2–3: công đường, phòng làm việc, hành lang gỗ quay vào sân.

### 5. Cấu kiện nhận diện
1. Khối trắng 3 tầng có sân trong, mặt ngoài nghiêm, ít cửa ở tầng trệt.
2. Cửa sổ viền đen hình thang; tầng trên có cửa lớn hơn / ban công gỗ.
3. Cổng lớn có lanh tô nhiều lớp rui, rèm vải.
4. Tường chắn mái nâu đỏ hoặc đen (công sở, không phải chùa).

### 6. Vật liệu và màu
Như printing; tường chắn mái có thể đen `#2A2422` (YZ cho phép màu đen trên một số công trình).

### 7. Trang trí
Ban công gỗ sơn đỏ, đầu rui 5 màu, rèm cửa sọc; trong: cột gỗ sơn đỏ, đấu và đà cung sơn màu.

### 8. Đề xuất kích thước game
- **Khung hiện tại**: 40 × 18 m, 2 tầng, cao 8 m (chiếm 720 m²) — **nhỏ hơn thật ≈ 2,4 lần**, thiếu 1 tầng, không có sân.
- **Khung đề xuất** [Đề xuất]: **44 × 36 m**, sân trong ≈ 18 × 14 m, 2 tầng chơi + 1 hàng cửa giả = **3 tầng thật** (6 hàng cửa nếu dùng quy tắc 2 hàng / tầng game), cao thân ≈ 10 m. Nếu bản đồ không đủ chỗ: 40 × 30 m, giữ sân và 3 tầng.

### 9. Nguồn
- https://baike.baidu.com/item/%E5%B8%83%E8%BE%BE%E6%8B%89%E5%AE%AB%E9%9B%AA%E5%9F%8E (tìm); https://zhuanlan.zhihu.com/p/392750051 (tìm)
- https://en.wikipedia.org/wiki/Zhol_Village (mở)
- Ảnh: https://commons.wikimedia.org/wiki/File:Magistrates_of_Sho_in_courtroom.jpg (ảnh 1921, toà án Shöl); https://commons.wikimedia.org/wiki/File:Sign_at_Shol_below_Potala,_Lhasa_on_20_May_2014_-_DSC03873.jpg

---

## sholhouse — Nhà Dân Shöl

### 1. Nguyên mẫu thật
**Nhà ở quý tộc / quan lại trong làng Shöl** — ví dụ các dinh Spe Zhi, Mkham Zur, Lungshar được trùng tu năm 2007 (W-ZHOL). Kiểu nhà: **nhà sân trong Lhasa** (2–3 tầng, hành lang vây sân) theo khảo sát Tibet Heritage Fund (THF; sách «The Lhasa House» của André Alexander khảo sát 127 nhà).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Số tầng | 2–3 | [Đo] | MINZU («内院回廊形式，二层或三层») |
| Ô cột | ≈ 2 × 2 m, phòng ở ≈ 4 × 4 m | [Đo] | MINZU, YAM |
| Cao tầng | 2,2–2,4 m | [Đo] | MINZU, YAM |
| Tường | gạch mộc 40–50 cm; đá hộc 50–80 cm; nhà quý tộc 30–70 cm | [Đo] | MINZU, kết quả tìm |
| Thu chân tường nhà dân | ≥ 2–3 % | [Đo] | YZ |
| Mặt tiền nhà lớn (Tromzikhang, ví dụ quý tộc lớn) | 63 m | [Đo] | W-LHASA — **không** dùng làm cỡ nhà dân thường |
| Kích thước nhà Shöl cụ thể | **không tìm được** | — | |

### 3. Cấu trúc từ dưới lên
Móng đá → tầng trệt thấp (chuồng, kho, ít cửa) → tầng 2–3 ở (phòng khách, ngủ, bếp, điện thờ) → cửa sổ lồi rabsel ở tầng trên nhô khỏi tường (sách «Tibetan Houses», kết quả tìm) → sàn / mái: cột 2 m, rui, cành, đất, arga → tường chắn mái **trơn** (không penbey), góc có trụ chữ L, gờ đất nửa tròn (YZ).

### 4. Mặt bằng
Vòng phòng quanh sân trong; giếng và nhà xí ở một góc sân (MINZU). Mặt chính quay Nam, cửa sổ lớn nhất ở tầng trên mặt Nam.

### 5. Cấu kiện nhận diện
1. Khối trắng thấp 2–3 tầng, tường nghiêng nhẹ.
2. Cửa sổ nhỏ viền đen hình thang, có «sừng» ở góc trên.
3. Cửa sổ lồi gỗ (rabsel) tầng trên.
4. Tường chắn mái trơn có trụ góc, **cành cờ cầu nguyện ở 4 góc mái** (TT-FEAT: góc mái hơi nhô, treo cờ).
5. **Không có penbey, không có mái vàng.**

### 6. Vật liệu và màu
Tường trắng `#EEE9DD`; viền cửa `#1B1716`; gỗ cửa / rabsel đỏ `#8B1E1A` hoặc xanh lục; tường chắn mái cùng màu tường hoặc đen; cờ cầu nguyện 5 màu.

### 7. Trang trí
Rèm vải trên cửa; đầu rui 5 màu; cửa đỏ; ký hiệu vẽ vôi trên tường (không có nguồn chi tiết).

### 8. Đề xuất kích thước game
- **Khung hiện tại**: 34 × 14 m, 2 tầng, cao 7 m — dạng thanh dài, không sân.
- **Khung đề xuất** [Đề xuất]: **20 × 18 m**, sân trong 6 × 6 m, 2 tầng chơi = **4 hàng cửa** (≈ 2,5 m mỗi hàng) hoặc 3 hàng nếu muốn đúng 3 tầng thật; cao ≈ 8 m. Nếu cần lấp 34 m chiều dài: làm **2 nhà khác nhau đứng sát nhau** (16 × 14 và 18 × 16), khác số tầng, khác vị trí rabsel — không kéo dài một nhà.

### 9. Nguồn
- https://en.wikipedia.org/wiki/Zhol_Village (mở); http://www.tibetheritagefund.org/page/?r=120 (mở); https://www.sohu.com/a/1013126464_121124715 (mở)
- https://www.minzu56.net/zz/wh/418.html (tìm); https://naturallybread.yam.org.tw/2008-adama/200802tibet-b/200802tibet-b-index.htm (tìm)
- Ảnh: https://commons.wikimedia.org/wiki/File:Shol_in_2006_detail,_Potala4_(cropped).JPG ; https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_135-S-12-09-14,_Tibetexpedition,_Wirtschaftsgeb%C3%A4ude_des_Potala.jpg

---

## seminary — Tăng Học Viện

### 1. Nguyên mẫu thật
Hai lớp nguyên mẫu:
- **Vị trí và hình khối**: **Tse Lobdra (ཙེ་སློབ་གྲྭ, 僧官学校)** — trường đào tạo tăng quan, nằm ở **phía Đông sân Deyang Shar** (HBTM: «东面为僧官学校，南北面为住房»). Không tìm được số đo riêng.
- **Kiểu học viện (dratsang)**: lấy Sera Je và Drepung Gomang để có số đo và mặt bằng điển hình.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Tse Lobdra | không có số | — | |
| Sera Je dratsang | 1 702 m² (nguồn khác 17 000 m² — sai một chữ số); 3 tầng, thêm tầng 4 thế kỷ 18; 100 cột | [Đo] | SERA-TT, kết quả tìm. Chọn 1 702 m² (hợp với «chỉ sau Đại điện ≈ 2 000 m²»). |
| Sera Tsokchen (đại điện) | ≈ 2 000 m², 4 tầng, 125 cột (86 cao + 39 thấp), hiên 10 cột | [Đo] | SERA-W, SERA-TT |
| Drepung Gomang dratsang — kinh đường | 985,5 m² = **Đông–Tây 36,5 m × sâu 27 m**, 102 cột | [Đo] | LASA-DRE, MEET99 |
| Drepung Loseling | sàn ≈ 1 860 m²; kinh đường 1 053 m², 102 cột | [Đo] | LASA-DRE |
| Drepung Ngagpa (mật tông) | kinh đường 467 m², 48 cột; phía trước là sân kín, vây quanh là tăng phòng | [Đo] | LASA-DRE |
| Bố cục chuẩn dratsang Drepung | cổng → hiên trước → kinh đường có giếng trời / cửa mái → Phật điện phía sau | [Đo] | LASA-DRE |
| Lưới cột Gomang | 36,5 × 27 m với 102 cột ≈ 12 × 8,5 cột → khoảng cột ≈ 3,0–3,2 m | [Suy] | |

### 3. Cấu trúc từ dưới lên
Bệ đá + bậc lên hiên → hiên cột gỗ (portico) với tường sơn → kinh đường (dukhang) lưới cột dày, gian giữa nâng cao thành **cửa mái lấy sáng** (clerestory) → Phật điện cao 2–3 tầng phía sau → diềm **penbey** (công trình tôn giáo) → mái bằng arga; điện quan trọng có gyaphib nhỏ + gyaltsen + pháp luân đôi nai.

### 4. Mặt bằng
- Kiểu dratsang: trục dọc vào: hiên (≈ 4 m sâu) → kinh đường vuông / chữ nhật nằm ngang → Phật điện hẹp phía sau.
- Kiểu Tse Lobdra (theo vị trí trong game): một **cánh nhà 2 tầng** chạy dọc cạnh Đông sân Deyang Shar, tầng trệt có hành lang cột mở ra sân.

### 5. Cấu kiện nhận diện
1. Hiên cột gỗ đỏ có đấu + đà cung sơn màu, rèm yak đen treo trước hiên.
2. Diềm penbey nâu đỏ với gương đồng / huy hiệu.
3. Khối nâng giữa mái (cửa mái lấy sáng của kinh đường).
4. Cửa sổ viền đen hình thang.
5. Pháp luân + đôi nai trên mái (dấu hiệu chùa / học viện).

### 6. Vật liệu và màu
Tường trắng `#EEE9DD` (Sera, Drepung chủ yếu trắng); penbey `#5A2620`; cột `#8B1E1A`; đầu cột và đà cung nhiều màu; rèm hiên đen `#1F1A18`; mái vàng nhỏ `#C9A43A`.

### 7. Trang trí
Đấu – đà cung chạm sơn ở hiên; bích hoạ Tứ Thiên Vương ở tường hiên (phổ biến ở hiên điện Tây Tạng — **không có nguồn trong lượt này**, ghi là đề xuất); gương đồng tròn trên penbey.

### 8. Đề xuất kích thước game
- **Khung hiện tại**: 36 × 14 m, 2 tầng, cao 9 m, bệ 2,6 m.
- **Nếu là cánh Tse Lobdra (giữ vị trí cạnh sân)**: khung 36 × 14 hợp lý cho một cánh nhà 2 tầng. Chỉ cần sửa chi tiết: hành lang cột tầng trệt quay ra sân, penbey ở diềm.
- **Nếu là dratsang đúng nghĩa**: [Đề xuất] **36 × 34 m** = hiên 4 m + kinh đường 36 × 24 m (thu từ Gomang 36,5 × 27) + Phật điện sau sâu 6 m; cao thân 10–12 m, gian giữa kinh đường nâng thêm 3 m làm cửa mái.
- Khuyến nghị: giữ 36 × 14 làm **cánh Tse Lobdra**, vì kinh đường 36 × 27 m không vừa cạnh sân.

### 9. Nguồn
- http://www.hbtmjzxh.com/news/show.php?itemid=3554 (tìm)
- https://www.tibettravel.org/tibet-travel-guide/sera-monastery-architecture.html (tìm); https://en.wikipedia.org/wiki/Sera_Monastery (tìm); https://treasuryoflives.org/institution/Sera-Je (tìm)
- https://www.lasa.gov.cn/lasa/tsls/201912/eb5d0d39669141a4b4339d8d3d9374b4.shtml (tìm); https://www.meet99.com/jingdian-lasazhebangsi-50082.html (tìm)
- Ảnh: https://commons.wikimedia.org/wiki/File:Great_Assembly_Hall,_Sera_Monastery,_Lhasa_on_21_May_2014.jpg ; https://commons.wikimedia.org/wiki/File:Great_Assembly_Hall_Drepung_Monastery.jpg ; https://commons.wikimedia.org/wiki/File:Sera_Monastery_-_windows.jpg

---

## dormE — Tăng Phòng Đông

### 1. Nguyên mẫu thật
**Dãy nhà ở 2 tầng vây sân Deyang Shar** (SINA-POT: «广场的左右两侧全为两层楼的僧房所包围»; HBTM: «南北面为住房»). Typology đối chiếu: tăng phòng (khangtsen / shag) của Drepung — sân kín vây bởi phòng tăng (Ngagpa, LASA-DRE).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Số tầng | 2 | [Đo] | SINA-POT |
| Vị trí | hai cạnh Bắc – Nam (hoặc «hai bên») sân Deyang Shar | [Đo] | HBTM, SINA-POT |
| Sân Deyang Shar | 1 500–1 600 m² | [Đo] | BD-POT, HBTM, SLIDE |
| Chiều dài cạnh sân | ≈ 40 m | [Suy] √1 600 | |
| Ô phòng tăng | ≈ 2 × 2 m mỗi «cột»; phòng 1–2 cột | [Suy] theo MINZU | |
| Sâu dãy phòng | ≈ 6–8 m (phòng 4 m + hành lang 2 m + tường) | [Suy] | |

### 3. Cấu trúc từ dưới lên
Nền: chính là mặt sân arga, cao hơn chân núi > 60 m → thân 2 tầng tường trắng → **hành lang cột gỗ** mở ra sân ở tầng trệt hoặc tầng 2 → diềm penbey mảnh (thuộc cung điện) → mái bằng.

### 4. Mặt bằng
Dãy phòng thẳng, mỗi phòng 1 cửa + 1 cửa sổ quay vào sân, hành lang chung phía sân, thang gỗ dốc ở đầu dãy.

### 5. Cấu kiện nhận diện
1. Dãy 2 tầng trắng thấp, mặt sân là hành lang cột gỗ đỏ.
2. Hàng cửa sổ nhỏ đều nhau viền đen.
3. Mái thấp hơn hẳn Bạch Cung (làm nền cho khối lớn).
4. Mặt sân lát arga xám bóng.

### 6. Vật liệu và màu
Tường `#EEE9DD`; cột / lan can `#8B1E1A`; viền cửa `#1B1716`; penbey mảnh `#5A2620`; sân `#A39C90`; tường sân sơn vàng `#D2A23C` (W-LHASA: Deyangshar sơn vàng).

### 7. Trang trí
Rèm vải trên cửa; đầu rui sơn; ít trang trí — là nhà phụ.

### 8. Đề xuất kích thước game
- **Khung hiện tại**: 30 × 14 m, 2 tầng, cao 9 m, bệ 2,6 m.
- Sâu 14 m **dày gấp đôi** dãy tăng phòng thật (≈ 6–8 m). [Đề xuất] **36 × 8 m**, 2 tầng = 4 hàng cửa nhỏ, cao ≈ 7 m, hành lang cột 2 m quay ra sân. Bệ 2,6 m giữ được (là mép sân).

### 9. Nguồn
- https://k.sina.cn/article_6425294870_17efa38160010041v5.html (tìm); http://www.hbtmjzxh.com/news/show.php?itemid=3554 (tìm); https://baike.baidu.com/en/item/Potala%20Palace/985649 (mở); https://en.wikipedia.org/wiki/Architecture_of_Lhasa (mở)
- https://www.lasa.gov.cn/lasa/tsls/201912/eb5d0d39669141a4b4339d8d3d9374b4.shtml (tìm)
- Ảnh: https://commons.wikimedia.org/wiki/File:Lhasa-Drepung-06-Wohnhof-2014-gje.jpg ; https://commons.wikimedia.org/wiki/File:Lhasa-Drepung-10-Wohnhof-2014-gje.jpg (sân tăng xá Drepung)

---

## zhasha — Zhasha (Tăng Xá)

### 1. Nguyên mẫu thật
**Zhasha / Zhaxia (扎厦, «tăng xá»)** của Potala — khu ở của tăng sĩ phục vụ Đạt Lai (Namgyal Dratsang), nằm **phía Tây Hồng Cung**, nối liền với Hồng Cung (ZW-POT, NEAC). Tường trắng nên thường bị coi là một phần Bạch Cung (kết quả tìm).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Vị trí | phía Tây Hồng Cung, «三者相互贯通» | [Đo] | ZW-POT, NEAC |
| Màu / chi tiết | tường đá trắng, khung cửa đen, penbey đỏ | [Đo] | SOHU-POT |
| Số tăng từng ở | «25 000» | [Đo] nghi sai | ZW-POT. Con số này rất khó tin cho một khu trong Potala; **không dùng** cho quy mô. |
| Số tầng, kích thước | **không tìm được** | — | |
| Typology đối chiếu | Drepung: hơn 50 khangtsen; Ngagpa có sân kín vây bởi tăng phòng | [Đo] | LASA-DRE, kết quả tìm |

### 3. Cấu trúc từ dưới lên
Tường đá chân (地垄墙) bám sườn Tây núi → nhiều tầng phòng nhỏ trắng **bậc theo sườn** (mỗi bậc là một dãy, mái bậc dưới là sân của bậc trên) → cửa sổ nhỏ dày đặc → diềm penbey → mái bằng.

### 4. Mặt bằng
Không có nguồn mặt bằng. [Suy từ typology] các dãy phòng 1–2 «cột» quanh sân nhỏ / hành lang, nối với Hồng Cung bằng hành lang ở nhiều cao độ.

### 5. Cấu kiện nhận diện
1. Khối trắng **nhiều bậc** theo sườn, thấp hơn và sát cạnh Tây Hồng Cung.
2. Hàng cửa sổ nhỏ dày, đều.
3. Dải penbey nâu đỏ ở diềm (khác nhà dân).
4. Không có mái vàng.

### 6. Vật liệu và màu
Như dormE; không dùng màu vàng sân.

### 7. Trang trí
Ít; rèm vải trên cửa; gương đồng trên penbey (không chắc).

### 8. Đề xuất kích thước game
- **Khung hiện tại**: 50 × 16 m, 2 tầng, cao 10 m, bệ 3,4 m — một hộp phẳng.
- [Đề xuất] giữ chiều dài 50 m nhưng làm **3 bậc**: bậc dưới 50 × 10 m cao 7 m; bậc giữa 42 × 10 m cao thêm 6 m, lùi 8 m vào sườn; bậc trên 30 × 8 m cao thêm 5 m. Tổng sâu ≈ 26 m, tổng cao ≈ 18 m, **luôn thấp hơn khối đỏ T6** của Hồng Cung. Cửa sổ 2 hàng mỗi bậc.

### 9. Nguồn
- https://zh.wikipedia.org/zh-hans/%E5%B8%83%E8%BE%BE%E6%8B%89%E5%AE%AB (mở); https://www.neac.gov.cn/seac/c103391/202210/1159312.shtml (mở); https://www.sohu.com/a/357211653_162926 (mở)
- https://www.lasa.gov.cn/lasa/tsls/201912/eb5d0d39669141a4b4339d8d3d9374b4.shtml (tìm)
- Ảnh: https://commons.wikimedia.org/wiki/File:Potala_Palace_Lhasa_Tibet_Autonomous_Region_China_%E8%A5%BF%E8%97%8F_%E6%8B%89%E8%90%A8_%E5%B8%83%E8%BE%BE%E6%8B%89%E5%AE%AB_-_panoramio_(7).jpg (danh mục Red Palace — chưa xem, cần chọn ảnh thấy cánh Tây)

---

## lukhang — Lukhang

### 1. Nguyên mẫu thật
**Lukhang (ཀླུ་ཁང་, 龙王潭 / 宗角禄康)** — «điện Long Vương / Lu», trên đảo giữa hồ phía sau (Bắc) Potala. Hồ hình thành do đào đất xây Potala (1654–1692). Gian thờ đầu tiên khoảng 1700 dưới Đạt Lai thứ 6; công trình **mandala hiện nay hoàn thành 1791** dưới Đạt Lai thứ 8 (SHALU).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Đảo | tròn, đường kính ≈ 40 m | [Đo] | SHALU, DZOG |
| Hồ | chữ nhật 270 × 112 m | [Đo] | SHALU, DZOG |
| Cầu | cầu đá vòng kiểu Hán dài 24,67 m; 5 lỗ, rộng > 3 m | [Đo] | SHALU (24,67 m); TD-LUK (5 lỗ, > 3 m, > 20 m) |
| «Diện tích bề mặt điện» | 3 700 m² | [Đo] mơ hồ | SHALU. Lớn hơn cả đảo (≈ 1 257 m²) → chắc là tổng diện tích sàn hoặc gồm cả khu xung quanh. **Không dùng** cho kích thước điện. |
| Số tầng | 3 (cùng trang có chỗ ghi 4) | [Đo] mâu thuẫn | SHALU; ZW-POT, BD-POT: «三层». **Chọn 3.** |
| Mặt bằng | mandala, 4 cửa, hành lang ngoài (mda' yab) | [Đo] | SHALU |
| Mái | «mái lục giác kiểu Mông Cổ» (hor phibs tog can) | [Đo] | SHALU. ZW-POT / BD-POT gọi là «đình lưu ly bát giác 3 tầng». **Mâu thuẫn**: chọn SHALU (nguồn khảo cổ chuyên ngành). |
| Hướng | quay Nam | [Đo] | SHALU |
| Tầng 1 / 2 / 3 | kiểu Tây Tạng (thờ Lu) / kiểu Hán (thờ chúa Lu, tượng ĐL6, Padmasambhava) / thiền thất dưới mái Mông Cổ, bích hoạ Dzogchen | [Đo] | squarespace PDF «Tibet's Secret Temple» (tìm), TF-LUK |
| Trùng tu 1984–85 | bỏ nhiều kết cấu gốc, đổ sàn và cột bê tông | [Đo] | SHALU |
| Kích thước điện | **không tìm được** | — | |

### 3. Cấu trúc từ dưới lên
Đảo đất có kè đá → bệ thấp → tầng 1 vuông (mandala) có hành lang ngoài và 4 cửa → tầng 2 nhỏ hơn, lùi vào → tầng 3 nhỏ nhất (phòng riêng Đạt Lai) → mái lục giác vàng kiểu Mông Cổ / Hán có chóp. Tường trắng / vàng, diềm penbey, cột gỗ hành lang.

### 4. Mặt bằng
Vuông đối xứng 4 hướng (mandala), cửa giữa mỗi cạnh, hành lang bao quanh tầng 1. Cầu vào từ bờ Nam (điện quay Nam; [Suy] cầu ở phía Nam vì lối vào chính).

### 5. Cấu kiện nhận diện
1. **Nằm trên đảo tròn giữa hồ**, cầu đá vòng 5 lỗ.
2. 3 tầng **thu nhỏ dần** (đây là công trình duy nhất trong bộ được thu bậc theo tầng).
3. Mái chóp lục giác vàng trên cùng.
4. Hành lang cột bao tầng 1.
5. Cây liễu cổ vây quanh (Lukhang «nổi lên giữa lùm liễu» — kết quả tìm squarespace PDF).

### 6. Vật liệu và màu
Tường vôi trắng / vàng nhạt; penbey `#5A2620`; cột hành lang `#8B1E1A`; mái vàng `#C9A43A`; cầu đá xám `#9A948A`; nước hồ xanh lục.

### 7. Trang trí
Bích hoạ Dzogchen tầng 3 (nổi tiếng); tượng Lu; huy hiệu vàng trên penbey; chuông gió ở góc mái.

### 8. Đề xuất kích thước game
- **Khung hiện tại**: 20 × 16 m, 2 tầng, cao 8 m, bệ 1,6 m, đặt **trên bờ** (x = −195, z = −205); trong khi hồ có đảo r = 12 m với «Hồ Tâm Đình».
- **Sai lớn**: Lukhang thật **nằm trên đảo**. Mặt bằng 20 × 16 không vuông — phá mandala. Thiếu 1 tầng.
- [Đề xuất]:
  - **Chuyển Lukhang lên đảo**, bỏ «Hồ Tâm Đình» (hoặc biến Hồ Tâm Đình thành Lukhang).
  - Điện **16 × 16 m** (tầng 1 kể cả hành lang), tầng 2 **11 × 11 m**, tầng 3 **7 × 7 m**; cao ≈ 4 + 3,5 + 3 m + mái 3 m ≈ **13,5 m**. (Kích thước là đề xuất; thật chưa có số.)
  - Đảo: đường kính **≥ 30 m** (thật 40 m; khung hiện tại 24 m quá nhỏ cho điện 16 m).
  - Hồ: chữ nhật tỉ lệ **2,4 : 1** (270 : 112). Hiện là elip 220 × 60 (3,7 : 1, quá dẹt, sai hình). Đề xuất chữ nhật bo góc 220 × 92 m.
  - Cầu: 25 m, 5 lỗ, rộng 3,5 m — khung hiện tại 26 × 4 m đã đúng.

### 9. Nguồn
- https://www.asianart.com/associations/shalu/lukhang/index.html (mở)
- https://pdfcoffee.com/the-dzogchen-murals-of-the-lukhang-in-lhasa-pdf-free.html (tìm); https://www.tibetdiscovery.com/what-to-see/zongjiao-lukang-park/ (tìm); https://www.tibetfocus.travel/attractions-in-tibet/lhasa/lukhang-temple/ (tìm)
- https://zh.wikipedia.org/zh-hans/%E5%B8%83%E8%BE%BE%E6%8B%89%E5%AE%AB (mở); https://baike.baidu.com/en/item/Potala%20Palace/985649 (mở)
- Ảnh (danh mục «Dzongyab Lukhang», đã mở danh mục): https://commons.wikimedia.org/wiki/File:Lhukhang1.JPG ; https://commons.wikimedia.org/wiki/File:Lhukhang3.JPG ; https://commons.wikimedia.org/wiki/File:%E6%B9%96%E5%BF%83%E5%B0%8F%E5%B2%9B_-_panoramio.jpg

---

## summit — Vọng Sơn Đình

### 1. Nguyên mẫu thật
Tên gán chung. Trên Marpo Ri thật không có «đình ngắm cảnh» riêng; đỉnh núi chính là Potala. Hai lựa chọn có thật:
- **(A, khuyến nghị) Một gyaphib đơn lẻ** — đình mái vàng kiểu Hán đặt trên khối tường Tây Tạng, như các điện mái vàng trên mái Hồng Cung (ZW-POT, SOHU-POT). Đây là hình ảnh «đình» đúng nhất mà kiến trúc Potala có.
- **(B) Chorten trên sống núi** — ảnh 1904 và 1938 cho thấy một trong ba chorten nhóm Pargo Kaling **đứng trên sống thấp của Marpo Ri** (PARGO).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Kiểu mái gyaphib | yết sơn đơn diêm, đấu củng gỗ, ngói đồng mạ vàng; hoặc lục giác | [Đo] | ZW-POT, SOHU-POT |
| Thông thuỷ dưới mái vàng | ≈ 2 m; cột ≈ 2 m | [Đo] | YZ |
| Kích thước một gyaphib | **không tìm được** | — | |
| Chorten Kadampa (B) | cao : chân ≈ 1,9–2,8 : 1 (mẫu bảo tàng) | [Suy] từ số đo hiện vật | ASHMO, kết quả tìm Smithsonian / Backman |

### 3. Cấu trúc từ dưới lên
(A) Bệ đá → khối tường vuông Tây Tạng thấp (1 tầng, nghiêng, viền cửa đen) → dải penbey → đấu củng → mái yết sơn vàng đơn diêm → bờ nóc có bình báu ở giữa, makara hai đầu → gyaltsen 4 góc.

### 4. Mặt bằng
Vuông, 1 phòng; cửa giữa mặt chính; hiên nhỏ 2 cột.

### 5. Cấu kiện nhận diện
1. Thân tường trắng/đỏ có viền cửa đen (không phải đình cột trống kiểu Hán).
2. Dải penbey dưới mái.
3. Mái vàng yết sơn đơn diêm với 4 gyaltsen.

### 6. Vật liệu và màu
Thân đỏ `#8E2A22` (vì là điện) hoặc trắng; penbey `#5A2620`; mái `#C9A43A`; đấu củng xanh / lục / đỏ.

### 7. Trang trí
Bình báu nóc, makara bờ, chuông gió, gyaltsen; cờ cầu nguyện căng từ đỉnh đồi xuống (lung-ta) — đề xuất cảnh quan.

### 8. Đề xuất kích thước game
- **Khung hiện tại**: 9 × 9 m, cao 3,6 m, **bát giác** (octa = true vì fam 'asian').
- [Đề xuất] **vuông** 9 × 9 m (bỏ bát giác — không có gốc Tây Tạng), thân tường cao 3,5 m, penbey 0,8 m, mái yết sơn cao ≈ 3 m → tổng ≈ 7,5 m; mái vươn ≈ 1 m.

### 9. Nguồn
- https://zh.wikipedia.org/zh-hans/%E5%B8%83%E8%BE%BE%E6%8B%89%E5%AE%AB (mở); https://www.sohu.com/a/357211653_162926 (mở); https://www.sohu.com/a/1013126464_121124715 (mở)
- https://en.wikipedia.org/wiki/Pargo_Kaling (tìm); http://www.jameelcentre.ashmolean.org/collection/7/680/681/all/per_page/50/offset/0/sort_by/seqn./object/11319 (tìm)
- Ảnh: https://commons.wikimedia.org/wiki/File:Potala_Palace_center_front_detail_on_20_May_2014.jpg (mái vàng trên Hồng Cung — chưa xem)

---

## deyang — Đài Deyang Shar

### 1. Nguyên mẫu thật
**Deyang Shar (བདེ་ཡངས་ཤར, 德央厦 / 东欢乐广场)** — sân lớn ở lưng chừng núi, trước cổng chính Bạch Cung, nơi Đạt Lai xem múa cham và kịch Tây Tạng dịp lễ (ngày 29 tháng 12 lịch Tạng) (BD-POT, kết quả tìm). Đây là **một cái sân**, không phải một đình.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Diện tích | 1 600 m² (một nguồn: > 1 500 m²) | [Đo] | SLIDE, SOHU-POT, kết quả tìm: 1 600; BD-POT, HBTM: > 1 500. Chọn **1 600**. |
| Cao hơn mặt đất | > 60 m | [Đo] | kết quả tìm |
| Lát | đất arga nện | [Đo] | SOHU-POT, kết quả tìm |
| Bao quanh | Tây: Bạch Cung; Đông: trường tăng quan; Bắc–Nam: nhà ở / tăng phòng 2 tầng | [Đo] | HBTM, SINA-POT |
| Màu | sân «sơn vàng» | [Đo] | W-LHASA |
| Lối lên Bạch Cung | 3 thang gỗ song song ở cạnh Tây; thang giữa riêng cho Đạt Lai | [Đo] | kết quả tìm |
| Kích thước cạnh | ≈ 40 × 40 m | [Suy] √1 600 | |

### 3. Cấu trúc từ dưới lên
Tường chắn đá nghiêng (là chân Bạch Cung / sườn núi) → mặt sân arga phẳng → vây 3 phía bằng nhà 2 tầng, phía Tây là mặt Bạch Cung 7 tầng → giữa sân trống (chỗ múa).

### 4. Mặt bằng
Sân gần vuông ≈ 40 × 40 m. Cạnh Tây: chân Bạch Cung với 3 thang gỗ. Cạnh Đông: Tse Lobdra (seminary). Cạnh Bắc/Nam: tăng phòng (dormE). Lối vào: đường dốc chữ Z từ Shöl lên tới cổng phía Đông/Nam sân.

### 5. Cấu kiện nhận diện
1. Mặt sân rộng, phẳng, lát arga xám bóng — **trống ở giữa**.
2. Ba thang gỗ song song dốc lên cửa Bạch Cung, hai bên tường penbey đỏ thẫm.
3. Nhà 2 tầng thấp vây ba phía, tường sân sơn vàng.
4. Cột cờ / darchen ở sân (đề xuất; không có nguồn vị trí).

### 6. Vật liệu và màu
Sân `#A39C90`; tường bao vàng `#D2A23C`; thang gỗ `#6B3A22`; tường penbey bên thang `#4E1F1A`.

### 7. Trang trí
Rèm yak đen lớn trên cửa Bạch Cung; dịp lễ treo thangka; lư hương (sang-khang) — đề xuất.

### 8. Đề xuất kích thước game
- **Khung hiện tại**: pav 12 × 12 m (một «đài») + yard 100 × 30 m.
- **Sai**: Deyang Shar không phải đình. Yard 100 × 30 m (3 000 m², rất dẹt) gần gấp đôi diện tích thật và sai tỉ lệ (thật ≈ vuông).
- [Đề xuất]: đổi yard thành **≈ 44 × 40 m** (≈ 1 760 m², thu phóng 1,1); **bỏ pav 12 × 12**, thay bằng **cụm 3 thang gỗ** rộng tổng 8 m, dốc ≈ 45°, đặt ở cạnh Tây sát mặt Bạch Cung. Nếu vẫn cần một vật thể «đài»: một bệ đá thấp 12 × 12 × 0,6 m ở giữa sân (sân khấu múa cham) — **ghi rõ là bổ sung game**, không có nguồn.

### 9. Nguồn
- https://baike.baidu.com/en/item/Potala%20Palace/985649 (mở); https://www.sohu.com/a/357211653_162926 (mở); https://en.wikipedia.org/wiki/Architecture_of_Lhasa (mở)
- http://www.hbtmjzxh.com/news/show.php?itemid=3554 (tìm); https://k.sina.cn/article_6425294870_17efa38160010041v5.html (tìm); https://www.slideshare.net/slideshow/potala-palace/191271512 (tìm)
- Ảnh: chưa tìm được file tên «Deyang Shar» trong phần danh mục đọc được; danh mục https://commons.wikimedia.org/wiki/Category:Potala_Palace (mở) — cần xem tiếp phần sau của danh mục.

---

## gate1 — Môn Lâu Shöl

### 1. Nguyên mẫu thật
**Cổng thành Shöl** — mỗi cạnh Đông, Nam, Tây của tường thành Shöl có một **môn lâu 3 tầng**; góc Đông Nam và Tây Bắc có lầu góc (BD-POT, kết quả tìm). Cổng chính là cổng Nam (W-ZHOL). Xây lại cùng tường thành từ 1645 (kết quả tìm, trích Baidu).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Số tầng môn lâu | 3 | [Đo] | BD-POT, ZW-POT |
| Tường thành | cao 6 m, chân 4,4 m, đỉnh 2,8 m; đất nện bọc gạch đá | [Đo] | BD-POT, ZW-POT |
| Thu tường thành | (4,4 − 2,8) / 2 / 6 = 13 % mỗi mặt (≈ 7,6°) | [Suy] | từ số trên, nếu thu đều hai mặt |
| Kích thước môn lâu | **không tìm được** | — | |
| Sâu môn lâu | ≥ 4,4 m (phải chứa chân tường) | [Suy] | |

### 3. Cấu trúc từ dưới lên
Chân tường thành đất nện bọc đá → lối cổng xuyên tường (cửa gỗ 2 cánh) → 2 tầng phòng gác phía trên → diềm (penbey hoặc tường chắn nâu đỏ) → mái bằng, có thể có cờ.

### 4. Mặt bằng
Khối chữ nhật vắt ngang tường thành, lối qua ở giữa; thang lên tầng ở bên trong.

### 5. Cấu kiện nhận diện
1. Khối trắng 3 tầng nghiêng, cao hơn tường thành 6 m rõ rệt.
2. Lỗ cổng giữa, cửa gỗ đỏ đinh sắt.
3. Cửa sổ nhỏ viền đen ở hai tầng trên.
4. Liền với tường thành trắng có mặt nghiêng.

### 6. Vật liệu và màu
Tường `#EEE9DD`; chân đá `#8A7F6E`; cửa `#8B1E1A`; viền `#1B1716`; diềm `#5A2620`.

### 7. Trang trí
Rèm trên cửa, đầu rui sơn; ít hoa văn.

### 8. Đề xuất kích thước game
- **Khung hiện tại**: 9 × 7 m. Tường thành game wallH = 7 m (thật 6 m).
- [Đề xuất] **12 × 8 m, cao ≈ 11 m (3 tầng × 3,6 m)**, lối cổng rộng 4 m cao 4,5 m. Lý do: khối phải cao hơn hẳn tường 7 m và sâu hơn bề dày tường. Tường thành Shöl trong game nên dày ≈ 4 m ở chân, 2,6 m ở đỉnh (hiện wallT = 1,6 m quá mỏng cho tường đất Tây Tạng).

### 9. Nguồn
- https://baike.baidu.com/en/item/Potala%20Palace/985649 (mở); https://zh.wikipedia.org/zh-hans/%E5%B8%83%E8%BE%BE%E6%8B%89%E5%AE%AB (mở); https://en.wikipedia.org/wiki/Zhol_Village (mở)
- Ảnh: https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_135-S-12-28-10,_Tibetexpedition,_Blick_auf_Potala.jpg ; https://commons.wikimedia.org/wiki/File:Panorama_of_Lhasa_in_1942,_with_the_Potala_Palace_at_the_upper_left.jpg (danh mục Shol)

---

## ramp1 — Đình Lưng Dốc

### 1. Nguyên mẫu thật
Tên gán chung, đặt bên đường dốc chữ Z. Nguyên mẫu đề xuất: **Pargo Kaling (Barkor Chorten, 查果嘎林)** — **chorten cổng** vắt ngang đường, có lối qua giữa thân, là «Cổng Tây» của Lhasa dẫn vào làng Shöl, giữa Marpo Ri và Chakpori (PARGO). Bị phá 1967, xây lại 1995. Là một trong ba chorten (hai cái còn lại trên sống Marpo Ri và Chakpori).
Lý do chọn: đây là vật đánh dấu đường vào Shöl có thật, nổi tiếng nhất; Potala không có «đình» bên đường dốc.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Kích thước Pargo Kaling | **không tìm được** | — | |
| Bản 1995 nhỏ hơn bản gốc | chỉ có 1 nguồn mạng xã hội | không tin | kết quả tìm (X) |
| Tỉ lệ chorten Kadampa | cao : rộng chân ≈ 1,9–2,8 : 1; thân bầu chuông, 13 vòng (bhumi), lọng, đỉnh búp sen / nhật nguyệt | [Đo hiện vật] | ASHMO, HUNT, kết quả tìm |

### 3. Cấu trúc từ dưới lên
Khối đế vuông (có vòm lối đi xuyên qua) → bậc thềm 3–4 cấp → thân bình (bumpa) trắng → harmika vuông → trụ 13 vòng → lọng → nhật nguyệt + búp đỉnh vàng.

### 4. Mặt bằng
Đế vuông, lối đi qua giữa theo trục đường. Trần lối đi có thể vẽ mandala (thường gặp ở chorten cổng — không có nguồn trong lượt này).

### 5. Cấu kiện nhận diện
1. Chorten trắng **đứng trên lối đi** — người đi xuyên qua đế.
2. 13 vòng côn trên thân.
3. Đỉnh nhật nguyệt vàng.

### 6. Vật liệu và màu
Vôi trắng `#F2EFE6`; vòng và đỉnh mạ vàng `#C9A43A`; dải trang trí đỏ `#8E2A22`.

### 7. Trang trí
Cờ cầu nguyện căng từ đỉnh; đá mani khắc chữ quanh chân (đề xuất).

### 8. Đề xuất kích thước game
- **Khung hiện tại**: 8 × 8 m, cao 3,6 m (đình).
- [Đề xuất] đế **8 × 8 m**, cao đế 4 m có lối qua rộng 3,5 m (vừa lối dốc rộng 6 m nếu đặt lệch, hoặc nới đế 10 × 10 để vắt cả lối); tổng cao ≈ **16–18 m** (≈ 2 × cạnh đế, theo tỉ lệ Kadampa). Lưu ý: game đã có `stupas` 9–12 m — chorten cổng phải **khác hình** (đế có vòm) để không lặp.

### 9. Nguồn
- https://en.wikipedia.org/wiki/Pargo_Kaling (tìm)
- http://www.jameelcentre.ashmolean.org/collection/7/680/681/all/per_page/50/offset/0/sort_by/seqn./object/11319 (tìm); https://huntingtonarchive.org/Exhibitions/PDFs/Tibet%20PDFs/Stupas/Kadam%20Chorten%20(Stupa).pdf (tìm)
- Ảnh (danh mục «Pargo Kaling», đã mở danh mục): https://commons.wikimedia.org/wiki/File:037_Pardo_Kaling_Chorten_Stupa,_Lhasa,_Tibet.jpg ; https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_135-S-12-29-20,_Tibetexpedition,_Lhasa,_Torch%C3%B6rten.jpg ; https://commons.wikimedia.org/wiki/File:Lhasa_gateway_1905.png

---

## lake1 — Đình Ven Hồ

### 1. Nguyên mẫu thật
Tên gán chung. Nguyên mẫu đề xuất: **đình kiểu Hán ven hồ ở Norbulingka** — khu hồ Tsokyil Phodrang (措吉颇章, «Cung giữa hồ»), xây dưới Đạt Lai thứ 8 (một nguồn ghi 1781), có đình mái vàng, lan can đá, cầu đá (NORBU, kết quả tìm). Cùng thời và cùng nhà bảo trợ với Lukhang 1791.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Hồ Tsokyil | chữ nhật, 3 đảo vuông, 2 cầu đá | [Đo] | NORBU, kết quả tìm |
| Đình | lan can đá bao quanh; mái vàng ngói đồng; kiểu Hán (mái góc vểnh) | [Đo] | NORBU |
| Kích thước đình | **không tìm được** | — | |
| Norbulingka | ≈ 36 ha | [Đo] | W-LHASA |

### 3. Cấu trúc từ dưới lên
Bệ đá có lan can đá → 4 hoặc 8 cột gỗ đỏ → xà, đấu củng → mái vàng kiểu Hán, góc vểnh nhẹ → bình báu nóc.

### 4. Mặt bằng
Vuông, mở 4 phía, bệ nhô ra mặt nước một cạnh.

### 5. Cấu kiện nhận diện
1. Đình **cột trống** mái vàng (khác hẳn khối tường Tây Tạng — đây là thứ «Hán hoá» duy nhất ở vườn).
2. Lan can đá quanh bệ.
3. Đặt sát mép nước, có liễu.

### 6. Vật liệu và màu
Cột `#8B1E1A`; mái `#C9A43A` (hoặc ngói xanh lục nếu muốn khác mái vàng cung điện — không có nguồn); lan can đá trắng xám `#CFCAC0`.

### 7. Trang trí
Đấu củng sơn màu kiểu Tây Tạng (lục – lam – đỏ), rèm vải dưới xà.

### 8. Đề xuất kích thước game
- **Khung hiện tại**: 9 × 9 m, cao 3,6 m — hợp lý. [Đề xuất] 9 × 9 m, cột cao 3 m, mái cao ≈ 2,5 m, vươn mái ≈ 1,2 m, bệ 0,6 m. Không bát giác.

### 9. Nguồn
- https://www.chinahighlights.com/lhasa/attraction/norbulingka.htm (tìm); https://en.wikipedia.org/wiki/Architecture_of_Lhasa (mở)
- Ảnh (danh mục «Norbulingka», đã mở danh mục): https://commons.wikimedia.org/wiki/File:LuoBuLinKa_Lake.jpg ; https://commons.wikimedia.org/wiki/File:Norbulinga_Kalsang_Phodrang.jpg

---

## lake2 — Đình Liễu

### 1. Nguyên mẫu thật
Tên gán chung. Nguyên mẫu đề xuất: **đình nhỏ trong vườn Zongjiao Lukhang** (vườn quanh hồ Lukhang sau Potala), giữa hàng liễu cổ. Danh mục Commons «Dzongyab Lukhang» có ảnh «海边式凉亭» (đình nghỉ ven nước) và «古树» (cây cổ).
Khác lake1 ở chỗ: lake2 là **đình nghỉ đơn giản trong vườn công cộng** (Lukhang park), thấp, ít vàng; lake1 là đình cung đình Norbulingka.

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Kích thước | **không tìm được** | — | |
| Cảnh quan | Lukhang «nổi lên giữa lùm liễu» | [Đo, định tính] | squarespace PDF (tìm) |

### 3. Cấu trúc từ dưới lên
Bệ đá thấp → 4 cột gỗ → xà → mái (Hán, đơn giản) → không có gyaltsen.

### 4. Mặt bằng
Vuông, mở 4 phía, ghế dọc lan can.

### 5. Cấu kiện nhận diện
1. Đình nhỏ dưới tán **liễu rủ** (cây là phần chính).
2. Mái đơn giản, màu trầm hơn mái vàng cung điện.

### 6. Vật liệu và màu
Cột đỏ `#8B1E1A`; mái ngói đồng xỉn hoặc vàng xỉn `#A88A3A`; bệ đá `#9A948A`.

### 7. Trang trí
Cờ cầu nguyện căng giữa các cây liễu (cảnh thường thấy ở vườn Lukhang — **không có nguồn trong lượt này**, ghi là đề xuất).

### 8. Đề xuất kích thước game
- **Khung hiện tại**: 8 × 8 m. [Đề xuất] **6 × 6 m**, cao ≈ 5 m (nhỏ hơn lake1 để phân cấp), 3–5 cây liễu cao 10–14 m vây quanh.

### 9. Nguồn
- https://www.asianart.com/associations/shalu/lukhang/index.html (mở)
- Ảnh (danh mục «Dzongyab Lukhang»): https://commons.wikimedia.org/wiki/File:%E6%B5%B7%E8%BE%B9%E5%BC%8F%E5%87%89%E4%BA%AD_-_panoramio.jpg ; https://commons.wikimedia.org/wiki/File:%E5%8F%A4%E6%A0%91_-_panoramio_(1).jpg

---

## east1 — Đình Kinh Luân

### 1. Nguyên mẫu thật
**Mani Lhakhang (མ་ཎི་ལྷ་ཁང་)** — điện nhỏ chứa **một bánh xe cầu nguyện (mani dungkhor) lớn** quay gần liên tục. Hai nguyên mẫu ở Lhasa:
- Mani Lhakhang trên đường kora quanh Potala, **phía Đông Potala** (LP-MANI) — khớp vị trí «Đông» của east1.
- Barkor Mani Lhakhang (Jokhang): «toà nhà vuông trắng, quanh là bánh xe cầu nguyện, trước có lư hương lớn» (TTE-MANI); bản gốc thế kỷ 18, phá 1960, dựng lại 1989 (TOL-MANI).
Thêm: hàng bánh xe cầu nguyện nhỏ chạy dọc tường (Jokhang có 380 bánh xe quanh điện chính — kết quả tìm Baidu Jokhang).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| Kích thước điện / bánh xe | **không tìm được** | — | |
| Cơ chế | có tay cầm ở đáy, đủ tốc độ thì gõ chuông nhỏ phía trên | [Đo] | kết quả tìm (tổng hợp) |
| Hàng bánh xe nhỏ quanh Jokhang | 380 bánh | [Đo] | kết quả tìm (Baidu Jokhang) |

### 3. Cấu trúc từ dưới lên
Bệ thấp → khối tường trắng (hoặc đỏ) vuông 1 tầng, cửa rộng → bên trong 1 bánh xe lớn trên trục đứng, khoảng trống đi vòng quanh → mái bằng (hoặc mái vàng nhỏ — bảo tàng NMS dựng bản sao «đỏ, mái vàng, 5 bánh xe», tìm) → chuông trên trục.

### 4. Mặt bằng
Vuông; bánh xe ở tâm; lối đi vòng **theo chiều kim đồng hồ** quanh bánh xe; dọc tường ngoài có thể gắn hàng bánh xe nhỏ.

### 5. Cấu kiện nhận diện
1. Bánh xe cầu nguyện lớn hình trụ (đỏ / vàng, chữ mani nổi) nhìn thấy qua cửa mở.
2. Hàng bánh xe nhỏ dọc tường ngoài.
3. Lư hương (sang-khang) trắng trước cửa.

### 6. Vật liệu và màu
Tường trắng `#EEE9DD` hoặc đỏ `#8E2A22`; bánh xe đỏ `#A3231C` viền vàng `#D4AF37`; mái vàng `#C9A43A` (tuỳ chọn).

### 7. Trang trí
Thần chú «Om mani padme hum» nổi trên bánh xe; bát cát tường; chuông đồng.

### 8. Đề xuất kích thước game
- **Khung hiện tại**: 8 × 8 m, cao 3,6 m. [Đề xuất] **8 × 8 m**, cao tường 4 m + diềm 0,6 m (+ mái vàng nhỏ 2,5 m tuỳ chọn); bánh xe đường kính ≈ 2 m, cao ≈ 3 m ở tâm (**số bánh xe là đề xuất**, chưa có số đo); hàng 12–16 bánh xe nhỏ (đk 0,35 m) dọc 2 tường.

### 9. Nguồn
- https://www.lonelyplanet.com/china/tibet/lhasa/attractions/phurbu-chok-hermitage-mani-lhakhang/a/poi-sig/1451209/356124 (tìm); https://www.tibettravelexpert.com/lhasa-barkor-mani-lhakhang/ (tìm); https://treasuryoflives.org/institution/Barkor-Mani-Lhakhang (tìm)
- https://www.nms.ac.uk/discover-catalogue/the-making-of-a-tibetan-prayer-wheel-house (tìm)
- Ảnh: chưa có file cụ thể (hết hạn mức tìm kiếm).

---

## island — Hồ Tâm Đình

### 1. Nguyên mẫu thật
Có hai cách hiểu:
- **(A, khuyến nghị)**: vị trí đảo giữa hồ sau Potala **chính là Lukhang** (xem mục lukhang). Hồ Tâm Đình nên được **thay bằng Lukhang**.
- **(B, nếu giữ Hồ Tâm Đình riêng)**: nguyên mẫu **Tsokyil Phodrang (措吉颇章, «Cung giữa hồ») ở Norbulingka** — đình 2 tầng trên đảo nhân tạo vuông giữa hồ sen chữ nhật, nối bằng cầu đá; kiểu Hán, mái mạ vàng ngói đồng, có bích hoạ Lục Độ Mẫu (NORBU, kết quả tìm). Ở Norbulingka, Lukang ở đảo Bắc, Tsokyil Phodrang ở đảo giữa, đảo Nam để cây (kết quả tìm).

### 2. Số đo thật

| Hạng mục | Giá trị | Loại | Nguồn |
|---|---|---|---|
| (B) Số tầng | 2 | [Đo] | kết quả tìm (một trang hướng dẫn) |
| (B) Đảo | vuông, nhân tạo; 3 đảo trong hồ chữ nhật | [Đo] | kết quả tìm |
| (B) Năm xây | 1781 (một nguồn) | [Đo] | kết quả tìm |
| (B) Kích thước | **không tìm được** | — | |
| (A) xem lukhang | đảo tròn 40 m, hồ 270 × 112 m, cầu 24,67 m | [Đo] | SHALU |

### 3. Cấu trúc từ dưới lên
(B) Kè đá đảo vuông → bệ có lan can đá → tầng 1 cột gỗ + vách → tầng 2 nhỏ hơn, hành lang → mái vàng kiểu Hán góc vểnh nhẹ → bình báu.

### 4. Mặt bằng
(B) Vuông, đối xứng; cầu đá vào từ một cạnh.

### 5. Cấu kiện nhận diện
(B) 1. Đảo **vuông** (khác đảo tròn Lukhang). 2. Đình 2 tầng mái vàng. 3. Lan can đá. 4. Cầu đá thẳng / vòng thấp.

### 6. Vật liệu và màu
Cột `#8B1E1A`; mái `#C9A43A`; lan can `#CFCAC0`; tường trắng tầng 1.

### 7. Trang trí
Bích hoạ Lục Độ Mẫu bên trong (NORBU); đấu củng sơn màu.

### 8. Đề xuất kích thước game
- **Khung hiện tại**: 10 × 10 m, cao 3,8 m, bát giác, trên đảo r = 12 m.
- [Đề xuất A]: thay bằng Lukhang 16 × 16 m (xem lukhang), đảo tròn đk ≥ 30 m.
- [Đề xuất B]: nếu giữ riêng thì đảo **vuông** 24 × 24 m, đình 10 × 10 m tầng 1 + 7 × 7 m tầng 2, cao ≈ 9 m. Không bát giác.

### 9. Nguồn
- https://www.chinahighlights.com/lhasa/attraction/norbulingka.htm (tìm); https://www.asianart.com/associations/shalu/lukhang/index.html (mở)
- Ảnh: https://commons.wikimedia.org/wiki/File:%E6%B9%96%E5%BF%83%E5%B0%8F%E5%B2%9B_-_panoramio.jpg (đảo hồ Lukhang); https://commons.wikimedia.org/wiki/File:LuoBuLinKa_Lake.jpg

---

## Giả sơn — Marpo Ri · đồi đá (ghi chú thêm)

Marpo Ri (Hồng Sơn) là núi đá mà Potala bám lên; cao trình ≈ 3 700 m, Potala cao hơn đáy thung lũng > 300 m (W-POT).
Game đặt giả sơn ở x = −190 (tách khỏi lầu). Nguyên mẫu đúng là **lầu và Bạch Cung mọc lên từ đá** — các tầng tường đá chân (地垄墙) xếp lên sườn đá.
[Đề xuất] Ít nhất làm **chân Hồng Cung và Bạch Cung lộ đá núi xám nâu** chỗ tường gặp đất, và nối giả sơn với chân lầu bằng sườn đá; tránh để lầu đứng trên nền phẳng.

---

## Tổng hợp: khung hiện tại sai tỉ lệ ở đâu (xếp theo mức nặng)

| # | Công trình | Hiện tại | Sai | Đề xuất |
|---|---|---|---|---|
| 1 | lukhang + island | điện 20 × 16 trên bờ; đảo r 12 có đình bát giác | Lukhang thật **ở trên đảo**, mặt bằng mandala vuông, 3 tầng | Chuyển Lukhang lên đảo, 16 × 16 m, 3 tầng thu nhỏ, đảo đk ≥ 30 m, hồ chữ nhật 2,4 : 1 |
| 2 | lau10 Hồng Cung | tháp vuông thu bậc 38 → 22 m, 10° | Thật là khối lăng trụ nghiêng liên tục ≈ 5,7°; có giếng trời; dải cửa lưới 7 tầng; penbey tầng trên | 44 × 34 → 35 × 25 m liên tục; bệ đá 10 m; giếng trời 14 × 9 m T6–T10 |
| 3 | main Bạch Cung | 2 tầng, 14 m | Thật 7 tầng trắng | 60 × 34 m, thân ≈ 24 m (7 hàng cửa) + bệ đá 6 m |
| 4 | sholoffice | 40 × 18, 2 tầng | Thật 5 280 m² sàn, 3 tầng, 32 phòng, có sân | 44 × 36 m, 3 tầng, sân trong |
| 5 | printing | 40 × 18 (720 m²) | Thật ≈ 380 m² chiếm đất, sân trong | 22 × 20 m, sân 8 × 7 |
| 6 | deyang | đình 12 × 12 + sân 100 × 30 | Thật là **sân vuông 1 600 m²**, không phải đình | Sân ≈ 44 × 40; thay đình bằng 3 thang gỗ |
| 7 | dormE | sâu 14 m | Dãy tăng phòng sâu ≈ 6–8 m | 36 × 8 m |
| 8 | zhasha | hộp 50 × 16 | Thật là khối bậc theo sườn | 3 bậc, sâu tổng 26 m |
| 9 | summit / đình chung | bát giác | Tây Tạng không có đình bát giác gốc | vuông, thân tường + mái vàng (gyaphib) |
| 10 | gate1 | 9 × 7 | Môn lâu thật 3 tầng, phải sâu hơn tường thành 4,4 m | 12 × 8 × 11 m |
| 11 | Tường bao chung | wallT 1,6 m, thẳng | Tường thành Shöl 4,4 m chân / 2,8 m đỉnh, nghiêng | 4 / 2,6 m, nghiêng |

---

## Độ tin cậy

| Công trình | Mức | Ghi chú |
|---|---|---|
| lau10 Hồng Cung | **Trung bình** | Có số đo nhiều phần trong (Đại điện Tây 725,7 m², giếng trời 24,6 × 15,8, tháp 14,85 m, 7 mái vàng, 13/9 tầng). **Không có** rộng × sâu ngoài của Hồng Cung — khung đề xuất là suy luận. Nguồn mâu thuẫn về cách đếm tầng và chiều cao tổng (115,7 / 117,2 / 119 m). |
| main Bạch Cung | **Trung bình** | Có số tầng (7) và Đại điện Đông 27,8 × 25,8 m, 7 gian, 34 cột (có nguồn ghi 38 / 44). Không có rộng ngoài. |
| lukhang | **Khá chắc** cho bối cảnh (đảo 40 m, hồ 270 × 112, cầu 24,67 m, 3 tầng, mandala, 4 cửa); **không có** kích thước điện. Mâu thuẫn mái lục giác / bát giác. |
| printing | **Khá chắc**: 2 tầng, sân trong, 760 m² sàn (một nguồn Baidu, chỉ thấy qua đoạn trích). Kích thước ngoài là suy ra. |
| sholoffice | **Trung bình**: 5 280 m², 3 tầng, 32 phòng — **một nguồn** (Baidu, đoạn trích). Kích thước ngoài suy ra. |
| deyang | **Chắc**: 1 500–1 600 m², > 60 m trên mặt đất, arga, nhà 2 tầng vây quanh, 3 thang gỗ (nhiều nguồn, phần lớn là trang du lịch trích Baidu). |
| gate1 | **Trung bình**: 3 tầng và số đo tường thành chắc (Baidu, zh-wiki); kích thước môn lâu **không tìm được**. |
| dormE | **Thấp–trung bình**: chỉ biết «2 tầng, vây sân»; sâu dãy là suy ra. |
| seminary | **Thấp** cho Tse Lobdra (chỉ biết vị trí); **chắc** cho số đo typology Drepung / Sera (cổng chính quyền Lhasa, wiki). |
| zhasha | **Thấp**: chỉ có vị trí, màu, chức năng. Không có số tầng, kích thước. Con số «25 000 tăng» nghi sai. |
| sholhouse | **Trung bình** cho typology (2 × 2 m, 2,2–2,4 m tầng, 2–3 tầng, sân trong — nhiều nguồn phổ thông); không có nhà Shöl cụ thể. |
| summit | **Thấp**: nguyên mẫu gán (gyaphib / chorten); không có số đo đình. |
| ramp1 | **Thấp**: Pargo Kaling có thật nhưng **không tìm được kích thước**; tỉ lệ chorten lấy từ hiện vật bảo tàng. |
| lake1 | **Thấp**: Norbulingka có mô tả, không có số đo đình. |
| lake2 | **Rất thấp**: chỉ có tên ảnh Commons và mô tả «lùm liễu». |
| east1 | **Thấp**: Mani Lhakhang có thật, có mô tả; **không có** kích thước điện / bánh xe. |
| island | **Thấp** cho Tsokyil Phodrang (2 tầng, đảo vuông, không số); khuyến nghị thay bằng Lukhang (số chắc hơn). |

**Quy tắc chung của phong cách** (độ nghiêng, tường, ô cột 2 × 2 m, arga, penbey, viền cửa): **khá chắc**, có nguồn kỹ thuật tiếng Trung (YZ, XZ-STD) và nhiều nguồn khớp nhau; độ nghiêng có mâu thuẫn 10 % ↔ 10° (đã chọn 10 %).

**Việc còn thiếu (nên làm tiếp)**
1. Đo rộng × sâu Hồng Cung / Bạch Cung từ ảnh vệ tinh hoặc mặt bằng (sách 《布达拉宫》, NXB Kiến trúc TQ 2013, ISBN 9787112134243; trang dokumen.pub đang bảo trì).
2. Xem nội dung các ảnh Commons đã liệt kê (mới chỉ thấy tên) và chọn ảnh chính diện.
3. Tra «The Lhasa Atlas» (Larsen & Sinding-Larsen 2001) và «The Temples of Lhasa» (Alexander 2005) cho mặt bằng Shöl, Pargo Kaling, Lukhang.
4. Hạn mức tìm kiếm web của lượt này đã hết; các mục Tse Lobdra, kích thước môn lâu Shöl, kích thước Mani Lhakhang cần một lượt tìm tiếp.
