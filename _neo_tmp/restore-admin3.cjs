// restore-admin3.cjs — JS: search functions + _vSearched gate trong vRender + vReset + loadNeo + init progressive
const fs = require('fs');
let s = fs.readFileSync('worker/admin.js', 'utf8').replace(/\r\n/g, '\n');
let n = 0;
const has = (t) => s.includes(t);

// 1. functions mới sau _vDebounced + gate var
if (!has('function vSearch()')) {
  const marker = 'function _vDebounced(){ clearTimeout(_vTimer); _vTimer = setTimeout(vRender, 300); }';
  const add = marker + `
  // [redesign v3] danh sách IP/tên chỉ hiện khi user chủ động bấm «🔍 Tìm» — tránh che log sự kiện
  var _vSearched = false;
  function vSearch(){ _vSearched = true; vRender(); }
  function _sqSearch(){ var inp=document.getElementById('sq'); var q=(inp.value||'').toLowerCase().trim(); var shown=0,total=0; document.querySelectorAll('#events tr').forEach(function(tr){total++;var ok=!q||tr.textContent.toLowerCase().indexOf(q)>=0;tr.style.display=ok?'':'none';if(ok)shown++;}); var r=document.getElementById('sqresult'); if(r) r.textContent=q?shown+' / '+total+' dòng khớp':(total+' dòng'); }
  function _sqClear(){ var inp=document.getElementById('sq'); if(inp) inp.value=''; _sqSearch(); }
  function _evApply(){ var ft=document.getElementById('ftype'); if(ft) load(); _sqSearch(); }
  (function(){ document.addEventListener('change',function(e){ var lb=e.target.closest('.fcheck'); if(lb){ lb.classList.toggle('on',e.target.checked); } }); })();`;
  if (has(marker)) { s = s.replace(marker, add); n++; } else console.log('MISS: vsearch');
}

// 2. vRender gate — thay đoạn matched/bip đầu + hint; giữ cselpopulate TRƯỚC gate
if (!has('_vSearched')) { /* đã thêm ở bước 1 */ }
if (!s.includes('Bấm «🔍 Tìm» để xem')) {
  const marker = `    var matched=arr.filter(function(v){return _vMatch(v,f);});
    var bip=document.getElementById('byip'); if(bip){bip.textContent='';
      var vc=document.getElementById('vcount'); if(vc) vc.textContent=matched.length+' / '+arr.length+' visitor';
      if(!matched.length) bip.appendChild(el('div','tiny','(không khớp — bớt filter hoặc bấm «✕ lọc»)'));`;
  const block = `    var matched=arr.filter(function(v){return _vMatch(v,f);});
    // [redesign v3] luôn cập nhật số lượng — nhưng KHÔNG render danh sách cho đến khi bấm «🔍 Tìm»
    var vc=document.getElementById('vcount'); if(vc) vc.textContent=_vSearched ? (matched.length+' / '+arr.length+' visitor') : (arr.length+' visitor — bấm «🔍 Tìm» để xem');
    var csel=document.getElementById('vf-country'); if(csel && !csel.options.length){ var ph=document.createElement('option'); ph.value=''; ph.textContent='Mọi quốc gia'; csel.appendChild(ph); var cs={}; (d.byIp||[]).forEach(function(v){if(v.country)cs[v.country]=1;}); Object.keys(cs).sort().forEach(function(c){var o=document.createElement('option');o.value=c;o.textContent=c;csel.appendChild(o);}); }
    if (!_vSearched) {
      var bip0=document.getElementById('byip'); if(bip0){bip0.textContent=''; var hint=el('div','tiny','💡 Chưa hiển thị — đặt điều kiện rồi bấm «🔍 Tìm» (hoặc Enter) để mở danh sách visitor.'); hint.style.cssText='padding:14px;text-align:center;opacity:.7'; bip0.appendChild(hint);}
      var pr0=document.getElementById('profiles'); if(pr0){pr0.textContent=''; var ph0=el('div','tiny','💡 Bấm «🔍 Tìm» phía trên để hiện danh bạ tên.'); ph0.style.cssText='padding:10px;text-align:center;opacity:.7'; pr0.appendChild(ph0);}
      return;
    }
    var bip=document.getElementById('byip'); if(bip){bip.textContent='';
      if(!matched.length) bip.appendChild(el('div','tiny','(không khớp — bớt filter hoặc bấm «✕ lọc)»'));`;
  if (has(marker)) { s = s.replace(marker, block); n++; } else console.log('MISS: vrender gate');
  // 2b. bỏ đoạn csel populate cũ (nay đã chuyển lên trước gate)
  const oldCsel = `    var csel=document.getElementById('vf-country'); if(csel && !csel.options.length){ var ph=document.createElement('option'); ph.value=''; ph.textContent='Mọi quốc gia'; csel.appendChild(ph); var cs={}; (d.byIp||[]).forEach(function(v){if(v.country)cs[v.country]=1;}); Object.keys(cs).sort().forEach(function(c){var o=document.createElement('option');o.value=c;o.textContent=c;csel.appendChild(o);}); }
    var pr=document.getElementById('profiles');`;
  if (has(oldCsel)) { s = s.replace(oldCsel, '    var pr=document.getElementById(\'profiles\');'); n++; }
}

