# 08 · NPC procedural: story generator sinh chuyện riêng từ seed

> **Tóm tắt mục.** Huyền Quán mỗi ngày sinh **11 khách NPC cho mỗi người chơi** bằng hạt giống «ngày + khe + pid», nhưng khách hôm nay chỉ nói một câu hỏi in sẵn và một câu cảm ơn chung cho mọi người. Mục này đặc tả `makeStory(seed, R, slot, pid)` — một module node **thuần, không DOM, không mạng** (khuôn `gu-gongan.js`), biến dữ kiện có thật của lá số khách thành ba câu chuyện riêng: câu mở đầu, câu hỏi, câu cảm ơn. Story là **hàm thuần của seed**: cùng máy ra cùng khách, cùng chuyện; AI tắt vẫn chạy trọn. Ba phần bổ sung là đề xuất mới, chưa code: bảng hoàn cảnh × sảnh, câu «vì sao» đo từ R, và bộ nhớ liên ngày tắt mặc định. Bằng chứng khoảng trống của sảnh Cách Cục là chủ sở hữu của **mục 09** — chỗ này chỉ trỏ; ranh giới riêng tư trong phòng MMO trỏ về **mục 13**; đường offline và cache service worker trỏ về **mục 12**; khung kiểm thử chung nằm ở **mục 16**.

---

## 8.0 Vị trí của mục này trong bộ thiết kế

Bộ thiết kế NPC-AI đã có bản đồ chuỗi AI (mục 02–03) và ranh giới MMO (mục 13). Mục này đặt gạch cho tầng thấp nhất của NPC-AI: **khách procedural** — những người đến quán mỗi ngày nhờ xem lá số. Đây là tầng chạy được cả khi AI tắt, cả khi mất mạng, và là nơi câu chuyện «riêng cho từng người chơi» bắt đầu. Mọi thứ trong mục này bám đúng luật đợt đã chốt ở GAME-THIET-KE-CHOT: `state.js`, `stations.js`, `ai.js`, `master-ui.js` đang khóa, nội dung mới đặt trong module thuần có test node theo khuôn `gu-gongan.js` / `namhan.js` / `kinh-tu.js` — nghĩa là mục này **đặc tả module mới**, không sửa trạm, không thêm trạm.

Câu hỏi mà mục này trả lời: hạt giống đã bảo đảm «mỗi người mỗi ngày một bộ khách khác nhau» (`src/game/main.js:49` ghi đúng ý đó: «Khách hỏi việc hôm nay: hạt giống = ngày · khe · người chơi → mỗi người một bộ khách riêng») — nhưng **khách ấy kể được chuyện gì**? Hôm nay câu trả lời gần như là «không»: khách có lá số thật trong tay mà miệng chỉ nói câu in sẵn. Story generator là cách biến lá số ấy thành ba câu nói, mà vẫn giữ hai tính chất bất di: dữ kiện trước giọng sau, và cùng seed ra cùng chuyện.

## 8.1 Hiện trạng — 11 khách/người chơi/ngày, hạt giống ngày + khe + pid

### 8.1.1 Bộ 11 khách mỗi ngày

Đếm đúng trên code đang chạy, mỗi ngày mỗi người chơi nhận **11 khách procedural**:

| # | Nhóm khách | Số lượng | Nơi dựng | Hạt giống |
|---|---|---|---|---|
| 1 | Sân «Khách hỏi việc» (an0, an1, an2) | 3 khách chờ | `todayNpc` (`src/game/main.js:51-60`) | `` `${d}:${i}:${pid}` `` (an `i` = 0, 1, 2 — `src/game/main.js:56`) |
| 2 | Sảnh Điều Hậu | 1 khách | `buildDieuHau` (`src/game/halls.js:51-90`) | `dh:` + key (`src/game/halls.js:54,58`) |
| 3 | Sảnh Tử Vi | 1 khách | `buildTuVi` (`src/game/halls.js:182-205`) | `zw:` + key (`src/game/halls.js:184`) |
| 4 | Sảnh Tượng Pháp | 1 khách | `buildTuongPhap` (`src/game/halls.js:210-233`) | `mp:` + key (`src/game/halls.js:212`) |
| 5 | Sảnh Cách Cục | 1 khách | `buildCachCuc` (`src/game/halls.js:241-265`) | `cc:` + key + `:${i}` (`src/game/halls.js:245`) |
| 6 | Cặp Hợp Hôn (án chung) | 2 khách (A + B) | `buildHopHon` (`src/game/halls.js:144-176`) | `` `hh:${dayKey}:a` `` và `` `hh:${dayKey}:b` `` (`src/game/halls.js:147-148`) |
| 7 | Sảnh Trạch Nhật | 1 khách | `buildZheriCase` (`src/game/zheri-case.js:39-44`) | `` `zheri:${key}` `` (`src/game/zheri-case.js:40`) |
| 8 | Sảnh Dương Trạch | 1 khách | `buildDzCase` (`src/game/dz-case.js:55-59`) | `` `dz:${key}` `` (`src/game/dz-case.js:56`) |

Tổng: 3 + 1 + 1 + 1 + 1 + 2 + 1 + 1 = **11**. Đó là con số nêu ở tóm tắt mục. Khác 11 khách này, Thư Viện là sảnh **duy nhất không có khách**: `buildThuVien` trả `{ id: 'thuvien', npc: null, ... }` (`src/game/halls.js:119`) — tầng thư chỉ đưa câu cổ cho người chơi đọc, không có người nhờ giải.

### 8.1.2 Hạt giống: ngày + khe + pid

Hạt giống có ba thành phần, và mỗi thành phần đóng một vai riêng:

- **Ngày** (`d` — `S.todayStr()`): khách đổi theo ngày. Mai là bộ khách mới, án mới (`src/game/stations.js:676` in đúng câu «Mai sẽ có khách mới»).
- **Khe** (`i` hoặc mã sảnh `dh`/`zw`/`mp`/`cc`/`hh`/`zheri`/`dz`): ba khe sân cho ba khách khác nhau cùng một ngày.
- **Pid**: định danh người chơi đọc từ `localStorage 'huyenquan:pid'`, fallback `'local'` khi không đọc được (`src/game/main.js:55`, `src/game/stations.js:672`, `src/game/stations.js:691`; hằng `PID_KEY = 'huyenquan:pid'` ở `src/game/net.js:8`). Cùng một máy — cùng pid — thì cùng khách.

Bốn đường ghép hạt giống hiện có, mỗi đường một khuôn:

1. Sân: `` makeNpc(`${d}:${i}:${pid}`) `` — `src/game/main.js:56`.
2. Sảnh bàn (Trạch Nhật, Dương Trạch): `` const key = `${S.todayStr(new Date())}:${pid}` `` — `src/game/stations.js:673`, rồi `buildZheriCase`/`buildDzCase` tự thêm tiền tố `zheri:`/`dz:` (`src/game/zheri-case.js:40`, `src/game/dz-case.js:56`).
3. Sảnh khai báo (Điều Hậu, Tử Vi, Tượng Pháp, Cách Cục): `openHall` trả key `` shared ? day : `${day}:${pid}` `` — `src/game/stations.js:693`. Riêng **Hợp Hôn chạy `shared`**: key chỉ là ngày, nên **mọi người chơi trong cùng một ngày nhận cùng một cặp** — đúng như dòng chú thích «Hợp Hôn = án chung: khoá theo ngày (cả quán cùng một cặp)» (`src/game/stations.js:687`). Cặp A/B sinh riêng từ `` `hh:${dayKey}:a` ``/`` `hh:${dayKey}:b` `` (`src/game/halls.js:147-148`).
4. Mỗi builder lại tự thêm vòng hạt nhỏ: Điều Hậu thử `dh:${key}:${i}` với `i ≤ 12` (`src/game/halls.js:57-60`), Cách Cục thử `cc:${key}:${i}` với `i ≤ 20` (`src/game/halls.js:244-247`) — chi tiết vòng lọc này nói ở §8.2.1.

