# 05-07 · Chính Nhất (Long Hổ Sơn) · Thanh Vi / Đan Đỉnh (Võ Đang)

> Theo luật chung 05-06. Mã nhiệm vụ: `CQ-CN-xx`, `CQ-TV-xx`.
> Nội dung phù lục, chú, nghi thức chỉ ở mức **cấu trúc và ý nghĩa** (`talisman-data` ETHICS: «符 MÔ TẢ cấu trúc + thị giác (KHÔNG hướng dẫn in/vẽ operative); nghi lễ / 書符 / 科儀 phải do đạo sĩ / pháp sư 受箓 chủ trì»). Phù trong game là **ký tự hư cấu** (canon T6).
> Công pháp tu luyện chỉ ở mức **tri thức** (`cultivation-data` ETHICS: «app chỉ giới thiệu tri thức, KHÔNG hướng dẫn tự luyện (nguy hiểm nếu sai)»). Mini-game hơi thở là nhịp trò chơi, không phải bài tập thở.

---

# PHẦN A — CHÍNH NHẤT 正一 (+ Thần Tiêu 神霄)

## A.1 Tổng quan

| Hạng mục | Nội dung |
|---|---|
| Phái (app) | `zhengyi` — «Chính Nhất (Thiên Sư Đạo)», tổ 张道陵, Đông Hán; `shenxiao` — Thần Tiêu, tổ 王文卿, Bắc Tống |
| Đặc trưng (app `distinctive`) | «Phù lục phái tiêu biểu — 符籙 + 受箓 = cốt lõi; không buộc xuất gia» · Thần Tiêu: «五雷 chính pháp đỉnh» |
| Thánh địa | `longho` — Long Hổ Sơn · Tự Hán Thiên Sư Phủ (1500, −200) |
| NPC dẫn | Trương Thiên Sư (`truong_thiensu`) — «bần đạo – thí chủ», nghi lễ, uy |
| Hành của đạo | chính **Hỏa**, phụ **Kim** (05-06 §4.2) |
| Tu Bổ | Định Lực · Nghệ đạo (+3 / hạng) |
| Xuất gia / cư sĩ | «cư sĩ / hỏa cư đạo sĩ (có gia đình)» — trong game: không giới xuất gia, giới chay chỉ ngày trai |
| Câu cấm của NPC | dạy vẽ phù thật; hứa phù trị bệnh |

## A.2 Thang hạng — năm bậc lục

App ghi hệ thụ lục Chính Nhất là «đô công / minh uy / tam động / ngũ nhạc» (`SCHOOLS.zhengyi.ordination`), và nói «cấp bậc quyết định 符 được phép書». Game dựng thang theo đúng ý đó: **mỗi bậc lục mở thêm loại phù người chơi được kết trong mini-game** — không phải năng lực phép.

| Hạng | Tên hạng | Xưng hô NPC gọi người chơi | Phù được kết (mini-game) | Điều kiện riêng (ngoài thang chung 05-06 §3.1) |
|---|---|---|---|---|
| I | **Đạo Đồng** (chưa thụ lục) | «tiểu đạo đồng» | chỉ xem, ghép phù mẫu | `CQ-CN-01` |
| II | **Thụ Đô Công Lục** 都功籙 | «đạo trưởng» | phù **bình an** (một việc, một hành) | kiểm tri phù lục 10 câu |
| III | **Thụ Minh Uy Lục** 盟威籙 | «pháp sư» | phù **trấn trạch** (hóa sát nhà, theo hành Dụng của chủ nhà) | 20 lần kết phù đạt «viên»; 1 trai tiếu nhỏ |
| IV | **Thụ Tam Động (Ngũ Lôi) Lục** 三洞五雷籙 | «cao công» | phù **giải ách** cho người khác (theo `zhengyi-jiee`); mở **Thần Tiêu lôi pháp** (nghi lễ an dân trong giông) | bái Đẩu trọn 7 sao 7 lần; dạy 1 đạo đồng |
| V | **Thụ Thượng Thanh Đại Động / Ngũ Nhạc Lục** | «đại pháp sư» | — (không thêm phù; viên mãn là việc truyền lại) | chủ đàn Thượng Nguyên |

**Ghi chú tên bậc:** hệ lục thật có nhiều biến thể theo thời đại và vùng; app chỉ liệt bốn tên. Bậc V dùng tên «Đại Động» (thượng thanh) và ghi chú «ngũ nhạc» theo app. Cố vấn Chính Nhất chốt tên trước M2.

**Tờ lục trong game:** là một cuộn **ký tự hư cấu** có ấn son (ấn hình học, không chép ấn thật), ghi đạo hiệu người chơi (`CQ-MD-22`). Treo được trong nhà riêng. Mô tả trong game: «Lục này chỉ có giá trị ở Huyền Giới. Lục thật do Thiên Sư Phủ cấp cho đạo sĩ đã tu học.»

## A.3 Giới

