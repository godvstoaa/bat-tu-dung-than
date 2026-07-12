# ROUND 2/50: Rule Engine Test — json-rules-engine WORKS

## Test Result
- **json-rules-engine** (npm): ✅ HOẠT ĐỘNG với BaZi rules
- Forward chaining: facts → rules → events (derived conclusions)
- Priority system: rules có priority (90 = cao hơn 80)
- Failure tracking: shows WHICH rules didn't fire (useful for debugging)
- Async: engine.run() is async (works in Cloudflare Workers)

## Architecture Decision
**json-rules-engine** = inference engine cho module NÃO.
**Custom graph** = knowledge base (nodes + edges).
**Combined** = complete reasoning system.

## Demo Output (chart 1990 庚金):
```
FIRED: 杀印相生 (七杀+正印 → quyền lực+học vấn)
FIRED: 官煞混杂 (正官+七杀 → hôn nhân bất ổn)
NOT FIRED: 伤官配印 (no 伤官 in chart)
```

## Key Features for BaZi Brain:
1. Facts = chart data (hasShangGuan, hasZhengYin, dayMaster, strength...)
2. Rules = BaZi inference rules (IF-THEN combinations)
3. Events = derived conclusions (học vấn cao, quyền lực, hôn nhân bất ổn)
4. Priority = rule importance (格局 rules > general rules)
5. Multi-step = one event can become a fact for another rule (forward chaining chain)

## Next: Round 3 — Node schema design (knowledge graph structure)
