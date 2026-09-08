// ═══ [LANDING v2 — HOÀNH TRÁNG] Màn đầu sau form: Thiên Thời 12 giờ + Quote cổ + Sample + Marquee ═══
//   Nghiên cứu Co-Star/Pattern: giá trị tức thì + tín hiệu uy tín + personalization preview.
//   Form nhập VẪN ĐỨNG TRÊN ĐÙNG (yêu cầu user) — band trang trí nằm dưới form.
import { Solar } from 'lunar-javascript';
import { huangdao12 } from './engine/huangdao.js';
import { luckyHours } from './engine/lucky-hours.js';
import { analyzeDaySpecial } from './engine/zheri-stars.js';
import { REMEDY_QUOTES } from './engine/remedy-fate.js';

const _GOLD = '#d4af37';
const _ZHODIAC = { 子: '鼠', 丑: '牛', 寅: '虎', 卯: '兔', 辰: '龙', 巳: '蛇', 午: '马', 未: '羊', 申: '猴', 酉: '鸡', 戌: '狗', 亥: '猪' };

function _esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

function _injectStyles() {
  if (document.getElementById('ld-styles')) return;
  const st = document.createElement('style');
  st.id = 'ld-styles';
  st.textContent = `
  .ld-hero-band{position:relative;border:1px solid rgba(212,175,55,.35);border-radius:14px;padding:18px 20px;background:linear-gradient(160deg,rgba(212,175,55,.07),rgba(0,0,0,.25));overflow:hidden}
  .ld-hero-band:before{content:'';position:absolute;inset:0;background:radial-gradient(600px 200px at 80% -40%,rgba(212,175,55,.12),transparent);pointer-events:none}
  .ld-title{font-size:16px;font-weight:800;color:${_GOLD};letter-spacing:1px;display:flex;align-items:center;gap:8px}
  .ld-title .zh{font-size:18px;opacity:.9}
  .ld-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:12px}
  .ld-tile{background:rgba(0,0,0,.3);border:1px solid rgba(212,175,55,.2);border-radius:10px;padding:12px;text-align:center;transition:transform .15s,border-color .15s}
  .ld-tile:hover{transform:translateY(-2px);border-color:${_GOLD}}
  .ld-big{font-size:22px;font-weight:800;color:var(--gold,${_GOLD})}
  .ld-zh-big{font-size:26px;font-weight:700;color:var(--gold,${_GOLD})}
  .ld-sub{font-size:11px;color:var(--muted,#9a8a6a);margin-top:2px}
  .ld-hours{display:grid;grid-template-columns:repeat(12,minmax(44px,1fr));gap:4px;margin-top:12px}
  .ld-h{border-radius:8px;padding:6px 2px;text-align:center;font-size:10px;line-height:1.35;border:1px solid transparent}
  .ld-h.cat{background:rgba(127,191,127,.12);border-color:rgba(127,191,127,.35);color:#a5d6a5}
  .ld-h.hung{background:rgba(224,83,61,.1);border-color:rgba(224,83,61,.3);color:#d98a7a}
  .ld-h.binh{background:rgba(212,175,55,.07);border-color:rgba(212,175,55,.18);color:var(--muted,#9a8a6a)}
  .ld-h.now{outline:2px solid ${_GOLD};outline-offset:1px}
  .ld-h b{display:block;font-size:12px}
  .ld-quote{text-align:center;padding:14px 18px;background:rgba(0,0,0,.3);border-radius:10px;border:1px dashed rgba(212,175,55,.3);margin-top:14px;position:relative}
  .ld-quote:before{content:'「';position:absolute;left:8px;top:2px;font-size:22px;color:${_GOLD};opacity:.6}
  .ld-quote:after{content:'」';position:absolute;right:8px;bottom:2px;font-size:22px;color:${_GOLD};opacity:.6}
  .ld-marquee{overflow:hidden;margin-top:14px;border-top:1px solid rgba(212,175,55,.12);border-bottom:1px solid rgba(212,175,55,.12);padding:7px 0}
  .ld-marquee-inner{display:inline-block;white-space:nowrap;animation:ld-scroll 28s linear infinite;font-size:12px;color:var(--muted,#9a8a6a)}
  .ld-marquee-inner b{color:var(--gold,${_GOLD});margin:0 14px}
  @keyframes ld-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  .ld-cta{margin-top:14px;text-align:center;background:linear-gradient(135deg,rgba(212,175,55,.12),rgba(212,175,55,.04));border:1px solid rgba(212,175,55,.35);border-radius:12px;padding:14px}
  .ld-stats{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:10px}
  .ld-chip{padding:4px 12px;border-radius:14px;font-size:11px;border:1px solid rgba(212,175,55,.25);color:var(--gold,${_GOLD})}
  `;
  document.head.appendChild(st);
}

