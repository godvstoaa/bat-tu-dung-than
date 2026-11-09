# 10 · Phần 06 — Giao tiếp: thư viện cụm từ soạn sẵn và cử chỉ

> Căn cứ: `protocol.js › PHRASES` (8 cụm), `EMOTES` (6 cử chỉ), chú thích «Chat chỉ bằng cụm từ soạn sẵn (giai đoạn đầu — không có UGC tự do, Guideline 1.2)»; `main.js` nút «💬 Giao lưu» (lưới cử chỉ + lưới cụm từ), thẻ người khác (cúi chào · mời trà · vỗ tay · ẩn · báo cáo); `net.js › say(k)`, `emote(e, to)`; bong bóng 3,8 giây.
>
> Mục tiêu: mở rộng lên **≥ 200 cụm từ** theo tình huống và **≥ 40 cử chỉ**, vẫn không có chat tự do.

## 6.0 Nguyên tắc

1. **Không chat tự do.** Không ô nhập chữ ở bất kỳ màn hình xã hội nào. Đây là quyết định thiết kế lâu dài (không chỉ «giai đoạn đầu»): nó giữ an toàn trẻ em, giữ iOS 1.2, và hợp tinh thần quán yên tĩnh.
2. **Giữ khóa cũ.** 8 khóa hiện có (`hi`, `join`, `thanks`, `nice`, `tea`, `learn`, `wait`, `bye`) và 6 cử chỉ (`bow`, `palm`, `clap`, `tea`, `wave`, `think`) giữ nguyên khóa và câu để client cũ vẫn hiểu.
3. **Khóa mới có dạng `nhóm.số`** (vd `chao.3`). Khóa là dữ liệu dùng chung client – máy chủ, như `PHRASES` hiện nay.
4. **Câu ngắn** (≤ 48 ký tự tiếng Việt) để vừa bong bóng.
5. **Không có câu định mệnh luận** («số bạn khổ rồi», «mệnh xấu thì chịu»). Nhóm khích lệ theo trụ cột T2.
6. **Không có câu thô, mỉa mai, khiêu khích, tán tỉnh**, không có câu dùng được để chê lá số người khác.
7. Mỗi câu có bản **tiếng Anh** (cột EN) — dùng cho người chơi chọn giao diện tiếng Anh; người Việt nhận câu tiếng Việt cùng khóa (một khóa — nhiều ngôn ngữ, ai đọc bằng ngôn ngữ của mình).
8. Một số câu có **ô chọn** (slot): `{vung}`, `{gio}`, `{viec}`, `{so}`, `{le}` — giá trị lấy từ danh sách đóng (§6.20). Máy chủ kiểm giá trị (Phần 11).
9. Câu theo **ngữ cảnh**: một số nhóm chỉ hiện ở nơi/lúc thích hợp (cột «Hiện khi»).

---

## 6.1 Chào hỏi (12)

| Khóa | Câu | EN | Hiện khi |
|---|---|---|---|
| `hi` | Chào bạn! | Hello! | mọi lúc |
| `chao.1` | Chào buổi sáng. | Good morning. | giờ Dần → Tỵ |
| `chao.2` | Chào buổi chiều. | Good afternoon. | giờ Ngọ → Thân |
| `chao.3` | Chào buổi tối. | Good evening. | giờ Dậu → Hợi |
| `chao.4` | Khuya rồi, bạn vẫn tu à? | Still practicing this late? | giờ Tý, Sửu |
| `chao.5` | Lâu rồi không gặp! | Long time no see! | — |
| `chao.6` | Bạn mới đến à? Chào mừng. | New here? Welcome. | — |
| `chao.7` | Kính chào đạo hữu. | Greetings, fellow traveler. | — |
| `chao.8` | Chào đồng môn. | Hello, sect-mate. | trong đạo tràng / tông lễ |
| `chao.9` | Chào thầy ạ. | Hello, Master. | người nhận là sư phụ |
| `chao.10` | Chào con. | Hello, my student. | người nhận là đệ tử |
| `bye` | Hẹn gặp lại. | See you again. | mọi lúc |

## 6.2 Cảm ơn, xin lỗi, khen (14)

| Khóa | Câu | EN |
|---|---|---|
| `thanks` | Cảm ơn nhiều. | Thank you so much. |
| `on.1` | Cảm ơn bạn đã chờ. | Thanks for waiting. |
| `on.2` | Cảm ơn bạn chỉ đường. | Thanks for showing the way. |
| `on.3` | Nhờ bạn mà mình hiểu ra. | Thanks to you, I get it now. |
| `on.4` | Cảm ơn đã đi cùng. | Thanks for coming along. |
| `loi.1` | Xin lỗi, mình nhầm. | Sorry, my mistake. |
| `loi.2` | Xin lỗi, mình đến muộn. | Sorry I'm late. |
| `loi.3` | Xin lỗi, mình phải đi gấp. | Sorry, I have to go. |
| `loi.4` | Không sao đâu. | No worries. |
| `nice` | Hay quá! | Wonderful! |
| `khen.1` | Bạn giải hay thật. | Great reading! |
| `khen.2` | Áo đẹp đấy. | Nice outfit. |
| `khen.3` | Bạn kiên trì thật. | You're really persistent. |
| `khen.4` | Ngồi yên được lâu thế, giỏi quá. | You sat so still — impressive. |

## 6.3 Mời, hẹn, chờ (16)

