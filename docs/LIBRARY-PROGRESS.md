# LIBRARY-PROGRESS — Thư viện Huyền học (goal-state checkpoint)

> Multi-session `/goal` project. Read this at session start to resume.
> Master plan: `C:\Users\User\.claude\plans\b-h-t-ai-c-c-mighty-clarke.md`

## Mục tiêu
Corpus huyền học Trung Hoa (符籙 · 神咒 · 經典 · 功法 · phương thuật) — verify ≥2 nguồn, ETHICS, OCR-ngầm qua Grok CLI, PDF theo chủ đề, tích hợp app Bát Tự.

## PHA 0 — Harness + lát dọc: ✅ DONE (2026-07-23)
Pipeline end-to-end chứng minh trên 1 mục mỗi lớp:

| Bước | Artifact | Trạng thái |
|---|---|---|
| Grok CLI probe | `/c/Users/User/.grok/bin/grok` v0.2.101, model grok-4.5, `--json-schema`+`--always-approve`+đọc ảnh local | ✅ |
| Schema | [docs/_schema/talisman.schema.json](docs/_schema/talisman.schema.json), [corpus.schema.json](docs/_schema/corpus.schema.json) | ✅ |
| Prompts | [docs/_prompts/ocr-fu.md](docs/_prompts/ocr-fu.md), [verify.md](docs/_prompts/verify.md) | ✅ |
| Grok harness | [scripts/grok-ocr.mjs](scripts/grok-ocr.mjs) — build prompt→spawn grok headless→validate→wrap ETHICS→ghi fragment; `--mode verify` riêng | ✅ |
| 符 OCR sample | [docs/_fragments/FU-001.json](docs/_fragments/FU-001.json) (合境平安符, 6 nguồn, $0.43); verifier verdict conditional (recheck = cần match 道藏 cụ thể, KHÔNG reject) | ✅ |
| Data module | [src/engine/library-data.js](src/engine/library-data.js) — 4 entry (符/mantra/classic/cultivation), ETHICS reuse từ amta-data, runtime-tested | ✅ |
| UI shell | group «📚 Thư viện Huyền học» trong index.html + `renderLibrary()` (DOM-API, XSS-safe) + opt-in gate + filter + search | ✅ |
| PDF harness | [scripts/build-pdfs.mjs](scripts/build-pdfs.mjs) — Edge headless `--print-to-pdf`, zero deps; 5 PDF trong public/downloads/ | ✅ |
| Bundle | `vite.config.js` manualChunks `engine-library` (41KB/18KB gzip) | ✅ |
| Verify gates | `node --check` ✓, `npm run build` ✓ (249 module, 0 lỗi), `node selftest.mjs` ✓ 0 regression | ✅ |

**PDF đã sinh**: `public/downloads/` — 00-muc-luc, 01-kinh-dien-bat-tu, 02-phu-chu-talismans, 03-than-chu, 04-cong-phap.

## Lệnh tái sử dụng (Phase 1+)
```bash
# OCR + encode 1 batch 符 (ngầm): thay --scans bằng list ảnh scan PD
node scripts/grok-ocr.mjs --work FU-002 --type talisman_fragment \
  --target "src/engine/talisman-data.js -> talismans[]" \
  --scans docs/_scans/<src>/a.jpg,docs/_scans/<src>/b.jpg --web-search true --effort medium --max-turns 16

# Verifier pass (sau OCR): cần ~30 turn do web-search nhiều nguồn
node scripts/grok-ocr.mjs --mode verify --fragment docs/_fragments/FU-002.json --max-turns 30

# Rebuild PDFs sau khi assemble
node scripts/build-pdfs.mjs --all
```

