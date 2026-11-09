# 10 · Phần 14 — Chữ giao diện và lời thoại hệ thống cho tính năng xã hội

> Mục đích: lập trình viên và biên tập viên có **câu chữ chính xác** cho mọi thông báo, hộp thoại, trạng thái trống, lỗi, lời NPC hệ thống của Phần 01–13 — không ai phải tự đặt câu lúc làm. Khóa chuỗi dạng `nhóm.việc` (không phải mã định danh của canon; mã `UI-xx` là của tài liệu 12, ở đây chỉ dùng khóa chuỗi).
>
> Căn cứ giọng văn: câu thật có trong code — `features.js › TEXT.gateLead` («Ghé quán xem tứ trụ, hướng nhà, xin một quẻ, rồi ngồi uống chén trà. Không ai giục.»), `main.js` («Đã gửi báo cáo. Cảm ơn bạn giữ quán yên tĩnh.», «Đang chơi đơn — chỉ mình bạn thấy.», «Đã bỏ ẩn — có hiệu lực từ lần kết nối tới.»).

## 14.0 Giọng văn

| Nguyên tắc | Làm | Không làm |
|---|---|---|
| Ngắn | một câu, tối đa hai | đoạn văn trong thông báo |
| Ấm, bình thản | «Chưa tới lúc.» | «LỖI! Không thể thực hiện!» |
| Không giục | «Khi nào rảnh thì ghé.» | «Nhanh lên! Còn 5 phút!» (trừ đếm ngược đại lễ — chỉ hiện con số) |
| Không định mệnh luận | «Mệnh do ta tạo.» | «Số bạn đã định…» |
| Không đổ lỗi người chơi | «Không gửi được.» | «Bạn đã làm sai.» |
| Không lộ thông tin người khác | «Không gửi được.» (khi bị ẩn) | «Người này đã chặn bạn.» |
| Xưng hô | hệ thống gọi «bạn»; NPC gọi «con» (thầy), «cậu/cô» (người làng) như kịch bản canon | trộn «mày/tao», «quý khách» |
| Hán Việt có nghĩa | lần đầu kèm nghĩa ngắn: «Đạo Vọng (uy tín của đường)» | thuật ngữ trơ |
| iOS | dùng từ «học», «giải», «đối chiếu»; không dùng «bói», «đổi vận», «giải hạn» (kế hoạch MMO §A) | — |

---

## 14.1 Lần đầu vào thế giới chung

Hiện khi `net.status` lần đầu chuyển `online` (sau khi chơi đơn).

**Màn 1 — `onb.mmo.1`**
- Tiêu đề: «Quán có người rồi»
- Thân: «Bây giờ bạn thấy những người khác đang ở cùng phòng. Mọi người nói chuyện bằng câu soạn sẵn và cử chỉ — không có chat tự do, để quán luôn yên.»
- Nút: «Hiểu rồi»

**Màn 2 — `onb.mmo.2`**
- Tiêu đề: «Màu áo của bạn»
- Thân: «Áo Bản Mệnh theo hành Dụng thần của bạn. Người khác sẽ thấy màu này. Nếu muốn, bạn có thể ẩn trong Sổ Mệnh › Riêng tư.»
- Nút: «Giữ màu» · «Ẩn màu bản mệnh»

**Màn 3 — `onb.mmo.3`**
- Tiêu đề: «Ngày sinh của bạn ở lại trên máy»
- Thân: «Huyền Giới không gửi ngày giờ sinh của bạn cho ai. Lá số chỉ được chia sẻ khi chính bạn bật "công khai căn cốt", và bạn thu hồi được bất cứ lúc nào.»
- Nút: «Tiếp»

**Màn 4 — `onb.mmo.4` (chỉ khi chưa khai nhóm tuổi)**
- Tiêu đề: «Một câu hỏi nhỏ»
- Thân: «Bạn sinh năm nào? Chúng tôi chỉ dùng để chọn tính năng phù hợp lứa tuổi, không dùng cho lá số và không gửi năm sinh lên máy chủ.»
- Ô chọn năm (bánh xe số) · Nút: «Xong»
- Nếu dưới 13: «Phần chơi cùng người khác sẽ mở khi bạn lớn hơn một chút. Bạn vẫn chơi được mọi thứ khác trong Huyền Giới.»

**Màn 5 — `onb.mmo.5`**
- Tiêu đề: «Nếu ai làm bạn khó chịu»
- Thân: «Chạm vào người đó → "Ẩn người này" để không thấy họ nữa, hoặc "Báo cáo". Câu "Mình không thích, xin dừng lại" luôn có trong bánh xe giao lưu.»
- Nút: «Vào quán»

---

## 14.2 Lời thoại NPC Tri Khách ở Lầu Danh Bộ

NPC phụ «Tri Khách Lầu Danh Bộ» (mã NPC do tài liệu 06 cấp; mỗi thánh địa một người, cùng kịch bản, khác trang phục theo tông).

