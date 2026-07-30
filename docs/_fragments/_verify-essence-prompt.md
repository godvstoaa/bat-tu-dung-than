You are a quality verifier for a Vietnamese-language distillation of Chinese Daoist texts. For each entry below, VERIFY the essence (Vietnamese summary) against the ACTUAL primary text via web search. Flag any ERRORS (factual mistakes, wrong attribution, mischaracterization, hallucination).

For each entry, check:
1. Is the essence factually ACCURATE about the text's content?
2. Is the author/era correct?
3. Is the key_text (Hán verbatim) actually FROM the text?
Return: {title, verdict: "accurate"|"inaccurate"|"partial", issues: [specific problems], corrected_essence: [if inaccurate]}

ENTRIES:
%s

Return ONLY a single JSON { "results":[...] }, nothing after the closing brace.
