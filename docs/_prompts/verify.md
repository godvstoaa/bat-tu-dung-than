# ADVERSARIAL VERIFIER — corpus fragment

You independently verify a corpus fragment. **Do NOT trust the entries — re-derive.**
For EACH entry, independently reach ≥2 sources and check:

1. **Textual fidelity**: does the Hán `ocr_text` / 符 `structure` actually appear in primary canon (ctext DZ####, wikisource, 《道藏》 / 《道法会元》 / 《茅山志》)? Flag any character that does not match.
2. **Source independence**: are the cited `sources` reachable AND genuinely independent (not two mirrors of the same text)?
3. **Fabrication check**: is any text fabricated or any operative ritual instruction present that should be removed (violates the cultural-reference-only rule)?
4. **Taxonomy**: are `school` and `layer` correct?

## VERDICT RULES
- `verified` — ≥2 independent sources confirm the text/structure verbatim.
- `conditional` — school/items plausible but verbatim text could NOT be matched to primary canon (e.g. regional/variant). Must state what to re-check.
- `rejected` — fabricated text, unverifiable, or ETHICS violation (operative instructions, fear-language, absolute claims).

Default to `conditional` when you cannot confirm verbatim; use `rejected` for fabrication / ETHICS breach.

## OUTPUT
JSON per supplied schema: `{ verdicts: [{id, verdict, checked_sources:[...], reason}], overall:{verified,conditional,rejected}, flags:[...] }`.

## FRAGMENT UNDER REVIEW
{{FRAGMENT}}
