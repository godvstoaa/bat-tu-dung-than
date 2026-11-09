# 14.03 · Sổ rủi ro phần F (quyền riêng tư), phần G (bảo mật), phần H (kinh tế) · Bất biến kinh tế

> Mã: `RISK-105` … `RISK-142`. Bảng kê dữ liệu và mô hình đe dọa chi tiết ở tập 14.12.

---

## 1. Phần F — Quyền riêng tư (RISK-105 … RISK-118)

Bối cảnh mã hiện có (đã kiểm):
- Ngày giờ sinh của người chơi: `state.player.birth = { y, m, d, h, mi, gender, hourUnknown }` trong `localStorage['huyenquan:v1']` (`state.js › KEY`), cùng `profiles[]` tối đa 5 hồ sơ (`CAPS.maxProfiles`).
- Gói `hello` gửi lên MMO (`net.js › connect`): `name, robe, acc, cos, look, title, pid`. Không có ngày sinh.
- `robe` = hành Dụng thần (áo «Bản Mệnh Y»), `acc` = hành Hỷ thần (đai) — chú thích trong `protocol.js`: «chỉ gửi màu, không gửi ngày sinh».
- `pid` = UUID ngẫu nhiên trong `localStorage['huyenquan:pid']`; máy chủ tính `u = SHA-256('huyenquan:' + pid)` lấy 6 byte, phát cho mọi người trong phòng.

### RISK-105 · Brief gửi AI đủ để suy ra ngày sinh
**Riêng tư · K 5 · T 3 · 15 Đỏ · Chủ: PC + TAI · Mốc: M0**
- **Mô tả:** brief có bốn trụ (năm, tháng, ngày, giờ can chi), giới tính, tuổi (từ `R.chart.input.year`), đại vận theo tuổi, ngày hôm nay. Với năm sinh + bốn trụ, ngày sinh xác định được tới khoảng giờ. Ngày sinh + giới tính + thành phố (nếu câu hỏi nhắc) là định danh gián tiếp mạnh.
- **Giảm thiểu:** thông báo trung thực ở thẻ đồng ý (tập 14.12 §2.3): «câu hỏi và bảng tóm tắt lá số (đủ để suy ra ngày sinh) được gửi tới nhà cung cấp AI»; không gửi họ tên; không gửi tọa độ, thành phố; tùy chọn «hỏi bằng lá số mẫu» cho người không muốn gửi lá số thật.
- **Phát hiện:** test chụp payload `askAI` từ game: không có `name`, `pid`, IP header bổ sung.
- **Dự phòng:** tạm tắt AI trong game, giữ thoại kịch bản.

### RISK-106 · Hồ sơ người thân là dữ liệu của người không đồng ý
**Riêng tư · K 4 · T 2 · 8 Cam · Chủ: PC · Mốc: M1**
- **Mô tả:** Sổ Mệnh cho lập lá số cho cha mẹ, vợ chồng, con (5 hồ sơ). Lưu trên máy thì rủi ro thấp; khi hỏi AI về hồ sơ đó, ngày sinh người thân rời máy.
- **Giảm thiểu:** khi lập hồ sơ không phải «Bản thân»: dòng nhắc «Hãy hỏi ý người đó trước khi lưu ngày sinh của họ»; hỏi AI về hồ sơ người khác: nhắc lại một lần mỗi hồ sơ; không bao giờ đồng bộ hồ sơ lên máy chủ.
- **Phát hiện:** test: `profiles` không có trong bất kỳ gói mạng nào.
- **Dự phòng:** —

### RISK-107 · Màu áo, màu đai lộ Dụng thần, Hỷ thần
**Riêng tư · K 5 · T 1 · 5 Xanh · Chủ: PC · Mốc: M0**
- **Mô tả:** người trong cùng phòng thấy `robe`, `acc` → suy ra Dụng/Hỷ thần (đặc điểm suy từ ngày sinh). Mức nhạy cảm thấp nhưng vẫn là dữ liệu suy luận.
- **Giảm thiểu:** chính sách nêu rõ; người chơi có thể chọn áo khác Dụng thần (Tàng Y Các) — khi đó `robe` là màu tự chọn; mô tả `y_menh` ghi «người khác có thể đoán hành hợp mệnh của bạn qua màu áo».
- **Phát hiện:** —
- **Dự phòng:** —

### RISK-108 · Mã `u` ổn định cho phép người khác theo dõi qua nhiều phiên
**Riêng tư · K 3 · T 2 · 6 Xanh · Chủ: TMC + PC · Mốc: M1**
- **Mô tả:** `u` không đổi theo thiết bị, phát cho mọi người chơi để làm chức năng «ẩn người này». Một nhóm có thể ghi lại `u` để theo dõi ai hay online lúc nào, đổi tên bao nhiêu lần.
- **Giảm thiểu:** `u` chỉ gửi kèm sự kiện cần chặn (emo, say), không gửi trong `mv`; xoay `u` theo mùa (chặn vẫn hoạt động nhờ máy chủ ánh xạ theo danh sách chặn được đồng bộ, tập 14.12 §6.4).
- **Phát hiện:** —
- **Dự phòng:** đổi muối băm (`'huyenquan:'`) → mọi `u` đổi.

