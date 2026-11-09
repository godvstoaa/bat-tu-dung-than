# 05-08 · Toàn Chân / Linh Bảo (Chung Nam) · Thượng Thanh / Lư Sơn (Mao Sơn)

> Theo luật chung 05-06. Mã nhiệm vụ: `CQ-TC-xx`, `CQ-TT-xx`.
> Đạo Thượng Thanh · Lư Sơn chạm nội dung **âm tà**. Mọi nút dùng `amta-data` (loại hồn, chỉ báo lá số, nghi thức trừ tà) chỉ mở khi người chơi **tự bật** mục Âm tà (`ETHICS.optInRequired = true`). Người chơi không bật vẫn tu trọn đạo bằng **nhánh đời thực** (ghi ở từng nhiệm vụ).

---

# PHẦN A — TOÀN CHÂN 全真 · LINH BẢO 灵宝

## A.1 Tổng quan

| Hạng mục | Nội dung |
|---|---|
| Phái (app) | `quanzhen` — tổ 王重陽 (Kim, 1113–1170); kinh 《重陽立教十五論》, tam giáo hợp nhất; «nội đan + xuất gia + tam giáo hợp nhất; sớm tối công khóa là mặt trận thần chú». `lingbao` — «khoa nghi phái», 《灵宝度人经》 cốt lõi |
| Thánh địa | `chungnam` — Chung Nam Toàn Chân (1400, −1300); nguyên mẫu Bạch Vân Quán, Trùng Dương Cung |
| NPC dẫn | Khâu đạo trưởng (`khau_daotruong`) — «bần đạo – đạo hữu», nghiêm; giới luật, khoa nghi, Đạo Tạng; công cụ AI: tra `daozang` |
| Hành của đạo | chính **Thổ**, phụ **Kim** |
| Tu Bổ | Định Lực · Học đạo |
| Đặc điểm cơ chế | đạo **giới đàn** (xuất gia nghiêm trong app) → thang hạng là giới; **vân du** là cơ chế riêng |

## A.2 Thang hạng — giới đàn

Theo `quanzhen.ordination`: «Truyền độ (quy y / thụ giới) + tam đàn đại giới — xuất gia nghiêm». Ba đàn giới thật của Toàn Chân là 初真戒 (Sơ Chân), 中極戒 (Trung Cực), 天仙大戒 (Thiên Tiên); trước đó là **quải đơn** (挂单, khách tạm trú) và **quan cân** (冠巾, lễ đội khăn nhập đạo).

| Hạng | Tên hạng | Ý nghĩa trong game | Điều kiện riêng |
|---|---|---|---|
| I | **Quải Đơn** 挂单 | ở trọ đạo quán, theo công khóa | `CQ-TC-01` |
| II | **Quan Cân** 冠巾 | lễ đội khăn — chính thức đạo đồ của quán | 7 ngày công khóa sớm tối |
| III | **Sơ Chân Giới** 初真戒 | đàn giới thứ nhất | vân du 5 thánh địa |
| IV | **Trung Cực Giới** 中極戒 | đàn giới thứ hai | chủ một khoa nghi; dạy 1 quải đơn |
| V | **Thiên Tiên Đại Giới** 天仙大戒 | đàn giới thứ ba — viên mãn | truyền giới |

**Không xuất gia thật:** trong game, «thụ giới» là nhận **giới trong game** (luật chơi). Không có thoại nào khuyên người chơi bỏ gia đình, bỏ việc. Khâu đạo trưởng nói ngay khi nhập môn: «Ở đây đạo hữu giữ giới của quán. Ra khỏi Huyền Giới thì giữ cái tâm, còn giới của đời thì đời đã có.»

## A.3 Giới

| Loại | Giới | Mở | Thẻ giới hiện khi | Phạm khi |
|---|---|---|---|---|
| Thường trực 1 | **Chay và không rượu** | I | gọi món mặn; gọi chén rượu (kể cả chén 1) | gọi |
| Thường trực 2 | **Không vọng ngữ** — mọi câu có thẻ `vong` (kể cả dối nhỏ) | III | phương án `vong` | chọn |
| Thường trực 3 | **Không tranh lợi** — không tham gia sự kiện cược, đấu giá Phúc Khí | IV | vào sàn cược / đấu giá | đặt cược |
| Đạo tràng | quá đường (trai đường) im lặng | I | gõ chat trong trai đường | gõ (không phạt Đạo Hạnh, chỉ hết phiên quá đường) |
| Đạo tràng | ngủ lại quán thì dự công khóa sớm | I | đăng xuất trong phòng quải đơn rồi vào lại sáng hôm sau mà bỏ công khóa | — (không tính phạm; chỉ mất chuỗi ngày) |

## A.4 Hoạt động lõi

### A.4.1 Công khóa sớm tối (`B = 10` / phiên)

