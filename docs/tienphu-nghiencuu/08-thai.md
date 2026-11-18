# 08 — Tiên phủ Cung điện Thái (Rattanakosin, Đại Hoàng Cung Bangkok)

Nguyên mẫu tổng: **Đại Hoàng Cung (Phra Borom Maha Ratcha Wang, Bangkok, từ 1782)** và **Wat Phra Kaew (chùa Phật Ngọc)**
trong cùng tường cung. Đối chiếu thêm: Wat Arun (prang), Loha Prasat (prasat nhiều tầng có người đi lên được),
cung Bang Pa-In (đình giữa hồ).

Quy ước trong file:
- **[đo]** = số lấy thẳng từ nguồn (có ghi nguồn).
- **[OSM]** = số tôi đo trên đường bao công trình trong OpenStreetMap (tải qua Overpass API ngày 18-11-2026, tính hình chữ nhật
  bao nhỏ nhất). Đường bao OSM vẽ theo **mép mái nhìn từ trên**, nên lớn hơn tường. Kiểm chứng ở bảng A0.
- **[ước ảnh]** = số tôi đo bằng pixel trên ảnh Commons chụp gần chính diện, lấy một số đo thật làm thước. Sai số ±10–20 %.
- **[suy]** = số tính ra từ số khác; có ghi cách tính.
- **[đề xuất]** = số đề xuất cho game, không phải số thật.
- Mã màu hex đều là **ước lượng từ ảnh**; không có nguồn đo màu.

Ghi chú quá trình (để người sau biết chỗ hổng):
- Nhiều trang Thái có số đo không mở được trong phiên này: thư viện ĐH Silpakorn bản `www.resource.lib.su.ac.th/web-temple`
  (lỗi DNS, chỉ đọc được đoạn trích trong kết quả tìm kiếm), silpa-mag.com (lỗi DNS, chỉ có đoạn trích), tạp chí tci-thaijo
  (lỗi DNS), ResearchGate (403), Khan Academy (chặn bot), machupicchu.org (403).
- Hạn mức WebSearch của lượt này đã **hết** giữa chừng. Phần sau dựa trên trang đã mở được (Wikipedia Anh và Thái, sách
  *The Royal Palaces* của Hoàng thân Dhani Nivat do Cục Mỹ thuật Thái phát hành), dữ liệu OSM và đo ảnh Commons.
- Không tìm được bản vẽ đo đạc (kiểu HABS) của bất kỳ công trình nào trong danh sách.

---

# PHẦN CHUNG CỦA PHONG CÁCH

## A0. Kiểm chứng cách đo bằng OSM

Những công trình vừa có số đo công bố vừa có đường bao OSM:

| Công trình | Số đo công bố | OSM (hình chữ nhật bao) | Chênh | Kết luận |
|---|---|---|---|---|
| Prasat Phra Thep Bidon (Wat Phra Kaew) | 25,55 × 28,35 m [đo — ĐH Silpakorn, qua đoạn trích tìm kiếm] | 32,2 × 31,7 m (way 23482990) | +3,4 đến +6,6 m | OSM = mép mái + bậc |
| Ubosot Wat Phra Kaew (phần hiên bao) | 23,60 × 55,12 m [đo — ĐH Silpakorn] | 27,6 × 60,3 m (way 23482983) | +4 đến +5 m | OSM = mép mái |
| Phra Thinang Racharuedee | 12 × 7,80 m [đo — Wikipedia "Grand Palace"] | 12,2 × 6,8 m (way 229783073) | ±1 m | khớp với nhà nhỏ |
| Phra Thinang Sanam Chan | 3,30 × 4,50 m [đo — Wikipedia] | 4,5 × 3,4 m (way 229891968) | ~0 | khớp |

Quy tắc dùng trong file này [suy]: với nhà lớn có mái chìa, **trừ 2–3 m mỗi phía** khỏi số OSM để ra mép tường / mép bệ.
Với đình nhỏ, số OSM dùng thẳng được.

## A1. Ngữ pháp mái Thái (quan trọng nhất)

| Quy tắc | Nội dung | Nguồn |
|---|---|---|
| Mái nhiều tầng chỉ dành cho chùa, cung điện, công trình công quan trọng | Nhà dân không có | Wikipedia "Thai temple art and architecture" [đo] |
| Số tầng mái (chồng theo chiều cao) | Thường 2–3; một số chùa hoàng gia có 4 | cùng nguồn [đo] |
| Tầng dưới cùng lớn nhất, trên nhỏ dần | — | cùng nguồn [đo] |
| Số lớp **theo chiều dài** ("breaks") | Mái 2 tầng có thể có 2–4 lớp lùi | cùng nguồn [đo] |
| Kiểu miền Trung (Bangkok) | Các tầng dưới **thò ra quá mái trên một đoạn ngắn ở đầu hồi**, nên nhìn chính diện thấy 2–4 tam giác hồi lồng nhau | cùng nguồn [đo] |
| Kiểu Lanna (miền Bắc) | Mái to, thấp, sà xuống; tầng dưới lùi dồn về phía cửa | cùng nguồn [đo] — **không dùng cho phủ này** |
| Đường cong mái | "Bụng thuyền võng" (yon thong samphao) / "bụng voi võng" (tok thong chang): bờ nóc và chân bệ hơi võng xuống ở giữa — chủ yếu thời Ayutthaya muộn | cùng nguồn [đo] |
| Wat Phra Kaew: mái ubosot 3 tầng = chùa hoàng gia; chùa làng 1–2 tầng | — | Smarthistory (đoạn trích tìm kiếm) [đo] |
| Mái cánh Chakri bước xuống 4 tầng | "mỗi mukh (cánh) có mái lùi 4 tầng" | silpa-mag.com (đoạn trích tìm kiếm) [đo] |
| Độ dốc mái | **Không tìm được số đo.** Đo trên ảnh chính diện Chakri: đường diềm hồi (kể cả lamyong) nghiêng ~40–42° | [ước ảnh] |

Cách đọc mặt đứng hồi một mái Thái: nhìn thẳng đầu hồi thấy (từ trên xuống) tam giác hồi trên cùng có **chofa** ở đỉnh,
rồi 1–3 tam giác thấp hơn thò ra trước, mỗi cái cũng có chofa riêng; hai bên sườn là **mái hiên / mái chái**
(ngói xiên một dốc) che hành lang cột. Ảnh Dusit Maha Prasat và Amarin Winitchai cho thấy rõ: trên sườn dài có 3 dải mái
chồng (dải trên, dải giữa, dải hiên) [ước ảnh, File:Amarin_Winichai.jpg].

## A2. Bộ "lamyong" — đồ trang trí diềm hồi (bắt buộc trên mọi hồi)

Wikipedia Thái liệt kê 10 cấu kiện của **เครื่องลำยอง (khrueang lamyong)**, và nói bộ này chỉ dùng cho **chùa và điện vua** [đo]:

| # | Tên Thái | Phiên | Vị trí, hình |
|---|---|---|---|
| 1 | ช่อฟ้า | chofa | Đỉnh hồi, cuối bờ nóc. Hình mỏ chim cong vút lên (Garuda). Ở Wat Phra Kaew dùng kiểu **mỏ chim** (pak nok) |
| 2 | ใบระกา | bai raka | Hàng răng nhọn dọc diềm hồi, giữa chofa và hang hong; gợi vây Naga / lông cánh Garuda |
| 3 | รวยระกา | ruai raka | Thanh đỡ hàng bai raka |
| 4 | งวงไอยรา | nguang aiyara | Chỗ nối với xà gồ |
| 5 | นาคสะดุ้ง | nak sadung | Đoạn uốn lượn hình rắn Naga chạy dọc diềm hồi xuống tới hang hong |
| 6 | หางหงส์ | hang hong | Đầu dưới cùng của diềm hồi, thường là đầu Naga ngẩng lên, quay ra ngoài |
| 7–10 | กระจังรวน, บัวจงกล, จั่วบังนก, คันทวย | — | Trang trí phụ; **คันทวย (khan thuai)** là consol chéo đỡ mái hiên, gắn trên đầu cột / tường |

Nguồn: th.wikipedia "เครื่องลำยอง"; Wikipedia Anh "Thai temple art and architecture" (mỗi tầng mái / mỗi lớp lùi có cặp
hang hong riêng ở chân) [đo]. Ảnh sơ đồ: File:Thai_Temple_"Krueng_Lamyong"_no_label.jpg.

Quy tắc rút ra:
- **Mỗi tam giác hồi** (kể cả hồi của tầng mái dưới) có đủ chofa + bai raka + nak sadung + 2 hang hong.
- Ở điện mahaprasat (Dusit, Chakri) **không dùng khan thuai** dưới chóp mà dùng **tượng Garuda** đỡ ở 4 phía
  (ĐH Silpakorn, trang "พระที่นั่งในหมู่พระมหาปราสาท" [đo]; Wikipedia "Grand Palace" [đo]).
- Dusit dùng khan thuai hình **นาคเบือน (Naga uốn)** dưới mái hiên (th.wikipedia "พระที่นั่งดุสิตมหาปราสาท") [đo].

## A3. Prasat — luật số tầng chóp

| Quy tắc | Nội dung | Nguồn |
|---|---|---|
| Định nghĩa | Prasat (= kudakhan, rueanyot) là công trình có **mái chóp nhiều tầng**, dành cho điện vua hoặc vật thờ thiêng | Wikipedia "Prasat (Thai architecture)" [đo] |
| 3 họ chóp | **mondop** (tháp bậc vuông thon), **prang** (bắp ngô, đỉnh tròn), **mongkut** (hình mũ miện); có tác giả thêm chóp chedi | cùng nguồn [đo] |
| 5 tầng | = "prasat" (vd Aphorn Phimok, chóp đỡ bằng **thiên nga**) | Wikipedia "Grand Palace" [đo] |
| 7 tầng | = "maha prasat" (vd Dusit, chóp đỡ bằng **Garuda**) | Wikipedia "Grand Palace" [đo]; ĐH Silpakorn: Dusit "ชั้นหลังคา 7 ชั้น ลักษณะยอดปราสาท" [đo] |
| Mỗi tầng chóp | góc **ย่อมุมไม้สิบสอง (12 góc lõm)**; mỗi tầng có "บันแถลง" (tam giác hồi nhỏ) ở 4 mặt | silpa-mag (đoạn trích): chóp Chakri "mỗi tầng có 12 góc lõm" [đo]; ĐH Silpakorn: "ยอดสี่เหลี่ยมไม้สิบสองยื่นออกมารับบานแถลงทุกชั้น" [đo] |
| Ba đoạn chóp (Dusit) | (1) 7 lớp chồng = 7 cõi trời; (2) "chuông" ép thành 4 mặt; (3) búp sen thon / giọt sương pha lê | Wikipedia "Grand Palace" [đo] |
| Chỉ vua dùng | Prasat là "thuật ngữ cho công trình trang trọng tôn vinh vua, nhận ra nhờ mái hình chóp" | Dhani Nivat, *The Royal Palaces* (Cục Mỹ thuật) [đo] |

## A4. Cột, bệ, cửa

| Cấu kiện | Hình thật | Nguồn |
|---|---|---|
| Cột | **Vuông, góc lõm 12 góc (ย่อมุมไม้สิบสอง)**, khảm kính màu, mép thếp vàng; **đầu cột là cánh sen** (bằng kính khảm) | Wikipedia "Wat Phra Kaew": ubosot có 48 cột như vậy; Phra Mondop 20 cột [đo] |
| Đầu cột Aphorn Phimok | khảm kính vàng–bạc hoa lá, đầu cột "cánh sen dài" | Wikipedia "Grand Palace" [đo] |
| Bệ điện lớn | Từ dưới lên: chân (เชิง) → **ฐานสิงห์ (bệ chân sư tử)** → **ฐานเชิงบาตร** 2 lớp (gờ hình bát úp) | th.wikipedia "Dusit": bệ cao **2,85 m** [đo] |
| Bệ ubosot | Nhiều lớp: dưới cùng gạch men vẽ hoa nền lam nhạt → lớp sen kính màu → lớp **112 Garuda thếp vàng** mỗi con quặp 2 Naga | Wikipedia "Wat Phra Kaew" [đo] |
| Cửa sổ, cửa đi | Khung **ซุ้มบันแถลง / ซุ้มเรือนแก้ว / ซุ้มทรงมงกุฎ** (khung đỉnh nhọn hình hồi nhỏ hoặc vương miện), thếp vàng gắn kính | th.wikipedia "พระที่นั่งพิมานรัตยา" [đo]; ảnh Amarin [ước ảnh] |
| Cánh cửa | Khảm xà cừ (ubosot, Phra Mondop) hoặc vẽ thần hộ pháp | Wikipedia "Wat Phra Kaew"; th.wikipedia "พระมณฑป" [đo] |
| Bậc thang | Lan can **Naga 5 đầu đội mũ** (Prasat Phra Thep Bidon); Phra Mondop: 4 cầu thang lan can Naga | Wikipedia "Wat Phra Kaew"; th.wikipedia "พระมณฑป" [đo] |