### RISK-109 · Báo cáo lưu `pid` không thời hạn
**Riêng tư · K 5 · T 2 · 10 Cam · Chủ: TMC + PC · Mốc: M1**
- **Mô tả:** `quan-room.js` lưu `report:<pid người báo>:<id>` với `{ at, room, why, target: { id, name, pid }, by }` vào storage của Durable Object, **không có TTL**, chỉ dừng khi đủ 500 mục mỗi phòng. Không ai đọc (RISK-093).
- **Giảm thiểu:** chuyển báo cáo sang hàng đợi trung tâm (D1 hoặc KV) có TTL 90 ngày; xóa khi đã xử lý + 30 ngày; chỉ TCĐ có quyền đọc.
- **Phát hiện:** kiểm storage DO định kỳ.
- **Dự phòng:** xóa toàn bộ khóa `report:*` cũ.

### RISK-110 · «Công khai căn cốt» lộ điểm Tiên Thiên
**Riêng tư · K 3 · T 3 · 9 Cam · Chủ: PC + TAT · Mốc: M3**
- **Mô tả:** §14 cho bật «công khai căn cốt». Điểm Tiên Thiên công khai + kỳ thị theo Phẩm căn (RISK-144).
- **Giảm thiểu:** mặc định tắt; khi bật hiện cảnh báo; chỉ công khai **Phẩm căn** dạng tên, không số; trẻ < 18 không bật được.
- **Phát hiện:** —
- **Dự phòng:** tắt chức năng toàn cục.

### RISK-111 · Hệ phân tích của app chính kéo dữ liệu game vào
**Riêng tư · K 3 · T 4 · 12 Cam · Chủ: PC + TMC · Mốc: M0**
- **Mô tả:** `worker/admin.js › logEvent` của app chính lưu `vprof:<dob>|<time>|<gender>` gồm tên, ngày sinh, giờ sinh, IP, điểm, Dụng thần (TTL 90 ngày) khi sự kiện `chart` có `name`; `events:log` giữ IP, thành phố, UA. Game và app chạy chung Worker và chung miền `battu.god8.shop`. Nếu ai đó gọi `_logEvent('chart', …)` từ game, dữ liệu sinh của người chơi game sẽ lên máy chủ — trái cam kết «ngày sinh chỉ lưu trên máy».
- **Giảm thiểu:** quy tắc mã: `src/game/**` không import / không gọi `/api/event` với trường ngày sinh; test tĩnh trong CI (grep); nếu game cần số liệu: endpoint riêng `/api/game-metric` chỉ nhận số đếm.
- **Phát hiện:** test tĩnh + test mạng.
- **Dự phòng:** xóa khóa `vprof:*` liên quan, thông báo.

### RISK-112 · Đạo thống, môn phái lưu máy chủ trở thành dữ liệu tôn giáo
**Riêng tư · K 3 · T 4 · 12 Cam · Chủ: PC · Mốc: M3 (D1)**
- **Mô tả:** khi có D1 (hồ sơ, môn phái, bảng xếp hạng), bảng ghi «người chơi X tu Tịnh Độ» có thể bị xem là dữ liệu về quan điểm tôn giáo (RISK-077).
- **Giảm thiểu:** đặt tên trường trung tính (`sect_id`), chính sách ghi rõ «lựa chọn môn phái là lựa chọn trong trò chơi, không thể hiện niềm tin thật»; không bao giờ dùng dữ liệu này cho quảng cáo, phân tích hành vi tôn giáo.
- **Phát hiện:** rà schema.
- **Dự phòng:** —

### RISK-113 · Sổ đời thực đồng bộ lên máy chủ
**Riêng tư · K 2 · T 3 · 6 Xanh · Chủ: PC · Mốc: M2**
- **Mô tả:** nhật ký việc thiện ngoài đời có thể chứa tên người, chuyện riêng.
- **Giảm thiểu:** chỉ lưu trên máy; sao lưu thì mã hóa đầu cuối (khóa từ mật khẩu người chơi) hoặc xuất tệp.
- **Phát hiện:** test giao thức.
- **Dự phòng:** —

### RISK-114 · Máy dùng chung làm lộ lá số
**Riêng tư · K 3 · T 2 · 6 Xanh · Chủ: GĐSX · Mốc: M1**
- **Mô tả:** quán net, máy gia đình: người sau mở game thấy ngày sinh, lá số, câu hỏi (nếu lưu) của người trước.
- **Giảm thiểu:** nút «Rời quán, xóa dữ liệu trên máy này» trong Sổ Mệnh; tùy chọn khóa Sổ Mệnh bằng mã 4 số (chỉ chống tò mò, không phải bảo mật mạnh).
- **Phát hiện:** —
- **Dự phòng:** —

