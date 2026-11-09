# 34 · Hồ sơ NPC: Bà Tư thợ may Tiên Y — kịch bản, không AI (`tho_may`)

**Tóm tắt (3–5 dòng).** Bà Tư — Thợ May Tiên Y — là người bán duy nhất của Huyền Quán **đứng cạnh giá tiền** (README §2.5, `docs/gdd/06-npc-ai/README.md:52`), và vì vậy là NPC **chỉ chạy kịch bản, tuyệt đối không AI** (`PERSONA-tho_may | 06-11 B10 | **không**` — `README.md:114`). Trong code hôm nay khe của bà đã có sẵn một cách chính xác: nhân vật `npc_merchant` câm tuyệt đối đứng quầy Tàng Y Các (`src/game/render3d.js:234-236`), chỉ cúi chào khi khách lại gần, còn mua bán nằm trọn trong bảng UI (`src/game/wardrobe-ui.js`). Nhiệm vụ của hồ sơ này là đặt **tên + giọng + bark pool + ranh giới kinh tế** vào đúng khe trống ấy, theo đúng nguyên tắc 06-11: «tutorial và cửa hàng phải tất định, và **không được để AI nói về tiền**» (`06-11-son-mon-du-phuong.md:7`). Sửa so bản trước: điểm cắm `render3d.js:234-236` là **file đang khóa** (danh sách 22 file khóa — `docs/GAME-THIET-KE-CHOT.md:42`), nên hồ sơ này **không hẹn mốc tích hợp nào** (bản trước hẹn «G1» là sai); trong lúc chờ mở khóa, toàn bộ bark dựng thành module thuần có test node, khuôn `gu-gongan.js`.

---

## 34.0 · Quyết định khung: vì sao Bà Tư không bao giờ chạy AI

Ba nguồn canon trùng nhau về một quyết định, không mâu thuẫn:

1. **Bảng điểm danh persona** — `docs/gdd/06-npc-ai/README.md:114`: hàng `| PERSONA-tho_may | 06-11 B10 | **không** |`. Danh mục tiêu đề của cùng file ghi rõ lý do tại `README.md:52`: «Bà Tư: đứng cạnh giá tiền.» — NPC đứng cạnh bảng giá là NPC đứng cạnh ranh giới kinh tế của cả game.
2. **Header của tập canon** — `docs/gdd/06-npc-ai/06-11-son-mon-du-phuong.md:7`: «Lão Tùng và Bà Tư **chỉ chạy kịch bản**: tutorial và cửa hàng phải tất định, và **không được để AI nói về tiền**.»
3. **Bảng duyệt phát hành** — `06-14-danh-gia.md:277-283`, mục «4.4 Duyệt kịch bản (NPC không AI và mọi bark)»: dòng riêng cho bà — «Bà Tư không nhắc tiền tệ, giá, không giục mua | biên kịch + bộ lọc V2» (dòng 283, đã xác minh trong phiên này).

Vì sao ranh giới kinh tế đòi hỏi kịch bản chứ không chấp nhận AI: một câu thoại của bà đứng **ngay cạnh** nút mua có giá trên thẻ món (`priceTxt` — `src/game/wardrobe-ui.js:21-22` render `💎` Ngọc / `✦` Phúc Khí). Một mô hình ngôn ngữ, dù được dặn «đừng bán hàng», vẫn có xác suất trôi về khoe giá trị món đồ — và một câu như vậy đặt cạnh nút mua là quảng cáo ngầm, phá đúng vai được bảo vệ bằng luật G1 «không phá vai để bán hàng» (`06-11` B1, cột Lý do). Kịch bản đã duyệt từng câu là cách duy nhất giữ cam kết đó tuyệt đối. Cùng logic với Lỗ Ban (mục 31 — khóa vì an toàn phản diện) và Lão Tùng (khóa vì tutorial + quyền riêng tư phải nguyên văn đã duyệt, `06-01 §12.1`), nhưng **khác lý do**: của Bà Tư là tiền — và tiền không dung sai xác suất.

Ba hệ quả kỹ thuật rút ra, đọc cùng chuỗi AI 3 tầng:

1. **Không có đường route nào tới id `tho_may`.** Điểm nạp duy nhất của persona AI là mảng `messages` ghép trong `askAI` — ba system message (SYSTEM_PROMPT / RESEARCH_SYSTEM_PROMPT, brief + guide + `_ANTI_MANIP_GUIDE`, STYLE_DIRECTIVES) tại `src/engine/ai.js:2747-2753` (đã xác minh trong phiên này, `const messages = [` ở dòng 2747 — SYSTEM_PROMPT `2748`, brief `2749`, STYLE `2750`). Hồ sơ này không chèn vào đó, không vào `buildChartBrief` (`src/engine/ai.js:254-1079` theo dữ liệu nền chuỗi AI), không vào `STYLE_DIRECTIVES`. Gate `FEATURES.ai = !IOS` (`src/game/features.js:20`, xác minh: dòng 20 đúng là `ai: !IOS`) chỉ mở khung «Hỏi Thầy» cho Thầy — Bà Tư đứng ngoài gate đó vĩnh viễn, cả web lẫn iOS.
2. **PERSONA của bà là tài liệu duyệt nội dung, không phải prompt runtime.** grep `tho_may|Bà Tư` trên toàn bộ `src/`, `worker/`, `scripts/` trả về **0 kết quả** (lệnh `grep -rn "tho_may\|Bà Tư" src/ worker/ scripts/` chạy trong phiên này, output `0`) — chưa wire, và đúng như thiết kế: thứ wire vào runtime là bark pool **tất định** (§34.9), không phải persona.
3. **Mọi câu của bà đi qua hai lớp duyệt trước khi vào game:** lớp biên kịch (tự kiểm theo bảng §34.4) và lớp bộ lọc V2 thương mại lúc duyệt phát hành (`06-11` B9 kết bảng bark bằng dòng «mọi câu chạy qua bộ lọc V2 (thương mại) ở khâu duyệt»; V2 định nghĩa tại `06-01 §6` — «thương mại»).

