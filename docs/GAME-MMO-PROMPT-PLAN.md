# HUYỀN QUÁN MMO — Prompt chi tiết & Kế hoạch phát triển

> 2026-11-03 · Thay thế định hướng "single-player + Phase 2 presence" của `GAME-HUYEN-QUAN-SPEC.md` v1.1.
> Spec v1.1 vẫn là nguồn cho mỹ thuật (mục 9) và 7 gian cơ bản; tài liệu này là **nguồn chân lý mới** cho phạm vi, thứ tự và tiêu chí.

---

## PHẦN A — PROMPT CHI TIẾT (dùng lại cho mọi phiên làm việc sau)

```
VAI TRÒ
Bạn là game director + kỹ sư chính của "Huyền Quán" — một game MMO 3D chơi màn hình DỌC,
xây trên codebase app Bát Tự hiện có (repo này, Vite + vanilla JS + Three.js + Capacitor iOS,
worker Cloudflare). Bạn tự quyết các lựa chọn kỹ thuật thông thường, chỉ hỏi chủ dự án khi
quyết định ảnh hưởng tiền, pháp lý, App Store, hoặc định vị sản phẩm.

MỤC TIÊU SẢN PHẨM
1. Một thế giới nhiều người chơi thật (MMO): người chơi thấy nhau, đi cùng nhau, cùng làm
   nhiệm vụ, thi đấu, lập môn phái. Không bao giờ giả lập người chơi ảo.
2. Chiều sâu đến từ CHÍNH thế mạnh của app — 249 engine cổ pháp chạy offline:
   Bát Tự (analyze → R), Đại vận/Lưu niên, Tử Vi, Phong thủy (bát trạch, huyền không,
   la bàn 24 sơn), Chọn ngày (zheri, 28 tú, hoàng đạo), Hợp hôn/gia đình, thư viện 1.583 văn
   bản, 38 lá số kinh điển có đáp án, 64 quẻ, 60 Thái Tuế, 28 tú, nạp âm 30, dưỡng sinh.
   Mỗi hệ thống trở thành một CƠ CHẾ CHƠI có luật, có đúng/sai, có tiến bộ — không phải
   một trang chữ dán vào game.
3. Lên được App Store iOS (bundle shop.god8.lvdang, danh mục Education, định vị "Lữ Đăng —
   học cổ pháp"). Thiết kế cho màn hình dọc, một tay, iPhone SE → Pro Max.

NGUYÊN TẮC CỐT LÕI
- "Người chơi là học trò rồi thành thầy": vòng chơi chính là ĐỌC và GIẢI lá số của nhân vật
  (NPC sinh ngẫu nhiên có ngày sinh thật, hoặc lá số kinh điển), không phải nhận lời phán
  về bản thân. Đáp án do engine tính → chấm điểm khách quan, có trích dẫn kinh điển.
- Lá số của chính người chơi là TUỲ CHỌN, riêng tư, không bao giờ gửi lên máy chủ nếu không
  bật chia sẻ rõ ràng.
- Không bán vận may, không bán lượt, không pay-to-win. Nếu kiếm tiền: chỉ trang trí, qua IAP.
- Không hình tượng tôn giáo cụ thể; phong cách «Sơn Mài Huyền Quán» (spec v1.1 §9).
- Mọi luận giải có câu "Để tham khảo và chiêm nghiệm".

RÀNG BUỘC iOS (bắt buộc — app từng bị từ chối 4.3(b) "fortune telling")
- Game là một TAB/overlay trong vỏ iOS (src/ios/shell.js), KHÔNG phải trang riêng, KHÔNG là
  màn hình mở đầu (Thư viện vẫn là tab mặc định).
- Bản iOS tắt mọi cơ chế mang tính bói cho bản thân: xin xăm, cầu nguyện thắp nhang,
  tarot, "Sổ Mệnh". Dùng cờ tính năng FEATURES (web bật / ios tắt). Từ ngữ trên iOS: "học",
  "giải", "đối chiếu", "án cổ", "lá số mẫu" — không dùng "bói", "đổi vận", "giải hạn".
- Nội dung người dùng tạo (UGC) phải có: lọc từ ngữ, báo cáo, chặn người chơi, liên hệ hỗ
  trợ, điều khoản (Guideline 1.2). Giai đoạn đầu chỉ dùng chat cụm-từ-soạn-sẵn.
- Không link http ra ngoài trong vỏ iOS; offline vẫn chơi được phần đơn (bay máy bay).
- Khoá dọc trong game (@capacitor/screen-orientation), safe-area đầy đủ, haptics native.

KIẾN TRÚC MMO
- Máy chủ: Cloudflare Worker hiện có + Durable Objects:
  · TownShard (≤ 60 người/shard): vị trí 8 Hz, hành động, emote, chat cụm từ, sự kiện.
  · CaseRoom: phòng giải án hợp tác 2–4 người, máy chủ chấm điểm bằng engine (chạy được
    trong worker vì engine thuần JS).
  · D1 (SQLite): hồ sơ người chơi, tiến trình, môn phái, bảng xếp hạng mùa.
- Danh tính: khoá thiết bị ẩn danh (UUID + bí mật) → sau thêm Sign in with Apple.
- Giao thức JSON nhỏ, máy chủ là nguồn chân lý cho điểm xếp hạng; client dự đoán vị trí.
- Rớt mạng → chuyển chế độ đơn liền mạch, đồng bộ lại khi có mạng.

THƯỚC ĐO "XONG"
- Mỗi tính năng có test tự động (node) cho luật chơi + kiểm tay trên khung 390×844.
- npm run build và npm run build:ios đều xanh; verify:ios + verify:ios-path xanh.
- 60 fps mục tiêu / ≥ 30 fps tối thiểu trên iPhone 12; tải lần đầu ≤ 4 MB.
```

