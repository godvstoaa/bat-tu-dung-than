# 09-07 · Mini-game IV — Lễ sâu và Hành thiện (MG-19 … MG-24)

> Sáu mini-game ở tầng sâu của đời tu: lễ bái Đẩu, kinh hành hành hương, phóng sinh có trí tuệ, vạch lời phán của Định Mệnh Hội, đọc sổ nghiệp ở Phong Đô, cứu người «trúng yểm» theo thứ tự đời thực trước. Bốn trong sáu game là nhóm **Hạnh** — nơi tu biến thành **giúp người**, sinh công vào Sổ Công Quá (`09-03` §9).
> Mỗi game theo **đúng mẫu 14 mục** (`09-03` §13.1); số B / NK / `s_min` / bậc mở / iOS theo bảng chủ `09-03` §6; công thức ĐH `09-03` §2.2. Phần chung (§12, §13.2, §13.3, §13.5) không nhắc lại.
>
> Ví dụ số dùng `MAU-A`: 1990-05-15 08:30 nam, Tiềm Lực 41 → NT 1,19; Dụng Thủy, Hỷ Kim; năm sinh 庚午 → chi 午; tuổi Ngọ **phạm Trị + Hình Thái Tuế** năm 2026 丙午 (canon §11).

**Mục lục**

| Mã | Tên | Nhóm | Mở | Mục |
|---|---|---|---|---|
| `MG-19` | Bái Đẩu Thất Tinh Đăng | Lễ | bậc 2 | §1 |
| `MG-20` | Kinh Hành Bậc Đá | Thân | bậc 1 | §2 |
| `MG-21` | Phóng Sinh Đúng Pháp | Hạnh | bậc 2 | §3 |
| `MG-22` | Đối Chất Định Mệnh Hội | Hạnh | bậc 2 | §4 |
| `MG-23` | Sổ Nghiệp Giải Oan | Hạnh | bậc 5 (bậc 4 nếu chủ tu `BD`) | §5 |
| `MG-24` | Tam Chẩn Cứu Người | Hạnh | bậc 4 (bậc 3 nếu chủ tu `TT`) | §6 |

---

## 1. `MG-19` · Bái Đẩu Thất Tinh Đăng

### 1.1 Mục đích

Bái Đẩu (lễ sao Bắc Đẩu) là nghi lễ đặc trưng của Chính Nhất ở Long Hổ (canon §5.6) và có Đẩu Mẫu Điện ở Sơn Môn. `MG-19` **dựng lại về mặt văn hóa** (không phải hành lễ thật): bày đấu đàn, thắp bảy đèn theo thứ tự chòm sao, thắp đèn sao bản mệnh theo năm sinh, lạy ba lạy chậm. Đồng thời dạy một tri thức thiên văn cổ có thật: **chuôi Đẩu chỉ mùa** («斗柄指東，天下皆春» — chuôi chỉ Đông thì thiên hạ đều xuân). Trụ cột: T1 (sao bản mệnh từ lá số), T5 (đúng thứ tự, đúng ý nghĩa), T6 (không vẽ phù, không hứa «giải hạn»).

### 1.2 Engine dạy

| Nội dung | Nguồn | Dùng thế nào |
|---|---|---|
| Ý nghĩa bái Đẩu: «北斗主死、南斗主生», lễ Bắc Đẩu cầu diên sinh giải ách | `talisman-data › TALISMANS` mục `FU_ZHENGYI_BEIDOU` (`meaning`) | thẻ giảng lúc vào điện |
| Pháp khí trong đấu: «米斗內放七星劍/鏡/尺/秤/剪/燈» | `FU_ZHENGYI_BEIDOU.visual` | bước 1 bày đấu đàn |
| Kinh gốc của lễ: Bắc Đẩu Bản Mệnh Diên Sinh Chân Kinh | `FU_ZHENGYI_BEIDOU.recitation_context` | dòng giới thiệu (không trích kinh dài) |
| Cấu trúc phù (đầu–thân–bụng–mật–chân) | `FU_ZHENGYI_BEIDOU.structure` | **chỉ** nhắc rằng có phù kèm lễ, game không vẽ (canon T6) |
| Chi năm sinh | `chart › analyze(...).chart.pillars.year.zhi` | chọn sao bản mệnh |

Bảng sao bản mệnh (tập tục phổ biến, ghi nguồn văn hóa trong sổ; **không phải engine** — chưa có — cần làm hằng `BENMING_STAR` trong module của game):

| Chi năm sinh | Sao bản mệnh |
|---|---|
| 子 Tý | Tham Lang (貪狼) |
| 丑 Sửu · 亥 Hợi | Cự Môn (巨門) |
| 寅 Dần · 戌 Tuất | Lộc Tồn (祿存) |
| 卯 Mão · 酉 Dậu | Văn Khúc (文曲) |
| 辰 Thìn · 申 Thân | Liêm Trinh (廉貞) |
| 巳 Tỵ · 未 Mùi | Vũ Khúc (武曲) |
| 午 Ngọ | Phá Quân (破軍) |

### 1.3 Luật chơi

1. **Bày đấu đàn:** kéo 6 pháp khí (kiếm, gương, thước, cân, kéo, đèn) vào 6 vị trí quanh đấu gạo. Mỗi khi đặt đúng, một thẻ nhỏ giải nghĩa pháp khí (ý nghĩa tượng trưng theo tài liệu tham khảo; sổ ghi «một cách hiểu phổ biến»).
2. **Thắp bảy đèn:** trên bàn có 7 đèn xếp theo hình chòm Bắc Đẩu (vị trí xoay theo mùa ở mức cao). Thắp theo thứ tự từ «đầu gáo» tới «cuối chuôi»: Tham Lang → Cự Môn → Lộc Tồn → Văn Khúc → Liêm Trinh → Vũ Khúc → Phá Quân. Mỗi đèn: chạm giữ cho tới khi ngọn lửa đứng yên (≈ 2 giây).
3. **Đèn bản mệnh:** sau bảy đèn, game hỏi «Sao bản mệnh của người lễ là sao nào?». Người chơi chọn (mức Sơ có gợi ý chi năm sinh). Đèn đó được thắp lần hai với ngọn lớn hơn.
4. **Lạy:** ba lạy chậm — giữ để cúi (≥ 3 giây), thả để đứng (≥ 2 giây). Lạy vội bị tính.
5. **Hồi hướng:** chọn một câu hồi hướng (cho mình, cho gia đình, cho mọi người); không có ô viết điều ước (tránh biến thành «cầu giải hạn»).

**Lễ cho người khác (MMO / NPC):** từ mức Trung, người chơi có thể bày lễ «thay» cho một NPC khách (dùng chi năm sinh của NPC) — dạy rằng bản mệnh mỗi người khác nhau.

### 1.4 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Đặt pháp khí | kéo thả | chọn `1`–`6`, di bằng `←→↑↓`, `Enter` đặt | kéo thả |
| Thắp đèn | chạm giữ đèn ≈ 2 s | chọn đèn bằng `←→`, giữ `Space` | giữ nút trái trên đèn |
| Chọn sao bản mệnh | chạm thẻ | `1`–`7` | nhấp |
| Lạy | giữ (cúi) – thả (đứng) | giữ / nhả `Space` | giữ / nhả |

### 1.5 Bố cục giao diện

```
┌──────────────────────────────────────────────┐
│ Đẩu Mẫu Điện · Long Hổ · giờ Hợi · tiết Lập Đông │
│                                              │
│      ★ Tham Lang                               │
│        ★ Cự Môn      ← đã thắp: 2/7             │
│   ☆ Lộc Tồn                                    │
│      ☆ Văn Khúc ── ☆ Liêm Trinh ── ☆ Vũ Khúc     │
│                                  ╲ ☆ Phá Quân   │
│                                              │
│   Đấu gạo: [kiếm ✓][gương ✓][thước ✓][cân ✓]    │
│            [kéo ✓][đèn ✓]                       │
│   «Bắc Đẩu chủ tử, Nam Đẩu chủ sinh.»           │
└──────────────────────────────────────────────┘
```

### 1.6 Đường cong độ khó

| Mức | Bày đấu | Hình chòm sao | Đèn bản mệnh | Khác |
|---|---|---|---|---|
| Sơ | vị trí có bóng mờ | tên sao hiện trên đèn | gợi ý chi năm sinh | — |
| Trung | không bóng mờ | chỉ có hình chòm, không tên | không gợi ý | lễ thay NPC |
| Thâm | như Trung | chòm sao **xoay theo mùa thật**: chuôi chỉ Đông (xuân), Nam (hạ), Tây (thu), Bắc (đông) | như Trung | câu hỏi phụ: «Nhìn chuôi Đẩu, giờ là mùa gì?» |
| Viên Thông | như Trung | **bầu trời đêm thật** ngoài sân điện (giờ, mùa thật); người chơi tự tìm chòm trên trời rồi thắp đèn theo | như Trung | dẫn lễ tập thể (≤ 7 người, mỗi người một đèn) |

### 1.7 Chấm điểm

```
p = số pháp khí đặt đúng / 6
o = (số đèn thắp đúng thứ tự trước khi sai lần đầu + 0,5 × số đèn đúng sau đó) / 7
m = 1 nếu chọn đúng sao bản mệnh, 0 nếu sai
l = trung bình 3 lạy của  min(1, tCúi/3 s) × 0,6 + min(1, tĐứng/2 s) × 0,4
q = (Thâm trở lên) 1 nếu trả lời đúng mùa theo chuôi Đẩu, 0 nếu sai; mức thấp hơn q không tính
s = 0,15·p + 0,35·o + 0,20·m + 0,30·l          (Thâm+: 0,15·p + 0,30·o + 0,20·m + 0,25·l + 0,10·q)
thô = 6 × f(s) × K_lặp × K_hư           s_min = 0,5
```

