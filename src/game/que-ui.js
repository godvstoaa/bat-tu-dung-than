// ============================================================================
//  THẦY GIẢI QUẺ (docs/GAME-V2-THIET-KE.md §S6 + docs/GAME-THIET-KE-CHOT.md P0-1)
//  — 5 phép của trang chính, cùng engine:
//    Mai Hoa Dịch Số (theo giờ / theo 2 số) · Lục Hào (gieo 3 xu × 6) · Tiểu Lục Nhâm ·
//    Kim Khẩu Quyết · Xin xăm (kèm xin keo âm dương).
//  «Đường Thầy» — 3 tab nội dung mới (FILE NÀY CHỈ RENDER, logic ở 3 module thuần):
//    Án cổ (gu-gongan.js) · Năm hạn của bạn (namhan.js, cần lá số R) · Chọn kinh (kinh-tu.js).
//  Chỉ bản web (FEATURES.divination) — iOS tắt như app chính (features.js IOS_OFF gồm 'que').
//  Tải lười từ stations.js.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { castByTime, castByNumbers, solarToMhNums, TRIGRAMS } from '../engine/meihua.js';
import { castLiuYao } from '../engine/liuyao.js';
import { xiaoliurenDetail, solarToXlrNums } from '../engine/xiaoliuren.js';
import { jinkoujue, renderJinkoujueCard } from '../engine/jinkoujue.js';
import { qiuqian, zhiJiao } from '../engine/qiuqian.js';
import { hexagramMeaning } from '../engine/hexagram-meaning.js';
import { esc } from './stations.js';
import { buzz } from './haptics.js';
import { FEATURES } from './features.js';

const el = (h) => { const d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstElementChild; };
const ZHI_HOUR = ['', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const LUCK = (l) => (/大吉|^吉|Cát|CÁT|上/.test(l) ? 'good' : /凶|Hung|HUNG|下/.test(l) ? 'bad' : 'mid');
const TRI_VI = { 乾: 'Càn', 兑: 'Đoài', 离: 'Ly', 震: 'Chấn', 巽: 'Tốn', 坎: 'Khảm', 艮: 'Cấn', 坤: 'Khôn' };
const CATS_LY = [['general', 'Chung'], ['career', 'Công danh'], ['wealth', 'Tài lộc'], ['love', 'Tình duyên'], ['health', 'Sức khỏe'], ['parents', 'Cha mẹ / nhà'], ['children', 'Con cái'], ['siblings', 'Anh em / hợp tác']];
const CATS_XLR = [['general', 'Chung'], ['career', 'Sự nghiệp'], ['wealth', 'Tài lộc'], ['love', 'Tình duyên'], ['travel', 'Xuất hành'], ['lost', 'Tìm thất lạc'], ['health', 'Sức khỏe']];
const sel = (name, opts) => `<select class="hq-input" name="${name}">${opts.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select>`;

function nowParts(d = new Date()) { return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate(), h: d.getHours(), mi: d.getMinutes() }; }

// ---------------------------------------------------------------------------
// Mai Hoa
// ---------------------------------------------------------------------------
function meihuaHtml(g) {
  const tri = (t) => `${TRIGRAMS[t.tri].img} <b>${esc(t.tri)} ${TRI_VI[t.tri] || ''}</b> (${esc(t.wx)})`;
  const m = hexagramMeaning(g.name);
  return `<div class="hq-que-res">
    <p class="hq-que-hex"><span class="hq-han">${esc(g.name)}</span> ${m?.nameVi ? `· ${esc(m.nameVi)}` : ''}<br><span class="hq-sub">thượng ${esc(g.upper)} · hạ ${esc(g.lower)} · động hào ${esc(String(g.dong))}</span></p>
    <p>Thể (mình): ${tri(g.ti)}<br>Dụng (việc): ${tri(g.yong)}</p>
    <p>Quan hệ: <b>${esc(g.rel.k)}</b> → <span class="hq-luck ${LUCK(g.rel.luck)}">${esc(g.rel.luck)}</span> ${esc(g.rel.vi)}</p>
    <p>Hỗ quái <b>${esc(g.hu.name)}</b> (quá trình · ${esc(g.huRel.k)}) · Biến quái <b>${esc(g.bian.name)}</b> (kết quả · ${esc(g.bianRel.k)})</p>
    ${m?.fortune && !m.fortune.startsWith('(') ? `<p class="hq-quote">${esc(m.fortune)}</p>` : ''}
    <p class="hq-que-verdict">→ ${esc(g.verdict)}</p></div>`;
}

