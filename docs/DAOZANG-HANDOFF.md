# DAOZANG-HANDOFF — Trạng thái để tiếp tục sau compact

> Mục tiêu `/goal`: chưng cất TOÀN BỘ ~1500 kinh 道藏 → tinh túy → encode vào app. Đọc file này đầu mỗi session để resume.

## 0. IN-FLIGHT (thu kết quả đầu tiên ở context kế!)
Batch 9 ĐÃ LAUNCH (4 agent chạy nền, kết quả persist ra .output). Context kế: TaskOutput(id,block=true) hoặc đọc notification -> assemble vào daozang-data.js theo §2 (bỏ dup §4) -> build/deploy.
- `a5682a6af7808b5c0` — 老学注宋元 (苏辙DZ691·吕惠卿·王安石·吴澄)
- `a557fa7e81a739395` — 洞玄灵宝深度 (诸天内音·三元品戒·灭度五炼生尸·度人经别注)
- `a193c143298a0bb1c` — 全真仙传 (金莲正宗记·太古集·水云集·渐悟集)
- `a89d079124a16b533` — 道医/太清/方术 (太清中黄真经·五厨经·皇极经世·遁甲玄枢)
Output dir: `C:UsersUserAppDataLocalTempclaudec--Users-User--gemini-antigravity-scratch-app-b-i-to-nd951f5a5-2fd2-43ad-a6d2-c134a51bc428	asks<id>.output` (⚠ .output = JSONL transcript KHÔNG đọc bằng Read/shell; dùng TaskOutput(id,block=true) hoặc đợi notification).

## 1. TRẠNG THÁI HIỆN TẠI (snapshot)
- **daozang = 128 kinh** đã chưng cất / ~1500 (≈**7.5%**), ~97 đã verify số hiệu DZ# (Schipper-Verellen / CRTA / Komjathy / Pregadio concordance).
- **8 batch (partial) đã ship** (commit + push origin/main + deploy live `battu` trên battu.god8.shop; bản mới `4105abfe`).
- App tổng: **~181 entry / 8 lớp** (daozang 128 · mantra 10 · 符 4 · 科仪 13 · 功法 10 · 方术 8 · bí truyền 14 · kinh điển 1).
- engine-library chunk ~228KB. Build ✓, selftest ✓ exit 0 mỗi batch.
- **CHƯA hoàn thành** — full 1500 cần ~65+ batch nữa (long-haul, multi-session).

## 2. PIPELINE CHƯNG CẤT (lặp mỗi batch)
1. **Spawn 3-4 subagent general-purpose** (Song SONG, ⚠ **no-spawn** để tránh 429 rate-limit như batch1 đầu):
   - Prompt mẫu (cho mỗi agent, ~4 tựa/bộ): xem §3.
2. Mỗi agent: WebSearch + WebFetch (ctext/wikisource/kanripo/baike/shidianguji) → chưng cất essence (2-4 câu VIỆT) + 1 câu HÁN verbatim + DZ# (verify Schipper/CRTA) + ≥2 nguồn + textual_certainty → return JSON `{entries:[...]}`.
3. **Assemble**: append entries vào `src/engine/daozang-data.js` `DAOZANG_RAW` (giữ shape {dz,name_han,name_vi,bu,author,era,topic,essence,key_text,use,sources,textual_certainty,notes}); **BỎ DUP** với đã có (xem §4 dup-skip).
4. `node --check src/engine/daozang-data.js` + runtime count.
5. `node scripts/build-pdfs.mjs --all` (regen PDF 08-đạo-tạng).
6. `npm run build` + `node selftest.mjs` (exit 0).
7. `git add src/engine/daozang-data.js public/downloads && git commit -m "feat(daozang): batch N — +X kinh ..." && npm run deploy && git push origin main`.

### Lệnh nhanh (verify + count)
```bash
cd "c:/Users/User/.gemini/antigravity/scratch/app bói toán"
node --input-type=module -e "import('./src/engine/daozang-data.js').then(m=>console.log('daozang:',m.DAOZANG.length,'| DZ:',m.DAOZANG.filter(e=>/DZ ?\d+/i.test(e.notes)).length))"
git log --oneline -8   # xem batch đã ship
```