**Ví dụ (`MAU-A`, Long Hổ — CN, Hỏa; không hợp Dụng / Hỷ):** đặt đủ 6 pháp khí, 7 đèn đúng thứ tự, chọn đúng **Phá Quân** (chi 午), ba lạy 3,5 s / 2,2 s · 2,4 s / 2,0 s · 3,1 s / 1,5 s → `l = (1 + 0,92 + 0,94)/3 = 0,953`. `s = 0,15 + 0,35 + 0,2 + 0,286 = 0,986` → `f = 0,99` → thô 5,9 → ĐH 7,0. Nếu lễ ở Thái Tuế Điện (BD, Thủy = Dụng): ĐH 7,7.

### 1.8 Phần thưởng

| Hạng mục | Giá trị |
|---|---|
| Thô | ≤ 6 / lượt |
| Nguyên Khí | −5 |
| Phúc Khí | `round(thô × 0,5)` |
| Nhật Khóa | 1 việc nhóm **Lễ** |
| Lễ Trùng Cửu (9/9 âm, canon §10 «Đẩu Mẫu») | lượt trong ngày lễ tính thêm 1 lần ngoài trần (`EV-*` của tài liệu 10 ghi số) |
| Thành tựu | «Bảy đèn không sai» · «Nhìn chuôi biết mùa» (đúng 4 mùa ở mức Thâm) |

### 1.9 Trạng thái thất bại

| Trạng thái | Điều kiện | Xử lý |
|---|---|---|
| Sai thứ tự đèn | thắp đèn không kế tiếp | đèn sai tắt dịu, đèn đúng nhấp nháy nhẹ; tiếp tục được |
| Lạy vội | `tCúi < 1 s` | nhân vật chỉ gật đầu, không tính lạy đó |
| Chưa đạt | `s < 0,5` | `f = 0,15` |

```
[CẢNH MG-19.F1 · Đẩu Mẫu Điện, Long Hổ · giờ Hợi · sau khi người chơi thắp sai thứ tự hai lần]
TRƯƠNG THIÊN SƯ (truong_thiensu): (chỉ ra cửa điện, nơi bầu trời đêm hiện rõ) Đừng nhìn bàn. Nhìn trời kia.
TRƯƠNG THIÊN SƯ: Gáo trước, chuôi sau. Người xưa đi đêm không lạc vì nhớ được bảy ngôi ấy. Con thắp đèn cũng là nhớ đường.
> Lựa chọn: ① «Con thắp lại từ đầu.» → [MG-19 lượt mới, mức giữ nguyên]  ② «Lễ này có giải được hạn không ạ?» → [MG-19.F1b]
[MG-19.F1b] TRƯƠNG THIÊN SƯ: Lễ là để lòng người ngay ngắn lại. Hạn thì phải tự đi qua. Đèn chỉ soi chân thôi.
```

Câu ở `MG-19.F1b` bắt buộc có (khớp `anti-manipulation-data › refusalBoundaries` RB2 / RB5: không hứa «giải hạn» bằng lễ).

### 1.10 Trợ năng (riêng)

- Chế độ «bày đấu tự động» (vẫn hiện thẻ nghĩa từng pháp khí).
- Lạy: người khó giữ lâu bật «lạy theo nhịp» — chỉ chạm 1 lần, nhân vật tự lạy đủ thời gian; `l` tính 1.
- Bầu trời đêm (Viên Thông): có lớp nối sao + tên sao bật được.

### 1.11 Chống gian (riêng)

- Sao bản mệnh tính từ lá số của **tài khoản / NPC khách** trên máy chủ, không nhận từ client.
- Hướng chuôi Đẩu theo ngày thật quy về múi giờ tài khoản.

### 1.12 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `doudeng_tool_place` | `tool, ok` |
| `doudeng_order` | `lamps_in_order, first_error_at` |
| `doudeng_benming` | `zhi, chosen_star, ok, for (self/npc)` |
| `doudeng_season_q` | `season_true, answer, ok` |
| `doudeng_ask_jiehan` | (người chơi chọn câu hỏi «giải hạn») — đo nhu cầu, để tài liệu 06 viết thêm lời giảng |

### 1.13 iOS

✎ **Thái Tuế Điện tắt trên iOS** (`features.js › IOS_OFF` có `door_thaitue`), nên `MG-19` chỉ có ở Long Hổ. Bỏ bước «đèn bản mệnh» theo năm sinh của người chơi (tránh «vận hạn bản thân» theo bài học 4.3(b)); giữ bày đấu, bảy đèn, chuôi Đẩu chỉ mùa và lạy. `m` thay bằng `q` (câu hỏi chuôi Đẩu) ở mọi mức.

### 1.14 Nghiệm thu

- [ ] Thứ tự 7 sao đúng; bảng sao bản mệnh đúng 12 chi.
- [ ] Không có ô viết điều ước; câu «lễ không giải hạn» luôn có trong nhánh hỏi.
- [ ] Hướng chuôi Đẩu đúng mùa (test 4 ngày giữa mùa).
- [ ] iOS không có bước sao bản mệnh.

---

## 2. `MG-20` · Kinh Hành Bậc Đá (thiền hành, hành hương)

### 2.1 Mục đích

Đường lên Yên Tử từ chùa Giải Oan qua Tháp Tổ Huệ Quang, chùa Hoa Yên tới Chùa Đồng (canon §3) là một trong những cuộc hành hương lớn của Thiền Việt. `MG-20` biến việc **đi chậm có chánh niệm** thành trò chơi: mỗi bước một hơi thở, mỗi vọng niệm được nhận ra, dừng lại, chuyển hóa theo năm bước «giác – đình – chuyển – tịnh – hóa» của app. Hành hương trọn tuyến là việc **nhiều buổi**, không một lèo. Trụ cột: T3, T4 (bậc đá thật, đi bộ thật trong thế giới).

### 2.2 Engine dạy

| Nội dung | Nguồn | Dùng thế nào |
|---|---|---|
| Năm bước cải tâm: 觉 giác · 停 đình · 转 chuyển · 净 tịnh · 化 hóa | `remedy-fate › GAI_XIN.steps` | năm pha xử lý mỗi vọng niệm |
| Bốn chìa khóa chuyển niệm: 顺受 thuận chịu · 逆增上缘 nghịch là thầy · 消业想 · 还债想 | `remedy-fate › GAI_XIN.keys4` | lựa chọn ở pha «chuyển» |
| «Tâm là gốc của mệnh» | `GAI_XIN.principle` | câu mở đầu |
| Mộc ↔ «thiền hành tẩu» | `daozang-data › _YONG2CULT['木'].practice` | lý do TH thuộc hành Mộc (`09-03` §4) |
| Đường đi, bậc đá | `world.js` (A*), `collide.js` | nhân vật đi trên đường thật của bản đồ |

### 2.3 Luật chơi

1. Chọn tuyến (Sơn Môn: 108 bậc trước cổng; Yên Tử: bốn chặng) và thời lượng 5 / 8 / 12 phút.
2. **Bước:** giữ để nhấc chân và đưa tới, thả để đặt chân. Nhịp mục tiêu: một bước mỗi 2,5–3,5 giây (thanh nhịp mềm). Đi nhanh hơn không tới sớm hơn — chỉ mất điểm «đều».
3. **Vọng niệm** xuất hiện ngẫu nhiên (2–4 lần / lượt): một con chim lạ, tiếng ai cãi nhau dưới chân núi, chợt nhớ món nợ, cơn đau gối, lời khen của người đi ngang…
4. Mỗi vọng niệm đi qua **năm pha**:
   - **Giác:** chạm «Biết» trong cửa sổ 4 giây kể từ khi vọng niệm hiện (nhận ra).
   - **Đình:** dừng bước ít nhất 3 giây (không bước).
   - **Chuyển:** chọn một trong bốn chìa khóa — mỗi vọng niệm có 1–2 chìa khóa «hợp» (bảng dưới). Chọn chìa khác vẫn được nửa điểm (không có lựa chọn «sai hoàn toàn»).
   - **Tịnh:** đi tiếp 10 bước đều nhịp, không chạm gì khác.
   - **Hóa:** vọng niệm tan thành lá rơi; một câu ngắn.
5. **Hành hương:** tiến độ trên tuyến Yên Tử được giữ giữa các buổi. Trọn bốn chặng = hoàn thành một chuyến hành hương (hoạt động `ACT` trong `09-08`).

**Bảng vọng niệm mẫu → chìa khóa hợp:**

| Vọng niệm | Chìa khóa hợp nhất | Chìa khóa cũng hợp | Câu «hóa» |
|---|---|---|---|
| Người đi ngang nói khó nghe | 逆增上缘 (nghịch là thầy) | 顺受 | «Người ấy vừa dạy mình một bài nhẫn, không lấy học phí.» |
| Đau gối khi leo | 顺受 (thuận chịu) | 消业想 | «Đau thì đi chậm. Chậm thì nghe được tiếng suối.» |
| Chợt nhớ món nợ chưa trả | 还债想 (nghĩ là đang trả nợ) | — | «Xuống núi sẽ trả. Giờ chỉ việc bước.» |
| Lo năm sau xấu | 顺受 | 逆增上缘 | «Năm sau chưa tới. Bậc đá này thì đang ở dưới chân.» |
| Ghen với người leo nhanh hơn | 逆增上缘 | — | «Núi không chấm ai lên trước.» |
| Bị trượt chân suýt ngã | 消业想 | 顺受 | «Suýt ngã mà không ngã — coi như đã trả một món.» |

### 2.4 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Bước | giữ (nhấc) – thả (đặt) ở nửa dưới màn hình | giữ / nhả `Space` hoặc `W` | giữ / nhả nút trái |
| Biết (giác) | chạm thẻ vọng niệm | `E` | nhấp thẻ |
| Chọn chìa khóa (chuyển) | chạm 1 trong 4 thẻ | `1`–`4` | nhấp |
| Dừng hành hương (lưu tiến độ) | nút «Nghỉ chân» | `Esc` | nút |

