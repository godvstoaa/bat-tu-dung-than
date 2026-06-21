import { analyze } from './engine/chart.js';
import { Solar } from 'lunar-javascript';
import { TOPICS, answer, hanviet, wxVi } from './engine/interpret.js';
import { GAN, ZHI, ZHI_ORDER, WX_VI, WX_COLOR, TEN_GOD_VI, CHANGSHENG_VI } from './engine/constants.js';
import { INTERACTION_MEANING, DITIANSUI } from './engine/kb.js';
import { tieredAnalysis } from './engine/tiers.js';
import { evaluateDate, findGoodDates, ACTIVITY } from './engine/zheri.js';
import { computeZhai } from './engine/zhai.js';
import { computeHehun } from './engine/hehun.js';
import { analyzeLiunianDeep } from './engine/liunian-pro.js';
import { qianliEightSteps, QIANLI_QUOTE } from './engine/qianli.js';
import { computeLiuyue } from './engine/liuyue.js';
import { analyzeLiuRi, findGoodDays as findGoodDaysRi } from './engine/liuri.js';
import { taSuiTable, personalTaSui, taSuiDirection, TAISUI_REMEDY, TYPE_VI } from './engine/taisui.js';
import { analyzeName, wxOf } from './engine/name.js';
import { analyzeMangpai } from './engine/mangpai.js';
import { xuankongPan } from './engine/xuankong.js';
import { computeZiwei, yunXianSihua } from './engine/ziwei.js';
import { castByTime, castByNumbers, solarToMhNums, TRIGRAMS } from './engine/meihua.js';
import { castLiuYao } from './engine/liuyao.js';
import { qimenPan, qimenDongPan } from './engine/qimen.js';
import { liurenPan } from './engine/liuren.js';
import { analyzeKongwang } from './engine/kongwang.js';
import { analyzePillarAges } from './engine/pillar-age.js';
import { spaceFs } from './engine/space-fs.js';
import { dailyGuidance } from './engine/daily.js';
import { findIdealPartners, idealChildTiming, idealChildDates } from './engine/ideal-match.js';
import { analyzeMarriageDeep } from './engine/marriage-deep.js';
import { buildFullProfile } from './engine/partner-profile.js';
import { analyzeFamily } from './engine/family.js';
import { radialData, matrixData, radarData } from './engine/family-diagram.js';
import { rectifyHour } from './engine/family-rectify.js';
import { buildLifeTrajectory } from './engine/life-trajectory.js';
import { computeYearDaily } from './engine/year-daily.js';
import { analyzeChangsheng } from './engine/changsheng-deep.js';
import { gaimenhPlan } from './engine/gaimenh.js';
import { SHENSHA_INFO } from './engine/shensha.js';
import { computeShenshaExtra } from './engine/shensha-extra.js';
import { liunian12Shen } from './engine/liunian-shen.js';
import { nayinInfo } from './engine/nayin.js';
import { tongshengDay } from './engine/tongsheng.js';
import { taiYuan } from './engine/taiyuan.js';
import { xiuDay } from './engine/ershibaxiu.js';
import { interpretZiweiStars } from './engine/ziwei-stars.js';
import { computeAuxStars } from './engine/ziwei-aux.js';
import { computeMarriageShensha, computeExtraShensha } from './engine/shensha-marriage.js';
import { viToHan } from './engine/vi2han.js';
import { askAI, getConfig, setConfig, isAIReady, PRESETS, testAIConnection } from './engine/ai.js';

let currentResult = null;
let currentTopic = 'general';
let chatHistory = []; // bộ nhớ hội thoại AI: [{role:'user'|'assistant', content}]

const $ = (id) => document.getElementById(id);
function wxClass(w) { return `wx-${w}`; }
function godVi(g) { return TEN_GOD_VI[g] || g; }
// Escape mọi chuỗi động trước khi ghép HTML → chống XSS (dùng chung toàn app).
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));
// State + ánh xạ rating cho "Lưu Nhật cả năm" (khai báo sớm tránh TDZ khi run() gọi lúc load).
let currentYearDaily = null;
const YD_RATE_CLS = { 'Cát': 'rate-cat', 'Bình': 'rate-mid', 'Hơi kỵ': 'rate-bad', 'Kỵ': 'rate-hung' };
const YD_CHIP_CLS = { 'Cát': 'cat', 'Bình': 'binh', 'Hơi kỵ': 'hky', 'Kỵ': 'ky' };

// ---------------------------------------------------------------- TỨ TRỤ
function renderPillars(chart) {
  const labels = { year: 'Trụ Năm', month: 'Trụ Tháng', day: 'Trụ Ngày', time: 'Trụ Giờ' };
  const order = ['year', 'month', 'day', 'time'];
  $('pillars').innerHTML = order.map((key) => {
    const p = chart.pillars[key];
    const gWx = GAN[p.gan].wx, zWx = ZHI[p.zhi].wx;
    const ganGod = key === 'day' ? 'Nhật Chủ' : godVi(p.ganGod);
    const hidden = p.hidden.map((h) =>
      `<span class="chip ${wxClass(GAN[h.gan].wx)}">${h.gan} ${GAN[h.gan].vi}·${godVi(h.god)}</span>`).join('');
    return `
      <div class="pillar">
        <div class="pillar-head">${labels[key]}</div>
        <div class="gz gan">
          <div class="han ${wxClass(gWx)}">${p.gan}</div>
          <div class="vi">${GAN[p.gan].vi} · ${WX_VI[gWx]}</div>
          <div class="god">${ganGod}</div>
        </div>
        <div class="gz zhi">
          <div class="han ${wxClass(zWx)}">${p.zhi}</div>
          <div class="vi">${ZHI[p.zhi].vi} · ${ZHI[p.zhi].con}</div>
          <div class="hidden-stems">${hidden}</div>
        </div>
        <div class="pillar-foot">
          <div>Tàng can: <b>${WX_VI[zWx]}</b></div>
          <div>Trường sinh: <b>${CHANGSHENG_VI[p.changSheng]}</b></div>
          <div>Nạp âm: <b>${p.nayin}</b>${(() => { const ni = nayinInfo(p.nayin); return ni ? ` <span class="nayin-vi">${ni.vi}</span>` : ''; })()}</div>
          ${(() => { const ni = nayinInfo(p.nayin); return ni ? `<div class="nayin-meaning">${ni.meaning}</div>` : ''; })()}
        </div>
      </div>`;
  }).join('');
}

// ---------------------------------------------------------------- VERDICT (+ CÁCH CỤC + 用喜忌仇)
function renderVerdict(R) {
  const { chart, strength, yong, pattern } = R;
  const dm = chart.dayMaster;
  const pill = (w, extra) => `<span class="elem-pill ${wxClass(w)}">${w} ${WX_VI[w]}${extra || ''}</span>`;
  const favHtml = [...new Set([yong.primary, yong.secondary].filter(Boolean))].map((w) => pill(w)).join('');
  const reasons = yong.reasons.map((r) => `<li>${r}</li>`).join('');
  const tiaohou = yong.tiaohou.note
    ? `<div class="tiaohou-note"><b>調候 Điều Hậu:</b> ${yong.tiaohou.note}</div>` : '';
  const methodBadges = yong.method.map((m) => `<span class="badge-method">${m}</span>`).join('');

  $('verdict').innerHTML = `
    <div class="v-box">
      <div class="v-label">Nhật Chủ (日主)</div>
      <div class="v-value ${wxClass(dm.wx)}">${dm.gan} ${dm.vi} · ${WX_VI[dm.wx]}</div>
    </div>
    <div class="v-box">
      <div class="v-label">Cách Cục (格局)</div>
      <div class="v-value pattern-value">${pattern.vi}<span class="zh small">${pattern.name}</span></div>
      <div class="v-sub">${pattern.shunNi} · ${pattern.type === 'special' ? 'ngoại cách' : (pattern.type === 'luyue' ? 'nguyệt lệnh tỷ kiếp' : 'chính cách')}</div>
    </div>
    <div class="v-box">
      <div class="v-label">Vượng suy (${strength.deLenh ? 'đắc lệnh' : 'thất lệnh'} · phù ${(strength.ratio * 100).toFixed(1)}%)</div>
      <div class="v-value">${strength.level}</div>
    </div>
    <div class="v-box">
      <div class="v-label">DỤNG THẦN (用神) — nên dùng</div>
      <div class="v-value">${favHtml}</div>
    </div>
    <div class="v-box">
      <div class="v-label">HỶ THẦN (喜神) — sinh trợ Dụng</div>
      <div class="v-value">${pill(yong.xi)}</div>
    </div>
    <div class="v-box">
      <div class="v-label">KỴ THẦN (忌神) — khắc Dụng, tránh</div>
      <div class="v-value">${pill(yong.ji)}</div>
    </div>
    <div class="v-box">
      <div class="v-label">THÙ THẦN (仇神) — sinh Kỵ, hại gián tiếp</div>
      <div class="v-value">${pill(yong.chou)}</div>
    </div>
    <div class="v-box full">
      <div class="v-label">Phép lấy Dụng Thần & Lập luận</div>
      <div class="method-row">${methodBadges}</div>
      <ul class="reasons">${reasons}</ul>
      ${tiaohou}
    </div>`;
}

// ---------------------------------------------------------------- BẢN MỆNH KINH ĐIỂN
function renderClassic(R) {
  const dm = R.chart.dayMaster;
  const dt = DITIANSUI[dm.gan];
  $('classic').innerHTML = `
    <div class="classic-dm">${dm.gan} <span class="zh">${dm.gan}</span> ${dm.vi} · <span class="${wxClass(dm.wx)}">${WX_VI[dm.wx]}</span></div>
    <div class="verse-box">
      <div class="verse-zh">${dt.verse}</div>
      <div class="verse-vi">${dt.vi}</div>
    </div>
    <p class="classic-nature">${dt.nature}</p>
    <p class="classic-need"><b>Nhu cầu khai vận:</b> ${dt.need}</p>
    <div class="tiaohou-note"><b>調候 窮通寶鑑 (${dm.gan} × ${R.chart.monthZhi}):</b> ${R.yong.tiaohou.note || '(không)'}</div>`;
}

// ---------------------------------------------------------------- TỬ VI ĐẨU SỐ (khung mệnh bàn)
function renderZiwei() {
  const i = currentResult.chart.input;
  const z = computeZiwei(i.year, i.month, i.day, i.hour, i.minute, i.gender);
  const pal = z.palaces.map((p) => `
    <div class="zw-cell ${p.isMing ? 'ming' : ''} ${p.isShen ? 'shen' : ''}">
      <div class="zw-palace">${p.zh}<span class="zw-pvi">${p.vi.split('(')[0]}</span>${p.isMing ? '<b>★命</b>' : ''}${p.isShen && !p.isMing ? '<b>身</b>' : ''}</div>
      <div class="zw-gz"><span class="zh">${p.gan}</span><span class="zh">${p.zhi}</span></div>
      <div class="zw-stars">${(p.stars || []).join(' ')}</div>
    </div>`).join('');
  const dx = z.daXian.slice(0, 6).map((d) => `<div class="zw-dx"><b>${d.from}-${d.to}t</b> ${d.palace} <span class="zh">${d.ganZhi}</span></div>`).join('');
  const sihuaHtml = Object.entries(z.sihua || {}).map(([k, v]) =>
    `<span class="zw-sh ${v.tone}"><b>${k}</b> ${v.star}${v.palace ? '@' + v.palace : ''}</span>`).join('');
  $('ziwei').innerHTML = `
    <div class="zw-head">Mệnh cung <span class="zh big">${z.mingGong}</span> · Thân cung ${z.shenGong} · <span class="ln-rate rate-mid">${z.juVi}</span>
      <span class="hint-inline">(ÂL ${z.birth.lunarMonth}月${z.birth.lunarDay}日 · 时 ${z.birth.timeZhi} · 紫微@${z.ziweiBranch||'?'} · 天府@${z.tianfuBranch||'?'})</span></div>
    <div class="zw-grid">${pal}</div>
    <h4 class="syn-h4">四化 生年 (theo năm can ${z.birth.yearGan}) —禄/权/科/忌</h4>
    <div class="zw-sihua">${sihuaHtml}</div>
    ${(() => {
      const yx = yunXianSihua(z, new Date().getFullYear(), i.year);
      const fmt = (sh) => Object.entries(sh || {}).map(([k, v]) => `<span class="zw-sh ${v.tone}"><b>${k}</b> ${v.star}@${v.palace || '?'}</span>`).join('');
      return `
    <h4 class="syn-h4">运限四化 — 大限(${yx.activeDy?.ganZhi||'?'} ${yx.activeDy?.from}-${yx.activeDy?.to}t) + 流年(${yx.yearStem})</h4>
    <div class="zw-sihua"><span style="color:var(--muted);font-size:11px">大限:</span> ${fmt(yx.dxSihua)}</div>
    <div class="zw-sihua"><span style="color:var(--muted);font-size:11px">流年:</span> ${fmt(yx.lnSihua)}</div>`;
    })()}
    <h4 class="syn-h4">博士十二神 (niên hệ, 禄存@${z.boshi?.luCunZhi} ${z.boshi?.direction})</h4>
    <div class="zw-dxrow" style="grid-template-columns:repeat(6,1fr)">${(z.boshi?.stars||[]).map((s) => `<div class="zw-dx"><span class="zh">${s.star}</span> <span class="ln-rate ${s.tone==='cat'?'rate-cat':'rate-hung'}" style="font-size:10px">${s.atZhi}</span></div>`).join('')}</div>
    <h4 class="syn-h4">辅星 (左辅右弼/文昌文曲/天魁天钺)</h4>
    <div class="zw-dxrow" style="grid-template-columns:repeat(6,1fr)">${(z.fuxing?.stars||[]).map((s) => `<div class="zw-dx" title="${s.desc}"><span class="zh">${s.star}</span> <span class="ln-rate rate-cat" style="font-size:10px">${s.atZhi}</span></div>`).join('')}</div>
    <h4 class="syn-h4">大限 (đại hạn, 10 năm/cung, ${z.ju}t起运)</h4>
    <div class="zw-dxrow">${dx}</div>
    <p class="hint">${z.note}</p>`;
}

