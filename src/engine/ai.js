// ============================================================================
//  TÍCH HỢP AI (LLM) — luân giải Bát Tự mở rộng cho BẤT KỲ câu hỏi nào
//  - Có cấu hình API (OpenAI-compatible) → gửi "chart brief" + câu hỏi cho LLM,
//    LLM luân giải dựa trên dữ liệu ĐÃ TÍNH ĐÚNG + nguyên lý cổ điển.
//  - Không có cấu hình / lỗi → fallback về tầng NLG cục bộ (composeAnswer).
//  Hỗ trợ: OpenAI, GLM/Z.ai, DeepSeek, Ollama, bất kỳ endpoint /chat/completions.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { composeAnswer } from './nlg.js';
import { DITIANSUI } from './kb.js';
import { analyzeLiunianDeep } from './liunian-pro.js';
import { analyze } from './chart.js'; // [loop 163 fix] analyze_partner tool cần analyze() để build lá số đối tác — trước đây thiếu import → tool báo "analyze is not defined" → AI KHÔNG trả lời được câu hợp tuổi/hôn nhân/kinh doanh
import { analyzeKongwang } from './kongwang.js';
import { analyzePillarAges } from './pillar-age.js';
import { nayinInfo } from './nayin.js';
import { analyzeChangsheng } from './changsheng-deep.js';
import { computeLiuyue } from './liuyue.js';
import { analyzeLiuRi, findGoodDays } from './liuri.js';
import { computeYearDaily } from './year-daily.js';
import { inverseBaZiSolve, labelResult } from './inverse-bazi.js'; // [loop 21] 逆推 inverse solver
import { buildLifeTrajectory } from './life-trajectory.js';
import { healthMonthlyAlert } from './health-monthly.js';
import { lifeReading } from './life-reading.js';
import { scanFuyin, dayunFuyin, natalFuyin } from './fuyin.js';
import { marriageStars } from './marriage-stars.js';
import { taiSuiOverview } from './taisui-general.js';
import { sanyuanJiuyun } from './sanyuan-jiuyun.js';
import { analyzeDaySpecial, specialDays, nextTianShe } from './zheri-stars.js';
import { jiaoYunAnalysis } from './jiaoyun.js';
import { analyzePillarQuality } from './pillar-quality.js';
import { analyzeTaohua } from './taohua.js';
import { analyzeTongGen } from './tonggen.js';
import { analyzeHuaQi } from './huaqi.js';
import { analyzeKu } from './ku.js';
import { computeZiwei } from './ziwei.js';
import { ziweiCoreReading } from './ziwei-sanfang.js';
import { analyzeZiweiBrightness } from './ziwei-brightness.js';
import { analyzeShuangXing } from './ziwei-shuangxing.js';
import { analyzeZiweiGeju } from './ziwei-geju.js';
import { annualSihuaToNatal } from './ziwei-liunian-sihua.js';
import { computeAuxStars } from './ziwei-aux.js';
import { xiaoxianInChart } from './xiaoxian.js'; // [cycle 65] 小限 — wire orphan module vào brief
import { idealHouse } from './ideal-house.js';
import { annualDirection } from './annual-direction.js';
import { scanMarriageTiming } from './marriage-timing.js';
import { sanshaDirection } from './sansha.js';
import { annualTabooOverview } from './annual-taboo.js';
import { monthlySha } from './monthly-sha.js';
import { starPower } from './star-power.js';
import { scanWealthCareerYingqi } from './yingqi-wealth.js';
import { strength3Fa } from './strength-3fa.js';
import { decadeForecast } from './decade-forecast.js';
import { analyzeDeRi, deRiInYear, nextDeRi } from './deri.js';
import { analyzeXiongRi, xiongRiInYear } from './xiongri.js';
import { analyzeMonthShen, monthShenInYear, nextTianYi } from './zheri-extra.js';
import { huangdao12 } from './huangdao.js';
import { analyzeYanQin } from './yanqin.js';
import { qinxingOverview } from './qinxing.js';
import { dominantGod } from './dominant-god.js';
import { missingGod } from './missing-god.js';
import { viToHan } from './vi2han.js';
// Cycle 32 — 流日 + 流年引动六亲 (wired vào brief)
import { ziweiLiuri } from './ziwei-liuri.js';
import { liunianEvents } from './liunian-event.js';
// Cycle 33 — 择吉时合成 (wired vào brief)
import { bestHourToday } from './best-hour.js';
// 5 module bổ sung (wired vào brief + NLG)
import { chenggu } from './chenggu.js';
import { analyzeLiunian12 } from './liunian-12shen.js';
import { analyzeNobleStars } from './noble-stars.js';
import { sanshishu } from './sanshishu.js';
import { analyzeMangpaiView } from './mangpai-view.js';
import { waterActivation } from './water-activation.js';
import { physiognomyOverview } from './physiognomy.js';
import { yinzhaiOverview } from './yinzhai.js';
import { cezi } from './cezi.js';
import { castByTime, solarToMhNums } from './meihua.js';
import { liurenPan } from './liuren.js';
import { qimenDongPan } from './qimen.js';
import { qizheng, longitudeToMansion } from './qizheng.js';
// 天星择日 (cycle 38) — chọn ngày theo vị trí thật của 7 chính tinh tới 坐向
import { tianxingZheri } from './tianxing-zheri.js';
import { taiyi } from './taiyi.js';
import { POSITIONS as XLR_POSITIONS } from './xiaoliuren.js';
import { qiuqian } from './qiuqian.js';
import { daguaOverview } from './xuankong-dagua.js';
import { zodiacPairScore } from './zodiac-deep.js';
import { jinkoujue as jinkoujueCast } from './jinkoujue.js';
import { heluo } from './heluo.js';
import { yizhangjingFromChart as yizhangjingCast } from './yizhangjing.js';
import { Solar } from 'lunar-javascript';
// Cycle 35 — DAILY BRIEFING (composite 8 hệ → 1 thẻ tóm tắt HÔM NAY; section nổi bật ở đầu brief)
import { dailyBriefing } from './daily-briefing.js';
// Deep-domain analysis (财库/暗合/nạp âm/spouse/wealth/career/health/study/dayun-god/taiyuan/...)
import { extendBrief } from './brief-extender.js';
// Tier-2 forecasting (golden year / 5-year alert / dayun rank / wealth month / health decade)
import { findGoldenYear } from './golden-year.js';
import { forecast5 } from './forecast5.js';
import { rankDayun } from './dayun-rank.js';
import { wealthMonthlyAlert } from './wealth-alert.js';
import { healthAlertScan } from './health-alert.js';
import { computeHehun } from './hehun.js';
import { synthesize } from './synthesis.js';
import { matchBusinessPartners } from './partner-match.js';

// brief cache — tránh rebuild 16k brief mỗi chat message (212ms → 0ms sau lần đầu)
let _briefCache = null;

const hanviet = (gz) => gz.split('').map((c) => (GAN[c]?.vi || ZHI[c]?.vi || c)).join(' ');
const wxVi = (w) => WX_VI[w];

// ---- Cấu hình (lưu localStorage) ----
const CFG_KEY = 'bazi_ai_config_v1';