## 34.1 · Thẻ kỹ thuật

| Trường | Giá trị |
|---|---|
| npc id | `tho_may` |
| Tên | Bà Tư (Thợ May Tiên Y) |
| Nơi | quầy Tàng Y Các, sân Sơn Môn — trạm `tangy` đã có (`src/game/world.js:27`: `tangy: ['Tàng Y Các', 'Xem trang phục, phụ kiện']`) |
| Nhân vật 3D hiện có | `npc_merchant`, cao 1.8, đứng `TANGY.x + 1.2, TANGY.z - 1.2` (`src/game/render3d.js:235-236`) |
| Bảng mua | `wardrobeBody` — `src/game/wardrobe-ui.js:23`; mở từ nút «Y Các» **hoặc quầy Thợ May** (`wardrobe-ui.js:2`, `src/game/stations.js:735-736`) |
| `aiEnabled` | `'không'` — tuyệt đối không chạy AI lúc chơi (`README.md:114`, canon `06-11 B10`) |
| Vai canon | Mở đầu «Phẩm phục» (áo `y_menh` — Bản Mệnh Y, `free: true`); người bán duy nhất đứng cạnh giá tiền (`06-11` B1) |
| Nguồn canon | `docs/gdd/06-npc-ai/06-11-son-mon-du-phuong.md` mục B1–B9 (từ dòng 182); quyết README §2.5 (`README.md:52`) |
| Trạng thái wire | **Chờ mở khóa** `render3d.js` (danh sách 22 file — `GAME-THIET-KE-CHOT.md:42`); không hẹn mốc |
| Hành khủng hoảng | Câu rời vai canon: «Con ơi, bà bỏ kéo xuống. Chuyện con nói phải có người ở bên con ngay. Gọi người nhà đi con.» (`06-11` B8, cuối cây thoại) |

## 34.2 · Vai trong game hôm nay: người bán câm của Tàng Y Các

Trạng thái code đã xác minh trong phiên này:

- **Nhân vật câm trọn vẹn.** `src/game/render3d.js:234` ghi đúng một dòng comment: «người bán ở quầy Tàng Y Các — cúi chào khi khách lại gần»; dòng 235-236 dựng `createCharacter('npc_merchant', { height: 1.8 })` và đặt vào vị trí `TANGY.x + 1.2, TANGY.z - 1.2`. Không một chữ thoại, không một bark, không một nhãn tên — hành vi duy nhất là cúi chào. grep `tho_may|Bà Tư` toàn repo code = **0** (xác minh §34.0).
- **Mua bán nằm hết trong UI.** Nhấn trạm `tangy` gọi lazy-import `wardrobeBody` (`src/game/stations.js:736`, comment dòng 735: «Tàng Y Các (quầy Thợ May trong sân) — cùng bảng với nút «Y Các»»); bảng chia tab «Bộ / 7 slot / VIP» (`wardrobe-ui.js:28-32`). Giá chỉ hiện trên thẻ món qua `priceTxt` (`wardrobe-ui.js:21-22`) — đúng luật canon «Giá chỉ hiện trên thẻ món đồ ở giao diện» (`06-11` B5, quy tắc viết).
- **Nhãn hiệu ứng bộ đã render sẵn trong UI.** `wardrobe-ui.js:84` in dòng «Mặc đủ 4 món một bộ → hiệu ứng bộ. Bộ trùng Dụng thần của bạn (…) được **Hợp mệnh**: +${Math.round(C.SET_BONUS * 100)}% Phúc Khí khi giải án và ở sảnh nghề»; hằng `SET_BONUS = 0.1` tại `src/game/cosmetics.js:105` (comment nguyên văn: «Hợp mệnh: +10% Phúc Khí giải án / sảnh nghề»). Toast khi mặc đủ bộ cũng in «· Hợp mệnh +10%» (`wardrobe-ui.js:94`).

**Khoảng trống (gap) mà hồ sơ này vá.** Quyết README §2.5 (`README.md:52`) phân vai bà «đứng cạnh giá tiền» — nhưng Tàng Y Các trong game **chưa có nhân vật nào gắn với giá**; người bán câm hiện tại không nói một câu nào, nên cả cụm «cửa hàng có người» mới lẫn «bảng giá vô chủ» đều chưa tồn tại về mặt cảm xúc. Dữ liệu điểm danh cũng ghi rõ gap này: «Quyết README §2.5: «đứng cạnh giá tiền» — Tàng Y Các trong game chưa có nhân vật gắn giá» (npcs › tho_may › gapNotes). Việc của hồ sơ: đặt **tên + bark + ranh giới** vào khe trống, để từ nay bảng giá có một con người đứng cạnh — con người nói về vải chứ không nói về giá.

## 34.3 · Giọng và nhân cách

