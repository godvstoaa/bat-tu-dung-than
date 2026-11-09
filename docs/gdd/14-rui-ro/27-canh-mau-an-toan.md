# 14.27 · Cảnh mẫu an toàn — kịch bản tham chiếu cho các khoảnh khắc nhạy cảm

> Kịch bản **tham chiếu chuẩn an toàn** cho tập 03 (Cốt truyện) và tập 06 (NPC). Tập 03 cấp mã cảnh chính thức (`MQ-*`, `TL-*`); ở đây dùng mã nội bộ `RISK-SC-xx`. Khi tập 03 viết lại, giữ nguyên **các điểm bắt buộc** liệt kê dưới mỗi cảnh.
> Định dạng theo canon §1. Lá số mẫu `MAU-A` (1990-05-15 08:30 nam, điểm 41, Tứ Linh Căn, Thất Sát cách, Dụng Thủy, tuổi Ngọ gặp Thái Tuế Bính Ngọ 2026) và một lá số điểm thấp giả định (điểm 24, Phàm Căn, 败格 — tập 04 sẽ cấp `MAU-C…` thật).

---

## RISK-SC-01 · Cổng Sơn Môn — nhập ngày sinh

```
[CẢNH RISK-SC-01 · Sơn Môn · cổng chính · sáng, giờ Thìn · sương mỏng]
LÃO TÙNG: (chống gậy, chỉ tấm bảng gỗ) Khách lạ. Muốn vào quán thì để lão xem con sinh ngày nào, giờ nào.
LÃO TÙNG: Ngày giờ con ghi ở đây, lão giữ trong cái hộp này thôi — (gõ vào hộp gỗ bên hông) — không mang đi đâu cả.
> [Màn nhập: ngày · giờ · giới tính · ô «không rõ giờ»]
> Dòng nhỏ dưới form: «Ngày giờ sinh của bạn được lưu trên máy này để lập nhân vật. Chúng tôi không lưu nó trên máy chủ.»
LÃO TÙNG (nếu chọn «không rõ giờ»): Không biết giờ cũng được. Thiếu một trụ thì nhìn mờ một góc, thế thôi.
```

**Điểm bắt buộc:** vi văn bản 14.17 §6 dòng 1–2; không hỏi tên thật (tên nhân vật là tên tự đặt); nếu năm sinh cho thấy < 13 tuổi → sau cảnh lật trụ hiện thẻ «Chế độ chơi một mình» (14.24 §6).

---

## RISK-SC-02 · Lễ lật trụ và Mệnh Bàn — lá số điểm thấp

```
[CẢNH RISK-SC-02 · Sơn Môn · sân Chính Đường · lễ lật trụ]
(Bốn trụ lật lần lượt. Thanh ngũ hành dựng lên. Dụng · Hỷ · Kỵ sáng theo thứ tự.)
LÃO TÙNG: Phàm Căn. (gật đầu chậm) Căn của người bắt đầu từ đầu.
> [Thẻ Mệnh Bàn: Tiềm Lực 24 · Phàm Căn · Nghịch Thiên]
> [Dòng dưới: «Lá số là hạt giống, không phải cái cây. Hạt nhỏ thì phải chăm nhiều hơn. Thầy chưa từng thấy ai chăm mà cây không lớn.»]
> [Dòng phụ: «Hậu Thiên của bạn được nhân ×1,36 — người bắt đầu từ thấp đi nhanh hơn.»]
LÃO TÙNG: Lão gác cổng này bốn mươi năm. Người căn cao vào nhiều, người đi tới đỉnh thì không phải ai cũng căn cao.
> Lựa chọn: ① «Vậy con vào được không?» → [SC-02a] ② «Vì sao điểm con thấp?» → [mở «Vì sao?»] ③ (im lặng) → [SC-02a]
```

**Điểm bắt buộc:** chuỗi 14.20 §1 (PC-01) và câu dẫn §4.7; không hiện bách phân vị ở màn đầu; «Vì sao?» hiện `synthesis.factors` kèm hệ số; không màu đỏ.

---

## RISK-SC-03 · Khổng tiên sinh — lời phán và phản đề (web)

