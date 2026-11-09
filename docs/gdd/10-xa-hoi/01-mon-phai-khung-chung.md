# 10 · Phần 01 — Môn phái: khung chung (Tông môn và Chi đường)

> Phạm vi: luật chung cho mọi môn phái. Chi tiết riêng từng đạo thống (đạo tràng, lễ, việc tuần, danh xưng) ở **Phần 02**. Giao thức máy chủ ở **Phần 11**, hạ tầng `SectHall` ở **Phần 12**.
>
> Căn cứ: canon `docs/gdd/00-KINH-DIEN-CHUNG.md` §2–§9; bản sơ đồ `docs/GAME-AAA-THIET-KE.md` §5.6 (9 đạo thống), §8 (công trình đi vào được), §10, §11 (không bán cải mệnh); `docs/GAME-MMO-PROMPT-PLAN.md` §B2 («Môn phái ≤ 30 người … sảnh riêng, mục tiêu tuần chung»).

---

## 1.1 Hai tầng tổ chức: vì sao không chỉ có «một môn phái mỗi đạo»

Bản sơ đồ nói «môn phái = đạo thống». Nếu hiểu thẳng thì mỗi đạo thống có thể chứa hàng nghìn người: không còn ai quen ai, không còn «mục tiêu tuần chung», và quyền lãnh đạo rơi vào tay vài người online nhiều nhất. Kế hoạch MMO lại ghi «môn phái ≤ 30 người». Hai yêu cầu được hòa bằng **hai tầng**:

| Tầng | Tên trong game | Ai lập | Quy mô | Lãnh đạo | Vai trò |
|---|---|---|---|---|---|
| **Tông môn** (宗門) | 9 tông theo 9 đạo thống | hệ thống (cố định) | không giới hạn | **NPC chưởng giáo** (canon §4) | bản sắc, lễ tông hằng tuần, danh xưng, chuỗi tu `CQ-*` (tài liệu 05/09) |
| **Chi đường** (支堂) | tên riêng theo tông (Pháp Đàn, Đan Viện, Liên Xã…) | người chơi | 8–30 người | người chơi (Chủ Trì) | đạo tràng riêng đi vào được, kho, Đạo Vọng, lễ đường, việc tuần |

Nguyên tắc:

1. **Tông môn không có người chơi lãnh đạo.** Không ai «làm chưởng môn Chính Nhất». Chưởng giáo luôn là NPC (Trương Thiên Sư, Huyền Hư chân nhân…). Điều này tránh tranh quyền, tránh một nhóm nhân danh cả một truyền thống tôn giáo có thật.
2. **Chi đường là đơn vị xã hội thật.** Mọi thứ người chơi tự quản (kho, bỏ phiếu, xây dựng) nằm ở chi đường.
3. Người chơi có thể **thuộc tông mà không thuộc chi đường nào** («tán tu trong tông»). Họ vẫn dự lễ tông, vẫn làm chuỗi `CQ-*`, chỉ không có đạo tràng chung.
4. **Một người — một chi đường** tại một thời điểm, và chi đường đó phải thuộc **chính tông** của người ấy.

---

## 1.2 Chín tông môn (mã chuẩn)

| Mã | Tông môn | Đạo thống (canon §5.6) | Thánh địa (`region`) | Chưởng giáo (npc id) | Tên loại chi đường | Phái app (`schools-data › SCHOOLS.id`) |
|---|---|---|---|---|---|---|
| `GUILD-CN` | Chính Nhất Tông | Chính Nhất (+ Thần Tiêu) | `longho` | `truong_thiensu` | **Pháp Đàn** (法壇) | `zhengyi`, `shenxiao` |
| `GUILD-TV` | Thanh Vi Đan Đỉnh Tông | Thanh Vi · Đan Đỉnh | `vodang` | `huyen_hu` (phó: `dan_dinh`) | **Đan Viện** (丹院) | `qingwei`, `danding` |
| `GUILD-TC` | Toàn Chân Linh Bảo Tông | Toàn Chân · Linh Bảo | `chungnam` | `khau_daotruong` | **Đạo Am** (道庵) | `quanzhen`, `lingbao` |
| `GUILD-TT` | Thượng Thanh Lư Sơn Tông | Thượng Thanh · Lư Sơn | `maoshan` | `maoshan_daonhan` | **Tĩnh Thất** (靜室) | `maoshan`, `lushan` |
| `GUILD-BD` | Bắc Đế Độ Nhân Tông | Bắc Đế · Động Uyên (+ Địa Tạng) | `phongdo` | `phan_quan` (phó: `diatang_su`) | **Độ Đàn** (度壇) | `beidi`, `dongyuan` |
| `GUILD-TH` | Trúc Lâm Thiền Tông | Thiền | `yentu` | `truclam_thiensu` | **Thiền Am** (禪庵) | — (cần bổ sung Trúc Lâm, canon §5.6) |
| `GUILD-TD` | Tịnh Độ Liên Tông | Tịnh Độ · sám hối | `buttap` | `dieu_am` | **Liên Xã** (蓮社) | — (`remedy-fate › CHAN_HUI, JING_ZHOU`) |
| `GUILD-MT` | Chuẩn Đề Mật Tông | Mật (Chuẩn Đề) | `tangdia` | `lama_dakiet` (**chờ tham vấn**) | **Chuẩn Đề Đàn** (準提壇) | — (`remedy-fate › ZHUNTI`) |
| `GUILD-NH` | Tịnh Minh Nho Tông | Nho · Tịnh Minh | `vanmieu` | `te_tuu` | **Văn Hội** (文會) | `jingming` |
| `GUILD-BM` | *(dành sẵn — không mở)* | Bàng môn | `mieucuong` | `vu_y_amau` | — | — |

**Vì sao không có tông Bàng môn.** Bàng môn trong canon gồm hai thứ: Tà Lộ (một tuyến truyện cám dỗ – hồi đầu, §5.5) và Vu y (y dược theo ngũ hành). Tà Lộ **không bao giờ** được thể chế hóa thành nhóm người chơi (một «hội tà đạo» do người chơi lập sẽ biến cám dỗ thành bản sắc và tạo áp lực đồng trang lứa). Vu y được mở dưới dạng **«Y Lư Miêu Cương»**: một **hội nghề** ai cũng vào được, không cấp bậc, không kho, không bỏ phiếu, chỉ có bảng việc hái thuốc chung (Phần 03 §3.5). Mã `GUILD-BM` giữ chỗ để không ai dùng nhầm.

**Tông có điều kiện đặc biệt:**

- `GUILD-BD` (Phong Đô): thánh địa mở ở cảnh giới 5 (bản sơ đồ §9.1). Nhập tông cần cảnh giới 5 và đã đi qua chuỗi «cứu người» đầu tiên của Phong Đô (tài liệu 03/05 cấp mã).
- `GUILD-MT` (Tạng Địa): **chỉ phát hành sau tham vấn** (canon §3). Trước đó tông tồn tại trong dữ liệu nhưng cờ `enabled: false`; giao diện không hiện. Phần nội dung chỉ dựa trên Chuẩn Đề (`ZHUNTI`, `CHAN_HUI › 金剛薩埵`), không dùng nghi thức Tạng truyền.
- `GUILD-TH`, `GUILD-TD`, `GUILD-MT`: là **cư sĩ tông** — danh xưng người chơi luôn là danh xưng cư sĩ, không dùng danh hiệu tăng sĩ có thật (xem §1.6.3).

---

## 1.3 Nhập tông

### 1.3.1 Điều kiện

| Điều kiện | Giá trị | Nguồn kiểm |
|---|---|---|
| Đã mở thánh địa của tông | theo bảng mở vùng tài liệu 07/09 | cờ vùng trong `state` |
| Cảnh giới tối thiểu | 2 (Nhập Môn / Quy Y / Sĩ); `GUILD-BD`, `GUILD-MT`: 5 | `Tiềm Lực × 0,4 + Đạo Hạnh` (canon §5) |
| Đã gặp chưởng giáo và làm chuỗi «Vấn đạo» (3 việc nhỏ) | `GUILD-Q-<tông>-00` | máy nhiệm vụ |
| Số tông đang tu | ≤ 3 (1 chính tông + ≤ 2 kiêm tu) | canon «tối đa 3 đạo thống chính» |
| Không trong thời gian chờ đổi tông | xem §1.3.4 | máy chủ |

Không có điều kiện về **Phẩm căn**, **Mệnh Cấp** hay **Mệnh Cách**. Lá số thấp vào tông nào cũng được (trụ cột T2). Gợi ý «tông hợp Dụng thần» (`daozang-data › _YONG2CULT`, +10% tốc độ tu, bản sơ đồ §5.6) chỉ là **gợi ý**, hiện dưới dạng «thầy thấy con hợp…», không khóa.

