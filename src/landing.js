// ═══ [LANDING v1] Màn hình đầu SẼNG ĐỘNG — giá trị tức thì không cần nhập ngày sinh ═══
//   Nghiên cứu Co-Star/Pattern: app hàng đầu đưa (1) năng lượng hôm nay + (2) tín hiệu
//   uy tín + (3) personalization preview lên landing TRƯỚC khi yêu cầu nhập liệu.
//   App có vũ khí riêng: engine tính được can-chi/ngày/直/giờ-cát từ NGÀY HIỆN TẠI
//   (không cần birth) + kho 1523 cổ kinh + corpus chuẩn 94% khớp cổ điển.
import { Solar } from 'lunar-javascript';
import { huangdao12 } from './engine/huangdao.js';
import { luckyHours } from './engine/lucky-hours.js';
import { REMEDY_QUOTES } from './engine/remedy-fate.js';

const _GOLD = '#d4af37';

function _esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

export function initLanding({ onSample } = {}) {
  if (typeof document === 'undefined') return;
  const formCard = document.querySelector('.form-card');
  if (!formCard || document.getElementById('landing-live')) return;

  const now = new Date();
  const y = now.getFullYear(), mo = now.getMonth() + 1, da = now.getDate();
  const solar = Solar.fromDate(now);
  const lunar = solar.getLunar();
  const dayGZ = lunar.getDayInGanZhi();

  // 黄 đạo hôm nay
  let hd = null;
  try { hd = huangdao12(y, mo, da); } catch (_) {}

  // Giờ cát hôm nay (lucky-hours — không cần lá số)
  let catHours = [];
  try {
    const lh = luckyHours(y, mo, da);
    catHours = (lh.catHours || []).slice(0, 3).map((h) => {
      const range = h.range || (h.start != null && h.end != null ? `${h.start}-${h.end}h` : '');
      return `${_esc(h.vi || h.name || '?')}${range ? ' (' + _esc(range) + ')' : ''}`;
    }).filter(Boolean);
  } catch (_) {}

  // Quote cổ theo ngày (deterministic — đổi mỗi ngày)
  let quote = null;
  try { quote = REMEDY_QUOTES[(y * 372 + mo * 31 + da) % REMEDY_QUOTES.length]; } catch (_) {}

  const card = document.createElement('section');
  card.className = 'card';
  card.id = 'landing-live';
  card.style.borderColor = 'rgba(212,175,55,0.45)';

  const hdHtml = hd
    ? `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
         <span style="padding:3px 10px;border-radius:12px;font-size:12px;border:1px solid ${hd.road === 'yellow' ? 'rgba(127,191,127,.5)' : 'rgba(224,83,61,.5)'};color:${hd.road === 'yellow' ? '#7fbf7f' : '#e0533d'}">${hd.road === 'yellow' ? '☀ 黄道' : '☾ 黑道'} · ${_esc(hd.deityVi)}</span>
         <span class="hint" style="font-size:12px">${_esc(hd.meaning || '').slice(0, 70)}</span>
       </div>`
    : '';

  const gioHtml = catHours.length
    ? `<div class="hint" style="font-size:12px">⏰ Giờ cát: <b style="color:${_GOLD}">${catHours.join(' · ')}</b></div>`
    : '';

  const quoteHtml = quote
    ? `<div style="margin-top:10px;padding:8px 12px;background:rgba(212,175,55,.06);border-left:3px solid ${_GOLD};border-radius:0 8px 8px 0">
         <span class="zh" style="color:${_GOLD};font-size:13px">${_esc(quote.han || '')}</span><br>
         <span style="font-size:12px;opacity:.85">${_esc(quote.vi || '')}</span>
         <span class="hint" style="font-size:11px"> — ${_esc(quote.src || '')}</span>
       </div>`
    : '';

  card.innerHTML = `
    <h3 class="card-title">🌌 Hôm nay <span class="zh">今日</span> <span class="hint-inline">(âm lịch ${_esc(lunar.getMonthInChinese())}月${_esc(lunar.getDayInChinese())} · năm ${_esc(lunar.getYearInGanZhi())})</span></h3>
    <div style="display:flex;flex-direction:column;gap:6px">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <span style="padding:3px 10px;border-radius:12px;font-size:12px;border:1px solid rgba(212,175,55,.35);color:${_GOLD}">Ngày ${_esc(dayGZ)}</span>
        <span style="padding:3px 10px;border-radius:12px;font-size:12px;border:1px solid rgba(212,175,55,.22);color:var(--text)">Tháng ${_esc(lunar.getMonthInGanZhi())}</span>
      </div>
      ${hdHtml}
      ${gioHtml}
    </div>
    ${quoteHtml}
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px">
      <span class="hint" style="padding:3px 9px;border:1px solid rgba(212,175,55,.18);border-radius:12px;font-size:11px">📚 1523 cổ kinh</span>
      <span class="hint" style="padding:3px 9px;border:1px solid rgba(212,175,55,.18);border-radius:12px;font-size:11px">🏛 Trích dẫn cổ bản mỗi kết luận</span>
      <span class="hint" style="padding:3px 9px;border:1px solid rgba(212,175,55,.18);border-radius:12px;font-size:11px">🎯 Tự kiểm chứng Neo Score</span>
    </div>
    <div style="margin-top:10px">
      <button type="button" class="btn" id="landing-sample">✨ Xem lá số mẫu — trải nghiệm 30 giây</button>
      <span class="hint" style="font-size:11px;margin-left:6px">(không cần nhập gì — lá số trình diễn đầy đủ chuỗi lập luận)</span>
    </div>`;

  formCard.parentNode.insertBefore(card, formCard);

  const sampleBtn = card.querySelector('#landing-sample');
  if (sampleBtn && typeof onSample === 'function') {
    sampleBtn.addEventListener('click', () => {
      const dEl = document.getElementById('date');
      const tEl = document.getElementById('time');
      const g = document.getElementById('g-nam');
      if (dEl) dEl.value = '1990-06-15';
      if (tEl) tEl.value = '10:00';
      if (g) g.checked = true;
      onSample();
    });
  }
}