```
[CẢNH RISK-SC-03 · bậc Sơn Môn · trưa]
KHỔNG TIÊN SINH: (không ngẩng lên) Canh Kim sinh tháng Ngọ, lửa luyện mà kim cứng. Năm nay Bính Ngọ, tuổi ngươi gặp Thái Tuế. Việc công khó ngóc đầu tới cuối năm. Ba mươi tám tuổi đổi vận Ất Dậu, mười năm bình hòa.
KHỔNG TIÊN SINH: (ngẩng lên) Ta nói sai câu nào chưa? … Không sai. Thì ngươi định sống đúng như vậy à?
> (Không có điểm lưu. Không thoát được giữa chừng mà không qua thẻ dưới.)
> [Thẻ «Lời Vân Cốc»: «Điều đoán được chỉ là mệnh của người chưa tự làm chủ. Lên núi sau Hậu Sơn, lão kể con nghe chuyện Liễu Phàm.»]
```

**Điểm bắt buộc:** dữ kiện chỉ từ engine (`dayun`, `liunian`, Thái Tuế), **không** chủ đề sức khỏe, hôn nhân, tử vong, tai nạn, con cái (14.14 §2); tự giới thiệu «họ Khổng, người xem số trong chuyện Liễu Phàm» ở lần gặp đầu (RISK-011); bản iOS không có cảnh; nếu người chơi < 16 → Khổng tiên sinh dùng `MAU-A` thay lá số của người chơi.

---

## RISK-SC-04 · Vân Cốc — lần đầu, người chơi lá số thấp, thẻ đồng ý AI

```
[CẢNH RISK-SC-04 · Am Vân Cốc · đêm, giờ Hợi · mưa nhỏ]
VÂN CỐC: (rót trà) Con ngồi đi. Thầy Tử Bình bảo lão đón con lên đây trước — đường của con đi từ chỗ này vào.
> Lựa chọn: ① «Lá số con xấu.» ② «Con không biết vì sao.» ③ (im lặng)
VÂN CỐC (với ①): Xấu là chữ của người xem, không phải chữ của trời. Lá số con có Thất Sát không chế, Tài lại sinh Sát — như người đi giữa hai hổ. Con thấy đúng không?
VÂN CỐC: Ba trăm năm trước có người tên Liễu Phàm. Một ông thầy đoán đời ông đúng từng chữ. Ông thôi không cầu gì nữa. Rồi ông gặp lão.
VÂN CỐC: (mở Mệnh Đồ) Sáu tầng. Tầng dưới cùng ai cũng đi được, ngay hôm nay: tích âm đức.
> [Tặng Sổ Công Quá]
VÂN CỐC: Từ giờ con muốn hỏi gì lão cũng được. Nhưng lão nói trước với con một chuyện.
> [Thẻ đồng ý AI — 14.12 §2.3: nội dung gửi đi, «đủ để suy ra ngày sinh», nhà cung cấp, ba nút]
VÂN CỐC (nếu «Không, cảm ơn»): Được. Lão vẫn ở đây, con hỏi theo mấy câu lão viết sẵn cũng được.
```

**Điểm bắt buộc:** không dùng «Sơn Môn chưa nhận / chưa đủ duyên» (RISK-CANON-09); thẻ đồng ý trước câu hỏi tự do đầu tiên; nhãn «AI» trên khung chat; Vân Cốc không hứa đổi mệnh chắc chắn.

---

## RISK-SC-05 · Thái Tuế Điện — tuổi gặp Thái Tuế (web)

```
[CẢNH RISK-SC-05 · Thái Tuế Điện · chiều]
(Tượng niên chủ Bính Ngọ trên bệ cao. Hàng đèn nhỏ hai bên.)
NGƯỜI GIỮ ĐIỆN: Năm Bính Ngọ, tuổi Ngọ gặp Thái Tuế — trực, lại thêm hình. Người xưa coi năm này là năm nhiều biến động: giữ sức khỏe, cân nhắc việc lớn, giữ lời ăn tiếng nói.
NGƯỜI GIỮ ĐIỆN: Đó là lời nhắc cẩn trọng, không phải lời báo trước điều xấu.
> Lựa chọn: ① Thắp một ngọn đèn (miễn phí) ② «Thắp đèn thì có hết hạn không?» ③ Đi tiếp
NGƯỜI GIỮ ĐIỆN (với ②): Đèn là phong tục, để lòng mình nhớ mà cẩn trọng. Còn sửa vận thì phải sửa mình — con lên am Vân Cốc mà xem Mệnh Đồ.
```

**Điểm bắt buộc:** chuỗi 14.20 §3; không chữ «phạm», «hạn», «giải hạn»; không giá, không mua thêm đèn; iOS không có.

---

## RISK-SC-06 · Chẩn đoán đời thực — án «nhà có ma» (Mao Sơn)