### 1.3.2 Chính tông và kiêm tu

| | Chính tông | Kiêm tu |
|---|---|---|
| Số lượng | 1 | 0–2 |
| Vào chi đường | được (chỉ chi đường của chính tông) | không |
| Danh xưng hiện cạnh tên | có (`hello.title` hoặc trường `mon`, Phần 11) | không |
| Dự lễ tông tuần | được, nhận đủ thưởng | được, thưởng cá nhân × 0,5 |
| Chuỗi `CQ-*` | đủ | đủ (tu là tu, không phân biệt) |
| Đạo hiệu (§1.4) | có | không |

Lý do kiêm tu nhận nửa thưởng **lễ** nhưng đủ thưởng **tu**: lễ là sinh hoạt cộng đồng (gắn bó một nhà), còn tu là việc cá nhân. Không phạt người đi nhiều đạo; canon khuyến khích Quy nhất (≥ 3 đạo thống).

### 1.3.3 Lễ nhập tông (khung kịch bản dùng chung)

Mỗi tông thay lời thoại riêng ở Phần 02. Khung:

```
[CẢNH GUILD-Q-<tông>-00.4 · chính điện thánh địa · giờ Thìn (07–09) hoặc giờ khách chọn]
<CHƯỞNG GIÁO>: (đứng trước hương án) Con đi ba việc rồi. Thầy hỏi một câu thôi.
<CHƯỞNG GIÁO>: Con vào đây để làm gì?
> Lựa chọn:
  ① «Để đổi vận cho nhanh.» → [00.5a]
  ② «Để học cách sống cho tử tế hơn.» → [00.5b]
  ③ «Con chưa biết, con muốn thử.» → [00.5c]

[00.5a]
<CHƯỞNG GIÁO>: Vận không đổi nhanh được, con ạ. Ở đây chỉ có việc làm mỗi ngày.
<CHƯỞNG GIÁO>: Nếu con vẫn muốn ở lại thì ở lại. Thầy không đuổi người thật thà.
→ [00.6]   (không trừ gì; ghi cờ `nhap_tong_dong_co = 'van'` để NPC sau này nhắc nhẹ)

[00.5b]
<CHƯỞNG GIÁO>: Câu đó dễ nói. Thầy sẽ nhìn con làm.
→ [00.6]

[00.5c]
<CHƯỞNG GIÁO>: Thử là thật thà. Thử đủ lâu thì thành tu.
→ [00.6]

[00.6]
(người chơi dâng một nén hương — hoạt ảnh `emo: incense`, chỉ dùng được trong điện)
<CHƯỞNG GIÁO>: Từ nay con là người của <tên tông>. Giữ ba điều: không nói dối người đến hỏi việc, không khoe mình hơn người, không bỏ người đang cần giúp.
<CHƯỞNG GIÁO>: Tên mới của con, ra Văn phòng tông mà chọn. Tên là để nhắc mình, không phải để khoe.
→ mở §1.4 Đạo hiệu
```

Quy tắc kịch bản: không lựa chọn nào bị chặn hay bị phạt; ba câu răn là **giới tông** dùng chung (mỗi tông thêm một câu riêng ở Phần 02).

### 1.3.4 Đổi chính tông, rời tông

| Hành động | Điều kiện | Hệ quả |
|---|---|---|
| Đổi chính tông | đã ở chính tông hiện tại ≥ 14 ngày | rời chi đường hiện tại; giữ toàn bộ Đạo Hạnh, công đức, đạo hiệu cũ (lưu trong «Sổ đạo hiệu»); thời gian chờ nhập chi đường mới **72 giờ** |
| Thôi kiêm tu | bất kỳ lúc nào | không mất gì; tông đó thành «đã từng tu» (vẫn tính cho Quy nhất nếu đã đạt mốc `CQ-*` theo tài liệu 05) |
| Rời mọi tông | được | thành «tán tu»; chuỗi `CQ-*` dừng ở bước hiện tại, quay lại tiếp được |

Không có hình phạt «phản sư», «bội môn». Game không dạy rằng rời một cộng đồng là tội. NPC chưởng giáo cũ chào: «Đi đâu cũng là tu. Khi nào ghé thì ghé.»

---

## 1.4 Đạo hiệu, pháp danh, tên hiệu

Sau lễ nhập tông người chơi chọn một tên tu (hiện thay tên hoặc cạnh tên, tùy chọn).

| Tông | Gọi là | Cấu trúc | Ví dụ |
|---|---|---|---|
| CN, TV, TC, TT, BD | **Đạo hiệu** | 2 chữ Hán Việt | Thanh Hư, Huyền Tĩnh |
| TH, TD, MT | **Pháp danh cư sĩ** | 2 chữ, chữ đầu theo «chữ đời» của tông | Tâm An (TH), Diệu Hòa (TD), Chánh Minh (MT) |
| NH | **Tên hiệu** (號) | 2 chữ | Ức Trai-kiểu: Mặc Khê, Tĩnh Phố |

**Cơ chế chọn:** người chơi chọn từ **danh sách chữ soạn sẵn** của tông (mỗi tông 60–90 chữ, Phần 02). Mỗi tổ hợp được chấm bằng `naming.js › analyzeName` (số nét, ngũ cách) **so với Dụng thần của người chơi** (tính trên máy, không gửi lên). Giao diện hiện 3 nhãn: «hợp Dụng», «trung tính», «nghịch Dụng» và lời giải thích của engine.

- Không bắt buộc chọn tên «hợp Dụng». Chọn tên nghịch Dụng không bị trừ gì. Lời nhắc: «Tên là một lớp trong Mệnh Đồ (tầng 2). Hợp thì tốt, không hợp thì con tu bằng việc khác.» (khớp `gaimenh › layers` tầng «Tên», canon §6).
- Tên tu **không phải tự do**: chỉ ghép từ danh sách → không cần kiểm duyệt nội dung, an toàn cho iOS (Guideline 1.2).
- Đổi tên tu: 1 lần / mùa (năm can chi) miễn phí; không bán lượt đổi tên bằng Ngọc (tên tu gắn với Mệnh Đồ, thuộc nhóm «không bán» theo §11 bản sơ đồ).

---

## 1.5 Chi đường

### 1.5.1 Lập chi đường

| Điều kiện | Giá trị | Ghi chú |
|---|---|---|
| Người khởi lập | cảnh giới ≥ 3; ở chính tông ≥ 21 ngày; tài khoản đã **xác thực danh tính bền** (Phần 12 §12.2: khóa thiết bị ký HMAC, hoặc Sign in with Apple) | chống lập bằng tài khoản ảo |
| Đồng khởi | 5 người khác, cảnh giới ≥ 2, cùng chính tông, chưa ở chi đường nào | ký trong 72 giờ bằng nút «Đồng khởi» (không chat) |
| Lệ phí | 2.000 Phúc Khí (bị tiêu hủy, không vào kho) | Phúc Khí là tiền cày được; không dùng Ngọc |
| Tên | ghép từ danh sách (§1.5.2) | duy nhất trong tông |
| Lô đạo tràng | tự động cấp một **phiên bản** (instance) khu đạo tràng ở Phường Đạo Tràng của thánh địa (§1.8) | không giới hạn số lô vì là phòng ngoài bản đồ |

Lập xong chi đường ở **bậc 1**, 6 thành viên, người khởi lập là Chủ Trì nhiệm kỳ đầu.

Nếu sau 7 ngày chi đường chưa có **8 thành viên** thì chuyển trạng thái «tạm đường»: vẫn hoạt động nhưng chưa được xây bậc 2. Không giải tán tự động trong 30 ngày đầu.

### 1.5.2 Bộ ghép danh

Tên chi đường = **chữ thứ nhất** (bảng A) + **chữ thứ hai** (bảng B) + **tên loại** của tông. Ví dụ «Thanh Vân Pháp Đàn», «Tịnh Liên Xã», «Mặc Khê Văn Hội».

**Bảng A — 40 chữ đầu:** Thanh, Tử, Bạch, Huyền, Tùng, Minh, Vân, Thái, Hòa, Ngọc, Kim, Đan, Linh, Tĩnh, Hư, Chân, Nguyên, Diệu, Từ, Tịnh, Thiện, Đức, Mặc, Cổ, Lam, Bích, Thúy, Hồng, Hạo, Quang, Trường, Thượng, Nam, Bắc, Đông, Tây, Xuân, Thu, Hạ, Đông Sơn *(tính là một mục)*.

**Bảng B — 40 chữ sau:** Vân, Hà, Hạc, Phong, Nguyệt, Tuyền, Sơn, Khê, Lâm, Đài, Liên, Tùng, Trúc, Mai, Lan, Cúc, Thạch, Hải, Hồ, Giang, Nham, Cốc, Phong (峰), Lĩnh, Châu, Đình, Hiên, Viên, Uyển, Tâm, Chiếu, Quang, Hư, Tĩnh, Minh, Thành, An, Ninh, Huy, Đăng.

