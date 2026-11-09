# 05-01 · Ba tầng cải mệnh — Cải Vận · Cải Tâm/Cải Hành · Cải Mệnh

> Phần này đặc tả **cơ chế ba tầng** của hệ Nghịch Thiên Cải Mệnh: mỗi tầng tác động lên tài nguyên nào, kéo dài bao lâu, cộng dồn ra sao, mất đi thế nào, hiện lên giao diện ở đâu.
> Nguồn chuẩn: `` `remedy-fate › GAI_LEVELS` ``, `` `remedy-fate › GAI_PRINCIPLE` ``, `` `remedy › buildRemedy` `` (`twelveLaws`, `byElement`, `timing`, `specific`), `` `remedy › WX_REMEDY` ``, `` `remedy-fate › GAI_XIN` ``, `` `remedy-fate › BAZI_HUAJIE` ``, `` `remedy-fate › getRemedyForChart` ``, `` `remedy-fate › DAO_JIA` ``, `` `remedy-fate › REMEDY_METHODS` ``, `` `remedy-fate › TEN_THIEN` ``, `` `game/state.js` ``, `` `game/cosmetics.js` ``.
> Lá số ví dụ xuyên suốt: `MAU-A` (1990-05-15 08:30, nam). Số liệu dưới đây đã chạy engine thật ngày 2026-11-05: Tiềm Lực 41, Tứ Linh Căn, Thân vượng (`strength.strong = true`, `effRatio 0,77`), Dụng Thủy · Hỷ Kim · Kỵ Thổ, `patternQuality.quality = '有救'`, `pattern.name = '七殺格'`, lưu niên 2026 điểm 6 «Đại hung», tuổi Ngọ phạm Trị + Hình Thái Tuế (`taisui › personalTaSui` → mức «nặng», tam hợp đeo: Hổ, Chó).

---

## 1. Nguyên lý chung

### 1.1 Ba tầng của app và ba «đồng hồ» của game

App phân biệt rõ ba tầng, để người dùng **không lẫn đổi vận với đổi mệnh**. Game giữ đúng ranh giới đó bằng cách cho mỗi tầng **một loại tài nguyên riêng, một nhịp thời gian riêng**:

| Tầng (`GAI_LEVELS[].lv`) | Đối tượng (app `obj`) | Độ sâu (`depth`) | Độ khó (`ease`) | Thời gian app (`time`) | Tài nguyên trong game | Nhịp trong game | Có thể mất? |
|---|---|---|---|---|---|---|---|
| 改运 Cải Vận | vận, lưu niên, môi trường | 表 bề mặt | 易 dễ | 1–3 năm, phải điều tiếp | **Vận Phù** (bùa vận ngắn hạn) → nhân **Phúc Khí** | phút → tuần | Có — hết hạn tự nhiên |
| 改心 + 改行 Cải Tâm · Cải Hành | hành vi, thói quen tâm | 中 giữa | 中 vừa | 3–10 năm, lắng đọng | **Đạo Hạnh** (Hậu Thiên) | ngày → tháng | Có — giảm khi phạm giới, sám hối lấy lại được |
| 改命 Cải Mệnh | cách cục, tiên thiên | 深 sâu | 难 khó | một đời | **Cảnh giới**, **Đại Nguyện** (mốc Liễu Phàm), **Thiên Bảng** | mùa → nhiều mùa | Không — chỉ tăng |

**Câu nguyên lý của app** (`GAI_PRINCIPLE`): «先改运 (cầm máu) + 改行 (đổi hướng) + 改心消业 (trị gốc)». Game dịch thành **thứ tự người chơi gặp ba tầng**:

1. Ngày đầu: Cải Vận (dễ, thấy ngay, như cầm máu) → có Phúc Khí để sống, để bố thí.
2. Tuần đầu: Cải Tâm · Cải Hành (Đạo Hạnh) → thấy mình đổi dần.
3. Từ tháng thứ hai: Cải Mệnh (cảnh giới, Đại Nguyện) → thấy «quỹ đạo» đổi.

### 1.2 Luật vàng giữa các tầng

| Mã luật | Luật | Lý do (nguồn) |
|---|---|---|
| L-1 | **Tầng nông không bao giờ đổi ra tầng sâu.** Phúc Khí không mua được Đạo Hạnh; Đạo Hạnh không mua được cảnh giới (cảnh giới chỉ đạt khi Đạo Hạnh **thật sự** chạm ngưỡng và đủ điều kiện đột phá) | `LIAOFAN.coreMethod`: phong thủy, màu sắc… «chỉ là thuận vận»; `gaimenhPlan` tầng 🅵: tích âm đức là pháp duy nhất «nghịch thiên» |
| L-2 | **Tiền thật không chạm tầng 2 và 3.** Ngọc, VIP, Đạo Lộ mùa chỉ chạm thẩm mỹ và tiện ích | Bản sơ đồ §11; `anti-manipulation-data` RB5 |
| L-3 | **Tầng nông được phép tác động gián tiếp tới tầng giữa** qua đúng chuỗi nhân quả của app: vận tốt → có của → bố thí (việc thiện) → Đạo Hạnh | «舍财得财» trong `REMEDY_METHODS › 财布施`, `TEN_THIEN › 捨财作福` |
| L-4 | **Không có hình phạt vì lá số.** Hành Kỵ, năm hung, tổ hợp hung không trừ gì; chỉ đổi cách thưởng | Trụ cột T2; `anti-manipulation-data` RB2 |
| L-5 | **Không có hình phạt khi người chơi không có lựa chọn.** Mọi điểm trừ (giới, nghiệp, công quá) chỉ phát sinh từ một lựa chọn có ghi rõ hậu quả | Bản sơ đồ §5.3 |
| L-6 | **Mọi con số hệ quả đều công khai** trong Sổ Mệnh; không có chi phí ẩn | Bản sơ đồ §5.5 (Nợ Âm công khai) — áp cho mọi tầng |

### 1.3 Dòng chảy tổng quát

```
          ┌───────────── TẦNG 1 · CẢI VẬN ─────────────┐
 lá số ──▶│ twelveLaws ①–⑨ ─▶ Vận Phù ─▶ ×Phúc Khí       │──┐
 (R)      │ (WX_REMEDY theo Dụng/Hỷ; lưu niên)          │  │ Phúc Khí dùng để bố thí
          └─────────────────────────────────────────────┘  ▼
          ┌──────────── TẦNG 2 · CẢI TÂM · CẢI HÀNH ─────┐
          │ ⑩ Tâm Đề theo Nhật Chủ · ⑪ Sổ Công Quá ·     │
          │ ⑫ Khiêm · GAI_XIN Ngũ Bộ Chuyển Niệm ·        │──▶ Đạo Hạnh (× hệ số Nghịch Thiên)
          │ giới luật đạo thống · tu · học                │        │
          └───────────────────────────────────────────────┘        ▼
          ┌──────────────── TẦNG 3 · CẢI MỆNH ───────────┐
          │ Cảnh giới (ngưỡng + điều kiện đột phá) ·      │
          │ Đại Nguyện Liễu Phàm 300/600/1.000 công ·     │──▶ Thiên Bảng Đạo Hạnh · Côn Lôn
          │ Quy nhất                                       │
          └───────────────────────────────────────────────┘
```

---

## 2. Tầng 1 — Cải Vận (改運): Vận Phù

### 2.1 Định nghĩa

**Vận Phù** là hiệu ứng ngắn hạn sinh ra khi người chơi **làm đúng một pháp cải vận** của app trong thế giới game. Vận Phù:

- chỉ nhân **Phúc Khí** (tiền cày được, `state.phucKhi`) và một vài **độ dễ của mini-game** (khung nhịp rộng hơn, xem 2.6);
- **không** nhân Đạo Hạnh, công đức, cảnh giới (luật L-1);
- có biểu tượng riêng trong **Vận Khí Bàn** (thanh trạng thái, mục 6);
- luôn ghi rõ nguồn engine trong chú thích («vì sao có Vận Phù này?»).

### 2.2 Ánh xạ 12 pháp của app

`buildRemedy(R).twelveLaws` trả 12 câu, đánh số ①–⑫. Chín pháp đầu là cải vận (tầng 1). Ba pháp cuối là cải tâm và tích đức (tầng 2) nên chuyển sang mục 3.

