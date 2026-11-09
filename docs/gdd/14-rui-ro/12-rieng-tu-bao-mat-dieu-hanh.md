# 14.12 · Quyền riêng tư, bảo mật và điều hành MMO — bảng kê dữ liệu, ngày sinh, nội dung yêu cầu AI, tài khoản, tối thiểu hóa MMO, mô hình đe dọa, kiểm duyệt

> Mã: `RISK-PV-xx` (riêng tư), `RISK-SEC-xx` (bảo mật), `RISK-MOD-xx` (điều hành). Chủ: `PC` (riêng tư), `TBM` (bảo mật), `TCĐ` (điều hành), `TMC` (thực thi).
> Mã nguồn đã kiểm: `src/game/state.js`, `net.js`, `protocol.js`, `main.js`, `stations.js`, `master-ui.js`; `worker/index.js`, `worker/quan-room.js`, `worker/admin.js`; `src/engine/ai.js`.

---

## 1. Bảng kê dữ liệu (nguồn sự thật cho chính sách quyền riêng tư, nhãn App Privacy, Data safety)

| # | Dữ liệu | Tạo ở | Lưu ở | Mục đích | Gửi đi đâu | Người khác thấy? | Thời hạn | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| D1 | Ngày, giờ, phút sinh; giới tính; cờ «không rõ giờ» | Form cổng (`main.js › birthForm`) | `localStorage['huyenquan:v1'].player.birth` | Lập lá số → nhân vật | **Không** (trừ D9) | Không | Tới khi người chơi xóa | Cam kết «chỉ trên máy» |
| D2 | Tên hiển thị | Form cổng | `player.name` (máy); attachment DO (máy chủ, khi online) | Hiện trên đầu nhân vật | MMO (`hello.name`) | Có (cùng phòng) | Máy chủ: chỉ trong phiên socket | Lọc `cleanName` |
| D3 | Hồ sơ người khác (≤ 5) | Sổ Mệnh | `profiles[]` (máy) | Lập lá số người thân, khách | **Không** (trừ D9 nếu hỏi AI về họ) | Không | Tới khi xóa | RISK-106 |
| D4 | Tiến độ, Phúc Khí, `xp`, thành tựu, nhật ký án | Gameplay | `localStorage` | Chơi | Không | Không | Tới khi xóa | |
| D5 | Tàng Y Các: món sở hữu, Ngọc, điểm danh, VIP | Gameplay | `state.wardrobe`, `state.vip` (máy) | Thời trang | `cos` (mã món đang mặc) lên MMO | Có (hình nhân vật) | | RISK-119 (cần sổ cái máy chủ khi có tiền thật) |
| D6 | `robe` (hành Dụng thần), `acc` (hành Hỷ thần), `look` (mẫu nhân vật nam/nữ) | Suy ra từ D1 / lựa chọn | Máy; attachment DO | Màu áo | MMO `hello` | Có | Phiên | RISK-107 |
| D7 | `title` (danh hiệu theo Phúc Khí) | `S.titleFor` | Máy; attachment DO | Hiện danh hiệu | MMO `hello` | Có | Phiên | RISK-122: máy chủ phải chỉ nhận id |
| D8 | `pid` (UUID ngẫu nhiên) | `net.js › pid()` | `localStorage['huyenquan:pid']`; attachment DO; khóa báo cáo | Định danh thiết bị (chặn, báo cáo, hạt giống khách hằng ngày) | MMO `hello` | Không (người khác thấy `u`) | Máy: tới khi xóa; máy chủ: phiên + báo cáo (RISK-109) | |
| D9 | Brief lá số + câu hỏi + lịch sử hội thoại | `buildChartBrief(R)`, khung chat | Bộ nhớ (phiên) | Thầy AI | Proxy Worker → nhà cung cấp AI | Không | Phiên (máy); nhà cung cấp: theo hợp đồng | §2.4 |
| D10 | `u` (băm 6 byte của `pid`) | Máy chủ (`stableId`) | Attachment DO | «Ẩn người này» bền | Phát cho cả phòng | Có (mã) | Phiên | RISK-108 |
| D11 | Vị trí trong thế giới (`x, y, h, s, a`) | Gameplay | Attachment DO | Hiện nhân vật | MMO `mv` | Có | Phiên | |
| D12 | Emote, cụm từ | Gameplay | Không lưu | Giao tiếp | MMO | Có | Không lưu | |
| D13 | Danh sách người đã chặn (`u`) | Người chơi | `localStorage['huyenquan:blocked']` | Ẩn người | Không | Không | Tới khi xóa | |
| D14 | Báo cáo (`report:<người báo>:<id>`: thời điểm, phòng, lý do, `{id, name, pid}` người bị báo, `pid` người báo) | Người chơi | Storage DO | Kiểm duyệt | — | Không | **Hiện không TTL** — đề xuất 90 ngày (RISK-109) | |
| D15 | IP | Kết nối | KV giới hạn tốc độ (`grl:`, `airl:` — TTL 120 s); `free:log` (200 mục) | Chống lạm dụng | — | Không | 120 s / cuốn chiếu | Đề xuất băm IP trong `free:log` |
| D16 | Chế độ chất lượng đồ họa, cài đặt | Người chơi | `localStorage['huyenquan:quality']`, `settings` | Hiệu năng | Không | Không | | |
| D17 | Tham số máy chủ `?server=` | URL | `localStorage['huyenquan:server']` | (dev) | — | — | | **Gỡ khỏi bản phát hành** (RISK-129) |
| D18 | Bộ đếm an toàn, Neo (đề xuất) | Máy | Endpoint số liệu | Cải thiện an toàn | Máy chủ dự án | Không | 90 ngày, tổng theo ngày | Không định danh |
| D19 | Báo cáo câu trả lời AI (đề xuất) | Người chơi | Hàng đợi D1 | Cải thiện AI | Máy chủ dự án | Không | 90 ngày sau xử lý | Cần đồng ý trong hộp báo cáo |
| D20 | Tài khoản, năm sinh tuân thủ, xác thực (tương lai) | Đăng ký | D1 (máy chủ) | Tuân thủ G1, đồng bộ, thanh toán | — | Không | Tới khi xóa tài khoản + thời hạn luật định | §5 |
| D21 | Giao dịch (tương lai) | Cửa hàng | Sổ cái máy chủ | Thanh toán, hoàn tiền | Cửa hàng / cổng thanh toán | Không | Theo quy định kế toán *(cần xác minh)* | §7.3 |