| Loại | Giới | Mở ở hạng | Thẻ giới hiện khi | Phạm khi |
|---|---|---|---|---|
| Thường trực 1 | **Không kết phù cho việc hại người** | I | NPC nhờ «một lá bùa cho đối thủ thua», «bùa cho chồng bỏ vợ bé»… | nhận lời |
| Thường trực 2 | **Không phô phép** — không dùng lục / pháp ấn để dọa hay khoe | III | phương án hội thoại có thẻ `khoe_phap` («Ta là pháp sư Minh Uy, ngươi biết điều đi») | chọn phương án đó |
| Thường trực 3 | **Giữ trai ngày trai tiếu và mùng 1 / Rằm** | IV | gọi món mặn vào những ngày đó | gọi |
| Đạo tràng | không nói tục trong Thiên Sư Phủ; không chạm pháp khí trên đàn khi chưa đủ hạng (va chạm chặn, chỉ có thẻ giới khi cố tương tác) | I | | |
| Đạo tràng | ăn chay trong ba ngày đại lễ (Thượng Nguyên, Trùng Cửu, Hạ Nguyên) | I | | |

**Sám riêng:** Lễ Sám Tinh Thần (05-05 §4.6) do Trương Thiên Sư chủ trì — hoàn Đạo Hạnh của án giới Chính Nhất.

## A.4 Hoạt động lõi

### A.4.1 Kết phù (`B = 10` / phiên)

- **Nguồn cấu trúc:** phù năm đoạn của app: 符頭 (đầu — tam thanh / sắc lệnh, nguồn thần chỉ) · 符身 (thân — chủ thần + chữ công năng 鎮 / 收 / 殺) · 符腹 (bụng — bát quái, tinh tượng, bộ cương) · 符膽 (đảm — tam tài, ngũ hành, «trung khu sức mạnh») · 符腳 (chân — phong lệnh). (`FU_MAOSHAN_XIE.structure`; Chính Nhất dùng cùng khung năm đoạn theo `FU_ZHENGYI_BEIDOU`.)
- **Mini-game (yêu cầu cho 09):** một «đơn nhờ» của NPC (vd «nhà tôi cửa nhìn thẳng ra đường» → sát `luchong`, `fs-cure`). Người chơi:
  1. chọn **đầu** đúng loại việc (bình an / trấn / giải);
  2. chọn **thân** có chữ công năng đúng (trấn cho sát nhà, bình an cho người, giải cho ách);
  3. chọn **bụng** có quẻ ứng phương bị sát (vd sát ở Nam → quẻ Ly);
  4. chọn **đảm** theo **hành Dụng của chủ nhà** (NPC có lá số thật — dùng `analyze` như `halls.js`);
  5. đóng **chân** (luôn một lựa chọn: phong lệnh).
- Mọi mảnh là **ký tự hư cấu** + nhãn tiếng Việt chú nghĩa. Kết đúng 5 / 5 → «viên»; 3–4 → «thành»; < 3 → làm lại không mất gì.
- **Không** có hiệu ứng phép. NPC nhận phù, treo lên, và nói một câu về việc **thật** cần làm (Trương Thiên Sư dặn người chơi nhắc: «phù để người an lòng; cửa nhìn thẳng ra đường thì đặt bình phong» — đúng `fs-cure.cures`).
- Hồi chiêu: 3 đơn / ngày.

### A.4.2 Bái Đẩu (`B = 12` / lễ)

- **Nguồn:** `amta-data › ritualsZhengYi › zhengyi-baidou` («拜斗 = lễ thờ 北斗 / 南斗»), `remedy-songjing` (Bắc Đẩu Bản Mệnh Diên Sinh Chân Kinh), `talisman-data › FA_BAIDOU`.
- **Lễ:** thắp 7 đèn Bắc Đẩu theo thứ tự sao (chạm theo chòm), 3 nhịp lạy, tụng đoạn kinh bằng âm tiết hư cấu. Đèn thứ «bản mệnh» sáng hơn.
- **Bản mệnh tinh quân** theo chi năm sinh (truyền thống Bắc Đẩu bản mệnh — dạy trong `CQ-CN-06`):

| Chi năm sinh | Bản mệnh tinh quân |
|---|---|
| Tý | Tham Lang 貪狼 |
| Sửu, Hợi | Cự Môn 巨門 |
| Dần, Tuất | Lộc Tồn 祿存 |
| Mão, Dậu | Văn Khúc 文曲 |
| Thìn, Thân | Liêm Trinh 廉貞 |
| Tỵ, Mùi | Vũ Khúc 武曲 |
| Ngọ | Phá Quân 破軍 |

  MAU-A (năm Canh Ngọ) → Phá Quân.
- **Không** có hiệu ứng «tăng thọ / giải hạn». Lễ cho ĐH (tu tâm) và tiến độ đạo. iOS: lễ đổi thành «Thắp đèn Thất Tinh» (học tên sao, không có bản mệnh).
- Hồi chiêu: 1 lễ / ngày; lễ lớn ngày 9/9 (Trùng Cửu) cho `B = 30`.

### A.4.3 Trực đàn (`B = 8` / phiên)

- Đứng trực ở đàn Thiên Sư Phủ 10 phút: tiếp khách hành hương (hội thoại ngắn), chỉ đường, nhắc giới đạo tràng, giữ đèn không tắt.
- Mỗi phiên có 1–2 khách «cần thật» (sinh DEED giúp người). Không AFK: khách bỏ đi nếu người chơi không đáp trong 60 giây (không phạt, chỉ hết phiên sớm).