// ---------------------------------------------------------------- TỔNG LUẬN MỆNH
function renderSynthesis(R) {
  const s = R.synthesis;
  if (!s || !s.paragraphs) { $('synthesis').innerHTML = '<p class="hint">Chưa tính được tổng luận.</p>'; return; }
  const combosHtml = (s.combos && s.combos.length)
    ? `<div class="combos">${s.combos.map((c) => `<span class="combo ${c.tone}"><b>${c.vi}</b> <span class="zh small">${c.name}</span> — ${c.desc}</span>`).join('')}</div>`
    : '<p class="hint">Không có tổ hợp Thập thần nổi bật.</p>';
  const gradeTone = s.score >= 68 ? 'cat' : (s.score >= 55 ? 'mid' : 'warn');
  $('synthesis').innerHTML = `
    <div class="syn-head">
      <div class="syn-grade ${gradeTone}"><span class="zh big">${s.grade}</span><span>${s.gradeVi}</span></div>
      <div class="syn-fortune"><b>${s.fortuneVi}</b> · điểm <b>${s.score}/100</b></div>
    </div>
    <p class="syn-lead">${s.paragraphs[0]} ${s.paragraphs[1]}</p>
    <details class="syn-factors"><summary>Các nhân tố chấm điểm (cách – tình – lực – thanh trọc – phối hợp)</summary><div class="factor-list">${s.factors.map((f) => `<div class="factor">${f}</div>`).join('')}</div></details>
    <h4 class="syn-h4">Tổ hợp Thập Thần (十神组合)</h4>
    ${combosHtml}
    <p class="syn-advice">${s.paragraphs[3]}</p>`;
}

// ---------------------------------------------------------------- NGŨ HÀNH
function renderWuXing(wx) {
  const max = Math.max(...Object.values(wx.pct));
  $('wuxing').innerHTML = ['木', '火', '土', '金', '水'].map((w) => {
    const pct = wx.pct[w];
    const width = max > 0 ? (pct / max) * 100 : 0;
    return `
      <div class="wx-row">
        <div class="wx-name"><span class="dot" style="background:${WX_COLOR[w]}"></span>${w} ${WX_VI[w]}</div>
        <div class="wx-track"><div class="wx-fill" style="width:${width}%;background:${WX_COLOR[w]}"></div></div>
        <div class="wx-pct">${pct}%</div>
      </div>`;
  }).join('');
}

// ---------------------------------------------------------------- HỘI – HỢP – XUNG
function renderInteractions(R) {
  const it = R.interactions;
  const chip = (label, items, cls) => items.length
    ? `<div class="ix-group ${cls}"><span class="ix-label">${label}</span> ${items.map((x) => `<span class="ix-chip">${x}</span>`).join('')}</div>` : '';
  const ganHe = it.ganHe.map((g) => `${g.a}${g.b}→${g.hua}`);
  const zhiHe = it.zhiHe.map((g) => `${g.a}${g.b}→${g.hua}`);
  const san = [...it.sanHui.map((s) => `會 ${s.branches.join('')}→${s.wx}`), ...it.sanHe.map((s) => `合 ${s.branches.join('')}→${s.wx}`)];
  const chong = it.chong.map((c) => `${c.a}↔${c.b}`);
  const xing = it.xing.map((c) => `${c.a}${c.a === c.b ? '' : '–' + c.b} (${c.vi})`);
  const hai = it.hai.map((c) => `${c.a}–${c.b}`);
  const any = san.length || ganHe.length || zhiHe.length || chong.length || xing.length || hai.length;
  $('interactions').innerHTML =
    chip('Tam hội/hợp', san, 'cat') +
    chip('Can hợp', ganHe, 'cat') + chip('Chi lục hợp', zhiHe, 'cat') +
    chip('Xung', chong, 'warn') + chip('Hình', xing, 'warn') + chip('Hại', hai, 'warn') +
    (any ? '' : `<p class="hint">Tứ trụ tương đối yên tĩnh, không có xung hợp rõ.</p>`) +
    `<p class="ix-meaning">${meaningFor(it)}</p>`;
}
function meaningFor(it) {
  const m = [];
  if (it.sanHe.length || it.sanHui.length) m.push(INTERACTION_MEANING.sanHe);
  if (it.ganHe.length) m.push(INTERACTION_MEANING.ganHe);
  if (it.chong.length) m.push(INTERACTION_MEANING.chong);
  if (it.xing.length) m.push(INTERACTION_MEANING.xing);
  return m.slice(0, 2).join(' ');
}

// ---------------------------------------------------------------- THẦN SÁT
function renderShensha(R) {
  const keys = Object.keys(R.shensha);
  if (!keys.length) { $('shensha').innerHTML = '<p class="hint">Không có thần sát nổi bật.</p>'; return; }
  $('shensha').innerHTML = keys.map((k) => {
    const info = SHENSHA_INFO[k];
    const at = R.shensha[k].at;
    return `<div class="ss ${info.tone}">
      <div class="ss-zh">${info.zh}</div>
      <div class="ss-vi">${info.vi} <span class="ss-at">@ ${at.join('/')}</span></div>
      <div class="ss-desc">${info.desc}</div>
    </div>`;
  }).join('');
}

// ---------------------------------------------------------------- THẦN SÁT MỞ RỘNG (niên can/chi hệ)
function renderShenshaExtra(R) {
  const ex = computeShenshaExtra(R.chart);
  if (!ex || !ex.length) return;
  const html = `<h4 class="syn-h4" style="grid-column:1/-1;margin-top:6px">神煞 niên can/chi (红鸾/禄存/擎羊/孤辰寡宿…)</h4>` +
    ex.map((s) => `<div class="ss ${s.tone}">
      <div class="ss-zh">${s.zh}</div>
      <div class="ss-vi">${s.vi} <span class="ss-at">${s.at}</span></div>
      <div class="ss-desc">${s.desc}</div>
    </div>`).join('');
  $('shensha').insertAdjacentHTML('beforeend', html);
}

// ---------------------------------------------------------------- ĐẠI VẬN / LƯU NIÊN
function rateClass(rating) {
  return { 'Cát': 'rate-cat', 'Hơi thuận': 'rate-good', 'Bình hòa': 'rate-mid',
    'Hơi nghịch': 'rate-bad', 'Hung': 'rate-hung' }[rating] || 'rate-mid';
}
function renderDaYun(dayun) {
  if (!dayun.length) { $('dayun').innerHTML = '<p class="hint">Không tính được Đại Vận.</p>'; return; }
  $('dayun').innerHTML = dayun.map((d) => `
    <div class="dy">
      <div class="dy-gz"><span class="${wxClass(d.ganWx)}">${d.gan}</span><span class="${wxClass(d.zhiWx)}">${d.zhi}</span></div>
      <div class="dy-vi">${hanviet(d.ganZhi)}</div>
      <div class="dy-age">${d.startAge}–${d.startAge + 9}t</div>
      <div class="dy-rate ${rateClass(d.rating)}">${d.rating}</div>
    </div>`).join('');
}
function renderLiuNian(liunian) {
  if (!liunian.length) { $('liunian').innerHTML = '<p class="hint">Không tính được Lưu Niên.</p>'; return; }
  const nowItem = liunian.find((l) => l.isNow);
  $('liunian-note').textContent = nowItem ? `(đại vận ${hanviet(nowItem.dayunGanZhi)})` : '';
  $('liunian').innerHTML = liunian.map((l) => `
    <div class="ln ${l.isNow ? 'ln-now' : ''}">
      <div class="ln-year">${l.year}${l.isNow ? ' ★' : ''}</div>
      <div class="ln-gz"><span class="${wxClass(l.ganWx)}">${l.gan}</span><span class="${wxClass(l.zhiWx)}">${l.zhi}</span></div>
      <div class="ln-age">${l.age}t</div>
      <div class="ln-rate ${rateClass(l.rating)}">${l.rating}</div>
    </div>`).join('');
}

// ---------------------------------------------------------------- TABS LUẬN GIẢI
function renderTabs() {
  $('tabs').innerHTML = TOPICS.map((t) =>
    `<button class="tab ${t.id === currentTopic ? 'active' : ''}" data-id="${t.id}">${t.label}</button>`).join('');
  $('tabs').querySelectorAll('.tab').forEach((b) =>
    b.addEventListener('click', () => { currentTopic = b.dataset.id; renderTabs(); renderTopic(); }));
}
function renderTopic() {
  if (currentTopic === 'luck') {
    const block = answer('luck', currentResult);
    $('topic-body').innerHTML = `<h3>${block.title}</h3>${block.paragraphs.map((p) => `<p>${p}</p>`).join('')}`;
    return;
  }
  const ta = tieredAnalysis(currentResult, currentTopic);
  $('topic-body').innerHTML = `
    <h3>${ta.topic}</h3>
    <p class="tier-intro">Phân tích <b>9 tầng</b> cổ pháp — từ bản khí đến kết luận cấp độ:</p>
    <div class="tier-list">${ta.tiers.map((t) => `
      <div class="tier">
        <div class="tier-head"><span class="tier-n">T${t.n}</span><span class="tier-name">${t.name}</span></div>
        <div class="tier-text">${t.text}</div>
      </div>`).join('')}</div>`;
}

// ---------------------------------------------------------------- LỤC THÂN
function renderLiuqin(R) {
  const list = R.liuqin || [];
  if (!list.length) { $('liuqin').innerHTML = '<p class="hint">Chưa tính được Lục Thân.</p>'; return; }
  $('liuqin').innerHTML = list.map((r) => `
    <div class="lq">
      <div class="lq-rel">${r.relVi} <span class="lq-star">${r.mainStar ? '★ ' + r.mainStar : ''}</span><span class="lq-stable ${r.stable ? 'ok' : 'warn'}">${r.stable ? 'cung yên' : 'cung bị xung'}</span></div>
      <div class="lq-palace">${r.palace} · tàng ${r.palaceGod}${r.starInPalace ? ' · tinh tại cung (chính vị)' : ''}</div>
      <div class="lq-verdict">${r.verdict}</div>
    </div>`).join('');
}

// ---------------------------------------------------------------- NGHỊCH THIÊN CẢI MỆNH
function renderRemedy(R) {
  const rm = R.remedy;
  if (!rm || !rm.twelveLaws) { $('remedy').innerHTML = '<p class="hint">Chưa tính được Cải Mệnh.</p>'; return; }
  const timing = (rm.timing || []).length
    ? `<div class="remedy-timing"><b>⏰ Thời điểm vàng (lưu niên CÁT mang Dụng/Hỷ):</b> ${rm.timing.map((t) => `${t.year} (${t.rating})`).join(', ')}</div>` : '';
  const specific = (rm.specific || []).length
    ? `<div class="remedy-specific"><b>🛡 Hóa giải tổ hợp hung:</b>${rm.specific.map((s) => `<div class="sp-item"><b>${s.combo}</b>: ${s.remedy}</div>`).join('')}</div>` : '';
  $('remedy').innerHTML = `
    <div class="remedy-liaofan">${rm.liaofan.principle}</div>
    <div class="remedy-byel"><b>Bổ Dụng ${rm.byElement.dung.wx} / phối Hỷ ${rm.byElement.hy.wx}:</b>
      phương <b>${rm.byElement.dung.direction}</b>; màu <b>${rm.byElement.dung.color}</b>; nghề <b>${rm.byElement.dung.career.split('，')[0]}</b>; nhà ${rm.byElement.dung.house}; số ${rm.byElement.dung.number}; thực phẩm ${rm.byElement.dung.food.split('，')[0]}.</div>
    ${timing}
    <h4 class="syn-h4">改运十二法 (12 pháp cải vận)</h4>
    <div class="laws">${rm.twelveLaws.map((l) => `<div class="law">${l}</div>`).join('')}</div>
    ${specific}
    <div class="remedy-quote">${rm.liaofan.quote}</div>
    <div class="remedy-core">${rm.liaofan.coreMethod}</div>`;
}

// ---------------------------------------------------------------- CHAT AI  (XSS-safe: textContent)
function appendMsg(role, text) {
  const wrap = document.createElement('div');
  wrap.className = `msg msg-${role}`;
  const badge = document.createElement('div');
  badge.className = 'msg-badge';
  badge.textContent = role === 'user' ? 'Bạn' : 'Trợ lý';
  const body = document.createElement('div');
  body.className = 'msg-text';
  body.textContent = text;
  wrap.appendChild(badge); wrap.appendChild(body);
  $('chat-log').appendChild(wrap);
  $('chat-log').scrollTop = $('chat-log').scrollHeight;
  return { body, badge };
}

function updateAIStatus() {
  const cfg = getConfig();
  $('ai-status').textContent = isAIReady(cfg)
    ? `✓ Đang dùng AI (${cfg.model})` : '⊘ Chưa cấu hình AI — đang dùng bộ luân giải cục bộ. Bấm ⚙ để bật AI.';
}

