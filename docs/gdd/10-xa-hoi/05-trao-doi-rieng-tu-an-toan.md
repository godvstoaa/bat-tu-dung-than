# 10 · Phần 05 — Trao đổi, quà tặng, riêng tư, chặn – báo cáo, kiểm duyệt, an toàn trẻ em

> Căn cứ: canon §2 T6, §7 (Phúc Khí, Ngọc, Tàng Y Các); bản sơ đồ §11 («không bao giờ bán cải mệnh»), §14 («Dữ liệu cá nhân: ngày sinh chỉ lưu trên máy… không gửi ngày sinh hay điểm Tiên Thiên nếu người chơi không bật "công khai căn cốt"»); `GAME-MMO-PROMPT-PLAN.md` (UGC phải có lọc từ ngữ, báo cáo, chặn, liên hệ hỗ trợ, điều khoản — Guideline 1.2; giai đoạn đầu chỉ chat cụm từ soạn sẵn); code thật: `protocol.js › cleanName, REPORT_REASONS, parseClient`, `worker/quan-room.js` (báo cáo, `stableId`), `net.js` (ẩn người, `localStorage huyenquan:blocked`), `cosmetics.js › cleanCos, encodeCos`.

---

## 5.1 Trao đổi và quà tặng — thiết kế chống mua bán bằng tiền thật (RMT)

### 5.1.1 Nguyên tắc

1. **Không có thứ gì mua được bằng tiền thật mà chuyển được cho người khác.** Nếu không chuyển được, không bán được ra ngoài.
2. **Không có chợ đấu giá giữa người chơi**, không có giao dịch hai chiều «đổi A lấy B».
3. Quà tặng là **cử chỉ**, giá trị nhỏ, do hệ thống phát hành theo nhịp, không tích trữ thành tài sản.
4. Đạo Hạnh, cảnh giới, công đức, Mệnh Đồ **không chuyển được dưới mọi hình thức** (bản sơ đồ §11).

### 5.1.2 Phân loại mọi thứ người chơi có

| Nhóm | Ví dụ | Chuyển cho người khác | Lý do |
|---|---|---|---|
| **Gốc tu** | Đạo Hạnh, cảnh giới, công đức (Sổ Công Quá), Mệnh Đồ, Tiên Thiên | **không bao giờ** | trụ cột T2/T6, §11 |
| **Tiền tệ** | Phúc Khí (`state.phucKhi`), Ngọc (`wardrobe.ngoc`) | **không** | chuyển được tiền tệ = có thị trường đen |
| **Đồ Tàng Y Các** | 51 món (`cosmetics.js › ITEMS`), mua bằng Phúc Khí hoặc Ngọc | **không** (gắn tài khoản) | đồ Ngọc có giá trị tiền thật |
| **Vật liệu** | 8 loại (Phần 01 §1.9.2) | chỉ **góp vào kho chi đường của mình** hoặc **dự án công cộng** | góp một chiều, không có đường quay về cá nhân |
| **Quà nhỏ** | trà mời, bánh lễ, hoa, đèn lồng giấy, thiệp — vật phẩm tiêu hao do hệ thống phát | **tặng được** (§5.1.3) | giá trị nhỏ, hết hạn, không tích được |
| **Lộc lễ** | «Lộc Xuân» (Tết), «Bánh Trung Thu», «Đèn Hoa Đăng» | **tặng được** theo luật lễ (Phần 09–10) | phát theo ngày, phải tặng đi mới có giá trị |
| **Đồ bày đạo tràng** | phần thưởng sự kiện cho chi đường | **không** (thuộc chi đường) | — |
| **Đồ đôi đạo lữ** | bộ «Đồng Tâm» | **không** | — |

### 5.1.3 Luật tặng quà nhỏ

| Luật | Giá trị |
|---|---|
| Ai tặng được ai | đạo hữu ≥ 3 ngày, hoặc người đang cùng nhóm đồng hành / cùng chi đường / sư đồ / kim lan / đạo lữ |
| Tặng tại chỗ | khi đứng gần (≤ 4 m) người nhận — hoạt ảnh trao tay (cử chỉ `gift`, Phần 06) |
| Tặng qua thư | đính kèm thư mẫu (Phần 04 §4.6.3), tối đa 1 món / thư |
| Trần gửi | 10 món / ngày |
| Trần nhận | 20 món / ngày (vượt thì món còn lại tự «chuyển cho chùa» — hiệu ứng nhỏ, không mất cho người gửi) |
| Hạn dùng | quà nhỏ hết hạn sau 7 ngày nếu không dùng |
| Giá trị khi dùng | tối đa tương đương **5 Phúc Khí** hoặc một buff thẩm mỹ ngắn (ánh sáng, mùi hương nhỏ) |
| Nguồn quà | hệ thống phát: 3 quà nhỏ / ngày cho mỗi người (nhận ở Trà Thất), thêm theo lễ |
| Không tặng được | món mua bằng Ngọc, vật liệu, tiền tệ |

