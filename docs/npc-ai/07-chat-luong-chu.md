# 07 · Quy tắc chất lượng chữ — temp 0.55, rule-10, chống xáo chữ, 4 style

> Mục thuộc bộ thiết kế NPC-AI Huyền Quán (`docs/npc-ai/`). Dẫn chiếu ngoài bộ: GDD `docs/gdd/06-npc-ai/` (06-01 kiến trúc, 06-18 cẩm nang giọng), `GAME-THIET-KE-CHOT`, `00-KINH-DIEN-CHUNG`. Mọi trích code trong mục này là dòng thật trong repo, kiểm chứng bằng lệnh đọc/grep tại `src/engine/ai.js` (2.984 dòng) và `src/game/master-ui.js` (110 dòng) vào ngày 2026-11-08.

## 7.0 · Tóm tắt

Chất lượng chữ là rào chắn số một của toàn bộ luồng NPC-AI: người chơi đọc chữ trước khi đọc logic, và một câu xáo chữ («CỤ THỈL» thay vì «CỤ THỂ») phá ngay niềm tin vào vai «ông thầy». Mục này chốt bảy thứ: (1) nhiệt độ 0.55 — con số chốt bằng lỗi thật, commit `51667a90`, **không hạ thấp hơn trong đợt này**; (2) rule-10 nguyên văn trong `SYSTEM_PROMPT` với đúng ba loại lỗi cấm lấy từ lỗi người chơi thật gặp; (3) ranh giới PERSONA (giọng nhân vật) × STYLE (độ sâu thuật ngữ) — hai lớp khác nhau, 20 hồ sơ NPC trong bộ này dựa vào ranh giới ấy; (4) giọng vùng bằng từ vựng và nhịp, tuyệt đối không bằng chính tả sai; (5) quy ước đánh số 25 rule liên tục của `SYSTEM_PROMPT`; (6) vòng phản hồi log_error → admin → viết rule mới; (7) quy ước stream token dồn rAF để persona không bao giờ tách câu giữa chừng trên màn hình.

---

## 7.1 · Nhiệt độ 0.55 — con số chốt bằng lỗi thật

### 7.1.1 Nơi quy định trong code

Nhiệt độ nằm ở `buildBody` của client engine, một dòng duy nhất, kèm comment ghi rõ lý do:

```js
// src/engine/ai.js:2765 (trong buildBody)
model: cfg.model, messages: msgs, temperature: 0.55, stream: true,
// [FIX văn bản] 0.7→0.55: nhiệt độ cao tăng lỗi xáo chữ token tiếng Việt (CỤ THỈL/tinh bốt)
```

Trước khi hạ, giá trị là `0.7`. Lỗi xáo chữ xảy ra ở nhiệt đó với tần suất đủ để người dùng thật bắt gặp và phải sửa từng câu cho AI — hai lỗi tiêu biểu là «CỤ THỈL» (đúng phải là «CỤ THỂ») và «tinh bốt» (đúng phải là «tinh bột»). Nguyên nhân kỹ thuật: tiếng Việt có dấu là văn bản khó về phía tokenizer — mỗi âm tiết mang dấu tổ hợp/tự lập, số token lớn hơn số âm tiết nhiều; nhiệt độ càng cao thì xác suất model rơi vào token «gần đúng hình dạng» thay vì token đúng càng lớn, và token gần đúng đúng lúc đó chính là chữ xáo. Hạ nhiệt độ không sửa model, nhưng kéo phân bố lựa chọn về phía token có xác suất cao nhất — thống kê quan sát được là lỗi xáo chữ giảm rõ sau khi hạ.

### 7.1.2 Commit chuẩn — 51667a90

> **Ghi chú commit `51667a90`** (mẫu bắt buộc của mục này): commit `51667a90` — tiêu đề «fix(ai): temperature 0.7→0.55 + rule 10 viết lại với lỗi thật (CỤ THỈL/tinh bốt/refinery) — giảm xáo chữ tiếng Việt», ngày 22-10-2026 — làm **hai việc cùng lúc**: (a) hạ `temperature` 0.7→0.55 tại `src/engine/ai.js` (bốn dòng thay đổi trong file này); (b) viết lại rule-10 trong `SYSTEM_PROMPT` bằng ba lỗi người dùng thật gặp thay vì liệt kê chung chung «viết đúng chính tả». Đây là mẫu của vòng phản hồi ở mục 7.7: một commit một lần thu lỗi thật thành rào chắn mới, không viết rule phòng hoá suông không bắt được lỗi nào cả.

### 7.1.3 Chốt không hạ thấp hơn trong đợt này

Quyết định thiết kế: **0.55 là đáy của đợt này, không hạ xuống 0.4 hay 0.3.** Lý do, theo thứ tự trọng lượng:

1. **Giọng nhân vật cần chút biến hoá.** PERSONA (mục 7.4) sống bằng cách nói riêng — hình ảnh, nhịp câu, cách mở đầu. Nhiệt độ quá thấp làm mọi persona hiện ra như một giáo trình; «Thầy» và «Khổng tiên sinh» sẽ nói giống hệt nhau dù prompt khác nhau. Chất giọng là thứ 0.55 giữ được mà 0.3 không giữ.
2. **Chưa có dữ liệu chứng minh cần hạ thêm.** Sau commit `51667a90` chưa có lỗi xáo chữ mới nào được log qua `log_error` ở mức buộc phải hạ nhiệt độ lần nữa (mục 7.7 là nơi thu lỗi này). Hạ thấp hơn phải đợi telemetry ở mục 14 chứng minh lỗi còn xảy ra ở 0.55 — hạ bằng cảm giác là chỉnh chung chung, không phải thiết kế.
3. **Ba lớp chống chữ khác vẫn còn hiệu lực.** Rule-10 trong prompt (mục 7.2), bộ lọc V1–V8 sau stream trước hiển thị, và self-check «Neo» ở `master-ui.js` đều là lớp phòng độc lập với nhiệt độ. Hạ nhiệt độ là một lớp trong nhiều lớp, không phải lớp duy nhất.

Cấm kèm theo: **không hạ hoặc chỉnh nhiệt độ ở lớp gateway/server.** Nhiệt độ chỉ nằm một chỗ — `buildBody` tại `src/engine/ai.js:2765`. Gateway (`worker/index.js`) và admin KV không được thêm, ghi đè hay strip trường `temperature` của body; nếu cần đổi, đổi đúng một dòng đó và ghi chú lỗi thật kèm commit, đúng mẫu `51667a90`.

---

## 7.2 · Rule-10 nguyên văn — ba loại lỗi cấm

### 7.2.1 Nguyên văn (bắt buộc trong mọi bản thiết kế trích rule này)

Dưới đây là rule-10 nguyên văn trong `SYSTEM_PROMPT`, `src/engine/ai.js:1234` — trích đúng từng chữ, không biên tập:

```
10. CHINH TA TIENG VIET - BAT BUOC (audit lỗi thật 2026-10): viet DUNG chinh ta, co dau day du.
CAC LOI CAM — đã user gặp thật: (a) xáo chữ ký tự: «CỤ THỈL»→phải là «CỤ THỂ», «tinh bốt»→«tinh bột»;
(b) TRỘN TIẾNG ANH vào câu Việt: «refinery»→phải là «nhà máy lọc dầu» — TUYỆT ĐỐI KHÔNG chèn từ Anh/đa
ngữ vào câu Việt, từ kỹ thuật Anh phải dịch; (c) chèn ký tự lạ «nấm,-atiso»→«nấm, atiso».
QUY TẮC CHỐT: TRƯỚC KHI gửi — DOC LAI tung cau, moi tu phai la tieng Viet that (không ghép Việt-Anh,
không xáo chữ); từ khó lòng viết đúng → thay bằng từ đơn giản chắc chắn đúng (vd «CỤ THỂ» thay vì từ phức).
```

### 7.2.2 Bảng ba loại lỗi cấm — đều lấy từ lỗi thật, không lấy từ tưởng tượng

| # | Loại lỗi | Định nghĩa | Lỗi thật đã gặp | Sửa thành | Vì sao xảy ra |
|---|----------|-----------|-----------------|-----------|---------------|
| a | Xáo chữ ký tự | Chữ đúng nghĩa nhưng ký tự/dấu bị lệch — model chọn token hình dạng gần đúng | «CỤ THỈL», «tinh bốt» | «CỤ THỂ», «tinh bột» | Tiếng Việt có dấu khó tokenize; nhiệt độ cao (mục 7.1) kéo xác suất rơi vào token gần đúng |
| b | Trộn từ Anh/đa ngữ vào câu Việt | Chèn nguyên từ tiếng Anh (hay từ ngữ khác) vào giữa câu tiếng Việt thay vì dịch | «refinery» xuất hiện trong câu luận tiếng Việt | «nhà máy lọc dầu» | Model quen văn bản kỹ thuật đa ngữ; từ kỹ thuật Anh là lối tắt tự nhiên nếu prompt không cấm |
| c | Ký tự lạ chen giữa | Ký tự không thuộc chữ Việt đúng chuẩn xuất hiện trong câu — dấu, ký tự lạ, phép nối sai | «nấm,-atiso» | «nấm, atiso» | Token hoá dấu câu liền từ tạo khối lỗi; model phát lại khối lỗi nguyên xi |

Ba loại này **chốt không thêm loại thứ tư** (bẫy tại mục 7.9). Mỗi lần muốn thêm loại mới, câu hỏi đúng là: lỗi đó đã có người chơi thật gặp chưa, đã qua `log_error` chưa (mục 7.7)? Chưa có thì đó là giả định phòng hoá — ghi ở tài liệu phân tích riêng, không nhét vào rule-10. Rule cấm kiểu «phủ rộng để chắc» làm model tự kiểm sai, bỏ sót hoặc cấm cả câu đúng.

### 7.2.3 Quy tắc vận hành của rule-10

Rule-10 mang hai điều lệnh riêng ngoài bảng cấm:

- **Đọc lại từng câu trước khi gửi** — pseudo-code ở mục 7.3. Đây là điều lệnh «tự soi», không phụ thuộc công cụ ngoài.
- **Từ khó → từ đơn giản chắc đúng.** Nếu một từ mà model khó viết đúng dấu, thay từ đó bằng từ dễ viết hơn mang cùng nghĩa («CỤ THỂ» vẫn là ví dụ chuẩn của rule: từ đơn giản thay cho cụm phức dễ xáo). Chất chữ ưu tiên chắc chắn hơn ưu tiên hoa mỹ — đúng tinh thần rule 2 («ngôn ngữ thực dụng») và style `gan-guoi` (mục 7.4).