// ---------------------------------------------------------------------------
// Lục Hào: gieo 3 xu — mặt chữ (dương) = 3, mặt hoa (âm) = 2 → 6 lão âm · 7 thiếu dương · 8 thiếu âm · 9 lão dương
// ---------------------------------------------------------------------------
const LQ = { 父母: 'Phụ Mẫu', 兄弟: 'Huynh Đệ', 子孙: 'Tử Tôn', 妻财: 'Thê Tài', 官鬼: 'Quan Quỷ' };
function liuyaoHtml(r) {
  return `<div class="hq-que-res">
    <p class="hq-que-hex"><span class="hq-han">${esc(r.name)}</span><br><span class="hq-sub">cung ${esc(r.palace)} (${esc(r.gongWx)}) · thế hào ${esc(r.shi)} · ứng hào ${esc(r.ying)} · ${r.dongCount ? `${r.dongCount} hào động → biến ${esc(r.bianName)}` : 'tĩnh quái'}</span></p>
    <div class="hq-ly">${r.lines.slice().reverse().map((l) => `<div class="hq-ly-line${l.dong ? ' dong' : ''}"><span class="hq-ly-bar ${l.yang ? 'yang' : 'yin'}"></span>
      <span>${esc(l.pos)}</span><span class="hq-han sm">${esc(l.gan)}${esc(l.zhi)}</span><span>${esc(LQ[l.liuqin] || l.liuqin)}</span><span>${l.isShi ? 'Thế' : ''}${l.isYing ? 'Ứng' : ''}${l.dong ? ' ◉' : ''}${l.kong ? ' không' : ''}</span></div>`).join('')}</div>
    <p>Dụng thần: <b>${esc(r.yongshen.vi)}</b> · tháng ${esc(r.monthZhi)} · ngày ${esc((r.dayGan || '') + (r.dayZhi || ''))}</p>
    <p class="hq-que-verdict">→ <span class="hq-luck ${LUCK(r.luck)}">${esc(r.luck)}</span> ${esc(r.verdict)}</p></div>`;
}

// ---------------------------------------------------------------------------
// Tiểu Lục Nhâm
// ---------------------------------------------------------------------------
function xlrHtml(r) {
  const st = (lab, p, n) => `<div class="hq-xlr ${p.tone === 'CÁT' ? 'good' : 'bad'}"><small>${lab} (đếm ${n})</small><b class="hq-han">${esc(p.han)}</b><span>${esc(p.vi)}</span></div>`;
  const f = r.final;
  return `<div class="hq-que-res">
    <div class="hq-xlr-row">${st('Tháng', r.monthResult, r.input.month)}${st('Ngày', r.dayResult, r.input.day)}${st('Giờ', r.hourResult, r.input.hour)}</div>
    <p class="hq-sub">Âm lịch tháng ${r.input.month}, ngày ${r.input.day}, giờ ${ZHI_HOUR[r.input.hour]}</p>
    <p class="hq-que-verdict">→ <span class="hq-luck ${f.tone === 'CÁT' ? 'good' : 'bad'}">${esc(r.luck)}</span> ${esc(r.verdict)}</p>
    <ul class="hq-plain"><li>Bản chất: ${esc(f.essence || '')}</li><li>Sự nghiệp: ${esc(f.career)}</li><li>Tài lộc: ${esc(f.wealth)}</li><li>Tình duyên: ${esc(f.love)}</li><li>Xuất hành: ${esc(f.travel)}</li><li>Thất lạc: ${esc(f.lost)}</li><li>Lời khuyên: ${esc(f.advice)}</li></ul></div>`;
}