| Pháp (app) | Trường engine | Vận Phù trong game | Điều kiện kích hoạt (máy nhiệm vụ kiểm) | Hiệu ứng | Thời hạn | Làm mới |
|---|---|---|---|---|---|---|
| ① Phương vị | `WX_REMEDY[dung].direction` | **Phù Phương Vị** | người chơi ngồi thiền / ngồi bàn giải án / làm sảnh nghề **quay mặt** về phương Dụng (sai lệch ≤ 22,5°; lấy hướng camera nhân vật theo la bàn của `compass`) | +5% Phúc Khí của **chính hoạt động đó** | trong hoạt động | mỗi hoạt động |
| ② Sắc thái | `WX_REMEDY[dung].color`, `[xi].color` | **Phù Hợp Mệnh** (đã có: `cosmetics › setBonus`) | mặc đủ bộ ngũ hành trùng Dụng (`SETS[].wx === yong.primary`) | +10% Phúc Khí giải án / sảnh nghề (`SET_BONUS = 0.1`, `state › recordCase`) | khi còn mặc | tức thời |
| ② (phụ) | `[xi].color` | **Phù Hỷ Sắc** (mới) | phẩm phục hoặc đai mang màu Hỷ (bảng 2.3 cột «Hỷ») khi chưa đủ bộ Dụng | +3% Phúc Khí giải án / sảnh nghề | khi còn mặc | tức thời |
| ③ Nghề nghiệp | `WX_REMEDY[dung].career` | **Phù Chính Nghiệp** | làm việc ở sảnh nghề / đạo thống có hành trùng Dụng (bảng 2.4) | +5% Phúc Khí ở sảnh đó; +1 lượt khách dự phòng / tuần ở sảnh đó | ngày | 0h mỗi ngày |
| ④ Phong thủy cư trú | `WX_REMEDY[dung].house`, `gaimenhPlan › layers[0]` | **Phù Gia Trạch** | nhà riêng ở Huyền Thành đã «an trạch» đạt ≥ 70 điểm theo bài kiểm Mệnh Đồ tầng Không gian (05-02 §4.1) | +5% **mọi** Phúc Khí trong ngày nếu đêm trước người chơi **nghỉ ở nhà** (đăng xuất trong nhà hoặc dùng giường) | 24 giờ | mỗi đêm nghỉ ở nhà |
| ⑤ Số lý | `WX_REMEDY[dung].number` | **Phù Số** | biển số nhà riêng, số phòng trọ, số ghế bồ đoàn chọn có chữ số Dụng | +2% Phúc Khí ở nơi đó | khi ở nơi đó | tức thời |
| ⑥ Ẩm thực | `WX_REMEDY[dung].food` | **Phù Dưỡng** | gọi món hợp hành Dụng ở Trà Thất / trai đường thánh địa | +5% Phúc Khí trong 2 giờ thực; mini-game tĩnh tọa: khung «giữ hơi» rộng thêm 5% | 2 giờ | 1 lần / 4 giờ |
| ⑦ Vật dụng · trang sức | `WX_REMEDY[dung].material` | **Phù Tùy Thân** | đeo vật ở ô «cầm tay» hoặc «mũ · trâm» có chất liệu hành Dụng (thẻ `material` của món) | +3% Phúc Khí | khi đeo | tức thời |
| ⑧ Chọn thời (择日) | `buildRemedy › timing`, `zheri › findGoodDates` | **Phù Cát Nhật** | tổ chức một **lễ** (nhập đạo, khánh thành nhà, khai sảnh) vào ngày `zheri › evaluateDate` chấm «tốt» cho đúng hoạt động và không xung tuổi | lễ đó: +15% Phúc Khí thưởng; hiệu ứng ánh sáng «lễ thành» (thẩm mỹ) | ngày lễ | theo lễ |
| ⑨ Hợp bạn · hợp tác | `hehun › computeHehun` | **Phù Đồng Hành** | đi tổ đội với người chơi (hoặc NPC đồng hành) mà Dụng của họ trùng **Dụng hoặc Hỷ** của mình | +5% Phúc Khí trong hoạt động tổ đội | khi còn tổ đội | tức thời |
| ⑩ Tu dưỡng theo Nhật Chủ | `chart.dayMaster` | → tầng 2, mục 3.5 | | | | |
| ⑪ Tích âm đức | `LIAOFAN.coreMethod` | → tầng 2, Sổ Công Quá (05-03) | | | | |
| ⑫ Khiêm đức | `LIAOFAN.quote` | → tầng 2, mục 3.6 | | | | |

**Vận Phù riêng của Thái Tuế** (đã có code): đèn an Thái Tuế `state › lightLamp` — thắp lần đầu +10 Phúc Khí, mỗi ngày thêm dầu +3 (`LAMP_REWARD`). Trong hệ ba tầng, đèn Thái Tuế được xếp vào **Cải Vận theo năm**: biểu tượng «Đèn Niên» trên Vận Khí Bàn, hạn đến Lập Xuân năm sau.

### 2.3 Bảng nội dung theo hành (cho đội nội dung gắn thẻ vật phẩm)

Mọi giá trị ở cột «App nói» lấy nguyên văn `WX_REMEDY`. Cột «Trong game» là thứ người chơi gặp.

| Hành | App nói: phương | Trong game: phương | App nói: màu | Bộ phục / món (đã có ở `cosmetics.js`) | App nói: vật liệu | Món ô cầm tay / mũ gợi ý | App nói: số |
|---|---|---|---|---|---|---|---|
| Mộc 木 | Đông, Đông Nam | ngồi quay Đông / Đông Nam; ở Huyền Thành: dãy nhà phía Đông | xanh lá, xanh ngọc, mint | bộ «Thanh Mộc Tiên Tông» (`y_moc`, `quan_la`, `kiem_moc`, `aura_dao`) | gỗ, tre, mây, giấy, sợi, bông | Trâm Gỗ Đào (`tram_go`), quạt tre (món mới, ô cầm tay) | 1, 3, 8 |
| Hỏa 火 | Nam | quay Nam | đỏ, hồng, tím, cam | bộ «Ly Hỏa Chân Tông» (`y_hoa`, `kim_quan`, `canh_phuong`, `aura_lua`) | đèn, nến, lụa đỏ | đèn lồng cầm tay (món mới) | 2, 7 |
| Thổ 土 | trung cung, Đông Bắc, Tây Nam | quay Đông Bắc / Tây Nam; ngồi giữa sân | vàng, nâu đất, be | bộ «Hậu Thổ Đạo Tông» (`y_tho`, `dau_lap`, `ho_lo`, `aura_batquai`) | gốm, đá, đất, pha lê, sành | Tử Kim Hồ Lô (`ho_lo`) tính là gốm/kim — gắn thẻ Thổ | 5, 0 |
| Kim 金 | Tây, Tây Bắc | quay Tây / Tây Bắc | trắng, xám, ánh kim, bạc | bộ «Canh Kim Kiếm Tông» (`y_kim`, `dao_quan`, `kiem_bao`, `aura_set`) | kim loại, vàng bạc, đồng | Ngân Đạo Quan (`dao_quan`) | 4, 9 |
| Thủy 水 | Bắc | quay Bắc | đen, xanh nước biển đậm, navy | bộ «Huyền Thủy Long Tông» (`y_thuy`, `tram_ngoc`, `o_giay`, `aura_tuyet`) | nước, thủy tinh, kính, ngọc trai | Bích Ngọc Trâm (`tram_ngoc`) | 1, 6 |

| Hành | App nói: món ăn | Món ở Trà Thất / trai đường (mới) | App nói: mùa | Trong game: mùa (theo lịch âm máy chủ) |
|---|---|---|---|---|
| Mộc | rau xanh, đậu, ngũ cốc, chanh, trà xanh, vị chua tự nhiên | Trà Lài (`TEAS.lai`), canh rau rừng, chè đậu xanh | xuân | tháng Giêng–Ba âm: Phù Dưỡng Mộc kéo dài 3 giờ |
| Hỏa | vị đắng, cà chua, trà đỏ, cà phê | Trà Ô Long (`TEAS.olong`), mướp đắng xào | hạ | tháng Tư–Sáu |
| Thổ | vị ngọt, khoai lang, củ, gạo, đậu phụng | xôi lạc, khoai lùi, chè củ | quý (chuyển mùa) | 18 ngày cuối mỗi mùa |
| Kim | vị cay, hành tỏi, gừng | trà gừng, canh cải cay | thu | tháng Bảy–Chín |
| Thủy | vị mặn, rong biển, đậu đen | chè đậu đen, canh rong biển | đông | tháng Mười–Chạp |

**Ràng buộc nội dung ẩm thực** (an toàn): món ăn chỉ mang **hương vị văn hóa**. Mô tả không được nói món nào «chữa» hay «bổ» tạng nào. Trường `organ` của `WX_REMEDY` **không** được hiển thị trong Vận Phù (trụ cột T6: không chẩn bệnh). Món mặn không nhắc thịt nếu người chơi đang giữ giới chay của một đạo thống (05-06 §1.5): trai đường chỉ dọn món chay.

### 2.4 Phù Chính Nghiệp — hành của từng sảnh nghề và đạo thống

`WX_REMEDY[x].career` là danh sách nghề ngoài đời. Game không có các nghề đó, nên ánh xạ sang **nơi làm việc trong game** theo tính chất gần nhất:

| Nơi làm việc trong game | Hành gán | Lý do gán (đối chiếu `career`) |
|---|---|---|
| Sảnh Thư Lâu (`thulau`) | Mộc | «giáo dục, xuất bản, thư viện» |
| Bàn Hợp Hôn (`thanh`) | Thủy | «truyền thông, ngoại giao» — nghề nối người với người |
| Sảnh Trạch Nhật (`lichduong`) | Hỏa | «in ấn, ánh sáng» — lịch in, đèn lễ |
| Sảnh Dương Trạch (`phongthuy`) | Thổ | «bất động sản, xây dựng, tư vấn» |
| Sảnh Điều Hậu (`cungthong`) | Thủy | khí hậu, nước, «lưu thông» |
| Sảnh Cách Cục (`tubinh`) | Kim | «luật» — xét cách như xét án |
| Sảnh Tượng Pháp (`manh`) | Kim | «tài chính, cơ khí» — làm công, tính toán |
| Sảnh Tử Vi (`trichthien`) | Hỏa | tinh tú, ánh sáng |
| Vườn thuốc Miêu Cương (`mieucuong`) | Mộc | «dược – đông y, nông – lâm – hoa viên» |
| Lò đan Võ Đang (`vodang`) | Hỏa | lửa đan |
| Thư khố Chung Nam (`chungnam`) | Thổ | kho, khoa nghi — «kho bãi, quản lý» |
| Xưởng gốm sửa chùa Bút Tháp (`buttap`) | Thổ | «gốm sứ, xây dựng» |
| Thuyền đò Cùng Thông Hồ (`cungthong`) | Thủy | «vận tải, du lịch» |
| Xưởng rèn chuông Long Hổ (`longho`) | Kim | «kim loại» — chuông, pháp ấn (chỉ làm đạo cụ hư cấu) |

Mỗi sảnh nghề vẫn **1 khách / sảnh / ngày** như code hiện có (`state › deskDone`). Phù Chính Nghiệp chỉ cộng 5% vào phần thưởng `DESK_REWARD = 15` → tối đa +1 Phúc Khí làm tròn. Con số nhỏ là cố ý: nghề hợp Dụng **dễ chịu hơn**, không **bắt buộc**.

### 2.5 Cộng dồn và trần

**Công thức** cho một lần nhận Phúc Khí `P₀` (phần thưởng gốc của hoạt động):

```
P = round( P₀ × (1 + min(TRẦN_VẬN, Σ vận_phù_áp_dụng)) )
```

- `Σ vận_phù_áp_dụng`: cộng thẳng các Vận Phù **liên quan tới hoạt động đó** (vd Phù Phương Vị chỉ áp cho hoạt động đang quay đúng hướng).
- **Trần vận** `TRẦN_VẬN` đọc từ lưu niên hiện tại của người chơi (`liunian[isNow].rating`), đúng ý «thuận vận thì làm, nghịch vận thì giữ» (bản sơ đồ, Hồi III):

| `rating` lưu niên hiện tại | Trần vận | Thêm |
|---|---|---|
| Đại cát | +15% | «Thuận Thời» — NPC dẫn đạo nhắc: năm nên tiến |
| Cát | +15% | như trên |
| Bình | +12% | — |
| Hơi kỵ | +10% | bật **Nghịch Duyên** ở tầng 2 (mục 3.2) |
| Hung | +10% | bật Nghịch Duyên |
| Đại hung | +10% | bật Nghịch Duyên |

**Vì sao trần thấp hơn ở năm hung mà vẫn công bằng:** năm hung bớt «thuận vận» (Phúc Khí) nhưng mở Nghịch Duyên (+10% Đạo Hạnh từ tu tâm). Ý của app: `GAI_XIN.keys4[1]` «逆增上缘 — nghịch = thầy: càng khó càng nâng mình». Người chơi năm hung **không thiệt**: mất một chút tiền, được một chút đạo.

**Ví dụ MAU-A (2026, Đại hung):** giải một án khách được `P₀ = 15`. Mặc đủ bộ Huyền Thủy (+10%), quay mặt hướng Bắc (+5%), vừa ăn chè đậu đen (+5%) → Σ = 20% nhưng trần = 10% → `P = round(15 × 1,10) = 17`.

**Thứ tự tính** (để kiểm thử nhất quán với `state › recordCase` hiện có, nơi `SET_BONUS` đang nhân trực tiếp): bản AAA thay dòng `gained = Math.round(gained * (1 + s.wardrobe.bonus))` bằng hàm chung `vanMultiplier(s, ctx)` trả `min(TRẦN_VẬN, Σ)`. **(chưa có — cần làm)**. Khi chưa làm, giữ nguyên +10% như hiện tại; trần chưa áp.

### 2.6 Vận Phù lên mini-game

Ngoài Phúc Khí, một số Vận Phù làm mini-game **dễ chịu hơn một chút**, không đổi kết quả tối đa:

| Vận Phù | Mini-game (mã MG do tài liệu 09 cấp) | Tác động |
|---|---|---|
| Phù Dưỡng | tĩnh tọa theo hơi thở | khung «giữ hơi» rộng thêm 5% |
| Phù Phương Vị | tĩnh tọa, kết phù | tạp niệm bay qua chậm hơn 5% |
| Phù Cát Nhật | lễ theo nhịp (tụng / lạy) | ô «trúng nhịp» rộng thêm 5% trong lễ đó |

Trần riêng: mọi nới khung cộng lại **≤ 10%**. Điểm tối đa của mini-game không đổi → không ai «mua» được thành tích tu.

### 2.7 Hết hạn, suy giảm, «phải điều tiếp»

App ghi Cải Vận có thời hạn «1–3 năm (cần tiếp tục điều)». Game rút ngắn theo nhịp chơi:

| Vận Phù | Cách mất | Cảnh báo trước |
|---|---|---|
| Phù Phương Vị, Hợp Mệnh, Hỷ Sắc, Số, Tùy Thân, Đồng Hành | mất ngay khi điều kiện không còn (quay sai hướng, cởi đồ, rời tổ đội) | không cần |
| Phù Chính Nghiệp | hết ngày (0h giờ máy khách, như `rollDay`) | không |
| Phù Gia Trạch | hết 24 giờ sau lần nghỉ ở nhà; **mất hiệu lực tới khi kiểm lại** nếu người chơi dời đồ làm điểm an trạch < 70 | hiện chấm vàng trên biểu tượng khi điểm an trạch rơi |
| Phù Dưỡng | hết 2 giờ thực | 10 phút trước hết hạn |
| Phù Cát Nhật | hết ngày lễ | — |
| Đèn Niên (Thái Tuế) | hết khi sang năm can chi mới (Lập Xuân) | 7 ngày trước Lập Xuân: nhắc «thay đèn năm mới» |
| Phù Gia Trạch theo năm | đổi năm → `xuankongPan(year)` đổi vượng phương → bài kiểm an trạch chấm lại | đầu năm mới: Mệnh Đồ tầng Không gian mở bản năm mới (05-02 §5.2) |

Không có Vận Phù nào **trừ** Phúc Khí khi hết. Hết là về mức gốc.

### 2.8 Hành Kỵ và hành Cừu

- Mặc màu Kỵ, quay hướng Kỵ, ăn món Kỵ: **không trừ gì**. Chỉ không có Vận Phù.
- NPC dẫn đạo **được phép** nhắc nhẹ («Áo vàng đẹp đấy, nhưng hôm nay con cần nước hơn đất.») tối đa 1 lần / ngày / loại, và người chơi tắt được nhắc ở Cài đặt › «Lời nhắc cải vận».
- Không có vật phẩm «hóa Kỵ» bán bằng Ngọc. Mọi vật «hóa sát» (gương bát quái, thạch anh… theo `fs-cure › cureByElement`) chỉ dùng trong **nhà riêng** để làm bài an trạch, mua bằng Phúc Khí, không có chỉ số.

### 2.9 Ca biên của tầng Cải Vận

| Ca | Xử lý |
|---|---|
| `yong.xi` trùng `yong.primary` hoặc thiếu (`WX_REMEDY[hy]` không có) | `buildRemedy` đã fallback `rh = rd`; game bỏ Phù Hỷ Sắc |
| Lá số Dị Cách (`patternQuality.quality === '特殊'`) — Dụng theo «thuận thế» | Vận Phù vẫn đọc `yong.primary` của engine; NPC Phương Sĩ Vô Danh giải thích «thuận thế thay vì phù ức» (bản sơ đồ, Hồi I) |
| Người chơi đổi ngày giờ sinh | Vận Phù tính lại ngay; Vận Phù đang chạy hết hiệu lực nếu không còn khớp |
| Lưu niên chưa có `isNow` (năm ngoài khoảng tính) | dùng trần +12% (Bình) |
| Bản iOS | Vận Khí Bàn **ẩn hoàn toàn**: không phương vị, không màu hợp mệnh theo lá số, không đèn Thái Tuế (đã tắt trong `features.js`). Bộ phục ngũ hành vẫn bán như đồ thẩm mỹ, **không** có Hợp Mệnh (05-14 §6) |
| Hai Vận Phù cùng loại (vd hai món Tùy Thân) | chỉ tính một |
| Hoạt động không cho Phúc Khí (vd thiền trong Thiền đường Yên Tử chỉ cho Đạo Hạnh) | Vận Phù không có tác dụng; giao diện không hiện con số |

---

## 3. Tầng 2 — Cải Tâm · Cải Hành (改心 + 改行): Đạo Hạnh

### 3.1 Đạo Hạnh là gì

**Đạo Hạnh** (Hậu Thiên) là tổng điểm tu tích lũy. Mọi nguồn đều là **việc người chơi làm**: việc thiện, giữ giới, tu (thiền, tĩnh tọa, tụng, kết phù), học (khoa cử, kinh, giải án), cứu người. Không nguồn nào là mua, là may, là ngồi chờ.

