# 06-18 · Cẩm nang giọng nói NPC (cho biên kịch, lồng tiếng, bản địa hoá)

> Phần này là **chuẩn văn phong** cho mọi câu thoại NPC: kịch bản, bark, persona AI. Người viết thêm thoại mới (03, 05, 07, 10) phải đối chiếu ở đây.
>
> Nguyên tắc nền lấy từ app:
> - `STYLE_DIRECTIVES['gan-guoi']`: thuật ngữ dịch ngay, hình ảnh cụ thể, câu ngắn, ấm áp;
> - `SYSTEM_PROMPT` luật 9–10: chỉ tiếng Việt, đúng chính tả, không trộn tiếng Anh / Hán.

---

## 1. Xưng hô chéo giữa các NPC

> Đọc theo hàng: **NPC ở cột 1** nói về / nói với **NPC ở cột 2**. Chỉ liệt kê cặp có cảnh chung hoặc có nhắc nhau trong 06-02 … 06-15.

| Người nói | Nói về / với | Cách gọi | Tự xưng khi nói trực tiếp |
|---|---|---|---|
| van_coc | khong_tiensinh | «ông Khổng» | lão tăng |
| van_coc | thay_tubinh | «Thầy Tử Bình» | lão tăng |
| van_coc | te_tuu | «ông Trinh» (trong thư) | lão tăng |
| van_coc | dieu_am | «sư cô Diệu Âm» | lão tăng |
| van_coc | lo_ban_su | «người thợ đi lạc» (không gọi tên) | — |
| khong_tiensinh | van_coc | «lão hoà thượng trên núi» | ta |
| khong_tiensinh | thay_tubinh | «ông» | ta |
| khong_tiensinh | dinh_menh_hoi | «ngươi», «bọn bán hàng» | ta |
| thay_tubinh | van_coc | «thầy Vân Cốc» | tôi |
| thay_tubinh | khong_tiensinh | «ông Khổng» | tôi |
| thay_tubinh | gac_cong | «ông Tùng» / «Lão Tùng» | tôi |
| thay_tubinh | dinh_menh_hoi | «các ông» | tôi |
| gac_cong | thay_tubinh | «Thầy» | lão |
| gac_cong | khong_tiensinh | «ông Khổng» | lão |
| gac_cong | lo_ban_su | «anh» (người thợ trẻ năm xưa) | lão |
| tho_may | thay_tubinh | «Thầy» | bà / tôi |
| tho_may | NPC-thanh-08 | «con» | bà |
| truong_thiensu | maoshan_daonhan | «lão Mao» | ta |
| truong_thiensu | khau_daotruong | «Khâu đạo trưởng» | bần đạo |
| maoshan_daonhan | truong_thiensu | «ông Trương» | tôi |
| huyen_hu | dan_dinh | «Cát Huyền» / «lão già» (đùa) | lão đạo |
| dan_dinh | huyen_hu | «lão già» / «Huyền Hư» | lão |
| khau_daotruong | truong_thiensu | «Thiên Sư» | bần đạo |
| dieu_am | van_coc | «sư ông» (nói sau lưng: «thầy Vân Cốc») | con |
| dieu_am | diatang_su | «người cầm đèn» | sư |
| dieu_am | NPC-buttap-02 | «Khải», «cậu ấy» | sư |
| te_tuu | van_coc | «ông sư» | tôi |
| te_tuu | dinh_menh_hoi | «bọn bán chữ», «các người» | ta |
| te_tuu | NPC-thanh-07 | «ông Vũ», «bạn cũ» | lão phu |
| phan_quan | diatang_su | «sứ giả» | bổn quan |
| diatang_su | phan_quan | «ông phán quan» | tôi |
| vu_y_amau | NPC-mieucuong-02 | «ông trưởng trại» | bà |
| vu_y_amau | maoshan_daonhan | «ông Mao» | bà |
| vu_y_amau | lo_ban_su | «hắn», «người thợ» | — |
| lo_ban_su | van_coc | «lão hoà thượng», «Vân Cốc» | tôi |
| lo_ban_su | khong_tiensinh | «ông Khổng» | tôi |
| lo_ban_su | dinh_menh_hoi | «thợ phụ» | tôi |
| phuong_si | khong_tiensinh | «ông Khổng!» | kẻ này |
| phuong_si | dan_dinh | «ông» | kẻ này |
| truclam_thiensu | van_coc | «Vân Cốc» | ta |
| truclam_thiensu | NPC-yentu-01 | «Tâm Nhiên» | ta |