- 40 × 40 = 1.600 tổ hợp × 9 loại = 14.400 tên. Loại trừ tổ hợp trùng chữ (Vân Vân, Hư Hư…) và **danh sách đen tổ hợp** (tổ hợp trùng tên tổ chức, chùa, quán có thật đang hoạt động; tổ hợp đọc lái thô tục). Danh sách đen do biên tập viên duy trì trong `guild-names.js` **(chưa có — cần làm)**.
- Hết tên (khi một tông có > 1.500 chi đường): thêm hậu tố số Hán Việt «· Nhị», «· Tam».
- Không có tên tự do. Lý do: tên chi đường hiện trên cổng đạo tràng, trên Thiên Bảng và trên đầu thành viên; tên tự do là UGC lớn nhất của game, phải kiểm duyệt liên tục (Guideline 1.2, an toàn trẻ em).

### 1.5.3 Quy mô theo bậc đạo tràng

| Bậc đạo tràng | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Số thành viên tối đa | 12 | 16 | 20 | 24 | 28 | 30 |

Trần 30 giữ đúng `GAME-MMO-PROMPT-PLAN.md §B2`. Lý do không mở rộng hơn: lễ đường chạy trong một phòng `SectHall` với ≤ 30 người cùng lúc (Phần 12), và nhóm ≤ 30 vẫn đủ nhỏ để ai cũng biết tên nhau.

### 1.5.4 Gia nhập chi đường

| Cách | Quy trình | Ghi chú |
|---|---|---|
| **Được mời** | thành viên có quyền «Tri Khách» gửi lời mời (người được mời đang cùng phòng TownShard, hoặc là đạo hữu) → người được mời chấp nhận | đơn giản nhất |
| **Xin vào** | người chơi bấm «Xin nhập đường» ở cổng đạo tràng hoặc trên Lầu Danh Bộ → Tri Khách duyệt | đơn chờ tối đa 7 ngày |
| **Tuyển công khai** | chi đường bật «mở cửa»: ai đủ điều kiện tối thiểu (cảnh giới, tuổi tài khoản) vào thẳng | có giới hạn 3 người / ngày để tránh bị dồn tài khoản ảo |

**Điều kiện chi đường được đặt:** cảnh giới tối thiểu (1–4), tuổi tài khoản tối thiểu (0–30 ngày), «nhóm tuổi» (§1.14 và Phần 05 §5.6: chi đường có thành viên dưới 16 tuổi tự động khóa vài tính năng).

**Ký Danh 7 ngày:** người mới là cấp R0 trong 7 ngày: dự lễ, làm việc tuần, nhưng chưa bỏ phiếu, chưa góp vật liệu > 50 / ngày, chưa rút gì. Hết 7 ngày tự lên R1 nếu đã dự ≥ 1 lễ (đường lễ hoặc tông lễ). Chưa dự lễ nào thì gia hạn thêm 7 ngày, sau đó Chủ Trì quyết.

### 1.5.5 Rời và bị mời ra

| Trường hợp | Quy trình | Thời gian chờ vào chi đường khác |
|---|---|---|
| Tự rời | bấm «Từ đường», xác nhận | 72 giờ |
| Bị mời ra (R0, R1) | Chủ Trì / Phó Trì chọn lý do soạn sẵn; tối đa 2 người / ngày | 24 giờ |
| Bị mời ra (R2 trở lên) | phải qua nghị sự (§1.7) | 24 giờ |
| Chi đường hưu đường (§1.7.6) | tự động | 0 |

Lý do mời ra (soạn sẵn): «không tham gia lâu ngày», «gây phiền cho đồng môn», «tự nguyện xin ra nhưng không bấm được», «đổi nhóm theo thỏa thuận». Người bị mời ra nhận thông báo kèm lý do và **quyền khiếu nại** nếu cho rằng bị bắt nạt (Phần 05 §5.5).

**Phần đóng góp đi theo người:** vật liệu, Phúc Khí đã góp **không** hoàn lại (đã thuộc kho), nhưng lịch sử đóng góp («Công lao bạ») được giữ trong hồ sơ cá nhân và hiện ở chi đường mới (nếu người chơi muốn). Điều này chống việc «đuổi người vừa góp xong để chiếm kho» mất ý nghĩa (người bị đuổi vẫn mang danh tiếng theo) và chống «góp rồi rút» (không rút được).

---

## 1.6 Cấp bậc, chức sự, quyền hạn

### 1.6.1 Bảy cấp

| Cấp | Tên chung | Điều kiện | Số lượng |
|---|---|---|---|
| R0 | Ký Danh | mới vào | — |
| R1 | Đồng Môn | qua 7 ngày Ký Danh | — |
| R2 | Nội Môn | ≥ 28 ngày ở chi đường **và** dự ≥ 4 lễ **và** cảnh giới ≥ 2 | — |
| R3 | Chấp Sự | được bổ nhiệm vào một chức sự (§1.6.2) | ≤ 6 |
| R4 | Trưởng Lão | cảnh giới ≥ 4, ≥ 90 ngày ở chi đường, được nghị sự bầu | ≤ 3 |
| R5 | Phó Trì | được Chủ Trì đề cử + nghị sự thông qua | ≤ 2 |
| R6 | Chủ Trì | khởi lập, hoặc được bầu (§1.7.3) | 1 |

R2 tự lên khi đủ điều kiện (máy chủ kiểm mỗi đêm). R3–R6 cần bổ nhiệm/bầu. **Cảnh giới** (thang tu cá nhân) và **cấp chi đường** (vai xã hội) là hai thang riêng: một người cảnh giới 2 vẫn có thể là Chấp Sự giỏi.

### 1.6.2 Sáu chức sự (R3)

Chức sự là **vai việc**, không phải «quan». Mỗi chức có quyền rõ ràng và giới hạn rõ ràng.

| Chức | Tên chung | Việc | Quyền |
|---|---|---|---|
| Tri Khách | 知客 | đón người mới, mời, duyệt đơn | mời, duyệt đơn, đổi trạng thái «mở cửa» |
| Tri Khố | 知庫 | giữ kho | lập phiếu chi (≤ hạn mức), xem sổ kho đầy đủ, nhận vật liệu ủy thác |
| Chủ Lễ | 主禮 | lo lễ | đặt lịch đường lễ, chọn bài lễ, phân vai trong lễ |
| Giám Viện | 監院 | lo xây dựng | mở công trường, chọn mô-đun nội thất, đặt đồ trong đạo tràng |
| Thư Ký | 書記 | ghi chép | soạn nghị sự từ mẫu, ghi biên bản, quản bảng tin (chọn bài từ mẫu) |
| Giáo Tập | 教習 | dạy người mới | mở lớp ở Giảng Đường, gán người mới cho «người dẫn» (không phải sư đồ chính thức) |

Mỗi tông đổi tên hiển thị của chức sự cho hợp truyền thống (Phần 02), ví dụ Thiền Am gọi Chủ Lễ là «Duy Na», Văn Hội gọi Thư Ký là «Thư Biện».

### 1.6.3 Nguyên tắc danh xưng tôn trọng

- **Không dùng** danh hiệu giáo phẩm có thật cho người chơi: Hòa thượng, Thượng tọa, Đại đức, Ni trưởng, Thiên Sư, Lạt-ma, Rinpoche, Giáo chủ, Tông chủ, Pháp vương.
- Ba tông Phật giáo (TH, TD, MT) dùng **danh xưng cư sĩ**: người chơi là «thiện tín», «cư sĩ», «hộ pháp» — không ai «xuất gia» trong game.
- Các tông Đạo giáo dùng danh xưng chức việc trung tính (Tri Khách, Chủ Lễ…) và danh xưng cảnh giới theo canon §5.
- Tông Nho dùng danh xưng học hội (Hội trưởng, Thư Biện…), không dùng học vị có thật (Tiến sĩ, Trạng nguyên) làm cấp chi đường; học vị chỉ là **danh hiệu khoa cử** trong hoạt động Khoa cử (tài liệu 09), ghi rõ «danh hiệu trò chơi».

### 1.6.4 Ma trận quyền

Ký hiệu: ✓ được · ○ được khi có chức sự tương ứng · ✗ không · V qua nghị sự.