### RISK-115 · Không thực hiện được quyền của chủ thể dữ liệu
**Riêng tư · K 4 · T 3 · 12 Cam · Chủ: PC + TMC · Mốc: M1**
- **Mô tả:** quyền được biết, truy cập, chỉnh sửa, xóa, rút đồng ý, phản đối (Nghị định 13/2023/NĐ-CP *(cần luật sư xác minh danh mục quyền theo luật 2025)*; GDPR). Với `pid` không có tài khoản, người chơi không có cách yêu cầu máy chủ xóa báo cáo, bảng xếp hạng liên quan đến mình.
- **Giảm thiểu:** màn «Dữ liệu của tôi» (tập 14.12 §4): xem `pid`, xuất dữ liệu trên máy, gửi yêu cầu xóa máy chủ ký bằng `pid`.
- **Phát hiện:** diễn tập yêu cầu xóa.
- **Dự phòng:** xử lý thủ công qua email hỗ trợ.

### RISK-116 · Công cụ đo đạc, phân tích bên thứ ba trên web game
**Riêng tư · K 2 · T 3 · 6 Xanh · Chủ: PC · Mốc: M1**
- **Mô tả:** chèn SDK phân tích, quảng cáo về sau sẽ kéo dữ liệu thiết bị, hành vi ra bên thứ ba; cần đồng ý cookie ở EU.
- **Giảm thiểu:** không dùng SDK bên thứ ba trong game; số liệu tự đo, ẩn danh.
- **Phát hiện:** test mạng: không có request tới miền ngoài danh sách cho phép.
- **Dự phòng:** gỡ SDK.

### RISK-117 · Hợp hôn MMO làm lộ ngày sinh cho người kia
**Riêng tư · K 3 · T 3 · 9 Cam · Chủ: PC + TMC · Mốc: M6**
- **Mô tả:** để so lá số hai người chơi, cần dữ liệu của cả hai ở một nơi. Nếu gửi lá số A sang máy B, B đọc được.
- **Giảm thiểu:** tính hợp hôn **trên máy chủ** (engine chạy được trong Worker — `GAME-MMO-PROMPT-PLAN.md`), mỗi bên gửi tứ trụ đã mã hóa phiên, máy chủ trả **chỉ kết quả chung**, không lưu; hoặc mỗi bên chỉ gửi các chỉ số cần cho hợp hôn (nạp âm năm, Dụng thần), không gửi ngày.
- **Phát hiện:** test giao thức.
- **Dự phòng:** tắt tính năng.

### RISK-118 · Quyền riêng tư trẻ em khi có tài khoản
**Riêng tư · K 3 · T 4 · 12 Cam · Chủ: PC + TAT · Mốc: M3**
- **Mô tả:** khi tạo tài khoản có email, số điện thoại (xác thực theo quy định Việt Nam — RISK-076), dữ liệu trẻ em lên máy chủ.
- **Giảm thiểu:** tập 14.12 §5.6: luồng đồng ý phụ huynh, tối thiểu hóa, không quảng cáo cá nhân hóa cho trẻ.
- **Phát hiện:** —
- **Dự phòng:** xóa tài khoản trẻ khi phụ huynh yêu cầu.

---

## 2. Phần G — Bảo mật (RISK-119 … RISK-132)

### RISK-119 · Tiền tệ, VIP lưu phía máy khách — sửa được tùy ý
**Bảo mật · K 5 · T 3 · 15 Đỏ · Chủ: TMC + TKT · Mốc: trước khi bán Ngọc thật (M6)**
- **Mô tả:** `state.phucKhi`, `state.xp`, `wardrobe.ngoc`, `state.vip = { until, source }` nằm trong `localStorage`; `progress.js › vipActive` chỉ so `s.vip.until > now`. Ai mở công cụ trình duyệt cũng thành VIP, có Ngọc vô hạn. Hiện chưa bán tiền thật nên thiệt hại thấp; khi bán Ngọc thật hoặc có bảng xếp hạng, đây là lỗ hổng.
- **Giảm thiểu:** tài khoản + **sổ cái máy chủ** cho Ngọc, VIP, Đạo Hạnh (tập 14.12 §7.3); máy khách chỉ hiển thị; Phúc Khí (chơi đơn) có thể vẫn ở máy nhưng không dùng cho bảng xếp hạng.
- **Phát hiện:** so sánh số dư khách gửi lên với sổ cái.
- **Dự phòng:** đặt lại số dư bất thường.