- **Nguồn:** «sớm tối công khóa (八大神咒)» (`quanzhen.coreMethod`); tám thần chú có trong `talisman-data`: 净心神咒 (Tịnh Tâm), 净口神咒 (Tịnh Khẩu), 净身神咒 (Tịnh Thân), 安土地神咒 (An Thổ Địa), 净天地神咒 (Tịnh Thiên Địa), 祝香神咒 (Chúc Hương), 金光神咒 (Kim Quang), 玄蕴咒 (Huyền Uẩn — khai kinh).
- **Mini-game:** tám đoạn tụng nối nhau, mỗi đoạn một nhịp mõ khác; giữa các đoạn là một động tác (chắp tay, thắp hương, rảy nước — hoạt ảnh). Âm tiết hư cấu; tên chú hiện ở góc. Sớm (giờ Mão–Thìn) và tối (giờ Dậu–Tuất) giờ máy chủ.
- Đủ sớm + tối trong ngày: DEED-180 (+1 công).

### A.4.2 Đọc Đạo Tạng (`B = 10` / quyển)

- **Nguồn:** `DAOZANG` (bản chưng cất ~1.527 mục; mỗi mục có `name_han`, `name_vi`, `bu`, `author`, `era`, `topic`, `meaning`, `han_text`, `sources`, `textual_certainty`).
- **Thư khố Chung Nam** xếp kệ theo **bộ** (`bu`): 洞真, 洞玄, 洞神, 太玄, 太平, 太清, 正一, 续道藏, 藏外… (đếm bằng `daozangByBu`). Mỗi lần đọc: một thẻ quyển (tên, bộ, tác giả, thời đại, tinh túy, một câu chữ Hán ≤ 15 chữ, độ chắc chắn văn bản).
- **Gợi ý cá nhân:** sau khi engine sửa lỗi `yong.god` → `yong.primary`, kệ «Hợp Dụng» hiện 3 quyển của `suggestDaozangChartAware(R)`. Trước khi sửa: kệ này dùng từ khóa `_YONG2CULT[yong.primary].kw` tự lọc trong game.
- Mỗi quyển chỉ cho thưởng lần đầu (DEED-185).

### A.4.3 Khoa nghi Linh Bảo (`B = 14` / khoa)

- **Nguồn:** `lingbao.coreMethod` «khoa nghi đại sư — 斋醮 (pháp sự cứu tế, độ vong, tạ thần) hệ thống hóa»; 《灵宝度人经》.
- **Mini-game tổ đội (2–6 người):** mỗi người một vai — **cao công** (dẫn lễ), **đô giảng** (giữ nhịp), **giám trai** (giữ trật tự đàn), **thị hương**, **thị đăng**, **thị kinh**. Vai đổi theo hạng (cao công cần hạng IV). Mỗi vai có nhịp riêng; khoa thành khi tổng đồng bộ ≥ 70%.
- Không đủ người: NPC đạo sĩ quán điền vai.
- Khoa nghi luôn có **mục đích cụ thể** trong thế giới: tạ ơn sau sửa cầu, cầu an sau lũ, độ vong ở Phong Đô (phối hợp đạo BD). Không có khoa «cầu tài».

### A.4.4 Vân du (cơ chế riêng)

`quanzhen` coi trọng **vân thủy du phương** (đi khắp nơi, ở trọ các quán). Trong game:

- Người chơi đặt «Vân du lệnh» ở Chung Nam, chọn 5 thánh địa.
- Đi **bộ** hoặc đò (không ngự kiếm) giữa các điểm; ở mỗi điểm: quải đơn một đêm (đăng xuất trong phòng khách của thánh địa hoặc nghỉ 10 phút trong phòng), dự một hoạt động lõi của đạo nơi đó.
- Hoàn tất trong 10 ngày thật: `B = 60` + mảnh «Vân Thủy» (gom 3 → áo choàng vân du thẩm mỹ).

## A.5 Chuỗi nhiệm vụ Toàn Chân · Linh Bảo

