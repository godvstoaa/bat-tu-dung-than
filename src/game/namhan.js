// ============================================================================
//  ĐƯỜNG THẦY · TAB «NĂM HẠN CỦA BẠN» (docs/GAME-THIET-KE-CHOT.md P0-1) — đại vận
//  đang đi + chủ đề thập niên + 5 năm tới, luận từ lá số CỦA NGƯỜI CHƠI (R do
//  stations.js:709-713 truyền sẵn qua chartOf()). Ngày sinh chỉ nằm trên máy
//  (GAME-HUYEN-QUAN-SPEC.md §11 mục 4 :355) — module thuần logic, không DOM.
//
//  Luật map ngôn ngữ (§11 mục 3 :354, GAME-THIET-KE-CHOT.md P0-1): 6 mức rating
//  của liunian-pro.js:304-309 → 3 từ mềm; CẤM chữ «đại hung/tai họa/chết» ở câu
//  chính — chữ kỹ thuật (Hơi kỵ, Hung, điểm số, phán sâu) chỉ vào <details>.
//  Engine dùng: computeDayunPhase (liunian-pro.js:348), dayunGodMeaning
//  (dayun-god.js:25), analyzeLiunianDeep (liunian-pro.js:362), GAI_LEVELS
//  (remedy-fate.js:130).
// ============================================================================
import { computeDayunPhase, analyzeLiunianDeep } from '../engine/liunian-pro.js';
import { dayunGodMeaning } from '../engine/dayun-god.js';
import { GAI_LEVELS } from '../engine/remedy-fate.js';

export const SOFT_RATING = {
  'Đại cát': { tone: 'thuan', text: 'thuận — nên làm' },
  'Cát': { tone: 'thuan', text: 'thuận — nên làm' },
  'Bình': { tone: 'binh', text: 'bình thường' },
  'Hơi kỵ': { tone: 'thu', text: 'nên thủ, giữ sức' },
  'Hung': { tone: 'thu', text: 'nên thủ, giữ sức' },
  'Đại hung': { tone: 'thu', text: 'nên thủ, giữ sức' },
};

/** rating kỹ thuật của engine → từ mềm hiển thị ở câu chính (mặc định «bình thường»). */
export function softRating(rating) {
  return SOFT_RATING[rating] || SOFT_RATING['Bình'];
}

const activeDayun = (R, nowYear) =>
  (Array.isArray(R?.dayun) ? R.dayun : []).find((d) => d && d.startYear != null && d.startYear <= nowYear && nowYear < d.startYear + 10) || null;

/**
 * @param R        analyze() của người chơi (đã có chart/dayun/yong)
 * @param nowYear  năm dương lịch hiện tại
 * @returns {{ dayun, godDecade, years:[5], advice }} — dayun/godDecade null khi chưa vào đại vận đầu.
 */
export function buildNamHan(R, nowYear = new Date().getFullYear()) {
  // 5 năm tới — mỗi năm 1 object: câu chính chỉ dùng từ mềm, phần kỹ thuật để tra cứu
  const years = [];
  for (let i = 0; i < 5; i++) {
    const d = analyzeLiunianDeep(R, nowYear + i);
    years.push({
      year: d.year,
      ganZhi: d.ganZhi,
      soft: softRating(d.rating),   // câu chính — không cấm chữ
      score: d.score,
      rating: d.rating,             // kỹ thuật — chỉ vào <details>
      ganGod: d.ganGod || '',
      deep: d.advice || '',         // phán sâu engine — chỉ vào <details>
    });
  }

  // Đại vận đang đi: 进气/旺气/退气 + % lực realised (computeDayunPhase trả null khi chưa vào vận)
  const dy = activeDayun(R, nowYear);
  const dayun = computeDayunPhase(R.dayun, nowYear);
  const godDecade = dy
    ? (dayunGodMeaning(R.chart, R.dayun).items.find((g) => g.ganZhi === dy.ganZhi && g.startYear === dy.startYear) || null)
    : null;

  // 1 câu advice — nguyên liệu GAI_LEVELS (remedy-fate.js:130), tầng 改运 (bề mặt,
  // đúng phạm vi game: không hứa 改命 một sớm một chiều).
  const g = GAI_LEVELS[0];
  const advice = `${g.lv}: ${g.methods} — ${g.time}.`;

  return { dayun, godDecade, years, advice };
}