**Công thức một lần nhận Đạo Hạnh:**

```
ΔĐH = round( B × k × (1 + a) × (1 + n) × h )

B  = điểm gốc của hoạt động (bảng nguồn, 05-14 §2)
k  = hệ số Nghịch Thiên = clamp(1 + (60 − Tiềm Lực)/100, 1,0, 1,5)        (canon §5)
a  = ái lực Dụng thần của đạo thống: +0,10 nếu hành chính của đạo = Dụng;
     +0,05 nếu = Hỷ; 0 nếu khác                                              (05-06 §1.4)
n  = Nghịch Duyên: +0,10 cho nhóm «tu tâm» khi lưu niên hiện tại ∈ {Hơi kỵ, Hung, Đại hung}; 0 nếu khác
h  = hệ số nhật hạn (mục 3.3): 1 trong hạn; 0,25 khi vượt hạn mềm; 0 khi vượt hạn cứng
```

**Nhóm «tu tâm»** (được Nghịch Duyên): tĩnh tọa, thiền, tụng, sám hối, Ngũ Bộ Chuyển Niệm, giữ giới trọn ngày. **Không** gồm: việc thiện (đã có công quá riêng), học khoa cử, giải án.

**Ví dụ MAU-A:** Tiềm Lực 41 → `k = 1,19`. Ngồi thiền ở Yên Tử (Thiền: hành chính Kim = **Hỷ** của MAU-A → `a = 0,05`), năm 2026 Đại hung → `n = 0,10`. Một buổi thiền gốc `B = 12`: `ΔĐH = round(12 × 1,19 × 1,05 × 1,10 × 1) = round(16,49) = 16`.

### 3.2 Hệ số Nghịch Thiên — bảng tra

| Tiềm Lực (`synthesis.score`) | Phẩm căn (`gradeVi`, ngưỡng canon) | k |
|---|---|---|
| 20 | Phàm Căn (< 28) | 1,40 |
| 24 | Phàm Căn | 1,36 |
| 30 | Ngũ Linh Căn (28–35) | 1,30 |
| 41 (MAU-A) | Tứ Linh Căn (36–42) | 1,19 |
| 46 | Tứ Linh Căn thuận (43–49) | 1,14 |
| 48 (MAU-B) | Tứ Linh Căn thuận | 1,12 |
| 55 | Tam Linh Căn (50–57) | 1,05 |
| 60 | Tam Linh Căn thượng (58–65) | 1,00 |
| 70 | Song Linh Căn (66–72) | 1,00 |
| 88 | Thiên Linh Căn (≥ 86) | 1,00 |
| 10 | Phàm Căn (cực thấp) | 1,50 (chạm trần) |

**Vì sao k không bao giờ < 1:** canon kẹp dưới 1,0. Người căn cao không bị trừ, chỉ không được cộng. Họ đã có lợi thế ở bậc 1–3 (Tiềm Lực × 0,4 cộng thẳng vào cảnh giới, mục 4.1).

**Điểm hòa vốn** (để thiết kế cân bằng ở 05-10): ở bậc 1–3, người Tiềm Lực 88 có đầu 35,2 điểm cảnh giới; người Tiềm Lực 20 có 8. Chênh 27,2 điểm. Người Tiềm Lực 20 bù được chênh này sau khi tích **68 Đạo Hạnh gốc** (vì 68 × 0,40 = 27,2 điểm lợi thế từ k), tức khoảng 2 ngày chơi đều. Từ bậc 4 Tiềm Lực thôi tính, nên người căn thấp **đi nhanh hơn thật sự**.

### 3.3 Nhật hạn Đạo Hạnh và tích lũy tĩnh

Để giữ nhịp «tuần → tháng» của tầng giữa và để người chơi ít giờ không bị bỏ xa:

| Thông số | Giá trị | Ghi chú |
|---|---|---|
| Hạn mềm | **120 ĐH gốc / ngày** (tính trên `B`, trước k) | vượt hạn mềm: `h = 0,25` |
| Hạn cứng | **200 ĐH gốc / ngày** | vượt: `h = 0` (hoạt động vẫn làm được, vẫn ghi sổ, không thêm ĐH) |
| Tích lũy tĩnh | ngày không dùng hết hạn mềm thì phần dư dồn sang, tối đa **3 ngày** (≤ 360 gốc) | dồn vào «Tĩnh Khí»: hạn mềm hôm nay = 120 + Tĩnh Khí còn lại |
| Ngoại lệ | việc thiện tính theo **nhật hạn công** riêng (15 công hữu hiệu / ngày, 05-03 §3.3); Âm Bài của Tà Lộ **phá hạn** (05-12 §3) | |
| Đặt lại | 0h giờ máy khách (cùng `rollDay`); máy chủ MMO kiểm lại bằng giờ máy chủ để chống chỉnh giờ (05-14 §4) | |

**Lời trên giao diện khi chạm hạn mềm** (giọng Vân Cốc, không trách): «Hôm nay con đã gieo đủ. Phần còn lại cứ làm vì việc đáng làm.»

### 3.4 Ngũ Bộ Chuyển Niệm (`GAI_XIN`) — cơ chế cốt lõi của «cải tâm»

App coi tâm là gốc của mệnh: `GAI_XIN.principle` «心是命根… 改心 =改命根, mau hơn改行 trăm lần». Game biến năm bước 觉 → 停 → 转 → 净 → 化 thành **một cơ chế chen vào hội thoại**, xuất hiện đúng lúc người chơi sắp chọn một lựa chọn dính nghiệp.

**Khi nào kích hoạt:**

- trong hội thoại có lựa chọn mà ít nhất một phương án gắn thẻ `nghiep:*` (sân, khẩu, tham… — danh mục ở 05-05);
- và người chơi **di chuột / chạm giữ** vào phương án đó quá 0,6 giây (tức «niệm vừa khởi»);
- tối đa 6 lần / ngày (để không thành máy cày), sau đó chỉ còn bước 1 (Giác) dạng nhắc.

**Năm bước trên màn hình:**

| Bước (app `steps[].s`) | App nói (`steps[].d`) | Trên màn hình | Người chơi làm | Thời lượng |
|---|---|---|---|---|
| 1 · 觉 Giác | BIẾT niệm đang khởi — quan sát tâm | thời gian chậm lại; phương án đang giữ hiện chữ đỏ mờ «niệm sân đang khởi» (theo thẻ nghiệp); hiện **cảnh báo theo lá số** nếu thẻ trùng `getYeguoForChart(R)` (05-05 §3) | nhận biết (không cần làm gì) | 1,5 giây |
| 2 · 停 Đình | DỪNG — nuốt 3 hơi / niệm 1 câu / đếm 10 | ba vòng tròn hơi thở; người chơi giữ phím Thở theo vòng (giữ khi vòng nở, thả khi vòng co) | 3 nhịp thở đúng | ~9 giây |
| 3 · 转 Chuyển | ĐỔI niệm (4 chìa khóa) | hiện **4 thẻ chìa khóa** `GAI_XIN.keys4`, mỗi thẻ là một cách nhìn lại tình huống, viết riêng cho tình huống đó | chọn 1 thẻ | tự do |
| 4 · 净 Tịnh | RỖNG tâm — thiền / Chuẩn Đề / Tâm Kinh / Thanh Tĩnh Kinh | màn hình tịnh lại (màu rút, nhạc nền lặng 3 giây); một câu ngắn ≤ 15 chữ từ kinh của đạo thống người chơi đang tu (vd Thanh Tĩnh Kinh: «人能常清靜，天地悉皆歸» — câu app đã có trong `DAO_JIA`) | không làm gì, để im 3 giây (chạm là thoát) | 3 giây |
| 5 · 化 Hóa | NGHIỆP tiêu, mệnh chuyển | hội thoại trở lại; **phương án dính nghiệp mờ đi**, xuất hiện một phương án mới mang tinh thần thẻ chìa khóa vừa chọn | chọn phương án mới (hoặc vẫn chọn phương án cũ — được phép) | |

**Bốn chìa khóa** (`GAI_XIN.keys4`) và cách viết thẻ cho tình huống:

| Chìa khóa (app) | Khi nào dùng | Ví dụ tình huống → câu trên thẻ |
|---|---|---|
| 顺受 Thuận thụ — «đây là quả của nhân xưa, mang tiếp» | bị đối xử bất công, mất mát nhỏ | NPC buôn ở chợ Huyền Thành tính sai tiền thối → «Chuyện nhỏ, mình nhận, rồi nói nhẹ.» |
| 逆增上缘 Nghịch tăng thượng duyên — «nghịch là thầy» | bị chê, bị thử thách, thua trong khoa cử | thi Hương trượt, sĩ tử khác chế nhạo → «Người này đang chỉ cho mình chỗ yếu.» |
| 消业想 Tiêu nghiệp tưởng — «đang trả nghiệp, lúc tốt để trả» | gặp xui liên tiếp, năm hung | đồ vừa mua bị vỡ trong năm Đại hung → «Vỡ cái bát, nhẹ đi một món nợ.» |
| 还债想 Hoàn trái tưởng — «mình nợ đời này» | bị nhờ vả phiền, người thân khó tính | mẹ NPC trong chuỗi hiếu đạo cằn nhằn → «Ngày xưa mẹ cũng chịu mình như thế.» |