// ---------------------------------------------------------------------------
// Xin xăm + xin keo
// ---------------------------------------------------------------------------
function xamHtml(f) {
  return `<div class="hq-que-res">
    <p class="hq-que-hex"><span class="hq-han">第 ${esc(String(f.num))} 签</span> <span class="hq-luck ${LUCK(f.tone)}">${esc(f.toneVi)}</span></p>
    <p class="hq-han sm hq-poem">${esc(f.poem)}</p>
    <p><b>Điển cố:</b> ${esc(f.story)}</p><p>${esc(f.vi)}</p>
    <ul class="hq-plain"><li>Sự nghiệp: ${esc(f.career)}</li><li>Tài lộc: ${esc(f.wealth)}</li><li>Tình duyên: ${esc(f.love)}</li><li>Nên làm: ${esc(f.do)}</li><li>Tránh: ${esc(f.avoid)}</li></ul>
    <p class="hq-que-verdict">→ ${esc(f.summary)}</p></div>`;
}

// ---------------------------------------------------------------------------
// Đường Thầy — 3 tab mới (P0-1). CHỈ RENDER: chọn án/chấm điểm/map ngôn ngữ đều
// nằm trong gu-gongan.js · namhan.js · kinh-tu.js; các hàm dưới chỉ dựng chuỗi DOM.
// ---------------------------------------------------------------------------
const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const CMP_MARK = (m) => (m === true ? '✓ khớp' : m === false ? '✗ khác' : '—');

function gonganPanelHtml(g) {
  return `<div class="hq-que-res">
    <p class="hq-que-hex"><span class="hq-han">古案 · ${esc(g.person)}</span></p>
    <p>Tứ trụ: <span class="hq-han">${esc(g.pillarsText)}</span></p>
    <p class="hq-sub">Nguồn: ${esc(g.source)}</p>
    ${g.note ? `<p class="hq-sub">${esc(g.note)}</p>` : ''}
    <p class="hq-sub">Đoán trước khi đọc phán — ${g.total} bước, mỗi bước 1 điểm.</p>
    <div data-role="quiz"></div></div>`;
}

function compareHtml(g) {
  const c = g.compare;
  const axis = (name, classic, engine, m) =>
    `<li>• ${name}: cổ pháp «${esc(classic)}» · engine «${esc(engine)}» → <b>${CMP_MARK(m)}</b></li>`;
  const yongRow = c.axes.yong.match === null
    ? `<li>• Hành dụng: cổ pháp tranh cãi, không chốt · engine «${esc(c.engine.yong)}» → —</li>`
    : axis('Hành dụng', c.classic.yong, c.engine.yong, c.axes.yong.match);
  const geRow = c.axes.ge.match === null
    ? `<li>• Cách cục: cổ pháp không chốt · engine «${esc(c.engine.ge)}» → —</li>`
    : axis('Cách cục', c.classic.ge, c.engine.ge, c.axes.ge.match);
  return `<div data-role="cmp"><p><b>Đối chiếu hai phán</b></p>
    <p class="hq-han sm hq-quote">${esc(c.classic.verdict)}</p>
    <p class="hq-sub">Nguyên lý cổ: ${esc(c.classic.principle)}</p>
    <p class="hq-sub">Người trong án: ${esc(c.classic.person)} · nguồn: ${esc(c.classic.source)}</p>
    <ul class="hq-plain">${axis('Thân vượng/nhược', c.classic.strength, c.engine.strength, c.axes.strength.match)}${yongRow}${geRow}</ul>
    <p class="hq-note">${esc(c.note)}</p></div>`;
}