**Dữ liệu app chính (không thuộc game nhưng chung hạ tầng):** `events:log` (IP, thành phố, UA, dữ liệu sự kiện), `vprof:*` (tên, ngày giờ sinh, IP, điểm, Dụng thần — TTL 90 ngày), `ai_chat` (câu hỏi ≤ 2.000, trả lời ≤ 16.000 ký tự). Game **không** ghi vào các khóa này (RISK-111). Đề xuất gửi chủ app: bỏ tên và giờ sinh khỏi `vprof`, băm IP, rút TTL — vì một sự cố ở đó sẽ bị gán cho game (RISK-175).

---

## 2. Ngày sinh và nội dung yêu cầu AI

### 2.1 Luồng ngày sinh

```
Form cổng (máy)
   │  y, m, d, h, mi, gender
   ▼
localStorage 'huyenquan:v1'.player.birth ──────────────▶ (KHÔNG có đường gửi trực tiếp lên máy chủ)
   │
   ├─▶ chartOf(...) → R (trên máy) ──▶ Mệnh Bàn, nhiệm vụ, màu áo
   │                                  └─▶ robe / acc (chỉ hành) ──▶ MMO hello
   │
   └─▶ (chỉ khi người chơi hỏi Thầy AI và đã đồng ý)
          buildChartBrief(R) ──▶ /zai (Worker) ──▶ nhà cung cấp AI
```

### 2.2 Cam kết hiển thị cho người chơi (chính xác, không nói quá)

> **Ngày giờ sinh của bạn được lưu trên máy này.** Game không gửi ngày giờ sinh lên máy chủ của chúng tôi. Khi bạn chơi cùng người khác, họ chỉ thấy tên, hình nhân vật và màu áo (màu áo theo hành hợp mệnh của bạn). Nếu bạn hỏi Thầy AI, bảng tóm tắt lá số (đủ để suy ra ngày sinh) và câu hỏi của bạn sẽ được gửi tới nhà cung cấp AI — game sẽ hỏi bạn trước.

| Mã | Quy tắc |
|---|---|
| RISK-PV-01 | Câu «ngày sinh chỉ lưu trên máy» không được viết tuyệt đối mà thiếu vế AI (tránh hứa sai). |
| RISK-PV-02 | Test mạng tự động (Playwright) chạy một phiên chơi đầy đủ không dùng AI: không request nào chứa chuỗi ngày sinh (`YYYY-MM-DD`, `DD/MM/YYYY`), năm sinh đứng cạnh giờ, hay can chi bốn trụ. |
| RISK-PV-03 | Thêm tính năng mới cần dữ liệu lá số ở máy chủ (hợp hôn MMO, Thiên Bảng Tiên Thiên) phải qua PC và chỉ gửi **giá trị suy ra tối thiểu** (RISK-117). |

### 2.3 Thẻ đồng ý trước lần hỏi Thầy AI đầu tiên

> **Trước khi hỏi Thầy**
>
> Thầy trả lời bằng AI. Để trả lời đúng lá số của bạn, game gửi tới nhà cung cấp AI:
> - câu hỏi bạn gõ;
> - bảng tóm tắt lá số (bốn trụ, ngũ hành, đại vận theo tuổi, năm nay) — **đủ để suy ra ngày sinh của bạn**;
> - các câu đã hỏi trong lần trò chuyện này.
>
> Game **không** gửi tên của bạn. Nhà cung cấp AI hiện tại: [tên, nơi xử lý]. Đừng gõ thông tin bạn không muốn chia sẻ (tên thật, địa chỉ, bệnh án).
>
> Lời Thầy do máy sinh ra, để tham khảo và chiêm nghiệm, có thể sai.
>
> [Đồng ý, hỏi Thầy] [Hỏi bằng lá số mẫu] [Không, cảm ơn]

| Mã | Quy tắc |
|---|---|
| RISK-PV-10 | Lựa chọn lưu trên máy (`settings.aiConsent = { at, version }`); đổi nhà cung cấp hoặc đổi nội dung gửi → tăng `version`, hỏi lại. |
| RISK-PV-11 | «Hỏi bằng lá số mẫu» dùng `MAU-A` (canon §11) — người chơi vẫn trải nghiệm Thầy AI mà không gửi lá số của mình. |
| RISK-PV-12 | Rút đồng ý: Sổ Mệnh → Dữ liệu của tôi → «Tắt Thầy AI». |
| RISK-PV-13 | Hỏi về hồ sơ người khác lần đầu: thẻ phụ «Bạn sắp gửi lá số của [nhãn hồ sơ]. Người đó có biết không?» (RISK-106). |