### RISK-120 · Thiên Bảng, Đạo Hạnh bị làm giả
**Bảo mật · K 4 · T 3 · 12 Cam · Chủ: TMC · Mốc: M3**
- **Mô tả:** nếu Đạo Hạnh do máy khách gửi lên, bảng xếp hạng vô nghĩa và mất niềm tin vào cơ chế cốt lõi T2.
- **Giảm thiểu:** Đạo Hạnh chỉ tăng qua **sự kiện máy chủ xác nhận** (nhiệm vụ do máy nhiệm vụ phía máy chủ chấm, như `solve` → `graded` đã thiết kế trong `protocol.js`); giới hạn tăng mỗi ngày; nhật ký sự kiện.
- **Phát hiện:** phát hiện bất thường (tăng vượt trần, tốc độ phi lý).
- **Dự phòng:** xóa khỏi bảng, khôi phục từ nhật ký.

### RISK-121 · Bot chiếm phòng MMO
**Bảo mật · K 3 · T 3 · 9 Cam · Chủ: TMC + TBM · Mốc: M1**
- **Mô tả:** nhánh `/ws/quan` trong `worker/index.js` trả về **trước** bước giới hạn 120 yêu cầu/phút/IP; kiểm `Origin` chỉ khi có header (thiếu `Origin` vẫn qua — cần cho app gốc nhưng cũng mở cho script). 50 phòng × 60 chỗ = 3.000 kết nối; một kẻ giữ vài nghìn socket là chiếm hết phòng.
- **Giảm thiểu:** giới hạn số kết nối đồng thời theo IP (≤ 4) và theo `pid` (1) tại Worker; yêu cầu `hello` trong 5 giây nếu không đóng; với kết nối thiếu `Origin`, yêu cầu mã thiết bị đã ký (sau khi có tài khoản).
- **Phát hiện:** số kết nối theo IP; phòng đầy bất thường giờ thấp điểm.
- **Dự phòng:** chặn IP qua `block:<ip>` (đã có trong admin).

### RISK-122 · Lách bộ lọc tên; trường `title` không được lọc
**Bảo mật · K 5 · T 3 · 15 Đỏ · Chủ: TMC + TCĐ · Mốc: M0**
- **Mô tả:** `parseClient('hello')`: `name` qua `cleanName` (danh sách 15 từ), nhưng `title: typeof m.title === 'string' ? m.title.slice(0, 24) : ''` **không lọc** và được phát cho mọi người (`pub()` có `title`). Máy khách chính thức gửi danh hiệu từ `TITLES`, nhưng máy khách sửa đổi gửi được bất kỳ chuỗi 24 ký tự nào — kênh UGC tự do không lọc, không báo cáo theo lý do. Danh sách `BAD` thiếu dạng không dấu, teencode («dm» không có dấu cách cuối, «đ.m», «vl», «cl»), từ xúc phạm tôn giáo, dân tộc.
- **Giảm thiểu:** máy chủ chỉ chấp nhận `title` thuộc danh mục danh hiệu (id, không phải chuỗi); mở rộng bộ lọc tên (tập 14.12 §6.2): chuẩn hóa bỏ dấu, bỏ ký tự chen giữa, từ điển ≥ 400 mục gồm xúc phạm tôn giáo, dân tộc, chính trị, tên dự trữ.
- **Phát hiện:** test `test-quan-protocol.mjs` thêm ca title tùy ý → bị thay bằng rỗng.
- **Dự phòng:** máy chủ đổi tên người vi phạm về «Khách» (đã có cơ chế `renamed`).

### RISK-123 · Kênh báo cáo bị làm tê liệt
**Bảo mật · K 3 · T 3 · 9 Cam · Chủ: TMC · Mốc: M1**
- **Mô tả:** `MAX_REPORTS = 500` mỗi Durable Object; khi `report:count` ≥ 500, mọi báo cáo sau **bị bỏ im lặng**. Kẻ xấu xoay `pid` (tự tạo) để gửi 500 báo cáo vô nghĩa là vô hiệu hóa báo cáo phòng đó vĩnh viễn (không có cơ chế đặt lại).
- **Giảm thiểu:** hàng đợi trung tâm có hạn mức theo người báo (≤ 10/ngày), theo IP; báo cáo trùng gộp; trần theo thời gian (cửa sổ trượt), không trần tuyệt đối.
- **Phát hiện:** cảnh báo khi một phòng nhận > 50 báo cáo/giờ.
- **Dự phòng:** xóa khóa, đặt lại bộ đếm.

### RISK-124 · Mã truy cập admin nằm trong query string
**Bảo mật · K 3 · T 4 · 12 Cam · Chủ: TBM · Mốc: M0**
- **Mô tả:** dashboard admin gọi `AP + '/api/notify?token=' + TOKEN`; mô tả đầu tệp `admin.js`: `GET /admin?token=X`. Token trong URL lọt vào lịch sử trình duyệt, nhật ký proxy, header Referer. Admin API trả `Access-Control-Allow-Origin: *`. Admin điều khiển công tắc AI, chặn IP, đọc nhật ký có ngày sinh (`vprof`).
- **Giảm thiểu:** chuyển token sang header `X-Admin-Token` (đã cho phép trong CORS) hoặc cookie `HttpOnly; Secure; SameSite=Strict`; giới hạn CORS admin về đúng miền admin; xoay token sau khi sửa.
- **Phát hiện:** rà mã admin; quét nhật ký có chuỗi `token=`.
- **Dự phòng:** xoay `ADMIN_TOKEN` ngay.

