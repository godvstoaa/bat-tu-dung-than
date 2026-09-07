// restore-admin2.cjs — CSS fpanel + thay toàn bộ tab-visitors HTML (events đầu + finder nhóm + gate)
const fs = require('fs');
let s = fs.readFileSync('worker/admin.js', 'utf8').replace(/\r\n/g, '\n');
let n = 0;

// CSS — sau .filter:focus
if (!s.includes('.fpanel{')) {
  const marker = '  .filter:focus{outline:none;border-color:var(--gold)}';
  const css = marker + `
  /* === FILTER PANEL (redesign v2) — phân nhóm khoa học, chỉ tìm khi bấm nút === */
  .fpanel{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:14px 16px;margin-bottom:14px}
  .fgroup{display:flex;flex-direction:column;gap:6px;padding:0 14px;border-left:2px solid rgba(212,175,55,.18)}
  .fgroup:first-of-type{padding-left:0;border-left:none}
  .flabel{font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px}
  .frow{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
  .fchecks{display:flex;flex-wrap:wrap;gap:6px}
  .fcheck{display:inline-flex;align-items:center;gap:4px;cursor:pointer;font-size:12px;padding:4px 9px;background:var(--surface2);border:1px solid var(--border);border-radius:14px;color:var(--text);user-select:none;transition:all .12s}
  .fcheck:hover{border-color:var(--gold)}
  .fcheck input{margin:0;cursor:pointer}
  .fcheck.on{background:rgba(212,175,55,.14);border-color:var(--gold);color:var(--gold)}
  .fbtns{display:flex;gap:8px;align-items:center;margin-top:10px;padding-top:10px;border-top:1px solid rgba(212,175,55,.1)}
  .fresult{font-size:12px;color:var(--muted);margin-left:auto;white-space:nowrap}`;
  if (s.includes(marker)) { s = s.replace(marker, css); n++; } else console.log('MISS: css');
}

