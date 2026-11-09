# 12 · Trình bày — Phần 13: Bản địa hóa (tiếng Việt chính, tiếng Anh sau)

> Tiếng Việt là ngôn ngữ gốc của game và của engine. Tiếng Anh mở sau (dự kiến sau M5). Phần này đặt luật để **ngay từ bây giờ** giao diện không bị khóa cứng vào tiếng Việt: tách chuỗi, quy tắc giãn chữ, cách hiển thị chữ Hán, bảng thuật ngữ, móc từ điển (glossary hook), và giới hạn khi dịch đầu ra của engine / AI.

---

## 1. Hiện trạng

| Hạng mục | Hiện có | Vấn đề |
|---|---|---|
| Chuỗi giao diện | viết thẳng trong template literal JS (`main.js`, `stations.js`, `wardrobe-ui.js`, `vanmenh-ui.js`, `que-ui.js`, `case-ui.js`, `markup.js`) | không dịch được nếu không sửa code |
| Lớp biến thể duy nhất | `features.js › TEXT` (web: Huyền Quán / Sổ Mệnh / Phúc Khí; iOS: Học Quán / Sổ Tu Học / Điểm Tu Học) | đây là mầm của hệ bản địa hóa — mở rộng thành bảng chuỗi theo **(ngôn ngữ × bản build)** |
| Đầu ra engine | chuỗi tiếng Việt trộn chữ Hán (vd `gradeVi` «TRUNG ĐẲNG · Cân bằng, cần nỗ lực», `synthesis.factors[]`, `gaimenhPlan.layers[].acts[]`) | engine chưa có lớp ngôn ngữ |
| Thầy AI | `askAI` trả lời tiếng Việt theo `SYSTEM_PROMPT` | Neo (`checkNeo`) dựa trên brief tiếng Việt |
| Định dạng số / ngày | `toLocaleDateString('vi-VN')` (Sổ Mệnh) | rải rác |
| Tên riêng trong 3D | biển cổng, bia khắc (`interior.js`, `vanmenh-ui.js › roomData`) | chữ vẽ vào texture — cần nguồn chuỗi |

---

## 2. Kiến trúc chuỗi

### 2.1 Khóa và tệp

- Khóa dạng `ui.<màn>.<phần>` (đã dùng ở phần 02–06, vd `ui.birth.submit`), `npc.<id>.<cảnh>.<câu>` cho thoại, `item.<id>.name|desc` cho Tàng Y Các (`cosmetics.js` hiện giữ `name`, `desc` tiếng Việt trong dữ liệu), `term.<id>` cho thuật ngữ.
- Tệp: `locales/<lang>/<bản>.json` với `<lang> ∈ {vi, en}` và `<bản> ∈ {web, ios}`; `ios` chỉ chứa chuỗi **khác** web (kế thừa web). Thay `TEXT` bằng `t('brand')`.
- Định dạng thông điệp: **ICU MessageFormat** (số nhiều, chọn theo giới tính / persona).
  - Tiếng Việt không có số nhiều: `{n} người`.
  - Tiếng Anh cần: `{n, plural, one {# person} other {# people}}`.
- Biến luôn có tên, không vị trí: `{name}`, `{wx}`; **cấm ghép chuỗi** bằng `+` (thứ tự từ khác nhau giữa hai ngôn ngữ).

### 2.2 Chuỗi trong 3D

Chữ vẽ vào texture (biển, bia, bài vị, bảng vàng khoa cử) lấy từ cùng hệ khóa; texture dựng lại khi đổi ngôn ngữ. Chữ Hán trên biển cổ (vd «嗣漢天師府» Long Hổ) **không dịch** — là một phần kiến trúc (T4); thêm nhãn HTML Hán Việt / tiếng Anh khi lại gần.

### 2.3 Câu theo persona

Xưng hô tiếng Việt (thầy – con, bần đạo – thí chủ, lão phu – trò) **không dịch nghĩa đen** sang tiếng Anh. Mỗi persona có **ghi chú giọng tiếng Anh** (tài liệu 06 bổ sung trường `voice_en`), ví dụ: Thầy Tử Bình — «warm, paternal, calls the player "child" sparingly»; Trương Thiên Sư — «formal, ceremonial, "this humble Daoist"».

---

## 3. Quy tắc giãn chữ

### 3.1 Hệ số dự phòng

So với chuỗi tiếng Việt gốc, thiết kế chừa chỗ:

| Độ dài chuỗi Việt | Dự phòng | Ví dụ |
|---|---|---|
| ≤ 10 ký tự (nút, nhãn dock) | +50% | «Sổ Mệnh» (7) → «Book of Fate» (12) |
| 11–20 | +35% | «Các gian & sảnh nghề» (20) → «Halls & Craft Pavilions» (23) |
| 21–60 | +25% | — |
| > 60 (đoạn văn) | +15% | — |
| thuật ngữ Hán Việt đi kèm chú nghĩa tiếng Anh | +80% | «Thất Sát» (8) → «Qi Sha (Seven Killings)» (23) |

Tiếng Anh thường **ngắn hơn** tiếng Việt ở câu dài (tiếng Việt nhiều âm tiết rời), nhưng **dài hơn** ở thuật ngữ cần chú nghĩa. Thiết kế theo trường hợp xấu nhất.

### 3.2 Luật bố cục

1. Không đặt chiều rộng cố định cho nút có chữ; dùng `min-width` + đệm (đã đúng ở `.hq-btn`).
2. Nhãn dock (76 px tối thiểu) cho phép **2 dòng** ở ngôn ngữ khác, chữ 11 px; nếu vẫn tràn → dùng chuỗi ngắn riêng `ui.dock.<id>.short`.
3. Nút hành động cảm ứng (92 px tròn): verb ≤ 24 ký tự (phần 01 §6.4); tiếng Anh có chuỗi ngắn riêng.
4. Không cắt chữ bằng `text-overflow: ellipsis` ở **câu có nghĩa** (lựa chọn thoại, phản hồi án) — xuống dòng thay vì cắt. Chỉ cắt ở tên người chơi, tiêu đề dài.
5. Không xoay chữ Latin theo chiều dọc; nhãn dọc chữ Hán (trong điện — UI-12) giữ dọc, nhãn tiếng Anh đặt ngang cạnh.

### 3.3 Giả bản địa hóa (pseudo-localization)

Chế độ kiểm thử `?pseudo=1`: mọi chuỗi biến thành bản kéo dài 40% có dấu chồng nhiều nhất của tiếng Việt và chữ Hán mẫu, vd «Sổ Mệnh» → «⟦Sổ Mệnh ỮỢẴ 華蓋⟧». Bắt được: chữ bị cắt, dấu bị cắt đỉnh, chuỗi chưa tách (không có ⟦ ⟧), phông thiếu glyph.

---

## 4. Chữ Hán và móc từ điển

### 4.1 Hiển thị

| Luật | Chi tiết |
|---|---|
| Dạng chữ | **phồn thể** theo engine; chuỗi engine có lẫn giản thể giữ nguyên văn (bằng chứng), từ điển tra cả hai |
| Phông | Noto Serif TC → SC (phần 07 §1.2); cài `lang="zh-Hant"` trên phần tử chứa chữ Hán để trình duyệt chọn đúng dáng chữ (đặc biệt chữ như 骨, 直, 角 khác dáng giữa vùng) |
| Ruby | ba kiểu dưới / bên / trên (phần 07 §1.5) |
| Ngôn ngữ phụ | tiếng Việt: chữ Hán + Hán Việt; tiếng Anh: chữ Hán + **pinyin** (thuật ngữ BaZi quốc tế dùng pinyin) + nghĩa — vd «七殺 qī shā · Seven Killings» |
| Ngắt dòng | không ngắt giữa chữ Hán và phiên âm của nó (`white-space: nowrap` cho cụm ≤ 4 chữ); câu Hán dài (trích cổ thư) ngắt theo dấu câu |
| Chữ dọc | chỉ ở trang trí (biển, nhãn tượng); văn bản đọc luôn ngang |

### 4.2 Móc từ điển (glossary hook)

**Đánh dấu trong dữ liệu:** `[[term:qi_sha|Thất Sát]]` trong chuỗi kịch bản → hiển thị gạch chân chấm, chạm mở popover UI-57.

**Tự nhận trong văn bản động** (engine, AI): bộ so khớp **dài nhất trước** trên từ điển thuật ngữ (Hán Việt và chữ Hán); bỏ qua bên trong mã, số, tên người chơi; mỗi đoạn văn chỉ gắn móc **lần xuất hiện đầu tiên** của mỗi thuật ngữ.