## A.5 Chuỗi nhiệm vụ Chính Nhất

| Mã | Tên | Mục tiêu | Mở | Dạy | Thưởng |
|---|---|---|---|---|---|
| CQ-CN-01 | Vào phủ Thiên Sư | lên Long Hổ; nghe Trương Thiên Sư giảng 9 chiều của phái (`COMPARE_DIMS` × `zhengyi`); nhận giới thường trực 1; lễ nhập môn (ngày chọn ở Lịch Đường nếu muốn) | đến `longho` | `SCHOOLS.zhengyi` (founder, era, seat, canon, coreMethod, deity, ordination, monastic, region) | B 30; hạng I |
| CQ-CN-02 | Đầu phù | học đoạn **đầu** và **thân**: phân biệt 3 loại việc và 3 chữ công năng; kết 3 phù mẫu | I | `structure.head`, `structure.body` | B 25 |
| CQ-CN-03 | Bụng và đảm | học bụng (bát quái ứng phương) và đảm (ngũ hành); bài đố: 8 phương ↔ 8 quẻ | I | `structure.belly`, `structure.core`; bát quái hậu thiên | B 25 |
| CQ-CN-04 | Chân phù và sắc lệnh | học đoạn chân; kết trọn 1 phù mẫu năm đoạn | I | `structure.foot` | B 20 |
| CQ-CN-05 | Phù bình an đầu tiên | kết phù «hợp cảnh bình an» cho nhà riêng của mình (nối `CQ-MD-18`); nghe giảng ETHICS «phải do đạo sĩ thụ lục» | I | `FU_HE_JING_PING_AN` (cấu trúc), `remedies.remedy-fu.caveat` | B 30; thi lên **II · Đô Công** |
| CQ-CN-06 | Sao bản mệnh | tra bản mệnh tinh quân theo năm sinh; làm lễ bái Đẩu đầu tiên | II | `zhengyi-baidou`, `FA_BAIDOU`, bảng bản mệnh | B 30 |
| CQ-CN-07 | Giải ách cho bà lão | một bà lão sợ «năm hạn» (Định Mệnh Hội dọa); người chơi tra `personalTaSui` thật, giải thích, rồi cùng Thiên Sư làm lễ giải ách nhỏ **để bà yên lòng** | II | `zhengyi-jiee`, `taisui`, `anti-manipulation-data` | B 35; DEED-146 nếu là án vùng |
| CQ-CN-08 | Xem thư phù | đứng hầu Thiên Sư làm khoa thư phù (cắt cảnh): chọn ngày giờ, tịnh đàn, tụng chú, hạ bút — **chỉ xem**, giải nghĩa từng bước | II | `FA_SHUFU` (nghi thức), `remedy-fu.steps` | B 25 |
| CQ-CN-09 | Pháp ấn và pháp khí | học tên, ý nghĩa 5 pháp khí (kiếm gỗ đào, đế chung, lệnh kỳ, pháp ấn, khảo quỷ bổng) và vì sao pháp ấn chỉ dùng trong khoa nghi | II | `FA_FAQI`, `FA_FAYIN` | B 25 |
| CQ-CN-10 | Trai tiếu làng | tổ chức trai tiếu nhỏ cho một làng vừa qua lũ: chọn ngày (`zheri`), dựng đàn (mô-đun nội thất), mời dân, làm lễ an dân; **đồng thời** phát cháo (DEED-085) | II | khoa nghi trai tiếu; `zheri` | B 50; thi lên **III · Minh Uy** |
| CQ-CN-11 | Phù trấn trạch thật sự cần | 5 nhà ở Huyền Thành có sát (`SHA_LIST`); kết phù trấn trạch theo hành Dụng của **chủ nhà** **và** chỉ cách hóa vật lý trong `cures` | III | `fs-cure`, `cureByElement` | B 40 |
| CQ-CN-12 | Phù giả ở chợ | Định Mệnh Hội bán «phù đổi cách cục»; người chơi so cấu trúc năm đoạn, chỉ ra phù giả thiếu đảm / chân và in hàng loạt; vạch mặt | III | cấu trúc phù; `patternQuality` (cách không đổi bằng phù) | B 40; DEED-147 |
| CQ-CN-13 | Thần Tiêu · lôi pháp an dân | sự kiện giông lớn ở chân Long Hổ: dân hoảng; người chơi đứng ở đàn đọc lời an dân, dẫn dân vào phủ trú (nghi lễ **không có hiệu ứng điều khiển sấm**) | III | `SCHOOLS.shenxiao`, `FA_LEIFA` (ý nghĩa «nội đan làm thể, phù chú làm dụng») | B 40; DEED-038 |
| CQ-CN-14 | Dạy đạo đồng | kèm một người chơi hạng I (hoặc NPC đạo đồng nếu không có) qua `CQ-CN-02…04` | III | (ôn toàn bộ cấu trúc) | B 40; thi lên **IV · Tam Động** (kèm bái Đẩu 7 lần) |
| CQ-CN-15 | Chủ đàn Thượng Nguyên | Rằm tháng Giêng: đứng phó đàn cho Thiên Sư; dẫn người chơi khác tụng Tam Quan Kinh | IV | `remedy-songjing` (三官经), lễ Thượng Nguyên | B 60 |
| CQ-CN-V | Truyền lục | ba người chơi do mình dẫn đạt Đô Công Lục; lễ viên mãn ở chính điện | IV, ĐH-đạo ≥ 1.800 | — | B 100; hạng **V**; danh hiệu «Thiên Sư Môn Hạ» |