| Hành động | R0 | R1 | R2 | R3 | R4 | R5 | R6 |
|---|---|---|---|---|---|---|---|
| Vào đạo tràng, dùng công trình | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Dự lễ, làm việc tuần | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Góp Phúc Khí / vật liệu vào kho | hạn 50 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Bỏ phiếu nghị sự | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Mở nghị sự | ✗ | ✗ | ✓ (2 / tuần) | ✓ | ✓ | ✓ | ✓ |
| Mời người, duyệt đơn | ✗ | ✗ | ✗ | ○ Tri Khách | ✓ | ✓ | ✓ |
| Lập phiếu chi ≤ hạn mức | ✗ | ✗ | ✗ | ○ Tri Khố | ✗ | ✓ | ✓ |
| Chi vượt hạn mức | ✗ | ✗ | ✗ | V | V | V | V |
| Đặt lịch đường lễ | ✗ | ✗ | ✗ | ○ Chủ Lễ | ✓ | ✓ | ✓ |
| Mở công trường | ✗ | ✗ | ✗ | ○ Giám Viện | ✗ | ✓ | ✓ (cần V nếu bậc mới) |
| Bổ nhiệm chức sự | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ (công khai trong sổ) |
| Mời ra R0–R1 | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| Mời ra R2+ | V | V | V | V | V | V | V |
| Giao hảo với chi đường khác | ✗ | ✗ | ✗ | ✗ | ✗ | V | V |
| Giải tán chi đường | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | V (2/3) |

---

## 1.7 Quản trị: nghị sự, bầu, nhiệm kỳ

### 1.7.1 Nghị sự từ mẫu

Mọi quyết định tập thể đi qua **Bảng Nghị Sự** đặt trong Chính Đường của đạo tràng (một công trình đi vào được; cũng mở được từ bảng điều khiển). Không có văn bản tự do: mỗi nghị sự là một **mẫu** với tham số chọn từ danh sách.

| Mã mẫu | Nội dung | Tham số | Ngưỡng | Thời hạn |
|---|---|---|---|---|
| `NS-01` | Nâng bậc đạo tràng | bậc mới | đa số | 48 giờ |
| `NS-02` | Xây / đổi một công trình phụ | công trình, mô-đun | đa số | 48 giờ |
| `NS-03` | Chi kho vượt hạn mức cho một dự án | dự án (từ danh sách), số lượng | đa số | 48 giờ |
| `NS-04` | Hồi hướng: góp kho cho công trình công cộng | dự án `EV-CAU-*` / `EV-TMB-*` | đa số | 24 giờ |
| `NS-05` | Bầu Trưởng Lão | người được đề cử | đa số | 72 giờ |
| `NS-06` | Thông qua Phó Trì | người được đề cử | đa số | 72 giờ |
| `NS-07` | Mời ra thành viên R2+ | người, lý do soạn sẵn | 2/3 | 48 giờ |
| `NS-08` | Bất tín nhiệm Chủ Trì | lý do soạn sẵn | 2/3 | 72 giờ |
| `NS-09` | Giao hảo / thôi giao hảo | chi đường kia | đa số | 48 giờ |
| `NS-10` | Đổi lịch đường lễ cố định | ngày, giờ | đa số | 48 giờ |
| `NS-11` | Đổi điều kiện nhận người | cảnh giới, tuổi tài khoản, mở cửa | đa số | 48 giờ |
| `NS-12` | Hưu đường (giải tán) | — | 2/3 + Chủ Trì đồng ý (hoặc Chủ Trì vắng > 21 ngày) | 7 ngày |
| `NS-13` | Ghi danh vào Hội Thiện / Luận Đạo Hội (§1.13) | sự kiện | đa số | 24 giờ |

### 1.7.2 Luật bỏ phiếu

- **Cử tri:** R2 trở lên, **đang hoạt động** (đăng nhập trong 14 ngày gần nhất).
- **Túc số:** ≥ 40% cử tri hoạt động đã bỏ phiếu. Không đủ túc số khi hết hạn → nghị sự **không thông qua** (giữ nguyên hiện trạng).
- **Đa số:** phiếu thuận > phiếu chống (phiếu trắng tính vào túc số, không tính vào thuận/chống).
- **2/3:** phiếu thuận ≥ 2/3 tổng phiếu thuận + chống.
- Mỗi người một phiếu, sửa phiếu được đến khi hết hạn.
- Phiếu **kín** với mọi người trừ chính người bỏ; kết quả công khai sau khi đóng (tổng thuận / chống / trắng). Lý do: tránh áp lực trong nhóm nhỏ.
- Một chi đường có tối đa **5 nghị sự mở** cùng lúc. Một người mở tối đa 2 nghị sự / tuần.
- Người bị nêu tên trong `NS-07`, `NS-08` **không** bỏ phiếu cho nghị sự đó, được xem số phiếu khi đóng và được gửi một «lời trình» chọn từ mẫu (Phần 06, nhóm «Nghị sự»).

### 1.7.3 Nhiệm kỳ Chủ Trì

- Nhiệm kỳ = **một mùa** (từ Lập Xuân đến Lập Xuân, khớp «Mùa = năm can chi», bản sơ đồ §9.2).
- Trong 7 ngày quanh Lập Xuân, chi đường mở **bầu Chủ Trì** tự động: ứng viên là R4/R5 hoặc Chủ Trì đương nhiệm tự ứng cử; nếu chỉ có một ứng viên thì cần ≥ 50% phiếu thuận để tiếp tục (bỏ phiếu tín nhiệm).
- Không giới hạn số nhiệm kỳ, nhưng sau 3 nhiệm kỳ liên tiếp, cuộc bầu bắt buộc có ít nhất 2 ứng viên nếu có R4/R5 đủ điều kiện (nếu không ai đứng ra thì giữ nguyên).
- Kết quả bầu được công bố bằng tiếng chuông ở Lầu Chuông (nếu đạo tràng đã có, bậc 4) và một dòng trong Sổ Đường.

### 1.7.4 Bất tín nhiệm

`NS-08` cần: người mở là R4/R5, hoặc ≥ 3 thành viên R2+ cùng ký mở (ký bằng nút, trong 48 giờ). Thông qua → Chủ Trì thành R4 (giữ Trưởng Lão nếu còn chỗ, nếu không thì R2), Phó Trì có thâm niên cao nhất thành Chủ Trì tạm thời và cuộc bầu mở trong 7 ngày. Sau một `NS-08` thất bại, không được mở lại trong **21 ngày**.

### 1.7.5 Chủ Trì vắng mặt

| Vắng | Hệ quả |
|---|---|
| 7 ngày | thông báo cho Phó Trì: «Chủ Trì vắng 7 ngày» |
| 14 ngày | Phó Trì có thâm niên cao nhất được quyền **đại trì** (mọi quyền R6 trừ giải tán, bổ nhiệm) |
| 21 ngày | tự động chuyển Chủ Trì cho người đại trì; nếu không có Phó Trì → Trưởng Lão thâm niên cao nhất → R2 hoạt động thâm niên cao nhất |

Chủ Trì cũ quay lại vẫn là thành viên R4 (nếu còn chỗ) và có thể ứng cử lại ở mùa sau.

### 1.7.6 Hưu đường (giải tán) và chi đường ngủ

| Trạng thái | Điều kiện | Hệ quả |
|---|---|---|
| **Ngủ** | không thành viên nào đăng nhập 30 ngày | đạo tràng đóng cửa khách, giữ nguyên |
| **Hưu đường tự động** | ngủ thêm 45 ngày (tổng 75 ngày) | tên được giải phóng sau 30 ngày nữa; kho đổ vào **Quỹ Cầu Đường** (public works, Phần 08), không chia cho cá nhân |
| **Hưu đường theo nghị sự** | `NS-12` thông qua | 7 ngày ân hạn để hủy; sau đó như trên |

**Kho không bao giờ chia cho cá nhân** khi giải tán. Đây là chốt chặn quan trọng nhất chống «lập chi đường để gom tài sản rồi chia cho tài khoản chính».

---

## 1.8 Đạo tràng: công trình chung đi vào được

### 1.8.1 Phường Đạo Tràng ở thánh địa

Mỗi thánh địa có một khu **Phường Đạo Tràng** (vị trí và mã công trình do tài liệu 07 cấp, `BLD-<region>-xx`). Khu này gồm:

| Công trình | Đi vào được | Công năng |
|---|---|---|
| **Lầu Danh Bộ** | có, 2 tầng | tầng 1: bàn Tri Khách chung (NPC) — xem danh sách chi đường của tông, lọc theo «mở cửa», cảnh giới tối thiểu, số người, giờ lễ; tầng 2: bia «Đạo Vọng» các chi đường (Phần 07) |
| **Dãy Đạo Tràng Môn** | mỗi cổng là một gian cổng có mái, bước qua là vào **phiên bản đạo tràng** | cổng hiển thị tên chi đường, bậc, biểu tượng; chi đường «đóng cửa khách» thì khách thấy cổng khép |
| **Đình Nghỉ Chân** | có | bảng việc tuần của tông, chỗ hẹn gặp, đặt «thẻ tìm bạn đồng hành» (Phần 04 §4.7) |

