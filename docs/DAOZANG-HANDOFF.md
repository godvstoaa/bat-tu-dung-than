# DAOZANG-HANDOFF — Trạng thái để tiếp tục sau compact

> Mục tiêu `/goal`: chưng cất TOÀN BỘ ~1500 kinh 道藏 → tinh túy → encode vào app. Đọc file này đầu mỗi session để resume.

## 0. IN-FLIGHT / SAU CÙNG
- **Pipeline chính = GROK CLI** (WebSearch quota đã hết; subagent chỉ khi Grok kẹt). Web search mặc định ON (`--disable-web-search` mới tắt).
- **Batch 14 đang chạy (bg `betg93t0n`)** — 14 tựa: 历世真仙通鉴续编·终南山碑记·太上老君戒经·初真戒·三洞奉道科戒营始·太上助国救民总真秘卷·清微元降大法·法海遗珠·道德真经指归·老子铭·早晚功课经·金莲正宗记·道德经义疏(成玄英)·南斗六司延寿经. Output: `docs/_fragments/grok-batch14.json`.

## 1. TRẠNG THÁI HIỆN TẠI (snapshot — cập nhật sau batch 95)
- **daozang = 1215 kinh** đã chưng cất / ~1500 (≈**81.0%** — VƯỢT 80% & 1200), ~800 verify DZ#. Deploy mới nhất `d0831b4e`.
- **Phạm vi mở rộng rất rộng** (vượt正统道藏 1500): + 续道藏民间信仰 + 藏外/辑要 内丹各派(伍柳/东西/全真龙门/千峰/仙学陈撄宁/女丹) + 注疏(老庄/悟真/参同/黄庭/阴符/清净/心印/玉枢 各master) + 道医方书 + 善书 + 科仪施食幽科 + 仙传谱录 + 山志 + 神魔小说(邓志谟/西游补/后西游/西洋记) + 地方神谱(妈祖/保生/临水/广泽/清水/三山国王/华光/开漳) + 民间宗教宝卷各sect(罗教/弘阳/圆顿/闻香/黄天道/长生/八卦/先天/在理/西大乘/大成/还源) + 一贯道(王觉一) + 扶鸞(清微三品/地狱天堂游记) + 近代民间宗教(天帝教/德教/轩辕教/真佛宗/天德圣教/道德学社/万国道德会) + 仙学期刊.
- **Chiến lược = FOCUSED SUB-CORPORA + 藏外/辑要 vein (batch 47-69)**: in-canon clusters (DZ1-1487) bão hòa → pivot sang mỏ 藏外/道藏辑要 (内丹 Minh-Thanh: 伍柳/东西派/全真龙门/千峰/仙学陈撄宁 + 女丹) giàu giá trị, ~0 dup. Batch 67+ bắt đầu bão hòa cả 藏外 (yield 5-14, cross-vein trad/simpl dups tăng).
- **Đã tách chunk** (batch 64): `engine-daozang` (~891KB/261KB-gzip lazy) riêng khỏi `engine-library` (~116KB). Bỏ ETHICS re-export dừ → gãy circular.
- **Pipeline 1 lệnh**: `focused-prompt → grok(bg,high) → daozang-tolerant(parse) → daozang-validate(dedup) → daozang-append → build-pdfs → build → selftest → commit → deploy`.
- **Dup-policing**: cross-layer name + intra-collision (enrich commentary) + DZ#-dedup. **Lỗi còn lại: trad/simpl blindness** (华/華, 册/冊, 经/經...) → ~1-3 residual dups/batch spot thủ công (vd 太乙金华宗旨/天皇玉册/孙不二). Verifier pass sau.
- **id-collision FIXED**: id = `DZ_<toàn-bộ-tên-Hán>` + uniqueness guard.
- App tổng: **~907 entry / 8 lớp** (daozang 887 · mantra 10 · 符 4 · 科仪 13 · 功法 10 · 方术 8 · bí truyền 14 · kinh điển 1).
- **Đánh giá**: corpus đã capture phần lớn substantial verifiable canon (mọi trường phái lớn, text nền, 注疏 tradition, 藏外/辑要 depth). ~1500 figure gồm nhiều fragments/duplicate-editions/lost texts. Yield đang ↓ mạnh (5-14/batch) — cận practical ceiling ~900-950 verifiable distinct texts.
- engine-daozang chunk ~891KB (gzip 261KB). PDF 08 = 887 mục (~14MB). Build ✓ ~2.3s, selftest ✓ exit 0.