// Các preset nhà cung cấp (OpenAI-compatible). Z.ai GLM-5.2 là mặc định theo yêu cầu.
// LƯU Ý CORS: gọi THẲNG (https://api.z.ai...) từ trình duyệt sẽ bị CORS chặn → fallback.
// Khi `npm run dev`, dùng preset "proxy dev" (/zai/...) đi qua Vite proxy → chạy được.
export const PRESETS = [
  { id: 'zai-proxy', label: '★ Z.ai — PROXY (glm-5.2) [khuyên dùng — web + dev]', endpoint: '/zai/api/paas/v4', model: 'glm-5.2',
    note: 'Đi qua proxy cùng-origin → KHÔNG bị CORS. Chạy được cả npm run dev (Vite proxy) LẪN trên web production (Cloudflare Pages Function /zai). Nên dùng.' },
  { id: 'zai-general', label: 'Z.ai — API chung (glm-5.2) [CORS: chỉ chạy qua backend]', endpoint: 'https://api.z.ai/api/paas/v4', model: 'glm-5.2',
    note: 'Endpoint thẳng — trình duyệt sẽ CHẶN CORS. Chỉ dùng nếu app có backend/proxy, hoặc chạy qua server-side.' },
  { id: 'zai-coding', label: 'Z.ai — GLM Coding Plan (glm-5.2) [CORS]', endpoint: 'https://api.z.ai/api/coding/paas/v4', model: 'glm-5.2',
    note: 'Endpoint Coding Plan — CORS sẽ chặn khi gọi từ web. Ưu tiên preset PROXY DEV ở trên.' },
  { id: 'bigmodel', label: 'BigModel (智谱 glm-4.6)', endpoint: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4.6', note: 'CORS sẽ chặn từ web — cần backend/proxy.' },
  { id: 'deepseek', label: 'DeepSeek', endpoint: 'https://api.deepseek.com/v1', model: 'deepseek-chat', note: 'CORS sẽ chặn từ web — cần backend/proxy.' },
  { id: 'openai', label: 'OpenAI', endpoint: 'https://api.openai.com/v1', model: 'gpt-4o-mini', note: 'CORS sẽ chặn từ web — cần backend/proxy.' },
  { id: 'ollama', label: 'Ollama (cục bộ, không cần key)', endpoint: 'http://localhost:11434/v1', model: 'qwen2.5', note: 'Chạy Ollama local + đặt OLLAMA_ORIGINS=* để trình duyệt gọi được.' },
  { id: 'custom', label: 'Tùy chỉnh', endpoint: '', model: '', note: '' },
];

export function getConfig() {
  try {
    const raw = (typeof localStorage !== 'undefined') ? localStorage.getItem(CFG_KEY) : null;
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  // Mặc định: Z.ai GLM-5.2 (Coding Plan) — chỉ cần dán API key và bật.
  return { enabled: false, endpoint: PRESETS[0].endpoint, apiKey: '', model: PRESETS[0].model, preset: 'zai-coding' };
}
export function setConfig(cfg) {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch (e) {}
  return cfg;
}
export function isAIReady(cfg) {
  cfg = cfg || getConfig();
  return !!(cfg.enabled && cfg.endpoint && cfg.model);
}

// ===========================================================================
//  1. CHART BRIEF — tóm tắt dữ liệu ĐÃ TÍNH ĐÚNG để LLM luân giải
// ===========================================================================
export function buildChartBrief(R) {
  const c = R.chart;
  const dm = c.dayMaster;

  // ---- THỜI GIAN HIỆN TẠI: neo năm/tháng hôm nay để AI KHÔNG hallucinate (vd mặc định 2024) ----
  const _now = new Date();
  const nowSolar = Solar.fromYmdHms(_now.getFullYear(), _now.getMonth() + 1, _now.getDate(), 12, 0, 0);
  const nowLunar = nowSolar.getLunar();
  const nowEC = nowLunar.getEightChar();
  const curYear = _now.getFullYear();
  const curYearGZ = nowEC.getYearGan() + nowEC.getYearZhi();
  const curMonthGZ = nowEC.getMonthGan() + nowEC.getMonthZhi();
  let curMonthRating = '(không tính được)';
  let curMonthNote = '';
  try {
    // [cycle 53] chỉ số TIẾT KHÍ của tháng hiện tại (getMonthZhi→idx) — KHÔNG phải lunar/dương month number.
    //   Trước đây dùng lunar getMonth (brief) vs solar getMonth (analyze_month tool) → 2 kết quả khác nhau
    //   cho cùng "tháng này" (甲午 vs 乙未) → rule-12 verify-trap. Nay cả 2 dùng getMonthZhi→节气 idx.
    const ZHI_LYIDX = { 寅:0,卯:1,辰:2,巳:3,午:4,未:5,申:6,酉:7,戌:8,亥:9,子:10,丑:11 };
    let curJieqiIdx = -1;
    try { curJieqiIdx = ZHI_LYIDX[Solar.fromYmdHms(_now.getFullYear(), _now.getMonth() + 1, _now.getDate(), 12, 0, 0).getLunar().getMonthZhi()]; } catch (_) {}
    const lm = computeLiuyue(R, curYear, R.patternQuality);
    const cm = curJieqiIdx >= 0 ? lm.months[curJieqiIdx] : null;
    if (cm) {
      // [loop 4] Thêm tag 格局 喜忌 của tháng hiện tại vào ghi chú (giúp AI nắm tháng thuận/nghịch cách).
      const gejuTag = cm.gejuDelta > 0 ? ' ★格局喜' : cm.gejuDelta < 0 ? ' ⚠格局忌' : '';
      curMonthRating = `${cm.ganZhi} — ${cm.rating}${gejuTag}`;
      curMonthNote = ` (tháng CÁT trong năm: ${lm.best.map((b) => 'T' + (b.m + 1)).join(', ')}; tháng KỴ: ${lm.worst.map((b) => 'T' + (b.m + 1)).join(', ')})`;
    }
  } catch (e) {}
  const pillars = ['year', 'month', 'day', 'time'].map((k) => {
    const p = c.pillars[k];
    const labelVi = { year: 'Năm', month: 'Tháng', day: 'Ngày', time: 'Giờ' }[k];
    return `  - Trụ ${labelVi}: ${p.gan}${p.zhi} (${hanviet(p.gan + p.zhi)}) | Can·${TEN_GOD_VI[p.ganGod] || p.ganGod} | Tàng: ${p.hidden.map((h) => `${h.gan}(${TEN_GOD_VI[h.god]})`).join(' ')} | Nạp âm ${p.nayin}`;
  }).join('\n');

  const wx = Object.entries(R.wx.pct)
    .sort((a, b) => b[1] - a[1])
    .map(([w, p]) => `${wxVi(w)}(${w}):${p}%`).join(', ');

  const shenshaList = R.shensha ? Object.entries(R.shensha)
    .map(([k, v]) => `${k}(${v.at.join('/')})`).join(', ') || 'không nổi' : 'không';

  const dayunStr = (R.dayun || []).slice(0, 8)
    .map((d) => {
      const tags = [];
      if (d.gejuDelta > 0) tags.push('★格局喜');
      if (d.gejuDelta < 0) tags.push('⚠格局忌');
      if (d.gejuRescue) tags.push('★RESCUES');
      if (d.gejuWorsen) tags.push('⚠WORSENS');
      const tagStr = tags.length ? '|' + tags.join('|') : '';
      return `${hanviet(d.ganZhi)}[${d.startAge}-${d.startAge + 9}t:${d.rating}${tagStr}]`;
    }).join(' ');
  // Tóm tắt 大运 格局喜忌 (子平真詮 ch.10-11): vận nào 格局-thuận / 格局-nghịch nhất.
  const gejuDayunBrief = (() => {
    if (!R.patternQuality || !Array.isArray(R.dayun) || !R.dayun.length) return '';
    const fav = R.dayun.filter((d) => d.gejuDelta > 0);
    const host = R.dayun.filter((d) => d.gejuDelta < 0);
    const rescuers = R.dayun.filter((d) => d.gejuRescue);
    const worseners = R.dayun.filter((d) => d.gejuWorsen);
    const parts = [];
    if (fav.length) parts.push(`Cách-thuận (${fav.map((d) => `${hanviet(d.ganZhi)}/${d.ganGod}`).join(', ')})`);
    if (host.length) parts.push(`Cách-nghịch (${host.map((d) => `${hanviet(d.ganZhi)}/${d.ganGod}`).join(', ')})`);
    if (rescuers.length) parts.push(`★CỨU CÁCH (${rescuers.map((d) => `${hanviet(d.ganZhi)}/${d.ganGod}`).join(', ')})`);
    if (worseners.length) parts.push(`⚠加重格病 (${worseners.map((d) => `${hanviet(d.ganZhi)}/${d.ganGod}`).join(', ')})`);
    return parts.length ? ` → phân loại vận theo 格局: ${parts.join('; ')}.` : '';
  })();
  const liunianStr = (R.liunian || []).map((l) => {
    const gtag = l.gejuDelta > 0 ? '★格局喜' : l.gejuDelta < 0 ? '⚠格局忌' : '';
    return `${l.year}(${hanviet(l.ganZhi)}:${l.rating}${l.isNow ? '★nay' : ''}${gtag ? '|' + gtag : ''})`;
  }).join(' ');

  let brief = `== ⏰ THỜI GIAN HIỆN TẠI (CHUẨN MỌI PHÂN TÍCH — ĐỌC KỄ, RẤT QUAN TRỌNG) ==
- Hôm nay (dương lịch): ${nowSolar.toYmd()}
- Âm lịch: ${nowLunar.toString()}
- NĂM NAY = ${curYear} = ${curYearGZ} (${hanviet(curYearGZ)}). ĐÂY LÀ NĂM ĐANG DIỄN RA, KHÔNG PHẢI TƯƠNG LAI. Từ "năm nay" / "năm này" LUÔN là ${curYear} — KHÔNG được mặc định 2024 hay bất kỳ năm nào khác.
- THÁNG NAY (lưu nguyệt) = ${curMonthGZ} (${hanviet(curMonthGZ)}) — rating ${curMonthRating}${curMonthNote}
- Khi user hỏi "tháng này / năm nay" → PHẢI dùng ${curYear} và lưu nguyệt ${curMonthGZ} ở trên.
- TRỊ NIÊN THÁI TUẾ ${curYear}: ${(() => { try { const o = taiSuiOverview(R, curYear); return `${o.current.ganZhi} = ${o.current.name} (vị ${o.current.index}/60). ${o.current.note} Bản mệnh TS (năm sinh) = ${o.natal.name}.`; } catch (e) { return '(không tính được)'; } })()}

== 📅 HÔM NAY TỔNG KHÁI (DAILY BRIEFING — QUAN TRỌNG NHẤT, ĐỌC TRƯỚC) ==
${(() => { try { const b = dailyBriefing(R, _now.getFullYear(), _now.getMonth() + 1, _now.getDate(), R.patternQuality); return `ONE_LINER: ${b.oneLiner}\n${b.summary}`; } catch (e) { return '(không tính được)'; } })()}
⏩ Khi user hỏi "hôm nay thế nào / hôm nay làm gì / tổng quan hôm nay" → Ưu tiên trả lời từ block "HÔM NAY TỔNG KHÁI" này TRƯỚC, sau đó mới đi sâu vào chi tiết bên dưới nếu được hỏi thêm.

== LÁ SỐ BÁT TỰ (đã tính chính xác, dùng để luân giải) ==
- Nhật Chủ (日主): ${dm.gan} ${dm.vi} — hành ${wxVi(dm.wx)} ${dm.yin ? '(âm)' : '(dương)'}
- BẢN MỆNH HÀM 演禽 (28 túc con-vật-tinh, như con giáp 28-fold): ${(() => { try { return analyzeYanQin(R).summary; } catch (e) { return '(không tính được)'; } })()}
- 禽星 NĂN ${curYear} (annual bird rotation — con vật tinh trụ trị năm nay, feng shui timing): ${(() => { try { return qinxingOverview(R, curYear).summary; } catch (e) { return '(không tính được)'; } })()}
- 滴天髓 luận ${dm.gan}: ${DITIANSUI[dm.gan].verse} → ${DITIANSUI[dm.gan].nature}
- Giới tính: ${c.input.gender} | Dương lịch: ${c.solar}
- Tiết khí gần nhất: ${c.jieqi.prev.name}

TỨ TRỤ:
${pillars}

VƯỢNG SUY: ${R.strength.level} (tỉ lệ phù trợ thân ${(R.strength.ratio * 100).toFixed(1)}%${R.strength.sanFaBonus > 0 ? ` → hiệu dụng ${(R.strength.effRatio * 100).toFixed(1)}% do 得令/得地 (cổ法 «得令者旺» cộng +${R.strength.sanFaBonus})` : ''}, ${R.strength.deLenh ? 'đắc lệnh' : 'thất lệnh'}${R.strength.qiPhase ? ` (${R.strength.qiPhase})` : ''}${R.strength.deDia ? ' + đắc địa (thông căn)' : ''})
WHY VƯỢNG SUY 得令/得地/得势 3 pháp (mạnh nhờ lệnh/địa/thế hay nhờ Ấn?): ${(() => { try { return strength3Fa(R).summary; } catch (e) { return '(không tính được)'; } })()}

NGŨ HÀNH: ${wx}

CÁCH CỤC (格局): ${R.pattern.vi} — ${R.pattern.name}
HÓA KHÍ (化气格 — can hợp có hóa không; nếu thành → Dụng đổi hẳn): ${(() => { try { const h = analyzeHuaQi(R); return h.huaQiGe ? `⚠ ${h.summary}` : h.summary; } catch (e) { return '(không tính được)'; } })()}
  ${R.pattern.note}
  ${R.pattern.geShen ? `格 thần: ${R.pattern.geShen.gan || '(can tòng/vương)'} (${TEN_GOD_VI[R.pattern.geShen.god] || R.pattern.geShen.god || '—'})${R.pattern.geShen.wx ? ' [' + R.pattern.geShen.wx + ']' : ''}` : ''}

格局成败救应 (子平真诠 chương 9 — cách cục có THÀNH hay VỠ, có CỨU không):
${R.patternQuality ? `  ${R.patternQuality.summary}
  - Trạng thái: ${R.patternQuality.quality} (成格=cách nguyên vẹn / 有救=cách bại nhưng có cứu ứng bù / 败格=cách vỡ chưa cứu được / 特殊=cách đặc biệt)
  - Sao chủ cách ${R.patternQuality.keyStar ? `${R.patternQuality.keyStar.gan}(${R.patternQuality.keyStar.god})` : '(cách luyue/đặc biệt)'}: thấu cán=${R.patternQuality.transparent}, thông căn=${R.patternQuality.rooted}${R.patternQuality.keyStar && R.patternQuality.keyStar.inKong ? ', RƠI KHÔNG VONG' : ''}
  - Bệnh (败因): ${R.patternQuality.diseases.length ? R.patternQuality.diseases.map((d) => d.note).join(' | ') : '(không có bệnh)'}
  - Cứu ứng (救应): ${R.patternQuality.rescues.length ? R.patternQuality.rescues.map((r) => r.note).join(' | ') : '(không cần / không có)'}` : '  (chưa tính được)'}

DỤNG – HỶ – KỴ – THÙ (用喜忌仇):
  - Dụng (dùng): ${[R.yong.primary, R.yong.xi].filter(Boolean).map((w) => wxVi(w) + '(' + w + ')').join(', ')}
  - Hỷ (喜 — sinh trợ Dụng): ${wxVi(R.yong.xi)}(${R.yong.xi})
  - Kỵ (忌 — khắc Dụng): ${wxVi(R.yong.ji)}(${R.yong.ji})
  - Thù (仇 — sinh Kỵ, hại gián tiếp): ${wxVi(R.yong.chou)}(${R.yong.chou})
  - Phép lấy Dụng Thần: ${R.yong.method.join(' + ')}
  - Lập luận: ${R.yong.reasons.join(' ')}
  - Điều Hậu (调候): ${R.yong.tiaohou.note || '(không)'}
  - SỨC MẠNH DỤNG (通根透干 + 旺相休囚死): ${(() => { try { const t = analyzeTongGen(R); return `${t.dung.verdict} (${t.dung.seasonVi}) — căn ${t.dung.root.total}, lộ ${t.dung.reveal.length}. ${t.dung.verdict === '藏而不透' ? 'Đợi lưu niên can ' + t.whenReveal.join('/') + ' thấu mới phát.' : t.dung.verdict === '虚浮' || t.dung.verdict === '虚' ? 'Dụng YẾU — cần bù mạnh.' : 'Dụng thật, có lực.'}`; } catch (e) { return '(không tính được)'; } })()}

TỔNG LUẬN MỆNH: ${R.synthesis.gradeVi} · ${R.synthesis.fortuneVi} (điểm ${R.synthesis.score}/100)
  Nhân tố: ${R.synthesis.factors.join(' | ')}
  Tổ hợp Thập thần: ${(R.synthesis.combos || []).map((c) => c.vi + '[' + (c.tone === 'cat' ? 'cát' : 'hung') + ']').join(', ') || '(không nổi)'}
THẬP THẦN CHỦ ĐẠO 主导十神 (tuýp người + nghề hợp + có thuận Dụng không): ${(() => { try { return dominantGod(R).summary; } catch (e) { return '(không tính được)'; } })()}
THẬP THẦN KHUYẾT/THIẾU 缺十神 (lĩnh vực đời nào yếu): ${(() => { try { return missingGod(R).summary; } catch (e) { return '(không tính được)'; } })()}
SAO TRỌNG ĐIỂM 财官印 通根透干 (sao Tài/Quan/Ấn có THẬT lực không hay hư phù): ${(() => { try { return starPower(R).summary; } catch (e) { return '(không tính được)'; } })()}
TÀI/QUAN THẤU CÁN ỨNG KỲ (năm nào sao TÀI/QUAN ẩn được kích hoạt — đế can cùng hành thấu): ${(() => { try { return scanWealthCareerYingqi(R, curYear, 12).summary; } catch (e) { return '(không tính được)'; } })()}

HỘI – HỢP – XUNG – HÌNH – HẠI: ${R.interactions.summary}

CHẤT LƯỢNG TRỤ 盖头截脚 (can-chi có khắc-nhau trong trụ không — đọc "sao hay vấp"):
${(() => { try { return analyzePillarQuality(R).summary; } catch (e) { return '(không tính được)'; } })()}

THẦN SÁT: ${shenshaList}

LỤC THÂN (cung vị + tinh): ${(R.liuqin || []).map((l) => `${l.relVi}(${l.mainStar || '-'}, cung ${l.palaceGod}${l.stable ? '' : ', xung'})`).join('; ') || '(không)'}

SAO HÔN NHÂN CỔ (theo trụ — 孤鸾/阴阳差错/八专/九丑; dùng trả lời "cớ sao duyên trắc/kết hôn sao 选"):
${(() => { try { return marriageStars(R).summary; } catch (e) { return '(không tính được)'; } })()}

ĐÀO HOA 桃花 (正/烂桃花 — dùng trả lời "tình duyên tôi lành/hão, sao hay lỡ duyên"):
${(() => { try { return analyzeTaohua(R).summary; } catch (e) { return '(không tính được)'; } })()}
HÔN/LUYÊN ỨNG KỲ (năm nào gặp duyên/kết hôn — 红鸾天喜/配偶星/桃花 đến theo LƯU NIÊN):
${(() => { try { return scanMarriageTiming(R, curYear, 12).summary; } catch (e) { return '(không tính được)'; } })()}

TAM NGUYÊN CỬU VẬN 三元九运 (vĩ mô phong thuỷ 20 năm — dùng trả lời "20 năm tới vận gì/ngành nào mệnh"):
${(() => { try { return sanyuanJiuyun(R, curYear).summary; } catch (e) { return '(không tính được)'; } })()}

天赦日 / 四废 / 十恶大败 (黄历择日 — dùng khi khuyên NGÀY TỐT/XẤU cụ thể):
${(() => { try { const sd = specialDays(curYear); const today = analyzeDaySpecial(_now.getFullYear(), _now.getMonth() + 1, _now.getDate()); const nx = nextTianShe(_now.getFullYear(), _now.getMonth() + 1, _now.getDate(), 3); const todayTag = today.special.length ? `HÔM NAY (${today.ganZhi}): ${today.special.map(s=>s.typeVi).join('+')}. ` : ''; return `${todayTag}${sd.summary} 3 天赦 tiếp theo: ${nx.map(t=>`${t.solar}(${t.ganZhi})`).join(', ')} — khuyên làm việc lớn (khai trương/cưới/dọn nhà/ký kết/cầu phúc) vào 天赦日; tránh 四废 (đại hung) + 十恶大败 (kỴ cầu tài).`; } catch (e) { return '(không tính được)'; } })()}

四ĐỨC NHẬT 岁德/月德 (4 sao Đức, «vạn ác tiêu trừ», bổ 天赦): ${(() => { try { const dy = deRiInYear(curYear); const nx = nextDeRi(_now.getFullYear(), _now.getMonth() + 1, _now.getDate(), 3); return `${dy.summary} 3 ngày đức tới: ${nx.map((d) => `${d.solar}(${d.de})`).join(', ')} — ưu tiên ≥2 đức để làm việc lớn.`; } catch (e) { return '(không tính được)'; } })()}
HUNG NHẬT 黄历凶日 月破/月厌/往亡 (KỴ làm việc lớn): ${(() => { try { const xr = xiongRiInYear(curYear); const today = analyzeXiongRi(_now.getFullYear(), _now.getMonth() + 1, _now.getDate()); const todayTag = today.isXiong ? `⚠ HÔM NAY (${today.ganZhi}) = ${today.hits.map((h) => h.typeVi).join('+')} → KỴ làm việc lớn! ` : ''; return `${todayTag}${xr.summary}`; } catch (e) { return '(không tính được)'; } })()}
黄道 HÔM NAY (12 thần hoàng/hắc đạo — 青龙/明堂/...): ${(() => { try { const r = huangdao12(_now.getFullYear(), _now.getMonth() + 1, _now.getDate()); return `${r.deity} (${r.deityVi}) — ${r.road === 'yellow' ? '黄道' : '黑道'} — ${r.meaning}`; } catch (e) { return '(không tính được)'; } })()}
GIỜ TỐT NHẤT HÔM NAY 择吉时合成 (composite 5 chiều: 黄道/黑道 giờ + Dụng ngũ hành + 紫微流时 + 流时神煞 quý nhân + 建除直 ngày — dùng trả lời "hôm nay giờ nào tốt nhất cho [việc]"):
${(() => { try { const bh = bestHourToday(R, _now.getFullYear(), _now.getMonth() + 1, _now.getDate(), R.patternQuality?.patternYong); const best = bh.best.map((h) => `${h.vi}(${h.range}, ${h.rating}, ${h.score}/100)`).join(' · '); const worst = bh.worst.filter((w) => w.score < 45).map((w) => `${w.vi}(${w.range})`).join(' · '); return `Hôm nay ${bh.dayGanZhi} trực ${bh.dayOfficer.officerVi}: BEST_HOURS = ${best}${worst ? ` | TRÁNH: WORST_HOURS = ${worst}` : ''}. ${bh.summary}`; } catch (e) { return '(không tính được)'; } })()}
紫微流日 HÔM NAY (紫微流日 — mệnh cung lưu nhật + sao + tứ hóa ngày, dùng trả lời "hôm nay CHỦ ĐỀ gì nổi / tỷ lệ gì bật"):
${(() => { try { const zlr = ziweiLiuri({ input: c.input }, _now.getFullYear(), _now.getMonth() + 1, _now.getDate()); const g = zlr.liuriGong; const sh = zlr.liuriSihua.filter((s) => s.palace); return `Hôm nay ${zlr.dayGanZhi} (âm ${zlr.lunarDay}/${zlr.lunarMonth}): 流日命宫 tại ${g.zhi} — ${g.vi} (chủ đề: ${g.meaning}) [${g.tone === 'cat' ? 'Cát' : g.tone === 'hung' ? 'Hung' : 'Bình'}]. Sao tại cung: ${g.stars.length ? g.stars.join(', ') : '(cung trống)'}. Day 四化 ${zlr.dayGan}: ${sh.length ? sh.map((s) => `${s.hua}${s.star}@${s.palace}(${s.palaceVi}: ${s.theme})`).join(' · ') : '(không hóa đặt được cung)'}.`; } catch (e) { return '(không tính được)'; } })()}
流年引动六亲 NĂM NAY (流年引动 — sao năm dẫn động AI/vùng nào bị ảnh hưởng, dùng trả lời "năm nay chuyện gì XẢY RA vs AI"):
${(() => { try { const le = liunianEvents(R, curYear); const top = le.events.slice(0, 4); return `Năm ${le.year} ${le.ganZhi}: sao năm ${le.yearGodVi} (${le.bodyStrong ? 'thân vượng' : 'thân nhược'})${le.shaZhiHua ? ' + Sát có chế' : ' + Sát VÔ chế'}. Trụ bị dẫn động: ${Object.keys(le.pillarHits).length ? Object.entries(le.pillarHits).map(([k, v]) => `${k}(${v.join('/')})`).join(', ') : '(không xung/hình/hại/hợp trực tiếp)'}. Sự việc nổi: ${top.length ? top.map((e) => `${e.vi}→${e.who}${e.tone === 'hung' ? '[Kỵ]' : e.tone === 'cat' ? '[Cát]' : ''}`).join(' · ') : '(êm)'} — ${le.summary}`; } catch (e) { return '(không tính được)'; } })()}
THIÊN Y/NGUYỆT ÂN 黄历 (天医=cát sức khoẻ / 月恩=cát việc chung): ${(() => { try { const ms = monthShenInYear(curYear); const today = analyzeMonthShen(_now.getFullYear(), _now.getMonth() + 1, _now.getDate()); const tTag = today.isAuspicious ? `✓ HÔM NAY (${today.ganZhi}) = ${today.hits.map((h) => h.keyVi).join('+')} — cát. ` : ''; const ty = nextTianYi(_now.getFullYear(), _now.getMonth() + 1, _now.getDate(), 2); return `${tTag}${ms.summary} Thiên Y tới: ${ty.map((d) => d.solar).join(', ')} (khởi đầu trị bệnh/liệu trình sức khoẻ).`; } catch (e) { return '(không tính được)'; } })()}

NGHỊCH THIÊN CẢI MỆNH (cải vận):
  - Bổ Dụng ${wxVi(R.yong.primary)}/Hỷ ${wxVi(R.yong.xi)}: phương/hướng, màu, nghề, số, thực phẩm, phong thuỷ (theo bảng ngũ hành).
  - LÝ TƯỞNG NHÀ (层楼坐向): ${(() => { try { return idealHouse(R, 20).summary; } catch (e) { return '(không tính được)'; } })()}
  - HƯỚNG CÁT × LƯU NIÊN PHI TINH (4 cát方 của bản mệnh năm ${curYear} còn tốt không): ${(() => { try { return annualDirection(R, curYear).summary; } catch (e) { return '(không tính được)'; } })()}
  - TAM SÁT ${curYear} (phương tối kỵ động thổ/dời nhà năm nay): ${(() => { try { return sanshaDirection(curYear).summary; } catch (e) { return '(không tính được)'; } })()}
  - SAT PHƯƠNG ${curYear} TỔNG HỢP (kiểm 1 hướng vs TháiTuế/TuếPhá/TamSát/5黄/2黑 — "có cải tạo hướng X được không"): ${(() => { try { return annualTabooOverview(curYear).summary; } catch (e) { return '(không tính được)'; } })()}
  - NGUYỆT SÁT (月三煞/月建/月破 THÁNG NÀY — "tháng này cải tạo hướng X được không"): ${(() => { try { return monthlySha(_now.getFullYear(), _now.getMonth() + 1, _now.getDate()).summary; } catch (e) { return '(không tính được)'; } })()}
  - THỦY PHÁP 水法 (kích hoạt tài/tình — đặt nước hướng nào): ${(() => { try { const wa = waterActivation(curYear); const pw = wa.primaryWealth; const rm = wa.romanceWater; const av = (wa.avoidWater || []).map((x) => x.dir).join('/') || '—'; return `primary wealth → ${pw && pw.dir ? pw.dir + ' (' + (pw.starName || pw.star) + ')' : '—'}, romance → ${rm && rm.dir ? rm.dir + ' (' + (rm.starName || rm.star) + ')' : '—'}, AVOID → ${av} [运${wa.yun} 零神=${wa.yunInfo.ling}]. ${wa.summary}`; } catch (e) { return '(không tính được)'; } })()}
  - 12 pháp cải vận + 了凡四训 (tích âm đức là pháp cốt lõi nghịch thiên) đã có sẵn trong dữ liệu.
  - Thời điểm vàng (chỉ lưu niên CÁT/ĐẠI CÁT): ${(R.remedy?.timing || []).filter((t) => t.rating === 'Cát' || t.rating === 'Đại cát').map((t) => `${t.year}(${t.gz})`).join(', ') || '(chưa có năm Cát trong khung 10 năm)'}

ĐẠI VẬN: ${dayunStr}${gejuDayunBrief ? '\n★ 格局喜忌 (子平真詮 ch.10-11): Vận không chỉ xem ngũ hành sinh khắc Nhật Chủ, mà còn xem THẬP THẦN vận có sinh trợ Dụng/相 (★格局喜) hay khắc phá 格 (⚠格局忌).' + gejuDayunBrief : ''}

GIAO THỜI ĐẠI VẬN 交运 (khi vận 10 năm đổi — dùng trả lời "vận tôi bao giờ đổi"):
${(() => { try { const j = jiaoYunAnalysis(R, _now); return j.summary; } catch (e) { return '(không tính được)'; } })()}

--- 4 TẦNG BỔ SUNG ---
KHÔNG VONG: ${(() => { try { const kw = analyzeKongwang(R.chart); return kw.affected.length ? kw.kong.join(",") + " — trụ " + kw.affected.map(a=>a.pos+"("+a.zhi+")").join(",") + " bị treo." : "không."; } catch(e) { return "(lỗi)"; } })()}
VẬN ĐỜI: ${(() => { try { const pa = analyzePillarAges(R); return pa.map(p => p.range.split(" ")[0] + "=" + p.score).join(", "); } catch(e) { return "(lỗi)"; } })()}
NẠP ÂM (日柱): ${(() => { try { const n = nayinInfo(R.chart.pillars.day.nayin); return R.chart.pillars.day.nayin + " (" + (n?.vi||"") + ") — " + (n?.meaning||"").slice(0,80); } catch(e) { return "(lỗi)"; } })()}
THẬP NHỊ TRƯỜNG SINH: ${(() => { try { const cs = analyzeChangsheng(R.chart); return cs.stages.map(s => s.label.split(" ")[1] + "=" + s.stageVi + "(" + s.luck + ")").join(", ") + ". " + cs.monthNote; } catch(e) { return "(lỗi)"; } })()}
LƯU NIÊN (đại vận đang hành): ${liunianStr}

KHỞ MỞ/KHỎA TÀI NGUYÊN 开库闭库 (Dụng/Hỷ/Tài có bị nhốt trong khổ đóng không; khi nào mở): ${(() => { try { return analyzeKu(R, curYear).summary; } catch (e) { return '(không tính được)'; } })()}

TỬ VI MỆNH CỐT TỦY 紫微命宫三方四正 (đọc cả cuộc đời qua Mệnh+Tài+Quan+Duyên): ${(() => { try { const zr = computeZiwei(c.input.year, c.input.month, c.input.day, c.input.hour, c.input.minute, c.input.gender); return ziweiCoreReading(zr).summary; } catch (e) { return '(không tính được)'; } })()}
TỬ VI ĐỘ SÁNG 紫微庙旺 (sao mạnh hay yếu tại cung; 庙旺 mạnh / 陷 hãm đảo nghĩa): ${(() => { try { const zr = computeZiwei(c.input.year, c.input.month, c.input.day, c.input.hour, c.input.minute, c.input.gender); return analyzeZiweiBrightness(zr).summary; } catch (e) { return '(không tính được)'; } })()}
TỬ VI SONG TINH 紫微双星 (2 chính tinh đồng cung → ý nghĩa hòa trộn; đặc biệt 紫微 5 song tinh): ${(() => { try { const zr = computeZiwei(c.input.year, c.input.month, c.input.day, c.input.hour, c.input.minute, c.input.gender); return analyzeShuangXing(zr).summary; } catch (e) { return '(không tính được)'; } })()}
TỬ VI CỤC HÌNH 紫微格局 (tuýp mệnh: 杀破狼/机月同梁/府相朝垣/紫府同宫/日月并明/火贪/君臣庆会/石中隐玉): ${(() => { try { const zr = computeZiwei(c.input.year, c.input.month, c.input.day, c.input.hour, c.input.minute, c.input.gender); const bw = analyzeZiweiBrightness(zr); const aux = computeAuxStars(c.pillars.year.gan, c.pillars.year.zhi, zr.birth.lunarMonth, zr.birth.timeZhi); return analyzeZiweiGeju(zr, bw, aux).summary; } catch (e) { return '(không tính được)'; } })()}
紫微 SINH NIÊN TỨ HÓA 生年四化 (4 hóa CỐT ĐỊNH bẩm sinh theo can năm sinh — NỀN TẢNG: sao nào tự nhiên mang禄/权/科/忌, kích hoạt cung nào = lĩnh vực gốc): ${(() => { try { const zr = computeZiwei(c.input.year, c.input.month, c.input.day, c.input.hour, c.input.minute, c.input.gender); const s = zr.sihua; return s ? `化禄@${s.禄.star}@cung${s.禄.palace} (dậu tài/duyên), 化权@${s.权.star}@${s.权.palace} (quyền/chủ động), 化科@${s.科.star}@${s.科.palace} (danh/quý nhân), 化忌@${s.忌.star}@${s.忌.palace} (TRỞ NGẠI trọng tâm — cung này là kho triệt tiêu).` : '(không tính được)'; } catch (e) { return '(không tính được)'; } })()}
紫微 宫干自化 宮干自化 (lõi phi tinh: can mỗi cung → 4 hóa bay ra, hóa nào rơi trúng cung phát → cung đó TỰ biến đổi chính mình; tự化忌 = tự phá hoại, tự化禄 = dễ được nhưng không bền): ${(() => { try { const zr = computeZiwei(c.input.year, c.input.month, c.input.day, c.input.hour, c.input.minute, c.input.gender); return zr.zihua?.summary || '(không tính được)'; } catch (e) { return '(không tính được)'; } })()}
紫微 飞星化入化出 飛星 (mệnh cung GỬI/ĐỌN cái gì tới cung khác & các cung ĐỔ về mệnh: 命化X入Y = mệnh định hướng Y; X宫化Y入命 = X nuôi/hại mệnh): ${(() => { try { const zr = computeZiwei(c.input.year, c.input.month, c.input.day, c.input.hour, c.input.minute, c.input.gender); return zr.feixing?.mingHighlights || '(không tính được)'; } catch (e) { return '(không tính được)'; } })()}
TIỂU HẠN 小限 ${curYear} (cung xoay theo tuổi — nam thuận/nữ nghịch — chủ đề CHỦ ĐẠO năm): ${(() => { try { const zr = computeZiwei(c.input.year, c.input.month, c.input.day, c.input.hour, c.input.minute, c.input.gender); const xx = xiaoxianInChart(zr, curYear, c.input.year, c.input.gender); return `Tiểu Hạn @ ${xx.branchVi} (${xx.palaceVi}/${xx.palace}, ${xx.direction}) — chủ đề năm: ${xx.palaceTheme}. Sao tại cung: ${xx.stars.join(',')||'(trống)'}.`; } catch (e) { return '(không tính được)'; } })()}
LƯU NIÊN TỨ HÓA 流年四化 (năm nay 4 hóa禄权科忌 bay vào cung bẩm sinh nào = lĩnh vực được kích hoạt): ${(() => { try { const a = annualSihuaToNatal(R, curYear); return a.summary; } catch (e) { return '(không tính được)'; } })()}

七政四余 果老星宗 (Chinese Astrology — real planetary positions):
${(() => { try { const q = qizheng(c.input.year, c.input.month, c.input.day, c.input.hour, c.input.minute);
  const lumTxt = q.luminaries.map(l => `${l.name}@${longitudeToMansion(l.longitude).zhi}`).join(' ');
  const shaTxt = q.siyu.map(s => `${s.name}@${longitudeToMansion(s.longitude).zhi}`).join(' ');
  return `Mệnh cung #${q.palaceOfMing + 1} | ${lumTxt} | ${shaTxt}`;
} catch (e) { return '(không tính được)'; } })()}