**Vì sao có quà dù giá trị nhỏ:** quà là ngôn ngữ xã hội (mời trà là văn hóa Huyền Quán: `EMOTES.tea` «mời trà»). Giá trị nhỏ + hết hạn + trần nhận = vô dụng với kẻ buôn.

### 5.1.4 Lì xì và lộc lễ — mẫu thiết kế «phải cho đi mới có»

Lấy Tết làm ví dụ (chi tiết `EV-TET-01`, Phần 09):

- Mùng 1–3, mỗi người nhận **8 bao «Lộc Xuân»** / ngày (con số 8 theo thói quen «phát»). Bao **chỉ có tác dụng khi tặng cho người khác**.
- Người nhận mở bao: nhận một lượng **Phúc Khí do hệ thống tạo ra** (không trừ của người tặng), ngẫu nhiên 6 / 8 / 18 / 68 (xác suất cố định công khai: 50% / 30% / 18% / 2%) — **ghi rõ đây là lì xì vui, giá trị nhỏ, không mua được bằng tiền**.
- Người tặng không nhận gì vật chất; nhận **câu chúc** của người nhận (cụm từ nhóm «Chúc Tết», Phần 06) và một dấu «hào phóng» trong Sổ Mệnh (không xếp hạng).
- Một người nhận tối đa 16 bao / ngày.

**Lưu ý chống «hộp may rủi» (gacha):** bao Lộc Xuân không mua được, không có giá Ngọc, xác suất công khai, giá trị thấp → không phải gacha theo nghĩa pháp lý; vẫn đề nghị pháp chế xem xét theo luật từng thị trường (câu hỏi mở cuối README).

### 5.1.5 Mô hình đe dọa RMT

| Kịch bản kẻ buôn | Vì sao thất bại |
|---|---|
| Bán Phúc Khí / Ngọc | không chuyển được |
| Bán đồ Tàng Y Các | gắn tài khoản |
| Bán tài khoản cày sẵn | **không ngăn tuyệt đối được**; giảm động cơ: tài khoản gắn lá số của chính chủ (Tiên Thiên, Mệnh Đồ là của *người đó*) — mua tài khoản người khác là mua lá số người khác, vô nghĩa với trải nghiệm. Điều khoản cấm mua bán tài khoản; tài khoản đổi thiết bị đột ngột + đổi lá số chính bị gắn cờ |
| Dịch vụ «cày hộ» (đăng nhập hộ) | không ngăn tuyệt đối; giảm động cơ: không có bảng xếp hạng nào mang lại giá trị vật chất; Thiên Bảng có kiểm tra bất thường (Phần 07 §7.6) |
| Bán vật liệu cho chi đường | vật liệu không chuyển giữa người; chỉ góp vào kho chi đường **của chính mình** |
| Lập chi đường «buôn», gom vật liệu rồi bán chi đường | chi đường không chuyển nhượng ngoài cơ chế bầu cử; kho không rút ra cá nhân |
| Bán «suất» vào chi đường bậc cao | không có lợi ích vật chất chuyển ra; chỉ có công trình để dùng chung |
| Lừa đảo «tặng quà để nhận lại gấp đôi» | quà không có giá trị tích trữ; câu cố định trong giao diện tặng: «Quà để tặng, không để đổi. Ai hứa trả gấp đôi là lừa.» |

### 5.1.6 Phát hiện bất thường

Máy chủ ghi nhật ký tặng quà (người gửi, người nhận, loại, thời gian) trong D1 (Phần 12). Cờ tự động:

| Cờ | Điều kiện | Hành động |
|---|---|---|
| `GIFT_FAN_IN` | một tài khoản nhận quà từ ≥ 15 tài khoản khác nhau trong 24 giờ, các tài khoản gửi đều mới < 7 ngày | xem xét thủ công |
| `GIFT_RING` | chuỗi tặng khép kín A→B→C→A lặp ≥ 5 vòng / ngày | xem xét |
| `NEW_DEVICE_SWAP` | tài khoản cảnh giới ≥ 4 đổi thiết bị và đổi lá số chính trong 48 giờ | khóa tạm tính năng xã hội 24 giờ, yêu cầu xác thực lại |
| `DONATE_SPIKE` | một người góp vào kho chi đường vượt trần (không thể nếu máy chủ đúng) | lỗi hệ thống → cảnh báo kỹ thuật |

---

## 5.2 Riêng tư và «công khai căn cốt»

### 5.2.1 Hiện trạng: MMO đang gửi gì

`net.js` gửi `hello {name, robe, acc, cos, look, title, pid}`; `quan-room.js › pub()` phát lại cho mọi người cùng phòng `{id, u, name, robe, acc, cos, look, title, x, y, h, s, a}`.

