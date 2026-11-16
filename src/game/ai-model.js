// ============================================================================
//  MÔ HÌNH AI CỦA GAME — một chỗ duy nhất (client lẫn Worker cùng import).
//  Quyết định chủ dự án 2026-11-16: mọi lượt AI trong game (khung thầy bói, NPC chat, giám khảo
//  kinh tế, bộ đánh giá persona) chỉ dùng glm-5.3-flash. Thầy trên trang chính của app không đổi
//  (vẫn theo cấu hình AI của người dùng).
//  Thuần dữ liệu, không DOM, không env → test được bằng node.
// ============================================================================

export const GAME_AI_MODEL = 'glm-5.3-flash';

/** Mô hình z.ai mà proxy /zai chấp nhận từ client; còn lại quy về mặc định của app. */
export const ZAI_MODELS = ['glm-5.3', GAME_AI_MODEL];
export const ZAI_DEFAULT_MODEL = 'glm-5.3';

/** Proxy /zai chọn mô hình theo yêu cầu của client, chỉ trong danh sách cho phép. */
export function pickZaiModel(requested) {
  return ZAI_MODELS.includes(requested) ? requested : ZAI_DEFAULT_MODEL;
}

/** Yêu cầu xin mô hình của game thì chỉ chạy đúng mô hình đó — không rơi sang pool mô hình khác. */
export const gameModelOnly = (model) => model === GAME_AI_MODEL;

/**
 * Cấu hình askAI cho khung thầy bói trong game: luôn đi proxy /zai của app với GAME_AI_MODEL.
 * Giữ công tắc bật/tắt AI của người dùng (base.enabled), bỏ khoá và mô hình riêng của họ.
 */
export function gameAiConfig(base = {}) {
  return { enabled: base?.enabled !== false, endpoint: '/zai/api/paas/v4', apiKey: '', model: GAME_AI_MODEL, preset: 'game' };
}

/**
 * Cổng đánh giá persona (VC-005) chứng nhận cho MỘT mô hình. Đổi GAME_AI_MODEL mà chưa chạy lại cổng
 * thì giọng persona tự tắt (features.js). Chạy lại: scripts/eval-persona.mjs --live --origin <app>
 * (mặc định dùng GAME_AI_MODEL); đạt thì ghi mô hình và ngày vào đây.
 */
export const PERSONA_GATE = { model: 'glm-5.3', passed: '2026-11-16', note: 'scripts/eval-persona-review.json' };
export const personaGatePassed = (model = GAME_AI_MODEL) => PERSONA_GATE.model === model;