### 2.5 Bố cục giao diện

```
┌──────────────────────────────────────────────┐
│ Yên Tử · chặng 2: Giải Oan → Huệ Quang · 37/120 bậc │
│                                              │
│   (camera sau lưng, bậc đá rêu, rừng trúc)     │
│                                              │
│    ┌───────────────────────────────┐          │
│    │ «Tiếng ai cãi nhau dưới chân núi» │ [Biết]  │
│    └───────────────────────────────┘          │
│                                              │
│   nhịp bước  ▁▁▂▃▅[▇]▅▃▂▁▁   (đều)             │
│   pha: GIÁC → đình → chuyển → tịnh → hóa         │
│                                     còn 06:20 │
└──────────────────────────────────────────────┘
```

### 2.6 Đường cong độ khó

| Mức | Cửa sổ «giác» | Số vọng niệm / lượt | Thanh nhịp | Khác |
|---|---|---|---|---|
| Sơ | 4 s | 2 | hiện rõ | thẻ vọng niệm nổi bật |
| Trung | 3 s | 3 | mờ | vọng niệm đôi khi chỉ là âm thanh (không thẻ) — phải nghe mà nhận ra |
| Thâm | 2,5 s | 4 | ẩn | vọng niệm đến từ tâm ma của lá số (`liudao › computeLiuDao(R).poisonTop`, như `MG-01`) |
| Viên Thông | 2,5 s | 3 | ẩn | không có pha «chuyển» bằng thẻ — chỉ dừng và đi tiếp («không chọn cũng là chọn») |

### 2.7 Chấm điểm

```
u   = trung bình các bước của max(0, 1 − |khoảngBước − 3 s| / 1,5 s)     (đều nhịp)
mỗi vọng niệm v:  g_v (giác: 1 nếu trong cửa sổ, 0 nếu lỡ) · d_v (đình: 1 nếu dừng ≥ 3 s) ·
                  c_v (chuyển: 1 chìa hợp nhất, 0,7 chìa cũng hợp, 0,5 chìa khác) · t_v (tịnh: 10 bước đều = 1)
w   = trung bình_v (0,30·g_v + 0,20·d_v + 0,30·c_v + 0,20·t_v)
s   = 0,40·u + 0,60·w
B_eff = min(10, 0,8 × số phút có bước)
thô = B_eff × f(s) × K_lặp × K_hư           s_min = 0,4
```

**Ví dụ (`MAU-A`, Yên Tử — TH, Mộc; không hợp Dụng / Hỷ):** 12 phút, `u = 0,72`; ba vọng niệm: (1, 1, 1, 1), (1, 1, 0,7, 0,8), (0, 1, 1, 1) → `w = (1 + 0,87 + 0,7)/3 = 0,857`. `s = 0,288 + 0,514 = 0,802` → `f = 0,861`. `B_eff = min(10, 9,6) = 9,6` → thô 8,3 → ĐH `8,3 × 1,19 = 9,9`.

### 2.8 Phần thưởng

| Hạng mục | Giá trị |
|---|---|
| Thô | ≤ 10 / lượt |
| Nguyên Khí | −4 |
| Phúc Khí | `round(thô × 0,5)` |
| Nhật Khóa | 1 việc nhóm **Thân** |
| Hành hương | trọn bốn chặng Yên Tử → hoạt động hành hương hoàn thành (thưởng ở `09-08`), dấu ấn «Hành hương Yên Tử» trong sổ |
| Thành tựu | «Một trăm lẻ tám bậc» (Sơn Môn, một lượt không lỡ giác) · «Bốn chặng một lòng» |

### 2.9 Trạng thái thất bại

| Trạng thái | Điều kiện | Xử lý |
|---|---|---|
| Chạy | khoảng bước < 1,2 s trong 10 bước | nhân vật tự dừng, thở; NPC nhắc |
| Lỡ giác | không chạm «Biết» kịp | vọng niệm «kéo» camera lệch nhẹ 5 giây rồi tự tan; pha sau vẫn chơi được |
| Chưa đạt | `s < 0,4` | `f = 0,15`, tiến độ hành hương vẫn giữ |

```
[CẢNH MG-20.F1 · bậc đá dưới chùa Hoa Yên · giờ Tỵ · người chơi bước vội liên tục]
THIỀN SƯ PHÁP KHÔNG (truclam_thiensu): (đứng chắn giữa bậc, chống gậy trúc) Đi đâu mà vội?
> Lựa chọn: ① «Lên Chùa Đồng ạ.» → [MG-20.F1a]  ② «Con sợ hết giờ.» → [MG-20.F1b]
[MG-20.F1a] THIỀN SƯ PHÁP KHÔNG: Chùa Đồng ở đó ba trăm năm rồi, không chạy mất đâu. Bậc đá dưới chân con thì con sắp bỏ qua.
[MG-20.F1b] THIỀN SƯ PHÁP KHÔNG: Giờ không hết. Chỉ có người hết kiên nhẫn thôi. Thở ra một hơi, rồi bước.
```

### 2.10 Trợ năng (riêng)

- «Bước tự động đều nhịp»: nhân vật tự bước, người chơi chỉ xử lý vọng niệm; `u` tính 1 (E6).
- Vọng niệm dạng âm (mức Trung+) luôn có phụ đề khi bật phụ đề.
- Cửa sổ giác nhân theo thanh dung sai chung (×1,5 / ×2).

### 2.11 Chống gian (riêng)

- Tiến độ hành hương do máy chủ đếm bước theo vị trí thật trên đường (không nhận «số bậc» từ client).
- Thời gian dừng ở pha «đình» đo bằng nhật ký thao tác (không bước trong ≥ 3 s).

### 2.12 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `kinhhanh_wander` | `wander_id, source (script/poison), g, d, key_chosen, c, t` |
| `kinhhanh_pace` | `mean_interval, rushing_events` |
| `pilgrimage_progress` | `route, stage, steps_total` |

Câu hỏi đo: chìa khóa nào người chơi chọn nhiều nhất cho từng loại vọng niệm (để tài liệu 06 viết thêm lời dẫn).

### 2.13 iOS

Giữ nguyên.

### 2.14 Nghiệm thu

- [ ] Năm pha theo đúng `GAI_XIN.steps`; bốn chìa khóa đúng `GAI_XIN.keys4`.
- [ ] Không có lựa chọn «chìa khóa sai hoàn toàn» (tối thiểu 0,5).
- [ ] Tiến độ hành hương giữ qua phiên, đếm theo vị trí máy chủ.
- [ ] Đi nhanh không làm tới nơi sớm hơn (tốc độ nhân vật bị giới hạn khi ở chế độ kinh hành).

---

## 3. `MG-21` · Phóng Sinh Đúng Pháp

### 3.1 Mục đích

Phóng sinh là pháp tu lâu đời của Tịnh Độ (canon §5.6; `remedy-fate › REMEDY_METHODS` «放生+吃素») và được ghi **3 công** trong Sổ Công Quá (`CONG_QUA.thien[0]`). Nhưng phóng sinh sai cách có hại thật: mua chim cá bắt về để thả tạo ra vòng «bắt – bán – thả – bắt lại»; thả loài ngoại lai phá hệ sinh thái. `MG-21` dạy **phóng sinh có trí tuệ**: cứu con vật đang gặp nạn thật, đúng loài, đúng nơi, đúng lúc; không mua để thả. Trụ cột: T6 (không hướng dẫn việc có hại), T5 (đúng tinh thần «cứu mạng»).

### 3.2 Engine dạy

| Nội dung | Nguồn | Dùng thế nào |
|---|---|---|
| Phóng sinh (cứu mạng) = 3 công | `remedy-fate › CONG_QUA.thien[0]` | công nhận khi cứu thành |
| «放生+吃素 — lượng sức mua sinh vật thả + giảm sát» | `remedy-fate › REMEDY_METHODS[2]` | **trích để đối chiếu**: game giữ ý «giảm sát, cứu mạng», sửa phần «mua để thả» bằng cứu hộ thật (giải thích trong thẻ) |
| «爱惜物命 — yêu tiếc mạng vật» | `remedy-fate › TEN_THIEN[9]` | câu giảng |
| Sát sinh nghiệp | `remedy-fate › YEGUO[0]` | nối sang `MG-23` |

Dữ kiện sinh thái (không phải engine; cần chuyên gia sinh học rà trước khi phát hành): danh mục loài ngoại lai xâm hại theo quy định của Bộ Tài nguyên và Môi trường (Thông tư 35/2018/TT-BTNMT — **kiểm lại văn bản hiện hành**), trong đó có **ốc bươu vàng**, **rùa tai đỏ**, **cá lau kính (cá dọn bể)**.

### 3.3 Luật chơi

Mỗi lượt là **một tình huống cứu**, rút từ bộ tình huống theo vùng và mùa:

| Tình huống | Nơi | Việc đúng | Bẫy |
|---|---|---|---|
| Cá mắc lưới ma (lưới bỏ) ven hồ | Cùng Thông Hồ, ao Bút Tháp | gỡ lưới không làm rách vây; cá yếu → thả vào chỗ nước nông có cây thủy sinh, không ném xa; **mang lưới về** (lưới còn ở đó sẽ giết cá khác) | cắt lưới rồi bỏ lại |
| Chim sẻ bị thương ngoài sân chùa | Bút Tháp | không cho ăn bừa, đặt vào hộp tối có lỗ thở, **giao người cứu hộ** (NPC trạm cứu hộ ở Huyền Thành) | tự băng cánh, giữ nuôi |
| Rùa bị bày bán ở chợ | chợ Huyền Thành | **không mua** (mua tạo cầu); ghi chỗ bán, báo NPC kiểm lâm; rùa được đưa về trung tâm bảo tồn (NPC) | mua về thả hồ chùa |
| Người bán chim phóng sinh ở cổng chùa | cổng Bút Tháp | nói chuyện: giải thích vòng bắt–bán–thả, gợi ý cách tích phúc khác (cứu hộ, ăn chay một ngày) | mua một lồng «cho khỏi tội» |
| Khách hành hương mang túi ốc định thả | bờ hồ Bút Tháp | nhận ra **ốc bươu vàng** (loài xâm hại) → khuyên không thả, đưa giải thích | thả cùng khách |
| Đàn cá rô đồng mắc cạn khi tháo nước ruộng | ruộng Lịch Đường | chuyển sang mương còn nước **cùng hệ** (ruộng → mương ruộng), ngâm túi 10–15 phút cho cân nhiệt | thả ra sông lớn nước chảy xiết |