| Mã | Tên | Mục tiêu | Mở | Dạy | Thưởng |
|---|---|---|---|---|---|
| CQ-TC-01 | Quải đơn | tới Trùng Dương Cung; xin quải đơn ở khách đường (hội thoại thủ tục: chắp tay, xưng tên đạo hiệu nếu có); nghe 9 chiều của `quanzhen` và `lingbao`; nhận giới 1 | đến `chungnam` | `SCHOOLS.quanzhen`, `lingbao` | B 30; hạng I |
| CQ-TC-02 | Mười lăm luận | đọc 15 thẻ «Trùng Dương lập giáo thập ngũ luận» (bản tóm ý của game, ghi nguồn `quanzhen.canon`); ghép 5 luận với 5 việc trong quán (ở trọ, học kinh, làm nhà cỏ, tọa thiền, giao bạn đạo) | I | `quanzhen.canon` | B 25 |
| CQ-TC-03 | Tám thần chú | học tên và ý nghĩa 8 thần chú công khóa (thẻ `talisman-data`); dự công khóa sớm đầu tiên | I | `ZHOU_JING_XIN` … `ZHOU_XUANYUN` (tên, `meaning`) | B 25 |
| CQ-TC-04 | Thanh tĩnh | tụng Thanh Tĩnh Kinh; đọc thẻ giải nghĩa «人能常清靜，天地悉皆歸» và chuỗi tâm tịnh → thần cư → khí tụ → tinh sinh | I | `DAO_JIA[0]`, `DAN_QINGJING_JING` | B 25 |
| CQ-TC-05 | Quá đường | dùng bữa ở trai đường theo nghi (im lặng, chờ chuông, không bỏ thừa); 7 ngày công khóa | I | giới chay (`quanzhen.monastic`) | B 30; lễ **II · Quan Cân** (đội khăn — hoạt ảnh búi tóc, tóc dài mọi kiểu nhân vật) |
| CQ-TC-06 | Tam giáo một nhà | đi Văn Miếu và Yên Tử, mỗi nơi xin một câu dạy; về quán nói với Khâu đạo trưởng chỗ giống nhau | II | `quanzhen.canon` «tam giáo hợp nhất (đạo / 儒 / 佛)» | B 35 |
| CQ-TC-07 | Ba động bốn phụ | tìm mỗi bộ một quyển ở thư khố: 洞真, 洞玄, 洞神 (tam động) và 太玄, 太平, 太清, 正一 (tứ phụ) — 7 quyển | II | `DAOZANG.bu`, `daozangByBu` | B 35 |
| CQ-TC-08 | Nội quan | đọc thẻ Nội Quan Kinh; một phiên tĩnh tọa «nội quan» (tạp niệm được gọi tên khi bay qua) | II | `DAN_NEIGUAN_JING` («心者，一身之主») | B 30 |
| CQ-TC-09 | Vân du | hoàn tất một Vân du lệnh 5 thánh địa | II | `quanzhen.region`; vân thủy | B 60 (đã gồm thưởng vân du) |
| CQ-TC-10 | Đàn Sơ Chân | lễ thụ Sơ Chân giới: chọn ngày (`zheri`), tụng giới văn (âm tiết hư cấu), nhận giới thường trực 2 | II | 初真戒 (tên, ý); `CQ-MD-32` | B 50; hạng **III** |
| CQ-TC-11 | Độ Nhân Kinh | đọc thẻ Độ Nhân Kinh (Linh Bảo); đứng vai thị kinh trong một khoa nghi | III | `lingbao.canon`; DEED-188 | B 40 |
| CQ-TC-12 | Giới văn | đọc thẻ 三洞众戒文 và 三坛圆满天仙大戒 (quyển trong `DAOZANG`); đối chiếu với giới của game: giới nào game có, giới nào game không mô phỏng (và vì sao) | III | `_DZ_FIX` (DZ178; 三坛圆满天仙大戒 — «DZ contested») | B 40 |
| CQ-TC-13 | Khoa nghi cứu tế | làm đô giảng trong khoa cầu an sau lũ ở Cùng Thông Hồ (phối hợp sự kiện máy chủ) | III | `lingbao.coreMethod` «斋醮 cứu tế» | B 40; DEED-072 nếu chở hàng |
| CQ-TC-14 | Dạy công khóa | kèm một quải đơn mới (người chơi hoặc NPC) đủ 7 ngày công khóa | III | (ôn tám thần chú) | B 40; lễ **IV · Trung Cực** |
| CQ-TC-15 | Hiệu đính kinh | ở thư khố có 5 quyển «ghi sai số Đạo Tạng»; dùng bảng hiệu đính (dữ liệu `_DZ_FIX` của app) tìm số đúng; thêm: 3 quyển có «tinh túy chưa chắc» (`_DOWNGRADE`) — đánh dấu độ chắc chắn | IV | `_DZ_FIX`, `_DOWNGRADE`, `textual_certainty` — học cách người làm kinh phân biệt chắc / chưa chắc | B 60 |
| CQ-TC-V | Thiên Tiên Đại Giới | chủ trì (vai cao công) một khoa nghi cho 3 người chơi thụ Sơ Chân; lễ thụ Thiên Tiên đại giới | IV, ĐH-đạo ≥ 1.800 | — | B 100; hạng **V**; danh hiệu «Toàn Chân Đạo Sĩ» |

**Tổng `B` chuỗi:** 30+25+25+25+30+35+35+30+60+50+40+40+40+40+60+100 = **665**.

## A.6 Thi thăng hạng

**Kiểm tri lên II (mẫu):**

1. Tổ Toàn Chân là ai, thời nào? (Đ: Vương Trùng Dương, đời Kim)
2. «Nam Chính Nhất, Bắc …»? (Đ: Toàn Chân — `quanzhen.region`)
3. Thần chú nào đứng đầu công khóa? (Đ: Tịnh Tâm)
4. Linh Bảo nổi tiếng với gì? (Đ: khoa nghi, trai tiếu)
5. Toàn Chân khác Chính Nhất ở chiều «xuất gia / cư sĩ» thế nào? (Đ: Toàn Chân xuất gia nghiêm, Chính Nhất hỏa cư)

**Kiểm hành lên III:** 14 phiên công khóa, 5 quyển Đạo Tạng, 1 vân du trong 30 ngày.
**Kiểm tâm lên IV:** quá đường 7 ngày liền không gõ chat; khoa nghi vai đô giảng đồng bộ ≥ 85%.