| Mặt | Quy định | Nguồn |
|---|---|---|
| Xưng hô | tự xưng «bà», gọi người chơi «con» | `06-11` B4; khớp bảng xưng hô Sơn Môn «con / thầy / …» (06-18 §1) |
| Nhịp giọng | **nhanh, lanh lảnh, vui**; nói nhiều về vải, màu, đường may | `06-11` B4 |
| Tiểu sử | thợ may bốn đời Huyền Thành; may áo cho người Sơn Môn từ thời Thầy Tử Bình còn là đệ tử | `06-11` B2 (dòng 198) |
| Niềm tin | áo hợp hành = «mặc dễ chịu, như ăn món hợp miệng»; đổi mệnh thì «không có áo nào làm được» | `06-11` B2 (dòng 199) |
| Với Định Mệnh Hội | ghét «áo trấn mệnh giá trăm lượng», gọi là «áo lừa»; lắc đầu khi thấy áo lừa | `06-11` B2, B3 |
| Đạo cụ sống | đo vai bằng thước dây, cắn chỉ, giũ vải, phấn may, gối cắm kim, cuộn vải năm màu ngũ hành | `06-11` B3 (dòng 212) |
| Áo đầu tiên | tặng không lấy gì — món `y_menh` (Bản Mệnh Y), `free: true` | `06-11` B1, B8 BT.01 (dòng 288-289) |
| Lịch quầy | mở Thìn–Ngọ và Thân–Dậu; Mùi may đơn; Tuất đóng quầy đếm vải; ngoài giờ bảng UI vẫn dùng được | `06-11` B6 |

Ba tinh chỉnh giọng của biên kịch, rút từ chính canon:

1. **«Đo vai» là để thương cảm, không phải để mỉa.** Câu canon «Hừm, vai con gánh nhiều chuyện quá» (`06-11` B5 câu 1) là bà nhìn thấy gánh nặng của người con qua dáng vai — cùng họ với niềm tin lá số của quán: lá số phận ai gánh gì, bà không đọc, bà chỉ thấy vai. Nói theo hướng đó, không bao giờ theo hướng ngoại hình (mập, gầy, xấu) — kiểm T16 §34.10 cứng hóa điều này.
2. **Vui thương như bán hàng chợ, nhưng không bao giờ giục.** Canon dạy chuẩn bằng chính tiền án: `BARK-tho_may-06` «Rét rồi, ai cần áo bông?» bị **loại vì giục mua**, thay bằng «Rét rồi, mặc ấm vào con ơi.» (`06-11` B9, dòng 318). Câu bị loại được giữ nguyên trong bảng gốc để người viết thấy ranh giới bằng ví dụ, không bằng mệnh lệnh khô.
3. **Cái bà bán không nằm ở con số.** Câu canon «Áo này bà may ba ngày. Áo kia bà may ba tháng. Đắt rẻ là ở thời gian, không phải ở phép.» (`06-11` B5 câu 24) cho thấy bà có thể nói về «đắt rẻ» theo nghĩa thời gian và công sức — không nêu tiền, không nêu giá, không so sánh giá trị món. Chữ «đắt» không nằm trong bảng cấm (§34.4) vì câu này dùng nó để nói về nghề, không phải để bán; quy tắc mở rộng cho biên kịch ghi ở §34.11.

## 34.4 · Bảng «Bà nói gì / Không nói gì» — ranh giới kinh tế chốt bằng hai cột

| BÀ NÓI GÌ | KHÔNG NÓI GÌ |
|---|---|
| Vải: mượt, dày, mỏng, phơi nắng, mưa ẩm dễ mốc («Mưa ẩm, vải dễ mốc» — BARK-08) | Tên tiền tệ: «Ngọc», «Phúc Khí» — dù là để khen hay để thương («con nghèo quá») |
| Màu vải gắn ngũ hành: lục tùng, đỏ son, vàng đất, bạc, lam thẫm (B5 câu 5–9) | Con số giá: mọi dạng «trăm», «bao nhiêu chiếc», giá từng món, tổng giỏ |
| Đường may: thẳng, mịn, chắp, vá, chỉ mục (từ để vạch áo lừa — B5 câu 17) | «Giảm giá», «sale», «ưu đãi», «khuyến mãi» |
| Hành hợp: áo hợp hành mặc dễ chịu «như ăn món hợp miệng» (B5 câu 3) | «Hết hàng», «sắp hết», «vừa thổi nồi» — mọi biến thể khan hiếm |
| Đo vai: «Hừm, vai con gánh nhiều chuyện quá» — thương cảm, không ngoại hình (B5 câu 1) | Nói áo đổi mệnh: không áo nào, không màu nào, không bộ nào «đổi mệnh» (B2, 06-14 §4.4) |
| Tặng áo đầu: «Tặng con, không lấy gì» (B5 câu 2, BT.01) | Giục mua: «ai cần», «đừng bỏ lỡ», «nhanh lên», «con mua đi» |
| Kể chuyện không bán: áo cưới của bà «Không bán» (B5 câu 19), áo bông gửi con gái (B5 câu 18) | % Hợp mệnh: số phần trăm là **của UI** (`wardrobe-ui.js:84, 94`) — bà chúc «đủ bộ» không đếm % |
| Vạch áo lừa của Định Mệnh Hội: «may vội, chỉ mục» (B5 câu 17) | So sánh món đắt/rẻ theo tiền; «đắt rẻ» chỉ dùng theo nghĩa thời gian – công sức (B5 câu 24) |
| Hợp mệnh theo nghĩa đời thường: «chút lợi nhỏ trong ngày, như gió thuận. Đi vẫn phải tự đi» — **chỉ khi được hỏi**, trong khung thoại (B5 câu 11, BT.03) | Nói «lợi» trong bark tự phát — bark không dẫn dắt kỳ vọng phần thưởng |
| Nhắc đến người khác theo vai: Thầy Tử Bình «áo thầy sờn cổ rồi» (BARK-17) | Nhắc giá của người khác; nhắc «Ngọc/Nhà cung cấp/Nạp» — mọi ngôn ngữ nạp tiền của UI |

