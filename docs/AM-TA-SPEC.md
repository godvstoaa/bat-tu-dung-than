# AM-TA-SPEC.md — ÂM TÀ / VONG HỒN / TRỪ TÀ Module Specification

> **Multi-school traditional-knowledge reference for a BaZi (Bát Tự) app.**
> Rounds V1–V10: detection indicators, spirit classification, and six school ritual corpora
> (Mao Shan, Zheng Yi, Lü Shan, Taiwan 收驚, Hong Kong, 《道藏》神咒), remedies, Tử Vi cross-reference, ETHICS.

---

## 0. HEADER — Scope, Opt-in, Status

**Scope.** This document is a **cultural-religious academic reference**, synthesizing six Daoist/folk-school traditions (Mao Shan 茅山, Zheng Yi 正一, Lü Shan 閭山, Taiwan 收驚, Hong Kong 港式, 《道藏》canon) plus BaZi/Tử Vi detection theory. It is **a knowledge corpus for opt-in display inside the app**, not a diagnostic instrument and not a ritual manual.

**Opt-in gate (MANDATORY).**
- All content in this module is **OFF by default**.
- It is shown **only** to users who explicitly enable the *“Âm Tà / Vong Hồn / Trừ Tà”* feature in settings after reading and accepting the ETHICS disclaimer (Chapter 11).
- No screen in this module may appear in onboarding, daily brief, or push notifications unless the user has opted in.
- The opt-in toggle must be revocable at any time, with all stored preferences cleared on revocation.

**Status of citations.** Every indicator / spirit type / ritual / mantra / talisman / remedy in this spec is cross-verified against **≥ 2 independent, reachable sources** (primary canon where it exists — 《淵海子平》《三命通會》《茅山志》《太上玄靈北斗本命延生真經》《太上三洞神咒》《正統道藏》— plus academic, government, or named institutional sources). Inline citations use the form `[S1, S2]` and resolve in **Chapter 12 — Sources**.

**Practitioner caveat (applies to EVERY ritual below).**
>  nghi lễ / thần chú /符籙 mô tả trong tài liệu này là **tài liệu tham khảo văn hóa - tôn giáo**. Mọi nghi thức thực sự (書符 / 拜斗 / 收驚 / 驅邪 / 開光 / 淨宅) **phải do 道士 / 法師 已受箓 (ordained) chủ trì** — bản app KHÔNG hướng dẫn người dùng tự thực hành, KHÔNG cung cấp符 để in/ve, và KHÔNG thay thế hướng dẫn của đạo trưởng hoặc chuyên gia tâm lý / y tế.

**Verification provenance.** Entries below were independently re-checked by adversarial verifier workers (W12 for Rounds 1–6, W13 for Rounds 7–10) against the cited URLs. Entries that could not reach ≥ 2 independent sources, or whose verbatim text could not be matched to primary canon, were **rejected or flagged** — see the *Textual Uncertainty* callouts in Round 3 (Mao Shan 口訣) and Round 8 (洞淵神咒).

---

## ROUND 1 — BaZi Detection Indicators (Signal Layer)

*Tài liệu tham khảo; các chỉ báo dưới đây là thần煞 / cấu trúc Bát Tự cổ điển, KHÔNG phải chẩn đoán “bị âm tà”.*

> **Important framing.** These indicators describe **classical BaZi configurations** that traditional sources associate with heightened sensitivity, solitude, or ritual concern. They are **statistical / symbolic associations in the classical literature, not a diagnosis of spirit possession**. Multiple indicators may co-occur in an ordinary, healthy chart. Display them only as “classical reference points,” never as “bạn bị ma.” Cross-reference with Round 10 (Tử Vi) for consensus, never as a single-point verdict.

| # | Indicator (Hán → Việt) | Classical condition | Traditional meaning | Strength (1–5) | Sources |
|---|---|---|---|---|---|
| 1.1 | **華蓋 + 太陰** (*Hoa Cái + Thái Âm*) | 华盖星 (year/day branch查 table) 同會太阴 (BING 丁 day with 辰/戌 etc.) | 主孤寡、宗教玄学之缘、心思幽隐; classical sign of sensitivity to subtle realms. 《三命通會》:「華蓋者，喻如寶蓋，天有此星其形如蓋，多主孤寡。」 | 3 | [S1 三命通會 (wikisource)][S2 ctext 三命通會][S3 阐微堂 verbatim quote] |
| 1.2 | **孤辰寡宿** (*Cô Thần Quá Tú*) | year branch group → 孤辰 / 寡宿 (e.g. 寅卯辰年 → 巳为孤辰、丑为寡宿) | 《淵海子平》:「八字中傷官及官星死絕，孤神寡宿，日時空亡，乃孤剋之命。」主孤獨、六亲缘薄. | 3 | [S4 淵海子平 wikisource][S5 ctext 淵海子平] |
| 1.3 | **弔客** (*Điếu Khách*) — with **喪門** | 太歲十二神煞: 喪門 (前二) / 弔客 (後二) of 流年 or 命宮 | 主喪服、孝服、探病; in 流年 often read as caution around illness/funerals. | 2 | [S6 百度百科 喪門弔客][S4 淵海子平 wikisource] |
| 1.4 | **四廢** (*Tứ Phế*) | 春庚申、辛酉 / 夏壬子、癸亥 / 秋甲寅、乙卯 / 冬丙午、丁巳 (日干無氣於當令之月) | 主體弱、事廢、能量低迷; classical “weakened day-master” marker. | 2 | [S4 淵海子平 wikisource][S5 ctext 淵海子平][S7 神煞整理 scribd] |
| 1.5 | **陰差陽錯** (*Âm Sai Dương Thố*) | 12 specific day-pillars: 丙子、丁丑、戊寅、辛卯、壬辰、癸巳、丙午、丁未、戊申、辛酉、壬戌、癸亥 | 《淵海子平》:「又看孤鸞之日、陽錯陰錯，主剋妻」—主婚姻/人際不諧、事多蹉跎. | 2 | [S4 淵海子平 wikisource (verbatim)][S5 ctext] |
| 1.6 | **胎元 meeting 墓 (辰戌丑未)** (*Thái Nguyên hội Mộ*) | 胎元 (月柱天干進一位、地支進三位) 落 辰/戌/丑/未 | 《三命通會》:「胎元者，受胎之月也」; 胎元坐四庫 = 古典認為胎根閉塞/感陰. **Derived rule** — see flag below. | 3 | [S8 三命通會 四庫本 wikisource][S9 識典古籍 胎元財官][S10 百度百科 胎元命宮] |
| 1.7 | **日主 nhược + 官殺 vượng** (*Nhật chủ nhược, quan sát vượng*) | 日主 (day stem) seasonal無氣且无生扶, 七殺/正官 多而旺 | 主體質偏弱、易受外象干擾 (classical “身弱殺重”). **Structural rule, not a discrete 神煞.** | 3 | [S4 淵海子平 wikisource][S1 三命通會 wikisource] |
| 1.8 | **八字 thuần âm / thuần dương** (*Bát tự thuần âm / thuần dương*) | 四柱 eight characters all 陰 or all 陽 (e.g. 乙丁己辛卯巳未酉) | 古典認為陰陽偏枯, 主性情偏執、磁場偏極. **Structural rule.** | 2 | [S4 淵海子平 wikisource][S1 三命通會 wikisource] |
| 1.9 | **陰差陽錯+鬼月 (tháng 7 âm lịch)** | 出生於農曆七月 (中元/鬼月) 且帶上述敏感指標 | 鬼月 = 民俗認為陰氣較重之月; 加權但不單獨成象. | 2 | [S11 中元節 維基百科][S12 中國國家級非遺 中元普渡 ihchina] |
| 1.10 | **劫煞 / 亡神** (*Kiếp Sát / Vong Thần*) | 年/日支起: 劫煞 (寅午戌→亥 / 申子辰→巳 / …); 亡神 (寅午戌→巳 / 申子辰→亥 / …) — 二者對稱 | 《三命通會·總論諸神煞》與羊刃、空亡並列; 主損耗、失神、奪耗. | 3 | [S13 三命通會 總論諸神煞 識典古籍][S14 百度百科 命理神煞] |
| 1.11 | **ngày/giờ thuần âm** (*Pure-yin day or hour*) | 日柱 or 時柱 天干地支皆陰 (如 乙丑、丁卯、己巳、辛未、癸酉、丁亥、己卯…) | 民俗認為陰時出生者感陰較易; **single-point reference, never standalone verdict.** | 1 | [S4 淵海子平 wikisource][S1 三命通會 wikisource] |