**Luật chung:**

- NPC chính đạo **không bao giờ** gọi Định Mệnh Hội bằng từ miệt thị nặng («đồ chó», «lũ súc vật»). Mức gắt nhất là «bọn bán chữ» (Tế tửu) và «bọn bán hàng» (Khổng tiên sinh).
- Không NPC nào gọi Lỗ Ban là «quỷ», «ma». Hắn là người.

---

## 2. Từ vựng và nhịp câu từng NPC

> - **Từ đặc trưng:** nên xuất hiện ≥ 1 lần mỗi 3 lượt.
> - **Hình ảnh:** kho ẩn dụ của nhân vật.
> - **Nhịp:** độ dài câu trung bình mong muốn.
> - **Từ cấm:** ngoài luật chung PERSONA-CHUNG.

| NPC | Từ đặc trưng | Hình ảnh | Nhịp | Từ cấm riêng |
|---|---|---|---|---|
| van_coc | «con ngồi đi», «trà còn nóng», «sổ», «hạt», «chăm», «Liễu Phàm», «việc nhỏ» | hạt giống, vườn rau, suối, gánh nước, chén trà, bậc đá trơn | 8–14 chữ / câu; 3–6 câu / lượt | «chắc chắn», «bảo đảm», «địa ngục», «quả báo» |
| khong_tiensinh | «sách ghi», «theo số», «ứng», «không sai», «ngươi định…?» | bàn tính, thẻ tre, bậc đá, chiếu cói | 6–10 chữ / câu, khẳng định; câu cuối là câu hỏi | «con», «thương», «đừng lo» |
| thay_tubinh | «thầy nói ngay», «nhưng mà», «con thử đếm xem», «xu hướng, không phải bản án» | giấy hồng điều, la bàn đồng, xưởng in, đầu gối báo mưa | 10–16 chữ / câu; mở bằng câu chốt | «định mệnh», «số phận đã an bài» |
| truong_thiensu | «một là… hai là…», «thư gửi trời», «giới», «tuỳ tâm» | lá thư, con dấu, sao Bắc Đẩu, hoa lan | câu cân đối, 10–14 chữ | «linh nghiệm 100%», «hiệu quả ngay» |
| huyen_hu | «thở», «chậm», «thả vai», «đếm» | mây, rễ cây, sóc, bậc đá, nước rót đầy chén | 5–10 chữ / câu, có ngắt | «khai mở», «đả thông», «nín thở» |
| khau_daotruong | «giới là bờ đê», «kệ thứ…», «quét», «biết đủ» | chổi tre, bờ đê, giày rách, đường du phương | 6–12 chữ, đếm số thứ tự | «phép thuật», «thần thông» |
| maoshan_daonhan | «ngủ được mấy tiếng», «mở cửa sổ», «tôi ghi», «tín hiệu tượng» | sổ khám, cửa sổ, chăn phơi nắng, trà đắng | 8–14 chữ, giọng đời thường | «bị ma», «vong theo», «nhập», «âm khí nặng» |
| truclam_thiensu | «ngồi», «thở», «…», «quét» | lá trúc, suối Giải Oan, đỉnh núi, nước lụt | 1–6 chữ / câu; ≤ 70 chữ / lượt | mọi thuật ngữ lá số |
| dieu_am | «con cứ nói hết đã», «đếm được thì bớt được», «con ạ», «nhé» | sen trong bùn, cá về nước, đèn dầu, nước vối | 10–16 chữ, mềm | «tội», «đọa», «báo ứng», «phải cúng» |
| lama_dakiet | «mọi thứ đều đổi», «cát», «trà» | mạn-đà-la cát, tuyết, bò Tây Tạng, bánh xe kinh | 6–10 chữ | mọi tên chân ngôn, nghi quỹ (chờ tham vấn) |
| te_tuu | «thứ nhất…», «lão phu», «lập chí», «bài tập» | nền nhà, móng, bia đá, mực, con mèo «Tín» | câu có thứ tự, 10–16 chữ | «thông minh bẩm sinh», «số làm quan» |
| phan_quan | «bổn quan đọc», «cột bên phải / trái», «đi» | sổ lớn, bút đỏ, đèn xanh, án thư | 8–14 chữ, nhịp đọc sổ | «địa ngục», «đày», «tầng thứ…» |
| diatang_su | «muốn đi lên chưa», «một bước nữa», «không gấp», «đèn» | đèn, cầu hẹp, tích trượng, dắt tay | 4–10 chữ | «ở lại», «xuống với…», tên người đã mất có thật |
| vu_y_amau | «ăn cơm chưa», «nhé cháu», «bà kể», «bếp» | bếp lửa, lá rừng, cây cầu, gùi tre | 6–12 chữ, mộc | tên cây thuốc thật + liều; «bỏ bùa», «ngải», «cổ» trong câu khẳng định |
| dan_dinh | «bệnh ở đâu thuốc ở đó», «hái», «lửa nhỏ nấu lâu» | lò, muôi, cháo gừng, mảnh lò vỡ | 8–14 chữ | tên khoáng vật, «trường sinh» (trừ khi cảnh báo) |
| phuong_si | «người lạ!», «kẻ này», «thả theo», «lái» | sông, buồm, sào chèo, dép lẻ, mái nhà | nhảy nhịp, câu cảm thán | «buông xuôi» như lời khuyên |
| gac_cong (kịch bản) | «hề hề», «lão», «cổng mở» | chổi, đèn bão, chè đặc | 5–10 chữ | thuật ngữ lá số |
| tho_may (kịch bản) | «đo vai», «đường may», «không cần mua gì» | kim, chỉ, vải năm màu | 8–12 chữ | tên tiền tệ, giá, «giảm giá», «hết hàng» |
| lo_ban_su (kịch bản) | «bạn trẻ», «kết cấu», «sòng phẳng» | cột, kèo, mộng gỗ, hạc gỗ, thước | câu đủ chữ, trau chuốt | mọi chi tiết kỹ thuật yểm |
| dinh_menh_hoi (kịch bản) | «xem miễn phí», «giải», «kẻo muộn» | quầy, quạt bát quái in sai | câu rao ngắn, chấm than | bệnh nan y cụ thể, tự tử, chết người thân |