| Trường | Nguồn ở client | Lộ gì | Đánh giá |
|---|---|---|---|
| `name` | tên người chơi tự đặt (qua `cleanName`) | tên hiển thị | công khai, chấp nhận |
| `robe` | `state.player.robe` = **`yong.primary`** (hành Dụng thần — `main.js` dòng `robe: y.primary`) | **hành Dụng thần** của người chơi | lộ một thông tin lá số (1 trong 5) |
| `acc` | `state.player.accent` = `y.secondary || y.xi` (**Hỷ thần**) | **hành Hỷ thần** | lộ thêm 1 trong 5 |
| `cos` | đồ Tàng Y Các (chuỗi gọn) | đồ đang mặc; bộ ngũ hành «Hợp mệnh» nếu mặc đủ bộ hợp Dụng | gián tiếp lộ Dụng thần |
| `look` | `hero_m` / `hero_f` | dáng nhân vật | không phải giới tính thật |
| `title` | `titleFor(phucKhi)` | danh hiệu theo Phúc Khí | công khai |
| `pid` | UUID `localStorage` | máy chủ băm thành `u` (`stableId`) trước khi phát | `pid` không phát lại — tốt |

Bản sơ đồ §14 đã chấp nhận «MMO chỉ gửi màu áo, trang bị, Đạo Hạnh tổng». Tài liệu này giữ quyết định đó nhưng **làm rõ cho người chơi** rằng màu áo Bản Mệnh Y = hành Dụng thần, và thêm lựa chọn ẩn.

### 5.2.2 Lựa chọn «Ẩn màu bản mệnh»

- Tùy chọn trong Sổ Mệnh › Riêng tư: **«Ẩn màu bản mệnh khi online»**.
- Bật: client gửi `robe: 'trung'`, `acc: ''` (giá trị mới, Phần 11 §11.3 thêm vào `ROBES`), người khác thấy áo màu xám tro trung tính; **trên máy mình** vẫn thấy màu thật.
- Đồ Tàng Y Các bộ ngũ hành vẫn hiện đúng màu (người chơi tự chọn mặc), nhưng **hiệu ứng «Hợp mệnh»** (ánh sáng bộ khi hợp Dụng thần) chỉ hiện ở máy mình khi bật ẩn.
- Mặc định: **tắt** (giữ trải nghiệm hiện tại — áo theo mệnh là nét đẹp của game), nhưng màn hình lần đầu vào MMO giải thích một dòng: «Màu áo Bản Mệnh theo hành Dụng thần của bạn. Người khác sẽ thấy màu này. Có thể ẩn trong Sổ Mệnh › Riêng tư.»

### 5.2.3 Năm mức «công khai căn cốt»

| Mức | Tên | Chia sẻ gì | Mặc định |
|---|---|---|---|
| 0 | **Kín** | không gì ngoài §5.2.1 | ✓ |
| 1 | **Phẩm căn** | tên Phẩm căn (`synthesis.gradeVi`), Mệnh Cách (`patternQuality.quality` → Thuận Thiên/Đắc Cứu/Nghịch Thiên/Dị Cách) | |
| 2 | **Mệnh Bàn tóm tắt** | mức 1 + Ngũ Hành Lực (`wx.pct` làm tròn 5%) + Thân Lực bậc (`strength.level`) + Thiên Mệnh Hành (Dụng/Hỷ/Kỵ) | |
| 3 | **Thẻ hợp** | dữ liệu tối thiểu cho `hehun` / `partner-match` (Phần 04 §4.4.4) — chỉ dùng trong phép so, không hiển thị trực tiếp | |
| 4 | **Tứ trụ** | 8 chữ can chi của 4 trụ | |

**Không có mức nào gửi ngày/giờ sinh dương lịch hoặc âm lịch thô.** Tứ trụ (mức 4) vẫn suy được ngày sinh trong một tập nhỏ — màn bật mức 4 có cảnh báo như §4.4.5 của Phần 04.

Mỗi mức đặt **theo người xem**:

| Người xem | Mức tối đa được đặt |
|---|---|
| Mọi người trong phòng | 1 |
| Đạo hữu | 2 |
| Chi đường (đồng môn) | 2 |
| Một người cụ thể (thầy, kim lan, đạo lữ) | 4 |

Mỗi cấp chia sẻ có **hạn** (mặc định 30 ngày, chọn 1 ngày / 7 ngày / 30 ngày / không hạn) và **thu hồi** được bất kỳ lúc nào (người kia mất quyền xem ngay; những gì họ đã thấy thì không «xóa khỏi trí nhớ» được — giao diện nói thật điều này).

### 5.2.4 Vì sao mức 1 không phải mặc định

Phẩm căn (Phàm Căn … Thiên Linh Căn) là con số lá số dễ gây so sánh. Trụ cột T2 và chỉ số thành công §13.5 của bản sơ đồ («người chơi lá số thấp ở lại 7 ngày không thấp hơn nhóm điểm cao») đòi hỏi người lá số thấp **không bị đánh giá** ngay khi xuất hiện. Vì vậy Phẩm căn chỉ hiện khi chính người đó chọn.

### 5.2.5 Lá số khách (profile) không bao giờ lên mạng

App cho lưu tối đa `CAPS.maxProfiles = 5` hồ sơ lá số khác (người thân). Những hồ sơ này **không có đường nào** đi lên máy chủ MMO: không có trong `hello`, không trong thẻ hợp (thẻ chỉ dựng từ lá số **chính chủ**), không trong thư. Test tĩnh: rà mọi `send(...)` trong `net.js` và mã mới không tham chiếu `state.profiles`.

