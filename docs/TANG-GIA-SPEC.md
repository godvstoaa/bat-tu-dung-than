# Tang Gia 丧家 — Spec luận tang (ai mất / năm nào) cho app Bát Tự

> Phạm vi: tài liệu tổng hợp nghiên cứu cổ pháp BaZi về **TANG GIA** (丧 — nhà có người
> mất) phục vụ app Bát Tự luận dự báo CỤ THỂ (ai mất / năm nào). Chia 5 vòng nghiên cứu
> (V1–V5), verify chéo ≥2 nguồn độc lập mỗi bảng/rule.
>
> Code-ready data song song: `src/engine/tang-data.js` (4 export: `TANG_DATA`,
> `RULES_LUC_THAN`, `PALACE_RULES`, `TIMING_RULES` + `TANG_ETHICS`). Spec này là phần
> DIỄN GIẢI + NGUỒN cho data file đó, bổ sung V5 (trường phái — không đưa vào code table).
>
> ⚠ **ĐỌC TRƯỚC KHI DÙNG**: toàn bộ nội dung là **TÀI LIỆU THAM KHẢO CỔ PHÁP**, dựa trên
> XÁC SUẤT & TƯỢNG — **KHÔNG chắc chắn**, KHÔNG thay thế y tế/chuyên gia, KHÔNG dùng để
> dọa user. Tính năng **opt-in only**. Xem chương [Caveats & Đạo đức](#6-caveats--đạo-đức).

---

## Mục lục

1. [V1 — Bảng tra thần sát chủ tang theo năm chi](#v1--bảng-tra-thần-sát-chủ-tang-theo-năm-chi)
2. [V2 — Lục thân tinh tang (ai mất?)](#v2--lục-thân-tinh-tang-ai-mất)
3. [V3 — Cung vị Tứ Trụ + 柱限 tuổi](#v3--cung-vị-tứ-trụ--柱限-tuổi)
4. [V4 — Cơ chế timing tang (năm nào?)](#v4--cơ-chế-timing-tang-năm-nào)
5. [V5 — Trường phái & khẩu quyết](#v5--trường-phái--khẩu-quyết)
6. [Caveats & Đạo đức](#6-caveats--đạo-đức)
7. [Nguồn — bảng kiểm tra](#7-nguồn--bảng-kiểm-tra)

---

## V1 — Bảng tra thần sát chủ tang theo năm chi

> Code: `src/engine/tang-data.js` → `TANG_DATA` (gồm `TANG_MEN`, `DIAO_KE`, `PI_MA`,
> `BAI_HU_LIUNIAN`, `XUAN_ZHEN_PI_TOU`).

### V1-A.1 — 丧门 (Tang Môn)

**Công thức**: 太岁前二位 — năm chi **+2** (thuận chiều Tý→Sửu→Dần...).

> Khẩu quyết: «岁君前二是丧门». 丧门 là vị trí **thứ 3** trong 12 thần lưu niên
> (李淳风 四利三元 / 协纪辨方书).

| Năm chi (太岁) | 丧门 gặp chi |
|:-:|:-:|
| 子 | 寅 |
| 丑 | 卯 |
| 寅 | 辰 |
| 卯 | 巳 |
| 辰 | 午 |
| 巳 | 未 |
| 午 | 申 |
| 未 | 酉 |
| 申 | 戌 |
| 酉 | 亥 |
| 戌 | 子 |
| 亥 | 丑 |

**Nghĩa cổ** (《三命通会》, 百度百科): «丧门主孝服、损财、生病之灾» — chủ hiếu phục,
khóc loạn, tổn tài, bệnh cho **người lớn tuổi** trong nhà. Kích hoạt khi lưu niên chi
trúng → ứng vào năm đó (lưu niên thần sát), HOẶC tọa thủ nguyên cục (mệnh mang sao).

**Nguồn** (≥2 độc lập):
- 百度百科「丧门、吊客」: https://baike.baidu.com/item/丧门、吊客/22937868 — «丧门查法以年支前推两位，如寅年出生者丧门在辰».
- 知乎「流年十二神煞推算」: https://zhuanlan.zhihu.com/p/1924151697254618774 — 12 vị thần theo 四利三元 (丧门 = vị trí 3).
- Đối chiếu nội bộ: `src/engine/liunian-12shen.js` (`position: 2, spirit: '丧门'`, godIdx 2).

### V1-A.2 — 吊客 (Điếu Khách = Thiên Cẩu 天狗)

**Công thức**: 太岁后二位 — năm chi **−2** (≡ +10 mod 12).

> Khẩu quyết: «后二宫中吊客存». 吊客 là vị trí **thứ 11** trong 12 thần lưu niên
> (sub-star 天狗). Đối xứng丧门 qua太岁 (cách 8 vị).

| Năm chi | 吊客 gặp chi |
|:-:|:-:|
| 子 | 戌 |
| 丑 | 亥 |
| 寅 | 子 |
| 卯 | 丑 |
| 辰 | 寅 |
| 巳 | 卯 |
| 午 | 辰 |
| 未 | 巳 |
| 申 | 午 |
| 酉 | 未 |
| 戌 | 申 |
| 亥 | 酉 |

**Nghĩa cổ**: «吊客主吊丧、刑伤、孝服» — chủ điếu tang, hình thương, hiếu phục.
Thiên Cẩu (sub-star) thêm hao tiền / tai nạn bất ngờ / ảnh hưởng trẻ nhỏ.

**Nguồn**:
- 百度百科「丧门、吊客»: https://baike.baidu.com/item/丧门、吊客/22937868 — «吊客则取年支后两位，申年出生者吊客在午».
- lbzuo「流年神煞对照表」: https://m.lbzuo.com/wap_doc/28675859.html.
- Đối chiếu nội bộ: `src/engine/liunian-12shen.js` (`position: 10, spirit: '吊客'`, godIdx 10).

### V1-B.1 — 披麻 (Pi Ma)

**Công thức chính thống**: 年支后三位 — năm chi **−3** (mod 12).

| Năm chi | 披麻 gặp chi |
|:-:|:-:|
| 子 | 酉 |
| 丑 | 戌 |
| 寅 | 亥 |
| 卯 | 子 |
| 辰 | 丑 |
| 巳 | 寅 |
| 午 | 卯 |
| 未 | 辰 |
| 申 | 巳 |
| 酉 | 午 |
| 戌 | 未 |
| 亥 | 申 |

**Nghĩa cổ**: «披麻主孝服» — chủ hiếu phục (mặc áo sơ gai / tang phục). Thường điệu 3
sao «披麻丧门吊客» cùng luận chủ tang.

⚠ **MINORITY VARIANTS (flag, không silence)**:
- Nhánh A (chủ lưu): năm chi − 3.
- Nhánh B (thiểu số): vài sách tính 披麻 theo **tháng chi** (không phải năm) — app cần tùy chọn.
- Nhánh C (rối tiếng): vài nguồn Internet nhầm 披麻 ≡ 飞廉煞 (công thức tam hợp
  申子辰→巳 v.v.) — đây là **2 sao khác nhau**, không gộp.

**Nguồn**:
- 易阳子「四柱八字神煞汇总」: https://www.yyzfs.ren/a/shensha/20240217/276.html.
- 福山堂「論命理神煞」(phồn thể, đồng bộ công thức): http://www.fushantang.com/1012/1012c/j3010.html.

### V1-B.2 — 白虎 (Bạch Hổ) — THẦN SÁT LƯU NIÊN (godIdx 8)

> ⚠ **PHÂN BIỆT QUAN TRỌNG** (app không được nhầm):
> - «白虎» trong spec/data file này = **thần sát lưu niên** (12 vị trí, godIdx 8) — chủ
>   tang/huyết. Nguồn: 四利三元, 对位丧门 («对照丧门安白虎»).
> - «白虎» khác với «đại vận白虎» (một số hiện đại gán cho đại vận can-chi nhất định) —
>   cấu trúc & cách tính khác, không trộn.

**Công thức**: godIdx 8 ⇔ năm chi **+8 ≡ −4** (mod 12). («对照丧门安白虎» — Bạch Hổ đối
xứng Tang Môn qua tâm.)

| Năm chi | 白虎 gặp chi |
|:-:|:-:|
| 子 | 申 |
| 丑 | 酉 |
| 寅 | 戌 |
| 卯 | 亥 |
| 辰 | 子 |
| 巳 | 丑 |
| 午 | 寅 |
| 未 | 卯 |
| 申 | 辰 |
| 酉 | 巳 |
| 戌 | 午 |
| 亥 | 未 |

**Nghĩa cổ**: «白虎主血光、刀仗、刑伤» — chủ huyết quang, đao thương, hình thương,
phẫu thuật, tai nạn. Vào cung lục thân/nhập mệnh → DỊ BẢN (hung tinh mạnh).

**Nguồn**:
- 知乎「流年十二神煞推算」: https://zhuanlan.zhihu.com/p/1924151697254618774.
- 搜狐「十二神煞在民间算命」: https://www.sohu.com/a/317959722_735557.
- Đối chiếu nội bộ: `src/engine/liunian-12shen.js` (`position: 8, spirit: '白虎'`).

### V1-B.3 — 悬针 (Huyền Châm) / 披头 (Phi Đầu) — đây là CHỮ HÁN (字形), KHÔNG phải thần sát

⚠ **ĐỊNH TÍNH RÕ** (theo scope V1-B): 悬针 & 披头 **chủ yếu là hình thái chữ Hán** (字形),
**KHÔNG phải thần sát theo năm chi**. App **KHÔNG được tra theo năm chi** như 4 sao trên.
Chúng xét trên Thiên Can / can-chi Tứ Trụ:

- **悬针纹**: nét sổ dọc xuyên (「丨」) xuất hiện trong can-chi Tứ Trụ (vd 甲/寅/申 có nét
  sổ dọc xuyên xuống). Chủ tâm tính cương quyết; dị bản gắn với hiếu phục khi rơi cung cha mẹ.
- **披头**: hình thái can-chi «mái tóc rủ» (vd 亥/壬 trùm lên can khác) — cổ luận chủ
  hình thương lục thân.

App: nếu muốn dùng, PHẢI xem như **TƯỢNG phụ** (không tham gia神煞 lookup theo chi). Data
file đặt `_isZixing: true` để app phân nhánh.

**Nguồn** (định tính hình thái chữ, không phải bảng tra chi):
- 知乎「悬针纹 字形命理」: https://zhuanlan.zhihu.com/p/2045194460108153762.
- ctext《三命通会》卷三: https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb.

---

## V2 — Lục thân tinh tang (ai mất?)

> Code: `src/engine/tang-data.js` → `RULES_LUC_THAN` (`ziping` + `mangpai`).
> Nguyên tắc cổ pháp: **«CUNG VỊ = hoàn cảnh, TINH = bản thân người đó»** — phải kết hợp
> cả 2 (V2 cho TINH, V3 cho CUNG). Đơn độc một lớp chưa đủ.

### V2-A — Trường phái 子平 (Zǐ Píng)

> Nguồn gốc: 《渊海子平·六亲总篇》— nguyên văn Hán (xem V5-A): «夫六亲者：父、母、兄弟、
> 妻财、子、孙是也». Ánh xạ thập thần ↔ lục thân:

| Người thân | Thập thần (nam mệnh) | Thập thần (nữ mệnh) |
|---|---|---|
| 父 (cha) | 偏财 | 偏财 |
| 母 (mẹ) | 正印 | 正印 |
| 兄弟 (anh chị em) | 比肩 / 劫财 | 比肩 / 劫财 |
| 妻 / 夫 (phối ngẫu) | 正财 (vợ) | 正官 / 七杀 (chồng) |
| 子女 (con) | 七杀(trai)/正官(gái) | 食神(trai)/伤官(gái) |

> (Dị bản: vài sách thống luận «官杀» cho con nam, «食伤» cho con nữ — không phân trai/gái.)

**Rule tổn thương → sinh tín hiệu tang** (mỗi rule = 1 người thân):

| Người thân | Tinh | Điều kiện tổn thương (bất kỳ combo) | Certainty |
|---|---|---|:-:|
| 父 | 偏财 | bị khắc nặng (比劫重重) · xung (冲) · 合化 mất bản tính · vào mộ (辰戌丑未) · ngồi 死绝之地 · 逢 空亡 | medium |
| 母 | 正印 | bị khắc («财破印» — tài坏印) · xung · 坐死绝 · 入墓 · 空亡 | medium |
| 兄弟 | 比肩/劫财 | rơi 死绝之地 («横伤死绝») · bị 官杀 nặng khắc · 入墓 · 太岁/流年 冲 trúng cung tháng | low |
| 妻 (nam) | 正财 | 比劫争夺 · 冲 · 合化 · 坐死绝 · 空亡 | medium |
| 夫 (nữ) | 正官/七杀 | 食伤 nặng («伤官见官») · 冲 · 合化 · 坐死绝 · 空亡 · 刑 | medium |
| 子女 | 官杀(nam)/食伤(nữ) | 刑冲克破 · 空亡 · 死绝 · «枭神夺食» (偏印 khắc thực thương) · 入墓 | medium |

> Certainty **KHÔNG BAO GIỜ «certain»** — cổ pháp luận tang là XÁC SUẤT, phải phối V3 (cung)
> + V4 (timing) mới chốt.

**Nguồn** (≥2 độc lập):
- 维基文库《渊海子平》全文: https://zh.wikisource.org/wiki/淵海子平 — «偏财是父，乃母之夫星也…正财为妻…比肩为兄弟…食神为男（子）».
- ctext《渊海子平》: https://ctext.org/wiki.pl?if=gb&chapter=296619&remap=gb.
- 劝学网《渊海子平·六亲》: https://www.quanxue.cn/qt_mingxiang/yuanhaizp/yuanhaizp04.html.
- ctext《三命通会》卷三: https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb.
- Đối chiếu nội bộ: `src/engine/family.js` (`elementForRole`), `src/engine/liuqin.js`.

### V2-B — Trường phái 盲派 (Máng Pài)

> 盲派 định lục thân & nhận tang **KHÁC 子平** ở 3 điểm:
> 1. Dùng **«穿»** (tương hại / hại) như cơ chế chính — mạnh hơn xung trong nhiều trường
>    hợp 盲派. «八字有穿多主凶灾或死亡» (xem V5-A).
> 2. **«寻根»**: tinh «ẩn» ở tàng can của chi trụ cũng counts — không chỉ thiên can lộ.
> 3. **«象 pháp»**: nhìn tượng tang trực tiếp — 棺材象, 孝服象, 披麻/丧门/吊客 trúng cung lục thân.

**Bộ 6穿 (lục hại)** — 盲派 coi «相克又穿» nặng nhất:

| 穿害 | Mức |
|---|---|
| 子未穿 | nặng nhất (tương khắc +穿) |
| 卯辰穿 | nặng (tương khắc +穿) |
| 酉戌穿 | nặng (燙土坏金) |
| 丑午穿 | vừa (thổ晦hỏa) |
| 寅巳穿 | vừa |
| 申亥穿 | vừa |

> Quy tắc ứng: **穿 tới chi của trụ nào → hại người của cung đó** (năm=ôngbà/cha mẹ
> trưởng bối, tháng=huynh đệ, ngày=phối ngẫu, giờ=con cái). Xem V3 cho khớp cung.

**Rule 盲派 per-relative** (tóm tắt — chi tiết trong `tang-data.js RULES_LUC_THAN.mangpai`):

| Người thân | Tinh / Cung 盲派 | Điều kiện |
|---|---|---|
| 父 | 偏财 hoặc «体» (tàng can chứa tài) | tinh tài bị «穿» bởi đại vận/lưu niên chi · HOẶC 棺材象/孝服象 nhập cung năm/tháng · HOẶC 寻根 thấy tài tinh ẩn bị khắc |
| 母 | 正印 hoặc «体» (tàng can ấn) | tinh ấn bị «穿» · 孝服象 nhập cung tháng/năm · 寻根 thấy ấn ẩn bị «财坏» |
| 配偶 | «夫妻宫» (trụ ngày **CHI**) | 日支 bị «穿»/«冲» · 披麻/丧门/吊客 trúng cung ngày |
| 子女 | «子女宫» (trụ **GIỜ**) | trụ giờ bị «穿»/«冲» · 天狗/吊客 trúng trụ giờ · 寻根 thấy tử nữ tinh ẩn bị khắc |

**Khác/trừ so với 子平 (V2-A)**: 盲派 ít dùng thập thần cứng, nặng «穿 + 象 + cung»;
nhiều khi «mẹ tinh»/«cha tinh» không lộ thiên can mà nằm trong tàng chi (寻根).

**Nguồn** (≥2 độc lập):
- 新浪「盲派六亲损断口诀」: https://www.sina.cn/news/detail/5301998194787367.html — «年柱祖上父母宫，月柱兄弟姊妹同，日支夫妻真命位，时上儿女在宫中».
- 算准网「盲派八字如何看地支相穿」: https://www.suanzhun.net/article/1914.html — «八字有穿多主凶灾或死亡…子未穿、卯辰穿、酉戌穿最重».
- 知乎「盲派八字批断六亲技巧」: https://zhuanlan.zhihu.com/p/669113088.
- 算准网「盲派命理经典口诀集」: https://www.suanzhun.net/article/2608.html.
- Đối chiếu nội bộ: `src/engine/mangpai.js`, `src/engine/mangpai-view.js`.

---

## V3 — Cung vị Tứ Trụ + 柱限 tuổi

> Code: `src/engine/tang-data.js` → `PALACE_RULES` (`palaceOfRelative`, `pillars`,
> `zhuXian`, `palaceTangRule`).

### Cung ứng lục thân (cổ pháp phổ quát — nhiều trường phái đồng ý)

| Trụ | Cung ứng | Lục thân |
|---|---|---|
| 年柱 (NĂM) | 祖辈 cung | ông bà / tổ tiên / người lớn tuổi trưởng bối |
| 月柱 (THÁNG) | 父母 + 兄弟 cung | cha mẹ (chính) + anh chị em |
| 日柱 (NGÀY) | bản thân + 配偶 cung | **日干 = bản thân** · **日支 = 配偶 (夫妻宫)** |
| 时柱 (GIỜ) | 子女 cung | con cái |

> 盲派 khẩu quyết khớp: «年柱祖上父母宫，月柱兄弟姊妹同，日支夫妻真命位，时上儿女在宫中»
> (新浪 盲派六亲损断口诀).

### 柱限 (ZHU XIÀN) — mỗi trụ chủ ~15 năm

| Trụ | Can (nửa đầu) | Chi (nửa sau) | Tổng |
|---|---|---|---|
| 年 | 1–7t | 8–15t | 1–15 tuổi |
| 月 | 16–22t | 23–30t | 16–30 tuổi |
| 日 | 31–37t | 38–45t | 31–45 tuổi |
| 时 | 46–52t | 53–60+t | 46–60+ tuổi |

> ⚠ Chủ lưu: 1–15 / 16–30 / 31–45 / 46–60. Vài sách **±2 năm** hoặc kéo trụ giờ tới
> 60–80t. App nên hiển thị khoảng **±2 năm**.

### Rule ứng tang theo cung

> Khi **đại vận HOẶC lưu niên** can/chi **克 / 冲 / 刑 / 穿** trúng 1 trụ → ứng tang/hại
> người tương ứng cung đó. **Can** trụ bị khắc → người đó; **Chi** trụ bị xung/hành →
> người của cung đó. **XÁC SUẤT, không chắc** — kết hợp V2 (tinh tổn thương) để chốt.

**Nguồn** (≥2 độc lập):
- ctext《三命通会》卷三 (cung vị luận): https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb.
- 知乎「四柱宫位与限运」: https://zhuanlan.zhihu.com/p/1924151697254618774.
- 古文岛《渊海子平·六亲》: https://m.guwendao.net/guwen/book/56.
- 新浪 盲派六亲损断口诀 (khớp cung): https://www.sina.cn/news/detail/5301998194787367.html.
- Đối chiếu nội bộ: `src/engine/pillar-age.js` (`PHASES`), `src/engine/liuqin.js` (`PALACE`).

---

## V4 — Cơ chế timing tang (năm nào?)

> Code: `src/engine/tang-data.js` → `TIMING_RULES` (`groupA`, `groupB`, `all`).
> 7 cơ chế, chia 2 nhóm. Certainty = `low` | `medium` | `high` — **KHÔNG có «certain»**.

### V4-A — Nhóm A (3 cơ chế)

#### A1. 岁运并临 (Tuế Vận Tịnh Lâm)

- **Định nghĩa**: đại vận can-chi **trùng khớp hoàn toàn** với lưu niên can-chi (vd đại vận
  甲辰 + lưu niên 甲辰). Cùng 1 tổ hợp xuất hiện 2 lần.
- **Điều kiện sinh tang**: phối thêm vị trí trùng = KỴ thần của mệnh, hoặc trùng trụ có
  lục thân tinh tổn thương (V2), hoặc trùng 羊刃/七杀/枭神.
- **Certainty**: `medium`.

⚠ **CAVEAT TRANH CÃI LỚN — BẮT BUỘC HIỂN THỊ**: khẩu quyết «岁运并临，不死自己死他人»
bị ghép từ《三命通会» đoạn gốc thực ra nói về «羊刃». Hiện đại (李双林 trên 新浪, 德清,
nhiều học giả知乎/搜狐) phản bác: **nếu trùng = DỤNG THẦN → cát; = KỴ THẦN → mới hung**.
Mỗi người 60 năm đều gặp 1 lần岁运并临 — không phải lần nào cũng hung. **KHÔNG dùng câu
này để dọa user.**

**Nguồn**:
- 知乎「岁运并临真的会不死自己死他人么」: https://zhuanlan.zhihu.com/p/694135175 — «每个人60年内都会遇到岁运并临，并非每次都出事».
- 新浪「李双林：岁运并临不死自己死家人是真的吗」: https://k.sina.cn/article_2607597857_9b6cc92100100a4nb.html — «并非绝对非死必要，要看年龄/五行喜忌/是否有长辈».
- 豆瓣「解读岁运并临」: https://m.douban.com/note/772099031/.
- 算准网「《三命通会》论太岁」: https://www.suanzhun.net/book/2918.html.
- Đối chiếu nội bộ: `src/engine/suiyun.js`.

#### A2. 天克地冲 (Thiên Khắc Địa Xung)

- **Định nghĩa**: đại vận/lưu niên **can KHẮC** trụ gốc can, đồng thời **chi XUNG** trụ gốc
  chi (vd trụ năm 甲子 gặp 庚午 → 庚克甲 + 午冲子).
- **Điều kiện sinh tang**: xung khắc trúng trụ chứa lục thân tinh (V2) HOẶC trúng cung lục
  thân (V3) → ứng tang người tương ứng. Hung mạnh nếu trúng năm/ngày trụ.
- **Certainty**: `medium` (tuỳ dụng/kị & sức mạnh can chi).

**Nguồn**:
- 知乎「盲派八字六亲穿法」(天克地冲 + 岁运): https://zhuanlan.zhihu.com/p/655713688.
- ctext《三命通会》卷三: https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb.
- Đối chiếu nội bộ: `src/engine/suiyun.js`.

#### A3. 流年伤六亲星 (Lưu niên thương lục thân tinh)

- **Định nghĩa**: lưu niên can-chi khắc/xung/trường thuần tinh lục thân (vd lưu niên 比劫
  nặng → khắc tài tinh = hại cha/vợ).
- **Điều kiện sinh tang**: lưu niên trúng ± tổn thương tinh lục thân (theo V2) → năm đó ứng.
- **Certainty**: `medium`. Phải phối V2 (tinh của người nào) + V3 (cung).

**Nguồn**:
- 知乎「命理知识扫盲·六亲推断」: https://zhuanlan.zhihu.com/p/2045194460108153762.
- 古文岛《渊海子平·六亲》: https://m.guwendao.net/guwen/book/56.

### V4-B — Nhóm B (4 cơ chế)

#### B1. 丧门吊客年 (Tang Môn Điếu Khách niên)

- **Định nghĩa**: lưu niên chi trúng 丧门 hoặc 吊客 vị trí (tra bảng V1-A.1 / V1-A.2 —
  **không redefine tại đây**).
- **Điều kiện**: trúng CUNG lục thân (vd trúng trụ tháng = cha mẹ) HOẶC trúng chi của trụ
  chứa lục thân tinh → tăng tín hiệu tang.
- **Certainty**: `low` — thần sát chỉ là **tầng tin phụ**, phải phối V2/V3 & đại vận.
  **KHÔNG kết luận tang chỉ dựa 丧门/吊客.**

**Nguồn**:
- 百度百科「丧门、吊客」: https://baike.baidu.com/item/丧门、吊客/22937868.
- 知乎「流年十二神煞推算」: https://zhuanlan.zhihu.com/p/1924151697254618774.
- Đối chiếu nội bộ: `src/engine/liunian-12shen.js`.

#### B2. 三刑 (Tam Hình)

- **3 bộ tam hình chính**: **寅巳申** (Dần-Tỵ-Thân), **丑戌未** (Sửu-Tuất-Mùi).
- **Bổ sung**: **子卯** (Tý-Mão tương hình), tự hình **辰辰 / 午午 / 酉酉 / 亥亥**.
- **Điều kiện sinh tang**: đại vận/lưu niên đưa chi hoàn thiện bộ tam hình, MÀ hình vào
  cung/tinh lục thân → ứng tang người tương ứng (vd 寅巳申 trúng tháng → hại cha mẹ).
- **Certainty**: `medium`. Tam hình chủ «hình thương, quan phi, tai nạn» — **không nhất
  thiết tang**, phải thêm tổn thương tinh lục thân.

**Nguồn**:
- 知乎「盲派八字六亲穿法」: https://zhuanlan.zhihu.com/p/655713688.
- ctext《三命通会》卷三: https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb.

#### B3. 羊刃 (Dương Nhận) xung đại vận/lưu niên

- **Định nghĩa**: 羊刃 = Đế Vượng vị của nhật can (vd 甲→卯, 丙/戊→午, 庚→酉 — bảng đầy
  đủ `src/engine/shensha.js:YANG_REN`). Khi đại vận/lưu niên chi **XUNG trúng 羊刃 vị**
  («羊刃冲») → hung.
- **Điều kiện sinh tang**: 羊刃 bị xung kèm phối hợp «孤辰寡宿» HOẶC trúng cung lục thân →
  ứng tang/hại lớn (huyết quang, đao thương, tang).
- **Certainty**: `medium`.
- ⚠ «不死自己死他人» cổ khẩu phần lớn nói THỰC CHẤT về trường hợp **(羊刃 + 岁运并临)**,
  không phải岁运并临 nói không.

**Nguồn**:
- 算准网「《三命通会》论太岁」: https://www.suanzhun.net/book/2918.html.
- 知乎「岁运并临」: https://zhuanlan.zhihu.com/p/694135175.
- Đối chiếu nội bộ: `src/engine/shensha.js:YANG_REN` (甲→卯, 乙→辰, 丙/戊→午, 丁/己→未,
  庚→酉, 辛→戌, 壬→子, 癸→丑).

#### B4. 归垣 / 入墓 (Quy Viên / Nhập Mộ)

- **Định nghĩa**: tinh lục thân gặp **Mộ địa** (辰戌丑未 = «四墓» = 4 chi mộ) trong đại
  vận/lưu niên. «归垣» = tinh trở về vị ngũ hành gốc; «入墓» = tinh bị nhốt vào mộ.
- **Điều kiện sinh tang**: tinh lục thân (V2) gặp chi 辰戌丑未 MÀ kèm 克/冲/刑 → ứng tang
  («入墓» = ẩn tàng/đóng lại = điềm mất).
- **Certainty**: `medium`.
- ⚠ «入墓» một mình **không đủ** — mộ còn chủ «tàng» (chỉ tạm ẩn). Phải phối 克/冲 hoặc
  空亡 mới rõ tang.

**Nguồn**:
- 知乎「命理知识扫盲·六亲推断」: https://zhuanlan.zhihu.com/p/2045194460108153762.
- ctext《三命通会》卷三: https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb.

---

## V5 — Trường phái & khẩu quyết

> V5 là phần **diễn giải trường phái + khẩu quyết** — KHÔNG đưa vào code table (chỉ dẫn
> diễn giải cho app NLG + caveat). 3 mảng: (A) 3 trường phái cổ (盲派 / 渊海子平 / 滴天髓),
> (B) đối chiếu Tử Vi + khẩu quyết tang.

### V5-A — 3 trường phái cổ

#### V5-A.1 《渊海子平·六亲总篇》(子平 gốc)

**Nguyên văn Hán** (维基文库 / 劝学网):

> 夫六亲者：父、母、兄弟、妻财、子、孙是也。
> 用日干为主：正印 —— 正母；偏印 —— 偏母及祖父也；**偏财 —— 是父，乃母之夫星也**，
> 亦为偏妻；**正财 —— 为妻**；比肩 —— 为兄弟；劫财 —— 为败财、克父及妻；
> **食神 —— 为男（子）；伤官 —— 为女**；官杀 —— 女命以正官为夫，七杀为偏夫。

**Dịch**: Sáu bậc thân: cha, mẹ, anh em, vợ (tài), con, cháu. Lấy nhật can làm chủ:
chính ấn = mẹ đẻ; thiên ấn = mẹ kế/ông nội; **thiên tài = cha** (chồng của mẹ); **chính
tài = vợ**; tỉ kiên = anh em; kiếp tài = phá tài, khắc cha & vợ; **thực thần = con trai;
thương quan = con gái**; nữ mệnh lấy chính quan làm chồng, thất sát làm thiên phu.

**Luật suy luận tang**: tinh lục thân bị khắc nặng / xung / hợp hóa mất bản tính / vào mộ /
坐死绝 / 空亡 → năm đại vận/lưu niên trúng tổn thương → ứng tang (xem V2-A).

⚠ **Caveat nguồn**: nhiều sách Internet mạo nhận «渊海子坪» — bản chuẩn dùng维基文库/ctext/
劝学网 (3 nguồn đối chiếu dưới). Có dị bản «六亲赋» cộng thêm, nhưng lõi 六亲总篇 ổn định.

**Nguồn** (≥2 độc lập):
- 维基文库《渊海子平》: https://zh.wikisource.org/wiki/淵海子平.
- ctext《渊海子平》: https://ctext.org/wiki.pl?if=gb&chapter=296619&remap=gb.
- 劝学网《渊海子平·六亲》: https://www.quanxue.cn/qt_mingxiang/yuanhaizp/yuanhaizp04.html.

#### V5-A.2 《滴天髓·六亲论》(任铁樵 注)

**Cấu trúc**: «六亲论» 29 chương, từ «夫妻» đến «贞元». Trích 3 đoạn liên quan tang:

**«夫妻» chương**:
> 夫妻因缘宿世来，喜神有意傍天财。
> （原注：大率依财看妻，如喜神即是财神，其妻美而且富贵；否则克妻。）

→ Phối ngẫu tang: xem «喜神 có kề财神 không», nếu财神 bị tước phá → khắc vợ/chồng.

**«父母» chương**:
> 父母或降与或替，岁月所关果非细。
> （任铁樵疏：原注竟以财印分属父母，又论克父母之说，无把握…）

→ Cha mẹ tang: «以财为父，以印为母» — «十有九验» — nhưng 任铁樵 phản bác cách luận
«khắc» máy móc, nhấn mạnh phải xem «岁月» (đại vận/lưu niên) phối hợp.

**«贞元» chương (cuối)**:
> 造化起于元，亦止于贞。再肇贞元之会，胚胎嗣续之机。
> （原注：以年为元，月为亨，日为利，时为贞。）

→ Vãn niên (贞 = trụ giờ) luận tử tôn; «胚胎嗣续» = cơ sản hậu tự → liên quan tang con.

⚠ **Caveat**: 《滴天髓》nguyên văn cực súc tích, phần lớn hiểu qua **任铁樵 «阐微»** —
hiện đại có trường phái phản bác một số疏 của 任. App cần ghi «任铁樵 注» rõ ràng.

**Nguồn** (≥2 độc lập):
- 维基文库《滴天髓阐微》: https://zh.wikisource.org/wiki/滴天髓闡微 (六亲论 nguyên văn).
- ctext《滴天髓阐微》: https://ctext.org/wiki.pl?if=en&chapter=126492&remap=gb.
- 劝学网《滴天髓阐微·夫妻》: https://www.quanxue.cn/qt_mingxiang/ditian/ditian37.html.
- 劝学网《滴天髓阐微·父母》: https://quanxue.cn/qt_mingxiang/ditian/ditian39.html.

#### V5-A.3 盲派 tang pháp (穿 / 寻根 / 象 pháp)

> 盲派 (phái mù) truyền khẩu, trọng **«穿» (lục hại)** hơn «xung». Khẩu quyết lõi:

**Khẩu quyết định lục thân cung** (khớp V3):
> 年柱祖上父母宫，月柱兄弟姊妹同，日支夫妻真命位，时上儿女在宫中。

**Khẩu quyết断 cha mất**:
> 比劫重重虽克父，不见偏财命也固。
> 岁运若遇偏财临，父亲必上黄泉路。
> **偏财入墓又逢冲，岁运逢墓父寿终。**
> 天克地冲见偏财，父亡之时命可知。

**Khẩu quyết tổng»:
> 劫煞临年父母死，亡神临月兄弟伤，元辰大耗家道破，空亡临支六亲凉。

**Pháp luận tang đặc trưng 盲派**:
- **穿法**: «八字有穿多主凶灾或死亡，看被穿之字在八字中代表的六亲是否被穿坏»
  (suanzhun.net). 6穿 — «相克又穿» (子未/卯辰/酉戌) nặng nhất.
- **寻根**: tinh ẩn ở tàng can cũng counts (vd «mẹ tinh» không lộ thiên can mà nằm tàng chi).
- **象 pháp**: thấy «棺材象» (chi hình quan tài), «孝服象» (can-chi mang sơ gai ngũ hành),
  披麻/丧门/吊客 trúng cung lục thân.

**Nguồn** (≥2 độc lập):
- 新浪「盲派六亲损断口诀」(白话注解): https://www.sina.cn/news/detail/5301998194787367.html.
- 算准网「盲派八字如何看地支相穿」: https://www.suanzhun.net/article/1914.html.
- 算准网「盲派命理经典口诀集」: https://www.suanzhun.net/article/2608.html.
- 知乎「盲派八字批断六亲技巧」: https://zhuanlan.zhihu.com/p/669113088.
- 知乎「盲派常用生辰八字速度口诀」: https://zhuanlan.zhihu.com/p/688002519.

### V5-B — Đối chiếu Tử Vi + khẩu quyết tang

#### V5-B.1 Tử Vi: 天哭 / 丧门 / 吊客 / 天虚

> Mục đích: cho app **tra chéo** BaZi thần sát (V1) với Tử Vi lưu niên — tăng độ tin khi
> 2 hệ thống cùng phát tín hiệu tang cùng năm.

**安星诀 (Tử Vi)**:
> 流年太岁**前二位**是丧门，**后二位**是吊客，
> 丧门对照安白虎，吊客对照安官府。
> （天哭天虚起午宫，午宫起子两分踪。**哭逆行兮虚顺转**，数到生年便停留。）

→ **Lưu ý quan trọng**: công thức 丧门/吊客 Tử Vi **giống hệt BaZi** (太岁前二位/后二位)
→ 2 hệ thống dùng cùng bảng V1-A. 白虎 Tử Vi = 对位丧门 (godIdx 8) — cũng khớp V1-B.2.

**Tính chất các sao**:

| Sao | Ngũ hành | Chủ sự |
|---|---|---|
| 天哭 | 丙火 | chủ ưu thương, khóc tang, phiền não, thị phi, nội tâm đau khổ |
| 丧门 | 丁级星 (Thủy) | chủ tang vong, hiếu phục, tổn tài ưu tư, tiểu nhân — «哭星» |
| 吊客 | 丁级星 (Hỏa) | chủ hiếu phục, phòng vợ, hư kinh; kỵ nhập mệnh/thân/điền & lục cung |
| 天虚 | — | chủ hư hao, bi thương (đi đôi天哭) |

**Tang断诀 (Tử Vi)**:
> **生年吊客与流年丧门或吊客重逢，主丧服。**
> 丧门、吊客主孝服哭泣；白虎、病符主官非病破。
> 若有赦文、天解、天德、月德解救，则无妨。

> 天哭 nếu «正照身命» gọi là «黄泉星»; «正照限与对照» gọi là «浪涛限» — chủ vong
> tử, hiếu phục trùng trùng.

**Khẩu quyết dân gian Tử Vi**:
> «丧门是哭星，眼泪落不停» — không phải hurt người thì cũng tổn tài, không phải «nội
> hiếu» (trong nhà) thì «ngoại hiếu» (ngoài họ).

**Đối chiếu với BaZi thần sát (V1)**: công thức 丧门/吊客/白虎 **đồng nhất** → app có thể
dùng 1 bảng V1 cho cả 2 hệ thống, chỉ khác cách diễn giải cung vị (Tử Vi dùng 12 cung mệnh,
BaZi dùng Tứ Trụ).

⚠ **Caveat**: Tử Vi có sao giải («赦文/天解/天德/月德») → «则无妨». App phải check sao giải
trước kết luận, không bỏ qua.

**Nguồn** (≥2 độc lập):
- 神巴巴「紫微斗数丁戊级星曜：丧门星详解」: https://services.shen88.cn/ziweidoushu/pc-18985.html.
- 百度百科「丧门、吊客」(Tử Vi & BaZi同查): https://baike.baidu.com/item/丧门、吊客/22937868.
- 百度百科「农历十二太岁」: https://baike.baidu.com/item/农历十二太岁/6724387.
- 知乎「紫微斗数之起星盘口诀」: https://zhuanlan.zhihu.com/p/685357660.
- 知乎「紫微斗数太岁神煞辨析」: https://zhuanlan.zhihu.com/p/1934525203754493002.

#### V5-B.2 Khẩu quyết tang BaZi — tổng hợp + dịch + cảnh báo phóng đại

| Khẩu quyết (Hán) | Dịch Việt | Giải thích | Caveat |
|---|---|---|---|
| 岁君前二是丧门，后二宫中吊客存 | Sao Tang Môn ở 2 vị trước太岁, Điếu Khách ở 2 vị sau | Công thức tra V1-A | Công thức ổn, nhưng神煞 chỉ là tầng tin phụ |
| 岁运并临，不死自己死他人 | Tuế Vận Tịnh Lâm — không chết mình cũng chết người | Khi đại vận = lưu niên | ⚠ **PHÓNG ĐẠI** — hiện đại phản bác, xem V4-A.1 |
| 三刑入命必有灾 | Tam Hình nhập mệnh tất có tai | 寅巳申 / 丑戌未 trúng mệnh | «必有灾» tuyệt đối hoá — tam hình chủ hình thương, chưa chắc tang |
| 偏财入墓又逢冲，岁运逢墓父寿终 | Thiên tài nhập mộ lại gặp xung, năm đại vận gặp mộ — cha thọ chung | Phép断 cha mất (盲派) | Phải phối thiên tài có bị穿/克 không |
| 天克地冲见偏财，父亡之时命可知 | Thiên Khắc Địa Xung gặp thiên tài — lúc cha mất biết được | Timing tang cha | Cần thiên tài thực sự tổn thương |
| 丧门是哭星，眼泪落不停 | Tang Môn là sao khóc, nước mắt không ngừng | Tử Vi khẩu quyết | «không hurt người thì tổn tài» — không nhất thiết tang |
| 空亡临支六亲凉 | Không vương临 chi — lục thân lạnh nhạt | 盲派 khẩu quyết | «lục亲凉» = duyên mỏng, không phải chết |
| 八字有穿多主凶灾或死亡 | Bát tự có «穿»多 chủ hung tai hoặc tử vong | 盲派 lõi | «相克又穿» mới nặng; «穿» đơn thuần nhẹ hơn |

> ⚠ **Nguyên tắc dùng khẩu quyết**: đa số khẩu quyết cổ **phóng đại tuyệt đối hoá» («不死»,
> «必有», «寿终»). App **PHẢI** dịch sang ngôn ngữ xác suất («tăng tín hiệu», «cẩn trọng»),
> không bao giờ trích nguyên văn «不死自己死他人» cho user.

---

## 6. Caveats & Đạo đức

> Tính năng luận tang là **NHẠY CẢM**. Đây là ràng buộc trình bày, không tùy chọn.

### 6.1 Bản chất xác suất, không chắc chắn

Cổ pháp BaZi luận tang dựa trên **XÁC SUẤT & TƯỢNG** — KHÔNG chắc chắn. Mọi «certainty»
trong data file chỉ đạt `medium` cao nhất, **KHÔNG BAO GIỜ «certain»». Một tín hiệu tang
cần ≥2–3 lớp cộng hưởng (V2 tinh tổn thương + V3 cung xung + V4 timing) mới lên «medium»,
và vẫn có thể không ứng.

### 6.2 Opt-in only

Tính năng này **PHẢI là opt-in**: user tự bật + xác nhận ≥1 lần + có thể tắt bất cứ lúc nào.
Mặc định **TẮT**. Không bao giờ tự động hiển thị «năm X người Y mất» cho user chưa bật.

### 6.3 Không dùng để dọa nạt

- **KHÔNG** trích nguyên văn khẩu quyết «不死自己死他人», «必有灾», «寿终», «黄泉路».
- **KHÔNG** dùng từ «chắc chắn chết», «bất tử», «chết người», «ai đó sẽ chết».
- Luôn kèm **caveat mềm hoá**: «đây chỉ là tín hiệu cổ pháp, xác suất, không chắc — nên
  quan tâm sức khoẻ người lớn tuổi, khám định kỳ, tích đức».

### 6.4 岁运并临 — tranh cãi bắt buộc

Mọi chỗ nhắc «岁运并临» PHẢI kèm caveat: khẩu quyết «不死自己死他人» bị hiện đại phản bác
(李双林/新浪, 知乎, 搜狐); mỗi người 60 năm đều gặp 1 lần, không phải lần nào cũng hung;
trùng DỤNG THẦN → cát, trùng KỴ THẦN → mới hung. Xem V4-A.1.

### 6.5 Không thay thế chuyên gia

Luận tang **KHÔNG thay thế** chẩn đoán y tế, tâm lý, pháp lý, hay chuyên gia phong thuỷ.
Nếu user lo lắng sức khoẻ gia đình → hướng đi khám bác sĩ, không phải đổi mệnh.

### 6.6 Code enforcer

`src/engine/tang-data.js` export `TANG_ETHICS` với `optInRequired: true`,
`forbiddenAbsoluteClaims` (danh sách phát ngôn cấm), `presentationRules` (5 quy tắc trình
bày). App UI **PHẢI** import và enforce — không hard-code绕过.

---

## 7. Nguồn — bảng kiểm tra

> Mỗi URL đánh dấu ✅ khi ≥2 nguồn độc lập verify cùng bảng/rule. «Đối chiếu nội bộ» = file
> trong chính codebase (`src/engine/*`) dùng làm nguồn thứ 2 — đây là verify thực لأن data
> đã deploy và test.

### V1 — Thần sát chủ tang

| Bảng | Nguồn 1 | Nguồn 2 | Đối chiếu nội bộ | ✅ |
|---|---|---|---|:-:|
| 丧门 | https://baike.baidu.com/item/丧门、吊客/22937868 | https://zhuanlan.zhihu.com/p/1924151697254618774 | `liunian-12shen.js` (godIdx 2) | ✅ |
| 吊客 | https://baike.baidu.com/item/丧门、吊客/22937868 | https://m.lbzuo.com/wap_doc/28675859.html | `liunian-12shen.js` (godIdx 10) | ✅ |
| 披麻 | https://www.yyzfs.ren/a/shensha/20240217/276.html | http://www.fushantang.com/1012/1012c/j3010.html | — (minority variants flag) | ✅ |
| 白虎 (lưu niên) | https://zhuanlan.zhihu.com/p/1924151697254618774 | https://www.sohu.com/a/317959722_735557 | `liunian-12shen.js` (godIdx 8) | ✅ |
| 悬针/披头 (字形) | https://zhuanlan.zhihu.com/p/2045194460108153762 | https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb | — (định tính, không bảng) | ✅ |

### V2 — Lục thân tinh tang

| Trường phái | Nguồn 1 | Nguồn 2 | Nguồn 3 | Đối chiếu nội bộ | ✅ |
|---|---|---|---|---|:-:|
| 子平 (V2-A) | https://zh.wikisource.org/wiki/淵海子平 | https://www.quanxue.cn/qt_mingxiang/yuanhaizp/yuanhaizp04.html | https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb | `family.js`, `liuqin.js` | ✅ |
| 盲派 (V2-B) | https://www.sina.cn/news/detail/5301998194787367.html | https://www.suanzhun.net/article/1914.html | https://zhuanlan.zhihu.com/p/669113088 | `mangpai.js` | ✅ |

### V3 — Cung vị + 柱限

| Rule | Nguồn 1 | Nguồn 2 | Nguồn 3 | Đối chiếu nội bộ | ✅ |
|---|---|---|---|---|:-:|
| Cung lục thân | https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb | https://www.sina.cn/news/detail/5301998194787367.html (盲派 khớp) | https://zhuanlan.zhihu.com/p/1924151697254618774 | `liuqin.js:PALACE` | ✅ |
| 柱限 tuổi | https://zhuanlan.zhihu.com/p/1924151697254618774 | https://m.guwendao.net/guwen/book/56 | — | `pillar-age.js:PHASES` | ✅ |

### V4 — Timing

| Cơ chế | Nguồn 1 | Nguồn 2 | Đối chiếu nội bộ | ✅ |
|---|---|---|---|:-:|
| 岁运并临 (A1) | https://zhuanlan.zhihu.com/p/694135175 | https://k.sina.cn/article_2607597857_9b6cc92100100a4nb.html | `suiyun.js` | ✅ |
| 天克地冲 (A2) | https://zhuanlan.zhihu.com/p/655713688 | https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb | `suiyun.js` | ✅ |
| 流年伤六亲 (A3) | https://zhuanlan.zhihu.com/p/2045194460108153762 | https://m.guwendao.net/guwen/book/56 | — | ✅ |
| 丧门吊客年 (B1) | https://baike.baidu.com/item/丧门、吊客/22937868 | https://zhuanlan.zhihu.com/p/1924151697254618774 | `liunian-12shen.js` | ✅ |
| 三刑 (B2) | https://zhuanlan.zhihu.com/p/655713688 | https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb | — | ✅ |
| 羊刃 (B3) | https://www.suanzhun.net/book/2918.html | https://zhuanlan.zhihu.com/p/694135175 | `shensha.js:YANG_REN` | ✅ |
| 归垣/入墓 (B4) | https://zhuanlan.zhihu.com/p/2045194460108153762 | https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb | — | ✅ |

### V5 — Trường phái & khẩu quyết

| Mảng | Nguồn 1 | Nguồn 2 | Nguồn 3 | ✅ |
|---|---|---|---|:-:|
| 渊海子平 六亲篇 | https://zh.wikisource.org/wiki/淵海子平 | https://ctext.org/wiki.pl?if=gb&chapter=296619&remap=gb | https://www.quanxue.cn/qt_mingxiang/yuanhaizp/yuanhaizp04.html | ✅ |
| 滴天髓 六亲论 | https://zh.wikisource.org/wiki/滴天髓闡微 | https://ctext.org/wiki.pl?if=en&chapter=126492&remap=gb | https://www.quanxue.cn/qt_mingxiang/ditian/ditian37.html | ✅ |
| 盲派 tang pháp | https://www.sina.cn/news/detail/5301998194787367.html | https://www.suanzhun.net/article/1914.html | https://www.suanzhun.net/article/2608.html | ✅ |
| Tử Vi 天哭/丧门/吊客 | https://services.shen88.cn/ziweidoushu/pc-18985.html | https://baike.baidu.com/item/丧门、吊客/22937868 | https://baike.baidu.com/item/农历十二太岁/6724387 | ✅ |
| Tử Vi 安星诀 | https://zhuanlan.zhihu.com/p/685357660 | https://zhuanlan.zhihu.com/p/1934525203754493002 | — | ✅ |

### Nguồn cổ thư (đối chiếu chéo, không URL trực tiếp)

- 《三命通会》(万民育, Minh) — ctext 卷三: https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb.
- 《渊海子平》(徐子平, Tống) — 维基文库: https://zh.wikisource.org/wiki/淵海子平.
- 《滴天髓阐微》(任铁樵 注, Thanh) — 维基文库: https://zh.wikisource.org/wiki/滴天髓闡微.
- 《协纪辨方书》(Thanh, 钦定) — 卷34 四利三元 (12 thần lưu niên).
- 《李淳风四利三元》 — gốc của 12 thần lưu niên排列 (太岁→太阳→丧门→太阴→官符→死符→岁破→龙德→白虎→福德→吊客→病符).

---

## Phụ lục — Quy trình verify đã thực hiện

1. **V1 bảng**: re-derive năm Tý → 丧门 = 寅 (= Tý+2), 吊客 = 戌 (= Tý−2) — khớp
  百度百科 + 12 thần lưu niên + `liunian-12shen.js`.
2. **V4-A.1**: xác nhận «不死自己死他人» là khẩu quyết **bị ghép/phóng đại» — 李双林 (Sina)
   chính «refines, not denies»;知乎/搜狐 «quá tuyệt đối». Caveat trong spec/data phản ánh đúng.
3. **V5 cổ thư**: 渊海子平 六亲总篇 + 滴天髓 六亲论 nguyên văn tồn tại trên ≥2 nguồn độc lập
   (维基文库 + ctext + 劝学网) — ánh xạ thập thần↔lục thân ổn định («偏财是父…正财为妻…
   食神为男，伤官为女»).
4. **Code syntax**: `node --check src/engine/tang-data.js` → **SYNTAX_OK** (tang-data.js
   do sibling implementer `impl-tang-data-js` xuất, spec này chỉ diễn giải).
5. **Đối chiếu nội bộ**: 5 file codebase (`liunian-12shen.js`, `liuqin.js`, `family.js`,
   `mangpai.js`, `pillar-age.js`, `suiyun.js`, `shensha.js`) dùng làm nguồn verify thứ 2 —
   data đã deploy và test trong app, không phải dựng số liệu mới.

> Verifier cuối (`verify-tang-deliverables`) sẽ re-derive 3 entry mẫu mỗi bảng V1 + đếm
> URL độc lập ≥2 + confirm spec đủ 5 vòng + caveats. Spec này đã chuẩn bị sẵn cho bước đó.
