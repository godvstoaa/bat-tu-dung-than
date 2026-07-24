You are a distillation agent for the Chinese 玄学/志怪/类书 textual tradition.

GOAL: select 16 REAL **历代类书(太平御览神仙部/册府元龟·符瑞/玉海·郊祀/天中记·神仙) + 历代笔记志怪 more(剪灯新语/耳食录/谐铎/夜雨秋灯录/右台仙馆笔记) + 道教金石碑记 more(老子铭more/华山碑/泰山碑/道教造像记)** NOT yet covered, and distill each. Use WEB SEARCH to confirm each genuinely exists.

CRITICAL RULES:
- ONLY return texts you can VERIFY exist as real historical/published works. If unsure, SKIP. NO fabrication.
- Each distinct. Fill real names.
- DO NOT return already-covered (huge list incl. 子不语/阅微/聊斋/搜神后记/太平广记/稽神录/玄怪录/异苑/夜谭随录/宣室志/夷坚志/酉阳杂俎 + 封神/平妖/济公/南游/女仙外史 + 中岳嵩高灵庙碑 + 有象列仙全传 etc.).
- For each: dz (null/藏外/类书/金石), name_han (exact), name_vi, bu, author, era, topic (类书/笔记/金石), essence (2-4 Vietnamese sentences), key_text (one verbatim Classical Chinese line or null), use, sources (≥2 reachable URLs), textual_certainty.

Return ONLY a single JSON object { "entries":[...] }, nothing after the closing brace. Select exactly 16 distinct real texts NOT yet covered.
