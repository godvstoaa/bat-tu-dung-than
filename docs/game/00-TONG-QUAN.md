# 00 · Tổng quan: tầm nhìn, vòng chơi, liên kết hệ thống, luật nền

> **Trạng thái:** `[ĐÃ CÓ]` cho mọi hệ được nêu; riêng §0.3 (trụ cột viết lại) là `[ĐỀ XUẤT]` chờ duyệt
> **Bộ phận chủ trì:** Thiết kế game
> **Nguồn sự thật trong mã:** không có mô-đun riêng; mỗi dòng dẫn về chương hệ thống
> **Test:** xem [A2](phu-luc/A2-kiem-thu.md)
> **Thay thế:** `GAME-V2-THIET-KE` §1–§3, `GAME-HUYEN-QUAN-SPEC` §1–§3, `GAME-SINH-TON-KINH-TE-DAC-TA` §0, `docs/gdd/01-tam-nhin` (phần trụ cột)
> **Kiểm với mã ngày:** 2026-11-16

## 0.1 Mục đích và phạm vi

Chương này là thứ duy nhất mọi bộ phận đều phải đọc. Nó nói game là gì, các hệ nối với nhau thế nào, và những luật nào không ai được phá. Chi tiết từng hệ nằm ở chương 10–23; kỹ thuật ở 30–32.

## 0.2 Tóm tắt một trang

| | |
|---|---|
| **Tên** | Huyền Quán Online (bản iOS: «Học Quán») |
| **Thể loại** | Mô phỏng đời sống tu tiên nhiều người chơi, không chiến đấu, lấy mệnh lý làm lõi |
| **Nền tảng** | Web (three.js), điện thoại qua trình duyệt; vỏ iOS bằng Capacitor |
| **Một câu** | Nhập ngày giờ sinh thật, nhận một nhân vật mang đúng lá số của mình, rồi sống trong Huyền Thành: hỏi thầy, làm nghề hợp mệnh, dựng nhà, tu luyện, qua nhiều kiếp |
| **Vì sao khác** | Mọi lời luận và mọi hệ số đều do engine Bát Tự thật của app tính; không có con số bịa |
| **Người chơi đến vì** | xem bói, giải bát tự, phong thủy (trục chính, QĐ-17) |
| **Người chơi ở lại vì** | đời sống có luật chặt, nghề hợp mệnh giàu lên thật, nhà hợp phong thủy, tu luyện và luân hồi |
| **Không có** | chiến đấu, trả tiền để giàu, chat tự do giữa người chơi, treo máy |

## 0.3 Trụ cột thiết kế `[ĐỀ XUẤT]`

Sáu trụ cột gốc (T1–T6) được viết cho bản tầm nhìn «văn tu, không sát phạt, không có cái chết». Các quyết định từ QĐ-12 trở đi đã đưa vào đói, bệnh, luật và luân hồi. Bảng dưới viết lại trụ cột cho khớp game đang chạy; khi được duyệt thì thay hẳn bản cũ (xem MT-1 ở chương 02).

| Mã | Trụ cột | Câu kiểm | Gốc |
|---|---|---|---|
| **TC-1** | Lá số là nhân vật | Hệ số nào tác động lên người chơi cũng truy được về Dụng / Hỷ / Kỵ thần hoặc một trường của `analyze()` | T1 |
| **TC-2** | Mệnh do ta tạo | Lá số chỉ cho xu hướng. Không màn nào nói «đã định». Việc làm của người chơi đổi được kết quả | T2 |
| **TC-3** | Bói toán là trục chính | Từ lúc vào game tới lúc hỏi được thầy câu đầu tiên: không quá ba thao tác | QĐ-17 |
| **TC-4** | Sống thật, không sát phạt | Không có đánh nhau. Có đói, bệnh, nợ, luật. Tiền chỉ đến từ lao động và buôn bán | thay T3 |
| **TC-5** | Thế giới thật | Thấy cửa là vào được; vào được là có việc để làm | T4 |
| **TC-6** | Đúng cổ pháp | Game và trang chính của app là một người thầy nói hai lần | T5 |
| **TC-7** | Tôn trọng và an toàn | Không cảnh nào khiến người tu thật phải quay mặt đi; không lời nào doạ người chơi | T6 |