**Phần thưởng và hệ quả:**

| Kết cục | Đạo Hạnh | Sổ Công Quá | Nghiệp | Ghi chú |
|---|---|---|---|---|
| Đi đủ 5 bước và chọn phương án «hóa» | `B = 8` (nhóm tu tâm) | +1 công thiện mục «Giữ lời, không dối» **chỉ khi** thẻ nghiệp là `khau` (khẩu nghiệp); các thẻ khác không ghi công (tránh trùng lặp với giới) | không phát sinh | bộ đếm «Chuyển niệm thành công» +1 |
| Đi đủ 5 bước nhưng vẫn chọn phương án cũ | `B = 3` (đã có công nhìn thấy niệm) | ghi «quá» theo lựa chọn | phát sinh bình thường | không có lời trách; Vân Cốc: «Thấy được là đã khác.» |
| Thoát ở bước 1–2 | 0 | theo lựa chọn | theo lựa chọn | |
| Hết 6 lượt / ngày | — | — | — | chỉ còn Giác (nhắc), không có phần thưởng |

**Mốc:** 30 lần chuyển niệm thành công → danh hiệu «Giác Tâm»; 108 lần → hiệu ứng thẩm mỹ «hơi thở sen» khi tĩnh tọa (không chỉ số).

**Truy cập ngược:** người chơi có thể **tự gọi** Ngũ Bộ Chuyển Niệm bất cứ lúc nào từ Sổ Mệnh («Ngồi lại một chút») — khi đó không có thẻ nghiệp, chỉ có bước 2 và 4, thưởng như một buổi tĩnh tọa ngắn (`B = 4`, 3 lần / ngày). Đây là chỗ cho người chơi chỉ muốn yên.

### 3.5 Pháp ⑩ — Tâm Đề theo Nhật Chủ

`twelveLaws[9]`: «Tu dưỡng theo tính Nhật Chủ — bù nhược điểm của {can} (rèn tính kỷ luật/khiêm nhường/kiên định tuỳ can)». Engine chỉ nêu ba hướng chung; game cần một chủ đề cụ thể cho mỗi can. Mỗi tuần (thứ Hai 0h), người chơi nhận một **Tâm Đề**: một đức để rèn, gắn với 3 loại việc trong tuần. Hoàn thành ≥ 5 / 7 ngày có việc thuộc Tâm Đề → thưởng tuần.

Bảng dưới là **nội dung game** (không phải luận đoán của engine). Văn mô tả tính cách nhật can đọc từ `personality-profile` khi hiển thị; bảng chỉ quy định đức cần rèn và việc trong game.

| Nhật can | Tính hay gặp (theo `personality-profile`) | Tâm Đề (đức rèn) | Việc trong game được tính |
|---|---|---|---|
| Giáp 甲 | thẳng, cứng, dẫn đầu | **Nhu** — biết cúi | nhường lượt khách cho người chơi khác ở sảnh nghề; xin lỗi trong hội thoại khi sai; nhận thua trong khoa cử không phản bác |
| Ất 乙 | mềm, khéo, dễ dựa | **Lập** — tự đứng | tự làm trọn một chuỗi CQ không dùng gợi ý; một mình hoàn thành án khó |
| Bính 丙 | nóng, hào phóng, bộc lộ | **Tĩnh** — giữ lửa | 3 buổi tĩnh tọa dài; im lặng trọn một buổi lễ ở Thiền đường |
| Đinh 丁 | tinh tế, dễ lo, giữ trong lòng | **Khai** — mở lòng | kể chuyện với NPC dẫn đạo (thoại tự do ≥ 3 lượt); tham gia lễ chung |
| Mậu 戊 | vững, chậm, cố chấp | **Thông** — linh hoạt | đổi cách giải sau khi thầy gợi ý; thử một đạo thống mới (1 nhiệm vụ nhập môn) |
| Kỷ 己 | chu đáo, hay nghĩ cho người, dễ ôm việc | **Xả** — buông | từ chối một lời nhờ không hợp lý trong hội thoại; bố thí một món mình thích |
| Canh 庚 (MAU-A) | quyết, nghĩa, gắt | **Ôn** — mềm lời | chọn lời mềm ở các hội thoại có thẻ `ac_khau`; hòa giải hai NPC cãi nhau (DEED khuyên thiện) |
| Tân 辛 | sắc, kỹ, tự trọng cao | **Khoan** — rộng lòng | tha một NPC từng lừa mình (chuỗi Định Mệnh Hội); khen người chơi khác ở kênh chung |
| Nhâm 壬 | rộng, phóng khoáng, khó giữ nề nếp | **Thủ** — giữ nề nếp | giữ trọn giới của đạo đang tu 7 ngày; điểm danh đủ tuần |
| Quý 癸 | sâu, kín, dễ u uất | **Minh** — ra sáng | ra ngoài trời giờ Ngọ ngồi thiền; tham gia sự kiện đông người |

| Thưởng tuần Tâm Đề | Giá trị |
|---|---|
| 5 / 7 ngày | `B = 40` Đạo Hạnh (nhóm tu tâm) |
| 7 / 7 ngày | `B = 60` + mảnh thẩm mỹ «Tâm Đề» (gom 12 mảnh → khung tên «Tự Tri») |
| Chuỗi 4 tuần liền | NPC dẫn đạo có thoại riêng nhắc đức đó |

### 3.6 Pháp ⑫ — Khiêm đức (謙德) và Âm chất

`twelveLaws[11]`: «mãn chiêu tổn, khiêm thụ ích». `REMEDY_QUOTES[3]`: «满招损，谦受益». Game có hai cơ chế:

**a) Âm thiện và dương thiện.** `CONG_QUA.thien` có mục «Làm thiện ẩn (âm chất)» +2. Game phân mọi việc thiện thành:

| Loại | Điều kiện | Ghi công | Đạo Hạnh |
|---|---|---|---|
| **Âm thiện** | không bấm «khoe» lên kênh chung; không có người chơi khác trong bán kính 30 m lúc làm; hoặc NPC được giúp không biết ai giúp (các DEED có nhánh «giấu tên») | ghi thêm **1 lần** mục «Làm thiện ẩn (âm chất)» (+2) **mỗi ngày tối đa 2 lần** | đủ |
| **Dương thiện** | người chơi bấm «khoe», hoặc chọn nhận danh trong hội thoại («Cứ nói là tôi giúp») | ghi công mục gốc | **giảm 50%** cho lần đó |
| Thiện ở nơi đông | có người khác chứng kiến nhưng người chơi không khoe | ghi công mục gốc | đủ |

Không có hình phạt nào vì khoe; chỉ là «đã nhận phần báo ở danh tiếng». Câu Vân Cốc khi người chơi khoe lần đầu: «Được khen rồi thì phần trời trả đã nhận. Không sao, lần sau để trời trả.»

**b) Khiêm trong hội thoại.** Các hội thoại có thẻ `khiem`: người chơi được khen (thắng khoa cử, cứu người). Chọn phương án nhường công («Nhờ thầy dạy», «Người kia giúp nhiều hơn») → `B = 5` Đạo Hạnh (nhóm tu tâm), tối đa 3 lần / ngày. Chọn phương án kiêu → không trừ gì, nhưng NPC phản ứng theo tính cách và mục «kiêu» được đếm cho danh hiệu ẩn «Mãn» (chỉ người chơi thấy, có nút gỡ bằng 10 lần khiêm liền).

### 3.7 Giới luật và phạm giới

Mỗi đạo thống đang tu có **giới** riêng (bảng đầy đủ ở 05-06…05-11). Đây là nơi Đạo Hạnh **có thể giảm** (canon: «Giảm nếu phạm giới, có cách sám hối»).

**Định nghĩa phạm giới:** người chơi **chủ động** chọn một hành động mà giới của đạo đang tu cấm, sau khi hệ thống đã hiện **thẻ giới** (một dòng: «Giới Toàn Chân: không uống rượu. Vẫn uống?»). Không có thẻ giới thì không tính phạm giới.

| Thông số | Giá trị |
|---|---|
| Đạo Hạnh bị trừ khi phạm giới | bậc 1–3: **−20 ĐH**; bậc ≥ 4: **−1% Đạo Hạnh hiện tại** (làm tròn lên, tối thiểu 20) |
| Tối đa | 1 lần trừ / giới / ngày; tổng ≤ 3 lần / ngày |
| Ghi | mục «Án giới» trong Sổ Mệnh: giới gì, ở đâu, lúc nào, lấy lại thế nào |
| Lấy lại trong 7 ngày | làm **sám hối** của đạo đó (05-05 §4) **và** việc sửa (nếu giới có người bị ảnh hưởng) → hoàn **100%** số đã trừ |
| Lấy lại sau 7 ngày | hoàn **50%** |
| Ảnh hưởng cảnh giới | không bao giờ hạ cảnh giới (mục 4.3). Nếu Đạo Hạnh rơi dưới ngưỡng cảnh giới hiện tại, chỉ **chặn đột phá** lên bậc kế cho tới khi vượt lại |
| Ảnh hưởng thứ hạng | Thiên Bảng xếp theo Đạo Hạnh **hiện tại** (sau trừ) |
| Giới «tự nguyện» | người chơi có thể **tự phát nguyện** thêm giới (vd «không uống rượu 30 ngày»). Giữ trọn → `B = 30`; phạm → không trừ Đạo Hạnh, chỉ mất phần thưởng nguyện (không phạt cho lòng tốt tự đặt) |

