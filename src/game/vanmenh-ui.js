// ============================================================================
//  Bảng Vận Mệnh Các (bia + 9 cổng đại vận) và Thái Tuế Điện (bàn lễ + đèn an Thái Tuế).
//  Nạp lười từ stations.js (engine life-trajectory / taisui chỉ tải khi vào điện). Chỉ bản web.
//  roomData(state) → dữ liệu vẽ biển cổng, bia, bài vị, đèn trong cảnh 3D (interior.js › setData).
// ============================================================================
import { vanMenh, vanBiaBark, vanGateBark } from './vanmenh.js';
import { thaiTue, thaiTueBark } from './thaitue.js';
import * as S from './state.js';
import { chartOf, esc } from './stations.js';
import { FEATURES } from './features.js';
import { ZHI } from '../engine/constants.js';
// [G2 NPC-AI] nhãn mức đại vận qua mapRating (mục 06 §6) — cấm chữ «Đại hung»… ở lớp hiển thị
import { mapRating } from './map-rating.js';

const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
const NOTE = 'Quỹ tích và vận hạn là tham khảo theo cổ pháp — đời người do mình quyết định.';
// [G2 NPC-AI] màu nhãn theo tone mềm của mapRating (thuan/binh/giu) — không còn tô theo từ kỹ thuật
const LUCK = { thuan: 'good', binh: 'mid', giu: 'bad' };

// [G2 NPC-AI] hạt giống bark theo ngày + pid (khuôn stations.js:671-673) — chỉ dùng làm múi
// chọn câu bark trên máy người chơi, không ghi state, không rời máy (mục 13 — không vào payload mạng).
function barkDayKey() {
  let pid = 'local';
  try { pid = localStorage.getItem('huyenquan:pid') || 'local'; } catch (e) { /* máy không có localStorage */ }
  return `${S.todayStr()}:${pid}`;
}

function chartOfPlayer(state) {
  const b = state.player?.birth;
  if (!b) return null;
  try { return chartOf({ year: b.y, month: b.m, day: b.d, hour: b.h, minute: b.mi, gender: b.gender }); } catch (e) { return null; }
}
const memo = new Map();
function vanOf(state, year) {
  const R = chartOfPlayer(state);
  if (!R) return null;
  const b = state.player.birth, k = `${b.y}-${b.m}-${b.d}-${b.h}-${b.mi}-${b.gender}-${year}`;
  if (!memo.has(k)) {
    if (memo.size > 200) memo.clear(); // chặn phình bộ nhớ khi đổi năm / sửa bát tự
    memo.set(k, { ...vanMenh(R, year), nowYear: year }); // nowYear = năm truyền xuống mỗi lần mở panel
  }
  return memo.get(k);
}
function taiOf(state, now = new Date()) {
  const R = chartOfPlayer(state);
  return thaiTue(R?.chart.pillars.year.zhi || null, R?.chart.input.year || null, now);
}

/** Dữ liệu cho cảnh 3D (biển cổng, bia, bài vị, đèn dầu). */
export function roomData(state, now = new Date()) {
  const T = taiOf(state, now), L = S.lampState(state, T.year, now);
  return { van: vanOf(state, now.getFullYear()) || null, thaitue: { ...T, ...L } };
}

const noBirth = () => el('<div><p>Thầy chưa có bát tự của bạn. Ra cổng quán chọn «Sửa bát tự» để khắc tên tuổi, rồi quay lại.</p></div>');
const askBtn = (api, R, who, first) => {
  if (!FEATURES.ai || !R) return null;
  const b = el('<div class="hq-actions"><button class="hq-btn" type="button">🎙 Hỏi Thầy thêm</button></div>');
  b.querySelector('button').onclick = () => import('./case-ui.js')
    .then((m) => m.openMaster(api, { R, who, first }))
    .catch(() => api.toast?.('Chưa mời được Thầy, thử lại sau nhé.')); // lỗi nạp mô-đun thì báo, không câm lặng
  return b;
};