## 3. PROMPT MẪU SUBAGENT (copy, thay titles + bu)
```
You are a distillation agent for the Chinese Daoist Canon (道藏). Research EACH title via WebSearch + WebFetch (ctext/wikisource/kanripo/baike/shidianguji), DISTILL essence (NOT full text), return ONE entry.

⚠ DO NOT spawn any subagents/agents. Do ALL research yourself, return final JSON directly.

TITLES (<bộ> sâu):
1. <tựa 1>
2. <tựa 2>
...

For each return JSON:
{ "dz": "DZ### (verify Schipper/CRTA; null if unsure/not in正统道藏)", "name_han": "...", "name_vi": "Sino-Vietnamese", "bu": "...", "author": "...", "era": "...", "topic": "cultivation|classic|fu|ritual|mantra|philosophy", "essence": "2-4 câu VIỆT cốt tủy", "key_text": "1 câu HÁN verbatim hoặc null", "use": "...", "sources": ["url1","url2"], "textual_certainty": "high|partial|low" }

RULES: ≥2 reachable sources. No fabrication (note if not in正统道藏 / title contested). Essence only. Return ONLY JSON { "entries":[...] }. Read-only.
```

## 4. DUP-SKIP LIST (ĐÃ CÓ — không add lại)
太清导引养生经(DZ818) · 抱朴子内篇(cultivation-data DAN_BAOPUZI) · 太上三五正一盟威籙(DZ1208) · 三官经(DZ1442) · 参同契/悟真篇/抱朴子/云笈七签/清静经/内观经(cultivation-data) · (mỗi lần agent trả, grep name_han trong daozang-data.js + library-data trước khi add).

## 5. ĐÃ CHƯNG CẤT — 98 KINH THEO BỘ (xem `daozang-data.js` cho raw; tóm tắt)
- **太玄 (12)**: 道德经·南华经(庄子)·冲虚经(列子)·通玄经(文子)·淮南子·真诰DZ1016·西升经DZ666·金丹四百字DZ1081·还源篇DZ1091·还丹复命篇·翠虚篇DZ1090·晋真人语录DZ1056.
- **洞玄 (13)**: 度人经DZ0001·九天生神DZ0318·玉京山步虚DZ1439·登真隐诀DZ421·黄庭内景DZ331·灵宝济度金书DZ466·五岳真形图DZ441·智慧罪根大戒DZ457·升玄经DZ1122·定观经DZ400·洞渊神咒经DZ335·灵剑子DZ570·服饵丹石行药法DZ420.
- **洞真 (25)**: 心印经DZ13·阴符经DZ31·入药镜DZ135·胎息经DZ130·钟吕传道集DZ263·玉枢经DZ16·清微仙谱DZ171·历世真仙通鉴DZ296·青华秘文DZ240·诸天灵书度命DZ23·度人经四注DZ87·五老赤书DZ22·三天易髓DZ250·大通经DZ105·功过格DZ186·玉皇经DZ10·虚皇经DZ18·玄都妙本DZ35·续仙传DZ295·疑仙传DZ299·海空经DZ9·三洞神咒DZ78·修真十书DZ263·灵宝度人大法·大洞真经.
- **太清 (7)**: 感应篇DZ1167·黄庭外景DZ332·太清金液DZ880·养生诀DZ821·导引养生DZ818·灵宝毕法DZ1191·老子中经DZ1168.
- **洞神 (16)**: 日用妙经DZ645·存神炼气铭DZ834·养性延命录DZ838·说了心经DZ642·广圣义DZ725·关尹子DZ662·三皇经DZ856·犹龙传DZ770·道德会元DZ699·三尸九虫DZ871·老君经律DZ786·百病百药DZ188·黄帝九鼎神丹DZ885·内观经DZ410·混元三部符DZ673·太清石壁记DZ881.
- **正一 (9)**: 正一盟威箓DZ1208·正一法文DZ0789·黄庭中景DZ1401·重阳立教十五论DZ1233·道法会元DZ1220·明鉴真经DZ1207·正一咒鬼经DZ1193·道门科范大全集DZ1225·总真秘要DZ1227.
- **太平 (7)**: 无上秘要DZ1138·太平经DZ1101·太平经钞DZ1101·净明忠孝全书DZ1110·本行宿缘经DZ1114·仙乐集DZ1141·仙授理伤续断秘方.
- **道藏辑要 (4)**: 阴骘文·太乙金华宗旨·性命圭旨·张三丰全集.
- **续道藏 (2)**: 三官经DZ1442·开天经DZ1437.
- **敦煌写本 (1)**: 想尔注. **敦煌残卷 (1)**: 化胡经. **四库 (1)**: 道藏目录详注.

