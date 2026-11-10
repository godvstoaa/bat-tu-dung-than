// ============================================================================
//  GIAO DIỆN TÀI KHOẢN — đăng nhập Google / mã email / mã SMS, trạng thái lưu đám mây, liên kết thêm,
//  đăng xuất, xuất dữ liệu, xoá tài khoản; bảng chọn bản lưu khi máy này chưa gắn tài khoản.
// ============================================================================
import { esc } from './stations.js';

const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
const ERR = {
  bad_email: 'Email chưa đúng định dạng.', bad_phone: 'Số điện thoại chưa đúng (số Việt Nam, vd 0912 345 678).',
  mail_off: 'Gửi mã qua email chưa được bật trên máy chủ.', sms_off: 'Đăng nhập bằng số điện thoại sắp có.',
  rate: 'Bạn xin mã nhiều quá — đợi vài phút rồi thử lại.', send_failed: 'Không gửi được mã, thử lại sau.',
  expired: 'Mã đã hết hạn, xin mã mới.', wrong: 'Mã chưa đúng.', locked: 'Nhập sai quá nhiều lần — xin mã mới.',
  taken: 'Danh tính này đã gắn với tài khoản khác.', offline: 'Không kết nối được máy chủ tài khoản.', off: 'Máy chủ tài khoản chưa bật.',
};
const errText = (r) => (r.err === 'wrong' && r.left ? `Mã chưa đúng (còn ${r.left} lần).` : ERR[r.err] || 'Có lỗi, thử lại sau.');
const when = (t) => (t ? new Date(t).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '—');

/** khối đăng nhập bằng mã (email / phone): bước 1 nhập định danh → bước 2 nhập mã */
function otpBox(acc, kind, { link = false, onDone }) {
  const isMail = kind === 'email';
  const box = el(`<form class="hq-acc-otp" novalidate>
    <label>${isMail ? 'Email' : 'Số điện thoại'}<input class="hq-input" name="key" type="${isMail ? 'email' : 'tel'}" autocomplete="${isMail ? 'email' : 'tel'}" placeholder="${isMail ? 'ban@vidu.com' : '0912 345 678'}" required></label>
    <div class="hq-acc-code" hidden><label>Mã 6 số<input class="hq-input" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="\\d{6}"></label></div>
    <p class="hq-acc-msg" role="status"></p>
    <div class="hq-actions"><button class="hq-btn hq-primary" type="submit">Gửi mã</button></div>
  </form>`);
  const msg = box.querySelector('.hq-acc-msg'), btn = box.querySelector('button'), codeRow = box.querySelector('.hq-acc-code');
  let sent = false, key = '';
  box.onsubmit = async (e) => {
    e.preventDefault(); btn.disabled = true; msg.textContent = '';
    if (!sent) {
      key = box.key.value.trim();
      const r = await acc.sendCode(kind, key);
      btn.disabled = false;
      if (!r.ok) { msg.textContent = errText(r); return; }
      sent = true; codeRow.hidden = false; box.key.readOnly = true; btn.textContent = 'Xác nhận';
      msg.textContent = r.dev ? `Máy dev — mã là ${r.dev}` : `Đã gửi mã tới ${key}. Mã có hiệu lực 10 phút.`;
      box.code.focus();
      return;
    }
    const r = await acc.verify(kind, key, box.code.value.trim(), link);
    btn.disabled = false;
    if (!r.ok) { msg.textContent = errText(r); return; }
    onDone(r);
  };
  return box;
}