### RISK-125 · Lộ khóa API LLM
**Bảo mật · K 2 · T 4 · 8 Cam · Chủ: TBM + TMC · Mốc: M0**
- **Mô tả:** khóa z.ai, khóa pool nằm trong `ADMIN_KV › ai:config`; ai đọc được KV (lộ token admin, lộ tài khoản Cloudflare) là lấy được khóa. Phía máy khách, `ai.js` cho người dùng tự nhập khóa riêng (lưu `localStorage`) — nếu XSS thì lộ.
- **Giảm thiểu:** khóa nhà cung cấp chuyển sang **Worker Secret** thay vì KV; xác thực hai lớp cho tài khoản Cloudflare; game không cho nhập khóa riêng.
- **Phát hiện:** cảnh báo chi tiêu bất thường từ nhà cung cấp.
- **Dự phòng:** thu hồi khóa, cấp khóa mới.

### RISK-126 · XSS qua tên, danh hiệu, văn bản AI
**Bảo mật · K 2 · T 4 · 8 Cam · Chủ: TMC + QA · Mốc: M0**
- **Mô tả:** `cleanName` bỏ `<>&"'\``; `master-ui.js › md()` escape trước rồi mới thay markdown — đúng. Rủi ro là hồi quy: một UI mới dùng `innerHTML` với `title` (không lọc ký tự) hoặc tên NPC.
- **Giảm thiểu:** quy tắc: mọi chuỗi từ mạng/AI qua `esc()`; test tự động chèn `<img onerror>` vào mọi trường giao thức và kiểm DOM; CSP chặt cho trang game (game không có script nội tuyến như app chính — cần xác minh).
- **Phát hiện:** test Playwright.
- **Dự phòng:** vá nhanh.

### RISK-127 · Chuỗi cung ứng phần mềm
**Bảo mật · K 2 · T 4 · 8 Cam · Chủ: TBM · Mốc: M1**
- **Mô tả:** Three.js, Vite, Capacitor, plugin, `lunar-javascript`, Playwright. Gói bị chèn mã độc có thể đọc `localStorage` (ngày sinh) và gửi đi.
- **Giảm thiểu:** khóa phiên bản (`package-lock`), `npm audit` trong CI, cập nhật có chủ đích, ít phụ thuộc mới; CSP `connect-src` chỉ cho miền của dự án.
- **Phát hiện:** cảnh báo bảo mật của kho mã.
- **Dự phòng:** quay về bản khóa trước.

### RISK-128 · Rút cạn hạn mức AI bằng IP xoay vòng
**Bảo mật · K 3 · T 3 · 9 Cam · Chủ: TMC · Mốc: M1**
- **Mô tả:** giới hạn 30/phút/IP; CORS chặn trang web khác nhưng không chặn yêu cầu từ máy chủ (không có `Origin`). Proxy `/zai` không xác thực người gọi.
- **Giảm thiểu:** yêu cầu mã phiên ký (HMAC theo `pid` + hạn) cho mọi lời gọi AI từ game; ngân sách ngày toàn cục (RISK-066).
- **Phát hiện:** `free:log` có nhiều IP lạ cùng mẫu.
- **Dự phòng:** `isFreeAiEnabled = false`.

### RISK-129 · Tham số `?server=` trỏ game tới máy chủ giả
**Bảo mật · K 3 · T 4 · 12 Cam · Chủ: TBM + TMC · Mốc: M0**
- **Mô tả:** `net.js › serverBase()` đọc `?server=` từ URL và **lưu** vào `localStorage['huyenquan:server']`. Một đường dẫn độc hại `…/game?server=wss://ke-xau.example` làm game kết nối máy chủ giả **mãi về sau**. Máy khách gửi `pid` (định danh dùng để chặn, báo cáo) và hiển thị mọi tên, câu nói máy chủ giả gửi — kênh lừa đảo («Thầy Tử Bình: chuyển khoản để giải hạn») ngay trong giao diện game.
- **Giảm thiểu:** bỏ đọc `?server=` trong bản phát hành (chỉ giữ trong chế độ dev), hoặc danh sách miền cho phép; không lưu vào `localStorage`.
- **Phát hiện:** test: build phát hành không chứa chuỗi `'server'` trong `serverBase`.
- **Dự phòng:** bản vá xóa `huyenquan:server` khi khởi động.