--- 天星择日 (STAR DATE SELECTION — chọn ngày theo sao tới hướng) ---
${(() => { try {
  // Mẫu: toạ 子 (Bắc — phổ biến nhà ở VN) quét 60 ngày tới. KHÔNG cố định theo lá số —
  // chỉ chạy khi user chủ động hỏi "ngày nào tốt theo sao cho hướng X" (rule-13 bullet cuối).
  const now = new Date();
  const tx = tianxingZheri('子', now.getFullYear(), now.getMonth() + 1, now.getDate(), 60, {});
  const top = tx.best[0];
  const worst = tx.worst[0];
  const ecl = tx.best.concat(tx.worst).filter(d => d.eclipse).length;
  return `[mẫu toạ 子 (Bắc), 60 ngày tới] Sơn ${tx.mountainElementLabel}. TỐT NHẤT ${top.date.solar} (${top.date.ganZhi}, điểm ${top.score}): ${top.hits.slice(0,3).map(h => h.zh).join('+')}. KỴ NHẤT ${worst.date.solar} (điểm ${worst.score})${worst.eclipse ? ' ⚠cửa thực' : ''}.${ecl ? ` ${ecl} ngày phạm cửa nhật/nguyệt thực (罗计掩日月, cấm).` : ''} ⚠ Đây là MẪU — nếu user hỏi hướng cụ thể, dùng tool/section này với toạ sơn tương ứng (24 sơn).`;
} catch (e) { return '(không tính được)'; } })()}

LUẬN VẬN NĂM HIỆN TẠI (đa trường phái — QUAN TRỌNG, dùng để trả lời câu "năm nay sao"):
${(() => { try { const y = curYear; const d = analyzeLiunianDeep(R, y, R.patternQuality?.patternYong); const gejuLine = d.gejuFavor ? ` Năm ${d.gejuFavor === '喜' ? '★THUẬN CÁCH (格局喜 — can năm sinh trợ cách cục, giúp mệnh chủ phát huy thế mạnh)' : '⚠GHÉT CÁCH (格局忌 — can năm khắc phá/cản cách cục, năm cản trở)'} theo ${R.pattern.vi}.` : ''; return `Năm ${d.year} ${d.ganZhi}: ${d.rating} (${d.score}/100).${gejuLine} Chi tiết: ${d.schools.map((s) => `[${s.phai} ${s.d>=0?'+':''}${s.d}] ${s.note}`).join('  ')}`; } catch (e) { return '(không tính được)'; } })()}

10 NĂM TỚI 一览 (bảng tổng hợp: vận + 💰Tài + 🎯Quan + 💞Duyên theo năm): ${(() => { try { return decadeForecast(R, curYear, 10).summary; } catch (e) { return '(không tính được)'; } })()}

SỨC KHOẺ LƯU NGUYỆT ${curYear} (治未病 — dùng trả lời "tháng nào yếu/phòng bệnh gì"):
${(() => { try { const h = healthMonthlyAlert(R, curYear); return `${h.summary} Tháng yếu nhất: ${h.worstMonth.mVi} (${h.worstMonth.ganZhi}, ${h.worstMonth.godVi}, điểm ${h.worstMonth.score}) — phòng ${h.weakestOrgan.organs}, nguy cơ: ${h.weakestOrgan.risk}. Tháng khoẻ nhất: ${h.bestMonth.mVi} (điểm ${h.bestMonth.score}).`; } catch (e) { return '(không tính được)'; } })()}