### 5.2.6 Dữ liệu tông môn và tín ngưỡng thật

Tông môn trong game là **lựa chọn trò chơi**, nhưng tên tông trùng tên truyền thống tôn giáo có thật (Thiền, Tịnh Độ, Chính Nhất…). Một số luật bảo vệ dữ liệu (vd GDPR với «niềm tin tôn giáo» là dữ liệu đặc biệt; Nghị định 13/2023/NĐ-CP của Việt Nam về bảo vệ dữ liệu cá nhân có nhóm dữ liệu nhạy cảm gồm quan điểm tôn giáo) có thể coi việc hiển thị công khai «người này theo tông Phật giáo» là dữ liệu nhạy cảm.

Biện pháp:

- Giao diện chọn tông ghi: «Tông môn là lựa chọn trong trò chơi, không thể hiện tín ngưỡng thật của bạn.»
- Tùy chọn **«Ẩn tông môn»** khỏi nhãn tên công khai (vẫn hiện trong chi đường của mình).
- **Câu hỏi mở cho pháp chế** (README): có cần đồng ý riêng khi lưu tông môn trên máy chủ không.

### 5.2.7 Lưu trữ, xóa, xuất dữ liệu

| Dữ liệu trên máy chủ | Giữ bao lâu | Người chơi xóa được |
|---|---|---|
| Hồ sơ MMO (`uid`, tên, tên tu, tông, chi đường, cảnh giới, Đạo Hạnh tổng, cài đặt riêng tư) | đến khi xóa tài khoản | có (xóa tài khoản) |
| Quan hệ (đạo hữu, sư đồ, kim lan, đạo lữ) | như trên | có (từng quan hệ) |
| Nhật ký quà tặng | 90 ngày | không (phục vụ chống gian lận); xóa cùng tài khoản |
| Báo cáo người khác về mình | 180 ngày từ khi xử lý | không |
| Báo cáo mình gửi | 180 ngày | không |
| Thẻ hợp hôn | **không lưu** (tính xong xóa) | — |
| Phiếu nghị sự | đến khi chi đường hưu đường + 30 ngày | không |
| Vị trí trong thế giới | chỉ trong bộ nhớ phiên (attachment WebSocket) | — |

**Xuất dữ liệu:** Sổ Mệnh › Riêng tư › «Tải dữ liệu MMO của tôi» → tệp JSON gồm mọi bảng D1 có `uid` của mình (Phần 12).

**Xóa tài khoản:** chi đường mình làm Chủ Trì → chuyển giao theo luật vắng mặt ngay lập tức; tên tu, đạo hiệu biến khỏi mọi danh sách; bia/bảng (Bia Hồi Đầu, Bảng Vàng Giấy, bia công trình công cộng) thay tên bằng «một người tu».

---

## 5.3 Ẩn, chặn, báo cáo

### 5.3.1 Hiện trạng

| Chức năng | Code | Hành vi |
|---|---|---|
| **Ẩn** (block phía client) | `net.js › block(id)` | thêm `u` (mã băm ổn định) vào `localStorage huyenquan:blocked` (giữ 200 mã gần nhất); xóa người đó khỏi cảnh; lọc `join`, `emo`, `say` của `u` đó |
| **Bỏ ẩn tất cả** | `net.js › unblockAll()` | xóa danh sách |
| **Báo cáo** | gói `report {id, why}`; `REPORT_REASONS = { name, spam, other }` | `TownShard` lưu `report:<người báo>:<đối tượng>` (một lần mỗi cặp), trần 500 báo cáo / phòng, trả `reported` |
| Báo cáo xong | `main.js` | tự ẩn người bị báo cáo |

Hạn chế hiện tại:

1. Ẩn chỉ ở client → người bị ẩn vẫn **mời**, **ghép nhóm**, **gửi thư** được (khi các tính năng đó có).
2. Báo cáo nằm rải trong storage của từng phòng TownShard → không ai đọc tập trung; không có hàng chờ xử lý.
3. Ba lý do quá ít cho các hành vi mới (quấy rối trong chi đường, gạ gẫm trẻ em, lừa đảo).
4. `pid` không bền → người bị ẩn đổi trình duyệt là thoát ẩn.

### 5.3.2 Thiết kế mới

**Ẩn (giữ nguyên trải nghiệm, thêm đồng bộ):**

- Danh sách ẩn vẫn ở client (mất mạng vẫn chạy), **và** đồng bộ lên máy chủ khi có danh tính bền (gói `block_sync`, Phần 11). Máy chủ dùng nó để: không giao lời mời, thư, quà, lời xin nhập chi đường từ người bị ẩn; không ghép tự động hai người với nhau.
- Người bị ẩn **không** được thông báo.
- Ẩn trong chi đường: vẫn là đồng môn (không tự rời), nhưng mình không thấy họ trong đạo tràng và không thấy cụm từ của họ trên bảng tin chi đường. Nếu cảm thấy không an toàn, có nút **«Rời chi đường và báo cáo»**.

