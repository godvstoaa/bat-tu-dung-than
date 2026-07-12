# ROUND 51-60/150: Contradiction Resolution + Confidence Calibration

## EDGE CASE GROUP 1: CONTRADICTORY RULES (mâu thuẫn)

### 1.1: Same domain, opposite conclusions
```
Rule A fires: 伤官见官 → sự nghiệp ĐỨT ĐOẠN (confidence 70%)
Rule B fires: 伤官配印 → sự nghiệp HỌC VẤN CAO (confidence 85%)

→ Which wins?
```

**Resolution strategy:**
- Priority override: 伤官配印 HAS 正印 → OVERRIDES 伤官见官
- Confidence merge: final = max(A, B) with explanation "正印 chế → học vấn cao"
- BOTH shown: "⚠ Rule A nói X nhưng Rule B phủ định → B wins vì..."
- **KEY**: Rule priority must encode CLASSICAL override hierarchy

### 1.2: Override hierarchy (from research)
```
Priority 100: 调候 (sinh mùa hàn → PHẢI dùng Hỏa, đè mọi thứ)
Priority 95: 从格 (tòng cách → Dụng theo thế cục, không Phù Ức)
Priority 90: 格局 thành/bại (成格 = thượng mệnh)
Priority 85: Tổ hợp kinh điển (伤官配印 / 杀印相生 — overrides đơn lẻ)
Priority 80: Thập thần đơn lẻ (正官 = sự nghiệp)
Priority 70: Thần sát (贵人 / 桃花 — modifier, not override)
Priority 60: Vị trí (年/月/日/时 — positional)
Priority 50: Blind school 金口诀 (positional × thần — supplementary)
```

### 1.3: Circular dependency danger
```
Rule X: IF 伤官 THEN set fact(needs_印)
Rule Y: IF fact(needs_印) AND has_印 THEN set fact(印_available)
Rule Z: IF fact(印_available) THEN REMOVE fact(伤官见官)

→ Z removes the trigger for X → X might re-fire → infinite loop
```
**Fix**: json-rules-engine runs rules ONCE (not iterative) by default.
If iterative needed → max 3 passes + cycle detection.

### 1.4: Two schools disagree
```
Tử Bình: "hôn nhân ổn" (正官 vượng, no xung)
盲派: "hôn nhân khó" (日支 bị 刑, 做功 mode = 制用 → partner = object not equal)

→ NOT resolve → SHOW BOTH with school label + confidence
→ "Tử Bình (80%): ổn. 盲派 (65%): cần cẩn thận. Lý do khác: Tử Bình xem tinh, 盲派 xem cấu trúc."
```

### 1.5: Time-based contradiction
```
Natal: hôn nhân ổn (正官 vượng)
Dayun hiện tại: 丙午 (Hỏa) → Hỏa khắc 金(正官 wx) → tạm thời yếu

→ Brain output: "Bẩm sinh: hôn nhân ổn (85%). Hiện tại (Hỏa vận khắc Quan): tạm giảm (65%). Qua vận → hồi phục."
```

## EDGE CASE GROUP 2: CONFIDENCE CALIBRATION

### 2.1: How to assign confidence?
| Factor | Confidence boost |
|--------|-----------------|
| Rule from 子平真诠/滴天髓 (classical) | +20% |
| Rule from 盲派 (oral, less verified) | +10% |
| Multiple pillars confirm | +10% per extra pillar |
| Tàng can only (not lộ) | -15% |
| Star in 空亡 | -40% |
| Star bị 刑/冲 | -20% |
| Dụng thần supports conclusion | +15% |
| Kỵ thần active | -15% |

### 2.2: Confidence threshold
- ≥80%: "Chắc chắn" — assert confidently
- 60-79%: "Khả năng cao" — assert with caveat
- 40-59%: "Có thể" — suggest, don't assert
- <40%: "Không rõ" — don't include in output (noise)

### 2.3: Confidence COMPUEST (multi-factor)
```
base_confidence = 70% (rule inherent)
+ classical_source: +20% = 90%
+ tàng_can_only: -15% = 75%
+ dung_supports: +15% = 90%
→ final: 90% → assert confidently
```

## EDGE CASE GROUP 3: AMBIGUOUS DATA

### 3.1: Birth time unknown (无时辰)
- Time pillar MISSING → entire 时柱 analysis unavailable
- Facts from time pillar = NONE
- Rules that need time pillar → DON'T FIRE (not fire with false → fire with UNKNOWN)
- Output must note: "⚠ Không có giờ sinh → 25% lá số thiếu (Thời Trụ)"

### 3.2: Ambiguous tàng can (本气 vs 余气)
- 辰 contains: 戊(本气) + 乙(余气) + 癸(库气)
- Which hidden stem "counts"?
- Answer: ALL count, but 本气 gets +priority, 余气 -15% confidence, 库气 -25%

### 3.3: True solar time changes pillar
- Birth at 10:59 → 巳时
- True solar time → 11:01 → 午时 → ENTIRE TIME PILLAR CHANGES
- Brain must handle BOTH possibilities → " borderline giờ → thử cả 2"

## Next: Round 61-70 — Special chart types (从格/化格/专旺)
