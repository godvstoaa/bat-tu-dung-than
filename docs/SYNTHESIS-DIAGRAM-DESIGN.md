# Sơ Đồ Tổng Hợp · 綜合圖命 — Synthesis Diagram Design

> Feature design doc: a "Sơ Đồ Tổng Hợp" (synthesis diagram) that maps **ONE person's BaZi chart ⟷ Western natal chart** together, intuitively, on one screen.
> Status: **design / research only**. No source code is modified by this doc.
> Audience: implementer of the new card + (future) `western-synthesis.js` engine.

---

## 0. TL;DR — Recommendation

| | Pattern | Verdict |
|---|---|---|
| **PRIMARY** | **Dimension-Bridge Cards** (candidate C, with A's connector) — vertical stack of life-dimension rows: `[BaZi chip] ⟷ [đối chiếu verdict] ⟷ [Western chip]` | Best for mobile, non-experts, vanilla JS, dark-gold theme. Reuses existing `.verdict` / `.v-box` / `.chip` CSS. |
| **ALTERNATIVE** | **Dual-Ring Emblem** hero (lightweight D/B) — one small decorative crest at the top of the card: BaZi inner ring + Western zodiac outer ring, purely as a "summary crest". The dimension-bridge cards sit below it. | Use when you want the "wow wheel" without the readability penalty of a true bi-wheel. Decorative only. |

**Rejected:** true astrology **bi-wheel (D)** and **quantitative radar (B)** — see §3. Both are expert-gaze, mobile-hostile, and force a fake 1:1 mapping the codebase explicitly warns against.

---

## 1. Research findings

### 1a. How comparative-astrology apps present two systems

- **Bi-wheel is the Western standard** for comparing two charts (synastry/transit): inner wheel = chart A, outer wheel = chart B, aspect lines drawn across the centre. References: [Astro-Seek bi-wheel customizer](https://horoscopes.astro-seek.com/bi-wheel-chart-customizer), [Astrotheme synastry](https://www.astrotheme.com/astrological_synastry_chart.php), [Astro-Charts synastry](https://astro-charts.com/tools/new/synastry/). It is **powerful for experts, opaque to everyone else**.
- **Cosmic Fusion** ([Google Play](https://play.google.com/store/apps/details?id=app.cosmicfusion.cosmicfusion_app)) is the rare app that *combines* Chinese + Western. It does **not** use a bi-wheel — it uses **combinations/combinations-list** (700+ personality blends), i.e. a **chip/list presentation**, not a wheel. This is strong evidence that the market pattern for *cross-system* (not same-system) comparison is **list/chip based**, not wheel based.
- Community preference ([Reddit r/astrology](https://www.reddit.com/r/astrology/comments/apgrlf/biwheel_charts_synastry_transits_what_is_your/)): even among astrology users, **side-by-side** planet lists are often preferred over overlaid wheels for *spotting correspondences quickly*.

**Takeaway for us:** the bi-wheel is the right pattern *within one astrological tradition*. For **two different traditions** (BaZi vs Western) where the concepts don't map 1:1, a **paired list / dimension-bridge** is the honest, readable choice.

### 1b. Mobile data-viz research

- The **two-column-with-bridge-lines** pattern has recognised names: **dumbbell chart** and **slope chart** — used for pairing two qualitative/quantitative states per row ([Zebra BI variance charts](https://help.zebrabi.com/kb/power-bi/overview-of-chart-types-in-the-zebra-bi-charts-visual/), Power BI community). It is one of the most mobile-tolerant comparison forms because it reads top-to-bottom.
- **Radar/spider charts fail on phones** for non-experts: poor area perception, illegible labels, misleading shape comparison. See [Observable – Why You Should Avoid Radar Charts](https://observablehq.com/blog/avoid-radar-charts), [Peltier Tech – Radar Plots](https://peltiertech.com/radar-plots/), [Highcharts – Radar Chart: when they fail](https://www.highcharts.com/blog/tutorials/radar-chart-explained-when-they-work-when-they-fail-and-how-to-use-them-right/), and the smartphone-specific study [Evaluating Design Features that Enhance Radar Chart Comprehension on Smartphones (AASMR)](https://www.aasmr.org/jsms/Vol14/No.7/Vol.14.No.7.31.pdf).
- Mobile dataviz guidance ([Visual Cinnamon – mobile vs desktop dataviz](https://www.visualcinnamon.com/2019/04/mobile-vs-desktop-dataviz/), [Boundev – mobile dataviz design guide](https://www.boundev.ai/blog/mobile-data-visualization-design-guide)) recommends **stacking + small-multiples** over dense single-canvas charts on phones.

**Takeaway for us:** avoid radar (B) and dense bi-wheel (D) as the *primary* interface. Use a **stacked, row-wise** layout.

---

## 2. Existing app context (do not re-invent)

The implementer must build on these — they are the canonical vocabularies already in the codebase.

- **Life-dimension canon = `src/engine/life-reading.js`** — 7 sections (人生总论). This is the row axis for the diagram (see §5).
- **BaZi↔Western correspondence = `BAZI_WESTERN_MAP` in `src/engine/western-kb.js` (lines 366–389).** It is deliberately **non-1:1 and hedged** ("tương đương chừng, không phải tương đương 1-1"). Reuse it verbatim; do not invent a new mapping.
- **Western data source = `computeWesternChart(date, lat, lng)` in `src/engine/western-astro.js`** — returns Big Three (sun/moon/ascendant), 10 planets, angles (ASC + MC), 12 Whole-Sign houses with `HOUSE_THEMES`, 6 aspects, `elementBalance {Hỏa,Thổ,Khí,Thủy}`, `summary.bigThree`.
- **Per-row verdict template = `src/engine/destiny-consensus.js`** ("Tổng Hợp Đồng Thuận"). Its output shape — per-system `tone` (`cat`/`hung`/`trung`) + `agreement` ratio + narrative `verdict` — is the **exact structure** each dimension row's "đối chiếu" line should mimic. (Note: that consensus today covers BaZi/chenggu/hexagram/liudao — **Western is not yet folded in**. Folding it in is the natural follow-up to this UI.)
- **The gap:** there is **no engine-level BaZi+Western synthesis** today. Western lives as one standalone card (`index.html` 1206–1217, `#western`) + an AI tool (`ai.js` 1585–1608). This diagram is the UI for a future `western-synthesis.js`.

### Visual tokens to reuse (from `src/style.css`)
- Colour: `--gold` `#c9a84c`, `--gold-bright` `#e8d28a`, `--gold-pale` `#f3e6c0`, `--gold-soft`, `--cinnabar` (seal red), `--surface-1`/`--surface-2`, `--silk`/`--silk-muted`/`--silk-dim` (text).
- Fonts: `'Noto Serif SC'` (Hán-Nôm), `'Ma Shan Zheng'` (seals), `'Be Vietnam Pro'` (body VI).
- **Ready-made layout primitives:**
  - `.verdict { display:grid; grid-template-columns: 1fr 1fr; gap:14px }` — **the two-column bridge already exists.**
  - `.v-box` (sub-surface cell with `.v-label` + `.v-value`) — one per side of the bridge.
  - `.v-box.full { grid-column: 1 / -1 }` — **full-width spanning cell = the synthesis verdict line.**
  - `.chip` / `.elem-pill` — small pills for element / sign / animal tags.
  - `.synthesis-card` card variant (with 印 seal watermark) — the host card class.
  - `.hero-mandala` / `.bagua-ring` (index.html 62–72) — reusable for the alternative emblem.

---

## 3. Candidate evaluation

| | Pattern | Intuitive for non-expert VI users? | Mobile-first? | Vanilla HTML/CSS/SVG, no libs? | Respects non-1:1 mapping? | Verdict |
|---|---|---|---|---|---|---|
| **A** | Two-column bridge (dumbbell) | ✅ high | ✅ stacks vertically | ✅ CSS grid + thin SVG | ✅ | ✅ Folded into PRIMARY |
| **B** | Radial / radar wheel | ❌ fails on phones, fake-quantitative | ❌ label-legibility poor | ⚠ needs SVG trig | ❌ forces shared axes | ❌ Reject |
| **C** | Dimension-row cards | ✅ highest | ✅ pure vertical stack | ✅ trivial | ✅ | ✅ **PRIMARY** (merged with A) |
| **D** | Bi-wheel (two concentric natal wheels) | ❌ expert-gaze only | ❌ needs ≥400px square | ⚠ heavy SVG | ❌ implies BaZi-12-palaces ≡ Western-12-houses (false) | ❌ Reject as *primary*; reuse flavour as ALTERNATIVE emblem |

**Why C+A wins:** every other card in this app is a vertical stack of `.card` blocks. A dimension-bridge card is **the same shape** the user already knows. Each row answers *one* life question in plain Vietnamese, with a one-line "đối chiếu" verdict. No expert wheel-reading, no fake shared axes, no heavy SVG.

**Why B/D lose:** B (radar) is empirically bad on phones and would require inventing a 0–100 score for both systems on shared axes — manufacturing false precision. D (bi-wheel) is the *within-tradition* comparison tool; laying BaZi's 12 palaces under Western's 12 houses implies an equivalence the codebase (`western-kb.js` 379–388 `COMPARISON_NOTES`) explicitly denies.

---

## 4. PRIMARY layout — Dimension-Bridge Cards

### 4a. Mockup (mobile, single column)

```
┌──────────────────────────────────────────────────────┐
│  Sơ Đồ Tổng Hợp  ·  綜合圖命           印            │
│  BaZi 八字  ⟷  Western ♈  ·  đối chiếu 1 người        │
├──────────────────────────────────────────────────────┤
│                                                       │
│  🌟 BẢN MỆNH CỐT LÕI   本命                           │
│  ┌─────────────────┐    ⟷    ┌─────────────────┐     │
│  │ 日主  Giáp · Mộc │         │ ☉  Taurus  ♉    │     │
│  │ Dụng Thần: Hỏa  │         │ nguyên tố: Thổ  │     │
│  │ (Dương, vượng)  │         │ (Sun in Taurus) │     │
│  └─────────────────┘         └─────────────────┘     │
│  ▸ Đối chiếu:  ⚖ BỔ SUNG — Nhật Chủ Mộc cần Hỏa,     │
│    Sun Thổ dưỡng Mộc → hai hệ cùng chỉ «cần ấm/sáng». │
├──────────────────────────────────────────────────────┤
│  💼 SỰ NGHIỆP & TÀI LỘC   事業財祿                    │
│  ┌─────────────────┐    ⟷    ┌─────────────────┐     │
│  │ sao Quan: Thủy  │         │ MC  ♑ Capricorn │     │
│  │ cách: Thực chế  │         │ H10 Sự nghiệp   │     │
│  │ Sát             │         │ (Saturn mạnh)   │     │
│  └─────────────────┘         └─────────────────┘     │
│  ▸ Đối chiếu:  🟢 ĐỒNG HƯỚNG — BaZi «kỷ luật/Quan     │
│    thuỷ trị Sát» ↔ Western «Saturn/MC kỷ luật».        │
├──────────────────────────────────────────────────────┤
│  💕 TÌNH DUYÊN & GIA ĐẠO   情緣家道                    │
│  ┌─────────────────┐    ⟷    ┌─────────────────┐     │
│  │ phối ngẫu: Thổ  │         │ ♀  Venus ♎ Libra│     │
│  │ (Nam = sao Tài) │         │ H7 Hôn nhân     │     │
│  │ Nhật Chi yên ổn │         │ (Moon ♋ Cancer) │     │
│  └─────────────────┘         └─────────────────┘     │
│  ▸ Đối chiếu:  🟢 CẢI THIỆN — cả hai đều chỉ hôn      │
│    nhân ổn, thiên chăm sóc.                            │
├──────────────────────────────────────────────────────┤
│  🏥 SỨC KHOẺ   健康    (… same shape …)               │
│  ⏰ VẬN HẠN & THỜI ĐIỂM   運限   (… …)                 │
│  🔑 CẢI VẬN   改運   (… …)                              │
├──────────────────────────────────────────────────────┤
│  ⚠ Lưu ý: BaZi & Western là hai hệ khác cơ sở — xem   │
│    «đối chiếu» là tham khảo, không phải tương đương   │
│    1-1. (了凡四训: đức mới là cốt lõi.)                 │
└──────────────────────────────────────────────────────┘
```

**Responsive behaviour:** at ≥640px the two chips share one row inside the existing `.verdict` 2-col grid; at <640px (mobile) the grid collapses to a single column and the `⟷` connector rotates to a vertical `⇅` (pure CSS, no JS). The `▸ Đối chiếu` verdict line always spans full width via `.v-box.full`.

### 4b. Why it's intuitive + mobile-friendly
- **One question per row.** Each row is a life area the user already meets elsewhere in the app (Bản mệnh / Sự nghiệp / Tình duyên / Sức khoẻ…). Zero new mental model.
- **Plain Vietnamese verdict, colour-coded.** The `▸ Đối chiếu` line borrows the consensus `tone` palette already used by `destiny-consensus.js`:
  - 🟢 `cat` — two systems agree / reinforce.
  - 🔴 `hung` — two systems flag the same risk.
  - 🟡 `trung` / ⚖ — divergent or complementary (the honest default for cross-tradition).
- **No expert wheel-reading.** Chips show the *answer* (e.g. "sao Quan: Thủy", "MC ♑"), not the raw chart the user must decode.
- **Stacks like every other card** — fits the existing `.card`-based scroll, the quick-nav, the card-search filter, and print/PDF.
- **Honest about the gap.** A footer caveat + per-row `trung` default prevent overclaiming a 1:1 mapping (honouring `western-kb.js` `COMPARISON_NOTES`).

### 4c. Implementation notes (vanilla HTML/CSS/SVG, no new libs)

**Host card** — add one section to `index.html`, sibling of the existing `#western` card:
```html
<section class="card synthesis-card" id="synthesis-diagram-card">
  <h3 class="card-title">Sơ Đồ Tổng Hợp <span class="zh">綜合圖命</span>
    <span class="hint-inline">(BaZi ⟷ Western · đối chiếu 1 người)</span></h3>
  <div id="synthesis-diagram"></div>
  <p class="hint" id="synthesis-caveat"></p>
</section>
```

**Row template** (rendered by JS into `#synthesis-diagram`) — reuses existing classes:
```html
<div class="syn-dim">
  <div class="syn-dim-title">🌟 Bản mệnh cốt lõi <span class="zh">本命</span></div>
  <div class="verdict">                 <!-- existing 1fr 1fr grid -->
    <div class="v-box syn-side bazi">   <!-- left chip -->
      <div class="v-label">BaZi 八字</div>
      <div class="v-value">日主 Giáp · Mộc</div>
      <div class="chip">Dụng: Hỏa</div>
    </div>
    <div class="v-box syn-side west">   <!-- right chip -->
      <div class="v-label">Western ♈</div>
      <div class="v-value">☉ Taurus ♉</div>
      <div class="chip">nguyên tố: Thổ</div>
    </div>
    <div class="v-box full syn-verdict trung"><!-- full-width verdict -->
      <span class="syn-glyph">⚖</span>
      <b>Đối chiếu:</b> BỔ SUNG — …one sentence…
    </div>
  </div>
</div>
```

**Minimal new CSS** (append to `src/style.css`, all tokens already defined):
```css
.syn-dim { margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid rgba(212,175,55,0.10); }
.syn-dim:last-child { border-bottom: 0; }
.syn-dim-title { font-size: 14px; font-weight: 600; color: var(--gold-pale); margin: 0 0 10px; letter-spacing:.2px; }
.syn-dim-title .zh { color: var(--gold); font-weight: 500; margin-left: 4px; }
.syn-side { position: relative; }
.syn-side.bazi::before, .syn-side.west::before { /* faint system tag */
  content: '八'; position:absolute; top:8px; right:10px; opacity:.10;
  font-family:'Ma Shan Zheng',serif; color:var(--gold); font-size:18px;
}
.syn-side.west::before { content: '☉'; }
.syn-verdict { display:flex; gap:8px; align-items:baseline; font-size:13px;
  color: var(--silk-dim); border-left: 3px solid var(--gold); padding:8px 12px;
  background: var(--gold-soft); border-radius: 0 4px 4px 0; }
.syn-verdict.cat  { border-left-color: #2a9e6b; background: rgba(42,158,107,.10); }
.syn-verdict.hung { border-left-color: var(--cinnabar); background: rgba(192,57,43,.10); }
.syn-verdict.trung{ border-left-color: var(--gold); }
.syn-glyph { font-size: 15px; }
/* On mobile, stack the two chips; the grid already does this at <640px via existing media rules. */
```
> The `.verdict` grid, `.v-box`, `.v-box.full`, `.chip`, colour tokens and seal fonts **already exist** — the only new CSS above is the row wrapper, the faint system watermark, and the verdict colour modifiers.

**Optional SVG connector** (the `⟷`): a 24×24 inline SVG with a double-arrow stroke in `var(--gold-bright)`, centred between the two `.v-box` cells via `position:absolute` on ≥640px; hidden on mobile (the stack makes it implicit). Keeps the "bridge" metaphor of candidate A without a heavy charting lib.

**Data wiring** (future `src/engine/western-synthesis.js`):
```js
// returns [{ dim, bazi:{label, chips[]}, west:{label, chips[]}, verdict, tone }]
export function westernSynthesis(R, W /* = computeWesternChart(...) */) { … }
```
- Pull BaZi side from existing fields: `R.chart.dayMaster`, `R.yong`, `R.pattern`, `analyzeCareerStar(R)`, `analyzeWealthStar(R)`, `R.interactions`, `R.wx`.
- Pull Western side from `W.sun`, `W.moon`, `W.ascendant`, `W.midheaven`, `W.houses`, `W.elementBalance`.
- Derive `verdict`/`tone` per row using the **`BAZI_WESTERN_MAP`** correspondence + a small rule set. Default `tone='trung'` (the honest cross-tradition default); only escalate to `cat`/`hung` when both systems independently point the same way (mirror `destiny-consensus.js`'s agreement logic).
- Render via a small `renderSynthesisDiagram(R, W)` in `main.js`, called right after the existing `#western` render (`main.js` ~3532).

---

## 5. Life-dimension rows (the row axis)

Consistent with `life-reading.js` (the app's canon) and `BAZI_WESTERN_MAP` (the correspondence). **Show 6 rows** (drop the meta "Tổng luận mệnh/grade" row — it has no Western analogue and is already covered by `destiny-consensus.js`):

| # | Row (VI) | Hán-Nôm | BaZi source field | Western mapped field | Correspondence note (from `BAZI_WESTERN_MAP`) |
|---|---|---|---|---|---|
| 1 | Bản mệnh cốt lõi | 本命 / 日主 | `dayMaster` (gan+wx+vi), `yong.primary` | `sun` (sign+element), `elementBalance` | 日主 ≈ Sun (core self). Dụng Thần has **no direct** Western equiv → use element balance. |
| 2 | Sự nghiệp & Tài lộc | 事業財祿 | `analyzeCareerStar(R)` (sao Quan, `patternCareer`), `analyzeWealthStar(R)` | `midheaven` (MC) sign + H10, Venus/Jupiter for wealth | Quan/cách cục ≈ MC/Saturn (discipline, career axis). |
| 3 | Tình duyên & Gia đạo | 情緣家道 | spouse palace (Nhật Chi),配偶 wx, `R.interactions.chong` | `venus` sign + H7, `moon` | 配偶 sao ≈ Venus/H7; Moon ≈ 正印/偏印 (nurturing) — hedged. |
| 4 | Sức khoẻ | 健康 | `R.wx` weakest/strongest, `analyzeHealth(R)` | `elementBalance` excess/deficient + H6 | Vượng suy ≈ element balance — **but Kim/Mộc vs Khí asymmetry applies (see caveat).** |
| 5 | Vận hạn & thời điểm | 運限 | best/worst 大运 (`R.dayun`), `yong.primary` as ruler | Saturn transit/return window, current progressions | 大运 (10y) ≈ Saturn cycle (~29.5y) — **different time frames**, present side-by-side, do not equate. |
| 6 | Cải vận (định hướng) | 改運 | `life-reading` §7 (direction/colour/career by Dụng) | Western remedy leaning (e.g. emphasise deficient element via lifestyle) | No direct equiv; synthesise lifestyle advice from both. |

> **Element caveat (load-bearing):** `western-kb.js` line 376/385 explicitly rejects a naïve Ngũ hành ↔ 4-elements 1:1 map — BaZi has Mộc/Kim (no Khí); Western has Khí (no split Kim/Mộc). Rows 1 & 4 must present the two element sets **side by side as different systems**, never as a merged 5-color bar. The verdict tone for element rows should default to `trung` (complementary), not `cat`.

---

## 6. ALTERNATIVE layout — Dual-Ring Emblem hero

Use as an **optional crest above** the dimension-bridge cards, when a single-glance "who is this person" visual is wanted. **Decorative, not the data interface.** This is the mobile-safe residue of candidates B/D.

### 6a. Mockup
```
              ♈  ♉  ♊   ← outer ring: 12 Western zodiac glyphs,
          ♋           ♋    Sun ☉ / Moon ☽ / ASC ↑ highlighted in --gold-bright
        ♌    ╭───────╮    ♌
       ♍    │  命  印  │    ♍   centre: --gold radial seal (reuse .seal)
        ♎    ╰───────╯    ♎      (日主 glyph + 十二宫 highlight)
          ♏           ♏
              ♐  ♑  ♒   ← inner ring: BaZi — either 5 element arcs
                              (coloured by --gold/--cinnabar/etc.) or the
                              4 pillar 天干地支 (年月日时) as 8 glyphs.
```
~180–220px square, centred, tappable → expands/scrolls to the dimension cards.

### 6b. Why it works as the *alternative*
- Reuses the **existing `.hero-mandala` / `.bagua-ring`** CSS pattern (index.html 62–72) — swap the 8 trigrams for 12 zodiac glyphs on the outer ring; keep the inner ring as elements/pillars.
- Pure CSS conic-gradient + absolutely-positioned glyph `<span>`s (the hero already does this with `--i` index vars). **No SVG trig required.**
- Gives the emotional "wheel" payoff without asking the user to *read* a wheel.
- Mobile-safe: it is small, static (or slow-rotating like the hero mandala), and non-interactive.

### 6c. When to choose it
Pick the **alternative (emblem + cards)** over the primary-only version if you want a stronger first-impression hero for the card (e.g. for screenshots/sharing). Otherwise ship the primary alone — it is fully sufficient.

---

## 7. Implementation roadmap (suggested, not executed here)

1. **Engine:** new `src/engine/western-synthesis.js` exporting `westernSynthesis(R, W)` → `[{dim, bazi, west, verdict, tone}]` using `BAZI_WESTERN_MAP`. Default tone `trung`.
2. **Wire into consensus (optional, larger):** add Western as a 5th system in `destiny-consensus.js` (currently bazi/chenggu/hexagram/liudao). Reuse its `agreement` + `verdict` shape.
3. **UI:** add `#synthesis-diagram-card` (§4c) right after `#western`; render via `renderSynthesisDiagram(R, W)` in `main.js`. Append the §4c CSS block.
4. **(Optional) Emblem:** add the §6 dual-ring crest above the rows, reusing `.hero-mandala` styles.
5. **Caveat:** always render the footer note (§4a bottom) citing `了凡四训` + `COMPARISON_NOTES` — keep the cross-tradition framing honest.

---

## 8. Sources

Comparative-astrology / bi-wheel: [Astro-Seek bi-wheel customizer](https://horoscopes.astro-seek.com/bi-wheel-chart-customizer), [Astrotheme synastry](https://www.astrotheme.com/astrological_synastry_chart.php), [Astro-Charts synastry](https://astro-charts.com/tools/new/synastry/), [Reddit r/astrology bi-wheel layout discussion](https://www.reddit.com/r/astrology/comments/apgrlf/biwheel_charts_synastry_transits_what_is_your/), [Cosmic Fusion (Chinese+Western app)](https://play.google.com/store/apps/details?id=app.cosmicfusion.cosmicfusion_app).
Mobile dataviz / comparison patterns: [Visual Cinnamon – mobile vs desktop](https://www.visualcinnamon.com/2019/04/mobile-vs-desktop-dataviz/), [Boundev – mobile dataviz design guide](https://www.boundev.ai/blog/mobile-data-visualization-design-guide), [Zebra BI variance/bridge charts](https://help.zebrabi.com/kb/power-bi/overview-of-chart-types-in-the-zebra-bi-charts-visual/).
Radar-on-mobile pitfalls: [Observable – Avoid Radar Charts](https://observablehq.com/blog/avoid-radar-charts), [Peltier Tech – Radar Plots](https://peltiertech.com/radar-plots/), [Highcharts – Radar Chart when they fail](https://www.highcharts.com/blog/tutorials/radar-chart-explained-when-they-work-when-they-fail-and-how-to-use-them-right/), [AASMR – Radar chart comprehension on smartphones](https://www.aasmr.org/jsms/Vol14/No.7/Vol.14.No.7.31.pdf).