```
[CẢNH LẦU DANH BỘ · tầng 1 · bất kỳ giờ]
TRI KHÁCH: Chào bạn. Bạn tìm một chi đường, hay muốn lập một chi đường mới?
> Lựa chọn:
  ① «Tìm chi đường.» → [A]
  ② «Lập chi đường mới.» → [B]
  ③ «Chi đường là gì?» → [C]
  ④ «Tôi chỉ xem thôi.» → [D]

[A]
TRI KHÁCH: Đây là sổ các chi đường của {tên tông}. Bạn muốn lọc thế nào?
(giao diện lọc: «đang mở cửa» · «có lễ trong 3 ngày tới» · «ít người (dưới 12)» · «nhiều người (từ 20)» · «nhận người mới cảnh giới 2»)
TRI KHÁCH (khi người chơi chưa thuộc tông này): Bạn chưa nhập {tên tông}. Muốn vào chi đường, bạn gặp {chưởng giáo} trước đã.
TRI KHÁCH (khi người chơi đang ở chi đường khác): Bạn đang ở {tên chi đường}. Muốn sang đường khác thì từ đường trước, chờ ba ngày.

[B]
(nếu chưa đủ điều kiện)
TRI KHÁCH: Lập chi đường cần cảnh giới thứ ba, ở tông này đủ ba tuần, và năm người cùng đứng tên với bạn.
TRI KHÁCH: Bạn còn thiếu: {danh sách điều kiện chưa đạt}.
(nếu đủ)
TRI KHÁCH: Lệ phí hai nghìn Phúc Khí. Số này không vào kho ai cả — người xưa gọi là "lễ khai đường".
TRI KHÁCH: Mời bạn chọn tên. Tên ghép từ hai chữ, rồi đến tên loại: {Pháp Đàn / Đan Viện / …}.
(giao diện ghép tên — §14.4 «Ghép tên chi đường»)
TRI KHÁCH: Năm người đồng khởi sẽ nhận lời mời. Họ có ba ngày để ký.

[C]
TRI KHÁCH: Tông là cả một đạo, rộng lắm. Chi đường là một nhóm nhỏ trong tông, tối đa ba mươi người, có đạo tràng riêng, làm lễ riêng, có kho chung.
TRI KHÁCH: Không vào chi đường cũng được. Bạn vẫn dự lễ tông, vẫn tu đủ đường.

[D]
TRI KHÁCH: Cứ xem. Tầng hai có bia Đạo Vọng của các đường, đi cầu thang bên trái.
```

**Câu rảnh (khi người chơi đứng gần, không nói chuyện; mỗi lần một câu ngẫu nhiên):**
- «Đường nhỏ mà chăm thì hơn đường lớn mà vắng.»
- «Có đường vừa khánh thành Tàng Thư Các đấy.»
- «Tuần này lễ tông vào tối Chủ nhật, giờ Tuất.»
- «Ai muốn tìm thầy thì xem bảng bên cửa sổ.»
- «Đình Nghỉ Chân bên kia có người đang tìm bạn đồng hành.»

---

## 14.3 Thông báo ngắn (toast)

### 14.3.1 Giao lưu, ẩn, báo cáo

| Khóa | Câu |
|---|---|
| `toast.emo.toMe` | «{tên} {cử chỉ} bạn {biểu tượng}» *(đã có trong `main.js`)* |
| `toast.reported` | «Đã gửi báo cáo. Cảm ơn bạn giữ quán yên tĩnh.» *(đã có)* |
| `toast.blocked` | «Đã ẩn {tên}. Bạn sẽ không thấy người này nữa.» *(đã có)* |
| `toast.unblocked` | «Đã bỏ ẩn — có hiệu lực từ lần kết nối tới.» *(đã có)* |
| `toast.say.rate` | «Chậm lại một chút nhé.» |
| `toast.say.quiet` | «Đang ở nơi giữ im lặng.» |
| `toast.emo.zone` | «Cử chỉ này dùng ở trong điện.» |
| `toast.emo.window` | «Cử chỉ này chỉ có trong dịp {tên lễ}.» |
| `toast.renamed` | «Tên của bạn tạm hiển thị là "Khách". Mời bạn chọn tên khác trong Sổ Mệnh.» |
| `toast.report.result.ok` | «Chúng tôi đã xem báo cáo của bạn và có biện pháp phù hợp.» |
| `toast.report.result.none` | «Chúng tôi đã xem báo cáo của bạn. Lần này chưa thấy vi phạm. Bạn vẫn có thể ẩn người đó.» |

### 14.3.2 Đạo hữu, thư, quà