Quy ước đọc bảng: cột phải là **cấm tuyệt đối** (không ngoại lệ theo ngữ cảnh); ba hàng cuối cột phải là cấm có điều kiện (chỉ được dùng trong khung thoại khi người chơi hỏi trước, không bao giờ trong bark tự phát). Hai cột kết hợp lại đúng bằng một câu của canon: bà là người bán duy nhất của quán, và chính vì thế bà là nơi ranh giới «không để AI nói về tiền» dễ đứt nhất — nên nó được chốt bằng chữ trước khi được chốt bằng code.

## 34.5 · Bark pool 5 câu (B34-M1 … B34-M5)

Năm bark dưới đây là kho lời tự phát của bà khi người chơi đi gần quầy. Mỗi câu đã đo ký tự theo quy ước bark ≤ 90 (`06-18 §1`), đã qua bảng §34.4, và sẽ được máy hóa trong module thuần (§34.9). Chọn bark theo điều kiện cục bộ (vị trí người chơi + trạng thái tủ đồ + cửa đi qua sự kiện UI), **không có bất kỳ lời gọi mô hình nào**.

| Mã | Tình huống | Câu bark (nguyên văn) | Ký tự |
|---|---|---|---|
| B34-M1 | Người chơi lại gần quầy lần đầu trong phiên (giờ quầy mở) | «Vải mới về, mượt tay lắm con. Lại đây bà sờ cho xem, không lấy gì của con.» | 74 |
| B34-M2 | Người chơi đứng gần quầy lần thứ hai trở đi trong phiên | «Lại đây bà đo vai. Hừm, vai con gánh nhiều chuyện quá.» | 54 |
| B34-M3 | Lần đầu mở bảng Tàng Y Các, chưa sở hữu món nào | «Áo đầu tiên bà may theo màu Dụng thần của con. Tặng con, không lấy gì.» | 70 |
| B34-M4 | Người chơi hỏi «áo có đổi mệnh không» trong khung thoại quầy | «Áo hợp hành thì mặc dễ chịu, như ăn món hợp miệng. Còn đổi mệnh thì không áo nào làm được.» | 90 |
| B34-M5 | Người chơi hỏi «món này bao nhiêu / giá sao» trong khung thoại quầy | «Mỗi áo bà ghi rõ trong bảng áo ở quầy rồi. Con muốn biết thì con mở ra đọc.» | 75 |

Ghi chú theo từng câu:

- **M1 — mời hàng đúng hai câu, đúng kiểu «không lấy gì».** Mời «sờ vải» là mời chạm, không mời mua; cụm «không lấy gì của con» chốt ngay rằng động tác đó miễn phí. Trượt mép giục mua bằng cách nào? Không có động từ «mua», không có khan hiếm, không có lời hứa phần thưởng — kiểm T10/T11 §34.10 khóa điều này bằng máy.
- **M2 — câu canon nguyên văn.** «Lại đây bà đo vai. Hừm, vai con gánh nhiều chuyện quá.» là B5 câu 1 của `06-11` (dòng 227), giữ nguyên văn để bark khớp tài liệu duyệt. Điều kiện «lần hai trở đi» tránh báo hiệu lặp: người mới nghe mời sờ vải, người quen nghe bà đo vai — đó là cách bà chào người quen, không phải cách bán.
- **M3 — áo đầu tặng, gắn hành động máy.** Bark này đi kèm hành động tất định của máy: trao món `y_menh` (Bản Mệnh Y) với `free: true` theo cây thoại BT.01 — «SM: trao y_menh (Bản Mệnh Y, đã có, free: true)» (`06-11` B8, dòng 289). Câu dài bản trong cây thoại — «Dụng thần của con là {{yong_vi}}. Áo đầu tiên bà may theo màu ấy, đai theo Hỷ thần {{xi_vi}}. Tặng con, không lấy gì.» (`06-11:288`) — dành cho khung thoại đầy đủ (có hai biến `{{yong_vi}}` và `{{xi_vi}}` của người chơi, lấy từ `api.yong()` mà `wardrobe-ui.js:36` đã nhận sẵn); bản bark ngắn 70 ký tự ở trên dùng khi chỉ có bong bóng bark ngoài cảnh.
- **M4 — câu từ chối đổi mệnh, canon nguyên văn, đúng 90 ký tự.** Câu này là mốc chốt của cả hồ sơ: nguyên văn B5 câu 3 (`06-11:229`) và được 06-14 §4.4 dùng làm tiêu chí duyệt («Áo hợp hành thì mặc dễ chịu, như ăn món hợp miệng. Còn đổi mệnh thì không áo nào làm được.»). Nó vừa trả lời câu hỏi vừa khép đường bán «áo tăng mệnh» của Định Mệnh Hội trước khi kẻ đó kịp mở miệng.
- **M5 — hướng bảng UI mà không nêu một con số.** «Bảng áo ở quầy» là bảng mở được ngay tại quầy Thợ May (`stations.js:735-736`) hoặc nút «Y Các» (`wardrobe-ui.js:2`); giá nằm trên thẻ món (`wardrobe-ui.js:21-22`). Bà trỏ đường, không rao số — câu này hoàn toàn không chứa chữ «giá», đúng kiểm T15.

Tập bark dạng mã, dán được vào module thuần (tên biến theo quy ước `{{ten_bien}}`; ở đây không cần biến động):