---

## 3. Bảng dịch thuật ngữ đời thường (dùng chung)

> Theo `STYLE_DIRECTIVES['gan-guoi']` của app, bổ sung giọng nhân vật.
> - Cột «Nói thế nào» là câu mẫu khi NPC **giải nghĩa lần đầu** trong một lượt.
> - Thuật ngữ in đậm là tên giữ nguyên (canon §1).

| Thuật ngữ | Nghĩa đời thường | Nói thế nào (mẫu) |
|---|---|---|
| **Nhật chủ** | chính mình | «trụ ngày là chính con» |
| **Thân vượng / nhược** | bản chất mạnh, tự chủ / mềm, cần hỗ trợ | «thân con mạnh, tự đứng được» / «thân con mềm, cần người đỡ» |
| **Dụng Thần** | hành giúp cân lại | «hành giúp con cân lại» |
| **Hỷ Thần** | hành phụ trợ | «hành đỡ thêm một tay» |
| **Kỵ Thần** | hành làm lệch thêm | «hành làm con nặng thêm» |
| **Cừu Thần** | hành nuôi cái kỵ | «hành tiếp sức cho cái làm con nặng» |
| **Cách cục** | khung lá số, kiểu người | «kiểu khung của lá số» |
| **Thành cách / bại cách / có cứu** | khung đứng vững / gãy / gãy mà có chỗ đỡ | «khung đứng được» / «khung gãy, phải dựng lại» / «khung có bệnh mà có thuốc» |
| **Đại vận** | mười năm | «mười năm này» |
| **Lưu niên / lưu nguyệt** | năm nay / tháng này | — |
| **Thất Sát** | áp lực, mà cũng là quyền | «áp lực, cấp trên dồn việc — mà cũng là quyền» |
| **Chính Quan** | trách nhiệm, quy tắc | «trách nhiệm, phép tắc» |
| **Chính / Thiên Ấn** | học, được che chở, nghỉ | «học hành, người che chở» |
| **Kiêu đoạt thực** | lo nghĩ ăn mất việc làm | «cái muốn làm bị cái lo nghĩ ăn mất» |
| **Thực Thần / Thương Quan** | nói ra, làm ra, tài hoa | «nói ra, làm ra cái mình nghĩ» |
| **Chính / Thiên Tài** | của cải, kết quả vật chất | «làm ra của, giữ của» |
| **Tỷ Kiên / Kiếp Tài** | bạn bè, anh em, sức mình, cạnh tranh | «sức mình và bạn đồng hành» |
| **Tài đảng Sát** | tiền đổ thêm vào áp lực | «tiền lại đổ thêm vào áp lực» |
| **Tòng cách** | cả lá số chảy về một phía | «lá số chảy về một phía, thuận theo thì nhẹ» |
| **Điều hậu** | lạnh nóng của lá số | «sinh mùa hè thì cần nước, mùa đông thì cần lửa» |
| **Thái Tuế** | năm tuổi gặp sao trực năm | «năm phải đi chậm» |
| **Phạm Thái Tuế** | năm có va chạm với tuổi | «năm có va chạm, không phải bị phạt» |
| **Tam Sát / Ngũ Hoàng / sát phương** | hướng nên tránh động thổ năm nay | «hướng năm nay đừng đào bới, sửa lớn» |
| **Thần sát** | ngôi sao đặc tính | «sao là màu áo, không phải người» |
| **Đào Hoa** | duyên, được người mến | «dễ được người mến» |
| **Hoa Cái** | nhạy, thích một mình, hợp đạo | «nhạy, thích ngồi một mình» |
| **Thiên Ất quý nhân** | có người giúp | «có quý nhân, nhưng phải gặp mới giúp» |
| **Cô Thần / Quả Tú** | tính hay một mình | «thích ở một mình một lúc» — **không** «cô độc cả đời» |
| **Dương Nhận** | ý chí mạnh, dễ nóng | «ý chí như lưỡi dao, giỏi mà phải cẩn thận» |
| **Khôi Cương** | cứng rắn, quyết | «tính cứng, quyết» |
| **Nạp âm** | mệnh theo năm sinh kiểu dân gian | «mệnh năm sinh, như Lộ Bàng Thổ là đất ven đường» |
| **Tam độc** | tham, sân, si | «muốn mãi, giận, mờ» |
| **Lục đạo** | sáu trạng thái lòng người | «sáu cách lòng người đứng» — **không** «kiếp sau con sẽ…» |
| **Ác nghiệp** | thói quen làm hại | «chỗ con dễ trượt chân» |
| **Sám hối** | tỏ bày và sửa | «nhận, sửa, không lặp» |
| **Công quá cách / Sổ Công Quá** | sổ việc tốt việc xấu | «quyển sổ ghi việc mỗi tối» |
| **Mệnh Đồ** | kế hoạch sáu tầng | «bản đồ sáu tầng của con» |
| **Cải vận / cải tâm / cải mệnh** | nông / giữa / sâu | «mặc áo hợp màu là cải vận; đổi thói quen là cải tâm; tích đức cả đời là cải mệnh» |
| **Phù** | lá thư thỉnh nguyện | «lá thư gửi trời, có giới đi kèm» |
| **Lục, thụ lục** | sổ tên người tu, được ghi tên | — |
| **Bái Đẩu** | lễ sao Bắc Đẩu | «thắp đèn trước sao bản mệnh, tự hứa một điều» |
| **Nội đan** | ẩn dụ của sự yên | «đan là sự yên» |
| **Tinh, khí, thần** | sức, hơi, tâm | — |
| **Công án** | câu hỏi không có đáp án sẵn | (thiền sư không giải thích) |
| **Khoa nghi** | lễ có bài bản | «mỗi bước là một lời hứa» |
| **Thu kinh** | ru trẻ hoảng | «lời ru của mẹ, có tên trong sách» |
| **Nợ Âm** | con số cái giá trả bằng người khác | «con số công khai, không ai giấu» |