// --- Bia Vận Mệnh: nền mệnh, 9 cổng, các mốc, giai đoạn đang đi
export function vanBiaBody(api) {
  const V = vanOf(api.state, new Date().getFullYear());
  if (!V) return noBirth();
  const F = V.foundation, cur = V.gates[V.current];
  const bark = vanBiaBark(V, barkDayKey()); // [G2 NPC-AI] bark bia — pool §05.12, seed ngày + pid
  const marks = V.gates.flatMap((g) => g.marks.map((m) => ({ ...m, ages: g.ages, gz: g.ganZhi })));
  // [G2 NPC-AI] nhãn mức từng cổng qua mapRating — chữ kỹ thuật không lên lớp hiển thị (mục 06 §6)
  const items = V.gates.map((g, i) => {
    const soft = mapRating(g.rating, g.score);
    return `<li class="${i === V.current ? 'on' : V.nowYear > g.endYear ? 'past' : ''}"><b class="hq-han">${esc(g.ganZhi)}</b> <span>${esc(g.ages.replace('t', ' tuổi'))}</span> <span class="hq-luck ${LUCK[soft.tone]}">${esc(soft.nhãn)}</span>${g.marks.map((m) => ` <span class="hq-chip">${esc(m.vi)}</span>`).join('')}</li>`;
  }).join('');
  const root = el(`<div class="hq-van">
    ${bark ? `<p class="hq-bark">${esc(bark)}</p>` : ''}
    <p class="hq-sub">Bia khắc quỹ tích đời của <b>${esc(api.state.player.name)}</b> — mỗi cổng phía trước là một đại vận mười năm.</p>
    <p>Nhật chủ <b>${esc(F.dmVi)} (${esc(F.dmWx)})</b> · ${esc(F.strength)} · Dụng <b>${esc(F.yong)}</b>, Hỷ <b>${esc(F.yongXi)}</b> · cấp mệnh ${esc(F.grade)}</p>
    <ol class="hq-van-list">${items}</ol>
    ${marks.length ? `<h4>Các mốc đáng nhớ</h4><ul class="hq-plain">${marks.map((m) => `<li><b>${esc(m.vi)}</b> ${esc(m.ages.replace('t', ' tuổi'))} (${esc(m.gz)}): ${esc(m.reason)}</li>`).join('')}</ul>` : ''}
    ${V.childhood ? '<p>Bạn còn ở tiểu vận (tuổi thơ theo trụ tháng) — cổng đầu tiên chưa mở.</p>' : ''}
    ${!V.childhood && V.current < 0 && V.phase ? `<h4>Đã qua đại vận cuối</h4>${V.phase.paragraphs.slice(0, 3).map((p) => `<p>${p}</p>`).join('')}` : ''}
    ${cur && V.phase ? `<h4>Đang đi: cổng ${V.current + 1} · ${esc(cur.ganZhi)}</h4>${V.phase.paragraphs.slice(0, 3).map((p) => `<p>${p}</p>`).join('')}` : ''}
    <p class="hq-note">${NOTE}</p></div>`);
  const a = askBtn(api, chartOfPlayer(api.state), api.state.player.name, `Thầy xem quỹ tích đời tôi: đang ở đại vận ${cur?.ganZhi || 'đầu'}, nên chú ý gì cho mười năm này?`);
  if (a) root.append(a);
  return root;
}

// --- Một cổng đại vận
export function vanGateBody(api, i) {
  const V = vanOf(api.state, new Date().getFullYear());
  if (!V) return noBirth();
  const g = V.gates[i];
  if (!g) return el('<div><p>Cổng này chưa khắc tên.</p></div>');
  const bark = vanGateBark(g); // [G2 NPC-AI] bark cổng — 1 câu kể tuổi (§05.12), đọc g.ages
  const soft = mapRating(g.rating, g.score); // [G2 NPC-AI] nhãn mềm; rating gốc chỉ trong <details>
  const when = V.current === i ? 'Bạn đang bước trong cổng này.' : V.nowYear > g.endYear ? 'Cổng đã đi qua.' : `Còn ${g.startYear - V.nowYear} năm nữa mới tới.`;
  const root = el(`<div class="hq-van">
    ${bark ? `<p class="hq-bark">${esc(bark)}</p>` : ''}
    <p class="hq-van-head"><span class="hq-han">${esc(g.ganZhi)}</span><br><span class="hq-sub">Đại vận ${i + 1} · ${esc(g.ages.replace('t', ' tuổi'))} · năm ${g.startYear}–${g.endYear}</span></p>
    <p>${esc(when)}</p>
    <p>Can <b>${esc(g.ganGod)}</b> · chi <b>${esc(g.zhiGod)}</b> → <b>${esc(g.theme)}</b>: ${esc(g.line)}.</p>
    <p>Đánh giá: <span class="hq-luck ${LUCK[soft.tone]}">${esc(soft.nhãn)}</span> · Trường sinh của vận: <b>${esc(g.stage)}</b> (${esc(g.stageTone)}) — ${esc(g.stageDesc)}</p>
    <details><summary>Mức kỹ thuật của vận</summary><p>Thang engine: ${esc(soft.details.rating)} · điểm ${soft.details.score} — chỉ để đối chiếu, không phải lời phán.</p></details>
    ${g.marks.length ? `<ul class="hq-plain">${g.marks.map((m) => `<li><b>${esc(m.vi)}</b>: ${esc(m.reason)}</li>`).join('')}</ul>` : ''}
    ${g.rescue.length || g.worsen.length ? `<details><summary>Cách cục trong vận này</summary><ul class="hq-plain">${g.rescue.map((x) => `<li>✓ ${esc(x)}</li>`).join('')}${g.worsen.map((x) => `<li>⚠ ${esc(x)}</li>`).join('')}</ul></details>` : ''}
    ${V.current === i && V.phase ? V.phase.paragraphs.slice(1, 5).map((p) => `<p>${p}</p>`).join('') : ''}
    <p class="hq-note">${NOTE}</p></div>`);
  const a = askBtn(api, chartOfPlayer(api.state), api.state.player.name, `Thầy luận kỹ đại vận ${g.ganZhi} (${g.ages}) của tôi: nên làm gì, tránh gì?`);
  if (a) root.append(a);
  return root;
}