**Tổng `B` chuỗi:** 30+25+25+20+30+30+35+25+25+50+40+40+40+40+60+100 = **615**.

## A.6 Thi thăng hạng

**Kiểm tri lên II (mẫu 5 / 10 câu; đề xáo từ ngân hàng 40 câu):**

1. Phù gồm mấy đoạn? (Đ: năm — đầu, thân, bụng, đảm, chân)
2. Đoạn nào là «trung khu sức mạnh» của phù theo mô tả app? (Đ: đảm 符膽)
3. Nhà bị sát ở hướng Nam, bụng phù đặt quẻ nào? (Đ: Ly)
4. Chính Nhất có buộc xuất gia không? (Đ: không — hỏa cư đạo sĩ)
5. Ai được viết phù thật theo truyền thống? (Đ: đạo sĩ đã thụ lục; app: «tự vẽ phù không truyền thừa bị coi là vô hiệu / phản tác dụng theo truyền thống»)

**Kiểm hành lên III:** 20 phù «viên» trong 30 ngày; 1 trai tiếu (`CQ-CN-10`).
**Kiểm tâm lên IV:** bái Đẩu ở độ khó cao (đèn tắt nếu chạm sai thứ tự sao, thắp lại được) — đạt «viên» 7 lần trong 30 ngày.

## A.7 Kịch bản cảnh

```
[CẢNH CQ-CN-01.1 · Long Hổ Sơn, cổng Thiên Sư Phủ · giờ Thìn · nắng sớm, sương sông Lô Khê]
(Hai con sư tử đá. Trương Thiên Sư đứng dưới biển «嗣漢天師府», tay áo rộng.)
TRƯƠNG THIÊN SƯ: Thí chủ từ Sơn Môn tới? Bần đạo nghe nói có người đọc lá số của mình mà không sợ.
> Lựa chọn: ① «Con muốn học phù.» → [.2a]  ② «Con chỉ muốn xem.» → [.2b]  ③ «Phù có đổi được mệnh không ạ?» → [.2c]

[CẢNH CQ-CN-01.2a]
TRƯƠNG THIÊN SƯ: Học phù là học cái nghiêm. Một lá phù có đầu, có thân, có bụng, có đảm, có chân. Thiếu một là thành giấy.
→ [.3]

[CẢNH CQ-CN-01.2b]
TRƯƠNG THIÊN SƯ: Xem cũng là học. Cửa phủ này mở cho người xem trước, rồi mới mở cho người tu.
→ [.3]

[CẢNH CQ-CN-01.2c]
TRƯƠNG THIÊN SƯ: (cười) Câu này ngày nào bần đạo cũng nghe. Phù không đổi mệnh. Phù làm người ta yên lòng để tự đổi mình. Ai bán con lá phù đổi mệnh thì con dắt người ấy lên đây.
→ [.3]

[CẢNH CQ-CN-01.3 · chính điện]
(Thiên Sư mở cuộn giới.)
TRƯƠNG THIÊN SƯ: Giới đầu của người vào cửa này: không kết phù cho việc hại người. Ai nhờ con lá bùa cho kẻ khác thua, kẻ khác bỏ nhau — con từ chối. Giữ được không?
> Lựa chọn: ① «Con giữ.» → [.4]  ② «Nếu người ta trả nhiều?» → [.3b]

[CẢNH CQ-CN-01.3b]
TRƯƠNG THIÊN SƯ: Thì càng phải từ chối. Trả nhiều là vì việc xấu nhiều.
→ [.4]

[CẢNH CQ-CN-01.4]
(Lễ nhập môn: thắp hương, ba lạy trước Tam Thanh. Nhận áo đạo đồng — phục lễ, không phải món Tàng Y Các.)
TRƯƠNG THIÊN SƯ: Từ hôm nay thí chủ là tiểu đạo đồng của phủ. Sáng mai giờ Mão, ra đàn quét lá.
(Hạng I. Giới thường trực 1.)
```

```
[CẢNH CQ-CN-V.1 · Thiên Sư Phủ, chính điện · Rằm tháng Giêng, giờ Tuất · đèn lồng đỏ]
(Ba người chơi được người chơi dẫn dắt đứng hàng sau, mỗi người cầm tờ Đô Công Lục mới.)
TRƯƠNG THIÊN SƯ: Lục của con không phải để treo. Lục là lời hứa. Ba người sau lưng con là lời hứa con đã giữ.
TRƯƠNG THIÊN SƯ: Từ nay con được gọi là đại pháp sư ở Huyền Giới. Ra khỏi Huyền Giới, con là người thường. Nhớ cái đó, thì cái danh này mới sạch.
(Danh hiệu «Thiên Sư Môn Hạ». Tên khắc trên bảng gỗ hành lang Đông. Suất trả lại.)
```