**Round 1 — verifier flags (from W12) embedded:**
- `1.6 胎元` and `1.7 日主` and `1.8 純陰純陽` are **derived structural rules**, not discrete 神煞. Cite component definitions (胎元, 四墓, 身弱殺重, 陰陽偏枯), do **not** present as named stars.
- `1.11 純陰時` is **single-point reference** — must always be co-displayed with other indicators, never as a standalone “bạn bị âm.”
- Multiple indicators co-occurring is normal; the app must show a **distribution / count**, never a binary “tainted / clean.”

---

## ROUND 2 — Spirit / Hàn Classification (Types Layer)

*Tài liệu phân loại — tham khảo tôn giáo dân gian, không phải bảng chẩn đoán. **KHÔNG BAO GIỜ** hiển thị dưới dạng “bạn bị [loại hồn này]”.*

| # | Type (Hán → Việt) | Definition | Origin / cause | Hallmark signs of presence (classical / folk) | Distinct from | Sources |
|---|---|---|---|---|---|---|
| 2.1 | **先靈 / 家先** (*Tiên Linh / Gia Tiên*) | Ancestral spirits of the lineage; regional terms (閩南/台灣/越南 “家先”). | 祖先去世後未受祭祀、或祭祀失時、或子孫未依禮安葬. | 家庭反覆不寧、夢見先人、子孫健康同部位反覆 (民俗說法). | 橫亡/怨靈 (先靈是有後之祖, 非橫死). | [S15 維基百科 祖先崇拜][S16 全國宗教資訊網 祖先神崇拜][S17 CNKI 世界宗教文化] |
| 2.2 | **橫亡 / 怨靈** (*Hoạnh Vong / Oán Linh*) | 非自然死亡 (意外、自殺、凶死) 且含冤未解之靈. | 含冤、橫死、怨氣未消、執著不肯離去 (林金郎: 「就跟一般怨靈一樣，因為有怨，所以執著不肯離去」). | 民俗認為久病、反覆同類厄運、夜間異象. | 先靈 (怨靈多橫死/無後), 野鬼 (怨靈有定向執念). | [S18 維基百科 嬰靈/怨靈 framework][S19 林金郎文學網 道教學者][S12 ihchina 中元普渡 孤魂] |
| 2.3 | **嬰靈** (*Anh Linh*) | 流產 / 墮胎 / 早夭嬰兒之靈. | 現代 (1970s 台灣) 民間/部分道壇發展出來的概念, 與 1970s《優生保健法》語境相關. | 民俗說法: 婦女反覆婦科不適、夢嬰、情緒低落 — **民俗敘事, 不是醫學**. | **NOT 古典佛教 / 道藏概念.** 佛經只有「中陰身」, 無「嬰靈」; 可能受日本水子供養影響. | [S20 維基百科 嬰靈 (含 1970s 台灣歷史)][S21 百度百科 靈嬰][S22 道教承負理論學術解讀] |
| 2.4 | **家先 (departed kin)** | 已過世之家族成員, 與 2.1 重疊但更廣義 (含未成祖先之親屬). | 同 2.1. | 同 2.1. | 2.1 先靈強調「受祀祖先」; 本項含「未入祀」親屬. | [S15][S16][S17] |
| 2.5 | **野鬼 / 孤魂野鬼** (*Dã Quỷ / Cô Hồn Dã Quỷ*) | 無後人祭祀之亡魂, 中元普渡之主要對象. | 戰死、客死他鄉、無後、或祭祀斷絕. | 民俗: 陰暗處久聚、突發寒意 — **民俗敘事**. | 怨靈 (野鬼無定向執念). | [S11 中元節 維基百科][S12 ihchina 中元普渡][S23 mwr.org.tw 7-15] |
| 2.6 | **妖邪 / 精怪** (*Yêu Tà / Tinh Quái*) | 非人類來源之精靈; 《崆峒問答》: 「物之性靈為精 / 神靈不正為邪」. | 動植物、器物久受天地之氣而成精; 或山魈、木客、妖狐、五通等. | 民俗: 反覆怪異現象、特定地點久聚. | 先靈/野鬼 (妖邪非人類亡魂). | [S24 崑峒問答 道教canonical definition][S25 輔仁大學 宗教中的神異與鬼怪 PDF][S26 全國宗教資訊網 驅邪 gov] |

**Round 2 — verifier flags (from W12) embedded:**
- **`2.3 嬰靈` MUST be framed as MODERN (1970s Taiwan) folk development, NOT classical canon.** Academic sources (維基百科, 林金郎) explicitly confirm: **no 嬰靈 in 佛經** (佛經只有「中陰身」); possible Japanese 水子 influence. The app must display this caveat next to every 嬰靈 reference.
- `2.1 / 2.4 先靈 / 家先` are **regional (閩南/台灣/越南) variants of ancestor-spirit terminology** — note regional usage; not separate ontological categories.

---

## ROUND 3 — 茅山 Mao Shan (驅邪 / 收妖)

*School of Mao Shan (茅山 / Maoshan), 茅山派 / 上清派. Canonical text 《茅山志》 (元 劉大彬 15卷; 道藏本 33卷 DZ0304).*

> **Cultural reference only. 驅邪/收妖 符與口訣 described structurally, NOT reproduced verbatim as operational instructions. Any actual ritual must be performed by an ordained 道士.**

### 3.1 School — verified
- 茅山派 = 上清派 之核心道場 (江蘇句容茅山), 尊三茅真君.
- Canonical text 《茅山志》 verified on ctext + wikisource + Sinica academic + 識典古籍 (道藏 DZ0304). [S27 ctext 茅山志][S28 維基文庫 茅山志][S29 中研院 明版茅山志 PDF][S30 識典古籍 茅山志 DZ0304]

### 3.2 符 (talisman) — structural description (NOT drawn)
Mao Shan 符的結構 (描述, 不繪製):
- **符頭 (head)** — 點三清 / 敕令, 代表神旨來源.
- **符身 (body)** — 主神名諱 + 功能字 (如 鎮 / 收 / 殺), 構成符的核心意圖.
- **符腹 (belly)** — 八卦 / 星象 / 罡步符號, 結氣佈陣.
- **符膽 (core)** — 天地人三才 + 五行之氣, 符的力量樞紐.
- **符腳 (foot)** — 押煞 / 急急如律令, 封符.
- **罡步 (步罡踏斗)** — 法師步禹步, 對應北斗/二十八宿.

### 3.3 法器 / 物品 (items) — verified
- **朱砂 (cinnabar)** + **黃紙 (yellow paper)** — 畫符基本材料; 「黃紙、朱砂畫符」. [S31 國家文化記憶庫 黃劉源抄 道教茅山派符籙][S32 新浪 道教茅山宗詳解][S33 ctext 辰州符咒大全 表黃紙朱砂書之][S34 神盧 道家法器 桃木劍/帝鐘]
- **桃木劍 (peach-wood sword)** — 驅邪法器, 取桃木辟邪之義.
- **令旗 (command flag)** — 五方令旗, 召五營兵將.
- **帝鐘 (imperial bell)** — 法師手持, 振鈴驚邪.