## A.7 Kịch bản cảnh

```
[CẢNH CQ-TC-01.1 · Chung Nam, Trùng Dương Cung, khách đường · giờ Thân · tuyết mỏng]
(Khâu đạo trưởng ngồi sau bàn sổ khách, bút lông trong tay.)
KHÂU ĐẠO TRƯỞNG: Đạo hữu xin quải đơn? Tên gì, từ đâu tới, ở mấy đêm?
> Lựa chọn: ① (xưng đạo hiệu) → [.2a]  ② (xưng tên thường) → [.2b]  ③ «Con chưa biết ở mấy đêm.» → [.2c]

[CẢNH CQ-TC-01.2a]
KHÂU ĐẠO TRƯỞNG: (ghi) Đạo hiệu có chữ hợp mệnh. Ai đặt cho? … Văn Miếu à. Tốt, Tế tửu chữ đẹp.
→ [.3]

[CẢNH CQ-TC-01.2b]
KHÂU ĐẠO TRƯỞNG: (ghi) Tên cha mẹ đặt. Ở đây gọi tên ấy cũng được.
→ [.3]

[CẢNH CQ-TC-01.2c]
KHÂU ĐẠO TRƯỞNG: Không biết thì ghi «chưa định». Người vân du đều thế.
→ [.3]

[CẢNH CQ-TC-01.3]
KHÂU ĐẠO TRƯỞNG: Quán có ba điều. Ăn chay, không rượu. Sáng giờ Mão công khóa. Ở trai đường không nói. Giữ được thì ở, không giữ được thì vẫn được ở — nhưng bần đạo sẽ nhắc.
> Lựa chọn: ① «Con giữ.» ② «Nếu con quên?»
KHÂU ĐẠO TRƯỞNG: (với ②) Quên thì sám. Sám rồi thì nhớ. Ai cũng thế cả.
(Giới thường trực 1. Phòng khách đường mở. Hạng I · Quải Đơn.)
```

```
[CẢNH CQ-TC-15.1 · Chung Nam, thư khố · giờ Hợi · đèn dầu]
KHÂU ĐẠO TRƯỞNG: Năm quyển này ghi sai số. Không phải người xưa dối. Người chép qua tay nhiều đời, chữ lệch dần.
KHÂU ĐẠO TRƯỞNG: Đạo hữu xem bảng hiệu đính. Quyển nào chắc thì ghi chắc. Quyển nào chưa chắc thì ghi chưa chắc. Ghi chưa chắc mà đúng còn quý hơn ghi chắc mà sai.
(Mini-game hiệu đính. Khi xong:)
KHÂU ĐẠO TRƯỞNG: Giữ kinh là giữ cái thật. Giữ giới cũng vậy.
```

## A.8 Giới hạn nội dung riêng

| # | Giới hạn |
|---|---|
| TC-G1 | Câu chữ Hán trích từ Đạo Tạng ≤ 15 chữ / thẻ; ưu tiên `key_text` app đã có. |
| TC-G2 | Không thoại nào khuyên xuất gia ngoài đời. |
| TC-G3 | Giới văn chỉ tóm ý; không chép nguyên giới văn. |
| TC-G4 | Khoa nghi không mô tả đủ trình tự thật; vai và nhịp là hư cấu dựa trên tên vai truyền thống. |

---

# PHẦN B — THƯỢNG THANH 上清 (Mao Sơn) · LƯ SƠN 閭山

## B.1 Tổng quan

| Hạng mục | Nội dung |
|---|---|
| Phái (app) | `maoshan` — «驱邪 phái — 符 5 đoạn + 存思; dân gian thường hiểu "Mao Sơn = phép tiên"», tổ Tam Mao chân quân + Đào Hoằng Cảnh, kinh 《茅山志》(DZ0304) + Thượng Thanh Đại Động chân kinh. `lushan` — «Tam nãi pháp (nữ thần 陳靖姑) + 收惊 / 救 sản», Mân – Đài – Việt |
| Thánh địa | `maoshan` — Cửu Tiêu Vạn Phúc Cung (1500, 1300) |
| NPC dẫn | Mao Sơn đạo nhân Mao Tiểu Tùng (`maoshan_daonhan`) — «tôi – anh / chị», thực tế; câu cấm: «bạn bị ma», chẩn bệnh |
| Lời mở canon | «Đa phần cái gọi là tà là người mình mệt. Ngủ đủ đã, rồi thầy xem.» |
| Hành của đạo | chính **Hỏa**, phụ **Thủy** |
| Tu Bổ | Tuệ Kiếm · công đức (trần T-CN +1 / hạng, 05-06 §6.1) |
| Nhánh đời thực / nhánh âm tà | xem B.2 |

## B.2 Hai nhánh: đời thực và âm tà (opt-in)

