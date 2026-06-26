import { analyze } from './engine/chart.js';
import { Solar } from 'lunar-javascript';
import { TOPICS, answer, hanviet, wxVi } from './engine/interpret.js';
import { GAN, ZHI, ZHI_ORDER, WX_VI, WX_COLOR, TEN_GOD_VI, CHANGSHENG_VI } from './engine/constants.js';
import { INTERACTION_MEANING, DITIANSUI } from './engine/kb.js';
import { tieredAnalysis } from './engine/tiers.js';
import { evaluateDate, findGoodDates, ACTIVITY } from './engine/zheri.js';
import { computeZhai } from './engine/zhai.js';
import { computeHehun } from './engine/hehun.js';
import { inverseBaZiSolve, labelResult } from './engine/inverse-bazi.js'; // [loop 21] 逆推八字
import { trueSolarTime } from './engine/truetime.js'; // [loop 23] 真太阳时 + múi giờ
import { chartSensitivity } from './engine/sensitivity.js'; // [loop 26] mệnh nhạy cảm
import { fiveDimRadar } from './engine/five-dim-radar.js'; // [loop 33] ngũ duy radar
import { weekPreview } from './engine/week-preview.js'; // [loop 36] tuần này 7 ngày
import { analyzeVitality } from './engine/vitality.js'; // [loop 42] đại vận khúc tuyến
import { monthCalendar } from './engine/month-calendar.js'; // [loop 48] lịch tháng vận
import { analyzeLiunianDeep, computeDayunPhase } from './engine/liunian-pro.js'; // [loop 170] +phase cho Lưu Niên card
import { liunianEvents } from './engine/liunian-event.js';
import { qianliEightSteps, QIANLI_QUOTE } from './engine/qianli.js';
import { computeLiuyue } from './engine/liuyue.js';
import { analyzeLiuRi, findGoodDays as findGoodDaysRi } from './engine/liuri.js';
import { taSuiTable, personalTaSui, taSuiDirection, TAISUI_REMEDY, TYPE_VI } from './engine/taisui.js';
import { analyzeName, wxOf } from './engine/name.js';
import { analyzeMangpai } from './engine/mangpai.js';
import { analyzeMangpaiView } from './engine/mangpai-view.js';
import { xuankongPan } from './engine/xuankong.js';
import { daguaByMountain, daguaCompatibility, daguaOverview, MOUNTAINS_HAN } from './engine/xuankong-dagua.js';
import { computeZiwei, yunXianSihua, computeDaxianSihua } from './engine/ziwei.js';
import { annualSihuaToNatal } from './engine/ziwei-liunian-sihua.js';
import { ziweiDailyZiwei } from './engine/ziwei-liuri.js';
import { xiaoxianInChart } from './engine/xiaoxian.js';
import { bestHourToday } from './engine/best-hour.js';
import { castByTime, castByNumbers, solarToMhNums, TRIGRAMS } from './engine/meihua.js';
import { xiaoliurenDetail, solarToXlrNums } from './engine/xiaoliuren.js';
import { castLiuYao } from './engine/liuyao.js';
import { qiuqian, zhiJiao, TONES } from './engine/qiuqian.js';
import { jiemeng as jiemengEngine } from './engine/jiemeng.js';
import { qimenPan, qimenDongPan } from './engine/qimen.js';
import { liurenPan } from './engine/liuren.js';
import { jinkoujue, renderJinkoujueCard } from './engine/jinkoujue.js';
import { taiyi } from './engine/taiyi.js';
import { analyzeKongwang } from './engine/kongwang.js';
import { scanSuiyun } from './engine/suiyun.js'; // [loop 165] Tuế Vận Tịnh Lâm card — lưu niên × đại vận interaction
import { analyzePillarAges } from './engine/pillar-age.js';
import { spaceFs } from './engine/space-fs.js';
import { MOUNTAINS_24, sittingDirectionAnalysis, yinzhaiOverview, mountainInfo } from './engine/yinzhai.js';
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
import { analyzeNobleStars } from './engine/noble-stars.js';
import { liunian12Shen } from './engine/liunian-shen.js';
import { analyzeLiunian12 } from './engine/liunian-12shen.js';
import { nayinInfo } from './engine/nayin.js';
import { tongshengDay } from './engine/tongsheng.js';
import { taiYuan } from './engine/taiyuan.js';
import { xiuDay } from './engine/ershibaxiu.js';
import { zodiacPairScore, ZODIAC as ZODIAC_DEEP } from './engine/zodiac-deep.js';
import { interpretZiweiStars } from './engine/ziwei-stars.js';
import { computeAuxStars } from './engine/ziwei-aux.js';
import { computeMarriageShensha, computeExtraShensha } from './engine/shensha-marriage.js';
import { viToHan } from './engine/vi2han.js';
import { askAI, getConfig, setConfig, isAIReady, PRESETS, testAIConnection } from './engine/ai.js';
import { decadeForecast } from './engine/decade-forecast.js';
import { starPower } from './engine/star-power.js';
import { annualTabooOverview } from './engine/annual-taboo.js';
import { waterActivation } from './engine/water-activation.js';
import { scanMarriageTiming } from './engine/marriage-timing.js';
import { idealHouse } from './engine/ideal-house.js';
import { scanWealthCareerYingqi } from './engine/yingqi-wealth.js';
import { dominantGod } from './engine/dominant-god.js';
import { analyzeYanQin } from './engine/yanqin.js';
import { analyzeHealth } from './engine/health-analysis.js'; // [loop 183] Sức Khoẻ Ngũ Hành card
import { healthAlertScan } from './engine/health-alert.js'; // [loop 224 fix] quickSummary + health card timeline — trước đây KHÔNG import → quickSummary's health alert CHẾT (ReferenceError bị try/catch nuốt)
import { qinxingOverview, qinxingCycle } from './engine/qinxing.js';
import { analyzeTongGen } from './engine/tonggen.js';
import { missingGod } from './engine/missing-god.js';
import { sanyuanJiuyun } from './engine/sanyuan-jiuyun.js';
import { analyzeKu } from './engine/ku.js';
import { scanFuyin } from './engine/fuyin.js';
import { analyzeZiweiGeju } from './engine/ziwei-geju.js';
import { analyzeZiweiBrightness } from './engine/ziwei-brightness.js';
import { analyzeShuangXing } from './engine/ziwei-shuangxing.js';
import { taiSuiOverview } from './engine/taisui-general.js';
import { analyzeTaohua } from './engine/taohua.js';
import { buildRemedy } from './engine/remedy.js';
import { wuTai } from './engine/tonggen.js';
import { dailyGuide } from './engine/daily-guide.js';
import { dailyDirections } from './engine/daily-directions.js';
import { personalFengShui } from './engine/family-sync.js';
import { strength3Fa } from './engine/strength-3fa.js';
import { jiaoYunAnalysis } from './engine/jiaoyun.js';
import { analyzePillarQuality } from './engine/pillar-quality.js';
import { analyzeHuaQi } from './engine/huaqi.js';
import { dayunChangSheng, liunianChangSheng, dayunYongChangSheng, liuyueChangSheng } from './engine/dayun-changsheng.js';
import { analyzeHanNuan } from './engine/han-nuan.js';
import { analyzeWxFlow } from './engine/wx-flow.js';
import { classifyChartLevel } from './engine/chart-level.js';
import { baziMingGong } from './engine/bazi-minggong.js';
import { analyzeChildrenStar } from './engine/children-star.js';
import { predictEvents } from './engine/event-predict.js';
import { getPersonalityProfile } from './engine/personality-profile.js';
import { mingZhuShenZhu } from './engine/mingzhu.js';
import { dailyPro } from './engine/daily-pro.js';
import { analyzeFiveVirtues } from './engine/five-aspects.js';
import { analyzeRomance } from './engine/romance-deep.js';
import { investmentStyle } from './engine/invest-style.js';
import { personalNutrition } from './engine/bazi-diet.js';
import { crystalLuckyObjects } from './engine/crystal-fs.js';
import { clothingByOccasion } from './engine/clothing-fs.js';
import { personalWorkout } from './engine/bazi-workout.js';
import { plantFengShui } from './engine/plant-fs.js';
import { musicTherapy } from './engine/music-therapy.js';
import { teaTherapy } from './engine/tea-therapy.js';
import { aromaTherapy } from './engine/aroma-fs.js';
import { analyzeBusiness } from './engine/bazi-business.js';
import { seasonalAdvice } from './engine/seasonal-advice.js';
import { detectAnchong } from './engine/anchong.js';
import { lifeTimeline } from './engine/destiny-timeline.js';
import { nobleCultivation } from './engine/noble-cultivate.js';
import { cityRecommendation } from './engine/city-fs.js';
import { socialStrategy } from './engine/social-fs.js';
import { spiritualPractice } from './engine/spiritual-fs.js';
import { cureByElement } from './engine/fs-cure.js';
import { findNoblePerson } from './engine/emperor-star.js';
import { recommendNumbers } from './engine/number-fs.js';
import { sleepOptimization } from './engine/sleep-fs.js';
import { checkNatalActivation } from './engine/shensha-activation.js';
import { flyingSihua } from './engine/flying-sihua.js';
import { findMoveDates } from './engine/move-fs.js';
import { matchBusinessPartners } from './engine/partner-match.js';
import { findWeddingDates } from './engine/wedding-date.js';
import { analyzeFamilyHarmony } from './engine/family-fortune.js';
import { nayinRelations } from './engine/nayin-relation.js';
import { patternQuality } from './engine/pattern-quality.js';
import { marriageStars } from './engine/marriage-stars.js';
import { monthlySha } from './engine/monthly-sha.js';
import { annualDirection } from './engine/annual-direction.js';
import { analyzeDaySpecial, nextTianShe } from './engine/zheri-stars.js';
import { analyzeDeRi } from './engine/deri.js';
import { analyzeXiongRi } from './engine/xiongri.js';
import { analyzeMonthShen } from './engine/zheri-extra.js';
import { ziweiCoreReading } from './engine/ziwei-sanfang.js';
import { findGoldenYear } from './engine/golden-year.js';
import { forecast5 } from './engine/forecast5.js';
import { verifyPastEvent } from './engine/event-verify.js';
import { lifeReading } from './engine/life-reading.js';
import { dailyBriefing } from './engine/daily-briefing.js';
import { chenggu } from './engine/chenggu.js';
import { sanshishu } from './engine/sanshishu.js';
import { heluo } from './engine/heluo.js';
import { huangdao12, renderHuangdaoCard } from './engine/huangdao.js';
import { donggongDay, donggongInMonth } from './engine/donggong.js';
import { qizheng, renderQizhengCard } from './engine/qizheng.js';
import { tianxingZheri, renderTianxingCard, MOUNTAINS_24 as TX_MOUNTAINS_24, MOUNTAIN_VI } from './engine/tianxing-zheri.js';
import {
  FACE_PALACES, MOLE_POSITIONS, AGE_FACE_MAP,
  getFacePalace, getMoleReading, getAgeFaceMap, physiognomyOverview,
} from './engine/physiognomy.js';
import { cezi as ceziDivination } from './engine/cezi.js';
import { yizhangjingFromChart as yizhangjingCast, renderYizhangjingCard } from './engine/yizhangjing.js';

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
  const favHtml = [...new Set([yong.primary, yong.xi].filter(Boolean))].map((w) => pill(w)).join('');
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
      ${(() => {
        const pq = R.patternQuality; if (!pq) return '';
        const cls = { 成格: 'rate-cat', 有救: 'rate-mid', 败格: 'rate-hung', 特殊: 'rate-cat', 未知: 'rate-mid' }[pq.quality] || 'rate-mid';
        const vi = { 成格: '✓ Thành cách', 有救: '⚠ Có cứu', 败格: '✗ Bại cách', 特殊: '★ Đặc biệt', 未知: '?' }[pq.quality] || pq.quality;
        const title = esc(pq.summary);
        return `<div class="v-sub"><span class="ln-rate ${cls}" title="${title}" style="cursor:help">${vi}</span> <span class="hint-inline" title="${title}">成败救应 (子平真诠 ch.9)</span></div>`;
      })()}
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
  // [loop 204] 大限: trước đây slice(0,6) → chỉ 5-64t (che 大限 hiện tại của người >65t).
  //   Nay filter to≤95: đủ cả đời thực tế (5-94t, ~9 大限), bỏ 95-124t vô nghĩa.
  const dx = z.daXian.filter((d) => d.to <= 95).map((d) => `<div class="zw-dx"><b>${d.from}-${d.to}t</b> ${d.palace} <span class="zh">${d.ganZhi}</span></div>`).join('');
  const sihuaHtml = Object.entries(z.sihua || {}).map(([k, v]) =>
    `<span class="zw-sh ${v.tone}"><b>${k}</b> ${v.star}${v.palace ? '@' + v.palace : ''}</span>`).join('');
  $('ziwei').innerHTML = `
    <div class="zw-head">Mệnh cung <span class="zh big">${z.mingGong}</span> · Thân cung ${z.shenGong} · <span class="ln-rate rate-mid">${z.juVi}</span>
      <span class="hint-inline">(ÂL ${z.birth.lunarMonth}月${z.birth.lunarDay}日 · 时 ${z.birth.timeZhi} · 紫微@${z.ziweiBranch||'?'} · 天府@${z.tianfuBranch||'?'})</span></div>
    <div class="zw-grid">${pal}</div>
    <h4 class="syn-h4">四化 生年 (theo năm can ${z.birth.yearGan}) —禄/权/科/忌</h4>
    <div class="zw-sihua">${sihuaHtml}</div>
    ${(() => {
      const zh = z.zihua;
      if (!zh || !Array.isArray(zh.list) || !zh.list.length) {
        return `<h4 class="syn-h4">宫干自化 宮干自化 (can cung → hóa rơi trúng cung phát = tự biến đổi)</h4>
        <div class="hint" style="font-size:12px">Mệnh bàn không có cung nào bị 宫干自化 — các cung ổn định, không "tự biến đổi" từ bên trong.</div>`;
      }
      const tags = zh.list.map((r) =>
        `<span class="zw-sh ${r.tone}" title="${r.interpretation}"><b>自化${r.hua}</b> ${r.star} <span class="hint-inline">${r.palaceVi}</span> <span class="zh">(${r.palaceGanZhi})</span></span>`).join('');
      return `<h4 class="syn-h4">宫干自化 宮干自化 (${zh.list.length} cung tự biến đổi — lõi phi tinh; 忌=tự phá hoại, 禄=dễ được không bền)</h4>
      <div class="zw-sihua">${tags}</div>`;
    })()}
    ${(() => {
      const yx = yunXianSihua(z, new Date().getFullYear(), i.year);
      const fmt = (sh) => Object.entries(sh || {}).map(([k, v]) => `<span class="zw-sh ${v.tone}"><b>${k}</b> ${v.star}@${v.palace || '?'}</span>`).join('');
      return `
    <h4 class="syn-h4">运限四化 — 大限(${yx.activeDy?.ganZhi||'?'} ${yx.activeDy?.from}-${yx.activeDy?.to}t) + 流年(${yx.yearStem})</h4>
    <div class="zw-sihua"><span style="color:var(--muted);font-size:11px">大限:</span> ${fmt(yx.dxSihua)}</div>
    <div class="zw-sihua"><span style="color:var(--muted);font-size:11px">流年:</span> ${fmt(yx.lnSihua)}</div>`;
    })()}
    ${(() => {
      // 大限宫干四化 (vòng 9): can cung đại hạn HIỆN TẠI → 4 hóa → bay vào mệnh bàn
      // → tiết lộ 4 lĩnh vực bị KÍCH HOẠT trong 10 năm này (động, khác 自化/飞星 tĩnh).
      const dx = computeDaxianSihua(z, new Date().getFullYear(), i.year);
      if (!dx.active || !dx.sihua.length) return '';
      const tags = dx.sihua.map((r) =>
        `<span class="zw-sh ${r.tone}" title="${esc(r.interpretation)}"><b>化${r.type}</b> ${r.star}
          → ${r.placed ? `<b>${esc(r.targetPalaceVi.split('(')[0])}</b> <span class="zh small">(${esc(r.targetGanZhi)})</span>` : '<span class="hint">(không đặt)</span>'}
          <span class="hint-inline">${esc(r.domain)}</span></span>`).join('');
      return `
    <h4 class="syn-h4">大限宫干四化 大限宮干四化 — decade ${esc(dx.ageRange)} @ <span class="zh">${esc(dx.daxianGanZhi)}</span> kích hoạt 4 lĩnh vực</h4>
    <div class="hint" style="font-size:12px">Cung đại hạn ${esc(dx.daxianPalaceVi)} có can <b class="zh">${esc(dx.daxianGan)}</b> → 4 hóa bay vào mệnh bàn bẩm sinh → bật công tắc 4 lĩnh vực trong 10 năm (${esc(dx.ageRange)}):</div>
    <div class="zw-sihua">${tags}</div>
    <p class="hint" style="font-size:11px;margin-top:3px">${esc(dx.summary)}</p>`;
    })()}
    <h4 class="syn-h4">博士十二神 (niên hệ, 禄存@${z.boshi?.luCunZhi} ${z.boshi?.direction})</h4>
    <div class="zw-dxrow" style="grid-template-columns:repeat(6,1fr)">${(z.boshi?.stars||[]).map((s) => `<div class="zw-dx"><span class="zh">${s.star}</span> <span class="ln-rate ${s.tone==='cat'?'rate-cat':'rate-hung'}" style="font-size:10px">${s.atZhi}</span></div>`).join('')}</div>
    <h4 class="syn-h4">辅星 (左辅右弼/文昌文曲/天魁天钺)</h4>
    <div class="zw-dxrow" style="grid-template-columns:repeat(6,1fr)">${(z.fuxing?.stars||[]).map((s) => `<div class="zw-dx" title="${s.desc}"><span class="zh">${s.star}</span> <span class="ln-rate rate-cat" style="font-size:10px">${s.atZhi}</span></div>`).join('')}</div>
    <h4 class="syn-h4">大限 (đại hạn, 10 năm/cung, ${z.ju}t起运)</h4>
    <div class="zw-dxrow">${dx}</div>
    <p class="hint">${z.note}</p>`;
}

// ---------------------------------------------------------------- LƯU NIÊN TỨ HÓA 流年四化 (năm can → 4 hóa → cung bẩm sinh)
function renderLnSihua(R) {
  const el = $('ln-sihua');
  if (!el) return;
  try {
    const year = new Date().getFullYear();
    const ln = annualSihuaToNatal(R, year);
    if (!ln) { el.innerHTML = '<p class="hint">Không tính được lưu niên tứ hóa (thiếu mệnh bàn Tử Vi).</p>'; return; }
    const rows = ln.activated.map((a) => {
      const tone = a.tone === 'cat' ? 'rate-cat' : 'rate-hung';
      const placed = a.placed
        ? `<span class="ln-rate ${tone}"><b>${a.hua}${a.star}</b></span> → cung <b>${esc(a.palaceVi || '?')}</b> <span class="zh small">${esc(a.palaceZh || '')}</span> — <b>${esc(a.domain || '?')}</b>`
        : `<span class="ln-rate rate-mid"><b>${a.hua}${a.star}</b></span> → <span class="hint">không đặt được cung</span>`;
      return `<div class="ln-row">${placed} <span class="hint-inline">(${esc(a.huaVi)}: ${esc(a.hint)})</span></div>`;
    }).join('');
    const bestHtml = ln.best
      ? `<p class="hint"><b>🌟 Nổi bật tốt:</b> ${ln.best.hua}${ln.best.star} @ ${esc(ln.best.palaceVi || '?')} (${esc(ln.best.domain || '?')})</p>` : '';
    const worstHtml = ln.worst
      ? `<p class="hint"><b>⚠ Cẩn trọng:</b> ${ln.worst.hua}${ln.worst.star} @ ${esc(ln.worst.palaceVi || '?')} (${esc(ln.worst.domain || '?')})</p>` : '';
    el.innerHTML = `
      <p class="hint">Năm ${ln.year} — can ${ln.yearGan} (<span class="zh">${ln.yearGanZhi}</span>) sinh 4 hóa bay vào mệnh bàn bẩm sinh:</p>
      <div class="ln-sihua-list">${rows}</div>
      ${bestHtml}${worstHtml}
      <p class="hint" style="margin-top:4px">${esc(ln.summary)}</p>`;
  } catch (e) {
    console.warn('lnSihua', e.message);
    el.innerHTML = '<p class="hint">Không tính được lưu niên tứ hóa.</p>';
  }
}

// ---------------------------------------------------------------- TỔNG LUẬN MỆNH
function renderSynthesis(R) {
  const s = R.synthesis;
  if (!s || !s.paragraphs) { $('synthesis').innerHTML = '<p class="hint">Chưa tính được tổng luận.</p>'; return; }
  const combosHtml = (s.combos && s.combos.length)
    ? `<div class="combos">${s.combos.map((c) => `<span class="combo ${esc(c.tone)}"><b>${esc(c.vi)}</b> <span class="zh small">${esc(c.name)}</span> — ${esc(c.desc)}</span>`).join('')}</div>`
    : '<p class="hint">Không có tổ hợp Thập thần nổi bật.</p>';
  const gradeTone = s.score >= 68 ? 'cat' : (s.score >= 55 ? 'mid' : 'warn');
  // [loop 110 integrate] quick metrics: 格局成败 + 敌我力量 (tích hợp elevation vào card Tổng Luận)
  const pq = R.patternQuality || {};
  const QVI = { 成格: '✓ Thành cách', 有救: '✓ Bại+cứu', 败格: '⚠ Bại cách', 特殊: '★ Đặc biệt', 未知: '' };
  const yong = R.yong || {};
  const sc = R.wx.score || {};
  const ally = (sc[yong.primary] || 0) + (sc[yong.xi] || 0);
  const enemy = (sc[yong.ji] || 0) + (sc[yong.chou] || 0);
  const sum = ally + enemy || 1;
  const allyPct = Math.round((ally / sum) * 100);
  const quickMetrics = `
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin:6px 0">
      ${QVI[pq.quality] ? `<span class="combo ${pq.quality === '败格' ? 'xiong' : 'cat'}">${esc(QVI[pq.quality])}</span>` : ''}
      <span class="combo ${R.strength?.strong ? 'cat' : 'xiong'}">Thân ${R.strength?.strong ? 'VƯỢNG' : 'NHƯỢC'} ${Math.round((R.strength?.ratio || 0) * 100)}%</span>
      <span class="combo ${allyPct >= 55 ? 'cat' : allyPct <= 45 ? 'xiong' : ''}">敌我: Dụng ${allyPct}% / Kỵ ${100 - allyPct}%</span>
      <span class="combo">Dụng ${esc(R.yong ? WX_VI[R.yong.primary] || '' : '')}</span>
    </div>`;
  $('synthesis').innerHTML = `
    <div class="syn-head">
      <div class="syn-grade ${gradeTone}"><span class="zh big">${esc(s.grade)}</span><span>${esc(s.gradeVi)}</span></div>
      <div class="syn-fortune"><b>${esc(s.fortuneVi)}</b> · điểm <b>${esc(s.score)}/100</b></div>
    </div>
    ${quickMetrics}
    <p class="syn-lead">${esc(s.paragraphs[0])} ${esc(s.paragraphs[1])}</p>
    <details class="syn-factors"><summary>Các nhân tố chấm điểm (cách – tình – lực – thanh trọc – phối hợp)</summary><div class="factor-list">${s.factors.map((f) => `<div class="factor">${esc(f)}</div>`).join('')}</div></details>
    <h4 class="syn-h4">Tổ hợp Thập Thần (十神组合)</h4>
    ${combosHtml}
    ${(() => {
      // [loop 241 fix BUG CAO] paragraphs.splice(2,0,qualityLine) làm indices lệch:
      //   [3] = FACTORS (không phải advice!), [4] = advice thật, [5] = 格局大运, [6] = 十二长生
      //   Trước đây render chỉ show [3] (=factors) làm «advice» → KHÔNG show advice + 格局大运 + 十二长生.
      //   Nay: tìm advice qua content + show tất cả paragraphs sau factors.
      const ps = s.paragraphs;
      const adviceIdx = ps.findIndex((p, i) => i > 1 && /Khuyên dùng/.test(p));
      const advice = adviceIdx >= 0 ? ps[adviceIdx] : (ps.length > 3 ? ps[ps.length - 1] : '');
      // show 格局大运 + 十二长生 (các paragraphs sau advice)
      const extras = ps.slice(Math.max(adviceIdx + 1, 4)).filter(Boolean);
      return `<p class="syn-advice">${esc(advice)}</p>${extras.map((p) => `<p class="hint" style="margin-top:4px">${esc(p)}</p>`).join('')}`;
    })()}`;
}

// ---------------------------------------------------------------- NGŨ HÀNH
function renderWuXing(wx, yong) {
  const max = Math.max(...Object.values(wx.pct));
  const fav = new Set([yong?.primary, yong?.xi].filter(Boolean));
  const avoid = new Set([yong?.ji, yong?.chou].filter(Boolean));
  const TAG = { [yong?.primary]: '★Dụng', [yong?.xi]: '♥Hỷ', [yong?.ji]: '⚠Kỵ', [yong?.chou]: '⚔Thù' };
  // [loop 140] 旺相休囚死 — mùa nào hành đó vượng/suy
  const monthWx = window._currentResult?.strength?.monthMainWx || '';
  const WT_VI = { 旺: 'Vượng', 相: 'Tướng', 休: 'Hưu', 囚: 'Tù', 死: 'Tử' };
  const WT_COLOR = { 旺: '#2e9e5b', 相: '#5cb85c', 休: '#caa14a', 囚: '#e8a23d', 死: '#e0533d' };
  $('wuxing').innerHTML = ['木', '火', '土', '金', '水'].map((w) => {
    const pct = wx.pct[w];
    const width = max > 0 ? (pct / max) * 100 : 0;
    const tag = TAG[w] || '';
    const tagColor = fav.has(w) ? '#2e9e5b' : avoid.has(w) ? '#e0533d' : '';
    const wt = monthWx ? wuTai(w, monthWx) : '';
    const wtBadge = wt ? `<span style="color:${WT_COLOR[wt]||'#888'};font-size:10px;border:1px solid ${WT_COLOR[wt]||'#888'};border-radius:3px;padding:0 3px;margin-left:3px">${WT_VI[wt]||wt}</span>` : '';
    return `
      <div class="wx-row">
        <div class="wx-name"><span class="dot" style="background:${WX_COLOR[w]}"></span>${w} ${WX_VI[w]}${tag ? ` <span style="color:${tagColor};font-weight:700;font-size:11px">${tag}</span>` : ''}${wtBadge}</div>
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

// ---------------------------------------------------------------- QUÝ NHÂN CAO CẤP (高级神煞贵人组)
function renderNobleStars(R) {
  const el = $('noble-stars');
  if (!el) return;
  try {
    const ns = analyzeNobleStars(R);
    // đánh giá 贵气 tổng thể
    const a = ns.assessment;
    const toneCls = a.score >= 6 ? 'cat' : a.score >= 3.5 ? 'mid' : (a.score < 1.5 ? 'warn' : '');
    const headHtml = `
      <div class="cg-head" style="margin-bottom:8px">
        <div class="cg-total"><span class="zh big" style="color:var(--gold,#d4af37)">${ns.count}</span> <span class="hint">sao quý nhân nhóm cao cấp</span></div>
        <div class="cg-tier"><span class="ln-rate ${toneCls}"><b>${a.level}</b> (${a.score}đ)</span></div>
      </div>
      <p class="hint" style="margin:0 0 8px">${esc(a.text)}</p>`;
    // lưới các sao (có/không)
    const gridHtml = `<div class="shensha" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">${ns.stars.map((s) => {
      const tone = !s.present ? 'off' : s.tone; // volatile/cat/off
      const posTxt = s.present ? (s.positions.join(' / ') || '—') : '(không gặp)';
      return `<div class="ss ${tone}" style="${s.present ? '' : 'opacity:.5'}">
        <div class="ss-zh">${s.zh}${s.present ? ' <span class="ln-rate rate-cat" style="font-size:10px">CÓ</span>' : ' <span class="ln-rate rate-mid" style="font-size:10px">—</span>'}</div>
        <div class="ss-vi">${esc(s.vi)} <span class="ss-at">${esc(posTxt)}</span></div>
        <div class="ss-desc">${s.present ? esc(s.meaning) : '<span style="opacity:.7">' + esc(s.meaning) + '</span>'}</div>
        ${s.present ? `<div class="tiaohou-note" style="margin-top:4px;font-size:11px"><b>Lời khuyên:</b> ${esc(s.advice)}</div>` : ''}
      </div>`;
    }).join('')}</div>`;
    el.innerHTML = headHtml + gridHtml + `<p class="hint" style="margin-top:6px">${esc(ns.summary)}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được nhóm quý nhân cao cấp.</p>'; }
}

// ---------------------------------------------------------------- ĐẠI VẬN / LƯU NIÊN
function rateClass(rating) {
  // [loop 162 fix] Hỗ trợ CẢ HAI hệ rating:
  //   • Đại vận (computeDaYun): Cát / Hơi thuận / Bình hòa / Hơi nghịch / Hung
  //   • Lưu niên (scoreLiunianYear): Đại cát / Cát / Bình / Hơi kỵ / Hung / Đại hung
  //   Trước đây chỉ map vocab đại vận → 'Đại cát' & 'Đại hung' & 'Hơi kỵ' rơi vào rate-mid
  //   (năm tốt nhất/xấu nhất KHÔNG được tô màu). Bổ sung vocab lưu niên.
  return {
    'Đại cát': 'rate-cat', 'Cát': 'rate-cat',
    'Hơi thuận': 'rate-good',
    'Bình hòa': 'rate-mid', 'Bình': 'rate-mid',
    'Hơi nghịch': 'rate-bad', 'Hơi kỵ': 'rate-bad',
    'Hung': 'rate-hung', 'Đại hung': 'rate-hung',
  }[rating] || 'rate-mid';
}
function renderDaYun(dayun) {
  if (!dayun.length) { $('dayun').innerHTML = '<p class="hint">Không tính được Đại Vận.</p>'; return; }
  // [loop 217] highlight thập kỷ TỐT NHẤT / XẤU NHẤT / HIỆN TẠI
  const scores = dayun.map((d) => d.score);
  const maxS = Math.max(...scores), minS = Math.min(...scores);
  const curAge = currentResult ? (new Date().getFullYear() - currentResult.chart.input.year) : -1;
  $('dayun').innerHTML = dayun.map((d) => {
    const isNow = curAge >= d.startAge && curAge < d.startAge + 10;
    const isBest = d.score === maxS && maxS >= 2;
    const isWorst = d.score === minS && minS <= -2;
    const mark = isNow ? ' ★' : '';
    const crown = isBest ? '<span class="ln-best" title="Thập kỷ TỐT NHẤT">👑</span>' : '';
    const warn = isWorst ? '<span class="ln-worst" title="Thập kỷ KỴ NHẤT — thủ">⚠</span>' : '';
    return `
    <div class="dy ${isNow ? 'dy-now' : ''} ${isBest ? 'ln-best-row' : ''} ${isWorst ? 'ln-worst-row' : ''}">
      <div class="dy-gz"><span class="${wxClass(d.ganWx)}">${d.gan}</span><span class="${wxClass(d.zhiWx)}">${d.zhi}</span></div>
      <div class="dy-vi">${hanviet(d.ganZhi)}${crown}${warn}${mark}</div>
      <div class="dy-age">${d.startAge}–${d.startAge + 9}t</div>
      <div class="dy-rate ${rateClass(d.rating)}">${d.rating}</div>
    </div>`;
  }).join('');
}
function renderLiuNian(liunian) {
  if (!liunian.length) { $('liunian').innerHTML = '<p class="hint">Không tính được Lưu Niên.</p>'; return; }
  const nowItem = liunian.find((l) => l.isNow);
  $('liunian-note').textContent = nowItem ? `(đại vận ${hanviet(nowItem.dayunGanZhi)})` : '';
  // [loop 216] highlight năm TỐT NHẤT (nên tiến thủ) & XẤU NHẤT (cẩn thận) trong thập kỷ
  const scores = liunian.map((l) => l.score);
  const maxScore = Math.max(...scores), minScore = Math.min(...scores);
  // [loop 170] 进气退气 phase — lực đại vận realised năm đó (xây đỉnh / đỉnh / phai).
  //   Chỉ badge 进气/退气 (nămfactor <1, điểm bị co về neut); 旺气 (đỉnh) là mặc định.
  const dayun = (currentResult && currentResult.dayun) || [];
  $('liunian').innerHTML = liunian.map((l) => {
    const ph = computeDayunPhase(dayun, l.year);
    const phaseBadge = ph && ph.factor < 1
      ? `<span class="ln-phase ${ph.phase === '进气' ? 'ph-in' : 'ph-out'}" title="${ph.vi}">${ph.phase === '进气' ? '进' : '退'}</span>`
      : '';
    const bestMark = l.score === maxScore && maxScore > 50 ? '<span class="ln-best" title="Năm TỐT NHẤT thập kỷ — nên tiến thủ">👑</span>' : '';
    const worstMark = l.score === minScore && minScore < 45 ? '<span class="ln-worst" title="Năm KỴ NHẤT — thủ, tránh quyết lớn">⚠</span>' : '';
    return `
    <div class="ln ${l.isNow ? 'ln-now' : ''} ${l.score === maxScore && maxScore > 50 ? 'ln-best-row' : ''} ${l.score === minScore && minScore < 45 ? 'ln-worst-row' : ''}">
      <div class="ln-year">${l.year}${l.isNow ? ' ★' : ''}${bestMark}${worstMark}${phaseBadge}</div>
      <div class="ln-gz"><span class="${wxClass(l.ganWx)}">${l.gan}</span><span class="${wxClass(l.zhiWx)}">${l.zhi}</span></div>
      <div class="ln-age">${l.age}t</div>
      <div class="ln-rate ${rateClass(l.rating)}">${l.rating}</div>
    </div>`;
  }).join('');
}