Bối cảnh kề rule-10: rule-9 (`src/engine/ai.js:1233`) cấm chữ Hán gốc Trung trong câu («一棵» → nói «cây bị ngập nước»), chỉ giữ tên Hán–Việt của sao và cách cục (Chinh Quan, That Sat). Hai rule này là một cặp: rule-9 quản *ngôn ngữ nào được dùng*, rule-10 quản *chữ viết ra có sạch không* — biên kịch persona không được tự đặt rule ngôn ngữ riêng lẻ làm mâu thuẫn cặp này.

---

## 7.3 · Pseudo-code «đọc lại trước gửi» (mẫu bắt buộc)

Đây là khuôn quy ước đưa vào `promptTemplate` của mỗi persona (mục 04 quản bộ `promptTemplate`), viết như chỉ dẫn trong prompt chứ không phải hàm server — lý do tại mục 7.9 bẫy (a). Biến `{{nguoi_goi}}` do persona nạp khi dựng prompt:

```
[QUY TRÌNH CHỮ — {{nguoi_goi}} BẮT BUỘC, NGAY TRƯỚC KHI KẾT THÚC LƯỢT TRẢ LỜI]
1. ĐỌC LẠI toàn bộ câu trả lời của mình, từng câu một, theo đúng thứ tự.
2. Với MỖI câu, tự hỏi ba câu hỏi — đúng 3 loại lỗi của rule-10:
   a) Có chữ nào bị xáo ký tự không (dấu sai, âm tiết sai, chữ đọc ra không có nghĩa)?
   b) Có từ tiếng Anh (hoặc ngôn ngữ khác) nào nằm trong câu tiếng Việt không?
      Có thì dịch ngay thành tiếng Việt.
   c) Có ký tự lạ nào chen giữa chữ không (dấu câu dính sai, ký tự lạ)?
3. Gặp từ khó lòng viết đúng dấu → thay bằng từ đơn giản chắc chắn đúng. Chất chữ
   chắc chắn hơn hoa mỹ.
4. Nếu còn một câu chưa qua ba câu hỏi trên → CHƯA kết thúc lượt. Hoàn tất kiểm
   rồi mới gửi câu cuối.
```

Chú ý ba điểm khi biên soạn persona:

- Khối trên là **chỉ dẫn trong prompt**, chạy ở tầng model — nó hướng dẫn model tự kiểm trong cùng một lượt tạo văn bản. Không viết nó thành bước code chạy sau stream rồi tự sửa chuỗi: sửa chuỗi máy móc ở server (spell-check, replace ký tự) thuộc loại bị cấm ở bẫy (a), vì không sửa được loại lỗi (a) mà còn hay phá câu đúng.
- Nơi thứ tự này có thể kiểm máy được một phần là lớp Neo self-check phía client (`master-ui.js`, chấm % khớp dữ liệu lá số sau khi stream xong) — nhưng Neo kiểm *khớp dữ liệu*, không phải chính tả; hai việc không thay nhau.
- Khi tạo persona mới, khối này không được viết lại bằng ngôn ngữ khác hay rút gọn — 20 hồ sơ trong bộ này dùng đúng một khối, để mỗi lần bảo trì chỉ cần sửa một chỗ rồi đồng bộ (quy trình đồng bộ ở mục 7.7).

---

## 7.4 · PERSONA × STYLE — ranh giới giọng và độ sâu thuật ngữ

### 7.4.1 Định nghĩa ranh giới (chốt cứng — 20 hồ sơ dựa vào đây)

- **PERSONA là giọng nhân vật:** xưng hô («con/thầy», «ta/ngươi», «bần đạo», «kẻ này»), tính cách thể hiện qua cách nói (ấm — lạnh — hóm — nghiêm), hình ảnh quen thuộc của nhân vật (trà, hạt giống, sổ sách, sông nước), cách mở câu, cách kết câu. Nguồn: `promptTemplate` của từng persona, quản ở **mục 04** của bộ này và `docs/gdd/06-npc-ai/06-18` (§1 xưng hô, §2 từ vựng và nhịp).
- **STYLE là độ sâu thuật ngữ:** model dùng thuật ngữ bát tự ở mức nào — dịch hết thành hình ảnh đời thường, hay giữ thuật ngữ kèm giải thích ngoặc, hay dùng thẳng thuật ngữ đầy đủ cho người rành. Nguồn: `STYLE_DIRECTIVES` tại `src/engine/ai.js:1182-1204`, bốn key có sẵn trong code.

Ranh giới vận hành bằng một câu: **persona quyết định AI nói như ai; style quyết định AI nói từ vựng ở tầng nào.** Một persona không được định nghĩa lại độ sâu thuật ngữ trong `promptTemplate` của mình (ví dụ không viết «luôn dịch hết thuật ngữ» trong persona của Thầy) — viết thế là persona tự chế một style thứ năm ngoài `STYLE_DIRECTIVES`, và từ đó mỗi lần đổi style mặc định thì hồ sơ này không theo được. Hồ sơ cần đổi độ sâu → ghi rõ **key style** muốn ghép (`gan-guoi`/`can-bang`/`chuyen-gia`/`nghien-cuu`), không tự viết chỉ dẫn thuật ngữ riêng. Đây là điều bắt buộc để 20 hồ sơ NPC của bộ này không tự chế.