**Báo cáo — mười lý do:**

| Mã (`why`) | Lý do | Ưu tiên xử lý |
|---|---|---|
| `name` | Tên không phù hợp | thường (có tự động tạm đổi tên, §5.3.3) |
| `spam` | Làm phiền / spam cử chỉ, cụm từ, lời mời | thường |
| `follow` | Đi theo, chắn đường, đứng chặn chỗ lễ | thường |
| `harass` | Quấy rối có chủ đích (nhắm vào một người lặp lại) | cao |
| `minor` | Hành vi không phù hợp với người nhỏ tuổi | **khẩn** |
| `scam` | Lừa đảo, hứa đổi chác, đòi phí | cao |
| `cheat` | Gian lận, dùng công cụ tự động | thường |
| `guild` | Lạm quyền trong chi đường (đuổi vô cớ, ép góp) | thường |
| `impersonate` | Mạo danh nhân viên game / NPC / người khác | cao |
| `other` | Lý do khác | thường |

Ba mã cũ (`name`, `spam`, `other`) giữ nguyên để tương thích `REPORT_REASONS`.

### 5.3.3 Bằng chứng tự động

Vì không có chat tự do, mọi «lời nói» là mã cụm từ. Khi có báo cáo, máy chủ đính kèm **bằng chứng có cấu trúc**:

- 60 giây gói gần nhất của người bị báo cáo trong phòng: `say {k}`, `emo {e, to}`, `inv`, quà, thư (tiêu đề + mã câu), vị trí tương đối so với người báo (khoảng cách theo thời gian — để đánh giá «đi theo»);
- tên, tên tu, tông, chi đường, tuổi tài khoản, nhóm tuổi của hai bên;
- số báo cáo trước đó về cùng đối tượng (từ người khác).

Không đính kèm dữ liệu lá số dưới bất kỳ hình thức nào.

**Tự động đổi tên tạm** (lý do `name`): khi một tên nhận báo cáo `name` từ ≥ 3 người khác nhau (khác thiết bị) trong 24 giờ, máy chủ tạm hiển thị tên đó là «Khách» (cơ chế đã có: `welcome.renamed`, `parseClient › badName`) cho đến khi người kiểm duyệt xem. Chủ tên nhận thông báo và được đề nghị đổi tên.

### 5.3.4 Trọng số tin cậy của người báo

Để chống «báo cáo dồn» (một nhóm báo cáo bừa một người):

```
w(người báo) = 0,2                  nếu tuổi tài khoản < 2 ngày hoặc không có danh tính bền
             = 0,5                  nếu báo cáo của người này bị bác ≥ 50% trong 30 ngày qua
             = 1,0                  ngược lại
             = 1,5                  nếu người này có ≥ 5 báo cáo được xác nhận và < 20% bị bác
điểm_báo_cáo(đối tượng, 24h) = Σ w của các người báo **khác thiết bị**, tính theo từng lý do
```

| Ngưỡng | Hành động tự động (tạm thời, chờ người duyệt) |
|---|---|
| `spam` ≥ 3 | tắt cụm từ + cử chỉ của đối tượng 30 phút |
| `follow` ≥ 3 | bật «bong bóng riêng» cho mọi người báo (đối tượng mờ đi, không lại gần được < 3 m) |
| `harass` ≥ 3 | khóa lời mời, thư, quà của đối tượng 24 giờ |
| `minor` ≥ 1 (người báo w ≥ 1) | đưa lên **hàng khẩn**; đối tượng bị chặn mọi tương tác với tài khoản < 18 ngay lập tức, chờ duyệt |
| `scam` ≥ 2 | tắt tặng quà của đối tượng 24 giờ |

Không có hành động tự động nào là **khóa tài khoản vĩnh viễn**; khóa vĩnh viễn chỉ do người.

### 5.3.5 Phản hồi cho người báo

- Ngay khi gửi: «Đã gửi báo cáo. Cảm ơn bạn giữ quán yên tĩnh.» (câu hiện có trong `main.js`) + người đó tự bị ẩn (như hiện tại).
- Khi xử lý xong: thông báo **chung chung** («Chúng tôi đã xem báo cáo của bạn và có biện pháp phù hợp» hoặc «… chưa thấy vi phạm»), không tiết lộ hình phạt cụ thể của người khác.

---

## 5.4 Kiểm duyệt

### 5.4.1 Bề mặt nội dung do người chơi tạo (UGC)

Vì chat chỉ là cụm từ, bề mặt UGC của game rất nhỏ:

| Thứ | Tự do? | Kiểm soát |
|---|---|---|
| Tên hiển thị | **có** (≤ 24 ký tự) | `cleanName`: bỏ ký tự điều khiển/zero-width, bỏ `<>&"'\``, gộp khoảng trắng, chặn danh sách thô tục `BAD`; báo cáo `name` |
| `title` trong `hello` | **có — lỗ hổng** | hiện `parseClient` nhận **bất kỳ chuỗi ≤ 24 ký tự** cho `title`; client gửi `titleFor(phucKhi).name` nhưng người sửa client gửi được chữ tùy ý → **sửa: `title` phải thuộc danh sách danh xưng hợp lệ** (enum từ `TITLES`, danh xưng tông, cảnh giới, sự kiện) — Phần 11 §11.3 |
| Tên chi đường, tên tu, tên kim lan | không (ghép từ danh sách) | danh sách đen tổ hợp |
| Cụm từ, cử chỉ | không | thư viện cố định (Phần 06) |
| Thư | không (mẫu) | — |
| Bố trí nhà riêng / đạo tràng | không (mô-đun) | không có chữ tự do trên đồ |
| Câu đối đạo tràng | không (bộ soạn sẵn) | — |

**Hệ quả:** kiểm duyệt chủ yếu là **tên hiển thị** và **hành vi** (spam cử chỉ, đi theo, quấy rối bằng lời mời, lạm quyền chi đường).

### 5.4.2 Bổ sung lọc tên

`BAD` hiện có 15 mục. Bổ sung (Phần 11 §11.3):

- danh sách mở rộng tiếng Việt có dấu/không dấu, viết lái, chèn ký tự (vd «đ.m», «d m», «đờ mờ»);
- chuẩn hóa trước khi so: bỏ dấu, thay số giống chữ (0→o, 1→i, 3→e, 4→a, 5→s, 7→t), gộp chữ lặp;
- chặn tên mạo danh: «Admin», «GM», «Quản trị», «Huyền Quán», tên NPC canon (Trương Thiên Sư, Vân Cốc…), «Thầy Tử Bình»;
- chặn tên chứa số điện thoại, đường dẫn, mã mạng xã hội (dãy ≥ 7 chữ số; «zalo», «fb», «.com», «t.me»…) — chống dụ ra ngoài game.

### 5.4.3 Bậc xử lý

| Bậc | Biện pháp | Ai áp | Thời hạn |
|---|---|---|---|
| 1 | Nhắc nhở (thông báo trong game, câu mẫu) | tự động hoặc người | — |
| 2 | Tắt cụm từ + cử chỉ | tự động (§5.3.4) hoặc người | 30 phút – 24 giờ |
| 3 | Khóa tương tác chủ động (mời, thư, quà, xin nhập chi đường) | người | 1–7 ngày |
| 4 | Khóa MMO (chơi đơn vẫn được) | người | 7–30 ngày |
| 5 | Khóa vĩnh viễn MMO | người, có người thứ hai duyệt | vĩnh viễn |

Mọi biện pháp ghi vào **nhật ký kiểm duyệt** (ai, khi nào, lý do, bằng chứng). Chơi đơn **không bao giờ** bị khóa vì vi phạm MMO (game offline-first — `net.js` «không kết nối được thì game vẫn chơi đơn như cũ»).

### 5.4.4 Bảng điều khiển kiểm duyệt (công cụ nội bộ)

- Hàng chờ theo ưu tiên (khẩn → cao → thường), lọc theo lý do, phòng, chi đường.
- Xem bằng chứng có cấu trúc (§5.3.3) dưới dạng **dòng thời gian dựng lại**: hai chấm trên bản đồ, bong bóng cụm từ theo thời gian.
- Nút áp bậc 1–5, ghi lý do (danh sách), gửi thông báo cho người bị xử lý.
- Tra lịch sử một tài khoản (báo cáo đã nhận, đã gửi, biện pháp).
- Không có quyền xem lá số, Sổ Mệnh, nhà riêng của người chơi.

### 5.4.5 Nhân lực (ước lượng để lập kế hoạch)

| Người chơi hoạt động / ngày | Báo cáo / ngày (giả định 2% người báo 1 lần) | Người kiểm duyệt (xử lý ~150 báo cáo / ca 8 giờ) |
|---|---|---|
| 1.000 | 20 | 0,2 (kiêm nhiệm) |
| 10.000 | 200 | 1,5 |
| 50.000 | 1.000 | 7 + 1 trực khẩn |

Hàng **khẩn** (`minor`) cần phản hồi trong **≤ 2 giờ** mọi lúc; ở quy mô nhỏ, đây là ràng buộc lịch trực chứ không phải khối lượng.

---

## 5.5 Khiếu nại

| Loại | Gửi ở đâu | Ai xử lý | Thời hạn trả lời |
|---|---|---|---|
| Bị xử lý kiểm duyệt (bậc 2–5) | Sổ Mệnh › Hộp thư hệ thống › «Khiếu nại» (chọn lý do từ danh sách + 1 cụm «tôi không đồng ý») | người kiểm duyệt **khác** người đã xử lý | 72 giờ |
| Bị mời ra khỏi chi đường | thông báo mời ra có nút «Tôi cho rằng mình bị đối xử không công bằng» | kiểm duyệt xem Sổ Đường của chi đường (ai đuổi, lý do, nghị sự) | 7 ngày |
| Tên bị tạm đổi | — | đổi tên mới là hết | — |
| Bị khóa vĩnh viễn | email hỗ trợ (liên hệ hỗ trợ là yêu cầu Guideline 1.2) | trưởng nhóm kiểm duyệt | 14 ngày |