function renderDecade(R) {
  const el = $('decade');
  if (!el) return;
  try {
    const df = decadeForecast(R, new Date().getFullYear(), 10);
    el.innerHTML = `
      <p class="hint">10 năm tới一览: vận (6 phái) + 💰Tài + 🎯Quan + 💞Duyên. TỐT <b>${df.best.year} (${df.best.rating}, ${df.best.score}/100${df.best.flags.length ? ', ' + df.best.flags.join(' ') : ''})</b> · XẤU <b>${df.worst.year} (${df.worst.rating})</b></p>
      <div class="ln-decade" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${df.years.map((y) => {
        const curY = new Date().getFullYear();
        const isNow = y.year === curY;
        const isBest = y.year === df.best.year;
        const rowCls = isNow ? ' ln-now' : isBest ? ' ln-best-row' : '';
        return `
        <div class="ln${rowCls}" title="${y.ganZhi} ${y.flags.join(' ')}">
          <div class="ln-year">${y.year}${isNow ? ' ★' : ''}</div>
          <div class="ln-gz">${y.ganZhi}</div>
          <div class="ln-rate ${rateClass(y.rating)}">${y.rating} <small>${y.score}</small></div>
          <div class="ln-flags">${y.flags.join(' ') || '·'}</div>
        </div>`;
      }).join('')}</div>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được 10 năm.</p>'; }
}

function renderLifeReading(R) {
  const el = $('life-reading');
  if (!el) return;
  try {
    const lr = lifeReading(R);
    el.innerHTML = `
      <p style="font-size:14px;font-weight:600;color:var(--gold,#d4af37);margin-bottom:8px">${lr.oneSentence}</p>
      ${lr.sections.map((s) => `
        <details style="margin-bottom:4px">
          <summary style="cursor:pointer;font-weight:600;font-size:13px;color:var(--gold,#d4af37)">${s.title}</summary>
          <div class="hint" style="margin:4px 0 4px 16px">${s.content.map((c) => `<p>${c}</p>`).join('')}</div>
        </details>`).join('')}`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được tổng quan mệnh.</p>'; }
}

// ---------------------------------------------------------------- HÔM NAY TỔNG KHÁI 每日简报 (DAILY BRIEFING composite)
function renderDailyBriefing(R) {
  const el = $('daily-briefing');
  if (!el) return;
  try {
    const b = dailyBriefing(R, undefined, undefined, undefined, R.patternQuality);
    const rateCls = b.rating.tone === 'cat' ? 'rate-cat' : b.rating.tone === 'hung' ? 'rate-hung' : 'rate-mid';
    const toneVi = b.rating.tone === 'cat' ? 'Cát' : b.rating.tone === 'hung' ? 'Hung' : 'Bình';
    const bestHtml = b.bestHours.map((h) => {
      const r = h.score >= 60 ? 'rate-cat' : h.score >= 45 ? 'rate-mid' : 'rate-hung';
      return `<span class="ln-rate ${r}" style="margin-right:4px">${h.vi} <b>${h.score}</b></span>`;
    }).join('');
    const avoidHtml = b.avoidHours.map((h) => `<span class="ln-rate rate-hung" style="margin-right:4px">${h.vi}</span>`).join('');
    const tabooAvoid = b.directionTaboo.avoid.length
      ? b.directionTaboo.avoid.map((d) => `<span class="ln-rate rate-hung" style="margin-right:4px">${d}</span>`).join('')
      : '<span class="hint">(không có)</span>';
    const tabooSafe = b.directionTaboo.safe.length
      ? b.directionTaboo.safe.map((d) => `<span class="ln-rate rate-cat" style="margin-right:4px">${d}</span>`).join('')
      : '';
    const zTone = b.ziweiDaily.tone === 'cat' ? 'rate-cat' : b.ziweiDaily.tone === 'hung' ? 'rate-hung' : 'rate-mid';

    el.innerHTML = `
      <p style="font-size:14.5px;font-weight:700;color:var(--gold,#d4af37);margin:4px 0 8px;line-height:1.45">${b.oneLiner}</p>
      <div class="zr-head" style="margin-bottom:6px">
        <span class="zh">${b.dayGanZhi}</span> · ÂL ${b.lunarStr || '?'} ·
        <span class="ln-rate ${rateCls}">${b.rating.level} (${b.rating.score}/100 · ${toneVi})</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;margin-bottom:8px;font-size:12.5px">
        <div><b>⏰ Giờ tốt:</b> ${bestHtml || '<span class="hint">—</span>'}</div>
        <div><b>⚠ Giờ kỵ:</b> ${avoidHtml || '<span class="hint">—</span>'}</div>
        <div><b>🧭 Hướng kỵ:</b> ${tabooAvoid}</div>
        <div><b>✅ Hướng an:</b> ${tabooSafe || '<span class="hint">—</span>'}</div>
        <div><b>🔮 紫微流日:</b> <span class="ln-rate ${zTone}">${b.ziweiDaily.palace} ${b.ziweiDaily.vi}</span>${b.ziweiDaily.meaning ? ` <span class="hint">— ${b.ziweiDaily.meaning}</span>` : ''}</div>
        <div><b>📊 Dụng Thần:</b> ${b.yongAction.boost ? `<span class="ln-rate rate-cat">tăng ${b.yongAction.boost}</span>` : ''}${b.yongAction.reduce ? ` <span class="ln-rate rate-hung">giảm ${b.yongAction.reduce}</span>` : ''}</div>
      </div>
      ${b.yearEvent.god !== '?' ? `<p class="hint" style="margin:4px 0"><b>📆 Lưu niên ${new Date().getFullYear()}:</b> sao ${b.yearEvent.god}${b.yearEvent.event ? ' → ' + b.yearEvent.event : ''}${b.yearEvent.who ? ' (' + b.yearEvent.who + ')' : ''}</p>` : ''}
      <div style="margin-top:6px">${b.tips.map((t) => `<p class="hint" style="margin:2px 0">▸ ${t}</p>`).join('')}</div>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được每日简报.</p>'; }
}

// ---------------------------------------------------------------- 称骨算命 (BONE-WEIGHT DIVINATION)
function renderChenggu(R) {
  const el = $('chenggu');
  if (!el) return;
  try {
    const cg = chenggu(R);
    const w = cg.weights;
    const tone = cg.summary.tone === 'cat' ? 'rate-cat' : cg.summary.tone === 'warn' ? 'rate-hung' : 'rate-mid';
    el.innerHTML = `
      <div class="cg-head">
        <div class="cg-total"><span class="zh big">${cg.totalStr}</span></div>
        <div class="cg-tier"><span class="ln-rate ${tone}"><b>${cg.summary.tier}</b></span></div>
      </div>
      <p class="cg-breakdown hint">Năm ${cg.lunar.yearGanZhi} (${w.year}两) + tháng ÂL ${cg.lunar.month} (${w.month}两) + ngày ${cg.lunar.day} (${w.day}两) + giờ ${cg.lunar.timeZhi} (${w.hour}两) = <b>${cg.totalStr}</b></p>
      <div class="verse-box">
        <div class="verse-zh">${cg.verse}</div>
      </div>
      <p class="cg-interp">${cg.interpretation}</p>
      <p class="hint">${cg.summary.note}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được 称骨 (trọng lượng xương).</p>'; }
}

// ---------------------------------------------------------------- 三世书 前世今生 (PAST-PRESENT-FUTURE KARMA)
function renderSanshishu(R) {
  const el = $('sanshishu');
  if (!el) return;
  try {
    const s = sanshishu(R);
    const boneTone = s.boneCross
      ? (s.boneCross.tone === 'cat' ? 'rate-cat' : s.boneCross.tone === 'warn' ? 'rate-hung' : 'rate-mid')
      : '';
    el.innerHTML = `
      <div class="cg-head">
        <div class="cg-total"><span class="zh big">${s.yearGanZhi}</span></div>
        <div class="cg-tier"><span class="ln-rate rate-mid"><b>${s.pastLife.type} ${s.pastLife.vi}</b></span></div>
      </div>
      <p class="cg-breakdown hint">Năm sinh ${s.yearGanZhi} (vị ${s.code + 1}/60 hoa giáp, can mang hành ${s.ganWx}) → tiền thế tại <b>${s.pastLife.location}</b></p>
      <div class="verse-box">
        <div class="verse-zh">${s.pastLife.verse}</div>
      </div>
      <p class="cg-interp"><b>♛ Nhân quả kiếp trước:</b> ${s.karma.vi}</p>
      ${s.karma.cause && s.karma.cause !== s.karma.vi ? `<p class="hint">📖 Nguyên nhân: ${esc(s.karma.cause)}</p>` : ''}
      <p class="cg-interp"><b>☞ Phúc hoạ kiếp này:</b> ${s.currentLife.vi}</p>
      ${s.currentLife.fortune && s.currentLife.fortune !== s.currentLife.vi ? `<p class="hint">🔮 Chi tiết: ${esc(s.currentLife.fortune)}</p>` : ''}
      ${s.boneCross ? `<p class="hint"><span class="ln-rate ${boneTone}"><b>称骨三世:</b></span> ${s.boneCross.vi}</p>` : ''}
      <p class="hint" style="margin-top:6px">⚠ ${s.disclaimer}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được 三世书.</p>'; }
}

// 河洛理数 — bát tự → 本命卦 + 元堂 + 后天卦 + 卦辞/爻辞
function renderHeluo(R) {
  const el = $('heluo');
  if (!el) return;
  try {
    const h = heluo(R);
    if (!h || !h.ok) { el.innerHTML = '<p class="hint">Không tính được 河洛理数.</p>'; return; }
    // vẽ 6 hào (từ dưới lên); hiển thị thượng trên, hạ dưới
    const lines = h.hexagram.lines; // [h1..h6]
    const yaoHtml = [...lines].reverse().map((l, i) => {
      const lineNo = 6 - i; // vị trí hào (1-6)
      const isYuantang = lineNo === h.yuantang.line;
      const bar = l === 1 ? '▅▅▅▅▅' : '▅▅　▅▅';
      const yinYang = l === 1 ? '阳' : '阴';
      return `<div class="cg-breakdown" style="${isYuantang ? 'background:rgba(255,193,7,.18);border-left:3px solid #ffc107;padding:2px 6px' : ''}">
        <span class="zh">${bar}</span>
        <b>${yinYang}</b> ${lineNo === 6 ? '上爻' : lineNo === 1 ? '初爻' : lineNo + '爻'}
        ${isYuantang ? `<span class="ln-rate rate-mid"><b>元堂</b></span>` : ''}
      </div>`;
    }).join('');
    const swap = (h.yinNan || h.yangNu) ? '阴男/阳女 → 地上天' : '阳男/阴女 → 天上地';
    el.innerHTML = `
      <div class="cg-head">
        <div class="cg-total"><span class="zh big">#${h.hexagram.num} ${h.hexagram.name}</span> <span class="hint-inline">(${esc(h.hexagram.nameVi)})</span></div>
      </div>
      <p class="cg-breakdown hint">天数 <b>${h.tianRaw}</b>→<b>${h.tianShu}</b> (${h.tianTrigram}) · 地数 <b>${h.diRaw}</b>→<b>${h.diShu}</b> (${h.diTrigram}) · ${swap} · 三元 ${esc(h.yuan)}</p>
      <div style="display:grid;grid-template-columns:auto 1fr;gap:4px 12px;max-width:260px;margin:6px 0">${yaoHtml}</div>
      <p class="cg-interp"><b>本命卦:</b> ${h.upperTrigram}上${h.lowerTrigram}下 = <b>${h.hexagram.name} (${esc(h.hexagram.nameVi)})</b>. 元堂 tại <b>hào ${h.yuantang.line}</b> (${esc(h.yuantang.lineVi)}, giờ ${h.yuantang.hourZhi}).</p>
      <p class="cg-interp"><b>后天卦:</b> #${h.houtianHexagram.num} ${h.houtianHexagram.name} (${esc(h.houtianHexagram.nameVi)})${h.yuantang.disputed ? ' <span class="ln-rate rate-hung">⚠ 元堂 DISPUTED</span>' : ''}</p>
      <div class="verse-box"><div class="verse-zh">${esc(h.reading.hexagramText)}</div></div>
      <p class="cg-interp"><b>爻辞 (hào ${h.yuantang.line}):</b> ${esc(h.reading.yuantangLineText)}</p>
      ${h.reading.houtianHexagramText ? `<p class="cg-interp"><b>后天卦辞:</b> ${esc(h.reading.houtianHexagramText)}</p>` : ''}
      <p class="hint" style="margin-top:6px">河洛理数 (陈抟) — chuyển bát tự sang quẻ 周易 đọc mệnh. Thuật toán 飞支 (三才发秘). ${h.yuantang.disputed ? 'Quẻ N=6 (乾/坤) cổ thư chia theo giới+đông/hạ chí — kết quả nên review thủ công.' : ''}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được 河洛理数.</p>'; }
}

function renderYizhangjing(R) {
  const el = $('yizhangjing');
  if (!el) return;
  try {
    const yz = yizhangjingCast(R);
    el.innerHTML = renderYizhangjingCard(yz);
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được 一掌经.</p>'; }
}

function renderStarPower(R) {
  const el = $('starpower');
  if (!el) return;
  try {
    const sp = starPower(R);
    const tone = (v) => v === '有力' ? 'cat' : v === '藏而不透' ? 'mid' : 'hung';
    el.innerHTML = sp.items.map((x) => `
      <div class="sp-item">
        <div class="sp-star">${x.starVi} <span class="${wxClass(x.wx)}">${x.wxVi}</span></div>
        <div class="sp-area hint">${x.area}</div>
        <div class="sp-verdict ${tone(x.verdict)}">${x.verdict} <span class="hint">(căn ${x.root}, lộ ${x.reveal}, mùa ${x.season})</span></div>
        <div class="sp-vi hint">${esc(x.verdictVi || '')}</div>
      </div>`).join('') + `<p class="hint" style="margin-top:6px">${sp.summary}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được sao trọng điểm.</p>'; }
}

function renderDirectionTaboo() {
  const el = $('dir-taboo');
  if (!el) return;
  try {
    const ov = annualTabooOverview(new Date().getFullYear());
    const tone = (r) => r.maxSeverity >= 4 ? 'hung' : r.taboos.length ? 'mid' : 'cat';
    el.innerHTML = `<p class="hint">Năm ${ov.year}: hướng SẠCH (không phạm sát lớn) <b>${ov.clean.join(', ') || '(không)'}</b>; hướng KỴ ${ov.worst.length ? ov.worst.join(', ') : '(không)'}.</p>` +
      `<div class="dir-grid" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${ov.results.map((r) => `
        <div class="ln ${tone(r)}" title="${r.taboos.map((t) => t.type).join(', ') || 'sạch'}">
          <div class="ln-year">${r.dir}</div>
          <div class="ln-rate ${tone(r)}">${r.maxSeverity >= 4 ? 'KỴ' : r.taboos.length ? '⚠' : 'Thuận'}</div>
        </div>`).join('')}</div>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được sát phương.</p>'; }
}

function renderWaterActivation() {
  const el = $('water-activation');
  if (!el) return;
  try {
    const year = new Date().getFullYear();
    const r = waterActivation(year);
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const row = (label, x, tone, mark) => {
      if (!x || !x.dir) {
        return `<div class="ln" title="${esc(x && x.note)}">
          <div class="ln-year">${esc(label)}</div>
          <div class="ln-rate">${esc(x && x.starName ? x.starName : '—')} ${esc(x && x.dir ? '' : '(trung cung)')}</div>
          <div class="ln-flags">${esc(x && x.action ? x.action.slice(0, 70) : '')}…</div>
        </div>`;
      }
      return `<div class="ln ${tone}" title="${esc(x.note)}">
        <div class="ln-year">${esc(label)}</div>
        <div class="ln-rate ${tone}">${mark}</div>
        <div class="ln-gz">${esc(x.starName)} → ${esc(x.dir)}</div>
        <div class="ln-flags">${esc(x.waterTypeVi || '')}</div>
      </div>`;
    };
    const avoidRow = (x) => `<div class="ln hung" title="${esc(x.reason)}">
      <div class="ln-year">${esc(x.starName)}</div>
      <div class="ln-rate hung">KỴ nước</div>
      <div class="ln-gz">${esc(x.dir)}</div>
      <div class="ln-flags">${esc(x.starName)} ${esc(x.dir)}</div>
    </div>`;
    const parts = [];
    parts.push(`<p class="hint"><b>Năm ${year}</b> · 运 ${r.yun} (正神=${esc(r.yunInfo.zheng)} / 零神=${esc(r.yunInfo.ling)}). ${esc(r.summary)}</p>`);
    parts.push(`<div class="ln-decade" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">`);
    parts.push(row('★ TÀI (零神)', r.primaryWealth, 'cat', '★'));
    parts.push(row('Duyên (一白)', r.romanceWater, 'cat', '♥'));
    parts.push(row('Tài ổn (八白)', r.stabilityWater, 'cat', '💰'));
    parts.push(row('Khánh (九紫)', r.celebrationWater, 'cat', '🎉'));
    parts.push(row('Quý (六白)', r.authorityWater, 'cat', '⭐'));
    r.avoidWater.forEach((x) => parts.push(avoidRow(x)));
    parts.push(`</div>`);
    if (r.saltCleanse) {
      parts.push(`<p class="hint" style="margin-top:6px">🧂 <b>Muối tiêu hoá 5黄</b>: ${esc(r.saltCleanse.note)}</p>`);
    }
    parts.push(`<details class="syn-factors" style="margin-top:6px"><summary>Loại nước & nguyên lý</summary>` +
      `<p class="hint">Nước <b>động</b> (đài phun/hồ cá) kéo khí → dùng cho cát tinh tài/quý (6/8/9). Nước <b>tĩnh</b> (ly nước) dưỡng khí → dùng cho 一白 đào hoa (1) / Văn Xương (4). ` +
      `Nước <b>muối</b> (muối thô + đồng tiền) đặt hướng 5黄 để <i>tiêu hoá</i> hung sát (không phải kích hoạt). ` +
      `Hung tinh Thổ (2/5) kỵ nước động/tĩnh — nước phong thổ tăng bệnh/hoạ.</p></details>`);
    el.innerHTML = parts.join('');
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được thủy pháp.</p>'; }
}

function renderMarriageTiming(R) {
  const el = $('marriage-timing');
  if (!el) return;
  try {
    const mt = scanMarriageTiming(R, new Date().getFullYear(), 12);
    const tone = (y) => y.score >= 4 ? 'cat' : y.score >= 2 ? 'mid' : '';
    el.innerHTML = (mt.topMarriage.length ? `<p class="hint">💍 Năm <b>HÔN NHÂN</b>: ${mt.topMarriage.map((y) => y.year + '(' + y.ganZhi + ')').join(', ')}</p>` : '<p class="hint">12 năm tới chưa có năm hôn nhân mạnh (≥4đ).</p>') +
      (mt.years.length ? `<div class="ln-decade" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${mt.years.map((y) => `
        <div class="ln ${tone(y)}" title="${y.signals.join('; ')}">
          <div class="ln-year">${y.year}</div>
          <div class="ln-gz">${y.ganZhi}</div>
          <div class="ln-rate ${tone(y)}">${y.type}</div>
          <div class="ln-flags">${'★'.repeat(Math.min(y.score, 5))}</div>
        </div>`).join('')}</div>` : '<p class="hint">Không có năm kích hoạt婚恋 nổi bật.</p>');
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được hôn/luyên ứng kỳ.</p>'; }
}

function renderIdealHouse(R) {
  const el = $('ideal-house');
  if (!el) return;
  try {
    const h = idealHouse(R, 20);
    el.innerHTML = `<p class="hint">${h.grpVi} ${h.gua}. Hướng cát tốt nhất: <b>${h.bestFacing ? h.bestFacing.dir + ' (' + h.bestFacing.star.split(' (')[0] + ')' : '?'}</b>.</p>` +
      `<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:6px">
        <div><b style="color:var(--cat,#2a7)">Tầng TỐT</b>: ${h.idealFloors.map((f) => 'T' + f.floor).join(', ')}</div>
        <div><b style="color:var(--hung,#c33)">Tầng TRÁNH</b>: ${h.avoidFloors.map((f) => 'T' + f.floor).join(', ')}</div>
      </div>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được lý tưởng nhà.</p>'; }
}

function renderWealthCareer(R) {
  const el = $('wealth-career');
  if (!el) return;
  try {
    const wc = scanWealthCareerYingqi(R, new Date().getFullYear(), 12);
    const statusTone = (s) => s === '有力' ? 'cat' : (s === '藏而不透' || s === '虚浮' || s === '虚') ? 'mid' : '';
    el.innerHTML = `
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:6px">
        <div>💰 <b>Tài (${wc.caiWx})</b> <span class="${statusTone(wc.caiStatus)}">${wc.caiStatus || '?'}</span> → kích hoạt: <b>${wc.caiYears.length ? wc.caiYears.map((y) => y.year).join(', ') : '(không)'}</b></div>
        <div>🎯 <b>Quan (${wc.guanWx})</b> <span class="${statusTone(wc.guanStatus)}">${wc.guanStatus || '?'}</span> → kích hoạt: <b>${wc.guanYears.length ? wc.guanYears.map((y) => y.year).join(', ') : '(không)'}</b></div>
      </div>
      <p class="hint">${wc.summary}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được Tài/Quan ứng kỳ.</p>'; }
}

function renderDominantGod(R) {
  const el = $('dominant-god');
  if (!el) return;
  try {
    const dg = dominantGod(R);
    const t = dg.tendency;
    el.innerHTML = `
      <p><b>Sao chủ đạo: ${dg.dominant.godVi}</b> (điểm ${dg.dominant.score})${dg.subDominant ? `, phụ ${dg.subDominant.godVi} (${dg.subDominant.score})` : ''} — <span class="${dg.favor === 'dung' ? 'cat' : dg.favor === 'ji' ? 'hung' : ''}">${dg.favorVi.split(' — ')[0]}</span></p>
      <p class="hint">Tuýp: ${t.traits}</p>
      <p class="hint">Nghề hợp: ${t.career} · Động lực: ${t.drive}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được thập thần chủ đạo.</p>'; }
}

function renderYanQin(R) {
  const el = $('yanqin');
  if (!el) return;
  try {
    const yq = analyzeYanQin(R);
    const bm = yq.benMing;
    el.innerHTML = `
      <p><b>Bản mệnh HÀM: ${bm.qin}</b> (${bm.animal}, hành ${bm.wx}) — ${bm.nature}</p>
      <p class="hint">Hôm nay: ${yq.today.qin} (${yq.today.animal}) → ${yq.relVi}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được bản mệnh hàm.</p>'; }
}

// ---------------------------------------------------------------- SỨC KHOẺ NGŨ HÀNH 五行健康
function renderHealth(R) {
  const el = $('health-out');
  if (!el) return;
  try {
    const h = analyzeHealth(R);
    const organ = (o) => o ? `<div class="yz-row" style="border-left:3px solid var(--gold);padding-left:8px;margin:3px 0">
      <b>${esc(o.vi)} (${esc(o.wx)})${o.pct ? ' — ' + esc(o.pct) + '%' : ''}</b> · ${esc(o.organs || '')}<br>
      <span class="hint">⚠ Dễ yếu: ${esc(o.risk || '')}</span><br>
      <span class="hint">食疗 bổ: ${esc(o.foods || '')}</span>
    </div>` : '';
    el.innerHTML = `
      <p class="hint">${esc(h.profile || '')}</p>
      <h4 class="syn-h4" style="margin-top:6px">🔴 Hành yếu nhất (tạng dễ bệnh)</h4>
      ${organ(h.weakest)}
      <h4 class="syn-h4" style="margin-top:6px">🟢 Hành mạnh nhất (tạng vượng)</h4>
      ${organ(h.strongest)}
      ${h.constitution ? `<h4 class="syn-h4" style="margin-top:6px">Thể chất ${esc(h.constitutionVi || '')}</h4><p class="hint">${esc(h.constitution)}</p>` : ''}
      ${h.remedyFoods ? `<div class="tiaohou-note"><b>Thực phẩm chữa lành (hành ${esc(h.remedyVi || '')}):</b> ${esc(h.remedyFoods)}</div>` : ''}
      ${h.riskSeason ? `<p class="hint">📅 Mùa phòng bệnh: ${esc(h.riskSeason)}</p>` : ''}
      ${h.organRisk ? `<p class="hint">${esc(h.organRisk)}</p>` : ''}
      ${Array.isArray(h.advice) && h.advice.length ? `<p class="hint" style="margin-top:6px">💡 ${h.advice.map((a) => esc(a)).join('<br>💡 ')}</p>` : (h.advice ? `<p class="hint">${esc(h.advice)}</p>` : '')}
      <h4 class="syn-h4" style="margin-top:10px">📅 Năm cần chú ý sức khoẻ (5 năm tới)</h4>
      ${(() => { try { const ha = healthAlertScan(R, 5); return (ha.alerts||[]).map((a) => `<div class="yz-row" style="border-left:3px solid ${a.level && a.level.includes('CAO') ? 'var(--cinnabar)' : 'var(--gold)'};margin:3px 0;padding-left:8px"><b>${a.year}</b> <span class="zh">${esc(a.ganZhi||'')}</span> <span class="ln-rate ${a.level && a.level.includes('CAO') ? 'rate-hung' : 'rate-bad'}">${esc(a.level||'')}</span><div class="hint">${(a.reasons||[]).map(esc).join('; ').slice(0,120)}</div></div>`).join('') || '<p class="hint">5 năm tới không có năm cảnh báo y tế nặng.</p>'; } catch(_) { return ''; } })()}`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được sức khoẻ ngũ hành.</p>'; }
}

function renderQinxing(R) {
  const el = $('qinxing');
  if (!el) return;
  try {
    const ov = qinxingOverview(R);
    const a = ov.annual;
    const toneCls = ov.tone === 'cat' ? 'cat' : ov.tone === 'hung' ? 'hung' : '';
    const cycle = qinxingCycle(ov.scanYear, 5);
    el.innerHTML = `
      <p>Năm ${a.year}: <b>${a.bird}</b> (${a.animal}, hành ${a.element}) trụ trị — ${a.nature}</p>
      <p>Bản mệnh ${ov.benMing ? ov.benMing.qin + ' (hành ' + a.element + ')' : '(?)'} → <span class="${toneCls}"><b>${ov.toneVi}</b></span> — ${ov.relVi}</p>
      <p class="hint">${ov.advice}</p>
      <p class="hint">Chu kỳ 28 năm quanh đây: ${cycle.map((c) => c.year + '=' + c.bird.split(/[^一-龥]/)[0]).join(' · ')}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được禽星 năm.</p>'; }
}

function renderTongGen(R) {
  const el = $('tonggen');
  if (!el) return;
  try {
    const tg = analyzeTongGen(R);
    const d = tg.dung;
    const tone = d.verdict === '有力' ? 'cat' : (d.verdict === '虚浮' || d.verdict === '虚') ? 'hung' : 'mid';
    // [loop 108 elevate] 敌我力量 bar — Dụng/Hỷ (ally) vs Kỵ/Thù (enemy), core 命局 tension
    const yong = R.yong || {};
    const sc = R.wx.score || {};
    const ally = (sc[yong.primary] || 0) + (sc[yong.xi] || 0);
    const enemy = (sc[yong.ji] || 0) + (sc[yong.chou] || 0);
    const sum = ally + enemy || 1;
    const allyPct = Math.round((ally / sum) * 100);
    const enemyPct = 100 - allyPct;
    const lead = allyPct >= 55 ? '✓ DỤNG THẦN chiếm ưu thế — mệnh thuận, chủ động' : allyPct <= 45 ? '⚠ KỴ THẦN lấn át — Dụng yếu, cần bù + đợi vận Dụng' : '⚖ Cân bằng — Dụng/Kỵ ngang nhau';
    const forceBar = `
      <div style="margin:8px 0">
        <div style="display:flex;height:22px;border-radius:4px;overflow:hidden;border:1px solid rgba(212,175,55,0.3)">
          <div style="width:${allyPct}%;background:#2e9e5b;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:600">Dụng+Hỷ ${allyPct}%</div>
          <div style="width:${enemyPct}%;background:#e0533d;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:600">Kỵ+Thù ${enemyPct}%</div>
        </div>
        <p class="hint">${esc(lead)}</p>
      </div>`;
    el.innerHTML = `
      <p>Dụng <b>${d.wxVi}</b>: <span class="${tone}"><b>${d.verdict}</b></span> (căn ${d.root.total}, lộ ${d.reveal.length}, mùa ${d.seasonVi}) — ${d.verdictVi}</p>
      ${forceBar}
      ${d.verdict === '藏而不透' ? `<p class="hint">⏳ Đợi lưu niên can ${tg.whenReveal.join('/')} thấu ra mới phát Dụng.</p>` : ''}
      <p class="hint">Nhật Chủ ${tg.dm.wxVi}: ${tg.dm.verdict} (${tg.dm.seasonVi}).</p>
      ${(d.root.roots && d.root.roots.length) || (tg.dm.root && tg.dm.root.roots && tg.dm.root.roots.length) ? `<details style="margin:4px 0"><summary class="hint">🔍 Chi tiết thông căn (trụ nào có gốc)</summary>
        ${d.root.roots && d.root.roots.length ? `<p class="hint"><b>Dụng ${d.wxVi} căn tại:</b> ${d.root.roots.map((r) => `${esc(r.vi)}(${esc(r.zhi)}=${esc(r.stem)},${esc(r.pos)},${r.weight})`).join('; ')}.</p>` : ''}
        ${tg.dm.root && tg.dm.root.roots && tg.dm.root.roots.length ? `<p class="hint"><b>Nhật Chủ căn tại:</b> ${tg.dm.root.roots.map((r) => `${esc(r.vi)}(${esc(r.zhi)}=${esc(r.stem)},${esc(r.pos)},${r.weight})`).join('; ')}.</p>` : ''}
      </details>` : ''}`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được thông căn thấu cán.</p>'; }
}

function renderMissingGod(R) {
  const el = $('missing-god');
  if (!el) return;
  try {
    const mg = missingGod(R);
    const tone = (status) => status === 'lacking' ? 'hung' : status === 'partial' ? 'mid' : 'cat';
    el.innerHTML = Object.values(mg.categories).map((c) => `
      <div class="sp-item">
        <div class="sp-star">${c.vi.split(' (')[0]} <span class="${tone(c.status)}">${c.status === 'lacking' ? 'KHUYẾT' : c.status === 'partial' ? 'THIẾU' : 'đủ'}</span></div>
        <div class="sp-area hint">${c.area}</div>
      </div>`).join('') + `<p class="hint" style="margin-top:6px">${mg.summary}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được khuyết thập thần.</p>'; }
}

function renderSanyuan(R) {
  const el = $('sanyuan');
  if (!el) return;
  try {
    const s = sanyuanJiuyun(R, new Date().getFullYear());
    el.innerHTML = `
      <p><b>${s.yun.starVi} · ${s.yun.trig} · ${s.yun.wxVi}</b> (${s.yun.yuan}, ${s.yun.start}-${s.yun.end})</p>
      <p class="hint">正神=${s.zhengShen} · 零神=${s.lingShen}</p>
      <p class="hint">${s.align}</p>
      ${s.detail ? `<details style="margin:6px 0"><summary class="hint">📋 Chi tiết kỷ nguyên ${s.yun.starVi} (${s.yun.start}-${s.yun.end})</summary>
        ${s.detail.industriesWang ? `<p class="hint"><b>🔥 Ngành vượng:</b> ${esc(s.detail.industriesWang.join(', '))}</p>` : ''}
        ${s.detail.industriesSuy ? `<p class="hint"><b>📉 Ngành suy:</b> ${esc(s.detail.industriesSuy.join(', '))}</p>` : ''}
        ${s.detail.health ? `<p class="hint"><b>🏥 Sức khoẻ:</b> ${esc(s.detail.health)}</p>` : ''}
        ${s.detail.society ? `<p class="hint"><b>🌐 Xã hội:</b> ${esc(s.detail.society)}</p>` : ''}
        ${s.detail.layout ? `<p class="hint"><b>🧭 Bố trí:</b> ${s.detail.layout.map(esc).join(' · ')}</p>` : ''}
      </details>` : ''}`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được tam nguyên cửu vận.</p>'; }
}

function renderKu(R) {
  const el = $('ku');
  if (!el) return;
  try {
    const k = analyzeKu(R, new Date().getFullYear());
    // [loop 192] hiển thị kho (库) + trạng thái + khi nào mở/khóa (trước đây chỉ show summary)
    const cur = (k.kuInChart || []).map((u) => {
      const cls = (u.state || '').includes('open') || (u.stateShort || '').includes('开') ? 'rate-cat' : 'rate-hung';
      return `<div class="yz-row" style="border-left:3px solid var(--gold);padding-left:8px;margin:3px 0">
        <b>${esc(u.vi || '')} <span class="zh">${esc(u.zhi || '')}</span></b> (${esc(u.zhiVi || '')}) — chứa ${esc(u.storeVi || '')} · <span class="ln-rate ${cls}">${esc(u.stateVi || u.stateShort || u.state || '')}</span></div>`;
    }).join('');
    const yrRow = (y) => y ? `<div class="yz-row" style="margin:3px 0;padding-left:8px;border-left:3px solid ${y.action && /mở|open/i.test(y.action) ? 'var(--jade)' : 'var(--cinnabar)'}">
      <b>${esc(String(y.year || ''))}</b> <span class="zh">${esc(y.ganZhi || '')}</span> — ${esc(y.action || '')}</div>` : '';
    const opens = (k.openYears || []).slice(0, 4).map(yrRow).join('');
    const closes = (k.closedYears || []).slice(0, 3).map(yrRow).join('');
    el.innerHTML = `
      ${cur || '<p class="hint">Không có trụ kho (辰戌丑未) trong lá số.</p>'}
      ${opens ? `<h4 class="syn-h4" style="margin-top:6px">🔓 Năm KHO MỞ (tài/sự được phát)</h4>${opens}` : ''}
      ${closes ? `<h4 class="syn-h4" style="margin-top:6px">🔒 Năm kho khép (tài/sự tạm trữ)</h4>${closes}` : ''}
      <p class="hint" style="margin-top:4px">${esc(k.summary || '')}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được kho mở/khóa.</p>'; }
}

function renderFuyin(R) {
  const el = $('fuyin');
  if (!el) return;
  try {
    // [loop 193] quét 12 năm tới — tìm các năm 伏吟/反吟 (biến cố lớn) thay vì chỉ năm hiện tại
    const cur = new Date().getFullYear();
    const hits = [];
    for (let yr = cur; yr < cur + 12; yr++) {
      const f = scanFuyin(R, yr);
      if (f.hasFuyin || f.hasFanyin) hits.push(f);
    }
    const rows = hits.map((f) => {
      const isFanyin = f.hasFanyin;
      const cls = isFanyin ? 'rate-hung' : 'rate-bad';
      const items = (f.items || []).map((it) => `<div class="yz-row" style="margin:3px 0;padding-left:8px;border-left:3px solid ${isFanyin ? 'var(--cinnabar)' : 'var(--gold)'}">
        <span class="ln-rate ${cls}">${esc(it.typeVi || it.type || '')} ${esc(it.pillarVi || '')}</span> <span class="hint">(${esc(it.qin || '')})</span>
        <div class="hint">${esc((it.meaning || '').slice(0, 110))}</div></div>`).join('');
      return `<b>${esc(String(f.year))}</b> <span class="zh">${esc(f.ganZhi || '')}</span>${items}`;
    }).join('');
    el.innerHTML = rows
      ? `<p class="hint">伏吟/反吟 (渊海子平 «反吟伏吟泪淋淋») — năm can-chi trùng/trái 1 trụ nguyên cục = năm BIẾN CỐ lớn. Các năm đáng chú ý 12 năm tới:</p>${rows}`
      : `<p class="hint">12 năm tới không có năm phạm 伏吟/反吟 (tương đối ổn định theo tiêu chí này).</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được phục/phan ngâm.</p>'; }
}

function renderDayunChangSheng(R) {
  const el = $('dayun-changsheng');
  if (!el) return;
  try {
    const t = dayunChangSheng(R.chart.dayGan, R.dayun);
    const TONE_COLOR = { cat: '#2e9e5b', hung: '#e0533d', neutral: '#caa14a' };
    const TONE_ICON = { cat: '▲', hung: '▼', neutral: '◆' };
    const rows = t.items.map((i) => {
      const c = TONE_COLOR[i.tone];
      return `<div class="yz-row" style="border-left:3px solid ${c};padding-left:8px;margin:3px 0">
        <b>${i.startAge}–${i.startAge + 9}t</b> ${i.ganZhi}
        <span style="color:${c};font-weight:600">${TONE_ICON[i.tone]} ${i.stageVi}</span>
        <span class="hint">— ${i.desc}</span>
      </div>`;
    }).join('');
    el.innerHTML = `<p class="hint">Sinh khí Nhật Chủ qua 12 giai đoạn (dương can thuận / âm can nghịch hành). «运好不如运旺».</p>${rows}<p style="margin-top:6px">${t.summary}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được đại vận trường sinh.</p>'; }
}

function renderDayunYongChangSheng(R) {
  const el = $('dayun-yong-changsheng');
  if (!el) return;
  try {
    const t = dayunYongChangSheng(R.yong.primary, R.yong.xi, R.dayun);
    const STRONG = new Set(['長生', '冠帶', '臨官', '帝旺']);
    const WEAK = new Set(['死', '墓', '絕']);
    const rows = t.items.map((i) => {
      const c = STRONG.has(i.stage) ? '#2e9e5b' : WEAK.has(i.stage) ? '#e0533d' : '#caa14a';
      const mark = STRONG.has(i.stage) ? '★Dụng vượng' : WEAK.has(i.stage) ? '⚠Dụng suy' : '';
      return `<div class="yz-row" style="border-left:3px solid ${c};padding-left:8px;margin:3px 0">
        <b>${i.startAge}–${i.startAge + 9}t</b> ${i.ganZhi}
        <span style="color:${c};font-weight:600">${i.stageVi}</span>${mark ? ` <span class="hint">${mark}</span>` : ''}
      </div>`;
    }).join('');
    el.innerHTML = `<p class="hint">Sinh khí của <b>Dụng Thần (${t.yongWx})</b> qua đại vận. «用神旺相, 其福必厚» — vận Dụng vượng = vận thật sự tốt (khác Nhật Chủ: đây là khí của hành giúp mệnh).</p>${rows}<p style="margin-top:6px">${t.summary}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được Dụng thần trường sinh.</p>'; }
}

function renderLiunianChangSheng(R) {
  const el = $('liunian-changsheng');
  if (!el) return;
  try {
    const t = liunianChangSheng(R.chart.dayGan, R.liunian);
    const TONE_COLOR = { cat: '#2e9e5b', hung: '#e0533d', neutral: '#caa14a' };
    const TONE_ICON = { cat: '▲', hung: '▼', neutral: '◆' };
    const rows = t.items.map((i) => {
      const c = TONE_COLOR[i.tone];
      const now = i.isNow ? 'box-shadow:0 0 0 2px #d4af37' : '';
      return `<div class="yz-row" style="border-left:3px solid ${c};padding-left:8px;margin:3px 0;${now}">
        <b>${i.year}</b> ${i.ganZhi}${i.isNow ? ' <span style="color:#d4af37">★năm nay</span>' : ''}
        <span style="color:${c};font-weight:600">${TONE_ICON[i.tone]} ${i.stageVi}</span>
      </div>`;
    }).join('');
    el.innerHTML = `<p class="hint">Sinh khí TỪNG NĂM của đại vận đang hành. «年逢长生如春起, 年逢帝旺如日中天, 年逢墓绝如秋冬».</p>${rows}<p style="margin-top:6px">${t.summary}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được lưu niên trường sinh.</p>'; }
}

function renderLiuyueChangSheng(R) {
  const el = $('liuyue-changsheng');
  if (!el) return;
  try {
    const t = liuyueChangSheng(R.chart.dayGan);
    const TONE_COLOR = { cat: '#2e9e5b', hung: '#e0533d', neutral: '#caa14a' };
    const TONE_ICON = { cat: '▲', hung: '▼', neutral: '◆' };
    const rows = t.items.map((i) => {
      const c = TONE_COLOR[i.tone];
      return `<div class="yz-row" style="border-left:3px solid ${c};padding-left:8px;margin:3px 0;display:inline-block;width:auto;margin-right:4px">
        <b>${i.mLabel}</b> <span style="color:${c};font-weight:600">${TONE_ICON[i.tone]} ${i.stageVi}</span>
      </div>`;
    }).join('');
    el.innerHTML = `<p class="hint">Nhịp năng lượng 12 tháng (tiết khí) của Nhật Chủ — «lịch cá nhân»: tháng mạnh nên tiến thủ, tháng yếu nên thủ.</p>${rows}<p style="margin-top:6px">${t.summary}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được lưu月 trường sinh.</p>'; }
}

function renderZiweiDeep(R) {
  const el = $('ziwei-deep');
  if (!el) return;
  try {
    const inp = R.chart.input;
    const zr = computeZiwei(inp.year, inp.month, inp.day, inp.hour, inp.minute, inp.gender);
    const bw = analyzeZiweiBrightness(zr);
    const aux = computeAuxStars(R.chart.pillars.year.gan, R.chart.pillars.year.zhi, zr.birth.lunarMonth, zr.birth.timeZhi);
    const gj = analyzeZiweiGeju(zr, bw, aux);
    const sx = analyzeShuangXing(zr);
    el.innerHTML = `
      <p><b>Cục hình:</b> ${gj.matched.length ? gj.matched.map((m) => m.name).join(', ') : '(không nổi)'} — ${gj.matched[0]?.meaning.slice(0, 80) || gj.summary.slice(0, 80)}</p>
      <p class="hint"><b>Song tinh:</b> ${sx.shuangXing.length ? sx.shuangXing.map((x) => `${x.palaceShort}:${x.meaning.combo}`).join(', ') : '(độc toạ)'}</p>
      <p class="hint"><b>Độ sáng:</b> ${bw.strong.length} miếu/vượng, ${bw.weak.length} hãm/nhàn — Mệnh ${bw.mingStars.length ? bw.mingStars.map((s) => s.star + '=' + s.vi).join(', ') + ' → ' + (bw.mingStars[0].score >= 1.5 ? 'sao MỆNH SÁNG' : bw.mingStars[0].score <= -1 ? 'sao mệnh hãm' : 'trung bình') : '?'}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được Tử Vi sâu.</p>'; }
}

function renderTaisuiGeneral(R) {
  const el = $('taisui-general');
  if (!el) return;
  try {
    const ov = taiSuiOverview(R, new Date().getFullYear());
    el.innerHTML = `
      <p>Trị niên <b>${ov.current.ganZhi}</b> = <b>${ov.current.name}</b> (vị ${ov.current.index}/60). ${ov.current.note}</p>
      ${ov.isBenMingYear ? '<div class="tiaohou-note" style="border-color:var(--cinnabar)"><b>⚠ NĂM THÂN (本命年):</b> Chi năm = chi tuổi sinh → năm biến động lớn, cổ khuyên «犯太岁» → hóa giải (佩生肖 tam hợp, tránh động thổ phương TS, tích đức).</div>' : ''}
      <p class="hint">Bản mệnh TS (năm sinh ${ov.natal.ganZhi}) = ${ov.natal.name}${ov.natal.note ? ' — ' + esc(ov.natal.note) : ''}.</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được 60 thái tuế.</p>'; }
}

function renderTaohua(R) {
  const el = $('taohua');
  if (!el) return;
  try {
    const th = analyzeTaohua(R);
    const tone = th.verdict === '正桃花' ? 'cat' : th.verdict === '烂桃花' ? 'hung' : 'mid';
    el.innerHTML = `
      <p>Đào hoa <b>${th.taohuaZhi}</b> tại ${th.positions.map((p) => p.vi).join(', ')} → <span class="${tone}"><b>${th.verdictVi.split(' — ')[0]}</b></span> (score ${th.score})</p>
      <p class="hint">${th.flags.map((f) => f.typeVi + '(' + (f.tone === 'cat' ? 'cát' : 'hung') + ')').join(', ') || 'không có flag'}</p>
      <p class="hint">${th.summary}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được đào hoa.</p>'; }
}

function renderRemedyLaws(R) {
  const el = $('remedy-laws');
  if (!el) return;
  try {
    const rm = buildRemedy(R);
    el.innerHTML = `
      <p class="hint">${rm.byElement.summary}</p>
      <p class="hint"><b>12 pháp cải vận (chính):</b></p>
      <ul class="hint" style="margin:4px 0 4px 16px">${rm.twelveLaws.map((l) => `<li>${l}</li>`).join('')}</ul>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được cải vận.</p>'; }
}

function renderStrength3Fa(R) {
  const el = $('strength-3fa');
  if (!el) return;
  try {
    const s = strength3Fa(R);
    const ratio = R.strength?.ratio || 0.5;
    const pct = Math.round(ratio * 100);
    const strong = R.strength?.strong;
    const spectrum = `
      <div style="margin:8px 0">
        <div style="position:relative;height:22px;border-radius:4px;background:linear-gradient(90deg,#e0533d 0%,#e0533d 25%,#caa14a 40%,#caa14a 60%,#2e9e5b 75%,#2e9e5b 100%)">
          <div style="position:absolute;left:${pct}%;top:-3px;transform:translateX(-50%);width:4px;height:28px;background:#d4af55;border-radius:2px;box-shadow:0 0 6px rgba(212,175,85,0.9)"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--silk);margin-top:2px">
          <span>極弱</span><span>身弱</span><span style="color:#d4af55;font-weight:700">${strong ? '身VƯỢNG' : '身NHƯỢC'} ${pct}%</span><span>身強</span><span>極強</span>
        </div>
      </div>`;
    el.innerHTML = `${spectrum}<p>${s.summary}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được 3 pháp vượng suy.</p>'; }
}

function renderJiaoyun(R) {
  const el = $('jiaoyun');
  if (!el) return;
  try {
    const j = jiaoYunAnalysis(R);
    // [loop 189] hiển thị chi tiết giao vận (trước đây chỉ show summary)
    const cur = j.current ? `<div class="yz-row" style="border-left:3px solid var(--gold);padding-left:8px;margin:4px 0">
      <b>Đại vận HIỆN TẠI:</b> <span class="zh">${esc(j.current.ganZhi || '')}</span> (${esc(String(j.current.age ?? ''))}–${esc(String((j.current.age || 0) + 9))}t)
      ${j.current.rating ? ' · <b>' + esc(j.current.rating) + '</b>' : ''}</div>` : '';
    const next = j.next ? `<div class="yz-row" style="border-left:3px solid var(--cinnabar);padding-left:8px;margin:4px 0">
      <b>Đại运 TIẾP THEO:</b> <span class="zh">${esc(j.next.ganZhi || '')}</span> (từ ${esc(String(j.next.age ?? ''))}t)${j.daysUntil != null ? ` — còn <b>${esc(String(j.daysUntil))} ngày</b> nữa giao vận` : ''}
      ${j.next.rating ? ' · <b>' + esc(j.next.rating) + '</b>' : ''}</div>` : '';
    const avoidStr = Array.isArray(j.avoidZhi) ? j.avoidZhi.join(', ') : (j.avoidZhi || '');
    const extras = (j.dungDir || avoidStr) ? `<p class="hint">${j.dungDir ? '🧭 Hướng Dụng: ' + esc(j.dungDir) + '.' : ''}${avoidStr ? ' ⚠ Tránh chi: ' + esc(avoidStr) + '.' : ''}</p>` : '';
    // [loop 262] 起运 date + full transitions list (trước đây ẩn)
    const qiyunTxt = j.qiyunDate ? new Date(j.qiyunDate).toLocaleDateString('vi-VN') : '';
    const qiyunHtml = qiyunTxt ? `<p class="hint">⚡ <b>Khởi vận:</b> ${esc(qiyunTxt)} (tuổi ${esc(String(j.current ? j.current.index : ''))}${j.isForward ? ', thuận hành' : ', nghịch hành'})</p>` : '';
    const transList = (j.transitions || []).length
      ? `<details style="margin:4px 0"><summary class="hint">📋 Toàn bộ đại vận (${(j.transitions||[]).length} thập niên)</summary><ul class="hint" style="margin:4px 0 4px 16px">${(j.transitions||[]).map((t) => `<li><b>${t.age}–${t.age+9}t</b> <span class="zh">${esc(t.ganZhi||'')}</span>${t.rating ? ' — '+esc(t.rating) : ''}</li>`).join('')}</ul></details>` : '';
    el.innerHTML = `${qiyunHtml}${cur}${next}${extras}${transList}<p class="hint" style="margin-top:4px">${esc(j.summary || '')}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được giao thời đại vận.</p>'; }
}

function renderPillarQuality(R) {
  const el = $('pillar-quality');
  if (!el) return;
  try {
    const pq = analyzePillarQuality(R);
    // [loop 190] hiển thị chi tiết 盖头/截脚 từng trụ (trước đây chỉ show summary)
    const POS = [['year', 'Niên'], ['month', 'Nguyệt'], ['day', 'Nhật'], ['time', 'Thời']];
    const rows = POS.map(([k, vi]) => {
      const p = pq.perPillar && pq.perPillar[k];
      if (!p) return '';
      const cls = p.damaged ? 'rate-hung' : 'rate-cat';
      const flag = p.damaged ? `<span class="ln-rate ${cls}">${esc(p.vi || p.type || '')}</span>` : `<span class="ln-rate rate-mid">thuận</span>`;
      return `<div class="yz-row" style="margin:3px 0;padding-left:8px;border-left:3px solid ${p.damaged ? 'var(--cinnabar)' : 'var(--jade)'}">
        <b>${vi}</b> <span class="zh">${esc(p.ganZhi || '')}</span> ${flag}
        ${p.impact ? `<div class="hint">${esc(p.impact)}</div>` : ''}</div>`;
    }).join('');
    const headline = pq.gaijieCount > 0
      ? `<p class="hint">⚠ <b>${pq.gaijieCount}/4 trụ</b> bị 盖头/截脚 (can-chi khắc trong cùng trụ) — ${pq.flowOk ? 'nhưng khí VẪN THÔNG (có hóa giải)' : 'khí KHÔNG THÔNG, đời nhiều trở ngại'}.</p>`
      : `<p class="hint">✓ Không trụ nào bị 盖头/截脚 — can-chi 4 trụ đều thuận, khí thông.</p>`;
    const shenHtml = pq.dayShenVi ? `<p class="hint">📊 Nhật trụ ${esc(pq.dayShenVi)} (12-trường-sinh: giai đoạn sinh khí của bản mệnh).</p>` : '';
    el.innerHTML = `${headline}${rows}${shenHtml}<p class="hint" style="margin-top:4px">${esc(pq.summary || '')}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được chất lượng trụ.</p>'; }
}

function renderHuaqi(R) {
  const el = $('huaqi');
  if (!el) return;
  try {
    const h = analyzeHuaQi(R);
    el.innerHTML = `<p>${h.summary}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được hóa khí.</p>'; }
}

function renderHanNuan(R) {
  const el = $('han-nuan');
  if (!el) return;
  try {
    const h = analyzeHanNuan(R);
    const tColor = h.temperature === '寒' ? '#3a7bd5' : h.temperature === '暖' ? '#e0533d' : '#caa14a';
    const hColor = h.humidity === '燥' ? '#b58105' : h.humidity === '湿' ? '#2e9e5b' : '#caa14a';
    const needLine = h.needs.length
      ? `<p><b>Nhu cầu điều hòa:</b> ${h.needs.map((n) => `<span class="god-bad">${n.vi}</span> — ${n.why}`).join('<br>')}</p>`
      : '<p class="hint">Khí hậu tương đối cân — không cần điều hậu ép buộc.</p>';
    el.innerHTML = `
      <p><b>Nhiệt độ:</b> <span style="color:${tColor};font-weight:600">${h.tempVi}</span> (điểm ${h.tempScore}) &nbsp;|&nbsp; <b>Độ ẩm:</b> <span style="color:${hColor};font-weight:600">${h.humidVi}</span> (điểm ${h.humidScore})</p>
      ${needLine}
      ${h.alignNote ? `<p class="hint">${h.alignNote}</p>` : ''}
      <p class="hint">Khuyến nghị sinh hoạt: ${h.remedy}</p>
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được cân bằng khí hậu.</p>'; }
}

function renderWxFlow(R) {
  const el = $('wx-flow');
  if (!el) return;
  try {
    const f = analyzeWxFlow(R);
    const flowHtml = f.flow.length ? f.flow.map((x) => `<span class="combo cat">✓ ${esc(x)}</span>`).join(' ') : '<span class="hint">không có liên kết sinh nào流通</span>';
    const blockHtml = f.blocks.length ? f.blocks.map((x) => `<span class="combo xiong">⚠ ${esc(x)}</span>`).join(' ') : '';
    const profileHtml = f.profile.length ? `<p>${f.profile.map((p) => esc(p)).join('<br>')}</p>` : '';
    el.innerHTML = `
      <p><b>${esc(f.circulation)}</b></p>
      <p>${flowHtml}</p>
      ${blockHtml ? `<p>${blockHtml}</p>` : ''}
      ${profileHtml}
      <p class="hint">${esc(f.advice)}</p>
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được ngũ hành流通.</p>'; }
}

function renderChartLevel(R) {
  const el = $('chart-level');
  if (!el) return;
  try {
    const lv = classifyChartLevel(R);
    if (lv.level === 'unknown') { el.innerHTML = '<p class="hint">' + esc(lv.note) + '</p>'; return; }
    const critHtml = (lv.criteria || []).map((c) => {
      const icon = c.pass ? '✓' : '✗';
      const cls = c.pass ? 'cat' : 'xiong';
      return `<div class="yz-row"><span class="combo ${cls}">${icon} ${esc(c.name)}</span> <span class="hint">${esc(c.detail)}</span></div>`;
    }).join('');
    el.innerHTML = `
      <p><b>Đẳng cấp: ${esc(lv.levelVi)}</b> (${(lv.passCount || 0)}/6 tiêu chí đạt)</p>
      ${critHtml}
      <p class="hint">${esc(lv.note)}</p>
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được mệnh cách tầng lớp.</p>'; }
}

function renderMingGong(R) {
  const el = $('minggong');
  if (!el) return;
  try {
    const mg = baziMingGong(R);
    const yongIcon = mg.isYong ? '★ Dụng/Hỷ' : mg.isJi ? '⚠ Kỵ' : '· trung tính';
    // [loop 107 elevate] thân cung (三命: 命 cung chủ cả đời/前半, 身 cung chủ nửa sau)
    let shenHtml = '';
    try {
      const i = R.chart.input;
      const z = computeZiwei(i.year, i.month, i.day, i.hour, i.minute, i.gender);
      const shen = (z.palaces || []).find((p) => p.isShen);
      if (shen) {
        shenHtml = `<p><b>Thân cung (身宮):</b> ${esc(shen.gan)}${esc(shen.zhi)} — tọa ${esc(shen.vi || '')} (cung 紫微). <span class="hint">«命主前半生, 身主后半生» — Thân cung chủ NỬA SAU đời (~35t+), hậu vận.${shen.zhi === mg.zhi ? ' Thân cung đồng 命 cung → sức mạnh hội tụ.' : ''}</span></p>`;
      }
    } catch (e2) {}
    el.innerHTML = `
      <p><b>Mệnh cung (命宮): ${esc(mg.ganVi)} ${esc(mg.zhiVi)}</b> (${esc(mg.ganZhi)}) — thập thần <b>${esc(mg.godVi)}</b>, hành ${esc(mg.wxVi)}, nạp âm ${esc(mg.nayinWx)}. <span class="hint">${esc(yongIcon)} với Dụng</span></p>
      <p>${esc(mg.interactionWithDay)}</p>
      ${shenHtml}
      <p class="hint">${esc(mg.meaning)}</p>
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được mệnh cung.</p>'; }
}

function renderChildrenStar(R) {
  const el = $('children-star');
  if (!el) return;
  try {
    const c = analyzeChildrenStar(R);
    const profile = (c.profile || []).map((p) => `<p>${esc(p)}</p>`).join('');
    el.innerHTML = `
      ${profile}
      ${c.interactions && c.interactions.length ? `<p>${c.interactions.map((x) => esc(x)).join('<br>')}</p>` : ''}
      <p class="hint">${esc(c.advice)}</p>
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được tử nữ.</p>'; }
}

function renderFamilyFortune(R) {
  const el = $('family-fortune');
  if (!el) return;
  try {
    const f = analyzeFamilyHarmony(R);
    const relRows = (f.relations || []).map((r) => {
      const tone = /vượng|mạnh|tốt/.test(r.strength || '') ? '#2e9e5b' : /nhược|yếu|thử thách|khuyết/.test(r.strength || '') ? '#e0533d' : '#caa14a';
      return `<div class="yz-row" style="border-left:3px solid ${tone};padding-left:8px;margin:3px 0"><b>${esc(r.name || r.key || '')}</b> — ${esc(r.strength || '')}${r.palaceZhi ? ' (cung ' + esc(r.palaceZhi) + (r.palaceStable ? ' yên' : ' xung') + ')' : ''}</div>`;
    }).join('');
    el.innerHTML = `
      <p><b>Gia đạo: ${esc(String(f.familyScore ?? ''))}/100</b>${f.weakest ? ' — cần chú ý: ' + esc(f.weakest.name || f.weakest.key || '') : ''}${f.strongest ? ' | mạnh: ' + esc(f.strongest.name || f.strongest.key || '') : ''}</p>
      ${relRows}
      <p class="hint">${esc(f.advice || '')}</p>
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được gia đạo.</p>'; }
}

function renderNayinRelation(R) {
  const el = $('nayin-relation');
  if (!el) return;
  try {
    const n = nayinRelations(R.chart);
    const rows = (n.pairsAll || []).map((p) => {
      const tone = p.rel === 'same' ? '#caa14a' : (p.rel === 'sheng' || p.rel === 'shengBy') ? '#2e9e5b' : '#e0533d';
      return `<div class="yz-row" style="border-left:3px solid ${tone};padding-left:8px;margin:3px 0"><b>${esc(p.fromVi.split('(')[0])} × ${esc(p.toVi.split('(')[0])}</b>: ${esc(p.fromNayin)} ↔ ${esc(p.toNayin)} — <span style="color:${tone}">${esc(p.relVi)}</span> <span class="hint">${esc(p.note)}</span></div>`;
    }).join('');
    el.innerHTML = `<p>${esc(n.summary || '')}</p>${rows}`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được nạp âm quan hệ.</p>'; }
}

function renderPatternQuality(R) {
  const el = $('pattern-quality');
  if (!el) return;
  try {
    const pq = R.patternQuality || patternQuality(R);
    const QVI = { 成格: '✓ THÀNH CÁCH', 有救: '✓ BẠI CÓ CỨU (败中有成)', 败格: '⚠ BẠI CÁCH', 特殊: '★ CÁCH ĐẶC BIỆT', 未知: '? KHÔNG RÕ' };
    const QCOLOR = { 成格: '#2e9e5b', 有救: '#2e9e5b', 败格: '#e0533d', 特殊: '#d4af55', 未知: '#caa14a' };
    const disHtml = (pq.diseases || []).map((d) => `<div class="yz-row" style="border-left:3px solid #e0533d;padding-left:8px;margin:3px 0"><b>病:</b> ${esc(d.note || '')}</div>`).join('');
    const resHtml = (pq.rescues || []).map((r) => `<div class="yz-row" style="border-left:3px solid #2e9e5b;padding-left:8px;margin:3px 0"><b>药:</b> ${esc(r.note || '')}${r.drug && r.drug.length ? ' (' + esc(r.drug.join(',')) + ')' : ''}</div>`).join('');
    el.innerHTML = `
      <p><b style="color:${QCOLOR[pq.quality] || '#caa14a'}">${esc(QVI[pq.quality] || pq.quality)}</b></p>
      ${disHtml ? `<h4 class="syn-h4" style="margin-top:6px">病 (bệnh cách)</h4>${disHtml}` : ''}
      ${resHtml ? `<h4 class="syn-h4" style="margin-top:6px">药 (cứu ứng — «败中有成»)</h4>${resHtml}` : ''}
      <p class="hint">${esc(pq.summary || '')}</p>
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được cách cục thành bại.</p>'; }
}

function renderEventPredict(R) {
  const el = $('event-predict');
  if (!el) return;
  try {
    const startY = new Date().getFullYear();
    const ev = predictEvents(R, startY, 5);
    const rows = ev.years.map((y) => {
      const dupe = y.sameGod ? ' <span class="combo cat">★ NHÂN ĐÔI</span>' : '';
      // [loop 239] hiển thị lnArea/dyArea + events (trước đây chỉ advice)
      const lnHtml = y.lnArea ? `<div class="hint"><b>📅 Lưu niên ${esc(y.lnGodVi||'')}</b> → ${esc(y.lnArea)}${y.lnEvents && y.lnEvents.length ? ': ' + y.lnEvents.map(esc).join(', ') : ''}</div>` : '';
      const dyHtml = y.dyArea ? `<div class="hint"><b>🛤️ Đại vận ${esc(y.dyGodVi||'')}</b> → ${esc(y.dyArea)}${y.dyEvents && y.dyEvents.length ? ': ' + y.dyEvents.map(esc).join(', ') : ''}</div>` : '';
      const combHtml = y.combinedEvents && y.combinedEvents.length ? `<div class="hint" style="color:var(--gold-bright,#d4af37)"><b>⚡ Kích hoạt kép:</b> ${y.combinedEvents.map(esc).join(', ')}</div>` : '';
      return `<div class="yz-row" style="border-left:3px solid var(--gold-bright, #d4af37);margin:4px 0;padding-left:8px">
        <b>${y.year}</b> <span class="zh">${esc(y.ganZhi)}</span>${dupe}
        ${lnHtml}${dyHtml}${combHtml}
        <div class="hint" style="margin-top:2px">${esc(y.advice)}</div>
      </div>`;
    }).join('');
    el.innerHTML = `<p class="hint">Dự báo 5 năm tới theo thập thần năm × đại vận (渊海子平 应期).</p>${rows}`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được sự kiện dự đoán.</p>'; }
}

function renderPersonalityProfile(R) {
  const el = $('personality-profile');
  if (!el) return;
  try {
    const p = getPersonalityProfile(R);
    const LABEL = { temperament: 'Khí chất', strengths: 'Ưu điểm', weaknesses: 'Nhược điểm', social: 'Xã hội', love: 'Tình cảm', career: 'Sự nghiệp', health: 'Sức khoẻ', finance: 'Tài chính' };
    const rows = (p.keys || []).map((k) => `<div class="yz-row"><b>${esc(LABEL[k] || k)}:</b> ${esc(p.profile[k])}</div>`).join('');
    el.innerHTML = `<p><b>Nhật can ${esc(p.ganVi)}</b> (hành ${esc(p.wxVi)}) — tính cách bẩm sinh:</p>${rows}`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được tính cách.</p>'; }
}

function renderMingZhu(R) {
  const el = $('mingzhu');
  if (!el) return;
  try {
    const mg = baziMingGong(R);
    const yearZhi = R.chart.pillars.year.zhi;
    const z = mingZhuShenZhu(mg.zhi, yearZhi);
    el.innerHTML = `
      <p><b>命主 (Mệnh Chủ):</b> ${esc(z.mingZhuVi)} <span class="hint">— sao chủ Mệnh Cung (${esc(mg.zhiVi)})</span></p>
      <p class="hint">${esc(z.mingZhuDesc)}</p>
      <p><b>身主 (Thân Chủ):</b> ${esc(z.shenZhuVi)} <span class="hint">— sao chủ Thân (năm sinh ${esc(R.chart.pillars.year.zhi)})</span></p>
      <p class="hint">${esc(z.shenZhuDesc)}</p>
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được Mệnh Chủ / Thân Chủ.</p>'; }
}

function renderDailyPro(R) {
  const el = $('daily-pro');
  if (!el) return;
  try {
    const now = new Date();
    const d = dailyPro(R, now.getFullYear(), now.getMonth() + 1, now.getDate());
    el.innerHTML = `
      <p><b>Hôm nay ${esc(d.ganZhi || '')}:</b> ${esc(d.rating || '')} (${esc(String(d.score || ''))}/100)</p>
      ${d.bestActivity ? `<p>✓ Nên: ${esc(d.bestActivity)}</p>` : ''}
      ${d.avoidActivity ? `<p>⚠ Tránh: ${esc(d.avoidActivity)}</p>` : ''}
      ${d.bestDirection ? `<p>🧭 Hướng tốt: ${esc(d.bestDirection)}</p>` : ''}
      <p class="hint">${esc(d.advice || '')}</p>
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được lưu nhật chuyên sâu.</p>'; }
}

function renderPersonalFengShui(R) {
  const el = $('personal-fengshui');
  if (!el) return;
  try {
    const z = computeZhai(R.chart.input.year, R.chart.input.gender);
    const pf = personalFengShui(z.auspicious, z.inauspicious, R.yong);
    const rooms = pf.rooms || [];
    const rows = rooms.map((r) => `<div class="yz-row"><b>${esc(r.vi)}</b> → hướng <b style="color:#2e9e5b">${esc(r.bestDir)}</b> <span class="hint">(${esc(r.why || '')})</span></div>`).join('');
    el.innerHTML = `<p class="hint">Bát Trạch (八宅): quái ${esc(z.guaName || '')} — ${esc(z.grpVi || '')} nhóm. Hướng từng phòng theo Dụng + Bát Trạch.</p>${rows}`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được phong thủy phòng ở.</p>'; }
}

function renderDailyGuide(R) {
  const el = $('daily-guide');
  if (!el) return;
  try {
    const now = new Date();
    const g = dailyGuide(R, now.getFullYear(), now.getMonth() + 1, now.getDate());
    const dir = dailyDirections(now.getFullYear(), now.getMonth() + 1, now.getDate(), R.yong);
    const yi = (g.tsYi || []).slice(0, 8).join(', ');
    const ji = (g.tsJi || []).slice(0, 6).join(', ');
    const goodH = (g.bestHours || []).map((h) => esc(h)).join(', ');
    const badH = (g.avoidHours || []).map((h) => esc(h)).join(', ');
    el.innerHTML = `
      <p><b>${esc(g.date || '')} (${esc(g.lunar || '')}) ${esc(g.ganZhi || '')} — trực ${esc(g.officer || '')}</b></p>
      ${g.oneLiner ? `<p>${esc(g.oneLiner)}</p>` : ''}
      ${yi ? `<p>✓ <b>宜:</b> ${esc(yi)}</p>` : ''}
      ${ji ? `<p>⚠ <b>忌:</b> ${esc(ji)}</p>` : ''}
      ${g.color ? `<p class="hint">🎨 <b>Màu may mắn:</b> ${esc(g.color.primary || '')}${g.color.accent ? ' (phụ ' + esc(g.color.accent) + ')' : ''}${g.colorAdvice ? ' — ' + esc(g.colorAdvice) : ''}</p>` : ''}
      <p class="hint">🧭 Tài Thần ${esc(dir.directions?.caiShen || '?')} | Hỷ Thần ${esc(dir.directions?.xiShen || '?')} | Hướng tốt ${esc(dir.bestDirection || '?')}</p>
      ${goodH ? `<p class="hint">⏰ Giờ tốt: ${goodH}</p>` : ''}
      ${badH ? `<p class="hint">⏰ Giờ kỵ: ${badH}</p>` : ''}
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được hướng dẫn hôm nay.</p>'; }
}

function renderFiveAspects(R) {
  const el = $('five-aspects');
  if (!el) return;
  try {
    const f = analyzeFiveVirtues(R);
    el.innerHTML = `
      <p><b>Đức chính: ${esc(f.virtue || '')}</b> <span class="hint">(hành ${esc(f.primaryVi || '')})</span> — ${esc(f.desc || '')}</p>
      ${f.strong ? `<p class="hint">✓ Mạnh: ${esc(f.strong)}</p>` : ''}
      ${f.weak ? `<p class="hint">⚠ Nhược: ${esc(f.weak)}</p>` : ''}
      ${f.kyVirtue ? `<p class="hint">Đức Kỵ: ${esc(f.kyVirtue)}${f.kyWeak ? ' — ' + esc(f.kyWeak) : ''}</p>` : ''}
      ${f.cultivation ? `<p>🌿 Tu dưỡng: ${esc(f.cultivation)}</p>` : ''}
      ${f.dungVirtue ? `<div class="tiaohou-note"><b>🎯 Đức bổ Dụng (${esc(f.primaryVi || '')}):</b> ${esc(f.dungVirtue)}${f.dungCultivation ? ' — ' + esc(f.dungCultivation) : ''}</div>` : ''}
      ${f.balance ? `<p class="hint">⚖️ Cân bằng đức: ${esc(f.balance)}</p>` : ''}
      <p class="hint">${esc(f.advice || '')}</p>
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được ngũ đức.</p>'; }
}

function renderRomanceDeep(R) {
  const el = $('romance-deep');
  if (!el) return;
  try {
    const r = analyzeRomance(R);
    const profile = (r.profile || []).map((p) => `<p>${esc(p)}</p>`).join('');
    const warn = (r.warningSigns || []).map((w) => `<p class="hint">⚠ ${esc(w)}</p>`).join('');
    el.innerHTML = `
      <p><b>Điểm tình duyên: ${esc(String(r.romanceScore ?? ''))}</b> | Sức phối ngẫu: ${esc(r.spouseStrength || '')} | Cung ${esc(r.palaceStable ? 'yên' : 'bị xung')}</p>
      ${r.peachBlossom ? `<p class="hint">🌸 Đào hoa: ${esc(r.peachBlossom)}${r.peachPositions ? ' (' + esc(r.peachPositions) + ')' : ''}</p>` : ''}
      ${r.redAttraction ? `<p class="hint">💋 Hồng diễm: ${esc(r.redAttraction)}${r.redPositions ? ' (' + esc(r.redPositions) + ')' : ''}</p>` : ''}
      ${profile}
      ${warn}
      <p class="hint">${esc(r.advice || '')}</p>
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được tình duyên sâu.</p>'; }
}

function renderInvestStyle(R) {
  const el = $('invest-style');
  if (!el) return;
  try {
    const inv = investmentStyle(R);
    const dung = Array.isArray(inv.dungAssets) ? inv.dungAssets.join(', ') : (inv.dungAssets || '');
    const avoid = Array.isArray(inv.avoidAssets) ? inv.avoidAssets.join(', ') : (inv.avoidAssets || inv.kyAssets && Array.isArray(inv.kyAssets) ? inv.kyAssets.join(', ') : (inv.kyAssets || ''));
    el.innerHTML = `
      <p><b>${esc(inv.style || '')}</b> <span class="hint">(${esc(inv.topGodVi || '')}, rủi ro ${esc(String(inv.riskScore ?? ''))}/10${inv.canDayTrade ? ', hợp day-trade' : ''})</span></p>
      <p class="hint">${esc(inv.investDesc || '')}</p>
      ${dung ? `<p class="hint">✓ Tài sản hợp Dụng: ${esc(dung)}</p>` : ''}
      ${Array.isArray(inv.dungStable) && inv.dungStable.length ? `<p class="hint">🛡️ Tài sản an toàn: ${inv.dungStable.map(esc).join(', ')}</p>` : ''}
      ${avoid ? `<p class="hint">⚠ Tránh: ${esc(avoid)}</p>` : ''}
      ${inv.allocation ? `<p class="hint">📊 Phân bổ gợi ý: ${Object.entries(inv.allocation).map(([k,v]) => `${esc(k.replace(/_/g,' '))} <b>${v}%</b>`).join(' · ')}</p>` : ''}
      ${inv.dayTradeNote ? `<div class="tiaohou-note" style="border-color:var(--cinnabar)">${esc(inv.dayTradeNote)}</div>` : ''}
      ${Array.isArray(inv.goodDayun) && inv.goodDayun.length ? `<p class="hint">🛤️ Đại运 thuận đầu tư: ${inv.goodDayun.map(esc).join(', ')}</p>` : ''}
      ${inv.timingNote ? `<p class="hint">⏰ ${esc(inv.timingNote)}</p>` : ''}
      <p class="hint">${esc(inv.advice || '')}</p>
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được phong cách đầu tư.</p>'; }
}

function renderBaziBusiness(R) {
  const el = $('bazi-business');
  if (!el) return;
  try {
    const b = analyzeBusiness(R);
    const biz = Array.isArray(b.bizTypes) ? b.bizTypes.join(', ') : (b.bizTypes || '');
    el.innerHTML = `
      <p><b>${b.shouldStart ? '✓ Nên khởi nghiệp' : '⚠ Cần thận trọng khởi nghiệp'}</b>${biz ? ' — ngành hợp: ' + esc(biz) : ''}</p>
      ${Array.isArray(b.reasons) && b.reasons.length ? `<ul class="zr-reasons">${b.reasons.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}
      ${b.hasCaiKu === false ? `<p class="hint">💰 <b>KHÔNG có tài khố</b> — kiếm được nhưng khó giữ; cần kế hoạch tiết kiệm/quỹ dự phòng nghiêm ngặt.</p>` : b.hasCaiKu === true ? '<p class="hint">💰 Có tài khố — giữ tiền tốt, tích luỹ được.</p>' : ''}
      ${b.foodGen > 0 ? `<p class="hint">🏭 Sao Thực Thần ${b.foodGen} — tiềm năng sản phẩm/dịch vụ ${b.foodGen >= 3 ? 'MẠNH' : 'vừa'}.</p>` : ''}
      ${b.robberLevel > 0 ? `<p class="hint" style="color:#f0a99c">⚠ Kiếp Tài cấp ${b.robberLevel} — rủi ro cạnh tranh/tranh giành; cẩn thận đối tác, hợp đồng chặt.</p>` : ''}
      ${b.soloVsPartner ? `<p class="hint">🤝 ${esc(b.soloVsPartner)}</p>` : ''}
      ${b.partnerStyle ? `<p class="hint">Phong cách: ${esc(b.partnerStyle)}</p>` : ''}
      ${b.timing ? `<p class="hint">⏰ ${esc(b.timing)}</p>` : ''}
      <p class="hint">${esc(b.advice || '')}</p>
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được khởi nghiệp.</p>'; }
}

function renderSeasonalAdvice(R) {
  const el = $('seasonal-advice');
  if (!el) return;
  try {
    const s = seasonalAdvice(R);
    const adviceArr = Array.isArray(s.advice) ? s.advice : (s.advice ? [s.advice] : []);
    const adviceHtml = adviceArr.map((a) => `<p class="hint">• ${esc(a)}</p>`).join('');
    el.innerHTML = `
      <p><b>Dụng ${esc(s.dungVi || '')}</b> — Mùa TỐT NHẤT: <b>${esc(s.bestSeason || '')}</b> | Mùa CẨN THẬN: <b>${esc(s.worstSeason || '')}</b></p>
      ${s.climateNote ? `<p class="hint">${esc(s.climateNote)}</p>` : ''}
      ${Array.isArray(s.seasons) ? s.seasons.map((se) => `<div class="yz-row" style="border-left:3px solid ${se.fav ? 'var(--jade)' : 'var(--gold)'};margin:3px 0;padding-left:8px"><b>${esc(se.vi||'')}</b> <span class="hint">(${esc(se.months||'')})</span>${se.fav ? ' <span class="geju-xi">★ thuận Dụng</span>' : ''}<div class="hint">${esc(se.yourAdvice || '')}</div></div>`).join('') : ''}
      ${adviceHtml}
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được lời khuyên mùa.</p>'; }
}

function renderAnchong(R) {
  const el = $('anchong');
  if (!el) return;
  try {
    const ac = detectAnchong(R.chart);
    if (!ac.pairs.length) { el.innerHTML = '<p class="hint">Không phát hiện ám xung — tàng can giữa các trụ không thiên khắc.</p>'; return; }
    const rows = ac.pairs.map((p) => `<div class="yz-row"><b>${esc(p.bothHidden ? '暗冲' : '½')} ${esc(p.ganA)}↔${esc(p.ganB)}</b> (${esc(p.from)}↔${esc(p.to)}) <span class="hint">${esc(p.note)}</span></div>`).join('');
    el.innerHTML = `<p class="hint">盲派: tàng can thiên khắc ngầm (4 cặp thất sát 甲庚/乙辛/丙壬/丁癸) giữa các trụ — xung đột tiềm ẩn.</p>${rows}`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được ám xung.</p>'; }
}

function renderDestinyTimeline(R) {
  const el = $('destiny-timeline');
  if (!el) return;
  try {
    const t = lifeTimeline(R, new Date().getFullYear());
    // [loop 191 fix BUG] trước đây đọc d.vit/d.score (KHÔNG tồn tại) + ngưỡng 0-100 trên totalScore
    //   nhỏ (−28..30) → mọi thập niên đều đỏ, điểm trống. Nay dùng godCat (cat/mid/hung) + totalScore.
    const decades = (t.decades || []).map((d) => {
      const tone = d.godCat === 'cat' ? '#2e9e5b' : d.godCat === 'hung' ? '#e0533d' : '#caa14a';
      const label = d.lifePhase || d.godTheme || d.godVi || '';
      return `<div class="yz-row" style="border-left:3px solid ${tone};padding-left:8px;margin:3px 0">
        <b>${esc(String(d.range || ''))}</b> <span class="zh">${esc(d.ganZhi || '')}</span> <span style="color:${tone};font-weight:600">${esc(d.godVi || '')}</span> <span class="hint">(${esc(String(d.totalScore ?? ''))})</span>
        <div class="hint">${esc(label)}</div></div>`;
    }).join('');
    const fmtDec = (x, icon) => x ? `<p class="hint">${icon} ${esc(x.range || '')} <span class="zh">${esc(x.ganZhi || '')}</span> — ${esc(x.godVi || '')} (${esc(x.godTheme || '')})</p>` : '';
    el.innerHTML = `
      <p><b>${esc(t.summary || '')}</b></p>
      ${fmtDec(t.peakDecade, '🏆 Đỉnh cao:')}
      ${fmtDec(t.challengeDecade, '⚠ Thách thức:')}
      ${decades}
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được dòng đời timeline.</p>'; }
}

function renderNobleCultivate(R) {
  const el = $('noble-cultivate');
  if (!el) return;
  try {
    const n = nobleCultivation(R);
    const arr = (x) => Array.isArray(x) ? x.join(', ') : (x || '');
    el.innerHTML = `
      <p><b>Quý nhân mang hành ${esc(n.dungVi || '')}</b> (Dụng Thần)</p>
      ${Array.isArray(n.nobleStars) && n.nobleStars.length ? `<p class="hint">⭐ Sao quý nhân: ${n.nobleStars.map((s) => `${esc(s.star)} (${esc(s.at||'')}) — ${esc(s.vi||'')}`).join(' · ')}</p>` : ''}
      ${n.whoToSeek ? `<p class="hint">🧑 Quý nhân là: ${esc(arr(n.whoToSeek))}</p>` : ''}
      ${n.whereToFind ? `<p class="hint">📍 Tìm ở: ${esc(arr(n.whereToFind))}</p>` : ''}
      ${n.howToApproach ? `<p class="hint">🤝 Tiếp cận: ${esc(arr(n.howToApproach))}</p>` : ''}
      ${n.whatToGive ? `<p class="hint">🎁 Tặng/đổi lại: ${esc(arr(n.whatToGive))}</p>` : ''}
      ${Array.isArray(n.maintenance) && n.maintenance.length ? `<details style="margin:4px 0"><summary class="hint">🌱 Duy trì quan hệ quý nhân</summary><ul class="hint" style="margin:4px 0 4px 16px">${n.maintenance.map((m) => `<li>${esc(m)}</li>`).join('')}</ul></details>` : ''}
      ${n.drainers && (n.drainers.length || n.drainers) ? `<p class="hint">⚠ Hao quý nhân: ${esc(arr(n.drainers))}</p>` : ''}
      <p class="hint">${esc(n.advice || '')}</p>
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được quý nhân dưỡng dụng.</p>'; }
}

function renderFengshuiExtra(R) {
  const el = $('fengshui-extra');
  if (!el) return;
  const bestText = (o) => o.summary || o.advice || o.tip || o.recommendation || Object.values(o).find((v) => typeof v === 'string' && v.length > 25) || '';
  const arr = (x) => Array.isArray(x) ? x.join(', ') : (x || '');
  let html = '';
  const gen = (title, fn, extra) => {
    try {
      const o = fn(R);
      const t = bestText(o);
      if (t) html += `<p class="hint"><b>${title}:</b> ${esc(t)}${extra ? ' ' + esc(extra(o)) : ''}</p>`;
    } catch (e) {}
  };
  gen('🏙️ Thành phố hợp', cityRecommendation);
  gen('🧿 Vật phẩm hóa giải', cureByElement);
  gen('🤝 Giao tế', socialStrategy);
  gen('🧘 Tu tập', spiritualPractice);
  try {
    const np = findNoblePerson(R);
    const t = bestText(np);
    if (t) html += `<p class="hint"><b>👑 Quý nhân (đế tinh):</b> ${esc(t)}</p>`;
  } catch (e) {}
  // Số may mắn (number-fs)
  try {
    const nm = recommendNumbers(R);
    const fav = (nm.favNums || []).join(','), avoid = (nm.avoidNums || []).join(',');
    const combos = (nm.goodCombos || []).slice(0, 4).join('/');
    if (fav) html += `<p class="hint"><b>🔢 Số hợp:</b> ${esc(fav)} (combo ${esc(combos)}), tránh ${esc(avoid)}. ${esc((nm.tips || [])[0] || '')}</p>`;
  } catch (e) {}
  // Hướng ngủ (sleep-fs)
  try {
    const sl = sleepOptimization(R, R.chart.input.year, R.chart.input.gender);
    const t = bestText(sl);
    if (t) html += `<p class="hint"><b>😴 Giấc ngủ:</b> ${esc(t)}</p>`;
  } catch (e) {}
  el.innerHTML = html || '<p class="hint">Không tính được phong thủy định vị.</p>';
}

function renderShenshaActivation(R) {
  const el = $('shensha-activation');
  if (!el) return;
  try {
    const ac = checkNatalActivation(R);
    const stars = ac.natalStars || [];
    if (!stars.length) { el.innerHTML = '<p class="hint">Không phát hiện thần sát kích hoạt rõ.</p>'; return; }
    const starRows = stars.map((s) => `<div class="yz-row" style="border-left:3px solid var(--gold);padding-left:8px;margin:3px 0"><b>${esc(s.vi || s.zh || '')}</b> @ ${esc(s.at || '')} (${esc(s.pillar || '')}) <span class="hint">— ${esc(s.effect || '')}</span></div>`).join('');
    // [loop 261] dòng thời gian kích hoạt — năm nào sao bẩm sinh BẬT
    const acts = (ac.activations || []).slice(0, 10);
    const actRows = acts.map((a) => `<div class="yz-row" style="border-left:3px solid ${a.activationType && /xung|hại|kỵ/i.test(a.activationType) ? 'var(--cinnabar)' : 'var(--jade)'};padding-left:8px;margin:3px 0"><b>${a.year}</b> <span class="zh">${esc(a.yZhi||'')}</span> → <b>${esc(a.shenshaVi||'')}</b> ${esc(a.activationType||'')} <span class="hint">(${esc(a.reason||'')}) — ${esc(a.effect||'')}</span></div>`).join('');
    el.innerHTML = `<p class="hint">⚡ ${stars.length} sao bẩm sinh (trigger bởi 合/冲/刑/害 trong lưu niên):</p>${starRows}${actRows ? `<h4 class="syn-h4" style="margin-top:8px">📅 Năm kích hoạt (sắp tới):</h4>${actRows}` : ''}`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được kích hoạt thần煞.</p>'; }
}

function renderFlyingSihua(R) {
  const el = $('flying-sihua');
  if (!el) return;
  try {
    const i = R.chart.input;
    const z = computeZiwei(i.year, i.month, i.day, i.hour, i.minute, i.gender);
    const fs = flyingSihua(z);
    if (!fs) { el.innerHTML = '<p class="hint">Không tính được phi tinh.</p>'; return; }
    // [loop 188] hiển thị chi tiết 4 hóa phi từ 5 cung chính (trước đây chỉ show summary)
    const HUA_VI = { 禄: 'Hóa Lộc', 权: 'Hóa Quyền', 科: 'Hóa Khoa', 忌: 'Hóa Kỵ' };
    const HUA_TONE = { 禄: 'cat', 权: 'cat', 科: 'cat', 忌: 'hung' };
    const SOURCES = [
      ['fromMing', 'Mệnh (命宫)', 'bản thân/khởi điểm'],
      ['fromWealth', 'Tài (財帛)', 'tiền bạc/kiếm tiền'],
      ['fromCareer', 'Quan (官禄)', 'sự nghiệp/danh vọng'],
      ['fromSpouse', 'Phu/Thê (夫妻)', 'hôn nhân/đối tác'],
      ['fromFortune', 'Phúc (福德的)', 'phúc đức/tâm trạng'],
    ];
    const palHtml = SOURCES.map(([key, label, desc]) => {
      const p = fs[key];
      if (!p || !Array.isArray(p.flies) || !p.flies.length) return '';
      const flies = p.flies.map((fl) => {
        const cls = HUA_TONE[fl.hua] === 'hung' ? 'geju-ji' : 'geju-xi';
        return `<span class="zw-sh ${cls}" title="${esc(fl.vi || '')}"><b>${HUA_VI[fl.hua] || fl.hua}</b> ${esc(fl.star || '')}→<span class="zh">${esc(fl.toZhi || '?')}</span>${fl.placed === false ? ' <span class="hint">(không đặt)</span>' : ''}</span>`;
      }).join(' ');
      return `<div class="yz-row" style="margin:4px 0;padding-left:8px;border-left:3px solid var(--gold)">
        <b>${esc(label)}</b> <span class="hint">(${esc(desc)}) — can cung <span class="zh">${esc(p.gan || '')}</span></span><br>
        <div style="margin-top:3px">${flies}</div>
      </div>`;
    }).join('');
    el.innerHTML = `<p class="hint">紫微飞星四化 飛星四化 — can của 5 cung chính sinh ra 4 hóa (禄/权/科/忌) bay chiếu cung khác → bật lĩnh vực tương ứng.</p>
      ${palHtml || `<p>${esc(fs.summary || '')}</p>`}
      <p class="hint" style="margin-top:6px">${esc(fs.summary || '')}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được phi tinh tứ hóa.</p>'; }
}

function renderMoveFs(R) {
  const el = $('move-fs');
  if (!el) return;
  try {
    const i = R.chart.input;
    const now = new Date();
    const mv = findMoveDates(R.chart.pillars.year.zhi, i.year, i.gender, now.getFullYear(), now.getMonth() + 1, now.getDate(), 60, 5);
    if (!mv || !mv.length) { el.innerHTML = '<p class="hint">Không tìm được ngày dọn nhà tốt trong 60 ngày tới.</p>'; return; }
    const rows = mv.map((d) => `<div class="yz-row"><b>${esc(d.date)}</b> ${esc(d.ganZhi || '')} ${esc(d.lunar || '')} — <b>${esc(d.rating || '')}</b> (${esc(String(d.score || ''))}) <span class="hint">${esc((d.reasons || []).join('; ').slice(0, 80))}</span></div>`).join('');
    el.innerHTML = `<p class="hint">Top 5 ngày tốt dọn nhà / nhập trazaar trong 60 ngày tới (择日).</p>${rows}`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được ngày dọn nhà.</p>'; }
}

function renderPartnerMatch(userR, partnerR) {
  const el = $('partner-match');
  if (!el) return;
  try {
    const m = matchBusinessPartners(userR, partnerR);
    const details = (m.details || []).map((d) => `<p class="hint">${esc(d)}</p>`).join('');
    el.innerHTML = `
      <p><b>Điểm hợp tác: ${esc(String(m.score ?? ''))}/100 — ${esc(m.rating || '')}</b></p>
      ${m.roleFit ? `<p class="hint">🤝 ${esc(m.roleFit)}</p>` : ''}
      ${details}
      <p class="hint">${esc(m.advice || '')}</p>
    `;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được ghép đôi đối tác.</p>'; }
}

function renderWeddingDate(dates) {
  const el = $('wedding-date');
  if (!el) return;
  if (!dates || !dates.length) { el.innerHTML = '<p class="hint">Không tìm được ngày cưới tốt trong 90 ngày tới.</p>'; return; }
  const rows = dates.map((d) => {
    const yi = d.hasMarryYi ? '✓ 宜嫁娶' : d.hasMarryJi ? '⚠ 忌嫁娶' : '';
    const clash = d.clashA || d.clashB ? ' ⚠ xung tuổi' : '';
    return `<div class="yz-row"><b>${esc(d.date)}</b> ${esc(d.ganZhi || '')} ${esc(d.lunar || '')} — <b>${esc(d.rating || '')}</b> (${esc(String(d.score || ''))}) <span class="hint">${esc(yi)}${esc(clash)}</span></div>`;
  }).join('');
  el.innerHTML = `<p class="hint">Top 5 ngày tốt cưới (嫁娶) trong 90 ngày tới.</p>${rows}`;
}

function renderPlannedBirth(year) {
  const el = $('planned-birth');
  if (!el) return;
  el.innerHTML = '<p class="hint">⏳ Đang quét ' + year + ' (tất cả ngày × 12时辰 × 2 giới)... mất vài giây.</p>';
  // Run async (non-blocking)
  setTimeout(() => {
    try {
      const r = inverseBaZiSolve({ refYear: year, yearStart: year, yearEnd: year, stepDays: 5, topK: 5, maxSamples: 3000 });
      if (!r.max) { el.innerHTML = '<p class="hint">Không tính được.</p>'; return; }
      const results = r.topK || [r.max]; // [loop 171 fix] inverseBaZiSolve trả `topK` (5 ptử), KHÔNG phải `topResults` — trước đây field sai → fallback [r.max] → thẻ «择吉生育» chỉ hiện 1 lựa chọn thay vì top 5
      const rows = results.map((res, i) => {
        const lbl = labelResult(res);
        const birth = new Date(res.y, res.m - 1, res.d);
        const conc = new Date(birth); conc.setDate(conc.getDate() - 280);
        const concStr = conc.getFullYear() + '-' + String(conc.getMonth() + 1).padStart(2, '0') + '-' + String(conc.getDate()).padStart(2, '0');
        const pillars = (res.pillars || []).join(' · '); // [loop 172 fix] res.gz không tồn tại → bát tự 四柱 không hiện; dùng res.pillars (trước đây card KHÔNG hiển thị lá số — sát nghĩa «bát tự mong muốn»)
        return `<div class="yz-row" style="border-left:3px solid var(--gold);padding-left:8px;margin:4px 0" title="${esc(lbl)}">
          <b>#${i + 1} Sinh ${res.y}-${res.m}-${res.d} giờ ${res.h >= 10 ? res.h : '0' + res.h}:${res.min || '00'} (${res.g})</b> — ${res.score}đ · ${esc(res.gradeVi || '')} · ${esc(res.pattern || '')}${res.gejuQuality ? ' (' + esc(res.gejuQuality) + ')' : ''}<br>
          <span class="zh" style="font-size:16px;letter-spacing:1px">${pillars}</span> <span class="hint">(年 · 月 · 日 · 时)</span><br>
          <span class="hint">🤰 Thụ thai khoảng <b>${concStr}</b> (trước sinh ~280 ngày) · Dụng ${esc(res.yong || '')}</span>
        </div>`;
      }).join('');
      el.innerHTML = `<p class="hint">Top ${results.length} lá số tốt nhất năm ${year} (quét ${r.scanned}). Điểm ${r.scoreStats.min}→${r.scoreStats.max} (TB ${r.scoreStats.mean}). <b>四柱 =年·月·日·时</b>; hover xem chi tiết.</p>${rows}`;
    } catch (e) { el.innerHTML = '<p class="hint">Lỗi: ' + esc(e.message) + '</p>'; }
  }, 50);
}

// ---------------------------------------------------------------- ẨM THỰC HỢP MỆNH 飲食養生
function renderDiet(R) {
  const el = $('diet-out');
  if (!el) return;
  try {
    const d = personalNutrition(R);
    const f = d.dungFlavor || {};
    const kf = d.kyFlavor || {};
    el.innerHTML = `
      <div class="yz-row" style="border-left:3px solid var(--jade);padding-left:8px;margin:4px 0">
        <b>✓ Vị ${esc(f.vi||'')} (${esc(f.flavor||'')})</b> — ${esc(f.organ||'')}
        <div class="hint">🥗 Thực phẩm: ${esc(f.foods||'')}</div>
        <div class="hint">💪 Tác dụng: ${esc(f.action||'')}</div>
        ${f.caution ? `<div class="hint" style="color:#f0a99c">⚠ Lưu ý: ${esc(f.caution)}</div>` : ''}
      </div>
      ${kf.flavor ? `<p class="hint">⚠ Tránh vị ${esc(kf.vi||'')} (${esc(kf.flavor||'')}): ${esc(kf.foods||'')}</p>` : ''}
      ${d.meals ? `<p class="hint">🍚 ${esc(d.meals)}</p>` : ''}
      ${d.tea ? `<p class="hint">🍵 ${esc(d.tea)}</p>` : ''}
      ${d.fruit ? `<p class="hint">🍎 ${esc(d.fruit)}</p>` : ''}
      ${d.supplement ? `<p class="hint">💊 ${esc(d.supplement)}</p>` : ''}
      ${d.weeklyMenu ? `<details style="margin:4px 0"><summary class="hint">📋 Thực đơn tuần</summary><p class="hint" style="margin:4px 0 4px 16px">${esc(d.weeklyMenu)}</p></details>` : ''}
      <p class="hint">${esc(d.advice||'')}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được ẩm thực hợp mệnh.</p>'; }
}

// ---------------------------------------------------------------- THÀNH PHỐ HỢP MỆNH 城市風水
function renderCityFs(R) {
  const el = $('city-fs');
  if (!el) return;
  try {
    const c = cityRecommendation(R);
    const arr = (x) => Array.isArray(x) ? x.join(', ') : (x || '');
    el.innerHTML = `
      <p><b>Hướng tốt: ${esc(c.bestDirectionVi || '')}</b> (hành ${esc(c.dungVi || '')}) · Loại địa lý lý tưởng: <b>${esc(c.bestCityType?.vi || '')}</b>${c.bestCityType?.benefit ? ' — ' + esc(c.bestCityType.benefit) : ''}</p>
      ${c.bestCityType?.cities?.length ? `<p class="hint">🏙️ Thành phố VN hợp: <b>${c.bestCityType.cities.map(esc).join(', ')}</b></p>` : ''}
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:6px;margin:6px 0">
        ${c.careerCityVi ? `<div class="yz-row" style="border-left:3px solid var(--gold);padding:4px 8px"><b>💼 Sự nghiệp</b><br><span class="hint">${esc(c.careerCityVi)}</span></div>` : ''}
        ${c.wealthCityVi ? `<div class="yz-row" style="border-left:3px solid var(--gold);padding:4px 8px"><b>💰 Tài lộc</b><br><span class="hint">${esc(c.wealthCityVi)}</span></div>` : ''}
        ${c.healthCity ? `<div class="yz-row" style="border-left:3px solid var(--gold);padding:4px 8px"><b>🏥 Sức khoẻ</b><br><span class="hint">${esc(arr(c.healthCity))}</span></div>` : ''}
      </div>
      ${c.avoidCities?.length ? `<p class="hint">⚠ Tránh hướng ${esc(c.avoidDirection || '')} — các vùng: ${c.avoidCities.map((a) => esc(a.vi || a.cities?.join('/') || '')).join('; ')}</p>` : ''}
      <p class="hint">${esc(c.advice || '')}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được thành phố hợp mệnh.</p>'; }
}

function renderLifestyle(R) {
  const el = $('lifestyle');
  if (!el) return;
  const arr = (x) => Array.isArray(x) ? x.join(', ') : (x || '');
  let html = '';
  // Ẩm thực
  try {
    const d = personalNutrition(R);
    const f = d.dungFlavor || {};
    html += `<h4 class="syn-h4" style="margin-top:8px">🍱 Ẩm thực hợp mệnh (Dụng ${esc(d.dungVi || '')})</h4>`;
    html += `<p class="hint">Vị ${esc(f.vi || '')} (${esc(f.organ || '')}) — ${esc(f.action || '')}. Thực phẩm: ${esc(f.foods || '')}.${f.caution ? ' Lưu ý: ' + esc(f.caution) + '.' : ''} Tránh vị ${(d.kyFlavor || {}).vi || ''} (${d.kyVi || ''}).</p>`;
    if (d.meals || d.tea || d.fruit) html += `<p class="hint">${d.meals ? 'Gợi ý: ' + esc(d.meals) + '. ' : ''}${d.tea ? 'Trà: ' + esc(d.tea) + '. ' : ''}${d.fruit ? 'Trái cây: ' + esc(d.fruit) + '.' : ''}</p>`;
  } catch (e) {}
  // Đá/trang sức
  try {
    const c = crystalLuckyObjects(R);
    html += `<h4 class="syn-h4" style="margin-top:8px">💎 Đá phong thủy & trang sức (Dụng ${esc(c.dungVi || '')})</h4>`;
    html += `<p class="hint">Đeo: ${esc(arr(c.dungCrystals))}. Màu: ${esc(c.dungColor || '')}. Lợi: ${esc(c.dungBenefit || '')}. Kim loại: ${esc(c.dungMetal || '')}.${c.dungObjects ? ' Vật phẩm: ' + esc(arr(c.dungObjects)) + '.' : ''}${c.dungOrgan ? ' Bổ: ' + esc(c.dungOrgan) + '.' : ''}${c.dungPlacement ? ' Vị trí: ' + esc(arr(c.dungPlacement)) + '.' : ''}</p>`;
    if (c.kyCrystals && (Array.isArray(c.kyCrystals) ? c.kyCrystals.length : c.kyCrystals)) { html += `<p class="hint">⚠ Tránh đá: ${esc(arr(c.kyCrystals))} (hành ${esc(c.kyVi || '')}).</p>`; }
  } catch (e) {}
  // Trang phục
  try {
    const cl = clothingByOccasion(R);
    const text = cl.advice || cl.summary || '';
    if (text) html += `<h4 class="syn-h4" style="margin-top:8px">👕 Trang phục & màu sắc</h4><p class="hint">${esc(text)}</p>`;
  } catch (e) {}
  // Generic lifestyle sections (workout/plant/music/tea/aroma) — tìm summary string tốt nhất
  const bestText = (o) => o.summary || o.advice || o.tip || o.recommendation || Object.values(o).find((v) => typeof v === 'string' && v.length > 30) || '';
  const gen = (title, fn) => {
    try { const o = fn(R); const t = bestText(o); if (t) html += `<p class="hint"><b>${title}:</b> ${esc(t)}</p>`; } catch (e) {}
  };
  gen('🏃 Vận động', personalWorkout);
  gen('🌱 Cây phong thủy', plantFengShui);
  gen('🎵 Âm nhạc trị liệu', musicTherapy);
  gen('🍵 Trà dưỡng sinh', teaTherapy);
  gen('💧 Tinh dầu', aromaTherapy);
  el.innerHTML = html || '<p class="hint">Không tính được lifestyle.</p>';
}

function renderMarriageStars(R) {
  const el = $('marriage-stars');
  if (!el) return;
  try {
    const m = marriageStars(R);
    // [loop 200] hiển thị sao hôn nhân cổ chi tiết (trước đây chỉ show summary)
    const levelCls = m.level === 'tốt' || m.level === 'cat' ? 'rate-cat' : m.level === 'xấu' || m.level === 'hung' ? 'rate-hung' : 'rate-mid';
    const flags = `${m.hasGuan ? '✓ có Chính Quan/Seven Sát (sao chồng)' : '✗ thiếu sao chồng (Quan)'} · ${m.hasNoble ? '✓ có quý nhân hộ hôn' : ''}`;
    const hits = (m.hits || []).map((s) => {
      const sev = s.severity || 0;
      const cls = sev >= 6 ? 'rate-hung' : sev >= 3 ? 'rate-bad' : 'rate-mid';
      return `<div class="yz-row" style="border-left:3px solid ${sev >= 6 ? 'var(--cinnabar)' : 'var(--gold)'};padding-left:8px;margin:4px 0">
        <b class="zh">${esc(s.star)}</b> ${esc(s.starVi || '')} <span class="ln-rate ${cls}">trọng ${sev}/10</span> @ ${esc(s.pillarVi || s.pillar || '')} <span class="zh">(${esc(s.ganZhi || '')})</span>
        ${s.mitigated ? '<span class="geju-xi">★ đã hóa giải</span>' : ''}
        <div class="hint">${esc(s.meaning || '')}</div>
        ${s.verse ? `<div class="hint" style="font-style:italic">${esc(s.verse)}</div>` : ''}
        ${s.mitigation && !s.mitigated ? `<div class="hint">💭 Hóa giải: ${esc(s.mitigation)}</div>` : ''}</div>`;
    }).join('');
    el.innerHTML = `
      <p><b>Sao hôn nhân cổ — cấp:</b> <span class="ln-rate ${levelCls}">${esc(m.level || '')}</span> · <span class="hint">${flags}</span></p>
      ${hits || '<p class="hint">Không kích hoạt sao hôn nhân đặc biệt.</p>'}
      <p class="hint" style="margin-top:4px">${esc(m.summary || '')}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được sao hôn nhân cổ.</p>'; }
}

function renderMonthlySha() {
  const el = $('monthly-sha');
  if (!el) return;
  try {
    const now = new Date();
    const ms = monthlySha(now.getFullYear(), now.getMonth() + 1, now.getDate());
    // [loop 202] hiển thị 月煞/月建/月破 dạng badge hướng (trước đây chỉ show summary)
    const taboo = new Set(ms.tabooDirs || []);
    const ALL = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
    const badges = ALL.map((d) => `<span class="ln-rate ${taboo.has(d) ? 'rate-hung' : 'rate-cat'}" style="margin:2px">${d}${taboo.has(d) ? ' ⚠' : ''}</span>`).join(' ');
    el.innerHTML = `
      <p><b>Tháng <span class="zh">${esc(ms.monthZhi || '')}</span></b> · 月三煞: <b style="color:var(--cinnabar)">${esc(ms.yueSha3 || '')}</b> · 月建: ${esc(ms.yueJian || '')} · 月破: <b style="color:var(--cinnabar)">${esc(ms.yuePo || '')}</b></p>
      <div style="margin:6px 0">${badges}</div>
      <p class="hint">⚠ <b>Tránh động thổ/cải tạo/dời nhà</b> về hướng đỏ; ưu tiên hướng xanh. ${esc(ms.summary || '')}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được sát phương tháng.</p>'; }
}

// ---------------------------------------------------------------- TƯỚNG THUẬT 相术
const PH_TONE_CLS = { cat: 'rate-cat', hung: 'rate-hung', neutral: 'rate-mid' };
const PH_TONE_BADGE = { cat: '🟢 Cát', hung: '🔴 Hung', neutral: '⚪ Trung' };

// Đổ 12 cung + nốt ruồi vào <select>
function initPhysiognomySelects() {
  const palaceSel = $('ph-palace');
  const moleSel = $('ph-mole');
  if (palaceSel && !palaceSel.dataset.filled) {
    palaceSel.innerHTML = '<option value="">— 12 cung —</option>' +
      Object.entries(FACE_PALACES).map(([zh, p]) =>
        `<option value="${esc(zh)}">${esc(p.vi)} (${esc(zh)}) — ${esc(p.pos)}</option>`).join('');
    palaceSel.dataset.filled = '1';
  }
  if (moleSel && !moleSel.dataset.filled) {
    moleSel.innerHTML = '<option value="">— nốt ruồi —</option>' +
      Object.entries(MOLE_POSITIONS).map(([zh, m]) =>
        `<option value="${esc(zh)}">${esc(m.vi)} (${esc(zh)}) [${m.tone === 'cat' ? 'cat' : 'hung'}]</option>`).join('');
    moleSel.dataset.filled = '1';
  }
}

function renderPhPalace() {
  const el = $('ph-palace-out');
  if (!el) return;
  const name = $('ph-palace').value;
  if (!name) { el.innerHTML = '<p class="hint">Chọn 1 cung để xem luận giải.</p>'; return; }
  const p = getFacePalace(name);
  if (!p) { el.innerHTML = '<p class="hint">Không tra được cung này.</p>'; return; }
  el.innerHTML = `
    <h3 style="margin:6px 0">${esc(p.vi)} <span class="zh">${esc(p.name)}</span>
      <span class="hint-inline">${PH_TONE_BADGE[p.tone]}</span></h3>
    <p class="hint"><b>Vị trí:</b> ${esc(p.pos)} &nbsp;|&nbsp; <b>Lĩnh vực:</b> ${esc(p.domain)}</p>
    <ul>
      <li><b>🟢 Tốt (丰隆/明润):</b> ${esc(p.good)}</li>
      <li><b>🔴 Xấu (凹陷/暗沉/疤痕):</b> ${esc(p.bad)}</li>
      <li><b>⚪ Trung bình:</b> ${esc(p.neutral)}</li>
    </ul>`;
}

function renderPhMole() {
  const el = $('ph-mole-out');
  if (!el) return;
  const pos = $('ph-mole').value;
  if (!pos) { el.innerHTML = '<p class="hint">Chọn vị trí nốt ruồi để xem ý nghĩa.</p>'; return; }
  const m = getMoleReading(pos);
  if (!m) { el.innerHTML = '<p class="hint">Không tra được vị trí này.</p>'; return; }
  el.innerHTML = `
    <h3 style="margin:6px 0">Nốt ruồi ${esc(m.vi)} <span class="zh">${esc(m.position)}</span>
      <span class="${PH_TONE_CLS[m.tone]}" style="padding:2px 8px;border-radius:8px;font-size:12px">${PH_TONE_BADGE[m.tone]}</span></h3>
    <p>${esc(m.meaning)}</p>`;
}

function renderPhAge() {
  const el = $('ph-age-out');
  if (!el) return;
  const raw = $('ph-age').value;
  if (!raw) { el.innerHTML = '<p class="hint">Nhập tuổi (1-99) để xem vùng mặt cần soi.</p>'; return; }
  const a = getAgeFaceMap(raw);
  if (!a) { el.innerHTML = '<p class="hint">Tuổi không hợp lệ (1-99).</p>'; return; }
  el.innerHTML = `
    <h3 style="margin:6px 0">Tuổi ${esc(a.age)} <span class="hint-inline">(mốc 流年 ${a.milestone})</span></h3>
    <p><b>Vùng mặt cần soi:</b> ${esc(a.position)}</p>`;
}

function renderPhOverview() {
  const el = $('ph-overview');
  if (!el) return;
  const ov = physiognomyOverview();
  el.textContent = `相术: ${ov.totals.palaces} cung mặt · ${ov.totals.moles} vị trí nốt ruồi (${ov.totals.catMoles} cat / ${ov.totals.hungMoles} hung) · ${ov.totals.ageMilestones} mốc 流年 (tuổi ↔ vị trí).`;
}

// ---- 测字 CHẨM TỰ (Character Divination) ----
function renderCezi() {
  const el = $('cz-out');
  if (!el) return;
  const input = $('cz-char');
  const raw = (input?.value || '').trim();
  if (!raw) {
    el.innerHTML = '<p class="hint">Hãy nhập 1 chữ Hán rồi bấm "Luận chữ". Vd: 福 (phúc), 龍 (rồng), 水 (nước), 财 (tài).</p>';
    return;
  }
  try {
    const r = ceziDivination(raw);
    if (!r) {
      el.innerHTML = '<p class="hint">⚠ Chỉ nhận KÝ TỰ HÁN (CJK). Ký tự la-tinh / số / dấu câu không luận được. Thử lại với chữ Hán như 福, 龍, 水.</p>';
      return;
    }
    const h = r.hexagram;
    const toneCls = r.fortune.tone === 'cat' ? 'cat' : (r.fortune.tone === 'hung' ? 'hung' : 'mid');
    el.innerHTML = `
      <h3 style="margin:6px 0">字 「<span style="font-size:1.6em">${esc(r.char)}</span>」 — <span class="${toneCls}">${esc(r.fortune.toneVi)}</span></h3>
      <p><b>Bộ thủ 部首:</b> ${esc(r.radical)} (${r.radicalStrokes} nét) · <b>Tổng nét (康熙):</b> ${r.strokes} · <b>Ngũ hành:</b> ${esc(r.wxVi)} (${r.wx})${r.usedFallback ? ' <span class="hint-inline">(ước lượng — chữ chưa trong bảng)</span>' : ''}</p>
      ${r.decomposition ? `<p><b>拆字 (phân tách):</b> ${esc(r.decomposition)}</p>` : ''}
      ${r.meaning ? `<p><b>Ý nghĩa:</b> ${esc(r.meaning)}</p>` : ''}
      <p><b>Quẻ 梅花:</b> thượng ${esc(h.upper.img)} ${esc(h.upper.vi)} (${esc(h.upper.ele)}, ${esc(h.upper.wx)}) · hạ ${esc(h.lower.img)} ${esc(h.lower.vi)} (${esc(h.lower.ele)}, ${esc(h.lower.wx)}) → <b>「${esc(h.name)}」</b> (${esc(h.nameVi)}). Hào động: ${h.changing}.</p>
      <p><b>Quan hệ thể-dụng:</b> ${esc(h.relation.vi)} — <b>${esc(h.relation.luck)}</b>. <b>Quẻ biến:</b> 「${esc(h.bian.name)}」 (${esc(h.bian.nameVi)}).</p>
      <ul style="margin:8px 0 0; padding-left:20px">${r.fortune.lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
      <p class="hint" style="margin-top:8px">⚠ 测字 là thú tra cứu tham khảo (拆字 + 梅花), mang tính gợi mở — KHÔNG thay bát tự / tử vi. Kết quả phụ thuộc cách viết (thủ/phồn thể) và bảng nét.</p>`;
  } catch (e) {
    el.innerHTML = `<p class="hint">Không luận được chữ: ${esc(e.message)}</p>`;
  }
}


function renderAnnualDirection(R) {
  const el = $('annual-direction');
  if (!el) return;
  try {
    const ad = annualDirection(R, new Date().getFullYear());
    el.innerHTML = `<p>${ad.summary}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được hướng cát × lưu niên.</p>'; }
}

function renderTodayZheri() {
  const el = $('today-zheri');
  if (!el) return;
  try {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth() + 1, d = now.getDate();
    const sp = analyzeDaySpecial(y, m, d);
    const de = analyzeDeRi(y, m, d);
    const xi = analyzeXiongRi(y, m, d);
    const ms = analyzeMonthShen(y, m, d);
    const nx = nextTianShe(y, m, d, 2);
    const tags = [];
    sp.special.forEach((s) => tags.push(`<b style="color:var(--cat,#2a7)">${s.typeVi}</b>`));
    de.hits.forEach((h) => tags.push(`<b style="color:var(--cat,#2a7)">${h.keyVi}</b>`));
    xi.hits.forEach((h) => tags.push(`<b style="color:var(--hung,#c33)">${h.typeVi}</b>`));
    ms.hits.forEach((h) => tags.push(`<b>${h.keyVi}</b>`));
    el.innerHTML = `
      <p>Hôm nay ${sp.solar} (${sp.ganZhi}): ${tags.length ? tags.join(' · ') : '<span class="hint">ngày thường (không phạm sao đặc biệt)</span>'}</p>
      ${nx.length ? `<p class="hint">天赦 gần nhất: ${nx.map((t) => t.solar + '(' + t.ganZhi + ')').join(', ')}</p>` : ''}`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được hôm nay择日.</p>'; }
}

// ---------------------------------------------------------------- 黄道十二神 (12 DEITIES YELLOW/BLACK ROAD)
function renderHuangdao() {
  const el = $('huangdao');
  if (!el) return;
  try {
    const now = new Date();
    const today = huangdao12(now.getFullYear(), now.getMonth() + 1, now.getDate());

    // Scan forward from today for the next 3 黄道 (cat) days.
    const next = [];
    const probe = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    let guard = 0;
    while (next.length < 3 && guard < 60) {
      const r = huangdao12(probe.getFullYear(), probe.getMonth() + 1, probe.getDate());
      if (r.tone === 'cat') next.push(r);
      probe.setDate(probe.getDate() + 1);
      guard++;
    }

    el.innerHTML =
      renderHuangdaoCard(today) +
      (next.length
        ? `<h4 class="syn-h4" style="margin-top:8px">3 ngày 黄道 (hoàng đạo) gần nhất</h4>
           <div class="ln-decade" style="display:flex;flex-wrap:wrap;gap:6px">${next.map((r) => `
             <div class="ln">
               <div class="ln-year">${r.solar}</div>
               <div class="ln-gz"><span class="zh">${r.dayGanZhi}</span></div>
               <div class="ln-rate rate-cat"><span class="zh">${r.deity}</span> ${r.deityVi}</div>
               <div class="ln-flags">${r.domain}</div>
             </div>`).join('')}</div>`
        : '<p class="hint">Không tìm thấy ngày hoàng đạo trong 60 ngày tới.</p>');
  } catch (e) {
    el.innerHTML = '<p class="hint">Không tính được 黄道十二神.</p>';
    console.warn('huangdao', e.message);
  }
}

// ---------------------------------------------------------------- 董公择日 (DONG GONG DATE SELECTION)
function renderDonggongDay(r) {
  const el = $('donggong');
  if (!el) return;
  const toneCls = r.tone === 'cat' ? 'rate-cat' : r.tone === 'hung' ? 'rate-hung' : '';
  const flagBits = [];
  if (r.heMonth) flagBits.push(`<span class="ln-rate rate-cat">合月 (tam hợp)</span>`);
  if (r.chongMonth) flagBits.push(`<span class="ln-rate rate-hung">冲月 (xung chi tháng)</span>`);
  el.innerHTML = `
    <div class="zr-head"><b>${esc(r.solar)}</b> (ÂL ${esc(r.lunar)}) · <span class="zh">${esc(r.dayGanZhi)}</span> · Trực <b class="zh">${esc(r.officer)}</b> (${esc(r.officerVi)}) · ${r.monthZhi}月 <span class="ln-rate ${toneCls}">${esc(r.toneVi)}</span> · <b>${esc(r.rating)}</b> (${r.score}/100) ${flagBits.join(' ')}</div>
    <p><b>Ý nghĩa:</b> ${esc(r.meaning)}</p>
    ${r.monthNote ? `<p class="hint">⚠ Biến thể tháng ${esc(r.monthZhi)}: ${esc(r.monthNote)}</p>` : ''}
    <p class="zr-advice">→ ${esc(r.advice)}</p>
    <p><b style="color:var(--cat,#2a7)">宜 (nên):</b> ${r.good.map((g) => esc(g)).join(' · ')}</p>
    <p><b style="color:var(--hung,#c33)">忌 (kỵ):</b> ${r.bad.map((b) => esc(b)).join(' · ')}</p>`;
}

function renderDonggongMonth(year, month) {
  const el = $('donggong');
  if (!el) return;
  try {
    const mm = donggongInMonth(year, month);
    el.innerHTML = `
      <div class="zr-head"><b>董公 — ${esc(mm.year)}-${String(mm.month).padStart(2,'0')}</b> (${mm.total} ngày)</div>
      <h4 class="syn-h4" style="margin-top:8px;color:var(--cat,#2a7)">3 ngày CÁT nhất</h4>
      <div class="ln-decade" style="display:flex;flex-wrap:wrap;gap:6px">${mm.best3.map((d) => `
        <div class="ln">
          <div class="ln-year">${esc(d.solar)}</div>
          <div class="ln-gz"><span class="zh">${esc(d.gz)}</span> ${esc(d.officerVi)} <b class="zh">${esc(d.officer)}</b></div>
          <div class="ln-rate rate-cat">${esc(d.rating)} (${d.score})</div>
          <div class="ln-flags">${d.activities.map((a) => esc(a)).join('; ')}</div>
        </div>`).join('')}</div>
      <h4 class="syn-h4" style="margin-top:8px;color:var(--hung,#c33)">3 ngày HUNG nhất</h4>
      <div class="ln-decade" style="display:flex;flex-wrap:wrap;gap:6px">${mm.worst3.map((d) => `
        <div class="ln">
          <div class="ln-year">${esc(d.solar)}</div>
          <div class="ln-gz"><span class="zh">${esc(d.gz)}</span> ${esc(d.officerVi)} <b class="zh">${esc(d.officer)}</b></div>
          <div class="ln-rate rate-hung">${esc(d.rating)} (${d.score})</div>
          <div class="ln-flags">Kỵ: ${d.bad.map((a) => esc(a)).join('; ')}</div>
        </div>`).join('')}</div>
      <p class="hint" style="margin-top:8px">董公择日 (rút gọn) dựa trên 12 trực + biến thể theo tháng — tham khảo, kết hợp với tuổi / dụng thần / hoàng đạo để chọn ngày trọn vẹn.</p>`;
  } catch (e) {
    el.innerHTML = '<p class="hint">Không quét được tháng theo 董公.</p>';
    console.warn('donggongMonth', e.message);
  }
}

function runDonggongDay() {
  const el = $('donggong');
  if (!el) return;
  const v = $('dg-date').value;
  try {
    let y, m, d;
    if (v) {
      [y, m, d] = v.split('-').map(Number);
    } else {
      const now = new Date(); y = now.getFullYear(); m = now.getMonth() + 1; d = now.getDate();
    }
    const r = donggongDay(y, m, d);
    renderDonggongDay(r);
  } catch (e) {
    el.innerHTML = `<p class="hint">Không luận được ngày theo 董公: ${esc(e.message)}</p>`;
  }
}

function runDonggongMonth() {
  const v = $('dg-date').value;
  let y, m;
  if (v) { [y, m] = v.split('-').map(Number); }
  else { const now = new Date(); y = now.getFullYear(); m = now.getMonth() + 1; }
  renderDonggongMonth(y, m);
}

function renderDonggong() {
  // Mặc định: luận hôm nay khi card first render
  const now = new Date();
  try { renderDonggongDay(); } catch (e) { console.warn('donggong', e.message); }
}

function renderZiweiSanfang(R) {
  const el = $('ziwei-sanfang');
  if (!el) return;
  try {
    const inp = R.chart.input;
    const zr = computeZiwei(inp.year, inp.month, inp.day, inp.hour, inp.minute, inp.gender);
    const core = ziweiCoreReading(zr);
    // [loop 201] hiển thị 4 cung tam phương tứ chính + sao (trước đây chỉ show summary)
    const cc = core.core || {};
    const detailHtml = Array.isArray(cc.detail) && cc.detail.length ? cc.detail.map((p) => {
      const roleCls = p.role === '本宫' ? 'rate-cat' : 'rate-mid';
      const stars = (p.stars && p.stars.length) ? p.stars.map((s) => `<span class="zh">${esc(s)}</span>`).join(' ') : '<span class="hint">(cung trống)</span>';
      return `<div class="yz-row" style="margin:3px 0;padding-left:8px;border-left:3px solid ${p.role === '本宫' ? 'var(--gold)' : 'var(--silk-muted)'}">
        <b><span class="zh">${esc(p.zhi || '')}</span> ${esc(p.palaceVi || '')}</b> <span class="ln-rate ${roleCls}">${esc(p.role || '')}</span>
        <div>★ ${stars}</div></div>`;
    }).join('') : '';
    el.innerHTML = `
      <p><b>Cung焦 điểm:</b> <span class="zh">${esc(cc.focusZhi || '')}</span> ${esc(cc.focusPalace || '')}</p>
      ${detailHtml}
      <p class="hint" style="margin-top:4px">${esc(core.summary || '')}</p>`;
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được Tử Vi tam phương tứ chính.</p>'; }
}

// ---------------------------------------------------------------- 七政四余 (QI ZHENG SI YU — real-planet astrology)
function renderQizheng(R) {
  const el = $('qizheng');
  if (!el) return;
  try {
    const inp = R.chart.input;
    const r = qizheng(inp.year, inp.month, inp.day, inp.hour, inp.minute, 7);
    el.innerHTML = renderQizhengCard(r);
  } catch (e) {
    el.innerHTML = '<p class="hint">Không tính được 七政四余.</p>';
    console.warn('qizheng', e.message);
  }
}

// ---------------------------------------------------------------- 天星择日 (TIAN XING ZHE RI — star date selection)
// Module tương tác: user chọn 24-mountain sitting → chấm 60 ngày tới → top 5 tốt + 3 kỵ.
function renderTianxingZheri() {
  const el = $('tianxing-zheri');
  if (!el) return;
  // build <select> 24 sơn (theo thứ tự la bàn tiết-khí)
  const opts = TX_MOUNTAINS_24.map((m) => '<option value="' + m + '">' + MOUNTAIN_VI[m] + ' (' + m + ')</option>').join('');
  el.innerHTML =
    '<p class="hint">Chọn sơn <b>TỌA</b> (坐) → module chấm 60 ngày tới theo vị trí thật của 7 chính tinh tới sơn/hướng. 太阳到向 +5, 太阴到山 +4, 恩用仇难, 调候 mùa; cấm 罗计掩日月 (cửa nhật/nguyệt thực). <em>24 sơn neo theo tiết khí (冬至→子).</em></p>' +
    '<div class="yz-select"><label>Chọn sơn TỌA (坐): </label><select id="tx-sitting">' + opts + '</select>' +
    '<label style="margin-left:12px">Hệ ngũ hành: </label><select id="tx-system"><option value="huaji">化气 (mặc định)</option><option value="zhengti">正体</option></select></div>' +
    '<div id="tx-result"></div>';
  function paint(sitting, system) {
    const out = $('tx-result');
    if (!out) return;
    try {
      const now = new Date();
      const r = tianxingZheri(sitting, now.getFullYear(), now.getMonth() + 1, now.getDate(), 60, { mountainSystem: system });
      out.innerHTML = renderTianxingCard(r);
    } catch (e) {
      out.innerHTML = '<p class="hint">Không tính được 天星择日: ' + esc(e.message) + '</p>';
      console.warn('tianxing', e.message);
    }
  }
  const sel = $('tx-sitting');
  const sys = $('tx-system');
  if (sel) {
    sel.value = '子';
    const update = () => paint(sel.value, sys.value);
    sel.addEventListener('change', update);
    if (sys) sys.addEventListener('change', update);
    paint('子', 'huaji');
  }
}

function renderGoldenYear(R) {
  const el = $('golden-year');
  if (!el) return;
  try {
    const gy = findGoldenYear(R, new Date().getFullYear(), 10);
    // [loop 222] hiển thị details (6 hệ thống) + isTrulyGolden (trước đây chỉ score trần)
    el.innerHTML = gy.ranked.slice(0, 5).map((y, i) => {
      const details = (y.details || []).map((d) => `<span class="hint" style="margin-right:6px">${esc(d)}</span>`).join('');
      const goldTag = y.isTrulyGolden ? '<span class="geju-xi" title="Đại vận + Lưu niên đều mang Dụng/Hỷ → NĂM VÀNG cổ pháp">★ NĂM VÀNG</span>' : '';
      return `
      <div class="yz-row" style="border-left:3px solid ${y.totalScore >= 60 ? 'var(--jade)' : 'var(--gold)'};margin:4px 0;padding-left:8px">
        <b>#${y.rank || i + 1} ${y.year}</b> <span class="zh">${esc(y.ganZhi)}</span> <span class="ln-rate ${y.totalScore >= 60 ? 'rate-cat' : y.totalScore >= 48 ? 'rate-mid' : 'rate-hung'}">${y.totalScore}/100 ${y.alert || ''}</span> ${goldTag}
        <div style="margin-top:2px">${details}</div>
      </div>`;
    }).join('')
    + (gy.golden ? `<p class="hint" style="margin-top:6px">🏆 Năm VÀNG thực sự: ${gy.golden.year} (${gy.golden.ganZhi}) — Đại vận + Lưu niên đều mang Dụng/Hỷ.</p>` : '<p class="hint" style="margin-top:6px">Chưa có «năm vàng» thực sự (đại运+lưu niên cùng Dụng) trong 10 năm tới — năm tốt nhất trên là cao điểm tương đối.</p>');
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được năm hoàng kim.</p>'; }
}

function renderForecast5(R) {
  const el = $('forecast5');
  if (!el) return;
  try {
    const f5 = forecast5(R, new Date().getFullYear(), 5);
    el.innerHTML = f5.years.map((y) => {
      // [loop 221] hiển thị shen12 + dayunGod + positives/alerts (trước đây chỉ score trần)
      const ctx = [];
      if (y.shen12) ctx.push(`12神: ${esc(y.shen12)}`);
      if (y.dayunGod) ctx.push(`运 ${esc(y.dayunGod)}`);
      const posHtml = (y.positives || []).length ? `<div class="hint" style="color:#9fe0b8">✓ ${y.positives.map(esc).join('; ')}</div>` : '';
      const alertHtml = (y.alerts || []).length ? `<div class="hint" style="color:#f0a99c">⚠ ${y.alerts.map(esc).join('; ')}</div>` : '';
      const isNow = y.year === new Date().getFullYear();
      return `
      <div class="yz-row ${isNow ? 'dy-now' : ''}" style="border-left:3px solid ${isNow ? 'var(--gold)' : y.tone === 'cat' ? 'var(--jade)' : y.tone === 'hung' ? 'var(--cinnabar)' : 'var(--gold)'};margin:4px 0;padding-left:8px">
        <b>${y.year}${isNow ? ' ★' : ''}</b> <span class="zh">${esc(y.ganZhi)}</span> <span class="ln-rate ${rateClass(y.rating)}">${esc(y.rating)} (${y.score}/100)</span>
        ${ctx.length ? ` <span class="hint">${ctx.join(' · ')}</span>` : ''}
        ${posHtml}${alertHtml}
      </div>`;
    }).join('') + (f5.activeDayun ? `<p class="hint" style="margin-top:4px">Đại vận đang hành: ${f5.activeDayun.ganZhi} [${f5.activeDayun.startAge}-${f5.activeDayun.startAge + 9}t]</p>` : '');
  } catch (e) { el.innerHTML = '<p class="hint">Không tính được forecast 5 năm.</p>'; }
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
    $('topic-body').innerHTML = `<h3>${esc(block.title)}</h3>${block.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}`;
    return;
  }
  const ta = tieredAnalysis(currentResult, currentTopic);
  $('topic-body').innerHTML = `
    <h3>${esc(ta.topic)}</h3>
    <p class="tier-intro">Phân tích <b>9 tầng</b> cổ pháp — từ bản khí đến kết luận cấp độ:</p>
    <div class="tier-list">${ta.tiers.map((t) => `
      <div class="tier">
        <div class="tier-head"><span class="tier-n">T${esc(t.n)}</span><span class="tier-name">${esc(t.name)}</span></div>
        <div class="tier-text">${esc(t.text)}</div>
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
    ? `<div class="remedy-timing"><b>⏰ Thời điểm vàng (lưu niên CÁT mang Dụng/Hỷ):</b> ${rm.timing.map((t) => `${esc(t.year)} (${esc(t.rating)})`).join(', ')}</div>` : '';
  const specific = (rm.specific || []).length
    ? `<div class="remedy-specific"><b>🛡 Hóa giải tổ hợp hung:</b>${rm.specific.map((s) => `<div class="sp-item"><b>${esc(s.combo)}</b>: ${esc(s.remedy)}</div>`).join('')}</div>` : '';
  $('remedy').innerHTML = `
    <div class="remedy-liaofan">${esc(rm.liaofan.principle)}</div>
    <div class="remedy-byel"><b>Bổ Dụng ${esc(rm.byElement.dung.wx)} / phối Hỷ ${esc(rm.byElement.hy.wx)}:</b>
      phương <b>${esc(rm.byElement.dung.direction)}</b>; màu <b>${esc(rm.byElement.dung.color)}</b>; nghề <b>${esc(rm.byElement.dung.career.split('，')[0])}</b>; nhà ${esc(rm.byElement.dung.house)}; số ${esc(rm.byElement.dung.number)}; thực phẩm ${esc(rm.byElement.dung.food.split('，')[0])}.</div>
    ${timing}
    <h4 class="syn-h4">改运十二法 (12 pháp cải vận)</h4>
    <div class="laws">${rm.twelveLaws.map((l) => `<div class="law">${esc(l)}</div>`).join('')}</div>
    ${specific}
    <div class="remedy-quote">${esc(rm.liaofan.quote)}</div>
    <div class="remedy-core">${esc(rm.liaofan.coreMethod)}</div>`;
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

let _aiBusy = false;
async function handleAsk() {
  if (!currentResult || _aiBusy) return;
  const q = $('question').value.trim();
  if (!q) return;
  $('question').value = '';
  _aiBusy = true;
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
  } finally {
    _aiBusy = false;
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
// ---- Lazy-render (Task 2): defer heavy cards below the fold ----
// Giữ nguyên import/render logic; chỉ bọc lời gọi render trong kiểm tra viewport.
// Fallback: không có IntersectionObserver → render ngay (giữ hành vi cũ).
const _lazyRendered = new Set(); // track哪些 card đã render để không render 2 lần
const _lazyIO = (typeof IntersectionObserver !== 'undefined')
  ? new IntersectionObserver((entries) => {
      for (const ent of entries) {
        if (ent.isIntersecting) {
          const fn = ent.target.__lazyRender;
          if (fn && !_lazyRendered.has(ent.target)) {
            _lazyRendered.add(ent.target);
            try { fn(); } catch (e) { console.warn('lazyRender', e.message); if (ent.target && !ent.target.innerHTML.trim()) ent.target.innerHTML = '<p class="hint">Không hiển thị được mục này — thử phân tích lại.</p>'; }
          }
          _lazyIO.unobserve(ent.target);
        }
      }
    }, { rootMargin: '300px 0px' }) // trigger trước 300px khi sắp vào viewport
  : null;

/**
 * lazyRender(innerId, fn):
 *   - Tìm thẻ .card chứa phần tử #innerId.
 *   - Nếu card đã trong viewport (hoặc không có IO) → gọi fn() NGAY.
 *   - Nếu chưa → đăng ký IO, render khi user cuộn tới (rootMargin 300px).
 *   - An toàn: render đúng 1 lần; fallback = hành vi cũ (render tất cả).
 */
function lazyRender(innerId, fn) {
  const inner = typeof innerId === 'string' ? $(innerId) : innerId;
  const card = inner ? inner.closest('.card') : null;
  // Không có IO hoặc không tìm thấy card → render ngay (fallback an toàn)
  if (!_lazyIO || !card) { try { fn(); } catch (e) { console.warn('lazyRender fallback', e.message); } return; }
  if (_lazyRendered.has(card)) { try { fn(); } catch (e) { console.warn('lazyRender', e.message); } return; }
  // Kiểm tra nhanh: card đã trong viewport?
  const rect = card.getBoundingClientRect();
  const near = rect.top < (window.innerHeight + 300) && rect.bottom > -300;
  if (near || card.offsetParent === null && rect.top === 0 && rect.bottom === 0) {
    _lazyRendered.add(card);
    try { fn(); } catch (e) { console.warn('lazyRender', e.message); }
    return;
  }
  // Chưa tới → đăng ký IO, hiện placeholder nhẹ
  card.__lazyRender = fn;
  if (inner) inner.innerHTML = '<p class="hint" style="opacity:.6">⏳ Đang tải… (cuộn tới để hiển thị)</p>';
  _lazyIO.observe(card);
}

function run() {
  const dateVal = $('date').value;
  const timeVal = $('time').value || '12:00';
  if (!dateVal) return;
  const [y0, m0, d0] = dateVal.split('-').map(Number);
  const [hh0, mm0] = timeVal.split(':').map(Number);
  const gender = document.querySelector('input[name="gender"]:checked').value;
  // [loop 23] Múi giờ + 真太阳时 (giờ Mặt Trời thật theo kinh độ nơi sinh).
  //   Bát Tự dùng 真太阳时 — đồng hồ múi giờ chỉ là xấp xỉ. Sinh gần ranh 时辰 thì sai vài
  //   phút có đổi 时柱. Có city/longitude → hiệu chỉnh; không thì dùng giờ nhập y nguyên.
  const tz = parseFloat($('tz').value) || 7;
  const cityVal = $('city').value;
  let longitude = null;
  if (cityVal === 'manual') { const lv = parseFloat($('long').value); longitude = Number.isFinite(lv) && lv >= -180 && lv <= 180 ? lv : null; }
  else if (cityVal && !Number.isNaN(parseFloat(cityVal))) longitude = parseFloat(cityVal);
  const tt = trueSolarTime({ year: y0, month: m0, day: d0, hour: hh0, minute: mm0, tzOffset: tz, longitude });
  const y = tt.solar.year, m = tt.solar.month, d = tt.solar.day, hh = tt.solar.hour, mm = tt.solar.minute;
  // persist birth data
  try { localStorage.setItem('bazi-birth', JSON.stringify({ date: dateVal, time: timeVal, gender, tz, city: cityVal, long: $('long') ? $('long').value : '' })); } catch (e) {}
  // hiển thị note 真太阳时
  const ttNote = $('truetime-note');
  if (ttNote) {
    const same = (y === y0 && m === m0 && d === d0 && hh === hh0 && mm === mm0);
    ttNote.style.display = 'block';
    ttNote.innerHTML = (tt.usedTrueSolar && !same)
      ? `🕐 <b>${tt.note}</b> ⚠ Trụ Giờ có thể ĐỔI do hiệu chỉnh — kết quả dùng 真太阳时.`
      : `🕐 ${tt.note}`;
  }

  // [loop 199] defensive: analyze() có thể throw trên ngày biên (lunar-javascript validate
  //   tháng/ngày) hoặc sau hiệu chỉnh 真太阳时. UI dùng type=date/time (constrained) nên hiếm,
  //   nhưng bọc try/catch để hiện lỗi thân thiện thay vì crash cả trang.
  try {
    currentResult = analyze(y, m, d, hh, mm, gender);
  } catch (e) {
    currentResult = null;
    const res = $('result');
    if (res) res.innerHTML = '<p class="hint" style="color:var(--cinnabar);padding:16px">⚠ Không tính được lá số cho ' + esc(y + '/' + m + '/' + d + ' ' + hh + ':' + String(mm).padStart(2, '0')) + ': ' + esc(e.message) + '. Thử ngày/giờ khác (có thể do ranh tiết khí hoặc ngoài khoảng hỗ trợ).</p>';
    if (res) res.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  const c = currentResult.chart;
  // Reset lazy-render state (Task 2): mỗi lần run() → có thể render lại tất cả card.
  // disconnect() tháo toàn bộ observer cũ — những card dưới nếp chưa kịp fire sẽ được
  // đăng ký lại bên dưới với closure mới (currentResult mới), tránh render dữ liệu cũ.
  if (_lazyIO) _lazyIO.disconnect();
  _lazyRendered.clear();

  const ty = taiYuan(c.pillars.month.gan, c.pillars.month.zhi);
  $('meta-line').textContent =
    `Dương lịch: ${c.solar} · Âm lịch: ${c.lunar.year}/${c.lunar.month}/${c.lunar.day} · ` +
    `Tiết khí: ${c.jieqi.prev.name} · Thai nguyên: ${ty.ganZhi} (${ty.ganVi} ${ty.zhiVi} — ${ty.wx})`;

  renderPillars(c);
  renderVerdict(currentResult);
  renderSynthesis(currentResult);
  renderQianli(currentResult);
  renderMangpai(currentResult);
  renderMangpaiView(currentResult);
  renderGaimenh(currentResult);
  const xkYear = new Date().getFullYear();
  $('xk-year').value = xkYear;
  renderXuankong(xkYear);
  initDaguaSelects(); renderDagua();
  renderClassic(currentResult);
  renderZiwei();
  try { renderLnSihua(currentResult); } catch (e) { console.warn('lnSihua', e.message); }
  renderLiuqin(currentResult);
  renderRemedy(currentResult);
  window._currentResult = currentResult; // [loop 140] cho renderWuXing truy cập monthMainWx
  renderWuXing(currentResult.wx, currentResult.yong);
  renderInteractions(currentResult);
  renderShensha(currentResult);
  renderShenshaExtra(currentResult);
  try { renderNobleStars(currentResult); } catch (e) { console.warn('nobleStars', e.message); }
  try { renderExtraShensha(); } catch (e) { console.warn('extraShensha', e.message); }
  try { renderMarriageDeep(); } catch (e) { console.warn('marriageDeep', e.message); }
  renderDaYun(currentResult.dayun);
  renderLiuNian(currentResult.liunian);
  try { renderDailyBriefing(currentResult); } catch (e) { console.warn('dailyBriefing', e.message); }
  // ====== Lazy-render: các card nặng phía dưới (Task 2) ======
  // Giữ TOP ~13 card immediate; phần còn lại render khi cuộn tới (IO) hoặc fallback render ngay.
  lazyRender('life-reading',   () => { try { renderLifeReading(currentResult); } catch (e) { console.warn('lifeReading', e.message); } });
  lazyRender('chenggu',        () => { try { renderChenggu(currentResult); } catch (e) { console.warn('chenggu', e.message); } });
  lazyRender('sanshishu',      () => { try { renderSanshishu(currentResult); } catch (e) { console.warn('sanshishu', e.message); } });
  lazyRender('heluo',          () => { try { renderHeluo(currentResult); } catch (e) { console.warn('heluo', e.message); } });
  lazyRender('yizhangjing',    () => { try { renderYizhangjing(currentResult); } catch (e) { console.warn('yizhangjing', e.message); } });
  lazyRender('decade',         () => { try { renderDecade(currentResult); } catch (e) { console.warn('decade', e.message); } });
  lazyRender('starpower',      () => { try { renderStarPower(currentResult); } catch (e) { console.warn('starpower', e.message); } });
  lazyRender('dir-taboo',      () => { try { renderDirectionTaboo(); } catch (e) { console.warn('dirtaboo', e.message); } });
  lazyRender('water-activation', () => { try { renderWaterActivation(); } catch (e) { console.warn('wateract', e.message); } });
  lazyRender('marriage-timing',() => { try { renderMarriageTiming(currentResult); } catch (e) { console.warn('marriagetiming', e.message); } });
  lazyRender('ideal-house',    () => { try { renderIdealHouse(currentResult); } catch (e) { console.warn('idealhouse', e.message); } });
  lazyRender('wealth-career',  () => { try { renderWealthCareer(currentResult); } catch (e) { console.warn('wealthcareer', e.message); } });
  lazyRender('dominant-god',   () => { try { renderDominantGod(currentResult); } catch (e) { console.warn('dominantgod', e.message); } });
  lazyRender('yanqin',         () => { try { renderYanQin(currentResult); } catch (e) { console.warn('yanqin', e.message); } });
  lazyRender('qinxing',        () => { try { renderQinxing(currentResult); } catch (e) { console.warn('qinxing', e.message); } });
  lazyRender('tonggen',        () => { try { renderTongGen(currentResult); } catch (e) { console.warn('tonggen', e.message); } });
  lazyRender('missing-god',    () => { try { renderMissingGod(currentResult); } catch (e) { console.warn('missinggod', e.message); } });
  lazyRender('sanyuan',        () => { try { renderSanyuan(currentResult); } catch (e) { console.warn('sanyuan', e.message); } });
  lazyRender('ku',             () => { try { renderKu(currentResult); } catch (e) { console.warn('ku', e.message); } });
  lazyRender('fuyin',          () => { try { renderFuyin(currentResult); } catch (e) { console.warn('fuyin', e.message); } });
  lazyRender('dayun-changsheng', () => { try { renderDayunChangSheng(currentResult); } catch (e) { console.warn('dayuncs', e.message); } });
  lazyRender('dayun-yong-changsheng', () => { try { renderDayunYongChangSheng(currentResult); } catch (e) { console.warn('yongcs', e.message); } });
  lazyRender('liunian-changsheng', () => { try { renderLiunianChangSheng(currentResult); } catch (e) { console.warn('liuniancs', e.message); } });
  lazyRender('liuyue-changsheng', () => { try { renderLiuyueChangSheng(currentResult); } catch (e) { console.warn('liuyuecs', e.message); } });
  lazyRender('ziwei-deep',     () => { try { renderZiweiDeep(currentResult); } catch (e) { console.warn('ziweiDeep', e.message); } });
  lazyRender('taisui-general', () => { try { renderTaisuiGeneral(currentResult); } catch (e) { console.warn('taisui', e.message); } });
  lazyRender('taohua',         () => { try { renderTaohua(currentResult); } catch (e) { console.warn('taohua', e.message); } });
  lazyRender('remedy-laws',    () => { try { renderRemedyLaws(currentResult); } catch (e) { console.warn('remedylaws', e.message); } });
  lazyRender('strength-3fa',   () => { try { renderStrength3Fa(currentResult); } catch (e) { console.warn('strength3fa', e.message); } });
  lazyRender('jiaoyun',        () => { try { renderJiaoyun(currentResult); } catch (e) { console.warn('jiaoyun', e.message); } });
  lazyRender('pillar-quality', () => { try { renderPillarQuality(currentResult); } catch (e) { console.warn('pillarquality', e.message); } });
  lazyRender('huaqi',          () => { try { renderHuaqi(currentResult); } catch (e) { console.warn('huaqi', e.message); } });
  lazyRender('han-nuan',       () => { try { renderHanNuan(currentResult); } catch (e) { console.warn('hannuan', e.message); } });
  lazyRender('wx-flow',        () => { try { renderWxFlow(currentResult); } catch (e) { console.warn('wxflow', e.message); } });
  lazyRender('chart-level',    () => { try { renderChartLevel(currentResult); } catch (e) { console.warn('chartlevel', e.message); } });
  lazyRender('minggong',       () => { try { renderMingGong(currentResult); } catch (e) { console.warn('minggong', e.message); } });
  lazyRender('children-star',  () => { try { renderChildrenStar(currentResult); } catch (e) { console.warn('childrenstar', e.message); } });
  lazyRender('family-fortune', () => { try { renderFamilyFortune(currentResult); } catch (e) { console.warn('familyfortune', e.message); } });
  lazyRender('nayin-relation', () => { try { renderNayinRelation(currentResult); } catch (e) { console.warn('nayinrel', e.message); } });
  lazyRender('pattern-quality', () => { try { renderPatternQuality(currentResult); } catch (e) { console.warn('patternquality', e.message); } });
  lazyRender('event-predict',  () => { try { renderEventPredict(currentResult); } catch (e) { console.warn('eventpredict', e.message); } });
  lazyRender('personality-profile', () => { try { renderPersonalityProfile(currentResult); } catch (e) { console.warn('personality', e.message); } });
  lazyRender('mingzhu',         () => { try { renderMingZhu(currentResult); } catch (e) { console.warn('mingzhu', e.message); } });
  lazyRender('daily-pro',       () => { try { renderDailyPro(currentResult); } catch (e) { console.warn('dailypro', e.message); } });
  lazyRender('daily-guide',     () => { try { renderDailyGuide(currentResult); } catch (e) { console.warn('dailyguide', e.message); } });
  lazyRender('five-aspects',    () => { try { renderFiveAspects(currentResult); } catch (e) { console.warn('fiveaspects', e.message); } });
  lazyRender('romance-deep',    () => { try { renderRomanceDeep(currentResult); } catch (e) { console.warn('romancedeep', e.message); } });
  lazyRender('invest-style',    () => { try { renderInvestStyle(currentResult); } catch (e) { console.warn('investstyle', e.message); } });
  lazyRender('lifestyle',       () => { try { renderLifestyle(currentResult); } catch (e) { console.warn('lifestyle', e.message); } });
  lazyRender('bazi-business',   () => { try { renderBaziBusiness(currentResult); } catch (e) { console.warn('bizbusiness', e.message); } });
  lazyRender('seasonal-advice', () => { try { renderSeasonalAdvice(currentResult); } catch (e) { console.warn('seasonal', e.message); } });
  lazyRender('anchong',         () => { try { renderAnchong(currentResult); } catch (e) { console.warn('anchong', e.message); } });
  lazyRender('destiny-timeline', () => { try { renderDestinyTimeline(currentResult); } catch (e) { console.warn('timeline', e.message); } });
  lazyRender('noble-cultivate', () => { try { renderNobleCultivate(currentResult); } catch (e) { console.warn('noble', e.message); } });
  lazyRender('fengshui-extra', () => { try { renderFengshuiExtra(currentResult); } catch (e) { console.warn('fsextra', e.message); } });
  lazyRender('shensha-activation', () => { try { renderShenshaActivation(currentResult); } catch (e) { console.warn('shenshaact', e.message); } });
  lazyRender('personal-fengshui', () => { try { renderPersonalFengShui(currentResult); } catch (e) { console.warn('pfs', e.message); } });
  lazyRender('flying-sihua',     () => { try { renderFlyingSihua(currentResult); } catch (e) { console.warn('flyingsihua', e.message); } });
  lazyRender('move-fs',          () => { try { renderMoveFs(currentResult); } catch (e) { console.warn('movefs', e.message); } });
  lazyRender('marriage-stars', () => { try { renderMarriageStars(currentResult); } catch (e) { console.warn('marriagestars', e.message); } });
  lazyRender('monthly-sha',    () => { try { renderMonthlySha(); } catch (e) { console.warn('monthlysha', e.message); } });
  lazyRender('annual-direction', () => { try { renderAnnualDirection(currentResult); } catch (e) { console.warn('annualdir', e.message); } });
  lazyRender('today-zheri',    () => { try { renderTodayZheri(); } catch (e) { console.warn('todayzheri', e.message); } });
  lazyRender('huangdao',       () => { try { renderHuangdao(); } catch (e) { console.warn('huangdao', e.message); } });
  lazyRender('donggong',       () => { try { renderDonggong(); } catch (e) { console.warn('donggong', e.message); } });
  lazyRender('ziwei-sanfang',  () => { try { renderZiweiSanfang(currentResult); } catch (e) { console.warn('ziweisanfang', e.message); } });
  lazyRender('qizheng',        () => { try { renderQizheng(currentResult); } catch (e) { console.warn('qizheng', e.message); } });
  lazyRender('tianxing-zheri', () => { try { renderTianxingZheri(); } catch (e) { console.warn('tianxing', e.message); } });
  lazyRender('golden-year',    () => { try { renderGoldenYear(currentResult); } catch (e) { console.warn('goldenyear', e.message); } });
  lazyRender('forecast5',      () => { try { renderForecast5(currentResult); } catch (e) { console.warn('forecast5', e.message); } });

  // quick-nav: auto-generate jump links from card titles + group headers
  const qnav = $('quick-nav');
  if (qnav) {
    const cards = document.querySelectorAll('#result > .card');
    qnav.innerHTML = '';
    cards.forEach((card, i) => {
      const title = card.querySelector('.card-title');
      if (!title) return;
      // [loop 144] label tốt hơn: lấy text Hán-Việt (bỏ zh span), cắt 20 chars
      const clone = title.cloneNode(true);
      clone.querySelectorAll('.zh, .hint-inline').forEach(el => el.remove());
      const fullLabel = clone.textContent.trim();
      const label = fullLabel.length > 22 ? fullLabel.slice(0, 20) + '…' : fullLabel;
      card.id = card.id || `card-${i}`;
      const a = document.createElement('a');
      a.textContent = label;
      a.title = fullLabel;
      a.href = '#' + card.id;
      a.onclick = (e) => { e.preventDefault(); card.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
      qnav.appendChild(a);
    });
    qnav.classList.remove('hidden');
  }
  // reveal print button
  const pbtn = $('print-btn');
  if (pbtn) pbtn.classList.remove('hidden');
  const curYear = new Date().getFullYear();
  $('ly-year').value = curYear;
  renderLyear(curYear);
  try { if ($('ly-ev')) renderLyearEvents(curYear); } catch (e) { console.warn('ly-ev', e.message); }
  try { $('yd-year').value = curYear; renderYearDaily(currentResult, curYear); } catch (e) { console.warn('yd', e.message); }
  $('lm-year').value = curYear;
  renderLiuyue(curYear);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  $('lr-date').value = todayStr;
  renderLiuRi(todayStr);
  if ($('zlr-date')) { $('zlr-date').value = todayStr; try { renderZiweiLiuri(todayStr); } catch (e) { console.warn('zlr init', e.message); } }
  try { renderXiaoxian(); } catch (e) { console.warn('xiaoxian init', e.message); }

  // [loop 148] 3D TILT INTERACTIVE — ALL cards get mouse-tracking 3D tilt + glare
  init3DTilt();

  // [loop 156] CARD SEARCH/FILTER — lọc 109 card theo từ khoá
  const cardSearch = $('card-search');
  if (cardSearch) {
    cardSearch.classList.remove('hidden');
    cardSearch.addEventListener('input', () => {
      const q = cardSearch.value.trim().toLowerCase();
      const cards = document.querySelectorAll('#result > .card, #result > h2.grp');
      cards.forEach((el) => {
        if (!q) { el.style.display = ''; return; }
        const title = el.querySelector('.card-title') || el;
        const text = title.textContent.toLowerCase();
        // also search card content
        const body = el.textContent.toLowerCase().slice(0, 500);
        el.style.display = (text.includes(q) || body.includes(q)) ? '' : 'none';
      });
    });
  }
  if ($('bh-date')) { $('bh-date').value = todayStr; try { renderBestHour(todayStr); } catch (e) { console.warn('best-hour init', e.message); } }
  $('ts-year').value = curYear;
  renderTaisui(curYear);
  $('lns-year').value = curYear;
  renderLiunianShen(curYear);
  if ($('lns12-year')) { $('lns12-year').value = curYear; renderLiunian12Shen(curYear); }
  renderName();
  currentTopic = 'general';
  renderTabs();
  renderTopic();
  $('chat-log').replaceChildren();
  chatHistory = [];
  updateAIStatus();
  try{renderDaily();}catch(e){console.warn('daily',e.message);}
  try{renderSpaceFs();}catch(e){console.warn('spaceFs',e.message);}
  try{renderYinzhai();}catch(e){console.warn('yinzhai',e.message);}
  // Các card nặng phía dưới — bọc lazyRender (Task 2, fix cycle 27): trước đây gọi
  // trực tiếp ở cuối run() → render ngay dù dưới nếp, làm mất tác dụng lazy. Các nội
  // dung div bên trong đều nằm trong 1 .card nên lazyRender lấy closest('.card') OK.
  lazyRender('pillarage-out',  () => { try { renderPillarAge(); } catch (e) { console.warn('pillarAge', e.message); } });
  lazyRender('kongwang-out',   () => { try { renderKongwang(); } catch (e) { console.warn('kongwang', e.message); } });
  lazyRender('suiyun-out',     () => { try { renderSuiyun(); } catch (e) { console.warn('suiyun', e.message); } });
  lazyRender('health-out',     () => { try { renderHealth(currentResult); } catch (e) { console.warn('health', e.message); } });
  lazyRender('city-fs',        () => { try { renderCityFs(currentResult); } catch (e) { console.warn('city', e.message); } });
  lazyRender('diet-out',       () => { try { renderDiet(currentResult); } catch (e) { console.warn('diet', e.message); } });
  lazyRender('csdeep-out',     () => { try { renderChangshengDeep(); } catch (e) { console.warn('csDeep', e.message); } });
  // renderMarriageDeep() đã gọi ở block immediate (line ~1313) — KHÔNG bọc lại.
  lazyRender('match-out',      () => { try { renderIdealMatch(); } catch (e) { console.warn('idealMatch', e.message); } });
  lazyRender('sensitivity',    () => { try { renderSensitivity(); } catch (e) { console.warn('sensitivity', e.message); } });
  lazyRender('five-dim-radar', () => { try { renderFiveDimRadar(); } catch (e) { console.warn('5dim', e.message); } });
  lazyRender('week-preview',  () => { try { renderWeekPreview(); } catch (e) { console.warn('week', e.message); } });
  lazyRender('month-calendar',() => { try { renderMonthCalendar(); } catch (e) { console.warn('cal', e.message); } });
  renderQuickSummary(); // [loop 39] tóm tắt nhanh — render ngay (không lazy, ở đầu trang)
  lazyRender('decade-curve',  () => { try { renderDecadeCurve(); } catch (e) { console.warn('decade-curve', e.message); } });
  lazyRender('ziwei-stars-out',() => { try { renderZiweiFull(); } catch (e) { console.warn('ziweiFull', e.message); } });
  lazyRender('life-summary',   () => { try { renderLifeTrajectory(currentResult); } catch (e) { console.warn('life', e.message); } });
  $("result").classList.remove("hidden");
  $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------------------------------------------------------------- LƯU NGUYỆT (vận từng tháng)
function renderLiuyue(year) {
  if (!currentResult) return;
  // [loop 4] Truyền patternQuality để cộng tầng 格局流月喜忌 (★格局喜/⚠格局忌 mỗi tháng).
  const lm = computeLiuyue(currentResult, year, currentResult.patternQuality);
  const GOD_VI = { 比肩:'Tỷ Kiên', 劫財:'Kiếp Tài', 食神:'Thực Thần', 傷官:'Thương Quan', 偏財:'Thiên Tài', 正財:'Chính Tài', 七殺:'Thất Sát', 正官:'Chính Quan', 偏印:'Thiên Ấn', 正印:'Chính Ấn' };
  // [loop 218] highlight tháng TỐT/XẤU nhất + đánh dấu tháng HIỆN TẠI
  const scores = lm.months.map((m) => m.score);
  const maxS = Math.max(...scores), minS = Math.min(...scores);
  const now = new Date();
  const curMonth = (year === now.getFullYear()) ? now.getMonth() : -1;
  $('liuyue').innerHTML = `
    <p class="hint">Tháng CÁT (nên tiến thủ): <b>${lm.best.map((m) => `T${m.m + 1} ${m.ganZhi}`).join(', ')}</b> · Tháng KỴ (cẩn thận): <b>${lm.worst.map((m) => `T${m.m + 1} ${m.ganZhi}`).join(', ')}</b></p>
    <div class="lm-grid">${lm.months.map((m) => {
      const cls = m.rating === 'Cát' ? 'rate-cat' : m.rating === 'Kỵ' ? 'rate-hung' : m.rating === 'Hơi kỵ' ? 'rate-bad' : 'rate-mid';
      const gejuTag = m.gejuDelta > 0 ? '<span class="geju-xi" title="' + esc(m.gejuNote || '') + '">★格局喜</span>'
                    : m.gejuDelta < 0 ? '<span class="geju-ji" title="' + esc(m.gejuNote || '') + '">⚠格局忌</span>'
                    : '';
      const isNow = m.m === curMonth;
      const isBest = m.score === maxS && m.rating === 'Cát';
      const isWorst = m.score === minS && m.rating === 'Kỵ';
      const rowCls = isNow ? ' lm-now' : isBest ? ' ln-best-row' : isWorst ? ' ln-worst-row' : '';
      const mark = isNow ? ' ★' : '';
      return `<div class="lm-cell${rowCls}"><div class="lm-m">T${m.m + 1}${mark}</div><div class="zh">${m.ganZhi}</div><div class="lm-g">${GOD_VI[m.ganGod] || m.ganGod}</div>${gejuTag}<div class="ln-rate ${cls}">${m.rating}</div></div>`;
    }).join('')}</div>`;
}

// ---------------------------------------------------------------- LƯU NHẬT (vận từng ngày)
function renderLiuRi(dateStr) {
  if (!currentResult || !dateStr) return;
  const [y, m, d] = dateStr.split('-').map(Number);
  // [loop 12] Truyền patternQuality để cộng tầng 格局流日喜忌 (★格局喜/⚠格局忌 mỗi ngày).
  const r = analyzeLiuRi(currentResult, y, m, d, currentResult.patternQuality);
  const GOD_VI = { 比肩: 'Tỷ Kiên', 劫財: 'Kiếp Tài', 食神: 'Thực Thần', 傷官: 'Thương Quan', 偏財: 'Thiên Tài', 正財: 'Chính Tài', 七殺: 'Thất Sát', 正官: 'Chính Quan', 偏印: 'Thiên Ấn', 正印: 'Chính Ấn' };
  const cls = r.score >= 64 ? 'rate-cat' : r.score >= 50 ? 'rate-mid' : r.score >= 38 ? 'rate-bad' : 'rate-hung';
  $('liuri').innerHTML = `
    <p class="hint" style="margin-bottom:6px">⚡ Vận ngày <b>THEO MỆNH CHỦ</b> (太岁/十神/神煞 tương tác cá nhân với lá số — khác Hoàng Đạo chung ở thẻ «Hôm Nay Tổng Khái»).</p>
    <div class="ly-head"><span class="zh big">${r.ganZhi}</span> ${r.solar} · can <b>${GOD_VI[r.ganGod] || r.ganGod}</b> → <span class="ln-rate ${cls}">${r.rating} (${r.score}/100)</span></div>
    <div class="ly-schools">${r.schools.map((s) => `<div class="ly-school ${s.d >= 0 ? 'pos' : 'neg'}"><div class="ly-sname">${s.phai} <span class="ly-d">${s.d >= 0 ? '+' : ''}${s.d}</span></div><div class="ly-snote">${s.note}</div></div>`).join('')}</div>
    ${r.gejuNote ? `<div class="ly-school ${r.gejuDelta >= 0 ? 'pos' : 'neg'}"><div class="ly-sname">格局流日喜忌 <span class="ly-d">${r.gejuDelta >= 0 ? '+' : ''}${r.gejuDelta}</span></div><div class="ly-snote">${esc(r.gejuNote)}</div></div>` : ''}
    <p class="zr-advice">${r.advice}</p>`;
}

// ---------------------------------------------------------------- TIỂU HẠN 小限 (annual palace rotation)
function renderXiaoxian() {
  if (!currentResult) return;
  const inp = currentResult?.chart?.input;
  if (!inp) { $('xiaoxian').innerHTML = '<p class="hint">Cần lá số Tử Vi.</p>'; return; }
  try {
    const zr = computeZiwei(inp.year, inp.month, inp.day, inp.hour, inp.minute, inp.gender);
    const curYear = new Date().getFullYear();
    const xx = xiaoxianInChart(zr, curYear, inp.year, inp.gender);
    $('xiaoxian').innerHTML = `
      <p><b>Năm ${curYear} — Tiểu Hạn tại ${xx.branchVi} (${xx.palaceVi}/${xx.palace})</b> · ${xx.direction} · tuổi âm ${xx.virtualAge}</p>
      <p class="hint">Chủ đề CHỦ ĐẠO năm: <b>${xx.palaceTheme}</b>. Sao tại cung: ${xx.stars.length ? xx.stars.join(', ') : '(cung trống — năm trung tính)'}.</p>`;
  } catch (e) { $('xiaoxian').innerHTML = `<p class="hint">Không tính được: ${esc(e.message)}</p>`; }
}

// ---------------------------------------------------------------- TỬ VI LƯU NHẬT / LƯU THỜI (紫微流日流时)
function renderZiweiLiuri(dateStr) {
  if (!currentResult) return;
  // [cycle 51 sửa] currentResult không có `.ziwei`/`.input` ở top-level → phải computeZiwei từ chart.input
  //   (trước đây guard luôn true → thẻ 紫微流日 KHÔNG bao giờ render). Đồng bộ cách mọi render khác.
  const inp = currentResult?.chart?.input;
  const z = inp ? computeZiwei(inp.year, inp.month, inp.day, inp.hour, inp.minute, inp.gender) : null;
  if (!z) { $('ziwei-liuri').innerHTML = '<p class="hint">Cần lá số Tử Vi (nhập đủ giờ sinh).</p>'; return; }
  const scan = dateStr || (() => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`; })();
  let dd;
  try { dd = ziweiDailyZiwei({ input: inp }, scan); }
  catch (e) { $('ziwei-liuri').innerHTML = `<p class="hint">Không tính được: ${esc(e.message)}</p>`; return; }

  const liuri = dd.liuri;
  const toneCls = (t) => t === 'cat' ? 'rate-cat' : t === 'hung' ? 'rate-hung' : 'rate-mid';
  const toneVi = (t) => t === 'cat' ? 'Cát (thuận)' : t === 'hung' ? 'Hung (cẩn thận)' : 'Bình hòa';

  $('ziwei-liuri').innerHTML = `
    <div class="ly-head"><span class="zh big">${liuri.dayGanZhi}</span> ${liuri.solar} (âm ${liuri.lunarDay}/${liuri.lunarMonth}) · <b>流日命宫 tại ${liuri.liuriGong.zhi}</b> — ${esc(liuri.liuriGong.vi)} <span class="ln-rate ${toneCls(liuri.liuriGong.tone)}">${toneVi(liuri.liuriGong.tone)}</span></div>
    <p class="ly-snote">Chủ đề hôm nay: <b>${esc(liuri.liuriGong.meaning)}</b>. Sao tại cung: ${liuri.liuriGong.stars.length ? esc(liuri.liuriGong.stars.join(', ')) : '(cung trống)'}. · Tứ hóa ngày <span class="zh">${liuri.dayGan}</span>: ${liuri.liuriSihua.map((s) => `<span class="ln-rate ${s.tone==='hung'?'rate-hung':'rate-cat'}" style="margin-right:4px">${s.hua}${esc(s.star)}${s.palace ? '@'+s.palace : ''}</span>`).join(' ')}</p>
    ${dd.bestHours.length ? `<p class="hint">⏰ Khung giờ TỐT (nên làm việc chính): <b>${dd.bestHours.map((h) => `${h.hourZhi} ${h.hourRange} → ${esc(h.gongVi)}`).join(' · ')}</b></p>` : ''}
    ${dd.worstHours.length ? `<p class="hint">⚠️ Khung giờ KỴ (giữ mình): <b>${dd.worstHours.map((h) => `${h.hourZhi} ${h.hourRange} → ${esc(h.gongVi)}`).join(' · ')}</b></p>` : ''}
    <div class="lm-grid">${dd.hours.map((h) => `<div class="lm-cell"><div class="lm-m">${h.hourZhi}</div><div class="lm-g" style="font-size:10px;color:var(--silk-muted)">${h.hourRange}</div><div class="zh">${h.gongZhi}</div><div style="font-size:11px">${esc(h.gongVi)}</div><div class="ln-rate ${toneCls(h.tone)}">${toneVi(h.tone).split(' ')[0]}</div></div>`).join('')}</div>`;
}

// ---------------------------------------------------------------- BEST HOUR TODAY 择吉时合成
function renderBestHour(dateStr) {
  if (!currentResult) return;
  const el = $('best-hour');
  if (!el) return;
  const scan = dateStr || (() => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`; })();
  let r;
  try { r = bestHourToday(currentResult, ...scan.split('-').map(Number), currentResult?.patternQuality?.patternYong); }
  catch (e) { el.innerHTML = `<p class="hint">Không tính được: ${esc(e.message)}</p>`; return; }

  const toneCls = (s) => s >= 72 ? 'rate-cat' : s >= 60 ? 'rate-cat' : s >= 45 ? 'rate-mid' : 'rate-hung';
  const bestSet = new Set(r.best.map((h) => h.zhi));
  const worstSet = new Set(r.worst.map((h) => h.zhi));
  // [loop 232] mark current 时辰 (if viewing today)
  const ZHI_ORD = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const now = new Date();
  const isToday = dateStr === `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const curZhi = isToday ? ZHI_ORD[Math.floor(((now.getHours() + 1) % 24) / 2)] : null;

  const cells = r.hours.map((h) => {
    const tag = bestSet.has(h.zhi) ? '★' : worstSet.has(h.zhi) ? '⚠' : '';
    const cls = bestSet.has(h.zhi) ? 'bh-best' : worstSet.has(h.zhi) ? 'bh-worst' : '';
    const isNow = curZhi && h.zhi === curZhi;
    const reasons = h.reasons.length ? `<div class="bh-reasons">${h.reasons.map((x) => `<span>${esc(x)}</span>`).join('')}</div>` : '';
    return `<div class="bh-cell ${cls}" style="${isNow ? 'box-shadow:0 0 0 2px var(--gold,#d4af37);' : ''}">
      <div class="bh-m">${tag}${isNow ? '🕐' : ''}<span class="zh">${h.zhi}</span> <b>${esc(h.vi)}</b>${isNow ? ' <span class="hint">← đang</span>' : ''}</div>
      <div class="bh-range">${esc(h.range)} <span class="zh small">${esc(h.ganZhi)}</span></div>
      <div class="bh-score ${toneCls(h.score)}">${h.score} <b>${esc(h.rating)}</b></div>
      ${reasons}
    </div>`;
  }).join('');

  el.innerHTML = `
    <div class="bh-head"><span class="zh big">${r.dayGanZhi}</span> ${r.date} · trực ngày <b>${esc(r.dayOfficer.officerVi)}</b> (${esc(r.dayOfficer.tone)}) · <span class="hint-inline">trọng số: 黄道${r.weights.huangdao}/Dụng${r.weights.yong}/紫微${r.weights.ziwei}/神煞${r.weights.shensha}/建除${r.weights.officer}${r.gejuEnabled ? `/格局${r.weights.geju}` : ''}</span></div>
    <p class="bh-summary"><b>💡 ${esc(r.summary)}</b></p>
    <div class="bh-grid">${cells}</div>
    ${r.best.length ? `<p class="hint">⏰ <b>Top 3 giờ tốt:</b> ${r.best.map((h) => `${esc(h.vi)} (${esc(h.range)}, ${h.score})`).join(' · ')}</p>` : ''}
    ${r.worst.length ? `<p class="hint">⚠️ <b>Tránh:</b> ${r.worst.map((h) => `${esc(h.vi)} (${esc(h.range)}, ${h.score})`).join(' · ')}</p>` : ''}`;
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
    <div class="ts-head">Năm ${esc(year)} <span class="zh">${esc(yGan)}${esc(yZhi)}</span> · Thái tuế ở phương <b>${esc(taSuiDirection(yZhi))}</b> (kỵ động thổ phương này).</div>
    <div class="ts-grid">${table.map((r) => {
      const isMe = userZhi === r.zhi;
      const tag = r.types.length ? r.types.map((t) => TYPE_VI[t].split(' ')[0]).join('+') : '—';
      return `<div class="ts-cell ${r.types.length ? 'offend ' + cls(r.level) : ''} ${isMe ? 'me' : ''}"><div class="ts-z">${esc(ZHI[r.zhi].con)}</div><div class="ts-tag">${esc(tag)}</div></div>`;
    }).join('')}</div>
    ${me ? `<div class="ts-me ${me.offends ? (me.level === 'nặng' ? 'rate-hung' : 'rate-bad') : 'ok'}"><b>Bạn (${esc(ZHI[userZhi].con)}):</b> ${esc(me.msg)}${me.offends ? ` → nên佩 con giáp tam hợp <b>${esc(me.remedyCharms.join(', '))}</b> để hoá giải.` : ''}</div>` : ''}
    <details class="syn-factors"><summary>7 pháp hoá thái tuế (化太岁)</summary><div class="laws">${TAISUI_REMEDY.map((l) => `<div class="law">${esc(l)}</div>`).join('')}</div></details>
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

// ---------------------------------------------------------------- LƯU NIÊN 12 THẦN SÁT (主星+副星 全套)
function renderLiunian12Shen(year) {
  if (!currentResult) return;
  const r = analyzeLiunian12(currentResult, year);
  const cls = (t) => (t === 'cat' ? 'rate-cat' : t === 'hung' ? 'rate-hung' : 'rate-mid');
  const label = (t) => (t === 'cat' ? 'cát' : t === 'hung' ? 'hung' : 'bình');
  const mine = r.mine;
  const Z = (z) => ZHI[z]?.con || z;
  $('lns12').innerHTML = `
    <div class="ts-head">Năm ${r.year} (<span class="zh">${r.yearZhi}</span>) · tuổi bạn <b>${Z(r.birthZhi)} (${r.birthZhi})</b> ở vị trí <b>${mine.position}</b>: <span class="ln-rate ${cls(mine.tone)}"><b>${mine.spirit} ${mine.vi}</b> · 副星 ${mine.subStar} (${mine.viSub})</span></div>
    <p class="ly-snote" style="margin:8px 0">${mine.meaning}</p>
    <div class="tiaohou-note" style="border-color:${mine.tone === 'hung' ? '#c0392b' : '#2e9e5b'};background:${mine.tone === 'hung' ? 'rgba(192,57,43,0.07)' : 'rgba(46,158,91,0.08)'}"><b>${mine.tone === 'hung' ? 'Hoá giải' : 'Tận dụng'}:</b> ${mine.advice}</div>
    <h4 class="syn-h4" style="margin-top:12px">12 vị trí thần sát (主星 + 副星) theo chi tuổi</h4>
    <div class="lm-grid">${r.positions.map((p) => `<div class="lm-cell ${p.isMine ? 'me' : ''}" title="${p.subStar} (${p.viSub})">
      <div class="lm-m">${Z(p.atZhi)}</div>
      <div class="zh">${p.spirit}</div>
      <div class="zh" style="font-size:10px;opacity:.75">${p.subStar}</div>
      <div class="ln-rate ${cls(p.tone)}" style="font-size:10px">${label(p.tone)}</div>
    </div>`).join('')}</div>
    <div class="syn-factors" style="margin-top:10px;font-size:12px">
      <b>Tổng quan năm ${r.year}:</b>
      <span class="ln-rate rate-cat">${r.cat.length} vị trí cát</span> ·
      <span class="ln-rate rate-hung">${r.hung.length} vị trí hung</span> ·
      <span class="ln-rate rate-mid">${r.mid.length} vị trí bình</span>
      (trên 12 chi tuổi)
    </div>
    <p class="hint">${r.note}</p>`;
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
  if (r.needStrokes) { $('nameout').innerHTML = `<p class="hint">⚠ ${esc(r.hint)} — ví dụ bảng đã có họ Nguyễn (阮=12), Trần (陳=16)… Hãy tra 康熙字典 nét rồi nhập vào ô "Ghi đè nét".</p>`; return; }
  const wxVi2 = (w) => ({ 木: 'Mộc', 火: 'Hỏa', 土: 'Thổ', 金: 'Kim', 水: 'Thủy' }[w] || w);
  const cls = (lv) => lv === 'Đại cát' || lv === 'Cát' ? 'rate-cat' : lv === 'Bình' ? 'rate-mid' : 'rate-hung';
  $('nameout').innerHTML = `
    <div class="nm-name"><span class="zh big">${esc(raw)}</span> · nét ${esc(r.strokes.join(' + '))} = ${esc(r.strokes.reduce((a,b)=>a+b,0))}</div>
    <div class="nm-grids">${r.grids.map((g) => `
      <div class="nm-grid ${g.key === 'ren' ? 'ren' : ''}">
        <div class="nm-gnum">${esc(g.n)}</div>
        <div class="nm-glabel">${esc(g.vi)}</div>
        <div class="nm-gwx">${esc(wxVi2(g.wx))}</div>
        <div class="ln-rate ${cls(g.luck.lv)}">${esc(g.luck.lv)}</div>
      </div>`).join('')}</div>
    <div class="nm-sancai">三才 Thiên-Nhân-Địa: <b>${esc(wxVi2(r.sancai.tian))} → ${esc(wxVi2(r.sancai.ren))} → ${esc(wxVi2(r.sancai.di))}</b> · <span class="ln-rate ${cls(r.sancaiLuck)}">${esc(r.sancaiLuck)}</span> · Tổng điểm tên: <b>${esc(r.score)}/100</b></div>
    ${r.vsYong ? `<div class="tiaohou-note"><b>Tên vs Dụng Thần lá số:</b> ${esc(r.vsYong.msg)}</div>` : ''}
    <p class="hint">Lưu ý: 五格 chỉ là 1 thành phần tên học — cần kết hợp 八字 Dụng Thần, 字 nghĩa, âm vận. Két quả tham khảo văn hoá.</p>`;
}

// ---------------------------------------------------------------- 盲派
function renderMangpai(R) {
  const m = analyzeMangpai(R);
  const cls = m.score >= 62 ? 'rate-cat' : m.score >= 45 ? 'rate-mid' : 'rate-bad';
  $('mangpai').innerHTML = `
    <div class="mp-head">做功 định tầng: <b>${esc(m.level)}</b> · ${esc(m.fuguui)} · <span class="ln-rate ${cls}">${esc(m.score)}/100</span></div>
    <ul class="zr-reasons">${m.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`;
}

// ---------------------------------------------------------------- 盲派象法 (góc nhìn bổ sung)
function renderMangpaiView(R) {
  const v = analyzeMangpaiView(R);
  const dynCls = v.deeds.dynamism === 'high' ? 'rate-cat' : v.deeds.dynamism === 'medium' ? 'rate-mid' : 'rate-bad';
  const hg = v.hostGuest.groups;
  const hgRow = (k, star) => {
    const g = hg[k];
    const sitsCls = g.sitsAt.startsWith('主') ? 'rate-cat' : g.sitsAt.startsWith('宾') ? 'rate-mid' : 'rate-bad';
    return `<tr><td class="zh big">${k}</td><td>${star}</td><td>${g.weightHost}</td><td>${g.weightGuest}</td>
      <td><span class="ln-rate ${sitsCls}">${g.sitsAt}</span></td>
      <td class="mpv-read">${g.reading}</td></tr>`;
  };
  const matched = v.classicalRules.filter((r) => r.matched);
  const unmatched = v.classicalRules.filter((r) => !r.matched);
  $('mangpai-view').innerHTML = `
    <div class="mpv-note">⚠ ${v.label} — đây là lăng kính <b>khác</b> với Tử Bình (dụng thần/cách cục) ở trên, chỉ bổ sung, không thay thế.</div>
    <div class="mpv-sub">日主 <span class="zh big">${v.dayGan}</span> · ${wxVi(v.dayWx)} · Thân ${v.isStrong ? 'vượng' : 'nhược'}</div>
    <h4 class="mpv-h">① 宾主定位 <span class="hint-inline">主=Trụ Ngày, 宾=ba trụ kia</span></h4>
    <table class="mpv-table">
      <thead><tr><th>Nhóm</th><th>Thập thần</th><th>Trọng 主</th><th>Trọng 宾</th><th>Tọa</th><th>Đọc</th></tr></thead>
      <tbody>
        ${hgRow('财', 'Tài Tinh')}
        ${hgRow('官', 'Quan/Sát')}
        ${hgRow('印', 'Ấn Tinh')}
        ${hgRow('食', 'Thực Thương')}
      </tbody>
    </table>
    <h4 class="mpv-h">② 禄当财看 <span class="hint-inline">Lộc = chi cùng hành Nhật Can</span></h4>
    <div class="mpv-lu">Lộc của ${v.dayGan} = <span class="zh big">${v.luAnalysis.luZhi}</span>/${v.luAnalysis.luZhiVi}
      · <span class="ln-rate ${v.luAnalysis.present ? 'rate-cat' : 'rate-bad'}">${v.luAnalysis.present ? 'CÓ' : 'KHÔNG'}</span>
      ${v.luAnalysis.positionVi ? `· ở Trụ ${v.luAnalysis.positionVi}` : ''}
      ${v.luAnalysis.strong ? '· vượng ✓' : ''}
      <div class="mpv-read">${v.luAnalysis.reading}</div></div>
    <h4 class="mpv-h">③ 合财口诀 <span class="hint-inline">mnemonic 盲派 cổ pháp</span></h4>
    <ul class="zr-reasons">
      ${matched.map((r) => `<li class="rate-cat"><b class="zh">${r.mnemonic}</b> — ${r.vi}<br><span class="hint-inline">${r.detail}</span><br>→ ${r.verdict}</li>`).join('')}
      ${unmatched.map((r) => `<li class="hint"><span class="zh">${r.mnemonic}</span> — ${r.vi}<br><span class="hint-inline">${r.detail}</span></li>`).join('') || '<li class="hint">Không có口诀 nào hoàn chỉnh khớp.</li>'}
    </ul>
    <h4 class="mpv-h">④ 做功 <span class="hint-inline">đếm công cụ 刑沖合害</span></h4>
    <div class="mpv-deeds">
      Hợp <b>${v.deeds.counts.he}</b> · Xung <b>${v.deeds.counts.chong}</b> · Hình <b>${v.deeds.counts.xing}</b> · Hại <b>${v.deeds.counts.hai}</b>
      · Tổng <b>${v.deeds.counts.total}</b> · Tứ sinh (Dần/Thân/Tỵ/Hợi) <b>${v.deeds.fourBirthCount}</b> chi
      · <span class="ln-rate ${dynCls}">${v.deeds.dynamismVi}</span>
      <div class="mpv-read">${v.deeds.efficiencyNote} ${v.deeds.fourBirthReading}</div>
    </div>
    <details class="mpv-det"><summary>Tổng kết 盲派象法</summary>
      <ul class="zr-reasons">${v.summary.map((s) => `<li>${s}</li>`).join('')}</ul>
    </details>`;
}

// ---------------------------------------------------------------- 玄空飞星
function renderXuankong(year) {
  const x = xuankongPan(year);
  const cls = (p) => (p.quality.includes('vượng') || p.quality.includes('sinh khí')) ? 'cat' : (p.info.base === 'đại hung' || p.quality.includes('đại hung')) ? 'xiong' : (p.info.base === 'hung') ? 'xiong' : 'mid';
  // [loop 197] tóm tắt 旺方/凶方 (hướng nên tăng cường vs tránh) — trước đây chỉ có trong grid
  const wangLine = (x.wangFang || []).length ? `<p class="hint"><b style="color:var(--jade)">旺方 (nên sơn/cao/thực, tăng cường):</b> ${(x.wangFang||[]).map((p) => `${esc(p.palace)} (${esc(p.info.name)})`).join(', ')}</p>` : '';
  const xiongLine = (x.xiongFang || []).length ? `<p class="hint"><b style="color:var(--cinnabar)">凶方 (nên thuỷ/thấp/hư, tránh động thổ):</b> ${(x.xiongFang||[]).map((p) => `${esc(p.palace)} (${esc(p.info.name)} — ${esc((p.info.vi||'').split('(')[0].trim())})`).join(', ')}</p>` : '';
  $('xuankong').innerHTML = `
    <div class="xk-head">${esc(x.yuan)} <b>${esc(x.yun)}运</b> (${esc(x.range)}) · 当令 <b>${esc(x.currentStar.han)} ${esc(x.currentStar.name)}</b> (${esc(x.currentStar.wx)})</div>
    ${wangLine}${xiongLine}
    <div class="xk-grid">${x.pan.map((p) => `
      <div class="xk-cell ${cls(p)}"><div class="xk-palace">${esc(p.palace)}</div><div class="xk-star">${esc(p.star)}</div><div class="xk-name">${esc(p.info.name)}</div><div class="xk-q">${esc(p.quality)}</div></div>
    `).join('')}</div>
    <ul class="zr-reasons">${x.advice.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>`;
}

// ---------------------------------------------------------------- 玄空大卦 (64 quẻ × 24 sơn)
function initDaguaSelects() {
  const sit = $('dg-sit'); const face = $('dg-face');
  if (!sit || !face) return;
  const opts = MOUNTAINS_HAN.map((h, i) => {
    const d = daguaByMountain(h);
    return `<option value="${h}">${h} ${d.mountainVi} — ${d.hexagram} (v${d.yun}) · ${d.palace}</option>`;
  }).join('');
  // chỉ fill nếu chưa có (tránh ghi đè chọn user khi gọi lại run)
  if (!sit.options.length) sit.innerHTML = opts;
  if (!face.options.length) face.innerHTML = opts;
  sit.value = sit.value || '子';
  face.value = face.value || '午';
}
function rateClsDg(r) { return r === 'ĐẠI CÁT' ? 'rate-cat' : r === 'CÁT' ? 'rate-cat' : r === 'KỴ' ? 'rate-hung' : r === 'TIỂU KỴ' ? 'rate-bad' : 'rate-mid'; }
function renderDagua() {
  const sit = $('dg-sit').value; const face = $('dg-face').value;
  const c = daguaCompatibility(sit, face);
  const ov = daguaOverview(); // [loop 198] compute once (was called 2× — .note + .rows)
  const el = $('dagua');
  if (!c.ok) { el.innerHTML = `<p class="hint">${esc(c.error)}</p>`; return; }
  const a = c.sit, b = c.face;
  el.innerHTML = `
    <div class="xk-head">Toạ <b>${esc(sit)}</b> (${esc(a.hexagram)} ${esc(a.hexagramVi)}, vận ${a.yun}) ↔ Hướng <b>${esc(face)}</b> (${esc(b.hexagram)} ${esc(b.hexagramVi)}, vận ${b.yun}) ${c.isOpposite ? '<span class="hint-inline">· 正针对 cung</span>' : ''}</div>
    <div class="mh-rel" style="margin:6px 0">Phối hợp: <span class="ln-rate ${rateClsDg(c.rating)}">${esc(c.rating)} (${c.score}/100)</span> — ${esc(c.ratingVi)}</div>
    <ul class="zr-reasons">${c.rules.map((r) => `<li><b>${esc(r.type)}</b> → <span class="ln-rate ${rateClsDg(r.rating)}">${esc(r.rating)}</span> ${esc(r.note)}</li>`).join('')}</ul>
    <div class="zr-advice">→ ${c.advice.map((x) => esc(x)).join(' ')}</div>
    <details style="margin-top:6px"><summary>Chi tiết 2 sơn (quẻ + ngũ hành)</summary>
      <div class="xk-grid" style="grid-template-columns:1fr 1fr">
        <div class="xk-cell mid"><div class="xk-palace">Toạ ${esc(sit)} ${esc(a.mountainVi)}</div><div class="xk-star zh big">${esc(a.hexagram)}</div><div class="xk-name">${esc(a.hexagramVi)} (#${a.hexagramNo})</div><div class="xk-q">thượng ${esc(a.upperVi)}(${esc(a.upperEle)}) · hạ ${esc(a.lowerVi)}(${esc(a.lowerEle)}) · vận ${a.yun}</div></div>
        <div class="xk-cell mid"><div class="xk-palace">Hướng ${esc(face)} ${esc(b.mountainVi)}</div><div class="xk-star zh big">${esc(b.hexagram)}</div><div class="xk-name">${esc(b.hexagramVi)} (#${b.hexagramNo})</div><div class="xk-q">thượng ${esc(b.upperVi)}(${esc(b.upperEle)}) · hạ ${esc(b.lowerVi)}(${esc(b.lowerEle)}) · vận ${b.yun}</div></div>
      </div>
    </details>
    <details><summary>Tổng quan 24 sơn × 卦运 (bảng đầy đủ)</summary>
      <p class="hint">${esc(ov.note)}</p>
      <div class="xk-grid">${ov.rows.map((r) => `<div class="xk-cell ${(r.yun === 1 || r.yun === 9) ? 'cat' : 'mid'}" title="${esc(r.star||'')} · ${esc(r.family||'')}"><div class="xk-palace">${esc(r.mountain)} ${esc(r.vi)}</div><div class="xk-star zh">${esc(r.hex)}</div><div class="xk-name">${esc(r.hexVi)}</div><div class="xk-q">vận ${r.yun} · ${esc(r.yunCat)}</div></div>`).join('')}</div>
    </details>`;
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

// ---------------------------------------------------------------- TIỂU LỤC NHÂM 小六壬
function renderXiaoliuren(r) {
  const toneCls = (t) => t === 'CÁT' ? 'rate-cat' : 'rate-hung';
  const stage = (label, p, step) => `
    <div class="xlr-stage ${p.tone === 'CÁT' ? 'cat' : 'hung'}">
      <div class="xlr-stage-label">${label} <span class="hint-inline">(đếm ${step})</span></div>
      <div class="xlr-stage-han zh big">${esc(p.han)}</div>
      <div class="xlr-stage-vi">${esc(p.vi)} · ${esc(p.wx)} <span class="ln-rate ${toneCls(p.tone)}">${esc(p.tone)}</span></div>
      <div class="xlr-stage-ess">${esc(p.essence)}</div>
    </div>`;
  const ZHI_HOUR = ['', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const f = r.final;
  $('xiaoliuren').innerHTML = `
    <div class="xlr-flow">
      ${stage('Tháng', r.monthResult, r.input.month)}
      <span class="xlr-arrow">→</span>
      ${stage('Ngày', r.dayResult, r.input.day)}
      <span class="xlr-arrow">→</span>
      ${stage('Giờ', r.hourResult, r.input.hour)}
      <span class="xlr-arrow">⇒</span>
      <div class="xlr-final ${f.tone === 'CÁT' ? 'cat' : 'hung'}">
        <div class="xlr-stage-label">Kết quả (cung giờ)</div>
        <div class="xlr-stage-han zh big">${esc(f.han)}</div>
        <div class="xlr-stage-vi">${esc(f.vi)} · ${esc(f.wx)} <span class="ln-rate ${toneCls(f.tone)}">${esc(f.tone)}</span></div>
      </div>
    </div>
    <div class="xlr-input-hint">Âm lịch tháng ${r.input.month}, ngày ${r.input.day}, giờ ${ZHI_HOUR[r.input.hour]} (chi ${r.input.hour})</div>
    <div class="zr-advice">→ <span class="ln-rate ${f.tone === 'CÁT' ? 'rate-cat' : 'rate-hung'}">${esc(r.luck)}</span> ${esc(r.verdict)}</div>
    <div class="xlr-detail"><b>Bản chất cung kết:</b> ${esc(f.essence || '')}</div>
    <ul class="zr-reasons">
      <li><b>Sự nghiệp:</b> ${esc(f.career)}</li>
      <li><b>Tài lộc:</b> ${esc(f.wealth)}</li>
      <li><b>Tình duyên:</b> ${esc(f.love)}</li>
      <li><b>Xuất hành:</b> ${esc(f.travel)}</li>
      <li><b>Thất lạc:</b> ${esc(f.lost)}</li>
      <li><b>Sức khỏe:</b> ${esc(f.health)}</li>
      <li><b>Lời khuyên:</b> ${esc(f.advice)}</li>
    </ul>`;
}
function runXiaoliuren() {
  let month, day, hour;
  const dv = $('xlr-dt').value;
  const mManual = parseInt($('xlr-month').value, 10);
  const dManual = parseInt($('xlr-day').value, 10);
  const hManual = parseInt($('xlr-hour').value, 10);
  if (!isNaN(mManual) && !isNaN(dManual) && !isNaN(hManual)) {
    // Nhập tay (âm lịch) ưu tiên nếu đủ 3 trường
    month = mManual; day = dManual; hour = hManual;
  } else if (dv) {
    const [d1, t1] = dv.split('T');
    const [y, mo, dd] = d1.split('-').map(Number);
    const hh = t1 ? (parseInt(t1.slice(0, 2), 10) || 12) : 12;
    const n = solarToXlrNums(y, mo, dd, hh, 0);
    month = n.month; day = n.day; hour = n.hour;
  } else {
    $('xiaoliuren').innerHTML = '<p class="hint">Chọn ngày giờ, hoặc nhập đủ tháng/ngày/giờ âm lịch.</p>';
    return;
  }
  const cat = $('xlr-cat').value;
  renderXiaoliuren(xiaoliurenDetail(month, day, hour, cat));
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
    <div class="ly-head">本卦 <span class="zh big">${esc(r.name)}</span> (宫 ${esc(r.palace)}/${esc(r.gongWx)}) · 世 ${esc(r.shi)} 应 ${esc(r.ying)} · ${esc(r.shiChish)} · ${r.dongCount ? `动 ${esc(r.dongCount)} → 变 ${esc(r.bianName)}` : '静卦'}</div>
    <div class="ly-lines">${r.lines.slice().reverse().map((l) => `
      <div class="ly-line ${l.yang ? 'yang' : 'yin'} ${l.isShi ? 'shi' : ''} ${l.isYing ? 'ying' : ''}">
        <span class="ly-pos">${esc(l.pos)}</span><span class="ly-gz zh">${esc(l.gan)}${esc(l.zhi)}</span><span class="ly-lq">${esc(LQ[l.liuqin] || l.liuqin)}</span>
        <span class="ly-mark">${l.isShi ? '世' : ''}${l.isYing ? '应' : ''}${l.dong ? ' ◉' : ''}</span>
        <span class="ly-hao">${l.yang ? '——' : '— —'}</span>
      </div>`).join('')}</div>
    <div class="ly-ys">用神: <b>${esc(r.yongshen.vi)}</b> → hào ${r.yongLines.length ? r.yongLines.map((l) => esc(l.pos) + '.' + esc(l.gan) + esc(l.zhi)).join(', ') : '(không có trong quẻ)'} · 月建${esc(r.monthZhi)} 日辰${esc(r.dayZhi)}</div>
    <div class="zr-advice">→ <span class="ln-rate ${luckCls(r.luck)}">${esc(r.luck)}</span> ${esc(r.verdict)}</div>`;
}

// ---------------------------------------------------------------- 求签 + 掷筊
function renderQiuqian(f) {
  // tone → class màu (theo 3 nhóm: tốt / bình / xấu)
  const toneCls = (t) => ['上上签', '上吉', '上签'].includes(t) ? 'rate-cat'
    : ['中吉', '中平'].includes(t) ? 'rate-mid'
    : 'rate-hung';
  const modeVi = f.mode === 'deterministic' ? 'ủy định (câu hỏi+ngày)'
    : f.mode === 'random' ? 'ngẫu nhiên' : 'chỉ định';
  $('qiuqian').innerHTML = `
    <div class="qq-head">
      <span class="qq-num zh big">第 ${esc(f.num)} 签</span>
      <span class="ln-rate ${toneCls(f.tone)}">${esc(f.toneVi)} (${esc(f.tone)})</span>
      <span class="hint-inline">· cách chọn: ${esc(modeVi)}${f.full ? '' : ' · template'}</span>
    </div>
    <div class="qq-poem zh">${esc(f.poem)}</div>
    <div class="qq-story"><b>Điển cố:</b> ${esc(f.story)}</div>
    <div class="qq-vi">${esc(f.vi)}</div>
    <ul class="zr-reasons">
      <li><b>Sự nghiệp:</b> ${esc(f.career)}</li>
      <li><b>Tài lộc:</b> ${esc(f.wealth)}</li>
      <li><b>Tình duyên:</b> ${esc(f.love)}</li>
      <li><b>Nên làm:</b> ${esc(f.do)}</li>
      <li><b>Tránh:</b> ${esc(f.avoid)}</li>
    </ul>
    <div class="zr-advice">→ <span class="ln-rate ${toneCls(f.tone)}">${esc(f.summary)}</span></div>`;
}
function runQiuqian() {
  const q = $('qq-question').value;
  const dateStr = $('qq-date').value || undefined;
  renderQiuqian(qiuqian(q, { date: dateStr }));
}
function renderJiaobei(j) {
  const cls = j.answer === 'YES' ? 'rate-cat' : j.answer === 'NO' ? 'rate-hung' : 'rate-mid';
  $('jiaobei').innerHTML = `
    <div class="qq-jiao-blocks">
      <span class="qq-block zh">${esc(j.blocks[0])}</span>
      <span class="qq-block zh">${esc(j.blocks[1])}</span>
      <span class="hint-inline">→</span>
      <span class="zh big">${esc(j.han)}</span>
    </div>
    <div class="qq-jiao-meaning"><span class="ln-rate ${cls}">${esc(j.vi)} · ${esc(j.answer)}</span> ${esc(j.meaning)}</div>`;
}
function runJiaobei() { renderJiaobei(zhiJiao()); }

// ---------------------------------------------------------------- 解梦 周公解梦
function renderJiemeng(r) {
  const toneCls = (t) => t === 'cat' ? 'rate-cat' : t === 'hung' ? 'rate-hung' : 'rate-mid';
  const toneVi = (t) => t === 'cat' ? 'Cát' : t === 'hung' ? 'Hung' : 'Trung';
  if (!r.matches.length && !r.patterns.length) {
    $('jiemeng').innerHTML = `<div class="zr-advice">${esc(r.summary)}</div>`;
    return;
  }
  const parts = [];
  if (r.patterns.length) {
    parts.push('<h4 class="syn-h4">🌙 Mẫu mơ phổ biến (周公解梦)</h4>');
    parts.push('<div class="jm-patterns">');
    for (const p of r.patterns) {
      parts.push(`<div class="jm-pattern">
        <div class="jm-phead"><b>${esc(p.name)}</b> <span class="ln-rate ${toneCls(p.tone)}">${toneVi(p.tone)}</span></div>
        <div class="jm-pmean">${esc(p.meaning)}</div>
        <div class="zr-advice">→ ${esc(p.advice)}</div>
      </div>`);
    }
    parts.push('</div>');
  }
  if (r.matches.length) {
    parts.push(`<h4 class="syn-h4">🔑 Từ khoá khớp (${r.matches.length})</h4><ul class="zr-reasons">`);
    for (const m of r.matches) {
      parts.push(`<li><span class="zh">${esc(m.keyword)}</span> <b>${esc(m.vi)}</b> <span class="ln-rate ${toneCls(m.tone)}">${toneVi(m.tone)}</span> — ${esc(m.meaning)} <i>→ ${esc(m.advice)}</i></li>`);
    }
    parts.push('</ul>');
  }
  const ovCls = r.overall === 'cat' ? 'rate-cat' : r.overall === 'hung' ? 'rate-hung' : 'rate-mid';
  parts.push(`<div class="zr-advice">→ <span class="ln-rate ${ovCls}">${esc(r.summary)}</span> <span class="hint-inline">(cát:${r.toneCounts.cat} · hung:${r.toneCounts.hung} · trung:${r.toneCounts.neutral})</span></div>`);
  parts.push('<p class="hint">Chu Công giải mộng là tham khảo / giải trí dân gian — không thay bát tự / tử vi. Mộng thường phản chiếu tâm – thân trạng thái.</p>');
  $('jiemeng').innerHTML = parts.join('');
}
function runJiemeng() {
  const q = $('jm-query').value;
  if (!q.trim()) return;
  renderJiemeng(jiemengEngine(q));
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
    <div class="ql-soul">Dụng Thần (linh hồn mệnh): <span class="ln-rate ${soulCls}">${esc(q.soul)}</span></div>
    <div class="ql-steps">${q.steps.map((s) => `
      <div class="ql-step"><div class="ql-n">${esc(s.n)}</div><div><div class="ql-sname">${esc(s.name)}</div><div class="ql-stext">${esc(s.text)}</div></div></div>`).join('')}</div>
    <p class="ql-source"><i>Nguồn: ${esc(q.source)} · <a href="https://www.quanxue.cn/qt_mingxiang/qianlimg/qianlimg19.html" target="_blank" rel="noopener">quanxue.cn 千里命稿·评断篇</a></i></p>`;
}

// ---------------------------------------------------------------- LUẬN VẬN NĂM (đa trường phái)
function renderLyear(year) {
  if (!currentResult) return;
  const r = analyzeLiunianDeep(currentResult, year);
  const GOD_VI = { 比肩: 'Tỷ Kiên', 劫財: 'Kiếp Tài', 食神: 'Thực Thần', 傷官: 'Thương Quan', 偏財: 'Thiên Tài', 正財: 'Chính Tài', 七殺: 'Thất Sát', 正官: 'Chính Quan', 偏印: 'Thiên Ấn', 正印: 'Chính Ấn' };
  const cls = r.score >= 62 ? 'rate-cat' : r.score >= 46 ? 'rate-mid' : r.score >= 32 ? 'rate-bad' : 'rate-hung';
  const dHanzi = (n) => (n > 0 ? `+${n}` : `${n}`);
  // [loop 220] 进气退气 phase + 格局流年喜忌 (trước đây tính nhưng không hiện)
  const ph = r.dayunPhase;
  const phaseBadge = ph ? `<span class="ln-phase ${ph.phase === '进气' ? 'ph-in' : 'ph-out'}" title="${esc(ph.vi)}">${ph.phase}</span>` : '';
  const gejuBadge = r.gejuFavor === '喜' ? '<span class="geju-xi" title="Can năm sinh trợ cách cục → năm THUẬN CÁCH">★格局喜</span>'
                 : r.gejuFavor === '忌' ? '<span class="geju-ji" title="Can năm khắc phá cách cục → năm GHÉT CÁCH">⚠格局忌</span>' : '';
  $('lyear').innerHTML = `
    <div class="ly-head"><span class="zh big">${esc(r.ganZhi)}</span> ${esc(year)} · can <b>${esc(GOD_VI[r.ganGod] || r.ganGod)}</b>${r.activeDayun ? ` · đại运 <span class="zh">${esc(r.activeDayun)}</span>` : ''}
      → <span class="ln-rate ${cls}">${esc(r.rating)} (${esc(r.score)}/100)</span> ${phaseBadge} ${gejuBadge}</div>
    <div class="ly-schools">${r.schools.map((s) => `
      <div class="ly-school ${s.d >= 0 ? 'pos' : 'neg'}">
        <div class="ly-sname">${esc(s.phai)} <span class="ly-d">${esc(dHanzi(s.d))}</span></div>
        <div class="ly-snote">${esc(s.note)}</div>
      </div>`).join('')}</div>
    <p class="zr-advice">${esc(r.advice)}</p>`;
}

// ---------------------------------------------------------------- LƯU NIÊN DẪN ĐỘNG LỤC THÂN (流年引动六亲)
//  Sao năm + vượng suy → SỰ VIỆC; 刑冲合害 vs tứ trụ → AI/VÙNG bị ảnh hưởng.
function renderLyearEvents(year) {
  if (!currentResult) return;
  const ev = liunianEvents(currentResult, year);
  const toneCls = (t) => (t === 'cat' ? 'rate-cat' : t === 'hung' ? 'rate-hung' : 'rate-mid');
  const toneVi = (t) => (t === 'cat' ? 'Cát' : t === 'hung' ? 'Kỵ' : 'Trung');
  const pct = Math.round(ev.confidence != null ? ev.confidence * 100 : 0);
  const bodyVi = ev.bodyStrong ? 'Thân vượng' : 'Thân nhược';
  const pillarVi = (p) => ({ year: 'Niên', month: 'Nguyệt', day: 'Nhật', time: 'Thời' })[p] || p;
  $('ly-ev').innerHTML = `
    <div class="ly-head"><span class="zh big">${esc(ev.ganZhi)}</span> ${esc(year)} · sao <b>${esc(ev.yearGodVi)}</b> (${esc(ev.yearGod)}) · ${esc(bodyVi)}${ev.yearGod === '七殺' ? ` · Sát ${ev.shaZhiHua ? 'CÓ chế/hóa' : 'VÔ chế ⚠'}` : ''}
    </div>
    <p class="zr-advice" style="margin-top:6px">${esc(ev.summary)}</p>
    <div class="ly-schools">${ev.events.map((e) => `
      <div class="ly-school ${e.tone === 'hung' ? 'neg' : e.tone === 'cat' ? 'pos' : ''}">
        <div class="ly-sname">${esc(e.vi)} <span class="ln-rate ${toneCls(e.tone)}">${toneVi(e.tone)} ${Math.round(e.confidence * 100)}%</span>
          <span class="hint-inline">→ ${esc(e.who)}${e.pillar ? ` · ${pillarVi(e.pillar)} trụ` : ''}</span></div>
        <div class="ly-snote">${esc(e.detail || '')}</div>
      </div>`).join('')}</div>`;
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

// ---------------------------------------------------------------- 逆推八字 [loop 21] — tìm lá số điểm cực
function runInverse() {
  const mode = $('inv-mode').value;
  const target = parseInt($('inv-target').value, 10);
  const year = parseInt($('inv-year').value, 10) || new Date().getFullYear();
  const step = parseInt($('inv-step').value, 10) || 5;
  const out = $('inv-out');
  out.innerHTML = `<p class="hint">⏳ Đang quét Bát Tự (năm ${year}, bước ${step} ngày × 12时辰 × 2 giới)... vài giây.</p>`;
  // setTimeout để UI kịp repaint trước khi quét đồng bộ nặng
  setTimeout(() => {
    let sol;
    try {
      sol = inverseBaZiSolve({
        refYear: new Date().getFullYear(), yearStart: year, yearEnd: year, stepDays: step, topK: 5, maxSamples: 5000,
        target: mode === 'target' ? target : null,
      });
    } catch (e) { out.innerHTML = `<p class="hint">Lỗi: ${e.message}</p>`; return; }
    const fmt = (r) => r ? `<div class="zr-item"><b>${r.y}-${String(r.m).padStart(2,'0')}-${String(r.d).padStart(2,'0')}</b> ${r.g==='nam'?'Nam':'Nữ'} · giờ <b>${r.shichen}</b> <span class="zh">${r.pillars.join(' ')}</span> <span class="ln-rate ${r.score>=62?'rate-cat':r.score>=46?'rate-mid':'rate-hung'}">${r.score}đ</span> · ${r.pattern}${r.gejuQuality?' ('+r.gejuQuality+')':''}</div>` : '';
    const heading = mode === 'max' ? '🥇 BÁT TỰ ĐIỂM CAO NHẤT (mệnh tốt nhất có thể)' : mode === 'min' ? '🔻 BÁT TỰ ĐIỂM THẤP NHẤT (mệnh xấu nhất có thể)' : `🎯 BÁT TỰ GẦN ${target} ĐIỂM NHẤT`;
    const focus = mode === 'max' ? sol.max : mode === 'min' ? sol.min : sol.nearestToTarget;
    const list = mode === 'max' ? sol.topK : mode === 'min' ? sol.bottomK : null;
    const histBars = sol.histogram.map((h) => `<span title="${h.range}đ: ${h.count} lá" style="display:inline-block;width:24px;text-align:center;font-size:.7em;">${h.count||''}<span style="display:block;height:${Math.min(40,h.count/4)}px;background:linear-gradient(#d4a017,#b8860b);border-radius:2px;"></span></span>`).join('');
    out.innerHTML = `
      <p class="hint">Quét <b>${sol.scanned}</b> lá số thật trong ${sol.durationMs}ms. Khoảng điểm <b>${sol.scoreStats.min}→${sol.scoreStats.max}</b> (TB ${sol.scoreStats.mean}).</p>
      <div class="zr-head">${heading}:</div>
      ${fmt(focus)}
      ${list && list.length ? `<div class="zr-head" style="margin-top:8px;font-size:.9em">Top ${list.length}:</div><div class="zr-list">${list.filter(r=>r!==focus).map(fmt).join('')}</div>` : ''}
      <div class="zr-head" style="margin-top:8px;font-size:.85em">Phân phối điểm (trục dưới = khoảng điểm):</div>
      <div style="display:flex;align-items:flex-end;gap:1px;margin:4px 0">${histBars}</div>
      <p class="hint">⚠ Tham khảo chọn giờ/ngày sinh — không dùng để "chọn số mệnh". Điểm phụ thuộc refYear (đại vận/niên hiện tại); mở rộng năm quét để sát cực hơn.</p>`;
  }, 20);
}

// ---------------------------------------------------------------- 生肖配对评分 (六合/三合/六冲/六害/三刑/自刑)
function runZodiacPair() {
  const za = $('zp-a').value, zb = $('zp-b').value;
  if (!za || !zb) return;
  const r = zodiacPairScore(za, zb);
  if (!r) { $('zp-out').innerHTML = '<p class="hint" style="color:var(--gold)">Chọn cả hai con giáp.</p>'; return; }
  const cls = r.score >= 62 ? 'rate-cat' : r.score >= 45 ? 'rate-mid' : 'rate-hung';
  const relHtml = r.relations.length
    ? r.relations.map((rr) => {
        const rcls = rr.tone === 'cat' || rr.tone === 'cat-nhe' ? 'rate-cat' : rr.tone === 'hung' ? 'rate-hung' : 'rate-mid';
        const sign = rr.delta > 0 ? '+' : '';
        return `<li><span class="zh">${rr.name}</span> ${rr.vi} <span class="ln-rate ${rcls}">${sign}${rr.delta}</span></li>`;
      }).join('')
    : '<li>(không phạm Lục Hợp/Xung/Hại/Hình cổ pháp — xem ngũ hành tương sinh)</li>';
  $('zp-out').innerHTML = `
    <div class="hh-head">${r.animalA} × ${r.animalB} → <span class="ln-rate ${cls}">${r.rating} (${r.score}/100)</span></div>
    <ul class="zr-reasons">${relHtml}</ul>
    <p class="zr-advice">${r.verdict}</p>
    <p class="hint">${r.note}</p>`;
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
if ($('inv-btn')) $('inv-btn').addEventListener('click', runInverse); // [loop 21] 逆推八字
if ($('zp-btn')) $('zp-btn').addEventListener('click', runZodiacPair);
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
$('ly-btn').addEventListener('click', () => {
  const y = parseInt($('ly-year').value, 10) || new Date().getFullYear();
  renderLyear(y);
  if ($('ly-ev')) renderLyearEvents(y);
});
if ($('ly-ev-btn')) $('ly-ev-btn').addEventListener('click', () => renderLyearEvents(parseInt($('ly-year').value, 10) || new Date().getFullYear()));
$('lm-btn').addEventListener('click', () => renderLiuyue(parseInt($('lm-year').value, 10) || new Date().getFullYear()));
$('lr-btn').addEventListener('click', () => renderLiuRi($('lr-date').value));
if ($('partner-match-btn')) $('partner-match-btn').addEventListener('click', () => {
  if (!currentResult) { alert('Nhập lá số của bạn trước.'); return; }
  const raw = prompt('Nhập lá số ĐỐI TÁC (định dạng: năm,tháng,ngày,giờ,giới tính)\nvd: 1995,3,3,14,nữ');
  if (!raw) return;
  const parts = raw.split(',').map((s) => s.trim());
  if (parts.length < 5) { alert('Sai định dạng. VD: 1995,3,3,14,nữ'); return; }
  try {
    const pR = analyze(+parts[0], +parts[1], +parts[2], +parts[3], 0, parts[4], new Date().getFullYear());
    renderPartnerMatch(currentResult, pR);
  } catch (e) { alert('Không tính được lá số đối tác: ' + e.message); }
});
if ($('planned-birth-btn')) $('planned-birth-btn').addEventListener('click', () => {
  const raw = prompt('Nhập NĂM SINH mong muốn (vd: 2027)');
  if (!raw) return;
  const yr = parseInt(raw.trim(), 10);
  if (!yr || yr < 1990 || yr > 2050) { alert('Năm không hợp lệ. VD: 2027'); return; }
  renderPlannedBirth(yr);
});
// [loop 229] desired 用神 filter for planned-birth — "thụ thai để sinh ra bát tự mong muốn"
if ($('pb-yong-filter')) {
  const WX_BTN = [['木','Mộc','#4caf50'],['火','Hỏa','#e65100'],['土','Thổ','#8d6e63'],['金','Kim','#90a4ae'],['水','Thủy','#1976d2']];
  $('pb-yong-filter').innerHTML = WX_BTN.map(([zh,vi,color]) => `<button class="btn-ghost pb-yong-btn" data-wx="${zh}" style="padding:4px 12px;border-color:${color}40;color:${color}">${vi} <span class="zh">${zh}</span></button>`).join('');
  $('pb-yong-filter').addEventListener('click', (e) => {
    const btn = e.target.closest('.pb-yong-btn');
    if (!btn) return;
    const wx = btn.dataset.wx;
    const defYr = new Date().getFullYear() + 1;
    const raw = prompt(`Tìm bát tự có DỤng = ${btn.textContent.trim()} — nhập NĂM SINH (vd: ${defYr}):`, defYr);
    if (!raw) return;
    const yr2 = parseInt(raw.trim(), 10);
    if (!yr2 || yr2 < 1990 || yr2 > 2050) { alert('Năm không hợp lệ'); return; }
    const el = $('planned-birth');
    if (el) el.innerHTML = '<p class="hint">⏳ Đang quét bát tự có Dụng ' + btn.textContent.trim() + '... mất vài giây.</p>';
    setTimeout(() => {
      try {
        const r = inverseBaZiSolve({ refYear: yr2, yearStart: yr2, yearEnd: yr2, stepDays: 3, topK: 5, maxSamples: 4000, targetYong: wx });
        if (!r.max) { el.innerHTML = '<p class="hint">Không tìm thấy lá số nào có Dụng ' + btn.textContent.trim() + ' trong năm ' + yr2 + '.</p>'; return; }
        const results = r.topK || [r.max];
        const rows = results.map((res, i) => {
          const birth = new Date(res.y, res.m - 1, res.d);
          const conc = new Date(birth); conc.setDate(conc.getDate() - 280);
          const concStr = conc.getFullYear() + '-' + String(conc.getMonth() + 1).padStart(2, '0') + '-' + String(conc.getDate()).padStart(2, '0');
          return '<div class="yz-row" style="border-left:3px solid var(--gold);padding-left:8px;margin:4px 0" title="' + esc(labelResult(res)) + '"><b>#' + (i + 1) + ' Sinh ' + res.y + '-' + res.m + '-' + res.d + ' giờ ' + (res.h >= 10 ? res.h : '0' + res.h) + ':' + (res.min || '00') + ' (' + res.g + ')</b> — ' + res.score + 'đ · Dụng ' + esc(res.yong || '') + '<br><span class="zh" style="font-size:16px">' + (res.pillars || []).join(' · ') + '</span> <span class="hint">(年·月·日·时)</span><br><span class="hint">🤰 Thụ thai khoảng <b>' + concStr + '</b></span></div>';
        }).join('');
        el.innerHTML = '<p class="hint">Top ' + results.length + ' lá số có <b>Dụng ' + btn.textContent.trim() + '</b> năm ' + yr2 + ' (lọc ' + results.length + ' từ ' + r.scanned + ' lá số). ' + esc(r.note || '') + '</p>' + rows;
      } catch (e) { el.innerHTML = '<p class="hint">Lỗi: ' + esc(e.message) + '</p>'; }
    }, 50);
  });
}
if ($('wedding-date-btn')) $('wedding-date-btn').addEventListener('click', () => {
  const raw = prompt('Nhập NĂM SINH cô dâu + chú rể (cách nhau dấu phẩy)\nvd: 1995,1993');
  if (!raw) return;
  const [ya, yb] = raw.split(',').map((s) => parseInt(s.trim(), 10));
  if (!ya || !yb) { alert('Sai. VD: 1995,1993'); return; }
  const ZHI12 = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const zA = ZHI12[((ya - 4) % 12 + 12) % 12], zB = ZHI12[((yb - 4) % 12 + 12) % 12];
  try {
    const now = new Date();
    const dates = findWeddingDates(zA, zB, now.getFullYear(), now.getMonth() + 1, now.getDate(), 90, 5);
    renderWeddingDate(dates);
  } catch (e) { alert('Không tính được ngày cưới: ' + e.message); }
});
if ($('zlr-btn')) $('zlr-btn').addEventListener('click', () => renderZiweiLiuri($('zlr-date').value));
if ($('bh-btn')) $('bh-btn').addEventListener('click', () => renderBestHour($('bh-date').value));
$('lr-find').addEventListener('click', () => {
  if (!currentResult) return;
  const [y, m, d] = ($('lr-date').value || '').split('-').map(Number);
  const list = findGoodDaysRi(currentResult, y, m, d, 14, 6);
  $('liuri').innerHTML = `<p class="hint">Top ${list.length} ngày VẬN CÁ NHÂN tốt nhất trong 14 ngày tới:</p>
    <div class="zr-list">${list.map((g) => `<div class="zr-item"><b>${g.solar}</b> <span class="zh">${g.ganZhi}</span> <span class="ln-rate ${g.score >= 64 ? 'rate-cat' : 'rate-mid'}">${g.rating} ${g.score}</span></div>`).join('')}</div>`;
});
$('ts-btn').addEventListener('click', () => renderTaisui(parseInt($('ts-year').value, 10) || new Date().getFullYear()));
$('lns-btn').addEventListener('click', () => renderLiunianShen(parseInt($('lns-year').value, 10) || new Date().getFullYear()));
$('lns12-btn').addEventListener('click', () => renderLiunian12Shen(parseInt($('lns12-year').value, 10) || new Date().getFullYear()));
$('nm-btn').addEventListener('click', renderName);
if($('nm-vi-btn')){$('nm-vi-btn').addEventListener('click', ()=>{ const vi=$('nm-vi').value.trim(); if(!vi) return; const r=viToHan(vi); if(r.ok){ $('nm-input').value=r.hanString; renderName(); } else { $('nm-input').value=r.hanString; $('nm-strokes').value=r.strokes.map((s,i)=>r.chars[i].han+'='+s).join(','); renderName(); } });}
// Tướng thuật 相术 (Face Reading) — tương tác
initPhysiognomySelects();
$('ph-palace-btn').addEventListener('click', renderPhPalace);
$('ph-palace').addEventListener('change', renderPhPalace);
$('ph-mole-btn').addEventListener('click', renderPhMole);
$('ph-mole').addEventListener('change', renderPhMole);
$('ph-age-btn').addEventListener('click', renderPhAge);
$('ph-age').addEventListener('keydown', (e) => { if (e.key === 'Enter') renderPhAge(); });
renderPhOverview();
$('cz-btn').addEventListener('click', renderCezi);
$('cz-char').addEventListener('keydown', (e) => { if (e.key === 'Enter') renderCezi(); });
$('xk-btn').addEventListener('click', () => renderXuankong(parseInt($('xk-year').value, 10) || new Date().getFullYear()));
$('dg-btn').addEventListener('click', renderDagua);
$('dg-sit').addEventListener('change', renderDagua);
$('dg-face').addEventListener('change', renderDagua);
$('mh-time-btn').addEventListener('click', runMeihuaTime);
$('mh-num-btn').addEventListener('click', runMeihuaNum);
if ($('dg-day-btn')) $('dg-day-btn').addEventListener('click', runDonggongDay);
if ($('dg-month-btn')) $('dg-month-btn').addEventListener('click', runDonggongMonth);
if ($('dg-date')) $('dg-date').addEventListener('change', runDonggongDay);
$('ly-cast-btn').addEventListener('click', runLiuyao);
$('qq-cast-btn').addEventListener('click', runQiuqian);
$('qq-jiao-btn').addEventListener('click', runJiaobei);
if ($('jm-btn')) {
  $('jm-btn').addEventListener('click', runJiemeng);
  $('jm-query').addEventListener('keydown', (e) => { if (e.key === 'Enter') runJiemeng(); });
}
$('qm-btn').addEventListener('click', runQimen);
(function () {
  const d = new Date(); $('ly-date').value = d.toISOString().slice(0, 10);
  const pad = (n) => String(n).padStart(2, '0');
  $('qm-dt').value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
})();
runQimen();
if($('ln-btn')){$('ln-btn').addEventListener('click',runLiuren); const _lp=n=>String(n).padStart(2,'0'); const _ln=new Date(); $('ln-dt').value=_ln.getFullYear()+'-'+_lp(_ln.getMonth()+1)+'-'+_lp(_ln.getDate())+'T'+_lp(_ln.getHours())+':00'; runLiuren();}
if($('ty-btn')){$('ty-btn').addEventListener('click',runTaiyi); const _tn=new Date(); $('ty-year').value=_tn.getFullYear(); $('ty-month').value=_tn.getMonth()+1; runTaiyi();}
// Mai Hoa: tự gieo cho hôm nay khi load
function initMeihua() {
  const now = new Date();
  const iso = now.toISOString().slice(0, 10);
  $('mh-date').value = iso;
  runMeihuaTime();
}
initMeihua();
// 求签: mặc định ngày cầu = hôm nay
if ($('qq-date')) { $('qq-date').value = new Date().toISOString().slice(0, 10); }
// Tiểu Lục Nhâm: tự bói cho hôm nay khi load
if ($('xlr-btn')) {
  $('xlr-btn').addEventListener('click', runXiaoliuren);
  const _xp = (n) => String(n).padStart(2, '0');
  const _xn = new Date();
  $('xlr-dt').value = _xn.getFullYear() + '-' + _xp(_xn.getMonth() + 1) + '-' + _xp(_xn.getDate()) + 'T' + _xp(_xn.getHours()) + ':00';
  runXiaoliuren();
}
// Kim Khẩu Quyết (金口诀): nút + tự xếp cho hôm nay khi load
if ($('jk-btn')) {
  $('jk-btn').addEventListener('click', runJinkoujue);
  const _jn = new Date();
  const _jp = (n) => String(n).padStart(2, '0');
  $('jk-dt').value = _jn.getFullYear() + '-' + _jp(_jn.getMonth() + 1) + '-' + _jp(_jn.getDate()) + 'T' + _jp(_jn.getHours()) + ':00';
  runJinkoujue();
}
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
  const cs = $('chat-suggest'); if (cs) cs.style.display = ''; // re-show chips when reopening
  setTimeout(() => { const q = $('question'); if (q) q.focus(); }, 50);
  const cl = $('chat-log');
  if (cl && !cl.childElementCount) appendMsg('assistant', 'Xin chào! Tôi là trợ lý Bát Tự AI. Bạn đã lập lá số — hãy hỏi tôi bất cứ điều gì về vận mệnh, sự nghiệp, tình duyên, tài lộc, thời điểm cưới/con/mua nhà… (Bấm ⚙ để bật AI thật; chưa bật thì tôi dùng bộ luân giải cục bộ.)');
});
// suggestion chips — click to auto-fill + submit
document.querySelectorAll('.suggest-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const q = $('question');
    if (q) { q.value = chip.dataset.q; const btn = $('ask-btn'); if (btn) btn.click(); }
    // hide chips after first use
    const cs = $('chat-suggest'); if (cs) cs.style.display = 'none';
  });
});

$('ai-popup-close').addEventListener('click', () => {
  $('ai-popup').classList.add('hidden');
  $('ai-fab').classList.remove('hidden');
});

$('calendar-note').textContent =
  'Lưu ý: trụ Tháng tính theo Tiết khí (24 tiết), trụ Giờ theo giờ Tý–Hợi. Giờ sinh càng chính xác, luận giải càng chuẩn.';

// NOTE: run() không gọi ở đây — gọi 1 lần duy nhất ở khối auto-render cuối file
// (sau khi localStorage đã load xong), tránh render 2 lần khi tải trang.

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
  // [loop 12] Truyền patternQuality → best/worst days của năm nhận thức 格局.
  const Y = computeYearDaily(R, year, R.patternQuality);
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

$('print-btn')?.addEventListener('click', () => window.print());
// [loop 278] force-open all <details> for print — CSS display:block !important
//   doesn't override browser's built-in details hiding. Without this, all
//   collapsible sections (factors/tonggen roots/sanyuan/jiaoyun/etc.) are
//   MISSING from the print/PDF.
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('details:not([open])').forEach((d) => { d.setAttribute('open', ''); d.dataset._printOpened = '1'; });
});
window.addEventListener('afterprint', () => {
  document.querySelectorAll('details[data-_printOpened]').forEach((d) => { d.removeAttribute('open'); delete d.dataset._printOpened; });
});

$('ev-btn')?.addEventListener('click', () => {
  if (!currentResult) { $('event-verify').innerHTML = '<p class="hint">Nhập ngày sinh rồi luận giải trước.</p>'; return; }
  const yr = parseInt($('ev-year').value, 10) || 2026;
  const type = $('ev-type').value;
  try {
    const r = verifyPastEvent(currentResult, yr, type);
    $('event-verify').innerHTML = `
      <p style="font-weight:600;color:${r.confidence === 'high' ? 'var(--cat,#2a7)' : r.confidence === 'low' ? 'var(--hung,#c33)' : '#d49a3a'}">${r.verdict}</p>
      <p class="hint"><b>Sự kiện:</b> ${r.eventVi} (${r.eventYear}) — Mong đợi: ${r.expected}</p>
      <p class="hint">📊 Năm ${r.eventYear}: vận ${r.lnRating||'?'} (${r.lnScore||'?'}đ) · can ${r.lnGod||'?'} · 12神 ${r.god12||'?'}${r.taiSuiOffends ? ' · ⚡ phạm thái tuế' : ''}</p>
      <ul class="hint" style="margin:4px 0 4px 16px">${r.found.map((f) => `<li>${f}</li>`).join('')}</ul>`;
  } catch (e) { $('event-verify').innerHTML = '<p class="hint">Không xác nhận được.</p>'; }
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

// ---------------------------------------------------------------- 金口诀 (Kim Khẩu Quyết)
function runJinkoujue() {
  const ZHI_HOUR = ['', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const dv = $('jk-dt').value;
  const mManual = parseInt($('jk-month').value, 10);
  const dManual = parseInt($('jk-day').value, 10);
  const hManual = parseInt($('jk-hour').value, 10);
  const ganOverride = $('jk-gan').value || null;
  let r;
  try {
    if (!isNaN(mManual) && !isNaN(dManual) && !isNaN(hManual)) {
      // nhập tay (âm lịch) ưu tiên nếu đủ 3 trường; dùng solar từ datetime nếu có, không thì hôm nay
      let solar;
      if (dv) {
        const [d1, t1] = dv.split('T');
        const [y, mo, dd] = d1.split('-').map(Number);
        const hh = t1 ? (parseInt(t1.slice(0, 2), 10) || 12) : 12;
        solar = { year: y, month: mo, day: dd, hour: hh };
      }
      r = jinkoujue(mManual, dManual, hManual, { solar, dayGan: ganOverride });
    } else if (dv) {
      const [d1, t1] = dv.split('T');
      const [y, mo, dd] = d1.split('-').map(Number);
      const hh = t1 ? (parseInt(t1.slice(0, 2), 10) || 12) : 12;
      // chuyển dương → âm để lấy tháng/ngày âm + can chi tự động
      const s = Solar.fromYmdHms(y, mo, dd, hh, 0, 0);
      const l = s.getLunar();
      const lmonth = l.getMonth();
      const lday = l.getDay();
      const hZhi = l.getTimeZhi();
      const hNum = ZHI_HOUR.indexOf(hZhi);
      r = jinkoujue(lmonth, lday, hNum, { solar: { year: y, month: mo, day: dd, hour: hh }, dayGan: ganOverride });
    } else {
      $('jinkoujue').innerHTML = '<p class="hint">Chọn ngày giờ, hoặc nhập đủ tháng/ngày/giờ âm lịch.</p>';
      return;
    }
  } catch (e) {
    $('jinkoujue').innerHTML = '<p class="hint" style="color:var(--gold)">' + e.message + '</p>';
    return;
  }
  $('jinkoujue').innerHTML = renderJinkoujueCard(r);
}

// ---------------------------------------------------------------- THÁI NHẤT THẦN SỐ 太乙神数
function runTaiyi() {
  const yEl = $('ty-year'), mEl = $('ty-month');
  const y = parseInt(yEl && yEl.value, 10) || new Date().getFullYear();
  let m = null;
  if (mEl && mEl.value) { const mn = parseInt(mEl.value, 10); if (mn >= 1 && mn <= 12) m = mn; }
  let r;
  try { r = taiyi(y, m); }
  catch (e) { $('taiyi').innerHTML = '<p class="hint" style="color:var(--gold)">' + e.message + '</p>'; return; }
  const g = r.taiyiGongInfo;
  const luckCls = r.luck === 'Cát' ? 'rate-cat' : r.luck === 'Hung' ? 'rate-hung' : 'rate-mid';
  const favorCls = r.favor.startsWith('主') ? 'rate-mid' : 'rate-cat';
  // Phân loại 算 cổ phương (长数 ≥10 cát, 杜塞 bội 10 hung)
  const suanTag = (s) => s >= 10 ? (s % 10 === 0 ? '杜塞' : '长数') : '短数';
  const suanCls = (s) => s >= 10 ? (s % 10 === 0 ? 'rate-hung' : 'rate-cat') : 'rate-mid';
  const html =
    '<div class="lr-head">Năm <b>' + r.year + '</b>' + (r.month ? ' · tháng ' + r.month : '') + ' · 积年 <b>' + r.jiyuan.toLocaleString('en-US') + '</b> · ' + r.wuYuan + '/' + r.jiName + ' · 入纪 ' + r.ruji + '/360 · 入局 <b>' + r.ruju + '/72</b>' + (r.rujuYue !== null ? ' (月局 ' + (r.rujuYue + 1) + ')' : '') + '</div>'
    + '<div class="lr-row"><span class="lr-sec">太乙 行宫</span><b class="zh">' + r.taiyiGongName + '</b> (' + g.gua + ' · ' + g.wx + ' · ' + g.dir + ' · ' + g.nature + ') — năm thứ ' + (r.taiyiYearsIn + 1) + '/3</div>'
    + '<div class="lr-row"><span class="lr-sec">天目/文昌</span><b class="zh">' + r.tianmuPos + '</b> <span class="hint-inline">@cung ' + r.tianmuGong + ' (' + r.tianmu + ' — ' + r.tianmuVi + ')</span></div>'
    + '<div class="lr-row"><span class="lr-sec">计神/始击</span><b class="zh">' + r.jishenPos + '</b> → <b class="zh">' + r.shijiPos + '</b> <span class="hint-inline">@cung ' + r.shijiGong + ' (客目)</span></div>'
    + '<div class="lr-row"><span class="lr-sec">主算/客算</span><span class="ln-rate ' + suanCls(r.zhuSuan) + '">主算 ' + r.zhuSuan + ' <small>' + suanTag(r.zhuSuan) + '</small></span> <span class="ln-rate ' + suanCls(r.keSuan) + '">客算 ' + r.keSuan + ' <small>' + suanTag(r.keSuan) + '</small></span></div>'
    + '<div class="lr-row"><span class="lr-sec">Chủ / Khách</span><span class="ln-rate ' + favorCls + '">' + r.favor + '</span> <span class="ln-rate ' + luckCls + '">' + r.luck + '</span>' + ((r.buHeZhu || r.buHeKe) ? ' <span class="ln-rate rate-hung">不和数</span>' : '') + '</div>'
    + '<div class="zr-advice">' + r.advice + '</div>'
    + '<p class="hint">' + r.note + '</p>';
  $('taiyi').innerHTML = html;
}

// ---------------------------------------------------------------- HÔM NAY TỔNG HỢP
function renderDaily() {
  const el = $('daily-out');
  if (!el) return;
  if (!currentResult) { el.textContent = 'Nhập ngày sinh rồi luận giải để xem hôm nay.'; return; }
  const r = dailyGuidance(currentResult);
  const cls = r.score >= 65 ? 'rate-cat' : r.score >= 45 ? 'rate-mid' : 'rate-hung';
  const yiHtml = r.yi.map((y) => '<span class="lm-rate rate-cat">' + y + '</span>').join(' ');
  const jiHtml = r.ji.map((j) => '<span class="lm-rate rate-hung">' + j + '</span>').join(' ');
  const reasonsHtml = r.reasons.map((rs) => '<li>' + rs + '</li>').join('');
  el.innerHTML =
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

// ---------------------------------------------------------------- ÂM PHẦN 24 SƠN (yinzhai)
function renderYinzhai() {
  const el = document.getElementById('yinzhai-out');
  if (!el) return;
  const ov = yinzhaiOverview();
  // build <select>
  const opts = MOUNTAINS_24.map((m) => '<option value="' + m.zhi + '">' + m.vi + ' (' + m.zhi + ') — ' + m.palaceVi + ' ' + m.dir + '</option>').join('');
  const rulesHtml =
    '<details><summary>' + ov.ruleSummary.shaRule.title + '</summary><ul>' + ov.ruleSummary.shaRule.points.map((p) => '<li>' + p + '</li>').join('') + '</ul></details>' +
    '<details><summary>' + ov.ruleSummary.waterRule.title + '</summary><ul>' + ov.ruleSummary.waterRule.points.map((p) => '<li>' + p + '</li>').join('') + '</ul></details>' +
    '<details><summary>' + ov.ruleSummary.anShanRule.title + '</summary><ul>' + ov.ruleSummary.anShanRule.points.map((p) => '<li>' + p + '</li>').join('') + '</ul></details>';
  el.innerHTML =
    '<div class="yz-head">' + ov.title + '</div>' +
    '<p class="hint">' + ov.note + ' <em>Nguồn: ' + ov.source + '</em></p>' +
    '<div class="yz-select"><label>Chọn sơn TỌA (坐): </label><select id="yz-mountain">' + opts + '</select></div>' +
    '<div id="yz-result"></div>' +
    '<div class="yz-rules">' + rulesHtml + '</div>';
  function paint(zhi) {
    const out = document.getElementById('yz-result');
    if (!out) return;
    const sa = sittingDirectionAnalysis(zhi);
    if (!sa) { out.innerHTML = '<p class="hint">(chọn sơn hợp lệ)</p>'; return; }
    const cls = sa.score >= 70 ? 'cat' : sa.score >= 50 ? 'mid' : 'xiong';
    const goodHtml = sa.good.map((g) => '<span class="lm-rate rate-cat">' + g.vi + ' (' + g.zhi + ')</span>').join(' ');
    const badHtml = sa.bad.map((b) => '<span class="lm-rate rate-hung">' + b.vi + ' (' + b.zhi + ')</span>').join(' ');
    out.innerHTML =
      '<div class="yz-row"><b>Tọa:</b> ' + sa.sitting.vi + ' (' + sa.sitting.zhi + ') @ ' + sa.sitting.dir + ' · ' + sa.sitting.palaceVi + '</div>' +
      '<div class="yz-row"><b>Hướng (đối cung):</b> ' + (sa.facing.primary ? sa.facing.primary.vi + ' (' + sa.facing.primary.zhi + ') @ ' + sa.facing.primary.dir : '?') + '</div>' +
      '<div class="yz-row"><b>Hướng cát:</b> ' + (goodHtml || '—') + '</div>' +
      '<div class="yz-row"><b>Hướng kỵ:</b> ' + (badHtml || '—') + '</div>' +
      (sa.sanhe ? '<div class="yz-row"><b>Tam hợp cục:</b> ' + sa.sanhe.wx + ' (' + sa.sanhe.members.join('-') + ')</div>' : '') +
      (sa.chong ? '<div class="yz-row"><b>Lục xung:</b> ' + sa.chong + '</div>' : '') +
      '<div class="ln-rate ' + ('rate-' + cls) + '">' + sa.score + '/100 · ' + sa.verdict + '</div>' +
      '<div class="zr-advice">' + sa.note + '</div>';
  }
  const sel = document.getElementById('yz-mountain');
  if (sel) {
    sel.value = '壬';
    sel.addEventListener('change', () => paint(sel.value));
    paint('壬');
  }
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
  const R = currentResult;
  const kw = analyzeKongwang(R.chart);
  const el = document.getElementById('kongwang-out');
  if (!el) return;
  if (!kw.affected.length) { el.innerHTML = '<p class="hint">Không trụ nào rơi không vong — lá số không bị "treo".</p>'; return; }
  // [loop 163 ELEVATION] Lịch kích hoạt 空亡 — quét 流年 (10 năm tới) & 大运 thực tế của
  //   mệnh chủ để chỉ ra CHÍNH XÁC năm nào cung bị «treo» sẽ «xuất không»/«冲空» → sự kiện phát.
  //   Trước đây thẻ chỉ nói «đợi vận đến» chung chung; nay cho ngày giờ cụ thể.
  const CHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
  const curYear = new Date().getFullYear();
  const liunian = (R.liunian || []).filter((l) => l.year >= curYear - 1); // cửa sổ ~10 năm quanh hiện tại
  const dayun = R.dayun || [];
  const kongSet = new Set(kw.kong);
  // Với mỗi void chi, gom các mốc 出空/冲空
  const rows = [];
  for (const kc of kw.kong) {
    const chongChi = CHONG[kc];
    // 流年
    for (const l of liunian) {
      if (l.zhi === kc) rows.push({ chi: kc, type: '出空', scope: `Lưu niên ${l.year}`, gz: l.ganZhi, rating: l.rating, isNow: l.isNow, tag: '⚡ cung «treo» NĂM NAY BẬT' });
      else if (chongChi && l.zhi === chongChi) rows.push({ chi: kc, type: '冲空', scope: `Lưu niên ${l.year}`, gz: l.ganZhi, rating: l.rating, isNow: l.isNow, tag: '💥 sự kiện ĐỘT NGỘT' });
    }
    // 大运 (thập niên)
    for (const d of dayun) {
      if (!d.ganZhi) continue;
      if (d.zhi === kc) rows.push({ chi: kc, type: '出空 (đại vận)', scope: `Đại vận ${d.startAge}t (${d.startYear})`, gz: d.ganZhi, rating: d.rating, isNow: false, tag: '⚡ cả THẬP NIÊN cung bật' });
      else if (chongChi && d.zhi === chongChi) rows.push({ chi: kc, type: '冲空 (đại vận)', scope: `Đại vận ${d.startAge}t (${d.startYear})`, gz: d.ganZhi, rating: d.rating, isNow: false, tag: '💥 thập niên biến động' });
    }
  }
  rows.sort((a, b) => {
    const ya = parseInt((a.scope.match(/\d{4}/) || [0])[0], 10);
    const yb = parseInt((b.scope.match(/\d{4}/) || [0])[0], 10);
    return (ya || 9999) - (yb || 9999);
  });
  const typeCls = (t) => t.startsWith('出空') ? 'geju-xi' : 'geju-ji';
  const timelineHtml = rows.length
    ? '<div class="kw-timeline"><div class="kw-tl-head">📅 Lịch kích hoạt (khi cung «treo» thành «thực»):</div><ul class="kw-tl">' + rows.map((r) =>
        '<li><span class="kw-chi zh">' + r.chi + '</span> <span class="' + typeCls(r.type) + '">' + r.type + '</span> <b>' + r.scope + '</b> <span class="zh">' + r.gz + '</span> <span class="ln-rate ' + rateClass(r.rating) + '">' + (r.rating || '—') + '</span>' + (r.tag ? ' <span class="hint">' + r.tag + '</span>' : '') + '</li>'
      ).join('') + '</ul></div>'
    : '<p class="hint">Trong cửa sổ 10 năm tới không có lưu niên/đại vận mang chi «' + kw.kong.join('/') + '» (hoặc 冲 chi đó) — cung «treo» vẫn chưa tới lúc «xuất không».</p>';
  el.innerHTML = '<div class="kw-note"><b>空亡 (' + kw.kong.join(', ') + ')</b> — ' + kw.note + '</div><ul class="zr-reasons">' + kw.affected.map((a) => '<li><b>' + a.palace + '</b>: ' + a.note + '</li>').join('') + '</ul>' + timelineHtml + (kw.tips.length ? '<p class="hint">' + kw.tips.join(' ') + '</p>' : '');
}

// ---------------------------------------------------------------- TUẾ VẬN TỊNH LÂM 岁运并临 (lưu niên × đại vận)
function renderSuiyun() {
  if (!currentResult) return;
  const R = currentResult;
  const el = document.getElementById('suiyun-out');
  if (!el) return;
  const age = (new Date().getFullYear() - R.chart.input.year);
  const out = scanSuiyun(R.chart, R.dayun, R.liunian, age);
  if (!out || !out.activeDayun) { el.innerHTML = '<p class="hint">Không xác định được đại vận đang hành.</p>'; return; }
  // [loop 165] Phân loại «hướng» từng năm: cát (hòa/hợp/đồng khí Dụng) vs hung (xung/并临 Kỵ).
  const curYear = new Date().getFullYear();
  const fav = new Set([R.yong.primary, R.yong.xi].filter(Boolean));
  const rows = (out.specialYears || []).map((s) => {
    const lnGan = s.liunianGanZhi[0], lnZhi = s.liunianGanZhi[1];
    const ganFav = fav.has(GAN[lnGan] ? GAN[lnGan].wx : '');
    const zhiFav = fav.has(ZHI[lnZhi] ? ZHI[lnZhi].wx : '');
    const isXung = /XUNG|xung/i.test(s.note);
    const isBinglin = s.type === '并临';
    // hung: xung đại vận, hoặc 并临 mà năm KHÔNG mang Dụng/Hỷ (Kỵ amplified); cát: hợp/hòa hoặc Dụng-bearing
    let tone;
    if (isXung) tone = 'hung';
    else if (isBinglin) tone = (ganFav || zhiFav) ? 'cat' : 'hung';
    else if (ganFav || zhiFav) tone = 'cat';
    else tone = 'mid';
    return { ...s, tone, ganFav, zhiFav, isPast: s.year < curYear, isNow: s.year === curYear };
  });
  // sort: 并临 đầu, rồi theo severity, rồi năm
  rows.sort((a, b) => {
    if (a.isBinglin !== b.isBinglin) return (b.type === '并临' ? 1 : 0) - (a.type === '并临' ? 1 : 0);
    return b.severity - a.severity || a.year - b.year;
  });
  const toneCls = { cat: 'rate-cat', hung: 'rate-hung', mid: 'rate-mid' };
  const toneVi = { cat: 'Cát', hung: 'Hung', mid: 'Trung' };
  const head = '<div class="kw-tl-head">🎯 Đại vận đang hành <b class="zh">' + out.activeDayun.ganZhi + '</b> (' + out.activeDayun.from + '–' + out.activeDayun.to + ' tuổi) — các lưu niên «kép»:</div>';
  const body = rows.length
    ? '<ul class="kw-tl">' + rows.map((r) => {
        const tag = r.type === '并临' ? '<span class="geju-ji">⚡ 岁运并临</span>' : r.tone === 'cat' ? '<span class="geju-xi">cát</span>' : r.tone === 'hung' ? '<span class="geju-ji">hung</span>' : '<span class="geju-xi">·</span>';
        return '<li class="sy-' + r.tone + '"><b>' + r.year + (r.isNow ? ' ★' : '') + (r.isPast ? ' <span class="hint">(đã qua)</span>' : '') + '</b> <span class="zh">' + r.liunianGanZhi + '</span> <span class="ln-rate ' + toneCls[r.tone] + '">' + toneVi[r.tone] + '</span> ' + tag + '<div class="hint">' + esc(r.note) + '</div></li>';
      }).join('') + '</ul>'
    : '<p class="hint">Trong đại vận này không có lưu niên nào trùng/xung/hợp đại vận một cách nổi bật — thập niên tương đối «đều».</p>';
  el.innerHTML = head + body + '<p class="hint">Cổ ngữ «岁运并临, 不死自己死他人» — năm lưu niên TRÙNG ĐỨNG đại vận (cùng干支) là năm cực trọng, lực nhân đôi (Dụng → đỉnh cát / Kỵ → hung mạnh). Năm XUNG đại vận = biến động lớn.</p>';
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
function renderDecadeCurve() {
  if (!currentResult) return;
  let v;
  try { v = analyzeVitality(currentResult); } catch (e) { $('decade-curve').innerHTML = '<p class="hint">Không tính được.</p>'; return; }
  const traj = v.trajectory || [];
  if (!traj.length) { $('decade-curve').innerHTML = '<p class="hint">Không có dữ liệu đại vận.</p>'; return; }
  const W = 340, H = 140, padX = 30, padY = 20;
  const n = traj.length;
  const xOf = (i) => padX + (i * (W - padX * 2) / (n - 1));
  const yOf = (s) => H - padY - (s / 100) * (H - padY * 2);
  const pts = traj.map((t, i) => `${xOf(i)},${yOf(t.score)}`);
  const area = `M${xOf(0)},${H - padY} L${pts.join(' L')} L${xOf(n - 1)},${H - padY} Z`;
  const peakIdx = traj.findIndex((t) => t.age === v.peakAge);
  const lowIdx = traj.findIndex((t) => t.age === v.lowAge);
  const labels = traj.map((t, i) => {
    const x = xOf(i), y = yOf(t.score);
    const isPeak = i === peakIdx, isLow = i === lowIdx;
    const color = t.score >= 60 ? '#2e7d32' : t.score >= 40 ? '#b8860b' : '#c62828';
    const dot = `<circle cx="${x}" cy="${y}" r="${isPeak || isLow ? 5 : 3}" fill="${color}" stroke="#fff" stroke-width="1"/>`;
    const lbl = `<text x="${x}" y="${y - 8}" text-anchor="middle" font-size="8" fill="${color}" font-weight="bold">${t.score}</text>`;
    const age = `<text x="${x}" y="${H - 6}" text-anchor="middle" font-size="7" fill="#888">${t.age}</text>`;
    const mark = isPeak ? `<text x="${x}" y="${y + 14}" text-anchor="middle" font-size="7" fill="#2e7d32">★đỉnh</text>` : isLow ? `<text x="${x}" y="${y + 14}" text-anchor="middle" font-size="7" fill="#c62828">⚠đáy</text>` : '';
    return dot + lbl + age + mark;
  }).join('');
  $('decade-curve').innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="max-width:100%;height:auto">
      <defs><linearGradient id="dc-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d4a017" stop-opacity="0.3"/><stop offset="100%" stop-color="#d4a017" stop-opacity="0.05"/></linearGradient></defs>
      <path d="${area}" fill="url(#dc-grad)"/>
      <polyline points="${pts.join(' ')}" fill="none" stroke="#d4a017" stroke-width="2"/>
      ${labels}
    </svg>
    <p class="hint" style="margin:4px 0">Đỉnh vận: <b>${v.peakAge || '?'}</b> | Đáy vận: <b>${v.lowAge || '?'}</b> | Hiện tại: <b>${v.currentVitality ?? '?'}</b>. ${v.advice || ''}</p>`;
}

function renderQuickSummary() {
  if (!currentResult) return;
  const c = currentResult;
  const syn = c.synthesis || {};
  const yong = c.yong || {};
  const pattern = c.pattern || {};
  const el = $('quick-summary');
  if (!el) return;
  const WX_VI = { 木: 'Mộc', 火: 'Hỏa', 土: 'Thổ', 金: 'Kim', 水: 'Thủy' };
  const dungVi = WX_VI[yong.primary] || '?';
  // Hôm nay
  let todayScore = '?', todayRating = '?', todayOneLiner = '';
  try { const b = dailyBriefing(c, new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate(), c.patternQuality); todayScore = b.rating?.score ?? '?'; todayRating = b.rating?.level ?? '?'; todayOneLiner = (b.oneLiner || '').slice(0, 60); } catch (e) {}
  const todayTone = (typeof todayScore === 'number' && todayScore >= 60) ? '🟢' : (typeof todayScore === 'number' && todayScore >= 45) ? '🟡' : '🔴';
  // Tuần này
  let weekSummary = '';
  try { const w = weekPreview(c, { days: 7 }); weekSummary = (w.summary || '').slice(0, 70); } catch (e) {}
  // Cảnh báo
  let alert = '';
  try { const ha = healthAlertScan(c, 1); if (ha.alerts.length) { const a = ha.alerts[0]; alert = `⚠ ${a.year}: ${a.level}${a.reasons.length ? ' — ' + a.reasons[0].slice(0, 50) : ''}`; } } catch (e) {}
  // Dụng thần hành động
  const dungAction = { 木: 'màu xanh, hướng Đông, cây cối', 火: 'màu đỏ, hướng Nam, ánh sáng', 土: 'màu vàng, hướng Tây Nam, gốm đá', 金: 'màu trắng, hướng Tây, vật kim loại', 水: 'màu đen/xanh đậm, hướng Bắc, nước' }[yong.primary] || '';
  // [loop 219] Vận hiện tại — đại运 + lưu niên đang hành (ngữ cảnh giai đoạn đời)
  let curDyTxt = '(đang tính)';
  try {
    const age = new Date().getFullYear() - c.chart.input.year;
    const dy = (c.dayun || []).find((d) => age >= d.startAge && age < d.startAge + 10);
    const ln = (c.liunian || []).find((l) => l.isNow);
    curDyTxt = dy ? `Đại vận <b>${hanviet(dy.ganZhi)}</b> (${dy.startAge}–${dy.startAge + 9}t, ${dy.rating})${ln ? ` · Lưu niên ${hanviet(ln.ganZhi)} (${ln.rating})` : ''}` : '(không rõ)';
  } catch (e) {}
  const rows = [
    { icon: '🧬', label: 'Mệnh bạn', text: `${pattern.vi || '?'}, thân ${c.strength?.strong ? 'vượng (mạnh)' : 'nhược (yếu)'}. <b>Điểm tổng mệnh: ${syn.score ?? '?'}/100 (${syn.gradeVi ?? '?'})</b>.` },
    { icon: '💊', label: 'Hành cần bổ', text: `Dụng Thần = <b>${dungVi}</b>. Bổ qua ${dungAction}.${yong.tiaohou?.override ? ' ⚠ 调候 LÀM CHỦ (sinh mùa cực đoan).' : ''}` },
    { icon: '🛤️', label: 'Vận hiện tại', text: curDyTxt },
    { icon: todayTone, label: 'Hôm nay', text: `${todayRating} (${todayScore}/100). ${todayOneLiner}` },
    { icon: '📆', label: 'Tuần này', text: weekSummary || '(đang tính...)' },
    { icon: alert ? '⚠' : '✓', label: alert ? 'Cảnh báo' : 'An tâm', text: alert || 'Không cảnh báo nặng năm nay.' },
  ];
  el.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:10px">${rows.map((r) => `<div style="flex:1;min-width:180px;padding:8px 10px;background:var(--glass);border-radius:8px;border:1px solid var(--glass-border)"><div style="font-size:.75em;color:var(--gold-bright);font-weight:bold">${r.icon} ${r.label}</div><div style="font-size:.88em;margin-top:2px;color:var(--silk)">${r.text}</div></div>`).join('')}</div>`;
}

function renderMonthCalendar() {
  if (!currentResult) return;
  const el = $('month-calendar');
  const mSel = $('cal-month'), ySel = $('cal-year'), btn = $('cal-btn');
  // populate selects once
  if (mSel && !mSel.childElementCount) {
    const now = new Date();
    for (let m = 1; m <= 12; m++) { const o = document.createElement('option'); o.value = m; o.textContent = 'T' + m; if (m === now.getMonth() + 1) o.selected = true; mSel.appendChild(o); }
    for (let y = now.getFullYear() - 1; y <= now.getFullYear() + 5; y++) { const o = document.createElement('option'); o.value = y; o.textContent = y; if (y === now.getFullYear()) o.selected = true; ySel.appendChild(o); }
    btn.addEventListener('click', () => renderMonthCalendar());
  }
  const year = parseInt(ySel?.value) || new Date().getFullYear();
  const month = parseInt(mSel?.value) || (new Date().getMonth() + 1);
  let cal;
  try { cal = monthCalendar(currentResult, { year, month }); } catch (e) { el.innerHTML = '<p class="hint">Không tính được.</p>'; return; }
  const colors = { cat: { bg: '#e8f5e9', border: '#2e7d32', text: '#1b5e20' }, mid: { bg: '#fff8e1', border: '#b8860b', text: '#5d4037' }, hung: { bg: '#ffebee', border: '#c62828', text: '#b71c1c' }, pad: { bg: 'transparent', border: 'transparent', text: '#ccc' } };
  const headers = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => `<div style="text-align:center;font-size:.7em;font-weight:bold;color:var(--silk-muted);padding:2px">${d}</div>`).join('');
  const cells = cal.days.map((d) => {
    if (!d.inMonth) return `<div style="min-height:38px;padding:2px;opacity:.3;color:#ccc;font-size:.75em;text-align:center"></div>`;
    const c = colors[d.tone];
    const isBest = cal.best && d.day === cal.best.day;
    const isWorst = cal.worst && d.day === cal.worst.day;
    const now = new Date();
    const isToday = year === now.getFullYear() && month === (now.getMonth() + 1) && d.day === now.getDate();
    return `<div style="min-height:38px;padding:2px 3px;background:${c.bg};border:${isToday ? '2px solid var(--gold,#d4af37)' : '1px solid '+c.border+'40'};border-radius:4px;${isBest ? 'box-shadow:0 0 4px '+c.border+'80;' : ''}${isToday ? 'box-shadow:0 0 6px var(--gold,#d4af37);' : ''}">
      <div style="font-size:.75em;font-weight:bold;color:${c.text}">${d.day}${isToday ? ' ★' : ''}</div>
      <div style="font-size:.55em;color:${c.text};opacity:.7">${d.score}</div>
      ${isBest ? '<div style="font-size:.5em;color:#2e9e5b">★</div>' : isWorst ? '<div style="font-size:.5em;color:#e0533d">⚠</div>' : ''}
    </div>`;
  }).join('');
  el.innerHTML = `
    <p style="margin:0 0 6px">${cal.monthVi}: ${cal.summary}</p>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;max-width:100%">${headers}${cells}</div>`;
}

function renderWeekPreview() {
  if (!currentResult) return;
  let w;
  try { w = weekPreview(currentResult, { days: 7 }); } catch (e) { $('week-preview').innerHTML = '<p class="hint">Không tính được.</p>'; return; }
  const colors = { cat: '#2e7d32', mid: '#b8860b', hung: '#c62828' };
  const cells = w.days.map((d) => {
    const c = colors[d.tone];
    const isBest = w.best && d.date === w.best.date;
    const isWorst = w.worst && d.date === w.worst.date;
    const now = new Date();
    const isToday = d.day === now.getDate() && d.month === (now.getMonth() + 1);
    return `<div style="flex:1;min-width:80px;text-align:center;border:1px solid ${isToday ? 'var(--gold,#d4af37)' : isBest ? c : '#e0d0a0'};border-radius:8px;padding:6px 4px;background:${c}15;${isBest ? 'box-shadow:0 0 6px '+c+'80;' : ''}${isToday ? 'box-shadow:0 0 6px var(--gold,#d4af37);' : ''}">
      <div style="font-size:.7em;color:var(--silk-muted)">${d.weekdayVi}</div>
      <div style="font-weight:bold;font-size:1.1em;color:${c}">${d.day}/${d.month}${isToday ? ' ★' : ''}</div>
      <div class="zh" style="font-size:.7em;opacity:.6">${d.ganZhi}</div>
      <div style="font-weight:bold;color:${c};font-size:1em">${d.score}</div>
      <div style="font-size:.65em;color:var(--silk-muted)">${d.rating}</div>
      ${isBest ? '<div style="font-size:.6em;color:#2e9e5b">★ tốt</div>' : isWorst ? '<div style="font-size:.6em;color:#e0533d">⚠ kỵ</div>' : isToday ? '<div style="font-size:.6em;color:var(--gold,#d4af37)">← hôm nay</div>' : ''}
    </div>`;
  }).join('');
  $('week-preview').innerHTML = `
    <p style="margin:0 0 6px">${w.summary}</p>
    <div style="display:flex;gap:4px;overflow-x:auto">${cells}</div>`;
}

function renderFiveDimRadar() {
  if (!currentResult) return;
  let r;
  try { r = fiveDimRadar(currentResult.chart); } catch (e) { $('five-dim-radar').innerHTML = '<p class="hint">Không tính được.</p>'; return; }
  // SVG radar: ngũ giác, 5 trục, lưới 25/50/75/100, polygon dữ liệu tô màu.
  const cx = 130, cy = 130, R = 100;
  const n = r.dims.length;
  const angle = (i) => (-Math.PI / 2) + (i * 2 * Math.PI / n); // trục 0 lên trên
  const pt = (i, rad) => [cx + Math.cos(angle(i)) * rad, cy + Math.sin(angle(i)) * rad];
  const rings = [25, 50, 75, 100];
  const ringPoly = (rr) => rings.map((v) => { const rad = R * v / 100; const [x, y] = pt(0, rad); let p = `M${x},${y}`; for (let i = 1; i < n; i++) { const [xi, yi] = pt(i, rad); p += ` L${xi},${yi}`; } return p + ' Z'; });
  const grid = rings.map((v, i) => `<path d="${ringPoly(v)[0]}" fill="none" stroke="#e3c878" stroke-width="${v === 100 ? 1.2 : 0.5}" opacity="${v === 100 ? 0.7 : 0.4}"/>`).join('');
  const axes = r.dims.map((d, i) => { const [x, y] = pt(i, R); const [lx, ly] = pt(i, R + 16); const [lx2, ly2] = pt(i, R + 30); return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#e3c878" stroke-width="0.5" opacity="0.5"/><text x="${lx}" y="${ly}" text-anchor="middle" font-size="9" fill="#d4a017" font-weight="bold">${d.vi.split(' ')[0]}</text><text x="${lx2}" y="${ly2 + 3}" text-anchor="middle" font-size="9.5" fill="#3a3a3a" font-weight="bold">${d.score}</text>`; }).join('');
  const dataPts = r.dims.map((d, i) => { const [x, y] = pt(i, R * d.score / 100); return `${x},${y}`; }).join(' ');
  const dominantKey = r.dominant.key;
  const colors = { cai: '#e0533d', guan: '#7e57c2', yin: '#2e7d32', shi: '#e08a00', ti: '#1565c0' };
  const fill = colors[dominantKey] || '#d4a017';
  const dataPoly = `<polygon points="${dataPts}" fill="${fill}" fill-opacity="0.28" stroke="${fill}" stroke-width="2"/>`;
  const dots = r.dims.map((d, i) => { const [x, y] = pt(i, R * d.score / 100); return `<circle cx="${x}" cy="${y}" r="3" fill="${fill}"/>`; }).join('');
  // bảng chi tiết
  const rows = r.dims.map((d) => `<tr><td><b>${d.vi.split(' ')[0]}</b></td><td class="zh">${d.gods.map((g) => g.god).join('/')}</td><td><b>${d.score}</b></td><td style="color:var(--silk-muted);font-size:.85em">${d.trait}</td></tr>`).join('');
  $('five-dim-radar').innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
      <svg viewBox="0 0 260 260" width="240" height="240" style="flex:0 0 240px">${grid}${axes}${dataPoly}${dots}</svg>
      <div style="flex:1;min-width:220px">
        <p style="margin:0 0 4px"><b style="color:${fill}">★ Trục trội: ${r.dominant.vi.split(' ')[0]}</b> — thiên ${r.dominant.trait}.</p>
        <p style="margin:0 0 8px;color:var(--silk-muted);font-size:.9em">${r.weakest.vi.split(' ')[0]} yếu nhất (${r.weakest.score}) — cần bồi (đợi vận mang nhóm ${r.weakest.zh}).</p>
        <table style="width:100%;font-size:.85em;border-collapse:collapse"><thead><tr style="color:#999;text-align:left"><th>Trục</th><th class="zh">Thập thần</th><th>Điểm</th><th>Thiên</th></tr></thead><tbody>${rows}</tbody></table>
      </div>
    </div>`;
}

function renderSensitivity() {
  if (!currentResult) return;
  const i = currentResult.chart.input;
  // nếu giờ sinh ẩn/12:00 mặc định → nhắc user nhập giờ
  let s;
  try { s = chartSensitivity({ year: i.year, month: i.month, day: i.day, hour: i.hour, minute: i.minute, gender: i.gender }, { varyDays: 2 }); }
  catch (e) { $('sensitivity').innerHTML = '<p class="hint">Không tính được.</p>'; return; }
  if (s.spread == null) { $('sensitivity').innerHTML = '<p class="hint">Không tính được điểm.</p>'; return; }
  // bar chart 12 时辰
  const max = s.max || 1, min = s.min || 0;
  const bars = s.hourScores.map((h) => {
    const pct = max > min ? Math.round(((h.score - min) / (max - min)) * 100) : 50;
    const tone = h.score >= 62 ? '#2e7d32' : h.score >= 46 ? '#b8860b' : '#c62828';
    const user = h.isUser ? ' ★bạn' : '';
    return `<span title="${h.shichenVi}(${h.shichen})时 = ${h.score}đ" style="display:inline-block;width:34px;text-align:center;font-size:.7em;vertical-align:bottom">
      <b>${h.score}</b><span style="display:block;height:${Math.max(4, pct * 0.4)}px;background:${tone};border-radius:2px;border:${h.isUser?'2px solid #1565c0':'none'}"></span>${h.shichenVi}${user}</span>`;
  }).join('');
  const dayVaryStr = s.dayVary && s.dayVary.length ? s.dayVary.map((d) => `<b>${d.offset > 0 ? '+' : ''}${d.offset}ngày</b>:${d.score}đ`).join(' · ') : '';
  $('sensitivity').innerHTML = `
    <p class="hint">Điểm mệnh của bạn: <b>${s.baseScore}đ</b> @ ${s.baseShichenVi}(${s.baseShichen})时 · dao động khi đổi 时辰: <b>${s.spread}đ</b> (${s.min}→${s.max}).</p>
    <div style="display:flex;align-items:flex-end;gap:1px;margin:6px 0;flex-wrap:wrap">${bars}</div>
    <p style="margin:6px 0">📊 ${s.insight}</p>
    ${dayVaryStr ? `<p class="hint">Đổi NGÀY sinh (±2): ${dayVaryStr} — xem ngày cũng tác động bao nhiêu.</p>` : ''}`;
}

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
    // [loop 25] giờ sinh phối ngẫu — time pillar (tháp thần #4) + giờ chi
    var hourZhi = p.ganZhi4.split(' ')[3] ? p.ganZhi4.split(' ')[3][1] : '';
    var hourZhiVi = hourZhi ? ({子:'Tý',丑:'Sửu',寅:'Dần',卯:'Mão',辰:'Thìn',巳:'Tỵ',午:'Ngọ',未:'Mùi',申:'Thân',酉:'Dậu',戌:'Tuất',亥:'Hợi'})[hourZhi] : '';
    var hourStr = p.time ? ('giờ ' + p.time + ' (~' + hourZhiVi + '时)') : '';
    // Full profile
    var prof = buildFullProfile(p, currentResult);
    var detailId = 'im-det-' + p.rank;
    return '<tr class="im-row" onclick="var d=document.getElementById(\'' + detailId + '\'); d.style.display=d.style.display===\'none\'?\'\':\'none\';">' +
      '<td><b>#' + p.rank + '</b></td>' +
      '<td>' + p.date + '<br><b>' + hourStr + '</b><br><span class="im-age">' + ageStr + '</span></td>' +
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
// load saved birth data from localStorage (if user previously entered their own)
try {
  const saved = JSON.parse(localStorage.getItem('bazi-birth') || 'null');
  if (saved && saved.date) {
    $('date').value = saved.date;
    if (saved.time) $('time').value = saved.time;
    const gRadio = document.querySelector(`input[name="gender"][value="${saved.gender}"]`);
    if (gRadio) gRadio.checked = true;
    if (saved.tz && $('tz')) $('tz').value = String(saved.tz);
    if (saved.city && $('city')) $('city').value = saved.city;
    if (saved.long && $('long')) $('long').value = saved.long;
  }
} catch (e) {}
// [loop 23] city change → hiện/ẩn ô kinh độ thủ công
function syncLongField() {
  const lf = $('long-field'); const c = $('city');
  if (!lf || !c) return;
  lf.style.display = (c.value === 'manual') ? '' : 'none';
}
if ($('city')) { $('city').addEventListener('change', syncLongField); syncLongField(); }
// auto-render on page load — user sees results immediately (saved data or defaults)
try { run(); } catch (e) { console.warn('auto-render:', e.message); }

// ============================================================================
// [loop 148] 3D TILT INTERACTIVE — chuột/touch → card nghiêng 3D + lóa mắt
// ============================================================================
function init3DTilt() {
  const cards = document.querySelectorAll('#result > .card');
  if (!cards.length) return;
  const isTouch = matchMedia('(hover: none)').matches;

  cards.forEach((card) => {
    let glare = card.querySelector('.tilt-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'tilt-glare';
      glare.style.cssText = 'position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:2;opacity:0;transition:opacity .3s;background:radial-gradient(circle at var(--gx,50%) var(--gy,50%),rgba(255,255,255,0.15),transparent 45%)';
      card.appendChild(glare);
    }
    card.style.transformStyle = 'preserve-3d';
    let raf = null;

    // [loop 157] MOBILE: touch-drag tilt
    if (isTouch) {
      let touching = false;
      card.addEventListener('touchstart', () => { touching = true; card.style.transition = 'none'; }, { passive: true });
      card.addEventListener('touchmove', (e) => {
        if (!touching || e.touches.length !== 1) return;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const t = e.touches[0];
          const x = (t.clientX - rect.left) / rect.width;
          const y = (t.clientY - rect.top) / rect.height;
          const rx = Math.max(-8, Math.min(8, (0.5 - y) * 14));
          const ry = Math.max(-8, Math.min(8, (x - 0.5) * 14));
          card.style.transform = `perspective(500px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
          glare.style.setProperty('--gx', (x * 100) + '%');
          glare.style.setProperty('--gy', (y * 100) + '%');
          glare.style.opacity = '1';
        });
      }, { passive: true });
      card.addEventListener('touchend', () => { touching = false; if (raf) cancelAnimationFrame(raf); card.style.transition = ''; card.style.transform = ''; glare.style.opacity = '0'; });
      return;
    }

    // DESKTOP: mouse hover tilt
    let isHovering = false;
    const onEnter = () => {
      isHovering = true;
      card.style.transition = 'none'; // tắt transition khi đang tilt → mượt theo chuột
    };
    const onMove = (e) => {
      if (!isHovering) return;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - y) * 12;   // ±6° — DRAMATIC hơn
        const ry = (x - 0.5) * 12;
        card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px) scale(1.02)`;
        glare.style.setProperty('--gx', (x * 100) + '%');
        glare.style.setProperty('--gy', (y * 100) + '%');
        glare.style.opacity = '1';
      });
    };
    const onLeave = () => {
      isHovering = false;
      if (raf) cancelAnimationFrame(raf);
      card.style.transition = ''; // bật lại transition cho reset mượt
      card.style.transform = '';
      glare.style.opacity = '0';
    };
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });
}