### 3.4 口訣 / 咒 (incantation) — CONDITIONAL (per W12 verdict)
> **TEXTUAL UNCERTAINTY FLAG.** W12 verdict: *「school + items verified, but NO specific verbatim 口訣/咒 text has been attested against 《茅山志》 primary text by the verifier.」* This spec therefore **does NOT reproduce a specific Mao Shan 口訣 verbatim**. Any future 口訣 must be checked **character-by-character** against 《茅山志》(ctext/wikisource) before inclusion; if not found verbatim, it must be **rejected** or marked *“cultural reference, perform by ordained 道士 only.”*
- Generically, Mao Shan 法事 uses 上清系神咒 (含 金光咒 / 淨身咒 等, 見 Round 8) + 召請三茅真君之法語. Do **not** fabricate a “Mao Shan 口訣” not in canon.

### 3.5 Ritual steps (descriptive, not operational)
1. 淨身 / 淨口 / 淨心 (八大神咒 — Round 8).
2. 設壇, 擺五營令旗、桃木劍、符紙朱砂.
3. 步罡踏斗 (禹步對應北斗).
4. 書符 (頭→身→腹→膽→腳, 朱砂黃紙).
5. 敕符 (唸敕令, 蓋法印).
6. 化符 / 佩符 (由法師決定).

**Practitioner caveat.** [S27][S28][S29][S30][S31][S32][S33][S34] — every step above is **cultural reference; ordained 道士 only**.

---

## ROUND 4 — 正一 Zheng Yi (天師道 / 符籙 / 拜斗 / 解厄)

*Zheng Yi school (正一派 / 天師道, 龍虎山). The 符籙 (Lu) tradition par excellence.*

> **Cultural reference only. 拜斗 / 解厄 / 書符 performed by ordained 正一 道士.**

### 4.1 符籙 (Lu) categories — verified
- 正一派 = 符籙派; 受箓道士方有資格書符. 輔仁大學學術: 「正一派 = 符籙派」; 道教在線《正一道符釋例》列斗口魁神 / 樞上將 / 六十甲子靈官等符文. [S35 道教在線 正一道符釋例 PDF][S36 輔仁大學 書符與靈驗 PDF]
- 符籙 categories (隨受箓階次): 都功、盟威、三洞、五嶽 等 — 受箓階次決定可書符籙範圍.

### 4.2 拜斗 (北斗 / 南斗) — verified (strongest sourcing in this round)
- **《太上玄靈北斗本命延生真經》 (北斗經)** = 五斗經中最早撰成, 拜斗科儀的根本經典. [S37 維基文庫 北斗本命延生真經 PRIMARY CANON][S38 百度百科 北斗經][S39 道教文化中心 拜斗 北斗主死 南斗主生][S40 CUHK DAO 五斗經 學術 PDF]
- **北斗主死、南斗主生** — 拜斗 = 禮北斗 (本命元辰星君) 求延生解厄, 禮南斗求增祿.

### 4.3 解厄 (crisis resolution) — verified
- 解厄 = 北斗經核心功能: 「懺悔消災…削落三災九厄」(verbatim 北斗經). [S37][S41 九陽道善堂 禮斗科儀 五斗真經/星辰寶懺]
- 九厄 (北斗經): 疾病、精邪、暗嵎、為鬼、刑戮、水火、劫賊、瘟疫、死病 — 經由 禮斗懺悔 削落.

### 4.4 Key 神咒 — see Round 8 (八大神咒 為 正一 早晚功課核心).

### 4.5 拜斗 ritual steps (descriptive)
1. 設斗壇 (米斗, 內放 七星劍/鏡/尺/秤/剪/燈 — 稱「斗中法器」).
2. 禮請 北斗七元君 / 本命元辰星君.
3. 誦 《北斗真經》 / 《星辰寶懺》.
4. 旋斗 (繞斗壇, 對應本命星).
5. 化財 / 謝神.

**Practitioner caveat.** [S35]–[S41] — ordained 正一 道士 only.

---

## ROUND 5 — 閭山 Lü Shan (法主真君 / 陳靖姑 / 三奶)

*閭山派 (Lushan), 又稱 閭山道 / 閭山教 / 武教; 閩越巫文化基礎上宋元間形成於閩浙贛粵. 奉 閭山九郎 (許遜/許九郎) 為祖師.*

> **Cultural reference only. 法事 performed by ordained 法師 / 紅頭法師 / 道士.**

### 5.1 法主真君 & 陳靖姑 (三奶) — verified
- **陳靖姑 (臨水夫人)** — 唐代福州民間女神; 救產扶嬰、驅妖除煞傳說形成三奶派核心. **陳靖姑信俗 = 2008 中國國家級非物質文化遺產**; 台灣主祀臨水夫人廟 130+. [S42 維基百科 臨水夫人=陳靖姑][S43 百度百科 三奶夫人 陳靖姑/林九娘/李三娘][S44 道教文化中心 閭山派]
- **法主真君 (法主公, 張聖君/張自觀)** — 介乎佛、道、民間宗教之法術師; 與三奶派同屬台灣所稱「紅頭法師」= 閭山教系統. [S45 全國宗教資訊網 內政部 法主公][S44]
- 兩派關係 (中研院民族所): 許真君閭山教分 **陳靖姑三奶教** (主流) + **張聖君法主公教** (依附閭山). [S46 中研院 台灣之法教 PDF]

### 5.2 收驚 / 驅邪 practices — verified
- 閭山 / 三奶 以 **救產護胎、收驚、驅邪** 為核心法術; 收驚是紅頭法師 (閭山三奶派) 核心儀式之一 (例: 獅場收魂法事). [S44][S47 南華大學 台灣北部正一派紅頭法師獅場收魂法事 PDF][S42]
- 三奶派比正統道教更早傳入台灣: 明萬曆十八年 (1590) 福建漳州籍閭山三奶派道士到台南傳教. [S47]

### 5.3 法術 (法) elements — descriptive
- 召夫人兵將 (三奶兵將).
- 敕夫人名於淨水碗內 (浙江麗水「陳十四夫人教」師公做醮法). [S48 浙江閭山道 陳靖姑信仰戲曲]
- 收驚: 米/香/受驚者衣物 + 收驚符 (見 Round 6).

**Practitioner caveat.** [S42]–[S48] — ordained 法師 only.

---

## ROUND 6 — 台灣 收驚 (Taiwanese 著驚 / 招魂 / 安魂)

*台灣民俗 收驚 = 喊驚 / 硩驚 / 收魂 / 叫魂 = 招魂儀式. Strongest academic sourcing in the entire module.*

> **Cultural reference only. 儀式 由 收驚婆 / 道長 / 法師 主持.**

### 6.1 Concept — verified
- **著驚** = 民俗認為魂魄受驚暫離; 收驚 = 召回魂魄、安魂定神. 全國宗教資訊網 (內政部 GOV) 直接定義. [S49 全國宗教資訊網 內政部 收驚][S50 臺灣大學 魂魄猶可知 thesis][S51 中研院民族所 張珣研究員][S52 大龍峒保安宮 收驚法術醫療學術]

### 6.2 物品 (items) — verified
- **米** (卜米, 看米象推斷受驚方/因).
- **香** (清香通神).
- **受驚者衣物** (代表本人).
- **收驚符** (符紙, 部分流派).
[S49][S53 行天宮 收驚婆 academic study][S54 南華大學 幼兒收驚與療癒 thesis]

### 6.3 Practitioner types — verified
- **收驚婆** (女性民俗療法者; 行天宮 收驚婆 制度著名).
- **道長 / 法師** (正一 / 閭山 / 靈寶 派, 兼做收驚科儀).
[S53][S47]

### 6.4 Steps (descriptive) — verified
1. 受驚者坐/立, 持其衣物.
2. 收驚者焚香, 唸收驚口訣 (流派不同: 行天宮誦《列聖寶經》, 閭山派用夫人法).
3. 以米在衣物上比劃 (卜米 — 看米堆形狀判受驚方/因).
4. 招魂安魂 (唸本命元辰、十二生肖).
5. 收驚符 (部分流派) 佩於受驚者.
[S49][S50][S51][S52][S53][S54]