Dãy cổng không thể có hàng nghìn cổng thật: **chỉ hiện 12 cổng**, mỗi cổng gán động cho chi đường liên quan đến người nhìn (chi đường của mình, của đạo hữu, đang giao hảo, đang mở cửa, có lễ sắp diễn ra). Bấm vào Lầu Danh Bộ để đi tới chi đường bất kỳ. Cổng là công trình thật (đi vào được, có mái, có bậc), không phải nút bấm giữa trời.

### 1.8.2 Phiên bản đạo tràng

- Mỗi chi đường có một **khu 64 × 64 m** dựng ngoài bản đồ chính, cách làm giống `interior.js` (điện vào được qua phòng ngoài bản đồ, `world.js › ROOMS` với `origin` riêng). Toạ độ gốc cấp theo mã chi đường (Phần 12 §12.6).
- Bố cục theo **bộ mô-đun nội thất của tông** (tài liệu 08 cấp `MOD-<bộ>-xx`). Bố cục khung cố định cho từng bậc (để va chạm `collide.js` và A* `world.js` kiểm trước được), người chơi chỉ chọn **biến thể** (mô-đun, màu sơn, đồ bày).
- Khi một người chơi bước vào cổng: client chuyển phòng như vào điện; kết nối `SectHall` của chi đường đó (Phần 11) để thấy người đang ở trong đạo tràng; kết nối TownShard vẫn giữ (vị trí ngoài cổng đóng băng).

### 1.8.3 Sáu bậc công trình

Mỗi bậc **thêm** công trình; không công trình nào là «làm màu» (canon T4, bản sơ đồ §8).

| Bậc | Công trình thêm | Công năng (đều đi vào được) | Đạo Vọng cần | Vật liệu (gỗ / đá / ngói / sơn / giấy / mực / đồng / trầm) | Thời gian xây (giờ thật) |
|---|---|---|---|---|---|
| 1 | **Sơn môn nhỏ**, **Chính Đường**, sân | Chính Đường: hương án làm lễ, Bảng Nghị Sự, bia danh sách thành viên, Sổ Đường | 0 | (miễn) | — |
| 2 | **Tàng Thư Các**, **Liêu Xá** | Tàng Thư: mỗi ngày một «trang đọc» của tông (từ `library-data`, `daozang-data`), đọc xong +Đạo Hạnh nhỏ (tài liệu 09 chốt); Liêu Xá: điểm nghỉ, «bế quan» (Đạo Hạnh nhỏ khi offline có giới hạn — tài liệu 09 quyết) và giường nghỉ mỗi người | 300 | 120 / 80 / 60 / 20 / 40 / 20 / 0 / 0 | 12 |
| 3 | **Trai Đường**, **Khố Phòng** | Trai Đường: nấu món chay/trà theo mùa (công thức từ `bazi-diet`, `coffee-kb` không — chỉ trà; buff Phúc Khí nhỏ cho cả đường); Khố Phòng: kho vật lý — đứng trước tủ mới xem/sửa kho chi tiết | 900 | 200 / 150 / 120 / 60 / 40 / 20 / 40 / 0 | 24 |
| 4 | **Giảng Đường / Pháp Đàn**, **Lầu Chuông Trống** | Giảng Đường: lớp học (Giáo Tập dạy, đồng tu nhiều chỗ ngồi, Phần 04 §4.2); Lầu Chuông: báo giờ lễ cho cả đường (thông báo đẩy), đánh chuông mừng bầu cử | 2.000 | 320 / 260 / 200 / 120 / 80 / 60 / 120 / 20 | 48 |
| 5 | **Hậu Viên**, **Khách Đường** | Hậu Viên: vườn thảo dược / ao (TD: ao phóng sinh) — hái theo mùa; Khách Đường: đón đoàn chi đường giao hảo, nơi tổ chức Luận Đạo Hội nhỏ | 4.000 | 400 / 400 / 300 / 200 / 120 / 80 / 160 / 60 | 72 |
| 6 | **Công trình đặc trưng của tông** (Phần 02) | công năng riêng (vd Mật: Kinh Luân Lầu; Nho: Tụ Văn Lầu) | 7.500 | 500 / 500 / 400 / 300 / 200 / 160 / 240 / 120 | 96 |

**Không có xuống cấp.** Đạo tràng không mục, không cháy, không «hết hạn bảo trì». Lý do: tránh vòng chơi ép buộc (áp lực phải online để giữ nhà) — điều mâu thuẫn tinh thần «không ai giục» của Huyền Quán (`features.js › TEXT.gateLead`).

### 1.8.4 Công trường (xây dựng là việc chung)

Nâng bậc hay xây công trình mới mở một **công trường** trong đạo tràng:

1. Giám Viện mở công trường (sau `NS-01` / `NS-02`). Khung giàn tre dựng lên đúng vị trí công trình.
2. Vật liệu trừ khỏi kho theo **8 đợt** (mỗi đợt 1/8). Mỗi đợt cần **công sức**: thành viên mang vật liệu từ Khố Phòng tới công trường (hoạt ảnh vác, đi bộ thật trong đạo tràng), mỗi lượt vác = 1 công. Một đợt cần `12 × bậc` công.
3. Đủ công sức cho đợt thì đồng hồ thời gian xây của đợt chạy (tổng thời gian ở bảng trên chia 8).
4. **Có người vác cùng lúc** (≥ 3 người trong vòng 8 m của công trường): mỗi lượt vác tính 1,5 công. Đây là chỗ để thành viên gặp nhau.
5. Xong 8 đợt: lễ khánh thành. Chủ Lễ có thể chọn ngày khánh thành bằng **trạch nhật** (`zheri`, `huangdao`, bản sơ đồ §9.3 «Chọn ngày lễ»): ngày được engine chấm «tốt» → +20 Đạo Vọng và pháo giấy đỏ trong đạo tràng; ngày xấu không bị phạt.

**Giới hạn:** một người tối đa 40 lượt vác / ngày cho mọi công trường (chống tự động hóa). Thành viên R0 vác được nhưng không tính vượt 10 lượt / ngày.

### 1.8.5 Định nghĩa hoàn thành (Definition of Done) cho một công trình đạo tràng

Kế thừa bản sơ đồ §8.5, thêm điều riêng cho đạo tràng:

- [ ] Cửa thật; bước vào được từ sân bằng A* không kẹt (kiểm bằng test đường đi từ cổng tới mọi cửa).
- [ ] Nội thất từ bộ mô-đun của tông; va chạm theo hình khối (`collide.js`), không đi xuyên.
- [ ] Ít nhất **một công năng tương tác** ghi trong bảng §1.8.3.
- [ ] Hoạt động được với 30 người cùng lúc trong đạo tràng (≤ 2 draw call / người như `render3d.js` hiện làm).
- [ ] Có trạng thái «đang xây» (giàn tre) và «đã xong».
- [ ] Đọc được bằng trình đọc màn hình: tên công trình + công năng (trợ năng, bản sơ đồ §12).
- [ ] Không dùng tượng thánh làm vật trang trí mua bán (bản sơ đồ §14); tượng/thánh vị trong Chính Đường là **cố định theo tông**, không nằm trong cửa hàng.

---

## 1.9 Kho đạo tràng

### 1.9.1 Trong kho có gì

| Loại | Nguồn | Dùng | Ghi chú |
|---|---|---|---|
| **Phúc Khí** | thành viên góp | lễ phí công trường đặc biệt, mua vật tư lễ từ NPC, dự án hồi hướng | trần góp: 200 / người / ngày, 800 / người / tuần |
| **Vật liệu** (8 loại) | hoạt động hái/gom ở các vùng (tài liệu 09 cấp `ACT-*`), thưởng việc tuần, thưởng lễ | xây dựng | không mua được bằng Ngọc |
| **Hương Hỏa** | sinh ra từ lễ (§1.11) | điều kiện để làm lễ lớn (lễ tháng, lễ tết) | **không chuyển được**, không mua được, không rút được |
| **Đồ bày** | phần thưởng sự kiện `EV-*` cấp cho chi đường | trang trí đạo tràng | gắn với chi đường |

**Ngọc không bao giờ vào kho.** Kho cũng không chứa vật phẩm Tàng Y Các. Vì vậy kho chi đường **không có giá trị quy đổi ra tiền thật** — gốc rễ chống RMT ở cấp nhóm (Phần 05 §5.1).

### 1.9.2 Tám loại vật liệu