### 7.4.2 Bảng bốn style có sẵn (bắt buộc, nguyên trạng `STYLE_DIRECTIVES` ai.js:1182-1204)

| Key style | Dòng code | Bản chất | Cách xử lý thuật ngữ | Ngữ điệu | Dùng cho ai |
|-----------|-----------|----------|---------------------|----------|-------------|
| `gan-guoi` (mặc định) | `ai.js:1183-1195` | Gần gũi — đối thuần | **Dịch mọi thuật ngữ ngay** thành câu thường + hình ảnh cụ thể: «thân vượng» → «bản chất con mạnh, kiên định, tự chủ»; «Dụng Mộc» → «Mộc = lớn dần, học hỏi, kế hoạch như cây non»; «Sát» → «áp lực/quyền lực»; «Đại vận» → «mười năm này»; «Lưu niên» → «năm nay» | Mở đầu chạm cảm xúc một câu («thầy hiểu con đang lo…»); giọng «con ạ» ấm áp; câu ngắn kiểu kể chuyện; khuyên = việc làm cụ thể | Người thường không rành phong thuỷ — mặc định của cả app |
| `can-bang` | `ai.js:1196-1198` | Cân bằng | Dùng thuật ngữ bát tự nhưng **giải thích nhanh trong ngoặc ngay sau**: «Thân vượng (tức mạnh, kiên định)» | Gọn gàng, không quá chuyên sâu | Người đang học, muốn vừa học tên cổ truyền vừa hiểu nghĩa |
| `chuyen-gia` | `ai.js:1199-1201` | Chuyên gia cổ pháp | Dùng **đầy đủ thuật ngữ chuyên ngành** (Thập Thần, Cách cục, Dụng Thần, Sát Ấn tương sinh, Thiên Đức, Cửu Sửu, Thiên Nhân…) | Phân tích sâu kỹ thuật, dáng nói người rành | Người rành cổ pháp, **không** giải thích nguyên bản thuật ngữ |
| `nghien-cuu` | `ai.js:1202-1204` | Trợ lý nghiên cứu (education variant) | Mỗi nhận định **phải kèm trích dẫn cổ bản** (tên kinh/quyết + số hiệu nếu có) | Không xưng «thầy», không gọi «con» — gọi «bạn»; thiếu dữ liệu thì nói rõ «theo dữ liệu hiện có chưa thấy», **không suy diễn**; giọng học thuật, trung tính | Người học tra cứu, hiểu bản vấn và thuật toán Tử Bình |

### 7.4.2-b Bảng ghép persona → style (chủ sở hữu DUY NHẤT của bảng ghép — mục này)

Bảng dưới là nơi DUY NHẤT của bộ ghép 20 persona canon vào 4 key style ở bảng 7.4.2; hồ sơ 17–36 và mọi mục khác khi nhắc ghép chỉ trỏ về đây, không dựng bản thứ hai. Quy tắc: ghép bằng key có sẵn trong bảng 7.4.2, không tự chế style mới; người chơi có thể đổi style của lượt Bàn Thầy (`can-bang`/`chuyen-gia` — hồ sơ 19), bảng này chốt GIÁ TRỊ MẶC ĐỊNH khi wire.

| Persona (id) | Style mặc định khi wire | Nguồn chốt |
|---|---|---|
| `thay_tubinh` | `gan-guoi` (mặc định chuỗi) | 06-04 thẻ kỹ thuật; hồ sơ 19 |
| `khong_tiensinh` | `can-bang` | 06-03:18; hồ sơ 18 |
| `van_coc` | `gan-guoi` | thẻ 06-02; hồ sơ 17 |
| `te_tuu` | `can-bang` | hồ sơ 22 |
| `huyen_hu` | `gan-guoi` | hồ sơ 23 |
| `maoshan_daonhan` | `gan-guoi` | hồ sơ 25 |
| `phan_quan` | `can-bang` | 06-09 C1; hồ sơ 28 |
| `diatang_su` | `gan-guoi` | hồ sơ 29 |
| `dan_dinh` | `can-bang` | 06-11:361; hồ sơ 35 |
| `phuong_si` | `can-bang` | 06-11 D1:569; hồ sơ 36 |
| `truong_thiensu` | `can-bang` (chỉ khi đã bật sau biên bản — luật 8) | hồ sơ 20 |
| `dieu_am` | `gan-guoi` | hồ sơ 21 |
| `truclam_thiensu` | không dùng 4 key — style override riêng của persona (`briefMode: 'none'`, hồ sơ 26 §26.5.3) | hồ sơ 26 |
| `khau_daotruong` | `can-bang` | 06-08 B1:263; hồ sơ 24 |
| `vu_y_amau` | `gan-guoi` | hồ sơ 30 |
| `lama_dakiet` | chưa ghi — kichban, chờ biên bản tham vấn (luật 8 mục 04 §4.2) | hồ sơ 27 |
| `gac_cong`, `tho_may`, `lo_ban_su`, `dinh_menh_hoi` | không ghép — `aiEnabled: 'khong'` (bark/kịch bản, không có lượt AI) | bảng mục 04 §4.3 |

