# 14.07 · Hướng dẫn duyệt nội dung — Nho giáo, tín ngưỡng thờ Mẫu và dân gian Việt, các tộc người · Vật thiêng · Giới hạn mô tả nghi lễ · Quy trình cố vấn và ký duyệt

> Mã quy tắc: `RISK-G-NH-xx` (Nho), `RISK-G-TN-xx` (tín ngưỡng dân gian Việt), `RISK-G-MAU-xx` (thờ Mẫu), `RISK-G-DT-xx` (tộc người), `RISK-G-VT-xx` (vật thiêng, liên truyền thống), `RISK-G-NL-xx` (nghi lễ, liên truyền thống). Mức trình bày Q / T / H như tập 14.05 §0.

---

## 1. Nho giáo — vùng Văn Miếu, Sơn Môn, Huyền Thành

### 1.1 Bối cảnh

- Nguyên mẫu: **Văn Miếu – Quốc Tử Giám** (Hà Nội), đối chiếu Khổng Miếu Khúc Phụ. Văn Miếu thờ Khổng Tử, Tứ phối, Thất thập nhị hiền, Chu Văn An; Quốc Tử Giám là trường học cao nhất thời phong kiến. **82 bia Tiến sĩ** đặt trên lưng rùa đá là di sản tư liệu được UNESCO ghi danh trong Chương trình Ký ức Thế giới.
- Dữ liệu app: `schools-data › jingming` (Tịnh Minh, «trung hiếu»), `remedy › LIAOFAN`, `remedy-fate › LIAOFAN_STORY`, `TEN_THIEN`, `spiritual-fs` (nhân, nghĩa, lễ, trí, tín theo hành Dụng), `daozang` 太上感應篇, 文昌帝君陰騭文, 太微仙君功過格, `library-data`.
- NPC: `te_tuu` (Tế tửu Văn Miếu — Chu Văn Trinh, hư cấu), `khong_tiensinh` (người đoán mệnh trong *Liễu Phàm tứ huấn*, phản đề định mệnh luận).
- Hoạt động: khoa cử (hương thí → hội thí → đình thí), sổ công quá cách, đặt đạo hiệu (`naming.js › analyzeName`).

### 1.2 Được làm

| Mã | Nội dung |
|---|---|
| RISK-G-NH-01 | Khoa cử là thi **kiến thức** (cổ thư, Tứ Trụ) từ `library-data`, có trích nguồn; đỗ thì có danh hiệu học vị trong Huyền Giới. |
| RISK-G-NH-02 | Tế tửu dạy «lập mệnh, cải quá, tích thiện, khiêm đức» (bốn thiên của *Liễu Phàm tứ huấn*) — đúng trục T2. |
| RISK-G-NH-03 | Khuê Văn Các, Thiên Quang Tỉnh, nhà bia làm cảnh quan; người chơi đọc được nội dung bia **hư cấu** (văn bia trong game do TND viết, không chép văn bia thật). |
| RISK-G-NH-04 | Lễ Tết thầy / ngày giỗ Khổng Tử: khoa cử đặc biệt (§10), không bán hàng (RISK-030). |
| RISK-G-NH-05 | Đặt đạo hiệu: gợi ý chữ theo Dụng thần, người chơi tự chọn; không có cảnh báo «tên xấu sẽ gặp họa». |

### 1.3 Không được làm

| Mã | Nội dung |
|---|---|
| RISK-G-NH-10 | Không khắc tên người chơi lên bản mô phỏng bia Tiến sĩ (RISK-020). Dùng «Bảng Vàng Huyền Giới» riêng. |
| RISK-G-NH-11 | Khổng Tử, Chu Văn An không là NPC biết nói, không có persona AI; chỉ tượng, bài vị, trích dẫn có nguồn (RISK-024). |
| RISK-G-NH-12 | Khổng tiên sinh luôn được giới thiệu là **người xem số họ Khổng trong chuyện Liễu Phàm**, không phải Khổng Tử (RISK-011). |
| RISK-G-NH-13 | Không có hành vi «sờ đầu rùa cầu đỗ» (tục từng gây hư hại di tích thật và đã bị ngăn) làm cơ chế; nếu nhắc, nhắc như tục cũ đã bỏ để bảo vệ di sản. |
| RISK-G-NH-14 | «Trung» không đưa vào nội dung chính trị; «hiếu» không phán xét gia đình thật của người chơi (RISK-G-JM-10, RISK-G-JM-11). |
| RISK-G-NH-15 | Không mô tả khoa cử như hệ thống «sang – hèn» để người chơi điểm thấp bị khinh; mọi người chơi đều thi lại được không giới hạn. |
| RISK-G-NH-16 | Đặt tên: không có thông điệp «tên hiện tại của bạn xấu, phải đổi» với **tên thật** của người chơi; công cụ chỉ dùng cho **đạo hiệu trong game**. |