---

## PHẦN B — THIẾT KẾ GAME

### B1. Định vị hai bản

| | Web (battu.god8.shop/game) | iOS (Lữ Đăng — tab "Học Quán") |
|---|---|---|
| Tên | Huyền Quán Online | Học Quán Lữ Đăng |
| Vòng chơi chính | Giải án + thế giới chung | Giải án + thế giới chung (giống hệt) |
| Gian bói cá nhân (xăm, thắp nhang cầu, hoa đăng điều ước) | Có | **Tắt** |
| Lá số của tôi | Có, riêng tư | Có, gọi là "Chart Lab của tôi", riêng tư |
| AI thầy | Có (online) | Có, gắn nhãn "trợ giảng nghiên cứu", fallback nlg offline |

### B2. Vòng chơi (từ ngắn → dài)

**30 giây — Nhịp ngày:** vào quán, thấy ai đang ở đây, xem Bảng Lịch (can chi, tiết khí, sao
Huyền Không năm), nhận 3 "án ngày".

**5 phút — Giải một án (cơ chế lõi):** một khách NPC tới bàn, có ngày sinh + một câu hỏi đời
thường ("năm nay nên đổi việc?"). Người chơi đi qua các bước, mỗi bước là một mini-game có
đúng/sai do engine chấm:
1. **Lập trụ** — xếp 8 thẻ can chi đúng vị trí (từ buildChart).
2. **Đếm ngũ hành** — kéo thanh ngũ hành gần với scoreWuXing (sai số cho phép).
3. **Vượng/nhược** — chọn + chọn lý do (đắc lệnh/đắc địa/đắc thế — analyzeStrength).
4. **Dụng thần** — chọn hành (findYongShen); bậc cao: chọn phương pháp (phù ức/điều hậu/thông quan).
5. **Ứng kỳ** — chọn năm thuận trong 10 năm (dayun/liunian rating).
6. **Lời khuyên** — ghép thẻ lời khuyên hợp dụng thần (màu/hướng/nghề — remedy).
Điểm theo độ chính xác + thời gian + trích dẫn kinh điển đúng (thưởng thêm).