// 3. vReset thêm _vSearched=false + fcheck off
if (!s.includes("_vSearched=false; vRender()")) {
  const marker = "['vf-chart','vf-chat','vf-q','vf-note','vf-tag','vf-name','vf-ret'].forEach(function(id){var e=document.getElementById(id);if(e)e.checked=false;}); vRender(); }";
  const add = "['vf-chart','vf-chat','vf-q','vf-note','vf-tag','vf-name','vf-ret'].forEach(function(id){var e=document.getElementById(id);if(e)e.checked=false;}); document.querySelectorAll('.fcheck').forEach(function(lb){lb.classList.remove('on');}); _vSearched=false; vRender(); }";
  if (has(marker)) { s = s.replace(marker, add); n++; } else console.log('MISS: vreset');
}

// 4. loadNeo function — chèn trước loadAudit
if (!has('function loadNeo')) {
  const marker = '  async function loadAudit(){';
  const loadNeo = `  // [NEO-CHECKER] load + render neo accuracy (đo AI neo đúng data không) + so sánh baseline
  async function loadNeo(){
    try {
      var r = await fetch(AP+'/api/neo-stats?token='+TOKEN, { headers: H }).then(function(x){return x.json();}).catch(function(){return null;});
      if (!r) return;
      var nk=document.getElementById('neo-kpis'); if(nk){nk.textContent='';
        if (r.avgScore == null) { nk.appendChild(statBlock('—','chưa có data')); nk.appendChild(statBlock('—','hỏi AI để đo')); if (r.baseline) nk.appendChild(statBlock(r.baseline.avgScore+'%','📊 BASELINE (cũ)','#9a8a6a')); return; }
        var scoreColor = r.avgScore>=85?'#7fbf7f':r.avgScore>=70?'#d4af37':'#c0392b';
        nk.appendChild(statBlock(r.avgScore+'%','🎯 avg neo', scoreColor));
        if (r.baseline && r.baseline.avgScore != null) {
          var delta = r.avgScore - r.baseline.avgScore;
          var deltaColor = delta > 0 ? '#7fbf7f' : delta < 0 ? '#c0392b' : '#9a8a6a';
          nk.appendChild(statBlock((delta>0?'▲+':delta<0?'▼':'±')+Math.abs(delta)+'%','vs baseline ('+r.baseline.avgScore+'%)', deltaColor));
          nk.appendChild(statBlock(r.baseline.avgScore+'%','📊 baseline','#9a8a6a'));
        }
        nk.appendChild(statBlock(r.totalScored,'câu đã chấm'));
        nk.appendChild(statBlock(Math.round((r.distribution.ge90/(r.totalScored||1))*100)+'%','≥90% ✅','#7fbf7f'));
        nk.appendChild(statBlock(Math.round((r.distribution.lt70/(r.totalScored||1))*100)+'%','<70% ⚠','#e0533d'));
        nk.appendChild(statBlock(r.redFlagCount,'🔴 red flag', r.redFlagCount>0?'#c0392b':'#7fbf7f'));
      }
      var nt=document.getElementById('neo-trend'); if(nt && r.trend){nt.textContent='';
        r.trend.forEach(function(dd){ var bar=el('div'); bar.style.cssText='flex:1;min-width:14px;background:'+(dd.avg==null?'rgba(212,175,55,.1)':(dd.avg>=85?'#7fbf7f':dd.avg>=70?'#d4af37':'#c0392b'))+';height:'+Math.max(2,dd.avg==null?2:Math.round(dd.avg))+'px'; bar.title=dd.day+': '+(dd.avg==null?'không data':dd.avg+'% ('+dd.count+' câu)'); nt.appendChild(bar); });
      }
      var nc=document.getElementById('neo-conflicts'); if(nc){nc.textContent='';
        var confs=r.recentConflicts||[];
        if(!confs.length){ nc.appendChild(el('div','tiny','✅ chưa phát hiện conflict — AI đang neo đúng data')); }
        else { confs.forEach(function(x){
            var row=el('div'); row.style.cssText='padding:6px 8px;border-bottom:1px solid rgba(212,175,55,.08);font-size:11px;cursor:pointer';
            row.onmouseenter=function(){row.style.background='rgba(192,57,43,.06)';};
            row.onmouseleave=function(){row.style.background='';};
            var sev=x.redFlag?'🔴':'🟠';
            var confList=(x.conflicts||[]).map(function(c){ try{ var co=typeof c==='string'?JSON.parse(c):c; return '['+co.type+'] «'+(co.said||'?')+'» brief:«'+(co.brief||'?')+'»'; }catch(e){ return '?'; } }).join(' | ');
            row.appendChild(el('div',null, sev+' '+new Date(x.ts).toLocaleString('vi-VN')+' · score '+x.score+'% · «'+(x.q||'').slice(0,50)+'…»'));
            row.appendChild(el('div','tiny', confList.slice(0,250)));
            nc.appendChild(row);
          });
        }
      }
    } catch(e) {}
  }
`;
  if (has(marker)) { s = s.replace(marker, loadNeo + marker); n++; } else console.log('MISS: loadneo');
}