### 3.8 Thập Thiện (`TEN_THIEN`) — mười hạnh làm huy hiệu

`TEN_THIEN` có 10 hạnh của Liễu Phàm (与人为善 … 爱惜物命). Game dùng làm **bộ huy hiệu hạnh**: mỗi DEED (05-04) gắn một hạnh. Làm đủ số việc thuộc một hạnh → huy hiệu.

| Hạnh (`han` · `vi`) | `practice` (app) | DEED nhóm chính (05-04) | Huy hiệu (đồng / bạc / vàng) |
|---|---|---|---|
| 与人为善 Cùng người làm thiện | làm gương lành | tổ đội làm việc thiện, rủ người chơi mới | 10 / 50 / 200 việc |
| 爱敬存心 Yêu kính giữ lòng | giữ tâm yêu và kính | chào hỏi, cảm ơn NPC; kính lễ ở thánh địa | 10 / 50 / 200 |
| 成人之美 Thành cái đẹp cho người | giúp người làm xong việc tốt | giúp NPC hoàn thành ước nguyện (cưới, thi, mở quán) | 5 / 25 / 100 |
| 劝人为善 Khuyên người làm thiện | dẫn người khác hướng thiện | vạch mặt Định Mệnh Hội, kéo người chơi Tà Lộ hồi đầu | 5 / 25 / 100 |
| 救人危急 Cứu người nguy cấp | giúp lúc khó nhất | cứu NPC gặp nạn, cứu người trúng yểm | 3 / 15 / 60 |
| 兴建大利 Kiến dựng lợi lớn | việc lợi cộng đồng | sửa cầu, sửa đường, góp đạo tràng | 3 / 15 / 60 |
| 捨财作福 Xả của làm phúc | bố thí của cải | bố thí Phúc Khí, góp quỹ chùa | 10 / 50 / 200 |
| 护持正法 Hộ trì chính pháp | ủng hộ điều thiện chính | dọn dẹp, giữ gìn thánh địa; báo cáo nội dung lừa đảo | 5 / 25 / 100 |
| 敬重尊长 Kính trọng bậc trên | kính cha mẹ, thầy, người già | chuỗi hiếu đạo, kính lão | 10 / 50 / 200 |
| 爱惜物命 Yêu tiếc mạng vật | tránh sát sinh, quý sự sống | phóng sinh đúng cách, cứu thú, ăn chay | 10 / 50 / 200 |

Đủ 10 huy hiệu vàng → danh hiệu **«Thập Thiện Viên Mãn»** (một trong các điều kiện tùy chọn của Quy nhất, 05-14 §1).

### 3.9 Ba lớp thuốc theo lá số (`BAZI_HUAJIE` qua `getRemedyForChart`)

App có 8 trường hợp lá số, mỗi trường hợp có ba lớp thuốc: **形 hình** (ngoại cảnh), **心 tâm**, **业 nghiệp**. `getRemedyForChart(R)` chọn các trường hợp liên quan. Game dựng **thẻ «Tam Tầng Dược»** trong Sổ Mệnh, mỗi lớp nối vào một tầng cơ chế:

| Lớp | Nối vào | Cách hiện |
|---|---|---|
| 形 hình | Vận Phù tầng 1 + Mệnh Đồ tầng Không gian / Làm công | các Vận Phù gợi ý nổi lên đầu Vận Khí Bàn |
| 心 tâm | Tâm Đề (3.5) và thẻ chìa khóa Ngũ Bộ (3.4) | câu `xin` của trường hợp làm khẩu hiệu tuần |
| 业 nghiệp | thanh nghiệp liên quan và chuỗi sám hối (05-05) | chỉ hiện **gợi ý** chuỗi; không mở thanh nghiệp nếu người chơi chưa làm gì |

Bảng 8 trường hợp và nội dung game:

| # | `when` (app) | Điều kiện engine trong `getRemedyForChart` | 形 → việc trong game | 心 → Tâm Đề phụ | 业 → chuỗi gợi ý |
|---|---|---|---|---|---|
| 1 | Nhật Chủ nhược | `strength.strong === false` | Vận Phù theo Ấn/Tỷ: ngồi học ở Thư Lâu, tổ đội với đồng môn; ngủ sớm ở nhà (Phù Gia Trạch) | «Biết đủ, giữ nhược, không cưỡng cầu» | chuỗi hiếu đạo Huyền Thành (Ấn = mẹ) |
| 2 | Thất Sát vô chế | can lộ `七殺` | chọn một trong ba: học kinh (Ấn hóa Sát), luyện một nghề đến thông thạo (Thực chế Sát), thi đấu khoa cử (Kiếp hợp Sát) | «Biến áp lực thành lực» | phóng sinh + nhẫn (KARMA-SAT, KARMA-SAN) |
| 3 | Tài đa thân nhược | can lộ `劫财` **(lỗi engine: chuỗi giản thể, không khớp `劫財` — xem README)** | tổ đội làm việc lớn, giao quỹ cho người tin cậy (Mệnh Đồ tầng Làm công) | «Biết đủ không tham» | tài bố thí (KARMA-THAM) |
| 4 | Quan Sát hỗn tạp | (engine **không** kiểm trường hợp này trong `getRemedyForChart`; chỉ có trong `combos` qua `gaimenhPlan`) | chuyên một đạo thống trong 30 ngày | «Thanh chính giữ một» | sám khẩu nghiệp (KARMA-LUONG) |
| 5 | Thương Quan kiến Quan | can lộ `傷官`/`伤官` | đọc sách ở Văn Miếu; tránh cãi thầy trong hội thoại | «Nhẫn nhường khiêm hạ» | sám khẩu nghiệp (KARMA-AC, KARMA-Y) |
| 6 | Phối ngẫu cung xung khắc | (engine không kiểm) | — (game không làm nội dung hôn nhân cá nhân theo lá số người chơi) | «Mềm mỏng nhường nhịn» | — |
| 7 | Cách cục bại | `patternQuality.quality === '败格'` | «tìm cứu ứng»: đi theo danh sách thánh địa của Mệnh Đồ; tập trung một lĩnh vực | «Khiêm là thuốc nhanh nhất» | đại sám (88 Phật) + đại tích đức |
| 8 | Ngũ hành thái quá | (engine không kiểm) | — | «Bằng lòng, trung đạo» | tĩnh tọa |

**Xử lý fallback của engine:** khi không trường hợp nào khớp, `getRemedyForChart` trả `[BAZI_HUAJIE[0], BAZI_HUAJIE[6]]` (thân nhược + cách bại) với `needLevel = 'thấp'`, kể cả khi lá số **thân vượng** và **không bại** (chạy MAU-A cho đúng kết quả này). Game **không** được hiện fallback như chẩn đoán: khi `needLevel === 'thấp'` và các trường hợp trả về mâu thuẫn với `strength.strong` / `patternQuality.quality`, thẻ Tam Tầng Dược hiện **chỉ lớp 心** của mục #7 («Khiêm là thuốc nhanh nhất») với nhãn «lời khuyên chung», không lớp hình, không lớp nghiệp.

### 3.10 Pháp môn Đạo gia và sáu phương pháp: nối vào hoạt động

| Nguồn app | Mục | Hoạt động trong game | Đạo thống mở (05-06…05-11) |
|---|---|---|---|
| `DAO_JIA[0]` Thanh Tĩnh Kinh | «清静心 =改命本» | tụng Thanh Tĩnh Kinh buổi sớm (tụng theo nhịp) | Toàn Chân, Thanh Vi |
| `DAO_JIA[1]` Nội đan | «炼精化气→…→炼虚合道» | thang công phu Thanh Vi · Đan Đỉnh (tên bậc, không hướng dẫn thật) | Thanh Vi · Đan Đỉnh |
| `DAO_JIA[2]` Thủ nhất · phục khí · thổ nạp | «tọa 15–30 phút, tập trung đan điền» | tĩnh tọa theo hơi thở (mini-game); **không** đưa chỉ dẫn hơi thở thật ngoài nhịp mini-game | Thanh Vi, Toàn Chân |
| `DAO_JIA[3]` Đạo pháp tự nhiên | «nhận → thuận → hóa» | chìa khóa «Thuận thụ» trong Ngũ Bộ; nhánh Dị Cách | mọi đạo |
| `REMEDY_METHODS[0]` Chuẩn Đề pháp môn | trì chú + công quá cách | lộ Mật · Chuẩn Đề; Sổ Công Quá | Mật · Chuẩn Đề, Liễu Phàm |
| `REMEDY_METHODS[1]` Sám hối | 88 Phật / Kim Cang Tát Đỏa | lễ sám (05-05 §4) | Tịnh Độ, Mật |
| `REMEDY_METHODS[2]` Phóng sinh + ăn chay | «tiêu sát nghiệp» | DEED phóng sinh, DEED chay | Tịnh Độ |
| `REMEDY_METHODS[3]` Hiếu | «bổ Ấn» | chuỗi hiếu đạo | Nho · Tịnh Minh |
| `REMEDY_METHODS[4]` Tài bố thí | «cho cố định, trước nhỏ» | DEED bố thí định kỳ («hũ phúc» 7 ngày) | Tịnh Độ, Nho |
| `REMEDY_METHODS[5]` Tịnh tâm tĩnh tọa | «thiền 15–30 phút» | thiền Yên Tử; Ngũ Bộ tự gọi | Thiền |

