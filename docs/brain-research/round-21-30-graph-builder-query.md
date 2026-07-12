# ROUND 21-30/50: Graph Builder + Query Engine Design

## 1. GRAPH BUILDER (chart → populated graph)

### Step 1: Extract Facts from 4 Pillars
```javascript
// Input: chart = { pillars: { year, month, day, time } }
// Output: facts[] = array of { fact, value, source }

function extractFacts(chart) {
  const facts = [];
  // For each pillar position
  for (const [pos, pillar] of Object.entries(chart.pillars)) {
    // Main stem god
    if (pillar.ganGod && pillar.ganGod !== '日主') {
      facts.push({ fact: `has_${pillar.ganGod}`, value: true, source: `${pos}_gan_${pillar.gan}` });
      facts.push({ fact: `${pillar.ganGod}_position`, value: pos, source: `${pos}_gan` });
    }
    // Hidden stem gods (TÀNG CAN!)
    for (const hidden of pillar.hidden || []) {
      if (hidden.god && hidden.god !== '日主') {
        facts.push({ fact: `has_${hidden.god}`, value: true, source: `${pos}_tang_${hidden.gan}` });
        facts.push({ fact: `${hidden.god}_tang_at`, value: pos, source: `${pos}_tang` });
      }
    }
    // Branch
    facts.push({ fact: `branch_at_${pos}`, value: pillar.zhi, source: `${pos}_zhi` });
    // Nayin
    facts.push({ fact: `nayin_${pillar.nayin}`, value: true, source: `${pos}_nayin` });
  }
  // Day master
  facts.push({ fact: 'day_master', value: chart.dayMaster.gan });
  facts.push({ fact: 'day_master_wx', value: ganToWx(chart.dayMaster.gan) });
  // Strength
  facts.push({ fact: 'is_strong', value: R.strength?.strong || false });
  // Yongshen
  facts.push({ fact: 'yongshen_wx', value: R.yong?.primary || '' });
  return facts;
}
```

### Step 2: Evaluate Rules (forward chaining)
```javascript
// json-rules-engine processes facts → fires matching rules → events
const { results } = await brainEngine.run(facts);
// Each event = a DERIVED conclusion (e.g., "伤官配印 → học vấn cao")
```

### Step 3: Build Graph (nodes + edges)
```javascript
// Start with STATIC nodes (always exist)
const nodes = [...STATIC_NODES]; // thập thần, ngũ hành, concepts
// Add DERIVED nodes (from rule events)
for (const event of results) {
  nodes.push({ id: event.params.name, type: 'derived', ...event.params });
  // Add edges from event.params.links
}
// Add TIME nodes (dayun, liunian)
nodes.push(...buildTimeNodes(R.dayun, currentYear));
```

### Step 4: Query (question → relevant subgraph)
```javascript
function query(question, graph) {
  const category = classifyQuestion(question); // 'marriage' | 'career' | ...
  const startNodes = graph.nodes.filter(n => n.tags?.includes(category));
  // Traverse: start → edges → connected nodes (1-2 hops)
  const subgraph = traverse(startNodes, graph, maxHops=2);
  // Apply time modifiers
  subgraph = applyTimeLayer(subgraph, graph.timeNodes);
  return subgraph;
}
```

## 2. QUESTION CLASSIFICATION
```javascript
const QUESTION_MAP = {
  'hôn nhân|vợ|chồng|duyên|cưới|ly hôn|tình yêu': 'marriage',
  'sự nghiệp|công việc|chức|quyền|nghề': 'career',
  'tiền|tài|giàu|nghèo|đầu tư|kinh doanh': 'wealth',
  'sức khỏe|bệnh|tạng|đau|yếu': 'health',
  'con cái|sinh con|thai': 'children',
  'học|bằng cấp|thi cử|đại học': 'education',
  'tính cách|bản chất|con người': 'personality',
  'diện mạo|ngoại hình|đẹp|mặt': 'appearance',
  'khi nào|thời điểm|vận|năm nào': 'timing',
  'cổ pháp|nạp âm|兰台|thần đầu lộc': 'gufa',
};
```

## 3. OUTPUT FORMAT (graph → AI text)
```javascript
function graphToText(subgraph) {
  let text = `[BRAIN OUTPUT — ${subgraph.category}]\n`;
  // Core conclusions (derived)
  for (const conclusion of subgraph.derived) {
    text += `▸ ${conclusion.name}: ${conclusion.message} (confidence: ${conclusion.confidence}%)\n`;
    text += `  Evidence: ${conclusion.evidence.join(' → ')}\n`;
  }
  // Time modifiers
  for (const time of subgraph.timeModifiers) {
    text += `⏱ ${time.node}: ${time.effect}\n`;
  }
  // Conflicts (multiple schools disagree)
  for (const conflict of subgraph.conflicts) {
    text += `⚠ ${conflict.school1} vs ${conflict.school2}: ${conflict.description}\n`;
  }
  return text;
}
```

## 4. EXAMPLE: Full Flow
```
User: "Con có lấy được chồng không?"

1. Classify: 'marriage'
2. Query: marriage_node → governed_by → [正官(nữ=chồng), 日支(cung phu the)]
3. Facts: has_正官=true(năm tàng 丁), has_七杀=true(tháng tàng 丙) → 官煞混雑!
4. Rule FIRES: 官煞混雑 → hôn nhân bất ổn (confidence 75%)
5. Rule FIRES: 正官 tàng can (1/4) → chồng tinh yếu
6. Time: đại vận 甲申(Mộc) → Mộc sinh Ấn(丁) → Ấn tăng → Ấn chế Thương/Quan → ease
7. Output:
   [BRAIN OUTPUT — marriage]
   ▸ 官煞混雑: hôn nhân bất ổn, cần cẩn thận chọn người (75%)
     Evidence: has_正官(năm_tàng_丁) + has_七杀(tháng_tàng_丙) → rule(官煞混雑)
   ▸ Chính Quan 1/4: chồng tinh yếu (chỉ tàng, không lộ)
   ⏱ Đại vận 甲申(Mộc): Mộc sinh Ấn → giảm xung đột → năm thuận hơn
```

## Next: Round 31-40 — Rule library catalog + implementation plan
