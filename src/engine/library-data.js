// ============================================================================
//  THƯ VIỆN HUYỀN HỌC — AGGREGATOR (Bát Tự app)
//  Union of all layer modules → LIBRARY[]. UI (renderLibrary) + PDF (build-pdfs)
//  consume only LIBRARY/LAYERS/countByLayer/ETHICS from here.
//  ----------------------------------------------------------------------------
//  ⚠ ETHICS (mirrors AM-TA Round 11): tham chiếu văn hoá-tôn giáo, KHÔNG y tế/
//  tâm thần/chẩn đoán. 符 chỉ cấu trúc-thị giác; nghi lễ do 受箓 道士 chủ trì.
//  OPT-IN. Mỗi entry ≥2 nguồn độc lập + textual_certainty.
//  ----------------------------------------------------------------------------
//  Layer modules (Phase 1+ tách dần):
//    · talisman-data.js    → 符(fu) · 神咒(mantra) · nghi thức(ritual)  [Phase 1]
//    · cultivation-data.js → 功法 tu hành (cultivation)                 [Phase 3]
//    · phuongthuat-data.js → 方術 (phuongthuat)                          [Phase 4]
//    · (classic Bát Tự → classic)                                        [tích hợp]
//  Pure ES module. Verified by `node --check`.
// ============================================================================
import { ETHICS } from './amta-data.js';
import { TALISMANS } from './talisman-data.js';
import { CULTIVATION } from './cultivation-data.js';     // Phase 3
import { PHUONGTHUAT } from './phuongthuat-data.js';     // Phase 4
import { BITRUYEN } from './bitruyen-data.js';           // bí truyền/thất truyền/tàn quyển
import { DAOZANG } from './daozang-data.js';             // 道藏 chưng cất (bulk pipeline)

export { ETHICS };

export const LAYERS = [
  { id: 'daozang',     zh: '道藏', vi: 'Đạo Tạng (chưng cất)' },
  { id: 'fu',          zh: '符籙', vi: 'Phù bùa' },
  { id: 'mantra',      zh: '神咒', vi: 'Thần chú' },
  { id: 'ritual',      zh: '科儀', vi: 'Nghi thức · Ấn' },
  { id: 'cultivation', zh: '功法', vi: 'Công pháp tu hành' },
  { id: 'phuongthuat', zh: '方術', vi: 'Phương thuật' },
  { id: 'bitruyen',    zh: '秘傳', vi: 'Bí truyền · Thất truyền' },
  { id: 'classic',     zh: '經典', vi: 'Kinh điển Bát Tự' },
];

// CLASSIC (Bát Tự) — ported từ Phase 0 demo; Phase 5 mở rộng từ các OCR sẵn.
const CLASSICS = [
  {
    id: 'JING_LUOLUZI', layer: 'classic',
    school: '古法 / 子平前身 — 珞琭子三家注',
    name_han: '珞琭子赋注', name_vi: 'Phú Lạc Lộ Tử (chú)',
    han_text: '先賢處俗或崇釋氏或好仙道亦不離五行也離爲火內屬心臟釋教志論在了悟其心歟…',
    meaning: 'Cổ phú nền tảng Bát Tự (tam gia chú: 王廷光/曇瑩/釋曉瑩). Mở đầu: tiên hiền處俗 dù hướng Phật/Đạo thì «不離五行» — liên kết ngũ hành với tâm(火/心臟) theo楞嚴經.',
    use: 'Tham chiếu lý luận Bát Tự cổ pháp (五行通道，取用多門).',
    sources: [
      'https://ctext.org/wiki.pl?if=gb&res=54910 (CTEXT 珞琭子賦注)',
      'https://zh.wikisource.org/ (維基文库 珞琭子三家注)',
      'docs/ocr-gufa-grok.md (Grok-4 Heavy OCR scan PD — NLC/Wikimedia 63tr)',
    ],
    textual_certainty: 'partial', notes: 'OCR nguyên thuải Grok-4 Heavy (scan PD); câu bôi = trích đoạn đầu 卷上.',
  },
];

export const LIBRARY = [...DAOZANG, ...TALISMANS, ...CULTIVATION, ...PHUONGTHUAT, ...BITRUYEN, ...CLASSICS];

export function countByLayer(entries = LIBRARY) {
  const c = {};
  for (const e of entries) c[e.layer] = (c[e.layer] || 0) + 1;
  return c;
}