| | Nhánh **đời thực** (mặc định) | Nhánh **âm tà** (chỉ khi người chơi tự bật) |
|---|---|---|
| Ai thấy | mọi người chơi | người đã bật Cài đặt › «Âm tà · trừ tà (văn hóa – tôn giáo)», có màn hình `ETHICS.disclaimerVi` |
| Án «việc lạ» | luôn có nguyên nhân đời thực: chuột, gió lùa, ống nước, mất ngủ, áp lực, bệnh cần thầy thuốc, lừa đảo | sau khi đã loại trừ đời thực, **có thể** thêm lớp tín ngưỡng (nghi thức an tâm, tụng kinh) — vẫn không bao giờ khẳng định ma |
| Dữ liệu | `fs-cure`, `tcm` (văn hóa), `anti-manipulation-data` | thêm `amta-data` (`indicators`, `spiritTypes`, `remedies`, rituals), `analyzeAmTa(R)`, `suggestByAmTa`, `suggestDaozangByAmTa` |
| Tiến độ đạo | đủ để lên hạng V | nhanh hơn ở hạng III–IV **không**; chỉ thêm nội dung |

Tắt mục Âm tà giữa chừng: các nhiệm vụ nhánh âm tà đang làm chuyển về bản đời thực tương ứng, không mất tiến độ.

## B.3 Thang hạng

| Hạng | Tên hạng | Ý nghĩa | Điều kiện riêng |
|---|---|---|---|
| I | **Tịnh Đàn** | lau đàn, giữ đèn, học nhìn | `CQ-TT-01` |
| II | **Tồn Tư** 存思 | tu tồn tư (hình ảnh ánh sáng) | 5 án «việc lạ» giải đúng nguyên nhân đời thực |
| III | **Đại Động** | đọc Thượng Thanh Đại Động chân kinh (thẻ) | tịnh trạch một nhà |
| IV | **Thu Kinh Sư** (Lư Sơn) | an ủi trẻ hoảng sợ theo nghi Lư Sơn + dẫn đi khám khi cần | 3 lần thu kinh; dạy 1 tịnh đàn |
| V | **Trừ Tà Chính Tông** | | viên mãn |

## B.4 Giới

| Loại | Giới | Mở | Thẻ giới hiện khi | Phạm khi |
|---|---|---|---|---|
| Thường trực 1 | **Không khẳng định ma** — không nói với ai «anh bị ma / bị vong theo / bị yểm» | I | phương án có thẻ `khang_dinh_ma` (lấy từ `ETHICS.forbiddenAbsoluteClaims`) | chọn |
| Thường trực 2 | **Không nhận lễ vật khi giúp việc lạ** | III | NPC đưa Phúc Khí / quà sau khi được giúp | nhận (từ chối là đúng; có thể gợi ý họ bố thí cho chùa) |
| Thường trực 3 | **Hỏi thầy thuốc trước** — không làm nghi lễ cho người có triệu chứng thân thể khi chưa hỏi họ đã đi khám chưa | IV | bước «hỏi khám» trong án | bỏ qua bước (hệ cho phép bỏ để người chơi **tự** giữ giới) |
| Đạo tràng | không đùa, không nói chuyện ma để dọa người khác trong cung (thẻ `doa`) | I | | |
| Đạo tràng | không mang vật phẩm Âm Bài (Tà Lộ) vào chính điện (va chạm chặn ở cửa; thẻ giới) | I | | |

## B.5 Hoạt động lõi

### B.5.1 Tồn tư (`B = 12` / phiên)

- **Nguồn:** `GONG_CUNXIANG` — «存想 (tưởng / tập trung vào thân trung thần)», «内觀 (quán nội tâm)»; Thượng Thanh «đại động» tồn tư; `talisman-data › ZHOU_JIN_GUANG` (Kim Quang — tên và ý «ánh sáng hộ thân»).
- **Mini-game:** màn tối; người chơi giữ một điểm sáng nhỏ ở giữa và để nó lớn dần thành vòng sáng bao quanh nhân vật (giữ ổn định); tạp niệm là bóng tối lướt qua — để yên. Không có hình quỷ, không có hù dọa.
- Hồi chiêu 3 phiên / ngày.

### B.5.2 Trực «hỏi việc lạ» (`B = 10` / án)

- Ở gian bên của cung có bàn «hỏi việc lạ». NPC (sinh theo ngày) kể: tiếng động đêm, ác mộng, đồ vật dời chỗ, con nhỏ quấy khóc, cảm giác «có ai nhìn».
- **Quy trình bắt buộc 5 bước** (đây là bộ khung của chuỗi trừ tà chính tông `CQ-TR`, 05-13 §2):
  1. **Nghe** trọn (không ngắt);
  2. **Hỏi đời thực**: ngủ mấy giờ, ăn uống, bệnh, thuốc đang dùng, áp lực, nhà cửa (gió, chuột, ống nước), ai mới vào nhà;
  3. **Xem nhà** (nếu cần): đi tới nhà NPC, tìm nguyên nhân vật lý (mini-game tìm vật: tổ chuột, khe gió, ống rỉ);
  4. **Chuyển người** khi có dấu hiệu sức khỏe / tâm lý thật: tới Y quán Huyền Thành (lương y — NPC phụ) hoặc «người nghe chuyện» (NPC tư vấn) — **luôn** kèm thẻ hỗ trợ đời thực cho người chơi;
  5. **An tâm** (tùy chọn, chỉ sau 1–4): tụng một đoạn kinh ngắn, tịnh nhà (mở cửa sổ, dọn dẹp — đúng `remedy-jingzhai.steps` có bước «mở cửa sổ / thông khí»).