**Liên kết lore:** mỗi mục từ điển có thể trỏ tới mục codex `LORE-xxx` của tài liệu 02 (trường `lore`) và mục Tàng kinh các (UI-56).

**Mức hiển thị:** thuật ngữ đã mở ≥ 3 lần → bỏ gạch chân (phần 04 UI-57), trừ khi bật «Luôn gạch chân thuật ngữ».

### 4.3 Cấu trúc một mục từ điển

```json
{
  "id": "qi_sha",
  "han": "七殺",
  "hanSimp": "七杀",
  "vi": "Thất Sát",
  "pinyin": "qī shā",
  "en": "Seven Killings",
  "short_vi": "Thập thần khắc nhật chủ, cùng dấu âm dương — áp lực, thử thách, quyền lực cứng.",
  "short_en": "The Ten-God that controls the Day Master with the same polarity — pressure, challenge, hard authority.",
  "engineKeys": ["七殺", "七杀", "Thất Sát"],
  "lore": null,
  "library": "ui-56:pattern"
}
```

---

## 5. Bảng thuật ngữ lõi (vi → en)

Quy ước tiếng Anh: thuật ngữ BaZi chuyên môn theo **cách gọi phổ biến của cộng đồng BaZi tiếng Anh** (Day Master, Useful God, Ten Gods…); tên trong game (Phẩm căn, Mệnh Đồ…) đặt tên riêng có nghĩa; tên riêng người / nơi **giữ Hán Việt** (không pinyin) vì thế giới là của người Việt.