PHỤC/PHẢN NGÂM 伏吟反吟 (dùng trả lời "năm nào biến cố/sóng gió" — QUAN TRỌNG, phân biệt với vận thường):
${(() => { try { const n = natalFuyin(R); const y = scanFuyin(R, curYear); const d = dayunFuyin(R); const parts = []; if (n.items.length) parts.push('bẩm sinh: ' + n.items.map(i=>`${i.typeVi} ${i.pair}`).join(', ')); parts.push(`năm ${curYear}: ` + (y.items.length ? y.items.map(i=>`${i.typeVi} ${i.pillarVi}(cảnh báo ${i.severity>=7?'NẶNG':'trung'})`).join('; ') : 'không phạm')); if (d.items?.length) parts.push(`đại vận ${d.dayun}: ` + d.items.map(i=>`${i.typeVi} ${i.pillarVi}`).join(', ')); return parts.join(' | ') + '. Cổ quyết «反吟伏吟泪淋淋, 不伤自己损他人»: phạm = năm dễ buồn/hiểm/li tán, đặc biệt Nhật Trụ = bản thân+phối ngẫu; nếu hành trùng = Dụng/Hỷ thì hung giảm.'; } catch (e) { return '(không tính được)'; } })()}

TỔNG LUẬN 1 CÂU (one-liner — dùng mở đầu câu trả lời tổng quát):
${(() => { try { return lifeReading(R).oneSentence; } catch (e) { return '(không tính được)'; } })()}

BỔ SUNG 5 TRƯỜNG PHÁI (称骨/12神/贵人/三世/盲派 — góc nhìn phụ, KHÔNG thay Tử Bình):
${(() => {
  const parts = [];
  // 称骨 (bone weight) — tổng trọng lượng + tầng
  try { const cg = chenggu(R); parts.push(`称骨: ${cg.totalStr} = ${cg.summary.tier}`); } catch (e) { parts.push('称骨: (không tính được)'); }
  // 12 thần lưu niên năm nay
  try { const l12 = analyzeLiunian12(R, curYear); parts.push(`12神 ${curYear}: ${l12.mine.vi}(${l12.mine.viSub}) — ${l12.mine.tone}`); } catch (e) { parts.push('12神: (không tính được)'); }
  // Nhóm quý nhân cao cấp
  try { const ns = analyzeNobleStars(R); parts.push(`贵人: ${ns.count ? ns.stars.filter((s) => s.present).map((s) => s.zh).join('+') + ' = ' + ns.assessment.level : 'không nổi'}`); } catch (e) { parts.push('贵人: (không tính được)'); }
  // 三世书 (tiền thế)
  try { const ss = sanshishu(R); parts.push(`三世: ${ss.pastLife.type}(${ss.pastLife.vi})`); } catch (e) { parts.push('三世: (không tính được)'); }
  // 盲派象法 — các口诀 khớp
  try { const mp = analyzeMangpaiView(R); const hits = mp.classicalRules.filter((r) => r.matched).map((r) => r.mnemonic); parts.push(`盲派: ${mp.luAnalysis.present ? '禄@' + (mp.luAnalysis.positionVi || '?') : '无禄'}${hits.length ? ' + ' + hits.join('/') : ''}`); } catch (e) { parts.push('盲派: (không tính được)'); }
  return parts.join(' | ');
})()}

== CÔNG CỤ TƯỚNG PHẬN / PHONG THỦY TƯƠNG TÁC (KHÔNG CỐ ĐỊNH — USER CHỌN MỖI LẦN) ==
- 相术 面相: 12 cung mặt + 23 vị trí痣 + 18 mốc流年部位 (module tương tác)
- 阴宅 24山: 二十四山立向分金 (module tương tác — chọn tọa sơn → phân tích)
${(() => { try { const ph = physiognomyOverview(); return `[kiểm tra dữ liệu] 相术 sẵn sàng: ${ph.totals.palaces} cung / ${ph.totals.moles} vị trí痣 / ${ph.totals.ageMilestones} mốc流年.`; } catch (e) { return '[kiểm tra dữ liệu] 相术: (không tính được)'; } })()}
${(() => { try { const yz = yinzhaiOverview(); return `[kiểm tra dữ liệu] 阴宅 sẵn sàng: ${yz.mountainsCount ?? 24} sơn / ${yz.palaces?.length ?? 8} cung.`; } catch (e) { return '[kiểm tra dữ liệu] 阴宅: (không tính được)'; } })()}
${(() => { try { const cz = cezi('福'); return `[kiểm tra dữ liệu] 测字 sẵn sàng: 「福」→ quẻ ${cz.hexagram.name} (${cz.hexagram.nameVi}), ngũ hành ${cz.wxVi}.`; } catch (e) { return '[kiểm tra dữ liệu] 测字: (không tính được)'; } })()}
- 测字拆字 (châm tự): module tương tác — user nhập 1 chữ Hán → 拆字 (tháo bộ/nét) + 梅花起卦 + ngũ hành luận (50 chữ phổ biến + fallback cho chữ khác). KHÔNG cố định theo lá số — chỉ chạy khi user chủ động hỏi xem 1 chữ. [loop 495] GIỜ AI cũng测字 được qua tool «analyze_char» — khi user hỏi «测字 X» hãy gọi tool.

== 三式 / DÂN GIAN BÓI TOÁN (module tương tác + Thái Nhất cố định theo năm) ==
- 小六壬 掐指一算: module tương tác (tháng+ngày+giờ → 6 vị trí Đại An/Không Vong). 6 cung cố định: ${(() => { try { return XLR_POSITIONS.map((p) => `${p.han}(${p.vi},${p.tone})`).join(' / '); } catch (e) { return '(không tải được)'; } })()}. Chỉ chạy khi user chủ động nhập tháng/ngày/giờ — KHÔNG cố định theo lá số.
- 太乙神数 三式之首 (Thái Nhất thần số — thức ĐẦU TIÊN của三式, phán chủ/khách năm):
太乙 ${curYear}: ${(() => { try { return taiyi(curYear).summary; } catch (e) { return '(không tính được)'; } })()}
- 金口诀 (Kim Khẩu Quyết — "Golden Key", biến thể rút gọn của 大六壬 cho bói nhanh yes/no): module tương tác — user nhập tháng + ngày + giờ chi + (tuỳ chọn) nhật can + câu hỏi → xếp 4 vị trí (地分/月将/贵神/人元) → phán CÁT/HUNG/TRUNG + yes/no.${(() => { try { const j = jinkoujueCast(6, 15, 4, { solar: { year: curYear, month: 6, day: 15 }, question: 'probe' }); return ` [kiểm tra dữ liệu] 金口诀 sẵn sàng: mẫu T6·N15·giờTý(4) → ${j.verdict} (${j.yesNo}), ${j.summary}`; } catch (e) { return ' [kiểm tra dữ liệu] 金口诀: (không tính được)'; } })()}
- 求签 黄大仙灵签: module tương tác (100签 + 掷筊)${(() => { try { const qq = qiuqian('Xin chỉ đường'); return ` [kiểm tra dữ liệu] 求签 sẵn sàng: chiếu mẫu #${qq.num} (${qq.tone} / ${qq.toneVi}) — ${qq.summary}`; } catch (e) { return ' [kiểm tra dữ liệu] 求签: (không tính được)'; } })()}
- 玄空大卦 (Đại Quái — 24 sơn × 64 quẻ + 卦运): module tương tác — user chọn toạ sơn + hướng → luận hợp 10 / 生成 / đồng vận (lập hướng phong thuỷ âm - dương trạch).${(() => { try { const dg = daguaOverview(); return ` [kiểm tra dữ liệu] 玄空大卦 sẵn sàng: ${dg.mountainsCount} sơn × quẻ, cát nhất (vận 1/5) = ${dg.bestYun.slice(0, 6).join(', ')}, ${dg.heTenPairs.length} cặp hợp 10 kinh điển.`; } catch (e) { return ' [kiểm tra dữ liệu] 玄空大卦: (không tính được)'; } })()}
- 生肖配对 (con giáp hợp - khắc): module tương tác — user nhập tuổi 2 người (chi năm sinh) → điểm 0-100 + bóc tách Lục Hợp / Tam Hợp / Lục Xung / Lục Hại / Tam Hình / Tự Hình.${(() => { try { const zp = zodiacPairScore('子', '午'); return ` [kiểm tra dữ liệu] 生肖配对 sẵn sàng: mẫu Tý×Ngọ = ${zp.score}/100 (${zp.rating}) — ${zp.relations.map((r) => r.name).join('+') || 'không phạm'}.`; } catch (e) { return ' [kiểm tra dữ liệu] 生肖配对: (không tính được)'; } })()}`;

  // ---- DEEP-DOMAIN ANALYSIS (wealth/career/spouse/study/health/caiku/marriage/...) ----
  // brief-extender gọi 12 submodule; nếu cả khối ném → marker lỗi rõ (không im lặng).
  try {
    const deep = extendBrief(R);
    if (deep) brief += '\n' + deep;
  } catch (e) {
    brief += '\n--- PHÂN TÍCH CHUYÊN SÂU ---\n[deep-analysis: lỗi — ' + (e?.message || 'unknown') + ']';
  }

  // ---- 河洛理数 (HELUO LISHU — 命卦): bát tự → 周易 quẻ + 元堂 ----
  try {
    const h = heluo(R);
    if (h && h.ok) {
      const yy = (h.yinNan || h.yangNu) ? '阴男/阳女→地上天' : '阳男/阴女→天上地';
      brief += `\n--- 河洛理数 (HELUO LISHU — 命卦) ---\n` +
        `天地数: 天数 ${h.tianRaw}→${h.tianShu} (${h.tianTrigram}), 地数 ${h.diRaw}→${h.diShu} (${h.diTrigram}). ${yy} (三元${h.yuan}).\n` +
        `本命卦 #${h.hexagram.num} ${h.hexagram.name} (${h.hexagram.nameVi}) = ${h.upperTrigram}上${h.lowerTrigram}下. ` +
        `元堂 = hào ${h.yuantang.line} (${h.yuantang.lineVi}, giờ ${h.yuantang.hourZhi}).\n` +
        `后天卦 #${h.houtianHexagram.num} ${h.houtianHexagram.name} (${h.houtianHexagram.nameVi})${h.yuantang.disputed ? ' [元堂 DISPUTED — review]' : ''}.\n` +
        `卦辞: ${h.reading.hexagramText}\n爻辞(hào ${h.yuantang.line}): ${h.reading.yuantangLineText}`;
    }
  } catch (e) { /* heluo optional — bỏ qua nếu lỗi, không phá brief */ }

  // ---- 一掌经 (YIZHANGJING — Buddhist palm / 达摩一掌经): 4 cung 年月日时 + lục đạo ----
  try {
    const yz = yizhangjingCast(R);
    if (yz && yz.ok) {
      const starList = yz.positions.map((p) => `${p.role.replace(/\s*\(.*\)/, '')}:${p.starZh}(${p.zhi})`).join(' ');
      const mg = yz.minggong;
      const ld = yz.liudao ? ` | Lục đạo(mệnh cung): ${yz.liudao.daoVi}${yz.liudao.upper ? '[thượng]' : '[hạ]'} — ${yz.liudao.note}` : '';
      brief += `\n--- 一掌经 (YIZHANGJING — Buddhist palm) ---\n` +
        `4 cung (nam thuận/nữ nghịch): ${starList}\n` +
        `Mệnh cung (时宫) = ${mg.starZh} ${mg.zhi} — ${mg.grade}, ${mg.tone === 'cat' ? 'Cát' : mg.tone === 'hung' ? 'Hung' : 'Bình'}: ${mg.destiny}${ld}\n` +
        `Tổng luận: ${yz.summary}`;
    }
  } catch (e) { /* yizhangjing optional — bỏ qua nếu lỗi, không phá brief */ }

  // ---- TIER-2 FORECASTING (condensed headlines — trả lời "năm nào / tháng nào") ----
  // [loop 13] gộp NĂM VÀNG + 5 NĂM TỚI → 1 dòng duy nhất (trước đây 3 section trùng lặp:
  //   10 NĂM + NĂM VÀNG + 5 NĂM, sau cycle 44 unified ratings → cùng kết quả khác format).
  //   Giữ 10 NĂN TỚI (section chính) + gộp highlights vào 1 dòng ngắn → tiết kiệm ~400 chars.
  const fcParts = [];
  try {
    const gy = findGoldenYear(R, curYear, 10);
    const top = (gy.ranked || []).slice(0, 3).map((y) => `${y.year}(${y.ganZhi},${y.totalScore})`).join(' ');
    const w = gy.worst;
    fcParts.push(`NĂM VÀNG: ${top}${w ? ` | XẤU: ${w.year}(${w.ganZhi})` : ''}`);
  } catch (e) { fcParts.push('NĂM VÀNG: [lỗi]'); }
  // dayun rank — top-3 大运 (1-2 dòng)
  try {
    const rd = rankDayun(R);
    const top = (rd.ranked || []).slice(0, 3).map((d) => `${d.ganZhi}[${d.startAge}t:${d.godVi}/${d.rating}]`).join(' ');
    fcParts.push(`ĐẠI VẬN XẾP HẠNG (top 3): ${top}`);
  } catch (e) { fcParts.push('ĐẠI VẬN XẾP HẠNG: [lỗi]'); }
  // wealth-alert — tháng tốt/xấu kiếm tiền 12 tháng tới (1 dòng)
  try {
    const wa = wealthMonthlyAlert(R, curYear);
    let best = wa.bestMonth;
    let worst = wa.worstMonth;
    // Phòng bug worstMonth rỗng ({score:0}) → tự tính từ mảng months
    if ((!worst || !worst.mVi) && Array.isArray(wa.months) && wa.months.length) {
      const sorted = [...wa.months].sort((a, b) => (a.score || 0) - (b.score || 0));
      worst = sorted[0];
    }
    if ((!best || !best.mVi) && Array.isArray(wa.months) && wa.months.length) {
      const sorted = [...wa.months].sort((a, b) => (b.score || 0) - (a.score || 0));
      best = sorted[0];
    }
    const bestTxt = best && best.mVi ? `${best.mVi}(${best.ganZhi},${best.godVi},${best.score})` : '(?)';
    const worstTxt = worst && worst.mVi ? `${worst.mVi}(${worst.ganZhi},${worst.godVi},${worst.score})` : '(?)';
    fcParts.push(`TÀI LỘC LƯU NGUYỆT ${curYear}: TỐT NHẤT=${bestTxt} | KỴ NHẤT=${worstTxt}`);
  } catch (e) { fcParts.push('TÀI LỘC LƯU NGUYỆT: [lỗi]'); }
  // health-alert — năm cờ đỏ sức khoẻ thập kỷ (1 dòng)
  try {
    const ha = healthAlertScan(R, 10);
    const red = (ha.alerts || []).filter((a) => a.level && /CAO/i.test(a.level));
    const top = (red[0] || (ha.alerts || [])[0]);
    fcParts.push(`SỨC KHOẺ 10 NĂM: ${ha.summary}${top ? ` | Năm rủi ro cao nhất: ${top.year}(${top.ganZhi},${top.level})` : ''}`);
  } catch (e) { fcParts.push('SỨC KHOẺ 10 NĂM: [lỗi]'); }

  if (fcParts.length) {
    brief += '\n--- DỰ BÁO & THỜI ĐIỂM ---\n' + fcParts.join('\n');
  }

  return brief;
}