| Khóa | Câu |
|---|---|
| `toast.fr.req` | «{tên} muốn kết đạo hữu với bạn.» |
| `toast.fr.ok` | «Bạn và {tên} đã là đạo hữu.» |
| `toast.fr.sent` | «Đã gửi lời kết đạo hữu.» |
| `toast.fr.limit` | «Danh sách đạo hữu đã đủ hai trăm người.» |
| `toast.fr.code.copied` | «Đã chép mã đạo hữu. Gửi cho bạn bè ngoài đời để họ tìm bạn.» |
| `toast.fr.age.wait` | «Lời kết đạo hữu sẽ được xác nhận lại sau một ngày.» |
| `toast.mail.new` | «Có thư mới từ {tên}: "{tiêu đề}".» |
| `toast.mail.sent` | «Thư đã đi.» |
| `toast.mail.limit` | «Hôm nay bạn đã gửi đủ hai mươi thư.» |
| `toast.gift.got` | «{tên} tặng bạn {quà}.» |
| `toast.gift.sent` | «Đã trao {quà} cho {tên}.» |
| `toast.gift.far` | «Đứng gần hơn một chút để trao tay.» |
| `toast.gift.full` | «Hôm nay {tên} đã nhận đủ quà. Món của bạn được chuyển cho chùa.» |
| `toast.gift.expire` | «{quà} sắp hết hạn. Tặng ai đó trước khi hết nhé.» |

### 14.3.3 Nhóm đồng hành

| Khóa | Câu |
|---|---|
| `toast.inv.got` | «{tên} mời bạn đi cùng.» |
| `toast.inv.no` | «{tên} lần này chưa đi được.» |
| `toast.party.join` | «{tên} đã vào nhóm.» |
| `toast.party.leave` | «{tên} đã rời nhóm.» |
| `toast.party.kicked` | «Bạn đã rời nhóm của {tên}.» *(không nói «bị đuổi»)* |
| `toast.party.host` | «Bạn là trưởng nhóm.» |
| `toast.follow.on` | «Đang đi theo {tên}.» |
| `toast.follow.lost` | «Không theo kịp {tên} nữa. Đứng chờ hoặc tự đi.» |

### 14.3.4 Tông môn, chi đường

| Khóa | Câu |
|---|---|
| `toast.tong.join` | «Bạn đã nhập {tên tông}.» |
| `toast.tong.name` | «Tên tu của bạn: {tên tu}.» |
| `toast.sect.invite` | «{chi đường} mời bạn nhập đường.» |
| `toast.sect.apply.sent` | «Đơn của bạn đã đến {chi đường}. Tri Khách sẽ xem trong vài ngày.» |
| `toast.sect.apply.ok` | «{chi đường} đã nhận bạn. Bảy ngày đầu bạn là Ký Danh.» |
| `toast.sect.apply.no` | «{chi đường} lần này chưa nhận thêm người.» |
| `toast.sect.rank.r1` | «Bạn đã là Đồng Môn của {chi đường}.» |
| `toast.sect.rank.r2` | «Bạn đã là Nội Môn — từ nay bạn được bỏ phiếu.» |
| `toast.sect.role` | «Bạn nhận chức {chức}.» |
| `toast.sect.role.end` | «Bạn đã thôi chức {chức}.» |
| `toast.sect.give` | «Đã góp {số} vào kho. Góp là cho đường, không mua được chức.» |
| `toast.sect.give.limit` | «Hôm nay bạn đã góp đủ. Mai góp tiếp nhé.» |
| `toast.sect.carry` | «Một lượt vác. Còn {số} lượt nữa là xong đợt này.» |
| `toast.sect.carry.together` | «Có người vác cùng — lượt này tính nhiều hơn.» |
| `toast.sect.carry.limit` | «Hôm nay bạn đã vác đủ bốn mươi lượt. Nghỉ thôi.» |
| `toast.sect.build.wave` | «Xong đợt {n}/8 của {công trình}.» |
| `toast.sect.build.done` | «{công trình} đã xong. Vào xem đi.» |
| `toast.sect.rite.soon` | «Lễ {tên lễ} bắt đầu sau {phút} phút ở {nơi}.» |
| `toast.sect.rite.done` | «Lễ thành. Đường nhận {Đạo Vọng} Đạo Vọng.» |
| `toast.sect.vt.done` | «Việc tuần "{việc}" đã xong. Cảm ơn mọi người.» |
| `toast.sect.ns.new` | «Có nghị sự mới: {tóm tắt mẫu}.» |
| `toast.sect.ns.closed` | «Nghị sự "{tóm tắt}" đã đóng: {thông qua / không thông qua / không đủ người bỏ phiếu}.» |
| `toast.sect.left` | «Bạn đã từ {chi đường}. Ba ngày nữa bạn có thể vào đường khác.» |
| `toast.sect.removed` | «Bạn không còn là thành viên {chi đường}. Lý do: {lý do}.» |
| `toast.sect.tier` | «{chi đường} đã lên bậc {n}.» |
| `toast.sect.ally` | «{chi đường} và {chi đường kia} đã giao hảo.» |

### 14.3.5 Quan hệ sâu