| Tiếng Việt | Chữ Hán | Tiếng Anh | Ghi chú |
|---|---|---|---|
| Bát tự | 八字 | BaZi (Eight Characters) | lần đầu kèm chú |
| Tứ trụ | 四柱 | Four Pillars | — |
| Nhật chủ | 日主 | Day Master | — |
| Thiên can / Địa chi | 天干 / 地支 | Heavenly Stems / Earthly Branches | — |
| Can chi | 干支 | stem-branch | ngày «Giáp Tý» → «Jia-Zi day (Giáp Tý)» |
| Ngũ hành | 五行 | Five Elements (Five Phases) | — |
| Mộc / Hỏa / Thổ / Kim / Thủy | 木火土金水 | Wood / Fire / Earth / Metal / Water | — |
| Dụng thần | 用神 | Useful God | — |
| Hỷ thần / Kỵ thần / Cừu thần | 喜 / 忌 / 仇神 | Favorable / Unfavorable / Enemy God | — |
| Thập thần | 十神 | Ten Gods | — |
| Thất Sát | 七殺 | Seven Killings | — |
| Chính Quan | 正官 | Direct Officer | — |
| Thương Quan | 傷官 | Hurting Officer | — |
| Thực Thần | 食神 | Eating God | — |
| Chính Ấn / Thiên Ấn (Kiêu) | 正印 / 偏印 | Direct / Indirect Resource | — |
| Chính Tài / Thiên Tài | 正財 / 偏財 | Direct / Indirect Wealth | — |
| Tỷ Kiên / Kiếp Tài | 比肩 / 劫財 | Friend / Rob Wealth | — |
| Cách cục | 格局 | Structure (Chart Pattern) | — |
| Đại vận / Lưu niên | 大運 / 流年 | Luck Pillar / Annual Pillar | — |
| Thần sát | 神煞 | Symbolic Stars | — |
| Thiên Ất Quý Nhân | 天乙貴人 | Nobleman Star | — |
| Hoa Cái | 華蓋 | Canopy Star | — |
| Đào Hoa | 桃花 | Peach Blossom | — |
| Dịch Mã | 驛馬 | Travelling Horse | — |
| Khôi Cương | 魁罡 | Kui Gang (Leader Star) | — |
| Nạp âm | 納音 | NaYin (Sound Element) | — |
| Thái Tuế | 太歲 | Tai Sui (Grand Duke Jupiter) | — |
| Phạm Thái Tuế (Trị / Xung / Hình / Phá / Hại) | 值沖刑破害 | clash with Tai Sui (Self / Clash / Punishment / Break / Harm) | — |
| Tiềm Lực (game) | — | Potential | chỉ số game |
| Phẩm căn (game) | — | Root Grade | Phàm Căn → Mortal Root … Thiên Linh Căn → Heavenly Spirit Root |
| Phúc phận | — | Fortune Share | — |
| Ngũ Hành Lực: Sinh Cơ / Nhiệt Tâm / Định Lực / Tuệ Kiếm / Linh Tuệ | — | Vitality / Ardor / Steadiness / Wisdom Blade / Spirit Insight | — |
| Thân Lực | — | Self Strength | — |
| Ngũ Duy: Thương / Trị / Học / Nghệ / Đồng đạo | — | Ways of Trade / Governance / Learning / Art / Fellowship | — |
| Mệnh Cách: Thuận Thiên / Đắc Cứu / Nghịch Thiên / Dị Cách | 成格 / 有救 / 敗格 / 特殊 | Heaven-Aligned / Remedied / Heaven-Defying / Special Structure | — |
| Mệnh Cấp | — | Chart Rank | 清貴 Thanh Quý → «Refined Noble» |
| Nguyên Khí | 元氣 | Primal Energy | — |
| Đặc Tính | — | Traits | — |
| Túc Nghiệp | 宿業 | Past Karma | kèm chú «fiction» |
| Tâm ma: Tham / Sân / Si | 貪瞋癡 | Greed / Anger / Delusion | — |
| Đạo Hạnh | 道行 | Dao Practice (Merit of Practice) | — |
| Hệ số Nghịch Thiên | — | Heaven-Defying Coefficient | — |
| Cảnh giới | 境界 | Realm | tên bậc theo đạo: Phàm Nhân → Mortal; Nhập Môn → Initiate; Luyện Tinh Hóa Khí → Refining Essence into Qi; Luyện Khí Hóa Thần → Refining Qi into Spirit; Luyện Thần Hoàn Hư → Returning Spirit to Void; Luyện Hư Hợp Đạo → Merging Void with Dao; Phật: Tín Tâm → Faith … Giải Thoát → Liberation; Nho: Học Trò → Pupil … Thánh Hiền → Sage |
| Mệnh Đồ | — | Fate Map | — |
| Sổ Công Quá | 功過格 | Ledger of Merits and Faults | — |
| công (đơn vị) | 功 | merit | — |
| Âm đức | 陰德 | hidden virtue | — |
| Cải Vận / Cải Tâm / Cải Hành / Cải Mệnh | 改運 / 改心 / 改行 / 改命 | Changing Luck / Heart / Conduct / Fate | — |
| Sám hối | 懺悔 | repentance | — |
| Nghiệp | 業 | karma | — |
| Tà Lộ | — | The Crooked Path | — |
| Âm Bài / Nợ Âm | 陰牌 / 陰債 | Shadow Token / Shadow Debt | — |
| Hồi Đầu | 回頭 | Turned Back (title) | — |
| Quy nhất | 歸一 | Return to One | — |
| Phúc Khí (tiền game) | 福氣 | Blessing | — |
| Ngọc | — | Jade | — |
| Tàng Y Các | 藏衣閣 | Wardrobe Pavilion | — |
| Vận Mệnh Các | — | Pavilion of Destiny | — |
| Thái Tuế Điện | 太歲殿 | Tai Sui Hall | — |
| Sổ Mệnh | — | Book of Fate (iOS: Study Journal) | — |
| Huyền Quán (iOS: Học Quán) | 玄館 / 學館 | Huyền Quán — the Mystic Lodge (iOS: Study Lodge) | tên riêng giữ, kèm phụ đề |
| Huyền Giới | 玄界 | Huyền Giới (the Mystic Realm) | — |
| Phù / Kết phù | 符 | talisman / talisman composition | luôn kèm «fictional script» |
| Thụ lục | 受籙 | ordination register | — |
| Bái Đẩu | 拜斗 | Dipper Worship | — |
| Tĩnh tọa | 靜坐 | quiet sitting | — |
| Nội đan | 內丹 | inner alchemy | — |
| Công án | 公案 | koan | — |
| Neo (độ khớp AI) | — | Anchor score | — |

**Tên người và nơi:** giữ Hán Việt có dấu trong cả bản tiếng Anh (Vân Cốc, Long Hổ Sơn, Trương Thiên Sư); lần đầu kèm phụ đề nghĩa («Long Hổ Sơn — Dragon-Tiger Mountain»). Lý do: thế giới được kể từ góc nhìn Việt; đổi sang pinyin (Longhu Shan) làm mất bản sắc và lệch với tiếng nói của NPC.

---

## 6. Đầu ra engine và AI khi đổi ngôn ngữ