## 6. BATCH 7+ — TỰA ỨNG VIÊN TIẾP (tránh dup §4/§5)
**太玄/老学注**: 河上公老子注·王弼道德经注·老子微旨例·老子变化经·列仙传(刘向).
**洞真/上清**: 上清修行经·上清握中诀·真灵位业图(陶弘景)·登仙箓·太丹隐书.
**洞玄/灵宝**: 太上灵宝诸天内音·太上洞玄灵宝三元品戒·无量度人经别注(薛幽栖/李少微/成玄英/严东单注)·九幽玉匮明真科.
**太清/外丹/养生**: 嵩山太无先生气经·太清调气法·神仙传(葛洪)·太上肘后玉经·黄帝内经(道医基础,note非道藏).
**正一/雷法/神霄**: 神霄玉枢/火雷秘诀·天心正法·上清北极天心正法·五雷秘法·地祇法.
**科仪/戒律**: 初真十戒·中极戒·天仙大戒(三坛大戒)·三元参同·灵宝无量度人经集注.
**仙传/谱录**: 三洞群仙录DZ1238·甘水仙源录·终南山说经台历代真仙碑记·玄天上帝启圣录.
**失传/敦煌**: 老子变化经(敦煌)·太上业报因缘经·玄都律文DZ188(chi tiết).

## 7. FACT KỸ THUẬT QUAN TRỌNG
- **Repo**: `c:\Users\User\.gemini\antigravity\scratch\app bói toán` (git: godvstoaa/bat-tu-dung-than, branch main). Deploy: Cloudflare Worker `battu` → battu.god8.shop. `npm run deploy` = rm -rf dist && vite build && npx wrangler deploy.
- **Vite manualChunks**: `engine-library` regex trong `vite.config.js` ~line 80: `(library-data|talisman-data|cultivation-data|phuongthuat-data|bitruyen-data|schools-data|amta-data|amta-analyze|amta-tuluyen-data|daozang-data)`.
- **Module cấu trúc**: `daozang-data.js` export `DAOZANG` (normalized từ `DAOZANG_RAW`) + `daozangByBu`. `library-data.js` aggregate `LIBRARY = [...DAOZANG, ...TALISMANS, ...CULTIVATION, ...PHUONGTHUAT, ...BITRUYEN, ...CLASSICS]`. `LAYERS` có 8 id: daozang/fu/mantra/ritual/cultivation/phuongthuat/bitruyen/classic.
- **UI**: renderLibrary() trong main.js (DOM-API, XSS-safe) render LIBRARY theo layer filter; card «📚 Thư viện Huyền học» + «Đối chiếu trường phái» (schools-data 12 phái × 9 chiều) + «Âm Tà·Tu Luyện» (amta-tuluyen-data, opt-in).
- **Grok CLI** (cho 符 OCR nếu cần): `/c/Users/User/.grok/bin/grok` v0.2.101, model grok-4.5. `grok --cwd <app> --reasoning-effort medium --max-turns 16 --always-approve --permission-mode bypassPermissions --output-format json --json-schema '<schema>' -p "<prompt>"` (đọc ảnh local qua Read tool; ~$0.4/call; **bật --web-search** cho verify). Harness: `scripts/grok-ocr.mjs`.
- **PDF**: `scripts/build-pdfs.mjs --all` (8 chủ đề qua Edge headless `--print-to-pdf`, zero-dep) + `scripts/md-to-pdf.mjs` (markdown→PDF) + `scripts/build-schools-pdf.mjs`. Output `public/downloads/`.
- **Memory MCP**: observation_add cần server-beta runtime (hiện worker-mode → KHÔNG khả dụng). Dùng in-repo docs (file này + LIBRARY-PROGRESS.md) làm durable state.
- **Không commit** `docs/_tmp_*` / `.wrangler/` / `_audit-*.mjs` (churn).

## 8. PENDING (sau khi mở rộng đủ hoặc user yêu cầu)
- **«Dùng trong app»**: kết nối daozang → chart-aware — khi user nhập lá số, gợi ý kinh 符/chú/nghi thức liên quan theo R.amta indicators (mở rộng `suggestByAmTa` trong talisman-data.js để include daozang entries theo topic/bu).
- **Catalog backbone**: danh sách DZ#/tựa/bộ cho TOÀN BỘ ~1500 (index dài hạn, qua 道藏目录详注 DZ188/Bai Yunji hoặc Schipper-Verellen Companion) → `daozang-catalog.js`.
- **Verifier pass**: chạy `grok-ocr.mjs --mode verify` trên các entry `partial/low` còn lại (Round 3 茅山口诀, 洞渊, etc.).

## 9. CONSOLE TRẢ LỜI USER (pattern)
- User hay hỏi «đến đâu / hoàn thành chưa» → trả lời THẬT: 98/~1500 (6.5%), chưa xong, long-haul; bộ tinh túy then chốt mọi bộ đã đủ dùng cho app.
- User `/goal` → tiếp loop (spawn batch kế theo §6).
- Có thể đề xuất 3 hướng: (a) tiếp đều sâu, (b) cống 1-2 bộ tới full, (c) dừng mở rộng + «dùng trong app» (chart-aware) hoặc verifier.

---
*File này = bộ nhớ durable. Sau compact, đọc file này + `daozang-data.js` + `git log` để resume. Cập nhật mỗi batch (số §1).*