```
[CẢNH RISK-SC-06 · Cửu Tiêu Vạn Phúc Cung · sảnh tiếp khách · tối]
BÀ HẠNH (khách NPC): Đêm nào cũng có tiếng gõ trên trần, cả nhà mất ngủ. Hàng xóm bảo nhà tôi có vong.
MAO SƠN ĐẠO NHÂN: Chị ngủ mấy tiếng một đêm? Ở nhà có ai ốm không? Mái nhà lợp gì?
> [Bước 1 · Đời sống: người chơi chọn câu hỏi; NPC trả lời: mất ngủ 3 tuần, con nhỏ sốt, mái tôn]
> [Bước 2 · Nhà: người chơi xem nhà (mini-game phong thủy `fs-cure`) → tìm mái tôn co giãn, bếp đối cửa sổ gió lùa]
MAO SƠN ĐẠO NHÂN: Tôn co lại khi đêm lạnh thì kêu lách cách. Cả nhà mất ngủ thì nghe ra đủ thứ. Chị đưa cháu đi khám sốt trước. Mái thì tôi gọi thợ chèn lại.
> [Kết án ở bước 2. Sổ Công Quá: +2 «khuyên thiện»]
> [Dòng nhỏ: «Ngoài đời, mất ngủ kéo dài, sốt ở trẻ nhỏ cần gặp bác sĩ.»]
```

**Điểm bắt buộc:** 14.08 RISK-AT-60, AT-61; không câu «có vong», «bị tà»; không có nghi lễ khi nguyên nhân đời thường đã đủ.

---

## RISK-SC-07 · Thẻ khủng hoảng giữa khung chat (minh họa luồng)

```
[CẢNH RISK-SC-07 · Am Vân Cốc · khung chat AI]
NGƯỜI CHƠI (gõ): [câu có tín hiệu mức Cao — nội dung không ghi ở đây]
> [L0 mức Cao. Câu không gửi tới mô hình.]
> [Khung chat chuyển nền trung tính. Không còn tên «Vân Cốc» ở đầu khung.]
> [Thẻ khủng hoảng 14.09 §4.2 — nguyên văn đã duyệt; nút đóng hiện sau 3 giây]
NGƯỜI CHƠI: [bấm «Quay lại»]
VÂN CỐC (câu kịch bản cố định): Lão vẫn ở đây. Con muốn ngồi uống chén trà không?
> [10 phút tiếp theo: AI chạy chế độ `elevated`]
```

**Điểm bắt buộc:** RISK-MH-10…14, MH-30…33; không nhắc lại nội dung; không thưởng, không phạt; không ghi nội dung.

---

## RISK-SC-08 · Lời mời Tà Lộ và thẻ ngoài truyện

```
[CẢNH RISK-SC-08 · Huyền Thành · ngõ sau chợ · đêm, giờ Tý · gió]
CÔNG THÂU NGHIỆT: Năm hạn của ngươi dài lắm. Ta có cái này — Âm Bài. Cầm nó, bảy ngày ngươi tu bằng người ta tu nửa tháng.
CÔNG THÂU NGHIỆT: Giá ư? (cười) Giá không phải ngươi trả.
> Lựa chọn: ① Nhận Âm Bài ② «Ai trả?» ③ Bỏ đi
CÔNG THÂU NGHIỆT (với ②): Người quanh ngươi. Một chút ốm, một chút buồn. Họ sẽ khỏi — nếu ngươi chịu quay lại tìm họ. (ngừng) Nhưng ai rồi cũng không quay lại.
> (với ①) [Thẻ ngoài truyện 14.08 §2.3 — «Bạn đang bước vào Tà Lộ… luôn có thể quay đầu… ký hiệu hư cấu»]
> (với ③) [Nhánh «tự lực qua hạn»]
```

**Điểm bắt buộc:** khóa < 16 tuổi; thẻ ngoài truyện; không cảnh người chơi chôn, đặt, làm vật yểm (AT-14); Âm Bài mô tả theo 14.08 §5.1 ví dụ 2.

---

## RISK-SC-09 · Hậu quả có báo trước và đường sửa