Không persona nào của bộ 20 ghép mặc định `chuyen-gia`/`nghien-cuu` — hai key đó dành cho lượt tra cứu/ad-hoc khi người chơi tự chọn; đưa vào bảng chỉ khi một hồ sơ sau này chốt canon khác.

### 7.4.3 `gan-guoi` chi tiết — sáu điều lệnh (ai.js:1185-1194)

Style mặc định có sáu điều lệnh đánh số ngay trong chuỗi prompt, đây là bản tóm tắt đối chiếu:

1. **Không dùng thuật ngữ chuyên ngành mà không dịch ngay** (`ai.js:1185`) — thay bằng câu đối thường + hình ảnh cụ thể; bảng dịch chuẩn nằm ở rule-2 (`ai.js:1226`) và GDD 06-18 §3.
2. **Dùng hình ảnh cụ thể** (`ai.js:1190`) — «cây thiếu nước», «nhà móng vững nền», «con dao hai lưỡi (giỏi mà nguy hiểm)», «cửa vừa mở», «mùa gieo hạt»; người nghe phải *thấy* hình ảnh đó.
3. **Xoáy sau tâm lý** (`ai.js:1191`) — mở đầu một câu thể hiện cảm xúc («thầy hiểu con đang lo / hy vọng / sợ thất bại»), nói chạm lòng.
4. **Ấm áp gần gũi** (`ai.js:1192`) — «con ạ», «thầy nói thật nhe»; không lạnh như robot, không bài giảng.
5. **Câu ngắn kiểu kể chuyện** (`ai.js:1193`) — mỗi lời khuyên là việc làm cụ thể («nên Dụng Mộc» → «hãy sống có kế hoạch, học thêm một kỹ năng, kiếm nhận để lớn dần»).
6. **Vẫn chính xác, lấy từ brief/tool** (`ai.js:1194`) — chỉ *dịch* sang ngôn ngữ đối thường, **không bịa, không biện luận**. Điều 6 là hàng rào chống trôi: dịch thuật ngữ không phải phép thay đổi nội dung dữ liệu; số năm, can-chi, cách cục giữ nguyên như brief — cách hành xử này khớp luật nền «dữ liệu trước, giọng sau (T5)» và bộ lọc checkNeo (V7).

### 7.4.4 Ai gọi với style nào — quy ước mặc định

Luồng game gọi AI qua `master-ui.js`: dòng `master-ui.js:65` gọi `L.askAI(q, R, L.getConfig(), …)` **không truyền style** — nên style mặc định áp dụng ở tầng engine: `(STYLE_DIRECTIVES[style] || STYLE_DIRECTIVES['gan-guoi'])` tại `src/engine/ai.js:2750`. Nghĩa là: **Bàn Thầy và mọi khung «Thầy luận» hiện hành dùng `gan-guoi`** — đúng vì đại đa số người chơi app bói toán là người thường. Khi wire NPC canon (mục 04 định `promptTemplate`), bảng ghép mặc định 20 persona nằm **ngay tại mục này** (bảng 7.4.2-b ở §7.4.2 — chủ sở hữu duy nhất của bảng ghép); ví dụ: Thầy Tử Bình → `gan-guoi` (giọng thầy giáo ấm đã có sẵn tương hợp), Khổng tiên sinh → `can-bang` (06-03:18 — thuật ngữ kèm giải nghĩa nhanh, trần 120 chữ do lớp persona tự mang). Mục này chốt nguyên tắc: **ghép bằng key có sẵn trong bảng 7.4.2, không tự chế style mới**; muốn thêm style phải thêm vào `STYLE_DIRECTIVES` trong `ai.js` theo đúng quy trình đổi code, kèm test, không phải chỉnh hồ sơ.

---

## 7.5 · Giọng vùng — từ vựng và nhịp, không phải chính tả

### 7.5.1 Quy tắc cốt lõi

Giọng vùng (miền Nam, miền núi, vùng dân tộc) tạo bằng **TỪ VỰNG + NHỊP**, tuyệt đối không bằng cách nhại phát âm hay viết sai chính tả để «nghe giống». Đây là quy tắc đã chốt ở GDD 06-18 §1 và §5: thoại viết đúng chính tả tiếng Việt chuẩn; vùng miền hiện qua việc *chọn từ* («ăn cơm chưa», «nhé cháu», «về thì ghé cho bà còn chén») và *nhịp câu* (độ dài câu, cách ngắt, thứ tự vế). Lý do kỹ thuật trực tiếp: chính tả sai đâm thẳng vào rule-10 (mục 7.2) — «giọng miền núi» viết bằng chữ sai dấu là lỗi loại (a), bị rule tự mình cấm. Một quy tắc không được tự mâu thuẫn chính nó.

### 7.5.2 Chuẩn lồng tiếng và vai dân tộc