### 2.4 Nội dung chính xác của yêu cầu AI (theo mã hiện tại)

| Thành phần | Có trong yêu cầu | Nguồn |
|---|---|---|
| SYSTEM_PROMPT (persona thầy, nguyên tắc) | Có | `ai.js` |
| Khối «DATA SOURCES» (chống bịa) | Có | `buildChartBrief` |
| Sát phương năm nay (Tam Sát, Ngũ Hoàng…) | Có | `sanshaDirection`, `annualTabooOverview` |
| Ngày hôm nay (dương, âm), năm nay, tháng nay | Có | `_now` |
| Đối tượng quan tâm (giới tính, `partner`) | Có | `R.chart.input.gender/partner` |
| Trị niên Thái Tuế, bản mệnh Thái Tuế (năm sinh) | Có | `taiSuiOverview` |
| Tổng khái hôm nay | Có | `dailyBriefing` |
| Tóm tắt mệnh: nhật chủ, vượng/nhược, Dụng, điểm, bậc, bách phân vị, tuổi hiện tại (suy từ `R.chart.input.year`), đại vận hiện hành, năm vàng | Có | `buildChartBrief` |
| Bốn trụ (can chi, thập thần, tàng can, nạp âm) | Có | `c.pillars` |
| Ngũ hành % | Có | `R.wx.pct` |
| Thần sát | Có | `R.shensha` |
| Đại vận (8 vận, tuổi bắt đầu, xếp hạng) | Có | `R.dayun` |
| Lưu niên (các năm, xếp hạng) | Có | `R.liunian` |
| Khối mở rộng (`extendBrief`), khối âm tà (chỉ khi opt-in) | Có / có điều kiện | `brief-extender.js` |
| `_ANTI_MANIP_GUIDE` | Có | `anti-manipulation-data` |
| Lịch sử hội thoại trong phiên | Có | `history` |
| Tên người chơi, `pid`, IP | **Không** trong thân yêu cầu; IP lộ tới Worker (giới hạn tốc độ), Worker không chuyển IP cho nhà cung cấp | `worker/index.js` |
| Ngày sinh dạng `YYYY-MM-DD` | Không trực tiếp; **suy ra được** từ bốn trụ + tuổi | — |

### 2.5 Tối thiểu hóa brief cho persona game

| Mã | Đề xuất | Lợi |
|---|---|---|
| RISK-PV-20 | Persona chỉ nhận phần brief thuộc `scope` (vd Vân Cốc: Dụng, cách cục, `gaimenhPlan`; không cần lưu niên chi tiết) | Ít dữ liệu ra ngoài, ít token, ít bịa |
| RISK-PV-21 | Thay «tuổi hiện tại» bằng «đại vận hiện hành» khi persona không cần tuổi | Bớt một mảnh định danh |
| RISK-PV-22 | Không gửi `partner`, giới tính khi persona không dùng | |
| RISK-PV-23 | Không gửi khối âm tà khi Lớp 1 tắt (đã theo chỉ dẫn hiện có) | |

---

## 3. Tối thiểu hóa dữ liệu MMO

### 3.1 Từng gói giao thức

| Gói | Trường | Cần? | Đề xuất |
|---|---|---|---|
| `hello` | `name` | Cần | Giữ, lọc mở rộng (§6.2) |
| `hello` | `robe`, `acc` | Cần cho hình | Giữ; công bố (RISK-107) |
| `hello` | `cos` | Cần | Giữ (`cleanCos` đã kiểm danh mục) |
| `hello` | `look` | Cần | Giữ |
| `hello` | `title` | Cần | **Đổi sang id danh mục** (RISK-122) |
| `hello` | `phai` | Cần cho xếp hạng phái | Giữ (4 phái học thuật) |
| `hello` | `pid` | Cần (chặn, báo cáo, chống lạm dụng) | Giữ; về sau thay bằng mã phiên ký (`pid` không rời máy, máy chủ cấp mã ngắn hạn) |
| `mv` | `x, y, h, s, a` | Cần | Giữ |
| `emo` | `to` | Cần | Giữ |
| `report` | `id, why` | Cần | Thêm lý do (§6.3) |
| Phát lại (`pub`) | `u` | Cần cho chặn | Chỉ gửi trong `join`, `emo`, `say` (đã vậy với `emo`, `say`); xem xét bỏ khỏi `welcome.players` nếu chặn xử lý phía máy chủ (§6.4) |

### 3.2 Máy chủ lưu gì

| Nơi | Dữ liệu | Thời hạn hiện tại | Đề xuất |
|---|---|---|---|
| Attachment socket | D2, D5–D8, D10, D11 | Phiên | Giữ |
| Storage DO `report:*` | D14 | Không hạn | Chuyển hàng đợi trung tâm, TTL 90 ngày (RISK-109) |
| Storage DO `report:count` | Số đếm | Không hạn | Cửa sổ trượt (RISK-123) |
| D1 (tương lai): hồ sơ, tiến độ, Thiên Bảng, môn phái | — | — | Tài liệu 13 thiết kế schema; PC duyệt từng cột; không có cột ngày sinh, điểm Tiên Thiên (RISK-033) |