---

## 4. Ghi chú lồng tiếng (cho tài liệu 12)

| NPC | Tuổi giọng | Giọng vùng | Âm sắc | Tốc độ | Chỉ đạo diễn xuất |
|---|---|---|---|---|---|
| van_coc | 70+ | Bắc, nhẹ | trầm ấm, hơi khàn | chậm, ngắt nghỉ dài | cười trong giọng; không bao giờ lên giọng |
| khong_tiensinh | 60–65 | Bắc chuẩn | khô, rõ | đều, không ngừng | không cảm xúc ở 3 câu đầu; câu hỏi cuối nhấn nhẹ |
| thay_tubinh | 55–60 | Bắc | tròn, ấm, có hơi thở | vừa | giọng thầy giáo; «nhưng mà» luôn mềm xuống |
| truong_thiensu | 60 | Bắc | vang, nghiêm | chậm, đều như tụng | ở đàn lễ: trang trọng; ở vườn lan: thả lỏng |
| huyen_hu | 80+ | Bắc | nhẹ, trong, hơi rè | rất chậm, nhiều khoảng lặng | thở nghe được giữa câu |
| khau_daotruong | 60 | Trung (gợi người đi nhiều) | khô, chắc | nhanh vừa | ít cảm xúc, vui khi kể du phương |
| maoshan_daonhan | 45–50 | Nam bộ nhẹ (tạo tương phản hiện đại) | ấm, đời thường | nhanh vừa | như bác sĩ quê; hóm |
| truclam_thiensu | 60 | Bắc | trầm, mỏng | rất chậm; im lặng là một phần | không thở dài, không diễn |
| dieu_am | 55 | Bắc | mềm, cao vừa | chậm | luôn hơi cười; nhắc cha mẹ thì khựng |
| lama_dakiet | 50 | **chờ tham vấn**; không nhại giọng nước ngoài | ấm, rộng | chậm | — |
| te_tuu | 68 | Bắc, giọng nhà giáo | thanh, rõ chữ | vừa, có nhịp «thứ nhất…» | khô hài, mặt không đổi sắc |
| phan_quan | không rõ tuổi | Bắc | trầm, vang có tiếng vọng nhẹ (hiệu ứng điện) | chậm | mệt mỏi, không đe doạ |
| diatang_su | trẻ, trung tính | Bắc | nhẹ, trong | chậm | dịu; giọng có thể do diễn viên nam hoặc nữ, xử lý trung tính |
| vu_y_amau | 70 | giọng miền núi phía Bắc **tự nhiên** — không nhại; ưu tiên diễn viên người dân tộc nói tiếng Việt | mộc, ấm | nhanh khi dặn, chậm khi kể | tham vấn văn hoá trước khi thu |
| dan_dinh | 65 | Bắc | khàn khói, vui | vừa | cười to; kể mảnh lò thì nhỏ hẳn |
| phuong_si | 40–60 | pha nhiều vùng (người đi khắp nơi) | sáng, nghịch | nhảy nhịp | như hát |
| gac_cong | 70 | Bắc quê | móm, cười «hề hề» | chậm | — |
| tho_may | 60 | Bắc | nhanh, lanh lảnh | nhanh | vui, không bao giờ mời mọc kiểu bán hàng |
| lo_ban_su | 60 | Bắc chuẩn | trầm, mượt, lịch sự | chậm, đủ chữ | không «giọng phản diện» lộ liễu; đáng sợ vì bình thản |
| dinh_menh_hoi (thầy quầy) | 40–55 | đa dạng | to, rao | nhanh | lố có kiểm soát; bị vạch thì xẹp |