Cơ chế quyết định tính lặp-lại-được nằm trọn trong `src/game/npc.js:5-13`: `hashSeed` là FNV-1a 32 bit (`src/game/npc.js:5-9`), `rng` là PRNG mulberry32 có hạt (`src/game/npc.js:10-13`). Hàm `makeNpc(key, year)` (`src/game/npc.js:41`) rút toàn bộ khách — giới, năm sinh, tháng, ngày, giờ, phút, tên, danh xưng, nghề, câu hỏi, màu áo — **từ một chuỗi hạt duy nhất** (`src/game/npc.js:43-58`). Không có nguồn ngẫu nhiên nào khác: không `Math.random()`, không `Date.now()` bên trong. Đó là nền móng để story generator kế thừa.

### 8.1.3 Bảy mẫu câu hỏi, ba mức cảm ơn chung

Kho lời của khách hôm nay mỏng đến mức đếm được:

- **Câu hỏi: 7 mẫu gốc** trong bảng `QUESTIONS` (`src/game/npc.js:23-31`), mỗi mẫu gắn một chủ đề (`career`/`wealth`/`love`/`study`/`move`), một khoảng tuổi và một bộ nghề hợp lý. Ví dụ mẫu `career` thứ nhất: «Tôi đang tính đổi việc. Những năm tới năm nào thuận nhất để chuyển?» (`src/game/npc.js:24`); mẫu `move`: «Gia đình tính chuyển nhà. Năm nào hợp để dọn đi?» (`src/game/npc.js:30`). Vòng chọn đã lọc theo tuổi: `QUESTIONS.filter((x) => ageNow >= x.age[0] && ageNow <= x.age[1])` (`src/game/npc.js:52`) — bình luận trong code nói rõ mục đích «không có bà 66 tuổi đi thi cao học» (`src/game/npc.js:50`). Sau đó `pick` rút một mẫu — **và hết**: câu hỏi của khách là nguyên văn một trong bảy mẫu, không thêm chữ nào của riêng khách ấy.
- **Cảm ơn sân: 3 mức chung cho mọi khách** theo tổng điểm án, chôn ở một dòng template trong `src/game/case-ui.js:236`: `total >= 0.75` → «Thầy luận rõ ràng quá, cảm ơn thầy!»; `>= 0.55` → «Cảm ơn, tôi hiểu thêm được nhiều.»; dưới nữa → «Cảm ơn, để tôi ngẫm thêm.» Ba câu này áp cho **mọi khách sân**, không phân biệt ai đang hỏi chuyện gì.
- **Cảm ơn sảnh bàn: 2 mức.** Trạch Nhật: «Vậy tôi chốt {{ngày}}. Cảm ơn thầy!» hoặc «Cảm ơn, để tôi xem lịch thêm.» (`src/game/case-ui.js:370`). Dương Trạch: «Rõ rồi, về tôi kê lại giường ngay. Cảm ơn thầy!» hoặc «Cảm ơn, để tôi xem lại nhà.» (`src/game/case-ui.js:457`).
- **Cảm ơn sảnh khai báo: 1 câu cố định mỗi sảnh** trong bảng `HALL_THANKS` (`src/game/case-ui.js:472`): Điều Hậu «Giờ tôi mới hiểu vì sao mùa đông tôi hay mệt.», Hợp Hôn «Hai đứa về sẽ nói chuyện với nhau kỹ hơn.», Tử Vi «Lá số Tử Vi rõ ràng quá.», Tượng Pháp «Giờ tôi biết mình nên làm gì rồi.», Cách Cục «Cách cục rõ rồi, cảm ơn thầy.» — không đổi theo ai đang nói, không đổi theo kết quả án.

Ngoài lời khách, các câu dẫn của sảnh cũng cố định: Điều Hậu dùng đúng một cặp intro/ask in sẵn (`src/game/halls.js:87-88`); Tử Vi mở bằng dòng âm lịch trích từ dữ kiện khách (`src/game/halls.js:192`) rồi một câu hỏi duy nhất (`src/game/halls.js:203`); Tượng Pháp một câu hỏi (`src/game/halls.js:231`); Cách Cục một câu hỏi ghép tên cách (`src/game/halls.js:263`); Hợp Hôn một intro chung cả quán (`src/game/halls.js:162`) và một câu hỏi của khách A thay mặt cặp (`src/game/halls.js:174`). Duong trạch có 3 mẫu hỏi quay vòng theo hạt (`src/game/dz-case.js:27-31`), Trạch Nhật có 6 mẫu gắn việc (`src/game/zheri-case.js:19-25`) — giàu hơn sân, nhưng vẫn là mẫu quay vòng, không phải chuyện của người.

### 8.1.4 Tuổi/nghề vô hồn, mất sạch giữa các ngày

Khách có sẵn rất nhiều dữ kiện sống — chỉ là dữ kiện ấy chưa bước vào lời thoại:

- **Tuổi**: `makeNpc` rút năm sinh thật (18–72 tuổi), tháng, ngày, giờ, phút (`src/game/npc.js:44-49`), đặt `age` (`src/game/npc.js:54`). UI hiển thị tuổi như một dòng metadata «{{call}} · {{age}} tuổi · {{job}}» (`src/game/case-ui.js:111` cho án sân; `src/game/case-ui.js:479` cho án sảnh) — **tuổi hiện trên bảng mà không hiện trong câu nói của khách**.
- **Nghề**: sinh kèm khách và luôn hợp tuổi (`src/game/npc.js:58` rút từ `Q.jobs` của mẫu câu đã lọc tuổi). Nghề chỉ hiện cùng dòng metadata (`src/game/case-ui.js:111`) — không một câu thoại nào nhắc nghề khách đang làm.
- **Danh xưng theo tuổi** thì ngược lại, đã sống tốt: `honorific(age, gender)` trả «Bạn/Anh/Chị/Chú/Cô/Bác/Bà» theo bốn bậc tuổi (`src/game/npc.js:33-38`), ghép thành `call` (`src/game/npc.js:57`). Đây là mảnh «người» duy nhất đã vào lời thoại.
- **Mất sạch giữa các ngày**: ngày đổi là khách đổi hoàn toàn — không một dấu vết. Máy trạng thái chỉ lưu kết quả án ({ kind, slot, name, total, mastery } qua `S.recordCase` — `src/game/case-ui.js:232`) để chặn giải lại tính điểm, không lưu chuyện khách. Cái duy nhất mang hơi hướng «hôm qua» trong cả quán là đèn hoa đăng của chính người chơi: «Đèn hoa đăng của khách hôm nay đang trôi trên hồ» sáng lại hôm sau (`src/game/stations.js:568`) — và đó là điều ước của người chơi, không phải ký ức về khách.

Tóm lại hiện trạng một dòng: **khách có lá số, có tuổi, có nghề, có danh xưng — nhưng chỉ có bảy câu hỏi gốc, ba mức cảm ơn chung, và ký ức bằng không.**

## 8.2 Ba mấu chốt hiện có để bám vào

Story generator không dựng từ không. Code hôm nay đã có ba móng tay đơm đủ chắc, và đặc tả dưới đây chỉ bám vào đúng ba móng ấy.

### 8.2.1 Móng thứ nhất — lá số thật của khách

Mọi khách procedural đều được dựng lá số **bằng engine của app**, không phải số bốc: `npcR` là `analyze(...)` của `src/engine/chart.js` (`src/game/halls.js:26`, import ở `src/game/halls.js:8`). Ba minh chứng rõ nhất cho thấy khách không phải là cái tên random mà là một lá số:

- **Điều Hậu kéo khí hậu 75% cho bài học rõ**: `const wantSkew = r0() < 0.75` (`src/game/halls.js:55`) — ba phần tư khách được chọn sao cho lá số **lệch** hàn/noãn/táo/thấp (vòng thử tối đa 12 hạt `dh:${key}:${i}`, `src/game/halls.js:57-60`), để bước «Trục hàn–noãn» (`src/game/halls.js:68`) và «Trục táo–thấp» (`src/game/halls.js:71`) có bài học đo được bằng `analyzeHanNuan(R)` (`src/game/halls.js:58`; engine `src/engine/han-nuan.js`). Kết quả đo nằm ngay trong `hn.needs` — mỗi nhu cầu bù có `{ wx, vi, why }` dùng làm giải thích bước «Hành cần bù» (`src/game/halls.js:66,76`). Tức là: **khách đã mang sẵn một đáp án «tôi lạnh hay nóng, cần hành gì» có thật trong R** — story chỉ cần nhắc lại nó bằng giọng người.
- **Cách Cục lọc khách theo cách**: vòng thử tối đa 20 hạt `cc:${key}:${i}`, dừng ở khách đầu tiên có `R.pattern?.type === 'normal'` + cách thần thuộc `GE_GODS` + có `pref` (`src/game/halls.js:244-247`). Sau đó cả án xoay quanh `R.pattern` — cách thần `P.geShen.god` (`src/game/halls.js:254`), thuận/nghịch dụng `P.shunNi` (`src/game/halls.js:256`), nhóm dụng `P.pref.yong/xi/ji` (`src/game/halls.js:258-260`), và câu hỏi khách nhắc đúng tên cách `P.vi` (`src/game/halls.js:263`). Khoảng trống của sảnh này — bộ lọc chưa bao giờ để một khách bại cách bước vào — là **chủ sở hữu của mục 09**: đối chiếu mục 09 cho toàn bộ bằng chứng và phương án mở lọc; mục này chỉ ghi **hành động** ở phía story (xem bảng §8.4.1, dòng Cách Cục) và không nhắc lại số liệu tại đây.
- **«Năm nay» đã là mảnh chuyện đầu tiên gắn vào khách**: bước cuối `npcDeep(R, year)` của bốn sảnh có khách (Điều Hậu `src/game/halls.js:84`; Tử Vi `src/game/halls.js:201`; Tượng Pháp `src/game/halls.js:229`; Cách Cục `src/game/halls.js:261`). Hàm ở `src/game/npc-deep.js:41` gọi `analyzeLiunianDeep(R, nowYear)` (`src/game/npc-deep.js:42`, engine `src/engine/liunian-pro.js`), map rating 6 mức của engine → 3 bậc «Thuận — nên làm / Bình thường / Nên thủ, giữ sức» qua `TONE_OF` (`src/game/npc-deep.js:24-28`; luật map ghi ở đầu file `src/game/npc-deep.js:8-11`). Khách đã **tự nói về năm của mình** bằng một lựa chọn trong ba bậc — story generator chỉ cần mở rộng đúng mảnh này ra thành lời.

Ngoài ba minh chứng trên, các builder còn để lại hàng loạt dữ kiện đọc được từ R mà story có quyền dùng: trục nhiệt/ẩm (`hn.temperature` ∈ 寒/平/暖, `hn.humidity` ∈ 燥/平/湿 — `src/game/halls.js:68-73`), Dụng Thần `R.yong.primary` (`src/game/halls.js:168`), mức Manh phái `M.level` bốn bậc «Cách thường → Cách cao» (`src/game/halls.js:217-218`), phú/quý `M.fuguui` (`src/game/halls.js:216`), và rating hợp hôn `hh.rating` bốn mức Khắc/Trung/Hợp/Đại hợp kèm `hh.score` + `hh.verdict` (`src/game/halls.js:171-172`).

### 8.2.2 Móng thứ hai — danh xưng + nghề theo tuổi

`honorific` (`src/game/npc.js:33-38`) và vòng lọc nghề theo tuổi (`src/game/npc.js:52`, bảng age của 7 mẫu `src/game/npc.js:23-31`) tạo ra hợp lý xã hội: khách 60 tuổi là «Chú/Bác», khách 22 tuổi là «Bạn»; khách 66 tuổi không đi thi cao học (`src/game/npc.js:50`). Đây là móng của **bước ghép tên** trong SPEC (§8.4): story không sinh nhân vật mới, chỉ nói lại bằng đúng `npc.call` + `npc.job` đã có (`src/game/npc.js:57-58`).

### 8.2.3 Móng thứ ba — cảm ơn theo điểm

Ba ngưỡng cảm ơn hiện có (`src/game/case-ui.js:236`, `src/game/case-ui.js:370`, `src/game/case-ui.js:457`) đã dạy một khuôn đúng: **giọng khách đổi theo chất lượng án**. Story generator **giữ nguyên khuôn này** — không thay ba mức cảm ơn chung bằng một câu cố định mới — và chỉ **nối thêm một câu theo nghiệm R** (§8.4, bước iii). Sự đổi giọng theo điểm là cái khung trống, nội dung bên trong sẽ được bơm từ lá số thay vì từ một bảng chung.

## 8.3 Khoảng trống — ba thiếu lớn

Đặt ba móng trên cạnh hiện trạng §8.1, khoảng trống rơi đúng ba chỗ, và cả ba đều là khoảng trống của **lời**, không phải của dữ kiện:

1. **Không hoàn cảnh riêng.** Không khách nào nói được «vì sao hôm nay tôi đến quán». Điều Hậu chỉ dẫn được một câu chung «nhờ xem lá số mình thuộc khí hậu nào» (`src/game/halls.js:87`) dù lá số khách **đã quyết định** cần nước hay cần lửa; Trạch Nhật có việc gắn tuổi (cưới, khai trương, nhập trạch, động thổ, ký kết, xuất hành — `src/game/zheri-case.js:19-25`) nhưng không có chi tiết đời sống (tên cửa hàng của ai, nhà nhập trạch là nhà thứ mấy); Dương Trạch có ba mẫu (`src/game/dz-case.js:27-31`) trong đó số đo cửa `{deg}` là con số vô hồn (`dz-case.js:62` thay chuỗi), chưa ai nói «nhà mua cho ai» hay «ai đang mất ngủ».
2. **Không bộ nhớ.** Khách mai không biết khách hôm qua đã sang (`src/game/case-ui.js:232` chỉ lưu kết quả án; §8.1.4). Cả quán chỉ có một ký ức xuyên ngày duy nhất — đèn hoa đăng của người chơi (`src/game/stations.js:568`) — và nó không thuộc về khách.
3. **Không giọng theo khe.** Khách Cách Cục hỏi «thành hay bại, có cứu ứng không» (`src/game/halls.js:263`) bằng đúng giọng khách Tử Vi hỏi tính cách — dù hai lá số hai sảnh nói hai chuyện khác nhau. Ba mức cảm ơn chung (`src/game/case-ui.js:236`) và bảng `HALL_THANKS` cố định (`src/game/case-ui.js:472`) áp cùng một lời cho mọi người.

Cả ba khoảng trống đều **không cần AI để lấp**: dữ kiện đã nằm trong R và trong `npc`. Đây chính là lý do story generator là module thuần chứ không phải một nhánh gọi `askAI`.

## 8.4 SPEC: `makeStory(seed, R, slot, pid)`

### 8.4.1 Chữ ký, đầu vào, đầu ra