**Sửa giả định trong đề bài:** đề bài ghi "cột hình bát giác có đầu sen". Nguồn đã đọc cho các công trình trong danh sách
đều nói **cột vuông góc lõm 12 góc**, không phải bát giác. Thiết diện đúng: hình vuông, mỗi góc cắt lõm 3 bậc (mỗi góc
thành 3 góc nhỏ → 4 × 3 = 12 góc). Đầu cột là tràng cánh sen thon dài. Tôi không tìm được nguồn nói cột bát giác cho
công trình nào trong danh sách.

## A5. Tường và cổng (dùng cho mọi cổng của phủ)

| Mục | Số đo / mô tả | Nguồn |
|---|---|---|
| Tường cung | Tường vôi trắng có răng cưa (castellated), xây 1782 | Wikipedia "Grand Palace" [đo] |
| Chiều dài tường | Bắc 410 m, Đông 510 m, Nam 360 m, Tây 630 m; tổng 1.910 m | cùng nguồn [đo] |
| Chiều cao tường | **Không có số** trong nguồn đã đọc | — |
| Cổng ngoài | 12 cổng, 3 cổng mỗi mặt; gạch vữa, **chóp kiểu prang**, quét trắng, **cánh cửa đỏ khổng lồ** | cùng nguồn [đo] |
| Cổng trong | Hơn 22 cổng | cùng nguồn [đo] |
| Pháo đài | 17 pháo đài nhỏ quanh tường ngoài (gốc là 10); có lỗ châu mai, ụ pháo, chòi canh | cùng nguồn [đo] |
| Cổng Thewaphiban (vào Amarin) | Cửa giữa dành riêng vua; trên có **3 chóp hình vương miện phủ gốm sứ Trung Hoa** | Wikipedia "Grand Palace"; Dhani Nivat [đo] |
| Wat Phra Kaew | 7 cổng (Đông 2, Nam 1, Tây 3, Bắc 1); 12 tượng **dạ xoa (yaksha) cao ~5 m** canh 6 cổng | Wikipedia "Wat Phra Kaew" [đo] |
| Cổng Koei Sadet (cổng 1 Wat Phra Kaew) | Cổng duy nhất có chóp hình vương miện; ngoài cổng có đình nghỉ nhỏ và bệ lên voi | cùng nguồn [đo] |

Pháo đài OSM [OSM]: Maha Satta Loha 12,5 × 5,6 m; Khan Kuenphet 15,6 × 7,6 m; Anantakhiri 14,8 × 12,6 m.

## A6. Bảng màu và vật liệu chung

Mọi mã hex là **ước lượng từ ảnh Commons** (File:Dusit_Maha_Prasat_06.23.jpg, File:Amarin_Winichai.jpg,
File:Phra_Thinang_Chakri_Maha_Prasat_(II)_BKK.jpg, File:Phra_Thinang_Sutthai_Sawan_Prasat.jpg).

| Phần | Vật liệu | Màu (hex ước) | Ghi chú nguồn |
|---|---|---|---|
| Tường | Gạch trát vôi (ก่ออิฐถือปูน) | trắng ngà #F2EFE8 | Dusit, Phiman Rattaya: "ก่ออิฐถือปูน", "ทาสีขาว" [đo] |
| Bệ | Gạch trát vôi; bệ ubosot / Phra Mondop ốp đá cẩm thạch | trắng #EDEAE3; bóng đổ gờ #C9C4B8 | [đo] vật liệu; màu [ước ảnh] |
| Mái — nền | Ngói đất nung tráng men | xanh lá #3F6A3B (Dusit, Amarin); cam đỏ #C8502E (Chakri, Sutthaisawan); xanh lam #2E4D8C (một tòa Chakraphat Phiman) | Wikipedia: Amarin "ngói xanh lá và cam" [đo]; ubosot "ngói lam, vàng, cam" [đo] |
| Mái — viền | Ngói men khác màu chạy viền quanh mỗi mảng mái | cam #D9682B quanh nền xanh; xanh lá #2F7A45 quanh nền cam | [ước ảnh] |
| Mái không men | Một số điện phụ (Thep Sathan Philat, Thep Asan Philai) | xám nâu #7E766C | th.wikipedia "พระมหามณเฑียร": "ngói không tráng men" [đo] |
| Lamyong, khung cửa, chóp | Gỗ chạm / vữa, sơn mài, **thếp vàng** gắn kính | vàng #C9A23C, sáng #E9C766 | [đo] vật liệu |
| Kính khảm | Kính màu | lục #2F7D5B, lam #2D5DA1, đỏ #A3242B, bạc #CFCFD2 | Wikipedia: cột ubosot, Aphorn [đo] |
| Cánh cổng ngoài | Gỗ sơn son | đỏ #9E2A22 | Wikipedia: "gigantic red doors" [đo] |
| Cửa chớp điện ở | Gỗ | đỏ thẫm / nâu #5A2A22, lục xám (Sutthaisawan) #3C5A55 | [ước ảnh] |
| Sàn sân | Đá lát | xám #8F8A82 | [ước ảnh] |
| Chakri tầng dưới | Vữa giả đá kiểu Âu | nâu đỏ #8A5A40; thân trên kem #EFE9DC | [ước ảnh] |

## A7. Những sai lầm phải tránh

1. **Đặt mặt tiền ở cạnh dài.** Điện, ubosot Thái vào cửa **ở đầu hồi (cạnh ngắn)**: ubosot Wat Phra Kaew có 6 cửa,
   **3 cửa mỗi đầu hồi** [đo — Wikipedia]; Dusit vào qua **mukh (cánh)**, có ban công mukh-det ở phía Bắc [đo];
   Amarin nhìn ra cổng Thewaphiban phía Bắc [đo]. Ngoại lệ: Chakri (thân Âu) và Sutthaisawan (điện trên tường thành) có
   mặt tiền ở cạnh dài. Khung game hiện tại cho ubosot / monthien "rộng > sâu" là **sai hướng**.
2. **Mái một khối.** Phải có ≥2 tầng mái chồng, tầng dưới thò ra ở đầu hồi, cộng mái hiên quanh hành lang cột.
3. **Vểnh góc mái kiểu Trung Hoa / Huế.** Mái Thái không vểnh ở góc giao hai mái. Phần vút lên nằm ở **đầu hồi**: chofa ở
   đỉnh và hang hong ở chân diềm hồi [đo — lamyong]. Diềm mái sườn thẳng.
4. **Chóp nón trơn.** Chóp prasat là chồng **5 hoặc 7 tầng vuông góc lõm**, mỗi tầng có hồi nhỏ ở 4 mặt, rồi "chuông"
   ép 4 mặt, rồi mũi nhọn (pli) với giọt sương. Không phải nón tròn, không phải tháp Gothic.
5. **Lẫn chóp mondop / prang / chedi.** Prang = thân bắp ngô thẳng, đỉnh tròn, trên có đinh ba (Wat Arun) [đo].
   Chedi = chuông tròn + 20 đĩa vòng + mũi (Phra Si Rattana Chedi) [đo]. Mondop/busabok = tháp bậc vuông thon [đo].
   Mỗi công trình chỉ một họ chóp.
6. **Số tầng chóp tuỳ tiện.** 5 tầng = prasat, 7 tầng = maha prasat [đo]. Đình phụ không được có 7 tầng; điện chính không
   được có 5.
7. **Tường màu, cột đỏ.** Tường **trắng**; cột vàng / kính khảm; không sơn tường đỏ, không cột đỏ son kiểu Trung Hoa.
8. **Mái một màu.** Mái luôn có **nền + viền khác màu** (xanh viền cam hoặc cam viền xanh) [ước ảnh, khớp mô tả Wikipedia].
9. **Thếp vàng mọi thứ.** Vàng chỉ ở lamyong, chofa, khung cửa, chóp, cột; tường giữ trắng sạch.
10. **Chakri toàn Thái.** Chakri là "người Tây đội mũ chada" (ฝรั่งสวมชฎา): thân 3 tầng kiểu Phục Hưng Ý, mái và chóp Thái
    [đo — th.wikipedia, Wikipedia]. Dựng toàn Thái hoặc toàn Âu đều sai.
11. **Cột tròn / bát giác trơn.** Dùng cột vuông góc lõm 12 góc, đầu sen (A4).

## A8. Phân biệt với phong cách gần

| So với | Thái Rattanakosin | Bên kia |
|---|---|---|
| Lanna (Bắc Thái) | Mái dốc, tầng dưới thò ra ở đầu hồi, nhìn cao vút | Mái to thấp sà xuống, tầng lùi dồn về cửa [đo — Wikipedia] |
| Trung Hoa / Huế | Đầu hồi là mặt chính; chofa, hang hong; tường trắng; không đấu củng | Mặt chính ở cạnh dài; góc mái vểnh; đấu củng hoặc vì kèo lộ; cột đỏ (quan sát, không có nguồn trích trong file này) |
| Khmer cổ | Prang Thái thon, cao, phủ gốm sứ | Prang Khmer thấp, đá sa thạch (Wikipedia: prang là bản Thái của tháp Khmer [đo]) |
| Châu Âu trong cung | Chỉ ở thân Chakri, Boromphiman (mái Mansard đá xám) | — |

---

# CÔNG TRÌNH

Ghi chú hướng: ảnh vệ tinh / OSM cho thấy trục chính của cung lệch khoảng 3–8° so với Bắc thật. Các số "Đ–T" (đông–tây)
và "B–N" (bắc–nam) dưới đây là theo trục công trình.

## tower — Lầu 10 tầng (Dusit Maha Prasat + ngữ pháp prang Wat Arun + Loha Prasat)

### 1. Nguyên mẫu thật
- **Phra Thinang Dusit Maha Prasat** (พระที่นั่งดุสิตมหาปราสาท; Điện Đâu Suất Đại Prasat), Rama I xây 1789–1790 sau khi
  điện Amarinthara Phisek bị sét đánh cháy [đo — Wikipedia, th.wikipedia]. Một tầng, chữ thập đều 4 cánh, chóp 7 tầng.
- Vì Dusit chỉ có 1 tầng, lầu 10 tầng phải mượn hai nguyên mẫu có thật khác để có tầng leo được:
  - **Phra Prang Wat Arun** (พระปรางค์วัดอรุณ): cao 67 m [đo — th.wikipedia]; các nguồn khác ghi 66,8–86 m
    [đo — Wikipedia Anh]. Có 3 tầng sân đi vòng (ชั้นประทักษิณ) chồng lên nhau trên một nền.
  - **Loha Prasat** (Wat Ratchanatdaram): prasat duy nhất có **7 tầng chia 3 cấp**, cao 36 m, 37 chóp (24 ở cấp dưới,
    12 ở cấp giữa, 1 ở đỉnh) [đo — Wikipedia "Loha Prasat"]. Đây là tiền lệ thật cho "prasat nhiều tầng người đi được".

### 2. Số đo thật

| Hạng mục | Dusit Maha Prasat | Nguồn / cách lấy |
|---|---|---|
| Mặt bằng | Chữ thập đều (Greek cross), 4 cánh là một sảnh liền | Dhani Nivat; Wikipedia [đo] |
| Kích thước ngang (mép mái) B–N | ~37,9 m (gồm ban công Bắc) | [OSM way 82541999] |
| Kích thước ngang (mép mái) Đ–T | ~36,2 m | [OSM] |
| Bề rộng một cánh (mép mái) | 9,5–12,2 m | [OSM] — trừ mái chìa (A0) → tường cánh ~6–8 m [suy] |
| Cao bệ | **2,85 m** | th.wikipedia, naewna/posttoday (đoạn trích) [đo] |
| Số tầng mái của cánh | 4 lớp lùi trên mỗi cánh (ảnh); một nguồn du lịch ghi "four-tiered roof" | [ước ảnh]; nguồn yếu |
| Số tầng chóp | **7** | Wikipedia; ĐH Silpakorn [đo]; một trang mô hình ghi 9 — **loại**, vì 9 là lọng 9 tầng trên ngai trong điện |
| Cao tổng | **Không tìm được số đo tin cậy.** Một trang du lịch ghi "roof reaching 28 m" (không mở được, không rõ là tới đâu) | — |
| Cao tổng ước | Trên ảnh, đoạn từ chân mái tới đỉnh chóp ≈ 2,0 lần đoạn từ mặt bệ tới chân mái. Nếu tường ~8–9 m thì tổng ~30–35 m | [ước ảnh, sai số lớn vì ảnh chụp chéo] |