---

## 4. Tầng 3 — Cải Mệnh (改命): cảnh giới, Đại Nguyện, Thiên Bảng

### 4.1 Cảnh giới

**Điểm cảnh giới** (canon §5):

```
bậc 1–3:  Điểm = Tiềm Lực × 0,4 + Đạo Hạnh
bậc ≥ 4:  Điểm = Đạo Hạnh
```

| Bậc | Đạo | Phật | Nho | Ngưỡng | Điều kiện đột phá (ngoài ngưỡng) | Mở |
|---|---|---|---|---|---|---|
| 1 | Phàm Nhân | Tín Tâm | Học Trò | 0 | — | Sơn Môn, Huyền Thành |
| 2 | Nhập Môn | Quy Y | Sĩ | 100 | đã nhận Sổ Công Quá (MQ-1 «Gương Liễu Phàm») | 3 thánh địa gần |
| 3 | Luyện Tinh Hóa Khí | Trì Giới | Quân Tử | 400 | 1 đạo thống đạt hạng II; ≥ 1 nút Mệnh Đồ hoàn tất | ngự kiếm |
| 4 | Luyện Khí Hóa Thần | Định | Hiền Nhân | 1.000 | Đạo Hạnh ≥ 1.000 (**không** cộng Tiềm Lực); 2 đạo thống hạng II; không thanh nghiệp nào ≥ 80 | thánh địa xa; Tiên Thiên thôi tính |
| 5 | Luyện Thần Hoàn Hư | Tuệ | Đại Nho | 2.200 | Nợ Âm = 0; Đại Nguyện thứ nhất (300 công); 1 đạo thống hạng IV | Phong Đô (lộ cứu người), Tạng Địa |
| 6 | Luyện Hư Hợp Đạo | Giải Thoát | Thánh Hiền | 4.500 | **Quy nhất** (05-14 §1) | Côn Lôn |

**Chuyển bậc từ 3 sang 4 (Tiên Thiên thôi tính):** ở bậc 3, người chơi Tiềm Lực 88 có thể đạt «điểm 400» khi Đạo Hạnh mới 365. Muốn lên bậc 4, họ cần Đạo Hạnh thật 1.000. Giao diện báo trước từ bậc 3: «Từ bậc sau, căn cốt không còn tính. Chỉ còn con.»

**Tên bậc theo đạo:** dùng tên của **đạo thống chính** người chơi chọn (đạo đầu tiên đạt hạng II). Người chưa có đạo dùng cột Đạo. Người chơi đổi được cách gọi ở Sổ Mệnh bất cứ lúc nào (chỉ là tên).

### 4.2 Lễ đột phá

Đột phá không tự động. Khi đủ điều kiện, nút «Đột phá» sáng ở Sổ Mệnh. Người chơi đến **nơi đột phá** của đạo chính (bảng dưới) và làm một lễ ngắn (1–3 phút, nhịp theo tài liệu 09). Không thể thất bại vì kỹ năng: lễ chỉ là khoảnh khắc. Lễ đột phá **không** mất Phúc Khí.

| Đạo chính | Nơi đột phá | Lễ |
|---|---|---|
| Chính Nhất | Thiên Sư Phủ, Long Hổ | dâng biểu (ký tự hư cấu) trước Tam Thanh |
| Thanh Vi · Đan Đỉnh | đỉnh Kim Đỉnh, Võ Đang | tĩnh tọa lúc mặt trời mọc |
| Toàn Chân · Linh Bảo | Trùng Dương Cung, Chung Nam | thụ giới mới / tụng công khóa |
| Thượng Thanh · Lư Sơn | Cửu Tiêu Vạn Phúc Cung | tồn tư (hình ảnh ánh sáng) |
| Bắc Đế · Động Uyên | cầu Nại Hà, Phong Đô | thắp đèn dẫn đường |
| Thiền | Chùa Đồng, đỉnh Yên Tử | ngồi im trong mây |
| Tịnh Độ | Hồ sen Bút Tháp | thả đèn sen |
| Mật · Chuẩn Đề | Tạng Địa (bản chưa tham vấn: Bút Tháp gian Chuẩn Đề) | xoay bánh xe kinh 108 vòng (tự động sau khi chạm) |
| Nho · Tịnh Minh | Khuê Văn Các, Văn Miếu | thắp hương trước bia |
| Chưa có đạo | Am Vân Cốc | uống trà với Vân Cốc |

### 4.3 Luật «không mất»

| Tình huống | Cảnh giới | Đại Nguyện | Danh hiệu Thiên Bảng |
|---|---|---|---|
| Đạo Hạnh giảm do phạm giới | giữ bậc (mốc cao nhất) | giữ | xếp theo ĐH hiện tại |
| Sổ Công Quá ròng âm | giữ | giữ (Đại Nguyện đã đạt không thu hồi) | giữ |
| Vào Tà Lộ, Nợ Âm > 0 | giữ bậc; **chặn đột phá** bậc 5 và 6 | giữ | ĐH hiển thị kèm dấu «Âm» |
| Đổi ngày giờ sinh | giữ bậc; điểm bậc 1–3 tính lại với Tiềm Lực mới nhưng **không hạ bậc đã đạt** | giữ | cột Tiên Thiên đổi |
| Rời đạo thống chính | giữ bậc; tên bậc chuyển sang đạo khác đã đạt hạng II (hoặc cột Đạo) | giữ | giữ |

### 4.4 Đại Nguyện — ba mốc Liễu Phàm

Canon: 300 / 600 / 1.000 công (thang /10 của Liễu Phàm 3.000 / 6.000 / 10.000). Điều kiện đếm và nguồn công ở 05-03. Tóm tắt cơ chế tầng 3:

| Mốc | Liễu Phàm (`LIAOFAN_STORY.story`) | Trong game: tên Đại Nguyện | Phần thưởng (không có chỉ số) |
|---|---|---|---|
| 300 công hữu hiệu ròng | 3.000 công → sinh con (Nguyên Khang) | **Nguyện Thứ Nhất · Gieo Hạt** | cây con ở sân Am Vân Cốc nảy mầm (lớn theo mùa); mở chức năng **nhận đệ tử sớm** (từ bậc 3 thay vì bậc 4); danh hiệu «Lập Mệnh» |
| 600 công | 6.000 công → đỗ tiến sĩ | **Nguyện Thứ Hai · Đề Danh** | tên khắc vào **bia Đạo Hạnh** ở Văn Miếu (bia đá riêng của máy chủ, cạnh bia tiến sĩ — không thay bia lịch sử); danh hiệu «Cải Quá» |
| 1.000 công | 10.000 công (đại nguyện cuối) | **Nguyện Thứ Ba · Khiêm Đức** | đoạn kết riêng với Vân Cốc ở Côn Lôn; khung tên «Mệnh Do Ta Tạo»; danh hiệu «Tích Thiện · Khiêm Đức» |

Ba danh hiệu dùng tên bốn thiên của *Liễu Phàm Tứ Huấn* (`LIAOFAN.principle`: 立命之学 → 改过之法 → 积善之方 → 谦德之效). «Lập Mệnh» cho mốc đầu vì phát nguyện là lập mệnh.

### 4.5 Thiên Bảng

| Cột | Nguồn | Hiển thị |
|---|---|---|
| Hạng | thứ tự theo **Đạo Hạnh hiện tại** | — |
| Tên · đạo hiệu | hồ sơ | — |
| Cảnh giới | bậc + tên theo đạo | — |
| Đạo Hạnh | ĐH hiện tại | kèm dấu «Âm» nếu Nợ Âm > 0 |
| Tiên Thiên | Tiềm Lực | **chỉ hiện nếu người chơi bật «công khai căn cốt»**; mặc định «—» |
| Đại Nguyện | số mốc đã đạt (0–3) | ba chấm sen |
| Đạo thống | tối đa 3 biểu tượng | — |

Bảng chính xếp theo Đạo Hạnh. Bảng phụ: «Tiên Thiên» (chỉ gồm người bật công khai), «Tân Tú» (người chơi < 30 ngày), «Hồi Đầu» (danh sách người có danh hiệu Hồi Đầu, xếp theo ngày đạt, không xếp theo điểm). Thiên Bảng chốt **mỗi tháng âm** (canon §9.2): người đứng đầu tháng nhận khung tên tháng (thẩm mỹ).