| Khóa | Câu | EN | Slot |
|---|---|---|---|
| `join` | Cùng giải án nhé? | Solve a case together? | — |
| `tea` | Mời bạn chén trà. | Have a cup of tea. | — |
| `wait` | Chờ mình chút. | Wait for me a moment. | — |
| `moi.1` | Đi cùng mình không? | Want to come along? | — |
| `moi.2` | Cùng ngồi thiền nhé? | Meditate together? | — |
| `moi.3` | Cùng đi {vung} không? | Go to {vung} together? | `{vung}` |
| `moi.4` | Cùng làm {viec} nhé? | Do {viec} together? | `{viec}` |
| `moi.5` | Vào chi đường mình không? | Join our hall? | trong đạo tràng hoặc người được mời đủ điều kiện |
| `moi.6` | Hẹn giờ {gio} gặp nhé. | Meet at the hour of {gio}? | `{gio}` |
| `moi.7` | Hẹn gặp ở cổng {vung}. | Meet at the {vung} gate. | `{vung}` |
| `moi.8` | Còn {so} chỗ, ai đi không? | {so} spots left, anyone? | `{so}` 1–9 |
| `moi.9` | Mình đợi ở Trà Thất. | I'll wait at the Tea House. | — |
| `cho.1` | Mình đang đến. | On my way. | — |
| `cho.2` | Mình tới rồi. | I'm here. | — |
| `cho.3` | Đợi thêm một người nữa. | Waiting for one more. | — |
| `cho.4` | Bắt đầu thôi! | Let's begin! | — |

## 6.4 Trả lời nhanh (14)

| Khóa | Câu | EN |
|---|---|---|
| `tl.1` | Được. | Okay. |
| `tl.2` | Đồng ý. | Agreed. |
| `tl.3` | Để mình nghĩ đã. | Let me think. |
| `tl.4` | Lần sau nhé. | Maybe next time. |
| `tl.5` | Mình bận, cảm ơn. | I'm busy, thank you. |
| `tl.6` | Mình chưa hiểu, bạn chỉ lại? | I don't understand, show me again? |
| `tl.7` | Ừ, mình hiểu rồi. | Yes, I understand. |
| `tl.8` | Mình không chắc. | I'm not sure. |
| `tl.9` | Có lẽ đúng. | Probably right. |
| `tl.10` | Mình nghĩ khác một chút. | I see it a bit differently. |
| `tl.11` | Thử lại xem. | Let's try again. |
| `tl.12` | Mình đi trước nhé. | I'll go ahead. |
| `tl.13` | Bạn đi trước đi. | You go first. |
| `tl.14` | Mình ở đây. | I'm over here. |

## 6.5 Giải án hợp tác — theo 6 bước `STEPS` (24)

Hiện khi đang trong nhóm giải án (CaseRoom), theo bước đang giữ (`pillars`, `wx`, `strength`, `yong`, `timing`, `advice` — `protocol.js › STEPS`). Câu bàn bạc **không bao giờ chứa đáp án** (không có câu «Dụng thần là Thủy»): chỉ gợi hướng nghĩ, khớp tinh thần chấm điểm khách quan của `cases.js`.

| Khóa | Bước | Câu | EN |
|---|---|---|---|
| `an.1` | chung | Mình giữ bước này nhé. | I'll take this step. |
| `an.2` | chung | Ai giữ bước tiếp theo? | Who takes the next step? |
| `an.3` | chung | Xong bước của mình rồi. | My step is done. |
| `an.4` | chung | Bước này khó, ai giúp với? | This step is hard, help? |
| `an.5` | `pillars` | Xem lại tiết khí tháng sinh. | Check the solar term of the birth month. |
| `an.6` | `pillars` | Năm tính từ Lập Xuân đấy. | The year starts at Lichun. |
| `an.7` | `pillars` | Tra bảng Ngũ Hổ Độn xem. | Check the Five Tigers table. |
| `an.8` | `pillars` | Giờ sinh ứng với chi nào? | Which branch is the birth hour? |
| `an.9` | `wx` | Đếm cả tàng can nữa. | Count the hidden stems too. |
| `an.10` | `wx` | Hành nào vượng nhất nhỉ? | Which element is strongest? |
| `an.11` | `wx` | Hai hành này gần bằng nhau. | These two are nearly equal. |
| `an.12` | `strength` | Xét đắc lệnh trước. | Check the season first. |
| `an.13` | `strength` | Có đắc địa không? | Is it rooted? |
| `an.14` | `strength` | Nhiều sinh phù hay khắc tiết? | More support or more drain? |
| `an.15` | `yong` | Thân vượng thì cần gì? | If strong, what's needed? |
| `an.16` | `yong` | Xét điều hậu xem: tháng này lạnh hay nóng? | Check climate: cold or hot month? |
| `an.17` | `yong` | Có cần thông quan không? | Is a bridging element needed? |
| `an.18` | `timing` | Năm nào đem hành Dụng tới? | Which year brings the useful element? |
| `an.19` | `timing` | Xem cả đại vận nữa. | Check the luck pillar too. |
| `an.20` | `advice` | Lời khuyên phải hợp Dụng thần. | Advice should match the useful element. |
| `an.21` | `advice` | Thẻ này rơi vào hành Kỵ đấy. | This card falls on the unfavorable element. |
| `an.22` | kết | Đạt điểm cao rồi! | High score! |
| `an.23` | kết | Đọc lời giải của sách đi. | Read the classical explanation. |
| `an.24` | kết | Thêm một án nữa không? | One more case? |

## 6.6 Chỉ điểm — chỉ thầy gửi trò (18)

Chỉ hiện cho người là **sư phụ** của người nhận (Phần 04 §4.1.4). Mỗi án ≤ 3 lần.