| Hạng mục | Prang Wat Arun | Nguồn |
|---|---|---|
| Cao | 67 m (th.wiki); 66,8–86 m (en.wiki) | [đo] |
| Chân prang chính (mép ngoài) | 34,0 × 34,0 m | [OSM way 23482275] |
| Nền chung (ฐานไพที) | ~55 × 55 m | [OSM way 1020893594, không tên, vị trí trùng nền] |
| Tầng sân vòng | 3 (tầng 1: ฐานสิงห์; tầng 2: gờ bát + **dạ xoa đỡ**; tầng 3: gờ bát + **khỉ (kabi) đỡ**) | th.wikipedia [đo] |
| Thân (เรือนธาตุ) | gờ bát + **thiên thần đỡ**, 3 tầng ฐานสิงห์ **mặt bằng bát giác**; 4 khám (จรนำ) nhô ra, trong khám **Indra cưỡi voi Erawan** | th.wikipedia [đo] |
| Phần ngọn | gờ bát + **Narayana cưỡi Garuda**, rồi chồng tầng có hồi nhỏ (ใบขนุน); ngọn gần như thẳng; đỉnh **นภศูล** (cột đinh ba) đội mũ | th.wikipedia; en.wiki (đinh ba 7 mũi) [đo] |
| 4 prang phụ ở góc | cao ~30 m | [ước ảnh File:0000140_-_Wat_Arun_Ratchawararam_005.jpg, sai số lớn] |
| 4 mondop giữa các prang phụ | mái busabok 5 tầng | th.wikipedia [đo] |

### 3. Cấu trúc từ dưới lên (Dusit)
1. Chân (เชิง) → **ฐานสิงห์** (gờ chân sư tử) → **ฐานเชิงบาตร 2 lớp**; tổng 2,85 m. Quanh bệ có **Garuda quặp Naga** [đo].
2. Thân: tường gạch trát vôi trắng, cửa sổ khung ซุ้ม thếp vàng gắn kính (ảnh: mỗi cánh 4–5 cửa sổ mỗi mặt [ước ảnh]).
   Ban công **mukh-det** nhô ra phía Bắc, dưới có ngai **Busabok Mala** có chóp riêng [đo].
3. Đỡ mái: consol **นาคเบือน** dưới mái hiên [đo]; ở 4 góc giao của chóp: **Garuda** thay consol [đo].
4. Mái: mỗi cánh có 4 lớp mái lùi theo chiều dài, lớp thấp thò ra ở đầu hồi; quanh thân có mái hiên [ước ảnh].
   Ngói nền xanh lá viền cam [ước ảnh].
5. Đỉnh: chóp 7 tầng (mỗi tầng vuông lõm 12 góc, có hồi nhỏ 4 mặt) → chuông ép 4 mặt → búp sen / giọt sương → mũi
   kim loại mảnh [đo + ảnh].
6. Mỗi đầu hồi: lamyong đủ bộ; tam giác hồi chạm **Narayana cưỡi Garuda** giữa hoa văn kanok và thiên thần chắp tay [đo].

### 4. Mặt bằng (Dusit)
- 4 cánh bằng nhau quanh ô giữa vuông dưới chóp. Trần ô giữa hình bát giác, khảm sao kính [đo].
- Cánh Bắc: ban công ngai Busabok Mala. Cánh Nam: cửa sổ kiểu ngai (Phra Banchon Busabok Mala). Cánh Đông: giường
  xà cừ. Cánh Tây: trống [đo — Dhani Nivat; Wikipedia].
- Phía Nam nối sang điện Phiman Rattaya bằng **mukh krasan** (sảnh nối dài) [đo].
- Không có vách ngăn giữa 4 cánh [đo].

### 5. Cấu kiện nhận diện (xếp theo mức quan trọng)
1. Mặt bằng **chữ thập đều**, mỗi cánh kết thúc bằng một **mặt hồi nhiều lớp** có chofa.
2. **Một chóp vàng 7 tầng** ở giao điểm, đỡ bằng Garuda ở 4 phía.
3. Bệ trắng cao (≈ 1/3 chiều cao tường) có gờ sư tử và gờ bát.
4. Mái mỗi cánh nhiều lớp lùi, nền xanh viền cam, viền diềm hồi vàng.
5. Tường trắng trơn, cửa sổ khung nhọn thếp vàng xếp đều.
6. Ban công ngai có chóp nhỏ nhô ra một cánh.

### 6. Vật liệu và màu
Tường #F2EFE8; mái nền xanh #3F6A3B, viền cam #D9682B; lamyong và chóp vàng #C9A23C; kính khảm lục / lam; bệ trắng.
Wat Arun: phủ mảnh sứ Trung Hoa nhiều màu và vỏ ốc trên vữa vôi; sau trùng tu 2013–2017 nhìn trắng hơn [đo].

### 7. Trang trí
Hồi: Narayana cưỡi Garuda. Quanh bệ: Garuda quặp Naga. Cửa: thần hộ pháp cầm vũ khí. Trong: tường vẽ búp sen chứa
thiên thần, cây kiểu Trung Hoa [đo — Wikipedia]. Wat Arun: dạ xoa, khỉ, thiên thần đỡ từng tầng; Indra cưỡi Erawan trong
khám [đo].

### 8. Đề xuất cho game — tháp 10 tầng chơi được, đúng ngữ pháp prasat

Khung hiện tại: bệ vuông cạnh 47 m, cao chưa định. Hằng số trong `src/game/tienphu/tower.js`: FH = 5,0 m sàn tới sàn,
LEVELS = 10. Như vậy thân 10 tầng = 50 m, gần bằng chóp giữa Chakri (50,4 m) và dưới prang Wat Arun (67 m).

Nguyên tắc ghép (giữ đúng ngữ pháp):
- **Một họ chóp duy nhất: busabok / mondop (họ của Dusit).** Không đặt ngọn prang lên thân prasat.
- Mượn của prang Wat Arun **cách xếp 3 cấp sân đi vòng có tượng đỡ**, không mượn ngọn.
- Mượn của Loha Prasat **cách chia 7 tầng thành 3 cấp lùi, mỗi cấp có hàng chóp nhỏ ở mép**.
- Mặt bằng mỗi tầng là **vuông lõm 12 góc** hoặc **chữ thập**, không phải vuông trơn.

| Cấp | Tầng | Mặt bằng (cạnh ngoài tường) | Mép mỗi cấp | Tượng đỡ / trang trí | Ghi chú |
|---|---|---|---|---|---|
| Bệ | — | 47 × 47 m, cao 2,85 m (đúng Dusit) | Lan can trắng | Garuda quặp Naga quanh gờ | 4 cầu thang lan can Naga 5 đầu ở 4 mặt |
| Cấp 1 | 1–4 | vuông lõm 12 góc, 34 × 34 m (= chân prang Wat Arun) | Mái hiên ngói 1 vòng ở sàn tầng 5; 4 góc có **chóp busabok 5 tầng** (như prang phụ / mondop Wat Arun) | Dạ xoa đỡ dưới mái hiên | Mỗi mặt 4 mukh nhỏ có hồi + chofa ở giữa |
| Cấp 2 | 5–7 | vuông lõm, 26 × 26 m | Mái hiên ở sàn tầng 8; 4 góc chóp 5 tầng nhỏ hơn | Khỉ (kabi) đỡ | — |
| Cấp 3 | 8–9 | vuông lõm, 19 × 19 m | Mái hiên ở sàn tầng 10 | Thiên thần đỡ | — |
| Điện đỉnh | 10 | **chữ thập** 13 × 13 m, cánh rộng ~6 m (≈ tỉ lệ cánh Dusit) | 4 cánh, mỗi cánh mái 3–4 lớp lùi có chofa | Garuda 4 phía đỡ chóp | Đây chính là "Dusit thu nhỏ" đặt trên tháp |
| Chóp | — | đáy ≈ 7 × 7 m | **7 tầng** (maha prasat) → chuông 4 mặt → pli → giọt sương | Garuda 4 góc | Cao chóp 16–18 m [đề xuất] |

Chiều cao tổng [đề xuất]: 2,85 (bệ) + 50 (10 tầng) + 16–18 (mái điện đỉnh + chóp) ≈ **69–71 m**.
Tỉ lệ cao / cạnh chân thân = 70 / 34 ≈ 2,1; prang Wat Arun 67 / 34 ≈ 2,0 [suy]. Tỉ lệ khớp nguyên mẫu.

So với khung hiện tại: cạnh bệ 47 m **giữ được** (gần nền Wat Arun ~55 m và nền rộng hơn thân như Dusit), nhưng thân tầng 1
phải **lùi vào 34 m**, không xây thẳng thân 47 m. Dusit thật chỉ ~36–38 m mép mái; nếu muốn bám Dusit hơn thì giảm bệ còn
40 m [đề xuất phụ].

### 9. Nguồn
- https://en.wikipedia.org/wiki/Grand_Palace (mục Phra Maha Prasat; trang "Dusit_Maha_Prasat_Throne_Hall" chuyển hướng về đây)
- https://th.wikipedia.org/wiki/พระที่นั่งดุสิตมหาปราสาท
- https://resource.lib.su.ac.th/rattanakosin/index.php/2014-10-27-08-52-05/2014-10-29-01-27-45/2015-10-15-04-25-28/2015-10-15-04-28-03?limitstart=&showall=1 (ĐH Silpakorn: chóp 7 tầng, Garuda thay consol)
- https://www.finearts.go.th/storage/contents/2020/08/file/xQeunheawAVQlNzOgewvMBbIh04Ab08ahEaqy92k.pdf (Dhani Nivat, *The Royal Palaces*)
- https://www.naewna.com/lady/242282 và https://www.posttoday.com/general-news/732395 (đoạn trích tìm kiếm: bệ 2,85 m)
- https://en.wikipedia.org/wiki/Wat_Arun ; https://th.wikipedia.org/wiki/วัดอรุณราชวรารามราชวรมหาวิหาร
- https://en.wikipedia.org/wiki/Loha_Prasat
- OSM: https://www.openstreetmap.org/way/82541999 (Dusit), https://www.openstreetmap.org/way/23482275 (prang Wat Arun)
- Ảnh: https://commons.wikimedia.org/wiki/File:Dusit_Maha_Prasat_06.23.jpg ;
  https://commons.wikimedia.org/wiki/File:0000140_-_Wat_Arun_Ratchawararam_005.jpg (chính diện prang từ sông)
- Cảnh báo: File:Phra_Thinang_Dusit_Maha_Prasat_photo_Don_Ramey_Logan.jpg có mô tả là *Borom Ratchasathit Mahoran*,
  **không dùng** làm tham chiếu Dusit.

---

## main — Chakri Maha Prasat

### 1. Nguyên mẫu thật
**Phra Thinang Chakri Maha Prasat** (พระที่นั่งจักรีมหาปราสาท; Điện Chakri Đại Prasat). Khởi công 7-5-1876, dựng chóp
1878, khánh thành 1882. KTS John Clunis (Anh, từ Singapore) [đo — Wikipedia, th.wikipedia]. Bản thiết kế gốc có 3 mái vòm;
Rama V đổi thành 3 chóp prasat [đo — đoạn trích tìm kiếm].

### 2. Số đo thật

| Hạng mục | Số | Nguồn |
|---|---|---|
| Số tầng | **3** (tầng dưới: lính gác / kho; tầng giữa: sảnh tiếp và phòng ngai; tầng trên: nơi đặt tro hài cốt vua) | th.wikipedia; ĐH Silpakorn [đo] |
| Chóp | **3 chóp, mỗi chóp 7 tầng**, mỗi tầng 12 góc lõm; chóp giữa cao và to hơn | Wikipedia; silpa-mag (đoạn trích) [đo] |
| Cao từ sàn nền tới đỉnh chóp giữa | **50,40 m** | silpa-mag (đoạn trích tìm kiếm) [đo] |
| Mái cánh (mukh) | Lùi 4 tầng | silpa-mag (đoạn trích) [đo] |
| Phòng ngai giữa | rộng ~12,70 m, dài 24 m, trần cao ~14 m | th.wikipedia [đo] |
| Chiều dài mặt tiền | **~88 m** [OSM: mép tây Sommuti Thewarat Upabat tới mép đông Mulasathan Boromasana, way 229891969 / 229891996 / 229891966] và **~94 m** [ước ảnh: lấy 50,4 m làm thước] | hai cách đo độc lập, chọn **~90 m** |
| Sâu khối trước | ~17 m (hai cánh) ; khối giữa ~25 m | [OSM] |
| Cao gờ mái thân Âu | ~19–20 m | [ước ảnh] |
| Cao đỉnh 2 chóp bên | ~42 m | [ước ảnh] |
| Cao tầng nền (đá giả, có cửa vòm) | ~5 m | [ước ảnh] |

Mặt bằng: "chữ H xoay" — hai khối song song trục Đông–Tây, nối bằng sảnh Bắc–Nam [đo — Wikipedia]; ĐH Silpakorn gọi mặt
cắt là chữ **T** [đo]. Ba prasat nối bằng **mukh krasan** (sảnh ở dài) suốt chiều dài [đo].

### 3. Cấu trúc từ dưới lên
1. Tầng nền kiểu Âu, vữa giả đá màu nâu đỏ, cửa vòm; giữa mặt tiền có **cầu thang đôi** hai bên ban công [đo — Dhani Nivat; ảnh].
2. Tầng 2 và 3 kiểu Phục Hưng Ý: cột ốp tường, cửa sổ vòm, lan can con tiện; ở tầng giữa có huy hiệu Xiêm trên cửa
   sổ [đo — Wikipedia].