function wireGonganQuiz(out, g, mod) {
  const quiz = out.querySelector('[data-role=quiz]');
  const answers = {};
  let i = 0;
  const finish = () => {
    const gr = mod.gradeGongan(g, answers); // luật chấm nằm trong gu-gongan.js — UI chỉ render X/n
    quiz.innerHTML = `<p class="hq-que-verdict">Đoán của bạn: <b>${gr.score}/${gr.total}</b> — chấm ngay trong panel, không ghi ra sổ điểm.</p>
      ${compareHtml(g)}
      <div class="hq-actions"><button class="hq-btn" data-a="ghep" type="button">Bước 4 — bắt phán ghép (bài tập vạch mặt)</button></div>`;
    quiz.querySelector('[data-a=ghep]').onclick = () => {
      quiz.insertAdjacentHTML('beforeend', `<p><b>Thầy đọc lại «phán» cho án trên:</b></p><p class="hq-quote hq-han sm">${esc(g.fake.verdict)}</p>
        <p><b>Vạch mặt:</b> ${esc(g.fake.reveal)}</p><p class="hq-note">${esc(g.fake.lesson)}</p>`);
      buzz('medium');
    };
  };
  const next = () => {
    if (i >= g.steps.length) { finish(); return; }
    const st = g.steps[i];
    quiz.innerHTML = `<p><b>Bước ${i + 1}/${g.total}:</b> ${esc(st.prompt)}</p>
      <div class="hq-actions">${st.options.map((o) => `<button class="hq-btn" data-o="${esc(o)}" type="button">${esc(o)}</button>`).join('')}</div>`;
    quiz.querySelectorAll('button[data-o]').forEach((b) => {
      b.onclick = () => { answers[st.key] = b.dataset.o; i += 1; buzz('light'); next(); };
    });
  };
  next();
}

function namhanHtml(nh) {
  const dy = nh.dayun
    ? `<p><b>Đại vận đang đi:</b> ${esc(nh.dayun.vi)}</p>
       ${nh.godDecade ? `<p class="hq-sub">Chủ đề thập niên — <b>${esc(nh.godDecade.godVi)}</b>: ${esc(nh.godDecade.theme)}. ${esc(nh.godDecade.detail)}</p>` : ''}`
    : '<p class="hq-sub">Chưa vào đại vận đầu — giai đoạn nền tảng tuổi nhỏ, chưa luận năm hạn.</p>';
  const toneCls = (t) => (t === 'thuan' ? 'good' : t === 'thu' ? 'bad' : 'mid');
  const yrs = nh.years.map((y) => `<li>• Năm ${y.year} <span class="hq-han">${esc(y.ganZhi)}</span> — <span class="hq-luck ${toneCls(y.soft.tone)}">${esc(y.soft.text)}</span>
    <details><summary>tra cứu kỹ thuật</summary><p class="hq-sub">Chấm ${y.score}/100 (${esc(y.rating)}) · can năm ${esc(y.ganGod || '?')}</p><p>${esc(y.deep)}</p></details></li>`).join('');
  return `<div class="hq-que-res"><p class="hq-que-hex">Năm hạn của bạn</p>${dy}
    <ul class="hq-plain">${yrs}</ul>
    <p class="hq-quote">${esc(nh.advice)}</p>
    <p class="hq-note">Ngày sinh của bạn chỉ nằm trên máy, không rời khỏi thiết bị.</p></div>`;
}

function kinhHtml(kt) {
  const list = kt.kinh.map((k) => `<li>• <b>${esc(k.name_vi)}</b>${k.han ? ` <span class="hq-han sm">${esc(k.han)}</span>` : ''}<br><span class="hq-sub">${esc(k.notes)}</span><br>${esc(k.essence)}</li>`).join('');
  return `<div class="hq-que-res"><p class="hq-que-hex">Chọn kinh tu</p>
    ${kt.kinh.length ? `<ul class="hq-plain">${list}</ul>` : '<p class="hq-sub">Chưa gợi được kinh — thử thêm việc đang hỏi.</p>'}
    ${kt.yongAdvice ? `<p>${esc(kt.yongAdvice)}</p>` : ''}
    ${kt.chartAdvice ? `<p>${esc(kt.chartAdvice)}</p>` : ''}
    ${kt.amtaAdvice ? `<p>${esc(kt.amtaAdvice)}</p>` : ''}
    <p class="hq-note">Kinh để tham khảo, chiêm nghiệm — đọc chậm, đừng vội.</p></div>`;
}