Chi đường **không** bị phạt vì đuổi người theo đúng luật; khiếu nại chi đường chỉ dẫn đến biện pháp khi có dấu hiệu bắt nạt (vd một người bị đuổi ngay sau khi báo cáo Chủ Trì). Khi đó Chủ Trì có thể bị bậc 3 với lý do `guild`.

---

## 5.6 An toàn trẻ em

### 5.6.1 Nhóm tuổi

Khi lần đầu vào phần MMO, người chơi khai **năm sinh dương lịch** (chỉ để xếp nhóm tuổi; **không** dùng cho lá số, không gửi lên máy chủ — client tính nhóm và chỉ gửi nhóm).

| Nhóm | Tuổi | MMO |
|---|---|---|
| `U13` | dưới 13 | **tắt** phần MMO (chơi đơn đầy đủ); có thể bật khi có xác nhận của phụ huynh (luồng xác nhận — câu hỏi mở cho pháp chế) |
| `T` (thiếu niên) | 13–17 | bật với **chế độ an toàn** (§5.6.2) |
| `A` (người lớn) | 18+ | đầy đủ |

**Lưu ý lá số:** lá số chính của người chơi có năm sinh; nếu năm sinh lá số cho thấy người chơi dưới 13 mà nhóm khai là `A`, client **không** tự đổi nhóm (lá số có thể là của người khác, vd phụ huynh lập cho con) nhưng hiện một lời hỏi lại nhẹ nhàng lần đầu. Không gửi so sánh này lên máy chủ.

### 5.6.2 Chế độ an toàn cho nhóm T

| Tính năng | Người lớn (A) | Thiếu niên (T) |
|---|---|---|
| Thấy người khác trong phòng | có | có (phòng chung) |
| Cụm từ, cử chỉ công khai | đủ | đủ trừ nhóm «Đạo lữ» |
| Kết đạo hữu | với ai cũng được | chỉ với nhóm T; hoặc với người lớn **qua mã đạo hữu** (biết nhau ngoài đời) + xác nhận lại sau 24 giờ |
| Thư | với đạo hữu | với đạo hữu (thư từ người lớn chỉ khi đạo hữu qua mã) |
| Quà nhỏ | đạo hữu, đồng môn | chỉ trong nhóm T và đạo hữu qua mã |
| Lời mời đồng hành từ người lạ | có | **không** nhận từ người lớn lạ |
| Ghép tự động | trong nhóm A | trong nhóm T |
| Sư đồ | trong nhóm A | trong nhóm T |
| Kim lan | trong nhóm A | trong nhóm T |
| Đạo lữ | có | **không** |
| Vào chi đường | có | có; chi đường có thành viên T tự bật «cờ T» (§5.6.3) |
| Lớp học nhóm (Giáo Tập) | có | có (≥ 3 người, nơi chung) |
| Hiện vùng đang ở cho đạo hữu | tùy chọn | tắt mặc định |
| Tên hiển thị | tự do có lọc | tự do có lọc + chặn thêm mẫu số điện thoại, mạng xã hội |

### 5.6.3 Chi đường có thành viên thiếu niên

- Chi đường được đánh dấu «có thành viên T» (không hiện ai là T).
- Trong chi đường đó, tương tác giữa A và T dùng luật **nơi chung**: bảng tin chung, lễ chung, lớp học; **không** có kênh 1–1 mới mở chỉ vì là đồng môn (thư 1–1 vẫn theo luật đạo hữu §5.6.2).
- Chủ Trì là người lớn thì nhận một **lời nhắc** khi lần đầu có thành viên T: «Chi đường có thành viên nhỏ tuổi. Hãy giữ mọi sinh hoạt ở nơi chung.»
- Báo cáo `minor` trong chi đường có thành viên T được xử lý **khẩn**.

### 5.6.4 Dấu hiệu dụ dỗ (grooming) mà hệ thống theo dõi

Không có chat tự do nên dấu hiệu là **hành vi**:

| Dấu hiệu | Ngưỡng gắn cờ (người lớn → thiếu niên) |
|---|---|
| Liên tục đi theo một tài khoản T qua nhiều vùng | ≥ 3 vùng trong 1 giờ, khoảng cách < 10 m |
| Gửi lời mời đạo hữu tới nhiều tài khoản T (qua mã) | ≥ 3 tài khoản T / tuần |
| Gửi quà liên tục cho một tài khoản T | ≥ 5 quà / ngày, ≥ 3 ngày |
| Tên chứa dấu hiệu liên hệ ngoài (đã chặn ở lọc tên nhưng có thể lách) | bất kỳ |
| Bị báo cáo `minor` | bất kỳ |

Gắn cờ → hàng khẩn → người kiểm duyệt xem; trong lúc chờ, tương tác A ↔ T của tài khoản bị gắn cờ tạm khóa.

