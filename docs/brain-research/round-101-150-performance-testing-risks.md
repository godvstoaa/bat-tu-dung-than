# ROUND 101-150/150: Performance + Testing + Risk Assessment + FINAL REVIEW

## EDGE CASE GROUP 12: PERFORMANCE & SCALABILITY

### 12.1: Rule count growth
```
Phase 1: ~50 rules → ~5ms evaluation
Phase 2: ~200 rules → ~20ms evaluation  
Phase 3: ~500 rules (if expanded) → ~50ms evaluation

→ Still <100ms even at 500 rules (json-rules-engine is efficient)
→ Cloudflare Worker limit: 30s CPU → no issue
```

### 12.2: Graph size vs memory
```
~200 nodes × ~500 bytes each = ~100KB (negligible)
~500 edges × ~200 bytes each = ~100KB
Total graph in memory: ~200KB → fine for browser + Worker
```

### 12.3: Concurrent evaluation
```
IF multiple users ask simultaneously:
→ Each gets their OWN facts → their OWN graph → no interference
→ Brain module is STATELESS (pure function: input → output)
→ Safe for Cloudflare Workers (stateless by design)
```

### 12.4: Large chat history
```
IF user asks 50 questions in one session:
→ Each question = NEW brain evaluation (stateless)
→ No graph accumulation → no memory growth
→ BUT: brain should remember previous conclusions (context)
→ Solution: pass previous brain outputs as "prior_knowledge" facts
```

## EDGE CASE GROUP 13: TESTING & VALIDATION

### 13.1: How to validate brain output?
```
For each known chart with KNOWN life outcomes:
1. Run brain → get conclusions
2. Compare with reality (career path, marriage, health)
3. If mismatch → add/refine rule
4. Build "test suite" of 100+ verified charts
```

### 13.2: Self-test cases
```
Test 1: Standard chart (nghiệp bình thường) → brain fires standard rules
Test 2: 从格 chart → brain OVERRIDES standard rules
Test 3: All-clashed chart → brain REDUCES confidence
Test 4: Missing birth time → brain SKIPS time-pillar rules
Test 5: Female chart → brain USES female-specific marriage rules
Test 6: Borderline birth time → brain TRIES BOTH
Test 7: Extreme strong chart → brain DETECTS 专旺
Test 8: 化气格 → brain RECALCULATES thập thần
```

### 13.3: Regression testing
```
Each time a rule is added/modified:
1. Run full test suite (100+ charts)
2. Compare output BEFORE vs AFTER
3. If any chart's conclusion CHANGED unexpectedly → investigate
4. If change is INTENTIONAL → update expected output
```

## EDGE CASE GROUP 14: RISK ASSESSMENT

### 14.1: Top 10 RISKS (ranked)
| # | Risk | Probability | Impact | Mitigation |
|---|------|------------|--------|------------|
| 1 | Wrong thập thần calculation (化气格 missed) | Medium | Critical | Auto-detect 化气 + recalculate |
| 2 | Tàng can priority wrong (本气 vs 余气) | Low | Medium | Weight system (100/70/50%) |
| 3 | Dayun direction reversed | Low | Critical | Auto-verify: 阳+male=顺, 阴+male=逆 |
| 4 | 从格 not detected (normal rules fire incorrectly) | Medium | High | 优先 check 从格 BEFORE other rules |
| 5 | 空亡 incorrectly voiding good stars | Medium | Medium | 空亡 = -40% not 100% void |
| 6 | 调候 override missed (寒命 not detected) | Low | High | Check 月令 season → auto-detect 寒/暖 |
| 7 | Gender-specific rules applied wrong | Low | High | Facts MUST include gender field |
| 8 | Confidence too high → overconfident answer | Medium | Medium | Cap at 90% (never 100%) |
| 9 | Circular rule dependency → infinite loop | Low | Critical | json-rules-engine runs once + max 3 passes |
| 10 | Multi-school conflict → confusing output | High | Low | Show both with labels (not hide) |

### 14.2: Failure mode: brain crashes
```
IF brain module throws error:
  → CATCH in ai.js → fallback to existing flat brief
  → Log error to KV (err: category)
  → AI still works (just without brain enhancement)
  → User doesn't notice crash (graceful degradation)
```

### 14.3: Failure mode: AI ignores brain output
```
IF AI model doesn't use brain output:
  → Brain output is in the brief (same as other sections)
  → SYSTEM_PROMPT section 19 (Obsidian framework) directs AI to use it
  → If AI STILL ignores → same problem as current (not brain-specific)
  → Brain doesn't make this WORSE
```

## EDGE CASE GROUP 15: EXPANDABILITY

### 15.1: Adding new rules (no code change)
```
New rule = JSON file → add to rules/ directory → brain auto-loads
No need to edit brain.js or ai.js
Example: new 兰台 pattern discovered → add JSON rule → brain fires it
```

### 15.2: Adding new node types
```
New domain (e.g., "pets", "legal") → add nodes + edges + tag →
brain query engine auto-includes if question matches tag
```

### 15.3: Plugin system for cấm kị engines
```
Each cấm kị engine (gufa/huangji/etc.) can:
1. Register as brain plugin
2. Provide ADDITIONAL facts (beyond standard chart analysis)
3. Provide ADDITIONAL rules (beyond standard 200)
4. Brain merges ALL facts + ALL rules → unified output
```

## FINAL SUMMARY: 150 rounds of research

### Total edge cases cataloged: 15 groups × ~5 cases = ~75 edge cases
### Total rules estimated: ~200-500 (expandable)
### Total nodes: ~172 (expandable)
### Key risks: 10 (ranked + mitigated)
### Testing strategy: 8+ test cases + 100 chart validation

### READY FOR IMPLEMENTATION after 150 rounds of research.

## MIGRATION SAFETY
- Phase 1: brain.js as ADDITIVE (doesn't break existing)
- Phase 2: brain query replaces flat brief for TARGETED questions (overview still uses flat)
- Phase 3: brain plugins merge cấm kị engines
- EACH PHASE: build + test + deploy independently
- ROLLBACK: just comment out `import { think } from './brain/brain.js'` → back to flat brief

## RESEARCH COMPLETE — 150/150 ROUNDS
