// ev-table-sort.cjs — header bảng sự kiện bấm được để sắp xếp + giá trị ô bấm để lọc
const fs = require('fs');
let s = fs.readFileSync('worker/admin.js', 'utf8');
let n = 0;
const rep = (a, b, t) => { if (s.includes(a)) { s = s.replace(a, b); n++; } else console.log('MISS:', t); };

// 1. THEAD — header bấm được + mũi tên chỉ hướng
rep('<table><thead><tr><th>Thời gian</th><th>Loại</th><th>IP</th><th>Địa lý</th><th>Dữ liệu</th></tr></thead><tbody id="events"></tbody></table>',
   '<table><thead><tr>' +
   '<th style="cursor:pointer;user-select:none" onclick="_evSortBy(\'ts\')">Thời gian <span id="ev-arrow-ts"></span></th>' +
   '<th style="cursor:pointer;user-select:none" onclick="_evSortBy(\'type\')">Loại <span id="ev-arrow-type"></span></th>' +
   '<th style="cursor:pointer;user-select:none" onclick="_evSortBy(\'ip\')">IP <span id="ev-arrow-ip"></span></th>' +
   '<th style="cursor:pointer;user-select:none" onclick="_evSortBy(\'geo\')">Địa lý <span id="ev-arrow-geo"></span></th>' +
   '<th style="cursor:pointer;user-select:none" onclick="_evSortBy(\'data\')" title="Sắp theo độ dài dữ liệu">Dữ liệu <span id="ev-arrow-data"></span></th>' +
   '</tr></thead><tbody id="events"></tbody></table>', '1 thead');

// 2. SORT — sau filterftype, trước tb render
rep(`    const ft=document.getElementById('ftype').value;
    const evs = ft ? d.events.filter(e=>e.type===ft) : d.events;
    const tb=document.getElementById('events'); tb.textContent='';`,
   `    const ft=document.getElementById('ftype').value;
    let evs = ft ? d.events.filter(e=>e.type===ft) : d.events;
    // [UX] sắp xếp theo cột header bấm (toggle ↑↓) — dữ liệu client-side có sẵn
    if (_evSort.col) {
      const dir = _evSort.dir;
      const key = (e) => _evSort.col === 'ts' ? (e.ts||0) : _evSort.col === 'type' ? (e.type||'') : _evSort.col === 'ip' ? (e.ip||'') : _evSort.col === 'geo' ? ((e.country||'')+(e.city||'')) : (e.data ? JSON.stringify(e.data).length : 0);
      evs = evs.slice().sort((a, b) => { const ka = key(a), kb = key(b); return (ka > kb ? 1 : ka < kb ? -1 : 0) * dir; });
    }
    ('ts type ip geo data').split(' ').forEach((c) => { const ar = document.getElementById('ev-arrow-' + c); if (ar) ar.textContent = (_evSort.col === c) ? (_evSort.dir === 1 ? ' ▼' : ' ▲') : ''; });
    const tb=document.getElementById('events'); tb.textContent='';`, '2 sort');

// 3. LOẠI badge click → lọc theo loại
rep(`      const td2=el('td'); const badge=el('span','badge b-'+(e.type||'other'), e.type); td2.appendChild(badge); tr.appendChild(td2);`,
   `      const td2=el('td'); const badge=el('span','badge b-'+(e.type||'other'), e.type); badge.style.cursor='pointer'; badge.title='🔍 Lọc theo loại «'+e.type+'»'; badge.onclick=function(ev){ ev.stopPropagation(); const sel=document.getElementById('ftype'); if (sel) { sel.value = e.type; } _evApply(); }; td2.appendChild(badge); tr.appendChild(td2);`, '3 badge');

// 4. ĐỊA LÝ click → lọc theo địa lý
rep(`      tr.appendChild(el('td','tiny', (e.country||'?')+(e.city?' / '+e.city:'')));`,
   `      const tdGeo=el('td','tiny', (e.country||'?')+(e.city?' / '+e.city:'')); tdGeo.style.cursor='pointer'; tdGeo.title='🔍 Lọc theo địa lý «'+(e.country||'')+'»'; tdGeo.onclick=function(ev){ ev.stopPropagation(); const inp=document.getElementById('sq'); if (inp) { inp.value = (e.country||'') + (e.city ? ' ' + e.city : ''); } _sqSearch(); }; tr.appendChild(tdGeo);`, '4 geo');

// 5. state + hàm _evSortBy (chèn cạnh _sqSearch)
rep("  function _sqSearch(){ var inp=document.getElementById('sq');",
   `  // [UX] sort state cho bảng sự kiện — header bấm toggle ↑↓
  var _evSort = { col: null, dir: 1 };
  function _evSortBy(col){ if (_evSort.col === col) { _evSort.dir = -_evSort.dir; } else { _evSort.col = col; _evSort.dir = 1; } load(); }
  function _sqSearch(){ var inp=document.getElementById('sq');`, '5 sortfn');

fs.writeFileSync('worker/admin.js', s);
console.log('applied:', n, '/ 5');
