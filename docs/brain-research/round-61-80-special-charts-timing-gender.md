# ROUND 61-80/150: Special Charts + Timing Edge Cases + Gender

## EDGE CASE GROUP 4: SPECIAL CHART TYPES (oái oăm nhất)

### 4.1: 从格 (Tòng cách — follow pattern)
```
IF 日主 cực nhược + toàn cục 1 hành dominates → 从格
→ ALL normal rules SUSPENDED:
  - Dụng thần = NOT Phù Ức (không bồi nhật chủ)
  - Dụng thần = the DOMINANT hành (tòng tài → Dụng = Tài)
  - 伤官 see官 = NOT xung đột (tòng cách = thuận thế)
  - 比劫 = KỴ (tỷ kiếp phá tòng cách)
```
**Brain handling**: 从格 detection = Priority 95 → ALL other rules get `active=false` for this chart.

### 4.2: 化气格 (Hóa khí — transformation pattern)
```
IF 日干 + 月干 ngũ hợp + hóa khí hành vượng → 化气格
→ 日主 EFFECTIVELY CHANGES to the hợp hóa hành:
  - 甲己 hợp → Hóa THỔ → treat day master as THỔ
  - 乙庚 hợp → Hóa KIM → treat as KIM
→ ALL thập thần recalculated based on NEW day master!
```
**Brain handling**: Facts extraction must CHECK for 化气 → if yes, recalculate ALL thập thần.

### 4.3: 专旺格 (Chuyên vượng — pure strong)
```
IF 日 chủ cực vượng + toàn cục same wx + no khắc → 专旺格
→ Dụng thần = WHY NOT suppress? → Thuận thế: Dụng = Tỷ/Kiếp/Ấn
→ Gặp Quan/Sat vận = PHÁ chuyên vượng → BAD
→ Gặp Tỷ/Kiếp vận = tốt
```

### 4.4: Two elements fighting (交战)
```
IF Mộc & Kim đều cực vượng → "Mộc Kim giao chiến"
→ Day master caught between → internal conflict personality
→ Health: both liver (Mộc) & lungs (Kim) stressed
→ Marriage: conflict between independence (Kim) & growth (Mộc)
```

### 4.5: All pillars same (4 same ganzhi)
```
IF 4 trụ = same can-chi (extremely rare)
→ 极端 chart → most standard rules DON'T apply
→ Need special handling (叠风池 etc.)
```

## EDGE CASE GROUP 5: TIMING OÁI OĂM

### 5.1: 交运 (Giao vận — dayun handover year)
```
Year of dayun transition:
  - Old dayun still has "residual qi" (余气)
  - New dayun hasn't fully "kicked in"
  - Which dayun applies?
→ Brain: weight 50/50 in giao vận year → "GIAO VẬN — biến động"
```

### 5.2: 空亡 in dayun
```
IF dayun enters 空亡 position:
  - "Đại vận rơi không vong" → decade effectiveness reduced 50%
  - BUT: 空亡 = also means "release from attachments" → could be LIBERATING
  - NOT simply void → nuanced
```

### 5.3: 流年冲 dayun
```
IF liunian 冲 dayun chi:
  - Major upheaval year (冲运)
  - Brain: "⚠ Năm xung đại vận → biến động LỚN"
  - Confidence: 90% (very high — classical rule)
```

### 5.4: 大运逆排 error
```
IF year-gan = 阴 + female OR year-gan = 阳 + male → 逆排 (reverse)
IF calculated wrong direction → ENTIRE dayun sequence is WRONG
→ Brain must VERIFY: direction matches sex + year-gan polarity
→ Self-check: does dayun[0].startAge make sense? (<20 typical)
```

### 5.5: 起运岁数 (khoi vận age) edge
```
IF birth very close to 节气 → 起运 age could be 0 or 10
  - 起运 = 0: unusual, first dayun from birth
  - 起运 = 10: normal
→ Brain: flag if 起运 < 3 or > 12 → "KIỂM TRA LẠI giờ sinh"
```

## EDGE CASE GROUP 6: GENDER

### 6.1: Same chart, different gender → different reading
```
正官:
  Male: sự nghiệp, chức vụ (no marriage implication)
  Female: sự nghiệp AND chồng (dual meaning)

七杀:
  Male: quyền lực cực, quân sự
  Female: người tình, chồng bạo, hoặc chồng thứ 2

正财:
  Male: vợ + tài
  Female: chỉ tài (no husband meaning)

→ Brain facts MUST include gender → rules CONDITIONAL on gender
```

### 6.2: 女命 special rules
```
IF female:
  - 纯和清贵浊滥娼淫 (8 pháp nữ mệnh)
  - 官煞混雑 → more severe for female (hôn nhân)
  - 伤官 → more severe (khắc chồng)
  - 阳刃 → different (cạnh tranh với chồng)
  - 胎元/命宫 → more important for female
```

### 6.3: 男命 special rules
```
IF male:
  - 正财 = vợ (primary marriage indicator)
  - 比劫 nhiều = tranh vợ/tài
  - 七杀 = con cái (Thời trụ) = khắc tử
  - 身弱財多 = "tài nhiều hại thân" (wife dominates)
```

## EDGE CASE GROUP 7: AGE-DEPENDENT RULES

### 7.1: Rules that change with age
```
Age 1-15:  Nien trụ dominates →父母/祖上 analysis primary
Age 16-30: Nguyet trụ → education/career start
Age 31-50: Nhat trụ → self/spouse/career peak
Age 51+:   Thoi trụ → children/晚niên

→ Brain: question about "sự nghiệp" at age 60 → focus THỜI TRỤ not NIÊN TRỤ
```

### 7.2: 大运 vs age correlation
```
IF current age in dayun[0] range AND dayun[0].startAge > 50:
  → "Vãn niên vận" → different priorities (health > career)
IF current age < 25 AND asking about "tài vận":
  → "Sơ niên" → focus education > wealth (preparation phase)
```

## Next: Round 81-90 — Vague questions + multi-school merge