// --- Bàn lễ Thái Tuế
export function thaiTueBody(api) {
  const now = new Date();
  const T = taiOf(api.state, now);
  const me = T.me, R = chartOfPlayer(api.state);
  const myZhi = R?.chart.pillars.year.zhi;
  const bark = thaiTueBark(T); // [G2 NPC-AI] bark tuyên vị tướng quân (§05.11) — seed năm hoa giáp
  const TYPE_SHORT = { zhi: 'Trị', chong: 'Xung', xing: 'Hình', po: 'Phá', hai: 'Hại' };
  const root = el(`<div class="hq-van">
    ${bark ? `<p class="hq-bark">${esc(bark)}</p>` : ''}
    <p class="hq-van-head"><span class="hq-han">${esc(T.ganZhi)} 太歲</span><br><span class="hq-sub">Năm ${T.year} · vị thứ ${T.index}/60 · ${esc(T.name)}</span></p>
    <p>${esc(T.note)}</p>
    <p>Phương Thái Tuế năm nay: <b>${esc(T.direction)}</b> — dân gian kiêng động thổ phương này.</p>
    ${me ? `<p class="hq-tt-me ${me.offends ? 'bad' : 'good'}">${esc(me.msg)}</p>
      ${me.offends ? `<ul class="hq-plain">${me.types.map((x) => `<li>${esc(x.vi)}</li>`).join('')}</ul><p>Tam hợp nâng đỡ: ${esc((me.remedyCharms || []).join(', '))}.</p>` : ''}` : '<p>Nhập bát tự ở cổng quán để thầy xem tuổi bạn có phạm Thái Tuế không.</p>'}
    ${T.natal ? `<p class="hq-sub">Bản mệnh Thái Tuế (năm sinh ${T.natal.year} ${esc(T.natal.ganZhi)}): ${esc(T.natal.name)}.</p>` : ''}
    <div class="hq-tt-grid">${T.table.map((r) => `<span class="${r.zhi === myZhi ? 'me ' : ''}${r.level === 'nặng' ? 'heavy' : r.level === 'nhẹ' ? 'light' : ''}"><b class="hq-han sm">${esc(r.zhi)}</b> ${esc(ZHI[r.zhi]?.con || r.zodiac)}<small>${r.types.map((t) => TYPE_SHORT[t]).join('·') || 'an'}</small></span>`).join('')}</div>
    <details><summary>Tập tục an Thái Tuế (dân gian)</summary><ul class="hq-plain">${T.remedies.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></details>
    <div data-role="lamp"></div>
    <p class="hq-note">Tín ngưỡng dân gian để tham khảo — giữ tâm an, làm việc thiện là chính.</p></div>`);
  const box = root.querySelector('[data-role=lamp]');
  const draw = () => {
    const L = S.lampState(api.state, T.year, new Date());
    box.innerHTML = `<p>${L.lit ? `Đèn an Thái Tuế của bạn đã cháy ${L.days} ngày năm ${T.year}.` : 'Bạn chưa thắp đèn an Thái Tuế năm nay.'}</p>
      <div class="hq-actions"><button class="hq-btn hq-primary" type="button" ${L.today ? 'disabled' : ''}>${L.today ? 'Hôm nay đã thêm dầu ✓' : L.lit ? `🪔 Thêm dầu cho đèn (+${S.LAMP_REWARD.daily})` : `🪔 Thắp đèn an Thái Tuế (+${S.LAMP_REWARD.first})`}</button></div>`;
    const b = box.querySelector('button');
    if (b && !L.today) b.onclick = () => {
      const g = S.lightLamp(api.state, T.year, new Date());
      api.after(g, L.lit ? 'thêm dầu đèn Thái Tuế' : 'thắp đèn an Thái Tuế');
      api.refreshRooms?.();
      draw();
    };
  };
  draw();
  const a = askBtn(api, R, api.state.player?.name || 'Bạn', `Năm ${T.year} (${T.ganZhi}) tuổi tôi ${me?.offends ? 'phạm Thái Tuế' : 'không phạm Thái Tuế'}, thầy xem theo lá số tôi nên giữ gìn điều gì?`);
  if (a) root.append(a);
  return root;
}