| Mã | Quy tắc |
|---|---|
| RISK-PV-30 | Gói mới thêm vào `protocol.js` phải cập nhật bảng §3.1 và bảng §1 trong cùng thay đổi; test `test-quan-protocol.mjs` liệt kê trường cho phép, trường lạ bị loại. |
| RISK-PV-31 | Không thêm trường văn bản tự do vào giao thức khi chưa có quy trình kiểm duyệt cho trường đó. |
| RISK-PV-32 | Dữ liệu MMO không dùng cho phân tích hành vi cá nhân, quảng cáo. |

---

## 4. Quyền của người chơi — màn «Dữ liệu của tôi»

Vị trí: Sổ Mệnh → Cài đặt → «Dữ liệu của tôi».

| Chức năng | Mô tả | Đáp ứng |
|---|---|---|
| Xem | Danh sách dữ liệu trên máy (ngày sinh, hồ sơ, tiến độ, `pid`), dữ liệu có thể ở máy chủ (báo cáo liên quan, Thiên Bảng nếu có) | Quyền được biết, truy cập |
| Xuất | Tệp JSON chứa toàn bộ `huyenquan:*` trên máy | Quyền truy cập, di chuyển; sao lưu (RISK-132) |
| Nhập | Từ tệp xuất | Khôi phục |
| Sửa | Ngày sinh («Sửa bát tự» — đã có `hq-rebirth`), tên | Quyền chỉnh sửa |
| Rút đồng ý AI | Tắt Thầy AI | Rút đồng ý |
| Rút đồng ý MMO | Chơi đơn vĩnh viễn (không kết nối) | Rút đồng ý |
| Xóa trên máy | «Rời quán, xóa dữ liệu trên máy này» — xóa mọi khóa `huyenquan:*` (RISK-114) | Quyền xóa |
| Yêu cầu xóa trên máy chủ | Gửi yêu cầu ký bằng `pid` (HMAC với khóa thiết bị) → máy chủ xóa báo cáo do mình gửi, bản ghi Thiên Bảng, tài khoản (nếu có) trong 30 ngày | Quyền xóa |
| Liên hệ | Email bảo vệ dữ liệu (dạng văn bản sao chép được trên iOS) | Khiếu nại |

| Mã | Quy tắc |
|---|---|
| RISK-PV-40 | Báo cáo **về** người chơi (người khác báo) không bị xóa theo yêu cầu của người bị báo khi đang xử lý; xóa theo thời hạn chung. |
| RISK-PV-41 | Xóa trên máy phải xóa cả `huyenquan:server`, `huyenquan:blocked`, `huyenquan:quality`, `huyenquan:pid`, khóa `:corrupt`. |
| RISK-PV-42 | Trả lời yêu cầu qua email trong thời hạn luật định *(cần luật sư xác minh)*; mặc định nội bộ ≤ 30 ngày. |

---

## 5. Tài khoản

### 5.1 Ba giai đoạn

| Giai đoạn | Mốc | Định danh | Lưu máy chủ | Lý do |
|---|---|---|---|---|
| P0 · Ẩn danh thiết bị | Hiện tại – M2 | `pid` | Phiên + báo cáo | Đủ cho chơi đơn + MMO thử nghiệm |
| P1 · Tài khoản tùy chọn | M3 | Tài khoản (email / Apple / Google) | Hồ sơ tối thiểu, tiến độ đồng bộ (không ngày sinh) | Đồng bộ nhiều máy, Thiên Bảng |
| P2 · Tài khoản bắt buộc cho MMO, thanh toán | Khi bật G1 ở Việt Nam / bán Ngọc thật | Tài khoản + xác thực theo quy định (§3.6 tập 14.11) | + năm sinh tuân thủ, trạng thái xác thực, sổ cái | Pháp lý, chống gian lận |

### 5.2 Dữ liệu tài khoản (P1–P2)

| Trường | Bắt buộc | Ghi chú |
|---|---|---|
| Mã tài khoản (UUID) | Có | |
| Phương thức đăng nhập + mã định danh bên thứ ba | Có | Không lưu mật khẩu nếu dùng đăng nhập bên thứ ba |
| Email | Tùy phương thức | Apple «ẩn email» được chấp nhận |
| Năm sinh tuân thủ (chỉ năm, hoặc ngày nếu luật yêu cầu) | P2 | **Tách khỏi** ngày sinh lập lá số; không dùng cho nội dung |
| Trạng thái xác thực | P2 | Lưu «đã xác thực / chưa», thời điểm; không lưu bản sao giấy tờ trừ khi bắt buộc |
| Tên hiển thị | Có | |
| Tiến độ, Đạo Hạnh, cảnh giới | Có | Sự kiện máy chủ xác nhận (RISK-120) |
| Môn phái (`sect_id`) | Tùy | RISK-112 |
| Số dư Ngọc, VIP | P2 | Sổ cái (§7.3) |

### 5.3 Đăng nhập

| Mã | Quy tắc |
|---|---|
| RISK-SEC-01 | Ưu tiên đăng nhập không mật khẩu (Apple, Google, liên kết email một lần); nếu có mật khẩu: băm bằng thuật toán chuyên dụng (argon2id / bcrypt), không tự chế. |
| RISK-SEC-02 | Có Sign in with Apple trên iOS khi có đăng nhập bên thứ ba (RISK-095). |
| RISK-SEC-03 | Phiên: mã ngắn hạn + mã làm mới; thu hồi được; không đặt mã trong URL. |
| RISK-SEC-04 | Giới hạn thử đăng nhập; cảnh báo đăng nhập lạ (P2). |