**30 phút — Hợp tác & thi đấu:**
- **Án Cổ** (38 lá số kinh điển có đáp án) — giải chung 2–4 người trong CaseRoom, mỗi người
  giữ một bước; mở khoá trang kinh điển tương ứng trong Thư viện.
- **Đối chiếu trường phái** — cùng một lá số, 2 môn phái tranh luận bằng thẻ luận điểm
  (schools-data compareMatrix) — người xem bỏ phiếu.
- **Giải Tiết Khí** — giải đấu 24 lần/năm theo tiết khí thật, bảng xếp hạng toàn server.

**Dài hạn — Tu học:**
- **Cây tu học 7 nhánh:** Tử Bình · Đại vận · Tử Vi · Phong thủy · Trạch nhật · Hợp hôn · Kinh
  điển. Mỗi nhánh mở mini-game riêng:
  - Phong thủy: **xếp nhà 9 cung** (bát trạch + phi tinh năm) — đặt cửa/bếp/giường, chấm bằng
    computeZhai + xuankongPan.
  - Trạch nhật: **chọn ngày cho khách** trên lịch tháng (đáp án findGoodDates / evaluateDate).
  - Tử Vi: **sắp sao lên 12 cung** dưới bầu trời đêm (computeZiwei).
  - Hợp hôn: **ghép đôi NPC** (computeHehun) — giải thích vì sao hợp/khắc.
  - Kinh điển: **thẻ sách** sưu tầm từ 1.583 văn bản, mở bằng thành tích.
- **Danh vị:** Học trò → Môn sinh → Đệ tử → Thầy đồ → Tiên sinh → Đại sư (theo điểm tu học,
  không mua được). Đạt "Thầy đồ" được **mở bàn riêng** trong quán để người chơi khác mang
  NPC tới nhờ giải (bàn của người thật — MMO thực chất).
- **Môn phái** (≤ 30 người): chọn trường phái làm bản sắc, có sảnh riêng, mục tiêu tuần chung.

### B3. Thế giới
- Thị trấn trên đảo nổi, mở dần theo khu: Huyền Quán (trung tâm) → Thư Lâu (thư viện, ngồi
  đọc yên lặng kiểu Sansa) → Phong Thủy Viên (xếp nhà) → Quan Tinh Đài (Tử Vi) → Lịch Đường
  (trạch nhật) → Sảnh Môn Phái.
- Thế giới đổi theo lịch thật: phi tinh năm quyết định khu nào "vượng" (thưởng ×1.2), tiết khí
  đổi cảnh, ngày/đêm theo giờ.
- Xã hội: emote (chắp tay, cúi chào, vỗ tay, rót trà mời), cụm từ soạn sẵn, mời giải án chung,
  kết bạn, xem hồ sơ tu học (không bao giờ lộ ngày sinh).

### B4. Màn hình dọc (mobile-first)
- Bố cục 390×844: HUD trên gọn (tên · danh vị · số người online), cảnh 3D giữa, cụm điều
  khiển đáy trong vùng ngón cái: **joystick ảo trái**, **nút hành động phải**, thanh nhanh
  (Án · Bạn · Môn phái · Sổ tu học).
- Bảng là **bottom sheet** kéo lên 3 nấc (peek / half / full), không che toàn cảnh.
- Camera dọc: FOV 62, thấp hơn, nhìn chéo; chạm 2 lần để nhìn gần.
- Chạm = đi tới; giữ 1 ngón trên cảnh rồi kéo = xoay camera; joystick không xung đột.
- Safe-area, haptics (nhẹ khi chọn, vừa khi đúng, mạnh khi lên danh vị), tắt bounce WebView.

---

## PHẦN C — KẾ HOẠCH THỰC HIỆN