Khi hai trụ cột kéo ngược nhau: **TC-7 > TC-2 > TC-1 = TC-6 > TC-3 > TC-4 > TC-5**.

## 0.4 Vòng chơi theo năm tầng thời gian

| Tầng | Người chơi làm gì | Hệ thống | Chương |
|---|---|---|---|
| **Phút** | đi lại, hỏi thầy một câu, làm một việc trong ca, ăn một bữa | di chuyển, thầy bói, mini-game nghề, sinh tồn | 16, 12, 14, 13 |
| **Ngày** | gieo quẻ đầu ngày, ăn đủ bữa, ngủ đúng chỗ, làm 1–3 ca, giải án, thắp hương, nhiệm vụ mệnh | Âm Đức, vận số ngày, thuế thân, trần thưởng ngày | 18, 13, 14, 12 |
| **Tuần** | lên bậc tay nghề, thuê ruộng, mở quầy, mua đồ bài trí, chỉnh phong thủy nhà | Guild, sản xuất, chợ, nhà riêng | 14, 17, 15 |
| **Kiếp** | mua nhà, cưới, mở tiệm, học pháp môn, đột phá cảnh giới | kinh tế dài hạn, hôn nhân, tu luyện | 15, 20, 17, 18 |
| **Nhiều kiếp** | chết vì đói hoặc bệnh → Âm phủ cân nghiệp → đầu thai với lá số mới; đắc đạo | luân hồi, Sổ Luân Hồi | 18 |

## 0.5 Bản đồ liên kết hệ thống

Đây là phần trả lời câu «các mảng nối với nhau thế nào».

```
                              ┌──────────────────────────────┐
   ngày giờ sinh (ở lại máy)──▶  LÁ SỐ  →  Dụng · Hỷ · Kỵ thần │  (11)
                              └──────┬───────────────────────┘
        ┌────────────┬───────────────┼───────────────┬──────────────┬─────────────┐
        ▼            ▼               ▼               ▼              ▼             ▼
   phẩm phục     thầy bói       nghề hợp mệnh    phong thủy     bệnh theo      hệ số
   màu áo (11)   luận theo      lương ×2 / ×0,5  nhà, sao hợp   hành yếu (13)  phạt (19)
                 lá số (12)     nhiệm vụ mệnh    mệnh (15)
                                    (14)
        │            │               │               │              │             │
        │            ▼               ▼               ▼              ▼             ▼
        │        PHÚC KHÍ  ◀── giải án, lễ      TIỀN (xu) ──▶ ăn, ngủ, thuốc, thuế, nhà, xe
        │        (điểm Huyền học)                 │   ▲            (13, 15)
        │            │                            │   └── chợ, tiệm, nhà hàng (17)
        │            ▼                            ▼
        │      pháp môn, đột phá ◀── ÂM ĐỨC ◀── sống điều độ, làm trung thực (18)
        │      cảnh giới (18)        NGHIỆP LỰC ◀── phạm luật, gian lận (19, 17)
        │            │                    │
        │            └──────────┬─────────┘
        │                       ▼
        │              chết vì đói / bệnh → Âm phủ cân nghiệp → 6 cõi → kiếp mới,
        └──────────────────────────────────────────────────────── lá số mới (18)
```

### 0.5.1 Mệnh chạm vào đâu

| Hệ | Dùng dữ liệu mệnh nào | Hiệu ứng | Chương |
|---|---|---|---|
| Phẩm phục | hành Dụng thần, Hỷ thần | màu áo và đai; bộ trùng Dụng thần được «Hợp mệnh» | §11 |
| Thầy bói, sảnh nghề | cả lá số (chỉ trên máy và qua AI của app) | lời luận theo đúng lá số | §12 |
| Việc làm | hành nghề so với Dụng / Hỷ / Kỵ | thu nhập, hao Tỉnh, tay nghề, rủi ro, trần thăng bậc | §14.1.1 |
| Nhiệm vụ mệnh | Dụng thần, giờ, chỗ | chỉ người đúng mệnh, đúng giờ, đúng chỗ mới thấy | §14.1.6 |
| Bệnh | hành yếu nhất, áo hợp mệnh | loại bệnh dễ mắc; đơn thuốc hợp Dụng thần khỏi nhanh | §13.2.3 |
| Nhà | hành của phường, đồ đạc, hướng | sao hợp mệnh khi mua; điểm phong thủy | §15 |
| Bếp | Thực Thần, Thương Quan | Thực căn: năng khiếu nấu | §17.3.1 |
| Luật | Bát Môn của cung, ngày xung tuổi, hành cung so với Dụng thần | hệ số điểm tội | §19 |
| Pháp môn | Dụng thần | học rẻ một nửa khi hợp mệnh | §18.4.2 |
| Nơi xuất hiện | Dụng thần | gợi ý miếu ứng với hành | §10 |
| Luân hồi | — | kiếp mới nhận lá số **hư cấu**, Dụng thần đổi | §18.5.4 |