**Ghép loài – nơi – lúc** (bước cuối của tình huống có thả):

| Loài (bản địa, quen thuộc) | Nơi phù hợp | Không phù hợp |
|---|---|---|
| Cá rô đồng | ruộng, mương, ao nước tĩnh | sông chảy xiết, nước mặn |
| Cá trê vàng | ao bùn, ruộng | hồ nước trong nghèo thức ăn |
| Lươn đồng | ruộng bùn | hồ sâu đáy cát |
| Ốc nhồi | ao, ruộng | — |
| Cá chép | hồ, ao lớn | ruộng cạn mùa khô |

Lúc thả: tránh trưa nắng gắt và lúc nước đổi nhiệt đột ngột; thả nhẹ sát mặt nước.

### 3.4 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Gỡ lưới (nút thắt) | kéo từng sợi theo hướng mũi tên mờ | chọn nút `Tab`, `←→` gỡ | kéo |
| Chọn hành động | chạm thẻ | `1`–`4` | nhấp |
| Thoại khuyên | chọn câu | `1`–`3` | nhấp |
| Thả | giữ – thả chậm sát mặt nước | giữ / nhả `Space` | giữ / nhả |
| Mở thẻ loài | chạm biểu tượng ⓘ | `I` | nhấp |

### 3.5 Bố cục giao diện

```
┌──────────────────────────────────────────────┐
│ Bờ hồ Bút Tháp · giờ Thìn · tình huống: túi ốc   │
│                                              │
│  KHÁCH: «Thả mấy con ốc này để tích phúc, cô ạ.»   │
│  [ ⓘ Xem kỹ con ốc ]                           │
│   vỏ vàng nâu, trứng hồng bám bờ → ?            │
│                                              │
│  ① «Thả cùng chị cho vui.»                      │
│  ② «Đây là ốc bươu vàng, thả ra hại lúa cả vùng.» │
│  ③ «Thả ở hồ khác xa hơn.»                      │
│                                              │
│  Ni sư Diệu Âm đứng gần đó, lần tràng hạt.        │
└──────────────────────────────────────────────┘
```

### 3.6 Đường cong độ khó

| Mức | Tình huống có | Gợi ý | Khác |
|---|---|---|---|
| Sơ | cá mắc lưới, cá rô mắc cạn | thẻ loài mở sẵn | — |
| Trung | + chim bị thương, túi ốc | thẻ loài phải tự mở | loài ngoại lai trông giống loài bản địa |
| Thâm | + rùa ở chợ, người bán chim | không gợi ý | thoại khuyên có 4 lựa chọn, 2 lựa chọn «nghe có vẻ đúng» |
| Viên Thông | tình huống tổng hợp (một buổi sáng 3 việc) | không | dẫn đoàn hành hương (NPC) làm đúng, dạy lại cho họ |

### 3.7 Chấm điểm

```
a = 1 nếu chọn đúng hành động chính (bảng §3.3), 0 nếu rơi vào «bẫy»
h = 1 nếu ghép đúng loài – nơi, 0,5 nếu nơi chấp nhận được, 0 nếu sai (tình huống không thả: h = a)
k = 1 nếu thao tác cẩn thận (gỡ lưới không rách, thả chậm), giảm theo số lỗi
r = 1 nếu làm việc phụ đúng (mang lưới về, ghi chỗ bán rùa, giải thích cho khách), 0 nếu bỏ qua
s = 0,40·a + 0,25·h + 0,20·k + 0,15·r
thô = 5 × f(s) × K_lặp × K_hư           s_min = 0,6
Công: s ≥ 0,8 → 3 công · 0,6 ≤ s < 0,8 → 2 công · dưới → 0.  Trần công từ MG-21: 3 / ngày
```

**Ví dụ (`MAU-A`, Bút Tháp — TD, Kim = Hỷ):** tình huống túi ốc: chọn ②, mở thẻ loài, giải thích → `a = 1`, `h = 1`, `k = 1`, `r = 1` → `s = 1` → thô 5 → ĐH `5 × 1,19 × 1,05 = 6,2`; **3 công** → +3 thô ngoài trần (`09-03` §9) → ĐH thêm `3 × 1,19 × 1,05 = 3,7` (công ghi ở Sổ Công Quá, ĐH từ công không nhân `K_sung`).

### 3.8 Phần thưởng

| Hạng mục | Giá trị |
|---|---|
| Thô | ≤ 5 / lượt |
| Công | ≤ 3 / ngày (theo §3.7) |
| Nguyên Khí | −3 |
| Phúc Khí | `round(thô × 0,5)` |
| Nhật Khóa | 1 việc nhóm **Hạnh** |
| Sự kiện | Phật đản, Vu Lan: phóng sinh tập thể (tài liệu 10, `EV-*`), dùng đúng luật này |
| Thành tựu | «Không mua để thả» (từ chối người bán chim ở mức Thâm) · «Người giữ hồ» (mang về 10 tấm lưới ma) |

### 3.9 Trạng thái thất bại

| Trạng thái | Điều kiện | Xử lý |
|---|---|---|
| Thả loài xâm hại | thả ốc bươu vàng / rùa tai đỏ / cá lau kính | **sau khi** người chơi đã được giảng ít nhất một lần: trừ 3 ĐH (`09-03` §10.2), sám hối được; lần đầu chưa được giảng: không trừ, chỉ giảng |
| Mua để thả | mua lồng chim / rùa | không có công; NPC giảng; không trừ ĐH (thiện ý sai cách) |
| Chưa đạt | `s < 0,6` | `f = 0,15`, không công |

```
[CẢNH MG-21.F1 · bờ hồ Bút Tháp · giờ Thìn · người chơi vừa thả túi ốc bươu vàng]
NI SƯ DIỆU ÂM (dieu_am): (cúi nhìn mặt hồ, im một lúc) Con thương chúng, ta biết.
NI SƯ DIỆU ÂM: Nhưng loài ốc này ăn mạ non. Mùa tới, ruộng quanh chùa sẽ mất lúa, người ta lại phải đi bắt, đi rải thuốc. Một túi ốc thành ra bao nhiêu sát sinh.
NI SƯ DIỆU ÂM: Thương mà không biết thì thương cũng làm khổ. Ta cùng ra vớt lại đi.
> Lựa chọn: ① «Vâng, con vớt lại.» → [nhiệm vụ nhỏ vớt ốc; hoàn thành → hoàn 50% ĐH bị trừ]  ② «Con xin sám hối.» → [MG-06 chế độ sám hối, 09-03 §10.4]
```

### 3.10 Trợ năng (riêng)

- Gỡ lưới có chế độ «gỡ từng nút bằng chạm» thay vì kéo.
- Thẻ loài có ảnh minh họa và mô tả bằng chữ (không chỉ dựa vào màu vỏ).
- Không có giới hạn thời gian trong thoại khuyên.

### 3.11 Chống gian (riêng)

- Tình huống rút theo hạt giống của máy chủ; một tình huống không lặp lại trong 7 ngày.
- Công chỉ cộng ở máy chủ, có trần ngày; không đổi công lấy vật phẩm bán được.

### 3.12 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `release_scenario` | `scenario_id, a, h, k, r, s` |
| `release_trap` | `scenario_id, trap_type (buy/invasive/wrong_habitat)` |
| `release_species_card` | `species_id, opened_before_decision (bool)` |

Chỉ tiêu học: tỉ lệ rơi bẫy «thả loài xâm hại» ở lần gặp thứ hai < 10%.

### 3.13 iOS

Giữ nguyên.

### 3.14 Nghiệm thu

- [ ] Không có tình huống nào khen thưởng việc **mua** con vật để thả.
- [ ] Danh mục loài xâm hại có ghi nguồn văn bản và ngày rà soát; chuyên gia ký duyệt.
- [ ] Trừ ĐH thả loài xâm hại chỉ áp dụng sau lần giảng đầu.
- [ ] Công ≤ 3 / ngày.

---

## 4. `MG-22` · Đối Chất Định Mệnh Hội

### 4.1 Mục đích

Định Mệnh Hội là phe phản diện «định mệnh luận + lừa đảo tâm linh», có quầy «đổi mệnh» ở mọi vùng (canon §4). `MG-22` là vũ khí của người chơi: **kiểm chứng lời phán bằng lá số thật**, gọi đúng tên thủ đoạn, rồi nói với nạn nhân bằng sự thật và lòng tốt. Đây là cách game «chiến đấu» mà không sát phạt (T3), và là trái tim của trụ cột T2 (không phán mệnh đã định) và T5 (đúng cổ pháp, không bịa).

### 4.2 Engine dạy