GDD 06-18 §4 (bảng lồng tiếng, dòng 173 của file `docs/gdd/06-npc-ai/06-18-cam-nang-giong.md`) quy định rõ với vai mang giọng vùng dân tộc: «giọng miền núi phía Bắc **tự nhiên** — không nhại; ưu tiên diễn viên người dân tộc nói tiếng Việt», kèm mục «tham vấn văn hoá trước khi thu»; checklist duyệt văn ở §6 (dòng 217) chốt «giọng vùng miền không nhại, đã tham vấn khi là giọng dân tộc thiểu số». Bản thiết kế này bám nguyên trạng: với NPC mang giọng dân tộc (vu_y_amau là ví dụ điển hình trong bộ), (1) thoại tiếng Việt chuẩn chính tả; (2) lồng tiếng ưu tiên diễn viên bản địa thật, không nhại giọng; (3) trước khi thu/bật runtime cho NPC tín ngưỡng/văn hoá đặc thù phải có biên bản tham vấn (luật nền của bộ, đã chốt ở 00-KINH-DIEN §2 T6 và 06-14 §4.1).

### 7.5.3 Điểm nối với rule-10

Giọng vùng là lớp *lựa chọn từ*, nằm trên nền chữ sạch của rule-10 — không thay thế, không mở ngoại lệ. Cùng một luật với mọi persona: từ khó lòng viết đúng dấu thì thay bằng từ đơn giản (điều lệnh cuối rule-10); nếu từ đơn giản đó lại là từ địa phương có chuẩn viết rõ (ví dụ «bầm», «ông bà nội», «cháu») thì dùng được — chuẩn viết, không phải chế chữ.

---

## 7.6 · Quy ước số rule của SYSTEM_PROMPT — 25 rule liên tục

### 7.6.1 Quy ước đánh số (ai.js:1209-1213)

Comment đầu `SYSTEM_PROMPT` tại `src/engine/ai.js:1209-1213` chốt quy ước:

```
// [ANTI-TRÉO v1 · RESTORE] SYSTEM_PROMPT cấu trúc rule: 1-22 LIÊN TỤC, KHÔNG trùng số.
//   ...
//   KHI THÊM RULE MỚI: dùng số TIẾP TỤC (23+). KHÔNG trùng số cũ. Renumber → sửa reference nội bộ.
```

Hai điều cứng: (1) đánh số **liên tục, không trùng, không renumber** — renumber làm vỡ mọi chỗ trích dẫn nội bộ («[R46]», «rule 6», «[loop 47]»…) và mọi tài liệu trích rule; (2) **rule mới dùng số kế tiếp**. Chú ý độ lệch nhỏ giữa comment và code thực tế: comment gốc (viết khi prompt còn 22 rule) ghi «23+»; hiện prompt đã dùng tới **25 rule** (rule 24 tại `ai.js:1389` — tổng hợp đủ nút não; rule 25 tại `ai.js:1396` — hành vi học chống sáo Barnum). Vậy quy ước đang sống là: rule kế tiếp dùng số **26+**. Bộ thiết kế này ghi đúng quy ước sống, không đổi comment trong ai.js trong đợt này (file `ai.js` đang khoá theo GAME-THIET-KE-CHOT §0.3).

### 7.6.2 Tóm tắt các nhóm rule (ai.js:1215-1400)

| Nhóm | Chủ đề | Dòng | Nội dung cốt |
|------|--------|------|--------------|
| 1-7 | Format trả lời | `ai.js:1225-1231` | Mở bằng 1-2 câu chốt luận rồi mới giải thích (r1); dịch thuật ngữ sang ngôn ngữ thực dụng (r2); tổng hợp chọn 2-3 điểm chính, không kể lại 20+ tầng brief (r3); trả lời đúng câu hỏi + thời điểm cụ thể, nói thẳng (r4); khuyên là việc làm được ngay + ngày thật lấy từ tool (r5); nói thật hung/cát (r6); giọng ấm như ông thầy dạy học trò (r7) |
| 8-10 | Thời gian hiện tại + ngôn ngữ + chính tả | `ai.js:1232-1234` | Đọc mục «THỜI GIAN HIỆN TẠI» của brief, không mặc định năm cũ (r8); chỉ tiếng Việt, cấm chữ Hán gốc Trung trong câu, chỉ giữ tên Hán–Việt của sao (r9); rule-10 chính tả ba loại lỗi cấm (r10 — mục 7.2) |
| 11-12 | Cá nhân hoá + kiểm chứng | `ai.js:1235-1239` | Chống «ba phải»: mỗi câu luan phải neo vào mệnh riêng, nếu bỏ khuyên cho 10 người giống nhau thì bỏ hoặc cá nhân hoá (r11); kiểm chứng bằng tool trước khi hùa theo nhận định của user — đúng thì xác nhận kèm bằng chứng, sai thì phản biện rõ (r12) |
| 13-14 | Anti-hallucination | `ai.js:1240-1250` | Brief chỉ có BaZi — cấm bịa cung Tử Vi, cấm thêm chi tiết đời user ngoài câu hỏi + brief, verify tên trong brief trước khi trích (r13); re-read brief đúng chủ đề user chỉ, không bóp méo hành động (r14) |
| 15-16 | Ứng kỳ + huyền học | `ai.js:1251-1301` | Hỏi «khi nào X» thì đọc các mục ứng kỳ đã tính sẵn trong brief, trích năm/tháng cụ thể, không bịa (r15); tuyệt đối không từ chối câu hỏi huyền học/tu luyện — luận theo hệ cổ truyền của app (r16) |
| 17-19 | Kham khít tầng sâu + cơ sở Dụng Thần + bí truyền | `ai.js:1302-1344` | Luôn kham khít các tầng sau khi trình bày (r17); luận Dụng Thần phải giải thích tại sao chọn — cơ sở từ strengthening/branches (r18); cấm kỵ/bí truyền: hệ bí truyền độc quyền, 27 tools, 32+ tầng brief — không lộ ngoài hệ (r19) |
| 20 | Sơ đồ náo thinking | `ai.js:1345-1370` | Framework luận mệnh dạng đồ thị: định vị → kết nối (link giữa sao, tàng can, tổ hợp kinh điển) → kiểm chứng → trả lời (r20) |
| 21 | Log lỗi khi sai | `ai.js:1371-1377` | Bị user sửa *đúng* → gọi tool `log_error` và in khối báo lỗi cuối câu trả lời cho user thấy; *đúng* thì defended bằng dữ liệu cụ thể, không xin lỗi (r21 — chi tiết tại mục 7.7) |
| 22-25 | Kỹ thuật + chuẩn đo + tổng hợp + hành vi học | `ai.js:1378-1400` | Đếm sao ở cả 4 trụ + tàng can trước khi kết luận «sao ít/vượng», chê lá số xấu thì kiểm lại theo từng chỉ số (r22); thang đo thống nhất + engine mới (r23); tổng hợp đủ nút não: năm vàng, cơ hội tài chính, kỵ thần cảnh báo (r24); hành vi học — neo nhận định vào nguyên lý corpus, cấm câu sáo Barnum không neo được vào trụ/sao cụ thể (r25) |