### 0.5.2 Bảy loại tài nguyên: sinh ra ở đâu, đi về đâu

| Tài nguyên | Là gì | Sinh ra từ | Tiêu vào | Đổi được không |
|---|---|---|---|---|
| **Tiền** (xu → hào → đồng → lượng bạc → lượng vàng) | tiền mua bán duy nhất | lương, buôn bán, nhiệm vụ mệnh, Thương hội thu mua | ăn, ngủ, thuốc, thuế, nhà, xe, đồ, phí, phạt | không đổi từ thứ khác |
| **Phúc Khí** | điểm Huyền học hiển lộ | giải án, lễ bái, học, bố thí | học pháp môn, giải hạn, sám hối, đột phá | không mua bán, không chuyển |
| **Âm Đức** | phúc đức tích ngầm, chỉ thấy mức | sống điều độ, làm trung thực, cứu người | bị dùng khi thoát chết; đem cân ở Âm phủ | không |
| **Nghiệp Lực** | nợ nhân quả, chỉ thấy mức | phạm luật, gian lận, quỵt nợ | phải trả: sám hối, công quả, khổ sai | không |
| **Ngọc** | tiền trả phí | chỉ từ nạp (web); chưa có cổng thanh toán | thời trang quý, VIP, Đại Xá, nhà lớn | không đổi ra tiền |
| **Chỉ số sinh tồn** | No, Tỉnh, Khí huyết | ăn, ngủ, thuốc | tụt theo giờ chơi và việc làm | — |
| **Tay nghề, uy tín** | lý lịch nghề | làm việc | mở bậc, mở chỗ làm | — |

Luật của bảng: không có mũi tên nào đi **vào** cột tiền từ Phúc Khí, Âm Đức hay Ngọc (LN-03, LN-04).

## 0.6 Hành trình người chơi

| Mốc | Trải nghiệm đích | Hệ đảm nhiệm |
|---|---|---|
| 3 phút đầu | nhập ngày sinh, thấy bốn trụ lật ra, nhận áo màu Dụng thần, đứng cạnh Thầy Tử Bình | nhập môn §11, tân thủ 8 bước |
| 15 phút đầu | hỏi thầy câu đầu tiên và nhận lời luận đúng lá số mình | thầy bói §12 |
| Giờ đầu | đói lần đầu, ăn ở quầy cơm, gánh nước kiếm bữa, thuê giường | sinh tồn §13, việc vặt §14 |
| Ngày đầu | xin được một chỗ làm; biết nghề nào hợp mệnh mình | Guild §14 |
| Tuần đầu | để dành, mua đồ đầu tiên, thử nghề hợp Dụng thần và thấy lương gấp đôi | §14, §15 |
| Tháng đầu | mua Tiểu Xá (15–58 ngày tuỳ mệnh và độ chăm), bài trí, đột phá Luyện Khí | §15, §18 |
| Dài hạn | mở quán, cưới, học pháp môn, qua một kiếp, đắc đạo | §17, §20, §18 |

## 0.7 Phạm vi và nền tảng

- **Khách và tài khoản.** Chơi được ngay không cần đăng nhập. Khách có ví riêng trên máy và không giao dịch với người khác. Đăng nhập (Google, mã email) để lưu mây và tham gia kinh tế chung. → §31.2
- **Bản iOS.** Tắt gieo quẻ, xin xăm, vận hạn bản thân và mọi AI; đổi tên thành «Học Quán»; ẩn nạp Ngọc. → §40, §32
- **Ngoại tuyến.** Mất mạng game vẫn chạy: thế giới, các gian, gánh nước, sổ kinh tế trên máy. → LN-08
- **Ngoài phạm vi:** chiến đấu, bang hội đánh nhau, giao dịch tiền thật giữa người chơi, 12 thánh địa của bản tầm nhìn (lớp L4).

