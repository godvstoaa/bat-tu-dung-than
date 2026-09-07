// restore-saved-charts.cjs — chèn module «👤 Lá số của tôi» vào main.js (idempotent)
const fs = require('fs');
let s = fs.readFileSync('src/main.js', 'utf8');
if (s.includes('initSavedCharts')) { console.log('already present'); process.exit(0); }

const MARKER = "$('birth-form').addEventListener('submit', (e) => { e.preventDefault(); run().catch((err) => console.warn('run submit:', err && err.message)); });";
if (!s.includes(MARKER)) { console.log('MISS birth-form marker'); process.exit(1); }

const BLOCK = `// ═══ [UX P1 · RESTORE] SAVED CHARTS — danh sách lá số đã lưu, chuyển nhanh giữa các thành viên ═══
//   Trước đây chỉ có 1 slot bazi-birth → xem lá số người thân phải nhập lại tay mỗi lần.
const _SAVED_KEY = 'bazi-saved-charts';
function _savedList() { try { const a = JSON.parse(localStorage.getItem(_SAVED_KEY) || '[]'); return Array.isArray(a) ? a.slice(0, 20) : []; } catch (_) { return []; } }
function _savedStore(list) { try { localStorage.setItem(_SAVED_KEY, JSON.stringify(list.slice(0, 20))); } catch (_) {} }
(function initSavedCharts() {
  const formCard = document.querySelector('.form-card');
  if (!formCard || document.getElementById('saved-charts-card')) return;
  const card = document.createElement('section');
  card.className = 'card'; card.id = 'saved-charts-card';
  formCard.parentNode.insertBefore(card, formCard);

  function render() {
    const list = _savedList();
    card.innerHTML = \`
      <h3 class="card-title">👤 Lá số của tôi <span class="hint-inline">(lưu &amp; chuyển nhanh giữa các thành viên — tối đa 20)</span></h3>
      <div id="saved-list"></div>
      <div style="display:flex;gap:8px;margin-top:10px"><button type="button" class="btn sm" id="saved-add">💾 Lưu lá số đang nhập</button></div>\`;
    const listBox = card.querySelector('#saved-list');
    if (!list.length) {
      listBox.innerHTML = '<p class="hint">Chưa có lá số nào — nhập ngày sinh ở form dưới rồi bấm «💾 Lưu».</p>';
    } else {
      list.forEach((f, i) => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid rgba(212,175,55,.08);flex-wrap:wrap';
        const info = document.createElement('span');
        info.style.cssText = 'flex:1;min-width:180px;font-size:13px';
        info.innerHTML = '👤 <b>' + esc(f.name || 'Không tên') + '</b> · ' + esc(f.date) + ' ' + esc(f.time || '') + ' (' + esc(f.gender === 'nu' ? 'Nữ' : 'Nam') + ')';
        const view = document.createElement('button');
        view.type = 'button'; view.className = 'btn sm'; view.textContent = '▶ Xem';
        view.onclick = () => {
          const d = $('date'), t = $('time');
          if (d) d.value = f.date;
          if (t) t.value = f.time || '12:00';
          const g = document.getElementById(f.gender === 'nu' ? 'g-nu' : 'g-nam');
          if (g) g.checked = true;
          const nm = $('birth-name'); if (nm) nm.value = f.name || '';
          hapticImpact(ImpactStyle.Medium);
          run().catch((err) => console.warn('saved view:', err && err.message));
          setTimeout(() => { const r = $('result'); if (r) r.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 150);
        };
        const del = document.createElement('button');
        del.type = 'button'; del.className = 'btn sm';
        del.style.borderColor = 'rgba(192,57,43,.5)'; del.style.color = '#e0533d'; del.textContent = '🗑';
        del.title = 'Xoá';
        del.onclick = () => {
          if (!confirm('Xoá «' + (f.name || f.date) + '» khỏi danh sách?')) return;
          const l = _savedList(); l.splice(i, 1); _savedStore(l); render();
        };
        row.appendChild(info); row.appendChild(view); row.appendChild(del);
        listBox.appendChild(row);
      });
    }
    card.querySelector('#saved-add').onclick = () => {
      const dateEl = $('date');
      const date = dateEl ? dateEl.value : '';
      if (!date) { alert('Nhập ngày sinh ở form dưới trước rồi mới lưu.'); return; }
      const gender = (document.querySelector('input[name="gender"]:checked') || {}).value || 'nam';
      const item = { name: (($('birth-name') || {}).value || '').trim(), date, time: ($('time') || {}).value || '12:00', gender };
      let l = _savedList();
      const key = item.date + '|' + item.time + '|' + item.gender;
      l = l.filter((x) => (x.date + '|' + x.time + '|' + x.gender) !== key); // dedupe — lưu đè bản cũ cùng người
      l.unshift(item);
      _savedStore(l);
      render();
      const add = card.querySelector('#saved-add');
      if (add) { add.textContent = '✓ Đã lưu'; setTimeout(() => { add.textContent = '💾 Lưu lá số đang nhập'; }, 1200); }
    };
  }
  render();
})();

` + MARKER;
s = s.replace(MARKER, BLOCK);
fs.writeFileSync('src/main.js', s);
console.log('saved-charts module inserted');
