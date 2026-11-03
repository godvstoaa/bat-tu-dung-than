// ============================================================================
//  mountGame(host, { onExit }) — điểm gắn duy nhất cho mọi nền tảng.
//  Web: game.html gọi không có onExit. iOS: vỏ Lữ Đăng mở overlay, truyền onExit
//  để quay về tab trước. Gọi lại lần 2 trên cùng host → chỉ resume, không dựng lại.
// ============================================================================
import './game.css';
import { gameMarkup } from './markup.js';
import { startGame } from './main.js';

let instance = null;

export function mountGame(host, opts = {}) {
  if (instance) { instance.resume(); return instance; }
  host.innerHTML = gameMarkup();
  instance = startGame(opts);
  return instance;
}