- Án giải đúng nguyên nhân đời thực: `B = 10`. Án cần chuyển người mà người chơi chuyển đúng: `B = 12`. Làm bước 5 khi chưa xong 1–4: hệ không cho (nút mờ, chú thích «Mao Sơn dạy: xem người trước, xem ma sau — mà thường chẳng có ma»).

### B.5.3 Thu kinh (Lư Sơn) (`B = 14` / lần)

- **Nguồn:** `lushan.coreMethod` «救產護胎 + 收惊 + 驱妖»; `FA_SHOUJING_TW` (Đài Loan: 喊驚 / 收魂 / 叫魂 — dùng áo, gạo, hương); `FU_LUSHAN_SHOUJING` (cấu trúc).
- **Trong game:** đứa trẻ NPC hoảng sợ sau một sự kiện thật (ngã xuống mương, chó dữ đuổi). Người chơi: (1) hỏi cha mẹ trẻ đã đưa trẻ đi khám chưa nếu trẻ sốt / đau; (2) làm nghi thu kinh **dạng văn hóa**: cầm áo của trẻ, gọi tên trẻ ba lần, rắc mấy hạt gạo vào chén — hoạt ảnh nhẹ nhàng; (3) dặn cha mẹ cho trẻ ngủ sớm, ở bên trẻ.
- Không có hiệu ứng «hồn quay về» trên màn hình. Kết quả: trẻ ngủ ngon (cảnh), cha mẹ yên tâm.
- **Nội dung «cứu sản hộ thai»** của Lư Sơn: game **không** làm (y khoa sản khoa). Chỉ có trong thẻ Tàng Kinh về bà Trần Tĩnh Cô.

## B.6 Chuỗi nhiệm vụ Thượng Thanh · Lư Sơn

| Mã | Tên | Mục tiêu | Mở | Dạy | Thưởng |
|---|---|---|---|---|---|
| CQ-TT-01 | Lên Cửu Tiêu | tới cung; nghe Mao Tiểu Tùng giảng 9 chiều của `maoshan` và `lushan`; nhận giới 1; lau đàn lần đầu | cảnh giới 2; xong `CQ-MD-70` | `SCHOOLS.maoshan`, `lushan` | B 30; hạng I |
| CQ-TT-02 | Tam Mao và họ Đào | đọc thẻ về Tam Mao chân quân và Đào Hoằng Cảnh; tìm quyển *Mao Sơn Chí* (DZ0304, 33 quyển) ở thư phòng | I | `maoshan.founder`, `canon`, `sources` | B 25 |
| CQ-TT-03 | Phù năm đoạn | học năm đoạn phù (đầu – thân – bụng – đảm – chân) — **dùng chung** với `CQ-CN-02…04` nếu đã học | I | `FU_MAOSHAN_XIE.structure` («僅描述結構, 不提供可繪式樣») | B 30 (hoặc B 10 nếu đã học ở CN) |
| CQ-TT-04 | Tồn tư đầu tiên | 3 phiên tồn tư; đọc thẻ Kim Quang chú (tên, ý nghĩa) | I | `GONG_CUNXIANG`, `ZHOU_JIN_GUANG` | B 25 |
| CQ-TT-05 | Tiếng gõ đêm | án «việc lạ» đầu tiên: nhà bà góa nghe tiếng gõ trên mái mỗi đêm; theo quy trình 5 bước; nguyên nhân: cành cây khô cọ mái + chuột | I | quy trình 5 bước; `fs-cure` (nhà) | B 30; thi lên **II · Tồn Tư** |
| CQ-TT-06 | Bộ cương đạp đẩu | xem đạo trưởng bộ cương (Vũ bộ) trong khoa; đọc ý nghĩa: bước theo sao, «hành tẩu theo trật tự trời» | II | `FA_GANGBU` (tên, ý nghĩa; không chỉ dẫn bước) | B 25 |
| CQ-TT-07 | Gọi tên nỗi sợ | **đời thực:** phân loại 5 loại nỗi sợ hay gặp trong án (bóng tối, tiếng động, cô đơn, mất người thân, bị theo dõi) và nguyên nhân thật hay gặp. **Âm tà (opt-in):** đọc 5 loại hồn trong tín ngưỡng (`spiritTypes`: tiên linh, oán linh, anh linh, cô hồn, tinh quái) kèm `distinctFrom` và cờ «嬰靈 là phát triển dân gian hiện đại Đài Loan, không phải kinh điển» | II | đời thực: nội dung game; âm tà: `spiritTypes`, `modernityFlag` | B 35 |
| CQ-TT-08 | Bà Lâm Thủy | đọc thẻ về Trần Tĩnh Cô (Lâm Thủy phu nhân) và tam nãi; vì sao Lư Sơn gần với Việt Nam (văn hóa Mân – Việt) | II | `lushan.founder`, `region` | B 30 |
| CQ-TT-09 | Bé ngã mương | thu kinh đầu tiên (B.5.3), có bước hỏi khám | II | `FA_SHOUJING_TW`, `FU_LUSHAN_SHOUJING` | B 40; DEED-021 kiểu (+3 nếu có cờ khủng hoảng) |
| CQ-TT-10 | Tịnh trạch | một nhà ẩm mốc, cả nhà hay ốm vặt, tin «nhà có âm khí»: dọn, mở cửa sổ, chỉ chỗ ẩm, khuyên đi khám; (opt-in) thêm tụng Tịnh Tâm / Tịnh Khẩu / Kim Quang theo `remedy-jingzhai` | II | `remedy-jingzhai.steps` («Mở cửa sổ / thông khí»), `caveat` («KHÔNG thay thế vệ sinh / y tế») | B 50; lễ **III · Đại Động** |
| CQ-TT-11 | Đại Động chân kinh | đọc 3 thẻ Thượng Thanh Đại Động; một phiên tồn tư mức 3 | III | `maoshan.canon` | B 40 |
| CQ-TT-12 | Người không ngủ | NPC thợ rèn mất ngủ 3 tuần, nghe tiếng thì thầm; người chơi **chuyển người** tới lương y và người nghe chuyện; ở lại ngồi với anh ta một buổi | III | `ETHICS.referralNote` («ưu tiên chuyên gia tâm lý / y tế») | B 40; DEED-065 |
| CQ-TT-13 | Thầy trừ tà giả | Định Mệnh Hội mở quầy «trừ vong theo, 10 lượng»; người chơi vạch mặt bằng quy trình 5 bước và `ETHICS.forbiddenAbsoluteClaims` (không ai được nói chắc «bị vong») | III | `anti-manipulation-data`, `ETHICS` | B 40; DEED-031 / DEED-044 kiểu |
| CQ-TT-14 | Dạy quy trình | kèm một người chơi hạng I giải 3 án «việc lạ» đúng quy trình | III | (ôn) | B 40; lễ **IV · Thu Kinh Sư** (đã có 3 lần thu kinh) |
| CQ-TT-15 | Án Hồi IV | tham gia chuỗi cứu người trúng yểm của Hồi IV (`CQ-TR`, 05-13 §6) đến bước hồi phục | IV | toàn bộ quy trình | B 60; DEED-026 |
| CQ-TT-V | Trừ Tà Chính Tông | tổ chức «ngày tịnh trạch» cho một làng (sự kiện tổ đội): 10 nhà, mỗi nhà một nguyên nhân thật; dạy 3 người chơi quy trình | IV, ĐH-đạo ≥ 1.800 | — | B 100; hạng **V**; danh hiệu «Mao Sơn Chính Tông» |