```js
// src/game/story.js — ĐỀ XUẤT (mục 08). Thuần logic, không DOM, không mạng, không state.
// Khuôn theo gu-gongan.js: import hashSeed/rng từ npc.js; export hàm thuần có test node
// (khuôn test: src/game/gu-gongan.js:40-53, test-node của test-game-npc-deep.mjs).
import { hashSeed, rng, makeNpc } from './npc.js';                 // npc.js:5-13, npc.js:41
import { analyzeHanNuan } from '../engine/han-nuan.js';            // halls.js:11, dùng halls.js:58
import { analyzeLiunianDeep } from '../engine/liunian-pro.js';     // npc-deep.js:20, dùng npc-deep.js:42

/**
 * makeStory(seed, R, slot, pid, npc?, year?)
 *   seed  : chuỗi hạt giống ĐÚNG như nơi gọi đã dùng cho makeNpc
 *           (an: `${d}:${i}:${pid}` — main.js:56; dh/zw/mp/cc/hh/zheri/dz — bảng §8.1.1)
 *   R     : lá số khách ĐÃ TÍNH (npcR — halls.js:26) nơi gọi đã có sẵn
 *   slot  : mã sảnh/khe: 'an0'|'an1'|'an2'|'dieuhau'|'tuvi'|'tuongphap'|'cachcuc'
 *           |'hophon-A'|'hophon-B'|'trach'|'duongtrach'
 *   pid   : định danh người chơi (main.js:55) — chỉ dùng để đổi hạt khi cần (§8.7)
 *   npc?  : mặc định makeNpc(seed) — cùng hạt nên cùng khách (npc.js:41)
 *   year? : năm dương lịch, mặc định năm máy (khuôn npc.js:41)
 *
 * Đầu ra:
 *   { storyId, intro, ask, thanks: { top, mid, low, recall }, tags }
 *   storyId : hash(seed) — hashSeed của npc.js:5-9
 *   intro   : câu dẫn mở án (thay intro tĩnh của halls.js)
 *   ask     : câu khách hỏi (thay/độn câu hỏi mẫu npc.js:58)
 *   thanks  : 3 mức GIỮ như case-ui.js:236/370/457 + recall = 1 câu theo nghiệm R
 *   tags    : nhãn tệp hoàn cảnh đã chọn (phục vụ bộ nhớ §8.5 — chỉ tên tệp, không kể chuyện)
 */
```

Quy ước bắt buộc của module: **mọi quyết định trong hàm chỉ rút từ `r = rng(hashSeed(seed))` và từ `R`/`npc`**. Không `Date.now()`, không `Math.random()`, không đọc DOM, không đọc mạng. Năm là tham số truyền vào đúng khuôn `makeNpc(key, year)` (`src/game/npc.js:41`).

### 8.4.2 Bốn bước

**Bước (i) — PRNG chọn tệp hoàn cảnh theo BẢNG × SẢNH.** Mỗi sảnh có một bộ tệp hoàn cảnh; điều kiện chọn tệp là điều kiện **đo được từ R**, không phải chữ cảm tính. Đúng ba nhóm sảnh nêu ở yêu cầu:

- **Điều Hậu** — ba tệp khí hậu, điều kiện từ `analyzeHanNuan(R)` (`src/game/halls.js:58`): `{hàn-khát-nước}` khi `hn.temperature === '寒'` (`src/game/halls.js:69`), `{noãn-cần-lửa}` khi `'暖'`, `{thấp-cần-khô}` khi `hn.humidity === '湿'` (`src/game/halls.js:72`). Mỗi tệp kèm một mẩu «vì sao» hoàn cảnh nhẹ: «mua nhà cho mẹ già», «mệt mùa đông» — và mọi mẩu chỉ được ghép từ dữ kiện có thật trong R (trục nhiệt/ẩm `src/game/halls.js:68-73`, hành cần bù `hn.needs` `src/game/halls.js:66`).
- **Cách Cục** — **mở lọc cho bại cách CÓ HẬU**. Hành động thuộc mục này: bảng tệp của sảnh có một tệp riêng cho khách bại cách có hậu, và vòng chọn tệp đọc trực tiếp `R.pattern` (type/geShen — cùng trục `src/game/halls.js:246,254`) thay vì chỉ nhận khách normal. **Bằng chứng khoảng trống của bộ lọc hiện tại (vòng ≤20 hạt ở `src/game/halls.js:241-265` đối lập với nhóm 44 NPC phụ) là CHỦ SỞ HỮU của mục 09** — chỗ này chỉ ghi «đối chiếu mục 09», không nhắc lại số liệu.
- **Hợp Hôn** — hỏi/thanks theo `hh.rating`: nhánh «Hợp» cho `rating ∈ {'Hợp','Đại hợp'}`, nhánh «Khắc» cho `'Khắc'`, `'Trung'` rơi về nhánh trung tính — thang bốn mức của bước «Kết luận» (`src/game/halls.js:170-172`). Điều kiện ép cặp nam–nữ, tuổi gần nhau đã có ở builder (`src/game/halls.js:149-153`) — story dùng nguyên cặp đó, không sinh lại.
- **Trạch Nhật** — 6 việc gắn tuổi dùng nguyên bảng `JOBS` của `src/game/zheri-case.js:19-25` (kèm khoảng tuổi từng việc), cộng chi tiết từ **tên/nghề khách** (`npc.call`, `npc.job` — `src/game/npc.js:57-58`) để câu chuyện có mùi: «tiệm {{job}} của {{call}}» thay vì «cửa hàng» vô danh.
- **Dương Trạch** — 3 mẫu gốc của `src/game/dz-case.js:27-31` giữ nguyên vị trí `{deg}` (điểm thay chuỗi hiện tại: `src/game/dz-case.js:62`), cộng hai tệp «vì sao» đo từ R: «nhà mua cho ai» và «ai đang mất ngủ» — người mất ngủ là chính khách khi lá số yếu ở phương giường (đo qua `compassReading`/`bedScore` — `src/game/dz-case.js:46-53`, 47 đọc R cùng khuôn `halls.js:168` dùng `R.yong.primary`), «mua cho người thân» chỉ khi mẫu 1/2 (`dz-case.js:28-29`) được chọn.
- **Sân an0–an2, Tử Vi, Tượng Pháp** — tệp hoàn cảnh bám chủ đề mẫu hỏi (`npc.topic`, `npc.js:58`) và dữ kiện sảnh (chính tinh thủ Mệnh `src/game/halls.js:198-200`; mức `M.level` `src/game/halls.js:217-218`): giọng tự tin của khách đổi theo bậc cách — Cách cao nói chắc hơn Cách thường.

Toàn bộ ánh xạ sảnh → tệp → điều kiện R gọn trong **bảng hoàn cảnh × sảnh** dưới đây — bảng này là dữ kiện cứng của mục, phải đi cùng module như một hằng số.

**Bảng hoàn cảnh × sảnh (16 dòng — phần cứng của `story.js`):**