| Phase | Nội dung | Kết quả kiểm được |
|---|---|---|
| **P0 — Nền móng dọc + iOS** ✅ 2026-11-03 | Cờ tính năng web/ios; game chạy như overlay trong vỏ iOS (tab "Học Quán", không mặc định); UI dọc: joystick, nút hành động, bottom sheet, safe-area, haptics; build:ios chứa game; sửa spec A12 | build + build:ios + verify xanh; 390×844 chơi được bằng một tay |
| **P1 — Lõi MMO** | Durable Object TownShard; danh tính ẩn danh; đồng bộ vị trí/emote/cụm từ; số người online thật; chế độ đơn khi mất mạng; test bằng `wrangler dev` 2 trình duyệt | 2 tab thấy nhau di chuyển mượt; rớt mạng không crash |
| **P2 — Giải án (lõi chiều sâu)** | Sinh NPC có lá số thật; 6 bước mini-game chấm bằng engine; Án Cổ 38 lá; thẻ trích dẫn từ thư viện; test luật chấm | 100 NPC ngẫu nhiên đều chấm được; test node xanh |
| **P3 — Xã hội & tiến trình** | CaseRoom hợp tác (máy chủ chấm); D1 hồ sơ + bảng xếp hạng mùa; danh vị; bạn bè; môn phái cơ bản; báo cáo/chặn | 2–4 người giải chung một án; xếp hạng không gian lận từ client |
| **P4 — Mở rộng cây tu học** | Phong Thủy Viên (xếp nhà 9 cung), Lịch Đường (chọn ngày), Quan Tinh Đài (Tử Vi), Hợp hôn NPC; Giải Tiết Khí | mỗi mini-game có test đáp án |
| **P5 — Phát hành iOS** | Ảnh chụp/mô tả mới, review notes, điều khoản UGC, privacy manifest, kiểm tra 4.3b/1.2/2.3.1; TestFlight | gửi duyệt |

**Thứ tự lý do:** P0 trước vì mọi UI sau đều phải đúng khung dọc + iOS; P1 trước P2 vì MMO là
giá trị cốt lõi và quyết định kiến trúc dữ liệu (máy chủ chấm điểm); P2 là chiều sâu cần có
trước khi mở cho đông người.

**Quyết định cần chủ dự án duyệt (không chặn P0–P2):**
1. Định vị bản iOS như B1 (tắt gian bói cá nhân) — khuyến nghị: đồng ý, vì đã bị 4.3(b).
2. Bật Durable Objects + D1 trên tài khoản Cloudflare (gói Workers Paid $5/tháng nếu vượt free).
3. Khi nào deploy server thật (mọi thứ trước đó chạy `wrangler dev` cục bộ).

---

## PHẦN D — NHẬT KÝ TIẾN ĐỘ

### P0 — xong 2026-11-03
- `src/game/features.js`: cờ web/iOS — iOS tắt gian `xam`, `sen` + thành tựu bói; đổi tên (Học Quán, 學館, Lò Trầm, Sổ Tu Học, Điểm Tu Học).
- `src/game/mount.js` + `markup.js`: `mountGame(host, { onExit })` dùng chung web/iOS; `startGame()` trả `{ pause, resume, exit }`.
- UI dọc: joystick ảo (cảm ứng), nút hành động tròn bên phải, dock đáy 3 nút, bottom sheet 2 nấc, safe-area, camera nhìn vượt trước khách ở màn dọc, điểm xuất phát trong sân.
- `src/game/haptics.js`: Capacitor Haptics + khoá dọc bằng `@capacitor/screen-orientation` (đã cài; cần `npx cap sync ios` trên máy Mac).
- Vỏ iOS (`src/ios/shell.js`): tab thứ 6 «Học Quán» (không mặc định) → overlay toàn màn hình; CSS game gói trong `.hq-root` không rò ra vỏ.
- `scripts/verify-ios-review-path.mjs`: khớp tab «Học» chính xác + 5 bước kiểm Học Quán (không gian bói, không link ngoài, không từ cấm, thoát về vỏ). `build:ios` + `verify:ios` + `verify:ios-path` (14/14) xanh.
- Việc native còn lại trên Mac: `npx cap sync ios`, kiểm haptics/khoá dọc trên máy thật.