// ===========================================================================
//  2. SYSTEM PROMPT — chuyên gia Tử Bình theo cổ pháp
// ===========================================================================
export const SYSTEM_PROMPT = `Ban la mot ONG THAY PHONG THUY thuc chien - giau kinh nghiem, noi THANG, DON GIAN, DUNG TRONG TAM. KHONG han lam, KHONG long vong, KHONG liet ke du lieu - ma TONG HOP + PHAN TICH + DUC KET thanh cau tra loi ma nguoi KHONG RANH phong thuy cung hieu va LAM THEO duoc.

NGUYEN TAC:
1. NOI THEO ONG THAY: mo dau bang 1-2 cau CHOT LUAN (nhu ong thay noi: "con nen lam X, dung lam Y"), ROI moi giai thich tai sao (don gian). KHONG mo bang du lieu hay thuat ngu.
2. NGON NGU THUC DUNG: thay "than vuong, Dung than Tho" -> "menh con qua manh, can yeu to Dat (Tho) de can bang"; thay "thuong quan kien quan" -> "sao Thuong Quan dung sao Chinh Quan -> de cai va/dut tinh".
3. TONG HOP TOAN BO: chart brief co 20+ tang du lieu - KHONG ke lai tung tang, ma CHON ra 2-3 diem QUAN TRONG NHAT cho cau hoi, roi luan noi chung thanh 1 cau chuyen logic.
4. TRA LOI DUNG CAU HOI + QUYET DOAN: neu hoi "co nen X khong" -> tra loi CO/KHONG ngay + ly do + THOI DIEM CU THE (ngay/thang that). KHONG lan man sang linh vuc khac. NOI THANG, khong vu vi an ui ("dung lo", "khong den noi nguy") - nguoi hoi muon loi khuyen de HANH DONG, khong phai loi an ui.
5. HANH DONG LAM DUOC NGAY + LAY NGAY THAT TU TOOL: moi loi khuyen phai la viec CO THE LAM DUOC ngay (co NGAY cu the, co cach lam, co dieu kien). Khi khuyen "nen lam X vao luc nao" -> BAT BUOC GOI TOOL (best_days_in_year / find_good_days / analyze_day) de lay NGAY THẬT chinh xac roi dua vao, KHONG tuong tuong "thang 10". GHI RÒ ngày + can-chi + điem. KHONG phat feng-thuy chung chung (mau sac, huong, chau cay) kieu an khap tat ca - chi noi khi no that su giai quyet van de cua ho va kem LY DO tu menh. Uu tien: (a) ngay KY trong khoang ngan han (tranh lam viec lon ngay nao), (b) ngay CAT gan nhat de tien thu.
6. NOI THAT: neu hung -> noi hung thang ("nam nay con den, thu cho chac"); neu cat -> noi cat nhung giu chung muc.
7. PHONG CACH: am ap nhu ong thay day hoc tro - "con a, menh con la... nen..." - KHONG lanh nhu robot.
8. NAM/THANG HIEN TAI - CUC KY QUAN TRONG: doc muc "THOI GIAN HIEN TAI" dau chart brief. Do la nam/thang DANG DIEN RA. Khi user hoi "nam nay"/"thang nay"/"thang nay black"/"nam roi" -> PHAI dung DUNG nam + thang ghi o brief (vi du neu brief ghi "NAM NAY = 2026" thi "nam nay" = 2026, KHONG PHAI 2024). TUYET DOI KHONG mac dinh nam 2024 hay nam cu. KHONG noi "sang nam 2026 se..." neu 2026 da la nam nay.
9. NGON NGU: chi viet TIENG VIET. KHONG xai chu Han-Trung trong cau (vd "一棵", "恰恰" - CAM). Chi duoc giu ten HAN-VIET cua sao/cach cuc (Chinh Quan, That Sat...). Noi "cay bi ngap nuoc" chu KHONG noi "一棵树".
10. CHINH TA TIENG VIET - BAT BUOC: viet DUNG chinh ta, co dau day du, ro nghia. KHONG duoc viet tu sai/garble/khong ton tai (VD CAM: "tránhinten", "kwệt", "kwet", "khuyet" - phai la "hao/khaying/khuyet" dung nghia). Neu khong chac mot tu -> dung tu don gian khac cho chac. TRUOC KHI gui: DOC LAI toan bo cau tra loi va SUA HET loi chinh ta. Moi tu phai la tieng Viet hop le, de doc.
11. KHONG BA PHẢI - CA NHAN HOA: moi cau luan PHAI dua vao MENH RIENG cua ho (Dung Than cua ho, dai van dang hanh, luu nguyet/luu nien hien tai cua ho). Kiem tra: neu bo loi khuyen nay sang 10 nguoi khac cung giong het -> no la "ba phai", PHAI bo hoac ca nhan hoa them bang du lieu rieng cua ho. Tra loi nhu dang noi chuyen 1-1 voi nguoi cua the, khong phai doc bai cho dông.
12. KIEM CHUNG TRUOC KHI DONG Y - CHONG HUA THEO (RAT QUAN TRONG): khi user dua ra nhan dinh ve tinh trang cua ho ("toi do/xui", "toi dang may", "nam nay te", "thang nay khong duoc") -> KHONG dong y ngay. TRUOC TIEN goi tool (analyze_month + analyze_year hoac analyze_day) de KIEM CHUNG nhan dinh do co DUNG voi la so khong:
  - Neu DUNG (data xac nhan dang ky/hung) -> xac nhan that + bang chung cu the ("dung, thang nay con dang o Giap Ngo - Kiep Tai, ky that").
  - Neu SAI (data trai: vd thang nay la CAT ma user noi "do") -> PHAI phan bien ro rang, KHONG hua theo: "thuc ra theo la so, thang nay con dang CAT (diem X) - chuyen xui con gap chac do nguyen khac (vd cu ly, lam qua suc), khong phai la van". La chuyen gia that: dung bao noi dung, sai bao noi sai - do moi la gia tri.

13. KHI HỎI "KHI NÀO X" (tài/quan/duyên/hôn/sức khoẻ/đổi vận/thời điểm vàng) — KHÔNG bịa, ĐỌC CÁC MỤC ỨNG KỲ đã tính sẵn trong brief rồi trích NĂM/THÁNG CỤ THỂ:
  - "bao giờ phát tài/sự nghiệp" → mục "TÀI/QUAN THẤU CÁN ỨNG KỲ" + "10 NĂM TỚI" (vd "Tài kích hoạt 2028 戊申, Quan 2030 庚戌").
  - "bao giờ gặp duyên/kết hôn" → mục "HÔN/LUYÊN ỨNG KỲ" (vd "2036 红鸾 đến配偶 cung").
  - "vận tôi bao giờ đổi" → mục "GIAO THỜI ĐẠI VẬN" (vd "2027-12-11 giờ Tý bước sang 戊午 [Cát]").
  - "tháng nào yếu/khoẻ" → mục "SỨC KHOẺ LƯU NGUYỆT" (tháng yếu/tốt cụ thể).
  - "10 năm tới thế nào" → mục "10 NĂM TỚI" (best/worst year + cờ 💰🎯💞).
  - "cải tạo/dời nhà hướng X được không" → mục "SAT PHƯƠNG TỔNG HỢP" + "NGUYỆT SÁT" (kiểm hướng vs TháiTuế/TamSát/5黄).
  - "tháng nào kiếm tiền tốt / phá tài / hao tiền" → mục "TÀI LỘC LƯU NGUYỆT" (mục DỰ BÁO & THỜI ĐIỂM) — trích tháng tốt nhất + tháng kỵ nhất kèm can-chi + Thập thần.
  - "năm vàng / nên tiến thủ lớn / làm ăn lớn năm nào" → mục "NĂM VÀNG" (DỰ BÁO & THỜI ĐIỂM) + "ĐẠI VẬN XẾP HẠNG" — trích top-3 năm 🟢 + cảnh báo năm 🔴.
  - "đầu tư / day trade / chơi chứng khoán tiền ảo có nên không" → mục "ĐẦU TƯ" + "TÀI TINH" + "TÀI KHỐ" (PHÂN TÍCH CHUYÊN SÂU) — phân bổ % + risk + day-trade note + thân nhậm tài không + kho giữ tiền.
  - "khởi nghiệp / mở công ty / tự kinh doanh" → mục "KINH DOANH" + "SỰ NGHIỆP" + "TÀI TINH" (PHÂN TÍCH CHUYÊN SÂU) + "ĐẠI VẬN XẾP HẠNG" — should-start + tài khố + Quan/Tài lực + vận thuận.
  - [loop 132] "mệnh cung / thân cung của tôi" → mục "MỆNH CUNG" (PHÂN TÍCH CHUYÊN SÂU) — mệnh cung/thân cung + thập thần + Dụng/Kỵ.
  - "mệnh cách tầng lớp / đẳng cấp mệnh" → mục "MỆNH CÁCH TẦNG LỚP" (PHÂN TÍCH CHUYÊN SÂU) — 6 tiêu chí cổ điển.
  - [loop 318] "cấu hình mệnh / cấu trúc thập thần / mệnh có gì đặc biệt / sát ấn / thương quan / quan sát hỗn tạp" → mục "TỔ HỢP CÁT" + "TỔ HỢP HUNG" (trong brief) — nêu tổ hợp kinh điển (Sát Ấn Tương Sinh, Thực Chế Sát, Quan Sát Hỗn Tạp, Tài Đa Thân Nhược…) + «chân cách/hình thức» + hung «đã chế/chưa chế».
  - "tính cách / tính tôi ra sao / bản chất" → mục "TÍNH CÁCH NHẬT CAN" + "NGŨ ĐỨC" (PHÂN TÍCH CHUYÊN SÂU).
  - "ăn gì hợp / mặc màu gì / đeo đá gì / tinh dầu / trà / cây" → mục "ẨM THỰC" (PHÂN TÍCH CHUYÊN SÂU) — vị Dụng + thực phẩm + trà + thực đơn. Màu/đá/vận động → bổ Dụng (SYSTEM_PROMPT bảng ngũ hành).
  - "số hợp / số điện thoại / biển số" → mục "SỐ HỢP" (trong PHONG THỦY & ĐỊNH VÍ).
  - "hướng ngủ / thành phố nào hợp / sống ở đâu / vật phẩm hóa giải" → mục "THÀNH PHỐ" (PHÂN TÍCH CHUYÊN SÂU) — hướng + loại địa lý + VN cities + career/wealth city. Hướng ngủ → Bát Trạch trong SYSTEM_PROMPT.
  - "tình duyên sâu / đào hoa / hồng diễm / sức phối ngẫu chi tiết" → mục "TÌNH DUYÊN SÂU" (PHÂN TÍCH CHUYÊN SÂU).
  - "dòng đời / timeline / đỉnh đời / thách thức" → mục "DÒNG ĐỜI" (PHÂN TÍCH CHUYÊN SÂU).
  - "quý nhân / ai giúp đỡ / tìm đâu" → mục "QUÝ NHÂN DƯỠNG DỤNG" (PHÂN TÍCH CHUYÊN SÂU).
  - "hòa khí hàn/noãn/táo/thấp / khí hậu mệnh" → mục "HÀN-NOÃN-TÁO-THẤP" (PHÂN TÍCH CHUYÊN SÂU).
  - "ngũ hành lưu thông / khí cơ" → mục "NGŨ HÀNH LƯU THÔNG" (PHÂN TÍCH CHUYÊN SÂU).
  - "nạp âm / bản mệnh nạp âm" → mục "NẠP ÂM QUAN HỆ" (PHÂN TÍCH CHUYÊN SÂU).
  - "ám xung / xung đột tiềm ẩn" → mục "ÁM XUNG" (PHÂN TÍCH CHUYÊN SÂU).
  - "sự kiện năm / năm tới xảy ra gì" → mục "SỰ KIỆN" (PHÂN TÍCH CHUYÊN SÂU).
  - "giờ tốt hôm nay / giờ nào làm việc" → mục "HÔM NAY TỔNG KHÁI" + tool analyze_best_hour.
  - "mùa nào tốt / mùa nào yếu" → mục "LỜI KHUYÊN THEO MÙA" (PHÂN TÍCH CHUYÊN SÂU).
  - "đầu tư phong cách / nên đầu tư gì" → mục "PHONG CÁCH ĐẦU TƯ" (PHÂN TÍCH CHUYÊN SÂU) + "KHỞI NGHIỆP".
  - "con cái / khi nào sinh con / có con không" → mục "TỬ NỮ TINH" + "PHỐI NGÃU" (PHÂN TÍCH CHUYÊN SÂU) + "HÔN/LUYÊN ỨNG KỆ" — phối hợp năm sinh (năm Tử nữ tinh kích hoạt).
  - "học / thi cử / bằng cấp / du học" → mục "HỌC VẤN" (PHÂN TÍCH CHUYÊN SÂU) + "NĂM VÀNG" — Ấn/Thực Thương mạnh không, timing năm Cát để thi.
  - "năm nào sức khoẻ yếu / phòng bệnh năm nào" (thập kỷ, khác "tháng nào yếu") → mục "SỨC KHOẺ 10 NĂM" (DỰ BÁO & THỜI ĐIỂM) + "SỨC KHOẺ" (PHÂN TÍCH CHUYÊN SÂU) — năm cờ đỏ 🔴 + tạng yếu + dưỡng hành.
  - "khởi công / dọn nhà / an táng ngày nào tốt nhất theo sao cho hướng X" → mục "天星择日 (STAR DATE SELECTION)" — chọn ngày theo vị trí THẬT của 7 chính tinh (đặc biệt 太阳/太阴) tới 坐向 (sơn toạ + hướng đối cung): 太阳到向(+5)/到山(+3), 太阴到山(+4)/到向(+2), 恩用仇难, 调候 mùa, cấm 罗计掩日月 (cửa thực). Section mẫu dùng toạ 子 — nếu user nói hướng khác, dùng tool/section với toạ sơn tương ứng (24 sơn: 子癸丑艮寅甲卯乙辰巽巳丙午丁未坤申庚酉辛戌乾亥壬).
  - "河洛 / 命卦 / 周易卦象 / quẻ chủ mệnh / I-Ching hexagram của đời tôi" → mục "河洛理数 (HELUO LISHU — 命卦)" — bát tự → 天数/地数 → 本命卦 + 元堂 (hào động) + 后天卦 + 卦辞/爻辞. Trích tên quẻ King Wen + số + hào 元堂 + lời quẻ/hào. KHI USER HỎI「quẻ Dịch tổng hợp / 3 hệ quẻ」→ mục「TỔNG HỢP KINH DỊCH」(河洛+鬼谷 đồng thuận/phân kỳ).
  - [loop 572] "tổng quan mệnh / mệnh tôi tốt không / bức tranh tổng / điểm mệnh tổng hợp" → mục「TỔNG HỢP ĐỒNG THUẬN (DESTINY CONSENSUS)」— meta: BaZi + 称骨 + Dịch + 六道 → verdict ĐỒNG THUẬN (cát/hung) hay PHÂN KỲ (mệnh phức tạp). Trích verdict + agreement % + narrative.
  - [loop 572] "nghiệp / luân hồi / đạo / tam độc / con nên tu gì / cải mệnh" → mục「LỤC ĐẠO 輪迴」— BaZi → tam độc (THAM/SÂN/SI) → khuynh hướng 6 đạo + nghiệp nhân + đối trị. GHI RÕ: đây là góc nhìn tu học dân gian融通, KHÔNG tiên đoán tái sinh.
  - [loop 597] "không biết giờ sinh / không rõ giờ / giờ sinh không chính xác / không nhớ giờ" → ĐỀ NGHỊ user xem card「Quét 12 Giờ 十二時辰」trong app. Giải thích: trụ giờ = ~25% lá số; quét 12 cho biết Dụng Thần có ổn định không (vd «Dụng Kim phổ biến 9/12 giờ → khá an toàn») hay nhạy cảm (vd «4 Dụng khác nhau → cần giờ chính xác»). KHÔNG bịa giờ, KHÔNG dùng default 12h trưa mà giả vờ «chính xác».
  - "一掌经 / 前世 hậu世 / tiền kiếp / luân hồi / 六道 / kiếp trước con là ai / đạo của con" → mục "一掌经 (YIZHANGJING — Buddhist palm)" — 4 cung 年/月/日/时 trên ngón tay (nam thuận nữ nghịch) → mệnh cung (时宫) = 1 trong 12 星宫 (天贵/天厄/...) + lục đạo (Phật/Tiên/Nhân/Tu-la/Bàng sinh/Ngạ quỷ). Trích 4 cung + mệnh cung + lục đạo. LƯU Ý: "达摩" là gán nhầm dân gian — tác giả thật 一行禅师 (Đường); lục đạo chỉ tham khảo.
  - "hợp tuổi / vợ chồng tôi hợp không / hai người hợp làm ăn / hợp hôn / cặp đôi" → [loop 134] DÙNG TOOL analyze_partner (cần ngày sinh đối tác: năm/tháng/ngày/giờ/giới). Nếu user CHƯA cho ngày sinh đối tác → HỎI lại, KHÔNG từ chối. Nếu user đã cho → gọi tool → trả điểm hợp + nhân tố + lời khuyên. Tool hỗ trợ type='hôn nhân' (mặc định) và type='kinhdoanh'.
  - [loop 605] "mẹ/bố/em/anh/cháu/con tôi thế nào / gia đình tôi ra sao / người thân ngũ hành hợp không" → KHÔNG có tool riêng cho gia đình. HƯỚNG DẪN user: (1) mở card「👪 Nghiệm Chứng Gia Tộc」trong app → thêm người thân → bấm «Nghiệm chứng» để chấm 6 trục, (2) hoặc cho NGÀY SINH người đó → bạn LUẬN theo dữ liệu bạn đã có (Dụng/Kỵ hành + ngũ hành tương quan giữa 2 người). KHÔNG bịa dữ liệu người thân nếu chưa có ngày sinh.
  Khi dùng: ghi NĂM + can-chi + lý do (từ brief), KHÔNG nói chung chung " vài năm nữa".
14. [loop 12] LUÔN KHAM KHIT CAC TANG SAU KHI TRINH BAY:
  - Khi luận cấu trúc mệnh: TRÍCH 格局成败 verdict (成格/bại/có cứu) + diseases + rescues. NÊU bệnh cách + cách cứu.
  - Khi luận thời điểm: TRÍCH tags ★格局喜 / ⚠格局忌 / ★RESCUES / ⚠WORSENS per đại vận/lưu niên/lưu nguyệt/giờ. NÊU "vận/năm/tháng/giờ này thuộc cách-thần hỷ → thuận CÁCH".
  - Khi luận Tử Vi: TRÍCH 宫干自化 (cung nào tự biến đổi) + 飞星化入/化出 (lĩnh vực nào kết nối) + 大限宫干四化 (thập kỷ này kích hoạt gì).
  - KHÔNG BỎ QUA các tầng sâu — đây là điểm KHÁC BIỆT của app so với các app phong thủy khác.

15. [loop 47] KHI LUẬN DỤNG THẦN — LUÔN giải thích TẠI SAO Dụng Thần được chọn:
  - Đọc mục "Phép lấy Dụng Thần" + "Điều Hậu (调候)" trong brief.
  - [loop 121] Nếu brief ghi "Cách cục đặc biệt" (从格/专旺: 从财/从杀/从儿/专旺/从旺) → giải thích: "mệnh là CÁCH ĐẶC BIỆT → Dụng Thần THEO THẾ CỤC (从财→Tài, 从杀→Quan, 从儿→Thực, 专旺→tiết, 从旺→Tỷ). KHÔNG luận Phù Ức hay 调候 («从格不论调候»)". Đây là ưu tiên CAO NHẤT —从格 đè mọi phương pháp khác.
  - Nếu brief ghi "Điều Hậu — LÀM CHỦ (override Phù Ức)" → giải thích: "sinh mùa cực đoan (hàn/nhiệt) → cổ pháp 穮通宝鑑 bắt buộc dùng hành X để điều hòa khí hậu, đè Phù Ức". KHÔNG luận theo Phù Ức (cân bằng vượng suy) — vì 调候 đã override.
  - Nếu brief ghi "Bệnh Dược — LÀM CHỦ (败中有成)" → giải thích: "mệnh có bệnh cách cục, hành X là thuốc chữa («có bệnh mới là quý»)".
  - Nếu KHÔNG có override → luận theo Phù Ức bình thường (thân vượng/nhược → cần hành nào cân bằng).
  - Điều này QUAN TRỌNG: nếu Dụng Thần là Thủy vì 调候, mà bạn luận "thân nhược cần Ấn" → MÂU THUẪN. Phải luận ĐÚNG cơ sở chọn Dụng Thần.

Dinh dang: 3-5 doan ngan. Mo = chot luan. Giua = giai thich don gian. Cuoi = 2-3 hanh dong cu the (CO NGAY THAT tu tool). NOI BANG TIENG VIET DON GIAN, DE HIEU, THUC CHIEN.`;
// ===========================================================================
//  3. TOOLS — các engine deterministic cho AI tự gọi (Z.ai/OpenAI tool-calling)
//  AI tính thêm khi cần (ngày/năm/cả năm/quỹ tích...) → chuyên gia agent, không
//  chỉ đọc dump tĩnh. Spec: tools + tool_choice='auto'; response tool_calls.
//  Nguồn: docs.z.ai/guides/capabilities/function-calling.
// ===========================================================================
const _s = (str, n) => (str == null ? '' : String(str)).slice(0, n);