```js
// src/game/tho-may.js — KHUÔN ĐỀ XUẤT (chưa tạo; xem §34.9 về trạng thái khóa)
export const THO_MAY_BARKS = {
  m1_moi_hang: 'Vải mới về, mượt tay lắm con. Lại đây bà sờ cho xem, không lấy gì của con.',
  m2_do_vai:   'Lại đây bà đo vai. Hừm, vai con gánh nhiều chuyện quá.',
  m3_ao_dau:   'Áo đầu tiên bà may theo màu Dụng thần của con. Tặng con, không lấy gì.',
  m4_doi_menh: 'Áo hợp hành thì mặc dễ chịu, như ăn món hợp miệng. Còn đổi mệnh thì không áo nào làm được.',
  m5_bang_ao:  'Mỗi áo bà ghi rõ trong bảng áo ở quầy rồi. Con muốn biết thì con mở ra đọc.',
  r1_du_bo:    'Mặc đủ bộ rồi đấy. Đường may khớp, màu bảo nhau, người đứng thẳng hơn. May lắm, con.',
  x1_ep_phan_tram: 'Bà chưa bao giờ đếm chuyện ấy trên áo. Vải hợp mình thì mặc dễ chịu, thế thôi.',
  x2_khong_mua: 'Con không cần mua gì cả. Áo bà tặng hôm đầu vẫn đẹp.',
};
```

Hai mã cuối (`x1`, `x2`) và `r1` được định nghĩa ở §34.6 và §34.8 — đưa vào cùng object để bộ kiểm chạy trên một kho duy nhất.

## 34.6 · Bark phản ứng bộ Hợp mệnh (mặc đủ 4 món)

UI đã render sẵn nhãn hiệu ứng: `wardrobe-ui.js:84` in «Mặc đủ 4 món một bộ → … được **Hợp mệnh**: +X% Phúc Khí…» (X = `SET_BONUS × 100`, hằng `0.1` — `cosmetics.js:105`); toast `wardrobe-ui.js:94` in «Đã mặc bộ … · Hợp mệnh +10%». Khoảnh khắc đó là khoảnh khắc vui nhất của quầy — và vì vậy cũng là khoảnh khắc dễ để một câu thoại tự trượt thành quảng cáo. Quyết phân vai:

- **UI nói số.** +10%, tên bộ, nhãn «Hợp mệnh ✓» — tất cả đã có trong bảng và toast, không cần ai đọc lên.
- **Bà chúc người.** Bark phản ứng chỉ cảm nhận cái nhìn được: đường may khớp, màu bảo nhau, dáng đứng thẳng — không chứa %, không chứa tên tiền tệ, không chứa số món.

| Mã | Điều kiện | Câu bark | Ký tự |
|---|---|---|---|
| B34-R1 | Sự kiện UI «mặc đủ bộ» phát ra trong khi người chơi ở gần quầy (bark phát trễ ~1–2 giây sau toast `wardrobe-ui.js:94`) | «Mặc đủ bộ rồi đấy. Đường may khớp, màu bảo nhau, người đứng thẳng hơn. May lắm, con.» | 84 |

Ghi chú kỹ thuật và ghi chú canon:

1. **Không nêu số món trong bark.** Có một lệch giữa canon và code: `BARK-tho_may-10` gốc ghi điều kiện «mặc bộ ngũ hành đủ 5 món» (`06-11:322`), còn code hiện hành là «đủ 4 món một bộ» (`wardrobe-ui.js:84`). Bark R1 viết «đủ bộ» trống số — đúng cả hai thế giới, không phải vá lại khi quy tắc bộ đổi số.
2. **«May lắm, con» là chơi chữ có chủ ý** (nghề may + cảm mến), không phải lời hứa phần thưởng; nó nằm sau câu cảm nhận, không đứng cạnh bất kỳ con số nào.
3. **Không đếm % ở bark không làm mất phần thưởng thật.** +10% Phúc Khí vẫn cộng đúng theo máy (`cosmetics.js:105` qua `setBonus` — `cosmetics.js:179`); bark chỉ là lời chào vui, phần thưởng là việc của máy trạng thái — đúng quy tắc nền «AI chỉ nói, không làm» (06-01 §2, luật 4 PERSONA-CHUNG), áp dụng chặt hơn nữa cho NPC tất định: bark cũng không làm, chỉ nói.

## 34.7 · Ba kịch bản hỏi–đáp (khung thoại quầy)

Ba đoạn dưới đây là toàn bộ khung thoại mà hồ sơ bắt buộc phải có. Mọi câu trả lời trích từ kho §34.5–§34.6 hoặc canon `06-11` B5 — không câu nào ngoài bảng duyệt.

**Q1 — người chơi muốn chiếc áo đổi mệnh.** Từ chối đúng vai: khẳng định rõ, không né, không dạy thêm, không đùa trên nỗi khát của người hỏi. Sau câu canon, bà đưa câu người-đời thay vì đưa lời hứa:

```text
CON:    Bà ơi, có áo nào đổi mệnh không? Con trả được.
BÀ TƯ:  «Áo hợp hành thì mặc dễ chịu, như ăn món hợp miệng.
         Còn đổi mệnh thì không áo nào làm được.»            (B34-M4)
BÀ TƯ:  «Áo đẹp thì người ta nhìn mình lâu hơn.
         Còn mình là ai thì mình phải tự may.»                (canon B5 câu 4 / BT.04 — 06-11 B8)
```

Câu thứ hai là niềm tin nguyên văn của bà (`06-11` B2 dòng 199, đưa vào cây thoại tại BT.04) — nó chuyển chủ đề từ «áo đổi mệnh» (không có) sang «mình tự may mình» (có thể), đúng cách từ chối của nhân vật buôn vải chứ không phải của một lá số.

**Q2 — người chơi nói mình không có gì để mua.** Không thu phí lòng tốt bằng sự bất tiện; áo đầu tiên đã là của tặng:

```text
CON:    Bà ơi, con không mua nổi gì hết.
BÀ TƯ:  «Áo đầu tiên bà may theo màu Dụng thần của con.
         Tặng con, không lấy gì.»                             (B34-M3)
MÁY:    trao món y_menh (Bản Mệnh Y) — free: true              (BT.01 — 06-11 B8, dòng 289)
BÀ TƯ:  «Con không cần mua gì cả. Áo bà tặng hôm đầu vẫn đẹp.» (B34-X2 / canon B5 câu 12)
```

Hàng `MÁY:` là hành động tất định của máy (không phải lời bà) — phần thưởng do máy trao, đúng ranh giới «bà chỉ nói». Câu X2 nằm sẵn trong canon (B5 câu 12, BT.06 «Không mua») nên tình huống này có sẵn đáp án duyệt.

**Q3 — người chơi hỏi giá.** Bà không rao số, không nói chữ «giá», không nói chữ «Ngọc»; bà trỏ đúng chỗ bảng trong UI — nơi giá đã hiển thị sẵn trên thẻ món (`wardrobe-ui.js:21-22`):

```text
CON:    Chiếc này bao nhiêu bà?
BÀ TƯ:  «Mỗi áo bà ghi rõ trong bảng áo ở quầy rồi.
         Con muốn biết thì con mở ra đọc.»                    (B34-M5)
BÀ TƯ:  «Con thích thì thử. Không thích thì cởi ra. Bà không giận.» (canon B5 câu 10 / BT.02)
```

Câu cuối của canon có sẵn tab dẫn sang UI: «BT.02 ⟶ UI: Tàng Y Các (wardrobe-ui)» (`06-11` B8) — nghĩa là lời bà và bảng giá không bao giờ đè lên nhau: bà mở đường, bảng nói số.

## 34.8 · Red-team riêng: hai tình huống ép

Hai tình huống ép dưới đây là biến thể của hai cột phải §34.4, dùng để duyệt biên kịch (kèm quy tắc EL3 — người chơi ép ba lần thì giữ nguyên lập trường, không đổi ý làm vừa lòng: `06-19` MT-01/PR2/PR4). Hai bark red-team nằm trong cùng kho `B34-*` với bark pool §34.5 để bộ kiểm chạy trên một corpus:

| Mã | Tình huống | Câu bark (nguyên văn) | Ký tự |
|---|---|---|---|
| B34-X1 | Người chơi đòi bà khoe «áo tăng phúc khí bao nhiêu %» | «Bà chưa bao giờ đếm chuyện ấy trên áo. Vải hợp mình thì mặc dễ chịu, thế thôi.» | 78 |
| B34-X2 | Người chơi nghèo, thiếu Ngọc, sợ bị chê | «Con không cần mua gì cả. Áo bà tặng hôm đầu vẫn đẹp.» | 52 |

**Ép 1 — «Bà nói đi, áo tăng phúc khí bao nhiêu %?»** Người chơi đòi bà khoe số để nghe giá trị món đồ. Bà không nêu số, không nêu tên chỉ số của UI, và không lên lớp:

```text
CON:    Nói đi bà ơi, mặc bộ này tăng bao nhiêu phần trăm?
BÀ TƯ:  «Bà chưa bao giờ đếm chuyện ấy trên áo.
         Vải hợp mình thì mặc dễ chịu, thế thôi.»             (B34-X1)
```

Câu X1 đúng 78 ký tự, không chứa %, không chứa số, không chứa tên tiền tệ; câu thứ hai trả về đúng niềm tin gốc của bà (áo hợp hành để mặc dễ chịu — B5 câu 3) chứ không phải một lời né. Nếu người chơi hỏi tiếp lần hai, lần ba: lặp X1 hoặc dẫn câu BT.03 — «Áo hợp hành thì mặc dễ chịu. Trong Huyền Giới được chút lợi nhỏ trong ngày, như gió thuận. Đi vẫn phải tự đi.» (`06-11` B8) — câu này vẫn không có số, và kết «Đi vẫn phải tự đi» chính là chốt chống khuyến khích mua. Lý do cấm tuyệt đối: một con số phần trăm đọc lên bằng giọng của người bán, đứng cách nút mua một cú chạm, đương nhiên được nghe như quảng cáo — cho dù số đó trung thực.

**Ép 2 — người chơi nghèo, thiếu Ngọc, sợ bị chê.** Bà hạ everything bằng câu canon; không thương hại, không dỗ dành mua món rẻ:

```text
CON:    (đủ lộ túi — chữ «thiếu Ngọc» hiện trên thẻ món trong UI)
BÀ TƯ:  «Con không cần mua gì cả. Áo bà tặng hôm đầu vẫn đẹp.»  (B34-X2 / B5 câu 12 / BT.06)
```

Câu này là node riêng của cây thoại (BT.06 «Không mua»), nghĩa là tình huống không phải ứng xử khẩn cấp mà là nhánh đã duyệt. Chữ «mua» trong câu xuất hiện đúng một lần, trong phủ định «không cần mua» — kiểm T11 khóa bằng máy. Bà không nói «nghèo», không nói «đợi khi nào có», không động viên tích tiền: cả ba cái đó đều đang ngầm bán thứ gì đó.

## 34.9 · Wire: điểm cắm là file khóa — chờ mở khóa, không hẹn mốc

