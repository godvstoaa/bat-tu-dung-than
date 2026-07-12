# ĐÁNH GIÁ HỆ THỐNG TRUNG THỰC (100 vòng)

## ĐIỂM: 7/10 — hoạt động được nhưng chưa tối ưu

## 10 KHOẢNH TRỐNG (ranked by impact)

### CRITICAL (cần fix ngay)
1. **Brief 80K chars (~20K tokens) — QUÁ LỚN**
   - AI phải đọc 20K tokens context mỗi câu hỏi → chậm + tốn tiền + dễ sót
   - FIX: brief theo QUESTION TYPE (marriage? → chỉ load marriage sections ~5K)

2. **Brief FLAT — ALL 34 sections mỗi lần**
   - Không question-aware → AI scan hết → sót relevant info
   - FIX: buildTargetedBrief(question, chart, R) → chỉ relevant sections

3. **Brain think() gọi với EMPTY question trong brief**
   - Chỉ output overview, không targeted per question
   - FIX: wire think(actualQuestion) vào AI chat flow

### HIGH (cần fix sớm)
4. **100 cổ tịch data là REFERENCE, không phải brain rules**
   - Có data nhưng NÃO không dùng để suy luận
   - FIX: convert key concepts → brain rules

5. **Low-confidence rules (50-60%) = noise**
   - Rules với confidence thấp thêm noise cho AI
   - FIX: filter confidence <65% trong output

6. **No lazy loading — code-split nhưng vẫn load hết**
   - engine-ai (777KB) + engine-kb (165KB) load dù user chưa mở chat
   - FIX: dynamic import() cho AI engine

### MEDIUM (nice to have)
7. **Selftest: 13 NaN + tool count mismatch**
8. **Brain evidence path: hiển thị 'Conclusions WITHOUT evidence' = 8**
   - Mỗi conclusion CÓ evidence nhưng nó hiển thị sau dòng mới
   - FIX: format evidence cùng dòng conclusion
9. **SYSTEM_PROMPT quá dài (19 sections)**
   - Hợp lý nhưng có thể rút gọn sections trùng lặp
10. **No A/B testing** — không biết AI cải thiện hay không

## KẾ HOẠCH NÂNG CẤP (3 priority)

### Phase 1: Question-Aware Brief (HIGHEST IMPACT)
- Thay buildChartBrief() → buildTargetedBrief(question, chart, R)
- Phân loại câu hỏi → chỉ load relevant sections (~5-10K thay vì 20K)
- AI đọc ÍT hơn → nhanh hơn + chính xác hơn + rẻ hơn

### Phase 2: Brain Question-Aware
- Wire think(actualQuestion) vào chat flow
- Brain output thay đổi theo câu hỏi (marriage → marriage conclusions only)
- Filter confidence <65% → remove noise

### Phase 3: Performance
- Dynamic import() cho engine-ai + engine-kb
- Fix selftest NaN + tool count
- Clean up temp files

## ĐIỂM MẠNH (giữ nguyên)
- 200 brain rules, avg 52/chart — MẠNH
- 30 AI tools — ĐA DẠNG
- 100 cổ tịch — ĐẦY ĐỦ
- Graceful fallback — ỔN ĐỊNH
- Error logging KV — CÓ feedback loop
- Edge cases pass — KHÔNG crash