### 1.4 Thoại mẫu

```
[CẢNH MQ-1-?? · Văn Miếu · Đại bái đường · giờ Thìn]  (tập 03 cấp mã)
TẾ TỬU CHU VĂN TRINH: Trò gặp ông họ Khổng ở bậc Sơn Môn rồi à? Ông ấy đoán giỏi. Liễu Phàm ngày xưa cũng được ông ấy đoán trúng cả đời. Nhưng trò nhớ cho: chữ «mệnh» trong sách thánh hiền đi cùng chữ «lập». Lập mệnh là việc của người, không phải việc của sao.
> Lựa chọn: ① «Lập mệnh bắt đầu từ đâu ạ?» → [mở Sổ Công Quá]  ② «Ông Khổng nói đúng thì sao?» → [MQ-1-??b]

[KHÔNG CHẤP NHẬN — RISK-G-NH-11]
KHỔNG TỬ: (bước ra từ điện) Ta, Khổng Khâu, nói cho con biết…
```

---

## 2. Tín ngưỡng dân gian Việt

### 2.1 Phạm vi

Thờ cúng tổ tiên; Thổ Công, Táo Quân (ông Công ông Táo); Thành Hoàng làng và đình làng; Đức Ông, Đức Thánh Hiền trong chùa; Tứ bất tử (Tản Viên Sơn Thánh, Thánh Gióng, Chử Đồng Tử, Mẫu Liễu Hạnh); cúng cô hồn rằm tháng Bảy; xin xăm ở đền; vàng mã; cúng sao, dâng sao; xem ngày; tục kiêng kỵ.

Trong game hiện có: xin xăm (`xam`, web), Lư Hương (`huong`), Thái Tuế Điện (web), đèn hoa đăng (`sen`, web), Đẩu Mẫu Điện, lịch can chi.

### 2.2 Quy tắc

| Mã | Quy tắc |
|---|---|
| RISK-G-TN-01 | Thờ cúng tổ tiên là giá trị văn hóa cốt lõi: trình bày trân trọng (bàn thờ gia tiên trong nhà NPC); không chế giễu, không biến thành cơ chế «cúng nhiều được nhiều». |
| RISK-G-TN-02 | Thành Hoàng, đình làng: đình là nhà chung của làng; có thể là nơi diễn ra lễ hội trong game ở mức Q/T. Không gán thần tích bịa cho một Thành Hoàng có thật của làng có thật. |
| RISK-G-TN-03 | Táo Quân: có thể có nét hóm hỉnh dân gian (như văn hóa Tết), nhưng không xúc phạm. |
| RISK-G-TN-04 | Cúng cô hồn: chỉ mức Q (cảnh dân làng bày lễ ngoài ngõ); không có vật phẩm «vong», không có cơ chế cô hồn đi theo người chơi. |
| RISK-G-TN-05 | Vàng mã: không có cơ chế đốt vàng mã, không bán vàng mã. Codex có thể nhắc như một tục có tranh luận (môi trường, lãng phí) một cách trung tính. |
| RISK-G-TN-06 | Xin xăm (web): miễn phí, giới hạn 3 lần/ngày (`CAPS.sticksPerDay`), kết quả kèm câu «để tham khảo và chiêm nghiệm»; không mua thêm lượt (bất biến E-C4); không có thẻ xăm báo tử, báo bệnh. Thẻ «hạ hạ» viết theo hướng khuyên giữ mình, không dọa. |
| RISK-G-TN-07 | Thái Tuế, cúng sao (RISK-016): chỉ là bảng văn hóa và đèn miễn phí; không dùng chữ «giải hạn». |
| RISK-G-TN-08 | Kiêng kỵ dân gian (ngày xấu, tuổi xung) trình bày là **phong tục**, kèm cách nhìn của Vân Cốc: «biết để cẩn trọng, không để sợ». |
| RISK-G-TN-09 | Tứ bất tử, Thánh Gióng, Tản Viên: là nhân vật huyền thoại – lịch sử được thờ, chỉ xuất hiện qua đền, tượng, truyền thuyết kể; không là NPC tương tác. |
| RISK-G-TN-10 | Không lấy đền, phủ có thật (tên, vị trí) làm nơi xảy ra án lừa đảo của Định Mệnh Hội. |

---

## 3. Tín ngưỡng thờ Mẫu Tam phủ, Tứ phủ

### 3.1 Bối cảnh