### P1 — kế tiếp: lõi MMO
1. `worker/quan-room.js`: Durable Object `TownShard` (WebSocket hibernation API), ≤ 60 người/shard, tick 8 Hz gom gói.
2. Route `/ws/quan` trong `worker/index.js` (trước phần assets) + binding DO trong `wrangler.jsonc` (migration `new_sqlite_classes`).
3. Danh tính ẩn danh: `huyenquan:id` = UUID + secret ký HMAC phía server.
4. Client `src/game/net.js`: kết nối, nội suy vị trí người khác, emote, cụm từ soạn sẵn, chip «N người trong quán» (thật), tự rơi về chế độ đơn khi mất mạng.
5. Render người chơi khác trong `render3d.js` (avatar instanced theo màu áo, nhãn tên).
6. Test: `wrangler dev` cục bộ + 2 tab trình duyệt; test node cho giao thức (mã hoá/giải mã, giới hạn tốc độ).

### P1 — xong 2026-11-03 (chạy cục bộ, CHƯA deploy)
- `src/game/protocol.js`: giao thức dùng chung client/máy chủ — kiểm gói, lọc tên (ký tự ẩn, HTML, thô tục), 6 cử chỉ + 8 cụm từ soạn sẵn (không chat tự do), giới hạn 20 gói/giây, 60 người/phòng, 3 bồ đoàn.
- `worker/quan-room.js`: Durable Object `TownShard` (WebSocket Hibernation — phòng vắng thì ngủ, không tốn CPU). Phòng đầy → mã 4001, client tự sang phòng kế; spam → 4002. Báo cáo lưu trong storage của DO (mỗi người một lần/đối tượng, tối đa 500/phòng). Mã `u` = băm SHA-256 định danh thiết bị để «ẩn người này» bền mà không lộ định danh.
- `worker/index.js`: route `/ws/quan?room=N` (kiểm Origin) · `wrangler.jsonc`: binding `QUAN` + migration `quan-v1` (`new_sqlite_classes`).
- `src/game/net.js`: offline-first, tự kết nối lại (lùi dần 1.5s → 30s), gửi vị trí ≤ 8 Hz khi đổi, nội suy người khác, ẩn/bỏ ẩn, xin chỗ ngồi. iOS native → `wss://battu.god8.shop`; web → cùng host; ghi đè bằng `?server=`.
- 3D: người khác vẽ từ mẫu gộp (màu áo × đứng/ngồi) → ~1–2 draw call/người; nhãn tên + bong bóng cử chỉ/cụm từ; chạm vào người khác → thẻ: cúi chào · mời trà · vỗ tay · ẩn · báo cáo (3 lý do).
- UI: chip «👥 N» (bấm → danh sách người trong phòng), nút dock «💬 Giao lưu».
- Kiểm: `npm run test:mmo` = 7 test giao thức + 10 test tích hợp WebSocket thật (welcome/join/mv/emo/say/bồ đoàn/tên xấu/báo cáo/rời/spam/phòng đầy 60). Hai trình duyệt thấy nhau, chào nhau, ẩn, rời phòng. `build`, `build:ios`, `verify:ios`, `verify:ios-path` 14/14 xanh.
- Chạy cục bộ: `npm run dev:mmo` (cổng 8788) + `npm run dev` (vite proxy `/ws`). Lý do có script riêng: workerd trên Windows sập khi đường dẫn có dấu («app bói toán») — script tự tạo junction ASCII trong thư mục tạm.