## A.8 Giới hạn nội dung riêng

| # | Giới hạn |
|---|---|
| CN-G1 | Không có phù nào trong game có hình dạng giống phù thật đủ để chép (ký tự hư cấu; đội mỹ thuật dùng bộ «chữ phù Huyền Giới» do tài liệu 12 thiết kế). |
| CN-G2 | Bản mệnh tinh quân chỉ là **tri thức truyền thống**; không gắn với số mệnh, sức khỏe, tuổi thọ của người chơi. |
| CN-G3 | Không lễ nào hứa «giải hạn». Lễ giải ách luôn đi cùng việc thật (giải thích lá số thật, dẫn tới người giúp thật). |
| CN-G4 | Thần Tiêu lôi pháp chỉ có cảnh nghi lễ và lời an dân; không có tia sét do người chơi gọi. |
| CN-G5 | Không bán lục, phù, pháp khí bằng Ngọc hay Phúc Khí như vật có công năng (giới chung 05-06 §5.2). |

## A.9 Ca biên

| Ca | Xử lý |
|---|---|
| Người chơi kết phù cho NPC có lá số lỗi (engine trả thiếu `yong`) | NPC đó không xuất hiện ở hàng đơn (lọc trước khi sinh) |
| iOS | kết phù giữ (là học cấu trúc, không bói); bái Đẩu bỏ phần bản mệnh; giải ách bỏ bước tra Thái Tuế, thay bằng giải thích «năm hạn» là tín ngưỡng |
| Người chơi tu cả Chính Nhất và Thượng Thanh | phù năm đoạn học một lần, tính cho cả hai chuỗi (`CQ-CN-02…04` ↔ `CQ-TT-03`) |

---

# PHẦN B — THANH VI 清微 · ĐAN ĐỈNH 丹鼎 (Võ Đang)

## B.1 Tổng quan

| Hạng mục | Nội dung |
|---|---|
| Phái (app) | `qingwei` — Thanh Vi, «雷法 — 内丹为体, 符咒为用», đạo tràng Vũ Đương Sơn; `danding` — Đan Đỉnh, «tu tiên phái — luyện đan (nội / ngoại) là cốt; nền tảng toàn bộ tu hành đạo giáo» |
| Thánh địa | `vodang` — Võ Đang Huyền Nhạc (0, −1500) |
| NPC dẫn | Huyền Hư chân nhân (`huyen_hu`) — nội đan, tĩnh tọa, Thái Cực; Đan Đỉnh chân nhân Cát Huyền (`dan_dinh`) — lò đan, dẫn lộ Đắc Cứu |
| Hành của đạo | chính **Mộc**, phụ **Thổ** |
| Tu Bổ | Nguyên Khí · Sinh Cơ |
| Câu cấm của NPC | hướng dẫn nhịn ăn (辟穀); khí công trị bệnh |
| Dữ liệu tu luyện | `DAO_JIA[1]` nội đan («tu dần (cần chân truyền), đừng tự luyện bừa»), `DAO_JIA[2]` thủ nhất / phục khí / thổ nạp, `CULTIVATION` (10 mục) |

## B.2 Thang hạng — năm tầng công phu

Tên bốn bậc nội đan của app (炼精化气 → 炼气化神 → 炼神还虚 → 炼虚合道) **đã dùng làm tên cảnh giới chung** (canon §5). Để không trùng, thang hạng Thanh Vi dùng **tên các môn công phu** trong `CULTIVATION`, đi từ thân → khí → thần → trung cung → lôi pháp:

| Hạng | Tên hạng | Môn (app) | Mini-game mở | Điều kiện riêng |
|---|---|---|---|---|
| I | **Đạo Dẫn** 導引 | `GONG_DAOYIN` — «導氣令和, 引體令柔»; Ngũ Cầm Hí, Mã Vương Đôi Đạo Dẫn Đồ | Thái Cực (nhịp động) mức 1 | `CQ-TV-01` |
| II | **Thổ Nạp** 吐納 | `GONG_TUNA` — «吐故納新»; Hành Khí Ngọc Minh (Chiến Quốc) | tĩnh tọa hơi thở mức 2 | 10 phiên tĩnh tọa đạt «viên» |
| III | **Tồn Thần** 存神 | `GONG_CUNXIANG` — Hoàng Đình Kinh, ngũ tạng thần (hình ảnh) | tồn thần (giữ 5 điểm sáng) | lễ Kim Đỉnh bình minh |
| IV | **Hoàng Đình** 黃庭 (trung cung) | `DAN_CANTONG_QI` + `DAN_WUZHENPIAN` (lý luận đan kinh) | canh lò đan mức cao | đọc trọn 3 đan kinh; dạy Thái Cực cho 1 người |
| V | **Thanh Vi Chân Sĩ** | `FA_LEIFA` (ý nghĩa «thể – dụng») | — | viên mãn |

**Câu bắt buộc ở mọi màn tu luyện** (góc dưới, chữ nhỏ, không tắt được): «Đây là trò chơi. Công pháp thật cần thầy chỉ dẫn trực tiếp.» (`cultivation-data` ETHICS).

## B.3 Giới