| Khóa | Câu |
|---|---|
| `toast.sd.req` | «{tên} xin được theo bạn học {mảng}.» |
| `toast.sd.ok` | «Từ nay {thầy} và {trò} là thầy trò.» |
| `toast.sd.hint` | «Thầy {tên} nhắc: "{câu}"» |
| `toast.sd.task` | «Thầy đánh dấu tầng Mệnh Đồ "{tầng}" cho tuần này.» |
| `toast.sd.merit` | «Trò của bạn vừa xong một tầng Mệnh Đồ. Việc dạy của bạn được ghi vào Sổ Công Quá.» |
| `toast.sd.grad` | «{trò} đã xuất sư. Thầy trò vẫn là thầy trò.» |
| `toast.sd.end` | «{tên} đã thôi theo học.» / «{tên} đã thôi dạy.» |
| `toast.kl.formed` | «Kim lan {tên nhóm} thành.» |
| `toast.kl.left` | «{tên} đã rời kim lan.» |
| `toast.dl.formed` | «Lễ thành. Chúc hai bạn bình an.» |
| `toast.dl.end` | «{tên} đã kết thúc quan hệ đạo lữ. Chúc bạn bình an.» |
| `toast.share.got` | «{tên} chia sẻ căn cốt mức "{mức}" với bạn trong {thời hạn}.» |
| `toast.share.revoked` | *(không thông báo — người bị thu hồi chỉ thấy mục biến mất)* |

### 14.3.6 Sự kiện, lễ tiết, Thiên Bảng

| Khóa | Câu |
|---|---|
| `toast.ev.ack` | «Đã ghi {công} công vào {phần}.» |
| `toast.ev.cap` | «Hôm nay bạn đã góp đủ. Phần còn lại để mọi người cùng làm.» |
| `toast.ev.phase` | «Thiên Mệnh Bàn sang giai đoạn {Khai / Hóa / An / Thành}.» |
| `toast.ev.reduce` | «Thế giới cảm ơn những người đã góp sức; phần việc còn lại nhẹ đi.» |
| `toast.ev.done` | «Cả máy chủ làm được rồi.» |
| `toast.ev.stele` | «Tên tu của bạn đã được khắc ở {nơi}.» |
| `toast.cau.tut` | «Đoạn đường này hư. Bãi đá ở gần trạm nghỉ.» |
| `toast.fest.today` | «Hôm nay là {tên lễ}.» |
| `toast.fest.tomorrow` | «Mai là {tên lễ}. {một việc chuẩn bị}.» |
| `toast.lixi.got` | «{tên} lì xì bạn. Mở ra được {số} Phúc Khí.» |
| `toast.xongdat` | «Bạn là người xông đất {nơi} năm {năm can chi}.» |
| `toast.lb.rank` | «Bạn đứng thứ {hạng} {tên bảng} (tạm tính).» |
| `toast.lb.final` | «{tên bảng} kỳ {kỳ} đã chốt.» |
| `toast.cotu.sync` | «Đồng tâm.» *(một từ, không thêm)* |

---

## 14.4 Hộp thoại xác nhận