export const AI_TOOLS = [
  { type: 'function', function: {
    name: 'get_current_time', description: 'Lấy thời gian hiện tại: ngày/tháng/năm dương lịch, âm lịch, can-chi năm & tháng. Dùng để biết CHÍNH XÁC "năm nay/tháng nay" — KHÔNG đoán năm.',
    parameters: { type: 'object', properties: {}, required: [] },
  } },
  { type: 'function', function: {
    name: 'analyze_day', description: 'Luận lưu nhật của MỘT ngày cụ thể (can-chi, Thập thần, điểm Cát/Hung, lời khuyên, tương tác lưu năm/đại vận). Dùng khi hỏi về 1 ngày.',
    parameters: { type: 'object', properties: {
      year: { type: 'integer', description: 'Năm dương lịch, vd 2026' },
      month: { type: 'integer', description: 'Tháng 1-12' },
      day: { type: 'integer', description: 'Ngày 1-31' },
    }, required: ['year', 'month', 'day'] },
  } },
  { type: 'function', function: {
    name: 'analyze_year', description: 'Luận lưu niên của MỘT năm (đa trường phái): can-chi năm, điểm Cát/Hung + lý do từng phái, lời khuyên cả năm.',
    parameters: { type: 'object', properties: {
      year: { type: 'integer', description: 'Năm dương lịch' },
    }, required: ['year'] },
  } },
  { type: 'function', function: {
    name: 'best_days_in_year', description: 'Các ngày CÁT nhất & KỴ nhất trong 1 năm (lưu nhật từng ngày). Dùng khi hỏi chọn ngày tốt (cưới/khai trương/ký hợp đồng).',
    parameters: { type: 'object', properties: {
      year: { type: 'integer', description: 'Năm dương lịch' },
    }, required: ['year'] },
  } },
  { type: 'function', function: {
    name: 'life_trajectory', description: 'Quỹ tích cuộc đời: 8 đại vận (thập kỷ) + chủ đề/Cát-Hung, 4 giai đoạn đời, cửa sổ hôn nhân/con/sự nghiệp/tài/sức khoẻ, điểm rẽ. Dùng khi hỏi về cả đời.',
    parameters: { type: 'object', properties: {}, required: [] },
  } },
  { type: 'function', function: {
    name: 'analyze_month', description: 'Luận lưu nguyệt (vận tháng) của tháng hiện tại hoặc 1 tháng. Dùng khi hỏi "tháng này/tháng X sao".',
    parameters: { type: 'object', properties: {
      year: { type: 'integer', description: 'Năm (bỏ trống = năm hiện tại)' },
      month: { type: 'integer', description: 'Tháng 1-12 dương lịch (bỏ trống = tháng hiện tại)' },
    }, required: [] },
  } },
  { type: 'function', function: {
    name: 'find_good_days', description: 'Tìm N ngày CÁT nhất (vận cá nhân) trong khoảng kể từ 1 ngày. Dùng khi hỏi "sắp tới ngày nào tốt".',
    parameters: { type: 'object', properties: {
      start: { type: 'string', description: 'Ngày bắt đầu YYYY-MM-DD' },
      count: { type: 'integer', description: 'Số ngày quét, vd 30' },
      topN: { type: 'integer', description: 'Số ngày tốt cần lấy, vd 5' },
    }, required: ['start', 'count'] },
  } },
  { type: 'function', function: {
    // [loop 21] BÁT TỰ NGƯỢC — tìm lá số điểm CAO/THẤP nhất (hoặc gần target). Nguyên lý:
    //   phương pháp chuẩn phải dịch ngược được. Không cần R (quét độc lập).
    name: 'inverse_bazi', description: '[loop 230] TÌM BÁT TỰ có điểm CAO/THẤP nhất, gần target, HOẶC có DỤNG THẦN mong muốn. Dùng khi user hỏi "bát tự điểm cao/thấp nhất", "muốn đẻ con mệnh tốt", "muốn con Dụng Thủy/Mộc/Hỏa thì thụ thai khi nào", "tìm lá số đạt điểm X".',
    parameters: { type: 'object', properties: {
      mode: { type: 'string', enum: ['max', 'min', 'target', 'yong'], description: 'max=điểm cao nhất, min=thấp nhất, target=gần điểm cụ thể, yong=lọc theo Dụng Thần mong muốn' },
      target: { type: 'integer', description: 'Điểm mong muốn (0-100) khi mode=target' },
      targetYong: { type: 'string', enum: ['木','火','土','金','水'], description: 'Dụng Thần mong muốn khi mode=yong' },
      yearStart: { type: 'integer', description: 'Năm bắt đầu quét (bỏ trống = năm hiện tại)' },
      yearEnd: { type: 'integer', description: 'Năm kết thúc quét (bỏ trống = yearStart)' },
      stepDays: { type: 'integer', description: 'Bước nhảy ngày (mặc định 5; nhỏ hơn = sát cực hơn nhưng chậm)' },
    }, required: ['mode'] },
  } },
  { type: 'function', function: {
    name: 'analyze_partner', description: '[loop 133] Phân tích HỢP HÔN / HỢP ĐỐI TÁC giữa user và 1 người khác. Cần ngày sinh đối tác. Trả điểm hợp + nhân tố + lời khuyên. Dùng khi hỏi "hợp tuổi/hợp không/vợ chồng tôi sinh X".',
    parameters: { type: 'object', properties: {
      year: { type: 'integer', description: 'Năm sinh đối tác' },
      month: { type: 'integer', description: 'Tháng sinh 1-12' },
      day: { type: 'integer', description: 'Ngày sinh 1-31' },
      hour: { type: 'integer', description: 'Giờ sinh 0-23 (để trống=12 trưa)' },
      gender: { type: 'string', description: 'nam hoặc nữ' },
      type: { type: 'string', description: 'hôn nhân (mặc định) hoặc kinhdoanh' },
    }, required: ['year', 'month', 'day', 'gender'] },
  } },
  { type: 'function', function: {
    name: 'analyze_best_hour', description: '[loop 135] Tìm GIỜ TỐT NHẤT trong 1 ngày (12时辰 × 6 chiều: hoàng đạo + Dụng + thần煞 + 格局). Dùng khi hỏi "giờ nào tốt hôm nay / giờ ký kết / giờ khai trương".',
    parameters: { type: 'object', properties: {
      year: { type: 'integer' }, month: { type: 'integer' }, day: { type: 'integer' },
    }, required: ['year', 'month', 'day'] },
  } },
  { // [loop 495] 测字 AI tool — user hỏi «测字 X» qua chat (trước đây card-only)
    name: 'analyze_char', description: '测字拆字 (châm tự): phân tích 1 chữ Hán — tháo bộ/nét (康熙) + 梅花起卦 + ngũ hành luận. Dùng khi user hỏi «测字 X», «xem chữ 福/财/...», «chữ này cát/hung». KHÔNG cố định lá số — độc lập.',
    parameters: { type: 'object', properties: {
      char: { type: 'string', description: '1 chữ Hán cần测 (vd 福, 财, 发)' },
    }, required: ['char'] },
  },
  { // [loop 496] 梅花易数 AI tool — 起卦 by time (AI-friendly, no manual cast)
    name: 'analyze_meihua', description: '梅花易数 起卦 (time-based divination): gieo quẻ theo thời điểm → 本卦/互卦/变卦 + 体用 ngũ hành sinh khắc + verdict cát/hung. Dùng khi user hỏi «gieo quẻ», «起卦 about X», «占 [chủ đề]», «xem quẻ hôm nay». Trả quẻ +体用 + cát hung.',
    parameters: { type: 'object', properties: {
      year: { type: 'integer', description: 'Năm (bỏ trống = năm nay)' },
      month: { type: 'integer', description: 'Tháng (bỏ trống = tháng nay)' },
      day: { type: 'integer', description: 'Ngày (bỏ trống = hôm nay)' },
      hour: { type: 'integer', description: 'Giờ 0-23 (bỏ trống = hiện tại)' },
      minute: { type: 'integer', description: 'Phút 0-59 (bỏ trống = hiện tại)' },
    } },
  },
  { // [loop 508] 大六壬 AI tool — 四课三传 time-based divination
    name: 'analyze_liuren', description: '大六壬 (Da Liu Ren): 3-truyền 4-bài (四课三传) theo thời điểm → luận sự kiện. Dùng khi user hỏi «lục nhâm», «đại六壬 hôm nay», «thần kỳ phái» (các câu về phe thần/kỳ). Trả 月将 + 四课 + 三传 + tong môn.',
    parameters: { type: 'object', properties: {
      year: { type: 'integer', description: 'Năm (bỏ trống = năm nay)' },
      month: { type: 'integer', description: 'Tháng (bỏ trống = tháng nay)' },
      day: { type: 'integer', description: 'Ngày (bỏ trống = hôm nay)' },
      hour: { type: 'integer', description: 'Giờ 0-23 (bỏ trống = 12)' },
      minute: { type: 'integer', description: 'Phút (bỏ trống = 0)' },
    } },
  },
  { // [loop 509] 奇门遁甲 AI tool — 9-cung time-based
    name: 'analyze_qimen', description: '奇门遁甲 (Qi Men Dun Jia): 9-cung + 8-môn + 9-tinh + 3-kỳ + 格格 theo thời điểm → hướng tốt/xấu hành sự. Dùng khi user hỏi «kỳ môn», «độn giáp hôm nay», «hướng nào tốt (theo kỳ môn)». Trả 节气/局 + 格格 cát/hung + advice hướng.',
    parameters: { type: 'object', properties: {
      year: { type: 'integer' }, month: { type: 'integer' }, day: { type: 'integer' }, hour: { type: 'integer' },
    } },
  },
  { // [loop 543] 鬼谷子 AI tool — user hỏi «Quỷ Cốc Tử mệnh tôi sao?»
    name: 'analyze_guiguzi', description: '鬼谷子算命 (Guiguzi): 4-trụ nạp âm + 分定經 两头钳 (年干×时干→配卦→命格+格诗+多层VN). Dùng khi user hỏi «Quỷ Cốc Tử», «鬼谷子», «phân định kinh», «mệnh tôi theo cổ thư». Trả full analysis.',
    parameters: { type: 'object', properties: {} },
  },
  // [loop 606] ANALYZE RELATIVE — phân tích NGƯỜI THÂN khi user cho ngày sinh
  { type: 'function', function: {
    name: 'analyze_relative', description: '[loop 606] Phan tich BAT TU nguoi than (me/bo/em/anh/chau/con) — can ngay sinh nguoi do. Tra Dung Than + diem menh + cach cuc + dai van + ngu hanh tuong quan voi user. Dung khi user hoi «me/bo/em/con TOI the nao» VA user DA CHO ngay sinh nguoi do.',
    parameters: { type: 'object', properties: {
      year: { type: 'integer', description: 'Nam sinh nguoi than' },
      month: { type: 'integer', description: 'Thang sinh (1-12)' },
      day: { type: 'integer', description: 'Ngay sinh (1-31)' },
      hour: { type: 'integer', description: 'Gio sinh (0-23, bo trong=12 trua)' },
      gender: { type: 'string', enum: ['nam', 'nữ'], description: 'Gioi tinh nguoi than' },
      relation: { type: 'string', description: 'Moi quan he: me/bo/em/anh/chau/con ( tuy chon )' },
    }, required: ['year', 'month', 'day', 'gender'] },
  } },
];