| Loại | Giới | Mở | Thẻ giới hiện khi | Phạm khi |
|---|---|---|---|---|
| Thường trực 1 | **Không tự luyện bừa** — không dùng «bí kíp» mua ở chợ đen | I | chợ đen Võ Đang bán «Cửu Chuyển Bí Kíp» (vật mồi, hư cấu) | mua và dùng |
| Thường trực 2 | **Không nhịn ăn để tu** | III | NPC đạo sĩ giả mời «tịch cốc 7 ngày thành tiên» | nhận lời |
| Thường trực 3 | **Không khoe công phu** | IV | phương án `khoe_phap` | chọn |
| Đạo tràng | không ngự kiếm / cưỡi ngự vật trong các cung điện Võ Đang (tắt tự động, thẻ giới khi cố bật) | I | | |
| Đạo tràng | im lặng ở tĩnh thất (kênh chat vùng tắt trong tĩnh thất; nói = không phạm, chỉ không nhận thưởng phiên) | I | | |
| Đạo tràng | chay trong lò đan | I | | |

**Vì sao «không nhịn ăn» là giới, không chỉ là lời khuyên:** `CULTIVATION.GONG_BIGU.use`: «KHÔNG tự nhịn — nguy y tế; chỉ tham chiếu». Game đặt nó thành giới để người chơi **chủ động từ chối** một lời mời nguy hiểm — bài học ra được đời thật.

## B.4 Hoạt động lõi

### B.4.1 Tĩnh tọa hơi thở (`B = 12` / phiên)

- **Yêu cầu mini-game (09):** vòng tròn nở – co theo nhịp; người chơi giữ phím khi nở, thả khi co. Tạp niệm (mây) bay ngang: **không chạm** là đúng. Tâm ma theo thanh nghiệp (05-05 §2.4) và khuynh hướng (`liudao.poisonTop`) thêm tạp niệm có chủ đề.
- **Nhịp:** mức 1: 6 vòng / phút; mức 2: 5; mức 3: 4. **Không bao giờ** dưới 4 vòng / phút (tránh người chơi nín thở theo). Phiên 5–15 phút.
- **Giờ tốt:** `WX_PRACTICES[yong.primary].time` (vd Thủy: 21–23h) → phiên trong khung giờ đó `B +2` (không phải Vận Phù; là gợi ý tu theo Dụng của app `spiritual-fs`).
- Hồi chiêu: 3 phiên / ngày có thưởng.

### B.4.2 Thái Cực (`B = 10` / phiên)

- Chuỗi động tác theo nhịp nhạc chậm; người chơi giữ nhân vật theo đường vẽ (không cần chính xác tuyệt đối). Có **song luyện** hai người chơi (canon §10 «đồng tu»): đồng bộ thêm `B +2` mỗi người.
- Không có nội dung «Thái Cực trị bệnh».

### B.4.3 Canh lò đan (`B = 8` / phiên)

- Lò đan của Đan Đỉnh chân nhân: giữ lửa trong vùng «văn hỏa» (lửa nhỏ) hoặc «vũ hỏa» (lửa lớn) theo lệnh, 5 phút. Thành phẩm là **«đan» hư cấu, thẩm mỹ** (một viên sáng bỏ vào hồ lô — `ho_lo` của bộ Hậu Thổ hiển thị có đan).
- **Không có hiệu ứng uống đan.** Viên đan chỉ để tặng (DEED tặng quà cho thầy).
- Bài học: Đan Đỉnh chân nhân kể ngoại đan xưa dùng khoáng chất (chu sa — thủy ngân) và nhiều người chết vì đan; vì thế phái chuyển vào nội đan (`DAN_BAOPUZI`, `danding.coreMethod`).

## B.5 Chuỗi nhiệm vụ Thanh Vi · Đan Đỉnh

