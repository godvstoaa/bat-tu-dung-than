You are a distillation agent for the Chinese Daoist textual tradition (正统道藏 + 续道藏 + 道藏辑要 + major 藏外 collections: 道书十二种/道贯真源/方壶外史/太上十三经/古书隐楼藏书/伍柳仙宗/道书全集).

GOAL: select 16 REAL **道藏辑要 + 藏外 major Daoist texts** — 内丹/老学/全真 classics & commentaries NOT in正统道藏, by FAMOUS masters (彭定求/蒋元庭/闵一得/伍冲虚/柳华阳/刘一明/李涵虚/陆西星/朱元育/赵避尘/千峰老人). Use WEB SEARCH to confirm each genuinely exists.

CRITICAL RULES:
- ONLY return texts you can VERIFY exist as real historical works. If unsure, SKIP. NO fabrication.
- Each a distinct work. Add （master）if generic. Note collection in bu.
- For 藏外 texts dz: null. For 道藏 texts real DZ#.
- DO NOT return already-covered 辑要/藏外: 太乙金华宗旨 · 性命圭旨 · 阴骘文 · 张三丰全集 · 悟真直指(刘一明) · 参同契阐幽(朱元育)/测疏(陆西星)/正义(董德宁)/脉望(陶素耜) · 悟真篇集注(仇兆鳌) · 金丹四百字注(闵一得) · 黄庭经解(刘一明)/注解(李涵虚)/发微(董德宁).
- For each: dz, name_han (exact, add（master）), name_vi, bu, author, era, topic, essence (2-4 Vietnamese sentences), key_text (one verbatim Classical Chinese line or null), use, sources (≥2 reachable URLs), textual_certainty.

Return ONLY a single JSON object { "entries":[...] }, nothing after the closing brace. Select exactly 16 distinct real 道藏辑要/藏外 texts.