### RISK-130 · Tài sản 3D tải từ nguồn ngoài bị thay
**Bảo mật · K 2 · T 3 · 6 Xanh · Chủ: TMC · Mốc: M2**
- **Mô tả:** mô hình, texture từ CDN ngoài có thể bị thay bằng hình xúc phạm.
- **Giảm thiểu:** tự lưu tài sản trên miền dự án, kiểm băm khi build.
- **Phát hiện:** —
- **Dự phòng:** —

### RISK-131 · Storage Durable Object tăng không giới hạn
**Bảo mật · K 2 · T 2 · 4 Xanh · Chủ: TMC · Mốc: M1**
- **Mô tả:** khóa `report:*` không TTL (RISK-109); về sau nếu thêm khóa theo người chơi trong DO phòng, dung lượng tăng mãi.
- **Giảm thiểu:** dùng `setAlarm` dọn định kỳ; dữ liệu lâu dài ở D1.
- **Phát hiện:** theo dõi dung lượng.
- **Dự phòng:** dọn thủ công.

### RISK-132 · Mất tiến độ khi `localStorage` bị xóa
**Bảo mật · K 4 · T 2 · 8 Cam · Chủ: TMC + GĐSX · Mốc: M1**
- **Mô tả:** trình duyệt xóa dữ liệu, iOS dọn bộ nhớ, đổi máy → mất toàn bộ tiến độ (chỉ có bản `:corrupt` khi lỗi phân tích). Người đã nạp tiền mất Ngọc → khiếu nại.
- **Giảm thiểu:** xuất/nhập tệp sao lưu (không gửi máy chủ); tài khoản tùy chọn cho đồng bộ; trước khi bán tiền thật bắt buộc có sổ cái máy chủ (RISK-119).
- **Phát hiện:** —
- **Dự phòng:** hỗ trợ khôi phục từ sổ cái.

---

## 3. Phần H — Kinh tế (RISK-133 … RISK-142)

### RISK-133 · Rò rỉ «mua được công đức» qua chuỗi chuyển đổi
**Kinh tế · K 3 · T 5 · 15 Đỏ · Chủ: TKT + TND · Mốc: M1**
- **Mô tả:** chuỗi: Ngọc (mua được) → bộ ngũ hành «Hợp mệnh» (+10% Phúc Khí khi giải án — `cosmetics.js`) → nhiều Phúc Khí hơn → «bố thí Phúc Khí cho quỹ chùa» (+1…+2 công, §5.3) → Sổ Công Quá → Đạo Hạnh. Mỗi mắt xích nhỏ, nhưng cả chuỗi là bán công đức gián tiếp — vi phạm §11 «công đức không mua được».
- **Giảm thiểu:** bất biến E1–E6 (§4.3): công đức từ bố thí tính theo **số lần** (≤ 1 lần/ngày), không theo lượng Phúc Khí; thưởng «Hợp mệnh» chỉ cộng Phúc Khí, Phúc Khí không đổi được thành bất cứ thứ gì tính vào Đạo Hạnh.
- **Phát hiện:** test mô phỏng kinh tế: hai người chơi giống hệt, một người nạp tối đa, sau 30 ngày Đạo Hạnh chênh ≤ 0.
- **Dự phòng:** vá công thức, không hồi tố trừ điểm người chơi.

### RISK-134 · VIP mở ngự kiếm sớm — mua mốc cảnh giới
**Kinh tế · K 5 · T 3 · 15 Đỏ · Chủ: TKT + GĐSX · Mốc: M3**
- **Mô tả:** `wardrobe-ui.js › vipView`: «Ngự kiếm phi hành ngay, không chờ cấp 8». §9.1 gộp ngự kiếm vào **cảnh giới bậc 3**. Khi cảnh giới thay cấp, VIP mở ngự kiếm sớm nghĩa là **mua quyền lợi của cảnh giới**.
- **Giảm thiểu:** ngự kiếm gắn cảnh giới, không gắn VIP; VIP chỉ có thẩm mỹ (hình dạng kiếm, vệt bay) cho người **đã** mở ngự kiếm; sửa dòng quảng cáo VIP.
- **Phát hiện:** test: `unlocked(state, 'kiem')` khi VIP mà cảnh giới < 3 phải trả `false`.
- **Dự phòng:** đổi quyền lợi VIP, đền bù Ngọc cho người đã mua vì quyền lợi đó.

### RISK-135 · Thêm gacha, hộp ngẫu nhiên vì áp lực doanh thu
**Kinh tế · K 3 · T 5 · 15 Đỏ · Chủ: GĐSX + TKT + PC · Mốc: mọi mốc**
- **Mô tả:** game hiện **không có gacha** (§14: «Không gacha»). Áp lực doanh thu thường dẫn tới «túi phúc», «rút quẻ may mắn» trả phí — đặc biệt hấp dẫn với chủ đề xem số. Hộp ngẫu nhiên trả phí bị cấm hoặc hạn chế ở một số nước, buộc công bố tỉ lệ trên cửa hàng ứng dụng, và trong game xem số thì là «bán vận may» (RB5).
- **Giảm thiểu:** bất biến E3 (§4.3) ghi vào điều lệ dự án; mọi kết quả ngẫu nhiên (xin xăm, quẻ) **không bao giờ** liên quan tiền tệ trả phí, không mua thêm lượt, không quay lại bằng Ngọc.
- **Phát hiện:** test danh mục: không có `SKU` nào có `random: true`.
- **Dự phòng:** —