### 5.4 Xóa tài khoản

- Trong app: Sổ Mệnh → Dữ liệu của tôi → «Xóa tài khoản» (RISK-095), xác nhận hai bước.
- Web: trang yêu cầu xóa (Google Play yêu cầu).
- Máy chủ xóa trong ≤ 30 ngày; giữ lại sổ cái giao dịch theo thời hạn kế toán *(cần luật sư xác minh)* ở dạng tách khỏi danh tính khi có thể.
- Mua qua cửa hàng: hướng dẫn hủy thuê bao VIP ở cửa hàng.

### 5.5 Khôi phục

Không có câu hỏi bảo mật dựa trên ngày sinh (vì ngày sinh là dữ liệu game công khai một phần qua màu áo và có thể đoán). Khôi phục qua phương thức đăng nhập.

### 5.6 Trẻ em và phụ huynh

| Mã | Quy tắc |
|---|---|
| RISK-PV-50 | < 13 tuổi (năm sinh trên máy, hoặc năm sinh tuân thủ): chơi đơn; không MMO, không AI, không tài khoản. |
| RISK-PV-51 | 13–15: MMO cụm từ được phép khi có đồng ý của phụ huynh theo luồng (§5.6.1) *(cần luật sư xác minh mức tuổi và cách lấy đồng ý)*; AI chỉ câu gợi ý soạn sẵn; không âm tà, Tà Lộ, hợp hôn, sư đồ với người lạ. |
| RISK-PV-52 | 16–17: MMO; AI với `minor: true`; không nạp tiền; không hợp hôn; giới hạn giờ chơi theo quy định. |
| RISK-PV-53 | Không quảng cáo cá nhân hóa, không thông báo đẩy khuyến mãi cho người < 18. |
| RISK-PV-54 | Phụ huynh có thể yêu cầu xóa dữ liệu của con qua email hỗ trợ. |

**5.6.1 Luồng đồng ý phụ huynh (P1–P2)** — đề xuất, chờ luật sư:
1. Trẻ nhập email phụ huynh.
2. Hệ thống gửi email giải thích game, dữ liệu, quyền.
3. Phụ huynh bấm đồng ý (liên kết một lần) và có thể chọn giới hạn thêm (tắt MMO).
4. Tới khi phụ huynh đồng ý, tài khoản ở chế độ chơi đơn.

---

## 6. Điều hành MMO

### 6.1 Nguyên tắc

| Mã | Quy tắc |
|---|---|
| RISK-MOD-01 | Giai đoạn đầu **chỉ cụm từ soạn sẵn** (`PHRASES`, 8 cụm) và emote (`EMOTES`, 6 cái) — không chat tự do (Guideline 1.2; giảm nghĩa vụ kiểm duyệt). |
| RISK-MOD-02 | Nội dung người dùng tạo duy nhất được phát cho người khác: **tên** (và tương lai: tên trên Bảng Vàng). Mọi trường khác là id danh mục. |
| RISK-MOD-03 | Thêm cụm từ mới qua quy trình §6.8; không thêm trường văn bản tự do. |
| RISK-MOD-04 | Mặc định an toàn: lỗi bộ lọc → từ chối tên (đổi về «Khách»), không cho qua. |

### 6.2 Bộ lọc tên mở rộng

**Chuẩn hóa** (thêm vào `cleanName`):
1. NFC; bỏ ký tự điều khiển, zero-width (đã có).
2. Bản so khớp: chữ thường, **bỏ dấu**, thay `đ` → `d`, bỏ ký tự không phải chữ – số (`đ.m` → `dm`), gộp ký tự lặp, thay chữ – số giống nhau (`0` → `o`, `1` → `i`/`l`, `3` → `e`, `4` → `a`, `@` → `a`).
3. So **chuỗi con** trên bản so khớp với các danh sách dưới.

**Danh sách** (tệp `safety/name-filter.json`, TCĐ duy trì; tài liệu này chỉ nêu nhóm):

| Nhóm | Nội dung | Hành động |
|---|---|---|
| F1 · Thô tục | Tiếng Việt có dấu / không dấu, teencode, tiếng Anh | Từ chối |
| F2 · Xúc phạm tôn giáo | Từ chế giễu Phật, thần, tu sĩ, tín đồ | Từ chối |
| F3 · Xúc phạm dân tộc, vùng miền | Từ miệt thị tộc người, vùng miền | Từ chối |
| F4 · Danh xưng tôn giáo dự trữ | Phật, Bồ Tát, Thích + pháp danh, Hòa thượng, Thượng tọa, Đại đức, Ni sư, Ni trưởng, Lạt-ma, Rinpoche, Thiên Sư, Chân nhân, Đạo trưởng, Thánh Mẫu, Ngọc Hoàng | Từ chối (RISK-146) |
| F5 · Tên NPC chính của game | `00-KINH-DIEN-CHUNG.md` §4 | Từ chối |
| F6 · Lãnh đạo, chính trị | Tên lãnh đạo nhà nước, tổ chức bị cấm, «Pháp Luân» | Từ chối |
| F7 · Liên hệ, quảng cáo | Chuỗi ≥ 6 chữ số, số viết bằng chữ, tên miền, «zalo», «fb», «tele», «inbox», «ib», «sdt» | Từ chối (RISK-147) |
| F8 · Dịch vụ tâm linh | «giải hạn», «xem bói», «thầy cúng», «bùa», «ngải» | Từ chối |
| F9 · Mạo danh nhân viên | «Admin», «GM», «Quản trị», «Hỗ trợ» | Từ chối |