async function handleAsk() {
  if (!currentResult) return;
  const q = $('question').value.trim();
  if (!q) return;
  $('question').value = '';
  appendMsg('user', q);
  const { body, badge } = appendMsg('assistant', 'Đang luân giải…');
  body.classList.add('streaming');
  const cfg = getConfig();
  let lastStatus = '';
  try {
    const { source, text } = await askAI(q, currentResult, cfg, {
      history: chatHistory,
      onStatus: (s) => { lastStatus = s; body.textContent = s + ' …'; $('chat-log').scrollTop = $('chat-log').scrollHeight; },
      onToken: (_delta, full) => { body.textContent = full; $('chat-log').scrollTop = $('chat-log').scrollHeight; },
    });
    body.textContent = text;
    body.classList.remove('streaming');
    badge.textContent = source === 'ai' ? 'Trợ lý AI' : 'Trợ lý (cục bộ)';
    // lưu bộ nhớ hội thoại
    chatHistory.push({ role: 'user', content: q });
    chatHistory.push({ role: 'assistant', content: text });
    if (chatHistory.length > 16) chatHistory = chatHistory.slice(-16);
  } catch (e) {
    body.textContent = 'Lỗi: ' + e.message;
    body.classList.remove('streaming');
  }
}

// ---------------------------------------------------------------- MODAL AI
function fillPresetNote(id) {
  const p = PRESETS.find((x) => x.id === id);
  $('cfg-preset-note').textContent = p && p.note ? p.note : '';
}
function applyPreset(id) {
  const p = PRESETS.find((x) => x.id === id);
  if (!p || id === 'custom') { fillPresetNote(id); return; }
  $('cfg-endpoint').value = p.endpoint;
  $('cfg-model').value = p.model;
  fillPresetNote(id);
}
function openModal() {
  const cfg = getConfig();
  // Khởi tạo dropdown preset (1 lần)
  if ($('cfg-preset').options.length === 0) {
    $('cfg-preset').innerHTML = PRESETS.map((p) => `<option value="${p.id}">${p.label}</option>`).join('');
    $('cfg-preset').addEventListener('change', (e) => applyPreset(e.target.value));
  }
  const cur = cfg.preset || (PRESETS.find((p) => p.endpoint === cfg.endpoint)?.id) || 'custom';
  $('cfg-preset').value = cur;
  $('cfg-enabled').checked = !!cfg.enabled;
  $('cfg-endpoint').value = cfg.endpoint || '';
  $('cfg-apikey').value = cfg.apiKey || '';
  $('cfg-model').value = cfg.model || '';
  fillPresetNote(cur);
  $('ai-modal').classList.remove('hidden');
}
function closeModal() { $('ai-modal').classList.add('hidden'); }
function saveModal() {
  setConfig({
    enabled: $('cfg-enabled').checked,
    endpoint: $('cfg-endpoint').value.trim(),
    apiKey: $('cfg-apikey').value.trim(),
    model: $('cfg-model').value.trim(),
    preset: $('cfg-preset').value,
  });
  updateAIStatus();
  closeModal();
}

