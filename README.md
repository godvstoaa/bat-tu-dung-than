# Bát Tự · Dụng Thần — Hệ thống luận mệnh phong thủy phương Đông 五术

> **App Bát Tự Dụng Thần** — ứng dụng luận mệnh phong thủy toàn diện, bao trùm **五术 (Ngũ Thuật / Năm Nghệ thuật phương Đông)**: 命 (Mệnh), 卜 (Bói), 相 (Tướng), 山 (Sơn — Dương-Trạch / Âm-Trạch), 择日 (Trạch Nhật). Lập lá số Bát Tự (四柱 Tứ Trụ), xác định **格局 Cách Cục** và **用神 Dụng Thần** theo chính thống Tử Bình, kết hợp **AI luận giải (GLM-5.2 Z.ai)** để trả lời bất kỳ câu hỏi nào về lá số.

---

## 1. Giới thiệu

App Bát Tự Dụng Thần là một **bộ công cụ huyền học phương Đông hoàn chỉnh**, không chỉ dừng ở Bát Tự mà triển khai đầy đủ **五术 (Năm Nghệ)** — hệ thống tri thức cổ truyền được phân loại từ đời Hán về sau:

| 五术 | Tên | Phạm vi app triển khai |
|------|-----|------------------------|
| **命 Mệnh** | Luận mệnh | BaZi (Bát Tự / Tứ Trụ), ZiWei (Tử Vi Đẩu Số), Qizheng (Thất Chính Tứ Dư — chiêm tinh thực với thiên văn accuracy) |
| **卜 Bốc** | Bói toán | 梅花 Mai Hoa, 六爻 Lục Diệu, 奇门 Kỳ Môn Độn Giáp, 六壬 Lục Nhâm, 测字 Trắc Tự, 一掌 Kính Một Chừng |
| **相 Tướng** | Quan tướng | 面相十二宫 Diện tướng 12 cung, 痣相 Tử tướng (nốt ruồi), 流年部位 Lưu niên bộ vị |
| **山 Sơn** | Phong thủy | 阳宅 Dương Trạch (八宅 Bát Trạch / 玄空 Huyền Không / 三煞 Tam Sát / 太岁 Thái Tuế / 水法 Thủy Pháp) + 阴宅 Âm Trạch (二十四山 Nhị Thập Tứ Sơn lập hướng phân kim) |
| **择日 Trạch Nhật** | Chọn ngày | 天赦 Thiên Xá, 四德 Tứ Đức, 天医 Thiên Y, 月恩 Nguyệt Ân, 天愿 Thiên Nguyện, 凶日 Hung nhật, 黄道十二神 Hoàng Đạo Thập Nhị Thần |

### Đặc điểm nổi bật