3. Gờ mái Âu nằm ngang suốt mặt tiền.
4. Mái Thái: mái cánh nền đỏ cam viền xanh; ba khối có mái hồi nhiều lớp quay ra mặt tiền.
5. Ba chóp prasat 7 tầng, Garuda chạm gỗ quặp Naga đỡ chóp 4 phía [đo — đoạn trích].
6. Trên hồi giữa: chân dung Rama V; trên hồi và cổng: biểu tượng Chakri (bánh xe + đinh ba) [đo — Wikipedia].

### 4. Mặt bằng / chia nhịp mặt tiền [ước ảnh, File:Phra_Thinang_Chakri_Maha_Prasat_(II)_BKK.jpg]

| Đoạn (Tây → Đông) | Rộng ước | Nội dung |
|---|---|---|
| Lầu bên Tây | ~19 m (≈ 20 %) | 3 cửa sổ mỗi tầng; mái hồi + chóp 7 tầng |
| Cánh Tây | ~19 m (≈ 20 %) | **7 cửa sổ vòm** mỗi tầng; mái dài cam đỏ |
| Lầu giữa | ~18 m (≈ 20 %) | Cổng vòm, ban công, cầu thang đôi; hồi 2 lớp + chóp 7 tầng cao nhất |
| Cánh Đông | ~19 m | 7 cửa sổ vòm |
| Lầu bên Đông | ~19 m | như lầu Tây |

Bên trong (tầng giữa): sảnh giữa → phòng ngai Chakri phía Nam (4 tranh tiếp sứ, ngai niello, lọng trắng 9 tầng); hai
bên sảnh là phòng tiếp khách, dẫn tới phòng riêng vua (Đông) và phòng hoàng hậu (Tây) [đo — Dhani Nivat].

### 5. Cấu kiện nhận diện
1. **Ba chóp vàng 7 tầng** thẳng hàng trên **thân Âu trắng 3 tầng** — "Tây đội mũ chada".
2. Mặt tiền chia 5 đoạn gần bằng nhau; 3 lầu nhô có chóp, 2 cánh lõm có hàng cửa vòm.
3. Lầu giữa cao nhất, có cổng vòm, ban công và cầu thang đôi đổ xuống sân.
4. Tầng nền màu đậm hơn, cửa vòm thấp.
5. Mái Thái nền đỏ cam viền xanh, hồi lamyong vàng.
6. Hai voi đồng trước bậc [đo — Dhani Nivat].

### 6. Vật liệu và màu
Thân trên kem #EFE9DC, gờ và cột ốp xám nhạt #D8D3C8; tầng nền nâu đỏ #8A5A40; cửa sổ chớp xanh lam đậm #2B3F5E [ước ảnh];
mái nền cam đỏ #C8502E viền xanh #2F7A45; chóp, hồi vàng #C9A23C. Wikipedia: mái "xanh lá và cam", cổng sắt rèn [đo].

### 7. Trang trí
Hồi giữa: chân dung Rama V; biểu tượng Chakri; huy hiệu Xiêm trên cửa sổ tầng giữa [đo]. Cánh cửa sắt rèn hoa văn [đo —
Dhani Nivat]. Đèn đường kiểu Âu và chậu cây trước mặt tiền [ảnh].

### 8. Đề xuất cho game
Khung hiện tại 60 × 26 m, 2 tầng, bệ 1,6 m. **Sai 3 điểm**: dài thiếu (~90 m thật), sâu dư (khối trước ~17 m), số tầng sai (3).

[đề xuất] Khung **72 × 20 m** (tỉ lệ 0,8 so với thật), **3 tầng**:

| Phần | Số [đề xuất] |
|---|---|
| Tầng nền (đá giả, cửa vòm) | 4,0 m |
| Tầng 2 + tầng 3 | 2 × 5,8 m |
| Gờ mái thân | ~15,6 m |
| Đỉnh chóp bên | ~33,5 m |
| Đỉnh chóp giữa | **40,3 m** (= 50,4 × 0,8) |
| Chia mặt tiền | 5 đoạn × 14,4 m; cánh có 7 cửa vòm mỗi tầng; lầu bên 3 cửa |
| Khối sau | Sảnh Bắc–Nam ở giữa, dài thêm 16–20 m ra sau (giữ dáng chữ T / H) |

Bệ 1,6 m của khung: thay bằng tầng nền 4 m (Chakri không có bệ Thái).

### 9. Nguồn
- https://en.wikipedia.org/wiki/Chakri_Maha_Prasat_Throne_Hall
- https://en.wikipedia.org/wiki/Grand_Palace
- https://th.wikipedia.org/wiki/พระที่นั่งจักรีมหาปราสาท ; https://th.wikipedia.org/wiki/พระที่นั่งมูลสถานบรมอาสน์
- https://www.silpa-mag.com/vichitra-prakan/article_164794 (chỉ đọc đoạn trích tìm kiếm: 50,40 m, 7 tầng, 12 góc lõm, mái cánh 4 tầng)
- ĐH Silpakorn (URL ở mục tower); Dhani Nivat PDF (URL ở mục tower)
- OSM: https://www.openstreetmap.org/way/229891996 , /way/229891969 , /way/229891966
- Ảnh: https://commons.wikimedia.org/wiki/File:Phra_Thinang_Chakri_Maha_Prasat_(II)_BKK.jpg (chính diện, dùng để đo);
  https://commons.wikimedia.org/wiki/File:Chakri_Maha_Prasat_1890.jpg

---

## ubosot — Ubosot Phật Ngọc

### 1. Nguyên mẫu thật
**Phra Ubosot, Wat Phra Si Rattana Satsadaram (Wat Phra Kaew)** — điện thụ giới thờ Phật Ngọc, một trong những công trình
đầu tiên của Rama I (1783) [đo — Wikipedia].

### 2. Số đo thật

| Hạng mục | Số | Nguồn |
|---|---|---|
| Hiên bao (ระเบียง) quanh điện | **23,60 × 55,12 m** | ĐH Silpakorn (đoạn trích tìm kiếm) [đo] |
| Cao | **14 วา 2 ศอก 6 นิ้ว ≈ 29,2 m** (1 wa = 2 m; 1 sok = 0,5 m; 1 nio ≈ 2,5 cm) | ĐH Silpakorn [đo]; quy đổi [suy] |
| Mép mái | 27,6 × 60,3 m | [OSM way 23482983] |
| Tỉ lệ dài / rộng | 55,12 / 23,60 = **2,34** | [suy] |
| Tỉ lệ cao / rộng | 29,2 / 23,6 = **1,24** — điện cao hơn bề ngang | [suy] |
| Số tầng mái | **3** (dấu hiệu chùa hoàng gia) | Smarthistory (đoạn trích) [đo] |
| Số cột | **48**, vuông góc lõm 12 góc, đầu sen kính khảm | Wikipedia [đo] |
| Khoảng cột | Nếu 48 cột chia đều quanh hiên 23,6 × 55,1 m: ~18 cột cạnh dài, ~8 cột đầu hồi, nhịp ~3,1 m | [suy — giả định chia đều, chưa kiểm] |
| Cửa | **6 cửa, 3 cửa mỗi đầu hồi**, mỗi cửa có bậc ngắn; cửa giữa hơi to hơn, chỉ vua dùng | Wikipedia [đo] |
| Garuda quanh bệ | **112** tượng thếp vàng, mỗi con quặp 2 Naga | Wikipedia [đo] |
| Sư tử đồng | 12 con hai bên bậc | Wikipedia [đo] |
| Tường thấp bao quanh | có 8 đình **bai sema** và **12 sala** | Wikipedia [đo] |

### 3. Cấu trúc từ dưới lên
1. Bệ nhiều lớp: gạch men vẽ hoa nền lam nhạt → lớp sen kính màu → lớp 112 Garuda [đo].
2. Hiên cột bao 4 phía: 48 cột vuông góc lõm, đầu sen [đo].
3. Tường điện bên trong hiên: trắng / khảm, cửa sổ khung thếp vàng; cửa khảm xà cừ [đo].
4. Đỡ mái hiên: consol khan thuai (theo kiểu chung, nguồn không ghi riêng).
5. Mái 3 tầng chồng, các tầng dưới thò ra ở hai đầu hồi; ngói men **lam, vàng, cam** [đo].
6. Hồi hai đầu: **Narayana cưỡi Garuda**; đủ bộ lamyong [đo].

### 4. Mặt bằng
- Hình chữ nhật, trục dài Đông–Tây [OSM: góc trục 3°]; vào ở hai đầu hồi (3 cửa mỗi đầu).
- Hiên cột bao quanh (peristyle). Trong: ngai vàng cao đặt Phật Ngọc dưới prasat 5 tầng [đo — đoạn trích Smarthistory];
  phần sau điện ngăn riêng cho vua [đo — Dhani Nivat].
- Trần gỗ sơn đỏ, sao kính khảm [đo].

### 5. Cấu kiện nhận diện
1. Khối **hẹp và cao**, trục dài gấp 2,3 lần bề ngang, đầu hồi là mặt chính.
2. **Mái 3 tầng** ngói lam–vàng–cam, hồi lồng nhau ở mỗi đầu.
3. **Hàng cột vuông vàng** bao quanh hiên.
4. **Băng Garuda vàng** quanh bệ.
5. 3 cửa ở mỗi đầu hồi, bậc ngắn, sư tử đồng.
6. Tường thấp quanh điện, 8 đình sema nhỏ ở góc / giữa cạnh.

### 6. Vật liệu và màu
Mái nền lam #2E4D8C + vàng #D9A62C + cam #D9682B [đo màu, hex ước]; cột vàng + kính; bệ trắng + gạch men lam nhạt #A9C3D6;
Garuda vàng #C9A23C; trần đỏ #8E2420.

### 7. Trang trí
Hồi: Narayana cưỡi Garuda. Cột: kính khảm mép vàng. Cửa: xà cừ thời Rama I. Bên trong: bích hoạ [đo — Wikipedia].

### 8. Đề xuất cho game
Khung hiện tại 40 × 22 m, 1 tầng, bệ 1,6 m. **Sai**: hướng (mặt tiền đặt cạnh 40 m) và tỉ lệ (40 / 22 = 1,8, thật 2,34).

[đề xuất] **Mặt tiền 22 m (đầu hồi) × sâu 51 m**, cao đỉnh nóc ~27 m (tỉ lệ 0,93 so với hiên thật). Bệ ~2,0 m có băng
Garuda (khoảng 104 tượng, giữ mật độ thật). Hiên cột: 8 × 17 cột, nhịp ~3,0 m. Ba tầng mái, mỗi đầu hồi lộ 3 tam giác.
Nếu đất chật: giữ tỉ lệ, thu cả khối về 18 × 42 × 22 m.

### 9. Nguồn
- https://en.wikipedia.org/wiki/Wat_Phra_Kaew
- http://www.resource.lib.su.ac.th/web-temple/index.php?option=com_content&view=article&id=17&Itemid=18 (chỉ đoạn trích tìm kiếm; trang không mở được)
- https://smarthistory.org/wat-phra-kaew-temple-of-the-emerald-buddha/ (chỉ đoạn trích; trang trả 403)
- OSM: https://www.openstreetmap.org/way/23482983
- Ảnh: https://commons.wikimedia.org/wiki/File:Temple_of_the_Emerald_Buddha_2012.JPG ;
  https://commons.wikimedia.org/wiki/File:Wat_Phra_Sri_Rattana_Satsadaram_11.jpg

---

## monthien — Phra Maha Monthien (mặt chính: điện Amarin Winitchai)

### 1. Nguyên mẫu thật
**Nhóm Phra Maha Monthien** (หมู่พระมหามณเฑียร) do Rama I xây: ba điện nối liền, hướng Bắc, từ Bắc xuống Nam:
**Amarin Winitchai** (sảnh thiết triều) → **Phaisan Thaksin** (sảnh trong, nơi đăng quang) → **Chakraphat Phiman**
(nơi ở, phòng ngủ vua) [đo — th.wikipedia, Dhani Nivat]. Khung game 44 × 22 chỉ đủ cho một điện; tôi chọn **Amarin
Winitchai** làm mặt chính vì đây là điện nhìn ra sân qua cổng Thewaphiban. Chakraphat Phiman dùng cho inner2.

### 2. Số đo thật

| Hạng mục | Amarin | Phaisan Thaksin | Chakraphat Phiman | Nguồn |
|---|---|---|---|---|
| Mép mái Đ–T × B–N | 23,6 × 30,6 m | 36,2 × 25,9 m | 42,1 × 22,3 m | [OSM 205631558 / 82538505 / 229772447] |
| Tường ước (trừ mái chìa) | ~19 × 26 m | — | — | [suy] |
| Cao bệ | **0,50 m** | — | — | Wikipedia [đo] |
| Cột trong | 2 hàng cột vuông (5 bên trái, 6 bên phải) | — | — | Wikipedia [đo] |
| Mái | ngói **xanh lá và cam** | — | ban đầu lá cọ → ngói → ngói men (Rama V) | Wikipedia [đo] |
| Cao | **Không tìm được số** | — | — | — |
| Cả nhóm B–N | ~90 m (từ mép Bắc Amarin tới mép Nam Chakraphat) | | | [OSM, suy] |