| Mã | Vật liệu | Nguồn chính (vùng) | Ghi chú tôn trọng |
|---|---|---|---|
| `go` | Gỗ (gỗ lim, gỗ thông đổ) | Thư Lâu Lâm, Võ Đang | chỉ «gỗ đổ do bão» / «gỗ trồng lại» — game nhắc trồng cây bù (việc thiện nhỏ) |
| `da` | Đá xanh | Tử Bình Phong, Long Hổ | — |
| `ngoi` | Ngói men | lò gốm Huyền Thành | — |
| `son` | Sơn ta | Miêu Cương (Y Lư), Huyền Thành | — |
| `giay` | Giấy dó | Văn Miếu, Bút Tháp | — |
| `muc` | Mực tàu | Văn Miếu, Thư Lâu | — |
| `dong` | Đồng (đúc chuông, đỉnh) | Mao Sơn, Huyền Thành | — |
| `tram` | Trầm hương | Yên Tử, Bút Tháp | **chỉ trầm «tự rụng / trồng»**, không khai thác dó bầu rừng — đúng tinh thần bảo tồn |

### 1.9.3 Chi tiêu và hạn mức

| Vai | Hạn mức chi không cần nghị sự |
|---|---|
| Tri Khố | ≤ 300 Phúc Khí và ≤ 100 đơn vị vật liệu / ngày, chỉ cho mục đích trong danh sách (vật tư lễ, công trường đã thông qua) |
| Phó Trì | ≤ 600 Phúc Khí / ngày |
| Chủ Trì | ≤ 1.000 Phúc Khí / ngày |
| Vượt mức | `NS-03` |

**Mục đích chi hợp lệ** (danh sách đóng): vật tư lễ (nến, hương liệu game, hoa — mua từ NPC), công trường đã thông qua, dự án hồi hướng (`NS-04`), phí ghi danh Hội Thiện / Luận Đạo Hội, «bố thí» cho NPC trong thánh địa (một việc thiện tập thể, mỗi tuần tối đa 1 lần, cộng Đạo Vọng). **Không có mục đích «chuyển cho thành viên».**

### 1.9.4 Sổ kho minh bạch

- Mọi giao dịch kho ghi vào **Sổ Kho** bất biến (append-only, Phần 12): thời gian, người, loại, số lượng, mục đích, mã nghị sự (nếu có).
- R1 trở lên xem được toàn bộ Sổ Kho. R0 xem tổng.
- Mỗi tuần Thư Ký có thể xuất «Bảng tổng kết tuần» (tự sinh) lên bảng tin.

---

## 1.10 Đạo Vọng và công đức chung

### 1.10.1 Hai đại lượng tách bạch

| | **Đạo Vọng** (道望) của chi đường | **Sổ Công Quá** của cá nhân |
|---|---|---|
| Thuộc về | chi đường | từng người (canon §6) |
| Tăng nhờ | việc tập thể (lễ, việc tuần, công trường, hồi hướng, Hội Thiện) | việc thiện của chính người đó (`CONG_QUA`) |
| Chuyển được | không | không |
| Dùng để | mở bậc đạo tràng, mở lễ lớn, xếp hạng Đạo Vọng (Phần 07) | mốc Liễu Phàm, cảnh giới, Thiên Bảng (tài liệu 05) |
| Giảm | không bao giờ | chỉ khi người chơi **tự chọn** việc ác (canon §5.3) |

**Quy tắc vàng:** công đức cá nhân **chỉ** ghi cho người **thật sự làm** việc. Chi đường làm lễ phóng sinh: người có mặt và làm thao tác thả cá thì ghi «Phóng sinh» cho chính mình; người không có mặt không được gì, kể cả Chủ Trì. Không có «công đức chia đều».

### 1.10.2 Công thức Đạo Vọng

| Nguồn | Đạo Vọng | Trần |
|---|---|---|
| Đường lễ hoàn thành (§1.11) | `round((10 + 2 × min(n, 30)) × q × d)` — `n` người dự đủ, `q` chất lượng 0,5–1,2, `d` = 1,1 nếu ngày được trạch nhật chấm tốt | 2 đường lễ / tuần |
| Tông lễ có ≥ 3 thành viên dự | `5 × số thành viên dự` | 1 / tuần |
| Việc tuần (§1.12) | 40 / việc | 3 việc / tuần |
| Công trường hoàn thành | `50 × bậc công trình` | — |
| Hồi hướng (`NS-04`) | 1 Đạo Vọng / 20 Phúc Khí hoặc / 10 vật liệu góp ra công cộng | 300 / tuần |
| Bố thí NPC tập thể | 20 | 1 / tuần |
| Hội Thiện, Luận Đạo Hội, Đàn Tràng Liên Tông (§1.13) | theo sự kiện (Phần 08) | — |

Ước lượng: chi đường 20 người hoạt động vừa phải đạt khoảng 2 × 66 + 60 + 120 + 100 ≈ **410 Đạo Vọng / tuần** → bậc 2 sau ~1 tuần, bậc 4 sau ~5 tuần, bậc 6 sau ~18 tuần (gần nửa mùa). Một chi đường 8 người chơi nhẹ đạt bậc 6 trong khoảng một mùa. Không có cách mua nhanh.

### 1.10.3 Âm chất của chi đường

Khi chi đường **hồi hướng** ra ngoài (góp kho cho đường sá, Thiên Mệnh Bàn, bố thí), ngoài Đạo Vọng còn tích một số **Âm Chất** (陰騭) **không hiện trên bảng xếp hạng nào**. Âm Chất chỉ thể hiện bằng:

- ánh đèn lồng ấm hơn ở cổng đạo tràng (3 mức);
- một câu NPC chưởng giáo nói khi thành viên đi ngang: «Đường của con làm việc không cần ai biết. Thầy biết.»

Đây là cách game dạy ý của Liễu Phàm và `CONG_QUA › «Làm thiện ẩn (âm chất)» +2`: việc tốt không khoe vẫn có giá trị, và giá trị đó không biến thành điểm để so.

---

## 1.11 Lễ tuần

### 1.11.1 Hai loại lễ

| | **Tông lễ** | **Đường lễ** |
|---|---|---|
| Ở đâu | chính điện thánh địa (công trình tài liệu 07) | Chính Đường / Giảng Đường của đạo tràng |
| Chủ trì | NPC chưởng giáo | Chủ Lễ (người chơi) |
| Ai dự | mọi người của tông (chính tông + kiêm tu) và khách | thành viên + khách được mời |
| Lịch | cố định: **Chủ nhật giờ Tuất (19:00–21:00, giờ Việt Nam)**; suất phụ **thứ Bảy giờ Thìn (07:00–09:00)** cho người ở múi giờ khác | Chủ Lễ đặt, tối đa 2 / tuần tính thưởng |
| Quy mô | 1 phòng lễ ≤ 60 người (một TownShard), tự mở thêm «gian phụ» khi đông | ≤ 30 |
| Mã | `GUILD-RITE-<tông>-01` (Phần 02) | `GUILD-RITE-<tông>-02…` |

Bản sơ đồ §9.2 nói «lễ cuối tuần ở thánh địa (giờ cố định theo can chi ngày)». Cách hiểu thực thi: giờ lễ cố định theo **giờ địa chi** (Tuất, Thìn), và **can chi của ngày** quyết định biến thể lễ (§1.11.3). Ngày dương lịch cố định (thứ Bảy/Chủ nhật) để người chơi đi làm, đi học vẫn sắp xếp được.

### 1.11.2 Bốn pha của một lễ

| Pha | Thời lượng | Việc người chơi làm | Mini-game (tài liệu 09 cấp `MG-*`) |
|---|---|---|---|
| **Tụ** (tập hợp) | 3 phút | tới đúng chỗ, đứng/ngồi vào vị trí (vòng sáng trên nền) | — |
| **Tịnh** (tĩnh tâm) | 2 phút | thở theo nhịp chung (vòng tròn co giãn); ai thả tay sớm không bị loại, chỉ mất điểm chất lượng | tĩnh tọa nhịp thở |
| **Hành** (phần chính) | 6–10 phút | khác nhau theo tông: kết phù, tụng theo nhịp, khoa nghi, niệm danh, mạn-đà-la cát, đọc văn tế… | theo tông (Phần 02) |
| **Hồi hướng** | 1 phút | chọn hồi hướng: về đường (Đạo Vọng) / ra công cộng (dự án đang mở) / cho «chúng sinh» (Âm Chất) | — |

**Chất lượng `q`** = trung bình điểm pha Tịnh và Hành của những người dự đủ, chuẩn hóa về 0,5–1,2. Người đến muộn (sau pha Tụ) vẫn tham gia được, không tính vào `n` nhưng vẫn nhận thưởng cá nhân × 0,5.

### 1.11.3 Biến thể theo can chi ngày

Ngày làm lễ có **can ngày** (tính bằng `lunar-javascript › getDayGan`, như `stations.js` đang dùng `Solar.fromYmdHms(...).getLunar()`). Hành của can ngày:

| Quan hệ hành can ngày với **hành chủ của tông** (Phần 02) | Biến thể |
|---|---|
| cùng hành (tỷ hòa) | **Lễ vượng**: thêm một vòng Hành, Hương Hỏa × 1,2 |
| sinh hành tông | **Lễ thuận**: pha Tịnh dễ hơn (vòng thở chậm) |
| hành tông sinh nó | **Lễ hao**: thêm việc «bố thí» nhỏ cuối lễ |
| khắc hành tông | **Lễ nghịch**: Hành khó hơn, nhưng `q` tối đa 1,3 thay vì 1,2 |
| hành tông khắc nó | **Lễ chế**: không đổi |

Mục đích: mỗi tuần lễ khác nhau một chút; người chơi học quan hệ sinh khắc trong thực tế. **Không** có tuần nào «xấu đến mức không nên làm lễ».

### 1.11.4 Thưởng lễ

| Ai | Thưởng (đề xuất — tài liệu 09/11 chốt con số Đạo Hạnh/Phúc Khí) |
|---|---|
| Người dự đủ 4 pha | Đạo Hạnh nhỏ (đề xuất 6–10 / lễ), Phúc Khí 20–40, 1 vật liệu ngẫu nhiên của tông |
| Người giữ vai (Chủ Lễ, Kinh sư, Hương Đăng) | +20% thưởng cá nhân |
| Chi đường | Đạo Vọng (§1.10.2), Hương Hỏa `= n × q × 3` |
| Khách (không thuộc chi đường) | Phúc Khí × 0,5, không Đạo Hạnh từ đường lễ (Đạo Hạnh chỉ từ tông lễ của tông mình tu) |

**Trần Đạo Hạnh từ lễ:** tổng Đạo Hạnh mọi lễ (tông + đường) ≤ **40 / tuần** / người. Lễ là sinh hoạt, không phải nguồn tu chính (nguồn chính là chuỗi `CQ-*`, tĩnh tọa, Mệnh Đồ — tài liệu 05/09). Trần này giữ cho người không vào chi đường không bị bỏ lại.

### 1.11.5 Lỡ lễ

Không có hình phạt lỡ lễ. Người lỡ có thể xem **«Ký sự lễ»** (một trang tóm tắt: ai dự, chất lượng, hồi hướng đi đâu) và làm **«Lễ bù một mình»** trong Chính Đường (rút gọn, chỉ pha Tịnh + Hành, thưởng × 0,3, không cộng Đạo Vọng). Lễ bù có tác dụng giữ thói quen, không để người chơi cảm thấy bị «rớt lại».

---

## 1.12 Việc tuần nội bộ

- Thứ Hai 05:00 (giờ Mão) mỗi tuần, chi đường nhận **5 việc đề xuất** rút từ kho việc của tông (Phần 02, `GUILD-Q-<tông>-01…10`). Chủ Trì hoặc Chủ Lễ **chọn 3**. Không chọn trong 24 giờ → hệ thống chọn 3 việc đầu.
- Mỗi việc có **thanh tiến độ chung**; mỗi thành viên góp phần bằng hành động thật trong thế giới (đi bộ, giải án, hái thuốc, tĩnh tọa, đọc trang thư…).
- Trần đóng góp một người cho một việc: **40%** tiến độ (để việc tuần là việc chung, không phải việc một người cày).
- Hoàn thành: +40 Đạo Vọng cho chi đường; mọi người đóng góp ≥ 5% nhận một vật liệu và **Phúc Khí theo tỷ lệ đóng góp**, trần 60 / việc.
- Việc tuần **không** cấp Đạo Hạnh trực tiếp (tránh nhân đôi nguồn tu), chỉ gián tiếp vì hành động bên trong (vd tĩnh tọa) đã cấp theo luật của chính hành động đó.

Ví dụ khung (đầy đủ ở Phần 02):

| Mã | Tên | Hành động đếm | Mục tiêu (chi đường 20 người) |
|---|---|---|---|
| `GUILD-Q-TC-03` | Vân thủy | tổng quãng đường đi bộ (không bay, không ngự kiếm) giữa các vùng | 60 km |
| `GUILD-Q-NH-02` | Văn hội đọc sách | số «trang đọc» Tàng Thư Các | 80 trang |
| `GUILD-Q-TD-01` | Phóng sinh ở hồ | số lần thả cá/chim đúng quy trình | 50 lần |

Mục tiêu tự co giãn: `mục tiêu = cơ_sở × clamp(số thành viên hoạt động / 20, 0,5, 1,5)`.

---

## 1.13 Quan hệ giữa các chi đường và giữa các tông

> **Không có chiến tranh môn phái.** Không PvP, không chiếm đất, không cướp kho, không «diệt môn». Game là văn tu (canon T3). Mọi quan hệ liên nhóm là **hợp tác** hoặc **thi đua có lợi cho cả hai bên**.

### 1.13.1 Giao hảo (結好)

- Hai chi đường (cùng tông hay khác tông) ký **giao hảo** qua `NS-09` ở cả hai bên.
- Tối đa **5** giao hảo / chi đường.
- Quyền lợi: thành viên hai bên vào đạo tràng của nhau như khách quen (không cần mời từng lần); dự đường lễ của nhau nhận thưởng khách × 1,0 thay vì × 0,5 (vẫn không Đạo Hạnh); cổng của chi đường giao hảo luôn hiện trong 12 cổng ở Phường Đạo Tràng.
- Không có «liên minh quân sự» — vì không có chiến tranh.
- Thôi giao hảo: một bên `NS-09` là đủ; thông báo lịch sự cho bên kia.

### 1.13.2 Hội Thiện (會善) — thi đua làm việc công

- Mỗi tháng âm, vào mùng 1, máy chủ mở **3 dự án công** (sửa cầu đường `EV-CAU-*`, dọn đường hành hương, dựng trạm nghỉ — Phần 08).
- Chi đường ghi danh (`NS-13`), có thể **ghép nhóm** với tối đa 3 chi đường khác (ưu tiên khác tông).
- Điểm Hội Thiện của nhóm = phần dự án nhóm hoàn thành. **Mọi chi đường trong nhóm nhận cùng một điểm** (chia điểm không chia nhỏ).
- Thưởng theo **ngưỡng**, không theo thứ hạng: ≥ 30% một dự án → biển gỗ «Hội Thiện» treo ở cổng; ≥ 100% → tên chi đường khắc lên bia ở công trình công cộng vừa sửa; ≥ 2 dự án → đồ bày đặc biệt cho đạo tràng.
- Có **Bảng Hội Thiện** (Phần 07) nhưng xếp theo **số chi đường đã cùng làm** và **số dự án hoàn thành**, không theo tổng điểm thô → chi đường nhỏ biết hợp tác vẫn đứng cao.

### 1.13.3 Luận Đạo Hội (論道會) — đối chiếu trường phái

Biến «Đối chiếu trường phái» trong kế hoạch MMO §B2 thành sự kiện liên tông:

- Mỗi hai tuần, Lầu Danh Bộ các thánh địa mở **Luận Đạo Hội** giữa **hai tông** khác nhau (luân phiên theo lịch).
- Mỗi tông cử **một đội 3–5 người** (tình nguyện, ưu tiên các chi đường đã ghi danh `NS-13`).
- Đề tài: một **chiều so sánh** trong `schools-data › COMPARE_DIMS` (`founder`, `era`, `seat`, `canon`, `coreMethod`, `deity`, `ordination`, `monastic`, `region`) hoặc một **lá số khách** (từ `cases.js`) được hai tông luận theo cách riêng.
- Đội chơi bằng **thẻ luận điểm** soạn sẵn từ `schools-data › SCHOOLS[...]` và `compareMatrix(schoolIds)`. Mỗi thẻ đúng dữ kiện (khớp dữ liệu app) thì được giữ; thẻ sai dữ kiện bị trọng tài NPC (Tế tửu Văn Miếu) bác **kèm lời giải thích**.
- Khán giả (mọi người trong phòng) **bỏ phiếu** cho đội «nói rõ nhất», không phải «đúng nhất» — vì cả hai tông đều đúng theo truyền thống mình.
- Kết quả: cả hai đội nhận Đạo Vọng như nhau; đội được nhiều phiếu nhận thêm **cờ hiệu** (đồ bày) — không hơn.
- Câu khép của trọng tài (cố định): «Hai nhà nói hai cách, cùng chỉ một mặt trăng. Mỗi nhà về đọc thêm sách nhà kia.»

### 1.13.4 Đàn Tràng Liên Tông (聯宗壇場)

- Một đường lễ do **2–4 chi đường thuộc các tông khác nhau** cùng tổ chức ở Khách Đường (bậc 5) của chi đường chủ.
- Mỗi tông đảm nhiệm một **đoạn** của pha Hành theo cách tông mình (vd Chính Nhất dâng sớ, Thiền tọa, Nho đọc văn).
- Thưởng: Đạo Vọng × (1 + 0,15 × (số tông − 1)); mỗi người dự được tính **một lần «dự lễ tông khác»** vào điều kiện Quy nhất của tài liệu 05 (nếu tài liệu 05 dùng điều kiện này).
- Tinh thần: dạy rằng các đạo khác nhau có thể đứng chung một sân — điều Côn Lôn (Quy nhất) hướng tới.