- **AI-powered**: tích hợp LLM theo chuẩn OpenAI-compatible, mặc định **GLM-5.2 (Z.ai)** với native deep-thinking. Hỗ trợ OpenAI, DeepSeek, BigModel, Ollama và bất kỳ endpoint `/chat/completions`.
- **Cổ pháp chính thống**: mọi thuật toán bám sát các thư tịch kinh điển (xem mục [Nguồn cổ pháp](#6-nguồn-cổ-pháp)).
- **Toàn vẹn 4 tầng Dụng-Hỷ-Kỵ-Thù** (用喜忌仇), không chỉ tính Dụng Thần đơn lẻ.
- **Tự kiểm chứng (self-test)**: bộ `selftest.mjs` với **1740+ kiểm chứng** qua ~88 nhóm banner (xem [Verify](#7-verify)).
- **Tech stack nhẹ**: **Vite + vanilla JavaScript** (không framework) + `lunar-javascript` (âm lịch) + `astronomy-engine` (thiên văn thực cho Thất Chính Tứ Dư).
- **Quy mô**: **182 module engine** · **22 module mở rộng** (cycle 18→28) · **67+ UI card/section** · build production **~1.08 MB JS / gzip 387 kB** (xem [Cấu trúc code](#4-cấu-trúc-code)).

---

## 2. Cài đặt

Yêu cầu: **Node.js ≥ 18**.

```bash
npm install      # cài dependencies (vite, lunar-javascript, astronomy-engine, playwright)
npm run dev      # server phát triển (Vite) — http://localhost:5173
npm run build    # build production → dist/
npm run preview  # xem trước bản build production
npm test         # chạy selftest.mjs (1740+ kiểm chứng, ~88 nhóm banner)
```

> Lưu ý AI: khi chạy `npm run dev`, Vite proxy `/zai`, `/openai`, `/deepseek`, `/bigmodel` chuyển tiếp tới nhà cung cấp để **tránh CORS** (các LLM endpoint đều chặn CORS nếu fetch thẳng từ web). Ở production (host tĩnh) cần tự đặt backend/proxy tương đương.

---

## 3. Tính năng (theo hệ thống 五术)

### 命 — Mệnh học (Luận mệnh)

#### BaZi · Bát Tự (Tứ Trụ 四柱)
- **Lập Tứ Trụ**: Niên / Nguyệt / Nhật / Thì (天干 địa chi Thiên Can - Địa Chi), tự động nhận biết tháng nhuận âm lịch.
- **格局 Cách Cục** theo 子平真诠: 8 chính cách (Chính Ấn / Thiên Chính Ấn / Chính Quan / Thất Sát / Thực Thần / Thương Quan / Chính Tài / Thiên Tài) + Kiến Lộc / Nguyệt Kiếp / Nguyệt Nhận + ngoại cách (Tòng / Chuyên Vượng / Nhiếp).
- **用神 Dụng Thần** đầy đủ 4 tầng **用喜忌仇** (Dụng / Hỷ / Kỵ / Thù), 3 phép định dụng (đắc lệnh / đắc địa / đắc thế), cơ chế Điều Hậu (窮通寶鑑).
- **通根透干** (Thông Căn Thấu Cán): kiểm tra sao trọng điểm (Tài/Quan/Ấn) có căn cơi ở tàng can không, ứng kỳ khi thấu cán.
- **十神 Thập Thần** đầy đủ, **五行 Ngũ Hành** vượng suy kèm `ratio`, **Vượng suy** giải thích "tại sao" (得令得地得势).
- **刑冲会合 Hình-Xung-Hội-Hợp**: Can ngũ hợp, Chi lục hợp / tam hợp / tam hội, lục xung, tam hình, lục hại.
- **神煞 Thần Sát**: 15+ chính thần (Thiên Ất Quý Nhân, Thiên Đức, Nguyệt Đức, Tam Kỳ, Văn Xương, Học Đường, Lộc, Nhận, Đào Hoa, Dịch Mã, Tướng Tinh, Hoa Cái, Kim Dư, Hồng Diễm, Khôi Cương...) + nhóm Quý Nhân cao cấp.
- **十神组合 Tổ hợp Thập thần**: 官印相生 / 杀印相生 / 食神制杀 / 伤官见官 / 枭神夺食 / 官杀混杂 / 财多身弱 / 杀攻身...
- **大运 Đại Vận** + **流年 Lưu Niên** (đa trường phái, chống phán ngược) + **流月 Lưu Nguyệt** (vận từng tháng) + **流日 Lưu Nhật** (vận từng ngày cả năm).
- **盲派 Mangpai**: thị giác mù, Bát Bộ 韦千里 (8 bước), 3 phép định vượng suy.
- **三世书 Tam Thế Thư**: nghiệp tiền kiện - hiện kiện - hậu kiện (karma reading).
- **六亲 Lục Thân** qua cung vị 4 trụ + Thập thần tinh; **婚姻 Hôn nhân** ứng kỳ (scanner Lưu niên hôn nhân), sao bạn đời / sao con / sao tài / sao quan.
- **姓名学 Họ tên học** 五格剖象 (Ngũ Cách Phẫu Tượng) — phân tích tên theo 5 cách, đổi Việt → Hán.
- **逆天改命 Nghịch Thiên Cải Mệnh**: 改运十二法 (12 pháp cải vận) + 了凡四训 khung cải mệnh đích thực, hoá giải tổ hợp hung.

#### ZiWei · Tử Vi Đẩu Số (紫微斗数)
- **12 cung** (Mệnh / Huynh / Phu / Tử / Tài / Tật / Di / Nô / Quan / Điền / Phúc / Phụ mẫu).
- **14 chính tinh** + sao phụ tá + tiểu hạn.
- **四化 Tứ Hóa** (Hóa Lộc / Quyền / Khoa / Kỵ) bản mệnh + **流年四化 Lưu niên Tứ Hóa**.
- **格局 Cục hình** Tử Vi, **双星 Song Tinh** (ghép sao), **三方 Tứ Chính** tam hợp.
- **亮度 Độ sáng** của sao theo miếu vượng.

#### Qizheng · Thất Chính Tứ Dư (七政四余)
- **7 luminaries** (Nhật / Nguyệt / Kim / Mộc / Thủy / Hỏa / Thổ) tính bằng **astronomy-engine** (tọa độ thực, không nội suy).
- **4 shadow points (tứ dư)**: La Hầu / Kế Đô / Thái Bạch / Tử Khí (紫气).
- **二十八宿 Nhị Thập Bát Tú**, 12 cung, Mệnh cung, luận giải mỗi tinh theo túc + cung.
- Tất định (cùng input → cùng output), không crash ngày biên (1900 / 2100 / nhuận).

### 卜 — Bói toán

- **梅花易数 Mai Hoa Dịch Số** (邵雍): gieo theo giờ hoặc theo số, luận quẻ.
- **六爻 Lục Diệu**: bói quẻ 6 hào (Dịch).
- **奇门遁甲 Kỳ Môn Độn Giáp**: xếp bàn kỳ môn.
- **大六壬 Đại Lục Nhâm**: xếp bàn lục nhâm.
- **测字 Trắc Tự / Chảm Tự** (拆字): bói qua chữ Hán, gỡ chữ.
- **一掌经 Yizhangjing** (达摩一掌经): bói Phật giáo cổ (Đường) — 4 cung 年/月/日/时 trên ngón tay + lục đạo (Phật/Tiên/Nhân/Tu-la/Bàng sinh/Ngạ quỷ). Hệ thống duy nhất có góc nhìn "tiền thế/hậu thế". *Lưu ý học thuật: tác giả thật là 一行禅师 (Yixing, 683–727); "达摩" là gán nhầm dân gian hậu kỳ.*
- **增删卜易**: tham chiếu kinh điển bói.

### 相 — Tướng thuật (相术)

- **面相十二宫 Diện tướng 12 cung** (Mệnh / Tài / Huynh / Điền / Nữ / Nô / Quan / Tử / Thê / Di / Tật / Thiên).
- **痣相 Tử tướng**: luận nốt ruồi theo vị trí.
- **流年部位 Lưu niên bộ vị**: xem vùng mặt ứng với tuổi cụ thể.

### 山 — Phong thủy (Dương Trạch + Âm Trạch)

#### 阳宅 Dương Trạch
- **八宅 Bát Trạch** (八宅明镜): tính Mệnh Quái, phối hợp Mệnh - Trạch (sanh khí / thiên y / diên niên / phục vị ...).
- **玄空飞星 Huyền Không Phi Tinh**: xếp vận bàn, phi tinh Lưu niên đáo sơn / đáo hướng.
- **三煞 Tam Sát** (Lưu niên + Nguyệt Sát), **太岁 Thái Tuế** (phạm + hóa giải), **月破 Nguyệt Phá**, **月建 Nguyệt Kiến**.
- **水法 Thủy Pháp**: 零神水法 (Linh Thần Thủy Pháp) — kích hoạt thủy cát.
- **层楼坐向 Lý tưởng nhà**: tầng - tọa - hướng, phối hướng cát × Lưu niên phi tinh.
- **居家 phong thủy**: vật phẩm hóa giải (fs-cure), nhà lý tưởng, hướng di chuyển, hương vị / âm nhạc / tinh thể / thực vật / không gian / giấc ngủ / trang phục / màu sắc theo ngũ hành.

#### 阴宅 Âm Trạch
- **二十四山立向分金 Nhị Thập Tứ Sơn lập hướng phân kim** (an tá / mộ phần).

### 择日 — Trạch Nhật (chọn ngày giờ)

- **天赦 Thiên Xá, 四德 Tứ Đức, 天医 Thiên Y, 月恩 Nguyệt Ân, 天愿 Thiên Nguyện** + nhiều sao cát khác (zheri, zheri-stars, zheri-extra).
- **凶日 Hung nhật**: nhóm sát nhật cần tránh.
- **黄道十二神 Hoàng Đạo Thập Nhị Thần** (Hoàng / Hắc Đạo 12 thần).
- **择吉时合成 Best Hour Today**: composite 5 chiều chấm 12 时辰 (giờ hoàng/hắc đạo + Dụng ngũ hành + 紫微流时 + quý nhân + trực ngày) → xếp hạng giờ tốt nhất / kỵ nhất trong ngày.
- **Tìm ngày tốt** (30 ngày / 14 ngày), đánh giá từng ngày 宜 / 忌 (nên / kỵ), giờ may hàng ngày.

### 22 module mở rộng (cycle 18 → 28)

Bổ sung song song với khung 五术 ở trên — 22 module lớn thêm vào từ cycle 18 trở đi (đã wired vào AI brief + selftest):

| # | Module | Tính năng |
|---|--------|-----------|
| 1 | `chenggu` | **称骨算命** — cân "trọng lượng xương" (niên/nguyệt/nhật/thì → lượng → tầng phú quý). |
| 2 | `liunian-12shen` | **流年十二神煞** — 12 thần lưu niên (太岁/太阳/丧门/太阴/官符/死符/岁破/龙德/白虎/福德/天狗/病符) theo tuổi. |
| 3 | `noble-stars` | **高级神煞贵人组** — nhóm quý nhân cao cấp (天乙/天月二德/三奇/太极/天德/月德/文昌…) + đánh giá cấp độ. |
| 4 | `sanshishu` | **三世书** — nghiệp tiền kiên / hiện kiên / hậu kiên (3 đời karma). |
| 5 | `mangpai-view` | **盲派象法** — thị giác mù, 禄 analysis + 口诀 cổ (chấm các quy tắc mangpai). |
| 6 | `huangdao` | **黄道十二神** — 12 thần Hoàng/Hắc Đạo (青龙/明堂/金匮…) cho từng ngày. |
| 7 | `water-activation` | **风水零神水法** — kích hoạt thuỷ tài/tình theo vận + linh thần. |
| 8 | `ziwei-liunian-sihua` | **流年四化** — 4 hoá (禄/权/科/忌) lưu niên bay vào cung bẩm sinh. |
| 9 | `physiognomy` | **面相 + 痣相 + 流年部位** — 12 cung mặt, 23 vị trí nốt ruồi, 18 mốc lưu niên bộ vị. |
| 10 | `yinzhai` | **阴宅二十四山** — lập hướng phân kim 24 sơn (an tá / mộ phần). |
| 11 | `cezi` | **测字拆字** — bói 1 chữ Hán: tháo bộ/nét + 梅花起卦 + ngũ hành luận. |
| 12 | `qizheng` | **七政四余** — chiêm tinh Trung Hoa với thiên văn thực (astronomy-engine): 7 luminaries + 4 shadow points + 28 túc. |
| 13 | `xiaoliuren` | **小六壬** — 掐指一算 (tháng + ngày + giờ → 6 cung Đại An / Không Vong / …). |
| 14 | `taiyi` | **太乙神数** — thức ĐẦU TIÊN của 三式, phán chủ/khách năm (hoàn thiện 三式 cùng 奇门 + 六壬). |
| 15 | `qiuqian` | **求签 + 掷筊** — 100签 Hoàng Đại Tiên + gieo quẻ âm dương. |
| 16 | `jiemeng` | **解梦** — từ điển giải mộng (key → luận cát/hung). |
| 17 | `qinxing` | **禽星** — annual bird rotation (con vật tinh trụ trị năm, feng shui timing). |
| 18 | `zodiac-deep` | **生肖配对** — điểm 0-100 + bóc Lục Hợp / Tam Hợp / Lục Xung / Lục Hại / Tam Hình / Tự Hình. |
| 19 | `xuankong-dagua` | **玄空大卦** — 24 sơn × 64 quẻ + 卦运 (lập hướng âm/dương trạch). |
| 20 | `jinkoujue` | **金口诀** — "Golden Key", biến thể rút gọn 大六壬 bói nhanh yes/no (4 vị trí 地分/月将/贵神/人元). |
| 21 | `taisui-general` | **太岁 tổng luận** — trị niên thái tuế + bản mệnh TS (60 vị). |
| 22 | `yanqin` | **演禽** — 28 túc con-vật-tinh (như con giáp 28-fold) cho bản mệnh. |

> Mỗi module đều được (a) import vào `ai.js` để đưa vào chart brief cho LLM, (b) có banner kiểm chứng trong `selftest.mjs`, (c) có UI card render trong `main.js`.

### 3 module mới (cycle 32 → 33)

Bổ sung tiếp sau khung 22 module trên — 3 module lớn thêm vào từ cycle 32-33 (đã wired vào AI brief + selftest):

| # | Module | Tính năng |
|---|--------|-----------|
| 23 | `ziwei-liuri` | **紫微流日/流时** — vận Tử Vi theo ngày & giờ: lưu nhật mệnh cung + sao + tứ hóa ngày, lưu thời cung kích hoạt. Trả lời "hôm nay CHỦ ĐỀ gì nổi / giờ nào bật sao gì". |
| 24 | `liunian-event` | **流年引动六亲** — Year→Event rule engine: sao năm (Thập thần) dẫn động trụ nào → sự kiện XẢY RA với AI (WHO). Ánh xạ 十神 → event → lục thân, kèm Cát/Hung. |
| 25 | `best-hour` | **择吉时合成** — Best Hour Today: composite 5 chiều (黄道/黑道 giờ + Dụng ngũ hành + 紫微流时 + 流时神煞 quý nhân + 建除直 ngày) chấm 12 时辰 rồi xếp hạng. Trả lời "hôm nay giờ nào tốt nhất cho [việc]". |

### Lớp TỔNG HỢP (composition layer — cycle 35)

| # | Module | Tính năng |
|---|--------|-----------|
| 26 | `daily-briefing` | **📅 Daily Briefing 每日简报 (COMPOSITION)** — Lớp tổng hợp không tính toán mới, ráp 8 hệ thống (黄道 rating + giờ tốt nhất + 紫微流日 + sát phương + Thái Tuế + Dụng Thần hành động + 流年 event + cải vận ngắn) thành **MỘT thẻ tóm tắt khả thi** trả lời "Hôm nay tôi cần biết gì?" trong 1 dòng (`oneLiner`). Thay vì user lướt 70 thẻ, AI đọc `HÔM NAY TỔNG KHÁI` ở đầu brief và trả lời trực tiếp. Đây là **composite đầu tiên** của app — layer tổng hợp bên trên 25 module riêng lẻ. |

### 天星 天星择日 (cycle 38)

Module天星 (astro-thiên văn) đầu tiên, xây trên nền `qizheng.js` (cycle 37 đã sửa sidereal + geocentric):

| # | Module | Tính năng |
|---|--------|-----------|
| 27 | `tianxing-zheri` | **天星择日 七政四余择日 (STAR DATE SELECTION)** — chọn ngày khởi công/dọn nhà/an táng theo vị trí THẬT của 7 chính tinh (đặc biệt 太阳/太阴) tới 坐向 (24 sơn). 24 sơn 到山/到向 dùng kinh độ TROPICAL neo theo tiết khí (冬至→子 @270°, 校正 spec sai dùng sidereal); 28 túc display dùng sidereal. Chấm 5 tầng: 太阳到向(+5)/到山(+3), 太阴到山(+4)/到向(+2), 金水辅日月(+2); 恩用仇难 (ngũ hành tinh × hóa-khí sơn, ×đến=1.0/tam hợp=0.5); 归垣(+1); 调候 mùa (đông→Hỏa, hạ→Thủy/Kim); cấm cứng 罗计掩日月 (cửa nhật/nguyệt thực → −100) + 燃烧 (<8° Nhật → −2). Hỗ trợ 2 hệ ngũ hành sơn: 化气 (mặc định, phái 易先生/赖布衣) + 正体 (toggle). Trả top-5 tốt + worst-3 kỵ. |

### 1 module mới (cycle 39 — 河洛理数 命卦)

Bổ sung cầu nối MỆNH ↔ QUẺ — chuyển bát tự thành quẻ 周易 đọc mệnh (đã wired vào AI brief + selftest + UI card):

| # | module | mô tả |
|---|--------|-------|
| 28 | `heluo` | **河洛理数 河洛理數 (HELUO LISHU — 命卦)** — hệ cổ học (tương truyền 陈抟) gạch cầu giữa mệnh (bát tự cố định) và quẻ (chu dịch): từ 8 chữ (4 trụ can+chi) → phối 河图数 → gom 天数 (lẻ) / 地数 (chẵn) → giảm (25/30, "遇十不用") → 后天八卦配洛书 (1坎2坤3震4巽6乾7兑8艮9离; 5寄中宫 tuỳ 三元+giới) → thượng/hạ quái (阳男阴女→天上地下; 阴男阳女→地上天) → **本命卦**. Rồi **元堂** (hào động) theo thuật toán **飞支** (《三才发秘·详元堂爻位式》: N≤3 重数, N≥4 单 pass+寄; giờ 子-巳 dương / 午-亥 âm). Cuối cùng **后天卦** = lật 元堂 → 变卦 → hoán thượng/hạ. Đọc mệnh qua 卦辞 + 元堂 爻辞 (public-domain 周易). Oracle kiểm chứng: 辛亥 庚寅 甲子 丁卯 (阴男, 卯时) → #52 艮为山, 元堂 hào 6 → 后天 #23 山地剥 (chuẩn 飞支; ví dụ douban cho 蛊→渐 có lỗi thuật toán). Lưu ý: quẻ N=6 (乾/坤 thuần hào) cổ thư DISPUTED — cờ review. |

### Tính năng phụ trợ

- **Gia tộc nghiệm chứng**: thêm nhiều người thân → phân tích cluster đa lá số, sơ đồ chòm sao (radial) + ma trận cặp + radar 6 trục, đối chiếu nhất quán gia tộc.
- **Hiệu chỉnh giờ sinh (校正时辰)**: quét 12 giờ, rank theo coherence gia tộc.
- **Dưỡng sinh cá biệt**: ẩm thực / trà / âm nhạc / tập luyện / giấc ngủ / tinh thể theo ngũ hành Dụng Thần.
- **In / Lưu PDF** lá số, **đổi Việt → Hán**.
- 6 gợi ý câu hỏi AI nhanh (vận năm / tài chính / tình duyên / sự nghiệp / cải vận / sức khoẻ).

---

## 4. Cấu trúc code

```
.
├── index.html              # markup chính (UI, tabs, modal Settings, chat AI)
├── package.json            # scripts: dev / build / preview / test
├── vite.config.js          # Vite + proxy LLM (zai/openai/deepseek/bigmodel) tránh CORS
├── selftest.mjs            # bộ tự kiểm chứng: 956+ mục, ~88 nhóm banner, 0 fail kỳ vọng
├── verify-visual.mjs       # kiểm chứng hình ảnh (Playwright)
├── fuzz-new-modules.mjs    # fuzz test các module mới
├── fuzz-final-audit.mjs    # fuzz audit tổng
├── dist/                   # output build production
├── docs/                   # tài liệu thiết kế
├── verify-shots/           # screenshot kiểm chứng
└── src/
    ├── main.js             # UI controller (render Tứ Trụ / Cách Cục / Ngũ Hành /
    │                       #   Hội-Hợp / Thần Sát / Đại Vận / Lưu Niên / Chat AI / tất cả tabs)
    ├── style.css           # giao diện dark, phong cách huyền học
    └── engine/             # 182 module logic thuần (không phụ thuộc UI)
        ├── constants.js    # dữ liệu kinh điển: Can-Chi, Tàng can, Ngũ hành, Thập thần, Điều Hậu (窮通寶鑑)
        ├── core.js         # hàm thuần: Thập Thần, Trường Sinh (dùng chung mọi vòng)
        ├── interactions.js # Hình–Xung–Hội–Hợp (刑沖會合)
        ├── shensha*.js     # 15+ Thần Sát (神煞) + nhóm Quý Nhân cao cấp
        ├── pattern.js      # định Cách Cục theo 子平真詮
        ├── combos.js       # tổ hợp Thập thần (官印相生 / 杀印相生 / ...)
        ├── chart.js        # động cơ chính: Tứ Trụ → Ngũ Hành → Vượng Suy → Dụng Thần → Đại Vận → Lưu Niên → Tổng luận
        ├── synthesis.js    # tổng luận Mệnh — chấm đẳng cấp + phú quý theo 5 chiều
        ├── remedy.js       # 逆天改命 — động cơ cải vận (12 pháp + 了凡四训)
        ├── nlg.js          # tầng luận giải linh hoạt (định danh ý định, soạn câu trả lời tự do)
        ├── ai.js           # tích hợp LLM (OpenAI-compatible, mặc định GLM-5.2 Z.ai) + fallback cục bộ
        ├── ziwei*.js       # Tử Vi Đẩu Số (10 module: cung / sao / độ sáng / tứ hóa / song tinh / cục hình / tam phương / lưu niên / lưu nguyệt)
        ├── qizheng.js      # Thất Chính Tứ Dư (astronomy-engine)
        ├── meihua.js / liuyao.js / qimen.js / liuren.js / cezi.js   # 卜: Mai Hoa / Lục Diệu / Kỳ Môn / Lục Nhâm / Trắc Tự
        ├── physiognomy.js  # 相: diện tướng 12 cung / tử tướng / lưu niên bộ vị
        ├── zhai.js / xuankong.js / sansha.js / taisui*.js / water-activation.js / yinzhai.js   # 山: Dương/Âm Trạch
        ├── zheri*.js / huangdao.js / xiongri.js   # 择日: chọn ngày + Hoàng/Hắc Đạo + hung nhật
        ├── family*.js      # gia tộc nghiệm chứng + hiệu chỉnh giờ sinh
        ├── name.js         # 姓名学 五格剖象
        └── ...             # (còn ~100+ module chi tiết: lưu nguyệt, lưu nhật, đại vận, hôn nhân, tài, quan, sức khoẻ, dưỡng sinh...)
```

Tổng cộng **`src/engine/` chứa 182 module**.

---

## 5. Cấu hình AI

1. Mở app → nhấn nút **⚙** (góc trên phải) để mở **Settings modal**.
2. Chọn **preset** trong danh sách:
   - **★ Z.ai — PROXY DEV (glm-5.2)** — *khuyên dùng khi `npm run dev`* (đi qua Vite proxy, không bị CORS).
   - Z.ai — API chung (glm-5.2) — *chỉ chạy qua backend*.
   - Z.ai — GLM Coding Plan (glm-5.2).
   - BigModel (智谱 glm-4.6).
   - OpenAI (gpt-4o-mini).
   - (bất kỳ endpoint `/chat/completions` nào tương thích OpenAI).
3. Dán **API key** của nhà cung cấp.
4. Bật toggle **Enable** → Lưu.

Khi LLM không khả dụng, app tự **fallback cục bộ** (luận giải dựa trên cơ sở tri thức `kb.js` + NLG `nlg.js`) nên vẫn trả lời được các câu hỏi cơ bản.

> Với GLM/Z.ai/BigModel, app tự bật native **deep thinking** (`thinking: { type: 'enabled' }`).

---

## 6. Nguồn cổ pháp

Toàn bộ thuật toán bám sát các thư tịch kinh điển sau (tham chiếu thực trong `src/engine/`):

### Mệnh học (Tử Bình / Bát Tự)
- **《渊海子平》 Uyên Hải Tử Bình** — nền tảng Tử Bình (徐子平).
- **《滴天髓》 Trích Thiên Tủy** — luận mệnh sâu, khí hậu.
- **《三命通会》 Tam Mệnh Thông Hội** — bách khoa Tử Bình.
- **《子平真诠》 Tử Bình Chân Toàn** — định Cách Cục chính thống.
- **《穷通宝鉴》 Cùng Thông Bảo Giám** — Điều Hậu dụng thần theo tháng tiết.

### Tử Vi
- **《紫微斗数全书》 Tử Vi Đẩu Số Toàn Thư**.

### Thất Chính Tứ Dư
- **《果老星宗》 Quả Lão Tinh Tông**.

### Bói / Dịch
- **《周易》 Chu Dịch** + **《梅花易数》 Mai Hoa Dịch Số** (邵雍).
- **《增删卜易》 Tăng San Bốc Dịch** — Lục Diệu.
- **《奇门遁甲》 Kỳ Môn Độn Giáp**, **《大六壬》 Đại Lục Nhâm**.

### Phong thủy
- **《八宅明镜》 Bát Trạch Minh Kính** (Dương Trạch).
- **《沈氏玄空》 Thẩm Thị Huyền Không** (Phi tinh).
- **《青囊》 Thanh Nang**, **《葬书》 Táng Thư** (Âm Trạch).
- **《钦定协纪》 Khâm Định Hiệp Kỷ** (Trạch nhật).

### Tên / Cải mệnh
- **《五格剖象》 Ngũ Cách Phẫu Tượng** (姓名学).
- **《了凡四训》 Liễu Phàm Tứ Huấn** (袁了凡) — khung cải mệnh "mệnh do ta lập, phúc do ta cầu", tích âm đức (积阴德).
- **《三世书》 Tam Thế Thư** — nghiệp ba đời.
- **韦千里 (Ngàn Dặm)** — Bát Bộ mangpai.

---

## 7. Verify

Bộ tự kiểm chứng chạy hoàn toàn không cần API key (kiểm tra logic thuần):

```bash
node selftest.mjs     # 1740+ mục kiểm chứng, ~88 nhóm banner, 0 fail kỳ vọng
```

Các nhóm kiểm chứng chính (theo banner `##################` trong file):

1. Mẫu thực tế · 2. Thập Thần · 3. Hội Hợp Xung · 4. Cách Cục · 5. NLG · 6. AI Brief · 7. 用喜忌仇 + Tổng Luận · 8. Thần Sát mới · 9. 滴天髓 + Khí Hậu · 10. Cải Mệnh + Lục Thân + 9 Tầng · 11. Phong Thủy (择日/合婚/八宅) · 12. Luận Vận Năm đa phái · 13. 韦千里 Bát Bộ · 14. Lưu Nguyệt · 15. Lưu Nhật + Thái Tuế · 16. 姓名学 · 17. 盲派 + 玄空 + 改命 · ... · **黄道十二神** · **相术** · **测字** · **阴宅 二十四山** · **七政四余** · **天星择日** · **三世书** · **水法** · **通根透干** · **Cross-chart robustness** · ...

Kết quả đạt: **🎉 TẤT CẢ KIỂM CHỨNG ĐẠT (0 fail)**. Lệnh thoát `0` = pass, `1` = có thất bại.

Kiểm chứng thêm:
- `node fuzz-new-modules.mjs` — fuzz module mới.
- `node fuzz-final-audit.mjs` — fuzz audit tổng.
- `node verify-visual.mjs` — screenshot kiểm chứng (cần Playwright).

---

## Giấy phép / Mục đích

Ứng dụng phục vụ nghiên cứu huyền học phương Đông và giáo dục. Mọi luận giải mang tính tham khảo — cổ pháp là di sản văn hoá, không thay thế quyết định cá nhân hay chuyên môn y tế / pháp lý / tài chính.