| Khóa | Câu |
|---|---|
| `chi.1` | Con nhìn lại tháng sinh. |
| `chi.2` | Đếm lại hành Thổ. |
| `chi.3` | Xét đắc lệnh trước rồi hẵng tính. |
| `chi.4` | Đừng quên tàng can trong chi. |
| `chi.5` | Xem có hợp hóa không. |
| `chi.6` | Có xung nào đáng chú ý không? |
| `chi.7` | Thử nghĩ theo điều hậu. |
| `chi.8` | Con chọn vội quá, đọc lại câu hỏi của khách. |
| `chi.9` | Khách hỏi chuyện gì? Lời khuyên phải trúng chuyện đó. |
| `chi.10` | Mở bảng tra ra, đừng đoán. |
| `chi.11` | Đúng hướng rồi, đi tiếp. |
| `chi.12` | Chậm lại. |
| `chi.13` | Hôm nay đủ rồi, mai làm tiếp. |
| `chi.14` | Ngồi tĩnh mười phút rồi quay lại. |
| `chi.15` | Đọc thêm một trang Trích Thiên Tủy. |
| `chi.16` | Con làm tốt hơn tuần trước. |
| `chi.17` | Sai thì sửa, không sao. |
| `chi.18` | Lần này con tự làm, thầy không gợi nữa. |

## 6.7 Tu luyện, đồng tu, thiền (14)

| Khóa | Câu | EN | Hiện khi |
|---|---|---|---|
| `learn` | Mình đang học Tử Bình. | I'm studying Zi Ping. | — |
| `tu.1` | Mình đang học {viec}. | I'm studying {viec}. | `{viec}` |
| `tu.2` | Ngồi cùng cho yên. | Sit together, it's calmer. | gần bồ đoàn |
| `tu.3` | Thở chậm lại nào. | Let's breathe slower. | đang đồng tu |
| `tu.4` | Vừa Đồng tâm rồi! | We just synced! | đang Đồng tâm |
| `tu.5` | Mình ngồi thêm chút nữa. | I'll sit a little longer. | đang tĩnh tọa |
| `tu.6` | Mình xả thiền đây. | I'm getting up now. | đang tĩnh tọa |
| `tu.7` | Hôm nay tạp niệm nhiều quá. | Lots of wandering thoughts today. | — |
| `tu.8` | Hôm nay ngồi được lâu. | Sat for a long time today. | — |
| `tu.9` | Mình vừa lên cảnh giới mới! | Just reached a new realm! | trong 10 phút sau khi lên cảnh giới |
| `tu.10` | Mình vừa xong một tầng Mệnh Đồ. | Finished a layer of my Fate Map. | sau khi xong tầng |
| `tu.11` | Mình đang giữ giới bảy ngày. | I'm keeping a 7-day vow. | đang có giới tự nguyện |
| `tu.12` | Đi bộ thôi, không bay. | Let's walk, not fly. | — |
| `tu.13` | Từ từ, không ai giục. | Take it easy, no rush. | — |

## 6.8 Hành hương, chỉ đường (14)

| Khóa | Câu | EN | Slot |
|---|---|---|---|
| `duong.1` | Đường lên {vung} lối nào? | Which way to {vung}? | `{vung}` |
| `duong.2` | Đi theo mình. | Follow me. | — |
| `duong.3` | Rẽ trái ở cổng đá. | Turn left at the stone gate. | — |
| `duong.4` | Rẽ phải sau cây cầu. | Turn right after the bridge. | — |
| `duong.5` | Thẳng lên bậc đá. | Straight up the stone steps. | — |
| `duong.6` | Đây là {vung}. | This is {vung}. | `{vung}` |
| `duong.7` | Nghỉ chân một chút. | Let's rest a moment. | — |
| `duong.8` | Còn xa không? | Is it far? | — |
| `duong.9` | Sắp tới rồi. | Almost there. | — |
| `duong.10` | Mình lạc mất rồi. | I'm lost. | — |
| `duong.11` | Đoạn này đường hỏng, cẩn thận. | The road is damaged here. | gần đoạn `EV-CAU` chưa sửa |
| `duong.12` | Đoạn này vừa được sửa xong. | This part was just repaired. | gần đoạn vừa sửa |
| `duong.13` | Lên chùa phải đi bộ đấy. | We walk up to the temple. | vùng `yentu` |
| `duong.14` | Ngắm cảnh đẹp quá. | What a beautiful view. | — |

## 6.9 Môn phái, sinh hoạt chi đường (18)

Hiện khi trong đạo tràng hoặc gần đồng môn.

| Khóa | Câu | EN |
|---|---|---|
| `mp.1` | Hôm nay có lễ, đừng quên nhé. | Rite today, don't forget. |
| `mp.2` | Lễ sắp bắt đầu. | The rite is about to begin. |
| `mp.3` | Ai rảnh vác vật liệu không? | Anyone free to carry materials? |
| `mp.4` | Công trường còn thiếu {so} lượt. | The site needs {so} more trips. |
| `mp.5` | Mình góp vào kho rồi. | I contributed to the storehouse. |
| `mp.6` | Việc tuần sắp xong rồi! | Weekly task nearly done! |
| `mp.7` | Mình nhận việc {viec}. | I'll take {viec}. |
| `mp.8` | Có nghị sự mới, mọi người xem. | New proposal, please review. |
| `mp.9` | Nhớ bỏ phiếu nhé. | Remember to vote. |
| `mp.10` | Chúc mừng đạo tràng lên bậc! | Congrats on the new hall tier! |
| `mp.11` | Chào mừng đồng môn mới. | Welcome, new member. |
| `mp.12` | Có khách ghé, ra đón nào. | Visitors are here, let's greet them. |
| `mp.13` | Mình xin phép vắng tuần này. | I'll be away this week. |
| `mp.14` | Mình về rồi. | I'm back. |
| `mp.15` | Ai cần giúp gì không? | Does anyone need help? |
| `mp.16` | Cảm ơn mọi người đã đến lễ. | Thanks everyone for coming. |
| `mp.17` | Tuần này ai làm Chủ Lễ? | Who leads the rite this week? |
| `mp.18` | Chi đường mình cùng làm Hội Thiện nhé. | Let's join the Good Works festival. |

## 6.10 Nghị sự — lời trình (10)

Chỉ dùng trong Bảng Nghị Sự (Phần 01 §1.7.2), đặc biệt cho người bị nêu tên trong `NS-07`, `NS-08`.