**Tổng `B` chuỗi:** 30+25+30+25+30+25+35+30+40+50+40+40+40+40+60+100 = **640**.

## B.7 Thi thăng hạng

**Kiểm tri lên II (mẫu):**

1. Mao Sơn thuộc phái nào? (Đ: Thượng Thanh)
2. Bước đầu tiên khi có người kể «việc lạ»? (Đ: nghe trọn)
3. Câu nào **không** được nói? (Đ: «Anh bị ma theo» — mọi khẳng định chắc chắn)
4. Ai nên chủ trì nghi lễ trừ tà ngoài đời theo app? (Đ: đạo sĩ / pháp sư thụ chức)
5. Người mất ngủ kéo dài, nghe tiếng thì thầm — nên làm gì trước? (Đ: chuyển tới thầy thuốc / chuyên gia tâm lý)

**Kiểm hành lên III:** 10 án «việc lạ» đúng quy trình, ≥ 2 án có bước chuyển người.
**Kiểm tâm lên IV:** tồn tư mức 3 «viên» 5 lần.

## B.8 Dữ liệu âm tà trong đạo (chỉ khi opt-in)

| Dữ liệu | Dùng ở | Cách trình bày |
|---|---|---|
| `analyzeAmTa(R).susceptibility.level` của **chính người chơi** | thẻ «Tượng âm tà trong lá số» ở Sổ Mệnh (chỉ khi opt-in) | hiện `summary` nguyên văn (đã có câu «KHÔNG phải chẩn đoán "bị ma/tà"») và `note`; không màu đỏ, không biểu tượng đầu lâu |
| `indicators` (11 chỉ báo) | thẻ Tàng Kinh «Hoa Cái», «Cô Thần Quả Tú», «Điếu Khách / Tang Môn»… | ghi `meaning` nguyên văn (đều có câu «là TƯỢNG… KHÔNG phải "bị ma"») |
| `suggestByAmTa(amta)` | gợi ý chú / nghi để **đọc** (thẻ) | danh sách thẻ, không nghi lễ tự động |
| `suggestDaozangByAmTa` | gợi ý quyển Đạo Tạng (từ khóa 北帝, 救度, 护命…) | kệ «Theo tượng lá số» ở thư phòng Mao Sơn |
| `_AMTA2CULT[level]` | câu khuyên của Mao Tiểu Tùng | «high: … tránh tự tu pháp cao khi chưa có sư truyền» → trong game: «Lá số anh có nhiều tượng âm. Thế thì càng nên ngủ đủ và đừng tự mày mò mấy thứ trên mạng.» |

