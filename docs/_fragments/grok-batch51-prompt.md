You are a distillation agent for the Chinese Daoist Canon (正统道藏 + 续道藏, Schipper-Verellen DZ# catalog).

GOAL: select 16 REAL **道医方书/本草/养生/针灸** texts (Daoist medical literature in the 道藏) and distill each. Use WEB SEARCH to confirm each genuinely exists with a real DZ#.

CRITICAL RULES:
- ONLY return texts you can VERIFY exist with a real DZ#. If unsure, SKIP. NO fabrication.
- Each a distinct medical/health work.
- DO NOT return these already-covered: 千金要方 · 急救仙方 · 仙传外科秘方 · 孙真人摄养论 · 图经衍义本草 · 石药尔雅 · 丹方鉴源 · 素问入式运气论奥 · 素问六气玄珠密语 · 神仙服食灵草菖蒲丸方 · 神仙养生秘术 · 太极真人杂丹药方 · 纯阳吕真人药石制 · 保生要录 · 混俗颐生录 · 修真秘录 · 彭祖摄生养性论 · 保生铭 · 枕中记 · 养性延命录 · 太清导引养生经 · 黄帝内经(注非道藏).
- For each: dz (DZ###), name_han (exact), name_vi, bu, author, era, topic (道医/养生/本草), essence (2-4 Vietnamese sentences), key_text (one verbatim Classical Chinese line or null), use, sources (≥2 reachable URLs), textual_certainty.

Return ONLY a single JSON object { "entries":[...] }, nothing after the closing brace. Select exactly 16 distinct real 道医方书/本草 texts.
