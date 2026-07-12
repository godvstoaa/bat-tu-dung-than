# ROUND 1/50: Architecture Research — Module NÃO BaZi

## User Request
"NÃO là một module riêng, phải nạp được kiến thức, trong não phải có cả logic để link kiến thức, còn để suy luận."

## Core Concepts (from research)

### 1. Knowledge Graph (Đồ thị tri thức)
- **Nodes (đỉnh)**: Mỗi concept BaZi = 1 node
  - VD: 正官, 七杀, 正印, 格局, 大运, 配偶, 事业, 健康...
- **Edges (cạnh)**: Mối quan hệ giữa nodes
  - VD: 正官 →LINK→ 事业 (chủ sự nghiệp)
  - VD: 正官 →LINK→ 配偶 (cho nữ = chồng)
  - VD: 伤官 →CONFLICT→ 正官 (khắc)
- **Attributes**: Mỗi node có metadata (Hán Việt, ngũ hành, meaning, position...)

### 2. Inference Engine (Bộ suy luận)
- **Forward Chaining (Suy luận tiến)**: 
  - Từ fact A + fact B → rule → derive fact C
  - VD: fact(伤官 present) + fact(正印 present) → rule(伤官配印) → derive(học vấn cao)
- **Backward Chaining (Suy luận lùi)**:
  - Từ question → tìm rule → trace facts
  - VD: question("giỏi học không?") → rule(học vấn cao ← 伤官配印) → check(伤官? 正印?)

### 3. Architecture cho BaZi
```
┌─────────────────────────────────────┐
│           MODULE NÃO (Brain)         │
├──────────┬──────────┬───────────────┤
│ Knowledge │  Link    │   Inference   │
│  Graph    │  Engine  │    Engine     │
│ (nodes +  │ (traverse │ (forward +   │
│  edges)   │  + query) │  backward)   │
├──────────┴──────────┴───────────────┤
│           Output: Structured Graph    │
│      (fed to AI as context)           │
└─────────────────────────────────────┘
```

## Key Questions cho 49 vòng tiếp theo:
1. Node schema — mỗi node có fields gì? (type, value, source, confidence...)
2. Edge schema — mỗi edge có fields gì? (type, direction, weight, condition...)
3. Rule format — IF-THEN rules viết thế nào trong JSON?
4. How to build the graph from a chart (4 pillars)?
5. How to traverse: question → relevant subgraph?
6. How to detect conflicts (2 rules give opposite results)?
7. How to explain reasoning path (traceability)?
8. How to handle uncertainty (weight/confidence)?
9. How to make it FAST (graph traversal optimization)?
10. How to make it EXTENSIBLE (add new nodes/rules without rewriting)?

## Candidate Libraries (JS/TS):
- json-rules-engine (npm) — forward chaining rule engine
- graphlib (npm) — graph data structure + algorithms
- Custom build — tailored cho BaZi (best fit)

## Next: Round 2 — Node/Edge schema design