| Mã | Quy tắc |
|---|---|
| RISK-MOD-10 | Bộ lọc chạy ở **máy chủ** (`parseClient`), không chỉ máy khách. |
| RISK-MOD-11 | Danh sách cập nhật được không cần build mới (tải từ cấu hình máy chủ cho Worker). |
| RISK-MOD-12 | Ca kiểm thử: ≥ 200 tên xấu, ≥ 200 tên hợp lệ (tên người Việt thật, có dấu, gồm cả tên chứa chuỗi con dễ nhầm). Ví dụ: quy tắc F4 với «Thích» chỉ chặn khi «Thích» đứng đầu tên và theo sau là hai âm tiết kiểu pháp danh («Thích Minh Tuệ»), không chặn «Thích Ăn Chè» hay «Mai Thích». TCĐ chốt quy tắc và ca kiểm. |
| RISK-MOD-13 | Tỉ lệ chặn nhầm trên tên hợp lệ < 1%. |

### 6.3 Báo cáo

**Lý do** (`REPORT_REASONS` hiện có `name`, `spam`, `other`; đề xuất thêm):

| Mã lý do | Hiển thị | Ưu tiên |
|---|---|---|
| `name` | Tên không phù hợp | Thường |
| `spam` | Làm phiền / spam | Thường |
| `groom` | Dụ dỗ, rủ ra ngoài game | **Khẩn** (RISK-145) |
| `scam` | Quảng cáo dịch vụ tâm linh, lừa đảo | Cao (RISK-147) |
| `impersonate` | Mạo danh tu sĩ, người nổi tiếng, nhân viên | Cao |
| `other` | Lý do khác | Thường |

**Hàng đợi và cam kết:**

| Ưu tiên | Thời gian xử lý mục tiêu | Ai |
|---|---|---|
| Khẩn | ≤ 4 giờ (giờ làm việc) / ≤ 24 giờ (ngoài giờ) | TCĐ + TAT |
| Cao | ≤ 24 giờ | TCĐ |
| Thường | ≤ 72 giờ | TCĐ |

**Công cụ admin** (thêm vào `worker/admin.js`): danh sách báo cáo theo ưu tiên; xem tên, `u`, lịch sử báo cáo của đối tượng (số lần, lý do); thao tác: đổi tên về «Khách», cấm kết nối MMO có thời hạn theo `pid` / tài khoản, đóng báo cáo kèm ghi chú; nhật ký thao tác admin (ai, lúc nào, làm gì).

| Mã | Quy tắc |
|---|---|
| RISK-MOD-20 | Báo cáo chuyển từ storage DO sang hàng đợi trung tâm có TTL (RISK-109). |
| RISK-MOD-21 | Hạn mức báo cáo theo người báo (≤ 10/ngày), theo IP; gộp trùng; không trần tuyệt đối (RISK-123). |
| RISK-MOD-22 | Người báo nhận phản hồi «Đã nhận» (đã có `reported`) và, khi xử lý xong, «Đã xử lý» (không tiết lộ hình thức xử phạt). |
| RISK-MOD-23 | Báo cáo `groom` tự động: ẩn người bị báo với người báo ngay lập tức; nếu ≥ 2 người khác nhau báo `groom` cùng đối tượng trong 24 giờ → tạm ngắt MMO đối tượng chờ xét. |

### 6.4 Chặn («ẩn người này»)

- Hiện: danh sách `u` trong `localStorage['huyenquan:blocked']`, lọc phía máy khách (`net.js › upsert`, `emo`, `say`).
- Đề xuất P1: đồng bộ danh sách chặn theo tài khoản lên máy chủ; máy chủ **không gửi** sự kiện `emo`, `say`, lời mời `inv` của người bị chặn tới người chặn. Khi đó có thể xoay `u` định kỳ (RISK-108).
- Chặn là một chiều, không thông báo cho người bị chặn.

### 6.5 Thang xử phạt

| Bậc | Hành vi | Biện pháp |
|---|---|---|
| 1 | Tên không phù hợp lần đầu | Đổi tên về «Khách», thông báo lý do |
| 2 | Tái phạm tên; spam emote | Cấm MMO 24 giờ |
| 3 | Quảng cáo dịch vụ, mạo danh | Cấm MMO 7 ngày |
| 4 | Dụ dỗ, quấy rối, tái phạm bậc 3 | Cấm MMO vĩnh viễn theo `pid` / tài khoản; lưu bằng chứng theo yêu cầu pháp luật |
| — | Hành vi có dấu hiệu tội phạm với trẻ em | Bậc 4 + PC xem xét nghĩa vụ báo cơ quan chức năng *(cần luật sư xác minh)* |

Lệnh cấm không xóa tiến độ chơi đơn của người chơi.

### 6.6 Huấn luyện điều hành viên

Nội dung tối thiểu (RISK-151):
1. Nội quy cộng đồng, thang xử phạt.
2. Thuật ngữ tôn giáo cơ bản (Phật, Đạo, Nho, Mẫu) để nhận diện tên xúc phạm, mạo danh.
3. Nhận diện dụ dỗ trẻ em, lừa đảo tâm linh.
4. Quy trình khi gặp tín hiệu khủng hoảng trong báo cáo (chuyển TAT).
5. Quyền riêng tư: chỉ xem dữ liệu cần; không chụp, không chia sẻ.
6. Ca khó → hỏi TCĐ hoặc HĐCV.