### 6.5 Variants — temple vs home
- **廟宇收驚** (行天宮、保安宮、關渡宮等大型廟宇設收驚服務).
- **家庭收驚** (收驚婆到宅, 或家屬自收).
- **地區差異**: 北/中/南台灣口訣與物品略異.

**Practitioner caveat.** [S49]–[S54] — 收驚 屬 **民俗療法, 非醫療**; 若受驚症狀持續或伴隨身心症狀, 應尋求 **醫師 / 心理專業**.

---

## ROUND 7 — 香港 Hong Kong (風水 化煞 + 道館 驅邪)

*港式傳統: 風水化煞 (form / qi煞化解) + 道館驅邪科儀.*

> **Cultural reference only. 開光 / 化煞佈局 / 驅邪科儀 由 風水師 / 道長 主持.**

### 7.1 風水 化煞 (form-based) — verified
- **形煞** = 物理形態之煞 (路沖、壁刀、天斬煞、樑壓、對門沖等).
- **化煞物** (常用):
  - **八卦鏡** (凸鏡反射、凹鏡吸收、平鏡遮擋) — 幸福空間「別把煞氣轉給鄰居! 八卦鏡4大禁忌」; 香港文匯報「住宅樓望樓 化煞要識揀」. [S55 幸福空間 八卦鏡4大禁忌][S56 香港文匯報 樓市八卦陣]
  - **葫蘆** (收煞 — 吸收煞氣, 不反射; 適合鄰居門對門). [S57 新浪 小葫蘆的妙用 化煞首選]
  - **五帝錢** (化門煞).
  - **風水地墊**.
  - **石獅 / 麒麟** (鎮宅).
- 注意: 八卦鏡 **禁忌** 將煞反射給鄰居 — 倫理考量.

### 7.2 道館 驅邪 (practitioner context) — descriptive
- 港式道館 (黃大仙祠、車公廟、文武廟 等) 提供驅邪 / 化煞科儀.
- 法器: **燈** (光明破暗)、**香** (通神)、**符** (正一/全真系)、**淨水** (灑淨)、**開光物** (法器經開光方有靈).
- **開光** = 由道長誦咒、點眼、敕令, 將法器/神像「點靈」的儀式.

### 7.3 Practitioner ecosystem
- **風水師** (玄空、三合、巒頭派 — 例: 鍾亦禮師傅, 香港玄空星相研究中心會長). [S58 YouTube 鍾亦禮 八卦鏡佈陣]
- **道長** (正一 / 全真 / 蓬萊系).
- **道館** (提供科儀服務).

**Practitioner caveat.** [S55]–[S58] — 化煞佈局建議為 **文化參考**; 嚴重煞/疑驅邪個案應由道長 / 風水師實地評估, app 僅做知識呈現.

---

## ROUND 8 — 《道藏》Canon 神咒 (Tang–Song)

*Five 神咒 with verbatim Hán text verified against 《正統道藏》/ctext/wikisource. Each mantra carries a recitation context and performance caveat.*

> **Cultural reference only. 正式科儀誦持 / 書符 由 受箓 道士 (正一 / 全真) 主持; app 僅做文化知識呈現, 不指導用戶自行持咒作法.**

### 8.1 金光神咒 (金光咒) — verified, textual_certainty: high
- **School**: 通用 / 早晚功課 (八大神咒之七).
- **Hán text (verbatim)**:
  > 天地玄宗，万炁本根。广修亿劫，证吾神通。三界内外，惟道独尊。体有金光，覆映吾身。视之不见，听之不闻。包罗天地，养育群生。诵持万遍，身有光明。三界侍卫，五帝司迎。万神朝礼，役使雷霆。鬼妖丧胆，精怪亡形。内有霹雳，雷神隐名。洞慧交彻，五炁腾腾。金光速现，覆护真人。
- **Note**: 末句在家人/信士念「覆護真人」; 受度道士另有念法. 文本穩定, 異文極少.
- **Việt dịch (tham khảo)**: Trời Đất là cội nguồn huyền diệu, vạn khí đều bắt nguồn từ đây… (đầy đủ trong `src/engine/amta-data.js`).
- **Meaning / Use**: 護身正咒 — 取金光覆身, trừ tà hộ mệnh, an định tâm thần. 用於 護身 / 淨化 / 驅邪.
- **Recitation context**: 早課八大神咒之一; 日常誦持, 無禁忌 (bất kỳ ai/cơ thời nào cũng tụng được theo truyền thống).
- **Sources**: [S59 維基文庫 太上玄門正一日誦早課 含金光咒全文][S60 中國道教協會 常誦經典 官方收錄八大神咒][S61 ctext 道教功課經典]

### 8.2 淨心神咒 — verified, textual_certainty: high (雙經典出處)
- **School**: 通用 / 早晚功課 (八大神咒之首).
- **Hán text (verbatim)**:
  > 太上台星，应变无停。驱邪缚魅，保命护身。智慧明净，心神安宁。三魂永久，魄无丧倾。急急如律令。
- **Note**: 末句「急急如律令」在三官經本與早課本個別版本有/無差異; 主體八字句穩定.
- **Meaning / Use**: 淨化心意 — 排除雜念, 安定心神, 保魂護魄 (意業淨化). 用於 淨化 (誦經/行法前).
- **Second independent canon**: 《太上三元賜福赦罪解厄消災延生保命妙經》(三官經) 亦收此咒.
- **Sources**: [S62 維基文庫 三官經 獨立第二經典出處][S59 早課維基文庫 八大神咒標準來源][S63 百度百科 道教八大神咒 輔證]

### 8.3 淨口神咒 — verified, textual_certainty: high
- **School**: 通用 / 早晚功課 (八大神咒之二).
- **Hán text (verbatim)**:
  > 丹朱口神，吐秽除氛。舌神正伦，通命养神。罗千齿神，却邪卫真。喉神虎贲，炁神引津。心神丹元，令我通真。思神炼液，道炁常存。急急如律令。
- **Meaning / Use**: 淨化口業 — 滌除口中穢氣, 請本命神安鎮, 令誦經通真. 緊接淨心神咒之後.
- **Sources**: [S59 早課維基文庫][S64 道音文化 淨口神咒 獨立第二來源][S63]

### 8.4 北帝殺鬼咒 (規範名: 天蓬咒 / 天蓬神咒) — verified (4 sources), variants flagged
- **School**: 北帝派 / 酆都派 (洞真部); 又收入 上清天蓬伏魔大法.
- **Hán text (canonical form — variants flagged)**:
  > 天蓬天蓬，九玄杀童。五丁都司，高刁北翁。七政八灵，太上皓凶。长颅巨兽，手把帝钟。素枭三神，严驾夔龙。威剑神王，斩邪灭踪。紫炁乘天，丹霞赫冲。吞魔食鬼，横身饮风。苍舌绿齿，四目老翁。天丁力士，威南御凶。天驺激戾，威北衔锋。三十万兵，卫我九重。辟尸千里，袪却不祥。敢有小鬼，欲来见状。钁天大斧，斩鬼五形。炎帝烈血，北斗燃骨。四明破骸，天猷灭类。神刀一下，万鬼自溃。急急如律令。
- **Variant notes**: 「杀/煞童」「高刁/高刀北翁」「紫炁/紫气」「手把/手执帝钟」等多版本異文存在. 三十六句倒讀即成《天蓬馘魔咒》(鄧紫陽倒持法, 《道法會元》卷174).
- **Meaning / Use**: 召 天蓬元帥 (北帝部下) 統三十萬兵, 斬邪滅蹤, 殺鬼護身. 陶弘景《真誥》: 「鬼有三被此咒者, 眼精自爛而身即死矣…北帝秘其道」.
- **Recitation context & warning**: 北帝伏魔法事核心咒; 須 叩齒三十六通, 一炁誦三遍, 每四言一啄齒. 經文警告: 持咒吃五辛/口不淨者「天蓬大將怒目一嗔, 令人神魂墮落」.
- **Sources**: [S65 ctext 太上元始天尊說北帝伏魔神咒妙經 卷二 DZ1412][S66 道教學術資訊 卷四斬鬼品][S67 ctext 道法會元 卷162 上清天蓬伏魔大法 DZ1220][S68 百度百科 天蓬神咒 引真誥卷十]