### 5.6.5 Thời gian chơi và giờ khuya

- Nhóm T: lời nhắc nghỉ sau mỗi 60 phút liên tục (Vân Cốc: «Ngồi lâu rồi. Đứng dậy uống nước, nhìn xa một chút.»); sau 22:00 giờ địa phương, lời nhắc mỗi 30 phút và phần MMO hiện thông báo nhẹ «Muộn rồi, hẹn bạn ngày mai».
- **Câu hỏi mở cho pháp chế:** quy định Việt Nam về giới hạn thời gian chơi trò chơi trực tuyến của người dưới 18 tuổi (các nghị định về quản lý trò chơi điện tử trực tuyến) — có áp dụng cho game này (phân loại, cấp phép) không, và nếu có thì giới hạn cụ thể là bao nhiêu. Thiết kế đã chừa chỗ: giới hạn giờ là **cấu hình máy chủ** theo nhóm tuổi và quốc gia.

### 5.6.6 Nội dung theo nhóm tuổi

| Nội dung | U13 (đơn) | T | A |
|---|---|---|---|
| Tà Lộ, Phong Đô | theo tài liệu 03/05 (có cổng) | có cổng tự nguyện | có cổng tự nguyện |
| Âm tà (Tĩnh Thất) | tắt | cổng tự nguyện + lời giải thích thêm | cổng tự nguyện |
| Đạo lữ, hợp hôn hai người chơi | không | không | có |
| Bàn Hợp Hôn án NPC (đã có) | có (là bài học) | có | có |

---

## 5.7 Hành vi phá rối đặc thù thế giới 3D

| Hành vi | Biện pháp |
|---|---|
| **Đi theo** một người khắp nơi | «Bong bóng riêng» tùy chọn: người mình chọn (hoặc mọi người lạ) không lại gần mình < 3 m — client của họ thấy mình mờ và có vật cản vô hình; máy chủ kiểm vị trí `mv` |
| **Đứng chắn cửa, chắn bậc** | nhân vật người chơi **không có va chạm với nhau** (hiện tại `collide.js` chỉ va chạm công trình) — không ai chắn được ai |
| **Đứng lên vị trí lễ của người khác** | vị trí lễ (vòng sáng) là chỗ **giữ chỗ**: ai đứng vào trước giữ; vòng sáng bị chiếm quá 2 phút không thao tác → tự nhả |
| **Spam cử chỉ nhắm vào một người** (`emo {to}`) | trần 6 cử chỉ có đích / phút; người nhận bật «không nhận cử chỉ nhắm tới mình từ người lạ» |
| **Dùng cụm từ để gây khó chịu** (lặp «Hẹn gặp lại» liên tục) | trần 10 cụm từ / phút / người; trùng cụm từ liên tiếp > 3 lần trong 30 giây → không phát lại |
| **Quấy lễ** (vào vùng im lặng rồi cử chỉ) | máy chủ từ chối gói `say`/`emo` trong vùng im lặng (Phần 03 §3.1.5) |
| **Chiếm bồ đoàn** rồi treo máy | bồ đoàn tự nhả nếu không thao tác tĩnh tọa 3 phút (trừ Trà Thất — giữ hành vi hiện tại, chỉ nhả khi đứng dậy hoặc mất kết nối) |
| **Lạm dụng ngự kiếm / bay** để quấy | khi bay, nhân vật không vào được vùng lễ; độ cao `a` (gói `mv`, 0–420) dùng để loại người bay khỏi tính hiện diện đồng tu |

## 5.8 Checklist nghiệm thu Phần 05

- [ ] Rà mã: không có hàm nào chuyển Phúc Khí, Ngọc, đồ Tàng Y Các, Đạo Hạnh, công đức giữa hai tài khoản.
- [ ] Quà nhỏ: trần gửi 10 / nhận 20 / hạn 7 ngày; lì xì: xác suất công khai đúng như hiển thị (test 100.000 lần mở).
- [ ] «Ẩn màu bản mệnh»: người khác nhận `robe: 'trung'`; client mình vẫn hiện màu thật.
- [ ] Công khai căn cốt: mỗi mức chỉ gửi đúng trường liệt kê; không mức nào có ngày/giờ sinh (test tĩnh + test gói).
- [ ] `state.profiles` không xuất hiện trong bất kỳ gói mạng nào.
- [ ] `title` chỉ nhận giá trị trong enum; chuỗi lạ bị thay bằng danh xưng mặc định.
- [ ] Báo cáo: 10 lý do; bằng chứng có cấu trúc đính kèm; trọng số tin cậy; ngưỡng tự động đúng bảng §5.3.4.
- [ ] Nhóm tuổi: U13 không mở MMO; T không thấy đạo lữ; ghép tự động không trộn nhóm.
- [ ] Bong bóng riêng hoạt động cả khi người kia sửa client (máy chủ kiểm khoảng cách).
- [ ] Xuất dữ liệu MMO của tôi trả đủ bảng; xóa tài khoản thay tên trên bia bằng «một người tu».