### 6.7 Minh bạch và kháng nghị

- Người bị xử lý thấy thông báo: hành vi, biện pháp, thời hạn, cách kháng nghị.
- Kháng nghị một lần trong 14 ngày qua email; người xét khác người xử lý ban đầu.
- Báo cáo minh bạch hằng năm (số báo cáo, số xử lý theo bậc) khi MMO có quy mô.

### 6.8 Thêm cụm từ chat

1. Đề xuất cụm từ (TND / cộng đồng).
2. Kiểm: không thể ghép thành câu xúc phạm khi dùng liên tiếp; không chứa thông tin liên lạc; không trùng lời NPC thiêng.
3. Duyệt: TCĐ + TND.
4. Thêm vào `PHRASES` (máy chủ và máy khách cùng phiên bản `VERSION` trong `protocol.js`).

---

## 7. Mô hình đe dọa và bảo mật

### 7.1 Tài sản và tác nhân

| Tài sản | Giá trị |
|---|---|
| Ngày sinh, lá số người chơi và người thân (trên máy) | Riêng tư cao |
| Nội dung hội thoại AI | Riêng tư cao (có thể chứa sức khỏe, tâm lý) |
| Khóa API nhà cung cấp AI | Tài chính |
| Token admin, công tắc AI, nhật ký app (`vprof`) | Riêng tư, vận hành |
| Phòng MMO, danh tính hiển thị | Trải nghiệm, an toàn cộng đồng |
| Thiên Bảng, Đạo Hạnh (tương lai) | Tính công bằng, niềm tin T2 |
| Ngọc, VIP, giao dịch (tương lai) | Tài chính |
| Chuỗi build, bản iOS | Uy tín, tuân thủ |

| Tác nhân | Động cơ |
|---|---|
| Người chơi gian lận | Ngọc, VIP, Thiên Bảng |
| Kẻ quấy rối, troll | Tên xúc phạm, spam, chiếm phòng |
| Kẻ lừa đảo tâm linh | Tìm khách qua game (RISK-147) |
| Kẻ săn trẻ em | Tiếp cận trẻ qua MMO (RISK-145) |
| Kẻ rút quota AI | Dùng AI miễn phí cho việc khác (RISK-128) |
| Kẻ tấn công có chủ đích | Lấy dữ liệu app (`vprof`), khóa API |
| Gói phụ thuộc độc hại | Đọc `localStorage` |

### 7.2 STRIDE theo thành phần

| Thành phần | Giả mạo (S) | Sửa đổi (T) | Chối bỏ (R) | Lộ thông tin (I) | Từ chối dịch vụ (D) | Leo quyền (E) |
|---|---|---|---|---|---|---|
| Máy khách game | `pid` tự chọn → né chặn (chấp nhận ở P0) | `localStorage` sửa được → Ngọc, VIP giả (RISK-119) | — | Máy dùng chung (RISK-114); gói phụ thuộc độc (RISK-127) | — | — |
| `?server=` | **Máy chủ giả** (RISK-129) | Nội dung giả trong UI | — | Lộ `pid` cho máy chủ giả | — | — |
| WebSocket `/ws/quan` | Client không `Origin` (script) | Gói lạ — đã có `parseClient` | Không nhật ký hành vi | `u` theo dõi (RISK-108) | Chiếm phòng (RISK-121); `rateGate` mất khi DO ngủ | `title` tự do (RISK-122) |
| DO `TownShard` | — | — | Báo cáo không nhật ký xử lý | Báo cáo lưu `pid` (RISK-109) | Trần 500 báo cáo (RISK-123); storage tăng (RISK-131) | — |
| Proxy AI `/zai` | Không xác thực người gọi | — | — | Brief gửi nhà cung cấp (RISK-059) | Rút quota (RISK-128) | — |
| Admin | Token trong URL (RISK-124) | Đổi công tắc, chặn IP | Nhật ký `audit:log` (có, TTL 90 ngày) | `vprof`, `events:log` (RISK-111) | — | Lộ token = toàn quyền |
| `ADMIN_KV` | — | Sửa `ai:config` | — | Khóa API trong KV (RISK-125) | — | — |
| D1 (tương lai) | — | Đạo Hạnh giả nếu tin máy khách (RISK-120) | Cần nhật ký sự kiện | Dữ liệu tài khoản | — | — |
| Thanh toán (tương lai) | Biên nhận giả | Số dư giả | Tranh chấp (RISK-141) | — | — | — |
| Build iOS | — | Cờ lọt (RISK-162) | — | — | — | Tính năng ẩn (RISK-092) |

### 7.3 Sổ cái máy chủ (khi có tiền thật hoặc Thiên Bảng)

| Thành phần | Thiết kế |
|---|---|
| Bảng `ledger` | `id, account_id, kind (ngoc_credit / ngoc_debit / vip_grant / daohanh_event), amount, ref (mã giao dịch cửa hàng / mã nhiệm vụ), created_at, server_sig` |
| Nguồn hợp lệ | Ngọc: biên nhận cửa hàng đã xác minh phía máy chủ (Apple / Google / cổng thanh toán), điểm danh do máy chủ chấm theo ngày máy chủ; Đạo Hạnh: sự kiện nhiệm vụ do máy chủ chấm |
| Số dư | Tính từ sổ cái; máy khách chỉ hiển thị bản sao |
| Mua món | Máy khách gửi yêu cầu → máy chủ kiểm số dư, ghi `ngoc_debit`, trả danh sách món sở hữu |
| Bất biến | Không có sự kiện chuyển Ngọc giữa tài khoản (RISK-LG-37); không có `daohanh_event` từ mua hàng (E1–E6) |
| Kiểm toán | Đối soát doanh thu cửa hàng ↔ tổng `ngoc_credit` hằng tháng |