```
[CẢNH RISK-SC-09 · Sổ Mệnh · thẻ dùng Âm Bài]
> «Lần dùng này: Nợ Âm +5. Người có thể bị ảnh hưởng: cô Hạnh ở Trà Thất. [Dùng] [Không dùng]»
(Sáng hôm sau, Trà Thất.)
CÔ HẠNH: (gục bên bếp) Lạ thật, ba đêm nay tôi mơ thấy ai cầm thẻ gỗ đen đứng ngoài cửa… Thôi, cậu cứ ngồi.
> [Sổ Mệnh: «Cô Hạnh ốm — có thể chữa ở chỗ Vu y bà A Mậu.»]
(Người chơi mang thuốc về.)
CÔ HẠNH: Uống chén thuốc cậu mang lên, sáng nay dậy được rồi. Cảm ơn cậu. Ngồi đi, chén này tôi mời.
> [Nợ Âm −10 · Sổ Công Quá +3 «cứu người»]
```

**Điểm bắt buộc:** AT-40, AT-41 (báo trước, sửa được, không ai chết); NPC tha thứ khi người chơi quay lại (RISK-048).

---

## RISK-SC-10 · Cổng Phong Đô

```
[CẢNH RISK-SC-10 · Quỷ Môn Quan · không rõ giờ · sương lạnh]
> [Thẻ: «Vùng này có hình ảnh âm phủ theo truyền thuyết. [Đi tiếp] [Về]»]
ĐỊA TẠNG SỨ GIẢ (kịch bản): Không ai bắt con xuống. Con xuống để đọc sổ của mình, rồi đi lên. Lối lên lúc nào cũng mở.
> [Nút «Về Sơn Môn» hiện cố định ở góc màn trong suốt vùng]
```

**Điểm bắt buộc:** AT-50…55; khóa < 16 (bản rút gọn «đi cứu bạn»); Địa Tạng sứ giả không persona AI.

---

## RISK-SC-11 · Phán quan đọc sổ và Hồi Đầu

```
[CẢNH RISK-SC-11 · điện Phán quan]
PHÁN QUAN THÔI: Bổn quan không phán ai. Sổ này do chính tay ngươi viết. Ba lần Âm Bài. Ba người gặp nạn. Hai người ngươi đã quay lại giúp. Còn một — ông lão bán thuốc ở chợ.
> ① «Con đi tìm ông lão.» ② «Con chưa sẵn sàng.» (→ về Sơn Môn, sổ vẫn mở, không mất gì)
(Khi Nợ Âm về 0.)
ĐỊA TẠNG SỨ GIẢ: Đi sai, thấy, quay lại, sửa. Đường đó dài hơn đường của người chưa từng sai — nên người đi hết được nó mới đáng kính.
> [Danh hiệu «Hồi Đầu» — bạn chọn hiện hoặc ẩn]
```

**Điểm bắt buộc:** AT-43 (Nợ Âm chỉ người chơi thấy), AT-47 (danh hiệu tùy chọn), RISK-G-BD-11 (không nói người thân thật).

---

## RISK-SC-12 · Vào Miêu Cương — đính chính định kiến

```
[CẢNH RISK-SC-12 · cổng trại Miêu (古寨) · chiều muộn · khói bếp]
NGƯỜI LÁI ĐÒ (người dưới xuôi): Lên trại ấy cẩn thận, người ta bảo đàn bà trong đó nuôi…
VU Y BÀ A MẬU: (từ bến, cắt lời) Nuôi gà, nuôi lợn, nuôi con đi học. (quay sang người chơi) Cháu lên đây vì chuyện lão thợ mộc dưới xuôi phải không? Mấy tháng nay trại bà có ba đứa trẻ ốm vì hắn.
> [Codex mở: «Miêu Cương Cổ Trại — 古寨 nghĩa là trại xưa. Lời đồn "cổ độc" là định kiến người ngoài gán cho người Miêu.»]
```

**Điểm bắt buộc:** RISK-G-DT-01…04; lời định kiến của NPC ngoài trại được đính chính ngay trong cảnh; cố vấn tộc người ký.

---

## RISK-SC-13 · Tĩnh tọa — hướng dẫn thở an toàn

```
[CẢNH RISK-SC-13 · Võ Đang · Tử Tiêu cung · bồ đoàn · sáng sớm]
HUYỀN HƯ CHÂN NHÂN: Ngồi cho thẳng mà không cứng. Hít vào — bốn nhịp. Thở ra — sáu nhịp. Không cần giữ hơi.
> [Mini-game: vòng sáng nở 4 giây, thu 6 giây; 6 vòng; tạp niệm bay qua]
> [Dòng cố định: «Nếu thấy chóng mặt, khó thở, hãy thở bình thường và dừng lại.»]
HUYỀN HƯ CHÂN NHÂN: Sách cổ có nhiều phép luyện khí. Ở đây lão đạo chỉ dạy ngồi yên và thở chậm. Phép khác không ai học qua chữ được.
```