| Khóa | Câu |
|---|---|
| `ns.1` | Tôi xin trình bày: tôi vắng vì việc riêng. |
| `ns.2` | Tôi xin lỗi nếu đã làm mọi người phiền. |
| `ns.3` | Tôi muốn ở lại và sẽ sửa. |
| `ns.4` | Tôi xin tự rời, không cần bỏ phiếu. |
| `ns.5` | Tôi đồng ý với nghị sự này. |
| `ns.6` | Tôi đề nghị bàn thêm trước khi quyết. |
| `ns.7` | Tôi đề nghị chờ người vắng về. |
| `ns.8` | Tôi đã làm theo luật của đường. |
| `ns.9` | Xin mọi người xem lại Sổ Đường. |
| `ns.10` | Cảm ơn mọi người đã cho tôi trình bày. |

## 6.11 Lễ, lễ tuần (12)

| Khóa | Câu | Hiện khi |
|---|---|---|
| `le.1` | Mình đứng vào chỗ rồi. | pha Tụ |
| `le.2` | Còn chỗ cho mình không? | pha Tụ |
| `le.3` | Đi đều bước nhé. | Thái Cực Hội, Bộ cương |
| `le.4` | Giữ nhịp mõ nào. | Vãn Khóa, Liên Đăng |
| `le.5` | Đèn sáng rồi! | Đăng Kiều, Liên Đăng |
| `le.6` | Lễ thành, cảm ơn mọi người. | kết lễ |
| `le.7` | Hồi hướng ra đường sá nhé. | pha Hồi hướng |
| `le.8` | Hồi hướng cho chúng sinh. | pha Hồi hướng |
| `le.9` | Mình làm lễ bù rồi. | — |
| `le.10` | Lễ hôm nay là lễ vượng! | ngày can tỷ hòa hành lễ |
| `le.11` | Chủ Lễ hô đi ạ. | pha Tụ, người nhận là Chủ Lễ |
| `le.12` | Lần đầu mình dự lễ này. | — |

(Không có câu nào trong vùng im lặng — Phần 03 §3.1.5.)

## 6.12 Sự kiện máy chủ (12)

| Khóa | Câu | EN |
|---|---|---|
| `sk.1` | Thiên Mệnh Bàn sắp sửa xong! | The Destiny Compass is almost repaired! |
| `sk.2` | Mình góp một phần rồi. | I've done my part. |
| `sk.3` | Còn thiếu {so} phần nữa. | {so} more parts needed. |
| `sk.4` | Đoạn đường {vung} cần người. | The {vung} road needs hands. |
| `sk.5` | Cùng khiêng đá nhé. | Let's carry stones together. |
| `sk.6` | Đại lễ bắt đầu rồi! | The great rite has begun! |
| `sk.7` | Phòng này đông quá, sang phòng kia. | It's crowded, let's switch rooms. |
| `sk.8` | Tên mình được khắc lên bia rồi! | My name is on the stele! |
| `sk.9` | Cả máy chủ làm được rồi! | The whole server did it! |
| `sk.10` | Cảm ơn mọi người góp sức. | Thanks everyone for helping. |
| `sk.11` | Đi sửa cầu không? | Repair the bridge? |
| `sk.12` | Pha mới mở rồi. | A new phase has opened. |

## 6.13 Lễ tiết (30)

Mỗi câu chỉ hiện trong **cửa sổ lễ** tương ứng (Phần 09–10).

| Khóa | Câu | Lễ (mã) |
|---|---|---|
| `tet.1` | Chúc mừng năm mới! | `EV-TET-01` |
| `tet.2` | An khang thịnh vượng. | `EV-TET-01` |
| `tet.3` | Vạn sự như ý. | `EV-TET-01` |
| `tet.4` | Năm mới tu tiến nhé. | `EV-TET-01` |
| `tet.5` | Lì xì lấy may đây! | `EV-TET-01` |
| `tet.6` | Mình xông đất đường bạn nhé. | `EV-TET-01` |
| `tet.7` | Cảm ơn bao lì xì. | `EV-TET-01` |
| `tet.8` | Tiễn ông Táo về trời. | `EV-TAOQUAN-01` |
| `tet.9` | Năm mới, Thái Tuế mới. | `EV-LAPXUAN-01` |
| `le2.1` | Rằm tháng Giêng an lành. | `EV-THUONGNGUYEN-01` |
| `le2.2` | Thanh Minh nhớ người xưa. | `EV-THANHMINH-01` |
| `le2.3` | Ăn bánh trôi không? | `EV-HANTHUC-01` |
| `le2.4` | Mừng ngày Phật đản. | `EV-PHATDAN-01` |
| `le2.5` | Tết Đoan Ngọ, diệt sâu bọ! | `EV-DOANNGO-01` |
| `le2.6` | Đi hái lá giờ Ngọ không? | `EV-DOANNGO-01` |
| `le2.7` | Ngưu Lang Chức Nữ gặp nhau rồi. | `EV-THATTICH-01` |
| `le2.8` | Mùa Vu Lan, nhớ ơn cha mẹ. | `EV-VULAN-01` |
| `le2.9` | Thả đèn hoa đăng nhé. | `EV-VULAN-01`, `EV-HANGUYEN-01` |
| `le2.10` | Trung Thu vui vẻ! | `EV-TRUNGTHU-01` |
| `le2.11` | Rước đèn đi! | `EV-TRUNGTHU-01` |
| `le2.12` | Phá cỗ thôi! | `EV-TRUNGTHU-01` |
| `le2.13` | Trùng Cửu lên cao ngắm cúc. | `EV-TRUNGCUU-01` |
| `le2.14` | Cơm mới thơm quá. | `EV-TRUNGTHAP-01` |
| `le2.15` | Đông chí rồi, ngày sẽ dài ra. | `EV-DONGCHI-01` |
| `le2.16` | Tô thêm một cánh mai. | `EV-DONGCHI-01` (Cửu Cửu Tiêu Hàn) |
| `le2.17` | Mừng ngày nhà giáo, cảm ơn thầy. | `EV-NHAGIAO-01` |
| `le2.18` | Chúc mừng ngày khai hội. | `EV-YENTU-01` |
| `le2.19` | Kim lan tái kết, nghĩa còn nguyên. | `EV-NGHIA-01` |
| `le2.20` | Mùng một đầu tháng, chúc an lành. | `EV-SOCVONG-01` |
| `le2.21` | Rằm này lên chùa không? | `EV-SOCVONG-01` |