### 1.13.5 Quan hệ tông với tông

Tông môn do NPC dẫn nên quan hệ tông – tông là **lời thoại và sự kiện cốt truyện** (tài liệu 03), không phải chỉ số. Tài liệu này chỉ ràng buộc:

- không NPC chưởng giáo nào nói xấu tông khác;
- khi người chơi kiêm tu, chưởng giáo hai bên đều có lời khuyến khích;
- `khong_tiensinh` (phản đề) và `dinh_menh_hoi` (phản diện) có thể chế nhạo việc người chơi «tu nhiều đạo» — đó là lời của phản diện, để người chơi tự thấy cái sai.

---

## 1.14 Chống lạm dụng

| # | Hành vi | Biện pháp |
|---|---|---|
| 1 | Lập chi đường bằng tài khoản ảo (đồng khởi giả) | danh tính bền bắt buộc cho người khởi lập (Phần 12 §12.2); đồng khởi phải có tuổi tài khoản ≥ 7 ngày và cảnh giới 2 (≈ vài giờ chơi thật); tín hiệu thiết bị trùng → đồng khởi không tính |
| 2 | Gom tài sản về một người qua kho | kho không có lệnh chi cho cá nhân (§1.9.3); giải tán đổ kho ra công cộng (§1.7.6) |
| 3 | Đuổi người vừa góp xong | đóng góp không gắn với quyền rút; «Công lao bạ» đi theo người (§1.5.5); R2+ chỉ đuổi qua nghị sự 2/3 |
| 4 | Chủ Trì «độc tài» (đuổi hàng loạt, đổi luật) | đuổi R0–R1 tối đa 2/ngày; R2+ qua nghị sự; mọi hành động ghi Sổ Đường (ai, lúc nào); bất tín nhiệm (§1.7.4) |
| 5 | Nhồi phiếu bằng tài khoản ảo | chỉ R2 (≥ 28 ngày, ≥ 4 lễ) được bỏ phiếu; tài khoản cùng thiết bị chỉ một phiếu |
| 6 | Bắt nạt trong nhóm nhỏ | phiếu kín; người bị nêu tên có lời trình; nút khiếu nại → hàng chờ kiểm duyệt (Phần 05 §5.5); chặn/ẩn vẫn hoạt động trong đạo tràng |
| 7 | Nhảy chi đường liên tục để ăn thưởng lần đầu | thưởng «lần đầu dự đường lễ» chỉ một lần mỗi người; chờ 72 giờ khi tự rời |
| 8 | Bot vác vật liệu ở công trường | 40 lượt/ngày; kiểm quãng đi bộ thật giữa Khố Phòng và công trường (máy chủ so vị trí `mv` gửi tới SectHall); tốc độ vác tối thiểu 4 giây/lượt |
| 9 | Treo máy ở lễ để nhận thưởng | pha Tịnh/Hành cần thao tác; không thao tác → không tính «dự đủ» |
| 10 | Tên chi đường gây hiểu lầm (giả tổ chức thật) | tên ghép từ danh sách + danh sách đen tổ hợp (§1.5.2) |
| 11 | Chi đường mạo nhận «chính thống» tôn giáo thật | mô tả chi đường không có văn bản tự do; giao diện ghi rõ «chi đường do người chơi lập, không đại diện tổ chức tôn giáo nào» |
| 12 | Dồn người dưới 16 tuổi vào nhóm người lớn lạ | chi đường có thành viên < 16 tuổi: tự bật «chế độ an toàn» (Phần 05 §5.6): không lời mời đến người lạ, giới hạn quyền nhắn mẫu riêng |
| 13 | Spam lời mời | Tri Khách tối đa 20 lời mời/ngày; người nhận chặn lời mời từ một chi đường được |
| 14 | Lừa người khác góp Phúc Khí («góp để được lên Trưởng Lão») | cấp R4+ chỉ qua nghị sự; góp không cho quyền; giao diện góp có câu cố định «Góp là cho đường, không mua được chức» |
| 15 | Chiếm tên đẹp rồi bỏ | tên chỉ giữ khi chi đường hoạt động; hưu đường giải phóng tên sau 30 ngày |
| 16 | Nghị sự giả để rút kho | mục đích chi là danh sách đóng; rút ra công cộng thì không ai hưởng riêng |
| 17 | Một người ôm nhiều vai trong nhiều chi đường bằng nhiều tài khoản | không ngăn được tuyệt đối; giảm động cơ: không có lợi ích vật chất chuyển được giữa các chi đường |
| 18 | Ép thành viên online giờ cố định | không phạt lỡ lễ (§1.11.5); có suất lễ phụ |
| 19 | Dùng chi đường để chào mời dịch vụ bói tiền thật ngoài game | không văn bản tự do, không liên kết ngoài; Định Mệnh Hội trong truyện dạy người chơi nhận ra lừa đảo tâm linh |
| 20 | Nhóm hai chi đường «thông đồng» để cày Hội Thiện | điểm theo dự án thật hoàn thành; mỗi dự án có tổng công cố định; thông đồng chỉ làm dự án xong nhanh hơn — đó là điều tốt |

---

## 1.15 Bảng số cân bằng tổng (để tài liệu 09/11/13 tra)

| Tham số | Giá trị | Ở đâu |
|---|---|---|
| Thành viên chi đường tối đa | 12 → 30 theo bậc | §1.5.3 |
| Lệ phí lập | 2.000 Phúc Khí (tiêu hủy) | §1.5.1 |
| Đồng khởi | 5 người, 72 giờ | §1.5.1 |
| Ký Danh | 7 ngày | §1.5.4 |
| Chờ sau tự rời | 72 giờ | §1.5.5 |
| Chức sự R3 | ≤ 6 | §1.6 |
| Trưởng Lão | ≤ 3 | §1.6 |
| Phó Trì | ≤ 2 | §1.6 |
| Túc số nghị sự | 40% cử tri hoạt động | §1.7.2 |
| Nghị sự mở cùng lúc | ≤ 5 | §1.7.2 |
| Vắng → đại trì → chuyển giao | 14 / 21 ngày | §1.7.5 |
| Ngủ → hưu đường | 30 / 75 ngày | §1.7.6 |
| Đạo Vọng mở bậc 2–6 | 300 / 900 / 2.000 / 4.000 / 7.500 | §1.8.3 |
| Lượt vác / người / ngày | 40 | §1.8.4 |
| Góp Phúc Khí vào kho | 200 / ngày, 800 / tuần | §1.9.1 |
| Đạo Hạnh từ lễ | ≤ 40 / tuần | §1.11.4 |
| Đường lễ tính thưởng | 2 / tuần | §1.10.2 |
| Việc tuần | 3 / tuần, ≤ 40% / người | §1.12 |
| Giao hảo | ≤ 5 | §1.13.1 |
| Nhóm Hội Thiện | ≤ 4 chi đường | §1.13.2 |

---

## 1.16 Checklist nghiệm thu Phần 01

- [ ] 9 tông có dữ liệu trong `guild-data.js` **(chưa có — cần làm)**; `GUILD-MT` tắt mặc định; `GUILD-BM` không mở.
- [ ] Nhập tông kiểm đủ điều kiện §1.3.1; không có điều kiện về Phẩm căn/Mệnh Cấp (test: lá số điểm < 28 nhập tông được).
- [ ] Đạo hiệu chỉ ghép từ danh sách; `naming.js › analyzeName` chạy trên máy, không gửi ngày sinh.
- [ ] Tên chi đường: test 1.600 tổ hợp × 9 loại không trùng; danh sách đen chặn đúng.
- [ ] Ma trận quyền §1.6.4 có test đơn vị cho từng ô (Phần 12 §12.9).
- [ ] Nghị sự: túc số, đa số, 2/3, phiếu kín, sửa phiếu, hết hạn — mỗi luật một test.
- [ ] Kho: không tồn tại đường mã nào chuyển tài sản kho vào ví cá nhân (test tĩnh: rà mọi `op` của Sổ Kho).
- [ ] Đạo tràng: mỗi bậc đi bộ từ cổng tới mọi cửa không kẹt; 30 người cùng lúc ≥ 30 fps trên iPhone 12.
- [ ] Lễ: 4 pha, biến thể can chi ngày đúng bảng §1.11.3 cho 10 ngày mẫu; trần Đạo Hạnh 40/tuần.
- [ ] Luận Đạo Hội: mọi thẻ luận điểm truy ngược được tới trường trong `schools-data`.
- [ ] Không có tính năng PvP, chiếm đất, cướp kho ở bất kỳ màn hình nào.