| Nội dung | Nguồn | Dùng thế nào |
|---|---|---|
| Lá số nạn nhân (NPC, ngày giờ sinh thật sinh ngẫu nhiên) | `npc.js › makeNpc`, `chart › analyze` | kiểm Dụng thần, vượng nhược, ngũ hành |
| Thái Tuế năm nay của nạn nhân | `src/game/thaitue.js › thaiTue(birthYearZhi, birthYear, date)` (`.me` = phạm gì) | kiểm lời «năm nay phạm Thái Tuế» |
| Năm can chi | `thaitue.js › suiYear` | |
| Năm ranh giới không vượt qua | `anti-manipulation-data › ANTI_MANIPULATION_DATA.refusalBoundaries` (RB1 y khoa tất định · RB2 định mệnh tất định · RB3 hại người thứ ba · RB4 tiền bạc chắc thắng · RB5 bán «giải thuật») | gọi tên thủ đoạn; câu trả lời mẫu lấy từ `caveatTemplate` |
| Mẫu thủ đoạn hội thoại | `ANTI_MANIPULATION_DATA.detectionPatterns` (DP1 câu hỏi mớm · DP4 viện uy quyền ngoài · DP6 ép tất định · DP7 nhắm người vắng mặt …) | thẻ «thủ đoạn» |
| Kiểm tiền đề về lá số | `ANTI_MANIPULATION_DATA.premiseToIndicatorCrossCheck` (PR1–PR7) | bước kiểm chứng lời «Dụng thần anh là…» |
| Neo dữ kiện | `checkNeo` (AI không bịa — canon T5) | lời thoại AI của NPC lừa đảo (nếu bật AI) không được nói sai dữ kiện **về luật chơi**; lời sai là lời **kịch bản cố ý** có cờ `falseClaim` |

### 4.3 Luật chơi

1. **Nghe phán:** thầy bói của Hội nói 4–6 lời với nạn nhân (kịch bản sinh từ mẫu + lá số thật của nạn nhân). Mỗi lời thuộc một loại:
   - **Dữ kiện lá số** — có lời đúng, có lời sai cố ý (vd «Dụng thần anh là Kim»);
   - **Dữ kiện Thái Tuế** — đúng hoặc sai;
   - **Tất định** (RB2) — «số anh khắc vợ, không đổi được»;
   - **Y khoa tất định** (RB1) — «sang năm chắc mắc bệnh thận»;
   - **Bán giải thuật** (RB5) — «phải cúng giải hạn bảy triệu»;
   - **Thúc ép / viện uy quyền** (DP4, DP6) — «thầy lớn trên núi đã xem, phải làm trước rằm».
2. **Kiểm chứng:** với mỗi lời, đánh dấu **Đúng / Sai / Không thể kiểm** (lời tất định, lời tương lai là «không thể kiểm» — đó cũng là một cách vạch). Công cụ: mở lá số nạn nhân (bảng tứ trụ, ngũ hành %, vượng nhược, Dụng / Hỷ / Kỵ), mở thẻ Thái Tuế năm nay.
3. **Gọi tên thủ đoạn:** kéo thẻ thủ đoạn (tên thân thiện: «Dọa cho sợ», «Ép phải nhanh», «Mượn danh thầy lớn», «Nói như đinh đóng cột», «Bán cách giải») vào từng lời.
4. **Nói với nạn nhân:** chọn 1 trong 3–4 câu. Câu tốt nhất: sửa dữ kiện sai bằng lá số thật, không chê bai nạn nhân, đưa một việc làm được **miễn phí** theo Dụng thần (đúng `RB5.caveatTemplate`), nhắc «xu hướng chứ không định sẵn».
5. **(Tùy chọn) Báo:** báo quầy cho người giữ trật tự vùng (NPC) — mở nhiệm vụ phụ dẹp quầy.

### 4.4 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Đánh dấu Đúng / Sai / Không thể kiểm | chạm 1 trong 3 nút cạnh lời | chọn lời `↑↓`, `1`/`2`/`3` | nhấp |
| Mở lá số / Thái Tuế | tab trên cùng | `C` / `T` | nhấp |
| Gắn thẻ thủ đoạn | kéo thẻ vào lời | chọn thẻ `Q`…`T`, `Enter` gắn vào lời đang chọn | kéo thả |
| Chọn câu nói | chạm | `1`–`4` | nhấp |

### 4.5 Bố cục giao diện

```
┌──────────────────────────────────────────────────┐
│ Quầy «Đổi Mệnh» · chợ Huyền Thành · nạn nhân: anh Ngọ │
│ [Lời phán] [Lá số] [Thái Tuế]                         │
│ ① «Anh mệnh Kim yếu, phải bổ Kim.»     [Đ][S✓][?]  ⟨—⟩ │
│ ② «Năm nay anh phạm Thái Tuế.»         [Đ✓][S][?]      │
│ ③ «Số anh khắc vợ, không đổi được.»     [Đ][S][?✓] ⟨Nói như đinh đóng cột⟩ │
│ ④ «Cúng bảy triệu trước rằm mới qua.»   [Đ][S][?✓] ⟨Bán cách giải⟩⟨Ép nhanh⟩ │
│                                                  │
│ Thẻ: [Dọa cho sợ][Ép phải nhanh][Mượn danh thầy lớn]  │
│      [Nói như đinh đóng cột][Bán cách giải]          │
│                         [ Nói với anh Ngọ → ]        │
└──────────────────────────────────────────────────┘
```

### 4.6 Đường cong độ khó

| Mức | Số lời | Lời sai về lá số | Công cụ | Khác |
|---|---|---|---|---|
| Sơ | 4 | sai lộ (Dụng thần ngược hẳn) | lá số có nhãn tiếng Việt, Dụng thần tô sẵn | 1 thủ đoạn / lời |
| Trung | 5 | sai tinh vi (đúng hành mạnh nhất nhưng kết luận sai «cần bổ») | không tô sẵn Dụng thần | lời trộn 2 thủ đoạn |
| Thâm | 6 | sai về vượng nhược, đắc lệnh (phải đọc bảng lực trợ / khắc) | như Trung | nạn nhân phản bác («nhưng ông ấy nói trúng chuyện nhà tôi!») — phải giải thích «nói trúng quá khứ ≠ đoán được tương lai» |
| Viên Thông | 6 | như Thâm | như Trung | đối chất **trực tiếp** với thầy bói (Khổng tiên sinh — `khong_tiensinh` — xuất hiện ở các quầy lớn); không được lên giọng (câu xúc phạm bị trừ điểm) |

### 4.7 Chấm điểm

```
v = số lời đánh dấu đúng loại (Đúng / Sai / Không thể kiểm) / số lời
t = Jaccard( thủ đoạn gắn , thủ đoạn đáp án ) trung bình trên các lời có thủ đoạn
     (Jaccard như halls.js › gradeStep kind 'many')
c = 1 câu nói tốt nhất · 0,6 câu đúng sự thật nhưng lạnh lùng / chê nạn nhân · 0,3 câu chỉ phủ nhận · 0 câu hù ngược lại
s = 0,40·v + 0,30·t + 0,30·c
thô = 8 × f(s) × K_lặp × K_hư           s_min = 0,5
Công: s ≥ 0,7 → 2 công («Khuyên người làm thiện» / «Giúp người khó khăn», CONG_QUA.thien). Trần 2 công / ngày từ MG-22
```

**Ví dụ — nạn nhân có lá số trùng `MAU-A` (1990-05-15 08:30 nam), năm 2026:**

| Lời phán | Kiểm bằng | Đáp án | Thủ đoạn |
|---|---|---|---|
| «Anh mệnh Kim yếu, phải đeo thêm vàng bạc bổ Kim.» | lá số: Kim 55% (mạnh nhất), Dụng Thủy, Hỷ Kim | **Sai** (Kim không yếu; Dụng là Thủy) | — |
| «Năm nay anh phạm Thái Tuế.» | `thaiTue('午', 1990, 2026).me` | **Đúng** (Trị + Hình) | Dọa cho sợ (khi đi kèm câu sau) |
| «Số anh khắc vợ, không đổi được.» | RB2 | **Không thể kiểm** | Nói như đinh đóng cột |
| «Cúng bảy triệu trước rằm mới qua hạn.» | RB5 | **Không thể kiểm** | Bán cách giải · Ép phải nhanh |

Câu nói tốt nhất (c = 1): «Năm nay anh đúng là phạm Thái Tuế, nhưng phạm là để cẩn thận, không phải để sợ. Dụng thần của anh là Thủy chứ không phải Kim — anh chịu khó nghỉ ngơi, uống đủ nước, dùng màu xanh biển, đi về phương Bắc khi có dịp. Mấy việc ấy không tốn đồng nào. Còn chuyện vợ chồng là chuyện hai người cùng vun, không lá số nào định sẵn.»
Người chơi `MAU-A` (chơi ở chợ Huyền Thành — trung lập): `v = 1`, `t = 1`, `c = 1` → `s = 1` → thô 8 → ĐH 9,5; 2 công → ĐH thêm `2 × 1,19 = 2,4`.

### 4.8 Phần thưởng

| Hạng mục | Giá trị |
|---|---|
| Thô | ≤ 8 / lượt |
| Công | ≤ 2 / ngày |
| Nguyên Khí | −8 |
| Phúc Khí | `round(thô × 0,5)` |
| Nhật Khóa | 1 việc nhóm **Hạnh** |
| Cốt truyện | đếm số quầy đã vạch ở từng vùng (tài liệu 03 dùng làm điều kiện mở cảnh với `lo_ban_su`) |
| Thành tựu | «Mười quầy đã đóng» · «Không lên giọng» (đối chất Viên Thông với `khong_tiensinh` không có câu xúc phạm) |

### 4.9 Trạng thái thất bại

| Trạng thái | Điều kiện | Xử lý |
|---|---|---|
| Nạn nhân vẫn tin Hội | `c ≤ 0,3` | nạn nhân bỏ đi đóng tiền; NPC kể lại hôm sau; người chơi có thể gặp lại nạn nhân (nhiệm vụ phụ) |
| Hù ngược lại | chọn câu dọa nạn nhân bằng một điều khác | `c = 0`; nạn nhân sợ thêm; NPC thầy nhắc |
| Chưa đạt | `s < 0,5` | `f = 0,15`, không công |

