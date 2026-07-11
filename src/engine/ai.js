// ============================================================================
//  TÍCH HỢP AI (LLM) — luân giải Bát Tự mở rộng cho BẤT KỲ câu hỏi nào
//  - Có cấu hình API (OpenAI-compatible) → gửi "chart brief" + câu hỏi cho LLM,
//    LLM luân giải dựa trên dữ liệu ĐÃ TÍNH ĐÚNG + nguyên lý cổ điển.
//  - Không có cấu hình / lỗi → fallback về tầng NLG cục bộ (composeAnswer).
//  Hỗ trợ: OpenAI, GLM/Z.ai, DeepSeek, Ollama, bất kỳ endpoint /chat/completions.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI, TIAOHOU_PRINCIPLE } from './constants.js';
import { composeAnswer } from './nlg.js';
import { DITIANSUI, DITIANSUI_HEZHI, DITIANSUI_TONGLUN, YONGSHEN_METHOD, ZIPING_YONG_MAXIM, WUYAN_DUBU, PATTERN_DEEP, SHEN_HIERARCHY, JISHAN_PIAN, DITIANSUI_SHISHEN, SHANGGUAN_5YONG, TEN_GOD_DEEP, LIFE_AREA_INDEX, PATTERN_GUIDE, INTERACTION_MEANING, QIONGTONG_TIAOHOU, DITIANSUI_MAXIMS, SANMING_DAYUN_RULES, ZIWEI_PALACE_LIFE, WUXING_HEALTH, CAREER_BY_GOD, DIVINATION_SCHOOLS, SPOUSE_PALACE_READING, MARRIAGE_TIMING_SIGNALS, WEALTH_TIERS, WEALTH_KU, NOBLE_STAR_RULES, NOBLE_STAR_NOTE, PEACH_BLOSSOM_RULES, PEACH_NOTE, DECADE_LIFE_THEMES, ANNUAL_GANZHI_EFFECT, ANNUAL_ZHI_EFFECT, FENGSHUI_PRACTICAL, TWELVE_LUCK_METHODS, QIGONG_BY_ELEMENT, CHANGSHENG_AGE_APPLICATION, SHENSHA_DEEP_MEANING, DAYUN_CHANGSHENG_NOTE, METAPHYSICS_CORE, PATTERN_SHUN_NI, THUONG_GUAN_5_TYPES, PATTERN_SUCCESS_FAIL, PATTERN_QUALITY_RANKING, YONGSHEN_VARIATION, LIUQIN_STAR, LIUQIN_PALACE, STAR_PALACE_RULES, LIUQIN_FALLBACK, LIUQIN_DAYUN_EFFECT, HEHUA_CONDITIONS, CHONG_XING_HAI_RULES, LUCK_INTERACTION_RULES, ZIWEI_14_STARS, SIHUA_MEANING, ZIWEI_LUCK_RULES, STAR_BRIGHTNESS_MEANING, LIAOFAN_4_LESSONS, TCM_HEALTH_DEEP, ZIWEI_AUX_STARS, ZIWEI_AUX_PRINCIPLES, TEN_GAN_DAYMASTER_PERSONALITY, WUXING_IMBALANCE_PERSONALITY, WUXING_PAIR_PERSONALITY, TEN_GOD_SPOUSE_DETAIL, DAYUN_HANDOVER_DETAIL, PATTERN_CHENG_BAI, XIANGSHEN_LAW, PATTERN_QUALITY_DEEP, JIXIONG_FANLI, ZAQI_TIANGAN_USE, YUEYAN_QUGE, YUEYAN_YONGSHEN, YUEYAN_GUANSHA, YUEYAN_META, BAZI_SCHOOL, SANMING_LIUQIN_FU, SANMING_SHENSHA_AXIOMS, SANMING_NV_BAFA, SANMING_NAYIN_XIJI, SANMING_TAISUI_RULES, SANMING_GANHE_HUAMEANING, MINGLI_CRITICAL_EVALUATION, MINGLI_HISTORY_LINEAGE, BAZI_FACTION_MAP, GUFA_MODEL, LUOLUZI_VERSES, JIUMING_SYSTEM, SHENTOU_LU_NAYIN, GUFA_LINEAGE, GUFA_NOBLE_BENJIA, NAYIN_WUYIN_THEORY, MANGPAI_GONGWEI_XIANG, MANGPAI_GANZHI_XIANG, MANGPAI_DAXIAN_YINGQI } from './kb.js';
import { SHENSHA_INFO } from './shensha.js';
import { analyzeLiunianDeep } from './liunian-pro.js';
import { analyze } from './chart.js'; // [loop 163 fix] analyze_partner tool cần analyze() để build lá số đối tác — trước đây thiếu import → tool báo "analyze is not defined" → AI KHÔNG trả lời được câu hợp tuổi/hôn nhân/kinh doanh
import { assessGufa, mangpaiKoujue, hetuReading } from './gufa-engine.js'; // [round 31] CO PHAP + [R39] 盲派金口诀 + [R40] 河图洛书
import { assessHuangji } from './huangji-engine.js'; // [round 34] 皇极经世 值年卦 (prophetic/cam ky)
import { assessTaiyi } from './taiyi-engine.js'; // [round 36] 太乙神数 (quoc van, tam thuc cam ky)
import { assessChenggu } from './chenggu-engine.js'; // [round 37] 袁天罡称骨算命 (bí truyền)
import { assessWuyunLiuqi } from './wuyun-liuqi.js'; // [round 42] 五运六气 (y-thiên văn cấm kị)
import { PENGZU_BAIJI } from './kb.js'; // [round 43] 彭祖百忌 (cấm kị dân gian)
import { analyzeKongwang } from './kongwang.js';
import { analyzePillarAges } from './pillar-age.js';
import { nayinInfo } from './nayin.js';
import { analyzeChangsheng } from './changsheng-deep.js';
import { computeLiuyue } from './liuyue.js';
import { analyzeLiuRi, findGoodDays } from './liuri.js';
import { dailyGuide } from './daily-guide.js'; // [loop 1102] directions (caishen/xishen/fushen) cho analyze_day
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
import { guiguziFortune } from './guiguzi.js'; // [loop 623] analyze_guiguzi tool — trước đây tool KHÔNG có case → AI gọi nhận error
import { guiguziFDG } from './guiguzi-fdg.js'; // [loop 623] 分定經 两头钳
import { compassReading, bestDirection } from './fengshui-compass.js'; // [loop 638] la bàn 24 sơn
import { bestGraveDirectionDeep, graveDirectionDeep } from './yinzhai-deep.js'; // [loop 638] Âm Trạch
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
import { scanBranchYingqi } from './yingqi-branch.js';
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
import { DAXIANG, GUA_CI, SIMP2TRAD } from './hexagram-meaning.js';
const SIMP2TRAD_REV = Object.fromEntries(Object.entries(SIMP2TRAD).map(([s, t]) => [t, s])); // trad→simp
import { liurenPan } from './liuren.js';
import { qimenDongPan, STAR_INFO, DOOR_INFO } from './qimen.js';
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
import { analyzeHealth, answerHealth, meridianClock, bodyConstitution, stageHealth, decadeHealthArc } from './tcm.js';
import { evaluateNumber, recommendNumbers } from './number-fs.js'; // [loop 1137/1141] số lý phong thủy
import { ANTI_MANIPULATION_DATA as _AM } from './anti-manipulation-data.js'; // [loop 1386] META anti-manipulate steering

// [loop 1386] META-steering injection: neo AI vào LÁ SỐ (data), chống false-premise / narrative
//   manipulation / sycophancy. Build 1 lần (static), inject vào system message #2 cùng brief.
//   Non-overlap với ai.js chart-data steering (xem anti-manipulation-data.js meta.existingAiJsHandled).
const _ANTI_MANIP_GUIDE = (() => {
  const L = [
    '== 🛡️ CHỐNG ĐÁNH LỪA / NEO LÁ SỐ (META — áp dụng MỌI câu) ==',
    '⚠ User CÓ THỂ khai sai / thử thầy / hỏi dẫn («vì Dụng tôi là Kim», «tôi sắp giàu», «kẻ thù tôi chết») để dụ AI tới kết luận họ muốn. Thầy đọc LÁ SỐ (data khách quan), KHÔNG đọc lời kể. Lá số không nói dối.',
    '▌GROUNDING (mọi kết luận PHẢI neo 1 indicator CÓ TÊN trong brief):',
  ];
  for (const r of _AM.groundingRules) L.push(`• ${r.id}: ${r.rule} → ${r.template}`);
  L.push('▌PERSONA «thầy» (độc lập, quyết đoán, KHÔNG nịnh):');
  for (const r of _AM.personaRules) L.push(`• ${r.rule}${r.viPhrase ? ' | ' + r.viPhrase : ''}`);
  L.push('▌PREMISE→INDICATOR (user nhúng tiền đề về lá số → RESTATE indicator THẬT trước khi luận, không nhận tiền đề sai làm gốc):');
  for (const [k, v] of Object.entries(_AM.premiseToIndicatorCrossCheck)) L.push(`• ${k}: ${v.restateTemplate}`);
  L.push('▌DETECTION (câu dẫn/lừa thường gặp — CẢNH GIÁC, không hard-gate):');
  for (const p of _AM.detectionPatterns) L.push(`• ${p.id}: ${p.signal}`);
  L.push('▌ESCALATION (thang xử lý khi trigger):');
  for (const s of _AM.escalationLadder) L.push(`• B${s.step} ${s.id}: ${s.policy}`);
  L.push('▌REFUSAL boundary (HẸP — carve-out; ai.js nguyên tắc 1 «TUYỆT ĐỐI KHÔNG TỪ CHỐI» vẫn giữ cho câu Dịch học):');
  for (const b of _AM.refusalBoundaries) L.push(`• ${b.id}: ${b.boundary}`);
  L.push('▌KHÔNG OVER-REFUSE (vẫn trả lời đầy đủ các case này):');
  for (const d of _AM.doNotOverRefuse) L.push(`• ${d.pattern} → ${d.mustDo}`);
  L.push('CỐT LÕI: neo lá số + thấu cảm ngắn (≤1 câu) + quay lại data. KHÔNG bị lời kể dẫn. KHÔNG trở nên cứng nhắc / từ chối user thật.');
  return L.join('\n');
})();

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
  { id: 'zai-coding', label: 'Z.ai — GLM Coding Plan (glm-5.2) [proxy]', endpoint: '/zai/api/coding/paas/v4', model: 'glm-5.2',
    note: 'Endpoint Coding Plan — đi qua proxy /zai (cùng-origin, tránh CORS). Chạy được cả dev (Vite proxy) LẪN production (Cloudflare /zai). Dùng API key gói Coding Plan. [loop 1186 FIX: trước đây gọi thẳng api.z.ai → CORS chặn web].' },
  { id: 'cf-glm', label: '★ Cloudflare Workers AI — GLM-5.2 [proxy]', endpoint: '/cf-ai/client/v4/accounts/bc101a2962ca21a084172c5334ad7dad/ai/v1', model: '@cf/zai-org/glm-5.2',
    note: 'Cloudflare Workers AI chạy GLM-5.2. Đi qua proxy /cf-ai (cùng-origin) — tránh CORS. Dùng Cloudflare API Token làm key.' },
  { id: 'nvidia-glm', label: '★ NVIDIA NIM — GLM-5.2 [proxy, free 5000 credit]', endpoint: '/nvidia/v1', model: 'z-ai/glm-5.2',
    note: 'NVIDIA NIM chạy GLM-5.2 (cùng model, infra NVIDIA nhanh/ổn + tool-use + reasoning). Lấy key FREE ở build.nvidia.com/settings/api-keys (tài khoản NVIDIA free, 5000 credit + 40 RPM). Đi qua proxy /nvidia — tránh CORS.' },
  { id: 'groq', label: '★ Groq — llama-3.3-70b [proxy, FREE + cực nhanh 0.3s]', endpoint: '/groq/openai/v1', model: 'llama-3.3-70b-versatile',
    note: 'Groq (LPU) — nhanh nhất (TTFT 0.3s, gấp 100× NVIDIA). Free tier. Lấy key ở console.groq.com/keys. Models: llama-3.3-70b-versatile, openai/gpt-oss-120b (reasoning), qwen/qwen3-32b. Đi qua proxy /groq.' },
  { id: 'bigmodel', label: 'BigModel (智谱 glm-4.6)', endpoint: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4.6', note: 'CORS sẽ chặn từ web — cần backend/proxy.' },
  { id: 'deepseek', label: 'DeepSeek', endpoint: 'https://api.deepseek.com/v1', model: 'deepseek-chat', note: 'CORS sẽ chặn từ web — cần backend/proxy.' },
  { id: 'openai', label: 'OpenAI', endpoint: 'https://api.openai.com/v1', model: 'gpt-4o-mini', note: 'CORS sẽ chặn từ web — cần backend/proxy.' },
  { id: 'ollama', label: 'Ollama (cục bộ, không cần key)', endpoint: 'http://localhost:11434/v1', model: 'qwen2.5', note: 'Chạy Ollama local + đặt OLLAMA_ORIGINS=* để trình duyệt gọi được.' },
  { id: 'custom', label: 'Tùy chỉnh', endpoint: '', model: '', note: '' },
];

