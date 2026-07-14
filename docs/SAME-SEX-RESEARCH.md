# Same-Sex Relationship Support — Consolidated Research + Design Proposal

> Tổng hợp 3 doc research: `BAZI-SAMESEX-METHOD-RESEARCH.md`, `WESTERN-SAMESEX-METHOD-RESEARCH.md`, `SAMESEX-CULTURAL-ETHICAL-RESEARCH.md`. Doc này là **decision brief** cho developer duyệt trước khi code.

## TL;DR — Khuyến nghị

**TÍCH HỢP — nhưng chỉ ở tầng diễn giải/wording, KHÔNG phải dự đoán số phận.** Rủi ro kỹ thuật THẤP (gendered surface chỉ 4 spot cô đọng), rủi ro đạo đức CÓ nhưng kiểm soát được bằng caveat + prompt rule. **Zero engine change** — chỉ interpretation layer.

---

## 1. Phán quyết từng hệ

| Hệ | Có cần đổi code? | Lý do |
|---|---|---|
| **Western** | ❌ KHÔNG | Venus/Mars/7th house vốn gender-neutral. `computeWesternChart(date,lat,lng)` không có param giới. Synastry (nếu build): cùng math, xét cả 2 hướng Venus↔Mars + same-planet aspects. |
| **BaZi** | ✅ SỬA 4 SPOT | hehun.js ~90-95% gender-neutral rồi (纳音/生肖/日支合冲/用神/神煞). Chỉ 4 spot gendered cần «mode switch» cho same-sex. |

## 2. Phương pháp BaZi (chọn cái nào)

Research (5 approach) → chọn:
- **(a) Day-branch / Phu Thê cung universal** cho single-chart (đọc «cung partner» không phân giới) — defensible.
- **(c) Symmetrical synastry** cho compatibility (cả 2 lá số, ngũ hành tương tác) — **most defensible**.
- ❌ BỎ **(b) Peer star (比肩/劫财)»** = «gay indicator» — ethically fraught, no empirical validation (Peter Yap n≈50: không rõ signature), bị lạm dụng để «dò orientation» → KHÔNG build.

→ Nguyên tắc: **1 engine gender-neutral áp dụng đồng nhất cho MỌI cặp**, không «special gay mode».

## 3. 4 spot code gendered (cần «mode switch»)

| File | Line | Hiện tại | Fix (same-sex mode) |
|---|---|---|---|
| `family.js` | 26 `elementForRole(dayGan, isMale, role)` | spouse/child star theo isMale | thêm param `partnerGender`/`sameSex` → spouse = day-branch element (universal), child = output star |
| `marriage-timing.js` | 35 `spouseGods = isMale ? [正財,偏財] : [正官,七殺]` | nam=Tài, nữ=Quan | same-sex → spouseGods = **[day-branch hidden gods]** (cung partner) thay vì Tài/Quan theo giới; 5 trigger khác (红鸾/天喜/桃花/红艳/day-branch 合冲) đã neutral — giữ nguyên |
| `hehun.js` | 122-133 «spouse-star cross-check» | aMale/bMale, wifeGods/husbGods | same-sex pair → bỏ sub-factor này (hoặc dùng ngũ-hành tương ứng 2 chiều); phần còn lại của score đã neutral |
| `ideal-match.js` | 138-140, 248-249 child-star | child-star theo giới | `findIdealPartners` đã nhận partner `gender` opt → thêm `sameSex` opt, child-star = output star |

## 4. UX (opt-in, không default)

- Form hiện tại: ngày/giờ sinh + **giới tính** (birth-sex, dùng tính lá số + đại vận chiều — KHÔNG đổi).
- **ADD opt-in field** «Đối tượng quan tâm: [Nam / Nữ / Cả hai / Không chỉ định]» — mặc định «Không chỉ định» (= hành xử như hiện tại, khác giới).
- Field này **chỉ** flip 4 spot sang gender-neutral path + đổi đại từ/wording; **không** đổi lá số gốc.

## 5. Wording + Anti-harm (bắt buộc)

- **Dùng**: «bạn đời / đối tác / quan hệ / tình duyên». **KHÔNG dùng** «hôn nhân» cho same-sex (VN Art 8(2) không công nhận — verify launch).
- **Mandatory caveat** (mỗi lần luận tình duyên same-sex): «App luận lá số CỦA BẠN (đặc điểm cá nhân, xu hướng duyên), KHÔNG luận «mối quan hệ này có hạnh phúc/bền không» — đó do 2 người + hoàn cảnh, không do số.»
- **AI prompt rule** (SYSTEM_PROMPT mới): 
  - KHÔNG BAO GIỜ suy đoán orientation từ sao (cấm «Cô Quả/Hóa Kỵ/Phá Quân/Thất Sát = gay» — anti-pattern TikTok).
  - KHÔNG pathologize («mệnh khắc», «bệnh», «bất thường»).
  - Khi user khai same-sex → luận qua **day-branch + ngũ hành tương tác**, không qua Tài/Quan gendered.
  - Neo «đồng tính không phải bệnh» (Bộ Y tế VN 2022) nếu user biểu lộ lo âu.
- **Positioning**: trung lập «không phân biệt đối xử», KHÔNG «advocacy/propaganda» (chính trị VN thắt sau 9/2025).

## 6. Rủi ro + giảm thiểu

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Reading tiêu cực hại user LGBT dễ tổn thương | CAO | Mandatory caveat (mục 5) + Barnum-honesty |
| AI pathologize / suy đoán orientation | CAO | Prompt rule cấm (mục 5) |
| Bị gán «propaganda» (post-9/2025) | TRUNG BÌNH | Positioning trung lập, opt-in (không default) |
| hehun cross-check sai cho same-sex pair | TRUNG BÌNH | Bỏ sub-factor, dùng ngũ-hành layer |
| User bảo thủ phản đối | THẤP | Opt-in ẩn, default = hiện tại |

## 7. Scope tích hợp (nếu duyệt)

1. **UI**: 1 opt-in field «đối tượng quan tâm» (index.html + main.js)
2. **Code**: 4 spot (family.js, marriage-timing.js, hehun.js, ideal-match.js) — thêm `sameSex` param, path gender-neutral
3. **Brief/AI**: SYSTEM_PROMPT rule (mục 5) + caveat string
4. **KB**: thêm WesternSynastry notes (gender-neutral) + BaZi same-sex method note
5. **Test**: selftest cho same-sex path (đảm bảo không regression cho khác giới)

## 8. Lưu ý chưa đóng

- **Không classic authority** (滴天髓/穷通宝鉴/三命通会/渊海子平/子平真诠 đều câm) → phải nói rõ trong UI «đây là adaptation hiện đại, không cổ pháp chuẩn».
- **Practitioner-dependent, no consensus** → chọn (a)+(c) là defensible nhất, nhưng không «đúng tuyệt đối».
- **Verify** luật VN hôn nhân đồng giới tại thời điểm launch.

## Sources
Xem 3 doc chi tiết: `BAZI-SAMESEX-METHOD-RESEARCH.md`, `WESTERN-SAMESEX-METHOD-RESEARCH.md`, `SAMESEX-CULTURAL-ETHICAL-RESEARCH.md` (mỗi claim ≥2 nguồn).