// 5. init progressive + loadNeo interval
if (!s.includes('loadNeo(); setInterval')) {
  const marker = '  load(true); setInterval(function(){ if (!document.hidden) load(false); }, 15000);';
  const add = `  load(false); setTimeout(function(){ load(true); }, 60); // [PERF] cached NGAY → fresh nền sau
  setInterval(function(){ if (!document.hidden) load(false); }, 15000);
  loadNeo(); setInterval(function(){ if (!document.hidden) loadNeo(); }, 60000); // [NEO] refresh 60s`;
  if (has(marker)) { s = s.replace(marker, add); n++; } else console.log('MISS: init');
}

// 6. Neo Accuracy card HTML vào overview (sau engagement card)
if (!has('id="neo-kpis"')) {
  const marker = '<div class="card"><h3>📊 Engagement <span class="card-actions tiny">chất lượng & sâu traffic</span></h3><div id="engagement" class="kpi-grid"></div></div>';
  const add = marker + `
        <div class="card"><h3>🎯 Neo Accuracy <span class="card-actions tiny">AI có neo đúng data không — auto-verify vs brief</span></h3>
          <div id="neo-kpis" class="kpi-grid"></div>
          <div style="margin-top:10px"><div class="tiny" style="margin-bottom:4px">📈 Trend 7 ngày (avg neo score)</div><div id="neo-trend" style="display:flex;align-items:flex-end;gap:3px;height:40px"></div></div>
          <div style="margin-top:10px"><div class="tiny" style="margin-bottom:4px">🔴 Conflicts gần đây</div><div id="neo-conflicts" style="max-height:240px;overflow:auto"></div></div>
        </div>`;
  if (has(marker)) { s = s.replace(marker, add); n++; } else console.log('MISS: neo card html');
}

fs.writeFileSync('worker/admin.js', s);
console.log('phase 3 applied:', n, '/ 6');