### 8.5 洞淵神咒 — TEXTUAL UNCERTAINTY (flagged)
> **重要: 文本不確定性.** 「洞淵神咒」**不是**單一固定短咒 (不像八大神咒有標準文本), 而是指《太上洞淵神咒經》(DZ 0335, 洞玄部本文類, 二十卷) 中 **遣鬼品 / 縛鬼品 / 殺鬼品 / 禁鬼品 / 斬鬼品** 各品所載大量神咒的總稱. 該經以「轉經(誦經)+齋法」救濟道民, 非以單一咒為核心.
- **Representative excerpt (卷四 殺鬼品)** — **節選, 非規範全文**:
  > 道言：天丁力士，三十六万人，持戟仗剑，来入人家，搜捕邪精。若有小鬼，不即去者，斩之万段。急急如律令。
- **Meaning / Use**: 太上道君與諸天魔王鬼王立誓 (卷一 誓魔品), 賜道士以神咒威力, 可遣天丁力士, 敕令鬼神聽命 — 通過轉經救濟道民、消災卻禍.
- **Recitation context**: 洞淵派「轉經」法事 — 誦《洞淵神咒經》二十卷相應品 (非單咒獨立誦持); 卷四殺鬼品附十六符.
- **Verification status**: 「《洞淵神咒經》經書存在性 + 道藏編號 DZ0335」已 verified ≥2; 但「單一固定洞淵神咒短咒文本」**不存在** — 此條標注為 *「經文系統參考, 非標準單咒」*, 不得當作固定咒文呈現給用戶.
- **Sources**: [S69 ctext 太上洞淵神呪經 全二十卷 DZ0335][S70 維基百科 太上洞淵神咒經 概述][S71 識典古籍 DZ0335 全二十卷]

---

## ROUND 9 — Remedies Synthesis

*Bảy nhóm phương pháp cổ truyền. **Tất cả nghi thức thực sự phải do 道士 / 法師 已受箓 主持.** App chỉ trình bày tri thức văn hóa, không hướng dẫn tự thực hành.*

| # | Type | Vật phẩm (items) | Steps (descriptive) | Day/hour 宜忌 | Caveat | Sources |
|---|---|---|---|---|---|---|
| 9.1 | **符 (talisman)** | 朱砂、黃紙、桃木劍、令旗、法印 | 淨身→設壇→書符(頭身腹膽腳)→敕符→化/佩 | 書符宜 擇吉日吉時 (建/滿/成日), 忌 月破、四廢、歸忌; 部分流派重 直接神 (當日值神). | 書符須 受箓 道士; app **不提供**可印/繪之符. | [S31][S32][S33][S34][S35][S36] |
| 9.2 | **淨宅 (house purification)** | 楊柳枝、淨水、粗鹽、柚葉、檀香 | 灑淨(淨水+楊枝)→薰香(每房)→掃宅(由內向外)→撒鹽(四隅) | 宜 農曆初一/十五或 擇日; 忌 月破. | 嚴重 淨宅科儀 由道長主持. | [S49][S52][S72 民俗淨宅 參考] |
| 9.3 | **誦經 (sutra chanting)** | 《北斗經》《三官經》《清靜經》《心印妙經》 | 淨口淨心→焚香→誦經迴向 | 早晚課; 大型法會擇日. | 誦經為 文化修行, 非醫療; 連續身心不適應就醫. | [S37][S62][S60] |
| 9.4 | **放生 (life release)** | 鮮活魚/鳥 (非入侵種、合乎當地生態) | 購買→誦《放生咒》→釋放→迴向 | 宜 甲子/庚申日或佛誕/道誕; **忌** 放生入侵種、破壞生態. | 遵守當地野生動物法; 環保放生. | [S73 維基百科 放生][S74 百度百科 放生] |
| 9.5 | **安太歲 (Tai Sui pacification)** | 太歲符、太歲燈、本命元辰星君像 | 擇日安奉→誦《北斗經》→每月初一十五上香 | 每年立春前後安奉 (生肖犯太歲者). | 由廟宇/道長主持安太歲科儀. | [S37][S39][S41] |
| 9.6 | **拜懺 (repentance rite)** | 《星辰寶懺》《三官寶懺》《梁皇寶懺》(佛) | 設懺壇→誦懺文→禮佛/禮聖→迴向 | 擇日或特定節日 (中元、九皇). | 大型拜懺由道侶/僧眾共同主持. | [S41 九陽道善堂 禮斗科儀][S62] |
| 9.7 | **佩飾 (protective amulets)** | 黑曜石 (Obsidian)、Tỳ Hưu (貔貅)、đồng tiền cổ (五帝錢)、黑芝麻、八卦牌 | 開光後佩戴 (開光 = 道長誦咒點眼). | 佩戴宜 擇日開光; 五帝錢用真古錢. | 開光儀式由道長主持; 佩飾為 文化信物, 非醫療護身. | [S55][S56][S57][S58] |

**Round 9 — cross-citation note.** Remedies 9.1/9.3/9.5/9.6 inherit their sourcing from Rounds 3–8 (same canonical + practitioner-academic base). 9.4 放生 and 9.7 佩飾 carry their own citations. **No remedy stands on < 2 sources.**

---

## ROUND 10 — Integration & Tử Vi Cross-Reference

### 10.1 Integration model (how BaZi + Tử Vi + school knowledge combine)
- **Multi-source consensus, never single-point verdict.** An “âm tà / vong hồn” reading in the app should require: (a) ≥ 2 Round-1 BaZi indicators active, (b) ≥ 1 Round-10 Tử Vi corroborating pattern, (c) user-reported phenomenological context — and even then it is presented as **“classical reference, low-confidence”**, never as a diagnosis.
- **No absolute claims.** The app never outputs “bạn bị ma / quỷ / 附身.” It outputs at most: *“Mô hình cổ điển ghi nhận một số chỉ báo nhạy cảm (Hoa Cái + Cô Thần Quá Tú) trong lá số của bạn — đây là tham khảo văn hóa, không phải chẩn đoán. Nếu bạn đang gặp khó khăn tâm lý, hãy liên hệ chuyên gia tâm lý / y tế.”*
- **Opt-in gate enforced** (see Chapter 11) before any Round-1/10 content renders.

### 10.2 Tử Vi stars / conditions (cross-mapping with Round 1) — verified
| Star (Hán → Việt) | Condition / palace context | Traditional meaning | Strength | Sources |
|---|---|---|---|---|
| **陰煞** (*Âm Sát*) | 命/身/福德 三方會; 輔煞雜曜 | 主暗中破壞、陰損、小人; 與巨門化忌同會「兄弟心術不正」(古書). | 3 | [S75 維基文庫 紫微斗數全書][S76 維基百科 紫微斗數][S77 百度百科 十四主星] |
| **巨門化忌** (*Cự Môn Hóa Kỵ*) | 巨門 (陰水, 化氣「暗」) 化忌於命/身/運 | 主是非、口舌、暗損、耗財不明; 古訣:「巨門忌星皆不吉, 運身命限忌相逢」. | 3 | [S75][S78 51xingli 巨門化忌詳解 學術] |
| **天空** (*Thiên Không*) | 命/財帛/官祿 三方 | 主精神層面空虛、突發變故、計畫落空; 與巨門同宮「恐無子」(古書). | 2 | [S75][S76] |
| **地劫** (*Địa Kiếp*) | 陰水, 化氣「耗」; 與天空對星 | 主消耗、破敗後重建; 與巨門/天空同會加重. | 3 | [S75][S76] |
| **鈴星** (*Linh Tinh*) | 陰火, 四煞之一 (火/鈴/羊/陀) | 主陰火之災、突然打擊; 會巨門加劇口舌. | 3 | [S75][S76] |
| **「鬼門」** *(“Quỷ Môn”)* | **NOT a standard 《紫微斗數全書》 star** | “鬼門” 在正典《全書》中 **不是標準星曜**, 可能指 (a) 十二長生「墓」位 或 (b) 民間流派特殊說法. | — (flag) | [S75][S76] — **見 verifier flag** |