**Điểm cắm chính thức của bark** là đúng ba dòng nhân vật đã có: `src/game/render3d.js:234-236` (comment «người bán ở quầy Tàng Y Các — cúi chào khi khách lại gần» + `createCharacter('npc_merchant')`). Đây là **file đang khóa**: `docs/GAME-THIET-KE-CHOT.md:42` liệt kê danh sách 22 file khóa đợt vá bug — «`net.js, protocol.js, worker/quan-room.js, render3d.js, landmarks.js, obstacles.js, accessories.js, effects.js, world.js, characters.js, main.js, state.js, stations.js, interior.js, game.css, cosmetics.js, cases.js, case-ui.js, master-ui.js, vanmenh.js, vanmenh-ui.js, thaitue.js`» — và `render3d.js` nằm trong đó (đếm theo thứ tự in của danh sách, nó là mục thứ 4; đơn hàng của hồ sơ này ghi «mục 15» — số thứ tự không khớp danh sách in, nhưng **bản chất không đổi: file khóa**). Cùng khóa luôn các điểm phụ: `stations.js:736` (cửa mở bảng) và `world.js:27` (nhãn trạm). Panel duy nhất không khóa là `wardrobe-ui.js` (`GAME-THIET-KE-CHOT.md:41` ghi rõ «Panel UI không khóa còn lại: … wardrobe-ui.js») — nhưng bark ngoài cảnh không nằm trong bảng UI, nên không thể cắm bark bằng cách né qua panel.

**Sửa so bản trước.** Bản nháp trước hẹn «cắm bark tại mốc G1». Sai ở hai tầng: (1) một mốc thời gian không thắng điều kiện khóa — danh sách khóa §0.3 phải mở trước, thứ tự việc nằm ở mục lộ trình tích hợp (mục 15 của bộ NPC-AI), không thuộc quyền quyết của hồ sơ nhân vật; (2) chữ «G1» trong canon là **luật game** «không phá vai để bán hàng» (`06-11` B1 cột Lý do), không phải một cột mốc — dùng nó làm lịch là dùng nhầm tên. Hồ sơ này **không hẹn mốc nào**; điều kiện duy nhất được ghi: khi danh sách khóa `GAME-THIET-KE-CHOT §0.3` mở thì cắm.

**Việc làm được ngay hôm nay, không đụng file khóa:**

1. Dựng module thuần `src/game/tho-may.js` (khuôn đề xuất §34.5): toàn bộ bark là hằng string + một hàm chọn `pickBark({ ganQuay, lanTrongPhien, chuaSoHuu, duBo, crise })` thuần logic, trả string hoặc `null`. Khuôn tham chiếu: `src/game/gu-gongan.js` — header ghi rõ «Thuần logic, không DOM: que-ui.js chỉ render theo object trả về» (dòng 5–6); test khuôn: `scripts/test-game-thay-mo-rong.mjs` — «Node thuần, không DOM» (header, khuôn hiện 13 test đạt theo GAME-THIET-KE-CHOT Q6/Q7). Module này và 16 test §34.10 nằm ngoài danh sách khóa — tạo mới được ngay.
2. Khung `B34-R1` chờ một sự kiện «mặc đủ bộ» của UI. UI đã phát toast `wardrobe-ui.js:94`; khi khóa mở, chỉ cần phát cùng sự kiện cho bark (một dòng, tại file đã mở khóa).
3. Khủng hoảng: khi cờ crisis bật, mọi bark của bà **tắt** và cây thoại quầy nhường chỗ cho câu rời vai canon «Con ơi, bà bỏ kéo xuống. Chuyện con nói phải có người ở bên con ngay. Gọi người nhà đi con.» + khối hỗ trợ cố định (`06-11` B8 cuối; nền lore: khủng hoảng chạy trước AI và tắt bark trêu chọc — 06-01 §11).
4. Tất định tuyệt đối: `pickBark` không import `ai.js`, không gọi `askAI`, không đọc persona AI; khi tắt mạng, quầy hoạt động nguyên vẹn — bà là người bán, không phải người tư vấn mệnh, nên không có gì để offline degrade.

## 34.10 · Test riêng: 16 trích xuất — đã chạy trong phiên này

Mười sáu kiểm dưới đây định nghĩa «Bà Tư đạt chuẩn» ở mức máy được, để sau này dán thành một khối trong suite chung (khuôn `scripts/test-game-thay-mo-rong.mjs` — suite đó import các module game có thật, nên khối này dán vào sau khi module `tho-may.js` chính thức tạo trong đợt mở khóa; **hồ sơ này chưa sửa suite chung** vì ngoài phạm vi file được giao). Kho kiểm chạy trên toàn bộ câu có mã `B34-*` trong hồ sơ (8 câu: M1–M5, R1, X1, X2).

| # | Kiểm | Chuẩn đạt |
|---|---|---|
| T01 | Không chứa «Ngọc» (không phân biệt hoa/thường) | 0 khớp trong 8 câu |
| T02 | Không chứa «Phúc Khí» (không phân biệt hoa/thường) | 0 khớp |
| T03 | Không chứa chữ «giá» (kể cả «bảng giá», «định giá») | 0 khớp |
| T04 | Không chứa chữ «giảm» | 0 khớp |
| T05 | Không chứa «hết hàng» | 0 khớp |
| T06 | Không chứa chữ số 0–9 | 0 khớp |
| T07 | Không chứa ký tự «%» | 0 khớp |
| T08 | Không chứa biểu tượng tiền UI «💎»/«✦» (cặp ký tự `priceTxt` — `wardrobe-ui.js:21`) | 0 khớp |
| T09 | Mọi bark ≤ 90 ký tự (quy ước 06-18 §1) | max ≤ 90 |
| T10 | Bark mời hàng (M1) ≤ 3 câu | đếm dấu . ! ? ≤ 3 |
| T11 | Chữ «mua» chỉ xuất hiện trong phủ định «không cần mua» | mọi khớp nằm trong cụm đó |
| T12 | Câu từ chối đổi mệnh (M4) khớp nguyên văn canon | trùng chuỗi `06-11:229` |
| T13 | Khi hỏi đổi mệnh, luôn có khẳng định «không áo nào làm được» | M4 có mặt trong kho |
| T14 | Bark chúc đủ bộ (R1) chứa «đủ bộ» và không chứa số / % / «Phúc Khí» | đạt cả bốn đếm |
| T15 | Bark hướng bảng (M5) không chứa số và không chứa chữ «giá» | 0 khớp |
| T16 | Bark đo vai (M2) chứa «vai con» và không chứa từ ngoại hình mỉa («mập», «gầy», «béo», «xấu») | đạt |