- «Thực hành tín ngưỡng thờ Mẫu Tam phủ của người Việt» được UNESCO ghi danh là **di sản văn hóa phi vật thể đại diện của nhân loại** (2016).
- Hệ thống thần linh: Mẫu Thượng Thiên, Mẫu Thượng Ngàn, Mẫu Thoải (và Mẫu Địa trong Tứ phủ); Mẫu Liễu Hạnh; các hàng Quan, Chầu, Ông Hoàng, Cô, Cậu.
- **Hầu đồng (lên đồng)** là nghi lễ trung tâm, có trang phục riêng cho từng giá đồng, âm nhạc **hát văn**, lễ vật, phát lộc. Thực hành này từng bị coi là mê tín và bị hạn chế trong một thời gian dài trước khi được nhìn nhận lại như di sản.
- Trong game: bộ mô-đun «Chùa Việt» có «bàn thờ Mẫu (khu phụ)» — phản ánh đúng bố cục «tiền Phật hậu Mẫu».

### 3.2 Quy tắc

| Mã | Quy tắc |
|---|---|
| RISK-G-MAU-01 | Điện Mẫu: không gian thờ trang nghiêm, đúng thứ tự ban thờ (cố vấn xác nhận), mức Q/T (dâng hương). |
| RISK-G-MAU-02 | Hầu đồng: **chỉ mức Q**, nếu có. Người chơi không bao giờ «lên đồng». Không có kỹ năng, vật phẩm, trạng thái nào gọi là «nhập đồng», «căn đồng». |
| RISK-G-MAU-03 | Không dùng hầu đồng làm cảnh kinh dị, cảnh bị «nhập» đáng sợ, hay cảnh hài. |
| RISK-G-MAU-04 | Không bán, không cho mặc trang phục giá đồng (khăn chầu áo ngự); không có vật phẩm quạt, kiếm, khăn của từng giá. |
| RISK-G-MAU-05 | Không có cơ chế «phát lộc» thành tiền tệ, không có cơ chế «xin lộc Mẫu» ra vật phẩm ngẫu nhiên. |
| RISK-G-MAU-06 | Hát văn: chỉ dùng bản ghi có thỏa thuận với nghệ nhân, phát ở không gian điện Mẫu; không phối lại. |
| RISK-G-MAU-07 | Không nói «căn số» của người chơi (vd «bạn có căn, phải ra trình đồng») — đây là một hình thức tạo áp lực có thật ngoài đời, kéo theo chi phí lớn. Nếu NPC trong Định Mệnh Hội nói câu này, người chơi phải được dẫn tới cách nhận diện lừa đảo. |
| RISK-G-MAU-08 | Cố vấn thờ Mẫu: ưu tiên nhà nghiên cứu tín ngưỡng thờ Mẫu hoặc thủ nhang, thanh đồng có uy tín, có kinh nghiệm làm việc với truyền thông. |

### 3.3 Thoại mẫu

```
[CHẤP NHẬN · Huyền Thành · điện Mẫu sau chùa · rằm tháng Ba]
BÀ THỦ NHANG: Cháu đứng đây xem thôi, đừng chen. Giá hầu này là của người ta tu cả đời. Xem xong, ra kia bà kể cho nghe tích Mẫu Liễu.

[KHÔNG CHẤP NHẬN — RISK-G-MAU-07]
BÀ THỦ NHANG: Cháu có căn đấy. Không ra trình đồng thì Mẫu hành, ốm đau liên miên.
```

---

## 4. Người Miêu, người H'Mông và các tộc người khác

### 4.1 Bối cảnh và mức rủi ro

- Vùng `mieucuong` (Miêu Cương Cổ Trại) lấy cảm hứng từ Tương Tây (Phượng Hoàng cổ thành, trại Miêu Tây Giang), có cầu phong vũ, trống lâu của **người Đồng** (RISK-013).
- Định kiến lâu đời trong văn hóa đại chúng Trung Hoa: người Miêu nuôi «cổ» (蠱) hại người, phụ nữ Miêu bỏ bùa. Ở Việt Nam, cáo buộc «ma gà», «thuốc thư», «ma lai» từng dẫn tới xua đuổi, bạo lực với người bị nghi ở một số cộng đồng miền núi. Người Miêu (Trung Quốc) và người H'Mông (Việt Nam) có quan hệ tộc người gần; người chơi Việt sẽ liên hệ trực tiếp với **đồng bào H'Mông** — một trong 54 dân tộc Việt Nam.
- Ngoài ra, cộng đồng H'Mông ở Việt Nam có những vấn đề tôn giáo – xã hội nhạy cảm; game **không** chạm vào.
- Mức rủi ro: **Đỏ** (RISK-012).

### 4.2 Quy tắc