**MAU-A** (đã chạy): `level = high`, `score 12`, chỉ báo `guchen-guasu`, `diaoke`, `jiesha-wangshen`. Nếu người chơi MAU-A bật Âm tà, Mao Tiểu Tùng nói câu trên, rồi giao `CQ-TT-12` sớm hơn (không phải vì «có ma», mà vì người có tượng này «dễ hướng nội» theo `meaning` của Hoa Cái / Cô Thần → nhiệm vụ ngồi với người cô đơn).

## B.9 Kịch bản cảnh

```
[CẢNH CQ-TT-05.1 · Huyền Thành, nhà bà góa · đêm, giờ Tý · gió]
BÀ GÓA: Đêm nào cũng gõ. Cộc… cộc… Ba đêm rồi. Ông nhà tôi mất được trăm ngày…
> Lựa chọn: ① «Bà kể tiếp đi.» → [.2]  ② «Chắc là ông về đấy.» → [THẺ GIỚI]  ③ «Để tôi gọi thầy Mao Sơn.» → [.1c]

[THẺ GIỚI]
(Giới Thượng Thanh: không khẳng định ma. Vẫn nói? — Có / Không)
(Nếu Có: phạm giới; bà góa khóc, không ngủ được; án vẫn tiếp tục — người chơi vẫn có thể sửa ở bước sau và đi sám hối.)

[CẢNH CQ-TT-05.1c]
BÀ GÓA: Thầy bảo cậu học rồi thì cậu xem trước.
→ [.2]

[CẢNH CQ-TT-05.2]
(Bước 2 · hỏi đời thực. Bảng câu hỏi hiện ra, người chơi chọn hỏi.)
NGƯỜI CHƠI hỏi «Bà ngủ mấy tiếng?» → BÀ GÓA: Ba, bốn tiếng. Từ hôm ông mất.
NGƯỜI CHƠI hỏi «Tiếng gõ ở đâu?» → BÀ GÓA: Trên mái, góc bếp.
NGƯỜI CHƠI hỏi «Gần đây có gió không?» → BÀ GÓA: Gió mùa về rồi.
(Bước 3 · xem nhà: trèo thang; thấy cành khô của cây nhãn cọ vào mái; có ổ chuột trong gác bếp.)
(Bước 4 · chuyển người: nút «Giới thiệu bà tới lương y vì mất ngủ» — chọn.)
NGƯỜI CHƠI: Bà ơi, cành nhãn cọ mái. Mai cháu cắt. Còn bà ngủ ít quá, mai cháu dẫn bà ra Y quán.
BÀ GÓA: (im một lúc) Thế mà tôi cứ tưởng…
> Lựa chọn: ① «Bà nhớ ông là phải.» ② (ngồi im với bà một lúc)
(Bước 5 · tùy chọn: thắp một nén hương cho ông trên bàn thờ nhà bà.)
(Kết: B 30. DEED-065 nếu ngồi lại. Lên hạng II nếu đủ 5 án.)
```

```
[CẢNH CQ-TT-01.1 · Mao Sơn, Cửu Tiêu Vạn Phúc Cung · giờ Mùi · nắng]
MAO TIỂU TÙNG: (đang sửa bản lề cửa) À, khách. Đợi tôi tí. Cái cửa này kêu cót két, người ta lại đồn có ma.
MAO TIỂU TÙNG: Anh đến học trừ tà hả? Tôi nói trước: ba năm ở đây, tôi gặp hai trăm vụ «có ma». Một trăm chín mươi vụ là người mệt, mất ngủ, buồn. Chín vụ là chuột, gió, nước. Một vụ là kẻ lừa đảo.
> Lựa chọn: ① «Còn vụ còn lại?» ② «Vậy học ở đây làm gì?»
MAO TIỂU TÙNG: (với ①) Hai trăm rồi đấy, anh đếm lại xem. (cười)
MAO TIỂU TÙNG: (với ②) Học để không ai lấy cái sợ của người ta ra mà bán. Đó là trừ tà.
(Giới: không khẳng định ma. Hạng I · Tịnh Đàn.)
```

## B.10 Giới hạn nội dung riêng

| # | Giới hạn |
|---|---|
| TT-G1 | Không hình ảnh quỷ, xác, máu, hù dọa trong nhánh đời thực. Nhánh âm tà: hình ảnh ước lệ (bóng, sương), không jump-scare. |
| TT-G2 | Mọi án có thẻ hỗ trợ đời thực cho người chơi ở cuối (khi án chạm mất ngủ, buồn, sợ hãi). |
| TT-G3 | Không chú nào được đọc thành tiếng; không phù nào vẽ được. |
| TT-G4 | Không có «bị yểm» thật trong nhánh đời thực. Trong nhánh âm tà và Hồi IV, «yểm» của Lỗ Ban là **hư cấu** và luôn có lối giải bằng cứu người + đời thực (05-12). |
| TT-G5 | Không nội dung cứu sản / thai sản. |