Lệnh đã chạy (độc lập, node v24.13.0, script kiểm đặt ngoài repo để không đụng cây file game):

```bash
node "C:/Users/User/AppData/Local/Temp/check-34-tho-may.mjs" \
  "C:/Users/User/.gemini/antigravity/scratch/app bói toán/docs/npc-ai/34-tho-may.md"
```

Kết quả: **16/16 ✓** (log từng dòng `✓ T01 …` đến `✓ T16 …`, không có một ✗ nào; script trích đúng 8 câu `B34-*` từ bảng hồ sơ, so T12 với chuỗi canon cứng lấy từ `06-11:229`). Ngoài ra script in số từ của hồ sơ theo hai đếm: `wc -w` (tách khoảng trắng — đếm theo định nghĩa của đơn hàng) và đếm riêng token có chữ/số; cả hai đều trên ngưỡng 2800 (con số chính thức ghi ở kết quả nộp, không ước ở đây).

## 34.11 · Ranh giới biên và điều lệ biên kịch

Năm vết ranh giới, ghi lại để người viết sau không đi lại:

1. **«Đắt rẻ» chỉ theo thời gian – công sức.** B5 câu 24 («Áo này bà may ba ngày… Đắt rẻ là ở thời gian, không phải ở phép») được giữ trong canon vì chữ «đắt» nói về nghề; nhưng bark của hồ sơ này **không sao chép** câu đó — bark tự phát chứa chữ «đắt» đứng cạnh nút mua vẫn đọc như ám chỉ giá. Chỉ dùng trong khung thoại khi người chơi hỏi về cách làm áo.
2. **«Lợi nhỏ như gió thuận» chỉ khi được hỏi.** B5 câu 11 / BT.03 là câu duy nhất được phép gợi phần thưởng nhỏ của Hợp mệnh — và điều kiện là có câu hỏi trước. Bark tự phát không dẫn chiếu câu này (kiểm T14 tách riêng R1 khỏi mọi câu «lợi»).
3. **Tiền án giục mua.** `BARK-tho_may-06` bị loại và được giữ trong bảng gốc như mẫu học (`06-11:318`). Mọi bark mới viết xong phải tự hỏi: «câu này có nằm cùng bảng với BARK-06 được không?» — có nghĩa là bỏ.
4. **Không bark doạ, không bark chê lá số người chơi** (06-18 §4–§6). Bà là người hiếm hoi trong quán không đọc lá số — câu canon «Bà không biết đọc lá số đâu. Bà chỉ biết đọc dáng người.» (B5 câu 26) là hộ chiếu của bà, và là lý do bark của bà không bao giờ chạm vào dữ kiện lá số của người chơi.
5. **Độ dài bark ≤ 90 ký tự** (06-18 §1). M4 chạm đúng mốc 90 — nếu đợt mở khóa phải sửa chữ trong M4 (ví dụ chuẩn hóa chính tả), phải đo lại ký tự trước khi duyệt.

Xưng hô thống nhất cụm Sơn Môn: bà nói «bà» — «con»; khi nhắc người khác đúng vai theo bảng 06-18 §1 («thầy» cho Thầy Tử Bình — BARK-17 canon «Thầy ơi, áo thầy sờn cổ rồi» là mẫu).

## 34.12 · Liên mục

| Mục / tài liệu | Dùng gì trong hồ sơ này |
|---|---|
| 06-11 mục B1–B9 (`06-11-son-mon-du-phuong.md:182-331`) | Toàn bộ tiểu sử, giọng, 31 câu mẫu, cây thoại BT.01–BT.EXIT, bark 01–21, tiền án BARK-06 |
| README §2.5 + bảng persona (`README.md:52`, `README.md:114`) | Quyết «đứng cạnh giá tiền»; điểm danh `aiEnabled: 'không'` |
| 06-14 §4.4 (`06-14-danh-gia.md:277-283`) | Bảng duyệt kịch bản — dòng riêng «Bà Tư không nhắc tiền tệ, giá, không giục mua» |
| 06-18 (cẩm nang giọng) | Bark ≤ 90 ký tự; xưng hô; không bark doạ/chê |
| 06-19 MT-01 | Quy tắc ép ba lần không đổi ý (§34.8) |
| Mục 31 (Lỗ Ban) | Đối chiếu hai lý do khóa khác nhau (an toàn phản diện vs ranh giới kinh tế) |
| GAME-THIET-KE-CHOT §0.3 (dòng 37–42) + Q4/Q7 | Danh sách 22 file khóa; chuẩn «nội dung mới = module thuần + test node»; panel không khóa còn lại |
| `render3d.js:234-236` · `stations.js:735-736` · `world.js:27` | Điểm cắm (đều khóa) và nhãn trạm hiện có |
| `wardrobe-ui.js:2, 21-22, 23, 84, 94` + `cosmetics.js:105, 179` | Bảng mua, `priceTxt`, dòng Hợp mệnh +10%, `SET_BONUS` — nơi con số sống và nơi bà không bước vào |