| Mã | Quy tắc |
|---|---|
| RISK-G-DT-01 | Tên vùng hiển thị luôn kèm Hán tự **古寨** (cổ trại = trại xưa). Không bao giờ dùng chữ 蠱 trong bất kỳ tên vùng, NPC, vật phẩm nào. Codex giải thích nghĩa tên. |
| RISK-G-DT-02 | Người Miêu trong game là **cộng đồng bình thường**: nông dân, thợ bạc, thợ dệt, thầy thuốc, trẻ em đi học. Vai trong truyện: **nạn nhân của yểm sư ngoài trại** và **người chữa** (canon §5.5). |
| RISK-G-DT-03 | Không có NPC Miêu nào làm phép hại người, nuôi cổ, bỏ bùa — kể cả nhân vật phụ, kể cả trong lời đồn mà game không đính chính. Nếu NPC ngoài trại nói lời định kiến, phải có cảnh đính chính trong cùng chuỗi. |
| RISK-G-DT-04 | Vu y bà A Mậu: thầy thuốc dân gian theo ngũ hành (`tcm`), người giữ chuyện xưa. Chuyện cổ thuật bà kể là **truyền thuyết người ngoài gán cho trại**, kèm lời bà: «người ta đồn thế để sợ chúng tôi». |
| RISK-G-DT-05 | Không có vật phẩm «cổ trùng», «ngải», «bùa Miêu». |
| RISK-G-DT-06 | Trang phục, đồ bạc, vải sáp ong (batik), khèn là di sản văn hóa của tộc người: không bán làm đồ thời trang (E-C10). Người chơi có thể nhận **một** món quà tặng (vd vòng bạc) sau chuỗi giúp trại, có codex ghi nguồn gốc và người làm. |
| RISK-G-DT-07 | Kiến trúc tách hai cụm: trại Miêu (nhà sàn treo ven sông) và xóm Đồng (cầu phong vũ, trống lâu) với tên, bảng màu, codex riêng (RISK-013). |
| RISK-G-DT-08 | Cản thi (dẫn xác về quê, Tương Tây) chỉ là **truyền thuyết** được kể, không có cảnh xác đi, không có NPC cản thi sư hoạt động. |
| RISK-G-DT-09 | Ngôn ngữ: NPC Miêu nói tiếng Việt chuẩn trong game (thổ âm nhẹ được phép nếu cố vấn đồng ý), **không** nhại giọng để gây cười. |
| RISK-G-DT-10 | Không có cốt truyện, NPC, biểu tượng liên quan tôn giáo, chính trị đương đại của bất kỳ tộc người nào ở Việt Nam. |
| RISK-G-DT-11 | Không thêm nghi lễ của tộc người khác (Then của người Tày – Nùng, Mo Mường, lễ của người Chăm…) vào game nếu chưa qua quy trình cố vấn đầy đủ (§7) với người của chính tộc người đó. |
| RISK-G-DT-12 | Người Tạng: theo tập 14.06 §6. |

### 4.3 Thoại mẫu

```
[CẢNH SQ-mieucuong-02 · bên hỏa đường nhà A Mậu · đêm mưa]
VU Y BÀ A MẬU: Người dưới xuôi lên đây hay hỏi bà có nuôi cổ không. (cười) Bà nuôi gà. Cổ là chuyện người ngoài bịa ra để sợ người Miêu, để khỏi lên đây buôn bán công bằng. Kẻ làm bùa hại người mấy tháng nay là một lão thợ mộc từ dưới xuôi lên — hắn tự xưng truyền nhân Lỗ Ban kinh. Cháu giúp bà tìm hắn, được không?

[KHÔNG CHẤP NHẬN — RISK-G-DT-03]
VU Y BÀ A MẬU: Muốn mạnh nhanh thì bà cho cháu một con cổ. Nuôi bằng máu ba đêm.
```

### 4.4 Checklist art và nội dung tộc người

- [ ] Tên vùng có Hán tự 古, không có 蠱 ở bất kỳ đâu (DT-01).
- [ ] Mọi NPC tộc người có nghề nghiệp, gia đình, tính cách riêng; không ai là «phù thủy» (DT-02, DT-03).
- [ ] Mọi lời định kiến của NPC ngoài trại đều có cảnh đính chính (DT-03).
- [ ] Không vật phẩm cổ, ngải, bùa (DT-05).
- [ ] Trang phục, đồ bạc, vải không có giá bán (DT-06).
- [ ] Kiến trúc Miêu và Đồng tách riêng, có codex nguồn gốc (DT-07).
- [ ] Không có cảnh xác đi (DT-08).
- [ ] Không nhại giọng (DT-09).
- [ ] Cố vấn là người H'Mông / Miêu hoặc nhà dân tộc học chuyên ngành đã ký.

---

## 5. Vật thiêng không bao giờ là đồ thời trang (liên truyền thống)

### 5.1 Định nghĩa

**Vật thiêng** là vật mà người trong truyền thống coi là:
- hình tượng của đối tượng thờ (tượng, tranh, bài vị);
- pháp khí dùng trong nghi lễ do người thụ chức sử dụng;
- pháp phục gắn với giới, chức;
- biểu tượng chứng đắc, quả vị;
- vật chứa kinh, chú, chữ thiêng;
- di vật, xá lợi, vật từ tang lễ;
- trang phục, đồ trang sức gắn với nghi lễ của một tộc người.

### 5.2 Quy tắc