**Điểm bắt buộc:** 14.09 §6.2; RISK-G-DG-30…33; không thưởng theo độ dài nín thở.

---

## RISK-SC-14 · Phóng sinh có trách nhiệm (Bút Tháp)

Kịch bản chuẩn: 14.06 §4.5. **Điểm bắt buộc:** không mua vật sống; loài bản địa; có câu giải thích.

---

## RISK-SC-15 · Ni sư và câu hỏi về người thân đã mất

```
[CẢNH RISK-SC-15 · Bút Tháp · bờ hồ sen · đêm Vu Lan]
NGƯỜI CHƠI (chọn): «Mẹ con mất năm ngoái. Mẹ con có đang khổ không sư?»
NI SƯ DIỆU ÂM: Sư không biết người đã khuất đang ở đâu. Sư chỉ biết con thương mẹ. (đưa ngọn đèn) Con thả một ngọn đèn nhé. Đèn này của riêng con, không ai khác thấy.
> [Đèn riêng tư — không có ô nhập tên công khai]
> [Nếu người chơi nhắc liên tục tới mất mát trong chat AI và có tín hiệu C5 → thẻ nhẹ]
```

**Điểm bắt buộc:** RISK-018, RISK-G-PG-23, RISK-AT-53; không hứa tác dụng lên người đã mất.

---

## RISK-SC-16 · Định Mệnh Hội — vạch trần án «phạm Thái Tuế phải cúng»

```
[CẢNH RISK-SC-16 · chợ Huyền Thành · quầy «Đổi Mệnh»]
THẦY ĐỊNH MỆNH HỘI: Tuổi Dần nhà chị năm nay phạm Thái Tuế nặng, không cúng mười lượng vàng thì chồng chị gặp nạn.
> [Người chơi mở Thái Tuế Điện / công cụ năm → tuổi Dần năm Bính Ngọ: tam hợp, không gặp Thái Tuế theo năm quan hệ thường xét]
NGƯỜI CHƠI (chọn): «Tuổi Dần năm nay hợp năm, không phạm. Và không ai cần mười lượng vàng để tránh nạn.»
THẦY ĐỊNH MỆNH HỘI: (lúng túng) …
CHỊ BÁN RAU: (giật lại túi tiền) Thế mà tôi suýt đưa.
> [Sổ Công Quá +2 «khuyên thiện» · Codex mở: «Ba dấu hiệu lừa đảo tâm linh: dọa, đòi tiền, phán chắc chắn.»]
```

**Điểm bắt buộc:** RISK-022 (cặp thầy chân chính có thể đối chiếu trong cùng vùng); dữ kiện Thái Tuế lấy từ engine; dấu hiệu lừa đảo theo RB2, RB5.

---

## Bảng kiểm cảnh mẫu

| Cảnh | Quy tắc chính | Cố vấn | iOS | < 16 |
|---|---|---|---|---|
| SC-01 | RISK-PV-01 | — | Có (Học Quán) | Có |
| SC-02 | 14.20 §1 | SKTT | Có (không Phẩm căn) | Có |
| SC-03 | 14.14 §2 | Nho (tên) | Không | Dùng `MAU-A` |
| SC-04 | 14.12 §2.3 | Phật | Không | Không chat tự do |
| SC-05 | 14.20 §3 | Tín ngưỡng Việt | Không | Có |
| SC-06 | 14.08 §3.7 | Đạo, SKTT | Không | Có (không âm tà) |
| SC-07 | 14.09 §4 | SKTT | — | Có (thẻ trẻ em) |
| SC-08 | 14.08 §2 | Đạo, SKTT | Không | Không |
| SC-09 | 14.08 §3.5 | SKTT | Không | Không |
| SC-10 | 14.08 §3.6 | Đạo, Phật, SKTT | Không | Bản rút gọn |
| SC-11 | 14.08 §3.5 | Đạo, Phật | Không | Bản rút gọn |
| SC-12 | 14.07 §4 | Tộc người | Không | Có |
| SC-13 | 14.09 §6.2 | Đạo, y tế | Không | Có |
| SC-15 | 14.06 §2.3 | Phật, SKTT | Không | Có |
| SC-16 | RB2, RB5 | Tín ngưỡng Việt | Không | Có |
