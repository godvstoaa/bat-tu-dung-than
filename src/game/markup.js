// Khung HTML của game — chèn vào bất kỳ host nào (game.html trên web, overlay trong vỏ iOS).
import { TEXT } from './features.js';

export function gameMarkup() {
  return `
<div class="hq-root">
  <section id="hq-gate" class="hq-gate" aria-labelledby="hq-gate-title">
    <div class="hq-gate-card">
      <p class="hq-gate-han" aria-hidden="true">${TEXT.han}</p>
      <h1 id="hq-gate-title">${TEXT.brand}</h1>
      <p class="hq-sub">${TEXT.gateLead}</p>
      <div class="hq-gate-body"></div>
      <p class="hq-fine">Dữ liệu chỉ lưu trên máy bạn. Nội dung để tham khảo và chiêm nghiệm.</p>
      <button id="hq-gate-exit" class="hq-btn hq-gate-exit" type="button" hidden>← Quay lại</button>
    </div>
  </section>

  <section id="hq-game" class="hq-game" hidden>
    <header class="hq-hud">
      <button id="hq-exit" class="hq-hbtn icon" type="button" aria-label="Thoát khỏi quán" hidden>←</button>
      <div class="hq-id">
        <span id="hq-who" class="hq-who"></span>
        <span class="hq-chips">
          <span id="hq-phuc" class="hq-chip" title="${TEXT.point}"></span>
          <span id="hq-streak" class="hq-chip" title="Chuỗi ngày"></span>
          <button id="hq-online" class="hq-chip hq-online off" type="button" title="Người đang trong quán">Ngoại tuyến</button>
        </span>
      </div>
      <button id="hq-fly" class="hq-hbtn icon" type="button" hidden aria-label="Ngự kiếm phi hành">🗡️</button>
      <button id="hq-sound" class="hq-hbtn icon" type="button"></button>
    </header>
    <div class="hq-stage">
      <canvas id="hq-canvas" tabindex="0" aria-label="Sân quán. Phím mũi tên hoặc WASD để đi, E để vào gian; hoặc dùng nút Các gian."></canvas>
      <div id="hq-loading" class="hq-loading" hidden>Đang dựng ${TEXT.brand}…</div>
      <div id="hq-stick" class="hq-stick" aria-hidden="true"><div class="hq-stick-knob"></div></div>
      <button id="hq-prompt" class="hq-act" type="button" hidden></button>
    </div>
    <div id="hq-altpad" class="hq-altpad" hidden><button type="button" data-alt="up" aria-label="Bay lên">▲</button><button type="button" data-alt="down" aria-label="Hạ xuống">▼</button></div>
      <nav class="hq-dock" aria-label="Công cụ">
      <button id="hq-tasks-btn" class="hq-dbtn" type="button" aria-label="Nhiệm vụ hôm nay"></button>
      <button id="hq-social" class="hq-dbtn" type="button" aria-label="Giao lưu: cử chỉ và câu chào"><b aria-hidden="true">💬</b><span>Giao lưu</span></button>
      <button id="hq-menu" class="hq-dbtn" type="button" aria-label="Danh sách các gian"><b aria-hidden="true">☰</b><span>Các gian</span></button>
      <button id="hq-book" class="hq-dbtn" type="button" aria-label="${TEXT.book}"><b aria-hidden="true">📜</b><span>${TEXT.book}</span></button>
    </nav>
    <p class="hq-help">WASD / mũi tên để đi · click để đi tới · kéo để xoay, lăn chuột để gần/xa · <kbd>Q</kbd>/<kbd>R</kbd> xoay 45° · <kbd>E</kbd> vào gian · <kbd>Esc</kbd> đóng</p>
  </section>

  <div id="hq-panel" class="hq-panel" hidden>
    <div class="hq-panel-card" role="dialog" aria-modal="true" aria-labelledby="hq-panel-title">
      <div class="hq-grab" aria-hidden="true"></div>
      <div class="hq-panel-head">
        <h2 id="hq-panel-title"></h2>
        <button id="hq-panel-close" class="hq-hbtn icon" type="button" aria-label="Đóng">✕</button>
      </div>
      <div id="hq-panel-body" class="hq-panel-body"></div>
    </div>
  </div>
  <div id="hq-toasts" class="hq-toasts" aria-live="polite"></div>
</div>`;
}
