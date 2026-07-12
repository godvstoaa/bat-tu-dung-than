# ROUND 81-100/150: Vague Questions + Multi-School Merge + Data Quality

## EDGE CASE GROUP 8: VAGUE / AMBIGUOUS USER QUESTIONS

### 8.1: "Con sao rồi?" / "Thầy xem cho con"
→ No specific question → classify = "OVERVIEW"
→ Brain outputs: top 3 conclusions from EACH domain (career/marriage/health/wealth)
→ Confidence: lower (50%) because not targeted

### 8.2: Multi-topic question
"Con sự nghiệp và hôn nhân ra sao?"
→ 2 categories: career + marriage
→ Brain runs BOTH subgraphs → merges → outputs both
→ Priority: whichever has higher confidence first

### 8.3: Question implies false premise
"Con уже married nhưng sao vẫn cô đơn?" (already married but lonely)
→ Check: does chart SUPPORT marriage? (正官/正财 present?)
→ IF chart says "hard to marry" but user IS married → 
  → Brain: "Theo lá số, hôn nhân cần nỗ lực (正官 tàng only). Thực tế kết hôn = nỗ lực + duyên. Cô đơn = hợp lý vì [reason]."
→ NOT deny reality → EXPLAIN using chart

### 8.4: Self-fulfilling prophecy questions
"Con có nghèo không?"
→ Check: wealth rules fire → IF poor indicators:
  → Brain: "Có dấu hiệu tài khó + lý do cụ thể (比劫 tranh tài) + timing (khi nào dễ mất tiền)"
  → NOT just say "nghèo" → add NUANCE + SOLUTIONS

### 8.5: Question in bad faith / testing
"Thầy nói sai rồi, con không phải vậy"
→ IF brain confidence ≥80% → DEFEND with evidence path
→ IF brain confidence <60% → ACKNOWLEDGE uncertainty
→ IF user provides NEW information (e.g., "con có thai rồi") → 
  → Brain RE-RUN with updated facts → new conclusions

## EDGE CASE GROUP 9: MULTI-SCHOOL MERGE

### 9.1: Tử Bình vs 盲派 — different methodology
```
Tử Bình: 正官 vượng + 正印 vượng → sự nghiệp + học vấn tốt (85%)
盲派: 日柱 做功 = 制用 (khắc để lấy) → sự nghiệp = kỹ năng chế ngự (70%)

→ MERGE: "Sự nghiệp = kỹ năng/management (盲派) + chính quy/học vấn (Tử Bình)"
→ NOT conflict → COMPLEMENTARY (different angles)
```

### 9.2: 古法 nạp âm vs 正五行
```
正五行: 庚金 nhược → cần Thổ/Kim (Phù Ức)
古法 nạp âm: 白蜡金 → cần Hỏa luyện (nạp âm riêng)

→ DIFFERENT Dụng thần!
→ Brain: "Tử Bình Dụng = Thổ (phù ức). Cổ pháp nạp âm = Hỏa (luyện kim). Cả 2 đúng theo hệ riêng."
→ TIMING: if dayun = Thổ → Tử Bình thuận. If dayun = Hỏa → cổ pháp thuận.
```

### 9.3: 皇极经世 (prophetic) vs Tử Bình (individual)
```
皇极: năm 2026 = 同人 (hợp tác/cộng đồng)
Tử Bình: lưu niên 2026 = 丙午 → Hỏa → khắc 金 (day master) → Kỵ

→ MERGE: "Vĩ mô (hoàng cực): năm hợp tác thuận. Cá nhân (tử bình): Hỏa khắc = cần cẩn thận."
→ DIFFERENT SCALES (quốc gia vs cá nhân) → both can be true
```

### 9.4: Rule WEIGHT across schools
| School | Base weight | Rationale |
|--------|------------|-----------|
| 子平真诠 | 1.0 | classical, verified, most used |
| 滴天髓 | 0.95 | classical, deep |
| 命理约言 | 0.85 | standardization but some errors |
| 三命通会 | 0.80 | comprehensive but mixed quality |
| 兰台妙选 | 0.75 | 古法, less mainstream |
| 盲派 | 0.70 | oral, less verified |
| 新派 (李涵辰) | 0.40 | HIGHLY controversial |
| 皇极经世 | 0.60 | macro/prophetic, not individual |

## EDGE CASE GROUP 10: DATA QUALITY ISSUES

### 10.1: Wrong birth time → wrong pillars
```
IF hour borderline (10:59 → 巳 or 午):
  → Brain runs rules with BOTH 巳时 and 午时 facts
  → Compares: which set fires MORE rules / higher confidence?
  → Picks the one with higher coherence
  → Flags: "⚠ Giờ sinh gần biên giới → đã thử cả 巳/午"
```

### 10.2: Missing dayun (birth before 1900 or after 2100)
```
IF year < 1900 OR year > 2100:
  → Dayun calculation may be inaccurate
  → Brain: skip timing rules, only output natal analysis
  → Flag: "⚠ Năm sinh ngoài phạm vi chính xác"
```

### 10.3: 极端 charts (all same element / all clashed)
```
IF 4/4 pillars same wx:
  → Most rules DON'T apply (extreme = special)
  → Brain: "极端格 — switch to special handling"

IF 4/4 branches all 冲 each other:
  → "全冲" = life chaos indicator
  → Brain: reduce ALL confidence by 20% (instability)
```

### 10.4: Conflicting tàng can interpretations
```
辰 contains 戊(本气) + 乙(余气) + 癸(库气)
Some schools only count 本气 (戊)
Some count all 3

→ Brain: count ALL 3 but with confidence weights:
  本气: 100%
  余气: 70%
  库气: 50%
```

### 10.5: 南北半球差异 (Southern Hemisphere)
```
Born in Australia/South America → seasons REVERSED
→ 春 = Northern spring, but Southern = autumn
→ 调候 (adjust for climate) = DIFFERENT
→ Brain: IF birth latitude < -10° → "⚠ Nam bán cầu → điều hậu NGƯỢC"
```

## EDGE CASE GROUP 11: OUTPUT AMBIGUITY

### 11.1: Two equally valid conclusions
```
Career: 60% technical (食制杀) vs 60% academic (伤官配印)
→ Both fire with similar confidence
→ Output: "2 hướng sự nghiệp đều hợp: (A) kỹ thuật hoặc (B) học thuật"
→ NOT pick one → SHOW BOTH
```

### 11.2: No rules fire (empty graph)
```
IF brain engine returns 0 events:
  → "Lá số này không có tổ hợp đặc biệt nổi bật"
  → Fall back to FLAT BRIEF (existing system)
  → Brain = ADDITIVE, not REPLACEMENT
```

### 11.3: Too many rules fire (>20 conclusions)
```
IF >20 events fire → information overload
→ Filter: top 5 by confidence × relevance to question
→ Group: "3 tổ hợp chính + 2 cảnh báo"
```

## Next: Round 101-120 — Performance + scalability + testing