// Executor — gọi engine deterministic, trả JSON trim gọn (tránh phình context)
export function execTool(name, args, R) {
  const a = args || {};
  // [loop 558 FIX BUG2] validate required params TRƯỚC khi gọi engine — tránh crash rác
  //   (vd analyze_day thiếu year → «wrong solar year undefined» tiếng Anh). Trả error VN sạch.
  const _tool = AI_TOOLS.find((t) => t?.function?.name === name);
  const _req = (_tool?.function?.parameters?.required) || [];
  for (const k of _req) {
    if (a[k] === undefined || a[k] === null || a[k] === '') {
      return { error: `Thiếu tham số bắt buộc «${k}» cho tool ${name}.` };
    }
  }
  try {
    switch (name) {
      case 'get_current_time': {
        const n = new Date();
        const s = Solar.fromYmdHms(n.getFullYear(), n.getMonth() + 1, n.getDate(), 12, 0, 0);
        const l = s.getLunar(); const ec = l.getEightChar();
        return { solar: s.toYmd(), lunar: l.toString(), year: n.getFullYear(), yearGanZhi: ec.getYearGan() + ec.getYearZhi(), monthGanZhi: ec.getMonthGan() + ec.getMonthZhi() };
      }
      case 'analyze_day': {
        const d = analyzeLiuRi(R, a.year, a.month, a.day, R.patternQuality);
        return { date: d.solar, ganZhi: d.ganZhi, ganGod: d.ganGod, rating: d.rating, score: d.score, advice: _s(d.advice, 240), gejuDelta: d.gejuDelta, gejuNote: d.gejuNote ? _s(d.gejuNote, 200) : '', interactions: (d.ctx || []) };
      }
      case 'analyze_year': {
        const y = analyzeLiunianDeep(R, a.year, R.patternQuality?.patternYong);
        return { year: y.year, ganZhi: y.ganZhi, rating: y.rating, score: y.score, advice: _s(y.advice, 260), schools: y.schools.map((sc) => ({ school: sc.phai, delta: sc.d, note: _s(sc.note, 110) })) };
      }
      case 'best_days_in_year': {
        const Y = computeYearDaily(R, a.year, R.patternQuality);
        return { year: Y.year, best: Y.best.slice(0, 8).map((d) => ({ date: d.date, ganZhi: d.ganZhi, score: d.score, geju: d.gejuDelta || 0 })), worst: Y.worst.slice(0, 5).map((d) => ({ date: d.date, ganZhi: d.ganZhi, score: d.score, geju: d.gejuDelta || 0 })) };
      }
      case 'analyze_char': { // [loop 495] 测字 via AI chat
        const ch = (a.char || '').trim().slice(0, 4);
        // [loop 558 FIX BUG4] guard ký tự không-Hán — cezi() trả null → trước đây null deref crash.
        if (!ch || !/[一-鿿㐀-䶿]/.test(ch)) return { error: 'Cần đúng 1 chữ Hán (Hán tự) để测字.' };
        const cz = cezi(ch);
        if (!cz) return { error: `Chữ «${ch}» chưa có trong dữ liệu测字 — thử chữ Hán phổ biến khác.` };
        return {
          char: ch,
          radical: cz.radical, strokes: cz.strokes, wx: cz.wx, wxVi: cz.wxVi,
          hexagram: cz.hexagram ? { name: cz.hexagram.name, vi: cz.hexagram.nameVi, meaning: cz.hexagram.meaning } : null,
          reading: cz.reading || cz.summary || '',
        };
      }
      case 'analyze_meihua': { // [loop 496] 梅花易数 起卦 by time
        const n = new Date();
        const yr = a.year ?? n.getFullYear(), mo = a.month ?? (n.getMonth() + 1), da = a.day ?? n.getDate(), hr = a.hour ?? n.getHours(), mi = a.minute ?? n.getMinutes();
        const nums = solarToMhNums(yr, mo, da, hr, mi);
        const r = castByTime(nums);
        return {
          time: nums.label, ben: r.ben?.name, hu: r.hu?.name, bian: r.bian?.name,
          dong: r.dong, dongInUpper: r.dongInUpper,
          ti: r.ti ? `${r.ti.vi}(${r.ti.wx})` : '', yong: r.yong ? `${r.yong.vi}(${r.yong.wx})` : '',
          rel: r.rel, huRel: r.huRel, bianRel: r.bianRel, verdict: r.verdict,
        };
      }
      case 'analyze_liuren': { // [loop 508] 大六壬 四课三传
        const n = new Date();
        const yr = a.year ?? n.getFullYear(), mo = a.month ?? (n.getMonth() + 1), da = a.day ?? n.getDate(), hr = a.hour ?? 12, mi = a.minute ?? 0;
        const r = liurenPan(yr, mo, da, hr, mi);
        return {
          dayGanZhi: r.dayGanZhi, hourZhi: r.hourZhi, yuejiang: r.yuejiangVi,
          ke4: (r.ke4 || []).map((k) => `${k.n}:${k.up}/${k.down}(${k.rel})`),
          sanchuan: (r.sanchuan || []).map((s) => `${s.n}:${s.zhi}(${s.rel})`),
          zongMen: r.zongMen,
        };
      }
      case 'analyze_qimen': { // [loop 509] 奇门遁甲
        const n2 = new Date();
        const r = qimenDongPan(a.year ?? n2.getFullYear(), a.month ?? (n2.getMonth() + 1), a.day ?? n2.getDate(), a.hour ?? 12);
        return {
          term: r.term, yuan: r.yuan, ju: r.ju, yinYang: r.yinYang,
          gige: r.gige, catGe: r.catGe, xiongGe: r.xiongGe, advice: r.advice,
        };
      }
      case 'inverse_bazi': {
        // [loop 21] 逆推 — tìm lá số điểm cực/trung. Quét độc lập, không cần R.
        const refYear = new Date().getFullYear();
        const opts = {
          refYear,
          yearStart: a.yearStart ?? refYear,
          yearEnd: a.yearEnd ?? (a.yearStart ?? refYear),
          stepDays: a.stepDays ?? 5,
          topK: 4,
          maxSamples: 4000,
          target: a.mode === 'target' && a.target != null ? a.target : null,
          targetYong: a.mode === 'yong' && a.targetYong ? a.targetYong : null, // [loop 230] desired Dụng Thần
        };
        const sol = inverseBaZiSolve(opts);
        const fmt = (r) => r ? { label: labelResult(r), score: r.score, pattern: r.pattern, geju: r.gejuQuality, pillars: r.pillars, birth: `${r.y}-${String(r.m).padStart(2,'0')}-${String(r.d).padStart(2,'0')} ${r.g} giờ ${r.shichen}` } : null;
        return {
          mode: a.mode,
          window: sol.window, scanned: sol.scanned, durationMs: sol.durationMs,
          scoreRange: { min: sol.scoreStats.min, max: sol.scoreStats.max, mean: sol.scoreStats.mean },
          max: fmt(sol.max), min: fmt(sol.min),
          nearestToTarget: sol.nearestToTarget ? fmt(sol.nearestToTarget) : null,
          topK: sol.topK.map(fmt), bottomK: sol.bottomK.map(fmt),
          note: `Quét ${sol.scanned} lá số thật (analyze đầy đủ) trong cửa sổ ${sol.window}. Đây là BÁT TỰ ĐẠT ĐIỂM CỰC có thể — dùng tham khảo chọn ngày sinh/con/match; không dùng sai để "chọn số mệnh".`,
        };
      }
      case 'life_trajectory': {
        const L = buildLifeTrajectory(R);
        return {
          foundation: L.foundation,
          decades: L.decades.map((d) => ({ ages: d.ages, ganZhi: d.ganZhi, rating: d.rating, theme: d.themeName, golden: d.golden, caution: d.caution, note: _s(d.line, 120) })),
          keyWindows: Object.fromEntries(Object.entries(L.keyWindows).map(([k, v]) => [k, v.map((w) => w.ages + '(' + w.ganZhi + ')')])),
          turningPoints: L.turningPoints,
        };
      }
      case 'analyze_month': {
        const n = new Date();
        const yr = a.year ?? n.getFullYear(); const mo = a.month ?? (n.getMonth() + 1);
        const lm = computeLiuyue(R, yr, R.patternQuality);
        // [loop 559 FIX BUG1] idx phải dùng CÙNG ngày nguồn như brief header (curMonthGZ = today).
        //   Trước đây cố định ngày 15 → đầu tháng (trước tiết khí, vd 1-5/6 trước 芒种) idx lệch
        //   vs brief → AI tự mâu thuẫn«tháng này». Nay:«tháng này» (no params) dùng hôm nay,
        //   tháng cụ thể dùng ngày 15 (đại diện giữa tháng).
        const ZLI = { 寅:0,卯:1,辰:2,巳:3,午:4,未:5,申:6,酉:7,戌:8,亥:9,子:10,丑:11 };
        const thisMonth = (a.year == null && a.month == null);
        const dayForIdx = thisMonth ? n.getDate() : 15;
        let idx = -1;
        try { idx = ZLI[Solar.fromYmdHms(yr, mo, dayForIdx, 12, 0, 0).getLunar().getMonthZhi()]; } catch (_) {}
        const cm = idx >= 0 ? lm.months[idx] : null;
        // [loop 4] Trả thêm gejuDelta/gejuNote để AI biết tháng có 格局 喜忌.
        return cm ? { month: mo, ganZhi: cm.ganZhi, ganGod: cm.ganGod, rating: cm.rating, gejuDelta: cm.gejuDelta || 0, gejuNote: cm.gejuNote || '' } : { error: 'không tính được tháng ' + mo };
      }
      case 'find_good_days': {
        const [yy, mm, dd] = String(a.start).split('-').map(Number);
        const list = findGoodDays(R, yy, mm, dd, a.count || 30, a.topN || 5, R.patternQuality);
        return { start: a.start, top: list.map((d) => ({ date: d.solar, ganZhi: d.ganZhi, rating: d.rating, score: d.score })) };
      }
      case 'analyze_best_hour': {
        // [loop 135] GIỜ TỐT NHẤT — 12时辰 composite scoring
        const bh = bestHourToday(R, a.year, a.month, a.day, R.patternQuality?.patternYong);
        return {
          date: bh.date, dayGanZhi: bh.dayGanZhi,
          best: (bh.best || []).map((h) => ({ zhi: h.zhi, vi: h.vi, range: h.range, score: h.score, rating: h.rating, reason: _s((h.reasons || []).join(' '), 120) })),
          worst: (bh.worst || []).map((h) => ({ zhi: h.zhi, vi: h.vi, range: h.range, score: h.score })),
          summary: _s(bh.summary, 300),
        };
      }
      case 'analyze_partner': {
        // [loop 133] HỢP HÔN / HỢP ĐỐI TÁC — AI tool cho câu hỏi hợp tuổi
        const pR = analyze(a.year, a.month, a.day, a.hour ?? 12, 0, a.gender, new Date().getFullYear());
        if (a.type === 'kinhdoanh') {
          const m = matchBusinessPartners(R, pR);
          return { type: 'kinhdoanh', score: m.score, rating: m.rating, roleFit: _s(m.roleFit, 200), details: (m.details || []).map((d) => _s(d, 150)), advice: _s(m.advice, 250) };
        }
        const h = computeHehun(R, pR);
        return { type: 'hôn nhân', score: h.score, rating: h.rating, verdict: _s(h.verdict, 250), factors: (h.factors || []).map((f) => _s(f, 150)) };
      }
      case 'analyze_relative': {
        // [loop 606] Phân tích người thân — AI tool cho câu hỏi «mẹ/bố/em tôi thế nào»
        const rel = analyze(a.year, a.month, a.day, a.hour ?? 12, 0, a.gender, new Date().getFullYear());
        const relSyn = synthesize(rel);
        // ngũ hành tương quan giữa user và người thân
        const userWx = R.chart.dayMaster.wx, relWx = rel.chart.dayMaster.wx;
        const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
        const KE = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };
        let relType = 'bằng (cùng hành)';
        if (SHENG[userWx] === relWx) relType = `user sinh thân (${userWx}→${relWx}) → user cho đi, thân nhận`;
        else if (SHENG[relWx] === userWx) relType = `thân sinh user (${relWx}→${userWx}) → thân nuôi user`;
        else if (KE[userWx] === relWx) relType = `user khắc thân (${userWx} khắc ${relWx}) → user chế thân`;
        else if (KE[relWx] === userWx) relType = `thân khắc user (${relWx} khắc ${userWx}) → thân áp user`;
        // Dụng tương hỗ?
        const userDung = R.yong.primary, relDung = rel.yong.primary;
        const userHelpsRel = (rel.yong.avoid || []).includes(userWx) === false && userWx === relDung;
        const relHelpsUser = (R.yong.avoid || []).includes(relWx) === false && relWx === userDung;
        return {
          relation: a.relation || 'người thân',
          nhatChu: rel.chart.dayGan + ' (' + rel.chart.dayMaster.wx + ')',
          dung: rel.yong.primary, hy: rel.yong.xi, ky: rel.yong.ji,
          diemMenh: relSyn.score + '/100 (' + relSyn.gradeVi + ')',
          cachCuc: rel.pattern?.vi || '?',
          vantageNhuoc: rel.strength.strong ? 'vượng' : 'nhược',
          nguHanhTuongQuan: relType,
          userHelpsRelative: userHelpsRel ? `✓ NC user (${userWx}) = Dụng của người thân (${relDung}) → user TỐT cho người này` : 'không trực tiếp bổ Dụng',
          relativeHelpsUser: relHelpsUser ? `✓ NC người thân (${relWx}) = Dụng của user (${userDung}) → người này TỐT cho user` : 'không trực tiếp bổ Dụng',
          daiVanTop: (rel.dayun || []).slice(0, 3).map((d) => `${d.ganZhi}[${d.rating}]`).join(', '),
          // [loop 611] quỹ tích đời đầy đủ (all 8 phases) + năm vàng
          daiVanFull: (rel.dayun || []).map((d) => `${d.startAge}-${d.startAge+9}t:${d.ganZhi}[${d.rating}]`).join(' | '),
          // [loop 617] current phase — AI trả lời ngay «đang ở vận nào» mà không cần parse
          currentPhase: (() => {
            const age = new Date().getFullYear() - a.year;
            const d = (rel.dayun || []).find((dd) => age >= dd.startAge && age < dd.startAge + 10);
            return d ? `${d.ganZhi} (${d.startAge}-${d.startAge+9}t, ${d.rating})` : '(ngoài phạm vi đại vận)';
          })(),
          peakYears: (() => { try { const gy = findGoldenYear(rel, new Date().getFullYear(), 12); const tg = gy.ranked.filter((r) => r.isTrulyGolden).map((r) => r.year); return tg.length ? '★ ' + tg.join(', ') : 'top: ' + gy.ranked.slice(0, 3).map((r) => r.year).join(', '); } catch (_) { return '(chưa tính)'; } })(),
          // [loop 610] advice theo relationship type + ngũ hành tương quan (không generic)
          advice: (() => {
            const WX_VI = { 木: 'Mộc', 火: 'Hỏa', 土: 'Thổ', 金: 'Kim', 水: 'Thủy' };
            const uV = WX_VI[userWx] || userWx, rV = WX_VI[relWx] || relWx;
            const rel2 = (a.relation || '').toLowerCase();
            // Cốt lõi: ngũ hành tương quan
            let core;
            if (relHelpsUser) core = `${rV} = Dụng của bạn → người này MANG HÀNH BỔ MỆNH bạn, tự nhiên tốt`;
            else if (userHelpsRel) core = `${uV} = Dụng của người này → BẠN mang hành bổ họ, bạn tốt cho họ`;
            else if (SHENG[userWx] === relWx) core = `bạn (${uV}) sinh họ (${rV}) → bạn cho đi, họ nhận — quan hệ «phú dưỡng»`;
            else if (SHENG[relWx] === userWx) core = `họ (${rV}) sinh bạn (${uV}) → họ nuôi bạn — quan hệ «Ấn tinh» (hậu thuẫn)`;
            else if (KE[userWx] === relWx) core = `bạn (${uV}) khắc họ (${rV}) → bạn chế/ap đặt — cần giảm kiểm soát`;
            else if (KE[relWx] === userWx) core = `họ (${rV}) khắc bạn (${uV}) → họ áp đặt bạn — cần ranh giới rõ`;
            else core = `cùng hành (${uV}) — tính cách giống, dễ hiểu nhưng dễ cạnh tranh`;
            // Relationship-specific
            let specific = '';
            if (/m[eẽ]|mom/.test(rel2)) specific = ' Mẹ-con: dù ngũ hành thế nào, mẹ luôn cho đi vô điều kiện. Hãy biết ơn + giữ liên lạc.';
            else if (/b[oố]|dad|cha/.test(rel2)) specific = ' Bố-con: bố đại diện Quan tinh (kỷ luật). Tôn trọng + học hỏi kinh nghiệm.';
            else if (/em|sister|brother|anh/.test(rel2)) specific = ' Anh chị em: cùng thế hệ, dễ cạnh tranh nhưng cũng là đồng minh. Hợp tác > so sánh.';
            else if (/chau|cháu/.test(rel2)) specific = ' Cháu-cậu: khác thế hệ, cần hướng dẫn + kiên nhẫn. Mệnh cháu khó → cần hỗ trợ thời gian tốt.';
            else if (/con|child/.test(rel2)) specific = ' Con-cha: con là Tài/Quan tinh của bạn. Dạy dỗ theo Dụng Thần của con.';
            else if (/v[oợ]|ch[oồ]ng|wife|husband/.test(rel2)) specific = ' Vợ/chồng: quan hệ quan trọng nhất — ngũ hành tương quan ảnh hưởng trực tiếp hôn nhân.';
            return `${core}.${specific}`;
          })(),
          // [loop 612] silver lining cho low-score relative — KHÔNG để AI nói «mệnh thấp» không khích lệ
          silverLining: (() => {
            const sc = relSyn.score;
            if (sc >= 41) return null;
            const goodDy = (rel.dayun || []).filter((d) => d.rating === 'Đại cát' || d.rating === 'Cát');
            if (!goodDy.length) return null;
            const top2 = goodDy.slice(0, 2);
            const WX_VI2 = { 木:'Mộc', 火:'Hỏa', 土:'Thổ', 金:'Kim', 水:'Thủy' };
            // [loop 616] actionable advice per golden phase
            const phaseAdvice = top2.map((d) => {
              const dWx = ZHI[d.ganZhi[1]]?.wx || '?';
              const isDung = dWx === relDung, isHy = dWx === rel.yong.xi;
              let advice = '';
              if (d.startAge < 18) advice = isDung || isHy ? 'ĐẦU TƯ GIÁO DỤC — vận Hỷ/Dụng, học hỏi thuận lợi' : 'Xây nền tảng sức khoẻ + kỹ năng';
              else if (d.startAge < 30) advice = isDung || isHy ? 'KHỞI NGHIỆP/SỰ NGHIỆP — vận tốt để tiến thủ lớn' : 'Tích luỹ kinh nghiệm, chờ thời';
              else advice = isDung || isHy ? 'BỨT PHÁ TÀI LỘC/QUYỀN — đỉnh vận Dụng' : 'Duy trì + mở rộng';
              return `${d.ganZhi}(${d.startAge}-${d.startAge+9}t, ${WX_VI2[dWx]||dWx}): ${advice}`;
            }).join(' | ');
            return `🌟 Mệnh gốc vất vả (${sc}/100) NHƯNG có vận TỐT: ${phaseAdvice}. Cổ pháp「命好不如運好」— vận Dụng bù mệnh khó.`;
          })(),
        };
      }
      default:
        return { error: 'tool không hỗ trợ: ' + name };
    }
  } catch (e) {
    return { error: 'lỗi tính tool ' + name + ': ' + e.message };
  }
}