## 0.8 Luật nền

Mười sáu luật dưới đây đứng trên mọi chương. Muốn đổi một luật thì phải có quyết định mới ở chương 02.

| Mã | Luật | Lý do | Chương thi hành |
|---|---|---|---|
| **LN-01** | Ngày giờ sinh thật KHÔNG rời máy và không vào đo lường. Ngoại lệ duy nhất: tứ trụ tám chữ gửi theo từng lượt xem của thầy mệnh lý, có đồng thuận, xoá sau 30 ngày | riêng tư; QĐ-07 | §31.2.3, §12.6.3 |
| **LN-02** | Máy chủ quyết mọi thứ chạm tới tiền chung, kho, chỗ làm, nhà, hôn thú. Client chỉ gửi hành động | chống gian | §31.3 |
| **LN-03** | Tiền chỉ sinh từ lao động và buôn bán. Không đổi từ Phúc Khí, Âm Đức, Ngọc. Không có Ngọc miễn phí | QĐ-12, QĐ-13 | §13.1 |
| **LN-04** | Phúc Khí, Âm Đức, Nghiệp Lực không phải tiền: không mua bán, không chuyển cho người khác | QĐ-12 | §18.1 |
| **LN-05** | Người chơi với người chơi chỉ nói bằng cụm từ soạn sẵn và cử chỉ. Gõ tự do chỉ với NPC | an toàn, quy định kho ứng dụng | §20, §21.3.1 |
| **LN-06** | LLM chỉ đề xuất; máy chủ kiểm mọi lệnh nghiệp vụ. LLM không bao giờ nhận ngày sinh, email, tên thật | chống thao túng | §21.3 |
| **LN-07** | Lời hiển thị không doạ: không «đại hung», «tai hoạ», «chắc chắn sẽ». Nhận định nào cũng là xu hướng kèm một việc làm được | TC-2, TC-7 | §40 |
| **LN-08** | Game chơi đủ khi AI tắt, hết lượt hoặc mất mạng | không phụ thuộc AI | §21, §30 |
| **LN-09** | Không chết bất ngờ; không cơ chế nào khoá tài khoản. Đoạn chơi cõi dưới tối đa 25 phút. Không trả tiền để rút ngắn | QĐ-12, QĐ-16 | §18.5 |
| **LN-10** | Bản iOS tắt gieo quẻ, xin xăm, vận hạn bản thân, mọi AI; ẩn nạp Ngọc | App Store 4.3(b) | §40, §32 |
| **LN-11** | Tượng thần không chữ, không thánh tích cụ thể. NPC tín ngưỡng chỉ chạy kịch bản cho tới khi có biên bản tham vấn | tôn trọng | §21, §40 |
| **LN-12** | Định danh đã phát hành không đổi: chỉ số nhà `h`, id nhà theo ô. Đổi khoá tiệm thì nâng `guild-core.LAYOUT_VER` | người chơi đã mua, đã giữ chỗ | §10, §15 |
| **LN-13** | Tài sản 3D chỉ gồm model CC0 tải về hoặc tự sinh bằng Blender và mã. Mỗi model có dòng nguồn gốc | giấy phép, chi phí | §23 |
| **LN-14** | Mỗi loại địa điểm có một mô-đun thuần làm nguồn toạ độ duy nhất; mô-đun dựng hình chỉ đọc | hết lệch giữa hình, va chạm, test | §10, §30 |
| **LN-15** | Mọi phần thưởng có trần theo ngày. Không việc nào làm được khi treo máy | chống cày | §12, §14 |
| **LN-16** | Trong thành không phá được gì. Chỉ công trình ngoài tường Ngoại Thành mới phá được | bảo vệ thế giới chung | §19 |

## 0.9 Liên kết, kiểm thử, việc còn mở

- Thuật ngữ: [01-TU-DIEN](01-TU-DIEN.md). Quyết định và mâu thuẫn: [02-QUYET-DINH](02-QUYET-DINH.md).
- Kiểm: bảng §0.5.1 phải khớp cột «Liên kết với hệ khác» của từng chương (kiểm bằng mắt M2, M3 của manifest).
- Việc mở: duyệt §0.3 (xem `VC-030` ở [04-LO-TRINH](04-LO-TRINH.md)).