| Mã | Tên | Mục tiêu | Mở | Dạy | Thưởng |
|---|---|---|---|---|---|
| CQ-TV-01 | Một nghìn bậc | leo bậc đá lên Tử Tiêu Cung (không ngự kiếm); gặp Huyền Hư; nghe 9 chiều của `qingwei` và `danding`; nhận giới 1 | đến `vodang` | `SCHOOLS.qingwei`, `danding` | B 30; hạng I |
| CQ-TV-02 | Năm con thú | học Ngũ Cầm Hí (hổ, hươu, gấu, vượn, chim) qua 5 động tác Thái Cực mức 1; xem bức Mã Vương Đôi Đạo Dẫn Đồ trong điện | I | `GONG_DAOYIN` («導氣令和, 引體令柔», 華佗五禽戲, 馬王堆導引圖 44 tư thế) | B 25 |
| CQ-TV-03 | Ngọc minh hành khí | tìm bản khắc «Hành Khí Ngọc Minh» trong thư khố Võ Đang; giải nghĩa câu «行氣，深則蓄，蓄則伸…»; 3 phiên tĩnh tọa | I | `GONG_TUNA` | B 25 |
| CQ-TV-04 | Đỉnh lô và dược vật | đố: ghép 乾坤 ↔ đỉnh lô, 坎離 ↔ dược vật; đặt 4 quẻ đúng vị trên mô hình lò | I | `DAN_CANTONG_QI` («以乾坤為鼎爐，以坎離為藥物») | B 25 |
| CQ-TV-05 | Lò đan đầu tiên | canh lò với Đan Đỉnh chân nhân; nghe chuyện đan sa độc | I | `DAN_BAOPUZI` (ngoại đan), `danding.coreMethod` | B 30; thi lên **II · Thổ Nạp** |
| CQ-TV-06 | Ngộ Chân Thiên | đọc 3 bài thơ (bản dịch nghĩa) của Trương Bá Đoan; ghép ý thơ với ba bảo tinh – khí – thần | II | `DAN_WUZHENPIAN` (南宗, thơ từ truyền khẩu quyết, hợp tam giáo) | B 30 |
| CQ-TV-07 | Hoàng Đình ngũ tạng | tồn thần: 5 điểm sáng ứng 5 tạng (hình ảnh, không giải phẫu, không y học) | II | `GONG_CUNXIANG` (黃庭經 五臟神) | B 30 |
| CQ-TV-08 | Người nhịn ăn ở hang | một NPC trẻ nghe đạo sĩ giả, nhịn ăn 5 ngày trong hang, kiệt sức; đưa ra, gọi Vu y bà A Mậu; Huyền Hư giảng vì sao app cấm tự tịch cốc | II | `GONG_BIGU` (cảnh báo), giới thường trực 2 | B 35; DEED-033 / DEED-043 kiểu cứu người (+3) |
| CQ-TV-09 | Song luyện | Thái Cực song luyện với một người chơi khác 5 phiên đồng bộ ≥ 80% | II | `danding.region` (ẩn sĩ tu cùng) | B 30 |
| CQ-TV-10 | Kim Đỉnh bình minh | lên Kim Đỉnh trước giờ Mão; tĩnh tọa lúc mặt trời mọc (sự kiện theo giờ thật của vùng máy chủ) | II | `DAO_JIA[2]` («tọa 15–30ph, tập trung đan điền» — chỉ đọc) | B 50; thi lên **III · Tồn Thần** |
| CQ-TV-11 | Hái vị thuốc | Đan Đỉnh chân nhân dẫn lộ Đắc Cứu (canon): làm 2 nhiệm vụ «vị thuốc» `CQ-MD-90…94` theo `rescues[].drug` của lá số; người không có 有救 thì hái cho một NPC 有救 | III | `patternQuality.rescues` | B 40 |
| CQ-TV-12 | Lôi pháp thể dụng | sự kiện giông ở Võ Đang: đọc kinh an dân ở Tử Tiêu Cung, dẫn khách xuống điện trú; Huyền Hư giảng «内丹为体, 符咒为用» | III | `FA_LEIFA`, `qingwei.distinctive` («以我本炁 hợp thiên địa tạo hóa») | B 40; DEED-038 |
| CQ-TV-13 | Dạy cụ già Đạo Dẫn | 5 buổi dạy Ngũ Cầm Hí cho cụ già Huyền Thành (động tác nhẹ, cảnh không hứa sức khỏe) | III | `GONG_DAOYIN` («dưỡng sinh dân sự, an toàn») | B 40; DEED-051 kiểu (+2 / buổi, theo trần) |
| CQ-TV-14 | Vân Tất Thất Thiêm | săn 7 «thiêm» (loại kinh) trong thư khố: tìm 7 quyển, mỗi quyển thuộc một loại (tam động tứ phụ) | III | `DAN_YUNJI_QIQIAN` («đạo giáo tiểu bách khoa», 122 quyển, 七籤 = 7 loại) | B 40; thi lên **IV · Hoàng Đình** |
| CQ-TV-15 | Trung cung | đọc trọn 3 đan kinh (Tham Đồng Khế, Ngộ Chân Thiên, Bão Phác Tử) ở dạng thẻ; tĩnh tọa trung cung mức 3 đạt «viên» 7 lần | IV | đan kinh song bích («丹經王») | B 60 |
| CQ-TV-V | Truyền Thái Cực | ba người chơi do mình dạy đạt hạng II; lễ ở Kim Đỉnh | IV, ĐH-đạo ≥ 1.800 | — | B 100; hạng **V**; danh hiệu «Võ Đang Chân Sĩ» |

**Tổng `B` chuỗi:** 30+25+25+25+30+30+30+35+30+50+40+40+40+40+60+100 = **630**.

## B.6 Thi thăng hạng

**Kiểm tri lên II (mẫu):**

1. «導氣令和, 引體令柔» nói về môn nào? (Đ: Đạo Dẫn)
2. Ngũ Cầm Hí gắn với ai? (Đ: Hoa Đà)
3. Tham Đồng Khế gọi càn khôn là gì, khảm ly là gì? (Đ: đỉnh lô; dược vật)
4. App khuyên gì về nội đan? (Đ: cần chân truyền, đừng tự luyện bừa)
5. Ngoại đan xưa nguy hiểm vì sao? (Đ: dùng khoáng chất độc)

**Kiểm hành lên III:** 10 phiên tĩnh tọa «viên», 5 phiên Thái Cực, 3 phiên lò đan trong 30 ngày.
**Kiểm tâm lên IV:** tồn thần mức 3 (giữ 5 điểm sáng trong khi tạp niệm dày) đạt «viên» 5 lần.