| # | Sảnh (khe) | Hạt giống | Tệp hoàn cảnh | Điều kiện chọn — đo từ R | Mẩu «vì sao» (hoàn cảnh NHẸ) |
|---|---|---|---|---|---|
| 1 | Sân an0–2 | `` `${d}:${i}:${pid}` `` (main.js:56) | CD-đổi-việc | `npc.topic === 'career'` (npc.js:24) | xưởng đổi ca đầu năm, muốn chuyển công ty |
| 2 | Sân an0–2 | như trên | CD-bế-tắc | `topic === 'career'` mẫu 2 (npc.js:25) | việc treo ba tháng, xin chuyển tổ |
| 3 | Sân an0–2 | như trên | CD-mở-rộng | `topic === 'wealth'` mẫu 1 (npc.js:26) | tiệm {{job}} muốn mở thêm quầy |
| 4 | Sân an0–2 | như trên | CD-mua-nhà | `topic === 'wealth'` mẫu 2 (npc.js:27) | để dành năm năm mua nhà cũ |
| 5 | Sân an0–2 | như trên | CD-cưới | `topic === 'love'` (npc.js:28) | hai nhà chốt cưới cuối năm |
| 6 | Sân an0–2 | như trên | CD-thi | `topic === 'study'` (npc.js:29) | thi chứng chỉ đầu xuân |
| 7 | Sân an0–2 | như trên | CD-dọn-nhà | `topic === 'move'` (npc.js:30) | hợp đồng thuê hết cuối quý |
| 8 | Điều Hậu | `dh:` (halls.js:54) | DH-hàn-khát-nước | `hn.temperature === '寒'` (halls.js:69) | mua nhà cho mẹ già, nhà cũ lạnh thấu |
| 9 | Điều Hậu | như trên | DH-noãn-cần-lửa | `hn.temperature === '暖'` | chuyển phòng hướng Tây, mùa nóng ngợp thở |
| 10 | Điều Hậu | như trên | DH-thấp-cần-khô | `hn.humidity === '湿'` (halls.js:72) | nhà trọ thấp, chăn ẩm cả tuần |
| 11 | Cách Cục | `cc:` (halls.js:245) | CC-cách-thường | `R.pattern.type === 'normal'` (halls.js:246) | vừa ổn định việc, muốn biết đi đường nào |
| 12 | Cách Cục | như trên | CC-bại-cách-có-hậu | đọc `R.pattern` khi mở lọc — **hành động ở đây; bằng chứng khoảng trống đối chiếu mục 09** | mất việc hồi đầu năm, đi làm lại chậm mà chắc |
| 13 | Hợp Hôn | `` `hh:${dayKey}:a|b` `` (halls.js:147-148) | HH-hợp | `hh.rating ∈ {'Hợp','Đại hợp'}` (halls.js:171) | hai nhà hẹn nhau xem ngày cưới |
| 14 | Hợp Hôn | như trên | HH-khắc | `hh.rating === 'Khắc'` (nhánh trung tính cho `'Trung'`) | mới về chung nhà, hay cãi chuyện nhỏ |
| 15 | Trạch Nhật | `` `zheri:${key}` `` (zheri-case.js:40) | TR-việc-lớn | `job` lọc theo tuổi (zheri-case.js:42) + tên/nghề khách (npc.js:57-58) | tiệm {{job}} sắp khai trương / nhà mới xong |
| 16 | Dương Trạch | `` `dz:${key}` `` (dz-case.js:56) | DT-mua-cho-ai / DT-ai-mất-ngủ | mẫu dz-case.js:28-30 + `bedScore(R, …)` (dz-case.js:46-53) | nhà mua cho mẹ già / chính khách đang mất ngủ |

(Tử Vi, Tượng Pháp, sân dùng bảng gọn hơn trong pseudo-code §8.4.3 — ba dòng trên đủ khuôn, không lặp lại vô ích.)

**Bước (ii) — ghép tên + nghề + danh xưng.** Không sinh nhân vật mới. Story đọc `npc.call` (đã ghép `honorific` — `src/game/npc.js:33-38,57`) và `npc.job` (`src/game/npc.js:58`), cắm vào mọi template qua biến `{{call}}`, `{{job}}`. Luật: tên nghề chỉ xuất hiện ở chỗ nó hợp lý xã hội (khách 18 tuổi không «chủ tiệm» — báng ghế đã lọc `src/game/npc.js:52`), và trong phòng MMO, story này **không bao giờ ra ngoài** (bark chung cấm dùng — đối chiếu mục 13).

**Bước (iii) — ba câu riêng theo result, cảm ơn 3 mức GIỮ + 1 câu nghiệm R.**

- `intro`: mở án bằng tệp hoàn cảnh đã chọn (bước i) + danh xưng — thay intro tĩnh của `src/game/halls.js:87` v.v.
- `ask`: câu khách hỏi = mẫu gốc (`npc.question` — `src/game/npc.js:58`) **độn thêm mẩu «vì sao»**; mẫu gốc giữ nguyên ý nghĩa để án và đáp án engine không đổi (đáp án vẫn do engine chấm — `gradeStep`/`grade` khuôn `src/game/gu-gongan.js:40-42`).
- `thanks`: **giữ nguyên ba mức điểm hiện có** (`src/game/case-ui.js:236` cho sân; 2 mức `src/game/case-ui.js:370/457` cho sảnh bàn; `HALL_THANKS` `src/game/case-ui.js:472` cho sảnh khai báo làm mức nền) và **nối thêm đúng một câu `recall` theo nghiệm R**: nghiệm lấy từ `analyzeLiunianDeep(R, year)` → rating → bậc 3 «Thuận/Bình/Nên thủ» qua `TONE_OF` (`src/game/npc-deep.js:24-28,42`) — cùng bậc với bước «Năm nay» đã có, nên khách **không tự mâu thuẫn** giữa câu cảm ơn và bước cuối án. UI nối chuỗi theo mức điểm như khuôn template một dòng hiện tại (`src/game/case-ui.js:236`) — story chỉ giao chuỗi, không đụng DOM.
- **Hợp Hôn đặc biệt**: `ask`/`thanks` đổi nhánh theo `hh.rating` (bước i) — câu cảm ơn «Hai đứa về sẽ nói chuyện với nhau kỹ hơn.» cố định hôm nay (`src/game/case-ui.js:472`) trở thành mức nền của nhánh Khắc/Trung, nhánh Hợp có câu riêng.

**Bước (iv) — `storyId = hash(seed)`.** `storyId = hashSeed(seed)` (`src/game/npc.js:5-9`). ID này là mảnh ghép của bộ nhớ liên ngày (§8.5): hôm sau chỉ cần `{tên, storyId}` là đủ trỏ lại đúng chuyện hôm qua mà không phải lưu lá số (lá số tính lại được từ seed bằng `makeNpc` + `npcR` — thuần, nhanh, mất của ai chỉ mất của người đó).

### 8.4.3 Pseudo-code `makeStory` hoàn chỉnh