**Để lên máy chủ thật (cần chủ dự án duyệt):** `npm run deploy` sẽ tạo Durable Object `TownShard` trên tài khoản Cloudflare (gói Workers Free có DO dùng SQLite; vượt hạn mức → Workers Paid $5/tháng). Sau deploy: kiểm `wss://battu.god8.shop/ws/quan` bằng `node scripts/test-quan-mmo.mjs wss://battu.god8.shop`. Bản iOS cần build lại sau khi máy chủ chạy để khách iPhone thấy nhau.

### P2 — xong 2026-11-03: Giải án (chiều sâu)
- `src/game/npc.js` (nhẹ): khách NPC theo hạt giống «ngày · khe · người chơi» — họ tên, xưng hô theo tuổi, nghề + câu hỏi hợp tuổi (công danh, tài lộc, cưới hỏi, thi cử, chuyển nhà), ngày giờ sinh thật.
- `src/game/cases.js` (tải lười, kéo kb.js): dựng án bằng `analyze()`; 6 bước chấm theo engine — Lập trụ (11 thẻ, 3 thẻ nhiễu, gợi ý −15%) · Ngũ hành (vượng nhất/yếu nhất, chấp nhận gần bằng ±2%) · Vượng nhược + 3 lý do (đắc lệnh/địa/thế) · Dụng thần (phụ được 50%) · Ứng kỳ (6 năm từ năm nay, gần nhất được 70%) · Lời khuyên (2 thẻ, trừ điểm thẻ hành kỵ). Trọng số 20/10/20/25/10/15.
- Trích dẫn trong lời giải: Trích Thiên Tủy (滴天髓) cho vượng nhược, Cùng Thông Bảo Giám (穷通宝鉴) theo can ngày × tháng (thiếu thì lấy tháng cùng mùa), lý do + phương pháp chọn Dụng thần của engine, cách tính trụ (Lập Xuân, tiết khí, Ngũ Thử Độn).
- Án Cổ: 36/38 lá số kinh điển dùng được (đáp án lấy từ sách: vượng nhược / cách cục / dụng thần), lời sách + nguồn hiện sau khi giải; thưởng lần đầu đạt ≥ 60%.
- `src/game/case-ui.js`: giao diện dọc — thẻ khách, câu hỏi, thanh 6 bước, ô can chi + khay thẻ, bảng tra Ngũ Hổ Độn / Ngũ Thử Độn / giờ, phản hồi từng bước, màn kết quả; sheet tự bung cao; thông báo dời lên đầu khi bảng mở.
- Sân 3D: 3 khách đứng chờ (áo đổi theo ngày, quay nhìn người chơi, dấu ❓ vàng xoay → biến mất khi đã giải); nhãn «Bác Hải ❓ / ✓».
- Tiến trình: 3 khách/ngày (tối đa 15 điểm/khách theo %), nhiệm vụ ngày đổi thành «Giải án cho một khách», kỹ năng tu học (trung bình ~20 lần gần nhất / 7 kỹ năng), nhật ký án, tab «Tu học» là tab đầu của Sổ.
- Sửa lỗi lưu: trường mới phải có trong `createState()` nếu không `hydrate()` bỏ khi đọc lại (có test hồi quy).
- Kiểm: `test-game-cases` 10 test (100 khách ngẫu nhiên, đúng hết = 100%, sai hết < 20%, trích dẫn ≥ 90%, Án Cổ, thưởng, lưu/đọc). Trình duyệt: giải trọn 1 án khách + 1 Án Cổ. `build`, `build:ios`, `verify:ios`, `verify:ios-path` 15/15 (thêm bước mở án khách).

### P3 — kế tiếp: Xã hội & xếp hạng
CaseRoom hợp tác 2–4 người (máy chủ chấm bằng engine chạy trong worker — chống gian lận), D1 hồ sơ + bảng xếp hạng mùa theo tiết khí, bạn bè, môn phái cơ bản, «bàn của Thầy đồ» cho người chơi danh vị cao.
