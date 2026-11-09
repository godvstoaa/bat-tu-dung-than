// ============================================================================
//  ĐƯỜNG THẦY · TAB «CHỌN KINH» (docs/GAME-THIET-KE-CHOT.md P0-1) — Đạo Tạng gợi
//  kinh theo Dụng Thần + cách cục + việc đang hỏi. Module thuần logic, không DOM.
//
//  Engine: suggestDaozangChartAware (daozang-data.js:7957) đọc R?.yong?.god
//  (daozang-data.js:7962) trong khi game R mang Dụng ở R.yong.primary → gọi qua
//  shim { yong: { god: R.yong.primary } } (lách lỗi L14, Q6 — KHÔNG sửa engine
//  trong đợt nội dung). Không có câu hỏi → chỉ nhánh Dụng thần + cách cục.
//  Trả mảng kinh { name_vi, essence, notes } — que-ui render.
// ============================================================================
import { suggestDaozangChartAware } from '../engine/daozang-data.js';

// R.pattern.name của game là phồn thể (七殺格/傷官格/偏財格…) còn bảng cách cục của
// engine dùng giản thể (七杀格…) — game-side normalize, không đụng engine (Q6).
const SIMPLIFY = { '殺': '杀', '傷': '伤', '財': '财' };
const simplifyGe = (name) => String(name || '').replace(/[殺傷財]/g, (ch) => SIMPLIFY[ch] || ch);

/**
 * @param R         analyze() của người chơi — null thì chỉ gợi kinh theo câu hỏi
 * @param question  việc người chơi đang hỏi (rỗng → bỏ nhánh kinh-theo-câu-hỏi)
 * @returns {{ kinh:[{name_vi, essence, notes, han}], yongAdvice, chartAdvice, amtaAdvice }}
 */
export function kinhTu(R, question = '') {
  const shim = {
    yong: { god: R?.yong?.primary || null },
    pattern: R?.pattern ? { ...R.pattern, name: simplifyGe(R.pattern.name) } : null,
    amta: R?.amta || null,
  };
  const q = String(question || '').trim();
  const out = suggestDaozangChartAware(shim, q || null);
  return {
    kinh: (out.kinh || []).map((k) => ({
      name_vi: k.name_vi || '',
      han: k.name_han || '',
      essence: k.essence || '',
      notes: k.notes || '',
    })),
    yongAdvice: out.yongAdvice || '',
    chartAdvice: out.chartAdvice || '',
    amtaAdvice: out.amtaAdvice || '',
  };
}