```js
// ============================================================================
//  src/game/story.js — ĐỀ XUẤT (docs/npc-ai/08). Node thuần, KHÔNG DOM, KHÔNG mạng.
//  Khuôn gu-gongan.js (src/game/gu-gongan.js:1-22): module thuần có test node,
//  mọi chữ hiển thị tiếng Việt, KHÔNG chữ Hán trong lời khách (luật V6).
//  Luật bất di §8.6: story là HÀM THUẦN của seed; dữ kiện chỉ từ R (T5);
//  hoàn cảnh NHẸ ONLY (T6 — đổi việc/chuyển nhà/mua nhà/mất ngủ, cấm chết/bệnh thật/ly hôn).
// ============================================================================
import { hashSeed, rng, makeNpc } from './npc.js';              // npc.js:5-13, :41
import { analyzeHanNuan } from '../engine/han-nuan.js';         // dùng khuôn halls.js:58
import { analyzeLiunianDeep } from '../engine/liunian-pro.js';  // khuôn npc-deep.js:42

// --- Bảng hoàn cảnh × sảnh (§8.4.1) — hằng số, KHÔNG có hoàn cảnh nặng ----------
const HAN_NUAN_FILES = {
  '寒': { tag: 'DH-han-khat-nuoc',  why: 'mua nhà cho mẹ già, nhà cũ mùa đông lạnh thấu' },
  '暖': { tag: 'DH-noan-can-lua',   why: 'chuyển vào phòng hướng Tây, mùa nóng ngợp thở' },
  '湿': { tag: 'DH-thap-can-kho',   why: 'nhà trọ thấp, chăn màn ẩm cả tuần' },
};
const TOPIC_FILES = {
  career: [['CD-doi-viec',  'xưởng đổi ca đầu năm, muốn chuyển công ty'],
           ['CD-be-tac',    'việc treo ba tháng, xin chuyển tổ']],
  wealth: [['CD-mo-rong',   'tiệm {{job}} muốn mở thêm quầy'],
           ['CD-mua-nha',   'để dành năm năm mua căn nhà cũ']],
  love:   [['CD-cuoi',      'hai nhà chốt cưới vào cuối năm']],
  study:  [['CD-thi',       'thi chứng chỉ đầu xuân']],
  move:   [['CD-don-nha',   'hợp đồng thuê hết cuối quý']],
};

// Chọn phần tử theo hạt: khuôn pick/shuffle của npc.js:14-15
const pickBy = (r, arr) => arr[Math.floor(r() * arr.length)];

/** BƯỚC (i): chọn tệp hoàn cảnh theo bảng × sảnh — điều kiện ĐO TỪ R, không bịa. */
function pickScenario(r, R, slot, npc) {
  if (slot === 'dieuhau') {
    const hn = analyzeHanNuan(R);                       // halls.js:58 — dữ kiện có thật
    if (HAN_NUAN_FILES[hn.temperature]) return HAN_NUAN_FILES[hn.temperature];  // halls.js:69
    if (HAN_NUAN_FILES[hn.humidity])    return HAN_NUAN_FILES[hn.humidity];    // halls.js:72
    return { tag: 'DH-can-bang', why: 'khí hậu lá số tương đối cân' };         // hn.needs rỗng
  }
  if (slot === 'cachcuc') {
    // MỞ LỌC cho bại cách CÓ HẬU: đọc R.pattern trực tiếp (halls.js:246,254 là cùng trục).
    // Bằng chứng khoảng trống của bộ lọc hiện tại = chủ sở hữu mục 09 — đối chiếu mục 09.
    const bak = R.pattern?.type !== 'normal';
    return bak ? { tag: 'CC-bai-cach-co-hau', why: 'mất việc hồi đầu năm, đi làm lại chậm mà chắc' }
               : { tag: 'CC-cach-thuong',     why: 'vừa ổn định việc, muốn biết đi đường nào' };
  }
  if (slot === 'hophon-A' || slot === 'hophon-B') {
    const rating = R.hhRating; // nơi gọi đã tính computeHehun — halls.js:156,171
    if (rating === 'Hợp' || rating === 'Đại hợp') return { tag: 'HH-hop',   why: 'hai nhà hẹn nhau xem ngày cưới' };
    if (rating === 'Khắc')                        return { tag: 'HH-khac',  why: 'mới về chung nhà, hay cãi chuyện nhỏ' };
    return { tag: 'HH-trung', why: 'hai người đang tìm nhịp sống chung' };
  }
  if (slot === 'trach') return { tag: 'TR-viec-lon', why: '{{job}} sắp có việc lớn cần chọn ngày' };
  if (slot === 'duongtrach') {
    const dt = pickBy(r, ['DT-mua-cho-ai', 'DT-ai-mat-ngu']);  // 3 mẫu gốc dz-case.js:27-31 giữ nguyên
    return dt === 'DT-ai-mat-ngu' ? { tag: dt, why: 'chính khách đang mất ngủ' }
                                  : { tag: dt, why: 'nhà mua cho mẹ già ở quê' };
  }
  // sân an0-2 · tuvi · tuongphap: tệp bám chủ đề mẫu hỏi (npc.topic — npc.js:58)
  const set = TOPIC_FILES[npc.topic];
  const [tag, why] = set ? pickBy(r, set) : ['CD-chung', 'một chuyện thường ngày cần quyết'];
  return { tag, why };
}

/** BƯỚC (iii)-phụ: 1 câu nghiệm R — cùng bậc «Năm nay» để khách không tự mâu thuẫn. */
function recallLine(R, year) {
  const d = analyzeLiunianDeep(R, year);                 // npc-deep.js:42
  const tone = { 'Đại cát': 'thuan', 'Cát': 'thuan', 'Bình': 'binh',
                 'Hơi kỵ': 'giu', 'Hung': 'giu', 'Đại hung': 'giu' }[d.rating] || 'binh';
  return { thuan: 'Năm nay của tôi đang thuận, chuyện này tới nước phải đẩy.',
           binh:  'Năm nay bình thường, tôi làm chậm mà chắc.',
           giu:   'Năm nay nên thủ, chuyện này tôi sẽ từ từ mà xem.' }[tone];
}

/** makeStory — 4 bước, thuần của (seed, R, slot, pid, year). */
export function makeStory(seed, R, slot, pid, npc = makeNpc(seed), year = new Date().getFullYear()) {
  const r = rng(hashSeed(seed));                         // npc.js:5-13 — duy nhất nguồn ngẫu nhiên

  // (i) tệp hoàn cảnh — điều kiện đo từ R
  const sc = pickScenario(r, R, slot, pid, npc);

  // (ii) ghép tên + nghề + danh xưng — KHÔNG sinh nhân vật mới (npc.js:33-38,57-58)
  const call = npc.call, job = npc.job;
  const why = sc.why.replace('{{job}}', job);

  // (iii) 3 câu riêng; thanks 3 mức GIỮ + recall theo nghiệm R
  const intro = `${call} — ${job} — ${why}. Nghe nói lá số nói được chuyện ấy, nên sang nhờ thầy xem.`;
  const ask = sc.tag === 'HH-hop' || sc.tag === 'HH-khac' || sc.tag === 'HH-trung'
    ? npc.question                                       // hợp hôn giữ mẫu gốc halls.js:174
    : `${why}. ${npc.question}`;                         // mẫu gốc npc.js:58 + mẩu «vì sao»
  const thanks = {
    top:  slot === 'hophon-A' || slot === 'hophon-B'
            ? (sc.tag === 'HH-hop' ? 'Về nhà cứ giữ nhịp này, hai lá số bổ nhau đấy. Cảm ơn thầy!'
                                   : 'Hai đứa về sẽ nói chuyện với nhau kỹ hơn. Cảm ơn thầy.')  // nền case-ui.js:472
            : 'Thầy luận rõ ràng quá, cảm ơn thầy!',     // mức GIỮ — case-ui.js:236
    mid:  'Cảm ơn, tôi hiểu thêm được nhiều.',           // GIỮ — case-ui.js:236
    low:  'Cảm ơn, để tôi ngẫm thêm.',                   // GIỮ — case-ui.js:236
    recall: recallLine(R, year),                         // 1 câu nghiệm — cùng bậc npc-deep.js:24-28
  };

  // (iv) storyId = hash(seed) — npc.js:5-9
  return { storyId: hashSeed(seed), intro, ask, thanks, tags: [sc.tag] };
}
```

Chú ý ba điểm khi dán vào code thật: (1) dòng `R.hhRating` là **hợp đồng nơi gọi** — builder Hợp Hôn đã có `hh` trong tay (`src/game/halls.js:156-172`), chỉ cần truyền `hh.rating` vào R-đã-bọc hoặc đổi chữ ký nhận thêm `hh`; không có gì phải tính lại. (2) `{{job}}` giữ nguyên quy ước biến `{{ten_bien}}` như mọi mẫu prompt của bộ thiết kế; điểm thay chuỗi của Dương Trạch vẫn là chỗ cũ `src/game/dz-case.js:62`. (3) Module không biết điểm án — UI nối `thanks[mức] + ' ' + thanks.recall` tại đúng dòng template hiện có (`src/game/case-ui.js:236/370/457` và bảng `HALL_THANKS` `src/game/case-ui.js:472`), đúng nguyên tắc «AI/lời chỉ nói, máy trạng thái quyết».