## 6.14 Khích lệ, an ủi — theo trụ cột T2 (16)

| Khóa | Câu | EN |
|---|---|---|
| `kl.1` | Mệnh do ta tạo. | We shape our own fate. |
| `kl.2` | Từ từ thôi, không ai giục. | Slowly, no one is rushing you. |
| `kl.3` | Sai thì sửa, có sao đâu. | Mistakes can be fixed. |
| `kl.4` | Bạn tiến bộ nhiều rồi đấy. | You've improved a lot. |
| `kl.5` | Lá số chỉ là điểm xuất phát. | A chart is only a starting point. |
| `kl.6` | Ai cũng bắt đầu từ bậc một. | Everyone starts at step one. |
| `kl.7` | Hôm nay chưa được thì mai. | If not today, then tomorrow. |
| `kl.8` | Mình cũng từng vướng chỗ đó. | I got stuck there too. |
| `kl.9` | Đi cùng nhau thì không mệt. | Together it's less tiring. |
| `kl.10` | Cố lên! | Keep going! |
| `kl.11` | Nghỉ chút rồi làm tiếp. | Rest a bit, then continue. |
| `kl.12` | Bạn làm tốt lắm. | You did great. |
| `kl.13` | Đừng so với ai, so với hôm qua. | Compare with yesterday, not others. |
| `kl.14` | Tích thiện từng việc nhỏ. | Do good, one small deed at a time. |
| `kl.15` | Quay đầu là bờ. | It's never too late to turn back. |
| `kl.16` | Mình tin bạn làm được. | I believe you can do it. |

## 6.15 Kim lan, đạo hữu (10)

| Khóa | Câu | Hiện khi |
|---|---|---|
| `dh.1` | Kết đạo hữu nhé? | người kia chưa là đạo hữu |
| `dh.2` | Vui được làm quen. | — |
| `dh.3` | Hôm nay đi đâu đấy? | người nhận là đạo hữu |
| `dh.4` | Nhớ bạn đấy! | người nhận là đạo hữu |
| `kl2.1` | Huynh đệ ơi, đi làm nghĩa cử không? | nhóm kim lan |
| `kl2.2` | Có việc gì cứ gọi. | nhóm kim lan |
| `kl2.3` | Ai vấp thì người khác đỡ. | nhóm kim lan |
| `kl2.4` | Đủ mặt rồi, bắt đầu thôi. | nhóm kim lan |
| `kl2.5` | Chúc mừng {nguoi}! | nhóm kim lan; `{nguoi}` = thành viên |
| `kl2.6` | Kim lan mình vẫn đủ người. | nhóm kim lan |

## 6.16 Đạo lữ — chỉ nhóm tuổi A (8)

| Khóa | Câu |
|---|---|
| `dl.1` | Đi dạo cùng không? |
| `dl.2` | Ngắm trăng nhé. |
| `dl.3` | Về nhà thôi. |
| `dl.4` | Hôm nay vui chứ? |
| `dl.5` | Cảm ơn vì đã ở đây. |
| `dl.6` | Đi chậm, đi cùng. |
| `dl.7` | Chọn ngày lành rồi đấy. |
| `dl.8` | Chúc mừng hai bạn! (khách dự lễ) |

## 6.17 An toàn và ranh giới (12)

Luôn có trong lưới cụm từ (không ẩn theo ngữ cảnh). Gửi câu nhóm này **không** bao giờ bị trần tốc độ chặn.

| Khóa | Câu | EN |
|---|---|---|
| `at.1` | Mình không chia sẻ thông tin cá nhân. | I don't share personal info. |
| `at.2` | Mình không thích, xin dừng lại. | I don't like that, please stop. |
| `at.3` | Đừng đi theo mình nữa. | Please stop following me. |
| `at.4` | Mình không đổi chác gì cả. | I don't trade anything. |
| `at.5` | Ở đây không mất phí gì đâu. | Nothing here costs money. |
| `at.6` | Đừng nghe ai bán «đổi mệnh». | Don't trust anyone selling "fate changes". |
| `at.7` | Mình không ra ngoài game nói chuyện. | I don't chat outside the game. |
| `at.8` | Mình sẽ báo cáo nếu bạn tiếp tục. | I'll report if you continue. |
| `at.9` | Bạn ổn không? | Are you okay? |
| `at.10` | Nếu buồn quá, hãy nói với người thân. | If you're very sad, talk to someone close. |
| `at.11` | Mình cần nghỉ một chút. | I need a break. |
| `at.12` | Mình chỉ muốn chơi yên lặng. | I just want to play quietly. |

Câu `at.10` khi được gửi tới một người sẽ **kèm** (ở máy người nhận) một dòng nhỏ: «Nếu bạn đang gặp khó khăn, Sổ Mệnh › Trợ giúp có số đường dây hỗ trợ.» (đường dây theo quốc gia — cấu hình).

## 6.18 Tiêu đề thư (12)

Dùng cho thư mẫu (Phần 04 §4.6.3). Thân thư ghép 1–3 câu bất kỳ trong các nhóm §6.1–6.17 (trừ `chi.*` nếu không phải thầy, `dl.*` nếu không phải nhóm A).