| Khóa | Tiêu đề | Thân | Nút chính | Nút phụ |
|---|---|---|---|---|
| `dlg.block` | «Ẩn người này?» | «Bạn sẽ không thấy {tên}, không nhận lời mời, thư, quà từ họ. Họ không được báo.» | «Ẩn» | «Thôi» |
| `dlg.report` | «Báo cáo {tên}» | «Chọn lý do. Báo cáo kèm những gì người đó vừa làm trong một phút qua — không kèm gì của bạn.» | (10 nút lý do) | «Thôi» |
| `dlg.sect.leave` | «Từ đường?» | «Phần bạn đã góp ở lại với đường. Công lao của bạn vẫn ghi trong hồ sơ. Ba ngày nữa bạn mới vào được đường khác.» | «Từ đường» | «Ở lại» |
| `dlg.sect.leave.report` | «Rời và báo cáo?» | «Bạn sẽ rời {chi đường} ngay và gửi báo cáo về điều đã xảy ra.» | «Rời và báo cáo» | «Thôi» |
| `dlg.sect.kick` | «Mời {tên} ra khỏi đường?» | «Chọn lý do. Người đó sẽ được biết lý do và có thể khiếu nại.» | (4 nút lý do) | «Thôi» |
| `dlg.sect.dissolve` | «Mở nghị sự hưu đường?» | «Nếu thông qua, sau bảy ngày đường sẽ đóng. Kho sẽ góp vào Quỹ Cầu Đường, không chia cho ai.» | «Mở nghị sự» | «Thôi» |
| `dlg.give` | «Góp vào kho» | «Góp là cho đường, không mua được chức. Hôm nay bạn còn góp được {số}.» | «Góp» | «Thôi» |
| `dlg.spend` | «Chi kho cho {mục đích}» | «Số này sẽ ghi vào Sổ Kho, mọi Đồng Môn đều xem được.» | «Chi» | «Thôi» |
| `dlg.found` | «Lập {tên chi đường}?» | «Lệ phí 2.000 Phúc Khí. Năm người đồng khởi có ba ngày để ký. Nếu không đủ người ký, lệ phí được hoàn.» | «Lập đường» | «Thôi» |
| `dlg.tong.change` | «Đổi chính tông?» | «Bạn sẽ rời {chi đường}. Đạo Hạnh, công đức và tên tu cũ vẫn giữ.» | «Đổi» | «Thôi» |
| `dlg.sd.end` | «Thôi theo học?» | «Thầy sẽ được báo một câu trung tính. Ba ngày nữa bạn có thể bái thầy khác.» | «Thôi theo» | «Ở lại» |
| `dlg.dl.mode.full` | «So đầy đủ?» | «So đầy đủ sẽ cho {tên} thấy các yếu tố lá số của bạn (chi năm, can chi ngày, nhóm mệnh quái). Từ đó có thể đoán ra năm sinh và gần đúng ngày sinh của bạn. Chỉ chọn nếu bạn tin người này ngoài đời. Bạn có thể chọn "Giản lược" để chỉ xem kết luận.» | «Tôi hiểu, so đầy đủ» (khóa 5 giây) | «Chọn giản lược» |
| `dlg.dl.end` | «Kết thúc quan hệ đạo lữ?» | «{tên} sẽ nhận một thông báo nhẹ nhàng. Đồ đôi vẫn ở lại với bạn.» | «Kết thúc» | «Thôi» |
| `dlg.share.lvl4` | «Chia sẻ tứ trụ với {tên}?» | «Tám chữ can chi cho phép đoán ngày sinh của bạn trong vài khả năng. Bạn thu hồi được bất cứ lúc nào, nhưng điều người đó đã thấy thì không xóa khỏi trí nhớ được.» | «Chia sẻ {thời hạn}» | «Thôi» |
| `dlg.lb.badge` | «Hiện huy hiệu Nghịch Thiên?» | «Con muốn người khác thấy con đi từ đâu tới đâu không? Không muốn cũng được. — Vân Cốc» | «Hiện» | «Không hiện» |
| `dlg.stele` | «Khắc tên lên {bia}?» | «Tên tu của bạn sẽ ở đó suốt mùa. Không khắc thì bạn vẫn được đếm trong dòng "và những người không ghi tên".» | «Khắc» | «Không ghi tên» |
| `dlg.rite.late` | «Lễ đã bắt đầu» | «Bạn vẫn vào được, nhưng sẽ không tính là dự đủ.» | «Vẫn vào» | «Thôi» |
| `dlg.fest.flower` | «Cài hoa Vu Lan» | «Hoa này cho mình. Không ai cần biết màu gì.» | «Hoa đỏ» · «Hoa trắng» | «Bỏ qua» |
| `dlg.account.delete` | «Xóa tài khoản trực tuyến?» | «Đạo hữu, thư, quan hệ sẽ bị xóa. Tên của bạn trên bia sẽ thành "một người tu". Phần chơi đơn trên máy này vẫn còn.» | «Xóa» (khóa 10 giây) | «Thôi» |

### 14.4.1 Ghép tên chi đường

- Tiêu đề: «Đặt tên cho đường»
- Hướng dẫn: «Chọn một chữ ở cột trái, một chữ ở cột phải. Tên loại theo tông đã có sẵn.»
- Xem trước: «{Chữ 1} {Chữ 2} {Tên loại}»
- Trùng: «Tên này đã có đường dùng. Thử chữ khác.»
- Bị chặn: «Tên này dễ gây nhầm. Thử chữ khác.»
- Nút: «Giữ tên này»

### 14.4.2 Ghép thư

- Tiêu đề: «Viết thư cho {tên}»
- Bước 1: «Chọn tiêu đề» (12 tiêu đề)
- Bước 2: «Chọn câu (tối đa ba)» — ô tìm: «Tìm câu…» (tìm trong thư viện, không gõ để gửi)
- Bước 3: «Gửi kèm quà?» — «Không kèm» · danh sách quà nhỏ còn hạn
- Nút: «Gửi thư»

---

## 14.5 Trạng thái trống