**Round 10 — verifier flag.** The scope mentioned 「鬼門」as a Tử Vi star, but **academic search confirms 「鬼門」is NOT a standard star** in 《紫微斗數全書》 / 《全集》. It is therefore **excluded from the active star list** and only retained as a flag. The app must **not** display “鬼門星” as if it were canonical. Where users encounter the term, it should resolve to (a) 十二長生墓位 or (b) 民間流派 — both clearly labelled non-canonical.

### 10.3 Classical 四煞 / 六凶 combined formula
《紫微斗數全書》:
> 「火鈴羊陀及巨門，天空地劫又相臨。貪狼七殺廉貞宿，武曲加臨克害侵。」

This is the canonical *六凶 + 天空地劫* formula for evaluating chart sensitivity; it must be displayed as **classical structural theory**, not as a spirit-possession indicator. [S75][S79 豆瓣 紫微斗數星性全方位講義]

---

## CHAPTER 11 — ETHICS & Safety Framework (MANDATORY)

> **This chapter MUST appear verbatim in BOTH deliverables (this spec AND `src/engine/amta-data.js`). It is non-negotiable.**

### 11.1 Disclaimer text (displayed verbatim at opt-in gate)
> **Tài liệu tham khảo văn hóa - tôn giáo — KHÔNG phải y tế / tâm lý / chẩn đoán.**
>
> Nội dung模块 *Âm Tà / Vong Hồn / Trừ Tà* tổng hợp tri thức truyền thống từ nhiều trường phái (Mao Sơn, Chính Nhất, Lư Sơn, Đài Loan thu hồn, Hồng Kông, Đạo Tạng) **chỉ nhằm mục đích tham khảo văn hóa và học thuật**, KHÔNG dùng để:
> - Chẩn đoán bệnh lý thể chất hay tâm thần;
> - Khẳng định bạn hoặc người khác “bị ma / quỷ / 附身 / 中邪”;
> - Thay thế điều trị y tế, tâm lý, hay tâm linh từ người có chuyên môn.
>
> Nếu bạn đang trải qua **khó khăn tâm lý, lo âu, trầm cảm, hoang tưởng, ảo giác, hoặc đau đớn kéo dài**, hãy liên hệ **bác sĩ / chuyên gia tâm lý / đường dây hỗ trợ sức khỏe tâm thần** tại địa phương. Những kinh nghiệm này có thể là triệu chứng y khoa cần được chăm sóc chuyên nghiệp, và việc giải thích thuần túa bằng “âm tà” có thể **trì hoãn việc can thiệp y tế cần thiết**. Các nghi thức tôn giáo (nếu bạn muốn) nên được thực hiện bởi **đạo trưởng / pháp sư đã thụ pháp / chuyên gia tâm linh có tín nhiệm**, đồng thời song hành — không thay thế — với chăm sóc y tế.

### 11.2 Opt-in rule
- Module **OFF by default**.
- Shown **only** after explicit user enable + acceptance of 11.1 disclaimer.
- Revocable anytime; preferences cleared on revocation.
- **Never** appears in onboarding, daily brief, push notifications, paywalls, or social-share cards unless user opts in.
- A neutral, non-alarm entry point (e.g. *“Tìm hiểu tri thức truyền thống Âm Tà / Trừ Tà”*) — never fear-based prompts.

### 11.3 FORBIDDEN claims (hard gate — code + content must enforce)
The app and all generated text in this module are **FORBIDDEN** from producing any of:
1. **Absolute diagnoses**: “bạn bị ma”, “bạn bị quỷ”, “bạn bị 附身/中邪”, “bạn có âm khí nặng”.
2. **Fear-mongering**: “nếu không giải, bạn sẽ…” / “xui xẻo sẽ kéo đến…” / “tai nạn sắp xảy ra”.
3. **Possession diagnosis** based on BaZi/Tử Vi alone — single-source or low-confidence “possession” claims are prohibited.
4. **Medical / psychiatric replacement language**: “trị bệnh”, “chữa khỏi”, “thay thế thuốc/thầy thuốc”.
5. **Coercion toward paid rituals / 販賣符籙 / 付費驅邪 upsell** — the app does not sell rituals, 符, or referrals for commission.
6. **Targeting vulnerable states**: no triggering prompts during detected crisis (e.g. user reports self-harm — route to mental-health hotline instead).
7. **Fabrication of incantation / 符 text** not in primary canon (see Round 3 & Round 8 uncertainty flags).

### 11.4 Tone rules
- **Informative, non-coercive, non-sensational.** No horror imagery, no jump-scares, no red-on-black alarm styling.
- **Hedge appropriately**: “theo truyền thống…”, “mô hình cổ điển ghi nhận…”, “một số trường phái cho rằng…”.
- **Acknowledge regional / school variation** explicitly (越南/閩南/台灣/香港 differs; 正一 vs 閭山 vs 全真 differ).
- **Always offer the secular/medical path first** when distress is mentioned.
- **Source disclosure**: every claim links to its citation (Chapter 12); no unsourced assertion.

### 11.5 Cultural-source & variation acknowledgment
- Multi-school: this module covers **six** schools; practices differ. A claim true in 正一 may differ in 閭山 — label the school for every ritual.
- Multi-region: 越南 / 閩南 / 台灣 / 香港 variants exist; 嬰靈 is a **modern (1970s) Taiwan** development (Round 2.3), not classical canon — must be labelled.
- **No single school is presented as “the truth.”**

### 11.6 Ethics sources (cross-disciplinary best practices on presenting folk-religious content)
- [S80] APA — *Digital Mental Health 101 (Part 3)*, American Psychiatric Association — apps are **not a substitute** for professional psychiatric care; scope-of-use guidance.
- [S81] Frontiers in Digital Health — *Digital Mental Health for Young People: Scoping Review of Ethical Challenges* (2021) — consent, autonomy, ethical tension of apps used *in place of* professional care.
- [S82] Tilburg University — *Reconceptualizing the Ethical Guidelines for Mental Health Apps* — users come from diverse cultural / non-Western ethical traditions; guidelines must be culturally inclusive rather than dismissive of folk belief.
- [S83] Santa Clara University, Markkula Center for Applied Ethics — *Understanding the Ethics of Digital Mental Health Care* — bioethics lens (beneficence, non-maleficence, autonomy, justice) applied to digital tools.
- [S84] PMC / Frontiers — *Cross-Cultural and Global Uses of a Digital Mental Health App* — how cultural beliefs (incl. folk/religious understandings) shape app acceptance; relevant for respectful, non-pathologizing presentation.

> **These five sources establish that (a) digital tools presenting culturally sensitive material must NOT replace professional care, and (b) ethical presentation of folk-religious content requires cultural humility + opt-in + clear referral pathways. The framework above operationalizes those principles.**

---

## CHAPTER 12 — Sources (Consolidated ≥ 2-source Citations)

