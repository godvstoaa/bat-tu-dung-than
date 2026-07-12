# ROUND 31-40/50: Rule Catalog + Implementation Plan

## 1. COMPLETE RULE CATALOG (~200 rules estimated)

### A. Combination Rules (10 thập thần × combinations = ~25 rules)
| # | Rule | Conditions | Event |
|---|------|-----------|-------|
| 1 | 伤官配印 | has_伤官 + has_正印 | education: cao |
| 2 | 杀印相生 | has_七杀 + has_正印 | career: leadership |
| 3 | 食制杀 | has_食神 + has_七杀 | career: technical |
| 4 | 财生官 | has_正财 + has_正官 | career+wealth: thuận |
| 5 | 官煞混杂 | has_正官 + has_七杀 | marriage: bất ổn |
| 6 | 比劫争财 | has_比肩/劫财 + has_正/偏财 | wealth: tranh |
| 7 | 枭夺食 | has_偏印 + has_食神 | health+career: bị èm |
| 8 | 财破印 | has_正财 + has_正印 | education: gián đoạn |
| 9 | 伤官见官 | has_伤官 + has_正官 (NO 正印) | career: đứt |
| 10 | 食神生财 | has_食神 + has_正/偏财 | wealth: phát |
| ... | (+ ~15 more combinations from PATTERN_CHENG_BAI, 组织, etc.) | | |

### B. Position Rules (~40 rules)
| # | Rule | Conditions | Event |
|---|------|-----------|-------|
| 11 | 年上伤官克父母 | 伤官 at year + no 解 | parents: khắc sớm |
| 12 | 年上正财祖业传 | 正财 at year | wealth: thừa kế |
| 13 | 月上偏官犯小人 | 七杀 at month | social: tiểu nhân |
| 14 | 日带正官功名扬 | 正官 at day | career: bản thân |
| 15 | 时上七杀一位真 | 七杀 at time + only 1 | children: quý |
| ... | (+ ~35 more from MANGPAI_KOUJUE 40 verses) | | |

### C. Pattern/Geju Rules (~30 rules)
| # | Rule | Conditions | Event |
|---|------|-----------|-------|
| 16 | 正官格成 | 月令=正官 + 财或印 + 无冲 | pattern: thanh |
| 17 | 正官格败 | 正官格 + 伤官 or 冲 | pattern: bại |
| 18 | 正官格救 | 正官格败 + 正印(制伤官) | pattern: cứu ứng |
| ... | (+ ~27 from PATTERN_CHENG_BAI × 8 cách) | | |

### D. Timing Rules (~30 rules)
| # | Rule | Conditions | Event |
|---|------|-----------|-------|
| 19 | 尊吉卑凶 | dayun=Dụng + liunian=Hung | timing: OK |
| 20 | 尊凶卑吉 | dayun=Kỵ + liunian=Cát | timing: KHÓ |
| 21 | 大运禄马同位 | dayun has 禄+马 | timing: phát |
| 22 | 流年冲日支 | liunian chi 冲 日支 | timing: biến động |
| ... | (+ ~26 timing rules from 三命通会 + 珞琭子) | | |

### E. 古法/Cấm Kị Rules (~50 rules)
| # | Rule | Conditions | Event |
|---|------|-----------|-------|
| 23 | 宝剑冲牛斗 | nayin 剑锋金 + 丑 | camky: quý |
| 24 | 脱体化神 | nayin base+trans same hành | camky: thành tựu |
| 25 | 一气为根 | 4 pillars same wx | camky: cực mạnh |
| ... | (+ ~47 from LANTAI_PATTERNS 48 + 兰台 specials) | | |

### F. Appearance/Personality Rules (~15 rules)
| # | Rule | Conditions | Event |
|---|------|-----------|-------|
| 26 | 金水相逢 | Kim+Thủy đều vượng | appearance: cực đẹp |
| 27 | 木火通明 | Mộc+Hỏa đều vượng | appearance: sáng+duyên |
| 28 | 土多皮肤差 | Thổ quá vượng | appearance: da sạm |
| ... | (+ ~12 from WX_APPEARANCE_MOD + BEAUTY_COMBOS) | | |

### G. Health Rules (~10 rules)
| # | Rule | Conditions | Event |
|---|------|-----------|-------|
| 29 | 木弱肝病 | wx 木 weakest | health: liver |
| 30 | 火弱心病 | wx 火 weakest | health: heart |
| ... | (+ ~8 organ-element rules + 5运6気) | | |

**TOTAL: ~200 rules** (khả thi — mỗi rule ~5 dòng JSON = 1000 dòng kb)

## 2. IMPLEMENTATION PLAN (Round 41-50)

### File Structure
```
src/brain/
  ├── brain.js          // Main module: exports think(question, chart, R)
  ├── facts.js          // extractFacts(chart, R) → facts[]
  ├── rules/            // Rule library (JSON files)
  │   ├── combinations.js  // ~25 thập thần combination rules
  │   ├── positions.js     // ~40 position rules (盲派金口诀)
  │   ├── patterns.js      // ~30 格局 thành/bại/cứu rules
  │   ├── timing.js        // ~30 đại vận/lưu niên rules
  │   ├── camky.js         // ~50 cấm kị rules (兰台/盲派/皇极)
  │   ├── appearance.js    // ~15 diện mạo rules
  │   └── health.js        // ~10 sức khỏe rules
  ├── nodes.js          // STATIC_NODES (always-present concept nodes)
  ├── edges.js          // STATIC_EDGES (always-present relationships)
  ├── query.js          // classifyQuestion + traverse subgraph
  ├── output.js         // graphToText (structured brain output for AI)
  └── plugins/          // Cấm kị engine integration
      ├── gufa-plugin.js    // Wraps gufa-engine as brain plugin
      ├── huangji-plugin.js // Wraps huangji-engine
      └── wuyun-plugin.js   // Wraps wuyun-liuqi
```

### Integration Point
```javascript
// In ai.js buildChartBrief():
import { think } from './brain/brain.js';

// After existing brief sections:
const brainOutput = think(userQuestion, chart, R);
brief += `\n--- NÃO (BRAIN GRAPH OUTPUT) ---\n${brainOutput}`;
```

### KEY: brain module is OPTIONAL + ADDITIVE
- If brain fails → brief still works (fallback to existing flat text)
- Brain adds STRUCTURED REASONING on top of existing data
- Brain doesn't REPLACE kb.js/ai.js — it ENHANCES them

## 3. PERFORMANCE CONSIDERATIONS
- ~200 rules × forward chaining = <100ms (json-rules-engine is fast)
- Graph traversal (2 hops) = <10ms
- Total brain overhead: <150ms per query
- Memory: ~200 rules × 5 lines = ~1KB (negligible)

## Next: Round 41-50 — Prototype implementation