### 8.4.4 Ba cặp before → after

**Cặp 1 — Điều Hậu: intro từ «câu chung» thành «chuyện của người».**

```text
// BEFORE (hiện có — src/game/halls.js:87, mọi ngày mọi khách một câu):
"{{call}} hay nghe nói «lá số lạnh cần lửa, nóng cần nước» và nhờ xem lá số mình thuộc khí hậu nào."

// AFTER (đề xuất — điều kiện chọn: analyzeHanNuan(R).temperature === '寒', halls.js:58,69):
"{{call}} — {{job}} — vừa mua căn nhà nhỏ cho mẹ già, nhà cũ mùa đông lạnh thấu. Nghe nói
«lá số lạnh cần lửa, nóng cần nước», nên sang nhờ thầy xem lá số mình thuộc khí hậu nào."
```

Câu AFTER không bịa một chữ nào ngoài dữ kiện đã đo: khách «lạnh» là khách mà builder đã kéo lệch 75% cho bài học rõ (`src/game/halls.js:53-60`), «nhà cho mẹ già» là tệp hoàn cảnh NHẸ của bảng §8.4.1 dòng 8 — và câu cảm ơn «Giờ tôi mới hiểu vì sao mùa đông tôi hay mệt.» của sảnh (`src/game/case-ui.js:472`) tự nhiên khớp như một cái locket với câu mở.

**Cặp 2 — Dương Trạch: số đo vô hồn thành «nhà mua cho ai».**

```text
// BEFORE (hiện có — src/game/dz-case.js:30, mẫu 3; {deg} thay tại dz-case.js:62):
"Nhà tôi cửa hướng {{deg}}°, dạo này ngủ không yên. Thầy xem lại cửa và chỗ kê giường giúp tôi."

// AFTER (đề xuất — tệp DT-ai-mat-ngu; {deg} GIỮ nguyên vị trí thay chuỗi):
"Nhà tôi mua cho mẹ già ở quê, cửa chính đo được {{deg}}°. Dạo này bà ngủ không yên,
chăn màn ẩm. Thầy xem cửa có hợp {{call}} không, và nên kê giường ở góc nào cho bà đỡ trằn trọc."
```

Điều kiện chọn tệp đo từ R: `bedScore(R, …)` thấp ở cung giường (`src/game/dz-case.js:46-53`) hoặc mẫu 3 được rút (`src/game/dz-case.js:30`). Khách vẫn hỏi đúng việc engine chấm — cửa, giường — không thêm bước mới, chỉ thêm người vào câu nói.

**Cặp 3 — Hợp Hôn: cảm ơn một câu thành hai nhánh theo rating.**

```text
// BEFORE (hiện có — src/game/case-ui.js:472, HALL_THANKS.hophon, cố định mọi cặp):
"Hai đứa về sẽ nói chuyện với nhau kỹ hơn."

// AFTER (đề xuất — điều kiện chọn: hh.rating, bước Kết luận halls.js:170-172):
// rating 'Hợp' | 'Đại hợp':
"Về nhà cứ giữ nhịp này — hai lá số bổ nhau đấy, đừng bỏ chuyện nhỏ chưa nói. Cảm ơn thầy!"
// rating 'Khắc' (nền GIỮ của nhánh):
"Hai đứa về sẽ nói chuyện với nhau kỹ hơn — khắc không phải chia tay, là học cách nói với nhau. Cảm ơn thầy."
```

Cặp A/B vẫn do `` `hh:${dayKey}:a|b` `` sinh (`src/game/halls.js:147-148`), vẫn ép nam–nữ tuổi gần (`src/game/halls.js:149-153`), vẫn là án chung cả quán theo key ngày (`src/game/stations.js:693`) — story đổi **giọng kết**, không đổi **cấu trúc án**, nên điểm và chấm của engine giữ nguyên.

## 8.5 Bộ nhớ liên ngày (đề xuất mới, chưa code)

Khoảng trống thứ hai (§8.3) lấp bằng một kho nhỏ trên máy người chơi — **đề xuất của mục này, chưa có dòng code nào**:

- **Khoá**: `localStorage 'khach:<pid>:<ngày>'` — theo pid nên kho của người này người khác không thấy (đối chiếu mục 13). Khuôn khoá có sẵn trong app: `'huyenquan:pid'` (`src/game/net.js:8`) là chứng minh app đã quen lưu theo pid trong localStorage.
- **Giá trị**: `JSON.stringify({ tên, storyId })` — **chỉ hai trường**. Không lưu ngày sinh, không lưu lá số: mọi thứ còn lại tính lại được từ seed (makeNpc + npcR thuần — §8.1.2), nên kho này vừa nhỏ vừa không tăng dữ liệu cá nhân.
- **Ghi**: sau khi giải án khách (chỗ `S.recordCase` — `src/game/case-ui.js:232`) ghi 1 dòng cho khách vừa giải.
- **Đọc**: hôm sau, khi mở án **đầu tiên** của ngày, story generator tra `'khach:<pid>:<ngày-hôm-qua>'` và nhồi **đúng 1 câu** vào đầu án:

```text
"Hôm qua {{tên-khách-hôm-qua}} cũng ghé quán hỏi chuyện {{tag-tệp-hoàn-cảnh-hôm-qua}}."
// ví dụ: "Hôm qua Anh Hải cũng ghé quán hỏi chuyện đổi việc."
```

Chỉ một câu, chỉ tên + nhãn chủ đề (`tags` của đầu ra `makeStory` — §8.4.1) — không kể lại án cũ, không tiếp nối chuyện cũ thành cốt truyện dài, để mọi thứ vẫn là hàm của hạt hiện tại (§8.6). 
- **Tắt mặc định**: cờ `FEATURES.storyMemory = false` (khuôn bảng cờ `src/game/features.js:20` — cùng hàng `ai: !IOS`). Khi tắt: không ghi, không đọc, không có câu nhắc — mọi thứ khác chạy nguyên. Khi bật: chỉ bật ở web, iOS giữ tắt cho gọn gói (cùng lý do iOS tắt AI — `src/game/features.js:20`).

Ranh giới an toàn của kho này: (a) không bao giờ gửi qua mạng — kho nằm trọn trên máy (đúng cam kết offline-first của mục 12); (b) không ghi đè kho người khác vì khoá gắn pid hiện tại (`src/game/main.js:55`); (c) kho đầy tự nhiên bị giới hạn của localStorage tự cắt — chấp nhận mất câu nhắc, không chấp nhận lỗi app: mọi đọc phải bọc try/catch như khuôn hiện có (`src/game/main.js:55`, `src/game/stations.js:672`).

## 8.6 Luật bất di

Bốn luật, vi phạm luật nào là bỏ tính năng ấy:

1. **Story chỉ từ dữ kiện có thật trong R (T5 + T6).** Mọi mảnh «vì sao» phải truy được về một phép đo engine: khí hậu từ `analyzeHanNuan` (`src/game/halls.js:58`), cách từ `R.pattern` (`src/game/halls.js:246,254`), nghiệm năm từ `analyzeLiunianDeep` (`src/game/npc-deep.js:42`), hợp/khắc từ `hh.rating` (`src/game/halls.js:171`), hướng cửa từ chuỗi đo `dz-case.js:61-62`. **T6 cấm tuyệt đối**: không hoàn cảnh chết/bệnh thật/tai nạn/ly hôn; bảng §8.4.1 chỉ chứa hoàn cảnh nhẹ — đổi việc, chuyển nhà, mua nhà, mất ngủ. Khách cũng không nói chữ Hán (luật V6), không nhắc Ngọc/tiền/VIP.
2. **Story là hàm của seed.** Cùng `seed` (đồng nghĩa cùng ngày + khe + pid trên cùng máy) phải ra **cùng storyId, cùng intro, cùng ask, cùng thanks** — chứng minh bằng hai test §8.7. Trong module không có `Date.now()`, không `Math.random()`, không đọc state/DOM; năm là tham số truyền vào đúng khuôn `makeNpc(key, year)` (`src/game/npc.js:41`). Kết quả: relaunch app, máy offline, AI bị admin tắt — chuyện khách hôm nay không đổi.
3. **Same máy ra cùng khách — và chỉ máy đó thấy.** Hạt giống có pid (`src/game/main.js:56`, `src/game/stations.js:673/693`) nên bộ khách là chuyện riêng của chủ pid; story sinh từ hạt đó là chuyện riêng theo đúng nghĩa đen. Câu intro/ask/thanks **không bao giờ đi vào bark chung** của phòng MMO (đối chiếu mục 13).
4. **Không đổi cấu trúc án.** Story generator chỉ thay 3 câu chữ; các bước chấm, đáp án, điểm, Phúc Khí (`CASE_GAIN_CAP` theo GAME-NOI-DUNG §3) giữ nguyên do engine quyết — lời chỉ nói, máy trạng thái quyết. Mức cảm ơn 3 ngưỡng hiện có (`src/game/case-ui.js:236`) là phần GIỮ, không được thay bằng câu cố định mới.

## 8.7 Khung kiểm thử same-seed (2 test — suite chung mục 16)

Hai test node thuần dưới đây là **khung** của mục này; ranh giới chung, điều kiện pass/fail của cả bộ và cách chạy nằm ở **mục 16**. Khuôn file test bám `scripts/test-game-npc-deep.mjs` (module được test khai rõ «test: scripts/test-game-npc-deep.mjs» — `src/game/npc-deep.js:18`).

```js
// scripts/test-game-story.mjs — KHUNG (suite chung mục 16)
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeStory } from '../src/game/story.js';
import { makeNpc, hashSeed } from '../src/game/npc.js';   // npc.js:5-9, :41
import { analyze } from '../src/engine/chart.js';         // khuôn npcR — halls.js:26

const YEAR = 2026;
const mk = (seed, slot, pid) => {
  const npc = makeNpc(seed, YEAR);
  const R = analyze(npc.year, npc.month, npc.day, npc.hour, npc.minute, npc.gender, YEAR);
  return makeStory(seed, R, slot, pid, npc, YEAR);
};

test('T1 — same seed ⇒ same story, storyId = hash(seed)', () => {
  const seed = '2026-11-08:0:pid-test-1';                 // `${d}:${i}:${pid}` — main.js:56
  const a = mk(seed, 'an0', 'pid-test-1');
  const b = mk(seed, 'an0', 'pid-test-1');
  assert.deepEqual(a, b);                                 // cùng mọi trường, kể cả thanks.recall
  assert.equal(a.storyId, hashSeed(seed));                // npc.js:5-9
  assert.equal(a.intro.includes('Bạn') || a.intro.includes('Anh') || a.intro.includes('Chị')
            || a.intro.includes('Chú') || a.intro.includes('Cô') || a.intro.includes('Bác')
            || a.intro.includes('Bà'), true);             // danh xưng từ honorific — npc.js:33-38
});

test('T2 — đổi pid ⇒ đổi seed ⇒ đổi story; không DOM, không mạng', () => {
  const a = mk('2026-11-08:1:pid-A', 'an1', 'pid-A');
  const b = mk('2026-11-08:1:pid-B', 'an1', 'pid-B');
  assert.notEqual(a.storyId, b.storyId);                  // hash khác → khách khác (main.js:56)
  assert.notDeepEqual(a, b);                              // story theo hạt, không dùng chung bộ nhớ cục
  // ai-mat-ngu/mua-cho-ai: đủ 3 nhánh cảm ơn + recall không rỗng
  for (const s of [a, b]) assert.ok(s.thanks.recall.length > 0);
});
```

Hai điểm thêm khi ghé vào suite chung: (a) chạy thêm một vòng `for` 100 seed ngẫu nhiên ở tầng fixture để khẳng định **không seed nào làm module ném lỗi** (bảng §8.4.1 rơi về nhánh mặc định an toàn thay vì throw); (b) test Điều Hậu kiểm tra cụ thể: khách có `analyzeHanNuan(R).temperature === '寒'` thì `intro` chứa mẩu DH-hàn — tức điều kiện chọn tệp **đúng là điều kiện đo**, không phải chữ random.

## 8.8 Liên kết mục khác

**MMO (chi tiết ở mục 13).** Khách procedural theo pid là chuyện riêng của chủ pid: hạt giống chứa pid (`src/game/main.js:56`, `src/game/stations.js:673`), nên cùng một phòng, hai người chơi thấy **hai bộ khách khác nhau** đứng ở cùng ba khe sân. Người khác trong phòng chỉ thấy **nhân vật 3D + nhãn** — khuôn hiện có là marker ❓ vàng xoay trên đầu khách khe (`src/game/render3d.js:239-248`). Do đó quy định cứng: **bark chung không bao giờ dùng tệp hoàn cảnh riêng** — story intro/ask/thanks chỉ hiện trong panel của người mở án, tương đương cách hội thoại Thầy đã chốt là của riêng người mở panel (Quyết 1 của mục 13). Bảng phân vai bark/story đầy đủ nằm ở mục 13.

**OFFLINE (chi tiết ở mục 12).** `makeStory` thuần client: không gọi `/zai`, không gọi `/ws`, không đọc KV — chạy được khi máy không mạng, đúng khi AI bị admin tắt 503 lẫn khi WiFi rời (hai trạng thái khác nhau đã tách ở mục 12). Module nhỏ (một file + một bảng), đặt trong bundle chính và đưa vào **cache service worker** cùng nhóm module thuần sẵn có (`gu-gongan.js`/`namhan.js`/`kinh-tu.js`); danh sách cache và gate kiểm thử offline là tài sản của mục 12, mục này chỉ cam kết: **story generator không thêm một request nào**.

**Mục 09.** Toàn bộ bằng chứng khoảng trống Cách Cục (vòng lọc ≤20 hạt `src/game/halls.js:241-265` đối lập nhóm 44 NPC phụ) và phương án mở lọc bại cách có hậu thuộc mục 09. Mục này chỉ giữ **hành động phía story**: bảng tệp có sẵn nhánh CC-bại-cách-có-hậu (§8.4.1 dòng 12) và điều kiện đọc `R.pattern` (§8.4.3).

**Mục 16.** Suite test chung định điều kiện pass/fail, cách chạy và ranh giới fixture; hai test §8.7 là khung góp vào suite ấy.

## 8.9 Trạm dừng của mục

**Làm trong đợt này** (khi `state.js`/`stations.js` mở khóa — hiện đang khóa theo GAME-THIET-KE-CHOT §0.3/Q6/Q7): module `src/game/story.js` thuần (pseudo-code §8.4.3) + bảng hoàn cảnh × sảnh (§8.4.1) + 2 test same-seed (§8.7) + cờ `FEATURES.storyMemory` tắt mặc định. **Không làm**: không sửa trạm, không thêm trạm, không mở runtime AI cho khách procedural, không đổi cấu trúc án hay điểm chấm, không nhắc lại bằng chứng Cách Cục ở đây (mục 09), không cho story ra bark chung (mục 13). Mọi chữ khách nói đi qua nguyên tắc chung đã chốt của bộ: dữ kiện trước giọng sau (T5), không phán định mệnh (T2), hoàn cảnh nhẹ only (T6) — và game chạy trọn khi AI tắt.