| Khóa | Tiêu đề |
|---|---|
| `thu.1` | Thư hỏi thăm |
| `thu.2` | Hẹn đi hành hương |
| `thu.3` | Hẹn giải án |
| `thu.4` | Mời dự lễ |
| `thu.5` | Cảm ơn |
| `thu.6` | Chúc mừng |
| `thu.7` | Xin lỗi |
| `thu.8` | Quà nhỏ gửi bạn |
| `thu.9` | Thư thầy gửi trò |
| `thu.10` | Thư trò gửi thầy |
| `thu.11` | Thư chi đường |
| `thu.12` | Chúc lễ tiết |

## 6.19 Cảm xúc ngắn (10)

| Khóa | Câu | EN |
|---|---|---|
| `cx.1` | Vui quá! | So happy! |
| `cx.2` | Tiếc quá. | What a pity. |
| `cx.3` | Ồ! | Oh! |
| `cx.4` | Hơi mệt rồi. | A bit tired. |
| `cx.5` | Thú vị thật. | How interesting. |
| `cx.6` | Mình thấy bình yên. | I feel at peace. |
| `cx.7` | Hồi hộp quá. | So nervous. |
| `cx.8` | Hà hà. | Haha. |
| `cx.9` | Đẹp ghê. | So pretty. |
| `cx.10` | Ngon quá (chén trà này). | Delicious (this tea). |

## 6.20 Giá trị ô chọn (slot)

| Slot | Giá trị (danh sách đóng) |
|---|---|
| `{vung}` | 20 vùng canon: `thanh`, `tubinh`, `manh`, `trichthien`, `cungthong`, `thulau`, `phongthuy`, `lichduong`, `longho`, `vodang`, `chungnam`, `maoshan`, `yentu`, `buttap`, `tangdia`*, `vanmieu`, `phongdo`*, `mieucuong`, `conlon`*, `vancoc` (* chỉ hiện nếu người gửi đã mở vùng) |
| `{gio}` | 12 giờ địa chi: Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi (kèm giờ dương lịch trong bong bóng: «giờ Tuất (19–21h)») |
| `{viec}` | 16: giải án, Án Cổ, Tử Bình, Tử Vi, phong thủy, trạch nhật, hợp hôn, khoa cử, kết phù, tĩnh tọa, hành hương, hái thuốc, phóng sinh, sửa đường, việc tuần, lễ tuần |
| `{so}` | 1–9 |
| `{nguoi}` | id người chơi trong cùng phòng/nhóm; máy chủ thay bằng tên hiển thị của người đó lúc phát |
| `{le}` | mã lễ đang trong cửa sổ (Phần 09–10) |

**Số câu khả dĩ** nhờ slot: ví dụ `moi.3` × 20 vùng + `moi.4` × 16 việc + `moi.6` × 12 giờ… → hơn 300 biến thể từ 268 khóa.

## 6.21 Tổng số cụm từ

| Nhóm | Số khóa |
|---|---|
| §6.1 Chào hỏi | 12 |
| §6.2 Cảm ơn, xin lỗi, khen | 14 |
| §6.3 Mời, hẹn, chờ | 16 |
| §6.4 Trả lời nhanh | 14 |
| §6.5 Giải án hợp tác | 24 |
| §6.6 Chỉ điểm | 18 |
| §6.7 Tu luyện | 14 |
| §6.8 Hành hương | 14 |
| §6.9 Môn phái | 18 |
| §6.10 Nghị sự | 10 |
| §6.11 Lễ | 12 |
| §6.12 Sự kiện máy chủ | 12 |
| §6.13 Lễ tiết | 30 |
| §6.14 Khích lệ | 16 |
| §6.15 Kim lan, đạo hữu | 10 |
| §6.16 Đạo lữ | 8 |
| §6.17 An toàn | 12 |
| §6.18 Tiêu đề thư | 12 |
| §6.19 Cảm xúc | 10 |
| **Tổng** | **276** |

*(§6.7 có 13 khóa mới + `learn`; §6.13 đếm 9 `tet.*` + 21 `le2.*`.)*

---

## 6.22 Cử chỉ (46)

### 6.22.1 Sáu cử chỉ đã có (giữ nguyên khóa)

| Khóa | Icon | Tên | Có đích | Nơi dùng | Hoạt ảnh |
|---|---|---|---|---|---|
| `bow` | 🙇 | cúi chào | có | mọi nơi | cúi người 30°, giữ 1 giây |
| `palm` | 🙏 | chắp tay | có | mọi nơi, **kể cả vùng im lặng** | chắp tay trước ngực, cúi đầu nhẹ |
| `clap` | 👏 | vỗ tay | có | ngoài vùng im lặng | vỗ tay 3 lần |
| `tea` | 🍵 | mời trà | có | mọi nơi trừ vùng im lặng | rót trà, đưa chén về phía người nhận |
| `wave` | 👋 | vẫy tay | có | ngoài vùng im lặng | vẫy tay phải |
| `think` | 🤔 | suy ngẫm | không | mọi nơi trừ vùng im lặng | tay chống cằm |

### 6.22.2 Bốn mươi cử chỉ mới

**Lễ nghi (10)** — dùng trong không gian lễ có hạn chế để tránh biến nghi lễ thành trò đùa:

| Khóa | Icon | Tên | Có đích | Nơi dùng | Mở | Hoạt ảnh / ghi chú |
|---|---|---|---|---|---|---|
| `vai` | 🙇‍♂️ | vái | có | mọi nơi | mặc định | chắp tay vái ba lần (lễ chào trang trọng kiểu xưa) |
| `ap` | 🤲 | ấp tay (bão quyền) | có | mọi nơi | mặc định | tay trái ôm nắm tay phải trước ngực — lễ chào đạo môn |
| `incense` | 🕯️ | dâng hương | không | **chỉ trong điện / chính đường / lễ** | mặc định | cầm nén hương nâng ngang trán rồi cắm vào lư (Phần 01 §1.3.3) |
| `lay` | 🛐 | lạy | không | **chỉ trước hương án trong điện, ngoài giờ vùng im lặng hoặc trong pha lễ** | mặc định | quỳ, cúi đầu chạm chiếu một lần; không dùng có đích tới người chơi |
| `dang_tra` | 🫖 | dâng trà | có | mọi nơi | mặc định | hai tay nâng chén; dùng trong bái sư (Phần 04 §4.1.3) |
| `tung` | 📿 | lần tràng hạt | không | mọi nơi | tông TD/TH/MT hoặc dự 1 lễ Phật giáo | ngồi lần hạt; trong vùng im lặng được phép |
| `kinh_hanh` | 🚶 | kinh hành | không | trong Thiền Am / thiền đường | tông TH | đi chậm chắp tay (tư thế, không phải lệnh di chuyển) |
| `phat_tran` | 🪶 | vung phất trần | không | ngoài vùng im lặng | có món `phat_tran` (Tàng Y Các) | vung nhẹ sang trái |
| `cam_kinh` | 📜 | nâng kinh | không | mọi nơi | mặc định | nâng sách ngang trán |
| `hoi_huong` | 🌸 | hồi hướng | không | trong lễ pha Hồi hướng | mặc định | mở hai bàn tay ngửa, ánh sáng nhẹ tỏa ra |

**Giao tiếp (10):**

| Khóa | Icon | Tên | Có đích | Hoạt ảnh |
|---|---|---|---|---|
| `nod` | 🙂 | gật đầu | có | gật hai lần |
| `shake` | 🙃 | lắc đầu | có | lắc nhẹ |
| `point` | 👉 | chỉ đường | có (hướng) | chỉ tay về hướng nhìn; nếu có đích → về phía người đó |
| `beckon` | 🫴 | vẫy lại đây | có | ngoắc tay |
| `smile` | 😊 | mỉm cười | có | biểu cảm |
| `laugh` | 😄 | cười | không | cười nghiêng người |
| `shrug` | 🤷 | nhún vai | không | — |
| `wait_hand` | ✋ | ra hiệu chờ | có | giơ bàn tay |
| `listen` | 👂 | lắng nghe | có | nghiêng đầu, tay khum tai |
| `gift` | 🎁 | trao quà | có (bắt buộc) | trao tay — đi kèm hành động tặng quà thật (Phần 05 §5.1.3), không dùng riêng |

**Sinh hoạt văn tu (10):**

| Khóa | Icon | Tên | Mở | Hoạt ảnh |
|---|---|---|---|---|
| `doc_sach` | 📖 | đọc sách | mặc định | ngồi đọc |
| `viet_chu` | 🖌️ | viết chữ | mặc định | viết thư pháp trên giấy bày dưới đất (chữ hư cấu) |
| `pha_tra` | 🍵 | pha trà | mặc định | ngồi pha ấm trà |
| `thoi_sao` | 🎶 | thổi sáo | dự 1 lễ ở Yên Tử | thổi sáo trúc (âm thanh ngắn) |
| `gay_dan` | 🎼 | gảy đàn | dự 1 lễ ở Võ Đang | gảy cổ cầm |
| `ngam_trang` | 🌕 | ngắm trăng | mặc định | ngửa đầu nhìn trời (ban đêm thấy trăng thật theo pha âm lịch) |
| `quat` | 🪭 | phe phẩy quạt | có món quạt (`quat_giay`, `quat_long`) | — |
| `la_ban` | 🧭 | xem la bàn | có món `la_ban_tay` | cầm la bàn xoay hướng |
| `ngoi_xep` | 🧘 | ngồi xếp bằng | mặc định | ngồi kiết già **tư thế nghỉ** (không phải tĩnh tọa — không tính Đạo Hạnh) |
| `vuon_vai` | 🙆 | vươn vai | mặc định | duỗi người (gợi ý nghỉ ngơi) |

**Lễ tiết (10)** — chỉ dùng trong cửa sổ lễ:

| Khóa | Icon | Tên | Lễ | Hoạt ảnh |
|---|---|---|---|---|
| `chuc_tet` | 🧧 | chúc Tết | `EV-TET-01` | vái chúc, đưa bao đỏ (nếu có Lộc Xuân thì là hành động tặng) |
| `phao_giay` | 🎉 | pháo giấy | `EV-TET-01`, khánh thành | tung pháo giấy đỏ (không phải pháo nổ) |
| `ruoc_den` | 🏮 | rước đèn | `EV-TRUNGTHU-01`, `EV-THUONGNGUYEN-01` | cầm đèn ông sao đi vòng |
| `mua_lan` | 🦁 | múa lân | `EV-TRUNGTHU-01`, `EV-TET-01` | cử chỉ **nhóm**: cần 2 người cùng bấm trong 3 giây (đầu lân + đuôi lân) |
| `tha_den` | 🪷 | thả đèn hoa đăng | `EV-VULAN-01`, `EV-HANGUYEN-01` | cúi thả đèn xuống nước (chỉ khi đứng mép nước) |
| `banh_trung_thu` | 🥮 | mời bánh | `EV-TRUNGTHU-01` | đưa bánh (là hành động tặng nếu có bánh) |
| `ngam_cuc` | 🌼 | ngắm hoa cúc | `EV-TRUNGCUU-01` | cúi ngửi hoa |
| `dang_cao` | ⛰️ | lên cao nhìn xa | `EV-TRUNGCUU-01` | tay che mắt nhìn xa (chỉ ở đỉnh núi) |
| `hai_la` | 🌿 | hái lá giờ Ngọ | `EV-DOANNGO-01` | cúi hái lá (chỉ giờ Ngọ) |
| `cai_hoa` | 🌹 | cài hoa lên áo | `EV-VULAN-01` | **riêng tư**: người chơi chọn hoa đỏ hoặc trắng; **người khác chỉ thấy một bông hoa màu hồng nhạt chung** (không lộ việc cha mẹ còn hay mất) |