// ---------------------------------------------------------------- MAIN
function run() {
  const dateVal = $('date').value;
  const timeVal = $('time').value || '12:00';
  if (!dateVal) return;
  const [y, m, d] = dateVal.split('-').map(Number);
  const [hh, mm] = timeVal.split(':').map(Number);
  const gender = document.querySelector('input[name="gender"]:checked').value;

  currentResult = analyze(y, m, d, hh, mm, gender);
  const c = currentResult.chart;

  const ty = taiYuan(c.pillars.month.gan, c.pillars.month.zhi);
  $('meta-line').textContent =
    `Dương lịch: ${c.solar} · Âm lịch: ${c.lunar.year}/${c.lunar.month}/${c.lunar.day} · ` +
    `Tiết khí: ${c.jieqi.prev.name} · Thai nguyên: ${ty.ganZhi} (${ty.ganVi} ${ty.zhiVi} — ${ty.wx})`;

  renderPillars(c);
  renderVerdict(currentResult);
  renderSynthesis(currentResult);
  renderQianli(currentResult);
  renderMangpai(currentResult);
  renderGaimenh(currentResult);
  const xkYear = new Date().getFullYear();
  $('xk-year').value = xkYear;
  renderXuankong(xkYear);
  renderClassic(currentResult);
  renderZiwei();
  renderLiuqin(currentResult);
  renderRemedy(currentResult);
  renderWuXing(currentResult.wx);
  renderInteractions(currentResult);
  renderShensha(currentResult);
  renderShenshaExtra(currentResult);
  try{renderExtraShensha();
  try{renderMarriageDeep();}catch(e){}}catch(e){}
  renderDaYun(currentResult.dayun);
  renderLiuNian(currentResult.liunian);
  const curYear = new Date().getFullYear();
  $('ly-year').value = curYear;
  renderLyear(curYear);
  try { $('yd-year').value = curYear; renderYearDaily(currentResult, curYear); } catch (e) { console.warn('yd', e.message); }
  $('lm-year').value = curYear;
  renderLiuyue(curYear);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  $('lr-date').value = todayStr;
  renderLiuRi(todayStr);
  $('ts-year').value = curYear;
  renderTaisui(curYear);
  $('lns-year').value = curYear;
  renderLiunianShen(curYear);
  renderName();
  currentTopic = 'general';
  renderTabs();
  renderTopic();
  $('chat-log').replaceChildren();
  chatHistory = [];
  updateAIStatus();
  try{renderDaily();}catch(e){console.warn('daily',e.message);}
  try{renderSpaceFs();}catch(e){console.warn('spaceFs',e.message);}
  try{renderPillarAge();}catch(e){console.warn('pillarAge',e.message);}
  try{renderKongwang();}catch(e){console.warn('kongwang',e.message);}
  try{renderChangshengDeep();}catch(e){console.warn('csDeep',e.message);}
  try{renderIdealMatch();}catch(e){console.warn('idealMatch',e.message);}
  try{renderZiweiFull();}catch(e){console.warn('ziweiFull',e.message);}
  try{renderLifeTrajectory(currentResult);}catch(e){console.warn('life',e.message);}
  $("result").classList.remove("hidden");
  $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------------------------------------------------------------- LƯU NGUYỆT (vận từng tháng)
function renderLiuyue(year) {
  if (!currentResult) return;
  const lm = computeLiuyue(currentResult, year);
  const GOD_VI = { 比肩:'Tỷ Kiên', 劫財:'Kiếp Tài', 食神:'Thực Thần', 傷官:'Thương Quan', 偏財:'Thiên Tài', 正財:'Chính Tài', 七殺:'Thất Sát', 正官:'Chính Quan', 偏印:'Thiên Ấn', 正印:'Chính Ấn' };
  $('liuyue').innerHTML = `
    <p class="hint">Tháng CÁT (nên tiến thủ): <b>${lm.best.map((m) => `T${m.m + 1} ${m.ganZhi}`).join(', ')}</b> · Tháng KỴ (cẩn thận): <b>${lm.worst.map((m) => `T${m.m + 1} ${m.ganZhi}`).join(', ')}</b></p>
    <div class="lm-grid">${lm.months.map((m) => {
      const cls = m.rating === 'Cát' ? 'rate-cat' : m.rating === 'Kỵ' ? 'rate-hung' : m.rating === 'Hơi kỵ' ? 'rate-bad' : 'rate-mid';
      return `<div class="lm-cell"><div class="lm-m">T${m.m + 1}</div><div class="zh">${m.ganZhi}</div><div class="lm-g">${GOD_VI[m.ganGod] || m.ganGod}</div><div class="ln-rate ${cls}">${m.rating}</div></div>`;
    }).join('')}</div>`;
}

// ---------------------------------------------------------------- LƯU NHẬT (vận từng ngày)
function renderLiuRi(dateStr) {
  if (!currentResult || !dateStr) return;
  const [y, m, d] = dateStr.split('-').map(Number);
  const r = analyzeLiuRi(currentResult, y, m, d);
  const GOD_VI = { 比肩: 'Tỷ Kiên', 劫財: 'Kiếp Tài', 食神: 'Thực Thần', 傷官: 'Thương Quan', 偏財: 'Thiên Tài', 正財: 'Chính Tài', 七殺: 'Thất Sát', 正官: 'Chính Quan', 偏印: 'Thiên Ấn', 正印: 'Chính Ấn' };
  const cls = r.score >= 64 ? 'rate-cat' : r.score >= 50 ? 'rate-mid' : r.score >= 38 ? 'rate-bad' : 'rate-hung';
  $('liuri').innerHTML = `
    <div class="ly-head"><span class="zh big">${r.ganZhi}</span> ${r.solar} · can <b>${GOD_VI[r.ganGod] || r.ganGod}</b> → <span class="ln-rate ${cls}">${r.rating} (${r.score}/100)</span></div>
    <div class="ly-schools">${r.schools.map((s) => `<div class="ly-school ${s.d >= 0 ? 'pos' : 'neg'}"><div class="ly-sname">${s.phai} <span class="ly-d">${s.d >= 0 ? '+' : ''}${s.d}</span></div><div class="ly-snote">${s.note}</div></div>`).join('')}</div>
    <p class="zr-advice">${r.advice}</p>`;
}

// ---------------------------------------------------------------- THÁI TUẾ
function renderTaisui(year) {
  const ys = yearGanZhi(year);
  const yGan = ys[0];
  const yZhi = ys[1];
  const table = taSuiTable(yZhi);
  const userZhi = currentResult ? currentResult.chart.pillars.year.zhi : null;
  const me = userZhi ? personalTaSui(userZhi, yZhi) : null;
  const offenders = table.filter((r) => r.types.length);
  const cls = (lvl) => lvl === 'nặng' ? 'rate-hung' : 'rate-bad';
  $('taisui').innerHTML = `
    <div class="ts-head">Năm ${year} <span class="zh">${yGan}${yZhi}</span> · Thái tuế ở phương <b>${taSuiDirection(yZhi)}</b> (kỵ động thổ phương này).</div>
    <div class="ts-grid">${table.map((r) => {
      const isMe = userZhi === r.zhi;
      const tag = r.types.length ? r.types.map((t) => TYPE_VI[t].split(' ')[0]).join('+') : '—';
      return `<div class="ts-cell ${r.types.length ? 'offend ' + cls(r.level) : ''} ${isMe ? 'me' : ''}"><div class="ts-z">${ZHI[r.zhi].con}</div><div class="ts-tag">${tag}</div></div>`;
    }).join('')}</div>
    ${me ? `<div class="ts-me ${me.offends ? (me.level === 'nặng' ? 'rate-hung' : 'rate-bad') : 'ok'}"><b>Bạn (${ZHI[userZhi].con}):</b> ${me.msg}${me.offends ? ` → nên佩 con giáp tam hợp <b>${me.remedyCharms.join(', ')}</b> để hoá giải.` : ''}</div>` : ''}
    <details class="syn-factors"><summary>7 pháp hoá thái tuế (化太岁)</summary><div class="laws">${TAISUI_REMEDY.map((l) => `<div class="law">${l}</div>`).join('')}</div></details>
    <p class="hint">Lập Xuân (≈4/2) mới là lúc giao thái tuế — nên hoá giải sớm sau Lập Xuân.</p>`;
}

// ---------------------------------------------------------------- LƯU NIÊN 12 THẦN (四利三元)
function renderLiunianShen(year) {
  if (!currentResult) return;
  const birthZhi = currentResult.chart.pillars.year.zhi;
  const yZhi = yearGanZhi(year).slice(1); // chi năm
  const r = liunian12Shen(birthZhi, yZhi);
  const cls = (t) => t === 'cat' ? 'rate-cat' : 'rate-hung';
  const mine = r.god;
  $('lns').innerHTML = `
    <div class="ts-head">Năm ${year} (<span class="zh">${yZhi}</span>) · tuổi bạn <b>${ZHI[birthZhi].con} (${birthZhi})</b> gặp <span class="ln-rate ${cls(mine.tone)}"><b>${mine.zh} ${mine.vi}</b></span></div>
    <p class="ly-snote" style="margin:8px 0">${mine.meaning}</p>
    ${mine.tone === 'hung' ? `<div class="tiaohou-note"><b>Hoá giải:</b> ${mine.remedy}</div>` : `<div class="tiaohou-note" style="border-color:#2e9e5b;background:rgba(46,158,91,0.08)"><b>Tận dụng:</b> ${mine.remedy}</div>`}
    <h4 class="syn-h4" style="margin-top:12px">12 thần theo chi tuổi (李淳风四利三元)</h4>
    <div class="lm-grid">${r.allGods.map((g) => `<div class="lm-cell ${g.isMine ? 'me' : ''}"><div class="lm-m">${ZHI[g.atZhi]?.con || g.atZhi}</div><div class="zh">${g.zh}</div><div class="ln-rate ${cls(g.tone)}" style="font-size:10px">${g.tone === 'cat' ? 'cát' : 'hung'}</div></div>`).join('')}</div>
    <p class="hint">${r.note}</p>`;
}
// Can chi năm (công thức chu kỳ, không cần thư viện; hợp lệ cho cả năm立春)
const GAN_ORDER = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
function yearGanZhi(year) {
  const g = GAN_ORDER[((year - 4) % 10 + 10) % 10];
  const z = ZHI_ORDER[((year - 4) % 12 + 12) % 12];
  return g + z; // chuỗi "丙午" (renderLiunianShen .slice; renderTaisui dùng [0]/[1])
}

// ---------------------------------------------------------------- HỌC TÊN 姓名学
function renderName() {
  const raw = $('nm-input').value.trim();
  if (!raw) return;
  const chars = [...raw]; // tách theo ký tự (hỗ trợ BMP)
  // parse override "阮=12,文=4"
  const ov = {};
  for (const part of ($('nm-strokes').value || '').split(',')) {
    const m = part.trim().match(/^(.+?)\s*=\s*(\d+)$/);
    if (m) ov[m[1]] = parseInt(m[2], 10);
  }
  const yong = currentResult ? currentResult.yong : null;
  const r = analyzeName(chars, ov, yong);
  if (r.needStrokes) { $('nameout').innerHTML = `<p class="hint">⚠ ${r.hint} — ví dụ bảng đã có họ Nguyễn (阮=12), Trần (陳=16)… Hãy tra 康熙字典 nét rồi nhập vào ô "Ghi đè nét".</p>`; return; }
  const wxVi2 = (w) => ({ 木: 'Mộc', 火: 'Hỏa', 土: 'Thổ', 金: 'Kim', 水: 'Thủy' }[w] || w);
  const cls = (lv) => lv === 'Đại cát' || lv === 'Cát' ? 'rate-cat' : lv === 'Bình' ? 'rate-mid' : 'rate-hung';
  $('nameout').innerHTML = `
    <div class="nm-name"><span class="zh big">${raw}</span> · nét ${r.strokes.join(' + ')} = ${r.strokes.reduce((a,b)=>a+b,0)}</div>
    <div class="nm-grids">${r.grids.map((g) => `
      <div class="nm-grid ${g.key === 'ren' ? 'ren' : ''}">
        <div class="nm-gnum">${g.n}</div>
        <div class="nm-glabel">${g.vi}</div>
        <div class="nm-gwx">${wxVi2(g.wx)}</div>
        <div class="ln-rate ${cls(g.luck.lv)}">${g.luck.lv}</div>
      </div>`).join('')}</div>
    <div class="nm-sancai">三才 Thiên-Nhân-Địa: <b>${wxVi2(r.sancai.tian)} → ${wxVi2(r.sancai.ren)} → ${wxVi2(r.sancai.di)}</b> · <span class="ln-rate ${cls(r.sancaiLuck)}">${r.sancaiLuck}</span> · Tổng điểm tên: <b>${r.score}/100</b></div>
    ${r.vsYong ? `<div class="tiaohou-note"><b>Tên vs Dụng Thần lá số:</b> ${r.vsYong.msg}</div>` : ''}
    <p class="hint">Lưu ý: 五格 chỉ là 1 thành phần tên học — cần kết hợp 八字 Dụng Thần, 字 nghĩa, âm vận. Két quả tham khảo văn hoá.</p>`;
}

// ---------------------------------------------------------------- 盲派
function renderMangpai(R) {
  const m = analyzeMangpai(R);
  const cls = m.score >= 62 ? 'rate-cat' : m.score >= 45 ? 'rate-mid' : 'rate-bad';
  $('mangpai').innerHTML = `
    <div class="mp-head">做功 định tầng: <b>${m.level}</b> · ${m.fuguui} · <span class="ln-rate ${cls}">${m.score}/100</span></div>
    <ul class="zr-reasons">${m.notes.map((n) => `<li>${n}</li>`).join('')}</ul>`;
}

// ---------------------------------------------------------------- 玄空飞星
function renderXuankong(year) {
  const x = xuankongPan(year);
  const cls = (p) => (p.quality.includes('vượng') || p.quality.includes('sinh khí')) ? 'cat' : (p.info.base === 'đại hung' || p.quality.includes('đại hung')) ? 'xiong' : (p.info.base === 'hung') ? 'xiong' : 'mid';
  $('xuankong').innerHTML = `
    <div class="xk-head">${x.yuan} <b>${x.yun}运</b> (${x.range}) · 当令 <b>${x.currentStar.han} ${x.currentStar.name}</b> (${x.currentStar.wx})</div>
    <div class="xk-grid">${x.pan.map((p) => `
      <div class="xk-cell ${cls(p)}"><div class="xk-palace">${p.palace}</div><div class="xk-star">${p.star}</div><div class="xk-name">${p.info.name}</div><div class="xk-q">${p.quality}</div></div>
    `).join('')}</div>
    <ul class="zr-reasons">${x.advice.map((a) => `<li>${a}</li>`).join('')}</ul>`;
}

// ---------------------------------------------------------------- MAI HOA DỊCH SỐ
function renderMeihua(g) {
  const tri = (t) => `${TRIGRAMS[t.tri].img} <b>${t.tri}</b> ${t.tri in {乾:'Càn',兑:'Đoài',离:'Ly',震:'Chấn',巽:'Tốn',坎:'Khảm',艮:'Cấn',坤:'Khôn'} ? TRIGRAMS[t.tri].vi : ''} (${t.wx} · ${TRIGRAMS[t.tri].ele})`;
  const luckCls = (l) => l === '大吉' || l === '吉' ? 'rate-cat' : l === '大凶' || l === '不吉' ? 'rate-hung' : 'rate-mid';
  $('meihua').innerHTML = `
    <div class="mh-ben">本卦 <span class="zh big">${g.name}</span> <span class="hint-inline">(上${g.upper} ☐ 下${g.lower}) · động hào ${g.dong} (${g.dongInUpper ? 'thượng' : 'hạ'})</span></div>
    <div class="mh-tiyong"><div class="mh-ti"><b>体</b> (mình): ${tri(g.ti)}</div><div class="mh-yong"><b>用</b> (việc/sự): ${tri(g.yong)}</div></div>
    <div class="mh-rel">Quan hệ: <b>${g.rel.k}</b> → <span class="ln-rate ${luckCls(g.rel.luck)}">${g.rel.luck}</span>. ${g.rel.vi}</div>
    <div class="mh-hubi">互卦 <b>${g.hu.name}</b> (quá trình · ${g.huRel.k}) · 变卦 <b>${g.bian.name}</b> (kết quả · ${g.bianRel.k})</div>
    <div class="zr-advice">→ ${g.verdict}</div>`;
}
function runMeihuaTime() {
  const v = $('mh-date').value; if (!v) return;
  const [y, m, d] = v.split('-').map(Number);
  const [hh, mm] = ($('mh-time').value || '12:00').split(':').map(Number);
  const nums = solarToMhNums(y, m, d, hh, mm);
  renderMeihua(castByTime(nums));
}
function runMeihuaNum() {
  const parts = ($('mh-nums').value || '').split(/[,\s]+/).map((x) => parseInt(x, 10)).filter((x) => !isNaN(x));
  if (parts.length < 2) { $('meihua').innerHTML = '<p class="hint">Nhập 2 số cách nhau bởi dấu phẩy, vd 3,8</p>'; return; }
  renderMeihua(castByNumbers(parts[0], parts[1]));
}

// ---------------------------------------------------------------- LỤC DIỆU 六爻
function runLiuyao() {
  const vals = ($('ly-vals').value || '').split(/[,\s]+/).map((x) => parseInt(x, 10)).filter((x) => [6, 7, 8, 9].includes(x));
  if (vals.length !== 6) { $('liuyao').innerHTML = '<p class="hint">Nhập đúng 6 giá trị (mỗi cái 6/7/8/9), dưới lên trên. Vd: 7,7,8,9,7,8</p>'; return; }
  const cat = $('ly-cat').value;
  // 月建/日辰 từ ngày gieo
  let mZhi = '子', dZhi = '子';
  const dv = $('ly-date').value;
  if (dv) {
    const [y, mo, d] = dv.split('-').map(Number);
    try {
      const l = Solar.fromYmdHms(y, mo, d, 12, 0, 0).getLunar();
      mZhi = l.getMonthZhi(); dZhi = l.getDayZhi();
    } catch (e) {}
  }
  const r = castLiuYao(vals, cat, mZhi, dZhi);
  const LQ = { 父母: 'Phụ Mẫu', 兄弟: 'Huynh Đệ', 子孙: 'Tử Tôn', 妻财: 'Thê Tài', 官鬼: 'Quan Quỷ' };
  const luckCls = (l) => l === 'Cát' ? 'rate-cat' : l === 'Hung' ? 'rate-hung' : 'rate-mid';
  $('liuyao').innerHTML = `
    <div class="ly-head">本卦 <span class="zh big">${r.name}</span> (宫 ${r.palace}/${r.gongWx}) · 世 ${r.shi} 应 ${r.ying} · ${r.shiChish} · ${r.dongCount ? `动 ${r.dongCount} → 变 ${r.bianName}` : '静卦'}</div>
    <div class="ly-lines">${r.lines.slice().reverse().map((l) => `
      <div class="ly-line ${l.yang ? 'yang' : 'yin'} ${l.isShi ? 'shi' : ''} ${l.isYing ? 'ying' : ''}">
        <span class="ly-pos">${l.pos}</span><span class="ly-gz zh">${l.gan}${l.zhi}</span><span class="ly-lq">${LQ[l.liuqin] || l.liuqin}</span>
        <span class="ly-mark">${l.isShi ? '世' : ''}${l.isYing ? '应' : ''}${l.dong ? ' ◉' : ''}</span>
        <span class="ly-hao">${l.yang ? '——' : '— —'}</span>
      </div>`).join('')}</div>
    <div class="ly-ys">用神: <b>${r.yongshen.vi}</b> → hào ${r.yongLines.length ? r.yongLines.map((l) => l.pos + '.' + l.gan + l.zhi).join(', ') : '(không có trong quẻ)'} · 月建${r.monthZhi} 日辰${r.dayZhi}</div>
    <div class="zr-advice">→ <span class="ln-rate ${luckCls(r.luck)}">${r.luck}</span> ${r.verdict}</div>`;
}

// ---------------------------------------------------------------- 改命 TỔNG KẾ
// ---------------------------------------------------------------- KỲ MÔN ĐỘN GIÁP
function runQimen() {
  const dv = $('qm-dt').value;
  let y, mo, d, h = 12;
  if (dv) { const [d1, t1] = dv.split('T'); [y, mo, d] = d1.split('-').map(Number); if (t1) h = parseInt(t1.slice(0, 2), 10) || 12; }
  else { const n = new Date(); y = n.getFullYear(); mo = n.getMonth() + 1; d = n.getDate(); h = n.getHours(); }
  const r = qimenDongPan(y, mo, d, h);
  const d2 = r.dong;
  const gongName = (g) => r.pan.find((p) => p.gong === g)?.dir.split(' ')[0] || g;
  $('qimen').innerHTML = `
    <div class="qm-head">Tiết <b>${r.term}</b> · ${r.yuan} → <b>${r.yinYang}遁 ${r.ju}局</b> <span class="hint-inline">(戊起 cung ${r.ju})</span></div>
    <div class="qm-dong">
      <span>时柱 <b>${d2.hourGanZhi}</b></span>
      <span>旬首 ${d2.xunName}→${d2.xunYi}@cung${d2.xunGong}</span>
      <span>值符星 <b>${d2.zhiFuStar}</b> <span class="hint-inline">${d2.zhiFuStarVi}</span></span>
      <span>值使门 <b>${d2.zhiShiDoor}</b></span>
      <span>值符随时干 → 落 cung ${d2.zhiFuLanding} (${gongName(d2.zhiFuLanding)})</span>
      <span>值使随时支 → 落 cung ${d2.zhiShiLanding}</span>
    </div>
    <div class="qm-grid">${r.pan.map((p) => `
      <div class="qm-cell ${p.isCat ? 'cat' : ''} ${p.gong === d2.zhiFuLanding ? 'zhifu' : ''} ${p.gong === 5 ? 'mid' : ''}">
        <div class="qm-dir">${p.gong}. ${p.dir.split(' ')[0]}</div>
        <div class="qm-qiyi zh">${p.qiyi}</div>
        <div class="qm-star">${p.star}</div>
        <div class="qm-door ${JI_DOOR_SET.has(p.door) ? 'ji' : ''}">${p.door}门</div>
        ${p.isCat ? '<div class="qm-cat">★吉格</div>' : ''}
        ${p.gong === d2.zhiFuLanding ? '<div class="qm-cat">值符</div>' : ''}
      </div>`).join('')}</div>
    <div class="zr-advice">${r.advice}</div>
    <p class="hint">动盘: 值符随时干/值使随时支/八神直符随值符星 — 9 cung hiển thị = 静盘(地盘三奇六仪+九星本位+八门定宫). ${r.note}</p>`;
}
const JI_DOOR_SET = new Set(['开', '休', '生']);

// ---------------------------------------------------------------- 改命 TỔNG KẾ
function renderGaimenh(R) {
  const g = gaimenhPlan(R, { year: new Date().getFullYear() });
  const tone = (p) => p.sev === 'cao' ? 'rate-hung' : p.sev === 'trung' ? 'rate-bad' : 'rate-mid';
  $('gaimenh').innerHTML = `
    <div class="gm-verdict">${g.verdict}</div>
    <h4 class="syn-h4">🎯 Chẩn đoán bệnh ưu tiên</h4>
    <div class="gm-diag">${g.diagnosis.map((p) => `<div class="gm-p"><span class="ln-rate ${tone(p)}">${p.sev}</span> <b>${p.t}</b> — ${p.d}</div>`).join('')}</div>
    <h4 class="syn-h4">📋 Kế hoạch 6 tầng (áp theo thứ tự)</h4>
    <div class="gm-layers">${g.layers.map((l) => `
      <div class="gm-layer"><div class="gm-lname">${l.name}</div><ul>${l.acts.map((a) => `<li>${a}</li>`).join('')}</ul></div>
    `).join('')}</div>
    <div class="remedy-core">“Số không bất biến” — 5 tầng đầu là <b>thuận vận</b> (giảm xấu/đón tốt); tầng 6 <b>Tích Âm Đức</b> mới thật <b>nghịch thiên</b> đổi số cốt lõi (了凡四训).</div>`;
}

// ---------------------------------------------------------------- 韋千里 BÁT BỘ PHÁN ĐOÁN
function renderQianli(R) {
  const q = qianliEightSteps(R);
  const soulCls = q.soul.includes('Thượng') ? 'rate-cat' : q.soul.includes('Trung') ? 'rate-mid' : 'rate-hung';
  $('qianli').innerHTML = `
    <div class="ql-quote">${QIANLI_QUOTE}</div>
    <div class="ql-soul">Dụng Thần (linh hồn mệnh): <span class="ln-rate ${soulCls}">${q.soul}</span></div>
    <div class="ql-steps">${q.steps.map((s) => `
      <div class="ql-step"><div class="ql-n">${s.n}</div><div><div class="ql-sname">${s.name}</div><div class="ql-stext">${s.text}</div></div></div>`).join('')}</div>
    <p class="ql-source"><i>Nguồn: ${q.source} · <a href="https://www.quanxue.cn/qt_mingxiang/qianlimg/qianlimg19.html" target="_blank" rel="noopener">quanxue.cn 千里命稿·评断篇</a></i></p>`;
}

// ---------------------------------------------------------------- LUẬN VẬN NĂM (đa trường phái)
function renderLyear(year) {
  if (!currentResult) return;
  const r = analyzeLiunianDeep(currentResult, year);
  const GOD_VI = { 比肩: 'Tỷ Kiên', 劫財: 'Kiếp Tài', 食神: 'Thực Thần', 傷官: 'Thương Quan', 偏財: 'Thiên Tài', 正財: 'Chính Tài', 七殺: 'Thất Sát', 正官: 'Chính Quan', 偏印: 'Thiên Ấn', 正印: 'Chính Ấn' };
  const cls = r.score >= 62 ? 'rate-cat' : r.score >= 46 ? 'rate-mid' : r.score >= 32 ? 'rate-bad' : 'rate-hung';
  const dHanzi = (n) => (n > 0 ? `+${n}` : `${n}`);
  $('lyear').innerHTML = `
    <div class="ly-head"><span class="zh big">${r.ganZhi}</span> ${year} · can <b>${GOD_VI[r.ganGod] || r.ganGod}</b>
      → <span class="ln-rate ${cls}">${r.rating} (${r.score}/100)</span></div>
    <div class="ly-schools">${r.schools.map((s) => `
      <div class="ly-school ${s.d >= 0 ? 'pos' : 'neg'}">
        <div class="ly-sname">${s.phai} <span class="ly-d">${dHanzi(s.d)}</span></div>
        <div class="ly-snote">${s.note}</div>
      </div>`).join('')}</div>
    <p class="zr-advice">${r.advice}</p>`;
}

// ---------------------------------------------------------------- CÔNG CỤ PHONG THỦY
function runZheri() {
  const v = $('zr-date').value; if (!v) return;
  const [y, m, d] = v.split('-').map(Number);
  const act = $('zr-act').value;
  const userZhi = currentResult ? currentResult.chart.pillars.year.zhi : null;
  const ev = evaluateDate(y, m, d, act, userZhi);
  const toneCls = ev.tone === 'cát' ? 'rate-cat' : ev.tone === 'hung' ? 'rate-hung' : 'rate-mid';
  $('zr-out').innerHTML = `
    <div class="zr-head"><b>${ev.solar}</b> (Âm lịch ${ev.lunar}) · <span class="zh">${ev.dayGanZhi}</span> · trực <b>${ev.officerVi} (${ev.officer})</b> <span class="ln-rate ${toneCls}">${ev.tone === 'cát' ? '黄道' : ev.tone === 'hung' ? '黑道' : 'bình'}</span></div>
    <div class="zr-score">Đánh giá cho «${ev.activity}»: <span class="ln-rate ${ev.score >= 65 ? 'rate-cat' : ev.score >= 45 ? 'rate-mid' : 'rate-hung'}">${ev.rating} (${ev.score}/100)</span>${ev.clashYou ? ' · ⚠ XUNG tuổi bạn' : ''}</div>
    <ul class="zr-reasons">${ev.reasons.map((r) => `<li>${r}</li>`).join('')}</ul>
    <p class="zr-advice">${ev.advice}</p>`;
}
function runZheriFind() {
  const v = $('zr-date').value; if (!v) return;
  const [y, m, d] = v.split('-').map(Number);
  const act = $('zr-act').value;
  const userZhi = currentResult ? currentResult.chart.pillars.year.zhi : null;
  const list = findGoodDates(y, m, d, 30, act, userZhi, 6);
  $('zr-out').innerHTML = `<p class="hint">Top ${list.length} ngày tốt nhất cho «${ACTIVITY[act].label}» trong 30 ngày tới${userZhi ? ' (loại trừ xung tuổi)' : ''}:</p>
    <div class="zr-list">${list.map((g) => `<div class="zr-item"><b>${g.solar}</b> <span class="zh">${g.dayGanZhi}</span> trực ${g.officerVi} <span class="ln-rate ${g.score >= 65 ? 'rate-cat' : 'rate-mid'}">${g.rating} ${g.score}</span></div>`).join('')}</div>`;
}
function runHehun() {
  const ad = $('hh-a-date').value, bd = $('hh-b-date').value;
  if (!ad || !bd) return;
  const [ay, am, ady] = ad.split('-').map(Number);
  const [by, bm, bdy] = bd.split('-').map(Number);
  const [ah, ami] = ($('hh-a-time').value || '12:00').split(':').map(Number);
  const [bh, bmi] = ($('hh-b-time').value || '12:00').split(':').map(Number);
  const ag = document.querySelector('input[name="hh-a-g"]:checked').value;
  const bg = document.querySelector('input[name="hh-b-g"]:checked').value;
  const R1 = analyze(ay, am, ady, ah, ami, ag);
  const R2 = analyze(by, bm, bdy, bh, bmi, bg);
  const h = computeHehun(R1, R2);
  const cls = h.score >= 62 ? 'rate-cat' : h.score >= 45 ? 'rate-mid' : 'rate-hung';
  $('hh-out').innerHTML = `
    <div class="hh-head">A ${R1.chart.dayMaster.vi} (${R1.chart.pillars.year.gan}${R1.chart.pillars.year.zhi}) × B ${R2.chart.dayMaster.vi} (${R2.chart.pillars.year.gan}${R2.chart.pillars.year.zhi})
    → <span class="ln-rate ${cls}">${h.rating} (${h.score}/100)</span></div>
    <ul class="zr-reasons">${h.factors.map((f) => `<li>${f}</li>`).join('')}</ul>
    <p class="zr-advice">${h.verdict}</p>`;
}
function runZhai() {
  const yr = parseInt($('zh-year').value, 10);
  const g = document.querySelector('input[name="zh-g"]:checked').value;
  const z = computeZhai(yr, g);
  $('zh-out').innerHTML = `
    <div class="zh-head">Mệnh quái: <b>${z.guaName}</b> · <span class="ln-rate rate-mid">${z.grpVi}</span></div>
    <div class="zh-grid">
      <div class="zh-col cat"><b>4 hướng CÁT (应 đặt cửa/giường/bàn)</b>${Object.entries(z.auspicious).map(([k, v]) => `<div><span class="zh-dir">${v}</span> — ${k}</div>`).join('')}</div>
      <div class="zh-col hung"><b>4 hướng HUNG (应 đặt bếp/toilet)</b>${Object.entries(z.inauspicious).map(([k, v]) => `<div><span class="zh-dir">${v}</span> — ${k}</div>`).join('')}</div>
    </div>
    <ul class="zr-reasons">${z.advice.map((a) => `<li>${a}</li>`).join('')}</ul>`;
}

// ---- wiring ----
$('zr-btn').addEventListener('click', runZheri);
$('zr-find').addEventListener('click', runZheriFind);
$('hh-btn').addEventListener('click', runHehun);
$('zh-btn').addEventListener('click', runZhai);
$('ts2-btn').addEventListener('click', runTongsheng);

// ---------------------------------------------------------------- HOÀNG LỊCH 每日宜忌
function runTongsheng() {
  const v = $('ts-date').value; if (!v) return;
  const [y, m, d] = v.split('-').map(Number);
  const userZhi = currentResult ? currentResult.chart.pillars.year.zhi : null;
  const r = tongshengDay(y, m, d, userZhi);
  const xu = xiuDay(y, m, d);
  const roadCls = r.bigBad ? 'rate-hung' : (r.road === 'yellow' ? 'rate-cat' : 'rate-bad');
  const roadVi = r.bigBad ? 'ĐẠI HUNG' : (r.road === 'yellow' ? 'Hoàng đạo (cát)' : 'Hắc đạo');
  const xiuCls = xu.tone === 'cat' ? 'rate-cat' : xu.tone === 'hung' ? 'rate-hung' : 'rate-mid';
  $('ts2-out').innerHTML = `
    <div class="zr-head"><b>${r.solar}</b> (ÂL ${r.lunar}) · <span class="zh">${r.dayGanZhi}</span> · trực <b>${r.officerVi} (${r.officer})</b> <span class="ln-rate ${roadCls}">${roadVi}</span></div>
    <div class="zr-head" style="font-size:13px">二十八宿: <b class="zh">${xu.xiu}</b> (${xu.vi}) · ${xu.beast} · chính ${xu.zheng} ${xu.animal} <span class="ln-rate ${xiuCls}">${xu.tone === 'cat' ? 'cát túc' : xu.tone === 'hung' ? 'hung túc' : 'trung'}</span></div>
    ${r.bigBad ? `<div class="zr-advice" style="color:#ff9b89;background:rgba(224,83,61,0.12)">${r.advice}</div>` : ''}
    <div class="zr-head" style="font-size:12.5px;color:var(--muted)">${r.tianShen ? `天神: <b>${r.tianShen}</b> <span class="ln-rate ${r.tianShenRoad==='yellow'?'rate-cat':'rate-hung'}" style="font-size:10px">${r.tianShenRoad==='yellow'?'黄道':'黑道'}</span>` : ''} ${r.caiShenDir ? ` · 财神@<b>${r.caiShenDir}</b>` : ''} ${r.xiShenDir ? ` · 喜神@<b>${r.xiShenDir}</b>` : ''}</div>
    <h4 class="syn-h4" style="margin-top:10px">通胜 宜忌 (dữ liệu thật)</h4>
    <div class="hl-yiji"><div class="hl-yi"><b>宜 (nên làm):</b> ${(r.tsYi||r.yi).join(' · ')}</div><div class="hl-ji"><b>忌 (kiêng):</b> ${(r.tsJi||r.ji).join(' · ')}</div></div>
    ${r.bigBad ? '' : `<p class="zr-advice">${r.advice}</p>`}
    <details class="syn-factors"><summary>二十八宿 "${xu.xiu}宿" ca quyết</summary><p class="hint" style="white-space:pre-wrap">${xu.song}</p></details>`;
}
$('ly-btn').addEventListener('click', () => renderLyear(parseInt($('ly-year').value, 10) || new Date().getFullYear()));
$('lm-btn').addEventListener('click', () => renderLiuyue(parseInt($('lm-year').value, 10) || new Date().getFullYear()));
$('lr-btn').addEventListener('click', () => renderLiuRi($('lr-date').value));
$('lr-find').addEventListener('click', () => {
  if (!currentResult) return;
  const [y, m, d] = ($('lr-date').value || '').split('-').map(Number);
  const list = findGoodDaysRi(currentResult, y, m, d, 14, 6);
  $('liuri').innerHTML = `<p class="hint">Top ${list.length} ngày VẬN CÁ NHÂN tốt nhất trong 14 ngày tới:</p>
    <div class="zr-list">${list.map((g) => `<div class="zr-item"><b>${g.solar}</b> <span class="zh">${g.ganZhi}</span> <span class="ln-rate ${g.score >= 64 ? 'rate-cat' : 'rate-mid'}">${g.rating} ${g.score}</span></div>`).join('')}</div>`;
});
$('ts-btn').addEventListener('click', () => renderTaisui(parseInt($('ts-year').value, 10) || new Date().getFullYear()));
$('lns-btn').addEventListener('click', () => renderLiunianShen(parseInt($('lns-year').value, 10) || new Date().getFullYear()));
$('nm-btn').addEventListener('click', renderName);
if($('nm-vi-btn')){$('nm-vi-btn').addEventListener('click', ()=>{ const vi=$('nm-vi').value.trim(); if(!vi) return; const r=viToHan(vi); if(r.ok){ $('nm-input').value=r.hanString; renderName(); } else { $('nm-input').value=r.hanString; $('nm-strokes').value=r.strokes.map((s,i)=>r.chars[i].han+'='+s).join(','); renderName(); } });}
$('xk-btn').addEventListener('click', () => renderXuankong(parseInt($('xk-year').value, 10) || new Date().getFullYear()));
$('mh-time-btn').addEventListener('click', runMeihuaTime);
$('mh-num-btn').addEventListener('click', runMeihuaNum);
$('ly-btn').addEventListener('click', runLiuyao);
$('qm-btn').addEventListener('click', runQimen);
(function () {
  const d = new Date(); $('ly-date').value = d.toISOString().slice(0, 10);
  const pad = (n) => String(n).padStart(2, '0');
  $('qm-dt').value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
})();
runQimen();
if($('ln-btn')){$('ln-btn').addEventListener('click',runLiuren); const _lp=n=>String(n).padStart(2,'0'); const _ln=new Date(); $('ln-dt').value=_ln.getFullYear()+'-'+_lp(_ln.getMonth()+1)+'-'+_lp(_ln.getDate())+'T'+_lp(_ln.getHours())+':00'; runLiuren();}
// Mai Hoa: tự gieo cho hôm nay khi load
function initMeihua() {
  const now = new Date();
  const iso = now.toISOString().slice(0, 10);
  $('mh-date').value = iso;
  runMeihuaTime();
}
initMeihua();
$('birth-form').addEventListener('submit', (e) => { e.preventDefault(); run(); });
$('ask-btn').addEventListener('click', handleAsk);
$('question').addEventListener('keydown', (e) => { if (e.key === 'Enter') handleAsk(); });
$('ai-settings-btn').addEventListener('click', openModal);
$('cfg-cancel').addEventListener('click', closeModal);
$('cfg-save').addEventListener('click', saveModal);
$('ai-modal').addEventListener('click', (e) => { if (e.target.id === 'ai-modal') closeModal(); });
// Test kết nối AI (dùng giá trị đang nhập trong modal, chưa cần Lưu)
$('cfg-test').addEventListener('click', async () => {
  const cfg = {
    enabled: $('cfg-enabled').checked,
    endpoint: $('cfg-endpoint').value.trim(),
    apiKey: $('cfg-apikey').value.trim(),
    model: $('cfg-model').value.trim(),
    preset: $('cfg-preset').value,
  };
  const el = $('cfg-test-result');
  el.style.color = 'var(--silk-muted,#948864)';
  el.textContent = '⏳ Đang thử kết nối...';
  try {
    const r = await testAIConnection(cfg);
    el.textContent = r.detail;
    el.style.color = r.ok ? '#2e9e5b' : '#e0533d';
  } catch (e) {
    el.textContent = '❌ Lỗi: ' + e.message;
    el.style.color = '#e0533d';
  }
});
// AI popup (chat widget nổi): mở/đóng
$('ai-fab').addEventListener('click', () => {
  $('ai-popup').classList.remove('hidden');
  $('ai-fab').classList.add('hidden');
  setTimeout(() => { const q = $('question'); if (q) q.focus(); }, 50);
  const cl = $('chat-log');
  if (cl && !cl.childElementCount) appendMsg('assistant', 'Xin chào! Tôi là trợ lý Bát Tự AI. Bạn đã lập lá số — hãy hỏi tôi bất cứ điều gì về vận mệnh, sự nghiệp, tình duyên, tài lộc, thời điểm cưới/con/mua nhà… (Bấm ⚙ để bật AI thật; chưa bật thì tôi dùng bộ luân giải cục bộ.)');
});
$('ai-popup-close').addEventListener('click', () => {
  $('ai-popup').classList.add('hidden');
  $('ai-fab').classList.remove('hidden');
});

$('calendar-note').textContent =
  'Lưu ý: trụ Tháng tính theo Tiết khí (24 tiết), trụ Giờ theo giờ Tý–Hợi. Giờ sinh càng chính xác, luận giải càng chuẩn.';

// Tự lập lá số mẫu khi mở app
run();

// ============================================================
// NGHIỆM CHỨNG GIA TỘC (家族八字交叉验证) — state + render an toàn XSS
// ============================================================
let familyMembers = []; // [{role,label,date,time,gender,hourUnknown}]
const ROLE_OPTS = [
  { v:'father', t:'Cha' }, { v:'mother', t:'Mẹ' }, { v:'sibling', t:'Anh/chị/em' },
  { v:'spouse', t:'Vợ/Chồng' }, { v:'child', t:'Con cái' },
];

function renderFamilyForm() {
  const rows = familyMembers.map((m, i) => {
    const opts = ROLE_OPTS.map((o) => `<option value="${o.v}" ${m.role===o.v?'selected':''}>${o.t}</option>`).join('');
    return [
      '<div class="fam-row">',
      `<select data-i="${i}" data-k="role">${opts}</select>`,
      `<input data-i="${i}" data-k="label" placeholder="Tên/ghi chú" value="${esc(m.label||'')}">`,
      `<input type="date" data-i="${i}" data-k="date" value="${esc(m.date||'')}">`,
      `<input type="time" data-i="${i}" data-k="time" value="${esc(m.time||'')}">`,
      `<label class="fam-g"><input type="radio" name="fam-g-${i}" value="nam" data-i="${i}" data-k="gender" ${m.gender==='nam'?'checked':''}> Nam</label>`,
      `<label class="fam-g"><input type="radio" name="fam-g-${i}" value="nu"  data-i="${i}" data-k="gender" ${m.gender!=='nam'?'checked':''}> Nữ</label>`,
      `<label class="fam-unk"><input type="checkbox" data-i="${i}" data-k="hourUnknown" ${m.hourUnknown?'checked':''}> giờ chưa rõ</label>`,
      `<button type="button" class="fam-del btn-ghost" data-i="${i}">✕</button>`,
      '</div>',
    ].join('');
  });
  const html = rows.length ? rows.join('') : '<p class="hint">Chưa có người thân. Bấm "+ Thêm người thân" rồi nhập ngày sinh.</p>';
  $('family-members').innerHTML = html;
}

function runFamily() {
  if (!currentResult) { $('family-score').textContent = 'Nhập ngày sinh người trung tâm (form chính) rồi luận giải trước.'; return; }
  const members = familyMembers.filter((m) => m.date).map((m) => {
    const [y, mo, d] = m.date.split('-').map(Number);
    const [h, mi] = (m.time || '12:00').split(':').map(Number);
    return { role: m.role, label: (m.label || ROLE_OPTS.find((o) => o.v === m.role).t),
      R: analyze(y, mo, d, h, mi, m.gender), hourUnknown: m.hourUnknown };
  });
  if (!members.length) { $('family-score').textContent = 'Thêm ít nhất 1 người thân có ngày sinh.'; return; }
  const fam = analyzeFamily({ R: currentResult, label: 'Chủ thể' }, members);
  renderFamilyScore(fam);
  renderFamilyConstellation(fam);
  renderFamilyLedger(fam);
  renderFamilyMatrix(fam);
  renderFamilyRadar(fam);
  rectifyFamily(fam, members);
}

function renderFamilyScore(fam) {
  const cls = fam.score >= 72 ? 'rate-cat' : fam.score >= 55 ? 'rate-mid' : 'rate-hung';
  const html = `<div class="fam-score-head"><span class="ln-rate ${cls}">${fam.score}/100</span> <b>${esc(fam.rating)}</b>`
    + ` · xác <b style="color:#2e9e5b">${fam.confirms}</b> / nghiệm <b style="color:#e0533d">${fam.conflicts}</b></div>`;
  $('family-score').innerHTML = html;
}

function renderFamilyLedger(fam) {
  const html = fam.ledger.map((l) => {
    const mark = l.ok ? '✓' : '⚠';
    const cls = l.ok ? 'ok' : 'bad';
    const msg = esc(l.msg.replace(/^[✓⚠✗●•]\s*/, ''));
    return `<div class="fam-ledger ${cls}">${mark} <b>[${esc(l.who)}]</b> ${msg}</div>`;
  }).join('');
  $('family-ledger').innerHTML = html;
}

function renderFamilyConstellation(fam) {
  const d = radialData(fam);
  const findNode = (id) => d.nodes.find((n) => n.id === id);
  const edgeTags = d.edges.map((e) => {
    const a = findNode(e.from), b = findNode(e.to);
    const color = e.tone === 'good' ? '#2e9e5b' : e.tone === 'mid' ? '#caa14a' : '#e0533d';
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${color}" stroke-width="${1 + e.score / 30}"/>`
      + `<text x="${mx}" y="${my - 4}" text-anchor="middle" class="svg-edge">${esc(e.label)}</text>`;
  });
  const nodeTags = d.nodes.map((n) => [
    `<circle cx="${n.x}" cy="${n.y}" r="${n.isCenter ? 22 : 16}" class="svg-node ${n.isCenter ? 'center' : ''}"/>`,
    `<text x="${n.x}" y="${n.y + 5}" text-anchor="middle" class="svg-dm">${esc(n.dm || '★')}</text>`,
    `<text x="${n.x}" y="${n.y + (n.isCenter ? 34 : 28)}" text-anchor="middle" class="svg-label">${esc(n.label)}</text>`,
    `<text x="${n.x}" y="${n.y + (n.isCenter ? 46 : 40)}" text-anchor="middle" class="svg-sub">${esc(n.roleVi || '')}</text>`,
  ].join(''));
  const svg = `<svg viewBox="0 0 300 300" class="fam-svg" role="img" aria-label="Sơ đồ chòm sao gia tộc">${edgeTags.join('')}${nodeTags.join('')}</svg>`
    + '<p class="hint">Nhánh xanh = khớp cao · vàng = vừa · đỏ = mâu thuẫn (nên đối chiếu giờ/dữ liệu).</p>';
  $('family-constellation').innerHTML = svg;
}

function renderFamilyMatrix(fam) {
  const d = matrixData(fam);
  const cls = (s) => s == null ? 'mid' : s >= 72 ? 'cat' : s >= 55 ? 'mid' : 'bad';
  const head = '<tr><th></th>' + d.labels.map((l) => `<th>${esc(l)}</th>`).join('') + '</tr>';
  const body = d.labels.map((lab, i) => {
    const tds = d.labels.map((_, j) => {
      const c = d.cells.find((x) => x.i === i && x.j === j);
      const val = c && c.score != null ? c.score : '—';
      return `<td class="${cls(c && c.score)}">${val}</td>`;
    }).join('');
    return `<tr><th>${esc(lab)}</th>${tds}</tr>`;
  }).join('');
  const html = `<table class="fam-matrix"><thead>${head}</thead><tbody>${body}</tbody></table>`;
  $('family-matrix').innerHTML = html;
}

function renderFamilyRadar(fam) {
  const cx = 120, cy = 120, R = 90, N = fam.radar.length;
  const pt = (val, k) => { const ang = -Math.PI / 2 + k * 2 * Math.PI / N, rr = R * val / 10;
    return [cx + rr * Math.cos(ang), cy + rr * Math.sin(ang)]; };
  const grid = [2, 4, 6, 8, 10].map((g) => {
    const poly = Array.from({ length: N }, (_, k) => pt(g, k).map((x) => +x.toFixed(1)).join(',')).join(' ');
    return `<polygon points="${poly}" fill="none" stroke="#444" stroke-width="0.5"/>`;
  }).join('');
  const axes = fam.radar.map((dd, k) => {
    const [x, y] = pt(10, k); const [lx, ly] = pt(11.5, k);
    return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#444" stroke-width="0.5"/>`
      + `<text x="${lx}" y="${ly}" text-anchor="middle" class="svg-sub">${esc(dd.axis)}</text>`;
  }).join('');
  const dataPoly = fam.radar.map((dd, k) => pt(dd.value, k).map((x) => +x.toFixed(1)).join(',')).join(' ');
  const dots = fam.radar.map((dd, k) => { const [x, y] = pt(dd.value, k); return `<circle cx="${x}" cy="${y}" r="2.5" fill="#e0533d"/>`; }).join('');
  const html = `<svg viewBox="0 0 240 240" class="fam-svg">${grid}${axes}<polygon points="${dataPoly}" fill="rgba(202,161,74,.3)" stroke="#caa14a" stroke-width="2"/>${dots}</svg>`;
  $('family-radar').innerHTML = html;
}

function rectifyFamily(fam, members) {
  const unk = members.filter((m) => m.hourUnknown);
  if (!unk.length) { $('family-rectify').innerHTML = ''; return; }
  const known = members.filter((m) => !m.hourUnknown).map((m) => ({ role: m.role, label: m.label, R: m.R }));
  const blocks = unk.map((m) => {
    const r = rectifyHour({ R: currentResult, label: 'Chủ thể' }, m, known);
    const rows = r.candidates.map((c) => `<tr><td>${esc(c.zhiVi)} (${c.hour}h)</td><td><b>${c.score}</b></td><td>${c.delta === 0 ? '★ tốt nhất' : c.delta}</td></tr>`).join('');
    return `<div class="fam-rectify"><b>⏰ Hiệu chỉnh giờ — ${esc(m.label)}</b>`
      + `<p class="hint">${esc(r.verdict)}</p>`
      + `<table class="fam-matrix"><thead><tr><th>Giờ</th><th>Điểm</th><th>Δ</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }).join('');
  const html = `<h4 class="syn-h4">Hiệu chỉnh giờ sinh (người đánh "giờ chưa rõ")</h4>${blocks}`;
  $('family-rectify').innerHTML = html;
}

// wiring gia tộc
$('fam-add').addEventListener('click', () => { familyMembers.push({ role:'father', label:'', date:'', time:'', gender:'nam', hourUnknown:false }); renderFamilyForm(); });
$('family-members').addEventListener('click', (e) => {
  if (e.target.classList.contains('fam-del')) { familyMembers.splice(+e.target.dataset.i, 1); renderFamilyForm(); }
});
$('family-members').addEventListener('change', (e) => {
  const t = e.target; if (t.dataset.i == null) return;
  const i = +t.dataset.i, k = t.dataset.k;
  familyMembers[i][k] = (k === 'hourUnknown') ? t.checked : t.value;
  if (k === 'role') renderFamilyForm();
});
$('family-btn').addEventListener('click', runFamily);
renderFamilyForm();

// ============================================================
// QUỸ TÍCH CUỘC ĐỜI (一生运程) — render timeline (an toàn XSS)
// ============================================================
function renderLifeTrajectory(R) {
  if (!R) return;
  const L = buildLifeTrajectory(R);
  const f = L.foundation;
  const tpHtml = L.turningPoints.map((t) => {
    const cls = t.kind === 'golden' ? 'rate-cat' : 'rate-hung';
    const mark = t.kind === 'golden' ? '🌟 Đỉnh vận' : '⚠ Dè chừng';
    return `<div class="life-tp ${cls}"><b>${mark} ${esc(t.ages)}</b> <span class="zh">${esc(t.ganZhi)}</span> — ${esc(t.reason)}</div>`;
  }).join('');
  const summaryHtml = `<div class="life-found">Nhật Chủ <b>${esc(f.dmVi)}</b> (${esc(f.dmWx)}) · ${esc(f.strength)} · Dụng <b>${esc(f.yong)}</b> (Hỷ ${esc(f.yongXi)}) · Cấp mệnh <b>${esc(f.grade || '—')}</b>${f.score != null ? ` (${f.score}/100)` : ''}</div>`
    + `<p class="life-summary-text">${esc(L.summary)}</p>`
    + (tpHtml ? `<div class="life-tps">${tpHtml}</div>` : '');
  $('life-summary').innerHTML = summaryHtml;

  const winLabels = { marriage: '💍 Hôn nhân', children: '👶 Con cái', career: '💼 Sự nghiệp', wealth: '💰 Tài lộc', health: '🏥 Sức khoẻ' };
  const winHtml = Object.entries(L.keyWindows).map(([k, list]) => {
    const items = list.length
      ? list.map((w) => `<span class="life-win-age">${esc(w.ages)} <span class="zh">${esc(w.ganZhi)}</span></span>`).join(' ')
      : '<span class="hint">(không rõ qua đại vận — xem chi tiết Lưu Niên)</span>';
    return `<div class="life-win"><div class="life-win-k">${winLabels[k]}</div><div class="life-win-v">${items}</div></div>`;
  }).join('');
  $('life-windows').innerHTML = winHtml;

  const decHtml = L.decades.map((d) => {
    const rcls = rateClass(d.rating);
    const flags = (d.golden ? '<span class="life-flag golden">🌟 Cát</span>' : '') + (d.caution ? '<span class="life-flag caution">⚠ Trở ngại</span>' : '');
    const head = `<div class="life-dec-head"><b>${esc(d.ages)}</b> <span class="zh big">${esc(d.ganZhi)}</span> <span class="ln-rate ${rcls}">${esc(d.rating)}</span> ${flags}</div>`;
    const theme = `<div class="life-dec-theme">${esc(d.themeName)} <span class="hint-inline">(can ${esc(d.ganGodVi)} · chi ${esc(d.zhiGodVi)})</span></div>`;
    const line = `<div class="life-dec-line">${esc(d.line)}</div>`;
    return `<div class="life-dec">${head}${theme}${line}</div>`;
  }).join('');
  $('life-decades').innerHTML = decHtml;

  const stgHtml = L.stages.map((s) => {
    const lab = s.score >= 62 ? 'Thuận' : s.score >= 42 ? 'Bình' : 'Bất lợi';
    const cls = s.score >= 62 ? 'rate-cat' : s.score >= 42 ? 'rate-mid' : 'rate-hung';
    return `<div class="life-stage"><div class="life-stage-h"><b>${esc(s.label)}</b> <span class="hint-inline">${esc(s.range)}</span> <span class="ln-rate ${cls}">${lab}</span></div><div class="life-stage-v">${esc(s.verdict)}</div></div>`;
  }).join('');
  $('life-stages').innerHTML = stgHtml;

  $('life-rectify-note').textContent = L.rectifyNote;
}

// ============================================================
// LƯU NHẬT CẢ NĂM (流日整年) — render + wiring
// ============================================================
function renderYearDaily(R, year) {
  if (!R) return;
  const Y = computeYearDaily(R, year);
  currentYearDaily = Y;

  const ctxLine = `Năm <b>${Y.year}</b> · Lưu năm <span class="zh">${Y.liunian.ganZhi}</span> · `
    + (Y.dayun ? `Đại vận hành <span class="zh">${Y.dayun.ganZhi}</span> [${Y.dayun.startAge}–${Y.dayun.startAge + 9}t, ${Y.dayun.rating}]` : '(ngoài phạm vi đại vận đã tính)');
  $('yd-context').innerHTML = `<div class="yd-context">${ctxLine}</div>`;

  const s = Y.stats;
  const statsHtml = `<div class="yd-stats">`
    + `<span class="yd-stat"><b>${s.total}</b> ngày</span>`
    + `<span class="yd-stat ln-rate rate-cat">Cát <b>${s.cat}</b></span>`
    + `<span class="yd-stat ln-rate rate-mid">Bình <b>${s.binh}</b></span>`
    + `<span class="yd-stat ln-rate rate-bad">Hơi kỵ <b>${s.hoiky}</b></span>`
    + `<span class="yd-stat ln-rate rate-hung">Kỵ <b>${s.ky}</b></span>`
    + `</div>`;
  $('yd-stats').innerHTML = statsHtml;

  const bestHtml = Y.best.map((d) => `<div class="yd-bw cat" data-date="${d.date}"><b>${esc(d.date)}</b> <span class="zh">${esc(d.ganZhi)}</span> <span class="ln-rate rate-cat">${d.score}</span></div>`).join('');
  const worstHtml = Y.worst.map((d) => `<div class="yd-bw bad" data-date="${d.date}"><b>${esc(d.date)}</b> <span class="zh">${esc(d.ganZhi)}</span> <span class="ln-rate rate-hung">${d.score}</span></div>`).join('');
  const bwHtml = `<div class="yd-bw-col"><div class="yd-bw-h">🏆 ${Y.best.length} ngày Cát nhất (nên làm việc lớn)</div>${bestHtml}</div>`
    + `<div class="yd-bw-col"><div class="yd-bw-h">⚠ ${Y.worst.length} ngày Kỵ nhất (giữ mình)</div>${worstHtml}</div>`;
  $('yd-bestworst').innerHTML = bwHtml;

  const monthsHtml = Y.monthSummary.map((ms) => {
    const daysInMonth = Y.days.filter((d) => d.month === ms.month);
    const chips = daysInMonth.map((d) => {
      const cls = YD_CHIP_CLS[d.rating] || 'binh';
      return `<button class="yd-chip ${cls}" data-date="${d.date}" title="${esc(d.ganZhi)} · ${d.rating} (${d.score})">${d.day}<span class="yd-gz zh">${esc(d.ganZhi)}</span></button>`;
    }).join('');
    const mcls = ms.avg >= 55 ? 'rate-cat' : ms.avg >= 45 ? 'rate-mid' : 'rate-hung';
    return `<div class="yd-month"><div class="yd-month-h">Tháng ${ms.month} <span class="ln-rate ${mcls}">TB ${ms.avg}</span> <span class="hint-inline">Cát ${ms.catCount} · Kỵ ${ms.kyCount}</span></div><div class="yd-chips">${chips}</div></div>`;
  }).join('');
  $('yd-months').innerHTML = monthsHtml;

  $('yd-day-detail').innerHTML = '<p class="hint">Bấm vào 1 ngày bất kỳ ở lịch trên để xem luận chi tiết.</p>';
}

function renderYearDayDetail(date) {
  if (!currentYearDaily) return;
  const d = currentYearDaily.days.find((x) => x.date === date);
  if (!d) return;
  const rcls = YD_RATE_CLS[d.rating] || 'rate-mid';
  const ctxHtml = d.ctx.length
    ? `<div class="yd-ctx">${d.ctx.map((c) => `<span class="yd-ctx-item">${esc(c)}</span>`).join('')}</div>`
    : '<p class="hint">(lưu nhật không hợp/xung lưu năm & đại vận — vận thuần theo nền mệnh + Thập thần ngày)</p>';
  const html = `<div class="yd-day">`
    + `<div class="yd-day-h"><b>${esc(d.date)}</b> <span class="zh big">${esc(d.ganZhi)}</span> can <b>${esc(d.ganGod)}</b> <span class="ln-rate ${rcls}">${esc(d.rating)} (${d.score}/100)</span></div>`
    + `<p class="yd-day-note">${esc(d.baseNote)}</p>`
    + `<div class="yd-ctx-h">Tương tác lưu năm / đại vận (引动):</div>${ctxHtml}`
    + `</div>`;
  $('yd-day-detail').innerHTML = html;
}

// wiring năm
$('yd-btn').addEventListener('click', () => {
  if (!currentResult) { $('yd-context').textContent = 'Nhập ngày sinh người trung tâm rồi luận giải trước.'; return; }
  const yr = parseInt($('yd-year').value, 10) || new Date().getFullYear();
  renderYearDaily(currentResult, yr);
});
$('yd-months').addEventListener('click', (e) => {
  const t = e.target.closest('.yd-chip'); if (!t) return;
  renderYearDayDetail(t.dataset.date);
});
$('yd-bestworst').addEventListener('click', (e) => {
  const t = e.target.closest('.yd-bw'); if (!t) return;
  renderYearDayDetail(t.dataset.date);
});

// ============================================================
// ANIMATION LAYER (taste-skill) — cô lập, KHÔNG sửa logic có sẵn.
//  - Phát lại entrance so le (stagger) mỗi lần bấm "Luận giải".
//  - Bar Ngũ Hành fill 0 → giá trị.
//  - Tự tắt khi prefers-reduced-motion.
// Chỉ quan sát #verdict (luôn được renderVerdict populate mỗi run) →
// fires đúng 1 lần/luận giải, không chạm tới logic engine hay render.
// ============================================================
(() => {
  const result = document.getElementById('result');
  if (!result || typeof MutationObserver === 'undefined') return;
  const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const reduceMotion = !!(mq && mq.matches);

  // pop-in so le: gán --n = chỉ số trong nhóm cho các ô con (CSS dùng làm delay)
  const ITEMS = '.v-box,.dy,.ln,.ss,.lq,.tier,.lm-cell,.combo,.law,.ql-step,.ix-group,.zr-item,.zh-col,.ly-school,.zw-cell,.factor,.sp-item';
  const indexItems = () => {
    result.querySelectorAll(ITEMS).forEach((el) => {
      el.style.setProperty('--n', Array.prototype.indexOf.call(el.parentNode.children, el));
    });
  };
  // đếm lên cho số % ngũ hành (giá trị cuối phục hồi chính xác)
  const countUp = (el) => {
    const orig = el.textContent;
    const m = orig.match(/(-?\d+(?:\.\d+)?)/);
    if (!m) return;
    const target = parseFloat(m[1]);
    if (!target) return;
    const suffix = orig.slice(m.index + m[0].length);
    const prefix = orig.slice(0, m.index);
    const t0 = performance.now(); const DUR = 850;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / DUR);
      if (k >= 1) { el.textContent = orig; return; }
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = prefix + Math.round(target * e) + suffix;
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const triggerReveal = () => {
    result.classList.remove('reveal-run');
    void result.offsetWidth;            // ép reflow → phát lại keyframe
    result.classList.add('reveal-run');
    indexItems();                       // gán chỉ số cho stagger
    if (reduceMotion) return;
    // Bar Ngũ Hành: reset 0% rồi trả về giá trị thật → width transition chạy
    result.querySelectorAll('.wx-fill').forEach((bar) => {
      const target = bar.style.width;
      if (!target) return;
      bar.style.width = '0%';
      void bar.offsetWidth;             // reflow
      bar.style.width = target;         // transition .9s var(--ease-out)
    });
    result.querySelectorAll('.wx-pct').forEach(countUp);
  };

  // Lần đầu (run() đã chạy sẵn khi tải trang)
  if (!result.classList.contains('hidden')) triggerReveal();

  // Các lần "Luận giải" sau — innerHTML #verdict luôn được thay thế → childList fire
  const verdict = document.getElementById('verdict');
  if (verdict) {
    new MutationObserver(() => {
      if (!result.classList.contains('hidden')) triggerReveal();
    }).observe(verdict, { childList: true, subtree: true });
  }
})();

// ============================================================
// MOTE FIELD (玄) — hạt vàng trôi + lấp lánh. Cô lập, reduced-motion safe.
// ============================================================
(() => {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('mote-field');
  if (!canvas || reduce || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, motes = [], raf = 0;
  const COLORS = ['243,213,122', '212,175,55', '247,236,203', '192,57,43'];
  const resize = () => { w = canvas.width = innerWidth; h = canvas.height = innerHeight; };
  const makeMotes = () => {
    const n = Math.min(70, Math.round(innerWidth / 22));
    motes = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.7 + 0.4,
      vy: -(Math.random() * 0.32 + 0.08), vx: (Math.random() - 0.5) * 0.18,
      a: Math.random() * 6.283, tw: Math.random() * 0.025 + 0.004,
      c: COLORS[(Math.random() * COLORS.length) | 0],
    }));
  };
  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    for (const m of motes) {
      m.y += m.vy; m.x += m.vx; m.a += m.tw;
      if (m.y < -10) { m.y = h + 10; m.x = Math.random() * w; }
      if (m.x < -10) m.x = w + 10; else if (m.x > w + 10) m.x = -10;
      const alpha = (Math.sin(m.a) * 0.4 + 0.5) * 0.7;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, 6.283);
      ctx.fillStyle = 'rgba(' + m.c + ',' + alpha.toFixed(3) + ')';
      ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(' + m.c + ',0.8)';
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    raf = requestAnimationFrame(tick);
  };
  resize(); makeMotes(); tick();
  addEventListener('resize', () => { resize(); makeMotes(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(tick);
  });
})();

// ---------------------------------------------------------------- ĐẠI LỤC NHÂM
function runLiuren() {
  const dv = $('ln-dt').value;
  let y, mo, d, h = 12;
  if (dv) { const [d1, t1] = dv.split('T'); [y, mo, d] = d1.split('-').map(Number); if (t1) h = parseInt(t1.slice(0, 2), 10) || 12; }
  else { const n = new Date(); y = n.getFullYear(); mo = n.getMonth() + 1; d = n.getDate(); h = n.getHours(); }
  const r = liurenPan(y, mo, d, h);
  const k4 = r.ke4.map((k) => `<div class="lr-ke"><div class="zh lr-up">${k.up}</div><div class="zh lr-down">${k.down}</div><div class="lr-kn">${k.n} <span class="hint-inline">${k.rel}</span></div></div>`).join('');
  const sc = r.sanchuan.map((s2) => `<div class="lr-ke"><div class="zh lr-up">${s2.zhi}</div><div class="lr-kn">${s2.n}</div></div>`).join('');
  const tj = Object.entries(r.tjAt).map(([z, t]) => `<span class="lr-tj ${['贵人','六合','青龙','太常','太阴','天后'].includes(t) ? 'cat' : (['螣蛇','朱雀','勾陈','白虎','玄武'].includes(t) ? 'hung' : '')}">${z}${t}</span>`).join(' ');
  const html = '<div class="lr-head">日 <b>' + r.dayGanZhi + '</b> · 时 ' + r.hourZhi + ' (' + (r.isDay ? '昼' : '夜') + ') · 月将 <b>' + r.yuejiang + '</b>(' + r.yuejiangVi + ') · 贵人 ' + r.gui + ' (' + r.zongMen + ')</div><div class="lr-row"><span class="lr-sec">四课</span><div class="lr-kes">' + k4 + '</div></div><div class="lr-row"><span class="lr-sec">三传</span><div class="lr-kes">' + sc + '</div></div><div class="lr-row"><span class="lr-sec">初传 ' + r.sanchuan[0].zhi + ' 天将</span><b class="zh">' + r.chuan1TianJiang + '</b></div><div class="lr-row"><span class="lr-sec">十二天将</span><div class="lr-tjs">' + tj + '</div></div><div class="zr-advice">' + r.verdict + '</div><p class="hint">' + r.note + '</p>';
  $('liuren').innerHTML = html;
}

// ---------------------------------------------------------------- HÔM NAY TỔNG HỢP
function renderDaily() {
  if (!currentResult) { $('daily-out').textContent = 'Nhập ngày sinh rồi luận giải để xem hôm nay.'; return; }
  const r = dailyGuidance(currentResult);
  const cls = r.score >= 65 ? 'rate-cat' : r.score >= 45 ? 'rate-mid' : 'rate-hung';
  const yiHtml = r.yi.map((y) => '<span class="lm-rate rate-cat">' + y + '</span>').join(' ');
  const jiHtml = r.ji.map((j) => '<span class="lm-rate rate-hung">' + j + '</span>').join(' ');
  const reasonsHtml = r.reasons.map((rs) => '<li>' + rs + '</li>').join('');
  $('daily-out').innerHTML =
    '<div class="dy-head"><b>' + r.date + '</b> (ÂL ' + r.lunar + ') <span class="zh">' + r.dayGanZhi + '</span> [' + r.dayGanVsDm + '] <span class="ln-rate ' + cls + '">' + r.score + '/100</span></div>'
    + '<div class="dy-verdict">' + r.verdict + '</div>'
    + '<div class="dy-yj"><b>宜 (nên):</b> ' + yiHtml + '</div>'
    + '<div class="dy-yj"><b>忌 (tránh):</b> ' + jiHtml + '</div>'
    + '<details><summary>Lý do chi tiết</summary><ul class="zr-reasons">' + reasonsHtml + '</ul></details>';
}

// ---------------------------------------------------------------- PHONG THỦY HƯỚNG (4 hệ)
function renderSpaceFs() {
  if (!currentResult) return;
  const i = currentResult.chart.input;
  const sf = spaceFs(i.year, i.gender, currentResult.yong, new Date().getFullYear());
  const cells = sf.result.map((r) => {
    const cls = r.verdict === 'CAT' ? 'cat' : r.verdict === 'HUNG' ? 'xiong' : 'mid';
    return '<div class="sf-cell ' + cls + '"><div class="sf-dir">' + r.dir + '</div><div class="sf-votes">' + (r.votes >= 0 ? '+' : '') + r.votes + '</div><div class="sf-notes">' + r.notes.join(' ') + '</div></div>';
  }).join('');
  const el = document.getElementById('space-out');
  if (el) el.innerHTML = '<div class="sf-head">' + sf.zhai + ' · Dụng ' + sf.yong + ' · Năm ' + sf.year + '</div><div class="sf-grid">' + cells + '</div><div class="zr-advice">' + sf.advice + '</div>' + (sf.warn ? '<div class="zr-advice" style="color:#ff9b89">' + sf.warn + '</div>' : '');
}

// ---------------------------------------------------------------- VẬN ĐỜI TỪNG GIAI ĐOẠN
function renderPillarAge() {
  if (!currentResult) return;
  const pa = analyzePillarAges(currentResult);
  const cells = pa.map((p) => {
    const cls = p.score >= 62 ? 'cat' : p.score >= 42 ? 'mid' : 'xiong';
    return '<div class="pa-cell ' + cls + '"><div class="pa-label">' + p.label + '</div><div class="pa-range">' + p.range + '</div><div class="pa-score">' + p.score + '</div><div class="pa-god">Can: ' + p.ganGod + (p.ganIsDung ? ' ★' : p.ganIsKy ? ' ✗' : '') + ' | Chi: ' + p.zhiGod + (p.zhiIsDung ? ' ★' : '') + '</div><div class="pa-v">' + p.verdict + '</div></div>';
  }).join('');
  const el = document.getElementById('pillarage-out');
  if (el) el.innerHTML = '<div class="pa-grid">' + cells + '</div>';
}

// ---------------------------------------------------------------- KHÔNG VONG
function renderKongwang() {
  if (!currentResult) return;
  const kw = analyzeKongwang(currentResult.chart);
  const el = document.getElementById('kongwang-out');
  if (!el) return;
  if (!kw.affected.length) { el.innerHTML = '<p class="hint">Không trụ nào rơi không vong — lá số không bị "treo".</p>'; return; }
  el.innerHTML = '<div class="kw-note"><b>空亡 (' + kw.kong.join(', ') + ')</b> — ' + kw.note + '</div><ul class="zr-reasons">' + kw.affected.map((a) => '<li><b>' + a.palace + '</b>: ' + a.note + '</li>').join('') + '</ul>' + (kw.tips.length ? '<p class="hint">' + kw.tips.join(' ') + '</p>' : '');
}

// ---------------------------------------------------------------- THẬP NHỊ TRƯỜNG SINH SÂU
function renderChangshengDeep() {
  if (!currentResult) return;
  const cs = analyzeChangsheng(currentResult.chart);
  const el = document.getElementById('csdeep-out');
  if (!el) return;
  const luckCls = (l) => l === 'cát' ? 'rate-cat' : l === 'hung' || l === 'hung nhẹ' ? 'rate-hung' : 'rate-mid';
  el.innerHTML = '<div class="cs-grid">' + cs.stages.map((s) => {
    return '<div class="cs-cell ' + luckCls(s.luck) + '"><div class="cs-stage">' + s.stageVi + '</div><div class="cs-label">' + s.label + '</div><div class="cs-meaning">' + s.meaning.slice(0, 80) + '...</div></div>';
  }).join('') + '</div><div class="tiaohou-note">' + cs.monthNote + '</div>';
}

// ---------------------------------------------------------------- PHỐI NGỖU LÝ TƯỞNG (BẢNG + CHI TIẾT)
function renderIdealMatch() {
  if (!currentResult) return;
  const i = currentResult.chart.input;
  const partnerGender = i.gender === 'nam' ? 'nu' : 'nam';
  const userYr = i.year;
  const m = findIdealPartners(currentResult, { ageMin: -15, ageMax: 30, gender: partnerGender });
  const ct = idealChildTiming(currentResult);

  // BẢNG PARTNER — header
  var rows = m.top.map(function(p) {
    var pYr = parseInt(p.date.split('-')[0]);
    var diff = userYr - pYr;
    var ageStr = diff > 0 ? 'kém ' + diff + 't' : diff < 0 ? 'hơn ' + Math.abs(diff) + 't' : 'bằng tuổi';
    var dung = p.dmIsGood ? ' ★ DỤNG' : '';
    // Full profile
    var prof = buildFullProfile(p, currentResult);
    var detailId = 'im-det-' + p.rank;
    return '<tr class="im-row" onclick="var d=document.getElementById(\'' + detailId + '\'); d.style.display=d.style.display===\'none\'?\'\':\'none\';">' +
      '<td><b>#' + p.rank + '</b></td>' +
      '<td>' + p.date + '<br><span class="im-age">' + ageStr + '</span></td>' +
      '<td class="zh">' + p.ganZhi4 + '</td>' +
      '<td>' + p.dayMaster + dung + '</td>' +
      '<td><b>' + p.combinedScore + '</b></td>' +
      '<td>' + p.hehunRating + '</td>' +
      '<td>' + p.yearRel + (p.dayRel ? '<br>' + p.dayRel : '') + '</td>' +
      '<td>' + (p.nameHint && p.nameHint.chars ? p.nameHint.chars.split('(').slice(0,4).join('(').replace(/\)/g,') ').trim() : '?') + '</td>' +
      '</tr>' +
      '<tr id="' + detailId + '" style="display:none"><td colspan="8"><div class="im-detail">' +
      prof.paragraphs.map(function(pa) { return '<p>' + pa + '</p>'; }).join('') +
      '</div></td></tr>';
  }).join('');

  // CON CÁI — bảng với ngày cụ thể
  var childRows = ct.filter(function(c) { return c.isBest; }).map(function(c) {
    var dates = '';
    try { var cd = idealChildDates(currentResult, c.year); dates = cd.slice(0,3).map(function(d) { return d.date + ' ' + d.ganZhi + ' (' + d.score + ')'; }).join('<br>'); } catch(e) {}
    return '<tr>' +
      '<td><b>' + c.year + '</b></td>' +
      '<td class="zh">' + c.ganZhi + '</td>' +
      '<td>' + c.ganWx + '/' + c.zhiWx + '</td>' +
      '<td><b>' + c.score + '</b></td>' +
      '<td>' + c.notes.join('; ') + '</td>' +
      '<td>' + dates + '</td>' +
      '<td>' + (c.nameHint && c.nameHint.chars ? c.nameHint.chars.split('(').slice(0,4).join('(').replace(/\)/g,') ').trim() : '?') + '</td>' +
      '</tr>';
  }).join('');

  var el = document.getElementById('match-out');
  if (!el) return;
  el.innerHTML =
    '<h4>💕 BẢNG PHỐI NGỖU LÝ TƯỞNG (scan ' + m.totalScanned + ' lá số)</h4>' +
    '<table class="im-table"><thead><tr>' +
    '<th>#</th><th>Ngày sinh</th><th>Bát Tự</th><th>Nhật Chủ</th><th>Score</th><th>Hợn</th><th>Quan hệ</th><th>Tên nên mang</th>' +
    '</tr></thead><tbody>' + rows + '</tbody></table>' +
    '<p class="hint">👆 Click từng hàng để xem HỒ SƠ CHI TIẾT (12 mục: tính cách, nghề, ngoại hình, gia cảnh, cách ở với bạn, con cái...)</p>' +
    '<h4>👶 BẢNG THỜI ĐIỂM SINH CON</h4>' +
    '<table class="im-table"><thead><tr>' +
    '<th>Năm</th><th>Can Chi</th><th>Ngũ Hành</th><th>Score</th><th>Lý do</th><th>Ngày/giờ cụ thể</th><th>Tên con</th>' +
    '</tr></thead><tbody>' + childRows + '</tbody></table>' +
    '<p class="hint">⚠ Profile THAM KHẢO do hệ thống TÍNH TOÁN — không phải người thật. Khi gặp ai, nhập lá số họ vào app → đối chiếu.</p>';
}

// ---------------------------------------------------------------- TỬ VI 14主星 MEANING + 六吉六煞
function renderZiweiFull() {
  if (!currentResult) return;
  const i = currentResult.chart.input;
  const z = computeZiwei(i.year, i.month, i.day, i.hour, i.minute, i.gender);
  // 14主星 meaning
  const stars = interpretZiweiStars(z);
  const starsHtml = stars.map(s => '<div class="zw-star ' + (s.inMingGong ? 'ming' : '') + ' ' + s.tone + '"><b>' + s.star + '</b> (' + s.vi + ') @' + s.branch + (s.inMingGong ? ' ★ Mệnh' : '') + '<div class="zw-sn">' + s.nature + '</div></div>').join('');
  // 六吉六煞
  const aux = computeAuxStars(z.birth.yearGan, z.birth.yearZhi || '酉', z.birth.lunarMonth, z.birth.timeZhi);
  const auxHtml = Object.entries(aux).map(([k,v]) => '<span class="zw-aux ' + v.tone + '">' + k + ' (' + v.vi + ') @' + v.branch + '</span>').join(' ');
  // 孤辰寡宿 etc
  const ms = computeMarriageShensha(currentResult.chart);
  const msHtml = ms.length ? ms.map(s => '<span class="zw-aux sha">' + s.star + ' (' + s.vi + ') @' + s.positions + '</span>').join(' ') : '(không)';
  const el = document.getElementById('ziwei-stars-out');
  if (el) el.innerHTML = '<div class="zw-stars-list">' + starsHtml + '</div><h4>六吉六煞</h4><div class="zw-aux-list">' + auxHtml + '</div><h4>神煞 hôn nhân</h4><div class="zw-aux-list">' + msHtml + '</div>';
}

function renderExtraShensha(){
  if(!currentResult) return;
  try{
    const es = computeExtraShensha(currentResult.chart);
    if(!es.length) return;
    const html = es.map(function(s) {
      return '<div class="ss volatile"><div class="ss-zh">' + s.star + '</div><div class="ss-vi">' + s.vi + ' @' + s.at + '</div><div class="ss-desc">' + s.desc + '</div></div>';
    }).join('');
    const el = document.getElementById('shensha-extra-out');
    if (el) el.innerHTML = '<div class="shensha" style="margin-top:8px">' + html + '</div>';
  } catch(e) { console.warn('extraShensha', e.message); }
}
function renderMarriageDeep(){
  if(!currentResult) return;
  try{
    const md = analyzeMarriageDeep(currentResult);
    const cls = md.score >= 65 ? 'rate-cat' : md.score >= 45 ? 'rate-mid' : 'rate-hung';
    var html = '<div class="md-head">Hôn nhân: <b>' + md.score + '/100</b> <span class="ln-rate ' + cls + '">' + md.summary + '</span></div>';
    html += '<div class="md-body">' + md.paragraphs.map(function(p){ return '<p>' + p + '</p>'; }).join('') + '</div>';
    var el = document.getElementById('marriage-out');
    if(el) el.innerHTML = html;
  }catch(e){console.warn('marriageDeep',e.message);}
}