```
[CẢNH MG-22.F1 · chợ Huyền Thành · giờ Mùi · sau khi người chơi chọn câu «Ông ta bịp đấy, anh ngốc quá»]
THẦY TỬ BÌNH (thay_tubinh): (đặt chén trà xuống) Con nói đúng một nửa.
THẦY TỬ BÌNH: Ông kia bịp, đúng. Nhưng người nghe con không thấy được cứu — người ta thấy mình bị gọi là ngốc. Người đang sợ thì không nghe được lời chê.
THẦY TỬ BÌNH: Lần sau, nói cái đúng trước, nói cái làm được sau, đừng nói ai ngốc cả.
> Lựa chọn: ① «Con đi tìm anh ấy nói lại.» → [nhiệm vụ phụ gặp lại nạn nhân]  ② «Con hiểu rồi ạ.» → [kết thúc]
```

### 4.10 Trợ năng (riêng)

- Bảng lá số có chế độ «đọc to» (tứ trụ, ngũ hành %, Dụng thần).
- Thẻ thủ đoạn có thể gắn bằng chọn từ danh sách thay vì kéo thả.
- Không giới hạn thời gian.

### 4.11 Chống gian (riêng)

- Đáp án (đúng / sai / không thể kiểm, thủ đoạn) sinh ở máy chủ cùng kịch bản; client chỉ nhận lời phán.
- Lời sai cố ý gắn cờ `falseClaim` trong dữ liệu kịch bản để `checkNeo` không «sửa» chúng, nhưng **mọi lời của NPC phe thiện** vẫn qua `checkNeo`.

### 4.12 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `doichat_claim` | `claim_type, truth (T/F/U), marked, ok` |
| `doichat_tactic` | `claim_idx, tactics_true[], tactics_marked[]` |
| `doichat_speech` | `option_id, c` |
| `doichat_report` | `region` |

Chỉ tiêu học: sau 5 lượt, tỉ lệ đánh dấu «Không thể kiểm» đúng cho lời tất định ≥ 80%.

### 4.13 iOS

Giữ nguyên — chỉ phân tích lá số **NPC**, không có vận hạn của người chơi. Trên iOS bỏ thẻ Thái Tuế nếu App Review coi là «bói»: thay lời phán Thái Tuế bằng lời phán về ngũ hành (đề xuất mặc định: **bỏ** để an toàn).

### 4.14 Nghiệm thu

- [ ] Mỗi lời phán có đáp án do engine tính (`analyze`, `thaiTue`), không viết tay.
- [ ] Câu nói tốt nhất luôn có việc làm miễn phí theo Dụng thần, không có lời hứa tất định.
- [ ] Thủ đoạn ánh xạ đúng RB / DP của `anti-manipulation-data`.
- [ ] Không có câu thoại xúc phạm được thưởng.

---

## 5. `MG-23` · Sổ Nghiệp Giải Oan

### 5.1 Mục đích

Phong Đô là âm ty — nơi Bắc Đế, Động Uyên và Địa Tạng giao nhau (canon §3). `MG-23` là việc của người tu ở đó: **đọc sổ nghiệp** của một vong (hay của chính mình), nhận ra mỗi việc đã làm thuộc nghiệp nào, chọn pháp sám và kinh phù hợp, tìm việc **hoàn trả** ở cõi người, rồi hồi hướng. Không có quỷ để diệt; chỉ có những đời người chưa khép lại. Trụ cột: T2 (nghiệp chuyển được), T3, T6 (âm tà là tự nguyện bật).

### 5.2 Engine dạy

| Nội dung | Nguồn | Dùng thế nào |
|---|---|---|
| Mười ác nghiệp và quả | `remedy-fate › YEGUO` (Sát sinh, Thâu đạo, Tà dâm, Vọng ngữ, Lưỡng thiệt, Ác khẩu, Ỷ ngữ, Tham, Sân, Si) | phân loại trang sổ |
| Năm pháp sám | `remedy-fate › CHAN_HUI` (88 Phật · Kim Cang Tát Đỏa · 35 Phật · Địa Tạng Chiêm Sát · Pháp Hoa / Đại Bi) | chọn pháp sám |
| Kinh theo việc | `remedy-fate › JING_ZHOU` (7 ánh xạ vấn đề → kinh) | chọn kinh |
| «Nghiệp từ tâm khởi, tâm chuyển thì nghiệp tiêu» | `remedy-fate › CHANHUI_PRINCIPLE` | câu đầu sổ |
| Phía Đạo giáo của Phong Đô | `talisman-data` các mục thần chú phái Bắc Đế / Phong Đô và Động Uyên (`layer: 'mantra'`, school «北帝派 / 酆都派», «洞淵派») | lựa chọn «khoa Đạo» song song khoa Phật |
| Âm tà tự nguyện bật | `amta-data › ETHICS.optInRequired`, `.toneRules`, `.referralNote` | hình ảnh vong chỉ hiện khi bật; ngôn từ «có thể / theo cổ pháp» |

### 5.3 Luật chơi

1. **Mở sổ:** Phán quan Thôi (`phan_quan`) mở sổ một vong — một NPC đã khuất trong cốt truyện vùng (kịch bản tài liệu 03 / 05), hoặc «sổ của chính mình» (chế độ tự sám).
2. **Phân loại:** mỗi trang kể một việc (2–3 câu, đời thường: «Ông bán cân điêu ở chợ mười năm», «Bà nói dối con dâu để giữ của»). Kéo trang vào một trong mười nghiệp. Có trang **không phải nghiệp** (một việc buồn nhưng không ác) — phải nhận ra để không kết tội oan.
3. **Chọn pháp sám và kinh:** với mỗi nghiệp, chọn pháp sám phù hợp nhất (bảng dưới) và kinh theo `JING_ZHOU` nếu có. Người chơi chọn «khoa Phật» (Địa Tạng sứ giả dẫn) hoặc «khoa Đạo» (khoa nghi Bắc Đế – Động Uyên, chỉ nêu tên kinh, không trích chú).
4. **Hoàn trả:** chọn một việc ở cõi người để «trả» (vd tìm con cháu người bị cân điêu, trả lại đúng số; viết thư xin lỗi thay). Việc này sinh nhiệm vụ nhỏ ở vùng tương ứng (tài liệu 05 cấp `DEED-*`).
5. **Hồi hướng:** chọn lời hồi hướng; sổ khép, vong «được dẫn ra» (canon: `diatang_su` dẫn người ra).

**Ánh xạ chuẩn (đáp án mặc định; kịch bản có thể ghi đè có lý do):**

| Tình huống trang sổ | Pháp sám hợp nhất (`CHAN_HUI`) | Kinh (`JING_ZHOU`) |
|---|---|---|
| Nhiều nghiệp chung, không rõ từng việc | 八十八佛大忏悔文 (sám chung) | — |
| Một nghiệp cụ thể, người phạm đã nhận ra | 三十五佛忏悔 (biệt sám từng nghiệp) | — |
| Không rõ đã phạm gì, chỉ thấy khổ | 地藏占察忏 | 地藏经 (nghiệp nặng / tổ tiên) |
| Phạm giới rồi hối hận | 金刚萨埵百字明咒 (**chờ tham vấn Tạng truyền** — mặc định ẩn, thay bằng 三十五佛) | — |
| Nghiệp do khẩu (vọng ngữ, ác khẩu, lưỡng thiệt) | 三十五佛忏悔 | — |
| Nghiệp do si mê, chấp trước | 法华忏 / 大悲忏 | 金刚经 (chấp trước, cầu trí tuệ) |
| Vong chết vì tai nạn | 法华忏 / 大悲忏 | 普门品 (tai nạn, cấp khó) |

### 5.4 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Lật trang | vuốt ngang | `←` `→` | nhấp mép sổ |
| Phân loại | kéo trang vào ô nghiệp | `1`–`0` (mười nghiệp), `N` (không phải nghiệp) | kéo thả |
| Chọn pháp sám / kinh | chạm thẻ | `Q`…`T` / `A`…`G` | nhấp |
| Chọn hoàn trả, hồi hướng | chạm | `1`–`3` | nhấp |

### 5.5 Bố cục giao diện

```
┌──────────────────────────────────────────────────┐
│ Phong Đô · Điện Phán Quan · sổ của ông Lý (hàng cân) │
│ ┌─────────────── trang 3/6 ───────────────┐        │
│ │ «Mười năm bán gạo ở chợ, ông chỉnh cân     │        │
│ │  nhẹ đi hai lạng mỗi yến.»                 │        │
│ └────────────────────────────────────────┘        │
│ Nghiệp: [Sát][Thâu đạo✓][Tà dâm][Vọng ngữ][Lưỡng thiệt]│
│         [Ác khẩu][Ỷ ngữ][Tham][Sân][Si] [Không phải nghiệp]│
│ Sám:   [88 Phật][35 Phật✓][Địa Tạng][Pháp Hoa/Đại Bi]  │
│ Hoàn trả: ① tìm con cháu khách cũ, trả lại tiền chênh   │
│ PHÁN QUAN THÔI: «Sổ ghi đủ. Ghi đủ không phải để phạt.» │
└──────────────────────────────────────────────────┘
```

### 5.6 Đường cong độ khó

| Mức | Số trang | Trang «không phải nghiệp» | Pháp sám | Khác |
|---|---|---|---|---|
| Sơ | 4 | 0 | gợi ý 2 lựa chọn | — |
| Trung | 6 | 1 | đủ 4 lựa chọn | một trang thuộc hai nghiệp (chọn nghiệp gốc) |
| Thâm | 8 | 2 | đủ, kèm kinh | sổ của **một gia đình** (ba đời), nghiệp nối nhau |
| Viên Thông | 8 | 2 | đủ | giải oan **hai phía**: vong và người còn sống đang oán vong — hoàn trả phải làm cả hai |

### 5.7 Chấm điểm