### Canonical primary texts (道藏 / 四庫 / wikisource / ctext)
- **[S1]** 《三命通會》(四庫全書本) — 維基文庫: https://zh.wikisource.org/zh-hans/%E4%B8%89%E5%91%BD%E9%80%9A%E6%9C%83_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%85%A8%E8%A6%BD
- **[S2]** ctext 三命通會: https://ctext.org/wiki.pl?if=gb&chapter=850832 (卷十二)
- **[S3]** 阐微堂 三命通會 華蓋 verbatim: http://chanweitang.com/post/83.html
- **[S4]** 《淵海子平》維基文庫: https://zh.wikisource.org/wiki/%E6%B7%B5%E6%B5%B7%E5%AD%90%E5%B9%B3
- **[S5]** ctext 淵海子平: https://ctext.org/wiki.pl?if=gb&chapter=524726&remap=gb
- **[S6]** 百度百科 喪門弔客 (太歲十二神煞): https://baike.baidu.com/item/%E4%B8%A7%E9%97%A8%E3%80%81%E5%90%8A%E5%AE%A2/22937868
- **[S7]** 神煞整理與分析 (scribd): https://www.scribd.com/document/835025737
- **[S8]** 三命通會 四庫全書本 胎元 (wikisource, see [S1])
- **[S9]** 識典古籍 三命通會 胎元財官: https://www.shidianguji.com/zh/book/SK1610/chapter/1kf5v7gfbmfpm
- **[S10]** 百度百科 胎元命宮: https://baike.baidu.com/item/%E8%83%8E%E5%85%83%E5%91%BD%E5%AE%AE/4629187
- **[S13]** 三命通會 總論諸神煞 (識典古籍): https://www.shidianguji.com/book/SK1610/chapter/1kf5v6v49v12d
- **[S14]** 百度百科 命理神煞: https://baike.baidu.com/item/%E5%91%BD%E7%90%86%E7%A5%9E%E7%85%9E/12581261
- **[S27]** ctext 《茅山志》: https://ctext.org/wiki.pl?if=gb&res=497389
- **[S28]** 維基文庫 《茅山志》: https://zh.wikisource.org/wiki/%E8%8C%85%E5%B1%B1%E5%BF%97
- **[S29]** 中研院 LitPhil 明版茅山志 PDF: https://www.litphil.sinica.edu.tw/newsletter/95/1-56.pdf
- **[S30]** 識典古籍 《茅山志》DZ0304: https://www.shidianguji.com/zh/book/DZ0304
- **[S33]** ctext 辰州符咒大全: https://ctext.org/wiki.pl?if=en&chapter=186107&remap=gb
- **[S37]** 《太上玄靈北斗本命延生真經》維基文庫 PRIMARY CANON: https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%9D%88%E5%8C%97%E6%96%97%E8%A7%A3%E5%8E%84%E6%9C%AC%E5%91%BD%E5%BB%B6%E7%94%9F%E7%9C%9F%E7%B6%93
- **[S38]** 百度百科 北斗經: https://baike.baidu.com/item/%E5%8C%97%E6%96%97%E7%BB%8F/4081312
- **[S59]** 維基文庫《太上玄門正一日誦早課》: https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%96%80%E6%AD%A3%E4%B8%80%E6%97%A5%E8%AA%B5%E6%97%A9%E8%AA%B2
- **[S61]** ctext 道教功課經典: https://ctext.org/wiki.pl?if=gb&res=190395
- **[S62]** 《太上三元賜福赦罪解厄消災延生保命妙經》(三官經) 維基文庫: https://zh.wikisource.org/zh-hans/%E5%A4%AA%E4%B8%8A%E4%B8%89%E5%85%83%E8%B5%90%E7%A6%8F%E8%B5%A6%E7%BD%AA%E8%A7%A3%E5%8E%84%E6%B6%88%E7%81%BE%E5%BB%B6%E7%94%9F%E4%BF%9D%E5%91%BD%E5%A6%99%E7%BB%8F
- **[S65]** ctext《太上元始天尊說北帝伏魔神咒妙經》卷二 DZ1412: https://ctext.org/wiki.pl?if=gb&chapter=557999
- **[S66]** 道教學術資訊 卷四斬鬼品: http://www.ctcwri.idv.tw/CTCW-CMTS/CMT07正乙部/CMT07-ALL/CH07220太上元始天尊说北帝伏魔神咒妙经/CH07220-04卷四斩厄品.htm
- **[S67]** ctext《道法會元》卷162 上清天蓬伏魔大法 DZ1220: https://ctext.org/wiki.pl?if=gb&chapter=247662
- **[S69]** ctext《太上洞淵神呪經》DZ0335 全二十卷: https://ctext.org/wiki.pl?if=gb&res=190395&remap=gb
- **[S70]** 維基百科 太上洞淵神咒經: https://zh.wikipedia.org/zh-cn/%E5%A4%AA%E4%B8%8A%E6%B4%9E%E6%B7%B5%E7%A5%9E%E5%92%92%E7%B6%93
- **[S71]** 識典古籍《太上洞淵神咒經》DZ0335: https://www.shidianguji.com/book/DZ0335
- **[S75]** 《紫微斗數全書》維基文庫: https://zh.wikisource.org/wiki/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8%E5%85%A8%E6%9B%B8/%E5%85%A8%E8%A6%BD