### 7.4 Bảo mật web

| Mã | Biện pháp | Hiện trạng |
|---|---|---|
| RISK-SEC-10 | HSTS, `nosniff`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN` | Đã có (`withSecurityHeaders`) |
| RISK-SEC-11 | CSP cho **trang game**: `default-src 'self'; connect-src 'self' wss://<miền>; img-src 'self' data: blob:; script-src 'self'; style-src 'self' 'unsafe-inline'` (điều chỉnh theo thực tế) | Chưa có (app chính có script nội tuyến nên chưa áp; game cần kiểm có script nội tuyến không) |
| RISK-SEC-12 | Mọi chuỗi từ mạng / AI qua `esc()` trước khi vào DOM | Có ở `master-ui.js`; cần test hồi quy (RISK-126) |
| RISK-SEC-13 | Bỏ `?server=` khỏi bản phát hành | RISK-129 |
| RISK-SEC-14 | Giới hạn kết nối WebSocket theo IP và `pid`; hạn `hello` 5 giây | RISK-121 |
| RISK-SEC-15 | Mã phiên ký cho lời gọi AI | RISK-128 |
| RISK-SEC-16 | `npm audit`, khóa phiên bản trong CI | RISK-127 |

### 7.5 Cứng hóa admin

| Mã | Biện pháp |
|---|---|
| RISK-SEC-20 | Token chỉ qua header hoặc cookie `HttpOnly; Secure; SameSite=Strict`; không trong URL (RISK-124) |
| RISK-SEC-21 | CORS admin chỉ cho miền admin, không `*` |
| RISK-SEC-22 | Khóa nhà cung cấp AI chuyển sang Worker Secret (RISK-125) |
| RISK-SEC-23 | Đường dẫn admin bí mật (đã có `ADMIN_PATH`) — giữ, nhưng không coi là lớp bảo mật chính |
| RISK-SEC-24 | Xác thực hai lớp cho tài khoản Cloudflare, kho mã, tài khoản nhà phát triển Apple / Google |
| RISK-SEC-25 | Nhật ký thao tác admin (đã có `audit:log`) mở rộng cho thao tác điều hành (§6.3) |
| RISK-SEC-26 | Xoay token admin mỗi quý và sau mỗi lần nghi lộ |

### 7.6 Checklist bảo mật trước mỗi mốc

- [ ] Không còn `?server=` trong bản phát hành.
- [ ] `title` chỉ nhận id; bộ lọc tên máy chủ mở rộng hoạt động.
- [ ] Báo cáo có TTL, hạn mức, hàng đợi admin.
- [ ] Token admin không trong URL; CORS admin hẹp.
- [ ] Khóa AI là Secret.
- [ ] Giới hạn kết nối WebSocket hoạt động.
- [ ] Test XSS qua mọi trường giao thức đạt.
- [ ] `npm audit` không có lỗ hổng mức cao chưa xử lý.
- [ ] (Khi có tiền thật) sổ cái máy chủ, đối soát.
- [ ] Test mạng: không rò ngày sinh (RISK-PV-02).

---

## 8. Sự cố dữ liệu

### 8.1 Định nghĩa

Sự cố dữ liệu là việc dữ liệu cá nhân bị truy cập, lộ, sửa, mất trái phép — gồm cả dữ liệu của app chính trên hạ tầng chung (`vprof`, `events:log`) vì người dùng sẽ không phân biệt.

### 8.2 Quy trình 72 giờ

| Thời điểm | Việc | Ai |
|---|---|---|
| T+0 | Người phát hiện báo PC và TBM (kênh khẩn) | Bất kỳ ai |
| T+0 – 4 giờ | Ngăn chặn: xoay token, thu hồi khóa, chặn đường lộ, chụp bằng chứng | TBM, TMC |
| T+4 – 24 giờ | Đánh giá: dữ liệu gì, bao nhiêu người, có trẻ em không, có dữ liệu nhạy cảm không, rủi ro cho người dùng | PC, TBM |
| T+24 – 72 giờ | Thông báo cơ quan chuyên trách theo quy định *(cần luật sư xác minh cơ quan, mẫu, thời hạn theo luật 2025)*; nếu có người dùng EU: cơ quan giám sát liên quan | PC |
| Khi rủi ro cao cho người dùng | Thông báo người dùng (mẫu tập 14.04 §6.4) | PC + TT |
| T+7 ngày | Biên bản hậu kiểm; cập nhật sổ rủi ro | TBM |

### 8.3 Nội dung thông báo cơ quan (khung — chờ luật sư)

1. Mô tả vi phạm; thời gian, địa điểm, hành vi, tổ chức, cá nhân, loại dữ liệu, số lượng.
2. Thông tin liên hệ người phụ trách.
3. Hậu quả có thể xảy ra.
4. Biện pháp đã và sẽ thực hiện.

### 8.4 Diễn tập

Mỗi năm một lần: giả lập lộ token admin; đo thời gian ngăn chặn, thời gian soạn thông báo; rút kinh nghiệm.