| Khóa | Nơi | Câu |
|---|---|---|
| `empty.friends` | danh sách đạo hữu | «Chưa có đạo hữu. Gặp ai hợp chuyện thì chạm vào họ → "Kết đạo hữu".» |
| `empty.friends.online` | đạo hữu đang online | «Lúc này chưa ai online. Quán vẫn mở.» |
| `empty.mail` | hộp thư | «Hộp thư trống. Thư hay đến vào ngày lễ.» |
| `empty.gifts` | túi quà nhỏ | «Hết quà rồi. Mai ghé Trà Thất lấy thêm ba món.» |
| `empty.party` | nhóm | «Bạn đang đi một mình. Đình Nghỉ Chân có người tìm bạn đồng hành.» |
| `empty.sect` | bảng chi đường (chưa vào) | «Bạn chưa thuộc chi đường nào. Không sao — lễ tông vẫn mở cho bạn mỗi tối Chủ nhật.» |
| `empty.sect.board` | bảng tin chi đường | «Bảng tin chưa có gì. Thư Ký sẽ dán thông báo ở đây.» |
| `empty.sect.ns` | nghị sự | «Không có nghị sự nào đang mở. Đường đang yên.» |
| `empty.sect.kho` | sổ kho | «Kho chưa có gì. Mỗi người góp một ít là đủ.» |
| `empty.mentor` | bảng thầy trò (chưa có) | «Bạn chưa có thầy. Bảng Tìm Thầy ở Lầu Danh Bộ.» |
| `empty.mentor.master` | thầy chưa có trò | «Chưa có ai bái sư. Thẻ nhận đệ tử của bạn đang treo ở Lầu Danh Bộ.» |
| `empty.kimlan` | kim lan | «Kim lan cần hai đến năm người bạn đã quen ít nhất bảy ngày.» |
| `empty.lb` | bảng chưa có dữ liệu kỳ này | «Kỳ này mới bắt đầu. Chưa ai có tên trên bảng.» |
| `empty.lb.me` | mình chưa có điểm | «Bạn chưa có điểm kỳ này. Giải một án là có tên.» |
| `empty.fest` | không có lễ hôm nay | «Hôm nay không có lễ. Ngày thường cũng là ngày tu.» |
| `empty.ev` | không có sự kiện máy chủ | «Thế giới đang yên. Đường sá vẫn cần người sửa.» |
| `empty.offline` | mọi bảng xã hội khi ngoại tuyến | «Đang chơi đơn — các bảng này sẽ hiện khi có mạng.» |

---

## 14.6 Câu lỗi theo ngữ cảnh

Ánh xạ mã `err.c` (Phần 11 §11.3.2) sang câu theo nơi xảy ra:

| `c` | Ngữ cảnh | Câu |
|---|---|---|
| `E_RATE` | cụm từ | «Chậm lại một chút nhé.» |
| `E_RATE` | lời mời | «Bạn vừa mời nhiều người. Chờ một lát rồi mời tiếp.» |
| `E_PERM` | nghị sự | «Bạn chưa có quyền mở nghị sự này. Cần {cấp} trở lên.» |
| `E_PERM` | kho | «Việc chi kho do Tri Khố hoặc người giữ đường làm.» |
| `E_PERM` | bỏ phiếu | «Từ Nội Môn trở lên mới bỏ phiếu được.» |
| `E_PERM` | chỉ điểm | «Chỉ thầy của bạn mới gửi được lời này.» |
| `E_AGE` | mọi nơi | «Tính năng này chưa mở cho bạn.» |
| `E_AUTH` | mọi nơi | «Cần liên kết tài khoản để dùng tính năng này. Sổ Mệnh › Tài khoản.» |
| `E_STATE` | lễ | «Lễ chưa bắt đầu.» / «Lễ đã kết thúc.» |
| `E_STATE` | quà | «Đứng gần hơn một chút để trao tay.» |
| `E_STATE` | công trường | «Mang vật liệu từ Khố Phòng tới đây nhé.» |
| `E_STATE` | sự kiện | «Việc này làm ở {phần} của Thiên Mệnh Bàn.» |
| `E_LIMIT` | chi đường | «Đường đã đủ người ở bậc này.» |
| `E_LIMIT` | kho | «Vượt hạn mức hôm nay. Cần nghị sự để chi thêm.» |
| `E_LIMIT` | sự kiện | «Hôm nay bạn đã góp đủ.» |
| `E_BLOCK` | mọi nơi | «Không gửi được.» |
| `E_GONE` | mọi nơi | «Không còn ở đây.» |
| `E_OFF` | mọi nơi | «Tính năng đang tạm đóng.» |
| (mạng) | mọi nơi | «Mất kết nối. Bạn vẫn chơi được — sẽ tự nối lại.» |
| (đóng 4005) | khi kết nối | «Bản game đã cũ. Cập nhật để chơi cùng mọi người.» |
| (đóng 4006) | khi kết nối | «Phần chơi trực tuyến của bạn đang tạm khóa đến {ngày}. Bạn vẫn chơi đơn được. Khiếu nại trong Sổ Mệnh › Hộp thư hệ thống.» |
| (đóng 4007) | khi kết nối | «Phần chơi cùng người khác chưa mở cho lứa tuổi của bạn.» |

---

## 14.7 Bảng Nghị Sự — câu mô tả mười ba mẫu

Mỗi nghị sự hiện thành một câu đầy đủ ghép từ mẫu + tham số, để ai đọc cũng hiểu mà không cần biết mã.