| Mã | Quy tắc |
|---|---|
| RISK-G-VT-01 | Vật thiêng **không bao giờ** có giá (Phúc Khí, Ngọc, tiền thật), không bao giờ khóa sau VIP, không có trong Đạo Lộ mùa. |
| RISK-G-VT-02 | Vật thiêng không làm ngự vật, hào quang, vệt bước, khung tên, emote. |
| RISK-G-VT-03 | Pháp khí, pháp phục chỉ dùng được **trong chuỗi** của đạo thống đó và **trong vùng** của đạo thống đó; ra khỏi vùng tự cất. |
| RISK-G-VT-04 | Mỗi món trong danh mục có trường `tags` (`sacred`, `ritual`, `ethnic`, `lay`) và `garment` (`lay` / `ritual`); CI chặn vi phạm (bất biến E1, tập 14.03 §4.3). |
| RISK-G-VT-05 | Tên, mô tả không dùng từ chứng đắc, quả vị, tác dụng tâm linh (`BANNED_ITEM_WORDS`). |
| RISK-G-VT-06 | Biểu tượng chung, phổ thông, không gắn một vị thần cụ thể (hoa sen thường, mây lành, hạc, bát quái hoa văn, kiếm gỗ đào dân dụng) được bán nếu mô tả trung tính. |

### 5.3 Rà soát danh mục hiện tại (`src/game/cosmetics.js`, 51 món)

| id | Tên | Đánh giá | Việc làm |
|---|---|---|---|
| `y_menh` | Bản Mệnh Y | Được | Thêm dòng mô tả về việc người khác thấy màu (RISK-107) |
| `y_bach` | Bạch Y Thư Sinh | Được | — |
| `y_tu` | Tử Y Chân Nhân | Cân nhắc | Bỏ chữ «Chân Nhân» (danh xưng đạo sĩ đắc đạo) khỏi tên VIP; gợi ý «Tử Y Ẩn Sĩ» |
| `y_moc`…`y_thuy` | 5 áo ngũ hành | Được | `y_tho` «Hậu Thổ Đạo Bào… hoàng bào đạo sĩ» → đổi tên «Hậu Thổ Trường Bào», mô tả bỏ «đạo sĩ» |
| `tram_go` | Trâm Gỗ Đào | Sửa | Bỏ «trừ tà» khỏi mô tả (RISK-081) |
| `dao_quan` | Ngân Đạo Quan | Sửa | Đạo quan là mũ của đạo sĩ: chuyển sang nhận qua chuỗi Toàn Chân/Chính Nhất, không bán; mô tả bỏ «chính tông» |
| `quan_la`, `kim_quan`, `dau_lap`, `tram_ngoc` | Mũ, trâm | Được | — |
| `quan_sen` | Liên Hoa Quan | **Gỡ / đổi** | «Mũ hoa sen vàng của bậc đắc đạo — VIP · cấp 10»: biểu tượng chứng đắc khóa VIP. Đổi thành «Hà Hoa Trâm», bỏ VIP, bỏ «đắc đạo» |
| `kiem_go` | Kiếm Gỗ Đào | Được | Mô tả trung tính |
| `kiem_moc`, `ho_lo`, `kiem_bao`, `o_giay`, `canh_phuong`, `canh_hac` | Sau lưng | Được | — |
| `phap_luan` | Bát Quái Pháp Luân | **Gỡ / đổi** | RISK-002: đổi «Bát Quái Kính Hoàn», hình tĩnh, bỏ VIP độc quyền |
| `quat_giay` | Quạt Giấy Thư Pháp | Được | Chữ «道» trên quạt là chữ trang trí trung tính |
| `phat_tran` | Phất Trần Bạch Vĩ | Sửa | Pháp khí đạo sĩ: nhận qua chuỗi, không bán |
| `den_long_tay`, `la_ban_tay`, `quat_long` | Cầm tay | Được | — |
| `aura_menh`, `aura_dao`, `aura_lua`, `aura_batquai`, `aura_tuyet` | Hào quang | Được | `aura_lua` «Tam Muội Chân Hỏa» là thuật ngữ truyện thần ma, chấp nhận |
| `aura_set` | Cửu Thiên Lôi Quang | Sửa tên | RISK-G-SX-11: «Tử Điện Quang» |
| `aura_sen` | Bộ Bộ Sinh Liên | **Gỡ** | Tích Đức Phật đản sinh (RISK-001) |
| `trail_*` (6 món) | Vệt bước | Được | `trail_sen` «Liên Hoa Bộ» (cánh sen rơi) chấp nhận nếu hình là cánh hoa rơi, không phải sen nở dưới chân |
| `kiem`, `may`, `ho_lo_bay`, `hac` | Ngự vật | Được | Tắt trong vùng thiêng |
| `dai_sen` | Liên Hoa Đài | **Gỡ** | Đứng trên tòa sen của Phật, Bồ Tát (RISK-001) |
| `khung_*` (5 món) | Khung tên | Được | `khung_sen` «Liên Đài» — đổi tên «Hà Hoa» cho khỏi gợi tòa sen |

