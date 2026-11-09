// ============================================================================
//  BƯỚC «NĂM NAY» CHO 4 SẢNH NGHỀ (docs/GAME-THIET-KE-CHOT.md P0-2) — hàm thuần
//  npcDeep(R, nowYear): nhận LÁ SỐ KHÁCH đã có sẵn ở builder (R = npcR(npc, year),
//  halls.js:26) và luận lưu niên năm nay bằng engine app: analyzeLiunianDeep
//  (liunian-pro.js:362) lấy rating/score/schools. KHÔNG bọc makeNpc (npc.js:41)
//  — builder tự dựng khách, module này chỉ phán vận năm.
//
//  Luật map rating 6 mức (liunian-pro.js:304-309) → 3 lựa chọn của bước:
//    Đại cát + Cát            → 'thuan'  («Thuận — nên làm»)
//    Bình                     → 'binh'   («Bình thường»)
//    Hơi kỵ + Hung + Đại hung → 'giu'    («Nên thủ, giữ sức»)
//  Nhãn hiển thị dùng từ mềm theo GAME-HUYEN-QUAN-SPEC.md §11 mục 3 (:354) —
//  cấm «đại hung / đại hạn / tai hoạ / chết» ở lớp game. order
//  ['thuan','binh','giu'] để chọn kề thang được 0,4 qua gradeStep (halls.js:29).
//  explain = trường phái đầu (schools[0] — luôn là Ngũ Hành/Dụng Thần,
//  liunian-pro.js:97) + 1 câu GAI (GAI_LEVELS, remedy-fate.js:130 — tầng 改运,
//  cùng khuôn advice của namhan.js:65-66: cải vận bề mặt, không hứa cải mệnh).
//  Thuần logic, không DOM — test: scripts/test-game-npc-deep.mjs.
// ============================================================================
import { analyzeLiunianDeep } from '../engine/liunian-pro.js';
import { GAI_LEVELS } from '../engine/remedy-fate.js';

// rating kỹ thuật của engine → bậc thang 3 lựa chọn (rating lạ mặc định Bình)
export const TONE_OF = {
  'Đại cát': 'thuan', Cát: 'thuan',
  Bình: 'binh',
  'Hơi kỵ': 'giu', Hung: 'giu', 'Đại hung': 'giu',
};

// 3 lựa chọn + nhãn mềm §11 mục 3 (:354)
const OPTIONS = [['thuan', 'Thuận — nên làm'], ['binh', 'Bình thường'], ['giu', 'Nên thủ, giữ sức']];
// 1 câu GAI — tầng 改运 (GAI_LEVELS[0]) như namhan.js:65-66.
const GAI = `${GAI_LEVELS[0].lv}: ${GAI_LEVELS[0].methods} — ${GAI_LEVELS[0].time}.`;

/**
 * Bước khai «Năm nay» của khách — đầu vào đúng R mà builder sảnh đã có.
 * @param R        analyze() của khách (halls.js npcR)
 * @param nowYear  năm dương lịch hiện tại (mặc định năm máy)
 * @returns bước đầy đủ cho mảng steps: { key, title, kind, prompt, options, order, answer, explain }
 */
export function npcDeep(R, nowYear = new Date().getFullYear()) {
  const d = analyzeLiunianDeep(R, nowYear);
  const answer = TONE_OF[d.rating] || 'binh';
  const l0 = (Array.isArray(d.schools) && d.schools[0]) || { phai: 'Ngũ Hành / Dụng Thần', note: '' };
  return {
    key: 'liunian', title: 'Năm nay', kind: 'one',
    prompt: 'Năm nay của khách thế nào?',
    options: OPTIONS,
    order: ['thuan', 'binh', 'giu'],
    answer,
    explain: `${l0.phai}: ${String(l0.note || '').trim()} ${GAI}`,
  };
}
