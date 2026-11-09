// ============================================================================
//  MAP RATING 6 MỨC → TỪ MỀM (docs/npc-ai/06-bo-loc-hau-xu-ly-v1-v8.md §6.2 —
//  pseudo-code «mẫu bắt buộc»; docs/GAME-NPC-AI-THIET-KE-DAY-DU.md G0 mục
//  15.5d) — helper thuần: 6 mức rating lưu niên của engine
//  (liunian-pro.js:304-309) map về 3 nhãn mềm hiển thị
//  «Thuận — nên làm» / «Bình thường» / «Nên thủ, giữ sức».
//
//  Luật chốt (GAME-HUYEN-QUAN-SPEC.md §11 mục 3 :354 qua GAME-THIET-KE-CHOT
//  P0-1/P0-2): CẤM chữ «đại hung / đại hạn / tai họa / chết» ở lớp hiển thị —
//  chữ kỹ thuật (rating gốc, điểm số) chỉ hiện trong <details>. Một nhãn duy
//  nhất, không hai thang song song (sổ sửa lỗi :139 — map 6 mức → 3 lựa chọn).
//
//  Khuôn theo gu-gongan.js / namhan.js (softRating — SOFT_RATING): thuần logic,
//  không DOM, không mạng, không state — test: scripts/test-map-rating.mjs.
// ============================================================================

// Danh sách chữ cấm ở lớp hiển thị (mục 06 §6.2 — mẫu bắt buộc)
export const FORBIDDEN = ['đại hung', 'tai họa', 'tai hoạ', 'chết'];

// 6 mức của engine — NEO ĐÚNG ngưỡng liunian-pro.js:304-309:
//   score >= 70 → 'Đại cát' · >= 56 → 'Cát' · >= 36 → 'Bình'
//   score >= 22 → 'Hơi kỵ' · >= 10 → 'Hung' · còn lại → 'Đại hung'
// (điểm đã bị engine kẹp 2–98 tại liunian-pro.js:299 trước khi vào thang)
export const RATING_LEVELS = [
  { min: 70, rating: 'Đại cát' },
  { min: 56, rating: 'Cát' },
  { min: 36, rating: 'Bình' },
  { min: 22, rating: 'Hơi kỵ' },
  { min: 10, rating: 'Hung' },
  { min: -Infinity, rating: 'Đại hung' },
];

// rating kỹ thuật → bậc thang 3 cụm — cùng bảng TONE_OF của npc-deep.js:24-28
// (Đại cát + Cát → thuan; Bình → binh; Hơi kỵ + Hung + Đại hung → giu).
// Bậc cho bước khai dùng order ['thuan','binh','giu'] để chọn kề thang được
// 0,4/độ (gradeStep — halls.js:32-45), giữ nguyên khuôn P0-2.
export const TONE_OF = {
  'Đại cát': 'thuan', 'Cát': 'thuan',
  'Bình': 'binh',
  'Hơi kỵ': 'giu', 'Hung': 'giu', 'Đại hung': 'giu',
};

// 3 cụm từ mềm (một nhãn duy nhất — không thang song song)
export const SOFT_LABELS = { thuan: 'Thuận — nên làm', binh: 'Bình thường', giu: 'Nên thủ, giữ sức' };
export const TONE_ORDER = ['thuan', 'binh', 'giu'];

/**
 * Điểm → mức engine. GƯƠNG (mirror) thuần của liunian-pro.js:299+304-309 —
 * không gọi engine, không đổi ngưỡng. Giá trị ngoài thang → mức an toàn gần
 * nhất: kẹp 2–98 đúng như engine (:299) rồi rơi đúng nhánh ngưỡng.
 */
export function ratingOfScore(score) {
  const s = Math.max(2, Math.min(98, Math.round(Number(score) || 0)));
  return RATING_LEVELS.find((l) => s >= l.min).rating;
}

/**
 * mapRating(6→3) — mục 06 §6.2 (mẫu bắt buộc): rating engine → nhãn mềm hiển thị.
 * @param rating mức engine ('Đại cát'…'Đại hung'); null nhưng CÓ score → suy
 *               theo đúng thang 304-309; chuỗi lạ → «Bình thường» (mức an toàn,
 *               cùng khuôn softRating của namhan.js:28-29)
 * @param score  điểm lưu niên — chỉ để suy mức / tra cứu, không lên câu chính
 * @returns {{ nhãn, tone, details: { rating, score, ghi } }}
 *          nhãn  : câu chính lớp hiển thị — chỉ từ mềm, không chữ cấm
 *          tone  : bậc thang thuan/binh/giu (kề thang 0,4 — TONE_ORDER)
 *          details: chữ kỹ thuật (rating gốc + điểm) — chỉ hiện trong <details>
 */
export function mapRating(rating, score) {
  let rt = rating;
  if (rt == null && score != null && Number.isFinite(Number(score))) rt = ratingOfScore(score);
  const tone = TONE_OF[rt] || 'binh';
  const nhãn = SOFT_LABELS[tone];
  if (FORBIDDEN.some((w) => nhãn.toLowerCase().includes(w)))
    throw new Error('Lớp hiển thị dính chữ cấm — xem lại mapRating');
  return {
    nhãn,
    tone,
    details: { rating: rt ?? 'Bình', score: score == null ? null : Number(score), ghi: 'kỹ thuật — chỉ hiện trong <details>' },
  };
}