/** bảng tài khoản (đăng nhập hoặc quản lý). api: { panel, toast }, acc: account.js, hooks: { onLogin, onLogout } */
export function accountBody(ui, acc, hooks) {
  const box = el('<div class="hq-acc"></div>');
  const cfg = acc.config || {};
  if (acc.native) { box.append(el('<p class="hq-note">Bản ứng dụng: đăng nhập tài khoản sẽ có ở bản cập nhật sau. Tiến độ vẫn lưu trên máy này.</p>')); return box; }
  if (!acc.config) { box.append(el(`<p class="hq-note">${ERR.offline} Bạn vẫn chơi được như khách — tiến độ lưu trên máy này.</p>`)); return box; }

  if (!acc.me) {
    box.append(el(`<p class="hq-note">Đăng nhập để lưu tiến độ theo tài khoản và chơi tiếp trên máy khác. Không cần mật khẩu.
      <b>Ngày giờ sinh không bao giờ rời máy bạn</b> — sang máy mới bạn nhập lại.</p>`));
    if (cfg.google) { const g = el('<button class="hq-btn hq-big hq-acc-google" type="button">Đăng nhập với Google</button>'); g.onclick = () => acc.google(); box.append(g); }
    const tabs = el('<div class="hq-acc-tabs"><button type="button" class="hq-btn on" data-k="email">Email</button><button type="button" class="hq-btn" data-k="phone">Số điện thoại</button></div>');
    const slot = el('<div></div>');
    const show = (k) => {
      tabs.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.k === k));
      if (k === 'phone' && !cfg.phone) { slot.replaceChildren(el(`<p class="hq-note">${ERR.sms_off}</p>`)); return; }
      if (k === 'email' && !cfg.email) { slot.replaceChildren(el(`<p class="hq-note">${ERR.mail_off}</p>`)); return; }
      slot.replaceChildren(otpBox(acc, k, { onDone: (r) => hooks.onLogin(r) }));
    };
    tabs.onclick = (e) => { const k = e.target.dataset?.k; if (k) show(k); };
    box.append(tabs, slot); show('email');
    if (cfg.dev) box.append(el('<p class="hq-fine">Chế độ máy dev: mã hiện ngay trên màn hình, không gửi thật.</p>'));
    return box;
  }

  const me = acc.me;
  box.append(el(`<div class="hq-acc-me">
    <p><b>${esc(me.name || 'Đạo hữu')}</b> · đăng nhập bằng ${me.ids.map((i) => esc(i.label)).join(', ')}</p>
    <p class="hq-sub">☁ ${acc.synced ? 'Đã lưu' : 'Đang chờ lưu'} · bản #${me.saveRev || 0} · ${when(me.saveAt)}</p>
    ${me.deleteAt ? `<p class="hq-warn">Tài khoản đang chờ xoá (${when(me.deleteAt)}). Đăng nhập lại là huỷ xoá.</p>` : ''}
  </div>`));
  const acts = el('<div class="hq-actions hq-acc-acts"></div>');
  const btn = (t, fn, cls = '') => { const b = el(`<button class="hq-btn ${cls}" type="button">${t}</button>`); b.onclick = fn; acts.append(b); return b; };
  btn('Lưu lên mây ngay', async (e) => { e.target.disabled = true; const r = await acc.push(true); e.target.disabled = false; ui.toast(r.ok ? '☁ Đã lưu tiến độ lên tài khoản.' : r.err === 'conflict' ? 'Máy khác vừa lưu bản mới hơn — mở lại game để chọn bản.' : errText(r)); ui.panel.open({ title: '☁ Tài khoản', body: accountBody(ui, acc, hooks) }); });
  const has = (k) => me.ids.some((i) => i.kind === k);
  if (cfg.google && !has('google')) btn('Gắn thêm Google', () => acc.google(true));
  if (cfg.email && !has('email')) btn('Gắn thêm email', () => { const f = otpBox(acc, 'email', { link: true, onDone: () => { ui.toast('Đã gắn email.'); ui.panel.open({ title: '☁ Tài khoản', body: accountBody(ui, acc, hooks) }); } }); acts.after(f); });
  btn('Xuất dữ liệu', () => { window.open(acc.exportUrl, '_blank', 'noopener'); });
  btn('Đăng xuất', async () => { await acc.logout(); hooks.onLogout(); });
  box.append(acts);
  const del = el(`<details class="hq-acc-del"><summary>Xoá tài khoản</summary>
    <p class="hq-note">Tài khoản bị khoá 7 ngày rồi xoá vĩnh viễn cùng bản lưu đám mây. Đăng nhập lại trong 7 ngày là huỷ xoá. Tiến độ trên máy này vẫn còn.</p>
    <label>Gõ <b>XOA</b> để xác nhận<input class="hq-input" name="c" autocomplete="off"></label>
    <div class="hq-actions"><button class="hq-btn hq-danger" type="button">Xoá tài khoản</button></div></details>`);
  del.querySelector('button').onclick = async () => {
    if (del.querySelector('input').value.trim().toUpperCase() !== 'XOA') { ui.toast('Gõ XOA để xác nhận.'); return; }
    const r = await acc.remove();
    ui.toast(r.ok ? 'Đã gửi yêu cầu xoá tài khoản (7 ngày).' : errText(r)); hooks.onLogout();
  };
  box.append(del);
  return box;
}

/** máy này chưa gắn tài khoản mà mây đã có tiến độ: chọn bản */
export function chooseBody(local, cloud, onPick) {
  const sum = (s) => `${esc(s?.player?.name || 'Chưa có nhân vật')} · ✦ ${s?.phucKhi | 0} Phúc Khí · ${(s?.xp | 0)} kinh nghiệm`;
  const box = el(`<div class="hq-acc">
    <p class="hq-note">Tài khoản này đã có tiến độ lưu trên mây. Chọn bản muốn dùng — bản còn lại sẽ bị thay thế.</p>
    <div class="hq-acc-pick"><button class="hq-btn hq-big" type="button" data-k="cloud">☁ Bản trên tài khoản<br><small>${sum(cloud)}</small></button>
    <button class="hq-btn hq-big" type="button" data-k="local">📱 Tiến độ máy này<br><small>${sum(local)}</small></button></div>
    <p class="hq-fine">Ngày giờ sinh không lưu trên mây: chọn bản trên tài khoản ở máy mới thì sẽ nhập lại ngày sinh.</p>
  </div>`);
  box.querySelectorAll('[data-k]').forEach((b) => { b.onclick = () => onPick(b.dataset.k); });
  return box;
}