export function initLanding({ onSample } = {}) {
  if (typeof document === 'undefined') return;
  const formCard = document.querySelector('.form-card');
  if (!formCard || document.getElementById('landing-live')) return;
  _injectStyles();

  const now = new Date();
  const y = now.getFullYear(), mo = now.getMonth() + 1, da = now.getDate(), hNow = now.getHours();
  const solar = Solar.fromDate(now);
  const lunar = solar.getLunar();
  const dayGZ = lunar.getDayInGanZhi();
  const dayZhi = dayGZ[1];
  const dayAnimal = _ZHODIAC[dayZhi] || '';
  const yearAnimal = _ZHODIAC[lunar.getYearInGanZhi()[1]] || '';

  let hd = null;
  try { hd = huangdao12(y, mo, da); } catch (_) {}

  let hours = [];
  try { hours = (luckyHours(y, mo, da).hours || []).slice(0, 12); } catch (_) {}
  const curZhi = ['子','丑','丑','寅','寅','卯','卯','辰','辰','巳','巳','午','午','未','未','申','申','酉','酉','戌','戌','亥','亥','子'][hNow] || '';

  let specialStr = '';
  try {
    const ds = analyzeDaySpecial(y, mo, da);
    specialStr = (ds.special || []).map((x) => x.typeVi || x.type).slice(0, 3).join(' · ');
  } catch (_) {}

  let quote = null;
  try { quote = REMEDY_QUOTES[(y * 372 + mo * 31 + da) % REMEDY_QUOTES.length]; } catch (_) {}

  const card = document.createElement('section');
  card.className = 'card';
  card.id = 'landing-live';
  card.style.borderColor = 'rgba(212,175,55,0.45)';

  const hourTile = (h) => {
    const tone = h.tone === 'cat' ? 'cat' : h.tone === 'hung' ? 'hung' : 'binh';
    const isNow = h.zhi === curZhi;
    return `<div class="ld-h ${tone} ${isNow ? 'now' : ''}" title="${_esc(h.deityVi || '')} · ${_esc(h.officerVi || '')}直"><b>${_esc(h.zhi)}</b>${_esc((h.deityVi || '').slice(0, 4))}<br>${h.road === 'yellow' ? '☀' : h.road === 'black' ? '☾' : '–'} ${_esc(h.officerVi || '')}</div>`;
  };

  card.innerHTML = `
    <div class="ld-hero-band">
      <div class="ld-title">🌟 THIÊN THỜI HÔM NAY <span class="zh">今日天时</span>
        <span style="margin-left:auto;font-size:11px;font-weight:400;opacity:.7">${_esc(solar.toYmd())}</span>
      </div>
      <div class="ld-grid">
        <div class="ld-tile"><div class="ld-zh-big">${_esc(dayGZ)}</div><div class="ld-sub">Ngày ${_esc(dayAnimal)} · can-chi trực tiếp</div></div>
        <div class="ld-tile"><div class="ld-big">七月廿七</div><div class="ld-sub">Âm lịch · năm ${_esc(lunar.getYearInGanZhi())} (${_esc(yearAnimal)})</div></div>
        <div class="ld-tile"><div class="ld-big">${hd ? _esc(hd.deityVi) : '—'}</div><div class="ld-sub">${hd ? (hd.road === 'yellow' ? '☀ 黄道 — CÁT' : '☾ 黑道 — HẠN') : ''}</div></div>
        <div class="ld-tile"><div class="ld-big">${_esc(hd && hd.domain ? hd.domain : '—')}</div><div class="ld-sub">Ưu thế hôm nay</div></div>
      </div>
      ${specialStr ? `<div class="hint" style="margin-top:8px;font-size:12px">✨ Sao đặc biệt: <b style="color:${_GOLD}">${_esc(specialStr)}</b></div>` : ''}
      <div class="ld-sub" style="margin-top:10px;font-size:12px">⏳ 12 GIỜ HÔM NAY (vàng ring = giờ đang chạy · ☀ cát · ☾ hung)</div>
      <div class="ld-hours">${hours.map(hourTile).join('')}</div>
      <div class="ld-quote">
        <div class="zh" style="font-size:15px;color:${_GOLD}">${_esc(quote && quote.han || '')}</div>
        <div style="font-size:13px;margin-top:4px">${_esc(quote && quote.vi || '')}</div>
        <div class="hint" style="font-size:11px;margin-top:2px">— ${_esc(quote && quote.src || 'cổ nhân')} · quote đổi theo ngày</div>
      </div>
      <div class="ld-cta">
        <div style="font-size:14px;font-weight:700;color:${_GOLD}">✨ Trải nghiệm ngay — lá số trình diễn 30 giây</div>
        <div class="hint" style="font-size:11px;margin:4px 0 10px">Đầy đủ Chuỗi Lập Luận Cổ Pháp + Neo Score tự kiểm chứng · không cần nhập gì</div>
        <button type="button" class="btn" id="landing-sample" style="font-size:14px;padding:9px 22px">🚀 Mở lá số mẫu</button>
      </div>
      <div class="ld-stats">
        <span class="ld-chip">📚 1523 cổ kinh</span>
        <span class="ld-chip">🏛 Trích dẫn cổ bản mỗi kết luận</span>
        <span class="ld-chip">🎯 Neo Score tự kiểm chứng</span>
        <span class="ld-chip">🧮 245 module cổ pháp</span>
      </div>
      <div class="ld-marquee"><div class="ld-marquee-inner">
        <b>子平真诠</b> ✦ <b>穷通宝鉴</b> ✦ <b>三命通会</b> ✦ <b>渊海子平</b> ✦ <b>滴天髓</b> ✦ <b>神峰通考</b> ✦ <b>兰台妙选</b> ✦ <b>千里命稿</b> ✦ <b>子平真诠</b> ✦ <b>穷通宝鉴</b> ✦ <b>三命通会</b> ✦ <b>渊海子平</b> ✦ <b>滴天髓</b> ✦ <b>神峰通考</b> ✦
      </div></div>
    </div>`;

  // Chèn SAU form (form giữ vị trí đầu tiên sau hero — yêu cầu user)
  formCard.insertAdjacentElement('afterend', card);

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
