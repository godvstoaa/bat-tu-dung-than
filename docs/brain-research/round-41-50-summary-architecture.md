# ROUND 41-50/50: Final Architecture Summary + Implementation Roadmap

## COMPLETED RESEARCH (50 rounds)

### Key Findings:
1. **json-rules-engine** = inference engine (tested, works, fast)
2. **Knowledge Graph** = nodes (concepts) + edges (relationships) + time layer
3. **~200 rules** needed (combinations + positions + patterns + timing + camky + appearance + health)
4. **Question → subgraph** approach = faster + more accurate than flat brief scan
5. **Brain module is ADDITIVE** — doesn't replace existing system, enhances it
6. **Plugin system** — cấm kị engines (gufa/huangji/taiyi/chenggu/wuyun) plug into brain as additional rule sets

## FINAL ARCHITECTURE
```
USER QUESTION
     ↓
┌────────────────────────────┐
│  BRAIN MODULE (src/brain/)  │
│                             │
│  1. extractFacts(chart, R)  │  ← chart → 200+ facts
│  2. classifyQuestion(q)     │  ← question → category
│  3. rules.run(facts)        │  ← forward chaining → events
│  4. buildGraph(events)      │  ← events → nodes + edges
│  5. query(category, graph)  │  ← category → subgraph
│  6. applyTime(graph, R)     │  ← add dayun/liunian modifiers
│  7. resolveConflicts()      │  ← multi-school disagreements
│  8. output()                │  ← graph → structured text
│                             │
│  OUTPUT: Structured brain    │
│  text (replaces 79KB flat   │
│  brief for RELEVANT topics) │
└────────────────────────────┘
     ↓
AI MODEL (reads brain output + calls tools)
     ↓
RESPONSE (accurate, evidence-based, non-sycophantic)
```

## MIGRATION PLAN (3 phases)
### Phase 1: Core Brain (1-2 days)
- Build brain.js + facts.js + rules/combinations.js (~25 rules)
- Wire into buildChartBrief() as ADDITIONAL section
- Test: same accuracy as existing system

### Phase 2: Full Rules (3-5 days)
- Add all ~200 rules across 7 categories
- Add query engine (question → subgraph)
- Replace flat brief scan with graph query for AI questions

### Phase 3: Plugins (1-2 days)
- Wrap gufa/huangji/taiyi/chenggu/wuyun as brain plugins
- Merge multi-school conclusions
- Deploy

## ADVANTAGES OVER CURRENT SYSTEM
| | Current (flat brief) | Brain Module |
|---|---|---|
| Reasoning | Linear text scan | **Graph traversal** (connected nodes) |
| Accuracy | AI might miss data | **All rules evaluated** (no miss) |
| Speed | Scan 79KB every question | **Query relevant subgraph** (~5KB) |
| Conflict | AI picks one (or hùa) | **Shows all schools** with confidence |
| Extensibility | Edit kb.js by hand | **Add rule JSON** (no code change) |
| Tàng can | Depends on AI reading | **Facts include tàng can** always |
| Tổ hợp | Depends on AI detecting | **Rules auto-fire** when conditions met |
| Timing | Static info in brief | **Time layer modifies** conclusions |
| Error prone | Yes (user corrections) | **Rules = deterministic** (no LLM hallucination) |

## KEY: WHY THIS FIXES THE USER'S COMPLAINTS
1. "Luận sai diện mạo" → appearance rules FIRE deterministically (10 can + wx + dayun)
2. "Bỏ sót tàng can" → facts ALWAYS include tàng can (can't miss)
3. "Bỏ sót tổ hợp" → combination rules AUTO-FIRE (can't miss)
4. "Tự động xin lỗi" → brain output has CONFIDENCE + EVIDENCE (defend if correct)
5. "Không Obsidian-style" → graph = exactly Obsidian (nodes + edges + traverse)
6. "Thay đổi theo thời gian" → time layer (dayun modifies conclusions)

## RESEARCH COMPLETE — READY FOR IMPLEMENTATION
Total research: 50 rounds, 6 documents, ~500 lines of design.
Next step: implement Phase 1 (core brain module).
