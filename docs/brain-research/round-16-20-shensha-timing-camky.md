# ROUND 16-20/50: Thần Sát + Timing + Cấm Kị Integration

## 1. THẦN SÁT NODES (~40 nodes)
### Key shensha as nodes (not just data — as REASONING nodes)
| Node | Type | Effect on graph |
|------|------|----------------|
| 天乙贵人 | cat_shensha | → adds "quý nhân" support to ANY node (boost confidence) |
| 桃花 | neutral_shensha | → links to marriage_node + personality_node |
| 驿马 | movement_shensha | → links to career_node (transfer/travel) + dayun (move) |
| 文昌 | education_shensha | → links to education_node (boost) |
| 将星 | power_shensha | → links to career_node (leadership) |
| 羊刃 | danger_shensha | → links to health_node (injury) + marriage (conflict) |
| 空亡 | void_shensha | → REDUCES confidence of any node it sits on (nullify) |
| 劫煞 | disaster_shensha | → links to wealth_node (loss) + health (sudden) |

### KEY: shensha don't OVERRIDE thập thần — they MODIFY confidence
- 天乙 on 正官 → 正官 conclusion +20% confidence
- 空亡 on 正财 → 正财 conclusion -50% confidence (voided)
- This is the WEIGHT system the user asked about

## 2. TIMING NODES (大运/流年 = TIME DIMENSION)
### Graph must have a TIME LAYER
```
Static layer (natal chart):
  nodes: 日主, thập thần, cách cục, lục thân (FIXED)

Time layer (dayun/liunian):
  nodes: 大运甲申(Mộc), 流年丙午(Hỏa)...
  
Cross-layer edges:
  大运 甲申 →MODIFIES→ 日主 (Mộc sinh Thủy = Dụng → thuận)
  大运 甲申 →MODIFIES→ career_node (Mộc = growth phase)
  流年 丙午 →MODIFIES→ marriage_node (午 = đào hoa → duyên)
```

### TIMING RULES (forward chaining)
```
FOR EACH đại vận:
  1. Compute: dayun wx vs Dụng thần → favorable/unfavorable
  2. Link: dayun →MODIFIES→ all domain nodes
  3. Rule: IF dayun = Dụng → ALL favorable conclusions get +confidence
  4. Rule: IF dayun = Kỵ → ALL conclusions get -confidence
  
FOR EACH lưu niên:
  1. Compute: liunian gan/chi interactions with natal
  2. Rule: IF liunian 冲 日支 → marriage stress year
  3. Rule: IF liunian 合 配偶 tinh → marriage opportunity year
```

### ZUN XIONG BEI JI (尊凶卑吉 — from 珞琭子)
```
IF đại vận = Kỵ (tôn HUNG) AND lưu niên = CÁT (bỉ cát)
  → "tôn hung bỉ cát, cứu liệu vô công" → year = BAD (đại vận dominates)

IF đại vận = Dụng (tôn CÁT) AND lưu niên = HUNG
  → "tôn cát bỉ hung, phùng tai tự dục" → year = OK (đại vận protects)
```

## 3. CẤM KỴ INTEGRATION (existing engines as REASONING plugins)
### Cấm kị engines feed INTO the brain as ADDITIONAL rule sets
```
Module NÃO:
  ├── Core Rules (thập thần + cách cục + ngũ hành)     → DEFAULT reasoning
  ├── Cấm Kị Plugin: 兰台 patterns                     → 古法 nạp âm layer
  ├── Cấm Kị Plugin: 盲派 金口诀                        → positional analysis
  ├── Cấm Kị Plugin: 皇极 值年卦                         → prophetic timing
  ├── Cấm Kị Plugin: 五运六気                            → health/disease timing
  └── Cấm Kị Plugin: 称骨                               → fate baseline
```

Each plugin:
1. Takes the SAME facts (from chart analysis)
2. Adds ADDITIONAL conclusions (as inferred events)
3. The brain MERGES all conclusions → multi-layer verdict

## 4. CONFLICT RESOLUTION (multiple schools → different conclusions)
```
IF Tử Bình says "hôn nhân ổn" AND 盲派 says "hôn nhân khó":
  → brain reports BOTH with confidence + school label
  → "Tử Bình (85%): hôn nhân ổn. 盲派 (60%): cần cẩn thận."
  → NOT pick one → SHOW BOTH (user decides)
```

## 5. NEXT: Round 21-30 — Graph builder design
How to: 4 pillars (干支) → facts → populate nodes → evaluate rules → output graph

## 6. REMAINING RESEARCH ROUNDS
| Rounds | Topic |
|--------|-------|
| 21-25 | Graph builder: chart → facts → nodes population |
| 26-30 | Query engine: question → subgraph extraction → relevant rules |
| 31-35 | Output format: graph → AI-readable structured text |
| 36-40 | Plugin system: how cấm kị engines plug in |
| 41-45 | Rule library: complete rule catalog (count + format) |
| 46-50 | Implementation plan: file structure + dependencies + build |