### 5.4 Danh sách «không sinh bằng AI» (Meshy, mô hình ảnh)

Các hạng mục sau làm thủ công theo tham chiếu đã duyệt; không dùng mô hình sinh vì dễ sai hình tượng (RISK-155):

1. Tượng thờ chính trong điện hạng A (Tam Thanh, Phật, Bồ Tát, Khổng Tử, Mẫu).
2. Bài vị, hoành phi, câu đối có chữ.
3. Phù (bộ ký tự hư cấu do AD thiết kế).
4. Tranh thờ (kể cả tranh Thập điện).
5. Pháp khí có hình dáng quy chuẩn (ấn, lệnh bài, chuông, mõ).
6. Mọi tài sản thuộc `tangdia` (tập 14.06 §6.3).
7. Trang phục, đồ bạc của tộc người.
8. Bia đá có văn bia.

Meshy được dùng cho: ngoại thất công trình (theo §8.2), đá, cây, đồ gia dụng, kiến trúc phụ không thờ.

---

## 6. Giới hạn mô tả thần linh, tượng và nghi lễ (liên truyền thống)

### 6.1 Thần linh và tượng

| Mã | Quy tắc |
|---|---|
| RISK-G-NL-01 | Đối tượng thờ cấp cao của mọi truyền thống (Phật, Bồ Tát, Tam Thanh, Ngọc Hoàng, Khổng Tử, Mẫu) không là NPC biết nói, không có persona AI, không hiện thân. |
| RISK-G-NL-02 | Thần cấp thấp dân gian, nhân vật truyền thuyết (Thổ Địa, Táo Quân, Hắc Bạch Vô Thường) có thể có lời thoại **kịch bản** (không AI), giữ tôn trọng. |
| RISK-G-NL-03 | Không có cảnh xúc phạm, đập phá, đốt, xâm hại không gian thờ — kể cả khi phản diện làm. Nếu cốt truyện cần (Định Mệnh Hội phá miếu), chỉ thể hiện **hậu quả** (miếu đổ nát, người làng buồn), không thể hiện hành động phá. |
| RISK-G-NL-04 | Không có lựa chọn nào cho phép người chơi phá hoại, trộm đồ cúng, bất kính nơi thờ (§14 «không cho người chơi phá hoại nơi thờ»). Lựa chọn «việc ác» của Sổ Công Quá không bao gồm xâm phạm nơi thờ. |
| RISK-G-NL-05 | Ánh sáng, âm thanh trong điện thờ trang nghiêm; không nhạc nền điện tử, không hiệu ứng nổ khi nhận thưởng trong điện. |

### 6.2 Nghi lễ — ba mức

| Mức | Cho phép với | Không bao giờ dùng cho |
|---|---|---|
| **Q** (quan sát) | Mọi nghi lễ trong game, nếu đã duyệt cách thể hiện | Thiên táng, hầu đồng chi tiết, nghi lễ trao truyền mật |
| **T** (tham dự) | Dâng hương, lạy, chắp tay, thắp đèn, đánh chuông giờ, đi kinh hành | Nghi lễ trao truyền (quy y, thụ lục, quán đảnh), nghi lễ của tộc người chưa duyệt |
| **H** (hành trì) | Thực hành đã chuyển thành ký hiệu hư cấu (kết phù hư cấu) hoặc thực hành an toàn phổ thông (thở chậm, đọc, quét lá, chăm vườn) | Chú thật, ấn thật, trừ tà thật, quán tưởng mật, nhịn ăn, công pháp dẫn khí |

### 6.3 Mini-game nghi lễ

| Mã | Quy tắc |
|---|---|
| RISK-G-NL-10 | Không có trạng thái «thất bại» hiển thị (chữ đỏ, âm thanh lỗi, rung). Làm nhanh quá thì nhân vật **dừng lại chờ**; làm sai thì nhân vật **làm lại nhẹ nhàng**. |
| RISK-G-NL-11 | Không có combo, điểm số, xếp hạng, đồng hồ đếm ngược. |
| RISK-G-NL-12 | Không có nút «bỏ qua để nhận thưởng ngay» bán bằng tiền (E-C7). |
| RISK-G-NL-13 | Thưởng của nghi lễ là **hoàn thành chuỗi**, không theo độ chính xác. |
| RISK-G-NL-14 | Mỗi mini-game nghi lễ có bản prototype được cố vấn truyền thống đó chơi thử trước khi làm art (RISK-006). |
| RISK-G-NL-15 | Có tùy chọn trợ năng: tự động hóa thao tác (cho người khó vận động) mà không mất thưởng. |

---

## 7. Quy trình cố vấn tín ngưỡng

