// ============================================================================
//  NPC-AI G0 · NPC-PERSONAS — module THUẦN (không DOM, không state, không mạng)
//  của chuỗi persona Huyền Quán (docs/npc-ai/04-kien-truc-persona-object.md §4.4.1;
//   lộ trình docs/npc-ai/15-lo-trinh-tich-hop.md §15.5a).
//  Khuôn tham chiếu: gu-gongan.js / namhan.js / kinh-tu.js — chạy node được,
//  test theo scripts/test-game-thay-mo-rong.mjs.
//
//  Chỉ export ĐÚNG BA hàm công khai (mục 04 §4.4.1 — không thêm hàm nào):
//    getPersona(id, opts)          — lấy persona; id lạ → null, không ném;
//                                    persona có `runtime === false` (nháp chờ
//                                    biên bản tham vấn — Lạt-ma Đa Kiệt, mục 15
//                                    §15.5a) bị TỪ CHỐI (null) trừ khi opts bật
//                                    cờ cho phép runtime tôn giáo — fail-closed.
//    personaSystemPrompt(p, ctx)   — ghép system prompt: PERSONA-CHUNG TRƯỚC,
//                                    biến thể SAU (quy tắc ghép mục 04 §4.2);
//                                    bảng biến ĐÓNG — khe thiếu → chuỗi rỗng.
//    personaBark(p, seed)          — chọn 1 bark theo hạt giống; cùng seed ra
//                                    cùng bark (delegate pickBark của
//                                    bark-pool.js — một công thức chọn, audit F2).
//
//  Bảng biến ĐÓNG của personaSystemPrompt (chủ sở hữu duy nhất — mục 04 §4.4.1):
//    {{name}} {{story}} {{soCauDo}} {{hinhAnh}} {{moDau}} {{ketCau}} {{cam}}
//    {{mau}} {{tuXung}} {{goi}} {{ctx}}
//    + 4 khe ctx con: {{ctx.theoDao}} {{ctx.liudao}} {{ctx.talu}} {{ctx.soChu}}
//  Biến ngoài bảng KHÔNG bị bỏ qua — replace không khớp giữ nguyên literal
//  `{{...}}` trong prompt — nên promptTemplate chỉ được dùng đúng tên trên.
// ============================================================================

import { pickBark } from './bark-pool.js'; // MỘT công thức chọn bark (audit F2) — delegate pickBark
import {
  PERSONA_CHUNG_10_LUAT,
  PERSONA_VAN_COC, PERSONA_KHONG_TIENSINH, PERSONA_THAY_TUBINH, PERSONA_TRUONG_THIEN_SU,
  PERSONA_DIEU_AM, PERSONA_TE_TUU, PERSONA_HUYEN_HU, PERSONA_KHAU_DAOTRUONG,
  PERSONA_MAOSHAN_DAONHAN, PERSONA_TRUCLAM_THIENSU, PERSONA_LAMA_DAKIET, PERSONA_PHAN_QUAN,
  PERSONA_DIATANG_SU, PERSONA_VU_Y_AMAU, PERSONA_LO_BAN_SU, PERSONA_DINH_MENH_HOI,
  PERSONA_GAC_CONG, PERSONA_THO_MAY, PERSONA_DAN_DINH, PERSONA_PHUONG_SI,
} from './persona-data.js';

const REGISTRY = {
  van_coc: PERSONA_VAN_COC,
  khong_tiensinh: PERSONA_KHONG_TIENSINH,
  thay_tubinh: PERSONA_THAY_TUBINH,
  truong_thiensu: PERSONA_TRUONG_THIEN_SU,
  dieu_am: PERSONA_DIEU_AM,
  te_tuu: PERSONA_TE_TUU,
  huyen_hu: PERSONA_HUYEN_HU,
  khau_daotruong: PERSONA_KHAU_DAOTRUONG,
  maoshan_daonhan: PERSONA_MAOSHAN_DAONHAN,
  truclam_thiensu: PERSONA_TRUCLAM_THIENSU,
  lama_dakiet: PERSONA_LAMA_DAKIET,
  phan_quan: PERSONA_PHAN_QUAN,
  diatang_su: PERSONA_DIATANG_SU,
  vu_y_amau: PERSONA_VU_Y_AMAU,
  lo_ban_su: PERSONA_LO_BAN_SU,
  dinh_menh_hoi: PERSONA_DINH_MENH_HOI,
  gac_cong: PERSONA_GAC_CONG,
  tho_may: PERSONA_THO_MAY,
  dan_dinh: PERSONA_DAN_DINH,
  phuong_si: PERSONA_PHUONG_SI,
};

/**
 * Lấy persona theo id — mục 04 §4.4.1: id lạ trả null, không ném, không tự sinh persona.
 *
 * @param {string} id   id persona snake_case (bảng 20 — mục 04 §4.3)
 * @param {{allowReligionRuntime?: boolean}} [opts]
 *   Cờ do consumer cấp khi biên bản tham vấn tôn giáo đã có hiệu lực.
 *   Persona đánh dấu `runtime: false` (bản nháp chờ tham vấn — Lạt-ma Đa Kiệt,
 *   mục 15 §15.5a: «không bao giờ được consumer nào đọc nếu flag tôn giáo chưa
 *   bật») bị từ chối — trả null — cho tới khi cờ này bật. Fail-closed.
 * @returns {Object|null}
 */
