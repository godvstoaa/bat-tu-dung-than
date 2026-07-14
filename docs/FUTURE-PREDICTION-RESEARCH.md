# FUTURE-PREDICTION (TIMING) SYSTEMS — BaZi vs Western Astrology

> Research dossier for the synthesis diagram + the future Western-prediction module.
> Scope: **how each tradition answers «WHEN will X happen / this period is favorable»**,
> the symbolic mechanics each uses, a one-to-one cross-mapping, and what is feasible
> to compute in this app (which already uses `astronomy-engine` ^2.1.19).
>
> Research-only. No source code was modified.

---

## 0. Honesty & framing (read first)

- **Neither BaZi timing nor Western predictive astrology is scientifically validated.**
  Both are **symbolic timing frameworks**: they map meaning onto astronomical/calendrical
  cycles. No peer-reviewed study has demonstrated that either system predicts concrete
  life events (marriage, wealth, career change) above chance. Treat everything below as
  *descriptions of the symbolic systems*, not as claims about reality.
- The two systems are **structurally different but philosophically parallel**: both attach
  a "ruler/lord" to a time window, both layer a long cycle (decade-ish) under a short cycle
  (year-ish), and both flag "friction years" vs "opening years."
- This doc cites practitioner/community sources (Wikipedia, The Astrology Podcast, Cafe
  Astrology, Kepler College, Fatemaster, BaziFortune, etc.) — these describe the traditions
  faithfully but are not scientific evidence.

---

## 1. BaZi (八字) timing side — what the app already implements

The app is a mature BaZi engine. Timing is implemented as a **layered** system:

### 1.1 起运 (Qi Yun) — the luck-cycle onset age
- **What:** the age at which the first 10-year luck pillar begins.
- **Mechanic:** measure days from the **birth date** to the **nearest solar term (节气)**,
  using the classical **"3 days = 1 year"** rule (`渊海子平` / `三命通会`):
  - 3 days = 1 year · 1 day = 4 months · 2 days = 8 months · 1 时辰 (2 hours) = 10 days.
  - Direction: **阳男阴女顺行** (Yang-year male / Yin-year female count **forward** to the
    **next** solar term); **阴男阳女逆行** (Yin-year male / Yang-year female count **backward**
    to the **previous** solar term). [Sources: [BaziFortune](https://bazifortune.app/blog/bazi-da-yun-starting-age-calculation), [Fatemaster](https://www.fatemaster.ai/en/guides/qiyun-starting-time), [Wikibooks](https://en.wikibooks.org/wiki/Ba_Zi/Luck_Pillar)]
- **In code:** `src/engine/jiaoyun.js` → `computeJiaoYun()` uses `lunar-javascript`'s
  `EightChar.getYun(gender)` then derives `qiyunDate` + 8 decade-transition points.
- **No Western equivalent** — Qi Yun is BaZi-specific (solar-term-distance-to-age). Western
  cycles all begin at birth (or a birthday), not at a computed onset age.

### 1.2 大运 (Da Yun) — 10-year luck pillars (decade cycle)
- **What:** the backbone of BaZi prediction. Each pillar = a 10-year "time-lord" window.
- **Mechanic:** pillars are generated from the **month pillar** through the 60 JiaZi cycle,
  forward (顺排) or backward (逆排) per the same gender × year-stem-polarity rule as Qi Yun.
  Each pillar's stem (天干) + branch (地支) carry a Five-Element (五行); whether that element
  is the chart's **Dụng Thần / Hỷ Thần (用神/喜神, favorable element)** decides if the decade
  is "Cát" (favorable) or "Hung" (unfavorable). [Sources: [BaziWeb](https://bazi-web.com/luck-pillars-da-yun-10-year-cycles-guide/), [DeepOracle](https://www.deeporacle.ai/en/bazi/blog/bazi-luck-pillars-guide)]
- **In code:** `src/engine/jiaoyun.js`, `dayun-active.js`, `dayun-check.js`, `dayun-rank.js`,
  `dayun-changsheng.js`, `dayun-god.js`. `golden-year.js` resolves the **active Da Yun per
  year** by `startYear <= year < startYear+10` (a bug-fix noted in comments).

### 1.3 流年 (Liu Nian) — annual luck
- **What:** the year's own gan-zhi (e.g. 2026 丙午) interacting with the natal chart **and**
  with the active Da Yun.
- **Mechanic:** the year stem+branch vs the natal Four Pillars — clashes (冲), combinations
  (合), harms (害), penalties (刑); plus the **Ten Gods (十神)** the year produces for the
  Day Master (日主). A "peak year" = the Da Yun **and** the Liu Nian **both** carry the
  favorable element. [Sources: [HumanInsightPath](https://humaninsightpath.com/blog/bazi-beginner-guide), [ShenShu](https://www.shen-shu.com/en/10-year-luck-calculator)]
- **In code:** `liunian-pro.js` (6-school deep analysis), `liunian-shen.js`,
  `liunian-12shen.js`, `liunian-event.js`.

### 1.4 流月 / 流日 (Liu Yue / Liu Ri) — monthly / daily luck
- **What:** finer-grained timing within a year.
- **In code:** `src/engine/liuyue.js` (流月), `src/engine/liuri.js` (流日), `daily.js`, `year-daily.js`.

### 1.5 太岁 (Tai Sui) — the Grand Duke / year-ruler friction system
- **What:** when a Liu Nian branch clashes with the **natal year branch** (本命), it is
  **犯太岁 (Fan Tai Sui)** — a "friction year" (career/health/relationship turbulence).
  Five interaction types: 冲 Clash, 害 Harm, 破 Destruction, 刑 Penalty, 合 Combination.
  - Historically Tai Sui is tied to **Jupiter** — "Grand Duke **Jupiter**" — because the
    year-stem cycle tracks Jupiter's ~12-year orbit. This matters for the cross-map below.
- **In code:** `src/engine/taisui.js` → `personalTaSui(birthZhi, yearZhi)`, consumed by `golden-year.js`.
- [Sources: [FengShuiMall Tai Sui](https://www.fengshuimall.com/blog/tai-sui-grand-duke-jupiter-2026), [OpenFate](https://openfate.ai/en/insights/2026-tai-sui-warning)]

### 1.6 桃花 / 红鸾 (Tao Hua / Hong Luan) — romance & marriage timing stars
- **What:** shensha (神煞) used to **time** romantic/marital events.
  - **桃花 (Tao Hua)** — attraction, charisma (from year/day branch via cardinal branches 卯子午酉).
  - **红鸾 (Hong Luan)** — marriage/celebration "traveling star" changing yearly → pinpoints
    **marriage timing**. **天喜 (Tian Xi)** is its companion.
  - When Hong Luan / Tao Hua appears in a Da Yun or Liu Nian pillar, it signals a romantic/marital event.
- **In code:** `src/engine/taohua.js`, `marriage-timing.js`, `marriage-stars.js`,
  `spouse-star.js`, `romance-deep.js`, `shensha.js`.
- [Sources: [DeepOracle Peach Blossom](https://www.deeporacle.ai/en/bazi/blog/peach-blossom-shensha), [Fatemaster Hong Luan](https://www.fatemaster.ai/en/guides/shensha/hong-luan)]

### 1.7 Golden year (黄金年) + wealth/career peak
- **What:** `golden-year.js` scans 10 years and ranks them, synthesizing **6 timing layers**:
  Liu Nian (6 schools, 40%) + 12 神煞 (15%) + Tai Sui (20%) + Sui-Yun interaction (10%) + Da Yun god (15%).
  A **"truly golden" year** requires Da Yun **and** Liu Nian both carry Dụng/Hỷ **and** score ≥ 65.
- **Wealth peak** (`wealth-star.js`, `career-star.js`): when Da Yun + Liu Nian both bring the
  **Wealth element (财星)** simultaneously.
- [Source: [DeepOracle luck pillars](https://www.deeporacle.ai/en/bazi/blog/bazi-luck-pillars-guide)]

---

## 2. Western predictive astrology — the main research

Western astrology predicts "when" via a **suite of independent techniques** (not one
hierarchical system like BaZi). The six canonical methods:

### 2.1 Transits (the workhorse)
- **What:** the **real-time** positions of planets in the sky, forming aspects (angles) to your
  natal planet positions. The single most-used Western timing tool.
  - [Wikipedia: Western astrology](https://en.wikipedia.org/wiki/Western_astrology), [Astrology-API comparison](https://astrology-api.io/blog/transits-vs-progressions-vs-solar-arc)
- **Cycle durations (time per zodiac sign):**

| Planet | Per sign | Full cycle | Nature |
|---|---|---|---|
| Moon | ~2.5 days | ~28 days | moods, daily texture |
| Mercury | ~3.5 weeks | ~88 days | communication |
| Venus | ~4 weeks | ~225 days | love, money |
| Mars | ~2 months | ~687 days | drive, conflict |
| Jupiter | ~1 year | ~12 years | growth, expansion |
| Saturn | ~2.5 years | ~29.5 years | structure, limitation |
| Uranus | ~7 years | ~84 years | disruption |
| Neptune | ~14 years | ~165 years | dissolution |
| Pluto | ~12–30 years | ~248 years | death/rebirth |

  [Source: [Bonnie Gillespie — planet time per sign](https://bonniegillespie.com/how-long-each-planet-stays-in-each-sign/)]

- **Key transit milestones:**
  - **Saturn return** — transit Saturn returns to natal Saturn. 1st at ~27–30, 2nd at ~56–60.
    Read as full-adulthood transition / reassessment. Saturn also squares & opposes natal
    Saturn at ~7-year increments between returns. [Sources: [Wikipedia](https://en.wikipedia.org/wiki/Saturn_return), [CHANI](https://www.chani.com/astro-education/saturn-return)]
  - **Jupiter return** — every ~12 years (ages ~12, 24, 36, 48, 60…). Read as a new growth/abundance chapter. [Sources: [Crystal B. Astrology](https://crystalbastrology.com/your-jupiter-return-and-the-start-of-a-new-12-year-cycle/), [CHANI](https://www.chani.com/astro-education/your-jupiter-return-explained-2022)]
  - **Outer-planet transits** (Uranus/Neptune/Pluto) — multi-year, transformative. The cluster
    of **midlife transits** (Uranus opposition ~42, Neptune square ~40, Pluto square ~38–45)
    is the Western "midlife crisis." [Source: [Kathryn Hocking — midlife transits](https://kathrynhocking.com/mid-life-crisis-transits-astrology/)]

### 2.2 Secondary Progressions (inner evolution)
- **What:** **"1 day after birth = 1 year of life."** Advance the natal chart by ~1 day per year
  of age. Captures *internal* psychological development (vs transits = external events).
- **Moved bodies:**
  - **Progressed Sun** ~1°/year → sign change ~every 30 years (a life "season" shift).
  - **Progressed Moon** ~13°/year → sign change ~every 2.5 years; full cycle ~27.5 years
    (the "progressed lunar return").
  - Outer planets barely move (so progressions are read mainly from Sun/Moon/Mercury/Venus/Mars).
- **In code feasibility:** trivial — `planetLongitude(name, birthDate + ageDays)`.
- [Sources: [The Astrology Podcast — Secondary Progressions](https://theastrologypodcast.com/2018/02/22/secondary-progressions/), [Kepler College](https://library.keplercollege.org/into-secondary-prog/)]

### 2.3 Solar Return (annual "birthday" chart)
- **What:** a chart cast for the exact moment each year when the transiting **Sun returns to its
  natal ecliptic longitude** (within ~1 day of the birthday). That chart describes the
  **12-month theme** for the year (look at SR Ascendant, house emphasis, ruling planet).
- **In code feasibility:** root-find the date when `planetLongitude('Sun', d) ≈ natalSunLon`
  (one solution per year — bisection across the 365-day window). Then reuse
  `computeWesternChart(thatDate, lat, lng)`.
- [Sources: [Astro-Seek Solar Return](https://horoscopes.astro-seek.com/solar-return-chart), [Cafe Astrology](https://cafeastrology.com/solarreturnreport.html)]

### 2.4 Annual Profections (Hellenistic — "ruler of the year")
- **What:** a time-lord technique. **Advance 1 house per year of age**, starting at the 1st
  house (Ascendant) at age 0. The sign on the profected house (whole-sign) gives the
  **Ruler of the Year** (the activated planet). The cycle restarts at the 1st house every 12
  years (ages 0, 12, 24, 36, 48, 60…).
  - e.g. age 36 → 1st-house year (identity, new beginnings); age 37 → 2nd-house (money/values).
- **In code feasibility:** **pure arithmetic** — `profectedHouse = (age % 12) + 1` from the
  Ascendant sign. No astronomy beyond the natal chart (already computed in `western-astro.js`).
- **This is the closest Western analog to Liu Nian's annual theming.**
- [Sources: [Astrology Podcast Ep.153 transcript](https://theastrologypodcast.com/transcripts/ep-153-annual-profections-an-ancient-time-lord-technique/), [Astro.com — Profections & Releasing](https://www.astro.com/astrology/tma_article190314_e.htm), [Mel Priestley](https://www.melpriestley.ca/discover-your-planetary-time-lord-with-annual-profections/)]

### 2.5 Solar Arc Directions
- **What:** advance **every** natal planet/angle by the **same arc** — the Sun's progressed
  motion (~0.9856°/year ≈ **1° per year of life**). Unlike progressions, outer planets move
  too. Aspects from directed planets to natal points mark events.
- **In code feasibility:** `directedLon = natalLon + age × 0.9856°`, then aspect-check vs natal.
- [Sources: [Augurine Solar Arc](https://www.augurine.com/tools/solar-arc-directions-calculator), [Astrology-API](https://astrology-api.io/blog/transits-vs-progressions-vs-solar-arc)]

### 2.6 Zodiacal Releasing (ZR) — Valens time-lords (decade chapters)
- **What:** a Hellenistic technique (Vettius Valens, 2nd c. CE) recovered by Schmidt/Hand and
  popularized by Chris Brennan. Divides life into **hierarchical chapters** ("time-lords")
  released from a **Lot** (usually **Lot of Fortune** = body/health/money, or **Lot of Spirit** =
  career/action).
- **Mechanic:** from the Lot's sign, count signs forward; each sign holds for a fixed **period
  length** = the **minor years of its ruling planet**:

| Sign (ruler) | Period | Sign (ruler) | Period |
|---|---|---|---|
| Aries (Mars) | 15 yr | Libra (Venus) | 8 yr |
| Taurus (Venus) | 8 yr | Scorpio (Mars) | 15 yr |
| Gemini (Mercury) | 20 yr | Sagittarius (Jupiter) | 12 yr |
| Cancer (Moon) | 25 yr | Capricorn (Saturn) | 27 yr |
| Leo (Sun) | 19 yr | Aquarius (Saturn) | 27 yr* |
| Virgo (Mercury) | 20 yr | Pisces (Jupiter) | 12 yr |

  (Planetary minor years: Sun 19, Moon 25, Mercury 20, Venus 8, Mars 15, Jupiter 12, Saturn 27.)
- **Levels:** L1 = the big chapter (8–30 yr), L2 = sub-chapter (~years), L3/L4 = finer.
- **Uncertainty flag:** ⚠️ sources differ on edge cases (e.g. Aquarius 27 vs 30 in some
  variants; Scorpio as Mars-night-house; day-vs-night chart releasing direction). The table
  above is the most-cited modern consensus (Brennan). Validate against a reference impl before shipping.
- **This is the closest Western analog to Da Yun** — a decade-scale time-lord sequence with a "ruler."
- [Sources: [Astrology Podcast Ep.192 transcript](https://theastrologypodcast.com/transcripts/ep-192-transcript-zodiacal-releasing-an-ancient-timing-technique/), [Anthony Louis overview](https://tonylouis.wordpress.com/2017/09/19/a-brief-overview-of-zodiacal-releasing/), [Astro-Seek ZR calc](https://horoscopes.astro-seek.com/zodiacal-releasing-astrology-calculator)]

### 2.7 Eclipses & Lunar Nodes
- **What:** eclipses follow the **nodal axis** (which spends ~18 months per sign-pair; full
  **nodal return ≈ 18.6 years**). An eclipse conjunct/oppose/square a natal planet/angle acts
  as an "on-switch" for that planet's themes. Nodal return / reverse-nodal return ≈ every 9 / 18 years.
- **In code feasibility:** medium — astronomy-engine can compute the Moon's ecliptic latitude;
  nodes = points where Moon ecliptic latitude = 0 (or use mean node). Eclipses = New/Full Moon
  near a node.
- [Sources: [Big Sky Astrology — eclipse aspects](https://www.bigskyastrology.com/eclipse-aspects-natal-planets-narrative-of-change/), [Kelly Surtees eclipse fact sheet](https://www.kellysastrology.com/2012/11/15/eclipses-fact-sheet/), [Astrology Podcast Ep.215](https://theastrologypodcast.com/transcripts/ep-215-transcript-interpreting-solar-and-lunar-eclipses-in-your-birth-chart/)]

### 2.8 Primary Directions (noted for completeness — DEFER)
- The oldest Western technique (Ptolemaic). Rotates the chart ~1° of right ascension per year
  of life. Arc/spherical-trig math is heavy and historically contentious. **Not recommended
  for a first module** — niche and computation/error-prone.

---

## 3. CROSS-MAPPING (the key output)

### 3.1 Master comparison table

| Timing method | BaZi side | Western side | Correspondence | What it "predicts" | Accuracy caveat |
|---|---|---|---|---|---|
| **Decade time-lord** | 大运 Da Yun (10-yr pillar; favorable element decides Cát/Hung) | **Zodiacal Releasing L1** (8–30-yr chapter from Lot of Fortune, ruled by a planet) | **Strongest analogy.** Both = a multi-year window with a single "lord" governing the chapter. Saturn-transit-sign (~2.5yr×n) is a looser, planet-by-planet cousin. | life chapter theme, overall fortune direction for the decade | Not scientifically validated; symbolic only |
| **Annual cycle** | 流年 Liu Nian (year gan-zhi × natal × Da Yun) | **Annual Profections** (1 house/yr; Ruler of the Year) **+ Solar Return** (birthday chart) **+ Jupiter transit** (1yr/sign) | **Strong.** All three Western methods are yearly. Profections (ruler-of-year) ≈ Liu Nian's annual theming; Solar Return ≈ the "year energy"; Jupiter transit ≈ the year's growth flavor. | the dominant theme/activation for that year | Symbolic; no empirical validation |
| **Year-onset offset** | 起运 Qi Yun (computed onset age from solar-term distance, 3 days=1yr) | **None** (all Western cycles start at birth/birthday) | **No equivalent.** Qi Yun is BaZi-specific. | when luck cycles "turn on" | N/A |
| **"Friction / clash year"** | 太岁 Tai Sui / 犯太岁 (Grand Duke Jupiter — natal year-branch clashes with Liu Nian) | **Saturn transit** to natal Sun/Asc/Saturn (the "heavy" taskmaster period); also **eclipse on a natal axis** | **Medium.** Functionally (a year of pressure/transformation) ≈ Saturn transit friction. Historically Tai Sui **is** Jupiter-derived ("Grand Duke Jupiter"), so a literal mapping is the **Jupiter cycle** — but the *felt* experience maps to Saturn. Document both. | turbulence, obligation, restructuring | Symbolic |
| **"Golden / peak year"** | 黄金年 (Da Yun + Liu Nian both favorable, score ≥65) | **Jupiter return** (~12yr) + a cluster of favorable transits/profection to a good house | **Medium.** Jupiter return = Western "abundance window"; closest single thing to a "golden year." | a high-opportunity, expansion year | Symbolic |
| **Marriage / romance timing** | 桃花 Tao Hua + 红鸾 Hong Luan + spouse-star in Da Yun/Liu Nian | **Venus transit/progressed Venus**, **Solar Return 5th/7th house**, **profection to 5th/7th**, **eclipse on Venus/5th/7th/Descendant** | **Medium.** Both flag when "relationship houses/planets" activate. Western is planet/house-based; BaZi is shensha-based. | likelihood/window of romance/marriage | Not validated |
| **Wealth peak timing** | 财星 (Wealth element) in both Da Yun + Liu Nian | **Jupiter transit 2nd/8th house**, **profection to 2nd/8th**, **progressed Sun into 2nd/8th** | **Medium.** Both time when "money houses" activate. | income/asset window | Not validated |
| **Monthly / daily texture** | 流月 / 流日 | **Moon transits** (~2.5 days/sign), **personal-planet transits** (Merc/Venus/Mars, days–weeks) | **Strong.** Western Moon transit ≈ 流日; a week of inner-planet transits ≈ 流月. | short-term mood/opportunity rhythm | Symbolic |
| **Inner maturation arc** | (implicit via Da Yun element progression) | **Secondary Progressions** (1 day=1yr): progressed Sun sign change (~30yr), progressed Moon (~27.5yr cycle) | **Medium.** Progressions describe the *inner* evolution that BaZi folds into the Da Yun pillar reading. | identity/emotional-life phases | Symbolic |
| **Life-milestone transits** | (read off the relevant Da Yun / Liu Nian) | **Saturn return** (~29.5yr, ~58yr), **midlife outer-planet transits** (~38–45) | **One-directional.** Western has explicit, widely-recognized age milestones; BaZi reads them off whatever Da Yun happens to be active. No clean BaZi→Western map. | coming-of-age, midlife reassessment | Symbolic, culturally salient |

### 3.2 Where the systems have NO equivalent (one-directional gaps)

**BaZi-only (no Western parallel):**
- **起运 Qi Yun** — the computed onset age from solar-term distance.
- **天克地冲 (Tian Ke Di Chong)** / **交运 (Jiao Yun) taboos** — the classical "stay still at the
  luck-pillar handover" folk practice.
- The whole **shensha (神煞) traveling-star** menagerie (桃花, 红鸾, 天喜, 驿马, 文昌, …) — Western
  has no "named minor stars"; it uses planet+house instead.
- **流月/流日 as structured gan-zhi** — Western has no fixed monthly/day pillar; it uses transits.

**Western-only (no BaZi parallel):**
- **Saturn return** as a named, age-pinned milestone (~29.5yr) — BaZi has decade cycles but no
  universally-shared "everyone hits this at ~29" event.
- **Outer-planet transits** (Uranus/Neptune/Pluto) as generational, multi-decade arcs — BaZi's
  element cycles don't have ~84/165/248-year spans tied to a single meaning-bearer.
- **Secondary progressions** ("1 day = 1 year") — a distinct symbolic clock with no BaZi analog.
- **Eclipses as natal triggers** — BaZi uses solar terms, not eclipses, for timing.
- **Solar return** as a yearly re-cast chart — BaZi's Liu Nian is just a pillar, not a full re-cast.

### 3.3 The single best structural correspondences (for the synthesis diagram)

```
  BaZi                          Western
  ────                          ───────
  大运 (decade time-lord)   ≈    Zodiacal Releasing L1  (decade chapter + ruler)
                                [looser: Saturn transit through signs]
  流年 (annual pillar)      ≈    Annual Profection + Solar Return + Jupiter transit
  太岁 (Grand Duke,         ≈    Saturn transit friction   (functionally)
       Jupiter-derived)          Jupiter return/cycle      (historically/literally)
  黄金年 (peak year)        ≈    Jupiter return + favorable transit cluster
  桃花/红鸾 (marriage)      ≈    Venus progression/transit + 5th/7th house profection
  流日 (daily)              ≈    Moon transit (~2.5 days/sign)
  起运 (onset age)          ≈    (none — call out as a BaZi-unique node)
```

---

## 4. How to compute each Western method in code

The app already has the right primitive: **`planetLongitude(name, date)`** in
`src/engine/western-astro.js` (line 55) returns the **tropical geocentric ecliptic longitude**
(0–360°) for Sun/Moon/Mercury…Pluto at **any** date — past or future. astronomy-engine
(^2.1.19) is the dependency. The natal chart (`computeWesternChart`) already yields natal
longitudes, the Ascendant sign, and whole-sign houses. So every method below is computable
**without new astronomy libraries**.

| Method | Algorithm (pseudocode) | astronomy-engine calls | Cost |
|---|---|---|---|
| **Transits** | for a target date: `planetLongitude(p, now) − natal[p]` → aspect if within orb. Loop Saturn/Jupiter/outer for multi-year windows. | `planetLongitude` × 10 per date | trivial |
| **Saturn / Jupiter return** | root-find (bisection) the date when `planetLongitude('Saturn', d) ≈ natalSaturnLon` within an expected window (Saturn: scan ±15 yr from age 27; Jupiter: each ~12-yr birthday). | `planetLongitude('Saturn'/'Jupiter', d)` in a bisect | trivial |
| **Secondary Progressions** | `progLon(p) = planetLongitude(p, birthDate + ageDays)` where `ageDays = age`. (1 day = 1 year.) Read progressed Sun/Moon sign & aspects. | `planetLongitude` at shifted date | trivial |
| **Solar Return** | bisect the date near the birthday where `planetLongitude('Sun', d) ≈ natalSunLon`; then `computeWesternChart(d, lat, lng)` → the SR chart. | `planetLongitude('Sun', d)` + reuse `computeWesternChart` | trivial |
| **Annual Profections** | `houseNum = (age % 12) + 1`; sign = Asc sign + (age % 12); ruler of that sign = Ruler of the Year. Activate that house's natal planets. | **none** — pure arithmetic over natal chart | trivial |
| **Solar Arc Directions** | `arc = age × 0.9856°`; `directedLon[p] = natalLon[p] + arc`; aspect-check directed vs natal (esp. conjunctions/squares/oppositions to angles & Sun/Moon/MC/Asc). | none at runtime (natal-based) | trivial |
| **Zodiacal Releasing** | compute **Lot of Fortune** = Asc + Moon − Sun (longitudes, day chart) / Asc + Sun − Moon (night chart); start sign = sign of Lot; walk signs applying each sign's period length (table §2.6); subdivide L2 within each L1. | Lot is arithmetic from natal; no runtime astronomy | easy; ⚠️ validate period table vs reference |
| **Eclipses / Nodes** | compute Moon's ecliptic latitude (via `EclipticGeoMoon` → it gives lon+lat, or convert equatorial); nodes = lat=0 crossings; New/Full Moon near a node = eclipse; check eclipse longitude vs natal points. | `A.EclipticGeoMoon(t)` + New/Full search | medium |

**Notes / cautions for the implementer:**
- **All transit/progression/solar-return math is "just `planetLongitude(name, futureDate)`."**
  The hard part is interpretive content (KB text), not astronomy.
- **Lot of Fortune** requires the natal Sun, Moon, Asc longitudes (all already in
  `computeWesternChart` output) — arithmetic only.
- **Profections & ZR need a day/night chart distinction** (Sun above/below horizon) — computable
  from the existing Asc + Sun longitude + hemispheric check; add a helper.
- **Whole-sign houses are already used** by `western-astro.js`, which is exactly what
  profections and ZR require. Good — no house-system rework needed.

---

## 5. Recommendations — Western methods to ADD (ranked by value × ease)

Goal: parallel BaZi's 大运 (decade) + 流年 (annual) with Western equivalents.

| # | Method | Parallels | Value | Ease | Why |
|---|---|---|---|---|---|
| 1 | **Annual Profections** | 流年 | High | Very High | Pure arithmetic over the natal chart you already compute. Gives a clean "Ruler of the Year" + activated house — the most direct Western analog of Liu Nian's annual theming. Ship first. |
| 2 | **Transits (Saturn/Jupiter returns + outer planets)** | 流年 / 黄金年 / 太岁 | High | High | Reuses `planetLongitude(futureDate)`. Saturn return & Jupiter return are the most-recognized Western "timing events"; outer-planet transits give multi-year arcs. The backbone of any Western prediction module. |
| 3 | **Solar Return** | 流年 | High | High | One bisection per year + reuse `computeWesternChart`. Gives a full annual "year theme" chart — visually rich for the synthesis diagram. Pairs naturally with profections. |
| 4 | **Zodiacal Releasing (L1/L2)** | 大运 | High | Medium | **The closest Western cousin of Da Yun** (decade time-lord chapters). High conceptual value for the synthesis diagram. Needs Lot of Fortune + period table (validate table first). |
| 5 | **Secondary Progressions (Sun/Moon)** | (inner arc of 大运) | Medium | High | Trivial to compute (`planetLongitude(birth+ageDays)`). Adds the "inner evolution" dimension BaZi folds into Da Yun. Cheap value-add. |
| 6 | **Solar Arc Directions** | (event-timing overlay) | Medium | High | `natalLon + age×0.9856°`. Good for pinpointing event years; complements transits. |
| 7 | **Eclipses / Nodes** | (event triggers) | Medium | Medium | More work (node/eclipse detection) but gives "trigger" dates that resonate culturally. Lower priority. |
| 8 | **Primary Directions** | — | Low | Low | Heavy spherical-trig, niche, historically contested. **Defer / skip.** |

**Suggested build order for the future module:** Profections → Transits/Returns → Solar Return →
(synthesis diagram ships here) → Zodiacal Releasing → Progressions → Solar Arc → Eclipses.

**For the synthesis diagram specifically**, the strongest visual pairs to render are:
- **大运 ↔ Zodiacal Releasing L1** (two decade time-lord timelines side by side)
- **流年 ↔ Annual Profection + Solar Return** (two annual "ruler of the year" rows)
- **太岁 ↔ Saturn transit** (two "friction year" markers) — annotate the Jupiter/historical nuance
- **黄金年 ↔ Jupiter return** (two "peak window" highlights)
- A dedicated **「起运 Qi Yun — BaZi-unique, no Western parallel»** callout node.

---

## 6. Sources

### BaZi timing
- [BaziFortune — Da Yun starting age (3 days = 1 year)](https://bazifortune.app/blog/bazi-da-yun-starting-age-calculation)
- [BaziFortune — Luck pillars 10-year cycles guide](https://bazifortune.app/blog/luck-pillars-10-year-cycles-bazi-guide)
- [Fatemaster — Qiyun starting time](https://www.fatemaster.ai/en/guides/qiyun-starting-time)
- [Wikibooks — Ba Zi / Luck Pillar](https://en.wikibooks.org/wiki/Ba_Zi/Luck_Pillar)
- [BaziWeb — Luck pillars explained](https://bazi-web.com/luck-pillars-da-yun-10-year-cycles-guide/)
- [DeepOracle — BaZi luck pillars guide](https://www.deeporacle.ai/en/bazi/blog/bazi-luck-pillars-guide)
- [DeepOracle — Qi Yun glossary](https://www.deeporacle.ai/en/bazi/glossary/qi-yun)
- [ShenShu — 10-year luck calculator](https://www.shen-shu.com/en/blog/step-by-step-guide-to-using-a-bazi-10-year-luck-calculator-for-long-term-planning)
- [ShenShu — 10-year luck cycles](https://www.shen-shu.com/en/10-year-luck-calculator)
- [HumanInsightPath — BaZi beginner guide (Da Yun vs Liu Nian)](https://humaninsightpath.com/blog/bazi-beginner-guide)
- [FengShuiMall — Tai Sui / Grand Duke Jupiter](https://www.fengshuimall.com/blog/tai-sui-grand-duke-jupiter-2026)
- [OpenFate — 2026 Fan Tai Sui (4 types)](https://openfate.ai/en/insights/2026-tai-sui-warning)
- [DeepOracle — Peach Blossom shensha](https://www.deeporacle.ai/en/bazi/blog/peach-blossom-shensha)
- [Fatemaster — Hong Luan guide](https://www.fatemaster.ai/en/guides/shensha/hong-luan)
- [College of Psychic Studies — Peach Blossom](https://www.collegeofpsychicstudies.co.uk/enlighten/peach-blossom-romantic-relationships-in-chinese-astrology/)

### Western predictive astrology
- [Wikipedia — Western astrology](https://en.wikipedia.org/wiki/Western_astrology)
- [Wikipedia — Saturn return](https://en.wikipedia.org/wiki/Saturn_return)
- [Astrology-API — Transits vs Progressions vs Solar Arc](https://astrology-api.io/blog/transits-vs-progressions-vs-solar-arc)
- [The Astrology Podcast — Secondary Progressions](https://theastrologypodcast.com/2018/02/22/secondary-progressions/)
- [Kepler College — Introduction to Secondary Progressions](https://library.keplercollege.org/into-secondary-prog/)
- [The Astrology Podcast — Ep.153 Annual Profections transcript](https://theastrologypodcast.com/transcripts/ep-153-annual-profections-an-ancient-time-lord-technique/)
- [Astro.com — Annual Profections, Lots & Zodiacal Releasing (Brennan)](https://www.astro.com/astrology/tma_article190314_e.htm)
- [Mel Priestley — Annual Profections](https://www.melpriestley.ca/discover-your-planetary-time-lord-with-annual-profections/)
- [Astro-Seek — Annual Profections calculator](https://horoscopes.astro-seek.com/annual-profections-astrology-calculator)
- [Astro-Seek — Solar Return chart](https://horoscopes.astro-seek.com/solar-return-chart)
- [Cafe Astrology — Solar Return report](https://cafeastrology.com/solarreturnreport.html)
- [Big Sky Astrology — Working with Solar Return charts](https://www.bigskyastrology.com/working-with-solar-return-charts/)
- [CHANI — Saturn return](https://www.chani.com/astro-education/saturn-return)
- [Farmers' Almanac — Saturn return](https://www.farmersalmanac.com/what-is-saturn-return-meaning)
- [CHANI — Jupiter return](https://www.chani.com/astro-education/your-jupiter-return-explained-2022)
- [Crystal B. Astrology — Jupiter 12-year cycle](https://crystalbastrology.com/your-jupiter-return-and-the-start-of-a-new-12-year-cycle/)
- [Bonnie Gillespie — How long each planet stays in a sign](https://bonniegillespie.com/how-long-each-planet-stays-in-each-sign/)
- [Kathryn Hocking — Mid-life crisis transits](https://kathrynhocking.com/mid-life-crisis-transits-astrology/)
- [Augurine — Solar Arc Directions calculator](https://www.augurine.com/tools/solar-arc-directions-calculator)
- [The Astrology Podcast — Ep.192 Zodiacal Releasing transcript](https://theastrologypodcast.com/transcripts/ep-192-transcript-zodiacal-releasing-an-ancient-timing-technique/)
- [Anthony Louis — Brief overview of Zodiacal Releasing](https://tonylouis.wordpress.com/2017/09/19/a-brief-overview-of-zodiacal-releasing/)
- [Astro-Seek — Zodiacal Releasing calculator](https://horoscopes.astro-seek.com/zodiacal-releasing-astrology-calculator)
- [Big Sky Astrology — Eclipse aspects to natal planets](https://www.bigskyastrology.com/eclipse-aspects-natal-planets-narrative-of-change/)
- [Kelly Surtees — Eclipses fact sheet](https://www.kellysastrology.com/2012/11/15/eclipses-fact-sheet/)
- [The Astrology Podcast — Ep.215 Interpreting eclipses transcript](https://theastrologypodcast.com/transcripts/ep-215-transcript-interpreting-solar-and-lunar-eclipses-in-your-birth-chart/)

### In-app confirmation (read during research, not modified)
- `src/engine/western-astro.js` — natal-only Western chart; `planetLongitude(name, date)` (L55), `ascendant` (L71), `midheaven` (L86), `computeWesternChart` (L142). Confirms astronomy-engine primitive for all future methods.
- `src/engine/jiaoyun.js` — `computeJiaoYun()` → 起运 date + 8 大运 transitions via `lunar-javascript getYun(gender)`.
- `src/engine/golden-year.js` — synthesizes 6 timing layers (Liu Nian 40% + 12-shen 15% + Tai Sui 20% + Sui-Yun 10% + Da Yun god 15%); "truly golden" = Da Yun & Liu Nian both favorable, score ≥65.
- `src/engine/taisui.js` — `personalTaSui(birthZhi, yearZhi)`.
- `src/engine/{taohua,marriage-timing,marriage-stars,spouse-star,romance-deep,wealth-star,career-star}.js` — domain timing modules exist.
- `src/engine/{dayun-active,dayun-check,dayun-rank,dayun-changsheng,dayun-god}.js`, `liunian-pro.js`, `liunian-shen.js`, `liunian-12shen.js`, `liuyue.js`, `liuri.js` — full layered BaZi timing.
- `package.json` — `astronomy-engine ^2.1.19`, `lunar-javascript ^1.7.3`.

---

*Research dossier for the app "Bát Tự Dụng Thần". Both systems are symbolic timing frameworks
without scientific validation; this document describes their internal logic for cultural/educational
synthesis, not as factual prediction.*