### 7.1 Cấu trúc Hội đồng cố vấn (HĐCV)

| Ban | Phụ trách vùng / nội dung | Số người tối thiểu | Hồ sơ phù hợp |
|---|---|---|---|
| Đạo giáo | `longho`, `vodang`, `chungnam`, `maoshan`, `phongdo` (Bắc Đế, Động Uyên), Sơn Môn (Tam Thanh, Đẩu Mẫu) | 2 (1 người thực hành hoặc từng tu tại đạo quán; 1 học giả Đạo giáo học) | Viện Nghiên cứu Tôn giáo, khoa Tôn giáo học, Viện Nghiên cứu Hán Nôm; người Việt gốc Hoa sinh hoạt tại miếu, hội quán |
| Phật giáo Bắc tông (Thiền, Tịnh Độ, Chuẩn Đề) | `yentu`, `buttap`, `vancoc`, Địa Tạng ở `phongdo` | 2 (1 tăng hoặc ni; 1 cư sĩ học giả) | Tăng ni có kinh nghiệm hoằng pháp; giảng viên Học viện Phật giáo |
| Tạng truyền | `tangdia` | xem tập 14.06 §6.4 | — |
| Nho học | `vanmieu`, Khổng tiên sinh, khoa cử | 1 | Học giả Hán Nôm, Nho học |
| Tín ngưỡng Việt và thờ Mẫu | điện Mẫu, đình, tục dân gian, Thái Tuế, xin xăm | 1–2 | Nhà nghiên cứu văn hóa dân gian; thủ nhang, thanh đồng có uy tín |
| Tộc người | `mieucuong`, mọi NPC tộc người | 1–2 | Người H'Mông / Miêu; nhà dân tộc học |
| Sức khỏe tâm thần | tập 14.09, Tà Lộ, âm tà | 1 | Bác sĩ tâm thần hoặc nhà tâm lý lâm sàng |

Một người không ngồi quá hai ban. Thành viên HĐCV không phải nhân viên của dự án.

### 7.2 Lộ trình tuyển cố vấn

| Tuần (tính từ đầu M0) | Việc |
|---|---|
| 1 | GĐSX, TND lập danh sách 3 ứng viên mỗi ban (tối thiểu 21 tên); soạn **gói giới thiệu** 4 trang: trụ cột T1–T6, khung «văn tu», không bán cải mệnh, danh sách rủi ro chính của ban |
| 2–3 | Gửi thư mời; hẹn gặp ngắn 30 phút |
| 3–5 | Gặp; trình bày; hỏi ý; gửi dự thảo thỏa thuận |
| 5–6 | Ký thỏa thuận với ban cần cho M2 (Đạo giáo, Phật giáo Bắc tông, Tín ngưỡng Việt, Sức khỏe tâm thần) |
| M2–M3 | Ký với ban Nho học, Tộc người |
| M0–M3 | Tạng truyền theo tập 14.06 §6.5 |

Nếu một ban chưa có người trước khi bắt đầu art của vùng tương ứng: vùng đó **lùi**, không «làm trước duyệt sau» (RISK-153, RISK-156).

### 7.3 Thỏa thuận cố vấn — điều khoản tối thiểu

1. **Phạm vi:** ban, vùng, loại nội dung duyệt; số giờ dự kiến mỗi mốc.
2. **Quyền phủ quyết:** cố vấn có quyền phủ quyết nội dung thuộc truyền thống của mình. Dự án có thể chọn **bỏ** nội dung bị phủ quyết; không được phát hành bản đã bị phủ quyết.
3. **Bảo mật:** cố vấn giữ bí mật tài liệu chưa công bố; dự án không công bố ý kiến riêng của cố vấn khi chưa được đồng ý.
4. **Ghi công:** cố vấn chọn: ghi tên + chức danh / ghi tên / không ghi. Có thể đổi lựa chọn bất cứ lúc nào; dự án cập nhật credits ở bản kế tiếp.
5. **Không đại diện:** thỏa thuận ghi rõ cố vấn tham gia với tư cách cá nhân, không đại diện tổ chức tôn giáo, trừ khi có văn bản của tổ chức.
6. **Thù lao:** theo giờ hoặc theo mốc; cố vấn có thể từ chối thù lao hoặc yêu cầu chuyển cho nơi khác (dự án không gắn điều này với nội dung game).
7. **Rút lui:** cố vấn có thể rút lui; nội dung đã duyệt giữ nguyên hiệu lực duyệt cho tới khi có cố vấn thay rà lại (RISK-154).
8. **Xung đột lợi ích:** cố vấn khai báo quan hệ thương mại với dự án, với dịch vụ tâm linh.
9. **Sau phát hành:** cố vấn được mời rà phản hồi cộng đồng 90 ngày đầu.

### 7.4 Quy trình duyệt theo giai đoạn sản xuất