---

## 7.7 · Vòng phản hồi lỗi — log_error → admin → rule mới

### 7.7.1 Luồng chuẩn

Luồng phản hồi là vòng kín có bốn chặng:

1. **Người chơi sửa.** User nói «thầy luận sai», «không phải vậy», chỉ ra chỗ AI nói sai dữ liệu hay viết xáo chữ.
2. **AI tự log có cấu trúc.** Rule-21 (`ai.js:1371-1376`) bắt AI, sau khi kiểm lại thấy mình đúng là sai, gọi tool `log_error` — định nghĩa tool tại `ai.js:1589` và `ai.js:2930`; phần thực thi tại `ai.js:1937-1938` POST bản ghi JSON lên `/api/log-error` ngay trong lúc trả lời, kèm in một khối báo lỗi cuối câu trả lời để user thấy việc ghi nhận. Bản ghi mang các trường chuẩn: `wrong_claim`, `user_correction`, `root_cause` (`ai.js:1939-1941`). AI **không** xin lỗi khi chưa kiểm — rule-21 và rule-22 (E, `ai.js:1383`) cùng chốt «đúng thì defend bằng bằng chứng, sai thì nhận sai».
3. **Admin thu lỗi.** Các bản ghi log_error dồn về phía admin (KV của worker); admin đọc, nhóm lỗi, phân loại: lỗi dữ liệu (luận sai can-chi), lỗi chữ (xáo chữ, trộn tiếng Anh), lỗi hành vi (sáo Barnum, ba phải).
4. **Viết rào chắn mới.** Lỗi chữ → viết lại/thêm nội dung rule-10; lỗi dữ liệu → thêm mục brief hoặc rule neo dữ liệu; lỗi hành vi → thêm rule nhóm 22-25. **Commit `51667a90` là mẫu của chặng này**: lấy hai lỗi thật (xáo chữ «CỤ THỈL», «tinh bốt») và một lỗi trộn tiếng Anh («refinery»), viết thẳng vào rule-10 kèm hạ nhiệt độ — không viết rule chung chung kiểu «viết đúng chính tả» mà lỗi nào cũng không bắt được.

### 7.7.2 Quy ước cho đợt NPC-AI này

- Mỗi lỗi thật mới đi qua đúng một lần rào chắn: hoặc **mở rộng một rule hiện có** (như `51667a90` mở rộng rule-10), hoặc **thêm rule mới số 26+** (quy ước 7.6.1). Không viết rule trùng chủ đề vào hai chỗ.
- **Telemetry đếm lỗi theo persona ở mục 14** — bộ đếm lỗi (tần suất xáo chữ, trộn tiếng Anh, bịa dữ liệu) gắn theo persona đang chạy để biết persona nào cần siết. Mục này chỉ quy định: mọi phiên bản rule-10/rule-26+ sau này phải có số liệu telemetry làm căn cứ, không chỉnh rule theo một lỗi đơn lẻ chưa lặp lại.
- Việc sửa rule là sửa `ai.js` — đang khoá trong đợt này (GAME-THIET-KE-CHOT §0.3), nên nội dung NPC mới chỉ **trỏ tới** rule có sẵn (mục 7.4.1), mọi đề xuất sửa rule ghi vào mục 14 chờ mở khoá.

---

## 7.8 · Stream token dồn rAF — persona không tách câu giữa chừng

### 7.8.1 Cơ chế đã có trong code

UI khung «Thầy luận» không in từng token rời rạc; nó **gộp token theo khung hình** bằng `requestAnimationFrame`:

```js
// src/game/master-ui.js:65-72 (bản lược giản đúng cấu trúc)
const { source, text } = await L.askAI(q, R, L.getConfig(), {
  history, signal: abort.signal,
  // gộp token trong cùng khung hình: mỗi rAF chỉ vẽ một lần (token dồn cuối khung)
  onToken: (_d, full) => {
    rafText = full;                       // bản đầy đủ nhất tính tới
    if (!rafPaint) rafPaint = requestAnimationFrame(() => { rafPaint = 0; body.innerHTML = md(clean(rafText)); });
  },
});
```

Mỗi khung hình chỉ vẽ một lần trên bản văn bản *đầy đủ tính tới lúc đó* (`master-ui.js:68-72`). Stream còn có bộ cắt bảo vệ: TTFT timeout 75 giây, idle 45/90 giây chỉ cắt khi stream chết thật, retry mạng một lần (`ai.js:2897-2911` theo dữ liệu nền); huỷ stream bằng AbortController khi panel đóng (`master-ui.js:105-106`).

### 7.8.2 Hệ quả cho việc viết persona

Chữ hiện dần trên màn hình theo khung, nên **hình dạng câu do persona quyết định là hình dạng người chơi đọc**. Quy ước viết `promptTemplate`:

- **Không xuống dòng giữa câu, không chèn ký tự ngắt giữa cụm từ** — câu hoàn chỉnh kết bằng dấu câu đầy đủ; xuống dòng chỉ ở ranh giới đoạn. Nếu persona tự chẻ một câu dài bằng xuống dòng giữa chừng, khi stream chạy người chơi đọc thấy câu gãy đôi rồi nối lại — trải nghiệm chữ gãy dù chữ không sai.
- **Câu ngắn ưu tiên hơn câu dài** — khớp sẵn điều lệnh 5 của `gan-guoi` (`ai.js:1193`) và nhịp 8-14 chữ của các persona thiền (`06-18 §2`); câu ngắn cũng chống xáo chữ tốt hơn vì mỗi câu có ít token, model có ít dãy để lệch.
- **Đầu ra cuối lượt là câu chốt hoàn chỉnh** — stream cắt giữa chừng (timeout, huỷ) để lại văn bản chưa xong; persona mở đầu bằng câu chốt luận (rule-1, `ai.js:1225`) nên phần đã hiện luôn đứng vững về ý ngay cả khi phần sau chưa tới.

---

## 7.9 · Ba bẫy cần né + checklist duyệt

### 7.9.1 Ba bẫy của mục này

| Bẫy | Nội dung cấm | Vì sao |
|-----|--------------|--------|
| (a) Hạ temp / spell-check server | Không hạ nhiệt độ dưới 0.55 và không thêm spell-check/replace chuỗi tự động ở gateway hay server (giữ đúng một dòng `ai.js:2765`) | 0.55 đã chốt bằng lỗi thật + commit `51667a90`; hạ thêm phá giọng persona (mục 7.1.3). Spell-check máy không sửa được loại lỗi (a) — nó chỉ biết thay từ «gần giống», dễ phá câu đúng và che dấu liệu telemetry |
| (b) Giọng vùng = lỗi chính tả | Không viết sai chính tả để «tạo giọng» vùng/dân tộc | Đâm thẳng rule-10 loại (a); giọng vùng tạo bằng từ vựng + nhịp (mục 7.5, 06-18 §1) |
| (c) Thêm loại thứ 4 vào rule-10 | Không thêm loại lỗi mới vào rule-10 nếu chưa có người chơi thật gặp và chưa qua log_error | Rule-10 đúng 3 loại lấy từ lỗi thật; thêm loại không có bằng chứng làm model tự kiểm sai (mục 7.2.2) |

### 7.9.2 Checklist duyệt một hồ sơ NPC mới trước khi wire

- [ ] `promptTemplate` có đúng khối «QUY TRÌNH CHỮ» (mục 7.3), không viết lại bằng ngôn ngữ khác.
- [ ] Hồ sơ không tự định nghĩa độ sâu thuật ngữ — chỉ trỏ key style trong bảng 7.4.2.
- [ ] Giọng vùng (nếu có) tạo bằng từ vựng + nhịp; thoại soát chính tả chuẩn; NPC dân tộc đã ghi yêu cầu diễn viên bản địa + tham vấn.
- [ ] Nhân vật không được trích rule/độ sâu style ngoài `ai.js:1182-1204` và `ai.js:1215-1400`.
- [ ] Đề xuất sửa rule (nếu có) ghi ở mục 14 chờ telemetry + mở khoá `ai.js`, không sửa trực tiếp.
- [ ] Ba loại lỗi của rule-10 dùng đúng ba ví dụ chuẩn («CỤ THỈL», «refinery», «nấm,-atiso») khi đào tạo/brief lại hồ sơ — không dùng ví dụ bịa.

---

*Bản ghi mở đầu mục theo quy ước bộ: tóm tắt ở §7.0. Mục liền kề: 04 (PERSONA và promptTemplate), 06 (xưng hô chéo), 14 (telemetry lỗi). Dữ liệu nền: đọc trực tiếp `src/engine/ai.js`, `src/game/master-ui.js`, `docs/gdd/06-npc-ai/06-18-cam-nang-giong.md`, `git show 51667a90` trong session ngày 2026-11-08.*