### RISK-136 · Bán hàng nhắm vào người đang lo âu
**Kinh tế · K 2 · T 5 · 10 Cam · Chủ: TKT + TAT · Mốc: M6**
- **Mô tả:** game biết ai đang ở «năm hạn», ai lá số thấp. Hiện ưu đãi ngay sau Hồi III hoặc sau khi xem Thái Tuế là khai thác tâm lý.
- **Giảm thiểu:** cửa hàng **không đọc** dữ liệu lá số, Thời Vận, tiến độ Hồi III; không có cửa sổ bán hàng bật lên sau cảnh cảm xúc; ưu đãi giống nhau cho mọi người.
- **Phát hiện:** rà mã cửa hàng: không import `chart.js`, `vanmenh.js`, `thaitue.js`.
- **Dự phòng:** gỡ ưu đãi.

### RISK-137 · Đạo Lộ mùa gây FOMO, gắn lễ tôn giáo
**Kinh tế · K 3 · T 3 · 9 Cam · Chủ: TKT · Mốc: M6**
- **Mô tả:** battle pass thẩm mỹ theo niên chủ Thái Tuế — món hết mùa không quay lại tạo áp lực.
- **Giảm thiểu:** món Đạo Lộ quay lại sau 2 mùa với giá Phúc Khí; không bán cấp Đạo Lộ bằng tiền vượt quá 30% tổng cấp; không gắn lễ tôn giáo (RISK-030).
- **Phát hiện:** khảo sát.
- **Dự phòng:** —

### RISK-138 · Bán lượt AI là bán «lời thầy»
**Kinh tế · K 3 · T 4 · 12 Cam · Chủ: TKT + TPH · Mốc: M6**
- **Mô tả:** §11 cho bán «thêm lượt AI / ngày». Lượt AI là luận giải lá số — tức bán dịch vụ xem số. Trên iOS là 4.3(b); về đạo đức là sát ranh giới «kết quả luận giải tốt hơn».
- **Giảm thiểu:** lượt AI **không bán lẻ**; VIP có thêm lượt như tiện ích nhưng **chất lượng câu trả lời như nhau** (cùng mô hình, cùng brief); bản iOS không có.
- **Phát hiện:** test: cấu hình `askAI` không đọc trạng thái VIP.
- **Dự phòng:** bỏ quyền lợi.

### RISK-139 · Mua bán tài khoản, giao dịch ngoài game
**Kinh tế · K 3 · T 3 · 9 Cam · Chủ: TCĐ + PC · Mốc: M6**
- **Mô tả:** tài khoản Đạo Hạnh cao, danh hiệu hiếm có giá; mua bán tài khoản kèm lừa đảo.
- **Giảm thiểu:** không có trao đổi vật phẩm giữa người chơi; điều khoản cấm; danh hiệu gắn hành trình (không chuyển).
- **Phát hiện:** theo dõi chợ ngoài.
- **Dự phòng:** khóa tài khoản giao dịch.

### RISK-140 · Lạm phát Phúc Khí, Ngọc
**Kinh tế · K 3 · T 2 · 6 Xanh · Chủ: TKT · Mốc: M3**
- **Mô tả:** điểm danh 10–80 Ngọc/ngày, VIP +30/ngày, +20/cấp; Phúc Khí từ trà, nhang, án. Danh mục 51 món cạn nhanh, người chơi lâu năm hết mục tiêu.
- **Giảm thiểu:** mô hình nguồn – tiêu (tài liệu 11); bổ sung «chỗ tiêu» phi thương mại: góp xây đạo tràng môn phái, sửa đường (§5.3), không bán Ngọc lấy Đạo Hạnh.
- **Phát hiện:** số dư trung vị theo tuần.
- **Dự phòng:** điều chỉnh nguồn.

### RISK-141 · Không có nhật ký giao dịch máy chủ khi có tranh chấp
**Kinh tế · K 4 · T 3 · 12 Cam · Chủ: TMC + TKT · Mốc: M6**
- **Mô tả:** giao dịch mua món trong `cosmetics.js › buy` diễn ra trên máy; không có bằng chứng khi người chơi khiếu nại mất món đã nạp tiền mua.
- **Giảm thiểu:** mọi giao dịch có tiền thật ghi sổ cái máy chủ (id giao dịch cửa hàng, thời điểm, món, trạng thái).
- **Phát hiện:** —
- **Dự phòng:** hoàn theo hóa đơn cửa hàng.

