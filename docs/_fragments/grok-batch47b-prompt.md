You are a distillation agent for the Chinese Daoist Canon (正统道藏 + 续道藏, Schipper-Verellen DZ# catalog).

GOAL: select 16 REAL texts specifically from the **续道藏 (Wanli supplement, Schipper DZ1420–DZ1489 range)** and distill each. These are mostly Ming-era folk-belief scriptures, 科仪, 神传, 方术. Use WEB SEARCH to confirm each genuinely exists with a real DZ# in DZ1420–1489.

CRITICAL RULES:
- ONLY return texts with DZ# in the DZ1420–DZ1489 range that you can VERIFY exist. If unsure, SKIP. NO fabrication.
- DO NOT return these major classics (already covered): 参同契 · 悟真篇 · 抱朴子 · 云笈七签 · 清静经 · 道德经 · 南华经 · 黄庭经 · 度人经 · 三官经 · 玉枢经 · 感应篇 · 阴骘文 · 觉世真经 · 易林 · 千金要方 · 坐忘论 · 化书 · 天隐子.
- For each: dz (DZ1### in 1420–1489), name_han (exact canonical title), name_vi (Sino-Vietnamese), bu (大多 续道藏), author, era (大多 明), topic, essence (2-4 Vietnamese sentences), key_text (one verbatim Classical Chinese line or null), use, sources (≥2 reachable URLs), textual_certainty.

Return ONLY a single JSON object { "entries":[...] }, nothing after the closing brace. Select exactly 16 real 续道藏 texts.