| Nguồn | Phương án cho tiếng Anh | Rủi ro |
|---|---|---|
| nhãn cố định của engine (`gradeVi`, tên cách cục, tên sao) | bảng ánh xạ khóa → tiếng Anh (engine đã có khóa: `kuiGang`, `huaGai`, `七殺格`…) | thấp |
| câu giải thích sinh động (`synthesis.factors[]`, `gaimenhPlan` `acts[]`, `yong.reasons[]`) | (a) dịch mẫu câu trong engine (cần engine tách mẫu và tham số — việc của tài liệu 13); (b) tạm: hiện **nguyên văn tiếng Việt** + nút «Dịch máy» rõ nhãn | cao — câu engine dài, nhiều thuật ngữ |
| Thầy AI | tham số ngôn ngữ trong `askAI` (system prompt «Trả lời bằng tiếng Anh, giữ thuật ngữ theo bảng thuật ngữ») | Neo: `checkNeo` so khớp với brief tiếng Việt — cần brief song ngữ hoặc so khớp theo khóa dữ liệu (tài liệu 06 / 13) |
| `anti-manipulation-data`, câu từ chối an toàn | dịch có duyệt (không dịch máy) | cao — câu an toàn phải chuẩn |
| UI-42 (khủng hoảng) | dịch có duyệt + số điện thoại theo quốc gia | rất cao |

**Luật:** không bật tiếng Anh cho một màn nếu phần **an toàn** của màn đó chưa dịch có duyệt.

---

## 7. Định dạng theo ngôn ngữ

| Mục | vi | en |
|---|---|---|
| Số | 1.000 · 1,3 | 1,000 · 1.3 |
| Phần trăm | 55% | 55% |
| Ngày dương | 15/5/1990 | 15 May 1990 |
| Ngày âm | mùng 8 tháng 9 âm | 8th day of the 9th lunar month |
| Giờ can chi | giờ Thìn (07–09) | Chen hour (07–09) |
| Năm can chi | năm Bính Ngọ (丙午) | Bing-Wu year (丙午) |
| Tiền thật | 22.000đ | theo cửa hàng (USD …) |
| Tên tháng âm đặc biệt | tháng Giêng, tháng Chạp | 1st month, 12th month |

---

## 8. Lồng tiếng và phụ đề khi đổi ngôn ngữ

- Bản tiếng Anh: **giữ VO tiếng Việt + phụ đề tiếng Anh** (giọng là bản sắc); không lồng tiếng Anh ở giai đoạn đầu.
- Phụ đề tiếng Anh tuân thủ: ≤ 42 ký tự / dòng, ≤ 2 dòng, tốc độ ≤ 17 ký tự / giây; câu VO dài cắt thành nhiều khung theo mốc trong siêu dữ liệu VO (phần 11 §1.6).
- Ghép câu theo lá số (phần 11 §1.5): bản tiếng Anh **không ghép** — hiện phụ đề đầy đủ, VO đọc khung câu tiếng Việt.

---

## 9. Duyệt văn hóa khi dịch

| Nhóm nội dung | Người duyệt |
|---|---|
| thuật ngữ BaZi | người dịch có chuyên môn mệnh lý + đối chiếu cộng đồng BaZi tiếng Anh |
| thuật ngữ Đạo giáo, Phật giáo, Nho | cố vấn từng truyền thống (cùng nhóm cố vấn của tài liệu 14) |
| câu an toàn, chuyển hướng khủng hoảng | chuyên gia sức khỏe tinh thần bản ngữ |
| tên vật phẩm, quảng bá | biên tập viên marketing — không dùng từ «lucky», «guaranteed» cho bất cứ thứ gì bán được (P6) |

---

## 10. Nghiệm thu bản địa hóa

1. `?pseudo=1`: không chuỗi nào thiếu ⟦ ⟧; không chữ nào bị cắt trên 390 × 844 ở cỡ chữ 130%.
2. Đổi ngôn ngữ không cần tải lại cảnh (trừ texture chữ 3D, dựng lại ≤ 1 s).
3. Mọi thuật ngữ trong bảng §5 có mục từ điển song ngữ; móc từ điển nhận đúng ≥ 95% thuật ngữ trong 50 câu engine mẫu.
4. Không còn chuỗi giao diện viết thẳng trong JS (kiểm bằng quét mã tìm chữ có dấu tiếng Việt ngoài thư mục `locales/` và dữ liệu engine).