## 2. PIPELINE CHƯNG CẤT (lặp mỗi batch) — **GROK CLI = CHÍNH**
0. **Dup-check**: `node -e "..."` dump `DAOZANG.map(e=>e.name_han)` → `docs/_fragments/_done-titles.json`, grep ứng viên trước khi launch.
1. **Launch Grok CLI 1 lượt** (web search verify nguồn, ~$1/batch, ~6-10 turns):
   ```bash
   cd "c:/Users/User/.gemini/antigravity/scratch/app bói toán"
   /c/Users/User/.grok/bin/grok \
     --cwd "c:/Users/User/.gemini/antigravity/scratch/app bói toán" \
     --reasoning-effort medium --max-turns 30 \
     --always-approve --permission-mode bypassPermissions \
     --json-schema "$(cat docs/_fragments/grok-batch13-schema.json)" \
     --prompt-file docs/_fragments/grok-batch<N>-prompt.md \
     > docs/_fragments/grok-batch<N>.json 2> docs/_fragments/grok-batch<N>.err
   # run_in_background: true → parse khi notification completed
   ```
   Schema: `docs/_fragments/grok-batch13-schema.json` (object{entries:[{dz,name_han,name_vi,bu,author,era,topic,essence,key_text,use,sources[],textual_certainty}]}). Prompt mẫu: copy `grok-batch14-prompt.md`, đổi list tựa.
2. **Parse + dup-filter + verify**: `node -e` đọc `.structuredOutput.entries` (fallback `JSON.parse(.text).entries`), lọc `name_han && sources.length>=2`, bỏ dup với `_done-titles.json`, in dz/tên/bu/certainty → save `grok-batch<N>-clean.json`.
3. **Append** vào `src/engine/daozang-data.js` `DAOZANG_RAW` (chèn trước `];` đóng mảng — tìm `.map(` sau `DAOZANG_RAW`, lùi tới `]` gần nhất). Dùng script node viết file (Edit tool hay fail do linter). Field: normalizer tự build `notes` từ `dz` → DZ#-count regex `/DZ ?\d+/i.test(e.notes)` hoạt động tự động. Shape raw: `{dz,name_han,name_vi,bu,author,era,topic,essence,key_text,use,sources,textual_certainty,notes}`.
4. `node --check src/engine/daozang-data.js` + count (daozang / DZ# / daozangByBu).
5. `node scripts/build-pdfs.mjs --topic daozang` (regen PDF 08).
6. `npm run build` + `node selftest.mjs` (exit 0).
7. `git add src/engine/daozang-data.js public/downloads/08-* && git commit -m "feat(daozang): batch N (Grok CLI) — +X kinh ...; daozang=N" && npm run deploy && git push origin main`.

### Lệnh nhanh (verify + count)
```bash
cd "c:/Users/User/.gemini/antigravity/scratch/app bói toán"
node --input-type=module -e "import('./src/engine/daozang-data.js').then(m=>console.log('daozang:',m.DAOZANG.length,'| DZ:',m.DAOZANG.filter(e=>/DZ ?\d+/i.test(e.notes||'')).length,'| by-bu:',JSON.stringify(m.daozangByBu())))"
git log --oneline -6   # xem batch đã ship
```

### Fallback: SUBAGENT (chỉ khi Grok kẹt)
Spawn 3-4 subagent general-purpose (Song SONG, ⚠ **no-spawn** để tránh 429): prompt mẫu §3.
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

## 5. ĐÃ CHƯNG CẤT — 173 KINH (snapshot §1); phân bổ theo bộ xem live:
`node --input-type=module -e "import('./src/engine/daozang-data.js').then(m=>console.log(JSON.stringify(m.daozangByBu(),null,1)))"`
(vd batch13: 洞真40·洞神41·洞玄19·太玄16·正一16·太平13·太清7 + sổ nhỏ). Danh sách tựa đầy đủ: `DAOZANG.map(e=>e.name_han)`. Tóm tắt cổ (batch ≤9, ~142):
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