### 3. Cấu trúc từ dưới lên
1. Bệ thấp 0,5 m [đo]. Trước bệ là sân lát và cổng Thewaphiban (3 chóp vương miện phủ sứ) [đo].
2. Tường trắng, cửa sổ cao khung **ซุ้มทรงมงกุฎ** thếp vàng gắn kính; cửa chớp gỗ đỏ thẫm [ước ảnh File:Amarin_Winichai.jpg].
3. Mái sườn: 3 dải mái chồng (trên, giữa, hiên) nền xanh lá viền cam, gờ vàng giữa các dải [ước ảnh].
4. Hồi phía Bắc: 3 tam giác lồng, đủ lamyong.
5. Bên trong: ngai thuyền Busabok Mala (lọng 7 tầng) và ngai Phuttan Kanchana Singhat (lọng 9 tầng); trần khảm sao kính [đo].

### 4. Mặt bằng
- Trục B–N, vào từ Bắc. Hai hàng cột chia sảnh thành gian giữa và hai gian bên [đo].
- Phía Nam nối thẳng vào Phaisan Thaksin (bậc lên) [đo — Dhani Nivat].
- Cửa sổ sườn [ước ảnh]: ~6–7 cửa mỗi bên, khoảng ~3,5 m.

### 5. Cấu kiện nhận diện
1. Sảnh dài, **đầu hồi quay ra sân**, bệ thấp.
2. Mái 3 dải xanh lá viền cam (màu đặc trưng nhóm Monthien).
3. Hàng cửa sổ cao khung vương miện vàng trên tường trắng.
4. Cổng 3 chóp vương miện phủ sứ (Thewaphiban) trước mặt.
5. Bên cạnh có đình Racharuedee (sala5) và Dusidaphirom (sala3).

### 6. Vật liệu và màu
Mái xanh lá #3F6A3B, viền cam #D9682B; tường #F2EFE8; khung cửa vàng #C9A23C; cửa chớp #5A2A22; bệ trắng.

### 7. Trang trí
Khung cửa sổ vương miện thếp vàng gắn kính; lamyong vàng; tượng đá Trung Hoa canh cửa [ảnh]; trần sao kính [đo].

### 8. Đề xuất cho game
Khung hiện tại 44 × 22 m, 1 tầng. Hướng sai (Amarin vào ở đầu hồi). [đề xuất] **Mặt tiền 22 m × sâu 30 m**, bệ 0,6 m
(không phải 1,6 m), đỉnh nóc ~18–20 m [đề xuất, chưa có số đo — chỉ suy từ tỉ lệ cao/rộng ubosot 1,24 trừ đi vì mái
Amarin thấp hơn]. Nếu muốn giữ diện tích 44 m: nối Amarin (22 × 30) + Phaisan Thaksin phía sau thành khối 22 × 60, hoặc
xếp đúng thứ tự thật Amarin → Phaisan → Chakraphat theo trục sâu.

### 9. Nguồn
- https://th.wikipedia.org/wiki/พระมหามณเฑียร
- https://en.wikipedia.org/wiki/Grand_Palace (mục Phra Maha Monthien)
- Dhani Nivat PDF (URL ở mục tower)
- OSM: https://www.openstreetmap.org/way/205631558 , /way/82538505 , /way/229772447
- Ảnh: https://commons.wikimedia.org/wiki/File:Amarin_Winichai.jpg ;
  https://commons.wikimedia.org/wiki/File:Ho_Phra_That_Montien_and_Gate.jpg

---

## officeW — Bộ Hộ (Ngoại triều) → nguyên mẫu: Phra Thinang Ratchakaranya Sapha

### 1. Nguyên mẫu thật
Ngoại triều thật của Đại Hoàng Cung (Bộ Tài chính, Kho bạc, Bộ Ngoại giao cũ, Sala Sahathai Samakhom) **đều là nhà kiểu Âu
thế kỷ 19** (Dhani Nivat; th.wikipedia "ศาลาสหทัยสมาคม": "kiến trúc vòm kiểu Pháp") [đo]. Dùng chúng sẽ lạc phong cách.
Công trình **hành chính kiểu Thái có thật** trong cung là **Phra Thinang Ratchakaranya Sapha** (พระที่นั่งราชกรัณยสภา):
phòng họp Hội đồng Cơ mật, nơi vua họp các bộ trưởng, do Rama V xây [đo — Dhani Nivat; Wikipedia]. Tôi dùng nó cho officeW.

### 2. Số đo thật

| Hạng mục | Số | Nguồn |
|---|---|---|
| Số tầng | **2** | th.wikipedia, Dhani Nivat [đo] |
| Mép mái | **11,7 × 16,2 m** (Đ–T × B–N) | [OSM way 229783076] |
| Tường ước | ~8 × 12 m | [suy, trừ mái chìa] |
| Mái | Mái Thái có chofa, bai raka, hang hong; **hồi nhô vượt khỏi đường mái** (đặc điểm thời Ayutthaya) | th.wikipedia; Wikipedia [đo] |
| Trong | Trang trí kiểu Âu | th.wikipedia [đo] |
| Cao | Không có số | — |

### 3. Cấu trúc từ dưới lên
Bệ thấp → 2 tầng tường trắng, khép kín (không hiên mở) → mái Thái 2 tầng, hồi nhô ra ngoài mặt tường → lamyong vàng.

### 4. Mặt bằng
Hình chữ nhật kín, trục dài B–N [OSM]; một phòng họp lớn mỗi tầng [suy từ chức năng].

### 5. Cấu kiện nhận diện
1. Nhà Thái **2 tầng kín**, ít cửa, mái hồi.
2. Hồi nhô vượt ra ngoài đường mái.
3. Tường trắng, khung cửa đơn giản hơn điện vua.

### 6. Vật liệu và màu
Tường #F2EFE8; mái nền cam #C8502E viền xanh [ước theo màu chung, chưa có ảnh riêng]; lamyong vàng.

### 7. Trang trí
Lamyong đủ bộ; hồi chạm; nội thất Âu [đo].

### 8. Đề xuất cho game
Khung hiện tại 52 × 16 m, 2 tầng — **dài gấp 4,5 lần nguyên mẫu**. Không có nhà Thái 2 tầng dài 52 m nào trong nguồn đã
đọc. [đề xuất] **12 × 18 m** (mặt tiền đầu hồi 12 m), 2 tầng × 4,5 m, bệ 1,0 m, đỉnh nóc ~16 m [đề xuất]. Nếu bố cục cần
khối dài: hai nhà như vậy nối bằng hành lang có mái (kiểu **mukh krasan** của Dusit – Phiman Rattaya).

### 9. Nguồn
- https://th.wikipedia.org/wiki/พระที่นั่งราชกรัณยสภา (trang chuyển về nhóm Phra Maha Prasat)
- https://en.wikipedia.org/wiki/Grand_Palace (mục Ratchakaranya Sapha)
- https://th.wikipedia.org/wiki/ศาลาสหทัยสมาคม (để loại nguyên mẫu Âu)
- Dhani Nivat PDF (URL ở mục tower)
- OSM: https://www.openstreetmap.org/way/229783076
- Ảnh: **chưa tìm được** link File:… cụ thể (hết hạn mức tìm kiếm).

---

## officeE — Bộ Binh (Ngoại triều) → nguyên mẫu: Phra Thinang Sutthaisawan Prasat

### 1. Nguyên mẫu thật
**Phra Thinang Sutthaisawan Prasat** (พระที่นั่งสุทไธสวรรยปราสาท): điện dài **trên tường thành phía Đông**, giữa cổng
Deva Phitak và Sakdi Chaisit; Rama I xây 1784, Rama IV đổi tên. Ban công gỗ giữa là nơi vua tiếp dân và **duyệt quân**
ở bãi tập phía ngoài [đo — Wikipedia; th.wikipedia; Dhani Nivat]. Đây là điện "hướng ra ngoài" duy nhất có hình khối dài
2 tầng — hợp chức năng Bộ Binh / ngoại triều.

### 2. Số đo thật

| Hạng mục | Số | Nguồn |
|---|---|---|
| Mép mái | **56,5 × 11,0 m** | [OSM way 82546666] |
| Số tầng | **2** (dưới kiểu Âu, trên kiểu Thái) | Wikipedia [đo] |
| Cửa sổ | **9 cửa lớn mỗi cánh** mặt ngoài | Wikipedia [đo]; ảnh thấy 9 trên + 9 dưới mỗi cánh [ước ảnh] |
| Chóp | prasat **mondop 5 tầng**, khảm kính | Wikipedia [đo] |
| Tường thành dưới (có ô vòm mù) | ~2,7 m | [ước ảnh, thước = 56,5 m] |
| Cao tới diềm mái | ~7,7 m | [ước ảnh] |
| Cao nóc cánh | ~12,4 m | [ước ảnh] |
| Cao đỉnh chóp | ~23,8 m | [ước ảnh] |
| Rộng lầu giữa | ~10,4 m | [ước ảnh] |

### 3. Cấu trúc từ dưới lên
1. Chân là tường thành trắng có hàng ô vòm mù.
2. Hai tầng tường trắng, cửa chớp lục xám; tầng trên cửa cao hơn [ảnh].
3. Lầu giữa nhô nhẹ, có **ban công gỗ** ở tầng trên [đo].
4. Mái cánh: 2 tầng + mái hiên, nền cam đỏ viền xanh lá, mỗi đầu cánh có hồi nhỏ với chofa [ảnh].
5. Lầu giữa: hồi lớn vàng chạm, trên là **chóp 5 tầng** [đo].

### 4. Mặt bằng
Dải dài 1 gian sâu ~9 m [suy], đặt trên tường. Chia mặt tiền: cánh (9 cửa) | lầu giữa (~10 m) | cánh (9 cửa) [ảnh].
Nhịp cửa ~2,5 m [suy: (56,5 − 10,4) / 2 / 9 ≈ 2,56 m cho một cửa sổ + một trụ; ảnh cho thấy cửa đặt sát nhau].

### 5. Cấu kiện nhận diện
1. Khối **rất dài, nông**, nằm trên tường thành, mặt chính ở cạnh dài.
2. **Một chóp 5 tầng** chính giữa trên lầu có ban công.
3. Hai hàng cửa chớp xếp sát nhau.
4. Mái cam đỏ viền xanh, hồi nhỏ ở hai đầu.

### 6. Vật liệu và màu
Tường #F4F1EA; cửa chớp #3C5A55; mái nền #C8502E viền #2F7A45; hồi và chóp vàng #C9A23C [ước ảnh].

### 7. Trang trí
Hồi giữa chạm vàng; lamyong; ban công gỗ; chóp khảm kính [đo].

### 8. Đề xuất cho game
Khung hiện tại 52 × 16 m, 2 tầng — **dài đúng**, **sâu dư** (thật ~11 m mép mái). [đề xuất] **52 × 11 m**, 2 tầng
(3,5 m + 4,0 m), chân tường 2,5 m, chóp tới ~22 m. Khác officeW ở chỗ: mặt chính cạnh dài, có chóp 5 tầng, có ban công.

### 9. Nguồn
- https://en.wikipedia.org/wiki/Grand_Palace (mục Siwalai / tường phía Đông)
- https://th.wikipedia.org/wiki/พระที่นั่งสีตลาภิรมย์ (trang chuyển về Suan Siwalai; có mục Sutthaisawan)
- Dhani Nivat PDF (URL ở mục tower)
- OSM: https://www.openstreetmap.org/way/82546666
- Ảnh: https://commons.wikimedia.org/wiki/File:Phra_Thinang_Sutthai_Sawan_Prasat.jpg (chính diện, dùng để đo)

---

## inner1 — Nội Cung Tây → nguyên mẫu: Phra Thinang Phiman Rattaya

### 1. Nguyên mẫu thật
**Phra Thinang Phiman Rattaya** (พระที่นั่งพิมานรัตยา; "nơi ở ban đêm"): điện ở của Rama I trong nhóm Phra Maha Prasat
(phía Tây), xây 1789 [đo — th.wikipedia, Wikipedia, Dhani Nivat].

### 2. Số đo thật

| Hạng mục | Số | Nguồn |
|---|---|---|
| Mép mái (gồm sảnh nối mukh krasan về phía Dusit) | 25,6 × 51,9 m | [OSM way 229891967] |
| Thân điện ước | ~22 × 30 m | [suy: trừ đoạn nối ~20 m] — chưa kiểm |
| Mái | **3 tầng (ชั้นลด 3 ชั้น)**, ngói men màu, chofa | th.wikipedia [đo] |
| Hiên cột | Ba phía **Đông, Tây, Nam**; cột lơi (เสาลอย) đỡ mái | th.wikipedia; Wikipedia [đo] |
| Bệ | "ยกพื้นสูง" (nền cao) — không có số | th.wikipedia [đo] |
| Số tầng | 1 (nền cao) | [suy từ mô tả] |