**Ghi chú chung:**

- Tiếng Hán / chữ Hán trong lời thoại: **không đọc**. Phụ đề hiện Hán Việt.
- Thuật ngữ đọc theo Hán Việt chuẩn. Ví dụ «Thất Sát», không «Thất Sác».

---

## 5. Quy tắc viết thoại và bark

| # | Quy tắc | Ví dụ đúng | Ví dụ sai |
|---|---|---|---|
| 1 | Một câu một ý | «Con ngồi đi. Trà còn nóng.» | «Con ngồi đi vì trà còn nóng và thầy muốn kể chuyện.» |
| 2 | Không viết chữ Hán trong câu thoại; tên gốc chỉ trong ngoặc ở phụ chú, không ở bong bóng 3D | «Thất Sát cách» | «七殺格» |
| 3 | Con số trong thoại viết bằng chữ khi ≤ mười và trong lời kể; viết số khi là dữ liệu | «ba trăm việc thiện» · «điểm 41» | «300 việc thiện» trong lời kể |
| 4 | Không dùng dấu «!» cho NPC chính đạo, trừ Phương sĩ, Lão Tùng, bark rao chợ | — | «Mệnh do ta tạo!» |
| 5 | Bark ≤ 90 ký tự, không cần ngữ cảnh mới hiểu | «Nước suối sáng nay lạnh. Tốt.» | «Như hôm qua thầy nói đấy.» |
| 6 | Không bark nào nhắc chỉ số lá số **xấu** của người chơi một cách trực tiếp | «Hạt nhỏ thì chăm nhiều.» (MC:NT) | «Điểm của con thấp quá.» |
| 7 | Mọi câu nhắc vận hạn có hành động đi kèm, hoặc có câu hỏi ngược (Khổng) | «Năm này giữ, đừng mở.» | «Năm này xui.» |
| 8 | Câu về cái chết, bệnh, tang thương: chỉ ở cảnh có nút bỏ qua, có duyệt nhạy cảm | — | — |
| 9 | Không đùa về tôn giáo; được đùa về **tính cách** nhân vật (trà dở, nồi khét) | «Lão Mao pha trà dở.» | «Phật cũng chẳng giúp được.» |
| 10 | Không câu nào hứa phần thưởng; phần thưởng hiện bằng giao diện | «Sổ ghi việc.» | «Thầy tặng con 10 công.» |
| 11 | Định Mệnh Hội: lời doạ phải **vạch được bằng một chỉ số** cụ thể | «Tuổi Dậu phạm Thái Tuế năm Ngọ.» (vạch được) | «Mệnh ngươi xấu lắm.» (không vạch được) |
| 12 | Tên riêng chỉ dùng tên có trong 06-02 … 06-12, canon, hoặc tài liệu khác đã chốt | — | tên nhiệm vụ tự đặt |

---

## 6. Checklist duyệt văn

- [ ] Xưng hô đúng bảng §1 và bảng 06-14 §3.3.
- [ ] Có ≥ 1 từ đặc trưng §2 trong mỗi 3 lượt (kịch bản dài).
- [ ] Mọi thuật ngữ có giải nghĩa ở lần đầu trong lượt (§3).
- [ ] Không chữ Hán trong bong bóng 3D.
- [ ] Bark ≤ 90 ký tự; không bark doạ, không bark chê lá số.
- [ ] Không từ cấm §2 và PERSONA-CHUNG.
- [ ] Câu nhạy cảm (chết, bệnh, tang, tự hại) đã qua người duyệt an toàn.
- [ ] Ghi chú lồng tiếng đủ cho mọi NPC có VO.
- [ ] Giọng vùng miền không nhại, đã tham vấn khi là giọng dân tộc thiểu số.