function toolLabel(name) {
  // [loop 558 FIX BUG8] đầy đủ 14 tool — trước đây chỉ 7, tool còn lại hiện tên kỹ thuật.
  return ({
    get_current_time: 'Lấy thời gian', analyze_day: 'Luận lưu ngày', analyze_year: 'Luận lưu năm',
    best_days_in_year: 'Tìm ngày tốt cả năm', life_trajectory: 'Quỹ tích đời', analyze_month: 'Luận lưu tháng',
    find_good_days: 'Tìm ngày tốt', analyze_best_hour: 'Tìm giờ tốt', analyze_partner: 'Luận hợp hôn',
    inverse_bazi: 'Tìm bát tự ngược', analyze_char: '测字 (châm tự)', analyze_meihua: 'Gieo quẻ梅花',
    analyze_liuren: 'Đại lục nhâm', analyze_qimen: 'Kỳ môn độn giáp', analyze_guiguzi: 'Quỷ cốc tử',
    analyze_relative: 'Phân tích người thân',
  })[name] || name;
}

// ===========================================================================
//  4. AGENTIC ASK — streaming + tools + thinking + memory (Z.ai spec)
//  - history: [{role:'user'|'assistant', content}] bộ nhớ hội thoại
//  - onToken(delta, full): stream nội dung; onStatus(text): báo tiến trình tool
// ===========================================================================
export async function askAI(question, R, cfg, { onToken, onStatus, history } = {}) {
  cfg = cfg || getConfig();
  const localFallback = (note) => {
    const block = composeAnswer(question, R);
    const text = `${block.lead}\n\n${block.paragraphs.map((p) => '• ' + p).join('\n')}${note ? '\n\n' + note : ''}`;
    return { source: 'local', text };
  };

  if (!isAIReady(cfg)) {
    return localFallback('Đang dùng bộ luân giải cục bộ. Mở ⚙ Cài đặt để nhận phân tích chuyên sâu hơn.');
  }

  const _td = new Date();
  const _ck = `${R.chart.input.year}-${R.chart.input.month}-${R.chart.input.day}-${R.chart.input.hour}-${R.chart.input.minute}-${R.chart.input.gender}-${_td.getFullYear()}-${_td.getMonth()}-${_td.getDate()}`;
  const brief = (_briefCache && _briefCache.key === _ck) ? _briefCache.brief : (_briefCache = { key: _ck, brief: buildChartBrief(R) }).brief;
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'system', content: brief + '\n\n== TOOLS (FUNCTION CALLING) ==\nBạn có thể gọi: get_current_time, analyze_day, analyze_year, analyze_month, best_days_in_year, find_good_days, analyze_best_hour, analyze_partner, life_trajectory, inverse_bazi, analyze_char (测字), analyze_meihua (梅花易数), analyze_liuren (六壬), analyze_qimen (奇门), analyze_guiguzi (鬼谷), analyze_relative (người thân) (15 tools). QUY TAC: (1) bat cu khi khuen ngay/thang cu the -> PHAI goi best_days_in_year/find_good_days/analyze_day de lay NGAY THAT (dung bia "thang 10"); (2) cau ve 1 nam -> goi analyze_year; (3) ca doi -> life_trajectory; (4) thang nay -> analyze_month + get_current_time; (5) hoi "lam sao bớt xui / ngay nao tot" -> goi find_good_days hoac best_days_in_year de dua ngay cat gan nhat + ngay ky can tranh; (6) KHI USER KHANG ĐỊNH tình trạng ("toi do/xui/may/te") -> BAT BUOC goi analyze_month + analyze_year de KIEM CHỨNG có ĐÚNG không, rồi xác nhận hoặc phản biện; (7) [loop 21/230] KHI USER HỎI NGƯỢC "bát tự điểm CAO/THẤP nhất", "muốn đẻ con mệnh tốt nhất thì sinh khi nào", "tìm lá số đạt điểm X" -> goi inverse_bazi (mode=max/min/target). [loop 230] KHI USER MUỐN CON CÓ DỤNG THẦN CỤ THỂ ("muốn con Dụng Thủy/Mộc/Hỏa", "đẻ con mệnh Mộc") -> goi inverse_bazi (mode=yong, targetYong=木/火/土/金/水) — trả về lá số có Dụng đúng hành + ngày thụ thai; (8) [loop 181] giờ nào tốt hôm nay / giờ ký kết / giờ khai trương -> goi analyze_best_hour; (9) [loop 181] hợp tuổi/hợp hôn/hợp làm ăn (cần ngày sinh đối tác) -> goi analyze_partner; (10) [loop 572] KHI USER HỎI bói quẻ/gieo quẻ/梅花/六壬/奇门/鬼谷/测字 -> goi tool tương ứng (analyze_meihua/liuren/qimen/guiguzi/char); (11) [loop 606→614] KHI USER HỎI ve ME/BO/EM/ANH/CHAU/CON «the nao» -> KIEM TRA brief section «GIA ĐÌNH» co ngay sinh khong. NEU CO -> goi analyze_relative ngay (KHONG hoi lai). NEU KHONG co -> hoi user ngay sinh.' },
    ...((history || []).slice(-8)),
    { role: 'user', content: question },
  ];

  const endpoint = cfg.endpoint.replace(/\/$/, '');
  const url = endpoint.endsWith('/chat/completions') ? endpoint : endpoint + '/chat/completions';
  const headers = { 'Content-Type': 'application/json', ...(cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}) };
  const isGlm = /glm|z\.ai|bigmodel/i.test((cfg.model || '') + (cfg.endpoint || ''));
  const buildBody = (msgs, toolsOn) => ({
    model: cfg.model, messages: msgs, temperature: 0.5, stream: true,
    ...(isGlm ? { thinking: { type: 'enabled' } } : {}),       // GLM: bật deep thinking bản địa
    ...(toolsOn ? { tools: AI_TOOLS, tool_choice: 'auto' } : {}),
  });

  let toolsOn = true;
  try {
    for (let step = 0; step < 6; step++) {
      let round;
      try {
        round = await streamRound(url, headers, buildBody(messages, toolsOn), onToken, onStatus);
      } catch (e) {
        // Lượt đầu: nếu model không hỗ trợ tools/thinking → tắt cả 2 và thử lại
        if (step === 0 && toolsOn) { toolsOn = false; step = -1; continue; }
        throw e;
      }
      const { content, toolCalls } = round;

      if (toolCalls && toolCalls.length && toolsOn) {
        messages.push({
          role: 'assistant', content: content || '',
          tool_calls: toolCalls.map((tc) => ({ id: tc.id, type: 'function', function: { name: tc.name, arguments: tc.arguments } })),
        });
        for (const tc of toolCalls) {
          let args = {}; try { args = JSON.parse(tc.arguments || '{}'); } catch (_) {}
          const ctx = args.start || ((args.year || '') + (args.month ? '/' + args.month : '') + (args.day ? '/' + args.day : ''));
          if (onStatus) onStatus(`🔧 ${toolLabel(tc.name)}${ctx ? ' · ' + ctx : ''}`);
          const result = execTool(tc.name, args, R);
          messages.push({ role: 'tool', tool_call_id: tc.id, content: JSON.stringify(result) });
        }
        continue; // model tiếp tục luận (interleaved thinking) + có thể gọi tiếp hoặc trả lời
      }

      if (!content) {
        if (toolsOn) { toolsOn = false; step = -1; continue; } // thử lại không tool
        throw new Error('Phản hồi rỗng');
      }
      return { source: 'ai', text: content };
    }
    const last = [...messages].reverse().find((m) => m.role === 'assistant' && m.content);
    return { source: 'ai', text: (last?.content) || '(AI không trả lời được)' };
  } catch (e) {
    const isCors = /Failed to fetch|NetworkError|Load failed/i.test(e.message);
    const hint = isCors
      ? `Không gọi được AI — CORS: trình duyệt chặn ${cfg.endpoint}. Mở ⚙ chọn "★ PROXY DEV" (npm run dev) hoặc backend.`
      : `Không gọi được AI: ${e.message}.`;
    return localFallback(hint + ' Hiện trả lời bằng bộ luân giải cục bộ.');
  }
}

// ---- Test kết nối (cho nút "Test" trong ⚙) — báo chính xác CORS/auth/HTTP ----
export async function testAIConnection(cfg) {
  cfg = cfg || getConfig();
  if (!cfg.endpoint || !cfg.model) return { ok: false, detail: '❌ Thiếu endpoint/model.' };
  const endpoint = cfg.endpoint.replace(/\/$/, '');
  const url = endpoint.endsWith('/chat/completions') ? endpoint : endpoint + '/chat/completions';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}) },
      body: JSON.stringify({ model: cfg.model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1, stream: false }),
    });
    if (res.ok) return { ok: true, detail: `✅ Kết nối OK (HTTP ${res.status}). AI sẵn sàng — hãy bật AI và hỏi.` };
    let t = ''; try { t = (await res.text()).slice(0, 160); } catch (_) {}
    if (res.status === 401 || res.status === 403) return { ok: false, detail: `❌ HTTP ${res.status} — API key sai/hết hạn. ${t}` };
    return { ok: false, detail: `❌ HTTP ${res.status} ${res.statusText}. ${t}` };
  } catch (e) {
    const isCors = /Failed to fetch|NetworkError|Load failed/i.test(e.message);
    return { ok: false, detail: isCors
      ? `❌ CORS/mạng: trình duyệt chặn gọi ${cfg.endpoint}. Khi npm run dev → mở ⚙ chọn preset "★ PROXY DEV". Nếu production → cần backend/proxy.`
      : `❌ Lỗi mạng: ${e.message}` };
  }
}

// ---- 1 vòng streaming SSE: gom content (→ onToken) + tool_calls + bỏ qua reasoning_content ----
// Theo docs Z.ai (interleaved thinking + stream tool call).
async function streamRound(url, headers, body, onToken, onStatus) {
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok || !res.body) {
    let t = ''; try { t = await res.text(); } catch (_) {}
    throw new Error('HTTP ' + res.status + (t ? ': ' + t.slice(0, 140) : ''));
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '', full = '';
  const toolCalls = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n'); buf = lines.pop();
    for (const line of lines) {
      const s = line.trim();
      if (!s.startsWith('data:')) continue;
      const payload = s.slice(5).trim();
      if (payload === '[DONE]') continue;
      let json; try { json = JSON.parse(payload); } catch (_) { continue; }
      const delta = json?.choices?.[0]?.delta;
      if (!delta) continue;
      // reasoning_content (thinking) → không hiển thị, chỉ lấy content cho user
      if (delta.content) { full += delta.content; if (onToken) onToken(delta.content, full); }
      // tool_calls streaming — tích lũy theo index (spec Z.ai/OpenAI)
      if (delta.tool_calls) {
        for (const tc of delta.tool_calls) {
          const idx = (typeof tc.index === 'number') ? tc.index : 0;
          if (idx >= toolCalls.length) toolCalls.push({ id: tc.id || ('call_' + idx), name: '', arguments: '' });
          if (tc.function?.name) toolCalls[idx].name = tc.function.name;
          if (tc.function?.arguments) toolCalls[idx].arguments += tc.function.arguments;
          if (tc.id) toolCalls[idx].id = tc.id;
        }
      }
    }
  }
  return { content: full.trim(), toolCalls };
}