// HTML — thay trọn tab-visitors content (từ pagehead đến </section> đầu sau đó)
const startMark = '<div class="pagehead"><h2>👥 Visitors</h2>';
const start = s.indexOf(startMark);
if (start < 0) { console.log('MISS: visitors start'); }
else {
  const end = s.indexOf('</section>', start);
  if (end < 0) console.log('MISS: visitors end');
  else if (!s.includes('id="neo-kpis"')) {
    const NEW = `<div class="pagehead"><h2>👥 Visitors</h2><span class="pill">Log sự kiện hiện sẵn · tìm IP/tên khi cần</span></div>

        <!-- SỰ KIỆN (log chính — ĐẶT TRÊN CÙNG, luôn hiện) -->
        <div class="card"><h3>📜 Sự kiện gần đây <span class="card-actions tiny">click dòng ai_chat → xem full Q+A · click IP → xem chi tiết visitor</span></h3>
          <div class="fpanel">
            <div class="toolbar" style="margin-bottom:0;align-items:stretch">
              <div class="fgroup" style="flex:1;min-width:200px">
                <div class="flabel">📂 Loại sự kiện</div>
                <select class="filter" id="ftype" onchange="_evApply()"><option value="">Tất cả loại</option><option value="visit">🚪 visit (truy cập)</option><option value="chart">📊 chart (lập lá số)</option><option value="ai_question">❓ ai_question</option><option value="ai_chat">💬 ai_chat (Q+A đầy đủ)</option><option value="error">⚠ error (lỗi JS)</option><option value="click">🖱 click</option></select>
              </div>
              <div class="fgroup" style="flex:1;min-width:200px">
                <div class="flabel">🔍 Từ khoá trong sự kiện</div>
                <input class="filter" id="sq" placeholder="tìm trong nội dung sự kiện…" onkeydown="if(event.key==='Enter')_sqSearch()" style="width:100%">
              </div>
            </div>
            <div class="fbtns">
              <button class="btn" onclick="_sqSearch()">🔍 Tìm trong kết quả</button>
              <button class="btn sm" onclick="_sqClear()">✕ Xoá</button>
              <span class="fresult" id="sqresult"></span>
            </div>
          </div>
          <table><thead><tr><th>Thời gian</th><th>Loại</th><th>IP</th><th>Địa lý</th><th>Dữ liệu</th></tr></thead><tbody id="events"></tbody></table>
        </div>

        <!-- 🔎 VISITOR FINDER (chỉ hiển thị danh sách khi bấm «🔍 Tìm») -->
        <div class="card">
          <h3>🔎 Tìm theo IP / tên <span class="card-actions tiny">đặt điều kiện rồi bấm «🔍 Tìm» — danh sách chỉ hiện khi cần</span></h3>
          <div class="fpanel">
            <div class="toolbar" style="margin-bottom:0;align-items:stretch">
              <div class="fgroup" style="flex:1;min-width:220px">
                <div class="flabel">🔍 Từ khoá</div>
                <input class="filter" id="vq" placeholder="tên / ngày sinh / IP / câu hỏi / trả lời AI / ghi chú / tag…" onkeydown="if(event.key==='Enter')vSearch()" style="width:100%">
              </div>
              <div class="fgroup">
                <div class="flabel">Phân loại</div>
                <div class="frow">
                  <select class="filter" id="vf-gender"><option value="">Mọi giới</option><option value="nam">Nam</option><option value="nữ">Nữ</option></select>
                  <select class="filter" id="vf-country"></select>
                </div>
              </div>
              <div class="fgroup">
                <div class="flabel">Sắp xếp</div>
                <select class="filter" id="vf-sort">
                  <option value="recent">Gần nhất</option><option value="old">Cũ nhất</option><option value="scorehi">Điểm cao</option><option value="scorelo">Điểm thấp</option><option value="charts">Nhiều lá số</option><option value="qs">Nhiều câu hỏi</option><option value="named">Có tên</option><option value="note">Có ghi chú</option>
                </select>
              </div>
            </div>
            <div class="toolbar" style="margin-top:12px;margin-bottom:0;align-items:stretch">
              <div class="fgroup">
                <div class="flabel">Chỉ hiện có</div>
                <div class="fchecks">
                  <label class="fcheck" id="fc-chart"><input type="checkbox" id="vf-chart"> 📊 lá số</label>
                  <label class="fcheck" id="fc-chat"><input type="checkbox" id="vf-chat"> 💬 chat</label>
                  <label class="fcheck" id="fc-q"><input type="checkbox" id="vf-q"> ❓ câu hỏi</label>
                  <label class="fcheck" id="fc-note"><input type="checkbox" id="vf-note"> 📝 ghi chú</label>
                  <label class="fcheck" id="fc-tag"><input type="checkbox" id="vf-tag"> 🏷 tag</label>
                  <label class="fcheck" id="fc-name"><input type="checkbox" id="vf-name"> 👤 có tên</label>
                  <label class="fcheck" id="fc-ret"><input type="checkbox" id="vf-ret"> 🔄 quay lại</label>
                </div>
              </div>
            </div>
            <div class="toolbar" style="margin-top:12px;margin-bottom:0;align-items:stretch">
              <div class="fgroup">
                <div class="flabel">🔢 Điểm lá số (0–100)</div>
                <div class="frow">
                  <input class="filter" id="vf-smin" type="number" min="0" max="100" placeholder="từ" style="width:60px">
                  <span class="tiny">→</span>
                  <input class="filter" id="vf-smax" type="number" min="0" max="100" placeholder="đến" style="width:60px">
                </div>
              </div>
              <div class="fgroup">
                <div class="flabel">📅 Thăm trong khoảng</div>
                <div class="frow">
                  <input class="filter" id="vf-from" type="date" style="width:138px">
                  <span class="tiny">→</span>
                  <input class="filter" id="vf-to" type="date" style="width:138px">
                </div>
              </div>
            </div>
            <div class="fbtns">
              <button class="btn" onclick="vSearch()">🔍 Tìm</button>
              <button class="btn sm" onclick="vReset()">✕ Xoá lọc</button>
              <span class="fresult" id="vcount"></span>
            </div>
          </div>
          <div id="vtagcloud" class="tiny" style="margin:6px 0;line-height:2"></div>
          <div id="byip"></div>
        </div>

        <!-- 📒 DANH BẠ TÊN (chỉ hiện khi đã bấm Tìm) -->
        <div class="card"><h3>📒 Danh bạ tên <span class="card-actions tiny">bền vững · chỉ hiện khi bấm «🔍 Tìm» phía trên</span></h3><div id="profiles"></div></div>
      `;
    s = s.slice(0, start) + NEW + s.slice(end);
    n++;
  } else console.log('already: visitors html');
}

fs.writeFileSync('worker/admin.js', s);
console.log('phase 2 applied:', n);