### 6.22.3 Cử chỉ không làm (và vì sao)

| Không làm | Lý do |
|---|---|
| Ôm, hôn, nắm tay, xoa đầu nhắm tới người khác | tiếp xúc thân thể có đích là kênh quấy rối; không phù hợp trẻ em |
| Ấn quyết (mudra) cụ thể của Phật giáo, ấn quyết đạo môn thật | nghi lễ có ý nghĩa tôn giáo, không làm trò |
| Chế giễu (lè lưỡi, chỉ trỏ cười, quay lưng lắc mông) | phá không khí quán, công cụ bắt nạt |
| Ngồi lên bàn thờ, đứng trên hương án | bất kính — va chạm đã chặn; hoạt ảnh ngồi chỉ đặt được trên mặt đất / bồ đoàn |
| Cử chỉ «xem bói» cho người khác (cầm tay xem chỉ tay) | game không bói cho người chơi khác; iOS 4.3(b) |

### 6.22.4 Tổng cử chỉ

6 có sẵn + 40 mới = **46**.

---

## 6.23 Giao diện giao tiếp

### 6.23.1 Bánh xe nhanh

- Nút «💬 Giao lưu» (đã có) mở **bánh xe 8 ô** thay vì lưới dài. 8 ô mặc định: `hi`, `thanks`, `tea` (cử chỉ), `bow` (cử chỉ), `join`, `wait`, `nice`, `bye` — đúng 8 cụm cũ để người quen không lạc.
- Người chơi **tùy chỉnh** 8 ô (kéo câu/cử chỉ từ thư viện vào).
- Ô thứ 9 ở giữa: **«Gợi ý»** — 4 câu hợp ngữ cảnh lúc đó (đang ở bước án nào, đang trong lễ, đang có sự kiện, cửa sổ lễ tiết).
- Vuốt lên từ bánh xe: mở **thư viện đầy đủ** theo nhóm, có ô tìm (tìm trong danh sách, không phải nhập câu gửi đi).

### 6.23.2 Hiển thị

- Bong bóng trên đầu 3,8 giây (như `net.js › bubble`), tối đa 2 dòng.
- Câu có slot: phần slot in nghiêng (vd «Cùng đi *Võ Đang* không?»).
- **Nhật ký giao lưu** (mở được từ chip «👥 N»): 50 câu gần nhất trong phòng, có tên người nói; câu của người mình đã ẩn không hiện.
- Trình đọc màn hình đọc: «{tên} nói: {câu}» / «{tên} {tên cử chỉ} bạn».

### 6.23.3 Trần tốc độ (máy chủ kiểm, Phần 11)

| Loại | Trần |
|---|---|
| `say` | 10 / phút / người; trùng khóa liên tiếp > 3 lần / 30 giây → không phát lại |
| `emo` không đích | 12 / phút |
| `emo` có đích | 6 / phút; cùng một người nhận ≤ 3 / phút |
| Nhóm `at.*` | không trần |
| Trong vùng im lặng | chỉ `palm`, `tung`, `hoi_huong` (khi đúng pha) |

### 6.23.4 Quy trình biên tập thư viện

1. Câu mới do biên tập viên đề xuất trong tệp dữ liệu (`phrases.js` — **(chưa có — cần làm)**; tách khỏi `protocol.js` để `protocol.js` chỉ import).
2. Duyệt 3 vòng: (a) chính tả, độ dài; (b) văn hóa – tôn giáo (cố vấn tông liên quan nếu là câu lễ); (c) an toàn: thử «có thể dùng để chọc ghẹo / quấy rối / chê lá số không?».
3. Mỗi bản phát hành: kiểm tự động — mọi khóa có VI + EN; độ dài ≤ 48; không trùng câu; khóa cũ còn nguyên.
4. **Không xóa khóa** đã phát hành (client cũ còn dùng); câu không phù hợp nữa thì đánh dấu `retired` — máy chủ vẫn nhận, client mới không hiện trong thư viện.

### 6.23.5 Tương thích ngược

- Client cũ chỉ biết 8 khóa: khi nhận `say` với khóa lạ, `net.js` hiện tại **bỏ qua** (`if (!text) break;`). Để client cũ không «mất» câu, máy chủ phát kèm trường `tx` (câu tiếng Việt đã ghép slot) cho gói `say` có khóa mới; client cũ vẫn bỏ qua (an toàn), client mới dùng khóa để dịch. Phần 11 §11.4.
- Client mới gửi khóa mới tới máy chủ cũ: `parseClient` cũ trả `null` (bỏ qua) — không lỗi, chỉ không phát.

## 6.24 Checklist nghiệm thu Phần 06

- [ ] `phrases.js` có ≥ 276 khóa, mỗi khóa VI + EN, ≤ 48 ký tự; 8 khóa cũ y nguyên.
- [ ] Không câu nào chứa đáp án án (rà nhóm `an.*`, `chi.*`: không có tên hành / can chi cụ thể làm đáp án).
- [ ] Slot: máy chủ từ chối giá trị ngoài danh sách; `{vung}` chưa mở bị từ chối.
- [ ] 46 cử chỉ; `lay`, `incense` chỉ dùng được ở nơi quy định (test vị trí).
- [ ] `cai_hoa`: người khác chỉ thấy hoa hồng nhạt (test gói không chứa lựa chọn đỏ/trắng).
- [ ] `mua_lan` cần đúng 2 người bấm trong 3 giây.
- [ ] Vùng im lặng: máy chủ chặn đúng; nhóm `at.*` không bị trần.
- [ ] Bánh xe 8 ô mặc định đúng 8 cụm cũ; gợi ý ngữ cảnh đúng bước án.