export function getPersona(id, opts = {}) {
  const p = REGISTRY[id];
  if (!p) return null;                       // id lạ → null — không ném (mục 04 §4.4.1)
  if (p.runtime === false && opts.allowReligionRuntime !== true) return null; // guard mục 15 §15.5a
  return p;
}

/**
 * Ghép system prompt persona — mục 04 §4.4.1.
 * PERSONA-CHUNG ghép TRƯỚC biến thể (quy tắc ghép §4.2); chỉ 3–5 câu mẫu (`mau`)
 * được nạp làm nhịp giọng — bible KHÔNG nạp (mục 04 §4.5).
 *
 * @param {Object} persona  persona từ getPersona — thiếu/`promptTemplate` rỗng
 *                          thì ném lỗi rõ ràng (lỗi caller, không âm thầm).
 * @param {Object} [ctx]    object do điểm chơi cấp; MỌI khe thiếu → chuỗi rỗng:
 *   gioiThieu: câu giới thiệu bối cảnh chung      → khe {{ctx}}
 *   theoDao   : người chơi đã theo Chính Nhất chưa → khe {{ctx.theoDao}} (hồ sơ 20)
 *   liudao    : chuỗi lục đạo/tam độc của điểm chơi → khe {{ctx.liudao}} (hồ sơ 21)
 *   talu      : trạng thái Tà Lộ của người chơi    → khe {{ctx.talu}}
 *   soChu     : trần độ dài lượt (số)              → khe {{ctx.soChu}}
 * @returns {string}
 */
export function personaSystemPrompt(persona, ctx) {
  if (!persona || typeof persona !== 'object') {
    throw new Error('personaSystemPrompt: persona không tồn tại — truyền persona từ getPersona()');
  }
  if (typeof persona.promptTemplate !== 'string' || persona.promptTemplate.trim() === '') {
    throw new Error(`personaSystemPrompt: persona "${persona.id || '(không id)'}" thiếu promptTemplate (chuỗi rỗng)`);
  }
  const c = ctx || {};
  const bienThe = persona.promptTemplate
    // 4 khe ctx con thay TRƯỚC khe {{ctx}} mẹ để không khớp nhầm
    .replaceAll('{{ctx.theoDao}}', c.theoDao != null && c.theoDao !== '' ? String(c.theoDao) : '')
    .replaceAll('{{ctx.liudao}}', c.liudao != null && c.liudao !== '' ? String(c.liudao) : '')
    .replaceAll('{{ctx.talu}}', c.talu != null && c.talu !== '' ? String(c.talu) : '')
    .replaceAll('{{ctx.soChu}}', c.soChu != null && c.soChu !== '' ? String(c.soChu) : '')
    .replaceAll('{{ctx}}', c.gioiThieu ? c.gioiThieu : '')
    // các biến chính của bảng đóng
    .replaceAll('{{name}}', persona.name)
    .replaceAll('{{story}}', persona.story)
    .replaceAll('{{soCauDo}}', persona.voice.soCauDo)
    .replaceAll('{{hinhAnh}}', persona.voice.hinhAnh)
    .replaceAll('{{moDau}}', persona.voice.moDau)
    .replaceAll('{{ketCau}}', persona.voice.ketCau)
    .replaceAll('{{cam}}', persona.voice.cam.join('; '))
    .replaceAll('{{mau}}', persona.voice.mau.slice(0, 5).join(' | '))
    .replaceAll('{{tuXung}}', persona.danhXung.tuXung)
    .replaceAll('{{goi}}', persona.danhXung.goi);
  return [
    `== NHÂN VẬT: ${persona.name} ==`,
    PERSONA_CHUNG_10_LUAT,                    // ghép MỘT lần từ hằng dùng chung — §4.2
    bienThe,                                  // biến thể đứng SAU khung chung
  ].join('\n');
}

/**
 * Chọn 1 bark từ pool bằng hạt giống — mục 04 §4.4.3.
 * Cùng seed → cùng bark để thế giới lặp lại được; bark ngoài lượt thoại vẫn chạy
 * với mọi mức aiEnabled (bark không phụ thuộc AI), tắt khi cờ crisis (luật 5 —
 * việc của consumer, không phải module).
 *
 * Audit F2 — MỘT CÔNG THỨC CHỌN: delegate sang pickBark của bark-pool.js (hàm
 * chọn duy nhất của quán, dùng chung cho persona + khách AI-light + trạm).
 * Trước đây module này tự chọn bằng rng(hashSeed(seed)) khiến cùng persona +
 * cùng seed ra 2 câu khác nhau tuỳ hàm gọi. Dữ liệu cũng một nguồn: POOLS của
 * bark-pool dẫn chiếu thẳng barkPool trong persona-data.js nên câu trả về
 * luôn nguyên văn thuộc pool của chính persona đó.
 *
 * @param {Object} persona persona từ getPersona
 * @param {string|number} seed hạt giống (khuôn: ngày + khe + pid)
 * @returns {string} bark; pool rỗng/thiếu → '' (trạm câm, không bịa giọng)
 */
export function personaBark(persona, seed) {
  if (!persona || typeof persona.id !== 'string' || !persona.id) return '';
  const bark = pickBark(persona.id, seed); // một công thức — bark-pool.js pickBark
  return typeof bark === 'string' ? bark : '';
}