/**
 * Bàn Thầy Giải Quẻ.
 * @param api  game api (panel, toast, state…)
 * @param opts.R  lá số người hỏi (để Thầy AI luận thêm)
 */
export function queBody(api, { R = null, who = 'Bạn' } = {}) {
  const TABS = [['meihua', 'Mai Hoa'], ['liuyao', 'Lục Hào'], ['xlr', 'Lục Nhâm'], ['jk', 'Kim Khẩu'], ['xam', 'Xin xăm'], ['gongan', 'Án cổ'], ['kinh', 'Chọn kinh']];
  if (R) TABS.push(['namhan', 'Năm hạn của bạn']); // chỉ hiện khi đã lập lá số (stations.js truyền sẵn R)
  const root = el(`<div class="hq-que">
    <p class="hq-sub">Thầy vuốt râu: «Tâm thành thì quẻ linh. Hỏi việc gì, cứ nói.»</p>
    <div class="hq-que-tabs" role="tablist">${TABS.map(([k, l], i) => `<button type="button" role="tab" class="hq-que-tab${i ? '' : ' on'}" data-k="${k}">${l}</button>`).join('')}</div>
    <label>Việc muốn hỏi <input class="hq-input" name="q" maxlength="120" placeholder="vd: tháng này đổi việc có nên không?"></label>
    <div data-role="form"></div>
    <div data-role="out"></div>
    <p class="hq-note">Quẻ để tham khảo, chiêm nghiệm — quyết định là ở bạn.</p>
  </div>`);
  const $ = (r) => root.querySelector(`[data-role=${r}]`);
  let tab = 'meihua', lastSummary = '';
  const show = (html, summary) => {
    $('out').innerHTML = html; lastSummary = summary; buzz('medium');
    if (FEATURES.ai && R) {
      const b = el('<div class="hq-actions"><button class="hq-btn hq-primary" type="button">🎙 Nhờ Thầy luận thêm theo lá số</button></div>');
      b.querySelector('button').onclick = () => import('./case-ui.js').then((m) => m.openMaster(api, { R, who, first: `${root.querySelector('[name=q]').value || 'Tôi hỏi việc chung'}. ${lastSummary} Thầy luận giúp tôi theo lá số của tôi, nên làm gì?` }));
      $('out').append(b);
    }
    $('out').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };

  function renderForm() {
    root.querySelectorAll('.hq-que-tab').forEach((b) => b.classList.toggle('on', b.dataset.k === tab));
    $('out').innerHTML = '';
    const f = $('form');
    if (tab === 'meihua') {
      f.innerHTML = `<p class="hq-sub">Gieo theo giờ khắc này, hoặc nghĩ trong đầu 2 con số.</p>
        <div class="hq-actions"><button class="hq-btn hq-primary" data-a="time" type="button">Gieo theo giờ hiện tại</button></div>
        <div class="hq-row-flex"><input class="hq-input" name="n1" inputmode="numeric" placeholder="số 1" maxlength="4"><input class="hq-input" name="n2" inputmode="numeric" placeholder="số 2" maxlength="4"><button class="hq-btn" data-a="num" type="button">Gieo theo số</button></div>`;
      f.querySelector('[data-a=time]').onclick = () => { const n = nowParts(); const g = castByTime(solarToMhNums(n.y, n.m, n.d, n.h, n.mi)); show(meihuaHtml(g), `Mai Hoa theo giờ ra quẻ ${g.name}, thể dụng ${g.rel.k} (${g.rel.luck}), biến ${g.bian.name}.`); };
      f.querySelector('[data-a=num]').onclick = () => {
        const a = parseInt(f.querySelector("[name=n1]").value, 10), b = parseInt(f.querySelector("[name=n2]").value, 10);
        if (!(a > 0 && b > 0)) { api.toast('Nhập 2 số nguyên dương.'); return; }
        const g = castByNumbers(a, b); show(meihuaHtml(g), `Mai Hoa theo số ${a}, ${b} ra quẻ ${g.name}, thể dụng ${g.rel.k} (${g.rel.luck}), biến ${g.bian.name}.`);
      };
    } else if (tab === 'liuyao') {
      f.innerHTML = `<label>Hỏi về ${sel('cat', CATS_LY)}</label>
        <p class="hq-sub">Chắp tay, gieo 3 đồng xu 6 lần — hào dựng từ dưới lên.</p>
        <div class="hq-coins" data-role="coins"><span></span><span></span><span></span></div>
        <div class="hq-ly-build" data-role="build"></div>
        <div class="hq-actions"><button class="hq-btn hq-primary" data-a="toss" type="button">Gieo lần 1/6</button></div>`;
      const vals = [];
      const btn = f.querySelector('[data-a=toss]');
      btn.onclick = () => {
        const coins = [0, 1, 2].map(() => (Math.random() < 0.5 ? 3 : 2));
        const v = coins.reduce((x, y) => x + y, 0);
        vals.push(v);
        f.querySelectorAll('.hq-coins span').forEach((c, i) => { c.className = ''; void c.offsetWidth; c.className = `flip ${coins[i] === 3 ? 'duong' : 'am'}`; c.textContent = coins[i] === 3 ? '字' : '花'; });
        const NAME = { 6: 'lão âm ◉', 7: 'thiếu dương', 8: 'thiếu âm', 9: 'lão dương ◉' };
        f.querySelector('[data-role=build]').insertAdjacentHTML('afterbegin', `<div class="hq-ly-line${v === 6 || v === 9 ? ' dong' : ''}"><span class="hq-ly-bar ${v % 2 ? 'yang' : 'yin'}"></span><span>Hào ${vals.length}: ${NAME[v]}</span></div>`);
        buzz('light');
        if (vals.length < 6) { btn.textContent = `Gieo lần ${vals.length + 1}/6`; return; }
        btn.disabled = true; btn.textContent = 'Đã đủ 6 hào';
        const l = Solar.fromDate(new Date()).getLunar();
        const r = castLiuYao(vals, f.querySelector("[name=cat]").value, l.getMonthZhi(), l.getDayZhi(), l.getDayGan(), l.getDayGan() + l.getDayZhi());
        show(liuyaoHtml(r), `Lục Hào hỏi ${CATS_LY.find((c) => c[0] === f.querySelector("[name=cat]").value)[1]} ra quẻ ${r.name}${r.dongCount ? ` biến ${r.bianName}` : ''}, kết luận ${r.luck}.`);
      };
    } else if (tab === 'xlr') {
      f.innerHTML = `<label>Hỏi về ${sel('cat', CATS_XLR)}</label><p class="hq-sub">Bấm đốt ngón tay theo tháng → ngày → giờ âm lịch lúc này.</p>
        <div class="hq-actions"><button class="hq-btn hq-primary" data-a="go" type="button">Bấm độn</button></div>`;
      f.querySelector('[data-a=go]').onclick = () => {
        const n = nowParts(); const x = solarToXlrNums(n.y, n.m, n.d, n.h, n.mi);
        const r = xiaoliurenDetail(x.month, x.day, x.hour, f.querySelector("[name=cat]").value);
        show(xlrHtml(r), `Tiểu Lục Nhâm ra cung ${r.final.vi} (${r.final.tone}).`);
      };
    } else if (tab === 'jk') {
      f.innerHTML = `<p class="hq-sub">Kim Khẩu Quyết (Đại Lục Nhâm rút gọn) lấy giờ khắc hỏi việc.</p><div class="hq-actions"><button class="hq-btn hq-primary" data-a="go" type="button">Lập khóa</button></div>`;
      f.querySelector('[data-a=go]').onclick = () => {
        const d = new Date(); const l = Solar.fromYmdHms(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), 0, 0).getLunar();
        try {
          const r = jinkoujue(l.getMonth(), l.getDay(), ZHI_HOUR.indexOf(l.getTimeZhi()), { solar: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(), hour: d.getHours() } });
          show(`<div class="hq-que-res hq-jk">${renderJinkoujueCard(r)}</div>`, `Kim Khẩu Quyết lập khóa giờ ${l.getTimeZhi()}.`);
        } catch (e) { api.toast(e.message || 'Chưa lập được khóa.'); }
      };
    } else if (tab === 'gongan') {
      const today = todayKey();
      f.innerHTML = `<p class="hq-sub">Mỗi ngày một án cổ nguyên văn: tự đoán 2–3 bước, rồi đối chiếu phán cổ với engine tự tiêu.</p>
        <div class="hq-actions"><button class="hq-btn hq-primary" data-a="go" type="button">Mở án cổ hôm nay</button></div>`;
      f.querySelector('[data-a=go]').onclick = () => {
        import('./gu-gongan.js').then((m) => {
          const g = m.buildGongan(`${who}|${today}`, today);
          show(gonganPanelHtml(g), `Án cổ ${g.person} — tứ trụ ${g.pillarsText}; tự đoán ${g.total} bước rồi đối chiếu hai phán.`);
          wireGonganQuiz($('out'), g, m);
        });
      };
    } else if (tab === 'namhan') {
      f.innerHTML = `<p class="hq-sub">Năm hạn theo lá số của chính bạn — đại vận đang đi và 5 năm tới. Dữ liệu chỉ nằm trên máy.</p>
        <div class="hq-actions"><button class="hq-btn hq-primary" data-a="go" type="button">Xem đại vận &amp; 5 năm tới</button></div>`;
      f.querySelector('[data-a=go]').onclick = () => {
        import('./namhan.js').then((m) => {
          const nh = m.buildNamHan(R, new Date().getFullYear());
          const nThuan = nh.years.filter((y) => y.soft.tone === 'thuan').length;
          show(namhanHtml(nh), `Năm hạn của bạn: ${nh.dayun ? nh.dayun.vi + '.' : 'chưa vào đại vận.'} 5 năm tới có ${nThuan} năm thuận.`);
        });
      };
    } else if (tab === 'kinh') {
      f.innerHTML = `<p class="hq-sub">Đạo Tạng gợi kinh theo Dụng thần của bạn (nếu đã lập số) và việc đang hỏi.</p>
        <div class="hq-actions"><button class="hq-btn hq-primary" data-a="go" type="button">Gợi kinh tu</button></div>`;
      f.querySelector('[data-a=go]').onclick = () => {
        import('./kinh-tu.js').then((m) => {
          const kt = m.kinhTu(R, root.querySelector('[name=q]').value);
          show(kinhHtml(kt), `Chọn kinh: ${kt.kinh.length} kinh gợi ý${kt.yongAdvice ? ' theo Dụng thần' : ''}${kt.chartAdvice ? ' và theo cách cục' : ''}.`);
        });
      };
    } else {
      f.innerHTML = `<p class="hq-sub">Quỳ trước điện, lắc ống xăm cho tới khi một thẻ rơi ra.</p><div class="hq-actions"><button class="hq-btn hq-primary" data-a="go" type="button">Lắc ống xăm</button></div>`;
      f.querySelector('[data-a=go]').onclick = () => {
        const q = root.querySelector('[name=q]').value;
        const x = qiuqian(q || 'việc chung', {});
        show(xamHtml(x), `Xin xăm được thẻ số ${x.num} (${x.toneVi}): ${x.summary}`);
        const jb = el(`<div class="hq-actions"><button class="hq-btn" type="button">Xin keo âm dương (hỏi thần có chấp thuận)</button></div>`);
        jb.querySelector('button').onclick = () => { const j = zhiJiao(); jb.insertAdjacentHTML('beforeend', `<p><span class="hq-han">${j.blocks.join(' ')}</span> · <b>${esc(j.vi)}</b> — ${esc(j.meaning)}</p>`); buzz('light'); };
        $('out').prepend(jb);
      };
    }
  }
  root.querySelector('.hq-que-tabs').addEventListener('click', (e) => { const b = e.target.closest('.hq-que-tab'); if (b) { tab = b.dataset.k; renderForm(); } });
  renderForm();
  return root;
}
