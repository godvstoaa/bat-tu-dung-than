You are a distillation agent for the Chinese Daoist textual tradition (正统道藏 + 藏外/辑要).

GOAL: select 16 REAL **老子/道德经 + 庄子/列子 藏外/辑要 注疏** by FAMOUS masters NOT yet covered, and distill each. Use WEB SEARCH to confirm each genuinely exists.

CRITICAL RULES:
- ONLY return texts you can VERIFY exist. If unsure, SKIP. NO fabrication.
- Each by a DIFFERENT master / distinct work. Add（master）.
- DO NOT return already-covered: 老子翼(焦竑) · 道德经注(王夫之) · 道德宝章(赵孟頫) · 道德经解(李道纯) · 道德真经玄览(陆西星) · 道德经解(苏辙) · 太上十三经注解(李涵虚) · 南华真经註疏(成玄英)/新传/口义/义海纂微/章句音义/循本 · 冲虚至德真经解/四解 · 洞灵真经注 · 道德真经(各正统道藏注: 河上公/想尔/成玄英/李荣/严遵指归/玄宗/徽宗/陆希声/司马光/王弼/邵若愚/李约/赵志坚/赵秉文/时雍/张嗣成/董思靖/顾欢/王真/强思齐/四子古道/三解/玄经原旨/藏室纂微/口义/集注/解 etc.).
- For each: dz (null for 藏外/辑要, or DZ# for 道藏), name_han (exact, add（master）), name_vi, bu, author, era, topic (老学/庄学), essence (2-4 Vietnamese sentences), key_text (one verbatim Classical Chinese line or null), use, sources (≥2 reachable URLs), textual_certainty.

Return ONLY a single JSON object { "entries":[...] }, nothing after the closing brace. Select exactly 16 distinct real 老子/庄/列 藏外注疏 NOT yet covered.
