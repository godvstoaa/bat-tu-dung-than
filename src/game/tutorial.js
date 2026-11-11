// ============================================================================
//  HƯỚNG DẪN TÂN THỦ (v4 · G3) — chuỗi 8 bước dắt người mới qua trục chính của game (xem bói theo lá số của mình)
//  rồi tới đi lại, mua bán, làm việc, miếu, nhà. Mỗi bước một phần thưởng nhỏ; bỏ qua được bất cứ lúc nào.
//  Module THUẦN: trạng thái nằm ở state.tutorial = { step, done, skipped, got: [] }. UI gọi advance(state, event).
// ============================================================================

export const STEPS = [
  { id: 'chart', event: 'chart', title: 'Lập lá số', hint: 'Khắc bát tự của bạn ở cổng quán — mọi thầy bói trong thành sẽ xem theo lá số này.', reward: 5 },
  { id: 'ask', event: 'askMaster', title: 'Hỏi Thầy Tử Bình một câu', hint: 'Tới Bàn Thầy Tử Bình ở Sơn Môn, gõ bất kỳ câu hỏi nào về đời mình — thầy trả lời theo lá số.', station: 'thay', reward: 10 },
  { id: 'que', event: 'que', title: 'Xem quẻ ngày', hint: 'Mở Bảng Lịch xem hôm nay thuận hay nên thủ, giờ nào tốt.', station: 'lich', reward: 5 },
  { id: 'travel', event: 'travel', title: 'Đi xe ngựa', hint: 'Thành rộng hơn 4 km — bấm bản đồ nhỏ góc trên bên phải, chọn một trạm xe ngựa (chấm đỏ) để tới nơi trong chớp mắt.', reward: 5 },
  { id: 'buy', event: 'buy', title: 'Mua một món ở tiệm', hint: 'Nhà mặt đường là cửa hàng — vào một tiệm, hỏi chủ tiệm và mua thử một món.', reward: 5 },
  { id: 'shift', event: 'shift', title: 'Nhận một ca việc', hint: 'Mỗi tiệm treo bảng Chiêu công sát cửa — nhận một ca để kiếm tiền.', reward: 5 },
  { id: 'pray', event: 'pray', title: 'Thắp hương ở một miếu', hint: 'Mỗi miếu thờ một vị thần, có thầy giữ miếu xem bói riêng (xin xăm, tài vận, hạn năm…).', reward: 5 },
  { id: 'estate', event: 'estate', title: 'Xem một căn nhà rao bán', hint: 'Nhà treo biển BÁN — vào xem giá, mua về bày phong thủy để mỗi ngày nhận Phúc Khí.', reward: 10 },
];

export function tutState(state) {
  if (!state.tutorial || typeof state.tutorial !== 'object') state.tutorial = { step: 0, done: false, skipped: false, got: [] };
  if (!Array.isArray(state.tutorial.got)) state.tutorial.got = [];
  return state.tutorial;
}
export const active = (state) => { const t = tutState(state); return !t.done && !t.skipped; };
export const current = (state) => (active(state) ? STEPS[tutState(state).step] || null : null);

/**
 * Báo một sự kiện. Sự kiện của bước HIỆN TẠI → qua bước, trả { reward, step, finished }.
 * Sự kiện của bước sau (người chơi làm trước) → ghi nhận, khi tới bước đó tự qua luôn.
 */
export function advance(state, event) {
  const t = tutState(state);
  if (t.done || t.skipped) return null;
  if (!t.got.includes(event) && STEPS.some((s) => s.event === event)) t.got.push(event);
  let reward = 0, moved = false;
  while (t.step < STEPS.length && t.got.includes(STEPS[t.step].event)) { reward += STEPS[t.step].reward; t.step++; moved = true; }
  if (t.step >= STEPS.length) t.done = true;
  return moved ? { reward, step: t.step, finished: t.done } : null;
}
export function skip(state) { const t = tutState(state); t.skipped = true; return t; }
/** người chơi cũ (đã có lá số + đã chơi): không bắt làm tân thủ */
export function isVeteran(state) { return (state.xp || 0) > 300 || (state.profiles || []).length > 1; }