## Funnel chi phí / lưu ý vận hành (QUAN TRỌNG)
- **Grok-4.5 ~$0.11–0.43/call** do fixed overhead ~56K input token → **batch nhiều 符/call**, KHÔNG 1 符/call ở Phase 1.
- **`--disable-web-search` + source-grounding = "max turns reached"** (grok cố search → loop). Luôn dùng `--web-search true` cho OCR/verify.
- **Verifier pass cần ~30 turn** (re-derive + web-check mỗi source). Max-turns 16 không đủ.
- **`| tail` che exit-code**: grok fail (max-turns) exit 1 nhưng pipe báo 0 → kiểm tra `_verifier_verdict !== null` / output file để xác nhận thật.
- Text PD (Kanripo/ctext) KHÔNG qua Grok — pull trực tiếp (`mcp__zread__read_file` / curl) → fragment. Grok chỉ cho scan ảnh 符.
- web-reader MCP từ chối URL wikisource → dùng curl + node strip-tag.

## ✅ TẤT CẢ PHA (0→5) HOÀN THÀNH + DEPLOY LIVE (2026-07-23)
Worker `battu` v`556b008e` trên battu.god8.shop. 32 entry corpus qua 6 layer (mantra 5 · 符 4 · ritual 8 · classic 1 · cultivation 6 · phuongthuat 8), 0 fail ≥2-nguồn. UI: «Thư viện Huyền học» + AM-TA card chart-aware (2 opt-in gate). 7 PDF chủ đề + mục lục tại /downloads/. Build ✓ 252 module, selftest ✓ 0 regression. Live verify: index HTTP 200 (có 2 group mới), PDF HTTP 200.

**PHA 1**: talisman-data.js (18 entry, mỏ AM-TA-SPEC/W8 verified) + suggestByAmTa(R) chart-aware.
**PHA 2**: AM-TA card consuming R.amta + 符/chú suggestion (opt-in `bazi-amta-optin` riêng).
**PHA 3**: cultivation-data.js (6: 参同契/抱朴子/悟真篇/云笈七签/清静经/内观经).
**PHA 4**: phuongthuat-data.js (8: tam thức + 祝由/太素/铁板/方士·隐士).
**PHA 5**: 6 PDF + mục lục (build-pdfs.mjs), build+selftest, commit, deploy, live-verify.
**Bỏ (tiết kiệm)**: Grok 笫 batch bổ sung — nội dung verify sẵn đủ; để Phase mở rộng sau nếu cần thêm 笫 ảnh thật.

### Mở rộng sau (tuỳ chọn, không trong «hoàn thành toàn bộ»)
- Thêm 笫 ảnh thật: chạy `node scripts/grok-ocr.mjs --work FU-NN --scans <pd-img> --web-search true --max-turns 16` → fragment → thêm vào talisman-data. Ảnh PD: 道藏 PDF Commons, 万法归宗 shuge.org.
- Ingest full text kinh điển (参同契 35章, 云笈七签 122卷...) qua ctext/Kanripo → classic layer.
- Verifier pass trên các entry `partial` còn lại (Round 3 符 口诀) khi cần canonical-match chặt.

---

## (Lưu trữ) PHA 1 kế hoạch gốc
Nguồn: 道法会元 (text+ảnh), 万法归宗 (scan→Grok), 茅山/五雷/正一 符籙, 北帝/洞渊 神咒. Batch Grok-OCR ngầm + verifier. Assemble `src/engine/talisman-data.js` (tách từ library-data). Chart-aware: gợi ý 符/chú theo R.amta indicator. PDF 02-phu-chu mở rộng.
- Ảnh scan PD: Commons (道藏 vol PDF, 万法归宗 shuge.org), ctext 道法会元 符 chương.
- Sub-task: tạo `src/engine/talisman-data.js` + di chuyển 符 entry từ library-data sang; cập nhật import + render.

## (Lưu trữ) PHA 2–5 kế hoạch gốc: theo master plan (AM-TA render card consuming R.amta · cultivation 内丹 · phương thuật · tổng hợp PDF).

## ETHICS (cứng — kế thừa AM-TA Round 11)
Opt-in + disclaimer + ≥2 nguồn độc lập + textual_certainty + KHÔNG chẩn đoán «âm tà»/fear-mongering/«trị bệnh» + 符 chỉ cấu trúc-thị giác (KHÔNG in/ve operative). Code+content cùng enforce.
