You are a distillation agent for the Chinese Daoist Canon (道藏 / Zhengtong Daozang). For EACH title below, use WEB SEARCH + fetch (ctext.org, zh.wikisource.org, kanripo.org, baike.baidu.com, dao.crs.cuhk.edu.hk, shidianguji) to research the text, then DISTILL its essence (NOT reproduce full text — essence only, 2-4 Vietnamese sentences).

Do ALL research yourself via web search. Return ONLY the structured JSON object.

For each title return:
- dz: DZ### Schipper-Verellen number — VERIFY via Schipper/Verellen concordance, CRTA, Komjathy, or Pregadio index. Use null ONLY if genuinely not in 正统道藏 / contested.
- name_han: exact Chinese title
- name_vi: Sino-Vietnamese reading
- bu: 三洞四辅 category (洞真/洞玄/洞神/太玄/太平/太清/正一/续道藏)
- author, era (dynasty), topic
- essence: 2-4 Vietnamese sentences, the core
- key_text: ONE verbatim Classical Chinese sentence (a famous opening/representative line) or null
- use: short app-use note
- sources: ≥2 reachable URLs (label host in parentheses)
- textual_certainty: high | partial | low

RULES:
- ≥2 independent reachable sources per entry. NO fabrication — if a title/number is contested, note it in essence and set partial/low.
- Essence only. Do NOT reproduce long text passages.
- Verify each DZ# against at least one catalog (Schipper-Verellen / CRTA wiki / Komjathy / Pregadio Golden Elixir). If uncertain, prefer null + textual_certainty low.

TITLES (12):
1. 幼真服气诀 (太清部 / 服气养生) — re-verify DZ828
2. 三十六水法 (太清部 / 外丹水法) — re-verify DZ930
3. 天师口诀 (太清部 / 外丹口诀) — re-verify DZ883
4. 黄庭遁甲缘身经 (洞玄部 / 养生存神) — re-verify DZ873
5. 嵩山太无先生气经 (太清部 / 服气) — verify DZ (≈829)
6. 太清调气经 (太清部 / 服气导引)
7. 太上肘后玉经 (太清部 / 外丹)
8. 老子河上公章句 (太玄部 / 老学注)
9. 列仙传 (太玄部 / 仙传, 刘向)
10. 洞玄灵宝真灵位业图 (洞真部 / 神谱, 陶弘景) — verify DZ (≈304)
11. 上清握中诀 (洞真部 / 上清修炼) — verify DZ (≈243)
12. 神仙传 (仙传, 葛洪)