### RISK-142 · Quyên góp thật cho chùa, quỹ từ thiện trong sự kiện game
**Kinh tế · K 2 · T 4 · 8 Cam · Chủ: PC + GĐSX · Mốc: M6**
- **Mô tả:** ý tưởng «sự kiện máy chủ góp công sửa đường» có thể bị mở rộng thành quyên góp tiền thật cho chùa, cho từ thiện. Vận động quyên góp có quy định riêng *(cần luật sư xác minh văn bản hiện hành về vận động, tiếp nhận đóng góp tự nguyện)*; dễ bị nghi lợi dụng tôn giáo (RISK-082).
- **Giảm thiểu:** không nhận tiền quyên góp trong game; nếu dự án muốn làm từ thiện: làm ngoài game, qua tổ chức hợp pháp, công khai sổ sách, không gắn phần thưởng trong game.
- **Phát hiện:** —
- **Dự phòng:** —

---

## 4. Bất biến kinh tế (ràng buộc thiết kế, có kiểm tự động)

### 4.1 Danh mục cấm bán (bằng bất kỳ tiền tệ nào có thể mua bằng tiền thật)

| Mã | Cấm bán | Lý do | Nguồn |
|---|---|---|---|
| E-C1 | Đạo Hạnh, cảnh giới, công đức, mốc Liễu Phàm | T6, §11 | canon §7 |
| E-C2 | Mệnh Đồ, tầng Mệnh Đồ, gợi ý cải mệnh «cao cấp» | RB5 | `anti-manipulation-data` |
| E-C3 | Vật phẩm có mô tả hứa tác dụng đời thực (giải hạn, đổi vận, trừ tà, cầu tài, hộ mệnh, cầu con, cầu duyên) | BLHS (RISK-081), RB5 | — |
| E-C4 | Lượt xin xăm, gieo quẻ, đổi kết quả ngẫu nhiên | RISK-135 | — |
| E-C5 | Pháp phục, pháp khí, tượng thần Phật, biểu tượng chứng đắc | RISK-001, RISK-027 | tập 14.07 §5 |
| E-C6 | Đèn Thái Tuế, đèn tưởng niệm, «siêu độ» | RISK-016, RISK-018 | — |
| E-C7 | Rút ngắn chuỗi sám hối, trả Nợ Âm bằng tiền | §5.4 «không có sám hối chỉ bằng nút» | canon §6 |
| E-C8 | Thứ hạng, vị trí trên Thiên Bảng | §11 | — |
| E-C9 | Câu trả lời AI «tốt hơn» (mô hình mạnh hơn, brief dài hơn) | RISK-138 | — |
| E-C10 | Trang phục dân tộc thiểu số có thật | RISK-012 | tập 14.07 §4 |

### 4.2 Danh mục được bán (điều kiện kèm theo)

| Loại | Điều kiện |
|---|---|
| Trang phục cư sĩ, thư sinh, giang hồ | `garment: 'lay'`; không mang biểu tượng thiêng; mô tả không hứa tác dụng |
| Hào quang, vệt bước, ngự vật, khung tên | Không dùng hình tượng gắn với một vị Phật, Bồ-tát, thần cụ thể; tắt trong vùng thiêng |
| Tiện ích (ô lưu hồ sơ khách, trang trí nhà) | Không ảnh hưởng Đạo Hạnh |
| VIP | Chỉ tiện ích + thẩm mỹ; không mở sớm quyền lợi cảnh giới (RISK-134) |
| Đạo Lộ mùa | Thẩm mỹ; có đường miễn phí; món quay lại |

### 4.3 Bất biến kiểm tự động (`scripts/test-game-cosmetics.mjs` mở rộng)

| Mã | Bất biến | Cách kiểm |
|---|---|---|
| E1 | Không món nào có `tags` chứa `sacred` mà có `price.ngoc` hoặc `unlock.vip` | duyệt `ITEMS` |
| E2 | Mô tả, tên không chứa từ trong `BANNED_ITEM_WORDS` | regex |
| E3 | Không có SKU ngẫu nhiên | duyệt danh mục SKU |
| E4 | Phúc Khí không có đường đổi sang Đạo Hạnh / công đức theo lượng | test mô phỏng 30 ngày |
| E5 | `unlocked()` của quyền lợi gắn cảnh giới không đọc `vipActive()` | test đơn vị |
| E6 | Mô-đun cửa hàng không import engine lá số | test tĩnh import |

`BANNED_ITEM_WORDS` (khởi đầu, TND duy trì): `đắc đạo`, `giải thoát`, `thành Phật`, `Bồ Tát`, `Phật`, `Pháp Luân`, `Sinh Liên`, `Liên Hoa Đài`, `xá lợi`, `cà sa`, `thụ lục`, `chính tông`, `trừ tà`, `giải hạn`, `đổi vận`, `hộ mệnh`, `cầu tài`, `cầu duyên`, `cầu con`, `bùa`, `ngải`, `cổ trùng`, `yểm`.
