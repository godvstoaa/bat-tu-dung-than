// ============================================================================
//  Khung khủng hoảng trong game — dùng chung cho khung hỏi thầy bói và khung trò chuyện NPC.
//  Luật hiển thị: docs/npc-ai/11-khung-hoang-crisis.md §11.2–11.4 — giữ khung thoại, chữ đổi sang phông
//  giao diện, đúng một câu rời vai, rồi khối hỗ trợ cố định; khung nhập khoá tới khi người chơi bấm nút.
//  Văn bản và bộ nhận tín hiệu: src/engine/crisis.js (một chỗ duy nhất).
// ============================================================================
import { crisisBlock, crisisCheck, crisisReply, setCrisisFlag, CRISIS_BUTTONS, CRISIS_B_STRIP } from '../engine/crisis.js';

/**
 * Xét câu người chơi trước mọi lời gọi AI. Có tín hiệu → vẽ khung khủng hoảng vào `log`, khoá `lock`
 * (ô nhập + nút) tới khi bấm nút, bật cờ phiên 30 phút, trả true (lượt bị chặn). Không gọi mạng.
 */
export function guardCrisis(text, { log, lock = [], personaId = null, onDone = null } = {}) {
  const level = crisisBlock(text);
  if (!level) return false;
  setCrisisFlag(level);
  const r = crisisReply(level, personaId);
  const box = document.createElement('div');
  box.className = 'hq-crisis';
  box.setAttribute('role', 'alert');
  const p = document.createElement('p');
  p.className = 'hq-crisis-line';
  p.textContent = r.line;
  const b = document.createElement('div');
  b.className = 'hq-crisis-block';
  b.textContent = r.block;
  const row = document.createElement('div');
  row.className = 'hq-crisis-btns';
  const set = (on) => lock.forEach((x) => { if (x) x.disabled = on; });
  set(true);
  for (const label of CRISIS_BUTTONS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hq-btn';
    btn.textContent = label;
    btn.onclick = () => { set(false); row.remove(); onDone?.(label); };
    row.append(btn);
  }
  box.append(p, b, row);
  log?.append(box);
  box.scrollIntoView?.({ block: 'nearest' });
  return true;
}

/** Mức B: lượt vẫn đi tiếp, nhưng dưới câu trả lời hiện một dải hỗ trợ nhỏ (06-01 §11.1). */
export function crisisStrip(text) {
  if (crisisCheck(text) !== 'B') return null;
  const p = document.createElement('p');
  p.className = 'hq-crisis-strip';
  p.textContent = CRISIS_B_STRIP;
  return p;
}