```
k = số trang phân loại đúng / số trang         (trang «không phải nghiệp» đúng khi để ô N)
p = trung bình các nghiệp của: 1 pháp sám hợp nhất · 0,5 pháp sám chấp nhận (88 Phật cho mọi nghiệp) · 0 khác
j = trung bình kinh (chỉ ở trang có kinh đáp án): 1 đúng · 0 sai
h = 1 nếu chọn hoàn trả cụ thể (trả đúng người, đúng thứ), 0,5 nếu chung chung («làm việc thiện»)
s = 0,40·k + 0,30·p + 0,10·j + 0,20·h          (mức Sơ, Trung không có j: chia lại 0,45·k + 0,30·p + 0,25·h)
thô = 8 × f(s) × K_lặp × K_hư           s_min = 0,5
```

**Ví dụ (`MAU-A` giả định đã chủ tu `BD`, Phong Đô — BD, Thủy = Dụng):** sổ ông Lý mức Trung, 6 trang, phân loại đúng 5 (nhầm trang hai nghiệp), pháp sám 4 hợp nhất + 1 chấp nhận, hoàn trả cụ thể → `k = 0,833`, `p = 0,9`, `h = 1` → `s = 0,375 + 0,27 + 0,25 = 0,895` → `f = 0,927` → thô 7,4 → ĐH `7,4 × 1,19 × 1,10 = 9,7`.

**Chế độ tự sám** (sổ của chính mình): trang là các lỗi phạm giới thật của người chơi trong game (`09-03` §10.2). Chọn đúng nghiệp + 三十五佛 → khôi phục **100%** ĐH bị trừ của lỗi đó (`09-03` §10.4); thô của chế độ này **không** tính (tránh vòng «phạm để sám lấy điểm»).

### 5.8 Phần thưởng

| Hạng mục | Giá trị |
|---|---|
| Thô | ≤ 8 / lượt (sổ vong) · 0 (tự sám — chỉ khôi phục) |
| Nguyên Khí | −8 |
| Nợ Âm | mỗi sổ vong hoàn thành với `s ≥ 0,7` trả **10 Nợ Âm** (`09-03` §10.3) |
| Công | việc hoàn trả hoàn thành ở cõi người: theo `DEED-*` (tài liệu 05) |
| Nhật Khóa | 1 việc nhóm **Hạnh** |
| Thành tựu | «Không kết tội oan» (10 trang «không phải nghiệp» nhận đúng) · «Ba đời khép sổ» |

### 5.9 Trạng thái thất bại

| Trạng thái | Điều kiện | Xử lý |
|---|---|---|
| Kết tội oan | xếp trang «không phải nghiệp» vào một nghiệp | Phán quan gấp trang lại, nhắc; `k` giảm |
| Hoàn trả chung chung | `h = 0,5` | vong được dẫn ra nhưng người sống chưa nguôi — nhiệm vụ phụ còn mở |
| Chưa đạt | `s < 0,5` | sổ để lại bàn, mai đọc tiếp (không mất tiến độ trang đã làm đúng) |

```
[CẢNH MG-23.F1 · Điện Phán Quan, Phong Đô · giờ Tý · người chơi xếp trang «ông khóc ba ngày khi vợ mất» vào nghiệp Si]
PHÁN QUAN THÔI (phan_quan): (đặt bút xuống, không ghi) Khóc vợ là nghiệp gì?
> Lựa chọn: ① «Con xếp nhầm. Đó không phải nghiệp.» → [MG-23.F1a]  ② «Là chấp trước ạ.» → [MG-23.F1b]
[MG-23.F1a] PHÁN QUAN THÔI: Phải. Sổ này ghi việc làm khổ người, không ghi việc thương người.
[MG-23.F1b] PHÁN QUAN THÔI: Chấp trước thì có. Nhưng ta không kết tội người vì đã thương. Gỡ trang ấy ra.
ĐỊA TẠNG SỨ GIẢ (diatang_su): (đứng ở cửa điện) Đọc sổ là để dẫn người ra, không phải để giữ người lại.
```

### 5.10 Trợ năng (riêng)

- Âm tà **tắt** (mặc định cho người chưa bật): Phong Đô hiện như một **văn khố cổ**, «vong» là người đã khuất kể qua di vật, không có hình ma; thoại giữ nguyên ý.
- Không âm thanh dọa, không hình giật mình (cấm jump scare trong toàn vùng Phong Đô).
- Phân loại có thể chọn từ danh sách thay vì kéo thả; trang đọc to được.
- Người chơi đang buồn (từ khóa trong công án hoặc lựa chọn «con đang mất người thân» ở cảnh mở) được mời **dừng** và hiện thông tin hỗ trợ theo `amta-data › ETHICS.referralNote`.

### 5.11 Chống gian (riêng)

- Đáp án gắn kịch bản sổ ở máy chủ; sổ vong mỗi người không trùng trong 30 ngày.
- Chế độ tự sám chỉ mở khi có lỗi phạm giới chưa sám; mỗi lỗi sám một lần (khóa ở máy chủ).

### 5.12 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `ledger_page` | `page_id, karma_true, karma_marked, ok, not_karma (bool)` |
| `ledger_remedy` | `karma, chanhui_chosen, jing_chosen, school (phat/dao)` |
| `ledger_restitution` | `type (specific/generic), deed_spawned (bool)` |
| `ledger_selfrepent` | `fault_type, restored_dh` |
| `phongdo_comfort_offered` | (đã hiện thông tin hỗ trợ) |

### 5.13 iOS

Giữ nguyên, **mặc định âm tà tắt** và không cho bật trên iOS (thận trọng với App Review); Phong Đô hiện dạng văn khố.

### 5.14 Nghiệm thu

- [ ] Mười nghiệp đúng `YEGUO`; năm pháp sám đúng `CHAN_HUI`; kinh đúng `JING_ZHOU`.
- [ ] Kim Cang Tát Đỏa ẩn cho tới khi có kết quả tham vấn Tạng truyền.
- [ ] Có trang «không phải nghiệp» từ mức Trung; xếp sai bị nhắc.
- [ ] Không jump scare; chế độ văn khố đầy đủ thoại.
- [ ] Tự sám khôi phục đúng `09-03` §10.4 và không sinh thô.

---

## 6. `MG-24` · Tam Chẩn Cứu Người

### 6.1 Mục đích

Mao Sơn là trừ tà **chính tông** và «chẩn đoán đời thực» (canon NPC `maoshan_daonhan`). Người làng tìm đến vì nghĩ mình «trúng yểm». `MG-24` dạy thứ tự đúng của người tử tế: **thân trước, nhà sau, tà sau cùng** — và thường thì kẻ «yểm» là Định Mệnh Hội bày ra để bán bùa giải. Trụ cột: T6 (không chẩn bệnh, không dọa, ưu tiên y tế), T5 (đúng cổ pháp Mao Sơn chính tông: không khẳng định «chắc chắn bị tà»).

### 6.2 Engine dạy

| Nội dung | Nguồn | Dùng thế nào |
|---|---|---|
| Xu hướng tạng yếu theo lá số (không chẩn đoán) | `tcm › analyzeHealth(R)` | bước 1: gợi ý câu hỏi về giấc ngủ, ăn uống, mệt mỏi — luôn kèm caveat RB1 |
| Tra triệu chứng đông y | `tcm › answerHealth(q, R)` | bước 1: thẻ «sách nói gì» |
| Đồng hồ kinh mạch | `tcm › MERIDIAN_CLOCK` | vd mất ngủ giờ Sửu → «can» (gợi ý nghỉ ngơi, không kết luận bệnh) |
| Sát trong nhà | `fs-cure › findCure(keyword)`, `SHA_LIST` (vd `jingzi` gương đối giường, `hengliang` xà ngang đè đầu, `kaimenjiandao` mở cửa thấy bếp, `dengzhu` cột điện đối cửa) | bước 2 |
| Ranh giới âm tà | `amta-data › ETHICS.forbiddenAbsoluteClaims`, `.toneRules`, `.referralNote`; `amta-data › ritualsMaoShan` (chỉ tên và bối cảnh) | bước 3, chỉ khi người chơi đã bật âm tà |
| Không chẩn y khoa tất định | `anti-manipulation-data › refusalBoundaries` RB1 | mọi câu kết luận bước 1 |

### 6.3 Luật chơi

Mỗi ca có một bệnh nhân NPC (lá số thật từ `makeNpc`), người nhà kể chuyện «trúng yểm», và **một nguyên nhân thật** ẩn trong ba lớp (kịch bản chọn; có ca nhiều nguyên nhân).

1. **Chẩn thân (đời thực):** hỏi 4 câu trong danh sách 8 (ngủ, ăn, việc làm, thuốc đang dùng, rượu, tin dữ gần đây, đau ở đâu, từ khi nào). Đọc gợi ý xu hướng từ `analyzeHealth`. Bắt buộc chọn ít nhất: **«đưa đi khám bác sĩ»** + một lời khuyên sinh hoạt.
2. **Chẩn trạch (nơi ở):** vào phòng bệnh nhân (bố cục từ trên xuống như `MG-08`), tìm 1–3 điểm bất ổn: sát phong thủy (`SHA_LIST`) **và nguy hiểm thật**:
   - bếp than / lò sưởi trong phòng kín → **nguy cơ ngộ độc khí CO** → mở thông gió, bỏ bếp khỏi phòng ngủ (đây là nguyên nhân «bị đè, khó thở, đau đầu buổi sáng» trong nhiều ca);
   - nấm mốc tường ẩm → hô hấp;
   - đèn đường chiếu thẳng giường → mất ngủ.
   Chọn cách sửa: ưu tiên **bố trí lại** trước vật phẩm (như `MG-08`).
3. **Chẩn tâm / tà (chỉ khi bật âm tà):** dùng cách Mao Sơn chính tông: không nói «chắc bị tà», lắng nghe, an thần (nghi lễ chỉ nêu tên và ý nghĩa), và **tìm vật «yểm»**: thường là bùa giấy, hình nhân do Định Mệnh Hội cài để bán «giải yểm». Vạch được → nạn nhân hết sợ, mở nhánh `MG-22`.
   Khi không bật âm tà: bước 3 đổi thành **«Chẩn tâm»** — trò chuyện xoa dịu nỗi sợ, vẫn có thể tìm thấy vật cài của Hội (diễn giải là trò lừa, không siêu nhiên).

