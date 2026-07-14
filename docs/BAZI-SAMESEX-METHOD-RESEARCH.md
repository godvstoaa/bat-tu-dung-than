# BaZi & Same-Sex Relationships — Method Research

> **Scope:** Determine the range of approaches modern BaZi (八字 / Four Pillars) practitioners and scholars use to read same-sex relationships, which is most defensible, and whether/how this Vietnamese BaZi app should integrate it.
> **Status:** RESEARCH ONLY. No code was modified. This document is the deliverable.
> **Date:** 2026-07-14
> **Confidence:** Medium-High on the *landscape* of approaches; Medium on any single "correct" method (because there is no classical authority and the topic is practitioner-dependent).

---

## TL;DR (executive summary)

1. **There is NO classical precedent.** None of the canonical texts (滴天髓, 穷通宝鉴, 三命通会, 渊海子平, 子平真诠) address same-sex attraction or partnership. China has a well-documented historical same-sex tradition (断袖之癖, 龙阳之好 — see Bret Hinsch, *Passions of the Cut Sleeve*), but classical BaZi **never** connected it to chart analysis. Every same-sex method in use today is a **modern extrapolation** from Ten Gods (十神) theory.
2. **Three competing modern approaches** are in circulation: (a) **Day-Branch / spouse-palace universal**, (b) **Peer/Companion star (比肩/劫财) as the partner star**, (c) **Symmetrical synastry** (both charts, element + day-branch interaction, drop the gendered spouse star).
3. **The most defensible method for a modern app is (c) symmetrical synastry, with (a) day-branch as the universal spouse palace for single-chart reading.** It is the only approach grounded in genuine classical practice (合婚 is inherently chart-vs-chart and gender-symmetric in its mechanics), it treats two people symmetrically, and it requires no speculative star-remapping.
4. **Approach (b) — the Peer Star method — is popular in Chinese-language practitioner circles but is the LEAST defensible as a default**: it has no empirical validation (Peter Yap's 2009 study of ~50 LGBT charts found *"Not very obvious signature being LGBT"*), the Peer star is ambiguous (siblings/friends/colleagues/competitors — not just lovers), and it was largely invented to **detect orientation** rather than to **read an existing partnership**, which makes it ethically fraught.
5. **Recommendation: integrate, but selectively.** Same-sex **compatibility** (合婚) is low-risk and genuinely gender-neutral — integrate it. Same-sex **single-chart marriage timing** can be supported via the gender-neutral day-branch / 红鸾·天喜·桃花 triggers. Do **not** build a "gay detector" and do **not** silently remap the spouse star to the Peer star as the default.

---

## 1. The gendered rule the app currently uses (baseline)

Traditional BaZi is binary-gendered in its spouse/child assignment:

| Native | Spouse star (配偶星) | Child star (子嗣星) |
|---|---|---|
| **Male (男命)** | Wealth — 正財 / 偏財 (Tài) | Officer/Kill — 正官 / 七殺 (Quan/Sát) |
| **Female (女命)** | Officer/Kill — 正官 / 七殺 (Quan/Sát) | Output — 食神 / 傷官 (Thực/Tương) |

The Spouse **Palace** (夫妻宫 / 配偶宫) is the **Day Branch (日支)** for everyone — this part is already gender-neutral.

### Where this lives in THIS app's code (for later implementation; NOT changed here)

| File | Line(s) | Gendered logic |
|---|---|---|
| `src/engine/family.js` | `elementForRole(dayGan, isMale, role)` (line ~26); `spouse`/`child` branches (lines ~32, 35) | The core rule: spouse element flips on `isMale`; child element flips on `isMale` |
| `src/engine/family-deduction.js` | 81, 86, 182, 190 | Inherits `isMale` + `elementForRole` |
| `src/engine/marriage-timing.js` | 35 | `const spouseGods = isMale ? ['正財','偏財'] : ['正官','七殺'];` — only gendered line; everything else (红鸾/天喜/桃花, day-branch 合/冲) is already gender-neutral |
| `src/engine/ideal-match.js` | 138–140, 248–249 | `idealChildTiming` / `idealChildDates` pick child star via `isMale`. `findIdealPartners` takes `opts.gender` (partner gender) |
| `src/engine/hehun.js` | ~122–133 ("十神 spouse-star cross-check") | The **only** gendered sub-factor in the whole 合婚 score. The rest of `hehun.js` (day-branch 合/冲/刑/害, 五行 complementarity, 日干 合/克/生, 用神 mutual support) is **already gender-neutral** |

**Key insight:** the app's compatibility engine (`hehun.js`) is already ~90–95% gender-neutral. The gendered surface is small and concentrated. This makes approach (c) cheap to adopt.

---

## 2. Summary table — the competing approaches

| # | Approach | Core idea | Advocates / rationale | Limitation / criticism | Defensible? |
|---|---|---|---|---|---|
| **(a)** | **Day-Branch universal** (配偶宫 = 日支) | Read the Day Branch as the partner "slot" for everyone; de-emphasise the gendered spouse star. Partner = whatever occupies/interacts with 日支. | **TryBazi**, **Hoseiki / Master Chase** ("Bazi Reading for Same-Gender Relationships should be read like everyone else's"), **Eastern Fate**. Rationale: the palace is literally named 夫妻宫; it denotes *the intimate-partner position in your life*, not the gender of who fills it. | Loses the "what element is my partner" info that the spouse star gives. Doesn't by itself solve compatibility (needs a second chart). | **Yes** — for single-chart "partner quality / marriage palace" reading. |
| **(b)** | **Peer / Companion star (比肩 / 劫财) as partner star** | A same-sex partner IS a "peer" (same element, same generation). Read 比肩/劫财 (Tỷ/Kiếp) as the partner star instead of Tài/Quan. "比劫重重且为用神" or "日支坐比肩" = same-sex enters spouse palace. | **cafengshui.net** (Canadian Feng Shui Research Center — clearest statement: *日支坐比肩 = 同性进入配偶宫*), **Sina Astrology**, **Douban** (同志怎么看配对), **Zhihu** columns, **oursteps** forum. Internal logic is elegant: 比肩 = same element/polarity = "same-gender peer" in the Ten Gods. | (1) **No empirical validation** — Peter Yap (Skillon) studied ~50 LGBT charts (2009) and found *"Not very obvious signature being LGBT."* (2) 比劫 is **ambiguous** — it also means siblings, friends, colleagues, competitors; cannot isolate "romantic partner." (3) It was developed to **detect orientation**, not to **read an existing union** — ethically fraught. (4) Which peer star — 比肩 (same polarity) or 劫财 (opposite polarity)? Practitioners disagree. | **Marginal.** Interesting optional lens, NOT a sound default. |
| **(c)** | **Symmetrical synastry** (合婚, both charts) | Compare two charts symmetrically: day-branch interaction (六合/三合/六冲/刑/害), five-element complementarity, day-stem 合/克/生, 用神 mutual support, 神煞. **Drop the gendered spouse star entirely.** | **TryBazi** (explicit: *"BaZi compatibility analysis is based on elemental interactions and chart dynamics, not gender… applies regardless of the genders of the people involved"*), **linglong.app** ("a rational guide to 合婚"), the classical 合婚 tradition itself. This is the **engine** of hehun and it is inherently gender-symmetric. | Only answers *compatibility between two known charts* — does NOT answer "when will I marry?" (timing) or "describe my future partner" (single-chart projection) by itself. | **Most defensible** — for compatibility. Grounded in genuine classical practice. |
| **(d)** | **Output star (食神 / 伤官) or other non-traditional assignments** | E.g. read Output as the partner star; or mix-and-match. | Very thin support. One Zhihu mention of "男命食神很强" as a same-sex *indicator*, not as a partner-star reassignment. No developed school. | Speculative, idiosyncratic, no consensus. | **No** — insufficient backing. |
| **(e)** | **"Read same as opposite-sex but swap which star"** (role-based) | E.g. "a gay man in the receptive role reads 官杀 as partner" or "two men both read 财." | Folk variant of (b). | Role-stereotyping; if both partners read the same star, the complementary logic of 合婚 breaks. Inherited problems of (b) plus added assumptions. | **No**. |

---

## 3. The classical question — is there any pre-modern authority?

**No.** Targeted searches across the canonical BaZi corpus confirm:

- **滴天髓 (Drops of Heavenly Marrow)** — emphasises 中和 (equilibrium), yin/yang, cold/warm, dry/moist balance. No discussion of sexual orientation.
- **穷通宝鉴 (Precious Mirror)** — month-by-month favourable elements per Heavenly Stem. No discussion of orientation.
- **三命通会, 渊海子平, 子平真诠** — define the gendered 十神 六亲 (Ten Gods / Six Relatives) framework (男命財為妻, 女命官殺為夫) but never address same-sex unions.

China has a rich documented same-sex history (断袖之癖 / "passion of the cut sleeve", 龙阳之好; Bret Hinsch, *Passions of the Cut Sleeve*, UC Press; also 冯梦龙《情史·情外类》). But this cultural history was **never systematically linked to BaZi chart analysis** in pre-modern sources.

> **Conclusion:** Every same-sex BaZi method is a modern extrapolation from Ten Gods theory. There is no "going back to the classics" for authorisation — the app must own any modern choice transparently.

---

## 4. The 合婚 (hehun) tradition — is classical synastry gendered?

This is the crucial question, and the answer is **nuanced and favourable to approach (c)**:

- **The engine of 合婚 is gender-symmetric.** The classical techniques — 纳音 (nayin) five-element match, 生肖 (zodiac) 三合/六合/相冲, **日支 (day-branch) 合/冲/刑/害**, 日干 (day-stem) 合/克/生, 用神 (favourable element) mutual support, and most 神煞 (spiritual stars) — apply the *same* judgement to both charts. "相生为吉, 相克为凶, 相合为佳, 相冲为忌" is symmetric.
- **Only the interpretive overlay was heteronormative.** Some classical hehun rules assume a male/female pair: e.g. "男命年命克女命年命 = 乾坤之道" (male nayin controlling female = heaven-earth order), gendered 神煞 like 克妻 (wife-harming) / 克夫 (husband-harming) stars, and "伤官" flags read specifically against the female husband-star.
- The **app's own `hehun.js` reflects exactly this split**: day-branch interaction, element complementarity, stem relations, 用神 support are all gender-neutral; the single gendered sub-factor is the "spouse-star cross-check" (lines ~122–133) that checks whether each person sees the other as the gendered spouse star.

> **Implication:** For **compatibility**, approach (c) is not a modern invention — it is classical hehun with the heteronormative overlay removed. That makes it the most defensible path.

---

## 5. The MOST DEFENSIBLE method for this app

### Primary: Approach (c) — Symmetrical synastry, for compatibility

**Why:**
1. **Genuine classical grounding.** The mechanics of 合婚 are chart-vs-chart and gender-symmetric. We are removing an interpretive overlay, not inventing new theory.
2. **Symmetric / non-discriminatory.** Two charts are read the same way regardless of the pair's gender composition — internally consistent and ethically clean.
3. **No speculative star-remapping.** Avoids the unresolved debate over which star "is" the same-sex partner.
4. **Already 90–95% implemented** in `hehun.js`. The only change needed is to neutralise (or make optional) the single "spouse-star cross-check" sub-factor.
5. **Endorsed explicitly** by the clearest English-language practitioner source (TryBazi) and implicit in the rational-hehun trend.

**Mapping to app code:** `hehun.js` + `ideal-match.js#findIdealPartners` (which already calls `computeHehun`). Same-sex compatibility is essentially "run the existing engine; drop/optionalise the one gendered factor."

### Secondary: Approach (a) — Day-Branch as universal spouse palace, for single-chart reading

**Why:** The Day Branch is *literally* named 配偶宫 / 夫妻宫 (spouse palace) for everyone. It describes the intimate-partner position in the native's life — independent of the gender of whoever fills it. For "describe my marriage palace" / "is my spouse palace stable or unstable (clash/penalty)," this works identically for all orientations.

**Mapping to app code:** `family-deduction.js` reads the spouse palace (Day Branch) plus spouse star. For same-sex, lead with the palace analysis (gender-neutral) and present the spouse-star analysis as a secondary/optional layer.

### For marriage timing: use the gender-neutral triggers, drop the gendered one

`marriage-timing.js` already has **five** gender-neutral triggers (红鸾, 天喜, 桃花, 红艳, day-branch 合/冲) and **one** gendered trigger (`spouseGods = isMale ? 財 : 官殺` at line 35). For same-sex, the five neutral triggers are sufficient and well-attested. The spouse-star透干 trigger can be made optional or omitted.

### NOT recommended as default: Approach (b) — Peer Star

It is the loudest method in Chinese-language forums but:
- Fails the empirical check (Peter Yap, Skillon, 2009: ~50 charts, no clear signature).
- Is ambiguous (peer = many relationships).
- Conflates *orientation detection* with *relationship reading* — the app should read relationships, not diagnose orientation.
- Risks stereotyping/offending the very LGBT users it would serve.

**If offered at all**, present it only as an explicit, opt-in "alternative lens" with a clear caveat that it is a modern interpretive experiment, not classical doctrine.

---

## 6. Should the app integrate same-sex support? (pros / cons / risks)

### Pros
- **Inclusivity + market reach.** LGBT users exist in the user base; a binary-gendered reading is either wrong or off-putting for them.
- **Low cost for the high-value slice.** Compatibility (the most-asked question) is already nearly gender-neutral in the engine.
- **Defensible authority.** Approach (c) stands on classical 合婚 ground; the app is not flying blind.
- **Forward-looking brand positioning** in a Vietnamese market that is increasingly LGBT-tolerant.

### Cons / Risks
- **No classical authority.** Any choice is a modern interpretation; purist users may object ("the app is inventing doctrine"). Mitigation: be transparent, label it explicitly.
- **Practitioner-dependent.** Picking one method (e.g. synastry) will not satisfy advocates of another (e.g. peer-star). Mitigation: pick the most-defensible (synastry) and optionally expose alternatives with caveats.
- **Cultural / political sensitivity (Vietnam).** Same-sex marriage is **not legally recognised** in Vietnam (the 2014 Law on Marriage and Family removed penalties but does not recognise same-sex unions; *verify current status before launch*). A "marriage timing" feature for same-sex couples sits in a cultural/legal grey zone. Mitigation: frame as "tình duyên / phối ngẫu" (relationship/partner) reading rather than legal "hôn nhân"; keep tone neutral.
- **"Gay detector" risk.** If same-sex support is implemented by *flagging* LGBT orientation from the chart (the peer-star detection tradition), it is ethically fraught and can out/insult users. Mitigation: **never** infer or label orientation; only read partnerships the user themselves declares.
- **Medical/mental-health adjacency.** Some Chinese sources frame same-sex attraction as resulting from "配偶星為忌/受克" (pathology-adjacent). The app must NOT pathologise. Mitigation: neutral, affirming framing.

### Recommendation
**Integrate — selectively and carefully:**
1. **Compatibility (合婚 / ideal-match):** Integrate. Genuinely gender-neutral, low-risk, high-value. Neutralise the one gendered sub-factor in `hehun.js`.
2. **Marriage timing (marriage-timing):** Support via the five gender-neutral triggers. Make the spouse-star透干 trigger optional.
3. **Single-chart partner reading (family-deduction spouse star):** Lead with the universal Day-Branch palace analysis; present the gendered spouse-star layer as secondary/optional.
4. **Do NOT build an orientation detector.** Do NOT remap spouse star → peer star as a default. Read only what the user declares.
5. **Disclosure:** Add a short, honest caveat in the UI — "cách đọc phối ngẫu đồng giới là diễn giải hiện đại (không có điển cố cổ pháp), tham khảo hợp hôn hai lá số là nền tảng vững nhất." (Same-sex partner reading is a modern interpretation with no classical precedent; two-chart 合婚 is the strongest basis.)

---

## 7. Key caveats (must be surfaced in any UI / docs)

1. **No classical authority.** All same-sex BaZi methods are modern extrapolations. The app must say so plainly.
2. **Practitioner-dependent.** There is no consensus method. Reasonable practitioners disagree.
3. **Empirical weakness.** The most-cited "indicator" (peer star) was not validated in the only small study found (Peter Yap, 2009, ~50 charts).
4. **Do not infer orientation.** Reading a partnership the user declares is fine; diagnosing orientation from the chart is not.
5. **Cultural sensitivity.** Use neutral, affirming Vietnamese terminology (phối ngẫu / bạn đời / tình duyên) rather than clinical or judgmental framing.
6. **Legal context.** Vietnam does not (as of the latest available info) legally recognise same-sex marriage; frame outputs as relationship guidance, not legal-marriage prediction. Verify before launch.
7. **Symmetric = symmetric.** Whatever method is chosen, it must apply identically to opposite-sex and same-sex pairs; a "special gay mode" is itself a form of othering. The cleanest design is one gender-neutral engine for all users, with the gendered spouse-star treated as an optional traditional overlay.

---

## 8. Sources

### Directly on BaZi + same-sex / LGBT
- Skillon / Peter Yap — *Spouse Element for the LGBT Community* (Q&A; 2009 study of ~50 LGBT charts, "Not very obvious signature"): https://www.skillon.com/BaZi_FengShui_Q.cfm/topic/1753/Spouse-Element-for-the-LGBT-Community
- Skillon — *BaZi Profiling & Marriage Compatibility*: https://www.skillon.com/bazi-feng-shui.cfm/topic/2726/BaZi-Profiling-Match-Marriage-Compatibility
- TryBazi — *BaZi Compatibility* (explicit: compatibility is element-based, "applies regardless of the genders"): https://trybazi.com/blog/bazi-compatibility
- Hoseiki / Woo Enyi / Master Chase — *Bazi Reading for Same-Gender Relationships* ("should be read like everyone else's"): https://hoseiki.com/blogs/news/bazi-reading-for-same-gender-relationships
- Eastern Fate — *Spouse Palace in BaZi*: https://www.easternfate.com/blog/bazi-spouse-palace
- Master Lee Jun Yi 李寯颐 (Malaysia, openly gay BaZi master) — channel & *LGBT 同性戀與八字命理的關係* series: https://www.youtube.com/@masterleejunyi/about ; interview 斌宾有理: https://www.facebook.com/story.php?story_fbid=741258613590881&id=100044515803048

### Chinese-language practitioner sources (peer-star / 比劫 approach)
- cafengshui.net (Canadian Feng Shui Research Center) — *同性戀者的八字命理特徵* (日支坐比肩 = 同性进入配偶宫): http://www.cafengshuinet.com/m/show_detail.php?id=1608 (cf. id=1613)
- Sina Astrology — *同性恋的命理特征* (比劫重重且为用神 = 同性缘好): http://astro.sina.com.cn/l/2013-05-29/133394086.shtml
- Douban — *同志怎么看配对* (比劫 as same-sex representative): https://m.douban.com/note/869708213/
- Zhihu — *四柱命理解析同性恋命格*: https://zhuanlan.zhihu.com/p/644101864
- Zhihu — *如何从生辰八字看同性恋倾向*: https://zhuanlan.zhihu.com/p/642857604
- Sohu — *同性恋人的生辰八字研究*: https://mt.sohu.com/20170519/n493579539.shtml
- shen88 — *同性恋八字合婚的特殊算法* (九宫合婚法): https://services.shen88.cn/bazisuanming/pc-102985.html
- Xiaoyuzhoufm podcast — *比肩 & 劫财 (下): 同志、艺术家、运动员*: https://www.xiaoyuzhoufm.com/episode/63cb53df6bcfd94102793070

### Classical / 合婚 (synastry) background
- Wikipedia — *Four Pillars of Destiny*: https://en.wikipedia.org/wiki/Four_Pillars_of_Destiny
- Baidu Baike — *八字合婚*: https://baike.baidu.com/item/八字合婚/3383038
- Zhihu — *八字合婚--教程*: https://zhuanlan.zhihu.com/p/1909025396793545972
- Zhihu — *最全的四柱八字合婚法*: https://zhuanlan.zhihu.com/p/1918950519805805814
- linglong.app — *BaZi Compatibility (HeHun): A Rational Guide*: https://linglong.app/en/learn/bazi-hehun
- cafengshui.net — *合婚择日* (纳音 basis): http://www.cafengshuinet.com/m/show_detail.php?id=978
- Di Tian Sui overview (Baidu Baike): https://baike.baidu.com/item/滴天髓/6165128

### Historical same-sex context in China (no BaZi link)
- Univ. of Kansas library guide — *Passions of the Cut Sleeve* (Bret Hinsch) & male same-sex tradition in China: https://guides.lib.ku.edu/c.php?g=1265016&p=9275877

### Named practitioners (no published same-sex doctrine found)
- Raymond Lo — *Four Pillars Course 1* (spouse star / marriage; no same-sex stance located): http://www.raymond-lo.com/14537/four-pillars-of-destiny-course-1
- Joey Yap — *Chart Compatibility* (general): https://www.facebook.com/datojoeyyap/photos/.../10156649834039843/
- *Note:* Jerry King, Lilly Chung, Master Mas — no direct, citable same-sex BaZi doctrine was located in public English-language materials. Flagged as a gap; their printed works may address it but were not accessible here.

---

## 9. Uncertainty log (what to verify before shipping)

- **[GAP]** No citable English-language same-sex doctrine from the major named masters (Jerry King, Lilly Chung, Raymond Lo, Joey Yap, Master Mas). Their books/videos may contain stances not surfaced by web search; if the team wants a named-authority citation, acquire the specific course materials.
- **[GAP]** The Peer-Star (比劫) approach has no peer-reviewed or large-sample validation; the only small study found (Peter Yap, n≈50, 2009) is a single practitioner's self-report.
- **[VERIFY]** Vietnam's legal status of same-sex marriage at launch time (the 2014 Law on Marriage and Family context is the baseline; confirm no later change).
- **[VERIFY]** Which peer star (比肩 same-polarity vs. 劫财 opposite-polarity) each sub-school prefers — unresolved in the sources; treat as non-canonical either way.
- **[JUDGEMENT CALL]** This document recommends (c)+(a) and explicitly does NOT recommend (b) as a default. That is a defensible editorial choice, not a community consensus — the team should confirm alignment before implementation.