### 3. Cấu trúc từ dưới lên
Nền cao → tường trắng, cửa đi khung **เรือนแก้ว** hoa phut-tan, cửa sổ khung **บันแถลง** thếp vàng gắn kính → hàng cột hiên
3 phía → mái 3 tầng ngói men → hồi chạm **Phra Phrom cưỡi thiên nga** [đo].

### 4. Mặt bằng
Chữ nhật trục B–N; phía Bắc nối vào cánh Nam của Dusit bằng sảnh dài; hiên 3 phía; hai vườn hai bên [đo].

### 5. Cấu kiện nhận diện
1. Điện chữ nhật mái 3 tầng **không có chóp**.
2. Hiên cột 3 phía.
3. Sảnh nối dài về điện chữ thập.
4. Hồi Phra Phrom cưỡi thiên nga.

### 6. Vật liệu và màu
Gạch trát vôi trắng #F2EFE8; ngói men nhiều màu (dùng xanh viền cam như Dusit để cùng nhóm); khung cửa vàng + kính [đo vật liệu].

### 7. Trang trí
Hồi Phra Phrom; cửa vòm kính hoa phut-tan; lamyong [đo].

### 8. Đề xuất cho game
Khung hiện tại 40 × 16 m, 2 tầng. Sai: 1 tầng nền cao thật; hướng hồi. [đề xuất] **Mặt hồi 20 m × sâu 30 m**, 1 tầng
(tường ~6 m) trên nền 1,6 m (giữ bệ khung), mái 3 tầng, + sảnh nối 6 × 12 m về phía tháp / điện chính.

### 9. Nguồn
- https://th.wikipedia.org/wiki/พระที่นั่งพิมานรัตยา
- https://en.wikipedia.org/wiki/Grand_Palace
- Dhani Nivat PDF
- OSM: https://www.openstreetmap.org/way/229891967
- Ảnh: chưa tìm được link File:… riêng (hết hạn mức tìm kiếm).

---

## inner2 — Nội Cung Giữa → nguyên mẫu: Phra Thinang Chakraphat Phiman

### 1. Nguyên mẫu thật
**Phra Thinang Chakraphat Phiman** (พระที่นั่งจักรพรรดิพิมาน): điện ở chính của ba đời vua đầu, phòng ngủ vua; vua mới
đăng quang phải ngủ ở đây một đêm [đo — Dhani Nivat; Wikipedia].

### 2. Số đo thật

| Hạng mục | Số | Nguồn |
|---|---|---|
| Mép mái | **42,1 × 22,3 m** (Đ–T × B–N) | [OSM way 229772447] |
| Cấu tạo | **3 nhà chữ nhật giống hệt nhau nối liền** ("พระที่นั่งแฝด" 3 nhà) | Wikipedia; th.wikipedia [đo] |
| Rộng mỗi nhà | ~14 m mép mái | [suy: 42,1 / 3] |
| Hiên | cột **sao nang chaliang** (hàng cột) bao 4 phía | th.wikipedia [đo] |
| Mái | lá cọ → ngói → ngói men thời Rama V | Wikipedia [đo] |
| Cánh phụ Đ / T (Thep Sathan Philat, Thep Asan Philai) | bệ > 0,5 m; ngói **không men**; không có khung cửa ซุ้ม | th.wikipedia [đo] |

### 3. Cấu trúc từ dưới lên
Bệ thấp → hàng cột hiên 4 phía → 3 nhà song song, mỗi nhà một mái hồi nhiều tầng → 3 hồi đứng cạnh nhau ở mặt Bắc.
Ảnh nhóm Monthien cho thấy một tòa có mái **nền xanh lam viền cam** [ước ảnh File:Chief_Residence_of_the_Grand_Palace.jpg].

### 4. Mặt bằng
Ba nhà trục B–N đặt sát nhau theo chiều Đ–T; phía trước có phòng chờ (antechamber) vẽ tranh; trong: phòng ngủ vua và
phòng khách lớn (nay trưng bày vương khí) [đo — Dhani Nivat].

### 5. Cấu kiện nhận diện
1. **Ba mái hồi song song** cạnh nhau (khác hẳn mọi nhà khác).
2. Hàng cột hiên bao quanh.
3. Không chóp.