| Mẫu | Câu hiển thị |
|---|---|
| `NS-01` | «{người mở} đề nghị nâng đạo tràng lên bậc {n}. Cần: {vật liệu}, Đạo Vọng hiện có {ĐV}/{ĐV cần}.» |
| `NS-02` | «{người mở} đề nghị xây {công trình} (kiểu {biến thể}).» |
| `NS-03` | «{người mở} đề nghị chi {số} {loại} cho {dự án}.» |
| `NS-04` | «{người mở} đề nghị góp {số} {loại} từ kho cho {dự án công cộng}.» |
| `NS-05` | «{người mở} đề cử {người} làm Trưởng Lão.» |
| `NS-06` | «Chủ Trì đề cử {người} làm Phó Trì.» |
| `NS-07` | «{người mở} đề nghị mời {người} ra khỏi đường. Lý do: {lý do}.» |
| `NS-08` | «{người mở} (cùng {k} người ký) đề nghị bất tín nhiệm Chủ Trì {người}. Lý do: {lý do}.» |
| `NS-09` | «{người mở} đề nghị {giao hảo / thôi giao hảo} với {chi đường}.» |
| `NS-10` | «{người mở} đề nghị đổi lịch đường lễ cố định sang {thứ}, giờ {giờ địa chi}.» |
| `NS-11` | «{người mở} đề nghị đổi điều kiện nhận người: cảnh giới từ {n}, tài khoản từ {d} ngày, {mở / đóng} cửa.» |
| `NS-12` | «{người mở} đề nghị hưu đường. Nếu thông qua, đường đóng sau bảy ngày; kho góp vào Quỹ Cầu Đường.» |
| `NS-13` | «{người mở} đề nghị ghi danh {sự kiện} (cùng {danh sách chi đường}).» |

Dòng phụ dưới mỗi nghị sự:
- «Còn {giờ} giờ. Đã có {số} người bỏ phiếu (cần {túc số} để đủ người).» — **không** hiện thuận/chống khi chưa đóng (phiếu kín).
- Sau khi đóng: «Thuận {y} · Chống {n} · Trắng {b} — {kết quả}.»
- Với người bị nêu tên: «Bạn được gửi một lời trình.» → mở nhóm cụm từ `ns.*`.

---

## 14.8 Sổ Đường — mẫu dòng nhật ký

Mọi hành động quản trị ghi một dòng (Phần 12 §12.3.2 `sect_log`). Mẫu:

| Hành động | Dòng |
|---|---|
| vào đường | «{ngày} · {tên} nhập đường ({cách: được mời / xin vào / cửa mở}).» |
| rời | «{ngày} · {tên} từ đường.» |
| mời ra | «{ngày} · {người làm} mời {tên} ra. Lý do: {lý do}. ({nghị sự nếu có})» |
| lên cấp tự động | «{ngày} · {tên} thành {cấp}.» |
| bổ nhiệm | «{ngày} · {Chủ Trì} giao chức {chức} cho {tên}.» |
| thôi chức | «{ngày} · {tên} thôi chức {chức}.» |
| chi kho | «{ngày} · {người chi} chi {số} {loại} cho {mục đích}. ({nghị sự})» |
| công trường | «{ngày} · mở công trường {công trình}.» / «… {công trình} hoàn thành.» |
| lễ | «{ngày} · {tên lễ}: {n} người dự đủ, chất lượng {q}, hồi hướng {nơi}.» |
| bầu | «{ngày} · {tên} được bầu Chủ Trì mùa {năm can chi} ({y}/{tổng} phiếu).» |
| chuyển giao vắng mặt | «{ngày} · Chủ Trì vắng 21 ngày; {tên} nhận Chủ Trì.» |
| giao hảo | «{ngày} · giao hảo với {chi đường}.» |
| xóa tài khoản | các dòng cũ của người đó hiện «một người tu» |

---

## 14.9 Thông báo kiểm duyệt

Gửi vào **Hộp thư hệ thống** (khác thư người chơi), không hiện toast công khai.

| Bậc | Tiêu đề | Thân |
|---|---|---|
| 1 | «Một lời nhắc» | «Có người thấy khó chịu với {hành vi tóm tắt}. Huyền Quán là nơi yên tĩnh — mong bạn giữ giúp. Không có biện pháp nào khác lần này.» |
| 2 | «Tạm tắt cụm từ và cử chỉ» | «Cụm từ và cử chỉ của bạn tạm tắt đến {giờ}. Lý do: {lý do}. Bạn vẫn chơi bình thường. Nếu bạn cho là nhầm, bấm "Khiếu nại".» |
| 3 | «Tạm khóa lời mời, thư, quà» | «Đến {ngày}, bạn không gửi được lời mời, thư, quà và đơn nhập đường. Lý do: {lý do}. Bấm "Khiếu nại" nếu bạn không đồng ý.» |
| 4 | «Tạm khóa chơi trực tuyến» | «Phần chơi trực tuyến tạm khóa đến {ngày}. Phần chơi đơn và mọi tiến trình của bạn vẫn còn nguyên. Lý do: {lý do}. Bạn có thể khiếu nại.» |
| 5 | «Khóa chơi trực tuyến» | «Phần chơi trực tuyến của tài khoản này đã khóa. Phần chơi đơn vẫn còn. Nếu bạn cho là nhầm, liên hệ hỗ trợ: {địa chỉ hỗ trợ}.» |