**Luật thứ tự:** làm bước 3 trước khi xong bước 1 → `o = 0` (§6.7) và NPC dừng người chơi lại.

### 6.4 Điều khiển

| Hành động | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Chọn câu hỏi | chạm thẻ | `1`–`8` | nhấp |
| Chọn lời khuyên | chạm (chọn nhiều) | `Space` đánh dấu, `Enter` xong | nhấp |
| Soi phòng | kéo để nhìn, chạm vật để xem | `←→↑↓` di khung, `E` xem | kéo / nhấp |
| Sửa (dời / bỏ / mở cửa) | kéo vật / chạm nút | chọn vật, `M` dời, `R` bỏ, `O` mở | kéo / nhấp |
| Chuyển bước | nút «Bước sau» | `Tab` | nhấp |

### 6.5 Bố cục giao diện

```
┌──────────────────────────────────────────────────┐
│ Làng chân núi Mao Sơn · nhà bà Tư · ca: «bị đè lúc ngủ» │
│ [1 Thân ✓] [2 Nhà ●] [3 Tâm/tà ○]                      │
│ ┌────────── phòng ngủ (nhìn từ trên) ──────────┐       │
│ │  [cửa sổ đóng]   ▣ giường   ▤ gương (đối giường) │      │
│ │  ◍ bếp than (trong phòng!)   ═ xà ngang         │      │
│ └──────────────────────────────────────────┘       │
│ Đã thấy: gương đối giường · bếp than trong phòng kín    │
│ Sửa: [dời gương] [đưa bếp ra ngoài, mở cửa sổ ✓]        │
│ MAO SƠN ĐẠO NHÂN: «Than cháy trong phòng đóng kín —      │
│  cái "đè" ấy có tên đấy, không phải ma.»                │
└──────────────────────────────────────────────────┘
```

### 6.6 Đường cong độ khó

| Mức | Nguyên nhân thật | Điểm bất ổn trong nhà | Bước 3 |
|---|---|---|---|
| Sơ | 1, nằm ở bước 1 hoặc 2 | 1–2, dễ thấy | không có vật cài |
| Trung | 1–2 | 2–3, có vật bị che | có thể có vật cài của Hội |
| Thâm | 2 (thân + nhà) | 3, có nguy hiểm thật (CO, điện chập) | vật cài + người nhà phản đối («phải mời thầy giải») |
| Viên Thông | 2–3 | 3 | ca **thật sự cần cấp cứu** ẩn trong lời kể (vd đau ngực) — phải nhận ra và gọi cấp cứu ngay, bỏ qua mọi bước khác |

### 6.7 Chấm điểm

```
o = 1 nếu làm theo thứ tự Thân → Nhà → Tâm/tà; 0 nếu nhảy sang bước 3 trước khi xong bước 1
b1 = 0,5·(có «khám bác sĩ» ? 1 : 0) + 0,25·(lời khuyên sinh hoạt hợp gợi ý) + 0,25·(câu hỏi trúng nguyên nhân / 4)
b2 = số điểm bất ổn tìm đúng / số điểm, nhân 1 nếu sửa bằng bố trí, 0,8 nếu bằng vật phẩm; nguy hiểm thật bỏ sót → b2 ≤ 0,3
b3 = 1 nếu không có câu khẳng định «chắc bị tà», tìm đúng vật cài (nếu có), giữ lời an ủi; 0,5 nếu thiếu vật cài; 0 nếu dọa
s  = 0,20·o + 0,35·b1 + 0,30·b2 + 0,15·b3
(Viên Thông, ca cấp cứu: s = 1 nếu gọi cấp cứu trong lượt hỏi đầu tiên, 0,3 nếu sau, 0 nếu không)
thô = 12 × f(s) × K_lặp × K_hư           s_min = 0,5
Công: s ≥ 0,8 → 3 công («Cứu người nguy cấp», CONG_QUA.thien[1]); 0,6–0,8 → 2. Trần 3 công / ngày từ MG-24
```

**Ví dụ (`MAU-A` chủ tu `TT`, làng Mao Sơn — TT, Kim = Hỷ):** ca «bị đè» mức Thâm: đúng thứ tự (`o = 1`); hỏi 4 câu trúng 3, chọn khám bác sĩ và «ngủ phòng thoáng» (`b1 = 0,5 + 0,25 + 0,1875 = 0,9375`); tìm gương, bếp than, xà ngang, sửa bằng bố trí (`b2 = 1`); không dọa, tìm được hình nhân giấy của Hội (`b3 = 1`). `s = 0,2 + 0,328 + 0,3 + 0,15 = 0,978` → `f = 0,985` → thô 11,8 → ĐH `11,8 × 1,19 × 1,05 = 14,7`; 3 công.

### 6.8 Phần thưởng

| Hạng mục | Giá trị |
|---|---|
| Thô | ≤ 12 / lượt |
| Công | ≤ 3 / ngày |
| Nguyên Khí | −12 |
| Phúc Khí | `round(thô × 0,5)` |
| Nhật Khóa | 1 việc nhóm **Hạnh** |
| Cốt truyện | ca có vật cài của Hội tính vào chuỗi điều tra Lỗ Ban (tài liệu 03) |
| Thành tựu | «Thân trước, nhà sau» (20 ca đúng thứ tự) · «Cái đè có tên» (phát hiện 5 ca CO) |

### 6.9 Trạng thái thất bại

| Trạng thái | Điều kiện | Xử lý |
|---|---|---|
| Nhảy cóc sang trừ tà | bước 3 trước bước 1 | NPC chặn lại (thoại dưới), `o = 0` |
| Bỏ sót nguy hiểm thật | không xử lý CO / điện chập | ca kết thúc với bệnh nhân **được người nhà đưa đi viện** (không chết — T3), `b2 ≤ 0,3`, NPC giảng |
| Dọa bệnh nhân | chọn câu «chắc chắn bị tà / phải làm lễ ngay» | `b3 = 0`; trừ ĐH như phạm giới «hù dọa» (`09-03` §10.2: −5), sám hối được |
| Chưa đạt | `s < 0,5` | `f = 0,15`, không công |

```
[CẢNH MG-24.F1 · nhà bà Tư, làng Mao Sơn · giờ Dậu · người chơi mở ngay bước trừ tà]
MAO SƠN ĐẠO NHÂN (maoshan_daonhan): (giữ cổ tay người chơi lại, nhẹ nhưng chắc) Khoan.
MAO SƠN ĐẠO NHÂN: Con đã hỏi bà ngủ mấy tiếng chưa? Ăn gì? Uống thuốc gì? Phòng có mở cửa sổ không?
MAO SƠN ĐẠO NHÂN: Thầy ta dạy: chín phần mười cái người ta gọi là "trúng yểm" là bệnh, là nhà, là sợ. Một phần còn lại, ta cũng chưa chắc. Chưa xét chín phần kia mà đã đốt phù — đó là việc của bọn bán bùa.
> Lựa chọn: ① «Con xin hỏi lại từ đầu.» → [bước 1]  ② «Nhưng người nhà muốn làm lễ ngay.» → [MG-24.F1b]
[MG-24.F1b] MAO SƠN ĐẠO NHÂN: Thì mình làm việc đúng trước, rồi ngồi uống chén nước với họ. Người ta muốn lễ vì người ta sợ. Hết sợ thì lễ gì cũng nhẹ.
```

### 6.10 Trợ năng (riêng)

- Soi phòng có chế độ «danh sách vật» (đọc to từng vật và vị trí) thay vì nhìn.
- Câu hỏi bước 1 có thể chọn tất cả 8 (chế độ «không giới hạn câu hỏi») — điểm câu hỏi tính theo 4 câu đầu.
- Ca Viên Thông cấp cứu luôn có tín hiệu rõ trong lời kể (không đánh đố bằng chi tiết mơ hồ).

### 6.11 Chống gian (riêng)

- Nguyên nhân thật và đáp án ở máy chủ; client chỉ nhận lời kể và bố cục phòng.
- Ca không lặp trong 30 ngày; tổ hợp nguyên nhân sinh từ bộ mẫu × lá số NPC.

### 6.12 Đo lường (riêng)

| Sự kiện | Trường |
|---|---|
| `tamchan_order` | `steps_order[], o` |
| `tamchan_body` | `questions[], doctor (bool), advice[]` |
| `tamchan_house` | `found[], missed[], real_hazard_missed (bool), fix_type (layout/item)` |
| `tamchan_spirit` | `amta_on (bool), planted_found (bool), scare_line (bool)` |
| `tamchan_emergency` | `recognized_at_turn` |

Chỉ tiêu an toàn: tỉ lệ bỏ sót nguy hiểm thật ở lần gặp thứ hai < 5%.

### 6.13 iOS

✎ Bỏ hẳn lớp «tà»: bước 3 luôn là «Chẩn tâm» (xoa dịu, tìm vật cài của kẻ lừa đảo, diễn giải là lừa đảo). Không có từ «yểm» trong tên ca trên iOS — dùng «ca hoảng sợ ban đêm».

### 6.14 Nghiệm thu

- [ ] Mọi ca có «đưa đi khám bác sĩ» trong đáp án bước 1.
- [ ] Ca có nguy hiểm thật (CO, điện) được rà bởi người có chuyên môn an toàn; lời khuyên đúng (thông gió, đưa nguồn đốt ra khỏi phòng ngủ).
- [ ] Không câu thoại nào của phe thiện khẳng định «chắc chắn bị tà» (kiểm bằng danh sách `forbiddenAbsoluteClaims`).
- [ ] Bước 3 chỉ có lớp siêu nhiên khi âm tà đã bật; iOS không có.
- [ ] Ca cấp cứu Viên Thông: gọi cấp cứu kết thúc ca ngay với `s = 1`.