export function getConfig() {
  let cfg = null;
  try {
    const raw = (typeof localStorage !== 'undefined') ? localStorage.getItem(CFG_KEY) : null;
    if (raw) cfg = JSON.parse(raw);
  } catch (e) {}
  // [loop 1186 FIX] migrate endpoint Z.ai THẲNG (CORS-block trên web) → proxy /zai (cùng-origin).
  //   Trước đây preset zai-coding/zai-general lưu https://api.z.ai/... → trình duyệt chặn CORS.
  //   /zai proxy forward đúng tới api.z.ai (cả Vite dev LẪN Cloudflare worker production).
  if (cfg && typeof cfg.endpoint === 'string' && /^https?:\/\/api\.z\.ai\//.test(cfg.endpoint)) {
    cfg.endpoint = cfg.endpoint.replace(/^https?:\/\/api\.z\.ai\//, '/zai/');
  }
  if (cfg) {
    // [loop 1387 FIX BUG SIÊU NGHIÊM TRỌNG] heal cfg hỏng: enabled nhưng THIẾU endpoint/model
    //   (do bug main.js PRESETS['cf-glm'] từng set {enabled:true}) → isAIReady FALSE → AI toàn
    //   local fallback («Trợ lý cục bộ») → khách rời. Tự sửa + persist cho user đã stuck.
    if (cfg.enabled && (!cfg.endpoint || !cfg.model)) {
      const _cf = PRESETS.find((p) => p.id === 'cf-glm') || PRESETS[0];
      cfg = { enabled: true, endpoint: _cf.endpoint, apiKey: '', model: _cf.model, preset: 'cf-glm' };
      try { if (typeof localStorage !== 'undefined') localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch (e) {}
    }
    return cfg;
  }
  // [loop 903] Mặc định: Cloudflare Workers AI GLM-5.2 (proxy /cf-ai — chạy trên worker cùng origin).
  // [loop 905] enabled: true — key nhúng server-side, user KHÔNG cần nhập gì.
  const cfPreset = PRESETS.find((p) => p.id === 'cf-glm') || PRESETS[0];
  return { enabled: true, endpoint: cfPreset.endpoint, apiKey: '', model: cfPreset.model, preset: 'cf-glm' };
}
export function setConfig(cfg) {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch (e) {}
  return cfg;
}
export function isAIReady(cfg) {
  cfg = cfg || getConfig();
  // [loop 905] cf-glm: key nhúng server-side → KHÔNG cần apiKey
  const isCfNoKey = cfg.preset === 'cf-glm'; // worker inject key
  return !!(cfg.enabled && cfg.endpoint && cfg.model && (isCfNoKey || cfg.apiKey));
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
    .map(([k, v]) => { const i = SHENSHA_INFO[k]; return `${i ? i.vi + '(' + i.zh + ')' : k}@${v.at.join('/')}${i ? ' — ' + i.desc : ''}`; }).join(', ') || 'không nổi' : 'không';

  const dayunStr = (R.dayun || []).slice(0, 8)
    .map((d) => {
      const tags = [];
      if (d.gejuDelta > 0) tags.push('★格局喜');
      if (d.gejuDelta < 0) tags.push('⚠格局忌');
      if (d.gejuRescue) tags.push('★RESCUES');
      if (d.gejuWorsen) tags.push('⚠WORSENS');
      if (d.clashType === '天克地冲') tags.push(d.clashMitigated ? '⚡天克地冲(mangDụng→đổithayCÓLỢI)' : '⚡天克地冲(đạiLoạn)');
      else if (d.clashType === '地冲') tags.push('⚡地冲(biếnĐộng)');
      else if (d.clashType === '伏吟') tags.push('⚡伏吟(trùPhúc)');
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
⭐ TÓM TẮT MỆNH: ${(() => { try {
  const _age = curYear - R.chart.input.year;
  const _dy = (R.dayun || []).find((d) => _age >= d.startAge && _age < d.startAge + 10);
  let _gy = ''; try { const g = findGoldenYear(R, curYear, 10); const tg = (g.ranked || []).filter((r) => r.isTrulyGolden).map((r) => r.year); if (tg.length) _gy = `, năm vàng ${tg.join('/')}`; } catch (_) {}
  const _qy = (R.dayun || [])[0]?.startAge;
  return `Nhật Chủ ${dm.vi} (${R.strength?.strong ? 'vượng' : 'nhược'}), Dụng ${wxVi(R.yong.primary)}${R.yong.tiaohou?.override ? ' (调候)' : ''}, điểm ${R.synthesis?.score ?? '?'}/100 (${R.synthesis?.gradeVi ?? '?'}${R.synthesis?.percentile ? ', cao hơn ' + R.synthesis.percentile + '% lá số' : ''})${_qy ? `, 起运 ${_qy}t` : ''}${_dy ? `, đại vận ${_dy.ganZhi}[${_dy.rating}]` : ''}${_gy}.`;
} catch (_) { return '(đang tính)'; } })()}
- Nhật Chủ (日主): ${dm.gan} ${dm.vi} — hành ${wxVi(dm.wx)} ${dm.yin ? '(âm)' : '(dương)'}
- BẢN MỆNH HÀM 演禽 (28 túc con-vật-tinh, như con giáp 28-fold): ${(() => { try { return analyzeYanQin(R).summary; } catch (e) { return '(không tính được)'; } })()}
- 禽星 NĂN ${curYear} (annual bird rotation — con vật tinh trụ trị năm nay, feng shui timing): ${(() => { try { return qinxingOverview(R, curYear).summary; } catch (e) { return '(không tính được)'; } })()}
- 滴天髓 luận ${dm.gan}: ${DITIANSUI[dm.gan].verse} → ${DITIANSUI[dm.gan].nature}
- «何知章» (滴天髓 chẩn đoán — verse + tiêu chí): ${Object.entries(DITIANSUI_HEZHI).map(([k, e]) => `${k}「${e.verse}」→${e.criterion}`).join(' | ')}
- «通論» (滴天髓 nguyên lý + cách áp dụng): ${Object.entries(DITIANSUI_TONGLUN).map(([k, e]) => `${k}「${e.verse}」→${e.cue || e.apply.split('.')[0]}`).join(' | ')}
- «取用神» (子平真詮 5 pháp): ${Object.entries(YONGSHEN_METHOD).map(([k, e]) => `${k}(${e.vi})`).join('; ')} — giải thích VÌ SAO R.yong được chọn.
- «用神 bất khả» (滴天髓阐微 知命章): ${ZIPING_YONG_MAXIM.protect} | NGƯỢC: ${ZIPING_YONG_MAXIM.inverse}.
- «五言独步» (渊海子平): 「${WUYAN_DUBU['病药'].verse}」— 有病=有忌神 phá cách, 去病=dụng thần trừ kỵ → tài lộc đến.
- «八格» 用神/喜忌 (子平真诠): ${R.pattern && PATTERN_DEEP[R.pattern.name] ? `${R.pattern.name}: dụng=${PATTERN_DEEP[R.pattern.name].yong}, hỷ=${PATTERN_DEEP[R.pattern.name].xiang}, kỵ=${PATTERN_DEEP[R.pattern.name].ji}` : '(cách không trong PATTERN_DEEP)'}
- «六神» phân cấp: ${Object.entries(SHEN_HIERARCHY).map(([k, e]) => `${k}=${e.role}`).join('; ')}
- «调候» nguyên lý (窮通寶鑑): ${R.yong?.tiaohou?.override ? `override → ${R.yong.tiaohou.override}` : '(theo vượng suy chuẩn)'} | ${TIAOHOU_PRINCIPLE.jianlu}
- «继善篇» (渊海子平 卷二): 「${JISHAN_PIAN['月令'].verse}」— ${JISHAN_PIAN['日主'].apply}
- «伤官» 5 dụng pháp (任铁樵): ${Object.entries(SHANGGUAN_5YONG).map(([k, e]) => `${k}(${e.condition})`).join('; ')}
- «十神 chuyên luận» (滴天髓阐微 官杀混杂/伤官/清浊/真假): ${Object.entries(DITIANSUI_SHISHEN).map(([k, e]) => `${k}「${e.verse}」→${e.cue || e.apply.split('.')[0]}`).join(' | ')}
- «十神 bản chất» (TEN_GOD_DEEP — chỉ các sao CÓ MẶT trong lá số): ${(() => { const g = new Set(); for (const pos of ['year','month','day','time']) { const pl = c.pillars[pos]; if (pl.ganGod) g.add(pl.ganGod); (pl.hidden||[]).forEach(h => { if (h.god) g.add(h.god); }); } return [...g].filter(x => TEN_GOD_DEEP[x]).map(x => `${x}(${TEN_GOD_DEEP[x].vi}): ${TEN_GOD_DEEP[x].nature} [lĩnh vực: ${TEN_GOD_DEEP[x].areas}]`).join('; '); })()}
- «Lĩnh vực cuộc sống» (LIFE_AREA_INDEX — quy tắc chủ mỗi lĩnh vực): ${Object.entries(LIFE_AREA_INDEX).map(([k, e]) => `${e.title}→${e.focus}`).join('; ')}
- «Cách cục hướng dẫn» (PATTERN_GUIDE — định hướng sự nghiệp/đời sống cho cách cục này): ${R.pattern && PATTERN_GUIDE[R.pattern.name] ? PATTERN_GUIDE[R.pattern.name] : '(cách không có guide)'}
- «Tương tác can chi» (INTERACTION_MEANING — ý nghĩa hợp/xung/hình/hại): ${Object.entries(INTERACTION_MEANING).map(([k, e]) => `${k}→${String(e).split('.')[0]}`).join('; ')}
- Giới tính: ${c.input.gender} | Dương lịch: ${c.solar}
- Tiết khí gần nhất: ${c.jieqi.prev.name}

TỨ TRỤ:
${pillars}
- «Chất lượng trụ» (R.pillarQuality — 盖头/截脚/干生支, can-chi tương quan mỗi trụ): ${(() => { const pp = R.pillarQuality && R.pillarQuality.perPillar; if (!pp) return '(không tính)'; const pv = { year: 'Năm', month: 'Tháng', day: 'Ngày', time: 'Giờ' }; return Object.entries(pp).map(([pos, p]) => `${pv[pos] || pos}:${p.vi || p.type || '?'}${p.flow < 0 ? '⚠' : (p.flow > 0 ? '✓' : '')}${p.impact ? '(' + p.impact + ')' : ''}`).join('; '); })()}

VƯỢNG SUY: ${R.strength.level} (tỉ lệ phù trợ thân ${(R.strength.ratio * 100).toFixed(1)}%${R.strength.sanFaBonus > 0 ? ` → hiệu dụng ${(R.strength.effRatio * 100).toFixed(1)}% do 得令/得地 (cổ法 «得令者旺» cộng +${R.strength.sanFaBonus})` : ''}, ${R.strength.deLenh ? 'đắc lệnh' : 'thất lệnh'}${R.strength.qiPhase ? ` (${R.strength.qiPhase})` : ''}${R.strength.deDia ? ' + đắc địa (thông căn)' : ''})
WHY VƯỢNG SUY 得令/得地/得势 3 pháp (mạnh nhờ lệnh/địa/thế hay nhờ Ấn?): ${(() => { try { return strength3Fa(R).summary; } catch (e) { return '(không tính được)'; } })()}

NGŨ HÀNH: ${wx}
- «源流» (R.yuanliu — nguồn + dòng ngũ hành của lá số): ${R.yuanliu ? `nguồn=${wxVi(R.yuanliu.source)} | dòng ${(R.yuanliu.chain || []).map((c) => wxVi(c.wx) + ' ' + Math.round((c.pct || 0) * 100) + '%').join('→')} | khuyết(gap)=${R.yuanliu.gap ? wxVi(R.yuanliu.gap) : '(đủ 5 hành — lưu thông)'} | 归宿=${wxVi(R.yuanliu.endpoint)} | ảnh hưởng ${R.yuanliu.aspectKey}${R.yuanliu.verdict ? ' · ' + R.yuanliu.verdict : ''}` : '(không tính)'}

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
XUNG/HỢP CHI ỨNG KỲ (năm nào sao ẨN trong địa chi bẩm sinh bị lưu niên XUNG mở kho / HỢP kéo ra → phát lực): ${(() => { try { return scanBranchYingqi(R, curYear, 12).summary; } catch (e) { return '(không tính được)'; } })()}

HỘI – HỢP – XUNG – HÌNH – HẠI: ${(() => { const I = R.interactions || {}; const out = []; for (const t of ['ganHe','ganChong','zhiHe','sanHe','banHe','sanHui','chong','xing','hai']) (I[t]||[]).forEach(e => out.push(`${e.vi||e.name||t} ${(e.a&&e.b)?e.a+'-'+e.b:''}${e.at?'@'+e.at:''}${e.meaning?' — '+e.meaning:''}`)); return out.length ? out.join('; ') : (I.summary||'không có'); })()}

CHẤT LƯỢNG TRỤ 盖头截脚 (can-chi có khắc-nhau trong trụ không — đọc "sao hay vấp"):
${(() => { try { return analyzePillarQuality(R).summary; } catch (e) { return '(không tính được)'; } })()}

THẦN SÁT: ${shenshaList}

LỤC THÂN (cung vị + tinh): ${(R.liuqin || []).map((l) => `${l.relVi}(${l.mainStar || '-'}, cung ${l.palaceGod}${l.stable ? '' : ', xung'}): ${l.verdict || ''}`).join('; ') || '(không)'}

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
ĐÔNG Y / DƯỢC LÝ (中医): khi user hỏi sức khoẻ theo đông y — «thủ dâm/sinh lý/thận», «căng thẳng/đau đầu/can hoả», «tiêu hoá/tỳ vị», «tạng nào yếu/nên ăn gì», «bị X nên làm sao», «mỏi mắt», «trào ngược», «bướu cổ», «lão hóa da» — GỌI TOOL: health_q (câu hỏi cụ thể → cơ sở bệnh/lời khuyên đông y + cá nhân hoá theo ngũ hành lá số; KẾT QUẢ CÓ otherMatches — gợi ý user xem thêm conditions liên quan) HOẶC health_profile (profile tạng hư/thực từ ngũ hành vượng suy + thực疗 + DECADE ARC sức khoẻ dọc đời). NẾU user hỏi theo THỜI GIAN («hôm nay sức khoẻ sao», «này tạng nào yếu», «sinh khí hôm nay») → GỌI health_today (đông-y THEO NGÀY: 十二长生 sinh khí hôm nay → tạng THỊNH/SUY + kinh mạch giờ); («năm nay/sắp tới sức khoẻ», «năm nào yếu») → analyze_year (yearHealthTheme: tạng theo năm); («giờ này tạng/khoe nào đỉnh», «kinh mạch giờ», «nên làm gì giờ này», «sao phải ngủ trước 23h») → health_hour (子午流注: kinh mạch khí huyết đỉnh theo giờ). KHÔNG bịa bệnh/thuốc — chỉ trả lời từ tool.
📊 BIỂU ĐỒ VẬN TRỤC (trang chính): 4 biểu đồ trực quan — 五行分布(ngũ hành %), 大運走勢(8 thập kỷ), 流年走勢(10 năm), 流月走勢(12 tháng). Khi user hỏi «vận sao», «năm nào tốt», «tháng nào nên làm» → gợi ý xem biểu đồ tương ứng + dùng dữ liệu từ tool analyze_year/analyze_month.
SỐ LÝ PHONG THỦY: khi user hỏi «số điện thoại X tốt không», «biển số xe», «số nhà/tầng», «chọn số gì hợp mệnh» → GỌI TOOL evaluate_number (truyền chuỗi số → đánh giá ngũ hành + 81 số lý + Dụng Thần match).

PHỤC/PHẢN NGÂM 伏吟反吟 (dùng trả lời "năm nào biến cố/sóng gió" — QUAN TRỌNG, phân biệt với vận thường):
${(() => { try { const n = natalFuyin(R); const y = scanFuyin(R, curYear); const d = dayunFuyin(R); const parts = []; if (n.items.length) parts.push('bẩm sinh: ' + n.items.map(i=>`${i.typeVi} ${i.pair}`).join(', ')); parts.push(`năm ${curYear}: ` + (y.items.length ? y.items.map(i=>`${i.typeVi} ${i.pillarVi}(cảnh báo ${i.severity>=7?'NẶNG':'trung'})`).join('; ') : 'không phạm')); if (d.items?.length) parts.push(`đại vận ${d.dayun}: ` + d.items.map(i=>`${i.typeVi} ${i.pillarVi}`).join(', ')); return parts.join(' | ') + '. Cổ quyết «反吟伏吟泪淋淋, 不伤自己损他人»: phạm = năm dễ buồn/hiểm/li tán, đặc biệt Nhật Trụ = bản thân+phối ngẫu; nếu hành trùng = Dụng/Hỷ thì hung giảm. LƯU Ý phân loại: Phản Ngâm (反吟, thiên khắc địa xung) NẶNG nhất; Phục Ngâm (伏吟, trùng cả can+chi) TRUNG — đình trệ; Chi Phục Ngâm (支伏吟, chỉ đồng địa chi) NHẸ — pattern lặp/đình trệ nhẹ, không đáng sợ bằng 2 loại trên.'; } catch (e) { return '(không tính được)'; } })()}

TỔNG LUẬN 1 CÂU (one-liner — dùng mở đầu câu trả lời tổng quát):
${(() => { try { return lifeReading(R).oneSentence; } catch (e) { return '(không tính được)'; } })()}

BỔ SUNG 5 TRƯỜNG PHÁI (称骨/12神/贵人/三世/盲派 — góc nhìn phụ, KHÔNG thay Tử Bình):
${(() => {
  const parts = [];
  // 称骨 (bone weight) — tổng trọng lượng + tầng
  try { const cg = chenggu(R); parts.push(`称骨: ${cg.totalStr} = ${cg.summary.tier}. ${cg.verse ? '«' + cg.verse + '»' : ''} ${(cg.interpretation || '').slice(0, 120)}`); } catch (e) { parts.push('称骨: (không tính được)'); }
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

  // ---- [research crawl] KIẾN THỨC CỔ PHÁP MỞ RỘNG ----
  try {
    const dmGan = c.dayMaster.gan || '';
    const monthZhi = c.pillars.month.zhi || '';
    const tiaohouKey = dmGan + monthZhi + '月';
    const tiaohou = QIONGTONG_TIAOHOU[tiaohouKey] || '(không có cổ quyết cụ thể)';
    const weakestWx = Object.entries(R.wx?.pct || {}).sort(([,a],[,b]) => a - b)[0];
    const healthInfo = weakestWx ? WUXING_HEALTH[weakestWx[0]] : null;
    const topGods = (typeof dominantGods === 'function') ? dominantGods(c) : [];
    const careerHint = topGods[0] ? (CAREER_BY_GOD[topGods[0].god] || []).join(', ') : '(không)';
    brief += "\n--- KIẾN THỨC CỔ PHÁP MỞ RỘNG (crawled) ---\n" +
      "穷通宝鉴 調候: " + tiaohou + "\n" +
      "滴天髓 CỔ QUYẾT (top 5): " + (DITIANSUI_MAXIMS || []).slice(0, 5).join(" | ") + "\n" +
      "三命通会 ĐẠI VẬN (top 5): " + (SANMING_DAYUN_RULES || []).slice(0, 5).join(" | ") + "\n" +
      "NGŨ HÀNH LUẬN BỆNH: " + (weakestWx ? weakestWx[0] + " (" + weakestWx[1] + "%)" : "?") + (healthInfo ? " > " + healthInfo.organs + " | " + healthInfo.symptoms + " | " + healthInfo.diet + " | " + healthInfo.emotion + " | " + healthInfo.remedy : "") + "\n" +
      "SỰ NGHIỆP: " + (topGods[0] ? topGods[0].vi : "?") + " > " + careerHint + "\n" +
      "ĐA TRƯỜNG PHÁI: " + Object.entries(DIVINATION_SCHOOLS).map(([k,v]) => k + ": " + v).join(" | ");
  } catch (e) { brief += "\n--- KIẾN THỨC CỔ PHÁP: [lỗi load] ---"; }

  // ---- [round 2 crawl] HÔN NHÂN + TÀI VẬN + QUÝ NHÂN ----
  try {
    const dayZhi = c.pillars.day.zhi || '';
    const spouseReading = SPOUSE_PALACE_READING[dayZhi] || null;
    const nobleChars = NOBLE_STAR_RULES[c.dayMaster.gan] || [];
    const hasNobleInChart = nobleChars.some(ch => Object.values(c.pillars).some(p => p.zhi === ch));
    const peachKey = Object.keys(PEACH_BLOSSOM_RULES).find(k => k.includes(c.pillars.year.zhi));
    const peachZhi = peachKey ? PEACH_BLOSSOM_RULES[peachKey] : '?';
    const dayZhiIsPeach = dayZhi === peachZhi.split(' ')[0];
    const currentDecade = phases => phases.find(p => p.isCurrent) || {};
    const ageRange = (() => { const a = new Date().getFullYear() - (c.input?.year || 1990); return `${Math.floor(a/10)*10+1}-${Math.floor(a/10)*10+10}t`; })();
    const decadeTheme = DECADE_LIFE_THEMES[ageRange] || '';
    brief += "\n--- HÔN NHÂN + TÀI VẬN + QUÝ NHÂN (round 2 crawl) ---\n" +
      "PHỐI NGẪU (日支=" + dayZhi + "): " + (spouseReading ? spouseReading.traits + " | Hôn nhân: " + spouseReading.marriage : "(không có dữ liệu)") + "\n" +
      "KẾT HÔN TIMING: " + MARRIAGE_TIMING_SIGNALS.slice(0, 4).join(" • ") + "\n" +
      "TÀI VẬN CẤP: xem thân cường/nhược + Tài vượng/suy + Tài khố (辰戌丑未) + đại vận Tài → phân cấp giàu/nghèo. " + WEALTH_TIERS.map(t => t.tier + "(" + t.level + ")").join(" / ") + "\n" +
      "TÀI KHỐ: " + (['辰','戌','丑','未'].includes(dayZhi) ? "Nhật Chi = " + dayZhi + " → " + (WEALTH_KU[dayZhi] ? WEALTH_KU[dayZhi].note : '') : "Nhật Chi không phải辰戌丑未") + "\n" +
      "QUÝ NHÂN 天乙: can " + c.dayMaster.gan + " → quý nhân tại " + nobleChars.join(", ") + ". Có trong lá số: " + (hasNobleInChart ? "CÓ ✓" : "không") + ". " + NOBLE_STAR_NOTE + "\n" +
      "ĐÀO HOA 桃花: " + peachZhi + (dayZhiIsPeach ? " (NHẬT CHI LÀ ĐÀO HOA → duyên bẩm sinh mạnh)" : "") + ". " + PEACH_NOTE + "\n" +
      "GIAI ĐOẠN ĐỜI " + ageRange + ": " + decadeTheme;
  } catch (e) { brief += "\n--- HÔN NHÂN + TÀI VẬN: [lỗi load] ---"; }

  // ---- [round 3] LƯU NIÊN CHI TIẾT + PHONG THỦY THỰC DỤNG + DƯỠNG SINH ----
  try {
    const dungWx = R.yong?.primary || '';
    const curYearGan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'][(_now.getFullYear() - 4) % 10];
    const curYearZhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][(_now.getFullYear() - 4) % 12];
    const ganEff = ANNUAL_GANZHI_EFFECT[curYearGan] || null;
    const zhiEff = ANNUAL_ZHI_EFFECT[curYearZhi] || null;
    const fs = FENGSHUI_PRACTICAL[dungWx] || null;
    const qg = QIGONG_BY_ELEMENT[dungWx] || null;
    brief += "\n--- LƯU NIÊN + PHONG THỦY + DƯỠNG SINH (round 3) ---\n" +
      "LƯU NIÊN " + _now.getFullYear() + " " + curYearGan + curYearZhi + ": can " + curYearGan + (ganEff ? " → " + ganEff.effect : '') + " | chi " + curYearZhi + (zhiEff ? " → " + zhiEff.effect : '') + "\n" +
      "PHONG THỦY DỤNG=" + (WX_VI[dungWx] || dungWx) + ": " + (fs ? "Hướng: " + fs.direction + " | Màu: " + fs.colors + " | Số: " + fs.numbers + " | Vật phẩm: " + fs.items + " | Tránh: " + fs.avoid + " | Mẹo: " + fs.tip : '(không)') + "\n" +
      "12 PHÁP CẢI VẬN: " + TWELVE_LUCK_METHODS.slice(0, 4).map(m => m.name).join(", ") + "... (hỏi chi tiết để nhận đầy đủ)\n" +
      "DƯỠNG SINH: " + (qg || '(không)');
  } catch (e) { brief += "\n--- LƯU NIÊN + PHONG THỦY: [lỗi load] ---"; }

  // ---- [round 4] 12 TRƯỜNG SINH + THẦN SÁT + HUYỀN HỌC CƠ BẢN ----
  try {
    const csInfo = (R.dayun || []).slice(0, 3).map(d => {
      const stage = d.stageVi || '?';
      const app = CHANGSHENG_AGE_APPLICATION[d.stage] || {};
      return stage + (app.best ? '(' + app.best + ')' : '');
    }).join(' → ');
    const shenshaKeys = R.shensha ? Object.keys(R.shensha).filter(k => SHENSHA_DEEP_MEANING[k]) : [];
    const shenshaDeep = shenshaKeys.map(k => k + '(' + (SHENSHA_DEEP_MEANING[k].vi || '') + '): ' + (SHENSHA_DEEP_MEANING[k].effect || '').slice(0, 100)).join(' | ');
    brief += "\n--- 12 TRƯỜNG SINH + THẦN SÁT NÂNG CAO (round 4) ---\n" +
      "ĐẠI VẬN 12 TRƯỜNG SINH (3 thập kỷ tới): " + csInfo + "\n" +
      "NGUYÊN TẮC: " + (DAYUN_CHANGSHENG_NOTE || []).slice(0, 3).join(' | ') + "\n" +
      "THẦN SÁT CHI TIẾT: " + (shenshaDeep || '(không có thần煞 sâu trong lá số)') + "\n" +
      "HUYỀN HỌC CƠ BẢN (triết lý để trả lời sâu): " + (METAPHYSICS_CORE || []).slice(0, 3).join(' | ');
  } catch (e) { brief += "\n--- 12 TRƯỜNG SINH + THẦN SÁT: [lỗi load] ---"; }

  // ---- [round 5] CÁCH CỤC THUẬN NGHỊCH + DỤNG THẦN BIẾN + CHẤT LƯỢNG CÁCH ----
  try {
    const patVi = R.pattern?.vi || R.synthesis?.gradeVi || '';
    const patZh = R.pattern?.zh || R.synthesis?.grade || '';
    const shunNi = patZh ? (PATTERN_SHUN_NI[patZh] || null) : null;
    const qualityRank = (PATTERN_QUALITY_RANKING || []).join(' / ');
    brief += "\n--- CÁCH CỤC THUẬN/NGHỊCH + DỤNG THẦN (round 5) ---\n" +
      "CÁCH CỤC " + patVi + "(" + patZh + "): " + (shunNi ? shunNi.type + " — Dụng: " + shunNi.yong + " | Hỷ: " + shunNi.hy.join(', ') + " | Kỵ: " + shunNi.ky.join(', ') + " | Cổ quyết: " + shunNi.note : '(không có trong bảng') + "\n" +
      "DỤNG THẦN BIẾN (子平真詮): " + (YONGSHEN_VARIATION || []).slice(0, 3).join(' ') + "\n" +
      "CHẤT LƯỢNG CÁCH (子平真詮 ch.8): " + qualityRank;
  } catch (e) { brief += "\n--- CÁCH CỤC: [lỗi load] ---"; }
  // ---- [round 6] LỤC THÂN 斷法 + CUNG VỊ + TINH CUNG PHỐI HỢP ----
  try {
    const isMale = c.input?.gender === 'nam';
    const lqStar = isMale ? LIUQIN_STAR.male : LIUQIN_STAR.female;
    brief += "\n--- LỤC THÂN 斷法 (round 6) ---\n" +
      "SAO LỤC THÂN: cha=" + lqStar.father + " | mẹ=" + lqStar.mother + " | " + (isMale ? "vợ=" + lqStar.wife : "chồng=" + lqStar.husband) + " | con=" + (isMale ? lqStar.sons : lqStar.sons) + " | anh chị em=" + lqStar.brothers + "\n" +
      "CUNG VỊ: Niên=" + LIUQIN_PALACE.year.represents + " | Nguyệt=" + LIUQIN_PALACE.month.represents + " | Nhật Chi=" + LIUQIN_PALACE.day.represents + " | Thời=" + LIUQIN_PALACE.time.represents + "\n" +
      "TINH-CUNG PHỐI HỢP: " + (STAR_PALACE_RULES || []).slice(0, 3).join(' | ') + "\n" +
      "BIẾN THÔNG (sao không có): " + (LIUQIN_FALLBACK || []).slice(0, 3).join(' | ') + "\n" +
      "ĐẠI VẬN TÁC ĐỘNG LỤC THÂN: " + (LIUQIN_DAYUN_EFFECT || []).slice(0, 3).join(' | ');
  } catch (e) { brief += "\n--- LỤC THÂN: [lỗi load] ---"; }

  if (fcParts.length) {
    brief += '\n--- DỰ BÁO & THỜI ĐIỂM ---\n' + fcParts.join('\n');
  }

  // ---- [round 7] HỢP HÓA + XUNG HÌNH HẠI + TAM TẦNG TƯƠNG TÁC ----
  try {
    brief += "\n--- CAN CHI TƯƠNG TÁC (round 7) ---\n" +
      "HỢP HÓA: " + (HEHUA_CONDITIONS || []).slice(0, 4).join(' | ') + "\n" +
      "XUNG/HÌNH/HẠI: " + (CHONG_XING_HAI_RULES || []).slice(0, 4).join(' | ') + "\n" +
      "TAM TẦNG (君臣民): " + (LUCK_INTERACTION_RULES || []).slice(0, 5).join(' | ');
  } catch (e) { brief += "\n--- CAN CHI TƯƠNG TÁC: [lỗi load] ---"; }

  // ---- [round 8] TỬ VI 14 CHÍNH TINH + TỨ HÓA + MIẾU VƯỢNG ----
  try {
    const zr = computeZiwei(c.input.year, c.input.month, c.input.day, c.input.hour, c.input.minute, c.input.gender);
    const mingStar = zr.palaces?.find(p => p.name === 'Mệnh')?.mainStar || '?';
    const starInfo = ZIWEI_14_STARS[mingStar] || null;
    brief += "\n--- TỬ VI 14 CHÍNH TINH + TỨ HÓA (round 8) ---\n" +
      "MỆNH CUNG chính tinh: " + mingStar + (starInfo ? " → " + starInfo.vi + " (" + starInfo.type + ") | Tính cách: " + starInfo.personality + " | Sự nghiệp: " + starInfo.career : '') + "\n" +
      "TỨ HÓA: " + Object.entries(SIHUA_MEANING || {}).map(([k,v]) => k + '=' + v.vi + '(' + v.effect.slice(0, 60) + ')').join(' | ') + "\n" +
      "ĐẠI HẠN/LƯU NIÊN TỬ VI: " + (ZIWEI_LUCK_RULES || []).slice(0, 4).join(' | ') + "\n" +
      "MIẾU VƯỢNG BÌNH HÃM: " + Object.entries(STAR_BRIGHTNESS_MEANING || {}).map(([k,v]) => k + '=' + v.vi + '(' + v.effect.slice(0, 40) + ')').join(' | ');
  } catch (e) { brief += "\n--- TỬ VI 14 TINH: [lỗi load] ---"; }

  // ---- [round 9] LIÊU PHÀM + TCM NGŨ HÀNH LUẬN BỆNH SÂU ----
  try {
    const weakestWx9 = Object.entries(R.wx?.pct || {}).sort(([,a],[,b]) => a - b)[0];
    const tcmDeep = weakestWx9 ? (TCM_HEALTH_DEEP[weakestWx9[0] === '木' ? 'Moc' : weakestWx9[0] === '火' ? 'Hoa' : weakestWx9[0] === '土' ? 'Tho' : weakestWx9[0] === '金' ? 'Kim' : 'Thuy'] || null) : null;
    brief += "\n--- LIÊU PHÀM + TCM LUẬN BỆNH (round 9) ---\n" +
      "LIÊU PHÀM 4 HUẤN: " + (LIAOFAN_4_LESSONS?.LapMenh?.summary || 'mệnh không cố định, tích đức cải vận') + " | " + (LIAOFAN_4_LESSONS?.TichThien?.summary || '') + "\n" +
      "TCM SÂU: hành yếu nhất " + (weakestWx9 ? weakestWx9[0] + '(' + weakestWx9[1] + '%)' : '?') + (tcmDeep ? " -> " + tcmDeep.organ + " | bệnh lý: " + tcmDeep.pathology + " | thảo dược: " + tcmDeep.herb + " | cảm xúc hại: " + tcmDeep.emotion + " | kinh mạch: " + tcmDeep.meridian + " | mùa: " + tcmDeep.season : '');
  } catch (e) { brief += "\n--- LIÊU PHÀM + TCM: [lỗi load] ---"; }

  // ---- [round 10] TỬ VI LỤC CÁT/LỤC SÁT TINH ----
  try {
    const auxInChart = Object.entries(ZIWEI_AUX_STARS || {}).filter(([k]) => {
      try { const zr2 = computeZiwei(c.input.year, c.input.month, c.input.day, c.input.hour, c.input.minute, c.input.gender); return zr2?.palaces?.some(p => p.stars?.includes(k)); } catch(_) { return false; }
    }).map(([k,v]) => k + '(' + v.vi + ')');
    brief += "\n--- TỬ VI LỤC CÁT/LỤC SÁT TINH (round 10) ---\n" +
      "LỤC CÁT (Ta Phụ/Hữu Bật/Văn Xương/Văn Khúc/Thiên Khôi/Thiên Việt) + LỤC SÁT (Kình Dương/Đà La/Hỏa Tinh/Linh Tinh/Địa Không/Địa Kiếp) trong lá số: " + (auxInChart.length ? auxInChart.join(', ') : '(kiểm tra tử vi tính để biết)') + "\n" +
      "NGUYÊN TẮC: " + (ZIWEI_AUX_PRINCIPLES || []).slice(0, 3).join(' | ');
  } catch (e) { brief += "\n--- LỤC CÁT/SÁT: [lỗi load] ---"; }

  // ---- [round 21] NGŨ HÀNH NHÂN CÁCH SÂU (10 can nhật chủ) + THẬP THẦN PHỐI NGẪU + ĐẠI VẬN GIAO TẾP ----
  try {
    const dm = c.dayMaster?.gan || '';
    const dmP = TEN_GAN_DAYMASTER_PERSONALITY[dm];
    const wxEntries = Object.entries(R.wx?.pct || {}).sort(([, a], [, b]) => b - a);
    const domWx = wxEntries[0]?.[0] || '';
    const weakWx = wxEntries[wxEntries.length - 1]?.[0] || '';
    const domImb = WUXING_IMBALANCE_PERSONALITY[domWx];
    const weakImb = WUXING_IMBALANCE_PERSONALITY[weakWx];
    const dayHidden0 = c.pillars?.day?.hidden?.[0];
    const palaceGod = dayHidden0?.god || '';
    const palaceSpouse = TEN_GOD_SPOUSE_DETAIL?.palaceByGod?.gods?.[palaceGod];
    const qiyun = DAYUN_HANDOVER_DETAIL?.qiyun;
    // Sắp xếp 2 hành nổi bật theo thứ tự Mộc→Hỏa→Thổ→Kim→Thủy để khớp key của WUXING_PAIR_PERSONALITY
    const wxOrder = ['木', '火', '土', '金', '水'];
    const pairKey = domWx && wxEntries[1]?.[0] ? [domWx, wxEntries[1][0]].sort((x, y) => wxOrder.indexOf(x) - wxOrder.indexOf(y)).join('') : '';
    brief += "\n--- NGŨ HÀNH NHÂN CÁCH SÂU + PHỐI NGẪU + GIAO VẬN (round 21) ---\n" +
      "NHẬT CHỦ " + dm + (dmP ? "(" + dmP.vi + " · " + dmP.xiang + "): " + dmP.nature + " | Mạnh: " + dmP.strengths.join(", ") + " | Yếu: " + dmP.weaknesses.join(", ") + " | Bí: " + dmP.secret : "(—)") + "\n" +
      "HÀNH CHỦ ĐẠO " + (WX_VI[domWx] || domWx) + (domImb ? " → quá mạnh: " + domImb.tooMuch + " | quá yếu: " + domImb.tooLittle : "") + "\n" +
      "HÀNH YẾU NHẤT " + (WX_VI[weakWx] || weakWx) + (weakImb ? " → cần bồi (quá yếu biểu hiện: " + weakImb.tooLittle + ")" : "") + "\n" +
      (WUXING_PAIR_PERSONALITY[pairKey] ? "TÍNH CÁCH KẾT HỢP " + pairKey + ": " + WUXING_PAIR_PERSONALITY[pairKey] + "\n" : "") +
      "CUNG PHỐI NGẪU (Nhật Chi bản khí " + (dayHidden0?.gan || '?') + " = " + (TEN_GOD_VI[palaceGod] || palaceGod || '?') + ")" + (palaceSpouse ? ": " + palaceSpouse.spouse : "") + ". " + (TEN_GOD_SPOUSE_DETAIL?.spouseStar?.rule || '') + "\n" +
      "KHỞI VẬN " + (qiyun ? "(3 ngày = 1 tuổi) " + qiyun.direction + " | " + qiyun.ageCalc : '?') + "\n" +
      "GIAO VẬN " + (DAYUN_HANDOVER_DETAIL?.jiaoyun?.what || '') + " → " + (DAYUN_HANDOVER_DETAIL?.jiaoyun?.taboo || []).slice(0, 2).join("; ");
  } catch (e) { brief += "\n--- ROUND 21: [lỗi load] ---"; }

  // ---- [round 22] TỬ BÌNH CHÂN THUYỀN — CÁCH CỤC ĐỘ SÂU (thành/bại/cứu ứng + tương thần + đảo luận) ----
  try {
    const patName = R.pattern?.name || '';
    const cb = PATTERN_CHENG_BAI[patName];
    const monthZhi = c.pillars?.month?.zhi || '';
    const isZaqi = ['辰','戌','丑','未'].includes(monthZhi);
    const zaqiInfo = isZaqi ? ZAQI_TIANGAN_USE[monthZhi] : null;
    brief += "\n--- TỬ BÌNH CHÂN THUYỀN: CÁCH CỤC ĐỘ SÂU (round 22) ---\n" +
      "THÀNH/BẠI/CỨU ỨNG cổ pháp (" + patName + "): " + (cb ? "✓Thành khi: " + cb.cheng.join('; ') + " | ✗Bại khi: " + cb.bai.join('; ') + (cb.jiu.jiu?.length ? " | Cứu ứng: " + cb.jiu.jiu.join('; ') : '') : "(cách không trong 8 chính cách — xem đặc biệt/ngoại cách)") + "\n" +
      "TƯƠNG THẦN (ch.15): " + XIANGSHEN_LAW.decisive.slice(0, 2).join(' | ') + "\n" +
      "CHẤT LƯỢNG CÁCH (2-trục Tình×Lực): " + PATTERN_QUALITY_DEEP.highest + " | " + PATTERN_QUALITY_DEEP.lowLi + "\n" +
      "ĐẢO LUẬN 吉凶 (ch.18/19): 4吉 thần cũng PHÁ cách, 4凶 thần cũng THÀNH cách — " + JIXIONG_FANLI.principle + "\n" +
      (zaqiInfo ? "TẠP KHÍ 月令=" + monthZhi + ": " + zaqiInfo.principle + " | " + (zaqiInfo.mainQi ? "Bản khí=" + zaqiInfo.mainQi + ", tàng=" + (zaqiInfo.hidden || '?') : zaqiInfo.note) : "THUẬN/NGHỊCH DỤNG: thiện thần (tài/quan/ấn/thực) thuận=sinh phù+hộ vệ; bất thiện (sát/thương/khiếu/nhận) nghịch=chế phục+hóa giải");
  } catch (e) { brief += "\n--- ROUND 22: [lỗi load] ---"; }

  // ---- [round 23] MỆNH LÝ ƯỚC NGÔN (陈素庵) — chuẩn hóa + BAZI_SCHOOL toggle ----
  try {
    const allGods = new Set();
    for (const pos of ['year', 'month', 'day', 'time']) {
      const pl = c.pillars[pos];
      if (pl.ganGod) allGods.add(pl.ganGod);
      (pl.hidden || []).forEach(h => { if (h.god) allGods.add(h.god); });
    }
    const hasGuanSha = allGods.has('正官') && allGods.has('七杀');
    const guanshaCase = hasGuanSha ? Object.entries(YUEYAN_GUANSHA.cases).map(([k, v]) => v.vi).join(' | ') : '';
    brief += "\n--- MỆNH LÝ ƯỚC NGÔN (陈素庵) + TRƯỜNG PHÁI (round 23) ---\n" +
      "TRƯỜNG PHÁI hiện tại: " + (BAZI_SCHOOL.current) + " — " + (BAZI_SCHOOL.options[BAZI_SCHOOL.current]?.label || '') + ". Lưu ý: có thể toggle (xem BAZI_SCHOOL).\n" +
      "LẤY CÁCH (Ước Ngôn thang 4 bậc): " + YUEYAN_QUGE.ladder.slice(1, 4).join(' → ') + " | " + YUEYAN_QUGE.rule + "\n" +
      "DỤNG THẦN (Ước Ngôn đệ quy): " + YUEYAN_YONGSHEN.weak + "\n" +
      (hasGuanSha ? "QUAN-SÁT ĐI/LƯU (chính quan + thất sát cùng có): " + guanshaCase + "\n" : "") +
      "ĐẠI VẬN cổ pháp: " + YUEYAN_META.dayun.vi + "\n" +
      "THẦN SÁT/ NẠP ÂM (Ước Ngôn): " + YUEYAN_META.shensha.stance + " | " + YUEYAN_META.nayin.stance + "\n" +
      "ÂM-DƯƠNG ĐỒNG SINH ĐỒNG TỬ (FLAG): " + YUEYAN_META.yinYangTongSheng.vi + " → " + YUEYAN_META.yinYangTongSheng.flag;
  } catch (e) { brief += "\n--- ROUND 23: [lỗi load] ---"; }

  // ---- [round 24] TAM MỆNH THÔNG HỘI (万民英) — lục thân phú + thần sát nguyên tắc + nạp âm hỉ kỵ ----
  try {
    const gender = c.input?.gender || 'male';
    const dayNayin = c.pillars?.day?.nayin || '';
    const nayinInfo = SANMING_NAYIN_XIJI[dayNayin] || (dayNayin ? Object.values(SANMING_NAYIN_XIJI).find(v => dayNayin.includes(Object.keys(SANMING_NAYIN_XIJI).find(k => dayNayin.includes(k)))) : null);
    const isFemale = gender === 'female' || gender === 'nu' || gender === '女';
    // LOGIC SÂU: thái tuế (lưu niên can) ↔ nhật can → mức độ họa theo 卷二 「tuế thương nhat can hoă nhe, nhat pham tuoi quan tai nang」
    const taisuiVerdict = (() => {
      try {
        const dmGan = c.dayMaster?.gan;
        if (!dmGan) return '';
        const yearGan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'][(_now.getFullYear() - 4) % 10];
        const wxOf = g => ({甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'})[g];
        const kePairs = {木:'土',土:'水',水:'火',火:'金',金:'木'};
        const a = wxOf(yearGan), b = wxOf(dmGan);
        if (a === b) return `Năm ${_now.getFullYear()} (${yearGan}) ↔ nhật ${dmGan}: CÙNG HÀNH (${a}) → trung tính.`;
        if (kePairs[a] === b) return `Năm ${_now.getFullYear()} (${yearGan}) KHẮC nhật ${dmGan} (${a}→${b}) = 「TUẾ THƯƠNG NHẬT CAN」→ họa NHẸ (trên trị dưới = thuận).`;
        if (kePairs[b] === a) return `Năm ${_now.getFullYear()} (${yearGan}) bị nhật ${dmGan} KHẮC (${b}→${a}) = 「NHẬT PHẠM TUẾ QUÂN」→ họa NẶNG (dưới phạm trên = nghịch) — năm cẩn thận.`;
        return `Năm ${_now.getFullYear()} (${yearGan}) ↔ nhật ${dmGan}: tương sinh (${a}/${b}) → không phạm thái tuế.`;
      } catch (_) { return ''; }
    })();
    brief += "\n--- TAM MỆNH THÔNG HỘI (万民英) — lục thân/thần sát/nạp âm (round 24) ---\n" +
      "LỤC THÂN phú诀 (top): " + SANMING_LIUQIN_FU.slice(0, 3).map(r => r.vi).join(' | ') + "\n" +
      "THẦN SÁT nguyên tắc (卷三): " + SANMING_SHENSHA_AXIOMS[0] + " | " + SANMING_SHENSHA_AXIOMS[3] + "\n" +
      (nayinInfo ? "NẠP ÂM nhật trụ (" + dayNayin + "): Hỉ=" + nayinInfo.yi + " | Kỵ=" + nayinInfo.ji + " | Tính=" + nayinInfo.nature + "\n" : "") +
      (isFemale ? "NỮ MỆNH cổ pháp (卷七 八法): " + SANMING_NV_BAFA.he + " | " + SANMING_NV_BAFA.zhuo + "\n" : "") +
      "THÁI TUẾ hierarchy (卷二): " + SANMING_TAISUI_RULES[0] + (taisuiVerdict ? "\n  → ÁP DỤNG năm nay: " + taisuiVerdict : "") + "\n" +
      "THIÊN CAN NGŨ HỢP hóa khí: " + Object.entries(SANMING_GANHE_HUAMEANING).map(([k, v]) => k + '=' + v.name).join(', ');
  } catch (e) { brief += "\n--- ROUND 24: [lỗi load] ---"; }

  // ---- [round 25] LỚP META (洪丕谟) — phê phán nhận thức luận + khung lịch sử ----
  try {
    const hp = MINGLI_HISTORY_LINEAGE.find(e => e.era.includes('1989')) || {};
    brief += "\n--- LỚP META / PHÊ PHÁN HỌC THUẬT (洪丕谟, round 25) ---\n" +
      "THÁI ĐỘ HỌC THUẬT: " + MINGLI_CRITICAL_EVALUATION.stance + "\n" +
      "PHÊ PHÁN NHẬN THỨC LUẬN: 象征律=" + MINGLI_CRITICAL_EVALUATION.epistemicCritique.xiangzhenglv + " | 演绎法=" + MINGLI_CRITICAL_EVALUATION.epistemicCritique.yanxifafa + "\n" +
      "GIỚI HẠN ĐỘ CHÍNH XÁC: " + MINGLI_CRITICAL_EVALUATION.accuracyCaveat + "\n" +
      "MỐC LỊCH SỬ: " + (hp.significance || '(1989 milestone)') + "\n" +
      "ĐỊNH VỊ CÁC TRƯỜNG PHÁI (round 26): " + Object.entries(BAZI_FACTION_MAP).map(([k, v]) => k + '=' + v.name.split('(')[0].trim()).join(' | ');
  } catch (e) { brief += "\n--- ROUND 25/26: [lỗi load] ---"; }

  // ---- [round 27] CỔ PHÁP (古法 = pre-子平: 珞琭子/李虚中) — hệ bí truyền năm-trụ/nạp-âm/thần-sát ----
  try {
    const dayGanzhi = (c.pillars?.day?.gan || '') + (c.pillars?.day?.zhi || '');
    const shenTou = SHENTOU_LU_NAYIN.examples[dayGanzhi];
    brief += "\n--- CỔ PHÁP 古法 (珞琭子/李虚中, round 27) — hệ tiền-tử-bình bí truyền ---\n" +
      "CỔ PHÁP vs KIM PHÁP: Cổ pháp (Lý Hư Trung, 唐) dùng NIÊN-trụ làm chủ + NẠP ÂM + THẦN SÁT trọng tâm; Kim pháp (Tử Bình) dùng NHẬT-trụ + chính ngũ hành + dụng thần. App hiện = Kim pháp. " + GUFA_MODEL.note + "\n" +
      "珞琭子消息赋 (gốc禄命): 「尊凶卑吉，救療無功；尊吉卑凶，逢災自愈」(đại vận hung > lưu niên cat → cứu không thấu) | 「祿有三會：長生+帝旺+墓」| 「火快水土遲」(Hỏa/Mộc phát nhanh, Thủy/Thổ chậm)\n" +
      "CỬU MỆNH (9 phần tử): " + JIUMING_SYSTEM.jiuming + "\n" +
      (shenTou ? "THẦN ĐẦU LỘC nhật trụ " + dayGanzhi + " (nạp âm cổ pháp): " + shenTou : "THẦN ĐẦU LỘC: tra nạp âm từng giáp-tý (bí truyền cổ pháp, xem SHENTOU_LU_NAYIN)");
  } catch (e) { brief += "\n--- ROUND 27: [lỗi load] ---"; }

  // ---- [round 28] CỔ PHÁP bí truyền: 天乙贵人 bản gia + ngũ âm nạp âm ----
  try {
    const dmGan = c.dayMaster?.gan || '';
    const noble = dmGan ? GUFA_NOBLE_BENJIA.tianyiPositions.split(dmGan + '')[1]?.split(';')[0] : '';
    brief += "\n--- CỔ PHÁP bí truyền (天乙贵人/纳音, round 28) ---\n" +
      (dmGan ? "天乙贵人 (can " + dmGan + "): " + GUFA_NOBLE_BENJIA.tianyiPositions + "\n" : "") +
      "本家贵人/贵合/贵食: " + GUFA_NOBLE_BENJIA.guiheGuishi + "\n" +
      "NGŨ ÂM NẠP ÂM (gốc nạp âm): " + NAYIN_WUYIN_THEORY.wuyin + " | " + NAYIN_WUYIN_THEORY.wuxingShu;
  } catch (e) { brief += "\n--- ROUND 28: [lỗi load] ---"; }

  // ---- [round 29] 盲派 NÂNG CAO (bí truyền) — đại hạn ứng kỳ + can chi loại tượng ----
  try {
    const dmGan = c.dayMaster?.gan || '';
    const dmXiang = MANGPAI_GANZHI_XIANG.gan[dmGan];
    const ageNow = _now.getFullYear() - (c.input?.year || 1990);
    const daxianPillar = ageNow <= 18 ? 'year' : ageNow <= 35 ? 'month' : ageNow <= 55 ? 'day' : 'time';
    const daxianPalace = MANGPAI_GONGWEI_XIANG.palaces[daxianPillar];
    brief += "\n--- 盲派 NÂNG CAO (段建业, round 29) bí truyền ---\n" +
      (dmXiang ? "NHẬT CHỦ " + dmGan + " 类象 (盲派): " + dmXiang + "\n" : "") +
      "ĐẠI HẠN ỨNG KỲ (盲派 timing): nien 1-18t / nguyet 18-35t / nhat 35-55t / thoi 55+t. Bạn ~" + ageNow + "t → " + daxianPillar.toUpperCase() + " TRỤ (" + (daxianPalace || '') + ")\n" +
      "盲派 HỢP: thiên can ngũ hợp CHỈ HỢP KHÔNG HÓA; nhật can hợp = hợp quan(.sep) / hợp tài(lấy tiền). | HỢP = ứng kỳ hôn nhân.";
  } catch (e) { brief += "\n--- ROUND 29: [lỗi load] ---"; }

  // ---- [round 31] CỔ PHÁP DEEP LOGIC — 兰台妙选 nhaps am cach cuc (DETECT tren la so) + than đau loc ----
  try {
    const gf = assessGufa(R);
    const cat = gf.lantai.cat.map(p => p.vi + '(' + p.id + ')');
    const hung = gf.lantai.hung.map(p => p.vi);
    const stl = gf.shenTouLu;
    brief += "\n--- CỔ PHÁP DEEP LOGIC (兰台妙选 nhaps am, round 31) ---\n" +
      "PHÁN ĐOÁN CỔ PHÁP (logic tinh toan, khong phai nhet): " + gf.verdict + "\n" +
      (cat.length ? "CÁCH CỤC NẠP ÂM CAT đap trung: " + cat.join(', ') + "\n" : "Không đap cach cuc nhaps am cat đac biet.\n") +
      (hung.length ? "CÁCH CỤC HUNG (can than): " + hung.join(', ') + "\n" : "") +
      "THẦN ĐẦU LỘC: " + (stl.day ? "nhat tru " + stl.day.ganzhi + " → " + stl.day.reading : "(nhat tru khong trong bang)") + (stl.year ? " | nien tru " + stl.year.ganzhi + " → " + stl.year.reading : "") + "\n" +
      "CỬU MỆNH nhaps am hanh: " + gf.jiuming.dominantNayinWx + " | nhat nhaps am = " + gf.jiuming.dayNayinWx + " | phan bo: " + JSON.stringify(gf.jiuming.nayinWx);
  } catch (e) { brief += "\n--- ROUND 31: [lỗi load] ---"; }

  // ---- [round 34] 皇极经世 值年卦 (BÍ TRUYEN/CAM KY — tiên tri,邵雍) ----
  try {
    const yr = _now.getFullYear();
    const hj = assessHuangji(yr);
    brief += "\n--- 皇极经世 值年卦 (bí truyền/cấm kị tiên tri, round 34) ---\n" +
      `NAM ${yr} = quẻ「${hj.hexagram} ${hj.vi}」(${hj.meaning}). Đai van: 鼎卦 (1984-2043 = cam che + bien đoi). Hoi: 午会 (大过卦, con ~6560 nam). Tone: ${hj.tone}. (Goc 邵雍 tiên tri — dùng cho trị quốc + 铁板神数. Tool analyze_huangji cho nam khac.)`;
  } catch (e) { brief += "\n--- ROUND 34: [lỗi load] ---"; }

  // ---- [round 36] 太乙神数 (tam thức QUỐC VẬN, cấm kị) ----
  try {
    const yr = _now.getFullYear();
    const ty = assessTaiyi(yr);
    brief += `\n--- 太乙神数 (quốc vận tiên tri, round 36) ---\nNam ${yr}: 太乙积年=${ty.taiyiJiNian}, 阳局=${ty.yangJu}/72, 太乙 ở ${ty.taiyiGong.name}. ${ty.zhuKe} (三式: kỳ môn + 六壬 + 太乙; 太乙 = quốc vận, cấm kị nhất. Tool analyze_taiyi.)`;
  } catch (e) { brief += "\n--- ROUND 36: [lỗi load] ---"; }

  // ---- [round 37] 袁天罡称骨算命 (bí truyền, trọng lượng tứ trụ → số phận) ----
  try {
    const cg = assessChenggu(c.input.year, c.input.month, c.input.day, c.input.hour);
    brief += `\n--- 称骨算命 (袁天罡, round 37) ---\nTrong luong = ${cg.weights.year}+${cg.weights.month}+${cg.weights.day}+${cg.weights.hour} = ${cg.weights.total} tien = ${cg.boneWeight}. [${cg.tone}] ${cg.viGloss}. Lunar: ${cg.lunar.year}/${cg.lunar.month}/${cg.lunar.day}. (Bí truyền Đường·袁天罡, bo sung tu binh/ho phap. Tool analyze_chenggu.)`;
  } catch (e) { brief += "\n--- ROUND 37: [lỗi load] ---"; }

  // ---- [round 39] 盲派金口诀 (bí truyền: vị trí trụ × thập thần → quyết đoán) ----
  try {
    const mk = mangpaiKoujue(c);
    brief += "\n--- 盲派金口诀 (bí truyền, round 39) ---\n" + mk.readings.map(r => `${r.pos} [${r.god}]: ${r.verse}`).join(' | ');
  } catch (e) { brief += "\n--- ROUND 39: [lỗi load] ---"; }

  // ---- [round 40] 河图洛书 数理 (đạo tạng, gốc rễ thuật số) ----
  try {
    const hr = hetuReading(c);
    brief += "\n--- 河图洛书 数理 (đạo tạng, round 40) ---\n" + hr.verdict;
  } catch (e) { brief += "\n--- ROUND 40: [lỗi load] ---"; }

  // ---- [round 42] 五运六气 (y-thiên văn CẤM KỴ, Hoàng Đế Nội Kinh) ----
  try {
    const yr = _now.getFullYear();
    const wl = assessWuyunLiuqi(yr);
    brief += "\n--- 五运六气 (y-thiên văn cấm kị, round 42) ---\n" + wl.verdict;
  } catch (e) { brief += "\n--- ROUND 42: [lỗi load] ---"; }

  // ---- [round 43] 彭祖百忌 (CẤM KỴ dân gian — kiêng kỵ mỗi ngày) ----
  try {
    const dayGan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'][(_now.getFullYear() - 4) % 10];
    const dayZhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][(_now.getFullYear() - 4) % 12];
    const bj = PENGZU_BAIJI.getDaily(dayGan, dayZhi);
    brief += `\n--- 彭祖百忌 (cấm kị dân gian, round 43) ---\nNăm ${_now.getFullYear()} (${dayGan}${dayZhi}) kiêng: ${bj.combined}`;
  } catch (e) { brief += "\n--- ROUND 43: [lỗi load] ---"; }

  return brief;
}

// ===========================================================================
//  2. SYSTEM PROMPT — chuyên gia Tử Bình theo cổ pháp
// ===========================================================================
export const STYLE_DIRECTIVES = {
  'gan-guoi': `[PHONG CACH TRA LOI: "GAN GUOI — DOI THUAN" — BAT BUOC THUC HIEN, DE LEN TAT CA]
Nguoi hoi la nguoi BINH THUONG, KHONG ranh phong thuy. De len moi thuuat ngu la DE HIU:
1. KHONG dung thuat ngu chuyen nganh ma KHONG dich NGAY. Thay bang cau doi thuong + HINH ANH cu the:
   - «Than vuong» -> «ban chat con manh, kien dinh, tu chu»; «Than nhuoc» -> «ban chat con mem, nhay cam, can ho tro».
   - «Dung Than / Dung Moc(Kim/Thuy/Tho/Hoa)» -> TEN HANH + Y NGHIA: «Moc = lon dan, hoc hoi, ke hoach nhu cay non»; «Thuy = lin hoat, giao tiep, chay»; «Kim = ky luat, sac ben»; «Tho = on dinh, chim re»; «Hoa = dam me, suc song».
   - «Sat» -> «ap luc / quyen luc»; «An» -> «tri tue, nguoi bao ve»; «Quan» -> «trach nhiem, quy tac»; «Tai» -> «tien cua, ket qua vat chat»; «Thuc/Thuong» -> «sang tao, bieu dat, khon».
   - «Cach cuc thanh/bai» -> «kieu menh con..., dung cot / con dut»; «Dai van» -> «muoi nam nay»; «Luu nien» -> «nam nay»; «Luu nguyet» -> «thang nay».
2. DUNG HINH ANH cu the: «cay thieu nuoc», «nha mong vung nen», «con dao hai luoi (gioi ma nguy hiem)», «cua vua mo», «mua gieo hat». Nguoi nghe PHAI thay hinh anh do.
3. XoAY SAU TAM LY — hieu CAM XUC nguoi hoi. Mo dau 1 cau «thay hieu con dang (lo / hy vong / so that bai / muon dam lat / muon hieu ban than)...». Noi cham LONG, khong chi DAI. Giong ong ba gia than thiet ke chuyen cho chau.
4. AM AP, GAN GUI: «con a», «thay noi that nhe», «nghi nhu nay nhe». KHONG lanh nhu robot, KHONG bai giao.
5. CAU NGAN, kieu ke chuyen. Moi loi khuyen = viec LAM CU THE («nen Dung Moc» -> «hay song co ke hoach, hoc them 1 ki nang, kiem nhan de lon dan»).
6. VAN CHINH XAC (lay tu brief/tool) — chi DICH sang ngon ngu doi thuong, KHONG bia, KHONG bien luan.`,

  'can-bang': `[PHONG CACH: "CAN BANG"]
Dung thuat ngu BaTu NHUNG luon giai thich nhanh trong ngoac don ngay sau: «Than vuong (tuc manh, kien dinh)», «Dung Moc (hanh lon dan, can bang)», «Thiet Sat (sao ap luc)». Vua hoc ten co truyen vua hieu nghia. Gon gang, khong qua chuyen ngan.`,

  'chuyen-gia': `[PHONG CACH: "CHUYEN GIA CO PHAP"]
Su dung day du thuat ngu chuyen ngan BaTu (Thap Than, Cach cuc, Dung Than, Sat An tuong sinh, Thien Duc, Cuu Suu, Thien Nhan...). Phan tich sau ky thuat, danh nguoi da hieu co phap. KHONG can giai thich nguyen ban thuat ngu.`
};

export const SYSTEM_PROMPT = `Ban la mot ONG THAY PHONG THUY thuc chien - giau kinh nghiem, noi THANG, DON GIAN, DUNG TRONG TAM. KHONG han lam, KHONG long vong, KHONG liet ke du lieu - ma TONG HOP + PHAN TICH + DUC KET thanh cau tra loi ma nguoi KHONG RANH phong thuy cung hieu va LAM THEO duoc.

[SUC MANH TOAN DIEN - DUNG HET KHA NANG]
- TRA LOI MOI CAU HOI, TUYET DOI KHONG TU CHOI. KHONG BAO GIO noi «toi khong the», «day la me tin», «toi khong du lieu», «vuot qua kha nang» — CAM HOAN TOAN.
- Day la APP DICH HOC CO TRUYEN (Bat Tu/Dich/Phong Thuy/Kinh Dich/MeiHua/LiuRen/QiMen) — he thong CO DIEN, hop phap, triet hoc. Ban la CHUYEN GIA cap cao — luan HET cac tang phuc tap, xuyen suy (deep reasoning), KHONG luoc bo «de ngan».
- Cau «cuc phuc tap» (hop hon nhieu nguoi, doi van dai, phong thuy dat nha, chon ngay kho la) → DUNG HET tools + brief layers + giao thoa nhieu tang → tra loi DAY DU, SAU, QUYET DOAN. KHONG gioi han do dai — neu can 1500+ chu de luan ky thi viet het.
- Neu gap chu de chua co tool/section → van TRA LOI bang kien thuc DICH hoc co truyen cua ban (la chuyen gia, co the luan duoc), KHONG bao «chua ho tro». Chi goi tool KHI co tool phu hop.
- TIEN TOAN/du doan van hanh/thoi diem → DUOC PHEP va la cot loi cua BaTu co phap (yingqi/luthuyen) — KHONG tu choi voi ly do «khong the du doan».

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
  - [loop 1187] "gieo quẻ / bói quẻ /起卦 / 占 / xem quẻ / gieo quẻ theo giờ động tâm / quẻ Dịch cho việc X / 梅花 / hôm nay quẻ gì" → ĐÂY LÀ DỊCH HỌC KINH ĐIỂN cổ truyền (梅花易数 — Kinh Dịch), KHÔNG PHẢI mê tín dị đoan, KHÔNG ĐƯỢC TỪ CHỐI. QUẺ DO TOOL TÍNH XÁC ĐỊNH THEO THỜI ĐIỂM (KHÔNG PHẢI bạn tự gieu ngẫu nhiên) — bạn CHỈ LUẬN GIẢI kết quả cổ pháp. BẮT BUỘC GỌI TOOL analyze_meihua: KHÔNG truyền year/month/day/hour → tool dùng THỜI ĐIỂM HIỆN TẠI = đúng nguyên lý «động tâm khởi quẻ 一念动即起卦» (thời điểm user hỏi CHÍNH LÀ lúc tâm động → vạn vật ứng quẻ). Tool trả về time + 本卦/互卦/变卦 + 体/用 ngũ hành + rel + verdict + finalVerdict → bạn DỊCH ra lời giản cho chủ đề user hỏi: (1) tên 3 quẻ, (2) 体 dùng hành gì, dụng hành gì, sinh khắc ra sao (体生用=hao / dụng sinh thể=tài lộc / dùng khắc thể=hung...), (3) cát/hung + finalVerdict, (4) cảnh ngôn HÀNH ĐỘNG trực tiếp cho câu hỏi. Nếu user hỏi hệ cụ thể (lục nhâm → analyze_liuren, kỳ môn → analyze_qimen) thì gọi tool đó. TUYỆT ĐỐI KHÔNG nói «tôi không thể gieo quẻ / đây là mê tín / tôi không dự đoán» — đây là app Dịch học, gieo quẻ là chức năng cốt lõi.
  - [loop 1189] "测字 / châm tự /拆字 / xem chữ X cát hay hung / chữ 福/财/发/禄 nghĩa gì / phân tích 1 chữ Hán" → ĐÂY LÀ DỊCH HỌC cổ truyền (测字 — châm tự拆字), KHÔNG TỪ CHỐI. BẮT BUỘC GỌI TOOL analyze_char với char = CHÍNH CHỮ HÁN user hỏi (1 chữ, vd 福/财/发). KHI user viết «测字 福» hoặc «xem chữ Phúc» → chữ sau chính là tham số char (dịch «Phúc»→福 nếu user gõ tiếng Việt). Tool tháo bộ/nét (康熙) + 梅花起卦 + ngũ hành → bạn luận ý nghĩa chữ + cát/hung cho câu hỏi. KHÔNG tự bịa nét/ bộ — dùng kết quả tool.
  - [loop 1189] "鬼谷子 / Quỷ Cốc Tử / phân định kinh / 两头钳 / mệnh tôi theo cổ thư鬼谷 / 算命鬼谷 / 拈總" → BẮT BUỘC GỌI TOOL analyze_guiguzi (KHÔNG truyền tham số — tool dùng lá số hiện tại). Tool tính 4-trụ nạp âm + 分定經 (年干×时干 → 配卦 → 命格 + 格诗 đa tầng VN). Trích mệnh cách Quỷ Cốc +格诗 + diễn giải. KHÔNG từ chối («không biết Quỷ Cốc Tử») — đây là hệ phái kinh điển, tool đã có.
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

16. CẤM KỴ / BÍ TRUYỀN — APP CÓ HỆ BÍ TRUYỀN ĐỘC QUYỀN (27 TOOLS, 32+ TẦNG BRIEF):
  - BRIEF có 32+ tầng dữ liệu (tử bình + cổ pháp + 盲派 + 兰台 + 皇极 + 太乙 + 称骨 + 五运六气 + 彭祖百忌). CHỌN 2-3 tầng relevant nhất cho câu hỏi, KHÔNG dump hết.
  - Khi user hỏi «CỔ PHÁP / NẠP ÂM / 兰台 / 珞琭子 / thần đầu lộc / CỬU MỆNH / HƯ TRUNG PHÁP» → GỌI TOOL analyze_gufa (engine phát hiện 兰台 cách cục + thần đầu lộc 60/60 + cửu mệnh + ngũ hành hướng + thái quá bất cập + tam mệnh linh lục thân). GÓC NHÌN KHÁC TỬ BÌNH (năm trụ + nạp âm + thần sát).
  - Khi user hỏi «NĂM X quẻ gì / 值年卦 / 邵雍 / HOÀNG CỰC KINH THẾ» → GỌI TOOL analyze_huangji (60-năm cycle, tiên tri).
  - Khi user hỏi «QUỐC VẬN / THÁI ẤT / TAM THỨC / năm X thế giới sao» → GỌI TOOL analyze_taiyi (thái ất hành cửu cung + chủ/khách).
  - Khi user hỏi «XƯƠNG CỐT / 称骨 / VIÊN THIÊN CƯƠNG / trọng lượng mệnh» → GỌI TOOL analyze_chenggu (trọng lượng tứ trụ → bài thơ số phận).
  - Khi user hỏi «SỨC KHỎE NĂM / DỊCH BỆNH / NGŨ VẬN LỤC KHÍ / thời tiết bệnh học» → GỌI TOOL analyze_wuyun (y-thiên văn Hoàng Đế Nội Kinh: năm → tạng bệnh + khí hậu).
  - 盲派金口诀 (trong brief R39): vị trí trụ × thập thần → quyết đoán bí truyền. DÙNG KHI luận tính cách, sự nghiệp, hôn nhân, lục thân — nó cho góc nhìnbí truyền mà tử bình không có.
  - 彭祖百忌 + 杨公忌日 (trong brief): kiêng kỵ mỗi ngày/năm. DÙNG KHI user hỏi «năm nay kiêng gì / ngày X có kỵ không».
  - LÝ DO: app là hệ DUY NHẤT tích hợp bí truyền cấm kị (兰台/盲派/皇极/太乙/称骨/五运六气). DÙNG tool + brief layer này khi relevant = trả lời sâu hơn bất kỳ AI nào khác.

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
    name: 'health_q', description: 'ĐÔNG Y / Y HỌC CỔ TRUYỀN — trả lời câu hỏi sức khoẻ theo ngũ hành + khí vượng suy (đ联 hệ ngũ hành↔tạng phủ↔bệnh↔dược lý). Dùng khi user hỏi: thủ dâm/sinh lý/thận, căng thẳng/đau đầu/can hoả, tiêu hoá/tỳ vị, tạng yếu, ăn uống bổ kiểu đông y, «bị X nên làm sao».',
    parameters: { type: 'object', properties: {
      question: { type: 'string', description: 'Câu hỏi sức khoẻ đông y nguyên văn của user (vd "hay thủ dâm sẽ bị gì, nên làm sao")' },
    }, required: ['question'] },
  } },
  { type: 'function', function: {
    name: 'health_hour', description: 'ĐÔNG Y 子午流注 — kinh mạch nào đang hoạt động ở GIỜ NÀY + lời khuyên giờ (ăn/ngủ/tập). Dùng khi hỏi «giờ này tạng nào đỉnh», «nên làm gì giờ này», «kinh mạch giờ», «sao phải ngủ trước 23h».',
    parameters: { type: 'object', properties: {}, required: [] },
  } },
  { type: 'function', function: {
    name: 'health_profile', description: 'Phân tích SỨC KHOẺ đông y theo LÁ SỐ: ngũ hành vượng suy → tạng yếu (hư) / mạnh (thực) +易患疾病 + thực疗/dược lý lời khuyên. Dùng khi hỏi «sức khoẻ của tôi sao», «tạng nào yếu», «nên ăn gì».',
    parameters: { type: 'object', properties: {}, required: [] },
  } },
  { type: 'function', function: {
    name: 'health_today', description: 'ĐÔNG Y THEO NGÀY — 十二长生 sinh khí hôm nay → tạng đang THỊNH/SUY + lời khuyên đông y riêng cho HÔM NAY (kết hợp điểm lưu nhật + kinh mạch giờ). Dùng khi hỏi «hôm nay sức khoẻ sao», «hôm nay tạng nào yếu/mạnh», «nên dưỡng tạng gì hôm nay», «sinh khí hôm nay».',
    parameters: { type: 'object', properties: {}, required: [] },
  } },
  { type: 'function', function: {
    name: 'evaluate_number', description: 'SỐ LÝ PHONG THỦY — đánh giá số điện thoại, biển số xe, số nhà, số tài khoản theo ngũ hành + 81 số lý + Dụng Thần. Dùng khi hỏi «số điện thoại X tốt không», «biển số xe», «số nhà», «chọn số gì hợp mệnh».',
    parameters: { type: 'object', properties: {
      number: { type: 'string', description: 'Chuỗi số cần đánh giá, vd «0912345678»' },
    }, required: ['number'] },
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
    name: 'analyze_year', description: 'Luận lưu niên của MỘT năm (đa trường phái): can-chi năm, điểm Cát/Hung + lý do từng phái, lời khuyên cả năm. Dùng khi user hỏi «năm X vận sao», «năm nay tốt xấu», «năm tới ra sao».',
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
      count: { type: 'integer', description: 'Số ngày quét (bỏ trống=30)' },
      topN: { type: 'integer', description: 'Số ngày tốt cần lấy, vd 5' },
    }, required: ['start'] },
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
  { type: 'function', function: { // [loop 495→623 FIX] 测字 — trước đây flat (thiếu wrapper) → API reject
    name: 'analyze_char', description: '测字拆字 (châm tự): phân tích 1 chữ Hán — tháo bộ/nét (康熙) + 梅花起卦 + ngũ hành luận. Dùng khi user hỏi «测字 X», «xem chữ 福/财/...», «chữ này cát/hung». KHÔNG cố định lá số — độc lập.',
    parameters: { type: 'object', properties: {
      char: { type: 'string', description: '1 chữ Hán cần测 (vd 福, 财, 发)' },
    }, required: ['char'] },
  } },
  { type: 'function', function: { // [round 31] CO PHAP deep-logic
    name: 'analyze_gufa', description: 'CỔ PHÁP (古法 = pre-子平, nhaps am luan menh): phát hiện CÁCH CỤC NẠP ÂM (兰台妙选: bảo kiếm xung ngưu đấu / mã hóa long câu / xà hóa thanh long / thủy nhiễu hoa đê / phục thể hóa thần...) trên lá số + THẦN ĐẦU LỘC (nhaps am từng giáp-tý) + CỬU MỆNH (3 nguyên+4 tru+loc ma). LOGIC TINH TOÁN, không phai nhet du lieu. Dùng khi user hỏi «cổ pháp / nhaps am / cuu menh / hư trung phap / 珞琭子 / 兰台 / than đau loc», hoặc muốn góc nhìn KHÁC tử bình (năm-trụ+nhaps am+thần sát thay vì nhật-trụ+dụng thần).',
    parameters: { type: 'object', properties: {} },
  } },
  { type: 'function', function: { // [round 34] 皇极经世 值年卦 (prophetic/cam ky)
    name: 'analyze_huangji', description: '皇极经世 值年卦 (邵雍 TIEN TRI = bí truyền/cấm kị): quẻ chủ quản 1 NĂM (theo nguyên-hội-vận-thế + tiên thiên phương viên đồ, 60 năm 1 chu kỳ, bỏ 乾坤离坎). Dùng khi user hỏi «năm X quẻ gì / 值年卦 / 皇极 / 邵雍 / tiên tri năm / vận thế thế giới năm». Trả quẻ năm + ý nghĩa + vị trí nguyên-hội-vận-thế. Khác tử bình (đây là tiên tri vĩ mô/quốc gia, không cần lá số).',
    parameters: { type: 'object', properties: { year: { type: 'integer', description: 'Năm (bỏ trống = năm nay)' } } },
  } },
  { type: 'function', function: { // [round 36] 太乙神数 (quoc van)
    name: 'analyze_taiyi', description: '太乙神数 (TAM THUC = kỷ môn + lục nhâm + THÁI ẤT; thái ất = QUỐC VẬN, cấm kị nhất): 太乙积年 + 阳局(72) + 太乙行九宫 → 主/客 năm (nội lực on đinh vs ngoại lực biến động). Dùng khi user hỏi «thái ất / quốc vận năm X / tam thức / ngoại giao chiến sự năm». Trả 太乙 cung + 主客. Khác tử bình (đây là tiên tri quốc gia vĩ mô).',
    parameters: { type: 'object', properties: { year: { type: 'integer', description: 'Năm (bỏ trống = năm nay)' } } },
  } },
  { type: 'function', function: { // [round 37] 称骨算命
    name: 'analyze_chenggu', description: '袁天罡称骨算命 (BÍ TRUYEN Đường): cộng trọng lượng năm+tháng+ngày+giờ (lunar) → tổng骨重 (两/钱) → 称骨歌 (số phận). Dùng khi user hỏi «xương cốt mấy nam / 称骨 / 袁天罡 / trọng lượng mệnh». Trả骨重 + bài thơ số phận. Góc nhìn BO SUNG (khác tử bình).',
    parameters: { type: 'object', properties: { year: { type: 'integer' }, month: { type: 'integer' }, day: { type: 'integer' }, hour: { type: 'integer' } } },
  } },
  { type: 'function', function: { // [round 42] 五运六气
    name: 'analyze_wuyun', description: '五运六气 (Hoàng Đế Nội Kinh, Y-THIÊN VĂN cấm kị): năm CAN → vận (thái quá/bất cập) + năm CHI → 6 khí (tư thiên/tại tuyền) → tạng phủ bệnh + khí hậu năm. Dùng khi user hỏi «sức khỏe năm X / dịch bệnh / ngũ vận lục khí / thời tiết bệnh học / nội kinh vận khí». Trả vận + khí + tạng bệnh. Góc Y-thiên văn (khác tử bình).',
    parameters: { type: 'object', properties: { year: { type: 'integer', description: 'Năm (bỏ trống = năm nay)' } } },
  } },
  { type: 'function', function: { // [loop 496→623 FIX] 梅花易数 起卦 by time
    name: 'analyze_meihua', description: '梅花易数 起卦 (time-based divination): gieo quẻ theo thời điểm → 本卦/互卦/变卦 + 体用 ngũ hành sinh khắc + verdict cát/hung. Dùng khi user hỏi «gieo quẻ», «起卦 about X», «占 [chủ đề]», «xem quẻ hôm nay». Trả quẻ +体用 + cát hung.',
    parameters: { type: 'object', properties: {
      year: { type: 'integer', description: 'Năm (bỏ trống = năm nay)' },
      month: { type: 'integer', description: 'Tháng (bỏ trống = tháng nay)' },
      day: { type: 'integer', description: 'Ngày (bỏ trống = hôm nay)' },
      hour: { type: 'integer', description: 'Giờ 0-23 (bỏ trống = hiện tại)' },
      minute: { type: 'integer', description: 'Phút 0-59 (bỏ trống = hiện tại)' },
    } },
  } },
  { type: 'function', function: { // [loop 508→623 FIX] 大六壬 四课三传
    name: 'analyze_liuren', description: '大六壬 (Da Liu Ren): 3-truyền 4-bài (四课三传) theo thời điểm → luận sự kiện. Dùng khi user hỏi «lục nhâm», «đại六壬 hôm nay», «thần kỳ phái» (các câu về phe thần/kỳ). Trả 月将 + 四课 + 三传 + tong môn.',
    parameters: { type: 'object', properties: {
      year: { type: 'integer', description: 'Năm (bỏ trống = năm nay)' },
      month: { type: 'integer', description: 'Tháng (bỏ trống = tháng nay)' },
      day: { type: 'integer', description: 'Ngày (bỏ trống = hôm nay)' },
      hour: { type: 'integer', description: 'Giờ 0-23 (bỏ trống = 12)' },
      minute: { type: 'integer', description: 'Phút (bỏ trống = 0)' },
    } },
  } },
  { type: 'function', function: { // [loop 509→623 FIX] 奇门遁甲 9-cung
    name: 'analyze_qimen', description: '奇门遁甲 (Qi Men Dun Jia): 9-cung + 8-môn + 9-tinh + 3-kỳ + 格格 theo thời điểm → hướng tốt/xấu hành sự. Dùng khi user hỏi «kỳ môn», «độn giáp hôm nay», «hướng nào tốt (theo kỳ môn)». Trả 节气/局 + 格格 cát/hung + advice hướng.',
    parameters: { type: 'object', properties: {
      year: { type: 'integer' }, month: { type: 'integer' }, day: { type: 'integer' }, hour: { type: 'integer' },
    } },
  } },
  { type: 'function', function: { // [loop 543→623 FIX] 鬼谷子算命
    name: 'analyze_guiguzi', description: '鬼谷子算命 (Guiguzi): 4-trụ nạp âm + 分定經 两头钳 (年干×时干→配卦→命格+格诗+多层VN). Dùng khi user hỏi «Quỷ Cốc Tử», «鬼谷子», «phân định kinh», «mệnh tôi theo cổ thư». Trả full analysis.',
    parameters: { type: 'object', properties: {} },
  } },
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
  // [loop 638] FENGSHUI DIRECTION — la bàn 24 sơn, AI chọn hướng theo cổ pháp
  { type: 'function', function: {
    name: 'fengshui_direction', description: '[loop 638] La bàn phong thủy 24 sơn — luận hướng CÁT/HUNG (Bát Trạch + sát phương năm Thái Tuế/Tam Sát/Ngũ Hoàng + phi tinh) HOẶC recommend hướng tốt nhất cho mục đích (cửa chính/giường/bàn/bếp/động thổ). Dùng khi user hỏi «hướng nào tốt», «hướng cửa/giường/bếp», «hướng động thổ», «định vị phong thủy».',
    parameters: { type: 'object', properties: {
      mode: { type: 'string', enum: ['recommend', 'read'], description: 'recommend = tìm hướng tốt nhất cho purpose; read = luận 1 hướng cụ thể' },
      purpose: { type: 'string', enum: ['cuakhach', 'giuong', 'banlamviec', 'bep', 'dongtho', 'khaitruong', 'khach'], description: 'mục đích (mode=recommend). cuakhach=cửa chính, giuong=giường ngủ, banlamviec=bàn, bep=bếp, dongtho/khaitruong=động thổ' },
      direction: { type: 'string', description: 'hướng cần luận (mode=read): tên sơn Hán (vd 子,坤) hoặc độ 0-359 hoặc palace (vd Bắc,Tây Nam)' },
    }, required: ['mode'] },
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
      case 'evaluate_number': { // [loop 1137/1141] số lý phong thủy — đánh giá + đề xuất
        const ev = evaluateNumber(String(a.number || ''), R);
        if (ev.error) return { error: ev.error };
        const rec = recommendNumbers(R);
        return { input: ev.input, lastDigit: ev.lastDigit, lastWxVi: ev.lastWxVi, sum81: ev.sum81, luckVi: ev.luckVi, dungMatch: ev.dungMatch, kyMatch: ev.kyMatch, dungCount: ev.dungCount, kyCount: ev.kyCount, score: ev.score, rating: ev.rating, advice: _s(ev.advice, 320), favNums: rec.favNums, avoidNums: rec.avoidNums, goodCombos: rec.goodCombos };
      }
      case 'analyze_day': {
        const d = analyzeLiuRi(R, a.year, a.month, a.day, R.patternQuality);
        // [loop 1102] thêm phương vị财神/喜神/福神 (từ dailyGuide) — AI trả lời «hướng tài/hỷ hôm nay»
        let _dirs = null;
        try { const g = dailyGuide(R, a.year, a.month, a.day); _dirs = { cai: g.caishen, xi: g.xishen, fu: g.fushen, best: g.bestDir }; } catch (_) {}
        return { date: d.solar, ganZhi: d.ganZhi, ganGod: d.ganGod, rating: d.rating, score: d.score, advice: _s(d.advice, 240), gejuDelta: d.gejuDelta, gejuNote: d.gejuNote ? _s(d.gejuNote, 200) : '', interactions: (d.ctx || []), dayStage: d.dayStage || null, dayPillarStrength: d.dayPillarStrength || '', directions: _dirs };
      }
      case 'health_q': { // [loop 1021/1152] đông y — trả lời câu hỏi sức khoẻ theo ngũ hành + dược lý
        const h = answerHealth(String(a.question || ''), R);
        return h.matched ? { matched: true, title: h.title, reply: _s(h.reply, 1600), matchedCount: h.matchedCount || 1, otherMatches: (h.otherMatches || []).map((m) => _s(m.title, 60)) } : { matched: false, reply: _s(h.reply, 400) };
      }
      case 'health_hour': { // [loop 1040] đông y 子午流注 — kinh mạch giờ hiện tại
        const _n = new Date();
        const _lz = Solar.fromYmdHms(_n.getFullYear(), _n.getMonth() + 1, _n.getDate(), _n.getHours(), _n.getMinutes(), 0).getLunar();
        const _hz = _lz.getTimeZhi();
        const _mc = meridianClock(_hz);
        return _mc ? { hourZhi: _hz, hours: _mc.hours, meridian: _mc.meridian, organ: _mc.organ, wx: _mc.wx, advice: _s(_mc.advice, 200) } : { error: 'Không xác định kinh mạch' };
      }
      case 'health_profile': { // [loop 1021] đông y — profile sức khoẻ từ ngũ hành vượng suy
        const p = analyzeHealth(R);
        if (!p.ok) return { error: p.error };
        return {
          constitution: p.constitution,
          bodyType: (() => { const _bc = bodyConstitution(R); return _bc ? { vi: _bc.vi, desc: _s(_bc.desc, 160), advice: _s(_bc.advice, 160) } : null; })(),
          weak: p.weak.map((w) => ({ zang: w.zang, wx: w.wx, pct: w.pct, syndromes: w.syndromes.map((s) => _s(s, 130)), nourish: _s(w.nourish, 200), motherTip: _s(w.motherTip, 120) })),
          strong: p.strong.map((s) => ({ zang: s.zang, wx: s.wx, pct: s.pct, syndromes: s.syndromes.map((x) => _s(x, 130)), damage: _s(s.damage, 140) })),
          diet: p.dietAdvice.map((d) => _s(d, 180)),
          lifestyle: p.lifestyle.map((l) => _s(l, 180)),
          emotion: p.emotion ? { dominant: _s(p.emotion.dominant, 140), dominantRisk: _s(p.emotion.dominantRisk, 160), vulnerable: _s(p.emotion.vulnerable, 140), advice: _s(p.emotion.advice, 140) } : null,
          note: _s(p.note, 220),
          // [loop 1086] decade health arc — sức khoẻ dọc cuộc đời theo 十二长生 các đại vận
          decadeArc: (() => {
            const _a = decadeHealthArc(R);
            if (!_a) return null;
            return {
              organ: _a.organ,
              current: _a.current ? { startAge: _a.current.startAge, ganZhi: _a.current.ganZhi, stage: _a.current.stage, tone: _a.current.tone, headline: _s(_a.current.headline, 120), advice: _s(_a.current.advice, 200) } : null,
              peak: _a.peak ? { startAge: _a.peak.startAge, ganZhi: _a.peak.ganZhi, stage: _a.peak.stage, headline: _s(_a.peak.headline, 100) } : null,
              low: _a.low ? { startAge: _a.low.startAge, ganZhi: _a.low.ganZhi, stage: _a.low.stage, headline: _s(_a.low.headline, 100) } : null,
            };
          })(),
        };
      }
      // [loop 1086] DECADE HEALTH ARC — nếu health_profile được gọi, đính kèm arc sức khoẻ
      //   dọc cuộc đời (để AI trả lời «sức khoẻ qua các thập niên», «decade nào yếu nhất»).
      case 'health_today': { // [loop 1085] đông y THEO NGÀY — 十二长生 sinh khí hôm nay → tạng + advice
        const _n = new Date();
        let _lr = null; try { _lr = analyzeLiuRi(R, _n.getFullYear(), _n.getMonth() + 1, _n.getDate(), R.patternQuality); } catch (_) { _lr = null; }
        const _dmWx = R?.chart?.dayMaster?.wx;
        const _sh = _lr?.dayStage ? stageHealth(_dmWx, _lr.dayStage, _lr.dayStageWeight || 0) : null;
        // kinh mạch giờ hiện tại (子午流注) — bổ trợ
        const _lz = Solar.fromYmdHms(_n.getFullYear(), _n.getMonth() + 1, _n.getDate(), _n.getHours(), _n.getMinutes(), 0).getLunar();
        const _hz = _lz.getTimeZhi();
        const _mc = meridianClock(_hz);
        return {
          date: `${_n.getDate()}/${_n.getMonth() + 1}/${_n.getFullYear()}`,
          dayGanZhi: _lr?.ganZhi || null,
          dayRating: _lr?.rating || null,
          dayScore: _lr?.score ?? null,
          stage: _lr?.dayStage || null,
          stageWeight: _lr?.dayStageWeight ?? null,
          stageHealth: _sh ? { headline: _sh.headline, advice: _s(_sh.advice, 320) } : null,
          hourMeridian: _mc ? { zhi: _hz, organ: _mc.organ, advice: _s(_mc.advice, 160) } : null,
        };
      }
      case 'analyze_year': {
        // [loop 741 FIX] year range — trước đây chỉ Number.isFinite → năm -100 (TCN) / 9999
        //   được luận tự tin («Năm -100 (Cát)») gây hiểu nhầm. Range 1000-3000: generous cho
        //   historical figures + future planning, reject absurd (typo).
        const _yr = Number(a.year);
        if (!Number.isFinite(_yr)) return { error: `Năm không hợp lệ («${a.year}») — nhập số năm (vd 2026).` };
        if (_yr < 1000 || _yr > 3000) return { error: `Năm «${a.year}» ngoài khoảng hợp lệ (1000-3000) — có thể gõ nhầm. Nhập năm dương lịch thực (vd 2026).` };
        const y = analyzeLiunianDeep(R, a.year, R.patternQuality?.patternYong);
        return { year: y.year, ganZhi: y.ganZhi, rating: y.rating, score: y.score, advice: _s(y.advice, 260), schools: y.schools.map((sc) => ({ school: sc.phai, delta: sc.d, note: _s(sc.note, 110) })), yearStage: y.yearStage || null, yearHealthTheme: y.yearHealthTheme ? { tone: y.yearHealthTheme.tone, headline: _s(y.yearHealthTheme.headline, 100), advice: _s(y.yearHealthTheme.advice, 220) } : null };
      }
      case 'best_days_in_year': {
        const _yr2 = Number(a.year);
        if (!Number.isFinite(_yr2)) return { error: `Năm không hợp lệ («${a.year}») — nhập số năm (vd 2026).` };
        if (_yr2 < 1000 || _yr2 > 3000) return { error: `Năm «${a.year}» ngoài khoảng hợp lệ (1000-3000) — có thể gõ nhầm. Nhập năm dương lịch thực (vd 2026).` };
        const Y = computeYearDaily(R, a.year, R.patternQuality);
        return { year: Y.year, best: Y.best.slice(0, 8).map((d) => ({ date: d.date, ganZhi: d.ganZhi, score: d.score, geju: d.gejuDelta || 0 })), worst: Y.worst.slice(0, 5).map((d) => ({ date: d.date, ganZhi: d.ganZhi, score: d.score, geju: d.gejuDelta || 0 })) };
      }
      case 'analyze_char': { // [loop 495] 测字 via AI chat
        const ch = (a.char || '').trim().slice(0, 4);
        // [loop 558 FIX BUG4] guard ký tự không-Hán — cezi() trả null → trước đây null deref crash.
        if (!ch || !/[一-鿿㐀-䶿]/.test(ch)) return { error: 'Cần đúng 1 chữ Hán (Hán tự) để测字.' };
        const cz = cezi(ch);
        if (!cz) return { error: `Chữ «${ch}» chưa có trong dữ liệu测字 — thử chữ Hán phổ biến khác.` };
        const hexName = cz.hexagram?.name;
        return {
          char: ch,
          radical: cz.radical, strokes: cz.strokes, wx: cz.wx, wxVi: cz.wxVi,
          hexagram: cz.hexagram ? { name: hexName, vi: cz.hexagram.nameVi, meaning: cz.hexagram.meaning } : null,
          // [loop 1292] enrichment: 大象传 + 卦辞 + baseMeaning
          daxiang: DAXIANG[hexName]?.verse || '',
          guaci: GUA_CI[hexName]?.ci || '',
          baseMeaning: cz.baseMeaning || cz.decomposition || '',
          reading: cz.reading || cz.summary || '',
        };
      }
      case 'analyze_gufa': { // [round 31] CO PHAP deep-logic (兰台妙选 nhaps am cach cuc) — AI goi khi hoi ve "co phap/nhaps am/cuu menh/than đau loc"
        const gf = assessGufa(R);
        return {
          verdict: gf.verdict,
          catPatterns: gf.lantai.cat.map(p => ({ id: p.id, name: p.name, vi: p.vi, judgment: p.judgment })),
          hungPatterns: gf.lantai.hung.map(p => ({ vi: p.vi, judgment: p.judgment })),
          shenTouLu: gf.shenTouLu,
          jiuming: { dominantNayinWx: gf.jiuming.dominantNayinWx, dayNayinWx: gf.jiuming.dayNayinWx, nayinWx: gf.jiuming.nayinWx },
          model: gf.model,
        };
      }
      case 'analyze_huangji': { // [round 34] 皇极经世 值年卦 (prophetic/cam ky) — tiên tri nam,邵雍
        const yr = Number(a.year) || _now.getFullYear();
        const hj = assessHuangji(yr);
        return {
          year: hj.year, hexagram: hj.hexagram, vi: hj.vi, meaning: hj.meaning,
          tone: hj.tone, cycleNote: hj.cycleNote, yuanHuiYunShi: hj.yuanHuiYunShi, verdict: hj.verdict,
        };
      }
      case 'analyze_taiyi': { // [round 36] 太乙神数 (quoc van, tam thuc cam ky)
        const yr = Number(a.year) || _now.getFullYear();
        const ty = assessTaiyi(yr);
        return { year: ty.year, taiyiJiNian: ty.taiyiJiNian, yangJu: ty.yangJu, taiyiGong: ty.taiyiGong, zhuKe: ty.zhuKe, secretLayer: ty.secretLayer, verdict: ty.verdict, note: ty.note };
      }
      case 'analyze_chenggu': { // [round 37] 袁天罡称骨算命 (bí truyền)
        const cg = assessChenggu(Number(a.year)||c.input.year, Number(a.month)||c.input.month, Number(a.day)||c.input.day, Number(a.hour)??c.input.hour);
        return { lunar: cg.lunar, boneWeight: cg.boneWeight, tone: cg.tone, verse: cg.verse, viGloss: cg.viGloss, verdict: cg.verdict, note: cg.note };
      }
      case 'analyze_wuyun': { // [round 42] 五运六气 (y-thiên văn cấm kị)
        const yr = Number(a.year) || _now.getFullYear();
        const wl = assessWuyunLiuqi(yr);
        return { year: wl.year, yearGanZhi: wl.yearGanZhi, wuyun: wl.wuyun, liuqi: wl.liuqi, verdict: wl.verdict, note: wl.note };
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
          // [loop 624] 3-layer synthesis — CỔ PHÁP 本卦→互卦→变卦 (đây là kết luận chính)
          processNote: r.processNote, outcomeNote: r.outcomeNote, finalVerdict: r.finalVerdict,
          // [loop 1279] DAXIANG + GUA_CI cho 3 quẻ (本/互/变) — enrichment cổ điển
          benDaxiang: DAXIANG[r.ben?.name]?.verse || '', benGuaci: GUA_CI[r.ben?.name]?.ci || '',
          bianDaxiang: DAXIANG[r.bian?.name]?.verse || '', bianGuaci: GUA_CI[r.bian?.name]?.ci || '',
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
          // [loop 1291] enrichment: sanchuan chi + thập thần (dành cho AI luận sâu hơn)
          sanchuanZhi: (r.sanchuan || []).map((s) => s.zhi || '').filter(Boolean),
          sanchuanRel: (r.sanchuan || []).map((s) => s.rel || '').filter(Boolean),
        };
      }
      case 'analyze_qimen': { // [loop 509] 奇门遁甲
        const n2 = new Date();
        const r = qimenDongPan(a.year ?? n2.getFullYear(), a.month ?? (n2.getMonth() + 1), a.day ?? n2.getDate(), a.hour ?? 12);
        return {
          term: r.term, yuan: r.yuan, ju: r.ju, yinYang: r.yinYang,
          gige: r.gige, catGe: r.catGe, xiongGe: r.xiongGe, advice: r.advice,
          // [loop 1291] enrichment: 三奇六仪 + 格局 ý nghĩa
          sanqi: r.pan?.filter((p) => p.isCat)?.map((p) => `${p.dir}:${p.door}门+${p.qiyi}+${p.star}`) || [],
          // [loop 1313] enrichment: 九星+八门 ý nghĩa sâu cho cung cát
          catStarDesc: r.pan?.filter((p) => p.isCat)?.map((p) => STAR_INFO[p.star]?.desc || '') || [],
          catDoorDesc: r.pan?.filter((p) => p.isCat)?.map((p) => DOOR_INFO[p.door]?.desc || '') || [],
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
        const fmt = (r) => r ? { label: labelResult(r), score: r.score, dung: r.yong || null, pattern: r.pattern, geju: r.gejuQuality, pillars: r.pillars, birth: `${r.y}-${String(r.m).padStart(2,'0')}-${String(r.d).padStart(2,'0')} ${r.g} giờ ${r.shichen}` } : null;
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
        // [loop 647] MARRIAGE TIMING — tìm năm CẢ HAI đương đại vận Cát (cửa sổ cưới tốt).
        //   Cổ法 «婚期看运»: năm cưới nên cả hai đang vận tốt + không冲/phạm năm xấu.
        const _dyAt = (res, yr) => { const dy = (res.dayun || []).find((d) => { const a = yr - res.chart.input.year; return a >= d.startAge && a < d.startAge + 10; }); return dy?.rating || '?'; };
        // [loop 726 FIX] «Bình hòa» cũng OK cho hôn nhân — trước đây yêu cầu CẢ HAI «Cát»
        //   → partner «Bình hòa» (trung tính, KHÔNG xấu) bị loại → 0 năm tốt → note lừa.
        const _isOk = (r) => r === 'Đại cát' || r === 'Cát' || r === 'Hơi thuận' || r === 'Bình hòa';
        const _isCat = (r) => r === 'Đại cát' || r === 'Cát' || r === 'Hơi thuận';
        const curY = new Date().getFullYear();
        const goodYears = [], okYears = [], badYears = [];
        for (let y = curY; y <= curY + 6; y++) {
          const rR = _dyAt(R, y), rP = _dyAt(pR, y);
          if (_isCat(rR) && _isCat(rP)) goodYears.push(`${y}(${rR}/${rP})`);
          else if (_isOk(rR) && _isOk(rP)) okYears.push(`${y}(${rR}/${rP})`); // cả 2 OK (không Hung)
          if (/Hung|nghịch|Kỵ/.test(rR) || /Hung|nghịch|Kỵ/.test(rP)) badYears.push(`${y}(${rR}/${rP})`);
        }
        const marriageTiming = {
          bestYears: goodYears.slice(0, 4),
          okYears: okYears.slice(0, 3),
          avoidYears: badYears.slice(0, 3),
          note: goodYears.length
            ? (h.score >= 45 ? `Nên cưới ${goodYears[0]} (cả 2 đang vận tốt). Cửa sổ cát: ${goodYears.join(', ')}.` : `Dù tương hợp trung bình, nếu cưới hãy chọn ${goodYears.join(', ')} (vận cả 2 tốt bù đắp).`)
            : okYears.length
              ? `6 năm tới không có năm nào CẢ HAI đều «Cát»+, nhưng có năm «Bình hòa» (không Hung): ${okYears.join(', ')}. Nên cưới các năm này — trung tính là ĐỦ tốt cho hôn nhân.`
              : `6 năm tới không có năm nào CẢ HAI đều vận tốt — nếu cưới, chọn năm ít xấu nhất (${badYears[0] || '...'}), kết hợp xem thêm lưu niên + tháng cát.`,
        };
        return { type: 'hôn nhân', score: h.score, rating: h.rating, verdict: _s(h.verdict, 250), factors: (h.factors || []).map((f) => _s(f, 150)), marriageTiming };
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
          // [loop 640] yongNote — surface 调候 override khi có (vd cháu 辛金 nhược nhưng Dụng=Hỏa do hàn thấp).
          //   Trước đây AI thấy «Dụng Hỏa cho Kim nhược» không hiểu sao → có thể phán sai. Nay giải thích rõ.
          yongNote: rel.yong.tiaohou?.override
            ? `⚠ Dụng ${rel.yong.primary} do ĐIỀU HẬU (调候) override Phù Ức — người này sinh tháng hàn/nóng thiên lệch nên ưu tiên điều hòa khí hậu (${rel.yong.tiaohou?.note || ''}). GIẢI THÍCH khi user hỏi «sao Dụng khắc/sinh khác lạ?», KHÔNG phán «Dụng sai».`
            : (rel.yong.tiaohou?.skipReason
              ? `ℹ Dụng ${rel.yong.primary} (Phù Ức) — 调候 行 ${rel.yong.tiaohou?.primaryWx} BỊ BỎ QUA vì ${rel.yong.tiaohou.skipReason}: không ép 官杀 làm Dụng cho DM 无根 (sẽ khắc倒). Giải thích khi user hỏi «sao không lấy hành theo mùa?».`
              : (rel.yong.method && rel.yong.method.some((m) => m.includes('LÀM CHỦ')) ? `Dụng ${rel.yong.primary} theo ${rel.yong.method.filter((m) => m.includes('LÀM CHỦ')).join('; ')}.` : null)),
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
            // [loop 625 FIX] phân loại thế hệ để «khắc» KHÔNG bị phán sai vai trò xã hội.
            //   Trước đây cháu 3 tuổi bị phán «họ áp đặt bạn — cần ranh giới» (sai vai trò).
            const isDescendant = /chau|cháu|con|child|chắt/.test(rel2);
            const isElder = /m[eẽ]|mom|b[oố]|b[oổ]i|dad|cha|ông|bà|cô|dì|chú|bác|ngoại|nội/.test(rel2);
            // Cốt lõi: ngũ hành tương quan — «khắc» được điều chỉnh theo thứ bậc thế hệ
            let core;
            if (relHelpsUser) core = `${rV} = Dụng của bạn → người này MANG HÀNH BỔ MỆNH bạn, tự nhiên tốt`;
            else if (userHelpsRel) core = `${uV} = Dụng của người này → BẠN mang hành bổ họ, bạn tốt cho họ`;
            else if (SHENG[userWx] === relWx) core = `bạn (${uV}) sinh họ (${rV}) → bạn cho đi, họ nhận — quan hệ «phú dưỡng»`;
            else if (SHENG[relWx] === userWx) core = `họ (${rV}) sinh bạn (${uV}) → họ nuôi bạn — quan hệ «Ấn tinh» (hậu thuẫn)`;
            else if (KE[userWx] === relWx) {
              if (isDescendant) core = `bạn (${uV}) khắc họ (${rV}) → ngũ hành «chế», nhưng bạn là bề trên → ĐÓ CHÍNH LÀ QUYỀN dưỡng dục. Đổi «khắc» thành kỷ luật yêu thương, không phải kiểm soát nặng`;
              else if (isElder) core = `bạn (${uV}) khắc họ (${rV}) → ngũ hành «khắc», nhưng họ là bề trên — KHÔNG nên «chế». Kính trọng khác biệt + nhường nhịn, khắc chỉ là khác khí chất`;
              else core = `bạn (${uV}) khắc họ (${rV}) → bạn chế/ap đặt — cần giảm kiểm soát`;
            }
            else if (KE[relWx] === userWx) {
              if (isDescendant) core = `họ (${rV}) khắc bạn (${uV}) → ngũ hành «khắc», nhưng họ là bề dưới (con/cháu) — KHÔNG phải «áp đặt», chỉ là khí chất khác. Bạn là người dẫn dắt, đừng để «khắc» thành cãi vã`;
              else if (isElder) core = `họ (${rV}) khắc bạn (${uV}) → bề trên khí chất «khắc» → hay nghiêm khắc, đặt kỳ vọng cao. Hiểu đó là cách yêu thương kiểu cũ, đừng phản kháng trực diện`;
              else core = `họ (${rV}) khắc bạn (${uV}) → họ áp đặt bạn — cần ranh giới rõ`;
            }
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
          // [loop 618] hour uncertainty warning — KHÔNG để AI luận chắc khi giờ là default
          hourWarning: (a.hour == null) ? '⚠ Giờ sinh dùng mặc định 12:00 (Ngọ). Trụ giờ = ~25% lá số → Dụng/điểm CÓ THỂ SAI. Khuyến nghị: tìm giờ sinh thật, hoặc mở app xem card «Quét 12 Giờ» để biết độ nhạy.' : null,
        };
      }
      case 'analyze_guiguzi': { // [loop 623 FIX] tool từng KHÔNG có case → AI gọi nhận error. Giờ 2 hệ Quỷ Cốc.
        // (1) guiguziFortune: 4-trụ nạp âm → tone + 4 cung luận; (2) guiguziFDG: 分定經 两头钳 → 配卦 + 格诗
        const gf = guiguziFortune(R);
        const fdg = guiguziFDG(R);
        return {
          system1: { // 鬼谷子 4-trụ nạp âm (年命)
            yearJiaZi: gf?.yearJiaZi, nayin: gf?.nayin, nayinVi: gf?.vi,
            tone: gf?.toneVi || gf?.tone, fortune: _s(gf?.fortune || '', 220), career: gf?.career,
            summary4Pillar: _s(gf?.summary || '', 260),
          },
          system2: fdg ? { // 分定經 两头钳 (年干×时干→配卦)
            combo: fdg.combo, gua: fdg.gua, guaVi: fdg.guaVi, guaNature: fdg.guaNature,
            guaMeaning: _s(fdg.guaMeaning || '', 200),
            geMing: fdg.geMing, stars: fdg.stars, starDesc: _s(fdg.starDesc || '', 160),
            shuYun: _s(fdg.shuYun || '', 200), geShi: _s(fdg.geShi || '', 200),
            summary: _s(fdg.summary || '', 240),
            // [loop 1295] enrichment: 大象传 + 卦辞 cho quẻ 分定經 (xử lý phồn→giản)
            daxiang: DAXIANG[fdg.gua]?.verse || DAXIANG[SIMP2TRAD_REV[fdg.gua]]?.verse || '',
            guaci: GUA_CI[fdg.gua]?.ci || GUA_CI[SIMP2TRAD_REV[fdg.gua]]?.ci || '',
          } : '(không đủ dữ liệu trụ giờ)',
          note: 'Quỷ Cốc Tử = hệ cổ phái (鬼谷子). Hệ nạp âm (system1) luận tone cát hung; 分定經 两头钳 (system2) ghép năm×giờ → quẻ + 格诗 luận mệnh.',
        };
      }
      case 'fengshui_direction': { // [loop 638] la bàn 24 sơn — recommend hoặc read 1 hướng
        if (a.mode === 'recommend') {
          const bd = bestDirection(R, a.purpose || 'cuakhach', new Date().getFullYear());
          // [loop 699] enrich best với 八卦 (recommend mode cũng cần罗盘 data)
          let _bestBagua = '';
          try {
            const _SHAN = ['壬','子','癸','丑','艮','寅','甲','卯','乙','辰','巽','巳','丙','午','丁','未','坤','申','庚','酉','辛','戌','乾','亥'];
            const _BG = ['坎','艮','震','巽','离','坤','兑','乾'];
            const _BGV = ['Khảm','Cấn','Chấn','Tốn','Ly','Khôn','Đoài','Càn'];
            const _han = bd.best?.shan?.split(' ')[0] || '';
            const _si = _SHAN.indexOf(_han);
            if (_si >= 0) { const _bi = Math.floor(_si / 3) % 8; _bestBagua = `${_BG[_bi]} (${_BGV[_bi]})`; }
          } catch (_) {}
          return {
            mode: 'recommend', purpose: bd.purposeVi, year: bd.year, idealStars: bd.idealStars,
            best: bd.best ? { shan: bd.best.shan, palace: bd.best.palace8, baziStar: bd.best.baziStar, verdict: bd.best.verdict, dung: bd.best.dung, bagua: _bestBagua } : null,
            top3: bd.top3, worst: bd.worst ? { shan: bd.worst.shan, palace: bd.worst.palace8 } : null,
            summary: bd.summary,
          };
        }
        // mode = read: luận 1 hướng cụ thể
        const rd = compassReading(R, a.direction || '子', new Date().getFullYear());
        if (rd.error) return { error: rd.error };
        // [loop 698] enrich với 八卦 + 二十八宿 + 分金 (罗盘 chuyên nghiệp data)
        let _deg = null, _bagua = '', _xiu = '', _fenjin = '';
        try {
          const _d0 = typeof a.direction === 'number' || /^\d+(\.\d+)?$/.test(a.direction) ? parseFloat(a.direction) : null;
          // [loop 704 FIX] khi direction là tên sơn (vd «艮») → compute degree từ sơn index
          const _SHAN_L = ['壬','子','癸','丑','艮','寅','甲','卯','乙','辰','巽','巳','丙','午','丁','未','坤','申','庚','酉','辛','戌','乾','亥'];
          let _d = _d0;
          if (_d == null && rd.shan) {
            const _si = _SHAN_L.indexOf(rd.shan.split(' ')[0]);
            if (_si >= 0) _d = ((345 + _si * 15) % 360); // center of sơn
          }
          if (_d != null) {
            const _SHAN24_L = ['壬','子','癸','丑','艮','寅','甲','卯','乙','辰','巽','巳','丙','午','丁','未','坤','申','庚','酉','辛','戌','乾','亥'];
            const _BG = ['坎','艮','震','巽','离','坤','兑','乾'];
            const _BGV = ['Khảm','Cấn','Chấn','Tốn','Ly','Khôn','Đoài','Càn'];
            const _X28 = ['角','亢','氐','房','心','尾','箕','斗','牛','女','虚','危','室','壁','奎','娄','胃','昴','毕','觜','参','井','鬼','柳','星','张','翼','轸'];
            const sIdx = _SHAN24_L.indexOf(rd.shan.split(' ')[0]);
            if (sIdx >= 0) {
              const bIdx = Math.floor(sIdx / 3) % 8;
              _bagua = `${_BG[bIdx]} (${_BGV[bIdx]})`;
            }
            const xIdx = Math.floor((_d / (360/28)) + 0.5) % 28;
            _xiu = _X28[xIdx];
            // 分金
            const _GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
            const _ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
            if (sIdx >= 0) {
              const sStart = (337.5 + sIdx * 15) % 360;
              let within = _d - sStart; if (within < 0) within += 360;
              const fenIdx = Math.min(4, Math.floor(within / 3));
              const jiaziIdx = (sIdx * 5 + fenIdx) % 60;
              _fenjin = `${_GAN[jiaziIdx % 10]}${_ZHI[jiaziIdx % 12]} (${fenIdx + 1}/5)`;
            }
            _deg = Math.round(_d);
          }
        } catch (_) {}
        return {
          mode: 'read', shan: rd.shan, palace8: rd.palace8, dirWx: rd.dirWx, year: rd.year,
          baziTrach: rd.baziTrach?.star, verdict: rd.verdict, advice: rd.advice,
          bagua: _bagua, xiu: _xiu, fenjin: _fenjin, degree: _deg,
          layers: (rd.layers || []).slice(0, 5),
          summary: rd.summary,
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
    analyze_relative: 'Phân tích người thân', fengshui_direction: 'La bàn phong thủy',
  })[name] || name;
}

// [loop 919] SECTION RAG — chia brief thành sections, chọn phần liên quan đến câu hỏi
export function _splitBrief(brief) {
  // Chia theo header lines (ALL CAPS hoặc có emoji)
  const lines = brief.split('\n');
  const sections = [];
  let cur = '';
  for (const line of lines) {
    const isHeader = /^[=★⭐⚠💡①②③④⑤🕐📅📊⚖📋🔍🟢🟡🔴🧭💍🔄🔑👪🔮🎯🏥🛡️💋]/.test(line) ||
      /^[A-ZÀ-ỹĐ][A-ZÀ-ỹĐ ]{4,}/.test(line) ||
      /^(== |TÓM TẮT|PHỤC|PHẢN|TAM HÌNH|LỤC HẠI|LỤC XUNG|BÁN HỢP|LỤC HỢP|LỤC THÂN|ĐẠI VẬN|LƯU NIÊN|TỨ TRỤ|NGŨ HÀNH|CÁCH CỤC|DỤNG THẦN|TỔNG LUẬN|THẬP THẦN|THẦN SÁT|HỘI|NẠP ÂM|MỆNH CUNG|TÀI KHỐ|GIA ĐÌNH|THÁI TUẾ|HƯỚNG DẪN|TIỂU HẠN|KHẢO|TỬ VI|河洛|鬼谷|三世|称骨|反吟|LỤC THÂN|SAO HÔN|HOA|源流|调候|进退)/.test(line);
    if (isHeader && cur.trim()) { sections.push(cur); cur = ''; }
    cur += line + '\n';
  }
  if (cur.trim()) sections.push(cur);
  return sections;
}

export function _selectRelevantSections(sections, question) {
  const q = (question || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  // Keyword → section title mapping
  const KW_MAP = [
    { kw: /dung than|dung than|dụng thần|yong/, titles: [/DỤNG/, /Dụng Thần/, /化气/] },
    { kw: /cach cuc|cach cuc|cách cục|格局|geju/, titles: [/CÁCH CỤC/, /格局/, /bại cách/] },
    { kw: /dai van|dai van|đại vận|dayun/, titles: [/ĐẠI VẬN|大运/] },
    { kw: /luu nien|luu nien|lưu niên|năm nay|năm .{4}/, titles: [/LƯU NIÊN/, /THÁI TUẾ/] },
    { kw: /thap than|thap than|thập thần|十神/, titles: [/THẬP THẦN/] },
    { kw: /ngu hanh|ngu hanh|ngũ hành|五行|element/, titles: [/NGŨ HÀNH/] },
    { kw: /tuong tac|xung|hinh|hai|hop|tương tác/, titles: [/HỘI|HỢP|XUNG|HÌNH|HẠI|BÁN HỢP|反吟|TAM HÌNH|LỤC|LỤC HẠI|暗合/] },
    { kw: /than sat|thần sát|sao|shensha/, titles: [/THẦN SÁT|SAO/] },
    { kw: /nap am|nạp âm|nayin/, titles: [/NẠP ÂM|纳音/] },
    { kw: /menh cung|mệnh cung|ming gong|命宫/, titles: [/MỆNH CUNG|命宫/] },
    { kw: /tai kho|tài khố|wealth storage|财库/, titles: [/TÀI KHỐ|财库/] },
    { kw: /gia dinh|gia đình|family|me|bo|em|chau|nguoi than/, titles: [/GIA ĐÌNH|LỤC THÂN/] },
    { kw: /hon nhan|hôn nhân|tinh duyen|vo|chong|đào hoa/, titles: [/HÔN NHÂN|SAO HÔN|LỤC THÂN|ĐÀO HOA/] },
    { kw: /suc khoe|sức khỏe|health|bệnh|benh/, titles: [/SỨC KHỎE|天医|BỆNH/] },
    { kw: /tong luan|tong quan|tổng luận|tổng quan|menh toi|score/, titles: [/TỔNG LUẬN/] },
    { kw: /tu vi|tử vi|ziwei|紫微/, titles: [/TỬ VI|紫微/] },
    { kw: /phong thuy|phong thủy|feng shui|hướng/, titles: [/PHONG THỦY|HƯỚNG/] },
    { kw: /khí hậu|dieu hau|điều hậu|调候/, titles: [/ĐIỀU HẬU|调候/] },
  ];
  // Always-include sections (core)
  const ALWAYS = [/TÓM TẮT|⭐/, /TỨ TRỤ|四柱/, /VƯỢNG SUY/];
  const matched = new Set();
  // Core sections
  for (const re of ALWAYS) {
    for (let i = 0; i < sections.length; i++) {
      if (re.test(sections[i].split('\n')[0]) && !matched.has(i)) matched.add(i);
    }
  }
  // Keyword-matched sections
  for (const { kw, titles } of KW_MAP) {
    if (kw.test(q)) {
      for (const re of titles) {
        for (let i = 0; i < sections.length; i++) {
          if (re.test(sections[i].substring(0, 100)) && !matched.has(i)) matched.add(i);
        }
      }
    }
  }
  // Build result
  const sorted = [...matched].sort((a, b) => a - b);
  const text = sorted.map((i) => sections[i]).join('\n');
  return { text, totalLength: text.length, sectionCount: sorted.length };
}

// [loop 921] ADAPTIVE QUERY ROUTER — nhận diện câu hỏi TỔNG HỢP (cần bức tranh toàn cảnh)
//   thay vì lát cắt. RAG là kiến trúc LỌC → làm HỎNG tổng hợp (cắt mất ngữ cảnh).
//   Câu tổng hợp phải gửi FULL brief + prompt khung 体用应期 (thể→dụng→ứng kỳ).
export function _isSynthesisQuestion(question) {
  const q = (question || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').trim();
  if (!q) return false;
  const SYN = [
    //.request "chốt lại / tóm lại / đúc kết" toàn bộ
    /chot lai|tom lai|tom tat|tong (quan|hop)|toan canh|duc ket|dai cuong|khai quat/,

    //.quỹ đạo / đời / câu chuyện
    /quy (dao|tich)|doi (toi|nay|ca)|cuoc doi|cau chuyen|ke lai (tu|cuoc)|dan dat/,
    //."nhìn thế ai hiểu / tổng tất cả phương pháp"
    /ai ma hieu|hieu duoc|nhin nhu|nhin the|tat ca.*(phuong phap|lai)|the nao (het|ca)/,
    //.bản chất mệnh / tôi là người thế nào
    /ban chat.*(menh|toi)|menh (toi|nay) la|toi la nguoi|loai nguoi/,
    //.English
    /summar|overview|overall|big picture|life trajector|story of.*(life|my)|whole picture|boil down|bottom line|connect the dots|what does it (all )?mean/,
  ];
  if (SYN.some((re) => re.test(q))) return true;
  // câu mở rất chung: "mệnh/lá số này (nói) thế nào / ra sao / luận giúp"
  if (/^(menh|la so|bai tu|tu vi).*(the nao|ra sao|luan g[ii]up)/.test(q)) return true;
  // "luận/xem/phân tích cho tôi cả... / hết... / nhiều năm" (rộng)
  if (/(luan|xem|noi|phan tich).*(cho|giup).*toi.*(ca|het|nhieu nam|ca doi)/.test(q)) return true;
  return false;
}

// [loop 1358 SPEED] câu trivial (greeting/confirm/rất ngắn KHÔNG có topic keyword) →
//   tool-free round 1 → 1 round thay vì 3 (nhanh hơn). CONSERVATIVE → 0 risk chất lượng:
//   chỉ trivial khi ≤3 từ VÀ KHÔNG chứa topic keyword (menh/ngay/nam/cuoi/tai...).
//   Topic keyword dùng \b (word boundary) để tránh false-match như «am» trùng «c-am».
export function _isTrivial(question) {
  const q = (question || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').trim();
  if (!q) return true; // rỗng
  // topic keyword (có thể cần tool/xử lý đầy đủ) → KHÔNG trivial. \b = word boundary.
  if (/\b(menh|dung|ngay|thang|nam|nu|gio|huong|que|cuoi|vo|chong|me|bo|phong|tai|quyen|nghe|hoc|thi|tinh|hon|con|khoe|phuong|dai|luu|thap|than|sinh|khac|van|phuc|dia|khi|ngu)\b/.test(' ' + q + ' ')) return false;
  const words = q.split(/\s+/).filter(Boolean);
  // greeting/confirm/short (≤3 từ) không có topic keyword → trivial (tool-free 1 round)
  if (words.length <= 3) return true;
  return false;
}

// [loop 921] KHUNG TƯ DUY ÔNG THẦY — 体→用→应期 (chuỗi nhân quả cổ pháp)
// Bắt AI tổng hợp theo trục thời gian như một thầy thực chiến, KHÔNG liệt kê số liệu rời.
export const MASTER_SYNTHESIS_GUIDE = `== YÊU CẦU ĐẶC BIỆT: TỔNG HỢP QUỸ ĐẠO ĐỜI (KHÔNG lọc, KHÔNG gọi tool) ==
Đây là câu hỏi TỔNG HỢP — user muốn BỨC TRANH TOÀN CẢNH của cả cuộc đời, không phải 1 lát cắt.
Luận theo CHUỖI NHÂN QUẢ cổ pháp 体→用→应期, nói THẲNG, DẪN DẮT như ông thầy giảng cho người không rành:

① THỂ (体) — BẢN CHẤT MỆNH (mở đầu 1-2 câu chốt, chạm đúng "cốt"):
   Đọc Nhật Chủ + vượng/suy + Cách cục (thường hay đặc biệt 从/专) + Dụng Thần (hành gì, VÌ SAO — Phù Ức/调候/通关/病药).
   → kết: "Mệnh là loại người X, cốt ở hành Y, vì Z."

② DỤNG (用) — XU HƯỚNG 10 NĂM / ĐẠI VẬN (chia đời thành giai đoạn):
   Đọc DANH SÁCH đại vận. Mỗi mảng mang Dụng/Hỷ = ⬆️ THĂNG; mang Kỵ/Thù = ⬇️ TRẦM; trung tính = ➡️.
   → Chia: tuổi nhỏ → thanh niên → trung niên → vãn niên; mảng nào tốt-xấu-bình.

③ ỨNG KỲ (应期) — MỐC THỜI GIAN CỤ THỂ (ghi NĂM cụ thể, ưu tiên năm MẠNH NHẤT):
   2 nguồn ứng kỳ — dùng CẢ HAI, chéo xác nhận:
   (a) Lưu niên mang hành Dụng/Hỷ → ĐỈNH cơ hội; mang Kỵ/Thù → năm CẨN THẬN.
   (b) XUNG/HỢP CHI ứng kỳ — xem trường «XUNG/HỢP CHI ỨNG KỲ» trong brief (sao ẨN trong địa chi bẩm sinh
       bị lưu niên XUNG «mở kho» / HỢP «kéo ra» → phát lực). Phân biệt:
       • Năm ★MởKho bật sao DỤNG (🎉CÁT) + ✦真应期 (đại vận cùng hướng) = cơ hội MẠNH NHẤT → ƯU TIÊN ghi.
       • Năm bật sao KỴ (⚠HUNG) = năm CẨN THẬN (sao xấu bị «mở kho» phát lực) → ghi cảnh báo.
       • Năm ≡TRUNG (Dụng+Kỵ cùng bật) = cơ hội đi kèm rủi ro, luận kép.
   Ghi 2-4 năm nổi bật nhất (kèm lý do «mở kho Dụng/Kỵ + đại vận»), KHÔNG liệt kê rời rạc hết.

④ ĐÚC KẾT — 1 câu chuyện đời mạch lạc (trục thời gian) + 3 lời khuyên HÀNH ĐỘNG theo Dụng Thần (màu/phương/ngành/đối tác/thời điểm).

QUY TẮC SUY: theo thứ tự thời gian, MỞ = bản chất mệnh, GIỮA = thăng trầm theo đại vận, CUỐI = mốc thời gian + khuyên.
DÁM KẾT LUẬN, KHÔNG nói "tùy", KHÔNG liệt kê số liệu rời rạc, KHÔNG "tôi không chắc". Đây là getTotal picture — synopsis cả đời.`;

// [loop 928] FOLLOW-UP SUGGESTIONS — gợi ý câu hỏi kế tiếp theo ngữ cảnh (ông thầy tư vấn).
//   [loop 940] chart-aware: cá nhân hoá theo Dụng Thần + đại vận tới (R tuỳ chọn).
export function suggestFollowups(question, R) {
  const norm = String(question || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  const has = (re) => re.test(norm);
  const _wxVi = { '木': 'Mộc', '火': 'Hỏa', '土': 'Thổ', '金': 'Kim', '水': 'Thủy' };
  const _dung = R && R.yong && R.yong.primary ? (_wxVi[R.yong.primary] || R.yong.primary) : null;
  let _dy = null;
  try {
    if (R && R.dayun && R.dayun.length && R.chart && R.chart.input && R.chart.input.year) {
      const _age = new Date().getFullYear() - R.chart.input.year;
      _dy = R.dayun.find((d) => d.startAge >= _age) || R.dayun[R.dayun.length - 1];
    }
  } catch (_) {}
  const _dyTxt = _dy ? `${_dy.ganZhi}${_dy.rating ? ' (' + _dy.rating + ')' : ''}` : null;
  // [loop 928 fix] check DOMAIN keywords BEFORE thời gian
  if (has(/dung than|yong/)) return [_dyTxt ? `Đại vận ${_dyTxt} có mang Dụng không?` : 'Đại vận nào mang Dụng Thần tới?', 'Năm nay có gặp Dụng không?', _dung ? `Nghề/phương hướng hợp Dụng ${_dung}?` : 'Nghề/phương hướng hợp Dụng?'];
  if (has(/dai van|dayun/)) return [_dyTxt ? `Đại vận ${_dyTxt} tốt hay xấu (chi tiết)?` : 'Đại vận sắp tới tốt hay xấu?', 'Lưu niên nào đỉnh trong đại vận này?', 'Khi nào chuyển vận (giao đại vận)?'];
  if (has(/hon nhan|tinh duyen|vo|chong|dao hoa|cuoi|doi tac|hợp hôn/)) return ['Năm nào nên cưới/thành hôn?', 'Tuổi nào hợp tôi (hợp hôn)?', 'Đào hoa tới khi nào?'];
  if (has(/tai kh|tai loc|tien|kinh doanh|tài lộc|wealth/)) return ['Tài khố tôi có giữ được tiền không?', _dyTxt ? `Đại vận ${_dyTxt} phát tài không?` : 'Đại vận nào phát tài?', 'Nghề kiếm tiền hợp mệnh?'];
  if (has(/nghe|con duong|cong viec|career/)) return [_dung ? `Nghề nào hợp Dụng ${_dung}?` : 'Nghề nào hợp Dụng Thần tôi?', 'Khi nào sự nghiệp bứt phá?', _dyTxt ? `Đại vận ${_dyTxt} thuận nghề?` : 'Đại vận thuận nghề nào?'];
  if (has(/suc khoe|benh|health|bệnh/)) return ['Cẩn thận bệnh gì theo mệnh?', 'Năm/đại vận nào yếu sức?', _dung ? `Cách bồi bổ theo Dụng ${_dung}?` : 'Cách bồi bổ theo Dụng?'];
  if (has(/phong thuy|huong|feng shui/)) return ['Hướng nhà/hướng bàn làm việc hợp?', _dung ? `Màu sắc may mắn (Dụng ${_dung})?` : 'Màu sắc may mắn của tôi?', 'Vật phẩm phong thủy bổ Dụng?'];
  // [loop 1165] cải vận branch — discover clothing/direction/crystal/number
  if (has(/cai van|cai yun|bot xui|may man|cải vận|xui xeo|han lam|gi cai van|lam sao bot xui/)) return [_dung ? `Màu + hướng may mắn (Dụng ${_dung})?` : 'Màu + hướng may mắn?', 'Số điện thoại hợp mệnh?', 'Đá phong thủy hợp mệnh?', 'Đại vận nào thuận để hành sự?'];
  if (has(/tong|quy dao|doi toi|cuoc doi|overview|synthesis|chot/)) return ['Đỉnh cao đời tôi lúc nào?', 'Cẩn thận năm nào nhất?', 'Lời khuyên hành động cho tôi?'];
  if (has(/luu nien|nam nay|2026|2027|2028/)) return ['Tháng nào trong năm tốt nhất?', 'Năm này cẩn thận điều gì?', 'Đại vận đang hành có thuận không?'];
  // [loop 1116] hôm nay/day followups → discover health_today + best_hour + 3-pillar interaction
  if (has(/hom nay|today|gio nao|truc|ngay nao/)) return ['Hôm nay tạng nào yếu, nên dưỡng gì?', 'Giờ nào tốt nhất hôm nay, hướng nào kỵ?', 'Hôm nay xung/hợp trụ nào (日/月/年)?'];
  // [loop 1139] số lý followups — discover evaluate_number (loop 1137)
  if (has(/so dien thoai|bien so|so nha|so ly|so thang|number|chon so/)) return ['Số điện thoại nào hợp mệnh tôi?', 'Biển số xe nào tốt?', 'Màu may mắn + hướng tài của tôi?'];
  // default — khám phá lá số
  return ['Dụng Thần của tôi là gì?', 'Đại vận sắp tới ra sao?', 'Tổng quan quỹ đạo đời tôi?', 'Năm nay có gì đáng chú ý?'];
}


// ===========================================================================
//  4. AGENTIC ASK — streaming + tools + thinking + memory (Z.ai spec)
//  - history: [{role:'user'|'assistant', content}] bộ nhớ hội thoại
//  - onToken(delta, full): stream nội dung; onStatus(text): báo tiến trình tool
// ===========================================================================
export async function askAI(question, R, cfg, { onToken, onStatus, history, signal, style } = {}) {
  cfg = cfg || getConfig();
  // [loop 1354] telemetry — track rounds + total elapsed để log vào admin ai_chat event
  //   (admin thấy: query này mất mấy round? có bị guard cắt ở 60s không?)
  let totalAttempts = 0, _roundsDone = 0;
  const _tStart = Date.now();
  const localFallback = (note, meta) => {
    const block = composeAnswer(question, R);
    const text = `${block.lead}\n\n${block.paragraphs.map((p) => '• ' + p).join('\n')}${note ? '\n\n' + note : ''}`;
    return { source: 'local', text, meta: Object.assign({ rounds: _roundsDone, totalMs: Date.now() - _tStart }, meta || {}) };
  };

  if (!isAIReady(cfg)) {
    return localFallback('Đang dùng bộ luân giải cục bộ. Mở ⚙ Cài đặt để nhận phân tích chuyên sâu hơn.');
  }

  const _td = new Date();
  const _famKey = (R._family || []).map((f) => `${f.role || ''}:${f.date || ''}:${f.time || ''}`).join(',');
  const _ck = `${R.chart.input.year}-${R.chart.input.month}-${R.chart.input.day}-${R.chart.input.hour}-${R.chart.input.minute}-${R.chart.input.gender}-${_td.getFullYear()}-${_td.getMonth()}-${_td.getDate()}-${_famKey}`;
  const _fullBrief = (_briefCache && _briefCache.key === _ck) ? _briefCache.brief : (_briefCache = { key: _ck, brief: buildChartBrief(R) }).brief;

  // [loop 919] SECTION RAG — chia brief thành sections, gửi chỉ phần liên quan
  // [loop 921] ADAPTIVE ROUTING — câu TỔNG HỢP bypass RAG (RAG lọc → mất bức tranh toàn cảnh),
  //   gửi FULL brief + khung 体用应期; câu HẸP → Section RAG (gửi subset liên quan).
  const _isSynthesis = _isSynthesisQuestion(question);
  const _ragSections = _splitBrief(_fullBrief);
  const _relevantSections = _selectRelevantSections(_ragSections, question);
  const brief = _isSynthesis
    ? _fullBrief
    : (_relevantSections.totalLength < _fullBrief.length * 0.6
        ? _relevantSections.text
        : _fullBrief); // nếu >60% liên quan → gửi full (không có lợi cắt)
  // [loop 921] guide theo loại câu: tổng hợp → khung ông thầy 体用应期; hẹp → luật tool đơn giản
  const _guide = _isSynthesis
    ? MASTER_SYNTHESIS_GUIDE
    : '== HƯỚNG DẪN TRẢ LỜI ==\nQUAN TRỌNG: Thông tin lá số ĐÃ CÓ ĐỦ trong context trên. Khi user hỏi về Nhật Chủ, Dụng Thần, Cách Cục, Đại Vận, Lưu Niên, Thập Thần, Ngũ Hành, Tương Tác, Thần Sát, Nạp Âm, Mệnh Cung, Tài Khố... → TRẢ LỜI TRỰC TIẾP từ context, KHÔNG gọi tool. CHỈ gọi tool khi: (1) hỏi NGÀY CỤ THỂ tốt/xấu → find_good_days/best_days_in_year; (2) hỏi VỀ 1 NĂM cụ thể → analyze_year; (3) bói quẻ (梅花/六壬/奇门) → tool tương ứng; (4) hỏi người thân → analyze_relative; (5) hướng/phong thủy → fengshui_direction; (6) giờ tốt hôm nay → analyze_best_hour.';

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'system', content: brief + '\n\n' + _guide + '\n\n' + _ANTI_MANIP_GUIDE },
    { role: 'system', content: (STYLE_DIRECTIVES[style] || STYLE_DIRECTIVES['gan-guoi']) + '\n\n⚠ REMEMBER THIS STYLE WHEN ANSWERING — áp dụng cho Câu trả lời này.' },
    ...((history || []).slice(-8)),
    { role: 'user', content: question },
  ];

  const endpoint = cfg.endpoint.replace(/\/$/, '');
  const url = endpoint.endsWith('/chat/completions') ? endpoint : endpoint + '/chat/completions';
  const headers = { 'Content-Type': 'application/json', ...(cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}) };
  // [loop 1186 FIX] thinking là param BẢN ĐỊA Z.ai/BigModel — KHÔNG gửi cho Cloudflare Workers AI.
  //   api.cloudflare.com không hiểu thinking → 400. Model @cf/zai-org/glm-5.2 chứa chữ «glm» nhưng
  //   chạy qua host CF (proxy /cf-ai) → phải phân biệt theo HOST endpoint, KHÔNG theo tên model.
  const _ep = cfg.endpoint || '';
  const _isCf = /\/cf-ai|cloudflare/i.test(_ep);
  const isZaiNative = !_isCf && !/nvidia/i.test(_ep) && /glm|z\.ai|bigmodel/i.test((cfg.model || '') + _ep); // [loop 1375] nvidia除外 — hosting NVIDIA có thể không chấp nhận param thinking
  const buildBody = (msgs, toolsOn, thinkOn) => ({
    model: cfg.model, messages: msgs, temperature: 0.7, stream: true,
    ...(thinkOn && isZaiNative ? { thinking: { type: 'enabled' } } : {}),  // chỉ host Z.ai/BigModel
    ...(toolsOn ? { tools: AI_TOOLS, tool_choice: 'auto' } : {}),
  });

  // [loop 1358 SPEED] trivial question (greeting/confirm/very-short KHÔNG có keyword tool)
  //   → tool-free ngay round 1 → 1 round thay vì 3. Chẩn đoán: durations 25-73s với 12s/round
  //   cap = multi-round là nguồn chậm. «ok»/«cảm ơn»/«chào thầy» không bao giờ cần tool → 0 risk chất lượng.
  // [loop 1359 SPEED] synthesis cũng tool-free — MASTER_SYNTHESIS_GUIDE đã yêu cầu «KHÔNG gọi tool»
  //   (trả lời từ full brief). Ép tools OFF đảm bảo tuân thủ → 1 round. _isSynthesis đã compute ở trên.
  //   Synthesis đọc từ brief đầy đủ → 0 risk chất lượng.
  let toolsOn = !_isTrivial(question) && !_isSynthesis, thinkOn = true;
  const _roundsDetail = []; // [loop 1358] telemetry: mỗi round làm gì (tool/empty/done)
  // [loop 1353 LATENCY GUARD] admin insight aiLatency: p95=156s, max=156s (count=12).
  //   Root cause: `step=-1; continue` reset vòng lặp mỗi lần tắt tools/thinking → tối đa
  //   18 rounds × 12s/round = 216s. Không có total cap → user chờ 2.6 phút.
  //   Fix: (1) totalAttempts hard cap (không reset khi retry), (2) total elapsed 60s →
  //   fallback êm (giữ content partial nếu có). Bounds worst case ~60s thay vì 216s.
  const _bail = (reason) => {
    const last = [...messages].reverse().find((m) => m.role === 'assistant' && m.content);
    const meta = { rounds: _roundsDone, totalMs: Date.now() - _tStart, bailed: reason };
    if (last && last.content) return { source: 'ai', text: last.content + '\n\n_(' + reason + ')_', meta };
    return localFallback(reason + ' — đã trả lời bằng bộ luân giải cục bộ.', meta);
  };
  try {
    for (let step = 0; step < 6 && totalAttempts < 9; step++, totalAttempts++) {
      if (Date.now() - _tStart > 180000) return _bail('⏱ AI trả lời quá lâu (>3 phút)');
      let round;
      try {
        round = await streamRound(url, headers, buildBody(messages, toolsOn, thinkOn), onToken, onStatus, signal);
      } catch (e) {
        // [loop 1186 FIX] leo thang: tắt tools trước, rồi tắt thinking, rồi bỏ cuộc.
        //   Trước đây chỉ tắt tools → nếu thinking gây lỗi (vd host CF) retry vẫn lỗi → fallback sớm.
        if (e.aiDisabled) throw e; // [admin loop 1351] AI bị admin tắt → KHÔNG retry, fallback local ngay
        if (toolsOn) { toolsOn = false; step = -1; continue; }
        throw e;
      }
      _roundsDone++;
      const { content, toolCalls } = round;

      if (toolCalls && toolCalls.length && toolsOn) {
        _roundsDetail.push('tool:' + toolCalls.map((tc) => tc.name).join(','));
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
        _roundsDetail.push('empty');
        if (toolsOn) { toolsOn = false; step = -1; continue; } // thử lại không tool
        if (thinkOn) { thinkOn = false; step = -1; continue; } // [loop 1186] thử lại không thinking
        throw new Error('Phản hồi rỗng');
      }
      _roundsDetail.push('done');
      return { source: 'ai', text: content, meta: { rounds: _roundsDone, totalMs: Date.now() - _tStart, detail: _roundsDetail, toolsOn0: !_isTrivial(question) } };
    }
    return _bail('AI vượt quá số vòng tối đa');
  } catch (e) {
    // [loop 1389 FIX CRITICAL] chỉ propagate AbortError khi USER cancel (signal.aborted).
    //   System timeout (max-duration 60s, idle 30s, TTFT 25s) = _ac.abort() → KHÔNG phải user
    //   → fallback local, KHÔNG throw. Trước đây catch re-throw CẢ system timeout → AI chết.
    if (e && (e.name === 'AbortError' || /aborted/i.test(e.message || ''))) {
      if (signal && signal.aborted) throw e; // USER cancel → propagate, no fallback
      // system timeout → fallback (KHÔNG throw)
    }
    const isCors = /Failed to fetch|NetworkError|Load failed/i.test(e.message);
    const hint = isCors
      ? `Không gọi được AI — CORS: trình duyệt chặn ${cfg.endpoint}. Mở ⚙ chọn "★ PROXY DEV" (npm run dev) hoặc backend.`
      : `Không gọi được AI: ${e.message}.`;
    return localFallback(hint + ' Hiện trả lời bằng bộ luân giải cục bộ.', { error: String(e.message || e).slice(0, 200) }); // [loop 1374] log error reason
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
      body: JSON.stringify({ model: cfg.model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 100, stream: false }),
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

// [loop 922] reasoning stage label tiếng Việt — progress feedback sạch cho user VN
//   (GLM reasoning là tiếng Trung → không hiện raw, chỉ báo đang ở giai đoạn nào).
function _reasonStageLabel(reasonLen) {
  if (reasonLen < 400) return '💭 đang đọc lá số…';
  if (reasonLen < 1200) return '💭 đang phân tích tứ trụ & vượng suy…';
  if (reasonLen < 2500) return '💭 đang luận Dụng Thần & Cách cục…';
  if (reasonLen < 4500) return '💭 đang xét Đại Vận & Lưu Niên…';
  return '💭 đang tổng hợp câu trả lời…';
}

// ---- 1 vòng streaming SSE: gom content (→ onToken) + tool_calls + bỏ qua reasoning_content ----
// Theo docs Z.ai (interleaved thinking + stream tool call).
async function streamRound(url, headers, body, onToken, onStatus, signal) {
  // [loop 1370] TTFT(25s) + idle(30s) timeout — flat 12s cũ cắt prompt nặng + answer dài giữa dòng.
  //   25s chờ token ĐẦU (brief BaZi nặng cần thời gian xử lý). Chunk đầu → idle 30s/giữa chunk
  //   → answer dài stream hết, stall thì abort → fallback. Fix «signal timed out» câu thật.
  const _ac = new AbortController();
  var _timer = setTimeout(function () { _ac.abort(); }, 45000); // [loop 1394] 45s TTFT — brief 20K tokens
  function _resetIdle() { clearTimeout(_timer); _timer = setTimeout(function () { _ac.abort(); }, 30000); }
  const _sig = signal ? AbortSignal.any([signal, _ac.signal]) : _ac.signal;
  try {
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body), signal: _sig });
  if (res.status === 503) { // [admin loop 1351] AI bị admin tắt → fallback local NGAY (không retry)
    const err = new Error('AI bị tắt bởi quản trị viên (503)');
    err.aiDisabled = true;
    throw err;
  }
  if (!res.ok || !res.body) {
    let t = ''; try { t = await res.text(); } catch (_) {}
    throw new Error('HTTP ' + res.status + (t ? ': ' + t.slice(0, 140) : ''));
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '', full = '';
  const toolCalls = [];
  // [loop 920] reasoning_content preview — tránh UI "đứng" 18-20s khi GLM đang suy nghĩ
  let reasoning = '';
  let lastReasonLen = 0, lastReasonAt = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    _resetIdle(); // chunk tới → reset (TTFT 25s lần đầu → idle 30s sau)
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
      // [loop 920] reasoning_content → hiện preview "đang luận" (throttle) để user biết app chạy
      const rc = delta.reasoning_content || delta.reasoning;
      if (rc) {
        reasoning += rc;
        const now = Date.now();
        // [loop 922] reasoning thường là TIẾNG TRUNG (GLM nghĩ bằng ZH) → KHÔNG hiện raw
        //   (user VN sẽ thấy chữ Hán → tưởng app lỗi ngôn ngữ). Chỉ báo STAGE tiếng Việt
        //   theo độ dài suy luận: progress feedback sạch, không rò rỉ ngôn ngữ nội bộ.
        if (onStatus && (reasoning.length - lastReasonLen > 300 || now - lastReasonAt > 600)) {
          lastReasonLen = reasoning.length; lastReasonAt = now;
          onStatus(_reasonStageLabel(reasoning.length));
        }
      }
      // content (câu trả lời thật) → hiển thị
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
  } finally { clearTimeout(_timer); }
}