---

## 5. Ba tầng phối hợp — một tháng của MAU-A

| Thời điểm | Tầng | Người chơi làm | Engine đọc | Kết quả |
|---|---|---|---|---|
| Ngày 1, sáng | 1 | mặc Bản Mệnh Y (Dụng Thủy), thắp đèn Thái Tuế 2026 | `yong.primary = 水`, `personalTaSui('午','午')` | Đèn Niên; nhắc «tuổi Ngọ phạm Trị + Hình 2026» |
| Ngày 1, chiều | 2 | gặp Vân Cốc (MQ-1 «Gương Liễu Phàm»), nhận Sổ Công Quá; thả cá ở Cùng Thông Hồ (DEED phóng sinh) | `CONG_QUA`, `meritLedger` | +3 công; ΔĐH = 3 × 2 × 1,19 ≈ 7 |
| Ngày 2 | 2 | Ngũ Bộ Chuyển Niệm khi bị NPC buôn chợ nói xấu (thẻ `ac_khau`); chọn «Ôn» (Tâm Đề Canh) | `GAI_XIN`, `chart.dayMaster` | +8 gốc → 10 ĐH (k 1,19, Nghịch Duyên 1,10) |
| Ngày 3 | 3 | Đạo Hạnh 84 + Tiềm Lực × 0,4 (16,4) = 100,4 → **đột phá bậc 2** tại Am Vân Cốc | công thức cảnh giới | Nhập Môn |
| Tuần 1 | 1 + 2 | mua dần bộ Huyền Thủy bằng Ngọc điểm danh; Phù Hợp Mệnh +10% (trần 10% năm Đại hung) | `SETS`, `liunian[isNow].rating` | Phúc Khí nhiều hơn → bố thí ở Bút Tháp |
| Tuần 2 | 2 | Mệnh Đồ: tầng Thái Tuế ưu tiên (tổ hợp hung Thương Quan Kiến Quan, Quan Sát Hỗn Tạp) | `gaimenhPlan(R)` | chuỗi CQ-MD Thái Tuế + Ấn chế Thương (05-02) |
| Tuần 3 | 2 | chọn đạo thống Thiền (Kim = Hỷ, +5%) và Bắc Đế (Thủy = Dụng, +10%) | `_YONG2CULT` (sửa đọc `yong.primary`) | hai đạo đang tu |
| Tuần 4 | 3 | Đạo Hạnh ~400, Thiền hạng II, một nút Mệnh Đồ xong → **bậc 3** | | ngự kiếm |

---

## 6. Giao diện

### 6.1 Vận Khí Bàn (tầng 1)

- Vị trí: dải biểu tượng nhỏ dưới thanh Phúc Khí ở HUD (web); trong Sổ Mệnh có trang đầy đủ.
- Mỗi Vận Phù: biểu tượng hành (màu hành), số %, đồng hồ cát nếu có hạn.
- Dòng tổng: «Vận: +10% / trần 10% (năm 2026 Đại hung)». Chạm vào «trần» → giải thích Nghịch Duyên.
- Chạm biểu tượng → thẻ «Vì sao?»: pháp số mấy của app, câu `twelveLaws` nguyên văn, hành Dụng.
- Không bao giờ hiện chữ «xui», «hạn», «xấu» trên Vận Khí Bàn. Năm hung hiện «năm nên giữ».

### 6.2 Trang Đạo Hạnh (tầng 2)

- Biểu đồ 30 ngày Đạo Hạnh theo nguồn (công · tu · học · giải án · chuyển niệm), cột chồng.
- Dòng «Hôm nay: 74 / 120 gốc · Tĩnh Khí còn 46». Thanh không đổi màu đỏ khi chạm hạn; chuyển sang màu trà.
- Hệ số đang áp: k, a (theo đạo), n — mỗi hệ số có dòng giải thích một câu.
- Mục «Án giới»: các lần phạm giới còn lấy lại được, đếm ngược 7 ngày, nút «Đi sám hối».
- Tâm Đề tuần: tên đức, 7 ô ngày.

### 6.3 Trang Cảnh giới (tầng 3)

- Bậc hiện tại (tên theo đạo), điểm, ngưỡng kế, **danh sách điều kiện đột phá** dạng hộp kiểm.
- Ba chấm sen Đại Nguyện, số công hữu hiệu ròng / mốc kế.
- Lối tắt Thiên Bảng.

### 6.4 Văn phong thông báo (bắt buộc)

| Không viết | Viết |
|---|---|
| «Bạn bị trừ 20 Đạo Hạnh!» | «Giới Toàn Chân: không uống rượu. Đạo Hạnh −20. Sám hối trong 7 ngày để lấy lại đủ.» |
| «Năm nay xui, vận kém» | «Năm 2026 là năm nên giữ. Vận ít thuận hơn, tu tâm được thêm 10%.» |
| «Lá số yếu, cần cải gấp» | «Mệnh Đồ của con có 6 tầng. Tầng sáng nhất là chỗ nên bắt đầu.» |
| «Bạn đã đổi được mệnh!» | «Tám chữ không đổi. Người mang tám chữ đã khác.» |

---

## 7. Dữ liệu trạng thái (bổ sung vào `state.js`) — (chưa có — cần làm)

`createState()` hiện có `phucKhi`, `xp`, `thaitue`, `wardrobe`… Hệ cải mệnh thêm một nhánh. Tài liệu 13 cấp mã SCHEMA; đây là đặc tả trường:

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `caimenh.daohanh` | số | Đạo Hạnh hiện tại |
| `caimenh.daohanhLife` | số | Đạo Hạnh tích lũy cả đời (không trừ) — để thống kê |
| `caimenh.realm` | 1–6 | bậc cảnh giới (mốc cao nhất) |
| `caimenh.dailyDH` | `{ date, base, tinhKhi }` | đếm nhật hạn |
| `caimenh.ledger` | mảng `{ id: 'DEED-xxx', type: 'thien'\|'ac', action, count, at, region, am: bool }` | Sổ Công Quá (05-03) |
| `caimenh.congHuuHieu` | số | công hữu hiệu ròng (đếm mốc) |
| `caimenh.vows` | `[1,2,3]` đạt | Đại Nguyện |
| `caimenh.karma` | `{ 'KARMA-SAT': số, … }` + `incidents[]` | 05-05 |
| `caimenh.paths` | `{ '<đạo>': { rank, dh, vows, joinedAt, status } }` | 05-06 |
| `caimenh.giuoiAn` | mảng án giới còn lấy lại | 3.7 |
| `caimenh.tamDe` | `{ week, can, days[] }` | 3.5 |
| `caimenh.chuyenNiem` | `{ date, n, total }` | 3.4 |
| `caimenh.amBai` | `{ until, uses, noAm, cases[] }` | 05-09 |
| `caimenh.menhDo` | `{ chartHash, year, nodes[] }` | 05-02 |
| `caimenh.journal` | mảng ghi chép đời thực (chỉ trên máy, mặc định tắt) | 05-03 §6 |

**Chỗ lưu:** máy khách giữ toàn bộ (như hiện nay). Máy chủ MMO giữ bản **chứng thực** của `daohanh`, `realm`, `congHuuHieu`, `vows`, `amBai.noAm` để chống sửa tay (05-14 §4). Ngày sinh không lên máy chủ (bản sơ đồ §14).

---

## 8. Checklist nghiệm thu phần 05-01

- [ ] Không có đường đi nào từ Ngọc / VIP / tiền thật tới Đạo Hạnh, công, cảnh giới (kiểm bằng đồ thị phụ thuộc trong mã).
- [ ] Vận Phù chỉ nhân Phúc Khí và độ nới mini-game ≤ 10%; trần vận đọc đúng `liunian[isNow].rating`.
- [ ] Phù Hợp Mệnh vẫn ra đúng +10% như `state › recordCase` hiện tại khi chưa có trần (hồi quy test `scripts/test-game-cosmetics.mjs`).
- [ ] `k` tính đúng bảng 3.2 cho 11 mốc Tiềm Lực; kẹp [1,0; 1,5].
- [ ] Nhật hạn: 120 / 200 gốc; Tĩnh Khí tối đa 3 ngày; vượt hạn cứng vẫn ghi sổ.
- [ ] Ngũ Bộ Chuyển Niệm: đủ 5 bước, 4 chìa khóa, tối đa 6 lượt / ngày; không có phần thưởng nào khi người chơi không tự giữ phương án.
- [ ] Phạm giới chỉ khi đã hiện thẻ giới; hoàn 100% trong 7 ngày khi sám hối + sửa.
- [ ] Không thông báo nào dùng câu ở cột «Không viết» (mục 6.4) — kiểm bằng danh sách chuỗi cấm.
- [ ] Thẻ Tam Tầng Dược không hiện fallback của `getRemedyForChart` như chẩn đoán.
- [ ] Cảnh giới không bao giờ giảm (test: phạm giới liên tục 30 ngày, đổi lá số, vào Tà Lộ).
- [ ] Bản iOS ẩn Vận Khí Bàn và mọi chữ «hợp mệnh theo lá số».