Khiếu nại:
- Nút: «Khiếu nại» → chọn lý do: «Tôi không làm việc đó» · «Có hiểu lầm» · «Biện pháp quá nặng» · «Lý do khác» + câu mẫu «Tôi không đồng ý.»
- Đã nhận: «Đã nhận khiếu nại. Một người khác sẽ xem trong ba ngày.»
- Kết quả: «Khiếu nại được chấp nhận — biện pháp đã gỡ. Xin lỗi vì phiền bạn.» / «Chúng tôi đã xem lại và giữ biện pháp. Cảm ơn bạn đã gửi khiếu nại.»

---

## 14.10 Lời nhắc an toàn và nghỉ ngơi

| Khóa | Khi | Ai nói | Câu |
|---|---|---|---|
| `care.break.60` | 60 phút liên tục (nhóm T; người lớn bật được) | Vân Cốc | «Ngồi lâu rồi. Đứng dậy uống nước, nhìn xa một chút.» |
| `care.night` | sau 22:00 (nhóm T) | Lão Tùng | «Khuya rồi. Quán còn đây ngày mai.» |
| `care.night.30` | mỗi 30 phút sau 22:00 (nhóm T) | hệ thống | «Muộn rồi, hẹn bạn ngày mai.» |
| `care.help` | khi nhận cụm `at.10` | hệ thống (chỉ người nhận) | «Nếu bạn đang gặp khó khăn, Sổ Mệnh › Trợ giúp có số đường dây hỗ trợ.» |
| `care.teen.sect` | Chủ Trì người lớn, lần đầu có thành viên T | hệ thống | «Chi đường có thành viên nhỏ tuổi. Hãy giữ mọi sinh hoạt ở nơi chung.» |
| `care.fee` | mở bảng Sư đồ | hệ thống | «Học ở Huyền Giới không mất phí. Ai đòi phí, hãy báo cáo.» |
| `care.trade` | mở giao diện tặng quà | hệ thống | «Quà để tặng, không để đổi. Ai hứa trả gấp đôi là lừa.» |
| `care.offsite` | lần đầu vào MMO và mỗi 30 ngày | hệ thống | «Huyền Quán không bao giờ hỏi mật khẩu hay mời bạn sang ứng dụng khác. Ai làm vậy không phải người của quán.» |
| `care.fortune` | lần đầu thấy quầy Định Mệnh Hội | Thầy Tử Bình | «Không ai bán được mệnh. Ai bán, con hỏi họ đã đổi được mệnh mình chưa.» |

---

## 14.11 Nhãn cho trình đọc màn hình

| Thành phần | Nhãn đọc |
|---|---|
| Chip «👥 N» | «{N} người trong phòng {số phòng}. Chạm để xem danh sách.» |
| Bánh xe giao lưu | «Giao lưu. Tám câu và cử chỉ nhanh. Vuốt lên để mở thư viện.» |
| Bong bóng cụm từ | «{tên} nói: {câu}.» |
| Bong bóng cử chỉ | «{tên} {tên cử chỉ}.» / «{tên} {tên cử chỉ} bạn.» |
| Người chơi khác (chạm vào) | «{tên}{, tên tu}{, tông}. Chạm hai lần để mở thẻ.» |
| Cổng đạo tràng | «Cổng {tên chi đường}, bậc {n}. {Đang mở cửa khách / Đóng cửa khách}.» |
| Vòng sáng lễ | «Chỗ đứng lễ {số}, {trống / có người}.» |
| Nhịp lễ | rung nhẹ theo nhịp (haptics, `haptics.js`) + đọc «nhịp» mỗi 4 nhịp |
| Thanh tiến độ sự kiện | «{tên sự kiện}: {phần trăm} phần trăm. Phần của bạn: {công} công.» |
| Rẻ quạt Thiên Mệnh Bàn | «Sơn {tên sơn}, {phương}, hành {hành}. {Loại sát} — việc cần làm: {việc}.» |
| Bảng Thiên Bảng | mỗi dòng: «Hạng {r}, {tên}, {chỉ số}.» |
| Nghị sự | đọc câu §14.7, rồi «Còn {giờ} giờ. Nút bỏ phiếu: Thuận, Chống, Trắng.» |

Mọi chữ Hán trên giao diện xã hội (tên tông, tên lễ) có nhãn đọc Hán Việt + nghĩa (bản sơ đồ §12 trợ năng).

## 14.12 Checklist nghiệm thu Phần 14

- [ ] Mọi khóa chuỗi trong Phần 14 có trong tệp chuỗi (`strings-social.vi.js` — chưa có, cần làm) và bản EN.
- [ ] Không chuỗi nào dùng từ «bói», «đổi vận», «giải hạn» trên iOS (mở rộng `verify:ios-path` rà chuỗi xã hội).
- [ ] `E_BLOCK` không bao giờ cho biết ai ẩn ai (test so chuỗi hai chiều giống hệt).
- [ ] Hộp thoại có nút khóa thời gian (`dlg.dl.mode.full`, `dlg.account.delete`) đếm đúng.
- [ ] Trình đọc màn hình đọc được mọi thành phần ở §14.11 (kiểm tay VoiceOver).
