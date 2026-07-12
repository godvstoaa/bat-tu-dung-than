# ROUND 11-15/50: Cách Cục Nodes + Rules + Domain Mappings

## 1. CÁCH CỤC NODES (~30 patterns)
### 8 Chính Cách (from 子平真诠)
| Node ID | Name | Conditions (simplified) | Links |
|---------|------|------------------------|-------|
| geju_zhengguan | Chính Quan cách | 月令 本气 = 正官 +透干 | → authority, career, marriage |
| geju_qisha | Thất Sát cách | 月令 = 七杀 | → military, power, danger |
| geju_zhengyin | Chính Ấn cách | 月令 = 正印 | → education, mother, protection |
| geju_zhengcai | Chính Tài cách | 月令 = 正财 | → wealth, wife(nam) |
| geju_shishen | Thực Thần cách | 月令 = 食神 | → health, art, enjoyment |
| geju_shangguan | Thương Quan cách | 月令 = 伤官 | → creativity, rebellion |
| geju_yangren | Dương Nhận cách | 月令 = 羊刃 | → violence, military |
| geju_jianlu | Kiến Lộc cách | 月令 = 建禄 | → independence |

### 成/败/救应 Rules (from PATTERN_CHENG_BAI)
```
FOR EACH cách:
  IF conditions_cheng ALL met → 成格 (thành, thượng mệnh)
  IF conditions_bai ANY met → 败格 (bại, hạ mệnh)
  IF conditions_bai met AND conditions_jiu met → 救应 (cứu ứng, hồi phục)
  IF 救应 → STRONGER conclusion (khắc phục → quý hơn)
```

### 倒论 Rules (from JIXIONG_FANLI)
```
IF 四吉神 (tài/quan/ấn/thực) present AND used WRONGLY → PHÁ cách
IF 四凶神 (sát/thương/kiều/nhận) present AND used RIGHTLY → THÀNH cách
→ "吉不 necessarily cát, hung không necessarily hung"
```

## 2. DOMAIN NODES (~20 concept nodes)

### 事业 (career_node)
- governed_by: [正官(sự nghiệp chính), 七杀(quyền lực), 伤官(sáng tạo/kỹ thuật)]
- affected_by: [大运(quan/sat vận → phát), 格局(thành → thuận), 用神(dung → thuận)]
- timing: [大运 quan/sat enters → sự nghiệp phase, 流年 quan/sat → năm phát]
- rules: [
    IF 伤官配印 → career = "academic/research",
    IF 杀印相生 → career = "leadership/official",
    IF 食制杀 → career = "technical/management",
    IF 财生官 → career = "business + authority"
  ]

### 婚姻 (marriage_node)
- governed_by: [配偶 tinh (nam: tài, nữ: quan), 日支(cung phu the)]
- affected_by: [桃花(duyên), 合(dayun hợp = kết hôn), 冲(xung = biến động)]
- timing: [lục hợp year, 配偶 tinh year, đại vận hợp 日支]
- rules: [
    IF 配偶 tinh vượng + không xung → marriage = stable,
    IF 官煞混杂(nữ) → marriage = unstable,
    IF 配偶 cung xung → marriage = biến động,
    IF 桃花 → marriage = duyên mạnh
  ]

### 健康 (health_node)
- governed_by: [weakest wx → tạng yếu, đại运 khắc → bệnh phase]
- affected_by: [五运六気(năm → tạng bệnh), 冲 chi → cơ thể]
- rules: [
    IF wx weakest = 木 → liver vulnerable,
    IF wx weakest = 火 → heart vulnerable,
    IF dayun 克 日主 wx → health decline phase,
    IF 流年 冲 日支 → body stress year
  ]

### 财运 (wealth_node)
- governed_by: [正财(tài chính ổn định), 偏财(tài phi/đầu tư), 财库(kho)]
- affected_by: [比劫(tranh tài), 大运 tài(tài vận), 身强/nhược(thân nhậm tài?)]
- rules: [
    IF 身强 + tài vượng → rich,
    IF 身弱 + tài vượng → "tài nhiều hại thân",
    IF 比劫 nhiều → tranh tài,
    IF 大运 tài → tài vận phase
  ]

## 3. FORWARD CHAINING CHAIN (example)
```
Question: "Con có học giỏi không?"
1. Query education_node
2. Traverse: education ← governed_by ← [正印, 伤官, 食神]
3. Check facts: has正印? has伤官?
4. Rule: IF 伤官+正印 → 伤官配印 → hoc_van_cao
5. Rule: IF 正印 vượng → học vấn tự nhiên tốt
6. Check dayun: current dayun supports education? (印 vận? Mộc vận sinh Ấn?)
7. Derived conclusion: "Học vấn cao (伤官配印) + hiện tại thuận (Mộc vận sinh Ấn)"
8. Confidence: 85%
9. Evidence path: [伤官@tháng, 正印@năm tàng] → rule(伤官配印) → dayun(甲申/Mộc) → education_node
```

## Next: Round 16-20 — Thần sát nodes + mapping + cấm kị integration
