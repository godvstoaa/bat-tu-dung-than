# ROUND 3-5/50: Schema Design — Node/Edge/Rule

## 1. NODE SCHEMA (Mỗi concept BaZi = 1 node)
```json
{
  "id": "zheng_guan",           // unique ID
  "type": "shishen",            // node type: shishen|wuxing|geju|yun|liuqin|shensha|concept
  "vi": "Chính Quan",           // Hán Việt
  "zh": "正官",                 // Chinese
  "wx": "fire",                 // ngũ hành (if applicable)
  "category": "authority",      // semantic category
  "tags": ["sự nghiệp", "pháp luật", "chồng(nữ)", "kỷ luật"],
  "meaning": "sao chủ quyền lực, chức vụ, luật pháp, danh vọng",
  "links": ["zheng_yin(tương sinh)", "qi_sha(tương phản)", "shang_guan(khắc)", "cai_xing(sinh)"],
  "position_rules": {
    "year": "sự nghiệp sớm, gia đình có quyền",
    "month": "sự nghiệp chính, công việc ổn định",
    "day": "bản thân có quyền / chồng (nữ)",
    "time": "con cái có quyền,晚年 danh vọng"
  },
  "interactions": {
    "with_shang_guan": "XUNG ĐỘT — thương quan khắc quan → sự nghiệp đứt đoạn",
    "with_zheng_yin": "TỐT — ấn sinh quan → quyền + học vấn",
    "with_cai_xing": "TỐT — tài sinh quan → sự nghiệp phát",
    "with_qi_sha": "HỖN TẠP — quan sat lẫn lộn → hôn nhân bất ổn"
  }
}
```

## 2. EDGE SCHEMA (Mỗi quan hệ = 1 edge)
```json
{
  "from": "zheng_guan",
  "to": "shi_ye",               // sự nghiệp
  "type": "governs",            // edge type: governs|generates|controls|conflicts|supports
  "weight": 0.9,                // confidence/strength (0-1)
  "condition": "always",        // condition for edge activation
  "description": "Chính Quan chủ sự nghiệp, chức vụ"
}
```

## 3. RULE SCHEMA (json-rules-engine format)
```json
{
  "id": "shangguan_pei_yin",
  "name": "伤官配印",
  "priority": 90,
  "conditions": {
    "all": [
      { "fact": "hasGod", "operator": "contains", "value": "伤官", "path": ".gods" },
      { "fact": "hasGod", "operator": "contains", "value": "正印", "path": ".gods" }
    ]
  },
  "event": {
    "type": "combination",
    "params": {
      "name": "伤官配印",
      "category": "education",
      "result": "hoc_van_cao",
      "message": "Trí tuệ sáng tạo + được công nhận → học vấn cao",
      "links": ["education_node", "career_node", "personality_node"],
      "confidence": 0.85
    }
  }
}
```

## 4. BRAINTYPES — Categories of nodes
| Type | Examples | Count (est) |
|------|----------|-------------|
| shishen | 10 thập thần + variants | ~15 |
| wuxing | 5 hành + 旺衰 + 相生相克 | ~20 |
| geju | cách cục (chính/biến/đặc biệt) | ~30 |
| yun | đại vận, lưu niên, lưu nguyệt | ~10 |
| liuqin | lục thân (cha mẹ, vợ, con...) | ~12 |
| shensha | thần sát (60+) | ~40 |
| concept | sự nghiệp, hôn nhân, sức khỏe, tài | ~20 |
| camky | cấm kị (兰台, hoàng cực...) | ~25 |
| **TOTAL** | | **~172 nodes** |

## 5. EDGES — Types of relationships
| Type | Meaning | Example |
|------|---------|---------|
| governs | chủ quản | 正官 → sự nghiệp |
| generates | sinh | Mộc → Hỏa |
| controls | khắc | Kim → Mộc |
| conflicts | xung đột | 伤官 ↔ 正官 |
| supports | hỗ trợ | 正印 → Chính Quan |
| transforms | hóa giải | Ấn hóa Sát |
| conditions_on | phụ thuộc | Hôn nhân ← đại vận |
| implies | ngụ ý | 比肩 nhiều →競争 |

## 6. QUESTION → GRAPH TRAVERSAL
| Question | Start node | Traverse path |
|----------|-----------|---------------|
| "sự nghiệp?" | career → governs → 正官/七杀 → conditions → 伤官? → interactions → 伤官配印? |
| "hôn nhân?" | marriage → governs → 配偶 tinh → conditions → quan/sát混? → dayun → marriage timing |
| "sức khỏe?" | health → governs → weakest wx → organ → dayun → 五运六気 → disease |
| "tài?" | wealth → governs → tài tinh → conditions → 比劫争财? → dayun → wealth timing |

## Next: Round 6-10 — Map ALL thập thần + ngũ hành into nodes