### 6. Vật liệu và màu
Gạch trát vôi trắng; ngói men (một tòa nền lam #2E4D8C viền cam); hai cánh phụ ngói xám không men #7E766C.

### 7. Trang trí
Lamyong; tranh tường phòng chờ (ấn quốc gia, thiên giới) [đo].

### 8. Đề xuất cho game
Khung hiện tại 40 × 16 m, 2 tầng. [đề xuất] **42 × 22 m, 1 tầng** trên bệ 1,0 m, chia **3 nhà 14 × 22 m**, mỗi nhà mái
2–3 tầng, 3 hồi quay mặt chính. Khác inner1: 3 hồi song song, không sảnh nối, hiên 4 phía.

### 9. Nguồn
- https://en.wikipedia.org/wiki/Grand_Palace ; https://th.wikipedia.org/wiki/พระมหามณเฑียร
- Dhani Nivat PDF
- OSM: https://www.openstreetmap.org/way/229772447
- Ảnh: https://commons.wikimedia.org/wiki/File:Chief_Residence_of_the_Grand_Palace.jpg ;
  https://commons.wikimedia.org/wiki/File:Canopy_Bed_of_the_King_at_the_Chakraphat_Phiman_Hall.jpg

---

## inner3 — Nội Cung Đông → nguyên mẫu: Phra Buddha Rattanasathan (vườn Siwalai)

### 1. Nguyên mẫu thật
**Phra Buddha Rattanasathan** (พระพุทธรัตนสถาน): điện thờ Phật Pha lê (Phra Phuttha Butsayarat) **giữa vườn Siwalai**,
phía Đông nội cung, Rama IV xây [đo — Wikipedia; th.wikipedia; Dhani Nivat]. Chọn vì là công trình Thái ở đúng vị trí
"nội cung phía Đông" và có số đo OSM tốt.

### 2. Số đo thật

| Hạng mục | Số | Nguồn |
|---|---|---|
| Mép mái | **21,7 × 13,5 m** (hình bao xoay: 21,2 × 12,7) | [OSM way 82546664] |
| Vật liệu | **Đá xám** | Wikipedia; th.wikipedia [đo] |
| Mái | **2 tầng, ngói xanh lá**, chofa, bai raka, hang hong | Wikipedia; th.wikipedia [đo] |
| Hiên | Hiên cột phía trước + **hành lang cột mở bao quanh** | Wikipedia [đo] |
| Số tầng | 1 | [suy từ mô tả] |
| Cao | Không có số | — |

### 3. Cấu trúc từ dưới lên
Bệ → hành lang cột mở bao quanh → thân đá xám → mái 2 tầng xanh lá → lamyong.

### 4. Mặt bằng
Chữ nhật trục Đ–T, cửa ở đầu hồi, hiên trước nhô [đo].

### 5. Cấu kiện nhận diện
1. **Tường đá xám**, không trắng — điểm khác mọi nhà khác của phủ.
2. Mái 2 tầng xanh lá.
3. Hiên cột bao quanh, giữa một bãi cỏ rộng.

### 6. Vật liệu và màu
Đá xám #8C8A85; mái xanh lá #3F6A3B viền cam; cột trắng hoặc đá [ước].

### 7. Trang trí
Lamyong; tranh tường bên trong kể sự tích tượng (một phần vẽ lại sau bom Thế chiến II) [đo — Dhani Nivat].

### 8. Đề xuất cho game
Khung hiện tại 26 × 14 m, 2 tầng — **tỉ lệ mặt bằng đúng** (26/14 = 1,86; thật 21,7/13,5 = 1,61), nhưng thật là 1 tầng và
vào ở hồi. [đề xuất] **14 × 22 m**, 1 tầng (tường ~6 m), bệ 1,2 m, mái 2 tầng, đặt giữa bãi cỏ.

### 9. Nguồn
- https://en.wikipedia.org/wiki/Grand_Palace (mục Siwalai)
- https://th.wikipedia.org/wiki/พระที่นั่งสีตลาภิรมย์ (trang Suan Siwalai)
- Dhani Nivat PDF
- OSM: https://www.openstreetmap.org/way/82546664
- Ảnh: chưa tìm được link File:… riêng.

---

## library — Phra Mondop (thư viện kinh)

### 1. Nguyên mẫu thật
**Phra Mondop, Wat Phra Kaew** (พระมณฑป): nơi giữ tủ kinh Tam Tạng 84.000 pháp uẩn; xây 1789 (Rama I) trên nền cao
(ฐานไพที) giữa Prasat Phra Thep Bidon và Phra Si Rattana Chedi [đo — th.wikipedia; Wikipedia].

### 2. Số đo thật

| Hạng mục | Số | Nguồn |
|---|---|---|
| Mép mái / bệ | **14,2 × 15,0 m** | [OSM way 23482989] |
| Mặt bằng | gần vuông | Wikipedia [đo] |
| Cột | **20 cột vuông góc lõm** quanh sảnh, kính trắng–lục–đỏ | Wikipedia [đo] |
| Chóp | mondop **7 tầng chồng** ("ส่วนยอดมณฑป 7 ชั้นซ้อน"); Rama IV đã **hạ thấp** chóp | th.wikipedia; Wikipedia [đo] |
| Cửa | 4 cửa, mỗi cửa có mũ vương miện | Wikipedia [đo] |
| Cầu thang | 4, lan can Naga | th.wikipedia [đo] |
| Cao | **Không tìm được số** | — |

### 3. Cấu trúc từ dưới lên
1. Nền chung (ฐานไพที) cao → bệ sen ốp **cẩm thạch**, dưới có kanok và chân sư tử [đo].
2. 4 tượng Phật đá kiểu Java ở 4 góc bệ (bản sao) [đo].
3. Tượng dạ xoa cầm chuỳ, Garuda và asura chắp tay trên bệ [đo].
4. Thân: 20 cột vuông khảm kính; tường **kính lục với thiên thần chắp tay (thepphanom) bằng vàng lá** [đo — Wikipedia].
5. Mái mondop: 7 tầng vuông thon, góc lõm → chuông → mũi.

### 4. Mặt bằng
Một phòng; giữa đặt tủ kinh khảm xà cừ, 4 tủ nhỏ ở góc; sàn trải chiếu đan bạc [đo].

### 5. Cấu kiện nhận diện
1. Khối **vuông**, 4 mặt như nhau, 4 cửa có mũ vương miện.
2. **Chóp mondop 7 tầng** (tháp bậc vuông, không phải prang, không phải chuông).
3. Tường lục + vàng, khác tường trắng của điện.
4. Bệ cẩm thạch, 4 cầu thang Naga.

### 6. Vật liệu và màu
Kính lục #2F6E4E + vàng lá #C9A23C; bệ cẩm thạch #E8E6E0; cửa nền tím vẽ vàng (th.wiki) #4A2A4E; chóp vàng.

### 7. Trang trí
Thepphanom vàng trên kính lục; cửa xà cừ với sư tử và 8 vòng tròn; tượng hộ pháp; tượng Phật Java [đo].

### 8. Đề xuất cho game
Khung hiện tại 22 × 22 m, 2 tầng. Sai: rộng hơn thật ~1,5 lần; thật là 1 tầng + chóp. [đề xuất] **15 × 15 m**, bệ cao
2,5 m (nền ฐานไพที + bệ sen), thân 1 tầng ~7 m, chóp 7 tầng. Tổng cao [đề xuất, chưa có số đo]: ~28–32 m. Lý do: dùng
tỉ lệ đỉnh / chiều dài sàn đo được trên ảnh Aphorn Phimok (~1,7) nhân với ~15 m, cộng bệ; cần kiểm lại khi có nguồn.

### 9. Nguồn
- https://th.wikipedia.org/wiki/พระมณฑป_(วัดพระศรีรัตนศาสดาราม)
- https://en.wikipedia.org/wiki/Wat_Phra_Kaew
- OSM: https://www.openstreetmap.org/way/23482989
- Ảnh: https://commons.wikimedia.org/wiki/File:Phra_Mondop.jpg

---

## summit — Vọng Sơn Đình (đình đỉnh giả sơn) → nguyên mẫu: điện thu nhỏ trên đỉnh Khao Krailat

### 1. Nguyên mẫu thật
**Khao Krailat Chamlong** (เขาไกรลาสจำลอง; núi Kailasa mô phỏng) cạnh nhóm Dusit, Rama IV làm: núi đá có **một cung điện
thu nhỏ trên đỉnh**, chân núi đặt tượng thú Himavanta; dùng cho lễ cắt búi tóc (lễ Sokan) của hoàng tử ~13 tuổi
[đo — Wikipedia "Grand Palace"]. Đình đỉnh là prasat nhỏ.

### 2. Số đo thật

| Hạng mục | Số | Nguồn |
|---|---|---|
| Chân núi | đa giác ~7,8 m | [OSM way 229891965] |
| Đình đỉnh | Không có số | — |

### 3–4. Cấu trúc, mặt bằng
Núi đá xếp (kiểu khao mo) → đỉnh có bệ nhỏ → prasat thu nhỏ (mặt bằng chữ thập hoặc vuông) với chóp. Không có nguồn
mô tả chi tiết đình.

### 5. Cấu kiện nhận diện
1. Đình nhỏ **có chóp prasat** trên đỉnh núi đá.
2. Tượng thú Himavanta (sư tử, voi, chim thần) quanh chân núi.

### 6–7. Vật liệu, trang trí
Đình vàng thếp + kính khảm như Aphorn Phimok; núi đá xám #7D7A72 có rêu.

### 8. Đề xuất cho game
Khung 9 × 9 m. [đề xuất] Đình chữ thập **5 × 5 m** (cánh rộng 2,5 m), chóp **5 tầng** (không được 7), cao đỉnh ~9 m,
bệ 0,6 m. Đặt trên đỉnh Khao Mo của phủ. Khác aphorn: nhỏ hơn một nửa, kín 4 mặt hoặc nửa kín.

### 9. Nguồn
- https://en.wikipedia.org/wiki/Grand_Palace (mục Mount Kailasa replica)
- OSM: https://www.openstreetmap.org/way/229891965
- Ảnh: chưa tìm được link File:… riêng.

---

## sala1 — Sala Siwalai → nguyên mẫu: Phra Thinang Sitalaphirom

### 1. Nguyên mẫu thật
**Phra Thinang Sitalaphirom** (พระที่นั่งสีตลาภิรมย์): đình gỗ mở nhỏ trong vườn Siwalai, Rama VI xây [đo — Wikipedia; th.wikipedia].

### 2. Số đo thật

| Hạng mục | Số | Nguồn |
|---|---|---|
| Mép mái | **7,9 × 7,2 m** | [OSM way 229783075] |
| Vật liệu | Gỗ | Wikipedia [đo] |
| Mái | ngói, chofa, bai raka, hang hong | th.wikipedia [đo] |
| Cao | Không có số | — |

### 3. Cấu trúc
Sàn gỗ / bệ thấp → cột gỗ sơn mài đen vẽ **ngọn lửa vàng** → mái hồi → hồi chạm biểu tượng Rama VI [đo].

### 4. Mặt bằng
Gần vuông, mở 4 phía [đo "open"].

### 5. Cấu kiện nhận diện
1. Đình **gỗ mở**, gần vuông.
2. Cột **sơn mài đen + hoa văn lửa vàng** (khác cột kính khảm của điện đá).
3. Mái hồi có chofa.

### 6. Vật liệu và màu
Gỗ sơn mài đen #1C1A17, vẽ vàng #C9A23C; mái theo màu chung.

### 7. Trang trí
Hoa văn lửa (lai kranok) vàng trên đen; huy hiệu Rama VI ở hồi [đo].

### 8. Đề xuất cho game
Khung 12 × 9 m — to hơn thật ~1,5 lần. [đề xuất] **8 × 7 m**, cột 2,8 m, đỉnh ~6,5 m, bệ 0,4 m.

### 9. Nguồn
- https://en.wikipedia.org/wiki/Grand_Palace ; https://th.wikipedia.org/wiki/พระที่นั่งสีตลาภิรมย์
- OSM: https://www.openstreetmap.org/way/229783075
- Ảnh: chưa tìm được link File:… riêng.

---

## sala2 — Sala Đảo Đông → nguyên mẫu: Phra Thinang Aisawan Thipphaya-at (Bang Pa-In)

### 1. Nguyên mẫu thật
**Phra Thinang Aisawan Thipphaya-at** (พระที่นั่งไอศวรรย์ทิพยอาสน์), cung Bang Pa-In (Ayutthaya): đình prasat **giữa hồ**
[đo — Wikipedia "Bang Pa-In Royal Palace"]. Wikipedia "Prasat" xếp nó vào họ chóp mondop [đo]. Th.wikipedia nói bản sao
của Aphorn Phimok ở Bang Pa-In tên là "Ishawan Thippayasana" [đo] — tức hai đình cùng mẫu; vì vậy sala2 phải khác aphorn
ở **nền nước** và **mái màu**.

### 2. Số đo thật

| Hạng mục | Số | Nguồn |
|---|---|---|
| Mép mái / sàn nổi | **18,1 × 11,1 m** | [OSM way 761221376] |
| Cao đỉnh trên sàn | ~15 m | [ước ảnh File Bang Pa-in 2025, thước = 18,1 m, ảnh chéo, sai số lớn] |
| Sàn trên mặt nước | ~3 m, đặt trên dãy trụ vòm | [ước ảnh] |

### 3. Cấu trúc từ dưới lên [ảnh]
Trụ vòm trắng trong nước → sàn có **lan can con tiện trắng** → cột vàng → mái hồi 4 hướng, mỗi hướng 3 lớp lồng, **nền
xanh lá + ô cam** → chóp busabok nhiều tầng vàng.

### 4. Mặt bằng
Chữ thập (4 mukh) trên sàn chữ nhật, nối bờ bằng cầu [ảnh File:Marcy_Aisawan.jpg mô tả "from the bridge"].

### 5. Cấu kiện nhận diện
1. **Đứng trên nước**, sàn trắng trên trụ vòm.
2. Đình mở chữ thập, chóp vàng.
3. Mái màu (khác mái xám của Aphorn Phimok).

### 6. Vật liệu và màu
Sàn và lan can trắng #F4F1EA; cột, lamyong vàng; mái nền xanh #3F6A3B, ô cam #D9682B [ước ảnh].

### 7. Trang trí
Lamyong vàng; hồi chạm thếp vàng [ảnh].

### 8. Đề xuất cho game
Khung 12 × 9 m. [đề xuất] Sàn nổi **18 × 11 m** cao 1,5–3 m trên nước, đình **11 × 7 m**, đỉnh ~14 m trên sàn, cầu nối bờ.
Không dùng chung lưới với aphorn: đổi màu mái, thêm sàn nước.

### 9. Nguồn
- https://en.wikipedia.org/wiki/Bang_Pa-In_Royal_Palace
- https://en.wikipedia.org/wiki/Prasat_(Thai_architecture)
- https://th.wikipedia.org/wiki/พระที่นั่งอาภรณ์พิโมกข์ปราสาท (bản sao ở Bang Pa-In)
- OSM: https://www.openstreetmap.org/way/761221376
- Ảnh: https://commons.wikimedia.org/wiki/File:Bang_Pa-in_-_Ishavaraya_Divya_Asna_Hall_พระที่นั่งไอศวรรย์ทิพยอาสน์_(2025)_-_img_02.jpg ;
  https://commons.wikimedia.org/wiki/File:Marcy_Aisawan.jpg

---

## aphorn — Aphorn Phimok Prasat

### 1. Nguyên mẫu thật
**Phra Thinang Aphorn Phimok Prasat** (พระที่นั่งอาภรณ์พิโมกข์ปราสาท; "đình cởi áo"): đình mở trên bệ ở **tường Đông của nhóm
Phra Maha Prasat**; vua xuống kiệu, cởi mũ và áo lễ ở đây trước khi vào Dusit [đo — Dhani Nivat; Wikipedia]. Bản sao từng
trưng bày ở Hội chợ Brussels 1958 [đo]. Người xây: Rama IV theo Dhani Nivat và Wikipedia Anh; infobox th.wiki ghi Rama V,
năm khởi công 1889 — **nguồn mâu thuẫn**; chọn Rama IV vì hai nguồn độc lập cùng nói.

### 2. Số đo thật

| Hạng mục | Số | Nguồn |
|---|---|---|
| Sàn đình | **4,25 × 9,40 m** | đoạn trích tìm kiếm (naewna / posttoday / trueid) [đo, chưa mở trang gốc] |
| Mép mái (gồm bệ) | 15,0 × 7,5 m | [OSM way 229783128] |
| Mặt bằng | **chữ thập**, đầu Bắc và Nam dài hơn (mukh dọc ngắn hơn mukh đầu) | Wikipedia; th.wikipedia [đo] |
| Chóp | **5 tầng** (prasat, không phải maha prasat); đỡ bằng **thiên nga** | Wikipedia [đo] |
| Cột | khảm kính vàng–bạc hoa lá, đầu **cánh sen dài** | Wikipedia [đo] |
| Cột (chiều cao) | ~4,4 m | [ước ảnh DD 66, thước = 4,25 m] |
| Sàn tới đỉnh chóp | ~16 m | [ước ảnh, ±20 %] |
| Bệ / tường đỡ | bệ trắng nhiều bậc, lan can con tiện; có **bệ lên kiệu** (เกยเทียบพระยานคานหาม) | th.wikipedia; ảnh [đo] |

### 3. Cấu trúc từ dưới lên [đo + ảnh]
1. Bệ trắng bậc cấp nhiều gờ, có lan can con tiện, ghép vào tường.
2. Cột vuông khảm kính, đứng thành cụm ở góc (2–3 cột mỗi góc mukh) [ảnh].
3. Mái: mỗi mukh có hồi 2–3 lớp lồng, mái **ngói xám nâu**, diềm vàng [ảnh].
4. Chóp 5 tầng vàng, thiên nga đỡ 4 góc; mũi rất dài và mảnh.
5. Hồi Đông: **Shiva đứng trên bệ, một chân nhấc** [đo].

### 4. Mặt bằng
Chữ thập, trục dài B–N 9,40 m, ngang 4,25 m; không tường, mở hoàn toàn.

### 5. Cấu kiện nhận diện
1. Đình **mở, chữ thập**, cột vàng dày đặc.
2. **Chóp 5 tầng vàng mảnh**, rất cao so với đình (đỉnh ≈ 1,7 lần chiều dài sàn).
3. Đứng trên **bệ trắng cao nhiều bậc** sát tường.
4. Mái tối màu, diềm vàng — tương phản với mái màu của điện bên cạnh.

### 6. Vật liệu và màu
Cột, lamyong, chóp vàng #C9A23C; kính bạc #CFCFD2; mái xám nâu #6E6258 [ước ảnh]; bệ trắng #F4F1EA.

### 7. Trang trí
Hồi Đông: Shiva; trần sao (ดาวเพดาน); Naga uốn (นาคเบือน) [đo].

### 8. Đề xuất cho game
Khung 9 × 9 m — sai hình (vuông). [đề xuất] **Chữ thập 9,4 × 9,4 m mép mái, sàn 9,4 × 4,25 m + cánh ngang ~6 × 4,25 m**,
cột 4,4 m, đỉnh chóp 16 m trên sàn, bệ 2,5–3 m. Đây là đình duy nhất của phủ được mái xám + cột vàng dày.

### 9. Nguồn
- https://en.wikipedia.org/wiki/Grand_Palace ; https://th.wikipedia.org/wiki/พระที่นั่งอาภรณ์พิโมกข์ปราสาท
- Dhani Nivat PDF
- OSM: https://www.openstreetmap.org/way/229783128
- Ảnh: https://commons.wikimedia.org/wiki/File:Gran_Palacio,_Bangkok,_Tailandia,_2013-08-22,_DD_66.jpg (đã xem: đúng Aphorn Phimok)

---

## sala3 — Sala Ngoại Triều → nguyên mẫu: Phra Thinang Dusidaphirom

### 1. Nguyên mẫu thật
**Phra Thinang Dusidaphirom** (พระที่นั่งดุสิตาภิรมย์): **đình mở** ở sân trước nhóm Maha Monthien, dùng để thay vương phục trước
khi lên kiệu đi rước [đo — th.wikipedia "พระมหามณเฑียร"]. Là đình nằm ở sân ngoài, nơi có quan lại qua lại.

### 2. Số đo thật

| Hạng mục | Số | Nguồn |
|---|---|---|
| Mép mái | **7,5 × 11,0 m** (Đ–T × B–N) | [OSM way 229783116] |
| Ngoài | lớp khảm kính xanh lam và sơn mài vàng | Wikipedia (danh sách màu) [đo] |
| Cao | Không có số | — |

### 3–4. Cấu trúc, mặt bằng
Đình chữ nhật mở, trục B–N; bệ thấp; mái hồi. Hor Sattrakhom đối diện được xây "giống Dusidaphirom" [đo].

### 5. Cấu kiện nhận diện
1. Đình chữ nhật mở.
2. **Khảm kính lam + sơn mài vàng** (màu khác các đình khác).

### 6. Vật liệu và màu
Kính lam #2D5DA1, vàng #C9A23C; mái theo màu chung.

### 7. Trang trí
Lamyong; khảm kính [đo].

### 8. Đề xuất cho game
Khung 10 × 8 m. [đề xuất] **7,5 × 11 m** (hồi 7,5 m quay ra lối đi), cột 3,2 m, đỉnh ~8 m, bệ 0,5 m.

### 9. Nguồn
- https://th.wikipedia.org/wiki/พระมหามณเฑียร ; https://en.wikipedia.org/wiki/Grand_Palace
- OSM: https://www.openstreetmap.org/way/229783116
- Ảnh: chưa tìm được link File:… riêng.

---

## sala4 — Sala Cổng Chùa → nguyên mẫu: sala rai của Wat Phra Kaew / đình nghỉ ngoài cổng Koei Sadet

### 1. Nguyên mẫu thật
Quanh ubosot Wat Phra Kaew có **12 sala** và 8 đình bai sema trên tường thấp [đo — Wikipedia]. Ngoài cổng số 1 (Koei Sadet)
có **một đình nghỉ nhỏ và bệ lên voi** [đo]. Dùng loại "sala rai" này.

### 2. Số đo thật

| Hạng mục | Số | Nguồn |
|---|---|---|
| Số lượng | 12 sala quanh ubosot | Wikipedia [đo] |
| Kích thước | **Không tìm được** | — |
| So sánh: tháp chuông (Ho Rakhang) gần đó | ~6,0 × 6,1 m | [OSM way 229771450] |

### 3–4. Cấu trúc, mặt bằng
Đình chữ nhật mở, cột vuông, mái hồi 2 tầng, bệ thấp [suy từ loại hình — chưa có nguồn riêng].

### 5. Cấu kiện nhận diện
Đình mở nhỏ, mái 2 tầng có chofa, đứng theo hàng dọc tường / gần cổng có dạ xoa canh.

### 6–7. Vật liệu, trang trí
Theo bảng màu chung; khác sala khác ở chỗ đặt **cạnh tượng dạ xoa 5 m** của cổng.

### 8. Đề xuất cho game
Khung 8 × 8 m. [đề xuất, không có số đo] **8 × 5 m**, cột 3 m, đỉnh ~7 m, bệ 0,5 m; đặt cạnh cổng có **2 dạ xoa cao 5 m**.

### 9. Nguồn
- https://en.wikipedia.org/wiki/Wat_Phra_Kaew
- OSM: https://www.openstreetmap.org/way/229771450
- Ảnh: https://commons.wikimedia.org/wiki/File:Wat_Phra_Kaew_guards_photo_Don_Ramey_Logan.jpg (nhà gác ngoại triều, tham khảo phụ)

---

## sala5 — Sala Nội Cung → nguyên mẫu: Phra Thinang Racharuedee

### 1. Nguyên mẫu thật
**Phra Thinang Racharuedee** (พระที่นั่งราชฤดี): đình mở **3 mukh (trimuk)** trong khuôn viên Maha Monthien, nơi làm lễ tắm
xức dầu; bản dựng lại bằng **cẩm thạch trắng và vàng** [đo — th.wikipedia; Wikipedia; Dhani Nivat].

### 2. Số đo thật

| Hạng mục | Số | Nguồn |
|---|---|---|
| Kích thước | **12 × 7,80 m** | Wikipedia "Grand Palace" [đo] |
| OSM | 12,2 × 6,8 m | [OSM way 229783073] — khớp |
| Bệ | **0,70 m** | th.wikipedia [đo] |
| Mái | ngói đất nung tráng men; hồi gỗ chạm **Narai cưỡi Garuda**, đầu Naga, nền kính màu | th.wikipedia [đo] |
| Mukh | nhô ra hai bên (trimuk) | th.wikipedia [đo] |
| Cột | ~6 cột cạnh dài, 4 cột đầu hồi; thân vàng, chân đen | [ước ảnh File:Ratcharuedee.jpg] |

### 3. Cấu trúc từ dưới lên
Bệ trắng 0,7 m, bậc thấp → cột vàng chân đen → mái hồi 2 lớp, ngói xám sáng trên ảnh → lamyong vàng.

### 4. Mặt bằng
Chữ nhật 12 × 7,8 m, mở; mukh nhô hai bên thành hình chữ T ngược / 3 mukh.

### 5. Cấu kiện nhận diện
1. Đình **mở, 3 mukh**.
2. Hồi gỗ chạm vàng Narai cưỡi Garuda.
3. Bệ thấp, nền cẩm thạch trắng.

### 6. Vật liệu và màu
Cẩm thạch trắng #ECEAE4; cột vàng #C9A23C chân đen #1C1A17; ngói xám sáng #B9B7B0 [ước ảnh; th.wiki chỉ ghi "ngói men"].

### 7. Trang trí
Hồi Narai cưỡi Garuda; Naga thếp vàng; chofa, bai raka, hang hong [đo].

### 8. Đề xuất cho game
Khung 9 × 9 m — sai hình. [đề xuất] **12 × 7,8 m** + 2 mukh nhô ~2 m, cột 3,2 m, đỉnh ~8,5 m, bệ 0,7 m.

### 9. Nguồn
- https://en.wikipedia.org/wiki/Grand_Palace ; https://th.wikipedia.org/wiki/พระมหามณเฑียร
- OSM: https://www.openstreetmap.org/way/229783073
- Ảnh: https://commons.wikimedia.org/wiki/File:Ratcharuedee.jpg

---

## khaomo — Giả sơn: Khao Mo

### 1. Nguyên mẫu thật
**Khao mo** (เขามอ): núi giả Thái xếp bằng đá, có cây, nhà nhỏ, tượng người và thú bằng đá / sứ / đồng; thịnh nhất thời
**Rama II, người làm vườn có khao mo trong Đại Hoàng Cung**; ví dụ còn: Wat Prayun ("có lẽ đầy đủ nhất"), Wat Arun,
Wat Pho [đo — th.wikipedia "เขามอ"]. Ý nghĩa: mô phỏng núi Meru / núi Kailasa [đo]. Nguyên mẫu trong cung:
**Khao Krailat** (xem mục summit).

### 2. Số đo
Cỡ từ chậu nhỏ tới núi đi vào được [đo]. Khao Krailat trong cung: chân ~7,8 m [OSM]. Không có số chiều cao.

### 3–7. Cấu tạo
Đá xếp lởm chởm thành nhiều chóp nhỏ, có hang và lối đi; cây cảnh uốn tròn; tượng thú Himavanta ở chân; đình prasat ở đỉnh
[đo + Wikipedia "Grand Palace"]. Màu đá xám #7D7A72, rêu #5E6B45.

### 8. Đề xuất cho game
Giữ khung giả sơn hiện có; tạo **nhiều chóp đá nhỏ** thay vì một đồi tròn; đình đỉnh theo mục summit; 4–8 tượng thú quanh chân.

### 9. Nguồn
- https://th.wikipedia.org/wiki/เขามอ ; https://en.wikipedia.org/wiki/Grand_Palace
- OSM: https://www.openstreetmap.org/way/229891965

---

# BẢNG TỔNG HỢP: KHUNG HIỆN TẠI vs ĐỀ XUẤT

| id | Khung hiện tại (rộng × sâu, tầng) | Thật (gần nhất) | Đề xuất game | Lỗi chính |
|---|---|---|---|---|
| tower | bệ 47 m, 10 tầng | Dusit ~37 m chữ thập, 1 tầng; Wat Arun 34 m chân, 67 m cao | bệ 47, thân 34→26→19→13, cao ~70 m | thân phải lùi cấp, đỉnh là chữ thập + chóp 7 tầng |
| main | 60 × 26, 2 | ~90 × 17–25, 3 tầng, chóp 50,4 m | 72 × 20, 3 tầng, chóp 40 m | thiếu dài, thiếu 1 tầng |
| ubosot | 40 × 22, 1 | 23,6 × 55,1, cao 29,2 | 22 (hồi) × 51, cao 27 | sai hướng, quá ngắn |
| monthien | 44 × 22, 1 | Amarin ~19 × 26 tường | 22 (hồi) × 30 | sai hướng |
| officeW | 52 × 16, 2 | 11,7 × 16,2 mép mái | 12 × 18 | quá dài 4,5 lần |
| officeE | 52 × 16, 2 | 56,5 × 11 | 52 × 11 | quá sâu |
| inner1 | 40 × 16, 2 | ~22 × 30 + sảnh nối, 1 tầng | 20 × 30 + nối | sai tầng, sai hướng |
| inner2 | 40 × 16, 2 | 42,1 × 22,3, 3 nhà song song | 42 × 22, 1 tầng | sai tầng, thiếu 3 hồi |
| inner3 | 26 × 14, 2 | 21,7 × 13,5, 1 tầng đá xám | 14 (hồi) × 22 | sai tầng |
| library | 22 × 22, 2 | 14,2 × 15 | 15 × 15, 1 tầng + chóp 7 | quá to |
| summit | 9 × 9 | không có số | 5 × 5, chóp 5 | — |
| sala1 | 12 × 9 | 7,9 × 7,2 | 8 × 7 | quá to |
| sala2 | 12 × 9 | 18,1 × 11,1 (gồm sàn nước) | sàn 18 × 11, đình 11 × 7 | thiếu nền nước |
| aphorn | 9 × 9 | sàn 9,4 × 4,25, chữ thập | chữ thập 9,4 | sai hình |
| sala3 | 10 × 8 | 7,5 × 11 | 7,5 × 11 | xoay |
| sala4 | 8 × 8 | không có số | 8 × 5 | — |
| sala5 | 9 × 9 | 12 × 7,8 | 12 × 7,8 | sai hình |

Phát hiện quan trọng nhất: **khung hiện tại coi mọi điện Thái như hộp có mặt tiền ở cạnh dài**. Điện Thái vào ở **đầu hồi**,
khối hẹp và cao (ubosot cao 29 m trên bề ngang 23,6 m), mái chiếm phần lớn chiều cao. Các khung "2 tầng" cho nội cung là
sai: chỉ Chakri (3 tầng), Ratchakaranya Sapha và Sutthaisawan (2 tầng) có nhiều tầng.

---

# GOAL PHÁT TRIỂN (cho bước kế)

1. Tìm số đo chiều cao Dusit, Amarin, Phra Mondop từ sách *พระบรมมหาราชวัง* (Văn phòng Hoàng gia, 2004, ISBN 974-8274-98-5)
   hoặc luận văn *A study on kudakhan in the Rattanakosin period* (Athit Limmun, ĐH Chulalongkorn 2005) — tiêu chí: mỗi
   công trình có ít nhất 1 số cao [đo].
2. Mở lại trang ĐH Silpakorn `web-temple` và silpa-mag khi DNS hoạt động để xác nhận các số đang chỉ có từ đoạn trích.
3. Lấy link File:… cho Ratchakaranya Sapha, Phiman Rattaya, Buddha Rattanasathan, Sitalaphirom, Dusidaphirom, Khao Krailat
   khi có lại hạn mức tìm kiếm.

---

# ĐỘ TIN CẬY

| Mức | Công trình | Lý do |
|---|---|---|
| **Chắc** (có số đo công bố + OSM khớp) | ubosot (23,60 × 55,12; cao 29,2), sala5 Racharuedee (12 × 7,80; bệ 0,70), main Chakri (cao 50,40; 3 tầng; mặt tiền ~90 m từ 2 cách đo) | Số từ ĐH Silpakorn / Wikipedia / silpa-mag; một phần chỉ là đoạn trích tìm kiếm |
| **Khá** (mặt bằng OSM + mô tả cấu trúc có nguồn, thiếu chiều cao) | tower/Dusit (chữ thập ~37 m, bệ 2,85, chóp 7 tầng), monthien/Amarin (bệ 0,5), officeE Sutthaisawan (+ đo ảnh chính diện), inner2 Chakraphat, library Phra Mondop, aphorn (sàn 4,25 × 9,40 chỉ từ đoạn trích), sala2 Aisawan | Mặt bằng tin được; chiều cao là ước ảnh hoặc chưa có |
| **Suy ra** | officeW Ratchakaranya, inner1 Phiman Rattaya (OSM gộp cả sảnh nối), inner3 Buddha Rattanasathan, sala1 Sitalaphirom, sala3 Dusidaphirom, summit | Chỉ có đường bao OSM và mô tả chữ; chiều cao không có |
| **Không tìm được số** | sala4 (sala rai Wat Phra Kaew), chiều cao Dusit / Amarin / Phra Mondop, chiều cao tường cung, độ dốc mái | Hết hạn mức tìm kiếm; trang chuyên môn Thái không mở được |
| **Mâu thuẫn đã ghi** | Wat Arun cao 67 m (th.wiki) vs 66,8–86 m (en.wiki) → chọn 67; Dusit chóp 7 vs 9 tầng → chọn 7; Aphorn người xây Rama IV vs Rama V → chọn Rama IV; Dusit năm xây 1789/1790/1806 → chọn 1789–1790 (Wikipedia, th.wiki, Dhani Nivat; 1806 chỉ do trang bảo tàng Muang Boran ghi, không kèm nguồn — https://www.muangboranmuseum.com/en/landmark/dusit-maha-prasat-palace/) | |