| Giai đoạn | Tài liệu gửi cố vấn | Câu hỏi cố vấn trả lời | Thời hạn phản hồi |
|---|---|---|---|
| D1 · Ý tưởng | Đoạn mô tả vùng / chuỗi 1–2 trang | Có nên làm? Tránh gì? | 10 ngày |
| D2 · Kịch bản | Kịch bản chuỗi nhiệm vụ, thoại, codex | Đúng giáo lý? Lời có xúc phạm? | 10 ngày |
| D3 · Concept art | Bảng concept, bảng vật phẩm | Đúng hình tượng? Đúng vị trí? | 7 ngày |
| D4 · Âm thanh | Danh mục âm thanh, bản nghe thử | Phù hợp không gian? | 7 ngày |
| D5 · Persona AI (nếu có) | Thẻ persona, 40 câu hỏi kiểm thử và câu trả lời mẫu | Có lời nào không chấp nhận? | 10 ngày |
| D6 · Bản build | Bản chơi thử kín + hướng dẫn | Cảm nhận tổng thể; điều phải sửa | 14 ngày |
| D7 · Sau phát hành | Tổng hợp phản hồi cộng đồng | Có gì cần sửa? | 90 ngày sau phát hành |

### 7.5 Giải quyết bất đồng

1. Hai cố vấn cùng ban bất đồng → chọn **phương án tối giản** (làm ít hơn, trình bày ít chi tiết hơn) mà cả hai chấp nhận.
2. Cố vấn bất đồng với thiết kế canon → TND trình GĐSX; nếu nội dung thuộc truyền thống của cố vấn, **ý cố vấn thắng** (đổi canon qua quy trình của `00-KINH-DIEN-CHUNG.md`).
3. Cố vấn hai ban khác nhau bất đồng về một nội dung liên tôn (vd Côn Lôn «quy nhất») → mỗi bên duyệt phần thuộc truyền thống mình; phần chung viết theo hướng «quan điểm của nhân vật», không phải tuyên bố của game.
4. Bất đồng không giải quyết trong 30 ngày → nội dung bị **bỏ khỏi mốc**, không chờ.

### 7.6 Hồ sơ lưu trữ

- Thư mục `docs/review/<ban>/<mã nội dung>/` (tài liệu 13 cấp vị trí chính thức): bản gửi, phiếu duyệt có chữ ký (ảnh chụp hoặc chữ ký số), thư trao đổi.
- Mỗi tài sản, tệp thoại trong kho có trường `review: <mã phiếu>`; CI cảnh báo tài sản thuộc vùng thiêng không có mã phiếu.
- Lưu tối thiểu 5 năm sau khi game ngừng vận hành.

---

## 8. Phiếu duyệt và checklist ký

### 8.1 Mẫu phiếu duyệt

```
PHIẾU DUYỆT NỘI DUNG TÍN NGƯỠNG · Số: RV-<ban>-<năm>-<số thứ tự>
Nội dung: <mã nhiệm vụ / mã công trình / id vật phẩm / persona>
Vùng: <region id>          Giai đoạn: D1 / D2 / D3 / D4 / D5 / D6
Người viết: ………………      Người duyệt nội bộ: ………………
Quy tắc đã tự kiểm (ghi mã): RISK-G-…, RISK-AT-…, RISK-MH-…

Ý kiến cố vấn:
  [ ] Chấp nhận nguyên trạng
  [ ] Chấp nhận với sửa đổi (liệt kê dưới)
  [ ] Không chấp nhận (lý do dưới)
  [ ] Ngoài chuyên môn của tôi — đề nghị chuyển ban: ………

Sửa đổi / lý do:
  1. …
  2. …

Cố vấn (ký, ghi rõ ban): ………………      Ngày: ………
Xác nhận đã sửa (người viết): ………       Ngày: ………
Xác nhận lần cuối (cố vấn, nếu có sửa): ……… Ngày: ………
```

### 8.2 Checklist ký trước khi một vùng thiêng vào bản phát hành

- [ ] Có phiếu D1–D6 cho mọi nhiệm vụ, công trình hạng A–B, persona trong vùng.
- [ ] Mọi phiếu ở trạng thái «Chấp nhận» hoặc «Chấp nhận với sửa đổi — đã xác nhận sửa».
- [ ] Không có tài sản thuộc danh sách §5.4 được sinh bằng AI.
- [ ] Bảng vật thiêng của truyền thống (tập 14.05 §14, tập 14.06 §7) đã đối chiếu.
- [ ] Mọi mini-game nghi lễ qua §6.3.
- [ ] Ban Sức khỏe tâm thần đã ký nếu vùng có nội dung âm tà, địa ngục, tang thương.
- [ ] PC đã xem phần pháp lý (di sản, tôn giáo) của vùng.
- [ ] Credits cố vấn đúng lựa chọn của từng người.
- [ ] GĐSX ký cuối.