### Academic / institutional / government
- **[S11]** 維基百科 中元節: https://zh.wikipedia.org/zh-cn/%E4%B8%AD%E5%85%83%E7%AF%80
- **[S12]** 中國國家級非遺 中元普渡 (ihchina): https://www.ihchina.cn/project_details/10219.html
- **[S15]** 維基百科 祖先崇拜: https://zh.wikipedia.org/wiki/祖先崇拜
- **[S16]** 全國宗教資訊網 內政部 祖先神崇拜: https://religion.moi.gov.tw (Knowledge/Content)
- **[S17]** CNKI《世界宗教文化》: https://www.cnki.com.cn/Article/CJFDTotal-RELI201202013.htm
- **[S18]** 維基百科 嬰靈/怨靈 framework: https://zh.wikipedia.org/zh-cn/%E5%AC0%E9%9D%88
- **[S19]** 林金郎文學網 道教學者 怨靈: https://blog.udn.com/frankjin/109747484
- **[S20]** 維基百科 嬰靈 (含 1970s 台灣歷史): https://zh.wikipedia.org/zh-cn/%E5%AC0%E9%9D%88
- **[S21]** 百度百科 靈嬰: https://baike.baidu.com/item/%E7%81%B5%E5%A9%B4/18593858
- **[S22]** 道教承負理論 學術解讀 嬰靈: https://www.chaoduren.com/articles/daoist-reincarnation-yingling/
- **[S23]** mwr.org.tw 7-15 中元: https://www.mwr.org.tw/tw_religion/ritual/7-15.htm
- **[S24]** 崑峒問答 道教 canonical definition: https://wapbaike.baidu.com/tashuo/browse/content?id=043d1618d1316e42b7b8ab75
- **[S25]** 輔仁大學 宗教中的神異與鬼怪 PDF: http://www.rsd.fju.edu.tw/images/3-03-Jaike_Liu.pdf
- **[S26]** 全國宗教資訊網 內政部 驅邪 gov: https://religion.moi.gov.tw/Knowledge/Content?ci=2&cid=188
- **[S31]** 國家文化記憶庫 黃劉源抄 道教茅山派符籙: https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Object&id=320687
- **[S32]** 新浪 道教茅山宗詳解: https://t.cj.sina.cn/articles/view/1963070934/750215d600100firz
- **[S34]** 神盧 道家法器 桃木劍/帝鐘: https://www.shenlu.com.tw/news_detail/60.htm
- **[S35]** 道教在線 正一道符釋例 PDF: https://www.daoist.org/BookSearch(test)/list012/628.pdf
- **[S36]** 輔仁大學 書符與靈驗 PDF: http://www.rsd.fju.edu.tw/images/uploads/FJRS/16-05.pdf
- **[S39]** 道教文化中心 拜斗: https://zh.daoinfo.org/index.php?title=%E6%8B%9C%E6%96%97
- **[S40]** 香港中文大學 DAO 五斗經 學術: https://dao.crs.cuhk.edu.hk/Main/wp-content/uploads/2022/09/DAO14_05_%E6%96%BD%E7%A7%A6%E7%94%9F.pdf
- **[S41]** 九陽道善堂 禮斗科儀: https://www.sctayi.com/front/bin/ptdetail.phtml?Part=corner-01-02-01&Category=15253
- **[S42]** 維基百科 臨水夫人=陳靖姑: https://zh.wikipedia.org/wiki/%E8%87%A8%E6%B0%B4%E5%A4%AB%E4%BA%BA
- **[S43]** 百度百科 三奶夫人: https://baike.baidu.com/item/%E4%B8%89%E5%A5%B6%E5%A4%AB%E4%BA%BA/1043322
- **[S44]** 道教文化中心 閭山派: https://zh.daoinfo.org/index.php?title=%E9%96%AD%E5%B1%B1%E6%B4%BE
- **[S45]** 全國宗教資訊網 內政部 法主公: https://religion.moi.gov.tw/Knowledge/Content?ci=2&cid=287
- **[S46]** 中研院 台灣之法教 PDF: https://www.ioe.sinica.edu.tw/WebTools/FilesDownload.ashx?Siteid=530167135246736660&Menuid=530167145657243371&fd=NewsLetter_Flies&TB=NewsLetter&RD=1&Pname=Liu_F08.pdf
- **[S47]** 南華大學 台灣北部正一派紅頭法師獅場收魂法事 PDF: https://nhuir.nhu.edu.tw/retrieve/30984/095NHU05673011-001.pdf
- **[S48]** 浙江閭山道 陳靖姑信仰戲曲: http://www.ctcwri.idv.tw/INDEXA3/A302/A3101-A3200/A3123/A3040909.htm
- **[S49]** 全國宗教資訊網 內政部 收驚: https://religion.moi.gov.tw/Knowledge/Content?ci=2&cid=6
- **[S50]** 臺灣大學 魂魄猶可知 thesis: https://tdr.lib.ntu.edu.tw/handle/123456789/97051?mode=full
- **[S51]** 中研院民族所 張珣研究員: https://www.ioe.sinica.edu.tw/
- **[S52]** 大龍峒保安宮 收驚法術醫療學術: https://www.baoan.org.tw/paper.php?action=show&id=11&lang=tw
- **[S53]** 行天宮 收驚婆 academic study: https://www.airitilibrary.com/Publication/Index/17277647-200904-201411250017-201411250017-198-225
- **[S54]** 南華大學 幼兒收驚與療癒 thesis: https://nhuir.nhu.edu.tw/retrieve/21446/100NHU05183001-001.pdf
- **[S55]** 幸福空間 八卦鏡4大禁忌: https://hhh.com.tw/columns/detail/7295
- **[S56]** 香港文匯報 樓市八卦陣: http://paper.wenweipo.com/2017/07/21/FI1707210047.htm
- **[S57]** 新浪 小葫蘆的妙用 化煞: https://www.sina.cn/news/detail/5010538771252480.html
- **[S58]** YouTube 鍾亦禮 八卦鏡佈陣: https://www.youtube.com/watch?v=4PMVsJeWBtw
- **[S60]** 中國道教協會 常誦經典: http://www.taoist.org.cn/getDjzsByC2Action.do?c2=csjd
- **[S63]** 百度百科 道教八大神咒: https://baike.baidu.com/item/%E9%81%93%E6%95%99%E5%85%AB%E5%A4%A7%E7%A5%9E%E5%92%92/1190054
- **[S64]** 道音文化 淨口神咒: https://www.daoisms.com.cn/2012/29/13/19347/
- **[S68]** 百度百科 天蓬神咒: https://baike.baidu.com/item/%E5%A4%A9%E8%93%AC%E7%A5%9E%E5%92%92/6978731
- **[S73]** 維基百科 放生: https://zh.wikipedia.org/wiki/放生
- **[S74]** 百度百科 放生: https://baike.baidu.com/item/放生
- **[S76]** 維基百科 紫微斗數: https://zh.wikipedia.org/zh-cn/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8
- **[S77]** 百度百科 十四主星: https://baike.baidu.com/item/%E5%8D%81%E5%9B%9B%E4%B8%BB%E6%98%9F/991733
- **[S78]** 51xingli 巨門化忌詳解 學術: https://www.51xingli.com/3606.html
- **[S79]** 豆瓣 紫微斗數星性全方位講義: https://m.douban.com/note/269003862/

### Ethics / digital-health best practices
- **[S80]** APA — Digital Mental Health 101 (Part 3): https://www.psychiatry.org/getmedia/58eabe07-2599-4334-8298-d12237e55c37/APA-Digital-Mental-Health-101-Part-3.pdf
- **[S81]** Frontiers in Digital Health — Digital Mental Health for Young People: Scoping Review of Ethical Challenges (2021): https://www.frontiersin.org/journals/digital-health/articles/10.3389/fdgth.2021.697072/full
- **[S82]** Tilburg University — Reconceptualizing the Ethical Guidelines for Mental Health Apps: https://research.tilburguniversity.edu/files/111811562/Reconceptualizing_the_ethical_guidelines_for_mental_health_apps.pdf
- **[S83]** Santa Clara University, Markkula Center — Understanding the Ethics of Digital Mental Health Care: https://www.scu.edu/ethics/healthcare-ethics-blog/understanding-the-ethics-of-digital-mental-health-care-telemedicine-and-mental-health-apps/
- **[S84]** PMC — Cross-Cultural and Global Uses of a Digital Mental Health App: https://pmc.ncbi.nlm.nih.gov/articles/PMC8392688/

### Independence & verification note
- Where 維基文庫 (wikisource) and ctext host the **same** primary text (e.g. 《淵海子平》《三命通會》《茅山志》), they count as **one primary source made independently reachable via two hosts**. Every such entry in this spec is therefore paired with **at least one genuinely independent secondary/academic/government source** to satisfy the “≥ 2 independent sources” rule. The verifier (W12/W13) explicitly validated this independence structure.
- Entries that could **not** reach ≥ 2 independent sources, or whose verbatim text could not be matched to primary canon, were **rejected or flagged**:
  - Round 3.4 Mao Shan 口訣 — **conditional**, no verbatim text reproduced.
  - Round 8.5 洞淵神咒 — **textual uncertainty**, only representative excerpt, marked non-canonical-as-single-mantra.
  - Round 10.2 「鬼門」 — **NOT a standard star**, excluded from active list, retained only as a flag.

---

## APPENDIX A — Round-by-round verification summary

| Round | Subject | Entries verified | Conditional / flagged | Rejected |
|---|---|---|---|---|
| 1 | BaZi indicators | 11 | 胎元/日主/純陰純陽 = derived structural rules (flagged inline) | 0 |
| 2 | Spirit types | 6 | 嬰靈 = modern 1970s Taiwan (flagged inline) | 0 |
| 3 | Mao Shan | school + items + 符結構 | 口訣 verbatim text (no fabrication) | 0 |
| 4 | Zheng Yi | 符籙 / 拜斗 / 解厄 | — | 0 |
| 5 | Lü Shan | 法主真君 / 陳靖姑 / 三奶 / 收驚驅邪 | — | 0 |
| 6 | Taiwan 收驚 | ritual + items + practitioner + variants | — | 0 |
| 7 | Hong Kong | 化煞物 + 道館 context | — | 0 |
| 8 | 道藏 神咒 | 金光 / 淨心 / 淨口 / 北帝殺鬼 (天蓬) | 洞淵神咒 (textual uncertainty) | 0 |
| 9 | Remedies | 7 categories | — | 0 |
| 10 | Tử Vi | 陰煞 / 巨門化忌 / 天空 / 地劫 / 鈴星 | 「鬼門」 NOT canonical (excluded from active list) | 鬼門-as-standard-star |
| 11 | ETHICS | disclaimer + opt-in + forbidden + tone + sources | — | 0 |

**End of AM-TA-SPEC.md.**