## B.7 Kịch bản cảnh

```
[CẢNH CQ-TV-01.1 · Võ Đang, Tử Tiêu Cung, sân trước · giờ Tỵ · gió núi]
(Người chơi vừa leo hết bậc. Huyền Hư chân nhân ngồi trên đá, mắt khép.)
HUYỀN HƯ: Tiểu hữu leo bộ à? Tốt. Ai ngự kiếm lên đây, lão đạo bảo xuống leo lại.
> Lựa chọn: ① «Con mệt lắm.» → [.2a]  ② «Sao phải leo ạ?» → [.2b]

[CẢNH CQ-TV-01.2a]
HUYỀN HƯ: Mệt là thân đang nói chuyện với tiểu hữu. Ngồi xuống, nghe nó nói hết.
→ [.3]

[CẢNH CQ-TV-01.2b]
HUYỀN HƯ: Vì người ta hay muốn tới đỉnh mà quên mất mình có cái thân. Tu là nhớ lại cái thân trước.
→ [.3]

[CẢNH CQ-TV-01.3]
HUYỀN HƯ: Lão đạo nói trước một điều. Ở đây dạy tiểu hữu những gì sách xưa ghi, và cho tiểu hữu ngồi thở theo nhịp trống. Nhưng công phu thật thì phải có thầy thật ở bên. Đừng ai ra ngoài kia tự luyện theo cái trống của lão.
> Lựa chọn: ① «Con hiểu.» ② «Vậy học ở đây để làm gì?»
HUYỀN HƯ: (với ②) Để biết người xưa đã đi đường nào, và để biết ngồi yên. Ngồi yên được thì đi đâu cũng có ích.
(Nhập môn: giới «không tự luyện bừa». Hạng I · Đạo Dẫn.)
```

```
[CẢNH CQ-TV-05.1 · Võ Đang, lò đan sau núi · giờ Ngọ · lửa]
(Đan Đỉnh chân nhân Cát Huyền quạt lửa, tóc buộc vải.)
ĐAN ĐỈNH: Lửa nhỏ gọi là văn hỏa, lửa lớn gọi là vũ hỏa. Con giữ cho lão văn hỏa.
(Mini-game canh lửa.)
ĐAN ĐỈNH: Ngày xưa có người nấu chu sa, nấu cả thủy ngân, mong thành tiên. Nhiều người chết vì viên đan của mình. Cho nên phái ta mới quay vào trong: lò là thân, lửa là ý, thuốc là tinh khí thần.
> Lựa chọn: ① «Vậy viên đan con vừa canh để làm gì?» ② «Con có uống được không?»
ĐAN ĐỈNH: (với ①) Để con nhớ cái lửa. Viên này đẹp, tặng thầy con thì thầy vui. Thế thôi.
ĐAN ĐỈNH: (với ②) Không. Lão nói rồi đấy — người ta chết vì uống.
(Nhận «đan Huyền Giới» — vật thẩm mỹ. Thi lên hạng II mở.)
```

```
[CẢNH CQ-TV-V.1 · Kim Đỉnh, Võ Đang · bình minh · biển mây]
(Ba đệ tử tập Thái Cực sau lưng người chơi, theo nhịp trống của Huyền Hư.)
HUYỀN HƯ: Tiểu hữu đã thôi đuổi theo đỉnh núi. Giờ người ta theo tiểu hữu lên núi.
HUYỀN HƯ: Thanh Vi nói nội đan làm thể, phù chú làm dụng. Lão nói thêm: dạy người làm dụng, giữ mình làm thể.
(Danh hiệu «Võ Đang Chân Sĩ». Suất trả lại.)
```

## B.8 Giới hạn nội dung riêng

| # | Giới hạn |
|---|---|
| TV-G1 | Mini-game hơi thở: nhịp ≥ 4 vòng / phút, không có pha «giữ hơi» dài > 6 giây, có câu «Đây là trò chơi…» ở góc. |
| TV-G2 | Không bất kỳ nội dung nào nói tĩnh tọa, Thái Cực, đan, đạo dẫn **chữa** bệnh hay **kéo dài tuổi thọ**. |
| TV-G3 | Tịch cốc chỉ xuất hiện như **cảnh báo** và **cứu người**. |
| TV-G4 | Không mô tả kỹ thuật nội đan (vận khí qua kinh mạch, tiểu chu thiên…) dưới dạng chỉ dẫn. Tên gọi được nhắc như tri thức lịch sử. |
| TV-G5 | Ngoại đan: không công thức, không tên khoáng chất kèm cách dùng; chỉ nhắc chu sa / thủy ngân **như ví dụ nguy hiểm**. |

## B.9 Ca biên

| Ca | Xử lý |
|---|---|
| Người chơi bật chế độ giảm chuyển động (accessibility) | Thái Cực chuyển thành chọn tư thế theo nhịp (không cần di chuyển) |
| Người chơi khiếm thính | vòng thở có rung (haptics, đã có `haptics.js`) và hình |
| Song luyện đối phương rời giữa chừng | phiên tính như luyện đơn |
| iOS | giữ toàn bộ (tu tâm, học); bỏ gợi ý giờ theo Dụng (là luận lá số) |
